import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { publishPrompt } from '@/lib/admin/prompts'
import { adminRoute } from '@/lib/admin/route'

/** POST /api/admin/prompts/[id]/publish — draft/unpublished -> published,
 * after the publish-readiness checks in lib/admin/prompts.ts. */
export const POST = adminRoute<{ id: string }>(async (_request, { params }) => {
  const { id } = await params
  const result = await publishPrompt(id, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
})
