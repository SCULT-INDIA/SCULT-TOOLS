import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'video-audio-prompts-roundup'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'Veo vs Kling vs Suno vs ElevenLabs: AI Video and Audio, by Strength',
  h1: 'Cinematic Veo, high-motion Kling, and audio that actually sounds intentional',
  targetKeyword: 'ai video generation tools comparison',
  description:
    'Veo for layered cinematic briefs with native audio, Kling for physically realistic high-motion scenes, Suno and ElevenLabs for music and voice — matched to what each does best.',
  dek: 'AI video and audio generation splits cleanly by strength: Veo for structured, native-audio cinematic clips, Kling for motion and physical realism, Suno and ElevenLabs for sound specifically.',
  sections: [
    {
      heading: 'Veo: layered briefs and native audio',
      body: [
        [
          'The ',
          { text: 'Veo library', href: '/prompts/veo' },
          ' is built around a layered brief structure — subject and action, camera move, environment, style, and audio direction as separate layers, not one run-on sentence. Veo generates native audio (dialogue, ambient sound) alongside video, a real advantage over models that treat audio as a separate post-production step.',
        ],
      ],
    },
    {
      heading: 'Kling: the specialist for motion and physical realism',
      body: [
        [
          'The ',
          { text: 'Kling library', href: '/prompts/kling' },
          ' targets exactly what most video models handle poorly — fast motion and physical interaction that should look genuinely plausible, not smeared or physically inconsistent. High-motion action and product-in-motion demos are its specific strength.',
        ],
      ],
    },
    {
      heading: 'Suno: the two-field music format',
      body: [
        [
          'The ',
          { text: 'Music & Voice library', href: '/prompts/ai-audio' },
          " covers Suno's two-field Style-plus-tagged-Lyrics format — treating them as genuinely separate inputs, not one undifferentiated music description, is what actually gives Suno the structure it needs.",
        ],
      ],
    },
    {
      heading: 'ElevenLabs: describing a character, not naming an adjective',
      body: [
        [
          'The same library covers ElevenLabs\' description-driven voice design — a genuine character description (age, accent, energy, a reference point) works measurably better than a vague adjective like "friendly."',
        ],
      ],
    },
    {
      heading: 'A quick decision guide',
      body: [
        [
          'Cinematic commercial clip with dialogue or voiceover: Veo. Fast action or product-in-motion: Kling. Background music or a jingle: Suno. A character voice or narration: ElevenLabs.',
        ],
      ],
    },
    {
      heading: 'When video and audio need to become a coordinated campaign',
      body: [
        [
          'Individual clips solve individual needs. A coordinated video and audio identity across a full campaign is bigger creative direction work. ',
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
  relatedTools: ['color-palette-generator', 'slogan-generator'],
  relatedPrompts: ['veo-cinematic-product-showcase', 'kling-high-motion-action-scene'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 10,
}
