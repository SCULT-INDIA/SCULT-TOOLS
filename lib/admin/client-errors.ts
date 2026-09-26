export interface FieldError {
  readonly field: string
  readonly message: string
}

/**
 * One reading of an admin API failure for every admin form and list.
 * Before this, each caller read only `body.errors` and fell back to a
 * literal "Request failed." — so a 401 (session expired), a 403, a 429, or
 * the wrapper's named configuration error all showed the same useless
 * line. Returns the field errors the form should render; the caller
 * checks `unauthenticated` and sends the admin back to the login page.
 */
export async function readApiFailure(
  res: Response,
): Promise<{ errors: FieldError[]; unauthenticated: boolean }> {
  const body = (await res.json().catch(() => null)) as {
    errors?: FieldError[]
    error?: string
  } | null
  if (body?.errors && body.errors.length > 0) {
    return { errors: body.errors, unauthenticated: res.status === 401 }
  }
  const message =
    body?.error ??
    (res.status === 401
      ? 'Your session has expired — log in again.'
      : res.status === 413
        ? 'That submission is too large for the server to accept.'
        : res.status === 429
          ? 'Too many requests — wait a moment and try again.'
          : `The server answered HTTP ${res.status} with no details.`)
  return { errors: [{ field: '(root)', message }], unauthenticated: res.status === 401 }
}

/** The URL of the login page, carrying where to come back to afterwards. */
export function loginHref(returnTo: string): string {
  return `/admin/login?next=${encodeURIComponent(returnTo)}`
}

/**
 * Only ever return to an admin page on this site. A `next` that points
 * anywhere else — another host, a protocol-relative `//evil`, a public
 * page — falls back to the dashboard, so a crafted login link can't be
 * turned into an open redirect.
 */
export function safeReturnTo(next: string | null | undefined): string {
  if (next && /^\/admin(-preview)?(\/|$)/.test(next) && !next.startsWith('//'))
    return next
  return '/admin'
}
