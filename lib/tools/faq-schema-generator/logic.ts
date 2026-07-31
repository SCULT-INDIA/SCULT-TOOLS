/**
 * FAQPage JSON-LD construction.
 *
 * Purpose
 *   Turn a list of question/answer pairs into the three things an FAQ page
 *   needs: a schema.org FAQPage object, a script-tag-safe JSON-LD string, and
 *   a visible HTML block (Google's guidelines require the marked-up Q&A to
 *   actually appear on the page — schema alone is a guideline violation).
 *
 * Inputs   an ordered array of { question, answer } pairs as free text. Rows
 *          arrive mid-edit on every keystroke, so blank and half-filled rows
 *          are the normal case, never an error.
 * Outputs  a FaqSchemaResult: the structured jsonLd object, its serialised
 *          `json` string (with `<` escaped as a unicode sequence so it can
 *          never terminate an enclosing script element), an `html` string combining a
 *          semantic details/summary FAQ block with the JSON-LD script tag, and
 *          advisory `warnings`.
 * Failure  never throws. Fully-empty rows are skipped silently; half-filled
 *          rows are left out with a warning naming the row.
 *
 * No React, no I/O — pure functions, unit-tested in logic.test.ts.
 */

export interface FaqPair {
  readonly question: string
  readonly answer: string
}

export interface FaqQuestionSchema {
  readonly '@type': 'Question'
  readonly name: string
  readonly acceptedAnswer: {
    readonly '@type': 'Answer'
    readonly text: string
  }
}

export interface FaqPageSchema {
  readonly '@context': 'https://schema.org'
  readonly '@type': 'FAQPage'
  readonly mainEntity: readonly FaqQuestionSchema[]
}

export interface FaqSchemaResult {
  /** The FAQPage object itself, for programmatic use and the live preview. */
  readonly jsonLd: FaqPageSchema
  /**
   * `jsonLd` serialised with 2-space indentation. Every `<` is escaped as
   * the six-character unicode sequence backslash-u003c, which is still valid
   * JSON but cannot form a closing script tag — so pasting this inside a
   * script element is safe even when an answer contains HTML.
   */
  readonly json: string
  /**
   * A visible, semantic details/summary FAQ block followed by the JSON-LD
   * script tag. All user text is HTML-escaped. Empty when no pair is complete.
   */
  readonly html: string
  readonly warnings: readonly string[]
}

/**
 * Google truncates FAQ rich-result answers at roughly this length; anything
 * beyond it is invisible in the SERP even though it stays in the markup.
 */
export const ANSWER_SOFT_LIMIT = 1200

/**
 * Escapes the five HTML-significant characters so user text can be embedded
 * in the generated markup without becoming markup itself.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * The comparison key for duplicate detection: whitespace runs collapse to one
 * space, edges are trimmed, and case is folded — "What is  SEO?" and
 * " what is seo? " are the same question to Google and to this check.
 */
function questionKey(question: string): string {
  return question.trim().replace(/\s+/g, ' ').toLowerCase()
}

/** Shortens a question for use inside a warning message. */
function truncateForWarning(question: string): string {
  const clean = question.trim().replace(/\s+/g, ' ')
  return clean.length > 60 ? `${clean.slice(0, 57)}…` : clean
}

/**
 * Renders one answer as escaped HTML paragraphs: blank lines split
 * paragraphs, single newlines become <br /> within one.
 */
function answerToHtml(answer: string): string {
  return answer
    .split(/\n{2,}/)
    .map((paragraph) => `      <p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}

interface IncludedPair {
  readonly question: string
  readonly answer: string
  /** 1-based row number as shown on screen, for warning messages. */
  readonly row: number
}

/**
 * Builds the FAQPage schema and its two paste-ready serialisations.
 *
 * Inclusion rules, in order:
 *   - a row whose question AND answer are blank is skipped silently (it is
 *     just an unused form row);
 *   - a row missing one side is left out with a warning naming the row, so a
 *     half-typed pair never ships an empty `name` or `text`;
 *   - everything else is included with question and answer trimmed.
 *
 * Warnings are advisory, never blocking: duplicates (case- and
 * whitespace-insensitive), fewer than two complete pairs, and answers past
 * ANSWER_SOFT_LIMIT are all flagged but the schema is still generated, because
 * the user is usually mid-edit.
 */
export function buildFaqSchema(pairs: readonly FaqPair[]): FaqSchemaResult {
  const warnings: string[] = []
  const included: IncludedPair[] = []

  pairs.forEach((pair, index) => {
    const question = pair.question.trim()
    const answer = pair.answer.trim()
    const row = index + 1

    if (question === '' && answer === '') return
    if (question === '') {
      warnings.push(`Question ${row} is empty, so that row was left out of the schema.`)
      return
    }
    if (answer === '') {
      warnings.push(
        `Question ${row} ("${truncateForWarning(question)}") has no answer yet, so it was left out of the schema.`,
      )
      return
    }

    if (answer.length > ANSWER_SOFT_LIMIT) {
      warnings.push(
        `Question ${row}'s answer is ${answer.length.toLocaleString('en-IN')} characters — Google truncates FAQ rich-result answers around ${ANSWER_SOFT_LIMIT.toLocaleString('en-IN')}, so the tail may never be seen.`,
      )
    }

    included.push({ question, answer, row })
  })

  // Duplicate detection groups by the folded key so "What is SEO?" and
  // " what is  seo? " collide. All copies stay in the output (the user is
  // often mid-edit), but the warning names every row involved.
  const byKey = new Map<string, IncludedPair[]>()
  for (const pair of included) {
    const key = questionKey(pair.question)
    const group = byKey.get(key)
    if (group) {
      group.push(pair)
    } else {
      byKey.set(key, [pair])
    }
  }
  for (const group of byKey.values()) {
    const first = group[0]
    if (group.length > 1 && first !== undefined) {
      warnings.push(
        `Questions ${group.map((p) => p.row).join(' and ')} are the same question ("${truncateForWarning(first.question)}"). Merge them — Google treats duplicates as one entry at best.`,
      )
    }
  }

  if (included.length === 1) {
    warnings.push(
      'Only one complete Q&A pair. An FAQ page should carry at least two questions — a single pair is better marked up as a regular page.',
    )
  }

  const jsonLd: FaqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: included.map((pair) => ({
      '@type': 'Question',
      name: pair.question,
      acceptedAnswer: { '@type': 'Answer', text: pair.answer },
    })),
  }

  // The escaped form parses back to '<' (JSON.parse round-trips it exactly)
  // but the raw string can no longer contain a closing script tag, so the
  // output is safe to embed in a script element verbatim.
  const json = JSON.stringify(jsonLd, null, 2).replace(/</g, '\\u003c')

  const html =
    included.length === 0
      ? ''
      : [
          '<!-- Visible FAQ block — Google requires the marked-up Q&A to appear on the page -->',
          '<section class="faq">',
          '  <h2>Frequently asked questions</h2>',
          ...included.map((pair) =>
            [
              '  <details>',
              `    <summary>${escapeHtml(pair.question)}</summary>`,
              answerToHtml(pair.answer),
              '  </details>',
            ].join('\n'),
          ),
          '</section>',
          '',
          '<script type="application/ld+json">',
          json,
          '</script>',
        ].join('\n')

  return { jsonLd, json, html, warnings }
}
