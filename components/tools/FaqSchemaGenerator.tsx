'use client'

import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
  Trash2,
  TriangleAlert,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  CodePane,
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarAction,
  ToolbarGroup,
  ToolToolbar,
  ToolWorkspace,
} from '@/components/tools/workspace'
import { ANSWER_SOFT_LIMIT, buildFaqSchema } from '@/lib/tools/faq-schema-generator/logic'

/**
 * FAQ schema generator — rebuilt on the shared workspace.
 * Research brief: docs/research/faq-schema-generator.md
 *
 * What changed, and why:
 *   - The rows and the output are now side by side. Previously the format toggle,
 *     the code block, an advisory tile, the warnings and the preview were stacked
 *     in one right-hand column, so the preview — the thing that makes this tool
 *     different from the five competitors — sat below the fold.
 *   - The format toggle moved into the toolbar above both panes, because it
 *     changes the entire right-hand side.
 *   - The output pane is a CodePane (line numbers, JSON colouring) with the live
 *     accordion preview pinned underneath it, so both halves of what you are
 *     about to paste are visible at once. That pairing IS the USP: every
 *     competitor emits the JSON-LD and leaves you to build the visible FAQ, and
 *     structured data is only worth anything when it describes text the page
 *     actually shows.
 *   - Warnings moved to the foot of the rows pane. Every warning names a row
 *     number and the fix is always in a row, so the message belongs next to the
 *     thing you edit rather than next to the thing you copy.
 *
 * Schema construction, unicode escaping of "<", HTML escaping, duplicate
 * detection and every warning stay in logic.ts, which is unchanged and separately
 * tested. This file holds row state, focus management and markup only.
 */

interface QaRow {
  readonly id: number
  readonly question: string
  readonly answer: string
}

type OutputFormat = 'json' | 'html'

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

