import { requireAdminPageSession } from '@/lib/admin/require-session'
import { PromptForm } from '../PromptForm'

/** `instant = false` didn't cascade down from `app/admin/layout.tsx`'s own
 * copy — each /admin/* page still needs its own. See that file's
 * docblock for the full explanation. */
export const instant = false

export default async function NewPromptPage() {
  await requireAdminPageSession('/admin/prompts/new')

  return (
    <div>
      <h1 className="mb-6 font-bold text-2xl text-[var(--color-ink)]">New prompt</h1>
      <PromptForm />
    </div>
  )
}
