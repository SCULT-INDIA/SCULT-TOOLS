import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'flux-prompts-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/flux/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Flux Prompts: Why There Is No Negative-Prompt Field',
  h1: 'Flux has no negative-prompt field — everything is steered through positive description',
  targetKeyword: 'flux ai image prompts',
  description:
    'Flux prompts written correctly for the model — everything steered through positive description since there is no negative-prompt field — with the photographic vocabulary it responds to.',
  dek: 'A prompt written with a negative-prompt section, copied over from a Midjourney or Stable Diffusion habit, simply does nothing in Flux. The model has no such field — steering has to happen entirely through what you describe wanting.',
  sections: [
    {
      heading: 'The structural difference that breaks copied prompts',
      body: [
        [
          'Flux has no negative-prompt parameter at all — a habit carried over from other image models, listing what to avoid in a separate negative field, simply does nothing here. Every steering decision has to happen through positive description: instead of "no blurry background," describe the sharp background you actually want. The ',
          { text: 'Flux prompt library', href: '/prompts/flux' },
          ' is written around that constraint specifically.',
        ],
      ],
    },
    {
      heading: 'Product photography with a real photographic vocabulary',
      body: [
        [
          'A clean e-commerce product shot on white background — ',
          {
            text: 'this prompt',
            href: '/prompts/flux/flux-ecommerce-product-white-background',
          },
          ' — and an editorial lifestyle photograph — ',
          {
            text: 'covered here',
            href: '/prompts/flux/flux-editorial-lifestyle-photograph',
          },
          ' — both lean on real photographic vocabulary (lighting setup, lens characteristics, composition) rather than vague style adjectives, since Flux responds to that specificity measurably better.',
        ],
      ],
    },
    {
      heading: 'Kontext: consistent characters and lifestyle compositing',
      body: [
        [
          'Flux Kontext keeping a character consistent across scenes — ',
          {
            text: 'this prompt',
            href: '/prompts/flux/flux-kontext-keep-character-consistent-across-scenes',
          },
          ' — and compositing a product photo into a lifestyle scene — ',
          {
            text: 'covered here',
            href: '/prompts/flux/flux-kontext-composite-product-photo-into-lifestyle-scene',
          },
          " — use Kontext's specific reference-image capability rather than a from-scratch generation.",
        ],
      ],
    },
    {
      heading: 'Fill: outpainting, inpainting, and virtual staging',
      body: [
        [
          "Extending an image's canvas to a new aspect ratio — ",
          {
            text: 'outpainting with Flux Fill',
            href: '/prompts/flux/flux-fill-outpaint-extend-canvas-to-new-aspect-ratio',
          },
          ' — removing or replacing an object — ',
          {
            text: 'inpainting, covered here',
            href: '/prompts/flux/flux-fill-inpaint-remove-or-replace-an-object',
          },
          ' — and virtual staging an empty room — ',
          {
            text: 'this prompt',
            href: '/prompts/flux/flux-fill-virtual-staging-empty-room',
          },
          ' — are three distinct editing tasks Fill handles, each needing its own specific framing.',
        ],
      ],
    },
    {
      heading: 'Depth and Redux: structural transfer and restyling',
      body: [
        [
          'Transferring pose and layout structure from a reference — ',
          {
            text: 'this Depth prompt',
            href: '/prompts/flux/flux-depth-structural-pose-and-layout-transfer',
          },
          " — keeps a composition's structure while changing its content. Restyling an existing photo for a new season or mood with Redux — ",
          {
            text: 'covered here',
            href: '/prompts/flux/flux-redux-restyle-an-existing-photo-for-a-new-season-or-mood',
          },
          ' — changes the feel while keeping the underlying subject recognisable.',
        ],
      ],
    },
    {
      heading: 'Flux 2 and Schnell: multi-reference sets and rapid ideation',
      body: [
        [
          "Flux 2's multi-reference capability generating a consistent product angle set — ",
          {
            text: 'this prompt',
            href: '/prompts/flux/flux-2-multi-reference-consistent-product-angle-set',
          },
          ' — and a UGC-style influencer ad photo — ',
          {
            text: 'covered here',
            href: '/prompts/flux/flux-2-ugc-style-influencer-ad-photo',
          },
          " — lean on the newer model's reference handling. Flux Schnell's rapid concept ideation batch — ",
          {
            text: 'this prompt',
            href: '/prompts/flux/flux-schnell-rapid-concept-ideation-batch',
          },
          ' — trades some quality for speed, useful specifically for exploring many directions fast before committing to one.',
        ],
      ],
    },
    {
      heading: 'Print resolution and painterly illustration',
      body: [
        [
          'A genuinely high-resolution print or poster brief — ',
          {
            text: 'this prompt',
            href: '/prompts/flux/flux-ultra-high-resolution-print-poster-brief',
          },
          " — plans for the resolution demands of physical printing specifically, not just screen display. And Flux 1 Dev's painterly concept-art illustration — ",
          {
            text: 'covered here',
            href: '/prompts/flux/flux-1-dev-painterly-concept-art-illustration',
          },
          ' — targets a genuinely different, non-photographic aesthetic.',
        ],
      ],
    },
    {
      heading: 'When generated imagery needs to become a full campaign',
      body: [
        [
          'These prompts produce strong individual images across many use cases. Coordinating consistent imagery across a full campaign or product line is bigger creative direction work. ',
          {
            text: "That's the scope Scult's branding team covers",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your campaign.',
        ],
      ],
    },
  ],
  relatedTools: ['color-palette-generator', 'favicon-generator'],
  relatedPrompts: [
    'flux-ecommerce-product-white-background',
    'flux-kontext-keep-character-consistent-across-scenes',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
