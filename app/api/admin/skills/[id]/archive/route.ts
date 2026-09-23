import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { requireAdminSession } from '@/lib/admin/require-session'
import { archiveSkill } from '@/lib/admin/skills'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const denied = await requireAdminSession()
  if (denied) return denied

  const { id } = await params
  const result = await archiveSkill(decodeURIComponent(id), await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
}
