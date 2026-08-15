import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'seo-service-guide'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'service',
  title: "SEO Tools vs. an SEO Team: What Free Tools Actually Can't Do",
  h1: "You've run every free SEO tool on this site. Why aren't you ranking yet?",
  targetKeyword: 'seo services for small business',
  description:
    'Free tools fix schema, speed and AI crawlability — real, measurable technical problems. What they cannot do is decide your content strategy or build authority. Here is the honest line.',
  dek: 'This site gives away genuinely useful, free SEO tools — schema generation, a real speed test, an AI crawlability audit. Running all of them and still not ranking usually means the actual bottleneck is somewhere those tools were never built to reach.',
  sections: [
    {
      heading: 'What the free tools on this site genuinely fix',
      body: [
        [
          'Each tool here solves one, real, checkable technical problem: the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ' and ',
          { text: 'FAQ Schema Generator', href: '/seo/faq-schema-generator' },
          ' produce correct structured data. The ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          ' finds real Core Web Vitals problems against real Google thresholds. The ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' confirms AI crawlers can actually reach your site. If those checks come back clean, the technical foundation genuinely is not the problem.',
        ],
      ],
    },
    {
      heading: 'Why fixing every technical issue and still not ranking is normal',
      body: [
        [
          'A technically flawless site with no content strategy, no topical authority, and no real keyword targeting will not outrank a technically mediocre site that genuinely answers what people are searching for better. Technical SEO is a floor, not a ranking strategy — it removes a disqualification, it does not manufacture rankings on its own. This is the single most common reason a small business runs every free checker available, fixes everything flagged, and still sees no meaningful ranking movement.',
        ],
      ],
    },
    {
      heading: 'What real content strategy and authority-building actually involve',
      body: [
        [
          'Real SEO work beyond the technical floor means genuine keyword research and content clustering — deciding which topics you can realistically compete for and structuring content so pages support rather than cannibalize each other. It means competitor gap analysis: understanding specifically what already ranks and what it is missing. It means link building and authority signals accumulated over real time, not a checklist item completed once. The ',
          { text: 'SEO & GEO prompt library', href: '/prompts/seo-geo' },
          ' covers the thinking behind each of these — but doing it consistently, at scale, across a real content calendar, is a sustained operational commitment, not a prompt run once.',
        ],
      ],
    },
    {
      heading: 'This is where a real SEO team earns its cost',
      body: [
        [
          'This is exactly the layer ',
          { text: "Scult's SEO team", href: SERVICE.href, external: true },
          ' works at: real keyword strategy, content planning across a genuine editorial calendar, competitor analysis, and link building — the ongoing, compounding work that determines whether rankings actually move, sitting on top of the technical foundation the free tools above already handle for free.',
        ],
      ],
    },
    {
      heading: 'A realistic diagnostic before you commit to anything',
      body: [
        [
          'Before hiring anyone, run the honest checklist: is your schema valid, does your site pass Core Web Vitals, can AI crawlers reach it? If any of those are broken, fix them first — free, using the tools above — since no content strategy compensates for a technically broken foundation. If all three are genuinely clean and you are still not ranking, the bottleneck is very likely content and authority, which is where real, ongoing strategy work starts to matter.',
        ],
      ],
    },
    {
      heading: 'Get a real read on where your bottleneck actually is',
      body: [
        [
          'Not sure whether your problem is technical or strategic? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " and bring your site — we'll tell you honestly which one it is before pitching anything.",
        ],
      ],
    },
  ],
  relatedTools: [
    'schema-markup-generator',
    'faq-schema-generator',
    'website-speed-test',
    'ai-visibility-checker',
  ],
  relatedPrompts: ['seo-geo-serp-intent-content-brief', 'seo-geo-competitor-gap-audit'],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
