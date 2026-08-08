import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'
import { AI_BOTS } from '@/lib/tools/ai-visibility-checker/logic'

/**
 * `Allow: /` under `User-agent: *` already permits every crawler, AI or
 * otherwise, by default — so the explicit per-bot groups below are not
 * functionally necessary. They exist anyway, and it is a deliberate choice:
 *
 *   1. `AI_BOTS` (lib/tools/ai-visibility-checker/logic.ts) is the exact roster
 *      our own AI Visibility Checker audits other sites against. Naming every
 *      one of them here — rather than leaning on the wildcard — is this site
 *      practicing its own GEO/AEO advice: an explicit `Allow` reads as intent,
 *      not silence a bot has to interpret as permission. It is also what makes
 *      our own tool report every one of these crawlers as "allowed via a group
 *      naming this bot" rather than "allowed by default", which is a better
 *      answer for a GEO/AEO product to give about its own site.
 *   2. Importing `AI_BOTS` rather than retyping the ten names keeps this file
 *      and the checker's roster from ever drifting apart.
 *
 * `/api/` carries no indexable content; `/search` is noindex, follow (see
 * app/layout.tsx's robots metadata for the page-level directive — pre-declared
 * here even though the route does not exist yet).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search'],
      },
      ...AI_BOTS.map((bot) => ({
        userAgent: bot.name,
        allow: '/',
      })),
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
