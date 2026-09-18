import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SkillDetailShell } from '@/components/skills/SkillDetailShell'
import { breadcrumbJsonLd, JsonLd, skillJsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { getSkillCategory, SKILL_CATEGORIES } from '@/lib/skills/categories'
import { getAllSkillSlugsByCategory, getSiblingSkills, getSkill } from '@/lib/skills/db'

type Params = { category: string; slug: string }

/**
 * Every served skill is statically pre-rendered — not just the hottest few
 * per category. The registry is frozen at exactly 10,000 rows (see
 * lib/skills/db.ts's header) with nothing left to sync, so there is no
 * ongoing tension between "pre-render everything" and "keep builds cheap":
 * this only costs once, at the next deploy, and deploys are now both rare
 * (vercel.json's `ignoreCommand`) and infrequent by habit.
 *
 * This is what makes it pay off: a `'use cache'` page is re-checked against
 * the ISR/Cache Components cache on every single visit no matter how long
 * `revalidate` is set to (revalidate only bounds how often it's
 * *rewritten*, not how often it's *read*), so traffic volume alone kept
 * driving ISR Read Units up regardless of the 30-day cacheLife. 24 × ~15
 * (2026-09-16) grew Vercel's build cost by pre-rendering fewer pages; going
 * to all 10,000 (2026-09-17) trades a bigger one-time build for removing
 * this route from that per-visit read path entirely — a page that already
 * exists as a static file is served straight from the CDN edge, no cache
 * check involved.
 *
 * `dynamicParams` can't be set to `false` alongside `cacheComponents` (Next
 * rejects the combination outright), so a slug outside this set still
 * reaches the component instead of 404ing at the framework level — but
 * `getSkill` returns `undefined` for it and the component below already
 * calls `notFound()` in that case, so the visible behavior is identical.
 */
export async function generateStaticParams(): Promise<Params[]> {
  const perCategory = await Promise.all(
    SKILL_CATEGORIES.map(async (c) => {
      const slugs = await getAllSkillSlugsByCategory(c.slug)
      return slugs.map((slug) => ({ category: c.slug, slug }))
    }),
  )
  return perCategory.flat()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category: categorySlug, slug } = await params
  const category = getSkillCategory(categorySlug)
  if (!category) return {}
  const skill = await getSkill(category.slug, slug)
  if (!skill) return {}

  const path = `/skills/${skill.category}/${skill.slug}`
  return {
    title: `${skill.name} — Free Agent Skill`,
    description: skill.description,
    keywords: [...skill.tags],
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: absoluteUrl(path),
      title: skill.name,
      description: skill.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: skill.name,
      description: skill.description,
    },
  }
}

export default async function SkillDetailPage({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, slug } = await params

  const category = getSkillCategory(categorySlug)
  if (!category) notFound()

  const skill = await getSkill(category.slug, slug)
  if (!skill) notFound()

  const siblings = await getSiblingSkills(category.slug, skill.slug, 3)

  return (
    <>
      <JsonLd data={skillJsonLd(skill)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Skills', path: '/skills' },
          { name: category.name, path: `/skills/${category.slug}` },
          { name: skill.name, path: `/skills/${skill.category}/${skill.slug}` },
        ])}
      />

      <SkillDetailShell skill={skill} category={category} siblings={siblings} />
    </>
  )
}
