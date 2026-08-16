'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { CATEGORIES } from '@/lib/tools/categories'

interface CategoryTabTool {
  readonly slug: string
  readonly category: string
  readonly title: string
}

/**
 * Reference: band 5 — a full-bleed violet section with a row of 7 text tabs
 * ("Landing Pages & Dashboard UI", "Logo Design & Branding"…), a headline +
 * body + CTA on the left, and stacked device-mockup screenshots on the right.
 *
 * Tabs map onto our six categories exactly. The screenshot stack is replaced
 * with a live list of that category's real tools, styled as stacked cards —
 * genuine content standing in for what was a decorative product photo.
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
  const category = CATEGORIES[active]
  const tools = category ? (toolsByCategory[category.slug] ?? []) : []

  return (
    <section aria-labelledby="category-tabs" className="bg-violet-700 py-16 text-white">
      <div className="container-site">
        <h2 id="category-tabs" className="sr-only">
          Browse tools by category
        </h2>
        <div
          role="tablist"
          aria-label="Tool categories"
          className="mb-10 flex flex-wrap justify-center gap-x-8 gap-y-3 border-white/20 border-b pb-4"
        >
          {CATEGORIES.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`whitespace-nowrap pb-3 text-[15px] transition-colors ${
                i === active
                  ? 'border-cta border-b-2 font-semibold text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {category ? (
          <div className="grid items-center gap-10 lg:grid-cols-2">
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
              {tools.map((tool, i) => (
                // Opaque cards, not translucent-white-on-violet. The reference's
                // right column is bright device mockups that pop off the violet
                // field; `bg-white/5` reads as flat monotone at this size.
                // `bg-cream` (not a literal white) so the card follows the same
                // light-surface elevation token as every other card on the site
                // once dark mode flips it to a near-black surface.
                <li
                  key={tool.slug}
                  className="flex items-center gap-4 rounded-md bg-cream p-4 shadow-card"
                  style={{ marginLeft: i % 2 === 1 ? '1.5rem' : undefined }}
                >
                  <Image
                    src={`/tool-icons/${tool.slug}.png`}
                    alt=""
                    aria-hidden="true"
                    width={36}
                    height={36}
                    className="size-9 shrink-0 rounded-full ring-1 ring-line"
                  />
                  {/* hover:text-violet-600, not hover:text-violet-700: this
                      is the same rest-ink/hover-accent pattern CategoryPlans
                      uses just below, and only the -600 utility has an
                      existing dark-mode hover fix wired in globals.css. -700
                      measures ~2.27:1 on this card's dark-mode `bg-cream`, an
                      AA failure the -600 swap avoids for free. */}
                  <Link
                    href={`/${tool.category}/${tool.slug}`}
                    className="font-medium text-[15px] text-ink hover:text-violet-600"
                  >
                    {tool.title}
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
