/**
 * The one place every "email connect@scult.in" feature (feedback, prompt
 * requests) actually calls Resend. Centralized after finding a real
 * production bug shared by both call sites: with `FEEDBACK_FROM_EMAIL`
 * unset, the sender falls back to Resend's own sandbox address
 * (`onboarding@resend.dev`), which Resend explicitly restricts to
 * delivering only to the email the Resend ACCOUNT was signed up with — not
 * to arbitrary recipients like `connect@scult.in`. The API still returns
 * 200 for that case (the request was validly formed; delivery is a
 * separate, silent restriction), so a caller reading only the HTTP status
 * has no way to tell "sent" from "accepted but never delivered" apart.
 *
 * This does not fix delivery — that requires verifying a domain in the
 * Resend dashboard and setting `FEEDBACK_FROM_EMAIL` to an address on it,
 * which only whoever holds that account can do. What this DOES fix: the
 * moment that's investigated, `sendMail` logs a loud, specific warning
 * every time it sends from the sandbox address, and logs Resend's own
 * message id on every accepted send — so "did it actually go out, and to
 * where" is answerable from Vercel's function logs instead of guessed at.
 * Previously this warning and this success log existed nowhere: both
 * `/api/feedback` and `/api/request-prompt` only ever logged the failure
 * path, so a silent-acceptance failure like this one produced no log line
 * at all.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const RESEND_TIMEOUT_MS = 10_000

/** Resend's own default, unverified sending address — see the module docblock. */
const SANDBOX_FROM_ADDRESS = 'onboarding@resend.dev'

export interface SendMailInput {
  readonly to: string
  readonly subject: string
  readonly text: string
  readonly html: string
  readonly replyTo?: string
}

export type SendMailResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly status: number; readonly message: string }

export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured — email dropped.')
    return { ok: false, status: 502, message: 'Not accepting submissions right now.' }
  }

  const fromAddress =
    process.env.FEEDBACK_FROM_EMAIL ?? `Scult Tools <${SANDBOX_FROM_ADDRESS}>`

  if (fromAddress.includes(SANDBOX_FROM_ADDRESS)) {
    console.warn(
      `sendMail: sending to "${input.to}" from Resend's sandbox address ` +
        `(${SANDBOX_FROM_ADDRESS}). Resend only delivers mail from this address to the ` +
        'email the Resend account itself was signed up with — this send will very likely ' +
        'be accepted (HTTP 200) but never arrive. Verify a domain in the Resend dashboard ' +
        'and set FEEDBACK_FROM_EMAIL to an address on it to fix delivery.',
    )
  }

  try {
    const upstream = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    })

    const body = await upstream.text().catch(() => '')

    if (!upstream.ok) {
      console.error(`sendMail: Resend rejected a send to "${input.to}" (${upstream.status}): ${body}`)
      return { ok: false, status: 502, message: 'Could not send that. Try again in a moment.' }
    }

    // The one line that answers "did this actually go out, and with what
    // Resend message id" — previously logged nowhere on the success path.
    console.log(`sendMail: Resend accepted a send to "${input.to}": ${body}`)
    return { ok: true }
  } catch (err) {
    console.error(`sendMail: request to Resend failed for "${input.to}":`, err)
    return { ok: false, status: 502, message: 'Could not send that. Try again in a moment.' }
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
