/**
 * Pure validation for the generalized "Request a tool / prompt / skill"
 * form (`components/ui/RequestButton.tsx`) — no I/O, so the same rules run
 * on the client (instant inline errors) and the server (the only copy that
 * actually matters, since a client check is trivially bypassed).
 *
 * One shape for all three request kinds rather than three near-identical
 * ones: `kind` is the only thing that changes what SCULT Studio
 * (studio.scult.in) does with the record on its side
 * (`POST /api/v1/tools/requests`), so it's the only thing that needs to
 * change here. Replaces the earlier prompt-only
 * `lib/prompts/request-prompt/logic.ts`, which this generalizes.
 */

export const REQUEST_TITLE_MIN = 3
export const REQUEST_TITLE_MAX = 300
export const REQUEST_DESCRIPTION_MIN = 10
export const REQUEST_DESCRIPTION_MAX = 8000

export const REQUEST_KINDS = ['tool_request', 'prompt_request', 'skill_request'] as const
export type RequestKind = (typeof REQUEST_KINDS)[number]

export interface RequestInput {
  kind: string
  title: string
  description: string
  /** The tool/category the visitor was already looking at, if any —
   * optional context, not a foreign key into anything on this side. */
  affectedTool?: string
  name?: string
  email?: string
  pageUrl: string
  /** From `lib/visitor.ts` — opaque, never validated beyond a length cap. */
  visitorId?: string
  /** Honeypot field — real users never fill it in; a non-empty value means a bot. */
  company?: string
}

export interface ValidatedRequest {
  kind: RequestKind
  title: string
  description: string
  affectedTool?: string
  name?: string
  email?: string
  pageUrl: string
  visitorId?: string
}

export type RequestValidationError =
  | 'bot'
  | 'invalid-kind'
  | 'title-too-short'
  | 'title-too-long'
  | 'description-too-short'
  | 'description-too-long'
  | 'invalid-email'

/** Simple, deliberately permissive email shape check — this only gates a reply-to field, never an account. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isRequestKind(value: string): value is RequestKind {
  return (REQUEST_KINDS as readonly string[]).includes(value)
}

export function validateRequest(
  input: Partial<RequestInput>,
): { data: ValidatedRequest } | { error: RequestValidationError } {
  if (typeof input.company === 'string' && input.company.trim() !== '') {
    return { error: 'bot' }
  }

  const kind = typeof input.kind === 'string' ? input.kind.trim() : ''
  if (!isRequestKind(kind)) return { error: 'invalid-kind' }

  const title = typeof input.title === 'string' ? input.title.trim() : ''
  if (title.length < REQUEST_TITLE_MIN) return { error: 'title-too-short' }
  if (title.length > REQUEST_TITLE_MAX) return { error: 'title-too-long' }

  const description =
    typeof input.description === 'string' ? input.description.trim() : ''
  if (description.length < REQUEST_DESCRIPTION_MIN)
    return { error: 'description-too-short' }
  if (description.length > REQUEST_DESCRIPTION_MAX)
    return { error: 'description-too-long' }

  let email: string | undefined
  if (typeof input.email === 'string' && input.email.trim() !== '') {
    const trimmed = input.email.trim()
    if (!EMAIL_RE.test(trimmed) || trimmed.length > 254) return { error: 'invalid-email' }
    email = trimmed
  }

  const affectedTool =
    typeof input.affectedTool === 'string' && input.affectedTool.trim() !== ''
      ? input.affectedTool.trim().slice(0, 200)
      : undefined

  const name =
    typeof input.name === 'string' && input.name.trim() !== ''
      ? input.name.trim().slice(0, 200)
      : undefined

  const pageUrl =
    typeof input.pageUrl === 'string' ? input.pageUrl.trim().slice(0, 500) : ''

  const visitorId =
    typeof input.visitorId === 'string' && input.visitorId.trim() !== ''
      ? input.visitorId.trim().slice(0, 200)
      : undefined

  return {
    data: { kind, title, description, affectedTool, name, email, pageUrl, visitorId },
  }
}

export function requestErrorMessage(error: RequestValidationError): string {
  switch (error) {
    case 'bot':
    case 'invalid-kind':
      return 'Could not submit that.'
    case 'title-too-short':
      return `Give it a short title — at least ${REQUEST_TITLE_MIN} characters.`
    case 'title-too-long':
      return `Keep the title under ${REQUEST_TITLE_MAX} characters.`
    case 'description-too-short':
      return `Say a little more about what you need — at least ${REQUEST_DESCRIPTION_MIN} characters.`
    case 'description-too-long':
      return `Keep it under ${REQUEST_DESCRIPTION_MAX} characters.`
    case 'invalid-email':
      return 'That email address does not look right.'
  }
}
