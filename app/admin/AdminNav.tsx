'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/prompts', label: 'Prompts' },
  { href: '/admin/skills', label: 'Skills' },
  { href: '/admin/categories', label: 'Categories' },
] as const

export function AdminNav({ email }: { email?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="border-[var(--color-line)] border-b bg-white">
      <div className="mx-auto flex max-w-[64rem] items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-5">
          {LINKS.map((link) => {
            const active =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname?.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? 'font-bold text-[var(--color-ink)] text-sm'
                    : 'text-[var(--color-ink-subtle)] text-sm hover:text-[var(--color-ink)]'
                }
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-4">
          {email && (
            <span className="text-[var(--color-ink-subtle)] text-sm">{email}</span>
          )}
          <button
            type="button"
            onClick={logout}
            className="text-[var(--color-ink-subtle)] text-sm hover:text-[var(--color-ink)]"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
