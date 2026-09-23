import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { publishPrompt } from '@/lib/admin/prompts'
import { requireAdminSession } from '@/lib/admin/require-session'

/** POST /api/admin/prompts/[id]/publish — draft/unpublished/archived ->
 * published. Refuses with a 422 (not a 500) when publish-readiness fails
 * (currently: at least one `verifiedAgainst` entry). */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const denied = await requireAdminSession()
  if (denied) return denied

  const { id } = await params
  const result = await publishPrompt(id, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
}
