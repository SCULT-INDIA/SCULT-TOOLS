import { describe, expect, it } from 'vitest'
import {
  addDays,
  CURRENCIES,
  computeInvoice,
  daysBetween,
  dueDateFromTerms,
  formatDisplayDate,
  formatMoney,
  INVOICE_TEMPLATES,
  isCurrencyCode,
  isTemplateId,
  nextInvoiceNumber,
  parseAmountInput,
  parseInvoiceDraft,
  suggestInvoiceNumber,
  toIsoDate,
} from './logic'

const NO_ADJUSTMENTS = {
  taxPercent: 0,
  discount: 0,
  discountKind: 'percent',
} as const

describe('computeInvoice — line amounts and subtotal', () => {
  it('computes each line in integer minor units and sums them exactly', () => {
    const r = computeInvoice({
      lines: [
        { quantity: 1, rate: 45000 },
        { quantity: 5, rate: 1800 },
      ],
      ...NO_ADJUSTMENTS,
    })
    expect(r.lineAmounts.map((l) => l.amount)).toEqual([4_500_000, 900_000])
    expect(r.subtotal).toBe(5_400_000)
    expect(r.total).toBe(5_400_000)
    expect(r.error).toBeUndefined()
  })

  it('rounds per line, not on the summed product — 3 rows of 0.333 are 99 paise, not 100', () => {
    const r = computeInvoice({
      lines: [
        { quantity: 1, rate: 0.333 },
        { quantity: 1, rate: 0.333 },
        { quantity: 1, rate: 0.333 },
      ],
      ...NO_ADJUSTMENTS,
    })
    expect(r.lineAmounts.map((l) => l.amount)).toEqual([33, 33, 33])
    expect(r.subtotal).toBe(99)
  })

  it('handles a zero-line invoice as all zeros, not an error', () => {
    const r = computeInvoice({
      lines: [],
      taxPercent: 18,
      discount: 10,
      discountKind: 'percent',
    })
    expect(r.subtotal).toBe(0)
    expect(r.discountAmount).toBe(0)
    expect(r.taxAmount).toBe(0)
    expect(r.total).toBe(0)
    expect(r.lineAmounts).toEqual([])
    expect(r.error).toBeUndefined()
  })
})

describe('computeInvoice — invalid rows are surfaced per line, never thrown', () => {
  it('flags a negative quantity on its own row and excludes it from the subtotal', () => {
    const r = computeInvoice({
      lines: [
        { quantity: -1, rate: 100 },
        { quantity: 2, rate: 50 },
      ],
      ...NO_ADJUSTMENTS,
    })
    expect(r.lineAmounts[0]?.error).toMatch(/negative/i)
    expect(r.lineAmounts[0]?.amount).toBe(0)
    expect(r.lineAmounts[1]?.error).toBeUndefined()
    expect(r.subtotal).toBe(10_000)
    expect(r.error).toBeUndefined()
  })

  it('flags a non-finite rate per line without a global error', () => {
    const r = computeInvoice({
      lines: [{ quantity: 1, rate: Number.NaN }],
      ...NO_ADJUSTMENTS,
    })
    expect(r.lineAmounts[0]?.error).toMatch(/rate/i)
    expect(r.subtotal).toBe(0)
    expect(r.error).toBeUndefined()
  })

  it('refuses an absurdly large line instead of mis-rounding it', () => {
    const r = computeInvoice({
      lines: [{ quantity: 1_000_000_000, rate: 1_000_000_000 }],
      ...NO_ADJUSTMENTS,
    })
    expect(r.lineAmounts[0]?.error).toMatch(/too large/i)
    expect(r.subtotal).toBe(0)
  })
})

