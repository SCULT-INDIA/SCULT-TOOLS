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
import {
  isIpLiteralHost,
  isPrivateAddress,
  parsePsiResponse,
  type SpeedTestErrorCode,
  type Strategy,
  validateTestUrl,
} from '@/lib/tools/website-speed-test/logic'

/** Lighthouse alone routinely takes 15-40s; give PSI a minute before giving up. */
export const maxDuration = 60

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
const PSI_TIMEOUT_MS = 60_000
/** PSI responses run 2-6 MB; anything past this is not a PSI response. */
const MAX_RESPONSE_BYTES = 15_000_000
/** 6 hours — a page's performance profile does not change minute to minute. */
const REVALIDATE_SECONDS = 21_600

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

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)

  const rawStrategy = searchParams.get('strategy') ?? 'mobile'
  if (rawStrategy !== 'mobile' && rawStrategy !== 'desktop') {
    return errorJson('invalid-url', 'strategy must be "mobile" or "desktop".', 400)
  }
  const strategy: Strategy = rawStrategy

  const validated = validateTestUrl(searchParams.get('url') ?? '')
  if (validated.url === undefined) {
    return errorJson('blocked-url', validated.error ?? 'Enter a valid URL.', 400)
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
        return errorJson(
          'blocked-url',
          'That hostname resolves to a private network address, so it cannot be tested.',
          400,
        )
      }
    } catch {
      return errorJson(
        'unreachable',
        'That domain does not resolve. Check the spelling, then try again.',
        400,
      )
    }
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
      // Repeat tests of the same URL+strategy within 6h are served from the
      // data cache instead of burning a fresh Lighthouse run.
      next: { revalidate: REVALIDATE_SECONDS },
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      return errorJson(
        'timeout',
        'The test did not finish within 60 seconds. Slow or hanging pages can exceed the limit — try again.',
        504,
      )
    }
    return errorJson(
      'upstream',
      'Could not reach the PageSpeed service. Try again in a moment.',
      502,
    )
  }

  const contentLength = Number(upstream.headers.get('content-length') ?? '0')
  if (Number.isFinite(contentLength) && contentLength > MAX_RESPONSE_BYTES) {
    return errorJson('upstream', 'The PageSpeed response was too large to process.', 502)
  }
  const text = await upstream.text()
  if (text.length > MAX_RESPONSE_BYTES) {
    return errorJson('upstream', 'The PageSpeed response was too large to process.', 502)
  }

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return errorJson(
      'upstream',
      'The PageSpeed service returned an unreadable response. Try again in a moment.',
      502,
    )
  }

  if (!upstream.ok) {
    const message = upstreamMessage(body)
    if (upstream.status === 429 || /quota|rate limit/i.test(message)) {
      return errorJson(
        'quota',
        'The free testing quota is briefly exhausted. Wait a minute, then run the test again.',
        429,
      )
    }
    if (
      /FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|DNS_FAILURE|NOT_HTML|unreachable/i.test(
        message,
      )
    ) {
      return errorJson(
        'unreachable',
        'PageSpeed could not load that page. Check it opens in your own browser and is not blocking crawlers.',
        502,
      )
    }
    if (upstream.status === 400) {
      return errorJson(
        'invalid-url',
        'PageSpeed rejected that URL. Check it is a public web page, not a file or an intranet address.',
        400,
      )
    }
    return errorJson(
      'upstream',
      'The PageSpeed service failed to run the test. Running it again usually works.',
      502,
    )
  }

  const parsed = parsePsiResponse(body, strategy)
  if (parsed.payload === undefined) {
    return errorJson(
      'upstream',
      parsed.error ?? 'PageSpeed returned a response this tool could not read.',
      502,
    )
  }

  return NextResponse.json(parsed.payload, {
    headers: {
      // Let the CDN reuse a finished report too — same window as the data cache.
      'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=3600`,
    },
  })
}
