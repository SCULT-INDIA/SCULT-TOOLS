'use client'

import { Check, Heart, RefreshCw, Sparkles, TriangleAlert, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import { ErrorDetail, SegmentButton, StatusBar } from '@/components/tools/workspace'
import { trackToolEvent } from '@/lib/analytics'
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
 * Slogan generator — single-column stack: form card, results card, shortlist.
 * Research brief: docs/research/slogan-generator.md
 *
 * What changed, and why:
 *   - Dropped the two-pane workspace for a single stacked column, per the Group
 *     C wireframe: one form card (brand name, business description, industry,
 *     tone, keywords, Generate), then a results card (count + sort, the slogan
 *     list, "Generate more"), then the shortlist. The batch used to own a whole
 *     side pane; now it owns a whole card, full width.
 *   - The ad-fit filter is no longer a segmented toggle above two panes — it is
 *     the results card's "Sort by" select, because that is the control shape
 *     the wireframe calls for. The underlying state and filtering are unchanged
 *     (`adFilter`, `headlineReady`), only the control reading it is a `<select>`
 *     instead of a `SegmentButton` pair.
 *   - "Industry" and "+ Add keywords" had no backing field anywhere in
 *     logic.ts — there is no industry concept and no multi-keyword input, only
 *     a single required keyword and an optional noun. Both were removed
 *     entirely at the user's request rather than left as disabled
 *     "coming soon" placeholders.
 *   - Save changed from a labelled star button ("Save"/"Saved") to an icon-only
 *     heart, per the wireframe's "heart (favorite) icon button" — same
 *     `toggleSave` handler, same shortlist, same `aria-pressed`/`aria-label`.
 *   - Load sample / Clear (formerly `ToolToolbar` actions) and Generate
 *     Slogans (formerly a lone button under the form) now live together in
 *     one evenly-spaced brand-button grid at the very top of the form card,
 *     same pattern as Schema Markup Generator and FaqSchemaGenerator. The
 *     toolbar that used to hold only those two actions is removed — it would
 *     otherwise render an empty bar. The results card's second "Generate
 *     more" button called the exact same `generateFresh` handler under the
 *     exact same `!canGenerate` guard as the new top button, so it was a true
 *     duplicate and was removed, exactly like FaqSchemaGenerator's redundant
 *     bottom "Add FAQ" button. The per-batch "Copy all" and the shortlist's
 *     "Copy all" stay where they are — each is scoped to one specific
 *     section's content, not a page-level action, the same distinction that
 *     keeps FaqSchemaGenerator's CodePane `CopyButton` out of its top grid.
 *
 * Generation, validation, grammar and ad-fit maths all live in logic.ts and are
 * already tested. This file is state, markup, and the shortlist's localStorage.
 *
 * Every line of copy here avoids implying a model wrote these. It did not: each
 * tone is a hand-written bank of sentence patterns, and saying so is the point —
 * it is what makes the tool instant, uncapped, account-free and private.
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
 * Mirrors logic.ts's unexported `MAX_INPUT_CHARS` — the real cap `sanitizeNoun`
 * enforces. Shown next to the textarea rather than a round "200": a counter
 * that disagrees with the validation error above it would be worse than no
 * counter at all.
 */
const NOUN_MAX_CHARS = 30

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
    trackToolEvent('slogan-generator', 'generate_slogans')
  }

  function loadSample(): void {
    setKeyword(DEFAULTS.keyword)
    setNoun(DEFAULTS.noun)
    setTone(DEFAULTS.tone)
    setSeed(INITIAL_SEED)
    setSeen([])
    setAdFilter('all')
    trackToolEvent('slogan-generator', 'load_sample')
  }

  function clearAll(): void {
    setKeyword('')
    setNoun('')
    setSeen([])
    trackToolEvent('slogan-generator', 'clear')
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
    <div className="flex flex-col gap-6">
      {/* Form card — brand name, business description, tone, and the two
          coming-soon affordances (industry, extra keywords) the wireframe
          calls for but logic.ts has no field for. */}
      <div className="overflow-hidden rounded-panel border border-line bg-cream shadow-brutal">
        {/* An evenly-spaced grid, not the old toolbar's left/right action
            row — brand buttons (`.btn-brutal`) spanning two colour modifiers:
            default cta-yellow on "Generate Slogans", the primary "the thing
            you came here to click" action (col-span-2 at the narrowest tier
            so the trailing single-button row isn't half empty), `btn-white`
            for Load sample and Clear. */}
        <div className="grid grid-cols-2 gap-2 border-line border-b bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-3">
          <button
            type="button"
            onClick={loadSample}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={keyword === '' && noun === ''}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={generateFresh}
            disabled={!canGenerate}
            className="btn-brutal btn-brutal-sm col-span-2 w-full sm:col-span-1"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Generate Slogans
          </button>
        </div>

        <div className="flex flex-col gap-5 p-4 sm:p-6">
          <div>
            <label className="label" htmlFor="slogan-keyword">
              Brand or business name{' '}
              <span className="font-normal text-[13px] text-ink-subtle">· required</span>
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
            <div className="flex items-baseline justify-between gap-3">
              <label className="label !mb-0" htmlFor="slogan-noun">
                Describe your business{' '}
                <span className="font-normal text-[13px] text-ink-subtle">
                  · optional
                </span>
              </label>
              <span className="shrink-0 text-[12px] text-ink-subtle tabular-nums">
                {noun.length}/{NOUN_MAX_CHARS}
              </span>
            </div>
            <textarea
              id="slogan-noun"
              className="field mt-1.5 min-h-[4.5rem] resize-y"
              autoComplete="off"
              spellCheck={false}
              placeholder="marketing, coffee, yoga…"
              value={noun}
              onChange={(e) => setNoun(e.target.value)}
              maxLength={NOUN_MAX_CHARS}
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
        </div>
      </div>

      {/* Results card. */}
      <div className="overflow-hidden rounded-panel border border-line bg-cream shadow-brutal">
        <div className="flex flex-wrap items-center justify-between gap-3 border-line border-b bg-offwhite px-4 py-3 sm:px-6">
          <h2 className="font-display font-semibold text-[16px] text-ink">
            {inputError !== undefined
              ? 'Slogan ideas'
              : `${displayed.length} slogans generated`}
          </h2>
          <div className="flex items-center gap-2">
            <label
              className="font-medium text-[12px] text-ink-subtle uppercase tracking-[0.08em]"
              htmlFor="slogan-sort"
            >
              Sort by
            </label>
            <select
              id="slogan-sort"
              className="min-h-9 rounded-sm border border-line-grey bg-cream px-2.5 text-[13px]"
              value={adFilter}
              onChange={(e) => setAdFilter(e.target.value as AdFilter)}
            >
              <option value="all">Best match</option>
              <option value="headline">Headline-ready ({headlineReady.length})</option>
            </select>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {inputError !== undefined ? (
            <ErrorDetail message={inputError} />
          ) : displayed.length === 0 ? (
            <div className="flex items-center justify-center p-6">
              <p className="max-w-[38ch] text-center text-[14px] text-ink-subtle leading-6">
                Nothing in this batch fits a {AD_HEADLINE_LIMIT}-character headline.
                Switch back to "Best match", generate a fresh batch, or try the Minimal
                tone — its patterns are the shortest.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] text-ink-subtle">
                  {toneLabel} ideas for “{shownKeyword}”
                </p>
                <CopyButton
                  text={displayed.join('\n')}
                  label={`Copy all ${displayed.length}`}
                />
              </div>

              <ul className="flex flex-col gap-2.5">
                {displayed.map((slogan) => {
                  const saved = shortlist.includes(slogan)
                  return (
                    <li
                      key={slogan}
                      className="flex flex-wrap items-center gap-3 rounded-card border border-line-grey bg-cream p-3.5"
                    >
                      <Sparkles
                        className="size-4 shrink-0 text-violet-500"
                        aria-hidden="true"
                      />
                      <p className="min-w-[16ch] flex-1 font-display font-semibold text-[16px] text-ink leading-snug">
                        {slogan}
                      </p>
                      <AdFitBadge slogan={slogan} />

                      {/* A labelled group, so the generic "Copy" is unambiguous
                          among ten of them. A real <fieldset> rather than
                          role="group": same semantics, native element, and it is
                          what the linter's useSemanticElements rule asks for. */}
                      <fieldset
                        aria-label={`Actions for “${slogan}”`}
                        className="flex shrink-0 items-center gap-2"
                      >
                        <CopyButton
                          text={slogan}
                          ariaLabel={`Copy “${slogan}”`}
                          onCopy={() => trackToolEvent('slogan-generator', 'copy_slogan')}
                        />
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
                          // CopyButton so the row is one consistent control height.
                          className={`flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-sm border transition-colors sm:min-h-9 sm:min-w-9 ${
                            saved
                              ? 'border-ink bg-violet-700 text-white'
                              : 'border-line-grey bg-cream text-ink hover:border-ink'
                          }`}
                        >
                          <Heart
                            className="size-4"
                            aria-hidden="true"
                            fill={saved ? 'currentColor' : 'none'}
                          />
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
        </div>

        <div className="border-line border-t bg-offwhite">
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
        </div>
      </div>

      {/* Shortlist card — unchanged behaviour, its own card now that the two-pane
          workspace no longer gives it a permanent slot in the left rail. */}
      <div className="overflow-hidden rounded-panel border border-line bg-cream shadow-brutal">
        <div className="flex flex-wrap items-center justify-between gap-2 border-line border-b bg-offwhite px-4 py-3 sm:px-6">
          <h3 className="font-display font-semibold text-[16px] text-ink">
            Shortlist{' '}
            <span className="font-sans font-normal text-[14px] text-ink-subtle">
              {shortlist.length} saved
            </span>
          </h3>
          {shortlist.length > 0 ? (
            <CopyButton text={shortlist.join('\n')} label="Copy all" />
          ) : null}
        </div>

        <div className="p-4 sm:p-6">
          {shortlist.length === 0 ? (
            <p className="hint">
              Tap the heart on a line above and it lands here — it survives a reload, so a
              slogan hunt can span more than one sitting.
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-2">
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
                      className="flex min-h-11 shrink-0 items-center gap-1 rounded-sm border border-line-grey bg-cream px-2.5 font-medium text-[13px] text-ink-muted transition-colors hover:border-ink hover:text-ink sm:min-h-9"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <p className="hint mt-2">
                Clearing site data deletes the shortlist, so copy the keepers out before
                you do.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Character count plus a worded verdict against the Google Ads limits, shown
 * inline in the slogan row as the wireframe's "score chip".
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
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-line-grey px-2 py-0.5 text-[12px] text-ink leading-5 ${tint}`}
      title={verdict}
    >
      {warn ? (
        <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      ) : (
        <Check className="size-3.5 shrink-0" aria-hidden="true" />
      )}
      <span className="font-semibold tabular-nums">{fit.chars} chars</span>
    </span>
  )
}
