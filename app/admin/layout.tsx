import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getSessionEmail, hasValidSession } from '@/lib/admin/auth'
import { AdminNav } from './AdminNav'

/** Never indexed, never crawled — an internal tool, not a public surface. */
export const metadata: Metadata = {
  title: 'Admin — tools.scult.in',
  robots: { index: false, follow: false },
}

/**
 * Every /admin/* page is behind a real login and reads the session cookie
 * (`hasValidSession()`/`requireAdminPageSession()`, both call `cookies()`)
 * — there is no static shell worth prerendering here, since the response
 * always depends on who's asking. Cache Components tries to statically
 * evaluate a route anyway unless told not to, and hits a *second* blocking
 * point doing it: `HeaderGate` (rendered from the root layout around
 * every page, admin included) reads `usePathname()`, which is equally
 * unavailable at prerender time. `cookies()` alone only ever logged a
 * console warning and still rendered; the two together escalated to a
 * genuine blocking dev-server error overlay on `/admin/prompts/[id]` —
 * reproduced live, not hypothetical. `instant = false` opts this whole
 * subtree out of prerendering (Next 16 Cache Components' route-segment
 * config for exactly this "always dynamic, never static" case), which is
 * the same effect `export const dynamic = 'force-dynamic'` gave under the
 * pre-Cache-Components model. Fixing `HeaderGate` itself is a site-wide
 * change (it wraps the header on literally every route, admin and public
 * alike) and out of scope for what is, underneath it, a login-gated tool.
 *
 * Set here for documentation and defense-in-depth, but it does NOT
 * cascade to child pages the way `export const dynamic` traditionally
 * did — confirmed live: `/admin/prompts/[id]` kept throwing the same
 * blocking-prerender error (this time from `getAdminPrompt`'s own
 * uncached `adminPool().query()`) with only this copy in place. Every
 * /admin/* `page.tsx` carries its own copy of this same export; this one
 * is the canonical explanation they all point back to.
 */
export const instant = false

/** Shell for every /admin/* route. Shows the nav only when a session
 * already exists (so /admin/login renders without it); the actual
 * page-level auth gate is each page's own `requireAdminPageSession()`
 * call, since a layout redirect here would also block /admin/login. */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await hasValidSession()
  const email = authed ? await getSessionEmail() : undefined
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      {authed && <AdminNav email={email} />}
      <main className="mx-auto max-w-[64rem] px-4 py-8">{children}</main>
    </div>
  )
}
