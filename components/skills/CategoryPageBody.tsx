import { ArrowLeft, ArrowRight, BadgeCheck, Download } from 'lucide-react'
import Image from 'next/image'
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

function formatInstalls(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

/**
 * The header + grid + pagination markup shared by `/skills/[category]`
 * (always page 1) and `/skills/[category]/page/[page]` (page >= 2) — see
 * that pair's docblocks for why pagination moved from a `?page=` query
 * param (which forces a dynamic, per-request render under Cache Components
 * no matter how long the data is cached for) to enumerable static routes.
 * Takes plain, already-fetched props rather than reading params/searchParams
 * itself, so both routes stay fully static.
 *
 * Hero is the category's pastel tile as a brutal panel with, on page 1, the
 * category's three most-installed skills as tilted sticker cards — real
 * entries from the grid below, so the panel carries content, not
 * decoration. Later pages swap that for a page/count ticket.
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
  const siblings = SKILL_CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 4)
  const prevHref =
    page - 1 <= 1
      ? `/skills/${category.slug}`
      : `/skills/${category.slug}/page/${page - 1}`
  const nextHref = `/skills/${category.slug}/page/${page + 1}`
  const podium = page === 1 ? skills.slice(0, 3) : []
  const tilts = ['-rotate-2', 'rotate-1', '-rotate-1']

  return (
    <>
      <section className="container-site pt-8 pb-4">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-2 text-[13px] text-ink-subtle">
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
            <li aria-current="page" className="text-ink-muted">
              {category.name}
              {page > 1 ? ` · page ${page.toLocaleString()}` : ''}
            </li>
          </ol>
        </nav>

        <header
          className={`rounded-panel border border-ink p-6 shadow-brutal md:p-10 ${TILE_BG[category.tile]}`}
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-ink bg-white shadow-brutal-sm">
                  <Icon name={category.icon} className="size-6 text-violet-700" />
                </span>
                <p className="font-bold text-[12px] text-black/60 uppercase tracking-[0.14em]">
                  {count.toLocaleString()} free {count === 1 ? 'skill' : 'skills'}
                  {totalPages > 1
                    ? ` · page ${page.toLocaleString()} of ${totalPages.toLocaleString()}`
                    : ''}
                </p>
              </div>
              <h1 className="mt-4 text-[34px] text-black leading-[1.05] tracking-[-1px] md:text-[46px]">
                {category.name}{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">skills</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[0.08em] z-0 h-[0.32em] -rotate-1 bg-cta"
                  />
                </span>
              </h1>
              <p className="mt-4 max-w-[58ch] text-[16px] text-black/70 leading-7 md:text-[17px]">
                {category.intro}
              </p>
              <p className="mt-5 flex items-center gap-1.5 font-medium text-[13px] text-black/70">
                <BadgeCheck className="size-4 text-green" aria-hidden="true" />
                Real files from public repositories — hand-curated, never invented. Sorted
                by installs.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[340px] lg:mx-0 lg:ml-auto">
              {podium.length > 0 ? (
                <>
                  <p className="-top-4 -left-2 absolute z-10 -rotate-6 rounded-pill border border-ink bg-cta px-3.5 py-1 font-marker text-[15px] text-black shadow-brutal-sm">
                    top 3 by installs
                  </p>
                  <ol className="flex flex-col gap-3 pt-3">
                    {podium.map((skill, i) => (
                      <li key={skill.id} className={tilts[i]}>
                        <Link
                          href={`/skills/${skill.category}/${skill.slug}`}
                          className="flex items-center gap-3 rounded-card border border-ink bg-white px-4 py-3 shadow-brutal-sm transition-colors hover:bg-cream"
                        >
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-ink bg-cta font-bold text-[12px] text-black">
                            {i + 1}
                          </span>
                          <Image
                            src={`https://avatars.githubusercontent.com/${skill.sourceOwner}?s=64`}
                            alt=""
                            width={32}
                            height={32}
                            unoptimized
                            className="size-8 shrink-0 rounded-[8px] border border-ink/10 object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold text-[14px] text-black">
                              {skill.name}
                            </span>
                            <span className="block truncate text-[12px] text-black/55">
                              {skill.sourceOwner}/{skill.sourceRepo}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1 font-medium text-[12px] text-black/70">
                            <Download className="size-3.5" aria-hidden="true" />
                            {formatInstalls(skill.installs)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <div className="-rotate-2 flex items-baseline justify-between gap-4 rounded-card border border-ink bg-white px-5 py-4 shadow-brutal-sm">
                  <span className="stat-figure text-[40px] text-black leading-none">
                    {page.toLocaleString()}
                    <span className="text-[20px] text-black/50">
                      {' '}
                      / {totalPages.toLocaleString()}
                    </span>
                  </span>
                  <span className="text-right font-bold text-[11.5px] text-black/60 uppercase tracking-[0.12em]">
                    page
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>
      </section>

      <section aria-label={`${category.name} skills`} className="container-site py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill: Skill) => (
            <SkillCard key={skill.id} skill={skill} category={category} />
          ))}
        </div>

        {totalPages > 1 ? (
          <nav
            aria-label="Pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {page > 1 ? (
              <Link href={prevHref} className="btn-brutal btn-brutal-sm btn-white">
                <ArrowLeft className="size-4" aria-hidden="true" />
                PREVIOUS
              </Link>
            ) : null}
            <span className="px-2 text-[13.5px] text-ink-subtle">
              Page {page.toLocaleString()} of {totalPages.toLocaleString()}
            </span>
            {page < totalPages ? (
              <Link href={nextHref} className="btn-brutal btn-brutal-sm">
                NEXT
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>

      <section className="container-site pb-12">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-[22px] tracking-[-0.5px] md:text-[26px]">Other tasks</h2>
          <p className="font-marker text-[15px] text-ink-muted">
            same rules, different job
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {siblings.map((s) => (
            <Link key={s.slug} href={`/skills/${s.slug}`} className="chip-tool p-4">
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-ink/10 ${TILE_BG[s.tile]}`}
              >
                <Icon name={s.icon} className="size-4.5 text-violet-700" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-[15px] text-ink">{s.name}</span>
                <span className="block truncate text-[12.5px] text-ink-subtle">
                  {s.blurb}
                </span>
              </span>
            </Link>
          ))}
        </div>
        <Link href="/skills#browse" className="btn-brutal btn-brutal-sm btn-white mt-6">
          ALL TASK CATEGORIES
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </>
  )
}
