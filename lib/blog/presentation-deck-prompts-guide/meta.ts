import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'presentation-deck-prompts-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/presentations/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Gamma & Canva Prompts: Where Prompt Quality Changes the Deck the Most',
  h1: 'A vague deck prompt gets a vague deck — these are specific',
  targetKeyword: 'gamma canva presentation prompts',
  description:
    'Investor pitch decks, sales proposals, brand-consistent decks and slide copy — Gamma and Canva prompts for the two tools where prompt quality visibly changes the output most.',
  dek: 'Presentation-generation tools respond dramatically to how specific the brief is — the same vague "make me a pitch deck" prompt across ten different companies produces ten nearly identical, forgettable decks.',
  sections: [
    {
      heading: 'Why decks specifically reward a detailed brief',
      body: [
        [
          'Presentation generators like Gamma and Canva produce visibly different quality depending on how specific the input is, more so than most other AI-generation tasks — a vague brief produces a generic template with your words dropped in; a specific one produces something that actually looks considered. The ',
          {
            text: 'Decks & Presentations prompt library',
            href: '/prompts/presentations',
          },
          ' is written around exactly that sensitivity.',
        ],
      ],
    },
    {
      heading: 'Investor and sales decks: the highest-stakes use case',
      body: [
        [
          'An ',
          {
            text: 'investor pitch deck',
            href: '/prompts/presentations/gamma-investor-pitch-deck',
          },
          ' built in Gamma needs a real narrative arc — problem, solution, market, traction — not just a slide-by-slide template filled in. A ',
          {
            text: 'sales proposal deck',
            href: '/prompts/presentations/gamma-sales-proposal-deck',
          },
          ' needs the same narrative discipline applied to closing a specific deal rather than a generic capabilities overview.',
        ],
      ],
    },
    {
      heading: 'Turning existing content into a deck or one-pager',
      body: [
        [
          'Turning ',
          {
            text: 'a written document into a one-pager',
            href: '/prompts/presentations/gamma-one-pager-from-doc',
          },
          ' condenses without losing the actual argument. Building ',
          {
            text: 'a webpage directly from an outline',
            href: '/prompts/presentations/gamma-webpage-from-outline',
          },
          ' and an ',
          {
            text: 'onboarding or training deck',
            href: '/prompts/presentations/gamma-onboarding-training-deck',
          },
          ' both apply the same structured-outline-to-finished-artifact pattern to different destinations.',
        ],
      ],
    },
    {
      heading: 'Canva: brand-consistent decks and social carousels',
      body: [
        [
          'A ',
          {
            text: 'brand-kit-consistent deck in Canva',
            href: '/prompts/presentations/canva-brand-kit-consistent-deck',
          },
          ' keeps colours and fonts matched to an established identity rather than drifting per slide. A ',
          {
            text: 'Magic Design social carousel',
            href: '/prompts/presentations/canva-magic-design-social-carousel',
          },
          ' applies the same visual consistency to social content specifically, and ',
          {
            text: 'Magic Write slide copy',
            href: '/prompts/presentations/canva-magic-write-slide-copy',
          },
          ' writes tighter copy for the constrained space a slide actually offers, rather than a paragraph that gets awkwardly shrunk to fit.',
        ],
      ],
    },
    {
      heading: 'Worked example: a pitch deck with a real narrative',
      body: [
        [
          'Before opening Gamma, decide the actual argument — the specific problem, why now, why your approach specifically — and feed that argument into the pitch-deck prompt rather than a bullet list of company facts. Pair the resulting deck with the ',
          { text: 'Business Name Generator', href: '/business/business-name-generator' },
          ' and ',
          { text: 'Colour Palette Generator', href: '/design/color-palette-generator' },
          " for consistent branding if the identity isn't finalised yet.",
        ],
      ],
    },
    {
      heading: 'When a deck is part of a bigger pitch or brand moment',
      body: [
        [
          'These prompts produce a solid deck fast. For a genuinely high-stakes pitch — a major funding round, a large enterprise sale — the deck is one piece of a larger narrative and identity that benefits from real strategic input. ',
          {
            text: "That's the kind of work Scult's branding team supports",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' if a high-stakes deck is coming up.',
        ],
      ],
    },
  ],
  relatedTools: ['business-name-generator', 'color-palette-generator', 'word-counter'],
  relatedPrompts: ['gamma-investor-pitch-deck', 'canva-magic-write-slide-copy'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
