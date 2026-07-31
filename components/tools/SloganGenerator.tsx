'use client'

import { Check, RefreshCw, Star, TriangleAlert, X } from 'lucide-react'
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
  AD_DESCRIPTION_LIMIT,
  AD_HEADLINE_LIMIT,
  adFit,
  allSlogansForTone,
  createSeededRng,
  generateSlogans,
  parseShortlist,
  sanitizeKeyword,
  sanitizeNoun,
  TONES,
  type Tone,
} from '@/lib/tools/slogan-generator/logic'

/**
 * Slogan generator — rebuilt on the shared workspace.
 * Research brief: docs/research/slogan-generator.md
 *
 * What changed, and why:
 *   - The batch now owns the whole right pane. Previously it was a list below a
 *     form, a tone fieldset, a button and a shortlist card, so the ten lines you
 *     came to read started roughly a screen down the page.
 *   - Ad fit became a filter, not only a badge. "Headline-ready" narrows the
 *     batch to lines of 30 characters or fewer, which turns the one thing no
 *     competitor shows into a decision rather than a label.
 *   - Regenerate now never repeats across the whole session, not just against
 *     the current screen: every line shown is accumulated and passed back as an
 *     exclusion, and Generate disables when the tone's bank is spent.
 *
 * Every line of copy here avoids implying a model wrote these. It did not: each
 * tone is a hand-written bank of sentence patterns, and saying so is the point —
 * it is what makes the tool instant, uncapped, account-free and private, and
 * three of the five competitors sell an AI story over the same mechanism.
 *
 * Generation, validation, grammar and ad-fit maths all live in logic.ts and are
 * already tested. This file is state, markup, and the shortlist's localStorage.
 *
 * Hydration: the shuffle seed is a constant, so the server HTML and the first
 * client render produce identical slogans. `Math.random` is reached only inside
 * the Generate handler — never during render.
 */

const SHORTLIST_KEY = 'scult-tools:slogan-generator:v1'
const BATCH_SIZE = 10

/** Fixed so the first paint is deterministic on both sides of hydration. */
const INITIAL_SEED = 20260729

/** Ceiling on the seen set. Banks are ~22 lines, so this never bites in practice. */
const SEEN_CAP = 300

const DEFAULTS = { keyword: 'Bloom', noun: 'marketing', tone: 'friendly' as Tone }

/**
 * What each tone actually sounds like. Present because "Playful" alone asks the
 * visitor to guess, and the guess is usually wrong — the banks are written to
 * distinct briefs, so the brief is worth stating.
 */
const TONE_NOTE: Record<Tone, string> = {
  friendly: 'Warm and plain-spoken. Suits service trades and local businesses.',
  bold: 'Short, declarative, slightly combative. Suits a challenger.',
  premium: 'Restrained and understated. Suits craft and high-consideration buys.',
  playful: 'Light and surprising — the kind of line that survives on a sticker.',
  minimal: 'Two or three words. Suits a brand whose name already does the work.',
}

type AdFilter = 'all' | 'headline'

function toneLabelOf(tone: Tone): string {
  return TONES.find((t) => t.id === tone)?.label ?? 'Fresh'
}

