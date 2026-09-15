export function readContainerMemoryLimit(): Promise<number | null>

export function heapSizeMbFor(limitBytes: number, ratio?: number): number | null

export function hasHeapSizeFlag(nodeOptions: string | undefined): boolean
