import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'blog-writing-prompts-guide'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/blog-writing/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Blog Writing Prompts: Outlines Driven by Search Intent, Not Guesswork',
  h1: 'Most AI blog drafts sound like AI because the outline never had a point of view',
  targetKeyword: 'blog writing prompts',
  description:
    'Outline, draft and editing prompts for long-form posts worth publishing — driven by real search intent, with a genuine point of view, and an editing pass that cuts the AI-flavored filler.',
  dek: 'A blog post that reads as generically AI-written usually failed at the outline stage, not the sentence-writing stage — no real point of view, no actual search intent behind the structure, just a generic list of subheadings.',
  sections: [
    {
      heading: 'Why the outline decides whether a post reads as AI-flavoured',
      body: [
        [
          'Long-form content that reads as obviously AI-generated usually has a structural problem, not a sentence-level one — a generic outline produces generic prose no matter how the actual sentences are polished afterward. The ',
          { text: 'Blog Writing prompt library', href: '/prompts/blog-writing' },
          ' starts from search intent specifically, not a generic "write an outline about X" request.',
        ],
        [
          'The foundational prompt, ',
          {
            text: 'a search-intent-driven outline',
            href: '/prompts/blog-writing/blog-writing-search-intent-outline',
          },
          ', builds structure from what someone actually wants when they search a term, rather than a topic-brainstorm list of subheadings that sounds plausible but was never grounded in real intent.',
        ],
      ],
    },
    {
      heading: 'From brief to full draft, and the editing pass that matters most',
      body: [
        [
          'A ',
          {
            text: 'content brief written for a human writer',
            href: '/prompts/blog-writing/blog-writing-content-brief-for-writer',
          },
          ' hands off structure and intent clearly rather than a vague topic assignment. Generating ',
          {
            text: 'a full draft from an outline',
            href: '/prompts/blog-writing/blog-writing-full-draft-from-outline',
          },
          ' works far better once that outline already has a real point of view baked in. And the single highest-leverage edit — ',
          {
            text: 'cutting AI-flavored filler',
            href: '/prompts/blog-writing/blog-writing-cut-ai-filler-edit-pass',
          },
          ' — strips the hedging phrases and empty transitions that are the actual tell, more than any individual word choice.',
        ],
      ],
    },
    {
      heading: 'Hooks, headlines and CTAs: the parts that decide if anyone reads on',
      body: [
        [
          'A headline built around real click-through mechanics — ',
          {
            text: 'this prompt',
            href: '/prompts/blog-writing/blog-writing-headline-ctr-mechanics',
          },
          ' — beats a headline that just describes the topic. A genuine ',
          {
            text: 'hook introduction',
            href: '/prompts/blog-writing/blog-writing-hook-introduction',
          },
          ' earns the next paragraph rather than starting with throat-clearing, and a ',
          {
            text: 'CTA conclusion',
            href: '/prompts/blog-writing/blog-writing-cta-conclusion',
          },
          ' that actually converts closes with a specific next step, not a vague "in conclusion" summary.',
        ],
      ],
    },
    {
      heading: 'Competitive gap analysis before writing a word',
      body: [
        [
          'A ',
          {
            text: 'SERP competitor gap analysis',
            href: '/prompts/blog-writing/blog-writing-serp-competitor-gap-analysis',
          },
          ' finds what is actually missing from what already ranks, so a new post adds something genuinely new rather than restating what ten other pages already say.',
        ],
      ],
    },
    {
      heading: 'Format-specific prompts: listicles, how-tos, case studies, FAQs',
      body: [
        [
          'A listicle with real differentiation — ',
          {
            text: 'this prompt',
            href: '/prompts/blog-writing/blog-writing-listicle-real-differentiation',
          },
          ' — avoids the generic ten-items-everyone-else-lists problem. A how-to tutorial with verification built in — ',
          {
            text: 'covered here',
            href: '/prompts/blog-writing/blog-writing-how-to-tutorial-verification',
          },
          ' — checks the steps actually work before publishing them. A ',
          {
            text: 'case study built from interview notes',
            href: '/prompts/blog-writing/blog-writing-case-study-from-interview-notes',
          },
          ' turns raw conversation into a real narrative, and an ',
          {
            text: 'FAQ section built from real questions',
            href: '/prompts/blog-writing/blog-writing-faq-section-real-questions',
          },
          ' — actual questions people ask, not invented ones — pairs directly with the ',
          { text: 'FAQ Schema Generator', href: '/seo/faq-schema-generator' },
          ' once the content is finalised.',
        ],
      ],
    },
    {
      heading: 'Repurposing and content maintenance',
      body: [
        [
          'Turning a raw ',
          {
            text: 'transcript into a post',
            href: '/prompts/blog-writing/blog-writing-transcript-to-post',
          },
          ' reuses existing recorded content rather than starting from a blank page. And ',
          {
            text: 'refreshing an underperforming post',
            href: '/prompts/blog-writing/blog-writing-refresh-underperforming-post',
          },
          ' — with a proper meta title and description CTR pass alongside it, covered by ',
          {
            text: 'this prompt',
            href: '/prompts/blog-writing/blog-writing-meta-title-description-ctr',
          },
          ' — often outperforms writing something entirely new, since the page already has some accumulated authority to build on.',
        ],
      ],
    },
    {
      heading: 'When content needs to be part of a real SEO strategy',
      body: [
        [
          'Individual posts benefit from these prompts. Deciding which topics deserve investment, how content clusters together, and whether it is actually earning traffic and citations over time is a bigger, ongoing strategy question. ',
          {
            text: "That's exactly what Scult's SEO and content team does",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your content plan.',
        ],
      ],
    },
  ],
  relatedTools: ['faq-schema-generator', 'word-counter', 'ai-visibility-checker'],
  relatedPrompts: [
    'blog-writing-search-intent-outline',
    'blog-writing-cut-ai-filler-edit-pass',
  ],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
