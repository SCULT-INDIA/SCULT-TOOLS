'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { loginHref, readApiFailure } from '@/lib/admin/client-errors'

interface SkillRow {
  readonly id: string
  readonly slug: string
  readonly category: string
  readonly name: string
  readonly status: string
  readonly updatedAt: string
}

export function SkillsList() {
  const router = useRouter()
  const [skills, setSkills] = useState<SkillRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  // See PromptsList: a failed load must show the server's message, and an
  // expired session must go to login — not sit on "Loading…" forever.
  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch('/api/admin/skills')
      if (!res.ok) {
        const { errors, unauthenticated } = await readApiFailure(res)
        if (unauthenticated) {
          router.push(loginHref(window.location.pathname))
          return
        }
        setLoadError(errors.map((e) => e.message).join(' '))
        return
      }
      const body = await res.json()
      setSkills(body.skills ?? [])
    } catch {
      setLoadError('Could not reach the server. Check your connection and reload.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  async function act(id: string, action: 'publish' | 'unpublish' | 'archive') {
    setBusyId(id)
    const res = await fetch(`/api/admin/skills/${encodeURIComponent(id)}/${action}`, {
      method: 'POST',
    })
    setBusyId(null)
    if (!res.ok) {
      const { errors, unauthenticated } = await readApiFailure(res)
      if (unauthenticated) {
        router.push(loginHref(window.location.pathname))
        return
      }
      alert(errors.map((e) => e.message).join(' ') || `Failed to ${action}.`)
      return
    }
    load()
  }

  if (loading) return <p className="text-[var(--color-ink-subtle)] text-sm">Loading…</p>
  if (loadError)
    return (
      <div className="rounded-[var(--radius-sm)] border border-red-300 bg-red-50 p-3 text-red-700 text-sm">
        <p>{loadError}</p>
        <button type="button" onClick={() => load()} className="mt-2 underline">
          Retry
        </button>
      </div>
    )
  if (skills.length === 0)
    return (
      <p className="text-[var(--color-ink-subtle)] text-sm">
        No admin-authored skills yet.
      </p>
    )

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-[var(--color-line)] border-b text-left text-[var(--color-ink-subtle)]">
          <th className="py-2">Name</th>
          <th className="py-2">Category</th>
          <th className="py-2">Status</th>
          <th className="py-2">Updated</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {skills.map((s) => (
          <tr key={s.id} className="border-[var(--color-line)] border-b">
            <td className="py-2">
              <a
                href={`/admin/skills/${encodeURIComponent(s.id)}`}
                className="hover:underline"
              >
                {s.name}
              </a>
            </td>
            <td className="py-2">{s.category}</td>
            <td className="py-2">{s.status}</td>
            <td className="py-2">{new Date(s.updatedAt).toLocaleDateString()}</td>
            <td className="py-2 text-right">
              <div className="flex justify-end gap-2">
                <a
                  href={`/admin/skills/${encodeURIComponent(s.id)}`}
                  className="text-violet-700 hover:underline"
                >
                  Edit
                </a>
                <a
                  href={`/admin-preview/skills/${encodeURIComponent(s.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-700 hover:underline"
                >
                  Preview
                </a>
                {s.status !== 'published' && (
                  <button
                    type="button"
                    className="text-violet-700 hover:underline"
                    disabled={busyId === s.id}
                    onClick={() => act(s.id, 'publish')}
                  >
                    Publish
                  </button>
                )}
                {s.status === 'published' && (
                  <button
                    type="button"
                    className="text-[var(--color-ink-subtle)] hover:underline"
                    disabled={busyId === s.id}
                    onClick={() => act(s.id, 'unpublish')}
                  >
                    Unpublish
                  </button>
                )}
                {s.status !== 'archived' && (
                  <button
                    type="button"
                    className="text-red-600 hover:underline"
                    disabled={busyId === s.id}
                    onClick={() => act(s.id, 'archive')}
                  >
                    Archive
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
