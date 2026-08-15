import { describe, expect, it } from 'vitest'
import { getPromptCountByCategory, PROMPT_CATEGORIES, PROMPTS } from './prompts/registry'
import { PROMPT_COUNT, SEARCH_INDEX, searchSite, TOOL_COUNT } from './search'
import { TOOLS } from './tools/registry'

describe('search index', () => {
  it('indexes every tool', () => {
    expect(SEARCH_INDEX.filter((e) => e.kind === 'tool').length).toBe(TOOLS.length)
    expect(TOOL_COUNT).toBe(TOOLS.length)
  })

  it('indexes every individual prompt', () => {
    expect(SEARCH_INDEX.filter((e) => e.kind === 'prompt').length).toBe(PROMPTS.length)
    expect(PROMPT_COUNT).toBe(PROMPTS.length)
  })

  it('indexes exactly the prompt categories that have content', () => {
    const indexed = SEARCH_INDEX.filter((e) => e.kind === 'prompt-category')
      .map((e) => e.slug)
      .sort()
    const withContent = PROMPT_CATEGORIES.filter(
      (c) => getPromptCountByCategory(c.slug) > 0,
    )
      .map((c) => c.slug)
      .sort()
    expect(indexed).toEqual(withContent)
  })

  it('builds a valid href for every entry', () => {
    for (const entry of SEARCH_INDEX) {
      if (entry.kind === 'tool') {
        expect(entry.href).toMatch(/^\/[a-z]+\/[a-z0-9-]+$/)
      } else if (entry.kind === 'prompt-category') {
        expect(entry.href).toMatch(/^\/prompts\/[a-z0-9-]+$/)
      } else {
        expect(entry.href).toMatch(/^\/prompts\/[a-z0-9-]+\/[a-z0-9-]+$/)
      }
    }
  })

  it('routes each prompt to its own category page', () => {
    const first = PROMPTS[0]
    const entry = SEARCH_INDEX.find((e) => e.kind === 'prompt' && e.slug === first?.slug)
    expect(entry?.href).toBe(`/prompts/${first?.category}/${first?.slug}`)
  })

  it('lowercases the haystack so matching is case-insensitive', () => {
    for (const entry of SEARCH_INDEX) {
      expect(entry.haystack).toBe(entry.haystack.toLowerCase())
    }
  })
})

describe('searchSite', () => {
  it('returns nothing for an empty query', () => {
    // An empty query must not return the whole catalogue, or the dropdown opens
    // on focus with hundreds of irrelevant results.
    expect(searchSite('')).toEqual([])
    expect(searchSite('   ')).toEqual([])
  })

  it('finds a tool by an exact name fragment', () => {
    const hits = searchSite('invoice')
    expect(hits.length).toBeGreaterThan(0)
    expect(hits[0]?.slug).toBe('invoice-generator')
  })

  it('finds a tool by its slug', () => {
    const hits = searchSite('json-formatter')
    expect(hits[0]?.slug).toBe('json-formatter')
  })

  it('finds a tool by a keyword rather than its title', () => {
    // "oklch palette" is a registered keyword, not part of the tool's title.
    const hits = searchSite('oklch')
    expect(hits.map((h) => h.slug)).toContain('color-palette-generator')
  })

  it('finds a prompt category by name', () => {
    const hits = searchSite('chatgpt prompts')
    const category = hits.find((h) => h.kind === 'prompt-category')
    expect(category?.href).toBe('/prompts/chatgpt')
  })

  it('finds a prompt category by its bare tool name', () => {
    const hits = searchSite('cursor')
    expect(hits.map((h) => h.href)).toContain('/prompts/cursor')
  })

  it('lists all tool hits before any prompt hit', () => {
    // The SearchBox renders "Tools" / "Prompts" group headers straight off
    // this order, so a prompt sorted between two tools would corrupt the
    // aria-activedescendant index mapping.
    for (const query of ['email', 'generator', 'seo', 'a']) {
      const hits = searchSite(query)
      const firstPrompt = hits.findIndex((h) => h.kind !== 'tool')
      if (firstPrompt === -1) continue
      for (const hit of hits.slice(firstPrompt)) {
        expect(hit.kind, `tool after prompt for "${query}"`).not.toBe('tool')
      }
    }
  })

  it('still returns tools when prompts also match', () => {
    // "email" matches the Email Signature Generator AND the email-marketing
    // prompt catalogue; the tool must survive the flood of prompt matches.
    const hits = searchSite('email')
    expect(hits.some((h) => h.kind === 'tool')).toBe(true)
    expect(hits.some((h) => h.kind !== 'tool')).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(searchSite('JSON')[0]?.slug).toBe(searchSite('json')[0]?.slug)
  })

  it('ignores punctuation', () => {
    expect(searchSite('json!!')[0]?.slug).toBe('json-formatter')
  })

  it('uses AND semantics across terms', () => {
    // Both terms must match somewhere. With OR, this would return most of the
    // catalogue and feel broken.
    const nonsense = searchSite('json zzzzqqq')
    expect(nonsense).toEqual([])
  })

  it('ranks a name match above a keyword-only match', () => {
    const hits = searchSite('slogan')
    expect(hits[0]?.slug).toBe('slogan-generator')
  })

  it('respects the limit', () => {
    const hits = searchSite('a', 3)
    expect(hits.length).toBeLessThanOrEqual(3)
  })

  it('never exceeds the default limit even with both catalogues matching', () => {
    expect(searchSite('prompt').length).toBeLessThanOrEqual(8)
    expect(searchSite('a').length).toBeLessThanOrEqual(8)
  })

  it('returns no results for a query that matches nothing', () => {
    expect(searchSite('zzzzzzqqqqq')).toEqual([])
  })

  it('sorts deterministically', () => {
    const a = searchSite('calculator')
    const b = searchSite('calculator')
    expect(a.map((h) => h.slug)).toEqual(b.map((h) => h.slug))
  })

  it('finds every tool by its own title', () => {
    // A tool that cannot be found by typing its name is unreachable in practice.
    for (const tool of TOOLS) {
      const hits = searchSite(tool.title)
      expect(
        hits.map((h) => h.slug),
        `"${tool.title}" did not find ${tool.slug}`,
      ).toContain(tool.slug)
    }
  })

  it(
    'finds every prompt by its own title',
    () => {
      // Same reachability bar as tools: a prompt nobody can pull up by typing
      // its title might as well not be indexed. This test calls searchSite()
      // once per prompt (O(n²) against the full index), which is a test-suite
      // cost only — a single real searchSite() call stays fast regardless of
      // catalogue size. The default 5s budget stopped being enough once the
      // library crossed ~1000 prompts.
      for (const prompt of PROMPTS) {
        const hits = searchSite(prompt.title)
        expect(
          hits.map((h) => h.href),
          `"${prompt.title}" did not find ${prompt.slug}`,
        ).toContain(`/prompts/${prompt.category}/${prompt.slug}`)
      }
    },
    30_000,
  )
})
