import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { adminRoute } from '@/lib/admin/route'
import { unpublishSkill } from '@/lib/admin/skills'

export const POST = adminRoute<{ id: string }>(async (_request, { params }) => {
  const { id } = await params
  const result = await unpublishSkill(decodeURIComponent(id), await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
})
