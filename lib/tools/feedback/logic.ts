/**
 * Pure validation for the per-tool feedback form — no I/O, so the same rules
 * run on the client (instant inline errors) and the server (the only copy
 * that actually matters, since a client check is trivially bypassed).
 *
 * Deliberately tiny: a message and where it came from, plus an optional
 * reply-to email. No rating scale, no category picker — those are product
 * decisions nobody asked for; this just gets a visitor's words to
 * connect@scult.in.
 */

export const FEEDBACK_MESSAGE_MAX = 2000
export const FEEDBACK_MESSAGE_MIN = 5

export interface FeedbackInput {
  toolSlug: string
  toolTitle: string
  pageUrl: string
  message: string
  email?: string
  /** Honeypot field — real users never fill it in; a non-empty value means a bot. */
  company?: string
}

export interface ValidatedFeedback {
  toolSlug: string
  toolTitle: string
  pageUrl: string
  message: string
  email?: string
}

export type FeedbackValidationError =
  | 'bot'
  | 'message-too-short'
  | 'message-too-long'
  | 'invalid-email'
  | 'missing-tool'

/** Simple, deliberately permissive email shape check — this only gates a reply-to header, never an account. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateFeedback(
  input: Partial<FeedbackInput>,
): { data: ValidatedFeedback } | { error: FeedbackValidationError } {
  if (typeof input.company === 'string' && input.company.trim() !== '') {
    return { error: 'bot' }
  }

  if (typeof input.toolSlug !== 'string' || input.toolSlug.trim() === '') {
    return { error: 'missing-tool' }
  }

  const message = typeof input.message === 'string' ? input.message.trim() : ''
  if (message.length < FEEDBACK_MESSAGE_MIN) return { error: 'message-too-short' }
  if (message.length > FEEDBACK_MESSAGE_MAX) return { error: 'message-too-long' }

  let email: string | undefined
  if (typeof input.email === 'string' && input.email.trim() !== '') {
    const trimmed = input.email.trim()
    if (!EMAIL_RE.test(trimmed) || trimmed.length > 254) return { error: 'invalid-email' }
    email = trimmed
  }

  const toolTitle =
    typeof input.toolTitle === 'string' && input.toolTitle.trim() !== ''
      ? input.toolTitle.trim()
      : input.toolSlug

  const pageUrl =
    typeof input.pageUrl === 'string' ? input.pageUrl.trim().slice(0, 500) : ''

  return {
    data: {
      toolSlug: input.toolSlug.trim(),
      toolTitle,
      pageUrl,
      message,
      email,
    },
  }
}

export function feedbackErrorMessage(error: FeedbackValidationError): string {
  switch (error) {
    case 'bot':
      return 'Could not submit that.'
    case 'missing-tool':
      return 'Could not submit that.'
    case 'message-too-short':
      return `Say a little more — at least ${FEEDBACK_MESSAGE_MIN} characters.`
    case 'message-too-long':
      return `Keep it under ${FEEDBACK_MESSAGE_MAX} characters.`
    case 'invalid-email':
      return 'That email address does not look right.'
  }
}
