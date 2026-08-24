import { ArrowUpRight, RefreshCw } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SkillCard } from '@/components/skills/SkillCard'
import { Icon } from '@/components/ui/Icon'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import {
  getAllCategoryCounts,
  getRecentlyAddedSkills,
  getSyncMeta,
  getTopSkillsByCategory,
  getTotalSkillCount,
} from '@/lib/skills/db'
import type { SkillCategory } from '@/lib/skills/types'

export async function generateMetadata(): Promise<Metadata> {
  const total = await getTotalSkillCount()
  return {
    title: `${total.toLocaleString()} Free AI Agent Skills — Claude Code, Cursor, Codex & More`,
    description:
      'A curated, daily-synced directory of real agent skills sourced from the open skills.sh registry — organized by task, not by which AI tool you use. Copy as SKILL.md, AGENTS.md, .cursorrules, or Copilot instructions.',
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

export default async function SkillsPage() {
  const [total, counts, syncMeta, recentlyAdded] = await Promise.all([
    getTotalSkillCount(),
    getAllCategoryCounts(),
    getSyncMeta(),
    getRecentlyAddedSkills(9),
  ])

  const categoriesWithCounts = SKILL_CATEGORIES.map((category) => ({
    category,
    count: counts[category.slug] ?? 0,
  })).filter(({ count }) => count > 0)

  const previewByCategory = await Promise.all(
    categoriesWithCounts.map(({ category }) => getTopSkillsByCategory(category.slug, 3)),
  )

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Skills', path: '/skills' },
        ])}
      />

      <section className="container-site pt-10 pb-6">
        {/* Hero — the same brutal pastel panel language the prompt hub and
            catalogue pages open with. Fixed pastel: literal black text. */}
        <header className="rounded-panel border border-ink bg-tile-green p-6 shadow-brutal md:p-9">
          <p className="font-bold text-[12px] text-black/60 uppercase tracking-[0.14em]">
            Free agent skills directory · {categoriesWithCounts.length} task categories
          </p>
          <h1 className="mt-2 max-w-[26ch] text-[38px] text-black leading-[1.05] tracking-[-1px] md:text-[52px] md:leading-[56px]">
            {total.toLocaleString()} real AI agent skills
          </h1>
          <p className="mt-4 max-w-[62ch] text-[17px] text-black/70 leading-7">
            Every skill here is a real, public `SKILL.md` synced from the open skills.sh
            registry — organized by the task you're trying to do, not by which AI tool you
            happen to use. Copy it as-is for Claude Code, Codex CLI, Cursor, or Gemini
            CLI, or export it as AGENTS.md, .cursorrules, or Copilot instructions.
          </p>

          <p className="mt-5 flex items-center gap-1.5 font-medium text-[13.5px] text-black/70">
            <RefreshCw className="size-4 text-green" aria-hidden="true" />
            Updated daily — last synced {formatSyncedAt(syncMeta.lastSyncedAt)}
          </p>
        </header>

        <nav aria-label="Jump to category" className="mt-7 flex flex-wrap gap-2">
          {categoriesWithCounts.map(({ category }) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className="chip-tool px-4 py-2 text-[14px]"
            >
              {category.name}
            </a>
          ))}
        </nav>
      </section>

      {recentlyAdded.length > 0 ? (
        <section aria-labelledby="recently-added" className="container-site py-8">
          <h2
            id="recently-added"
            className="text-[26px] tracking-[-0.5px] md:text-[30px]"
          >
            Recently added
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyAdded.map((skill) => {
              const category = SKILL_CATEGORIES.find((c) => c.slug === skill.category)
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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-line-grey border-b pb-4">
            <h2
              id={`${category.slug}-heading`}
              className="flex items-center gap-3 text-[26px] tracking-[-0.5px] md:text-[30px]"
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-ink/10 ${TILE_BG[category.tile]}`}
              >
                <Icon name={category.icon} className="size-4.5 text-violet-700" />
              </span>
              {category.name}
              <span className="font-sans font-normal text-[14px] text-ink-subtle tracking-normal">
                {count.toLocaleString()} skills
              </span>
            </h2>
            <Link
              href={`/skills/${category.slug}`}
              className="flex items-center gap-1 font-medium text-[15px] text-violet-700 underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              All {category.name} skills
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
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
