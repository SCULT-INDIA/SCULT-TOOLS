import { formatDisplayDate } from '@/lib/tools/invoice-generator/logic'
import { deriveLines, deriveTotals } from './derive'
import type { InvoiceTemplateProps } from './types'

/**
 * Retail — for small shops and e-commerce sellers. Borrows the visual
 * language of a shop docket/receipt (narrow centred column, dashed rules,
 * tabular figures, a stamp-like accent near the total) without literally
 * being a thermal-printer receipt: it is still a full, professional A4
 * sheet, sized to fit one page for a typical order.
 */
export function RetailTemplate({
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
      className="mx-auto flex aspect-[210/297] w-full max-w-[860px] flex-col bg-white p-7 text-ink shadow-card sm:p-9"
    >
      {/* Narrower content column, centred — proportionate to the sheet
          rather than a token strip, so the page doesn't read as sparse. */}
      <div className="mx-auto flex w-full max-w-[80%] flex-1 flex-col">
        <header className="flex flex-col items-center text-center">
          {draft.logo !== '' ? (
            // biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser
            <img
              src={draft.logo}
              alt={draft.fromName !== '' ? `${draft.fromName} logo` : 'Business logo'}
              className="mb-3 max-h-14 max-w-[160px] object-contain"
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

          <p className="mt-4 font-display font-bold text-[26px] text-ink uppercase leading-none tracking-[-0.5px]">
            Invoice
          </p>
          <p className="mt-1.5 text-[12px] text-ink-muted tabular-nums">
            No. {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
          </p>
        </header>

        <div
          className="mt-5 border-line-grey border-t border-dashed"
          aria-hidden="true"
        />

        <div className="mt-5 flex flex-col gap-4 text-[13px] sm:flex-row sm:justify-between">
          <div className="min-w-0 sm:text-left">
            <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
              Sold to
            </p>
            <p className="mt-1.5 break-words font-semibold text-[14px] text-ink leading-5">
              {draft.toName !== '' ? draft.toName : 'Your client'}
            </p>
            {draft.toAddress.trim() !== '' ? (
              <p className="whitespace-pre-line break-words text-ink-muted leading-[1.5]">
                {draft.toAddress}
              </p>
            ) : null}
            {draft.toEmail !== '' ? (
              <p className="break-words text-ink-muted leading-[1.5]">{draft.toEmail}</p>
            ) : null}
          </div>

          <dl className="flex shrink-0 flex-col gap-1 sm:text-right">
            <div className="flex justify-between gap-3 sm:justify-end">
              <dt className="text-ink-muted">Issued</dt>
              <dd className="text-ink tabular-nums">
                {formatDisplayDate(draft.issueDate) || '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-3 sm:justify-end">
              <dt className="text-ink-muted">Due</dt>
              <dd className="font-semibold text-ink tabular-nums">
                {formatDisplayDate(draft.dueDate) || '—'}
              </dd>
            </div>
          </dl>
        </div>

        <div
          className="mt-5 border-line-grey border-t border-dashed"
          aria-hidden="true"
        />

        <table className="mt-5 w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th
                scope="col"
                className="border-line-grey border-b border-dashed pb-2 text-left font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
              >
                Item
              </th>
              <th
                scope="col"
                className="w-[9%] border-line-grey border-b border-dashed pb-2 pl-2 text-right font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
              >
                Qty
              </th>
              <th
                scope="col"
                className="w-[20%] border-line-grey border-b border-dashed pb-2 pl-2 text-right font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
              >
                Rate
              </th>
              <th
                scope="col"
                className="w-[22%] border-line-grey border-b border-dashed pb-2 pl-2 text-right font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr
                key={line.id}
                className="border-line-grey border-b border-dashed align-top"
              >
                <td className="break-words py-2.5 pr-2 text-ink">
                  {line.isPlaceholder ? (
                    <span className="text-ink-subtle">{line.description}</span>
                  ) : (
                    line.description
                  )}
                </td>
                <td className="py-2.5 pl-2 text-right text-ink tabular-nums">
                  {line.quantityDisplay}
                </td>
                <td className="py-2.5 pl-2 text-right text-ink tabular-nums">
                  {line.rateDisplay}
                </td>
                <td className="py-2.5 pl-2 text-right text-ink tabular-nums">
                  {line.amountDisplay}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 flex justify-end">
          <dl className="w-full max-w-[280px] text-[13px]">
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
            <div className="mt-2 flex items-center justify-between gap-4 border-line-grey border-t border-dashed pt-3">
              <dt className="rounded-full bg-tile-green px-2.5 py-1 font-bold text-[11px] text-ink uppercase tracking-[0.14em]">
                Total due
              </dt>
              <dd className="font-display font-bold text-[22px] text-ink tabular-nums">
                {totals.totalDisplay}
              </dd>
            </div>
          </dl>
        </div>

        {draft.notes.trim() !== '' ? (
          <div className="mt-6 border-line-grey border-t border-dashed pt-4 text-center sm:text-left">
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
            content — same mechanism as the Classic template. */}
        <div className="mt-auto pt-8 text-center">
          <div className="border-line-grey border-t border-dashed pt-2 text-[11px] text-ink-subtle">
            {draft.invoiceNumber !== '' ? `${draft.invoiceNumber} · ` : ''}
            {draft.fromName !== '' ? draft.fromName : 'Invoice'}
          </div>
        </div>
      </div>
    </div>
  )
}
