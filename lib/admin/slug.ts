/**
 * Slug generation shared by prompts, skills, and custom categories — one
 * implementation rather than three near-identical ones, per §12 of the
 * plan ("automatically generate a slug from the title... admin should be
 * able to edit the slug before publishing... must prevent duplicate
 * URLs"). Uniqueness itself is enforced by each `lib/admin/*` module's own
 * DB check (a race-safe `unique index` per (category, slug) already exists
 * from migration 0007) — this module only produces the candidate string.
 */

/** "Ultimate Resume Audit Prompt" -> "ultimate-resume-audit-prompt". Also
 * strips characters a URL segment shouldn't carry so a title with an em
 * dash, a slash, or emoji still produces a clean slug rather than one
 * needing manual cleanup on every single publish. */
export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents after NFKD decomposition
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96) // generous — the longest real slug on this site today is nowhere near this, but a runaway title should never produce an unusably long URL segment
}

/** True for a non-empty string of lowercase letters, digits and single
 * hyphens, no leading/trailing/doubled hyphen — the shape every route
 * segment on this site already assumes. Used to validate a slug an admin
 * typed or edited by hand, not just one this module generated. */
export function isValidSlugShape(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length <= 96
}

/**
 * Every character that reads as "a dash" but isn't U+002D: the hyphen
 * variants macOS "smart dashes" and word processors substitute (en/em
 * dash, non-breaking hyphen, minus, figure dash, soft hyphen…).
 * 2026-09-25: an admin typing `ats-friendly-resume-audit-skill` on a Mac
 * had the form rejected with "Slug must be lowercase-hyphenated" — the
 * text carried an en dash, invisible at a glance.
 */
const DASH_LIKE = /[­‐-―−⁃﹘﹣－]/g
/** Zero-width and BOM characters a copy-paste can carry along. */
const INVISIBLE = /[​-‍⁠﻿]/g

/**
 * A slug as an admin is typing it: lowercased, dash variants and invisible
 * characters cleaned up, separators turned into hyphens, everything else
 * dropped — but leading/trailing hyphens are KEPT so typing "my-" on the
 * way to "my-skill" isn't fought character by character. `normalizeSlug`
 * is the finishing pass for blur/submit.
 */
export function normalizeSlugInput(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(INVISIBLE, '')
    .replace(DASH_LIKE, '-')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 96)
}

/** The finished form of `normalizeSlugInput`: also trims leading/trailing
 * hyphens. Every admin schema runs a submitted slug through this before
 * validating, so a slug that only LOOKED wrong (smart dash, stray space)
 * is repaired rather than rejected; one with nothing usable in it (e.g.
 * "★★★") still normalises to "" and fails `isValidSlugShape`. */
export function normalizeSlug(input: string): string {
  return normalizeSlugInput(input).replace(/^-+|-+$/g, '')
}
