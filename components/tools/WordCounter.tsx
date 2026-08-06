'use client'

import {
  AlignLeft,
  BookOpen,
  CaseSensitive,
  Gauge,
  Hash,
  Mic,
  Pilcrow,
  Ruler,
  Type,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Pane,
  SegmentButton,
  StatCard,
  StatusBar,
  ToolbarGroup,
  ToolToolbar,
} from '@/components/tools/workspace'
import {
  analyzeText,
  bigramDensity,
  type DensityEntry,
  formatDuration,
  PLATFORM_LIMITS,
  READING_WPM,
  SPEAKING_WPM,
} from '@/lib/tools/word-counter/logic'

/**
 * Word counter — single-column writing surface + stat cards.
 * Research brief: docs/research/word-counter.md
 *
 * Previously a two-pane workspace (writing surface left, live readout right).
 * Redesigned as a single stacked column: the textarea up top, then a StatCard
 * grid for the headline counts, then the secondary blocks (goal, platform
 * limits, longest sentence, keyword density) that don't fit a single number.
 *
 * Every count lives in logic.ts and is already tested — including the part that
 * makes the tool worth using, which is `Intl.Segmenter` grapheme counting. A
 * naive `.length` reports a ZWJ family emoji as 7 characters; the platform limits
 * below are enforced in a unit much closer to graphemes, so the naive number is
 * wrong precisely where being wrong costs you a truncated post.
 *
 * Two pieces of genuinely UI-side behaviour, both carried over unchanged from the
 * previous version: the debounced localStorage draft autosave, and display
 * formatting of times and large numbers.
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

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-panel border border-line bg-cream shadow-brutal">
        <div className="border-line border-b bg-offwhite">
          <ToolToolbar>
            <ToolbarGroup label="Keywords">
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
            </ToolbarGroup>

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
          </ToolToolbar>
        </div>

        {/* An evenly-spaced grid, not a left-packed flex-wrap row — same fix
          as Schema Markup Generator / FAQ Schema Generator's action rows.
          Brand buttons: "Load sample" is the primary "start here" action
          (cta-yellow, no modifier), "Clear" is secondary (btn-white). */}
        <div className="grid grid-cols-2 gap-2 border-line border-b bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-2">
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="btn-brutal btn-brutal-sm w-full"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={clearDraft}
            disabled={isEmpty}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Clear
          </button>
        </div>

        <div className="flex min-h-[22rem] flex-col">
          <Pane title="Your text" padded={false} scroll={false}>
            <label className="sr-only" htmlFor="wc-input">
              Type or paste your text
            </label>
            <textarea
              id="wc-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing, or paste a draft here…"
              className="size-full resize-none border-0 bg-cream p-4 text-[15px] text-ink-body leading-[1.7] outline-none placeholder:text-ink-subtle"
            />
          </Pane>
        </div>
      </div>

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
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <StatCard
              icon={Type}
              label="Words"
              value={fmt(stats.words)}
              tone="lavender"
            />
            <StatCard
              icon={CaseSensitive}
              label="Characters"
              value={fmt(stats.chars)}
              sublabel={`${fmt(stats.charsNoSpaces)} without spaces`}
              tone="yellow"
            />
            <StatCard
              icon={AlignLeft}
              label="Sentences"
              value={fmt(stats.sentences)}
              tone="blue"
            />
            <StatCard
              icon={Pilcrow}
              label="Paragraphs"
              value={fmt(stats.paragraphs)}
              tone="green"
            />
            <StatCard
              icon={BookOpen}
              label="Reading time"
              value={formatDuration(stats.readingMinutes)}
              sublabel={`${READING_WPM} wpm`}
              tone="lavender"
            />
            <StatCard
              icon={Mic}
              label="Speaking time"
              value={formatDuration(stats.speakingMinutes)}
              sublabel={`${SPEAKING_WPM} wpm`}
              tone="yellow"
            />
            <StatCard
              icon={Gauge}
              label="Reading level"
              value={sentenceBand(stats.avgSentenceWords)}
              sublabel={`${stats.avgSentenceWords} words / sentence`}
              tone="blue"
            />
            <StatCard
              icon={Hash}
              label="Keyword density"
              value={topEntry ? topEntry.term : '—'}
              sublabel={topEntry ? `${topEntry.pct}% of words` : 'No repeated terms yet'}
              tone="green"
            />
            <StatCard
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
            <p className="label">Top {densityMode === 'words' ? 'terms' : 'phrases'}</p>
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
