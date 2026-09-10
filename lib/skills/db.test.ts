import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `getAllSkillRefs` paging, against a fake PostgREST that reproduces the two
 * real Supabase behaviours this function exists to survive:
 *
 *  1. Every response is capped at 1,000 rows, and the truncation is
 *     disclosed only in a `Content-Range` header supabase-js discards — so
 *     asking for 50,000 returns HTTP 200, `error === null`, and 1,000 rows,
 *     indistinguishable from a table that only holds 1,000. That is how the
 *     sitemap came to list 1,000 of 50,456 skills while looking healthy, so
 *     the fake enforces the cap rather than honouring what it is asked for.
 *
 *  2. A deep `OFFSET` can exceed the statement timeout (`57014`) — which is
 *     what actually emptied `/sitemap/2.xml` in production. Setting
 *     `timeoutWideOffsetsPast` makes any deep `.range()` that fetches real
 *     column data fail while an `id`-only one still succeeds, mirroring
 *     index-only-scan cost, and that asymmetry is what pins the keyset
 *     rewrite: the only way to read the tail is the cheap id probe plus
 *     `.gt('id', …)` paging.
 */

// `'use cache'` functions call `cacheLife`, which only exists inside a Next
// render. Stubbed so this file can exercise the query logic directly.
vi.mock('next/cache', () => ({ cacheLife: () => {} }))

type Row = { id: string; slug: string; category: string; last_synced_at: string }

/** Rows the fake table holds, ordered by id; reassigned per test. */
let table: Row[] = []
/** Every query the code issued, in order — the assertion subject for
 * "did it page, and did it use a cursor rather than an offset". */
let queries: string[] = []
/** Cursor value of a `.gt('id', …)` page that should fail, or null. */
let failAfter: string | null | undefined
/** How many times the failing page fails before succeeding. */
let failTimes = Number.POSITIVE_INFINITY
/** Attempts made against the failing page, to prove retries happened. */
let failAttempts = 0
/** Depth past which a `.range()` that has to fetch real column data fails
 * with a 57014, the way a deep OFFSET does under build load. An `id`-only
 * range stays cheap at any depth, because Postgres serves it from the
 * primary-key index without touching the heap — that asymmetry is the whole
 * reason the boundary probe selects `id` alone. */
let timeoutWideOffsetsPast = Number.POSITIVE_INFINITY

const POSTGREST_CAP = 1_000
const TIMEOUT_ERROR = {
  code: '57014',
  details: null,
  hint: null,
  message: 'canceling statement due to statement timeout',
}

vi.mock('./supabase', () => {
  // A minimal chainable stand-in for the PostgREST builder: `.range()`
  // resolves an offset window, `.limit()` + optional `.gt()` resolve a
  // keyset page. Both are thenable so `await` works either way.
  function builder(state: { limit: number; after: string | null; cols: string }) {
    const resolve = () => {
      let rows = table
      if (state.after !== null) {
        rows = rows.filter((r) => r.id > (state.after as string))
      }
      queries.push(`keyset after=${state.after ?? '(start)'} limit=${state.limit}`)
      if (failAfter !== undefined && state.after === failAfter) {
        failAttempts++
        if (failAttempts <= failTimes) {
          return Promise.resolve({ data: null, error: TIMEOUT_ERROR })
        }
      }
      // The cap applies to the keyset form too.
      return Promise.resolve({
        data: rows.slice(0, Math.min(state.limit, POSTGREST_CAP)),
        error: null,
      })
    }
    const self: Record<string, unknown> = {
      gt: (_col: string, value: string) => builder({ ...state, after: value }),
      limit: (n: number) => builder({ ...state, limit: n }),
      range: (from: number, to: number) => {
        queries.push(`range ${from}-${to} select=${state.cols}`)
        // Only a range that must fetch heap tuples is expensive; an
        // id-only one is an index-only scan and stays fast at any depth.
        if (from > timeoutWideOffsetsPast && state.cols !== 'id') {
          return Promise.resolve({ data: null, error: TIMEOUT_ERROR })
        }
        const end = Math.min(to + 1, from + POSTGREST_CAP)
        return Promise.resolve({ data: table.slice(from, end), error: null })
      },
      // biome-ignore lint/suspicious/noThenProperty: a PostgREST query builder genuinely is a thenable — `.limit()` must be both awaitable and still chainable to `.gt()`, which is exactly the shape the code under test relies on
      then: (onFulfilled: (v: unknown) => unknown) => resolve().then(onFulfilled),
    }
    return self
  }
  return {
    supabaseSkills: {
      from: () => ({
        select: (cols: string) => ({
          order: () => builder({ limit: POSTGREST_CAP, after: null, cols }),
        }),
      }),
    },
  }
})

const { getAllSkillRefs } = await import('./db')

function rows(count: number, startId = 0): Row[] {
  return Array.from({ length: count }, (_, i) => {
    // Zero-padded so lexical id order matches numeric order, matching the
    // real table's `id text primary key` ordering.
    const n = String(startId + i).padStart(7, '0')
    return {
      id: `id-${n}`,
      slug: `skill-${startId + i}`,
      category: 'general',
      last_synced_at: '2026-09-03',
    }
  })
}

