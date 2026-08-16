'use client'

import { useEffect, useState } from 'react'
import { type DecodedSearchIndex, decodeSearchPayload } from './search-payload-client'

/**
 * Lazily loads the site-wide search index, once per page load, shared by every
 * SearchBox on the page.
 *
 * Purpose
 *   The index no longer travels in the HTML (see `lib/search-payload.ts` for the
 *   measurements that forced that change), so it has to arrive some other way.
 *   It is fetched from `/search-index.json` the first time a visitor shows intent
 *   to search — not on page load — because the overwhelming majority of visits
 *   never touch the search box, and making them all pay for a ~950KB JSON
 *   document would simply move the original problem onto a different request.
 *
 * Why the module-level cache
 *   Up to three SearchBoxes render at once (header on md+, the mobile drawer's,
 *   and the hero's mobile-only one). Without a shared cache, opening the drawer
 *   after using the header search would refetch the whole index. `inFlight`
 *   dedupes concurrent callers and `cache` serves every later one synchronously.
 *   Both are module scope, so they live exactly as long as the page does.
 *
 * Inputs   `active` — whether this SearchBox has been interacted with yet
 * Outputs  the decoded index; `EMPTY` until it has loaded
 * Failure  a failed or malformed fetch resolves to `EMPTY` (search finds nothing
 *          rather than the page crashing) and clears `inFlight` so the next
 *          interaction retries. The failure is logged once, not swallowed silently.
 */

const EMPTY: DecodedSearchIndex = {
  toolEntries: [],
  promptEntries: [],
  toolCount: 0,
  promptCount: 0,
}

let cache: DecodedSearchIndex | null = null
let inFlight: Promise<DecodedSearchIndex> | null = null

export function loadSearchIndex(): Promise<DecodedSearchIndex> {
  if (cache) return Promise.resolve(cache)
  if (inFlight) return inFlight

  inFlight = fetch('/search-index.json')
    .then((res) => {
      if (!res.ok) throw new Error(`search index: HTTP ${res.status}`)
      return res.json()
    })
    .then((json) => {
      const decoded = decodeSearchPayload(json)
      cache = decoded
      return decoded
    })
    .catch((error: unknown) => {
      // Cleared so a later interaction can retry — a transient network blip
      // should not disable search for the rest of the session.
      inFlight = null
      console.error('Search index failed to load', error)
      return EMPTY
    })

  return inFlight
}

/**
 * `active` gates the fetch. Callers flip it on the first real signal of intent
 * (focus, or a pointer entering the input), so the request is usually already
 * in flight by the time the first character is typed.
 */
export function useSearchIndex(active: boolean): DecodedSearchIndex {
  // Reads the module cache during initialisation so a second SearchBox opened
  // later starts with a populated index and never flashes an empty state.
  // Safe for hydration: on the server, and on the client's first render, the
  // cache is always null, so both produce EMPTY.
  const [index, setIndex] = useState<DecodedSearchIndex>(EMPTY)

  useEffect(() => {
    if (!active) return
    let alive = true
    void loadSearchIndex().then((loaded) => {
      if (alive) setIndex(loaded)
    })
    return () => {
      alive = false
    }
  }, [active])

  return index
}
