import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'veo-prompts-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/veo/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title:
    'Veo Prompts: the Layered Brief Structure That Separates a Real Clip From a Lottery Ticket',
  h1: 'Stop describing a Veo video in one sentence and hoping',
  targetKeyword: 'veo ai video prompts',
  description:
    'Veo prompts structured as layered briefs — subject and action, camera move, environment, style, native audio — the structure separating a usable clip from a lottery ticket.',
  dek: "A one-sentence Veo prompt is a lottery ticket — sometimes it works, mostly it doesn't. A layered brief covering subject, camera, environment, style and audio separately gets a usable result far more reliably.",
  sections: [
    {
      heading: 'The layered brief structure that actually works',
      body: [
        [
          'A single flowing sentence describing everything at once leaves too much to inference — Veo produces measurably more consistent, usable results from a layered brief: subject and action described first, then one specific camera move, then the environment, then visual style, then native audio direction, as distinct layers rather than one run-on description. The ',
          { text: 'Veo prompt library', href: '/prompts/veo' },
          ' is structured around exactly that layering.',
        ],
      ],
    },
    {
      heading: 'Commercial use cases: product, automotive, real estate, fashion',
      body: [
        [
          'A cinematic product showcase — ',
          { text: 'this prompt', href: '/prompts/veo/veo-cinematic-product-showcase' },
          ' — an automotive commercial reveal — ',
          { text: 'covered here', href: '/prompts/veo/veo-automotive-commercial-reveal' },
          ' — a real estate interior walkthrough — ',
          {
            text: 'this prompt',
            href: '/prompts/veo/veo-real-estate-interior-walkthrough',
          },
          ' — and fashion lookbook motion — ',
          { text: 'covered here', href: '/prompts/veo/veo-fashion-lookbook-motion' },
          ' — each apply the layered brief to a distinct commercial genre with its own camera and pacing conventions.',
        ],
      ],
    },
    {
      heading: 'Native audio: a Veo-specific advantage worth using deliberately',
      body: [
        [
          'Veo generates native audio alongside video — dialogue, ambient sound, music — which most competing tools handle as a separate post-production step. Two-character dialogue — ',
          { text: 'this prompt', href: '/prompts/veo/veo-dialogue-two-characters' },
          ' — and voiceover narration for an explainer — ',
          {
            text: 'covered here',
            href: '/prompts/veo/veo-voiceover-narration-explainer',
          },
          ' — both lean directly on that native audio capability rather than planning to add sound afterward.',
        ],
      ],
    },
    {
      heading: 'Short-form and UGC: built for how social platforms actually work',
      body: [
        [
          'A short-form hook designed for vertical video — ',
          { text: 'this prompt', href: '/prompts/veo/veo-short-form-hook-vertical' },
          ' — and a UGC-testimonial-style ad — ',
          { text: 'covered here', href: '/prompts/veo/veo-ugc-testimonial-style-ad' },
          ' — both target the specific format and register that actually performs on short-form social platforms, not a shortened version of a long-form ad.',
        ],
      ],
    },
    {
      heading: 'Consistency and continuation across multiple shots',
      body: [
        [
          'Keeping a character consistent via a reference image — ',
          {
            text: 'this prompt',
            href: '/prompts/veo/veo-character-consistency-reference-image',
          },
          ' — and a multi-shot continuation sequence — ',
          {
            text: 'covered here',
            href: '/prompts/veo/veo-multishot-continuation-sequence',
          },
          ' — both address the genuine challenge of making several separately generated clips feel like they belong to the same continuous scene rather than disconnected fragments.',
        ],
      ],
    },
    {
      heading: 'Distinct visual styles: anime, stop-motion, retro VHS',
      body: [
        [
          'Beyond photorealistic footage, Veo handles genuinely distinct stylistic registers — a 2D cel-shaded anime style, covered by ',
          { text: 'this prompt', href: '/prompts/veo/veo-anime-2d-cel-shaded-style' },
          ', a stop-motion claymation aesthetic via ',
          { text: 'this one', href: '/prompts/veo/veo-stop-motion-claymation-style' },
          ', and a retro VHS/analog look via ',
          { text: 'this prompt', href: '/prompts/veo/veo-retro-vhs-analog-aesthetic' },
          ' — each needing its own specific stylistic vocabulary rather than a generic "make it stylized" instruction.',
        ],
      ],
    },
    {
      heading: 'Fixing common motion artifacts',
      body: [
        [
          'When a generated clip has visible motion artifacts — warping, unnatural physics, temporal flicker — ',
          {
            text: 'a dedicated fix-artifacts prompt',
            href: '/prompts/veo/veo-fix-common-motion-artifacts',
          },
          ' addresses the specific, recurring failure patterns rather than regenerating blindly and hoping the next attempt avoids them by chance.',
        ],
      ],
    },
    {
      heading: 'When video needs to be part of a real brand campaign',
      body: [
        [
          'Individual clips solve individual needs. Coordinating video across a full campaign — consistent style, tied to a real product launch — is bigger creative direction work. ',
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
    'veo-cinematic-product-showcase',
    'veo-character-consistency-reference-image',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
