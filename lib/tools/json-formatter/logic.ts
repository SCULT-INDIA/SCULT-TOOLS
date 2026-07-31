/**
 * JSON formatting, minification and validation.
 *
 * Purpose
 *   Pretty-print or minify JSON, and when it will not parse, say exactly WHERE.
 *   Native `JSON.parse` reports a character offset ("position 1043"), which is
 *   useless to a human staring at a 200-line file. The work here is converting
 *   that offset into a line, a column and the offending line of source.
 *
 * Inputs   the raw text a user pasted (any string, including half-typed), plus
 *          an indent width and an optional key-sort flag.
 * Outputs  a JsonResult: `output` is always a string (empty when there is
 *          nothing to show), with `error`/`errorLine`/`errorColumn`/
 *          `errorSnippet` on failure and `stats` on success.
 * Failure  never throws. Empty input is not an error — it is the starting
 *          state of the textarea, and the caller re-renders on every keystroke,
 *          so invalid input is the normal case rather than an exception.
 *
 * No React, no DOM, no I/O — pure functions, unit-tested in logic.test.ts.
 */

export type IndentOption = 2 | 4 | 'tab'

export interface FormatOptions {
  readonly indent?: IndentOption
  /** Recursively sort object keys. Array order is never touched. */
  readonly sort?: boolean
}

export interface MinifyOptions {
  readonly sort?: boolean
}

export interface JsonStats {
  /** Total object members in the whole document, nested ones included. */
  readonly keys: number
  /** Nesting levels of arrays/objects. A top-level scalar is 0, `{}` is 1. */
  readonly depth: number
  /** UTF-8 byte length of `output`, which is what the user will copy. */
  readonly bytes: number
}

export interface JsonResult {
  readonly output: string
  readonly error?: string
  /** 1-based. */
  readonly errorLine?: number
  /** 1-based, counted in UTF-16 code units, matching the engine's own count. */
  readonly errorColumn?: number
  /** The source line the error sits on, windowed if it is very long. */
  readonly errorSnippet?: string
  readonly stats?: JsonStats
}

/** Past this, formatting in the main thread would visibly hang the tab. */
const MAX_INPUT_CHARS = 2_000_000

/**
 * Rebuilding a sorted copy recurses, so nesting is bounded first. Real payloads
 * are single digits deep; 500 is far past anything legitimate and far short of
 * the call-stack limit.
 */
const MAX_DEPTH = 500

/** A whole minified document can be one line — do not hand back megabytes. */
const SNIPPET_MAX_CHARS = 160

const encoder = new TextEncoder()

export function formatJson(input: string, options: FormatOptions = {}): JsonResult {
  const indent = options.indent ?? 2
  return build(input, indent === 'tab' ? '\t' : indent, options.sort === true)
}

/**
 * Minification is the same pipeline with no indent, so a document that formats
 * cleanly always minifies cleanly and both paths report errors identically.
 */
export function minifyJson(input: string, options: MinifyOptions = {}): JsonResult {
  return build(input, '', options.sort === true)
}

