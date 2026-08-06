import { formatDisplayDate, formatMoney } from '@/lib/tools/invoice-generator/logic'
import { deriveLines, deriveTotals } from './derive'
import type { InvoiceTemplateProps } from './types'

/**
 * Agency — for creative and marketing studios that want the invoice to read
 * as on-brand, not administrative. A solid violet-900 masthead band carries
 * the business identity in oversized display type reversed to white, with
 * the "Invoice" word-mark reduced to a quiet, letter-spaced label beside it —
 * the studio's name is the hero, the document type is not. That's the one
 * accent treatment on the sheet: everything below the band reverts to plain
 * white so an accounts-payable clerk processes it exactly as fast as any
 * other template.
 */
export function AgencyTemplate({
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
      className="mx-auto flex aspect-[210/297] w-full max-w-[860px] flex-col overflow-hidden border border-line-grey bg-white text-ink shadow-card"
    >
      {/* Masthead band — the sheet's single colour treatment. Kept to a
          modest strip (padding, not height, drives its size) so it prints as
          a header, not a cover page. */}
      <header className="flex shrink-0 items-start justify-between gap-6 bg-violet-900 px-7 py-7 sm:px-9 sm:py-8">
        <div className="min-w-0">
          {draft.logo !== '' ? (
            // biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser
            <img
              src={draft.logo}
              alt={draft.fromName !== '' ? `${draft.fromName} logo` : 'Business logo'}
              className="mb-3 max-h-12 max-w-[140px] rounded-sm bg-white object-contain object-left p-1"
            />
          ) : null}
          <p className="break-words font-bold font-display text-[32px] text-white leading-[1.05] tracking-[-0.5px] sm:text-[38px]">
            {draft.fromName !== '' ? draft.fromName : 'Your business name'}
          </p>
          {draft.fromAddress.trim() !== '' ? (
            <p className="mt-2 whitespace-pre-line break-words text-[13px] text-white/70 leading-[1.5]">
              {draft.fromAddress}
            </p>
          ) : null}
          {draft.fromEmail !== '' ? (
            <p className="break-words text-[13px] text-white/70 leading-[1.5]">
              {draft.fromEmail}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <p className="font-bold text-[14px] text-white/80 uppercase leading-none tracking-[0.3em]">
            Invoice
          </p>
          <p className="mt-2 text-[13px] text-white/70 tabular-nums">
            {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
          </p>
        </div>
      </header>

      {/* Body — plain white from here down. Same data, same density as
          Classic, just carried in the studio's own type scale. */}
      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
              Billed to
            </p>
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

          <div className="border border-line-grey bg-offwhite p-3.5">
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
            <div className="mt-3 border-line-grey border-t pt-2.5">
              <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
                Amount due
              </p>
              {/* break-words so a crore-scale figure wraps inside the box
                  rather than pushing past the edge of the sheet. */}
              <p className="mt-0.5 break-words font-bold font-display text-[24px] text-violet-900 leading-tight tabular-nums">
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
            {lines.map((line) => (
              <tr key={line.id} className="border-line-grey border-b align-top">
                <td className="break-words py-2.5 pr-3 text-ink">
                  {line.isPlaceholder ? (
                    <span className="text-ink-subtle">{line.description}</span>
                  ) : (
                    line.description
                  )}
                </td>
                <td className="py-2.5 pl-3 text-right text-ink tabular-nums">
                  {line.quantityDisplay}
                </td>
                <td className="py-2.5 pl-3 text-right text-ink tabular-nums">
                  {line.rateDisplay}
                </td>
                <td className="py-2.5 pl-3 text-right text-ink tabular-nums">
                  {line.amountDisplay}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 flex justify-end">
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
            <div className="mt-1.5 flex items-baseline justify-between gap-4 border-t-2 border-violet-900 pt-2.5">
              <dt className="font-bold text-[11px] text-ink uppercase tracking-[0.14em]">
                Total due
              </dt>
              <dd className="font-bold font-display text-[20px] text-violet-900 tabular-nums">
                {totals.totalDisplay}
              </dd>
            </div>
          </dl>
        </div>

        {draft.notes.trim() !== '' ? (
          <div className="mt-7 border-line-grey border-t pt-4">
            <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
              Notes &amp; payment details
            </p>
            <p className="mt-1.5 whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.55]">
              {draft.notes}
            </p>
          </div>
        ) : null}

        {/* mt-auto pins the footer to the bottom of the A4 sheet on screen.
            In print the aspect ratio is released, so it simply follows the
            content — which is the right behaviour there. */}
        <div className="mt-auto pt-8">
          <div className="border-line-grey border-t pt-2 text-[11px] text-ink-subtle">
            {draft.invoiceNumber !== '' ? `${draft.invoiceNumber} · ` : ''}
            {draft.fromName !== '' ? draft.fromName : 'Invoice'}
          </div>
        </div>
      </div>
    </div>
  )
}
