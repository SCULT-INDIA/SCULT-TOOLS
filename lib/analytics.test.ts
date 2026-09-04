import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  parseParentCtaHref,
  trackCtaClick,
  trackEvent,
  trackToolEvent,
} from './analytics'
import { SITE } from './site'

const BASE = 'https://tools.scult.in/dev/qr-code-generator'

/**
 * What `parentLink('/#book-meeting', 'qr-code-generator')` actually builds —
 * verified against the helper, not guessed. Note the query comes BEFORE the
 * hash: `URL` always serialises in that order regardless of how the path was
 * written, which is what makes the utm params readable via `searchParams` at
 * all. Written the other way round they would be part of the fragment and
 * invisible to both this parser and Google Analytics.
 */
const CTA =
  'https://scult.in/?utm_source=tools.scult.in&utm_medium=tool&utm_campaign=qr-code-generator#book-meeting'

type Win = Window & { dataLayer?: unknown[] }

function win(): Win {
  return window as Win
}

describe('trackEvent', () => {
  beforeEach(() => {
    win().dataLayer = []
  })

  it('queues an Arguments object, NOT an array', () => {
    // The regression this module exists to prevent. gtag.js accepts a plain
    // array, logs it as a "data layer command", and then silently never sends
    // it — verified in GA4 DebugView against production, where the array form
    // produced zero events. Only an Arguments object becomes a GTAG command
    // and is transmitted. The two are indistinguishable in a debugger, which
    // is exactly why this needs an explicit assertion.
    trackEvent('tool_action', { tool_name: 'qr-code-generator', action: 'copy_data' })

    const entry = win().dataLayer?.[0]
    expect(Array.isArray(entry)).toBe(false)
    expect(Object.prototype.toString.call(entry)).toBe('[object Arguments]')
  })

  it('queues the command in gtag argument order', () => {
    trackEvent('search', { search_term: 'invoice' })

    const entry = win().dataLayer?.[0] as IArguments
    expect(entry[0]).toBe('event')
    expect(entry[1]).toBe('search')
    expect(entry[2]).toEqual({ search_term: 'invoice' })
    expect(entry).toHaveLength(3)
  })

  it('still passes a third argument when there are no params', () => {
    // Kept explicit so a future "omit params when empty" optimisation cannot
    // silently change the command's arity, which is the part gtag.js reads.
    trackEvent('bookmark_hint_shown')

    const entry = win().dataLayer?.[0] as IArguments
    expect(entry).toHaveLength(3)
    expect(entry[1]).toBe('bookmark_hint_shown')
    expect(entry[2]).toBeUndefined()
  })

  it('goes through dataLayer.push, so gtag.js processes it once loaded', () => {
    // gtag.js patches `dataLayer.push` to handle commands as they arrive.
    // Pushing through that patched method is the whole mechanism by which an
    // event reaches GA4 after load, so assert we actually call it rather than
    // mutating the array some other way.
    const push = vi.spyOn(win().dataLayer as unknown[], 'push')

    trackEvent('bookmark_hint_shown', { tool_name: 'json-formatter' })

    expect(push).toHaveBeenCalledTimes(1)
    expect(Object.prototype.toString.call(push.mock.calls[0]?.[0])).toBe(
      '[object Arguments]',
    )
    push.mockRestore()
  })

  it('creates dataLayer when the bootstrap script has not run at all', () => {
    // Not just "gtag missing" — the whole array can be absent if a tracking
    // effect beats the inline snippet that normally creates it.
    win().dataLayer = undefined

    trackEvent('page_not_found', { path: '/nope' })

    expect(win().dataLayer).toHaveLength(1)
  })

  it('appends rather than clobbering anything already queued', () => {
    win().dataLayer = ['pre-existing']

    trackEvent('mailto_click', { context: 'footer' })

    expect(win().dataLayer).toHaveLength(2)
    expect(win().dataLayer?.[0]).toBe('pre-existing')
  })

  it('sends tool_name and action through the same path via trackToolEvent', () => {
    trackToolEvent('invoice-generator', 'download_pdf', { currency: 'INR' })

    const entry = win().dataLayer?.[0] as IArguments
    expect(entry[1]).toBe('tool_action')
    expect(entry[2]).toEqual({
      tool_name: 'invoice-generator',
      action: 'download_pdf',
      currency: 'INR',
    })
  })
})