export function SloganGenerator() {
  const [keyword, setKeyword] = useState(DEFAULTS.keyword)
  const [noun, setNoun] = useState(DEFAULTS.noun)
  const [tone, setTone] = useState<Tone>(DEFAULTS.tone)
  const [seed, setSeed] = useState(INITIAL_SEED)
  const [seen, setSeen] = useState<readonly string[]>([])
  const [shortlist, setShortlist] = useState<readonly string[]>([])
  const [adFilter, setAdFilter] = useState<AdFilter>('all')
  const loadedRef = useRef(false)

  // Read the shortlist after mount, never during render: the server has no
  // localStorage, and seeding state from it would break hydration.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SHORTLIST_KEY)
      if (stored !== null) {
        const parsed = parseShortlist(JSON.parse(stored))
        if (parsed) setShortlist(parsed)
      }
    } catch {
      // Blocked storage or corrupt JSON — start with an empty shortlist.
    }
    loadedRef.current = true
  }, [])

  useEffect(() => {
    if (!loadedRef.current) return
    try {
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlist))
    } catch {
      // Best-effort: private mode blocks writes and there is nothing to fix.
    }
  }, [shortlist])

  const keywordError = useMemo(() => sanitizeKeyword(keyword).error, [keyword])
  const nounError = useMemo(() => sanitizeNoun(noun).error, [noun])
  const inputError = keywordError ?? nounError
  const shownKeyword = useMemo(() => sanitizeKeyword(keyword).value, [keyword])

  /** Every line these inputs can produce — the denominator for "how many left". */
  const bank = useMemo(
    () => allSlogansForTone({ keyword, noun, tone }),
    [keyword, noun, tone],
  )

  /**
   * The batch is derived, not stored. Holding the *seed* in state instead of the
   * result means typing re-renders the same ten patterns with the new keyword
   * rather than reshuffling a list you were halfway through reading, and it keeps
   * render pure — the only randomness enters through `setSeed` in a handler.
   */
  const batch = useMemo(
    () =>
      generateSlogans({
        keyword,
        noun,
        tone,
        rng: createSeededRng(seed),
        exclude: seen,
        count: BATCH_SIZE,
      }),
    [keyword, noun, tone, seed, seen],
  )

  const seenSet = useMemo(() => new Set(seen), [seen])
  const shownSet = useMemo(() => new Set(batch.slogans), [batch.slogans])

  /** Unseen lines still held back in this tone's bank. */
  const unseenLeft = useMemo(
    () => bank.slogans.filter((s) => !seenSet.has(s) && !shownSet.has(s)).length,
    [bank.slogans, seenSet, shownSet],
  )

  const headlineReady = useMemo(
    () => batch.slogans.filter((s) => adFit(s).headline),
    [batch.slogans],
  )
  const displayed = adFilter === 'headline' ? headlineReady : batch.slogans

  const exhausted = unseenLeft === 0
  const canGenerate = inputError === undefined && !exhausted
  const toneLabel = toneLabelOf(tone)

  /**
   * Bank the current lines and move to a new seed. Excluding everything already
   * shown is what makes "fresh" a promise rather than a hope — the shared
   * `generateSlogans` filters the bank by the exclusion set before shuffling.
   */
  function generateFresh(): void {
    if (!canGenerate) return
    setSeen((prev) => [...prev, ...batch.slogans].slice(-SEEN_CAP))
    setSeed(Math.floor(Math.random() * 2 ** 31))
  }

  function loadSample(): void {
    setKeyword(DEFAULTS.keyword)
    setNoun(DEFAULTS.noun)
    setTone(DEFAULTS.tone)
    setSeed(INITIAL_SEED)
    setSeen([])
    setAdFilter('all')
  }

  function clearAll(): void {
    setKeyword('')
    setNoun('')
    setSeen([])
  }

  function toggleSave(slogan: string): void {
    setShortlist((prev) =>
      prev.includes(slogan) ? prev.filter((s) => s !== slogan) : [...prev, slogan],
    )
  }

  // One message, in priority order: a keyword we cannot use, then a filter that
  // hides everything, then the batch itself. Routed through StatusBar because it
  // is the tool's single polite live region.
  const statusMessage =
    inputError !== undefined
      ? inputError
      : displayed.length === 0
        ? `No line in this batch fits a ${AD_HEADLINE_LIMIT}-character headline.`
        : exhausted
          ? `${displayed.length} ${toneLabel.toLowerCase()} slogans — that is the whole ${toneLabel.toLowerCase()} bank for “${shownKeyword}”.`
          : `${displayed.length} ${toneLabel.toLowerCase()} slogans for “${shownKeyword}”.`

  // Three stats, not four: the shortlist count already sits in the left pane's
  // heading, and a fourth entry pushes this strip onto a second line at 1366px.
  // The star's own pressed state is the feedback for saving.
  const statusStats: readonly { label: string; value: string }[] = [
    { label: 'shown', value: String(displayed.length) },
    {
      label: `fit a ${AD_HEADLINE_LIMIT}-char headline`,
      value: String(headlineReady.length),
    },
    {
      label: `${toneLabel.toLowerCase()} lines still unseen`,
      value: String(unseenLeft),
    },
  ]

  return (
    <ToolWorkspace
      inputLabel="Brand, tone and shortlist"
      outputLabel="Slogan ideas"
      minHeight="min-h-[32rem]"
      toolbar={
        <ToolToolbar
          actions={
            <>
              <button
                type="button"
                className="btn-brutal btn-brutal-sm btn-violet"
                disabled={!canGenerate}
                onClick={generateFresh}
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Generate {BATCH_SIZE} fresh
              </button>
              <ToolbarAction onClick={loadSample}>Load sample</ToolbarAction>
              <ToolbarAction onClick={clearAll} disabled={keyword === '' && noun === ''}>
                Clear
              </ToolbarAction>
            </>
          }
        >
          <ToolbarGroup label="Ad fit">
            <SegmentButton
              active={adFilter === 'all'}
              onClick={() => setAdFilter('all')}
              title="Show every line in the batch"
            >
              All lines
            </SegmentButton>
            <SegmentButton
              active={adFilter === 'headline'}
              onClick={() => setAdFilter('headline')}
              title={`Show only lines of ${AD_HEADLINE_LIMIT} characters or fewer`}
            >
              Headline-ready ({headlineReady.length})
            </SegmentButton>
          </ToolbarGroup>
        </ToolToolbar>
      }
      input={
        <Pane title="Brand & tone">
          <div className="flex flex-col gap-5">
            <div>
              <label className="label" htmlFor="slogan-keyword">
                Brand name or keyword{' '}
                <span className="font-normal text-[13px] text-ink-subtle">
                  · required
                </span>
              </label>
              <input
                id="slogan-keyword"
                className="field"
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="Bloom"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-invalid={keywordError !== undefined}
                aria-describedby="slogan-keyword-hint"
              />
              <p className="hint mt-1.5" id="slogan-keyword-hint">
                {keywordError ??
                  'The name every line is built around. 2–30 characters, and your capitalisation is kept mid-sentence.'}
              </p>
            </div>

            <div>
              <label className="label" htmlFor="slogan-noun">
                What you do{' '}
                <span className="font-normal text-[13px] text-ink-subtle">
                  · optional
                </span>
              </label>
              <input
                id="slogan-noun"
                className="field"
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="marketing, coffee, yoga…"
                value={noun}
                onChange={(e) => setNoun(e.target.value)}
                aria-invalid={nounError !== undefined}
                aria-describedby="slogan-noun-hint"
              />
              <p className="hint mt-1.5" id="slogan-noun-hint">
                {nounError ??
                  'One or two words — unlocks extra patterns like “Own your marketing.”'}
              </p>
            </div>

            <fieldset>
              <legend className="label">Tone</legend>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <SegmentButton
                    key={t.id}
                    active={tone === t.id}
                    onClick={() => setTone(t.id)}
                    title={TONE_NOTE[t.id]}
                  >
                    {t.label}
                  </SegmentButton>
                ))}
              </div>
              <p className="hint mt-2">{TONE_NOTE[tone]}</p>
            </fieldset>

            {/* The "No model is involved" panel that sat here was removed as
                triple-stated: the StatusBar's permanent privacyNote already says
                "Built in this tab from template banks — nothing uploaded", and
                both howItWorks and the "Is this AI?" FAQ below the tool explain
                the template-bank design in full. The honesty stance is the USP
                and stays visible — via the status bar, on every keystroke —
                without a third telling of it. */}
            <div className="border-line border-t pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display font-semibold text-[16px] text-ink">
                  Shortlist{' '}
                  <span className="font-sans font-normal text-[14px] text-ink-subtle">
                    {shortlist.length} saved
                  </span>
                </h4>
                {shortlist.length > 0 ? (
                  <CopyButton text={shortlist.join('\n')} label="Copy all" />
                ) : null}
              </div>

              {shortlist.length === 0 ? (
                <p className="hint mt-2">
                  Star a line on the right and it lands here — it survives a reload, so a
                  slogan hunt can span more than one sitting.
                </p>
              ) : (
                <>
                  <ul className="mt-3 flex flex-col gap-2">
                    {shortlist.map((slogan) => (
                      <li
                        key={slogan}
                        className="flex items-center justify-between gap-3 rounded-sm border border-line-grey bg-tile-lavender px-3 py-2"
                      >
                        <span className="text-[14px] text-ink leading-5">{slogan}</span>
                        <button
                          type="button"
                          onClick={() => toggleSave(slogan)}
                          aria-label={`Remove “${slogan}” from your shortlist`}
                          className="flex min-h-11 shrink-0 items-center gap-1 rounded-sm border border-line-grey bg-white px-2.5 font-medium text-[13px] text-ink-muted transition-colors hover:border-ink hover:text-ink sm:min-h-9"
                        >
                          <X className="size-3.5" aria-hidden="true" />
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="hint mt-2">
                    Clearing site data deletes the shortlist, so copy the keepers out
                    before you do.
                  </p>
                </>
              )}
            </div>
          </div>
        </Pane>
      }
      output={
        <Pane
          title={
            inputError !== undefined
              ? 'Slogan ideas'
              : `${toneLabel} ideas for “${shownKeyword}”`
          }
          actions={
            displayed.length > 0 ? (
              <CopyButton
                text={displayed.join('\n')}
                label={`Copy all ${displayed.length}`}
              />
            ) : null
          }
        >
          {inputError !== undefined ? (
            <ErrorDetail message={inputError} />
          ) : displayed.length === 0 ? (
            <div className="flex h-full items-center justify-center p-6">
              <p className="max-w-[38ch] text-center text-[14px] text-ink-subtle leading-6">
                Nothing in this batch fits a {AD_HEADLINE_LIMIT}-character headline.
                Switch back to all lines, generate a fresh batch, or try the Minimal tone
                — its patterns are the shortest.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2.5">
                {displayed.map((slogan) => {
                  const saved = shortlist.includes(slogan)
                  return (
                    <li
                      key={slogan}
                      className="flex flex-col gap-2.5 rounded-card border border-line-grey bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-[17px] text-ink leading-snug">
                          {slogan}
                        </p>
                        <AdFitBadge slogan={slogan} />
                      </div>

                      {/* A labelled group, so the generic "Copy" is unambiguous
                          among ten of them. A real <fieldset> rather than
                          role="group": same semantics, native element, and it is
                          what the linter's useSemanticElements rule asks for. The
                          star carries its own full label regardless. */}
                      <fieldset
                        aria-label={`Actions for “${slogan}”`}
                        className="flex shrink-0 items-center gap-2"
                      >
                        <CopyButton text={slogan} />
                        <button
                          type="button"
                          aria-pressed={saved}
                          aria-label={
                            saved
                              ? `Saved “${slogan}” — press to remove it from your shortlist`
                              : `Save “${slogan}” to your shortlist`
                          }
                          onClick={() => toggleSave(slogan)}
                          // 44px on touch viewports, 36px from `sm` up — matching
                          // SegmentButton, ToolbarAction and CopyButton so the row
                          // is one consistent control height.
                          className={`flex min-h-11 items-center gap-1.5 rounded-sm border px-3 font-medium text-[14px] transition-colors sm:min-h-9 ${
                            saved
                              ? 'border-ink bg-violet-700 text-white'
                              : 'border-line-grey bg-white text-ink hover:border-ink'
                          }`}
                        >
                          <Star
                            className="size-4"
                            aria-hidden="true"
                            fill={saved ? 'currentColor' : 'none'}
                          />
                          {saved ? 'Saved' : 'Save'}
                        </button>
                      </fieldset>
                    </li>
                  )
                })}
              </ul>

              {exhausted ? (
                <p className="flex items-start gap-2 rounded-sm border border-line-grey bg-tile-yellow p-3 text-[13px] text-ink-body leading-5">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    You have now seen every {toneLabel.toLowerCase()} line for “
                    {shownKeyword}”. The banks are finite by design — switch tone, or
                    change the keyword, for more.
                  </span>
                </p>
              ) : null}
            </div>
          )}
        </Pane>
      }
      status={
        <StatusBar
          state={
            inputError !== undefined
              ? 'invalid'
              : displayed.length > 0
                ? 'valid'
                : 'neutral'
          }
          message={statusMessage}
          stats={statusStats}
          privacyNote="Built in this tab from template banks — nothing uploaded"
        />
      }
    />
  )
}

