'use client'

import {
  ExternalLink,
  Globe,
  Heart,
  LayoutGrid,
  List,
  RefreshCw,
  Sparkles,
  TriangleAlert,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  ErrorDetail,
  ScoreRing,
  SegmentButton,
  StatusBar,
  ToolbarAction,
} from '@/components/tools/workspace'
import { trackToolEvent } from '@/lib/analytics'
import {
  BATCH_SIZE,
  type BrandabilityScore,
  computeBrandabilityScore,
  createRng,
  generateBatch,
  type LengthBand,
  type NameIdea,
  parseShortlist,
  SHORTLIST_LIMIT,
  STYLES,
  type StyleId,
} from '@/lib/tools/business-name-generator/logic'

/**
 * Business name generator — Group C layout: a single-column stack, no
 * `ToolWorkspace` two-pane grid. Research brief:
 * docs/research/business-name-generator.md
 *
 * Generation, scoring and the shortlist parser all stay in logic.ts, already
 * tested. This file holds state, filtering/ordering/paging of an
 * already-scored batch, and markup. The one new piece of logic —
 * `computeBrandabilityScore` — lives in logic.ts too, with its own tests,
 * following the same pass/fail-checks shape as UTM Builder's Quality Score.
 *
 * HONESTY CONSTRAINT — deliberate, do not "fix" this into a green tick. A page
 * running in the visitor's tab cannot resolve DNS or query a registrar, so
 * this tool never renders an availability verdict of any kind. The domain
 * badge on every card says "verify live", never "available" — competitors
 * that show "available" inline are reading a cached affiliate feed, and being
 * wrong about that costs someone a business name. See the "Check" link below
 * each card, which opens Namecheap's public search in a new tab.
 *
 * DEVIATIONS from the target wireframe, and why:
 *   - The wireframe lists Industry/Style/Length/Tone control rows. Only
 *     Style and Length exist as real, backed controls — there is no
 *     industry- or tone-aware generation in logic.ts, and inventing one
 *     would be exactly the fabricated-filter-criteria this rebuild is
 *     supposed to avoid. The two real rows are shown; "Advanced filters"
 *     holds the third real control (Order), not an invented one.
 *   - "Available"/domain-status badge: rendered as a neutral "verify live"
 *     badge, never a true/false available claim — seeded, honest, and
 *     consistent with the tool's own documented HONESTY CONSTRAINT.
 *   - Favorite icon uses Star's sibling here (Heart, per the wireframe) — a
 *     pure glyph swap, same `toggleSave` handler and shortlist state as
 *     before.
 *   - "Load more" reveals more of the already-generated pool (up to
 *     `POOL_SIZE`) instead of a fresh generation call — those extra names
 *     were already computed and previously discarded by the fixed
 *     `BATCH_SIZE` slice, so this is reuse, not new generation logic.
 *   - The keyword char counter shows a plain character count with no
 *     denominator: the wireframe's "0/80" implies a hard cap that does not
 *     exist here (typed keywords can run long and are instead rejected with
 *     an explicit error), so printing a fake "/80" ceiling would misstate
 *     what the field actually enforces.
 *
 * HYDRATION — the first paint must be identical on the server and the client, so
 * the seed is a plain counter (`batchNo`), never `Math.random()` or `Date.now()`,
 * and the ordering comparator avoids `localeCompare` (ICU data differs between
 * Node and the browser). The shortlist is read from localStorage after mount.
 */

const SHORTLIST_KEY = 'scult-tools:business-name-generator:v1'

/**
 * Candidates generated per batch, before filtering. Twice the twelve first
 * shown, so "Load more" has real names to reveal instead of regenerating.
 *
 * Measured, not guessed: at 24 the slowest style (modern suffix, which exhausts
 * its combination space and burns the full attempt budget) costs 1.7 ms per
 * batch, and the rest are under 0.7 ms — comfortably inside the 16 ms frame, so
 * this stays on the main thread and recomputes on every keystroke. Raising it to
 * 36 buys nothing: only the brandable style can fill a pool that large.
 */
const POOL_SIZE = 24

const REGISTRAR_SEARCH = 'https://www.namecheap.com/domains/registration/results/?domain='

