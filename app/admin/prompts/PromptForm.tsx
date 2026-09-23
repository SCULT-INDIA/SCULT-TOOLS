'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { slugify } from '@/lib/admin/slug'
import { PROMPT_CATEGORIES } from '@/lib/prompts/categories'
import type { PromptVariable } from '@/lib/prompts/types'

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

const VARIABLES_MARKER = '---VARIABLES---'

/**
 * Not an example prompt to imitate — a meta-prompt: the admin fills in the
 * bracketed line with their own rough idea, pastes the whole thing into
 * any LLM, then pastes the LLM's full reply straight into the Prompt
 * field below. `handlePromptPaste` looks for the `---VARIABLES---` marker
 * this instructs the LLM to emit and, when present, splits the paste into
 * the prompt text plus a fully-populated variable list (name, description
 * AND example — not just the name `{{...}}` detection alone can find), so
 * nothing here needs typing twice.
 */
const TEMPLATE = `I'm building a reusable AI prompt for the following:

[Describe what you want the prompt to help with — replace this line with your own idea, as detailed or rough as you like.]

Write a complete, ready-to-use prompt for this. Follow these rules exactly:

1. Use {{snake_case_name}} for every part someone should customize before using the prompt (e.g. {{topic}}, {{tone}}, {{target_audience}}) — never write a specific example inline; always mark it as a placeholder instead.
2. Open with clear role-setting: "You are a/an [role] who/that ...".
3. State the task in plain language, then list the constraints, steps, or requirements as a numbered or bulleted list — no more than 5 of them, the most important ones only.
4. End with an explicit instruction on the output format (length, structure, tone, what NOT to include).
5. Keep the prompt itself self-contained — it should make sense on its own, with no reference to "the template" or "this conversation".

After the prompt, add a line that reads exactly:
${VARIABLES_MARKER}

Then, below that line, list every {{variable}} you used — one per line, in exactly this format (no numbering, no extra punctuation):
name | one-line description of what it represents | a realistic example value

Example of the ${VARIABLES_MARKER} section format:
${VARIABLES_MARKER}
role | the professional identity to adopt | senior React engineer
tone | the writing tone to use | direct and technical

Return ONLY the prompt text, then the ${VARIABLES_MARKER} line, then the variable list — nothing else before or after (no commentary, no headings, no code fences).`

/** Splits a pasted LLM reply into the prompt text and a fully-populated
 * variable list, if it follows the template's `---VARIABLES---` format —
 * `name | description | example` per line. Anything not matching that
 * exact shape (missing marker, malformed line) is left for the ordinary
 * `{{name}}` live-detection effect to pick up instead, so a plain paste
 * with no variables section still works exactly as before. */
function parsePastedReply(
  raw: string,
): { promptText: string; variables: PromptVariable[] } | null {
  const markerIndex = raw.indexOf(VARIABLES_MARKER)
  if (markerIndex === -1) return null

  const promptText = raw.slice(0, markerIndex).trim()
  const block = raw.slice(markerIndex + VARIABLES_MARKER.length)
  const variables: PromptVariable[] = []
  for (const line of block.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const [rawName, description, example] = trimmed.split('|').map((p) => p.trim())
    const name = rawName?.replace(/[{}]/g, '')
    if (!name) continue
    variables.push({
      name,
      description: description ?? '',
      example: example ?? '',
      required: true,
    })
  }
  return { promptText, variables }
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
  const [verifiedAgainst, setVerifiedAgainst] = useState<VerificationRow[]>(() =>
    base.verifiedAgainst.map((v) => ({ ...v, rowId: nextRowId.current++ })),
  )
  const [showTemplate, setShowTemplate] = useState(false)
  const [templateCopied, setTemplateCopied] = useState(false)

  const [errors, setErrors] = useState<FieldError[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/categories?type=prompt')
      .then((r) => r.json())
      .then((body) => setCustomCategories(body.categories ?? []))
      .catch(() => {})
  }, [])

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

  function updateVariable(name: string, patch: Partial<PromptVariable>) {
    setVariables((prev) => prev.map((v) => (v.name === name ? { ...v, ...patch } : v)))
  }
  function removeVariable(name: string) {
    setVariables((prev) => prev.filter((v) => v.name !== name))
  }

  /** Pasting an LLM's full reply to the template (prompt text +
   * `---VARIABLES---` block) fills in the prompt AND every variable's
   * description/example in one action — a plain paste with no marker
   * falls through to the browser's normal paste, unaffected. */
  function handlePromptPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const pasted = e.clipboardData.getData('text')
    const parsed = parsePastedReply(pasted)
    if (!parsed) return
    e.preventDefault()
    setPromptText(parsed.promptText)
    setVariables((prev) => {
      const byName = new Map(prev.map((v) => [v.name, v]))
      for (const variable of parsed.variables) byName.set(variable.name, variable)
      return [...byName.values()]
    })
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

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(TEMPLATE)
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

    const payload = {
      slug,
      category,
      title,
      description,
      promptText,
      whyItWorks,
      exampleOutput: exampleOutput.trim() || undefined,
      variables,
      // Strip the client-only `rowId` used for React's key — the backend
      // schema only knows {tool, version, date}.
      verifiedAgainst: verifiedAgainst.map(({ rowId: _rowId, ...v }) => v),
      // Not collected by this form — every admin-published prompt starts
      // with none of these; they were never required to publish.
      tags: [],
      targetTools: [],
      changelog: [],
    }

    setSubmitting(true)
    const res =
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
    setSubmitting(false)

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setErrors(body.errors ?? [{ field: '(root)', message: 'Request failed.' }])
      return
    }
    const body = await res.json()
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
              setSlug(e.target.value)
            }}
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
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="promptText" className="label mb-0">
            Prompt
          </label>
          <button
            type="button"
            onClick={() => setShowTemplate((v) => !v)}
            className="text-[13px] text-violet-700 hover:underline"
          >
            {showTemplate ? 'Hide template' : 'Need a template?'}
          </button>
        </div>

        {showTemplate && (
          <div className="mb-3 rounded-[var(--radius-sm)] border border-violet-200 bg-violet-50 p-3">
            <p className="mb-2 text-[13px] text-ink-subtle leading-5">
              This isn't a prompt to copy as-is — it's instructions for an LLM. Copy it,
              replace the bracketed line with your own idea, and paste the whole thing
              into ChatGPT, Claude, or any LLM. Then paste its <strong>full reply</strong>{' '}
              straight into the Prompt field below — the prompt text and every variable's
              description and example fill in automatically.
            </p>
            <pre className="whitespace-pre-wrap rounded-[var(--radius-sm)] border border-violet-100 bg-white p-3 font-mono text-[12.5px] text-ink leading-5">
              {TEMPLATE}
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
          prompt against.
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
