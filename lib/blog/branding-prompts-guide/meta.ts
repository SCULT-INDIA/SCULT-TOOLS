import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'branding-prompts-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/branding/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Brand Strategy Prompts — the Thinking Behind the Name and Slogan',
  h1: 'A name generator gives you options. These prompts decide which one is right.',
  targetKeyword: 'brand strategy prompts',
  description:
    'Positioning, tone-of-voice, mood boards and brand-story prompts that extend the Business Name, Slogan and Colour Palette generators with the strategic thinking behind each one.',
  dek: 'A free tool can generate a name, a slogan, or a palette. Deciding which specific option actually fits your positioning is a strategy question, and that is what this category of prompts is for.',
  sections: [
    {
      heading: 'Positioning before naming, not after',
      body: [
        [
          'Naming, tagline-writing and visual identity all go faster and land better once positioning is decided first — otherwise you are picking a name that sounds nice in isolation rather than one that fits a specific market position. The ',
          { text: 'Brand & Identity prompt library', href: '/prompts/branding' },
          "'s foundational prompt, ",
          {
            text: 'defining brand positioning before naming',
            href: '/prompts/branding/define-brand-positioning-before-naming',
          },
          ', is meant to run before the ',
          { text: 'Business Name Generator', href: '/business/business-name-generator' },
          ', not after.',
        ],
      ],
    },
    {
      heading: 'Tone of voice and brand story',
      body: [
        [
          'Turning real example sentences into an actual tone-of-voice guide — ',
          {
            text: 'this prompt',
            href: '/prompts/branding/turn-example-sentences-into-tone-of-voice-guide',
          },
          ' — works by showing real writing, not describing tone abstractly, the same principle that makes voice-matching prompts work well generally. A ',
          {
            text: 'brand story built for an About page',
            href: '/prompts/branding/brand-story-for-about-page',
          },
          ' gives the identity a narrative a customer can actually connect with, not a features list.',
        ],
      ],
    },
    {
      heading: 'Before the Slogan Generator: a real creative brief',
      body: [
        [
          'A ',
          {
            text: 'tagline brief',
            href: '/prompts/branding/tagline-brief-before-slogan-generator',
          },
          ' run before the ',
          { text: 'Slogan Generator', href: '/business/slogan-generator' },
          ' focuses the tone selection on a genuine strategic brief rather than picking whichever of the five available tones sounds catchiest in isolation.',
        ],
      ],
    },
    {
      heading: 'Visual identity: mood boards and logo briefs',
      body: [
        [
          'A ',
          {
            text: 'visual identity mood board brief',
            href: '/prompts/branding/visual-identity-mood-board-brief',
          },
          ' translates a positioning statement into actual visual direction — colours, imagery, texture — before design work begins. And a ',
          {
            text: 'logo brief for a designer or an image generator',
            href: '/prompts/branding/logo-brief-for-designer-or-image-generator',
          },
          ' gives either a specific, actionable direction rather than a vague "make it look modern" ask that produces generic results.',
        ],
      ],
    },
    {
      heading: 'Competitive positioning and consistency auditing',
      body: [
        [
          'A ',
          {
            text: 'competitor positioning map',
            href: '/prompts/branding/competitor-positioning-map',
          },
          ' shows where a genuine gap in the market actually sits rather than positioning by instinct alone. And a ',
          {
            text: 'brand consistency audit across touchpoints',
            href: '/prompts/branding/brand-consistency-audit-across-touchpoints',
          },
          ' catches where a website, social presence and printed material have quietly drifted out of alignment over time.',
        ],
      ],
    },
    {
      heading: 'Worked example: naming and slogan in the right order',
      body: [
        [
          'Run the positioning prompt first, then the ',
          { text: 'Business Name Generator', href: '/business/business-name-generator' },
          ' against that specific positioning rather than a blank keyword. Once a name is chosen, run the tagline brief, then the ',
          { text: 'Slogan Generator', href: '/business/slogan-generator' },
          ' with the tone that brief points to. The order matters more than any individual step — naming and tagline decisions made without positioning first tend to need redoing once positioning is finally settled.',
        ],
      ],
    },
    {
      heading: 'When strategy needs to become a real, executed identity',
      body: [
        [
          'These prompts sharpen the thinking. Actually executing a full identity — logo design, a complete visual system, brand guidelines a whole team can follow — is real creative and strategic work. ',
          {
            text: "That's exactly what Scult's branding team does",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your brand.',
        ],
      ],
    },
  ],
  relatedTools: [
    'business-name-generator',
    'slogan-generator',
    'color-palette-generator',
  ],
  relatedPrompts: [
    'define-brand-positioning-before-naming',
    'tagline-brief-before-slogan-generator',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
