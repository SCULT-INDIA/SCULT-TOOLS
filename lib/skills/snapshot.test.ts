import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { rowToSkill, SKILL_COLUMNS } from './row'
import { buildSnapshot, readSnapshotFile } from './snapshot'

/** A raw `skills` row as PostgREST returns it, in snake_case. */
function row(over: Record<string, unknown>) {
  return {
    id: 'o/r/x',
    slug: 'x',
    category: 'testing',
    name: 'X',
    description: 'Does X for testing.',
    body: '# X\n\nDoes X.\nWith a "quoted" line and a → non-Latin-1 arrow.',
    tags: ['vitest'],
    license: 'MIT',
    license_gated: false,
    source_owner: 'o',
    source_repo: 'r',
    source_skill_id: 'x',
    source_url: 'https://github.com/o/r',
    installs: 10,
    first_seen_at: '2026-08-01T00:00:00.000Z',
    last_synced_at: '2026-09-01T00:00:00.000Z',
    related_tools: [],
    related_prompts: [],
    ...over,
  }
}

const ROWS = [
  row({
    id: 'a/r/alpha',
    slug: 'alpha',
    category: 'testing',
    installs: 50,
    first_seen_at: '2026-08-03',
  }),
  row({
    id: 'b/r/beta',
    slug: 'beta',
    category: 'testing',
    installs: 500,
    first_seen_at: '2026-08-01',
  }),
  row({
    id: 'c/r/gamma',
    slug: 'gamma',
    category: 'testing',
    installs: 50,
    first_seen_at: '2026-08-02',
  }),
  row({
    id: 'd/r/delta',
    slug: 'delta',
    category: 'security',
    installs: 7,
    first_seen_at: '2026-08-09',
  }),
]

/** What production hands `buildSnapshot`: rows without body, plus a loader
 * for the full row. Here the loader is an in-memory map. */
function inMemory(rows: ReturnType<typeof row>[]) {
  const full = new Map(rows.map((r) => [`${r.category}/${r.slug}`, rowToSkill(r)]))
  const listRows = rows.map(({ body: _body, ...rest }) => rest)
  return buildSnapshot(listRows, '2026-09-01T00:00:00.000Z', (c, s) =>
    full.get(`${c}/${s}`),
  )
}

/** The NDJSON file scripts/snapshot-skills.mjs writes: header, then a row per line. */
function ndjson(rows: unknown[], count = rows.length): string {
  return [
    JSON.stringify({
      generatedAt: 'now',
      count,
      lastSyncedAt: '2026-09-01T00:00:00.000Z',
    }),
    ...rows.map((r) => JSON.stringify(r)),
    '',
  ].join('\n')
}

describe('buildSnapshot', () => {
  const snap = inMemory(ROWS)

  it('counts every row and the categories it saw', () => {
    expect(snap.count).toBe(4)
    expect(snap.categoryCounts()).toEqual({ testing: 3, security: 1 })
    expect(snap.lastSyncedAt).toBe('2026-09-01T00:00:00.000Z')
  })

  it('serves the full skill, body included, through the loader — but only for keys it indexed', () => {
    const beta = snap.skill('testing', 'beta')
    expect(beta?.name).toBe('X')
    expect(beta?.body).toContain('# X')
    // Same slug under the wrong category is a miss, like the live query's
    // `.eq('category').eq('slug')`.
    expect(snap.skill('security', 'beta')).toBeUndefined()
  })

  it('orders a category by installs desc, ties broken by id, and list rows carry no body', () => {
    const testing = snap.category('testing')
    expect(testing.map((s) => s.slug)).toEqual(['beta', 'alpha', 'gamma'])
    for (const skill of testing) expect(skill.body).toBe('')
    expect(snap.category('performance')).toEqual([])
  })

  it('orders all() by installs and recentlyAdded() by first_seen_at desc', () => {
    expect(snap.all().map((s) => s.slug)).toEqual(['beta', 'alpha', 'gamma', 'delta'])
    expect(snap.recentlyAdded().map((s) => s.slug)).toEqual([
      'delta',
      'alpha',
      'gamma',
      'beta',
    ])
  })

  it('refs() is a stable total order by id, carrying what the sitemap needs', () => {
    expect(snap.refs().map((r) => r.slug)).toEqual(['alpha', 'beta', 'gamma', 'delta'])
    expect(snap.refs()[0]).toEqual({
      slug: 'alpha',
      category: 'testing',
      lastSyncedAt: '2026-09-01T00:00:00.000Z',
    })
  })

  it('rejects a duplicate category/slug instead of silently keeping one', () => {
    expect(() => inMemory([...ROWS, row({ id: 'z/r/alpha', slug: 'alpha' })])).toThrow(
      /duplicate skill testing\/alpha/,
    )
  })
})

