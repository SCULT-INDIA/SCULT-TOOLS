import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'word-counter',
  category: 'productivity',
  title: 'Word Counter — Words, Characters & Reading Time',
  h1: 'Word Counter',
  description:
    'Count words, characters, sentences and reading time live as you type. Unicode-accurate counts, keyword density and platform limits, all in your browser.',
  tagline: 'Live word, character and reading-time counts that never leave your browser.',
  keywords: [
    'word counter',
    'character counter',
    'count words online',
    'reading time calculator',
    'keyword density checker',
  ],
  related: [
    'slogan-generator',
    'faq-schema-generator',
    'email-signature-generator',
    'ai-visibility-checker',
  ],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'C',
  updatedAt: '2026-07-29',
  owner: 'scult-content',
  icon: 'Type',
  runsInBrowser: true,
  howToUse: [
    'Type or paste your text — every count updates on each keystroke.',
    'Watch the platform badges to see how many characters you have left for an X post, meta title, meta description or LinkedIn post.',
    'Toggle keyword density between single words and two-word phrases to spot over-used terms.',
    'Set an optional word goal to track progress toward a target length.',
  ],
  howItWorks:
    "Words and sentences are segmented with Intl.Segmenter, the browser's implementation of the Unicode UAX #29 text-segmentation standard, instead of a naive split on spaces. That is why \"don't\" counts as one word rather than two, why Chinese or Japanese text with no spaces between words still gets a real word count, and why an emoji made of several code points still counts as one character — characters are counted as grapheme clusters, not UTF-16 code units (in raw JavaScript, '👍'.length is 2). Reading time divides the word count by 238 words per minute, the average adult silent-reading rate from Brysbaert's 2019 meta-analysis of 190 reading studies; speaking time uses 130 wpm, a typical conversational pace. Keyword density tokenises the text, drops around 170 English stopwords plus any term under three characters, and reports each remaining term's count and share of all words. Everything runs in an O(n) pass in your browser — nothing is uploaded.",
  limitations: [
    'Reading time is a population average. 238 wpm applies to non-technical prose read silently; technical, legal or unfamiliar material reads meaningfully slower, and skimming is faster.',
    'Keyword density is a diagnostic signal, not an SEO target. Writing toward a specific percentage is keyword stuffing, which modern search engines penalise rather than reward.',
    'The X badge counts characters the way this page does. X itself counts every URL as 23 characters and weights some scripts as two, so treat 280 here as a close approximation.',
    'The stopword list is English-only, so keyword density for other languages will include function words.',
  ],
  faq: [
    {
      q: 'How does this tool count words?',
      a: 'With Intl.Segmenter, which applies the Unicode word-boundary rules (UAX #29). Contractions like "don\'t" count as one word, and languages written without spaces, such as Chinese and Japanese, are segmented into real words instead of being counted as one long token.',
    },
    {
      q: 'Why does an emoji count as one character?',
      a: "Characters are counted as grapheme clusters — what a reader perceives as one symbol. A family emoji is built from several code points joined invisibly, so JavaScript's .length reports 8 or more, but you see one character and this counter agrees with you.",
    },
    {
      q: 'How accurate is the reading time?',
      a: 'It uses 238 words per minute, the average adult silent-reading rate found by a 2019 meta-analysis of 190 studies. Your real audience varies: dense technical content can drop below 150 wpm, while skimming runs far faster. Treat it as a solid estimate, not a stopwatch.',
    },
    {
      q: 'Is my text uploaded to a server?',
      a: 'No. Counting, density and every other stat are computed in your browser. The autosaved draft lives in this browser’s localStorage on your device, and the Clear button removes it.',
    },
    {
      q: 'What keyword density should I aim for?',
      a: 'There is no magic percentage. Use the table to spot accidental repetition and confirm the topic you meant to write about actually dominates — then stop. Optimising toward a density number is keyword stuffing, which hurts more than it helps.',
    },
  ],
}
