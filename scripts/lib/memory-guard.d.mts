export const DEFAULT_MEMORY_GUARD_RATIO: number

export function shouldTriggerMemoryRestart(
  rssBytes: number,
  limitBytes: number | null | undefined,
  ratio?: number,
): boolean

export function shouldRespawn(
  restartTimestamps: readonly number[],
  now: number,
  options?: { maxRestarts?: number; windowMs?: number },
): boolean
