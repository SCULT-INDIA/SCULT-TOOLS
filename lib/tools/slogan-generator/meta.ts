import type { Tool } from '../types'

/** Invented example lines only, per an explicit decision not to reproduce
 * real trademarked brand slogans even for illustration. */
const EXAMPLES_SUPPORT: Tool['supportContent'] = [
  {
    heading: 'Slogan examples to spark yours',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'A great slogan is short, memorable, and says something true about the brand. Browse by tone, then generate your own above.',
        ],
      },
      {
        type: 'list',
        intro: 'Bold / confident',
        items: ['"Built to outlast."', '"No shortcuts. Ever."', '"Win the day."'],
      },
      {
        type: 'list',
        intro: 'Playful / friendly',
        items: [
          '"Snack happy."',
          '"Life\'s better in colour."',
          '"Small box, big smile."',
        ],
      },
      {
        type: 'list',
        intro: 'Premium / minimal',
        items: [
          '"Quietly exceptional."',
          '"Crafted, not manufactured."',
          '"Less, but better."',
        ],
      },
      {
        type: 'list',
        intro: 'Benefit-led (good for services)',
        items: [
          '"Get paid faster."',
          '"Your site, twice as fast."',
          '"More leads, less guesswork."',
        ],
      },
      {
        type: 'list',
        intro: 'What makes these work:',
        items: [
          'Short — most memorable slogans are under six words.',
          'One idea — a single, clear promise, not three.',
          'Rhythm or contrast — the ear remembers cadence and opposites.',
          'True to the brand — it should sound like you, not like everyone else in your category.',
        ],
      },
    ],
  },
]

export const meta: Tool = {
  slug: 'slogan-generator',
  category: 'business',
  title: 'Slogan Generator — Free Tagline Maker',
  h1: 'Slogan Generator',
  description:
    'Generate ten brandable slogans per click from hand-written template banks in five tones. Save a shortlist and check every line against Google Ads character limits.',
  tagline: 'Ten taglines per click, in the tone your brand actually speaks.',
  keywords: [
    'slogan generator',
    'tagline generator',
    'free slogan maker',
    'business slogan ideas',
  ],
  related: [
    'business-name-generator',
    'word-counter',
    'email-signature-generator',
    'color-palette-generator',
  ],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'C',
  // 'branding' 404s on scult.in — 'branding-agency' is the real page.
  serviceTarget: 'branding-agency',
  updatedAt: '2026-07-29',
  owner: 'scult-business',
  icon: 'Quote',
  runsInBrowser: true,
  howToUse: [
    'Enter your brand name or main keyword, and optionally what you do.',
    'Pick the tone that matches your brand voice.',
    'Generate a batch of ten and heart the lines worth keeping.',
    'Regenerate for fresh ideas — anything on screen or shortlisted is never repeated.',
    'Copy your favourites; the shortlist stays saved in this browser.',
  ],
  howItWorks:
    'Each tone draws on a hand-written bank of 16-plus sentence patterns — benefit-led, contrast, imperative. Your keyword is inflected grammatically: capitalised at a sentence start, a/an chosen by vowel sound. Batches shuffle the bank, excluding lines already shown, so regenerating never repeats. No LLM.',
  limitations: [
    'Templates don’t know your positioning or audience — treat lines as raw material, not finished copy.',
    'Nothing here is trademark-checked, so search before using a line anywhere permanent.',
  ],
  faq: [
    {
      q: 'Is this slogan generator really free?',
      a: 'Yes, with no sign-up and no generation cap. It runs entirely in your browser from curated template banks, so it costs nothing to operate and nothing you type is uploaded anywhere.',
    },
    {
      q: 'Does it use AI to write the slogans?',
      a: 'No. Each tone draws on a hand-written bank of sentence patterns, and your keyword is slotted in with correct capitalisation and article grammar. That is why results are instant and private — the trade is fewer, better lines rather than an endless stream of generic ones.',
    },
    {
      q: 'Can I trademark a slogan I generate here?',
      a: 'Possibly, but check first. Short template-based phrases may already be in use by someone else, so run a trademark search and a plain web search before committing a line to packaging, signage or advertising.',
    },
    {
      q: 'What do the character badges mean?',
      a: 'A line of 30 characters or fewer fits a Google Ads headline, and one up to 90 characters fits an ad description. A slogan that meets those limits doubles as ready-made ad copy.',
    },
    {
      q: 'Where is my shortlist saved?',
      a: 'In your browser’s localStorage, on this device only. Nothing is sent to a server — which also means clearing site data deletes the shortlist, so copy keepers out before you do.',
    },
    {
      q: 'How many slogans can I generate?',
      a: 'As many as you like — each regeneration pulls a fresh batch of ten, excluding anything already shown or shortlisted, so keep going until one clicks.',
    },
  ],
  supportContent: EXAMPLES_SUPPORT,
}
