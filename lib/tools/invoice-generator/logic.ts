/**
 * Invoice arithmetic, numbering and money formatting.
 *
 * Purpose
 *   Compute invoice totals the way an accountant would check them: every
 *   figure in integer minor units (paise, cents), each displayed figure
 *   rounded exactly once, and the printed columns reconciling to the paisa —
 *   subtotal − discount + tax === total, always.
 *
 * Inputs   line items as numbers (quantity, rate in major units), a tax
 *          percentage, a discount (percent or flat), all as typed — half-typed
 *          and invalid values are the NORMAL case, not an exception.
 * Outputs  an InvoiceTotals whose amounts are integer minor units. Per-line
 *          problems are surfaced on that line's LineAmount, never as a throw,
 *          so one bad row cannot blank the whole invoice.
 * Failure  nothing here throws. Invalid rows get an `error` string and count
 *          as zero; out-of-range discounts and tax rates are clamped with a
 *          human-readable warning.
 *
 * No React, no DOM, no I/O — pure functions, unit-tested in logic.test.ts.
 */

/**
 * Billing currencies.
 *
 * Every entry is deliberately a TWO-DECIMAL currency, because the whole module
 * treats "minor units" as 1/100 of a major unit. Adding a zero-decimal currency
 * (JPY, KRW) or a three-decimal one (KWD, BHD) would silently inflate every
 * amount by 100x through `Math.round(x * 100)`, so they are excluded until the
 * minor-unit exponent is per-currency rather than a constant.
 */
export const CURRENCIES = [
  { code: 'INR', label: '₹ INR — Indian Rupee', locale: 'en-IN' },
  { code: 'USD', label: '$ USD — US Dollar', locale: 'en-US' },
  { code: 'EUR', label: '€ EUR — Euro', locale: 'en-IE' },
  { code: 'GBP', label: '£ GBP — British Pound', locale: 'en-GB' },
  { code: 'AED', label: 'د.إ AED — UAE Dirham', locale: 'en-AE' },
  { code: 'AUD', label: '$ AUD — Australian Dollar', locale: 'en-AU' },
  { code: 'CAD', label: '$ CAD — Canadian Dollar', locale: 'en-CA' },
  { code: 'SGD', label: '$ SGD — Singapore Dollar', locale: 'en-SG' },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]['code']

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCIES.some((c) => c.code === value)
}

export type DiscountKind = 'percent' | 'flat'

/**
 * The invoice sheet's visual design. Purely presentational — every template
 * renders the exact same computed totals from the exact same `InvoiceDraft`,
 * so switching templates can never change what a client is actually billed.
 *
 * Kept as data here (id + label), same pattern as `CURRENCIES`, so the
 * dropdown and the persistence validation both read from one list rather than
 * drifting. The templates themselves are React components and live in
 * `components/tools/invoice-templates/` — this module stays UI-free.
 */
export const INVOICE_TEMPLATES = [
  { id: 'classic', label: 'Classic — general business' },
  { id: 'minimal', label: 'Minimal — freelancer & consultant' },
  { id: 'agency', label: 'Agency — creative & marketing' },
  { id: 'corporate', label: 'Corporate — enterprise & B2B' },
  { id: 'boutique', label: 'Boutique — studio & events' },
  { id: 'trade', label: 'Trade — contractor & home services' },
  { id: 'retail', label: 'Retail — shop & e-commerce' },
  { id: 'hospitality', label: 'Hospitality — café & restaurant' },
  { id: 'tech', label: 'Tech — software & subscriptions' },
  { id: 'clinic', label: 'Clinic — health & wellness' },
  { id: 'nonprofit', label: 'Nonprofit — community & donations' },
] as const

export type TemplateId = (typeof INVOICE_TEMPLATES)[number]['id']

export function isTemplateId(value: string): value is TemplateId {
  return INVOICE_TEMPLATES.some((t) => t.id === value)
}