describe('computeInvoice — discount before tax, reconciling exactly', () => {
  it('charges tax on the discounted value, not the subtotal', () => {
    // ₹10,000 subtotal, 10% discount, 18% GST:
    // tax must be 18% of ₹9,000 (₹1,620), not 18% of ₹10,000 (₹1,800).
    const r = computeInvoice({
      lines: [{ quantity: 1, rate: 10000 }],
      taxPercent: 18,
      discount: 10,
      discountKind: 'percent',
    })
    expect(r.discountAmount).toBe(100_000)
    expect(r.taxAmount).toBe(162_000)
    expect(r.total).toBe(1_062_000)
  })

  it('reconciles subtotal − discount + tax === total exactly at odd paise', () => {
    // 3 × ₹33.33 = 9,999p; 7.5% discount = 749.925p → 750p; 18% of 9,249p =
    // 1,664.82p → 1,665p. Every figure is an integer and the columns add up.
    const r = computeInvoice({
      lines: [{ quantity: 3, rate: 33.33 }],
      taxPercent: 18,
      discount: 7.5,
      discountKind: 'percent',
    })
    expect(r.subtotal).toBe(9999)
    expect(r.discountAmount).toBe(750)
    expect(r.taxAmount).toBe(1665)
    expect(r.total).toBe(10_914)
    expect(r.subtotal - r.discountAmount + r.taxAmount).toBe(r.total)
    for (const figure of [r.subtotal, r.discountAmount, r.taxAmount, r.total]) {
      expect(Number.isInteger(figure)).toBe(true)
    }
  })

  it('converts a flat discount to minor units once', () => {
    const r = computeInvoice({
      lines: [{ quantity: 1, rate: 100 }],
      taxPercent: 0,
      discount: 12.5,
      discountKind: 'flat',
    })
    expect(r.discountAmount).toBe(1250)
    expect(r.total).toBe(8750)
  })

  it('clamps a flat discount larger than the subtotal, with a warning', () => {
    const r = computeInvoice({
      lines: [{ quantity: 1, rate: 10 }],
      taxPercent: 18,
      discount: 50,
      discountKind: 'flat',
    })
    expect(r.discountAmount).toBe(1000)
    expect(r.total).toBe(0)
    expect(r.warnings.some((w) => /capped/i.test(w))).toBe(true)
  })

  it('caps a percent discount at 100%, with a warning', () => {
    const r = computeInvoice({
      lines: [{ quantity: 1, rate: 100 }],
      taxPercent: 0,
      discount: 150,
      discountKind: 'percent',
    })
    expect(r.discountAmount).toBe(10_000)
    expect(r.total).toBe(0)
    expect(r.warnings.some((w) => /100%/.test(w))).toBe(true)
  })

  it('ignores a negative discount with a warning instead of increasing the bill', () => {
    const r = computeInvoice({
      lines: [{ quantity: 1, rate: 100 }],
      taxPercent: 0,
      discount: -20,
      discountKind: 'percent',
    })
    expect(r.discountAmount).toBe(0)
    expect(r.total).toBe(10_000)
    expect(r.warnings.some((w) => /negative discount/i.test(w))).toBe(true)
  })

  it('treats a half-typed (non-finite) tax rate as zero without complaint', () => {
    const r = computeInvoice({
      lines: [{ quantity: 1, rate: 100 }],
      taxPercent: Number.NaN,
      discount: 0,
      discountKind: 'percent',
    })
    expect(r.taxAmount).toBe(0)
    expect(r.total).toBe(10_000)
    expect(r.warnings).toEqual([])
  })
})

describe('parseAmountInput', () => {
  it('maps empty to 0, numbers through, and junk to NaN for per-row flagging', () => {
    expect(parseAmountInput('')).toBe(0)
    expect(parseAmountInput('  ')).toBe(0)
    expect(parseAmountInput('12.5')).toBe(12.5)
    expect(Number.isNaN(parseAmountInput('abc'))).toBe(true)
  })
})

describe('suggestInvoiceNumber', () => {
  it('builds INV-YYYY-NNN from the date and sequence', () => {
    expect(suggestInvoiceNumber(new Date(2026, 6, 29), 1)).toBe('INV-2026-001')
    expect(suggestInvoiceNumber(new Date(2026, 6, 29), 42)).toBe('INV-2026-042')
  })

  it('keeps growing past 999 instead of wrapping', () => {
    expect(suggestInvoiceNumber(new Date(2026, 0, 1), 1234)).toBe('INV-2026-1234')
  })

  it('restarts an invalid sequence at 1 and survives an invalid date', () => {
    expect(suggestInvoiceNumber(new Date(2026, 0, 1), 0)).toBe('INV-2026-001')
    expect(suggestInvoiceNumber(new Date(2026, 0, 1), Number.NaN)).toBe('INV-2026-001')
    expect(suggestInvoiceNumber(new Date('nonsense'), 7)).toBe('INV-007')
  })
})

