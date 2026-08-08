import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { PROMPT_CATEGORIES } from '@/lib/prompts/categories'
import { getPromptsByCategory, PROMPTS } from '@/lib/prompts/registry'

/**
 * Homepage spotlight for the Prompt Library — the site's second catalogue,
 * given the same billing as the tools. A pastel brutal panel (fixed across
 * themes, like every tile) with the pitch on the left and a wall of the
 * OFFICIAL brand marks on the right: the fastest way to say "your tool is
 * covered" is to show its real logo.
 */

/** The recognizable face of the library — brands with real content behind them. */
const WALL = [
  'chatgpt',
  'claude',
  'claude-code',
  'cursor',
  'github-copilot',
  'gemini',
  'perplexity',
  'midjourney',
  'nano-banana',
  'kling',
  'react',
  'python',
] as const

export function PromptLibrarySpotlight() {
  const categoryCount = PROMPT_CATEGORIES.filter(
    (c) => getPromptsByCategory(c.slug).length > 0,
  ).length

  return (
    <section aria-labelledby="prompt-library" className="container-site py-16">
      <div className="rounded-panel border border-ink bg-tile-lavender p-7 shadow-brutal md:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-violet-700">New — free prompt library</p>
            <h2
              id="prompt-library"
              className="mt-3 max-w-[16ch] text-[32px] text-black leading-[1.1] tracking-[-1px] md:text-[44px]"
            >
              {PROMPTS.length} prompts for the AI tools you already use
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

          <ul
            aria-label="Tools covered by the prompt library"
            className="grid grid-cols-3 gap-3 sm:grid-cols-4"
          >
            {WALL.map((brand) => (
              <li key={brand}>
                <span className="flex aspect-square items-center justify-center rounded-2xl border border-ink/10 bg-white shadow-[0_2px_10px_rgb(0_0_0/0.07)]">
                  <BrandIcon brand={brand} size={34} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
