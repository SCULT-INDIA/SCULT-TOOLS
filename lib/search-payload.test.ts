import { describe, expect, it } from 'vitest'
import { PROMPT_COUNT, PROMPT_INDEX, TOOL_COUNT, TOOL_ENTRIES, searchSite } from './search'
import { decodeSearchPayload } from './search-payload-client'
import { buildSearchPayload } from './search-payload'
import { rankSearch } from './search-client'

/**
 * The compact wire encoding in `lib/search-payload.ts` drops `href` entirely,
 * elides the `name` prefix from every `haystack`, and replaces `categoryName` /
 * `icon` / `tile` with lookup-table indices. Each of those is a place where a
 * subtle mistake would silently degrade search rather than throw — a wrong
 * `href` sends people to a 404, a corrupted `haystack` makes results
 * unfindable. So the contract is pinned as an exact round-trip against the
 * real registries, not spot-checked.
 */
describe('search payload encoding', () => {
  const decoded = decodeSearchPayload(JSON.parse(JSON.stringify(buildSearchPayload())))

  it('round-trips every tool entry exactly', () => {
    expect(decoded.toolEntries).toEqual(TOOL_ENTRIES)
  })

  it('round-trips every prompt and prompt-category entry exactly', () => {
    expect(decoded.promptEntries).toEqual(PROMPT_INDEX)
  })

  it('carries the counts the placeholder text depends on', () => {
    expect(decoded.toolCount).toBe(TOOL_COUNT)
    expect(decoded.promptCount).toBe(PROMPT_COUNT)
  })

  it('reconstructs hrefs that match the source index', () => {
    // Explicit even though `toEqual` above covers it: a broken href is the
    // failure mode with the worst user-visible consequence (a dead link from
    // search), and this names it so a future regression reads unambiguously.
    for (const [i, entry] of PROMPT_INDEX.entries()) {
      expect(decoded.promptEntries[i]?.href).toBe(entry.href)
    }
    for (const [i, entry] of TOOL_ENTRIES.entries()) {
      expect(decoded.toolEntries[i]?.href).toBe(entry.href)
    }
  })

  it('produces identical ranked results to the server-side index', () => {
    // The real acceptance criterion: whatever the transport does, a query has
    // to return the same hits in the same order as searchSite().
    for (const query of [
      'schema',
      'invoice',
      'chatgpt',
      'qr code',
      'json',
      'midjourney prompts',
      'seo',
      'a',
    ]) {
      expect(rankSearch(decoded.toolEntries, decoded.promptEntries, query)).toEqual(
        searchSite(query),
      )
    }
  })

  it('is materially smaller than the raw index it replaces', () => {
    const raw = JSON.stringify([...TOOL_ENTRIES, ...PROMPT_INDEX]).length
    const packed = JSON.stringify(buildSearchPayload()).length
    // Measured ~950KB raw vs ~660KB packed. The bound is deliberately loose —
    // this guards against the encoding silently regressing to a pass-through,
    // not against normal content growth.
    expect(packed).toBeLessThan(raw * 0.8)
  })
})

describe('haystacks whose name prefix cannot be elided', () => {
  /**
   * Exercises the escape hatch in `haystackTail`. It is dead code against the
   * current registries — every haystack starts with its own lowercased name —
   * and that is exactly why it needs a test: the encoder and decoder each
   * hardcoded their own marker character at first and disagreed (one wrote a
   * NUL byte, the other looked for a space). Nothing caught it, because
   * nothing ran it.
   */
  it('round-trips a haystack that does not begin with its name', () => {
    const odd = [
      {
        kind: 'prompt' as const,
        slug: 'odd-one',
        href: '/prompts/chatgpt/odd-one',
        name: 'Some Title',
        categoryName: 'ChatGPT Prompts',
        icon: 'MessageSquare',
        tile: 'green' as const,
        haystack: 'deliberately does not start with the title',
      },
    ]
    const decoded = decodeSearchPayload(
      JSON.parse(JSON.stringify(buildSearchPayload([], odd))),
    )
    expect(decoded.promptEntries).toEqual(odd)
  })

  it('round-trips a haystack that legitimately begins with a space', () => {
    const spaced = [
      {
        kind: 'prompt' as const,
        slug: 'spaced',
        href: '/prompts/chatgpt/spaced',
        name: 'Title',
        categoryName: 'ChatGPT Prompts',
        icon: 'MessageSquare',
        tile: 'green' as const,
        haystack: '  leading whitespace preserved',
      },
    ]
    const decoded = decodeSearchPayload(
      JSON.parse(JSON.stringify(buildSearchPayload([], spaced))),
    )
    expect(decoded.promptEntries[0]?.haystack).toBe('  leading whitespace preserved')
  })
})

describe('decodeSearchPayload', () => {
  it('throws on a malformed payload rather than returning a broken index', () => {
    expect(() => decodeSearchPayload({ nope: true })).toThrow(/malformed root/)
  })

  it('throws when a lookup-table index is out of range', () => {
    const payload = JSON.parse(JSON.stringify(buildSearchPayload()))
    payload.tools[0][2] = 9999
    expect(() => decodeSearchPayload(payload)).toThrow(/out of range/)
  })
})
