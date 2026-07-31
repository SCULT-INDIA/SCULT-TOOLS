import { describe, expect, it } from 'vitest'
import {
  formatContrastRatio,
  hexContrastRatio,
  normalizeHexColor,
  parseHexColor,
  relativeLuminance,
} from './color'

describe('parseHexColor', () => {
  it('parses 6-digit hex with and without the hash', () => {
    expect(parseHexColor('#7030f8')).toEqual({ r: 0x70, g: 0x30, b: 0xf8 })
    expect(parseHexColor('7030f8')).toEqual({ r: 0x70, g: 0x30, b: 0xf8 })
  })

  it('is case-insensitive', () => {
    expect(parseHexColor('#7030F8')).toEqual(parseHexColor('#7030f8'))
  })

  it('expands 3-digit shorthand by doubling each digit', () => {
    expect(parseHexColor('#abc')).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc })
    expect(parseHexColor('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(parseHexColor('#000')).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('tolerates surrounding whitespace', () => {
    expect(parseHexColor('  #fff  ')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('returns null rather than throwing on junk', () => {
    // Runs on every keystroke, so half-typed input is the normal case.
    for (const bad of [
      '',
      '#',
      '#ab',
      '#abcd',
      '#abcde',
      'ggg',
      '#12345g',
      'rgb(0,0,0)',
    ]) {
      expect(parseHexColor(bad)).toBeNull()
    }
  })
})

describe('normalizeHexColor', () => {
  it('expands shorthand to the form <input type="color"> requires', () => {
    expect(normalizeHexColor('#abc')).toBe('#aabbcc')
  })

  it('lowercases and adds the missing hash', () => {
    expect(normalizeHexColor('7030F8')).toBe('#7030f8')
  })

  it('pads single-digit channels', () => {
    expect(normalizeHexColor('#010203')).toBe('#010203')
  })

  it('returns null for unparseable input', () => {
    expect(normalizeHexColor('nope')).toBeNull()
  })
})

describe('relativeLuminance', () => {
  it('anchors at 0 for black and 1 for white', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 6)
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 6)
  })

  it('weights green above red above blue', () => {
    const red = relativeLuminance({ r: 255, g: 0, b: 0 })
    const green = relativeLuminance({ r: 0, g: 255, b: 0 })
    const blue = relativeLuminance({ r: 0, g: 0, b: 255 })
    expect(green).toBeGreaterThan(red)
    expect(red).toBeGreaterThan(blue)
  })
})

describe('hexContrastRatio', () => {
  it('gives 21:1 for black on white', () => {
    expect(hexContrastRatio('#000000', '#ffffff')).toBe(21)
  })

  it('gives 1:1 for a colour against itself', () => {
    expect(hexContrastRatio('#7030f8', '#7030f8')).toBe(1)
  })

  it('is order-independent', () => {
    expect(hexContrastRatio('#7030f8', '#ffffff')).toBe(
      hexContrastRatio('#ffffff', '#7030f8'),
    )
  })

  /**
   * These are the figures recorded in app/globals.css, which were computed
   * independently of this file. Agreeing with them is the real check that the
   * transfer function is right — an approximated curve drifts here first.
   */
  it('reproduces the measured figures the design tokens were chosen from', () => {
    expect(hexContrastRatio('#7030f8', '#ffffff')).toBeCloseTo(6.06, 1)
    expect(hexContrastRatio('#4b20de', '#ffffff')).toBeCloseTo(8.2, 1)
    expect(hexContrastRatio('#16018e', '#ffffff')).toBeCloseTo(14.7, 1)
    expect(hexContrastRatio('#6b7280', '#ffffff')).toBeCloseTo(4.83, 1)
  })

  it('confirms the documented failures the token comments warn about', () => {
    // White on the CTA yellow, and white on mint — both called out as failing.
    expect(hexContrastRatio('#ffffff', '#fac44b')).toBeCloseTo(1.61, 1)
    expect(hexContrastRatio('#ffffff', '#1ae39b')).toBeCloseTo(1.68, 1)
    // ink-subtle on ice: 4.32:1, below the 4.5 threshold.
    expect(hexContrastRatio('#6b7280', '#dff6ff')).toBeLessThan(4.5)
  })

  it('accepts shorthand on either side', () => {
    expect(hexContrastRatio('#000', '#fff')).toBe(21)
  })

  it('returns null when either side is unparseable', () => {
    expect(hexContrastRatio('#000', 'nope')).toBeNull()
    expect(hexContrastRatio('nope', '#fff')).toBeNull()
    expect(hexContrastRatio('', '')).toBeNull()
  })
})

describe('formatContrastRatio', () => {
  it('renders two decimal places with the :1 suffix', () => {
    expect(formatContrastRatio(21)).toBe('21.00:1')
    expect(formatContrastRatio(4.5)).toBe('4.50:1')
    expect(formatContrastRatio(6.06)).toBe('6.06:1')
    expect(formatContrastRatio(1)).toBe('1.00:1')
  })

  /**
   * Everything reaching this function has already been rounded to 2dp by
   * `hexContrastRatio`, so a third decimal never occurs in practice. Asserted
   * anyway to pin the behaviour down: `toFixed` rounds the binary double, not the
   * decimal literal, and 6.055 is stored a hair below its decimal value — so it
   * rounds *down*, not half-up. Worth recording so nobody later "fixes" a
   * rounding bug that is really an IEEE-754 fact.
   */
  it('rounds the stored double, not the decimal literal', () => {
    expect(formatContrastRatio(6.055)).toBe('6.05:1')
  })
})
