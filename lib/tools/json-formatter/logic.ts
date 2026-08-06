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
  /** Only set by {@link repairJson} — true when the input needed fixing up. */
  readonly repaired?: boolean
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

/**
 * Tree, path and comparison helpers.
 *
 * Added for the redesign's tree view / inspector / Compare tool: the previous
 * file only ever turned a whole document into a whole string. Exploring one
 * node, naming its location, and diffing two documents all need to walk the
 * parsed value directly rather than through `JSON.stringify`.
 */

/** A single step down into a parsed value: an object key or an array index. */
export type PathSegment = string | number

export type JsonValueType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'

export function typeOfValue(value: unknown): JsonValueType {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'object'
}

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/

/**
 * Renders a path the way a developer would paste it into `jq`/JS — array
 * indices in brackets, `.`-joined identifier keys, bracket-and-quote for keys
 * that are not valid identifiers (spaces, hyphens, leading digits).
 */
export function formatJsonPath(path: readonly PathSegment[]): string {
  let out = '$'
  for (const segment of path) {
    if (typeof segment === 'number') {
      out += `[${segment}]`
    } else if (IDENTIFIER.test(segment)) {
      out += `.${segment}`
    } else {
      out += `[${JSON.stringify(segment)}]`
    }
  }
  return out
}

/**
 * A short, single-line stand-in for a value — what the tree view shows beside
 * a key, and what the inspector shows for a container that has no one scalar
 * to display. Containers describe their size rather than their contents,
 * since printing a nested object inline defeats the point of a tree view.
 */
export function previewValue(value: unknown, maxChars = 48): string {
  const type = typeOfValue(value)
  if (type === 'object') {
    const count = Object.keys(value as Record<string, unknown>).length
    return count === 0 ? '{}' : `{${count} ${count === 1 ? 'key' : 'keys'}}`
  }
  if (type === 'array') {
    const count = (value as unknown[]).length
    return count === 0 ? '[]' : `[${count} ${count === 1 ? 'item' : 'items'}]`
  }
  if (type === 'string') {
    const quoted = JSON.stringify(value)
    return quoted.length > maxChars ? `${quoted.slice(0, maxChars - 2)}…"` : quoted
  }
  // number, boolean, null all stringify to their literal JSON form.
  return JSON.stringify(value) ?? 'null'
}

const MISSING: unique symbol = Symbol('missing')

/**
 * Reads the value at `path` inside `root`, or `undefined` if the path does
 * not exist. `undefined` is unambiguous here — every value under a parsed
 * JSON document is `object | unknown[] | string | number | boolean | null`,
 * never `undefined` itself.
 */
export function getAtPath(root: unknown, path: readonly PathSegment[]): unknown {
  let current: unknown = root
  for (const segment of path) {
    if (typeof segment === 'number') {
      if (!Array.isArray(current)) return undefined
      current = current[segment]
    } else {
      if (typeof current !== 'object' || current === null || Array.isArray(current)) {
        return undefined
      }
      current = (current as Record<string, unknown>)[segment]
    }
  }
  return current
}

/**
 * Returns a new tree with the value at `path` replaced — used by the
 * inspector's inline leaf editor. Copies only the nodes along the path, so
 * every sibling subtree is shared with the original rather than deep-cloned.
 * Any path that does not resolve inside `root`'s actual shape is a no-op:
 * the inspector can only ever pass a path it read from this same tree.
 */
export function setAtPath(
  root: unknown,
  path: readonly PathSegment[],
  value: unknown,
): unknown {
  if (path.length === 0) return value
  const [head, ...rest] = path
  // Unreachable — `path.length === 0` already returned — but
  // `noUncheckedIndexedAccess` can't see that from a destructure alone.
  if (head === undefined) return root
  if (typeof head === 'number') {
    if (!Array.isArray(root) || head < 0 || head >= root.length) return root
    const updated = setAtPath(root[head], rest, value)
    // Propagate "nothing changed" up rather than only checking at the exact
    // level a path fails to resolve — otherwise every ancestor still gets a
    // needless fresh copy, and a no-op edit is no longer referentially a no-op.
    if (updated === root[head]) return root
    const copy = root.slice()
    copy[head] = updated
    return copy
  }
  if (typeof root !== 'object' || root === null || Array.isArray(root)) return root
  const record = root as Record<string, unknown>
  if (!(head in record)) return root
  const updated = setAtPath(record[head], rest, value)
  if (updated === record[head]) return root
  const copy: Record<string, unknown> = { ...record }
  copy[head] = updated
  return copy
}

