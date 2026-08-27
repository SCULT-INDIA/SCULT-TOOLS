import { cliJson, withCliTracking } from '@/lib/cli/track'
import { PROMPT_CATEGORIES, PROMPT_GROUPS } from '@/lib/prompts/categories'
import { getPromptsByCategory, PROMPTS } from '@/lib/prompts/registry'

/**
 * GET /api/cli/v1/prompts/categories
 *
 * Every populated Prompt Library category with its group and live count —
 * empty categories are omitted, matching the site's own no-empty-pages rule.
 */
export const GET = withCliTracking('prompts_categories', () => {
  const categories = PROMPT_CATEGORIES.map((c) => ({
    slug: c.slug,
    group: c.group,
    name: c.name,
    blurb: c.blurb,
    count: getPromptsByCategory(c.slug).length,
  })).filter((c) => c.count > 0)

  return cliJson({
    total: PROMPTS.length,
    groups: PROMPT_GROUPS.map((g) => ({ slug: g.slug, name: g.name })),
    categories,
  })
})
