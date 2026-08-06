import { formatDisplayDate, formatMoney } from '@/lib/tools/invoice-generator/logic'
import { deriveLines, deriveTotals } from './derive'
import type { InvoiceTemplateProps } from './types'

/**
 * Hospitality — for cafés, restaurants and catering businesses. A cream-tinted
 * sheet (not white) sets the warm tone; the business name runs in Fraunces the
 * way a restaurant's name sits on a menu board. Peach — already a design
 * token, never an invented colour — is reserved for small warm accents (the
 * header rule, the invoice-number badge, the totals box, the notes card) so
 * body text stays on a near-white surface and keeps full contrast.
 *
 * The line-items table reads like a bill: taller rows than Classic, the item
 * name set larger and bolder, and the price column carrying more visual
 * weight (bigger, bolder, display face) than qty/rate. Row height is kept to
 * a deliberate py-3 rather than anything showier — a 6-line invoice must
 * still fit one A4 page, and this was checked against that case, not just a
 * 3-line demo.
 */
export function HospitalityTemplate({
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
      className="mx-auto flex aspect-[210/297] w-full max-w-[860px] flex-col border border-line-grey bg-cream p-7 text-ink shadow-card sm:p-9"
    >
      <header className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          {draft.logo !== '' ? (
            // biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser
            <img
              src={draft.logo}
              alt={draft.fromName !== '' ? `${draft.fromName} logo` : 'Business logo'}
              className="mb-3 max-h-14 max-w-[160px] object-contain object-left"
            />
          ) : null}
          <p className="break-words font-display font-semibold text-[22px] text-ink leading-[1.2] tracking-[-0.3px]">
            {draft.fromName !== '' ? draft.fromName : 'Your business name'}
          </p>
          {draft.fromAddress.trim() !== '' ? (
            <p className="mt-1.5 whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.5]">
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
          <p className="font-display font-bold text-[30px] text-ink uppercase leading-none tracking-[-0.5px]">
            Invoice
          </p>
          <p className="mt-2.5 inline-block rounded-full bg-peach px-3 py-1 font-semibold text-[12px] text-ink tabular-nums">
            {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
          </p>
        </div>
      </header>

      <div className="mt-5 h-[3px] w-full bg-peach" aria-hidden="true" />

      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]">
            Billed to
          </p>
          <p className="mt-1.5 break-words font-display font-semibold text-[16px] text-ink leading-5">
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

        <div className="rounded-md border border-peach bg-peach/30 p-3.5">
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
            {/* break-words so a crore-scale figure wraps inside the box rather
                than pushing past the edge of the sheet. */}
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
              className="border-peach border-b-2 pr-3 pb-2.5 text-left font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
            >
              Item
            </th>
            <th
              scope="col"
              className="w-[9%] border-peach border-b-2 pb-2.5 pl-3 text-right font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
            >
              Qty
            </th>
            <th
              scope="col"
              className="w-[20%] border-peach border-b-2 pb-2.5 pl-3 text-right font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
            >
              Rate
            </th>
            <th
              scope="col"
              className="w-[22%] border-peach border-b-2 pb-2.5 pl-3 text-right font-bold text-[11px] text-ink-subtle uppercase tracking-[0.14em]"
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr
              key={line.id}
              className="border-line-grey border-b border-dashed align-top"
            >
              <td className="break-words py-3 pr-3">
                {line.isPlaceholder ? (
                  <span className="font-display text-[15px] text-ink-subtle italic">
                    {line.description}
                  </span>
                ) : (
                  <span className="font-display font-semibold text-[15px] text-ink leading-[1.3]">
                    {line.description}
                  </span>
                )}
              </td>
              <td className="py-3 pl-3 text-right text-[13px] text-ink-muted tabular-nums">
                {line.quantityDisplay}
              </td>
              <td className="py-3 pl-3 text-right text-[13px] text-ink-muted tabular-nums">
                {line.rateDisplay}
              </td>
              <td className="py-3 pl-3 text-right font-display font-bold text-[15px] text-ink tabular-nums">
                {line.amountDisplay}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 flex justify-end">
        <dl className="w-full max-w-[300px] text-[13px]">
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
          <div className="mt-2 flex items-baseline justify-between gap-4 rounded-md bg-peach/50 px-3.5 py-2.5">
            <dt className="font-display font-bold text-[12px] text-ink uppercase tracking-[0.14em]">
              Total due
            </dt>
            <dd className="font-display font-bold text-[21px] text-ink tabular-nums">
              {totals.totalDisplay}
            </dd>
          </div>
        </dl>
      </div>

      {draft.notes.trim() !== '' ? (
        <div className="mt-6 rounded-md border border-peach/70 bg-peach/20 p-3.5">
          <p className="font-display font-semibold text-[13px] text-ink italic">
            Thank you &amp; notes
          </p>
          <p className="mt-1 whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.5]">
            {draft.notes}
          </p>
        </div>
      ) : null}

      {/* mt-auto pins the footer to the bottom of the A4 sheet on screen. In
          print the aspect ratio is released, so it simply follows the
          content — which is the right behaviour there. */}
      <div className="mt-auto pt-6">
        <p className="pb-2 text-center font-display text-[12px] text-ink-muted italic">
          Thank you for your business — we hope to serve you again soon.
        </p>
        <div className="border-peach border-t-2 pt-2 text-center text-[11px] text-ink-subtle">
          {draft.invoiceNumber !== '' ? `${draft.invoiceNumber} · ` : ''}
          {draft.fromName !== '' ? draft.fromName : 'Invoice'}
        </div>
      </div>
    </div>
  )
}
