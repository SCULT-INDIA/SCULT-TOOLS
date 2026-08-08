import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolCount } from '@/lib/tools/registry'
import scultLogo from '@/public/brand/scult-tools-blue.png'
import { AllToolsLink } from './AllToolsLink'
import { AnnouncementBar } from './AnnouncementBar'
import { CategoryMenu } from './CategoryMenu'
import { GitHubStarButton } from './GitHubStarButton'
import { MobileDrawer } from './MobileDrawer'
import { PromptsLink } from './PromptsLink'
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
    <header className="sticky top-0 z-50 w-full bg-offwhite">
      <AnnouncementBar />

      {/* pt-3, not just pb-3: once the announcement bar is dismissed (or on
          a repeat visit, where it stays dismissed), this pill is the first
          thing in the sticky header — with no top padding its own top
          border sits flush against the viewport edge, which reads as
          clipped rather than as a bordered pill. Symmetric with the
          existing pb-3 below it. */}
      <div className="py-3">
        <div className="container-site">
          <div className="nav-pill flex h-[60px] items-center justify-between gap-4 px-4 md:h-[68px] lg:h-[83px] lg:gap-6 lg:px-[30px]">
            <Link href="/" className="inline-flex shrink-0 items-center">
              <Image
                src={scultLogo}
                alt="SCULT Tools"
                priority
                className="h-7 w-auto lg:h-9"
              />
            </Link>

            <nav
              aria-label="Main"
              className="hidden flex-1 items-center gap-6 font-medium text-[18px] text-ink tracking-[0.5px] lg:flex"
            >
              <CategoryMenu items={menuItems} />
              <AllToolsLink />
              <PromptsLink />
            </nav>

            {/* md, not lg: a tablet-width viewport has the room, and search
                is the single highest-leverage nav affordance on a 15-tool
                catalogue — no reason to withhold it for two more
                breakpoints just because the full link row still needs lg. */}
            <div className="hidden w-[200px] shrink-0 md:block lg:w-[240px]">
              <SearchBox />
            </div>

            <div className="flex items-center gap-2">
              {/* lg-only: the star count is a nice-to-have, and every
                  breakpoint below this is already tight with search + the
                  primary CTA + the drawer trigger. */}
              <div className="hidden lg:block">
                <GitHubStarButton />
              </div>
              <ThemeToggle />
              {/* Renamed from "TOOLS": at this breakpoint the main <nav>
                  (Tools dropdown + "All tools") is hidden, so this button IS
                  the only way to reach the catalogue — "TOOLS" read as a
                  menu trigger it isn't; "ALL TOOLS" names its real,
                  single-destination action. */}
              <Link
                href="/all"
                className="btn-brutal btn-brutal-sm hidden whitespace-nowrap sm:inline-flex lg:hidden"
              >
                ALL TOOLS
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
