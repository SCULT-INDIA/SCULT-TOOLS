'use client'

import { useCallback, useEffect, useState } from 'react'

interface SkillRow {
  readonly id: string
  readonly slug: string
  readonly category: string
  readonly name: string
  readonly status: string
  readonly updatedAt: string
}

export function SkillsList() {
  const [skills, setSkills] = useState<SkillRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/skills')
    const body = await res.json()
    setSkills(body.skills ?? [])
    setLoading(false)
  }, [])

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
      const body = await res.json().catch(() => ({}))
      const msg = body.errors?.map((e: { message: string }) => e.message).join(' ')
      alert(msg || `Failed to ${action}.`)
      return
    }
    load()
  }

  if (loading) return <p className="text-[var(--color-ink-subtle)] text-sm">Loading…</p>
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
