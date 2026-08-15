import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'geo-aeo-tools-roundup'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'GEO/AEO Tools in 2026: Why Most Sites Have Never Checked This',
  h1: 'Most sites have never checked whether AI crawlers can even read them',
  targetKeyword: 'geo aeo tools 2026',
  description:
    'The AI Visibility Checker tests ten named AI crawlers and five weighted checks — the specific, checkable foundation of GEO/AEO most sites have never actually audited.',
  dek: 'GEO and AEO are treated as a vague new discipline in most content about them. This is the one thing about it that is genuinely checkable, right now, for free.',
  sections: [
    {
      heading: 'Why this category exists as its own thing',
      body: [
        [
          "Generative Engine Optimization and Answer Engine Optimization get discussed abstractly — 'be more citable,' 'structure content for AI' — without a concrete, checkable starting point. The ",
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' is that starting point: ten named AI crawlers checked individually, five weighted scoring categories, a real 0-100 number with the specific fix behind every finding.',
        ],
      ],
    },
    {
      heading: 'What the score actually measures',
      body: [
        [
          'Crawler access (40 of 100 points, weighted heaviest since a blocked crawler makes everything else irrelevant), structured data (20), on-page basics (20), llms.txt (10), and sitemap declaration (10). Bands run 80-100 AI-visible, 50-79 partially visible, 0-49 mostly invisible.',
        ],
      ],
    },
    {
      heading: 'The most common finding: an accidental robots.txt mistake',
      body: [
        [
          'The single most frequent issue this checker surfaces is a robots.txt precedence mistake — a bot-specific Disallow rule that the site owner assumed was overridden by a permissive wildcard, when the specific rule always wins regardless of which one looks more generous.',
        ],
      ],
    },
    {
      heading: 'Fixing what the checker finds, free',
      body: [
        [
          'For the structured-data check, the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ' generates the identity-level Organization, WebSite, LocalBusiness or Person block the check looks for on a homepage. For robots.txt and llms.txt, the ',
          {
            text: 'AI search visibility checklist',
            href: '/guides/ai-search-visibility-checklist',
          },
          ' walks through every fix in the order it matters.',
        ],
      ],
    },
    {
      heading: 'Where a single check stops being enough',
      body: [
        [
          "A one-time check tells you what is broken right now. It does not track citation share over time, monitor competitors, or architect a content strategy aimed at AI citation across a full site. That's where ",
          { text: "Scult's AI agents team", href: SERVICE.href, external: true },
          ' picks up.',
        ],
      ],
    },
    {
      heading: 'Run the check',
      body: [
        [
          'It takes a few seconds, free, no signup. ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          ' if the result raises questions worth a real conversation.',
        ],
      ],
    },
  ],
  relatedTools: ['ai-visibility-checker', 'schema-markup-generator'],
  relatedPrompts: ['seo-geo-ai-crawler-access-audit'],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 10,
}
