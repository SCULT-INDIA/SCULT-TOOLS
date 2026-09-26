import Link from 'next/link'
import { requireAdminPageSession } from '@/lib/admin/require-session'
import { PromptsList } from './PromptsList'

/** `instant = false` didn't cascade down from `app/admin/layout.tsx`'s own
 * copy — each /admin/* page still needs its own. See that file's
 * docblock for the full explanation. */
export const instant = false

export default async function AdminPromptsPage() {
  await requireAdminPageSession('/admin/prompts')

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl text-[var(--color-ink)]">Prompts</h1>
        <Link href="/admin/prompts/new" className="btn-brutal btn-brutal-sm">
          New prompt
        </Link>
      </div>
      <PromptsList />
    </div>
  )
}
