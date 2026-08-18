/**
 * POST /api/request-prompt
 *
 * Purpose
 *   Backend for "Request a prompt" (components/prompts/RequestPromptButton.tsx).
 *   A visitor's description of the prompt they want gets emailed straight to
 *   connect@scult.in via Resend's HTTP API — the exact same mechanism as
 *   /api/feedback (see lib/prompts/request-prompt/logic.ts for why the
 *   validation shape matches it deliberately). No `resend` npm package, no
 *   client-visible key — this route is the only place `RESEND_API_KEY` is
 *   ever read here, and it never appears in any response body.
 *
 * Inputs   JSON body: { description, category?, pageUrl, email?, company? }
 *          (`company` is a honeypot — see logic.ts).
 * Outputs  200 `{ ok: true }`, or a clean JSON error `{ error }` — never the
 *          raw Resend response.
 * Failure  invalid input -> 400/422, too many submissions -> 429,
 *          Resend/email misconfigured or unreachable -> 502.
 */

import { NextResponse } from 'next/server'
import {
  requestPromptErrorMessage,
  validateRequestPrompt,
} from '@/lib/prompts/request-prompt/logic'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const RESEND_TIMEOUT_MS = 10_000

/** Same destination and override hook as /api/feedback — one inbox for both. */
const TO_EMAIL = process.env.FEEDBACK_TO_EMAIL ?? 'connect@scult.in'

/** A human asking for a prompt submits at most a handful of times; anything more is a script. */
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60_000

function errorJson(error: string, status: number): NextResponse {
  return NextResponse.json({ error }, { status })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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
  const request_ = validated.data

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured — prompt request dropped.')
    return errorJson('Prompt requests are not accepting submissions right now.', 502)
  }

  const fromAddress =
    process.env.FEEDBACK_FROM_EMAIL ?? 'Scult Tools <onboarding@resend.dev>'

  const subject = request_.category
    ? `Prompt request: ${request_.category}`
    : 'Prompt request'
  const textLines = [
    `Category: ${request_.category ?? '(not specified)'}`,
    `Page: ${request_.pageUrl}`,
    request_.email ? `Reply-to: ${request_.email}` : 'Reply-to: (not provided)',
    '',
    request_.description,
  ]
  const html = `
    <p><strong>Category:</strong> ${escapeHtml(request_.category ?? '(not specified)')}</p>
    <p><strong>Page:</strong> ${escapeHtml(request_.pageUrl)}</p>
    <p><strong>Reply-to:</strong> ${request_.email ? escapeHtml(request_.email) : '(not provided)'}</p>
    <hr />
    <p>${escapeHtml(request_.description).replace(/\n/g, '<br />')}</p>
  `

  try {
    const upstream = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [TO_EMAIL],
        subject,
        text: textLines.join('\n'),
        html,
        ...(request_.email ? { reply_to: request_.email } : {}),
      }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    })

    if (!upstream.ok) {
      const errBody = await upstream.text().catch(() => '')
      console.error(`Resend rejected a prompt-request email (${upstream.status}): ${errBody}`)
      return errorJson('Could not send that request. Try again in a moment.', 502)
    }
  } catch (err) {
    console.error('Resend request failed for a prompt request:', err)
    return errorJson('Could not send that request. Try again in a moment.', 502)
  }

  return NextResponse.json({ ok: true })
}
