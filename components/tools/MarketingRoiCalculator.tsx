'use client'

import { Minus, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { CopyButton, ResultRow } from '@/components/tools/ResultPanel'
import {
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarAction,
  ToolbarGroup,
  ToolToolbar,
  ToolWorkspace,
} from '@/components/tools/workspace'
import {
  calculateMarketingRoi,
  formatInr,
  formatMultiple,
  formatPercent,
  type MarketingRoiField,
  type MarketingRoiResult,
  type Verdict,
} from '@/lib/tools/marketing-roi-calculator/logic'

/**
 * Marketing ROI calculator — rebuilt on the shared workspace.
 * Research brief: docs/research/marketing-roi-calculator.md
 *
 * What changed, and why:
 *   - The break-even comparison is now the second thing you see, on its own
 *     bordered panel with both multiples on a shared scale. It was row four of a
 *     seven-row definition list: the tool's entire reason to exist, formatted as
 *     trivia.
 *   - Form on the left, verdict on the right, controls in one toolbar above both
 *     — instead of a ResultPanel competing with a "why margin matters" explainer
 *     for the same column.
 *   - Three example scenarios in the toolbar. Two of them share a 3× ROAS and
 *     disagree on the verdict (25% vs 80% margin), which teaches the point faster
 *     than any paragraph can.
 *   - `ResultPanel` was dropped partly because it ships its own `aria-live`; the
 *     StatusBar is the tool's one polite live region.
 *
 * All arithmetic stays in logic.ts — integer paise and basis points, rounded
 * once, with the verdict derived from the same rounded net-profit paise that are
 * displayed, so the label can never contradict the numbers beside it. This file
 * is field state, wording and markup only.
 */

type Values = Record<MarketingRoiField, string>

interface FieldSpec {
  readonly name: MarketingRoiField
  readonly label: string
  readonly unit: '₹' | '%'
  readonly hint: string
  readonly placeholder: string
  readonly optional?: boolean
}

const SPEND: FieldSpec = {
  name: 'spend',
  label: 'Campaign spend',
  unit: '₹',
  hint: 'What you paid the ad platform — Google, Meta, LinkedIn. Net of GST.',
  placeholder: '50,000',
}

const REVENUE: FieldSpec = {
  name: 'revenue',
  label: 'Attributed revenue',
  unit: '₹',
  hint: 'Revenue this campaign gets credit for, also net of GST.',
  placeholder: '1,50,000',
}

const OTHER_COSTS: FieldSpec = {
  name: 'otherCosts',
  label: 'Other campaign costs',
  unit: '₹',
  hint: 'Agency fees, tools, creative production. Blank means zero.',
  placeholder: '0',
  optional: true,
}

const MARGIN: FieldSpec = {
  name: 'marginPercent',
  label: 'Gross margin',
  unit: '%',
  hint: 'The share of revenue you keep after delivering the product or service.',
  placeholder: '25',
}

const FIELD_LABEL: Record<MarketingRoiField, string> = {
  spend: SPEND.label,
  revenue: REVENUE.label,
  marginPercent: MARGIN.label,
  otherCosts: OTHER_COSTS.label,
}

/** Answers the question that stalls this form: "what margin do I even use?" */
const MARGIN_PRESETS: readonly { readonly label: string; readonly value: string }[] = [
  { label: 'E-commerce', value: '30' },
  { label: 'Services', value: '50' },
  { label: 'Software', value: '80' },
]

interface Scenario {
  readonly id: string
  readonly label: string
  readonly title: string
  readonly values: Values
}

/**
 * The first two share a 3× ROAS and reach opposite verdicts, which is the whole
 * argument of the tool sitting in the toolbar where it can be clicked.
 */
const SCENARIOS: readonly Scenario[] = [
  {
    id: 'thin',
    label: '3× · 25% margin',
    title: 'Retail margins: 3× ROAS looks healthy and loses money',
    values: { spend: '50000', revenue: '150000', marginPercent: '25', otherCosts: '' },
  },
  {
    id: 'software',
    label: '3× · 80% margin',
    title: 'Software margins: the same 3× ROAS is comfortably profitable',
    values: {
      spend: '80000',
      revenue: '240000',
      marginPercent: '80',
      otherCosts: '20000',
    },
  },
  {
    id: 'healthy',
    label: '6× · 40% margin',
    title: 'A genuinely strong campaign, with agency fees included',
    values: {
      spend: '50000',
      revenue: '300000',
      marginPercent: '40',
      otherCosts: '10000',
    },
  },
]

/** The first-paint scenario: 3× ROAS at 25% margin, i.e. quietly losing money. */
const DEFAULTS: Values = SCENARIOS[0]?.values ?? {
  spend: '50000',
  revenue: '150000',
  marginPercent: '25',
  otherCosts: '',
}

const EMPTY: Values = { spend: '', revenue: '', marginPercent: '', otherCosts: '' }

/** "₹1,50,000", "25 %" and a stray space are paste artefacts, not errors. */
function parseField(raw: string): number {
  const cleaned = raw.replace(/[₹,%\s]/g, '')
  if (cleaned === '') return Number.NaN
  return Number(cleaned)
}

const VERDICT_STYLE: Record<
  Verdict,
  { readonly bg: string; readonly Icon: typeof Minus }
> = {
  Profitable: { bg: 'bg-mint', Icon: TrendingUp },
  'Break-even': { bg: 'bg-tile-yellow', Icon: Minus },
  'Losing money': { bg: 'bg-peach', Icon: TrendingDown },
}

/** Below this a difference in multiples renders as "0.00×", so treat it as equal. */
const MULTIPLE_EPSILON = 0.005

export function MarketingRoiCalculator() {
  const [values, setValues] = useState<Values>(DEFAULTS)

  const parsed = useMemo(() => {
    const otherRaw = values.otherCosts.trim()
    return {
      spend: parseField(values.spend),
      revenue: parseField(values.revenue),
      marginPercent: parseField(values.marginPercent),
      // A blank optional field means zero; anything typed there must parse.
      otherCosts: otherRaw === '' ? 0 : parseField(values.otherCosts),
    }
  }, [values])

  const result = useMemo(() => calculateMarketingRoi(parsed), [parsed])

  const allBlank =
    values.spend.trim() === '' &&
    values.revenue.trim() === '' &&
    values.marginPercent.trim() === '' &&
    values.otherCosts.trim() === ''

  const errorField = result.ok ? undefined : result.field
  const hasOtherCosts = Number.isFinite(parsed.otherCosts) && parsed.otherCosts > 0
  const marginLabel = Number.isFinite(parsed.marginPercent)
    ? formatPercent(parsed.marginPercent, 2)
    : 'your'

  function setField(name: MarketingRoiField, text: string): void {
    setValues((prev) => ({ ...prev, [name]: text }))
  }

  const summary = result.ok
    ? [
        `Marketing ROI — ${result.verdict}`,
        `Spend ${formatInr(parsed.spend)} · Revenue ${formatInr(parsed.revenue)} · Margin ${marginLabel} · Other costs ${formatInr(parsed.otherCosts)}`,
        `ROI on total cost: ${formatPercent(result.roiPercent)}`,
        `ROAS: ${formatMultiple(result.roas)} · Break-even ROAS: ${formatMultiple(result.breakEvenRoas)}`,
        `Gross profit: ${formatInr(result.grossProfit)} · Total cost: ${formatInr(result.totalCost)}`,
        `Net profit: ${formatInr(result.netProfit)}`,
        `Break-even revenue: ${formatInr(result.breakEvenRevenue)}`,
      ].join('\n')
    : ''

  return (
    <ToolWorkspace
      inputLabel="Campaign figures"
      outputLabel="Verdict and break-even"
      minHeight="min-h-[30rem]"
      toolbar={
        <ToolToolbar
          actions={
            <ToolbarAction onClick={() => setValues(EMPTY)} disabled={allBlank}>
              Clear
            </ToolbarAction>
          }
        >
          <ToolbarGroup label="Examples">
            {SCENARIOS.map((scenario) => (
              <SegmentButton
                key={scenario.id}
                active={sameValues(values, scenario.values)}
                onClick={() => setValues(scenario.values)}
                title={scenario.title}
              >
                {scenario.label}
              </SegmentButton>
            ))}
          </ToolbarGroup>
        </ToolToolbar>
      }
      input={
        <Pane title="Campaign figures">
          <div className="flex flex-col gap-6">
            <fieldset className="min-w-0">
              <legend className="mb-3 font-display font-semibold text-[16px] text-ink">
                What it cost, what it brought in
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  spec={SPEND}
                  value={values.spend}
                  error={errorField === 'spend' && !result.ok ? result.error : undefined}
                  onChange={(text) => setField('spend', text)}
                />
                <Field
                  spec={REVENUE}
                  value={values.revenue}
                  error={
                    errorField === 'revenue' && !result.ok ? result.error : undefined
                  }
                  onChange={(text) => setField('revenue', text)}
                />
              </div>
              <div className="mt-4">
                <Field
                  spec={OTHER_COSTS}
                  value={values.otherCosts}
                  error={
                    errorField === 'otherCosts' && !result.ok ? result.error : undefined
                  }
                  onChange={(text) => setField('otherCosts', text)}
                />
              </div>
            </fieldset>

            <fieldset className="min-w-0">
              <legend className="mb-3 font-display font-semibold text-[16px] text-ink">
                What you actually keep
              </legend>
              <Field
                spec={MARGIN}
                value={values.marginPercent}
                error={
                  errorField === 'marginPercent' && !result.ok ? result.error : undefined
                }
                onChange={(text) => setField('marginPercent', text)}
              >
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-[12px] text-ink-subtle uppercase tracking-[0.08em]">
                    Typical
                  </span>
                  {MARGIN_PRESETS.map((preset) => {
                    const active = values.marginPercent.trim() === preset.value
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setField('marginPercent', preset.value)}
                        className={`min-h-11 rounded-sm border px-3 font-medium text-[13px] transition-colors ${
                          active
                            ? 'border-ink bg-violet-700 text-white'
                            : 'border-line-grey bg-cream text-ink-muted hover:border-ink hover:text-ink'
                        }`}
                      >
                        {preset.label} {preset.value}%
                      </button>
                    )
                  })}
                </div>
              </Field>
            </fieldset>
          </div>
        </Pane>
      }
      output={
        <Pane
          title="Verdict and break-even"
          actions={result.ok ? <CopyButton text={summary} label="Copy summary" /> : null}
        >
          {allBlank ? (
            <div className="flex h-full items-center justify-center p-6">
              <p className="max-w-[38ch] text-center text-[14px] text-ink-subtle leading-6">
                Enter the spend, revenue and margin to see the verdict, the ROAS vs.
                break-even ROAS comparison, and the full working.
              </p>
            </div>
          ) : !result.ok ? (
            <div className="flex h-full items-center justify-center p-6">
              <p className="max-w-[38ch] text-center text-[14px] text-ink-subtle leading-6">
                The{' '}
                <span className="font-semibold text-ink">
                  {FIELD_LABEL[result.field]}
                </span>{' '}
                field needs attention — fix it to see the verdict and break-even
                comparison here.
              </p>
            </div>
          ) : (
            <Results
              result={result}
              revenue={parsed.revenue}
              marginLabel={marginLabel}
              hasOtherCosts={hasOtherCosts}
            />
          )}
        </Pane>
      }
      status={
        <StatusBar
          state={
            allBlank
              ? 'neutral'
              : !result.ok
                ? 'invalid'
                : result.verdict === 'Profitable'
                  ? 'valid'
                  : result.verdict === 'Break-even'
                    ? 'neutral'
                    : 'invalid'
          }
          message={
            allBlank
              ? 'Waiting for your figures'
              : !result.ok
                ? result.error
                : result.verdict === 'Profitable'
                  ? 'Profitable — gross profit covers every cost'
                  : result.verdict === 'Break-even'
                    ? 'Break-even — gross profit exactly covers cost'
                    : 'Losing money — gross profit does not cover cost'
          }
          stats={
            result.ok
              ? [
                  { label: 'ROI', value: formatPercent(result.roiPercent) },
                  { label: 'ROAS', value: formatMultiple(result.roas) },
                  {
                    label: 'break-even ROAS',
                    value: formatMultiple(result.breakEvenRoas),
                  },
                ]
              : undefined
          }
          privacyNote="Calculated in your browser — no figure is uploaded"
        />
      }
    />
  )
}

