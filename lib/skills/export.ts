import type { Skill } from './types'

/**
 * The formats a stored `Skill` can be exported as.
 *
 * There used to be four, and three of them produced the same text. The
 * transforms behind `.cursorrules` and Copilot instructions were literally
 * the same function — byte-for-byte identical output — and `AGENTS.md`
 * differed from them by a single character (`##` versus `#`). So the picker
 * offered four tabs and delivered one and a half, which is the reason the
 * exports on every skill page read as near-duplicates of each other.
 *
 * The list below keeps only the shapes that genuinely differ, which is
 * determined by what each target actually requires:
 *
 *   - `SKILL.md` — the open Agent Skills format: YAML frontmatter carrying
 *     `name` and `description`, then the body. Claude Code reads it as-is.
 *   - `.mdc` — Cursor's project rules live in `.cursor/rules/*.mdc` and take
 *     their own frontmatter, so this is a real second shape rather than a
 *     relabelling of the first.
 *   - `AGENTS.md` — plain Markdown with no frontmatter at all. The same file
 *     serves `.github/copilot-instructions.md` and the legacy `.cursorrules`,
 *     which is stated in the label instead of being sold as extra formats.
 *
 * This remains a pure formatting function, not per-agent authored content:
 * inventing tool-specific guidance this site has no source for would be
 * making things up, and the underlying `SKILL.md` really is portable.
 */
export type SkillExportFormat = 'skill-md' | 'cursor-mdc' | 'agents-md'

export const SKILL_EXPORT_FORMATS: readonly {
  readonly format: SkillExportFormat
  readonly label: string
  readonly filename: string
  /** What this shape is for — shown under the picker so the choice is
   * legible, and so the plain-Markdown option can say which three files it
   * covers rather than pretending to be three formats. */
  readonly note: string
}[] = [
  {
    format: 'skill-md',
    label: 'SKILL.md',
    filename: 'SKILL.md',
    note: 'Agent Skills format with YAML frontmatter. Claude Code reads it as-is.',
  },
  {
    format: 'cursor-mdc',
    label: '.mdc',
    filename: 'skill.mdc',
    note: 'Cursor project rule, for .cursor/rules/ — MDC frontmatter instead of YAML.',
  },
  {
    format: 'agents-md',
    label: 'AGENTS.md',
    filename: 'AGENTS.md',
    note: 'Plain Markdown, no frontmatter. Same file works as .github/copilot-instructions.md or .cursorrules.',
  },
]

/**
 * A YAML double-quoted scalar. Necessary, not decorative: a recovered
 * description is prose, so it routinely contains `:` and `#`, and a bare
 * scalar starting with `>` or `|` would open a block scalar and swallow the
 * closing `---`. Whitespace is already collapsed upstream, so escaping the
 * backslash and quote is enough to make any of it safe.
 */
function yamlString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

/** Whether the body already opens with its own `# Heading`. */
function bodyHasTitle(body: string): boolean {
  return /^\s*#\s+\S/.test(body)
}

/**
 * The body's own first line of prose, if it has one — used only to decide
 * whether re-printing the description above the body would repeat it.
 * `resolveSkillDescription` recovers most descriptions FROM that paragraph,
 * so emitting both verbatim is how a well-meant header turns into the same
 * sentence twice.
 */
