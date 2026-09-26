import { requireAdminPageSession } from '@/lib/admin/require-session'
import { CategoryForm } from './CategoryForm'

/** `instant = false` didn't cascade down from `app/admin/layout.tsx`'s own
 * copy — each /admin/* page still needs its own. See that file's
 * docblock for the full explanation. */
export const instant = false

export default async function AdminCategoriesPage() {
  await requireAdminPageSession('/admin/categories')

  return (
    <div>
      <h1 className="mb-6 font-bold text-2xl text-[var(--color-ink)]">New category</h1>
      <CategoryForm />
    </div>
  )
}
