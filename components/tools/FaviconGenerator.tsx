'use client'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  LayoutGrid,
  RotateCw,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  DropZone,
  SegmentButton,
  StatusBar,
  ToolbarGroup,
  ToolToolbar,
} from '@/components/tools/workspace'
import { trackToolEvent } from '@/lib/analytics'
import {
  buildHtmlSnippet,
  buildIco,
  buildWebmanifest,
  buildZip,
  centerCrop,
  clampGlyphs,
  FAVICON_MAX_SOURCE_BYTES,
  ICO_SIZES,
  MAX_TEXT_GLYPHS,
} from '@/lib/tools/favicon-generator/logic'
import {
  formatContrastRatio,
  hexContrastRatio,
  normalizeHexColor,
} from '@/lib/tools/shared/color'

/**
 * Favicon generator — three floating cards stacked on the page background,
 * top to bottom: Source (with the "Start from" toolbar as its header strip),
 * Live Preview with a nested Customize block, and Generated Favicon with the
 * export actions. A single centred privacy line closes the page.
 * Research brief: docs/research/favicon-generator.md
 *
 * Layout and control decisions (wireframe-driven, rendered in brand tokens):
 *   - Three separate cards, not one continuous bordered panel: each stage of
 *     the flow — feed it a source, watch the previews, take the files — reads
 *     as its own unit, and the gaps between cards do the separating that
 *     border-b rows used to.
 *   - "Start from" stays in the source card's toolbar — it changes what the
 *     whole tool is doing. Everything that styles the RESULT (background,
 *     shape, padding, corner radius) lives in Customize, nested inside the
 *     preview card so the controls sit right next to the pixels they change.
 *   - Background is a swatch row (transparent / white / black / brand violet /
 *     yellow / peach / custom picker) driving the same per-source colour state
 *     the colour fields always edited. The transparent swatch is hidden on the
 *     image source, where transparency is already preserved everywhere except
 *     the apple-touch-icon.
 *   - Corner radius is a real slider, 0–50% of the tile edge, backing the
 *     rounded shape. Circle ignores it; dragging it while square is selected
 *     switches to rounded, because asking for a radius implies rounding.
 *   - Padding is a 0–24% slider applied on every source: the image master
 *     insets its drawing box, the text and emoji masters shrink the glyph box
 *     by the same fraction.
 *   - The preview keeps the light AND dark browser-tab mocks (a dark mark
 *     vanishes on a dark tab strip, and no competitor shows you that before
 *     you download) and the 16/32/48 native-resolution strip — both survive
 *     the redesign because they answer questions the wireframe didn't ask.
 *
 * `logic.ts` is untouched. The ICO encoder, the STORE-method ZIP writer with real
 * CRC-32, the crop maths, the grapheme clamp and the snippet builders were
 * already correct and tested. What lives here is the part that genuinely needs a
 * browser: decoding the source, drawing the 512px master, stepped-halving it
 * down to each target size, and handing blobs to a download anchor.
 *
 * Nothing is uploaded at any point — there is no server route to upload to, so
 * the tool also works with the network disconnected.
 */

type SourceTab = 'image' | 'text' | 'emoji'
type TileShape = 'square' | 'rounded' | 'circle'

interface LoadedImage {
  readonly img: HTMLImageElement
  readonly name: string
  readonly width: number
  readonly height: number
}

interface GeneratedSet {
  readonly ico: Blob
  readonly png192: Blob
  readonly png512: Blob
  readonly apple: Blob
  /** Object URLs for the preview stack; revoked when replaced. */
  readonly previews: {
    readonly p16: string
    readonly p32: string
    readonly p48: string
    /** Same asset as `png192` — reused for the Android and Windows taskbar mocks. */
    readonly p192: string
    readonly apple: string
  }
}

const MASTER = 512
const APPLE_SIZE = 180

/** Below this the letter and the tile merge into one grey smudge at 16px. */
const MIN_TEXT_CONTRAST = 3

/** Default corner radius, as a percentage of the tile edge — 20% matches iOS. */
const DEFAULT_RADIUS_PCT = 20

const TABS: readonly { readonly value: SourceTab; readonly label: string }[] = [
  { value: 'image', label: 'Image' },
  { value: 'text', label: 'Text' },
  { value: 'emoji', label: 'Emoji' },
]

/**
 * Shape buttons draw their own glyph — a small outlined square whose
 * border-radius mirrors the tile treatment it applies. Rounded first: it is
 * the default and the one the corner-radius slider drives.
 */
const SHAPES: readonly {
  readonly value: TileShape
  readonly label: string
  readonly glyph: string
  readonly title: string
}[] = [
  {
    value: 'rounded',
    label: 'Rounded corners',
    glyph: 'rounded-[5px]',
    title: 'Rounded corners — radius set by the Corner Radius slider',
  },
  {
    value: 'circle',
    label: 'Circle',
    glyph: 'rounded-full',
    title: 'Clipped to a circle — ignores corner radius',
  },
  {
    value: 'square',
    label: 'Square',
    glyph: 'rounded-none',
    title: 'Sharp corners, fills the whole tile',
  },
]

/**
 * The swatch row's preset backgrounds: white and black as the safe defaults,
 * then the brand violet, CTA yellow and peach from the site palette. The
 * custom `<input type="color">` at the end of the row covers everything else.
 */
const BG_SWATCHES: readonly { readonly hex: string; readonly name: string }[] = [
  { hex: '#ffffff', name: 'White' },
  { hex: '#000000', name: 'Black' },
  { hex: '#7030f8', name: 'Violet' },
  { hex: '#fac44b', name: 'Yellow' },
  { hex: '#ffddc0', name: 'Peach' },
]

const QUICK_EMOJI: readonly string[] = ['🚀', '⭐', '🔥', '💡', '🎯', '🛠️', '💜', '🌿']

const ACCEPT = 'image/png,image/jpeg,image/svg+xml,image/webp'
const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'])
const ACCEPTED_EXT = /\.(png|jpe?g|svg|webp)$/i

/**
 * Imitation browser chrome. These hex values are copied from real Chrome tab
 * strips and deliberately sit outside the brand palette: the whole point of the
 * mock is to show the icon against the colours it will actually meet, and
 * substituting our own tokens would make the preview reassuring but wrong. The
 * same justification covers every OS-imitating hex inside the platform mocks —
 * Safari's grey strip, the phone wallpaper gradients, Windows taskbar blue.
 */
const CHROME = {
  light: {
    frame: 'bg-[#dee1e6]',
    tab: 'bg-white',
    text: 'text-[#3c4043]',
    toolbar: 'bg-white',
  },
  dark: {
    frame: 'bg-[#202124]',
    tab: 'bg-[#35363a]',
    text: 'text-[#e8eaed]',
    toolbar: 'bg-[#35363a]',
  },
} as const

/** macOS traffic lights — shared by the Chrome and Safari mocks. */
function TrafficLights() {
  return (
    <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
      <span className="size-1.5 rounded-full bg-[#ff5f57]" />
      <span className="size-1.5 rounded-full bg-[#febc2e]" />
      <span className="size-1.5 rounded-full bg-[#28c840]" />
    </span>
  )
}

const DEFAULT_TEXT = 'S'
const DEFAULT_TEXT_BG = '#7030f8'
const DEFAULT_TEXT_FG = '#ffffff'
const DEFAULT_EMOJI = '🚀'
const DEFAULT_NAME = 'Scult'

