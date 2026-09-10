import { describe, expect, it } from 'vitest'
import { buildInstallMd, exportSkillAs, SKILL_EXPORT_FORMATS } from './export'
import type { Skill } from './types'

/**
 * The defect these cover: the picker offered four export formats and three
 * of them produced the same text. `.cursorrules` and Copilot instructions
 * ran through literally the same function (byte-identical output) and
 * `AGENTS.md` differed by one character. So every skill page's exports read
 * as duplicates of each other, independently of the description bug that
 * made 19.9% of pages share a header as well.
 */

const skill: Skill = {
  id: 'id-1',
  slug: 'frontend-a11y',
  category: 'code-review',
  name: 'frontend-a11y',
  description: 'Practical accessibility patterns for React and Next.js.',
  body: '# Frontend Accessibility Patterns\n\nPractical accessibility patterns for React and Next.js.\n\n## Forms\n\nLabel every input.',
  tags: ['a11y'],
  license: 'MIT',
  licenseGated: false,
  sourceOwner: 'owner',
  sourceRepo: 'repo',
  sourceSkillId: 'src-1',
  sourceUrl: 'https://github.com/owner/repo',
  installs: 10,
  firstSeenAt: '2026-08-01',
  lastSyncedAt: '2026-09-03',
  relatedTools: [],
  relatedPrompts: [],
}

describe('SKILL_EXPORT_FORMATS', () => {
  it('offers no two formats that render the same text', () => {
    const rendered = SKILL_EXPORT_FORMATS.map((f) => exportSkillAs(skill, f.format))
    // The regression, stated directly: three of four used to collide here.
    expect(new Set(rendered).size).toBe(SKILL_EXPORT_FORMATS.length)
  })

  it('gives every format a distinct filename and a note saying what it is for', () => {
    const names = SKILL_EXPORT_FORMATS.map((f) => f.filename)
    expect(new Set(names).size).toBe(names.length)
    for (const f of SKILL_EXPORT_FORMATS) {
      expect(f.note.length, f.label).toBeGreaterThan(20)
    }
  })

  it('says which other files the plain-Markdown export also serves', () => {
    // Rather than listing .cursorrules and copilot-instructions as separate
    // formats that emit identical bytes.
    const agents = SKILL_EXPORT_FORMATS.find((f) => f.format === 'agents-md')
    expect(agents?.note).toMatch(/copilot-instructions/)
    expect(agents?.note).toMatch(/cursorrules/)
  })
})

describe('exportSkillAs — SKILL.md', () => {
  it('quotes frontmatter values so prose cannot break the YAML', () => {
    const md = exportSkillAs(
      { ...skill, description: 'Audit: contrast, keyboard, ARIA — "AA" level' },
      'skill-md',
    )
    expect(md).toContain(
      'description: "Audit: contrast, keyboard, ARIA — \\"AA\\" level"',
    )
  })

  /**
   * The reason quoting is not cosmetic. Before the description repair a row
   * could hold `>`, which written bare produced:
   *
   *     ---
   *     name: x
   *     description: >
   *     ---
   *
   * where `description: >` opens a folded block scalar that runs into the
   * closing `---`, so the frontmatter a user handed to Claude Code was
   * malformed. Quoting makes any value inert; the repair upstream means this
   * value should never reach here in the first place.
   */
  it('cannot emit a bare block-scalar indicator as a value', () => {
    const md = exportSkillAs({ ...skill, description: '>' }, 'skill-md')
    expect(md).not.toMatch(/^description: >$/m)
    expect(md).toContain('description: ">"')
  })

  it('omits the description key entirely when there is nothing to say', () => {
    const md = exportSkillAs({ ...skill, description: '' }, 'skill-md')
    expect(md).not.toContain('description:')
    expect(md).toContain('name: "frontend-a11y"')
  })

  it('keeps the body verbatim after the frontmatter', () => {
    const md = exportSkillAs(skill, 'skill-md')
    expect(md.startsWith('---\n')).toBe(true)
    expect(md).toContain('# Frontend Accessibility Patterns')
    expect(md).toContain('Label every input.')
  })

  it('omits license when the skill has none', () => {
    expect(exportSkillAs({ ...skill, license: undefined }, 'skill-md')).not.toContain(
      'license:',
    )
  })
})

