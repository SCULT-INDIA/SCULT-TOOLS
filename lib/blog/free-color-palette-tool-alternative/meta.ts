import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'free-color-palette-tool-alternative'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Every claim checked against lib/tools/color-palette-generator/meta.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Free Colour Palette Generator — WCAG Contrast Checked, No Pro Tier',
  h1: "Contrast checking shouldn't be the feature you pay extra for",
  targetKeyword: 'free color palette generator with contrast checker',
  description:
    'Automatic WCAG contrast checking on every swatch, four harmony rules, real export formats — free, with no premium tier gating the accessibility check.',
  dek: 'Some palette tools treat accessibility contrast checking as a premium add-on rather than a default. Shipping an inaccessible palette is not a feature worth paying to avoid — it should never have been optional.',
  sections: [
    {
      heading: 'Why contrast checking should never be the paid feature',
      body: [
        [
          'A number of palette-generation tools offer basic hue selection for free while reserving WCAG contrast checking — confirming a colour actually works as readable text — for a paid tier. That framing treats accessibility as an upsell rather than a baseline requirement, when a palette that fails 4.5:1 contrast on body text is not usable regardless of how it looks.',
        ],
        [
          'The ',
          { text: 'Colour Palette Generator', href: '/design/color-palette-generator' },
          ' checks every swatch against both white and black text automatically, by default, with the actual ratio labelled — free, on every generation, with no tier gating it.',
        ],
      ],
    },
    {
      heading: 'The OKLCH detail most competing tools still skip',
      body: [
        [
          'Beyond contrast, this generator computes harmonies in OKLCH rather than HSL — HSL lightness does not match perceived brightness, so an HSL palette can look uneven even when every swatch shares the same lightness number. OKLCH is perceptually uniform, producing genuinely even-looking ramps, a distinction most palette tools, paid or free, do not make.',
        ],
      ],
    },
    {
      heading: 'Four harmony rules and lock-and-regenerate, free',
      body: [
        [
          'Complementary, analogous, triadic, and a monochrome ramp — pick one, and lock any swatch you want to keep while regenerating the rest around it, rather than losing a good colour every time you want to explore alternatives.',
        ],
      ],
    },
    {
      heading: 'Export formats that match current frameworks',
      body: [
        [
          'CSS custom properties, a Tailwind v4 CSS-first @theme block (not the older v3 JS-config approach some tools still export), JSON with contrast figures included, or an SVG swatch sheet — covering plain CSS, Tailwind, and programmatic use without a paid export tier. Once exported, pull the same hex values into the ',
          { text: 'Favicon Generator', href: '/dev/favicon-generator' },
          ' so your browser-tab icon matches the palette exactly.',
        ],
      ],
    },
    {
      heading: 'When a palette needs to become a real brand system',
      body: [
        [
          "A generated palette is a solid, accessible starting point — not a brand. Assigning real meaning (which colour means error, which is the primary CTA) across a full product is strategy work. If that's next, ",
          {
            text: "Scult's branding team handles it",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' for a second opinion first.',
        ],
      ],
    },
  ],
  relatedTools: [
    'color-palette-generator',
    'favicon-generator',
    'business-name-generator',
  ],
  relatedPrompts: ['visual-identity-mood-board-brief'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 9,
}
