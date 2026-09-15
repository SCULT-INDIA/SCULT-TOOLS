'use strict'
/**
 * Preloaded into the production server (`node -r scripts/memory-probe.cjs`
 * from scripts/start.mjs). Two jobs on the same interval timer:
 *
 *   1. Prints one line of memory figures so the platform's log stream
 *      carries the memory curve — the one thing that was missing when this
 *      app kept dying of OOM: the logs showed the crash, never the climb.
 *   2. Watches RSS against the container limit (passed down from the
 *      wrapper via MEMORY_GUARD_LIMIT_BYTES, the same cgroup read already
 *      used to size the heap) and, if it climbs past a safe threshold,
 *      triggers this process's own graceful shutdown *before* the OOM
 *      killer would. See scripts/lib/memory-guard.mjs for why this exists
 *      as a second line of defence, not a replacement for fixing leaks.
 *
 * A plain `setInterval` read of `process.memoryUsage()` a few times an hour
 * costs nothing, so this stays production-safe: no forced GC, no heap
 * snapshots. `MEMORY_LOG_INTERVAL_SEC=0` turns off both the logging and the
 * guard.
 *
 * The trigger check itself is restated inline (matching
 * scripts/lib/memory-guard.mjs's `shouldTriggerMemoryRestart`, which is the
 * unit-tested and wrapper-facing copy) rather than imported, so this preload
 * — loaded via `--require` into the actual `next start` process — never
 * depends on Node's require(ESM) interop.
 */
function shouldTriggerMemoryRestart(rssBytes, limitBytes, ratio) {
  if (!Number.isFinite(rssBytes) || rssBytes <= 0) return false
  if (!Number.isFinite(limitBytes) || limitBytes <= 0) return false
  if (!Number.isFinite(ratio) || ratio <= 0) return false
  return rssBytes >= limitBytes * ratio
}

const intervalSec = Number(process.env.MEMORY_LOG_INTERVAL_SEC ?? '300')
const limitBytes = Number(process.env.MEMORY_GUARD_LIMIT_BYTES ?? '')
const guardRatio = Number(process.env.MEMORY_GUARD_RATIO ?? '0.85')

if (Number.isFinite(intervalSec) && intervalSec > 0) {
  const mb = (n) => `${Math.round(n / (1024 * 1024))}MB`
  let restarting = false
  const timer = setInterval(() => {
    const m = process.memoryUsage()
    const up = Math.round(process.uptime())
    const h = Math.floor(up / 3600)
    const min = Math.floor((up % 3600) / 60)
    console.log(
      `[memory] rss=${mb(m.rss)} heap=${mb(m.heapUsed)}/${mb(m.heapTotal)} external=${mb(m.external)} arrayBuffers=${mb(m.arrayBuffers)} uptime=${h}h${String(min).padStart(2, '0')}m`,
    )

    if (restarting) return
    if (shouldTriggerMemoryRestart(m.rss, limitBytes, guardRatio)) {
      restarting = true
      console.log(
        `[memory-guard] rss=${mb(m.rss)} crossed ${Math.round(guardRatio * 100)}% of the ${mb(limitBytes)} container limit — requesting a graceful restart before the OOM killer would`,
      )
      // Reuses Next's own SIGTERM handling (in-flight requests drain, then
      // exit) — the same signal the wrapper forwards for a real deploy. The
      // wrapper tells the two apart by whether *it* was asked to shut down;
      // see scripts/start.mjs.
      process.kill(process.pid, 'SIGTERM')
    }
  }, intervalSec * 1000)
  // Never keep the process alive on its own account.
  timer.unref()
}
