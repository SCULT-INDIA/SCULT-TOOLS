import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { classifyRequester } from '@/lib/bot-classify'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'

/**
 * Flood protection for page routes — the one surface with zero rate limiting
 * until now. Every `/api/*` route already has its own purpose-tuned limiter
 * (see lib/rate-limit.ts's other callers: speed-test, ai-visibility,
 * cli/events, feedback, request, the MCP transport), so this file
 * explicitly skips `api/` via its matcher rather than layering a second,
 * differently-tuned limit on top.
 *
 * Two tiers: this site actively wants search engines, AI/LLM crawlers, and
 * social-preview bots to crawl it freely — blocking Googlebot or GPTBot to
 * save a few cents would undercut the site's own SEO/AI-visibility goals —
 * so `lib/bot-classify.ts`'s recognized crawlers get a higher ceiling than
 * everything else. Neither limit is a security boundary — see that file's
 * own docblock for why a spoofed User-Agent still hits a real, just higher,
 * ceiling rather than bypassing the limit entirely; Vercel's own Bot
 * Protection (Firewall → Bot Management, set to Challenge) is the real
 * boundary against automated/non-browser traffic, ahead of this layer.
 *
 * There used to be a third, stricter tier for `/skills/[category]/[slug]`:
 * only the top 15 skills per category were pre-rendered at build time, so a
 * scraper walking the long tail forced a real Supabase query per page.
 * 2026-09-17: every served skill (all ~10,000) is now statically
 * pre-rendered (see that route's own docblock), so a skill page costs
 * exactly what a prompt or blog page costs — a static file off the CDN
 * edge, regardless of visit volume. The dedicated tier no longer protected
 * against anything real, so it was removed rather than kept as a stricter
 * limit with no reason behind it.
 *
 * Numbers are a documented starting point, not a measured optimum: retune
 * from real traffic (Vercel Observability, or the 429 rate itself) rather
 * than assuming these are exactly right.
 */
type Tier = ReturnType<typeof classifyRequester>

const LIMITS: Record<Tier, { limit: number; windowMs: number }> = {
  // ~5 req/s sustained — generous for a legitimate crawl burst, still a
  // finite backstop against a scraper that spoofs a crawler's UA to
  // bypass the stricter default tier below.
  crawler: { limit: 300, windowMs: 60_000 },
  // ~2 req/s sustained. Deliberately generous for real browsing (fast
  // navigation, Next's own link-hover prefetching, several tabs) and for
  // shared/CGNAT IPs — common on Indian mobile networks, a real share of
  // this site's traffic — where many distinct real visitors can appear
  // to come from one address.
  default: { limit: 120, windowMs: 60_000 },
}

/**
 * 2026-09-18: local attack-simulation testing (rotating a fake IP on every
 * request, real skill/prompt/blog paths, one identical User-Agent) confirmed
 * the per-IP limits above do nothing against that specific pattern — by
 * construction, a limiter keyed on IP can only ever bound how many requests
 * ONE IP makes. That isn't a bug in `checkRateLimit`; it's the documented,
 * inherent ceiling of any IP-keyed limiter (see lib/rate-limit.ts's own
 * header). It's also the exact shape of the incident that Vercel's Bot
 * Protection (Firewall → Bot Management, set to Challenge) was turned on to
 * stop — that layer runs at the edge, before a request reaches this code,
 * using signals (TLS/HTTP fingerprint) a spoofed IP or UA can't fake, and
 * stays the real defense against a determined rotating-IP scraper.
 *
 * This is a second, independent backstop underneath that: a single shared
 * counter per tier, keyed the same for every request regardless of IP, so
 * no amount of IP rotation increases the budget. It exists for the case
 * Bot Protection is ever disabled, misconfigured, or bypassed — not as the
 * primary defense. The numbers are set well above anything this site's real
 * traffic has ever shown (Studio's own dashboards: double-digit sessions in
 * a normal window) specifically so a genuine traffic spike (a viral share,
 * a good review) never trips it; only a sustained flood approaching
 * thousands of requests a minute would. Like the per-IP buckets, this is
 * per-instance, not fleet-wide (lib/rate-limit.ts's own limitation) — on
 * Fluid Compute with several concurrent instances the real ceiling is this
 * number times however many instances are warm, not a hard global cap.
 */
const GLOBAL_LIMITS: Record<Tier, { limit: number; windowMs: number }> = {
  crawler: { limit: 3000, windowMs: 60_000 },
  default: { limit: 1000, windowMs: 60_000 },
}

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
  const tier = classifyRequester(request.headers.get('user-agent') ?? '')

  const { limit: globalLimit, windowMs: globalWindowMs } = GLOBAL_LIMITS[tier]
  const globalGate = checkRateLimit(`page:${tier}:global`, globalLimit, globalWindowMs)
  if (!globalGate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests.' },
      {
        status: 429,
        headers: {
          'retry-after': String(globalGate.retryAfterSeconds),
          'x-ratelimit-limit': String(globalLimit),
          'x-ratelimit-remaining': '0',
        },
      },
    )
  }

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
