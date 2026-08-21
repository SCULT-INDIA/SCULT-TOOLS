/**
 * Pure validation for the per-tool feedback form — no I/O, so the same rules
 * run on the client (instant inline errors) and the server (the only copy
 * that actually matters, since a client check is trivially bypassed).
 *
 * `category` and `rating` exist because SCULT Studio's feedback endpoint
 * (`lib/studio.ts`) accepts both — `category` defaults to "General" there if
 * omitted, and `rating` is genuinely optional (no rating UI is forced on the
 * visitor). `visitorId` is opaque, from `lib/visitor.ts`, never validated
 * beyond a length cap.
 */

export const FEEDBACK_MESSAGE_MAX = 2000
export const FEEDBACK_MESSAGE_MIN = 5

export interface FeedbackInput {
  toolSlug: string
  toolTitle: string
  category?: string
  pageUrl: string
  message: string
  rating?: number
  email?: string
  visitorId?: string
  /** Honeypot field — real users never fill it in; a non-empty value means a bot. */
  company?: string
}

export interface ValidatedFeedback {
  toolSlug: string
  toolTitle: string
  category?: string
  pageUrl: string
  message: string
  rating?: number
  email?: string
  visitorId?: string
}

export type FeedbackValidationError =
  | 'bot'
  | 'message-too-short'
  | 'message-too-long'
  | 'invalid-email'
  | 'invalid-rating'
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

  let rating: number | undefined
  if (input.rating !== undefined && input.rating !== null) {
    const n = Number(input.rating)
    if (!Number.isInteger(n) || n < 1 || n > 5) return { error: 'invalid-rating' }
    rating = n
  }

  const toolTitle =
    typeof input.toolTitle === 'string' && input.toolTitle.trim() !== ''
      ? input.toolTitle.trim()
      : input.toolSlug

  const category =
    typeof input.category === 'string' && input.category.trim() !== ''
      ? input.category.trim()
      : undefined

  const pageUrl =
    typeof input.pageUrl === 'string' ? input.pageUrl.trim().slice(0, 500) : ''

  const visitorId =
    typeof input.visitorId === 'string' && input.visitorId.trim() !== ''
      ? input.visitorId.trim().slice(0, 200)
      : undefined

  return {
    data: {
      toolSlug: input.toolSlug.trim(),
      toolTitle,
      category,
      pageUrl,
      message,
      rating,
      email,
      visitorId,
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
    case 'invalid-rating':
      return 'Could not submit that.'
  }
}
