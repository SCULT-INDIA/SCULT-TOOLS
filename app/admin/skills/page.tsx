import Link from 'next/link'
import { requireAdminPageSession } from '@/lib/admin/require-session'
import { SkillsList } from './SkillsList'

/** `instant = false` didn't cascade down from `app/admin/layout.tsx`'s own
 * copy — each /admin/* page still needs its own. See that file's
 * docblock for the full explanation. */
export const instant = false

export default async function AdminSkillsPage() {
  await requireAdminPageSession()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl text-[var(--color-ink)]">Skills</h1>
        <Link href="/admin/skills/new" className="btn-brutal btn-brutal-sm">
          Upload skill
        </Link>
      </div>
      <SkillsList />
    </div>
  )
}
