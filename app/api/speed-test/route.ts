/**
 * GET /api/speed-test?url=...&strategy=mobile|desktop
 *
 * Purpose
 *   Server-side wrapper around Google's PageSpeed Insights v5 API. It exists
 *   for three reasons: the API key must never reach the client, repeat tests
 *   of the same URL should be cache hits instead of new 15-40s Lighthouse
 *   runs, and the raw PSI response is megabytes of Lighthouse JSON that gets
 *   trimmed here to the compact payload the UI renders.
 *
 *   The repeat-test cache is our own (see result-cache.ts), not Next's fetch
 *   data cache — PSI responses run 2-6 MB and Next's data cache silently
 *   refuses anything over 2MB, which used to make every real test both leak
 *   the API key into server logs and occasionally crash the request. See
 *   result-cache.ts's docblock for the full story.
 *
 * Inputs   `url` (the page to test), `strategy` (mobile | desktop).
 * Outputs  200 with a `SpeedTestPayload`, or a clean JSON error
 *          `{ code, error }` — never a raw upstream error body.
 * Failure  invalid/blocked URLs -> 400, quota -> 429, unreachable page -> 502,
 *          PSI timeout -> 504, anything else upstream -> 502.
 *
 * SSRF posture: PSI performs the actual page fetch from Google's
 * infrastructure, not from this server — but this endpoint still refuses to
 * proxy garbage. URLs are validated by the same pure rules the client uses
 * (scheme, credentials, private hostnames, private IP literals) and DNS names
 * are resolved so a public-looking name pointing into private space is
 * rejected too.
 */

import { lookup } from 'node:dns/promises'
import { NextResponse } from 'next/server'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import {
  isIpLiteralHost,
  isPrivateAddress,
  parsePsiResponse,
  type SpeedTestErrorCode,
  type SpeedTestPayload,
  type Strategy,
  validateTestUrl,
} from '@/lib/tools/website-speed-test/logic'
import { createResultCache } from '@/lib/tools/website-speed-test/result-cache'

/** Lighthouse alone routinely takes 15-40s; give PSI a minute before giving up. */
export const maxDuration = 60

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
const PSI_TIMEOUT_MS = 60_000
/** PSI responses run 2-6 MB; anything past this is not a PSI response. */
const MAX_RESPONSE_BYTES = 15_000_000
/** 6 hours — a page's performance profile does not change minute to minute. */
const REVALIDATE_SECONDS = 21_600

/** Module-scoped: lives for this warm instance's lifetime, same as the rate limiter. */
const resultCache = createResultCache()

/** A real Lighthouse run costs Google's free quota and ~15-40s of our own
 * function time — 6 runs/minute per IP is generous for a human clicking
 * "test again" and stingy for a script. See lib/rate-limit.ts. */
const RATE_LIMIT_MAX = 6
const RATE_LIMIT_WINDOW_MS = 60_000

function errorJson(
  code: SpeedTestErrorCode,
  error: string,
  status: number,
): NextResponse {
  return NextResponse.json({ code, error }, { status })
}

/** Best-effort extraction of `error.message` from a PSI error body. */
function upstreamMessage(body: unknown): string {
  if (typeof body !== 'object' || body === null) return ''
  const err = (body as Record<string, unknown>).error
  if (typeof err !== 'object' || err === null) return ''
  const message = (err as Record<string, unknown>).message
  return typeof message === 'string' ? message : ''
}

export interface SpeedTestApiError {
  readonly code: SpeedTestErrorCode
  readonly error: string
}

export function isSpeedTestApiError(value: unknown): value is SpeedTestApiError {
  return (
    typeof value === 'object' && value !== null && 'code' in value && 'error' in value
  )
}

/**
 * The full test, independent of HTTP/rate-limiting concerns — shared by
 * this route's `GET` and the `test_website_speed` MCP tool
 * (`lib/mcp/register.ts`) so the SSRF-safe validation and PSI call have
 * exactly one implementation.
 */
