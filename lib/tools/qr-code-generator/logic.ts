/**
 * QR code payload construction.
 *
 * Purpose
 *   Turn the fields of one of four modes — a link, free text, a WiFi network or a
 *   UPI payment request — into the exact string that gets encoded into the QR
 *   matrix. The matrix itself is drawn by the `qrcode` package in the component;
 *   everything that decides *what* goes into it lives here, so the format specs
 *   (WiFi escaping, the NPCI deep link, capacity limits) are unit-testable
 *   without a browser or a canvas.
 *
 * Inputs   a mode plus that mode's free-text fields. Every field is optional
 *          because the caller re-renders on every keystroke.
 * Outputs  a QrPayloadResult: the payload string, non-fatal `warnings` worth
 *          surfacing, and `error` when the fields cannot produce a scannable code.
 * Failure  unusable input — a malformed URL, a VPA that is not `user@handle`, an
 *          SSID over 32 bytes, a payload past QR's byte ceiling — comes back as
 *          `error` rather than an exception, because half-typed input is the
 *          normal case here, not an exception.
 *
 * No React, no DOM, no I/O — pure functions, unit-tested in logic.test.ts.
 */

import {
  hexContrastRatio,
  parseHexColor,
  relativeLuminance,
} from '@/lib/tools/shared/color'

export type QrMode = 'url' | 'text' | 'wifi' | 'upi'

/** `nopass` is the open-network sentinel from the WIFI: URI scheme, not a typo. */
export type WifiSecurity = 'WPA' | 'WEP' | 'nopass'

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export const ERROR_CORRECTION_LEVELS = ['L', 'M', 'Q', 'H'] as const

export const QR_SIZES = [256, 512, 1024, 2048] as const
export type QrSize = (typeof QR_SIZES)[number]

/**
 * Byte-mode capacity of a version-40 (177x177) symbol at each error-correction
 * level. Higher correction spends modules on recovery data, so H holds barely
 * more than a third of what L holds — which is why a long URL that fits at M can
 * fail outright at H.
 */
export const QR_BYTE_CAPACITY: Record<ErrorCorrectionLevel, number> = {
  L: 2953,
  M: 2331,
  Q: 1663,
  H: 1273,
}

/**
 * Past this the symbol needs a version dense enough that print size starts to
 * matter. Not a hard limit — a warning, because it is a physical constraint the
 * generator cannot see.
 */
export const QR_DENSITY_WARN_BYTES = 300

export const MAX_URL_LENGTH = 2048
export const MAX_TEXT_LENGTH = 2000
/** IEEE 802.11 caps an SSID at 32 octets — not 32 characters. */
export const MAX_SSID_BYTES = 32
/** NPCI caps the payee-name field of a UPI deep link at 99 characters. */
export const MAX_PAYEE_NAME_LENGTH = 99
/** Above this a single UPI collect request is refused by most apps. */
export const UPI_AMOUNT_WARN = 100000
export const UPI_AMOUNT_MAX = 10000000

export interface QrPayloadInput {
  readonly mode: QrMode
  readonly url?: string
  readonly text?: string
  readonly ssid?: string
  readonly password?: string
  readonly security?: WifiSecurity
  readonly hidden?: boolean
  readonly vpa?: string
  readonly payeeName?: string
  /** Free text so '1,200' and '' are both handled; '' omits the am parameter. */
  readonly amount?: string
}

export interface QrPayloadResult {
  /** The string to encode, or '' when `error` is set. */
  readonly payload: string
  readonly warnings: readonly string[]
  readonly error?: string
}

function ok(payload: string, warnings: readonly string[] = []): QrPayloadResult {
  return { payload, warnings }
}

function fail(error: string): QrPayloadResult {
  return { payload: '', warnings: [], error }
}

/**
 * UTF-8 byte length, computed rather than measured with TextEncoder so this file
 * stays free of any host global.
 *
 * Bytes are the unit that matters: QR byte mode counts octets, so a 40-character
 * string of Devanagari is 120 bytes and can overflow a symbol that a
 * 40-character ASCII string fits into with room to spare. `for...of` iterates by
 * code point, so an astral-plane emoji is counted once as 4 bytes rather than
 * twice as 3.
 */
export function utf8ByteLength(value: string): number {
  let bytes = 0
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0
    if (code < 0x80) bytes += 1
    else if (code < 0x800) bytes += 2
    else if (code < 0x10000) bytes += 3
    else bytes += 4
  }
  return bytes
}

export function capacityFor(level: ErrorCorrectionLevel): number {
  return QR_BYTE_CAPACITY[level]
}

