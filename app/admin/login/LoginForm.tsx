'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { safeReturnTo } from '@/lib/admin/client-errors'

export function LoginForm() {
  const router = useRouter()
  const returnTo = safeReturnTo(useSearchParams().get('next'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    setSubmitting(false)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Login failed.')
      return
    }
    // Next keeps the previous page mounted (hidden) in its router cache
    // for a soft navigation, so the controlled input would otherwise keep
    // the typed password in the DOM until a full reload.
    setPassword('')
    router.push(returnTo)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="field"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="field"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        className="btn-brutal w-full"
        disabled={submitting || !email || !password}
      >
        {submitting ? 'Checking…' : 'Log in'}
      </button>
    </form>
  )
}
