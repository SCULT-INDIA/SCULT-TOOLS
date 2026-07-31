import { Lock, Radar, ShieldCheck, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CategoryPlans } from '@/components/sections/CategoryPlans'
import { CategoryTabs } from '@/components/sections/CategoryTabs'
import { ContactAndCta } from '@/components/sections/ContactAndCta'
import { FullServiceGrid } from '@/components/sections/FullServiceGrid'
import { Hero } from '@/components/sections/Hero'
import { PrincipleWall } from '@/components/sections/PrincipleWall'
import { SearchSpotlight } from '@/components/sections/SearchSpotlight'
import { SecondaryHero } from '@/components/sections/SecondaryHero'
import { TechMarquee } from '@/components/sections/TechMarquee'
import { ToolShowcaseMarquee } from '@/components/sections/ToolShowcaseMarquee'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { UniversalIncludes } from '@/components/sections/UniversalIncludes'
import { Icon } from '@/components/ui/Icon'
import { JsonLd } from '@/lib/seo/jsonld'
import { parentLink, SITE } from '@/lib/site'
import { TOOLS } from '@/lib/tools/registry'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/**
 * The hub home page.
 *
 * Rebuilt as a section-by-section clone of the draftss.com reference (see
 * docs/PLAN.md §5 for the per-section source): same order, same visual
 * grammar, same component anatomy — hero, trust strip, tech marquee, secondary
 * hero, tool showcase marquee, full service grid, category tabs, search
 * spotlight, benefits grid, category "plan" cards, universal-includes band, a
 * proof wall, an AI-visibility spotlight, how-it-works, privacy, FAQ, contact,
 * dual closing CTAs and the dome transition into the footer.
 *
 * Every number and claim is computed from the registry or independently
 * verifiable in the browser. Two sections deliberately do NOT clone the
 * reference's content model: the review wall (fabricated testimonials would be
 * fake social proof) and the contact form (no functioning inbox exists yet, so
 * it is a plain mailto rather than a form with a fake success state). Both are
 * explained inline in their own component docblocks.
 */

const HOME_FAQ = [
  {
    q: 'Are these tools really free?',
    a: 'Yes — no trial, no quota, no premium tier. Most of them run entirely in your browser, so they cost us nothing per use, and there is nothing to recover.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. There is nothing to sign up for anywhere on this site. Results are yours to copy or download the moment they appear.',
  },
  {
    q: 'Is my data uploaded anywhere?',
    a: 'For 13 of the 15 tools, no — files and text are processed inside your own tab and are gone when you close it. The two diagnostics that must fetch a URL (the speed test and the AI visibility checker) send only that URL, never your files. The privacy page lists exactly which is which.',
  },
  {
    q: 'Why did an agency build free tools?',
    a: 'These are the utilities our own delivery team uses on client work. Publishing them costs us almost nothing, and when you eventually need a team rather than a tool, you will already know who we are.',
  },
  {
    q: 'Can I request a tool?',
    a: 'Yes — tell us what you need through the contact details on scult.in. The catalogue is deliberately small and curated, so we add tools when they are genuinely useful, not to inflate a number.',
  },
]

function homeFaqJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export default function Home() {
  const clientSide = TOOLS.filter((t) => t.runsInBrowser).length

  return (
    <>
      <JsonLd data={homeFaqJsonLd()} />

      {/* ============================================================ 1. HERO
          Rebuilt from a reference screenshot the user supplied — see the full
          adaptation notes in components/sections/Hero.tsx's docblock. */}
      <Hero />

      {/* ==================================================== 2. TRUST STRIP */}
      <TrustStrip />

      {/* ===================================================== 3. TECH MARQUEE */}
      <TechMarquee />

      {/* =================================================== 4. SECONDARY HERO */}
      <SecondaryHero />

      {/* ============================================== 5. TOOL SHOWCASE MARQUEE */}
      <ToolShowcaseMarquee />

      {/* ================================================ 6. FULL SERVICE GRID */}
      <FullServiceGrid />

      {/* =================================================== 7. CATEGORY TABS */}
      <CategoryTabs />

      {/* ================================================= 8. SEARCH SPOTLIGHT */}
      <SearchSpotlight />

      {/* 9. BENEFITS GRID — removed at the user's request. It duplicated the
             two-card checklist that UniversalIncludes (11) now carries, and two
             near-identical blocks on one page read as a mistake. */}

      {/* ================================================= 10. CATEGORY PLANS */}
      <CategoryPlans />

      {/* ============================================= 11. UNIVERSAL INCLUDES */}
      <UniversalIncludes />

      {/* ==================================================== 12. PROOF WALL */}
      <PrincipleWall />

      {/* ============================================ 13. AI-VISIBILITY SPOTLIGHT */}
      <section aria-labelledby="spotlight" className="bg-violet-900 py-16 text-white">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-cta">New — GEO / AEO</p>
            <h2
              id="spotlight"
              className="mt-3 max-w-[18ch] text-[32px] text-white leading-[1.1] tracking-[-1px] md:text-[44px]"
            >
              Can AI search engines even see your site?
            </h2>
            <p className="mt-5 max-w-[52ch] text-[17px] text-white/80 leading-7">
              ChatGPT, Claude, Perplexity and Google's AI answers are becoming a real
              acquisition channel — and many sites block their crawlers without knowing
              it. Run the check: one URL in, a 0–100 visibility score and the exact fixes
              out.
            </p>
            <Link href="/geo/ai-visibility-checker" className="btn-brutal mt-7">
              CHECK YOUR AI VISIBILITY
            </Link>
          </div>

          <ul className="grid gap-3" aria-label="What the AI visibility check inspects">
            {[
              {
                icon: 'Radar',
                label: 'AI crawler access',
                d: 'GPTBot, ClaudeBot, PerplexityBot, Google-Extended and six more, checked against your robots.txt.',
              },
              {
                icon: 'FileCode2',
                label: 'Structured data',
                d: 'Every JSON-LD block on your homepage, parsed and typed.',
              },
              {
                icon: 'Search',
                label: 'Answer-ready basics',
                d: 'Title, description, headings and llms.txt — what AI answers actually quote.',
              },
            ].map((row) => (
              <li
                key={row.label}
                className="flex items-start gap-4 rounded-md border border-white/15 bg-white/5 p-5"
              >
                <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-sm bg-cta">
                  <Icon name={row.icon} className="size-5 text-ink" />
                </span>
                <span>
                  <span className="block font-display font-semibold text-[18px] text-white tracking-normal">
                    {row.label}
                  </span>
                  <span className="mt-1 block text-[14px] text-white/70 leading-5">
                    {row.d}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==================================================== 14. HOW IT WORKS */}
      <section aria-labelledby="how" className="container-site py-16">
        <div className="mb-10 text-center">
          <p className="eyebrow">How it works</p>
          <h2
            id="how"
            className="mt-3 text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]"
          >
            Three steps. No third one is “sign up”.
          </h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Zap,
              t: 'Pick a tool',
              d: 'Search from anywhere with Ctrl K, or browse the six categories. Every tool is two clicks from every page.',
            },
            {
              icon: ShieldCheck,
              t: 'Use it instantly',
              d: 'Results compute as you type, in your own tab. No upload bars, no processing queues, no "your file is ready" emails.',
            },
            {
              icon: Lock,
              t: 'Take the result',
              d: 'Copy, print or download — the full result, first, before anything else. We never trade your output for an email address.',
            },
          ].map((step, i) => (
            <li key={step.t} className="card-flat relative p-6 pt-8">
              <span
                aria-hidden="true"
                className="-top-4 absolute left-6 grid size-8 place-items-center rounded-pill border border-ink bg-cta font-bold text-[14px] text-ink"
              >
                {i + 1}
              </span>
              <step.icon className="size-6 text-violet-700" aria-hidden="true" />
              <h3 className="mt-3 font-display font-semibold text-[19px] tracking-normal">
                {step.t}
              </h3>
              <p className="mt-2 text-[15px] text-ink-muted leading-6">{step.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ==================================================== 15. PRIVACY */}
      <section aria-labelledby="privacy" className="border-line border-y bg-ice py-16">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Privacy as a feature</p>
            <h2
              id="privacy"
              className="mt-3 text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]"
            >
              Your files never leave your browser
            </h2>
            <p className="mt-5 text-[17px] text-ink-muted leading-7">
              {clientSide} of {TOOLS.length} tools do their work with your browser's own
              capabilities — Canvas, native parsers, Web APIs. There is no upload step to
              wait for and no server copy to worry about. Open your network panel and
              watch it stay empty while you work.
            </p>
            <p className="mt-4 text-[17px] text-ink-muted leading-7">
              The two diagnostics that must touch the network — the speed test and the AI
              visibility checker — send only the URL you type, never your content. The
              privacy page lists every tool and exactly what it does or does not send.
            </p>
            <Link href="/privacy" className="btn-brutal btn-brutal-sm mt-7">
              READ THE PRIVACY TABLE
            </Link>
          </div>

          <ul className="grid content-start gap-4 sm:grid-cols-2">
            {[
              {
                icon: Lock,
                t: 'No accounts, ever',
                d: 'Nothing to sign up for means no password of yours to hold and no profile of you to build.',
              },
              {
                icon: ShieldCheck,
                t: 'No result gating',
                d: 'The full result renders first. Any offer to email something comes after you already have it.',
              },
              {
                icon: Zap,
                t: 'Faster by design',
                d: 'Skipping the upload is not just private — it is why these tools feel instant.',
              },
              {
                icon: Radar,
                t: 'The maths is shown',
                d: 'Every calculator and checker explains its formula so you can verify it, not trust it.',
              },
            ].map((item) => (
              <li key={item.t} className="card-flat bg-white p-5">
                <item.icon className="size-5 text-violet-700" aria-hidden="true" />
                <h3 className="mt-3 font-display font-semibold text-[17px] tracking-normal">
                  {item.t}
                </h3>
                <p className="mt-1.5 text-[14px] text-ink-muted leading-5">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ======================================================== 16. FAQ */}
      <section aria-labelledby="home-faq" className="container-site py-16">
        <div className="mx-auto max-w-[46rem]">
          <div className="mb-6 text-center">
            <p className="eyebrow">Questions</p>
            <h2
              id="home-faq"
              className="mt-3 text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]"
            >
              The honest answers
            </h2>
          </div>
          <div className="divide-y divide-line border-line border-t">
            {HOME_FAQ.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer items-start justify-between gap-4 font-medium text-[17px] text-ink marker:content-none">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-violet-700 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[62ch] text-[16px] text-ink-muted leading-7">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== 17. CONTACT */}
      <ContactAndCta />

      {/* 18. The dual CTA cards and the dome that follow are no longer here —
             they moved into `components/layout/Footer.tsx` so that every page,
             not just this one, closes with the identical footer. */}

      <p className="sr-only">
        Built by <a href={parentLink('/', 'home-end')}>{SITE.parentName}</a>, an AI-first
        digital agency in Noida, Delhi NCR.
      </p>
    </>
  )
}
