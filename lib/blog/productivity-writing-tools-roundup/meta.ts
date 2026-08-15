import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'productivity-writing-tools-roundup'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'The Writing Metrics Editors Actually Check (Free, Live, No Account)',
  h1: 'Word count, reading time, keyword density — the numbers behind every editing pass',
  targetKeyword: 'writing productivity tools free',
  description:
    'Live word, character and reading-time counts built on Unicode grapheme clusters, not naive counting — the specific numbers editors and content writers check constantly.',
  dek: 'Every writer eventually needs the same handful of numbers — word count, reading time, whether a headline fits a platform limit. This is the free tool covering all of them accurately.',
  sections: [
    {
      heading: 'One tool, four genuinely useful numbers',
      body: [
        [
          'The ',
          { text: 'Word Counter', href: '/productivity/word-counter' },
          ' covers word and character counts (built on Unicode grapheme clusters, so an emoji counts as one character, not eight), reading time (238 words per minute from a real 2019 meta-analysis), speaking time (130 wpm), and keyword density as a diagnostic — never a target to write toward.',
        ],
      ],
    },
    {
      heading: 'Platform limits, checked live',
      body: [
        [
          "Character badges for X posts, meta titles, meta descriptions and LinkedIn posts update live as you type, so a headline or a social caption fits its actual destination without a separate lookup of each platform's limit.",
        ],
      ],
    },
    {
      heading: 'Why this sits alone in its own category',
      body: [
        [
          'Word counting is genuinely its own discipline — distinct from SEO tooling, design tooling, or business paperwork — which is why this site keeps it as its own category rather than folding it into content-writing prompts. The ',
          { text: 'Blog Writing prompt library', href: '/prompts/blog-writing' },
          ' and the ',
          { text: 'Everyday Writing prompt library', href: '/prompts/writing' },
          ' cover the drafting side; this tool covers the measurement side.',
        ],
      ],
    },
    {
      heading: 'A realistic workflow: draft, measure, ship',
      body: [
        [
          "Draft with a structured prompt from the writing libraries above, then check the result against the Word Counter's platform badges before publishing — the two steps genuinely complement each other rather than overlapping.",
        ],
      ],
    },
    {
      heading: 'When measurement is not the actual bottleneck',
      body: [
        [
          'Hitting a word count and fitting a character limit are solved problems with this tool. Whether the content itself earns real traffic and citations is a separate, harder question — ',
          {
            text: "the work Scult's content team does",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your content strategy.',
        ],
      ],
    },
  ],
  relatedTools: ['word-counter', 'faq-schema-generator'],
  relatedPrompts: ['blog-writing-search-intent-outline'],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 9,
}
