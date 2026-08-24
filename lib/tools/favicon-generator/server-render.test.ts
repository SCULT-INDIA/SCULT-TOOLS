import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { APPLE_SIZE, PNG_SIZES, renderFaviconSet } from './server-render'

/** A synthetic circle on a transparent background — exercises real alpha compositing. */
async function transparentCircleSource(): Promise<Uint8Array> {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">' +
    '<circle cx="200" cy="200" r="180" fill="#4B20DE"/></svg>'
  return sharp(Buffer.from(svg)).png().toBuffer()
}

/** A fully opaque square — the case that makes shape-masking visible at the corners. */
async function opaqueSquareSource(): Promise<Uint8Array> {
  return sharp({
    create: { width: 300, height: 300, channels: 3, background: '#112233' },
  })
    .png()
    .toBuffer()
}

function pixel(
  data: Buffer,
  info: { width: number; channels: number },
  x: number,
  y: number,
) {
  const idx = (y * info.width + x) * info.channels
  return Array.from(data.subarray(idx, idx + info.channels))
}

describe('renderFaviconSet', () => {
  it('produces a correctly sized, valid PNG for every requested size', async () => {
    const imageBytes = await transparentCircleSource()
    const result = await renderFaviconSet({
      imageBytes,
      shape: 'circle',
      radiusPct: 20,
      pad: 0,
      appleBackground: '#ffffff',
    })
    for (const [size, buf] of [
      [16, result.png16],
      [32, result.png32],
      [48, result.png48],
      [192, result.png192],
      [512, result.png512],
    ] as const) {
      const meta = await sharp(buf).metadata()
      expect(meta.format).toBe('png')
      expect(meta.width).toBe(size)
      expect(meta.height).toBe(size)
      expect(PNG_SIZES).toContain(size)
    }
  })

  it('clips an opaque square source to transparent corners under a circle mask', async () => {
    const imageBytes = await opaqueSquareSource()
    const result = await renderFaviconSet({
      imageBytes,
      shape: 'circle',
      radiusPct: 20,
      pad: 0,
      appleBackground: '#ffffff',
    })
    const { data, info } = await sharp(result.png512)
      .raw()
      .toBuffer({ resolveWithObject: true })
    expect(info.channels).toBe(4)
    expect(pixel(data, info, 2, 2)[3]).toBe(0) // corner: alpha fully clipped
    expect(pixel(data, info, 256, 256)[3]).toBe(255) // centre: still opaque
  })

  it('clips to a rounded rect, leaving corners transparent but edges opaque', async () => {
    const imageBytes = await opaqueSquareSource()
    const result = await renderFaviconSet({
      imageBytes,
      shape: 'rounded',
      radiusPct: 20,
      pad: 0,
      appleBackground: '#ffffff',
    })
    const { data, info } = await sharp(result.png512)
      .raw()
      .toBuffer({ resolveWithObject: true })
    expect(pixel(data, info, 2, 2)[3]).toBe(0) // corner: clipped
    expect(pixel(data, info, 256, 2)[3]).toBe(255) // top edge midpoint: rounded rect still covers it
  })

  it('leaves a square shape entirely unmasked', async () => {
    const imageBytes = await opaqueSquareSource()
    const result = await renderFaviconSet({
      imageBytes,
      shape: 'square',
      radiusPct: 20,
      pad: 0,
      appleBackground: '#ffffff',
    })
    const { data, info } = await sharp(result.png512)
      .raw()
      .toBuffer({ resolveWithObject: true })
    expect(pixel(data, info, 1, 1)[3]).toBe(255) // corner: square never clips
  })

  it('flattens the apple-touch-icon to the given background, with no alpha left', async () => {
    const imageBytes = await transparentCircleSource()
    const result = await renderFaviconSet({
      imageBytes,
      shape: 'circle',
      radiusPct: 20,
      pad: 0,
      appleBackground: '#ff8800',
    })
    const meta = await sharp(result.appleTouchIcon).metadata()
    expect(meta.width).toBe(APPLE_SIZE)
    expect(meta.height).toBe(APPLE_SIZE)
    const { data, info } = await sharp(result.appleTouchIcon)
      .raw()
      .toBuffer({ resolveWithObject: true })
    expect(info.channels).toBe(3) // flatten() drops the alpha channel entirely
    expect(pixel(data, info, 1, 1)).toEqual([0xff, 0x88, 0x00])
  })

  it('respects pad by insetting the source within the tile', async () => {
    const imageBytes = await opaqueSquareSource()
    const padded = await renderFaviconSet({
      imageBytes,
      shape: 'square',
      radiusPct: 0,
      pad: 0.25,
      appleBackground: '#ffffff',
    })
    const { data, info } = await sharp(padded.png512)
      .raw()
      .toBuffer({ resolveWithObject: true })
    // 25% inset on each side of a 512px tile leaves a 128px transparent margin.
    expect(pixel(data, info, 10, 10)[3]).toBe(0)
    expect(pixel(data, info, 256, 256)[3]).toBe(255)
  })

  it('rejects bytes that are not a decodable image', async () => {
    const garbage = new Uint8Array([1, 2, 3, 4, 5])
    await expect(
      renderFaviconSet({
        imageBytes: garbage,
        shape: 'circle',
        radiusPct: 20,
        pad: 0,
        appleBackground: '#ffffff',
      }),
    ).rejects.toThrow()
  })
})