export interface InvoiceLineInput {
  readonly quantity: number
  readonly rate: number
}

export interface ComputeInvoiceInput {
  readonly lines: readonly InvoiceLineInput[]
  /** Percentage charged on the post-discount taxable value, e.g. 18. */
  readonly taxPercent: number
  /** Either a percentage of the subtotal or a flat amount in MAJOR units. */
  readonly discount: number
  readonly discountKind: DiscountKind
}

export interface LineAmount {
  /** Integer minor units. Zero when `error` is set. */
  readonly amount: number
  /** Set when this row is invalid; the row then contributes nothing. */
  readonly error?: string
}

export interface InvoiceTotals {
  /** All four figures are integer minor units (paise / cents). */
  readonly subtotal: number
  readonly discountAmount: number
  readonly taxAmount: number
  readonly total: number
  readonly lineAmounts: readonly LineAmount[]
  /** Clamps and ignored values, phrased for direct display. */
  readonly warnings: readonly string[]
  /** Reserved for structurally invalid input; per-row issues live on lineAmounts. */
  readonly error?: string
}

/**
 * One line may not exceed 10^13 minor units (₹100 billion). Beyond that the
 * float→integer rounding itself becomes lossy and the row is almost certainly
 * a typo, so it is refused rather than silently mis-rounded.
 */
const MAX_LINE_MINOR = 10_000_000_000_000

function computeLineAmount(line: InvoiceLineInput): LineAmount {
  if (!Number.isFinite(line.quantity)) {
    return { amount: 0, error: 'Quantity must be a number.' }
  }
  if (!Number.isFinite(line.rate)) {
    return { amount: 0, error: 'Rate must be a number.' }
  }
  if (line.quantity < 0) {
    return { amount: 0, error: 'Quantity cannot be negative.' }
  }
  if (line.rate < 0) {
    return { amount: 0, error: 'Rate cannot be negative.' }
  }
  // The ONE rounding step for this row: quantity × rate is taken to minor
  // units in a single multiply-and-round, so 3 × ₹33.33 is 9,999 paise —
  // never 100.00 from rounding the major-unit product first.
  const minor = Math.round(line.quantity * line.rate * 100)
  if (minor > MAX_LINE_MINOR) {
    return { amount: 0, error: 'This amount is too large to bill on one line.' }
  }
  return { amount: minor }
}

/**
 * Computes the invoice totals.
 *
 * The reconciliation guarantee, and why the order of operations matters:
 *   1. each line is rounded once to integer minor units
 *   2. subtotal = exact integer sum of those lines
 *   3. discount is rounded once and applied BEFORE tax (the standard GST/VAT
 *      treatment of an on-invoice trade discount: tax is charged on the
 *      discounted taxable value)
 *   4. tax = round(taxable × rate) — the fourth and final rounding
 *   5. total = taxable + tax, an exact integer sum
 * Because steps 2 and 5 are integer additions, subtotal − discount + tax
 * equals total to the last paisa — a property floating-point chains lose.
 */
export function computeInvoice(input: ComputeInvoiceInput): InvoiceTotals {
  const warnings: string[] = []
  const lineAmounts = input.lines.map(computeLineAmount)

  let subtotal = 0
  for (const line of lineAmounts) subtotal += line.amount

  // Discount. Non-finite means half-typed (e.g. a lone "-") and is quietly
  // treated as zero; an explicit negative is a real mistake and gets a warning.
  let discountValue = Number.isFinite(input.discount) ? input.discount : 0
  if (discountValue < 0) {
    warnings.push('A negative discount was ignored.')
    discountValue = 0
  }

  let discountAmount = 0
  if (input.discountKind === 'percent') {
    let pct = discountValue
    if (pct > 100) {
      pct = 100
      warnings.push('The discount was capped at 100% — an invoice cannot go below zero.')
    }
    discountAmount = Math.round((subtotal * pct) / 100)
  } else {
    discountAmount = Math.round(discountValue * 100)
    if (discountAmount > subtotal) {
      discountAmount = subtotal
      warnings.push(
        'The discount is more than the subtotal, so it was capped — an invoice cannot go below zero.',
      )
    }
  }

  const taxable = subtotal - discountAmount

  let taxPct = Number.isFinite(input.taxPercent) ? input.taxPercent : 0
  if (taxPct < 0) {
    warnings.push('A negative tax rate was ignored.')
    taxPct = 0
  }
  if (taxPct > 100) {
    taxPct = 100
    warnings.push('The tax rate was capped at 100%.')
  }
  const taxAmount = Math.round((taxable * taxPct) / 100)

  const total = taxable + taxAmount

  return { subtotal, discountAmount, taxAmount, total, lineAmounts, warnings }
}

