import { buildSearchPayload } from '@/lib/search-payload'

/**
 * GET /search-index.json — the site-wide search index, as a static asset.
 *
 * Purpose
 *   Serves the tool + prompt search index on its own URL instead of embedding it
 *   in every page's HTML. See `lib/search-payload.ts` for the measurements that
 *   forced this: the index was 72.5% of the homepage's gzipped bytes and pushed
 *   `/prompts` to 2.6MB, arriving as one 1MB script the main thread had to parse
 *   in a single task.
 *
 * Why `"use cache"` on a helper rather than a route segment config
 *   The index is derived entirely from compile-time registries, so it is the same
 *   bytes for every visitor and should be computed once, not per request. The
 *   obvious spellings are both rejected outright under `cacheComponents: true` —
 *   `export const revalidate` and `export const dynamic = 'force-static'` each
 *   fail the build with "Route segment config ... is not compatible with
 *   nextConfig.cacheComponents. Please remove it." (both verified against a real
 *   build, not assumed). `"use cache"` is the Cache Components replacement.
 *
 *   It is applied to a helper returning the JSON STRING rather than to `GET`
 *   itself, because a `Response` is not serializable into the cache — caching the
 *   string and constructing a fresh `Response` per request keeps the expensive
 *   part (walking 1,236 registry entries) cached and the cheap part free.
 *
 * Caching
 *   The URL is unversioned, so it cannot be marked `immutable`: a deploy that
 *   adds prompts must be able to invalidate it. `s-maxage` lets the CDN serve it
 *   without re-running anything while `stale-while-revalidate` keeps a stale copy
 *   instant during refresh. `max-age=0` keeps browsers revalidating cheaply
 *   (a 304 is a few hundred bytes) rather than pinning a stale index locally.
 *
 * Failure modes
 *   None at request time. If the payload cannot be constructed the build fails
 *   loudly, which is correct — a silently empty index would disable search.
 */
async function payloadJson(): Promise<string> {
  'use cache'
  return JSON.stringify(buildSearchPayload())
}

export async function GET(): Promise<Response> {
  return new Response(await payloadJson(), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
