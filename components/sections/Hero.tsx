import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import scultMark from '@/app/icon.png'
import { SearchBox } from '@/components/layout/SearchBox'
import { Icon } from '@/components/ui/Icon'
import { UneedBadge } from '@/components/ui/UneedBadge'
import { PROMPTS } from '@/lib/prompts/registry'
import { CATEGORIES } from '@/lib/tools/categories'
import { TOOLS } from '@/lib/tools/registry'

/**
 * The homepage hero, matched to the user's approved mockup: an open white
 * composition (no framed canvas — the earlier cream box read as boxed-in and
 * was rejected), a serif headline with one gradient word, twin brutal CTAs, a
 * green-check reassurance row, and a hub-and-spoke constellation of the six
 * category cards around the central "S" mark.
 *
 * Deviations from the mockup, each deliberate:
 *   - The mockup shows an aurora glow around the nav pill. The header is NOT
 *     touched here — the user explicitly asked for that gradient's removal
 *     earlier, and the hero is not the header. If it is wanted back it is a
 *     one-line revert in Header.tsx, but it is not re-added silently.
 *   - The mockup labels one card "Writing"; the real category is Productivity,
 *     and the cards are generated from the registry so they can never drift
 *     from the categories that actually exist.
 *   - "boring" is upright in the mockup, so the <em> is styled not-italic —
 *     emphasis is carried by the gradient and weight instead.
 *   - A search box appears below the CTAs on small screens only. The header's
 *     search is hidden below `lg`, so without this the phone — most of this
 *     site's traffic — would have no search surface at all. From `lg` up the
 *     hero matches the mockup exactly, because the header search is visible.
 *   - The constellation is a labelled <nav> of real links, not a decorative
 *     image: same pixels, but reachable, focusable and announced. On small
 *     screens the absolute scatter cannot fit, so the same six cards render
 *     as a plain grid instead of disappearing.
 */
