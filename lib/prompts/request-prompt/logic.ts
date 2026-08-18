/**
 * Pure validation for the "Request a prompt" form — no I/O, so the same
 * rules run on the client (instant inline errors) and the server (the only
 * copy that actually matters, since a client check is trivially bypassed).
 *
 * Deliberately the same shape as `lib/tools/feedback/logic.ts`: a
 * description and where the request came from, plus an optional reply-to
 * email and the same honeypot. This isn't a coincidence — it exists so
 * `app/api/request-prompt/route.ts` can reuse the feedback route's mailing
 * mechanism (Resend, same env vars, same rate-limit shape) verbatim rather
 * than inventing a second one.
 */

export const REQUEST_DESCRIPTION_MAX = 1000
export const REQUEST_DESCRIPTION_MIN = 10

export interface RequestPromptInput {
  description: string
  /** The category page the visitor was browsing when they asked, if any —
   * "prompts I'd want for X" is more useful context than a bare request. */
  category?: string
  pageUrl: string
  email?: string
  /** Honeypot field — real users never fill it in; a non-empty value means a bot. */
  company?: string
}

export interface ValidatedRequestPrompt {
  description: string
  category?: string
  pageUrl: string
  email?: string
}

export type RequestPromptValidationError =
  | 'bot'
  | 'description-too-short'
  | 'description-too-long'
  | 'invalid-email'

/** Simple, deliberately permissive email shape check — this only gates a reply-to header, never an account. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRequestPrompt(
  input: Partial<RequestPromptInput>,
): { data: ValidatedRequestPrompt } | { error: RequestPromptValidationError } {
  if (typeof input.company === 'string' && input.company.trim() !== '') {
    return { error: 'bot' }
  }

  const description =
    typeof input.description === 'string' ? input.description.trim() : ''
  if (description.length < REQUEST_DESCRIPTION_MIN) {
    return { error: 'description-too-short' }
  }
  if (description.length > REQUEST_DESCRIPTION_MAX) {
    return { error: 'description-too-long' }
  }

  let email: string | undefined
  if (typeof input.email === 'string' && input.email.trim() !== '') {
    const trimmed = input.email.trim()
    if (!EMAIL_RE.test(trimmed) || trimmed.length > 254) return { error: 'invalid-email' }
    email = trimmed
  }

  const category =
    typeof input.category === 'string' && input.category.trim() !== ''
      ? input.category.trim()
      : undefined

  const pageUrl =
    typeof input.pageUrl === 'string' ? input.pageUrl.trim().slice(0, 500) : ''

  return {
    data: { description, category, pageUrl, email },
  }
}

export function requestPromptErrorMessage(error: RequestPromptValidationError): string {
  switch (error) {
    case 'bot':
      return 'Could not submit that.'
    case 'description-too-short':
      return `Say a little more about what you need — at least ${REQUEST_DESCRIPTION_MIN} characters.`
    case 'description-too-long':
      return `Keep it under ${REQUEST_DESCRIPTION_MAX} characters.`
    case 'invalid-email':
      return 'That email address does not look right.'
  }
}
