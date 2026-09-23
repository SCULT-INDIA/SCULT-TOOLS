import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { requireAdminSession } from '@/lib/admin/require-session'
import { deleteSkill, updateSkill } from '@/lib/admin/skills'

/** PATCH /api/admin/skills/[id] — edits an admin skill's content at any
 * status. Status changes have their own endpoints. The id is decoded
 * because admin skill ids contain slashes (`admin/<category>/<slug>`). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const denied = await requireAdminSession()
  if (denied) return denied

  const { id } = await params
  const body = await request.json().catch(() => null)
  const result = await updateSkill(decodeURIComponent(id), body, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
}

/** DELETE /api/admin/skills/[id] — permanently removes the row. No undo;
 * the admin UI confirms with the user before ever calling this. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const denied = await requireAdminSession()
  if (denied) return denied

  const { id } = await params
  const result = await deleteSkill(decodeURIComponent(id), await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
}
