import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'image-generation-prompts-roundup'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'Midjourney vs Nano Banana vs Flux vs Ideogram: Which Image Model for What',
  h1: 'Four image models, four genuinely different specialties',
  targetKeyword: 'best ai image model for product photos',
  description:
    'Midjourney for aesthetic exploration, Nano Banana for precise edits, Flux for photorealistic commercial work, Ideogram for legible text — picking the right model, not just any model.',
  dek: 'Reaching for whichever image model you already have open, regardless of the task, wastes real capability differences between these four tools — each one is genuinely strongest at something specific.',
  sections: [
    {
      heading: 'Midjourney: aesthetic exploration and V7 natural language',
      body: [
        [
          'The ',
          { text: 'Midjourney library', href: '/prompts/midjourney' },
          ' is written for V7 specifically — natural-language prompts over keyword stacks, plus --stylize/--chaos parameters for genuine creative exploration, character and style references for consistency, and Vary Region for targeted edits.',
        ],
      ],
    },
    {
      heading: 'Nano Banana: precise, local edits that leave everything else alone',
      body: [
        [
          "Gemini's image model, covered in the ",
          { text: 'Nano Banana library', href: '/prompts/nano-banana' },
          ", is strongest at editing one specific part of an image while leaving the rest untouched — a genuinely different capability from full-image regeneration, and the reason it became 2026's breakout tool for e-commerce and product photography specifically.",
        ],
      ],
    },
    {
      heading: 'Flux: photographic vocabulary, no negative-prompt field',
      body: [
        [
          'The ',
          { text: 'Flux library', href: '/prompts/flux' },
          ' is built around a real structural constraint — Flux has no negative-prompt parameter at all, so every steering decision happens through positive description. Strong for photorealistic commercial work with real photographic vocabulary (lighting, lens, composition).',
        ],
      ],
    },
    {
      heading: 'Ideogram: the only one of the four that reliably spells words correctly',
      body: [
        [
          'The ',
          { text: 'Ideogram library', href: '/prompts/ideogram' },
          ' exists because text rendering is the one area most image models still fail at — Ideogram was built specifically to render legible, correctly-spelled text, making it the right choice for posters and wordmark logo concepts, and a poor fit for anything that does not need embedded text.',
        ],
      ],
    },
    {
      heading: 'A quick decision guide',
      body: [
        [
          'Need a poster or logo with real text: Ideogram. Need a precise edit to an existing photo: Nano Banana. Need photorealistic product or lifestyle photography: Flux or Nano Banana. Need broad aesthetic exploration or a consistent character across a comic or brand campaign: Midjourney.',
        ],
      ],
    },
    {
      heading: 'When generated imagery needs to become a full identity',
      body: [
        [
          'Strong individual images are a starting point. Coordinating consistent visual output into a real brand system is bigger creative work. ',
          {
            text: "That's the scope Scult's branding team covers",
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
    'nano-banana-ecommerce-product-photography',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
