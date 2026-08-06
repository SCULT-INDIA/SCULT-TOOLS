import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { parentLink } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolsByCategory, TOOLS } from '@/lib/tools/registry'

const TILE_BG: Record<string, string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/**
 * Real Scult project pricing, sourced from scult.in/#pricing (checked live —
 * not invented). These are the agency's own published one-time project
 * tiers, shown here so a visitor who needs more than a free tool — a real
 * app, a full site, an AI agent — sees the actual cost of that before ever
 * leaving this site. Update this block if scult.in's pricing page changes;
 * it is quoted, not derived, so it can't self-correct.
 */
const SERVICE_TIERS = [
  {
    name: 'Essential',
    blurb: 'Launch-ready web presence',
    priceUsd: '$1,000',
    priceInr: '₹94,999',
    features: [
      'Up to 5 custom-designed pages',
      'Mobile-first responsive build',
      'SEO foundations + XML sitemap',
      '30-day post-launch support',
    ],
    highlighted: false,
  },
  {
    name: 'Growth',
    blurb: 'Full-scale digital brand',
    priceUsd: '$2,000',
    priceInr: '₹1,89,999',
    features: [
      'Up to 15 pages with motion design',
      'Complete UI/UX design system',
      'CRM & lead-capture integration',
      'Blog / CMS with admin panel',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    blurb: 'Custom-engineered at scale',
    priceUsd: '$4,000+',
    priceInr: '₹3,79,999+',
    features: [
      'Mobile app (iOS + Android) available',
      'Custom CMS + third-party API integrations',
      'AI agents & automation',
      'Dedicated project manager',
    ],
    highlighted: false,
  },
] as const

/**
 * Two-part pricing story, in one place: what's on THIS site (every tool,
 * always free) and what it costs to have Scult actually BUILD something —
 * an app, a full site, an AI agent — since that's the real next step for a
 * visitor this hub can't take further on its own.
 *
 * The reference this replaced showed 3 sampled categories as "plan" cards;
 * this shows all 6, because "mention all tools in one pricing" means the
 * catalogue, not a third of it.
 */
export function CategoryPlans() {
  return (
    <section aria-labelledby="category-plans" className="container-site py-16">
      <div className="mb-4 text-center">
        <span className="btn-brutal btn-brutal-sm cursor-default">FREE FOR EVERYONE</span>
      </div>
      <h2
        id="category-plans"
        className="mt-5 text-center text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]"
      >
        Simple, honest pricing
      </h2>
      <p className="mt-3 text-center text-[17px] text-ink-muted">
        All {TOOLS.length} tools are free, forever. Need something built beyond a tool?
        Here's what that actually costs.
      </p>

      {/* Part 1 — every tool, one place, one price: $0. */}
      <div className="mt-10 rounded-panel border border-line bg-cream p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-[22px] tracking-normal">
              Every tool. Always free.
            </h3>
            <p className="mt-1 text-[15px] text-ink-muted">
              {TOOLS.length} tools across {CATEGORIES.length} categories — no trial, no
              signup, no cancellation, because there's nothing to cancel.
            </p>
          </div>
          <p className="font-display font-bold text-[32px] text-ink">$0</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const tools = getToolsByCategory(category.slug)
            return (
              <div
                key={category.slug}
                className="rounded-card border border-line-grey bg-offwhite p-4"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-sm ${TILE_BG[category.tile]}`}
                  >
                    <Icon name={category.icon} className="size-4 text-violet-700" />
                  </span>
                  <Link
                    href={`/${category.slug}`}
                    className="font-semibold text-[15px] text-ink hover:text-violet-600 hover:underline"
                  >
                    {category.name}
                  </Link>
                </div>
                <ul className="space-y-1.5">
                  {tools.map((tool) => (
                    <li key={tool.slug} className="flex items-start gap-2 text-[13px]">
                      <Image
                        src={`/tool-icons/${tool.slug}.png`}
                        alt=""
                        width={16}
                        height={16}
                        className="mt-0.5 size-4 shrink-0 rounded-full ring-1 ring-line"
                      />
                      <Link
                        href={`/${tool.category}/${tool.slug}`}
                        className="text-ink-muted hover:text-violet-600 hover:underline"
                      >
                        {tool.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <Link href="/all" className="btn-brutal btn-brutal-sm">
            BROWSE ALL {TOOLS.length} TOOLS
          </Link>
        </div>
      </div>

      {/* Part 2 — the real next step: paid Scult project work. */}
      <div className="mt-10">
        <div className="text-center">
          <h3 className="font-display font-semibold text-[24px] tracking-normal md:text-[28px]">
            Need more than a tool?
          </h3>
          <p className="mx-auto mt-2 max-w-[52ch] text-[16px] text-ink-muted">
            When a free tool isn't enough — a real website, a mobile app, custom software,
            or an AI agent built for your business — that's{' '}
            <a
              href={parentLink('/', 'pricing-section')}
              className="text-violet-700 underline decoration-1 underline-offset-4"
            >
              Scult's
            </a>{' '}
            day job. Real project pricing, no hidden retainer:
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {SERVICE_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-panel border p-6 ${
                tier.highlighted ? 'border-violet-700 bg-ice' : 'border-line bg-cream'
              }`}
            >
              {tier.highlighted ? (
                <span className="mb-3 inline-flex w-fit items-center rounded-pill bg-violet-700 px-3 py-1 font-bold text-[11px] text-white uppercase tracking-[0.08em]">
                  Most chosen
                </span>
              ) : null}
              <h4 className="font-display font-semibold text-[20px] tracking-normal">
                {tier.name}
              </h4>
              <p className="mt-1 text-[14px] text-ink-muted">{tier.blurb}</p>
              <p className="mt-4">
                <span className="font-display font-bold text-[28px] text-ink">
                  {tier.priceUsd}
                </span>
                <span className="ml-1.5 text-[13px] text-ink-subtle">
                  / {tier.priceInr}
                </span>
              </p>
              <p className="mt-0.5 text-[12px] text-ink-subtle">
                One-time project investment
              </p>

              <ul className="mt-5 space-y-2.5">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-[14px] text-ink"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-violet-700"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={parentLink('/#book-meeting', `pricing-${tier.name.toLowerCase()}`)}
                className={`btn-brutal btn-brutal-sm mt-6 w-full justify-center ${
                  tier.highlighted ? 'btn-violet' : ''
                }`}
              >
                BOOK A CALL
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[13px] text-ink-subtle">
          All prices are one-time project investments, quoted directly from{' '}
          <a
            href={parentLink('/#pricing', 'pricing-section-footnote')}
            className="underline decoration-1 underline-offset-4 hover:text-ink"
          >
            scult.in/#pricing
          </a>{' '}
          — maintenance retainers available separately. Need a custom scope?{' '}
          <a
            href={parentLink('/#book-meeting', 'pricing-custom-scope')}
            className="text-violet-700 underline decoration-1 underline-offset-4"
          >
            Book a free consultation
          </a>
          .
        </p>
      </div>
    </section>
  )
}
