'use client'

import { Check, Download, TriangleAlert } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  DropZone,
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarAction,
  ToolbarGroup,
  ToolToolbar,
  ToolWorkspace,
} from '@/components/tools/workspace'
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
 * Favicon generator — rebuilt on the shared workspace.
 * Research brief: docs/research/favicon-generator.md
 *
 * What changed, and why:
 *   - The preview stack is now the entire right pane, ordered by where a favicon
 *     actually fails: a 16px tab in light chrome AND in dark chrome (a dark mark
 *     vanishes on a dark tab strip, and no competitor shows you that before you
 *     download), then native-resolution 16/32/48 swatches, then the iOS tile
 *     where transparency flattening becomes visible.
 *   - Source and shape moved into the toolbar; they change the whole output, so
 *     they belong above both panes rather than buried in the input column.
 *   - The install snippets moved from a panel far below the tool into a second
 *     view of the output pane. Preview while designing, Install when finished —
 *     mutually exclusive by workflow, and both fit without scrolling.
 *   - The `Install` view is source-independent, which is what removes the second
 *     empty state: with no image chosen yet the left pane offers the drop zone
 *     and the right pane still has real, copyable content.
 *   - New: a 16px legibility contrast score on the text source, and padding
 *     control on the image source (a wordmark exported edge-to-edge needs
 *     breathing room; an icon meant to fill the tile does not).
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
type OutputView = 'preview' | 'install'

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
    readonly apple: string
  }
}

const MASTER = 512
const APPLE_SIZE = 180

/** Below this the letter and the tile merge into one grey smudge at 16px. */
const MIN_TEXT_CONTRAST = 3

const TABS: readonly { readonly value: SourceTab; readonly label: string }[] = [
  { value: 'image', label: 'Image' },
  { value: 'text', label: 'Text' },
  { value: 'emoji', label: 'Emoji' },
]

const SHAPES: readonly { readonly value: TileShape; readonly label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
]

/** Three steps, not a slider — 11% versus 12% is not a decision anyone needs. */
const PADDINGS: readonly { readonly value: number; readonly label: string }[] = [
  { value: 0, label: 'None' },
  { value: 0.08, label: 'Small' },
  { value: 0.16, label: 'Large' },
]

const QUICK_EMOJI: readonly string[] = ['🚀', '⭐', '🔥', '💡', '🎯', '🛠️', '💜', '🌿']

const ACCEPT = 'image/png,image/jpeg,image/svg+xml,image/webp'
const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'])
const ACCEPTED_EXT = /\.(png|jpe?g|svg|webp)$/i

/**
 * Imitation browser chrome. These hex values are copied from real Chrome tab
 * strips and deliberately sit outside the brand palette: the whole point of the
 * mock is to show the icon against the colours it will actually meet, and
 * substituting our own tokens would make the preview reassuring but wrong.
 */
const CHROMES: readonly {
  readonly key: string
  readonly caption: string
  readonly frame: string
  readonly tab: string
  readonly text: string
  readonly toolbar: string
}[] = [
  {
    key: 'light',
    caption: 'Light theme',
    frame: 'bg-[#dee1e6]',
    tab: 'bg-white',
    text: 'text-[#3c4043]',
    toolbar: 'bg-white',
  },
  {
    key: 'dark',
    caption: 'Dark theme',
    frame: 'bg-[#202124]',
    tab: 'bg-[#35363a]',
    text: 'text-[#e8eaed]',
    toolbar: 'bg-[#35363a]',
  },
]

const DEFAULT_TEXT = 'S'
const DEFAULT_TEXT_BG = '#7030f8'
const DEFAULT_TEXT_FG = '#ffffff'
const DEFAULT_EMOJI = '🚀'
const DEFAULT_NAME = 'Scult'

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

/** The tile outline, as a path — filled for text, used as a clip for an image. */
function shapePath(ctx: CanvasRenderingContext2D, shape: TileShape): void {
  ctx.beginPath()
  if (shape === 'circle') {
    ctx.arc(MASTER / 2, MASTER / 2, MASTER / 2, 0, Math.PI * 2)
  } else if (shape === 'rounded') {
    ctx.roundRect(0, 0, MASTER, MASTER, MASTER * 0.2)
  } else {
    ctx.rect(0, 0, MASTER, MASTER)
  }
}

