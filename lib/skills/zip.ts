/**
 * A minimal, dependency-free ZIP writer — STORE method only (no compression).
 *
 * Why hand-rolled rather than a library: every skill body is small markdown
 * text, so compression buys nothing worth a new dependency for; the STORE
 * format is a well-defined, easy-to-get-exactly-right binary layout (no
 * DEFLATE implementation needed), matching this codebase's existing
 * preference for a small hand-rolled implementation over a dependency when
 * the real need is this narrow (see the hand-rolled sparkline in
 * AiVisibilityChecker.tsx — "no charting library exists in this repo").
 *
 * Pure and synchronous: takes entries, returns bytes. No I/O, so it is
 * fully unit-testable without a browser.
 */

export interface ZipEntry {
  readonly name: string
  readonly content: string
}

/** Standard CRC-32 (IEEE 802.3), reflected, polynomial 0xEDB88320 — the same
 * checksum every real zip tool computes, verified in tests against the
 * official "123456789" → 0xCBF43926 check value. */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of bytes) {
    const tableIndex = (crc ^ byte) & 0xff
    crc = (CRC_TABLE[tableIndex] as number) ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

/** Fixed DOS date/time (1980-01-01, midnight) rather than the real time:
 * `Date.now()` is banned in this codebase's render-time code, and a zip's
 * internal per-entry timestamp has no user-facing effect here, so a stable
 * constant sidesteps the question rather than threading a timestamp through
 * every caller of a pure function. */
const DOS_TIME = 0
const DOS_DATE = (1 << 5) | 1

/** General-purpose bit 11: filenames/comments are UTF-8. Every modern
 * unzip tool (macOS Archive Utility, 7-Zip, Windows Explorer since Win10)
 * honours this; without it a non-ASCII skill name could mis-decode. */
const UTF8_FLAG = 0x0800

function u16(view: DataView, offset: number, value: number): void {
  view.setUint16(offset, value, true)
}
function u32(view: DataView, offset: number, value: number): void {
  view.setUint32(offset, value, true)
}

/** Builds a valid, spec-compliant .zip file from a small set of text
 * entries. Duplicate names are the caller's problem — this just writes
 * whatever it's given, once per entry, in order. */
export function createZip(entries: readonly ZipEntry[]): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder()
  const encoded = entries.map((e) => ({
    nameBytes: encoder.encode(e.name),
    contentBytes: encoder.encode(e.content),
  }))

  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0

  for (const { nameBytes, contentBytes } of encoded) {
    const crc = crc32(contentBytes)
    const size = contentBytes.length

    const local = new Uint8Array(30 + nameBytes.length)
    const lv = new DataView(local.buffer)
    u32(lv, 0, 0x04034b50) // local file header signature
    u16(lv, 4, 20) // version needed to extract (2.0)
    u16(lv, 6, UTF8_FLAG)
    u16(lv, 8, 0) // compression method: 0 = store
    u16(lv, 10, DOS_TIME)
    u16(lv, 12, DOS_DATE)
    u32(lv, 14, crc)
    u32(lv, 18, size) // compressed size == uncompressed for store
    u32(lv, 22, size)
    u16(lv, 26, nameBytes.length)
    u16(lv, 28, 0) // extra field length
    local.set(nameBytes, 30)
    localParts.push(local, contentBytes)

    const central = new Uint8Array(46 + nameBytes.length)
    const cv = new DataView(central.buffer)
    u32(cv, 0, 0x02014b50) // central directory file header signature
    u16(cv, 4, 20) // version made by
    u16(cv, 6, 20) // version needed to extract
    u16(cv, 8, UTF8_FLAG)
    u16(cv, 10, 0) // compression method
    u16(cv, 12, DOS_TIME)
    u16(cv, 14, DOS_DATE)
    u32(cv, 16, crc)
    u32(cv, 20, size)
    u32(cv, 24, size)
    u16(cv, 28, nameBytes.length)
    u16(cv, 30, 0) // extra field length
    u16(cv, 32, 0) // file comment length
    u16(cv, 34, 0) // disk number start
    u16(cv, 36, 0) // internal file attributes
    u32(cv, 38, 0) // external file attributes
    u32(cv, 42, offset) // relative offset of local header
    central.set(nameBytes, 46)
    centralParts.push(central)

    offset += local.length + contentBytes.length
  }

  const centralDirOffset = offset
  const centralDirSize = centralParts.reduce((n, p) => n + p.length, 0)

  const eocd = new Uint8Array(22)
  const ev = new DataView(eocd.buffer)
  u32(ev, 0, 0x06054b50) // end of central directory signature
  u16(ev, 4, 0) // this disk
  u16(ev, 6, 0) // disk with central directory start
  u16(ev, 8, entries.length) // entries on this disk
  u16(ev, 10, entries.length) // entries total
  u32(ev, 12, centralDirSize)
  u32(ev, 16, centralDirOffset)
  u16(ev, 20, 0) // comment length

  const totalLength =
    localParts.reduce((n, p) => n + p.length, 0) + centralDirSize + eocd.length
  const out = new Uint8Array(totalLength)
  let pos = 0
  for (const part of localParts) {
    out.set(part, pos)
    pos += part.length
  }
  for (const part of centralParts) {
    out.set(part, pos)
    pos += part.length
  }
  out.set(eocd, pos)
  return out
}
