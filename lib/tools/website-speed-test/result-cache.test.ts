import { describe, expect, it } from 'vitest'
import type { SpeedTestPayload } from './logic'
import { createResultCache } from './result-cache'

function payload(score: number): SpeedTestPayload {
  return {
    finalUrl: 'https://example.com/',
    strategy: 'mobile',
    score,
    lab: [],
    field: [],
    fieldSource: 'none',
    opportunities: [],
    thirdParty: [],
    resourceBreakdown: [],
    serverResponseMs: null,
  }
}

describe('createResultCache', () => {
  it('misses on a URL that was never stored', () => {
    const cache = createResultCache()
    expect(cache.get('https://example.com/', 'mobile', 0)).toBeUndefined()
  })

  it('hits with the exact stored payload before the TTL elapses', () => {
    const cache = createResultCache()
    const stored = payload(90)
    cache.set('https://example.com/', 'mobile', stored, 1000, 0)
    expect(cache.get('https://example.com/', 'mobile', 999)).toBe(stored)
  })

  it('expires exactly at the TTL boundary (>=, not >)', () => {
    const cache = createResultCache()
    cache.set('https://example.com/', 'mobile', payload(90), 1000, 0)
    expect(cache.get('https://example.com/', 'mobile', 1000)).toBeUndefined()
  })

  it('keeps mobile and desktop results for the same URL separate', () => {
    const cache = createResultCache()
    cache.set('https://example.com/', 'mobile', payload(50), 1000, 0)
    cache.set('https://example.com/', 'desktop', payload(95), 1000, 0)
    expect(cache.get('https://example.com/', 'mobile', 0)?.score).toBe(50)
    expect(cache.get('https://example.com/', 'desktop', 0)?.score).toBe(95)
  })

  it('evicts the oldest entry once at capacity, rather than growing forever', () => {
    const cache = createResultCache(2)
    cache.set('https://a.example/', 'mobile', payload(1), 1000, 0)
    cache.set('https://b.example/', 'mobile', payload(2), 1000, 1)
    cache.set('https://c.example/', 'mobile', payload(3), 1000, 2)
    expect(cache.get('https://a.example/', 'mobile', 2)).toBeUndefined()
    expect(cache.get('https://b.example/', 'mobile', 2)?.score).toBe(2)
    expect(cache.get('https://c.example/', 'mobile', 2)?.score).toBe(3)
  })

  it('prefers evicting a stale entry over a fresher, older-inserted one', () => {
    const cache = createResultCache(2)
    // Inserted first (so it is the "oldest" by insertion order) but with a
    // long TTL, so at the time of the third insert it is still fresh.
    cache.set('https://oldest-but-fresh.example/', 'mobile', payload(1), 10_000, 0)
    // Inserted second, short TTL — stale well before the third insert.
    cache.set('https://newer-but-stale.example/', 'mobile', payload(2), 50, 10)
    // Capacity (2) is reached; this insert must evict the stale entry, not
    // the plain-oldest one — proving eviction checks each entry's own TTL
    // rather than falling back to insertion order whenever anything is stale.
    cache.set('https://new.example/', 'mobile', payload(3), 1000, 200)
    expect(cache.get('https://oldest-but-fresh.example/', 'mobile', 200)?.score).toBe(1)
    expect(cache.get('https://newer-but-stale.example/', 'mobile', 200)).toBeUndefined()
    expect(cache.get('https://new.example/', 'mobile', 200)?.score).toBe(3)
  })
})
