import type { PromptCategory } from './prompts/types'

/**
 * Pure ranking logic for site-wide search — deliberately isolated from
 * `lib/search.ts`, which imports the full tools/prompts registries (every
 * prompt's complete template body included) to build the index.
 *
 * `SearchBox.tsx` is a client component, so anything it imports — even
 * transitively — ships to the browser. Importing `lib/search.ts` directly
 * from there once put the entire prompt library's source (1,170 full
 * templates) into the client bundle just to read four short fields per
 * entry. This file has zero import from either registry: the index itself
 * is computed server-side in `lib/search.ts` and handed to `SearchBox` as a
 * plain data prop, so only the slim per-entry fields below ever cross the
 * server/client boundary.
 */

interface SearchEntryBase {
  readonly slug: string
  readonly href: string
  readonly name: string
  /** Secondary line in the dropdown — the entry's category-ish context. */
  readonly categoryName: string
  /** Lowercased haystack for substring matching. Built once at module load. */
  readonly haystack: string
}

export interface ToolSearchEntry extends SearchEntryBase {
  readonly kind: 'tool'
  readonly category: string
  readonly tagline: string
  readonly icon: string
}

export interface PromptSearchEntry extends SearchEntryBase {
  readonly kind: 'prompt' | 'prompt-category'
  /** Lucide icon name of the prompt category, rendered via <Icon/>. */
  readonly icon: string
  /** The category's pastel tile, so the result row's disc matches PromptCard. */
  readonly tile: PromptCategory['tile']
}

export type SearchEntry = ToolSearchEntry | PromptSearchEntry

export type SearchHit = SearchEntry & { readonly score: number }

/** Tools keep first claim on this many dropdown rows when both catalogues
 * match. They are the site's core offering and there are only 15 of them, so
 * a matching tool must never be buried under 1,170 prompts. */
const TOOL_PRIORITY_SLOTS = 5

function normalise(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Scores an entry against the query terms.
 *
 * Ranking is deliberately simple and explainable rather than a fuzzy-distance
 * library: exact name match beats name prefix, which beats a word boundary hit,
 * which beats a substring anywhere in the haystack. Every term must match
 * somewhere (AND semantics) — with a few hundred entries an OR search returns
 * half the catalogue and feels broken.
 */
function scoreEntry(entry: SearchEntry, terms: readonly string[]): number {
  const name = entry.name.toLowerCase()
  let total = 0

  for (const term of terms) {
    let best = 0
    if (name === term) best = 100
    else if (name.startsWith(term)) best = 60
    else if (new RegExp(`\\b${term}`).test(name)) best = 40
    else if (name.includes(term)) best = 25
    else if (new RegExp(`\\b${term}`).test(entry.haystack)) best = 15
    else if (entry.haystack.includes(term)) best = 8

    // AND semantics: one unmatched term disqualifies the entry entirely.
    if (best === 0) return 0
    total += best
  }

  // Nudge shorter names up, so "GST Calculator" outranks a longer title that
  // merely contains the same words.
  return total + Math.max(0, 20 - entry.name.length / 2)
}

function rank(entries: readonly SearchEntry[], terms: readonly string[]): SearchHit[] {
  const hits: SearchHit[] = []
  for (const entry of entries) {
    const score = scoreEntry(entry, terms)
    if (score > 0) hits.push(Object.assign({}, entry, { score }))
  }
  return hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
}

/**
 * Site-wide search over a precomputed index: tools first, then prompt
 * categories and prompts, `limit` rows in total. Tools take up to
 * TOOL_PRIORITY_SLOTS (or more when prompts leave slots unused — with zero
 * prompt matches this is exactly the old tools-only behaviour); prompts fill
 * whatever remains.
 */
export function rankSearch(
  toolEntries: readonly ToolSearchEntry[],
  promptEntries: readonly PromptSearchEntry[],
  query: string,
  limit = 8,
): readonly SearchHit[] {
  const normalised = normalise(query)
  if (!normalised) return []

  const terms = normalised.split(' ')
  const toolHits = rank(toolEntries, terms)
  const promptHits = rank(promptEntries, terms)

  const maxTools = Math.min(
    limit,
    Math.max(TOOL_PRIORITY_SLOTS, limit - promptHits.length),
  )
  const tools = toolHits.slice(0, maxTools)
  const prompts = promptHits.slice(0, limit - tools.length)

  return [...tools, ...prompts]
}
