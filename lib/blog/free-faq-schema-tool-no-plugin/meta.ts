import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'free-faq-schema-tool-no-plugin'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Every claim checked against lib/tools/faq-schema-generator/meta.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Free FAQ Schema Generator — No WordPress Plugin Required',
  h1: "You don't need an SEO plugin's premium tier for FAQ schema",
  targetKeyword: 'free faq schema generator no plugin',
  description:
    'FAQPage JSON-LD generated in your browser, no CMS plugin or account needed — with the honest 2026 update most FAQ-schema content still gets wrong.',
  dek: "FAQ schema is a small, mechanical task that a paid plugin tier often gates behind a subscription anyway. A free generator handles the exact same JSON-LD output, plus the visible-HTML pairing that keeps you on the right side of Google's actual requirements.",
  sections: [
    {
      heading: 'What FAQ schema actually costs to build by hand versus with a plugin',
      body: [
        [
          'Building valid FAQPage JSON-LD by hand means correctly nesting a mainEntity array of Question objects, each with an Answer nested inside acceptedAnswer, and remembering to serialise angle brackets so embedded HTML cannot break out of the script tag. Get the nesting slightly wrong and the markup is often still valid JSON while being schema.org-invalid — a mistake that is easy to make and easy to miss when proofreading by eye. Many SEO plugins solve this with a visual Q&A builder, frequently reserved for a paid tier alongside their other advanced schema features.',
        ],
        [
          'The ',
          { text: 'FAQ Schema Generator', href: '/seo/faq-schema-generator' },
          ' does the identical job for free: type your questions and answers as rows, get correctly-nested FAQPage JSON-LD out, with duplicate questions, empty answers and overly long text all flagged automatically before you ship it.',
        ],
      ],
    },
    {
      heading:
        'The 2026 fact most FAQ-schema content — paid tools included — still gets wrong',
      body: [
        [
          'Google retired FAQ rich results entirely on 7 May 2026 — not the softer 2023 restriction to authoritative sites some older guides and, notably, some plugin marketing pages still describe. Nobody gets the expandable search-result dropdown anymore, paid tool or free one. That fact does not make FAQ schema worthless; it means the actual audience for this markup today is AI answer engines parsing your page, not a Google SERP feature — worth knowing so you are not paying for, or manually building, something aimed at a search feature that no longer exists.',
        ],
      ],
    },
    {
      heading: 'The rule that matters more than which tool you use',
      body: [
        [
          'Regardless of whether the markup comes from a paid plugin or a free generator, the same Google requirement applies: the questions and answers in your schema must also appear as real, visible text on the page. Marking up content that is not visible anywhere on the rendered page is a policy violation, not a soft warning, and no tool — paid or free — can exempt you from that requirement.',
        ],
        [
          "This is exactly why the generator's HTML + schema output exists as a distinct mode from plain JSON-LD: it produces a paste-ready visible block alongside the script tag, generated from the same source data, so the two can never quietly drift apart the way a hand-maintained visible FAQ section and a separately hand-typed schema block sometimes do.",
        ],
      ],
    },
    {
      heading: 'Worked example: moving FAQ schema out of a plugin dependency',
      body: [
        [
          "If you are currently generating FAQ schema through a CMS plugin's premium tier and want to remove that specific dependency, the migration is straightforward: for each page's existing visible FAQ content, type the same questions and answers into this generator, choose the HTML + schema output if you want both regenerated together, and replace the plugin-generated script tag with this one. The output is the same valid FAQPage shape either way — you are changing which tool produced the markup, not what the markup says.",
        ],
      ],
    },
    {
      heading: 'When FAQ content needs more than a schema generator',
      body: [
        [
          'A generator handles the mechanical markup correctly. It cannot tell you which questions your actual customers are searching for, or whether your FAQ content is thin, duplicated across too many near-identical pages, or missing the specific angle an AI answer engine would actually cite. That is content strategy, and it is where ',
          { text: "Scult's SEO team", href: SERVICE.href, external: true },
          ' does real work — deciding what belongs in an FAQ in the first place, not just formatting it once it is written.',
        ],
        [
          'Want a second opinion on your FAQ content strategy? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
    {
      heading: 'Pair it with the rest of your free structured-data stack',
      body: [
        [
          'The ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ' covers the other nine common schema types your pages likely also need, and the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' confirms your homepage carries the separate identity-level schema (Organization, WebSite, LocalBusiness or Person) that AI crawlers check for independently of any FAQ markup on individual pages.',
        ],
      ],
    },
  ],
  relatedTools: [
    'faq-schema-generator',
    'schema-markup-generator',
    'ai-visibility-checker',
  ],
  relatedPrompts: ['seo-geo-serp-intent-content-brief'],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 10,
}
