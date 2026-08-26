import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard test (plan P9): the parent-site booking link must always be built
 * through `parentLink()` so it carries the utm_source/campaign that
 * `CtaClickTracker` keys on. A raw `scult.in/#book-meeting` string bypasses
 * attribution AND click tracking — exactly the bug that had the AI
 * Visibility Checker's booking link recorded as a dismissal.
 *
 * Rather than fix the two instances that existed and hope the next one gets
 * noticed in review, this fails the build the moment a hardcoded booking URL
 * reappears anywhere in components/ or lib/. Closes the class, not the case.
 */

const ROOTS = ['components', 'lib']
const BOOKING_URL_RE = /scult\.in\/?#book-meeting/i
const IGNORE_DIRS = new Set(['node_modules', '.next', 'dist'])

function walk(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (!IGNORE_DIRS.has(entry)) walk(full, out)
    } else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith('.test.ts')) {
      out.push(full)
    }
  }
}

describe('no hardcoded booking URL', () => {
  it('never hardcodes scult.in/#book-meeting — use parentLink() instead', () => {
    const files: string[] = []
    for (const root of ROOTS) {
      try {
        walk(root, files)
      } catch {
        // root absent in some check-outs — skip
      }
    }
    const offenders = files.filter((f) => BOOKING_URL_RE.test(readFileSync(f, 'utf8')))
    expect(
      offenders,
      `Build the booking link with parentLink('/#book-meeting', '<campaign>') instead of a raw URL in:\n${offenders.join('\n')}`,
    ).toEqual([])
  })
})
