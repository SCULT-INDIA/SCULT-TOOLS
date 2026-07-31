import { describe, expect, it } from 'vitest'
import { buildUtmUrl, normalizeUtmValue, parseUtmPrefs } from './logic'

const BASE = {
  source: 'newsletter',
  medium: 'email',
  campaign: 'spring-sale',
} as const

describe('buildUtmUrl — appending parameters', () => {
  it('appends the three required parameters to a bare URL', () => {
    const r = buildUtmUrl({ url: 'https://example.com/pricing', ...BASE })
    expect(r.error).toBeUndefined()
    expect(r.url).toBe(
      'https://example.com/pricing?utm_source=newsletter&utm_medium=email&utm_campaign=spring-sale',
    )
  })

  it('preserves an existing query string instead of adding a second ?', () => {
    const r = buildUtmUrl({ url: 'https://example.com/p?a=b', ...BASE })
    expect(r.url).toContain('?a=b&utm_source=newsletter')
    expect(r.url.match(/\?/g)).toHaveLength(1)
  })

  it('keeps a #fragment at the end, with the parameters before it', () => {
    const r = buildUtmUrl({ url: 'https://example.com/p#features', ...BASE })
    expect(r.url).toBe(
      'https://example.com/p?utm_source=newsletter&utm_medium=email&utm_campaign=spring-sale#features',
    )
    // The fragment must not absorb the query — that is what naive `url + '?...'`
    // concatenation does, and GA4 then sees no parameters at all.
    expect(r.url.indexOf('utm_source')).toBeLessThan(r.url.indexOf('#features'))
  })

  it('preserves both an existing query string and a fragment together', () => {
    const r = buildUtmUrl({ url: 'https://example.com/p?a=b#top', ...BASE })
    expect(r.url).toBe(
      'https://example.com/p?a=b&utm_source=newsletter&utm_medium=email&utm_campaign=spring-sale#top',
    )
  })

  it('omits empty optional parameters entirely', () => {
    const r = buildUtmUrl({
      url: 'https://example.com',
      ...BASE,
      term: '',
      content: '  ',
    })
    expect(r.url).not.toContain('utm_term')
    expect(r.url).not.toContain('utm_content')
    expect(r.url.endsWith('&')).toBe(false)
    expect(r.params.map((p) => p.param)).toEqual([
      'utm_source',
      'utm_medium',
      'utm_campaign',
    ])
  })

  it('includes term and content when they are filled in', () => {
    const r = buildUtmUrl({
      url: 'https://example.com',
      ...BASE,
      term: 'crm software',
      content: 'hero-cta',
    })
    expect(r.url).toContain('utm_term=crm-software')
    expect(r.url).toContain('utm_content=hero-cta')
  })

  it('percent-encodes a value so it cannot inject an extra parameter', () => {
    const r = buildUtmUrl({
      url: 'https://example.com',
      ...BASE,
      campaign: 'sale&admin=1',
      lowercase: false,
    })
    expect(r.url).toContain('utm_campaign=sale%26admin%3D1')
    expect(r.url).not.toContain('&admin=1')
  })

  it('replaces UTM parameters the destination already carried, and says so', () => {
    const r = buildUtmUrl({ url: 'https://example.com/?utm_source=old', ...BASE })
    expect(r.url).toContain('utm_source=newsletter')
    expect(r.url).not.toContain('old')
    expect(r.warnings.join(' ')).toContain('already had UTM parameters')
  })
})

describe('buildUtmUrl — the lowercase convention', () => {
  it("turns 'Spring Sale' into 'spring-sale'", () => {
    const r = buildUtmUrl({
      url: 'https://example.com',
      ...BASE,
      campaign: 'Spring Sale',
    })
    expect(r.url).toContain('utm_campaign=spring-sale')
    expect(r.params).toContainEqual({ param: 'utm_campaign', value: 'spring-sale' })
  })

  it('leaves the value as typed when the flag is off', () => {
    const r = buildUtmUrl({
      url: 'https://example.com',
      ...BASE,
      campaign: 'Spring Sale',
      lowercase: false,
    })
    // A literal space is encoded as + inside a query string.
    expect(r.url).toContain('utm_campaign=Spring+Sale')
  })

  it('defaults to lowercasing when the flag is not passed at all', () => {
    const r = buildUtmUrl({ url: 'https://example.com', ...BASE, source: 'MailChimp' })
    expect(r.url).toContain('utm_source=mailchimp')
  })
})