/**
 * Best-effort recovery for the handful of "that's valid JavaScript, not valid
 * JSON" mistakes users actually make: `//` and `/* *\/` comments, single-quoted
 * strings, unquoted object keys, and trailing commas. Deliberately narrow —
 * this is a repair tool, not a JS-object-literal parser, and guessing at
 * anything stranger (missing commas, unbalanced brackets) would silently
 * produce a *different* document rather than the one the user meant.
 *
 * Runs the same `build` pipeline as {@link formatJson} once the text parses,
 * so a repaired document reports stats and formats identically to one that
 * never needed repair.
 */
export function repairJson(input: string, options: FormatOptions = {}): JsonResult {
  if (input.trim() === '') {
    return { output: '' }
  }

  const directly = build(input, indentOf(options), options.sort === true)
  if (directly.error === undefined) {
    return { ...directly, repaired: false }
  }

  const sanitized = sanitizeLikelyJson(input)
  const repaired = build(sanitized, indentOf(options), options.sort === true)
  if (repaired.error === undefined) {
    return { ...repaired, repaired: true }
  }

  return {
    ...repaired,
    error: `Could not automatically repair this JSON. ${repaired.error ?? ''}`.trim(),
    repaired: true,
  }
}

function indentOf(options: FormatOptions): IndentOption {
  return options.indent ?? 2
}

/**
 * Normalises comments and quoting *outside string literals only*, then fixes
 * up unquoted keys and trailing commas on the non-string segments of the
 * result. Splitting the string-aware pass from the regex pass keeps each one
 * simple: the first never has to reason about object/array structure, the
 * second never has to reason about escapes.
 */
function sanitizeLikelyJson(input: string): string {
  const withoutCommentsAndSingleQuotes = stripCommentsAndNormalizeQuotes(input)
  const segments = withoutCommentsAndSingleQuotes.split(/("(?:[^"\\]|\\.)*")/)
  return segments
    .map((segment, i) =>
      // Odd indices are the double-quoted strings the split captured — leave
      // their contents untouched. Even indices are code, and get the
      // structural fixes.
      i % 2 === 1 ? segment : fixUnquotedKeysAndTrailingCommas(segment),
    )
    .join('')
}

/**
 * Single left-to-right scan, one character of lookahead. Tracks whether it is
 * inside a `"..."` string, a `'...'` string, a `//` comment or a `/* *\/`
 * comment, and only acts on the character in that state — never on a regex
 * applied to the whole text, which cannot tell a `//` inside a string from a
 * real comment.
 */
function stripCommentsAndNormalizeQuotes(input: string): string {
  let out = ''
  let mode: 'code' | 'double' | 'single' | 'line-comment' | 'block-comment' = 'code'
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    const next = input[i + 1]

    if (mode === 'code') {
      if (ch === '/' && next === '/') {
        mode = 'line-comment'
        i++
      } else if (ch === '/' && next === '*') {
        mode = 'block-comment'
        i++
      } else if (ch === '"') {
        mode = 'double'
        out += '"'
      } else if (ch === "'") {
        mode = 'single'
        out += '"'
      } else {
        out += ch
      }
      continue
    }

    if (mode === 'double') {
      if (ch === '\\' && next !== undefined) {
        out += ch + next
        i++
      } else if (ch === '"') {
        mode = 'code'
        out += '"'
      } else {
        out += ch
      }
      continue
    }

    if (mode === 'single') {
      if (ch === '\\' && next === "'") {
        // A redundant escape once the delimiter is no longer a quote.
        out += "'"
        i++
      } else if (ch === '\\' && next !== undefined) {
        out += ch + next
        i++
      } else if (ch === '"') {
        // Was a bare literal double-quote inside a single-quoted string; the
        // new delimiter is `"`, so it must be escaped to stay a literal.
        out += '\\"'
      } else if (ch === "'") {
        mode = 'code'
        out += '"'
      } else {
        out += ch
      }
      continue
    }

    // Comments contribute nothing but must preserve newlines, or every error
    // location reported after this point would be off by however many
    // comment lines were removed.
    if (mode === 'line-comment') {
      if (ch === '\n') {
        mode = 'code'
        out += '\n'
      }
      continue
    }

    // mode === 'block-comment'
    if (ch === '*' && next === '/') {
      mode = 'code'
      i++
    } else if (ch === '\n') {
      out += '\n'
    }
  }
  return out
}

