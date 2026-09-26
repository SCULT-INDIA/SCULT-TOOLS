import { redirect } from 'next/navigation'
import { hasValidSession } from './auth'
import { loginHref } from './client-errors'

/**
 * The Server Component gate every `/admin/*` and `/admin-preview/*` page
 * except `/admin/login` itself calls first, letting `redirect` throw rather
 * than rendering anything an unauthenticated visitor could see. (Route
 * Handlers have their own gate inside `adminRoute` — a handler is a real,
 * directly-callable HTTP endpoint and never trusts a page to have checked.)
 *
 * `returnTo` is the page's own path: after logging in, the admin lands
 * back on the form they were sent away from instead of the dashboard. The
 * login page only honours admin paths on this site (see `safeReturnTo`).
 */
export async function requireAdminPageSession(returnTo: string): Promise<void> {
  if (await hasValidSession()) return
  redirect(loginHref(returnTo))
}
