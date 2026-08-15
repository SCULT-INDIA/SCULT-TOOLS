import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ai-music-voice-prompts-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/ai-audio/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Suno & ElevenLabs Prompts: the Two-Field Format That Actually Works',
  h1: 'Suno wants two separate fields, not one long music description',
  targetKeyword: 'suno elevenlabs prompts',
  description:
    "Suno's Style plus tagged-Lyrics format for music, and ElevenLabs' description-driven voice design — the specific input structure each tool actually expects.",
  dek: 'Both Suno and ElevenLabs respond to a specific input structure that most first-time users skip past — Suno wants Style and Lyrics as genuinely separate fields, and ElevenLabs wants a described character, not a vague adjective.',
  sections: [
    {
      heading: 'Two tools, two genuinely different input structures',
      body: [
        [
          'Suno\'s two-field format — Style and tagged Lyrics as separate inputs — and ElevenLabs\' description-driven voice design are structurally different from each other, and both differ from a generic "write me a prompt" approach. The ',
          { text: 'Music & Voice prompt library', href: '/prompts/ai-audio' },
          " is built around each tool's actual input format specifically.",
        ],
      ],
    },
    {
      heading: 'Suno: Style and Lyrics as separate, structured fields',
      body: [
        [
          'A ',
          { text: 'brand jingle', href: '/prompts/ai-audio/suno-brand-jingle' },
          ' works best when the Style field describes genre, tempo and instrumentation precisely, and the Lyrics field uses section tags ([Verse], [Chorus]) rather than one undifferentiated block of text — the two-field separation is what actually gives Suno the structure to work with rather than guessing at song structure from a single description.',
        ],
        [
          'For an ',
          {
            text: 'instrumental background track',
            href: '/prompts/ai-audio/suno-instrumental-background-track',
          },
          ' with no lyrics at all, the Style field alone carries the entire brief — mood, pacing, instrumentation — since there is no lyric content to lean on for direction.',
        ],
      ],
    },
    {
      heading: 'ElevenLabs: describing a character, not naming an adjective',
      body: [
        [
          '"Sound friendly" is a vague, unusable direction for a voice model. ',
          {
            text: 'Character voice design in ElevenLabs',
            href: '/prompts/ai-audio/elevenlabs-character-voice-design',
          },
          ' works by describing a genuine character — age, accent, energy, a specific reference point — the same principle that makes any AI generation task work better with concrete description over an abstract adjective.',
        ],
      ],
    },
    {
      heading: 'Worked example: a jingle with a matching voiceover',
      body: [
        [
          "For a short branded audio piece with both music and a voiceover, treat them as two separate generation tasks with two separate prompts — a Suno instrumental for the music bed, and an ElevenLabs character-voice prompt for the voiceover — rather than trying to get one tool to handle both. Match the described character's energy in ElevenLabs to the tempo and mood specified in Suno's Style field so the two halves feel like they belong to the same piece.",
        ],
      ],
    },
    {
      heading: 'When audio needs to be part of a bigger brand identity',
      body: [
        [
          "A jingle or a voice is one piece of a brand's overall sensory identity, alongside visual identity, tone of voice, and everything else that makes a brand recognisable. If audio identity needs to be considered as part of that bigger picture, ",
          {
            text: "that's the scope Scult's branding team covers",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          " to talk through your brand's full identity.",
        ],
      ],
    },
  ],
  relatedTools: ['color-palette-generator', 'slogan-generator'],
  relatedPrompts: ['suno-brand-jingle', 'elevenlabs-character-voice-design'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 9,
}
