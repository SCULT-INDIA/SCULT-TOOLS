import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'slogan-generator',
  category: 'business',
  title: 'Slogan Generator — Free Tagline Maker',
  h1: 'Slogan Generator',
  description:
    'Generate ten brandable slogans per click from hand-written template banks in five tones. Star a shortlist and check every line against Google Ads character limits.',
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
  serviceTarget: 'branding',
  updatedAt: '2026-07-29',
  owner: 'scult-business',
  icon: 'Quote',
  runsInBrowser: true,
  howToUse: [
    'Enter your brand name or main keyword, and optionally what you do.',
    'Pick the tone that matches your brand voice.',
    'Generate a batch of ten and star the lines worth keeping.',
    'Regenerate for fresh ideas — anything on screen or shortlisted is never repeated.',
    'Copy your favourites; the shortlist stays saved in this browser.',
  ],
  howItWorks:
    'Every tone has a hand-written bank of 16-plus sentence patterns — benefit-led, contrast, imperative, parallelism, short punch lines — and your keyword and noun are inflected into them grammatically: the brand is capitalised when it opens a sentence and kept as typed mid-sentence, and a/an is chosen by vowel sound wherever a template needs an article. Each batch is a shuffle of that bank with everything already on screen or shortlisted excluded, so regenerating never repeats itself. There is no LLM behind this, which is exactly why it is instant, free and private — nothing you type leaves the browser. The trade is breadth for quality: a curated set of lines that survive being read aloud, instead of an infinite stream of madlibs.',
  limitations: [
    'Templates cannot know your positioning, audience or category — treat every line as raw material to sharpen, not finished brand copy.',
    'Nothing here is trademark-checked. Search the trademark registry and your competitors before putting a slogan on anything permanent.',
    'The banks are English-only, and the grammar handling (capitalisation, a/an selection) assumes English phrasing.',
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
  ],
}