function fillShape(ctx: CanvasRenderingContext2D, shape: TileShape, color: string): void {
  ctx.fillStyle = color
  shapePath(ctx, shape)
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
): HTMLCanvasElement | null {
  const { canvas, ctx } = newMaster()
  if (ctx === null) return null
  if (shape !== 'square') {
    shapePath(ctx, shape)
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
  bg: string,
  fg: string,
  shape: TileShape,
  family: string,
): HTMLCanvasElement | null {
  const { canvas, ctx } = newMaster()
  if (ctx === null) return null
  fillShape(ctx, shape, bg)
  ctx.fillStyle = fg
  const maxWidth = shape === 'square' ? 410 : shape === 'rounded' ? 390 : 330
  drawCentredGlyphs(ctx, text, (px) => `600 ${px}px ${family}`, 340, maxWidth)
  return canvas
}

function drawEmojiMaster(
  emoji: string,
  bg: string | null,
  shape: TileShape,
): HTMLCanvasElement | null {
  const { canvas, ctx } = newMaster()
  if (ctx === null) return null
  if (bg !== null) fillShape(ctx, shape, bg)
  ctx.fillStyle = '#000000'
  drawCentredGlyphs(ctx, emoji, (px) => `${px}px serif`, 400, bg === null ? 460 : 400)
  return canvas
}

export function FaviconGenerator() {
  // Seeded with text rather than an image: a file input cannot be pre-filled, so
  // an image-first default would guarantee an empty first paint.
  const [tab, setTab] = useState<SourceTab>('text')
  const [shape, setShape] = useState<TileShape>('rounded')
  const [view, setView] = useState<OutputView>('preview')

  const [source, setSource] = useState<LoadedImage | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [imageBg, setImageBg] = useState('#ffffff')
  const [pad, setPad] = useState(0)

  const [text, setText] = useState(DEFAULT_TEXT)
  const [textBg, setTextBg] = useState(DEFAULT_TEXT_BG)
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
        ? textBg
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

  const textRatio = hexContrastRatio(textFg, textBg)
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
            ? drawImageMaster(source, shape, pad)
            : tab === 'text'
              ? drawTextMaster(
                  text.trim(),
                  safeColor(textBg, DEFAULT_TEXT_BG),
                  safeColor(textFg, DEFAULT_TEXT_FG),
                  shape,
                  family,
                )
              : drawEmojiMaster(
                  emoji.trim(),
                  emojiTransparent ? null : safeColor(emojiBg, '#ffffff'),
                  shape,
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
          apple: URL.createObjectURL(apple),
        }
        previewUrlsRef.current = [
          previews.p16,
          previews.p32,
          previews.p48,
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
    setTab('text')
    setShape('rounded')
    setView('preview')
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

  const label = appName.trim() === '' ? 'My site' : appName.trim()

  const files: readonly {
    readonly name: string
    readonly blob: Blob
    readonly note: string
  }[] =
    generated === null
      ? []
      : [
          { name: 'favicon.ico', blob: generated.ico, note: '16 · 32 · 48 in one file' },
          { name: 'icon-192.png', blob: generated.png192, note: 'Android home screen' },
          { name: 'icon-512.png', blob: generated.png512, note: 'PWA install + splash' },
          {
            name: 'apple-touch-icon.png',
            blob: generated.apple,
            note: 'iOS, 180px, opaque',
          },
          {
            name: 'site.webmanifest',
            blob: manifestBlob,
            note: 'Names and links the icons',
          },
        ]

  const totalBytes = files.reduce((sum, f) => sum + f.blob.size, 0)

  const waitingMessage =
    tab === 'image'
      ? 'Choose an image on the left and the tab mocks, the size swatches and all five files fill in here. Switching to Text or Emoji in the toolbar gives you a result with no file at all.'
      : tab === 'text'
        ? 'Type at least one character on the left. One or two initials stay readable at 16px; three rarely do.'
        : 'Pick an emoji on the left and the whole set renders here.'

  return (
    <ToolWorkspace
      inputLabel="Favicon source"
      outputLabel="Preview and files"
      minHeight="min-h-[30rem]"
      toolbar={
        <ToolToolbar actions={<ToolbarAction onClick={reset}>Reset</ToolbarAction>}>
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

          <ToolbarGroup label="Shape">
            {SHAPES.map(({ value, label: shapeLabel }) => (
              <SegmentButton
                key={value}
                active={shape === value}
                onClick={() => setShape(value)}
                title={
                  value === 'square'
                    ? 'Fills the whole tile'
                    : value === 'rounded'
                      ? 'Rounded corners, 20% radius'
                      : 'Clipped to a circle'
                }
              >
                {shapeLabel}
              </SegmentButton>
            ))}
          </ToolbarGroup>
        </ToolToolbar>
      }
      input={
        <Pane
          title={`${tab === 'image' ? 'Image' : tab === 'text' ? 'Text' : 'Emoji'} source`}
        >
          <div className="flex flex-col gap-5">
            {tab === 'image' ? (
              <>
                <div>
                  <DropZone
                    accept={ACCEPT}
                    maxBytes={FAVICON_MAX_SOURCE_BYTES}
                    onFile={(file) => {
                      void loadFile(file)
                    }}
                    label="Drop your logo, or choose a file"
                    hint="PNG, JPG, WebP or SVG · up to 10 MB · centre-cropped to a square"
                  />
                  {source !== null ? (
                    <p className="mt-2 text-[14px] text-ink-muted">
                      Loaded <strong className="text-ink">{source.name}</strong>
                      {source.width > 0 ? ` · ${source.width}×${source.height}px` : ''}
                    </p>
                  ) : null}
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

                <fieldset>
                  <legend className="label">Padding</legend>
                  <div className="flex flex-wrap gap-2">
                    {PADDINGS.map(({ value, label: padLabel }) => (
                      <SegmentButton
                        key={padLabel}
                        active={pad === value}
                        onClick={() => setPad(value)}
                      >
                        {padLabel}
                      </SegmentButton>
                    ))}
                  </div>
                  <p className="hint mt-1.5">
                    A wordmark exported edge-to-edge needs breathing room; an icon drawn
                    to fill its tile does not.
                  </p>
                </fieldset>

                <ColorField
                  id="fav-image-bg"
                  label="Apple touch icon background"
                  value={imageBg}
                  onChange={setImageBg}
                  hint="iOS ignores transparency, so the 180px icon is flattened onto this colour."
                />
              </>
            ) : null}

            {tab === 'text' ? (
              <>
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
                    onChange={(e) =>
                      setText(clampGlyphs(e.target.value, MAX_TEXT_GLYPHS))
                    }
                    aria-describedby="fav-text-hint"
                  />
                  <p className="hint mt-1.5" id="fav-text-hint">
                    Initials work best, rendered in the site's display serif. One
                    character stays readable even at 16px.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorField
                    id="fav-text-bg"
                    label="Tile colour"
                    value={textBg}
                    onChange={setTextBg}
                  />
                  <ColorField
                    id="fav-text-fg"
                    label="Letter colour"
                    value={textFg}
                    onChange={setTextFg}
                  />
                </div>

                {/* Every competitor lets you pick two colours and hands back the
                    result. At 16px a 2:1 pair is a grey smudge, so the score is
                    always shown and a failing one is called out in words. */}
                <p
                  className={`flex items-start gap-2 rounded-sm border p-3 text-[14px] ${
                    textLegible
                      ? 'border-line-grey bg-offwhite text-ink-body'
                      : 'border-ink bg-peach font-medium text-ink'
                  }`}
                >
                  {textLegible ? null : (
                    <TriangleAlert
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
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
              </>
            ) : null}

            {tab === 'emoji' ? (
              <>
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
                            : 'border-line-grey bg-white hover:border-ink'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <fieldset>
                  <legend className="label">Background</legend>
                  <div className="flex flex-wrap items-center gap-2">
                    <SegmentButton
                      active={emojiTransparent}
                      onClick={() => setEmojiTransparent(true)}
                    >
                      Transparent
                    </SegmentButton>
                    <SegmentButton
                      active={!emojiTransparent}
                      onClick={() => setEmojiTransparent(false)}
                    >
                      Solid colour
                    </SegmentButton>
                  </div>
                  {emojiTransparent ? (
                    <p className="hint mt-1.5">
                      Transparent everywhere except the apple-touch-icon, which iOS always
                      flattens — onto white here. Shape has nothing to draw, so it has no
                      effect.
                    </p>
                  ) : null}
                </fieldset>

                {emojiTransparent ? null : (
                  <ColorField
                    id="fav-emoji-bg"
                    label="Tile colour"
                    value={emojiBg}
                    onChange={setEmojiBg}
                  />
                )}
              </>
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
        </Pane>
      }
      output={
        <Pane
          title={view === 'preview' ? 'Preview and files' : 'Install it'}
          actions={
            <>
              <SegmentButton
                active={view === 'preview'}
                onClick={() => setView('preview')}
              >
                Preview
              </SegmentButton>
              <SegmentButton
                active={view === 'install'}
                onClick={() => setView('install')}
              >
                Install
              </SegmentButton>
            </>
          }
        >
          {view === 'install' ? (
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="label mb-0">Paste into your &lt;head&gt;</h4>
                  <CopyButton text={htmlSnippet} label="Copy HTML" />
                </div>
                <pre className="mt-2 overflow-x-auto rounded-sm border border-line-grey bg-offwhite p-3 font-mono text-[13px] text-ink leading-5">
                  {htmlSnippet}
                </pre>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="label mb-0">site.webmanifest</h4>
                  <CopyButton text={manifestSnippet} label="Copy manifest" />
                </div>
                <pre className="mt-2 max-h-56 overflow-auto rounded-sm border border-line-grey bg-offwhite p-3 font-mono text-[13px] text-ink leading-5">
                  {manifestSnippet}
                </pre>
                <p className="hint mt-1.5">
                  Already inside the ZIP. Upload all five files to your site root, next to
                  index.html — the paths above assume exactly that.
                </p>
              </div>
            </div>
          ) : generated === null ? (
            <div className="flex h-full items-center justify-center p-6">
              <p className="max-w-[40ch] text-center text-[14px] text-ink-subtle leading-6">
                {building
                  ? 'Rendering the 512px master and scaling it down…'
                  : waitingMessage}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* 1. Where a favicon actually dies: 16px, on both tab strips. */}
              <div>
                <h4 className="label">
                  In a browser tab · the real 16px file, light and dark
                </h4>
                <div className="flex flex-col gap-2">
                  {CHROMES.map((chrome) => (
                    <div
                      key={chrome.key}
                      className="overflow-hidden rounded-card border border-line-grey"
                    >
                      <div className={`flex items-end gap-1 px-2 pt-2 ${chrome.frame}`}>
                        <div
                          className={`flex min-w-0 max-w-[220px] flex-1 items-center gap-2 rounded-t-lg px-3 py-2 ${chrome.tab}`}
                        >
                          {/* biome-ignore lint/performance/noImgElement: a runtime
                              blob object URL, which next/image cannot optimise —
                              and it must render at exactly 16px, unscaled. */}
                          <img
                            src={generated.previews.p16}
                            width={16}
                            height={16}
                            alt={`The 16 pixel favicon in a browser tab — ${chrome.caption}`}
                            className="shrink-0"
                          />
                          <span className={`truncate text-[12px] ${chrome.text}`}>
                            {label}
                          </span>
                        </div>
                      </div>
                      <div className={`flex h-2 ${chrome.toolbar}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. What the ICO actually contains, at native resolution. */}
              <div>
                <h4 className="label">Inside favicon.ico · native resolution</h4>
                <div className="flex flex-wrap items-end gap-5 rounded-card border border-line-grey bg-white p-4">
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

                  {/* 3. iOS, where transparency flattening becomes visible. */}
                  <figure className="ml-auto flex flex-col items-center gap-1.5">
                    <span className="flex flex-col items-center gap-1 rounded-card bg-[#202124] px-3 py-2.5">
                      {/* biome-ignore lint/performance/noImgElement: runtime blob
                          object URL, not optimisable by next/image. */}
                      <img
                        src={generated.previews.apple}
                        width={60}
                        height={60}
                        alt="The apple touch icon on an iOS home screen"
                        className="rounded-[14px]"
                      />
                      <span className="max-w-[70px] truncate text-[10px] text-[#e8eaed]">
                        {label}
                      </span>
                    </span>
                    <figcaption className="hint">iOS home screen</figcaption>
                  </figure>
                </div>
              </div>

              {/* The download list. */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="label mb-0">Download</h4>
                  <button
                    type="button"
                    onClick={() => {
                      void downloadZip()
                    }}
                    // min-h-11: btn-brutal-sm lands at 42px, and this is the
                    // primary action on a phone. The shared class is left alone.
                    className="btn-brutal btn-brutal-sm btn-violet min-h-11"
                  >
                    {savedFile === 'favicon-set.zip' ? (
                      <Check className="size-4" aria-hidden="true" />
                    ) : (
                      <Download className="size-4" aria-hidden="true" />
                    )}
                    All five (.zip)
                  </button>
                </div>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {files.map(({ name, blob, note }) => (
                    <li key={name}>
                      <button
                        type="button"
                        onClick={() => saveBlob(blob, name)}
                        // What each file is for is spelled out at length in the
                        // prose below the tool, so the row itself stays one line —
                        // the whole preview stack has to fit without scrolling. The
                        // purpose still reaches a screen reader and a hover.
                        aria-label={`Download ${name} — ${note}, ${formatKb(blob.size)}`}
                        title={note}
                        className="flex w-full min-h-11 items-center gap-2 rounded-sm border border-line-grey bg-white px-3 py-2 text-left transition-colors hover:border-ink"
                      >
                        {savedFile === name ? (
                          <Check
                            className="size-4 shrink-0 text-violet-700"
                            aria-hidden="true"
                          />
                        ) : (
                          <Download className="size-4 shrink-0" aria-hidden="true" />
                        )}
                        <span className="min-w-0 flex-1 truncate font-mono font-medium text-[13px] text-ink">
                          {name}
                        </span>
                        <span className="shrink-0 text-[12px] text-ink-subtle tabular-nums">
                          {formatKb(blob.size)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {genError !== null ? (
                <p className="flex items-start gap-2 rounded-sm border border-ink bg-peach p-3 font-medium text-[14px] text-ink">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {genError}
                </p>
              ) : null}
            </div>
          )}
        </Pane>
      }
      status={
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
          privacyNote="Decoded, resized and zipped in your browser — never uploaded"
        />
      }
    />
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
          className="size-11 shrink-0 cursor-pointer rounded-sm border border-line-grey bg-white p-1"
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
