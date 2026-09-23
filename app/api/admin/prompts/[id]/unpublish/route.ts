import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { unpublishPrompt } from '@/lib/admin/prompts'
import { requireAdminSession } from '@/lib/admin/require-session'

/** POST /api/admin/prompts/[id]/unpublish — published -> unpublished. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const denied = await requireAdminSession()
  if (denied) return denied

  const { id } = await params
  const result = await unpublishPrompt(id, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
}
