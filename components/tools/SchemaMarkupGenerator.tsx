'use client'

// TriangleAlert, not AlertTriangle — this lucide version dropped the old alias.
import { CircleCheck, ExternalLink, Plus, TriangleAlert, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  CodePane,
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarAction,
  ToolbarGroup,
  ToolToolbar,
  ToolWorkspace,
} from '@/components/tools/workspace'
import {
  buildSchema,
  EXAMPLE_VALUES,
  type FieldSpec,
  type FieldValue,
  getSchemaType,
  type RepeatFieldSpec,
  type RepeatRow,
  SCHEMA_TYPES,
  type ScalarKind,
  type SchemaTypeId,
  type SchemaValues,
  type SelectOption,
  wrapInScriptTag,
} from '@/lib/tools/schema-markup-generator/logic'

/**
 * Schema markup generator — rebuilt on the shared workspace.
 * Research brief: docs/research/schema-markup-generator.md
 *
 * What changed, and why:
 *   - The form and the JSON-LD are now one two-pane workspace. Previously the
 *     result sat in a card that scrolled away from the fields producing it, so
 *     the "validates as you type" claim was invisible while you typed.
 *   - The requirement verdict is pinned above the code: "5 of 5 required
 *     properties present", or the exact fields that are not. Every competitor
 *     marks a field with an asterisk and defers the verdict to Google's Rich
 *     Results Test, which happens after you have finished and left.
 *   - Each shortfall is a BUTTON that focuses the offending input. Naming the
 *     field is half the job; getting there is the other half.
 *   - Repeat rows are numbered by their position in the OUTPUT (mirroring
 *     `nonEmptyRows` in logic.ts), so "Crumb 2" in a warning and "Crumb 2" in
 *     the form are always the same crumb even with a blank row above it.
 *   - A "Required only" filter that also keeps anything currently warned about,
 *     so it can be left on while fixing and never hides a jump target.
 *
 * All construction and validation stays in logic.ts, which is already tested.
 * This file holds state, markup, and the reference links — the latter are
 * editorial content, not computation, which is why they live here.
 *
 * One flat values map is shared across every schema type, so keys the types have
 * in common (name, url, image, description) survive a type switch. Fields the new
 * type introduces are seeded from its example values, so the output is never a
 * bare skeleton.
 */

/**
 * Where each type's `required` flags come from. Google is the authority wherever
 * it documents the type; for the two it does not, schema.org is cited instead
 * rather than pointing at a page that does not exist.
 *
 * `note` records a retired rich result. Both are real and dated: Google removed
 * HowTo rich results in September 2023 and retired the sitelinks search box on
 * 21 November 2024. The markup stays valid schema.org and still helps machines
 * understand the page, so the types stay — but a generator that implies a rich
 * result Google no longer shows is lying by omission.
 */
const TYPE_REFERENCE: Record<
  SchemaTypeId,
  { readonly href: string; readonly source: string; readonly note?: string }
> = {
  Article: {
    href: 'https://developers.google.com/search/docs/appearance/structured-data/article',
    source: "Google's Article requirements",
  },
  Organization: {
    href: 'https://developers.google.com/search/docs/appearance/structured-data/organization',
    source: "Google's Organization requirements",
  },
  LocalBusiness: {
    href: 'https://developers.google.com/search/docs/appearance/structured-data/local-business',
    source: "Google's Local Business requirements",
  },
  Product: {
    href: 'https://developers.google.com/search/docs/appearance/structured-data/product-snippet',
    source: "Google's Product snippet requirements",
  },
  Person: {
    href: 'https://schema.org/Person',
    source: 'schema.org/Person',
    note: 'Google has no Person rich result, so nothing here changes your snippet. It is worth emitting anyway — it is how an author or team page gets tied to the same entity across the web.',
  },
  Event: {
    href: 'https://developers.google.com/search/docs/appearance/structured-data/event',
    source: "Google's Event requirements",
  },
  WebSite: {
    href: 'https://schema.org/WebSite',
    source: 'schema.org/WebSite',
    note: 'Google retired the sitelinks search box on 21 November 2024, so the search action no longer produces a search box in results. Leaving the markup in place is harmless and WebSite itself is still read.',
  },
  BreadcrumbList: {
    href: 'https://developers.google.com/search/docs/appearance/structured-data/breadcrumb',
    source: "Google's Breadcrumb requirements",
  },
  HowTo: {
    href: 'https://schema.org/HowTo',
    source: 'schema.org/HowTo',
    note: 'Google removed HowTo rich results in September 2023 and withdrew the documentation with them. The markup is still valid and still machine-readable; it will not change how your snippet looks.',
  },
}

