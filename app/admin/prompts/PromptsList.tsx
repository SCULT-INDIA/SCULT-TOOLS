'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface PromptRow {
  readonly id: string
  readonly slug: string
  readonly category: string
  readonly title: string
  readonly status: string
  readonly updatedAt: string
}

const STATUS_FILTERS = ['all', 'draft', 'published', 'unpublished', 'archived'] as const

export function PromptsList() {
  const [prompts, setPrompts] = useState<PromptRow[]>([])
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('all')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const qs = filter === 'all' ? '' : `?status=${filter}`
    const res = await fetch(`/api/admin/prompts${qs}`)
    const body = await res.json()
    setPrompts(body.prompts ?? [])
    setLoading(false)
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  async function act(id: string, action: 'publish' | 'unpublish' | 'archive') {
    setBusyId(id)
    const res = await fetch(`/api/admin/prompts/${encodeURIComponent(id)}/${action}`, {
      method: 'POST',
    })
    setBusyId(null)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const msg = body.errors?.map((e: { message: string }) => e.message).join(' ')
      alert(msg || `Failed to ${action}.`)
      return
    }
    load()
  }

  /** Permanent, unlike the status actions above — confirmed before it
   * ever reaches the API, since there is no "Publish" to undo it with. */
  async function remove(id: string, title: string) {
    if (!window.confirm(`Delete "${title}" permanently? This cannot be undone.`)) return
    setBusyId(id)
    const res = await fetch(`/api/admin/prompts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    setBusyId(null)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const msg = body.errors?.map((e: { message: string }) => e.message).join(' ')
      alert(msg || 'Failed to delete.')
      return
    }
    load()
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={
              filter === s
                ? 'rounded-full bg-[var(--color-ink)] px-3 py-1 text-white text-xs'
                : 'rounded-full border border-[var(--color-line)] px-3 py-1 text-xs'
            }
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--color-ink-subtle)] text-sm">Loading…</p>
      ) : prompts.length === 0 ? (
        <p className="text-[var(--color-ink-subtle)] text-sm">No prompts.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-[var(--color-line)] border-b text-left text-[var(--color-ink-subtle)]">
              <th className="py-2">Title</th>
              <th className="py-2">Category</th>
              <th className="py-2">Status</th>
              <th className="py-2">Updated</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {prompts.map((p) => (
              <tr key={p.id} className="border-[var(--color-line)] border-b">
                <td className="py-2">
                  <Link
                    href={`/admin/prompts/${encodeURIComponent(p.id)}`}
                    className="hover:underline"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="py-2">{p.category}</td>
                <td className="py-2">{p.status}</td>
                <td className="py-2">{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td className="py-2 text-right">
                  <div className="flex justify-end gap-2">
                    {p.status !== 'published' && (
                      <button
                        type="button"
                        className="text-violet-700 hover:underline"
                        disabled={busyId === p.id}
                        onClick={() => act(p.id, 'publish')}
                      >
                        Publish
                      </button>
                    )}
                    {p.status === 'published' && (
                      <button
                        type="button"
                        className="text-[var(--color-ink-subtle)] hover:underline"
                        disabled={busyId === p.id}
                        onClick={() => act(p.id, 'unpublish')}
                      >
                        Unpublish
                      </button>
                    )}
                    {p.status !== 'archived' && (
                      <button
                        type="button"
                        className="text-red-600 hover:underline"
                        disabled={busyId === p.id}
                        onClick={() => act(p.id, 'archive')}
                      >
                        Archive
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      disabled={busyId === p.id}
                      onClick={() => remove(p.id, p.title)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