describe('parseParentCtaHref', () => {
  it('recognises a link built by parentLink and pulls out the campaign', () => {
    const result = parseParentCtaHref(CTA, BASE)
    expect(result).not.toBeNull()
    expect(result?.campaign).toBe('qr-code-generator')
  })

  it('reports destination as path + hash, without the utm query', () => {
    // Grouping matters: with the query left in, every campaign would look like
    // a different destination and "how many people reached /#book-meeting"
    // could not be answered at all.
    const result = parseParentCtaHref(
      'https://scult.in/services/seo?utm_source=tools.scult.in&utm_medium=tool&utm_campaign=footer-service-seo',
      BASE,
    )
    expect(result?.destination).toBe('/services/seo')
    expect(result?.destination).not.toContain('utm_')
  })

  it('keeps the hash, which is what distinguishes a booking link from the homepage', () => {
    expect(parseParentCtaHref(CTA, BASE)?.destination).toBe('/#book-meeting')
  })

  it('ignores a plain prose link to the parent site that carries no utm_source', () => {
    // The privacy and pricing pages link to scult.in in running text. Those are
    // references, not CTAs, and counting them would inflate conversions.
    expect(parseParentCtaHref('https://scult.in/', BASE)).toBeNull()
  })

  it('ignores a parent link whose utm_source is some other property', () => {
    expect(
      parseParentCtaHref(
        'https://scult.in/?utm_source=newsletter&utm_medium=email&utm_campaign=x',
        BASE,
      ),
    ).toBeNull()
  })

  it('ignores links to other hosts even when they carry our utm_source', () => {
    expect(
      parseParentCtaHref('https://github.com/?utm_source=tools.scult.in', BASE),
    ).toBeNull()
  })

  it('ignores internal links', () => {
    expect(parseParentCtaHref('/seo/utm-builder', BASE)).toBeNull()
    expect(parseParentCtaHref('https://tools.scult.in/all', BASE)).toBeNull()
  })

  it('treats a subdomain of the parent as a different host', () => {
    // tools.scult.in is itself a subdomain of scult.in — a host comparison
    // done by suffix rather than equality would match our own pages.
    expect(
      parseParentCtaHref('https://blog.scult.in/?utm_source=tools.scult.in', BASE),
    ).toBeNull()
  })

  it('falls back to "unknown" rather than dropping a CTA with no campaign', () => {
    // A hand-written link that forgot utm_campaign is still a conversion click;
    // losing it entirely would be worse than logging it unlabelled.
    const result = parseParentCtaHref(
      'https://scult.in/?utm_source=tools.scult.in&utm_medium=tool#book-meeting',
      BASE,
    )
    expect(result?.campaign).toBe('unknown')
  })

  it('resolves protocol-relative and relative-to-parent forms consistently', () => {
    expect(
      parseParentCtaHref('//scult.in/?utm_source=tools.scult.in&utm_campaign=hub', BASE)
        ?.campaign,
    ).toBe('hub')
  })

  it('returns null instead of throwing on hrefs that are not URLs', () => {
    // This runs inside a click handler on every click on the site. It throwing
    // would break navigation, which is a far worse failure than losing a stat.
    expect(parseParentCtaHref('#', BASE)).toBeNull()
    expect(parseParentCtaHref('', BASE)).toBeNull()
    expect(parseParentCtaHref('mailto:connect@scult.in', BASE)).toBeNull()
    expect(parseParentCtaHref('javascript:void(0)', BASE)).toBeNull()
    expect(parseParentCtaHref('http://', BASE)).toBeNull()
  })

  it('is unaffected by the order of the utm parameters', () => {
    expect(
      parseParentCtaHref(
        'https://scult.in/?utm_campaign=pricing&utm_medium=tool&utm_source=tools.scult.in#book-meeting',
        BASE,
      )?.campaign,
    ).toBe('pricing')
  })
})

type OaiqWin = Window & {
  oaiq?: { (...args: unknown[]): void; q?: unknown[] }
  dataLayer?: unknown[]
}

function oaiqWin(): OaiqWin {
  return window as OaiqWin
}

describe('trackCtaClick — OpenAI Ads conversion mirror', () => {
  // SITE is a plain object, not frozen at runtime (only `as const` at the
  // type level), so tests can flip the pixel id the same way production
  // flips it via the env var — on, then always restored to unset.
  const original = SITE.openaiAdsPixelId

  beforeEach(() => {
    ;(SITE as { openaiAdsPixelId: string }).openaiAdsPixelId = 'test-pixel-id'
    delete oaiqWin().oaiq
    oaiqWin().dataLayer = []
  })

  afterEach(() => {
    ;(SITE as { openaiAdsPixelId: string }).openaiAdsPixelId = original
    delete oaiqWin().oaiq
  })

  it('reports a lead conversion when the destination is the booking CTA', () => {
    trackCtaClick('qr-code-generator', { destination: '/#book-meeting' })

    const queue = oaiqWin().oaiq?.q
    expect(queue).toHaveLength(2) // init, then measure
    const [initCall, measureCall] = queue as IArguments[]
    expect(initCall?.[0]).toBe('init')
    expect(initCall?.[1]).toEqual({ pixelId: 'test-pixel-id' })
    expect(measureCall?.[0]).toBe('measure')
    expect(measureCall?.[1]).toBe('lead')
  })

  it('does not report a conversion for a non-booking parentLink click', () => {
    // Plain navigation to the parent homepage, or a footer service link —
    // real trackCtaClick calls that are not the actual conversion action.
    trackCtaClick('brand', { destination: '/' })

    expect(oaiqWin().oaiq).toBeUndefined()
  })

  it('stays a no-op with no pixel id configured (dev/preview)', () => {
    ;(SITE as { openaiAdsPixelId: string }).openaiAdsPixelId = ''

    trackCtaClick('qr-code-generator', { destination: '/#book-meeting' })

    expect(oaiqWin().oaiq).toBeUndefined()
  })
})
