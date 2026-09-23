import { deflateRawSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import { createZip } from '../skills/zip'
import { readZipEntry } from './zip-reader'

/** Same CRC-32 as the module under test and lib/skills/zip.ts — a small,
 * deliberately independent re-implementation so a bug shared between the
 * reader and this fixture builder couldn't hide a mismatch from a test. */
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc = crc ^ byte
    for (let k = 0; k < 8; k++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

/** A test-only zip builder supporting BOTH compression methods (the real
 * lib/skills/zip.ts writer is STORE-only, since every real entry it writes
 * is short markdown text) — needed here to exercise `readZipEntry`'s
 * DEFLATE path, which STORE-only fixtures never would. */
function buildZip(
  entries: readonly { name: string; content: string; deflate?: boolean }[],
): Uint8Array {
  const encoder = new TextEncoder()
  const local: number[] = []
  const central: number[] = []
  let offset = 0

  function pushU16(arr: number[], v: number) {
    arr.push(v & 0xff, (v >>> 8) & 0xff)
  }
  function pushU32(arr: number[], v: number) {
    arr.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff)
  }

  for (const e of entries) {
    const nameBytes = encoder.encode(e.name)
    const rawBytes = encoder.encode(e.content)
    const method = e.deflate ? 8 : 0
    const dataBytes = e.deflate ? new Uint8Array(deflateRawSync(rawBytes)) : rawBytes
    const crc = crc32(rawBytes)
    const localHeaderOffset = offset

    const lh: number[] = []
    pushU32(lh, 0x04034b50)
    pushU16(lh, 20)
    pushU16(lh, 0)
    pushU16(lh, method)
    pushU16(lh, 0)
    pushU16(lh, 0)
    pushU32(lh, crc)
    pushU32(lh, dataBytes.length)
    pushU32(lh, rawBytes.length)
    pushU16(lh, nameBytes.length)
    pushU16(lh, 0)
    local.push(...lh, ...nameBytes, ...dataBytes)
    offset += lh.length + nameBytes.length + dataBytes.length

    const ch: number[] = []
    pushU32(ch, 0x02014b50)
    pushU16(ch, 20)
    pushU16(ch, 20)
    pushU16(ch, 0)
    pushU16(ch, method)
    pushU16(ch, 0)
    pushU16(ch, 0)
    pushU32(ch, crc)
    pushU32(ch, dataBytes.length)
    pushU32(ch, rawBytes.length)
    pushU16(ch, nameBytes.length)
    pushU16(ch, 0)
    pushU16(ch, 0)
    pushU16(ch, 0)
    pushU16(ch, 0)
    pushU32(ch, 0)
    pushU32(ch, localHeaderOffset)
    central.push(...ch, ...nameBytes)
  }

  const centralDirOffset = offset
  offset += central.length

  const eocd: number[] = []
  pushU32(eocd, 0x06054b50)
  pushU16(eocd, 0)
  pushU16(eocd, 0)
  pushU16(eocd, entries.length)
  pushU16(eocd, entries.length)
  pushU32(eocd, central.length)
  pushU32(eocd, centralDirOffset)
  pushU16(eocd, 0)

  return new Uint8Array([...local, ...central, ...eocd])
}

describe('readZipEntry', () => {
  it('reads a STORE-method entry via the real lib/skills/zip.ts writer (round trip)', () => {
    const zip = createZip([
      { name: 'SKILL.md', content: '---\nname: x\n---\nBody text.' },
    ])
    const result = readZipEntry(zip, 'SKILL.md')
    expect(result).toEqual({ ok: true, content: '---\nname: x\n---\nBody text.' })
  })

  it('reads a DEFLATE-compressed entry', () => {
    const zip = buildZip([{ name: 'SKILL.md', content: 'a'.repeat(500), deflate: true }])
    const result = readZipEntry(zip, 'SKILL.md')
    expect(result).toEqual({ ok: true, content: 'a'.repeat(500) })
  })

  it('finds the entry case-insensitively', () => {
    const zip = buildZip([{ name: 'skill.md', content: 'hi' }])
    const result = readZipEntry(zip, 'SKILL.md')
    expect(result).toEqual({ ok: true, content: 'hi' })
  })

  it('finds the entry inside a wrapping folder', () => {
    const zip = buildZip([{ name: 'my-skill/SKILL.md', content: 'nested' }])
    const result = readZipEntry(zip, 'SKILL.md')
    expect(result).toEqual({ ok: true, content: 'nested' })
  })

  it('prefers the shallowest match when the name appears at multiple depths', () => {
    const zip = buildZip([
      { name: 'examples/SKILL.md', content: 'wrong one' },
      { name: 'SKILL.md', content: 'right one' },
    ])
    const result = readZipEntry(zip, 'SKILL.md')
    expect(result).toEqual({ ok: true, content: 'right one' })
  })

  it('reports a clear error when the named entry is absent', () => {
    const zip = buildZip([{ name: 'README.md', content: 'no skill here' }])
    const result = readZipEntry(zip, 'SKILL.md')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain('No SKILL.md found')
  })

  it('rejects a completely non-zip buffer instead of throwing', () => {
    const result = readZipEntry(new TextEncoder().encode('not a zip at all'), 'SKILL.md')
    expect(result.ok).toBe(false)
  })

  it('rejects an empty buffer instead of throwing', () => {
    const result = readZipEntry(new Uint8Array(0), 'SKILL.md')
    expect(result.ok).toBe(false)
  })

  it('detects a corrupted entry via CRC mismatch', () => {
    const zip = createZip([{ name: 'SKILL.md', content: 'original content' }])
    const corrupted = new Uint8Array(zip)
    // Flip a byte inside the local file header's data region — well past
    // the fixed-size header/filename, safely inside "original content".
    const dataStart = 30 + 'SKILL.md'.length
    corrupted[dataStart] = (corrupted[dataStart] as number) ^ 0xff
    const result = readZipEntry(corrupted, 'SKILL.md')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain('integrity check')
  })

  it('rejects an unsupported compression method with a clear message', () => {
    // readZipEntry trusts the CENTRAL directory's method field, never the
    // local header's copy (see the module's own docblock on why) — so the
    // tamper has to land there. Local section for a 1-entry, 1-byte,
    // 8-byte-name zip is exactly 39 bytes (30-byte fixed header + "SKILL.md"
    // + 1 data byte); the central entry's method field sits 10 bytes into
    // its own 46-byte fixed header, i.e. absolute offset 39 + 10 = 49.
    const zip = buildZip([{ name: 'SKILL.md', content: 'x' }])
    const tampered = new Uint8Array(zip)
    const centralMethodOffset = 39 + 10
    expect(tampered[centralMethodOffset]).toBe(0) // sanity: really is STORE(0) before the tamper
    tampered[centralMethodOffset] = 99
    const result = readZipEntry(tampered, 'SKILL.md')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain('unsupported compression')
  })
})
