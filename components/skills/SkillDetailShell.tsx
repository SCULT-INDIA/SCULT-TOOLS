import { ArrowUpRight, BadgeCheck, Download, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { Icon } from '@/components/ui/Icon'
import { SkillCard } from '@/components/skills/SkillCard'
import { SkillCopyBlock } from '@/components/skills/SkillCopyBlock'
import type { Skill, SkillCategory } from '@/lib/skills/types'
import { getTool } from '@/lib/tools/registry'

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

export function SkillDetailShell({
  skill,
  category,
  siblings,
}: {
  skill: Skill
  category: SkillCategory
  siblings: readonly Skill[]
}) {
  const relatedTools = skill.relatedTools
    .map((slug) => getTool(slug))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined)

  return (
    <article className="container-site max-w-[46rem] pt-8 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-[13px] text-ink-subtle">
          <li>
            <Link href="/" className="hover:text-violet-600">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/skills" className="hover:text-violet-600">
              Skills
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/skills/${category.slug}`} className="hover:text-violet-600">
              {category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-muted">
            {skill.name}
          </li>
        </ol>
      </nav>

      <header>
        <span className="flex items-center gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-ink/10 ${TILE_BG[category.tile]}`}
          >
            <Icon name={category.icon} className="size-5 text-violet-700" />
          </span>
          <p className="eyebrow">{category.name}</p>
        </span>
        <h1 className="mt-3 text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]">
          {skill.name}
        </h1>
        <p className="mt-5 text-[17px] text-ink-muted leading-8 md:text-lead">
          {skill.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-ink-muted">
          <a
            href={skill.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-violet-700 hover:text-violet-600"
          >
            <BrandIcon brand="github" size={15} />
            {skill.sourceOwner}/{skill.sourceRepo}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
          <span className="flex items-center gap-1.5">
            <Download className="size-4" aria-hidden="true" />
            {formatInstalls(skill.installs)} installs
          </span>
          {skill.license ? (
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-green" aria-hidden="true" />
              {skill.license}
            </span>
          ) : null}
          <span className="text-ink-subtle">
            Synced {new Date(skill.lastSyncedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {skill.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-pill border border-line-grey bg-offwhite px-2.5 py-1 text-[12px] text-ink-subtle"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <section className="mt-10">
        <SkillCopyBlock skill={skill} licenseGated={skill.licenseGated} />
      </section>

      {skill.licenseGated ? (
        <p className="mt-4 flex items-center gap-1.5 text-[13px] text-ink-subtle">
          <ShieldAlert className="size-4" aria-hidden="true" />
          License terms for this skill weren't clear enough to safely inline here —
          the button above opens the original source.
        </p>
      ) : null}

      {relatedTools.length > 0 ? (
        <section aria-labelledby="skill-tools" className="mt-12">
          <h2
            id="skill-tools"
            className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-subtle"
          >
            Related free tools on this site
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.category}/${tool.slug}`}
                className="card-modern flex items-center justify-between gap-3 p-5"
              >
                <span className="text-[15px] text-ink-body">{tool.title}</span>
                <ArrowUpRight className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {siblings.length > 0 ? (
        <section aria-labelledby="skill-siblings" className="mt-12">
          <h2
            id="skill-siblings"
            className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-subtle"
          >
            More {category.name} skills
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((s) => (
              <SkillCard key={s.slug} skill={s} category={category} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-10">
        <Link
          href={`/skills/${category.slug}`}
          className="text-[15px] text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
        >
          ← All {category.name} skills
        </Link>
      </p>
    </article>
  )
}
