import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { classifyRequest, type RequesterTier } from '@/lib/bot-classify'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'

/**
 * Flood protection for page routes. Every `/api/*` route already has its
 * own purpose-tuned limiter (see lib/rate-limit.ts's other callers:
 * speed-test, ai-visibility, cli/events, feedback, request, the MCP
 * transport), so this file explicitly skips `api/` via its matcher rather
 * than layering a second, differently-tuned limit on top.
 *
 * Order of checks, cheapest first:
 *
 *   1. Method: page routes are read-only. Anything but GET/HEAD is a 405
 *      before any bucket is touched. (No Server Actions exist in this app —
 *      the only `'use server'` strings in the repo are prompt copy.)
 *   2. Probe paths: /.env, /wp-login.php, /.git/…, anything *.php — the
 *      vocabulary of vulnerability scanners, none of which exists on a
 *      Next.js site. Answered with an empty 404 straight from the edge, so a
 *      scanner never reaches the not-found page render and never consumes a
 *      real visitor's bucket on a shared (CGNAT) IP.
 *   3. Tier (lib/bot-classify.ts: blocked / crawler / suspect / default),
 *      then two token buckets for that tier: one GLOBAL (keyed identically
 *      for every request, so rotating IPs buys nothing) and one per IP.
 *
 * Why two buckets per tier: 2026-09-18 local attack simulation confirmed a
 * per-IP limiter alone is useless against a scraper that fakes a new IP on
 * every request — each fake IP got its own fresh budget. The global bucket
 * is what puts a ceiling on that, and the tiering is what lets it be tight
 * for automation without touching humans: a real browser lands in
 * `default`, whose global ceiling sits far above any traffic this site has
 * ever seen; a script wearing a browser UA lands in `suspect`, whose global
 * ceiling admits a few pages a minute site-wide. `burst` (the 4th argument
 * to checkRateLimit) is what keeps the first few seconds of a flood from
 * getting a full minute's allowance up front.
 *
 * None of this is a security boundary. A headless browser that sends every
 * header a real one sends, keeps its real platform hint, and rotates IPs is
 * indistinguishable from a human at the HTTP layer and lands in `default`
 * — the residual that Vercel's Bot Protection (Firewall → Bot Management,
 * set to Challenge) catches at the edge via TLS/HTTP fingerprinting, before
 * a request reaches this code. This file raises the floor under that layer.
 *
 * Every limit here is per-instance (lib/rate-limit.ts's own documented
 * limitation) — on Fluid Compute with several warm instances the real
 * fleet-wide ceiling is the number below times the instance count.
 *
 * Numbers are a documented starting point, not a measured optimum: retune
 * from real traffic (Vercel Observability, or the 429 rate itself) rather
 * than assuming these are exactly right. The one to watch is
 * `GLOBAL_LIMITS.default` — it's the only ceiling a legitimate traffic
 * spike (a viral share) could ever reach; raise it before lowering anything.
 */

interface Limit {
  limit: number
  windowMs: number
  /** Up-front capacity; defaults to `limit` (see checkRateLimit). */
  burst?: number
}

/** Per IP (or per whatever `clientIpFromHeaders` resolves to). */
const LIMITS: Record<RequesterTier, Limit> = {
  // Recognized search/AI/social crawlers. ~1.6 req/s sustained per IP —
  // Googlebot crawls from many IPs, so this is per-worker, not per-crawler.
  crawler: { limit: 100, windowMs: 60_000 },
  // A coherent browser. 1 page/s sustained is far past any human's pace,
  // with room for Next's link prefetching and several open tabs. Shared
  // CGNAT IPs (common on Indian mobile networks) are the case this could
  // pinch: many real visitors behind one address — watch the 429 rate.
  default: { limit: 60, windowMs: 60_000 },
  // Not a recognized crawler and not a coherent browser. Admits an uptime
  // monitor's once-a-minute ping; not a crawl.
  suspect: { limit: 5, windowMs: 60_000, burst: 3 },
  // Self-declared automation (curl, python-requests, HeadlessChrome, …) or
  // no UA at all. Enough for an owner's `curl -I` sanity check; nothing more.
  blocked: { limit: 3, windowMs: 60_000, burst: 2 },
}

/** Site-wide, one bucket per tier regardless of IP. */
const GLOBAL_LIMITS: Record<RequesterTier, Limit> = {
  crawler: { limit: 600, windowMs: 60_000, burst: 300 },
  // THE knob a real traffic spike could hit. Set well above anything this
  // site's own dashboards have shown (double-digit sessions in a normal
  // window): a viral moment has headroom; a coherent-looking flood of
  // thousands a minute does not.
  default: { limit: 600, windowMs: 60_000, burst: 400 },
  // Site-wide budget for everything automated-but-unrecognized. The burst
  // of 8 is what a rotating-IP scraper actually gets before the wall.
  suspect: { limit: 20, windowMs: 60_000, burst: 8 },
  blocked: { limit: 10, windowMs: 60_000, burst: 4 },
}

/**
 * Paths that only a vulnerability scanner asks a Next.js site for. Anchored
 * to the path root for the directory/file names (a skill slug could
 * legitimately contain "phpinfo"), unanchored for the server-side file
 * extensions (slugs are [a-z0-9-] and never carry a dot).
 */
const PROBE_PATH =
  /^\/(?:wp-admin|wp-login|wp-content|wp-includes|xmlrpc|\.env|\.git|\.svn|\.htaccess|\.htpasswd|\.aws|\.ssh|\.DS_Store|phpmyadmin|phpinfo|cgi-bin|vendor|server-status|actuator|_ignition|telescope|web\.config)(?:$|[/.?])|\.(?:php|asp|aspx|jsp|cgi)(?:$|\?)/i

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

function tooManyRequests(limit: number, retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests.' },
    {
      status: 429,
      headers: {
        'retry-after': String(retryAfterSeconds),
        'x-ratelimit-limit': String(limit),
        'x-ratelimit-remaining': '0',
      },
    },
  )
}

export function proxy(request: NextRequest): NextResponse | undefined {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new NextResponse(null, { status: 405, headers: { allow: 'GET, HEAD' } })
  }
  if (PROBE_PATH.test(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 })
  }
  if (isExempt(request)) return undefined

  const tier = classifyRequest(request.headers)

  const global = GLOBAL_LIMITS[tier]
  const globalGate = checkRateLimit(
    `page:${tier}:global`,
    global.limit,
    global.windowMs,
    global.burst,
  )
  if (!globalGate.allowed)
    return tooManyRequests(global.limit, globalGate.retryAfterSeconds)

  const ip = clientIpFromHeaders(request.headers)
  const perIp = LIMITS[tier]
  const gate = checkRateLimit(
    `page:${tier}:${ip}`,
    perIp.limit,
    perIp.windowMs,
    perIp.burst,
  )
  if (!gate.allowed) return tooManyRequests(perIp.limit, gate.retryAfterSeconds)

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
