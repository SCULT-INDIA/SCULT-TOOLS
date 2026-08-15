import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'startup-idea-to-pitch-deck-playbook'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'From Idea to Pitch Deck: A First-Time Founder Playbook',
  h1: 'The path from a raw idea to a deck you can actually show investors',
  targetKeyword: 'startup idea validation to pitch deck',
  description:
    'Idea validation, positioning, naming, and a real pitch deck narrative — a first-time founder playbook using free prompts and tools, in the order that actually holds up.',
  dek: 'Most first-time founders jump straight to a pitch deck. The order that actually survives investor scrutiny starts three steps earlier — validate, position, then name — before a single slide gets written.',
  sections: [
    {
      heading: 'Step 1: validate before you build a deck around anything',
      body: [
        [
          'Start with ',
          {
            text: 'idea validation built as real hypothesis tests',
            href: '/prompts/startup/startup-idea-validation-hypothesis-tests',
          },
          ', not a persuasive case for why the idea is good. Pair it with a real ',
          {
            text: 'JTBD customer interview script',
            href: '/prompts/startup/startup-jtbd-customer-interview-script',
          },
          ' to get past surface-level feature requests to the actual job customers are hiring for.',
        ],
      ],
    },
    {
      heading: 'Step 2: positioning, before naming anything',
      body: [
        [
          'Run the ',
          {
            text: 'brand positioning prompt',
            href: '/prompts/branding/define-brand-positioning-before-naming',
          },
          ' before touching a name generator — deciding what your business actually claims to be, distinctly from competitors, first.',
        ],
      ],
    },
    {
      heading: 'Step 3: name and identity, quickly',
      body: [
        [
          'Once positioning is clear, the ',
          { text: 'Business Name Generator', href: '/business/business-name-generator' },
          ' and ',
          { text: 'Colour Palette Generator', href: '/design/color-palette-generator' },
          ' produce a real, usable starting identity in an afternoon — good enough for a pitch deck cover slide and an early landing page.',
        ],
      ],
    },
    {
      heading: 'Step 4: a one-line positioning statement',
      body: [
        [
          'Force a genuinely sharp ',
          {
            text: 'one-line positioning statement',
            href: '/prompts/startup/startup-one-line-positioning-statement',
          },
          ' — most founders avoid this by writing three paragraphs instead of the one sharp sentence a deck actually needs on its opening slide.',
        ],
      ],
    },
    {
      heading: 'Step 5: the deck itself',
      body: [
        [
          'Build the ',
          {
            text: 'pitch deck narrative outline',
            href: '/prompts/startup/startup-pitch-deck-narrative-outline',
          },
          ' and the ',
          {
            text: 'founder-market fit narrative',
            href: '/prompts/startup/startup-founder-market-fit-narrative',
          },
          ' together, then generate the actual slides with ',
          {
            text: 'a Gamma investor pitch deck prompt',
            href: '/prompts/presentations/gamma-investor-pitch-deck',
          },
          '.',
        ],
      ],
    },
    {
      heading: 'What this playbook does not replace',
      body: [
        [
          'Following this order gets you a genuinely coherent deck faster than jumping straight to slides. It does not replace real investor conversations, and it does not build the actual product the deck is describing — ',
          {
            text: "that's what Scult's software team helps founders with",
            href: SERVICE.href,
            external: true,
          },
          ' once the pitch has landed and it is time to actually ship.',
        ],
      ],
    },
    {
      heading: 'Building the product behind the pitch',
      body: [
        [
          'Have a validated idea and a deck, and now need to actually build it? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: ['business-name-generator', 'color-palette-generator'],
  relatedPrompts: [
    'startup-idea-validation-hypothesis-tests',
    'startup-pitch-deck-narrative-outline',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
