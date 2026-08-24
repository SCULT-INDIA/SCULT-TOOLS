import { ArrowUpRight, BadgeCheck, Copy } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { PROMPT_CATEGORIES } from '@/lib/prompts/categories'
import { getPromptsByCategory, PROMPTS } from '@/lib/prompts/registry'

/**
 * Homepage spotlight for the Prompt Library — the site's second catalogue,
 * given the same billing as the tools.
 *
 * 2026 redesign: the old right column was a 12-logo wall — recognizable, but
 * it described the library instead of showing it. It's now a mockup of an
 * actual prompt card (the same show-the-product move the AI-visibility
 * spotlight's device frame makes), built from REAL registry data — the
 * title, category and verification stamp below come from a real prompt, so
 * the marketing can't drift from the product. The logo wall survives as a
 * compact strip beneath the mockup.
 *
 * The panel is a fixed pastel tile (theme-fixed light), so everything on it
 * is literal black / violet-700, never adaptive ink.
 */

/** The recognizable face of the library — brands with real content behind them. */
const STRIP = [
  'chatgpt',
  'claude',
  'claude-code',
  'cursor',
  'gemini',
  'perplexity',
  'midjourney',
  'nano-banana',
] as const

export function PromptLibrarySpotlight() {
  const categoryCount = PROMPT_CATEGORIES.filter(
    (c) => getPromptsByCategory(c.slug).length > 0,
  ).length

  // A real prompt drives the mockup so the preview can never go stale or
  // overclaim — if this prompt is ever unpublished the fallback keeps the
  // build green and the first library entry takes its place.
  const featured =
    PROMPTS.find(
      (p) => p.slug === 'chatgpt-custom-instructions-recurring-role-profile',
    ) ?? PROMPTS[0]
  const verification = featured?.verifiedAgainst[0]

  return (
    <section aria-labelledby="prompt-library" className="container-site py-16">
      <div className="rounded-panel border border-ink bg-tile-lavender p-7 shadow-brutal md:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-violet-700">Free prompt library</p>
            <h2
              id="prompt-library"
              className="mt-3 max-w-[16ch] text-[32px] text-black leading-[1.1] tracking-[-1px] md:text-[44px]"
            >
              {PROMPTS.length.toLocaleString('en-US')} prompts for the AI tools you
              already use
            </h2>
            <p className="mt-5 max-w-[52ch] text-[17px] text-black/70 leading-7">
              ChatGPT, Claude, Cursor, Midjourney, Veo and {categoryCount - 5} more
              categories — organized by tool, shown in full, no account anywhere. Not
              another undated prompt dump:
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-[15px] text-black/80">
              {[
                'Every prompt is version-stamped against the tool it was tested on',
                'Every prompt explains why it works, not just what to paste',
                'Stale prompts get flagged, not left to quietly rot',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <BadgeCheck
                    className="mt-0.5 size-4.5 shrink-0 text-green"
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/prompts"
              className="btn-brutal mt-8 border-black text-black hover:border-ink hover:text-ink"
            >
              BROWSE THE PROMPT LIBRARY
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </Link>
          </div>

          <div>
            {/* Mockup of a real prompt card — decorative chrome around real
                registry data. aria-hidden: everything it says is repeated in
                accessible text elsewhere in this section or on /prompts. */}
            <div
              aria-hidden="true"
              className="overflow-hidden rounded-lg border border-black/85 bg-white shadow-[5px_5px_0_0_rgb(0_0_0/0.9)]"
            >
              <div className="flex items-center justify-between border-black/10 border-b bg-offwhite px-4 py-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-black/15" />
                  <span className="size-2 rounded-full bg-black/15" />
                  <span className="size-2 rounded-full bg-black/15" />
                </span>
                <span className="rounded-pill bg-white px-3 py-0.5 text-[11px] text-black/50 ring-1 ring-black/10">
                  tools.scult.in/prompts
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-offwhite ring-1 ring-black/10">
                    <BrandIcon brand="chatgpt" size={16} />
                  </span>
                  <span className="font-semibold text-[12px] text-black/60 uppercase tracking-[0.08em]">
                    ChatGPT prompt
                  </span>
                  {verification ? (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-pill bg-tile-green px-2 py-0.5 font-semibold text-[11px] text-black ring-1 ring-black/15">
                      <BadgeCheck className="size-3 text-green" />
                      Verified {verification.version.split(' ')[0]}
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 font-display font-semibold text-[16px] text-black leading-snug tracking-normal">
                  {featured?.title}
                </p>

                <div className="mt-3 rounded-md bg-offwhite p-3 ring-1 ring-black/8">
                  <p className="font-mono text-[12px] text-black/65 leading-5">
                    You are drafting the two Custom Instructions fields for a specific,
                    recurring role…
                  </p>
                  <p className="mt-1 font-mono text-[12px] text-violet-700 leading-5">
                    {'{{recurring_role}} · {{decision_rights}} · {{refusal_rules}}'}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[12px] text-black/50">
                    {featured?.variables.length ?? 5} fillable variables · why-it-works
                    included
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-black px-3 py-1.5 font-semibold text-[12px] text-white">
                    <Copy className="size-3.5" />
                    Copy
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 mb-2 text-center font-semibold text-[11px] text-black/50 uppercase tracking-[0.12em]">
              Covering the tools you actually use
            </p>
            <ul
              aria-label="Tools covered by the prompt library"
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {STRIP.map((brand) => (
                <li key={brand}>
                  <span className="flex size-10 items-center justify-center rounded-xl border border-black/10 bg-white shadow-[0_2px_8px_rgb(0_0_0/0.06)]">
                    <BrandIcon brand={brand} size={22} />
                  </span>
                </li>
              ))}
              <li>
                <span className="flex h-10 items-center rounded-xl border border-black/10 bg-white px-3 font-semibold text-[12px] text-black/60 shadow-[0_2px_8px_rgb(0_0_0/0.06)]">
                  +{categoryCount - STRIP.length} more
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
