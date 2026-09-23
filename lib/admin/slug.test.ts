import { describe, expect, it } from 'vitest'
import { isValidSlugShape, slugify } from './slug'

describe('slugify', () => {
  it('lowercases and hyphenates a normal title', () => {
    expect(slugify('Ultimate Resume Audit Prompt')).toBe('ultimate-resume-audit-prompt')
  })

  it('strips accents rather than dropping the letter entirely', () => {
    expect(slugify('Café Résumé Café')).toBe('cafe-resume-cafe')
  })

  it('collapses punctuation and symbols into single hyphens', () => {
    expect(slugify('Resume Audit — v2.0 (Final!)')).toBe('resume-audit-v2-0-final')
  })

  it('collapses a run of separators into one hyphen, not several', () => {
    expect(slugify('Too   Many---Spaces')).toBe('too-many-spaces')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('--Leading and trailing--')).toBe('leading-and-trailing')
  })

  it('drops emoji and other non-ASCII symbols entirely', () => {
    expect(slugify('🚀 Launch Day 🎉')).toBe('launch-day')
  })

  it('caps length at 96 characters', () => {
    const huge = 'word '.repeat(50)
    expect(slugify(huge).length).toBeLessThanOrEqual(96)
  })

  it('produces an empty string for a title with no slug-safe characters, rather than throwing', () => {
    expect(slugify('★★★')).toBe('')
  })
})

describe('isValidSlugShape', () => {
  it('accepts a well-formed slug', () => {
    expect(isValidSlugShape('ultimate-resume-audit-prompt')).toBe(true)
    expect(isValidSlugShape('a')).toBe(true)
    expect(isValidSlugShape('a1-b2-c3')).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(isValidSlugShape('')).toBe(false)
  })

  it('rejects uppercase letters', () => {
    expect(isValidSlugShape('Resume-Audit')).toBe(false)
  })

  it('rejects a leading or trailing hyphen', () => {
    expect(isValidSlugShape('-resume-audit')).toBe(false)
    expect(isValidSlugShape('resume-audit-')).toBe(false)
  })

  it('rejects a doubled hyphen', () => {
    expect(isValidSlugShape('resume--audit')).toBe(false)
  })

  it('rejects spaces, underscores, and other punctuation', () => {
    expect(isValidSlugShape('resume audit')).toBe(false)
    expect(isValidSlugShape('resume_audit')).toBe(false)
    expect(isValidSlugShape('resume/audit')).toBe(false)
  })

  it('rejects a slug over 96 characters, even one that is otherwise well-formed', () => {
    const tooLong = 'a'.repeat(100)
    expect(isValidSlugShape(tooLong)).toBe(false)
    expect(isValidSlugShape(tooLong.slice(0, 96))).toBe(true)
  })
})
