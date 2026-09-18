import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryPageBody } from '@/components/skills/CategoryPageBody'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { getSkillCategory, liveSkillCategories } from '@/lib/skills/categories'
import {
  getAllCategoryCounts,
  getSkillCountByCategory,
  getSkillsPage,
  SKILLS_PAGE_SIZE,
} from '@/lib/skills/db'

type Params = { category: string; page: string }

/**
 * Page 1 of every category lives at the bare `/skills/[category]` route;
 * this route covers page 2 onward, one static file per (category, page)
 * pair instead of the old `?page=N` query string. A query param forces a
 * dynamic, per-request render under Cache Components no matter the
 * `revalidate` window — every visit re-checks the cache, which is exactly
 * the ISR Read Units cost this route existed to avoid. The registry is
 * frozen, so every category's real page count is already fixed; there is
 * no open-ended range to enumerate, only the exact pages that exist.
 *
 * `dynamicParams` can't be set to `false` alongside `cacheComponents` (Next
 * rejects the combination), so a page number beyond a category's real last
 * page still reaches the component instead of 404ing at the framework
 * level — but `getSkillsPage` returns `[]` for it and the runtime
 * `if (skills.length === 0) notFound()` below already covers it.
 */

export async function generateStaticParams(): Promise<Params[]> {
  const counts = await getAllCategoryCounts()
  return liveSkillCategories(counts).flatMap((c) => {
    const totalPages = Math.max(1, Math.ceil((counts[c.slug] ?? 0) / SKILLS_PAGE_SIZE))
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      category: c.slug,
      page: String(i + 2),
    }))
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category: slug, page } = await params
  const category = getSkillCategory(slug)
  if (!category) return {}

  const count = await getSkillCountByCategory(category.slug)
  return {
    title: `${count.toLocaleString()} Free ${category.name} Agent Skills — Page ${page}`,
    description: category.intro,
    alternates: { canonical: `/skills/${category.slug}/page/${page}` },
  }
}

export default async function SkillCategoryPaginatedPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { category: slug, page: pageParam } = await params
  const category = getSkillCategory(slug)
  if (!category) notFound()

  const page = Number(pageParam)
  const [skills, count] = await Promise.all([
    getSkillsPage(category.slug, page),
    getSkillCountByCategory(category.slug),
  ])
  if (skills.length === 0) notFound()

  const totalPages = Math.max(1, Math.ceil(count / SKILLS_PAGE_SIZE))

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Skills', path: '/skills' },
          { name: category.name, path: `/skills/${category.slug}` },
        ])}
      />
      <CategoryPageBody
        category={category}
        count={count}
        skills={skills}
        page={page}
        totalPages={totalPages}
      />
    </>
  )
}