export function Hero() {
  return (
    // `pt-6 md:pt-8` (was `pt-12 md:pt-16`): every internal gap between the
    // eyebrow and the constellation was already compacted, so the biggest
    // remaining lever was the hero's own distance from the sticky header,
    // not one more internal gap. This moves the whole block up at once.
    <section aria-labelledby="hero-heading" className="pt-6 pb-8 text-center md:pt-8">
      <div className="container-site">
        {/* Real third-party recognition, sitting above the eyebrow so it adds
            its own block with its own margin rather than touching any of the
            "mt-*" spacing tuned against the eyebrow/CTA/constellation stack
            below (see the file's other comments) — this can't disturb that
            math because nothing below measures its distance FROM this. */}
        <div className="flex justify-center pb-3">
          <UneedBadge className="h-8 w-auto" />
        </div>

        <p className="eyebrow">
          {TOOLS.length} tools · {PROMPTS.length} AI prompts · zero signups
        </p>

        <h1
          id="hero-heading"
          className="mx-auto mt-4 max-w-[18ch] text-[40px] leading-[42px] tracking-[-1px] sm:text-[48px] sm:leading-[50px] md:text-[64px] md:leading-[66px] lg:text-[76px] lg:leading-[78px]"
        >
          Free tools that do the{' '}
          <em
            className="text-accent-gradient font-semibold not-italic"
          >
            boring
          </em>{' '}
          work for you
        </h1>

        <p className="mx-auto mt-4 max-w-[44ch] text-[17px] text-ink-muted leading-7 md:text-lead">
          SEO, business paperwork, developer utilities, writing, design and AI visibility
          — running right in your browser.
        </p>

        {/* The one differentiator a generic "free tools" aggregator can't
            claim, surfaced here instead of buried in FAQ #4 — Dunford's
            positioning framework treats "competitive alternative" as a
            prerequisite the hero should state, not leave to the visitor to
            infer. Deliberately its own short line, not appended onto the
            subhead paragraph above: the subhead's height feeds every
            "-mt-*" measurement further down this file (CTA row, checkmark
            row, constellation overlap math), so a new one-line element with
            its own small `mt` is safer than making that paragraph wrap
            wider — re-verified at lg/md that nothing below still overlaps. */}
        <p className="mx-auto mt-2 max-w-[44ch] text-[14px] text-ink-subtle">
          Built by Scult's own delivery team — the tools we use on client work, not a
          lead-gen funnel dressed up as free software.
        </p>

        {/* `mt-6` (was `mt-9`): next lowest-cost gap in the stack once the
            checkmark row above the constellation was already trimmed. Still
            clear of the subhead's own line-height, verified below. */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link href="/all" className="btn-brutal">
            EXPLORE ALL {TOOLS.length} TOOLS
          </Link>
          <Link href="/prompts" className="btn-brutal btn-violet">
            BROWSE {PROMPTS.length} PROMPTS
          </Link>
          <Link href="/geo/ai-visibility-checker" className="btn-brutal btn-white">
            CHECK AI VISIBILITY
          </Link>
        </div>

        {/* Reassurance row. The discs are decorative reinforcement (aria-hidden,
            the wording carries the meaning), so white-on-green is permissible
            here where it never would be for text.

            `mt-4` (was `mt-8`): the constellation below this row is already
            pulled up as far as it can go without overlapping it (a `-mt-2` on
            the nav cancels the stage's own internal top padding exactly, to
            0px gap — see that comment). Further "push it up" has to come from
            tightening spacing further up the stack instead, and this gap
            (between the CTA buttons and a purely decorative checkmark row)
            is the lowest-cost place to take it from — unlike the CTA row or
            headline spacing, tightening it doesn't crowd anything a visitor
            reads or clicks. */}
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {[
            'Free, no trial clock',
            'No account to create',
            'Files never leave your browser',
          ].map((item, i) => (
            <li key={item} className="flex items-center gap-4 text-[15px] text-ink">
              {i > 0 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-4 w-px bg-line-grey sm:block"
                />
              ) : null}
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="grid size-5 shrink-0 place-items-center rounded-full bg-green"
                >
                  <Check className="size-3 text-white" strokeWidth={3.5} />
                </span>
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* Mobile-only search — see the docblock. */}
        <div className="mx-auto mt-8 max-w-xl lg:hidden">
          <SearchBox size="large" />
        </div>
      </div>

      {/* ------------------------------------------------ category constellation */}

      {/* Small screens: the same six links as a plain grid. */}
      <nav aria-label="Browse by category" className="container-site mt-1 md:hidden">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </nav>

      {/* md and up: the mockup's scatter. Wider than the site container
          (max-w-7xl) so the outer cards can breathe past the text column, as
          in the mockup where SEO and AI Visibility reach toward the edges.
          `mt-1` (was `mt-12`, then `mt-4`): the stage's own percentage-based
          card positions already leave empty room below them (the lowest cards
          sit at 58% of the box height), so the visible gap was really coming
          from this margin stacking on top of that — closing it here pulls the
          whole constellation up toward the CTAs instead of rescaling the
          tuned per-card percentages, which risked new overlaps for no reason.
          A NEGATIVE margin now, by request — a deliberate layered look, cards
          reaching up over the reassurance row rather than just touching it.

          A shallow overlap here is worse than none: the hub and three of the
          six cards horizontally intersect the reassurance row's text (checked
          via each card's and each `<li>`'s `getBoundingClientRect`), so a few
          px of vertical overlap slices a card's straight bottom edge across
          the MIDDLE of whatever text sits under it — a jagged half-visible
          sliver of a word poking out beneath an opaque card, which reads as
          broken rendering, not a layered design.

          At `-mt-9` (-36px margin) the whole stage has shifted up enough that
          this stopped being a "how deep is the overlap" question at all: the
          card that still reaches the row's vertical range (the hub) no longer
          shares any horizontal span with its text — it now sits over the gap
          between list items, not over a word. Re-verified with the same check
          used to catch the original problem (every reassurance-row glyph rect
          and check-icon rect tested against every card's box for intersection,
          not just the cards assumed to be close): zero intersections. Also
          re-checked that this didn't overcorrect into the CTA buttons above —
          13px of clearance between the button row and the nearest card.

          Pushed to `-mt-12` (-48px) on `lg` — this is a hard floor, not an
          arbitrary stopping point. Past the reassurance row (a decorative
          checkmark list, where a card sitting over it is a style choice) the
          next thing up is the CTA buttons — real `<Link>` click targets. The
          user explicitly asked to push as close to them as possible WITHOUT
          any card covering part of a button, since that would both hide the
          label and likely steal the click (later DOM elements sit on top for
          hit-testing when boxes overlap). `-mt-12` is that exact boundary:
          verified at `lg` (1440/1920) the topmost card's box touches the CTA
          row's bottom edge at 0px, with zero card/button intersection and
          zero card intersection with the reassurance row's actual glyph and
          icon rects either. One step further would cross into the buttons.

          THIS CLASS IS NOT FLAT ACROSS BREAKPOINTS, and the reason is a real
          bug this same push uncovered: the mobile search box above
          (`lg:hidden`) is only hidden from `lg` up — it is still visible for
          the whole `md` range (768–1023px), where this constellation is ALSO
          visible (`md:block`). Every margin value tried before this one had
          only ever been checked at `lg`+ widths, where the search box is
          gone. Checked at `md` for the first time here: applied flat, the
          constellation overlapped 41px of the live search `<input>` at
          900px wide — a real form control, strictly worse than the button
          case above. `md:-mt-1` is this tier's own small, separately-verified
          pull-up (clear of the search box at 768 and 1023px, the range's own
          ends); `lg:-mt-12` is where the boundary value above actually
          applies, exactly where it was verified. */}
      <nav
        aria-label="Browse by category"
        className="relative mx-auto hidden h-[340px] w-full max-w-7xl px-4 md:-mt-1 md:block lg:-mt-12 lg:h-[380px]"
      >
        {/* Connector curves + end dots. Decorative; coordinates live in the
            same 1160x380 space the card percentages are set in, and
            preserveAspectRatio="none" keeps the two aligned as the stage
            stretches. */}
        <svg
          viewBox="0 0 1160 380"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
          aria-hidden="true"
        >
          <g stroke="rgba(112,48,248,0.45)" strokeWidth="1.4" fill="none">
            <path d="M580,198 C420,170 220,95 100,62" />
            <path d="M580,198 C450,200 330,192 225,186" />
            <path d="M580,198 C520,215 455,235 390,242" />
            <path d="M580,198 C645,215 710,238 775,245" />
            <path d="M580,198 C720,185 880,152 980,138" />
            <path d="M580,198 C760,195 960,172 1092,158" />
          </g>
          <g fill="var(--color-violet-500)">
            <circle cx="100" cy="62" r="4" />
            <circle cx="225" cy="186" r="4" />
            <circle cx="390" cy="242" r="4" />
            <circle cx="775" cy="245" r="4" />
            <circle cx="980" cy="138" r="4" />
            <circle cx="1092" cy="158" r="4" />
          </g>
        </svg>

        {/* Centre hub — the actual brand mark (same PNG as the browser-tab
            favicon and the header/footer logo), linking to the directory the
            spokes fan out from. Was a typographic "S" placeholder; now the
            real graphic, which is also why this hub reads as more than a
            decoration — it is where the mark is, that the six tools radiate
            from. The pulse runs on the inner span and the hover scale on the
            outer link: a running CSS animation owns `transform` outright, so
            both effects on one element would mean hover does nothing. */}
        <Link
          href="/all"
          aria-label={`Browse all ${TOOLS.length} tools`}
          className="absolute top-1/2 left-1/2 size-[84px] -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
        >
          <span
            aria-hidden="true"
            data-decorative-motion
            className="grid size-full place-items-center rounded-2xl border border-ink bg-violet-700 shadow-brutal-sm motion-safe:animate-[hub-pulse_3.2s_ease-in-out_infinite]"
          >
            <Image src={scultMark} alt="" width={56} height={56} className="size-14" />
          </span>
        </Link>

        {HUB_CARDS.map(({ category, position: { side, top, offset, delay } }) => (
          <div key={category.slug} style={{ top, [side]: offset }} className="absolute">
            {/* Float on the wrapper, hover-scale on the card — same
                split-element rule as the hub. */}
            <div
              data-decorative-motion
              style={{ animationDelay: delay }}
              className="motion-safe:animate-[card-float_5s_ease-in-out_infinite]"
            >
              <CategoryCard category={category} />
            </div>
          </div>
        ))}
      </nav>
    </section>
  )
}

/**
 * One labelled category card — pastel tile, violet icon, serif label. Shared
 * by the mobile grid and the desktop scatter so the two can never diverge.
 * Soft shadow rather than the hard brutal offset: in the mockup the cards
 * float, and a 4px hard shadow reads as "button", which these are not.
 */
function CategoryCard({ category }: { category: (typeof CATEGORIES)[number] }) {
  return (
    <Link
      href={`/${category.slug}`}
      className="flex flex-col items-center gap-2.5 rounded-2xl border border-line-grey bg-white px-5 py-4 shadow-card transition-transform hover:z-10 hover:scale-105"
      style={{ background: `var(--color-tile-${category.tile})` }}
    >
      {/* The tile fills are theme-FIXED light pastels (they are not in the
          dark-mode token override block), so everything on them must be
          literal black/violet-700, never adaptive ink — text-ink flips to
          near-white in dark mode and vanishes against the light pastel. */}
      <Icon name={category.icon} className="size-7 text-violet-700" />
      <span className="whitespace-nowrap font-display font-semibold text-[15px] text-black tracking-normal">
        {category.shortName}
      </span>
    </Link>
  )
}

interface HubPosition {
  readonly side: 'left' | 'right'
  readonly top: string
  readonly offset: string
  readonly delay: string
}

/**
 * Three per side, staggered like the mockup: SEO high left, Business and
 * Developer stepping down toward the hub, then mirrored up the right side to
 * AI Visibility. Percentages are of the 1160x380 stage, matching the SVG dot
 * coordinates above (e.g. the SEO dot at x=100 is ~8.6% — the card sits just
 * outside it).
 */
const HUB_POSITIONS: readonly HubPosition[] = [
  { side: 'left', top: '2%', offset: '1%', delay: '0s' },
  { side: 'left', top: '38%', offset: '12%', delay: '0.7s' },
  { side: 'left', top: '58%', offset: '27%', delay: '1.4s' },
  { side: 'right', top: '58%', offset: '27%', delay: '0.4s' },
  { side: 'right', top: '22%', offset: '12%', delay: '1.1s' },
  { side: 'right', top: '30%', offset: '1%', delay: '1.8s' },
]

/**
 * Zipped by index rather than indexed directly: `noUncheckedIndexedAccess`
 * makes `CATEGORIES[i]` possibly undefined, and the registry test already
 * pins the category count — but a zip degrades to fewer cards instead of
 * crashing if that ever changes.
 */
const HUB_CARDS: readonly {
  category: (typeof CATEGORIES)[number]
  position: HubPosition
}[] = CATEGORIES.map((category, i) => ({ category, position: HUB_POSITIONS[i] })).filter(
  (entry): entry is { category: (typeof CATEGORIES)[number]; position: HubPosition } =>
    entry.position !== undefined,
)
