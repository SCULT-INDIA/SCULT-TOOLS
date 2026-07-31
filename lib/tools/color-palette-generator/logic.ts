/**
 * Colour palette generation in OKLCH.
 *
 * Purpose
 *   Turn one base colour into a harmony (complementary / analogous / triadic /
 *   monochrome) plus a ten-step tint-and-shade ramp, with a WCAG contrast check
 *   on every swatch, and emit the result as CSS custom properties or Tailwind v4
 *   theme tokens.
 *
 * Inputs   a hex colour (`#rgb` or `#rrggbb`, `#` optional, case-insensitive), a
 *          harmony name, and — for regeneration — a list of palette slots saying
 *          which positions the visitor has locked.
 * Outputs  a PaletteResult whose swatches each carry the rendered hex, the OKLCH
 *          coordinates that produced it, the contrast ratio against white and
 *          black, whichever of the two is the readable text colour, and the WCAG
 *          level that ratio earns. Exports: CSS custom properties, a Tailwind v4
 *          `@theme` block, JSON (contrast figures included) and an SVG sheet.
 * Failure  an unparseable hex returns `{ swatches: [], error }` rather than
 *          throwing, because the caller re-renders on every keystroke and a
 *          half-typed `#7f` is the normal case, not an exception. Out-of-gamut
 *          OKLCH is gamut-mapped, never allowed to reach `NaN`.
 *
 * Why OKLCH and not HSL
 *   Rotating hue in HSL changes perceived lightness wildly — HSL yellow and HSL
 *   blue at L=50% differ by roughly 4x in real relative luminance — so an HSL
 *   harmony comes out visually lumpy. OKLab is perceptually uniform, so holding
 *   L fixed across a hue rotation genuinely looks like a fixed lightness. The
 *   matrices below are Ottosson's published OKLab transforms, not an
 *   approximation.
 *
 * No React, no DOM, no I/O — pure functions, unit-tested in logic.test.ts.
 */

export interface Oklch {
  /** Perceptual lightness, 0 (black) to 1 (white). */
  readonly l: number
  /** Chroma. 0 is grey; sRGB tops out around 0.37. */
  readonly c: number
  /** Hue angle in degrees, [0, 360). */
  readonly h: number
}

export interface Rgb {
  readonly r: number
  readonly g: number
  readonly b: number
}

export type TextColor = '#000000' | '#ffffff'

export interface Swatch {
  /** Slug used to build the CSS custom-property name. Unique within a result. */
  readonly name: string
  readonly label: string
  readonly hex: string
  readonly oklch: Oklch
  /** The same colour as a CSS `oklch()` function, at full precision. */
  readonly oklchCss: string
  readonly contrastOnWhite: number
  readonly contrastOnBlack: number
  readonly bestTextColor: TextColor
  /** Contrast of `bestTextColor` on this swatch. Never below 4.58:1 — see below. */
  readonly bestTextContrast: number
}

export interface PaletteResult {
  readonly swatches: readonly Swatch[]
  readonly error?: string
}

export type Harmony = 'complementary' | 'analogous' | 'triadic' | 'monochrome'

export const HARMONIES: readonly { readonly value: Harmony; readonly label: string }[] = [
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'monochrome', label: 'Monochrome' },
]

export const INVALID_HEX_MESSAGE = 'Enter a hex colour like #7030F8.'

// ---------------------------------------------------------------- hex parsing

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

export function parseHex(input: string): Rgb | null {
  const match = HEX_RE.exec(input.trim())
  const body = match?.[1]
  if (body === undefined) return null

  const full =
    body.length === 3
      ? body
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : body

  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  }
}

/** Lowercase `#rrggbb`, or null. Expands shorthand, so `<input type="color">` can consume it. */
export function normalizeHex(input: string): string | null {
  const rgb = parseHex(input)
  return rgb === null ? null : rgbToHex(rgb)
}

