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
  serviceTarget: 'branding',
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
    'Every name is built combinatorially in your browser — no AI call, which is why results are instant and nothing you type leaves the page. Five strategies do the work. Brandable extracts your keyword’s root (its opening consonant–vowel–consonant shape) and recombines it with curated syllables, rejecting any candidate with vowel pile-ups or heavy consonant runs. Compound joins the keyword to a real word like Hub, Labs or Forge. Modern suffix trims trailing vowels and appends endings such as -ly, -ify, -io or -ora. Portmanteau splices the keyword into a real word at a letter they share, keeping at least three characters from each side. Alliteration pairs the keyword with curated real words sharing its initial. Each name is then scored, not decorated: length against the eight-letters-or-fewer sweet spot for memorable brand names, and pronounceability with a consonant-cluster heuristic — three or more consonant sounds in a row outside common onsets like “str” gets flagged, because names people stumble over get misspelled and lost.',
  limitations: [
    'No trademark or company-registry search is performed. Before committing to a name, search the Indian trademark registry and the MCA company-name database — a generated name can still be legally taken.',
    'Domain availability is not checked here. The “Check domain” link opens Namecheap’s public search in a new tab; this tool has no affiliation and no live availability data.',
    'Word banks and the pronounceability heuristic are English-centric — a name that scores well here may read or sound different in other languages.',
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
