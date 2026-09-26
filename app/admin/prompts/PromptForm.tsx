'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loginHref, readApiFailure } from '@/lib/admin/client-errors'
import {
  buildPromptTemplate,
  parseTemplateReply,
  type TemplateReply,
} from '@/lib/admin/prompt-template'
import { normalizeSlug, normalizeSlugInput, slugify } from '@/lib/admin/slug'
import { useFormDraft } from '@/lib/admin/use-form-draft'
import { PROMPT_CATEGORIES } from '@/lib/prompts/categories'
import type { PromptVariable } from '@/lib/prompts/types'
import { DraftBanner } from '../DraftBanner'

interface CustomCategory {
  readonly slug: string
  readonly name: string
}

interface FieldError {
  readonly field: string
  readonly message: string
}

interface Verification {
  readonly tool: string
  readonly version: string
  readonly date: string
}

/** A stable per-row id for React's `key` — array index would misattribute
 * state (e.g. an in-progress edit landing on the wrong row) whenever a row
 * in the middle is removed, since every later index shifts down by one. */
type VerificationRow = Verification & { readonly rowId: number }

export interface PromptFormInitial {
  readonly id?: string
  readonly slug: string
  readonly category: string
  readonly title: string
  readonly description: string
  readonly promptText: string
  readonly whyItWorks: string
  readonly exampleOutput?: string
  readonly variables: readonly PromptVariable[]
  readonly verifiedAgainst: readonly Verification[]
}

const EMPTY: PromptFormInitial = {
  slug: '',
  category: '',
  title: '',
  description: '',
  promptText: '',
  whyItWorks: '',
  exampleOutput: '',
  variables: [],
  verifiedAgainst: [],
}

/** Everything the browser-side draft keeps between visits — every field,
 * plus whether the slug was hand-edited (so a restored title doesn't
 * overwrite a restored custom slug). */
interface DraftSnapshot {
  readonly title: string
  readonly slug: string
  readonly slugTouched: boolean
  readonly category: string
  readonly description: string
  readonly promptText: string
  readonly variables: readonly PromptVariable[]
  readonly exampleOutput: string
  readonly whyItWorks: string
  readonly verifiedAgainst: readonly Verification[]
  readonly reply: string
}

/** The tool/version the admin last verified against, remembered so the
 * next prompt's "Verified against" row is pre-filled and only needs a
 * glance. Today's date is filled fresh each time. */
const VERIFICATION_DEFAULT_KEY = 'admin:verification-default'

function readVerificationDefault(): { tool: string; version: string } | null {
  try {
    const raw = window.localStorage.getItem(VERIFICATION_DEFAULT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { tool?: unknown; version?: unknown }
    return typeof parsed.tool === 'string' && typeof parsed.version === 'string'
      ? { tool: parsed.tool, version: parsed.version }
      : null
  } catch {
    return null
  }
}

function rememberVerificationDefault(v: Verification): void {
  try {
    window.localStorage.setItem(
      VERIFICATION_DEFAULT_KEY,
      JSON.stringify({ tool: v.tool, version: v.version }),
    )
  } catch {
    // Best-effort convenience only.
  }
}

/** Every distinct `{{variable_name}}` in the prompt text, in first-seen
 * order — the exact convention `components/prompts/PromptCopyBlock.tsx`
 * already parses on the live site, so a prompt written to match this
 * template renders correctly with zero extra admin work. */
function extractVariableNames(promptText: string): string[] {
  const seen = new Set<string>()
  const names: string[] = []
  for (const match of promptText.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}/g)) {
    const name = match[1]
    if (name && !seen.has(name)) {
      seen.add(name)
      names.push(name)
    }
  }
  return names
}

const TODAY = () => new Date().toISOString().slice(0, 10)