function channelToHex(value: number): string {
  return clampByte(value).toString(16).padStart(2, '0')
}

export function rgbToHex(rgb: Rgb): string {
  return `#${channelToHex(rgb.r)}${channelToHex(rgb.g)}${channelToHex(rgb.b)}`
}

// -------------------------------------------------------------- sRGB <-> OKLab

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0
  return value < 0 ? 0 : value > 1 ? 1 : value
}

function clampByte(value: number): number {
  const rounded = Math.round(Number.isFinite(value) ? value : 0)
  return rounded < 0 ? 0 : rounded > 255 ? 255 : rounded
}

function finite(value: number): number {
  return Number.isFinite(value) ? value : 0
}

/** sRGB transfer function, inverted: 8-bit channel -> linear-light [0, 1]. */
function srgbToLinear(byte: number): number {
  const x = clampByte(byte) / 255
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
}

/**
 * Linear-light -> 8-bit sRGB. The clamp happens BEFORE the gamma step on
 * purpose: a negative linear value raised to 1/2.4 is NaN, which is exactly how
 * an out-of-gamut OKLCH colour turns into `#NaNNaNNaN` in a naive implementation.
 */
function linearToByte(linear: number): number {
  const x = clamp01(linear)
  const encoded = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
  return clampByte(clamp01(encoded) * 255)
}

interface Oklab {
  readonly l: number
  readonly a: number
  readonly b: number
}

function linearToOklab(lin: Rgb): Oklab {
  const long = 0.4122214708 * lin.r + 0.5363325363 * lin.g + 0.0514459929 * lin.b
  const medium = 0.2119034982 * lin.r + 0.6806995451 * lin.g + 0.1073969566 * lin.b
  const short = 0.0883024619 * lin.r + 0.2817188376 * lin.g + 0.6299787005 * lin.b

  const l_ = Math.cbrt(long)
  const m_ = Math.cbrt(medium)
  const s_ = Math.cbrt(short)

  return {
    l: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  }
}

function oklchToLinear(color: Oklch): Rgb {
  const radians = (color.h * Math.PI) / 180
  const a = color.c * Math.cos(radians)
  const b = color.c * Math.sin(radians)

  const l_ = color.l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = color.l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = color.l - 0.0894841775 * a - 1.291485548 * b

  const long = l_ ** 3
  const medium = m_ ** 3
  const short = s_ ** 3

  return {
    r: 4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    g: -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    b: -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  }
}

export function normalizeHue(degrees: number): number {
  const wrapped = finite(degrees) % 360
  return wrapped < 0 ? wrapped + 360 : wrapped
}

export function rgbToOklch(rgb: Rgb): Oklch {
  const lab = linearToOklab({
    r: srgbToLinear(rgb.r),
    g: srgbToLinear(rgb.g),
    b: srgbToLinear(rgb.b),
  })

  const chroma = Math.hypot(lab.a, lab.b)
  // Below this the hue angle is float noise from a neutral grey, not a colour.
  const hue = chroma < 1e-7 ? 0 : normalizeHue((Math.atan2(lab.b, lab.a) * 180) / Math.PI)

  return { l: lab.l, c: chroma, h: hue }
}

export function hexToOklch(hex: string): Oklch | null {
  const rgb = parseHex(hex)
  return rgb === null ? null : rgbToOklch(rgb)
}

// ------------------------------------------------------------- gamut mapping

// Tolerance for float noise only. #ff0000 lands on the gamut wall exactly, and
// must not be nudged off it, or its round-trip stops being lossless.
const GAMUT_EPSILON = 1e-6
const MAX_CHROMA = 0.5

function inSrgbGamut(lin: Rgb): boolean {
  return (
    lin.r >= -GAMUT_EPSILON &&
    lin.r <= 1 + GAMUT_EPSILON &&
    lin.g >= -GAMUT_EPSILON &&
    lin.g <= 1 + GAMUT_EPSILON &&
    lin.b >= -GAMUT_EPSILON &&
    lin.b <= 1 + GAMUT_EPSILON
  )
}

