export interface ImageCacheFile {
  readonly name: string
  readonly size: number
}

export interface ImageCacheEntry {
  readonly key: string
  readonly files: readonly ImageCacheFile[]
}

export interface ImageCacheRemoval {
  readonly key: string
  readonly reason: string
}

export interface ImageCacheCleanupPlan {
  readonly remove: readonly ImageCacheRemoval[]
  readonly keep: number
}

export interface ImageCacheCleanupResult {
  readonly scanned: number
  readonly removed: number
  readonly kept: number
  readonly corrupt: number
  readonly expired: number
}

export function parseImageCacheFilename(
  name: string,
): { maxAge: number; expireAt: number } | null

export function planImageCacheCleanup(
  entries: readonly ImageCacheEntry[],
  now: number,
): ImageCacheCleanupPlan

export function listImageCacheEntries(cacheDir: string): Promise<ImageCacheEntry[]>

export function cleanImageCache(
  cacheDir: string,
  now?: number,
  log?: (message: string) => void,
): Promise<ImageCacheCleanupResult>
