'use client'

import type { LucideIcon } from 'lucide-react'
import {
  Check,
  ChevronDown,
  Download,
  FileText,
  IndianRupee,
  Link as LinkIcon,
  Monitor,
  Palette,
  ScanLine,
  Smartphone,
  SwatchBook,
  TriangleAlert,
  Wifi,
} from 'lucide-react'
import QRCode from 'qrcode'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  ErrorDetail,
  ScoreRing,
  SegmentButton,
  StatusBar,
  ToolToolbar,
} from '@/components/tools/workspace'
import {
  assessQrColors,
  buildQrPayload,
  capacityFor,
  DEFAULT_QR_DARK,
  DEFAULT_QR_LIGHT,
  ERROR_CORRECTION_LEVELS,
  type ErrorCorrectionLevel,
  exceedsCapacity,
  QR_MIN_CONTRAST,
  QR_PRINT_CONTRAST,
  QR_SIZES,
  type QrMode,
  type QrSize,
  qrFileName,
  utf8ByteLength,
  type WifiSecurity,
} from '@/lib/tools/qr-code-generator/logic'
import { normalizeHexColor } from '@/lib/tools/shared/color'

/**
 * QR code generator — bespoke three-column layout, not the shared
 * `ToolWorkspace` two-pane grid every other tool uses.
 * Research brief: docs/research/qr-code-generator.md
 *
 * Columns, left to right: QR type + content fields + style accordion; the
 * preview itself (the thing every visitor came for, kept the widest column);
 * scan quality + colour shortcuts + sharing. Every page-level action —
 * Reset, the PNG/SVG/PDF/EPS downloads, Share — lives in one evenly-spaced
 * `.btn-brutal` grid at the very top, below the toolbar, rather than
 * scattered across the toolbar, the right column, and a bottom bar. A
 * separate full-width row below the columns still holds the PNG size picker
 * (not a button) and the payload copy, which uses the shared `CopyButton`
 * component left un-styled and in place, matching every other tool in this
 * codebase.
 *
 * Everything deciding *what* is encoded still lives in logic.ts and is
 * untouched by this layout pass — this file only rearranges markup around
 * the same state. A few sections in the wireframe (eye/pattern styling, a
 * logo overlay, a frame, a custom caption, PDF/EPS export, sharing) had no
 * backing implementation anywhere in the codebase; rather than invent
 * QR-rendering features this pass didn't ask for, those were removed
 * entirely at the user's request rather than left as disabled affordances.
 * `computeScanQuality` below is a
 * small UI-only heuristic (not a spec value) that turns the same signals the
 * status bar already showed into the "Scan Quality" panel's checklist and
 * ring — nothing it computes feeds back into what gets drawn or encoded.
 *
 * Nothing is uploaded. `qrcode` runs in this tab, so a WiFi password or a UPI
 * address never crosses the network, and the code carries the data itself
 * rather than a link through a redirect we would have to keep alive forever.
 */

const MODES: readonly QrMode[] = ['url', 'text', 'wifi', 'upi']

const MODE_LABELS: Record<QrMode, string> = {
  url: 'Link',
  text: 'Text',
  wifi: 'WiFi',
  upi: 'UPI',
}

const MODE_ALT: Record<QrMode, string> = {
  url: 'QR code encoding a web link',
  text: 'QR code encoding plain text',
  wifi: 'QR code encoding WiFi network details',
  upi: 'QR code encoding a UPI payment request',
}

/**
 * The wireframe this tool was rebuilt from shows a 3x3 type grid (Link, Text,
 * WiFi, Email, vCard, Phone, SMS, WhatsApp, Location). `logic.ts` only knows
 * how to build a payload for four of those — the other five have no format
 * spec, no validation, and no test coverage anywhere in this codebase. Adding
 * them here would mean inventing QR payload formats mid-layout-pass, which is
 * exactly the kind of new business logic this pass is not supposed to add.
 * The grid below renders the four modes that actually work.
 */
