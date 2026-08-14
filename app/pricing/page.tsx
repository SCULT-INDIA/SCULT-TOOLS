import { Check, Minus, Sparkles, Wrench } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ScultServiceTiers } from '@/components/sections/ScultServiceTiers'
import { PROMPTS } from '@/lib/prompts/registry'
import { breadcrumbJsonLd, genericFaqJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl, parentLink, SITE } from '@/lib/site'
import { TOOLS } from '@/lib/tools/registry'

const TITLE = 'Pricing'
const DESCRIPTION =
  'Every tool and every prompt on this site is free, forever, with no signup. If you want a team to actually build the software, here is exactly what that costs.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/pricing' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/pricing'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

/**
 * Structural reference: draftss.com/pricing — a free/included-tier framing
 * up top, three paid plan cards side by side with a "Most Popular" badge,
 * a full feature-comparison table underneath, then a short FAQ. Adapted,
 * not copied: the free tier here is genuinely free (every tool, no card,
 * no trial to expire), and the paid tiers are Scult's real one-time
 * project pricing — not a monthly subscription, because that is not how
 * Scult actually bills a software build. Numbers below are taken directly
 * from scult.in's own pricing page, not invented for this page.
 */
interface PricingTier {
  readonly name: string
  readonly priceUsd: string
  readonly priceInr: string
  readonly audience: string
  readonly features: readonly string[]
  readonly cta: { label: string; href: string }
}

const TIERS: readonly PricingTier[] = [
  {
    name: 'Essential',
    priceUsd: '$1,000',
    priceInr: '₹94,999',
    audience: 'Startups and new ventures',
    features: [
      'Up to 5 custom pages',
      'Mobile-responsive design',
      'Core Web Vitals optimization',
      'SEO foundations',
      'Google Analytics 4 setup',
      'Contact forms',
      '2 rounds of revisions',
      '30-day post-launch support',
    ],
    cta: {
      label: 'Start a Project',
      href: parentLink('/services/custom-software-development', 'pricing'),
    },
  },
  {
    name: 'Growth',
    priceUsd: '$2,000',
    priceInr: '₹1,89,999',
    audience: 'Growing businesses',
    features: [
      'Up to 15 pages, with motion design',
      'Complete UI/UX design system',
      'Advanced SEO + technical audits',
      'CRM integration',
      'Blog/CMS with admin panel',
      'Conversion rate optimization',
      '5 rounds of revisions',
      '60-day post-launch support',
    ],
    cta: {
      label: 'Start a Project',
      href: parentLink('/services/custom-software-development', 'pricing'),
    },
  },
  {
    name: 'Enterprise',
    priceUsd: '$4,000+',
    priceInr: '₹3,79,999+',
    audience: 'Established brands needing custom solutions',
    features: [
      'Custom pages and features',
      'iOS/Android app development',
      'E-commerce for 100+ products',
      'Custom CMS',
      'API integrations',
      'Dedicated project manager',
      '1-year maintenance + quarterly reviews',
      '10 rounds of revisions',
    ],
    cta: {
      label: "Let's Scope It",
      href: parentLink('/services/custom-software-development', 'pricing'),
    },
  },
]

/** `true`/`false` = included or not; a string = the tier-specific value. */
type ComparisonCell = boolean | string

interface ComparisonRow {
  readonly feature: string
  readonly cells: readonly [ComparisonCell, ComparisonCell, ComparisonCell]
}

const COMPARISON: readonly ComparisonRow[] = [
  { feature: 'Pages included', cells: ['Up to 5', 'Up to 15', 'Custom'] },
  { feature: 'Motion design', cells: [false, true, true] },
  { feature: 'UI/UX design system', cells: [false, true, true] },
  { feature: 'SEO', cells: ['Foundations', 'Advanced + audits', 'Enterprise-grade'] },
  { feature: 'Blog / CMS', cells: [false, 'Included', 'Custom-built'] },
  { feature: 'E-commerce (100+ products)', cells: [false, false, true] },
  { feature: 'iOS / Android app', cells: [false, false, true] },
  { feature: 'CRM integration', cells: [false, true, true] },
  { feature: 'Revision rounds', cells: ['2', '5', '10'] },
  {
    feature: 'Post-launch support',
    cells: ['30 days', '60 days', '1 year + quarterly reviews'],
  },
  { feature: 'Dedicated project manager', cells: [false, false, true] },
]

