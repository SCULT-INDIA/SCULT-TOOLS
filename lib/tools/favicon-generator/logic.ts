/**
 * Favicon generator — the pure encoding layer.
 *
 * Purpose
 *   Turn already-encoded PNG bytes into the two container formats a favicon
 *   set needs — a multi-image `.ico` and a STORE-method `.zip` — plus the
 *   HTML/webmanifest snippets that install them. All canvas drawing (the part
 *   that needs a browser) stays in the component; everything in this file is
 *   deterministic byte-bashing that runs identically in Node and the browser.
 *
 * Inputs   PNG payloads as Uint8Array, file names, an app name for the
 *          manifest, raw image dimensions for crop maths.
 * Outputs  complete `.ico`/`.zip` byte buffers, snippet strings, crop rects.
 * Failure  nothing here throws on bad input: unusable dimensions produce a
 *          zero-size crop, an empty entry list produces a valid empty
 *          container, and out-of-range sizes are clamped to the format's
 *          encodable range. The caller re-renders per keystroke, so
 *          half-formed input is the normal case, not an exception.
 *
 * No React, no DOM, no I/O — unit-tested in logic.test.ts.
 */

/** Source images past this are rejected before decoding. */
export const FAVICON_MAX_SOURCE_BYTES = 10 * 1024 * 1024

/** The classic ICO ladder: title bar, taskbar/pinned tab, desktop shortcut. */
export const ICO_SIZES: readonly number[] = [16, 32, 48]

/** Text mode allows at most this many glyphs — a favicon is 16px wide. */
export const MAX_TEXT_GLYPHS = 3

export interface IcoEntry {
  /** Pixel width/height of this square image (1–256). */
  readonly size: number
  /** A complete PNG file for that size. */
  readonly png: Uint8Array
}

export interface ZipFileEntry {
  /** Path inside the archive, e.g. `favicon.ico`. ASCII expected. */
  readonly name: string
  readonly data: Uint8Array
}

export interface CropRect {
  readonly sx: number
  readonly sy: number
  /** Side length of the square. 0 means the input was unusable. */
  readonly size: number
}

/* ---------------------------------------------------------------- CRC-32 */

/**
 * Standard CRC-32 (the ZIP/PNG/gzip polynomial, reflected 0xEDB88320).
 * The 256-entry table is built once on first use; each byte then costs one
 * table lookup, so hashing a 512px PNG is microseconds, not milliseconds.
 */
let CRC_TABLE: Uint32Array | null = null

function crcTable(): Uint32Array {
  if (CRC_TABLE !== null) return CRC_TABLE
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = (c & 1) === 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  CRC_TABLE = table
  return table
}

/**
 * CRC-32 of a byte buffer, returned as an unsigned 32-bit integer.
 * Check values: crc32 of the empty buffer is 0x00000000, and of the ASCII
 * bytes `123456789` is 0xCBF43926 — the reference vector every CRC-32
 * implementation is validated against.
 */
