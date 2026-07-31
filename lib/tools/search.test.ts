import { describe, expect, it } from 'vitest'
import { TOOLS } from './registry'
import { SEARCH_INDEX, searchTools } from './search'

describe('search index', () => {
  it('indexes every tool', () => {
    expect(SEARCH_INDEX.length).toBe(TOOLS.length)
  })

  it('builds a valid href for every entry', () => {
    for (const entry of SEARCH_INDEX) {
      expect(entry.href).toMatch(/^\/[a-z]+\/[a-z0-9-]+$/)
    }
  })

  it('lowercases the haystack so matching is case-insensitive', () => {
    for (const entry of SEARCH_INDEX) {
      expect(entry.haystack).toBe(entry.haystack.toLowerCase())
    }
  })
})

describe('searchTools', () => {
  it('returns nothing for an empty query', () => {
    // An empty query must not return the whole catalogue, or the dropdown opens
    // on focus with 15 irrelevant results.
    expect(searchTools('')).toEqual([])
    expect(searchTools('   ')).toEqual([])
  })

  it('finds a tool by an exact name fragment', () => {
    const hits = searchTools('invoice')
    expect(hits.length).toBeGreaterThan(0)
    expect(hits[0]?.slug).toBe('invoice-generator')
  })

  it('finds a tool by its slug', () => {
    const hits = searchTools('json-formatter')
    expect(hits[0]?.slug).toBe('json-formatter')
  })

  it('finds a tool by a keyword rather than its title', () => {
    // "oklch palette" is a registered keyword, not part of the tool's title.
    const hits = searchTools('oklch')
    expect(hits.map((h) => h.slug)).toContain('color-palette-generator')
  })

  it('is case-insensitive', () => {
    expect(searchTools('JSON')[0]?.slug).toBe(searchTools('json')[0]?.slug)
  })

  it('ignores punctuation', () => {
    expect(searchTools('json!!')[0]?.slug).toBe('json-formatter')
  })

  it('uses AND semantics across terms', () => {
    // Both terms must match somewhere. With OR, this would return most of the
    // catalogue and feel broken.
    const nonsense = searchTools('json zzzzqqq')
    expect(nonsense).toEqual([])
  })

  it('ranks a name match above a keyword-only match', () => {
    const hits = searchTools('slogan')
    expect(hits[0]?.slug).toBe('slogan-generator')
  })

  it('respects the limit', () => {
    const hits = searchTools('a', 3)
    expect(hits.length).toBeLessThanOrEqual(3)
  })

  it('returns no results for a query that matches nothing', () => {
    expect(searchTools('zzzzzzqqqqq')).toEqual([])
  })

  it('sorts deterministically', () => {
    const a = searchTools('calculator')
    const b = searchTools('calculator')
    expect(a.map((h) => h.slug)).toEqual(b.map((h) => h.slug))
  })

  it('finds every tool by its own title', () => {
    // A tool that cannot be found by typing its name is unreachable in practice.
    for (const tool of TOOLS) {
      const hits = searchTools(tool.title)
      expect(
        hits.map((h) => h.slug),
        `"${tool.title}" did not find ${tool.slug}`,
      ).toContain(tool.slug)
    }
  })
})