function ComparisonCellValue({ value }: { value: ComparisonCell }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-tile-green p-1">
        <Check className="size-3.5 text-ink" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </span>
    )
  }
  if (value === false) {
    return (
      <span aria-hidden="true">
        <Minus className="size-4 text-ink-subtle" />
        <span className="sr-only">Not included</span>
      </span>
    )
  }
  return <span className="text-[14px] text-ink-body">{value}</span>
}

const PRICING_FAQS: readonly { q: string; a: string }[] = [
  {
    q: 'Are the tools and prompts really free forever?',
    a: 'Yes. Every tool on this site runs with no signup, no trial period, and no paywall — most run entirely in your browser and never touch a server. The prompt library is the same: copy-paste, no account required.',
  },
  {
    q: "What does 'Skills' mean, and where are they?",
    a: 'Ready-to-use skill files for agentic coding tools — Claude Code, Codex, Cursor, v0, Lovable and others. This is coming to the free tier; it is listed here so you know it is on the way, not live yet.',
  },
  {
    q: 'Is the paid pricing a subscription?',
    a: 'No. Every plan above is a one-time project investment, not a recurring charge — the same way scult.in prices it. Ongoing maintenance retainers exist, but as a separate, optional add-on after launch, never bundled into the sticker price.',
  },
  {
    q: 'Can I use the free tools and still hire Scult later?',
    a: 'Yes, and that is the point — use the free tools and prompts for as long as they are useful, and come to Scult only when you actually need a team to build something real. Nothing on this page requires the other.',
  },
]

function PricingFaqJsonLd() {
  return <JsonLd data={genericFaqJsonLd(PRICING_FAQS.map((f) => ({ q: f.q, a: f.a })))} />
}