/** Checkerboard for the "transparent" swatch — pure CSS, no asset. */
const CHECKERBOARD: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%),linear-gradient(45deg,#ddd 25%,#fff 25%,#fff 75%,#ddd 75%)',
  backgroundSize: '10px 10px',
  backgroundPosition: '0 0,5px 5px',
}

function formatKb(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
}

/**
 * A colour that is safe to hand to `<input type="color">` and to canvas
 * `fillStyle`. Mid-typing a hex the raw value is invalid — an unnormalised value
 * makes React fight the swatch, and canvas silently keeps whatever colour it had
 * last, which is worse because the PNG then disagrees with the picker. Holding
 * the fallback for one keystroke is the honest behaviour.
 */
function safeColor(value: string, fallback: string): string {
  return normalizeHexColor(value) ?? fallback
}

/** The site's display face, as next/font published it on :root. */
function displayFontFamily(): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-fraunces')
    .trim()
  return value !== '' ? value : 'Georgia, serif'
}

/** How long a slow display face may hold up the first favicon. */
const FONT_WAIT_MS = 1500

/**
 * Waits until the display face is usable, then gives up and draws anyway.
 *
 * Deliberately NOT `document.fonts.ready`, which the previous version awaited:
 * that promise resolves only once the whole document's font activity has settled,
 * and on a page where anything keeps loading faces it can stay pending
 * indefinitely — measured on this route, it was still pending after 3.7s, which
 * left the text source rendering nothing at all on first paint. `fonts.load` asks
 * for one specific face and resolves as soon as that face is available. The
 * timeout is the backstop: a slow font is a reason to bake in the fallback serif,
 * never a reason to show an empty tool.
 */
async function waitForDisplayFont(family: string): Promise<void> {
  try {
    await Promise.race([
      document.fonts.load(`600 340px ${family}`),
      new Promise<void>((resolve) => {
        setTimeout(resolve, FONT_WAIT_MS)
      }),
    ])
  } catch {
    // A face that refuses to load must not take the whole tool down with it.
  }
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) reject(new Error('toBlob returned null'))
      else resolve(blob)
    }, 'image/png')
  })
}

/**
 * Scales the master down to `size`, halving repeatedly first: a single bilinear
 * pass from 512 to 16 averages 32x32 source pixels per output pixel and turns
 * edges to grey mush, while stepped halving keeps each pass inside the sampler's
 * quality window. `bg` flattens transparency (apple-touch-icon).
 */
function scaleTo(
  master: HTMLCanvasElement,
  size: number,
  bg?: string,
): HTMLCanvasElement {
  let src: HTMLCanvasElement = master
  while (src.width / 2 >= size * 2) {
    const half = document.createElement('canvas')
    half.width = src.width / 2
    half.height = src.height / 2
    const hctx = half.getContext('2d')
    if (hctx === null) break
    hctx.imageSmoothingEnabled = true
    hctx.imageSmoothingQuality = 'high'
    hctx.drawImage(src, 0, 0, half.width, half.height)
    src = half
  }
  const out = document.createElement('canvas')
  out.width = size
  out.height = size
  const ctx = out.getContext('2d')
  if (ctx === null) return out
  if (bg !== undefined) {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, size, size)
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(src, 0, 0, size, size)
  return out
}

/**
 * The tile outline, as a path — filled for text, used as a clip for an image.
 * `radiusPct` (0–50) is the rounded shape's corner radius as a percentage of
 * the tile edge; square and circle ignore it.
 */
function shapePath(
  ctx: CanvasRenderingContext2D,
  shape: TileShape,
  radiusPct: number,
): void {
  ctx.beginPath()
  if (shape === 'circle') {
    ctx.arc(MASTER / 2, MASTER / 2, MASTER / 2, 0, Math.PI * 2)
  } else if (shape === 'rounded') {
    ctx.roundRect(0, 0, MASTER, MASTER, MASTER * (radiusPct / 100))
  } else {
    ctx.rect(0, 0, MASTER, MASTER)
  }
}

function fillShape(
  ctx: CanvasRenderingContext2D,
  shape: TileShape,
  color: string,
  radiusPct: number,
): void {
  ctx.fillStyle = color
  shapePath(ctx, shape, radiusPct)
  ctx.fill()
}

function newMaster(): {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
} {
  const canvas = document.createElement('canvas')
  canvas.width = MASTER
  canvas.height = MASTER
  const ctx = canvas.getContext('2d')
  if (ctx !== null) {
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
  }
  return { canvas, ctx }
}

/** Centres glyphs optically using the measured ink box, not the em box. */
function drawCentredGlyphs(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: (px: number) => string,
  basePx: number,
  maxWidth: number,
): void {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = font(basePx)
  const measured = ctx.measureText(text).width
  const px =
    measured > maxWidth && measured > 0
      ? Math.max(8, Math.floor((basePx * maxWidth) / measured))
      : basePx
  ctx.font = font(px)
  const m = ctx.measureText(text)
  const y = MASTER / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2
  ctx.fillText(text, MASTER / 2, y)
}

function drawImageMaster(
  source: LoadedImage,
  shape: TileShape,
  pad: number,
  radiusPct: number,
): HTMLCanvasElement | null {
  const { canvas, ctx } = newMaster()
  if (ctx === null) return null
  if (shape !== 'square') {
    shapePath(ctx, shape, radiusPct)
    ctx.clip()
  }
  const inset = Math.round(MASTER * pad)
  const box = MASTER - inset * 2
  const crop = centerCrop(source.width, source.height)
  if (crop.size > 0) {
    ctx.drawImage(
      source.img,
      crop.sx,
      crop.sy,
      crop.size,
      crop.size,
      inset,
      inset,
      box,
      box,
    )
  } else {
    // An SVG without width/height reports 0x0; let the browser rasterise it
    // straight into the square instead.
    ctx.drawImage(source.img, inset, inset, box, box)
  }
  return canvas
}

function drawTextMaster(
  text: string,
  bg: string | null,
  fg: string,
  shape: TileShape,
  family: string,
  pad: number,
  radiusPct: number,
): HTMLCanvasElement | null {
  const { canvas, ctx } = newMaster()
  if (ctx === null) return null
  // A null background means "no tile" — the letter floats on transparency and
  // there is no shape to draw, so the glyph gets almost the whole square.
  if (bg !== null) fillShape(ctx, shape, bg, radiusPct)
  ctx.fillStyle = fg
  const shrink = 1 - pad * 2
  const maxWidth =
    bg === null
      ? 460
      : shape === 'square'
        ? 410
        : shape === 'rounded'
          ? // A bigger radius eats more of the corners, so the safe glyph box
            // narrows from the square's width toward the circle's.
            410 - (radiusPct / 50) * 80
          : 330
  drawCentredGlyphs(
    ctx,
    text,
    (px) => `600 ${px}px ${family}`,
    Math.max(8, Math.round(340 * shrink)),
    maxWidth * shrink,
  )
  return canvas
}

