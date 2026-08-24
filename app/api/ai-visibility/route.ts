import { lookup } from 'node:dns/promises'
import { NextResponse } from 'next/server'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import {
  type ApiError,
  buildReport,
  extractHeroImageUrl,
  isApiError,
  isIpLiteral,
  isPrivateAddress,
  parseRobots,
  type VisibilityReport,
  validateTargetUrl,
} from '@/lib/tools/ai-visibility-checker/logic'

/**
 * GET /api/ai-visibility?url=<target>
 *
 * Purpose
 *   Server-side fetcher for the AI visibility checker. Browsers cannot read
 *   other sites' robots.txt (CORS), so this handler fetches robots.txt,
 *   llms.txt, the homepage, and (best-effort) the page's own og:image on the
 *   visitor's behalf, hands the raw text to the pure analyzer in logic.ts,
 *   and returns the typed report.
 *
 * Security (SSRF)
 *   Every URL — including every redirect hop, and including the hero-image
 *   URL extracted from the target's own HTML — is re-validated: http/https
 *   only, no credentials, no localhost/.local/.internal, and the hostname is
 *   resolved with dns.lookup and rejected when ANY resulting address is
 *   private, loopback, link-local or an IPv4-mapped private IPv6 address.
 *   Requests time out after 10s, follow at most 3 manual redirects, and the
 *   body is read through a reader loop capped at 2 MB (1.5 MB for the image).
 *
 * Failure modes
 *   400 invalid-url / private-address, 502 unreachable, 502 blocked (the
 *   target answered 401/403/451 to our honest user-agent). Nothing here
 *   throws to the client — every path returns typed JSON.
 *
 * Cost
 *   All outbound fetches carry `next: { revalidate: 21600 }`, so repeat
 *   checks of the same site within 6 hours are served from the fetch cache.
 */

const USER_AGENT = 'ScultToolsBot/1.0 (+https://tools.scult.in)'
const TIMEOUT_MS = 10_000
const MAX_REDIRECTS = 3
const MAX_BODY_BYTES = 2 * 1024 * 1024
/** Tighter cap for the hero-image fetch — this becomes a base64 data: URI
 * embedded in the JSON response, React state, AND the PDF, so it stays
 * well under the text/HTML cap above even though OG images can legally be
 * a few MB. */
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024
const ALLOWED_IMAGE_CONTENT_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
const REVALIDATE_SECONDS = 21_600 // 6 hours

/** Each check can fire up to 5 outbound fetches against a THIRD PARTY's
 * server on the visitor's behalf — more conservative than the speed test,
 * which only ever calls Google. See lib/rate-limit.ts. */
const RATE_LIMIT_MAX = 6
const RATE_LIMIT_WINDOW_MS = 60_000

interface FetchOutcome {
  readonly ok: boolean
  readonly status: number
  readonly body: string
  readonly bytes: number
  readonly finalUrl: string
  readonly xRobotsTag?: string
  readonly contentType?: string
  /** Raw bytes alongside the UTF-8-decoded `body` above — binary responses
   * (the hero image) read this instead, since decoding image bytes as text
   * would corrupt them. */
  readonly rawBytes?: Uint8Array
  /** Set instead of the above when the fetch could not complete safely. */
  readonly failure?: 'invalid' | 'private' | 'unreachable'
}

const FAILED = (failure: 'invalid' | 'private' | 'unreachable'): FetchOutcome => ({
  ok: false,
  status: 0,
  body: '',
  bytes: 0,
  finalUrl: '',
  failure,
})

/** Rejects hostnames that resolve (even partially) to private address space. */
async function hostResolvesPublic(hostname: string): Promise<boolean> {
  if (isIpLiteral(hostname)) return !isPrivateAddress(hostname)
  try {
    const addresses = await lookup(hostname, { all: true })
    if (addresses.length === 0) return false
    return addresses.every((a) => !isPrivateAddress(a.address))
  } catch {
    return false
  }
}

