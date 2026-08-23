import { ArrowUpRight, BadgeCheck, Download } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon, brandForTag } from '@/components/ui/BrandIcon'
import { Icon } from '@/components/ui/Icon'
import { SkillCard } from '@/components/skills/SkillCard'
import { SkillCopyBlock } from '@/components/skills/SkillCopyBlock'
import type { Skill, SkillCategory } from '@/lib/skills/types'
import { getTool } from '@/lib/tools/registry'

/** Every real `SKILL.md` works natively across these agents — the open
 * Agent Skills standard, not a per-skill claim — so this is shown once,
 * the same for every skill, rather than derived per entry. */
const COMPATIBLE_AGENTS: readonly { brand: string; label: string }[] = [
  { brand: 'claude-code', label: 'Claude Code' },
  { brand: 'cursor', label: 'Cursor' },
  { brand: 'chatgpt', label: 'Codex CLI' },
  { brand: 'github-copilot', label: 'GitHub Copilot' },
  { brand: 'gemini', label: 'Gemini CLI' },
]

function formatInstalls(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString()
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

  const techBrands = [...new Set(skill.tags.map(brandForTag).filter((b): b is string => b !== null))]

  return (
    <article className="container-site max-w-[50rem] pt-8 pb-24">
      <nav aria-label="Breadcrumb" className="mb-8">
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
          <li aria-current="page" className="truncate text-ink-muted">
            {skill.name}
          </li>
        </ol>
      </nav>

      {/* Hero — soft card, not a bordered/shadowed panel: the calm-directory
          register this whole redesign is aiming for. */}
      <header className="rounded-3xl border border-line-grey bg-white p-7 shadow-xs md:p-10">
        <Link
          href={`/skills/${category.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-offwhite px-3 py-1.5 font-medium text-[12.5px] text-ink-muted transition-colors hover:text-violet-700"
        >
          <Icon name={category.icon} className="size-3.5 text-violet-700" />
          {category.name}
        </Link>

        <h1 className="mt-4 text-[30px] leading-[1.15] tracking-[-0.5px] md:text-[38px]">
          {skill.name}
        </h1>
        <p className="mt-3 max-w-[58ch] text-[16px] text-ink-muted leading-7">
          {skill.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <a
            href={skill.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-line-grey bg-white px-3 py-1.5 font-medium text-[13px] text-ink-body transition-colors hover:border-violet-300 hover:text-violet-700"
          >
            <BrandIcon brand="github" size={13} />
            {skill.sourceOwner}/{skill.sourceRepo}
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
          <span className="flex items-center gap-1.5 rounded-full bg-offwhite px-3 py-1.5 font-medium text-[13px] text-ink-muted">
            <Download className="size-3.5" aria-hidden="true" />
            {formatInstalls(skill.installs)} installs
          </span>
          {skill.license ? (
            <span className="flex items-center gap-1.5 rounded-full bg-green/10 px-3 py-1.5 font-medium text-[13px] text-green">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {skill.license}
            </span>
          ) : null}
          <span className="rounded-full bg-offwhite px-3 py-1.5 font-medium text-[13px] text-ink-subtle">
            Synced{' '}
            {new Date(skill.lastSyncedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {techBrands.length > 0 ? (
          <div className="mt-7 border-line-grey border-t pt-6">
            <p className="font-semibold text-[11.5px] text-ink-subtle uppercase tracking-[0.1em]">
              Tech stack
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {techBrands.map((brand) => (
                <span
                  key={brand}
                  className="flex items-center gap-1.5 rounded-full border border-line-grey bg-white px-2.5 py-1.5"
                >
                  <BrandIcon brand={brand} size={15} />
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 border-line-grey border-t pt-6">
          <p className="font-semibold text-[11.5px] text-ink-subtle uppercase tracking-[0.1em]">
            Works with
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            {COMPATIBLE_AGENTS.map((agent) => (
              <span key={agent.brand} className="flex items-center gap-1.5 text-[13px] text-ink-muted">
                <span className="flex size-6 items-center justify-center rounded-full bg-white ring-1 ring-black/[0.06]">
                  <BrandIcon brand={agent.brand} size={14} />
                </span>
                {agent.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="mt-10">
        <SkillCopyBlock skill={skill} licenseGated={skill.licenseGated} />
      </section>

      {relatedTools.length > 0 ? (
        <section aria-labelledby="skill-tools" className="mt-14">
          <h2 className="font-semibold text-[13px] text-ink-subtle uppercase tracking-[0.1em]">
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
        <section aria-labelledby="skill-siblings" className="mt-14">
          <h2 className="font-semibold text-[13px] text-ink-subtle uppercase tracking-[0.1em]">
            More {category.name} skills
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((s) => (
              <SkillCard key={s.slug} skill={s} category={category} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-12">
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
