import { describe, expect, it } from 'vitest'
import { createZip } from './zip'

/**
 * No zip-reading library exists in this repo (createZip's own docblock
 * explains why one wasn't added for writing either), so this file's own
 * `readZip` is a minimal STORE-only decoder — reading exactly the format
 * `createZip` writes — used purely to verify the writer round-trips.
 * Deliberately does not handle DEFLATE (createZip never produces it).
 */
function readZip(bytes: Uint8Array): { name: string; content: string }[] {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const decoder = new TextDecoder()
  const entries: { name: string; content: string }[] = []
  let offset = 0
  while (offset < bytes.length) {
    const signature = view.getUint32(offset, true)
    if (signature !== 0x04034b50) break // reached the central directory
    const nameLength = view.getUint16(offset + 26, true)
    const extraLength = view.getUint16(offset + 28, true)
    const compressedSize = view.getUint32(offset + 18, true)
    const method = view.getUint16(offset + 8, true)
    if (method !== 0) throw new Error('readZip only supports STORE entries')
    const nameStart = offset + 30
    const dataStart = nameStart + nameLength + extraLength
    const name = decoder.decode(bytes.subarray(nameStart, nameStart + nameLength))
    const content = decoder.decode(bytes.subarray(dataStart, dataStart + compressedSize))
    entries.push({ name, content })
    offset = dataStart + compressedSize
  }
  return entries
}

describe('createZip', () => {
  it('produces a valid local file header signature', () => {
    const zip = createZip([{ name: 'SKILL.md', content: 'hello' }])
    const view = new DataView(zip.buffer)
    expect(view.getUint32(0, true)).toBe(0x04034b50)
  })

  it('round-trips a single entry byte-for-byte', () => {
    const zip = createZip([{ name: 'SKILL.md', content: '# Hello\n\nworld' }])
    const entries = readZip(zip)
    expect(entries).toEqual([{ name: 'SKILL.md', content: '# Hello\n\nworld' }])
  })

  it('round-trips multiple entries in order', () => {
    const zip = createZip([
      { name: 'SKILL.md', content: 'skill body' },
      { name: 'INSTALL.md', content: 'install steps' },
    ])
    expect(readZip(zip)).toEqual([
      { name: 'SKILL.md', content: 'skill body' },
      { name: 'INSTALL.md', content: 'install steps' },
    ])
  })

  it('handles an empty file body', () => {
    const zip = createZip([{ name: 'EMPTY.md', content: '' }])
    expect(readZip(zip)).toEqual([{ name: 'EMPTY.md', content: '' }])
  })

  it('handles multi-byte UTF-8 content and non-ASCII filenames', () => {
    const zip = createZip([{ name: 'skill-Ünïcode.md', content: 'emoji: 🎉 café' }])
    expect(readZip(zip)).toEqual([
      { name: 'skill-Ünïcode.md', content: 'emoji: 🎉 café' },
    ])
  })

  it('ends with a valid end-of-central-directory record', () => {
    const zip = createZip([{ name: 'a.md', content: 'x' }])
    const view = new DataView(zip.buffer)
    // Last 22 bytes are the fixed-size EOCD record (no zip comment is ever
    // written), so its signature sits at exactly length-22.
    expect(view.getUint32(zip.length - 22, true)).toBe(0x06054b50)
  })

  it('produces the CRC-32 the standard official check value verifies', () => {
    // The universally-quoted CRC-32 self-test: CRC32("123456789") must be
    // 0xCBF43926. Verified indirectly here by writing that exact ASCII
    // string as a stored entry and reading the CRC back out of the local
    // file header (bytes 14-17).
    const zip = createZip([{ name: 't.txt', content: '123456789' }])
    const view = new DataView(zip.buffer)
    expect(view.getUint32(14, true)).toBe(0xcbf43926)
  })

  it('produces an empty archive (just the EOCD record) for zero entries', () => {
    const zip = createZip([])
    expect(zip.length).toBe(22)
    expect(readZip(zip)).toEqual([])
  })
})
