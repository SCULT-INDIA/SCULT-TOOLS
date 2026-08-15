import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'color-palette-generator-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every claim checked against lib/tools/color-palette-generator/meta.ts —
 * OKLCH vs HSL perceptual uniformity, the lock-and-regenerate feature, and
 * the real export formats (CSS custom properties, Tailwind v4 @theme, JSON,
 * SVG — not the v3 JS-config format some guides still describe).
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'OKLCH vs HSL for Colour Palettes: Why Your Old Palette Looks Uneven',
  h1: 'Why does one colour in your palette always look "off" next to the others?',
  targetKeyword: 'color palette generator',
  description:
    'HSL lightness does not match how humans actually perceive brightness — which is why HSL-based palettes look uneven. OKLCH fixes it. A free generator with WCAG contrast built in.',
  dek: 'Pick five colours at the same HSL lightness value and one of them will look noticeably brighter or darker than the rest, every time — not a mistake, a property of the colour model itself. Here is why, what OKLCH does differently, and a generator that builds palettes the corrected way by default.',
  sections: [
    {
      heading: 'The HSL bug nobody tells you is a bug',
      body: [
        [
          'Set an HSL colour\'s lightness value to 50% for yellow, and separately set lightness to 50% for blue, and look at them side by side: the yellow reads as visibly, dramatically brighter than the blue, despite both carrying the identical lightness number. This is not a rendering quirk or a display calibration issue — it is a structural property of the HSL colour model itself, and the actual gap in perceived luminance between the two at "the same" lightness value can run to roughly 4x in real measured brightness. Any palette built by holding HSL lightness constant across different hues will therefore look lumpy: some swatches read as louder or darker than the designer intended, entirely independent of the actual colours chosen.',
        ],
        [
          'The ',
          { text: 'Colour Palette Generator', href: '/design/color-palette-generator' },
          ' on this site computes every harmony in OKLCH instead of HSL specifically to close that gap. OKLCH is perceptually uniform by design — holding lightness constant across different hues in OKLCH actually produces swatches that look equally light to a human eye, because the model was built from real perceptual research rather than a simple geometric transform of RGB values the way HSL is. A ten-step lightness ramp built in OKLCH stays evenly spaced the whole way through; the equivalent HSL ramp visibly bunches up and thins out at different points depending on the hue.',
        ],
      ],
    },
    {
      heading: 'The four harmony rules this generator actually offers',
      body: [
        [
          "Complementary pairs a base colour with its opposite on the colour wheel, for strong, high-contrast pairings. Analogous picks colours sitting near each other on the wheel, for a calmer, more cohesive palette with less visual tension between swatches. Triadic spaces three colours evenly around the wheel, for a balanced, vibrant combination that avoids the starkness of a pure complementary pair. A monochrome ramp holds one hue constant while stepping lightness up and down — the specific case where OKLCH's perceptual evenness matters most visibly, since the entire point of a monochrome ramp is a smooth, evenly-spaced progression from light to dark.",
        ],
        [
          "Pick a base colour, choose whichever harmony rule matches the mood you're after, and every swatch in the resulting palette is automatically checked for contrast — each one labelled with its actual ratio against both white and black text, so you know immediately which swatches can safely carry body copy and which are decorative-only.",
        ],
      ],
    },
    {
      heading: 'Locking a swatch and regenerating the rest',
      body: [
        [
          'Found one colour in a generated batch that is exactly right, but want the rest of the palette to keep exploring around it? Lock that specific swatch, and regenerating only recomputes the unlocked slots — the locked colour stays fixed while everything else refreshes around it. This solves a real, common frustration with palette generators generally: regenerating usually means starting completely over and losing the one good colour you had already found, forcing you to either accept an imperfect palette or hunt from scratch for that exact hue again.',
        ],
      ],
    },
    {
      heading: 'Why WCAG contrast is checked automatically, not left as homework',
      body: [
        [
          'A palette that looks striking on a design mockup but fails 4.5:1 contrast on body text is not a usable palette, regardless of how good it looks — it is an accessibility failure waiting to ship, and one that disproportionately affects users with low vision who are simply trying to read the actual content. Rather than leaving contrast checking as a separate, easy-to-skip step after a palette is chosen, every swatch here is checked automatically the moment it is generated, against both white and black text, so the information is present at the point of decision rather than discovered later during a design review or, worse, an accessibility audit after launch.',
        ],
      ],
    },
    {
      heading: 'The Tailwind v4 export detail worth knowing',
      body: [
        [
          "One specific, current detail worth flagging because a fair amount of content online is still describing the older approach: exporting for Tailwind here produces a v4-style CSS-first @theme block — `@theme { --color-brand-primary: #2563EB; }` — not the older Tailwind v3 JavaScript config file approach (`theme.extend.colors` inside tailwind.config.js). Tailwind v4 moved colour and design-token declaration into plain CSS rather than a JS config object, and this generator's export matches that current convention directly rather than producing an output that would need manual translation before it actually works in a current Tailwind v4 project.",
        ],
        [
          'Beyond the Tailwind export, the tool also produces plain CSS custom properties (`:root { --brand-primary: #2563EB; }`) for any framework or plain-CSS project, a JSON export carrying every contrast figure alongside each hex value for programmatic use, and an SVG swatch sheet for quickly sharing or presenting the palette visually without opening a design tool.',
        ],
      ],
    },
    {
      heading: 'Worked example: building a palette for a SaaS dashboard',
      body: [
        [
          'Start with a base colour that matches your brand — a deep blue works well for a SaaS product aiming for trustworthy and technical rather than playful. Pick Analogous for a cohesive dashboard palette where multiple UI states (default, hover, active, disabled) all need to feel like they belong to the same family rather than clashing. Check the contrast badges on each swatch before committing any of them to actual interface text — a swatch that looks fine as an accent colour on a button may fail outright as body text on a light background.',
        ],
        [
          "Lock whichever swatch you're using as your primary brand accent color once you're happy with it, regenerate the rest a few times to explore supporting colours around it, then export as a Tailwind v4 @theme block if that's your stack — ready to paste directly into your project's global CSS with no manual translation required.",
        ],
      ],
    },
    {
      heading: 'What a generator can build, and what only real strategy decides',
      body: [
        [
          'A palette this tool produces is a technically sound, accessible starting point — nothing more, and it says so plainly. A genuine brand colour system needs to carry actual meaning specific to a business: which colour represents success versus warning versus error in a product interface, which is the primary call-to-action colour across an entire site, how the palette needs to work across dozens of different contexts a single generated batch cannot anticipate. That is brand strategy work, not palette generation.',
        ],
        [
          'If colour is one piece of a bigger identity decision that also includes logo, typography and positioning, ',
          {
            text: "that's the full scope Scult's branding team works across",
            href: SERVICE.href,
            external: true,
          },
          '.',
        ],
        [
          'Want an outside opinion on a palette before it becomes permanent across your product? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " — bring what you've generated and we'll talk through whether it actually holds up at scale.",
        ],
      ],
    },
    {
      heading: 'Once the palette is locked in',
      body: [
        [
          'A finished colour system pairs naturally with a matching favicon — the ',
          { text: 'Favicon Generator', href: '/dev/favicon-generator' },
          ' lets you pull the exact hex values from this palette straight into a browser-tab icon, so the smallest visible piece of your brand matches the rest of it exactly rather than being picked separately.',
        ],
      ],
    },
  ],
  relatedTools: [
    'color-palette-generator',
    'favicon-generator',
    'business-name-generator',
    'slogan-generator',
  ],
  relatedPrompts: ['visual-identity-mood-board-brief'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
