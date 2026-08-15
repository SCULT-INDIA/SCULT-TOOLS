import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'nextjs-migration-without-losing-rankings-playbook'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Migrating to Next.js Without Losing Your SEO Rankings',
  h1: 'A real platform migration that keeps every ranking you already earned',
  targetKeyword: 'migrate to nextjs without losing seo',
  description:
    'A redirect map, generateMetadata done right, and a post-migration speed and crawlability check — a real Next.js migration playbook that protects existing rankings.',
  dek: 'A botched platform migration is one of the fastest ways to lose rankings that took years to earn. This is the specific sequence that protects them.',
  sections: [
    {
      heading: 'Before touching code: a real redirect map',
      body: [
        [
          'Plan a ',
          {
            text: 'migration redirect map',
            href: '/prompts/seo-geo/seo-geo-migration-redirect-map',
          },
          ' before writing a single line of the new site — every existing URL that has earned ranking needs a deliberate 301 redirect to its new equivalent, decided in advance, not discovered by 404 reports after launch.',
        ],
      ],
    },
    {
      heading: 'Metadata: wired correctly from day one',
      body: [
        [
          'On the new Next.js build, ',
          {
            text: 'wire up generateMetadata',
            href: '/prompts/nextjs/nextjs-generate-metadata-dynamic-seo-tags',
          },
          ' so every page actually gets dynamic, correct SEO tags — a common migration failure is every page silently sharing one static title and description because the App Router-specific metadata API was never wired correctly.',
        ],
      ],
    },
    {
      heading: 'Structured data: reproduce it, not lose it',
      body: [
        [
          'Regenerate every schema type the old site carried using the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ' — structured data is easy to silently lose in a platform migration if it was hand-maintained on the old site and nobody explicitly ports it across.',
        ],
      ],
    },
    {
      heading: 'Performance: confirm the migration actually helped',
      body: [
        [
          'Run the ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          " on the new site's key pages before fully cutting over — the entire point of a Next.js migration is usually better performance, and this confirms it actually happened rather than assuming it.",
        ],
      ],
    },
    {
      heading: 'Crawlability: check before and after',
      body: [
        [
          'Run the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' on both the old and new site before and after cutover — confirm the new deployment did not accidentally introduce a robots.txt or noindex mistake that blocks crawlers the old site never had.',
        ],
      ],
    },
    {
      heading: "What a migration checklist can't guarantee",
      body: [
        [
          'Following this sequence dramatically reduces migration risk. It does not guarantee zero ranking fluctuation — some temporary movement during recrawling is normal. What it prevents is the avoidable, self-inflicted losses: broken redirects, lost schema, silently wrong metadata.',
        ],
      ],
    },
    {
      heading: 'Get this done right',
      body: [
        [
          'A migration is exactly the kind of high-stakes, one-shot work worth getting professionally reviewed. ',
          {
            text: "That's what Scult's software team handles",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' before you cut over.',
        ],
      ],
    },
  ],
  relatedTools: [
    'schema-markup-generator',
    'website-speed-test',
    'ai-visibility-checker',
  ],
  relatedPrompts: [
    'seo-geo-migration-redirect-map',
    'nextjs-generate-metadata-dynamic-seo-tags',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
