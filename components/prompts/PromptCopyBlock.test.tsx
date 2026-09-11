import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { PromptCopyBlock } from './PromptCopyBlock'

/**
 * The WhatsApp/Telegram share row — the Photo Trends category's whole growth
 * mechanic, per its own build docs: someone pastes a prompt into a family
 * WhatsApp group, and the LINK in that message is what brings the group back
 * to the site. A share that carries only the prompt text leaks all of its
 * traffic, so what these tests actually guard is that the page URL is always
 * in the shared text, not just that a share button exists.
 */

type DataLayerEntry = ['event', string, Record<string, unknown>?]

function dataLayer(): DataLayerEntry[] {
  return (window as Window & { dataLayer?: DataLayerEntry[] }).dataLayer ?? []
}

function promptEvents(action: string): DataLayerEntry[] {
  return dataLayer().filter(
    (entry) => entry[1] === 'prompt_action' && entry[2]?.action === action,
  )
}

describe('PromptCopyBlock share row', () => {
  beforeEach(() => {
    ;(window as Window & { dataLayer?: unknown[] }).dataLayer = []
  })

  it('builds the WhatsApp link from the real page URL, not a relative or made-up one', () => {
    render(
      <PromptCopyBlock
        category="photo-trends"
        promptSlug="photo-trends-80s-angry-young-man-studio"
        promptText="Use my uploaded photo. Keep my face exactly as it is."
        variables={[]}
      />,
    )
    const whatsapp = screen.getByLabelText('Share this prompt on WhatsApp')
    const href = whatsapp.getAttribute('href') ?? ''
    expect(href.startsWith('https://wa.me/?text=')).toBe(true)
    const text = decodeURIComponent(href.replace('https://wa.me/?text=', ''))
    expect(text).toContain('Use my uploaded photo. Keep my face exactly as it is.')
    expect(text).toContain(
      'https://tools.scult.in/prompts/photo-trends/photo-trends-80s-angry-young-man-studio',
    )
  })

  it('builds the Telegram link with the URL and prompt as separate parameters', () => {
    render(
      <PromptCopyBlock
        category="photo-trends"
        promptSlug="photo-trends-80s-angry-young-man-studio"
        promptText="Use my uploaded photo. Keep my face exactly as it is."
        variables={[]}
      />,
    )
    const telegram = screen.getByLabelText('Share this prompt on Telegram')
    const href = telegram.getAttribute('href') ?? ''
    expect(href.startsWith('https://t.me/share/url?url=')).toBe(true)
    expect(href).toContain(
      encodeURIComponent(
        'https://tools.scult.in/prompts/photo-trends/photo-trends-80s-angry-young-man-studio',
      ),
    )
    expect(href).toContain(
      `text=${encodeURIComponent('Use my uploaded photo. Keep my face exactly as it is.')}`,
    )
  })

  it('shares the CURRENT filled-in text for a prompt with variables, not the raw template', () => {
    render(
      <PromptCopyBlock
        category="chatgpt"
        promptSlug="some-prompt"
        promptText="Write a {{tone}} email about {{topic}}."
        variables={[
          { name: 'tone', description: 'Tone', example: 'friendly', required: true },
          {
            name: 'topic',
            description: 'Topic',
            example: 'the Q3 launch',
            required: true,
          },
        ]}
      />,
    )
    const whatsapp = screen.getByLabelText('Share this prompt on WhatsApp')
    const text = decodeURIComponent(
      (whatsapp.getAttribute('href') ?? '').replace('https://wa.me/?text=', ''),
    )
    expect(text).toContain('Write a friendly email about the Q3 launch.')
    expect(text).not.toContain('{{tone}}')
  })

  it('opens both share links in a new tab without leaking a referrer', () => {
    render(
      <PromptCopyBlock
        category="photo-trends"
        promptSlug="p"
        promptText="text"
        variables={[]}
      />,
    )
    for (const label of [
      'Share this prompt on WhatsApp',
      'Share this prompt on Telegram',
    ]) {
      const link = screen.getByLabelText(label)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    }
  })

  it('tracks each share under prompt_action, distinctly from copy_prompt', () => {
    render(
      <PromptCopyBlock
        category="photo-trends"
        promptSlug="photo-trends-80s-angry-young-man-studio"
        promptText="text"
        variables={[]}
      />,
    )

    fireEvent.click(screen.getByLabelText('Share this prompt on WhatsApp'))
    fireEvent.click(screen.getByLabelText('Share this prompt on Telegram'))

    expect(promptEvents('share_whatsapp')).toHaveLength(1)
    expect(promptEvents('share_telegram')).toHaveLength(1)
    expect(promptEvents('share_whatsapp')[0]?.[2]).toMatchObject({
      category: 'photo-trends',
      prompt: 'photo-trends-80s-angry-young-man-studio',
    })
    // Distinct from the existing copy event, per lib/analytics.ts's
    // one-event-name-plus-an-action-param convention — GA4/Studio tell
    // "shared" and "copied" apart by this action value, not by event name.
    expect(promptEvents('copy_prompt')).toHaveLength(0)
  })
})