describe('nextInvoiceNumber', () => {
  it('advances the last digit run and keeps its zero padding', () => {
    expect(nextInvoiceNumber('INV-2026-001')).toBe('INV-2026-002')
    expect(nextInvoiceNumber('INV-2026-009')).toBe('INV-2026-010')
    expect(nextInvoiceNumber('INV-2026-099')).toBe('INV-2026-100')
  })

  it('respects the user’s own series rather than imposing ours', () => {
    expect(nextInvoiceNumber('2026/09')).toBe('2026/10')
    expect(nextInvoiceNumber('ACME-7')).toBe('ACME-8')
    expect(nextInvoiceNumber('INV-007-A')).toBe('INV-008-A')
  })

  it('grows past its padding width instead of wrapping to zero', () => {
    expect(nextInvoiceNumber('INV-999')).toBe('INV-1000')
    expect(nextInvoiceNumber('9')).toBe('10')
  })

  it('handles an empty or digitless number without inventing a sequence', () => {
    expect(nextInvoiceNumber('')).toBe('INV-001')
    expect(nextInvoiceNumber('   ')).toBe('INV-001')
    expect(nextInvoiceNumber('DRAFT')).toBe('DRAFT-2')
  })
})

describe('dueDateFromTerms', () => {
  it('resolves Net 7 / 14 / 30 from the issue date', () => {
    expect(dueDateFromTerms('2026-07-29', 7)).toBe('2026-08-05')
    expect(dueDateFromTerms('2026-07-29', 14)).toBe('2026-08-12')
    expect(dueDateFromTerms('2026-07-29', 30)).toBe('2026-08-28')
    expect(dueDateFromTerms('2026-07-29', 0)).toBe('2026-07-29')
  })

  it('crosses month, year and leap-day boundaries correctly', () => {
    expect(dueDateFromTerms('2026-12-20', 30)).toBe('2027-01-19')
    expect(dueDateFromTerms('2028-02-28', 1)).toBe('2028-02-29')
    expect(dueDateFromTerms('2026-02-28', 1)).toBe('2026-03-01')
  })

  it('returns empty for a half-typed or impossible issue date', () => {
    expect(dueDateFromTerms('', 14)).toBe('')
    expect(dueDateFromTerms('2026-07', 14)).toBe('')
    expect(dueDateFromTerms('2026-02-31', 14)).toBe('')
    expect(dueDateFromTerms('2026-13-01', 14)).toBe('')
    expect(dueDateFromTerms('2026-07-29', Number.NaN)).toBe('')
  })
})

describe('daysBetween', () => {
  it('counts whole days forward and backward', () => {
    expect(daysBetween('2026-07-29', '2026-08-12')).toBe(14)
    expect(daysBetween('2026-07-29', '2026-07-29')).toBe(0)
    expect(daysBetween('2026-08-12', '2026-07-29')).toBe(-14)
  })

  it('returns undefined when either date is incomplete', () => {
    expect(daysBetween('2026-07-29', '')).toBeUndefined()
    expect(daysBetween('', '2026-08-12')).toBeUndefined()
    expect(daysBetween('2026-07-29', '2026-02-31')).toBeUndefined()
  })
})

describe('CURRENCIES', () => {
  it('offers only two-decimal currencies, because minor units are hardcoded as 1/100', () => {
    // JPY/KRW (0 decimals) or KWD/BHD (3) would be inflated 100x by the
    // Math.round(x * 100) conversion, so their presence would be a real bug.
    const zeroOrThreeDecimal = ['JPY', 'KRW', 'VND', 'KWD', 'BHD', 'TND', 'OMR']
    for (const c of CURRENCIES) {
      expect(zeroOrThreeDecimal).not.toContain(c.code)
      expect(isCurrencyCode(c.code)).toBe(true)
    }
    expect(CURRENCIES.length).toBeGreaterThanOrEqual(8)
    expect(isCurrencyCode('JPY')).toBe(false)
  })
})

describe('formatMoney', () => {
  it('uses Indian lakh/crore grouping for INR', () => {
    expect(formatMoney(12_345_678, 'INR')).toBe('₹1,23,456.78')
    expect(formatMoney(1_00_00_000_00, 'INR')).toBe('₹1,00,00,000.00')
  })

  it('uses thousands grouping for USD', () => {
    expect(formatMoney(123_456, 'USD')).toBe('$1,234.56')
  })

  it('formats EUR and GBP with their symbols', () => {
    expect(formatMoney(123_456, 'EUR')).toBe('€1,234.56')
    expect(formatMoney(123_456, 'GBP')).toBe('£1,234.56')
  })

  it('returns an empty string for non-finite input instead of "NaN"', () => {
    expect(formatMoney(Number.NaN, 'INR')).toBe('')
    expect(formatMoney(Number.POSITIVE_INFINITY, 'USD')).toBe('')
  })

  it('renders every offered currency with exactly two decimals', () => {
    for (const c of CURRENCIES) {
      // Guards the whole list at once: a currency whose minor unit is not 1/100
      // would come out as 123,456.00 rather than 1,234.56.
      expect(formatMoney(123_456, c.code)).toContain('1,234.56')
    }
  })
})