interface IdRow {
  readonly id: number
  readonly data: RepeatRow
}

type UiValue = string | readonly IdRow[]
type UiValues = Readonly<Record<string, UiValue>>

/** A row plus the 1-based position it will occupy in the output, or null if blank. */
interface PositionedRow {
  readonly row: IdRow
  readonly outputIndex: number | null
}

// Module-level counter: ids only need to be unique within the page's lifetime.
let rowIdCounter = 0
function nextRowId(): number {
  rowIdCounter += 1
  return rowIdCounter
}

/** Wraps example/logic values in UI rows with generated ids. */
function seedUiValues(values: SchemaValues): Record<string, UiValue> {
  const out: Record<string, UiValue> = {}
  for (const [key, value] of Object.entries(values)) {
    out[key] =
      typeof value === 'string' ? value : value.map((data) => ({ id: nextRowId(), data }))
  }
  return out
}

function rowsOf(values: UiValues, key: string): readonly IdRow[] {
  const current = values[key]
  if (current === undefined || typeof current === 'string') return []
  return current
}

/** Matches `nonEmptyRows` in logic.ts: a row with nothing in it contributes nothing. */
function isRowFilled(row: RepeatRow): boolean {
  return Object.values(row).some((v) => v.trim() !== '')
}

/**
 * Numbers rows the way the output does. logic.ts labels row warnings by their
 * index among the NON-EMPTY rows, so displaying the raw array index would let a
 * blank row upstream make "Step 2" in the warning a different row from "Step 2"
 * in the form.
 */
function positionRows(rows: readonly IdRow[]): readonly PositionedRow[] {
  let position = 0
  return rows.map((row) => {
    if (!isRowFilled(row.data)) return { row, outputIndex: null }
    position += 1
    return { row, outputIndex: position }
  })
}

function isFieldFilled(field: FieldSpec, values: UiValues): boolean {
  if (field.kind === 'repeat')
    return rowsOf(values, field.key).some((r) => isRowFilled(r.data))
  const current = values[field.key]
  return typeof current === 'string' && current.trim() !== ''
}

const INPUT_TYPE: Partial<Record<ScalarKind, string>> = {
  url: 'url',
  date: 'date',
  datetime: 'datetime-local',
  time: 'time',
}

