import type {
  CurrencyCode,
  InvoiceDraft,
  InvoiceTotals,
} from '@/lib/tools/invoice-generator/logic'

/**
 * The one contract every invoice template renders against.
 *
 * Deliberately narrow: a template receives the already-computed totals and
 * the already-resolved tax label, never the raw tax percentage or discount
 * logic. That split is what makes 11 wildly different designs safe to add —
 * every template is pure presentation over numbers `computeInvoice` in
 * lib/tools/invoice-generator/logic.ts already got right, so no template can
 * ever bill a client a different total than the form shows.
 *
 * `id` is applied by the CALLER to whichever instance is the live print
 * target (`#invoice-sheet`), not hardcoded in the template. `InvoiceGenerator`
 * renders two instances of the selected template — the inline pane (id set)
 * and the "Preview invoice" modal (id omitted) — and only one of them may
 * ever carry the print id, or the print stylesheet's `#invoice-sheet`
 * selector would match both and double the PDF.
 */
export interface InvoiceTemplateProps {
  readonly draft: InvoiceDraft
  readonly result: InvoiceTotals
  readonly currency: CurrencyCode
  readonly taxLabel: string
  readonly id?: string
}
