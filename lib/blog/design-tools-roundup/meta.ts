import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'design-tools-roundup'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'Free Colour Palette Generator With WCAG Contrast Built In',
  h1: 'The one design tool that checks accessibility by default, not as an afterthought',
  targetKeyword: 'accessible color palette generator free',
  description:
    'A colour palette generator built in OKLCH for even, professional swatches, with WCAG contrast checked automatically — the design category this site is starting from.',
  dek: "This site's design category starts narrow and deliberately: one genuinely well-built tool, with accessibility checked by default, rather than a dozen shallow ones.",
  sections: [
    {
      heading: 'Why OKLCH, and why contrast is never optional',
      body: [
        [
          'The ',
          { text: 'Colour Palette Generator', href: '/design/color-palette-generator' },
          ' computes harmonies in OKLCH rather than HSL — HSL lightness does not match perceived brightness, producing uneven palettes even at matched lightness values. Every swatch is checked against white and black text automatically, labelled with its real contrast ratio, so accessibility is visible at generation time rather than discovered during a later audit.',
        ],
      ],
    },
    {
      heading: 'Four harmony rules, real exports',
      body: [
        [
          'Complementary, analogous, triadic, and a monochrome ramp cover the practical range most brand palettes need. Export as CSS custom properties, a Tailwind v4 CSS-first @theme block, JSON with contrast figures included, or an SVG swatch sheet.',
        ],
      ],
    },
    {
      heading: 'Where colour connects to the rest of an identity',
      body: [
        [
          'A finished palette pairs directly with the ',
          { text: 'Business Name Generator', href: '/business/business-name-generator' },
          ' and ',
          { text: 'Slogan Generator', href: '/business/slogan-generator' },
          ' — naming, tagline and colour together form the starting kit for a genuine early-stage identity, all free and all generated in one sitting.',
        ],
      ],
    },
    {
      heading: 'What a single generator cannot decide',
      body: [
        [
          'A palette generator produces accessible, professional options. It has no opinion on whether your business should read as premium or playful — that decision is brand strategy, made before generation, not a byproduct of it.',
        ],
      ],
    },
    {
      heading: 'Where design category depth is headed',
      body: [
        [
          "This category is intentionally narrow today — one tool, done thoroughly, rather than several shallow ones. If a specific design need isn't covered yet, that's worth telling us directly rather than assuming it never will be.",
        ],
      ],
    },
    {
      heading: 'When colour needs to be part of a real identity',
      body: [
        [
          'If colour is one piece of a bigger visual identity decision, ',
          {
            text: "that's the scope Scult's branding team covers",
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
    'color-palette-generator',
    'business-name-generator',
    'slogan-generator',
  ],
  relatedPrompts: ['visual-identity-mood-board-brief'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 10,
}
