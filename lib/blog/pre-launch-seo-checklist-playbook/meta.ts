import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'pre-launch-seo-checklist-playbook'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'The Pre-Launch SEO Checklist Most New Sites Skip',
  h1: 'Every item on this list is checkable, free, before your site goes live',
  targetKeyword: 'pre launch seo checklist',
  description:
    'Schema, speed, AI crawlability, keyword clustering and internal linking — a real pre-launch SEO checklist covering the specific, checkable items most launches skip.',
  dek: 'Most SEO advice targets a site that has been live for months. This checklist is specifically for before launch, when every item is still cheap to fix.',
  sections: [
    {
      heading: 'Technical foundation, before content even ships',
      body: [
        [
          'Generate homepage identity schema with the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ', confirm speed passes Core Web Vitals with the ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          ' on mobile, and run the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' to confirm robots.txt is not accidentally blocking a major AI crawler before the site has any real traffic to lose.',
        ],
      ],
    },
    {
      heading: 'Keyword architecture, before writing a single page',
      body: [
        [
          'Build a ',
          {
            text: 'cannibalization-proof keyword cluster map',
            href: '/prompts/seo-geo/seo-geo-keyword-cluster-architecture',
          },
          ' before writing content, not after — deciding which pages own which keywords upfront avoids launching with two pages quietly competing for the same search term.',
        ],
      ],
    },
    {
      heading: 'Internal linking, planned before launch',
      body: [
        [
          'Plan the ',
          {
            text: 'internal links a new page needs before it goes live',
            href: '/prompts/seo-geo/seo-geo-internal-link-equity-map',
          },
          ' — link equity is far easier to architect correctly from the start than to retrofit across dozens of already-published pages.',
        ],
      ],
    },
    {
      heading: 'FAQ and structured content, done right the first time',
      body: [
        [
          'If launch pages include FAQ content, generate ',
          { text: 'FAQPage schema', href: '/seo/faq-schema-generator' },
          ' alongside the visible HTML, matched exactly — mismatched visible content and schema is a Google policy issue, not just a missed opportunity.',
        ],
      ],
    },
    {
      heading: 'What this checklist does not cover',
      body: [
        [
          'This gets a launch technically sound. It does not build ongoing authority, backlinks, or a genuine content calendar — those accumulate over real time after launch, not before it.',
        ],
      ],
    },
    {
      heading: 'Get a launch review before you go live',
      body: [
        [
          'Want a second set of eyes on your pre-launch checklist? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          ' with ',
          { text: "Scult's SEO team", href: SERVICE.href, external: true },
          ' before launch, while every fix is still cheap.',
        ],
      ],
    },
  ],
  relatedTools: [
    'schema-markup-generator',
    'website-speed-test',
    'ai-visibility-checker',
    'faq-schema-generator',
  ],
  relatedPrompts: [
    'seo-geo-keyword-cluster-architecture',
    'seo-geo-internal-link-equity-map',
  ],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
