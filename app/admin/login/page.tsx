import { LoginForm } from './LoginForm'

/** A Server Component on purpose: `instant` is route segment config, which
 * Next only reads from a server module — the form itself lives in
 * ./LoginForm.tsx. See app/admin/layout.tsx's docblock for why every
 * /admin/* page carries its own `instant = false`. */
export const instant = false

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-[24rem] py-16">
      <h1 className="mb-6 font-bold text-2xl text-[var(--color-ink)]">Admin login</h1>
      <LoginForm />
    </div>
  )
}