/**
 * Character count plus a worded verdict against the Google Ads limits.
 *
 * Three signals, not one: the count, the wording, and the pastel fill. The rule
 * this respects is that an over-limit line must be *said* to be over, so the
 * badge still reads correctly in greyscale and to a screen reader. Text is
 * `text-ink` throughout — these fills are light accents that only carry black.
 */
function AdFitBadge({ slogan }: { slogan: string }) {
  const fit = adFit(slogan)

  const { tint, verdict, warn } = fit.headline
    ? { tint: 'bg-tile-green', verdict: 'fits an ad headline', warn: false }
    : fit.description
      ? {
          tint: 'bg-tile-yellow',
          verdict: `over the ${AD_HEADLINE_LIMIT}-char headline limit · fine as a description`,
          warn: true,
        }
      : {
          tint: 'bg-peach',
          verdict: `over ${AD_DESCRIPTION_LIMIT} — too long for ad copy`,
          warn: true,
        }

  return (
    <span
      className={`mt-2 inline-flex items-center gap-1.5 rounded-sm border border-line-grey px-2 py-0.5 text-[12px] text-ink leading-5 ${tint}`}
    >
      {warn ? (
        <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      ) : (
        <Check className="size-3.5 shrink-0" aria-hidden="true" />
      )}
      <span className="font-semibold tabular-nums">{fit.chars} chars</span>
      {/* Leading space is deliberate: adjacent JSX siblings concatenate with no
          separator, so copied or screen-reader text would read "30 chars·". The
          flex gap collapses it visually. */}
      <span>
        {' · '}
        {verdict}
      </span>
    </span>
  )
}
