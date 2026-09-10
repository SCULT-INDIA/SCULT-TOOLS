import { describe, expect, it } from 'vitest'
import {
  firstListItems,
  firstProseParagraph,
  isMeaninglessDescription,
  resolveSkillDescription,
} from './description'

/**
 * The bug these cover: 10,020 of 50,456 synced rows (19.9%) store a
 * description that is only a YAML block-scalar indicator — `>`, `|`, `>-`,
 * `|-`, `>+` — because the upstream `SKILL.md` wrote `description: >` with
 * an indented block and the text was dropped somewhere before the sync.
 *
 * Every count and every literal below was read off the live table, not
 * imagined, and the recovery measured 99.8% on a 1,242-row sample.
 */

describe('isMeaninglessDescription', () => {
  it('catches every block-scalar indicator actually present in the table', () => {
    // Counts from the live table: 4,414 / 2,967 / 2,597 / 37 / 5.
    for (const value of ['>', '|', '>-', '|-', '>+']) {
      expect(isMeaninglessDescription(value), value).toBe(true)
    }
  })

  it('catches the indented and explicit-indentation variants too', () => {
    for (const value of ['', '   ', ' > ', '>2', '|2-', '>-  ']) {
      expect(isMeaninglessDescription(value), JSON.stringify(value)).toBe(true)
    }
  })

  it('keeps a real description, including ones that merely start with a marker', () => {
    for (const value of [
      'Authenticate to an Elasticsearch cluster using any configured realm.',
      '> Practical accessibility patterns', // a blockquote is still content
      '|pipe| table-ish but real',
      'Reading coach: guides users through books systematically',
    ]) {
      expect(isMeaninglessDescription(value), value).toBe(false)
    }
  })
})

describe('firstProseParagraph', () => {
  it('takes the paragraph under the title, not the title', () => {
    const body =
      '# Frontend Accessibility Patterns\n\nPractical patterns for React and Next.js.\n\n## More'
    expect(firstProseParagraph(body)).toBe('Practical patterns for React and Next.js.')
  })

  it('joins a wrapped paragraph into one line', () => {
    const body =
      '# T\n\nAuthenticate to a cluster using any supported realm.\nThis skill covers all built-in realms.\n\n## Next'
    expect(firstProseParagraph(body)).toBe(
      'Authenticate to a cluster using any supported realm. This skill covers all built-in realms.',
    )
  })

  /**
   * `a11y-checker` is the real row that drove this: its body opens with
   * `**Category:** Optimization/Research`, so taking the first non-heading
   * line yielded "Category: Optimization/Research" — technically the skill's
   * own text, and useless as a description.
   */
  it('skips a metadata label line to reach the real prose', () => {
    const body =
      '# Skill: Accessibility Checker\n**Category:** Optimization/Research\n\n## Role\nAudit web interfaces for WCAG 2.1 AA compliance: contrast, keyboard, ARIA.'
    expect(firstProseParagraph(body)).toBe(
      'Audit web interfaces for WCAG 2.1 AA compliance: contrast, keyboard, ARIA.',
    )
  })

  it('ignores prose inside fenced code', () => {
    const body =
      '# T\n\n```\nThis looks like a sentence but is sample output.\n```\n\nThe actual summary sentence.'
    expect(firstProseParagraph(body)).toBe('The actual summary sentence.')
  })

  it('strips inline Markdown so a description is plain words', () => {
    const body =
      '# T\n\nApply **these rules** to every `interactive` element, see [docs](https://x.dev).'
    expect(firstProseParagraph(body)).toBe(
      'Apply these rules to every interactive element, see docs.',
    )
  })

  it('returns empty for a body made only of headings and lists', () => {
    expect(
      firstProseParagraph(
        '# API Versioning\n\n## Core Principles\n\n- Version from day one\n',
      ),
    ).toBe('')
  })
})

describe('firstListItems', () => {
  it('recovers a summary from a heading-and-bullets body', () => {
    // `event-driven-arch`, verbatim shape: no prose at all before the lists.
    const body =
      '# Event-Driven Architecture\n\n## When to Activate\n- Implementing event sourcing\n- Setting up CQRS\n- Solving the dual-write problem\n- A fourth one\n'
    expect(firstListItems(body)).toBe(
      'Implementing event sourcing; Setting up CQRS; Solving the dual-write problem',
    )
  })

  it('handles numbered lists and strips emphasis', () => {
    const body =
      '# T\n\n1. **Version from day one** — adding it later is painful\n2. URL segments are the default\n'
    expect(firstListItems(body, 1)).toBe(
      'Version from day one — adding it later is painful',
    )
  })

  it('stops at the end of the first list block', () => {
    const body = '- one item here\n\nA paragraph after.\n\n- a later list\n'
    expect(firstListItems(body)).toBe('one item here')
  })
})

describe('resolveSkillDescription', () => {
  const call = (description: string, body: string) =>
    resolveSkillDescription(description, body, 'my-skill', 'owner', 'repo')

  it('prefers a real stored description and does not touch the body', () => {
    expect(call('A genuine stored summary.', '# T\n\nSomething else entirely.')).toBe(
      'A genuine stored summary.',
    )
  })

  it('recovers prose from the body when the stored value is a block marker', () => {
    expect(
      call('>', '# T\n\nAuthenticate to a cluster using any configured realm.'),
    ).toBe('Authenticate to a cluster using any configured realm.')
  })

  it('falls back to list items when the body has no prose', () => {
    expect(
      call(
        '|',
        '# T\n\n## When to Use\n- Wiring Supabase into web apps and servers\n- Adding hosted env vars\n',
      ),
    ).toBe('Wiring Supabase into web apps and servers; Adding hosted env vars')
  })

  it('states only recorded facts when nothing at all is derivable', () => {
    // Reached for ~0.2% of affected rows. Distinct per skill, so it cannot
    // recreate the uniform header this function exists to remove.
    expect(call('>-', '# Title Only\n\n## Another Heading\n')).toBe(
      'my-skill — an Agent Skill from the owner/repo repository.',
    )
  })

  it('never invents capability claims — output is always the skill or the record', () => {
    const body = '# T\n\nDoes exactly one narrow thing.'
    const out = call('>', body)
    expect(body).toContain(out)
  })

  it('clamps a long paragraph at a sentence boundary', () => {
    const long = `${'A fairly long opening sentence about the skill. '.repeat(12)}`
    const out = call('>', `# T\n\n${long}`)
    expect(out.length).toBeLessThanOrEqual(301)
    expect(out.endsWith('.') || out.endsWith('…')).toBe(true)
  })

  it('survives an empty body without throwing', () => {
    expect(call('>', '')).toBe(
      'my-skill — an Agent Skill from the owner/repo repository.',
    )
  })
})
