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
    // The Uneed and SaaSHub directory badges (components/ui/UneedBadge.tsx,
    // components/ui/SaashubBadge.tsx) are the only remote images this site
    // renders — everything else is self-hosted.
    remotePatterns: [
      { protocol: 'https', hostname: 'www.uneed.best', pathname: '/EMBED3B.png' },
      {
        protocol: 'https',
        hostname: 'cdn-b.saashub.com',
        pathname: '/img/badges/approved-color.png',
      },
    ],
    /**
     * Default is 4 hours — still short enough for Lighthouse's "efficient
     * cache lifetimes" audit to flag it. Unlike the HTML Cache-Control
     * above, this carries no deploy-staleness risk: it's Vercel's own
     * on-demand image-optimization cache, a resized/reformatted copy of a
     * THIRD-PARTY image, revalidated against Uneed's origin on its own
     * schedule — nothing about it is tied to this site's own deploys.
     */
    minimumCacheTTL: 2678400, // 31 days
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
    ]
  },
}

export default nextConfig