export function FaqSchemaGenerator() {
  const [rows, setRows] = useState<readonly QaRow[]>(SAMPLE_ROWS)
  const [format, setFormat] = useState<OutputFormat>('json')
  const [focusTarget, setFocusTarget] = useState<string | null>(null)
  const nextId = useRef(FIRST_USER_ID)

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

  function setField(id: number, field: 'question' | 'answer', value: string): void {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function addRow(): void {
    const id = nextId.current
    nextId.current += 1
    setRows([...rows, { id, question: '', answer: '' }])
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
    setFocusTarget(`faq-q-${id}`)
  }

  return (
    <ToolWorkspace
      inputLabel="Questions and answers"
      outputLabel="Generated markup and preview"
      minHeight="min-h-[32rem]"
      toolbar={
        <ToolToolbar
          actions={
            <>
              <ToolbarAction onClick={() => setRows(SAMPLE_ROWS)}>
                Load sample
              </ToolbarAction>
              <ToolbarAction onClick={clearAll} disabled={rows.length === 1 && allBlank}>
                Clear
              </ToolbarAction>
              {/* schema.org, not Google's Rich Results Test: Google deprecated FAQ
                  rich results in May 2026 and dropped FAQPage from the Rich Results
                  Test in June, so that link now reports nothing at all. */}
              <a
                href="https://validator.schema.org/"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-sm border border-line-grey bg-white px-3 font-medium text-[13px] text-ink transition-colors hover:border-ink"
              >
                Validate
                <ExternalLink className="size-3.5" aria-hidden="true" />
                <span className="sr-only">
                  on the schema.org validator — opens in a new tab
                </span>
              </a>
            </>
          }
        >
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
      }
      input={
        <Pane title="Questions & answers">
          <div className="flex flex-col gap-3">
            {rows.map((row, index) => {
              const question = row.question.trim()
              const answer = row.answer.trim()
              const overLimit = answer.length > ANSWER_SOFT_LIMIT
              // Exactly one side filled in: the row is legal but excluded, and
              // saying so on the row beats leaving the user to spot it in a list.
              const half = (question === '') !== (answer === '')

              return (
                <fieldset
                  key={row.id}
                  className="rounded-card border border-line-grey bg-offwhite p-3"
                >
                  {/* Floating the legend opts it out of fieldset's special border
                      rendering, so the move/remove controls can share its line. */}
                  <legend className="label float-left mb-0 pt-3">
                    Question {index + 1}
                  </legend>
                  <div className="flex items-center justify-end gap-1">
                    <RowButton
                      id={`faq-up-${row.id}`}
                      label={`Move question ${index + 1} up`}
                      onClick={() => moveRow(index, -1)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="size-4" aria-hidden="true" />
                    </RowButton>
                    <RowButton
                      id={`faq-down-${row.id}`}
                      label={`Move question ${index + 1} down`}
                      onClick={() => moveRow(index, 1)}
                      disabled={index === rows.length - 1}
                    >
                      <ChevronDown className="size-4" aria-hidden="true" />
                    </RowButton>
                    <RowButton
                      id={`faq-remove-${row.id}`}
                      label={`Remove question ${index + 1}`}
                      onClick={() => removeRow(index)}
                      disabled={rows.length === 1}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </RowButton>
                  </div>

                  {/* The legend is this input's visible label; the sr-only one
                      carries the row number into a screen reader's field list. */}
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
                      onChange={(e) => setField(row.id, 'question', e.target.value)}
                    />
                  </div>

                  <div className="mt-2.5">
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
                      onChange={(e) => setField(row.id, 'answer', e.target.value)}
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
                          : // Just the field-specific behaviour. "Plain prose works
                            // best" was dropped — it restates the meta FAQ's
                            // HTML-in-answers guidance rendered below the tool.
                            'A blank line starts a new paragraph in the HTML output.'}
                    </p>
                  </div>
                </fieldset>
              )
            })}

            <div>
              <button
                type="button"
                id="faq-add"
                onClick={addRow}
                className="btn-brutal btn-brutal-sm btn-white"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add question
              </button>
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
      }
      output={
        <Pane
          title={format === 'json' ? 'JSON-LD' : 'HTML + JSON-LD'}
          padded={false}
          scroll={false}
          actions={output === '' ? null : <CopyButton text={output} />}
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
                  One paste: the visible FAQ block <em>and</em> the script tag. Use this
                  when the page does not already show the answers.
                </>
              )}
            </p>

            <div className="min-h-0 flex-1">
              <CodePane
                value={output}
                language={format === 'json' ? 'json' : 'html'}
                emptyLabel="Fill in a question and its answer on the left. The markup is assembled here as you type, and the preview below shows what a visitor will actually see."
              />
            </div>

            <section className="shrink-0 border-line border-t">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 bg-offwhite px-4 py-2">
                <h4 className="font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
                  Live preview
                </h4>
                <p className="text-[13px] text-ink-subtle">
                  The same <code className="font-mono text-[12px]">details</code> markup
                  the HTML output ships — click to expand
                </p>
              </div>

              {/* Capped so the code pane keeps the larger share of the height:
                  three collapsed questions fit without scrolling, and expanding
                  one scrolls inside the preview rather than pushing the code
                  out of view. */}
              <div className="max-h-[9rem] overflow-auto px-4 py-1">
                {previewRows.length === 0 ? (
                  <p className="py-3 text-[13px] text-ink-subtle leading-5">
                    Nothing to preview yet. Structured data has to describe text that is
                    on the page.
                  </p>
                ) : (
                  <div className="divide-y divide-line">
                    {previewRows.map((row) => (
                      // Uncontrolled <details> on purpose: the open state is the
                      // browser's, so React never re-collapses a question the
                      // reader opened, and stable keys mean reordering carries
                      // that state along with the row.
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
                )}
              </div>
            </section>
          </div>
        </Pane>
      }
      status={
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
      }
    />
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
      className="flex size-11 items-center justify-center rounded-sm border border-line-grey bg-white text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-grey"
    >
      {children}
    </button>
  )
}
