import { promises as fs } from 'node:fs'
import os from 'node:os'

/**
 * Memory tuning for a long-lived `next start` process in a container.
 *
 * V8 picks its own heap ceiling from a heuristic on physical memory, and in a
 * container that heuristic is what actually decided when this app died: the
 * Railway crash logs show every "JavaScript heap out of memory" landing at
 * the same ~480MB heap regardless of how much RAM the container had. Sizing
 * the heap explicitly from the container's real cgroup limit uses the memory
 * we are already paying for, and leaves a known share for native memory
 * (sharp/libvips image encoding lives there, outside the JS heap).
 */

const MB = 1024 * 1024

/**
 * The container's memory limit in bytes, if one is set: cgroup v2, then v1,
 * then the host's total memory as a last resort. `null` only if nothing is
 * readable at all.
 */
export async function readContainerMemoryLimit() {
  const candidates = [
    '/sys/fs/cgroup/memory.max',
    '/sys/fs/cgroup/memory/memory.limit_in_bytes',
  ]
  for (const file of candidates) {
    try {
      const raw = (await fs.readFile(file, 'utf8')).trim()
      if (raw === 'max') continue
      const n = Number(raw)
      // cgroup v1 reports an absurdly large number when unlimited.
      if (Number.isFinite(n) && n > 0 && n < 1024 * 1024 * MB) return n
    } catch {
      // not present on this platform
    }
  }
  const total = os.totalmem()
  return Number.isFinite(total) && total > 0 ? total : null
}

/**
 * How large the V8 old space should be for a given memory budget, in MB.
 *
 * 60% of the limit: the remaining 40% is headroom for everything V8 does not
 * count against the heap — sharp/libvips buffers, Node's own native memory,
 * the young generation, and the OS-level slack that stops the container's
 * OOM killer from firing before V8's own limit does. Clamped so a tiny
 * container still gets a workable heap and a huge one doesn't get an
 * absurd one.
 */
export function heapSizeMbFor(limitBytes, ratio = 0.6) {
  if (!Number.isFinite(limitBytes) || limitBytes <= 0) return null
  const mb = Math.floor((limitBytes * ratio) / MB)
  return Math.min(Math.max(mb, 256), 8192)
}

/** Whether a NODE_OPTIONS string already pins the heap size. */
export function hasHeapSizeFlag(nodeOptions) {
  return /--max-old-space-size(=|\s)/.test(nodeOptions ?? '')
}
