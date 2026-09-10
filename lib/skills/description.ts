/**
 * Recovering a real description for a synced skill.
 *
 * 10,020 of the 50,456 rows in the `skills` table — 19.9% — store a
 * description that is nothing but a YAML block-scalar indicator: literally
 * `>`, `|`, `>-`, `|-` or `>+`. The upstream `SKILL.md` files wrote
 * `description: >` followed by an indented block, and whatever parsed them
 * before the sync kept the indicator and dropped the text.
 *
 * That single defect was visible on every surface at once, and it is why one
 * skill page looked much like the next: the detail page's summary line, the
 * card in every listing, the `<meta name="description">`, the CLI and MCP
 * payloads, and the `SKILL.md` / `AGENTS.md` / Cursor / Copilot exports all
 * read `skill.description` straight through. One page in five rendered the
 * same meaningless header.
 *
 * In the exports it was worse than ugly. `description: >` inside YAML
 * frontmatter opens a folded scalar with no content, so the block ran into
 * the closing `---` and the frontmatter a user handed to Claude Code was
 * malformed — the opposite of the point of downloading it.
 *
 * The fix has to live here rather than in the sync worker: that worker is a
 * separate project holding the only service-role key, this app has read-only
 * anon access, and the rows cannot be rewritten from here. So the recovery
 * runs at the read boundary (`rowToSkill` in ./db.ts), which every consumer
 * already flows through, and nothing downstream needs to know.
 *
 * Every branch below returns the skill's OWN words — its stored description,
 * or prose lifted from its body — never invented capability claims. The last
 * resort states only facts already on the record (name and source repo).
 */

/**
 * A stored description carrying no information: empty, or nothing but a YAML
 * block-scalar indicator (`>` / `|`, optionally with a `-`/`+` chomping
 * marker and an explicit indentation digit, e.g. `>2-`).
 */
export function isMeaninglessDescription(description: string): boolean {
  return /^\s*(?:[>|][0-9]*[-+]?)?\s*$/.test(description)
}

/** Inline Markdown reduced to the words a description should carry. */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1$2')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * A line that labels metadata rather than describing anything — `**Category:**
 * Optimization/Research`, `**Version:** 1.2`. Skipped because these sit above
 * the real prose in a common upstream template, and taking the first
 * non-heading line without this check picks the label instead of the
 * sentence two lines below it.
 */
function isMetadataLabel(line: string): boolean {
  return /^\*{0,2}[A-Z][A-Za-z /]{0,24}:\*{0,2}\s*\S/.test(line) && line.length < 60
}

/** Markdown structure that is never prose. */
function isNotProse(line: string): boolean {
  return (
    line === '' ||
    line.startsWith('#') ||
    line.startsWith('>') ||
    line.startsWith('|') ||
    line.startsWith('---') ||
    line.startsWith('===') ||
    line.startsWith('<') ||
    /^[-*+]\s/.test(line) ||
    /^\d+[.)]\s/.test(line)
  )
}

function isListItem(line: string): boolean {
  return /^[-*+]\s+\S/.test(line) || /^\d+[.)]\s+\S/.test(line)
}

/** Trim to `max` characters on a word boundary, preferring a sentence end. */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text
  const window = text.slice(0, max + 1)
  const sentence = window.search(/[.!?](?:\s|$)/)
  if (sentence >= 80) return window.slice(0, sentence + 1).trim()
  const space = window.lastIndexOf(' ')
  return `${window.slice(0, space > 0 ? space : max).trim()}…`
}

/** How long a recovered description may be. Comfortably above the ~160
 * characters a search snippet shows, since the same string also fills the
 * `SKILL.md` frontmatter where more context is useful. */
const MAX_LENGTH = 300
/** Below this, a candidate says too little to be worth showing. */
const MIN_USEFUL_LENGTH = 40

/**
 * The first real prose paragraph of a Markdown body, or ''. Walks past
 * headings, fenced code, blockquotes, tables, HTML, list markers and
 * metadata labels; stops at the next blank line, heading or fence.
 */
export function firstProseParagraph(body: string): string {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  let inFence = false
  let i = 0

  while (i < lines.length) {
    const line = (lines[i] ?? '').trim()
    if (line.startsWith('```') || line.startsWith('~~~')) {
      inFence = !inFence
      i++
      continue
    }
    if (inFence || isNotProse(line) || isMetadataLabel(line)) {
      i++
      continue
    }
    break
  }

  const paragraph: string[] = []
  while (i < lines.length) {
    const line = (lines[i] ?? '').trim()
    if (line === '' || line.startsWith('#') || line.startsWith('```')) break
    paragraph.push(line)
    i++
  }
  return stripInlineMarkdown(paragraph.join(' '))
}

/**
 * The first list block's items, joined — the fallback for the
 * heading-and-bullets bodies that carry no prose at all (a "## When to Use"
 * section straight after the title is a common shape upstream).
 */
export function firstListItems(body: string, maxItems = 3): string {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  let inFence = false
  const items: string[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (line.startsWith('```') || line.startsWith('~~~')) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    if (isListItem(line)) {
      items.push(stripInlineMarkdown(line.replace(/^(?:[-*+]|\d+[.)])\s+/, '')))
      if (items.length === maxItems) break
      continue
    }
    // A blank line inside a list is fine; anything else ends the first block.
    if (items.length > 0 && line !== '') break
  }
  return items.join('; ')
}

/**
 * The description to show for a skill, given what the row actually holds.
 *
 * Order of preference: the stored description; the body's first prose
 * paragraph; the body's first list items; finally a factual line naming the
 * skill and where it came from. The last is reached for roughly 1% of rows
 * and stays distinct per skill, so it cannot recreate the uniform header
 * this function exists to remove.
 */
export function resolveSkillDescription(
  description: string,
  body: string,
  name: string,
  sourceOwner: string,
  sourceRepo: string,
): string {
  if (!isMeaninglessDescription(description)) {
    return stripInlineMarkdown(description)
  }

  const prose = firstProseParagraph(body)
  if (prose.length >= MIN_USEFUL_LENGTH) return clamp(prose, MAX_LENGTH)

  const list = firstListItems(body)
  if (list.length >= MIN_USEFUL_LENGTH) return clamp(list, MAX_LENGTH)

  // Whichever of the two said more, if either said anything at all.
  const best = prose.length >= list.length ? prose : list
  if (best.length > 0) return clamp(best, MAX_LENGTH)

  return `${name} — an Agent Skill from the ${sourceOwner}/${sourceRepo} repository.`
}
