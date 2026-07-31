import { CATEGORIES } from './categories'
import { TOOLS } from './registry'

/**
 * Client-side search over the catalogue.
 *
 * Purpose
 *   A tools hub lives on cross-tool navigation, so search has to be instant. The
 *   whole index is ~15KB and ships with the page: no server round trip, no
 *   debounce needed, and it works offline.
 *
 * Inputs   a raw query string (may be empty, may contain punctuation)
 * Outputs  ranked SearchHit[], best match first
 * Failure  an empty or whitespace-only query returns [] rather than everything,
 *          so the dropdown stays closed until the user has actually typed.
 */

export interface SearchEntry {
  readonly slug: string
  readonly href: string
  readonly name: string
  readonly category: string
  readonly categoryName: string
  readonly tagline: string
  readonly icon: string
  /** Lowercased haystack: name + keywords + tagline. Built once at module load. */
  readonly haystack: string
}

export interface SearchHit extends SearchEntry {
  readonly score: number
}

export const SEARCH_INDEX: readonly SearchEntry[] = TOOLS.map((tool) => {
  const category = CATEGORIES.find((c) => c.slug === tool.category)
  return {
    slug: tool.slug,
    href: `/${tool.category}/${tool.slug}`,
    name: tool.title,
    category: tool.category,
    categoryName: category?.name ?? tool.category,
    tagline: tool.tagline,
    icon: tool.icon,
    haystack: [tool.title, tool.h1, tool.tagline, ...tool.keywords, tool.slug]
      .join(' ')
      .toLowerCase(),
  }
})

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
 * somewhere (AND semantics), because with only ~15 tools an OR search returns
 * almost the whole catalogue and feels broken.
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

export function searchTools(query: string, limit = 8): readonly SearchHit[] {
  const normalised = normalise(query)
  if (!normalised) return []

  const terms = normalised.split(' ')
  const hits: SearchHit[] = []

  for (const entry of SEARCH_INDEX) {
    const score = scoreEntry(entry, terms)
    if (score > 0) hits.push({ ...entry, score })
  }

  return hits
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
}
