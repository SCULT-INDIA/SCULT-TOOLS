import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'word-counter-guide'
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)

/**
 * Every claim checked against lib/tools/word-counter/meta.ts — the exact
 * Intl.Segmenter grapheme-cluster mechanism, the real 238/130 wpm reading/
 * speaking constants, and the stated keyword-density diagnostic framing.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Word Counter: Why Your Character Count Is Probably Wrong',
  h1: 'Why does an emoji count as one character here, but eight in your code editor?',
  targetKeyword: 'word counter',
  description:
    'Live word, character, sentence and reading-time counts, built on Unicode grapheme clusters instead of naive counting — so emoji and multi-script text count the way you actually perceive them.',
  dek: 'Most character counters report a number that technically matches what JavaScript sees under the hood, not what a person actually perceives as one character. That gap matters the moment your text includes an emoji, a contraction, or a language written without spaces.',
  sections: [
    {
      heading: 'Why .length lies about how many characters you typed',
      body: [
        [
          "Type a single family emoji into a text field and ask JavaScript's built-in .length property how many characters it contains, and you will get 8 or more — because that one visual symbol is actually built from several separate Unicode code points joined together invisibly behind the scenes (individual person emoji plus invisible joining characters). A naive character counter that just reads .length reports that inflated number, even though a human looking at the screen sees exactly one character.",
        ],
        [
          'The ',
          { text: 'Word Counter', href: '/productivity/word-counter' },
          " on this site avoids that mismatch by counting grapheme clusters instead of raw code units — using the browser's built-in Intl.Segmenter API, which applies the Unicode text-segmentation standard (UAX #29) to identify what a reader actually perceives as one character, rather than how many underlying code points a particular emoji or accented letter happens to be built from. The result: this counter agrees with what you see on screen, not with an internal representation detail most writers never need to think about.",
        ],
      ],
    },
    {
      heading: 'The same fix solves word counting for languages written without spaces',
      body: [
        [
          'The identical Intl.Segmenter mechanism handles word counting correctly for languages like Chinese and Japanese, which are written without spaces between words at all. A word counter that simply splits text on whitespace — the naive approach most quick implementations use — would count an entire Chinese sentence as a single, enormous "word," since there are no spaces to split on. Real Unicode word-boundary segmentation instead identifies actual word boundaries within the script itself, so those languages get accurate word counts rather than one meaningless giant token.',
        ],
        [
          'Contractions in English benefit from the same correct segmentation in the other direction: "don\'t" counts as one word, not two, because Unicode word-boundary rules correctly treat the apostrophe as part of a single word rather than a word separator — a small but real distinction a naive split-on-punctuation approach would get wrong.',
        ],
      ],
    },
    {
      heading:
        'The reading-time and speaking-time numbers, and where they actually come from',
      body: [
        [
          'Reading time uses 238 words per minute, sourced from a genuine 2019 meta-analysis of 190 separate studies on silent adult reading speed — not a rounded, invented industry rule of thumb. At that rate, 500 words takes roughly 2.1 minutes, 1,000 words roughly 4.2 minutes, and 2,000 words roughly 8.4 minutes. Speaking time uses a separate, slower figure — 130 words per minute — because reading silently and reading aloud are measurably different tasks with different natural paces; a script that reads perfectly fine on screen at 238 wpm pacing can run noticeably long once actually delivered aloud at the real, slower speaking rate.',
        ],
        [
          'Both figures are population averages, stated as such rather than a promise: dense technical writing reads measurably slower than 238 wpm for most readers, while a quick skim runs meaningfully faster. Treat the number as a solid planning estimate for a talk or a reading-time badge on a blog post, not a stopwatch guarantee for any specific reader.',
        ],
      ],
    },
    {
      heading: 'Keyword density: a diagnostic, never a target to write toward',
      body: [
        [
          'Keyword density is simply how often a given word appears relative to the total word count — if "invoice" appears 12 times across a 1,000-word article, that is a 1.2% density. The tool surfaces this purely as a sanity check, not a number to optimise toward: density running unusually high starts to read like keyword stuffing and can look manipulative to search engines evaluating the same page, while density running unusually low might mean the piece never actually settles into covering the topic it was meant to address in the first place.',
        ],
        [
          'There is no magic target percentage, and writing to hit one is close to the definition of keyword stuffing — a practice that measurably hurts more than it helps in modern search evaluation. Use the density table to spot an accidentally over-used word and confirm the intended topic genuinely dominates the piece, then stop checking the number and trust the read.',
        ],
      ],
    },
    {
      heading: 'Everyday uses this counter actually earns its place for',
      body: [
        [
          "Hitting a hard word target for an assignment or a commissioned article, where a client or instructor specifies an exact count rather than a rough range. Estimating reading or speaking time for a blog post, script, or presentation before committing to publishing or delivering it, so you know in advance whether it runs long. Checking a meta description or a social post against a real platform character limit — the platform-specific badges (X post, meta title, meta description, LinkedIn post) show exactly how much room remains as you type, rather than requiring a separate lookup of each platform's actual limit. And spotting an accidentally over-used word through the live density readout before an editor or a reader notices it first.",
        ],
      ],
    },
    {
      heading: 'Worked example: fitting a meta description to its real limit',
      body: [
        [
          'Draft a meta description directly in the counter and watch the meta-description platform badge specifically — it counts down in real time as you type, showing exactly how many characters remain before Google is likely to truncate the snippet in search results. Trim toward that live number rather than guessing at a round figure like "under 160 characters" and hoping it fits; the badge is checking your actual draft, not an approximation.',
        ],
        [
          'For a title tag specifically, pair this with the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' — the on-page-basics check that tool scores looks for exactly this kind of correctly-sized title and description, so getting the length right here directly improves that separate score too.',
        ],
      ],
    },
    {
      heading: 'Privacy: your draft never leaves your browser',
      body: [
        [
          "Every count — words, characters, sentences, density, reading time — computes entirely client-side as you type, with nothing transmitted to a server. An autosaved draft lives in this browser's own local storage on your device specifically so you do not lose work on refresh, and the Clear button removes it completely whenever you choose. There is no practical size limit either — paste a full article or a long script and it counts instantly, since the computation runs against your own device's resources rather than a server-side cap that a hosted API might otherwise impose.",
        ],
      ],
    },
    {
      heading: 'When word count is the smallest part of a content problem',
      body: [
        [
          "Hitting a target length and fitting a platform's character limit are mechanical problems this tool solves completely. Whether the content itself is actually good — whether it targets the right keyword, answers the search intent behind it, and earns a share of an increasingly AI-mediated search result — is a separate, harder question a counter cannot answer for you.",
        ],
        [
          'If content strategy at scale — not just individual pieces, but a coordinated plan across many pages — is the real gap, ',
          {
            text: "that's the work Scult's SEO and content team does",
            href: SERVICE.href,
            external: true,
          },
          '.',
        ],
        [
          'Want a second opinion on your content plan? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " and bring what you're currently working on.",
        ],
      ],
    },
  ],
  relatedTools: [
    'word-counter',
    'slogan-generator',
    'faq-schema-generator',
    'ai-visibility-checker',
  ],
  relatedPrompts: ['seo-geo-meta-title-description-ctr'],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
