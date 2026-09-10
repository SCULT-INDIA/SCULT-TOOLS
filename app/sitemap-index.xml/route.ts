import { sitemapShards } from '@/app/sitemap'
import { absoluteUrl } from '@/lib/site'

/**
 * The sitemaps.org `<sitemapindex>` for this site, served here and rewritten
 * onto `/sitemap.xml` (see `rewrites()` in next.config.ts).
 *
 * Why it exists: `app/sitemap.ts` uses `generateSitemaps()`, and once a
 * sitemap is sharded Next serves ONLY the numbered shards —
 * `/sitemap/0.xml`, `/sitemap/1.xml`, … — with no bare `/sitemap.xml` of any
 * kind. That path returned a 404, which is a bad 404 to have:
 * `https://<host>/sitemap.xml` is the first URL Search Console, Bing
 * Webmaster Tools, every third-party SEO crawler and most humans try, and
 * none of them read `robots.txt` first to learn the real files live
 * elsewhere. An index is the protocol's own answer for a site whose URLs
 * exceed one file, so this serves one.
 *
 * Why not `app/sitemap.xml/route.ts` directly: Next reserves `/sitemap.xml`
 * for the `sitemap.ts` metadata convention and refuses to build with both
 * ("Conflicting route and metadata at /sitemap.xml"), even though the
 * sharded metadata route does not itself answer there. A `beforeFiles`
 * rewrite reaches this handler without either file claiming that path.
 *
 * `robots.txt` advertises the shards directly as well, so discovery never
 * depends on this route alone.
 */

/**
 * Caching is the `Cache-Control` header below plus `getSyncMeta`'s own
 * `'use cache'`/`cacheLife('hours')` — NOT a `revalidate` segment export,
 * which this app cannot use: `cacheComponents` is on, and Next rejects the
 * two together ("Route segment config \"revalidate\" is not compatible with
 * `nextConfig.cacheComponents`").
 */
export async function GET(): Promise<Response> {
  const shards = await sitemapShards()

  // Entries are built from integer ids and a known host, so there is no
  // untrusted text to XML-escape — keeping them structural rather than
  // interpolating caller-supplied strings is what preserves that.
  const body = shards
    .map(
      ({ id, lastModified }) =>
        '  <sitemap>\n' +
        `    <loc>${absoluteUrl(`/sitemap/${id}.xml`)}</loc>\n` +
        `    <lastmod>${lastModified}</lastmod>\n` +
        '  </sitemap>',
    )
    .join('\n')

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${body}\n` +
    '</sitemapindex>\n'

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
