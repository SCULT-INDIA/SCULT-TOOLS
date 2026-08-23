import Image from 'next/image'
import Link from 'next/link'
import { PROMPT_COUNT, TOOL_COUNT } from '@/lib/search'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolCount } from '@/lib/tools/registry'
import scultMark from '@/public/brand/scult-mark.png'
import { AllToolsLink } from './AllToolsLink'
import { AnnouncementBar } from './AnnouncementBar'
import { CategoryMenu } from './CategoryMenu'
import { GitHubStarButton } from './GitHubStarButton'
import { MobileDrawer } from './MobileDrawer'
import { PromptsLink } from './PromptsLink'
import { SkillsLink } from './SkillsLink'
import { SearchBox } from './SearchBox'

/**
 * The floating white pill nav — same `.nav-pill` treatment (white fill, 2px
 * ink border, panel radius, brutal shadow) as always, rebuilt at a
 * noticeably smaller scale: 83px tall on desktop read as oversized for a
 * bar that's sticky on every page, so the pill height, padding, gaps, logo
 * and nav-link type size are all cut down together rather than shrinking
 * any one of them in isolation (which would just leave the rest looking too
 * big next to it). The two things this redesign was told explicitly to
 * keep — the GitHub star button and the AI Visibility Checker CTA — both
 * still render at the same breakpoints as before; the checker's button now
 * carries the violet fill (`.btn-violet`) that its own hero panel uses,
 * since it's the site's flagship tool and the plain cta-yellow "ALL TOOLS"
 * button next to it should read as the secondary action.
 *
 * It is STICKY (the reference this was originally built from is not) —
 * suits a page you navigate repeatedly rather than scroll once — and it
 * carries a persistent search input, because 15+ tools cannot be reached
 * from a six-link bar.
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
      <div className="py-2.5">
        <div className="container-site">
          <div className="nav-pill flex h-[52px] items-center justify-between gap-3 px-3 md:h-[58px] lg:h-[64px] lg:gap-4 lg:px-5">
            {/* prefetch={false}: this logo sits in the sticky header, so it is
                in the initial viewport on every single page. Next's default
                viewport-prefetch would fetch the homepage's full RSC payload
                on every page load whether or not anyone clicks it — confirmed
                in a live PageSpeed trace as a ~230KB request competing with
                critical-path CSS/fonts for bandwidth. Disabling it costs
                nothing but a slightly later fetch on the click itself. */}
            <Link
              href="/"
              prefetch={false}
              className="inline-flex shrink-0 items-center gap-2"
            >
              {/* The circular mark — clipped to a true circle via
                  rounded-full + overflow-hidden regardless of what the
                  source PNG's own corners look like, so any square/black
                  background baked into the file never shows. No separate
                  wordmark image alongside it any more — the "Scult Tools"
                  name to its right is real text (brand font/colour), not a
                  second raster asset. */}
              <span className="block size-6 shrink-0 overflow-hidden rounded-full lg:size-7">
                <Image
                  src={scultMark}
                  alt=""
                  priority
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              </span>
              <span className="font-display font-semibold text-[17px] text-violet-700 lg:text-[19px]">
                Scult Tools
              </span>
            </Link>

            <nav
              aria-label="Main"
              className="hidden flex-1 items-center gap-5 font-medium text-[15px] text-ink tracking-[0.2px] lg:flex"
            >
              <CategoryMenu items={menuItems} />
              <AllToolsLink />
              <PromptsLink />
              <SkillsLink />
            </nav>

            {/* md, not lg: a tablet-width viewport has the room, and search
                is the single highest-leverage nav affordance on a 15-tool
                catalogue — no reason to withhold it for two more
                breakpoints just because the full link row still needs lg. */}
            <div className="hidden w-[170px] shrink-0 md:block lg:w-[200px]">
              <SearchBox toolCount={TOOL_COUNT} promptCount={PROMPT_COUNT} />
            </div>

            <div className="flex items-center gap-1.5">
              {/* lg-only: the star count is a nice-to-have, and every
                  breakpoint below this is already tight with search + the
                  primary CTA + the drawer trigger. Kept on the redesigned
                  nav per explicit instruction — one of exactly two elements
                  this redesign must not drop. */}
              <div className="hidden lg:block">
                <GitHubStarButton />
              </div>
              {/* Renamed from "TOOLS": at this breakpoint the main <nav>
                  (Tools dropdown + "All tools") is hidden, so this button IS
                  the only way to reach the catalogue — "TOOLS" read as a
                  menu trigger it isn't; "ALL TOOLS" names its real,
                  single-destination action. */}
              {/* prefetch={false} on both: same header-is-always-visible
                  reasoning as the logo above — these fire a full RSC-payload
                  fetch on every page load purely because they're on-screen,
                  not because anyone's about to click them. */}
              <Link
                href="/all"
                prefetch={false}
                className="btn-brutal btn-brutal-sm hidden whitespace-nowrap sm:inline-flex lg:hidden"
              >
                ALL TOOLS
              </Link>
              {/* The site's flagship tool — kept on the redesigned nav per
                  explicit instruction, the second of the two elements this
                  redesign must not drop. Violet-filled (`.btn-violet`)
                  rather than the plain cta-yellow "ALL TOOLS" button, so it
                  visually matches its own violet-900 hero panel and reads as
                  the primary action in this cluster. Same `.btn-brutal-sm`
                  sizing as every other compact CTA on the site — the nav's
                  compactness comes from the pill/logo/gaps around it, not
                  from a one-off smaller button that would break consistency
                  with the rest of the site's buttons. */}
              <Link
                href="/geo/ai-visibility-checker"
                prefetch={false}
                className="btn-brutal btn-violet btn-brutal-sm hidden whitespace-nowrap lg:inline-flex"
              >
                AI VISIBILITY
              </Link>
              <MobileDrawer
                categories={menuItems}
                toolCount={TOOL_COUNT}
                promptCount={PROMPT_COUNT}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
