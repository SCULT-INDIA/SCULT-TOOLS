'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { loginHref, readApiFailure } from '@/lib/admin/client-errors'

/** Publish / Unpublish / Archive / Delete for one item on its edit page —
 * shared by prompts and skills, which expose the same endpoint shape under
 * `apiBase` (`<apiBase>/publish`, `<apiBase>/unpublish`, `<apiBase>/archive`,
 * and `DELETE <apiBase>`). */
export function StatusActions({
  apiBase,
  status,
  title,
  listHref,
}: {
  apiBase: string
  status: string
  title: string
  listHref: string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function act(action: 'publish' | 'unpublish' | 'archive') {
    setBusy(true)
    setError(null)
    const res = await fetch(`${apiBase}/${action}`, { method: 'POST' })
    setBusy(false)
    if (!res.ok) {
      const { errors, unauthenticated } = await readApiFailure(res)
      if (unauthenticated) {
        router.push(loginHref(window.location.pathname))
        return
      }
      setError(errors.map((e) => e.message).join(' ') || `Failed to ${action}.`)
      return
    }
    router.refresh()
  }

  /** Permanent, unlike the status actions above — confirmed before it
   * ever reaches the API, since there is no "Publish" to undo it with. */
  async function remove() {
    if (!window.confirm(`Delete "${title}" permanently? This cannot be undone.`)) return
    setBusy(true)
    setError(null)
    const res = await fetch(apiBase, { method: 'DELETE' })
    setBusy(false)
    if (!res.ok) {
      const { errors, unauthenticated } = await readApiFailure(res)
      if (unauthenticated) {
        router.push(loginHref(window.location.pathname))
        return
      }
      setError(errors.map((e) => e.message).join(' ') || 'Failed to delete.')
      return
    }
    router.push(listHref)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="rounded-full border border-[var(--color-line)] px-3 py-1 text-xs">
        {status}
      </span>
      {status !== 'published' && (
        <button
          type="button"
          className="btn-brutal btn-brutal-sm"
          disabled={busy}
          onClick={() => act('publish')}
        >
          Publish
        </button>
      )}
      {status === 'published' && (
        <button
          type="button"
          className="rounded-full border border-[var(--color-line)] px-3 py-1 text-sm"
          disabled={busy}
          onClick={() => act('unpublish')}
        >
          Unpublish
        </button>
      )}
      {status !== 'archived' && (
        <button
          type="button"
          className="text-red-600 text-sm hover:underline"
          disabled={busy}
          onClick={() => act('archive')}
        >
          Archive
        </button>
      )}
      <button
        type="button"
        className="text-red-600 text-sm hover:underline"
        disabled={busy}
        onClick={remove}
      >
        Delete
      </button>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  )
}