/**
 * Bring an OKLCH colour inside sRGB by reducing chroma only.
 *
 * Clipping the linear RGB channels instead would be simpler and wrong: channel
 * clipping shifts hue, so a "rotate hue by 180°" harmony would stop being 180°
 * apart for any vivid input. Holding L and H and walking chroma down keeps the
 * harmony geometry exact and only gives up saturation, which is the trade-off
 * the tool documents.
 */
export function clampToSrgbGamut(color: Oklch): Oklch {
  const l = clamp01(color.l)
  const h = normalizeHue(color.h)
  const requested = Math.min(Math.max(finite(color.c), 0), MAX_CHROMA)

  if (inSrgbGamut(oklchToLinear({ l, c: requested, h }))) return { l, c: requested, h }

  // c = 0 is a neutral grey, which is in gamut for every l in [0, 1], so the
  // search always has a valid lower bound.
  let lo = 0
  let hi = requested
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2
    if (inSrgbGamut(oklchToLinear({ l, c: mid, h }))) lo = mid
    else hi = mid
  }
  return { l, c: lo, h }
}

export function oklchToHex(color: Oklch): string {
  const lin = oklchToLinear(clampToSrgbGamut(color))
  return rgbToHex({
    r: linearToByte(lin.r),
    g: linearToByte(lin.g),
    b: linearToByte(lin.b),
  })
}

// ------------------------------------------------------------------- contrast

/** WCAG 2.x relative luminance of an 8-bit sRGB triple. */
function relativeLuminance(rgb: Rgb): number {
  return (
    0.2126 * srgbToLinear(rgb.r) +
    0.7152 * srgbToLinear(rgb.g) +
    0.0722 * srgbToLinear(rgb.b)
  )
}

function ratioFromLuminance(a: number, b: number): number {
  const lighter = Math.max(a, b)
  const darker = Math.min(a, b)
  return (lighter + 0.05) / (darker + 0.05)
}

