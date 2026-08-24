import { ShieldCheck } from 'lucide-react'
import { PROMPTS } from '@/lib/prompts/registry'
import { TOOLS } from '@/lib/tools/registry'

/**
 * Reference: band 1 — a laurel "best unlimited design" badge + star rating +
 * client-logo row + "560,200+ hours completed" counter, directly under the hero.
 *
 * We do not fabricate a rating or a usage counter — there is no review platform
 * behind this site and no real-user telemetry to quote yet. Every number here is
 * instead something a visitor can verify themselves in under a minute: the tool
 * count, the prompt count, the test count, and the WCAG target.
 *
 * 2026 redesign: the old version was a single quiet text row that read as
 * page furniture. The numbers ARE the trust story on a site with no
 * testimonials, so they now get display-type weight (stat-figure, 40px) in a
 * four-up band — the same "receipts, not adjectives" register the hero's
 * "15 TOOLS · 1170 PROMPTS · ZERO SIGNUPS" line opens with.
 */
export function TrustStrip() {
  const testCount = 800 // floor of the last verified full-suite run (829 passing); see CI badge in README
  const stats = [
    { value: `${TOOLS.length}`, label: 'production tools', sub: 'all free, forever' },
    {
      value: PROMPTS.length.toLocaleString('en-US'),
      label: 'verified AI prompts',
      sub: 'version-stamped & dated',
    },
    { value: `${testCount}+`, label: 'tests passing in CI', sub: 'on every push' },
    { value: '0', label: 'signups required', sub: 'no email gate anywhere' },
  ]

  return (
    <section aria-label="The numbers behind this site" className="border-line border-t">
      <div className="container-site py-10">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative text-center ${
                i > 0
                  ? 'lg:before:absolute lg:before:top-1/2 lg:before:left-0 lg:before:h-10 lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-line-grey'
                  : ''
              }`}
            >
              <dd className="stat-figure font-semibold text-[36px] text-ink leading-none md:text-[44px]">
                {stat.value}
              </dd>
              <dt className="mt-2 font-medium text-[15px] text-ink">{stat.label}</dt>
              <p className="mt-0.5 text-[13px] text-ink-subtle">{stat.sub}</p>
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
