import type { MetadataRoute } from 'next'
import { sitemapShards } from '@/app/sitemap'
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
 * here even though the route does not exist yet); `/admin` is the internal
 * publishing tool and `/admin-preview` is its draft-preview route (both
 * also set a page-level noindex of their own, so a crawler that ignores
 * this file still won't index them, but there's no reason to invite the
 * crawl attempt at all).
 */
/**
 * SEO / backlink-intelligence scrapers, turned away by name (2026-09-16).
 * They crawl every one of the 10,000 skill pages as eagerly as Googlebot
 * does, but what they build is their own paid index — none of this site's
 * search ranking or AI-answer visibility comes from them. On Vercel every
 * first hit on a not-yet-cached page is a paid render, and the Observability
 * data showed exactly that shape: ~3,500 distinct skill URLs hit in 12 hours
 * with under one read each — crawlers sweeping the long tail once, never
 * to return. Search engines and every AI crawler stay fully allowed; this
 * is the one class of bot where "no" costs the site nothing.
 *
 * Well-behaved ones honour this. The rest are `proxy.ts`'s rate limiter's
 * problem — this file is the polite request, not the enforcement.
 *
 * Deliberately NOT here: Bytespider (ByteDance) is in `AI_BOTS` and
 * therefore explicitly allowed below; disallowing it here would contradict
 * the roster this site's own AI Visibility Checker holds other sites to.
 */
const SEO_SCRAPER_BOTS = [
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'BLEXBot',
  'DataForSeoBot',
  'PetalBot',
  'serpstatbot',
  'Barkrowler',
  'MegaIndex.ru',
  'ZoominfoBot',
  'SeekportBot',
] as const

export default async function robots(): Promise<MetadataRoute.Robots> {
  // `generateSitemaps()` in app/sitemap.ts shards the sitemap once the
  // Skills Library needs more than one file (50,000 URLs each), which makes
  // the real served URLs /sitemap/0.xml, /sitemap/1.xml, … — so a single
  // hardcoded path here would advertise a file that doesn't exist.
  //
  // The index at /sitemap.xml (app/sitemap-index.xml/route.ts, rewritten
  // there) goes first as the conventional entry point, then every shard
  // individually: a
  // crawler that follows the index and one that only reads robots.txt both
  // end up with the complete set, and neither depends on the other route.
  // The shard list comes from `sitemapShards()` rather than being recomputed
  // here, so robots.txt cannot advertise a shard that isn't served.
  const sitemapUrls = [
    absoluteUrl('/sitemap.xml'),
    ...(await sitemapShards()).map(({ id }) => absoluteUrl(`/sitemap/${id}.xml`)),
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search', '/admin', '/admin-preview'],
        // Honoured by Bing, Yandex and most others (Google ignores it, and
        // every AI crawler has its own group below, which this doesn't
        // touch). At one request per 10s, a full pass over the 10,000 skill
        // pages takes about a day — fine for a frozen library, and it stops
        // a single well-behaved crawler from turning a sweep into a burst of
        // paid renders.
        crawlDelay: 10,
      },
      ...AI_BOTS.map((bot) => ({
        userAgent: bot.name,
        allow: '/',
      })),
      ...SEO_SCRAPER_BOTS.map((name) => ({
        userAgent: name,
        disallow: '/',
      })),
    ],
    sitemap: sitemapUrls,
    host: absoluteUrl('/'),
  }
}
