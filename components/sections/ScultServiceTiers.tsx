import { Check } from 'lucide-react'
import { parentLink } from '@/lib/site'

/**
 * Visual/structural reference: draftss.com/pricing's plan-card section — a
 * 2-column asymmetric layout (two smaller tiers stacked in the left column,
 * the flagship tier alone as a single tall card in the right column,
 * visually distinguished by a colored border + tinted background), rounded
 * soft cards rather than hard-edge shadows, a pill-shaped filled CTA button,
 * and a 3-column "included with every plan" checklist band underneath.
 *
 * Content is Scult's own, not Draftss's: real one-time project tiers
 * (verified live against scult.in/pricing, not invented — see the source
 * comment in CategoryPlans.tsx for the same figures used on the homepage's
 * free-vs-paid section), and the universal-benefits row below is limited to
 * claims actually published on scult.in/pricing ("fixed pricing, never
 * hourly", "free discovery call", "full ownership transfer on delivery",
 * "scope confirmed upfront, no surprises", "maintenance quoted separately")
 * rather than copying Draftss's own (unrelated, subscription-specific)
 * guarantees like "cancel anytime" or "unlimited revisions", which would be
 * false claims about a project-based engagement.
 *
 * Colors are Scult's own tokens, not Draftss's literal orange/blue: the CTA
 * pill uses --color-cta (the site's existing brand yellow, in the same slot
 * Draftss's orange fills), and the highlighted tier uses violet-700 +
 * tile-lavender in the slot Draftss's blue fills — same visual structure,
 * on-brand color.
 */

interface ServiceTier {
  readonly name: string
  readonly blurb: string
  readonly priceUsd: string
  readonly priceInr: string
  readonly features: readonly string[]
  readonly cta: string
}

const TIERS: readonly ServiceTier[] = [
  {
    name: 'Essential',
    blurb:
      'A launch-ready web presence for startups and new ventures who need to look credible from day one, not just functional.',
    priceUsd: '$1,000',
    priceInr: '₹94,999',
    features: [
      'Up to 5 custom-designed pages',
      'Mobile-first responsive build',
      'Core Web Vitals optimization',
      'SEO foundations + Google Analytics 4',
      'Contact forms wired and tested',
      '2 rounds of revisions',
      '30-day post-launch support',
    ],
    cta: 'Start a Project',
  },
  {
    name: 'Growth',
    blurb:
      'A full-scale digital brand for growing businesses ready to invest in design, content and lead capture together, not piecemeal.',
    priceUsd: '$2,000',
    priceInr: '₹1,89,999',
    features: [
      'Up to 15 pages, with motion design',
      'Complete UI/UX design system',
      'CRM integration + lead capture',
      'Blog / CMS with admin panel',
      'Advanced SEO + technical audits',
      '5 rounds of revisions',
      '60-day post-launch support',
    ],
    cta: 'Start a Project',
  },
]

const ENTERPRISE_TIER: ServiceTier = {
  name: 'Enterprise',
  blurb:
    'Custom-engineered software at scale, for established brands whose needs go past a website — apps, integrations, and a team that stays after launch.',
  priceUsd: '$4,000+',
  priceInr: '₹3,79,999+',
  features: [
    'Custom pages and features',
    'iOS / Android app development',
    'E-commerce for 100+ products',
    'Custom CMS + third-party API integrations',
    'AI agents & automation',
    'Dedicated project manager',
    '1-year maintenance + quarterly reviews',
    '10 rounds of revisions',
  ],
  cta: "Let's Scope It",
}

const UNIVERSAL_BENEFITS: readonly string[] = [
  'Fixed pricing, agreed upfront — never billed by the hour',
  'A free discovery call before you ever see a quote',
  'Scope confirmed in writing — no surprise add-ons later',
  'Full source code handed over on delivery',
  'Design files included, not just the finished build',
  'All written content and copy included in the handover',
  'You own every file and every line, outright — no license, no lock-in',
  'Maintenance retainers quoted separately, never bundled in',
  'The exact same pricing published on scult.in — no markup for coming from here',
  'Direct WhatsApp access to the team — no ticket queue',
]

