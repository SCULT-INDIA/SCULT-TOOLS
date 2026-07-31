/**
 * Marketing ROI / ROAS calculation.
 *
 * Purpose
 *   Compute campaign ROI and ROAS side by side, with gross margin and hidden
 *   campaign costs in the arithmetic, so a "good" ROAS that actually loses
 *   money is exposed rather than celebrated.
 *
 * Inputs   spend (₹), attributed revenue (₹), gross margin (%), optional other
 *          campaign costs (₹). All plain numbers as parsed from form fields.
 * Outputs  a MarketingRoiResult union: either `ok: true` with every derived
 *          figure, or `ok: false` with a specific error message and the field
 *          it concerns — never a throw, because the caller re-renders on every
 *          keystroke and half-typed input is the normal case.
 * Failure  non-finite input, spend ≤ 0, margin ≤ 0 or > 100, negative revenue
 *          or costs, and absurd magnitudes all return `ok: false`.
 *
 * Precision
 *   Money is converted to integer paise and margin to integer basis points up
 *   front; each derived figure is rounded exactly once. The verdict is derived
 *   from the same rounded net-profit paise that are displayed, so the verdict
 *   can never disagree with the numbers beside it.
 *
 * No React, no I/O — pure functions, unit-tested in logic.test.ts.
 */

export interface MarketingRoiInputs {
  /** Campaign ad spend in rupees. Must be > 0. */
  readonly spend: number
  /** Revenue attributed to the campaign, in rupees. Must be ≥ 0. */
  readonly revenue: number
  /** Gross margin as a percentage of revenue, 0 < margin ≤ 100. */
  readonly marginPercent: number
  /** Tools, agency and creative costs in rupees. Defaults to 0. */
  readonly otherCosts?: number
}

/** Which input an error message concerns, so the UI can place it adjacent. */
export type MarketingRoiField = 'spend' | 'revenue' | 'marginPercent' | 'otherCosts'

export type Verdict = 'Profitable' | 'Break-even' | 'Losing money'

export type MarketingRoiResult =
  | {
      readonly ok: false
      readonly error: string
      readonly field: MarketingRoiField
    }
  | {
      readonly ok: true
      /** (revenue × margin − spend − otherCosts) ÷ (spend + otherCosts) × 100. */
      readonly roiPercent: number
      /** revenue ÷ spend. */
      readonly roas: number
      /** 1 ÷ margin — the ROAS at which gross profit exactly covers spend. */
      readonly breakEvenRoas: number
      /** revenue × margin, in rupees. */
      readonly grossProfit: number
      /** spend + otherCosts, in rupees. */
      readonly totalCost: number
      /** grossProfit − totalCost, in rupees. Reconciles exactly. */
      readonly netProfit: number
      /** Rupees of net profit per rupee of total cost (= ROI ÷ 100). */
      readonly profitPerRupee: number
      /** Revenue needed at the current costs and margin to reach ROI 0. */
      readonly breakEvenRevenue: number
      /** Derived from the rounded net-profit paise, never recomputed. */
      readonly verdict: Verdict
    }

/** ₹1 lakh crore. Anything above this is a typo, not a campaign. */
const MAX_RUPEES = 1_000_000_000_000

function invalid(field: MarketingRoiField, error: string): MarketingRoiResult {
  return { ok: false, field, error }
}

/**
 * Calculates every derived figure from the four inputs.
 *
 * The distinction the tool exists to teach: ROAS treats every revenue rupee as
 * a rupee kept, ROI keeps only the margin. At a 25% margin, break-even ROAS is
 * 1 ÷ 0.25 = 4×, so a campaign returning 3× revenue is losing money even
 * though its ROAS looks healthy.
 */
