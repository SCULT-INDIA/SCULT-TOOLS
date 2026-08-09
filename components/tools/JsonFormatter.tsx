'use client'

import { ChevronDown, ChevronRight, X } from 'lucide-react'
import type { ChangeEvent, ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  ErrorDetail,
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarGroup,
  ToolToolbar,
} from '@/components/tools/workspace'
import { trackToolEvent } from '@/lib/analytics'
import {
  type CompareResult,
  compareJson,
  type DiffKind,
  formatBytes,
  formatJson,
  formatJsonPath,
  getAtPath,
  type IndentOption,
  minifyJson,
  type PathSegment,
  previewValue,
  repairJson,
  setAtPath,
  typeOfValue,
} from '@/lib/tools/json-formatter/logic'

/**
 * JSON Formatter — bespoke 4-column workspace, replacing the shared
 * `ToolWorkspace` two-pane grid this tool used before.
 *
 * Research brief: docs/research/json-formatter.md. That brief's one
 * deliberate gap was a tree view — "the most defensible thing to build
 * next... a real gap, not a rejected idea" — which is what this rebuild adds,
 * alongside an inspector and a scoped-down Compare.
 *
 * Why no separate output pane any more: the old layout had input and
 * "formatted/minified result" side by side, because the result was a whole
 * second string. Once the workspace can show *structure* (a tree) and *one
 * node's detail* (the inspector), the editor stops being one half of a
 * before/after pair and becomes the single editing surface — Format/Minify/
 * Repair now rewrite it in place rather than populating a twin.
 *
 * Columns, left to right:
 *   1. Rail    — how to get JSON in (Paste/Upload/From URL/Sample) and what
 *                to do to it (Validate/Format/Minify/Repair/Compare).
 *   2. Editor  — the textarea, with a synced line-number gutter.
 *   3. Tree    — a collapsible view of the parsed structure; also where the
 *                error detail lives, since there is nothing to structure
 *                until the document parses.
 *   4. Inspector — the selected node's key/type/value/path/parent/index,
 *                   an inline editor for leaf values, and copy actions.
 *
 * All computation stays in logic.ts (formatJson/minifyJson/repairJson/
 * compareJson/getAtPath/setAtPath — every one pure and unit-tested); this
 * file holds state, the recursive tree, and markup only.
 */

const SAMPLE = `{"invoice":"INV-2026-0142","customer":{"name":"Scult","gstin":"29ABCDE1234F1Z5"},
"items":[{"sku":"WEB-AUDIT","qty":1,"amount":45000}],"paid":false}`

const JSONPATH_EXAMPLES = [
  '$',
  '$.items[0]',
  '$.items[*].sku',
  '$..amount',
  '$.customer.name',
]

type InputSource = 'paste' | 'upload' | 'url' | 'sample'

const SOURCE_LABEL: Record<InputSource, string> = {
  paste: 'Pasted or typed',
  upload: 'Uploaded file',
  url: 'Fetched from a URL',
  sample: 'Sample data',
}

const DIFF_BADGE: Record<DiffKind, string> = {
  added: 'bg-tile-green text-violet-700',
  removed: 'bg-tile-yellow text-violet-700',
  changed: 'bg-tile-lavender text-violet-700',
}

const COL_MIN_H = 'min-h-[26rem]'

function topLevelExpansion(value: unknown): Set<string> {
  const expanded = new Set<string>(['$'])
  const type = typeOfValue(value)
  if (type === 'object') {
    for (const key of Object.keys(value as Record<string, unknown>)) {
      expanded.add(formatJsonPath([key]))
    }
  } else if (type === 'array') {
    for (let i = 0; i < (value as unknown[]).length; i++) {
      expanded.add(formatJsonPath([i]))
    }
  }
  return expanded
}

function parseOrUndefined(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

function lineColToOffset(text: string, line: number, column: number): number {
  const lines = text.split('\n')
  let offset = 0
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    offset += (lines[i]?.length ?? 0) + 1
  }
  return offset + Math.max(0, column - 1)
}