describe('date helpers', () => {
  it('formats an ISO date for display and rejects half-typed input', () => {
    expect(formatDisplayDate('2026-07-29')).toBe('29 Jul 2026')
    expect(formatDisplayDate('')).toBe('')
    expect(formatDisplayDate('2026-13-01')).toBe('')
    expect(formatDisplayDate('2026-07')).toBe('')
  })

  it('round-trips a local date through toIsoDate and addDays without mutation', () => {
    const base = new Date(2026, 6, 29)
    const due = addDays(base, 14)
    expect(toIsoDate(base)).toBe('2026-07-29')
    expect(toIsoDate(due)).toBe('2026-08-12')
    expect(base.getDate()).toBe(29)
    expect(toIsoDate(new Date('nonsense'))).toBe('')
  })
})

describe('parseInvoiceDraft — localStorage is untrusted input', () => {
  const validDraft = {
    fromName: 'Studio Andaz',
    fromAddress: '42 Residency Road\nBengaluru',
    fromEmail: 'billing@studioandaz.in',
    toName: 'Meridian Traders',
    toAddress: '8 FC Road\nPune',
    toEmail: 'accounts@meridian.in',
    invoiceNumber: 'INV-2026-001',
    issueDate: '2026-07-29',
    dueDate: '2026-08-12',
    currency: 'INR',
    lines: [{ id: 'line-1', description: 'Design', quantity: '1', rate: '45000' }],
    taxLabel: 'GST 18%',
    taxPercent: '18',
    discount: '0',
    discountKind: 'percent',
    notes: 'Payment due within 14 days.',
    logo: '',
    template: 'classic',
  }

  it('round-trips a valid draft', () => {
    const parsed = parseInvoiceDraft(JSON.parse(JSON.stringify(validDraft)))
    expect(parsed).toEqual(validDraft)
  })

  it('defaults a missing or unrecognised template to classic rather than rejecting the draft', () => {
    const { template, ...withoutTemplate } = validDraft
    // A draft saved before templates existed has no `template` key at all.
    expect(parseInvoiceDraft(withoutTemplate)?.template).toBe('classic')
    // A template later renamed or removed falls back the same way.
    expect(
      parseInvoiceDraft({ ...validDraft, template: 'retired-design' })?.template,
    ).toBe('classic')
    expect(parseInvoiceDraft({ ...validDraft, template: 'agency' })?.template).toBe(
      'agency',
    )
  })

  it('every template id is unique and recognised by isTemplateId', () => {
    const ids = INVOICE_TEMPLATES.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(isTemplateId(id)).toBe(true)
    expect(isTemplateId('not-a-real-template')).toBe(false)
  })

  it('rejects drafts with a wrong shape or unknown currency', () => {
    expect(parseInvoiceDraft(null)).toBeUndefined()
    expect(parseInvoiceDraft('a string')).toBeUndefined()
    expect(parseInvoiceDraft({ ...validDraft, currency: 'BTC' })).toBeUndefined()
    expect(parseInvoiceDraft({ ...validDraft, lines: 'not-an-array' })).toBeUndefined()
    expect(parseInvoiceDraft({ ...validDraft, discountKind: 'bogus' })).toBeUndefined()
  })

  it('degrades a corrupt logo to no-logo instead of discarding the draft', () => {
    const parsed = parseInvoiceDraft({ ...validDraft, logo: 'javascript:alert(1)' })
    expect(parsed).toBeDefined()
    expect(parsed?.logo).toBe('')
    const kept = parseInvoiceDraft({ ...validDraft, logo: 'data:image/png;base64,AAAA' })
    expect(kept?.logo).toBe('data:image/png;base64,AAAA')
  })

  it('assigns deterministic ids to restored lines that lost theirs', () => {
    const parsed = parseInvoiceDraft({
      ...validDraft,
      lines: [{ description: 'Design', quantity: '1', rate: '100' }],
    })
    expect(parsed?.lines[0]?.id).toBe('line-restored-0')
  })
})
