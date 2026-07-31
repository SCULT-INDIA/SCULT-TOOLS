import { describe, expect, it } from 'vitest'
import {
  buildHtmlSnippet,
  buildIco,
  buildWebmanifest,
  buildZip,
  centerCrop,
  clampGlyphs,
  crc32,
  ICO_SIZES,
  isHexColor,
} from './logic'

const ascii = (text: string): Uint8Array => new TextEncoder().encode(text)

/** Little-endian readers for asserting on raw container bytes. */
function u16(buf: Uint8Array, offset: number): number {
  return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getUint16(offset, true)
}
function u32(buf: Uint8Array, offset: number): number {
  return new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getUint32(offset, true)
}

describe('crc32 — reference vectors', () => {
  it('hashes the empty buffer to 0x00000000', () => {
    expect(crc32(new Uint8Array(0))).toBe(0x00000000)
  })

  it('hashes "123456789" to 0xCBF43926, the standard check value', () => {
    expect(crc32(ascii('123456789'))).toBe(0xcbf43926)
  })

  it('hashes "a" to 0xE8B7BE43', () => {
    expect(crc32(ascii('a'))).toBe(0xe8b7be43)
  })

  it('always returns an unsigned 32-bit value', () => {
    const value = crc32(ascii('The quick brown fox jumps over the lazy dog'))
    expect(value).toBe(0x414fa339)
    expect(value).toBeGreaterThanOrEqual(0)
    expect(Number.isInteger(value)).toBe(true)
  })
})

describe('buildIco — ICONDIR header', () => {
  const png16 = ascii('PNG-SIXTEEN')
  const png32 = ascii('PNG-THIRTYTWO!')
  const png48 = ascii('PNG-FORTYEIGHT!!')

  it('writes reserved=0, type=1 (icon), and the image count', () => {
    const ico = buildIco([
      { size: 16, png: png16 },
      { size: 32, png: png32 },
      { size: 48, png: png48 },
    ])
    expect(u16(ico, 0)).toBe(0) // reserved
    expect(u16(ico, 2)).toBe(1) // 1 = icon, 2 would be cursor
    expect(u16(ico, 4)).toBe(3)
  })

  it('writes width/height bytes, 0 palette, 1 plane, 32bpp per entry', () => {
    const ico = buildIco([
      { size: 16, png: png16 },
      { size: 48, png: png48 },
    ])
    // entry 0 at offset 6
    expect(ico[6]).toBe(16) // width
    expect(ico[7]).toBe(16) // height
    expect(ico[8]).toBe(0) // palette count
    expect(ico[9]).toBe(0) // reserved
    expect(u16(ico, 10)).toBe(1) // colour planes
    expect(u16(ico, 12)).toBe(32) // bits per pixel
    // entry 1 at offset 22
    expect(ico[22]).toBe(48)
    expect(ico[23]).toBe(48)
  })

  it('encodes 256 as 0 in the single-byte dimension fields', () => {
    const ico = buildIco([{ size: 256, png: png16 }])
    expect(ico[6]).toBe(0)
    expect(ico[7]).toBe(0)
  })

  it('offsets start after the directory and sum by payload length', () => {
    const ico = buildIco([
      { size: 16, png: png16 },
      { size: 32, png: png32 },
      { size: 48, png: png48 },
    ])
    const dirEnd = 6 + 16 * 3
    expect(u32(ico, 6 + 8)).toBe(png16.length) // entry 0 byte length
    expect(u32(ico, 6 + 12)).toBe(dirEnd) // entry 0 offset
    expect(u32(ico, 22 + 12)).toBe(dirEnd + png16.length) // entry 1
    expect(u32(ico, 38 + 12)).toBe(dirEnd + png16.length + png32.length) // entry 2
    expect(ico.length).toBe(dirEnd + png16.length + png32.length + png48.length)
  })

  it('stores each PNG payload verbatim at its declared offset', () => {
    const ico = buildIco([
      { size: 16, png: png16 },
      { size: 32, png: png32 },
    ])
    const offset0 = u32(ico, 6 + 12)
    const offset1 = u32(ico, 22 + 12)
    expect(Array.from(ico.slice(offset0, offset0 + png16.length))).toEqual(
      Array.from(png16),
    )
    expect(Array.from(ico.slice(offset1, offset1 + png32.length))).toEqual(
      Array.from(png32),
    )
  })

  it('produces a valid empty container for zero entries instead of throwing', () => {
    const ico = buildIco([])
    expect(ico.length).toBe(6)
    expect(u16(ico, 2)).toBe(1)
    expect(u16(ico, 4)).toBe(0)
  })

  it('exports the classic 16/32/48 ladder', () => {
    expect(ICO_SIZES).toEqual([16, 32, 48])
  })
})

