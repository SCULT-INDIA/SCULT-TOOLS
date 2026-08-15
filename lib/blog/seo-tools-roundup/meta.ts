import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'seo-tools-roundup'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: '5 Free SEO Tools Every Small Business Actually Needs in 2026',
  h1: 'The five free SEO tools that cover most of what a small site actually needs',
  targetKeyword: 'free seo tools for small business',
  description:
    'Schema markup, FAQ schema, speed testing, UTM tagging and ROI — five free tools covering the technical SEO checklist most small businesses pay a subscription for.',
  dek: 'Most small business SEO checklists are the same five or six technical items repeated across every guide. Here is where to actually fix each one, free, without a subscription.',
  sections: [
    {
      heading: 'Structured data: two tools, two specific jobs',
      body: [
        [
          'The ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ' covers nine schema.org types — Article, Product, LocalBusiness and six more — generating correctly-nested JSON-LD rather than the malformed markup that breaks silently when hand-typed. The ',
          { text: 'FAQ Schema Generator', href: '/seo/faq-schema-generator' },
          ' handles question-and-answer content specifically — worth knowing Google retired FAQ rich results in classic search on 7 May 2026, so this markup is now aimed at AI answer engines rather than a search-result dropdown.',
        ],
      ],
    },
    {
      heading: 'Speed: the one metric Google actually uses for ranking',
      body: [
        [
          'The ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          " runs Google's own Lighthouse engine and reports both lab data and real-user field data — the field data specifically is what Google's ranking systems use to assess Core Web Vitals, not the lab score alone.",
        ],
      ],
    },
    {
      heading: 'Campaign tracking: UTM tagging and honest ROI',
      body: [
        [
          'The ',
          { text: 'UTM Campaign URL Builder', href: '/seo/utm-builder' },
          ' keeps campaign links consistent so GA4 reports do not fragment across inconsistent capitalisation. The ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          ' then shows the real ROI behind a campaign — the number that accounts for margin, which ROAS alone does not.',
        ],
      ],
    },
    {
      heading: 'The order that actually matters',
      body: [
        [
          'Fix speed first — it affects every visitor regardless of channel. Add structured data second, since it is quick and has no downside. Get UTM tagging consistent before spending real ad budget, so the ROI numbers that come back are trustworthy from day one rather than something to fix retroactively.',
        ],
      ],
    },
    {
      heading: 'Where technical SEO alone stops moving rankings',
      body: [
        [
          'Fixing every technical item on this list is a necessary floor, not a ranking strategy — a technically flawless site with no real content strategy still loses to a technically mediocre site that answers search intent better. Once these five are genuinely clean, the next bottleneck is almost always content and authority, which is where ',
          { text: "Scult's SEO team", href: SERVICE.href, external: true },
          ' does its real work.',
        ],
      ],
    },
    {
      heading: 'Get an honest read on your site',
      body: [
        [
          'Run all five tools, then ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' if the results raise more questions than they answer.',
        ],
      ],
    },
  ],
  relatedTools: [
    'schema-markup-generator',
    'faq-schema-generator',
    'website-speed-test',
    'utm-builder',
    'marketing-roi-calculator',
  ],
  relatedPrompts: ['seo-geo-serp-intent-content-brief'],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
