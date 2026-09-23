import { describe, expect, it } from 'vitest'
import { parseSkillMd } from './skill-md-parser'

describe('parseSkillMd', () => {
  it("parses a normal quoted frontmatter, matching this site's own export shape", () => {
    const raw = [
      '---',
      'name: "deploy-checklist"',
      'description: "Pre-deploy checks for a Next.js app"',
      'license: "MIT"',
      '---',
      '',
      '# Deploy Checklist',
      '',
      '1. Run the tests.',
    ].join('\n')
    const result = parseSkillMd(raw)
    expect(result).toEqual({
      ok: true,
      value: {
        name: 'deploy-checklist',
        description: 'Pre-deploy checks for a Next.js app',
        license: 'MIT',
        body: '# Deploy Checklist\n\n1. Run the tests.',
      },
    })
  })

  it('parses bare, unquoted scalar values', () => {
    const raw = '---\nname: my-skill\ndescription: Does a thing\n---\nBody.'
    const result = parseSkillMd(raw)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.name).toBe('my-skill')
      expect(result.value.description).toBe('Does a thing')
    }
  })

  it('unescapes \\" and \\\\ inside a double-quoted scalar', () => {
    const raw = '---\nname: "a \\"quoted\\" word, and a \\\\backslash"\n---\nBody.'
    const result = parseSkillMd(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.name).toBe('a "quoted" word, and a \\backslash')
  })

  it('parses a folded (>) block scalar description across indented lines, joined with spaces', () => {
    const raw = [
      '---',
      'name: x',
      'description: >',
      '  Line one',
      '  line two',
      '---',
      'Body.',
    ].join('\n')
    const result = parseSkillMd(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.description).toBe('Line one line two')
  })

  it('parses a literal (|) block scalar, preserving its own newlines', () => {
    const raw = [
      '---',
      'name: x',
      'description: |',
      '  Line one',
      '  line two',
      '---',
      'Body.',
    ].join('\n')
    const result = parseSkillMd(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.description).toBe('Line one\nline two')
  })

  it('produces undefined description for a bare, contentless block-scalar indicator — the exact 19.9% upstream bug this parser exists to survive', () => {
    const raw = '---\nname: x\ndescription: >\n---\nBody.'
    const result = parseSkillMd(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.description).toBeUndefined()
  })

  it('ignores a frontmatter field this app does not read, without erroring', () => {
    const raw = '---\nname: x\nallowed-tools: ["Read", "Write"]\n---\nBody.'
    const result = parseSkillMd(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.name).toBe('x')
  })

  it('strips a leading BOM and normalises CRLF before parsing', () => {
    const raw = `﻿---\r\nname: x\r\n---\r\nBody line.`
    const result = parseSkillMd(raw)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.name).toBe('x')
      expect(result.value.body).toBe('Body line.')
    }
  })

  it('rejects a file with no frontmatter at all', () => {
    const result = parseSkillMd('# Just a heading\n\nSome text.')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain('No YAML frontmatter')
  })

  it('rejects frontmatter that is never closed', () => {
    const result = parseSkillMd('---\nname: x\n\n# Body with no closing fence')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain('never closed')
  })

  it('rejects frontmatter with no usable name field', () => {
    const result = parseSkillMd('---\ndescription: "no name here"\n---\nBody.')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain('name')
  })

  it('rejects a name that is only a block-scalar indicator with no text', () => {
    const result = parseSkillMd('---\nname: >\n---\nBody.')
    expect(result.ok).toBe(false)
  })

  it('license is undefined, not an empty string, when absent', () => {
    const result = parseSkillMd('---\nname: x\n---\nBody.')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.license).toBeUndefined()
  })

  it('trims the body and tolerates an empty body', () => {
    const result = parseSkillMd('---\nname: x\n---\n   \n')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.body).toBe('')
  })
})
