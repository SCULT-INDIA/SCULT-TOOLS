import sharp from 'sharp'
import { centerCrop } from './logic'

/**
 * Server-side rasterisation for the favicon generator's image mode — the
 * MCP tool's equivalent of the browser component's `<canvas>` drawing
 * (`drawImageMaster`/`scaleTo` in FaviconGenerator.tsx). Deliberately a
 * sibling to logic.ts rather than an addition to it: logic.ts's own
 * docblock guarantees "no DOM, no I/O", and this file's whole job is I/O
 * (decoding arbitrary image bytes) plus a real native dependency (sharp).
 *
 * Text/letter/emoji mode is NOT implemented here on purpose. The browser
 * version measures and optically centres glyphs with `CanvasRenderingContext2D
 * .measureText`, which has no server equivalent; an SVG-plus-`<text>`
 * fallback would depend on whatever font files happen to be present on the
 * deployment host, which a serverless function cannot guarantee — shipping
 * that would risk silently blank or tofu'd glyphs in production. Image mode
 * has no such dependency: it is pure decode/crop/resize/composite, which
 * sharp does deterministically regardless of environment.
 */

const MASTER = 512
export const APPLE_SIZE = 180
export const PNG_SIZES = [16, 32, 48, 192, 512] as const

export type TileShape = 'square' | 'rounded' | 'circle'

export interface RenderFaviconInput {
  readonly imageBytes: Uint8Array
  readonly shape: TileShape
  /** 0-50, ignored for 'square' and 'circle'. */
  readonly radiusPct: number
  /** 0-0.4 fraction of the tile inset on each side. */
  readonly pad: number
  /** Hex colour used to flatten transparency for the apple-touch-icon. */
  readonly appleBackground: string
}

export interface FaviconRenderResult {
  readonly png16: Buffer
  readonly png32: Buffer
  readonly png48: Buffer
  readonly png192: Buffer
  readonly png512: Buffer
  readonly appleTouchIcon: Buffer
}

function shapeMaskSvg(shape: TileShape, radiusPct: number): string | undefined {
  if (shape === 'square') return undefined
  const body =
    shape === 'circle'
      ? `<circle cx="${MASTER / 2}" cy="${MASTER / 2}" r="${MASTER / 2}" fill="#fff"/>`
      : `<rect width="${MASTER}" height="${MASTER}" rx="${MASTER * (radiusPct / 100)}" fill="#fff"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MASTER}" height="${MASTER}">${body}</svg>`
}

/**
 * Builds the 512px transparent master tile: the source image, centre-cropped
 * to a square, resized into the padded inset box, and — for non-square
 * shapes — clipped to that shape via a `dest-in` mask composite (the sharp
 * equivalent of the canvas version's `ctx.clip()`).
 */
async function buildMaster(input: RenderFaviconInput): Promise<Buffer> {
  const decoded = sharp(Buffer.from(input.imageBytes))
  const metadata = await decoded.metadata()
  const width = metadata.width ?? 0
  const height = metadata.height ?? 0
  const crop = centerCrop(width, height)
  if (crop.size <= 0) {
    throw new Error(
      'Could not read that image — it may be corrupt or an unsupported format.',
    )
  }

  const inset = Math.round(MASTER * input.pad)
  const box = MASTER - inset * 2
  const cropped = await decoded
    .extract({ left: crop.sx, top: crop.sy, width: crop.size, height: crop.size })
    .resize(box, box)
    .ensureAlpha()
    .png()
    .toBuffer()

  const withInset = await sharp({
    create: {
      width: MASTER,
      height: MASTER,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: cropped, left: inset, top: inset }])
    .png()
    .toBuffer()

  const mask = shapeMaskSvg(input.shape, input.radiusPct)
  if (mask === undefined) return withInset

  return sharp(withInset)
    .composite([{ input: Buffer.from(mask), blend: 'dest-in' }])
    .png()
    .toBuffer()
}

/** Renders every size the favicon set needs from one 512px master. */
export async function renderFaviconSet(
  input: RenderFaviconInput,
): Promise<FaviconRenderResult> {
  const master = await buildMaster(input)
  const [png16, png32, png48, png192, png512, appleTouchIcon] = await Promise.all([
    sharp(master).resize(16, 16).png().toBuffer(),
    sharp(master).resize(32, 32).png().toBuffer(),
    sharp(master).resize(48, 48).png().toBuffer(),
    sharp(master).resize(192, 192).png().toBuffer(),
    sharp(master).resize(512, 512).png().toBuffer(),
    sharp(master)
      .resize(APPLE_SIZE, APPLE_SIZE)
      .flatten({ background: input.appleBackground })
      .png()
      .toBuffer(),
  ])
  return { png16, png32, png48, png192, png512, appleTouchIcon }
}
