/**
 * Decision logic for the production start wrapper's memory-pressure safety
 * valve (scripts/start.mjs). Kept pure and separate from the wrapper's
 * process/signal plumbing so both halves are unit-testable.
 *
 * Why this exists: the 2026-09-11 and 2026-09-14/15 crashes were both a
 * single process running for hours until *something* (an unbounded 'use
 * cache' store, then a poisoned image cache) pushed memory to the
 * container's hard ceiling and the OOM killer ended it mid-request, no
 * drain, no clean shutdown. Both root causes are now fixed, but a
 * long-lived Node process sharing a small container with a native image
 * library (sharp/libvips) has more ways to slowly grow than any one fix can
 * close off by inspection alone — see runtime-tuning.mjs's own docblock on
 * the memory categories V8's heap flag does not cover. Rather than trying to
 * prove a negative, this adds a second line of defence: recycle the process
 * *before* it gets near the ceiling, gracefully, so an unknown slow leak
 * degrades into an occasional planned restart instead of a repeat OOM-kill.
 */

/** Fraction of the container's memory limit at which RSS triggers a restart. */
export const DEFAULT_MEMORY_GUARD_RATIO = 0.85

/**
 * Whether current RSS is close enough to the container limit to warrant a
 * proactive, graceful restart. `false` whenever either input is unusable, so
 * a missing/unreadable limit never triggers a restart.
 */
export function shouldTriggerMemoryRestart(rssBytes, limitBytes, ratio = DEFAULT_MEMORY_GUARD_RATIO) {
  if (!Number.isFinite(rssBytes) || rssBytes <= 0) return false
  if (!Number.isFinite(limitBytes) || limitBytes <= 0) return false
  if (!Number.isFinite(ratio) || ratio <= 0) return false
  return rssBytes >= limitBytes * ratio
}

/**
 * Whether the wrapper should respawn the server after an unplanned exit
 * (memory-guard-triggered or an outright crash), given the timestamps (ms,
 * same clock as `now`) of recent respawns. Caps respawns per rolling window
 * so a genuinely broken boot (bad config, missing env var, crash-on-start)
 * fails loudly instead of looping forever and hiding the real problem.
 */
export function shouldRespawn(restartTimestamps, now, { maxRestarts = 5, windowMs = 10 * 60 * 1000 } = {}) {
  const recent = restartTimestamps.filter((t) => now - t < windowMs)
  return recent.length < maxRestarts
}
