import { formatDisplayDate, formatMoney } from '@/lib/tools/invoice-generator/logic'
import { deriveLines, deriveTotals } from './derive'
import type { InvoiceTemplateProps } from './types'

/**
 * Enterprise / B2B services invoice — for IT consulting and professional
 * services firms billing other businesses. Buttoned-up and filed-away: the
 * entire header (business identity, billed-to, and invoice particulars)
 * lives inside one bordered grid so the sheet reads like a formal document
 * rather than a stack of loosely related blocks. Violet is rationed to two
 * structural touches — the masthead rule and the summary card's border/
 * label — and never used as a fill. Body text is font-sans throughout;
 * font-display is reserved for the single "Invoice" word-mark.
 */
export function CorporateTemplate({
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
      className="mx-auto flex aspect-[210/297] w-full max-w-[860px] flex-col border border-ink bg-white p-7 font-sans text-ink shadow-card sm:p-9"
    >
      <header className="flex items-end justify-between gap-6 border-violet-700 border-b-2 pb-3">
        <p className="font-bold font-display text-[26px] text-ink uppercase leading-none tracking-[-0.3px]">
          Invoice
        </p>
        <p className="shrink-0 text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
          No.{' '}
          <span className="font-bold text-ink tabular-nums">
            {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
          </span>
        </p>
      </header>

      <div className="mt-5 grid grid-cols-1 border border-line-grey sm:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col divide-y divide-line-grey border-line-grey sm:border-r">
          <div className="min-w-0 p-4">
            <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
              From
            </p>
            {draft.logo !== '' ? (
              // biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser
              <img
                src={draft.logo}
                alt={draft.fromName !== '' ? `${draft.fromName} logo` : 'Business logo'}
                className="mt-2 mb-2 max-h-12 max-w-[150px] object-contain object-left"
              />
            ) : null}
            <p className="mt-1.5 break-words font-semibold text-[14px] text-ink leading-5">
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

          <div className="min-w-0 p-4">
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
        </div>

        <div className="p-4">
          <div className="flex h-full flex-col justify-between border border-violet-700 p-3.5">
            <div>
              <p className="font-bold text-[11px] text-violet-700 uppercase tracking-[0.14em]">
                Invoice details
              </p>
              <dl className="mt-2 flex flex-col gap-1 text-[13px]">
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
            </div>
            <div className="mt-3 border-line-grey border-t pt-2.5">
              <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
                Amount due
              </p>
              {/* break-words so a crore-scale figure wraps inside the card
                  rather than pushing past the edge of the sheet. */}
              <p className="mt-0.5 break-words font-bold text-[21px] text-ink leading-tight tabular-nums">
                {formatMoney(result.total, currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <table className="mt-6 w-full border-collapse text-[13px]">
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
          <div className="mt-1.5 flex items-baseline justify-between gap-4 border-ink border-t-2 pt-2.5">
            <dt className="font-bold text-[11px] text-ink uppercase tracking-[0.14em]">
              Total due
            </dt>
            <dd className="font-bold text-[19px] text-ink tabular-nums">
              {totals.totalDisplay}
            </dd>
          </div>
        </dl>
      </div>

      {draft.notes.trim() !== '' ? (
        <div className="mt-6 border-line-grey border-t pt-4">
          <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
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
        <div className="border-line-grey border-t pt-2 text-[11px] text-ink-subtle">
          {draft.invoiceNumber !== '' ? `${draft.invoiceNumber} · ` : ''}
          {draft.fromName !== '' ? draft.fromName : 'Invoice'}
        </div>
      </div>
    </div>
  )
}
