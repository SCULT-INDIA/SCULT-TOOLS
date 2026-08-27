import { PROMPTS } from '@/lib/prompts/registry'
import type { Prompt } from '@/lib/prompts/types'

/**
 * Keyword search over the prompt registry — one implementation shared by the
 * MCP server's `search_prompts` tool and the CLI API's
 * `/api/cli/v1/prompts/search` route, so the two surfaces can never rank
 * differently. Server-only, same as everything that imports the full prompt
 * registry (see lib/search.ts's documented bundle-leak incident).
 *
 * Scoring: every term must match somewhere (AND semantics); a term hitting
 * the title outweighs a body hit 10:1. Mirrors the MCP tool's original
 * behavior verbatim.
 */

export interface PromptSearchHit {
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly category: string
  readonly tags: readonly string[]
}

export function searchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .slice(0, 8)
}

interface Haystack {
  readonly title: string
  readonly full: string
}

/** Memoized corpus, built once per process — the registry is an immutable
 * module constant, so caching is safe for the life of the process. */
let haystacksCache: Haystack[] | undefined
function promptHaystacks(): Haystack[] {
  haystacksCache ??= PROMPTS.map((p) => ({
    title: p.title.toLowerCase(),
    full: `${p.title} ${p.description} ${p.tags.join(' ')} ${p.promptText}`.toLowerCase(),
  }))
  return haystacksCache
}

export function searchPrompts(
  query: string,
  category: string | undefined,
  limit: number,
): PromptSearchHit[] {
  const terms = searchTerms(query)
  if (terms.length === 0) return []
  const haystacks = promptHaystacks()
  return PROMPTS.map((p, i) => {
    if (category !== undefined && p.category !== category) return { p, score: -1 }
    const hay = haystacks[i]
    if (hay === undefined) return { p, score: -1 }
    let score = 0
    for (const term of terms) {
      if (hay.title.includes(term)) score += 10
      else if (hay.full.includes(term)) score += 1
      else return { p, score: -1 }
    }
    return { p, score }
  })
    .filter((r): r is { p: Prompt; score: number } => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      category: p.category,
      tags: p.tags,
    }))
}
