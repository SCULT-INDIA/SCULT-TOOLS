import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'launch-a-website-in-india-playbook'
const SERVICE = resolveServiceLink('web-development', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Launching a Website in India in 2026: Free Tools, Prompts, and When to Hire',
  h1: 'A launch checklist that tells you honestly what you can do yourself',
  targetKeyword: 'launch a website checklist india',
  description:
    'A real pre-launch checklist covering speed, schema, AI crawlability and GST-ready invoicing — with the free tools for each step and the honest signal for when to hire a developer.',
  dek: 'Most website launch checklists are generic. This one is built around the specific free tools that fix each item, and an honest answer for exactly when a template stops being enough for an Indian small business.',
  sections: [
    {
      heading: 'Before launch: the technical checklist',
      body: [
        [
          'Run the page through the ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          ' on mobile first, since that is what Google actually uses for ranking. Generate ',
          {
            text: 'Organization or LocalBusiness schema',
            href: '/seo/schema-markup-generator',
          },
          ' for the homepage — one of the checks the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' looks for specifically. Run that checker itself to confirm robots.txt is not accidentally blocking GPTBot, ClaudeBot or PerplexityBot — a mistake that happens more often than expected, usually from a CDN or security-plugin default nobody reviewed.',
        ],
      ],
    },
    {
      heading: 'Identity: name, favicon, and a matching palette',
      body: [
        [
          'If the brand identity is not fully settled, the ',
          { text: 'Business Name Generator', href: '/business/business-name-generator' },
          ', ',
          { text: 'Colour Palette Generator', href: '/design/color-palette-generator' },
          ' and ',
          { text: 'Favicon Generator', href: '/dev/favicon-generator' },
          ' cover a genuine starting kit in one sitting — run the name and palette through together so the favicon can pull its colours from the same OKLCH-checked swatches.',
        ],
      ],
    },
    {
      heading: 'Content: an SEO-anchored plan, not a blank page',
      body: [
        [
          'A ',
          {
            text: 'SERP-intent content brief',
            href: '/prompts/seo-geo/seo-geo-serp-intent-content-brief',
          },
          ' for the launch pages, run before writing a word, anchors content to what people actually search rather than guessing. Check every draft against the ',
          { text: 'Word Counter', href: '/productivity/word-counter' },
          "'s platform badges before publishing.",
        ],
      ],
    },
    {
      heading: 'Business paperwork: ready for the first invoice',
      body: [
        [
          'For an Indian business, GST-ready invoicing from day one matters — the ',
          { text: 'Invoice Generator', href: '/business/invoice-generator' },
          ' handles CGST/SGST/IGST splits correctly, and a matching ',
          { text: 'Email Signature', href: '/business/email-signature-generator' },
          ' on the emails those invoices go out with completes the professional picture.',
        ],
      ],
    },
    {
      heading: 'The honest checklist for whether you need a developer',
      body: [
        [
          "If the site is a standard brochure page, a simple blog, or a basic landing page, a template genuinely covers it — none of the above requires hiring anyone. The signal that a real developer is worth it: the site needs a genuine data model (bookings, a product catalogue synced to inventory, member access), integration with an external system, or you find yourself fighting the template's limitations more than building forward.",
        ],
      ],
    },
    {
      heading: 'Get a straight answer before committing to either path',
      body: [
        [
          "Run the checklist above yourself first — it costs nothing and answers most of the question. If you're still unsure, ",
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          " and we'll tell you honestly whether ",
          { text: "Scult's web development team", href: SERVICE.href, external: true },
          ' is actually the right call for your specific launch.',
        ],
      ],
    },
  ],
  relatedTools: [
    'website-speed-test',
    'schema-markup-generator',
    'ai-visibility-checker',
    'business-name-generator',
    'invoice-generator',
  ],
  relatedPrompts: ['seo-geo-serp-intent-content-brief'],
  serviceTarget: 'web-development',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
