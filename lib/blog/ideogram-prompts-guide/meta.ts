import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ideogram-prompts-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/ideogram/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Ideogram V3 Prompts: the Image Model That Actually Spells Words Right',
  h1: 'Most AI image models mangle text. Ideogram is built specifically not to.',
  targetKeyword: 'ideogram text in image prompts',
  description:
    'Ideogram V3 prompts leaning on its documented strength — legible text inside images — for posters, logos, signage and social graphics with real typography.',
  dek: 'Ask most image models for a poster with specific words on it, and you get confidently rendered gibberish where the text should be. Ideogram exists specifically to fix that, and prompting for it correctly matters more than for most other image models.',
  sections: [
    {
      heading: 'The specific failure Ideogram was built to fix',
      body: [
        [
          'Text rendering has historically been the single most reliable way to spot an AI-generated image — most diffusion models produce confident-looking gibberish the moment a prompt asks for actual legible words inside the picture. Ideogram was built specifically around solving that, and it is measurably better at rendering real, correctly-spelled typography than most general-purpose image models. The ',
          { text: 'Ideogram prompt library', href: '/prompts/ideogram' },
          ' leans directly on that documented strength rather than treating Ideogram as a generic alternative to any other model.',
        ],
      ],
    },
    {
      heading: 'A poster with legible, correctly-placed text',
      body: [
        [
          "The library's ",
          {
            text: 'poster prompt with legible text',
            href: '/prompts/ideogram/ideogram-v3-poster-with-legible-text',
          },
          ' is built around a specific structure: state the exact text you want rendered, in quotation marks, separately from the visual style description — event details, a headline, a call to action — so the model treats it as literal text to render rather than a style cue to interpret loosely. Keeping the requested text short and specific (a few words, not a full paragraph) dramatically improves the odds it renders cleanly, since even a text-specialised model degrades on longer strings.',
        ],
      ],
    },
    {
      heading: 'Logo and icon concepts with an actual wordmark',
      body: [
        [
          'A ',
          {
            text: 'logo or icon concept',
            href: '/prompts/ideogram/ideogram-v3-logo-icon-concept',
          },
          " that needs to incorporate a company name as a wordmark is exactly the case where most image models fail — Ideogram's text capability makes a genuine wordmark concept possible to generate directly, rather than needing to design a text-free mark (the common workaround other image tools require) and add typography separately in a design program afterward.",
        ],
      ],
    },
    {
      heading: 'Getting the typography style right, not just the words',
      body: [
        [
          'Beyond spelling the words correctly, the prompt should describe the actual typographic style wanted — bold sans-serif, hand-lettered script, condensed display type — the same way a font choice matters to a human designer. Leaving that unspecified lets the model default to whatever typography it considers generically appropriate for the scene, which is rarely the specific look a brand actually wants.',
        ],
        [
          'Colour contrast between text and background matters here just as much as it does in web design — describing the text colour explicitly relative to the background ("white bold text on a deep navy background") avoids the model placing legible-but-low-contrast text that reads poorly once printed or viewed at a smaller size.',
        ],
      ],
    },
    {
      heading: "When one design element still isn't the whole identity",
      body: [
        [
          'A poster or a logo concept generated here is a strong single asset. It still needs to sit inside a coherent brand system — matching colours, a name that fits the positioning, a slogan in the same voice — for the identity to hold together across everything a business actually publishes.',
        ],
        [
          "If that's the stage you're at, ",
          {
            text: "that's exactly the scope Scult's branding team covers",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your full identity.',
        ],
      ],
    },
  ],
  relatedTools: [
    'color-palette-generator',
    'business-name-generator',
    'slogan-generator',
  ],
  relatedPrompts: [
    'ideogram-v3-poster-with-legible-text',
    'ideogram-v3-logo-icon-concept',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 9,
}
