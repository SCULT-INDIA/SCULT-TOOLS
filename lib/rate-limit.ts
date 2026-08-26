/**
 * In-memory, per-instance rate limiter — the zero-signup, zero-dependency,
 * $0 first layer described in
 * docs/SPEED_TEST_AI_VISIBILITY_PRODUCTION_PLAN.md §1.3/§2.2. It protects two
 * things: Google's free PageSpeed Insights quota, and this server's own time
 * spent fetching third-party sites on a visitor's behalf.
 *
 * TOKEN BUCKET, not the fixed window this started as: a fixed window admits
 * up to 2x `limit` across a window boundary (30/min meant 60 in the two
 * seconds straddling minute marks), and resets punish a client who was one
 * request over just as much as one who was 10x over. A token bucket gives
 * the same sustained rate with honest burst behavior: `limit` tokens of
 * burst capacity, refilled continuously at `limit / windowMs`, so a client
 * that overshoots waits exactly as long as its overshoot deserves.
 *
 * Known, deliberate limitation: this is NOT a distributed limiter. On
 * multi-instance hosting each instance keeps its own counters, so a client
 * that lands on several instances effectively gets several independent
 * budgets, and every restart resets to zero. That is a real ceiling on how
 * well this stops a determined, distributed attacker — it is not a ceiling
 * on stopping the much more common case, a single script hammering one
 * endpoint from one connection. Upgrading to a shared store (e.g. Upstash
 * Redis) later needs no change to either caller's code shape, only to this
 * module's internals.
 */

interface Bucket {
  /** Tokens currently available, fractional between refills. */
  tokens: number
  /** Last refill timestamp (ms). */
  lastRefill: number
}

const buckets = new Map<string, Bucket>()

/** Hard memory bound: a flood of many distinct keys evicts the oldest rather than growing forever. */
const MAX_TRACKED_KEYS = 5000

export interface RateLimitResult {
  readonly allowed: boolean
  /** Seconds until the caller may retry — 0 when allowed. */
  readonly retryAfterSeconds: number
  /** Whole tokens still available after this call — for X-RateLimit-Remaining. */
  readonly remaining: number
}

/**
 * At most `limit` calls per `windowMs` per key, enforced as a token bucket
 * with capacity `limit` and continuous refill. Signature unchanged from the
 * fixed-window version so every existing caller keeps working.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  const refillPerMs = limit / windowMs
  let bucket = buckets.get(key)

  if (bucket === undefined) {
    if (buckets.size >= MAX_TRACKED_KEYS) evictSome(now, windowMs)
    bucket = { tokens: limit, lastRefill: now }
    buckets.set(key, bucket)
  } else {
    const elapsed = now - bucket.lastRefill
    if (elapsed > 0) {
      bucket.tokens = Math.min(limit, bucket.tokens + elapsed * refillPerMs)
      bucket.lastRefill = now
    }
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: Math.floor(bucket.tokens),
    }
  }

  const deficitMs = (1 - bucket.tokens) / refillPerMs
  return {
    allowed: false,
    retryAfterSeconds: Math.max(Math.ceil(deficitMs / 1000), 1),
    remaining: 0,
  }
}

/** Removes every bucket idle long enough to be full again (it carries no
 * information a fresh bucket wouldn't), or — if none qualify — the single
 * oldest-inserted one, so the map size is always hard-bounded even under a
 * flood of one-request-each distinct keys. */
function evictSome(now: number, windowMs: number): void {
  let removedAny = false
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill >= windowMs) {
      buckets.delete(key)
      removedAny = true
    }
  }
  if (!removedAny) {
    const oldestKey = buckets.keys().next().value
    if (oldestKey !== undefined) buckets.delete(oldestKey)
  }
}

/**
 * Real client IP for rate-limit keying, from proxy headers.
 *
 * The RIGHTMOST x-forwarded-for entry, not the leftmost: every proxy on the
 * path APPENDS the peer address it saw, so the rightmost entry is the one
 * written by OUROWN trusted edge (Railway's proxy), while the leftmost is
 * whatever the client itself claims. Taking the leftmost — what this
 * function originally did — let any client defeat every rate limit on this
 * site by rotating made-up addresses in a self-supplied x-forwarded-for
 * header, since the proxy appends the real address AFTER the forged ones.
 * The rightmost entry is spoof-proof under exactly one assumption: requests
 * reach this process only through the platform proxy, which is how Railway
 * (and every similar PaaS) routes traffic.
 */
export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const parts = forwarded.split(',')
    const last = parts[parts.length - 1]?.trim()
    if (last) return last
  }
  const real = headers.get('x-real-ip')
  return real ?? 'unknown'
}
