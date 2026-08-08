'use client'

import { TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'

/** A verification is stale once it's older than this — chosen as a
 * deliberately short window: AI models genuinely change fast enough that
 * half a year of silence is itself informative, not just a nice-to-have
 * badge. */
const STALE_AFTER_DAYS = 180

/**
 * Client component on purpose: reading the current time in a prerendered
 * Server Component is rejected under Cache Components (the value would be
 * frozen into static HTML — same constraint documented in next.config.ts
 * for NEXT_PUBLIC_BUILD_YEAR). Computing in useEffect keeps the badge
 * honest against the reader's actual "today", even on an old deploy —
 * which matters, because a stale deploy is exactly the scenario this
 * warning exists for.
 */
export function StaleVerificationNotice({ latestDate }: { latestDate?: string }) {
  const [isStale, setIsStale] = useState(false)

  useEffect(() => {
    if (!latestDate) {
      setIsStale(true)
      return
    }
    const then = new Date(latestDate).getTime()
    if (Number.isNaN(then)) {
      setIsStale(true)
      return
    }
    const days = Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24))
    setIsStale(days > STALE_AFTER_DAYS)
  }, [latestDate])

  if (!isStale) return null

  return (
    <p className="flex items-start gap-2 text-[13px] text-ink-subtle leading-5">
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      Not re-verified in the last {STALE_AFTER_DAYS} days — the tool above may have
      changed since. Worth a quick sanity check before relying on it.
    </p>
  )
}
