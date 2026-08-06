import type { LucideIcon } from 'lucide-react'
import { ArrowDown, ArrowUp } from 'lucide-react'

/**
 * Icon + label + big value tile — docs/TOOL_REDESIGN_PLAN.md §3.
 *
 * The dashboard-shaped tool redesigns (metrics, breakdowns, report cards) all
 * want a small stat tile with the same anatomy. `tone` picks which pastel tile
 * colour rings the icon, so a row of StatCards can vary without every caller
 * hand-rolling its own tint.
 */

const TONE_CLASS = {
  lavender: 'bg-tile-lavender',
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  green: 'bg-tile-green',
} as const

export function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  trend,
  tone = 'lavender',
}: {
  icon: LucideIcon
  label: string
  value: string | number
  sublabel?: string
  trend?: { direction: 'up' | 'down'; value: string; positive?: boolean }
  tone?: keyof typeof TONE_CLASS
}) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-line-grey bg-cream p-4">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex size-9 items-center justify-center rounded-full ${TONE_CLASS[tone]}`}
        >
          <Icon className="size-4.5 text-violet-700" aria-hidden="true" />
        </span>
        {trend ? (
          <span
            className={`inline-flex items-center gap-1 font-medium text-[12px] tabular-nums ${
              trend.positive === false
                ? 'text-ink-subtle'
                : trend.direction === 'up'
                  ? 'text-green'
                  : 'text-ink-subtle'
            }`}
          >
            {trend.direction === 'up' ? (
              <ArrowUp className="size-3.5" aria-hidden="true" />
            ) : (
              <ArrowDown className="size-3.5" aria-hidden="true" />
            )}
            {trend.value}
          </span>
        ) : null}
      </div>

      <div>
        <p className="font-display font-bold text-[26px] text-ink leading-tight tabular-nums">
          {value}
        </p>
        <p className="text-[13px] text-ink-subtle">{label}</p>
      </div>

      {sublabel ? <p className="text-[12px] text-ink-subtle">{sublabel}</p> : null}
    </div>
  )
}
