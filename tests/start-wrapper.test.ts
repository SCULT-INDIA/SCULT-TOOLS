import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  cleanImageCache,
  parseImageCacheFilename,
  planImageCacheCleanup,
} from '../scripts/lib/image-cache.mjs'
import { hasHeapSizeFlag, heapSizeMbFor } from '../scripts/lib/runtime-tuning.mjs'

/**
 * The production start wrapper's two pure decisions, plus one real-filesystem
 * run of the image-cache repair. The 0-byte case is the one that mattered:
 * a single such file made Next's image LRU throw at boot and disabled image
 * caching for the whole process (see scripts/lib/image-cache.mjs).
 */

const NOW = 1_800_000_000_000
const future = NOW + 86_400_000
const past = NOW - 1

describe('parseImageCacheFilename', () => {
  it('reads maxAge and expireAt from the real filename shape', () => {
    expect(parseImageCacheFilename(`31536000.${future}.abc.def.webp`)).toEqual({
      maxAge: 31536000,
      expireAt: future,
    })
  })

  it('rejects anything that is not the five-part shape', () => {
    expect(parseImageCacheFilename('image.webp')).toBeNull()
    expect(parseImageCacheFilename(`x.${future}.abc.def.webp`)).toBeNull()
    expect(parseImageCacheFilename('60.notanumber.abc.def.webp')).toBeNull()
  })
})

describe('planImageCacheCleanup', () => {
  it('removes the 0-byte entry that poisons the LRU, and nothing healthy', () => {
    const plan = planImageCacheCleanup(
      [
        { key: 'good', files: [{ name: `60.${future}.a.b.webp`, size: 1234 }] },
        { key: 'poison', files: [{ name: `60.${future}.a.b.webp`, size: 0 }] },
      ],
      NOW,
    )
    expect(plan.keep).toBe(1)
    expect(plan.remove.map((r) => r.key)).toEqual(['poison'])
    expect(plan.remove[0]?.reason).toMatch(/0-byte/)
  })

  it('removes empty directories and malformed filenames', () => {
    const plan = planImageCacheCleanup(
      [
        { key: 'empty', files: [] },
        { key: 'weird', files: [{ name: 'thumbnail.webp', size: 10 }] },
      ],
      NOW,
    )
    expect(plan.remove.map((r) => r.key).sort()).toEqual(['empty', 'weird'])
  })

  it('prunes expired entries so the boot scan stays small', () => {
    const plan = planImageCacheCleanup(
      [
        { key: 'stale', files: [{ name: `60.${past}.a.b.webp`, size: 10 }] },
        { key: 'fresh', files: [{ name: `60.${future}.a.b.webp`, size: 10 }] },
      ],
      NOW,
    )
    expect(plan.remove).toEqual([{ key: 'stale', reason: 'expired' }])
    expect(plan.keep).toBe(1)
  })
})

describe('cleanImageCache (real temp directory)', () => {
  let dir: string
  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true })
  })

  it('deletes corrupt and expired entries and keeps healthy ones', async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'img-cache-'))
    const make = async (key: string, name: string, bytes: number) => {
      await mkdir(path.join(dir, key), { recursive: true })
      await writeFile(path.join(dir, key, name), Buffer.alloc(bytes, 1))
    }
    await make('healthy', `60.${future}.a.b.webp`, 512)
    await make('poison', `60.${future}.a.b.webp`, 0)
    await make('expired', `60.${past}.a.b.webp`, 512)
    await mkdir(path.join(dir, 'empty'))

    const result = await cleanImageCache(dir, NOW, () => {})

    expect(result).toEqual({ scanned: 4, removed: 3, kept: 1, corrupt: 2, expired: 1 })
    expect((await readdir(dir)).sort()).toEqual(['healthy'])
  })

  it('is a no-op on a missing cache directory', async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'img-cache-'))
    const result = await cleanImageCache(path.join(dir, 'does-not-exist'), NOW, () => {})
    expect(result).toEqual({ scanned: 0, removed: 0, kept: 0, corrupt: 0, expired: 0 })
  })
})

describe('heapSizeMbFor', () => {
  it('gives V8 60% of the container, leaving the rest for native memory', () => {
    expect(heapSizeMbFor(2 * 1024 * 1024 * 1024)).toBe(1228)
    expect(heapSizeMbFor(1024 * 1024 * 1024)).toBe(614)
  })

  it('never goes below a workable floor or above a sane ceiling', () => {
    expect(heapSizeMbFor(128 * 1024 * 1024)).toBe(256)
    expect(heapSizeMbFor(64 * 1024 * 1024 * 1024)).toBe(8192)
  })

  it('returns null when the limit is unknown', () => {
    expect(heapSizeMbFor(Number.NaN)).toBeNull()
    expect(heapSizeMbFor(0)).toBeNull()
  })
})

describe('hasHeapSizeFlag', () => {
  it('detects an operator-pinned heap so the wrapper respects it', () => {
    expect(hasHeapSizeFlag('--max-old-space-size=900')).toBe(true)
    expect(hasHeapSizeFlag('--max-old-space-size 900')).toBe(true)
    expect(hasHeapSizeFlag('--enable-source-maps')).toBe(false)
    expect(hasHeapSizeFlag(undefined)).toBe(false)
  })
})