/**
 * Interprets a form field as a number: empty means "not entered yet" (zero),
 * anything else goes through Number() so "12.5" works and "12,5" or "abc"
 * become NaN for computeInvoice to flag on the right row.
 */
export function parseAmountInput(raw: string): number {
  const trimmed = raw.trim()
  if (trimmed === '') return 0
  return Number(trimmed)
}

/**
 * Suggests a conventional sequential invoice number, e.g. `INV-2026-001`.
 * The sequence is padded to three digits and keeps growing past 999
 * (`INV-2026-1234`). An invalid date drops the year rather than throwing;
 * an invalid or sub-1 sequence restarts at 1.
 */
export function suggestInvoiceNumber(today: Date, seq: number): string {
  const n = Number.isFinite(seq) && seq >= 1 ? Math.floor(seq) : 1
  const padded = String(n).padStart(3, '0')
  if (Number.isNaN(today.getTime())) return `INV-${padded}`
  return `INV-${today.getFullYear()}-${padded}`
}

/**
 * Advances an invoice number by one, preserving whatever series the user
 * actually types. It increments the LAST run of digits and keeps its zero
 * padding, so `INV-2026-001` → `INV-2026-002`, `2026/09` → `2026/10`, and
 * `INV-007-A` → `INV-008-A`. A run at its padding width simply grows
 * (`INV-999` → `INV-1000`) rather than wrapping to `000`.
 *
 * Numbering is legally required to be sequential and gapless in most VAT/GST
 * regimes, which is exactly why this must follow the user's own scheme instead
 * of imposing ours: rewriting `2026/09` as `INV-2026-010` would break their
 * series. With no digits at all there is nothing to advance, so a suffix is
 * appended rather than guessing where a sequence should go.
 */
export function nextInvoiceNumber(current: string): string {
  const trimmed = current.trim()
  if (trimmed === '') return 'INV-001'
  const match = /(\d+)(\D*)$/.exec(trimmed)
  if (match === null) return `${trimmed}-2`
  const digits = match[1]
  const tail = match[2]
  if (digits === undefined || tail === undefined) return trimmed
  const next = String(Number(digits) + 1).padStart(digits.length, '0')
  return `${trimmed.slice(0, match.index)}${next}${tail}`
}

const formatterCache = new Map<CurrencyCode, Intl.NumberFormat>()

/**
 * Formats integer minor units as a currency string via Intl, using a locale
 * that matches the currency's home convention — so INR gets Indian digit
 * grouping (₹1,23,456.78 — lakhs and crores), while USD/EUR/GBP group in
 * thousands. Non-finite input returns '' rather than "NaN".
 */
