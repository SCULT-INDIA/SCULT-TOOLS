import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { unpublishPrompt } from '@/lib/admin/prompts'
import { adminRoute } from '@/lib/admin/route'

/** POST /api/admin/prompts/[id]/unpublish — published -> unpublished. The
 * public page stops being served; the content is kept for re-publishing. */
export const POST = adminRoute<{ id: string }>(async (_request, { params }) => {
  const { id } = await params
  const result = await unpublishPrompt(id, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug })
})
