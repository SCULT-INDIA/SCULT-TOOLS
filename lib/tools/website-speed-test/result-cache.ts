/**
 * In-memory, per-instance cache of finished speed-test results.
 *
 * Exists because Next.js's fetch data cache cannot hold the raw PageSpeed
 * Insights response: PSI responses run 2-6 MB, and Next's data cache
 * silently refuses to store anything over 2MB. Asking it to anyway (via
 * `next: { revalidate }` on that fetch) produced a "Failed to set Next.js
 * data cache" warning on nearly every real page, an occasional crash when
 * that failure cascaded into an unhandled rejection, and — worst — a log
 * line that dumped the full failed request URL, API key query param
 * included. See app/api/speed-test/route.ts for the fetch itself.
 *
 * The fix is to never ask Next to cache PSI's raw body at all. This module
 * caches only the already-trimmed `SpeedTestPayload` the route ships to the
 * client — a few KB, nowhere near any size ceiling — so a repeat test of the
 * same URL+strategy is still an instant hit.
 *
 * Same per-instance limitation as lib/rate-limit.ts: not shared across
 * serverless instances and reset on every cold start. A miss just means a
 * fresh PSI run, exactly like having no cache at all, so this is a hit-rate
 * tradeoff, not a correctness one.
 */

import type { SpeedTestPayload, Strategy } from './logic'

interface Entry {
  readonly payload: SpeedTestPayload
  readonly storedAt: number
  /** Decided once, at write time, so a lookup can never apply a different
   * TTL than the one the result was actually stored under. */
  readonly ttlMs: number
}

export interface ResultCache {
  /** Returns the cached payload for `url`+`strategy` if one is stored and not yet stale. */
  get(url: string, strategy: Strategy, now?: number): SpeedTestPayload | undefined
  /** Stores a finished result, evicting stale/oldest entries first if the cache is at capacity. */
  set(
    url: string,
    strategy: Strategy,
    payload: SpeedTestPayload,
    ttlMs: number,
    now?: number,
  ): void
}

function cacheKey(url: string, strategy: Strategy): string {
  return `${strategy}:${url}`
}

function isStale(entry: Entry, now: number): boolean {
  return now - entry.storedAt >= entry.ttlMs
}

/**
 * Builds an isolated cache instance. The route holds one module-scoped
 * instance for its own lifetime; tests build their own so cases never share
 * state.
 */
export function createResultCache(maxTrackedKeys = 500): ResultCache {
  const entries = new Map<string, Entry>()

  /** Removes every stale entry, or — if none are stale yet — the single
   * oldest-inserted one, so the cache size is always hard-bounded even under
   * a flood of one-URL-each distinct keys. */
  function evictStaleOrOldest(now: number): void {
    let removedAny = false
    for (const [key, entry] of entries) {
      if (isStale(entry, now)) {
        entries.delete(key)
        removedAny = true
      }
    }
    if (!removedAny) {
      const oldestKey = entries.keys().next().value
      if (oldestKey !== undefined) entries.delete(oldestKey)
    }
  }

  return {
    get(url, strategy, now = Date.now()) {
      const key = cacheKey(url, strategy)
      const entry = entries.get(key)
      if (entry === undefined) return undefined
      if (isStale(entry, now)) {
        entries.delete(key)
        return undefined
      }
      return entry.payload
    },
    set(url, strategy, payload, ttlMs, now = Date.now()) {
      const key = cacheKey(url, strategy)
      if (!entries.has(key) && entries.size >= maxTrackedKeys) {
        evictStaleOrOldest(now)
      }
      entries.set(key, { payload, storedAt: now, ttlMs })
    },
  }
}