describe('normalizeUtmValue', () => {
  it('collapses whitespace runs and repeated hyphens into one hyphen', () => {
    expect(normalizeUtmValue('  Spring   Sale--2026 ', true)).toBe('spring-sale-2026')
  })

  it('strips leading and trailing hyphens', () => {
    expect(normalizeUtmValue('-spring-sale-', true)).toBe('spring-sale')
  })

  it('keeps underscores, because paid_social is an established value', () => {
    expect(normalizeUtmValue('Paid_Social', true)).toBe('paid_social')
  })

  it('only trims when the flag is off', () => {
    expect(normalizeUtmValue('  Spring Sale  ', false)).toBe('Spring Sale')
  })
})

describe('buildUtmUrl — warnings', () => {
  it('warns and assumes https when the URL has no protocol', () => {
    const r = buildUtmUrl({ url: 'example.com/pricing', ...BASE })
    expect(r.error).toBeUndefined()
    expect(r.url.startsWith('https://example.com/pricing?')).toBe(true)
    expect(r.warnings.join(' ')).toContain('https://')
  })

  it('does not warn about the protocol when one is present', () => {
    const r = buildUtmUrl({ url: 'http://example.com', ...BASE })
    expect(r.warnings).toHaveLength(0)
    expect(r.url.startsWith('http://')).toBe(true)
  })

  it('names each missing required parameter', () => {
    const r = buildUtmUrl({ url: 'https://example.com', source: 'newsletter' })
    const text = r.warnings.join(' ')
    expect(text).toContain('utm_medium')
    expect(text).toContain('utm_campaign')
    expect(text).not.toContain('utm_source')
  })

  it('does not treat a missing optional parameter as a problem', () => {
    const r = buildUtmUrl({ url: 'https://example.com', ...BASE })
    expect(r.warnings.join(' ')).not.toContain('utm_term')
  })

  it('warns about spaces or capitals only while lowercase is off', () => {
    const messy = { url: 'https://example.com', ...BASE, campaign: 'Spring Sale' }
    expect(buildUtmUrl({ ...messy, lowercase: false }).warnings.join(' ')).toContain(
      'case-sensitive',
    )
    expect(buildUtmUrl({ ...messy, lowercase: true }).warnings.join(' ')).not.toContain(
      'case-sensitive',
    )
  })
})

describe('buildUtmUrl — invalid input never throws', () => {
  it('reports an unparseable URL as an error', () => {
    const r = buildUtmUrl({ url: 'not a url', ...BASE })
    expect(r.error).toBeDefined()
    expect(r.url).toBe('')
    expect(r.params).toHaveLength(0)
  })

  it('reports a scheme with no host as an error', () => {
    expect(buildUtmUrl({ url: 'https://', ...BASE }).error).toBeDefined()
  })

  it('reports an empty URL as an error rather than building nothing silently', () => {
    const r = buildUtmUrl({ url: '   ', ...BASE })
    expect(r.error).toBeDefined()
    expect(r.url).toBe('')
  })

  it('refuses a non-http scheme', () => {
    const r = buildUtmUrl({ url: 'javascript://x/%0aalert(1)', ...BASE })
    expect(r.error).toContain('http')
    expect(r.url).toBe('')
  })

  it('refuses a URL carrying credentials', () => {
    const r = buildUtmUrl({ url: 'https://user:pass@example.com/p', ...BASE })
    expect(r.error).toBeDefined()
    expect(r.url).toBe('')
  })

  it('rejects an absurdly long URL instead of returning something untaggable', () => {
    const r = buildUtmUrl({ url: `https://example.com/${'a'.repeat(2100)}`, ...BASE })
    expect(r.error).toBeDefined()
  })

  it('builds nothing but errors, never throws, on every partial URL prefix', () => {
    for (const prefix of ['h', 'ht', 'htt', 'http', 'https', 'https:', 'https:/']) {
      expect(() => buildUtmUrl({ url: prefix, ...BASE })).not.toThrow()
    }
  })
})

describe('parseUtmPrefs', () => {
  it('accepts a well-formed preset', () => {
    expect(
      parseUtmPrefs({ source: 'newsletter', medium: 'email', lowercase: false }),
    ).toEqual({ source: 'newsletter', medium: 'email', lowercase: false })
  })

  it('rejects wrong shapes and types without throwing', () => {
    expect(parseUtmPrefs(null)).toBeUndefined()
    expect(parseUtmPrefs('newsletter')).toBeUndefined()
    expect(parseUtmPrefs({ source: 'a', medium: 'b' })).toBeUndefined()
    expect(parseUtmPrefs({ source: 1, medium: 'b', lowercase: true })).toBeUndefined()
    expect(
      parseUtmPrefs({ source: 'a'.repeat(300), medium: 'b', lowercase: true }),
    ).toBeUndefined()
  })
})
