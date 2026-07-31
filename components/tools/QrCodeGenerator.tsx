'use client'

import { Download, TriangleAlert } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  ErrorDetail,
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarAction,
  ToolbarGroup,
  ToolToolbar,
  ToolWorkspace,
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
  QR_SIZES,
  type QrMode,
  type QrSize,
  qrFileName,
  utf8ByteLength,
  type WifiSecurity,
} from '@/lib/tools/qr-code-generator/logic'
import { normalizeHexColor } from '@/lib/tools/shared/color'

/**
 * QR code generator — rebuilt on the shared workspace.
 * Research brief: docs/research/qr-code-generator.md
 *
 * What changed, and why:
 *   - The preview is now the largest thing on the page. Previously it was capped
 *     at 280px in a column that also held four fieldsets, so the thing you came
 *     to look at was the smallest element in view.
 *   - Mode and error correction moved into the toolbar; PNG size moved next to
 *     the PNG button, because it only affects that one download.
 *   - Colour customisation, with a scannability guard. Every competitor lets you
 *     pick two colours and hands back an image; none of them tell you when the
 *     result will not decode. `assessQrColors` blocks inverted and low-contrast
 *     pairs outright rather than shipping a code that fails on a customer's
 *     phone after working on the designer's.
 *
 * Everything deciding *what* is encoded stays in logic.ts. This file holds state,
 * markup, and the two things that genuinely need a browser: drawing the matrix
 * onto a <canvas>, and handing a Blob to a download anchor.
 *
 * Nothing is uploaded. `qrcode` runs in this tab, so a WiFi password or a UPI
 * address never crosses the network, and the code carries the data itself rather
 * than a link through a redirect we would have to keep alive forever.
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

  return (
    <ToolWorkspace
      inputLabel="QR code contents"
      outputLabel="Your QR code"
      // A floor AND a cap from `lg` up. Without the cap the grid row is
      // auto-sized, so this pane's taller side wins and leaves dead space beside
      // the shorter preview column — and the whole workspace grows past the
      // viewport. Capping keeps the toolbar and status bar in view and lets each
      // pane scroll on its own.
      minHeight="min-h-[32rem] lg:h-[38rem]"
      toolbar={
        <ToolToolbar actions={<ToolbarAction onClick={reset}>Reset</ToolbarAction>}>
          <ToolbarGroup label="Encodes">
            {MODES.map((value) => (
              <SegmentButton
                key={value}
                active={mode === value}
                onClick={() => setMode(value)}
              >
                {MODE_LABELS[value]}
              </SegmentButton>
            ))}
          </ToolbarGroup>

          <ToolbarGroup label="Correction">
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
          </ToolbarGroup>
        </ToolToolbar>
      }
      input={
        <Pane title={`${MODE_LABELS[mode]} details`}>
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

            <fieldset className="border-line border-t pt-4">
              <legend className="label px-0">Colours</legend>

              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map(([name, presetDark, presetLight]) => (
                  <SegmentButton
                    key={name}
                    active={dark === presetDark && light === presetLight}
                    onClick={() => {
                      setDark(presetDark)
                      setLight(presetLight)
                    }}
                  >
                    {name}
                  </SegmentButton>
                ))}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <ColorField id="qr-dark" label="Code" value={dark} onChange={setDark} />
                <ColorField
                  id="qr-light"
                  label="Background"
                  value={light}
                  onChange={setLight}
                />
              </div>

              <p className="hint mt-2">
                A scanner separates the code from its background by brightness, not by hue
                — so two colours that look different can still fail to read.
              </p>
            </fieldset>
          </div>
        </Pane>
      }
      output={
        <Pane
          title="Your QR code"
          actions={ready ? <CopyButton text={result.payload} label="Copy data" /> : null}
        >
          <div className="flex h-full flex-col gap-5">
            <div className="flex flex-1 items-center justify-center">
              {/* Always mounted, hidden rather than unmounted — see the draw effect. */}
              <div className={ready ? 'w-full max-w-[400px]' : 'hidden'}>
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
                  Fill in the {MODE_LABELS[mode].toLowerCase()} details on the left and
                  your code appears here.
                </p>
              )}
            </div>

            {ready ? (
              <div className="flex flex-col gap-4 border-line border-t pt-4">
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

                  <button
                    type="button"
                    className="btn-brutal btn-brutal-sm btn-white"
                    onClick={downloadPng}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    PNG
                  </button>
                  <button
                    type="button"
                    className="btn-brutal btn-brutal-sm btn-white"
                    onClick={() => {
                      void downloadSvg()
                    }}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    SVG
                  </button>
                </div>

                <p className="hint">
                  Only the PNG has a fixed size — the SVG is vector and scales to any
                  width without blurring.
                </p>

                <div>
                  <p className="label">Encoded data</p>
                  <p className="max-h-24 overflow-auto break-all rounded-sm border border-line-grey bg-offwhite p-3 font-mono text-[13px] text-ink-body">
                    {result.payload}
                  </p>
                </div>
              </div>
            ) : null}

            {notices.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {notices.map((notice) => (
                  <li
                    key={notice}
                    className="flex items-start gap-2 rounded-sm border border-line-grey bg-tile-yellow p-3 text-[13px] text-ink-body leading-5"
                  >
                    <TriangleAlert
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{notice}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Pane>
      }
      status={
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
      }
    />
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
        />
      </div>
    </div>
  )
}
