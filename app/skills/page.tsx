import { ArrowRight, ArrowUpRight, BadgeCheck, Flame, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SkillCard } from '@/components/skills/SkillCard'
import { Icon } from '@/components/ui/Icon'
import { TrackedLink } from '@/components/ui/TrackedLink'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import {
  getAllCategoryCounts,
  getRecentlyAddedSkills,
  getSyncMeta,
  getTopSkills,
  getTopSkillsByCategory,
  getTotalSkillCount,
  SKILLS_INDEXED_REGISTRY_TOTAL,
} from '@/lib/skills/db'
import type { SkillCategory } from '@/lib/skills/types'

export async function generateMetadata(): Promise<Metadata> {
  const total = await getTotalSkillCount()
  return {
    title: `${total.toLocaleString()} Free AI Agent Skills — Claude Code, Cursor, Codex & More`,
    description: `The ${total.toLocaleString()} most-installed real agent skills, hand-curated from the ${SKILLS_INDEXED_REGISTRY_TOTAL.toLocaleString()}+ in the open skills.sh registry — organized by task, not by which AI tool you use. Download as SKILL.md, AGENTS.md, or a Cursor rule.`,
    alternates: { canonical: '/skills' },
  }
}

const TILE_BG: Record<SkillCategory['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

function formatSyncedAt(iso: string | null): string {
  if (!iso) return 'not yet synced'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** A directory rail's header: pastel icon tile, display heading, a quiet
 * meta note, and a pill "view all" on the right. */
function RailHeading({
  id,
  icon,
  tile,
  title,
  meta,
  href,
  linkLabel,
  linkEvent,
}: {
  id: string
  icon: ReactNode
  tile: SkillCategory['tile']
  title: string
  meta?: string
  href?: string
  linkLabel?: string
  linkEvent?: { section: string; category: string }
}) {
  const pill =
    'flex items-center gap-1.5 rounded-pill border border-ink bg-white px-3.5 py-1.5 font-semibold text-[13px] text-ink transition-colors hover:bg-cta'
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h2
        id={id}
        className="flex items-center gap-3 text-[24px] tracking-[-0.5px] md:text-[28px]"
      >
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-ink ${TILE_BG[tile]}`}
        >
          {icon}
        </span>
        {title}
        {meta ? (
          <span className="hidden font-sans font-normal text-[14px] text-ink-subtle tracking-normal sm:inline">
            {meta}
          </span>
        ) : null}
      </h2>
      {href && linkLabel ? (
        linkEvent ? (
          <TrackedLink
            href={href}
            event="category_selected"
            params={linkEvent}
            className={pill}
          >
            {linkLabel}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </TrackedLink>
        ) : (
          <a href={href} className={pill}>
            {linkLabel}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        )
      ) : null}
    </div>
  )
}

/**
 * The Skills Library hub. Fully static: every query here runs once at build
 * time against a frozen registry (see lib/skills/db.ts), so this page is a
 * plain CDN file — no per-visit work, however many rails it shows. All of
 * the visual energy below is CSS on the brand's own primitives (pastel
 * tiles, ink borders, hard offset shadows, the handwritten marker note,
 * rotated "stickers") — no images, no client JS.
 */
export default async function SkillsPage() {
  const [total, counts, syncMeta, topSkills, recentlyAdded] = await Promise.all([
    getTotalSkillCount(),
    getAllCategoryCounts(),
    getSyncMeta(),
    getTopSkills(6),
    getRecentlyAddedSkills(6),
  ])

  const categoriesWithCounts = SKILL_CATEGORIES.map((category) => ({
    category,
    count: counts[category.slug] ?? 0,
  })).filter(({ count }) => count > 0)

  const previewByCategory = await Promise.all(
    categoriesWithCounts.map(({ category }) => getTopSkillsByCategory(category.slug, 3)),
  )

  const categoryOf = (slug: string) => SKILL_CATEGORIES.find((c) => c.slug === slug)

  const stats: readonly { figure: string; label: string; tilt: string }[] = [
    { figure: total.toLocaleString(), label: 'curated skills', tilt: '-rotate-2' },
    {
      figure: String(categoriesWithCounts.length),
      label: 'task categories',
      tilt: 'rotate-1',
    },
    {
      figure: `${SKILLS_INDEXED_REGISTRY_TOTAL.toLocaleString()}+`,
      label: 'indexed, then filtered',
      tilt: '-rotate-1',
    },
  ]

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Skills', path: '/skills' },
        ])}
      />

      {/* Hero — the category-green tile as a brutal panel, two columns: the
          pitch, and the real numbers as tilted "ticket" stickers. */}
      <section className="container-site pt-10 pb-4">
        <header className="rounded-panel border border-ink bg-tile-green p-6 shadow-brutal md:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="font-bold text-[12px] text-black/60 uppercase tracking-[0.14em]">
                Free agent skills directory
              </p>
              <h1 className="mt-3 max-w-[22ch] text-[38px] text-black leading-[1.02] tracking-[-1px] md:text-[54px] md:leading-[56px]">
                The {total.toLocaleString()} best{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">AI agent skills</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[0.08em] z-0 h-[0.32em] -rotate-1 bg-cta"
                  />
                </span>
              </h1>
              <p className="mt-5 max-w-[56ch] text-[17px] text-black/70 leading-7">
                Real, public <span className="font-mono text-[15px]">SKILL.md</span> files
                from the open skills.sh registry — kept only if they're among the
                most-installed, organized by the task you're doing, not by which AI tool
                you use. Every one downloads as a ZIP for Claude Code, Cursor, Codex CLI,
                Copilot, and Gemini CLI.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a href="#browse" className="btn-brutal btn-brutal-sm">
                  BROWSE BY TASK
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <a href="#most-installed" className="btn-brutal btn-brutal-sm btn-white">
                  MOST INSTALLED
                </a>
              </div>
              <p className="mt-6 flex items-center gap-1.5 font-medium text-[13.5px] text-black/70">
                <BadgeCheck className="size-4 text-green" aria-hidden="true" />
                Hand-curated, never invented — registry snapshot{' '}
                {formatSyncedAt(syncMeta.lastSyncedAt)}
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[360px] lg:mx-0 lg:ml-auto">
              <p className="-top-4 -left-2 absolute z-10 -rotate-6 rounded-pill border border-ink bg-cta px-3.5 py-1 font-marker text-[15px] text-black shadow-brutal-sm">
                real files, not listicles
              </p>
              <dl className="flex flex-col gap-3 pt-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className={`flex items-baseline justify-between gap-4 rounded-card border border-ink bg-white px-5 py-4 shadow-brutal-sm ${s.tilt}`}
                  >
                    <dd className="stat-figure text-[34px] text-black leading-none md:text-[40px]">
                      {s.figure}
                    </dd>
                    <dt className="text-right font-bold text-[11.5px] text-black/60 uppercase tracking-[0.12em]">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>
      </section>

      {/* Browse by task — one pastel tile per category, a real link each. */}
      <section
        id="browse"
        aria-labelledby="browse-heading"
        className="container-site scroll-mt-32 py-10"
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2
            id="browse-heading"
            className="text-[24px] tracking-[-0.5px] md:text-[28px]"
          >
            Browse by task
          </h2>
          <p className="font-marker text-[15px] text-ink-muted">
            every skill lives in exactly one bucket
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoriesWithCounts.map(({ category, count }) => (
            <TrackedLink
              key={category.slug}
              href={`/skills/${category.slug}`}
              event="category_selected"
              params={{ section: 'skills-browse', category: category.slug }}
              className="chip-tool p-4"
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-ink/10 ${TILE_BG[category.tile]}`}
              >
                <Icon name={category.icon} className="size-4.5 text-violet-700" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-[15px] text-ink">
                  {category.name}
                </span>
                <span className="block truncate text-[12.5px] text-ink-subtle">
                  {category.blurb}
                </span>
              </span>
              <span className="shrink-0 rounded-pill border border-ink bg-white px-2 py-0.5 font-bold text-[11.5px] text-ink">
                {count.toLocaleString()}
              </span>
            </TrackedLink>
          ))}
        </div>
      </section>

      {topSkills.length > 0 ? (
        <section
          id="most-installed"
          aria-labelledby="most-installed-heading"
          className="container-site scroll-mt-32 py-8"
        >
          <RailHeading
            id="most-installed-heading"
            title="Most installed"
            meta="across every category"
            tile="yellow"
            icon={<Flame className="size-4.5 text-violet-700" aria-hidden="true" />}
          />
          <div className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
            {topSkills.map((skill, i) => {
              const category = categoryOf(skill.category)
              return category ? (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  category={category}
                  rank={i + 1}
                />
              ) : null
            })}
          </div>
        </section>
      ) : null}

      {recentlyAdded.length > 0 ? (
        <section aria-labelledby="recently-added" className="container-site py-8">
          <RailHeading
            id="recently-added"
            title="Recently added"
            meta="newest in the curated set"
            tile="lavender"
            icon={<Sparkles className="size-4.5 text-violet-700" aria-hidden="true" />}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyAdded.map((skill) => {
              const category = categoryOf(skill.category)
              return category ? (
                <SkillCard key={skill.id} skill={skill} category={category} />
              ) : null
            })}
          </div>
        </section>
      ) : null}

      {categoriesWithCounts.map(({ category, count }, i) => (
        <section
          key={category.slug}
          id={category.slug}
          aria-labelledby={`${category.slug}-heading`}
          className="container-site scroll-mt-32 py-8"
        >
          <RailHeading
            id={`${category.slug}-heading`}
            title={category.name}
            meta={`${count.toLocaleString()} skills`}
            tile={category.tile}
            href={`/skills/${category.slug}`}
            linkLabel={`All ${count.toLocaleString()}`}
            linkEvent={{ section: 'skills', category: category.slug }}
            icon={<Icon name={category.icon} className="size-4.5 text-violet-700" />}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previewByCategory[i]?.map((skill) => (
              <SkillCard key={skill.id} skill={skill} category={category} />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
