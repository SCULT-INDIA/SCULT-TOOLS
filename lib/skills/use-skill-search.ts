'use client'

import { useEffect, useRef, useState } from 'react'
import { isCliSkillSearchRow, type SkillHit, toSkillHit } from './search-hit'

/** Same "worth calling a real search" floor `SearchBox`'s own analytics
 * effect uses for tools/prompts — one or two characters match almost
 * everything and would fire a request per keystroke for no useful result. */
const MIN_QUERY_LENGTH = 2
/** Long enough that normal typing never fires more than one request per
 * pause, short enough that the Skills group still feels live. */
const DEBOUNCE_MS = 300
const RESULT_LIMIT = 4

/**
 * Live Skills Library search for the site-wide search box.
 *
 * Tools and prompts rank client-side against an index fetched once (see
 * `lib/use-search-index.ts`) — their registries are small and fixed at
 * build time. Skills are a 10,000-row Supabase-backed table (see
 * `lib/skills/db.ts`'s header: frozen, but still far too large to ship as a
 * client index), so this hook instead calls the same public search
 * endpoint the CLI uses (`GET /api/cli/v1/skills/search`), debounced, one
 * in-flight request at a time.
 *
 * Failure mode matches the rest of site search: a network error, an
 * aborted stale request, or a non-OK response all resolve to an empty
 * result set rather than surfacing anything to the caller — search finds
 * nothing rather than the page breaking.
 */
export function useSkillSearchHits(query: string): {
  readonly hits: readonly SkillHit[]
  readonly loading: boolean
} {
  const [hits, setHits] = useState<readonly SkillHit[]>([])
  const [loading, setLoading] = useState(false)
  // Guards against a slow earlier response landing after a newer, faster
  // one — abort() alone isn't enough because a fetch's .catch can still run
  // after abort on some environments; this is the belt to that suspenders.
  const requestId = useRef(0)

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setHits([])
      setLoading(false)
      return
    }

    const id = ++requestId.current
    const controller = new AbortController()
    setLoading(true)
    const timer = setTimeout(() => {
      fetch(
        `/api/cli/v1/skills/search?q=${encodeURIComponent(trimmed)}&limit=${RESULT_LIMIT}`,
        { signal: controller.signal },
      )
        .then((res) => (res.ok ? res.json() : { results: [] }))
        .then((json: { results?: unknown[] }) => {
          if (requestId.current !== id) return
          const rows = Array.isArray(json.results) ? json.results : []
          setHits(
            rows
              .filter(isCliSkillSearchRow)
              .map(toSkillHit)
              .filter((hit): hit is SkillHit => hit !== undefined),
          )
          setLoading(false)
        })
        .catch(() => {
          if (requestId.current !== id) return
          setHits([])
          setLoading(false)
        })
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return { hits, loading }
}

/** At most this many separate lookups per message — enough to cover a
 * three-word request, cheap enough to never matter. */
const MAX_TERMS = 3

/**
 * The homepage assistant's skills leg. `searchSkills` (behind the endpoint
 * above) matches the query as ONE `ilike` phrase, so a three-word request
 * like "chas overdue invoice" would find nothing even when a skill matches
 * two of the three words. This runs one lookup per term instead, then
 * merges, scoring each skill by the total length of the terms that matched
 * it — so a skill matched by more terms ranks first, and a match on a long,
 * specific term ("invoice") outranks one on a short stem ("chas", which
 * `ilike` also finds inside "purchase"). Ties keep the endpoint's own
 * (installs-first) order. Same failure mode as the hook above — a failed
 * leg contributes nothing rather than breaking the reply.
 */
export function useSkillSearchHitsForTerms(terms: readonly string[]): {
  readonly hits: readonly SkillHit[]
  readonly loading: boolean
} {
  const [hits, setHits] = useState<readonly SkillHit[]>([])
  const [loading, setLoading] = useState(false)
  const requestId = useRef(0)
  // Effects compare dependencies by identity; a fresh array of the same
  // words must not refetch, so the array is keyed by its contents.
  const key = [...terms]
    .filter((t) => t.length >= MIN_QUERY_LENGTH)
    .sort((a, b) => b.length - a.length)
    .slice(0, MAX_TERMS)
    .join('\u0000')

  useEffect(() => {
    const lookups = key ? key.split('\u0000') : []
    if (lookups.length === 0) {
      setHits([])
      setLoading(false)
      return
    }
    const id = ++requestId.current
    const controller = new AbortController()
    setLoading(true)

    Promise.all(
      lookups.map((term) =>
        fetch(
          `/api/cli/v1/skills/search?q=${encodeURIComponent(term)}&limit=${RESULT_LIMIT + 2}`,
          { signal: controller.signal },
        )
          .then((res) => (res.ok ? res.json() : { results: [] }))
          .then((json: { results?: unknown[] }) =>
            (Array.isArray(json.results) ? json.results : [])
              .filter(isCliSkillSearchRow)
              .map(toSkillHit)
              .filter((hit): hit is SkillHit => hit !== undefined),
          )
          .catch((): SkillHit[] => []),
      ),
    ).then((perTerm) => {
      if (requestId.current !== id) return
      const merged = new Map<string, { hit: SkillHit; score: number; order: number }>()
      perTerm.forEach((list, i) => {
        const weight = lookups[i]?.length ?? 1
        list.forEach((hit, order) => {
          const seen = merged.get(hit.href)
          if (seen) seen.score += weight
          else merged.set(hit.href, { hit, score: weight, order })
        })
      })
      setHits(
        [...merged.values()]
          .sort((a, b) => b.score - a.score || a.order - b.order)
          .slice(0, RESULT_LIMIT)
          .map((m) => m.hit),
      )
      setLoading(false)
    })

    return () => controller.abort()
  }, [key])

  return { hits, loading }
}
