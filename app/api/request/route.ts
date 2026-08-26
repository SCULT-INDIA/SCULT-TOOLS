/**
 * POST /api/request
 *
 * Purpose
 *   Backend for the generalized "Request a tool / prompt / skill" form
 *   (components/ui/RequestButton.tsx), reused on tool pages, prompt pages,
 *   and the footer. `kind` decides which of the three request types SCULT
 *   Studio (studio.scult.in) records it as — everything else is shared. No
 *   client-visible key — `SCULT_STUDIO_API_KEY` is read only inside
 *   `lib/studio.ts`, and never appears in any response body.
 *
 *   Replaces the earlier prompt-only /api/request-prompt entirely.
 *
 * Inputs   JSON body: { kind, title, description, affectedTool?, name?,
 *          email?, pageUrl, visitorId?, company? } (`company` is a
 *          honeypot — see lib/requests/logic.ts).
 * Outputs  201 `{ ok: true, id }`, or a clean JSON error `{ error }` — never
 *          the raw Studio response.
 * Failure  invalid input -> 400/422, too many submissions -> 429,
 *          Studio misconfigured/unreachable/rejecting -> 502 or 400.
 */

import { NextResponse } from 'next/server'
import { isAutomatedClientUserAgent } from '@/lib/bot-detection'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import { requestErrorMessage, validateRequest } from '@/lib/requests/logic'
import { submitToolRequest } from '@/lib/studio'

/** A human asking for something submits at most a handful of times; anything more is a script. */
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60_000

/** Far above any legitimate submission (description caps at 8,000 chars) —
 * this bounds what request.json() will materialise, nothing more. */
const MAX_BODY_BYTES = 64 * 1024

function errorJson(error: string, status: number): NextResponse {
  return NextResponse.json({ error }, { status })
}

export async function POST(request: Request): Promise<NextResponse> {
  // Same generic 400 the honeypot below returns — a scripted HTTP client or
  // headless browser posting here is form spam or an automated test, never
  // a real visitor's request. The NARROW automated-client check, not the
  // analytics-grade isLikelyBotUserAgent — see app/api/feedback/route.ts
  // for why the broader list silently ate submissions from chat-app
  // in-app browsers.
  if (isAutomatedClientUserAgent(request.headers.get('user-agent'))) {
    return errorJson('Could not submit that.', 400)
  }

  const declaredBytes = Number(request.headers.get('content-length'))
  if (
    !Number.isFinite(declaredBytes) ||
    declaredBytes <= 0 ||
    declaredBytes > MAX_BODY_BYTES
  ) {
    return errorJson('Could not read that submission.', 413)
  }

  const clientIp = clientIpFromHeaders(request.headers)
  const rateLimit = checkRateLimit(
    `request:${clientIp}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS,
  )
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Too many submissions — wait ${rateLimit.retryAfterSeconds}s and try again.`,
      },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorJson('Could not read that submission.', 400)
  }
  if (typeof body !== 'object' || body === null) {
    return errorJson('Could not read that submission.', 400)
  }

  const validated = validateRequest(body as Record<string, unknown>)
  if ('error' in validated) {
    // A honeypot hit or an invalid kind is not a real user error worth
    // explaining — report it as a generic 400 rather than teaching a bot
    // which field tripped the trap.
    const status =
      validated.error === 'bot' || validated.error === 'invalid-kind' ? 400 : 422
    return errorJson(requestErrorMessage(validated.error), status)
  }
  const req = validated.data

  const result = await submitToolRequest({
    kind: req.kind,
    title: req.title,
    description: req.description,
    affectedTool: req.affectedTool,
    name: req.name,
    email: req.email,
    pageUrl: req.pageUrl,
    visitorId: req.visitorId,
  })

  if (!result.ok) {
    return errorJson(result.message, result.status)
  }

  return NextResponse.json({ ok: true, id: result.id }, { status: 201 })
}
