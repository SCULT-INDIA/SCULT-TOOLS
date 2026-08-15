import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ecommerce-seo-audit-playbook'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'The Technical SEO Audit Every E-Commerce Store Needs',
  h1: 'Thin category pages are the single most common e-commerce SEO problem',
  targetKeyword: 'ecommerce seo audit checklist',
  description:
    'Product schema, thin category page fixes, Core Web Vitals at real catalogue scale, and keyword cannibalization across similar products — a real e-commerce SEO audit.',
  dek: 'E-commerce SEO has specific, recurring failure patterns most generic SEO checklists miss entirely — thin category pages and keyword cannibalization across near-identical products chief among them.',
  sections: [
    {
      heading: 'Product schema, done right at scale',
      body: [
        [
          'Generate correct ',
          { text: 'Product schema', href: '/seo/schema-markup-generator' },
          ' with price nested inside Offer and reviews nested inside AggregateRating — this is the schema type most likely to earn a real rich result (star ratings, price) in search.',
        ],
      ],
    },
    {
      heading: 'The specific fix for thin category pages',
      body: [
        [
          'Fixing ',
          {
            text: 'thin e-commerce category content',
            href: '/prompts/seo-geo/seo-geo-ecommerce-category-thin-content-fix',
          },
          ' addresses the single most common e-commerce SEO weakness — a category page that is just a product grid with no genuine text content for Google to index and rank on.',
        ],
      ],
    },
    {
      heading: 'Keyword cannibalization across near-identical products',
      body: [
        [
          'Diagnose ',
          {
            text: 'keyword cannibalization',
            href: '/prompts/seo-geo/seo-geo-keyword-cannibalization-diagnosis',
          },
          ' — a real recurring e-commerce problem where multiple product variants (colours, sizes) compete against each other for the same search term instead of one clear page winning it.',
        ],
      ],
    },
    {
      heading: 'Speed, at real catalogue scale',
      body: [
        [
          'Run the ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          ' on an actual product page, not the homepage — a catalogue with thousands of product images is a genuinely different speed problem than a simple brochure site.',
        ],
      ],
    },
    {
      heading: 'If a migration or replatform is coming',
      body: [
        [
          'Plan a ',
          {
            text: 'migration redirect map',
            href: '/prompts/seo-geo/seo-geo-migration-redirect-map',
          },
          ' before any replatforming — a botched e-commerce migration commonly causes real, measurable ranking and revenue loss that a proper redirect plan avoids.',
        ],
      ],
    },
    {
      heading: 'What this audit does not cover',
      body: [
        [
          'This is the technical foundation. It does not decide product-content strategy at scale or build ongoing authority — ',
          {
            text: "that's Scult's SEO team's ongoing work",
            href: SERVICE.href,
            external: true,
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Get a real audit of your catalogue',
      body: [
        [
          'Want a proper audit of your actual store? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: ['schema-markup-generator', 'website-speed-test'],
  relatedPrompts: [
    'seo-geo-ecommerce-category-thin-content-fix',
    'seo-geo-keyword-cannibalization-diagnosis',
  ],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