/** Reads a response body through a reader loop, hard-capped at `capBytes`. */
async function readCapped(
  res: Response,
  capBytes: number,
): Promise<{ text: string; bytes: number; rawBytes: Uint8Array }> {
  const reader = res.body?.getReader()
  if (reader === undefined) return { text: '', bytes: 0, rawBytes: new Uint8Array(0) }
  const chunks: Uint8Array[] = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    if (value === undefined) continue
    received += value.byteLength
    if (received > capBytes) {
      const keep = value.byteLength - (received - capBytes)
      chunks.push(value.subarray(0, keep))
      received = capBytes
      await reader.cancel().catch(() => undefined)
      break
    }
    chunks.push(value)
  }
  const merged = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.byteLength
  }
  return {
    text: new TextDecoder('utf-8', { fatal: false }).decode(merged),
    bytes: received,
    rawBytes: merged,
  }
}

/**
 * Fetches a URL with the full SSRF gate: validation + DNS check before the
 * first request and again on every redirect hop, manual redirects capped at
 * 3, 10s timeout, body capped at `capBytes` (defaults to the 2 MB text cap;
 * the hero-image fetch passes a tighter one).
 */
async function safeFetch(startUrl: string, capBytes: number = MAX_BODY_BYTES): Promise<FetchOutcome> {
  let current = startUrl
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const validation = validateTargetUrl(current)
    if (validation.url === undefined || validation.hostname === undefined) {
      return FAILED('invalid')
    }
    if (!(await hostResolvesPublic(validation.hostname))) return FAILED('private')

    let res: Response
    try {
      res = await fetch(validation.url, {
        headers: {
          'user-agent': USER_AGENT,
          accept: 'text/html,application/xhtml+xml,text/plain,*/*;q=0.8',
        },
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        next: { revalidate: REVALIDATE_SECONDS },
      })
    } catch {
      return FAILED('unreachable')
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location')
      // Drain/cancel the redirect body so the connection can be reused.
      await res.body?.cancel().catch(() => undefined)
      if (location === null) {
        return {
          ok: false,
          status: res.status,
          body: '',
          bytes: 0,
          finalUrl: validation.url,
        }
      }
      try {
        current = new URL(location, validation.url).toString()
      } catch {
        return FAILED('unreachable')
      }
      continue // next hop re-validates
    }

    const { text, bytes, rawBytes } = await readCapped(res, capBytes)
    const xRobotsTag = res.headers.get('x-robots-tag')
    const contentType = res.headers.get('content-type')
    return {
      ok: res.ok,
      status: res.status,
      body: text,
      bytes,
      rawBytes,
      finalUrl: validation.url,
      ...(xRobotsTag !== null ? { xRobotsTag } : {}),
      ...(contentType !== null ? { contentType } : {}),
    }
  }
  return FAILED('unreachable') // redirect loop
}

/**
 * Fetches the resolved hero-image URL through the exact same SSRF gate as
 * every other request this route makes (a `og:image`/`twitter:image` URL is
 * still attacker-influenced content from a third party's HTML), then
 * base64-encodes it into a `data:` URI so the client and the PDF can render
 * it without a second, CORS-exposed fetch of someone else's server.
 * Returns undefined on anything that isn't a clean 2xx of an allowed raster
 * image type — never throws, this is a "nice to have", not core to the report.
 */
async function fetchHeroImageDataUri(url: string): Promise<string | undefined> {
  const outcome = await safeFetch(url, MAX_IMAGE_BYTES)
  if (outcome.failure !== undefined || !outcome.ok || outcome.rawBytes === undefined) {
    return undefined
  }
  const contentType = outcome.contentType?.split(';')[0]?.trim().toLowerCase()
  if (contentType === undefined || !ALLOWED_IMAGE_CONTENT_TYPES.includes(contentType)) {
    return undefined
  }
  if (outcome.rawBytes.byteLength === 0) return undefined
  return `data:${contentType};base64,${Buffer.from(outcome.rawBytes).toString('base64')}`
}

function errorResponse(error: ApiError, httpStatus: number): NextResponse {
  return NextResponse.json(error, { status: httpStatus })
}

/**
 * The full check, independent of HTTP/rate-limiting concerns — shared by
 * this route's `GET` and the `check_ai_visibility` MCP tool
 * (`lib/mcp/register.ts`) so the SSRF-safe fetch orchestration has exactly
 * one implementation. Returns `ApiError` on any failure rather than
 * throwing, matching every other function in this file.
 */
