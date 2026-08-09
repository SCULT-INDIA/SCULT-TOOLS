'use client'

import { ArrowRight, Check, Copy, Download, Lock, LockOpen, Shuffle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import { SegmentButton, StatusBar } from '@/components/tools/workspace'
import { trackToolEvent } from '@/lib/analytics'
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
  hexToOklch,
  INVALID_HEX_MESSAGE,
  initialSlots,
  normalizeHex,
  type Oklch,
  oklchToHex,
  type PaletteSlot,
  randomBaseHex,
  type Swatch,
  TOKEN_FORMATS,
  type TokenFormat,
  toSvgSheet,
  toTokens,
  varyHex,
  wcagLevel,
  wcagVerdict,
} from '@/lib/tools/color-palette-generator/logic'

/**
 * Colour palette generator — single-column stack, no `<ToolWorkspace>`.
 * Research brief: docs/research/color-palette-generator.md
 *
 * What changed this pass, and why:
 *   - Dropped the two-pane workspace for one vertical stack: title + harmony ->
 *     the palette itself, full width -> a "generate" row -> a three-column
 *     Adjust/Preview/Accessibility block -> the export bar. Every section reads
 *     top to bottom instead of splitting attention across a left input pane and
 *     a right output pane.
 *   - The harmony swatches are now vertical tiles in a single full-width row
 *     (`PaletteTile`) rather than horizontal bands stacked in a pane — same
 *     data, same lock/re-roll/copy affordances, just laid out the way every
 *     "5 colours side by side" competitor does it.
 *   - "Adjust palette" adds hue/saturation/lightness sliders and a "keep
 *     colours harmonious" toggle. There was no dedicated adjustment function in
 *     logic.ts to reuse, so the sliders are built from the OKLCH round-trip
 *     that already exists and is already tested there (`hexToOklch` /
 *     `oklchToHex`) — no new colour maths was added. With the toggle on, a
 *     slider drag goes through the same `applyHarmony` path as typing a new hex
 *     always has; with it off, only the base slot's colour moves and the rest
 *     of the palette holds still.
 *   - "Live preview" and "Accessibility" are new panels the wireframe asked
 *     for that had no prior UI. Live preview is a static mock card coloured
 *     from the current palette (no fabricated feature). Accessibility reuses
 *     the existing WCAG figures on the base swatch; "Simulate colour
 *     blindness" is a real CSS `feColorMatrix` filter applied to a small
 *     preview strip — genuinely functional, but presentation-only, and it
 *     never touches the hex values a visitor copies.
 *   - "Generate with AI" is the wireframe's AI-shaped affordance with no
 *     backing feature. There is no AI call here: submitting the prompt (or
 *     pressing shuffle) falls back to the same seeded `regenerate()` as the
 *     "Regenerate" action, and the hint under the field says so. "Save
 *     palette" (which had nothing to save to) was removed entirely at the
 *     user's request rather than left as a disabled "coming soon" button.
 *
 * Every colour transform — the OKLab matrices, the hue rotations, the gamut
 * mapping, the WCAG ratios, the slot/lock model and the seeded RNG — still
 * lives in logic.ts, untouched. This file is state, markup, the clipboard and
 * a download anchor.
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

/** Falls back only if `DEFAULT_BASE` were ever malformed — it never is. */
const FALLBACK_SWATCH: Swatch = describeHex('fallback', 'Fallback', DEFAULT_BASE) ?? {
  name: 'fallback',
  label: 'Fallback',
  hex: DEFAULT_BASE,
  oklch: { l: 0, c: 0, h: 0 },
  oklchCss: 'oklch(0% 0 0)',
  contrastOnWhite: 0,
  contrastOnBlack: 0,
  bestTextColor: '#ffffff',
  bestTextContrast: 0,
}

const FALLBACK_OKLCH: Oklch = { l: 0.6, c: 0.15, h: 0 }

/** Slider ceiling for the saturation control. sRGB tops out near 0.37 in OKLCH chroma. */
const MAX_ADJUST_CHROMA = 0.37

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

type ColorblindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'

