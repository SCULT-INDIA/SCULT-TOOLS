import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/admin/auth'

/** POST /api/admin/logout — clears the session cookie. No auth check
 * needed to call this: logging out an already-logged-out session is a
 * no-op, not a security concern. */
export async function POST(): Promise<NextResponse> {
  await destroySession()
  return NextResponse.json({ ok: true })
}
