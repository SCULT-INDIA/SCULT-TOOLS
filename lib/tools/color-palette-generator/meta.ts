import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'color-palette-generator',
  category: 'design',
  title: 'Colour Palette Generator',
  h1: 'Colour Palette Generator',
  description:
    'Build a harmonious palette from one colour using OKLCH, so every step is perceptually even. Includes tints, shades and an automatic WCAG check on each swatch.',
  tagline: 'One colour in, a usable palette out — checked for contrast.',
  keywords: ['colour palette generator', 'color scheme generator', 'oklch palette'],
  related: ['favicon-generator', 'business-name-generator', 'slogan-generator'],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'B',
  // 'branding' 404s on scult.in — 'branding-agency' is the real page.
  serviceTarget: 'branding-agency',
  updatedAt: '2026-07-28',
  owner: 'scult-design',
  icon: 'Palette',
  runsInBrowser: true,
  howToUse: [
    'Pick a base colour.',
    'Choose a harmony — complementary, analogous, triadic or a monochrome ramp.',
    'Check the contrast badge on each swatch.',
    'Copy the palette as CSS custom properties or Tailwind tokens.',
  ],
  howItWorks:
    'Harmonies are computed in OKLCH, not HSL: HSL lightness does not match perceived lightness, so HSL yellow and blue at the same value differ by roughly 4x in actual luminance, producing lumpy palettes. OKLCH is perceptually uniform, so holding lightness constant looks even across hues, and the ten-step ramp stays evenly spaced.',
  limitations: [
    'Very saturated inputs may shift slightly, since out-of-gamut OKLCH colours get clamped to sRGB.',
    'A generated palette is a starting point, not a brand — it carries no meaning of its own.',
  ],
  faq: [
    {
      q: 'Why OKLCH instead of HSL?',
      a: 'Because HSL lightness does not match perceived lightness. In OKLCH, holding lightness constant across hues produces swatches that actually look equally light.',
    },
    {
      q: 'Are the generated colours accessible?',
      a: 'Each swatch is checked against white and black text and labelled with its ratio, so you can see immediately which ones can carry text.',
    },
    {
      q: 'Can I use these commercially?',
      a: 'Yes. Colours are not copyrightable and there is nothing to attribute.',
    },
  ],
}
