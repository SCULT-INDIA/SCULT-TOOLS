import { formatDisplayDate } from '@/lib/tools/invoice-generator/logic'
import { deriveLines, deriveTotals } from './derive'
import type { InvoiceTemplateProps } from './types'

/**
 * Boutique — for design studios, photographers, wedding and event planners,
 * fashion boutiques. Quieter luxury: a centred masthead carries the brand
 * name and the word "Invoice" in the display serif, resting on a single
 * soft lavender band — the only colour anywhere on the sheet. Everything
 * else recedes: hairline rules in the palest line colour available,
 * generous but disciplined whitespace, and right-aligned figures only
 * where scanning still matters (the line-item table, the totals). This is
 * the template for a client whose own brand voice is delicate, and the
 * invoice should read like a natural extension of that voice, not a
 * bolted-on business form.
 */
export function BoutiqueTemplate({
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
      className="mx-auto flex aspect-[210/297] w-full max-w-[860px] flex-col border border-line bg-white text-ink shadow-card"
    >
      {/* The one soft tint on the sheet — a full-width band carrying the
          centred brand identity and the "Invoice" masthead. */}
      <header className="bg-tile-lavender px-9 py-9 text-center sm:px-14 sm:py-10">
        {draft.logo !== '' ? (
          // biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser
          <img
            src={draft.logo}
            alt={draft.fromName !== '' ? `${draft.fromName} logo` : 'Business logo'}
            className="mx-auto mb-4 max-h-14 max-w-[180px] object-contain"
          />
        ) : null}
        <p className="break-words font-display text-[26px] text-ink leading-tight tracking-[0.02em] sm:text-[30px]">
          {draft.fromName !== '' ? draft.fromName : 'Your business name'}
        </p>
        {draft.fromAddress.trim() !== '' ? (
          <p className="mx-auto mt-2 max-w-[420px] whitespace-pre-line break-words text-[12.5px] text-ink-muted leading-[1.6]">
            {draft.fromAddress}
          </p>
        ) : null}
        {draft.fromEmail !== '' ? (
          <p className="break-words text-[12.5px] text-ink-muted leading-[1.6]">
            {draft.fromEmail}
          </p>
        ) : null}

        <div className="mx-auto my-4 h-px w-8 bg-ink-subtle" aria-hidden="true" />

        <p className="font-display text-[13px] text-ink-subtle uppercase tracking-[0.4em]">
          Invoice
        </p>
        <p className="mt-1.5 text-[12px] text-ink-subtle tabular-nums">
          {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
        </p>
      </header>

      <div className="flex flex-1 flex-col px-9 py-8 sm:px-14 sm:py-9">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-[10px] text-ink-subtle uppercase tracking-[0.25em]">
              Billed to
            </p>
            <p className="mt-2 break-words font-display text-[16px] text-ink leading-5">
              {draft.toName !== '' ? draft.toName : 'Your client'}
            </p>
            {draft.toAddress.trim() !== '' ? (
              <p className="mt-1 whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.55]">
                {draft.toAddress}
              </p>
            ) : null}
            {draft.toEmail !== '' ? (
              <p className="break-words text-[13px] text-ink-muted leading-[1.55]">
                {draft.toEmail}
              </p>
            ) : null}
          </div>

          <div className="border border-line px-6 py-5 text-center">
            <div className="flex justify-center gap-10">
              <div>
                <p className="text-[10px] text-ink-subtle uppercase tracking-[0.22em]">
                  Issued
                </p>
                <p className="mt-1 text-[13px] text-ink tabular-nums">
                  {formatDisplayDate(draft.issueDate) || '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-ink-subtle uppercase tracking-[0.22em]">
                  Due
                </p>
                <p className="mt-1 font-semibold text-[13px] text-ink tabular-nums">
                  {formatDisplayDate(draft.dueDate) || '—'}
                </p>
              </div>
            </div>
            <div className="mt-4 border-line border-t pt-4">
              <p className="text-[10px] text-ink-subtle uppercase tracking-[0.22em]">
                Amount due
              </p>
              {/* break-words so a crore-scale figure wraps inside the box
                  rather than pushing past the edge of the sheet. */}
              <p className="mt-1 break-words font-display text-[24px] text-ink leading-tight tabular-nums">
                {totals.totalDisplay}
              </p>
            </div>
          </div>
        </div>

        <table className="mt-8 w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th
                scope="col"
                className="border-line border-b pr-3 pb-2 text-left font-semibold text-[10px] text-ink-subtle uppercase tracking-[0.22em]"
              >
                Description
              </th>
              <th
                scope="col"
                className="w-[9%] border-line border-b pb-2 pl-3 text-right font-semibold text-[10px] text-ink-subtle uppercase tracking-[0.22em]"
              >
                Qty
              </th>
              <th
                scope="col"
                className="w-[20%] border-line border-b pb-2 pl-3 text-right font-semibold text-[10px] text-ink-subtle uppercase tracking-[0.22em]"
              >
                Rate
              </th>
              <th
                scope="col"
                className="w-[22%] border-line border-b pb-2 pl-3 text-right font-semibold text-[10px] text-ink-subtle uppercase tracking-[0.22em]"
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id} className="border-line border-b align-top">
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
            <div className="mt-2 flex items-baseline justify-between gap-4 border-line border-t pt-2.5">
              <dt className="font-semibold text-[11px] text-ink uppercase tracking-[0.2em]">
                Total due
              </dt>
              <dd className="font-display text-[19px] text-ink tabular-nums">
                {totals.totalDisplay}
              </dd>
            </div>
          </dl>
        </div>

        {draft.notes.trim() !== '' ? (
          <div className="mx-auto mt-7 max-w-[520px] border-line border-t pt-4 text-center">
            <p className="font-semibold text-[10px] text-ink-subtle uppercase tracking-[0.25em]">
              Notes &amp; payment details
            </p>
            <p className="mt-2 whitespace-pre-line break-words text-left text-[13px] text-ink-muted leading-[1.6]">
              {draft.notes}
            </p>
          </div>
        ) : null}

        {/* mt-auto pins the footer to the bottom of the A4 sheet on screen.
            In print the aspect ratio is released, so it simply follows the
            content — which is the right behaviour there. */}
        <div className="mt-auto pt-8 text-center">
          <div className="border-line border-t pt-2 text-[11px] text-ink-subtle tracking-[0.05em]">
            {draft.invoiceNumber !== '' ? `${draft.invoiceNumber} · ` : ''}
            {draft.fromName !== '' ? draft.fromName : 'Invoice'}
          </div>
        </div>
      </div>
    </div>
  )
}
