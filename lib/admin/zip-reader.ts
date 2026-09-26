import { inflateRawSync } from 'node:zlib'

/**
 * A minimal, dependency-free ZIP reader — just enough to find one named
 * entry inside an uploaded .zip and return its bytes, verified against
 * the entry's own CRC-32. Mirrors lib/skills/zip.ts's existing "hand-roll
 * a well-defined binary format rather than add a dependency" choice, one
 * direction earlier in the pipeline: that file WRITES a zip (STORE only,
 * since every entry is markdown text this app generates itself); this one
 * READS an arbitrary zip an admin uploads, which may use either STORE
 * (method 0) or DEFLATE (method 8) — the two methods every real zip tool
 * actually produces — decompressed via Node's built-in `zlib`, so still
 * no new dependency.
 *
 * Deliberately narrow: this is not a general-purpose zip library. It
 * parses the End Of Central Directory record and Central Directory
 * entries (the authoritative index — trusting a Local File Header alone
 * is how zip-slip and truncation bugs happen), locates one entry by name,
 * and decompresses just that one entry's bytes. Nothing here extracts an
 * entry's data without also verifying its CRC-32, so a truncated or
 * corrupted upload is a validation error, never a silently wrong SKILL.md.
 */

const EOCD_SIGNATURE = 0x06054b50
const CENTRAL_DIR_SIGNATURE = 0x02014b50
const LOCAL_FILE_SIGNATURE = 0x04034b50
/** The EOCD record is 22 bytes plus up to 65,535 bytes of a trailing
 * comment — scanning that far back from the end is enough to find it in
 * any real-world zip without reading the whole file into the search. */
const MAX_EOCD_SEARCH = 65_535 + 22
/** Largest single entry this will inflate. SKILL.md is markdown — the
 * biggest real one in the 10,000-skill registry is well under 100KB. */
const MAX_ENTRY_BYTES = 4 * 1024 * 1024

export interface ZipReadError {
  readonly ok: false
  readonly message: string
}
export interface ZipReadSuccess {
  readonly ok: true
  readonly content: string
}

/** Same CRC-32 table/algorithm as lib/skills/zip.ts's writer — verified
 * there against the official "123456789" check value. */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc = (CRC_TABLE[(crc ^ byte) & 0xff] as number) ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

interface CentralDirEntry {
  readonly name: string
  readonly compressionMethod: number
  readonly compressedSize: number
  readonly uncompressedSize: number
  readonly crc32: number
  readonly localHeaderOffset: number
}

function findEndOfCentralDirectory(buf: Buffer): number {
  const start = Math.max(0, buf.length - MAX_EOCD_SEARCH)
  for (let i = buf.length - 22; i >= start; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIGNATURE) return i
  }
  return -1
}

function readCentralDirectory(buf: Buffer): readonly CentralDirEntry[] | undefined {
  const eocdOffset = findEndOfCentralDirectory(buf)
  if (eocdOffset === -1) return undefined

  const entryCount = buf.readUInt16LE(eocdOffset + 10)
  const centralDirOffset = buf.readUInt32LE(eocdOffset + 16)

  const entries: CentralDirEntry[] = []
  let offset = centralDirOffset
  for (let i = 0; i < entryCount; i++) {
    if (offset + 46 > buf.length || buf.readUInt32LE(offset) !== CENTRAL_DIR_SIGNATURE) {
      return undefined
    }
    const compressionMethod = buf.readUInt16LE(offset + 10)
    const crc = buf.readUInt32LE(offset + 16)
    const compressedSize = buf.readUInt32LE(offset + 20)
    const uncompressedSize = buf.readUInt32LE(offset + 24)
    const nameLength = buf.readUInt16LE(offset + 28)
    const extraLength = buf.readUInt16LE(offset + 30)
    const commentLength = buf.readUInt16LE(offset + 32)
    const localHeaderOffset = buf.readUInt32LE(offset + 42)
    const name = buf.toString('utf8', offset + 46, offset + 46 + nameLength)

    entries.push({
      name,
      compressionMethod,
      compressedSize,
      uncompressedSize,
      crc32: crc,
      localHeaderOffset,
    })
    offset += 46 + nameLength + extraLength + commentLength
  }
  return entries
}

