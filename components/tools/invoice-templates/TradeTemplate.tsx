import { formatDisplayDate } from '@/lib/tools/invoice-generator/logic'
import { deriveLines, deriveTotals } from './derive'
import type { InvoiceTemplateProps } from './types'

/**
 * Job-sheet invoice for contractors and home-service trades — electricians,
 * plumbers, HVAC, landscaping, construction. Rugged and high-contrast on
 * purpose: thick black rules instead of hairlines, bold all-caps headers,
 * and a stamped-yellow accent on the figures that matter (amount due,
 * total). Reads like a work order, not a letterhead — heavier weight
 * throughout than Classic, and cell-bordered tables instead of row rules.
 */
export function TradeTemplate({
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
      className="mx-auto flex aspect-[210/297] w-full max-w-[860px] flex-col border-2 border-ink bg-white p-7 font-medium font-sans text-ink shadow-card sm:p-9"
    >
      <header className="flex items-start justify-between gap-6 border-ink border-b-4 pb-5">
        <div className="min-w-0">
          {draft.logo !== '' ? (
            // biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser
            <img
              src={draft.logo}
              alt={draft.fromName !== '' ? `${draft.fromName} logo` : 'Business logo'}
              className="mb-3 max-h-14 max-w-[160px] object-contain object-left"
            />
          ) : null}
          <p className="break-words font-extrabold text-[16px] text-ink uppercase leading-5 tracking-tight">
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
          <p className="font-extrabold text-[34px] text-ink uppercase leading-none tracking-tight">
            Invoice
          </p>
          <p className="mt-2 inline-block border-2 border-ink bg-offwhite px-2.5 py-1 font-bold text-[13px] text-ink uppercase tabular-nums">
            {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
          </p>
        </div>
      </header>

      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <p className="inline-block border-cta-pure border-b-4 pb-0.5 font-extrabold text-[11px] text-ink uppercase tracking-[0.14em]">
            Bill to
          </p>
          <p className="mt-2 break-words font-bold text-[14px] text-ink leading-5">
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

        <div className="min-w-0 border-2 border-ink">
          <dl className="flex flex-col gap-1 p-3.5 text-[13px]">
            <div className="flex justify-between gap-3">
              <dt className="font-bold text-[11px] text-ink-subtle uppercase tracking-wide">
                Issued
              </dt>
              <dd className="font-semibold text-ink tabular-nums">
                {formatDisplayDate(draft.issueDate) || '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="font-bold text-[11px] text-ink-subtle uppercase tracking-wide">
                Due
              </dt>
              <dd className="font-semibold text-ink tabular-nums">
                {formatDisplayDate(draft.dueDate) || '—'}
              </dd>
            </div>
          </dl>
          {/* stamped accent — the one figure a job-sheet reader looks for first */}
          <div className="border-ink border-t-2 bg-cta-pure px-3.5 py-2.5">
            <p className="font-extrabold text-[11px] text-ink uppercase tracking-[0.14em]">
              Amount due
            </p>
            <p className="mt-0.5 break-words font-extrabold text-[24px] text-ink leading-tight tabular-nums">
              {totals.totalDisplay}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-7 mb-2 font-extrabold text-[11px] text-ink uppercase tracking-[0.14em]">
        Job sheet
      </p>
      <table className="w-full border-2 border-collapse border-ink text-[13px]">
        <thead>
          <tr className="bg-ink">
            <th
              scope="col"
              className="border border-ink px-3 py-2 text-left font-extrabold text-[11px] text-white uppercase tracking-[0.12em]"
            >
              Description
            </th>
            <th
              scope="col"
              className="w-[9%] border border-ink px-3 py-2 text-right font-extrabold text-[11px] text-white uppercase tracking-[0.12em]"
            >
              Qty
            </th>
            <th
              scope="col"
              className="w-[20%] border border-ink px-3 py-2 text-right font-extrabold text-[11px] text-white uppercase tracking-[0.12em]"
            >
              Rate
            </th>
            <th
              scope="col"
              className="w-[22%] border border-ink px-3 py-2 text-right font-extrabold text-[11px] text-white uppercase tracking-[0.12em]"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id}>
              <td className="break-words border border-ink px-3 py-2 align-top font-semibold text-ink">
                {line.isPlaceholder ? (
                  <span className="font-medium text-ink-subtle">{line.description}</span>
                ) : (
                  line.description
                )}
              </td>
              <td className="border border-ink px-3 py-2 text-right align-top text-ink tabular-nums">
                {line.quantityDisplay}
              </td>
              <td className="border border-ink px-3 py-2 text-right align-top text-ink tabular-nums">
                {line.rateDisplay}
              </td>
              <td className="border border-ink px-3 py-2 text-right align-top font-bold text-ink tabular-nums">
                {line.amountDisplay}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 flex justify-end">
        <dl className="w-full max-w-[300px] border-2 border-ink text-[13px]">
          <div className="flex justify-between gap-4 px-3.5 py-2">
            <dt className="font-bold text-[11px] text-ink-subtle uppercase tracking-wide">
              Subtotal
            </dt>
            <dd className="font-semibold text-ink tabular-nums">
              {totals.subtotalDisplay}
            </dd>
          </div>
          {totals.discountLabel !== null ? (
            <div className="flex justify-between gap-4 border-ink border-t px-3.5 py-2">
              <dt className="font-bold text-[11px] text-ink-subtle uppercase tracking-wide">
                {totals.discountLabel}
              </dt>
              <dd className="font-semibold text-ink tabular-nums">
                {totals.discountDisplay}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 border-ink border-t px-3.5 py-2">
            <dt className="break-words font-bold text-[11px] text-ink-subtle uppercase tracking-wide">
              {totals.taxLabel}
            </dt>
            <dd className="font-semibold text-ink tabular-nums">{totals.taxDisplay}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-ink border-t-2 bg-cta-pure px-3.5 py-3">
            <dt className="font-extrabold text-[12px] text-ink uppercase tracking-[0.14em]">
              Total due
            </dt>
            <dd className="font-extrabold text-[22px] text-ink tabular-nums">
              {totals.totalDisplay}
            </dd>
          </div>
        </dl>
      </div>

      {draft.notes.trim() !== '' ? (
        <div className="mt-6 border-cta-pure border-l-4 pl-3.5">
          <p className="font-extrabold text-[11px] text-ink uppercase tracking-[0.14em]">
            Notes &amp; payment details
          </p>
          <p className="mt-1.5 whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.55]">
            {draft.notes}
          </p>
        </div>
      ) : null}

      {/* mt-auto pins the footer to the bottom of the A4 sheet on screen. In
          print the aspect ratio is released, so it simply follows the
          content — which is the right behaviour there. */}
      <div className="mt-auto pt-8">
        <div className="border-ink border-t-2 pt-2 font-bold text-[11px] text-ink-subtle uppercase tracking-wide">
          {draft.invoiceNumber !== '' ? `${draft.invoiceNumber} · ` : ''}
          {draft.fromName !== '' ? draft.fromName : 'Invoice'}
        </div>
      </div>
    </div>
  )
}
