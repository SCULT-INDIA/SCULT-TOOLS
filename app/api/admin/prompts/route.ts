import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { createDraftPrompt, listAdminPrompts } from '@/lib/admin/prompts'
import { adminRoute } from '@/lib/admin/route'

/** GET /api/admin/prompts?status=draft|published|unpublished|archived —
 * the admin list view. `status` omitted returns every prompt regardless
 * of status. */
export const GET = adminRoute(async (request) => {
  const status = new URL(request.url).searchParams.get('status') ?? undefined
  const prompts = await listAdminPrompts(status)
  return NextResponse.json({ prompts })
})

/** POST /api/admin/prompts — creates a prompt as a draft. Body matches
 * `PromptInput` (lib/admin/prompts.ts); publishing is a separate,
 * explicit call to /api/admin/prompts/[id]/publish. */
export const POST = adminRoute(async (request) => {
  const body = await request.json().catch(() => null)
  const result = await createDraftPrompt(body, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug }, { status: 201 })
})
