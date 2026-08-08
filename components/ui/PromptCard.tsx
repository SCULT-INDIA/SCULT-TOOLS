import { BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon, brandForTool, categoryBrand } from '@/components/ui/BrandIcon'
import { Icon } from '@/components/ui/Icon'
import type { Prompt, PromptCategory } from '@/lib/prompts/types'

const TILE_BG: Record<PromptCategory['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/**
 * The Prompt Library's card. Leads with the OFFICIAL brand mark of the tool
 * the prompt targets (category brand first, else fuzzy-matched from the
 * prompt's own targetTools) on a pastel tile chip — tile colors are fixed
 * across themes, so the logo always sits on its pastel and the mark stays
 * true-to-brand in dark mode. Categories with no single brand (business-ops,
 * seo-geo…) fall back to their Lucide category icon rather than borrowing
 * the wrong company's logo.
 */
export function PromptCard({
  prompt,
  category,
}: {
  prompt: Prompt
  category: PromptCategory
}) {
  const brand =
    categoryBrand(category.slug) ??
    prompt.targetTools.map(brandForTool).find((b) => b !== null) ??
    null
  const latestVerification = prompt.verifiedAgainst[0]

  return (
    <Link
      href={`/prompts/${prompt.category}/${prompt.slug}`}
      className="chip-tool group flex-col items-start gap-3 p-5"
    >
      <span className="flex w-full items-start gap-3.5">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-ink/10 ${TILE_BG[category.tile]}`}
        >
          {brand ? (
            <span className="flex size-7 items-center justify-center rounded-[8px] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08)]">
              <BrandIcon brand={brand} size={17} />
            </span>
          ) : (
            <Icon name={category.icon} className="size-5 text-violet-700" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-semibold text-[17.5px] leading-[1.3] tracking-normal transition-colors group-hover:text-violet-700">
            {prompt.title}
          </span>
        </span>
      </span>

      <span className="line-clamp-3 text-[14px] text-ink-muted leading-5">
        {prompt.description}
      </span>

      <span className="mt-auto flex w-full flex-wrap items-center gap-1.5 pt-1">
        {prompt.targetTools.slice(0, 2).map((tool) => {
          const toolBrand = brandForTool(tool)
          return (
            <span
              key={tool}
              className="flex items-center gap-1.5 rounded-pill border border-line-grey bg-offwhite px-2 py-0.5 text-[11px] text-ink-subtle"
            >
              {/* White disc behind the mark: bg-offwhite flips near-black in
                  dark mode, where a mono (near-black) brand logo would
                  otherwise vanish. Logos always sit on white on this site. */}
              {toolBrand ? (
                <span className="flex size-4 shrink-0 items-center justify-center rounded-[5px] bg-white ring-1 ring-black/5">
                  <BrandIcon brand={toolBrand} size={11} />
                </span>
              ) : null}
              {tool}
            </span>
          )
        })}
        {latestVerification ? (
          <span className="ml-auto flex items-center gap-1 font-medium text-[11px] text-green">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            <span className="text-ink-subtle">{latestVerification.date}</span>
          </span>
        ) : null}
      </span>
    </Link>
  )
}
