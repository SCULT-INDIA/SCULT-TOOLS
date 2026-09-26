'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { safeReturnTo } from '@/lib/admin/client-errors'

/** Local dev checks `.env.local`, production checks the hosting env — two
 * separately-set hashes, so "the production password fails on localhost"
 * is the usual cause of a 401 in dev. Only shown when running `next dev`. */
const DEV_MISMATCH_HINT =
  'On localhost the password is checked against ADMIN_PASSWORD_HASH in .env.local, which can differ from production. Set it with: npm run admin:password — then restart the dev server.'

export function LoginForm() {
  const router = useRouter()
  const returnTo = safeReturnTo(useSearchParams().get('next'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // A pasted password very often carries a trailing space or newline, which
  // is invisible behind the dots and makes an otherwise-correct password
  // fail. Warn rather than silently trim: a real password may contain them.
  const hasEdgeWhitespace = password !== '' && password !== password.trim()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    let res: Response
    try {
      res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
    } catch {
      setSubmitting(false)
      setError('Could not reach the server. Check your connection and try again.')
      return
    }
    setSubmitting(false)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const message: string = body.error ?? 'Login failed.'
      setError(
        res.status === 401 && process.env.NODE_ENV === 'development'
          ? `${message} ${DEV_MISMATCH_HINT}`
          : message,
      )
      return
    }
    // Next keeps the previous page mounted (hidden) in its router cache
    // for a soft navigation, so the controlled input would otherwise keep
    // the typed password in the DOM until a full reload.
    setPassword('')
    setShowPassword(false)
    router.push(returnTo)
    router.refresh()
  }

  function trackCapsLock(e: React.KeyboardEvent<HTMLInputElement>) {
    setCapsLock(e.getModifierState('CapsLock'))
  }

  return (
    // suppressHydrationWarning on the form and its inputs: GA4's form-
    // interaction tracking stamps data-gtm-form-interact-* attributes on
    // them as soon as someone focuses a field, which can land before React
    // hydrates (slow dev builds especially) and is otherwise reported as a
    // hydration mismatch. It only silences attribute diffs on these nodes.
    <form onSubmit={onSubmit} className="space-y-4" suppressHydrationWarning>
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          suppressHydrationWarning
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
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            suppressHydrationWarning
            className="field pr-12"
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={trackCapsLock}
            onKeyUp={trackCapsLock}
            onBlur={() => setCapsLock(false)}
            aria-describedby="password-hints"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            aria-controls="password"
            className="-translate-y-1/2 absolute top-1/2 right-2 flex size-9 items-center justify-center rounded-full text-ink-subtle hover:bg-black/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-violet-600"
          >
            {showPassword ? (
              <EyeOff className="size-5" aria-hidden="true" />
            ) : (
              <Eye className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
        <div id="password-hints" aria-live="polite" className="mt-1 space-y-0.5">
          {capsLock ? <p className="text-amber-700 text-sm">Caps Lock is on.</p> : null}
          {hasEdgeWhitespace ? (
            <p className="text-amber-700 text-sm">
              Your password starts or ends with a space — pasted passwords often pick one
              up.
            </p>
          ) : null}
        </div>
      </div>
      {error && (
        <p role="alert" className="text-red-600 text-sm">
          {error}
        </p>
      )}
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
