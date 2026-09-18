import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

// `'use cache'` helpers only exist inside a Next render; the module under
// test imports them at load time.
vi.mock('next/cache', () => ({ cacheLife: () => {}, cacheTag: () => {} }))
// `getStaticSkillRefs` must never reach Supabase; a client that throws on any
// use turns an accidental query into a failing test rather than a hang.
vi.mock('./supabase', () => ({
  supabaseSkills: {
    from: () => {
      throw new Error('getStaticSkillRefs must not query Supabase')
    },
    rpc: () => {
      throw new Error('getStaticSkillRefs must not query Supabase')
    },
  },
}))

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

describe('getStaticSkillRefs', () => {
  let dir: string | undefined

  afterEach(() => {
    vi.unstubAllEnvs()
    delete (globalThis as { [HOLDER]?: unknown })[HOLDER]
    if (dir) rmSync(dir, { recursive: true, force: true })
    dir = undefined
  })

  it('is empty outside a production build (dev server, tests): nothing to pre-render, no query', async () => {
    vi.stubEnv('SKILLS_SNAPSHOT', '')
    const { getStaticSkillRefs } = await import('./db')
    expect(await getStaticSkillRefs()).toEqual([])
  })

  it('refuses a production build that has no snapshot instead of pre-rendering against live Supabase', async () => {
    vi.stubEnv('SKILLS_SNAPSHOT', '')
    vi.stubEnv('NODE_ENV', 'production')
    const { getStaticSkillRefs } = await import('./db')
    await expect(getStaticSkillRefs()).rejects.toThrow(/npm run build/)
  })

  it('returns exactly SKILLS_STATIC_PAGE_LIMIT refs, most-installed first, from the snapshot alone', async () => {
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
