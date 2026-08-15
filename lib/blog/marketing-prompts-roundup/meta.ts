import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'marketing-prompts-roundup'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'Marketing Prompts: SEO/GEO, Ads, Sales Outreach and LinkedIn',
  h1: 'Five marketing prompt libraries, from search intent to closing the deal',
  targetKeyword: 'ai marketing prompts',
  description:
    'SEO and GEO content strategy, ad campaign briefs, cold outreach and discovery scripts, and LinkedIn content — five free prompt libraries covering acquisition end to end.',
  dek: 'Marketing prompts scattered across generic lists rarely respect that search, paid, outbound and social all need genuinely different structure and register.',
  sections: [
    {
      heading: 'SEO and GEO: content strategy and AI citation, together',
      body: [
        [
          'The ',
          { text: 'SEO & GEO library', href: '/prompts/seo-geo' },
          ' covers both halves of a converging discipline — content briefs and keyword clustering alongside auditing AI crawlability and rewriting claims to be citable — pairing directly with the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          '.',
        ],
      ],
    },
    {
      heading: 'Ads: the thinking before and after a tagged link',
      body: [
        [
          'The ',
          { text: 'Ads & Campaigns library', href: '/prompts/ads' },
          ' covers creative briefs, platform-aware copy variants, and turning campaign metrics into a real performance narrative — the strategy that happens before and after the ',
          { text: 'UTM Campaign URL Builder', href: '/seo/utm-builder' },
          ' does its own narrower tagging job.',
        ],
      ],
    },
    {
      heading: 'Sales: every stage of a real deal cycle',
      body: [
        [
          'The ',
          { text: 'Sales & Outreach library', href: '/prompts/sales' },
          ' treats cold outreach, discovery, negotiation and renewal as genuinely different writing problems — a cold email is not a MEDDIC discovery script is not a QBR agenda, and each gets its own prompt rather than one generic sales template.',
        ],
      ],
    },
    {
      heading: 'LinkedIn: the platform with its own register',
      body: [
        [
          'The ',
          { text: 'LinkedIn library', href: '/prompts/linkedin' },
          " covers a hook-first line, personal-story posts, profile rewrites and hiring posts, calibrated to LinkedIn's specific feed mechanics rather than generic social copy.",
        ],
      ],
    },
    {
      heading: 'Email Marketing: the one gap this site is honest about',
      body: [
        [
          "This site does not yet have a dedicated email marketing prompt library — worth stating plainly rather than stretching an adjacent category to cover it. The Ads & Campaigns library's email subject-line prompt is the closest coverage today.",
        ],
      ],
    },
    {
      heading: 'When marketing prompts need to become a real, run programme',
      body: [
        [
          'These prompts sharpen individual pieces of marketing writing and strategy. A coordinated acquisition programme across channels, with real budget allocation, is ongoing operational work. ',
          {
            text: "That's exactly what Scult's marketing team runs",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your funnel.',
        ],
      ],
    },
  ],
  relatedTools: ['utm-builder', 'marketing-roi-calculator', 'ai-visibility-checker'],
  relatedPrompts: [
    'seo-geo-serp-intent-content-brief',
    'sales-cold-email-single-trigger-signal',
  ],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
