import { openSync, readFileSync, readSync } from 'node:fs'
import { rowToSkill } from './row'
import type { Skill, SkillCategorySlug } from './types'

/**
 * The build-time registry snapshot: the whole served `skills` table, read
 * once from the NDJSON file scripts/snapshot-skills.mjs writes, indexed the
 * way ./db.ts's queries need it. Active only while `SKILLS_SNAPSHOT` is set,
 * which scripts/build.mjs does for `next build` and nothing does at request
 * time — so every ./db.ts function serves the build from this index and
 * serves `next start` / Vercel functions from Supabase, unchanged.
 *
 * Why (2026-09-18): pre-rendering all 10,000 skill pages straight from
 * Supabase meant ~20,000 REST calls per build. The first such production
 * build ran for seven minutes, then made no progress of any kind for 38
 * more — no completed page, no logged error — until Vercel's 45-minute
 * limit killed it. Whether the calls hung at Supabase's gateway or were
 * throttled, the lesson is the same: a static build must not depend on
 * tens of thousands of network round-trips. With this file the build makes
 * about twenty (the snapshot's own paginated read), all before the first
 * page renders, all with hard timeouts.
 *
 * Also what makes the build fail LOUDLY instead of quietly wrong: with the
 * live queries, a Supabase error inside `getSkill` returned `undefined`,
 * and the page then called `notFound()` — a real skill silently frozen as
 * a static 404. A snapshot lookup cannot error, and a miss during the
 * build is a bug ./db.ts throws on.
 *
 * MEMORY — the reason this is NDJSON with lazy bodies, not one parsed JSON
 * document. The file is ~100MB, almost all of it SKILL.md bodies (~10KB
 * each × 10,000). A first version parsed the whole thing and kept every
 * body in each build worker's heap; measured on a machine shaped like
 * Vercel's Standard build box (3 workers), the build's processes together
 * peaked at 8.3GB — on an 8GB machine. Bodies are only ever needed one at
 * a time, by `getSkill` for the page being rendered, so they stay on disk:
 * loading scans the file once for line boundaries, keeps the list-shaped
 * columns (no body — the same shape as ./row.ts's SKILL_LIST_COLUMNS, so a
 * category page's payload is identical to the live query's) plus a byte
 * offset per skill, and `skill()` reads its ~10KB line with one `readSync`
 * on demand. Steady-state per worker: tens of MB, not hundreds.
 *
 * The index is held on `globalThis`: Next bundles lib/ into each route's
 * server chunk separately, so a plain module-level cache would be built
 * once per route per worker.
 */

export interface SkillRef {
  readonly slug: string
  readonly category: string
  readonly lastSyncedAt: string
}

export interface SkillsSnapshot {
  /** Served skills in the registry — the exact count the snapshot script
   * verified its rows against. */
  readonly count: number
  /** `skills_sync_meta.last_synced_at`, or null if that table has no row. */
  readonly lastSyncedAt: string | null
  /** The full skill, body included — the detail page's read. */
  skill(category: SkillCategorySlug, slug: string): Skill | undefined
  /** Every skill in a category, most-installed first, list-shaped (no body). */
  category(category: SkillCategorySlug): readonly Skill[]
  /** Every skill, most-installed first, list-shaped. */
  all(): readonly Skill[]
  /** Every skill, most recently first-indexed first, list-shaped. */
  recentlyAdded(): readonly Skill[]
  /** (slug, category, lastSyncedAt) for every skill in a stable total
   * order (`id` ascending) — the sitemap's shards slice this. */
  refs(): readonly SkillRef[]
  categoryCounts(): Readonly<Record<string, number>>
}

/** Line 1 of the NDJSON file. */
interface SnapshotHeader {
  readonly generatedAt: string
  readonly count: number
  readonly lastSyncedAt: string | null
}

/** Deterministic where Postgres would be arbitrary: ties on `installs` (or
 * `firstSeenAt`) fall back to `id`, so two workers indexing the same rows
 * produce the same order and the same page contents. */
function byId(a: Skill, b: Skill): number {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
}
function byInstallsDesc(a: Skill, b: Skill): number {
  return b.installs - a.installs || byId(a, b)
}
function byFirstSeenDesc(a: Skill, b: Skill): number {
  return a.firstSeenAt < b.firstSeenAt
    ? 1
    : a.firstSeenAt > b.firstSeenAt
      ? -1
      : byId(a, b)
}

/**
 * Builds the index from list-shaped rows (raw DB rows WITHOUT `body`) and a
 * loader for the full row. Exported for tests; production callers go
 * through `loadBuildSnapshot`, which supplies a loader that reads the
 * skill's line from the file.
 */
