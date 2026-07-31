'use client'

import { useMemo, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  CodePane,
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
  formatBytes,
  formatJson,
  type IndentOption,
  minifyJson,
} from '@/lib/tools/json-formatter/logic'

/**
 * JSON Formatter — reference implementation of the shared workspace.
 * Research brief: docs/research/json-formatter.md
 *
 * What changed, and why (this tool is what motivated the redesign):
 *   - Input and output are now SIDE BY SIDE at full width. Previously the input
 *     was a ~40%-wide box and the result rendered in a separate panel far below
 *     it, so you pasted at the top and scrolled to find the answer.
 *   - Controls moved into one toolbar spanning both panes rather than sitting
 *     between input and output.
 *   - Line numbers, brand-ramp syntax colouring, and parse errors that point at
 *     their exact line — the table-stakes features every top competitor ships
 *     and this tool did not.
 *   - Seeded with real sample JSON, so the first paint demonstrates the tool
 *     instead of showing two panels that both say "Paste JSON to validate".
 *
 * All computation stays in logic.ts (already covered by its own tests); this
 * file holds state and markup only.
 */

const SAMPLE = `{"invoice":"INV-2026-0142","customer":{"name":"Scult","gstin":"29ABCDE1234F1Z5"},
"items":[{"sku":"WEB-AUDIT","qty":1,"amount":45000}],"paid":false}`

export function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE)
  const [indent, setIndent] = useState<IndentOption>(2)
  const [sort, setSort] = useState(false)
  const [minified, setMinified] = useState(false)

  const result = useMemo(
    () => (minified ? minifyJson(input, { sort }) : formatJson(input, { indent, sort })),
    [input, indent, sort, minified],
  )

  const isEmpty = input.trim() === ''
  const hasError = Boolean(result.error)

  return (
    <ToolWorkspace
      inputLabel="Your JSON"
      outputLabel="Formatted JSON"
      minHeight="min-h-[28rem]"
      toolbar={
        <ToolToolbar
          actions={
            <>
              <ToolbarAction onClick={() => setInput(SAMPLE)}>Load sample</ToolbarAction>
              <ToolbarAction onClick={() => setInput('')} disabled={isEmpty}>
                Clear
              </ToolbarAction>
            </>
          }
        >
          <ToolbarGroup label="Indent">
            {([2, 4, 'tab'] as const).map((opt) => (
              <SegmentButton
                key={String(opt)}
                active={!minified && indent === opt}
                onClick={() => {
                  setMinified(false)
                  setIndent(opt)
                }}
              >
                {opt === 'tab' ? 'Tab' : `${opt} spaces`}
              </SegmentButton>
            ))}
          </ToolbarGroup>

          <ToolbarGroup label="Output">
            <SegmentButton active={minified} onClick={() => setMinified(!minified)}>
              Minify
            </SegmentButton>
            <SegmentButton active={sort} onClick={() => setSort(!sort)}>
              Sort keys A–Z
            </SegmentButton>
          </ToolbarGroup>
        </ToolToolbar>
      }
      input={
        <Pane title="Your JSON" padded={false} scroll={false}>
          <label className="sr-only" htmlFor="json-input">
            Paste your JSON
          </label>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            placeholder={'{\n  "paste": "your JSON here"\n}'}
            className="size-full resize-none border-0 bg-white p-4 font-mono text-[13px] text-ink-body leading-[1.65] outline-none placeholder:text-ink-subtle"
          />
        </Pane>
      }
      output={
        <Pane
          title={minified ? 'Minified' : 'Formatted'}
          padded={false}
          actions={result.output ? <CopyButton text={result.output} /> : null}
        >
          {hasError ? (
            <div className="p-4">
              <ErrorDetail
                line={result.errorLine ?? null}
                column={result.errorColumn ?? null}
                message={result.error ?? 'Invalid JSON.'}
                snippet={result.errorSnippet ?? null}
              />
              <p className="mt-4 text-[13px] text-ink-subtle leading-5">
                Strict JSON only — trailing commas, unquoted keys and single quotes are
                all valid JavaScript but invalid JSON.
              </p>
            </div>
          ) : (
            <CodePane
              value={result.output}
              language="json"
              wrap={minified}
              emptyLabel="Paste or type JSON on the left and the formatted result appears here."
            />
          )}
        </Pane>
      }
      status={
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
      }
    />
  )
}
