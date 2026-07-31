import { describe, expect, it } from 'vitest'
import {
  applyHarmony,
  clampToSrgbGamut,
  contrastRatio,
  createRng,
  describeHex,
  describeSlots,
  formatRatio,
  generatePalette,
  generateRamp,
  type Harmony,
  harmonySize,
  harmonySlots,
  hexToOklch,
  initialSlots,
  normalizeHex,
  normalizeHue,
  oklchToHex,
  type PaletteSlot,
  parseHex,
  randomBaseHex,
  TOKEN_FORMATS,
  toCssCustomProperties,
  toHexList,
  toJsonTokens,
  toSvgSheet,
  toTailwindTheme,
  toTokens,
  varyHex,
  wcagLevel,
  wcagVerdict,
} from './logic'

const HEXES = [
  '#000000',
  '#ffffff',
  '#7030f8',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#fac44b',
  '#808080',
  '#1ae39b',
  '#123456',
]

function channels(hex: string): [number, number, number] {
  const rgb = parseHex(hex)
  if (rgb === null) throw new Error(`unparseable hex in test fixture: ${hex}`)
  return [rgb.r, rgb.g, rgb.b]
}

describe('hexToOklch / oklchToHex round-trip', () => {
  it('round-trips within 1/255 per channel, including #000 and #fff', () => {
    for (const hex of HEXES) {
      const oklch = hexToOklch(hex)
      expect(oklch, hex).not.toBeNull()
      if (oklch === null) continue

      const [r0, g0, b0] = channels(hex)
      const [r1, g1, b1] = channels(oklchToHex(oklch))
      expect(Math.abs(r1 - r0), `${hex} red`).toBeLessThanOrEqual(1)
      expect(Math.abs(g1 - g0), `${hex} green`).toBeLessThanOrEqual(1)
      expect(Math.abs(b1 - b0), `${hex} blue`).toBeLessThanOrEqual(1)
    }
  })

  it('puts black at L=0 and white at L=1 with no chroma', () => {
    const black = hexToOklch('#000000')
    const white = hexToOklch('#ffffff')
    expect(black?.l).toBeCloseTo(0, 6)
    expect(black?.c).toBeCloseTo(0, 6)
    expect(white?.l).toBeCloseTo(1, 5)
    expect(white?.c).toBeCloseTo(0, 5)
  })

  it('uses the real OKLab transform, not an HSL stand-in', () => {
    // The tell: sRGB yellow and sRGB blue sit at HSL lightness 50% each, but
    // their OKLab lightness differs enormously. An HSL-based implementation
    // would report the same L for both.
    const yellow = hexToOklch('#ffff00')
    const blue = hexToOklch('#0000ff')
    expect(yellow?.l).toBeGreaterThan(0.9)
    expect(blue?.l).toBeLessThan(0.5)
  })

  it('reports a neutral grey as achromatic', () => {
    const grey = hexToOklch('#808080')
    expect(grey?.c).toBeLessThan(1e-6)
  })

  it('accepts shorthand and a missing hash', () => {
    expect(normalizeHex('#fff')).toBe('#ffffff')
    expect(normalizeHex('7030F8')).toBe('#7030f8')
    expect(normalizeHex('  #AbC  ')).toBe('#aabbcc')
  })
})

describe('invalid input', () => {
  it('returns null from hexToOklch rather than throwing', () => {
    for (const bad of [
      '',
      '#',
      'nope',
      '#12',
      '#12345',
      '#1234567',
      '#gggggg',
      '#7030f8ff',
    ]) {
      expect(hexToOklch(bad), bad).toBeNull()
      expect(normalizeHex(bad), bad).toBeNull()
    }
  })

  it('returns an error object from generatePalette instead of throwing', () => {
    const result = generatePalette('#zz', 'complementary')
    expect(result.error).toBeDefined()
    expect(result.swatches).toHaveLength(0)
  })

  it('returns an error object from generateRamp instead of throwing', () => {
    const result = generateRamp('half-typed')
    expect(result.error).toBeDefined()
    expect(result.swatches).toHaveLength(0)
  })

  it('has no error on a valid base', () => {
    expect(generatePalette('#7030f8', 'triadic').error).toBeUndefined()
    expect(generateRamp('#7030f8').error).toBeUndefined()
  })

  it('returns null from contrastRatio on an unparseable hex', () => {
    expect(contrastRatio('#fff', 'not-a-colour')).toBeNull()
    expect(contrastRatio('oops', '#000')).toBeNull()
  })
})