type LengthFilter = 'any' | 'short' | 'medium'

const LENGTH_FILTERS: readonly (readonly [LengthFilter, string, string])[] = [
  ['any', 'Any', 'Show every name in the batch'],
  [
    'short',
    '≤ 8 letters',
    'Only the ≤8-letter band — shortest to say, hardest to find free',
  ],
  [
    'medium',
    '≤ 12 letters',
    'Up to 12 letters, still comfortable on a sign or an invoice',
  ],
]

const LENGTH_CEILING: Record<LengthFilter, number> = {
  any: Number.POSITIVE_INFINITY,
  short: 8,
  medium: 12,
}

type Order = 'best' | 'batch'
type View = 'grid' | 'list'

/**
 * Tint per length band. The chip always states the band in words as well
 * ("great length" / "on the long side"), so the colour is a second signal and
 * never the only one. Text inside stays `ink-body`: these are pastels, and white
 * or violet-500 on them would fail contrast.
 */
const BAND_TINT: Record<LengthBand, string> = {
  great: 'bg-tile-green',
  good: 'bg-offwhite',
  long: 'bg-tile-yellow',
}

const CHIP =
  'inline-flex items-center gap-1 rounded-pill border border-line-grey px-2.5 py-1 text-[12px] text-ink-body leading-4'

const FEATURES: readonly {
  readonly icon: typeof Globe
  readonly title: string
  readonly body: string
}[] = [
  {
    icon: Globe,
    title: 'Domain link, not a claim',
    body: 'Every card links straight to a live registrar search — never a cached "available" guess.',
  },
  {
    icon: Sparkles,
    title: 'Brandable & unique',
    body: 'Five distinct naming strategies, each with the method shown on the card, not hidden behind a score.',
  },
  {
    icon: Zap,
    title: 'Instant results',
    body: 'Every batch appears as you type — no waiting on a server round-trip.',
  },
  {
    icon: Heart,
    title: 'Save favorites',
    body: 'Heart a name and it lands in your shortlist — it survives a reload, on this device only.',
  },
]