function build(input: string, indent: string | number, sort: boolean): JsonResult {
  if (input.trim() === '') {
    return { output: '' }
  }
  if (input.length > MAX_INPUT_CHARS) {
    return {
      output: '',
      error: 'Input is too large to format here (over 2 million characters).',
    }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (thrown) {
    return describeFailure(input, thrown)
  }

  const shape = describeShape(parsed)
  if (shape.depth > MAX_DEPTH) {
    return {
      output: '',
      error: `Nesting deeper than ${MAX_DEPTH} levels is not supported.`,
    }
  }

  let output: string
  try {
    // `JSON.stringify` returns undefined only for undefined input, which
    // `JSON.parse` cannot produce — the fallback is belt-and-braces for the type.
    output = JSON.stringify(sort ? sortKeys(parsed) : parsed, null, indent) ?? ''
  } catch (thrown) {
    return {
      output: '',
      error:
        thrown instanceof Error
          ? tidyMessage(thrown.message)
          : 'Could not format this JSON.',
    }
  }

  return {
    output,
    stats: { keys: shape.keys, depth: shape.depth, bytes: encoder.encode(output).length },
  }
}

interface Located {
  readonly line: number
  readonly column: number
  readonly snippet: string
}

function describeFailure(input: string, thrown: unknown): JsonResult {
  const raw = thrown instanceof Error ? thrown.message : 'Invalid JSON.'
  const error = tidyMessage(raw)
  const located = locate(input, raw)
  if (located === undefined) {
    return { output: '', error }
  }
  return {
    output: '',
    error,
    errorLine: located.line,
    errorColumn: located.column,
    errorSnippet: located.snippet,
  }
}

/**
 * Engines disagree on how they report a syntax error, so read whichever form is
 * present:
 *   V8       `... in JSON at position 12 (line 3 column 1)`
 *   Firefox  `JSON.parse: unexpected character at line 3 column 1 of the JSON data`
 *   Safari   `JSON Parse error: Unexpected identifier` — no location at all
 * The character offset is preferred where both appear: it is unambiguous, and
 * deriving line/column from it ourselves keeps one code path for the snippet.
 */
function locate(input: string, message: string): Located | undefined {
  const byPosition = /position (\d+)/i.exec(message)
  const offsetText = byPosition?.[1]
  if (offsetText !== undefined) {
    const offset = Number.parseInt(offsetText, 10)
    if (Number.isFinite(offset)) {
      return atOffset(input, offset)
    }
  }

  const byLine = /line (\d+) column (\d+)/i.exec(message)
  const lineText = byLine?.[1]
  const columnText = byLine?.[2]
  if (lineText !== undefined && columnText !== undefined) {
    const line = Number.parseInt(lineText, 10)
    const column = Number.parseInt(columnText, 10)
    if (Number.isFinite(line) && Number.isFinite(column)) {
      return atLineColumn(input, line, column)
    }
  }

  // "Unexpected end of JSON input" carries no location, but the location is
  // knowable: the input ran out, so the problem is at the end of it.
  if (/unexpected end of (?:json )?(?:input|data)/i.test(message)) {
    return atOffset(input, input.length)
  }
  return undefined
}

function atOffset(text: string, offset: number): Located {
  const clamped = Math.max(0, Math.min(offset, text.length))
  let line = 1
  let lineStart = 0
  for (let i = 0; i < clamped; i++) {
    if (text.charCodeAt(i) === 10) {
      line += 1
      lineStart = i + 1
    }
  }
  return {
    line,
    column: clamped - lineStart + 1,
    snippet: snippetFrom(text, lineStart, clamped - lineStart + 1),
  }
}

/** Trust an engine-supplied line/column rather than re-deriving a rival count. */
function atLineColumn(text: string, line: number, column: number): Located {
  let lineStart = 0
  for (let remaining = line - 1; remaining > 0; remaining--) {
    const next = text.indexOf('\n', lineStart)
    if (next === -1) break
    lineStart = next + 1
  }
  return { line, column, snippet: snippetFrom(text, lineStart, column) }
}

function snippetFrom(text: string, lineStart: number, column: number): string {
  let lineEnd = text.indexOf('\n', lineStart)
  if (lineEnd === -1) {
    lineEnd = text.length
  }
  // CRLF files leave a stray \r at the end of every line; it would render as a
  // phantom character in the snippet.
  const line = text.slice(lineStart, lineEnd).replace(/\r$/, '')
  if (line.length <= SNIPPET_MAX_CHARS) {
    return line
  }
  // Long line: window it around the column so the interesting part survives.
  const half = Math.floor(SNIPPET_MAX_CHARS / 2)
  const start = Math.max(0, column - 1 - half)
  const end = Math.min(line.length, start + SNIPPET_MAX_CHARS)
  return `${start > 0 ? '…' : ''}${line.slice(start, end)}${end < line.length ? '…' : ''}`
}

/**
 * The offset and the parenthesised line/column are stripped because the caller
 * renders those itself, and repeating them turns a short message into noise.
 */
function tidyMessage(message: string): string {
  const cleaned = message
    .replace(/^JSON\.parse:\s*/i, '')
    .replace(/^JSON Parse error:\s*/i, '')
    .replace(/\s*in JSON at position \d+(?:\s*\(line \d+ column \d+\))?/i, '')
    .replace(/\s*at line \d+ column \d+ of the JSON data/i, '')
    .replace(/\s*$/, '')
    .replace(/\.$/, '')
  if (cleaned === '') {
    return 'Invalid JSON.'
  }
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}.`
}

/**
 * Walked with an explicit stack rather than recursion: the depth guard exists to
 * protect the recursive sort, so the check that feeds it must itself survive a
 * pathologically nested document.
 */
function describeShape(root: unknown): { keys: number; depth: number } {
  let keys = 0
  let depth = 0
  const stack: Array<{ value: unknown; level: number }> = [{ value: root, level: 0 }]

  while (stack.length > 0) {
    const frame = stack.pop()
    if (frame === undefined) break
    const level = frame.level + 1
    const current = frame.value

    if (Array.isArray(current)) {
      if (level > depth) depth = level
      for (const item of current) {
        stack.push({ value: item, level })
      }
    } else if (isPlainRecord(current)) {
      if (level > depth) depth = level
      for (const key of Object.keys(current)) {
        keys += 1
        stack.push({ value: current[key], level })
      }
    }
  }

  return { keys, depth }
}

function isPlainRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input)
}

/**
 * Compared by UTF-16 code unit, not `localeCompare`: locale collation depends on
 * the visitor's environment, so the same document would sort differently for
 * different users. Code-unit order is the same everywhere and idempotent.
 *
 * One caveat no rebuild can fix: JavaScript objects always enumerate
 * integer-like keys ("2" before "10") numerically and first, so a document keyed
 * entirely by numeric strings is reordered by `JSON.parse` before we see it.
 */
function compareKeys(a: string, b: string): number {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

function sortKeys(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map((item) => sortKeys(item))
  }
  if (isPlainRecord(input)) {
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(input).sort(compareKeys)) {
      sorted[key] = sortKeys(input[key])
    }
    return sorted
  }
  return input
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 2 : 1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}
