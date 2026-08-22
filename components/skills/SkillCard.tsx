import { Download, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
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
 * The Skills Library's card. Unlike `PromptCard`, there's no single "brand"
 * to lead with — a skill is sourced from one of thousands of GitHub repos,
 * not one of a fixed set of AI models — so the category icon/tile leads
 * instead, and the real `installs` count + source repo take the trust-signal
 * role `verifiedAgainst` plays on a `PromptCard`.
 */
export function SkillCard({ skill, category }: { skill: Skill; category: SkillCategory }) {
  return (
    <Link
      href={`/skills/${skill.category}/${skill.slug}`}
      className="chip-tool group flex-col items-start gap-3 p-5"
    >
      <span className="flex w-full items-start gap-3.5">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-ink/10 ${TILE_BG[category.tile]}`}
        >
          <Icon name={category.icon} className="size-5 text-violet-700" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-semibold text-[17px] leading-[1.3] tracking-normal transition-colors group-hover:text-violet-700">
            {skill.name}
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-ink-subtle">
            {skill.sourceOwner}/{skill.sourceRepo}
          </span>
        </span>
      </span>

      <span className="line-clamp-3 text-[14px] text-ink-muted leading-5">
        {skill.description}
      </span>

      <span className="mt-auto flex w-full items-center gap-3 pt-1 text-[12px] text-ink-subtle">
        <span className="flex items-center gap-1">
          <Download className="size-3.5" aria-hidden="true" />
          {formatInstalls(skill.installs)} installs
        </span>
        {skill.licenseGated ? (
          <span className="flex items-center gap-1">
            <ShieldAlert className="size-3.5" aria-hidden="true" />
            View on GitHub
          </span>
        ) : skill.license ? (
          <span className="ml-auto rounded-pill border border-line-grey bg-offwhite px-2 py-0.5">
            {skill.license}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
