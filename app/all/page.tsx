import { ArrowUpRight, BadgeCheck, Plug, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { ToolCard } from '@/components/ui/ToolCard'
import { PROMPTS } from '@/lib/prompts/registry'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolsByCategory, TOOLS } from '@/lib/tools/registry'

const TITLE = `All ${TOOLS.length} Free Online Tools — A to Z`
const DESCRIPTION = `Every free tool on Scult Tools, grouped by category. ${TOOLS.length} tools for SEO, business, developers, writing, design and AI visibility. No signup.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/all' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/all'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

/**
 * The complete directory — 2026 redesign.
 *
 * This does the completeness job that dumping every link into the sitewide
 * footer would do badly: it is one hop from anywhere, so no tool is ever more
 * than two clicks from any page.
 *
 * The redesign brings this page into the same visual language the category
 * and prompt pages already speak: a brutal pastel hero panel (this was the
 * one catalogue surface still opening with bare text on the ambient page),
 * category jump chips that carry the category's own icon and live count, and
 * per-category section headers with the pastel icon tile used everywhere
 * else a category is named. The old inline "looking for prompts?" paragraph
 * becomes a proper three-card row for the site's other catalogues.
 */
export default function AllToolsPage() {
  const clientSide = TOOLS.filter((t) => t.runsInBrowser).length

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'All tools', path: '/all' },
        ])}
      />

      <section className="container-site pt-10 pb-6">
        {/* Hero — the same brutal pastel panel language as /prompts/[category]
            and the prompt detail page, so every catalogue surface opens the
            same way. Tile fills are theme-FIXED light pastels: everything on
            them is literal black / violet-700, never adaptive ink. */}
        <header className="rounded-panel border border-ink bg-tile-blue p-6 shadow-brutal md:p-9">
          <p className="font-bold text-[12px] text-black/60 uppercase tracking-[0.14em]">
            Complete directory · {clientSide} of {TOOLS.length} run in your browser
          </p>
          <h1 className="mt-2 text-[38px] text-black leading-[1.05] tracking-[-1px] md:text-[52px] md:leading-[56px]">
            All {TOOLS.length} free tools
          </h1>
          <p className="mt-4 max-w-[62ch] text-[17px] text-black/70 leading-7">
            Everything on the site, grouped by category — no signup, no trial clock, no
            watermark on any of them.
          </p>

          <nav aria-label="Jump to category" className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="flex items-center gap-2 rounded-pill border border-black/80 bg-white px-4 py-2 font-medium text-[14px] text-black transition-all duration-150 hover:bg-cta hover:shadow-[3px_3px_0_0_rgb(0_0_0/0.9)]"
              >
                <Icon
                  name={c.icon}
                  className="size-4 text-violet-700"
                  aria-hidden="true"
                />
                {c.name}
                <span className="tabular-nums text-black/50">
                  {getToolsByCategory(c.slug).length}
                </span>
              </a>
            ))}
          </nav>
        </header>
      </section>

      {CATEGORIES.map((category) => {
        const tools = getToolsByCategory(category.slug)
        if (tools.length === 0) return null
        return (
          <section
            key={category.slug}
            id={category.slug}
            aria-labelledby={`${category.slug}-heading`}
            className="container-site scroll-mt-32 py-8"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                {/* The category's pastel tile — same face it wears in the
                    hero constellation, footer and category page. Fixed
                    pastel, so the icon stays literal violet-700. */}
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-ink/10"
                  style={{ background: `var(--color-tile-${category.tile})` }}
                >
                  <Icon
                    name={category.icon}
                    className="size-5.5 text-violet-700"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h2
                    id={`${category.slug}-heading`}
                    className="text-[24px] leading-tight tracking-[-0.5px] md:text-[28px]"
                  >
                    {category.name}
                  </h2>
                  <p className="text-[14px] text-ink-muted">{category.blurb}</p>
                </div>
              </div>
              {/* Plain link on the ambient background — the accent-text token
                  pattern used by every standalone link in this codebase. */}
              <Link
                href={`/${category.slug}`}
                className="flex items-center gap-1 font-medium text-[15px] text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
              >
                Category page
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )
      })}

      {/* The site's other catalogues — a proper row of cards instead of the
          old inline "looking for prompts?" paragraph. */}
      <section aria-labelledby="beyond-tools" className="container-site pt-4 pb-14">
        <h2
          id="beyond-tools"
          className="font-sans font-bold text-[13px] uppercase tracking-[0.1em]"
        >
          Beyond the tools
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: `${PROMPTS.length.toLocaleString('en-US')} AI prompts`,
              blurb:
                'Version-stamped prompts for ChatGPT, Claude, Cursor, Midjourney and more — shown in full, free.',
              href: '/prompts',
              cta: 'Browse the prompt library',
            },
            {
              icon: BadgeCheck,
              title: 'Agent skills, synced daily',
              blurb:
                'Real, public SKILL.md files for Claude Code, Cursor and Copilot — copy as-is or export for your agent.',
              href: '/skills',
              cta: 'Browse the skills library',
            },
            {
              icon: Plug,
              title: 'The MCP server',
              blurb:
                'Call every tool on this page from your AI agent — one public endpoint, no auth, no signup.',
              href: '/mcp',
              cta: 'Connect your agent',
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="card-flat group flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink"
            >
              <span className="grid size-10 place-items-center rounded-[10px] bg-violet-500/10">
                <card.icon
                  className="size-5 text-[var(--color-violet-accent-text,var(--color-violet-700))]"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-3 font-display font-semibold text-[18px] tracking-normal">
                {card.title}
              </span>
              <span className="mt-1 text-[14px] text-ink-muted leading-5">
                {card.blurb}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 font-medium text-[14px] text-[var(--color-violet-accent-text,var(--color-violet-700))] group-hover:text-violet-600">
                {card.cta}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
