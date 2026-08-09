'use client'

// TriangleAlert, not AlertTriangle — this lucide version dropped the old alias.
import {
  ChevronDown,
  CircleCheck,
  ExternalLink,
  Eye,
  Info,
  List,
  Lock,
  Plus,
  Search,
  Smartphone,
  Sparkles,
  TriangleAlert,
  X,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  CodePane,
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarGroup,
  ToolToolbar,
  useDialogBehavior,
} from '@/components/tools/workspace'
import { trackToolEvent } from '@/lib/analytics'
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
  type SchemaTypeSpec,
  type SchemaValues,
  type SelectOption,
  wrapInScriptTag,
} from '@/lib/tools/schema-markup-generator/logic'

/**
 * Schema markup generator — a bespoke layout, not the shared two-pane
 * `ToolWorkspace`. Research brief: docs/research/schema-markup-generator.md
 *
 * Two persistent columns (Fields, JSON-LD) plus two on-demand overlays,
 * both triggered from the top toolbar rather than occupying a column of
 * their own — at the user's explicit request, after the original four-
 * column layout (Schema Types | Fields | JSON-LD | Rich Result Preview)
 * needed viewport-breakout tricks just to give Fields/JSON-LD enough room:
 *   - Schema Types: a searchable nav (Popular + collapsible categories) over
 *     the same nine types `logic.ts` supports — no new type is invented here.
 *     Now a slide-in drawer (`typesDrawerOpen`), not a persistent 208px
 *     column; its trigger shows the active type so the current selection is
 *     always visible without opening it.
 *   - Fields: unchanged form logic, still a column of its own.
 *   - JSON-LD: the requirement verdict is pinned above the code — "5 of 5
 *     required properties present", or the exact fields that are not. Every
 *     competitor marks a field with an asterisk and defers the verdict to
 *     Google's Rich Results Test, which happens after you have finished and
 *     left. Each shortfall is a BUTTON that focuses the offending input.
 *   - Rich Result Preview: a Google-snippet mock built from whatever `name`/
 *     `url`/`description` values are already filled in, plus a validation
 *     checklist and a static "AI Optimization Tips" callout. Bing and Mobile
 *     tabs reuse the same snippet — there is no differentiated preview logic
 *     for either yet, so pretending otherwise would be lying by omission.
 *     Now a centred modal (`previewOpen`), opened via the toolbar's "Preview"
 *     button, not a persistent column.
 *
 * Both overlays share one open/close contract, the shared `useDialogBehavior`
 * hook (components/tools/workspace/useDialogBehavior.ts): body scroll locks,
 * Escape closes, Tab is trapped inside the panel, and focus returns to
 * whichever toolbar button opened it — the same contract
 * `MobileDrawer.tsx` and `InvoiceGenerator.tsx`'s preview dialog already
 * establish elsewhere in this codebase, reused rather than reinvented.
 *
 * Cross-cutting behaviour that predates the overlay split:
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

/**
 * Sidebar taxonomy for the "Schema Types" column. Purely a re-grouping of the
 * nine types `logic.ts` already supports — no type here is invented. There is
 * no schema type in `logic.ts` that fits a "Media" bucket (VideoObject etc.
 * are not implemented), so that wireframe category is omitted rather than
 * shipped empty.
 */
const POPULAR_TYPES: readonly SchemaTypeId[] = [
  'Organization',
  'Article',
  'Product',
  'LocalBusiness',
]

const TYPE_CATEGORIES: readonly {
  readonly name: string
  readonly types: readonly SchemaTypeId[]
}[] = [
  { name: 'SEO', types: ['WebSite', 'BreadcrumbList'] },
  { name: 'Content', types: ['Article', 'HowTo'] },
  { name: 'Ecommerce', types: ['Product'] },
  { name: 'Local', types: ['LocalBusiness'] },
  { name: 'People', types: ['Person'] },
  { name: 'Other', types: ['Organization', 'Event'] },
]

