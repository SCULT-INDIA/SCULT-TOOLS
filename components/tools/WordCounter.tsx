'use client'

import {
  AlignLeft,
  BookOpen,
  CaseSensitive,
  Gauge,
  Hash,
  Maximize,
  Mic,
  Minimize,
  Pilcrow,
  Ruler,
  Type,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SegmentButton, StatCard, StatusBar } from '@/components/tools/workspace'
import { trackToolEvent } from '@/lib/analytics'
import {
  analyzeText,
  bigramDensity,
  type DensityEntry,
  formatDuration,
  PLATFORM_LIMITS,
} from '@/lib/tools/word-counter/logic'

/**
 * Word counter — a minimal insights strip up top, then a single-column
 * writing surface below it: the full-width editor and its controls on top,
 * with a full-width goal/limits/breakdown detail column stacked beneath it.
 * All nine stats used to live stacked above the goal bar in that detail
 * column — below the editor, but also as tall as it, and nine sublabeled
 * tiles read as a second dashboard, not a glance. Now only the four
 * actually-headline numbers (Words, Characters, Sentences, Reading time —
 * no sublabels) sit in their own low strip above everything; the other five
 * (Paragraphs, Speaking time, Reading level, Keyword density, Average word)
 * moved to a smaller grid at the top of the detail column instead of
 * disappearing — still one click of scrolling away, just not competing for
 * the first glance.
 *
 * Two real, verified bugs in the previous version, fixed here:
 * 1. The editor's own height. It sat inside `Pane` (padded={false}
 *    scroll={false}) inside a `flex min-h-[22rem] flex-col` wrapper, with
 *    the textarea itself sized via `size-full` (height:100%). A `min-height`
 *    (not `height`) on a flex column container doesn't reliably give its
 *    `flex-1` children a *definite* height for a percentage-height
 *    grandchild to resolve against — confirmed live: the textarea was
 *    rendering at its browser-default ~2-row intrinsic height, with a
 *    scrollbar hiding the rest of the sample text, while a large unused
 *    band of empty cream space sat below it inside the same bordered card.
 *    Fixed by giving the textarea an explicit height directly
 *    (min-h-[28rem], resizable), not a percentage of an ambiguous ancestor.
 * 2. Three separate stacked bordered/bg-different strips (the Keywords+Goal
 *    toolbar, the Load sample/Clear button row, then the editor's own "YOUR
 *    TEXT" pane) read as three different UI pieces instead of one. Merged
 *    into a single toolbar directly attached to the editor.
 *
 * Every count still lives in logic.ts and is already tested — including the
 * part that makes the tool worth using, which is `Intl.Segmenter` grapheme
 * counting. A naive `.length` reports a ZWJ family emoji as 7 characters;
 * the platform limits below are enforced in a unit much closer to
 * graphemes, so the naive number is wrong precisely where being wrong costs
 * you a truncated post.
 */

const DRAFT_KEY = 'scult-tools:word-counter:v1'

/** Drafts beyond this are not persisted — localStorage quota is ~5MB. */
const MAX_DRAFT_LENGTH = 500_000

/** Above this a "goal" is a typo, not an intention. */
const MAX_GOAL = 1_000_000

/** Long sentences are quoted, not reproduced in full. */
const LONGEST_PREVIEW_CHARS = 220

/**
 * Seeded so the first paint shows the tool working — and chosen to demonstrate
 * the USP rather than merely fill space: it contains an emoji, so the character
 * count here visibly disagrees with what a naive counter reports.
 */
const SAMPLE = `Good writing is rewriting. The first draft exists to find the argument; the second exists to remove everything that was only there to help you find it. 👋

Cut the qualifiers. Cut the sentence that restates the sentence before it. What survives is usually shorter, plainer, and far more convincing than what you started with.`

const numberFormat = new Intl.NumberFormat('en-US')

function fmt(n: number): string {
  return numberFormat.format(n)
}

type DensityMode = 'words' | 'phrases'