export function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE)
  const [indent, setIndent] = useState<IndentOption>(2)
  const [sort, setSort] = useState(false)
  const [source, setSource] = useState<InputSource>('sample')

  const [selectedPath, setSelectedPath] = useState<PathSegment[] | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(() =>
    topLevelExpansion(parseOrUndefined(SAMPLE)),
  )

  const [showUrlField, setShowUrlField] = useState(false)
  const [urlDraft, setUrlDraft] = useState('')
  const [urlBusy, setUrlBusy] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)

  const [repairNotice, setRepairNotice] = useState<string | null>(null)

  const [compareOpen, setCompareOpen] = useState(false)
  const [compareText, setCompareText] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  const result = useMemo(() => formatJson(input, { indent, sort }), [input, indent, sort])
  const parsedValue = useMemo(() => parseOrUndefined(input), [input])

  const isEmpty = input.trim() === ''
  const hasError = Boolean(result.error)

  const lineCount = useMemo(() => (input ? input.split('\n').length : 1), [input])
  const gutterWidth = `${String(lineCount).length + 1}ch`

  function syncGutterScroll() {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }
  // Programmatic content changes (Format/Minify/Repair/Upload/Sample) don't
  // fire the textarea's own scroll event, so the gutter needs a nudge here
  // too or it drifts out of sync with a shorter or longer document. Inlined
  // rather than calling `syncGutterScroll` so the effect has no function
  // dependency to track — the two refs it touches are stable for the
  // component's lifetime.
  // biome-ignore lint/correctness/useExhaustiveDependencies: input isn't read in the body, but it's the signal this effect reacts to.
  useEffect(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [input])

  function loadDocument(text: string, src: InputSource) {
    setInput(text)
    setSource(src)
    setSelectedPath(null)
    setExpanded(topLevelExpansion(parseOrUndefined(text)))
    setRepairNotice(null)
  }

  function toggleExpanded(pathKey: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(pathKey)) next.delete(pathKey)
      else next.add(pathKey)
      return next
    })
  }

  function handleFileChosen(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result
      if (typeof text === 'string') {
        loadDocument(text, 'upload')
        setUrlError(null)
      }
    }
    reader.onerror = () => setUrlError('Could not read that file.')
    reader.readAsText(file)
  }

  async function handleFetchUrl() {
    const url = urlDraft.trim()
    if (!url) return
    setUrlBusy(true)
    setUrlError(null)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Server responded ${response.status}`)
      }
      const text = await response.text()
      loadDocument(text, 'url')
      setShowUrlField(false)
    } catch (thrown) {
      setUrlError(
        thrown instanceof Error
          ? `Could not fetch that URL — ${thrown.message}. Many APIs block cross-origin requests from a browser (CORS).`
          : 'Could not fetch that URL.',
      )
    } finally {
      setUrlBusy(false)
    }
  }

  function handleValidate() {
    const el = textareaRef.current
    if (!el) return
    el.focus()
    if (result.error && result.errorLine) {
      const start = lineColToOffset(input, result.errorLine, result.errorColumn ?? 1)
      el.setSelectionRange(start, Math.min(input.length, start + 1))
    } else {
      el.setSelectionRange(0, 0)
    }
  }

  function handleFormat() {
    if (isEmpty || hasError) return
    setInput(formatJson(input, { indent, sort }).output)
    trackToolEvent('json-formatter', 'format_json')
  }

  function handleMinify() {
    if (isEmpty || hasError) return
    setInput(minifyJson(input, { sort }).output)
    trackToolEvent('json-formatter', 'minify_json')
  }

  function handleRepair() {
    if (isEmpty) return
    const repaired = repairJson(input, { indent, sort })
    if (repaired.error) {
      setRepairNotice(repaired.error)
      return
    }
    setInput(repaired.output)
    setRepairNotice(
      repaired.repaired
        ? 'Repaired — fixed comments, quotes or a trailing comma.'
        : 'Already valid JSON — nothing to repair.',
    )
    trackToolEvent('json-formatter', 'repair_json', {
      repaired: repaired.repaired ?? false,
    })
  }

  function commitLeafEdit(path: readonly PathSegment[], nextValue: unknown) {
    const nextRoot = setAtPath(parsedValue, path, nextValue)
    if (nextRoot === parsedValue) return
    setInput(formatJson(JSON.stringify(nextRoot), { indent, sort }).output)
  }

  const compareParsed = useMemo(() => {
    if (compareText.trim() === '')
      return { value: undefined as unknown, error: null as string | null }
    try {
      return { value: JSON.parse(compareText) as unknown, error: null as string | null }
    } catch (thrown) {
      return {
        value: undefined as unknown,
        error: thrown instanceof Error ? thrown.message : 'Invalid JSON.',
      }
    }
  }, [compareText])

  const compareResult: CompareResult | null = useMemo(() => {
    if (hasError || compareParsed.error || compareText.trim() === '') return null
    return compareJson(parsedValue, compareParsed.value)
  }, [parsedValue, compareParsed, hasError, compareText])

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-cream">
      <div className="border-line border-b bg-offwhite">
        <ToolToolbar
          actions={
            <CopyButton
              text={input}
              label="Copy JSON"
              onCopy={() => trackToolEvent('json-formatter', 'copy_json')}
            />
          }
        >
          <ToolbarGroup label="Indent">
            {([2, 4, 'tab'] as const).map((opt) => (
              <SegmentButton
                key={String(opt)}
                active={indent === opt}
                onClick={() => setIndent(opt)}
              >
                {opt === 'tab' ? 'Tab' : `${opt} spaces`}
              </SegmentButton>
            ))}
          </ToolbarGroup>

          <ToolbarGroup label="Output">
            <SegmentButton active={sort} onClick={() => setSort((s) => !s)}>
              Sort keys A–Z
            </SegmentButton>
          </ToolbarGroup>
        </ToolToolbar>
      </div>

      {/* All page-level action buttons, consolidated into one evenly-spaced
          grid directly below the toolbar — Clear and the Input/Tools rail's
          nine ToolbarActions used to be scattered across the toolbar and the
          left rail (see the reference redesigns on FaqSchemaGenerator.tsx and
          SchemaMarkupGenerator.tsx). 10 buttons, so the lg tier is capped at
          6 per that pattern's own rule rather than inventing a wider tier;
          the second row simply carries the remaining 4. Format is the
          "thing you came here to click" (default cta-yellow); Compare is
          the one "reveal a view" action (`btn-violet`); everything else is
          `btn-white`. "Copy JSON" stays with the toolbar above — it is the
          shared `CopyButton` component, which has no brand-class override,
          and neither reference redesign needed to fold a `CopyButton` into
          its grid either. */}
      <div className="grid grid-cols-2 gap-2 border-line border-b bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-6">
        <button
          type="button"
          onClick={() => loadDocument(SAMPLE, 'sample')}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Sample
        </button>
        <button
          type="button"
          onClick={() => {
            setSource('paste')
            setShowUrlField(false)
            textareaRef.current?.focus()
          }}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Paste
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Upload
        </button>
        <button
          type="button"
          onClick={() => setShowUrlField((v) => !v)}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          From URL
        </button>
        <button
          type="button"
          onClick={handleValidate}
          disabled={isEmpty}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Validate
        </button>
        <button
          type="button"
          onClick={handleFormat}
          disabled={isEmpty || hasError}
          className="btn-brutal btn-brutal-sm w-full"
        >
          Format
        </button>
        <button
          type="button"
          onClick={handleMinify}
          disabled={isEmpty || hasError}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Minify
        </button>
        <button
          type="button"
          onClick={handleRepair}
          disabled={isEmpty}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Repair
        </button>
        <button
          type="button"
          onClick={() => setCompareOpen((v) => !v)}
          disabled={isEmpty}
          className="btn-brutal btn-brutal-sm btn-violet w-full"
        >
          Compare
        </button>
        <button
          type="button"
          onClick={() => setInput('')}
          disabled={isEmpty}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Clear
        </button>
      </div>

      {compareOpen ? (
        <div className="border-line border-b bg-offwhite p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              Compare against a second JSON document
            </h3>
            <button
              type="button"
              onClick={() => setCompareOpen(false)}
              aria-label="Close compare"
              className="rounded-sm p-1 text-ink-subtle hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <label className="sr-only" htmlFor="json-compare-input">
                Second JSON document
              </label>
              <textarea
                id="json-compare-input"
                value={compareText}
                onChange={(e) => setCompareText(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                placeholder="Paste a second JSON document to diff against the editor…"
                className="h-40 w-full resize-none rounded-sm border border-line-grey bg-cream p-3 font-mono text-[13px] leading-[1.6] outline-none focus:border-ink"
              />
              {compareParsed.error ? (
                <p className="mt-1 text-[12px] text-ink">
                  Invalid JSON: {compareParsed.error}
                </p>
              ) : null}
            </div>
            <div className="h-40 overflow-auto rounded-sm border border-line-grey bg-cream p-3">
              {compareText.trim() === '' ? (
                <p className="text-[13px] text-ink-subtle">
                  Paste JSON on the left to see what differs from the editor.
                </p>
              ) : hasError ? (
                <p className="text-[13px] text-ink-subtle">
                  Fix the error in the editor first.
                </p>
              ) : compareResult?.identical ? (
                <p className="text-[13px] text-ink-muted">
                  Identical — no differences found.
                </p>
              ) : compareResult ? (
                <>
                  <p className="mb-2 text-[12px] text-ink-subtle">
                    {compareResult.entries.length} difference
                    {compareResult.entries.length === 1 ? '' : 's'}
                    {compareResult.truncated ? ' (showing the first 500)' : ''}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {compareResult.entries.map((entry) => (
                      <li
                        key={entry.path}
                        className="flex flex-wrap items-baseline gap-1.5 text-[12px]"
                      >
                        <span
                          className={`rounded-pill px-1.5 py-0.5 font-medium text-[10px] uppercase ${DIFF_BADGE[entry.kind]}`}
                        >
                          {entry.kind}
                        </span>
                        <code className="font-mono text-ink-body">{entry.path}</code>
                        {entry.left !== undefined ? (
                          <span className="text-ink-subtle">was {entry.left}</span>
                        ) : null}
                        {entry.right !== undefined ? (
                          <span className="text-ink-subtle">
                            {entry.kind === 'changed' ? 'now' : 'is'} {entry.right}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid lg:grid-cols-[168px_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <section
          aria-label="Input source and tools"
          className="flex flex-col gap-5 border-line border-b bg-offwhite p-3 lg:border-b-0 lg:border-r"
        >
          <div>
            <p className="mb-2 font-bold text-[11px] text-ink-subtle uppercase tracking-[0.08em]">
              Input
            </p>

            {showUrlField ? (
              <div className="mt-2 flex flex-col gap-1.5">
                <label className="sr-only" htmlFor="json-url">
                  JSON URL
                </label>
                <input
                  id="json-url"
                  type="url"
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleFetchUrl()
                    }
                  }}
                  placeholder="https://…/data.json"
                  className="min-h-9 rounded-sm border border-line-grey bg-cream px-2 font-mono text-[12px] text-ink outline-none focus:border-ink"
                />
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={handleFetchUrl}
                    disabled={urlBusy || urlDraft.trim() === ''}
                    className="min-h-9 flex-1 rounded-sm border border-line-grey bg-cream px-2 font-medium text-[12px] text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {urlBusy ? 'Fetching…' : 'Fetch'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUrlField(false)
                      setUrlError(null)
                    }}
                    aria-label="Cancel"
                    className="min-h-9 rounded-sm border border-line-grey bg-cream px-2 text-ink-subtle hover:border-ink"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
                {urlError ? (
                  <p className="text-[11px] text-ink leading-4">{urlError}</p>
                ) : null}
              </div>
            ) : null}

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json,text/plain"
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={handleFileChosen}
            />

            <p className="mt-2 text-[11px] text-ink-subtle">
              Source: {SOURCE_LABEL[source]}
            </p>
          </div>

          {repairNotice ? (
            <p className="text-[11px] text-ink leading-4">
              {repairNotice}{' '}
              <button
                type="button"
                onClick={() => setRepairNotice(null)}
                className="underline underline-offset-2"
              >
                Dismiss
              </button>
            </p>
          ) : null}
        </section>

        <section
          aria-label="JSON editor"
          className={`flex flex-col ${COL_MIN_H} border-line border-b lg:border-b-0 lg:border-r`}
        >
          <Pane title="JSON editor" padded={false} scroll={false}>
            <div className="flex size-full">
              <div
                ref={gutterRef}
                aria-hidden="true"
                className="select-none overflow-hidden border-line border-r bg-offwhite py-3 text-right font-mono text-[13px] text-ink-subtle leading-[1.65]"
                style={{ width: gutterWidth }}
              >
                {Array.from({ length: lineCount }, (_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are positional by definition
                    key={i}
                    style={{ paddingInline: '0.5rem' }}
                    className={
                      result.errorLine === i + 1 ? 'bg-peach text-ink' : undefined
                    }
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <label className="sr-only" htmlFor="json-input">
                Paste your JSON
              </label>
              <textarea
                id="json-input"
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setSource('paste')
                  setRepairNotice(null)
                }}
                onScroll={syncGutterScroll}
                spellCheck={false}
                autoComplete="off"
                placeholder={'{\n  "paste": "your JSON here"\n}'}
                className="flex-1 resize-none border-0 bg-cream p-3 font-mono text-[13px] text-ink-body leading-[1.65] outline-none placeholder:text-ink-subtle"
              />
            </div>
          </Pane>
        </section>

        <section
          aria-label="Structure"
          className={`flex flex-col ${COL_MIN_H} border-line border-b lg:border-b-0 lg:border-r`}
        >
          <Pane
            title="Structure (tree view)"
            padded={false}
            actions={
              !hasError && !isEmpty && result.stats ? (
                <span className="text-[11px] text-ink-subtle">
                  {result.stats.keys} keys
                </span>
              ) : null
            }
          >
            {isEmpty ? (
              <p className="p-3 text-[13px] text-ink-subtle leading-5">
                Paste, upload or fetch JSON to see its structure here.
              </p>
            ) : hasError ? (
              <div className="p-3">
                <ErrorDetail
                  line={result.errorLine ?? null}
                  column={result.errorColumn ?? null}
                  message={result.error ?? 'Invalid JSON.'}
                  snippet={result.errorSnippet ?? null}
                />
                <p className="mt-4 text-[13px] text-ink-subtle leading-5">
                  Strict JSON only — trailing commas, unquoted keys and single quotes are
                  all valid JavaScript but invalid JSON. The Repair tool on the left can
                  often fix these automatically.
                </p>
              </div>
            ) : (
              <div role="tree" aria-label="JSON structure" className="px-1 pb-2">
                <TreeNode
                  keyLabel={null}
                  value={parsedValue}
                  path={[]}
                  depth={0}
                  expanded={expanded}
                  onToggle={toggleExpanded}
                  selectedKey={selectedPath ? formatJsonPath(selectedPath) : null}
                  onSelect={setSelectedPath}
                />
              </div>
            )}
          </Pane>
        </section>

        <section
          aria-label="Inspector"
          className={`flex flex-col ${COL_MIN_H} border-line border-b lg:border-b-0`}
        >
          <Pane title="Inspector">
            <Inspector
              selectedPath={selectedPath}
              parsedValue={parsedValue}
              onCommit={commitLeafEdit}
            />
          </Pane>
        </section>
      </div>

      <div className="border-line border-t bg-offwhite">
        <StatusBar
          state={isEmpty ? 'neutral' : hasError ? 'invalid' : 'valid'}
          message={
            isEmpty ? 'Waiting for input' : hasError ? 'Invalid JSON' : 'Valid JSON'
          }
          stats={
            result.stats
              ? [
                  { label: 'keys', value: String(result.stats.keys) },
                  { label: 'depth', value: String(result.stats.depth) },
                  { label: 'size', value: formatBytes(result.stats.bytes) },
                ]
              : undefined
          }
          privacyNote="Parsed in your browser — nothing is uploaded"
        />
      </div>
    </div>
  )
}

/**
 * One row of the tree, recursing into its own children when it is a
 * container and expanded. Kept local to this file — no other tool renders a
 * JSON structure, so there is no shared primitive for it to extend.
 */
function TreeNode({
  keyLabel,
  value,
  path,
  depth,
  expanded,
  onToggle,
  selectedKey,
  onSelect,
}: {
  keyLabel: PathSegment | null
  value: unknown
  path: readonly PathSegment[]
  depth: number
  expanded: Set<string>
  onToggle: (pathKey: string) => void
  selectedKey: string | null
  onSelect: (path: PathSegment[]) => void
}) {
  const type = typeOfValue(value)
  const isContainer = type === 'object' || type === 'array'
  const pathKey = formatJsonPath(path)
  const isExpanded = expanded.has(pathKey)
  const isSelected = selectedKey === pathKey

  const entries: Array<[PathSegment, unknown]> =
    type === 'object'
      ? Object.entries(value as Record<string, unknown>)
      : type === 'array'
        ? (value as unknown[]).map((v, i): [PathSegment, unknown] => [i, v])
        : []

  return (
    <div>
      <div
        role="treeitem"
        aria-level={depth + 1}
        aria-expanded={isContainer ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={0}
        onClick={() => onSelect([...path])}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect([...path])
          } else if (e.key === 'ArrowRight' && isContainer && !isExpanded) {
            onToggle(pathKey)
          } else if (e.key === 'ArrowLeft' && isContainer && isExpanded) {
            onToggle(pathKey)
          }
        }}
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
        className={`flex cursor-pointer items-center gap-1.5 rounded-sm py-1 pr-2 text-[13px] ${
          isSelected
            ? 'bg-violet-50 font-medium text-violet-700'
            : 'text-ink-body hover:bg-offwhite'
        }`}
      >
        {isContainer ? (
          <button
            type="button"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(pathKey)
            }}
            className="flex size-4 shrink-0 items-center justify-center text-ink-subtle"
          >
            {isExpanded ? (
              <ChevronDown className="size-3.5" aria-hidden="true" />
            ) : (
              <ChevronRight className="size-3.5" aria-hidden="true" />
            )}
          </button>
        ) : (
          <span className="size-4 shrink-0" aria-hidden="true" />
        )}
        {/* Selected: the row's own bg-violet-50 fill already makes this pairing
            dark-mode-safe (globals.css's descendant-selector fix). Unselected:
            this key label sits directly on the Structure panel's ambient
            bg-cream with no fill in between, which that fix explicitly does
            not cover — text-violet-700 there measures ~2.27:1 in dark mode.
            --color-violet-accent-text is this codebase's existing "standalone
            accent text on an ambient surface" token (already used by .eyebrow
            and the nav-link hover state); it is dark-mode-only, so the
            fallback keeps light mode's violet-700 unchanged. */}
        <span
          className={`truncate font-mono ${
            isSelected
              ? 'text-violet-700'
              : 'text-[var(--color-violet-accent-text,var(--color-violet-700))]'
          }`}
        >
          {keyLabel === null
            ? '$'
            : typeof keyLabel === 'number'
              ? `[${keyLabel}]`
              : keyLabel}
        </span>
        {!isContainer ? (
          <span className="truncate font-mono text-ink-subtle">
            : {previewValue(value)}
          </span>
        ) : (
          <span className="text-ink-subtle">{previewValue(value)}</span>
        )}
      </div>

      {isContainer && isExpanded ? (
        // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA tree pattern's "group of treeitems" — not a form fieldset.
        <div role="group">
          {entries.map(([childKey, childValue]) => (
            <TreeNode
              key={String(childKey)}
              keyLabel={childKey}
              value={childValue}
              path={[...path, childKey]}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              selectedKey={selectedKey}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function InspectorRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.08em]">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  )
}

/**
 * The right-hand column. A separate component (rather than inline JSX in
 * `JsonFormatter`) purely so the "nothing selected" / "node vanished" / real
 * content branches read as one small component instead of a nested ternary.
 */
function Inspector({
  selectedPath,
  parsedValue,
  onCommit,
}: {
  selectedPath: PathSegment[] | null
  parsedValue: unknown
  onCommit: (path: readonly PathSegment[], nextValue: unknown) => void
}) {
  if (selectedPath === null) {
    return (
      <p className="text-[13px] text-ink-subtle leading-5">
        Click a node in the tree to inspect its key, type, value and path.
      </p>
    )
  }

  const value = getAtPath(parsedValue, selectedPath)
  const exists =
    selectedPath.length === 0 ? parsedValue !== undefined : value !== undefined
  if (!exists) {
    return (
      <p className="text-[13px] text-ink-subtle leading-5">
        That node no longer exists in the current document — pick another in the tree.
      </p>
    )
  }

  const key = selectedPath.length > 0 ? selectedPath[selectedPath.length - 1] : null
  const parentPath = selectedPath.slice(0, -1)
  const type = typeOfValue(value)
  const isLeaf = type !== 'object' && type !== 'array'
  const editable = isLeaf && selectedPath.length > 0
  const pathStr = formatJsonPath(selectedPath)

  return (
    <dl className="flex flex-col gap-4 text-[13px]">
      <InspectorRow label="Key">
        {key === null ? (
          <span className="text-ink-subtle">— (root)</span>
        ) : (
          <code className="font-mono">{String(key)}</code>
        )}
      </InspectorRow>

      <InspectorRow label="Type">
        <span className="rounded-pill bg-tile-lavender px-2 py-0.5 font-medium text-[12px] text-violet-700">
          {type}
        </span>
      </InspectorRow>

      <InspectorRow label="Value">
        {editable ? (
          <LeafEditor value={value} onCommit={(next) => onCommit(selectedPath, next)} />
        ) : (
          <code className="block break-all font-mono text-ink-body">
            {previewValue(value, 400)}
          </code>
        )}
      </InspectorRow>

      <InspectorRow label="Path">
        <code className="block break-all font-mono text-[12px] text-ink-body">
          {pathStr}
        </code>
      </InspectorRow>

      <InspectorRow label="Parent">
        {selectedPath.length === 0 ? (
          <span className="text-ink-subtle">—</span>
        ) : (
          <code className="font-mono text-[12px]">{formatJsonPath(parentPath)}</code>
        )}
      </InspectorRow>

      <InspectorRow label="Index">
        {typeof key === 'number' ? (
          <code className="font-mono">{key}</code>
        ) : (
          <span className="text-ink-subtle">—</span>
        )}
      </InspectorRow>

      <InspectorRow label="Editable">
        <span
          className={`rounded-pill px-2 py-0.5 font-medium text-[12px] ${
            editable ? 'bg-tile-green text-violet-700' : 'bg-tile-yellow text-violet-700'
          }`}
        >
          {editable
            ? 'Yes'
            : selectedPath.length === 0
              ? 'No — edit the whole document in the editor'
              : 'No — expand it in the tree'}
        </span>
      </InspectorRow>

      <div className="flex flex-wrap gap-2 border-line border-t pt-3">
        <CopyButton text={JSON.stringify(value)} label="Copy value" />
        <CopyButton text={pathStr} label="Copy path" />
      </div>

      <div>
        <p className="mb-1.5 font-bold text-[11px] text-ink-subtle uppercase tracking-[0.08em]">
          Examples
        </p>
        <div className="flex flex-wrap gap-1.5">
          {JSONPATH_EXAMPLES.map((example) => (
            <CopyButton key={example} text={example} label={example} />
          ))}
        </div>
      </div>
    </dl>
  )
}

/**
 * Inline edit for one leaf value. Text rather than type-specific inputs
 * (a number spinner, a boolean switch) because the draft is literal JSON —
 * `"x"` for a string, `42` for a number — so one parser handles every type
 * and a currently-string value can be retyped as a number without a
 * separate "change type" control.
 */
function LeafEditor({
  value,
  onCommit,
}: {
  value: unknown
  onCommit: (next: unknown) => void
}) {
  const [draft, setDraft] = useState(() => JSON.stringify(value))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(JSON.stringify(value))
    setError(null)
  }, [value])

  function commit() {
    let parsed: unknown
    try {
      parsed = JSON.parse(draft)
    } catch {
      setError('Not valid JSON.')
      return
    }
    if (parsed !== null && typeof parsed === 'object') {
      setError('Edit objects and arrays in the editor, not here.')
      return
    }
    setError(null)
    onCommit(parsed)
  }

  return (
    <div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
        }}
        aria-label="Edit value"
        aria-invalid={error !== null}
        className={`w-full rounded-sm border bg-cream px-2 py-1.5 font-mono text-[13px] outline-none ${
          error ? 'border-ink' : 'border-line-grey focus:border-ink'
        }`}
      />
      {error ? <p className="mt-1 text-[11px] text-ink">{error}</p> : null}
    </div>
  )
}
