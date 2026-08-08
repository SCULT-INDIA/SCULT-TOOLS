/**
 * In-memory, per-instance rate limiter — the zero-signup, zero-dependency,
 * $0 first layer described in
 * docs/SPEED_TEST_AI_VISIBILITY_PRODUCTION_PLAN.md §1.3/§2.2. It protects two
 * things: Google's free PageSpeed Insights quota, and this server's own time
 * spent fetching third-party sites on a visitor's behalf.
 *
 * Known, deliberate limitation: this is NOT a distributed limiter. On
 * serverless hosting each warm function instance keeps its own counters, so
 * a client that lands on several warm instances effectively gets several
 * independent budgets, and every cold start resets to zero. That is a real
 * ceiling on how well this stops a determined, distributed attacker — it is
 * not a ceiling on stopping the much more common case, a single script
 * hammering one endpoint from one connection. Upgrading to a shared store
 * (e.g. Upstash Redis) later needs no change to either caller's code shape,
 * only to this module's internals.
 */

interface Bucket {
  count: number
  windowStart: number
}

const buckets = new Map<string, Bucket>()

/** Hard memory bound: a flood of many distinct keys evicts the oldest rather than growing forever. */
const MAX_TRACKED_KEYS = 5000

export interface RateLimitResult {
  readonly allowed: boolean
  /** Seconds until the caller may retry — 0 when allowed. */
  readonly retryAfterSeconds: number
}

/**
 * Fixed-window limiter: at most `limit` calls per `windowMs` per key. A
 * fixed window can admit up to 2x `limit` across a window boundary — an
 * accepted tradeoff for a first layer meant to stop hammering, not to
 * smooth traffic precisely.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)

  if (existing === undefined || now - existing.windowStart >= windowMs) {
    if (buckets.size >= MAX_TRACKED_KEYS) evictOne(now, windowMs)
    buckets.set(key, { count: 1, windowStart: now })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (existing.count < limit) {
    existing.count += 1
    return { allowed: true, retryAfterSeconds: 0 }
  }

  const retryAfterSeconds = Math.ceil((existing.windowStart + windowMs - now) / 1000)
  return { allowed: false, retryAfterSeconds: Math.max(retryAfterSeconds, 1) }
}

/** Removes every expired bucket, or — if none are expired yet — the single
 * oldest-inserted one, so the map size is always hard-bounded even under a
 * flood of one-request-each distinct keys. */
function evictOne(now: number, windowMs: number): void {
  let removedAny = false
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart >= windowMs) {
      buckets.delete(key)
      removedAny = true
    }
  }
  if (!removedAny) {
    const oldestKey = buckets.keys().next().value
    if (oldestKey !== undefined) buckets.delete(oldestKey)
  }
}

/** Best-effort real client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const real = headers.get('x-real-ip')
  return real ?? 'unknown'
}
