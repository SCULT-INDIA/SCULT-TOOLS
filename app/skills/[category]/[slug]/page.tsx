import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SkillDetailShell } from '@/components/skills/SkillDetailShell'
import { breadcrumbJsonLd, JsonLd, skillJsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { getSkillCategory } from '@/lib/skills/categories'
import { getSiblingSkills, getSkill, getStaticSkillRefs } from '@/lib/skills/db'

type Params = { category: string; slug: string }

/**
 * The 6,000 most-installed skills are statically pre-rendered
 * (`SKILLS_STATIC_PAGE_LIMIT` in lib/skills/db.ts); the other 4,000 served
 * skills render on their first request and are then cached for 30 days
 * (`cacheLife('skillsRegistry')`) — ordinary on-demand ISR, the path this
 * route used before 2026-09-17, and what `dynamicParams` (true, since Next
 * rejects `false` alongside `cacheComponents`) already gives a slug outside
 * the pre-rendered set.
 *
 * Why a split and not all 10,000: a pre-rendered page is served from the
 * CDN with no ISR read at all, so the ideal is everything static — and
 * 2026-09-17 did exactly that. The first production build of it stalled on
 * ~20,000 live Supabase calls and was killed at Vercel's 45-minute limit;
 * fixing that (every `lib/skills/db` call below is answered from the
 * registry snapshot scripts/build.mjs writes before `next build` — zero
 * network during generation, see lib/skills/snapshot.ts) exposed the second
 * ceiling: Next's export retains ~250KB of native memory per `'use cache'`
 * page per worker, and 10,000 pages across the Standard machine's 3 workers
 * measured 8.05–8.3GB against its 8GB. 6,000 measures ~5.6GB. The
 * most-installed 6,000 carry the traffic; the on-demand tail is the pages
 * that see the least, so its ISR cost stays small by construction.
 *
 * `getSkill` throws on a snapshot miss (and on a Supabase error at request
 * time) instead of returning `undefined`, so `notFound()` below is reached
 * only for a slug that genuinely isn't in the registry — never for a real
 * skill a flaky query failed to load.
 */
export async function generateStaticParams(): Promise<Params[]> {
  const refs = await getStaticSkillRefs()
  return refs.map(({ category, slug }) => ({ category, slug }))
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