describe('out-of-gamut handling', () => {
  it('clamps absurd chroma to a valid sRGB hex rather than producing NaN', () => {
    const hex = oklchToHex({ l: 0.7, c: 0.9, h: 140 })
    expect(hex).toMatch(/^#[0-9a-f]{6}$/)
    for (const channel of channels(hex)) {
      expect(Number.isNaN(channel)).toBe(false)
      expect(channel).toBeGreaterThanOrEqual(0)
      expect(channel).toBeLessThanOrEqual(255)
    }
  })

  it('survives NaN, Infinity and negative coordinates', () => {
    const inputs = [
      { l: Number.NaN, c: 0.2, h: 100 },
      { l: 0.5, c: Number.NaN, h: 100 },
      { l: 0.5, c: 0.2, h: Number.NaN },
      { l: Number.POSITIVE_INFINITY, c: 0.2, h: 100 },
      { l: -3, c: -0.4, h: -900 },
    ]
    for (const input of inputs) {
      expect(oklchToHex(input)).toMatch(/^#[0-9a-f]{6}$/)
    }
  })

  it('reduces chroma but preserves hue and lightness when gamut-mapping', () => {
    const mapped = clampToSrgbGamut({ l: 0.6, c: 0.45, h: 250 })
    expect(mapped.c).toBeLessThan(0.45)
    expect(mapped.c).toBeGreaterThan(0)
    expect(mapped.l).toBeCloseTo(0.6, 10)
    expect(mapped.h).toBeCloseTo(250, 10)
  })

  it('leaves an in-gamut colour untouched', () => {
    const mapped = clampToSrgbGamut({ l: 0.5, c: 0.05, h: 30 })
    expect(mapped.c).toBeCloseTo(0.05, 10)
  })

  it('normalises hue into [0, 360)', () => {
    expect(normalizeHue(-30)).toBeCloseTo(330, 10)
    expect(normalizeHue(400)).toBeCloseTo(40, 10)
    expect(normalizeHue(360)).toBeCloseTo(0, 10)
  })
})

describe('harmonies rotate hue in OKLCH', () => {
  it('rotates complementary by 180 degrees', () => {
    const { swatches } = generatePalette('#7030f8', 'complementary')
    expect(swatches).toHaveLength(2)
    const [base, complement] = swatches
    expect(base).toBeDefined()
    expect(complement).toBeDefined()
    if (base === undefined || complement === undefined) return

    const delta = normalizeHue(complement.oklch.h - base.oklch.h)
    expect(delta).toBeCloseTo(180, 1)
  })

  it('rotates complementary by 180 degrees for every tested base', () => {
    for (const hex of ['#ff0000', '#1ae39b', '#fac44b', '#123456']) {
      const { swatches } = generatePalette(hex, 'complementary')
      const base = swatches[0]
      const complement = swatches[1]
      if (base === undefined || complement === undefined)
        throw new Error(`no swatches: ${hex}`)
      expect(normalizeHue(complement.oklch.h - base.oklch.h), hex).toBeCloseTo(180, 1)
    }
  })

  it('holds lightness constant across a hue rotation', () => {
    // The point of OKLCH: an equal-lightness triad really is equal-lightness.
    const { swatches } = generatePalette('#7030f8', 'triadic')
    expect(swatches).toHaveLength(3)
    const first = swatches[0]
    if (first === undefined) throw new Error('no swatches')
    for (const swatch of swatches) {
      expect(swatch.oklch.l).toBeCloseTo(first.oklch.l, 3)
    }
  })

  it('offsets analogous by -30 and +30 degrees', () => {
    const { swatches } = generatePalette('#7030f8', 'analogous')
    expect(swatches).toHaveLength(3)
    const [base, warm, cool] = swatches
    if (base === undefined || warm === undefined || cool === undefined) {
      throw new Error('no swatches')
    }
    expect(normalizeHue(warm.oklch.h - base.oklch.h)).toBeCloseTo(330, 1)
    expect(normalizeHue(cool.oklch.h - base.oklch.h)).toBeCloseTo(30, 1)
  })

  it('offsets a triad by 120 and 240 degrees', () => {
    const { swatches } = generatePalette('#7030f8', 'triadic')
    const [base, a, b] = swatches
    if (base === undefined || a === undefined || b === undefined)
      throw new Error('no swatches')
    expect(normalizeHue(a.oklch.h - base.oklch.h)).toBeCloseTo(120, 1)
    expect(normalizeHue(b.oklch.h - base.oklch.h)).toBeCloseTo(240, 1)
  })

  it('keeps the base swatch equal to the input colour', () => {
    for (const harmony of ['complementary', 'analogous', 'triadic'] as const) {
      const base = generatePalette('#7030f8', harmony).swatches[0]
      expect(base?.hex, harmony).toBe('#7030f8')
    }
  })
})

describe('monochrome and the ten-step ramp', () => {
  it('gives the monochrome harmony monotonically decreasing lightness', () => {
    const { swatches } = generatePalette('#7030f8', 'monochrome')
    expect(swatches).toHaveLength(5)
    for (let i = 1; i < swatches.length; i += 1) {
      const previous = swatches[i - 1]
      const current = swatches[i]
      if (previous === undefined || current === undefined)
        throw new Error('gap in swatches')
      expect(current.oklch.l).toBeLessThan(previous.oklch.l)
    }
  })

  it('stays monotonic even when the base is already near white or black', () => {
    for (const hex of ['#ffffff', '#000000', '#fffff0', '#010101']) {
      const { swatches } = generatePalette(hex, 'monochrome')
      for (let i = 1; i < swatches.length; i += 1) {
        const previous = swatches[i - 1]
        const current = swatches[i]
        if (previous === undefined || current === undefined)
          throw new Error('gap in swatches')
        expect(current.oklch.l, `${hex} step ${i}`).toBeLessThan(previous.oklch.l)
      }
    }
  })

  it('holds a single hue across the monochrome harmony', () => {
    const { swatches } = generatePalette('#7030f8', 'monochrome')
    const first = swatches[0]
    if (first === undefined) throw new Error('no swatches')
    for (const swatch of swatches) {
      expect(swatch.oklch.h).toBeCloseTo(first.oklch.h, 6)
    }
  })

  it('produces exactly ten ramp steps, darkening monotonically', () => {
    const { swatches } = generateRamp('#7030f8')
    expect(swatches).toHaveLength(10)
    for (let i = 1; i < swatches.length; i += 1) {
      const previous = swatches[i - 1]
      const current = swatches[i]
      if (previous === undefined || current === undefined)
        throw new Error('gap in swatches')
      expect(current.oklch.l).toBeLessThan(previous.oklch.l)
    }
  })

  it('lands the same ramp lightness for every hue — the OKLCH promise', () => {
    // Fixed perceptual lightness targets mean step 500 of a yellow ramp is as
    // light as step 500 of a blue one. HSL cannot do this.
    const yellow = generateRamp('#fac44b').swatches
    const blue = generateRamp('#0000ff').swatches
    expect(yellow).toHaveLength(10)
    expect(blue).toHaveLength(10)
    for (let i = 0; i < yellow.length; i += 1) {
      const y = yellow[i]
      const b = blue[i]
      if (y === undefined || b === undefined) throw new Error('gap in swatches')
      expect(y.oklch.l, `step ${i}`).toBeCloseTo(b.oklch.l, 6)
    }
  })

  it('names ramp steps on the familiar 50-900 scale', () => {
    expect(generateRamp('#7030f8').swatches.map((s) => s.name)).toEqual([
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
    ])
  })
})

describe('contrast reporting', () => {
  const ALL: Harmony[] = ['complementary', 'analogous', 'triadic', 'monochrome']

  it('matches the known WCAG ratios for black and white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 2)
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 2)
    // The repo's primary violet is documented at 6.06:1 on white.
    expect(contrastRatio('#7030f8', '#ffffff')).toBeCloseTo(6.06, 1)
  })

  it('reports both ratios and picks whichever text colour scores higher', () => {
    for (const harmony of ALL) {
      for (const swatch of generatePalette('#7030f8', harmony).swatches) {
        expect(swatch.contrastOnWhite).toBeGreaterThan(0)
        expect(swatch.contrastOnBlack).toBeGreaterThan(0)
        const expected =
          swatch.contrastOnBlack >= swatch.contrastOnWhite ? '#000000' : '#ffffff'
        expect(swatch.bestTextColor, swatch.hex).toBe(expected)
        expect(swatch.bestTextContrast).toBeCloseTo(
          Math.max(swatch.contrastOnWhite, swatch.contrastOnBlack),
          2,
        )
      }
    }
  })

  it('agrees with contrastRatio computed straight from the swatch hex', () => {
    for (const swatch of generateRamp('#1ae39b').swatches) {
      expect(contrastRatio(swatch.hex, '#ffffff')).toBeCloseTo(swatch.contrastOnWhite, 2)
      expect(contrastRatio(swatch.hex, '#000000')).toBeCloseTo(swatch.contrastOnBlack, 2)
    }
  })

  it('never picks a text colour below WCAG AA — the two ratios cross at 4.58:1', () => {
    for (const hex of HEXES) {
      for (const harmony of ALL) {
        for (const swatch of generatePalette(hex, harmony).swatches) {
          expect(
            swatch.bestTextContrast,
            `${hex}/${harmony}/${swatch.hex}`,
          ).toBeGreaterThanOrEqual(4.5)
        }
      }
      for (const swatch of generateRamp(hex).swatches) {
        expect(
          swatch.bestTextContrast,
          `${hex} ramp ${swatch.hex}`,
        ).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('puts black text on a near-white swatch and white text on a near-black one', () => {
    const ramp = generateRamp('#7030f8').swatches
    expect(ramp[0]?.bestTextColor).toBe('#000000')
    expect(ramp[9]?.bestTextColor).toBe('#ffffff')
  })

  it('formats a ratio for display', () => {
    expect(formatRatio(4.5)).toBe('4.50:1')
    expect(formatRatio(21)).toBe('21.00:1')
  })
})

describe('token output', () => {
  it('emits valid CSS custom properties for every swatch', () => {
    const { swatches } = generatePalette('#7030f8', 'complementary')
    const css = toCssCustomProperties(swatches)
    expect(css.startsWith(':root {')).toBe(true)
    expect(css.trimEnd().endsWith('}')).toBe(true)
    expect(css).toContain('--brand-base: #7030f8;')
    expect(css).toContain('--brand-complement:')
    expect(css).toContain('oklch(')
  })

  it('emits a Tailwind v4 @theme block', () => {
    const tailwind = toTailwindTheme(generateRamp('#7030f8').swatches)
    expect(tailwind.startsWith('@theme {')).toBe(true)
    expect(tailwind).toContain('--color-brand-500:')
    expect(tailwind).toContain('--color-brand-900:')
  })

  it('sanitises a hostile prefix into a usable custom-property name', () => {
    const swatches = generatePalette('#7030f8', 'complementary').swatches
    expect(toCssCustomProperties(swatches, 'My Brand!')).toContain('--my-brand-base:')
    expect(toCssCustomProperties(swatches, '   ')).toContain('--brand-base:')
  })

  it('never produces duplicate token names across the harmony and the ramp', () => {
    const all = [
      ...generatePalette('#7030f8', 'monochrome').swatches,
      ...generateRamp('#7030f8').swatches,
    ]
    const names = all.map((s) => s.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('emits JSON carrying the contrast figures, not just hexes', () => {
    const json = toJsonTokens(
      generatePalette('#7030f8', 'complementary').swatches,
      'Acme',
    )
    const parsed: unknown = JSON.parse(json)
    expect(parsed).toMatchObject({ name: 'acme' })

    const base = (parsed as { colors: Record<string, Record<string, unknown>> }).colors
      .base
    expect(base).toBeDefined()
    expect(base?.hex).toBe('#7030f8')
    expect(base?.safeTextColor).toBe('#ffffff')
    expect(typeof base?.safeTextContrast).toBe('number')
    expect(base?.safeTextRating).toBe('AA')
  })

  it('emits one hex per line for the hex list', () => {
    const swatches = generatePalette('#7030f8', 'triadic').swatches
    const lines = toHexList(swatches).split('\n')
    expect(lines).toHaveLength(3)
    expect(lines[0]).toBe('#7030f8')
    for (const line of lines) expect(line).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('routes every declared format through toTokens without falling through', () => {
    const swatches = generatePalette('#7030f8', 'analogous').swatches
    expect(TOKEN_FORMATS).toHaveLength(4)
    for (const format of TOKEN_FORMATS) {
      const output = toTokens(swatches, format.value, 'brand')
      expect(output.length, format.value).toBeGreaterThan(0)
      expect(output, format.value).toContain('#7030f8')
    }
  })
})

describe('svg swatch sheet', () => {
  const swatches = generateRamp('#7030f8').swatches

  it('is a single well-formed svg element sized to the swatch count', () => {
    const svg = toSvgSheet(swatches, 'brand')
    expect(svg.startsWith('<svg ')).toBe(true)
    expect(svg.trimEnd().endsWith('</svg>')).toBe(true)
    // Ten swatches at five columns = two rows.
    expect(svg).toContain('width="1000"')
    expect(svg).toContain('height="264"')
    expect(svg.match(/<rect /g)).toHaveLength(10)
  })

  it('draws each label in that swatch’s own safe text colour', () => {
    const svg = toSvgSheet(swatches)
    for (const swatch of swatches) {
      expect(svg).toContain(`fill="${swatch.hex}"`)
      expect(svg).toContain(swatch.hex.toUpperCase())
    }
    // The lightest step needs black text, the darkest white.
    expect(svg).toContain('fill="#000000"')
    expect(svg).toContain('fill="#ffffff"')
  })

  it('escapes a hostile title instead of injecting markup', () => {
    const svg = toSvgSheet(swatches, '<script>alert(1)</script>')
    expect(svg).not.toContain('<script>')
    expect(svg).toContain('&lt;script&gt;')
  })

  it('does not divide by zero on an empty palette', () => {
    const svg = toSvgSheet([], 'empty')
    expect(svg).toContain('<svg ')
    expect(svg).not.toContain('NaN')
  })
})

describe('WCAG rating', () => {
  it('applies the 2.2 thresholds at their exact boundaries', () => {
    expect(wcagLevel(21)).toBe('AAA')
    expect(wcagLevel(7)).toBe('AAA')
    expect(wcagLevel(6.99)).toBe('AA')
    expect(wcagLevel(4.5)).toBe('AA')
    expect(wcagLevel(4.49)).toBe('AA Large')
    expect(wcagLevel(3)).toBe('AA Large')
    expect(wcagLevel(2.99)).toBe('Fail')
    expect(wcagLevel(1)).toBe('Fail')
  })

  it('treats a non-finite ratio as a failure rather than a pass', () => {
    expect(wcagLevel(Number.NaN)).toBe('Fail')
    expect(wcagLevel(Number.POSITIVE_INFINITY)).toBe('Fail')
  })

  it('states the verdict in words so colour is never the only signal', () => {
    expect(wcagVerdict(8)).toBe('AAA pass')
    expect(wcagVerdict(5)).toBe('AA pass')
    expect(wcagVerdict(3.2)).toBe('AA large text only')
    expect(wcagVerdict(1.5)).toBe('fails AA')
  })

  it('rates every auto-chosen text colour as at least AA', () => {
    for (const hex of HEXES) {
      for (const swatch of generateRamp(hex).swatches) {
        expect(wcagLevel(swatch.bestTextContrast), `${hex} ${swatch.hex}`).not.toBe(
          'Fail',
        )
        expect(wcagLevel(swatch.bestTextContrast), `${hex} ${swatch.hex}`).not.toBe(
          'AA Large',
        )
      }
    }
  })
})

describe('describeHex', () => {
  it('keeps the hex byte-exact rather than round-tripping it through OKLCH', () => {
    for (const hex of HEXES) {
      expect(describeHex('x', 'X', hex)?.hex, hex).toBe(hex)
    }
  })

  it('agrees with contrastRatio on both directions', () => {
    const swatch = describeHex('base', 'Base', '#7030f8')
    expect(swatch).not.toBeNull()
    if (swatch === null) return
    expect(swatch.contrastOnWhite).toBeCloseTo(6.06, 1)
    expect(swatch.bestTextColor).toBe('#ffffff')
    expect(swatch.oklchCss.startsWith('oklch(')).toBe(true)
  })

  it('expands shorthand and returns null on rubbish', () => {
    expect(describeHex('x', 'X', 'abc')?.hex).toBe('#aabbcc')
    expect(describeHex('x', 'X', '#12345')).toBeNull()
  })
})

describe('seeded randomness', () => {
  it('is reproducible for a seed and different across seeds', () => {
    const a = createRng(7)
    const b = createRng(7)
    const c = createRng(8)
    const fromA = [a(), a(), a()]
    const fromB = [b(), b(), b()]
    expect(fromA).toEqual(fromB)
    expect([c(), c(), c()]).not.toEqual(fromA)
  })

  it('stays inside [0, 1)', () => {
    const rng = createRng(123456)
    for (let i = 0; i < 500; i += 1) {
      const value = rng()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it('survives a non-finite seed', () => {
    const rng = createRng(Number.NaN)
    expect(Number.isFinite(rng())).toBe(true)
  })

  it('generates base colours inside the usable lightness and chroma window', () => {
    const rng = createRng(2026)
    for (let i = 0; i < 200; i += 1) {
      const hex = randomBaseHex(rng)
      expect(hex).toMatch(/^#[0-9a-f]{6}$/)
      const oklch = hexToOklch(hex)
      if (oklch === null) throw new Error(`unparseable random hex: ${hex}`)
      // Generous tolerance: the 8-bit round trip moves L by a fraction of a step.
      expect(oklch.l, hex).toBeGreaterThan(0.4)
      expect(oklch.l, hex).toBeLessThan(0.79)
    }
  })

  it('produces a spread of hues rather than one colour', () => {
    const rng = createRng(99)
    const hexes = new Set(Array.from({ length: 40 }, () => randomBaseHex(rng)))
    expect(hexes.size).toBeGreaterThan(30)
  })

  it('holds hue when varying a swatch, and only moves lightness or chroma', () => {
    const rng = createRng(4242)
    const startHue = hexToOklch('#7030f8')?.h
    expect(startHue).toBeDefined()
    if (startHue === undefined) return

    for (let i = 0; i < 60; i += 1) {
      const varied = varyHex('#7030f8', rng)
      expect(varied).toMatch(/^#[0-9a-f]{6}$/)
      const oklch = hexToOklch(varied)
      if (oklch === null) throw new Error(`unparseable varied hex: ${varied}`)
      expect(Math.abs(normalizeHue(oklch.h - startHue + 180) - 180), varied).toBeLessThan(
        4,
      )
    }
  })

  it('returns an unparseable input unchanged instead of throwing', () => {
    expect(varyHex('nope', createRng(1))).toBe('nope')
  })
})

describe('slots, locking and regeneration', () => {
  it('reports one slot spec per harmony position, with unique token names', () => {
    for (const harmony of [
      'complementary',
      'analogous',
      'triadic',
      'monochrome',
    ] as const) {
      const specs = harmonySlots(harmony)
      expect(specs.length, harmony).toBe(
        generatePalette('#7030f8', harmony).swatches.length,
      )
      expect(harmonySize(harmony), harmony).toBe(specs.length)
      expect(new Set(specs.map((s) => s.name)).size, harmony).toBe(specs.length)
    }
  })

  it('seeds a palette deterministically — the same call twice is identical', () => {
    expect(initialSlots('#7030f8', 'analogous')).toEqual(
      initialSlots('#7030f8', 'analogous'),
    )
    const slots = initialSlots('#7030f8', 'triadic')
    expect(slots).toHaveLength(3)
    expect(slots[0]).toEqual({ hex: '#7030f8', locked: false })
    for (const slot of slots) expect(slot.locked).toBe(false)
  })

  it('replaces unlocked slots and preserves locked ones when the base changes', () => {
    const slots = initialSlots('#7030f8', 'triadic')
    const locked: PaletteSlot[] = slots.map((slot, i) =>
      i === 1 ? { ...slot, locked: true } : slot,
    )
    const pinned = locked[1]
    if (pinned === undefined) throw new Error('no slot to pin')

    const next = applyHarmony(locked, '#ff0000', 'triadic')
    expect(next).toHaveLength(3)
    expect(next[0]?.hex).toBe('#ff0000')
    expect(next[1]).toEqual(pinned)
    expect(next[2]?.hex).not.toBe(slots[2]?.hex)
  })

  it('resizes to the new harmony while carrying locks by position', () => {
    const start: PaletteSlot[] = [{ hex: '#123456', locked: true }]
    const mono = applyHarmony(start, '#7030f8', 'monochrome')
    expect(mono).toHaveLength(5)
    expect(mono[0]).toEqual({ hex: '#123456', locked: true })

    const back = applyHarmony(mono, '#7030f8', 'complementary')
    expect(back).toHaveLength(2)
    expect(back[0]).toEqual({ hex: '#123456', locked: true })
  })

  it('holds the visible palette still while a half-typed hex is invalid', () => {
    const slots = initialSlots('#7030f8', 'analogous')
    const next = applyHarmony(slots, '#70', 'analogous')
    expect(next).toEqual(slots)
  })

  it('still returns a full-length palette when the base is invalid and the harmony grew', () => {
    const next = applyHarmony([{ hex: '#123456', locked: false }], '#zz', 'monochrome')
    expect(next).toHaveLength(5)
    for (const slot of next) expect(slot.hex).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('leaves a fully locked palette untouched by regeneration', () => {
    const rng = createRng(5)
    const locked = initialSlots('#7030f8', 'triadic').map((slot) => ({
      ...slot,
      locked: true,
    }))
    expect(applyHarmony(locked, randomBaseHex(rng), 'triadic')).toEqual(locked)
  })

  it('describes every slot, labelling the locked ones as locked', () => {
    const slots: PaletteSlot[] = [
      { hex: '#7030f8', locked: false },
      { hex: '#123456', locked: true },
    ]
    const described = describeSlots(slots, 'complementary')
    expect(described).toHaveLength(2)
    expect(described[0]?.hex).toBe('#7030f8')
    expect(described[0]?.label).toBe('Base')
    expect(described[1]?.hex).toBe('#123456')
    expect(described[1]?.label).toContain('locked')
    // Token slugs stay positional so --brand-complement keeps its meaning.
    expect(described[1]?.name).toBe('complement')
  })

  it('never returns a short list, even from a short or dirty slot array', () => {
    const described = describeSlots(
      [{ hex: 'not-a-colour', locked: false }],
      'monochrome',
    )
    expect(described).toHaveLength(5)
    for (const swatch of described) {
      expect(swatch.hex).toMatch(/^#[0-9a-f]{6}$/)
      expect(swatch.bestTextContrast).toBeGreaterThanOrEqual(4.5)
    }
  })
})
