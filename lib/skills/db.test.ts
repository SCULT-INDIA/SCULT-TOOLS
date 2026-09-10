import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `getAllSkillRefs` paging, against a fake PostgREST that reproduces the one
 * behaviour that made this worth testing: Supabase caps every response at
 * 1,000 rows and reports the truncation ONLY in a `Content-Range` header
 * that supabase-js discards. A caller asking for 50,000 rows gets HTTP 200,
 * `error === null`, and 1,000 rows — indistinguishable, from inside the
 * client, from a table that only has 1,000 rows in it.
 *
 * That is exactly how the sitemap came to list 1,000 of 50,456 skills while
 * looking completely healthy, so the fake below enforces the cap rather than
 * honouring whatever range it is handed.
 */

// `'use cache'` functions call `cacheLife`, which only exists inside a Next
// render. Stubbed so this file can exercise the query logic directly.
vi.mock('next/cache', () => ({ cacheLife: () => {} }))

/** Rows the fake table holds; reassigned per test. */
let table: { slug: string; category: string; last_synced_at: string }[] = []
/** Every range the code under test asked for, in order — the assertion
 * subject for "did it page, and did it page from the right offsets". */
let requestedRanges: [number, number][] = []
/** Set to a row index to make the page starting there fail. */
let failFrom: number | null = null
/** How many times the page at `failFrom` fails before succeeding.
 * `Infinity` means it never recovers. */
let failTimes = Number.POSITIVE_INFINITY
/** Attempts actually made against `failFrom`, to prove retries happened. */
let failAttempts = 0

const POSTGREST_CAP = 1_000

vi.mock('./supabase', () => ({
  supabaseSkills: {
    from: () => ({
      select: () => ({
        order: () => ({
          range: (from: number, to: number) => {
            requestedRanges.push([from, to])
            if (failFrom !== null && from === failFrom) {
              failAttempts++
              if (failAttempts <= failTimes) {
                return Promise.resolve({
                  data: null,
                  error: { message: 'simulated PostgREST failure' },
                })
              }
            }
            // The cap: never return more than 1,000 rows, whatever was asked.
            const end = Math.min(to + 1, from + POSTGREST_CAP)
            return Promise.resolve({ data: table.slice(from, end), error: null })
          },
        }),
      }),
    }),
  },
}))

const { getAllSkillRefs } = await import('./db')

function rows(count: number, startId = 0) {
  return Array.from({ length: count }, (_, i) => ({
    slug: `skill-${startId + i}`,
    category: 'general',
    last_synced_at: '2026-09-03',
  }))
}

beforeEach(() => {
  table = []
  requestedRanges = []
  failFrom = null
  failTimes = Number.POSITIVE_INFINITY
  failAttempts = 0
})

describe('getAllSkillRefs', () => {
  it('returns every row of a 50,456-row table despite the 1,000-row cap', async () => {
    table = rows(50_456)
    const refs = await getAllSkillRefs(0, 50_000)
    // The regression: a single un-paged query returned 1,000 here.
    expect(refs.length).toBe(50_000)
    expect(refs[0]?.slug).toBe('skill-0')
    expect(refs[49_999]?.slug).toBe('skill-49999')
    expect(requestedRanges.length).toBe(50)
  })

  it('pages from consecutive offsets with no gap or overlap', async () => {
    table = rows(2_500)
    const refs = await getAllSkillRefs(0, 2_500)
    expect(requestedRanges).toEqual([
      [0, 999],
      [1_000, 1_999],
      [2_000, 2_499],
    ])
    // A gap or a repeat would show up as a duplicate or missing slug.
    expect(new Set(refs.map((r) => r.slug)).size).toBe(2_500)
  })

  it('honours the starting offset, so shard N reads shard N', async () => {
    table = rows(50_456)
    const refs = await getAllSkillRefs(50_000, 50_000)
    expect(refs.length).toBe(456)
    expect(refs[0]?.slug).toBe('skill-50000')
    expect(refs.at(-1)?.slug).toBe('skill-50455')
  })

  it('stops at a short page instead of querying past the end forever', async () => {
    table = rows(1_500)
    const refs = await getAllSkillRefs(0, 50_000)
    expect(refs.length).toBe(1_500)
    // Page 2 comes back short (500 < 1000), which ends it. A third request
    // would mean the loop was relying on the row count rather than the data.
    expect(requestedRanges.length).toBe(2)
  })

  it('asks for exactly `limit` rows, never more', async () => {
    table = rows(50_456)
    const refs = await getAllSkillRefs(0, 1_200)
    expect(refs.length).toBe(1_200)
    expect(requestedRanges).toEqual([
      [0, 999],
      [1_000, 1_199],
    ])
  })

  /**
   * These three encode the lesson from the production incident: shard 2's
   * only page came back empty during the build, the old code returned the
   * 0 rows it had gathered, and that empty `<urlset>` was prerendered into a
   * static file — dropping 456 skills from the live sitemap for the whole
   * deploy, with a 200 and no error to notice. A prerendered partial read is
   * permanent, so it must fail loudly instead.
   */
  it('retries a transient page failure instead of truncating', async () => {
    table = rows(3_000)
    failFrom = 1_000
    failTimes = 2 // fails twice, succeeds on the third attempt
    const refs = await getAllSkillRefs(0, 3_000)
    expect(refs.length).toBe(3_000)
    expect(failAttempts).toBe(3)
  })

  it('throws rather than returning a partial list when a page keeps failing', async () => {
    table = rows(5_000)
    failFrom = 2_000 // never recovers
    await expect(getAllSkillRefs(0, 5_000)).rejects.toThrow(/rows 2000-2999 failed/)
  })

  it('names the shortfall in the error, so a failed build says what was lost', async () => {
    table = rows(5_000)
    failFrom = 2_000
    await expect(getAllSkillRefs(0, 5_000)).rejects.toThrow(/2000 of 5000 gathered/)
  })

  it('issues no query at all for an empty request', async () => {
    table = rows(5_000)
    expect(await getAllSkillRefs(0, 0)).toEqual([])
    expect(requestedRanges).toEqual([])
  })

  it('maps snake_case columns to the camelCase shape the sitemap uses', async () => {
    table = rows(1)
    expect(await getAllSkillRefs(0, 1)).toEqual([
      { slug: 'skill-0', category: 'general', lastSyncedAt: '2026-09-03' },
    ])
  })
})
