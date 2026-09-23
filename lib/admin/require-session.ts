import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { hasValidSession } from './auth'

/**
 * The one gate every `/api/admin/*` Route Handler calls first. Page-level
 * protection (app/admin/layout.tsx redirecting to /admin/login) covers
 * the browser UI, but a Route Handler is a real, directly-callable HTTP
 * endpoint — it needs its own server-side check regardless of what any
 * page did, the same "never trust the client to have already checked"
 * rule every other API route in this codebase already follows.
 *
 * Returns a 401 `NextResponse` to return immediately when unauthenticated,
 * or `undefined` when the caller may proceed:
 *
 *   const denied = await requireAdminSession()
 *   if (denied) return denied
 */
export async function requireAdminSession(): Promise<NextResponse | undefined> {
  if (await hasValidSession()) return undefined
  return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
}

/** The Server Component counterpart to `requireAdminSession` — every
 * `/admin/*` page except `/admin/login` itself calls this first and lets
 * `redirect` throw, rather than rendering anything an unauthenticated
 * visitor could see. */
export async function requireAdminPageSession(): Promise<void> {
  if (await hasValidSession()) return
  redirect('/admin/login')
}
