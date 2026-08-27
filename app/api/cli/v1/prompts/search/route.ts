import { searchPrompts } from '@/lib/cli/prompt-search'
import { cliJson, withCliTracking } from '@/lib/cli/track'
import { getPromptCategory } from '@/lib/prompts/categories'

/**
 * GET /api/cli/v1/prompts/search?q=<query>&category=<slug>&limit=<n>
 *
 * Keyword search over the prompt registry for the Scult CLI — same scoring
 * as the MCP server's `search_prompts` tool (one shared implementation in
 * lib/cli/prompt-search.ts). Public, GET-only, rate-limited and measured by
 * withCliTracking.
 */
export const GET = withCliTracking('prompts_search', (request) => {
  const url = new URL(request.url)
  const q = (url.searchParams.get('q') ?? '').slice(0, 200)
  const categoryParam = url.searchParams.get('category') ?? undefined
  const limitRaw = Number(url.searchParams.get('limit') ?? 10)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(1, limitRaw), 50) : 10

  if (q.trim() === '') {
    return cliJson({ error: 'q is required.' }, 400)
  }
  const category = categoryParam?.slice(0, 100)
  if (category !== undefined && getPromptCategory(category) === undefined) {
    return cliJson({ error: `Unknown prompt category "${category}".` }, 404)
  }

  return cliJson({ results: searchPrompts(q, category, limit) })
})
