import { Check } from 'lucide-react'
import Link from 'next/link'
import { HeroAssistant } from '@/components/sections/HeroAssistant'
import { SaashubBadge } from '@/components/ui/SaashubBadge'
import { UneedBadge } from '@/components/ui/UneedBadge'
import { PROMPTS } from '@/lib/prompts/registry'
import { TOOLS } from '@/lib/tools/registry'

/**
 * The homepage hero — 2026-09-19 redesign.
 *
 * PRIOR ART (why this isn't the earlier calm/minimal version, and isn't a
 * repeat of what came before that either): the previous pass explicitly
 * tried and rejected a sky-blue radial, a sky photograph (washed and
 * unwashed), a hub-and-spoke constellation diagram, a left-aligned
 * editorial poster, a gradient accent word, and a blurred colour mesh —
 * landing on a plain centred stack with none of them. That version then
 * read as "so normal" (the user's own words) once the rest of the site
 * caught up in visual texture around it. This pass does not revisit any of
 * the six rejected treatments — no gradient, no photo, no mesh, no
 * connecting-line diagram — and adds typography and real content instead
 * of a background treatment:
 *
 *   1. Three tilted stat "sticker" chips (was one flat glass pill) — one
 *      per catalogue, each in that catalogue's own established colour
 *      (blue/lavender/green match CategoryTabs/PromptLibrarySpotlight/
 *      SkillLibrarySpotlight further down the page), so a visitor who
 *      scrolls recognises the colour, not just the number.
 *   2. The headline text is unchanged (still exactly SITE.tagline — see
 *      Hero.test.tsx), but "real work" now sits inside a small rotated
 *      cta-yellow sticker rather than plain text — the same "wrap a short
 *      phrase in a bordered, shadowed chip" motif SkillLibrarySpotlight and
 *      the skills hub already use, applied to a headline for the first
 *      time on this page.
 *   3. THE SEARCH IS THE HERO'S PRIMARY ELEMENT, not a mobile-only
 *      fallback under the header's own copy — and since 2026-09-23 it is
 *      a chat (`HeroAssistant`), by request: you type what you're working
 *      on, it answers in a sentence with links to the matching tool,
 *      prompt and skill pages. It runs the exact same tools + prompts +
 *      skills search as the header's compact `SearchBox` (which stays for
 *      in-page navigation once you've scrolled past the hero); only the
 *      presentation differs. It keeps the plain box's ORIGINAL width — a
 *      wider box was tried and reverted by request.
 *
 * An earlier pass of this same redesign also floated three small decorative
 * category-name chips around the search box. Removed by explicit feedback
 * ("clean and beautiful, not cluttered") — they crowded the CTA row right
 * below them at ordinary viewport heights and read as noise, not texture.
 * The announcement banner that used to sit directly above this section (the
 * very first thing under the header) moved BELOW the hero for the same
 * reason — see app/page.tsx's own comment at that call site.
 *
 * Constraints kept from the previous version: server component, no
 * fetching/Date/randomness; the <h1> text is exactly SITE.tagline; both
 * CTAs keep `prefetch={false}`; every number is registry-derived except the
 * "50,000+" skills figure, which stays the same static label the MCP
 * server description uses (the served set is a curated, frozen 10,000 —
 * see lib/skills/db.ts's header — so "50,000+" describes the registry it
 * was curated FROM, not a number this component could safely compute
 * without giving the homepage a new live Supabase read of its own).
 */

const SKILL_COUNT_LABEL = '50,000+'

const REASSURANCE = ['No account', 'Runs in your browser', 'Free forever'] as const

type StatTile = 'blue' | 'lavender' | 'green'

