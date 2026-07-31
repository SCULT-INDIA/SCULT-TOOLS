'use client'

// TriangleAlert, not AlertTriangle — this lucide version dropped the old alias.
import { Plus, Printer, Trash2, TriangleAlert } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  DropZone,
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarAction,
  ToolbarGroup,
  ToolToolbar,
  ToolWorkspace,
} from '@/components/tools/workspace'
import {
  addDays,
  CURRENCIES,
  type CurrencyCode,
  computeInvoice,
  daysBetween,
  dueDateFromTerms,
  formatDisplayDate,
  formatMoney,
  type InvoiceDraft,
  isCurrencyCode,
  nextInvoiceNumber,
  parseAmountInput,
  parseInvoiceDraft,
  suggestInvoiceNumber,
  toIsoDate,
} from '@/lib/tools/invoice-generator/logic'

/**
 * Invoice generator — rebuilt on the shared workspace.
 * Research brief: docs/research/invoice-generator.md
 *
 * The form is the left pane, the A4 sheet is the right pane, and the sheet is
 * the product: it is not a "preview of" the invoice, it IS the element the print
 * stylesheet hands to the PDF writer. Previously both lived in a page-level
 * two-column grid where a Totals card, the print button and three hint
 * paragraphs sat above the sheet, so the document started well below the fold
 * and every figure was printed twice — once in the card, once on the sheet.
 *
 * All arithmetic is in logic.ts: integer minor units, one rounding step per
 * figure, and the guarantee that subtotal − discount + tax === total exactly.
 * Nothing in this file recomputes money.
 *
 * Three behaviours here are genuinely UI-side:
 *   - draft autosave — the whole form persists to localStorage (debounced) and
 *     restores on return, because an invoice is rarely finished in one sitting;
 *   - the printable region — #invoice-sheet, isolated by PRINT_CSS below, which
 *     is what makes Print → Save as PDF produce a clean invoice with no site
 *     chrome and no trailing blank pages;
 *   - the logo — read locally with FileReader into a data URL, so it prints,
 *     persists with the draft, and never leaves the browser.
 */

const DRAFT_KEY = 'scult-tools:invoice-generator:v1'
const MAX_LINES = 50
const MAX_LOGO_BYTES = 1_000_000

/** Payment terms offered in the toolbar, in days after the issue date. */
const TERM_DAYS = [7, 14, 30] as const

/**
 * Pane sizing, passed straight through to ToolWorkspace's `minHeight` slot.
 *
 * A DEFINITE height from `lg` up, not merely a minimum. The workspace's grid row
 * is auto-sized, so with only a min-height the taller pane decides the row —
 * this form is roughly 1,600px of fields, which would stretch the row to 1,600px
 * and strand ~900px of empty space beside a 750px sheet. Fixing the height is
 * what makes the two panes genuinely equal and independently scrollable, which
 * is the layout contract. Below `lg` the panes stack and the page scrolls, so
 * the cap is deliberately scoped to the two-column case.
 */
const PANE_HEIGHT = 'min-h-[34rem] lg:h-[40rem]'

/**
 * Row-id strategy, and why it is split in two:
 *
 * The SEEDED rows must have fixed ids. A module-level counter here caused a real
 * hydration mismatch — the server rendered `line-1`/`line-2`, but dev-mode
 * double-invocation advanced the counter before the client's first paint, which
 * hydrated as `line-11`/`line-12` and broke every label/input pairing. Anything
 * counter- or clock-derived in the server-rendered tree brings that bug back.
 *
 * USER-ADDED rows may use a counter freely: they can only ever be created after
 * hydration, inside an event handler, so the server never sees them.
 */
const DEFAULT_LINE_IDS = ['line-a', 'line-b', 'line-c'] as const

let userLineCounter = 0
function nextLineId(): string {
  userLineCounter += 1
  return `line-u${userLineCounter}`
}

/**
 * The seeded sample. Dates and the suggested invoice number depend on "today",
 * so they are filled in after mount and left blank during the server render —
 * the first client paint must match the server byte for byte.
 */
