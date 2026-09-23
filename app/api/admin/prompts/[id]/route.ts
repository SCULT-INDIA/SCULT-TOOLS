import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { deletePrompt, getAdminPrompt, updatePrompt } from '@/lib/admin/prompts'
import { requireAdminSession } from '@/lib/admin/require-session'

/** GET /api/admin/prompts/[id] — one prompt's full content, for the edit
 * form to load. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const denied = await requireAdminSession()
  if (denied) return denied

  const { id } = await params
  const prompt = await getAdminPrompt(id)
  if (!prompt) {
    return NextResponse.json({ error: 'No prompt with that id.' }, { status: 404 })
  }
  return NextResponse.json({ prompt })
}

/** PATCH /api/admin/prompts/[id] — edits a prompt's content at any
 * status. Does not change status (publish/unpublish/archive are their
 * own endpoints) — see lib/admin/prompts.ts's `updatePrompt` docblock. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const denied = await requireAdminSession()
  if (denied) return denied

  const { id } = await params
  const body = await request.json().catch(() => null)
  const result = await updatePrompt(id, body, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
}

/** DELETE /api/admin/prompts/[id] — permanently removes the row. No undo;
 * the admin UI confirms with the user before ever calling this. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const denied = await requireAdminSession()
  if (denied) return denied

  const { id } = await params
  const result = await deletePrompt(id, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
}
