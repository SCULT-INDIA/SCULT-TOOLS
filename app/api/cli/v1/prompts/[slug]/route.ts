import { cliJson, withCliTracking } from '@/lib/cli/track'
import { getPromptCategory } from '@/lib/prompts/categories'
import { getPrompt } from '@/lib/prompts/registry'
import { absoluteUrl } from '@/lib/site'

/**
 * GET /api/cli/v1/prompts/<slug>
 *
 * One prompt in full — template text, variables, why-it-works, verification
 * stamps — for the Scult CLI. The slug comes from the URL path; Next.js
 * route params are read from the request URL directly so the handler can
 * stay a plain `(request) => Response` for withCliTracking.
 */
export const GET = withCliTracking('prompts_get', (request) => {
  const url = new URL(request.url)
  const slug = decodeURIComponent(url.pathname.split('/').pop() ?? '').slice(0, 200)
  const prompt = getPrompt(slug)
  if (prompt === undefined) {
    return cliJson({ error: `No prompt with slug "${slug}".` }, 404)
  }
  const category = getPromptCategory(prompt.category)
  return cliJson({
    prompt: {
      slug: prompt.slug,
      title: prompt.title,
      description: prompt.description,
      category: prompt.category,
      categoryName: category?.name ?? prompt.category,
      promptText: prompt.promptText,
      variables: prompt.variables,
      targetTools: prompt.targetTools,
      tags: prompt.tags,
      whyItWorks: prompt.whyItWorks,
      exampleOutput: prompt.exampleOutput,
      verifiedAgainst: prompt.verifiedAgainst,
      changelog: prompt.changelog,
      url: absoluteUrl(`/prompts/${prompt.category}/${prompt.slug}`),
    },
  })
})