const COLORBLIND_MODES: readonly {
  readonly value: ColorblindMode
  readonly label: string
}[] = [
  { value: 'none', label: 'None' },
  { value: 'protanopia', label: 'Protanopia' },
  { value: 'deuteranopia', label: 'Deuteranopia' },
  { value: 'tritanopia', label: 'Tritanopia' },
]

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

  /** "Generate with AI" text — cosmetic; submitting it rolls the seeded generator. */
  const [aiPrompt, setAiPrompt] = useState('')
  /** Whether an "Adjust palette" slider drag cascades through the harmony. */
  const [harmonious, setHarmonious] = useState(true)
  const [previewDark, setPreviewDark] = useState(false)
  const [colorblind, setColorblind] = useState<ColorblindMode>('none')

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
  const baseOklch = useMemo(() => hexToOklch(baseHex) ?? FALLBACK_OKLCH, [baseHex])

  const allSwatches = useMemo(
    () => [...swatches, ...ramp.swatches],
    [swatches, ramp.swatches],
  )
  const tokens = useMemo(
    () => toTokens(allSwatches, format, prefix),
    [allSwatches, format, prefix],
  )

  const hueDeg = Math.round(baseOklch.h)
  const chromaPct = clampPercent(Math.round((baseOklch.c / MAX_ADJUST_CHROMA) * 100))
  const lightPct = clampPercent(Math.round(baseOklch.l * 100))
  const baseIndex = specs.findIndex((spec) => spec.name === 'base')
  const primarySwatch = swatches[0] ?? FALLBACK_SWATCH
  const secondarySwatch = swatches[1] ?? ramp.swatches[6] ?? FALLBACK_SWATCH

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
    trackToolEvent('color-palette-generator', 'regenerate')
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

  /**
   * Hue / saturation / lightness sliders in "Adjust palette".
   *
   * There is no dedicated adjustment function in logic.ts, so this composes
   * the OKLCH round-trip that already exists there (`hexToOklch` /
   * `oklchToHex`) rather than adding new colour maths. With "keep colours
   * harmonious" on it goes through the same `applyHarmony` cascade a typed hex
   * always has; with it off, only the base slot moves.
   */
  function adjustBase(patch: Partial<Oklch>): void {
    const next: Oklch = { ...baseOklch, ...patch }
    const nextHex = oklchToHex(next)
    setHexInput(nextHex.toUpperCase())
    setBaseHex(nextHex)

    if (harmonious) {
      setSlots((current) => applyHarmony(current, nextHex, harmony))
    } else {
      const resolvedIndex = baseIndex === -1 ? 0 : baseIndex
      setSlots((current) =>
        current.map((slot, i) =>
          i === resolvedIndex && !slot.locked ? { hex: nextHex, locked: false } : slot,
        ),
      )
    }

    setAction(
      harmonious
        ? `Adjusted to ${nextHex.toUpperCase()} — harmony recalculated`
        : `Adjusted the base to ${nextHex.toUpperCase()} — other swatches held`,
    )
  }

  async function copyHex(swatch: Swatch): Promise<void> {
    try {
      await navigator.clipboard.writeText(swatch.hex)
      setCopiedName(swatch.name)
      setAction(`Copied ${swatch.hex.toUpperCase()}`)
      trackToolEvent('color-palette-generator', 'copy_swatch')
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
    trackToolEvent('color-palette-generator', 'download_tokens', { format })
  }

  function downloadSvg(): void {
    saveBlob(
      new Blob([toSvgSheet(allSwatches, prefix)], {
        type: 'image/svg+xml;charset=utf-8',
      }),
      `${fileStem(prefix)}-palette.svg`,
    )
    setAction('Downloaded the SVG swatch sheet')
    trackToolEvent('color-palette-generator', 'download_svg')
  }

  const defaultMessage = allLocked
    ? 'Every swatch is locked'
    : 'Each swatch is contrast-checked as it is generated'

  return (
    <div ref={workspaceRef} className="flex flex-col gap-6">
      <ColorblindFilters />

      {/* Brand-button grid, positioned at the top — matching the convention
          established across the other tools: `.btn-brutal` buttons spanning
          more than one colour, in an evenly-spaced responsive grid (2/3/4
          columns) rather than a left-packed row. This tool has no
          `ToolToolbar`/card wrapper to anchor to, unlike the multi-column
          tools, so the grid gets its own bordered card rather than being
          sandwiched between two halves of one. Regenerate is the primary
          "why you're here" action (cta-yellow); the rest are `btn-white`. */}
      <div className="grid grid-cols-2 gap-2 rounded-card border border-line-grey bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-4">
        <button
          type="button"
          onClick={regenerate}
          className="btn-brutal btn-brutal-sm col-span-2 w-full text-black hover:text-ink sm:col-span-1"
        >
          Regenerate
        </button>
        <button
          type="button"
          onClick={reset}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={downloadTokens}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          <Download className="size-4" aria-hidden="true" />
          Download file
        </button>
        <button
          type="button"
          onClick={downloadSvg}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          <Download className="size-4" aria-hidden="true" />
          Download SVG sheet
        </button>
      </div>

      <header className="flex flex-col items-center gap-3.5 text-center">
        <h2 className="font-display font-bold text-[26px] text-ink sm:text-[30px]">
          Colour palette generator
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
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
        </div>
        <p className="hint max-w-[46ch]">{HARMONY_NOTE[harmony]}</p>
        <p className="hint inline-flex items-center gap-1.5">
          <kbd className="rounded-sm border border-line-grey bg-cream px-1.5 py-0.5 font-mono text-[11px] text-ink">
            Space
          </kbd>
          regenerates, from anywhere on this tool
        </p>
      </header>

      <section
        aria-label="Your palette"
        className="overflow-hidden rounded-panel border border-ink shadow-brutal"
      >
        <ul className="flex flex-col sm:flex-row">
          {swatches.map((swatch, index) => (
            <PaletteTile
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

        <div className="border-line border-t bg-cream p-3">
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
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          regenerate()
        }}
        className="flex flex-wrap items-center gap-2 rounded-card border border-line-grey bg-cream p-3"
      >
        <label className="sr-only" htmlFor="cpg-ai-prompt">
          Describe a palette
        </label>
        <input
          id="cpg-ai-prompt"
          className="field min-w-[12rem] flex-1"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="Describe the palette you want, e.g. “calm coastal morning”"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
        />
        <button
          type="submit"
          aria-label="Generate a palette from this description"
          className="btn-violet flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-ink transition-colors sm:min-h-9 sm:min-w-9"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
        <p className="hint basis-full">
          No AI here yet — submitting rolls a new palette with the same seeded generator
          as “Regenerate” above.
        </p>
      </form>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdjustPalettePanel
          hexInput={hexInput}
          normalized={normalized}
          baseHex={baseHex}
          baseSwatch={baseSwatch}
          onHexChange={changeHex}
          hue={hueDeg}
          chroma={chromaPct}
          lightness={lightPct}
          onAdjust={adjustBase}
          harmonious={harmonious}
          onHarmoniousChange={setHarmonious}
        />
        <LivePreviewCard
          dark={previewDark}
          onToggleDark={() => setPreviewDark((current) => !current)}
          primary={primarySwatch}
          secondary={secondarySwatch}
        />
        <AccessibilityPanel
          baseSwatch={baseSwatch}
          swatches={swatches}
          colorblind={colorblind}
          onColorblindChange={setColorblind}
        />
      </div>

      <section className="rounded-card border border-line-grey bg-cream p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display font-semibold text-[16px] text-ink">
            Export palette
          </h3>
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
        </div>

        <p className="hint mt-2">{TOKEN_NOTE[format]}</p>

        <div className="mt-3">
          <label className="label" htmlFor="cpg-prefix">
            Token prefix
          </label>
          <input
            id="cpg-prefix"
            className="field max-w-xs"
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

        {/* Download file/SVG sheet moved to the top button grid — "Copy all"
            stays here, contextual to the token preview right above it. */}
        <div className="mt-3">
          <CopyButton
            text={tokens}
            label="Copy all"
            onCopy={() =>
              trackToolEvent('color-palette-generator', 'copy_all', { format })
            }
          />
        </div>

        <p className="hint mt-2">
          The export covers the harmony and all ten ramp steps. The SVG sheet (top button
          grid) prints each hex with its rating, for handing a palette to someone else.
        </p>
      </section>

      <StatusBar
        state={normalized === null ? 'invalid' : 'valid'}
        message={normalized === null ? INVALID_HEX_MESSAGE : (action ?? defaultMessage)}
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
    </div>
  )
}

/**
 * One swatch, full tile — a vertical column in the full-width palette row.
 *
 * Everything inside inherits `color` from the tile's computed safe text colour,
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
function PaletteTile({
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
      className="flex min-h-[13rem] flex-1 flex-col justify-between gap-3 border-line-grey border-b p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
      style={{ backgroundColor: swatch.hex, color: swatch.bestTextColor }}
    >
      <div className="min-w-0">
        <p className="font-mono font-semibold text-[24px] uppercase leading-none tracking-tight tabular-nums">
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
            while the state changes — and the tile's own label spells out
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

/**
 * "Adjust palette" — base hex/picker/presets plus hue/saturation/lightness
 * sliders built on the existing `hexToOklch` / `oklchToHex` round-trip.
 */
function AdjustPalettePanel({
  hexInput,
  normalized,
  baseHex,
  baseSwatch,
  onHexChange,
  hue,
  chroma,
  lightness,
  onAdjust,
  harmonious,
  onHarmoniousChange,
}: {
  hexInput: string
  normalized: string | null
  baseHex: string
  baseSwatch: Swatch | null
  onHexChange: (raw: string) => void
  hue: number
  chroma: number
  lightness: number
  onAdjust: (patch: Partial<Oklch>) => void
  harmonious: boolean
  onHarmoniousChange: (next: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-4 rounded-card border border-line-grey bg-cream p-4">
      <h3 className="font-display font-semibold text-[16px] text-ink">Adjust palette</h3>

      <div>
        <div className="flex gap-2">
          <input
            type="color"
            // Mirrors the hex field rather than being the labelled control:
            // the label is wired to the text input so a screen reader reads
            // a value instead of a swatch.
            aria-label="Base colour picker"
            value={normalized ?? baseHex}
            onChange={(e) => onHexChange(e.target.value)}
            className="size-11 shrink-0 cursor-pointer rounded-sm border border-line-grey bg-cream p-1"
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
              onChange={(e) => onHexChange(e.target.value)}
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
              : `L ${(baseSwatch.oklch.l * 100).toFixed(1)}% · C ${baseSwatch.oklch.c.toFixed(3)} · H ${baseSwatch.oklch.h.toFixed(0)}°`}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {PRESETS.map(([name, hex]) => (
            <SegmentButton
              key={hex}
              active={normalized === hex}
              onClick={() => onHexChange(hex.toUpperCase())}
              title={`${name} — ${hex.toUpperCase()}`}
            >
              {name}
            </SegmentButton>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-line border-t pt-3.5">
        <Slider
          label="Hue"
          value={hue}
          max={359}
          unit="°"
          onChange={(v) => onAdjust({ h: v })}
        />
        <Slider
          label="Saturation"
          value={chroma}
          max={100}
          unit="%"
          onChange={(v) => onAdjust({ c: (v / 100) * MAX_ADJUST_CHROMA })}
        />
        <Slider
          label="Lightness"
          value={lightness}
          max={100}
          unit="%"
          onChange={(v) => onAdjust({ l: v / 100 })}
        />
      </div>

      <label className="flex items-center gap-2 font-medium text-[13px] text-ink">
        <input
          type="checkbox"
          checked={harmonious}
          onChange={(e) => onHarmoniousChange(e.target.checked)}
          className="size-4 rounded-sm border-line-grey"
        />
        Keep colours harmonious
      </label>
    </div>
  )
}

function Slider({
  label,
  value,
  max,
  unit,
  onChange,
}: {
  label: string
  value: number
  max: number
  unit: string
  onChange: (value: number) => void
}) {
  const id = `cpg-slider-${label.toLowerCase()}`
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="font-medium text-[13px] text-ink" htmlFor={id}>
          {label}
        </label>
        <span className="font-mono text-[12px] text-ink-subtle tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-violet-700"
      />
    </div>
  )
}

/**
 * "Live preview" — a static mock card, coloured from the current palette. No
 * prior preview feature existed to reuse, so this is deliberately minimal:
 * primary/secondary swatches only, no invented content.
 */
function LivePreviewCard({
  dark,
  onToggleDark,
  primary,
  secondary,
}: {
  dark: boolean
  onToggleDark: () => void
  primary: Swatch
  secondary: Swatch
}) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-line-grey bg-cream p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-[16px] text-ink">Live preview</h3>
        <button
          type="button"
          aria-pressed={dark}
          onClick={onToggleDark}
          className="min-h-9 rounded-sm border border-line-grey bg-cream px-3 font-medium text-[13px] text-ink-muted transition-colors hover:border-ink hover:text-ink"
        >
          {dark ? 'Dark' : 'Light'}
        </button>
      </div>

      <div
        className={`overflow-hidden rounded-sm border ${dark ? 'border-ink/30' : 'border-line-grey'}`}
      >
        <div
          className={`flex items-center justify-between px-3 py-2 ${dark ? 'bg-black text-white' : 'bg-[#fafafb] text-black'}`}
        >
          <span className="font-display text-[13px] font-semibold">Preview</span>
          <span aria-hidden="true" className="flex gap-1">
            <span className="size-2 rounded-full bg-current opacity-30" />
            <span className="size-2 rounded-full bg-current opacity-30" />
            <span className="size-2 rounded-full bg-current opacity-30" />
          </span>
        </div>
        <div
          className={`flex flex-col gap-3 p-4 ${dark ? 'bg-[#171522] text-white' : 'bg-white text-black'}`}
        >
          <p className="text-[13px] leading-5 opacity-80">
            A small mock composition using your palette as accent colours.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-sm px-3 py-1.5 font-medium text-[13px]"
              style={{ backgroundColor: primary.hex, color: primary.bestTextColor }}
            >
              Primary action
            </span>
            <span
              className="rounded-pill px-2.5 py-1 font-medium text-[12px]"
              style={{ backgroundColor: secondary.hex, color: secondary.bestTextColor }}
            >
              Tag
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * "Accessibility" — the WCAG figures already computed on the base swatch, plus
 * a colour-blindness simulation that is a real `feColorMatrix` filter (see
 * `ColorblindFilters`), applied only to the small preview strip below it. It
 * never touches the hex values a visitor copies elsewhere on the page.
 */
function AccessibilityPanel({
  baseSwatch,
  swatches,
  colorblind,
  onColorblindChange,
}: {
  baseSwatch: Swatch | null
  swatches: readonly Swatch[]
  colorblind: ColorblindMode
  onColorblindChange: (mode: ColorblindMode) => void
}) {
  const passing = baseSwatch !== null && wcagLevel(baseSwatch.bestTextContrast) !== 'Fail'

  return (
    <div className="flex flex-col gap-3.5 rounded-card border border-line-grey bg-cream p-4">
      <h3 className="font-display font-semibold text-[16px] text-ink">Accessibility</h3>

      {baseSwatch === null ? (
        <p className="hint">Enter a valid hex to see the contrast rating.</p>
      ) : (
        <div
          className={`flex items-center gap-3 rounded-sm border border-ink p-3 ${passing ? 'bg-mint' : 'bg-peach'}`}
        >
          <span className="font-display font-bold text-[22px] text-ink tabular-nums">
            {formatRatio(baseSwatch.bestTextContrast)}
          </span>
          <span className="font-semibold text-[13px] text-ink">
            Base colour · {wcagVerdict(baseSwatch.bestTextContrast)}
          </span>
        </div>
      )}

      <div>
        <p className="label">Simulate colour blindness</p>
        <div className="flex flex-wrap gap-1.5">
          {COLORBLIND_MODES.map((mode) => (
            <SegmentButton
              key={mode.value}
              active={colorblind === mode.value}
              onClick={() => onColorblindChange(mode.value)}
            >
              {mode.label}
            </SegmentButton>
          ))}
        </div>
      </div>

      <div>
        <div
          className="flex h-9 gap-1"
          style={{
            filter: colorblind === 'none' ? undefined : `url(#cpg-${colorblind})`,
          }}
        >
          {swatches.map((s) => (
            <span
              key={s.name}
              title={s.hex}
              className="flex-1 rounded-sm border border-line-grey"
              style={{ backgroundColor: s.hex }}
            />
          ))}
        </div>
        <p className="hint mt-1.5">
          Preview only — the copied hex values are never altered by the simulation.
        </p>
      </div>
    </div>
  )
}

/**
 * Hidden SVG filter defs behind "Simulate colour blindness" — standard
 * dichromacy approximation matrices, applied as a CSS `filter: url(#...)`. No
 * layout footprint; exists purely so the `<filter>` elements have somewhere
 * to live in the DOM.
 */
function ColorblindFilters() {
  return (
    <svg
      width={0}
      height={0}
      style={{ position: 'absolute', width: 0, height: 0 }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="cpg-protanopia">
          <feColorMatrix
            type="matrix"
            values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"
          />
        </filter>
        <filter id="cpg-deuteranopia">
          <feColorMatrix
            type="matrix"
            values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
          />
        </filter>
        <filter id="cpg-tritanopia">
          <feColorMatrix
            type="matrix"
            values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  )
}

function textColorName(swatch: Swatch): string {
  return swatch.bestTextColor === '#000000' ? 'Black' : 'White'
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value))
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
