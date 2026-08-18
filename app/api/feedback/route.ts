/**
 * POST /api/feedback
 *
 * Purpose
 *   Backend for the per-tool feedback button (components/tools/FeedbackButton.tsx).
 *   A visitor's message + which tool they were on gets emailed straight to
 *   connect@scult.in via `lib/resend.ts`'s shared sender. No `resend` npm
 *   package, no client-visible key — `RESEND_API_KEY` is read only inside
 *   `lib/resend.ts`, and never appears in any response body.
 *
 * Inputs   JSON body: { toolSlug, toolTitle, pageUrl, message, email?, company? }
 *          (`company` is a honeypot — see logic.ts).
 * Outputs  200 `{ ok: true }`, or a clean JSON error `{ error }` — never the
 *          raw Resend response.
 * Failure  invalid input -> 400, too many submissions -> 429, Resend/email
 *          misconfigured or unreachable -> 502.
 *
 *   A 200 here means Resend ACCEPTED the send, not that it was delivered —
 *   see `lib/resend.ts`'s docblock for a real production case where those
 *   are different (the sandbox `onboarding@resend.dev` sender silently
 *   fails to deliver to anyone but the Resend account's own signup email).
 *   Check Vercel's function logs for this route's `sendMail:` lines, not
 *   just this endpoint's HTTP status, if a submission goes missing.
 */

import { NextResponse } from 'next/server'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import { escapeHtml, sendMail } from '@/lib/resend'
import { feedbackErrorMessage, validateFeedback } from '@/lib/tools/feedback/logic'

/** Where every feedback message lands — overridable via env, but this is the product requirement. */
const TO_EMAIL = process.env.FEEDBACK_TO_EMAIL ?? 'connect@scult.in'

/** A human typing feedback submits at most a handful of times; anything more is a script. */
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60_000

function errorJson(error: string, status: number): NextResponse {
  return NextResponse.json({ error }, { status })
}

export async function POST(request: Request): Promise<NextResponse> {
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

  const subject = `Tool feedback: ${feedback.toolTitle}`
  const textLines = [
    `Tool: ${feedback.toolTitle} (${feedback.toolSlug})`,
    `Page: ${feedback.pageUrl}`,
    feedback.email ? `Reply-to: ${feedback.email}` : 'Reply-to: (not provided)',
    '',
    feedback.message,
  ]
  const html = `
    <p><strong>Tool:</strong> ${escapeHtml(feedback.toolTitle)} (${escapeHtml(feedback.toolSlug)})</p>
    <p><strong>Page:</strong> ${escapeHtml(feedback.pageUrl)}</p>
    <p><strong>Reply-to:</strong> ${feedback.email ? escapeHtml(feedback.email) : '(not provided)'}</p>
    <hr />
    <p>${escapeHtml(feedback.message).replace(/\n/g, '<br />')}</p>
  `

  const result = await sendMail({
    to: TO_EMAIL,
    subject,
    text: textLines.join('\n'),
    html,
    replyTo: feedback.email,
  })

  if (!result.ok) {
    return errorJson(result.message, result.status)
  }

  return NextResponse.json({ ok: true })
}
