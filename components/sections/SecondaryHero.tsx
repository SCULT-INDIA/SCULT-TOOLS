import { Check } from 'lucide-react'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { CATEGORIES } from '@/lib/tools/categories'
import { TOOLS } from '@/lib/tools/registry'

/**
 * Reference: band 2 — the second hero. Large serif headline left, a collage
 * illustration right, a row of green-check feature badges beneath the copy.
 *
 * The collage is replaced with a CSS composition of pastel category tiles —
 * the same tile tokens used everywhere else on the site — rather than a stock
 * illustration or an invented product screenshot.
 */
export function SecondaryHero() {
  const shown = CATEGORIES.slice(0, 4)
  return (
    <section aria-labelledby="secondary-hero" className="container-site py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2
            id="secondary-hero"
            className="max-w-[14ch] text-[38px] leading-[1.05] tracking-[-1px] md:text-[52px] md:leading-[56px]"
          >
            Your own toolkit for SEO, business & AI visibility
          </h2>
          <p className="mt-5 max-w-[46ch] text-[17px] text-ink-muted leading-7 md:text-lead">
            {TOOLS.length} tools, built the way we build for clients — tested, accessible,
            and honest about their own limitations.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {[
              'Free, no trial clock',
              'No account to create',
              '2-second setup',
              'Cancel nothing — there is no plan',
            ].map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 text-[15px] text-ink"
              >
                <Check className="size-4 shrink-0 text-green" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/all" className="btn-brutal mt-8">
            SEE ALL {TOOLS.length} TOOLS
          </Link>
        </div>

        {/* CSS collage standing in for the reference's team illustration —
            built from the same pastel tile tokens used across the site. */}
        <div
          aria-hidden="true"
          className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4"
        >
          {shown.map((c, i) => (
            <div
              key={c.slug}
              className="tile-pastel flex min-h-[150px] flex-col justify-between"
              style={{
                background: `var(--color-tile-${c.tile})`,
                marginTop: i % 2 === 1 ? '2rem' : undefined,
              }}
            >
              <Icon name={c.icon} className="size-7 text-violet-700" />
              <span className="font-display font-semibold text-[17px] tracking-normal">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