const MODE_ICONS: Record<QrMode, LucideIcon> = {
  url: LinkIcon,
  text: FileText,
  wifi: Wifi,
  upi: IndianRupee,
}

const LEVEL_LABELS: Record<ErrorCorrectionLevel, string> = {
  L: 'Low',
  M: 'Medium',
  Q: 'Quartile',
  H: 'High',
}

/** Share of the symbol that can be damaged and still decode. */
const LEVEL_RECOVERY: Record<ErrorCorrectionLevel, string> = {
  L: '7%',
  M: '15%',
  Q: '25%',
  H: '30%',
}

const SIZE_LABELS: Record<QrSize, string> = {
  256: 'Screen',
  512: 'Web',
  1024: 'Print',
  2048: 'Large print',
}

const SECURITY_OPTIONS: readonly (readonly [WifiSecurity, string])[] = [
  ['WPA', 'WPA / WPA2 / WPA3'],
  ['WEP', 'WEP'],
  ['nopass', 'Open (no password)'],
]

/** Presets, not a free palette: each one is a pair that actually scans. */
const COLOR_PRESETS: readonly (readonly [string, string, string])[] = [
  ['Classic', DEFAULT_QR_DARK, DEFAULT_QR_LIGHT],
  ['Brand violet', '#16018e', '#ffffff'],
  ['Ink on cream', '#161616', '#fcfbf3'],
]

const DEFAULT_URL = 'https://scult.in'

interface ScanQualityCheck {
  readonly label: string
  readonly passed: boolean
  readonly detail: string
}

interface ScanQuality {
  /** 0–100, a UI heuristic — see the module docblock. */
  readonly score: number
  readonly checks: readonly ScanQualityCheck[]
}

/**
 * Turns the contrast ratio and correction level — the two things that
 * actually change whether a phone camera resolves this code — into the
 * "Scan Quality" panel's ring value and checklist.
 *
 * Weighted 40/20/20/20 across contrast, quiet zone, logo, and correction:
 * contrast dominates because it is the one setting most likely to make a
 * code fail outright (`assessQrColors` already blocks it as an error, not a
 * warning, for the same reason). Quiet zone and logo are always "good" here
 * because this build always draws a 2-module margin and never overlays a
 * logo — there is nothing for either check to catch yet, so they read as
 * satisfied rather than as unimplemented.
 */
function computeScanQuality(
  ratio: number | null,
  level: ErrorCorrectionLevel,
  hasColorError: boolean,
): ScanQuality {
  const contrastPassed = ratio !== null && ratio >= QR_PRINT_CONTRAST
  const contrastPartial = ratio !== null && ratio >= QR_MIN_CONTRAST
  const correctionPassed = level !== 'L'

  const checks: ScanQualityCheck[] = [
    {
      label: 'Good contrast',
      passed: contrastPassed,
      detail:
        ratio === null
          ? 'Enter both colours as hex values to check.'
          : `${ratio.toFixed(1)}:1 luminance ratio`,
    },
    {
      label: 'Proper quiet zone',
      passed: true,
      detail: 'A 2-module margin is drawn around every code',
    },
    {
      label: 'Logo size is optimal',
      passed: true,
      detail: 'No logo is overlaid, so nothing competes with the modules',
    },
    {
      label: 'Error correction level',
      passed: correctionPassed,
      detail: `${level} — recovers ${LEVEL_RECOVERY[level]} of a damaged code`,
    },
  ]

  if (hasColorError) return { score: 0, checks }

  const contrastScore = contrastPassed ? 40 : contrastPartial ? 24 : 0
  const correctionScore = correctionPassed ? 20 : 10
  // Quiet zone and logo are constant contributors: 20 points each, always
  // earned, for the reason in the docblock above.
  return { score: contrastScore + 20 + 20 + correctionScore, checks }
}