export async function runAiVisibilityCheck(rawUrl: string): Promise<VisibilityReport | ApiError> {
  const validation = validateTargetUrl(rawUrl)
  if (validation.url === undefined || validation.hostname === undefined) {
    return { error: validation.error ?? 'Invalid URL.', code: 'invalid-url' }
  }

  // Homepage first — if the site itself is unreachable there is no report.
  // Timed for the "Website insights" panel — response time is only ever
  // reported for a successful fetch, since every failure branch below
  // returns before `buildReport` is ever called.
  const homepageFetchStart = Date.now()
  const home = await safeFetch(validation.url)
  const homepageResponseMs = Date.now() - homepageFetchStart
  if (home.failure === 'invalid') {
    return { error: 'A redirect led to an invalid URL.', code: 'invalid-url' }
  }
  if (home.failure === 'private') {
    return {
      error: 'That hostname resolves to a private or internal address, which cannot be checked.',
      code: 'private-address',
    }
  }
  if (home.failure === 'unreachable') {
    return {
      error: 'The site did not respond within 10 seconds (or redirected more than 3 times).',
      code: 'unreachable',
    }
  }
  if (!home.ok) {
    const blocked = home.status === 401 || home.status === 403 || home.status === 451
    return {
      error: blocked
        ? `The site answered HTTP ${home.status} to our checker.`
        : `The site answered HTTP ${home.status} instead of a page.`,
      code: blocked ? 'blocked' : 'unreachable',
      httpStatus: home.status,
    }
  }

  const origin = new URL(home.finalUrl).origin
  // Resolved (not yet fetched) here so its fetch can run alongside
  // robots.txt/llms.txt below rather than adding sequential latency after.
  const heroImageUrl = extractHeroImageUrl(home.body, home.finalUrl)
  const [robots, llms, heroImageDataUri] = await Promise.all([
    safeFetch(`${origin}/robots.txt`),
    safeFetch(`${origin}/llms.txt`),
    heroImageUrl !== undefined ? fetchHeroImageDataUri(heroImageUrl) : Promise.resolve(undefined),
  ])

  const robotsText = robots.failure === undefined && robots.ok ? robots.body : undefined

  // Only probe /sitemap.xml when robots.txt does not already declare one.
  let sitemapProbeStatus: number | undefined
  if (robotsText === undefined || parseRobots(robotsText).sitemaps.length === 0) {
    const probe = await safeFetch(`${origin}/sitemap.xml`)
    if (probe.failure === undefined) sitemapProbeStatus = probe.status
  }

  const report = buildReport({
    url: home.finalUrl,
    ...(robotsText !== undefined ? { robotsText } : {}),
    ...(llms.failure === undefined
      ? { llms: { status: llms.status, bytes: llms.bytes } }
      : {}),
    html: home.body,
    ...(home.xRobotsTag !== undefined ? { xRobotsTag: home.xRobotsTag } : {}),
    ...(sitemapProbeStatus !== undefined ? { sitemapProbeStatus } : {}),
    isHttps: home.finalUrl.startsWith('https://'),
    homepageResponseMs,
    homepageSizeBytes: home.bytes,
  })

  // `buildReport` only resolved the hero-image URL (pure/sync, no fetch) —
  // swap in the actual fetched-and-validated data: URI here, or clear the
  // field entirely if that fetch failed or wasn't a real image.
  return {
    ...report,
    pageInsights: { ...report.pageInsights, heroImageUrl: heroImageDataUri },
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  const clientIp = clientIpFromHeaders(request.headers)
  const rateLimit = checkRateLimit(
    `ai-visibility:${clientIp}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS,
  )
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        code: 'rate-limited' satisfies ApiError['code'],
        error: `Too many checks from this connection — wait ${rateLimit.retryAfterSeconds}s and try again.`,
      },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

  const rawUrl = new URL(request.url).searchParams.get('url') ?? ''
  const result = await runAiVisibilityCheck(rawUrl)
  if (isApiError(result)) {
    const status =
      result.code === 'invalid-url' || result.code === 'private-address'
        ? 400
        : result.code === 'blocked'
          ? 502
          : 502
    return errorResponse(result, status)
  }

  return NextResponse.json(result, {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=21600' },
  })
}
