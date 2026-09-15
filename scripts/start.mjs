#!/usr/bin/env node
/**
 * Production start wrapper — what `npm start` runs on Railway.
 *
 * `next start` on a single long-lived container died of memory in two
 * distinct ways (see the Railway logs from 2026-09-11 to 2026-09-15): V8
 * heap exhaustion at a heuristic ~480MB ceiling, and container OOM kills
 * ("Killed") from native memory — sharp/libvips re-encoding every image on
 * every request once a 0-byte file had poisoned Next's image disk cache.
 * Both are fixed (bounded 'use cache' + image-cache hygiene below), but a
 * third round of production logs (2026-09-15) showed `external`/
 * `arrayBuffers` — memory categories V8's heap flag does not cover, see
 * runtime-tuning.mjs — still climbing over hours toward the container
 * ceiling. This wrapper does what a bare `next start` cannot:
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
 *   4. Preloads a memory probe that both logs the memory curve and, if RSS
 *      still climbs past a safe watermark, gracefully recycles the process
 *      before the OOM killer would (scripts/memory-probe.cjs).
 *   5. Respawns the server after any exit it didn't itself request (a
 *      memory-guard restart, or an outright crash), capped so a genuinely
 *      broken boot fails loudly instead of looping forever
 *      (scripts/lib/memory-guard.mjs).
 *
 * A real external shutdown (Railway's own SIGTERM on redeploy) still drains
 * in-flight requests and exits for good — the wrapper only re-spawns when
 * the child went away on its own. Nothing here is Railway-specific; on a
 * machine without cgroups it simply sizes from total RAM and the memory
 * guard never trips (no limit to compare against).
 */
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cleanImageCache } from './lib/image-cache.mjs'
import { shouldRespawn } from './lib/memory-guard.mjs'
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

// 2. Heap sizing from the container limit, and the same limit passed down
//    to the memory guard so both draw on one cgroup read.
const nodeArgs = []
const memoryLimit = await readContainerMemoryLimit()
const inheritedOptions = process.env.NODE_OPTIONS ?? ''
if (hasHeapSizeFlag(inheritedOptions)) {
  log(`heap: respecting NODE_OPTIONS (${inheritedOptions.trim()})`)
} else {
  const heapMb = heapSizeMbFor(memoryLimit)
  if (heapMb) {
    nodeArgs.push(`--max-old-space-size=${heapMb}`)
    log(`heap: memory limit ${Math.round(memoryLimit / (1024 * 1024))}MB -> --max-old-space-size=${heapMb}`)
  } else {
    log('heap: no memory limit readable, leaving V8 defaults')
  }
}

// 3. glibc arena cap for sharp/libvips (harmless where glibc isn't in use).
const env = { ...process.env }
if (!env.MALLOC_ARENA_MAX) env.MALLOC_ARENA_MAX = '2'
if (memoryLimit && !env.MEMORY_GUARD_LIMIT_BYTES) {
  env.MEMORY_GUARD_LIMIT_BYTES = String(memoryLimit)
}

// 4. Memory probe preload (logs the curve; self-restarts near the ceiling).
nodeArgs.push('--require', path.join(here, 'memory-probe.cjs'))

// Hand off to the real `next start`. Spawned as a child (rather than
// re-exec'd) so the heap flag applies without touching NODE_OPTIONS, which
// would also leak into any process Next itself spawns. Any args this script
// itself was called with (e.g. `npm start -- -p 8080`) pass straight through,
// so this wrapper is a drop-in replacement for the bare `next start` it
// carries forward as `start:raw`.
const passthroughArgs = process.argv.slice(2)
const nextBin = require.resolve('next/dist/bin/next')

// Set once a real external shutdown signal arrives, so the exit handler
// below can tell "Railway told us to stop" apart from "the child went away
// on its own" (a memory-guard restart, or a crash) — only the latter should
// respawn.
let shuttingDown = false
let child = null
const restartTimestamps = []

function spawnChild() {
  child = spawn(process.execPath, [...nodeArgs, nextBin, 'start', ...passthroughArgs], {
    cwd: root,
    env,
    stdio: 'inherit',
  })
  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      if (signal) {
        log(`next start exited on ${signal}`)
        process.exit(1)
      }
      process.exit(code ?? 0)
      return
    }

    const now = Date.now()
    log(`next start exited unexpectedly (code=${code ?? 'null'} signal=${signal ?? 'null'}) — restarting`)
    if (!shouldRespawn(restartTimestamps, now)) {
      log('too many restarts in a short window — giving up so this fails loudly instead of looping forever')
      process.exit(1)
      return
    }
    restartTimestamps.push(now)
    setTimeout(spawnChild, 2000)
  })
  child.on('error', (err) => {
    log(`failed to launch next start: ${err.message}`)
    process.exit(1)
  })
}

spawnChild()

for (const signal of ['SIGTERM', 'SIGINT', 'SIGHUP']) {
  process.on(signal, () => {
    shuttingDown = true
    if (child && !child.killed) child.kill(signal)
  })
}