export function PromptForm({ initial }: { initial?: PromptFormInitial }) {
  const router = useRouter()
  const mode = initial?.id ? 'edit' : 'create'
  const base = initial ?? EMPTY

  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])
  const [title, setTitle] = useState(base.title)
  const [slug, setSlug] = useState(base.slug)
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [category, setCategory] = useState(base.category)
  const [description, setDescription] = useState(base.description)
  const [promptText, setPromptText] = useState(base.promptText)
  const [variables, setVariables] = useState<PromptVariable[]>([...base.variables])
  const [exampleOutput, setExampleOutput] = useState(base.exampleOutput ?? '')
  const [whyItWorks, setWhyItWorks] = useState(base.whyItWorks)
  const nextRowId = useRef(0)
  // Stable across renders (a ref never changes identity), so it is safe in
  // effect/callback dependency lists below.
  const withRowIds = useCallback(
    (rows: readonly Verification[]): VerificationRow[] =>
      rows.map((v) => ({ ...v, rowId: nextRowId.current++ })),
    [],
  )
  const [verifiedAgainst, setVerifiedAgainst] = useState<VerificationRow[]>(() =>
    withRowIds(base.verifiedAgainst),
  )

  // The "paste the AI's reply" box and what the last paste filled in.
  const [reply, setReply] = useState('')
  const [filled, setFilled] = useState<{ filled: string[]; missing: string[] } | null>(
    null,
  )
  const [showTemplate, setShowTemplate] = useState(false)
  const [templateCopied, setTemplateCopied] = useState(false)

  const [errors, setErrors] = useState<FieldError[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/categories?type=prompt')
      .then((r) => (r.ok ? r.json() : { categories: [] }))
      .then((body) => setCustomCategories(body.categories ?? []))
      .catch(() => {})
  }, [])

  // A new prompt starts with one "Verified against" row: the tool/version
  // last used, dated today — so the only thing left to do is confirm it.
  useEffect(() => {
    if (mode !== 'create') return
    const remembered = readVerificationDefault()
    if (!remembered) return
    setVerifiedAgainst((prev) =>
      prev.length > 0 ? prev : withRowIds([{ ...remembered, date: TODAY() }]),
    )
  }, [mode, withRowIds])

  // Slug auto-follows the title until the admin edits the slug field
  // directly — at which point their edit wins and further title changes
  // stop overwriting it.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title))
  }, [title, slugTouched])

  // New `{{name}}` placeholders typed into the prompt get a variable row
  // automatically. Never removes a row on its own, even if its
  // placeholder briefly disappears mid-edit — that would silently drop
  // whatever description/example the admin already typed for it. A
  // placeholder no longer in the text is instead flagged in the row
  // itself (see `detectedNames` below), and removing it is the admin's
  // own explicit action. Memoized so this effect only reruns when
  // `promptText` itself changes, not on every unrelated re-render.
  const detectedNames = useMemo(() => extractVariableNames(promptText), [promptText])
  useEffect(() => {
    setVariables((prev) => {
      const existing = new Set(prev.map((v) => v.name))
      const additions = detectedNames
        .filter((name) => !existing.has(name))
        .map((name) => ({ name, description: '', example: '', required: true }))
      return additions.length > 0 ? [...prev, ...additions] : prev
    })
  }, [detectedNames])

  // ---- browser-side draft: nothing is lost on refresh/back ---------------
  const snapshot: DraftSnapshot = {
    title,
    slug,
    slugTouched,
    category,
    description,
    promptText,
    variables,
    exampleOutput,
    whyItWorks,
    verifiedAgainst: verifiedAgainst.map(({ rowId: _rowId, ...v }) => v),
    reply,
  }
  const initialSnapshot = useMemo<DraftSnapshot>(
    () => ({
      title: base.title,
      slug: base.slug,
      slugTouched: mode === 'edit',
      category: base.category,
      description: base.description,
      promptText: base.promptText,
      variables: [...base.variables],
      exampleOutput: base.exampleOutput ?? '',
      whyItWorks: base.whyItWorks,
      verifiedAgainst: [...base.verifiedAgainst],
      reply: '',
    }),
    [base, mode],
  )
  const restore = useCallback(
    (d: DraftSnapshot) => {
      setTitle(d.title)
      setSlug(d.slug)
      setSlugTouched(d.slugTouched)
      setCategory(d.category)
      setDescription(d.description)
      setPromptText(d.promptText)
      setVariables([...d.variables])
      setExampleOutput(d.exampleOutput)
      setWhyItWorks(d.whyItWorks)
      setVerifiedAgainst(withRowIds(d.verifiedAgainst))
      setReply(d.reply)
    },
    [withRowIds],
  )
  const draft = useFormDraft(
    mode === 'edit' && initial?.id ? `prompt:${initial.id}` : 'prompt:new',
    snapshot,
    { initial: initialSnapshot, restore },
  )

  function updateVariable(name: string, patch: Partial<PromptVariable>) {
    setVariables((prev) => prev.map((v) => (v.name === name ? { ...v, ...patch } : v)))
  }
  function removeVariable(name: string) {
    setVariables((prev) => prev.filter((v) => v.name !== name))
  }
  function mergeVariables(incoming: readonly PromptVariable[]) {
    setVariables((prev) => {
      const byName = new Map(prev.map((v) => [v.name, v]))
      for (const variable of incoming) byName.set(variable.name, variable)
      return [...byName.values()]
    })
  }

  const knownCategorySlugs = useMemo(
    () =>
      new Set([
        ...PROMPT_CATEGORIES.map((c) => c.slug),
        ...customCategories.map((c) => c.slug),
      ]),
    [customCategories],
  )

  /** Applies a parsed reply to the form — every field it carried. Returns
   * what was filled and what the reply left out, for the summary line. */
  function applyReply(parsed: TemplateReply) {
    const filledFields: string[] = []
    const missing: string[] = []
    const take = (label: string, value: unknown, apply: () => void) => {
      if (value === undefined || value === '') missing.push(label)
      else {
        apply()
        filledFields.push(label)
      }
    }
    take('title', parsed.title, () => setTitle(parsed.title ?? ''))
    take('category', parsed.category, () => {
      const c = parsed.category ?? ''
      if (knownCategorySlugs.has(c)) setCategory(c)
      else missing.push('category (not in the list)')
    })
    take('description', parsed.description, () =>
      setDescription(parsed.description ?? ''),
    )
    take('prompt', parsed.promptText, () => setPromptText(parsed.promptText ?? ''))
    take('variables', parsed.variables, () => mergeVariables(parsed.variables ?? []))
    take('why it works', parsed.whyItWorks, () => setWhyItWorks(parsed.whyItWorks ?? ''))
    take('example output', parsed.exampleOutput, () =>
      setExampleOutput(parsed.exampleOutput ?? ''),
    )
    setFilled({ filled: filledFields, missing })
  }

  /** The reply box: fills the form on paste, or on the button for text
   * that got there another way. */
  function handleReplyPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const pasted = e.clipboardData.getData('text')
    const parsed = parseTemplateReply(pasted)
    if (!parsed) return
    e.preventDefault()
    setReply(pasted)
    applyReply(parsed)
  }
  function fillFromReply() {
    const parsed = parseTemplateReply(reply)
    if (!parsed) {
      setFilled({ filled: [], missing: ['nothing recognised — is this the full reply?'] })
      return
    }
    applyReply(parsed)
  }

  /** Pasting a full reply straight into the Prompt field still works: the
   * whole form fills, exactly as via the reply box. A plain paste with no
   * markers falls through to the browser's normal paste, unaffected. */
  function handlePromptPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const parsed = parseTemplateReply(e.clipboardData.getData('text'))
    if (!parsed) return
    e.preventDefault()
    applyReply(parsed)
  }

  function addVerification() {
    setVerifiedAgainst((prev) => [
      ...prev,
      { tool: '', version: '', date: TODAY(), rowId: nextRowId.current++ },
    ])
  }
  function updateVerification(rowId: number, patch: Partial<Verification>) {
    setVerifiedAgainst((prev) =>
      prev.map((v) => (v.rowId === rowId ? { ...v, ...patch } : v)),
    )
  }
  function removeVerification(rowId: number) {
    setVerifiedAgainst((prev) => prev.filter((v) => v.rowId !== rowId))
  }

  const template = useMemo(
    () =>
      buildPromptTemplate([
        ...PROMPT_CATEGORIES.map((c) => ({ slug: c.slug, name: c.name })),
        ...customCategories,
      ]),
    [customCategories],
  )

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(template)
      setTemplateCopied(true)
      setTimeout(() => setTemplateCopied(false), 2000)
    } catch {
      // Clipboard can fail (permissions, insecure context) — the template
      // text is still fully visible and selectable above.
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors([])
    setSaved(false)

    const verification = verifiedAgainst.map(({ rowId: _rowId, ...v }) => v)
    const payload = {
      slug: normalizeSlug(slug),
      category,
      title,
      description,
      promptText,
      whyItWorks,
      exampleOutput: exampleOutput.trim() || undefined,
      variables,
      verifiedAgainst: verification,
      // Not collected by this form — every admin-published prompt starts
      // with none of these; they were never required to publish.
      tags: [],
      targetTools: [],
      changelog: [],
    }

    setSubmitting(true)
    let res: Response
    try {
      res =
        mode === 'create' || !initial?.id
          ? await fetch('/api/admin/prompts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/prompts/${encodeURIComponent(initial.id)}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
    } catch {
      setSubmitting(false)
      setErrors([
        {
          field: '(root)',
          message:
            'Could not reach the server. Your draft is kept — check your connection and try again.',
        },
      ])
      return
    }
    setSubmitting(false)

    if (!res.ok) {
      const { errors: apiErrors, unauthenticated } = await readApiFailure(res)
      if (unauthenticated) {
        // The draft survives the round trip through login.
        router.push(loginHref(window.location.pathname))
        return
      }
      setErrors(apiErrors)
      return
    }
    const body = await res.json()
    const first = verification[0]
    if (first?.tool && first.version) rememberVerificationDefault(first)
    draft.clear()
    if (mode === 'create') {
      // Straight to the exact-simulation preview, not the edit form — the
      // whole point of clicking "Create draft" is to see how this will
      // actually look; "Back to edit" on that page returns to publishing.
      router.push(`/admin-preview/prompts/${encodeURIComponent(body.id)}`)
    } else {
      setSaved(true)
      router.refresh()
    }
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
      {saved && <p className="text-green-700 text-sm">Saved.</p>}

      {/* Step 1 + 2: get the template, paste the reply, everything fills. */}
      <div className="rounded-[var(--radius-sm)] border border-violet-200 bg-violet-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="label mb-0">Fill the whole form from an AI reply</p>
          <button
            type="button"
            onClick={() => setShowTemplate((v) => !v)}
            className="text-[13px] text-violet-700 hover:underline"
          >
            {showTemplate ? 'Hide template' : 'Get the template'}
          </button>
        </div>
        <p className="mt-1 text-[13px] text-ink-subtle leading-5">
          Copy the template, replace its bracketed line with your idea, paste it into
          ChatGPT, Claude or any AI, then paste the <strong>full reply</strong> below.
          Title, slug, category, description, prompt, variables, why-it-works and example
          output all fill in — you only review.
        </p>

        {showTemplate && (
          <div className="mt-3">
            <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-[var(--radius-sm)] border border-violet-100 bg-white p-3 font-mono text-[12.5px] text-ink leading-5">
              {template}
            </pre>
            <button
              type="button"
              onClick={copyTemplate}
              className="btn-brutal btn-brutal-sm mt-2"
            >
              {templateCopied ? 'Copied!' : 'Copy template'}
            </button>
          </div>
        )}

        <label htmlFor="reply" className="label mt-3">
          Paste the AI&rsquo;s reply
        </label>
        <textarea
          id="reply"
          className="field font-mono text-[12.5px]"
          rows={4}
          placeholder="---TITLE--- … ---EXAMPLE_OUTPUT--- …"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onPaste={handleReplyPaste}
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fillFromReply}
            disabled={reply.trim() === ''}
            className="btn-brutal btn-brutal-sm"
          >
            Fill the form
          </button>
          {filled && (
            <span className="text-[13px] text-ink-subtle">
              {filled.filled.length > 0
                ? `Filled: ${filled.filled.join(', ')}.`
                : 'Nothing filled.'}
              {filled.missing.length > 0
                ? ` Not in the reply: ${filled.missing.join(', ')}.`
                : ''}
            </span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="label">
          Prompt name
        </label>
        <input
          id="title"
          className="field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
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
          <p className="hint mt-1">Auto-generated from the name — edit to customize.</p>
        </div>
        <div>
          <label htmlFor="category" className="label">
            Category
          </label>
          <input
            id="category"
            className="field"
            list="prompt-category-options"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="prompt-category-options">
            {PROMPT_CATEGORIES.map((c) => (
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
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          className="field"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="promptText" className="label">
          Prompt
        </label>
        <textarea
          id="promptText"
          className="field font-mono text-sm"
          rows={8}
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          onPaste={handlePromptPaste}
        />
      </div>

      {variables.length > 0 && (
        <div className="space-y-3 rounded-[var(--radius-sm)] border border-line-grey p-4">
          <p className="label mb-0">Custom fields detected in the prompt</p>
          {variables.map((variable) => {
            const stale = !detectedNames.includes(variable.name)
            return (
              <div
                key={variable.name}
                className="rounded-[var(--radius-sm)] border border-line-grey p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <code className="rounded bg-violet-50 px-1.5 py-0.5 font-semibold text-[13px] text-violet-700">
                    {`{{${variable.name}}}`}
                  </code>
                  <div className="flex items-center gap-3">
                    {stale && (
                      <span className="text-[12px] text-amber-600">
                        not in prompt text
                      </span>
                    )}
                    <label className="flex items-center gap-1.5 text-[13px]">
                      <input
                        type="checkbox"
                        checked={variable.required}
                        onChange={(e) =>
                          updateVariable(variable.name, { required: e.target.checked })
                        }
                      />
                      Required
                    </label>
                    <button
                      type="button"
                      onClick={() => removeVariable(variable.name)}
                      className="text-[13px] text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    className="field"
                    placeholder="Description — what this represents"
                    value={variable.description}
                    onChange={(e) =>
                      updateVariable(variable.name, { description: e.target.value })
                    }
                  />
                  <input
                    className="field"
                    placeholder="Example value"
                    value={variable.example}
                    onChange={(e) =>
                      updateVariable(variable.name, { example: e.target.value })
                    }
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div>
        <label htmlFor="exampleOutput" className="label">
          Example output — what you get back
        </label>
        <textarea
          id="exampleOutput"
          className="field"
          rows={4}
          value={exampleOutput}
          onChange={(e) => setExampleOutput(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="whyItWorks" className="label">
          Why it works
        </label>
        <textarea
          id="whyItWorks"
          className="field"
          rows={3}
          value={whyItWorks}
          onChange={(e) => setWhyItWorks(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="label mb-0">Verified against</p>
          <button
            type="button"
            onClick={addVerification}
            className="text-[13px] text-violet-700 hover:underline"
          >
            + Add
          </button>
        </div>
        <p className="hint -mt-2">
          At least one is required to publish — the real tool and version you tested this
          prompt against. Pre-filled from your last prompt; today&rsquo;s date.
        </p>
        {verifiedAgainst.map((v) => (
          <div
            key={v.rowId}
            className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2"
          >
            <div>
              <label className="label" htmlFor={`verify-tool-${v.rowId}`}>
                Tool
              </label>
              <input
                id={`verify-tool-${v.rowId}`}
                className="field"
                placeholder="e.g. Claude"
                value={v.tool}
                onChange={(e) => updateVerification(v.rowId, { tool: e.target.value })}
              />
            </div>
            <div>
              <label className="label" htmlFor={`verify-version-${v.rowId}`}>
                Version
              </label>
              <input
                id={`verify-version-${v.rowId}`}
                className="field"
                placeholder="e.g. Sonnet 5"
                value={v.version}
                onChange={(e) => updateVerification(v.rowId, { version: e.target.value })}
              />
            </div>
            <div>
              <label className="label" htmlFor={`verify-date-${v.rowId}`}>
                Date
              </label>
              <input
                id={`verify-date-${v.rowId}`}
                type="date"
                className="field"
                value={v.date}
                onChange={(e) => updateVerification(v.rowId, { date: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={() => removeVerification(v.rowId)}
              className="mb-[11px] text-[13px] text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="submit" className="btn-brutal" disabled={submitting}>
        {submitting ? 'Saving…' : mode === 'create' ? 'Create draft' : 'Save changes'}
      </button>
    </form>
  )
}
