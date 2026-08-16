import { Lock, Radar, ShieldCheck, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CategoryPlans } from '@/components/sections/CategoryPlans'
import { CategoryTabs } from '@/components/sections/CategoryTabs'
import { ContactAndCta } from '@/components/sections/ContactAndCta'
import { Hero } from '@/components/sections/Hero'
import { PromptLibrarySpotlight } from '@/components/sections/PromptLibrarySpotlight'
import { SecondaryHero } from '@/components/sections/SecondaryHero'
import { TechMarquee } from '@/components/sections/TechMarquee'
import { ToolShowcaseMarquee } from '@/components/sections/ToolShowcaseMarquee'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { UniversalIncludes } from '@/components/sections/UniversalIncludes'
import { Icon } from '@/components/ui/Icon'
import { JsonLd } from '@/lib/seo/jsonld'
import { parentLink, SITE } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolsByCategory, TOOLS } from '@/lib/tools/registry'

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
  const toolsByCategory = Object.fromEntries(
    CATEGORIES.map((c) => [
      c.slug,
      getToolsByCategory(c.slug).map((t) => ({
        slug: t.slug,
        category: t.category,
        title: t.title,
      })),
    ]),
  )

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

      {/* ========================================== 5b. PROMPT LIBRARY SPOTLIGHT
          The site's second catalogue gets the same homepage billing as the
          tools — pitch + official brand-logo wall, linking to /prompts. */}
      <PromptLibrarySpotlight />

      {/* 6. FULL SERVICE GRID — removed at the user's request. */}

      {/* =================================================== 7. CATEGORY TABS */}
      <CategoryTabs toolsByCategory={toolsByCategory} />

      {/* 8. SEARCH SPOTLIGHT — removed at the user's request. */}

      {/* 9. BENEFITS GRID — removed at the user's request. It duplicated the
             two-card checklist that UniversalIncludes (11) now carries, and two
             near-identical blocks on one page read as a mistake. */}

      {/* ================================================= 10. CATEGORY PLANS */}
      <CategoryPlans />

      {/* ============================================= 11. UNIVERSAL INCLUDES */}
      <UniversalIncludes />

      {/* ==================================================== 12. PROOF WALL —
             removed at the user's request. The "verified in code" claims read
             as too technical/developer-audit-toned for this page. */}

      {/* ============================================ 13. AI-VISIBILITY SPOTLIGHT
          Redesigned from scratch around a user-supplied swatch matching
          --color-violet-500 (#7030f8, this file's documented brand PRIMARY).
          That tone is a glow/gradient accent rather than the section's flat
          fill: violet-500 is calibrated for 6.06:1 as TEXT on white, and the
          identical ratio applies in reverse (white text on a violet-500
          fill) — AA-safe for body copy, but the cta-yellow eyebrow beneath
          sits at 14px/700, which needs 4.5:1 and only clears ~3.77:1 against
          a flat violet-500 fill. Keeping violet-900 (14.70:1, AAA) as the
          base and using violet-500 only as a soft blurred glow keeps every
          existing contrast guarantee while still visibly bringing in the
          brighter brand tone.

          The structural change beyond color: the right column used to be a
          plain icon+text bullet list, which reads as generic marketing copy
          with nothing to look at. It's now a small "device frame" mockup of
          the actual tool's own redesigned hero (giant score, real band
          vocabulary from bandFor() in logic.ts, a filled progress bar) with
          the three inspected signals as a compact checklist underneath —
          show the product, don't just describe it. The 84/"AI-visible"
          numbers are illustrative chrome for the mockup, not a live result;
          "AI-visible" itself is copied verbatim from the tool's real
          scoring bands so the marketing claim can't drift from the product. */}
      <section
        aria-labelledby="spotlight"
        className="relative overflow-hidden bg-violet-900 py-20 text-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[-12rem] size-[34rem] -translate-y-1/2 rounded-full bg-violet-500 opacity-40 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-8rem] left-[-8rem] size-[22rem] rounded-full bg-violet-500 opacity-20 blur-[100px]"
        />

        <div className="container-site relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            {/* Eyebrow as a glass badge instead of bare text — bg-black/20
                sits on top of violet-900 (already AAA) and only darkens it
                further, so the amber text's contrast margin only grows. */}
            <p className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-black/20 px-3 py-1.5">
              <span className="size-1.5 shrink-0 rounded-full bg-cta" />
              <span className="font-bold text-[12px] text-cta uppercase tracking-[0.12em]">
                New — GEO / AEO
              </span>
            </p>
            <h2
              id="spotlight"
              className="mt-5 max-w-[16ch] font-display text-[36px] text-white leading-[1.05] tracking-[-1.5px] md:text-[50px]"
            >
              Can AI search engines even see your site?
            </h2>
            <p className="mt-6 max-w-[50ch] text-[17px] text-white/75 leading-7">
              ChatGPT, Claude, Perplexity and Google's AI answers are becoming a real
              acquisition channel — and many sites block their crawlers without knowing
              it. Run the check: one URL in, a 0–100 visibility score and the exact fixes
              out.
            </p>
            {/* text-black/border-black force the resting-state text/border to
                literal black: .btn-brutal's own color/border both read
                var(--color-ink), which flips to near-white in dark mode while
                --color-cta (yellow) stays fixed, collapsing the face to
                ~1.45:1. hover:text-ink/hover:border-ink deliberately restore
                the token so the already-correct hover state (near-white on
                the dark-mode .btn-brutal:hover cream face) is untouched —
                utilities layer + :hover's higher specificity make that win
                back on hover in both themes. */}
            <Link
              href="/geo/ai-visibility-checker"
              className="btn-brutal mt-8 text-black border-black hover:text-ink hover:border-ink"
            >
              CHECK YOUR AI VISIBILITY
            </Link>
          </div>

          {/* Device-frame mockup of the tool's own hero. Soft glass +
              deep drop shadow deliberately reads as a different texture
              from the flat neo-brutalist .btn-brutal beside it — a
              considered two-texture pairing (sharp accent, soft canvas)
              rather than one flat idiom repeated everywhere on the page. */}
          <div
            aria-hidden="true"
            className="overflow-hidden rounded-panel border border-white/12 bg-white/[0.05] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 border-b border-white/10 bg-black/20 px-4 py-3">
              <span className="size-2 rounded-full bg-white/25" />
              <span className="size-2 rounded-full bg-white/25" />
              <span className="size-2 rounded-full bg-white/25" />
              <span className="ml-2 flex items-center gap-1.5 rounded-pill bg-white/10 px-3 py-1 text-[12px] text-white/60">
                <Icon name="Search" className="size-3" />
                tools.scult.in/geo/ai-visibility-checker
              </span>
            </div>

            <div className="p-6">
              <p className="font-bold text-[11px] text-white/50 uppercase tracking-[0.14em]">
                Visibility score
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-[56px] text-white leading-none">
                  84
                </span>
                <span className="text-[16px] text-white/45">/100</span>
                <span className="ml-auto rounded-pill bg-cta px-2.5 py-1 font-bold text-[12px] text-ink">
                  AI-visible
                </span>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-pill bg-white/10">
                <div className="h-full w-[84%] rounded-pill bg-cta" />
              </div>
            </div>

            <ul className="divide-y divide-white/10 border-t border-white/10">
              {[
                {
                  icon: 'Radar',
                  label: 'AI crawler access',
                  d: '10 of 10 crawlers allowed',
                },
                {
                  icon: 'FileCode2',
                  label: 'Structured data',
                  d: 'Organization schema found',
                },
                {
                  icon: 'Search',
                  label: 'Answer-ready basics',
                  d: 'Title, description, llms.txt',
                },
              ].map((row) => (
                <li key={row.label} className="flex items-center gap-3 px-6 py-3.5">
                  <Icon name={row.icon} className="size-4 shrink-0 text-white/60" />
                  <span className="font-medium text-[14px] text-white">{row.label}</span>
                  <span className="ml-auto text-[13px] text-white/55">{row.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 14. HOW IT WORKS — removed at the user's request. */}

      {/* ==================================================== 15. PRIVACY
          Redesigned as a small bento — researched first (see Sources in the
          chat reply): asymmetric bento grids are the one 2026 trend that
          held up in production (Apple/Google/Spotify-class sites went
          bento-first; +23% scroll depth over 12-col grids in the source
          data), while heavy glassmorphism/backdrop-blur measurably costs 15
          to 30% FPS on real devices — so this stays in the site's own
          card-flat/card-modern idiom rather than reaching for glass. The
          {clientSide}/{TOOLS.length} figure used to be buried mid-paragraph;
          it's the single most concrete proof point on the page, so it gets
          its own hero tile instead, with the paragraph rewritten so the
          number isn't stated twice. bg-ice/.card-flat/.card-modern are all
          real dark-mode-adaptive tokens (unlike the fixed-pastel spotlight
          section above), so no literal-black overrides are needed here. */}
      <section aria-labelledby="privacy" className="border-line border-y bg-ice py-16">
        <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Privacy as a feature</p>
            <h2
              id="privacy"
              className="mt-3 text-[34px] leading-[1.08] tracking-[-1px] md:text-[46px]"
            >
              Your files never leave your browser
            </h2>
            <p className="mt-5 text-[17px] text-ink-muted leading-7">
              Most of these tools do their work with your browser's own capabilities —
              Canvas, native parsers, Web APIs. There is no upload step to wait for and no
              server copy to worry about. Open your network panel and watch it stay empty
              while you work.
            </p>
            <p className="mt-4 text-[17px] text-ink-muted leading-7">
              The two diagnostics that must touch the network — the speed test and the AI
              visibility checker — send only the URL you type, never your content. The
              privacy page lists every tool and exactly what it does or does not send.
            </p>
            {/* See the AI-visibility CTA above for why text-black/border-black
                + hover:text-ink/hover:border-ink are needed here. */}
            <Link
              href="/privacy"
              className="btn-brutal btn-brutal-sm mt-7 text-black border-black hover:text-ink hover:border-ink"
            >
              READ THE PRIVACY TABLE
            </Link>
          </div>

          <div className="grid gap-4">
            {/* Hero bento cell — the proof number, promoted out of the
                paragraph and given its own visual weight. card-modern (not
                card-flat) so this one tile reads as a distinct register from
                the four beneath it — the same "not everything gets the same
                box" principle used in the tool-page redesigns earlier this
                session. */}
            <div className="card-modern relative overflow-hidden p-6">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-violet-500"
              />
              <p className="flex items-baseline gap-2">
                <span className="font-display text-[44px] text-ink leading-none">
                  {clientSide}
                </span>
                <span className="text-[18px] text-ink-muted">/ {TOOLS.length} tools</span>
              </p>
              <p className="mt-2 text-[14px] text-ink-muted leading-5">
                run entirely inside your browser — no upload, no server copy, nothing to
                intercept.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <li
                  key={item.t}
                  className="card-flat p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink"
                >
                  {/* bg-violet-500/10 is a translucent tint over whichever
                      adaptive surface it sits on (card-flat's own bg), not a
                      fixed opaque pastel — so unlike bg-violet-50/bg-tile-*,
                      it never needs a literal-black text override; only the
                      icon sits on it, and its color is set directly below. */}
                  <span className="grid size-10 place-items-center rounded-[10px] bg-violet-500/10">
                    <item.icon
                      className="size-5 text-[var(--color-violet-accent-text,var(--color-violet-700))]"
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="mt-3 font-display font-semibold text-[17px] tracking-normal">
                    {item.t}
                  </h3>
                  <p className="mt-1.5 text-[14px] text-ink-muted leading-5">{item.d}</p>
                </li>
              ))}
            </ul>
          </div>
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
                  {/* FAQ "+" toggle sits directly on this section's
                      container-site/offwhite ambient page background, not a
                      tile/violet-50/100 fill — same fix as the icons above. */}
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-[var(--color-violet-accent-text,var(--color-violet-700))] transition-transform group-open:rotate-45"
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
