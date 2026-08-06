import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'business-name-generator',
  category: 'business',
  title: 'Business Name Generator',
  h1: 'Business Name Generator',
  description:
    'Generate brandable business name ideas from one or two keywords — five naming styles, honest pronounceability scoring and a local shortlist. Free, instant, no sign-up.',
  tagline: 'Five naming strategies, with the method shown — not hidden.',
  keywords: [
    'business name generator',
    'brand name generator',
    'company name ideas',
    'startup name generator free',
  ],
  related: [
    'slogan-generator',
    'favicon-generator',
    'color-palette-generator',
    'invoice-generator',
    'marketing-roi-calculator',
  ],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'B',
  // Verified live on scult.in — 'branding' 404s, the agency's real page is
  // 'branding-agency'. See docs in ToolShell's parentLink usage / lib/site.ts.
  serviceTarget: 'branding-agency',
  updatedAt: '2026-07-29',
  owner: 'scult-business',
  icon: 'Lightbulb',
  runsInBrowser: true,
  howToUse: [
    'Type one or two keywords that describe your business.',
    'Pick a naming style — brandable, compound, modern suffix, portmanteau or alliteration.',
    'Press Regenerate for a fresh batch of 12 names.',
    'Star the ones you like to build a shortlist, then copy a name or check its domain.',
  ],
  howItWorks:
    'Names are built combinatorially in your browser, not by an AI call — five strategies (brandable syllables, compound words, modern suffixes, portmanteau, alliteration) generate candidates, then each is scored for length against an eight-letters-or-fewer sweet spot and for pronounceability via a consonant-cluster heuristic flagging three-plus consonants in a row.',
  limitations: [
    'No trademark or company-registry search is performed — verify a name against the Indian trademark registry and MCA database before committing to it.',
    'Domain availability isn’t checked; “Check domain” just opens Namecheap’s public search in a new tab.',
  ],
  faq: [
    {
      q: 'Is this an AI name generator?',
      a: 'No. It recombines curated syllables, suffixes and word banks deterministically in your browser. That makes it instant and private, and every card shows exactly how its name was formed — transparency an AI generator cannot give you.',
    },
    {
      q: 'Does it check if the domain is available?',
      a: 'No, and it will not pretend to. Each name links to Namecheap’s public domain search so you verify availability on a real registrar rather than trusting a cached or faked claim.',
    },
    {
      q: 'Can I legally use a name this tool generates?',
      a: 'Only after your own checks. Search the trademark registry and, in India, the MCA name-availability database. A name being generatable — or even having a free domain — does not mean it is free to register as a company or mark.',
    },
    {
      q: 'Where is my shortlist saved?',
      a: 'In your browser’s localStorage only. It survives page reloads on this device, never leaves your machine, and clearing the site’s data deletes it.',
    },
    {
      q: 'Why are some names flagged as tricky to say?',
      a: 'The pronounceability check looks for runs of three or more consonant sounds outside common English onsets like “str” or “spr”. Names that fail tend to be misheard and misspelled, which quietly costs word-of-mouth referrals.',
    },
  ],
}
