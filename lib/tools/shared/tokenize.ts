/**
 * Single-line JSON tokeniser for the CodePane's syntax colouring.
 *
 * Purpose
 *   Split one already-formatted line of JSON into coloured spans, without
 *   pulling in a highlighting library (see docs/TOOL_REDESIGN_PLAN.md §5 — the
 *   per-route budget is 90KB gzipped and Prism/Shiki/CodeMirror each spend most
 *   of it on their own).
 *
 * Inputs   a single line of text (no newlines). Any string is accepted.
 * Outputs  ordered tokens whose `text` values concatenate back to the exact
 *          input — the pane renders them in sequence, so losing or reordering a
 *          character would visibly corrupt the output.
 * Failure  never throws. Unrecognised input degrades to a single `plain` token,
 *          which renders correctly, just uncoloured.
 *
 * This is deliberately a LEXER, not a parser: it runs per visible line, must be
 * cheap, and must cope with a line that is only a fragment of a larger document
 * (`"a": {` has no closing brace on that line and that is normal).
 */

export type TokenKind =
  | 'key'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'punct'
  | 'plain'
  // HTML kinds. Shared with the JSON set rather than a second union, so
  // CodePane's TOKEN_CLASS map stays one lookup table.
  | 'tag'
  | 'attr'
  | 'comment'

export interface Token {
  readonly kind: TokenKind
  readonly text: string
}

/** Leading indentation is preserved verbatim as punctuation-coloured space. */
export function tokenizeJson(line: string): readonly Token[] {
  if (line.length === 0) return []

  const tokens: Token[] = []
  let i = 0

  while (i < line.length) {
    const ch = line[i]
    if (ch === undefined) break

    // Whitespace run
    if (ch === ' ' || ch === '\t') {
      let j = i
      while (j < line.length && (line[j] === ' ' || line[j] === '\t')) j++
      tokens.push({ kind: 'plain', text: line.slice(i, j) })
      i = j
      continue
    }

    // String — may be a key or a value. Consume with escape awareness so an
    // embedded \" does not terminate the token early.
    if (ch === '"') {
      let j = i + 1
      while (j < line.length) {
        if (line[j] === '\\') {
          j += 2
          continue
        }
        if (line[j] === '"') {
          j++
          break
        }
        j++
      }
      const text = line.slice(i, j)
      // A string is a KEY when the next non-space character is a colon.
      let k = j
      while (k < line.length && line[k] === ' ') k++
      tokens.push({ kind: line[k] === ':' ? 'key' : 'string', text })
      i = j
      continue
    }

    // Number (JSON grammar: optional -, digits, optional fraction/exponent)
    if (ch === '-' || (ch >= '0' && ch <= '9')) {
      let j = i
      if (line[j] === '-') j++
      while (j < line.length) {
        const c = line[j]
        if (c === undefined) break
        if ((c >= '0' && c <= '9') || c === '.' || c === 'e' || c === 'E') {
          j++
        } else if (
          (c === '+' || c === '-') &&
          (line[j - 1] === 'e' || line[j - 1] === 'E')
        ) {
          j++
        } else {
          break
        }
      }
      tokens.push({ kind: 'number', text: line.slice(i, j) })
      i = j
      continue
    }

    // Literals
    if (line.startsWith('true', i)) {
      tokens.push({ kind: 'boolean', text: 'true' })
      i += 4
      continue
    }
    if (line.startsWith('false', i)) {
      tokens.push({ kind: 'boolean', text: 'false' })
      i += 5
      continue
    }
    if (line.startsWith('null', i)) {
      tokens.push({ kind: 'null', text: 'null' })
      i += 4
      continue
    }

    // Structural punctuation
    if ('{}[],:'.includes(ch)) {
      tokens.push({ kind: 'punct', text: ch })
      i++
      continue
    }

    // Anything else — consume until the next character we know how to start on,
    // so unknown input becomes one plain run rather than one token per char.
    let j = i
    while (j < line.length) {
      const c = line[j]
      if (c === undefined) break
      if (
        c === '"' ||
        c === ' ' ||
        c === '\t' ||
        '{}[],:'.includes(c) ||
        c === '-' ||
        (c >= '0' && c <= '9')
      ) {
        break
      }
      j++
    }
    // Guard against a zero-width step (would loop forever).
    if (j === i) j = i + 1
    tokens.push({ kind: 'plain', text: line.slice(i, j) })
    i = j
  }

  return tokens
}

