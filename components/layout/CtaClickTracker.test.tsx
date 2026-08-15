import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { CtaClickTracker } from './CtaClickTracker'

/** As built by `parentLink('/#book-meeting', 'qr-code-generator')`. */
const CTA =
  'https://scult.in/?utm_source=tools.scult.in&utm_medium=tool&utm_campaign=qr-code-generator#book-meeting'

type DataLayerEntry = ['event', string, Record<string, unknown>?]

function dataLayer(): DataLayerEntry[] {
  return (window as Window & { dataLayer?: DataLayerEntry[] }).dataLayer ?? []
}

function ctaEvents(): DataLayerEntry[] {
  return dataLayer().filter((entry) => entry[1] === 'cta_click')
}

describe('CtaClickTracker', () => {
  beforeEach(() => {
    ;(window as Window & { dataLayer?: unknown[] }).dataLayer = []
  })

  it('fires cta_click when a conversion link is clicked', () => {
    render(
      <>
        <CtaClickTracker />
        {/* preventDefault only stops jsdom's unimplemented-navigation
            warning — the href itself is a real one. */}
        <a href={CTA} onClick={(e) => e.preventDefault()}>
          Book a meeting
        </a>
      </>,
    )

    fireEvent.click(screen.getByText('Book a meeting'))

    expect(ctaEvents()).toHaveLength(1)
    expect(ctaEvents()[0]?.[2]).toMatchObject({
      cta_location: 'qr-code-generator',
      destination: '/#book-meeting',
    })
  })

  it('fires when the click lands on a child node, not the anchor itself', () => {
    // The real CTAs wrap icons and spans, so this is the normal case, not an
    // edge case — if `closest` were dropped, nearly every real click would be
    // missed while this suite's simpler test still passed.
    render(
      <>
        <CtaClickTracker />
        <a href={CTA} onClick={(e) => e.preventDefault()}>
          <span>
            <strong>Talk to the team</strong>
          </span>
        </a>
      </>,
    )

    fireEvent.click(screen.getByText('Talk to the team'))

    expect(ctaEvents()).toHaveLength(1)
  })

  it('records which page the click came from', () => {
    render(
      <>
        <CtaClickTracker />
        <a href={CTA} onClick={(e) => e.preventDefault()}>
          Book
        </a>
      </>,
    )

    fireEvent.click(screen.getByText('Book'))

    expect(ctaEvents()[0]?.[2]).toHaveProperty('from_path', window.location.pathname)
  })

  it('ignores links that are not conversion links', () => {
    render(
      <>
        <CtaClickTracker />
        <a href="https://github.com/Pranjulrathour" onClick={(e) => e.preventDefault()}>
          GitHub
        </a>
        <a href="https://scult.in/" onClick={(e) => e.preventDefault()}>
          plain prose link
        </a>
        <a href="/seo/utm-builder" onClick={(e) => e.preventDefault()}>
          internal
        </a>
      </>,
    )

    fireEvent.click(screen.getByText('GitHub'))
    fireEvent.click(screen.getByText('plain prose link'))
    fireEvent.click(screen.getByText('internal'))

    expect(ctaEvents()).toHaveLength(0)
  })

  it('does not fire on clicks that hit no anchor at all', () => {
    render(
      <>
        <CtaClickTracker />
        <button type="button">Copy</button>
      </>,
    )

    fireEvent.click(screen.getByText('Copy'))

    expect(ctaEvents()).toHaveLength(0)
  })

  it('stops listening once unmounted', () => {
    const { unmount } = render(
      <>
        <CtaClickTracker />
        <a href={CTA} onClick={(e) => e.preventDefault()}>
          Book
        </a>
      </>,
    )
    const link = screen.getByText('Book')

    unmount()
    document.body.appendChild(link)
    // React's synthetic onClick went with the unmount, so this needs a native
    // one — without it jsdom tries the real navigation and logs a warning.
    link.addEventListener('click', (e) => e.preventDefault())
    fireEvent.click(link)

    expect(ctaEvents()).toHaveLength(0)
  })
})
