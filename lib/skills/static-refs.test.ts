import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

// `'use cache'` helpers only exist inside a Next render; the module under
// test imports them at load time.
vi.mock('next/cache', () => ({ cacheLife: () => {}, cacheTag: () => {} }))

const HOLDER = Symbol.for('tools.scult.in/skills-snapshot')

function row(i: number, installs: number) {
  return {
    id: `o/r/s${String(i).padStart(5, '0')}`,
    slug: `s${String(i).padStart(5, '0')}`,
    category: i % 2 === 0 ? 'testing' : 'security',
    name: `Skill ${i}`,
    description: `Does thing ${i}.`,
    body: '# body',
    tags: [],
    license: 'MIT',
    license_gated: false,
    source_owner: 'o',
    source_repo: 'r',
    source_skill_id: `s${i}`,
    source_url: 'https://github.com/o/r',
    installs,
    first_seen_at: '2026-08-01T00:00:00.000Z',
    last_synced_at: '2026-09-01T00:00:00.000Z',
    related_tools: [],
    related_prompts: [],
  }
}

/** Snake-case row shaped for the LIVE `getTopSkills` call path only
 * (no `body` — it uses `SKILL_LIST_COLUMNS`), distinct from `row()` above
 * (which is what the NDJSON snapshot carries, full columns). */
function liveRow(i: number, installs: number) {
  const { body: _body, ...rest } = row(i, installs)
  return rest
}

describe('getStaticSkillRefs', () => {
  let dir: string | undefined

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.doUnmock('./supabase')
    delete (globalThis as { [HOLDER]?: unknown })[HOLDER]
    if (dir) rmSync(dir, { recursive: true, force: true })
    dir = undefined
  })

  it('in dev with no snapshot, satisfies Cache Components\' "at least one result" rule with one real, live-fetched skill — not an empty array', async () => {
    // `next dev` never runs scripts/build.mjs, so there is never a
    // snapshot there; returning `[]` in that case used to be "correct" by
    // this function's own contract, but Next 16's Cache Components hard-
    // rejects an empty `generateStaticParams` result with a 500 on the
    // very first skill page anyone opens locally — found live 2026-09-19.
    vi.resetModules()
    vi.stubEnv('SKILLS_SNAPSHOT', '')
    vi.doMock('./supabase', () => ({
      supabaseSkills: {
        from: () => ({
          select: () => ({
            or: () => ({
              order: () => ({
                limit: (n: number) => ({
                  // biome-ignore lint/suspicious/noThenProperty: a PostgREST query builder genuinely is a thenable — see lib/skills/db.test.ts's own mock for the same shape
                  then: (resolve: (v: { data: unknown; error: null }) => void) =>
                    resolve({ data: [liveRow(0, 500)].slice(0, n), error: null }),
                }),
              }),
            }),
          }),
        }),
      },
    }))
    const { getStaticSkillRefs } = await import('./db')
    const refs = await getStaticSkillRefs()
    expect(refs).toEqual([{ category: 'testing', slug: 's00000' }])
  })

  it('in dev with no snapshot AND an empty live table, still returns [] rather than throwing', async () => {
    vi.resetModules()
    vi.stubEnv('SKILLS_SNAPSHOT', '')
    vi.doMock('./supabase', () => ({
      supabaseSkills: {
        from: () => ({
          select: () => ({
            or: () => ({
              order: () => ({
                limit: () => ({
                  // biome-ignore lint/suspicious/noThenProperty: a PostgREST query builder genuinely is a thenable — see lib/skills/db.test.ts's own mock for the same shape
                  then: (resolve: (v: { data: unknown; error: null }) => void) =>
                    resolve({ data: [], error: null }),
                }),
              }),
            }),
          }),
        }),
      },
    }))
    const { getStaticSkillRefs } = await import('./db')
    expect(await getStaticSkillRefs()).toEqual([])
  })

  it('refuses a production build that has no snapshot instead of pre-rendering against live Supabase', async () => {
    vi.resetModules()
    vi.stubEnv('SKILLS_SNAPSHOT', '')
    vi.stubEnv('NODE_ENV', 'production')
    // A production build must never reach this fallback path at all — a
    // client that throws on any use turns an accidental query into a
    // failing test rather than a hang.
    vi.doMock('./supabase', () => ({
      supabaseSkills: {
        from: () => {
          throw new Error('a production build must not query Supabase here')
        },
      },
    }))
    const { getStaticSkillRefs } = await import('./db')
    await expect(getStaticSkillRefs()).rejects.toThrow(/npm run build/)
  })

  it('returns exactly SKILLS_STATIC_PAGE_LIMIT refs, most-installed first, from the snapshot alone (no query at all)', async () => {
    vi.resetModules()
    vi.doMock('./supabase', () => ({
      supabaseSkills: {
        from: () => {
          throw new Error('a present snapshot must not query Supabase')
        },
      },
    }))
    const { SKILLS_STATIC_PAGE_LIMIT } = await import('./db')
    const total = SKILLS_STATIC_PAGE_LIMIT + 5
    // installs descend with i, so the cut falls on the 5 lowest — i = total-5 .. total-1.
    const rows = Array.from({ length: total }, (_, i) => row(i, total - i))
    dir = mkdtempSync(path.join(tmpdir(), 'skills-static-refs-'))
    const file = path.join(dir, 'skills.ndjson')
    writeFileSync(
      file,
      `${[
        JSON.stringify({ generatedAt: 'now', count: total, lastSyncedAt: null }),
        ...rows.map((r) => JSON.stringify(r)),
      ].join('\n')}\n`,
    )
    vi.stubEnv('SKILLS_SNAPSHOT', file)
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { getStaticSkillRefs } = await import('./db')
    const refs = await getStaticSkillRefs()
    log.mockRestore()

    expect(refs).toHaveLength(SKILLS_STATIC_PAGE_LIMIT)
    expect(refs[0]).toEqual({ category: 'testing', slug: 's00000' })
    const slugs = new Set(refs.map((r) => r.slug))
    for (let i = total - 5; i < total; i++) {
      expect(slugs.has(`s${String(i).padStart(5, '0')}`)).toBe(false)
    }
    expect(slugs.has(`s${String(total - 6).padStart(5, '0')}`)).toBe(true)
  })
})
