import { BadgeCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Icon } from '@/components/ui/Icon'
import { SkillCard } from '@/components/skills/SkillCard'
import { getSkillCategory, SKILL_CATEGORIES } from '@/lib/skills/categories'
import { getAllCategoryCounts, getSkillCountByCategory, getSkillsPage, SKILLS_PAGE_SIZE } from '@/lib/skills/db'
import type { Skill, SkillCategory } from '@/lib/skills/types'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'

type Params = { category: string }
type SearchParams = { page?: string }

const TILE_BG: Record<SkillCategory['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/** Only page 1 of each non-empty category is pre-rendered — a category can
 * hold tens of thousands of skills at the registry's real scale, so every
 * later page (`?page=2`, `?page=3`, …) renders on request instead. */
export async function generateStaticParams(): Promise<Params[]> {
  const counts = await getAllCategoryCounts()
  return SKILL_CATEGORIES.filter((c) => (counts[c.slug] ?? 0) > 0).map((c) => ({
    category: c.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category: slug } = await params
  const category = getSkillCategory(slug)
  if (!category) return {}

  const count = await getSkillCountByCategory(category.slug)
  return {
    title: `${count.toLocaleString()} Free ${category.name} Agent Skills`,
    description: category.intro,
    alternates: { canonical: `/skills/${category.slug}` },
    openGraph: {
      type: 'website',
      url: absoluteUrl(`/skills/${category.slug}`),
      title: `Free ${category.name} Agent Skills`,
      description: category.intro,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Free ${category.name} Agent Skills`,
      description: category.intro,
    },
  }
}

function SkillGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder count, never reordered
        <div key={i} className="h-40 animate-pulse rounded-card bg-offwhite" />
      ))}
    </div>
  )
}

/**
 * The only part of this page that reads `searchParams` — a dynamic,
 * per-request API. Under `cacheComponents`, any dynamic read has to sit
 * inside its own `<Suspense>` boundary or the *whole* page is flagged as
 * blocking at build time; isolating it here is what lets the header/intro
 * above stay statically prerendered while this streams in.
 */
async function SkillGrid({
  category,
  searchParams,
}: {
  category: SkillCategory
  searchParams: Promise<SearchParams>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const [skills, count] = await Promise.all([
    getSkillsPage(category.slug, page),
    getSkillCountByCategory(category.slug),
  ])
  if (skills.length === 0) notFound()

  const totalPages = Math.max(1, Math.ceil(count / SKILLS_PAGE_SIZE))

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill: Skill) => (
          <SkillCard key={skill.id} skill={skill} category={category} />
        ))}
      </div>

      {totalPages > 1 ? (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3">
          {page > 1 ? (
            <Link
              href={page - 1 === 1 ? `/skills/${category.slug}` : `/skills/${category.slug}?page=${page - 1}`}
              className="chip-tool px-4 py-2 text-[14px]"
            >
              ← Previous
            </Link>
          ) : null}
          <span className="text-[13.5px] text-ink-subtle">
            Page {page.toLocaleString()} of {totalPages.toLocaleString()}
          </span>
          {page < totalPages ? (
            <Link href={`/skills/${category.slug}?page=${page + 1}`} className="chip-tool px-4 py-2 text-[14px]">
              Next →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  )
}

export default async function SkillCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { category: slug } = await params
  const category = getSkillCategory(slug)
  if (!category) notFound()

  const count = await getSkillCountByCategory(category.slug)
  if (count === 0) notFound()

  const siblings = SKILL_CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 3)

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Skills', path: '/skills' },
          { name: category.name, path: `/skills/${category.slug}` },
        ])}
      />

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
            </li>
          </ol>
        </nav>

        <header
          className={`rounded-panel border border-ink p-6 shadow-brutal md:p-9 ${TILE_BG[category.tile]}`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-ink/10 bg-white shadow-[0_2px_8px_rgb(0_0_0/0.08)]">
              <Icon name={category.icon} className="size-8 text-violet-700" />
            </span>
            <div>
              <p className="font-bold text-[12px] text-black/60 uppercase tracking-[0.14em]">
                {count.toLocaleString()} free {count === 1 ? 'skill' : 'skills'}
              </p>
              <h1 className="mt-1 text-[34px] text-black leading-[1.05] tracking-[-1px] md:text-[46px]">
                {category.name} skills
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-[64ch] text-[16px] text-black/70 leading-7 md:text-[17px]">
            {category.intro}
          </p>
          <p className="mt-4 flex items-center gap-1.5 font-medium text-[13.5px] text-black/70">
            <BadgeCheck className="size-4 text-green" aria-hidden="true" />
            Sourced from real, public repositories — synced daily, never invented.
          </p>
        </header>
      </section>

      <section aria-label={`${category.name} skills`} className="container-site py-10">
        <Suspense fallback={<SkillGridSkeleton />}>
          <SkillGrid category={category} searchParams={searchParams} />
        </Suspense>
      </section>

      <section className="container-site pb-8">
        <h2 className="font-sans font-bold text-[13px] uppercase tracking-[0.1em]">
          Other skill categories
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {siblings.map((s) => (
            <Link key={s.slug} href={`/skills/${s.slug}`} className="chip-tool max-w-sm text-[15px]">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] border border-line-grey bg-white">
                <Icon name={s.icon} className="size-4 text-violet-700" />
              </span>
              <span>
                <span className="font-medium">{s.name}</span>{' '}
                <span className="text-ink-subtle">— {s.blurb}</span>
              </span>
            </Link>
          ))}
          <Link href="/skills" className="chip-tool text-[15px]">
            <span className="font-medium">All skills</span>
          </Link>
        </div>
      </section>
    </>
  )
}
