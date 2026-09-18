import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** Fresh module per test: the bucket map is module-level state, and tests
 * must not share it or ordering starts to matter. */
async function freshLimiter() {
  vi.resetModules()
  return await import('./rate-limit')
}

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

describe('checkRateLimit (token bucket)', () => {
  it('allows exactly `limit` immediate calls, then blocks', async () => {
    const { checkRateLimit } = await freshLimiter()
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit('k', 5, 60_000).allowed).toBe(true)
    }
    const blocked = checkRateLimit('k', 5, 60_000)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThanOrEqual(1)
    expect(blocked.remaining).toBe(0)
  })

  it('refills continuously — a token returns after windowMs/limit', async () => {
    const { checkRateLimit } = await freshLimiter()
    for (let i = 0; i < 5; i++) checkRateLimit('k', 5, 60_000)
    expect(checkRateLimit('k', 5, 60_000).allowed).toBe(false)

    // One token refills every 12s at 5/60s.
    vi.advanceTimersByTime(12_100)
    expect(checkRateLimit('k', 5, 60_000).allowed).toBe(true)
    // ...and only one.
    expect(checkRateLimit('k', 5, 60_000).allowed).toBe(false)
  })

  it('does NOT allow the fixed-window 2x boundary burst', async () => {
    const { checkRateLimit } = await freshLimiter()
    // Drain the full burst just before a "window boundary".
    for (let i = 0; i < 5; i++) checkRateLimit('k', 5, 60_000)
    // Cross the old boundary: a fixed window would grant 5 fresh calls here.
    vi.advanceTimersByTime(30_000)
    let granted = 0
    for (let i = 0; i < 5; i++) {
      if (checkRateLimit('k', 5, 60_000).allowed) granted++
    }
    // 30s at 5-per-60s refills 2.5 tokens -> exactly 2 grants, never 5.
    expect(granted).toBe(2)
  })

  it('caps burst capacity at `limit` no matter how long the idle gap', async () => {
    const { checkRateLimit } = await freshLimiter()
    checkRateLimit('k', 5, 60_000)
    vi.advanceTimersByTime(3_600_000)
    let granted = 0
    for (let i = 0; i < 10; i++) {
      if (checkRateLimit('k', 5, 60_000).allowed) granted++
    }
    expect(granted).toBe(5)
  })

  it('keys are independent', async () => {
    const { checkRateLimit } = await freshLimiter()
    for (let i = 0; i < 5; i++) checkRateLimit('a', 5, 60_000)
    expect(checkRateLimit('a', 5, 60_000).allowed).toBe(false)
    expect(checkRateLimit('b', 5, 60_000).allowed).toBe(true)
  })

  it('reports remaining for allowed calls', async () => {
    const { checkRateLimit } = await freshLimiter()
    expect(checkRateLimit('k', 3, 60_000).remaining).toBe(2)
    expect(checkRateLimit('k', 3, 60_000).remaining).toBe(1)
    expect(checkRateLimit('k', 3, 60_000).remaining).toBe(0)
  })

  it('`burst` caps the up-front capacity below `limit` while the sustained rate stays `limit`/window', async () => {
    const { checkRateLimit } = await freshLimiter()
    // 20/min sustained, but only 8 at once.
    let granted = 0
    for (let i = 0; i < 20; i++) {
      if (checkRateLimit('k', 20, 60_000, 8).allowed) granted++
    }
    expect(granted).toBe(8)
    // 20/60s refills one token every 3s.
    vi.advanceTimersByTime(3_100)
    expect(checkRateLimit('k', 20, 60_000, 8).allowed).toBe(true)
    expect(checkRateLimit('k', 20, 60_000, 8).allowed).toBe(false)
  })

  it('refill never exceeds `burst`, no matter how long the idle gap', async () => {
    const { checkRateLimit } = await freshLimiter()
    checkRateLimit('k', 20, 60_000, 8)
    vi.advanceTimersByTime(3_600_000)
    let granted = 0
    for (let i = 0; i < 30; i++) {
      if (checkRateLimit('k', 20, 60_000, 8).allowed) granted++
    }
    expect(granted).toBe(8)
  })

  it('`burst` defaults to `limit`, so the original three-argument callers are unchanged', async () => {
    const { checkRateLimit } = await freshLimiter()
    let granted = 0
    for (let i = 0; i < 10; i++) {
      if (checkRateLimit('k', 5, 60_000).allowed) granted++
    }
    expect(granted).toBe(5)
  })

  it('stays hard-bounded under a flood of distinct keys', async () => {
    const { checkRateLimit } = await freshLimiter()
    // Well past MAX_TRACKED_KEYS (5000) one-shot keys must not throw or
    // grow unbounded — and a real key created before the flood still
    // enforces (its bucket may have been evicted, which only ever errs
    // toward ALLOWING — acceptable for a memory bound).
    for (let i = 0; i < 6000; i++) {
      checkRateLimit(`flood:${i}`, 5, 60_000)
    }
    expect(checkRateLimit('after-flood', 5, 60_000).allowed).toBe(true)
  })
})

describe('clientIpFromHeaders', () => {
  it('prefers x-vercel-forwarded-for over x-forwarded-for', async () => {
    const { clientIpFromHeaders } = await freshLimiter()
    const headers = new Headers({
      // A proxy in front of Vercel (e.g. Cloudflare) would leave its own
      // address in x-forwarded-for; x-vercel-forwarded-for is Vercel's own
      // guarantee of the real client per its docs.
      'x-forwarded-for': '198.51.100.55',
      'x-vercel-forwarded-for': '203.0.113.9',
    })
    expect(clientIpFromHeaders(headers)).toBe('203.0.113.9')
  })

  it('falls back to x-forwarded-for — safe on Vercel, which strips forged values', async () => {
    const { clientIpFromHeaders } = await freshLimiter()
    expect(clientIpFromHeaders(new Headers({ 'x-forwarded-for': '203.0.113.9' }))).toBe(
      '203.0.113.9',
    )
  })

  it('takes the last entry defensively if a header ever carries more than one', async () => {
    const { clientIpFromHeaders } = await freshLimiter()
    const headers = new Headers({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8, 203.0.113.9' })
    expect(clientIpFromHeaders(headers)).toBe('203.0.113.9')
  })

  it('falls back to x-real-ip, then "unknown"', async () => {
    const { clientIpFromHeaders } = await freshLimiter()
    expect(clientIpFromHeaders(new Headers({ 'x-real-ip': '198.51.100.7' }))).toBe(
      '198.51.100.7',
    )
    expect(clientIpFromHeaders(new Headers())).toBe('unknown')
  })
})
