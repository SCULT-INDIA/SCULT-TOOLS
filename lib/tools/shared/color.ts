/**
 * Minimal sRGB hex parsing and WCAG contrast maths, shared by tools that need to
 * judge a colour pair without needing a full colour-space library.
 *
 * Purpose
 *   Several tools let the visitor choose colours and then have to answer one
 *   question honestly: *will this actually work?* For the QR generator that means
 *   "will a scanner decode this"; for anything rendering text it means "can this
 *   be read". Both reduce to a luminance contrast ratio, so the ratio lives here
 *   once.
 *
 * Why this duplicates a little of `color-palette-generator/logic.ts`
 *   That module owns the same two formulae, but they are entangled with its OKLCH
 *   conversion, gamut mapping and ramp generation. Importing one function from it
 *   risks pulling that machinery into every route that only wanted a ratio, and
 *   the plan's §5 budget is 90 KB gzipped per route. Forty lines of standard,
 *   separately-tested arithmetic is the cheaper trade. The palette tool keeps its
 *   own copy deliberately — this file does not replace it.
 *
 * Inputs   hex strings, with or without `#`, in 3- or 6-digit form.
 * Outputs  parsed channels, luminance, and ratios; `null` for unparseable input.
 * Failure  never throws. Bad input is `null`, because these run on every keystroke
 *          while a visitor is halfway through typing a hex code.
 *
 * No React, no DOM, no I/O — pure functions, unit-tested in color.test.ts.
 */

export interface Rgb {
  readonly r: number
  readonly g: number
  readonly b: number
}

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

/** Parse `#abc`, `abc`, `#aabbcc` or `aabbcc`. Null on anything else. */
export function parseHexColor(input: string): Rgb | null {
  const body = HEX_RE.exec(input.trim())?.[1]
  if (body === undefined) return null

  // Shorthand expands by doubling each digit: #abc -> #aabbcc.
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

/** Lowercase `#rrggbb`, or null. Expands shorthand so `<input type="color">` can consume it. */
export function normalizeHexColor(input: string): string | null {
  const rgb = parseHexColor(input)
  if (rgb === null) return null
  return `#${[rgb.r, rgb.g, rgb.b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

/**
 * sRGB 8-bit channel to linear light, per WCAG 2.x.
 *
 * The 0.04045 knee and 2.4 exponent are the sRGB transfer function; a plain
 * `(c/255) ** 2.2` approximation drifts by enough near black to move a ratio
 * across a pass/fail boundary, which is the one thing this must not do.
 */
function channelToLinear(channel: number): number {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG 2.x relative luminance of an 8-bit sRGB triple. */
export function relativeLuminance(rgb: Rgb): number {
  return (
    0.2126 * channelToLinear(rgb.r) +
    0.7152 * channelToLinear(rgb.g) +
    0.0722 * channelToLinear(rgb.b)
  )
}

/**
 * WCAG contrast ratio between two hex colours, rounded to 2dp.
 * Null if either side is unparseable. Order-independent by construction.
 */
export function hexContrastRatio(hexA: string, hexB: string): number | null {
  const a = parseHexColor(hexA)
  const b = parseHexColor(hexB)
  if (a === null || b === null) return null

  const lumA = relativeLuminance(a)
  const lumB = relativeLuminance(b)
  const lighter = Math.max(lumA, lumB)
  const darker = Math.min(lumA, lumB)
  const ratio = (lighter + 0.05) / (darker + 0.05)

  return Math.round(ratio * 100) / 100
}

export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`
}