/** One row in the schema-type nav — shared by "Popular", each category, and search results. */
function TypeNavItem({
  spec,
  active,
  onSelect,
}: {
  spec: SchemaTypeSpec
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`w-full rounded-sm border px-3 py-2 text-left font-medium text-[13px] transition-colors ${
        active
          ? 'border-violet-700 bg-violet-50 text-violet-700'
          : 'border-transparent text-ink hover:bg-offwhite'
      }`}
    >
      {spec.label}
    </button>
  )
}

/** A single row of the "Validation" checklist column. */
function CheckRow({
  state,
  label,
  detail,
  action,
}: {
  state: 'pass' | 'fail' | 'info'
  label: string
  detail: string
  action?: { label: string; href: string }
}) {
  return (
    <li className="flex items-start gap-2.5 py-2.5 text-[13px] leading-5">
      {state === 'pass' ? (
        <CircleCheck className="mt-0.5 size-4 shrink-0 text-green" aria-hidden="true" />
      ) : state === 'fail' ? (
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden="true" />
      ) : (
        <Info
          className="mt-0.5 size-4 shrink-0 text-[var(--color-violet-accent-text,var(--color-violet-700))]"
          aria-hidden="true"
        />
      )}
      <span className="flex-1">
        <strong className="text-ink">{label}</strong>{' '}
        <span className="text-ink-muted">{detail}</span>
        {action ? (
          <a
            className="ml-1.5 inline-flex items-center gap-1 font-semibold text-[12px] text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-2"
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {action.label}
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        ) : null}
      </span>
    </li>
  )
}

