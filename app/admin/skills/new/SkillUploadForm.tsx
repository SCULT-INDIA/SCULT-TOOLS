'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { loginHref, readApiFailure } from '@/lib/admin/client-errors'
import { normalizeSlug, normalizeSlugInput, slugify } from '@/lib/admin/slug'
import { useFormDraft } from '@/lib/admin/use-form-draft'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import { DraftBanner } from '../../DraftBanner'

interface CustomCategory {
  readonly slug: string
  readonly name: string
}

interface FieldError {
  readonly field: string
  readonly message: string
}

interface DraftSnapshot {
  readonly slug: string
  readonly slugTouched: boolean
  readonly category: string
  readonly authorName: string
}

const EMPTY_DRAFT: DraftSnapshot = {
  slug: '',
  slugTouched: false,
  category: '',
  authorName: '',
}

export function SkillUploadForm() {
  const router = useRouter()
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])
  const [zip, setZip] = useState<File | null>(null)
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [category, setCategory] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [errors, setErrors] = useState<FieldError[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/admin/categories?type=skill')
      .then((r) => (r.ok ? r.json() : { categories: [] }))
      .then((body) => setCustomCategories(body.categories ?? []))
      .catch(() => {})
  }, [])

  // Everything but the file survives a refresh — a browser can't keep a
  // File across page loads, so the banner asks for it again.
  const restore = useCallback((d: DraftSnapshot) => {
    setSlug(d.slug)
    setSlugTouched(d.slugTouched)
    setCategory(d.category)
    setAuthorName(d.authorName)
  }, [])
  const draft = useFormDraft(
    'skill:new',
    { slug, slugTouched, category, authorName } satisfies DraftSnapshot,
    { initial: EMPTY_DRAFT, restore },
  )

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors([])
    if (!zip) {
      setErrors([{ field: 'zip', message: 'A .zip file is required.' }])
      return
    }

    const metadata = {
      slug: normalizeSlug(slug),
      category,
      authorName: authorName.trim() || undefined,
    }

    const form = new FormData()
    form.set('zip', zip)
    form.set('metadata', JSON.stringify(metadata))

    setSubmitting(true)
    let res: Response
    try {
      res = await fetch('/api/admin/skills', { method: 'POST', body: form })
    } catch {
      setSubmitting(false)
      setErrors([
        {
          field: '(root)',
          message: 'Could not reach the server. Check your connection and try again.',
        },
      ])
      return
    }
    setSubmitting(false)

    if (!res.ok) {
      const { errors: apiErrors, unauthenticated } = await readApiFailure(res)
      if (unauthenticated) {
        router.push(loginHref(window.location.pathname))
        return
      }
      setErrors(apiErrors)
      return
    }
    const body = await res.json()
    draft.clear()
    router.push(`/admin-preview/skills/${encodeURIComponent(body.id)}`)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <DraftBanner
        restoredAt={draft.restoredAt}
        onDiscard={draft.discard}
        note="Select the .zip file again — a file can't be kept between page loads."
      />

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
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null
            setZip(file)
            // "resume-audit-kit.zip" → "resume-audit-kit": the file name is
            // almost always the slug the admin wants, so it's the default
            // until they edit the slug field themselves.
            if (file && !slugTouched) setSlug(slugify(file.name.replace(/\.zip$/i, '')))
          }}
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
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(normalizeSlugInput(e.target.value))
            }}
            onBlur={() => setSlug((s) => normalizeSlug(s))}
          />
          <p className="hint mt-1">
            Pre-filled from the .zip file name — edit to customize.
          </p>
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