/** True when the payload cannot be encoded at all at this correction level. */
export function exceedsCapacity(payload: string, level: ErrorCorrectionLevel): boolean {
  return utf8ByteLength(payload) > capacityFor(level)
}

export function qrFileName(mode: QrMode, extension: 'png' | 'svg'): string {
  return `qr-code-${mode}.${extension}`
}

/* -------------------------------------------------------------------------- */
/* URL                                                                        */
/* -------------------------------------------------------------------------- */

const HAS_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/

function buildUrlPayload(raw: string): QrPayloadResult {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return fail('Enter the URL the code should open.')
  }
  if (trimmed.length > MAX_URL_LENGTH) {
    return fail(
      `That URL is over ${MAX_URL_LENGTH} characters — check you pasted a URL and not a page.`,
    )
  }

  const hasScheme = HAS_SCHEME.test(trimmed)
  // `//example.com/x` is protocol-relative: it already has the authority
  // delimiter, so it needs a scheme and nothing else.
  const candidate = hasScheme
    ? trimmed
    : trimmed.startsWith('//')
      ? `https:${trimmed}`
      : `https://${trimmed}`

  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return fail('That does not look like a valid URL.')
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return fail('Only http and https links can be encoded here — use Text mode instead.')
  }
  if (parsed.hostname === '') {
    return fail('That URL has no domain in it.')
  }

  const warnings: string[] = []
  if (!hasScheme) {
    warnings.push(
      'Added https:// for you — without a scheme most phone cameras treat the code as plain text, not a link.',
    )
  }
  if (parsed.protocol === 'http:') {
    warnings.push('This is a plain http:// link. Use https:// if the site supports it.')
  }
  // A dotless host resolves only inside a network that defines it, so a code
  // handed to a visitor's phone would open nothing.
  if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
    warnings.push(
      `“${parsed.hostname}” has no dot in it — a phone outside your own network will not resolve that name.`,
    )
  }

  // The candidate, not parsed.toString(): the URL parser would append a trailing
  // slash and re-encode the path, which changes what the user typed and adds
  // bytes to a payload where every byte can cost a version.
  return ok(candidate, warnings)
}

/* -------------------------------------------------------------------------- */
/* TEXT                                                                       */
/* -------------------------------------------------------------------------- */

function buildTextPayload(raw: string): QrPayloadResult {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return fail('Enter the text the code should carry.')
  }
  if (trimmed.length > MAX_TEXT_LENGTH) {
    return fail(
      `Keep the text under ${MAX_TEXT_LENGTH} characters so the code stays scannable.`,
    )
  }
  return ok(trimmed)
}

/* -------------------------------------------------------------------------- */
/* WIFI                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The five characters that are structural in the WIFI: URI and therefore have to
 * be backslash-escaped inside a value.
 *
 * One pass, not five: replacing `\` first and then `;` would double-escape the
 * backslashes introduced by the later passes, so `a;b` in an SSID containing a
 * literal backslash would come out corrupt. A single character-class replacement
 * cannot re-visit what it just wrote.
 */
const WIFI_RESERVED = /[\\;,:"]/g

export function escapeWifiValue(value: string): string {
  return value.replace(WIFI_RESERVED, (char) => `\\${char}`)
}

function buildWifiPayload(input: QrPayloadInput): QrPayloadResult {
  const security: WifiSecurity = input.security ?? 'WPA'
  const ssid = (input.ssid ?? '').trim()
  const password = input.password ?? ''

  if (ssid === '') {
    return fail('Enter the network name (SSID).')
  }
  const ssidBytes = utf8ByteLength(ssid)
  if (ssidBytes > MAX_SSID_BYTES) {
    return fail(
      `That SSID is ${ssidBytes} bytes. WiFi allows at most ${MAX_SSID_BYTES}, so it is not the real network name.`,
    )
  }

  const warnings: string[] = []
  const open = security === 'nopass'

  if (!open && password === '') {
    return fail(
      'Enter the WiFi password, or set security to “Open” for a network without one.',
    )
  }
  if (open && password !== '') {
    warnings.push(
      'Security is set to Open, so the password is left out of the code entirely.',
    )
  }
  if (security === 'WPA' && (password.length < 8 || password.length > 63)) {
    warnings.push(
      'A WPA passphrase is 8–63 characters. This one is outside that range, so check it before printing.',
    )
  }
  if (security === 'WEP' && password.length !== 5 && password.length !== 13) {
    warnings.push('A WEP key is 5 or 13 characters. Check this one before printing.')
  }
  if (/^\s|\s$/.test(password)) {
    warnings.push(
      'That password starts or ends with a space. It is encoded as typed — remove it if it was accidental.',
    )
  }

  // The password segment is omitted rather than left empty: `P:;` makes some
  // Android builds join with an empty PSK and fail instead of joining open.
  const passwordSegment = open ? '' : `P:${escapeWifiValue(password)};`

  const payload = `WIFI:T:${security};S:${escapeWifiValue(ssid)};${passwordSegment}H:${
    input.hidden === true ? 'true' : 'false'
  };;`

  return ok(payload, warnings)
}

/* -------------------------------------------------------------------------- */
/* UPI                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * `user@handle`: the local part allows digits, dots, hyphens and underscores
 * (phone-number VPAs are common), the handle is the PSP identifier and must start
 * with a letter. No spaces, exactly one `@`.
 */
const VPA_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,255}@[a-zA-Z][a-zA-Z0-9.-]{1,63}$/

