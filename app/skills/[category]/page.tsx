import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryPageBody } from '@/components/skills/CategoryPageBody'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { liveSkillCategories } from '@/lib/skills/categories'
import { getSkillCategoryOrCustom } from '@/lib/skills/category-resolver'
import {
  getAllCategoryCounts,
  getSkillCountByCategory,
  getSkillsPage,
  SKILLS_PAGE_SIZE,
} from '@/lib/skills/db'

type Params = { category: string }

/**
 * Always page 1 — page >= 2 lives at `/skills/[category]/page/[page]`
 * (see that route's docblock). Query-string pagination (`?page=N`) used to
 * live here, but reading `searchParams` forces a dynamic, per-request
 * render under Cache Components regardless of `revalidate`, so *every*
 * visit to a category page — not just the first — was hitting the
 * ISR/Cache Components read path. The registry is frozen, so there is no
 * reason any visit should ever need a fresh read; moving pagination to
 * enumerable static routes removes this page from that path entirely.
 *
 * `dynamicParams` can't be set to `false` alongside `cacheComponents` (Next
 * rejects the combination), so an unknown category still reaches the
 * component instead of 404ing at the framework level — but the runtime
 * `if (!category) notFound()` below already covers it.
 */
export async function generateStaticParams(): Promise<Params[]> {
  const counts = await getAllCategoryCounts()
  return liveSkillCategories(counts).map((c) => ({ category: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category: slug } = await params
  const category = await getSkillCategoryOrCustom(slug)
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

export default async function SkillCategoryPage({ params }: { params: Promise<Params> }) {
  const { category: slug } = await params
  const category = await getSkillCategoryOrCustom(slug)
  if (!category) notFound()

  const [skills, count] = await Promise.all([
    getSkillsPage(category.slug, 1),
    getSkillCountByCategory(category.slug),
  ])
  if (count === 0) notFound()

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
        page={1}
        totalPages={totalPages}
      />
    </>
  )
}
