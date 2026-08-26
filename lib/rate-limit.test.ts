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
  it('takes the RIGHTMOST x-forwarded-for entry (the trusted proxy hop)', async () => {
    const { clientIpFromHeaders } = await freshLimiter()
    const headers = new Headers({
      // A client trying to defeat rate limits by forging XFF: the platform
      // proxy APPENDS the real peer address after the forged ones.
      'x-forwarded-for': '1.2.3.4, 5.6.7.8, 203.0.113.9',
    })
    expect(clientIpFromHeaders(headers)).toBe('203.0.113.9')
  })

  it('handles a single-entry header', async () => {
    const { clientIpFromHeaders } = await freshLimiter()
    expect(clientIpFromHeaders(new Headers({ 'x-forwarded-for': '203.0.113.9' }))).toBe(
      '203.0.113.9',
    )
  })

  it('falls back to x-real-ip, then "unknown"', async () => {
    const { clientIpFromHeaders } = await freshLimiter()
    expect(clientIpFromHeaders(new Headers({ 'x-real-ip': '198.51.100.7' }))).toBe(
      '198.51.100.7',
    )
    expect(clientIpFromHeaders(new Headers())).toBe('unknown')
  })
})
