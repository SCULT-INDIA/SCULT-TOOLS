'use client'

import {
  Ban,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Download,
  ExternalLink,
  Eye,
  ListChecks,
  Plus,
  Search,
  Sparkles,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  CodePane,
  Pane,
  ScoreRing,
  SegmentButton,
  StatCard,
  StatusBar,
  ToolbarGroup,
  ToolToolbar,
  useDialogBehavior,
} from '@/components/tools/workspace'
import { trackToolEvent } from '@/lib/analytics'
import { ANSWER_SOFT_LIMIT, buildFaqSchema } from '@/lib/tools/faq-schema-generator/logic'

/**
 * FAQ schema generator — bespoke dashboard layout, restructured to match
 * Schema Markup Generator's sectional pattern at the user's explicit
 * request: two persistent columns (builder, generated markup) plus a
 * "Preview" overlay for everything that used to be a third column or a
 * separate full-width strip, and export actions moved into an evenly-spaced
 * brand-button row above the columns instead of a bar underneath them.
 *
 *   - The builder column is unchanged: search, reorderable rows (question
 *     always visible, answer collapsible so a long list scans without every
 *     full answer pushing it down), the tip callout, and inline warnings.
 *   - The old three-column dashboard's second column (Live FAQ preview —
 *     Google / accordion / AI tabs) and the full-width "Validation & scores"
 *     strip that used to sit below the grid are now ONE "Preview" modal,
 *     opened from the toolbar — mirroring how Schema Markup Generator folds
 *     its Rich Result Preview tabs and validation checklist into a single
 *     modal rather than two separate regions.
 *   - The generated-markup column (JSON-LD / HTML + schema) is unchanged.
 *   - Export actions (Load sample, Clear, Download JSON, Download TXT,
 *     Preview) are a 2/3/5-column responsive grid of `.btn-brutal` buttons
 *     above the columns, spanning the brand button system's three colour
 *     modifiers, replacing the old bottom action bar. "Add FAQ" is NOT in
 *     that grid — it stays where it already was, at the end of the builder
 *     column's row list, which is also why the bottom bar's duplicate "Add
 *     FAQ" button was removed rather than kept as a second way to do the
 *     same thing.
 *   - The modal's open/close behaviour (focus trap, Escape, body-scroll
 *     lock, focus return) is the shared `useDialogBehavior` hook — the same
 *     one Schema Markup Generator and `MobileDrawer.tsx` use.
 *
 * Schema construction, unicode escaping of "<", HTML escaping, duplicate
 * detection and every warning stay in logic.ts, which is unchanged and separately
 * tested. This file holds row state, focus management, derived display-only
 * values (the property checklist, the AI-readiness score) and markup.
 *
 * "AI Improve" per row and the "AI Preview" tab are static, clearly-labelled
 * placeholders — no request leaves the browser and no answer is rewritten.
 * The AI-readiness score is a presentational roll-up of the same warnings and
 * property checks already computed below; it introduces no new validation
 * rule of its own.
 */

interface QaRow {
  readonly id: number
  readonly question: string
  readonly answer: string
}

type OutputFormat = 'json' | 'html'
type PreviewTab = 'google' | 'accordion' | 'ai'

/**
 * Three realistic pairs, so the first paint already shows working JSON-LD, a
 * populated preview and zero warnings — you edit a working example instead of
 * staring at an empty form. Three rather than two also makes the reorder buttons
 * self-explanatory: with two rows, every move is the same move.
 *
 * The ids are FIXED literals, never a counter or a timestamp. These rows render
 * on the server too, and an id that differed between the server and the first
 * client render would be a hydration mismatch. Only rows the user adds draw from
 * the counter, which by then is client-only.
 */
const SAMPLE_ROWS: readonly QaRow[] = [
  {
    id: 1,
    question: 'How much does a website cost in India?',
    answer:
      'A brochure site for a small business typically runs ₹30,000–₹1,00,000 depending on page count and how much custom design work is involved. E-commerce and web apps start higher. Ask for a fixed, written quote before work begins.',
  },
  {
    id: 2,
    question: 'How long does SEO take to show results?',
    answer:
      'Expect 3–6 months before rankings and traffic move meaningfully. An established site can shift faster; a brand-new domain takes longer, because search engines need time to trust it at all.',
  },
  {
    id: 3,
    question: 'What do you need from me before the project starts?',
    answer:
      'Your logo files, brand colours, and whatever copy already exists — even rough notes. We write the rest. Access to your domain registrar and hosting is only needed at launch, not on day one.',
  },
]