describe('readSnapshotFile (NDJSON, bodies read on demand)', () => {
  let dir: string | undefined
  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true })
    dir = undefined
  })
  function write(contents: string): string {
    dir = mkdtempSync(path.join(tmpdir(), 'skills-snapshot-'))
    const file = path.join(dir, 'skills.ndjson')
    writeFileSync(file, contents)
    return file
  }

  it('indexes every row from the file and reads the exact body back by byte offset, multi-byte characters included', () => {
    const snap = readSnapshotFile(write(ndjson(ROWS)))
    expect(snap.count).toBe(4)
    expect(snap.categoryCounts()).toEqual({ testing: 3, security: 1 })
    expect(snap.lastSyncedAt).toBe('2026-09-01T00:00:00.000Z')
    // The list index never holds bodies…
    for (const s of snap.all()) expect(s.body).toBe('')
    // …and the on-demand read returns the full, byte-exact original.
    const gamma = snap.skill('testing', 'gamma')
    expect(gamma?.body).toBe(ROWS[2]?.body)
    expect(gamma?.installs).toBe(50)
    expect(snap.skill('testing', 'nope')).toBeUndefined()
  })

  it('throws when the header count disagrees with the rows — never builds from a partial registry', () => {
    expect(() => readSnapshotFile(write(ndjson(ROWS, 10_000)))).toThrow(
      /inconsistent: header count=10000, rows=4/,
    )
  })
})

describe('loadBuildSnapshot', () => {
  const HOLDER = Symbol.for('tools.scult.in/skills-snapshot')
  let dir: string | undefined

  afterEach(() => {
    vi.unstubAllEnvs()
    delete (globalThis as { [HOLDER]?: unknown })[HOLDER]
    if (dir) rmSync(dir, { recursive: true, force: true })
    dir = undefined
  })

  it('is null when SKILLS_SNAPSHOT is unset — the request-time path', async () => {
    vi.stubEnv('SKILLS_SNAPSHOT', '')
    const { loadBuildSnapshot } = await import('./snapshot')
    expect(loadBuildSnapshot()).toBeNull()
  })

  it('reads the file once and shares the index across callers via globalThis', async () => {
    dir = mkdtempSync(path.join(tmpdir(), 'skills-snapshot-'))
    const file = path.join(dir, 'skills.ndjson')
    writeFileSync(file, ndjson(ROWS))
    vi.stubEnv('SKILLS_SNAPSHOT', file)
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { loadBuildSnapshot } = await import('./snapshot')
    const first = loadBuildSnapshot()
    expect(first?.count).toBe(4)
    expect(loadBuildSnapshot()).toBe(first)
    expect(log).toHaveBeenCalledTimes(1)
    log.mockRestore()
  })
})

describe('snapshot script column list', () => {
  it('matches lib/skills/row.ts exactly, so a build page cannot differ from a live one', async () => {
    // @ts-expect-error plain .mjs script, deliberately untyped (see its header)
    const { SNAPSHOT_COLUMNS } = await import('../../scripts/snapshot-skills.mjs')
    expect(SNAPSHOT_COLUMNS).toBe(SKILL_COLUMNS)
  })
})
