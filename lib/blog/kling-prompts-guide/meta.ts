import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'kling-prompts-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/kling/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Kling AI Prompts: Built for High-Motion, Physically Realistic Scenes',
  h1: "Most video models fumble fast motion. Kling's actual strength is exactly that.",
  targetKeyword: 'kling ai video prompts',
  description:
    'Kling prompts that use its documented strength — high-motion scenes and physical realism — for action beats and product-in-motion sequences.',
  dek: "A slow, static camera pan is the easy case for AI video generation. Kling's genuine differentiator is handling fast motion and physical realism — the harder case most models still struggle with.",
  sections: [
    {
      heading: "Kling's real strength: motion that looks physically correct",
      body: [
        [
          "Most AI video models handle a slow, mostly static shot competently and start visibly breaking down the moment real motion or physical interaction enters the frame — objects that should collide pass through each other, fabric that should flow moves unnaturally, fast action turns into a smeared blur. Kling's documented strength is specifically handling high-motion scenes with more physical plausibility than most competing models. The ",
          { text: 'Kling prompt library', href: '/prompts/kling' },
          ' is built around exactly that strength, not generic video generation.',
        ],
      ],
    },
    {
      heading: 'Action sequences: describing motion with real specificity',
      body: [
        [
          'A high-motion action scene — ',
          { text: 'this prompt', href: '/prompts/kling/kling-high-motion-action-scene' },
          ' — works best when the motion itself is described with real specificity: the direction, speed and physical cause of the movement, not just "an action scene happens." Kling responds to that specificity by producing genuinely more coherent motion than a vague action description would generate.',
        ],
      ],
    },
    {
      heading: 'Product-in-motion: showing what a product actually does',
      body: [
        [
          'A product demo motion sequence — ',
          {
            text: 'this prompt',
            href: '/prompts/kling/kling-product-demo-motion-sequence',
          },
          ' — leans on the same physical-realism strength for a genuinely commercial use case: showing a product actually moving, opening, pouring or being used, where a static product shot cannot convey the same information. This is exactly the kind of shot other video models tend to render with visible physical inconsistencies.',
        ],
      ],
    },
    {
      heading: 'Writing the brief: what to specify beyond the subject',
      body: [
        [
          'Beyond describing the subject, specifying camera behaviour explicitly — a static camera, a tracking shot following the action, a quick cut — gives Kling clearer direction than leaving the camera implicit. Duration and pacing matter too: a brief meant for a short, punchy clip should say so explicitly rather than leaving pacing to be inferred from the subject alone.',
        ],
      ],
    },
    {
      heading: 'When motion generation is one piece of a bigger video campaign',
      body: [
        [
          'A single generated clip serves one specific need. A coordinated video campaign — consistent style across multiple clips, tied to a real product launch or brand moment — is bigger creative direction work. ',
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
  relatedTools: ['color-palette-generator', 'utm-builder'],
  relatedPrompts: [
    'kling-high-motion-action-scene',
    'kling-product-demo-motion-sequence',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 9,
}
