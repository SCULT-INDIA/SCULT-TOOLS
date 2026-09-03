import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PROMPTS } from '@/lib/prompts/registry'
import { SITE } from '@/lib/site'
import { TOOLS } from '@/lib/tools/registry'
import { Hero } from './Hero'

// The hero's only client-side/asset-bearing children. Stubbed so this test
// exercises the hero's own markup, not the search index loader or next/image.
vi.mock('@/components/layout/SearchBox', () => ({
  SearchBox: () => <div data-testid="searchbox" />,
}))
vi.mock('@/components/ui/UneedBadge', () => ({
  UneedBadge: () => <span data-testid="uneed" />,
}))
vi.mock('@/components/ui/SaashubBadge', () => ({
  SaashubBadge: () => <span data-testid="saashub" />,
}))

describe('Hero', () => {
  it('renders the h1 as exactly SITE.tagline', () => {
    render(<Hero />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent?.replace(/\s+/g, ' ').trim()).toBe(SITE.tagline)
  })

  it('keeps both primary CTAs pointing at their real destinations', () => {
    render(<Hero />)
    expect(
      screen.getByRole('link', { name: `EXPLORE ALL ${TOOLS.length} TOOLS` }),
    ).toHaveAttribute('href', '/all')
    expect(screen.getByRole('link', { name: 'CHECK AI VISIBILITY' })).toHaveAttribute(
      'href',
      '/geo/ai-visibility-checker',
    )
  })

  it('states registry-derived counts in the eyebrow pill', () => {
    render(<Hero />)
    const pill = screen.getByText(/tools ·/)
    expect(pill.textContent).toContain(`${TOOLS.length} tools`)
    expect(pill.textContent).toContain(
      `${PROMPTS.length.toLocaleString('en-US')} prompts`,
    )
  })
})