/**
 * Simplified brand marks for the preview surface tabs — recognisable, not a
 * pixel-exact reproduction of either company's official asset files (this
 * project has no license to embed those). Purely descriptive/comparative use
 * ("here is what a Google/Bing result looks like"), the same way any SEO
 * tool labels a search-result mockup — not used as this site's own identity.
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v9h11.8c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.6-9.48 6.6-16.16z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A11.96 11.96 0 0111 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.94 21.94 0 002 24c0 3.55.85 6.91 2.34 9.88z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  )
}

function BingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="10" fill="#008373" />
      <path fill="#fff" d="M18 10v22.5l5.5 2.5 11-6.3v-5.9l-9.3 5.4V13.6z" />
    </svg>
  )
}

function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
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
  const [minified, setMinified] = useState(false)
  const [requiredOnly, setRequiredOnly] = useState(false)
  const [previewTab, setPreviewTab] = useState<'google' | 'bing' | 'mobile'>('google')
  const [typeSearch, setTypeSearch] = useState('')
  // Field keys the visitor has typed into. Under "Required only" these stay on
  // screen — see markEdited.
  const [edited, setEdited] = useState<ReadonlySet<string>>(() => new Set())

  // Schema Types and Rich Result Preview moved out of the persistent 4-column
  // grid into an on-demand drawer and modal respectively — both closed by
  // default, opened from their toolbar triggers.
  const [typesDrawerOpen, setTypesDrawerOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const typesDrawerRef = useRef<HTMLDivElement>(null)
  const typesTriggerRef = useRef<HTMLButtonElement>(null)
  const previewModalRef = useRef<HTMLDivElement>(null)
  const previewTriggerRef = useRef<HTMLButtonElement>(null)
  useDialogBehavior(typesDrawerOpen, setTypesDrawerOpen, typesDrawerRef, typesTriggerRef)
  useDialogBehavior(previewOpen, setPreviewOpen, previewModalRef, previewTriggerRef)

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
  // `result.json` is the pretty-printed form logic.ts already produces; the
  // minified form is a display-only re-stringify of the same jsonLd object —
  // no new construction or validation logic, just a different serialisation.
  const activeJson = useMemo(
    () => (minified ? JSON.stringify(result.jsonLd) : result.json),
    [minified, result.jsonLd, result.json],
  )
  const scriptText = useMemo(() => wrapInScriptTag(activeJson), [activeJson])
  const outputText = format === 'script' ? scriptText : activeJson

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
    trackToolEvent('schema-markup-generator', 'load_sample')
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
    trackToolEvent('schema-markup-generator', 'clear')
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

  // Sidebar search matches the type LABEL, not its fields — searching is for
  // finding a type to switch to, not for finding a value inside one.
  const typeSearchQuery = typeSearch.trim().toLowerCase()
  const matchedTypes =
    typeSearchQuery === ''
      ? []
      : SCHEMA_TYPES.filter((t) => t.label.toLowerCase().includes(typeSearchQuery))

  const optionalFields = spec.fields.filter((f) => !f.required)
  const optionalFilled = optionalFields.filter((f) => isFieldFilled(f, values)).length

  /**
   * The rich-result snippet only has room for a title, a URL and a
   * description. `name` and `url` are the two keys nearly every type shares;
   * Breadcrumbs has neither, so its "page" is the last filled crumb instead.
   */
  function crumbPreviewSource(): { title: string; url: string } {
    const filled = rowsOf(values, 'crumbs').filter((r) => isRowFilled(r.data))
    const last = filled[filled.length - 1]
    return { title: last?.data.name ?? '', url: last?.data.url ?? '' }
  }
  const rawTitle = typeof values.name === 'string' ? values.name : ''
  const rawUrl = typeof values.url === 'string' ? values.url : ''
  const rawDescription = typeof values.description === 'string' ? values.description : ''
  const crumbSource = typeId === 'BreadcrumbList' ? crumbPreviewSource() : null
  const previewTitle = crumbSource?.title || rawTitle || `${spec.label} preview`
  const previewUrl = crumbSource?.url || rawUrl || 'https://example.com'
  const previewDescription =
    rawDescription || 'Add a description above to preview it in the snippet.'
  const previewDisplayUrl = previewUrl.replace(/^https?:\/\//, '')

  return (
    <>
      <div className="overflow-hidden rounded-panel border border-line bg-cream">
        <div className="border-line border-b bg-offwhite">
          <ToolToolbar>
            {/* Schema Types moved out of a persistent 208px column into this
              on-demand drawer trigger — it shows the active type so the
              current selection is always visible without opening it. Default
              `.btn-brutal` colouring (cta-yellow), one of the three brand
              button colours used across this toolbar. */}
            <button
              ref={typesTriggerRef}
              type="button"
              onClick={() => setTypesDrawerOpen(true)}
              className="btn-brutal btn-brutal-sm"
            >
              <List className="size-4" aria-hidden="true" />
              Schema type: {spec.label}
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>
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
        </div>

        {/* A dedicated, evenly-spaced grid rather than a left-packed
            flex-wrap row — 5 buttons of differing text length wrapped
            unevenly with a ragged gap on the right at desktop widths, and
            the same ragged look repeated (just narrower) on mobile. A grid
            gives every cell equal width at every breakpoint: 2-up on phones,
            3-up on small tablets, one even row of 5 from `lg` up. Brand
            buttons (`.btn-brutal`) spanning all three colour modifiers —
            default cta-yellow reserved for the type switcher above, so nothing
            in this row repeats it: `btn-violet` for the primary "view result"
            action, `btn-white` for the rest. */}
        <div className="grid grid-cols-2 gap-2 border-line border-b bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-5">
          <button
            type="button"
            onClick={loadExample}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Load example
          </button>
          <button
            type="button"
            onClick={clearFields}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Clear fields
          </button>
          <button
            type="button"
            onClick={() => {
              downloadFile(
                `${typeId.toLowerCase()}-schema.json`,
                activeJson,
                'application/json',
              )
              trackToolEvent('schema-markup-generator', 'download_schema', {
                format: 'json',
              })
            }}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Download JSON
          </button>
          <button
            type="button"
            onClick={() => {
              downloadFile(`${typeId.toLowerCase()}-schema.txt`, outputText, 'text/plain')
              trackToolEvent('schema-markup-generator', 'download_schema', {
                format: 'txt',
              })
            }}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Download TXT
          </button>
          <button
            ref={previewTriggerRef}
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="btn-brutal btn-brutal-sm btn-violet w-full col-span-2 sm:col-span-1"
          >
            <Eye className="size-4" aria-hidden="true" />
            Preview
          </button>
        </div>

        {/* Two columns, left to right: fill the fields, read the JSON-LD. Not
          the shared two-pane ToolWorkspace — Schema Types (drawer) and Rich
          Result Preview (modal) are now on-demand overlays rather than
          persistent columns, both triggered from the toolbar above, so the
          two columns that remain get the full container width between them
          — comfortably wide enough that neither needs the viewport-breakout
          this file used to carry when it had four columns to fit. */}
        <div className="grid lg:grid-cols-2">
          <section
            aria-label="Schema type fields"
            className="flex flex-col border-line border-b lg:h-[46rem] lg:border-b-0 lg:border-r"
          >
            <Pane title={`${spec.label} fields`}>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="hint">{spec.blurb}</p>

                  {/* Just the source link. The sentence that used to precede it —
                    "Required here means Google requires it, schema.org marks
                    nearly everything optional" — restated the howItWorks prose
                    rendered below the tool, so only the checkable citation stays. */}
                  <p className="hint mt-1.5">
                    Required flags follow{' '}
                    <a
                      className="font-medium text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-2"
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
                </div>

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
                                          {field.itemLabel} · empty, left out of the
                                          output
                                        </span>
                                      ) : (
                                        <span className="font-bold text-[14px] text-ink">
                                          {field.itemLabel} {outputIndex}
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => removeRow(field.key, row.id)}
                                        className="flex min-h-11 items-center gap-1.5 rounded-sm border border-line-grey bg-cream px-3 font-medium text-[14px] transition-colors hover:border-ink"
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
                                        field.itemFields.length > 1
                                          ? 'sm:grid-cols-2'
                                          : ''
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
                                        // A half-width nested cell cannot hold a URL or a
                                        // long free-text placeholder without truncating it
                                        // mid-word — the exact symptom this redesign exists
                                        // to remove. Widening the Fields floor helps but
                                        // cannot fix this on its own, since the nested
                                        // sub-grid always halves whatever width it is given.
                                        return (
                                          <div
                                            key={item.key}
                                            className={
                                              item.kind === 'textarea' ||
                                              item.kind === 'url' ||
                                              item.placeholder.length > 22
                                                ? 'sm:col-span-2'
                                                : ''
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
                            [hintId, problemId]
                              .filter((v) => v !== undefined)
                              .join(' ') || undefined
                          // Same reasoning as the repeat-row items below: a URL or a
                          // long free-text placeholder (an article title, an event
                          // name) does not fit a half-width cell without truncating —
                          // the exact complaint this redesign exists to fix. Widening
                          // the column floor cannot fix this alone, since the 2-up
                          // sub-grid always halves whatever width the column has.
                          return (
                            <div
                              key={field.key}
                              className={
                                field.kind === 'textarea' ||
                                field.kind === 'url' ||
                                field.placeholder.length > 22
                                  ? 'sm:col-span-2'
                                  : ''
                              }
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
          </section>

          <section aria-label="Generated JSON-LD" className="flex flex-col lg:h-[46rem]">
            <Pane
              title="JSON-LD"
              padded={false}
              scroll={false}
              actions={
                <>
                  <CopyButton
                    text={outputText}
                    label={format === 'script' ? 'Copy script' : 'Copy JSON'}
                    onCopy={() =>
                      trackToolEvent('schema-markup-generator', 'copy_output', { format })
                    }
                  />
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-sm border border-line-grey bg-cream px-3 py-1.5 font-medium text-[14px] transition-colors hover:border-ink"
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
                <div className="shrink-0 border-line border-b bg-offwhite">
                  <ToolToolbar>
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
                    <ToolbarGroup label="Format">
                      <SegmentButton
                        active={!minified}
                        onClick={() => setMinified(false)}
                        title="Indented, human-readable JSON"
                      >
                        Pretty
                      </SegmentButton>
                      <SegmentButton
                        active={minified}
                        onClick={() => setMinified(true)}
                        title="Whitespace stripped, smallest payload"
                      >
                        Minify
                      </SegmentButton>
                    </ToolbarGroup>
                  </ToolToolbar>
                </div>

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
                      <CircleCheck
                        className="mt-0.5 size-4.5 shrink-0"
                        aria-hidden="true"
                      />
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
                    <ul className="flex flex-col gap-1.5 p-3">
                      {result.warnings.map((warning) => {
                        const target = targetIdByField.get(warning.field)
                        const body = (
                          <>
                            <TriangleAlert
                              className="mt-0.5 size-4 shrink-0 text-[var(--color-violet-accent-text,var(--color-violet-700))]"
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
                              <p className="flex items-start gap-2 rounded-sm border border-line-grey bg-cream px-3 py-2 text-[13px] leading-5">
                                {body}
                              </p>
                            ) : (
                              <button
                                type="button"
                                onClick={() => jumpToField(warning.field)}
                                className="flex min-h-11 w-full items-start gap-2 rounded-sm border border-line-grey bg-cream px-3 py-2 text-left text-[13px] leading-5 transition-colors hover:border-ink"
                              >
                                {body}
                                <span className="shrink-0 font-semibold text-[12px] text-[var(--color-violet-accent-text,var(--color-violet-700))]">
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
                    wrap
                    emptyLabel="Pick a schema type on the left — the JSON-LD appears here as you type."
                  />
                </div>
              </div>
            </Pane>
          </section>
        </div>

        <div className="border-line border-t bg-offwhite">
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
        </div>
      </div>

      {/* Schema Types drawer — slides in from the left over a scrim. Same
          dialog contract as `MobileDrawer.tsx` (focus moves in on open, Tab
          cycles inside via `useDialogBehavior`, Escape closes, body scroll
          locks, focus returns to the trigger on close). Rendered regardless
          of `typesDrawerOpen` so the slide transition can animate both ways;
          `pointer-events-none` + `opacity-0` keep it inert and invisible
          while closed. */}
      <div
        aria-hidden={!typesDrawerOpen}
        onClick={() => setTypesDrawerOpen(false)}
        className={`fixed inset-0 z-70 bg-ink/40 transition-opacity duration-300 ${
          typesDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        ref={typesDrawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Schema types"
        aria-hidden={!typesDrawerOpen}
        className={`fixed top-0 left-0 z-70 h-full w-[300px] overflow-y-auto bg-cream shadow-card-raised transition-transform duration-300 sm:w-[340px] ${
          typesDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="flex min-h-12 items-center justify-between gap-3 border-line border-b px-4 py-2">
          <h3 className="font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
            Schema Types
          </h3>
          <button
            type="button"
            aria-label="Close schema types"
            onClick={() => setTypesDrawerOpen(false)}
            className="rounded p-1.5 hover:bg-offwhite"
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle"
              aria-hidden="true"
            />
            <label className="sr-only" htmlFor="smg-type-search">
              Search schema types
            </label>
            <input
              id="smg-type-search"
              type="search"
              className="field pl-9"
              placeholder="Search types…"
              value={typeSearch}
              onChange={(e) => setTypeSearch(e.target.value)}
            />
          </div>

          {typeSearchQuery !== '' ? (
            <div className="flex flex-col gap-1">
              <p className="label">Results</p>
              {matchedTypes.length === 0 ? (
                <p className="hint">No schema type matches “{typeSearch}”.</p>
              ) : (
                matchedTypes.map((t) => (
                  <TypeNavItem
                    key={t.id}
                    spec={t}
                    active={t.id === typeId}
                    onSelect={() => {
                      switchType(t.id)
                      setTypesDrawerOpen(false)
                    }}
                  />
                ))
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <p className="label">Popular</p>
                {POPULAR_TYPES.map((id) => {
                  const t = getSchemaType(id)
                  return t ? (
                    <TypeNavItem
                      key={id}
                      spec={t}
                      active={id === typeId}
                      onSelect={() => {
                        switchType(id)
                        setTypesDrawerOpen(false)
                      }}
                    />
                  ) : null
                })}
              </div>

              <div className="flex flex-col gap-2">
                <p className="label">Categories</p>
                {TYPE_CATEGORIES.map((category) => (
                  <details
                    key={category.name}
                    open
                    className="group rounded-sm border border-line-grey"
                  >
                    <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between px-3 py-1.5 font-bold text-[12px] text-ink-subtle uppercase tracking-[0.08em] [&::-webkit-details-marker]:hidden">
                      {category.name}
                      <ChevronDown
                        className="size-3.5 shrink-0 transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="flex flex-col gap-1 border-line-grey border-t p-1.5">
                      {category.types.map((id) => {
                        const t = getSchemaType(id)
                        return t ? (
                          <TypeNavItem
                            key={id}
                            spec={t}
                            active={id === typeId}
                            onSelect={() => {
                              switchType(id)
                              setTypesDrawerOpen(false)
                            }}
                          />
                        ) : null
                      })}
                    </div>
                  </details>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rich Result Preview modal — centred overlay, opened from the
          "Preview" toolbar button. Same dialog contract as the drawer above
          (and as `InvoiceGenerator.tsx`'s own preview dialog) via the shared
          `useDialogBehavior` hook. The backdrop's onClick only fires when the
          click TARGET is the backdrop itself, so a click anywhere on the
          panel cannot bubble up and dismiss it. */}
      {previewOpen ? (
        // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users already have Escape, wired via useDialogBehavior.
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Rich result preview"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewOpen(false)
          }}
          className="fixed inset-0 z-70 overflow-auto bg-ink/60 p-4 sm:p-10"
        >
          <div
            ref={previewModalRef}
            className="relative mx-auto w-full max-w-[560px] rounded-panel bg-cream p-5 shadow-card-raised sm:p-6"
          >
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-line-grey bg-cream text-ink hover:border-ink"
            >
              <X className="size-4.5" aria-hidden="true" />
              <span className="sr-only">Close preview</span>
            </button>

            <h3 className="pr-10 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              Rich Result Preview
            </h3>

            <div className="mt-4 flex flex-col gap-7">
              <div>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="tablist"
                  aria-label="Preview surface"
                >
                  <SegmentButton
                    active={previewTab === 'google'}
                    onClick={() => setPreviewTab('google')}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <GoogleIcon className="size-4" />
                      Google
                    </span>
                  </SegmentButton>
                  <SegmentButton
                    active={previewTab === 'bing'}
                    onClick={() => setPreviewTab('bing')}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BingIcon className="size-4" />
                      Bing
                    </span>
                  </SegmentButton>
                  <SegmentButton
                    active={previewTab === 'mobile'}
                    onClick={() => setPreviewTab('mobile')}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Smartphone className="size-4" aria-hidden="true" />
                      Mobile
                    </span>
                  </SegmentButton>
                </div>
                {previewTab !== 'google' ? (
                  <p className="hint mt-2">
                    Bing and mobile reuse this same snippet layout — there is no
                    differentiated preview for them yet.
                  </p>
                ) : null}
              </div>

              {(() => {
                // `print-paper-ctx`: this snippet is a mock of Google/Bing's own
                // result card, not this app's UI — it must read as a light SERP
                // regardless of site theme, the same reasoning that already
                // justifies the class for the invoice preview's paper canvas.
                const snippet = (
                  <div className="print-paper-ctx flex flex-col gap-1 rounded-card border border-line-grey bg-white p-4">
                    <div className="flex items-center gap-2 text-[12px] text-ink-subtle">
                      <span
                        className="inline-block size-4 rounded-full bg-tile-lavender"
                        aria-hidden="true"
                      />
                      <span className="truncate">{previewDisplayUrl}</span>
                    </div>
                    <p className="text-[17px] text-violet-700 leading-snug">
                      {previewTitle}
                    </p>
                    <p className="text-[13px] text-ink-muted leading-5">
                      {previewDescription}
                    </p>
                  </div>
                )
                if (previewTab !== 'mobile') return snippet
                // A full iPhone-proportioned frame, not a box just barely
                // taller than the snippet — fixed screen height (not
                // content-sized), the snippet sitting near the top of it
                // behind a browser address bar, real blank screen space
                // below (a phone shows one result inside a whole page, not
                // a result-sized window), and the home indicator anchored to
                // the true bottom of the device rather than to the snippet's
                // own bottom edge.
                return (
                  <div className="mx-auto w-full max-w-[300px]">
                    {/* `border-black`/`bg-black` deliberately, not the `ink` token: a
                      physical phone's bezel is always black, in either site theme —
                      `border-ink`/`bg-ink` would flip this to a pale case in dark mode,
                      which is the opposite of what a device mockup should do. */}
                    <div className="relative rounded-[2.75rem] border-[12px] border-black bg-black shadow-card-raised">
                      <div
                        className="absolute top-3 left-1/2 z-10 h-7 w-28 -translate-x-1/2 rounded-full bg-black"
                        aria-hidden="true"
                      />
                      <div className="flex h-[600px] flex-col overflow-hidden rounded-[1.9rem] bg-white">
                        <div className="shrink-0 px-3 pt-10 pb-2">
                          <div className="flex items-center gap-1.5 rounded-full border border-line-grey bg-offwhite px-3 py-2 text-[11px] text-ink-subtle">
                            <Lock className="size-3 shrink-0" aria-hidden="true" />
                            <span className="truncate">google.com</span>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-3">{snippet}</div>
                        <div className="flex shrink-0 justify-center py-2.5">
                          <div
                            className="h-1 w-28 rounded-full bg-ink/25"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              <div>
                <h4
                  id="smg-validation"
                  className="mb-2 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]"
                >
                  Validation
                </h4>
                <ul className="divide-y divide-line-grey border-line-grey border-y">
                  <CheckRow
                    state={missingRequired.length === 0 ? 'pass' : 'fail'}
                    label="Required Properties"
                    detail={`${satisfied}/${requiredFields.length} present.`}
                  />
                  <CheckRow
                    state={
                      optionalFields.length === 0
                        ? 'info'
                        : optionalFilled === optionalFields.length
                          ? 'pass'
                          : 'info'
                    }
                    label="Recommended Properties"
                    detail={
                      optionalFields.length === 0
                        ? 'This type has no optional properties.'
                        : `${optionalFilled}/${optionalFields.length} optional properties filled.`
                    }
                  />
                  <CheckRow
                    state="pass"
                    label="Schema.org Validation"
                    detail="The generated object is well-formed JSON-LD."
                  />
                  <CheckRow
                    state="info"
                    label="Google Rich Results Test"
                    detail="Run the live checker after you publish this markup."
                    action={{
                      label: 'Open test',
                      href: 'https://search.google.com/test/rich-results',
                    }}
                  />
                  <CheckRow
                    state={allClear ? 'pass' : 'fail'}
                    label="AI Search Readiness"
                    detail={
                      allClear
                        ? 'Structured data is complete for AI crawlers to parse.'
                        : 'Fix the items above so AI systems can parse this page confidently.'
                    }
                  />
                </ul>
              </div>

              <div className="flex gap-3 rounded-card border border-line-grey bg-tile-lavender p-4">
                <Sparkles
                  className="mt-0.5 size-4.5 shrink-0 text-violet-700"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[13px] text-ink">
                    AI Optimization Tips
                  </p>
                  <p className="mt-1 text-[13px] text-ink-muted leading-5">
                    {allClear
                      ? 'This markup gives AI answer engines and Google everything they need — the type, the required properties, and machine-readable text tied to your page.'
                      : 'AI systems read this exact JSON-LD to decide what your page is about. Fill in the missing properties above so they do not have to guess.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
