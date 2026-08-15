import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'nano-banana-prompts-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/nano-banana/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Nano Banana Prompts: Product Photography Without a Studio',
  h1: "Gemini's image model does something most models still can't: precise edits",
  targetKeyword: 'nano banana prompts',
  description:
    "Nano Banana (Gemini's image model) prompts for photorealistic product shots, precise local edits, and consistent characters — the specific strengths that made it 2026's breakout image tool.",
  dek: "Most image models regenerate the whole picture when you ask for one small change. Nano Banana's actual differentiator is precise local edits that leave everything else untouched — a genuinely different capability, not just better photorealism.",
  sections: [
    {
      heading: "The capability that made this Gemini's breakout image model",
      body: [
        [
          "Nano Banana's genuine differentiator is precision — editing one specific part of an image while leaving the rest completely untouched, something most generative image models cannot do reliably. The ",
          { text: 'Nano Banana prompt library', href: '/prompts/nano-banana' },
          ' leans on that precision directly, alongside photorealistic product photography and consistent character generation.',
        ],
        [
          'The clearest demonstration is ',
          {
            text: 'a precise local edit that preserves everything else',
            href: '/prompts/nano-banana/nano-banana-precise-local-edit-preserve-rest',
          },
          ' — the specific prompt structure that gets a model to change one element without regenerating the whole scene.',
        ],
      ],
    },
    {
      heading: 'E-commerce product photography without a studio',
      body: [
        [
          'A ',
          {
            text: 'genuine e-commerce product photography shot',
            href: '/prompts/nano-banana/nano-banana-ecommerce-product-photography',
          },
          ' and a ',
          {
            text: 'pure white background for marketplace listings',
            href: '/prompts/nano-banana/nano-banana-pure-white-background-marketplace',
          },
          ' both replace what used to require a real photography setup. A ',
          {
            text: 'multi-angle product turnaround',
            href: '/prompts/nano-banana/nano-banana-multi-angle-product-turnaround',
          },
          ' generates the several angles a listing typically needs from one source image.',
        ],
      ],
    },
    {
      heading: 'Local edits: removing objects, swapping backgrounds, seasonal variants',
      body: [
        [
          'Removing an unwanted object from a photo — ',
          {
            text: 'this prompt',
            href: '/prompts/nano-banana/nano-banana-remove-unwanted-object-from-photo',
          },
          ' — and swapping a seasonal background behind an existing product shot — ',
          {
            text: 'covered here',
            href: '/prompts/nano-banana/nano-banana-seasonal-background-swap-product',
          },
          ' — both lean on the precise-edit capability to change one thing without regenerating the whole image from scratch.',
        ],
      ],
    },
    {
      heading: 'Consistent characters and virtual try-on',
      body: [
        [
          'Keeping a character consistent across multiple scenes — ',
          {
            text: 'this prompt',
            href: '/prompts/nano-banana/nano-banana-consistent-character-multiple-scenes',
          },
          ' — and a virtual outfit try-on — ',
          {
            text: 'covered here',
            href: '/prompts/nano-banana/nano-banana-virtual-outfit-tryon',
          },
          ' — both depend on the model actually recognising and preserving the same subject across generations, a genuinely hard problem most models handle inconsistently.',
        ],
      ],
    },
    {
      heading: 'Real estate, food, and lifestyle photography',
      body: [
        [
          'Virtual staging for real estate listings — ',
          {
            text: 'this prompt',
            href: '/prompts/nano-banana/nano-banana-real-estate-virtual-staging',
          },
          ' — food and menu photography — ',
          {
            text: 'covered here',
            href: '/prompts/nano-banana/nano-banana-food-menu-photography',
          },
          ' — and a UGC-style lifestyle ad photo — ',
          {
            text: 'this prompt',
            href: '/prompts/nano-banana/nano-banana-ugc-style-lifestyle-ad-photo',
          },
          ' — each target a specific commercial photography niche rather than generic image generation.',
        ],
      ],
    },
    {
      heading: 'Mockups: apparel, packaging, and signage',
      body: [
        [
          'A product mockup on apparel — ',
          {
            text: 'this prompt',
            href: '/prompts/nano-banana/nano-banana-product-mockup-on-apparel',
          },
          ' — a packaging render — ',
          {
            text: 'covered here',
            href: '/prompts/nano-banana/nano-banana-packaging-mockup-render',
          },
          ' — and a storefront signage mockup — ',
          {
            text: 'this prompt',
            href: '/prompts/nano-banana/nano-banana-storefront-signage-mockup',
          },
          ' — let a design be visualised in its real context before committing to production.',
        ],
      ],
    },
    {
      heading: 'Restoration, headshots, and legible text on posters',
      body: [
        [
          'Restoring a damaged old photo — ',
          {
            text: 'this prompt',
            href: '/prompts/nano-banana/nano-banana-restore-damaged-old-photo',
          },
          ' — and turning a selfie into a professional headshot — ',
          {
            text: 'covered here',
            href: '/prompts/nano-banana/nano-banana-professional-headshot-from-selfie',
          },
          ' — are two genuinely practical, non-commercial uses. And a poster with legible embedded text — ',
          {
            text: 'this prompt',
            href: '/prompts/nano-banana/nano-banana-poster-with-legible-text',
          },
          ' — targets a capability many image models still handle poorly.',
        ],
      ],
    },
    {
      heading: 'When product photography needs to be part of a full launch',
      body: [
        [
          'These prompts replace a photography studio for individual shots. A full product launch — consistent photography across dozens of SKUs, a coordinated visual system — is bigger creative direction work. ',
          {
            text: "That's the scope Scult's branding team handles",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your launch.',
        ],
      ],
    },
  ],
  relatedTools: ['color-palette-generator', 'favicon-generator'],
  relatedPrompts: [
    'nano-banana-ecommerce-product-photography',
    'nano-banana-precise-local-edit-preserve-rest',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
