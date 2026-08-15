import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'brand-identity-in-a-weekend-playbook'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Building a Complete Brand Identity in One Weekend, Free',
  h1: 'Positioning to favicon: a full identity, built in the right order',
  targetKeyword: 'build brand identity weekend free',
  description:
    'Positioning, name, palette, slogan, logo concept and favicon — a complete brand identity build using free tools and prompts, in the order that actually holds together.',
  dek: 'Every individual piece of a brand identity is free to generate. The order they get built in decides whether the result feels coherent or assembled from mismatched decisions.',
  sections: [
    {
      heading: 'Saturday morning: positioning first',
      body: [
        [
          'Start with the ',
          {
            text: 'brand positioning prompt',
            href: '/prompts/branding/define-brand-positioning-before-naming',
          },
          ' — every decision after this should trace back to it. Skipping straight to naming is the single most common reason a brand identity ends up assembled from generically pleasant choices with no coherent story.',
        ],
      ],
    },
    {
      heading: 'Saturday afternoon: name and tagline together',
      body: [
        [
          'Run the ',
          { text: 'Business Name Generator', href: '/business/business-name-generator' },
          ' against your specific positioning, not a blank keyword. Once a name is shortlisted, run the ',
          {
            text: 'tagline brief prompt',
            href: '/prompts/branding/tagline-brief-before-slogan-generator',
          },
          ' and then the ',
          { text: 'Slogan Generator', href: '/business/slogan-generator' },
          ' with the tone that brief points to.',
        ],
      ],
    },
    {
      heading: 'Sunday morning: colour and visual mood',
      body: [
        [
          'Build a ',
          {
            text: 'visual identity mood board brief',
            href: '/prompts/branding/visual-identity-mood-board-brief',
          },
          ' from the positioning, then generate a matching ',
          { text: 'colour palette', href: '/design/color-palette-generator' },
          ' — WCAG contrast checked automatically, in OKLCH for even, professional swatches.',
        ],
      ],
    },
    {
      heading: 'Sunday afternoon: logo concept and favicon',
      body: [
        [
          'Write a real ',
          {
            text: 'logo brief',
            href: '/prompts/branding/logo-brief-for-designer-or-image-generator',
          },
          ' and generate a concept with ',
          { text: 'Ideogram', href: '/prompts/ideogram/ideogram-v3-logo-icon-concept' },
          " specifically, since it can actually render legible wordmark text. Pull the palette's colours straight into a ",
          { text: 'favicon', href: '/dev/favicon-generator' },
          ' so the smallest visible brand element matches everything else.',
        ],
      ],
    },
    {
      heading: 'What a weekend build cannot give you',
      body: [
        [
          "This produces a genuinely coherent starting identity — real, usable, and internally consistent. It does not include market research validating the positioning against real competitors, or a designer's finishing pass on the logo concept. Both matter more the more traction the business gains.",
        ],
      ],
    },
    {
      heading: 'When the weekend identity needs a professional finish',
      body: [
        [
          'Have a weekend build and want it professionally finished, or validated against real competitors? ',
          {
            text: "That's exactly what Scult's branding team does",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk it through.',
        ],
      ],
    },
  ],
  relatedTools: [
    'business-name-generator',
    'slogan-generator',
    'color-palette-generator',
    'favicon-generator',
  ],
  relatedPrompts: [
    'define-brand-positioning-before-naming',
    'visual-identity-mood-board-brief',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