export function WordCounter() {
  const [text, setText] = useState(SAMPLE)
  const [restored, setRestored] = useState(false)
  const [densityMode, setDensityMode] = useState<DensityMode>('words')
  const [goalRaw, setGoalRaw] = useState('')
  const loadedRef = useRef(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenSupported, setFullscreenSupported] = useState(false)

  // Restore the draft after mount, never during render: the server has no
  // localStorage, and seeding state from it would break hydration.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY)
      if (stored !== null && stored.trim() !== '' && stored !== SAMPLE) {
        setText(stored)
        setRestored(true)
      }
    } catch {
      // Blocked storage — start from the sample instead.
    }
    loadedRef.current = true
  }, [])

  // Debounced autosave. The sample is never persisted, so a first-time visitor
  // who types nothing does not get a fake "draft" next visit.
  useEffect(() => {
    if (!loadedRef.current) return
    const timer = setTimeout(() => {
      try {
        if (text === SAMPLE) return
        if (text === '') {
          localStorage.removeItem(DRAFT_KEY)
        } else if (text.length <= MAX_DRAFT_LENGTH) {
          localStorage.setItem(DRAFT_KEY, text)
        }
      } catch {
        // Private mode blocks writes; counting still works, so stay silent.
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [text])

  // Feature-detect after mount, not during render: `document` doesn't exist
  // during SSR, so checking it at render time would break hydration.
  useEffect(() => {
    setFullscreenSupported(typeof document !== 'undefined' && document.fullscreenEnabled)
  }, [])

  // Fullscreen can exit via more than the toggle button — the browser's own
  // Escape-key handling exits it too, and that path never runs our click
  // handler. Listening for the document-level event is the only way to
  // stay in sync with fullscreen state no matter how it changed.
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === editorRef.current)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const stats = useMemo(() => analyzeText(text), [text])
  // Only computed when the phrases view is showing — bigram counting walks every
  // sentence, and there is no reason to pay for it on each keystroke otherwise.
  const bigrams = useMemo(
    () => (densityMode === 'phrases' ? bigramDensity(text) : []),
    [densityMode, text],
  )
  const entries: readonly DensityEntry[] =
    densityMode === 'phrases' ? bigrams : stats.density
  const topEntry = entries[0]

  const goal = Number.parseInt(goalRaw, 10)
  const goalValid = Number.isFinite(goal) && goal > 0 && goal <= MAX_GOAL
  const goalDone = goalValid && stats.words >= goal
  const goalPct = goalValid ? Math.min(100, Math.round((stats.words / goal) * 100)) : 0

  const longest = stats.longestSentence
  const longestPreview = useMemo(() => {
    const points = Array.from(longest.text)
    return points.length > LONGEST_PREVIEW_CHARS
      ? `${points.slice(0, LONGEST_PREVIEW_CHARS).join('')}…`
      : longest.text
  }, [longest.text])

  const isEmpty = text.trim() === ''

  function clearDraft(): void {
    setText('')
    setRestored(false)
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // Nothing to remove if storage is blocked.
    }
  }

  async function toggleFullscreen(): Promise<void> {
    if (!editorRef.current) return
    try {
      // Branch on `isFullscreen`, not a raw `document.fullscreenElement`
      // truthiness check: that state is already kept in sync with the
      // scoped comparison (`=== editorRef.current`) by the fullscreenchange
      // listener above, so reusing it here guarantees this click handler
      // always agrees with the rendered label/icon — even if some other
      // element on the page is independently fullscreen.
      if (isFullscreen) {
        await document.exitFullscreen()
      } else {
        await editorRef.current.requestFullscreen()
      }
      trackToolEvent(
        'word-counter',
        isFullscreen ? 'exit_fullscreen' : 'enter_fullscreen',
      )
    } catch {
      // Browsers can reject a fullscreen request (policy, embedding
      // restrictions) — fail silently rather than throwing.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* INSIGHTS — just the four numbers worth a glance before you even
          reach the text panel: Words, Characters, Sentences, Reading time.
          The other five (Paragraphs, Speaking time, Reading level, Keyword
          density, Average word) aren't gone — they're detail, not headline,
          so they live in the detail column further down instead of
          competing for space up here. No sublabels either: this strip's
          whole job is
          "glance and move on," not a second dashboard. Hidden on the empty
          state — zeroed tiles teach nothing before there is any text. */}
      {isEmpty ? null : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard
            compact
            icon={Type}
            label="Words"
            value={fmt(stats.words)}
            tone="lavender"
          />
          <StatCard
            compact
            icon={CaseSensitive}
            label="Characters"
            value={fmt(stats.chars)}
            tone="yellow"
          />
          <StatCard
            compact
            icon={AlignLeft}
            label="Sentences"
            value={fmt(stats.sentences)}
            tone="blue"
          />
          <StatCard
            compact
            icon={BookOpen}
            label="Reading time"
            value={formatDuration(stats.readingMinutes)}
            tone="green"
          />
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* EDITOR — full width, on top. Every one of its controls lives in a
            single attached card: one toolbar row (wraps on narrow widths),
            then the textarea directly beneath with no intermediate strip.
            ref + conditional classes below back the fullscreen toggle: in
            fullscreen the card fills the whole screen edge-to-edge, so the
            rounded corners/border/shadow that read as a card on the page
            are dropped. */}
        <div
          ref={editorRef}
          className={
            isFullscreen
              ? 'flex w-full flex-col overflow-hidden bg-cream'
              : 'flex w-full flex-col overflow-hidden rounded-panel border border-line bg-cream shadow-brutal'
          }
        >
          <div className="flex flex-wrap items-center gap-3 border-line border-b bg-offwhite px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[12px] text-ink-subtle uppercase tracking-[0.08em]">
                Keywords
              </span>
              <SegmentButton
                active={densityMode === 'words'}
                onClick={() => setDensityMode('words')}
              >
                Words
              </SegmentButton>
              <SegmentButton
                active={densityMode === 'phrases'}
                onClick={() => setDensityMode('phrases')}
              >
                Phrases
              </SegmentButton>
            </div>

            <div className="flex items-center gap-2">
              <label
                className="font-medium text-[12px] text-ink-subtle uppercase tracking-[0.08em]"
                htmlFor="wc-goal"
              >
                Goal
              </label>
              <input
                id="wc-goal"
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_GOAL}
                step={50}
                placeholder="none"
                value={goalRaw}
                onChange={(e) => setGoalRaw(e.target.value)}
                className="min-h-9 w-24 rounded-sm border border-line-grey bg-cream px-2.5 text-[13px] tabular-nums"
              />
            </div>

            {/* ml-auto keeps these pinned right on wide rows without a
                second flex-wrap group; on narrow ones the whole toolbar just
                wraps to a new line ahead of them, same as everything else
                here. Brand buttons: "Load sample" is the primary "start
                here" action (cta-yellow, no modifier), "Clear" is
                secondary (btn-white). */}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setText(SAMPLE)
                  trackToolEvent('word-counter', 'load_sample')
                }}
                className="btn-brutal btn-brutal-sm"
              >
                Load sample
              </button>
              <button
                type="button"
                onClick={() => {
                  clearDraft()
                  trackToolEvent('word-counter', 'clear')
                }}
                disabled={isEmpty}
                className="btn-brutal btn-brutal-sm btn-white"
              >
                Clear
              </button>
              {/* Only rendered once the browser's Fullscreen API is confirmed
                  available (checked post-mount in the effect above) — no
                  point offering a control that would silently no-op. No
                  `transition-colors`: on a bg/text-colored button that
                  utility broke `:focus-visible` outline-color resolution
                  (confirmed by live bisection elsewhere in this file), so
                  new buttons here simply don't use it. */}
              {fullscreenSupported ? (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  aria-pressed={isFullscreen}
                  className="inline-flex size-9 items-center justify-center rounded-sm border border-line-grey bg-cream text-ink-muted hover:border-violet-700 hover:text-violet-700"
                >
                  {isFullscreen ? (
                    <Minimize className="size-4" aria-hidden="true" />
                  ) : (
                    <Maximize className="size-4" aria-hidden="true" />
                  )}
                </button>
              ) : null}
            </div>
          </div>

          <label className="sr-only" htmlFor="wc-input">
            Type or paste your text
          </label>
          {/* Two different sizing strategies, chosen per fullscreen state —
              never both at once:
              - Not fullscreen: `min-h-[28rem]` + `resize-y`, no `flex-1`.
                On a flex-column parent, `flex-1` sets `flex-basis: 0%` on
                the main (vertical) axis, so the flex algorithm recomputes
                the textarea's height from free space on every reflow —
                which would silently overwrite whatever height the user just
                dragged the native `resize-y` handle to. An explicit min-h
                sizes it without fighting the browser's own resize.
              - Fullscreen: `flex-1` + `resize-none`, no `min-h`. There is
                no user-dragged height to preserve (resize-none disables the
                handle entirely), so the free-space recomputation `flex-1`
                does is exactly what's wanted — filling the fullscreen
                element's definite viewport height edge-to-edge. */}
          <textarea
            id="wc-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing, or paste a draft here…"
            className={
              isFullscreen
                ? 'w-full flex-1 resize-none border-0 bg-cream p-4 text-[15px] text-ink-body leading-[1.7] outline-none placeholder:text-ink-subtle'
                : 'min-h-[28rem] w-full resize-y border-0 bg-cream p-4 text-[15px] text-ink-body leading-[1.7] outline-none placeholder:text-ink-subtle'
            }
          />
        </div>

        {/* DETAIL — goal/limits/breakdown, full width below the editor.
            Only four headline StatCards live in the compact strip above the
            whole layout now — this column opens with the other five
            (Paragraphs, Speaking time, Reading level, Keyword density,
            Average word) as a smaller two-up grid, then the deeper panels.
            Not sticky: this page has no fixed app shell to coordinate a
            sticky offset against, and a plain column that simply scrolls
            with the page is the one option that cannot fight the site
            header for space at any breakpoint. */}
        <div className="flex w-full flex-col gap-4">
          {isEmpty ? (
            <div className="rounded-panel border border-line bg-cream p-10">
              <p className="mx-auto max-w-[36ch] text-center text-[14px] text-ink-subtle leading-6">
                Start typing above. Counts update as you go — including Unicode-correct
                characters, reading time, and how much room you have left against each
                platform limit.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  compact
                  icon={Pilcrow}
                  label="Paragraphs"
                  value={fmt(stats.paragraphs)}
                  tone="lavender"
                />
                <StatCard
                  compact
                  icon={Mic}
                  label="Speaking time"
                  value={formatDuration(stats.speakingMinutes)}
                  tone="yellow"
                />
                <StatCard
                  compact
                  icon={Gauge}
                  label="Reading level"
                  value={sentenceBand(stats.avgSentenceWords)}
                  tone="blue"
                />
                <StatCard
                  compact
                  icon={Hash}
                  label="Keyword density"
                  value={topEntry ? topEntry.term : '—'}
                  tone="green"
                />
                <StatCard
                  compact
                  icon={Ruler}
                  label="Average word"
                  value={`${stats.avgWordLength} letters`}
                  tone="lavender"
                />
              </div>

              {goalValid ? (
                <div className="rounded-panel border border-line bg-cream p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="label mb-0">Goal</p>
                    <p className="font-medium text-[14px] text-ink tabular-nums">
                      {fmt(stats.words)} / {fmt(goal)} words
                      <span className="ml-2 text-ink-subtle">{goalPct}%</span>
                      {goalDone ? (
                        <span className="ml-2 font-bold text-ink">· reached</span>
                      ) : null}
                    </p>
                  </div>
                  {/* Native <progress>: announced correctly with no ARIA of its own. */}
                  <progress
                    className="mt-2 h-2.5 w-full overflow-hidden rounded-pill border border-line-grey [&::-moz-progress-bar]:bg-violet-700 [&::-webkit-progress-bar]:bg-offwhite [&::-webkit-progress-value]:bg-violet-700"
                    max={goal}
                    value={Math.min(stats.words, goal)}
                  />
                </div>
              ) : null}

              <div className="rounded-panel border border-line bg-cream p-4">
                <p className="label">Fits in</p>
                <ul className="flex flex-col gap-1.5">
                  {PLATFORM_LIMITS.map((platform) => {
                    const remaining = platform.limit - stats.chars
                    const over = remaining < 0
                    return (
                      <li
                        key={platform.name}
                        className="flex items-baseline justify-between gap-3 rounded-sm border border-line-grey bg-offwhite px-3 py-2 text-[14px]"
                      >
                        <span className="text-ink-body">{platform.name}</span>
                        {/* Wording carries the state, not weight alone: "over by"
                            and "left" are different words, so this reads correctly
                            in greyscale and to a screen reader. */}
                        <span
                          className={
                            over
                              ? 'font-bold text-ink tabular-nums'
                              : 'font-medium text-ink-muted tabular-nums'
                          }
                        >
                          {over
                            ? `over by ${fmt(Math.abs(remaining))}`
                            : `${fmt(remaining)} left`}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {longest.words > 0 ? (
                <div className="rounded-panel border border-line bg-cream p-4">
                  <p className="label">Longest sentence · {longest.words} words</p>
                  <p className="rounded-sm border border-line-grey bg-offwhite p-3 text-[14px] text-ink-body leading-6">
                    {longestPreview}
                  </p>
                  <p className="hint mt-1.5">
                    Usually the first candidate for a rewrite — long sentences are where
                    meaning goes to hide.
                  </p>
                </div>
              ) : null}

              <div className="rounded-panel border border-line bg-cream p-4">
                <p className="label">
                  Top {densityMode === 'words' ? 'terms' : 'phrases'}
                </p>
                {entries.length === 0 ? (
                  <p className="hint">
                    {densityMode === 'words'
                      ? 'No repeated terms yet — everyday words like “the” and “and” are excluded.'
                      : 'No repeated two-word phrases yet.'}
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {entries.map((entry) => (
                      <li key={entry.term} className="flex items-center gap-3">
                        <span className="w-[9rem] shrink-0 truncate text-[14px] text-ink-body">
                          {entry.term}
                        </span>
                        {/* Decorative: the figures to the right carry the
                            information, so nothing depends on seeing the bar. */}
                        <span
                          aria-hidden="true"
                          className="h-2 shrink-0 rounded-pill bg-violet-700"
                          style={{
                            width: `${Math.min(60, Math.max(4, entry.pct * 3))}%`,
                          }}
                        />
                        <span className="ml-auto shrink-0 text-[13px] text-ink-subtle tabular-nums">
                          {entry.count} · {entry.pct.toFixed(1)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          <div className="overflow-hidden rounded-panel border border-line bg-offwhite">
            <StatusBar
              state="neutral"
              message={
                isEmpty
                  ? 'Waiting for text'
                  : restored
                    ? 'Your saved draft, restored'
                    : 'Counting as you type'
              }
              stats={
                isEmpty
                  ? undefined
                  : [
                      { label: 'words', value: fmt(stats.words) },
                      { label: 'characters', value: fmt(stats.chars) },
                      { label: 'read', value: formatDuration(stats.readingMinutes) },
                    ]
              }
              privacyNote="Counted in your browser — the draft is saved only on this device"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * A plain-language band for mean sentence length.
 *
 * Deliberately not a Flesch or Gunning-Fog score: both need syllable counts,
 * which are unreliable for English without a dictionary, and a precise-looking
 * "grade 9.4" derived from a guess is worse than an honest band. Mean sentence
 * length is a figure we actually measure, and it is the strongest single lever
 * most drafts have.
 */
function sentenceBand(avgWords: number): string {
  if (avgWords === 0) return 'no sentences yet'
  if (avgWords <= 14) return 'easy going'
  if (avgWords <= 20) return 'plain'
  if (avgWords <= 25) return 'getting heavy'
  return 'dense — try splitting some'
}
