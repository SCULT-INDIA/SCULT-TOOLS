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
  // 'performance-marketing' 404s on scult.in — no generic page under that
  // slug exists; 'google-ads-management' is the closest real service page.
  serviceTarget: 'google-ads-management',
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
    'Parameters are appended via the URL API, so it works correctly even if the destination already has a query string or fragment. Values are lowercased and spaces become hyphens, since GA4 treats `Spring-Sale` and `spring-sale` as separate campaigns — a common cause of fragmented reports.',
  limitations: [
    'UTMs are visible in the URL and editable by anyone — never use them for access control or secrets.',
    'GA4 also auto-reads `gclid` and `fbclid`, so adding UTMs on top of auto-tagged ads can double-count.',
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