describe('exportSkillAs — Cursor .mdc', () => {
  it('carries MDC frontmatter, which is what makes it a real second shape', () => {
    const mdc = exportSkillAs(skill, 'cursor-mdc')
    expect(mdc).toContain('alwaysApply: false')
    expect(mdc).toContain(
      'description: "Practical accessibility patterns for React and Next.js."',
    )
  })

  it('omits globs rather than guessing a pattern that would never match', () => {
    expect(exportSkillAs(skill, 'cursor-mdc')).not.toContain('globs')
  })

  it('does not carry the Agent Skills `name` key, which MDC has no use for', () => {
    expect(exportSkillAs(skill, 'cursor-mdc')).not.toContain('name:')
  })
})

describe('exportSkillAs — AGENTS.md', () => {
  it('has no frontmatter at all', () => {
    expect(exportSkillAs(skill, 'agents-md').startsWith('## ')).toBe(true)
  })

  /**
   * Now that descriptions are recovered FROM the body's opening paragraph,
   * printing both verbatim prints the same sentence twice — the header
   * duplication this whole change is about, reintroduced by the fix.
   */
  it('does not repeat the description when the body already opens with it', () => {
    const md = exportSkillAs(skill, 'agents-md')
    const occurrences = md.split('Practical accessibility patterns for React').length - 1
    expect(occurrences).toBe(1)
  })

  it('does print the description when the body does not already say it', () => {
    const md = exportSkillAs(
      { ...skill, description: 'A summary found nowhere in the body.' },
      'agents-md',
    )
    expect(md).toContain('A summary found nowhere in the body.')
  })

  it("demotes the body's H1 so it cannot outrank the section heading", () => {
    const md = exportSkillAs(skill, 'agents-md')
    expect(md).toContain('## frontend-a11y')
    expect(md).toContain('### Frontend Accessibility Patterns')
    // No H1 anywhere, or the appended section would break its host document.
    expect(md).not.toMatch(/^# /m)
  })

  it('leaves a body that has no title of its own alone', () => {
    const md = exportSkillAs({ ...skill, body: 'Just prose, no heading.' }, 'agents-md')
    expect(md).toContain('Just prose, no heading.')
    expect(md).not.toContain('###')
  })
})

describe('buildInstallMd', () => {
  it('states the exact install path for this skill, not a generic one', () => {
    const md = buildInstallMd(skill)
    expect(md).toContain('.claude/skills/frontend-a11y/SKILL.md')
    expect(md).toContain('~/.claude/skills/frontend-a11y/SKILL.md')
  })

  it('records the real per-skill facts rather than padding with invented variety', () => {
    const md = buildInstallMd(skill)
    expect(md).toContain('owner/repo')
    expect(md).toContain('https://github.com/owner/repo')
    expect(md).toContain('Category: code-review')
    expect(md).toContain('License: MIT')
  })

  it('invents no version or usage-example field, since Skill carries neither', () => {
    const md = buildInstallMd(skill)
    expect(md).not.toMatch(/version/i)
    expect(md).not.toMatch(/## Usage example/i)
  })

  it('omits the licence line when the skill has no licence', () => {
    expect(buildInstallMd({ ...skill, license: undefined })).not.toContain('License:')
  })

  it('keeps intentional blank lines between sections', () => {
    // A previous version filtered empty lines out and welded every section
    // together into one unreadable block.
    expect(buildInstallMd(skill)).toContain('\n\n')
    expect(buildInstallMd(skill)).not.toMatch(/[^\n]\n#/)
  })
})
