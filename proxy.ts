import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { classifyRequester } from '@/lib/bot-classify'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'

/**
 * Flood protection for page routes — the one surface with zero rate limiting
 * until now. Every `/api/*` route already has its own purpose-tuned limiter
 * (see lib/rate-limit.ts's other callers: speed-test, ai-visibility,
 * cli/events, feedback, request, the MCP transport, revalidate), so this
 * file explicitly skips `api/` via its matcher rather than layering a second,
 * differently-tuned limit on top.
 *
 * Three tiers, not two: a scraper hammering the skills long tail to force
 * cache misses (see memory/vercel-cost-optimization.md — this is a real,
 * previously-observed cost driver, not a hypothetical) should be throttled
 * hardest of all, but this site actively wants search engines, AI/LLM
 * crawlers, and social-preview bots to crawl it freely — blocking Googlebot
 * or GPTBot to save a few cents would undercut the site's own SEO/AI-
 * visibility goals. `lib/bot-classify.ts` gives recognized crawlers a higher
 * ceiling regardless of path; unrecognized traffic gets `skillDetail` on the
 * one genuinely expensive route shape and `default` everywhere else. Neither
 * limit is a security boundary — see that file's own docblock for why a
 * spoofed User-Agent still hits a real, just higher, ceiling rather than
 * bypassing the limit entirely.
 *
 * `skillDetail` exists because `/skills/[category]/[slug]` only pre-renders
 * the top 15 skills per category at build time (see that page's own
 * generateStaticParams docblock) — every other skill page, ~96% of the
 * ~10,000-skill catalog, renders fresh (a real Supabase query) on its first
 * hit and only then caches for 30 days. `/prompts/[category]/[slug]`
 * doesn't need this: every one of its ~1,170 pages is pre-rendered, so a
 * crawl there is always a cache hit regardless of volume.
 *
 * Numbers are a documented starting point, not a measured optimum: retune
 * from real traffic (Vercel Observability, or the 429 rate itself) rather
 * than assuming these are exactly right.
 */
type Tier = ReturnType<typeof classifyRequester> | 'skillDetail'

const LIMITS: Record<Tier, { limit: number; windowMs: number }> = {
  // ~5 req/s sustained — generous for a legitimate crawl burst, still a
  // finite backstop against a scraper that spoofs a crawler's UA to
  // bypass the stricter tiers below.
  crawler: { limit: 300, windowMs: 60_000 },
  // ~2 req/s sustained. Deliberately generous for real browsing (fast
  // navigation, Next's own link-hover prefetching, several tabs) and for
  // shared/CGNAT IPs — common on Indian mobile networks, a real share of
  // this site's traffic — where many distinct real visitors can appear
  // to come from one address.
  default: { limit: 120, windowMs: 60_000 },
  // ~1 request every 2s. No real visitor reads 30 distinct skill pages in
  // a minute; a systematic crawl of the cold long tail does. This is the
  // one route shape where volume converts directly into Supabase queries
  // and fresh renders, so it gets the tightest ceiling in the file.
  skillDetail: { limit: 30, windowMs: 60_000 },
}

/** `/skills/<category>/<slug>` specifically — not `/skills` or
 * `/skills/<category>`, both of which are fully static/pre-rendered for
 * their whole (small, fixed) param space and carry none of this cost. */
const SKILL_DETAIL_PATH = /^\/skills\/[^/]+\/[^/]+\/?$/

/**
 * Known-safe automated visitors that must never be throttled here:
 * uptime/monitoring pings and Vercel's own internal prefetch/preview
 * requests carry no cost-abuse risk and blocking them would misreport the
 * site as down or break preview rendering.
 */
function isExempt(request: NextRequest): boolean {
  const ua = request.headers.get('user-agent') ?? ''
  return ua.includes('Vercel-Speed-Insights') || ua.includes('vercel-favicon')
}

export function proxy(request: NextRequest): NextResponse | undefined {
  if (isExempt(request)) return undefined

  const ip = clientIpFromHeaders(request.headers)
  const requesterTier = classifyRequester(request.headers.get('user-agent') ?? '')
  // A recognized crawler keeps its own (higher) ceiling on every path —
  // this site wants Googlebot/GPTBot crawling the skill long tail, that's
  // the whole point of it existing. Only unrecognized traffic gets bumped
  // to the stricter skillDetail tier on that one route shape.
  const tier: Tier =
    requesterTier === 'default' && SKILL_DETAIL_PATH.test(request.nextUrl.pathname)
      ? 'skillDetail'
      : requesterTier
  const { limit, windowMs } = LIMITS[tier]
  const gate = checkRateLimit(`page:${tier}:${ip}`, limit, windowMs)

  if (!gate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests.' },
      {
        status: 429,
        headers: {
          'retry-after': String(gate.retryAfterSeconds),
          'x-ratelimit-limit': String(limit),
          'x-ratelimit-remaining': '0',
        },
      },
    )
  }

  return undefined
}

export const config = {
  matcher: [
    // Everything except: _next internals, favicon, the api/ tree (already
    // self-rate-limited per-route), and any request for a literal static
    // asset by extension (images, fonts, styles, scripts, and the
    // cheap/CDN-cached text endpoints — robots.txt, sitemaps, llms.txt,
    // search-index.json — which don't need this layer on top of their own
    // long Cache-Control headers).
    '/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:ico|png|jpg|jpeg|svg|webp|avif|gif|woff2?|ttf|css|js|map|xml|txt|json)$).*)',
  ],
}