/** Narrowed to the ok branch by the caller, so every figure below exists. */
type OkResult = Extract<MarketingRoiResult, { ok: true }>

function Results({
  result,
  revenue,
  marginLabel,
  hasOtherCosts,
}: {
  result: OkResult
  revenue: number
  marginLabel: string
  hasOtherCosts: boolean
}) {
  const { bg, Icon } = VERDICT_STYLE[result.verdict]

  // Scale both bars against the larger multiple so the comparison is honest.
  const scale = Math.max(result.roas, result.breakEvenRoas, MULTIPLE_EPSILON)
  const roasWidth = barWidth(result.roas, scale)
  const targetWidth = barWidth(result.breakEvenRoas, scale)

  const gap = result.breakEvenRoas - result.roas
  const roasPhrase =
    gap > MULTIPLE_EPSILON
      ? `${formatMultiple(gap)} short of the multiple your margin needs.`
      : gap < -MULTIPLE_EPSILON
        ? `${formatMultiple(-gap)} clear of the multiple your margin needs.`
        : 'Exactly on the multiple your margin needs.'

  // Keyed off net profit, never off the ROAS gap: with other costs in play a
  // campaign can clear the break-even ROAS and still lose money, and this
  // sentence must not contradict the verdict above it.
  const revenuePhrase =
    result.netProfit < 0
      ? `Revenue of ${formatInr(result.breakEvenRevenue)} at the same ${formatInr(result.totalCost)} of cost is where ROI reaches 0%${
          Number.isFinite(revenue) && result.breakEvenRevenue > revenue
            ? ` — ${formatInr(result.breakEvenRevenue - revenue)} more than it brought in`
            : ''
        }.`
      : result.netProfit > 0
        ? `Revenue could fall to ${formatInr(result.breakEvenRevenue)} before ROI reaches 0%.`
        : 'This is the ROI-zero point exactly.'

  return (
    <div className="flex flex-col gap-5">
      {/* Colour is never the only signal: the heading names the outcome, the
          sentence restates it in full, and the icon reinforces it. */}
      <section className={`rounded-card border border-ink p-4 ${bg}`}>
        <h4 className="flex items-center gap-2 font-display font-bold text-[20px] text-ink">
          <Icon className="size-5 shrink-0" aria-hidden="true" strokeWidth={2.5} />
          {result.verdict}
        </h4>
        <p className="mt-1.5 text-[14px] text-ink leading-5">{verdictSentence(result)}</p>
        {/* flex-col-reverse keeps the figure on top visually while the markup
            stays dt-then-dd, which is the only valid order inside a <dl>. */}
        <dl className="mt-4 grid grid-cols-2 gap-4 border-ink/15 border-t pt-3">
          <div className="flex flex-col-reverse">
            <dt className="mt-1.5 text-[13px] text-ink">ROI on total cost</dt>
            <dd className="stat-figure font-bold text-[32px] text-ink leading-none">
              {formatPercent(result.roiPercent)}
            </dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className="mt-1.5 text-[13px] text-ink">Net profit</dt>
            <dd className="stat-figure font-bold text-[32px] text-ink leading-none">
              {formatInr(result.netProfit)}
            </dd>
          </div>
        </dl>
      </section>

      {/* The USP, given the space it earns: the comparison every competitor
          either buries among a dozen tiles or omits by ignoring margin. */}
      <section className="rounded-card border border-ink bg-tile-lavender p-4">
        <h4 className="font-display font-semibold text-[16px] text-ink">
          Your ROAS against break-even
        </h4>
        <p className="mt-1 text-[13px] text-ink leading-5">
          Break-even ROAS is 1 ÷ margin — the revenue multiple at which gross profit
          finally covers the ad spend.
        </p>
        <dl className="mt-3.5 flex flex-col gap-3.5">
          <BarRow
            label="Your ROAS"
            value={formatMultiple(result.roas)}
            width={roasWidth}
            tone="mine"
          />
          <BarRow
            label={`Break-even at ${marginLabel} margin`}
            value={formatMultiple(result.breakEvenRoas)}
            width={targetWidth}
            tone="target"
          />
        </dl>
        <p className="mt-3.5 border-ink/15 border-t pt-3 font-medium text-[14px] text-ink leading-5">
          {roasPhrase} {revenuePhrase}
        </p>
        {hasOtherCosts ? (
          <p className="mt-2 flex gap-1.5 text-[13px] text-ink leading-5">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              Break-even ROAS covers the ad spend only. Your other costs have to be earned
              back too, so break-even <em>revenue</em> is the figure to hit.
            </span>
          </p>
        ) : null}
      </section>

      <dl className="divide-y divide-line border-line border-t">
        <ResultRow label="ROAS · revenue ÷ spend" value={formatMultiple(result.roas)} />
        <ResultRow
          label="Break-even ROAS · 1 ÷ margin"
          value={formatMultiple(result.breakEvenRoas)}
        />
        <ResultRow
          label="Gross profit · revenue × margin"
          value={formatInr(result.grossProfit)}
        />
        <ResultRow
          label="Total cost · spend + other costs"
          value={formatInr(result.totalCost)}
        />
        <ResultRow
          label="Profit per ₹1 of cost"
          value={formatInr(result.profitPerRupee)}
        />
        <ResultRow
          label="Break-even revenue"
          value={formatInr(result.breakEvenRevenue)}
        />
      </dl>

      {/* Native <details>: keyboard-operable with no ARIA of its own, and the
          reason to trust the number rather than take it on faith. */}
      <details className="rounded-card border border-line-grey bg-offwhite p-4">
        <summary className="cursor-pointer font-display font-semibold text-[16px] text-ink">
          Show the maths
        </summary>
        <dl className="mt-3 flex flex-col gap-3 font-mono text-[13px] text-ink-muted leading-5">
          <Step term="Gross profit = revenue × margin">
            {formatInr(result.grossProfit)} at {marginLabel} margin
          </Step>
          <Step term="Total cost = spend + other costs">
            {formatInr(result.totalCost)}
          </Step>
          <Step term="Net profit = gross profit − total cost">
            {formatInr(result.grossProfit)} − {formatInr(result.totalCost)} ={' '}
            {formatInr(result.netProfit)}
          </Step>
          <Step term="ROI = net profit ÷ total cost × 100">
            {formatInr(result.netProfit)} ÷ {formatInr(result.totalCost)} ={' '}
            {formatPercent(result.roiPercent)}
          </Step>
          <Step term="ROAS = revenue ÷ spend">{formatMultiple(result.roas)}</Step>
          <Step term="Break-even ROAS = 1 ÷ margin">
            1 ÷ {marginLabel} = {formatMultiple(result.breakEvenRoas)}
          </Step>
          <Step term="Break-even revenue = total cost ÷ margin">
            {formatInr(result.totalCost)} ÷ {marginLabel} ={' '}
            {formatInr(result.breakEvenRevenue)}
          </Step>
        </dl>
        <p className="mt-3 text-[13px] text-ink-muted leading-5">
          Computed in whole paise and basis points, rounded once per figure, so net profit
          always reconciles to gross profit minus total cost — and the verdict is read off
          the same rounded profit shown above it.
        </p>
      </details>
    </div>
  )
}

