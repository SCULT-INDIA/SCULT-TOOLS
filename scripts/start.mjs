#!/usr/bin/env node
/**
 * Production start wrapper — what `npm start` runs on Railway.
 *
 * `next start` on a single long-lived container died of memory in two
 * distinct ways (see the Railway logs from 2026-09-11 to 2026-09-15): V8
 * heap exhaustion at a heuristic ~480MB ceiling, and container OOM kills
 * ("Killed") from native memory — sharp/libvips re-encoding every image on
 * every request once a 0-byte file had poisoned Next's image disk cache.
 * This wrapper does the four things a bare `next start` cannot:
 *
 *   1. Repairs the image disk cache before Next opens it, so a crash can
 *      never leave behind a file that breaks image caching on the next boot
 *      (scripts/lib/image-cache.mjs explains the mechanism).
 *   2. Sizes the V8 heap from the container's real memory limit instead of
 *      V8's guess, leaving a fixed share for native memory
 *      (scripts/lib/runtime-tuning.mjs).
 *   3. Sets MALLOC_ARENA_MAX=2 — glibc's default per-thread malloc arenas
 *      are the documented cause of runaway RSS with libvips on Linux; both
 *      the sharp and Next.js self-hosting docs recommend this.
 *   4. Preloads a tiny memory probe so the memory curve shows up in the
 *      platform logs (scripts/memory-probe.cjs).
 *
 * Then it hands off to the real `next start`, forwarding signals so Railway's
 * SIGTERM still drains in-flight requests. Nothing here is Railway-specific;
 * on a machine without cgroups it simply sizes from total RAM.
 */
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cleanImageCache } from './lib/image-cache.mjs'
import {
  hasHeapSizeFlag,
  heapSizeMbFor,
  readContainerMemoryLimit,
} from './lib/runtime-tuning.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const require = createRequire(import.meta.url)
const log = (msg) => console.log(`[start] ${msg}`)

// 1. Image cache hygiene — must finish before Next's first image request.
try {
  const result = await cleanImageCache(path.join(root, '.next', 'cache', 'images'))
  log(
    `image cache: ${result.scanned} entries scanned, ${result.kept} kept, ${result.corrupt} corrupt removed, ${result.expired} expired pruned`,
  )
} catch (err) {
  log(`image cache hygiene skipped: ${err && err.message}`)
}

// 2. Heap sizing from the container limit.
const nodeArgs = []
const inheritedOptions = process.env.NODE_OPTIONS ?? ''
if (hasHeapSizeFlag(inheritedOptions)) {
  log(`heap: respecting NODE_OPTIONS (${inheritedOptions.trim()})`)
} else {
  const limit = await readContainerMemoryLimit()
  const heapMb = heapSizeMbFor(limit)
  if (heapMb) {
    nodeArgs.push(`--max-old-space-size=${heapMb}`)
    log(`heap: memory limit ${Math.round(limit / (1024 * 1024))}MB -> --max-old-space-size=${heapMb}`)
  } else {
    log('heap: no memory limit readable, leaving V8 defaults')
  }
}

// 3. glibc arena cap for sharp/libvips (harmless where glibc isn't in use).
const env = { ...process.env }
if (!env.MALLOC_ARENA_MAX) env.MALLOC_ARENA_MAX = '2'

// 4. Memory probe preload.
nodeArgs.push('--require', path.join(here, 'memory-probe.cjs'))

// Hand off to the real `next start`. Spawned as a child (rather than
// re-exec'd) so the heap flag applies without touching NODE_OPTIONS, which
// would also leak into any process Next itself spawns. Any args this script
// itself was called with (e.g. `npm start -- -p 8080`) pass straight through,
// so this wrapper is a drop-in replacement for the bare `next start` it
// carries forward as `start:raw`.
const passthroughArgs = process.argv.slice(2)
const nextBin = require.resolve('next/dist/bin/next')
const child = spawn(
  process.execPath,
  [...nodeArgs, nextBin, 'start', ...passthroughArgs],
  { cwd: root, env, stdio: 'inherit' },
)

for (const signal of ['SIGTERM', 'SIGINT', 'SIGHUP']) {
  process.on(signal, () => {
    if (!child.killed) child.kill(signal)
  })
}
child.on('exit', (code, signal) => {
  if (signal) {
    log(`next start exited on ${signal}`)
    process.exit(1)
  }
  process.exit(code ?? 0)
})
child.on('error', (err) => {
  log(`failed to launch next start: ${err.message}`)
  process.exit(1)
})
