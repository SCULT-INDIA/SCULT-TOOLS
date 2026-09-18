import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Download,
  Scale,
  Tag,
  Terminal,
  Wrench,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SkillCard } from '@/components/skills/SkillCard'
import { SkillCopyBlock } from '@/components/skills/SkillCopyBlock'
import { BrandIcon, brandForTag } from '@/components/ui/BrandIcon'
import { Icon } from '@/components/ui/Icon'
import { TrackedLink } from '@/components/ui/TrackedLink'
import { ViewTracker } from '@/components/ui/ViewTracker'
import type { Skill, SkillCategory } from '@/lib/skills/types'
import { getTool } from '@/lib/tools/registry'

const TILE_BG: Record<SkillCategory['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * The skill detail page, in the site's own neo-brutalist register: the
 * category's pastel tile as a hard-bordered, offset-shadowed hero panel
 * (the same hero `PromptDetailShell` uses), white ink-bordered chips, and
 * the yellow `btn-brutal` as the one CTA. Layout borrows the shape of a
 * marketplace listing — header, a main column, a sticky action sidebar,
 * then related rails — without borrowing anyone's look.
 *
 * There is deliberately no inline skill text: the page is download-only
 * (see SkillCopyBlock), so the main column carries what a visitor needs to
 * DECIDE and INSTALL — what the skill does, what's in the download, where
 * each file goes — and nothing invented per skill.
 */
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

  const techBrands = [
    ...new Set(skill.tags.map(brandForTag).filter((b): b is string => b !== null)),
  ]

  const chip =
    'flex items-center gap-1.5 rounded-pill border border-ink/15 bg-white px-3 py-1.5 font-medium text-[12.5px] text-black'

  return (
    <article className="container-site pt-8 pb-24">
      <ViewTracker
        event="skill_action"
        params={{ category: skill.category, skill: skill.slug, action: 'view' }}
      />
      <nav aria-label="Breadcrumb" className="mb-5">
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

      {/* Hero — the category's pastel tile as a brutal panel. Text inside is
          always ink-on-pastel (tiles never adapt per theme). */}
      <header
        className={`rounded-panel border border-ink p-6 shadow-brutal md:p-9 ${TILE_BG[category.tile]}`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_2px_8px_rgb(0_0_0/0.08)]">
            <Image
              src={`https://avatars.githubusercontent.com/${skill.sourceOwner}?s=128`}
              alt={`${skill.sourceOwner} logo`}
              width={64}
              height={64}
              unoptimized
              className="size-full object-cover"
            />
          </span>
          <div className="min-w-0">
            <Link
              href={`/skills/${category.slug}`}
              className="flex items-center gap-1.5 font-bold text-[12px] text-black/60 uppercase tracking-[0.14em] hover:text-violet-700"
            >
              <Icon name={category.icon} className="size-3.5" />
              {category.name}
            </Link>
            <p className="mt-0.5 flex items-center gap-1 font-medium text-[13px] text-black/70">
              <BadgeCheck className="size-4 text-green" aria-hidden="true" />
              Real file from a public repo · synced {formatDate(skill.lastSyncedAt)}
            </p>
          </div>
        </div>

        <h1 className="mt-5 text-[30px] text-black leading-[1.08] tracking-[-1px] md:text-[40px]">
          {skill.name}
        </h1>
        <p className="mt-4 max-w-[62ch] text-[16px] text-black/70 leading-7 md:text-[17px]">
          {skill.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <TrackedLink
            href={skill.sourceUrl}
            external
            event="skill_action"
            params={{
              category: skill.category,
              skill: skill.slug,
              action: 'open_repository',
            }}
            className={`${chip} hover:border-ink`}
          >
            <BrandIcon brand="github" size={14} />
            {skill.sourceOwner}/{skill.sourceRepo}
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </TrackedLink>
          <span className={chip}>
            <Download className="size-3.5 text-violet-700" aria-hidden="true" />
            {formatInstalls(skill.installs)} installs
          </span>
          {skill.license ? (
            <span className={chip}>
              <Scale className="size-3.5 text-violet-700" aria-hidden="true" />
              {skill.license}
            </span>
          ) : null}
          {techBrands.map((brand) => (
            <span key={brand} className={chip}>
              <BrandIcon brand={brand} size={14} />
            </span>
          ))}
        </div>

        <div className="mt-6 border-black/10 border-t pt-5">
          <p className="font-bold text-[11.5px] text-black/60 uppercase tracking-[0.12em]">
            Works with
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {COMPATIBLE_AGENTS.map((agent) => (
              <span
                key={agent.brand}
                className="flex items-center gap-1.5 text-[13px] text-black/80"
              >
                <span className="flex size-6 items-center justify-center rounded-full border border-ink/10 bg-white">
                  <BrandIcon brand={agent.brand} size={14} />
                </span>
                {agent.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* Sidebar first in source so the CTA is above the fold on mobile;
            visually second on desktop. */}
        <aside className="order-first lg:sticky lg:top-28 lg:order-last">
          <SkillCopyBlock skill={skill} licenseGated={skill.licenseGated} />

          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-card border border-line-grey bg-offwhite p-3.5">
              <dt className="flex items-center gap-1.5 font-bold text-[11px] text-ink-subtle uppercase tracking-[0.1em]">
                <Tag className="size-3.5" aria-hidden="true" />
                Category
              </dt>
              <dd className="mt-1 text-[14px] text-ink">{category.name}</dd>
            </div>
            <div className="rounded-card border border-line-grey bg-offwhite p-3.5">
              <dt className="flex items-center gap-1.5 font-bold text-[11px] text-ink-subtle uppercase tracking-[0.1em]">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                Indexed
              </dt>
              <dd className="mt-1 text-[14px] text-ink">
                {formatDate(skill.firstSeenAt)}
              </dd>
            </div>
          </dl>
        </aside>

        <div className="min-w-0">
          <section aria-labelledby="install">
            <h2
              id="install"
              className="flex items-center gap-2.5 font-display font-semibold text-[22px] tracking-normal md:text-[26px]"
            >
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-violet-700">
                <Terminal className="size-4.5 text-white" aria-hidden="true" />
              </span>
              Install in three steps
            </h2>
            <ol className="mt-5 flex flex-col gap-3">
              {[
                {
                  title: 'Download the ZIP',
                  body: 'One file per agent, plus INSTALL.md with the exact paths below.',
                },
                {
                  title: 'Claude Code: copy SKILL.md into your skills folder',
                  code: `.claude/skills/${skill.slug}/SKILL.md    # this project\n~/.claude/skills/${skill.slug}/SKILL.md   # every project`,
                },
                {
                  title: 'Other agents: use the matching file',
                  body: 'skill.mdc goes in Cursor’s .cursor/rules/. AGENTS.md works as GitHub Copilot instructions, a legacy .cursorrules, or a Codex / Gemini CLI instructions file.',
                },
              ].map((step, i) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-card border border-line-grey bg-white p-4"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-ink bg-cta font-bold text-[13px] text-black">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[15px] text-ink">{step.title}</p>
                    {step.body ? (
                      <p className="mt-1 text-[14px] text-ink-muted leading-6">
                        {step.body}
                      </p>
                    ) : null}
                    {step.code ? (
                      <pre className="mt-2 overflow-x-auto rounded-sm border border-ink/10 bg-offwhite px-3 py-2 font-mono text-[12.5px] text-ink-muted leading-6">
                        {step.code}
                      </pre>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {relatedTools.length > 0 ? (
            <section aria-labelledby="skill-tools" className="mt-12">
              <h2
                id="skill-tools"
                className="font-bold text-[13px] text-ink-subtle uppercase tracking-[0.1em]"
              >
                Pairs with these free tools
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.category}/${tool.slug}`}
                    className="chip-tool p-4 text-[14px]"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-violet-100">
                      <Wrench className="size-4 text-violet-700" aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-violet-700">{tool.title}</span>
                    <ArrowUpRight
                      className="ml-auto size-4 shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {siblings.length > 0 ? (
        <section aria-labelledby="skill-siblings" className="mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="skill-siblings"
              className="font-bold text-[13px] text-ink-subtle uppercase tracking-[0.1em]"
            >
              More {category.name} skills
            </h2>
            <Link
              href={`/skills/${category.slug}`}
              className="flex items-center gap-1 font-medium text-[14px] text-violet-700 underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              All {category.name} skills
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((s) => (
              <SkillCard key={s.slug} skill={s} category={category} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
