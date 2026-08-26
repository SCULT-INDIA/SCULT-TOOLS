import { Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { BrandIcon, brandForTag } from '@/components/ui/BrandIcon'
import { Icon } from '@/components/ui/Icon'
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
 * The Skills Library's card — deliberately calmer than `PromptCard`'s
 * brutalist `.chip-tool` (thick border, hard offset shadow): at this
 * volume the grid needs to read as a clean, scannable directory rather
 * than a wall of bordered boxes, so this uses `.card-modern` (soft border,
 * layered shadow, gentle lift) instead. A skill has no single "brand" the
 * way a prompt targets one AI model, so the tech-stack row (real brand
 * marks parsed from the skill's own `tags`) carries that visual-recognition
 * role instead — the same one-glance "what is this actually for" signal a
 * logo gives on `PromptCard`.
 */
export function SkillCard({
  skill,
  category,
}: {
  skill: Skill
  category: SkillCategory
}) {
  const techBrands = [
    ...new Set(skill.tags.map(brandForTag).filter((b): b is string => b !== null)),
  ].slice(0, 3)

  return (
    <Link
      href={`/skills/${skill.category}/${skill.slug}`}
      className="card-modern group flex flex-col gap-3 p-5"
    >
      <div className="flex items-start gap-3">
        {/* The publisher's real GitHub avatar — every skill's true "logo",
            since a skill IS a file in that owner's repo. GitHub serves a
            default identicon for any login (even deleted ones return 200,
            verified), so no fallback branch is needed; the category tile
            behind it keeps the card's colour-coding role. unoptimized: these
            are already tiny (~2-4KB at s=80), pre-resized by GitHub's own
            CDN, and there are thousands of DISTINCT owners — piping each
            through the image optimizer would just fill its cache with
            one-off entries for zero byte savings. */}
        <span
          className={`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl ${TILE_BG[category.tile]}`}
        >
          <Image
            src={`https://avatars.githubusercontent.com/${skill.sourceOwner}?s=80`}
            alt=""
            width={40}
            height={40}
            unoptimized
            className="size-full object-cover"
          />
          <Icon
            name={category.icon}
            className="-z-10 absolute size-4.5 text-violet-700"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-[15.5px] text-ink leading-[1.3] transition-colors group-hover:text-violet-700">
            {skill.name}
          </p>
          <p className="mt-0.5 truncate text-[12.5px] text-ink-subtle">
            {skill.sourceOwner}/{skill.sourceRepo}
          </p>
        </div>
      </div>

      <p className="line-clamp-2 text-[13.5px] text-ink-muted leading-[1.5]">
        {skill.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1">
          {techBrands.map((brand) => (
            <span
              key={brand}
              className="flex size-6 items-center justify-center rounded-full bg-offwhite ring-1 ring-black/[0.04]"
            >
              <BrandIcon brand={brand} size={13} />
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1 text-[12px] text-ink-subtle">
          <Download className="size-3.5" aria-hidden="true" />
          {formatInstalls(skill.installs)}
        </span>
      </div>
    </Link>
  )
}
