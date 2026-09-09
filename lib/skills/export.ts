import type { Skill } from './types'

/**
 * The formats a stored `Skill` can be exported as. This is the entire
 * "customizable on export for all agents" feature — a pure formatting
 * function, not per-agent authored content, because `SKILL.md` (frontmatter
 * + body) is already an open standard that Claude Code, OpenAI Codex CLI,
 * Cursor, and Gemini CLI read natively as-is, and `AGENTS.md`/`.cursorrules`/
 * Copilot instructions are all plain Markdown with no required frontmatter.
 */
export type SkillExportFormat =
  | 'skill-md'
  | 'agents-md'
  | 'cursorrules'
  | 'copilot-instructions'

export const SKILL_EXPORT_FORMATS: readonly {
  readonly format: SkillExportFormat
  readonly label: string
  readonly filename: string
}[] = [
  { format: 'skill-md', label: 'SKILL.md', filename: 'SKILL.md' },
  { format: 'agents-md', label: 'AGENTS.md', filename: 'AGENTS.md' },
  { format: 'cursorrules', label: '.cursorrules', filename: '.cursorrules' },
  {
    format: 'copilot-instructions',
    label: 'Copilot instructions',
    filename: 'copilot-instructions.md',
  },
]

function toSkillMd(skill: Skill): string {
  const lines = ['---', `name: ${skill.name}`, `description: ${skill.description}`]
  if (skill.license) lines.push(`license: ${skill.license}`)
  lines.push('---', '', skill.body)
  return lines.join('\n')
}

/** AGENTS.md has no required frontmatter — a `## {title}` heading plus the
 * body is the whole convention. */
function toAgentsMd(skill: Skill): string {
  return `## ${skill.name}\n\n${skill.description}\n\n${skill.body}`
}

/** .cursorrules and Copilot's custom-instructions files are both plain
 * Markdown with no schema of their own — same transform as AGENTS.md. */
function toPlainInstructions(skill: Skill): string {
  return `# ${skill.name}\n\n${skill.description}\n\n${skill.body}`
}

export function exportSkillAs(skill: Skill, format: SkillExportFormat): string {
  switch (format) {
    case 'skill-md':
      return toSkillMd(skill)
    case 'agents-md':
      return toAgentsMd(skill)
    case 'cursorrules':
    case 'copilot-instructions':
      return toPlainInstructions(skill)
    default:
      return toSkillMd(skill)
  }
}

/**
 * The real, non-fabricated content of the ZIP download's `INSTALL.md` —
 * generic installation mechanics for the open Agent Skills format, not
 * per-skill usage examples this site has no data to back (`Skill` carries
 * no version or usage-example field; see lib/skills/types.ts). Only the
 * Claude Code path is stated as a specific folder convention because it is
 * publicly documented and is this site's own primary use case; the other
 * four compatible agents are pointed at their own docs rather than a
 * guessed path, since asserting an exact folder for a tool this codebase
 * doesn't control would risk being wrong.
 */
export function buildInstallMd(skill: Skill): string {
  const sections = [
    `# Installing ${skill.name}`,
    `This ZIP contains the real \`SKILL.md\` for **${skill.name}**, synced from\n[${skill.sourceOwner}/${skill.sourceRepo}](${skill.sourceUrl}).`,
    [
      '## Claude Code',
      'Copy the `SKILL.md` file from this ZIP into:',
      `\`\`\`\n.claude/skills/${skill.slug}/SKILL.md   (project-level)\n~/.claude/skills/${skill.slug}/SKILL.md (personal, every project)\n\`\`\``,
    ].join('\n\n'),
    [
      '## Cursor, Codex CLI, GitHub Copilot, Gemini CLI',
      "These tools read the same open Agent Skills format `SKILL.md` uses, but each has its own rules/instructions folder convention — check your tool's own docs for exactly where it expects a skill file, then drop this one in. The file's content doesn't need to change between tools.",
    ].join('\n\n'),
    ['## What this skill does', skill.description].join('\n\n'),
  ]
  if (skill.license) {
    sections.push(`## License\n\n${skill.license}, per the source repository.`)
  }
  return sections.join('\n\n')
}