export function calculateMarketingRoi(inputs: MarketingRoiInputs): MarketingRoiResult {
  const { spend, revenue, marginPercent } = inputs
  const otherCosts = inputs.otherCosts ?? 0

  if (!Number.isFinite(spend)) {
    return invalid('spend', 'Enter the campaign spend as a number.')
  }
  if (!Number.isFinite(revenue)) {
    return invalid('revenue', 'Enter the attributed revenue as a number.')
  }
  if (!Number.isFinite(marginPercent)) {
    return invalid('marginPercent', 'Enter the gross margin as a percentage.')
  }
  if (!Number.isFinite(otherCosts)) {
    return invalid('otherCosts', 'Enter other campaign costs as a number.')
  }
  if (spend <= 0) {
    return invalid(
      'spend',
      'Spend must be greater than zero — ROI needs a cost to divide by.',
    )
  }
  if (revenue < 0) {
    return invalid('revenue', 'Revenue cannot be negative.')
  }
  if (otherCosts < 0) {
    return invalid('otherCosts', 'Other costs cannot be negative.')
  }
  if (marginPercent <= 0) {
    return invalid(
      'marginPercent',
      'Gross margin must be above 0% — at 0% margin no revenue is kept, so ROI is undefined.',
    )
  }
  if (marginPercent > 100) {
    return invalid('marginPercent', 'Gross margin cannot exceed 100% of revenue.')
  }
  if (spend > MAX_RUPEES || revenue > MAX_RUPEES || otherCosts > MAX_RUPEES) {
    const field: MarketingRoiField =
      spend > MAX_RUPEES ? 'spend' : revenue > MAX_RUPEES ? 'revenue' : 'otherCosts'
    return invalid(field, 'That figure is over ₹1 lakh crore — check for a typo.')
  }

  // Integer minor units: paise for money, basis points for the margin. Every
  // derived figure below is rounded exactly once, at its own assignment.
  const spendP = Math.round(spend * 100)
  const revenueP = Math.round(revenue * 100)
  const otherP = Math.round(otherCosts * 100)
  const marginBp = Math.round(marginPercent * 100)

  if (spendP === 0) {
    return invalid('spend', 'Spend must be at least one paisa.')
  }
  if (marginBp === 0) {
    return invalid(
      'marginPercent',
      'Gross margin is too small to compute with — use at least 0.01%.',
    )
  }

  const totalCostP = spendP + otherP
  const grossProfitP = Math.round((revenueP * marginBp) / 10000)
  const netProfitP = grossProfitP - totalCostP
  const breakEvenRevenueP = Math.round((totalCostP * 10000) / marginBp)

  const verdict: Verdict =
    netProfitP > 0 ? 'Profitable' : netProfitP === 0 ? 'Break-even' : 'Losing money'

  return {
    ok: true,
    roiPercent: (netProfitP / totalCostP) * 100,
    roas: revenueP / spendP,
    breakEvenRoas: 10000 / marginBp,
    grossProfit: grossProfitP / 100,
    totalCost: totalCostP / 100,
    netProfit: netProfitP / 100,
    profitPerRupee: netProfitP / totalCostP,
    breakEvenRevenue: breakEvenRevenueP / 100,
    verdict,
  }
}

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/**
 * Formats rupees with Indian digit grouping: 150000 → "₹1,50,000".
 * Paise show only when present, so whole-rupee figures stay clean.
 */
export function formatInr(value: number): string {
  return INR.format(value)
}

const percentFormatters = new Map<number, Intl.NumberFormat>()

/**
 * Formats a percentage with Indian digit grouping and at most `digits`
 * decimals: formatPercent(-25) → "-25%", formatPercent(87.5, 1) → "87.5%".
 */
export function formatPercent(value: number, digits = 1): string {
  let formatter = percentFormatters.get(digits)
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    })
    percentFormatters.set(digits, formatter)
  }
  return `${formatter.format(value)}%`
}

const MULTIPLE = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Formats a ROAS-style multiple: 3 → "3.00×". */
export function formatMultiple(value: number): string {
  return `${MULTIPLE.format(value)}×`
}