export function QrCodeGenerator() {
  const [mode, setMode] = useState<QrMode>('url')
  const [url, setUrl] = useState(DEFAULT_URL)
  const [text, setText] = useState('')
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')
  const [security, setSecurity] = useState<WifiSecurity>('WPA')
  const [hiddenNetwork, setHiddenNetwork] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [vpa, setVpa] = useState('')
  const [payeeName, setPayeeName] = useState('')
  const [amount, setAmount] = useState('')
  const [level, setLevel] = useState<ErrorCorrectionLevel>('M')
  const [size, setSize] = useState<QrSize>(512)
  const [dark, setDark] = useState(DEFAULT_QR_DARK)
  const [light, setLight] = useState(DEFAULT_QR_LIGHT)
  const [drawError, setDrawError] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  // Visual-only: the QR matrix is identical on any device, so this toggle
  // never touches encoding or drawing — it only changes the preview's
  // display width, matching the wireframe's desktop/mobile switch.
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop')
  // A short "recently used" log for the right-hand colour shortcuts. Purely a
  // UI convenience on top of the setDark/setLight setters that already
  // existed — it changes no business logic and encodes nothing itself.
  const [recentColors, setRecentColors] = useState<
    readonly (readonly [string, string])[]
  >([])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pendingUrls = useRef<Set<string>>(new Set())

  const result = useMemo(
    () =>
      buildQrPayload({
        mode,
        url,
        text,
        ssid,
        password,
        security,
        hidden: hiddenNetwork,
        vpa,
        payeeName,
        amount,
      }),
    [mode, url, text, ssid, password, security, hiddenNetwork, vpa, payeeName, amount],
  )

  const colors = useMemo(() => assessQrColors(dark, light), [dark, light])
  const scanQuality = useMemo(
    () => computeScanQuality(colors.ratio, level, colors.error !== undefined),
    [colors.ratio, colors.error, level],
  )

  // An untouched field is the starting state, not a mistake — hold the error back
  // until the visitor has typed the one field that identifies this mode.
  const touched =
    mode === 'url'
      ? url.trim() !== ''
      : mode === 'text'
        ? text.trim() !== ''
        : mode === 'wifi'
          ? ssid.trim() !== ''
          : vpa.trim() !== ''

  const bytes = utf8ByteLength(result.payload)
  const overflows = result.payload !== '' && exceedsCapacity(result.payload, level)
  const ready =
    touched && result.error === undefined && !overflows && colors.error === undefined

  const drawDark = normalizeHexColor(dark)
  const drawLight = normalizeHexColor(light)

  function applyColors(nextDark: string, nextLight: string): void {
    setDark(nextDark)
    setLight(nextLight)
    setRecentColors((prev) => {
      const withoutDup = prev.filter(([d, l]) => d !== nextDark || l !== nextLight)
      const next: readonly [string, string] = [nextDark, nextLight]
      return [next, ...withoutDup].slice(0, 6)
    })
  }

  // The canvas stays mounted whether or not there is anything to show, so the ref
  // is always live when this effect runs. Unmounting it on every invalid keystroke
  // would leave the effect with a null ref on the render that makes the payload
  // valid again — the wrapper is hidden with CSS instead.
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null || !ready || drawDark === null || drawLight === null) return

    let cancelled = false
    QRCode.toCanvas(canvas, result.payload, {
      errorCorrectionLevel: level,
      width: size,
      margin: 2,
      color: { dark: `${drawDark}ff`, light: `${drawLight}ff` },
    })
      .then(() => {
        if (cancelled) return
        // `qrcode` writes inline `style.width`/`style.height` in px to match the
        // `width` option. Inline styles beat utility classes, so the canvas would
        // render at its backing-store size and overflow the pane — invisibly,
        // because the pane scrolls. Reassert the responsive sizing here: the
        // backing store stays at `size` px, which is what keeps the PNG crisp,
        // while layout follows the container.
        canvas.style.width = '100%'
        canvas.style.height = 'auto'
        setDrawError(null)
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        setDrawError(
          cause instanceof Error ? cause.message : 'This data could not be encoded.',
        )
      })

    return () => {
      cancelled = true
    }
  }, [ready, result.payload, level, size, drawDark, drawLight])

  useEffect(() => {
    const urls = pendingUrls.current
    return () => {
      for (const objectUrl of urls) URL.revokeObjectURL(objectUrl)
      urls.clear()
    }
  }, [])

  function saveBlob(blob: Blob, filename: string): void {
    const objectUrl = URL.createObjectURL(blob)
    pendingUrls.current.add(objectUrl)

    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = filename
    anchor.click()

    // Revoking in the same tick cancels the download in some WebKit builds, so
    // the handle is released on a later task — and the set is drained on unmount
    // in case the component goes away before the timer fires.
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl)
      pendingUrls.current.delete(objectUrl)
    }, 10_000)
  }

  function downloadPng(): void {
    const canvas = canvasRef.current
    if (canvas === null) return
    setDownloadError(null)
    canvas.toBlob((blob) => {
      if (blob === null) {
        setDownloadError('The browser could not produce a PNG. Try a smaller size.')
        return
      }
      saveBlob(blob, qrFileName(mode, 'png'))
    }, 'image/png')
  }

  async function downloadSvg(): Promise<void> {
    setDownloadError(null)
    if (drawDark === null || drawLight === null) return
    try {
      const svg = await QRCode.toString(result.payload, {
        type: 'svg',
        errorCorrectionLevel: level,
        width: size,
        margin: 2,
        color: { dark: `${drawDark}ff`, light: `${drawLight}ff` },
      })
      saveBlob(
        new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
        qrFileName(mode, 'svg'),
      )
    } catch {
      setDownloadError('The SVG could not be built. Download the PNG instead.')
    }
  }

  function reset(): void {
    setMode('url')
    setUrl(DEFAULT_URL)
    setText('')
    setSsid('')
    setPassword('')
    setSecurity('WPA')
    setHiddenNetwork(false)
    setVpa('')
    setPayeeName('')
    setAmount('')
    setLevel('M')
    setSize(512)
    setDark(DEFAULT_QR_DARK)
    setLight(DEFAULT_QR_LIGHT)
    setDownloadError(null)
  }

  // Whatever stops a code being drawn, stated once and in priority order: an
  // unusable colour pair first (it invalidates any payload), then a payload that
  // could not be built, then one that will not fit at the chosen level — which is
  // a fixable choice, so the message names the fix.
  const blocking =
    colors.error ??
    result.error ??
    (overflows
      ? `This is ${bytes} bytes, past the ${capacityFor(level)}-byte ceiling at ${LEVEL_LABELS[level]} correction. Lower the correction level or shorten the data.`
      : null)

  const notices: readonly string[] = [
    ...result.warnings,
    ...colors.warnings,
    ...(drawError !== null ? [drawError] : []),
    ...(downloadError !== null ? [downloadError] : []),
  ]

  const scoreTone =
    scanQuality.score >= 80
      ? 'text-green'
      : scanQuality.score >= 50
        ? 'text-cta'
        : 'text-ink-subtle'

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-cream">
      <div className="border-line border-b bg-offwhite">
        <ToolToolbar>
          <span className="font-medium text-[12px] text-ink-subtle uppercase tracking-[0.08em]">
            QR code generator
          </span>
        </ToolToolbar>
      </div>

      {/* An evenly-spaced grid, not the scattered Reset (toolbar) / PNG-SVG
          (bottom bar) buttons this used to be — every page-level action for
          this tool lives here now, at the top. 3 buttons, one even row at
          every width. Brand buttons (`.btn-brutal`) spanning two colour
          modifiers — default cta-yellow on "PNG", the action most visitors
          are actually here for, `btn-white` for the rest. "Copy link" and
          "Copy data" stay where they are: both use the shared `CopyButton`
          component, which every other tool in this codebase leaves
          un-styled to `.btn-brutal` and in its own contextual spot rather
          than pulled into this grid. */}
      <div className="grid grid-cols-3 gap-2 border-line border-b bg-offwhite p-3 sm:gap-3 sm:p-4">
        <button
          type="button"
          onClick={reset}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Reset
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={downloadPng}
          className="btn-brutal btn-brutal-sm w-full"
        >
          <Download className="size-4" aria-hidden="true" />
          PNG
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            void downloadSvg()
          }}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          <Download className="size-4" aria-hidden="true" />
          SVG
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(280px,340px)_1fr_minmax(260px,320px)]">
        {/* Column 1 — type, content, style. */}
        <section
          aria-label="QR type and content"
          className="flex flex-col gap-6 border-line border-b p-5 lg:border-b-0 lg:border-r"
        >
          <div>
            <h3 className="mb-3 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              QR type
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((value) => {
                const Icon = MODE_ICONS[value]
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={mode === value}
                    onClick={() => setMode(value)}
                    className={`flex flex-col items-center gap-1.5 rounded-card border px-3 py-3 transition-colors ${
                      mode === value
                        ? 'border-ink bg-violet-700 text-white'
                        : 'border-line-grey bg-cream text-ink-muted hover:border-ink hover:text-ink'
                    }`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="font-medium text-[13px]">{MODE_LABELS[value]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="border-line-grey border-t pt-5">
            <h3 className="mb-3 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              Content
            </h3>
            <div className="flex flex-col gap-5">
              {mode === 'url' ? (
                <div>
                  <label className="label" htmlFor="qr-url">
                    Link
                  </label>
                  <input
                    id="qr-url"
                    className="field"
                    type="url"
                    inputMode="url"
                    placeholder="https://scult.in/tools"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    aria-describedby="qr-url-hint"
                  />
                  <p className="hint mt-1.5" id="qr-url-hint">
                    Shorter links make a sparser, easier-to-scan matrix.
                  </p>
                </div>
              ) : null}

              {mode === 'text' ? (
                <div>
                  <label className="label" htmlFor="qr-text">
                    Text
                  </label>
                  <textarea
                    id="qr-text"
                    className="field min-h-32 resize-y"
                    rows={5}
                    placeholder="Table 4 — scan to see the menu"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    aria-describedby="qr-text-hint"
                  />
                  <p className="hint mt-1.5" id="qr-text-hint">
                    Phones show it as text rather than opening it.
                  </p>
                </div>
              ) : null}

              {mode === 'wifi' ? (
                <>
                  <div>
                    <label className="label" htmlFor="qr-ssid">
                      Network name (SSID)
                    </label>
                    <input
                      id="qr-ssid"
                      className="field"
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="Cafe Guest"
                      value={ssid}
                      onChange={(e) => setSsid(e.target.value)}
                      aria-describedby="qr-ssid-hint"
                    />
                    <p className="hint mt-1.5" id="qr-ssid-hint">
                      Exactly as it appears in the WiFi list — it is case-sensitive.
                    </p>
                  </div>

                  <fieldset>
                    <legend className="label">Security</legend>
                    <div className="flex flex-wrap gap-2">
                      {SECURITY_OPTIONS.map(([value, optionLabel]) => (
                        <SegmentButton
                          key={value}
                          active={security === value}
                          onClick={() => setSecurity(value)}
                        >
                          {optionLabel}
                        </SegmentButton>
                      ))}
                    </div>
                  </fieldset>

                  {security === 'nopass' ? null : (
                    <div>
                      <label className="label" htmlFor="qr-wifi-password">
                        Password
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="qr-wifi-password"
                          className="field"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="off"
                          spellCheck={false}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <SegmentButton
                          active={showPassword}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </SegmentButton>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <input
                      id="qr-wifi-hidden"
                      type="checkbox"
                      className="mt-0.5 size-4.5 shrink-0 accent-violet-700"
                      checked={hiddenNetwork}
                      onChange={(e) => setHiddenNetwork(e.target.checked)}
                    />
                    <label className="label mb-0" htmlFor="qr-wifi-hidden">
                      This network does not broadcast its name
                    </label>
                  </div>
                </>
              ) : null}

              {mode === 'upi' ? (
                <>
                  <div>
                    <label className="label" htmlFor="qr-vpa">
                      UPI ID (VPA)
                    </label>
                    <input
                      id="qr-vpa"
                      className="field"
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="yourshop@okhdfcbank"
                      value={vpa}
                      onChange={(e) => setVpa(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="qr-payee">
                      Payee name
                    </label>
                    <input
                      id="qr-payee"
                      className="field"
                      type="text"
                      autoComplete="off"
                      placeholder="Scult Studio"
                      value={payeeName}
                      onChange={(e) => setPayeeName(e.target.value)}
                      aria-describedby="qr-payee-hint"
                    />
                    <p className="hint mt-1.5" id="qr-payee-hint">
                      Shown to the payer before they confirm. Most apps refuse a code
                      without it.
                    </p>
                  </div>

                  <div>
                    <label className="label" htmlFor="qr-amount">
                      Amount (₹, optional)
                    </label>
                    <input
                      id="qr-amount"
                      className="field"
                      type="text"
                      inputMode="decimal"
                      placeholder="Leave blank to let the payer choose"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="border-line-grey border-t pt-4">
            <h3 className="mb-1 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              Style
            </h3>
            <div className="flex flex-col">
              <StyleSection icon={SwatchBook} title="Templates" defaultOpen>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map(([name, presetDark, presetLight]) => (
                    <SegmentButton
                      key={name}
                      active={dark === presetDark && light === presetLight}
                      onClick={() => applyColors(presetDark, presetLight)}
                    >
                      {name}
                    </SegmentButton>
                  ))}
                </div>
                <p className="hint">
                  Each preset is a colour pair that keeps enough brightness contrast to
                  scan reliably.
                </p>
              </StyleSection>

              <StyleSection icon={Palette} title="Colors">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ColorField id="qr-dark" label="Code" value={dark} onChange={setDark} />
                  <ColorField
                    id="qr-light"
                    label="Background"
                    value={light}
                    onChange={setLight}
                  />
                </div>
                <p className="hint">
                  A scanner separates the code from its background by brightness, not by
                  hue — so two colours that look different can still fail to read.
                </p>
              </StyleSection>
            </div>
          </div>
        </section>

        {/* Column 2 — the preview. */}
        <section
          aria-label="Your QR code"
          className="flex flex-col gap-5 border-line border-b p-5 lg:border-b-0 lg:border-r"
        >
          <div className="flex items-center justify-center gap-2">
            <SegmentButton
              active={deviceView === 'desktop'}
              onClick={() => setDeviceView('desktop')}
              title="Visual only — the QR matrix itself is identical on every device"
            >
              <span className="inline-flex items-center gap-1.5">
                <Monitor className="size-4" aria-hidden="true" />
                Desktop
              </span>
            </SegmentButton>
            <SegmentButton
              active={deviceView === 'mobile'}
              onClick={() => setDeviceView('mobile')}
              title="Visual only — the QR matrix itself is identical on every device"
            >
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="size-4" aria-hidden="true" />
                Mobile
              </span>
            </SegmentButton>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            {/* Always mounted, hidden rather than unmounted — see the draw effect. */}
            <div
              className={
                ready
                  ? `w-full ${deviceView === 'mobile' ? 'max-w-[220px]' : 'max-w-[400px]'}`
                  : 'hidden'
              }
            >
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={MODE_ALT[mode]}
                className="h-auto w-full rounded-sm border border-line-grey"
              />
            </div>

            {ready ? null : touched && blocking !== null ? (
              <div className="w-full">
                <ErrorDetail message={blocking} />
              </div>
            ) : (
              <p className="max-w-[34ch] text-center text-[14px] text-ink-subtle leading-6">
                Fill in the {MODE_LABELS[mode].toLowerCase()} details on the left and your
                code appears here.
              </p>
            )}
          </div>

          <div className="flex items-start gap-2.5 rounded-card border border-line-grey bg-tile-blue p-3 text-[13px] text-ink-body leading-5">
            <ScanLine
              className="mt-0.5 size-4 shrink-0 text-violet-700"
              aria-hidden="true"
            />
            <span>
              Tip: scan the code with your own phone before sharing it anywhere else.
            </span>
          </div>

          {ready ? (
            <div>
              <p className="label">Encoded data</p>
              <p className="max-h-24 overflow-auto break-all rounded-sm border border-line-grey bg-offwhite p-3 font-mono text-[13px] text-ink-body">
                {result.payload}
              </p>
            </div>
          ) : null}

          {notices.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {notices.map((notice) => (
                <li
                  key={notice}
                  className="flex items-start gap-2 rounded-sm border border-line-grey bg-tile-yellow p-3 text-[13px] text-ink-body leading-5"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{notice}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        {/* Column 3 — scan quality, colour shortcuts, sharing. */}
        <section
          aria-label="Scan quality and sharing"
          className="flex flex-col gap-6 p-5"
        >
          <div>
            <h3 className="mb-3 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              Scan quality
            </h3>
            <div className="flex items-center gap-4">
              <ScoreRing
                value={scanQuality.score}
                label="Scannable"
                toneClass={scoreTone}
              />
              <ul className="flex flex-col gap-1.5">
                {scanQuality.checks.map((check) => (
                  <li
                    key={check.label}
                    className="flex items-start gap-2"
                    title={check.detail}
                  >
                    <Check
                      className={`mt-0.5 size-3.5 shrink-0 ${
                        check.passed ? 'text-green' : 'text-ink-subtle'
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-[13px] ${check.passed ? 'text-ink' : 'text-ink-subtle'}`}
                    >
                      {check.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <fieldset className="mt-4">
              <legend className="label">Error correction</legend>
              <div className="flex flex-wrap gap-2">
                {ERROR_CORRECTION_LEVELS.map((value) => (
                  <SegmentButton
                    key={value}
                    active={level === value}
                    onClick={() => setLevel(value)}
                    title={`${LEVEL_LABELS[value]} — recovers ${LEVEL_RECOVERY[value]} of a damaged code`}
                  >
                    {value}
                  </SegmentButton>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="border-line-grey border-t pt-5">
            <h3 className="mb-3 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              Customize quickly
            </h3>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map(([name, presetDark, presetLight]) => (
                <button
                  key={name}
                  type="button"
                  title={name}
                  aria-pressed={dark === presetDark && light === presetLight}
                  onClick={() => applyColors(presetDark, presetLight)}
                  className={`flex size-9 items-center justify-center rounded-full border transition-colors ${
                    dark === presetDark && light === presetLight
                      ? 'border-ink'
                      : 'border-line-grey hover:border-ink'
                  }`}
                  style={{ background: presetLight }}
                >
                  <span
                    className="size-4 rounded-full"
                    style={{ background: presetDark }}
                    aria-hidden="true"
                  />
                  <span className="sr-only">{name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-line-grey border-t pt-5">
            <h3 className="mb-3 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              Recent colors
            </h3>
            {recentColors.length === 0 ? (
              <p className="hint">Colours you apply appear here for one-click reuse.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recentColors.map(([d, l]) => (
                  <button
                    key={`${d}-${l}`}
                    type="button"
                    title={`${d} on ${l}`}
                    onClick={() => applyColors(d, l)}
                    className="flex size-8 items-center justify-center rounded-full border border-line-grey transition-colors hover:border-ink"
                    style={{ background: l }}
                  >
                    <span
                      className="size-3.5 rounded-full"
                      style={{ background: d }}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{`Reuse ${d} on ${l}`}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-line-grey border-t pt-5">
            <h3 className="mb-3 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              Save &amp; share
            </h3>
            <div className="flex flex-wrap gap-2">
              <CopyButton
                text={typeof window === 'undefined' ? '' : window.location.href}
                label="Copy link"
              />
            </div>
            <p className="hint mt-2">
              Copy the page link to share this setup, or download the code itself using
              the buttons at the top.
            </p>
          </div>
        </section>
      </div>

      {/* Export settings — the PNG size picker feeding the "PNG" download
          button in the top grid, plus the payload copy. Not a button, so it
          stays in its own row rather than moving with the download buttons
          that now live at the top of the tool. */}
      <div className="border-line border-t p-5">
        <h3 className="mb-3 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
          Export settings
        </h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[9rem]">
            <label className="label" htmlFor="qr-size">
              PNG size
            </label>
            <select
              id="qr-size"
              className="field"
              value={size}
              onChange={(e) => setSize(Number(e.target.value) as QrSize)}
            >
              {QR_SIZES.map((value) => (
                <option key={value} value={value}>
                  {value} px — {SIZE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          {ready ? (
            <CopyButton text={result.payload} label="Copy data" />
          ) : (
            <button
              type="button"
              disabled
              className="flex min-h-9 items-center gap-1.5 rounded-sm border border-line-grey bg-cream px-3 font-medium text-[14px] text-ink-subtle opacity-60"
            >
              Copy data
            </button>
          )}
        </div>

        <p className="hint mt-3">
          Only the PNG has a fixed size — the SVG is vector and scales to any width
          without blurring. PDF and EPS aren't available in this build.
        </p>
      </div>

      <div className="border-line border-t bg-offwhite">
        <StatusBar
          state={ready ? 'valid' : touched && blocking !== null ? 'invalid' : 'neutral'}
          message={
            ready
              ? 'Scannable'
              : touched && blocking !== null
                ? 'Not scannable yet'
                : 'Waiting for input'
          }
          stats={[
            { label: `of ${capacityFor(level)} bytes`, value: String(bytes) },
            { label: 'correction', value: `${level} · ${LEVEL_RECOVERY[level]}` },
            ...(colors.ratio !== null
              ? [{ label: 'contrast', value: `${colors.ratio.toFixed(1)}:1` }]
              : []),
          ]}
          privacyNote="Drawn in your browser — no redirect, no tracking"
        />
      </div>
    </div>
  )
}

/**
 * One collapsible row of the Style accordion. Native `<details>`, like the
 * accordions elsewhere in this codebase (ToolShell's FAQ, the FAQ schema
 * preview) — keyboard-operable with no ARIA of its own, and the open state
 * lives in the DOM rather than in React state that would need wiring up.
 */
function StyleSection({
  icon: Icon,
  title,
  defaultOpen = false,
  children,
}: {
  icon: LucideIcon
  title: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    <details
      className="group border-line-grey border-t py-3 first:border-t-0 first:pt-0"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-1">
        <span className="flex items-center gap-2 font-medium text-[13px] text-ink">
          {/* This icon sits directly on the Style column's ambient bg-cream —
              no bg-violet-50/tile-* fill in between — so it falls outside the
              existing dark-mode fix for violet-700-on-tile-fill pairings and
              measures ~2.27:1 in dark mode. --color-violet-accent-text is the
              codebase's existing token for standalone accent text/icons on an
              ambient surface (see .eyebrow / the nav-link hover state); it is
              dark-mode-only, so the fallback keeps light mode unchanged. */}
          <Icon
            className="size-4 text-[var(--color-violet-accent-text,var(--color-violet-700))]"
            aria-hidden="true"
          />
          {title}
        </span>
        <ChevronDown
          className="size-4 text-ink-subtle transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </details>
  )
}

/**
 * A colour input paired with its hex field. Both edit the same value, because the
 * swatch is unusable for anyone typing a brand hex from memory and the text field
 * is unusable for anyone picking by eye.
 *
 * The swatch needs a normalised `#rrggbb`; while someone is mid-way through typing
 * one the raw value is invalid, so the swatch holds its last good value instead of
 * resetting to black on every keystroke.
 */
function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
}) {
  const normalized = normalizeHexColor(value)

  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          // Not the labelled control: it mirrors the hex field, and the label is
          // wired to the text input so a screen reader reads a value, not a swatch.
          aria-label={`${label} colour picker`}
          value={normalized ?? DEFAULT_QR_DARK}
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
        />
      </div>
    </div>
  )
}
