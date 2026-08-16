import type { PromptSearchEntry, ToolSearchEntry } from './search-client'

/**
 * Client half of the search-index wire format.
 *
 * Purpose
 *   Rebuilds the full entry objects from the compact tuple encoding produced by
 *   `lib/search-payload.ts`, so that `rankSearch` and the SearchBox rendering
 *   code keep operating on exactly the shapes they always have.
 *
 * Why this file is separate from `lib/search-payload.ts`
 *   That module imports `lib/search.ts`, which imports the complete prompt and
 *   tool registries — every prompt's full template body included. Importing it
 *   from a client component put the entire library into the browser bundle once
 *   before (a 7.5MB regression). This file deliberately imports nothing but
 *   types, so it is safe to pull into client code.
 *
 * Inputs   an unknown value fetched over the network (validated shallowly)
 * Outputs  `{ toolEntries, promptEntries, toolCount, promptCount }`
 * Failure  `decodeSearchPayload` throws on a structurally invalid payload; the
 *          caller (`useSearchIndex`) catches and degrades to an empty index so a
 *          bad or truncated response disables search rather than crashing the page.
 */

/** Mirrors `SearchPayload` in lib/search-payload.ts — kept as a separate,
 * dependency-free declaration so this module never reaches the registries. */
interface RawPayload {
  c: string[]
  i: string[]
  t: string[]
  tools: [string, string, number, number, string, string, string][]
  prompts: [0 | 1, string, string, number, number, number, string, string][]
  toolCount: number
  promptCount: number
}

export interface DecodedSearchIndex {
  readonly toolEntries: readonly ToolSearchEntry[]
  readonly promptEntries: readonly PromptSearchEntry[]
  readonly toolCount: number
  readonly promptCount: number
}

/**
 * Marks a transmitted haystack as VERBATIM rather than name-prefix-elided.
 *
 * Exported so `lib/search-payload.ts` writes the exact same byte it is tested
 * for here — the encoder and decoder previously each hardcoded their own
 * character and silently disagreed, which was invisible because the fallback
 * path is dead code today (every haystack does start with its name). It would
 * only have surfaced the day the haystack construction changed, i.e. exactly
 * the situation the fallback exists to survive.
 *
 * A leading space is safe as the marker because an elided tail never begins
 * with one: it is the remainder after slicing off `"<name> "`, space included.
 */
export const VERBATIM_HAYSTACK_MARKER = ' '

/** Inverse of `haystackTail` in lib/search-payload.ts. */
function rebuildHaystack(name: string, tail: string): string {
  return tail.startsWith(VERBATIM_HAYSTACK_MARKER)
    ? tail.slice(VERBATIM_HAYSTACK_MARKER.length)
    : `${name.toLowerCase()} ${tail}`
}

function at(table: readonly string[], index: number, field: string): string {
  const value = table[index]
  if (value === undefined) {
    throw new Error(`search payload: ${field} index ${index} out of range`)
  }
  return value
}

export function decodeSearchPayload(input: unknown): DecodedSearchIndex {
  const p = input as RawPayload
  if (
    !p ||
    !Array.isArray(p.c) ||
    !Array.isArray(p.i) ||
    !Array.isArray(p.t) ||
    !Array.isArray(p.tools) ||
    !Array.isArray(p.prompts)
  ) {
    throw new Error('search payload: malformed root')
  }

  const toolEntries: ToolSearchEntry[] = p.tools.map(
    ([slug, name, ci, ii, tail, category, tagline]) => ({
      kind: 'tool',
      slug,
      href: `/${category}/${slug}`,
      name,
      category,
      categoryName: at(p.c, ci, 'categoryName'),
      tagline,
      icon: at(p.i, ii, 'icon'),
      haystack: rebuildHaystack(name, tail),
    }),
  )

  const promptEntries: PromptSearchEntry[] = p.prompts.map(
    ([isCategory, slug, name, ci, ii, ti, tail, parent]) => ({
      kind: isCategory === 1 ? 'prompt-category' : 'prompt',
      slug,
      href: isCategory === 1 ? `/prompts/${slug}` : `/prompts/${parent}/${slug}`,
      name,
      categoryName: at(p.c, ci, 'categoryName'),
      icon: at(p.i, ii, 'icon'),
      tile: at(p.t, ti, 'tile') as PromptSearchEntry['tile'],
      haystack: rebuildHaystack(name, tail),
    }),
  )

  return {
    toolEntries,
    promptEntries,
    toolCount: typeof p.toolCount === 'number' ? p.toolCount : toolEntries.length,
    promptCount: typeof p.promptCount === 'number' ? p.promptCount : 0,
  }
}
