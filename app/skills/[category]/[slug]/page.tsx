import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SkillDetailShell } from '@/components/skills/SkillDetailShell'
import { breadcrumbJsonLd, JsonLd, skillJsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { getSkillCategory, SKILL_CATEGORIES } from '@/lib/skills/categories'
import { getSiblingSkills, getSkill, getTopSkillsByCategory } from '@/lib/skills/db'

type Params = { category: string; slug: string }

/** Statically pre-renders only the most-installed skills per category — a
 * category can hold tens of thousands of entries at the registry's real
 * scale, so the long tail renders on first request instead (`dynamicParams`
 * defaults to true and is required to under `cacheComponents` anyway). */
export async function generateStaticParams(): Promise<Params[]> {
  const perCategory = await Promise.all(
    SKILL_CATEGORIES.map(async (c) => {
      const skills = await getTopSkillsByCategory(c.slug, 50)
      return skills.map((s) => ({ category: c.slug, slug: s.slug }))
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
