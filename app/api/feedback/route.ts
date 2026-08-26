/**
 * POST /api/feedback
 *
 * Purpose
 *   Backend for the per-tool feedback button (components/tools/FeedbackButton.tsx).
 *   A visitor's message + which tool they were on is forwarded to SCULT
 *   Studio (studio.scult.in) via `lib/studio.ts`'s shared client. No
 *   client-visible key — `SCULT_STUDIO_API_KEY` is read only inside
 *   `lib/studio.ts`, and never appears in any response body.
 *
 * Inputs   JSON body: { toolSlug, toolTitle, category?, pageUrl, message,
 *          rating?, email?, visitorId?, company? } (`company` is a
 *          honeypot — see logic.ts).
 * Outputs  201 `{ ok: true, id }`, or a clean JSON error `{ error }` — never
 *          the raw Studio response.
 * Failure  invalid input -> 400/422, too many submissions -> 429,
 *          Studio misconfigured/unreachable/rejecting -> 502 or 400.
 *
 *   A non-2xx here means Studio rejected the submission, or the key is
 *   missing/invalid/mis-scoped — check Vercel's function logs for this
 *   route's `postToStudio:` lines (lib/studio.ts), which log Studio's own
 *   error detail on every rejection.
 */

import { NextResponse } from 'next/server'
import { isAutomatedClientUserAgent } from '@/lib/bot-detection'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import { submitToolFeedback } from '@/lib/studio'
import { feedbackErrorMessage, validateFeedback } from '@/lib/tools/feedback/logic'

/** A human typing feedback submits at most a handful of times; anything more is a script. */
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60_000

/** Far above any legitimate submission (message caps at 2,000 chars) —
 * this bounds what request.json() will materialise, nothing more. */
const MAX_BODY_BYTES = 64 * 1024

function errorJson(error: string, status: number): NextResponse {
  return NextResponse.json({ error }, { status })
}

export async function POST(request: Request): Promise<NextResponse> {
  // Same generic 400 the honeypot below returns — a scripted HTTP client or
  // headless browser posting here is form spam or an automated test, never
  // a real visitor's feedback. Deliberately the NARROW automated-client
  // check, not the analytics-grade isLikelyBotUserAgent: that broader list
  // includes link-preview substrings ("WhatsApp") that also appear in real
  // humans' in-app browser UAs, and preview bots never POST anyway — using
  // it here silently ate feedback from anyone arriving via a chat app.
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
    `feedback:${clientIp}`,
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

  const validated = validateFeedback(body as Record<string, unknown>)
  if ('error' in validated) {
    // A honeypot hit or a missing tool slug is not a real user error worth
    // explaining — report it as a generic 400 rather than teaching a bot
    // which field tripped the trap.
    const status =
      validated.error === 'bot' || validated.error === 'missing-tool' ? 400 : 422
    return errorJson(feedbackErrorMessage(validated.error), status)
  }
  const feedback = validated.data

  const result = await submitToolFeedback({
    toolId: feedback.toolSlug,
    toolName: feedback.toolTitle,
    category: feedback.category,
    message: feedback.message,
    rating: feedback.rating,
    email: feedback.email,
    pageUrl: feedback.pageUrl,
    visitorId: feedback.visitorId,
  })

  if (!result.ok) {
    return errorJson(result.message, result.status)
  }

  return NextResponse.json({ ok: true, id: result.id }, { status: 201 })
}
