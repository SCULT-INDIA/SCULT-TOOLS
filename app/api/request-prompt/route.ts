/**
 * POST /api/request-prompt
 *
 * Purpose
 *   Backend for "Request a prompt" (components/prompts/RequestPromptButton.tsx).
 *   A visitor's description of the prompt they want gets emailed straight to
 *   connect@scult.in via `lib/resend.ts`'s shared sender — the exact same
 *   mechanism as /api/feedback (see lib/prompts/request-prompt/logic.ts for
 *   why the validation shape matches it deliberately). No `resend` npm
 *   package, no client-visible key — `RESEND_API_KEY` is read only inside
 *   `lib/resend.ts`, and never appears in any response body.
 *
 * Inputs   JSON body: { description, category?, pageUrl, email?, company? }
 *          (`company` is a honeypot — see logic.ts).
 * Outputs  200 `{ ok: true }`, or a clean JSON error `{ error }` — never the
 *          raw Resend response.
 * Failure  invalid input -> 400/422, too many submissions -> 429,
 *          Resend/email misconfigured or unreachable -> 502.
 *
 *   A 200 here means Resend ACCEPTED the send, not that it was delivered —
 *   see `lib/resend.ts`'s docblock for a real production case where those
 *   are different (the sandbox `onboarding@resend.dev` sender silently
 *   fails to deliver to anyone but the Resend account's own signup email).
 *   Check Vercel's function logs for this route's `sendMail:` lines, not
 *   just this endpoint's HTTP status, if a submission goes missing.
 */

import { NextResponse } from 'next/server'
import {
  requestPromptErrorMessage,
  validateRequestPrompt,
} from '@/lib/prompts/request-prompt/logic'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import { escapeHtml, sendMail } from '@/lib/resend'

/** Same destination and override hook as /api/feedback — one inbox for both. */
const TO_EMAIL = process.env.FEEDBACK_TO_EMAIL ?? 'connect@scult.in'

/** A human asking for a prompt submits at most a handful of times; anything more is a script. */
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60_000

function errorJson(error: string, status: number): NextResponse {
  return NextResponse.json({ error }, { status })
}

export async function POST(request: Request): Promise<NextResponse> {
  const clientIp = clientIpFromHeaders(request.headers)
  const rateLimit = checkRateLimit(
    `request-prompt:${clientIp}`,
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

  const validated = validateRequestPrompt(body as Record<string, unknown>)
  if ('error' in validated) {
    // A honeypot hit is not a real user error worth explaining — report it
    // as a generic 400 rather than teaching a bot which field tripped it.
    const status = validated.error === 'bot' ? 400 : 422
    return errorJson(requestPromptErrorMessage(validated.error), status)
  }
  const requestData = validated.data

  const subject = requestData.category
    ? `Prompt request: ${requestData.category}`
    : 'Prompt request'
  const textLines = [
    `Category: ${requestData.category ?? '(not specified)'}`,
    `Page: ${requestData.pageUrl}`,
    requestData.email ? `Reply-to: ${requestData.email}` : 'Reply-to: (not provided)',
    '',
    requestData.description,
  ]
  const html = `
    <p><strong>Category:</strong> ${escapeHtml(requestData.category ?? '(not specified)')}</p>
    <p><strong>Page:</strong> ${escapeHtml(requestData.pageUrl)}</p>
    <p><strong>Reply-to:</strong> ${requestData.email ? escapeHtml(requestData.email) : '(not provided)'}</p>
    <hr />
    <p>${escapeHtml(requestData.description).replace(/\n/g, '<br />')}</p>
  `

  const result = await sendMail({
    to: TO_EMAIL,
    subject,
    text: textLines.join('\n'),
    html,
    replyTo: requestData.email,
  })

  if (!result.ok) {
    return errorJson(result.message, result.status)
  }

  return NextResponse.json({ ok: true })
}
