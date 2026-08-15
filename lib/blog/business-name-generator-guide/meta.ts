import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'business-name-generator-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every claim checked against lib/tools/business-name-generator/meta.ts —
 * five real naming strategies, the consonant-cluster pronounceability
 * heuristic, and the explicit "no trademark/domain check performed" limit.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'How to Name a Business: 5 Naming Strategies (Free Generator)',
  h1: 'Naming a business, without the AI-generated mush',
  targetKeyword: 'business name generator',
  description:
    'Five real naming strategies — brandable, compound, modern suffix, portmanteau, alliteration — explained, with a free generator that shows its work instead of hiding behind an AI black box.',
  dek: 'Most name generators are a single AI prompt wearing a form. This one recombines curated word banks with five distinct, explainable strategies, scores every result for length and pronounceability, and never pretends to check a domain or trademark it has not actually checked.',
  sections: [
    {
      heading: 'Why "not AI" is a feature here, not a limitation',
      body: [
        [
          "It's worth stating plainly what this tool is not, because most competing name generators lead with the opposite claim: the ",
          { text: 'Business Name Generator', href: '/business/business-name-generator' },
          ' does not call an AI model. Names are built combinatorially, entirely in your browser, from five distinct strategies — brandable syllables, compound words, modern suffixes, portmanteau blends, and alliteration. That trade buys three concrete things an AI call cannot: results are instant with no API latency, nothing you type ever leaves your browser, and every single card shows exactly how its name was constructed — which strategy, which pieces — rather than presenting an opaque suggestion with no visible reasoning behind it.',
        ],
        [
          'The five strategies are worth knowing individually rather than treated as one undifferentiated "name generator" feature, because they suit genuinely different brand positions. Brandable syllable names (think invented, pronounceable words) suit a startup wanting a name with no prior meaning to anchor to. Compound words (joining two real, relevant words) suit a business wanting the name itself to hint at what it does. Modern suffix names (a real word plus a trendy ending like -ify, -io, or -ly) borrow the startup-naming convention that has become instantly recognisable as "tech company." Portmanteau blends (merging two words into one) split the difference between invented and descriptive. Alliteration leans on repeated sounds for memorability — Coca-Cola, PayPal, Best Buy are the pattern, even though this tool would never claim or reproduce those specific names.',
        ],
      ],
    },
    {
      heading: 'How the pronounceability and length scoring actually works',
      body: [
        [
          'Every generated name is scored against two mechanical checks, both disclosed rather than hidden. Length is scored against an eight-letters-or-fewer sweet spot — shorter names are measurably easier to say aloud, type into a URL bar, and fit on packaging or a business card without the type shrinking to illegibility. Pronounceability is scored with a consonant-cluster heuristic that flags three or more consonant sounds appearing consecutively outside common, easily-said English onsets like "str" or "spr" — a name that fails this check tends to get mispronounced and then misspelled when someone tries to search for it later, which quietly costs word-of-mouth referrals that never make it back to your analytics as a measurable loss.',
        ],
        [
          'Neither check is a hard gate — a name can still be generated and shown even if it trips one of them — but the flag itself is useful information a purely aesthetic name generator simply does not surface. A name that looks striking on screen but trips the consonant-cluster check is worth saying out loud to a few people before committing to it, precisely because that check exists to catch exactly the kind of name that reads fine but is awkward to actually speak.',
        ],
      ],
    },
    {
      heading: 'What this tool deliberately will not tell you',
      body: [
        [
          'Two honest limitations, stated upfront rather than discovered later: no trademark or company-registry search is performed at all — the "Check domain" link simply opens a public domain registrar\'s search in a new tab so you can verify availability yourself on a real, authoritative source, rather than trusting a cached or possibly-stale claim baked into the generator. And a name being generatable, or even having an available matching domain, does not mean it is free to register as a company name or trademark — those are three genuinely separate checks (trademark registry, company registry, domain registrar), and skipping any one of them because the other two came back clean is exactly how a business ends up rebranding six months after launch.',
        ],
        [
          'In India specifically, that means searching the trademark registry and the MCA (Ministry of Corporate Affairs) company name-availability database before committing — both are public, both take a few minutes, and both are the actual authoritative answer a name generator, however good, structurally cannot give you.',
        ],
      ],
    },
    {
      heading: 'Worked example: naming a D2C spice brand',
      body: [
        [
          'Type a keyword describing the business — say "spice" or "masala" — and pick a naming style to start. Compound or portmanteau strategies tend to suit food and D2C brands particularly well, since a name that hints at the product (something like the "Spiceroot" or "Chai Chapter" style of naming) gives a new customer an immediate, intuitive sense of the category before they read a single word of description. Generate a batch of twelve, star anything worth keeping to build a shortlist rather than trying to decide from memory, and press Regenerate for a fresh batch whenever the current one runs dry — nothing already shortlisted repeats.',
        ],
        [
          "Once you have a shortlist of two or three real contenders: say each one out loud to a few people who have never seen it written down, check the .com and .in domains specifically (a matching domain matters more to a new customer's trust than most founders expect), and only then run the trademark and MCA checks on the actual finalist rather than every name on the list.",
        ],
      ],
    },
    {
      heading: 'Where a name generator stops and brand strategy starts',
      body: [
        [
          'A generator can hand you dozens of pronounceable, appropriately-short candidates in seconds. What it cannot do is tell you whether a specific name will actually resonate with your specific target customer, whether it positions you correctly against real competitors in your category, or whether the name can carry a business as it grows past its first product or its first city — the kind of judgment call that genuinely benefits from someone who has watched names succeed and fail in the market, not just generated them.',
        ],
        [
          'If naming is one piece of a bigger identity decision — logo, visual system, positioning — alongside it, ',
          {
            text: "that's the full scope of what Scult's branding team handles",
            href: SERVICE.href,
            external: true,
          },
          ', building the identity around a name rather than treating the name as a standalone decision made in isolation.',
        ],
        [
          'Stuck between two or three real finalists and want an outside read? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " and bring your shortlist — sometimes the outside perspective is exactly what breaks a tie a founder can't see clearly from the inside.",
        ],
      ],
    },
    {
      heading: 'Once the name is picked',
      body: [
        [
          'A name is the first of several identity decisions, not the last. Pair it with a ',
          { text: 'Slogan Generator', href: '/business/slogan-generator' },
          ' pass to find a tagline in the same tone, and a ',
          { text: 'Colour Palette Generator', href: '/design/color-palette-generator' },
          ' run to establish the visual identity that will sit alongside the name on everything from a website to a business card — building all three roughly together, rather than sequentially over separate weeks, tends to produce an identity that feels considered rather than assembled from mismatched decisions made months apart.',
        ],
      ],
    },
  ],
  relatedTools: [
    'business-name-generator',
    'slogan-generator',
    'color-palette-generator',
    'favicon-generator',
  ],
  relatedPrompts: ['define-brand-positioning-before-naming'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