export function buildSnapshot(
  listRows: readonly unknown[],
  lastSyncedAt: string | null,
  loadFull: (category: string, slug: string) => Skill | undefined,
): SkillsSnapshot {
  const seen = new Set<string>()
  const list: Skill[] = []
  for (const row of listRows) {
    const skill = rowToSkill(row)
    const key = `${skill.category}/${skill.slug}`
    if (seen.has(key)) throw new Error(`[skills-snapshot] duplicate skill ${key}`)
    seen.add(key)
    list.push(skill)
  }

  const all = [...list].sort(byInstallsDesc)
  const recentlyAdded = [...list].sort(byFirstSeenDesc)
  const perCategory = new Map<string, Skill[]>()
  for (const skill of all) {
    const bucket = perCategory.get(skill.category)
    if (bucket) bucket.push(skill)
    else perCategory.set(skill.category, [skill])
  }
  const refs: SkillRef[] = [...list].sort(byId).map((s) => ({
    slug: s.slug,
    category: s.category,
    lastSyncedAt: s.lastSyncedAt,
  }))
  const counts: Record<string, number> = {}
  for (const [category, bucket] of perCategory) counts[category] = bucket.length
  const EMPTY: readonly Skill[] = []

  return {
    count: list.length,
    lastSyncedAt,
    skill: (category, slug) =>
      seen.has(`${category}/${slug}`) ? loadFull(category, slug) : undefined,
    category: (category) => perCategory.get(category) ?? EMPTY,
    all: () => all,
    recentlyAdded: () => recentlyAdded,
    refs: () => refs,
    categoryCounts: () => counts,
  }
}

const NEWLINE = 0x0a

/**
 * Parses the NDJSON snapshot: list-shaped rows in memory, a byte span per
 * skill, and a loader that reads one skill's line on demand. Exported for
 * tests; `loadBuildSnapshot` is the memoized production entry point.
 */
export function readSnapshotFile(file: string): SkillsSnapshot {
  // One read of the whole file as bytes. It is garbage as soon as this
  // function returns — nothing below keeps a reference to it — so the
  // ~100MB is a transient peak, not a resident cost.
  const bytes = readFileSync(file)
  const headerEnd = bytes.indexOf(NEWLINE)
  if (headerEnd === -1) throw new Error(`[skills-snapshot] ${file} has no header line`)
  const header = JSON.parse(bytes.toString('utf8', 0, headerEnd)) as SnapshotHeader

  const spans = new Map<string, { offset: number; length: number }>()
  const listRows: unknown[] = []
  let start = headerEnd + 1
  while (start < bytes.length) {
    let end = bytes.indexOf(NEWLINE, start)
    if (end === -1) end = bytes.length
    if (end > start) {
      const row = JSON.parse(bytes.toString('utf8', start, end)) as {
        category: string
        slug: string
        body?: string
      }
      spans.set(`${row.category}/${row.slug}`, { offset: start, length: end - start })
      // List shape: the body was parsed, but is dropped here before anything
      // can retain it. `rowToSkill` then yields body: '' exactly as it does
      // for a live SKILL_LIST_COLUMNS row.
      row.body = undefined
      listRows.push(row)
    }
    start = end + 1
  }

  if (listRows.length !== header.count || header.count === 0) {
    throw new Error(
      `[skills-snapshot] ${file} is inconsistent: header count=${header.count}, rows=${listRows.length}`,
    )
  }

  const fd = openSync(file, 'r')
  const loadFull = (category: string, slug: string): Skill | undefined => {
    const span = spans.get(`${category}/${slug}`)
    if (!span) return undefined
    const line = Buffer.allocUnsafe(span.length)
    const read = readSync(fd, line, 0, span.length, span.offset)
    if (read !== span.length) {
      throw new Error(
        `[skills-snapshot] short read for ${category}/${slug}: ${read} of ${span.length} bytes`,
      )
    }
    return rowToSkill(JSON.parse(line.toString('utf8')))
  }

  return buildSnapshot(listRows, header.lastSyncedAt ?? null, loadFull)
}

const HOLDER = Symbol.for('tools.scult.in/skills-snapshot')
type Holder = typeof globalThis & { [HOLDER]?: SkillsSnapshot }

/**
 * The snapshot for this build, or `null` outside a build. Reads the file
 * named by `SKILLS_SNAPSHOT` once per process; a set variable with an
 * unreadable or inconsistent file is a broken build and throws.
 */
export function loadBuildSnapshot(): SkillsSnapshot | null {
  const file = process.env.SKILLS_SNAPSHOT
  if (!file) return null
  const holder = globalThis as Holder
  const cached = holder[HOLDER]
  if (cached) return cached

  const started = Date.now()
  const snapshot = readSnapshotFile(file)
  holder[HOLDER] = snapshot
  console.log(
    `[skills-snapshot] pid ${process.pid}: indexed ${snapshot.count} skills from ${file} in ${Date.now() - started}ms`,
  )
  return snapshot
}
