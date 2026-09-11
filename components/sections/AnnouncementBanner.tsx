import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { getPromptsByCategory } from '@/lib/prompts/registry'

/**
 * The homepage's "latest release" strip — announces the Photo Trends launch
 * (real example photos on all 40 prompts, plus the new video-prompt
 * companion) above the hero.
 *
 * Deliberately its own component, not an edit to `Hero.tsx`: the hero is
 * LOCKED by explicit user decision (see that file's own docblock — several
 * redesigns were tried and rejected there already), so this sits directly
 * above it in `app/page.tsx` instead of touching its internals. A thin
 * announcement strip above a hero is the same pattern used everywhere else
 * this shape appears, so it reads as an addition, not a hero redesign.
 *
 * The count comes from the live registry, never a hardcoded "40" — if the
 * category ever shrinks to nothing, the banner hides itself rather than
 * announcing a category with no prompts in it.
 */
export function AnnouncementBanner() {
  const count = getPromptsByCategory('photo-trends').length
  if (count === 0) return null

  return (
    <div className="border-ink border-b bg-cta">
      <Link
        href="/prompts/photo-trends"
        className="container-site group flex flex-wrap items-center justify-center gap-2.5 py-2.5 text-center"
      >
        <span className="rounded-pill border border-ink bg-black px-2 py-0.5 font-bold text-[10px] text-white uppercase tracking-[0.12em]">
          New
        </span>
        <span className="font-medium text-[13.5px] text-black leading-tight">
          {count} free 80s Bollywood photo prompts — real example photos on every one,
          plus a video prompt to animate each
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-[13.5px] text-black underline decoration-1 underline-offset-2 group-hover:no-underline">
          Explore Photo Trends
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </span>
      </Link>
    </div>
  )
}
