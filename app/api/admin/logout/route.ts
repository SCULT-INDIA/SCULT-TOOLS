import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/admin/auth'
import { adminRoute } from '@/lib/admin/route'

/** POST /api/admin/logout — clears the session cookie. No session check
 * needed: logging out an already-logged-out session is a no-op, not a
 * security concern. (Still same-origin only, via `adminRoute`.) */
export const POST = adminRoute(
  async () => {
    await destroySession()
    return NextResponse.json({ ok: true })
  },
  { public: true },
)