function drawEmojiMaster(
  emoji: string,
  bg: string | null,
  shape: TileShape,
  pad: number,
  radiusPct: number,
): HTMLCanvasElement | null {
  const { canvas, ctx } = newMaster()
  if (ctx === null) return null
  if (bg !== null) fillShape(ctx, shape, bg, radiusPct)
  ctx.fillStyle = '#000000'
  const shrink = 1 - pad * 2
  drawCentredGlyphs(
    ctx,
    emoji,
    (px) => `${px}px serif`,
    Math.max(8, Math.round(400 * shrink)),
    (bg === null ? 460 : 400) * shrink,
  )
  return canvas
}

export function FaviconGenerator() {
  // Image is the default: uploading a logo is the primary use case, and the
  // DropZone's upload hero (not a blank canvas) is what a first paint shows.
  const [tab, setTab] = useState<SourceTab>('image')
  const [shape, setShape] = useState<TileShape>('rounded')
  const [radiusPct, setRadiusPct] = useState(DEFAULT_RADIUS_PCT)

  const [source, setSource] = useState<LoadedImage | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [imageBg, setImageBg] = useState('#ffffff')
  const [pad, setPad] = useState(0)

  const [text, setText] = useState(DEFAULT_TEXT)
  /** null = no tile: the letter floats on transparency. */
  const [textBg, setTextBg] = useState<string | null>(DEFAULT_TEXT_BG)
  const [textFg, setTextFg] = useState(DEFAULT_TEXT_FG)

  const [emoji, setEmoji] = useState(DEFAULT_EMOJI)
  const [emojiTransparent, setEmojiTransparent] = useState(true)
  const [emojiBg, setEmojiBg] = useState('#ffffff')

  const [appName, setAppName] = useState(DEFAULT_NAME)
  const [generated, setGenerated] = useState<GeneratedSet | null>(null)
  const [building, setBuilding] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [savedFile, setSavedFile] = useState<string | null>(null)

  const sourceUrlRef = useRef<string | null>(null)
  const previewUrlsRef = useRef<readonly string[]>([])
  const pendingUrlsRef = useRef<Set<string>>(new Set())

  /** The colour transparency is flattened onto for the apple-touch-icon. */
  const appleBackground = safeColor(
    tab === 'image'
      ? imageBg
      : tab === 'text'
        ? (textBg ?? '#ffffff')
        : emojiTransparent
          ? '#ffffff'
          : emojiBg,
    '#ffffff',
  )

  const htmlSnippet = useMemo(() => buildHtmlSnippet(), [])
  const manifestSnippet = useMemo(
    () => buildWebmanifest(appName, appleBackground),
    [appName, appleBackground],
  )
  const manifestBlob = useMemo(
    () => new Blob([manifestSnippet], { type: 'application/manifest+json' }),
    [manifestSnippet],
  )

  const textRatio = textBg === null ? null : hexContrastRatio(textFg, textBg)
  const textLegible = textRatio === null || textRatio >= MIN_TEXT_CONTRAST

  // Rebuild the whole set whenever anything about the source changes. Canvas work
  // at these sizes is single-digit milliseconds, so per-keystroke regeneration
  // costs less than the debounce would.
  useEffect(() => {
    let cancelled = false

    async function run(): Promise<void> {
      const ready =
        tab === 'image'
          ? source !== null
          : tab === 'text'
            ? text.trim() !== ''
            : emoji.trim() !== ''
      if (!ready) {
        setGenerated(null)
        setBuilding(false)
        return
      }
      setBuilding(true)
      setGenError(null)
      try {
        // Text is drawn with the display face — wait for that one face, or the
        // first paint would bake the fallback serif into the PNGs.
        const family = tab === 'text' ? displayFontFamily() : ''
        if (tab === 'text') await waitForDisplayFont(family)
        if (cancelled) return

        const master =
          tab === 'image' && source !== null
            ? drawImageMaster(source, shape, pad, radiusPct)
            : tab === 'text'
              ? drawTextMaster(
                  text.trim(),
                  textBg === null ? null : safeColor(textBg, DEFAULT_TEXT_BG),
                  safeColor(textFg, DEFAULT_TEXT_FG),
                  shape,
                  family,
                  pad,
                  radiusPct,
                )
              : drawEmojiMaster(
                  emoji.trim(),
                  emojiTransparent ? null : safeColor(emojiBg, '#ffffff'),
                  shape,
                  pad,
                  radiusPct,
                )
        if (master === null) {
          setGenError('This browser refused a drawing canvas. Try a current browser.')
          return
        }

        const [png16, png32, png48, png192, png512, apple] = await Promise.all([
          canvasToPngBlob(scaleTo(master, 16)),
          canvasToPngBlob(scaleTo(master, 32)),
          canvasToPngBlob(scaleTo(master, 48)),
          canvasToPngBlob(scaleTo(master, 192)),
          canvasToPngBlob(scaleTo(master, MASTER)),
          canvasToPngBlob(scaleTo(master, APPLE_SIZE, appleBackground)),
        ])
        const [buf16, buf32, buf48] = await Promise.all([
          png16.arrayBuffer(),
          png32.arrayBuffer(),
          png48.arrayBuffer(),
        ])
        const ladder = [...ICO_SIZES]
        const ico = new Blob(
          [
            buildIco([
              { size: ladder[0] ?? 16, png: new Uint8Array(buf16) },
              { size: ladder[1] ?? 32, png: new Uint8Array(buf32) },
              { size: ladder[2] ?? 48, png: new Uint8Array(buf48) },
            ]),
          ],
          { type: 'image/x-icon' },
        )
        if (cancelled) return

        for (const url of previewUrlsRef.current) URL.revokeObjectURL(url)
        const previews = {
          p16: URL.createObjectURL(png16),
          p32: URL.createObjectURL(png32),
          p48: URL.createObjectURL(png48),
          p192: URL.createObjectURL(png192),
          apple: URL.createObjectURL(apple),
        }
        previewUrlsRef.current = [
          previews.p16,
          previews.p32,
          previews.p48,
          previews.p192,
          previews.apple,
        ]
        setGenerated({ ico, png192, png512, apple, previews })
      } catch {
        if (!cancelled) {
          setGenError(
            'The favicon set could not be rendered. If the source is an SVG, check it does not reference external images.',
          )
        }
      } finally {
        if (!cancelled) setBuilding(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [
    tab,
    source,
    shape,
    radiusPct,
    pad,
    text,
    textBg,
    textFg,
    emoji,
    emojiTransparent,
    emojiBg,
    appleBackground,
  ])

  // Release every object URL when the component goes away.
  useEffect(() => {
    const pending = pendingUrlsRef.current
    return () => {
      for (const url of previewUrlsRef.current) URL.revokeObjectURL(url)
      previewUrlsRef.current = []
      if (sourceUrlRef.current !== null) URL.revokeObjectURL(sourceUrlRef.current)
      for (const url of pending) URL.revokeObjectURL(url)
      pending.clear()
    }
  }, [])

  useEffect(() => {
    if (savedFile === null) return
    const t = setTimeout(() => setSavedFile(null), 2500)
    return () => clearTimeout(t)
  }, [savedFile])

  async function loadFile(file: File): Promise<void> {
    setImageError(null)
    if (!ACCEPTED_TYPES.has(file.type) && !ACCEPTED_EXT.test(file.name)) {
      setImageError('That file type is not supported — use a PNG, JPG, WebP or SVG.')
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    try {
      await img.decode()
    } catch {
      URL.revokeObjectURL(url)
      setImageError(
        'That file could not be decoded as an image. Re-export it and try again.',
      )
      return
    }
    if (sourceUrlRef.current !== null) URL.revokeObjectURL(sourceUrlRef.current)
    sourceUrlRef.current = url
    setSource({
      img,
      name: file.name,
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
  }

  function saveBlob(blob: Blob, filename: string): void {
    const objectUrl = URL.createObjectURL(blob)
    pendingUrlsRef.current.add(objectUrl)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = filename
    anchor.click()
    setSavedFile(filename)
    // Revoking in the same tick cancels the download in some WebKit builds.
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl)
      pendingUrlsRef.current.delete(objectUrl)
    }, 10_000)
  }

  async function downloadZip(): Promise<void> {
    if (generated === null) return
    const [ico, png192, png512, apple] = await Promise.all([
      generated.ico.arrayBuffer(),
      generated.png192.arrayBuffer(),
      generated.png512.arrayBuffer(),
      generated.apple.arrayBuffer(),
    ])
    const zip = buildZip([
      { name: 'favicon.ico', data: new Uint8Array(ico) },
      { name: 'icon-192.png', data: new Uint8Array(png192) },
      { name: 'icon-512.png', data: new Uint8Array(png512) },
      { name: 'apple-touch-icon.png', data: new Uint8Array(apple) },
      { name: 'site.webmanifest', data: new TextEncoder().encode(manifestSnippet) },
    ])
    saveBlob(new Blob([zip], { type: 'application/zip' }), 'favicon-set.zip')
  }

  function reset(): void {
    setTab('image')
    setShape('rounded')
    setRadiusPct(DEFAULT_RADIUS_PCT)
    setSource(null)
    setImageError(null)
    setImageBg('#ffffff')
    setPad(0)
    setText(DEFAULT_TEXT)
    setTextBg(DEFAULT_TEXT_BG)
    setTextFg(DEFAULT_TEXT_FG)
    setEmoji(DEFAULT_EMOJI)
    setEmojiTransparent(true)
    setEmojiBg('#ffffff')
    setAppName(DEFAULT_NAME)
    setGenError(null)
  }

  /** The active source's background, as the swatch row sees it. */
  const swatchValue =
    tab === 'image'
      ? imageBg
      : tab === 'text'
        ? textBg
        : emojiTransparent
          ? null
          : emojiBg

  function selectBackground(next: string | null): void {
    if (tab === 'image') {
      // The transparent swatch is hidden on this tab, so `next` is always a
      // colour here — but never let a null slip into the flatten colour.
      if (next !== null) setImageBg(next)
    } else if (tab === 'text') {
      setTextBg(next)
    } else if (next === null) {
      setEmojiTransparent(true)
    } else {
      setEmojiTransparent(false)
      setEmojiBg(next)
    }
  }

  const label = appName.trim() === '' ? 'My site' : appName.trim()

  const files: readonly {
    readonly name: string
    readonly blob: Blob
    readonly note: string
    readonly dims: string
    readonly preview?: string
  }[] =
    generated === null
      ? []
      : [
          {
            name: 'favicon.ico',
            blob: generated.ico,
            note: 'Browser tab icon',
            dims: '16×16 · 32×32 · 48×48',
            preview: generated.previews.p32,
          },
          {
            name: 'apple-touch-icon.png',
            blob: generated.apple,
            note: 'iOS, opaque',
            dims: `${APPLE_SIZE}×${APPLE_SIZE}`,
            preview: generated.previews.apple,
          },
          {
            name: 'icon-192.png',
            blob: generated.png192,
            note: 'Android home screen',
            dims: '192×192',
            preview: generated.previews.p192,
          },
          {
            name: 'icon-512.png',
            blob: generated.png512,
            note: 'PWA install + splash',
            dims: '512×512',
            // No separate 512px preview blob is generated — the 192px preview
            // scales up fine for a 32–36px thumbnail.
            preview: generated.previews.p192,
          },
          {
            name: 'site.webmanifest',
            blob: manifestBlob,
            note: 'Names and links the icons',
            dims: 'JSON',
          },
        ]

  // First four are the formats every browser/OS actually asks for; the rest
  // (today just the manifest) go under "And more" rather than crowding the row.
  const primaryFiles = files.slice(0, 4)
  const moreFiles = files.slice(4)

  const totalBytes = files.reduce((sum, f) => sum + f.blob.size, 0)

  const waitingMessage =
    tab === 'image'
      ? 'Choose an image above and the live preview and all five files fill in below.'
      : tab === 'text'
        ? 'Type at least one character above. One or two initials stay readable at 16px; three rarely do.'
        : 'Pick an emoji above and the whole set renders below.'

  const sourceLabel = tab === 'image' ? 'Image' : tab === 'text' ? 'Text' : 'Emoji'

  return (
    <div className="flex flex-col gap-6">
      {/* ── Card 1: the source itself — a logo to drop in, characters to
          typeset, or an emoji. Everything that changes how the result is
          STYLED lives in Customize inside the preview card below. */}
      <div className="overflow-hidden rounded-panel border border-line bg-cream">
        <div className="border-line border-b bg-offwhite">
          <ToolToolbar
            actions={
              <button
                type="button"
                onClick={() => {
                  reset()
                  trackToolEvent('favicon-generator', 'reset')
                }}
                className="btn-brutal btn-brutal-sm btn-white"
              >
                Reset
              </button>
            }
          >
            <ToolbarGroup label="Start from">
              {TABS.map(({ value, label: tabLabel }) => (
                <SegmentButton
                  key={value}
                  active={tab === value}
                  onClick={() => setTab(value)}
                >
                  {tabLabel}
                </SegmentButton>
              ))}
            </ToolbarGroup>
          </ToolToolbar>
        </div>

        <section aria-label={`${sourceLabel} source`} className="p-4 sm:p-6">
          <div className="flex flex-col gap-5">
            {tab === 'image' ? (
              <div>
                <DropZone
                  accept={ACCEPT}
                  maxBytes={FAVICON_MAX_SOURCE_BYTES}
                  onFile={(file) => {
                    void loadFile(file)
                  }}
                  title="Upload your logo"
                  hint="PNG, JPG, WebP or SVG · up to 10 MB · centre-cropped to a square"
                  action="Drag & drop or click to upload"
                  preview={
                    source === null
                      ? undefined
                      : {
                          src: sourceUrlRef.current ?? '',
                          name: source.name,
                          meta:
                            source.width > 0
                              ? `${source.width}×${source.height}px`
                              : undefined,
                        }
                  }
                />
                {imageError !== null ? (
                  <p className="mt-2 flex items-start gap-1.5 font-medium text-[14px] text-ink">
                    <TriangleAlert
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {imageError}
                  </p>
                ) : null}
              </div>
            ) : null}

            {tab === 'text' ? (
              <div>
                <label className="label" htmlFor="fav-text">
                  Characters (1–{MAX_TEXT_GLYPHS})
                </label>
                <input
                  id="fav-text"
                  className="field"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={text}
                  onChange={(e) => setText(clampGlyphs(e.target.value, MAX_TEXT_GLYPHS))}
                  aria-describedby="fav-text-hint"
                />
                <p className="hint mt-1.5" id="fav-text-hint">
                  Initials work best, rendered in the site's display serif. One character
                  stays readable even at 16px.
                </p>
              </div>
            ) : null}

            {tab === 'emoji' ? (
              <div>
                <label className="label" htmlFor="fav-emoji">
                  Emoji
                </label>
                <input
                  id="fav-emoji"
                  className="field"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={emoji}
                  onChange={(e) => setEmoji(clampGlyphs(e.target.value, 1))}
                  aria-describedby="fav-emoji-hint"
                />
                <p className="hint mt-1.5" id="fav-emoji-hint">
                  Windows key + . or Cmd + Ctrl + Space opens your system's picker.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {QUICK_EMOJI.map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={emoji === value}
                      aria-label={`Use ${value} as the favicon emoji`}
                      onClick={() => setEmoji(value)}
                      className={`min-h-11 min-w-11 rounded-sm border text-[20px] transition-colors ${
                        emoji === value
                          ? 'border-ink bg-violet-100'
                          : 'border-line-grey bg-cream hover:border-ink'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="border-line border-t pt-4">
              <label className="label" htmlFor="fav-app-name">
                Site name
              </label>
              <input
                id="fav-app-name"
                className="field"
                type="text"
                autoComplete="off"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                aria-describedby="fav-app-name-hint"
              />
              <p className="hint mt-1.5" id="fav-app-name-hint">
                Shown in the tab mocks and written into site.webmanifest.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Card 2: Live Preview, ordered by where a favicon actually fails —
          a 16px tab in light AND dark chrome (a dark mark vanishes on a dark
          tab strip), then the platforms every site actually ships to. The
          phone and Windows mocks reuse already-generated PNGs in an
          OS-imitating frame — no new image work. Customize nests inside this
          card so the controls sit next to the pixels they change. */}
      <div className="overflow-hidden rounded-panel border border-line bg-cream">
        <section aria-label="Live preview" className="p-4 sm:p-6">
          <h3 className="text-center font-display font-bold text-[24px] text-ink">
            Live Preview
          </h3>
          <p className="mt-2 text-center">
            <span className="inline-block rounded-pill bg-violet-100 px-3 py-1 font-medium text-[12px] text-violet-700">
              See how your favicon looks everywhere
            </span>
          </p>

          {generated === null ? (
            <div className="mt-5 flex min-h-[7rem] items-center justify-center rounded-card border border-dashed border-line-grey bg-offwhite p-6">
              <p className="max-w-[42ch] text-center text-[14px] text-ink-subtle leading-6">
                {building
                  ? 'Rendering the 512px master and scaling it down…'
                  : waitingMessage}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <MockupCard title="Browser Tab">
                  <div className="flex w-full flex-col gap-1.5">
                    {/* Light chrome: tab strip with traffic lights and the
                        active tab, then a toolbar row with nav glyphs and an
                        empty URL pill. */}
                    <div
                      className={`w-full overflow-hidden rounded-md border border-line-grey ${CHROME.light.frame}`}
                    >
                      <div className="flex items-center gap-1.5 px-1.5 pt-1.5">
                        <TrafficLights />
                        <span
                          className={`flex min-w-0 flex-1 items-center gap-1.5 rounded-t-md px-2 py-1 ${CHROME.light.tab}`}
                        >
                          {/* biome-ignore lint/performance/noImgElement: a runtime
                              blob object URL, which next/image cannot optimise —
                              and it must render at exactly 16px, unscaled. */}
                          <img
                            src={generated.previews.p16}
                            width={16}
                            height={16}
                            alt="The 16 pixel favicon in a browser tab — light theme"
                            className="shrink-0"
                          />
                          <span className={`truncate text-[10px] ${CHROME.light.text}`}>
                            {label}
                          </span>
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-1.5 py-1 ${CHROME.light.toolbar}`}
                      >
                        <ArrowLeft
                          className="size-2.5 shrink-0 text-[#5f6368]"
                          aria-hidden="true"
                        />
                        <ArrowRight
                          className="size-2.5 shrink-0 text-[#5f6368]"
                          aria-hidden="true"
                        />
                        <RotateCw
                          className="size-2.5 shrink-0 text-[#5f6368]"
                          aria-hidden="true"
                        />
                        <span className="h-3.5 min-w-0 flex-1 rounded-pill bg-[#f1f3f4]" />
                      </div>
                    </div>
                    {/* Dark chrome: compact strip — the tab check the light
                        mock can't perform, kept from the previous design. */}
                    <div
                      className={`w-full overflow-hidden rounded-md border border-line-grey ${CHROME.dark.frame}`}
                    >
                      <div
                        className={`flex items-center gap-1.5 px-2 py-1.5 ${CHROME.dark.tab}`}
                      >
                        {/* biome-ignore lint/performance/noImgElement: runtime blob object URL, must render at exactly 16px. */}
                        <img
                          src={generated.previews.p16}
                          width={16}
                          height={16}
                          alt="The 16 pixel favicon in a browser tab — dark theme"
                          className="shrink-0"
                        />
                        <span className={`truncate text-[11px] ${CHROME.dark.text}`}>
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                </MockupCard>

                <MockupCard
                  title="Safari Pinned Tab"
                  hint="Safari flattens the icon to a monochrome silhouette — approximated here."
                >
                  <div className="w-full overflow-hidden rounded-md border border-line-grey bg-[#e8e8ed]">
                    <div className="flex items-center gap-1.5 p-1.5">
                      <TrafficLights />
                      <span className="flex shrink-0 items-center justify-center rounded-sm bg-[#d4d4d9] p-1">
                        {/* biome-ignore lint/performance/noImgElement: runtime blob
                            object URL; grayscale filter approximates Safari's
                            monochrome pinned-tab treatment without any new
                            image-processing logic. */}
                        <img
                          src={generated.previews.p16}
                          width={14}
                          height={14}
                          alt="Favicon, approximated as Safari's monochrome pinned-tab silhouette"
                          className="shrink-0 brightness-[0.3] grayscale contrast-150"
                        />
                      </span>
                      <span className="flex min-w-0 flex-1 items-center justify-center rounded-sm bg-[#f5f5f7] px-2 py-1">
                        <span className="truncate font-medium text-[10px] text-[#3c4043]">
                          {label}
                        </span>
                      </span>
                    </div>
                  </div>
                </MockupCard>

                <MockupCard title="iPhone Home Screen">
                  <DeviceFrame
                    photoSrc="/mockups/device-iphone.png"
                    aspect="1024/1536"
                    screenRect={{ left: 25, top: 13.5, width: 50, height: 69.5 }}
                    screenRadius="14%"
                  >
                    {/* The photo's own wallpaper shows through untouched —
                        this box only positions the icon/label/indicator on
                        top of it, it doesn't paint over the screen. */}
                    <div className="relative size-full">
                      {/* App icon + label sit in the upper-middle third, the
                          way a real home screen's first icon row does. The
                          photo's own notch sits just above this box. */}
                      <div className="absolute top-[30%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[6%]">
                        {/* biome-ignore lint/performance/noImgElement: runtime
                            blob object URL, not optimisable by next/image.
                            The 22% radius is the iOS icon mask. */}
                        <img
                          src={generated.previews.apple}
                          width={36}
                          height={36}
                          alt="The apple touch icon on an iOS home screen"
                          className="rounded-[22%] shadow-[0_2px_5px_rgba(0,0,0,0.4)]"
                        />
                        <span className="max-w-[72%] truncate text-[9px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                          {label}
                        </span>
                      </div>
                      {/* Home indicator */}
                      <span className="absolute bottom-[2.5%] left-1/2 h-[3px] w-[28%] -translate-x-1/2 rounded-full bg-white/70" />
                    </div>
                  </DeviceFrame>
                </MockupCard>

                <MockupCard title="Android Home Screen">
                  <DeviceFrame
                    photoSrc="/mockups/device-android.png"
                    aspect="1024/1536"
                    screenRect={{ left: 26, top: 13, width: 48, height: 70 }}
                    screenRadius="7%"
                  >
                    {/* The photo's own wallpaper shows through untouched —
                        this box only positions the icon/label on top of it. */}
                    <div className="relative size-full">
                      {/* Icon + label, same upper-middle third as the iPhone,
                          masked fully round per Android's adaptive-icon look. */}
                      <div className="absolute top-[30%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[6%]">
                        {/* biome-ignore lint/performance/noImgElement: runtime
                            blob object URL — the same 192px PNG already
                            generated for icon-192.png, masked round like an
                            adaptive icon. */}
                        <img
                          src={generated.previews.p192}
                          width={36}
                          height={36}
                          alt="The Android icon on a home screen"
                          className="rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.4)]"
                        />
                        <span className="max-w-[72%] truncate text-[9px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                          {label}
                        </span>
                      </div>
                      {/* Search widget — an authentic Android home-screen
                          touch, mostly-empty with a coloured dot standing in
                          for a search-engine glyph. */}
                      <div className="absolute bottom-[10%] left-[10%] right-[10%] flex h-[8%] items-center gap-[8%] rounded-full bg-white/20 px-[10%]">
                        <span className="size-1.5 shrink-0 rounded-full bg-cta" />
                      </div>
                      {/* Gesture bar */}
                      <span className="absolute bottom-[2.5%] left-1/2 h-[3px] w-[26%] -translate-x-1/2 rounded-full bg-white/70" />
                    </div>
                  </DeviceFrame>
                </MockupCard>

                <MockupCard title="Windows Taskbar">
                  <DeviceFrame
                    photoSrc="/mockups/device-windows.png"
                    aspect="594/420"
                    screenRect={{ left: 13.5, top: 16.5, width: 73.5, height: 57.5 }}
                    screenRadius="2%"
                  >
                    {/* The photo's own wallpaper shows through untouched —
                        only the taskbar strip below is drawn on top of it. */}
                    <div className="relative size-full">
                      {/* Taskbar — Windows 11 centres it, unlike the old
                          left-aligned Start tile. */}
                      <div className="absolute inset-x-0 bottom-0 flex h-[18%] items-center justify-center gap-[6%] bg-black/45 px-[4%]">
                        <span aria-hidden="true" className="grid grid-cols-2 gap-[2px]">
                          <span className="size-[3px] rounded-[1px] bg-white" />
                          <span className="size-[3px] rounded-[1px] bg-white" />
                          <span className="size-[3px] rounded-[1px] bg-white" />
                          <span className="size-[3px] rounded-[1px] bg-white" />
                        </span>
                        <span className="size-2.5 rounded-sm bg-white/30" />
                        <span className="size-2.5 rounded-sm bg-white/30" />
                        <div className="flex flex-col items-center gap-[2px]">
                          {/* biome-ignore lint/performance/noImgElement: runtime
                              blob object URL, reusing the same generated
                              192px PNG. */}
                          <img
                            src={generated.previews.p192}
                            width={14}
                            height={14}
                            alt="This site's icon pinned to the Windows 11 taskbar"
                            className="rounded-sm"
                          />
                          <span className="h-px w-2.5 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>
                  </DeviceFrame>
                </MockupCard>
              </div>

              <div className="mt-5 flex flex-col items-center">
                <h4 className="hint">Inside favicon.ico · native resolution</h4>
                <div className="mt-1.5 flex flex-wrap items-end justify-center gap-5 rounded-card border border-line-grey bg-cream px-6 py-4">
                  {(
                    [
                      { url: generated.previews.p16, px: 16 },
                      { url: generated.previews.p32, px: 32 },
                      { url: generated.previews.p48, px: 48 },
                    ] as const
                  ).map(({ url, px }) => (
                    <figure key={px} className="flex flex-col items-center gap-1.5">
                      {/* biome-ignore lint/performance/noImgElement: runtime blob
                          object URL, and the point is 1:1 pixels. */}
                      <img src={url} width={px} height={px} alt={`${px} pixel favicon`} />
                      <figcaption className="hint tabular-nums">{px}px</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Customize — background swatches, icon shape buttons, and the
              padding and corner-radius sliders. Always visible: colours and
              shape are worth setting before an image source even lands. */}
          <section
            aria-label="Customize"
            className="mt-5 rounded-card border border-line-grey bg-offwhite p-4 sm:p-6"
          >
            <h4 className="text-center font-display font-bold text-[20px] text-ink">
              Customize
            </h4>
            <p className="hint mt-1 text-center">Fine-tune your favicon</p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <fieldset>
                <legend className="label">Background</legend>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Transparent is hidden on the image source: transparency is
                      already preserved everywhere except the apple-touch-icon,
                      which physically cannot be transparent. */}
                  {tab !== 'image' ? (
                    <button
                      type="button"
                      aria-label="Transparent background"
                      aria-pressed={swatchValue === null}
                      title="Transparent background"
                      onClick={() => selectBackground(null)}
                      className={`size-11 rounded-lg border transition-colors sm:size-9 ${
                        swatchValue === null
                          ? 'border-2 border-ink'
                          : 'border-line-grey hover:border-ink'
                      }`}
                      style={CHECKERBOARD}
                    />
                  ) : null}
                  {BG_SWATCHES.map(({ hex, name }) => (
                    <button
                      key={hex}
                      type="button"
                      aria-label={`${name} background`}
                      aria-pressed={
                        swatchValue !== null && normalizeHexColor(swatchValue) === hex
                      }
                      title={`${name} background`}
                      onClick={() => selectBackground(hex)}
                      className={`size-11 rounded-lg border transition-colors sm:size-9 ${
                        swatchValue !== null && normalizeHexColor(swatchValue) === hex
                          ? 'border-2 border-ink'
                          : 'border-line-grey hover:border-ink'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                  <input
                    type="color"
                    aria-label="Custom background colour"
                    title="Custom background colour"
                    value={
                      swatchValue === null ? '#ffffff' : safeColor(swatchValue, '#ffffff')
                    }
                    onChange={(e) => selectBackground(e.target.value)}
                    className={`size-11 cursor-pointer rounded-lg border bg-cream p-0.5 transition-colors sm:size-9 ${
                      swatchValue !== null &&
                      !BG_SWATCHES.some(
                        ({ hex }) => normalizeHexColor(swatchValue) === hex,
                      )
                        ? 'border-2 border-ink'
                        : 'border-line-grey hover:border-ink'
                    }`}
                  />
                </div>

                {tab === 'image' ? (
                  <p className="hint mt-1.5">
                    iOS ignores transparency, so the 180px apple-touch-icon is flattened
                    onto this colour.
                  </p>
                ) : null}
                {tab === 'emoji' && emojiTransparent ? (
                  <p className="hint mt-1.5">
                    Transparent everywhere except the apple-touch-icon, which iOS always
                    flattens — onto white here.
                  </p>
                ) : null}
                {tab === 'text' && textBg === null ? (
                  <p className="hint mt-1.5">
                    No tile — the letter floats on transparency, so shape and corner
                    radius have nothing to draw.
                  </p>
                ) : null}

                {tab === 'text' ? (
                  <div className="mt-3 flex flex-col gap-3">
                    {textBg !== null ? (
                      <ColorField
                        id="fav-text-bg"
                        label="Tile colour"
                        value={textBg}
                        onChange={setTextBg}
                      />
                    ) : null}
                    <ColorField
                      id="fav-text-fg"
                      label="Letter colour"
                      value={textFg}
                      onChange={setTextFg}
                    />
                  </div>
                ) : null}
              </fieldset>

              <fieldset>
                <legend className="label">Shape</legend>
                <div className="flex flex-wrap gap-2">
                  {SHAPES.map(({ value, label: shapeLabel, glyph, title }) => (
                    <button
                      key={value}
                      type="button"
                      title={title}
                      aria-label={shapeLabel}
                      aria-pressed={shape === value}
                      onClick={() => setShape(value)}
                      className={`flex size-11 items-center justify-center rounded-lg border transition-colors ${
                        shape === value
                          ? 'border-ink bg-violet-100 text-violet-700'
                          : 'border-line-grey text-ink-muted hover:border-ink'
                      }`}
                    >
                      <span
                        className={`size-5 border-2 border-current ${glyph}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <div className="flex items-center justify-between">
                  <label className="label mb-0" htmlFor="fav-pad">
                    Padding
                  </label>
                  <span className="font-semibold text-[13px] text-ink tabular-nums">
                    {Math.round(pad * 100)}%
                  </span>
                </div>
                <input
                  id="fav-pad"
                  type="range"
                  min={0}
                  max={24}
                  step={1}
                  value={Math.round(pad * 100)}
                  onChange={(e) => setPad(Number(e.target.value) / 100)}
                  className="mt-3 w-full accent-violet-700"
                />
                <p className="hint mt-1.5">
                  A wordmark exported edge-to-edge needs breathing room; an icon drawn to
                  fill its tile does not.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="label mb-0" htmlFor="fav-radius">
                    Corner Radius
                  </label>
                  <span className="font-semibold text-[13px] text-ink tabular-nums">
                    {radiusPct}%
                  </span>
                </div>
                <input
                  id="fav-radius"
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={radiusPct}
                  disabled={shape === 'circle'}
                  title={shape === 'circle' ? 'Circle ignores corner radius' : undefined}
                  onChange={(e) => {
                    // Dragging the radius while Square is selected means the user
                    // wants rounding — switch for them instead of doing nothing.
                    if (shape === 'square') setShape('rounded')
                    setRadiusPct(Number(e.target.value))
                  }}
                  className="mt-3 w-full accent-violet-700 disabled:cursor-not-allowed disabled:opacity-45"
                />
                <p className="hint mt-1.5">
                  {shape === 'circle'
                    ? 'A circle has no corners to round.'
                    : 'As a percentage of the tile edge — 20% matches iOS.'}
                </p>
              </div>
            </div>

            {/* Every competitor lets you pick two colours and hands back the
                result. At 16px a 2:1 pair is a grey smudge, so the score is
                always shown and a failing one is called out in words. Hidden
                when the tile is transparent — there is no tile to contrast
                against. */}
            {tab === 'text' && textBg !== null ? (
              <p
                className={`mt-5 flex items-start gap-2 rounded-sm border p-3 text-[14px] ${
                  textLegible
                    ? 'border-line-grey bg-cream text-ink-body'
                    : 'border-ink bg-peach font-medium text-ink'
                }`}
              >
                {textLegible ? null : (
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                )}
                <span>
                  Letter against tile:{' '}
                  <strong className="text-ink tabular-nums">
                    {textRatio === null
                      ? 'not measurable'
                      : formatContrastRatio(textRatio)}
                  </strong>
                  {textLegible
                    ? ' — enough separation to survive being shrunk to 16 pixels.'
                    : ` — under ${MIN_TEXT_CONTRAST}:1 the letter merges into the tile at 16px. Darken one side.`}
                </span>
              </p>
            ) : null}
          </section>
        </section>
      </div>

      {/* ── Card 3: Generated Favicon — the four formats every browser/OS
          actually asks for as cards, plus an "And more" card for the rest
          (today just the manifest), then the export actions. Same five files
          `downloadZip`/`saveBlob` always produced. */}
      <div className="overflow-hidden rounded-panel border border-line bg-cream">
        <section aria-label="Generated favicon" className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <h3 className="font-display font-bold text-[24px] text-ink">
              Generated Favicon
            </h3>
            {generated !== null ? (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 font-medium text-[11px] text-violet-700">
                {files.length} files
              </span>
            ) : null}
          </div>
          {generated === null ? (
            <p className="mt-3 text-center text-[14px] text-ink-subtle">
              {waitingMessage}
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {primaryFiles.map((file) => (
                <FormatCard
                  key={file.name}
                  name={file.name}
                  dims={file.dims}
                  note={file.note}
                  size={formatKb(file.blob.size)}
                  saved={savedFile === file.name}
                  previewUrl={file.preview}
                  onDownload={() => saveBlob(file.blob, file.name)}
                />
              ))}
              {moreFiles.length > 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-card border border-line-grey bg-offwhite p-3 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl border border-line-grey bg-cream">
                    <LayoutGrid className="size-6 text-violet-700" aria-hidden="true" />
                  </span>
                  <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.1em]">
                    And more
                  </p>
                  <ul className="flex w-full flex-1 flex-col gap-1.5">
                    {moreFiles.map((file) => (
                      <li key={file.name}>
                        <button
                          type="button"
                          onClick={() => saveBlob(file.blob, file.name)}
                          aria-label={`Download ${file.name} — ${file.note}, ${formatKb(file.blob.size)}`}
                          title={file.note}
                          className="flex min-h-9 w-full items-center justify-center gap-1.5 rounded-sm border border-line-grey bg-cream px-2 transition-colors hover:border-ink"
                        >
                          {savedFile === file.name ? (
                            <Check
                              className="size-3.5 shrink-0 text-violet-700"
                              aria-hidden="true"
                            />
                          ) : (
                            <Download className="size-3.5 shrink-0" aria-hidden="true" />
                          )}
                          <span className="min-w-0 truncate font-mono text-[12px] text-ink">
                            {file.name}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}

          {genError !== null ? (
            <p className="mt-3 flex items-start gap-2 rounded-sm border border-ink bg-peach p-3 font-medium text-[14px] text-ink">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {genError}
            </p>
          ) : null}

          {/* The single most prominent call to action on the page. Reset
              (contextual, changes what the tool is doing) lives in the source
              card's toolbar instead; this block is purely about getting the
              finished set out of the tool. */}
          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <button
              type="button"
              onClick={() => {
                void downloadZip()
                trackToolEvent('favicon-generator', 'download_zip')
              }}
              disabled={generated === null}
              className="btn-brutal gap-3 px-8 py-3"
            >
              {savedFile === 'favicon-set.zip' ? (
                <Check className="size-5 shrink-0" aria-hidden="true" />
              ) : (
                <Download className="size-5 shrink-0" aria-hidden="true" />
              )}
              <span className="flex flex-col text-left">
                <span className="font-semibold">Download All Files</span>
                <span className="font-normal text-[12px] opacity-70">
                  Get .zip file with all favicon sizes
                </span>
              </span>
            </button>
            <span className="hint">or</span>
            <CopyButton
              text={htmlSnippet}
              label="Copy HTML Code"
              onCopy={() => trackToolEvent('favicon-generator', 'copy_html')}
            />
            <p className="hint">Add favicon to your website</p>
          </div>

          {/* The paste-into-<head> snippet, tucked into a <details> so it's
              available without competing for space with the primary action. */}
          <details className="mt-6 w-full rounded-card border border-line-grey bg-offwhite p-3 sm:mx-auto sm:max-w-md">
            <summary className="cursor-pointer font-display font-semibold text-[14px] text-ink">
              View the install snippet
            </summary>
            <div className="mt-3 flex flex-col gap-4">
              <div>
                <h4 className="label mb-0">Paste into your &lt;head&gt;</h4>
                <pre className="mt-2 overflow-x-auto rounded-sm border border-line-grey bg-cream p-3 font-mono text-[13px] text-ink leading-5">
                  {htmlSnippet}
                </pre>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="label mb-0">site.webmanifest</h4>
                  <CopyButton
                    text={manifestSnippet}
                    label="Copy manifest"
                    onCopy={() => trackToolEvent('favicon-generator', 'copy_manifest')}
                  />
                </div>
                <pre className="mt-2 max-h-56 overflow-auto rounded-sm border border-line-grey bg-cream p-3 font-mono text-[13px] text-ink leading-5">
                  {manifestSnippet}
                </pre>
                <p className="hint mt-1.5">
                  Already inside the ZIP. Upload all five files to your site root, next to
                  index.html — the paths above assume exactly that.
                </p>
              </div>
            </div>
          </details>
        </section>

        <div className="border-line border-t bg-offwhite">
          <StatusBar
            state={
              genError !== null || imageError !== null
                ? 'invalid'
                : generated !== null
                  ? 'valid'
                  : 'neutral'
            }
            message={
              savedFile !== null
                ? `Saved ${savedFile}`
                : genError !== null
                  ? 'Could not render the set'
                  : imageError !== null
                    ? 'That file was not usable'
                    : building
                      ? 'Rendering…'
                      : generated !== null
                        ? 'Complete set ready'
                        : 'Waiting for a source'
            }
            stats={
              generated === null
                ? undefined
                : [
                    { label: 'files', value: String(files.length) },
                    { label: 'total', value: formatKb(totalBytes) },
                    { label: 'master', value: `${MASTER}px` },
                  ]
            }
          />
        </div>
      </div>

      {/* The privacy promise, closing the page the way the status bar used to
          carry it — same promise, wireframe placement. */}
      <p className="flex items-center justify-center gap-1.5 text-[13px] text-ink-subtle">
        <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
        Your files are processed in your browser. We never upload your data.
      </p>
    </div>
  )
}

/**
 * One tile in the Live Preview row — caption on top (as the wireframe titles
 * them), whatever platform mock is inside below.
 */
function MockupCard({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-card border border-line-grey bg-cream p-3"
      title={hint}
    >
      <p className="hint text-center leading-4">{title}</p>
      <div className="flex min-h-[84px] w-full flex-1 items-center justify-center">
        {children}
      </div>
    </div>
  )
}

/**
 * A real device product photo, with the generated favicon composited into its
 * screen. `screenRect` and `screenRadius` were measured directly off each
 * source photo's pixels (bezel-vs-screen colour transitions, scanned with
 * PIL) — they are percentages of the WHOLE photo, not guesses, which is why
 * the overlay lines up with the photo's actual glass rather than floating
 * over the bezel. The photo itself is decorative chrome (alt=""); the
 * meaningful content — the icon — carries its own alt text inside `children`.
 */
function DeviceFrame({
  photoSrc,
  aspect,
  screenRect,
  screenRadius,
  children,
}: {
  photoSrc: string
  /** The photo's own pixel aspect ratio, e.g. "1024/1536" — never distort it to fit a slot. */
  aspect: string
  screenRect: { left: number; top: number; width: number; height: number }
  screenRadius: string
  children: React.ReactNode
}) {
  return (
    <div className="relative mx-auto w-full" style={{ aspectRatio: aspect }}>
      {/* biome-ignore lint/performance/noImgElement: a static /public asset
          used as absolutely-positioned decorative chrome behind a percentage-
          based overlay — next/image's fixed intrinsic-size model doesn't fit
          this "photo as backdrop" composition. */}
      <img src={photoSrc} alt="" className="absolute inset-0 size-full object-contain" />
      <div
        className="absolute overflow-hidden"
        style={{
          left: `${screenRect.left}%`,
          top: `${screenRect.top}%`,
          width: `${screenRect.width}%`,
          height: `${screenRect.height}%`,
          borderRadius: screenRadius,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/** One card in the Generated Favicon row — everything centred, per the wireframe. */
function FormatCard({
  name,
  dims,
  note,
  size,
  saved,
  previewUrl,
  onDownload,
}: {
  name: string
  dims: string
  note: string
  size: string
  saved: boolean
  previewUrl?: string
  onDownload: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-line-grey bg-cream p-3 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl border border-line-grey bg-offwhite">
        {previewUrl !== undefined ? (
          // biome-ignore lint/performance/noImgElement: a runtime blob object URL, which next/image cannot optimise.
          <img
            src={previewUrl}
            width={36}
            height={36}
            alt={`${name} preview`}
            className="size-9 rounded-md"
          />
        ) : (
          <LayoutGrid className="size-6 text-violet-700" aria-hidden="true" />
        )}
      </span>
      <p className="w-full truncate font-mono font-medium text-[12.5px] text-ink">
        {name}
      </p>
      <p className="text-[11px] text-ink-subtle tabular-nums">{dims}</p>
      <p className="flex-1 text-[11px] text-ink-subtle leading-4">{note}</p>
      <button
        type="button"
        onClick={onDownload}
        aria-label={`Download ${name} — ${note}, ${size}`}
        title={note}
        className="mt-1 inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-sm border border-line-grey px-2.5 font-medium text-[12px] text-ink transition-colors hover:border-ink"
      >
        {saved ? (
          <Check className="size-3.5 text-violet-700" aria-hidden="true" />
        ) : (
          <Download className="size-3.5" aria-hidden="true" />
        )}
        {size}
      </button>
    </div>
  )
}

/**
 * A colour swatch paired with its hex field. Both edit the same value: the
 * swatch is unusable for anyone typing a brand hex from memory, and the text
 * field is unusable for anyone picking by eye.
 *
 * The label is wired to the text input, not the swatch, so a screen reader reads
 * a value rather than announcing an unlabelled colour well.
 */
function ColorField({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  hint?: string
}) {
  const hintId = `${id}-hint`
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          aria-label={`${label} — colour picker`}
          value={safeColor(value, '#ffffff')}
          onChange={(e) => onChange(e.target.value)}
          className="size-11 shrink-0 cursor-pointer rounded-sm border border-line-grey bg-cream p-1"
        />
        <input
          id={id}
          className="field font-mono"
          type="text"
          spellCheck={false}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hint === undefined ? undefined : hintId}
        />
      </div>
      {hint === undefined ? null : (
        <p className="hint mt-1.5" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  )
}
