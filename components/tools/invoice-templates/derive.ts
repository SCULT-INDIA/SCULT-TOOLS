import {
  type CurrencyCode,
  formatMoney,
  type InvoiceDraft,
  type InvoiceTotals,
  parseAmountInput,
} from '@/lib/tools/invoice-generator/logic'

/**
 * Pre-shapes one line item for display, so all 11 templates render the exact
 * same placeholder text, rate parsing and error fallback instead of each
 * re-deriving it slightly differently. Extracted verbatim from the original
 * single-template sheet — this is not new behaviour, just shared behaviour.
 */
export interface DisplayLine {
  readonly id: string
  readonly description: string
  /** True when the line has no description yet — templates may style this as muted. */
  readonly isPlaceholder: boolean
  readonly quantityDisplay: string
  readonly rateDisplay: string
  readonly amountDisplay: string
}

export function deriveLines(
  draft: InvoiceDraft,
  result: InvoiceTotals,
  currency: CurrencyCode,
): readonly DisplayLine[] {
  return draft.lines.map((line, index) => {
    const amount = result.lineAmounts[index]
    const rate = parseAmountInput(line.rate)
    const quantity = line.quantity.trim()
    const description = line.description.trim()
    return {
      id: line.id,
      description: description !== '' ? description : `Item ${index + 1}`,
      isPlaceholder: description === '',
      quantityDisplay: quantity !== '' ? quantity : '0',
      rateDisplay:
        Number.isFinite(rate) && rate >= 0
          ? formatMoney(Math.round(rate * 100), currency)
          : '—',
      amountDisplay:
        amount?.error === undefined ? formatMoney(amount?.amount ?? 0, currency) : '—',
    }
  })
}

/** Pre-shapes the totals block — subtotal, an optional discount row, tax, total. */
export interface DisplayTotals {
  readonly subtotalDisplay: string
  /** Both set together, or both null when there is no discount to show. */
  readonly discountLabel: string | null
  readonly discountDisplay: string | null
  readonly taxLabel: string
  readonly taxDisplay: string
  readonly totalDisplay: string
}

export function deriveTotals(
  draft: InvoiceDraft,
  result: InvoiceTotals,
  currency: CurrencyCode,
  taxLabel: string,
): DisplayTotals {
  const hasDiscount = result.discountAmount > 0
  const discountLabel = hasDiscount
    ? `Discount${
        draft.discountKind === 'percent' && draft.discount.trim() !== ''
          ? ` (${draft.discount.trim()}%)`
          : ''
      }`
    : null

  return {
    subtotalDisplay: formatMoney(result.subtotal, currency),
    discountLabel,
    discountDisplay: hasDiscount
      ? `− ${formatMoney(result.discountAmount, currency)}`
      : null,
    taxLabel,
    taxDisplay: formatMoney(result.taxAmount, currency),
    totalDisplay: formatMoney(result.total, currency),
  }
}
