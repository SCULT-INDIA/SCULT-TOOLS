import Link from 'next/link'
import { checkAdminHealth } from '@/lib/admin/health'
import { requireAdminPageSession } from '@/lib/admin/require-session'

/** `instant = false` didn't cascade down from `app/admin/layout.tsx`'s own
 * copy — each /admin/* page still needs its own. See that file's
 * docblock for the full explanation. */
export const instant = false

export default async function AdminDashboardPage() {
  await requireAdminPageSession('/admin')
  const health = await checkAdminHealth()
  const problems = health.missingEnv.length > 0 || !health.database.ok

  return (
    <div>
      <h1 className="mb-1 font-bold text-2xl text-[var(--color-ink)]">Admin</h1>
      <p className="mb-8 text-[var(--color-ink-subtle)] text-sm">
        Publish and manage prompts, skills, and custom categories.
      </p>

      {problems ? (
        <div className="mb-8 rounded-[var(--radius-sm)] border border-red-300 bg-red-50 p-4 text-red-800 text-sm">
          <p className="font-bold">This deployment is not fully configured</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {health.missingEnv.map((v) => (
              <li key={v.name}>
                <code className="font-mono">{v.name}</code> is not set — {v.purpose}.
              </li>
            ))}
            {!health.database.ok &&
            !health.missingEnv.some((v) => v.name === 'SUPABASE_DB_URL') ? (
              <li>
                The database did not answer:{' '}
                <span className="font-mono">{health.database.message}</span>
              </li>
            ) : null}
          </ul>
          <p className="mt-2">
            Creating or editing anything will fail until this is fixed. Set the variable
            in the hosting dashboard (Vercel → Project → Settings → Environment Variables)
            and redeploy.
          </p>
        </div>
      ) : (
        <p className="mb-8 text-[13px] text-green-700">
          Configuration OK — database reachable, every required variable set.
        </p>
      )}

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