function verdictSentence(result: OkResult): string {
  const gross = formatInr(result.grossProfit)
  const cost = formatInr(result.totalCost)
  if (result.verdict === 'Profitable') {
    return `Gross profit of ${gross} covers the ${cost} this campaign cost and leaves ${formatInr(result.netProfit)}.`
  }
  if (result.verdict === 'Break-even') {
    return `Gross profit of ${gross} exactly covers the ${cost} this campaign cost. No profit, no loss.`
  }
  return `Gross profit of ${gross} does not cover the ${cost} this campaign cost — a shortfall of ${formatInr(Math.abs(result.netProfit))}.`
}

/** Percentage width for a bar, keeping a non-zero value visible. */
function barWidth(value: number, scale: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.max(3, Math.min(100, (value / scale) * 100))
}

function BarRow({
  label,
  value,
  width,
  tone,
}: {
  label: string
  value: string
  width: number
  tone: 'mine' | 'target'
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <dt className="text-[13px] text-ink">{label}</dt>
        <dd className="font-display font-bold text-[19px] text-ink tabular-nums">
          {value}
        </dd>
      </div>
      {/* Decorative: the multiple beside it carries the information, so nothing
          depends on seeing the bar. */}
      <div
        aria-hidden="true"
        className="mt-1.5 h-2.5 w-full overflow-hidden rounded-pill border border-ink/20 bg-cream"
      >
        <span
          className={`block h-full rounded-pill ${tone === 'mine' ? 'bg-violet-700' : 'bg-ink'}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

function Step({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-semibold text-ink">{term}</dt>
      <dd className="tabular-nums">{children}</dd>
    </div>
  )
}

function Field({
  spec,
  value,
  error,
  onChange,
  children,
}: {
  spec: FieldSpec
  value: string
  error?: string
  onChange: (text: string) => void
  children?: ReactNode
}) {
  const id = `roi-${spec.name}`
  const hintId = `${id}-hint`
  const isPercent = spec.unit === '%'

  return (
    <div className="min-w-0">
      <label className="label" htmlFor={id}>
        {spec.label}
        {spec.optional ? (
          <span className="ml-1.5 font-normal text-[13px] text-ink-subtle">optional</span>
        ) : null}
      </label>
      <div className="relative">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 flex items-center text-[15px] text-ink-subtle ${
            isPercent ? 'right-3.5' : 'left-3.5'
          }`}
        >
          {spec.unit}
        </span>
        <input
          id={id}
          className={`field tabular-nums ${isPercent ? 'pr-8' : 'pl-8'}`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder={spec.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error !== undefined || undefined}
          aria-describedby={hintId}
        />
      </div>
      {error !== undefined ? (
        // This hint sits directly on the Campaign-figures Pane's ambient
        // bg-cream — no bg-violet-50/tile-* fill in between — so it falls
        // outside the existing dark-mode fix for violet-700-on-tile-fill
        // pairings and measures ~2.27:1 in dark mode. --color-violet-accent-text
        // is the codebase's existing token for standalone accent text/icons on
        // an ambient surface (see .eyebrow / the nav-link hover state); it is
        // dark-mode-only, so the fallback keeps light mode unchanged. The
        // TriangleAlert icon below has no color class of its own, so it
        // inherits this fix too.
        <p
          className="mt-1.5 flex gap-1.5 font-medium text-[13px] text-[var(--color-violet-accent-text,var(--color-violet-700))] leading-5"
          id={hintId}
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        <p className="hint mt-1.5" id={hintId}>
          {spec.hint}
        </p>
      )}
      {children}
    </div>
  )
}

function sameValues(a: Values, b: Values): boolean {
  return (
    a.spend.trim() === b.spend.trim() &&
    a.revenue.trim() === b.revenue.trim() &&
    a.marginPercent.trim() === b.marginPercent.trim() &&
    a.otherCosts.trim() === b.otherCosts.trim()
  )
}
