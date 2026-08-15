import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'midjourney-prompts-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/midjourney/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Midjourney V7 Prompts: Natural Language Beats a Keyword Stack Now',
  h1: 'Midjourney V7 wants a sentence, not a comma-separated keyword pile',
  targetKeyword: 'midjourney prompts',
  description:
    'Midjourney prompts written for the V7 era — natural-language briefs over keyword stacks, with --stylize/--chaos/--ar guidance matching how the current model actually behaves.',
  dek: 'Prompting advice for Midjourney V4 or V5 — stack keywords, separate with commas — actively hurts results on V7, which reads a genuine natural-language sentence far better than a keyword pile.',
  sections: [
    {
      heading: 'Why V7 broke the old keyword-stacking advice',
      body: [
        [
          'Older Midjourney prompting guidance recommended stacking descriptive keywords separated by commas — a habit from earlier model versions that read prompts more literally. Midjourney V7 understands a genuine natural-language sentence significantly better, and following the old keyword-stack advice on the current model actively produces worse results than just describing the image in a real sentence. The ',
          { text: 'Midjourney prompt library', href: '/prompts/midjourney' },
          ' is written for V7 specifically.',
        ],
        [
          'The foundational prompt, a ',
          {
            text: 'natural-language portrait brief for V7',
            href: '/prompts/midjourney/midjourney-v7-natural-language-portrait-brief',
          },
          ', demonstrates the shift directly — a full descriptive sentence rather than a stacked keyword list.',
        ],
      ],
    },
    {
      heading: 'Parameters that still matter: stylize, chaos, and aspect ratio',
      body: [
        [
          "--stylize controls how much Midjourney's own aesthetic bias applies versus following the prompt literally, and --chaos controls variation between the four initial grid results. Exploring concept art with those two dialled deliberately — ",
          {
            text: 'this prompt',
            href: '/prompts/midjourney/midjourney-stylize-chaos-concept-art-exploration',
          },
          ' — treats them as genuine creative controls, not settings to leave at default and forget.',
        ],
      ],
    },
    {
      heading: 'Consistency: character, style, and product references',
      body: [
        [
          'Keeping a character consistent across a comic — ',
          {
            text: 'this prompt',
            href: '/prompts/midjourney/midjourney-character-reference-consistent-comic-character',
          },
          ' — brand campaign visuals consistent via style reference — ',
          {
            text: 'covered here',
            href: '/prompts/midjourney/midjourney-style-reference-brand-campaign-consistency',
          },
          ' — and a product consistent across multiple scenes via Omni Reference — ',
          {
            text: 'this prompt',
            href: '/prompts/midjourney/midjourney-omni-reference-product-across-scenes',
          },
          ' — are three distinct reference mechanisms solving three distinct consistency problems.',
        ],
      ],
    },
    {
      heading: 'Editing an existing generation: vary region, pan, and zoom out',
      body: [
        [
          'Targeted region edits on a generated image — ',
          {
            text: 'this prompt',
            href: '/prompts/midjourney/midjourney-vary-region-targeted-image-edit',
          },
          ' — fix one specific part without regenerating the whole composition. Panning and extending a scene — ',
          {
            text: 'covered here',
            href: '/prompts/midjourney/midjourney-pan-extend-scene-composition',
          },
          ' — and zooming out to reveal more environment — ',
          {
            text: 'this prompt',
            href: '/prompts/midjourney/midjourney-zoom-out-reveal-environment',
          },
          ' — both extend an existing composition rather than starting fresh.',
        ],
      ],
    },
    {
      heading: 'Clean product photography and negative prompting',
      body: [
        [
          'Clean, distraction-free product photography — ',
          {
            text: 'this negative-prompt-driven prompt',
            href: '/prompts/midjourney/midjourney-negative-prompt-clean-product-photography',
          },
          " — uses Midjourney's negative-prompt syntax to explicitly exclude common unwanted artifacts, complementing what the positive prompt already describes.",
        ],
      ],
    },
    {
      heading: 'Batches, patterns, and icon sets',
      body: [
        [
          'A permutation prompt generating a whole batch of icon variants at once — ',
          {
            text: 'this prompt',
            href: '/prompts/midjourney/midjourney-permutation-prompt-icon-batch-set',
          },
          ' — beats generating each icon individually. Seamless tile pattern design — ',
          {
            text: 'covered here',
            href: '/prompts/midjourney/midjourney-seamless-tile-pattern-design',
          },
          ' — needs specific tiling-aware phrasing most single-image prompts skip, and locking a seed for consistent icon sets — ',
          {
            text: 'this prompt',
            href: '/prompts/midjourney/midjourney-seed-locked-icon-set-consistency',
          },
          ' — keeps a whole set visually unified.',
        ],
      ],
    },
    {
      heading: 'Text-free logo concepts and image-to-video',
      body: [
        [
          'Midjourney remains unreliable at rendering legible text — ',
          {
            text: 'a text-free logo mark concept prompt',
            href: '/prompts/midjourney/midjourney-text-free-logo-mark-concept',
          },
          ' works around that limitation by designing a mark that needs no text at all. And animating a still image into motion — ',
          {
            text: 'this prompt',
            href: '/prompts/midjourney/midjourney-image-to-video-animate-still',
          },
          " — extends a generated still into Midjourney's newer video capability.",
        ],
      ],
    },
    {
      heading: 'When generated visuals need to become a real brand system',
      body: [
        [
          'These prompts produce excellent individual images. Turning consistent visual output into an actual, coherent brand identity across every touchpoint is bigger design work. ',
          {
            text: "That's exactly what Scult's branding team does",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your visual identity.',
        ],
      ],
    },
  ],
  relatedTools: ['color-palette-generator', 'favicon-generator'],
  relatedPrompts: [
    'midjourney-v7-natural-language-portrait-brief',
    'midjourney-style-reference-brand-campaign-consistency',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