const STAT_TILE_BG: Record<StatTile, string> = {
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/** One tilted stat chip — Tools/Prompts/Skills, each in its catalogue's own
 * established brand colour so the hero previews the page's own colour
 * system rather than inventing a fourth palette just for this row. */
function StatChip({
  count,
  label,
  tile,
  rotate,
}: {
  count: string
  label: string
  tile: StatTile
  rotate: string
}) {
  return (
    <p
      className={`inline-flex items-baseline gap-1.5 rounded-pill border border-ink px-4 py-1.5 shadow-brutal-sm ${STAT_TILE_BG[tile]} ${rotate}`}
    >
      <span className="font-display font-semibold text-[15px] text-black">{count}</span>
      <span className="font-medium text-[13px] text-black/65">{label}</span>
    </p>
  )
}

export function Hero() {
  const promptCount = PROMPTS.length.toLocaleString('en-US')

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative pt-14 pb-16 text-center md:pt-20 md:pb-24"
    >
      <div className="container-site flex flex-col items-center">
        {/* 1. Three tilted stat stickers — one per catalogue, each in that
            catalogue's own colour from further down the page. */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <StatChip
            count={String(TOOLS.length)}
            label="tools"
            tile="blue"
            rotate="-rotate-2"
          />
          <StatChip
            count={promptCount}
            label="prompts"
            tile="lavender"
            rotate="rotate-1"
          />
          <StatChip
            count={SKILL_COUNT_LABEL}
            label="skills"
            tile="green"
            rotate="-rotate-1"
          />
        </div>

        {/* 2. Headline — wording is SITE.tagline verbatim; "real work" now
            sits inside a rotated cta sticker instead of plain text. */}
        <h1
          id="hero-heading"
          className="mt-7 max-w-[19ch] font-display font-semibold text-[44px] text-ink leading-[1.08] tracking-[-0.03em] text-balance sm:text-[56px] md:text-[68px] lg:text-[76px]"
        >
          <span className="text-violet-500">Free</span> tools, prompts and skills for{' '}
          <span className="inline-block rotate-[-1.5deg] rounded-lg bg-cta px-2.5 py-0.5 text-black shadow-brutal-sm">
            real work
          </span>
        </h1>

        {/* 3. One sentence. */}
        <p className="mt-6 max-w-[46ch] text-[17px] text-ink-muted leading-7 text-balance md:text-[20px] md:leading-8">
          SEO, business, developer, design and AI-visibility utilities — every one runs in
          your browser, none of them asks you to sign up.
        </p>

        {/* 4. THE ASSISTANT — the hero's primary element, every breakpoint:
            the same site-wide search as the header box, as a chat. Same
            max width the plain search box had (a wider one was tried and
            reverted by request). */}
        <div className="mt-9 w-full max-w-2xl">
          <HeroAssistant />
        </div>

        {/* 5. CTAs — the brand's own buttons. Explore stays the default
            cta-yellow `.btn-brutal` because it fulfils the headline
            literally; the flagship checker takes `.btn-violet`, the same
            fill the nav's own button uses for the identical destination. */}
        <div className="mt-6 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <Link href="/all" prefetch={false} className="btn-brutal w-full sm:w-auto">
            EXPLORE ALL {TOOLS.length} TOOLS
          </Link>
          <Link
            href="/geo/ai-visibility-checker"
            prefetch={false}
            className="btn-brutal btn-violet w-full sm:w-auto"
          >
            CHECK AI VISIBILITY
          </Link>
        </div>

        {/* 6. Reassurance, small and quiet. The discs are decorative
            (aria-hidden) so white-on-green is fine here. */}
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] text-ink-subtle">
          {REASSURANCE.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="grid size-4 shrink-0 place-items-center rounded-full bg-green"
              >
                <Check className="size-2.5 text-white" strokeWidth={3.5} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* Real directory listings, muted to provenance weight. */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 opacity-80 transition-opacity hover:opacity-100">
          <UneedBadge className="h-8 w-auto" heightPx={32} />
          <SaashubBadge className="h-8 w-auto" heightPx={32} />
        </div>
      </div>
    </section>
  )
}
