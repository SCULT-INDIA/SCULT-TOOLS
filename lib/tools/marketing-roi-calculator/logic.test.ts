import { describe, expect, it } from 'vitest'
import {
  calculateMarketingRoi,
  formatInr,
  formatMultiple,
  formatPercent,
  type MarketingRoiInputs,
} from './logic'

/** Narrows to the ok branch or fails the test with a useful message. */
function ok(inputs: MarketingRoiInputs) {
  const result = calculateMarketingRoi(inputs)
  if (!result.ok) throw new Error(`expected ok, got error: ${result.error}`)
  return result
}

describe('calculateMarketingRoi', () => {
  it('exposes the killer case: 3× ROAS at 25% margin is losing money', () => {
    const r = ok({ spend: 50000, revenue: 150000, marginPercent: 25 })
    expect(r.roas).toBe(3)
    expect(r.breakEvenRoas).toBe(4)
    expect(r.grossProfit).toBe(37500)
    expect(r.netProfit).toBe(-12500)
    expect(r.roiPercent).toBe(-25)
    expect(r.verdict).toBe('Losing money')
  })

  it('computes a profitable campaign end to end', () => {
    const r = ok({ spend: 50000, revenue: 300000, marginPercent: 40 })
    expect(r.roas).toBe(6)
    expect(r.grossProfit).toBe(120000)
    expect(r.totalCost).toBe(50000)
    expect(r.netProfit).toBe(70000)
    expect(r.roiPercent).toBe(140)
    expect(r.profitPerRupee).toBeCloseTo(1.4, 10)
    expect(r.verdict).toBe('Profitable')
  })

  it('the two toolbar examples share a 3× ROAS and reach opposite verdicts', () => {
    // The component offers "3× · 25% margin" and "3× · 80% margin" side by side
    // and claims they disagree. If that ever stops being true the UI is lying,
    // so it is asserted here rather than left to the copy.
    const thin = ok({ spend: 50000, revenue: 150000, marginPercent: 25 })
    const software = ok({
      spend: 80000,
      revenue: 240000,
      marginPercent: 80,
      otherCosts: 20000,
    })
    expect(thin.roas).toBe(3)
    expect(software.roas).toBe(3)
    expect(thin.verdict).toBe('Losing money')
    expect(software.verdict).toBe('Profitable')
    expect(software.breakEvenRoas).toBe(1.25)
    expect(software.netProfit).toBe(92000)
    expect(software.roiPercent).toBe(92)
  })

  it('reports exact break-even as Break-even with ROI 0', () => {
    const r = ok({ spend: 100, revenue: 400, marginPercent: 25 })
    expect(r.netProfit).toBe(0)
    expect(r.roiPercent).toBe(0)
    expect(r.verdict).toBe('Break-even')
  })

  it('computes break-even revenue as totalCost ÷ margin', () => {
    const r = ok({ spend: 50000, revenue: 150000, marginPercent: 25 })
    expect(r.breakEvenRevenue).toBe(200000)
  })

  it('plugging the break-even revenue back in yields ROI 0 and Break-even', () => {
    const base = ok({ spend: 40000, revenue: 90000, marginPercent: 30, otherCosts: 5000 })
    const again = ok({
      spend: 40000,
      revenue: base.breakEvenRevenue,
      marginPercent: 30,
      otherCosts: 5000,
    })
    expect(again.netProfit).toBe(0)
    expect(again.roiPercent).toBe(0)
    expect(again.verdict).toBe('Break-even')
  })

  it('handles the 100% margin edge: break-even ROAS is exactly 1', () => {
    const r = ok({ spend: 10000, revenue: 25000, marginPercent: 100 })
    expect(r.breakEvenRoas).toBe(1)
    expect(r.grossProfit).toBe(25000)
    expect(r.netProfit).toBe(15000)
    expect(r.breakEvenRevenue).toBe(10000)
    expect(r.verdict).toBe('Profitable')
  })

  it('treats omitted otherCosts exactly like an explicit 0', () => {
    const omitted = ok({ spend: 20000, revenue: 80000, marginPercent: 35 })
    const explicit = ok({
      spend: 20000,
      revenue: 80000,
      marginPercent: 35,
      otherCosts: 0,
    })
    expect(omitted).toEqual(explicit)
  })

  it('includes otherCosts in ROI and net profit but not in ROAS', () => {
    const r = ok({ spend: 50000, revenue: 300000, marginPercent: 40, otherCosts: 10000 })
    expect(r.roas).toBe(6) // revenue ÷ spend, other costs excluded
    expect(r.totalCost).toBe(60000)
    expect(r.netProfit).toBe(60000) // 120000 gross − 60000 total cost
    expect(r.roiPercent).toBe(100)
    expect(r.profitPerRupee).toBeCloseTo(1, 10)
  })

  it('reconciles exactly: netProfit = grossProfit − totalCost on messy decimals', () => {
    const r = ok({ spend: 33.33, revenue: 100.1, marginPercent: 33.3, otherCosts: 1.115 })
    expect(r.netProfit).toBeCloseTo(r.grossProfit - r.totalCost, 10)
    // Every money figure is a whole number of paise.
    for (const v of [r.grossProfit, r.totalCost, r.netProfit, r.breakEvenRevenue]) {
      expect(Math.round(v * 100)).toBeCloseTo(v * 100, 6)
    }
  })

  it('rejects margin ≤ 0 and > 100 with field-specific errors', () => {
    for (const marginPercent of [0, -5, 100.5, 200]) {
      const r = calculateMarketingRoi({ spend: 1000, revenue: 5000, marginPercent })
      expect(r.ok).toBe(false)
      if (!r.ok) expect(r.field).toBe('marginPercent')
    }
  })

  it('rejects spend ≤ 0', () => {
    for (const spend of [0, -1, -50000]) {
      const r = calculateMarketingRoi({ spend, revenue: 5000, marginPercent: 40 })
      expect(r.ok).toBe(false)
      if (!r.ok) expect(r.field).toBe('spend')
    }
  })

  it('rejects non-finite input on every field, never throwing', () => {
    const bad = [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
    for (const value of bad) {
      expect(
        calculateMarketingRoi({ spend: value, revenue: 1, marginPercent: 50 }).ok,
      ).toBe(false)
      expect(
        calculateMarketingRoi({ spend: 1, revenue: value, marginPercent: 50 }).ok,
      ).toBe(false)
      expect(
        calculateMarketingRoi({ spend: 1, revenue: 1, marginPercent: value }).ok,
      ).toBe(false)
      expect(
        calculateMarketingRoi({
          spend: 1,
          revenue: 1,
          marginPercent: 50,
          otherCosts: value,
        }).ok,
      ).toBe(false)
    }
  })

  it('rejects negative revenue, negative otherCosts and absurd magnitudes', () => {
    expect(calculateMarketingRoi({ spend: 1, revenue: -1, marginPercent: 50 }).ok).toBe(
      false,
    )
    expect(
      calculateMarketingRoi({ spend: 1, revenue: 1, marginPercent: 50, otherCosts: -1 })
        .ok,
    ).toBe(false)
    const huge = calculateMarketingRoi({ spend: 2e12, revenue: 1, marginPercent: 50 })
    expect(huge.ok).toBe(false)
    if (!huge.ok) expect(huge.error).toContain('lakh crore')
  })

  it('keeps verdict, net profit sign and ROI sign consistent across a grid', () => {
    for (const spend of [500, 12000, 87654.32]) {
      for (const revenue of [0, 900, 48000, 350000.5]) {
        for (const marginPercent of [10, 25, 33.3, 60, 100]) {
          for (const otherCosts of [0, 750.25, 15000]) {
            const r = ok({ spend, revenue, marginPercent, otherCosts })
            expect(r.verdict === 'Profitable').toBe(r.netProfit > 0)
            expect(r.verdict === 'Break-even').toBe(r.netProfit === 0)
            expect(r.verdict === 'Losing money').toBe(r.netProfit < 0)
            expect(Math.sign(r.roiPercent)).toBe(Math.sign(r.netProfit))
            expect(Math.sign(r.profitPerRupee)).toBe(Math.sign(r.netProfit))
          }
        }
      }
    }
  })

  it('handles zero revenue: ROAS 0, ROI −100%', () => {
    const r = ok({ spend: 10000, revenue: 0, marginPercent: 40 })
    expect(r.roas).toBe(0)
    expect(r.roiPercent).toBe(-100)
    expect(r.netProfit).toBe(-10000)
    expect(r.verdict).toBe('Losing money')
  })
})

describe('formatters', () => {
  it('formatInr uses Indian digit grouping and drops empty paise', () => {
    expect(formatInr(150000)).toBe('₹1,50,000')
    expect(formatInr(-12500)).toBe('-₹12,500')
    expect(formatInr(1234567.5)).toBe('₹12,34,567.5')
  })

  it('formatPercent and formatMultiple format en-IN with fixed precision', () => {
    expect(formatPercent(-25)).toBe('-25%')
    expect(formatPercent(87.56, 1)).toBe('87.6%')
    expect(formatPercent(140, 0)).toBe('140%')
    expect(formatMultiple(3)).toBe('3.00×')
    expect(formatMultiple(4.256)).toBe('4.26×')
  })
})
