'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'

interface CustomCategory {
  readonly slug: string
  readonly name: string
}

interface FieldError {
  readonly field: string
  readonly message: string
}

export function SkillUploadForm() {
  const router = useRouter()
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])
  const [zip, setZip] = useState<File | null>(null)
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [errors, setErrors] = useState<FieldError[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/admin/categories?type=skill')
      .then((r) => r.json())
      .then((body) => setCustomCategories(body.categories ?? []))
      .catch(() => {})
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors([])
    if (!zip) {
      setErrors([{ field: 'zip', message: 'A .zip file is required.' }])
      return
    }

    const metadata = {
      slug,
      category,
      authorName: authorName.trim() || undefined,
    }

    const form = new FormData()
    form.set('zip', zip)
    form.set('metadata', JSON.stringify(metadata))

    setSubmitting(true)
    const res = await fetch('/api/admin/skills', { method: 'POST', body: form })
    setSubmitting(false)

    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setErrors(body.errors ?? [{ field: '(root)', message: 'Upload failed.' }])
      return
    }
    router.push(`/admin-preview/skills/${encodeURIComponent(body.id)}`)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {errors.length > 0 && (
        <ul className="rounded-[var(--radius-sm)] border border-red-300 bg-red-50 p-3 text-red-700 text-sm">
          {errors.map((e) => (
            <li key={`${e.field}-${e.message}`}>
              <strong>{e.field}:</strong> {e.message}
            </li>
          ))}
        </ul>
      )}

      <div>
        <label htmlFor="zip" className="label">
          SKILL.md .zip
        </label>
        <input
          id="zip"
          type="file"
          accept=".zip"
          className="field"
          onChange={(e) => setZip(e.target.files?.[0] ?? null)}
        />
        <p className="hint mt-1">
          A .zip containing SKILL.md at its root (or in one top-level folder).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className="label">
            Slug
          </label>
          <input
            id="slug"
            className="field"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="category" className="label">
            Category
          </label>
          <input
            id="category"
            className="field"
            list="skill-category-options"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="skill-category-options">
            {SKILL_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
            {customCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label htmlFor="authorName" className="label">
          Author name (optional)
        </label>
        <input
          id="authorName"
          className="field"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-brutal" disabled={submitting}>
        {submitting ? 'Uploading…' : 'Create draft'}
      </button>
    </form>
  )
}