function ScalarInput({
  id,
  kind,
  value,
  placeholder,
  options,
  describedBy,
  invalid = false,
  onChange,
}: {
  id: string
  kind: ScalarKind
  value: string
  placeholder: string
  options?: readonly SelectOption[]
  describedBy?: string
  invalid?: boolean
  onChange: (value: string) => void
}) {
  // Utilities outrank the components layer in Tailwind v4, so `border-ink` wins
  // over `.field`'s grey border. Paired with the inline message below the input,
  // never the only signal.
  const className = invalid ? 'field border-ink' : 'field'
  const ariaInvalid = invalid ? true : undefined

  if (kind === 'textarea') {
    return (
      <textarea
        id={id}
        className={className}
        rows={3}
        placeholder={placeholder}
        value={value}
        aria-describedby={describedBy}
        aria-invalid={ariaInvalid}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }
  if (kind === 'select') {
    return (
      <select
        id={id}
        className={className}
        value={value}
        aria-describedby={describedBy}
        aria-invalid={ariaInvalid}
        onChange={(e) => onChange(e.target.value)}
      >
        {(options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
  return (
    <input
      id={id}
      className={className}
      type={INPUT_TYPE[kind] ?? 'text'}
      inputMode={kind === 'number' ? 'decimal' : kind === 'url' ? 'url' : undefined}
      autoComplete="off"
      spellCheck={kind === 'text' ? undefined : false}
      placeholder={placeholder}
      value={value}
      aria-describedby={describedBy}
      aria-invalid={ariaInvalid}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

/** The one-line "Google requires this" marker, next to the field's own label. */
function RequiredBadge() {
  return (
    <span className="ml-1.5 rounded-pill border border-ink bg-cta px-2 py-0.5 align-middle font-semibold text-[11px] text-ink uppercase tracking-[0.06em]">
      Required
    </span>
  )
}

/** The inline "this field is what Google will flag" message. */
function FieldProblem({ id, message }: { id: string; message: string }) {
  return (
    <p
      className="mt-1.5 flex items-start gap-1.5 font-medium text-[13px] text-ink"
      id={id}
    >
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  )
}

export function SchemaMarkupGenerator() {
  const [typeId, setTypeId] = useState<SchemaTypeId>('Article')
  const [values, setValues] = useState<Record<string, UiValue>>(() =>
    seedUiValues(EXAMPLE_VALUES.Article),
  )
  const [format, setFormat] = useState<'script' | 'json'>('script')
  const [requiredOnly, setRequiredOnly] = useState(false)
  // Field keys the visitor has typed into. Under "Required only" these stay on
  // screen — see markEdited.
  const [edited, setEdited] = useState<ReadonlySet<string>>(() => new Set())

  const spec = getSchemaType(typeId)
  const reference = TYPE_REFERENCE[typeId]

  const logicValues = useMemo(() => {
    const out: Record<string, FieldValue> = {}
    for (const [key, value] of Object.entries(values)) {
      out[key] = typeof value === 'string' ? value : value.map((row) => row.data)
    }
    return out
  }, [values])

  const result = useMemo(() => buildSchema(typeId, logicValues), [typeId, logicValues])
  const scriptText = useMemo(() => wrapInScriptTag(result.json), [result.json])
  const outputText = format === 'script' ? scriptText : result.json

  // Consecutive fields sharing a group name render inside one fieldset.
  const groups = useMemo(() => {
    const out: { name: string; fields: FieldSpec[] }[] = []
    for (const field of spec?.fields ?? []) {
      const last = out[out.length - 1]
      if (last && last.name === field.group) last.fields.push(field)
      else out.push({ name: field.group, fields: [field] })
    }
    return out
  }, [spec])

  /** field label -> its warning message, for the inline marker on the input. */
  const problemByField = useMemo(() => {
    const map = new Map<string, string>()
    for (const warning of result.warnings) map.set(warning.field, warning.message)
    return map
  }, [result.warnings])

  /**
   * field label -> the id of the element to focus when its warning is clicked.
   * Built from the same labels logic.ts uses, so a warning is either jumpable or
   * rendered as plain text — never a button that silently does nothing.
   */
  const targetIdByField = useMemo(() => {
    const map = new Map<string, string>()
    for (const field of spec?.fields ?? []) {
      if (field.kind === 'repeat') {
        // A required-but-empty repeat field points at its Add button.
        map.set(field.label, `smg-add-${field.key}`)
        for (const { row, outputIndex } of positionRows(rowsOf(values, field.key))) {
          if (outputIndex === null) continue
          for (const item of field.itemFields) {
            map.set(
              `${field.itemLabel} ${outputIndex} · ${item.label}`,
              `smg-${field.key}-${row.id}-${item.key}`,
            )
          }
        }
        continue
      }
      map.set(field.label, `smg-${field.key}`)
    }
    return map
  }, [spec, values])

  const requiredFields = useMemo(
    () => (spec?.fields ?? []).filter((f) => f.required),
    [spec],
  )
  const missingRequired = useMemo(
    () => requiredFields.filter((f) => !isFieldFilled(f, values)),
    [requiredFields, values],
  )

  function jumpToField(label: string): void {
    const id = targetIdByField.get(label)
    if (id === undefined) return
    const element = document.getElementById(id)
    if (element === null) return
    element.focus({ preventScroll: true })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' })
  }

  function switchType(next: SchemaTypeId): void {
    setTypeId(next)
    setValues((prev) => {
      const merged: Record<string, UiValue> = { ...prev }
      const example = seedUiValues(EXAMPLE_VALUES[next])
      const nextSpec = getSchemaType(next)
      for (const field of nextSpec?.fields ?? []) {
        if (merged[field.key] === undefined) {
          merged[field.key] = example[field.key] ?? (field.kind === 'repeat' ? [] : '')
        }
      }
      return merged
    })
  }

  /**
   * Pins a field as "touched". Without this, "Required only" would unmount an
   * optional field the moment its value stopped being wrong — which is the first
   * keystroke, not the last. Typing `7` into Longitude satisfies the lat/lng pair
   * rule, so the input would vanish under the cursor and the remaining digits
   * would go nowhere. Editing a field keeps it on screen.
   */
  function markEdited(key: string): void {
    setEdited((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))
  }

  function setScalar(key: string, value: string): void {
    markEdited(key)
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function updateRow(fieldKey: string, id: number, itemKey: string, value: string): void {
    markEdited(fieldKey)
    setValues((prev) => {
      const rows = rowsOf(prev, fieldKey)
      const next = rows.map((row) =>
        row.id === id ? { id, data: { ...row.data, [itemKey]: value } } : row,
      )
      return { ...prev, [fieldKey]: next }
    })
  }

  function addRow(field: RepeatFieldSpec): void {
    const blank: Record<string, string> = {}
    for (const item of field.itemFields) {
      blank[item.key] = item.kind === 'select' ? (item.options?.[0]?.value ?? '') : ''
    }
    setValues((prev) => ({
      ...prev,
      [field.key]: [...rowsOf(prev, field.key), { id: nextRowId(), data: blank }],
    }))
  }

  function removeRow(fieldKey: string, id: number): void {
    setValues((prev) => ({
      ...prev,
      [fieldKey]: rowsOf(prev, fieldKey).filter((row) => row.id !== id),
    }))
  }

  function loadExample(): void {
    setValues((prev) => ({ ...prev, ...seedUiValues(EXAMPLE_VALUES[typeId]) }))
  }

  /** Clears only the current type's fields — other types' values are untouched. */
  function clearFields(): void {
    setValues((prev) => {
      const next: Record<string, UiValue> = { ...prev }
      for (const field of spec?.fields ?? []) {
        next[field.key] = field.kind === 'repeat' ? [] : ''
      }
      return next
    })
  }

  /**
   * "Required only" keeps required fields, anything currently warned about, and
   * anything already edited — so the filter can stay on while you fix things and
   * cannot hide a jump target or a field under the cursor.
   */
  function isFieldVisible(field: FieldSpec): boolean {
    if (!requiredOnly || field.required) return true
    if (edited.has(field.key)) return true
    if (problemByField.has(field.label)) return true
    if (field.kind === 'repeat') {
      return result.warnings.some((w) => w.field.startsWith(`${field.itemLabel} `))
    }
    return false
  }

  if (!spec) return null

  const satisfied = requiredFields.length - missingRequired.length
  const issueCount = result.warnings.length
  const allClear = issueCount === 0

  const verdictHeadline = allClear
    ? `All ${requiredFields.length} required propert${requiredFields.length === 1 ? 'y' : 'ies'} present`
    : missingRequired.length > 0
      ? `${missingRequired.length} required propert${missingRequired.length === 1 ? 'y' : 'ies'} missing`
      : `${issueCount} format ${issueCount === 1 ? 'issue' : 'issues'} to fix`

  // Deliberately NOT the verdict headline: the strip above the code already says
  // that, and repeating the same sentence in the status bar is the duplicate-
  // messaging the workspace exists to remove. This says the same thing shorter,
  // with the counts alongside it doing the detail.
  const statusMessage = allClear
    ? `Valid ${spec.label} markup`
    : missingRequired.length > 0
      ? `${spec.label} markup incomplete`
      : `${spec.label} markup needs a format fix`

  const verdictDetail = allClear
    ? `Paste the whole block inside your page's <head>. Google reads it from the <body> too.`
    : missingRequired.length > 0
      ? `Google will not show a ${spec.label} rich result without ${missingRequired.map((f) => f.label).join(', ')}.`
      : 'The required properties are all there, but these values will not validate as written.'

  return (
    <ToolWorkspace
      inputLabel="Schema type and fields"
      outputLabel="Generated JSON-LD"
      minHeight="min-h-[32rem]"
      toolbar={
        <ToolToolbar
          actions={
            <>
              <ToolbarAction onClick={loadExample}>Load example</ToolbarAction>
              <ToolbarAction onClick={clearFields}>Clear fields</ToolbarAction>
            </>
          }
        >
          <ToolbarGroup label="Output">
            <SegmentButton
              active={format === 'script'}
              onClick={() => setFormat('script')}
              title="The complete application/ld+json script block, ready to paste"
            >
              Script tag
            </SegmentButton>
            <SegmentButton
              active={format === 'json'}
              onClick={() => setFormat('json')}
              title="Just the JSON-LD object, for a template or a CMS field"
            >
              JSON only
            </SegmentButton>
          </ToolbarGroup>

          <ToolbarGroup label="Fields">
            <SegmentButton
              active={!requiredOnly}
              onClick={() => setRequiredOnly(false)}
              title="Show every property this type supports"
            >
              All
            </SegmentButton>
            <SegmentButton
              active={requiredOnly}
              onClick={() => setRequiredOnly(true)}
              title="Show only what Google requires, plus anything currently flagged"
            >
              Required only
            </SegmentButton>
          </ToolbarGroup>
        </ToolToolbar>
      }
      input={
        <Pane title={`${spec.label} fields`}>
          <div className="flex flex-col gap-6">
            <fieldset>
              <legend className="label">Schema type</legend>
              <div className="flex flex-wrap gap-2">
                {SCHEMA_TYPES.map((t) => {
                  const active = t.id === typeId
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => switchType(t.id)}
                      className={`min-h-11 rounded-pill border px-4 font-medium text-[14px] transition-colors ${
                        active
                          ? 'border-ink bg-violet-700 text-white'
                          : 'border-line-grey bg-white text-ink hover:border-ink'
                      }`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>

              <p className="hint mt-2.5">{spec.blurb}</p>

              {/* Just the source link. The sentence that used to precede it —
                  "Required here means Google requires it, schema.org marks
                  nearly everything optional" — restated the howItWorks prose
                  rendered below the tool, so only the checkable citation stays. */}
              <p className="hint mt-1.5">
                Required flags follow{' '}
                <a
                  className="font-medium text-violet-700 underline decoration-1 underline-offset-2"
                  href={reference.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {reference.source}
                  <ExternalLink
                    className="ml-1 inline size-3.5 align-[-2px]"
                    aria-hidden="true"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>

              {reference.note ? (
                <p className="mt-2.5 rounded-sm border border-line-grey bg-offwhite p-3 text-[13px] text-ink-body leading-5">
                  {reference.note}
                </p>
              ) : null}
            </fieldset>

            {groups.map((group) => {
              const visible = group.fields.filter(isFieldVisible)
              if (visible.length === 0) return null
              return (
                <fieldset key={group.name} className="border-line border-t pt-4">
                  <legend className="label px-0">{group.name}</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {visible.map((field) => {
                      if (field.kind === 'repeat') {
                        const positioned = positionRows(rowsOf(values, field.key))
                        const fieldProblem = problemByField.get(field.label)
                        return (
                          <div
                            key={field.key}
                            className="flex flex-col gap-3 sm:col-span-2"
                          >
                            <div>
                              <p className="label mb-0">
                                {field.label}
                                {field.required ? <RequiredBadge /> : null}
                              </p>
                              {field.hint ? (
                                <p className="hint mt-1">{field.hint}</p>
                              ) : null}
                              {fieldProblem !== undefined ? (
                                <FieldProblem
                                  id={`smg-${field.key}-problem`}
                                  message={`${field.label} ${fieldProblem}`}
                                />
                              ) : null}
                            </div>

                            {positioned.map(({ row, outputIndex }) => (
                              <div key={row.id} className="card-flat p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  {outputIndex === null ? (
                                    <span className="font-medium text-[14px] text-ink-subtle">
                                      {field.itemLabel} · empty, left out of the output
                                    </span>
                                  ) : (
                                    <span className="font-bold text-[14px] text-ink">
                                      {field.itemLabel} {outputIndex}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => removeRow(field.key, row.id)}
                                    className="flex min-h-11 items-center gap-1.5 rounded-sm border border-line-grey bg-white px-3 font-medium text-[14px] transition-colors hover:border-ink"
                                  >
                                    <X className="size-4" aria-hidden="true" />
                                    Remove
                                    <span className="sr-only">
                                      {` ${field.itemLabel.toLowerCase()}${
                                        outputIndex === null
                                          ? ' (blank)'
                                          : ` ${outputIndex}`
                                      }`}
                                    </span>
                                  </button>
                                </div>
                                <div
                                  className={`grid gap-3 ${
                                    field.itemFields.length > 1 ? 'sm:grid-cols-2' : ''
                                  }`}
                                >
                                  {field.itemFields.map((item) => {
                                    const id = `smg-${field.key}-${row.id}-${item.key}`
                                    const problem =
                                      outputIndex === null
                                        ? undefined
                                        : problemByField.get(
                                            `${field.itemLabel} ${outputIndex} · ${item.label}`,
                                          )
                                    return (
                                      <div
                                        key={item.key}
                                        className={
                                          item.kind === 'textarea' ? 'sm:col-span-2' : ''
                                        }
                                      >
                                        <label className="label" htmlFor={id}>
                                          {item.label}
                                          {item.required === true ? (
                                            <RequiredBadge />
                                          ) : null}
                                        </label>
                                        <ScalarInput
                                          id={id}
                                          kind={item.kind}
                                          value={row.data[item.key] ?? ''}
                                          placeholder={item.placeholder}
                                          options={item.options}
                                          invalid={problem !== undefined}
                                          describedBy={
                                            problem === undefined
                                              ? undefined
                                              : `${id}-problem`
                                          }
                                          onChange={(v) =>
                                            updateRow(field.key, row.id, item.key, v)
                                          }
                                        />
                                        {problem === undefined ? null : (
                                          <FieldProblem
                                            id={`${id}-problem`}
                                            message={`${item.label} ${problem}`}
                                          />
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            ))}

                            <button
                              type="button"
                              id={`smg-add-${field.key}`}
                              onClick={() => addRow(field)}
                              className="btn-brutal btn-brutal-sm btn-white self-start"
                            >
                              <Plus className="size-4" aria-hidden="true" />
                              {field.addLabel}
                            </button>
                          </div>
                        )
                      }

                      const id = `smg-${field.key}`
                      const hintId = field.hint ? `${id}-hint` : undefined
                      const problem = problemByField.get(field.label)
                      const problemId =
                        problem === undefined ? undefined : `${id}-problem`
                      const current = values[field.key]
                      const describedBy =
                        [hintId, problemId].filter((v) => v !== undefined).join(' ') ||
                        undefined
                      return (
                        <div
                          key={field.key}
                          className={field.kind === 'textarea' ? 'sm:col-span-2' : ''}
                        >
                          <label className="label" htmlFor={id}>
                            {field.label}
                            {field.required ? (
                              <RequiredBadge />
                            ) : (
                              <span className="ml-1.5 font-normal text-[13px] text-ink-subtle">
                                optional
                              </span>
                            )}
                          </label>
                          <ScalarInput
                            id={id}
                            kind={field.kind}
                            value={typeof current === 'string' ? current : ''}
                            placeholder={field.placeholder}
                            options={field.options}
                            invalid={problem !== undefined}
                            describedBy={describedBy}
                            onChange={(v) => setScalar(field.key, v)}
                          />
                          {field.hint ? (
                            <p className="hint mt-1.5" id={hintId}>
                              {field.hint}
                            </p>
                          ) : null}
                          {problem === undefined || problemId === undefined ? null : (
                            <FieldProblem
                              id={problemId}
                              message={`${field.label} ${problem}`}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </fieldset>
              )
            })}
          </div>
        </Pane>
      }
      output={
        <Pane
          title="JSON-LD"
          padded={false}
          scroll={false}
          actions={
            <>
              <CopyButton
                text={outputText}
                label={format === 'script' ? 'Copy script' : 'Copy JSON'}
              />
              <a
                href="https://search.google.com/test/rich-results"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-sm border border-line-grey bg-white px-3 py-1.5 font-medium text-[14px] transition-colors hover:border-ink"
              >
                Test in Google
                <ExternalLink className="size-4" aria-hidden="true" />
                <span className="sr-only">
                  {' '}
                  (opens the Rich Results Test in a new tab)
                </span>
              </a>
            </>
          }
        >
          <div className="flex h-full min-h-0 flex-col">
            {/* The verdict, pinned above the code — this is the whole point of the
                tool, so it never scrolls out of view. Colour is backed by an icon
                and by the wording. */}
            <div
              className={`shrink-0 border-line border-b px-4 py-3 ${
                allClear ? 'bg-tile-green' : 'bg-tile-yellow'
              }`}
            >
              <p className="flex items-start gap-2 font-semibold text-[15px] text-ink">
                {allClear ? (
                  <CircleCheck className="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
                ) : (
                  <TriangleAlert
                    className="mt-0.5 size-4.5 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span>{verdictHeadline}</span>
              </p>
              <p className="mt-1 pl-6.5 text-[13px] text-ink-muted leading-5">
                {verdictDetail}
              </p>
            </div>

            {/* The fix list sits directly under the verdict, ABOVE the code: the
                pane is as tall as the form beside it, so anything placed after
                the code would land below the fold on a long type. */}
            {issueCount > 0 ? (
              <div className="max-h-[13rem] shrink-0 overflow-auto border-line border-b">
                <h4 className="sticky top-0 border-line border-b bg-offwhite px-4 py-2 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
                  Needs attention ({issueCount})
                </h4>
                <ul className="flex flex-col gap-2 p-4">
                  {result.warnings.map((warning) => {
                    const target = targetIdByField.get(warning.field)
                    const body = (
                      <>
                        <TriangleAlert
                          className="mt-0.5 size-4 shrink-0 text-violet-700"
                          aria-hidden="true"
                        />
                        <span className="flex-1">
                          <strong className="text-ink">{warning.field}</strong>{' '}
                          <span className="text-ink-muted">{warning.message}</span>
                        </span>
                      </>
                    )
                    return (
                      <li key={`${warning.field}:${warning.message}`}>
                        {target === undefined ? (
                          <p className="flex items-start gap-2 rounded-sm border border-line-grey bg-white px-3 py-2 text-[13px] leading-5">
                            {body}
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={() => jumpToField(warning.field)}
                            className="flex min-h-11 w-full items-start gap-2 rounded-sm border border-line-grey bg-white px-3 py-2 text-left text-[13px] leading-5 transition-colors hover:border-ink"
                          >
                            {body}
                            <span className="shrink-0 font-semibold text-[12px] text-violet-700">
                              Go to field
                            </span>
                          </button>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}

            <div className="min-h-0 flex-1">
              <CodePane
                value={outputText}
                language="json"
                emptyLabel="Pick a schema type on the left — the JSON-LD appears here as you type."
              />
            </div>
          </div>
        </Pane>
      }
      status={
        <StatusBar
          state={allClear ? 'valid' : 'invalid'}
          message={statusMessage}
          stats={[
            {
              label: 'Google-required properties',
              value: `${satisfied}/${requiredFields.length}`,
            },
            {
              label: 'properties emitted',
              value: String(Math.max(Object.keys(result.jsonLd).length - 2, 0)),
            },
            { label: 'characters', value: String(outputText.length) },
          ]}
          privacyNote="Built in your browser — your page data is never uploaded"
        />
      }
    />
  )
}
