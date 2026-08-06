import { formatDisplayDate, formatMoney } from '@/lib/tools/invoice-generator/logic'
import { deriveLines, deriveTotals } from './derive'
import type { InvoiceTemplateProps } from './types'

/**
 * The quiet one — for a freelancer or independent consultant billing a client
 * directly, not a company presenting a brand identity. Deliberately the only
 * template with no `font-display` anywhere: Fraunces reads as "designed," and
 * the brief here is "a well-typeset letter," so headings are sans, same
 * weight family as the body, differentiated by size and tracking alone.
 *
 * Composition is left-margin-anchored throughout — business identity, the
 * "Invoice" label, dates and the billed-to block all start at the same left
 * edge, unlike Classic's right-aligned masthead. The single concession to
 * structure is one hairline rule under the letterhead; everywhere else,
 * hierarchy comes from whitespace and type weight, not boxes or borders.
 * Colour is almost entirely absent — the one restrained touch is the final
 * total figure in violet-700, so the number a client cares about most is the
 * only thing on the page that isn't black, grey or white.
 */
export function MinimalTemplate({
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
      className="mx-auto flex aspect-[210/297] w-full max-w-[860px] flex-col bg-white p-10 font-sans text-ink shadow-xs sm:p-14"
    >
      <header>
        {draft.logo !== '' ? (
          // biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser
          <img
            src={draft.logo}
            alt={draft.fromName !== '' ? `${draft.fromName} logo` : 'Business logo'}
            className="mb-5 max-h-12 max-w-[150px] object-contain object-left"
          />
        ) : null}
        <p className="break-words font-semibold text-[15px] text-ink leading-5">
          {draft.fromName !== '' ? draft.fromName : 'Your business name'}
        </p>
        {draft.fromAddress.trim() !== '' ? (
          <p className="mt-1 whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.6]">
            {draft.fromAddress}
          </p>
        ) : null}
        {draft.fromEmail !== '' ? (
          <p className="break-words text-[13px] text-ink-muted leading-[1.6]">
            {draft.fromEmail}
          </p>
        ) : null}
      </header>

      <div className="mt-10 flex flex-wrap items-start gap-x-12 gap-y-5">
        <div>
          <p className="font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.2em]">
            Invoice
          </p>
          <p className="mt-1.5 text-[15px] text-ink tabular-nums">
            {draft.invoiceNumber !== '' ? draft.invoiceNumber : '—'}
          </p>
        </div>
        <div>
          <p className="font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.2em]">
            Issued
          </p>
          <p className="mt-1.5 text-[15px] text-ink tabular-nums">
            {formatDisplayDate(draft.issueDate) || '—'}
          </p>
        </div>
        <div>
          <p className="font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.2em]">
            Due
          </p>
          <p className="mt-1.5 text-[15px] text-ink tabular-nums">
            {formatDisplayDate(draft.dueDate) || '—'}
          </p>
        </div>
        <div>
          <p className="font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.2em]">
            Amount due
          </p>
          {/* break-words so a crore-scale figure wraps rather than pushing
              past the edge of the sheet. */}
          <p className="mt-1.5 break-words font-semibold text-[15px] text-ink tabular-nums">
            {formatMoney(result.total, currency)}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.2em]">
          Billed to
        </p>
        <p className="mt-1.5 break-words font-semibold text-[14px] text-ink leading-5">
          {draft.toName !== '' ? draft.toName : 'Your client'}
        </p>
        {draft.toAddress.trim() !== '' ? (
          <p className="whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.6]">
            {draft.toAddress}
          </p>
        ) : null}
        {draft.toEmail !== '' ? (
          <p className="break-words text-[13px] text-ink-muted leading-[1.6]">
            {draft.toEmail}
          </p>
        ) : null}
      </div>

      {/* The one hairline this template allows itself — everywhere else,
          separation comes from whitespace and type weight, not a line. */}
      <div className="mt-10 h-px w-full bg-line-grey" aria-hidden="true" />

      <table className="mt-8 w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th
              scope="col"
              className="pb-3 text-left font-semibold text-[10px] text-ink-subtle uppercase tracking-[0.16em]"
            >
              Description
            </th>
            <th
              scope="col"
              className="w-[9%] pb-3 pl-4 text-right font-semibold text-[10px] text-ink-subtle uppercase tracking-[0.16em]"
            >
              Qty
            </th>
            <th
              scope="col"
              className="w-[18%] pb-3 pl-4 text-right font-semibold text-[10px] text-ink-subtle uppercase tracking-[0.16em]"
            >
              Rate
            </th>
            <th
              scope="col"
              className="w-[20%] pb-3 pl-4 text-right font-semibold text-[10px] text-ink-subtle uppercase tracking-[0.16em]"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id} className="align-top">
              <td className="break-words py-3 pr-4 text-ink">
                {line.isPlaceholder ? (
                  <span className="text-ink-subtle">{line.description}</span>
                ) : (
                  line.description
                )}
              </td>
              <td className="py-3 pl-4 text-right text-ink-muted tabular-nums">
                {line.quantityDisplay}
              </td>
              <td className="py-3 pl-4 text-right text-ink-muted tabular-nums">
                {line.rateDisplay}
              </td>
              <td className="py-3 pl-4 text-right text-ink tabular-nums">
                {line.amountDisplay}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 max-w-[260px]">
        <dl className="flex flex-col gap-1.5 text-[13px]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd className="text-ink tabular-nums">{totals.subtotalDisplay}</dd>
          </div>
          {totals.discountLabel !== null ? (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-muted">{totals.discountLabel}</dt>
              <dd className="text-ink tabular-nums">{totals.discountDisplay}</dd>
            </div>
          ) : null}
          <div className="flex items-baseline justify-between gap-4">
            <dt className="break-words text-ink-muted">{totals.taxLabel}</dt>
            <dd className="text-ink tabular-nums">{totals.taxDisplay}</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-4 pt-2">
            <dt className="font-semibold text-[11px] text-ink uppercase tracking-[0.16em]">
              Total
            </dt>
            <dd className="break-words font-semibold text-[22px] text-violet-700 tabular-nums">
              {totals.totalDisplay}
            </dd>
          </div>
        </dl>
      </div>

      {draft.notes.trim() !== '' ? (
        <div className="mt-10">
          <p className="font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.2em]">
            Notes &amp; payment details
          </p>
          <p className="mt-2 whitespace-pre-line break-words text-[13px] text-ink-muted leading-[1.6]">
            {draft.notes}
          </p>
        </div>
      ) : null}

      {/* mt-auto pins the footer to the bottom of the A4 sheet on screen. In
          print the aspect ratio is released, so it simply follows the
          content — which is the right behaviour there. */}
      <div className="mt-auto pt-10">
        <p className="text-[11px] text-ink-subtle">
          {draft.invoiceNumber !== '' ? `${draft.invoiceNumber} · ` : ''}
          {draft.fromName !== '' ? draft.fromName : 'Invoice'}
        </p>
      </div>
    </div>
  )
}
