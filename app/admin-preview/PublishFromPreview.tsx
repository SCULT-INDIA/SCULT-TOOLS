'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { loginHref, readApiFailure } from '@/lib/admin/client-errors'

/** Publishes straight from a preview page, then lands on the real public
 * URL — seeing the live page is the confirmation that publishing worked.
 * Shared by the prompt and skill previews; renders nothing once published. */
export function PublishFromPreview({
  status,
  publishUrl,
  liveHref,
  blockers = [],
}: {
  status: string
  publishUrl: string
  liveHref: string
  /** What still stops this from publishing (an auto-saved draft is often
   * unfinished) — shown up front instead of the button, so the admin
   * isn't sent to click Publish just to be told no. */
  blockers?: readonly string[]
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === 'published') return null
  if (blockers.length > 0) {
    return (
      <span className="max-w-[28rem] text-right text-[12px] text-ink">
        Not ready to publish: {blockers.join(' ')}
      </span>
    )
  }

  async function publish() {
    setBusy(true)
    setError(null)
    const res = await fetch(publishUrl, { method: 'POST' })
    setBusy(false)
    if (!res.ok) {
      const { errors, unauthenticated } = await readApiFailure(res)
      if (unauthenticated) {
        router.push(loginHref(window.location.pathname))
        return
      }
      setError(errors.map((e) => e.message).join(' ') || 'Failed to publish.')
      return
    }
    router.push(liveHref)
  }

  return (
    <span className="flex items-center gap-2">
      {error && <span className="text-[12px] text-red-700">{error}</span>}
      <button
        type="button"
        onClick={publish}
        disabled={busy}
        className="rounded-pill border border-ink bg-white px-3 py-1 font-semibold text-[13px] text-ink hover:bg-cream"
      >
        {busy ? 'Publishing…' : 'Publish'}
      </button>
    </span>
  )
}
