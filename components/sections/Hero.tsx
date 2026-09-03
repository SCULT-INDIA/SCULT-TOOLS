import { Check } from 'lucide-react'
import Link from 'next/link'
import { SearchBox } from '@/components/layout/SearchBox'
import { SaashubBadge } from '@/components/ui/SaashubBadge'
import { UneedBadge } from '@/components/ui/UneedBadge'
import { PROMPTS } from '@/lib/prompts/registry'
import { PROMPT_COUNT, TOOL_COUNT } from '@/lib/search'
import { TOOLS } from '@/lib/tools/registry'

/**
 * The homepage hero — centred, minimal, calm. One vertical stack directly on
 * the page's cream, with no background treatment and no gradients anywhere
 * (both explicit requirements — a sky-blue radial, a sky photograph with and
 * without washes, a hub-and-spoke constellation, a left-aligned editorial
 * poster, a gradient accent word and a blurred colour mesh were each tried
 * here and each rejected; this is the reduction):
 *
 *   1. A frosted pill with the live catalogue counts — the one line of
 *      "what is this" a visitor reads before the headline.
 *   2. The headline, Fraunces at display scale, `text-balance` so the two
 *      lines break evenly at every width, with a single solid-violet word.
 *   3. One sentence of subcopy.
 *   4. The site's own brutal buttons — cta-yellow primary (explore) and the
 *     violet fill (the flagship checker), the same pair every other CTA on
 *     the site uses. Full-width on phones.
 *   5. A three-item reassurance row in small type, then the two real
 *      directory badges, slightly muted so they read as provenance rather
 *      than decoration.
 *
 * Constraints kept: server component, no fetching/Date/randomness; the <h1>
 * text is exactly SITE.tagline (every page's <title> mirrors it — the violet
 * word is a styled span, not different text); both CTAs keep
 * `prefetch={false}` (the checker prefetch alone measured ~220KB against
 * critical CSS); the mobile-only search stays (header shows its own from
 * `md`); every number is registry-derived except the "50,000+" skills floor,
 * which is the same label the MCP server description uses.
 */

const SKILL_COUNT_LABEL = '50,000+'

const REASSURANCE = ['No account', 'Runs in your browser', 'Free forever'] as const

export function Hero() {
  const promptCount = PROMPTS.length.toLocaleString('en-US')

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative pt-14 pb-16 text-center md:pt-20 md:pb-24"
    >
      <div className="container-site flex flex-col items-center">
        {/* 1. Counts pill — violet dot as the single accent. */}
        <p className="glass inline-flex items-center gap-2.5 rounded-pill px-4 py-1.5 font-medium text-[13px] text-ink-muted shadow-xs">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-violet-500" />
          {TOOLS.length} tools · {promptCount} prompts · {SKILL_COUNT_LABEL} skills
        </p>

        {/* 2. Headline — wording is SITE.tagline verbatim. */}
        <h1
          id="hero-heading"
          className="mt-7 max-w-[17ch] font-display font-semibold text-[44px] text-ink leading-[1.02] tracking-[-0.03em] text-balance sm:text-[56px] md:text-[68px] lg:text-[80px]"
        >
          <span className="text-violet-500">Free</span> tools, prompts and skills for real
          work
        </h1>

        {/* 3. One sentence. */}
        <p className="mt-6 max-w-[46ch] text-[17px] text-ink-muted leading-7 text-balance md:text-[20px] md:leading-8">
          SEO, business, developer, design and AI-visibility utilities — every one runs in
          your browser, none of them asks you to sign up.
        </p>

        {/* 4. CTAs — the brand's own buttons. Explore stays the default
            cta-yellow `.btn-brutal` because it fulfils the headline
            literally; the flagship checker takes `.btn-violet`, the same
            fill the nav's own button uses for the identical destination. */}
        <div className="mt-9 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
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

        {/* 5. Reassurance, small and quiet. The discs are decorative
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

        {/* Mobile-only search — the header shows its own from `md`. */}
        <div className="mt-8 w-full max-w-xl md:hidden">
          <SearchBox size="large" toolCount={TOOL_COUNT} promptCount={PROMPT_COUNT} />
        </div>

        {/* Real directory listings, muted to provenance weight. */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 opacity-80 transition-opacity hover:opacity-100">
          <UneedBadge className="h-8 w-auto" heightPx={32} />
          <SaashubBadge className="h-8 w-auto" heightPx={32} />
        </div>
      </div>
    </section>
  )
}