describe('buildZip — STORE-method archive structure', () => {
  const fileA = { name: 'a.txt', data: ascii('hello world') }
  const fileB = { name: 'icons/b.png', data: ascii('123456789') }

  it('starts each member with the PK\\x03\\x04 local header signature', () => {
    const zip = buildZip([fileA, fileB])
    expect(u32(zip, 0)).toBe(0x04034b50)
    const secondLocal = 30 + fileA.name.length + fileA.data.length
    expect(u32(zip, secondLocal)).toBe(0x04034b50)
  })

  it('records method 0 (STORE) with equal compressed/uncompressed sizes', () => {
    const zip = buildZip([fileA])
    expect(u16(zip, 8)).toBe(0) // method
    expect(u32(zip, 18)).toBe(fileA.data.length) // compressed
    expect(u32(zip, 22)).toBe(fileA.data.length) // uncompressed
  })

  it('stamps the correct CRC-32 into the local header', () => {
    const zip = buildZip([fileB])
    expect(u32(zip, 14)).toBe(0xcbf43926) // crc32('123456789')
  })

  it('stores the file name and raw bytes right after the local header', () => {
    const zip = buildZip([fileA])
    expect(u16(zip, 26)).toBe(fileA.name.length)
    expect(Array.from(zip.slice(30, 30 + fileA.name.length))).toEqual(
      Array.from(ascii(fileA.name)),
    )
    const dataStart = 30 + fileA.name.length
    expect(Array.from(zip.slice(dataStart, dataStart + fileA.data.length))).toEqual(
      Array.from(fileA.data),
    )
  })

  it('ends with PK\\x05\\x06 whose offsets locate the PK\\x01\\x02 directory', () => {
    const zip = buildZip([fileA, fileB])
    const eocd = zip.length - 22
    expect(u32(zip, eocd)).toBe(0x06054b50)
    expect(u16(zip, eocd + 8)).toBe(2) // entries on this disk
    expect(u16(zip, eocd + 10)).toBe(2) // entries total

    const cdOffset = u32(zip, eocd + 16)
    const cdSize = u32(zip, eocd + 12)
    expect(u32(zip, cdOffset)).toBe(0x02014b50)
    expect(cdOffset + cdSize).toBe(eocd) // directory runs right up to the EOCD
    expect(cdSize).toBe(46 * 2 + fileA.name.length + fileB.name.length)
  })

  it('points each central record back at its member local header', () => {
    const zip = buildZip([fileA, fileB])
    const cdOffset = u32(zip, zip.length - 22 + 16)
    expect(u32(zip, cdOffset + 42)).toBe(0) // first local header offset
    const record2 = cdOffset + 46 + fileA.name.length
    expect(u32(zip, record2)).toBe(0x02014b50)
    expect(u32(zip, record2 + 42)).toBe(30 + fileA.name.length + fileA.data.length)
  })

  it('is deterministic — same inputs, byte-identical archives', () => {
    expect(buildZip([fileA, fileB])).toEqual(buildZip([fileA, fileB]))
  })
})

