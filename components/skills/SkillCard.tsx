import { Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { BrandIcon, brandForTag } from '@/components/ui/BrandIcon'
import type { Skill, SkillCategory } from '@/lib/skills/types'

const TILE_BG: Record<SkillCategory['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

function formatInstalls(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

/**
 * The Skills Library's card — the same `.chip-tool` neo-brutalist register
 * `PromptCard` and the tools directory use (thin line border at rest, ink
 * border + hard offset shadow on hover), so the three libraries read as one
 * site. An earlier version used the homepage's soft `.card-modern` instead,
 * which globals.css reserves for the landing page; it read as a different
 * design system dropped into the directory.
 *
 * The publisher's real GitHub avatar sits on the category's pastel tile —
 * a skill IS a file in that owner's repo, so that avatar is its true mark.
 * `unoptimized`: GitHub already serves these pre-resized (~2–4KB at s=80)
 * and there are thousands of distinct owners, so routing them through the
 * image optimizer would only fill its cache with one-off entries.
 *
 * `rank` (optional) pins a numbered yellow badge to the corner — used by the
 * hub's "Most installed" rail, where position is the point.
 */
export function SkillCard({
  skill,
  category,
  rank,
}: {
  skill: Skill
  category: SkillCategory
  rank?: number
}) {
  const techBrands = [
    ...new Set(skill.tags.map(brandForTag).filter((b): b is string => b !== null)),
  ].slice(0, 2)

  return (
    <Link
      href={`/skills/${skill.category}/${skill.slug}`}
      className="chip-tool group relative flex-col items-start gap-3 p-5"
    >
      {rank !== undefined ? (
        <span className="-top-2.5 -right-2.5 absolute flex size-8 items-center justify-center rounded-full border border-ink bg-cta font-bold text-[13px] text-black shadow-brutal-sm">
          <span className="sr-only">Rank </span>
          {rank}
        </span>
      ) : null}

      <span className="flex w-full items-start gap-3.5">
        <span
          className={`flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-ink/10 ${TILE_BG[category.tile]}`}
        >
          <Image
            src={`https://avatars.githubusercontent.com/${skill.sourceOwner}?s=80`}
            alt=""
            width={44}
            height={44}
            unoptimized
            className="size-full object-cover"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display font-semibold text-[17.5px] leading-[1.3] tracking-normal transition-colors group-hover:text-violet-700">
            {skill.name}
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-ink-subtle">
            {skill.sourceOwner}/{skill.sourceRepo}
          </span>
        </span>
      </span>

      <span className="line-clamp-2 text-[14px] text-ink-muted leading-5">
        {skill.description}
      </span>

      <span className="mt-auto flex w-full flex-wrap items-center gap-1.5 pt-1">
        {techBrands.map((brand) => (
          <span
            key={brand}
            className="flex size-6 items-center justify-center rounded-[7px] border border-line-grey bg-white"
          >
            <BrandIcon brand={brand} size={13} />
          </span>
        ))}
        <span className="rounded-pill border border-line-grey bg-offwhite px-2 py-0.5 text-[11px] text-ink-subtle">
          {category.name}
        </span>
        <span className="ml-auto flex items-center gap-1 font-medium text-[12px] text-ink-subtle">
          <Download className="size-3.5" aria-hidden="true" />
          {formatInstalls(skill.installs)}
        </span>
      </span>
    </Link>
  )
}
