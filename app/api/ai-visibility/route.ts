import { lookup } from 'node:dns/promises'
import { NextResponse } from 'next/server'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import {
  type ApiError,
  buildReport,
  isIpLiteral,
  isPrivateAddress,
  parseRobots,
  validateTargetUrl,
} from '@/lib/tools/ai-visibility-checker/logic'

/**
 * GET /api/ai-visibility?url=<target>
 *
 * Purpose
 *   Server-side fetcher for the AI visibility checker. Browsers cannot read
 *   other sites' robots.txt (CORS), so this handler fetches robots.txt,
 *   llms.txt and the homepage on the visitor's behalf, hands the raw text to
 *   the pure analyzer in logic.ts, and returns the typed report.
 *
 * Security (SSRF)
 *   Every URL — including every redirect hop — is re-validated: http/https
 *   only, no credentials, no localhost/.local/.internal, and the hostname is
 *   resolved with dns.lookup and rejected when ANY resulting address is
 *   private, loopback, link-local or an IPv4-mapped private IPv6 address.
 *   Requests time out after 10s, follow at most 3 manual redirects, and the
 *   body is read through a reader loop capped at 2 MB.
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
const REVALIDATE_SECONDS = 21_600 // 6 hours

/** Each check can fire up to 4 outbound fetches against a THIRD PARTY's
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

/** Reads a response body through a reader loop, hard-capped at MAX_BODY_BYTES. */
async function readCapped(res: Response): Promise<{ text: string; bytes: number }> {
  const reader = res.body?.getReader()
  if (reader === undefined) return { text: '', bytes: 0 }
  const chunks: Uint8Array[] = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    if (value === undefined) continue
    received += value.byteLength
    if (received > MAX_BODY_BYTES) {
      const keep = value.byteLength - (received - MAX_BODY_BYTES)
      chunks.push(value.subarray(0, keep))
      received = MAX_BODY_BYTES
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
  }
}

/**
 * Fetches a URL with the full SSRF gate: validation + DNS check before the
 * first request and again on every redirect hop, manual redirects capped at
 * 3, 10s timeout, 2 MB body cap.
 */
async function safeFetch(startUrl: string): Promise<FetchOutcome> {
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

    const { text, bytes } = await readCapped(res)
    const xRobotsTag = res.headers.get('x-robots-tag')
    return {
      ok: res.ok,
      status: res.status,
      body: text,
      bytes,
      finalUrl: validation.url,
      ...(xRobotsTag !== null ? { xRobotsTag } : {}),
    }
  }
  return FAILED('unreachable') // redirect loop
}

function errorResponse(error: ApiError, httpStatus: number): NextResponse {
  return NextResponse.json(error, { status: httpStatus })
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
  const validation = validateTargetUrl(rawUrl)
  if (validation.url === undefined || validation.hostname === undefined) {
    return errorResponse(
      { error: validation.error ?? 'Invalid URL.', code: 'invalid-url' },
      400,
    )
  }

  // Homepage first — if the site itself is unreachable there is no report.
  const home = await safeFetch(validation.url)
  if (home.failure === 'invalid') {
    return errorResponse(
      { error: 'A redirect led to an invalid URL.', code: 'invalid-url' },
      400,
    )
  }
  if (home.failure === 'private') {
    return errorResponse(
      {
        error:
          'That hostname resolves to a private or internal address, which cannot be checked.',
        code: 'private-address',
      },
      400,
    )
  }
  if (home.failure === 'unreachable') {
    return errorResponse(
      {
        error:
          'The site did not respond within 10 seconds (or redirected more than 3 times).',
        code: 'unreachable',
      },
      502,
    )
  }
  if (!home.ok) {
    const blocked = home.status === 401 || home.status === 403 || home.status === 451
    return errorResponse(
      {
        error: blocked
          ? `The site answered HTTP ${home.status} to our checker.`
          : `The site answered HTTP ${home.status} instead of a page.`,
        code: blocked ? 'blocked' : 'unreachable',
        httpStatus: home.status,
      },
      502,
    )
  }

  const origin = new URL(home.finalUrl).origin
  const [robots, llms] = await Promise.all([
    safeFetch(`${origin}/robots.txt`),
    safeFetch(`${origin}/llms.txt`),
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
  })

  return NextResponse.json(report, {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=21600' },
  })
}
