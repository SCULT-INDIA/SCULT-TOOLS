import { describe, expect, it } from 'vitest'
import { parseParentCtaHref } from './analytics'

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
