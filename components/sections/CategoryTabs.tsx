'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { CATEGORIES } from '@/lib/tools/categories'

interface CategoryTabTool {
  readonly slug: string
  readonly category: string
  readonly title: string
}

/**
 * Reference: band 5 — a full-bleed violet section with a row of 7 text tabs,
 * a headline + body + CTA on the left, and stacked device-mockup screenshots
 * on the right. Tabs map onto our six categories exactly; the screenshot
 * stack is a live list of that category's real tools.
 *
 * 2026 redesign: underline text-tabs become pill tabs (the site's chip
 * vocabulary), the tablist gains real arrow-key navigation with a roving
 * tabindex (role="tab" promises keyboard semantics the old version never
 * delivered), the panel is now a genuine role="tabpanel", and the staggered
 * card list becomes a flat, scannable list with a hover arrow — the stagger
 * read as misalignment at this size, not composition.
 */
export function CategoryTabs({
  toolsByCategory,
}: {
  /** Slim `{slug, category, title}` per category, computed server-side in
   * `app/page.tsx` — importing `getToolsByCategory` here directly would pull
   * the full `TOOLS` registry (every tool's full FAQ/how-it-works/limitations
   * copy) into this client component just to read three short fields. */
  toolsByCategory: Readonly<Record<string, readonly CategoryTabTool[]>>
}) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const category = CATEGORIES[active]
  const tools = category ? (toolsByCategory[category.slug] ?? []) : []
  const totalTools = Object.values(toolsByCategory).reduce((n, t) => n + t.length, 0)

  function onTablistKeyDown(e: React.KeyboardEvent) {
    const last = CATEGORIES.length - 1
    let next: number | null = null
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1
    else if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next !== null) {
      e.preventDefault()
      setActive(next)
      tabRefs.current[next]?.focus()
    }
  }

  return (
    <section aria-labelledby="category-tabs" className="bg-violet-700 py-16 text-white">
      <div className="container-site">
        <div className="mb-8 text-center">
          <p className="inline-block -rotate-2 rounded-pill border border-black bg-cta px-3.5 py-1 font-bold text-[12px] text-black uppercase tracking-[0.12em] shadow-[3px_3px_0_0_rgb(0_0_0/0.9)]">
            The tools
          </p>
          <h2
            id="category-tabs"
            className="mt-4 text-[30px] text-white leading-[1.1] tracking-[-0.5px] md:text-[40px]"
          >
            {totalTools} tools across six categories
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[16px] text-white/75 leading-7">
            Built the way we build for clients — tested, accessible, and honest about
            their own limitations.
          </p>
          <p
            aria-hidden="true"
            className="mt-3 rotate-1 font-display font-semibold text-[18px] text-cta italic"
          >
            Pick your lane ↓
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Tool categories"
          onKeyDown={onTablistKeyDown}
          className="mb-10 flex flex-wrap justify-center gap-2.5"
        >
          {CATEGORIES.map((c, i) => (
            <button
              key={c.slug}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`category-tab-${c.slug}`}
              aria-selected={i === active}
              aria-controls="category-tabpanel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`whitespace-nowrap rounded-pill border border-black px-4 py-2 font-semibold text-[14px] transition-all duration-150 ${
                i === active
                  ? 'bg-cta text-black shadow-[3px_3px_0_0_rgb(0_0_0/0.9)]'
                  : 'bg-white text-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgb(0_0_0/0.9)]'
              }`}
            >
              {c.name}
              <span className="ml-1.5 tabular-nums text-black/55">
                {(toolsByCategory[c.slug] ?? []).length}
              </span>
            </button>
          ))}
        </div>

        {category ? (
          <div
            role="tabpanel"
            id="category-tabpanel"
            aria-labelledby={`category-tab-${category.slug}`}
            className="grid items-center gap-10 lg:grid-cols-2"
          >
            <div>
              <h3 className="max-w-[16ch] text-[30px] text-white leading-[1.15] tracking-[-0.5px] md:text-[38px]">
                {category.name} tools, done for you in your browser
              </h3>
              <p className="mt-4 max-w-[46ch] text-[16px] text-white/75 leading-7">
                {category.intro}
              </p>
              <Link href={`/${category.slug}`} className="btn-brutal mt-7">
                VIEW {category.shortName.toUpperCase()}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <ul className="grid gap-3" aria-label={`${category.name} tools`}>
              {tools.map((tool) => (
                // Opaque brutal cards, not translucent-white-on-violet: the
                // reference's right column is bright device mockups that pop
                // off the violet field. `bg-cream` (not literal white) so the
                // card follows the same light-surface elevation token as
                // every other card on the site.
                <li key={tool.slug}>
                  {/* The whole row is the link — a 15px text link inside a
                      wide dead card was a needlessly small target. */}
                  <Link
                    href={`/${tool.category}/${tool.slug}`}
                    className="group flex items-center gap-4 rounded-md border border-black bg-cream p-4 shadow-[4px_4px_0_0_rgb(0_0_0/0.9)] transition-all duration-150 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgb(0_0_0/0.9)]"
                  >
                    <Image
                      src={`/tool-icons/${tool.slug}.png`}
                      alt=""
                      aria-hidden="true"
                      width={36}
                      height={36}
                      className="size-9 shrink-0 rounded-full ring-1 ring-line"
                    />
                    {/* hover:text-violet-600, not -700: only the -600 utility
                        has an existing dark-mode hover fix wired in
                        globals.css — see CategoryPlans for the precedent. */}
                    <span className="font-medium text-[15px] text-ink transition-colors group-hover:text-violet-600">
                      {tool.title}
                    </span>
                    <ArrowUpRight
                      className="ml-auto size-4 shrink-0 text-ink-subtle opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
