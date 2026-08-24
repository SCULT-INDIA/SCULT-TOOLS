import { Lock, Radar, ShieldCheck, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CategoryPlans } from '@/components/sections/CategoryPlans'
import { CategoryTabs } from '@/components/sections/CategoryTabs'
import { ContactAndCta } from '@/components/sections/ContactAndCta'
import { Hero } from '@/components/sections/Hero'
import { McpSpotlight } from '@/components/sections/McpSpotlight'
import { PromptLibrarySpotlight } from '@/components/sections/PromptLibrarySpotlight'
import { ResourcesStrip } from '@/components/sections/ResourcesStrip'
import { SkillLibrarySpotlight } from '@/components/sections/SkillLibrarySpotlight'
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
 * The hub home page — 2026 redesign.
 *
 * The original page was a section-by-section clone of the draftss.com
 * reference (see docs/PLAN.md §5); this pass keeps only what earns its
 * scroll. Three sections are LOCKED by explicit user decision (hero,
 * universal-includes band, footer + its closing CTA cards — the footer lives
 * in components/layout/Footer.tsx); everything between them was rebuilt or
 * cut:
 *
 *   - CUT: TechMarquee, SecondaryHero, ToolShowcaseMarquee. Together with
 *     CategoryTabs they were four consecutive restatements of "here are the
 *     tools" — one strong catalogue section (CategoryTabs, rebuilt) now
 *     carries that job alone.
 *   - NEW: McpSpotlight (the public MCP server had zero homepage presence)
 *     and ResourcesStrip (blog/guides/glossary/collections wayfinding).
 *   - REBUILT: TrustStrip (receipts band), both library spotlights (product
 *     mockups instead of twin logo walls), the AI-visibility spotlight, the
 *     privacy bento, FAQ and contact.
 *
 * Every number and claim is computed from the registry or independently
 * verifiable in the browser — no fabricated ratings, counters or
 * testimonials anywhere on this page.
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
    q: 'Are the prompts and skills free too?',
    a: 'Completely. Every prompt is shown in full on its own page — no teaser, no unlock, no email gate — and every skill is a real public SKILL.md you can copy as-is or export for your agent. The same zero-signup rule covers all three catalogues.',
  },
  {
    q: 'What is the MCP server?',
    a: 'A free, public endpoint that lets AI agents — Claude, Cursor, ChatGPT or any MCP client — call these tools directly: generate schema markup, build UTM links, search the prompt and skill libraries, all mid-conversation. One config line to connect, no auth. Setup instructions live on the MCP page.',
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

export default async function Home() {
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
          LOCKED section — see the redesign notes in the file docblock. */}
      <Hero />

      {/* ==================================================== 2. TRUST STRIP
          Receipts band: the verifiable numbers, at display weight. */}
      <TrustStrip />

      {/* ============================================== 3. CATEGORY EXPLORER
          The one and only "here are the tools" section — violet band,
          pill tabs with live counts, arrow-key navigable. */}
      <CategoryTabs toolsByCategory={toolsByCategory} />

      {/* ========================================== 4. PROMPT LIBRARY SPOTLIGHT
          Second catalogue — lavender panel, real prompt-card mockup. */}
      <PromptLibrarySpotlight />

      {/* ============================================ 5. SKILLS LIBRARY SPOTLIGHT
          Third catalogue — green panel, SKILL.md terminal, mirrored layout.
          Count is live from Supabase since this catalogue grows daily. */}
      <SkillLibrarySpotlight />

      {/* ==================================================== 6. MCP SPOTLIGHT
          The public MCP server — every tool/prompt/skill callable from any
          agent. Dark developer band, real install command. */}
      <McpSpotlight />

      {/* ===================================================== 7. PRICING
          The honest conversion section — when a free tool is not enough. */}
      <CategoryPlans />

      {/* ============================================= 8. UNIVERSAL INCLUDES
          LOCKED section (text refreshed to cover all three catalogues). */}
      <UniversalIncludes />

      {/* ============================================ 9. AI-VISIBILITY SPOTLIGHT
          The flagship tool. violet-900 base (14.70:1, AAA) with violet-500
          only as a soft blurred glow — the brighter brand tone without
          giving up any contrast guarantee (white on flat violet-500 fails
          for the 14px cta-yellow eyebrow). The right column is a device
          frame of the tool's own hero: giant score, real band vocabulary
          from bandFor() in logic.ts, signals checklist and one suggested
          fix — show the product, don't describe it. The 84/"AI-visible"
          numbers are illustrative chrome, not a live result; "AI-visible"
          is copied verbatim from the tool's real scoring bands. */}
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
            {/* Eyebrow as a tilted cta sticker — black-on-cta clears AA and
                matches the badge vocabulary the MCP band uses. */}
            <p className="inline-flex rotate-[-1.5deg] items-center gap-2 rounded-pill border border-ink bg-cta px-3.5 py-1.5 shadow-brutal-sm">
              <span className="size-1.5 shrink-0 rounded-full bg-black" />
              <span className="font-bold text-[12px] text-black uppercase tracking-[0.12em]">
                The flagship — GEO / AEO
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
                literal black on the fixed-dark band; hover:text-ink/
                hover:border-ink restore the token for the hover face. */}
            <Link
              href="/geo/ai-visibility-checker"
              className="btn-brutal mt-8 border-black text-black hover:border-ink hover:text-ink"
            >
              CHECK YOUR AI VISIBILITY
            </Link>
          </div>

          {/* Device-frame mockup of the tool's own hero — tilted a degree
              like the page's other sticker mockups, straightening on hover. */}
          <div
            aria-hidden="true"
            className="rotate-1 overflow-hidden rounded-panel border border-white/15 bg-white/[0.05] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-transform duration-200 hover:rotate-0"
          >
            <div className="flex items-center gap-2 border-white/10 border-b bg-black/20 px-4 py-3">
              <span className="size-2 rounded-full bg-white/25" />
              <span className="size-2 rounded-full bg-white/25" />
              <span className="size-2 rounded-full bg-white/25" />
              <span className="ml-2 flex items-center gap-1.5 rounded-pill bg-white/10 px-3 py-1 text-[12px] text-white/60">
                <Icon name="Search" className="size-3" />
                tools.scult.in/geo/ai-visibility-checker
              </span>
            </div>

            <div className="p-6">
              <p className="font-bold text-[11px] text-white/65 uppercase tracking-[0.14em]">
                Visibility score
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-[56px] text-white leading-none">
                  84
                </span>
                <span className="text-[16px] text-white/65">/100</span>
                <span className="ml-auto rounded-pill bg-cta px-2.5 py-1 font-bold text-[12px] text-ink">
                  AI-visible
                </span>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-pill bg-white/10">
                <div className="h-full w-[84%] rounded-pill bg-cta" />
              </div>
            </div>

            <ul className="divide-y divide-white/10 border-white/10 border-t">
              {[
                {
                  icon: 'Radar',
                  label: 'AI crawler access',
                  d: '9 of 10 crawlers allowed',
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
              {/* One suggested fix — the tool's actual value is the fix list,
                  so the mockup shows one. Illustrative, like the score. */}
              <li className="flex items-center gap-3 bg-black/20 px-6 py-3.5">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full bg-cta"
                />
                <span className="font-medium text-[14px] text-white">
                  1 fix suggested
                </span>
                <span className="ml-auto text-[13px] text-white/55">
                  robots.txt blocks GPTBot — fix shown
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ==================================================== 10. PRIVACY
          Rebuilt as a centered bento: header, then a five-tile grid with the
          {clientSide}/{TOOLS.length} figure — the single most concrete proof
          point on the page — as the anchor tile. bg-ice/.card-flat/
          .card-modern are adaptive tokens, so no literal-black overrides are
          needed here. */}
      <section aria-labelledby="privacy" className="border-line border-y bg-ice py-16">
        <div className="container-site">
          <div className="mx-auto max-w-[54rem] text-center">
            <p className="eyebrow">Privacy as a feature</p>
            <h2
              id="privacy"
              className="mt-3 text-[34px] leading-[1.08] tracking-[-1px] md:text-[46px]"
            >
              Your files never leave your browser
            </h2>
            <p className="mx-auto mt-5 max-w-[62ch] text-[17px] text-ink-muted leading-7">
              Most of these tools do their work with your browser's own capabilities —
              Canvas, native parsers, Web APIs. No upload step, no server copy. Open your
              network panel and watch it stay empty while you work.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {/* Anchor tile — the proof number as a big cream brutal card
                with the page's one privacy CTA. bg-cream is an adaptive
                surface token, so its text uses adaptive ink. */}
            <div className="flex flex-col justify-between rounded-lg border border-ink bg-cream p-6 shadow-brutal lg:row-span-2">
              <div>
                <p className="flex items-baseline gap-2">
                  <span className="stat-figure font-semibold text-[64px] text-ink leading-none">
                    {clientSide}
                  </span>
                  <span className="text-[18px] text-ink-muted">
                    / {TOOLS.length} tools
                  </span>
                </p>
                <p
                  aria-hidden="true"
                  className="-rotate-1 mt-1 font-display font-semibold text-[16px] text-violet-700 italic"
                >
                  Your files stay yours
                </p>
                <p className="mt-3 text-[15px] text-ink-muted leading-6">
                  run entirely inside your browser — no upload, no server copy, nothing to
                  intercept. The two diagnostics that must touch the network (the speed
                  test and the AI visibility checker) send only the URL you type, never
                  your content.
                </p>
              </div>
              <Link
                href="/privacy"
                className="btn-brutal btn-brutal-sm mt-6 self-start border-black text-black hover:border-ink hover:text-ink"
              >
                READ THE PRIVACY TABLE
              </Link>
            </div>

            {/* Four pastel sticker tiles — fixed pastel fills, so text on
                them is literal black / violet-700, never adaptive ink. */}
            {[
              {
                icon: Lock,
                t: 'No accounts, ever',
                d: 'Nothing to sign up for means no password of yours to hold and no profile of you to build.',
                tile: 'yellow',
                tilt: '-rotate-1',
              },
              {
                icon: ShieldCheck,
                t: 'No result gating',
                d: 'The full result renders first. Any offer to email something comes after you already have it.',
                tile: 'blue',
                tilt: 'rotate-1',
              },
              {
                icon: Zap,
                t: 'Faster by design',
                d: 'Skipping the upload is not just private — it is why these tools feel instant.',
                tile: 'green',
                tilt: 'rotate-1',
              },
              {
                icon: Radar,
                t: 'The maths is shown',
                d: 'Every calculator and checker explains its formula so you can verify it, not trust it.',
                tile: 'lavender',
                tilt: '-rotate-1',
              },
            ].map((item) => (
              <div
                key={item.t}
                className={`rounded-lg border border-ink p-5 shadow-brutal-sm transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 ${item.tilt}`}
                style={{ background: `var(--color-tile-${item.tile})` }}
              >
                <span className="grid size-10 place-items-center rounded-[10px] border border-ink/15 bg-white">
                  <item.icon className="size-5 text-violet-700" aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-display font-semibold text-[17px] text-black tracking-normal">
                  {item.t}
                </h3>
                <p className="mt-1.5 text-[14px] text-black/60 leading-5">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================ 11. RESOURCES STRIP
          Blog / Guides / Glossary / Collections — quiet wayfinding row. */}
      <ResourcesStrip />

      {/* ======================================================== 12. FAQ
          Neo-brutal accordion rows — ink borders, hard shadows, a cta "+"
          disc — still native details/summary (keyboard and screen-reader
          behavior for free). */}
      <section aria-labelledby="home-faq" className="container-site pb-16">
        <div className="mx-auto max-w-[46rem]">
          <div className="mb-8 text-center">
            <p className="eyebrow">Questions</p>
            <h2
              id="home-faq"
              className="mt-3 text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]"
            >
              The honest answers
            </h2>
            <p
              aria-hidden="true"
              className="mt-2 rotate-1 font-display font-semibold text-[16px] text-violet-700 italic"
            >
              No corporate non-answers, promise
            </p>
          </div>
          <div className="grid gap-3.5">
            {HOME_FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-card border border-ink bg-cream px-5 py-4 shadow-brutal-sm transition-shadow open:shadow-brutal"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-[17px] text-ink marker:content-none">
                  {item.q}
                  {/* cta disc + ink border — the site's button vocabulary at
                      toggle size. bg-cream is adaptive; the disc's own cta
                      fill is fixed, so its glyph stays literal black. */}
                  <span
                    aria-hidden="true"
                    className="grid size-7 shrink-0 place-items-center rounded-full border border-ink bg-cta font-semibold text-[18px] text-black transition-transform duration-200 group-open:rotate-45"
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

      {/* ===================================================== 13. CONTACT */}
      <ContactAndCta />

      {/* 14. The dual CTA cards and the dome that follow live in
             `components/layout/Footer.tsx` (LOCKED), so every page closes
             with the identical footer. */}

      <p className="sr-only">
        Built by <a href={parentLink('/', 'home-end')}>{SITE.parentName}</a>, an AI-first
        digital agency in Noida, Delhi NCR.
      </p>
    </>
  )
}
