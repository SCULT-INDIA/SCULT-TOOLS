import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'ideogram-v3-poster-with-legible-text',
    category: 'ideogram',
    title: 'Put legible headline text on a poster with Ideogram V3',
    description:
      "A layout-and-typography brief that leans on Ideogram's core differentiator — reliably rendering the exact text you specify instead of garbled placeholder glyphs — for a real promotional poster.",
    promptText:
      'A {{poster_style}} poster design, large bold headline text that reads "{{headline_text}}", smaller subtext below that reads "{{subtext}}", {{visual_motif}}, color palette of {{color_palette}}, {{layout_note}}',
    variables: [
      {
        name: 'poster_style',
        description: 'The overall design genre/era of the poster.',
        example: 'retro mid-century travel',
        required: true,
      },
      {
        name: 'headline_text',
        description: 'The exact large headline text — keep it short (a few words).',
        example: 'SUMMER SALE',
        required: true,
      },
      {
        name: 'subtext',
        description: 'The exact smaller supporting line.',
        example: 'Up to 40% off, this weekend only',
        required: true,
      },
      {
        name: 'visual_motif',
        description: 'A graphic element that fills out the composition.',
        example: 'a stylized sun rising over minimalist wave shapes',
        required: true,
      },
      {
        name: 'color_palette',
        description: 'The dominant colors.',
        example: 'burnt orange, cream, and teal',
        required: true,
      },
      {
        name: 'layout_note',
        description: 'Where each element sits in the frame.',
        example:
          'headline centered in the top two-thirds, subtext in a clean sans-serif band along the bottom',
        required: false,
      },
    ],
    targetTools: ['Ideogram V3'],
    tags: ['ideogram', 'text-in-image', 'poster-design', 'typography'],
    whyItWorks:
      "Ideogram's headline strength relative to Midjourney, Flux, and Nano Banana is specifically legible in-image text — most diffusion image models historically mangle typography (extra or missing letters, warped glyphs, words that are almost-but-not-quite right), and Ideogram was trained with that specific failure mode as a target to fix. Putting the exact copy in quotation marks is the documented convention for telling Ideogram what should render verbatim, as distinct from everything else in the prompt, which it treats as scene and style description rather than text to draw. Keep the quoted copy short — a headline plus one short subtext line, not a paragraph — because even Ideogram's improved text engine degrades on longer strings.",
    exampleOutput:
      "A poster where the specified headline and subtext render as legible, largely-correct text sitting inside a stylized illustrated background — spot-check the spelling before shipping, since verbatim accuracy is Ideogram's strength but isn't a 100% guarantee on every generation.",
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-07-30' }],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Ideogram V3 for in-image text accuracy.',
      },
    ],
  },
  {
    slug: 'ideogram-v3-logo-icon-concept',
    category: 'ideogram',
    title: 'Sketch a logo and wordmark concept with Ideogram V3',
    description:
      'A descriptor-stacked logo-concepting brief for Ideogram V3, pairing its text-rendering strength (a legible wordmark) with a simple flat icon mark — early-stage creative direction, not a production-ready vector file.',
    promptText:
      'Minimalist flat vector logo design for a brand called "{{brand_name}}", {{icon_concept}}, paired with clean sans-serif wordmark text that reads "{{brand_name}}" beside the icon, {{color_palette}}, {{style_descriptor}}, on a plain white background, no gradients, no drop shadows',
    variables: [
      {
        name: 'brand_name',
        description: 'The exact brand name to render as the wordmark.',
        example: 'Northfold',
        required: true,
      },
      {
        name: 'icon_concept',
        description: 'What the icon mark depicts, described concretely.',
        example:
          'a simple geometric mark of a folded paper map corner forming an abstract mountain peak',
        required: true,
      },
      {
        name: 'color_palette',
        description: 'The palette the mark and wordmark should use.',
        example: 'deep forest green and warm sand',
        required: true,
      },
      {
        name: 'style_descriptor',
        description: 'The visual style/weight of the linework.',
        example: 'modern, geometric, single-weight line work',
        required: false,
      },
    ],
    targetTools: ['Ideogram V3'],
    tags: ['ideogram', 'logo-design', 'icon-concept', 'branding', 'wordmark'],
    whyItWorks:
      "This uses classic descriptor-stacking — icon concept, then the explicit wordmark instruction, then color, then style, then background/negative-space constraints as a flat itemized list — because a logo brief benefits from unambiguous, itemized specification more than the flowing natural-language phrasing that works for a Midjourney V7 portrait. Ideogram is the right tool for the wordmark specifically because it's the model family that most reliably keeps a short brand name legible instead of turning it into abstract squiggles, which is where most other image models fall apart on logo work. Treat the output as concept direction and moodboard input, not a deliverable: no current text-to-image model outputs a clean, infinitely-scalable vector file, so a designer still needs to rebuild the winning direction in real vector software before it goes anywhere near production.",
    exampleOutput:
      'A flat, poster-like logo concept combining an icon mark and a mostly-legible wordmark on a plain background — useful for picking a creative direction with a client, not as a final logo asset.',
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Ideogram V3 for wordmark legibility in logo concepts.',
      },
    ],
    relatedToolSlug: 'business-name-generator',
  },
]
