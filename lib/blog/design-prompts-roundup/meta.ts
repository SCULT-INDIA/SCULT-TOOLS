import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'design-prompts-roundup'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'Design Prompts: Brand Strategy and Presentation Decks',
  h1: 'Design tooling here starts with strategy, not just visuals',
  targetKeyword: 'ai design prompts for brands',
  description:
    'Brand positioning, tone-of-voice and mood boards, plus Gamma and Canva deck prompts — the design prompt libraries this site has built out, and the ones honestly still thin.',
  dek: "This site's design prompt coverage is deliberately narrow today — two genuinely useful libraries, brand strategy and presentations, rather than shallow coverage across every design tool.",
  sections: [
    {
      heading: 'Brand & Identity: the strategic layer before generation',
      body: [
        [
          'The ',
          { text: 'Brand & Identity library', href: '/prompts/branding' },
          ' explicitly sequences positioning before naming — its foundational prompt is meant to run before the ',
          { text: 'Business Name Generator', href: '/business/business-name-generator' },
          ', not after — plus tone-of-voice guides, mood boards, and competitor positioning maps.',
        ],
      ],
    },
    {
      heading: 'Decks & Presentations: where prompt specificity visibly changes output',
      body: [
        [
          'The ',
          { text: 'Decks & Presentations library', href: '/prompts/presentations' },
          ' covers Gamma and Canva specifically — investor pitch decks, sales proposals, brand-consistent decks — chosen because these two tools respond dramatically to how detailed the brief is, more so than most other AI-generation tasks.',
        ],
      ],
    },
    {
      heading: 'Where this category is honestly thin: Figma, Framer, UI/UX',
      body: [
        [
          'This site does not yet have dedicated Figma, Framer or general UI/UX prompt libraries — worth saying plainly rather than stretching branding content to cover a gap it was not written for. If component design or interface-workflow prompts are what you actually need, that coverage does not exist here yet.',
        ],
      ],
    },
    {
      heading: 'Where image-generation prompts fit instead',
      body: [
        [
          "Visual asset generation specifically — logos, product photography, marketing imagery — is covered by this site's image-AI libraries (",
          { text: 'Midjourney', href: '/prompts/midjourney' },
          ', ',
          { text: 'Nano Banana', href: '/prompts/nano-banana' },
          ', ',
          { text: 'Flux', href: '/prompts/flux' },
          ' and ',
          { text: 'Ideogram', href: '/prompts/ideogram' },
          '), a genuinely separate discipline from brand strategy and decks.',
        ],
      ],
    },
    {
      heading: 'When strategy needs to become a real executed identity',
      body: [
        [
          'These prompts sharpen thinking. Executing a full visual identity is real creative work. ',
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
    'color-palette-generator',
    'slogan-generator',
  ],
  relatedPrompts: ['define-brand-positioning-before-naming', 'gamma-investor-pitch-deck'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 10,
}