function makeDefaultDraft(today?: Date): InvoiceDraft {
  return {
    fromName: 'Studio Andaz',
    fromAddress: '42 Residency Road\nBengaluru, Karnataka 560025\nGSTIN 29ABCDE1234F1Z5',
    fromEmail: 'billing@studioandaz.in',
    toName: 'Meridian Traders Pvt Ltd',
    toAddress: '8 FC Road\nPune, Maharashtra 411004\nGSTIN 27FGHIJ5678K1Z2',
    toEmail: 'accounts@meridiantraders.in',
    invoiceNumber: today ? suggestInvoiceNumber(today, 1) : '',
    issueDate: today ? toIsoDate(today) : '',
    dueDate: today ? toIsoDate(addDays(today, 14)) : '',
    currency: 'INR',
    lines: [
      {
        id: DEFAULT_LINE_IDS[0],
        description: 'Website design — 5 pages, 2 rounds of revisions',
        quantity: '1',
        rate: '45000',
      },
      {
        id: DEFAULT_LINE_IDS[1],
        description: 'Content writing (per page)',
        quantity: '5',
        rate: '1800',
      },
      {
        id: DEFAULT_LINE_IDS[2],
        description: 'Analytics & Search Console setup',
        quantity: '1',
        rate: '6500',
      },
    ],
    taxLabel: 'GST 18%',
    taxPercent: '18',
    discount: '0',
    discountKind: 'percent',
    notes:
      'Payment due within 14 days of the issue date.\n\nBank transfer — Studio Andaz, HDFC Bank, A/C 50100123456789, IFSC HDFC0000123.\nUPI: studioandaz@okhdfcbank\n\nPlease quote the invoice number with your payment.',
    logo: '',
  }
}

/**
 * Clear starts a genuinely blank invoice, but keeps the three things that are
 * settings rather than content: the currency, a fresh number in the same
 * series, and today's dates. Emptying those would just be work to redo.
 */
function makeEmptyDraft(today: Date, currency: CurrencyCode): InvoiceDraft {
  return {
    fromName: '',
    fromAddress: '',
    fromEmail: '',
    toName: '',
    toAddress: '',
    toEmail: '',
    invoiceNumber: suggestInvoiceNumber(today, 1),
    issueDate: toIsoDate(today),
    dueDate: toIsoDate(addDays(today, 14)),
    currency,
    lines: [{ id: nextLineId(), description: '', quantity: '1', rate: '' }],
    taxLabel: '',
    taxPercent: '',
    discount: '0',
    discountKind: 'percent',
    notes: '',
    logo: '',
  }
}

/**
 * The print stylesheet. This is the export path — there is no server, no
 * headless Chrome and no PDF library, so everything about the PDF is decided
 * here.
 *
 * Two passes, deliberately:
 *   1. A `visibility` pass. Universal support, and it keeps layout intact, so
 *      the sheet is pulled to the page origin absolutely. On its own it leaves
 *      the collapsed page occupying space, which can trail blank pages.
 *   2. A `:has()` pass, behind @supports. Everything that is not the sheet, a
 *      descendant of it, or an ANCESTOR of it is display:none'd; the ancestors
 *      are then flattened to plain blocks. The workspace's panes are
 *      independently scrolling boxes with a min-height, so that flattening must
 *      release overflow and height as well as spacing — otherwise the PDF is
 *      truncated at one screenful, which is the failure mode this rule exists
 *      to prevent.
 */
const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 14mm; }
  body * { visibility: hidden; }
  #invoice-sheet, #invoice-sheet * { visibility: visible; }
  #invoice-sheet {
    position: absolute; left: 0; top: 0; width: 100%;
    max-width: none; margin: 0; padding: 0; border: none; border-radius: 0;
    box-shadow: none; aspect-ratio: auto; min-height: 0;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  #invoice-sheet tr { break-inside: avoid; }
  /* Repeat the column headings on every page of a 50-line invoice. */
  #invoice-sheet thead { display: table-header-group; }
}
/* Where :has() is supported (all evergreen browsers), collapse everything that
   is not the invoice sheet or one of its ancestors, so the hidden page cannot
   leave trailing blank pages behind the sheet. */
