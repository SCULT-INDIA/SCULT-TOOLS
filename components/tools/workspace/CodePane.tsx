'use client'

import { useMemo } from 'react'
import { tokenizeHtml, tokenizeJson } from '@/lib/tools/shared/tokenize'

/**
 * A line-numbered, syntax-coloured, read-only code surface — plan §3.
 *
 * Purpose-built rather than CodeMirror/Monaco on purpose: the plan's §5 budget
 * is 90KB gzipped per route, and either editor spends most of that on its own.
 * Everything here is a <pre> plus a gutter, so the cost is a few hundred bytes.
 *
 * Colours come from the brand ramp (plan §6) — never an imported theme like
 * Dracula or Monokai. The exact assignments and their measured contrast are in
 * TOKEN_CLASS at the foot of this file; note that brand `green` is excluded
 * there because it fails as a foreground colour.
 *
 * `highlightLine` is what makes a parse error actionable: the error row is
 * tinted and scrolled into view, which is the single feature every serious
 * competitor has and our previous version did not.
 */
export function CodePane({
  value,
  language = 'plain',
  highlightLine,
  emptyLabel = 'Nothing yet.',
  wrap = false,
}: {
  value: string
  language?: 'json' | 'html' | 'plain'
  highlightLine?: number | null
  emptyLabel?: string
  wrap?: boolean
}) {
  const lines = useMemo(() => (value ? value.split('\n') : []), [value])

  if (!value) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="max-w-[34ch] text-[14px] text-ink-subtle leading-6">{emptyLabel}</p>
      </div>
    )
  }

  const gutterWidth = `${String(lines.length).length + 1}ch`

  return (
    // print-paper-ctx: this pane's syntax palette (TOKEN_CLASS below) is a fixed
    // ramp "verified against white" per the docblock, with no dark-mode variant —
    // so the canvas itself must always render as a light document regardless of
    // the site theme, exactly like the escape hatch's other use (the invoice
    // canvas). Without it, --color-ink/-ink-muted/-ink-subtle invert to their
    // near-white dark-theme values while this bg (and bg-peach below) stay fixed
    // light, making most token text and any highlighted line unreadable.
    <div className="h-full overflow-auto bg-white font-mono text-[13px] leading-[1.65] print-paper-ctx">
      <div className="flex min-w-full">
        {/* Gutter. aria-hidden: line numbers are a visual aid, and a screen
            reader announcing "1 2 3 4" before every line is pure noise.
            bg-white, not bg-offwhite: the two are visually identical in light
            mode, but bg-offwhite is a token that inverts to near-black in dark
            mode — since the pane above it is pinned light via print-paper-ctx,
            an inverting gutter would show a dark seam next to a light canvas. */}
        <div
          aria-hidden="true"
          className="sticky left-0 shrink-0 select-none border-line border-r bg-white py-3 text-right text-ink-subtle"
          style={{ width: gutterWidth, paddingInline: '0.5rem' }}
        >
          {lines.map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are positional by definition
              key={i}
              className={highlightLine === i + 1 ? 'bg-peach text-ink' : undefined}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <pre
          className={`flex-1 py-3 pr-4 pl-3 ${wrap ? 'whitespace-pre-wrap break-words' : ''}`}
        >
          {lines.map((line, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are positional by definition
              key={i}
              className={highlightLine === i + 1 ? '-mx-3 bg-peach px-3' : undefined}
            >
              <CodeLine text={line} language={language} />
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}

/**
 * One tokenised line. Tokenising is pure and lives in lib/ so it is tested.
 *
 * An empty line still has to render a space, or the `<div>` collapses to zero
 * height and the code column drifts out of step with the line-number gutter.
 */
function CodeLine({
  text,
  language,
}: {
  text: string
  language: 'json' | 'html' | 'plain'
}) {
  const tokens = useMemo(() => {
    if (language === 'json') return tokenizeJson(text)
    if (language === 'html') return tokenizeHtml(text)
    return null
  }, [text, language])

  if (text.length === 0) return <> </>
  if (tokens === null) return <>{text}</>

  return (
    <>
      {tokens.map((t, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: tokens are positional within a line
          key={i}
          className={TOKEN_CLASS[t.kind]}
        >
          {t.text}
        </span>
      ))}
    </>
  )
}

/**
 * Brand-ramp token colours, all verified against white:
 *   violet-700 #4B20DE   8.20:1
 *   violet-900 #16018E  14.70:1
 *   violet-600 #631AFF   6.73:1
 *   ink-muted  #333333  12.63:1
 *   ink-subtle #6B7280   4.83:1  (punctuation/comments only — never sole meaning)
 *
 * Note the brand `green` (#23CA87) is deliberately NOT used here. It is a light
 * accent designed to carry BLACK text on top of it; as a foreground colour on
 * white it lands near 2:1 and fails badly. Token kinds are distinguished by
 * hue AND weight/style so the pane stays readable in greyscale too.
 *
 * JSON and HTML share this table: an HTML tag reads like a JSON key (both are the
 * structural name), and an attribute value reads like a JSON string (both are the
 * quoted payload), so reusing the ramp keeps the two languages visually coherent
 * rather than inventing a second palette.
 */
const TOKEN_CLASS: Record<string, string> = {
  key: 'text-violet-700 font-semibold',
  string: 'text-ink-muted',
  number: 'text-violet-900 font-semibold',
  boolean: 'text-violet-600 font-semibold',
  null: 'text-ink-subtle italic',
  punct: 'text-ink-subtle',
  plain: 'text-ink-body',
  // HTML
  tag: 'text-violet-700 font-semibold',
  attr: 'text-violet-600',
  comment: 'text-ink-subtle italic',
}
