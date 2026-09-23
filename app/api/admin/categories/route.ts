import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { createCustomCategory } from '@/lib/admin/categories'
import { requireAdminSession } from '@/lib/admin/require-session'
import { getCustomCategories } from '@/lib/custom-categories'

/** GET /api/admin/categories?type=prompt|skill — every custom category of
 * one type, for the admin's own category picker. Read-only, but still
 * behind the session gate: the list itself isn't sensitive, but there is
 * no reason to expose an admin-only surface to anonymous callers. */
export async function GET(request: Request): Promise<NextResponse> {
  const denied = await requireAdminSession()
  if (denied) return denied

  const type = new URL(request.url).searchParams.get('type')
  if (type !== 'prompt' && type !== 'skill') {
    return NextResponse.json(
      { error: 'type must be "prompt" or "skill".' },
      { status: 400 },
    )
  }
  const categories = await getCustomCategories(type)
  return NextResponse.json({ categories })
}

/** POST /api/admin/categories — creates a new custom category. Body
 * matches `CreateCategoryInput` (lib/admin/categories.ts). */
export async function POST(request: Request): Promise<NextResponse> {
  const denied = await requireAdminSession()
  if (denied) return denied

  const body = await request.json().catch(() => null)
  const result = await createCustomCategory(body, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ slug: result.slug }, { status: 201 })
}
