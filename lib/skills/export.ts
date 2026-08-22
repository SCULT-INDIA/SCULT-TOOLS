import type { Skill } from './types'

/**
 * The formats a stored `Skill` can be exported as. This is the entire
 * "customizable on export for all agents" feature — a pure formatting
 * function, not per-agent authored content, because `SKILL.md` (frontmatter
 * + body) is already an open standard that Claude Code, OpenAI Codex CLI,
 * Cursor, and Gemini CLI read natively as-is, and `AGENTS.md`/`.cursorrules`/
 * Copilot instructions are all plain Markdown with no required frontmatter.
 */
export type SkillExportFormat = 'skill-md' | 'agents-md' | 'cursorrules' | 'copilot-instructions'

export const SKILL_EXPORT_FORMATS: readonly {
  readonly format: SkillExportFormat
  readonly label: string
  readonly filename: string
}[] = [
  { format: 'skill-md', label: 'SKILL.md', filename: 'SKILL.md' },
  { format: 'agents-md', label: 'AGENTS.md', filename: 'AGENTS.md' },
  { format: 'cursorrules', label: '.cursorrules', filename: '.cursorrules' },
  { format: 'copilot-instructions', label: 'Copilot instructions', filename: 'copilot-instructions.md' },
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
