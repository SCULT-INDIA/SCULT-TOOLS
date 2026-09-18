// Writes the build-time registry snapshot: every served skill, every column,
// to .skills-snapshot/skills.ndjson. `next build` then renders all ~10,000
// skill pages from that one file instead of asking Supabase for each page.
//
// WHY THIS EXISTS (2026-09-18). The first production build that pre-rendered
// all 10,000 skill pages made ~20,000 Supabase REST calls from Vercel's
// build machine (one `getSkill` plus one category-wide `getSiblingSkills`
// sort per page), ran at ~900 pages/min for seven minutes, then produced no
// output of any kind for the remaining 38 — no page completed, no error was
// logged — until Vercel killed it at the 45-minute limit. A build that
// depends on 20,000 round-trips to one external API has 20,000 chances to
// hang, and a hang inside `'use cache'` during static generation is silent.
//
// The frozen registry (see lib/skills/db.ts's header: exactly 10,000 rows,
// nothing writes to them) makes the fix simple: read the whole table ONCE,
// up front, in ~10 paginated requests, and fail loudly here — in seconds,
// before any page is rendered — if anything about that read is off. Page
// generation itself then does no network I/O at all.
//
// Guarantees this file enforces, each of which has a real incident behind it:
//   - Paginated by keyset on `id` (never OFFSET, never one big SELECT):
//     PostgREST caps every response at 1,000 rows and reports the truncation
//     only in a header supabase-js discards, so an unpaginated read returns
//     1,000 rows with `error === null`. `general` alone has 4,118 skills.
//   - Row count checked against an exact `count` query, and slugs checked
//     for uniqueness per category — a short or duplicated snapshot throws,
//     so a partial registry can never be frozen into a deploy as if complete.
//   - Every request has a hard timeout and is retried a bounded number of
//     times, so a hung connection surfaces as an error, not a stalled build.
//
// Runs as the first step of `npm run build` via scripts/build.mjs, which
// then passes the file's path to `next build` as SKILLS_SNAPSHOT (read by
// lib/skills/snapshot.ts). Never runs at request time and the file is
// gitignored and excluded from function bundles (next.config.ts).
//
// Usage (standalone): node scripts/snapshot-skills.mjs
import { closeSync, mkdirSync, openSync, statSync, writeSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import nextEnv from '@next/env'
import { createClient } from '@supabase/supabase-js'

const { loadEnvConfig } = nextEnv

/**
 * Must equal lib/skills/row.ts's `SKILL_COLUMNS` exactly — asserted by
 * lib/skills/snapshot.test.ts. Duplicated rather than imported because
 * importing a `.ts` module from a plain Node script needs a Node flag the
 * deploy target's Node version isn't pinned for.
 */
export const SNAPSHOT_COLUMNS =
  'id, slug, category, name, description, tags, license, license_gated, source_owner, source_repo, source_skill_id, source_url, installs, first_seen_at, last_synced_at, related_tools, related_prompts, body'

export const SNAPSHOT_DIR = '.skills-snapshot'
/**
 * NDJSON, not one JSON document: line 1 is a small header
 * (`{generatedAt, count, lastSyncedAt}`), then exactly one row per line.
 * `JSON.stringify` never emits a raw newline, so "
" is an unambiguous
 * record separator — which lets lib/skills/snapshot.ts index every row by
 * byte offset and read a skill's ~10KB body on demand instead of holding
 * all ~100MB of bodies in every build worker's heap.
 */
export const SNAPSHOT_FILE = 'skills.ndjson'

/** Half of PostgREST's hard 1,000-row cap: ~5MB of bodies per response, which
 * keeps each request comfortably inside both REQUEST_TIMEOUT_MS and the anon
 * role's Postgres statement timeout even when Supabase is under load. */
const PAGE_SIZE = 500
const ATTEMPTS = 3
/** Generous for a 500-row page with bodies (~5MB), short enough that a hung
 * connection costs seconds of build time, not the whole build. */
const REQUEST_TIMEOUT_MS = 30_000

function fetchWithTimeout(input, init) {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  const signal =
    init?.signal && typeof AbortSignal.any === 'function'
      ? AbortSignal.any([init.signal, timeout])
      : (init?.signal ?? timeout)
  return fetch(input, { ...init, signal })
}

function describeError(error) {
  if (error !== null && typeof error === 'object') {
    const parts = [error.code && `[${error.code}]`, error.message, error.details].filter(Boolean)
    if (parts.length > 0) return parts.join(' ')
  }
  return String(error)
}

/** Runs a supabase-js query builder to completion, retrying bounded times on
 * either a PostgREST error or a transport failure (timeout, reset). */
async function withRetry(label, run, log) {
  let lastError = null
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const result = await run()
      if (!result.error) return result
      lastError = result.error
    } catch (error) {
      lastError = error
    }
    log(`[skills-snapshot] ${label} failed (attempt ${attempt}/${ATTEMPTS}): ${describeError(lastError)}`)
    if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, attempt * 1_000))
  }
  throw new Error(`[skills-snapshot] ${label} failed after ${ATTEMPTS} attempts: ${describeError(lastError)}`)
}

