'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

/** Publishes straight from a preview page, then lands on the real public
 * URL — seeing the live page is the confirmation that publishing worked.
 * Shared by the prompt and skill previews; renders nothing once published. */
export function PublishFromPreview({
  status,
  publishUrl,
  liveHref,
}: {
  status: string
  publishUrl: string
  liveHref: string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === 'published') return null

  async function publish() {
    setBusy(true)
    setError(null)
    const res = await fetch(publishUrl, { method: 'POST' })
    setBusy(false)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(
        body.errors?.map((e: { message: string }) => e.message).join(' ') ||
          'Failed to publish.',
      )
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
