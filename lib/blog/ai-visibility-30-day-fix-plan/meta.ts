import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ai-visibility-30-day-fix-plan'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'A 30-Day AI Visibility Fix Plan for a Small Business Website',
  h1: 'Your AI Visibility Checker score came back low. Here is the 30-day plan.',
  targetKeyword: 'ai visibility fix plan 30 days',
  description:
    'A week-by-week plan to fix a low AI Visibility Checker score — crawler access first, then structured data, on-page basics, and llms.txt — with the free tool for each step.',
  dek: 'A low AI visibility score is fixable in weeks, not months, if the fixes happen in the order the score actually weighs them. Here is that order, mapped to a real 30-day plan.',
  sections: [
    {
      heading: 'Week 1: crawler access — the 40-point check',
      body: [
        [
          'Run the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' and read the per-bot table first. Crawler access is worth 40 of 100 points, the heaviest single check, because a blocked crawler makes every other fix pointless for that engine. The most common finding: a bot-specific Disallow rule mistakenly assumed to be overridden by a permissive wildcard — it never is; the specific rule always wins.',
        ],
        [
          'Fix any blocking rules this week, and re-run the checker to confirm the fix landed before moving on — this is the highest-leverage single week in the whole plan.',
        ],
      ],
    },
    {
      heading: 'Week 2: structured data — the 20-point identity check',
      body: [
        [
          'Generate homepage identity schema — Organization, WebSite, LocalBusiness or Person — with the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          '. This is worth 20 points and is distinct from page-specific schema like FAQPage, which does not satisfy this particular check. If FAQ content exists on the site, add ',
          { text: 'FAQPage schema', href: '/seo/faq-schema-generator' },
          ' too — it will not move this specific check, but it is a quick, free win for AI-citation eligibility on those pages regardless.',
        ],
      ],
    },
    {
      heading: 'Week 3: on-page basics — the other 20-point check',
      body: [
        [
          'Work through the nine basics this check scores: title tag, meta description, one H1, at least two H2s, a lang attribute, a complete Open Graph set, a canonical link, alt text on at least 80% of images, and enough visible text that the page is not thin. The ',
          {
            text: 'AI search visibility checklist',
            href: '/guides/ai-search-visibility-checklist',
          },
          ' walks through each in the exact order it matters.',
        ],
      ],
    },
    {
      heading: 'Week 4: llms.txt, sitemap, and confirming the fix',
      body: [
        [
          'Publish an llms.txt file (10 points) — a plain markdown file at /llms.txt listing important pages with short summaries, costing about ten minutes and needing no build tooling. Declare the sitemap in robots.txt (the other 10 points) with a Sitemap: line, since a crawler checks robots.txt for that line before trying the conventional /sitemap.xml path.',
        ],
        [
          'Re-run the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          " at the end of week 4 — re-checking the same domain shows exactly how many points moved since the start, kept in your browser's local storage with no account needed.",
        ],
      ],
    },
    {
      heading: 'What this plan does not cover',
      body: [
        [
          'This 30-day plan fixes the mechanical, checkable foundation. It does not build ongoing citation monitoring across competitors and queries, and it does not architect a full content strategy aimed at AI citation. Those are real, ongoing investments — worth making once the foundation this plan covers is genuinely solid, not before.',
        ],
      ],
    },
    {
      heading: 'Beyond the 30 days',
      body: [
        [
          'Fixed the foundation and want to talk through what ongoing GEO strategy actually looks like? ',
          {
            text: "That's the work Scult's AI agents team does",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' with your before/after scores in hand.',
        ],
      ],
    },
  ],
  relatedTools: [
    'ai-visibility-checker',
    'schema-markup-generator',
    'faq-schema-generator',
  ],
  relatedPrompts: [
    'seo-geo-visibility-score-fix-plan',
    'seo-geo-ai-crawler-access-audit',
  ],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
