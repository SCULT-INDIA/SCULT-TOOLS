import { formatDisplayDate, formatMoney } from '@/lib/tools/invoice-generator/logic'
import { deriveLines, deriveTotals } from './derive'
import type { InvoiceTemplateProps } from './types'

/**
 * Tech — for software companies and subscription/SaaS billing. Reads like a
 * billing email from a product dashboard rather than a paper form: a two-
 * column grid replaces Classic's flex-justify-between throughout, invoice
 * number and dates carry a faint technical rhythm (tabular figures, wide
 * tracking — this project has no monospace stack, so that rhythm substitutes
 * for one), and the one colour move is the "Amount due" box getting a
 * violet-tinted, bordered card treatment — a pricing-table summary, not
 * Classic's plain offwhite box. Everything below stays quiet and grid-aligned
 * so the sheet still reads fast to an accounts-payable clerk.
 */
export function TechTemplate({
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
      className="mx-auto flex aspect-[210/297] w-full max-w-[860px] flex-col border border-line-grey bg-white p-7 text-ink shadow-card sm:p-9"
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-8">
        <div className="min-w-0">
          {draft.logo !== '' ? (
            // biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser
            <img
              src={draft.logo}
              alt={draft.fromName !== '' ? `${draft.fromName} logo` : 'Business logo'}
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
          <p className="font-bold font-display text-[28px] text-ink uppercase leading-none tracking-[-0.5px]">
            Invoice
          </p>
          {/* No mono stack in this project's type system (see app/globals.css
              --font-*) — tabular figures + wide tracking stand in for the
              "technical" feel instead of inventing a font. */}
          <p className="mt-2 text-[13px] text-violet-700 tabular-nums tracking-[0.08em]">
            {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
          </p>
        </div>
      </header>

      <div className="mt-5 h-px w-full bg-line-grey" aria-hidden="true" />

      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
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

        {/* The one colour move on the sheet — a pricing-table-style summary
            card (bg-tile-lavender + border) standing in for Classic's plain
            offwhite box. */}
        <div className="rounded-md border border-violet-100 bg-tile-lavender p-3.5">
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px]">
            <dt className="text-ink-muted">Issued</dt>
            <dd className="text-right text-ink tabular-nums">
              {formatDisplayDate(draft.issueDate) || '—'}
            </dd>
            <dt className="text-ink-muted">Due</dt>
            <dd className="text-right font-semibold text-ink tabular-nums">
              {formatDisplayDate(draft.dueDate) || '—'}
            </dd>
          </dl>
          <div className="mt-3 border-violet-400/30 border-t pt-2.5">
            <p className="font-bold text-[11px] text-violet-700 uppercase tracking-[0.14em]">
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
              className="border-violet-700 border-b-2 pr-3 pb-2 text-left font-bold text-[11px] text-violet-700 uppercase tracking-[0.14em]"
            >
              Description
            </th>
            <th
              scope="col"
              className="w-[9%] border-violet-700 border-b-2 pb-2 pl-3 text-right font-bold text-[11px] text-violet-700 uppercase tracking-[0.14em]"
            >
              Qty
            </th>
            <th
              scope="col"
              className="w-[20%] border-violet-700 border-b-2 pb-2 pl-3 text-right font-bold text-[11px] text-violet-700 uppercase tracking-[0.14em]"
            >
              Rate
            </th>
            <th
              scope="col"
              className="w-[22%] border-violet-700 border-b-2 pb-2 pl-3 text-right font-bold text-[11px] text-violet-700 uppercase tracking-[0.14em]"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => (
            <tr
              key={line.id}
              className={`border-line-grey border-b align-top ${
                index % 2 === 1 ? 'bg-violet-50' : ''
              }`}
            >
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
        <dl className="grid w-full max-w-[300px] grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[13px]">
          <dt className="text-ink-muted">Subtotal</dt>
          <dd className="text-right text-ink tabular-nums">{totals.subtotalDisplay}</dd>
          {totals.discountLabel !== null ? (
            <>
              <dt className="text-ink-muted">{totals.discountLabel}</dt>
              <dd className="text-right text-ink tabular-nums">
                {totals.discountDisplay}
              </dd>
            </>
          ) : null}
          <dt className="break-words text-ink-muted">{totals.taxLabel}</dt>
          <dd className="text-right text-ink tabular-nums">{totals.taxDisplay}</dd>
          <dt className="mt-1.5 border-violet-700 border-t-2 pt-2.5 font-bold text-[11px] text-ink uppercase tracking-[0.14em]">
            Total due
          </dt>
          <dd className="mt-1.5 border-violet-700 border-t-2 pt-2.5 text-right font-bold font-display text-[20px] text-violet-700 tabular-nums">
            {totals.totalDisplay}
          </dd>
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

      {/* mt-auto pins the footer to the bottom of the A4 sheet on screen. In
          print the aspect ratio is released, so it simply follows the
          content — which is the right behaviour there. */}
      <div className="mt-auto pt-8">
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-line-grey border-t pt-2 text-[11px] text-ink-subtle">
          <span className="tabular-nums tracking-[0.04em]">
            {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
          </span>
          <span className="text-right">
            {draft.fromName !== '' ? draft.fromName : 'Invoice'}
          </span>
        </div>
      </div>
    </div>
  )
}
