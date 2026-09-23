/**
 * Parses a real `SKILL.md` file's YAML frontmatter into the flat fields
 * this app's `Skill` row actually needs (`name`, `description`, `license`)
 * — deliberately not a general YAML parser (no dependency exists in this
 * project for one; see lib/admin/zip-reader.ts's docblock for the same
 * "hand-roll the narrow real need" reasoning). Handles exactly the shapes
 * the open Agent Skills format's frontmatter uses in practice: quoted and
 * bare scalars, and the folded (`>`)/literal (`|`) block-scalar forms —
 * the same construct lib/skills/description.ts's own docblock documents
 * as appearing in 19.9% of real upstream files, so an admin uploading a
 * SKILL.md copied from an external repo is likely to hit it too.
 */

export interface ParsedSkillMd {
  readonly name?: string
  readonly description?: string
  readonly license?: string
  /** Everything after the closing `---`, trimmed. */
  readonly body: string
}

export interface SkillMdParseError {
  readonly ok: false
  readonly message: string
}
export interface SkillMdParseSuccess {
  readonly ok: true
  readonly value: ParsedSkillMd
}

/** Strips wrapping quotes and unescapes `\"`/`\\` for a double-quoted
 * scalar; returns a bare/unquoted scalar's text unchanged (trimmed). */
function unquote(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  }
  if (trimmed.length >= 2 && trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'")
  }
  return trimmed
}

const BLOCK_SCALAR_INDICATOR = /^([>|])[0-9]*[+-]?$/

/**
 * Parses the frontmatter's flat `key: value` lines, including a block
 * scalar's indented continuation. Not a full YAML parser: no nesting, no
 * lists, no anchors — every field this app reads from frontmatter
 * (`name`, `description`, `license`) is a plain string, so that is all
 * this supports; an unrecognised construct on a line is skipped rather
 * than treated as an error, since a field this app doesn't read (e.g. a
 * skill's own `allowed-tools` metadata) shouldn't block a valid upload.
 */
function parseFrontmatterFields(lines: readonly string[]): Record<string, string> {
  const fields: Record<string, string> = {}
  let i = 0
  while (i < lines.length) {
    const line = lines[i] ?? ''
    const match = /^([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*)$/.exec(line)
    if (!match) {
      i++
      continue
    }
    const [, key, rawValue] = match
    const value = (rawValue ?? '').trim()
    const blockMatch = value ? BLOCK_SCALAR_INDICATOR.exec(value) : null

    if (blockMatch) {
      // A folded (>) or literal (|) block scalar: every following line
      // indented further than `key:` belongs to it. Folded joins with
      // spaces (a blank line becomes a paragraph break, collapsed to one
      // space here since these fields are single-line in practice);
      // literal keeps its own newlines.
      const isFolded = blockMatch[1] === '>'
      const collected: string[] = []
      let j = i + 1
      while (j < lines.length) {
        const next = lines[j] ?? ''
        if (next.trim() === '') {
          collected.push('')
          j++
          continue
        }
        if (!/^\s/.test(next)) break
        collected.push(next.trim())
        j++
      }
      const text = collected.join(isFolded ? ' ' : '\n').trim()
      if (key && text) fields[key] = text
      i = j
      continue
    }

    if (key && value) fields[key] = unquote(value)
    i++
  }
  return fields
}

/**
 * Splits `raw` into frontmatter + body and parses the frontmatter. Fails
 * (rather than silently treating the whole file as body) when there is no
 * `---`-delimited frontmatter block at all, or when it has no usable
 * `name` — every real Agent Skill has both, and an admin upload missing
 * either is a file that isn't actually a SKILL.md, not a style choice.
 */
export function parseSkillMd(raw: string): SkillMdParseSuccess | SkillMdParseError {
  const normalised = raw.replace(/\r\n/g, '\n').replace(/^﻿/, '')
  const lines = normalised.split('\n')

  if ((lines[0] ?? '').trim() !== '---') {
    return {
      ok: false,
      message: 'No YAML frontmatter found — the file must start with "---".',
    }
  }
  const closingIndex = lines.slice(1).findIndex((l) => l.trim() === '---')
  if (closingIndex === -1) {
    return { ok: false, message: 'Frontmatter is never closed with a second "---".' }
  }
  const frontmatterLines = lines.slice(1, 1 + closingIndex)
  const body = lines
    .slice(1 + closingIndex + 1)
    .join('\n')
    .trim()

  const fields = parseFrontmatterFields(frontmatterLines)
  const name = fields.name?.trim()
  if (!name) {
    return { ok: false, message: 'Frontmatter has no usable "name" field.' }
  }

  return {
    ok: true,
    value: {
      name,
      description: fields.description?.trim() || undefined,
      license: fields.license?.trim() || undefined,
      body,
    },
  }
}
