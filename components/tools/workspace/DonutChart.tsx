/**
 * Small SVG donut for a 2–6 segment breakdown — docs/TOOL_REDESIGN_PLAN.md §3.
 *
 * Segments are stroke arcs stacked around one circle rather than separate
 * `<path>` wedges — cheaper to compute (just cumulative dash-offsets) and it
 * keeps every segment the same stroke width without doing trig for wedge
 * corners.
 *
 * Colour trick: each segment's class is a `text-*` utility, applied to BOTH
 * the arc (`stroke="currentColor"`) and its legend swatch (`bg-current`), so
 * one class name keeps the arc and the swatch in sync without a second colour
 * prop.
 */

const DEFAULT_COLORS = [
  'donut-tone-violet-700 text-violet-700',
  'donut-tone-violet-light text-violet-500',
  'donut-tone-tile-blue text-tile-blue',
  'donut-tone-tile-green text-tile-green',
  'text-cta',
  'donut-tone-violet-light text-violet-400',
]

export type DonutSegment = {
  label: string
  value: number
  colorClass?: string
}

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
  size = 120,
}: {
  segments: DonutSegment[]
  centerLabel?: string
  centerValue?: string
  size?: number
}) {
  const stroke = Math.max(10, size * 0.16)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0)

  let cumulative = 0
  const arcs = segments.map((segment, i) => {
    const value = Math.max(0, segment.value)
    const fraction = total > 0 ? value / total : 0
    const arcLength = circumference * fraction
    const offset = cumulative
    cumulative += arcLength
    return {
      ...segment,
      colorClass: segment.colorClass ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      fraction,
      arcLength,
      offset,
    }
  })

  return (
    <div className="inline-flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={
            centerLabel && centerValue
              ? `${centerLabel}: ${centerValue}`
              : 'Breakdown chart'
          }
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-line-grey"
          />
          {arcs
            .filter((arc) => arc.arcLength > 0)
            .map((arc) => (
              <circle
                key={arc.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                strokeDasharray={`${arc.arcLength} ${circumference - arc.arcLength}`}
                strokeDashoffset={-arc.offset}
                className={arc.colorClass}
              />
            ))}
        </svg>
        {centerLabel || centerValue ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
            {centerValue ? (
              <span className="font-display font-bold text-[18px] text-ink">
                {centerValue}
              </span>
            ) : null}
            {centerLabel ? (
              <span className="text-[11px] text-ink-subtle">{centerLabel}</span>
            ) : null}
          </div>
        ) : null}
      </div>

      <ul className="flex flex-col gap-1.5">
        {arcs.map((arc) => (
          <li key={arc.label} className="flex items-center gap-2 text-[13px]">
            <span
              className={`inline-block size-2.5 shrink-0 rounded-full bg-current ${arc.colorClass}`}
              aria-hidden="true"
            />
            <span className="text-ink-muted">{arc.label}</span>
            <span className="font-medium text-ink tabular-nums">{arc.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