export function formatMoney(minor: number, currency: CurrencyCode): string {
  if (!Number.isFinite(minor)) return ''
  let formatter = formatterCache.get(currency)
  if (formatter === undefined) {
    const locale = CURRENCIES.find((c) => c.code === currency)?.locale ?? 'en-IN'
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    formatterCache.set(currency, formatter)
  }
  return formatter.format(Math.round(minor) / 100)
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

/**
 * Renders a `yyyy-mm-dd` date-input value as "29 Jul 2026" without going
 * through Date, so there is no timezone edge to get wrong. Anything that is
 * not a plausible ISO date returns '' (a half-filled date input is normal).
 */
export function formatDisplayDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!match) return ''
  const [, year, month, day] = match
  if (year === undefined || month === undefined || day === undefined) return ''
  const monthName = MONTHS[Number(month) - 1]
  if (monthName === undefined) return ''
  const dayNumber = Number(day)
  if (dayNumber < 1 || dayNumber > 31) return ''
  return `${dayNumber} ${monthName} ${Number(year)}`
}

/** Local-time `yyyy-mm-dd` for seeding date inputs. Invalid dates give ''. */
export function toIsoDate(date: Date): string {
  if (Number.isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Returns a new Date `days` after the given one; the input is not mutated. */
export function addDays(date: Date, days: number): Date {
  const copy = new Date(date.getTime())
  copy.setDate(copy.getDate() + days)
  return copy
}

/**
 * Parses a `yyyy-mm-dd` value into a LOCAL Date, rejecting anything that is not
 * a real calendar date. `new Date('2026-02-31')` is a trap twice over: it parses
 * as UTC (so it can land on the previous day west of Greenwich) and it rolls
 * impossible days silently forward. Constructing from parts avoids the first,
 * and reading the parts back catches the second.
 */
function parseIsoDate(iso: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (match === null) return undefined
  const [, yearRaw, monthRaw, dayRaw] = match
  if (yearRaw === undefined || monthRaw === undefined || dayRaw === undefined) {
    return undefined
  }
  const year = Number(yearRaw)
  const month = Number(monthRaw)
  const day = Number(dayRaw)
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }
  return date
}

/**
 * Resolves a payment term ("Net 14") to a due date, given the issue date.
 *
 * Returns '' when the issue date is not yet a complete, real date — a
 * half-typed date input is the normal state while someone is filling the form,
 * not an error, and the caller should simply leave the due date alone.
 */
export function dueDateFromTerms(issueIso: string, days: number): string {
  if (!Number.isFinite(days)) return ''
  const issue = parseIsoDate(issueIso)
  if (issue === undefined) return ''
  return toIsoDate(addDays(issue, Math.trunc(days)))
}

/**
 * Whole days from the issue date to the due date, or undefined when either date
 * is incomplete. Negative means the due date precedes the issue date, which the
 * UI surfaces as a warning rather than silently printing an impossible term.
 */
export function daysBetween(fromIso: string, toIso: string): number | undefined {
  const from = parseIsoDate(fromIso)
  const to = parseIsoDate(toIso)
  if (from === undefined || to === undefined) return undefined
  // Both are local midnight, so the difference is a whole number of days except
  // across a DST boundary — rounding absorbs that hour.
  return Math.round((to.getTime() - from.getTime()) / 86_400_000)
}

/* ---------------------------------------------------------------------------
   Draft persistence — the whole form autosaves to localStorage.
   --------------------------------------------------------------------------- */

export interface DraftLine {
  readonly id: string
  readonly description: string
  /** Kept as typed — "1.5" mid-edit must survive a round trip. */
  readonly quantity: string
  readonly rate: string
}

export interface InvoiceDraft {
  readonly fromName: string
  readonly fromAddress: string
  readonly fromEmail: string
  readonly toName: string
  readonly toAddress: string
  readonly toEmail: string
  readonly invoiceNumber: string
  readonly issueDate: string
  readonly dueDate: string
  readonly currency: CurrencyCode
  readonly lines: readonly DraftLine[]
  readonly taxLabel: string
  readonly taxPercent: string
  readonly discount: string
  readonly discountKind: DiscountKind
  readonly notes: string
  /** Empty, or a `data:image/…` URL — the logo never leaves the browser. */
  readonly logo: string
  /** Which visual design renders the sheet. See `INVOICE_TEMPLATES`. */
  readonly template: TemplateId
}

const MAX_LINES = 50
const MAX_LOGO_DATA_URL = 1_500_000

function readString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string' || value.length > maxLength) return undefined
  return value
}

