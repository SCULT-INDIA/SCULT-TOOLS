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
import { requestErrorMessage, validateRequest } from '@/lib/requests/logic'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import { submitToolRequest } from '@/lib/studio'

/** A human asking for something submits at most a handful of times; anything more is a script. */
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60_000

function errorJson(error: string, status: number): NextResponse {
  return NextResponse.json({ error }, { status })
}

export async function POST(request: Request): Promise<NextResponse> {
  const clientIp = clientIpFromHeaders(request.headers)
  const rateLimit = checkRateLimit(`request:${clientIp}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)
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