export function isValidVpa(value: string): boolean {
  return VPA_PATTERN.test(value.trim())
}

interface ParsedAmount {
  /** Integer paise, or undefined when the field was left blank. */
  readonly paise?: number
  readonly warnings: readonly string[]
  readonly error?: string
}

/**
 * Amounts are parsed into integer paise and formatted from there, once.
 *
 * Keeping it in floating-point rupees lets representation error reach the
 * payload: `am=1200.0000000000002` is a string a UPI app will reject outright,
 * and the payer would see a failed collect request with no explanation.
 */
function parseUpiAmount(raw: string): ParsedAmount {
  const cleaned = raw.trim().replace(/[,\s₹]/g, '')
  if (cleaned === '') {
    return { warnings: [] }
  }
  if (!/^\d*\.?\d*$/.test(cleaned)) {
    return {
      warnings: [],
      error: 'The amount must be a plain number — digits and one decimal point.',
    }
  }

  const value = Number(cleaned)
  if (!Number.isFinite(value)) {
    return { warnings: [], error: 'Enter a valid amount, or leave it blank.' }
  }
  if (value <= 0) {
    return {
      warnings: [],
      error: 'Enter an amount above zero, or leave it blank to let the payer choose.',
    }
  }
  if (value > UPI_AMOUNT_MAX) {
    return {
      warnings: [],
      error: 'That amount is not a payment anyone can make — check the figure.',
    }
  }

  const warnings: string[] = []
  const decimals = cleaned.split('.')[1] ?? ''
  if (decimals.length > 2) {
    warnings.push(
      'Rounded to two decimals — UPI amounts carry paise, not fractions of a paisa.',
    )
  }
  if (value > UPI_AMOUNT_WARN) {
    warnings.push(
      `Most UPI apps refuse a single payment above ₹${UPI_AMOUNT_WARN.toLocaleString('en-IN')}.`,
    )
  }

  return { paise: Math.round(value * 100), warnings }
}

function buildUpiPayload(input: QrPayloadInput): QrPayloadResult {
  const vpa = (input.vpa ?? '').trim()
  const payeeName = (input.payeeName ?? '').trim()

  if (vpa === '') {
    return fail('Enter your UPI ID — it looks like name@bank.')
  }
  if (!isValidVpa(vpa)) {
    return fail('That is not a valid UPI ID. It must be one name@handle, with no spaces.')
  }
  if (payeeName === '') {
    return fail('Enter the payee name — most UPI apps reject a code without one.')
  }
  if (payeeName.length > MAX_PAYEE_NAME_LENGTH) {
    return fail(`The payee name must be ${MAX_PAYEE_NAME_LENGTH} characters or fewer.`)
  }

  const amount = parseUpiAmount(input.amount ?? '')
  if (amount.error !== undefined) {
    return fail(amount.error)
  }

  // `pa` is deliberately NOT percent-encoded: the `@` in a VPA is literal in
  // every NPCI example, and apps with naive query parsing mis-read `%40`. The
  // pattern above has already guaranteed it contains nothing else that needs
  // escaping. `pn` is free text, so it must be encoded.
  const params = [`pa=${vpa}`, `pn=${encodeURIComponent(payeeName)}`]
  if (amount.paise !== undefined) {
    params.push(`am=${(amount.paise / 100).toFixed(2)}`)
  }
  params.push('cu=INR')

  return ok(`upi://pay?${params.join('&')}`, amount.warnings)
}

/* -------------------------------------------------------------------------- */
/* ENTRY POINT                                                                */
/* -------------------------------------------------------------------------- */