/**
 * Fetches the whole served registry and writes the snapshot file. Returns
 * the absolute path written. Throws — never writes a partial file — on any
 * inconsistency, so the caller (scripts/build.mjs) fails the build before
 * `next build` starts.
 */
export async function writeSnapshot({ cwd = process.cwd(), log = console.log } = {}) {
  const started = Date.now()
  // Loads .env.local etc. for a local run; on Vercel the variables are
  // already in the environment and no .env files exist, so this is a no-op.
  loadEnvConfig(cwd, false, { info: () => {}, error: console.error })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      '[skills-snapshot] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set',
    )
  }
  const supabase = createClient(url, key, {
    global: { fetch: fetchWithTimeout },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { count: expected } = await withRetry(
    'served count',
    () => supabase.from('skills').select('id', { count: 'exact', head: true }).eq('served', true),
    log,
  )
  if (typeof expected !== 'number' || expected <= 0) {
    throw new Error(`[skills-snapshot] served count query returned ${expected}`)
  }

  const rows = []
  let after = null
  for (;;) {
    const cursor = after
    const { data: page } = await withRetry(
      `skills page after id ${cursor ?? '(start)'} (${rows.length}/${expected} gathered)`,
      () => {
        const query = supabase
          .from('skills')
          .select(SNAPSHOT_COLUMNS)
          .eq('served', true)
          .order('id', { ascending: true })
          .limit(PAGE_SIZE)
        return cursor === null ? query : query.gt('id', cursor)
      },
      log,
    )
    // A table whose size is an exact multiple of PAGE_SIZE ends with one
    // empty page; nothing to record for it.
    if (page.length === 0) break
    rows.push(...page)
    log(`[skills-snapshot] ${rows.length}/${expected} rows`)
    if (page.length < PAGE_SIZE) break
    after = page[page.length - 1].id
  }

  if (rows.length !== expected) {
    throw new Error(
      `[skills-snapshot] read ${rows.length} rows but the table reports ${expected} served skills — refusing to build from a partial registry`,
    )
  }
  const keys = new Set()
  for (const row of rows) {
    const k = `${row.category}/${row.slug}`
    if (keys.has(k)) throw new Error(`[skills-snapshot] duplicate category/slug in registry: ${k}`)
    keys.add(k)
  }

  // The hub's "last synced" date lives in a separate one-row table. No row
  // is a legitimate state (getSyncMeta already handles null), so only a
  // query error is retried/fatal here.
  const { data: meta } = await withRetry(
    'skills_sync_meta',
    () => supabase.from('skills_sync_meta').select('last_synced_at').maybeSingle(),
    log,
  )

  const dir = path.join(cwd, SNAPSHOT_DIR)
  const file = path.join(dir, SNAPSHOT_FILE)
  mkdirSync(dir, { recursive: true })
  const out = openSync(file, 'w')
  try {
    writeSync(
      out,
      `${JSON.stringify({
        generatedAt: new Date().toISOString(),
        count: rows.length,
        lastSyncedAt: meta?.last_synced_at ?? null,
      })}
`,
    )
    for (const row of rows) writeSync(out, `${JSON.stringify(row)}
`)
  } finally {
    closeSync(out)
  }
  const mb = (statSync(file).size / 1_048_576).toFixed(1)
  log(
    `[skills-snapshot] wrote ${rows.length} skills (${mb} MB) to ${path.relative(cwd, file)} in ${((Date.now() - started) / 1000).toFixed(1)}s`,
  )
  return file
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
if (invokedDirectly) {
  writeSnapshot().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
