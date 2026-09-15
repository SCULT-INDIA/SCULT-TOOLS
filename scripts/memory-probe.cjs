'use strict'
/**
 * Preloaded into the production server (`node -r scripts/memory-probe.cjs`
 * from scripts/start.mjs). Prints one line of memory figures on a fixed
 * interval so the platform's log stream carries the memory curve — the one
 * thing that was missing when this app kept dying of OOM: the logs showed
 * the crash, never the climb.
 *
 * No forced GC, no heap snapshots — a few reads of `process.memoryUsage()`
 * per hour cost nothing. `MEMORY_LOG_INTERVAL_SEC=0` turns it off.
 */
const intervalSec = Number(process.env.MEMORY_LOG_INTERVAL_SEC ?? '300')

if (Number.isFinite(intervalSec) && intervalSec > 0) {
  const mb = (n) => `${Math.round(n / (1024 * 1024))}MB`
  const timer = setInterval(() => {
    const m = process.memoryUsage()
    const up = Math.round(process.uptime())
    const h = Math.floor(up / 3600)
    const min = Math.floor((up % 3600) / 60)
    console.log(
      `[memory] rss=${mb(m.rss)} heap=${mb(m.heapUsed)}/${mb(m.heapTotal)} external=${mb(m.external)} arrayBuffers=${mb(m.arrayBuffers)} uptime=${h}h${String(min).padStart(2, '0')}m`,
    )
  }, intervalSec * 1000)
  // Never keep the process alive on its own account.
  timer.unref()
}
