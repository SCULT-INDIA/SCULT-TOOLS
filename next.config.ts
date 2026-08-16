import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Cache Components: static shells + dynamic islands (the Next 16 successor to
  // experimental.ppr / experimental.dynamicIO, both of which were removed).
  cacheComponents: true,

  env: {
    /**
     * The copyright year, resolved at BUILD time.
     *
     * Reading `new Date()` inside a Server Component is rejected under Cache
     * Components — correctly, because the value would be frozen into static HTML
     * and silently go stale. Config evaluation is ordinary Node at build time, so
     * this is the right place for it: every deploy bakes in the current year.
     */
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },

  // Faster cold starts across restarts in dev.
  experimental: {
    turbopackFileSystemCacheForDev: true,
    // The brand-icon barrel exports ~330 marks; the prompt library uses ~25.
    // Without this, every page importing BrandIcon pulls the whole set.
    optimizePackageImports: ['@lobehub/icons'],
  },

  images: {
    // Next 16 defaults qualities to [75]; we state it explicitly.
    qualities: [75],
    formats: ['image/avif', 'image/webp'],
    // The Uneed directory badge (components/ui/UneedBadge.tsx) is the one
    // remote image this site renders — everything else is self-hosted.
    remotePatterns: [
      { protocol: 'https', hostname: 'www.uneed.best', pathname: '/EMBED3B.png' },
    ],
  },

  async redirects() {
    return [
      {
        /**
         * The canonical URLs have no `/tools/` prefix — the subdomain already
         * says "tools", so the extra segment would spend crawl depth on every
         * page. This 301 exists so the obvious alternative shape can never
         * become a duplicate-content problem or a lost inbound link.
         */
        source: '/tools/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Fonts are immutable and content-hashed by next/font.
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        /**
         * HTML documents on this site render exclusively from build-time
         * registries (tools/prompts/blog/guides) — nothing changes between
         * deploys. Vercel's default per-route Cache-Control for a Next.js
         * page is short (`max-age=0, must-revalidate` plus an internal
         * few-minute Next.js stale window), so an edge region that hasn't
         * served a given route recently pays a real, synchronous
         * revalidation cost on the next request — the likely explanation
         * for PageSpeed's "Document request latency"/slow-TTFB finding,
         * since Google's crawler is unlikely to share a warm edge region
         * with this site's actual (India-concentrated) traffic.
         *
         * Deliberately NOT a long-lived `s-maxage` (e.g. a year): this repo
         * has no confirmed way to force-purge Vercel's edge cache on
         * deploy for a hand-set Cache-Control header (as opposed to
         * Next's own framework-managed cache keys, which Vercel is known to
         * invalidate automatically on every deploy) — a wrong assumption
         * there would mean stale content surviving a future deploy for as
         * long as the TTL, which is a far worse failure than today's
         * few-minutes staleness. `s-maxage=300` keeps the CDN-fresh window
         * identical to Next's own current default; `stale-while-revalidate`
         * is the actual fix — once that window passes, a cache miss now
         * serves the previous (still-correct) copy INSTANTLY while
         * refreshing in the background, rather than blocking the request on
         * a synchronous regeneration. `max-age=0` keeps end-user browsers
         * revalidating on every visit — this is a CDN-tier header only.
         */
        source: '/((?!api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
          },
        ],
      },
    ]
  },
}

export default nextConfig