export function crc32(data: Uint8Array): number {
  const table = crcTable()
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    const byte = data[i]
    if (byte === undefined) continue
    const idx = (crc ^ byte) & 0xff
    crc = (table[idx] ?? 0) ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

/* ---------------------------------------------------------------- ICO */

const ICONDIR_BYTES = 6
const ICONDIRENTRY_BYTES = 16

/**
 * The one quirk of the ICONDIRENTRY width/height bytes: they are single
 * bytes, so 256 is encoded as 0. Anything outside 1–256 cannot be encoded
 * honestly; clamp rather than throw, because a favicon pipeline never
 * produces such a size on purpose.
 */
function icoDimensionByte(size: number): number {
  const rounded = Math.round(size)
  if (!Number.isFinite(rounded) || rounded <= 0) return 1
  if (rounded >= 256) return 0
  return rounded
}

/**
 * Builds a `.ico` container holding one PNG per entry.
 *
 * Layout per the ICONDIR spec:
 *   bytes 0–1  reserved, always 0
 *   bytes 2–3  type, 1 = icon (2 would be a .cur cursor)
 *   bytes 4–5  image count
 *   then one 16-byte ICONDIRENTRY per image:
 *     width, height (1 byte each, 256 -> 0), palette count 0, reserved 0,
 *     colour planes (u16, 1), bits per pixel (u16, 32),
 *     payload byte length (u32), payload offset from file start (u32)
 *   then the payloads, back to back, in entry order.
 *
 * PNG payloads (rather than the ancient BMP-with-AND-mask format) have been
 * legal inside ICO since Windows Vista and are read by every modern browser.
 * All integers are little-endian, as everywhere in the ICO and ZIP formats.
 */
export function buildIco(entries: readonly IcoEntry[]): Uint8Array<ArrayBuffer> {
  const count = entries.length
  const headerBytes = ICONDIR_BYTES + ICONDIRENTRY_BYTES * count
  let total = headerBytes
  for (const entry of entries) total += entry.png.length

  const out = new Uint8Array(total)
  const view = new DataView(out.buffer)

  view.setUint16(0, 0, true) // reserved
  view.setUint16(2, 1, true) // type: icon
  view.setUint16(4, count, true)

  let offset = headerBytes
  for (let i = 0; i < count; i++) {
    const entry = entries[i]
    if (entry === undefined) continue
    const base = ICONDIR_BYTES + i * ICONDIRENTRY_BYTES
    const dim = icoDimensionByte(entry.size)
    out[base] = dim // width
    out[base + 1] = dim // height
    out[base + 2] = 0 // palette entries: none, it's 32-bit
    out[base + 3] = 0 // reserved
    view.setUint16(base + 4, 1, true) // colour planes
    view.setUint16(base + 6, 32, true) // bits per pixel
    view.setUint32(base + 8, entry.png.length, true)
    view.setUint32(base + 12, offset, true)
    out.set(entry.png, offset)
    offset += entry.png.length
  }

  return out
}

/* ---------------------------------------------------------------- ZIP */

/**
 * Fixed MS-DOS timestamp stamped on every archive member so two builds of
 * the same inputs are byte-identical. DOS dates pack year-1980/month/day
 * into 16 bits; this is 2026-07-29 00:00:00.
 */
const ZIP_DOS_DATE = ((2026 - 1980) << 9) | (7 << 5) | 29
const ZIP_DOS_TIME = 0

const SIG_LOCAL = 0x04034b50 // PK\x03\x04
const SIG_CENTRAL = 0x02014b50 // PK\x01\x02
const SIG_EOCD = 0x06054b50 // PK\x05\x06

const LOCAL_HEADER_BYTES = 30
const CENTRAL_HEADER_BYTES = 46
const EOCD_BYTES = 22

/**
 * Builds a ZIP archive using method 0 (STORE — no compression).
 *
 * STORE is the right call here, not a shortcut: every member is a PNG, an
 * ICO full of PNGs, or a tiny JSON file. PNG payloads are already
 * DEFLATE-compressed, so re-deflating them inside the ZIP wastes CPU to
 * save single-digit bytes. With STORE, the only non-trivial work is the
 * CRC-32 each member's header must carry.
 *
 * Structure: [local header + name + data] per file, then the central
 * directory (one record per file pointing back at its local header), then
 * the end-of-central-directory record. That trailing EOCD is why unzippers
 * read archives back to front.
 */
export function buildZip(files: readonly ZipFileEntry[]): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder()
  const members = files.map((file) => ({
    nameBytes: encoder.encode(file.name),
    data: file.data,
    crc: crc32(file.data),
    localOffset: 0,
  }))

  let localSize = 0
  for (const m of members) {
    m.localOffset = localSize
    localSize += LOCAL_HEADER_BYTES + m.nameBytes.length + m.data.length
  }
  let centralSize = 0
  for (const m of members) centralSize += CENTRAL_HEADER_BYTES + m.nameBytes.length

  const out = new Uint8Array(localSize + centralSize + EOCD_BYTES)
  const view = new DataView(out.buffer)

  // Local file headers + payloads.
  for (const m of members) {
    let p = m.localOffset
    view.setUint32(p, SIG_LOCAL, true)
    view.setUint16(p + 4, 20, true) // version needed: 2.0
    view.setUint16(p + 6, 0, true) // flags
    view.setUint16(p + 8, 0, true) // method 0 = STORE
    view.setUint16(p + 10, ZIP_DOS_TIME, true)
    view.setUint16(p + 12, ZIP_DOS_DATE, true)
    view.setUint32(p + 14, m.crc, true)
    view.setUint32(p + 18, m.data.length, true) // compressed size (== raw)
    view.setUint32(p + 22, m.data.length, true) // uncompressed size
    view.setUint16(p + 26, m.nameBytes.length, true)
    view.setUint16(p + 28, 0, true) // extra field length
    p += LOCAL_HEADER_BYTES
    out.set(m.nameBytes, p)
    out.set(m.data, p + m.nameBytes.length)
  }

  // Central directory.
  let p = localSize
  for (const m of members) {
    view.setUint32(p, SIG_CENTRAL, true)
    view.setUint16(p + 4, 20, true) // version made by
    view.setUint16(p + 6, 20, true) // version needed
    view.setUint16(p + 8, 0, true) // flags
    view.setUint16(p + 10, 0, true) // method STORE
    view.setUint16(p + 12, ZIP_DOS_TIME, true)
    view.setUint16(p + 14, ZIP_DOS_DATE, true)
    view.setUint32(p + 16, m.crc, true)
    view.setUint32(p + 20, m.data.length, true)
    view.setUint32(p + 24, m.data.length, true)
    view.setUint16(p + 28, m.nameBytes.length, true)
    view.setUint16(p + 30, 0, true) // extra length
    view.setUint16(p + 32, 0, true) // comment length
    view.setUint16(p + 34, 0, true) // disk number start
    view.setUint16(p + 36, 0, true) // internal attributes
    view.setUint32(p + 38, 0, true) // external attributes
    view.setUint32(p + 42, m.localOffset, true)
    p += CENTRAL_HEADER_BYTES
    out.set(m.nameBytes, p)
    p += m.nameBytes.length
  }

  // End of central directory.
  view.setUint32(p, SIG_EOCD, true)
  view.setUint16(p + 4, 0, true) // this disk
  view.setUint16(p + 6, 0, true) // disk with the central directory
  view.setUint16(p + 8, members.length, true) // entries on this disk
  view.setUint16(p + 10, members.length, true) // entries total
  view.setUint32(p + 12, centralSize, true)
  view.setUint32(p + 16, localSize, true) // central directory offset
  view.setUint16(p + 20, 0, true) // comment length

  return out
}

