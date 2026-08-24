import { ShieldCheck } from 'lucide-react'
import { PROMPTS } from '@/lib/prompts/registry'
import { TOOLS } from '@/lib/tools/registry'

/**
 * The receipts band — every number a visitor can verify in under a minute
 * (no fabricated ratings or usage counters; there is no review platform or
 * telemetry behind this site).
 *
 * 2026 redesign, take two: the numbers wear the brand instead of plain
 * text — four pastel sticker cards with the site's ink border + hard offset
 * shadow, each tilted a degree or two like stickers slapped on the page,
 * straightening on hover. Same neo-brutal tile vocabulary as the hero's
 * category cards; Fraunces display numerals; one Permanent Marker
 * annotation. Tile fills are theme-FIXED light pastels, so everything on
 * them is literal black / violet-700, never adaptive ink.
 */
export function TrustStrip() {
  const testCount = 800 // floor of the last verified full-suite run; see CI badge in README
  const stats = [
    {
      value: `${TOOLS.length}`,
      label: 'production tools',
      sub: 'all free, forever',
      tile: 'yellow',
      tilt: '-rotate-2',
    },
    {
      value: PROMPTS.length.toLocaleString('en-US'),
      label: 'verified AI prompts',
      sub: 'version-stamped & dated',
      tile: 'lavender',
      tilt: 'rotate-1',
    },
    {
      value: `${testCount}+`,
      label: 'tests passing in CI',
      sub: 'on every push',
      tile: 'blue',
      tilt: '-rotate-1',
    },
    {
      value: '0',
      label: 'signups required',
      sub: 'no email gate anywhere',
      tile: 'green',
      tilt: 'rotate-2',
    },
  ] as const

  return (
    <section aria-label="The numbers behind this site" className="border-line border-t">
      <div className="container-site py-12">
        <p
          aria-hidden="true"
          className="-rotate-1 mb-6 text-center font-display font-semibold text-[18px] text-violet-700 italic"
        >
          No made-up numbers — go count them ↓
        </p>
        <dl className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-lg border border-ink p-5 text-center shadow-brutal-sm transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 md:p-6 ${stat.tilt}`}
              style={{ background: `var(--color-tile-${stat.tile})` }}
            >
              <dd className="stat-figure font-semibold text-[40px] text-black leading-none md:text-[52px]">
                {stat.value}
              </dd>
              <dt className="mt-2 font-display font-semibold text-[16px] text-black tracking-normal">
                {stat.label}
              </dt>
              <p className="mt-0.5 text-[13px] text-black/55">{stat.sub}</p>
            </div>
          ))}
        </dl>
        <p className="mt-8 flex items-center justify-center gap-2 text-[14px] text-ink-muted">
          <ShieldCheck className="size-4 shrink-0 text-green" aria-hidden="true" />
          Built to WCAG 2.2 AA — contrast, keyboard and screen-reader checked on every
          tool
        </p>
      </div>
    </section>
  )
}