export async function runSpeedTest(
  rawUrl: string,
  rawStrategy: string,
): Promise<SpeedTestPayload | SpeedTestApiError> {
  if (rawStrategy !== 'mobile' && rawStrategy !== 'desktop') {
    return { code: 'invalid-url', error: 'strategy must be "mobile" or "desktop".' }
  }
  const strategy: Strategy = rawStrategy

  const validated = validateTestUrl(rawUrl)
  if (validated.url === undefined) {
    return { code: 'blocked-url', error: validated.error ?? 'Enter a valid URL.' }
  }
  const targetUrl = validated.url

  // A DNS name can still point into private space; resolve and check. IP
  // literals were already judged by validateTestUrl, and bracketed IPv6
  // literals would make lookup() throw, so both are skipped here.
  const hostname = new URL(targetUrl).hostname
  if (!isIpLiteralHost(hostname)) {
    try {
      const addresses = await lookup(hostname, { all: true, verbatim: true })
      if (addresses.some((a) => isPrivateAddress(a.address))) {
        return {
          code: 'blocked-url',
          error:
            'That hostname resolves to a private network address, so it cannot be tested.',
        }
      }
    } catch {
      return {
        code: 'unreachable',
        error: 'That domain does not resolve. Check the spelling, then try again.',
      }
    }
  }

  const cached = resultCache.get(targetUrl, strategy)
  if (cached !== undefined) {
    return cached
  }

  const psiUrl = new URL(PSI_ENDPOINT)
  psiUrl.searchParams.set('url', targetUrl)
  psiUrl.searchParams.set('strategy', strategy)
  psiUrl.searchParams.set('category', 'PERFORMANCE')
  const apiKey = process.env.PSI_API_KEY
  if (apiKey !== undefined && apiKey !== '') {
    psiUrl.searchParams.set('key', apiKey)
  }

  let upstream: Response
  try {
    upstream = await fetch(psiUrl, {
      headers: {
        'User-Agent': 'ScultToolsBot/1.0 (+https://tools.scult.in)',
        Accept: 'application/json',
      },
      // googleapis.com never redirects this endpoint; anything else is wrong.
      redirect: 'error',
      signal: AbortSignal.timeout(PSI_TIMEOUT_MS),
      // Never let Next's fetch data cache touch this response: PSI bodies run
      // 2-6 MB, past the cache's 2MB ceiling, so asking it to cache this only
      // produced log-spammed failures (API key included) and crashes. Repeat
      // tests are served from resultCache below instead.
      cache: 'no-store',
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      return {
        code: 'timeout',
        error:
          'The test did not finish within 60 seconds. Slow or hanging pages can exceed the limit — try again.',
      }
    }
    return {
      code: 'upstream',
      error: 'Could not reach the PageSpeed service. Try again in a moment.',
    }
  }

  const contentLength = Number(upstream.headers.get('content-length') ?? '0')
  if (Number.isFinite(contentLength) && contentLength > MAX_RESPONSE_BYTES) {
    return { code: 'upstream', error: 'The PageSpeed response was too large to process.' }
  }
  const text = await upstream.text()
  if (text.length > MAX_RESPONSE_BYTES) {
    return { code: 'upstream', error: 'The PageSpeed response was too large to process.' }
  }

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return {
      code: 'upstream',
      error:
        'The PageSpeed service returned an unreadable response. Try again in a moment.',
    }
  }

  if (!upstream.ok) {
    const message = upstreamMessage(body)
    if (upstream.status === 429 || /quota|rate limit/i.test(message)) {
      return {
        code: 'quota',
        error:
          'The free testing quota is briefly exhausted. Wait a minute, then run the test again.',
      }
    }
    if (
      /FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|DNS_FAILURE|NOT_HTML|unreachable/i.test(
        message,
      )
    ) {
      return {
        code: 'unreachable',
        error:
          'PageSpeed could not load that page. Check it opens in your own browser and is not blocking crawlers.',
      }
    }
    if (upstream.status === 400) {
      return {
        code: 'invalid-url',
        error:
          'PageSpeed rejected that URL. Check it is a public web page, not a file or an intranet address.',
      }
    }
    return {
      code: 'upstream',
      error:
        'The PageSpeed service failed to run the test. Running it again usually works.',
    }
  }

  const parsed = parsePsiResponse(body, strategy)
  if (parsed.payload === undefined) {
    return {
      code: 'upstream',
      error: parsed.error ?? 'PageSpeed returned a response this tool could not read.',
    }
  }

  resultCache.set(targetUrl, strategy, parsed.payload, REVALIDATE_SECONDS * 1000)
  return parsed.payload
}

export async function GET(request: Request): Promise<NextResponse> {
  const clientIp = clientIpFromHeaders(request.headers)
  const rateLimit = checkRateLimit(
    `speed-test:${clientIp}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS,
  )
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        code: 'rate-limited' satisfies SpeedTestErrorCode,
        error: `Too many tests from this connection — wait ${rateLimit.retryAfterSeconds}s and try again.`,
      },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

  const { searchParams } = new URL(request.url)
  const result = await runSpeedTest(
    searchParams.get('url') ?? '',
    searchParams.get('strategy') ?? 'mobile',
  )

  if (isSpeedTestApiError(result)) {
    const status =
      result.code === 'timeout'
        ? 504
        : result.code === 'quota'
          ? 429
          : result.code === 'invalid-url' || result.code === 'blocked-url'
            ? 400
            : 502
    return errorJson(result.code, result.error, status)
  }

  return NextResponse.json(result, {
    headers: {
      // Let the CDN reuse a finished report too — same window as resultCache.
      'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=3600`,
    },
  })
}