beforeEach(() => {
  table = []
  queries = []
  failAfter = undefined
  failTimes = Number.POSITIVE_INFINITY
  failAttempts = 0
  timeoutWideOffsetsPast = Number.POSITIVE_INFINITY
})

describe('getAllSkillRefs', () => {
  it('returns every row of a 50,456-row table despite the 1,000-row cap', async () => {
    table = rows(50_456)
    const refs = await getAllSkillRefs(0, 50_000)
    // The original regression: a single un-paged query returned 1,000 here.
    expect(refs.length).toBe(50_000)
    expect(refs[0]?.slug).toBe('skill-0')
    expect(refs[49_999]?.slug).toBe('skill-49999')
  })

  it('pages with a cursor, never a deep offset', async () => {
    table = rows(2_500)
    const refs = await getAllSkillRefs(0, 2_500)
    expect(refs.map((r) => r.slug)).toEqual(table.map((r) => r.slug))
    // The whole point of the rewrite: no `.range()` anywhere for shard 1,
    // and each page carries the previous page's last id as its cursor.
    expect(queries).toEqual([
      'keyset after=(start) limit=1000',
      'keyset after=id-0000999 limit=1000',
      'keyset after=id-0001999 limit=500',
    ])
  })

  it('reads a deep shard even when every deep OFFSET times out', async () => {
    table = rows(50_456)
    // The production failure: `ORDER BY id OFFSET 50000` with the full
    // column list exceeded the statement timeout under build load.
    timeoutWideOffsetsPast = 10
    const refs = await getAllSkillRefs(50_000, 50_000)
    expect(refs.length).toBe(456)
    expect(refs[0]?.slug).toBe('skill-50000')
    expect(refs.at(-1)?.slug).toBe('skill-50455')
    // The one permitted offset query is the id-only probe for the shard
    // boundary — a single row, servable from the primary-key index.
    expect(queries.filter((q) => q.startsWith('range'))).toEqual([
      'range 49999-49999 select=id',
    ])
  })

  it('honours the starting offset, so shard N reads shard N', async () => {
    table = rows(50_456)
    const refs = await getAllSkillRefs(50_000, 50_000)
    expect(refs.length).toBe(456)
    expect(refs[0]?.slug).toBe('skill-50000')
  })

  it('stops at a short page instead of querying past the end forever', async () => {
    table = rows(1_500)
    const refs = await getAllSkillRefs(0, 50_000)
    expect(refs.length).toBe(1_500)
    // Page 2 comes back short, which ends it. A third request would mean the
    // loop was relying on a row count rather than on the data.
    expect(queries.filter((q) => q.startsWith('keyset')).length).toBe(2)
  })

  it('asks for exactly `limit` rows, never more', async () => {
    table = rows(50_456)
    const refs = await getAllSkillRefs(0, 1_200)
    expect(refs.length).toBe(1_200)
    expect(queries).toEqual([
      'keyset after=(start) limit=1000',
      'keyset after=id-0000999 limit=200',
    ])
  })

  it('returns nothing when the offset is past the end of the table', async () => {
    table = rows(100)
    // The probe finds no row before the offset, so there is nothing to read.
    // The sitemap's own guard decides whether that is a failure, since only
    // it knows how many skills there are supposed to be.
    expect(await getAllSkillRefs(50_000, 50_000)).toEqual([])
  })

  /**
   * These two encode the lesson from the production incident: a page failure
   * used to return the rows gathered so far, and prerendering froze that
   * partial read into a static file — dropping 456 skills from the live
   * sitemap for the whole deploy, with a 200 and no error to notice.
   */
  it('retries a transient page failure instead of truncating', async () => {
    table = rows(3_000)
    failAfter = 'id-0000999' // the second page
    failTimes = 2 // fails twice, succeeds on the third attempt
    const refs = await getAllSkillRefs(0, 3_000)
    expect(refs.length).toBe(3_000)
    expect(failAttempts).toBe(3)
  })

  it('throws with the real Postgres error when a page keeps failing', async () => {
    table = rows(5_000)
    failAfter = 'id-0000999' // never recovers
    // `String(error)` on a PostgrestError gives "[object Object]", which is
    // what the first version of this throw reported — hiding the 57014 that
    // was the actual root cause. The code and message must survive.
    await expect(getAllSkillRefs(0, 5_000)).rejects.toThrow(
      /\[57014\] canceling statement due to statement timeout/,
    )
  })

  it('names the shard progress in the error, so a failed build says what was lost', async () => {
    table = rows(5_000)
    failAfter = 'id-0000999'
    await expect(getAllSkillRefs(0, 5_000)).rejects.toThrow(/1000 of 5000 gathered/)
  })

  it('issues no query at all for an empty request', async () => {
    table = rows(5_000)
    expect(await getAllSkillRefs(0, 0)).toEqual([])
    expect(queries).toEqual([])
  })

  it('maps snake_case columns to the camelCase shape the sitemap uses', async () => {
    table = rows(1)
    expect(await getAllSkillRefs(0, 1)).toEqual([
      { slug: 'skill-0', category: 'general', lastSyncedAt: '2026-09-03' },
    ])
  })
})
