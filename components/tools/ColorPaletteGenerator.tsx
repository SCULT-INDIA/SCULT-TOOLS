'use client'

import { Check, Copy, Download, Lock, LockOpen, Shuffle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarAction,
  ToolbarGroup,
  ToolToolbar,
  ToolWorkspace,
} from '@/components/tools/workspace'
import {
  applyHarmony,
  createRng,
  describeHex,
  describeSlots,
  formatRatio,
  generateRamp,
  HARMONIES,
  type Harmony,
  harmonySlots,
  INVALID_HEX_MESSAGE,
  initialSlots,
  normalizeHex,
  type PaletteSlot,
  randomBaseHex,
  type Swatch,
  TOKEN_FORMATS,
  type TokenFormat,
  toSvgSheet,
  toTokens,
  varyHex,
  wcagVerdict,
} from '@/lib/tools/color-palette-generator/logic'

/**
 * Colour palette generator — rebuilt on the shared workspace.
 * Research brief: docs/research/color-palette-generator.md
 *
 * What changed, and why:
 *   - The palette IS the right pane. Previously the swatches lived in two grids
 *     below the fold while the first screen was taken up by four fieldsets and a
 *     seven-row table of the base colour's coordinates — the product was the
 *     smallest thing in view. Now it is full-width horizontal bands filling the
 *     pane height, so a 2-swatch complement and a 5-swatch monochrome ramp both
 *     look deliberate and every band is wide enough to state its contrast verdict
 *     in words.
 *   - Lock and re-roll per swatch, and Space to regenerate — the three
 *     interactions three of the five competitors have and we had none of.
 *   - Export grew from two formats to four plus a printable SVG sheet, and the
 *     JSON export carries the contrast figures so the accessibility work survives
 *     leaving the tool.
 *
 * Every colour transform — the OKLab matrices, the hue rotations, the gamut
 * mapping, the WCAG ratios, the slot/lock model and the seeded RNG — lives in
 * logic.ts. This file is state, markup, the clipboard and a download anchor.
 *
 * Hydration: `SEED_SLOTS` is computed once at module scope from a fixed base and
 * a fixed harmony, so the server HTML and the client's first render are byte
 * identical. `Math.random()` appears nowhere in the module; the seeded generator
 * is created lazily inside the first event handler that needs it.
 */

const DEFAULT_BASE = '#7030f8'
const DEFAULT_HARMONY: Harmony = 'analogous'

/** Deterministic first paint — see the hydration note above. */
const SEED_SLOTS = initialSlots(DEFAULT_BASE, DEFAULT_HARMONY)

/** Brand colours, so the presets double as a demonstration of the site's own set. */
const PRESETS: readonly (readonly [string, string])[] = [
  ['Violet', '#7030f8'],
  ['Mint', '#1ae39b'],
  ['Signal', '#fac44b'],
  ['Indigo', '#16018e'],
]

const HARMONY_NOTE: Record<Harmony, string> = {
  complementary:
    'The base plus the hue 180° opposite it, at the same perceived lightness.',
  analogous:
    'The base plus its neighbours at −30° and +30°, at the same perceived lightness.',
  triadic: 'Three hues spaced 120° apart, all at the same perceived lightness.',
  monochrome: 'One hue, five steps of lightness, with chroma tapered toward the ends.',
}

const TOKEN_NOTE: Record<TokenFormat, string> = {
  css: 'Custom properties on :root, with the exact OKLCH in a comment beside each hex.',
  tailwind:
    'A Tailwind v4 @theme block. v4 is CSS-first — there is no JS config to edit.',
  json: 'Every colour with its two contrast ratios, its safe text colour and its WCAG level.',
  hex: 'One hex per line — the shape a Figma or Sketch swatch import expects.',
}

/** How long a “Copied” confirmation stays on a swatch. */
const COPIED_MS = 2000

