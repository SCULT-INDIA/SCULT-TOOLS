import { formatDisplayDate, formatMoney } from '@/lib/tools/invoice-generator/logic'
import { deriveLines, deriveTotals } from './derive'
import type { InvoiceTemplateProps } from './types'

/**
 * Clinic — for healthcare practices, therapists and wellness studios, where
 * the invoice is often the last touchpoint after a session someone was
 * already a little anxious about. Nothing here should read as a hospital
 * billing form: no hard black rules, no display serif shouting "INVOICE",
 * no saturated colour. A single mint-tinted stripe runs down the left edge
 * of the sheet, the same soft tint pools quietly behind the amount-due
 * figure and the final total, and every corner is generously rounded.
 * Typography stays in the body's own gentle sans throughout — the display
 * serif other templates reach for is deliberately left unused here.
 */
export function ClinicTemplate({
  draft,
  result,
  currency,
  taxLabel,
  id,
}: InvoiceTemplateProps) {
  const lines = deriveLines(draft, result, currency)
  const totals = deriveTotals(draft, result, currency, taxLabel)

  return (
    <div
      id={id}
      className="mx-auto flex aspect-[210/297] w-full max-w-[860px] flex-col overflow-hidden rounded-panel border border-line-grey border-l-8 border-l-tile-green bg-white p-8 font-sans text-ink shadow-card sm:p-10"
    >
      <header className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          {draft.logo !== '' ? (
            // biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser
            <img
              src={draft.logo}
              alt={draft.fromName !== '' ? `${draft.fromName} logo` : 'Business logo'}
              className="mb-3 max-h-14 max-w-[160px] rounded-sm object-contain object-left"
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
          <p className="rounded-full bg-tile-green/45 px-3.5 py-1.5 font-semibold text-[11px] text-ink-muted uppercase leading-none tracking-[0.16em]">
            Invoice
          </p>
          <p className="mt-2.5 text-[13px] text-ink-muted tabular-nums">
            {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-5 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <p className="font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
            Billed to
          </p>
          <p className="mt-2 break-words font-semibold text-[14px] text-ink leading-5">
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

        {/* The one recurring accent treatment on the sheet: a soft, low-opacity
            mint card rather than a hard-bordered box. */}
        <div className="rounded-lg bg-tile-green/25 p-4">
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
          <div className="mt-3 border-line-grey/70 border-t pt-3">
            <p className="font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
              Amount due
            </p>
            {/* break-words so a crore-scale figure wraps inside the card
                rather than pushing past the edge of the sheet. */}
            <p className="mt-1 break-words font-bold text-[24px] text-ink leading-tight tabular-nums">
              {formatMoney(result.total, currency)}
            </p>
          </div>
        </div>
      </div>

      <table className="mt-8 w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th
              scope="col"
              className="border-line-grey border-b pr-3 pb-2 text-left font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
            >
              Description
            </th>
            <th
              scope="col"
              className="w-[9%] border-line-grey border-b pb-2 pl-3 text-right font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
            >
              Qty
            </th>
            <th
              scope="col"
              className="w-[20%] border-line-grey border-b pb-2 pl-3 text-right font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
            >
              Rate
            </th>
            <th
              scope="col"
              className="w-[22%] border-line-grey border-b pb-2 pl-3 text-right font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id} className="border-line-grey/70 border-b align-top">
              <td className="break-words py-3 pr-3 text-ink">
                {line.isPlaceholder ? (
                  <span className="text-ink-subtle">{line.description}</span>
                ) : (
                  line.description
                )}
              </td>
              <td className="py-3 pl-3 text-right text-ink tabular-nums">
                {line.quantityDisplay}
              </td>
              <td className="py-3 pl-3 text-right text-ink tabular-nums">
                {line.rateDisplay}
              </td>
              <td className="py-3 pl-3 text-right text-ink tabular-nums">
                {line.amountDisplay}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <dl className="w-full max-w-[290px] text-[13px]">
          <div className="flex justify-between gap-4 py-1">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd className="text-ink tabular-nums">{totals.subtotalDisplay}</dd>
          </div>
          {totals.discountLabel !== null ? (
            <div className="flex justify-between gap-4 py-1">
              <dt className="text-ink-muted">{totals.discountLabel}</dt>
              <dd className="text-ink tabular-nums">{totals.discountDisplay}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 py-1">
            <dt className="break-words text-ink-muted">{totals.taxLabel}</dt>
            <dd className="text-ink tabular-nums">{totals.taxDisplay}</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-4 rounded-lg bg-tile-green/35 px-3.5 py-2.5">
            <dt className="font-semibold text-[11px] text-ink uppercase tracking-[0.14em]">
              Total due
            </dt>
            <dd className="font-bold text-[20px] text-ink tabular-nums">
              {totals.totalDisplay}
            </dd>
          </div>
        </dl>
      </div>

      {draft.notes.trim() !== '' ? (
        <div className="mt-8 rounded-lg bg-offwhite p-4">
          <p className="font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
            Notes &amp; payment details
          </p>
          <p className="mt-1.5 whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.6]">
            {draft.notes}
          </p>
        </div>
      ) : null}

      {/* mt-auto pins the footer to the bottom of the A4 sheet on screen. In
          print the aspect ratio is released, so it simply follows the
          content — same mechanism as the Classic template. */}
      <div className="mt-auto pt-8">
        <div className="border-line-grey border-t pt-3 text-[11px] text-ink-subtle">
          {draft.invoiceNumber !== '' ? `${draft.invoiceNumber} · ` : ''}
          {draft.fromName !== '' ? draft.fromName : 'Invoice'}
        </div>
      </div>
    </div>
  )
}
