import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'competitor-ai-visibility-audit-playbook'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Auditing a Competitor Before You Launch: SEO and AI Visibility',
  h1: "Check what you're actually up against before you launch, not after",
  targetKeyword: 'competitor audit before launch',
  description:
    "A competitor gap audit covering classic SEO and AI citation visibility — free tools and prompts to check what you're actually competing against before your own launch.",
  dek: 'Launching without checking what already ranks and what already gets cited by AI engines means discovering your real competition after launch instead of before it, when it is far cheaper to plan around.',
  sections: [
    {
      heading: 'Step 1: what already ranks, subtopic by subtopic',
      body: [
        [
          'Run a ',
          {
            text: 'competitor gap audit',
            href: '/prompts/seo-geo/seo-geo-competitor-gap-audit',
          },
          ' to find exactly what is outranking you and why, at the subtopic level — not a surface-level "they have more content" observation.',
        ],
      ],
    },
    {
      heading: 'Step 2: is your own site even crawlable for the fight ahead',
      body: [
        [
          'Run the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' on your own site before comparing against anyone else — a technical disadvantage here (a blocked crawler, missing schema) will lose the AI-citation fight regardless of how good your content ends up being.',
        ],
      ],
    },
    {
      heading: "Step 3: your competitor's AI visibility gap",
      body: [
        [
          'Audit ',
          {
            text: "a competitor's AI visibility specifically",
            href: '/prompts/seo-geo/seo-geo-competitor-ai-visibility-gap',
          },
          ' — if they are technically weak on the exact checks the AI Visibility Checker scores, that is a real, specific opening rather than a vague sense of opportunity.',
        ],
      ],
    },
    {
      heading: 'Step 4: how AI engines currently answer the query you care about',
      body: [
        [
          'Compare ',
          {
            text: 'how Google AI Overviews and Perplexity currently cite the same query',
            href: '/prompts/seo-geo/seo-geo-ai-overview-perplexity-citation-compare',
          },
          ' — this tells you whose content is currently winning the AI-citation fight for your target keyword, not just the classic search ranking.',
        ],
      ],
    },
    {
      heading: 'Step 5: build the content brief from what you learned',
      body: [
        [
          'Feed everything from the audit into a real ',
          {
            text: 'SERP-intent content brief',
            href: '/prompts/seo-geo/seo-geo-serp-intent-content-brief',
          },
          ' — the launch content should specifically address what the audit found missing, not restate what already exists.',
        ],
      ],
    },
    {
      heading: 'What a competitor audit does not do for you',
      body: [
        [
          'This tells you where the openings are. It does not execute the ongoing content and authority-building needed to actually win them — ',
          {
            text: "that's the sustained work Scult's SEO team does",
            href: SERVICE.href,
            external: true,
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Get a real read before you commit resources',
      body: [
        [
          'Want a second opinion on your competitive landscape before launch? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: ['ai-visibility-checker'],
  relatedPrompts: [
    'seo-geo-competitor-gap-audit',
    'seo-geo-competitor-ai-visibility-gap',
  ],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
