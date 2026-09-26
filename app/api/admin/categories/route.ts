import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { createCustomCategory, deleteCustomCategory } from '@/lib/admin/categories'
import { adminRoute } from '@/lib/admin/route'
import { getCustomCategories } from '@/lib/custom-categories'

/** GET /api/admin/categories?type=prompt|skill — every custom category of
 * one type, for the admin's own category picker. Read-only, but still
 * behind the session gate: the list itself isn't sensitive, but there is
 * no reason to expose an admin-only surface to anonymous callers. */
export const GET = adminRoute(async (request) => {
  const type = new URL(request.url).searchParams.get('type')
  if (type !== 'prompt' && type !== 'skill') {
    return NextResponse.json(
      { error: 'type must be "prompt" or "skill".' },
      { status: 400 },
    )
  }
  const categories = await getCustomCategories(type)
  return NextResponse.json({ categories })
})

/** POST /api/admin/categories — creates a new custom category. Body
 * matches `CreateCategoryInput` (lib/admin/categories.ts). */
export const POST = adminRoute(async (request) => {
  const body = await request.json().catch(() => null)
  const result = await createCustomCategory(body, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ slug: result.slug }, { status: 201 })
})

/** DELETE /api/admin/categories?type=prompt|skill&slug=… — removes a custom
 * category that nothing uses (409 with a count otherwise). */
export const DELETE = adminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const type = params.get('type')
  const slug = params.get('slug')?.trim()
  if ((type !== 'prompt' && type !== 'skill') || !slug) {
    return NextResponse.json(
      { error: 'type ("prompt" or "skill") and slug are required.' },
      { status: 400 },
    )
  }
  const result = await deleteCustomCategory(type, slug, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: result.status })
  }
  return NextResponse.json({ ok: true })
})
