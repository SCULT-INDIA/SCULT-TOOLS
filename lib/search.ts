import {
  getPromptCountByCategory,
  PROMPT_CATEGORIES,
  PROMPT_GROUPS,
  PROMPTS,
} from './prompts/registry'
import { rankSearch } from './search-client'
import type {
  PromptSearchEntry,
  SearchEntry,
  SearchHit,
  ToolSearchEntry,
} from './search-client'
import { CATEGORIES } from './tools/categories'
import { TOOLS } from './tools/registry'

export type { PromptSearchEntry, SearchEntry, SearchHit, ToolSearchEntry }

/**
 * Client-side search over the whole site: the tool catalogue AND the prompt
 * library. This module is deliberately a CONSUMER of both registries — it may
 * import from `lib/tools/` and `lib/prompts/`, which the two registries
 * themselves must never do to each other. That is why it lives at `lib/search.ts`
 * rather than inside either registry's directory.
 *
 * SERVER-ONLY IN PRACTICE: this file imports the full prompt/tool registries
 * (every prompt's complete template body included) to build `TOOL_ENTRIES` /
 * `PROMPT_INDEX` below. It must never be imported from a client component —
 * `SearchBox.tsx` used to do exactly that, and it put the entire prompt
 * library's source into the browser bundle just to read four short fields
 * per entry. Server components (`Header`, `Hero`, `not-found`) import
 * `TOOL_ENTRIES`/`PROMPT_INDEX` from here and pass them to `<SearchBox>` as a
 * plain data prop; the actual ranking logic lives in the client-safe
 * `lib/search-client.ts`, which this file delegates to.
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

export const TOOL_COUNT = TOOLS.length
export const PROMPT_COUNT = PROMPTS.length

export const TOOL_ENTRIES: readonly ToolSearchEntry[] = TOOLS.map((tool) => {
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
export const PROMPT_INDEX: readonly PromptSearchEntry[] = [
  ...PROMPT_CATEGORY_ENTRIES,
  ...PROMPT_ENTRIES,
]

export const SEARCH_INDEX: readonly SearchEntry[] = [...TOOL_ENTRIES, ...PROMPT_INDEX]

/**
 * Site-wide search: tools first, then prompt categories and prompts, `limit`
 * rows in total. Thin wrapper over `rankSearch` — kept here (rather than
 * inlined at call sites) purely so tests and any future server-side caller
 * can still call `searchSite(query)` without wiring the two entry arrays
 * through themselves.
 */
export function searchSite(query: string, limit = 8): readonly SearchHit[] {
  return rankSearch(TOOL_ENTRIES, PROMPT_INDEX, query, limit)
}
