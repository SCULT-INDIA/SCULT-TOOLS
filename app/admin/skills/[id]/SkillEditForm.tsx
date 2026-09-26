'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { loginHref, readApiFailure } from '@/lib/admin/client-errors'
import { normalizeSlug, normalizeSlugInput } from '@/lib/admin/slug'
import { useFormDraft } from '@/lib/admin/use-form-draft'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import { DraftBanner } from '../../DraftBanner'

interface FieldError {
  readonly field: string
  readonly message: string
}

interface CustomCategory {
  readonly slug: string
  readonly name: string
}

export interface SkillEditInitial {
  readonly id: string
  readonly slug: string
  readonly category: string
  readonly name: string
  readonly description: string
  readonly body: string
}

/** The editable parts of an admin skill — exactly what a visitor sees or
 * downloads: name, URL, category, description, and the SKILL.md content. */
export function SkillEditForm({ initial }: { initial: SkillEditInitial }) {
  const router = useRouter()
  const [name, setName] = useState(initial.name)
  const [slug, setSlug] = useState(initial.slug)
  const [category, setCategory] = useState(initial.category)
  const [description, setDescription] = useState(initial.description)
  const [body, setBody] = useState(initial.body)
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])
  const [errors, setErrors] = useState<FieldError[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/categories?type=skill')
      .then((r) => (r.ok ? r.json() : { categories: [] }))
      .then((b) => setCustomCategories(b.categories ?? []))
      .catch(() => {})
  }, [])

  // Unsaved edits survive a refresh/back, keyed by this skill's id.
  const initialSnapshot = useMemo(
    () => ({
      name: initial.name,
      slug: initial.slug,
      category: initial.category,
      description: initial.description,
      body: initial.body,
    }),
    [initial],
  )
  const restore = useCallback((d: typeof initialSnapshot) => {
    setName(d.name)
    setSlug(d.slug)
    setCategory(d.category)
    setDescription(d.description)
    setBody(d.body)
  }, [])
  const draft = useFormDraft(
    `skill:${initial.id}`,
    { name, slug, category, description, body },
    { initial: initialSnapshot, restore },
  )

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors([])
    setSaved(false)
    setSaving(true)
    let res: Response
    try {
      res = await fetch(`/api/admin/skills/${encodeURIComponent(initial.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: normalizeSlug(slug),
          category,
          description,
          body,
        }),
      })
    } catch {
      setSaving(false)
      setErrors([
        {
          field: '(root)',
          message: 'Could not reach the server. Your edits are kept — try again.',
        },
      ])
      return
    }
    setSaving(false)
    if (!res.ok) {
      const { errors: apiErrors, unauthenticated } = await readApiFailure(res)
      if (unauthenticated) {
        router.push(loginHref(window.location.pathname))
        return
      }
      setErrors(apiErrors)
      return
    }
    draft.clear()
    setSaved(true)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <DraftBanner restoredAt={draft.restoredAt} onDiscard={draft.discard} />
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
        <label htmlFor="skill-name" className="label">
          Name
        </label>
        <input
          id="skill-name"
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="skill-slug" className="label">
            Slug
          </label>
          <input
            id="skill-slug"
            className="field"
            value={slug}
            onChange={(e) => setSlug(normalizeSlugInput(e.target.value))}
            onBlur={() => setSlug((s) => normalizeSlug(s))}
          />
          <p className="hint mt-1">Changing this changes the page URL.</p>
        </div>
        <div>
          <label htmlFor="skill-category" className="label">
            Category
          </label>
          <input
            id="skill-category"
            className="field"
            list="skill-edit-category-options"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="skill-edit-category-options">
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
        <label htmlFor="skill-description" className="label">
          Description
        </label>
        <textarea
          id="skill-description"
          className="field"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="skill-body" className="label">
          SKILL.md content
        </label>
        <textarea
          id="skill-body"
          className="field font-mono text-[13px]"
          rows={20}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <p className="hint mt-1">
          The skill's instructions, without the frontmatter — name and description above
          are added to it on download.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-brutal" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <span className="text-green-700 text-sm">Saved.</span>}
      </div>
    </form>
  )
}
