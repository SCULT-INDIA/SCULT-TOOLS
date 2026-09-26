import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { adminRoute } from '@/lib/admin/route'
import { deleteSkill, updateSkill } from '@/lib/admin/skills'

type Params = { id: string }

/** PATCH /api/admin/skills/[id] — edits an admin skill's content at any
 * status. Status changes have their own endpoints. The id is decoded
 * because admin skill ids contain slashes (`admin/<category>/<slug>`). */
export const PATCH = adminRoute<Params>(async (request, { params }) => {
  const { id } = await params
  const body = await request.json().catch(() => null)
  const result = await updateSkill(decodeURIComponent(id), body, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
})

/** DELETE /api/admin/skills/[id] — permanently removes the row. No undo;
 * the admin UI confirms with the user before ever calling this. */
export const DELETE = adminRoute<Params>(async (_request, { params }) => {
  const { id } = await params
  const result = await deleteSkill(decodeURIComponent(id), await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
})