/**
 * Single-line HTML tokeniser, same contract as `tokenizeJson`: tokens concatenate
 * back to the exact input.
 *
 * `CodePane` accepted `language="html"` before this existed and quietly rendered
 * HTML uncoloured, which is how the gap was found — the email-signature tool shows
 * its generated markup as a peer view of the preview, and an uncoloured wall of
 * nested tables is nearly unreadable.
 *
 * Also a LEXER, not a parser, and for the same reason: it runs per visible line
 * and a line is routinely a fragment (`<td style="…"` with the `>` on the next
 * line is normal in formatted email HTML). It therefore tracks no state between
 * lines and cannot be confused by an unbalanced tag.
 *
 * Not a sanitiser. It only decides colours; escaping is the caller's job, and in
 * every current caller the markup was built by an escaping builder.
 */
export function tokenizeHtml(line: string): readonly Token[] {
  if (line.length === 0) return []

  const tokens: Token[] = []
  let i = 0

  while (i < line.length) {
    const ch = line[i]
    if (ch === undefined) break

    // Comment — consumed whole (or to end of line for a fragment).
    if (line.startsWith('<!--', i)) {
      const close = line.indexOf('-->', i + 4)
      const end = close === -1 ? line.length : close + 3
      tokens.push({ kind: 'comment', text: line.slice(i, end) })
      i = end
      continue
    }

    // A tag: `<name`, `</name`, `<!doctype`. Everything up to the matching `>`
    // (or end of line) is tag context, where bare words are attributes and
    // quoted runs are values.
    if (ch === '<') {
      let j = i + 1
      if (line[j] === '/') j++
      const nameStart = j
      while (j < line.length && /[a-zA-Z0-9!:-]/.test(line[j] ?? '')) j++
      tokens.push({ kind: 'punct', text: line.slice(i, nameStart) })
      if (j > nameStart) tokens.push({ kind: 'tag', text: line.slice(nameStart, j) })
      i = j

      // Inside the tag, until `>`.
      while (i < line.length && line[i] !== '>') {
        const c = line[i]
        if (c === undefined) break

        if (c === ' ' || c === '\t') {
          let k = i
          while (k < line.length && (line[k] === ' ' || line[k] === '\t')) k++
          tokens.push({ kind: 'plain', text: line.slice(i, k) })
          i = k
          continue
        }

        // Quoted attribute value.
        if (c === '"' || c === "'") {
          const close = line.indexOf(c, i + 1)
          const end = close === -1 ? line.length : close + 1
          tokens.push({ kind: 'string', text: line.slice(i, end) })
          i = end
          continue
        }

        if (c === '=' || c === '/') {
          tokens.push({ kind: 'punct', text: c })
          i++
          continue
        }

        // Attribute name.
        let k = i
        while (k < line.length) {
          const a = line[k]
          if (a === undefined) break
          if (
            a === '=' ||
            a === ' ' ||
            a === '\t' ||
            a === '>' ||
            a === '"' ||
            a === "'"
          ) {
            break
          }
          k++
        }
        if (k === i) k = i + 1
        tokens.push({ kind: 'attr', text: line.slice(i, k) })
        i = k
      }

      if (i < line.length && line[i] === '>') {
        tokens.push({ kind: 'punct', text: '>' })
        i++
      }
      continue
    }

    // Text content between tags.
    const next = line.indexOf('<', i)
    const end = next === -1 ? line.length : next
    // `end === i` cannot happen here (ch !== '<'), but guard anyway: a zero-width
    // step would spin forever.
    const safeEnd = end === i ? i + 1 : end
    tokens.push({ kind: 'plain', text: line.slice(i, safeEnd) })
    i = safeEnd
  }

  return tokens
}
