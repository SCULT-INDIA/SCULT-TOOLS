import {
  getPromptCountByCategory,
  PROMPT_CATEGORIES,
  PROMPT_GROUPS,
  PROMPTS,
} from './prompts/registry'
import type { PromptCategory } from './prompts/types'
import { CATEGORIES } from './tools/categories'
import { TOOLS } from './tools/registry'

/**
 * Client-side search over the whole site: the tool catalogue AND the prompt
 * library. This module is deliberately a CONSUMER of both registries — it may
 * import from `lib/tools/` and `lib/prompts/`, which the two registries
 * themselves must never do to each other. That is why it lives at `lib/search.ts`
 * rather than inside either registry's directory.
 *
 * Purpose
 *   A tools hub lives on cross-catalogue navigation, so search has to be
 *   instant. The whole index ships with the page: no server round trip, no
 *   debounce needed, and it works offline.
 *
 * Inputs   a raw query string (may be empty, may contain punctuation)
 * Outputs  ranked SearchHit[], best match first — all tool hits before all
 *          prompt hits, so the SearchBox can render them under "Tools" /
 *          "Prompts" group headers without reordering.
 * Failure  an empty or whitespace-only query returns [] rather than
 *          everything, so the dropdown stays closed until the user has
 *          actually typed.
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

export const TOOL_COUNT = TOOLS.length
export const PROMPT_COUNT = PROMPTS.length

const TOOL_ENTRIES: readonly ToolSearchEntry[] = TOOLS.map((tool) => {
  const category = CATEGORIES.find((c) => c.slug === tool.category)
  return {
    kind: 'tool',
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

const PROMPT_GROUP_NAME = new Map(PROMPT_GROUPS.map((g) => [g.slug, g.name]))
const PROMPT_CATEGORY_BY_SLUG = new Map(PROMPT_CATEGORIES.map((c) => [c.slug, c]))

/** Category pages only exist once a category has content (empty ones export
 * an empty array and stay hidden), so only those are searchable. */
const PROMPT_CATEGORY_ENTRIES: readonly PromptSearchEntry[] = PROMPT_CATEGORIES.filter(
  (c) => getPromptCountByCategory(c.slug) > 0,
).map((c) => ({
  kind: 'prompt-category',
  slug: c.slug,
  href: `/prompts/${c.slug}`,
  // "Cursor Prompts" rather than "Cursor" — it is what people actually type,
  // and it scores the category above its individual prompts on brand queries.
  name: `${c.name} Prompts`,
  categoryName: PROMPT_GROUP_NAME.get(c.group) ?? 'Prompt Library',
  icon: c.icon,
  tile: c.tile,
  haystack: [`${c.name} prompts`, c.blurb, c.slug, PROMPT_GROUP_NAME.get(c.group) ?? '']
    .join(' ')
    .toLowerCase(),
}))

const PROMPT_ENTRIES: readonly PromptSearchEntry[] = PROMPTS.map((prompt) => {
  const category = PROMPT_CATEGORY_BY_SLUG.get(prompt.category)
  return {
    kind: 'prompt',
    slug: prompt.slug,
    href: `/prompts/${prompt.category}/${prompt.slug}`,
    name: prompt.title,
    categoryName: category ? `${category.name} Prompts` : 'Prompts',
    icon: category?.icon ?? 'Sparkles',
    tile: category?.tile ?? 'lavender',
    haystack: [
      prompt.title,
      prompt.description,
      ...prompt.tags,
      ...prompt.targetTools,
      category?.name ?? '',
      prompt.slug,
    ]
      .join(' ')
      .toLowerCase(),
  }
})

/** Prompt categories before individual prompts so equal scores tie-break in
 * favour of the broader page. */
const PROMPT_INDEX: readonly PromptSearchEntry[] = [
  ...PROMPT_CATEGORY_ENTRIES,
  ...PROMPT_ENTRIES,
]

export const SEARCH_INDEX: readonly SearchEntry[] = [...TOOL_ENTRIES, ...PROMPT_INDEX]

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

/** Tools keep first claim on this many dropdown rows when both catalogues
 * match. They are the site's core offering and there are only 15 of them, so
 * a matching tool must never be buried under 254 prompts. */
const TOOL_PRIORITY_SLOTS = 5

/**
 * Site-wide search: tools first, then prompt categories and prompts, `limit`
 * rows in total. Tools take up to TOOL_PRIORITY_SLOTS (or more when prompts
 * leave slots unused — with zero prompt matches this is exactly the old
 * tools-only behaviour); prompts fill whatever remains.
 */
export function searchSite(query: string, limit = 8): readonly SearchHit[] {
  const normalised = normalise(query)
  if (!normalised) return []

  const terms = normalised.split(' ')
  const toolHits = rank(TOOL_ENTRIES, terms)
  const promptHits = rank(PROMPT_INDEX, terms)

  const maxTools = Math.min(
    limit,
    Math.max(TOOL_PRIORITY_SLOTS, limit - promptHits.length),
  )
  const tools = toolHits.slice(0, maxTools)
  const prompts = promptHits.slice(0, limit - tools.length)

  return [...tools, ...prompts]
}