function readLine(value: unknown, index: number): DraftLine | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const record = value as Record<string, unknown>
  const description = readString(record.description, 500)
  const quantity = readString(record.quantity, 32)
  const rate = readString(record.rate, 32)
  if (description === undefined || quantity === undefined || rate === undefined) {
    return undefined
  }
  const id = readString(record.id, 64)
  return {
    id: id !== undefined && id !== '' ? id : `line-restored-${index}`,
    description,
    quantity,
    rate,
  }
}

/**
 * Validates a previously autosaved draft. localStorage is user-writable and
 * survives across deploys, so its contents are untrusted input: any shape
 * surprise returns undefined and the caller falls back to the defaults. The
 * one lenient field is the logo — a corrupt logo degrades to "no logo"
 * instead of discarding the whole invoice the user typed.
 */
export function parseInvoiceDraft(raw: unknown): InvoiceDraft | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined
  const record = raw as Record<string, unknown>

  const fromName = readString(record.fromName, 200)
  const fromAddress = readString(record.fromAddress, 2000)
  const fromEmail = readString(record.fromEmail, 200)
  const toName = readString(record.toName, 200)
  const toAddress = readString(record.toAddress, 2000)
  const toEmail = readString(record.toEmail, 200)
  const invoiceNumber = readString(record.invoiceNumber, 64)
  const issueDate = readString(record.issueDate, 32)
  const dueDate = readString(record.dueDate, 32)
  const taxLabel = readString(record.taxLabel, 64)
  const taxPercent = readString(record.taxPercent, 32)
  const discount = readString(record.discount, 32)
  const notes = readString(record.notes, 2000)

  if (
    fromName === undefined ||
    fromAddress === undefined ||
    fromEmail === undefined ||
    toName === undefined ||
    toAddress === undefined ||
    toEmail === undefined ||
    invoiceNumber === undefined ||
    issueDate === undefined ||
    dueDate === undefined ||
    taxLabel === undefined ||
    taxPercent === undefined ||
    discount === undefined ||
    notes === undefined
  ) {
    return undefined
  }

  const currencyRaw = record.currency
  if (typeof currencyRaw !== 'string' || !isCurrencyCode(currencyRaw)) return undefined

  const kindRaw = record.discountKind
  if (kindRaw !== 'percent' && kindRaw !== 'flat') return undefined

  if (!Array.isArray(record.lines) || record.lines.length > MAX_LINES) return undefined
  const lines: DraftLine[] = []
  for (const [index, item] of record.lines.entries()) {
    const line = readLine(item, index)
    if (line === undefined) return undefined
    lines.push(line)
  }

  const logoRaw = readString(record.logo, MAX_LOGO_DATA_URL) ?? ''
  const logo = logoRaw.startsWith('data:image/') ? logoRaw : ''

  // Defaults rather than rejects: every draft saved before templates shipped
  // is missing this field entirely, and treating that as corrupt would throw
  // away someone's whole in-progress invoice over a feature that didn't exist
  // yet. An unrecognised value (a template renamed or removed later) falls
  // back the same way rather than losing the draft.
  const templateRaw = record.template
  const template: TemplateId =
    typeof templateRaw === 'string' && isTemplateId(templateRaw) ? templateRaw : 'classic'

  return {
    fromName,
    fromAddress,
    fromEmail,
    toName,
    toAddress,
    toEmail,
    invoiceNumber,
    issueDate,
    dueDate,
    currency: currencyRaw,
    lines,
    template,
    taxLabel,
    taxPercent,
    discount,
    discountKind: kindRaw,
    notes,
    logo,
  }
}