export function BusinessNameGenerator() {
  const [keyword1, setKeyword1] = useState('coffee')
  const [keyword2, setKeyword2] = useState('')
  const [style, setStyle] = useState<StyleId>('brandable')
  const [batchNo, setBatchNo] = useState(1)
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>('any')
  const [order, setOrder] = useState<Order>('best')
  const [view, setView] = useState<View>('grid')
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const [shortlist, setShortlist] = useState<readonly string[]>([])
  const [restored, setRestored] = useState(false)

  // Restore the shortlist after mount, never during render: the server has no
  // localStorage, and seeding state from it would break hydration.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SHORTLIST_KEY)
      if (raw !== null) {
        const parsed = parseShortlist(JSON.parse(raw))
        if (parsed) setShortlist(parsed)
      }
    } catch {
      // Blocked storage or corrupt JSON — start with an empty shortlist.
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    try {
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlist))
    } catch {
      // Private mode blocks writes; the in-memory shortlist still works.
    }
  }, [shortlist, restored])

  // The pool is a pure function of (keywords, style, batch number) through the
  // seeded rng, so typing refines it in place and Generate bumps the seed.
  const batch = useMemo(
    () => generateBatch([keyword1, keyword2], style, createRng(batchNo), POOL_SIZE),
    [keyword1, keyword2, style, batchNo],
  )

  const ceiling = LENGTH_CEILING[lengthFilter]

  // Filtering and ordering are memoised apart from generation, so flipping a
  // control re-sorts an existing array instead of regenerating.
  const ranked = useMemo(() => {
    const kept = batch.names.filter((idea) => idea.letters <= ceiling)
    return order === 'best' ? [...kept].sort(bestFirst) : kept
  }, [batch.names, ceiling, order])

  // Any change to the pool, the length ceiling or the order re-opens the page
  // at the first BATCH_SIZE names, so "Load more" always starts from a batch
  // the visitor hasn't scrolled through yet.
  // biome-ignore lint/correctness/useExhaustiveDependencies: effect body doesn't read these, it needs to re-run when they change — trimming the deps would stop the reset.
  useEffect(() => {
    setVisibleCount(BATCH_SIZE)
  }, [batch.names, ceiling, order])

  const shown = useMemo(() => ranked.slice(0, visibleCount), [ranked, visibleCount])
  const canLoadMore = ranked.length > shown.length

  const spec = STYLES.find((s) => s.id === style)
  const styleLabel = spec?.label ?? style

  const hasError = batch.error !== undefined
  // A filter that removes everything is not an error — the batch is fine, the
  // ceiling is just below it. Handled separately so the message can say so.
  const filteredOut = !hasError && batch.names.length > 0 && ranked.length === 0
  const shortest = batch.names.reduce(
    (min, idea) => Math.min(min, idea.letters),
    Number.POSITIVE_INFINITY,
  )
  const easyCount = shown.filter((idea) => idea.pronounceable).length

  function toggleSave(name: string): void {
    setShortlist((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name].slice(-SHORTLIST_LIMIT),
    )
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="overflow-hidden rounded-panel border border-line bg-cream shadow-brutal">
        <div className="p-5 pb-0 sm:p-8 sm:pb-0">
          <div className="mx-auto max-w-[38rem] text-center">
            <p className="text-[14px] text-ink-subtle leading-6">
              Type a keyword, pick a style, and get a batch of candidate names — each one
              with the method it was built from shown on the card.
            </p>
          </div>
        </div>

        {/* Evenly-spaced grid of brand buttons, exactly below the intro
            copy and above every other control — same pattern as Schema
            Markup Generator / FAQ Schema Generator's top action rows. Only
            three page-level actions exist here (Load sample, Clear,
            Generate names); the rest of this tool's buttons — Copy all,
            Empty, Load more names, "Use 'coffee' instead", "Show any
            length" — are all contextual to a specific section (the
            shortlist, the results list, an error/empty state), so they stay
            where they are, same as FAQ Schema Generator left "Add FAQ" next
            to its own list. Generate names is the "why you're here" action,
            so it is last and spans the full 2-column row on mobile so a
            trailing row is never half-empty; Load sample/Clear are
            secondary so they're `btn-white`. */}
        <div className="mt-6 grid grid-cols-2 gap-2 border-line border-y bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => {
              setKeyword1('coffee')
              setKeyword2('')
              trackToolEvent('business-name-generator', 'load_sample')
            }}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={() => {
              setKeyword1('')
              setKeyword2('')
              trackToolEvent('business-name-generator', 'clear')
            }}
            disabled={keyword1 === '' && keyword2 === ''}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              setBatchNo((n) => n + 1)
              trackToolEvent('business-name-generator', 'generate_names')
            }}
            className="btn-brutal btn-brutal-sm col-span-2 w-full text-black hover:text-ink sm:col-span-1"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Generate names
          </button>
        </div>

        <div className="p-5 pt-6 sm:p-8 sm:pt-6">
          <div className="mx-auto max-w-[34rem]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-baseline justify-between">
                  <label className="label" htmlFor="bng-keyword-1">
                    Keyword{' '}
                    <span className="font-normal text-[13px] text-ink-subtle">
                      · required
                    </span>
                  </label>
                  <span className="text-[12px] text-ink-subtle tabular-nums">
                    {keyword1.length} {keyword1.length === 1 ? 'character' : 'characters'}
                  </span>
                </div>
                <input
                  id="bng-keyword-1"
                  className="field"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="coffee"
                  value={keyword1}
                  onChange={(e) => setKeyword1(e.target.value)}
                  aria-describedby="bng-keyword-1-hint"
                />
                <p className="hint mt-1.5" id="bng-keyword-1-hint">
                  One word works best.
                </p>
              </div>
              <div>
                <label className="label" htmlFor="bng-keyword-2">
                  Second keyword{' '}
                  <span className="font-normal text-[13px] text-ink-subtle">
                    · optional
                  </span>
                </label>
                <input
                  id="bng-keyword-2"
                  className="field"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="brew"
                  value={keyword2}
                  onChange={(e) => setKeyword2(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 flex max-w-[34rem] flex-col gap-4">
            <fieldset>
              <legend className="label">Naming style</legend>
              <div className="flex flex-wrap justify-center gap-2">
                {STYLES.map((s) => (
                  <SegmentButton
                    key={s.id}
                    active={style === s.id}
                    onClick={() => setStyle(s.id)}
                  >
                    {s.label}
                  </SegmentButton>
                ))}
              </div>
              {spec ? <p className="hint mt-2 text-center">{spec.blurb}</p> : null}
            </fieldset>

            <fieldset>
              <legend className="label">Length</legend>
              <div className="flex flex-wrap justify-center gap-2">
                {LENGTH_FILTERS.map(([value, label, title]) => (
                  <SegmentButton
                    key={value}
                    active={lengthFilter === value}
                    onClick={() => setLengthFilter(value)}
                    title={title}
                  >
                    {label}
                  </SegmentButton>
                ))}
              </div>
            </fieldset>

            <details className="group rounded-sm border border-line-grey px-3 py-2.5">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-[14px] text-ink marker:content-none">
                Advanced filters
                <span
                  aria-hidden="true"
                  className="text-violet-700 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-3">
                <span className="label">Order</span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <SegmentButton
                    active={order === 'best'}
                    onClick={() => setOrder('best')}
                    title="Sorts by the two measures printed on every card: easy to say first, then fewest letters"
                  >
                    Best first
                  </SegmentButton>
                  <SegmentButton
                    active={order === 'batch'}
                    onClick={() => setOrder('batch')}
                    title="Leave the batch in the order it was generated"
                  >
                    As generated
                  </SegmentButton>
                </div>
              </div>
            </details>
          </div>

          <section
            aria-labelledby="bng-shortlist-heading"
            className="mx-auto mt-6 max-w-[34rem] border-line border-t pt-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3
                className="font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]"
                id="bng-shortlist-heading"
              >
                Shortlist <span className="tabular-nums">({shortlist.length})</span>
              </h3>
              {shortlist.length > 0 ? (
                <div className="flex items-center gap-2">
                  <CopyButton text={shortlist.join('\n')} label="Copy all" />
                  <ToolbarAction onClick={() => setShortlist([])}>Empty</ToolbarAction>
                </div>
              ) : null}
            </div>

            {shortlist.length === 0 ? (
              <p className="hint mt-2">
                Heart a name below and it lands here — it survives a reload.
              </p>
            ) : (
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {shortlist.map((name) => (
                  <li
                    key={name}
                    className="flex items-center gap-1 rounded-sm border border-line-grey bg-offwhite py-0.5 pr-0.5 pl-3 font-medium text-[14px] text-ink-body"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => toggleSave(name)}
                      aria-label={`Remove ${name} from your shortlist`}
                      className="flex size-11 items-center justify-center rounded-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <section aria-labelledby="bng-results-heading" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="bng-results-heading"
            className="font-display font-bold text-[20px] text-ink"
          >
            Generated names
          </h2>
          <fieldset className="flex items-center gap-1 border-0 p-0" aria-label="Layout">
            <SegmentButton
              active={view === 'grid'}
              onClick={() => setView('grid')}
              title="Card grid"
            >
              <LayoutGrid className="size-4" aria-hidden="true" />
              <span className="sr-only">Grid</span>
            </SegmentButton>
            <SegmentButton
              active={view === 'list'}
              onClick={() => setView('list')}
              title="Compact list"
            >
              <List className="size-4" aria-hidden="true" />
              <span className="sr-only">List</span>
            </SegmentButton>
          </fieldset>
        </div>

        <div className="mt-4">
          {hasError ? (
            <ErrorDetail
              message={batch.error ?? 'Enter a keyword to generate names.'}
              action={
                <ToolbarAction
                  onClick={() => {
                    setKeyword1('coffee')
                    setKeyword2('')
                  }}
                >
                  Use “coffee” instead
                </ToolbarAction>
              }
            />
          ) : filteredOut ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-line p-8 text-center">
              <p className="max-w-[40ch] text-[14px] text-ink-subtle leading-6">
                Nothing in batch #{batchNo} fits
                {Number.isFinite(ceiling) ? ` under ${ceiling} letters` : ' that ceiling'}{' '}
                — the shortest {styleLabel.toLowerCase()} name here is {shortest}.
                Compound and alliteration names carry a whole second word, so they run
                long; brandable and modern-suffix names are the short ones.
              </p>
              <ToolbarAction onClick={() => setLengthFilter('any')}>
                Show any length
              </ToolbarAction>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] text-ink-subtle">
                  {styleLabel} · {shown.length} of {ranked.length} shown
                </p>
                {shown.length > 0 ? (
                  <CopyButton
                    text={shown.map((idea) => idea.name).join('\n')}
                    label="Copy all"
                  />
                ) : null}
              </div>

              <ul
                className={
                  view === 'grid'
                    ? 'mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'
                    : 'mt-3 flex flex-col gap-2'
                }
              >
                {shown.map((idea) => (
                  <NameCard
                    key={idea.name}
                    idea={idea}
                    saved={shortlist.includes(idea.name)}
                    onToggle={toggleSave}
                    variant={view}
                  />
                ))}
              </ul>

              {canLoadMore ? (
                <div className="mt-4 flex justify-center">
                  <ToolbarAction
                    onClick={() =>
                      setVisibleCount((n) => Math.min(n + BATCH_SIZE, ranked.length))
                    }
                  >
                    Load more names
                  </ToolbarAction>
                </div>
              ) : null}

              <p className="hint mt-4">
                “Check” opens Namecheap’s live search in a new tab — this page never
                claims a name is free. The syllable split is a vowel-pattern guess, there
                to make you say the name out loud before you commit to it.
              </p>
            </>
          )}
        </div>

        <div className="mt-4">
          <StatusBar
            state={hasError ? 'invalid' : 'neutral'}
            message={
              hasError
                ? 'Fix the keyword to generate names'
                : filteredOut
                  ? `Batch #${batchNo} · nothing under that length`
                  : `Batch #${batchNo} · ${styleLabel.toLowerCase()} names`
            }
            stats={
              hasError
                ? undefined
                : [
                    { label: 'names shown', value: String(shown.length) },
                    { label: 'easy to say', value: `${easyCount} of ${shown.length}` },
                    { label: 'shortlisted', value: String(shortlist.length) },
                  ]
            }
            privacyNote="Built in your browser — the shortlist stays on this device"
          />
        </div>
      </section>

      <section aria-labelledby="bng-feature-heading" className="mt-10">
        <h2 id="bng-feature-heading" className="sr-only">
          Why use this tool
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-2 text-center">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-tile-lavender">
                <f.icon className="size-4.5 text-violet-700" aria-hidden="true" />
              </span>
              <p className="font-semibold text-[13px] text-ink leading-5">{f.title}</p>
              <p className="text-[12px] text-ink-subtle leading-5">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/**
 * One candidate, with its working shown.
 *
 * The three chips are the reason this tool exists: Namelix gives you a name and
 * nothing else, Looka gives you an opaque score. Every figure here comes from
 * `logic.ts` and is stated in words as well as tinted, so the card reads the same
 * in greyscale and to a screen reader. The brandability ring is the same figures,
 * rolled into one number — never a replacement for the chips, which stay so the
 * ring is auditable rather than a black box.
 */
function NameCard({
  idea,
  saved,
  onToggle,
  variant,
}: {
  idea: NameIdea
  saved: boolean
  onToggle: (name: string) => void
  variant: View
}) {
  const syllables = countSyllables(idea.sayIt)
  const brandability: BrandabilityScore = computeBrandabilityScore(idea)
  const list = variant === 'list'

  return (
    <li
      className={
        list
          ? 'flex flex-wrap items-center gap-3 rounded-card border border-line bg-cream p-3'
          : 'flex flex-col rounded-card border border-line bg-cream p-3.5'
      }
    >
      <div className={list ? 'flex min-w-0 flex-1 items-center gap-3' : 'contents'}>
        <div className={list ? 'shrink-0' : 'hidden'}>
          <ScoreRing value={brandability.score} size="sm" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="break-words font-display font-bold text-[22px] text-ink leading-7">
              {idea.name}
            </h4>
            {!list ? (
              <button
                type="button"
                aria-pressed={saved}
                aria-label={
                  saved
                    ? `Remove ${idea.name} from your shortlist`
                    : `Save ${idea.name} to your shortlist`
                }
                onClick={() => onToggle(idea.name)}
                className={`flex size-11 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                  saved
                    ? 'border-ink bg-cta text-ink'
                    : 'border-line-grey bg-cream text-ink-muted hover:border-ink hover:text-ink'
                }`}
              >
                <Heart
                  className="size-5"
                  aria-hidden="true"
                  fill={saved ? 'currentColor' : 'none'}
                />
              </button>
            ) : null}
          </div>

          <p className="mt-1 text-[13px] text-ink-subtle leading-5">{idea.how}</p>

          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            <li className={`${CHIP} ${BAND_TINT[idea.lengthBand]}`}>
              {idea.letters} letters · {idea.lengthNote}
            </li>
            <li
              className={`${CHIP} ${idea.pronounceable ? 'bg-offwhite' : 'bg-tile-yellow'}`}
            >
              {idea.pronounceable ? null : (
                <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
              )}
              {idea.pronounceable ? 'easy to say' : 'tricky consonant run'}
            </li>
            <li className={`${CHIP} bg-offwhite`}>
              {syllables} {syllables === 1 ? 'syllable' : 'syllables'} · {idea.sayIt}
            </li>
            <li className={`${CHIP} bg-offwhite`}>
              <Globe className="size-3.5 shrink-0" aria-hidden="true" />
              verify live
            </li>
          </ul>
        </div>
      </div>

      <div
        className={
          list
            ? 'flex shrink-0 items-center gap-2'
            : 'mt-3 flex flex-wrap items-center gap-2 pt-1'
        }
      >
        {!list ? <ScoreRing value={brandability.score} size="sm" /> : null}
        <CopyButton
          text={idea.name}
          onCopy={() => trackToolEvent('business-name-generator', 'copy_name')}
        />
        <a
          href={`${REGISTRAR_SEARCH}${encodeURIComponent(idea.domain)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-sm border border-line-grey bg-cream px-3 py-1.5 font-medium text-[14px] transition-colors hover:border-ink"
        >
          Check <span className="font-mono text-[13px]">{idea.domain}</span>
          <span className="sr-only"> at Namecheap, opens in a new tab</span>
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
        {list ? (
          <button
            type="button"
            aria-pressed={saved}
            aria-label={
              saved
                ? `Remove ${idea.name} from your shortlist`
                : `Save ${idea.name} to your shortlist`
            }
            onClick={() => onToggle(idea.name)}
            className={`flex size-11 shrink-0 items-center justify-center rounded-sm border transition-colors ${
              saved
                ? 'border-ink bg-cta text-ink'
                : 'border-line-grey bg-cream text-ink-muted hover:border-ink hover:text-ink'
            }`}
          >
            <Heart
              className="size-5"
              aria-hidden="true"
              fill={saved ? 'currentColor' : 'none'}
            />
          </button>
        ) : null}
      </div>
    </li>
  )
}

/**
 * "Best first" ranks by exactly what the card prints — easy to say, then fewest
 * letters — so the ordering is auditable rather than a hidden score.
 *
 * There is deliberately NO third tiebreak. `Array.prototype.sort` is stable, so
 * equally-ranked names keep the order the seeded generator produced them in, and
 * pressing Generate visibly changes the top of the list. An alphabetical
 * tiebreak was tried first and was wrong: brandable names are nearly all five or
 * six letters and all easy to say, so alphabetical order dominated and two
 * different batches opened with the same three names.
 *
 * Sorting by name would also have to avoid `localeCompare` regardless — ICU
 * collation data differs between Node and the browser, and this component is
 * server-rendered, so a locale-aware sort could order the seeded first paint
 * differently on each side and break hydration.
 */
function bestFirst(a: NameIdea, b: NameIdea): number {
  if (a.pronounceable !== b.pronounceable) return a.pronounceable ? -1 : 1
  return a.letters - b.letters
}

/**
 * Counts the parts of `logic.ts`'s syllable split (`cof·a·ra` → 3). Words in a
 * two-word name are joined with ` · `, so splitting on the separator counts the
 * whole name. A rough figure, presented as one — the split is printed beside it
 * so the reader can judge it themselves.
 */
function countSyllables(sayIt: string): number {
  return sayIt.split('·').filter((part) => part.trim() !== '').length
}
