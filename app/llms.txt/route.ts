import { buildLlmsTxt } from '@/lib/seo/llms'

/**
 * llms.txt — https://llmstxt.org. See `lib/seo/llms.ts` for how this is
 * assembled; kept out of this file because a Next.js Route Handler may only
 * export HTTP method handlers.
 */
export async function GET(): Promise<Response> {
  return new Response(await buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // Registry-derived and rebuilt at deploy time — safe to cache for a day.
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