export default function PricingPage() {
  const toolCount = TOOLS.length
  const promptCount = PROMPTS.length

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Pricing', path: '/pricing' },
        ])}
      />
      <PricingFaqJsonLd />

      <article className="container-site max-w-[68rem] pt-10 pb-20">
        {/* HERO */}
        <div className="mx-auto max-w-[46rem] text-center">
          <p className="eyebrow">Pricing</p>
          <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
            Free to use. Paid only if you want a team to build it.
          </h1>
          <p className="mt-6 text-[18px] text-ink-muted leading-8 md:text-lead">
            Every tool and prompt below costs nothing and always will. If you would rather
            have {SITE.parentName} actually build the software instead of doing it
            yourself, here is exactly what that costs — the same real pricing published on{' '}
            <a
              href={parentLink('/', 'pricing')}
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              scult.in
            </a>
            .
          </p>
        </div>

        {/* FREE TIER */}
        <section className="mt-14 overflow-hidden rounded-panel border border-ink bg-cream shadow-brutal">
          <div className="flex flex-wrap items-center justify-between gap-3 border-ink border-b bg-tile-green px-6 py-4">
            <span className="inline-flex items-center gap-2 font-bold text-[13px] text-ink uppercase tracking-[0.1em]">
              <Sparkles className="size-4" aria-hidden="true" />
              Free forever
            </span>
            <span className="text-[13px] text-ink-muted">No signup on any of it</span>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="text-[20px] tracking-[-0.3px]">Tools</h2>
              <p className="mt-2 text-[15px] text-ink-muted leading-6">
                {toolCount} free utilities — SEO, business, developer and design tools,
                most running entirely in your browser.
              </p>
              <Link
                href="/all"
                className="mt-4 inline-flex font-medium text-[14px] text-violet-700 hover:underline"
              >
                Browse all tools →
              </Link>
            </div>

            <div>
              <h2 className="text-[20px] tracking-[-0.3px]">Prompts</h2>
              <p className="mt-2 text-[15px] text-ink-muted leading-6">
                {promptCount} dated, version-verified prompts for ChatGPT, Claude, Cursor,
                Midjourney and more — copy-paste, no account.
              </p>
              <Link
                href="/prompts"
                className="mt-4 inline-flex font-medium text-[14px] text-violet-700 hover:underline"
              >
                Explore the prompt library →
              </Link>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-[20px] tracking-[-0.3px]">
                Skills
                <span className="chip-tool px-2 py-0.5 text-[11px] normal-case">
                  Coming soon
                </span>
              </h2>
              <p className="mt-2 text-[15px] text-ink-muted leading-6">
                Ready-to-use skill files for Claude Code, Codex, Cursor, v0, Lovable and
                more — on the way, free like everything else here.
              </p>
            </div>
          </div>
        </section>

        {/* PAID TIERS */}
        <div className="mt-16 text-center">
          <p className="eyebrow">Want it built, not just used?</p>
          <h2 className="mt-3 text-[28px] tracking-[-0.5px] md:text-[34px]">
            {SITE.parentName}'s real project pricing
          </h2>
          <p className="mx-auto mt-4 max-w-[42rem] text-[16px] text-ink-muted leading-7">
            One-time project investments, not a subscription — pick the scope that matches
            what you actually need built.
          </p>
        </div>

        <div className="mt-10">
          <ScultServiceTiers />
        </div>

        <p className="mt-6 text-center text-[13px] text-ink-subtle">
          Need a custom scope?{' '}
          <a
            href={parentLink('/services/custom-software-development', 'pricing')}
            className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            Let's build a proposal
          </a>
          .
        </p>

        <div className="mt-6 text-center">
          <a
            href={parentLink('/#book-meeting', 'pricing')}
            className="btn-brutal btn-violet justify-center"
          >
            <Wrench className="size-4" aria-hidden="true" />
            Book a Free Call
          </a>
        </div>

        {/* COMPARISON TABLE */}
        <section className="mt-16">
          <h2 className="text-center text-[24px] tracking-[-0.4px] md:text-[28px]">
            Compare what's included
          </h2>
          <div className="mt-8 overflow-x-auto rounded-panel border border-line">
            <table className="w-full min-w-[38rem] border-collapse text-left">
              <thead>
                <tr className="border-line-grey border-b bg-offwhite">
                  <th className="px-4 py-3 font-medium text-[13px] text-ink-subtle uppercase tracking-[0.06em]">
                    Feature
                  </th>
                  {TIERS.map((tier) => (
                    <th
                      key={tier.name}
                      className="px-4 py-3 text-center font-bold text-[14px] text-ink"
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 1 ? 'bg-offwhite' : 'bg-cream'}
                  >
                    <td className="px-4 py-3 text-[14px] text-ink-body">{row.feature}</td>
                    {row.cells.map((cell, ci) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed 3-tier row, order never changes
                      <td key={ci} className="px-4 py-3 text-center">
                        <ComparisonCellValue value={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-center text-[24px] tracking-[-0.4px] md:text-[28px]">
            Pricing questions
          </h2>
          <div className="mx-auto mt-8 max-w-[42rem]">
            {PRICING_FAQS.map((item) => (
              <div key={item.q} className="mt-8">
                <h3 className="text-[18px] tracking-[-0.2px]">{item.q}</h3>
                <p className="mt-2 text-[15px] text-ink-muted leading-6">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-[14px] text-ink-subtle">
            More general questions?{' '}
            <Link
              href="/faq"
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              Read the full FAQ
            </Link>
            .
          </p>
        </section>
      </article>
    </>
  )
}