/** WCAG contrast ratio, rounded to 2dp. Null if either hex is unparseable. */
export function contrastRatio(hexA: string, hexB: string): number | null {
  const a = parseHex(hexA)
  const b = parseHex(hexB)
  if (a === null || b === null) return null
  return round(ratioFromLuminance(relativeLuminance(a), relativeLuminance(b)), 2)
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`
}

export type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail'

/**
 * WCAG 2.2 SC 1.4.3 / 1.4.6 thresholds for TEXT on a background.
 *
 *   >= 7    AAA for normal text
 *   >= 4.5  AA  for normal text (and AAA for large text)
 *   >= 3    AA  for large text only — 18.66px bold / 24px regular and up
 *   < 3     fails for text at any size (it can still be a non-text boundary)
 */
export function wcagLevel(ratio: number): WcagLevel {
  if (!Number.isFinite(ratio)) return 'Fail'
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'Fail'
}

/**
 * The rating as words rather than a colour or a bare grade.
 *
 * The project's rule is that colour is never the only signal — and on a swatch
 * of an arbitrary generated colour that rule bites hardest, because there is no
 * brand hue available to tint a badge with. So the verdict is a phrase: "AAA
 * pass" reads the same in greyscale, in a screenshot, and to a screen reader.
 */
export function wcagVerdict(ratio: number): string {
  const level = wcagLevel(ratio)
  if (level === 'Fail') return 'fails AA'
  if (level === 'AA Large') return 'AA large text only'
  return `${level} pass`
}

// ------------------------------------------------------------------- swatches

function round(value: number, places: number): number {
  const factor = 10 ** places
  return Math.round(value * factor) / factor
}

function formatOklchCss(color: Oklch): string {
  return `oklch(${(color.l * 100).toFixed(1)}% ${color.c.toFixed(3)} ${color.h.toFixed(1)})`
}

/**
 * The reported `oklch` is the gamut-mapped request, not a re-read of the 8-bit
 * hex. That keeps `--x: oklch(...)` at full precision in the copied CSS and
 * keeps hue rotations exact, instead of leaking 8-bit quantisation error into
 * the palette geometry.
 */
function swatchFromRgb(name: string, label: string, rgb: Rgb, oklch: Oklch): Swatch {
  const luminance = relativeLuminance(rgb)
  const onWhite = ratioFromLuminance(luminance, 1)
  const onBlack = ratioFromLuminance(luminance, 0)

  // Because the two ratios cross at sqrt(1.05/0.05) = 4.58:1, whichever is
  // larger is always at least 4.58:1 — so the auto-chosen text colour clears
  // WCAG AA for normal text on every possible swatch.
  const blackWins = onBlack >= onWhite

  return {
    name,
    label,
    hex: rgbToHex(rgb),
    oklch: { l: round(oklch.l, 4), c: round(oklch.c, 4), h: round(oklch.h, 2) },
    oklchCss: formatOklchCss(oklch),
    contrastOnWhite: round(onWhite, 2),
    contrastOnBlack: round(onBlack, 2),
    bestTextColor: blackWins ? '#000000' : '#ffffff',
    bestTextContrast: round(blackWins ? onBlack : onWhite, 2),
  }
}

function buildSwatch(name: string, label: string, requested: Oklch): Swatch {
  const oklch = clampToSrgbGamut(requested)
  const lin = oklchToLinear(oklch)
  const rgb = { r: linearToByte(lin.r), g: linearToByte(lin.g), b: linearToByte(lin.b) }
  return swatchFromRgb(name, label, rgb, oklch)
}

/**
 * Describe an already-valid sRGB triple. Total, unlike `describeHex`.
 *
 * Used for colours that did not come out of a harmony — a swatch the visitor
 * locked, or one they re-rolled — so the hex is carried through byte-exact
 * rather than round-tripped through OKLCH and back. A locked #7030F8 must stay
 * #7030F8 in the copied tokens, not drift to #7030F7.
 */
export function describeRgb(name: string, label: string, rgb: Rgb): Swatch {
  return swatchFromRgb(name, label, rgb, rgbToOklch(rgb))
}

/** Describe any hex as a full Swatch — contrast figures included. Null if unparseable. */
export function describeHex(name: string, label: string, hex: string): Swatch | null {
  const rgb = parseHex(hex)
  return rgb === null ? null : describeRgb(name, label, rgb)
}

// ------------------------------------------------------------------ harmonies

interface HueStep {
  readonly name: string
  readonly label: string
  readonly offset: number
}

const HUE_STEPS: Record<Exclude<Harmony, 'monochrome'>, readonly HueStep[]> = {
  complementary: [
    { name: 'base', label: 'Base', offset: 0 },
    { name: 'complement', label: 'Complement +180°', offset: 180 },
  ],
  analogous: [
    { name: 'base', label: 'Base', offset: 0 },
    { name: 'analogous-warm', label: 'Analogous −30°', offset: -30 },
    { name: 'analogous-cool', label: 'Analogous +30°', offset: 30 },
  ],
  triadic: [
    { name: 'base', label: 'Base', offset: 0 },
    { name: 'triadic-a', label: 'Triadic +120°', offset: 120 },
    { name: 'triadic-b', label: 'Triadic +240°', offset: 240 },
  ],
}

// Lightness headroom for derived tints and shades. Pure white and pure black are
// excluded because a "tint" that is literally #ffffff carries no hue.
const LIGHT_ANCHOR = 0.97
const DARK_ANCHOR = 0.06

const MONO_STEPS: readonly {
  readonly name: string
  readonly label: string
  readonly t: number
}[] = [
  { name: 'tint-2', label: 'Tint +2', t: 0.8 },
  { name: 'tint-1', label: 'Tint +1', t: 0.4 },
  { name: 'base', label: 'Base', t: 0 },
  { name: 'shade-1', label: 'Shade −1', t: -0.4 },
  { name: 'shade-2', label: 'Shade −2', t: -0.8 },
]

/**
 * Minimum lightness headroom kept on each side of the pivot. Steps sit at 0.4
 * and 0.8 of the headroom, so this guarantees a gap of at least 0.048 between
 * consecutive steps.
 */
const MONO_MARGIN = 0.12

/**
 * Five steps of one hue, ordered light to dark.
 *
 * The pivot is the base lightness pulled inside a window that leaves MONO_MARGIN
 * of headroom in each direction. Without that clamp a pure-black base has
 * nowhere to put its shades: every step collapses onto L=0 and the "ramp" ships
 * as five identical swatches. With it the sequence is strictly decreasing by
 * construction, so nothing has to be de-duplicated afterwards. For any base
 * between L=0.18 and L=0.85 — which is most usable brand colours — the clamp is
 * a no-op and the middle swatch is exactly the input colour.
 */
function monochromeSwatches(base: Oklch): Swatch[] {
  const pivot = Math.min(
    Math.max(base.l, DARK_ANCHOR + MONO_MARGIN),
    LIGHT_ANCHOR - MONO_MARGIN,
  )

  return MONO_STEPS.map((step) => {
    const l =
      step.t >= 0
        ? pivot + (LIGHT_ANCHOR - pivot) * step.t
        : pivot + (pivot - DARK_ANCHOR) * step.t
    // Taper chroma toward the ends so tints read as tints rather than as a
    // second, differently-saturated hue.
    return buildSwatch(step.name, step.label, {
      l,
      c: base.c * (1 - 0.3 * Math.abs(step.t)),
      h: base.h,
    })
  })
}

export function generatePalette(baseHex: string, harmony: Harmony): PaletteResult {
  const base = hexToOklch(baseHex)
  if (base === null) return { swatches: [], error: INVALID_HEX_MESSAGE }

  if (harmony === 'monochrome') return { swatches: monochromeSwatches(base) }

  return {
    swatches: HUE_STEPS[harmony].map((step) =>
      buildSwatch(step.name, step.label, {
        l: base.l,
        c: base.c,
        h: normalizeHue(base.h + step.offset),
      }),
    ),
  }
}

// ------------------------------------------------------ seeded randomness

/**
 * Mulberry32 — a 32-bit seeded PRNG in five lines.
 *
 * `Math.random()` is deliberately not used anywhere in this module. The palette
 * is server-rendered, so a random first paint would differ between the server
 * HTML and the client's first render and React would report a hydration
 * mismatch. A seeded generator gives the component a way to be deterministic on
 * first paint and random only once the visitor asks for a new palette.
 *
 * Not cryptographic, and not meant to be: the requirement is a well-distributed,
 * reproducible stream, which mulberry32 passes gjrand on while costing nothing.
 */
export function createRng(seed: number): () => number {
  let state = (Number.isFinite(seed) ? Math.trunc(seed) : 1) >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function clampRange(value: number, low: number, high: number): number {
  if (!Number.isFinite(value)) return low
  return value < low ? low : value > high ? high : value
}

/**
 * Lightness and chroma windows for a randomly generated base colour.
 *
 * Deliberately narrow. A uniform pick over the whole OKLCH cube mostly returns
 * near-black, near-white and washed-out mud, which is why a naive "random
 * colour" generator feels broken. This window is the region where a colour is
 * saturated enough to read as a brand colour and light enough to carry text.
 */
const RANDOM_BASE_MIN_L = 0.42
const RANDOM_BASE_MAX_L = 0.76
const RANDOM_BASE_MIN_C = 0.07
const RANDOM_BASE_MAX_C = 0.22

export function randomBaseHex(rng: () => number): string {
  const l = RANDOM_BASE_MIN_L + rng() * (RANDOM_BASE_MAX_L - RANDOM_BASE_MIN_L)
  const c = RANDOM_BASE_MIN_C + rng() * (RANDOM_BASE_MAX_C - RANDOM_BASE_MIN_C)
  const h = rng() * 360
  return oklchToHex({ l, c, h })
}

/**
 * A different tone of the SAME hue.
 *
 * Re-rolling one swatch should not drop an unrelated colour into the middle of a
 * harmony — the slot has a job (it is the complement, or step 700), and a random
 * hue would break the relationship the visitor chose the harmony for. So hue is
 * held and only lightness and chroma move.
 */
export function varyHex(hex: string, rng: () => number): string {
  const base = hexToOklch(hex)
  if (base === null) return hex
  return oklchToHex({
    l: clampRange(base.l + (rng() - 0.5) * 0.34, 0.22, 0.92),
    c: clampRange(base.c + (rng() - 0.5) * 0.14, 0.03, MAX_CHROMA),
    h: base.h,
  })
}

// ------------------------------------------------------------- palette slots

/**
 * One position in the palette.
 *
 * `locked` is the whole lock/regenerate feature: a locked slot keeps its exact
 * hex when the base colour, the harmony or the whole palette is regenerated, and
 * an unlocked one is recomputed from the harmony. Storing the hex on the slot
 * rather than deriving everything from the base is what lets a locked swatch
 * survive a base change at all.
 */
export interface PaletteSlot {
  readonly hex: string
  readonly locked: boolean
}

export interface SlotSpec {
  /** Token slug — stable per position, so `--brand-complement` keeps its meaning. */
  readonly name: string
  readonly label: string
}

/** Used only when a slot has to exist and there is no colour for it yet. */
const FALLBACK_RGB: Rgb = { r: 128, g: 128, b: 128 }

/** The token slug and human label for each position of a harmony. */
export function harmonySlots(harmony: Harmony): readonly SlotSpec[] {
  if (harmony === 'monochrome') {
    return MONO_STEPS.map((step) => ({ name: step.name, label: step.label }))
  }
  return HUE_STEPS[harmony].map((step) => ({ name: step.name, label: step.label }))
}

export function harmonySize(harmony: Harmony): number {
  return harmonySlots(harmony).length
}

/**
 * Rebuild the slot list from `baseHex` + `harmony`, preserving locked slots.
 *
 * Always returns exactly `harmonySize(harmony)` entries, because harmonies are
 * different lengths (a complement is 2, a monochrome ramp is 5) and the caller
 * must never be handed a short array to index into. Locks carry by position, so
 * locking the base and then switching from triadic to monochrome keeps the base.
 *
 * An unparseable base is not an error here: it happens on every keystroke of
 * `#7f`. Unlocked slots then keep whatever they had, so the visible palette
 * holds still instead of flashing grey while someone types.
 */
export function applyHarmony(
  slots: readonly PaletteSlot[],
  baseHex: string,
  harmony: Harmony,
): readonly PaletteSlot[] {
  const specs = harmonySlots(harmony)
  const generated = generatePalette(baseHex, harmony).swatches
  const last = slots.at(-1)

  return specs.map((_, index) => {
    const previous = slots[index]
    if (previous?.locked === true) return previous

    const fresh = generated[index]
    if (fresh !== undefined) return { hex: fresh.hex, locked: false }

    // Invalid base: hold the previous colour, or the nearest one we have.
    const held = previous ?? last
    return { hex: held?.hex ?? rgbToHex(FALLBACK_RGB), locked: false }
  })
}

/** Seed a palette from scratch. Pure and total — safe to call at module scope. */
export function initialSlots(baseHex: string, harmony: Harmony): readonly PaletteSlot[] {
  return applyHarmony([], baseHex, harmony)
}

/**
 * Turn slots into displayable swatches, contrast figures and all.
 *
 * A locked slot is relabelled rather than keeping the harmony's label: after
 * locking, "Complement +180°" would be a claim about geometry that no longer
 * holds, and a tool whose entire pitch is measured correctness cannot ship a
 * label that is quietly wrong.
 */
export function describeSlots(
  slots: readonly PaletteSlot[],
  harmony: Harmony,
): readonly Swatch[] {
  return harmonySlots(harmony).map((spec, index) => {
    const slot = slots[index]
    if (slot === undefined) return describeRgb(spec.name, spec.label, FALLBACK_RGB)
    const label = slot.locked ? `${spec.label} · locked` : spec.label
    return (
      describeHex(spec.name, label, slot.hex) ??
      describeRgb(spec.name, label, FALLBACK_RGB)
    )
  })
}

// ----------------------------------------------------------------- 10-step ramp

const RAMP_STEPS: readonly {
  readonly name: string
  readonly lightness: number
  readonly chroma: number
}[] = [
  { name: '50', lightness: 0.97, chroma: 0.18 },
  { name: '100', lightness: 0.93, chroma: 0.32 },
  { name: '200', lightness: 0.87, chroma: 0.55 },
  { name: '300', lightness: 0.8, chroma: 0.78 },
  { name: '400', lightness: 0.72, chroma: 0.94 },
  { name: '500', lightness: 0.64, chroma: 1 },
  { name: '600', lightness: 0.56, chroma: 0.97 },
  { name: '700', lightness: 0.47, chroma: 0.88 },
  { name: '800', lightness: 0.37, chroma: 0.74 },
  { name: '900', lightness: 0.26, chroma: 0.56 },
]

/**
 * Ten tints and shades of the base hue on FIXED perceptual lightness targets,
 * so step 500 of a yellow ramp looks as light as step 500 of a blue one. That
 * cross-hue consistency is the whole reason for working in OKLCH; an HSL ramp
 * cannot offer it.
 */
export function generateRamp(baseHex: string): PaletteResult {
  const base = hexToOklch(baseHex)
  if (base === null) return { swatches: [], error: INVALID_HEX_MESSAGE }

  return {
    swatches: RAMP_STEPS.map((step) =>
      buildSwatch(step.name, `Step ${step.name}`, {
        l: step.lightness,
        c: base.c * step.chroma,
        h: base.h,
      }),
    ),
  }
}

// -------------------------------------------------------------- token output

export type TokenFormat = 'css' | 'tailwind' | 'json' | 'hex'

export const TOKEN_FORMATS: readonly {
  readonly value: TokenFormat
  readonly label: string
  readonly extension: string
  readonly mime: string
}[] = [
  { value: 'css', label: 'CSS', extension: 'css', mime: 'text/css' },
  { value: 'tailwind', label: 'Tailwind', extension: 'css', mime: 'text/css' },
  { value: 'json', label: 'JSON', extension: 'json', mime: 'application/json' },
  { value: 'hex', label: 'Hex list', extension: 'txt', mime: 'text/plain' },
]

function sanitizePrefix(prefix: string): string {
  const cleaned = prefix
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned === '' ? 'brand' : cleaned
}

export function toCssCustomProperties(
  swatches: readonly Swatch[],
  prefix = 'brand',
): string {
  const safe = sanitizePrefix(prefix)
  const lines = swatches.map(
    (s) => `  --${safe}-${s.name}: ${s.hex}; /* ${s.oklchCss} */`,
  )
  return [':root {', ...lines, '}'].join('\n')
}

/** Tailwind v4 is CSS-first: colours are declared in `@theme`, not a JS config. */
export function toTailwindTheme(swatches: readonly Swatch[], prefix = 'brand'): string {
  const safe = sanitizePrefix(prefix)
  const lines = swatches.map((s) => `  --color-${safe}-${s.name}: ${s.hex};`)
  return ['@theme {', ...lines, '}'].join('\n')
}

/**
 * Machine-readable export, contrast figures included.
 *
 * The ratios travel with the colours on purpose. Every competitor's export is
 * hex-only, so the accessibility work done in the tool is discarded the moment
 * the palette leaves it and has to be redone by hand in the design file. Here the
 * safe text colour and its measured ratio are part of the artefact.
 */
export function toJsonTokens(swatches: readonly Swatch[], prefix = 'brand'): string {
  const safe = sanitizePrefix(prefix)
  const colors: Record<string, unknown> = {}
  for (const s of swatches) {
    colors[s.name] = {
      hex: s.hex,
      oklch: s.oklchCss,
      contrastOnWhite: s.contrastOnWhite,
      contrastOnBlack: s.contrastOnBlack,
      safeTextColor: s.bestTextColor,
      safeTextContrast: s.bestTextContrast,
      safeTextRating: wcagLevel(s.bestTextContrast),
    }
  }
  return `${JSON.stringify({ name: safe, colors }, null, 2)}\n`
}

/** One hex per line — the shape you paste into a Figma or Sketch swatch import. */
export function toHexList(swatches: readonly Swatch[]): string {
  return swatches.map((s) => s.hex).join('\n')
}

export function toTokens(
  swatches: readonly Swatch[],
  format: TokenFormat,
  prefix = 'brand',
): string {
  switch (format) {
    case 'css':
      return toCssCustomProperties(swatches, prefix)
    case 'tailwind':
      return toTailwindTheme(swatches, prefix)
    case 'json':
      return toJsonTokens(swatches, prefix)
    case 'hex':
      return toHexList(swatches)
  }
}

// ------------------------------------------------------------------ svg sheet

const SVG_CELL_WIDTH = 200
const SVG_CELL_HEIGHT = 132
const SVG_COLUMNS = 5

/** Minimal XML text escaping. Hexes and slugs are already safe; a prefix is not. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * A printable swatch sheet as a standalone SVG.
 *
 * Vector rather than PNG because the point of the file is handing a palette to
 * someone else — it stays sharp in a deck, a PDF or a print, and it is plain text
 * so it diffs. Each cell carries its hex and its measured rating, and the label
 * is drawn in the swatch's own safe text colour, so the sheet demonstrates the
 * contrast claim rather than merely asserting it.
 */
export function toSvgSheet(swatches: readonly Swatch[], title = 'brand'): string {
  const rows = Math.max(1, Math.ceil(swatches.length / SVG_COLUMNS))
  const columns = Math.min(SVG_COLUMNS, Math.max(1, swatches.length))
  const width = columns * SVG_CELL_WIDTH
  const height = rows * SVG_CELL_HEIGHT

  const cells = swatches.map((s, index) => {
    const x = (index % SVG_COLUMNS) * SVG_CELL_WIDTH
    const y = Math.floor(index / SVG_COLUMNS) * SVG_CELL_HEIGHT
    return [
      `  <g transform="translate(${x} ${y})">`,
      `    <rect width="${SVG_CELL_WIDTH}" height="${SVG_CELL_HEIGHT}" fill="${s.hex}"/>`,
      `    <text x="16" y="34" font-family="monospace" font-size="13" fill="${s.bestTextColor}">${escapeXml(s.name)}</text>`,
      `    <text x="16" y="${SVG_CELL_HEIGHT - 38}" font-family="monospace" font-size="19" fill="${s.bestTextColor}">${s.hex.toUpperCase()}</text>`,
      `    <text x="16" y="${SVG_CELL_HEIGHT - 18}" font-family="monospace" font-size="11" fill="${s.bestTextColor}">${escapeXml(wcagVerdict(s.bestTextContrast))} · ${formatRatio(s.bestTextContrast)}</text>`,
      '  </g>',
    ].join('\n')
  })

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `  <title>${escapeXml(title)} palette</title>`,
    ...cells,
    '</svg>',
    '',
  ].join('\n')
}
