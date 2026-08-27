import { cliJson, withCliTracking } from '@/lib/cli/track'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import { getAllCategoryCounts, getTotalSkillCount } from '@/lib/skills/db'

/**
 * GET /api/cli/v1/skills/categories
 *
 * Every populated Skills Library category with its live count — empty
 * categories are omitted, matching the site's own no-empty-pages rule.
 */
export const GET = withCliTracking('skills_categories', async () => {
  const [counts, total] = await Promise.all([
    getAllCategoryCounts(),
    getTotalSkillCount(),
  ])
  return cliJson({
    total,
    categories: SKILL_CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      blurb: c.blurb,
      count: counts[c.slug] ?? 0,
    })).filter((c) => c.count > 0),
  })
})
