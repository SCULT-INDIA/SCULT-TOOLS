'use client'

import { useEffect, useState } from 'react'

/**
 * Reference: band 15's footer credibility bar — "Draftss has been servicing
 * since 8 years 2 months 26 days 1 hours 1 min 11 secs", a live per-second
 * counter next to the wordmark.
 *
 * Reproduced as a genuinely live counter (same mechanic: an interval tick,
 * not a static string), but counting from this project's real build date
 * rather than an invented company age. `LAUNCH` is the date the tools hub
 * actually shipped, so the number is honest as well as structurally faithful.
 *
 * Renders nothing until mounted (avoids a hydration mismatch between the
 * server's render time and the client's first tick), then formats the
 * elapsed time with the same "Xy Xm Xd Xh Xm Xs" cadence as the reference.
 */
const LAUNCH = new Date('2026-07-28T00:00:00Z')

function formatElapsed(ms: number): string {
  let s = Math.floor(ms / 1000)
  const years = Math.floor(s / (365 * 86400))
  s -= years * 365 * 86400
  const months = Math.floor(s / (30 * 86400))
  s -= months * 30 * 86400
  const days = Math.floor(s / 86400)
  s -= days * 86400
  const hours = Math.floor(s / 3600)
  s -= hours * 3600
  const mins = Math.floor(s / 60)
  s -= mins * 60
  const secs = s

  const parts: string[] = []
  if (years > 0) parts.push(`${years} year${years === 1 ? '' : 's'}`)
  if (months > 0 || years > 0) parts.push(`${months} month${months === 1 ? '' : 's'}`)
  parts.push(`${days} day${days === 1 ? '' : 's'}`)
  parts.push(`${hours} hour${hours === 1 ? '' : 's'}`)
  parts.push(`${mins} min`)
  parts.push(`${secs} sec`)
  return parts.join(' ')
}

export function LiveUptime() {
  const [elapsed, setElapsed] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setElapsed(formatElapsed(Date.now() - LAUNCH.getTime()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <p className="text-center text-[14px] text-white/70 leading-6">
      Shipping tools since 28 Jul 2026
      <br />
      <span className="tabular-nums" suppressHydrationWarning>
        {elapsed ?? '—'}
      </span>
    </p>
  )
}
