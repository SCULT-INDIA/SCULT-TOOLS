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
  serviceTarget: 'branding',
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
    'Harmonies are computed in OKLCH rather than HSL. This matters: rotating hue in HSL changes perceived lightness dramatically — HSL yellow and HSL blue at the same "lightness" differ by a factor of four in actual luminance — so HSL palettes come out visually lumpy. OKLCH is perceptually uniform, so a fixed lightness really does look like a fixed lightness across hues, and a ten-step ramp has ten even steps.',
  limitations: [
    'OKLCH can express colours outside the sRGB gamut. We clamp to sRGB, so extremely saturated inputs may shift slightly on output.',
    'A generated palette is a starting point, not a brand. It has no opinion about what your colours should mean.',
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