/* ---------------------------------------------------------------- Snippets */

/**
 * The `<head>` block that installs the generated files, assuming they sit at
 * the site root. Four lines cover every consumer in 2026: the ICO for legacy
 * and address-bar lookups, one PNG for anything that prefers it, the Apple
 * touch icon for iOS home screens, and the manifest for Android/PWA installs.
 */
export function buildHtmlSnippet(): string {
  return [
    '<link rel="icon" href="/favicon.ico" sizes="48x48">',
    '<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
  ].join('\n')
}

/** True for a #rgb or #rrggbb hex colour. */
export function isHexColor(value: string): boolean {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
}

/**
 * Builds `site.webmanifest` as pretty-printed JSON. The app name is user
 * input, so it goes through JSON serialisation of the whole document rather
 * than string templating — quotes, backslashes and control characters in the
 * name come out escaped instead of breaking the file. A non-hex theme colour
 * falls back to white rather than emitting an invalid manifest.
 */
export function buildWebmanifest(appName: string, themeColor: string): string {
  const name = appName.trim() === '' ? 'My site' : appName.trim()
  const color = isHexColor(themeColor) ? themeColor.trim().toLowerCase() : '#ffffff'
  const manifest = {
    name,
    short_name: name.length > 12 ? name.slice(0, 12).trimEnd() : name,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: color,
    background_color: color,
    display: 'standalone',
  }
  return JSON.stringify(manifest, null, 2)
}

/* ---------------------------------------------------------------- Geometry */

/**
 * The largest centred square inside a w x h image, in source pixels — the
 * `sx, sy, sw, sh` half of a drawImage call. Off-by-one policy: dimensions
 * are floored first, and the offset is floored too, so a 101x100 source
 * crops to a 100px square starting at x=0 (never x=0.5, which would trigger
 * resampling on what should be a pixel-exact copy). Unusable input — zero,
 * negative, NaN, Infinity — returns size 0, which the caller treats as
 * "nothing to draw" rather than an exception.
 */
export function centerCrop(width: number, height: number): CropRect {
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return { sx: 0, sy: 0, size: 0 }
  }
  const w = Math.floor(width)
  const h = Math.floor(height)
  if (w <= 0 || h <= 0) return { sx: 0, sy: 0, size: 0 }
  const size = Math.min(w, h)
  return {
    sx: Math.floor((w - size) / 2),
    sy: Math.floor((h - size) / 2),
    size,
  }
}

/**
 * Trims text to at most `max` user-perceived characters (grapheme clusters),
 * so one emoji — even a multi-code-point one like a flag or a skin-tone
 * variant — counts as one glyph, not two or four. Uses Intl.Segmenter where
 * available (every 2026 browser and Node 16+) and falls back to code-point
 * counting, which still keeps surrogate pairs intact.
 */
export function clampGlyphs(text: string, max: number): string {
  if (!Number.isFinite(max) || max <= 0) return ''
  const limit = Math.floor(max)
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    const parts: string[] = []
    for (const s of segmenter.segment(text)) {
      parts.push(s.segment)
      if (parts.length === limit) break
    }
    return parts.join('')
  }
  return Array.from(text).slice(0, limit).join('')
}
