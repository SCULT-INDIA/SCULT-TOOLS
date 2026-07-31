'use client'

import { ExternalLink, RefreshCw, Star, TriangleAlert, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
  BATCH_SIZE,
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
 * Business name generator — rebuilt on the shared workspace.
 * Research brief: docs/research/business-name-generator.md
 *
 * What changed, and why:
 *   - The names are now the right-hand pane, level with the controls instead of
 *     stacked a scroll below them. Previously the keyword fields, the style
 *     buttons and Regenerate filled the first screen and the twelve names — the
 *     entire point of the tool — started below the fold.
 *   - Each card now leads with the evidence rather than burying it in three grey
 *     sentences: length band, pronounceability and the syllable split are chips,
 *     because "why is this name good" is what this tool has and the competitors
 *     do not.
 *   - A length filter (table stakes: Namelix, Looka and Squarespace all have one)
 *     over a pool of 24 rather than 12, so filtering has something to filter.
 *   - Shortlist moved into the input pane. It was a full-width band between the
 *     controls and the results, i.e. exactly the layout problem the shared
 *     workspace exists to remove.
 *
 * Generation, scoring and the shortlist parser all stay in logic.ts, already
 * tested. This file holds state, filtering/ordering of an already-scored batch,
 * and markup.
 *
 * HONESTY CONSTRAINT — deliberate, do not "fix" this into a green tick. A page
 * running in the visitor's tab cannot resolve DNS or query a registrar, so this
 * tool never renders an availability verdict of any kind. It links out to
 * Namecheap's public search, labelled as a check you are about to perform
 * elsewhere. Competitors that show "available" inline are reading a cached
 * affiliate feed; being wrong about that costs someone a business name.
 *
 * HYDRATION — the first paint must be identical on the server and the client, so
 * the seed is a plain counter (`batchNo`), never `Math.random()` or `Date.now()`,
 * and the ordering comparator avoids `localeCompare` (ICU data differs between
 * Node and the browser). The shortlist is read from localStorage after mount.
 */

const SHORTLIST_KEY = 'scult-tools:business-name-generator:v1'

/**
 * Candidates generated per batch, before filtering. Twice the twelve shown, so
 * the length filter has room to remove names without emptying the grid.
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

export function BusinessNameGenerator() {
  const [keyword1, setKeyword1] = useState('coffee')
  const [keyword2, setKeyword2] = useState('')
  const [style, setStyle] = useState<StyleId>('brandable')
  const [batchNo, setBatchNo] = useState(1)
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>('any')
  const [order, setOrder] = useState<Order>('best')
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
  // seeded rng, so typing refines it in place and Regenerate bumps the seed.
  const batch = useMemo(
    () => generateBatch([keyword1, keyword2], style, createRng(batchNo), POOL_SIZE),
    [keyword1, keyword2, style, batchNo],
  )

  const ceiling = LENGTH_CEILING[lengthFilter]

  // Filtering and ordering are memoised apart from generation, so flipping a
  // toolbar control re-sorts an existing array instead of regenerating.
  const shown = useMemo(() => {
    const kept = batch.names.filter((idea) => idea.letters <= ceiling)
    const ranked = order === 'best' ? [...kept].sort(bestFirst) : kept
    return ranked.slice(0, BATCH_SIZE)
  }, [batch.names, ceiling, order])

  const spec = STYLES.find((s) => s.id === style)
  const styleLabel = spec?.label ?? style

  const hasError = batch.error !== undefined
  // A filter that removes everything is not an error — the batch is fine, the
  // ceiling is just below it. Handled separately so the message can say so.
  const filteredOut = !hasError && batch.names.length > 0 && shown.length === 0
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
    <ToolWorkspace
      inputLabel="Keywords and naming style"
      outputLabel="Generated name ideas"
      minHeight="min-h-[32rem]"
      toolbar={
        <ToolToolbar
          actions={
            <>
              <button
                type="button"
                onClick={() => setBatchNo((n) => n + 1)}
                className="btn-brutal btn-brutal-sm btn-violet"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Regenerate
              </button>
              <ToolbarAction
                onClick={() => {
                  setKeyword1('coffee')
                  setKeyword2('')
                }}
              >
                Load sample
              </ToolbarAction>
              <ToolbarAction
                onClick={() => {
                  setKeyword1('')
                  setKeyword2('')
                }}
                disabled={keyword1 === '' && keyword2 === ''}
              >
                Clear
              </ToolbarAction>
            </>
          }
        >
          <ToolbarGroup label="Length">
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
          </ToolbarGroup>

          <ToolbarGroup label="Order">
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
          </ToolbarGroup>
        </ToolToolbar>
      }
      input={
        <Pane title="Keywords & style">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="bng-keyword-1">
                  Keyword{' '}
                  <span className="font-normal text-[13px] text-ink-subtle">
                    · required
                  </span>
                </label>
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

            <fieldset>
              <legend className="label">Naming style</legend>
              <div className="flex flex-wrap gap-2">
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
              {spec ? <p className="hint mt-2">{spec.blurb}</p> : null}
            </fieldset>

            <section
              aria-labelledby="bng-shortlist-heading"
              className="border-line border-t pt-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4
                  className="font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]"
                  id="bng-shortlist-heading"
                >
                  Shortlist <span className="tabular-nums">({shortlist.length})</span>
                </h4>
                {shortlist.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <CopyButton text={shortlist.join('\n')} label="Copy all" />
                    <ToolbarAction onClick={() => setShortlist([])}>Empty</ToolbarAction>
                  </div>
                ) : null}
              </div>

              {shortlist.length === 0 ? (
                <p className="hint mt-2">
                  Star a name on the right and it lands here — it survives a reload.
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
        </Pane>
      }
      output={
        <Pane
          title={`${styleLabel} ideas`}
          actions={
            shown.length > 0 ? (
              <CopyButton
                text={shown.map((idea) => idea.name).join('\n')}
                label="Copy all"
              />
            ) : null
          }
        >
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
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
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
              <ul className="grid gap-3 xl:grid-cols-2">
                {shown.map((idea) => (
                  <NameCard
                    key={idea.name}
                    idea={idea}
                    saved={shortlist.includes(idea.name)}
                    onToggle={toggleSave}
                  />
                ))}
              </ul>

              {/* Kept to the two facts not stated elsewhere on this page. The
                  registrar-is-the-only-authority and trademark caveats moved out
                  — both are answered word-for-word in the FAQ below the tool —
                  but the never-claims-free stance itself stays here, at the
                  buttons it qualifies. */}
              <p className="hint mt-4">
                “Check” opens Namecheap’s live search in a new tab — this page never
                claims a name is free. The syllable split is a vowel-pattern guess, there
                to make you say the name out loud before you commit to it.
              </p>
            </>
          )}
        </Pane>
      }
      status={
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
      }
    />
  )
}

