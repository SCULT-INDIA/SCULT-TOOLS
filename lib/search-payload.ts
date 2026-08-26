import { PROMPT_INDEX, TOOL_ENTRIES } from './search'
import type { PromptSearchEntry, SearchEntry, ToolSearchEntry } from './search-client'
import { VERBATIM_HAYSTACK_MARKER } from './search-payload-client'

/**
 * The wire format for the search index.
 *
 * Purpose
 *   `lib/search.ts` builds a 1,236-entry index whose plain-JSON form is ~950KB.
 *   That index used to travel to the browser as a React prop, which meant it was
 *   serialized into the RSC flight stream embedded in EVERY page's HTML — the
 *   root layout renders `<Header>`, so every route paid for it. Measured on the
 *   live homepage: 995,381 of 1,468,551 HTML characters were this index — 72.5%
 *   of all GZIPPED bytes (285.5KB -> 78.6KB with it removed) — and `/prompts`
 *   reached 2.6MB of HTML.
 *
 *   The cost is NOT what it first looks like. The flight stream is emitted after
 *   `</body>`; the stylesheet link sits at byte 560 and the LCP `<h1>` at byte
 *   19,219, so none of this ever delayed CSS discovery or first paint. What it
 *   actually did was emit a single contiguous 1,000,527-character `<script>`
 *   block — the parser must evaluate that in one uninterruptible task, and React
 *   then `JSON.parse`s the same payload again during hydration. That is a
 *   CPU-bound cost, which is why it showed up as Total Blocking Time and LCP
 *   "element render delay" rather than TTFB, and why the mobile Lighthouse score
 *   tracked the runner's CPU benchmark so closely (94 at benchmark 1115, 79 at
 *   478) while desktop, with CPU headroom to spare, barely moved.
 *
 *   So the index no longer ships with the document at all. It is served from its
 *   own immutable, separately-cacheable URL and fetched once, lazily, the first
 *   time someone actually interacts with search.
 *
 * Why a compact tuple encoding rather than the raw entry objects
 *   The raw shape repeats the same handful of strings across 1,236 entries:
 *   `categoryName` has only 64 distinct values but costs 47,598 bytes, `icon` has
 *   61 distinct values for 22,228 bytes, `tile` has 5 for 18,984 bytes, and
 *   `kind` has 3 for 20,205 bytes. Hoisting those into lookup tables and
 *   referencing them by index removes ~100KB before compression. `href` (86,433
 *   bytes) is dropped entirely because it is fully derivable from kind + slug +
 *   category. `haystack` (574,993 bytes — the single largest field) always BEGINS
 *   with the lowercased `name`, so only the remainder is transmitted and the full
 *   haystack is rebuilt on the client.
 *
 *   This is a transport encoding only. `decodeSearchPayload` reconstructs objects
 *   structurally identical to what `lib/search.ts` produces, so `rankSearch` and
 *   the SearchBox rendering code are untouched and cannot drift.
 *
 * Inputs   none — reads the registries at module scope (build time)
 * Outputs  `SearchPayload`, a JSON-serializable object
 * Failure  none at runtime; a registry shape change surfaces as a type error, and
 *          `lib/search-payload.test.ts` asserts a decode round-trip matches the
 *          source index exactly.
 *
 * SERVER-ONLY: this imports `lib/search.ts`, which pulls in the complete prompt
 * and tool registries. It must never be imported from a client component — doing
 * so is what caused a 7.5MB browser bundle before. The client only ever imports
 * `decodeSearchPayload` from `lib/search-payload-client.ts`.
 */
export interface SearchPayload {
  /** Distinct `categoryName` values, referenced by index. */
  readonly c: readonly string[]
  /** Distinct `icon` values, referenced by index. */
  readonly i: readonly string[]
  /** Distinct `tile` values, referenced by index. */
  readonly t: readonly string[]
  /** Tool entries: [slug, name, categoryIdx, iconIdx, haystackTail, category, tagline] */
  readonly tools: readonly (readonly [
    string,
    string,
    number,
    number,
    string,
    string,
    string,
  ])[]
  /**
   * Prompt + prompt-category entries:
   * [isCategory, slug, name, categoryIdx, iconIdx, tileIdx, haystackTail, promptCategorySlug]
   *
   * `promptCategorySlug` is '' for prompt-category rows (their own slug IS the
   * category) and carries the parent category slug for individual prompts, which
   * is what makes `href` reconstructable without transmitting it.
   */
  readonly prompts: readonly (readonly [
    0 | 1,
    string,
    string,
    number,
    number,
    number,
    string,
    string,
  ])[]
  readonly toolCount: number
  readonly promptCount: number
}

/** Interns a string into `table`, returning its index. */
function intern(table: string[], value: string): number {
  const existing = table.indexOf(value)
  if (existing !== -1) return existing
  table.push(value)
  return table.length - 1
}

/**
 * Strips the leading lowercased `name` off a haystack.
 *
 * Every haystack in `lib/search.ts` is built with the entry's title first, so
 * this prefix is always present — but the check is defensive rather than
 * assumed: if the construction ever changes, the full haystack is sent instead
 * of silently shipping a truncated one that would break matching. That escape
 * hatch is flagged with `VERBATIM_HAYSTACK_MARKER`, imported from the decoder so
 * the two halves cannot disagree about what the marker is — they each hardcoded
 * their own character once, and a stray NUL byte went unnoticed precisely
 * because this branch never executes in practice.
 */
function haystackTail(haystack: string, name: string): string {
  const prefix = `${name.toLowerCase()} `
  return haystack.startsWith(prefix)
    ? haystack.slice(prefix.length)
    : `${VERBATIM_HAYSTACK_MARKER}${haystack}`
}

export function buildSearchPayload(
  toolEntries: readonly ToolSearchEntry[] = TOOL_ENTRIES,
  promptEntries: readonly PromptSearchEntry[] = PROMPT_INDEX,
): SearchPayload {
  const c: string[] = []
  const i: string[] = []
  const t: string[] = []

  const tools = toolEntries.map(
    (e) =>
      [
        e.slug,
        e.name,
        intern(c, e.categoryName),
        intern(i, e.icon),
        haystackTail(e.haystack, e.name),
        e.category,
        e.tagline,
      ] as const,
  )

  const prompts = promptEntries.map((e) => {
    const isCategory: 0 | 1 = e.kind === 'prompt-category' ? 1 : 0
    // `/prompts/<category>/<slug>` for a prompt, `/prompts/<slug>` for a
    // category — so only a prompt needs its parent slug carried across.
    const parent = isCategory === 1 ? '' : e.href.split('/')[2]
    return [
      isCategory,
      e.slug,
      e.name,
      intern(c, e.categoryName),
      intern(i, e.icon),
      intern(t, e.tile),
      haystackTail(e.haystack, e.name),
      parent ?? '',
    ] as const
  })

  return {
    c,
    i,
    t,
    tools,
    prompts,
    toolCount: toolEntries.length,
    promptCount: promptEntries.filter((e) => e.kind === 'prompt').length,
  }
}

/** Re-exported for tests that want to compare against the source index. */
export type { SearchEntry }