/** Runs only on segments already known to contain no string literals. */
function fixUnquotedKeysAndTrailingCommas(code: string): string {
  return code
    .replace(/,(\s*[}\]])/g, '$1')
    .replace(/([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)(\s*:)/g, '$1"$2"$3')
}

export type DiffKind = 'added' | 'removed' | 'changed'

export interface DiffEntry {
  readonly path: string
  readonly kind: DiffKind
  readonly left?: string
  readonly right?: string
}

export interface CompareResult {
  readonly entries: readonly DiffEntry[]
  readonly truncated: boolean
  readonly identical: boolean
}

/** Past this many differences the list is a wall of noise, not a report. */
const MAX_DIFF_ENTRIES = 500

/**
 * Past this nesting the two documents are compared as opaque values rather
 * than descended into — the same defensive ceiling as `describeShape`, kept
 * separate because a diff walk allocates a new path array per level and a
 * pathological document should not be allowed to make that expensive.
 */
const MAX_DIFF_DEPTH = 200

export function compareJson(left: unknown, right: unknown): CompareResult {
  const entries: DiffEntry[] = []
  diffWalk(left, right, [], 0, entries)
  return {
    entries,
    truncated: entries.length >= MAX_DIFF_ENTRIES,
    identical: entries.length === 0,
  }
}

function diffWalk(
  left: unknown,
  right: unknown,
  path: readonly PathSegment[],
  depth: number,
  entries: DiffEntry[],
): void {
  if (entries.length >= MAX_DIFF_ENTRIES) return

  if (left === MISSING) {
    entries.push({
      path: formatJsonPath(path),
      kind: 'added',
      right: previewValue(right),
    })
    return
  }
  if (right === MISSING) {
    entries.push({
      path: formatJsonPath(path),
      kind: 'removed',
      left: previewValue(left),
    })
    return
  }

  const leftType = typeOfValue(left)
  const rightType = typeOfValue(right)
  if (leftType !== rightType) {
    entries.push({
      path: formatJsonPath(path),
      kind: 'changed',
      left: previewValue(left),
      right: previewValue(right),
    })
    return
  }

  if (depth >= MAX_DIFF_DEPTH) {
    if (JSON.stringify(left) !== JSON.stringify(right)) {
      entries.push({
        path: formatJsonPath(path),
        kind: 'changed',
        left: previewValue(left),
        right: previewValue(right),
      })
    }
    return
  }

  if (leftType === 'object') {
    const leftRecord = left as Record<string, unknown>
    const rightRecord = right as Record<string, unknown>
    const keys = new Set([...Object.keys(leftRecord), ...Object.keys(rightRecord)])
    for (const key of keys) {
      if (entries.length >= MAX_DIFF_ENTRIES) return
      const leftValue = key in leftRecord ? leftRecord[key] : MISSING
      const rightValue = key in rightRecord ? rightRecord[key] : MISSING
      diffWalk(leftValue, rightValue, [...path, key], depth + 1, entries)
    }
    return
  }

  if (leftType === 'array') {
    const leftArray = left as unknown[]
    const rightArray = right as unknown[]
    const length = Math.max(leftArray.length, rightArray.length)
    for (let i = 0; i < length; i++) {
      if (entries.length >= MAX_DIFF_ENTRIES) return
      const leftValue = i < leftArray.length ? leftArray[i] : MISSING
      const rightValue = i < rightArray.length ? rightArray[i] : MISSING
      diffWalk(leftValue, rightValue, [...path, i], depth + 1, entries)
    }
    return
  }

  if (left !== right) {
    entries.push({
      path: formatJsonPath(path),
      kind: 'changed',
      left: previewValue(left),
      right: previewValue(right),
    })
  }
}