/**
 * One candidate, with its working shown.
 *
 * The three chips are the reason this tool exists: Namelix gives you a name and
 * nothing else, Looka gives you an opaque score. Every figure here comes from
 * `logic.ts` and is stated in words as well as tinted, so the card reads the same
 * in greyscale and to a screen reader.
 */
function NameCard({
  idea,
  saved,
  onToggle,
}: {
  idea: NameIdea
  saved: boolean
  onToggle: (name: string) => void
}) {
  const syllables = countSyllables(idea.sayIt)

  return (
    <li className="flex flex-col rounded-card border border-line bg-white p-3.5">
      <div className="flex items-start justify-between gap-2">
        <h4 className="break-words font-display font-bold text-[22px] text-ink leading-7">
          {idea.name}
        </h4>
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
              : 'border-line-grey bg-white text-ink-muted hover:border-ink hover:text-ink'
          }`}
        >
          <Star
            className="size-5"
            aria-hidden="true"
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>
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
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
        <CopyButton text={idea.name} />
        <a
          href={`${REGISTRAR_SEARCH}${encodeURIComponent(idea.domain)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-sm border border-line-grey bg-white px-3 py-1.5 font-medium text-[14px] transition-colors hover:border-ink"
        >
          Check <span className="font-mono text-[13px]">{idea.domain}</span>
          <span className="sr-only"> at Namecheap, opens in a new tab</span>
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
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
 * pressing Regenerate visibly changes the top of the list. An alphabetical
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