function buildForMode(input: QrPayloadInput): QrPayloadResult {
  switch (input.mode) {
    case 'url':
      return buildUrlPayload(input.url ?? '')
    case 'text':
      return buildTextPayload(input.text ?? '')
    case 'wifi':
      return buildWifiPayload(input)
    case 'upi':
      return buildUpiPayload(input)
  }
}

/* -------------------------------------------------------------------------- */
/* COLOURS                                                                    */
/* -------------------------------------------------------------------------- */

export const DEFAULT_QR_DARK = '#000000'
export const DEFAULT_QR_LIGHT = '#ffffff'

/**
 * Below this ratio a decoder's black/white thresholding stops being reliable.
 *
 * A scanner does not read colours; it converts the camera frame to luminance and
 * splits it at a threshold. Two colours a human can easily tell apart by hue —
 * mid-blue on mid-green, say — can land close enough in luminance that the split
 * lands inside the noise, and the symbol simply fails to resolve. So the check
 * has to be on luminance contrast, not on whether the colours look different.
 *
 * 3:1 is our floor for "will resolve on a decent phone camera in good light".
 * It is a judgement, not a figure from the QR specification — ISO/IEC 18004
 * expresses print quality as reflectance grades rather than an sRGB ratio — so
 * the UI states it as guidance and never as a standard.
 */
export const QR_MIN_CONTRAST = 3

/** Below this, print and low light get unreliable even though screens cope. */
export const QR_PRINT_CONTRAST = 7

export interface QrColorAssessment {
  /** WCAG contrast ratio, or null when either colour is unparseable. */
  readonly ratio: number | null
  /** Set when the pair should not be used at all. */
  readonly error?: string
  readonly warnings: readonly string[]
}

/**
 * Judge a foreground/background pair for scannability.
 *
 * Two distinct failures, reported differently:
 *   - Too little luminance contrast — a hard error, because the code will not
 *     decode and shipping it is worse than not generating it.
 *   - Inverted (light modules on a dark field) — also an error. The spec's
 *     reflectance model assumes dark-on-light, and while some modern decoders
 *     invert as a fallback, plenty do not. A code that works on the designer's
 *     phone and fails on a customer's is the worst outcome this tool can produce.
 *
 * Competitors let you pick any two colours and hand back an unscannable image
 * with no warning at all. Catching it here is the point.
 */
export function assessQrColors(dark: string, light: string): QrColorAssessment {
  const ratio = hexContrastRatio(dark, light)
  if (ratio === null) {
    return {
      ratio: null,
      warnings: [],
      error: 'Enter both colours as hex values like #7030F8.',
    }
  }

  const darkRgb = parseHexColor(dark)
  const lightRgb = parseHexColor(light)
  if (darkRgb === null || lightRgb === null) {
    return {
      ratio: null,
      warnings: [],
      error: 'Enter both colours as hex values like #7030F8.',
    }
  }

  if (relativeLuminance(darkRgb) > relativeLuminance(lightRgb)) {
    return {
      ratio,
      warnings: [],
      error:
        'The module colour is lighter than the background, which inverts the code. Many scanners will not read an inverted symbol — swap the two colours.',
    }
  }

  if (ratio < QR_MIN_CONTRAST) {
    return {
      ratio,
      warnings: [],
      error: `These two colours are only ${ratio.toFixed(2)}:1 apart in brightness. A scanner separates the code from its background by brightness, not by hue, so this will not read reliably. Aim for at least ${QR_MIN_CONTRAST}:1.`,
    }
  }

  const warnings: string[] = []
  if (ratio < QR_PRINT_CONTRAST) {
    warnings.push(
      `At ${ratio.toFixed(2)}:1 this should scan on screen, but printed or in dim light it gets unreliable. Black on white is 21:1 — stay near that for anything going on paper.`,
    )
  }

  return { ratio, warnings }
}

export function buildQrPayload(input: QrPayloadInput): QrPayloadResult {
  const built = buildForMode(input)
  if (built.error !== undefined) {
    return built
  }

  const bytes = utf8ByteLength(built.payload)
  // The ceiling is L's, because L is the most that any level can hold: past it
  // no symbol exists, whatever the user picks in the correction selector.
  if (bytes > QR_BYTE_CAPACITY.L) {
    return fail(
      `That is ${bytes} bytes. A QR code holds at most ${QR_BYTE_CAPACITY.L}, so this cannot be encoded.`,
    )
  }
  if (bytes > QR_DENSITY_WARN_BYTES) {
    return ok(built.payload, [
      ...built.warnings,
      `At ${bytes} bytes this needs a dense matrix, so print it at a larger size — small stickers will not scan reliably.`,
    ])
  }

  return built
}
