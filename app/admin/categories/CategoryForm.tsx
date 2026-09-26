'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { loginHref, readApiFailure } from '@/lib/admin/client-errors'
import { normalizeSlug, normalizeSlugInput, slugify } from '@/lib/admin/slug'
import { useFormDraft } from '@/lib/admin/use-form-draft'
import { DraftBanner } from '../DraftBanner'

interface CustomCategory {
  readonly slug: string
  readonly name: string
}

interface FieldError {
  readonly field: string
  readonly message: string
}

/** Matches the server cap (lib/admin/categories.ts): this image is inlined
 * into the HTML of every page that shows the category's logo. */
const MAX_LOGO_BYTES = 300_000
const ALLOWED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * Deliberately just three inputs: content type, name (auto-slug, still
 * editable), and a logo image. Everything else a category could carry
 * (blurb, intro, tile color, tier, service target, content boundary) is
 * filled in with a sensible default rather than asked for — the point of
 * this form is creating a new taxonomy entry in a few seconds, not
 * authoring a full landing page.
 */
interface DraftSnapshot {
  readonly contentType: 'prompt' | 'skill'
  readonly name: string
  readonly slug: string
  readonly slugTouched: boolean
  readonly logoDataUrl: string
}

const EMPTY_DRAFT: DraftSnapshot = {
  contentType: 'prompt',
  name: '',
  slug: '',
  slugTouched: false,
  logoDataUrl: '',
}

export function CategoryForm() {
  const router = useRouter()
  const [contentType, setContentType] = useState<'prompt' | 'skill'>('prompt')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [logoDataUrl, setLogoDataUrl] = useState('')
  const [logoError, setLogoError] = useState('')
  const [errors, setErrors] = useState<FieldError[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<CustomCategory[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // The logo is kept too (it's already a data: URL, small by the cap
  // above), so a restored draft shows its preview; only the file input
  // itself is empty again.
  const restore = useCallback((d: DraftSnapshot) => {
    setContentType(d.contentType)
    setName(d.name)
    setSlug(d.slug)
    setSlugTouched(d.slugTouched)
    setLogoDataUrl(d.logoDataUrl)
  }, [])
  const draft = useFormDraft(
    'category:new',
    { contentType, name, slug, slugTouched, logoDataUrl } satisfies DraftSnapshot,
    { initial: EMPTY_DRAFT, restore },
  )

  function onNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function onLogoChange(file: File | null) {
    setLogoError('')
    setLogoDataUrl('')
    if (!file) return
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setLogoError('Use a PNG, JPEG, WebP or GIF image.')
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('That image is too large — please use something under 300KB.')
      return
    }
    setLogoDataUrl(await readAsDataUrl(file))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors([])
    if (!logoDataUrl) {
      setErrors([{ field: 'logoDataUrl', message: 'An icon image is required.' }])
      return
    }

    const summary =
      contentType === 'prompt'
        ? `Free ${name.trim()} prompts — copy, customize, and use them in any AI tool.`
        : `Free ${name.trim()} skills — download and drop them into your AI agent.`
    const payload = {
      contentType,
      slug: normalizeSlug(slug),
      name,
      blurb: summary,
      intro: summary,
      icon: 'Sparkles',
      logoDataUrl,
      tile: 'yellow' as const,
    }

    setSubmitting(true)
    let res: Response
    try {
      res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
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
    setCreated((prev) => [{ slug: payload.slug, name }, ...prev])
    draft.clear()
    setName('')
    setSlug('')
    setSlugTouched(false)
    setLogoDataUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4">
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
          <span className="label">Content type</span>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={contentType === 'prompt'}
                onChange={() => setContentType('prompt')}
              />
              Prompt
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={contentType === 'skill'}
                onChange={() => setContentType('skill')}
              />
              Skill
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cat-name" className="label">
              Name
            </label>
            <input
              id="cat-name"
              className="field"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="cat-slug" className="label">
              Slug
            </label>
            <input
              id="cat-slug"
              className="field"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(normalizeSlugInput(e.target.value))
              }}
              onBlur={() => setSlug((s) => normalizeSlug(s))}
            />
            <p className="hint mt-1">Auto-generated from the name — edit to customize.</p>
          </div>
        </div>

        <div>
          <label htmlFor="cat-logo" className="label">
            Icon image
          </label>
          <input
            id="cat-logo"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="field"
            onChange={(e) => onLogoChange(e.target.files?.[0] ?? null)}
          />
          <p className="hint mt-1">
            Upload an image and it becomes this category's logo wherever it's shown.
          </p>
          {logoError && <p className="mt-1 text-red-600 text-sm">{logoError}</p>}
          {logoDataUrl && (
            // biome-ignore lint/performance/noImgElement: a local data: URL preview of the file just picked — nothing for next/image to optimize.
            <img
              src={logoDataUrl}
              alt="Logo preview"
              className="mt-2 size-12 rounded-lg border border-[var(--color-line)] object-cover"
            />
          )}
        </div>

        <button type="submit" className="btn-brutal" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create category'}
        </button>
      </form>

      {created.length > 0 && (
        <ul className="mt-8 space-y-2">
          {created.map((c) => (
            <li key={c.slug} className="card-flat p-3 text-sm">
              <strong>{c.name}</strong> — {c.slug}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