/** Reads one entry's raw (still-compressed) bytes via its Local File
 * Header — the header itself is only trusted for the variable-length
 * name/extra fields it repeats (their lengths can differ from the
 * central directory's copy), never for size/CRC, which always come from
 * the central directory entry that led here. */
function readEntryBytes(buf: Buffer, entry: CentralDirEntry): Buffer | undefined {
  const offset = entry.localHeaderOffset
  if (offset + 30 > buf.length || buf.readUInt32LE(offset) !== LOCAL_FILE_SIGNATURE) {
    return undefined
  }
  const nameLength = buf.readUInt16LE(offset + 26)
  const extraLength = buf.readUInt16LE(offset + 28)
  const dataStart = offset + 30 + nameLength + extraLength
  const dataEnd = dataStart + entry.compressedSize
  if (dataEnd > buf.length) return undefined
  return buf.subarray(dataStart, dataEnd)
}

/**
 * Finds `targetName` (case-insensitive, matched against the entry's own
 * base filename so it works whether the zip wraps everything in one
 * top-level folder or not — e.g. "my-skill/SKILL.md" matches "SKILL.md")
 * inside `zipBytes`, decompresses it, and verifies its CRC-32. Returns
 * the decoded UTF-8 text, or a human-readable reason it couldn't.
 */
export function readZipEntry(
  zipBytes: Uint8Array,
  targetName: string,
): ZipReadSuccess | ZipReadError {
  const buf = Buffer.from(zipBytes)
  const entries = readCentralDirectory(buf)
  if (!entries)
    return { ok: false, message: 'Not a valid .zip file (no central directory found).' }

  const wanted = targetName.toLowerCase()
  const matches = entries.filter((e) => {
    const base = e.name.split('/').pop()?.toLowerCase()
    return base === wanted
  })
  if (matches.length === 0) {
    return { ok: false, message: `No ${targetName} found inside the .zip.` }
  }
  // The shallowest match — the entry with the fewest path segments — so a
  // zip with both "SKILL.md" and "examples/SKILL.md" picks the real one.
  const entry = matches.reduce((shallowest, candidate) =>
    candidate.name.split('/').length < shallowest.name.split('/').length
      ? candidate
      : shallowest,
  )

  const raw = readEntryBytes(buf, entry)
  if (!raw)
    return {
      ok: false,
      message: `${targetName}'s data could not be read — the .zip may be truncated.`,
    }

  // Zip bomb guard: the central directory's declared size is checked
  // before inflating, and the inflater is capped at that size, so a small
  // upload cannot expand into gigabytes in this function's memory. Deflate
  // can reach ~1000:1, so the 15MB upload cap alone was no protection.
  if (entry.uncompressedSize > MAX_ENTRY_BYTES) {
    return {
      ok: false,
      message: `${targetName} is ${Math.round(entry.uncompressedSize / 1024 / 1024)}MB uncompressed — the limit is ${MAX_ENTRY_BYTES / 1024 / 1024}MB.`,
    }
  }

  let decompressed: Buffer
  if (entry.compressionMethod === 0) {
    decompressed = raw
  } else if (entry.compressionMethod === 8) {
    try {
      decompressed = inflateRawSync(raw, { maxOutputLength: MAX_ENTRY_BYTES })
    } catch {
      return {
        ok: false,
        message: `${targetName} could not be decompressed — the .zip may be corrupted.`,
      }
    }
  } else {
    return {
      ok: false,
      message: `${targetName} uses an unsupported compression method (${entry.compressionMethod}). Re-save the .zip with standard Deflate or Store compression.`,
    }
  }

  if (
    decompressed.length !== entry.uncompressedSize ||
    crc32(decompressed) !== entry.crc32
  ) {
    return {
      ok: false,
      message: `${targetName} failed its integrity check — the .zip may be corrupted.`,
    }
  }

  return { ok: true, content: decompressed.toString('utf8') }
}
