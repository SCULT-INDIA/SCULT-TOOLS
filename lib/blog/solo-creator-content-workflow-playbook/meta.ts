import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'solo-creator-content-workflow-playbook'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'A Solo Content Creator Workflow: One Piece, Three Platforms',
  h1: 'Write once, publish everywhere — without three separate rewrite sessions',
  targetKeyword: 'solo content creator workflow ai',
  description:
    'A blog post, a YouTube script and a LinkedIn post from one core idea — a real repurposing workflow for a solo creator using free prompts across three formats.',
  dek: 'A solo creator does not have time to write three completely separate pieces of content for three platforms. This is the actual workflow for getting genuine mileage from one core idea.',
  sections: [
    {
      heading: 'Step 1: the blog post, search-intent-driven',
      body: [
        [
          'Start with a ',
          {
            text: 'search-intent-driven outline',
            href: '/prompts/blog-writing/blog-writing-search-intent-outline',
          },
          ' — this becomes the canonical, most complete version of the idea, and everything else derives from it rather than being written independently from scratch.',
        ],
      ],
    },
    {
      heading: 'Step 2: a YouTube script from the same idea',
      body: [
        [
          'Reshape the core argument into a ',
          {
            text: 'retention-structured script',
            href: '/prompts/youtube/youtube-retention-structured-long-form-script',
          },
          ' — video rewards a completely different pacing than a blog post, so this is a genuine rewrite, not a read-aloud of the article.',
        ],
      ],
    },
    {
      heading: 'Step 3: LinkedIn, in a genuinely different register',
      body: [
        [
          'Repurpose the same idea into ',
          {
            text: 'a LinkedIn post',
            href: '/prompts/linkedin/linkedin-repurpose-blog-post-into-post',
          },
          ' — a real hook in the first line, since LinkedIn truncates after two, and a personal framing rather than the more formal register a blog post can sustain.',
        ],
      ],
    },
    {
      heading: 'Step 4: check every format against its own limits',
      body: [
        [
          'Run each version through the ',
          { text: 'Word Counter', href: '/productivity/word-counter' },
          " before publishing — the platform badges confirm a LinkedIn post's first line actually fits the truncation point, and a meta description fits its real character limit.",
        ],
      ],
    },
    {
      heading: 'Step 5: edit out the AI-flavoured filler',
      body: [
        [
          'Run a final ',
          {
            text: 'AI-filler edit pass',
            href: '/prompts/blog-writing/blog-writing-cut-ai-filler-edit-pass',
          },
          ' on all three before publishing — the single highest-leverage edit for making generated content read as genuinely yours.',
        ],
      ],
    },
    {
      heading: 'What this workflow does not solve',
      body: [
        [
          'This gets one idea into three formats efficiently. It does not decide which ideas are worth this treatment in the first place, or build a full content calendar — ',
          {
            text: "that's where Scult's content team's ongoing strategy work picks up",
            href: SERVICE.href,
            external: true,
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Scale this workflow into a real calendar',
      body: [
        [
          'Want help building a genuine content calendar rather than doing this idea by idea? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: ['word-counter'],
  relatedPrompts: [
    'blog-writing-search-intent-outline',
    'youtube-retention-structured-long-form-script',
  ],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
