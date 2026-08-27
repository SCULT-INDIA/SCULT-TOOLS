import { cliJson, withCliTracking } from '@/lib/cli/track'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import { searchSkills } from '@/lib/skills/db'
import type { SkillCategorySlug } from '@/lib/skills/types'

/**
 * GET /api/cli/v1/skills/search?q=<query>&category=<slug>&limit=<n>
 *
 * Keyword search over the Skills Library (Supabase-backed, same
 * `searchSkills` the site and MCP use). Compact rows — the CLI follows up
 * with /skills/<slug> for the full body.
 */
export const GET = withCliTracking('skills_search', async (request) => {
  const url = new URL(request.url)
  const q = (url.searchParams.get('q') ?? '').slice(0, 100)
  const categoryParam = url.searchParams.get('category') ?? undefined
  const limitRaw = Number(url.searchParams.get('limit') ?? 10)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(1, limitRaw), 50) : 10

  if (q.trim() === '') {
    return cliJson({ error: 'q is required.' }, 400)
  }
  let category: SkillCategorySlug | undefined
  if (categoryParam !== undefined) {
    const match = SKILL_CATEGORIES.find((c) => c.slug === categoryParam)
    if (!match)
      return cliJson({ error: `Unknown skill category "${categoryParam}".` }, 404)
    category = match.slug
  }

  const skills = await searchSkills(q, category, limit)
  return cliJson({
    results: skills.map((s) => ({
      slug: s.slug,
      name: s.name,
      description: s.description,
      category: s.category,
      installs: s.installs,
      source: `${s.sourceOwner}/${s.sourceRepo}`,
    })),
  })
})