/** Which tier actually carries the "Most Popular" highlight — kept as one
 * named constant so the pricing card and the comparison-table header on
 * app/pricing/page.tsx can never silently disagree about it again. Growth,
 * not Enterprise: highlighting the most expensive tier is the unusual
 * choice, and the standard tiered-pricing anchoring effect (a highlighted
 * middle tier makes itself look reasonable next to the priciest option)
 * argues for the middle tier by default. */
const MOST_POPULAR_TIER = 'Growth'

function TierCard({
  tier,
  highlighted,
  campaign,
  className = '',
}: {
  tier: ServiceTier
  highlighted?: boolean
  campaign: string
  className?: string
}) {
  return (
    <div
      className={`flex flex-col rounded-panel p-7 md:p-8 ${
        highlighted
          ? 'border-2 border-violet-700 bg-tile-lavender shadow-card-raised'
          : 'border border-line bg-cream shadow-card'
      } ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        {highlighted ? (
          <span className="mb-3 inline-flex w-fit items-center rounded-pill bg-violet-700 px-3 py-1 font-bold text-[11px] text-white uppercase tracking-[0.08em]">
            Most Popular
          </span>
        ) : null}
        <h3 className="font-display font-bold text-[28px] tracking-normal">
          {tier.name}
        </h3>
        <p className="mt-2 max-w-[26rem] text-[16px] text-ink-muted leading-7">
          {tier.blurb}
        </p>

        <p className="mt-6">
          <span className="font-display font-bold text-[36px] text-ink">
            {tier.priceUsd}
          </span>
        </p>
        <p className="mt-1 text-[14px] text-ink-subtle">starting · {tier.priceInr}</p>
      </div>

      <ul className="mx-auto mt-7 flex w-full max-w-[24rem] flex-1 flex-col gap-3">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-[15px] text-ink-body leading-6"
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
        href={parentLink('/services/custom-software-development', campaign)}
        className="btn-brutal mt-7 w-full justify-center uppercase tracking-[0.04em]"
      >
        {tier.cta}
      </a>
    </div>
  )
}

export function ScultServiceTiers({
  showUniversalBenefits = true,
}: {
  /** The homepage's version of this section omits the "Every plan
   * includes" band — kept on the standalone /pricing page, where a visitor
   * already deep in comparing tiers wants the extra detail; the homepage
   * section is meant as a shorter teaser, not the full pricing page. */
  showUniversalBenefits?: boolean
}) {
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          {TIERS.map((tier) => (
            <TierCard
              key={tier.name}
              tier={tier}
              highlighted={tier.name === MOST_POPULAR_TIER}
              campaign={`service-tier-${tier.name.toLowerCase()}`}
            />
          ))}
        </div>
        <TierCard
          tier={ENTERPRISE_TIER}
          campaign="service-tier-enterprise"
          className="lg:h-full"
        />
      </div>

      {showUniversalBenefits ? (
        <div className="mt-10 rounded-panel bg-violet-50 p-7 md:p-10">
          <p className="text-center font-black text-[26px] text-violet-700 tracking-[-0.3px] md:text-[34px]">
            Every plan includes
          </p>
          <p className="mx-auto mt-3 max-w-[40rem] text-center text-[15px] text-ink-muted leading-6">
            The same ground rules on every tier, regardless of size — how Scult actually
            runs a project, not a perk that only shows up on the expensive plan.
          </p>
          <ul className="mx-auto mt-8 grid max-w-[46rem] gap-x-10 gap-y-5 sm:grid-cols-2">
            {UNIVERSAL_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2.5 text-[15px] text-ink-body leading-6"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-violet-700"
                  aria-hidden="true"
                />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
