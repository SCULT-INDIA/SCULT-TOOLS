'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { PROMPTS } from '@/lib/prompts/registry'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolsByCategory, TOOLS } from '@/lib/tools/registry'

/**
 * Second redesign of this section — the first attempt (a static two-cell
 * bento) didn't land. This one uses a segmented pill control instead: a
 * distinct component from `CategoryTabs` a few sections below, which
 * already does "click a tab, see that category's tools" as full-bleed
 * underline tabs on violet. Cloning that mechanic here too would put two
 * near-identical interactions back to back on the same page — the exact
 * thing this file's own history already flags as a mistake (see the removed
 * "9. BENEFITS GRID" comment in app/page.tsx). So this stays a compact,
 * light segmented control that defaults to "All" — the section still works
 * as a glanceable directory without requiring a click — and adds a Prompts
 * tab CategoryTabs doesn't have, which is where the prompt-library count
 * and AI-tool brand logos now live.
 */

type TabId = 'all' | (typeof CATEGORIES)[number]['slug'] | 'prompts'

const PROMPT_BRAND_WALL = [
  'chatgpt',
  'claude',
  'cursor',
  'midjourney',
  'gemini',
  'perplexity',
  'github-copilot',
  'veo',
] as const

export function FullServiceGrid() {
  const [active, setActive] = useState<TabId>('all')

  const tabs: { id: TabId; label: string }[] = [
    { id: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ id: c.slug, label: c.shortName })),
    { id: 'prompts', label: 'Prompts' },
  ]

  const visibleTools =
    active === 'all' ? TOOLS : active === 'prompts' ? [] : getToolsByCategory(active)

  return (
    <section aria-labelledby="full-scope" className="container-site py-16">
      <div className="mb-8 text-center">
        <p className="eyebrow">Everything on the site</p>
        <h2
          id="full-scope"
          className="mt-3 text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]"
        >
          The full scope of tools
        </h2>
      </div>

      {/* Segmented pill control — one bg-offwhite track holding pill
          buttons, the active one lifted to bg-ink/text-white. A different
          silhouette from CategoryTabs' underline-on-violet tabs on purpose,
          so the two don't read as the same component reused twice. */}
      <div
        role="tablist"
        aria-label="Filter by category"
        className="mb-8 flex flex-wrap justify-center gap-1 rounded-pill border border-line bg-offwhite p-1.5"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`rounded-pill px-4 py-2 text-[13px] transition-colors duration-150 ${
              active === tab.id
                ? 'bg-ink font-bold text-offwhite'
                : 'font-medium text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-panel border border-line bg-offwhite p-6 md:p-8">
        {active === 'prompts' ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <div>
              <p className="eyebrow">The other catalogue</p>
              <p className="mt-2 font-display text-[40px] text-ink leading-none">
                {PROMPTS.length}
              </p>
              <p className="mt-1 text-[15px] text-ink-muted leading-6">
                AI prompts, organized by the tool they're built for — no account, shown in
                full.
              </p>
            </div>

            <ul
              aria-label="AI tools covered by the prompt library"
              className="flex flex-wrap justify-center gap-2"
            >
              {PROMPT_BRAND_WALL.map((brand) => (
                <li key={brand}>
                  {/* Literal bg-white, not an adaptive surface: brand marks
                      are drawn for a light chip, and inverting the tile in
                      dark mode would misrepresent the logo — same call
                      PromptLibrarySpotlight already makes for its own wall. */}
                  <span className="flex size-11 items-center justify-center rounded-xl border border-ink/10 bg-white">
                    <BrandIcon brand={brand} size={22} />
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/prompts"
              className="btn-brutal btn-brutal-sm border-black text-black hover:border-ink hover:text-ink"
            >
              BROWSE PROMPTS
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visibleTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.category}/${tool.slug}`}
                className="chip-tool items-start gap-2.5 px-4 py-3 text-[14px] leading-5"
              >
                {/* The tool's own mark. mt-0.5 optically centres it against
                    the first text line once a long name wraps to two. */}
                <Image
                  src={`/tool-icons/${tool.slug}.png`}
                  alt=""
                  aria-hidden="true"
                  width={20}
                  height={20}
                  className="mt-0.5 size-5 shrink-0 rounded-full ring-1 ring-line"
                />
                {/* Wrap rather than truncate: half these names are long
                    enough that truncate cut them mid-word, which reads as
                    broken rather than tidy. */}
                <span>{tool.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-7 text-center">
        <Link
          href="/all"
          className="inline-flex items-center gap-1.5 font-bold text-[14px] text-ink uppercase tracking-[0.08em] hover:text-violet-600"
        >
          Full directory of {TOOLS.length} tools
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
