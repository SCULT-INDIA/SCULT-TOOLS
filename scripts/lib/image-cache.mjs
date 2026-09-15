import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Hygiene for Next.js's on-disk image-optimizer cache (`.next/cache/images`).
 *
 * Why this exists — the production incident it closes: Next stores each
 * optimized image as `.next/cache/images/<key>/<maxAge>.<expireAt>.<etag>.<upstreamEtag>.<ext>`
 * and, on the FIRST image request after boot, walks that whole directory to
 * seed a disk-usage LRU (`getOrInitDiskLRU` in next/dist/server/lib/
 * disk-lru-cache.external.js), calling `lru.set(key, file.byteLength)` for
 * every entry. Its LRU throws on a size of 0 — "calculateSize returned 0 ...
 * Items with size 0 would never be evicted" — and that throw happens inside
 * a module-level promise that is created once and never reset. So a single
 * 0-byte file anywhere in the cache (left behind when a process is killed
 * mid-write, which is exactly what an OOM kill does) poisons image caching
 * for the entire life of the process: every `get` throws (cache MISS for
 * every image, even ones sitting right there on disk), every `set` throws
 * ("Failed to write image to cache <key>"), and every image request re-runs
 * a full sharp encode. Because the corrupt file persists on the container's
 * disk across process restarts, every restart re-poisons itself instantly —
 * the self-reinforcing loop seen in the Railway logs on 2026-09-14/15.
 *
 * Removing corrupt entries BEFORE `next start` breaks that loop
 * deterministically. Expired entries are pruned at the same time so the boot
 * scan (which reads every cached file fully into memory just to learn its
 * size) stays small and cheap.
 */

/** Parses `<maxAge>.<expireAt>.<etag>.<upstreamEtag>.<ext>`; null if malformed. */
export function parseImageCacheFilename(name) {
  const parts = name.split('.')
  if (parts.length < 5) return null
  const maxAge = Number(parts[0])
  const expireAt = Number(parts[1])
  if (!Number.isFinite(maxAge) || !Number.isFinite(expireAt) || expireAt <= 0) return null
  return { maxAge, expireAt }
}

/**
 * Decides which cache-entry directories to delete. Pure: takes the listing,
 * returns the plan, so it can be tested without touching a filesystem.
 *
 * @param {Array<{ key: string, files: Array<{ name: string, size: number }> }>} entries
 * @param {number} now — epoch ms
 * @returns {{ remove: Array<{ key: string, reason: string }>, keep: number }}
 */
export function planImageCacheCleanup(entries, now) {
  const remove = []
  let keep = 0
  for (const entry of entries) {
    let reason = null
    if (entry.files.length === 0) {
      reason = 'empty directory'
    } else {
      for (const file of entry.files) {
        if (file.size === 0) {
          reason = `0-byte file ${file.name} (poisons Next's image LRU)`
          break
        }
        const parsed = parseImageCacheFilename(file.name)
        if (!parsed) {
          reason = `malformed filename ${file.name}`
          break
        }
        if (parsed.expireAt <= now) {
          reason = 'expired'
          break
        }
      }
    }
    if (reason) remove.push({ key: entry.key, reason })
    else keep++
  }
  return { remove, keep }
}

/** Reads `<cacheDir>/<key>/*` into the shape `planImageCacheCleanup` expects. */
export async function listImageCacheEntries(cacheDir) {
  let keys
  try {
    keys = await fs.readdir(cacheDir)
  } catch (err) {
    if (err && err.code === 'ENOENT') return []
    throw err
  }
  const entries = []
  for (const key of keys) {
    const dir = path.join(cacheDir, key)
    let stat
    try {
      stat = await fs.stat(dir)
    } catch {
      continue
    }
    if (!stat.isDirectory()) continue
    const names = await fs.readdir(dir)
    const files = []
    for (const name of names) {
      try {
        const s = await fs.stat(path.join(dir, name))
        if (s.isFile()) files.push({ name, size: s.size })
      } catch {
        files.push({ name, size: 0 })
      }
    }
    entries.push({ key, files })
  }
  return entries
}

/**
 * Applies the plan. Never throws on a single bad entry — a hygiene pass must
 * not be able to stop the server from starting.
 *
 * @returns {Promise<{ scanned: number, removed: number, kept: number, corrupt: number, expired: number }>}
 */
export async function cleanImageCache(cacheDir, now = Date.now(), log = console.log) {
  const entries = await listImageCacheEntries(cacheDir)
  const plan = planImageCacheCleanup(entries, now)
  let removed = 0
  let corrupt = 0
  let expired = 0
  for (const { key, reason } of plan.remove) {
    try {
      await fs.rm(path.join(cacheDir, key), { recursive: true, force: true })
      removed++
      if (reason === 'expired') expired++
      else {
        corrupt++
        log(`[image-cache] removed corrupt entry ${key}: ${reason}`)
      }
    } catch (err) {
      log(`[image-cache] could not remove ${key}: ${err && err.message}`)
    }
  }
  return { scanned: entries.length, removed, kept: plan.keep, corrupt, expired }
}
