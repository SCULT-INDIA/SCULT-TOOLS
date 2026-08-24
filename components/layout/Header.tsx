import Image from 'next/image'
import Link from 'next/link'
import { PROMPT_COUNT, TOOL_COUNT } from '@/lib/search'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolCount } from '@/lib/tools/registry'
import scultMark from '@/public/brand/scult-mark.png'
import { BlogsMenu } from './BlogsMenu'
import { CategoryMenu } from './CategoryMenu'
import { GitHubStarButton } from './GitHubStarButton'
import { McpMenu } from './McpMenu'
import { MobileDrawer } from './MobileDrawer'
import { OurBrandsMenu } from './OurBrandsMenu'
import { PromptsMenu } from './PromptsMenu'
import { ResourcesMenu } from './ResourcesMenu'
import { SearchBox } from './SearchBox'
import { SkillsMenu } from './SkillsMenu'

/**
 * The floating white pill nav — same `.nav-pill` treatment (white fill, 2px
 * ink border, panel radius, brutal shadow) as always, rebuilt at a
 * noticeably smaller scale: 83px tall on desktop read as oversized for a
 * bar that's sticky on every page, so the pill height, padding, gaps, logo
 * and nav-link type size are all cut down together rather than shrinking
 * any one of them in isolation (which would just leave the rest looking too
 * big next to it). The two things this redesign was told explicitly to
 * keep — the GitHub star button and the AI Visibility Checker CTA — both
 * still render, now at `xl` rather than `lg` since the link row grew from
 * 4 items to 7 when Prompts/Skills/MCP/Blogs/Our Brands each became their
 * own dropdown; the checker's button carries the violet fill
 * (`.btn-violet`) that its own hero panel uses, since it's the site's
 * flagship tool and the plain cta-yellow "ALL TOOLS" button next to it
 * should read as the secondary action.
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
    // Transparent, not `bg-offwhite`: the homepage hero's own radial glow
    // (see Hero.tsx) bleeds up behind this header, and a solid fill here
    // would hide it everywhere except directly behind the pill (which
    // stays opaque and legible on its own — `.nav-pill`'s white background
    // is unrelated to this one). On every other page this is invisible —
    // there's nothing colourful behind it, so it reads as the same
    // `--color-offwhite` the page body already paints underneath.
    //
    // `relative`, not `sticky top-0`: this used to stay pinned while
    // scrolling, but a pinned header only makes sense opaque — pinned AND
    // transparent means, past the hero, it would sit on top of whatever
    // scrolls underneath it and show that content bleeding through the
    // gaps beside the pill. Static-in-flow, it only ever renders where it
    // actually sits in the page (the hero's own glow behind it), then
    // scrolls away normally with everything else. `relative` (not the
    // default `static`) is kept only so `z-50` still applies — z-index is
    // inert on a non-positioned element — for the nav's own dropdowns.
    <header className="relative z-50 w-full">
      {/* The announcement bar that used to render here was removed
          entirely, not just hidden — it was dismissible and persisted its
          own dismissal in localStorage, so keeping the component around
          unused would just be dead code once nothing renders it. */}
      <div className="py-2.5">
        <div className="container-site">
          {/* A true `1fr`/`1fr` (or `minmax(0,1fr)`/`minmax(0,1fr)`) grid
              was tried here to force both outer columns to the same width
              regardless of their content, so the middle nav would land
              exactly on the bar's true centre. It doesn't work at this
              bar's real content widths: logo ≈155px, but search+GitHub+CTA
              together need ≈414-428px, and forcing that column down to
              match the logo's 155px doesn't shrink its content — the
              search box (shrink-0 by design) just overflows the narrowed
              column and visibly overlapped the nav by >100px. There is no
              layout technique that fixes this without either widening the
              breakpoint a lot further or shrinking the search box to an
              icon that expands on focus (a real behaviour change, not a
              layout tweak) — flex + `justify-center` on the nav gets as
              close to centred as the content honestly allows, without the
              overlap. */}
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

            {/* flex-1 + justify-center: this is the closest a link row this
                wide can get to "centred" without the search box overflowing
                its own space (see the note above the outer pill div) — it
                centres within whatever room is actually left after the
                logo and the right-hand cluster take theirs, which lands
                close to, not exactly on, the bar's true midpoint. */}
            <nav
              aria-label="Main"
              className="hidden flex-1 items-center justify-center gap-3 font-medium text-[13px] text-ink tracking-[0.2px] xl:flex"
            >
              <CategoryMenu items={menuItems} />
              <PromptsMenu />
              <SkillsMenu />
              <McpMenu />
              <BlogsMenu />
              <OurBrandsMenu />
              <ResourcesMenu />
            </nav>

            <div className="flex items-center gap-1.5">
              {/* md, not lg: a tablet-width viewport has the room, and
                  search is the single highest-leverage nav affordance on a
                  15-tool catalogue — no reason to withhold it for two more
                  breakpoints just because the full link row still needs lg.
                  Narrower again at xl specifically: that's also where the
                  link row grows from 4 items to 7, and the two together
                  measurably overflowed the pill at 1280px before this. */}
              <div className="hidden w-[170px] shrink-0 md:block lg:w-[200px] xl:w-[140px]">
                <SearchBox toolCount={TOOL_COUNT} promptCount={PROMPT_COUNT} />
              </div>
              {/* xl-only, matching the main <nav> above: the link row now
                  carries 7 items (Tools/Prompts/Skills/MCP/Blogs/Our
                  Brands/Resources), which needs the extra room `xl` gives
                  it over the `lg` this bar used before splitting Explore
                  apart — every breakpoint below `xl` falls back to the
                  drawer instead, which now covers that whole range (see
                  MobileDrawer). Kept on the redesigned nav per explicit
                  instruction — one of exactly two elements this redesign
                  must not drop. */}
              <div className="hidden xl:block">
                <GitHubStarButton />
              </div>
              {/* Renamed from "TOOLS": at this breakpoint the main <nav>
                  (the Tools dropdown) is hidden, so this button IS the only
                  way to reach the catalogue — "TOOLS" read as a menu trigger
                  it isn't; "ALL TOOLS" names its real, single-destination
                  action. */}
              {/* prefetch={false} on both: same header-is-always-visible
                  reasoning as the logo above — these fire a full RSC-payload
                  fetch on every page load purely because they're on-screen,
                  not because anyone's about to click them. */}
              <Link
                href="/all"
                prefetch={false}
                className="btn-brutal btn-brutal-sm hidden whitespace-nowrap sm:inline-flex xl:hidden"
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
                className="btn-brutal btn-violet btn-brutal-sm hidden whitespace-nowrap xl:inline-flex"
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
