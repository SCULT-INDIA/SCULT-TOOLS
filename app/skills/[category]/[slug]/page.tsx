import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SkillDetailShell } from '@/components/skills/SkillDetailShell'
import { breadcrumbJsonLd, JsonLd, skillJsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { getSkillCategory, SKILL_CATEGORIES } from '@/lib/skills/categories'
import { getSiblingSkills, getSkill, getTopSkillsByCategory } from '@/lib/skills/db'

type Params = { category: string; slug: string }

/**
 * Statically pre-renders only the most-installed skills per category; the
 * rest render on first request (`dynamicParams` defaults to true and is
 * required to under `cacheComponents` anyway) and then stay cached for the
 * `skillsRegistry` profile's 30 days, since the data is frozen.
 *
 * 15 per category, down from 50 (2026-09-16): every pre-rendered page is a
 * Supabase query plus a render on every single deploy — 24 × 50 = 1,200 of
 * them made builds the single largest line on the Vercel bill during an
 * active day. 24 × 15 = 360 keeps the genuinely hot pages instant on a fresh
 * deploy while a first visit to a colder one costs the same one-time render
 * it did before, just on demand instead of up front.
 */
export async function generateStaticParams(): Promise<Params[]> {
  const perCategory = await Promise.all(
    SKILL_CATEGORIES.map(async (c) => {
      const skills = await getTopSkillsByCategory(c.slug, 15)
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
