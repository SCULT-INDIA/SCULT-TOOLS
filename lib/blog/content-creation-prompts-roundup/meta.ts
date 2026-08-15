import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'content-creation-prompts-roundup'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'Content Creation Prompts: YouTube, Blogs, and Everyday Writing',
  h1: 'Three content prompt libraries, each written for a genuinely different format',
  targetKeyword: 'ai content creation prompts',
  description:
    'YouTube scripts with real retention structure, blog outlines driven by search intent, and everyday writing prompts — three libraries, three genuinely different production loops.',
  dek: "This site's content libraries are deliberately format-specific rather than one generic 'write content' prompt, because YouTube retention mechanics, blog SEO structure, and a cover letter each reward completely different things.",
  sections: [
    {
      heading: 'YouTube: retention structure across the full production loop',
      body: [
        [
          'The ',
          { text: 'YouTube library', href: '/prompts/youtube' },
          ' covers the full loop — cold-open hooks for the first 15 seconds, retention-structured scripts, title and thumbnail concepting, chapter timestamps, and diagnosing exactly where a retention graph drops.',
        ],
      ],
    },
    {
      heading: 'Blog Writing: outlines driven by search intent, not guesswork',
      body: [
        [
          'The ',
          { text: 'Blog Writing library', href: '/prompts/blog-writing' },
          ' starts from search intent rather than a generic topic brainstorm, through to the single highest-leverage edit — cutting AI-flavoured filler — and format-specific prompts for listicles, how-tos and case studies.',
        ],
      ],
    },
    {
      heading: 'Everyday Writing: the writing almost everyone has to do',
      body: [
        [
          'The ',
          { text: 'Everyday Writing library', href: '/prompts/writing' },
          ' covers cover letters, cold outreach, resume bullets and difficult-conversation scripts — high-volume, practical writing tasks included for breadth rather than as a growth bet.',
        ],
      ],
    },
    {
      heading: 'The thin spots: Instagram and X',
      body: [
        [
          'This site does not yet have dedicated Instagram or X (Twitter) prompt libraries — both are currently empty, worth stating rather than pretending otherwise. LinkedIn, covered in the marketing prompt roundup, is the one social platform with real depth here today.',
        ],
      ],
    },
    {
      heading: 'Checking the result before publishing',
      body: [
        [
          'Whatever the format, run the draft through the ',
          { text: 'Word Counter', href: '/productivity/word-counter' },
          ' to confirm it fits its actual destination before it goes out.',
        ],
      ],
    },
    {
      heading: 'When content needs a real, ongoing strategy',
      body: [
        [
          'Individual scripts and posts help individual pieces of content. A coordinated content programme across formats is bigger, ongoing work. ',
          {
            text: "That's exactly what Scult's content team runs",
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
  relatedPrompts: [
    'blog-writing-search-intent-outline',
    'youtube-cold-open-hook-first-15-seconds',
  ],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 10,
}
