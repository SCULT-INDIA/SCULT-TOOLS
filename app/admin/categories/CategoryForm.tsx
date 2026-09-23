'use client'

import { useRef, useState } from 'react'
import { slugify } from '@/lib/admin/slug'

interface CustomCategory {
  readonly slug: string
  readonly name: string
}

interface FieldError {
  readonly field: string
  readonly message: string
}

const MAX_LOGO_BYTES = 1_000_000 // ~1.3MB as a data: URL after base64 overhead — generous for a small square logo, small enough to keep the row cheap.

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
export function CategoryForm() {
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

  function onNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function onLogoChange(file: File | null) {
    setLogoError('')
    setLogoDataUrl('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setLogoError('That file is not an image.')
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('That image is too large — please use something under 1MB.')
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
      slug,
      name,
      blurb: summary,
      intro: summary,
      icon: 'Sparkles',
      logoDataUrl,
      tile: 'yellow' as const,
    }

    setSubmitting(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSubmitting(false)

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setErrors(body.errors ?? [{ field: '(root)', message: 'Request failed.' }])
      return
    }
    setCreated((prev) => [{ slug, name }, ...prev])
    setName('')
    setSlug('')
    setSlugTouched(false)
    setLogoDataUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4">
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
                setSlug(e.target.value)
              }}
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
