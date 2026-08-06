/**
 * Circular score indicator — docs/TOOL_REDESIGN_PLAN.md §3.
 *
 * Several redesigned tools (AI visibility, website speed, marketing ROI-style
 * scores) need the same "big number in a ring" treatment. One component means
 * one place to fix the arc-length math rather than five near-identical SVGs.
 */

const SIZE_CONFIG = {
  sm: { box: 48, stroke: 5, valueText: 'text-[14px]', labelText: 'text-[10px]' },
  md: { box: 96, stroke: 8, valueText: 'text-[26px]', labelText: 'text-[12px]' },
  lg: { box: 176, stroke: 12, valueText: 'text-[44px]', labelText: 'text-[14px]' },
} as const

export function ScoreRing({
  value,
  max = 100,
  label,
  sublabel,
  size = 'md',
  toneClass = 'score-ring-tone-default text-violet-700',
}: {
  value: number
  max?: number
  label?: string
  sublabel?: string
  size?: 'sm' | 'md' | 'lg'
  /** Overrides the arc colour, e.g. `text-green` / `text-cta` for a verdict ring. */
  toneClass?: string
}) {
  const { box, stroke, valueText, labelText } = SIZE_CONFIG[size]
  const radius = (box - stroke) / 2
  const circumference = 2 * Math.PI * radius
  // Clamp rather than trust the caller — a stray value outside [0, max] would
  // otherwise draw an arc that overshoots or reverses direction.
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const dashOffset = circumference * (1 - ratio)

  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: box, height: box }}>
        <svg
          width={box}
          height={box}
          viewBox={`0 0 ${box} ${box}`}
          role="img"
          aria-label={
            label ? `${label}: ${value} of ${max}` : `Score: ${value} of ${max}`
          }
          className="-rotate-90"
        >
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-line-grey"
          />
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={`${toneClass} transition-[stroke-dashoffset] duration-300`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-display font-bold text-ink tabular-nums ${valueText}`}>
            {value}
          </span>
        </div>
      </div>
      {label ? (
        <span className={`font-medium text-ink ${labelText}`}>{label}</span>
      ) : null}
      {sublabel ? (
        <span className={`text-ink-subtle ${labelText}`}>{sublabel}</span>
      ) : null}
    </div>
  )
}