@supports selector(html:has(body)) {
  @media print {
    body *:not(#invoice-sheet):not(#invoice-sheet *):not(:has(#invoice-sheet)) {
      display: none !important;
    }
    body :has(#invoice-sheet) {
      display: block !important; position: static !important;
      margin: 0 !important; padding: 0 !important; border: 0 !important;
      border-radius: 0 !important; box-shadow: none !important;
      background: #fff !important; max-width: none !important;
      width: auto !important; min-height: 0 !important; height: auto !important;
      overflow: visible !important;
    }
    #invoice-sheet { position: static !important; }
  }
}
`

/** An inline field problem. Icon plus wording, so colour is never the signal. */
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p className="mt-1.5 flex gap-1.5 font-medium text-[13px] text-ink" id={id}>
      <TriangleAlert
        className="mt-0.5 size-3.5 shrink-0 text-violet-700"
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  )
}

/**
 * A form section. `<fieldset>`/`<legend>` so the grouping is real rather than
 * visual — a screen reader announces the section name with each field inside it.
 *
 * The dividing rule sits on the CONTENT wrapper, not on the fieldset. A
 * `border-top` on a fieldset is interrupted by its own legend (the UA notches
 * the block-start border to seat it), which renders as a broken line; putting
 * the rule under the legend gives an unbroken section header instead.
 */
function FormSection({
  legend,
  children,
}: {
  legend: string
  children: React.ReactNode
}) {
  return (
    <fieldset>
      <legend className="px-0 font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
        {legend}
      </legend>
      <div className="mt-2 border-line border-t pt-4">{children}</div>
    </fieldset>
  )
}

/**
 * A caption label on the printed sheet.
 *
 * Document typography, not tool chrome: the sheet is monochrome on purpose.
 * Colour on an invoice costs the recipient ink and renders unpredictably on
 * office printers, so structure comes from hairlines, small caps and weight.
 */
function SheetLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
      {children}
    </p>
  )
}

export function InvoiceGenerator() {
  const [draft, setDraft] = useState<InvoiceDraft>(() => makeDefaultDraft())
  const [savedAt, setSavedAt] = useState(0)
  const [logoError, setLogoError] = useState('')
  const hydrated = useRef(false)
  const lastAddedLineId = useRef<string | null>(null)

  // Restore the autosaved draft after mount, never during render: the server
  // has no localStorage, and reading it in render would desync hydration.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY)
      if (stored !== null) {
        const parsed = parseInvoiceDraft(JSON.parse(stored))
        if (parsed) {
          setDraft(parsed)
          hydrated.current = true
          return
        }
      }
    } catch {
      // Blocked storage or corrupt JSON — fall through to fresh defaults.
    }
    const today = new Date()
    setDraft((d) => ({
      ...d,
      invoiceNumber: suggestInvoiceNumber(today, 1),
      issueDate: toIsoDate(today),
      dueDate: toIsoDate(addDays(today, 14)),
    }))
    hydrated.current = true
  }, [])

  // Debounced autosave. The cleanup cancels the pending write on every
  // keystroke, so only a 600ms pause actually touches localStorage.
  useEffect(() => {
    if (!hydrated.current) return
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
        setSavedAt(Date.now())
      } catch {
        // Private mode blocks writes; the form still works, just without a draft.
      }
    }, 600)
    return () => clearTimeout(t)
  }, [draft])

  useEffect(() => {
    if (savedAt === 0) return
    const t = setTimeout(() => setSavedAt(0), 2500)
    return () => clearTimeout(t)
  }, [savedAt])

  const result = useMemo(
    () =>
      computeInvoice({
        lines: draft.lines.map((line) => ({
          quantity: parseAmountInput(line.quantity),
          rate: parseAmountInput(line.rate),
        })),
        taxPercent: parseAmountInput(draft.taxPercent),
        discount: parseAmountInput(draft.discount),
        discountKind: draft.discountKind,
      }),
    [draft.lines, draft.taxPercent, draft.discount, draft.discountKind],
  )

  const currency = draft.currency
  const taxLabel = draft.taxLabel.trim() !== '' ? draft.taxLabel : 'Tax'
  const termDays = daysBetween(draft.issueDate, draft.dueDate)
  const lineErrorCount = result.lineAmounts.filter((l) => l.error !== undefined).length

  /**
   * The reconciliation guarantee, re-checked at the point of display rather than
   * asserted. It holds by construction in logic.ts; verifying it here means the
   * status bar reports something computed, not a marketing claim.
   */
  const reconciles =
    result.subtotal - result.discountAmount + result.taxAmount === result.total

  const notices: readonly string[] = [
    ...result.warnings,
    ...(termDays !== undefined && termDays < 0
      ? ['The due date falls before the issue date — worth checking.']
      : []),
    ...(logoError !== '' ? [logoError] : []),
  ]

  function patch(partial: Partial<InvoiceDraft>): void {
    setDraft((d) => ({ ...d, ...partial }))
  }

  function patchLine(
    id: string,
    partial: Partial<{ description: string; quantity: string; rate: string }>,
  ): void {
    setDraft((d) => ({
      ...d,
      lines: d.lines.map((line) => (line.id === id ? { ...line, ...partial } : line)),
    }))
  }

  function addLine(): void {
    const id = nextLineId()
    lastAddedLineId.current = id
    setDraft((d) => ({
      ...d,
      lines: [...d.lines, { id, description: '', quantity: '1', rate: '' }],
    }))
  }

  function removeLine(id: string): void {
    setDraft((d) => ({ ...d, lines: d.lines.filter((line) => line.id !== id) }))
  }

  /** Sets the due date to N days after the issue date, per the chosen term. */
  function applyTerm(days: number): void {
    setDraft((d) => {
      // dueDateFromTerms returns '' for a half-typed date, which doubles as the
      // validity check: if the issue date is not a real date yet, use today's.
      const issue =
        dueDateFromTerms(d.issueDate, 0) !== '' ? d.issueDate : toIsoDate(new Date())
      const due = dueDateFromTerms(issue, days)
      if (due === '') return d
      return { ...d, issueDate: issue, dueDate: due }
    })
  }

  function loadSample(): void {
    setLogoError('')
    setDraft(makeDefaultDraft(new Date()))
  }

  function clearAll(): void {
    if (!window.confirm('Clear the whole invoice and start again?')) return
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // Nothing to remove if storage is blocked.
    }
    setLogoError('')
    setDraft((d) => makeEmptyDraft(new Date(), d.currency))
  }

  function readLogo(file: File): void {
    // DropZone already enforces the byte ceiling and reports it. Type is checked
    // here because a drag-and-drop bypasses the input's `accept` filter.
    if (!file.type.startsWith('image/')) {
      setLogoError('Choose an image file — PNG, JPG, SVG or WebP.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const data = reader.result
      if (typeof data === 'string' && data.startsWith('data:image/')) {
        setLogoError('')
        patch({ logo: data })
      } else {
        setLogoError('That file could not be read. Try a PNG or JPG.')
      }
    }
    reader.onerror = () => setLogoError('That file could not be read. Try a PNG or JPG.')
    reader.readAsDataURL(file)
  }

  return (
    <>
      <style>{PRINT_CSS}</style>

      <ToolWorkspace
        inputLabel="Invoice details"
        outputLabel="Invoice preview"
        minHeight={PANE_HEIGHT}
        toolbar={
          <ToolToolbar
            actions={
              <>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-brutal btn-brutal-sm btn-violet"
                >
                  <Printer className="size-4" aria-hidden="true" />
                  Print → PDF
                </button>
                <ToolbarAction
                  onClick={() =>
                    patch({ invoiceNumber: nextInvoiceNumber(draft.invoiceNumber) })
                  }
                >
                  Next number
                </ToolbarAction>
                <ToolbarAction onClick={loadSample}>Load sample</ToolbarAction>
                <ToolbarAction onClick={clearAll}>Clear</ToolbarAction>
              </>
            }
          >
            <div className="flex items-center gap-2">
              <label
                className="font-medium text-[12px] text-ink-subtle uppercase tracking-[0.08em]"
                htmlFor="inv-currency"
              >
                Currency
              </label>
              <select
                id="inv-currency"
                className="min-h-9 rounded-sm border border-line-grey bg-white px-2 font-medium text-[13px] text-ink transition-colors hover:border-ink"
                value={draft.currency}
                onChange={(e) => {
                  const value = e.target.value
                  if (isCurrencyCode(value)) patch({ currency: value })
                }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <ToolbarGroup label="Terms">
              {TERM_DAYS.map((days) => (
                <SegmentButton
                  key={days}
                  active={termDays === days}
                  onClick={() => applyTerm(days)}
                  title={`Due ${days} days after the issue date`}
                >
                  Net {days}
                </SegmentButton>
              ))}
            </ToolbarGroup>
          </ToolToolbar>
        }
        input={
          <Pane
            title="Invoice details"
            actions={
              <span className="text-[12px] text-ink-subtle">
                {savedAt !== 0 ? 'Draft saved' : 'Autosaves locally'}
              </span>
            }
          >
            <div className="flex flex-col gap-5">
              <FormSection legend="Numbering & dates">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="label" htmlFor="inv-number">
                      Invoice number
                    </label>
                    <input
                      id="inv-number"
                      className="field"
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      value={draft.invoiceNumber}
                      onChange={(e) => patch({ invoiceNumber: e.target.value })}
                      aria-describedby="inv-number-hint"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="inv-issue-date">
                      Issue date
                    </label>
                    <input
                      id="inv-issue-date"
                      className="field"
                      type="date"
                      value={draft.issueDate}
                      onChange={(e) => patch({ issueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="inv-due-date">
                      Due date
                    </label>
                    <input
                      id="inv-due-date"
                      className="field"
                      type="date"
                      value={draft.dueDate}
                      onChange={(e) => patch({ dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <p className="hint mt-1.5" id="inv-number-hint">
                  “Next number” advances the last digits and keeps your padding, so
                  INV-2026-001 becomes INV-2026-002 and 2026/09 becomes 2026/10.
                </p>
              </FormSection>

              <FormSection legend="Who it is from and to">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="label" htmlFor="inv-from-name">
                        Your business
                      </label>
                      <input
                        id="inv-from-name"
                        className="field"
                        type="text"
                        autoComplete="organization"
                        value={draft.fromName}
                        onChange={(e) => patch({ fromName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="inv-from-address">
                        Your address
                      </label>
                      <textarea
                        id="inv-from-address"
                        className="field"
                        rows={3}
                        value={draft.fromAddress}
                        onChange={(e) => patch({ fromAddress: e.target.value })}
                        aria-describedby="inv-from-address-hint"
                      />
                      <p className="hint mt-1.5" id="inv-from-address-hint">
                        Put your GSTIN or VAT number on its own line here.
                      </p>
                    </div>
                    <div>
                      <label className="label" htmlFor="inv-from-email">
                        Your email
                      </label>
                      <input
                        id="inv-from-email"
                        className="field"
                        type="email"
                        autoComplete="email"
                        value={draft.fromEmail}
                        onChange={(e) => patch({ fromEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="label" htmlFor="inv-to-name">
                        Client
                      </label>
                      <input
                        id="inv-to-name"
                        className="field"
                        type="text"
                        autoComplete="off"
                        value={draft.toName}
                        onChange={(e) => patch({ toName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="inv-to-address">
                        Client address
                      </label>
                      <textarea
                        id="inv-to-address"
                        className="field"
                        rows={3}
                        value={draft.toAddress}
                        onChange={(e) => patch({ toAddress: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="inv-to-email">
                        Client email
                      </label>
                      <input
                        id="inv-to-email"
                        className="field"
                        type="email"
                        autoComplete="off"
                        value={draft.toEmail}
                        onChange={(e) => patch({ toEmail: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection legend="Line items">
                <div className="flex flex-col gap-3">
                  <div className="hidden gap-2 font-bold text-[12px] text-ink-subtle uppercase tracking-[0.08em] sm:grid sm:grid-cols-[minmax(0,1fr)_68px_104px_max-content]">
                    <span>Description</span>
                    <span>Qty</span>
                    <span>Rate</span>
                    <span className="w-[152px]">Amount</span>
                  </div>

                  {draft.lines.map((line, index) => {
                    const amount = result.lineAmounts[index]
                    const lineError = amount?.error
                    const errorId = `inv-line-${line.id}-error`
                    const rowName = `Line ${index + 1}`
                    return (
                      <div key={line.id}>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1fr)_68px_104px_max-content]">
                          <div className="col-span-2 sm:col-span-1">
                            <label className="sr-only" htmlFor={`inv-desc-${line.id}`}>
                              {rowName} description
                            </label>
                            <input
                              id={`inv-desc-${line.id}`}
                              ref={(el) => {
                                if (el && lastAddedLineId.current === line.id) {
                                  el.focus()
                                  lastAddedLineId.current = null
                                }
                              }}
                              className="field"
                              type="text"
                              autoComplete="off"
                              placeholder={`Item ${index + 1}`}
                              value={line.description}
                              onChange={(e) =>
                                patchLine(line.id, { description: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="sr-only" htmlFor={`inv-qty-${line.id}`}>
                              {rowName} quantity
                            </label>
                            <input
                              id={`inv-qty-${line.id}`}
                              className="field tabular-nums"
                              type="text"
                              inputMode="decimal"
                              autoComplete="off"
                              placeholder="1"
                              value={line.quantity}
                              onChange={(e) =>
                                patchLine(line.id, { quantity: e.target.value })
                              }
                              aria-describedby={lineError ? errorId : undefined}
                            />
                          </div>
                          <div>
                            <label className="sr-only" htmlFor={`inv-rate-${line.id}`}>
                              {rowName} rate
                            </label>
                            <input
                              id={`inv-rate-${line.id}`}
                              className="field tabular-nums"
                              type="text"
                              inputMode="decimal"
                              autoComplete="off"
                              placeholder="0.00"
                              value={line.rate}
                              onChange={(e) =>
                                patchLine(line.id, { rate: e.target.value })
                              }
                              aria-describedby={lineError ? errorId : undefined}
                            />
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-2 sm:col-span-1 sm:justify-start">
                            <p className="min-w-[100px] py-2.5 text-right text-[15px] text-ink tabular-nums">
                              {lineError
                                ? '—'
                                : formatMoney(amount?.amount ?? 0, currency)}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeLine(line.id)}
                              disabled={draft.lines.length <= 1}
                              aria-label={`Remove ${rowName.toLowerCase()}`}
                              className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-line-grey bg-white transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-45"
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        {lineError ? (
                          <FieldError id={errorId}>{lineError}</FieldError>
                        ) : null}
                      </div>
                    )
                  })}

                  <div>
                    <button
                      type="button"
                      onClick={addLine}
                      disabled={draft.lines.length >= MAX_LINES}
                      className="btn-brutal btn-brutal-sm btn-white"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                      Add line
                    </button>
                  </div>
                </div>
              </FormSection>

              <FormSection legend="Tax & discount">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="inv-tax-label">
                      Tax label
                    </label>
                    <input
                      id="inv-tax-label"
                      className="field"
                      type="text"
                      autoComplete="off"
                      placeholder="GST 18%"
                      value={draft.taxLabel}
                      onChange={(e) => patch({ taxLabel: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="inv-tax-rate">
                      Tax rate (%)
                    </label>
                    <input
                      id="inv-tax-rate"
                      className="field tabular-nums"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="18"
                      value={draft.taxPercent}
                      onChange={(e) => patch({ taxPercent: e.target.value })}
                    />
                  </div>
                </div>

                {/* Nested fieldset: the two kind toggles and the value belong to
                    one another, and a real <legend> beats role="group". */}
                <fieldset className="mt-4">
                  <legend className="label px-0">Discount</legend>
                  <div className="flex flex-wrap items-start gap-2">
                    <SegmentButton
                      active={draft.discountKind === 'percent'}
                      onClick={() => patch({ discountKind: 'percent' })}
                      title="A percentage of the subtotal"
                    >
                      Percent
                    </SegmentButton>
                    <SegmentButton
                      active={draft.discountKind === 'flat'}
                      onClick={() => patch({ discountKind: 'flat' })}
                      title={`A flat amount in ${currency}`}
                    >
                      Flat amount
                    </SegmentButton>
                    <div className="w-32">
                      <label className="sr-only" htmlFor="inv-discount">
                        Discount value
                      </label>
                      <input
                        id="inv-discount"
                        className="field tabular-nums"
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="0"
                        value={draft.discount}
                        onChange={(e) => patch({ discount: e.target.value })}
                        aria-describedby="inv-discount-hint"
                      />
                    </div>
                  </div>
                  <p className="hint mt-1.5" id="inv-discount-hint">
                    {draft.discountKind === 'percent'
                      ? 'A percentage of the subtotal, applied before tax.'
                      : `A flat amount in ${currency}, applied before tax.`}
                  </p>
                </fieldset>
              </FormSection>

              <FormSection legend="Notes & payment details">
                <label className="sr-only" htmlFor="inv-notes">
                  Notes and payment details
                </label>
                <textarea
                  id="inv-notes"
                  className="field"
                  rows={5}
                  value={draft.notes}
                  onChange={(e) => patch({ notes: e.target.value })}
                />
              </FormSection>

              <FormSection legend="Logo (optional)">
                {draft.logo === '' ? (
                  <DropZone
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    maxBytes={MAX_LOGO_BYTES}
                    onFile={readLogo}
                    label="Drop your logo, or choose a file"
                    hint="PNG, JPG, SVG or WebP under 1 MB"
                  />
                ) : (
                  <div className="flex flex-wrap items-center gap-3 rounded-card border border-line-grey bg-offwhite p-3">
                    {/* biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser */}
                    <img
                      src={draft.logo}
                      alt=""
                      className="max-h-12 max-w-[120px] object-contain"
                    />
                    <p className="min-w-[14ch] flex-1 text-[13px] text-ink-muted">
                      Added. It prints on the invoice and is saved with your local draft.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        patch({ logo: '' })
                        setLogoError('')
                      }}
                      className="min-h-11 rounded-sm border border-line-grey bg-white px-3 font-medium text-[14px] transition-colors hover:border-ink"
                    >
                      Remove logo
                    </button>
                  </div>
                )}
              </FormSection>

              {notices.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {notices.map((notice) => (
                    <li
                      key={notice}
                      className="flex items-start gap-2 rounded-sm border border-line-grey bg-tile-yellow p-3 text-[13px] text-ink-body leading-5"
                    >
                      <TriangleAlert
                        className="mt-0.5 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{notice}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Pane>
        }
        output={
          <Pane
            title="Invoice preview"
            actions={
              <CopyButton text={formatMoney(result.total, currency)} label="Copy total" />
            }
            scroll={false}
            padded={false}
          >
            <div className="h-full overflow-auto bg-offwhite p-4 sm:p-6">
              {/* THE PRINTABLE REGION. PRINT_CSS targets this id — everything
                  else on the page is collapsed around it, so what you see here
                  is exactly and only what lands in the PDF. */}
              <div
                id="invoice-sheet"
                className="mx-auto flex aspect-[210/297] w-full max-w-[860px] flex-col border border-line-grey bg-white p-7 text-ink shadow-card sm:p-9"
              >
                <header className="flex items-start justify-between gap-8">
                  <div className="min-w-0">
                    {draft.logo !== '' ? (
                      // biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser
                      <img
                        src={draft.logo}
                        alt={
                          draft.fromName !== ''
                            ? `${draft.fromName} logo`
                            : 'Business logo'
                        }
                        className="mb-3 max-h-14 max-w-[160px] object-contain object-left"
                      />
                    ) : null}
                    <p className="break-words font-semibold text-[15px] text-ink leading-5">
                      {draft.fromName !== '' ? draft.fromName : 'Your business name'}
                    </p>
                    {draft.fromAddress.trim() !== '' ? (
                      <p className="mt-1 whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.5]">
                        {draft.fromAddress}
                      </p>
                    ) : null}
                    {draft.fromEmail !== '' ? (
                      <p className="break-words text-[13px] text-ink-muted leading-[1.5]">
                        {draft.fromEmail}
                      </p>
                    ) : null}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-display font-bold text-[32px] text-ink uppercase leading-none tracking-[-0.5px]">
                      Invoice
                    </p>
                    <p className="mt-2 text-[13px] text-ink-muted tabular-nums">
                      {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
                    </p>
                  </div>
                </header>

                <div className="mt-5 h-px w-full bg-ink" aria-hidden="true" />

                <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                  <div className="min-w-0">
                    <SheetLabel>Billed to</SheetLabel>
                    <p className="mt-1.5 break-words font-semibold text-[14px] text-ink leading-5">
                      {draft.toName !== '' ? draft.toName : 'Your client'}
                    </p>
                    {draft.toAddress.trim() !== '' ? (
                      <p className="whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.5]">
                        {draft.toAddress}
                      </p>
                    ) : null}
                    {draft.toEmail !== '' ? (
                      <p className="break-words text-[13px] text-ink-muted leading-[1.5]">
                        {draft.toEmail}
                      </p>
                    ) : null}
                  </div>

                  <div className="border border-ink bg-offwhite p-3.5">
                    <dl className="flex flex-col gap-1 text-[13px]">
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-muted">Issued</dt>
                        <dd className="text-ink tabular-nums">
                          {formatDisplayDate(draft.issueDate) || '—'}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-muted">Due</dt>
                        <dd className="font-semibold text-ink tabular-nums">
                          {formatDisplayDate(draft.dueDate) || '—'}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-3 border-ink border-t pt-2.5">
                      <SheetLabel>Amount due</SheetLabel>
                      {/* break-words so a crore-scale INR figure wraps inside the
                          box rather than pushing past the edge of the sheet. */}
                      <p className="mt-0.5 break-words font-display font-bold text-[24px] text-ink leading-tight tabular-nums">
                        {formatMoney(result.total, currency)}
                      </p>
                    </div>
                  </div>
                </div>

                <table className="mt-7 w-full border-collapse text-[13px]">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="border-ink border-b pr-3 pb-2 text-left font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="w-[9%] border-ink border-b pb-2 pl-3 text-right font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
                      >
                        Qty
                      </th>
                      <th
                        scope="col"
                        className="w-[20%] border-ink border-b pb-2 pl-3 text-right font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
                      >
                        Rate
                      </th>
                      <th
                        scope="col"
                        className="w-[22%] border-ink border-b pb-2 pl-3 text-right font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.lines.map((line, index) => {
                      const amount = result.lineAmounts[index]
                      const rate = parseAmountInput(line.rate)
                      const quantity = line.quantity.trim()
                      return (
                        <tr key={line.id} className="border-line-grey border-b align-top">
                          <td className="break-words py-2.5 pr-3 text-ink">
                            {line.description.trim() !== '' ? (
                              line.description
                            ) : (
                              <span className="text-ink-subtle">Item {index + 1}</span>
                            )}
                          </td>
                          <td className="py-2.5 pl-3 text-right text-ink tabular-nums">
                            {quantity !== '' ? quantity : '0'}
                          </td>
                          <td className="py-2.5 pl-3 text-right text-ink tabular-nums">
                            {Number.isFinite(rate) && rate >= 0
                              ? formatMoney(Math.round(rate * 100), currency)
                              : '—'}
                          </td>
                          <td className="py-2.5 pl-3 text-right text-ink tabular-nums">
                            {amount?.error === undefined
                              ? formatMoney(amount?.amount ?? 0, currency)
                              : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                <div className="mt-5 flex justify-end">
                  <dl className="w-full max-w-[290px] text-[13px]">
                    <div className="flex justify-between gap-4 py-1">
                      <dt className="text-ink-muted">Subtotal</dt>
                      <dd className="text-ink tabular-nums">
                        {formatMoney(result.subtotal, currency)}
                      </dd>
                    </div>
                    {result.discountAmount > 0 ? (
                      <div className="flex justify-between gap-4 py-1">
                        <dt className="text-ink-muted">
                          Discount
                          {draft.discountKind === 'percent' &&
                          draft.discount.trim() !== ''
                            ? ` (${draft.discount.trim()}%)`
                            : ''}
                        </dt>
                        <dd className="text-ink tabular-nums">
                          − {formatMoney(result.discountAmount, currency)}
                        </dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between gap-4 py-1">
                      <dt className="break-words text-ink-muted">{taxLabel}</dt>
                      <dd className="text-ink tabular-nums">
                        {formatMoney(result.taxAmount, currency)}
                      </dd>
                    </div>
                    <div className="mt-1.5 flex items-baseline justify-between gap-4 border-ink border-t-2 pt-2.5">
                      <dt className="font-bold text-[11px] text-ink uppercase tracking-[0.14em]">
                        Total due
                      </dt>
                      <dd className="font-display font-bold text-[20px] text-ink tabular-nums">
                        {formatMoney(result.total, currency)}
                      </dd>
                    </div>
                  </dl>
                </div>

                {draft.notes.trim() !== '' ? (
                  <div className="mt-7 border-line-grey border-t pt-4">
                    <SheetLabel>Notes & payment details</SheetLabel>
                    <p className="mt-1.5 whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.55]">
                      {draft.notes}
                    </p>
                  </div>
                ) : null}

                {/* mt-auto pins the footer to the bottom of the A4 sheet on
                    screen. In print the aspect ratio is released, so it simply
                    follows the content — which is the right behaviour there. */}
                <div className="mt-auto pt-8">
                  <div className="border-line-grey border-t pt-2 text-[11px] text-ink-subtle">
                    {draft.invoiceNumber !== '' ? `${draft.invoiceNumber} · ` : ''}
                    {draft.fromName !== '' ? draft.fromName : 'Invoice'}
                  </div>
                </div>
              </div>
            </div>
          </Pane>
        }
        status={
          <StatusBar
            state={
              lineErrorCount > 0
                ? 'invalid'
                : result.subtotal > 0 && reconciles
                  ? 'valid'
                  : 'neutral'
            }
            message={
              lineErrorCount > 0
                ? `${lineErrorCount} line ${lineErrorCount === 1 ? 'item needs' : 'items need'} a valid number`
                : result.subtotal === 0
                  ? 'Add a quantity and rate to a line item'
                  : reconciles
                    ? 'Ready to print — every column reconciles exactly'
                    : 'Totals do not reconcile — please report this'
            }
            stats={[
              { label: 'line items', value: String(draft.lines.length) },
              { label: 'total due', value: formatMoney(result.total, currency) },
              {
                label: 'payment term',
                value: termDays === undefined ? '—' : `Net ${termDays}`,
              },
            ]}
            privacyNote="Never uploaded — the PDF comes from your own browser, the draft stays on this device"
          />
        }
      />
    </>
  )
}
