import type { Tool } from '../types'

/**
 * Corrections against lib/tools/color-palette-generator/logic.ts:
 * the draft's Tailwind export ("drop hex values into theme.extend.colors")
 * describes Tailwind v3's JS config — this tool outputs Tailwind v4's
 * CSS-first `@theme` block instead (toTailwindTheme), and the CSS custom
 * property names are `--<prefix>-<name>`, not `--color-primary`-style. The
 * lock-and-regenerate feature the draft's FAQ claimed is real (`locked` on
 * each swatch slot).
 */
const EXAMPLES_SUPPORT: Tool['supportContent'] = [
  {
    heading: 'Palettes you can copy — with contrast built in',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Every palette this tool generates is checked against WCAG contrast as you go, so your text stays readable. Here are a few starting points — open the generator above to build and tweak your own.',
        ],
      },
      {
        type: 'list',
        items: [
          'Modern SaaS: #0F172A · #2563EB · #38BDF8 · #F1F5F9 · #FFFFFF',
          'Warm & friendly: #7C2D12 · #EA580C · #FDBA74 · #FFF7ED · #1C1917',
          'Premium dark: #0B0B0F · #6D28D9 · #A78BFA · #E5E7EB · #FFFFFF',
          'Fresh & natural: #14532D · #16A34A · #86EFAC · #F0FDF4 · #052E16',
        ],
      },
      {
        type: 'code',
        intro:
          'Export in one click — CSS custom properties or a Tailwind v4 @theme block:',
        snippets: [
          {
            label: 'CSS custom properties',
            lang: 'css',
            code: `:root {
  --brand-primary: #2563EB; /* oklch(54% 0.18 258) */
  --brand-accent: #38BDF8; /* oklch(74% 0.12 228) */
}`,
          },
          {
            label: 'Tailwind v4',
            lang: 'css',
            code: `@theme {
  --color-brand-primary: #2563EB;
  --color-brand-accent: #38BDF8;
}`,
            note: 'Tailwind v4 is CSS-first — colours are declared in @theme, not a JS config file.',
          },
        ],
      },
      {
        type: 'prose',
        paragraphs: [
          "JSON (with every contrast figure included) and an SVG swatch sheet export too. Like everything else about this tool, why WCAG AA matters is worth knowing: a palette that fails 4.5:1 contrast on body text isn't usable, however good it looks — that's why every pairing here is checked automatically rather than left for you to guess.",
        ],
      },
    ],
  },
]

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
    {
      q: 'How are the palettes generated?',
      a: "From a base colour using one of four harmony rules — complementary, analogous, triadic, or a monochrome ramp — computed in OKLCH so each hue holds the lightness step you'd expect instead of the lumpy results HSL produces.",
    },
    {
      q: 'Can I lock a colour and regenerate the rest?',
      a: 'Yes — lock any swatch you want to keep, and regenerating only recomputes the unlocked ones around it.',
    },
    {
      q: 'What can I export?',
      a: 'CSS custom properties, a Tailwind v4 @theme block, JSON with every contrast figure included, or an SVG swatch sheet.',
    },
    {
      q: 'Is it free?',
      a: 'Yes — free, no signup, and no limit on how many palettes you generate.',
    },
  ],
  supportContent: EXAMPLES_SUPPORT,
}
