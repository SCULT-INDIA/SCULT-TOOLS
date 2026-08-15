import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'slogan-generator-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every claim checked against lib/tools/slogan-generator/meta.ts — the
 * template-bank mechanism (no LLM), five tones, the Google Ads character
 * badges (30/90 chars), and the explicit trademark-check limitation.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'How to Write a Slogan That Is Not Generic AI Mush (Free Generator)',
  h1: 'A slogan generator with no AI, and that is exactly the point',
  targetKeyword: 'slogan generator',
  description:
    'Ten brandable slogans per click from hand-written template banks in five tones — plus what actually makes a slogan work, and Google Ads character limits built in.',
  dek: 'Ask an AI model for a slogan and you get something that technically parses as a sentence but says nothing specific about your brand. This generator uses hand-written template patterns instead — fewer surprises, but every line is built from a pattern that actually works, in a tone you choose deliberately.',
  sections: [
    {
      heading: 'What makes a slogan work, mechanically',
      body: [
        [
          'Four things separate a slogan people remember from one that evaporates the moment they stop reading it. Short: the most memorable slogans run under six words, because anything longer stops being repeatable from memory and becomes something people have to look up rather than recall. One idea: a single, clear promise stated once, not three benefits crammed into one sentence hoping something lands. Rhythm or contrast: the ear remembers cadence and opposition — a structural pattern, not just clever wording. True to the brand: a slogan should sound like the specific business that owns it, not like a template that could belong to any competitor in the same category.',
        ],
        [
          'The ',
          { text: 'Slogan Generator', href: '/business/slogan-generator' },
          ' on this site is built around those four principles directly rather than leaving them to chance: each of its five tones draws from a hand-written bank of more than sixteen sentence patterns — benefit-led, contrast, imperative — and your keyword is grammatically inflected into each pattern (capitalised correctly at a sentence start, given the right article — "a" or "an" — based on its actual vowel sound), so the output reads as a real sentence rather than a template with a blank filled in.',
        ],
      ],
    },
    {
      heading: 'Why no LLM, deliberately',
      body: [
        [
          'This tool does not call an AI model, and that absence is a design decision rather than a missing feature. Hand-written template banks mean results are instant — no API latency, no waiting for a model to respond — and completely private, since nothing you type is ever transmitted anywhere for processing. The honest trade-off, stated plainly: fewer total possible lines than an open-ended language model could theoretically produce, in exchange for every single line being built from a pattern a human writer actually crafted and tested, rather than a statistically plausible sentence a model generated with no guarantee it scans well or means anything specific.',
        ],
        [
          "Regenerating never repeats a line you've already seen or shortlisted — each batch shuffles the bank while excluding anything already shown, so ten regenerations in a row surface genuinely fresh options rather than the same handful of lines reordered.",
        ],
      ],
    },
    {
      heading: 'The five tones, and which brands actually suit each one',
      body: [
        [
          "Bold and confident tones suit brands built on a strong, declarative promise — think fitness, performance gear, anything selling ambition rather than comfort. Playful and friendly tones suit consumer brands where warmth and approachability matter more than authority — food, lifestyle, anything a customer engages with casually rather than as a serious purchase decision. Premium and minimal tones suit brands competing on restraint and quality signalling rather than volume — the fewer, more considered words themselves become part of the positioning. Benefit-led tones suit services specifically, where the slogan's entire job is stating a concrete outcome a customer gets, not an abstract feeling.",
        ],
        [
          'Picking the wrong tone for your actual brand position is the single most common way a slogan misses — a benefit-led line ("Get paid faster") reads as flat and unambitious on a premium lifestyle brand, while a bold, confident line reads as overblown chest-thumping on a small local service business. Match the tone to how the brand actually talks before generating, rather than trying every tone and picking whichever line sounds catchiest in isolation.',
        ],
      ],
    },
    {
      heading: 'The Google Ads character limits, built into the output',
      body: [
        [
          'A slogan short enough to be genuinely memorable often turns out to double as usable ad copy, and this tool surfaces that overlap directly with character badges on every line: a line of 30 characters or fewer fits a Google Ads headline field exactly, and one up to 90 characters fits a Google Ads description field. A slogan that already meets those limits is functionally ready-made ad copy — you have both a brand tagline and a tested-length headline from the same piece of writing, rather than writing them as two separate exercises.',
        ],
        [
          'If a favourite line runs slightly over either limit, the ',
          { text: 'Word Counter', href: '/productivity/word-counter' },
          ' shows exactly how many characters need trimming, with a live count as you edit rather than a guess-and-check cycle of pasting into an ad platform to see if it fits.',
        ],
      ],
    },
    {
      heading: 'Worked example: a bold-tone slogan for a fitness studio',
      body: [
        [
          'Enter your brand name or main keyword — say "Pulse" — and optionally what you do ("strength training studio"). Pick Bold / confident as the tone, since fitness brands built around performance and discipline generally suit declarative, ambitious phrasing more than playful or premium framing. Generate a batch of ten, heart the two or three that actually sound like something your specific brand would say out loud, and regenerate for a fresh batch if nothing lands — nothing already shown repeats, so there is no risk of cycling back to a line you already rejected.',
        ],
        [
          'Once you have a shortlist, say each finalist out loud in the actual context it will be used — read aloud at the start of a class, printed small on a gym towel, said quickly in a radio ad — since a line that reads well on screen does not always survive being spoken or shrunk to a smaller physical space.',
        ],
      ],
    },
    {
      heading: 'What a template bank cannot check for you',
      body: [
        [
          'Two honest limits worth stating clearly. First, these templates do not know your specific positioning or your actual audience — treat every generated line as raw material to refine, not finished copy ready to print. Second, nothing here is trademark-checked: short, punchy phrases are exactly the kind of thing that gets independently invented and used by multiple businesses, so search before committing a line to anything permanent — packaging, signage, a domain name, paid advertising creative that will run for months.',
        ],
        [
          "One more practical note: the shortlist lives only in this browser's local storage, on this device, and nowhere else — clearing your browser's site data deletes it permanently, so copy out anything worth keeping before you do.",
        ],
      ],
    },
    {
      heading: 'When a slogan needs to be part of a bigger brand voice',
      body: [
        [
          'A generator gives you strong raw candidates fast. It cannot develop a full brand voice — the consistent way your business talks across a website, social captions, customer emails and everything else — which is a genuinely different, deeper exercise than picking one great tagline. If the slogan is the tip of a bigger positioning question you have not fully answered yet, ',
          {
            text: "that's exactly the strategic work Scult's branding team does",
            href: SERVICE.href,
            external: true,
          },
          ', building the voice the slogan is meant to represent rather than treating the tagline as a standalone deliverable.',
        ],
        [
          'Want a second opinion on your shortlist before you commit to one? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " — bring your finalists and we'll talk through which one actually fits where your brand is headed.",
        ],
      ],
    },
  ],
  relatedTools: [
    'slogan-generator',
    'business-name-generator',
    'word-counter',
    'color-palette-generator',
  ],
  relatedPrompts: ['tagline-brief-before-slogan-generator'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
