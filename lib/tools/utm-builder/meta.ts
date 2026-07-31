import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'utm-builder',
  category: 'seo',
  title: 'UTM Campaign URL Builder',
  h1: 'UTM Campaign URL Builder',
  description:
    'Build consistent, correctly encoded UTM tracking URLs for Google Analytics. Saves your conventions locally so every campaign is tagged the same way.',
  tagline: 'Tag campaigns consistently, so your reports are readable.',
  keywords: ['utm builder', 'utm generator', 'campaign url builder'],
  related: [
    'marketing-roi-calculator',
    'qr-code-generator',
    'website-speed-test',
    'email-signature-generator',
  ],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'B',
  serviceTarget: 'performance-marketing',
  updatedAt: '2026-07-28',
  owner: 'scult-growth',
  icon: 'Link2',
  runsInBrowser: true,
  howToUse: [
    'Paste your destination URL.',
    'Fill in source, medium and campaign — these three are the ones that matter.',
    'Copy the tagged URL, or save the preset for next time.',
  ],
  howItWorks:
    'Parameters are appended with the URL API rather than string concatenation, which correctly handles a destination that already has a query string or a fragment. Values are lowercased and spaces become hyphens by default, because GA4 treats `Spring-Sale` and `spring-sale` as two different campaigns — inconsistent casing is the single most common cause of fragmented campaign reports.',
  limitations: [
    'UTMs are visible in the URL and trivially editable by anyone. They are for attribution, never for access control or secrets.',
    'GA4 also reads `gclid` and `fbclid` automatically. Adding UTMs to an ad that already auto-tags can double-count if configured badly.',
  ],
  faq: [
    {
      q: 'Which UTM parameters are required?',
      a: 'Source, medium and campaign. Term and content are optional and mostly used for paid search keywords and A/B variants.',
    },
    {
      q: 'Should UTMs be lowercase?',
      a: 'Yes. GA4 is case-sensitive, so mixed casing splits one campaign across several rows in your reports.',
    },
    {
      q: 'Do UTMs affect SEO?',
      a: 'They can create duplicate URLs if crawled. Use a canonical tag pointing at the clean URL, and avoid UTMs on internal links.',
    },
  ],
}