describe('snippets', () => {
  it('links the ICO, the 192 PNG, the apple-touch-icon and the manifest', () => {
    const html = buildHtmlSnippet()
    expect(html).toContain('href="/favicon.ico"')
    expect(html).toContain('sizes="192x192" href="/icon-192.png"')
    expect(html).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"')
    expect(html).toContain('rel="manifest" href="/site.webmanifest"')
  })

  it('escapes quotes and backslashes in the app name', () => {
    const manifest = buildWebmanifest('Ravi\'s "Best" C:\\Shop', '#7030f8')
    const parsed = JSON.parse(manifest) as { name: string; theme_color: string }
    expect(parsed.name).toBe('Ravi\'s "Best" C:\\Shop')
    expect(parsed.theme_color).toBe('#7030f8')
  })

  it('declares both manifest icons with their sizes and types', () => {
    const parsed = JSON.parse(buildWebmanifest('Scult', '#ffffff')) as {
      icons: { src: string; sizes: string; type: string }[]
    }
    expect(parsed.icons).toEqual([
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ])
  })

  it('falls back to a safe name and colour on empty/invalid input', () => {
    const parsed = JSON.parse(buildWebmanifest('   ', 'reddish')) as {
      name: string
      theme_color: string
      background_color: string
    }
    expect(parsed.name).toBe('My site')
    expect(parsed.theme_color).toBe('#ffffff')
    expect(parsed.background_color).toBe('#ffffff')
  })

  it('validates hex colours in #rgb and #rrggbb forms only', () => {
    expect(isHexColor('#7030f8')).toBe(true)
    expect(isHexColor('#FFF')).toBe(true)
    expect(isHexColor('7030f8')).toBe(false)
    expect(isHexColor('#7030f')).toBe(false)
    expect(isHexColor('rgb(0,0,0)')).toBe(false)
  })
})

describe('centerCrop — square-crop geometry', () => {
  it('crops a landscape image to a centred square', () => {
    expect(centerCrop(200, 100)).toEqual({ sx: 50, sy: 0, size: 100 })
  })

  it('crops a portrait image to a centred square', () => {
    expect(centerCrop(100, 300)).toEqual({ sx: 0, sy: 100, size: 100 })
  })

  it('leaves a square image untouched', () => {
    expect(centerCrop(512, 512)).toEqual({ sx: 0, sy: 0, size: 512 })
  })

  it('floors odd leftovers to integer pixel offsets', () => {
    expect(centerCrop(101, 100)).toEqual({ sx: 0, sy: 0, size: 100 })
    expect(centerCrop(103, 100)).toEqual({ sx: 1, sy: 0, size: 100 })
  })

  it('returns size 0 for unusable dimensions instead of throwing', () => {
    expect(centerCrop(0, 100).size).toBe(0)
    expect(centerCrop(-5, 100).size).toBe(0)
    expect(centerCrop(Number.NaN, 100).size).toBe(0)
    expect(centerCrop(100, Number.POSITIVE_INFINITY).size).toBe(0)
  })
})

describe('clampGlyphs — grapheme-aware trimming', () => {
  it('trims plain text to the glyph budget', () => {
    expect(clampGlyphs('abcd', 3)).toBe('abc')
    expect(clampGlyphs('ab', 3)).toBe('ab')
  })

  it('counts a surrogate-pair emoji as one glyph, not two', () => {
    expect(clampGlyphs('\u{1F680}\u{1F680}\u{1F680}\u{1F680}', 3)).toBe(
      '\u{1F680}\u{1F680}\u{1F680}',
    )
  })

  it('keeps a multi-code-point flag emoji intact under Intl.Segmenter', () => {
    // 🇮🇳 is two regional-indicator code points forming one grapheme.
    expect(clampGlyphs('\u{1F1EE}\u{1F1F3}X', 1)).toBe('\u{1F1EE}\u{1F1F3}')
  })

  it('returns empty for a non-positive budget', () => {
    expect(clampGlyphs('abc', 0)).toBe('')
    expect(clampGlyphs('abc', -1)).toBe('')
  })
})
