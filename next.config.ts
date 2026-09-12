import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Cache Components: static shells + dynamic islands (the Next 16 successor to
  // experimental.ppr / experimental.dynamicIO, both of which were removed).
  cacheComponents: true,

  /**
   * Hard byte cap on the default in-memory `'use cache'` store — this is the
   * actual fix for the production OOM crash loop seen 2026-09-11 on Railway
   * (repeated `FATAL ERROR: ... JavaScript heap out of memory` and bare
   * `Killed` restarts, roughly every 45min-2h, heap always topping out
   * around 470-483MB right before each crash).
   *
   * Root cause: `cacheComponents: true` makes `'use cache'` the caching
   * mechanism for this app (see lib/skills/db.ts's `getSkill`/
   * `getSkillsPage`/etc., each `cacheLife('hours')`), and per Next.js's own
   * docs and maintainers (github.com/vercel/next.js/discussions/88078),
   * the DEFAULT in-memory handler for `'use cache'` has NO size limit unless
   * `cacheMaxMemorySize` is set — it is "effectively unbounded, constrained
   * only by Node.js heap limits," which the same discussion names as
   * exactly the wrong fit for "caching millions of unique...entities."
   * That is precisely this app's shape: the skills table is a live,
   * ~600k-row registry (see lib/skills/db.ts's own docblock), and every
   * distinct (category, slug) skill page or (category, page) listing a
   * visitor or crawler hits gets its own cache entry — complete with the
   * full SKILL.md `body` text — that then sits in memory for up to the
   * `cacheLife('hours')` window with zero eviction pressure. On a
   * long-running `next start` process (not Vercel's managed, per-request
   * infra) that accumulation is permanent until either this limit or a
   * restart clears it, which is exactly why a manual Railway restart
   * "fixed" it: it zeroed the cache, not the underlying cause.
   *
   * 50MB matches the classic (pre-Cache-Components) fetch/ISR cache
   * handler's own documented default (nextjs.org/docs/app/guides/
   * self-hosting) — small enough to leave the observed ~480MB heap ceiling
   * almost entirely free for actual request handling and rendering, large
   * enough to still cache several thousand average skill entries for the
   * hot path. Past this cap, Next's built-in handler evicts
   * least-recently-used entries instead of growing further — a cache miss
   * and a fresh (fast) Supabase read, never a crash.
   */
  cacheMaxMemorySize: 50 * 1024 * 1024,

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

  async rewrites() {
    return {
      /**
       * `/sitemap.xml` is where every crawler, Search Console and SEO tool
       * looks first, but `app/sitemap.ts` uses `generateSitemaps()`, so Next
       * serves only the numbered shards (`/sitemap/0.xml`, …) and that path
       * 404s. `app/sitemap-index.xml/route.ts` serves the real
       * `<sitemapindex>`; this rewrite puts it at the conventional URL.
       *
       * `beforeFiles` because the metadata convention reserves
       * `/sitemap.xml` as a filesystem route — a normal (afterFiles) rewrite
       * would lose to that reservation and keep 404ing. A rewrite rather
       * than a redirect so the index is served at the canonical path itself,
       * with no hop for a crawler to follow.
       */
      beforeFiles: [{ source: '/sitemap.xml', destination: '/sitemap-index.xml' }],
      afterFiles: [],
      fallback: [],
    }
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
    /**
     * Content-Security-Policy — host-allowlist form, NOT nonce-based, and
     * that's a deliberate trade: a nonce must differ per response, which
     * forces every page dynamic and would throw away this site's ~2,800
     * statically prerendered pages (Cache Components). `'unsafe-inline'`
     * in script-src is the cost — inline injection isn't blocked — but the
     * allowlist still cuts off the main XSS payoff: exfiltration and
     * script-loading are pinned to 'self' plus the named analytics hosts,
     * and object/base/form/frame targets are locked down entirely.
     *
     * Every origin below is in use today (verified against the codebase):
     *   googletagmanager/google-analytics — GA4 (DeferredAnalyticsScripts)
     *   clarity.ms — Microsoft Clarity tag + recorder + ingest beacons
     *   studio.scult.in — SCULT Studio track.js + its beacons
     *   b.sf-syn.com / a.fsdn.com / sourceforge.net — SourceForge badge
     *   va.vercel-scripts.com — @vercel/analytics dev/preview script
     *   uneed.best / cdn-b.saashub.com — directory badges (next/image remotes)
     *   api.github.com — the header's star-count fetch
     *   bzrcdn.openai.com / bzr.openai.com — OpenAI Ads Measurement Pixel
     *     (DeferredAnalyticsScripts + lib/analytics.ts's trackCtaClick).
     *     bzrcdn hosts the SDK script; bzr is inferred as the client-side
     *     event-beacon host from the same domain pair OpenAI's own
     *     onboarding email uses for its server-side Conversions API
     *     (bzr.openai.com/v1/events) — verify against OpenAI's docs if a
     *     conversion silently fails to register.
     * Adding a new third-party script means adding its origin here, or the
     * browser will (correctly) refuse to load it.
     */
    // Dev-only: React development builds use eval() for debugging features
    // (and Next dev tooling relies on it too); production React never does,
    // so the directive stays strict where it matters.
    const scriptEval = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${scriptEval} https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://studio.scult.in https://b.sf-syn.com https://va.vercel-scripts.com https://bzrcdn.openai.com`,
      "style-src 'self' 'unsafe-inline'",
      // avatars.githubusercontent.com: every Skills Library card/detail
      // shows the publishing GitHub owner's real avatar as the skill's logo.
      "img-src 'self' data: blob: https://www.uneed.best https://cdn-b.saashub.com https://avatars.githubusercontent.com https://*.clarity.ms https://*.google-analytics.com https://www.googletagmanager.com https://a.fsdn.com https://sourceforge.net https://b.sf-syn.com",
      "font-src 'self'",
      "connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://*.clarity.ms https://studio.scult.in https://api.github.com https://bzrcdn.openai.com https://bzr.openai.com",
      'frame-src https://sourceforge.net https://b.sf-syn.com',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      // Client-side generators (QR, favicon, PDF export) build downloads
      // via blob: workers/URLs.
      "worker-src 'self' blob:",
      'upgrade-insecure-requests',
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          // 1 year, subdomains of tools.scult.in included (there are none,
          // which is exactly why includeSubDomains is safe to state).
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Redundant with frame-ancestors for modern browsers; kept for
          // the long tail that predates CSP2.
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
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