export function ColorPaletteGenerator() {
  const [harmony, setHarmony] = useState<Harmony>(DEFAULT_HARMONY)
  /** The raw text in the hex field — may be half-typed and unparseable. */
  const [hexInput, setHexInput] = useState(DEFAULT_BASE.toUpperCase())
  /** The last hex that actually parsed. Always valid, so the ramp never breaks. */
  const [baseHex, setBaseHex] = useState(DEFAULT_BASE)
  const [slots, setSlots] = useState<readonly PaletteSlot[]>(SEED_SLOTS)
  const [format, setFormat] = useState<TokenFormat>('css')
  const [prefix, setPrefix] = useState('brand')
  const [action, setAction] = useState<string | null>(null)
  const [copiedName, setCopiedName] = useState<string | null>(null)

  const workspaceRef = useRef<HTMLDivElement | null>(null)
  const rngRef = useRef<(() => number) | null>(null)
  const pendingUrls = useRef<Set<string>>(new Set())

  /**
   * The random source, created on first use rather than on mount. Seeding from
   * `Date.now()` during render would be a hydration mismatch; doing it inside a
   * handler cannot be, because handlers only ever run in the browser.
   */
  const getRng = useCallback((): (() => number) => {
    rngRef.current ??= createRng(Date.now() >>> 0)
    return rngRef.current
  }, [])

  const normalized = useMemo(() => normalizeHex(hexInput), [hexInput])
  const specs = useMemo(() => harmonySlots(harmony), [harmony])
  const swatches = useMemo(() => describeSlots(slots, harmony), [slots, harmony])
  const ramp = useMemo(() => generateRamp(baseHex), [baseHex])
  const baseSwatch = useMemo(() => describeHex('base', 'Base', baseHex), [baseHex])

  const allSwatches = useMemo(
    () => [...swatches, ...ramp.swatches],
    [swatches, ramp.swatches],
  )
  const tokens = useMemo(
    () => toTokens(allSwatches, format, prefix),
    [allSwatches, format, prefix],
  )

  const lockedCount = slots
    .slice(0, swatches.length)
    .reduce((total, slot) => (slot.locked ? total + 1 : total), 0)
  const allLocked = swatches.length > 0 && lockedCount === swatches.length

  useEffect(() => {
    if (copiedName === null) return
    const timer = setTimeout(() => setCopiedName(null), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copiedName])

  useEffect(() => {
    const urls = pendingUrls.current
    return () => {
      for (const objectUrl of urls) URL.revokeObjectURL(objectUrl)
      urls.clear()
    }
  }, [])

  const regenerate = useCallback(() => {
    const next = randomBaseHex(getRng())
    setBaseHex(next)
    setHexInput(next.toUpperCase())
    setSlots((current) => applyHarmony(current, next, harmony))
    setAction(
      allLocked
        ? `New base ${next.toUpperCase()} — every band is locked, so only the ramp moved`
        : `New palette from ${next.toUpperCase()}`,
    )
  }, [allLocked, getRng, harmony])

  /**
   * Space regenerates — Coolors' shortcut, with the two guards it needs here.
   *
   * Space is also the page's scroll key, and unlike Coolors this route is not
   * only the tool: there is an explanation and an FAQ underneath. An
   * unconditional window listener would take scrolling away from all of it, so
   * the shortcut only claims the key while the workspace is actually on screen.
   * That check is a synchronous rect read at keydown rather than an
   * IntersectionObserver: no observer to keep in sync with layout, no async state
   * that can be stale on the first keypress, and one layout read per Space press
   * is free.
   */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.code !== 'Space' && event.key !== ' ') return
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (isTypingOrActivating(event.target)) return
      if (!isOnScreen(workspaceRef.current)) return
      event.preventDefault()
      regenerate()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [regenerate])

  function changeHex(raw: string): void {
    setHexInput(raw)
    setAction(null)
    const next = normalizeHex(raw)
    if (next === null) return
    setBaseHex(next)
    setSlots((current) => applyHarmony(current, next, harmony))
  }

  function changeHarmony(next: Harmony): void {
    const nextSlots = applyHarmony(slots, baseHex, next)
    setHarmony(next)
    setSlots(nextSlots)
    const label = HARMONIES.find((option) => option.value === next)?.label ?? next
    setAction(`${label} — ${nextSlots.length} swatches`)
  }

  function toggleLock(index: number): void {
    const slot = slots[index]
    const swatch = swatches[index]
    if (slot === undefined || swatch === undefined) return
    setSlots(
      slots.map((current, i) =>
        i === index ? { hex: current.hex, locked: !current.locked } : current,
      ),
    )
    setAction(
      slot.locked
        ? `Unlocked ${swatch.hex.toUpperCase()} — it follows the harmony again`
        : `Locked ${swatch.hex.toUpperCase()}`,
    )
  }

  function reroll(index: number): void {
    const slot = slots[index]
    if (slot === undefined) return
    const nextHex = varyHex(slot.hex, getRng())
    setSlots(
      slots.map((current, i) => (i === index ? { ...current, hex: nextHex } : current)),
    )
    setAction(`Swapped in ${nextHex.toUpperCase()} — same hue, new tone`)
  }

  async function copyHex(swatch: Swatch): Promise<void> {
    try {
      await navigator.clipboard.writeText(swatch.hex)
      setCopiedName(swatch.name)
      setAction(`Copied ${swatch.hex.toUpperCase()}`)
    } catch {
      // Blocked by permissions policy or an insecure origin.
      setAction(
        'The browser blocked the clipboard — select the hex and copy it manually.',
      )
    }
  }

  function reset(): void {
    setHarmony(DEFAULT_HARMONY)
    setHexInput(DEFAULT_BASE.toUpperCase())
    setBaseHex(DEFAULT_BASE)
    setSlots(SEED_SLOTS)
    setFormat('css')
    setPrefix('brand')
    setAction('Back to the starting palette')
  }

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

  function downloadTokens(): void {
    const spec = TOKEN_FORMATS.find((entry) => entry.value === format)
    if (spec === undefined) return
    saveBlob(
      new Blob([tokens], { type: `${spec.mime};charset=utf-8` }),
      `${fileStem(prefix)}-palette.${spec.extension}`,
    )
    setAction(`Downloaded the ${spec.label} export`)
  }

  function downloadSvg(): void {
    saveBlob(
      new Blob([toSvgSheet(allSwatches, prefix)], {
        type: 'image/svg+xml;charset=utf-8',
      }),
      `${fileStem(prefix)}-palette.svg`,
    )
    setAction('Downloaded the SVG swatch sheet')
  }

  const defaultMessage = allLocked
    ? 'Every swatch is locked'
    : 'Each swatch is contrast-checked as it is generated'

  return (
    <div ref={workspaceRef}>
      <ToolWorkspace
        inputLabel="Base colour and export"
        outputLabel="Your palette"
        minHeight="min-h-[33rem]"
        outputFirstOnMobile
        toolbar={
          <ToolToolbar
            actions={
              <>
                <ToolbarAction onClick={regenerate}>Regenerate</ToolbarAction>
                <ToolbarAction onClick={reset}>Reset</ToolbarAction>
              </>
            }
          >
            <ToolbarGroup label="Harmony">
              {HARMONIES.map((option) => (
                <SegmentButton
                  key={option.value}
                  active={harmony === option.value}
                  onClick={() => changeHarmony(option.value)}
                  // The visible text is repeated inside the tooltip on purpose.
                  // `title` is the accname fallback for a button, and a tooltip
                  // that does not contain the visible label risks WCAG 2.5.3
                  // Label in Name wherever the fallback is what gets used.
                  title={`${option.label} — ${HARMONY_NOTE[option.value]}`}
                >
                  {option.label}
                </SegmentButton>
              ))}
            </ToolbarGroup>
          </ToolToolbar>
        }
        input={
          <Pane title="Base colour & export">
            <div className="flex flex-col gap-5">
              <fieldset>
                <legend className="label">Base colour</legend>

                <div className="flex gap-2">
                  <input
                    type="color"
                    // Mirrors the hex field rather than being the labelled
                    // control: the label is wired to the text input so a screen
                    // reader reads a value instead of a swatch.
                    aria-label="Base colour picker"
                    value={normalized ?? baseHex}
                    onChange={(e) => changeHex(e.target.value)}
                    className="size-11 shrink-0 cursor-pointer rounded-sm border border-line-grey bg-white p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <label className="sr-only" htmlFor="cpg-hex">
                      Base colour hex
                    </label>
                    <input
                      id="cpg-hex"
                      className="field font-mono uppercase"
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      maxLength={7}
                      value={hexInput}
                      onChange={(e) => changeHex(e.target.value)}
                      aria-invalid={normalized === null}
                      aria-describedby="cpg-hex-hint"
                    />
                  </div>
                </div>

                <p className="hint mt-1.5" id="cpg-hex-hint">
                  {normalized === null
                    ? INVALID_HEX_MESSAGE
                    : baseSwatch === null
                      ? 'Shorthand like #4B2 works too.'
                      : `L ${(baseSwatch.oklch.l * 100).toFixed(1)}% · C ${baseSwatch.oklch.c.toFixed(3)} · H ${baseSwatch.oklch.h.toFixed(0)}° — shorthand like #4B2 works too.`}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS.map(([name, hex]) => (
                    <SegmentButton
                      key={hex}
                      active={normalized === hex}
                      onClick={() => changeHex(hex.toUpperCase())}
                      title={`${name} — ${hex.toUpperCase()}`}
                    >
                      {name}
                    </SegmentButton>
                  ))}
                </div>

                <p className="hint mt-2">{HARMONY_NOTE[harmony]}</p>
              </fieldset>

              <fieldset className="border-line border-t pt-4">
                <legend className="label px-0">Export</legend>

                <div className="flex flex-wrap gap-2">
                  {TOKEN_FORMATS.map((entry) => (
                    <SegmentButton
                      key={entry.value}
                      active={format === entry.value}
                      onClick={() => setFormat(entry.value)}
                    >
                      {entry.label}
                    </SegmentButton>
                  ))}
                </div>

                <p className="hint mt-2">{TOKEN_NOTE[format]}</p>

                <div className="mt-3">
                  <label className="label" htmlFor="cpg-prefix">
                    Token prefix
                  </label>
                  <input
                    id="cpg-prefix"
                    className="field"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={24}
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    aria-describedby="cpg-prefix-hint"
                  />
                  <p className="hint mt-1.5" id="cpg-prefix-hint">
                    Names the generated tokens, e.g. <code>--brand-500</code>.
                  </p>
                </div>

                <pre className="mt-3 max-h-56 overflow-auto rounded-sm border border-line-grey bg-offwhite p-3 font-mono text-[12px] text-ink-body leading-[1.6]">
                  <code>{tokens}</code>
                </pre>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <CopyButton text={tokens} label="Copy export" />
                  <button
                    type="button"
                    className="flex min-h-11 items-center gap-1.5 rounded-sm border border-line-grey bg-white px-3 font-medium text-[14px] transition-colors hover:border-ink"
                    onClick={downloadTokens}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    File
                  </button>
                  <button
                    type="button"
                    className="flex min-h-11 items-center gap-1.5 rounded-sm border border-line-grey bg-white px-3 font-medium text-[14px] transition-colors hover:border-ink"
                    onClick={downloadSvg}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    SVG sheet
                  </button>
                </div>

                <p className="hint mt-2">
                  The export covers the harmony and all ten ramp steps. The SVG sheet
                  prints each hex with its rating, for handing a palette to someone else.
                </p>
              </fieldset>
            </div>
          </Pane>
        }
        output={
          <Pane
            title="Your palette"
            padded={false}
            // Scrolls rather than clips. The bands hold a floor height so five of
            // them (monochrome) plus the ramp can exceed the pane on a short
            // viewport, and the workspace root is `overflow-hidden` — without
            // this the last band would be cut off instead of reachable.
            scroll
            actions={
              <span className="hint">
                <kbd className="rounded-sm border border-line-grey bg-white px-1.5 py-0.5 font-mono text-[11px] text-ink">
                  Space
                </kbd>{' '}
                regenerates
              </span>
            }
          >
            <div className="flex h-full flex-col">
              <ul className="flex flex-1 flex-col">
                {swatches.map((swatch, index) => (
                  <SwatchBand
                    key={swatch.name}
                    swatch={swatch}
                    // The stable role name, not `swatch.label` — that one gains a
                    // "· locked" suffix, and an accessible name that changes when
                    // a toggle is pressed defeats the point of `aria-pressed`.
                    role={specs[index]?.label ?? swatch.name}
                    locked={slots[index]?.locked === true}
                    copied={copiedName === swatch.name}
                    onToggleLock={() => toggleLock(index)}
                    onReroll={() => reroll(index)}
                    onCopy={() => {
                      void copyHex(swatch)
                    }}
                  />
                ))}
              </ul>

              <div className="shrink-0 border-line border-t p-3">
                <p className="label mb-2">Tints &amp; shades of the base hue</p>
                <ul className="grid grid-cols-5 gap-1 sm:grid-cols-10">
                  {ramp.swatches.map((step) => (
                    <li key={step.name}>
                      <button
                        type="button"
                        onClick={() => {
                          void copyHex(step)
                        }}
                        title={`${step.hex.toUpperCase()} — ${textColorName(step)} text, ${wcagVerdict(step.bestTextContrast)}`}
                        aria-label={`Copy ${step.hex} — step ${step.name}, ${textColorName(step)} text safe, ${formatRatio(step.bestTextContrast)}, ${wcagVerdict(step.bestTextContrast)}`}
                        // `border-current`, not `border-ink`: a black outline on
                        // the step-900 swatch is invisible against it, whereas the
                        // computed safe text colour is guaranteed to contrast.
                        className="flex h-16 w-full flex-col items-center justify-center gap-0.5 rounded-sm border border-current font-mono text-[11px] leading-none transition-shadow hover:shadow-[inset_0_0_0_2px_currentColor]"
                        style={{ backgroundColor: step.hex, color: step.bestTextColor }}
                      >
                        <span className="font-semibold">{step.name}</span>
                        <span>
                          {copiedName === step.name
                            ? 'copied'
                            : step.hex.slice(1).toUpperCase()}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="hint mt-2">Click a step to copy it.</p>
              </div>
            </div>
          </Pane>
        }
        status={
          <StatusBar
            state={normalized === null ? 'invalid' : 'valid'}
            message={
              normalized === null ? INVALID_HEX_MESSAGE : (action ?? defaultMessage)
            }
            stats={[
              { label: 'base', value: baseHex.toUpperCase() },
              { label: `of ${swatches.length} locked`, value: String(lockedCount) },
              ...(baseSwatch === null
                ? []
                : [
                    {
                      label: 'base on white',
                      value: formatRatio(baseSwatch.contrastOnWhite),
                    },
                  ]),
            ]}
            privacyNote="Computed in your browser — nothing uploaded, nothing stored"
          />
        }
      />
    </div>
  )
}

/**
 * One swatch, full pane width.
 *
 * Everything inside inherits `color` from the band's computed safe text colour,
 * including the buttons' `border-current` outlines. That is deliberate: the
 * background is a colour the visitor generated, so `border-line-grey` or
 * `text-ink-subtle` on it would have no guaranteed contrast, whereas the safe
 * text colour is at least 4.58:1 here and therefore also clears the 3:1 that
 * WCAG 1.4.11 wants from a control's boundary.
 *
 * No `opacity` on any of this text. The margin over AA can be as little as
 * 0.08 on a mid-tone swatch, so dimming a line to 90% for visual hierarchy would
 * push it below the threshold the tool is claiming to guarantee. Hierarchy comes
 * from size and weight instead.
 */
function SwatchBand({
  swatch,
  role,
  locked,
  copied,
  onToggleLock,
  onReroll,
  onCopy,
}: {
  swatch: Swatch
  /** The position's stable name — "Base", "Complement +180°", "Tint +1". */
  role: string
  locked: boolean
  copied: boolean
  onToggleLock: () => void
  onReroll: () => void
  onCopy: () => void
}) {
  const LockIcon = locked ? Lock : LockOpen

  return (
    <li
      className="flex min-h-[4.25rem] flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-line border-b px-4 py-3 last:border-b-0"
      style={{ backgroundColor: swatch.hex, color: swatch.bestTextColor }}
    >
      <div className="min-w-0">
        <p className="font-mono font-semibold text-[22px] uppercase leading-none tracking-tight tabular-nums">
          {swatch.hex}
        </p>
        {/* The verdict is a sentence, not a tint: it has to read the same in
            greyscale, in a screenshot and to a screen reader. */}
        <p className="mt-1.5 font-semibold text-[13px] leading-4">
          {textColorName(swatch)} text safe · {wcagVerdict(swatch.bestTextContrast)} ·{' '}
          {formatRatio(swatch.bestTextContrast)}
        </p>
        <p className="mt-1 text-[12px] leading-4">{swatch.label}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <BandButton
          label={copied ? 'Copied' : 'Copy'}
          accessibleName={`Copy ${swatch.hex} — the ${role} swatch`}
          onClick={onCopy}
        >
          {copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
        </BandButton>

        <BandButton
          accessibleName={`Try a different tone for the ${role} swatch`}
          onClick={onReroll}
        >
          <Shuffle className="size-4" aria-hidden="true" />
        </BandButton>

        {/* Icon-only and `aria-pressed`, so the accessible name stays stable
            while the state changes — and the band's own label spells out
            "locked" in words, so the state is never carried by the icon alone. */}
        <BandButton
          accessibleName={`Lock the ${role} swatch so it survives regeneration`}
          pressed={locked}
          onClick={onToggleLock}
        >
          <LockIcon className="size-4" aria-hidden="true" />
        </BandButton>
      </div>
    </li>
  )
}

function BandButton({
  children,
  label,
  accessibleName,
  onClick,
  pressed,
}: {
  children: React.ReactNode
  label?: string
  accessibleName: string
  onClick: () => void
  pressed?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={accessibleName}
      aria-pressed={pressed}
      title={accessibleName}
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-sm border border-current bg-transparent px-2.5 font-medium text-[13px] transition-shadow hover:shadow-[inset_0_0_0_1px_currentColor]"
    >
      {children}
      {label ? <span>{label}</span> : null}
    </button>
  )
}

function textColorName(swatch: Swatch): string {
  return swatch.bestTextColor === '#000000' ? 'Black' : 'White'
}

/**
 * True when Space belongs to the focused element rather than to the shortcut.
 *
 * Text fields are the obvious case. Buttons and links are the one people forget:
 * without them the shortcut would swallow Space from every lock, re-roll and copy
 * control in the pane, which is a keyboard trap wearing a shortcut's clothes.
 */
function isTypingOrActivating(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  return ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A', 'OPTION'].includes(target.tagName)
}

/**
 * Whether the workspace is vertically within the viewport.
 *
 * Fails open in both unmeasurable cases — no ref yet, or no viewport height to
 * compare against (a zero-height frame, a not-yet-composited embed). The check
 * exists to hand Space back to the page's scrolling once you have scrolled past
 * the tool, so when it cannot answer, the right default is to let the shortcut
 * work rather than to silently disable it.
 */
function isOnScreen(node: HTMLElement | null): boolean {
  if (node === null) return true
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  if (viewportHeight <= 0) return true
  const rect = node.getBoundingClientRect()
  return rect.bottom > 0 && rect.top < viewportHeight
}

/** A filesystem-safe stem from the token prefix. */
function fileStem(prefix: string): string {
  const cleaned = prefix
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned === '' ? 'brand' : cleaned
}
