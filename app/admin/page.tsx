import Link from 'next/link'
import { requireAdminPageSession } from '@/lib/admin/require-session'

/** `instant = false` didn't cascade down from `app/admin/layout.tsx`'s own
 * copy — each /admin/* page still needs its own. See that file's
 * docblock for the full explanation. */
export const instant = false

export default async function AdminDashboardPage() {
  await requireAdminPageSession()

  return (
    <div>
      <h1 className="mb-1 font-bold text-2xl text-[var(--color-ink)]">Admin</h1>
      <p className="mb-8 text-[var(--color-ink-subtle)] text-sm">
        Publish and manage prompts, skills, and custom categories.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/prompts"
          className="card-flat block p-5 hover:border-[var(--color-ink)]"
        >
          <h2 className="font-bold text-[var(--color-ink)]">Prompts</h2>
          <p className="mt-1 text-[var(--color-ink-subtle)] text-sm">
            Draft, edit, and publish prompts.
          </p>
        </Link>
        <Link
          href="/admin/skills"
          className="card-flat block p-5 hover:border-[var(--color-ink)]"
        >
          <h2 className="font-bold text-[var(--color-ink)]">Skills</h2>
          <p className="mt-1 text-[var(--color-ink-subtle)] text-sm">
            Upload a SKILL.md .zip and publish it.
          </p>
        </Link>
        <Link
          href="/admin/categories"
          className="card-flat block p-5 hover:border-[var(--color-ink)]"
        >
          <h2 className="font-bold text-[var(--color-ink)]">Categories</h2>
          <p className="mt-1 text-[var(--color-ink-subtle)] text-sm">
            Add a custom prompt or skill category.
          </p>
        </Link>
      </div>
    </div>
  )
}
