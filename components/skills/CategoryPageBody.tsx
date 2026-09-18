import { BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import { SkillCard } from '@/components/skills/SkillCard'
import { Icon } from '@/components/ui/Icon'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import type { Skill, SkillCategory } from '@/lib/skills/types'

const TILE_BG: Record<SkillCategory['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/**
 * The header + grid + pagination markup shared by `/skills/[category]`
 * (always page 1) and `/skills/[category]/page/[page]` (page >= 2) — see
 * that pair's docblocks for why pagination moved from a `?page=` query
 * param (which forces a dynamic, per-request render under Cache Components
 * no matter how long the data is cached for) to enumerable static routes.
 * Takes plain, already-fetched props rather than reading params/searchParams
 * itself, so both routes stay fully static.
 */
export function CategoryPageBody({
  category,
  count,
  skills,
  page,
  totalPages,
}: {
  category: SkillCategory
  count: number
  skills: readonly Skill[]
  page: number
  totalPages: number
}) {
  const siblings = SKILL_CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 3)
  const prevHref =
    page - 1 <= 1
      ? `/skills/${category.slug}`
      : `/skills/${category.slug}/page/${page - 1}`
  const nextHref = `/skills/${category.slug}/page/${page + 1}`

  return (
    <>
      <section className="container-site pt-10 pb-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-[14px] text-ink-subtle">
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
            <li aria-current="page" className="text-ink">
              {category.name}
              {page > 1 ? ` — page ${page.toLocaleString()}` : ''}
            </li>
          </ol>
        </nav>

        <header className="rounded-3xl border border-line-grey bg-white p-7 shadow-xs md:p-10">
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${TILE_BG[category.tile]}`}
            >
              <Icon name={category.icon} className="size-6 text-violet-700" />
            </span>
            <div>
              <p className="font-semibold text-[12px] text-ink-subtle uppercase tracking-[0.14em]">
                {count.toLocaleString()} free {count === 1 ? 'skill' : 'skills'}
              </p>
              <h1 className="mt-1 text-[30px] leading-[1.1] tracking-[-0.5px] md:text-[38px]">
                {category.name} skills
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-[64ch] text-[16px] text-ink-muted leading-7">
            {category.intro}
          </p>
          <p className="mt-4 flex items-center gap-1.5 font-medium text-[13.5px] text-ink-subtle">
            <BadgeCheck className="size-4 text-green" aria-hidden="true" />
            Sourced from real, public repositories — hand-curated, never invented.
          </p>
        </header>
      </section>

      <section aria-label={`${category.name} skills`} className="container-site py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill: Skill) => (
            <SkillCard key={skill.id} skill={skill} category={category} />
          ))}
        </div>

        {totalPages > 1 ? (
          <nav
            aria-label="Pagination"
            className="mt-8 flex items-center justify-center gap-3"
          >
            {page > 1 ? (
              <Link
                href={prevHref}
                className="rounded-full border border-line-grey bg-white px-4 py-2 font-medium text-[14px] text-ink-body transition-colors hover:border-violet-300 hover:text-violet-700"
              >
                ← Previous
              </Link>
            ) : null}
            <span className="text-[13.5px] text-ink-subtle">
              Page {page.toLocaleString()} of {totalPages.toLocaleString()}
            </span>
            {page < totalPages ? (
              <Link
                href={nextHref}
                className="rounded-full border border-line-grey bg-white px-4 py-2 font-medium text-[14px] text-ink-body transition-colors hover:border-violet-300 hover:text-violet-700"
              >
                Next →
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>

      <section className="container-site pb-8">
        <h2 className="font-sans font-bold text-[13px] uppercase tracking-[0.1em]">
          Other skill categories
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={`/skills/${s.slug}`}
              className="flex max-w-sm items-center gap-2.5 rounded-full border border-line-grey bg-white px-3.5 py-2 text-[15px] transition-colors hover:border-violet-300"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-offwhite">
                <Icon name={s.icon} className="size-4 text-violet-700" />
              </span>
              <span>
                <span className="font-medium">{s.name}</span>{' '}
                <span className="text-ink-subtle">— {s.blurb}</span>
              </span>
            </Link>
          ))}
          <Link
            href="/skills"
            className="flex items-center rounded-full border border-line-grey bg-white px-3.5 py-2 text-[15px] transition-colors hover:border-violet-300"
          >
            <span className="font-medium">All skills</span>
          </Link>
        </div>
      </section>
    </>
  )
}