/** The first id handed out after the seeded rows. Client-side only. */
const FIRST_USER_ID = SAMPLE_ROWS.length + 1

const numberFormat = new Intl.NumberFormat('en-IN')

function fmt(n: number): string {
  return numberFormat.format(n)
}

/** Shortens text for the AI-preview mockup's sample line. */
function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

export function FaqSchemaGenerator() {
  const [rows, setRows] = useState<readonly QaRow[]>(SAMPLE_ROWS)
  const [format, setFormat] = useState<OutputFormat>('json')
  const [focusTarget, setFocusTarget] = useState<string | null>(null)
  const nextId = useRef(FIRST_USER_ID)

  const [query, setQuery] = useState('')
  const [collapsedIds, setCollapsedIds] = useState<ReadonlySet<number>>(() => new Set())
  const [previewTab, setPreviewTab] = useState<PreviewTab>('google')
  const [showAllSuggestions, setShowAllSuggestions] = useState(false)

  // Live FAQ preview + Validation & scores, both folded into one on-demand
  // modal (see the file docblock) rather than a third column and a separate
  // full-width strip.
  const [previewOpen, setPreviewOpen] = useState(false)
  const previewModalRef = useRef<HTMLDivElement>(null)
  const previewTriggerRef = useRef<HTMLButtonElement>(null)
  useDialogBehavior(previewOpen, setPreviewOpen, previewModalRef, previewTriggerRef)

  /**
   * Focus moves after the DOM has the new row order, never inside the handler
   * that caused it.
   *
   * Reordering keeps focus on the pressed button for free — stable keys mean the
   * button's DOM node travels with its row — but a move that lands a row at an
   * edge disables that very button, which would drop focus to the document. Those
   * cases hand focus to the opposite arrow instead.
   */
  useEffect(() => {
    if (focusTarget === null) return
    document.getElementById(focusTarget)?.focus()
    setFocusTarget(null)
  }, [focusTarget])

  const result = useMemo(() => buildFaqSchema(rows), [rows])
  const included = result.jsonLd.mainEntity
  const hasPairs = included.length > 0
  const allBlank = rows.every((r) => r.question.trim() === '' && r.answer.trim() === '')

  // Empty when nothing is complete, so the CodePane shows its own explanation
  // rather than an FAQPage shell with an empty mainEntity, which reads as a bug.
  const output = hasPairs ? (format === 'json' ? result.json : result.html) : ''

  /**
   * The preview mirrors logic.ts's inclusion rule — a row counts once both sides
   * are non-blank — but is derived from `rows` rather than from the built schema,
   * so each entry keeps its row's stable id as a React key. Keying the preview on
   * question text (as the previous version did) meant editing a question threw
   * away that entry's expanded state mid-keystroke.
   *
   * Nothing here builds markup: everything that gets pasted comes from
   * `buildFaqSchema` alone.
   */
  const previewRows = useMemo(
    () =>
      rows
        .map((row) => ({
          id: row.id,
          question: row.question.trim(),
          answer: row.answer.trim(),
        }))
        .filter((row) => row.question !== '' && row.answer !== ''),
    [rows],
  )

  /**
   * Display-only filter over the builder list. Every handler below still
   * receives the row's TRUE index in `rows`, so a filtered view can never make
   * reordering, removal or the "Question N" numbering disagree with the
   * warnings, which are numbered against the full, unfiltered list.
   */
  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (needle === '') return rows
    return rows.filter(
      (r) =>
        r.question.toLowerCase().includes(needle) ||
        r.answer.toLowerCase().includes(needle),
    )
  }, [rows, query])

  /**
   * Properties every FAQPage needs, per schema.org and Google's structured-data
   * docs. `@context` and `@type` are set unconditionally by `buildFaqSchema`;
   * the other three only appear once at least one pair is complete. This reads
   * the already-built `result.jsonLd`, so it can never disagree with the actual
   * output — it does not decide anything logic.ts does not already decide.
   */
  const propertyChecks = useMemo(
    () =>
      [
        { key: '@type', label: '@type', detail: 'FAQPage', present: true },
        {
          key: 'mainEntity',
          label: 'mainEntity',
          detail: `${fmt(included.length)} entr${included.length === 1 ? 'y' : 'ies'}`,
          present: hasPairs,
        },
        {
          key: 'Question',
          label: 'Question',
          detail: `${fmt(included.length)} object${included.length === 1 ? '' : 's'}`,
          present: hasPairs,
        },
        {
          key: 'Answer',
          label: 'Answer',
          detail: `${fmt(included.length)} object${included.length === 1 ? '' : 's'}`,
          present: hasPairs,
        },
      ] as const,
    [included.length, hasPairs],
  )
  const requiredPresentCount = propertyChecks.filter((c) => c.present).length

  /**
   * A presentational roll-up of signals already computed above — not a new
   * validation rule. Half the score is "does the schema carry the properties
   * it needs", the rest rewards having enough complete pairs and having no
   * open warnings. Every input already exists; this only re-weights them into
   * one number for the score-ring tile.
   */
  const aiReadinessScore = Math.round(
    (requiredPresentCount / propertyChecks.length) * 50 +
      (included.length >= 2 ? 30 : included.length === 1 ? 15 : 0) +
      (hasPairs && result.warnings.length === 0 ? 20 : 0),
  )

  const schemaValidation = !hasPairs
    ? {
        label: 'Waiting',
        sublabel: 'Add a complete pair to validate',
        tone: 'lavender' as const,
      }
    : result.warnings.length === 0
      ? { label: 'Valid', sublabel: 'No issues found', tone: 'green' as const }
      : {
          label: `${result.warnings.length} issue${result.warnings.length === 1 ? '' : 's'}`,
          sublabel: 'See AI suggestions below',
          tone: 'yellow' as const,
        }

  function setField(id: number, field: 'question' | 'answer', value: string): void {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function addRow(): void {
    const id = nextId.current
    nextId.current += 1
    setRows([...rows, { id, question: '', answer: '' }])
    setQuery('')
    setFocusTarget(`faq-q-${id}`)
  }

  function removeRow(index: number): void {
    if (rows.length <= 1) return
    const next = rows.filter((_, i) => i !== index)
    // Land on the row that took this one's place, or on the new last row.
    const heir = next[index] ?? next[next.length - 1]
    setRows(next)
    setFocusTarget(heir === undefined ? 'faq-add' : `faq-q-${heir.id}`)
  }

  function moveRow(index: number, delta: -1 | 1): void {
    const target = index + delta
    const moved = rows[index]
    const displaced = rows[target]
    if (moved === undefined || displaced === undefined) return

    const next = [...rows]
    next[index] = displaced
    next[target] = moved
    setRows(next)

    // Whichever arrow the row lands next to still works; the other is disabled.
    const landedAtTop = target === 0
    const landedAtBottom = target === next.length - 1
    const stillEnabled =
      delta === -1 ? (landedAtTop ? 'down' : 'up') : landedAtBottom ? 'up' : 'down'
    setFocusTarget(`faq-${stillEnabled}-${moved.id}`)
  }

  function clearAll(): void {
    const id = nextId.current
    nextId.current += 1
    setRows([{ id, question: '', answer: '' }])
    setQuery('')
    setFocusTarget(`faq-q-${id}`)
    trackToolEvent('faq-schema-generator', 'clear')
  }

  function toggleCollapsed(id: number): void {
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  /** Same file-download shape used across the tool set — an object URL on a
   * throwaway anchor, revoked a few seconds later. */
  function downloadText(filename: string, mime: string, content: string): void {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  function downloadJson(): void {
    if (!hasPairs) return
    downloadText('faq-schema.json', 'application/json', result.json)
    trackToolEvent('faq-schema-generator', 'download_schema', { format: 'json' })
  }

  function downloadTxt(): void {
    if (!hasPairs) return
    const text = previewRows
      .map((row, i) => `Q${i + 1}: ${row.question}\nA${i + 1}: ${row.answer}`)
      .join('\n\n')
    downloadText('faq-questions-and-answers.txt', 'text/plain', text)
    trackToolEvent('faq-schema-generator', 'download_schema', { format: 'txt' })
  }

  return (
    <>
      <div className="overflow-hidden rounded-panel border border-line bg-cream">
        <div className="border-line border-b bg-offwhite">
          <ToolToolbar>
            <ToolbarGroup label="Output">
              <SegmentButton
                active={format === 'json'}
                onClick={() => setFormat('json')}
                title="Just the contents of the JSON-LD script tag"
              >
                JSON-LD
              </SegmentButton>
              <SegmentButton
                active={format === 'html'}
                onClick={() => setFormat('html')}
                title="The visible FAQ block plus the script tag, in one paste"
              >
                HTML + schema
              </SegmentButton>
            </ToolbarGroup>
          </ToolToolbar>
        </div>

        {/* An evenly-spaced grid, not a left-packed flex-wrap row — 5 buttons
          of differing text length wrapped unevenly with a ragged gap on the
          right at desktop widths (see Schema Markup Generator's identical
          fix). A grid gives every cell equal width at every breakpoint: 2-up
          on phones, 3-up on small tablets, one even row of 5 from `lg` up.
          Brand buttons (`.btn-brutal`) spanning all three colour modifiers —
          default cta-yellow on the first "start here" action, `btn-violet`
          for the primary "view result" action, `btn-white` for the rest. */}
        <div className="grid grid-cols-2 gap-2 border-line border-b bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-5">
          <button
            type="button"
            onClick={() => {
              setRows(SAMPLE_ROWS)
              trackToolEvent('faq-schema-generator', 'load_sample')
            }}
            className="btn-brutal btn-brutal-sm w-full"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={rows.length === 1 && allBlank}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={downloadJson}
            disabled={!hasPairs}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            <Download className="size-4" aria-hidden="true" />
            Download JSON
          </button>
          <button
            type="button"
            onClick={downloadTxt}
            disabled={!hasPairs}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            <Download className="size-4" aria-hidden="true" />
            Download TXT
          </button>
          <button
            ref={previewTriggerRef}
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="btn-brutal btn-brutal-sm btn-violet col-span-2 w-full sm:col-span-1"
          >
            <Eye className="size-4" aria-hidden="true" />
            Preview
          </button>
        </div>

        {/* Two columns, left to right: fill in the FAQ, read the generated
          markup. Live FAQ preview and Validation & scores are now the
          "Preview" modal above, not a third column here — see the file
          docblock. */}
        <div className="grid lg:grid-cols-2">
          <section
            aria-label="FAQ builder"
            className="flex flex-col border-line lg:border-r"
          >
            <Pane
              title="FAQ builder"
              actions={
                <span className="text-[13px] text-ink-subtle">
                  {fmt(rows.length)} question{rows.length === 1 ? '' : 's'}
                </span>
              }
            >
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute inset-y-0 left-3 flex size-4 items-center text-ink-subtle"
                    aria-hidden="true"
                  />
                  <label className="sr-only" htmlFor="faq-search">
                    Search questions and answers
                  </label>
                  <input
                    id="faq-search"
                    type="search"
                    className="field pl-9 pr-9"
                    placeholder="Search questions and answers…"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query !== '' ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      className="absolute inset-y-0 right-2 flex items-center px-1 text-ink-subtle hover:text-ink"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>

                {filteredRows.length === 0 ? (
                  <p className="rounded-card border border-line-grey bg-cream p-3 text-[13px] text-ink-subtle leading-5">
                    No questions match “{query}”.{' '}
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="font-medium text-violet-700 underline decoration-1 underline-offset-2"
                    >
                      Clear search
                    </button>
                  </p>
                ) : (
                  filteredRows.map((row) => {
                    const trueIndex = rows.findIndex((r) => r.id === row.id)
                    return (
                      <FaqRow
                        key={row.id}
                        row={row}
                        index={trueIndex}
                        total={rows.length}
                        collapsed={collapsedIds.has(row.id)}
                        onToggle={() => toggleCollapsed(row.id)}
                        onQuestionChange={(v) => setField(row.id, 'question', v)}
                        onAnswerChange={(v) => setField(row.id, 'answer', v)}
                        onMoveUp={() => moveRow(trueIndex, -1)}
                        onMoveDown={() => moveRow(trueIndex, 1)}
                        onRemove={() => removeRow(trueIndex)}
                      />
                    )
                  })
                )}

                <div>
                  <button
                    type="button"
                    id="faq-add"
                    onClick={addRow}
                    className="btn-brutal btn-brutal-sm btn-white"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Add New FAQ
                  </button>
                </div>

                <div className="rounded-card border border-line-grey bg-tile-lavender p-3">
                  <h4 className="font-sans font-bold text-[12px] text-violet-700 uppercase tracking-[0.1em]">
                    Tip
                  </h4>
                  <p className="mt-1.5 text-[13px] text-ink-body leading-5">
                    Write questions the way people actually type them into search —
                    long-tail phrasing surfaces in more queries than a tidy, formal
                    version of the same question.
                  </p>
                </div>

                {result.warnings.length > 0 ? (
                  <div className="rounded-card border border-line-grey bg-tile-yellow p-3">
                    <h4 className="font-sans font-bold text-[12px] text-ink uppercase tracking-[0.1em]">
                      Worth checking
                    </h4>
                    <ul className="mt-2 flex flex-col gap-2">
                      {result.warnings.map((warning) => (
                        <li
                          key={warning}
                          className="flex gap-2 text-[13px] text-ink-body leading-5"
                        >
                          <TriangleAlert
                            className="mt-0.5 size-4 shrink-0 text-violet-700"
                            aria-hidden="true"
                          />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </Pane>
          </section>

          <section
            aria-label="Generated markup"
            className="flex flex-col border-line border-t lg:border-t-0"
          >
            <Pane
              title={format === 'json' ? 'JSON-LD' : 'HTML + JSON-LD'}
              padded={false}
              scroll={false}
              actions={
                output === '' ? null : (
                  <CopyButton
                    text={output}
                    onCopy={() =>
                      trackToolEvent('faq-schema-generator', 'copy_output', { format })
                    }
                  />
                )
              }
            >
              <div className="flex h-full flex-col">
                <p className="shrink-0 border-line border-b bg-offwhite px-4 py-2 text-[13px] text-ink-muted leading-5">
                  {format === 'json' ? (
                    <>
                      Paste inside a{' '}
                      <code className="font-mono text-[12px] text-ink">
                        {'<script type="application/ld+json">'}
                      </code>{' '}
                      tag — but only if these answers are already visible on the page.
                    </>
                  ) : (
                    <>
                      One paste: the visible FAQ block <em>and</em> the script tag. Use
                      this when the page does not already show the answers.
                    </>
                  )}
                </p>

                <div className="min-h-0 flex-1">
                  <CodePane
                    value={output}
                    language={format === 'json' ? 'json' : 'html'}
                    emptyLabel="Fill in a question and its answer on the left. The markup is assembled here as you type."
                  />
                </div>
              </div>
            </Pane>
          </section>
        </div>

        <div className="border-line border-t bg-offwhite">
          <StatusBar
            state={
              hasPairs ? (result.warnings.length > 0 ? 'invalid' : 'valid') : 'neutral'
            }
            message={
              hasPairs
                ? result.warnings.length > 0
                  ? `${result.warnings.length} thing${result.warnings.length === 1 ? '' : 's'} worth checking`
                  : 'FAQPage markup ready'
                : 'Waiting for one complete question and answer'
            }
            stats={[
              { label: 'in the schema', value: fmt(included.length) },
              { label: 'rows', value: fmt(rows.length) },
              ...(output === ''
                ? []
                : [{ label: 'characters', value: fmt(output.length) }]),
            ]}
            privacyNote="Built in your browser — nothing is uploaded"
          />
        </div>
      </div>

      {/* Preview modal — Live FAQ preview (Google/accordion/AI tabs) and
          Validation & scores, folded into one on-demand overlay opened from
          the "Preview" button above. Same dialog contract as Schema Markup
          Generator's Rich Result Preview modal via the shared
          `useDialogBehavior` hook: focus trap, Escape closes, body scroll
          locks, focus returns to the trigger on close. The backdrop's
          onClick only fires when the click TARGET is the backdrop itself,
          so a click anywhere on the panel cannot bubble up and dismiss it. */}
      {previewOpen ? (
        // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users already have Escape, wired via useDialogBehavior.
        <div
          role="dialog"
          aria-modal="true"
          aria-label="FAQ preview and validation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewOpen(false)
          }}
          className="fixed inset-0 z-70 overflow-auto bg-ink/60 p-4 sm:p-10"
        >
          <div
            ref={previewModalRef}
            className="relative mx-auto w-full max-w-[720px] rounded-panel bg-cream p-5 shadow-card-raised sm:p-6"
          >
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-line-grey bg-cream text-ink hover:border-ink"
            >
              <X className="size-4.5" aria-hidden="true" />
              <span className="sr-only">Close preview</span>
            </button>

            <h3 className="pr-10 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              Live FAQ preview
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                <SegmentButton
                  active={previewTab === 'google'}
                  onClick={() => setPreviewTab('google')}
                  title="How this used to appear as a Google rich result"
                >
                  Google preview
                </SegmentButton>
                <SegmentButton
                  active={previewTab === 'accordion'}
                  onClick={() => setPreviewTab('accordion')}
                  title="The same details/summary block the HTML output ships"
                >
                  Accordion view
                </SegmentButton>
                <SegmentButton
                  active={previewTab === 'ai'}
                  onClick={() => setPreviewTab('ai')}
                  title="A static mockup — not a live AI response"
                >
                  AI preview
                </SegmentButton>
              </div>

              {previewTab === 'google' ? (
                <GooglePreview rows={previewRows} />
              ) : previewTab === 'accordion' ? (
                <AccordionPreview rows={previewRows} />
              ) : (
                <AiPreviewMock rows={previewRows} />
              )}
            </div>

            <h3 className="mt-6 font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              Validation &amp; scores
            </h3>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Ban}
                label="Google rich results"
                value="Retired"
                sublabel="Dropped FAQ rich results — May 2026"
                tone="yellow"
              />
              <StatCard
                icon={CircleCheck}
                label="Schema.org validation"
                value={schemaValidation.label}
                sublabel={schemaValidation.sublabel}
                tone={schemaValidation.tone}
              />
              <StatCard
                icon={ListChecks}
                label="Required properties"
                value={`${requiredPresentCount}/${propertyChecks.length}`}
                sublabel="@type, mainEntity, Question, Answer"
                tone="blue"
              />
              <div className="flex flex-col items-center justify-center gap-1 rounded-card border border-line-grey bg-cream p-4">
                <ScoreRing value={aiReadinessScore} label="AI readiness" size="sm" />
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <h4 className="font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
                  Properties status
                </h4>
                {/* A flat divided list, not a stack of individually-boxed
                    rows — the same declutter fix applied to Schema Markup
                    Generator's validation checklist earlier in this
                    project. */}
                <ul className="mt-2 divide-y divide-line-grey border-line-grey border-y">
                  {propertyChecks.map((check) => (
                    <li
                      key={check.key}
                      className="flex items-center justify-between gap-3 py-2.5 text-[13px]"
                    >
                      <span className="flex items-center gap-2 font-medium text-ink">
                        {check.present ? (
                          <Check className="size-4 text-green" aria-hidden="true" />
                        ) : (
                          <X className="size-4 text-ink-subtle" aria-hidden="true" />
                        )}
                        {check.label}
                      </span>
                      <span className="text-ink-subtle tabular-nums">{check.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
                    AI suggestions
                  </h4>
                  {result.warnings.length > 3 ? (
                    <button
                      type="button"
                      onClick={() => setShowAllSuggestions((v) => !v)}
                      className="font-medium text-[12px] text-violet-700 underline decoration-1 underline-offset-2"
                    >
                      {showAllSuggestions
                        ? 'Show fewer'
                        : `View all (${result.warnings.length})`}
                    </button>
                  ) : null}
                </div>

                {result.warnings.length === 0 ? (
                  <p className="mt-2 flex items-center gap-2 py-2.5 text-[13px] text-ink-subtle">
                    <Sparkles className="size-4 text-violet-700" aria-hidden="true" />
                    No suggestions — this FAQ looks AI-ready.
                  </p>
                ) : (
                  <ul className="mt-2 divide-y divide-line-grey border-line-grey border-y">
                    {(showAllSuggestions
                      ? result.warnings
                      : result.warnings.slice(0, 3)
                    ).map((warning) => (
                      <li
                        key={warning}
                        className="flex items-start gap-2 py-2.5 text-[13px] text-ink-body leading-5"
                      >
                        <Sparkles
                          className="mt-0.5 size-4 shrink-0 text-violet-700"
                          aria-hidden="true"
                        />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* schema.org, not Google's Rich Results Test: Google deprecated
                FAQ rich results in May 2026 and dropped FAQPage from the
                Rich Results Test in June, so that link now reports nothing
                at all. */}
            <a
              href="https://validator.schema.org/"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-1.5 font-medium text-[13px] text-violet-700 underline decoration-1 underline-offset-2"
            >
              Validate on schema.org
              <ExternalLink className="size-3.5" aria-hidden="true" />
              <span className="sr-only"> — opens in a new tab</span>
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}

/**
 * One builder row. The question stays visible at all times — it is the row's
 * identity while scanning the list — and the answer collapses behind a toggle,
 * so a long list of questions does not force-scroll past every full answer.
 */
function FaqRow({
  row,
  index,
  total,
  collapsed,
  onToggle,
  onQuestionChange,
  onAnswerChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  row: QaRow
  index: number
  total: number
  collapsed: boolean
  onToggle: () => void
  onQuestionChange: (value: string) => void
  onAnswerChange: (value: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}) {
  const question = row.question.trim()
  const answer = row.answer.trim()
  const overLimit = answer.length > ANSWER_SOFT_LIMIT
  // Exactly one side filled in: the row is legal but excluded, and saying so
  // on the row beats leaving the user to spot it in a list.
  const half = (question === '') !== (answer === '')
  const needsAttention = overLimit || half
  const answerRegionId = `faq-a-region-${row.id}`

  return (
    <fieldset className="rounded-card border border-line-grey bg-offwhite p-3">
      {/* Floating the legend opts it out of fieldset's special border
          rendering, so the move/remove controls can share its line. */}
      <legend className="label float-left mb-0 pt-3">Question {index + 1}</legend>
      <div className="flex items-center justify-end gap-1">
        <RowButton
          id={`faq-up-${row.id}`}
          label={`Move question ${index + 1} up`}
          onClick={onMoveUp}
          disabled={index === 0}
        >
          <ChevronUp className="size-4" aria-hidden="true" />
        </RowButton>
        <RowButton
          id={`faq-down-${row.id}`}
          label={`Move question ${index + 1} down`}
          onClick={onMoveDown}
          disabled={index === total - 1}
        >
          <ChevronDown className="size-4" aria-hidden="true" />
        </RowButton>
        <RowButton
          id={`faq-remove-${row.id}`}
          label={`Remove question ${index + 1}`}
          onClick={onRemove}
          disabled={total === 1}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </RowButton>
      </div>

      {/* The legend is this input's visible label; the sr-only one carries
          the row number into a screen reader's field list. */}
      <div className="clear-both pt-2">
        <label className="sr-only" htmlFor={`faq-q-${row.id}`}>
          Question {index + 1}
        </label>
        <input
          id={`faq-q-${row.id}`}
          className="field"
          type="text"
          autoComplete="off"
          placeholder="How long does delivery take?"
          value={row.question}
          onChange={(e) => onQuestionChange(e.target.value)}
        />
      </div>

      <button
        type="button"
        id={`faq-expand-${row.id}`}
        aria-expanded={!collapsed}
        aria-controls={answerRegionId}
        onClick={onToggle}
        className="mt-2.5 flex min-h-9 w-full items-center justify-between gap-2 rounded-sm border border-line-grey bg-cream px-3 text-left font-medium text-[13px] text-ink-muted transition-colors hover:border-ink"
      >
        <span className={needsAttention ? 'font-semibold text-ink' : undefined}>
          {collapsed ? 'Show answer' : 'Hide answer'}
          {needsAttention ? ' — needs attention' : ''}
        </span>
        <ChevronRight
          className={`size-4 shrink-0 transition-transform ${collapsed ? '' : 'rotate-90'}`}
          aria-hidden="true"
        />
      </button>

      {collapsed ? null : (
        <div id={answerRegionId} className="mt-2.5">
          <label
            className="label flex flex-wrap items-baseline justify-between gap-x-3"
            htmlFor={`faq-a-${row.id}`}
          >
            <span>
              Answer
              <span className="sr-only"> to question {index + 1}</span>
            </span>
            <span
              className={
                overLimit
                  ? 'font-bold text-[13px] text-ink tabular-nums'
                  : 'font-normal text-[13px] text-ink-subtle tabular-nums'
              }
            >
              {fmt(answer.length)} / {fmt(ANSWER_SOFT_LIMIT)}
            </span>
          </label>
          <textarea
            id={`faq-a-${row.id}`}
            className="field min-h-20 resize-y leading-6"
            rows={3}
            placeholder="Standard orders ship within 2–4 business days…"
            value={row.answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            aria-describedby={`faq-a-${row.id}-hint`}
          />
          <p
            className={`mt-1.5 text-[13px] leading-5 ${
              overLimit || half ? 'font-medium text-ink' : 'text-ink-subtle'
            }`}
            id={`faq-a-${row.id}-hint`}
          >
            {overLimit
              ? `Over ${fmt(ANSWER_SOFT_LIMIT)} characters — FAQ answers get truncated around there, so trim the tail.`
              : half
                ? question === ''
                  ? 'Not in the schema yet — this row still needs a question.'
                  : 'Not in the schema yet — this row still needs an answer.'
                : 'A blank line starts a new paragraph in the HTML output.'}
          </p>
        </div>
      )}
    </fieldset>
  )
}

type PreviewRow = {
  readonly id: number
  readonly question: string
  readonly answer: string
}

function EmptyPreviewNote() {
  return (
    <p className="rounded-card border border-line-grey bg-cream p-4 text-center text-[13px] text-ink-subtle leading-5">
      Nothing to preview yet. Structured data has to describe text that is on the page.
    </p>
  )
}

/**
 * A mockup of the legacy Google FAQ rich result. Google retired this result
 * type on 7 May 2026, so nothing here is a live rendering — it exists so a
 * visitor can see what the markup used to produce, and the note below says so
 * plainly. The link-blue and snippet-grey are Google's own SERP colours,
 * deliberately not the brand ramp, because this simulates Google's UI rather
 * than being part of ours.
 */
function GooglePreview({ rows }: { rows: readonly PreviewRow[] }) {
  if (rows.length === 0) return <EmptyPreviewNote />
  return (
    // print-paper-ctx: this box mimics Google's own light SERP chrome (see the
    // file docblock above this function) via a mix of literal Google hexes and
    // this app's text-ink-subtle token. The literal hexes are already immune to
    // site theme, but text-ink-subtle is not — without pinning it here, the
    // breadcrumb, chevron and footnote turn pale in site dark mode and nearly
    // vanish against this box's permanently-white background.
    <div className="print-paper-ctx rounded-card border border-line-grey bg-white p-4">
      <p className="text-[12px] text-ink-subtle">yoursite.com › page</p>
      <p className="mt-0.5 font-medium text-[#1a0dab] text-[18px]">
        Frequently asked questions
      </p>
      <div className="mt-2 divide-y divide-line">
        {rows.map((row) => (
          <details key={row.id} className="py-2">
            <summary className="flex cursor-pointer items-center justify-between gap-2 text-[#202124] text-[14px] leading-5">
              {row.question}
              <ChevronDown
                className="size-4 shrink-0 text-ink-subtle"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-1.5 whitespace-pre-line text-[#4d5156] text-[13px] leading-5">
              {row.answer}
            </p>
          </details>
        ))}
      </div>
      <p className="mt-3 border-line border-t pt-2 text-[12px] text-ink-subtle">
        Legacy appearance for reference — Google retired FAQ rich results on 7 May 2026.
      </p>
    </div>
  )
}

/** The same details/summary block the HTML output ships, as its own tab. */
function AccordionPreview({ rows }: { rows: readonly PreviewRow[] }) {
  if (rows.length === 0) return <EmptyPreviewNote />
  return (
    <div className="divide-y divide-line rounded-card border border-line-grey bg-cream px-3">
      {rows.map((row) => (
        // Uncontrolled <details> on purpose: the open state is the browser's,
        // so React never re-collapses a question the reader opened, and
        // stable keys mean reordering carries that state along with the row.
        <details key={row.id} className="py-2">
          <summary className="cursor-pointer font-medium text-[14px] text-ink leading-5">
            {row.question}
          </summary>
          <p className="mt-1.5 whitespace-pre-line text-[13px] text-ink-muted leading-5">
            {row.answer}
          </p>
        </details>
      ))}
    </div>
  )
}

/**
 * A static mockup of how an AI answer engine might read this markup. Clearly
 * labelled as illustrative — it quotes the first real pair rather than
 * fabricated text, but no request leaves the browser and no model is called.
 */
function AiPreviewMock({ rows }: { rows: readonly PreviewRow[] }) {
  const sample = rows[0]
  return (
    <div className="rounded-card border border-line-grey border-dashed bg-tile-lavender p-4">
      <span className="inline-flex items-center gap-1 rounded-pill border border-ink bg-cream px-2 py-0.5 font-semibold text-[11px] text-ink uppercase tracking-[0.06em]">
        <Sparkles className="size-3 text-violet-700" aria-hidden="true" />
        Mockup — illustrative only
      </span>

      <div className="mt-3 rounded-card border border-line-grey bg-cream p-3">
        <p className="font-semibold text-[13px] text-ink">AI answer engine</p>
        {sample ? (
          <p className="mt-1.5 text-[13px] text-ink-body leading-5">
            "Based on this page's FAQ — <strong>{sample.question}</strong> — the page
            explains: {truncate(sample.answer, 140)}"
          </p>
        ) : (
          <p className="mt-1.5 text-[13px] text-ink-subtle leading-5">
            Complete a question and answer to see a sample response here.
          </p>
        )}
      </div>

      <p className="mt-3 text-[12px] text-ink-subtle leading-5">
        Illustrative only — a static preview of how an AI answer engine like ChatGPT or
        Perplexity might read your FAQPage markup, not a live model call.
      </p>
    </div>
  )
}

/**
 * One 44px row control. It carries an `id` because reordering can disable the
 * very button that was just pressed, and the handler then needs a specific
 * element to hand focus to.
 */
function RowButton({
  id,
  label,
  onClick,
  disabled,
  children,
}: {
  id: string
  label: string
  onClick: () => void
  disabled: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-sm border border-line-grey bg-cream text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-grey"
    >
      {children}
    </button>
  )
}
