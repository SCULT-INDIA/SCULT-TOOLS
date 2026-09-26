import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

/** A Server Component on purpose: `instant` is route segment config, which
 * Next only reads from a server module — the form itself lives in
 * ./LoginForm.tsx. See app/admin/layout.tsx's docblock for why every
 * /admin/* page carries its own `instant = false`. The Suspense boundary
 * is for the form's `useSearchParams` (the `?next=` return URL). */
export const instant = false

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-[24rem] py-16">
      <h1 className="mb-6 font-bold text-2xl text-[var(--color-ink)]">Admin login</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
