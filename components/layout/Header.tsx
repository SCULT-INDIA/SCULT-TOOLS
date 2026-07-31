import Image from 'next/image'
import Link from 'next/link'
import scultMark from '@/app/icon.png'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolCount } from '@/lib/tools/registry'
import { AnnouncementBar } from './AnnouncementBar'
import { CategoryMenu } from './CategoryMenu'
import { MobileDrawer } from './MobileDrawer'
import { SearchBox } from './SearchBox'

/**
 * The reference site's floating white pill nav — reproduced closely, with two
 * deliberate deviations, both documented in docs/PLAN.md:
 *   1. It is STICKY. The reference header is position:static, which suits a page
 *      you scroll once; a tools hub gets navigated repeatedly.
 *   2. It carries a persistent search input, because 15 tools cannot be
 *      navigated from a six-link bar.
 *
 * The reference's aurora glow behind the pill was REMOVED at the user's request —
 * it read as an odd blue smear rather than the reference's soft halo. With it went
 * the machinery it required: the `overflow-hidden` clip that stopped a sticky
 * gradient painting over scrolled content, the `isolate`/`relative` stacking
 * context for its negative z-index, and the `pb-16` that reserved room for its
 * bleed. None of that has any purpose without the gradient.
 *
 * The `.aurora` class itself is left in globals.css — the hero still uses the
 * same visual language and it costs nothing unreferenced.
 *
 * Note the pill's white fill was load-bearing while the aurora existed (black
 * 18px/500 nav text measured 3.36:1 over the gradient core, an AA failure). On
 * plain white that risk is gone, but the fill stays: it is what makes the pill
 * read as a pill.
 */
export function Header() {
  // Counts are resolved on the server so the client menu ships data, not the
  // whole registry.
  const menuItems = CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    blurb: c.blurb,
    icon: c.icon,
    count: getToolCount(c.slug),
  }))

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <AnnouncementBar />

      <div className="pb-3">
        <div className="container-site">
          <div className="nav-pill flex h-[60px] items-center justify-between gap-4 px-4 md:h-[68px] lg:h-[83px] lg:gap-6 lg:px-[30px]">
            {/* The mark is the same PNG that generates the browser-tab favicon
                (app/icon.png) — one asset, so the tab icon and the on-page logo
                can never drift out of sync. `alt=""`: the adjacent wordmark
                already announces "ScultTools" in text, so the mark is decorative
                reinforcement rather than a second, redundant name. */}
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2 font-display font-bold text-[26px] text-violet-600 tracking-[-0.5px] lg:text-[30px]"
            >
              <Image
                src={scultMark}
                alt=""
                width={30}
                height={30}
                priority
                className="size-6 lg:size-[30px]"
              />
              Scult<span className="text-ink">Tools</span>
            </Link>

            <nav
              aria-label="Main"
              className="hidden flex-1 items-center gap-6 font-medium text-[18px] text-ink tracking-[0.5px] lg:flex"
            >
              <CategoryMenu items={menuItems} />
              <Link href="/all" className="hover:text-violet-600">
                All tools
              </Link>
            </nav>

            <div className="hidden w-[240px] shrink-0 lg:block">
              <SearchBox />
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/all"
                className="btn-brutal btn-brutal-sm hidden whitespace-nowrap sm:inline-flex lg:hidden"
              >
                TOOLS
              </Link>
              <Link
                href="/geo/ai-visibility-checker"
                className="btn-brutal btn-brutal-sm hidden whitespace-nowrap lg:inline-flex"
              >
                CHECK AI VISIBILITY
              </Link>
              <MobileDrawer />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