function bodyOpensWith(body: string, description: string): boolean {
  if (description === '') return false
  const compare = (s: string) =>
    s
      .replace(/[^a-z0-9]/gi, '')
      .slice(0, 60)
      .toLowerCase()
  const needle = compare(description)
  return (
    needle.length > 0 && compare(body.replace(/^\s*#[^\n]*\n/, '')).startsWith(needle)
  )
}

/** Frontmatter + body: the Agent Skills standard. */
function toSkillMd(skill: Skill): string {
  const lines = ['---', `name: ${yamlString(skill.name)}`]
  // Omitted entirely rather than written empty when there is nothing real to
  // say — an absent key is valid frontmatter, `description:` with no value
  // is a claim that the skill has no description.
  if (skill.description !== '') {
    lines.push(`description: ${yamlString(skill.description)}`)
  }
  if (skill.license) lines.push(`license: ${yamlString(skill.license)}`)
  lines.push('---', '', skill.body.trim())
  return lines.join('\n')
}

/**
 * Cursor's MDC project rule. `alwaysApply: false` so the rule is pulled in
 * by relevance rather than injected into every request; `globs` is
 * deliberately absent because the right file pattern depends on a repo this
 * site knows nothing about, and a guessed glob would silently stop the rule
 * from ever matching.
 */
function toCursorMdc(skill: Skill): string {
  const lines = ['---']
  if (skill.description !== '') {
    lines.push(`description: ${yamlString(skill.description)}`)
  }
  lines.push('alwaysApply: false', '---', '', skill.body.trim())
  return lines.join('\n')
}

/**
 * Plain Markdown, no frontmatter — `AGENTS.md`,
 * `.github/copilot-instructions.md` and legacy `.cursorrules` all take this
 * shape. A `## ` heading rather than `# ` because this content is normally
 * appended into a file that already has a title of its own.
 */
function toAgentsMd(skill: Skill): string {
  const body = skill.body.trim()
  const sections: string[] = [`## ${skill.name}`]
  // Only when the body doesn't already say it, which is the common case now
  // that descriptions are recovered from the body's opening paragraph.
  if (skill.description !== '' && !bodyOpensWith(body, skill.description)) {
    sections.push(skill.description)
  }
  // The body's own `# Title` would outrank the `##` section heading above it,
  // so demote it; deeper headings keep their relative depth.
  sections.push(bodyHasTitle(body) ? body.replace(/^\s*#\s+/, '### ') : body)
  return sections.join('\n\n')
}

export function exportSkillAs(skill: Skill, format: SkillExportFormat): string {
  switch (format) {
    case 'skill-md':
      return toSkillMd(skill)
    case 'cursor-mdc':
      return toCursorMdc(skill)
    case 'agents-md':
      return toAgentsMd(skill)
    default:
      return toSkillMd(skill)
  }
}

/**
 * The ZIP download's `INSTALL.md`.
 *
 * Installation mechanics are genuinely the same for every skill, so this
 * file is deliberately similar across skills rather than padded out with
 * invented per-skill variety — `Skill` carries no version or usage-example
 * field (see ./types.ts) and inventing one would be fabricating data. What
 * it does carry is every real fact on the record: the exact install path for
 * this slug, the source repository, the category, and the licence.
 *
 * Only the Claude Code path is given as a specific folder, because it is
 * publicly documented and is this site's own primary use case. The other
 * agents are pointed at their own docs, since asserting an exact folder for
 * a tool this codebase doesn't control would risk being confidently wrong.
 */
export function buildInstallMd(skill: Skill): string {
  const sections = [
    `# Installing ${skill.name}`,
    `\`SKILL.md\` in this ZIP is the real skill, synced from [${skill.sourceOwner}/${skill.sourceRepo}](${skill.sourceUrl}) — not a rewrite of it.`,
  ]

  if (skill.description !== '') {
    sections.push(['## What it does', skill.description].join('\n\n'))
  }

  sections.push(
    [
      '## Claude Code',
      'Copy `SKILL.md` from this ZIP to either path:',
      `\`\`\`\n.claude/skills/${skill.slug}/SKILL.md    # this project only\n~/.claude/skills/${skill.slug}/SKILL.md   # every project\n\`\`\``,
    ].join('\n\n'),
    [
      '## Cursor, Codex CLI, GitHub Copilot, Gemini CLI',
      "These read the same open Agent Skills format, but each has its own rules or instructions folder — check your tool's docs for where it expects a skill file, then drop this one in. The content does not need to change between tools.",
      'The skill page this ZIP came from also offers Cursor `.mdc` and plain `AGENTS.md` renderings of the same skill, if your tool wants one of those shapes.',
    ].join('\n\n'),
  )

  const facts = [`- Category: ${skill.category}`, `- Source: ${skill.sourceUrl}`]
  if (skill.license) facts.push(`- License: ${skill.license}, per the source repository`)
  sections.push(['## This skill', ...facts].join('\n'))

  return sections.join('\n\n')
}
