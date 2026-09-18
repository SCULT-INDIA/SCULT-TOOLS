// `npm run build`: write the registry snapshot, then run `next build` with
// SKILLS_SNAPSHOT pointing at it.
//
// A wrapper rather than `node scripts/snapshot-skills.mjs && next build`
// because the second step has to receive the snapshot's path as an
// environment variable, and there is no portable way to set one inline in
// an npm script (`VAR=x cmd` is a shell-ism that fails on Windows, and
// adding cross-env for one variable is a dependency for no reason). The
// variable is what lib/skills/snapshot.ts keys on, so it is set here, once,
// explicitly — not inferred from NEXT_PHASE or the file's presence — and
// every process `next build` spawns (page-data collection, static
// generation workers) inherits it. It is never set at request time, so
// `next start` and Vercel's functions read Supabase exactly as before.
//
// MEMORY — measured, not assumed (2026-09-18, local runs shaped like Vercel's
// Standard build machine: 3 static-generation workers, clean .next). Vercel's
// machine has 8GB. The first version of this pipeline peaked at 8.3GB across
// the build's Node processes; a 1.5GB per-process heap cap alone brought that
// to 7.1GB but made workers GC-thrash (3× slower). What actually fixed it:
//
//   1. Skill bodies stay on disk (lib/skills/snapshot.ts reads the NDJSON
//      snapshot lazily, one ~10KB line per `getSkill`), so a worker's index
//      is tens of MB instead of the ~100MB of bodies plus parse overhead.
//   2. Render concurrency is back to 3 pages per worker (next.config.ts) —
//      the configuration that ran 46 minutes on that machine without an
//      OOM — instead of Next's default 8, which mostly buys in-flight garbage
//      once pages are CPU-bound.
//   3. The snapshot runs in its OWN process here. Done in-process, ~100MB of
//      JSON text and the parsed rows stayed resident in this wrapper for the
//      whole build (it sits idle inside spawnSync, so V8 never collects
//      them). A child process gives all of it back on exit.
//   4. (The decisive one.) 6,000 of the 10,000 skill pages are pre-rendered,
//      not all — `SKILLS_STATIC_PAGE_LIMIT` in lib/skills/db.ts. Points 1–3
//      still left the build at 8.05–8.3GB: the export retains ~250KB of
//      native memory per 'use cache' page per worker for the whole batch,
//      and a batch is ceil(pages / workers). Fewer pages per worker is the
//      only lever that moves that number on this machine.
//   5. Every Node process `next build` spawns gets `--max-old-space-size`,
//      set to what V8 would choose on an 8GB machine anyway. Its job is not
//      to squeeze memory (a cap near the live set thrashes, see above) but
//      to stop a worker ballooning toward a host-sized default if the build
//      container reports the host's RAM — and to fail with a readable heap
//      error rather than an OOM-kill with no message at minute 30.
//
// Exit codes propagate: a failed snapshot (short read, timeout, missing
// env) fails the build in seconds, before a single page is rendered, and a
// failed `next build` fails it the same way it always did.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SNAPSHOT_DIR, SNAPSHOT_FILE } from './snapshot-skills.mjs'

/** Per-process V8 old-space cap, MB — V8's own default on an 8GB machine.
 * Well above a worker's live set (list index + Next runtime + three in-flight
 * renders), so GC never thrashes; see the MEMORY note above for why it is
 * not set lower. `SKILLS_BUILD_HEAP_MB` overrides it for local memory
 * experiments only — it is not set on Vercel. */
const HEAP_MB = Number(process.env.SKILLS_BUILD_HEAP_MB) || 2048

const snapshotScript = fileURLToPath(new URL('./snapshot-skills.mjs', import.meta.url))
const snapshot = spawnSync(process.execPath, [snapshotScript], { stdio: 'inherit' })
if (snapshot.error) throw snapshot.error
if (snapshot.status !== 0) process.exit(snapshot.status ?? 1)

const snapshotPath = path.join(process.cwd(), SNAPSHOT_DIR, SNAPSHOT_FILE)
if (!existsSync(snapshotPath)) {
  throw new Error(`[build] snapshot step exited 0 but ${snapshotPath} does not exist`)
}

const require = createRequire(import.meta.url)
const nextBin = require.resolve('next/dist/bin/next')
const env = {
  ...process.env,
  SKILLS_SNAPSHOT: snapshotPath,
  // Appended, so it wins over any earlier --max-old-space-size the host
  // already set (Node honors the last occurrence).
  NODE_OPTIONS: [process.env.NODE_OPTIONS, `--max-old-space-size=${HEAP_MB}`]
    .filter(Boolean)
    .join(' '),
}
const result = spawnSync(process.execPath, [nextBin, 'build', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
})
if (result.error) throw result.error
process.exit(result.status ?? 1)
