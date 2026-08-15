import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'branding-agency-service-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'service',
  title: 'DIY Brand Kit vs. Hiring a Branding Agency: An Honest Comparison',
  h1: 'You can generate a name, palette and logo concept for free. Should you stop there?',
  targetKeyword: 'branding agency for small business',
  description:
    'Free tools generate a real name, palette and logo concept. A branding agency does something different: deciding what those pieces should actually say about your business.',
  dek: 'The tools on this site can generate every individual piece of a brand identity for free. What they cannot do is decide which specific combination is actually right for your business — that is strategy, not generation.',
  sections: [
    {
      heading: 'What you can build yourself, free, in an afternoon',
      body: [
        [
          'A genuinely usable starting identity is free to assemble: ',
          { text: 'business names', href: '/business/business-name-generator' },
          ' scored for pronounceability, ',
          {
            text: 'a WCAG-checked colour palette',
            href: '/design/color-palette-generator',
          },
          ' built in OKLCH for even, professional-looking swatches, a ',
          { text: 'slogan', href: '/business/slogan-generator' },
          ' in the right tone, and a ',
          {
            text: 'logo concept via Ideogram',
            href: '/prompts/ideogram/ideogram-v3-logo-icon-concept',
          },
          ' that can actually render legible text, unlike most image models. For a very early-stage business validating an idea, that combination is a genuinely reasonable starting point.',
        ],
      ],
    },
    {
      heading: 'What none of those tools can decide for you',
      body: [
        [
          'Every one of those tools generates options. None of them decides which option is actually right for your specific market position, your actual competitors, or how your business needs to be perceived differently from everyone else in your category. A name generator has no opinion about whether your business should read as premium or accessible, playful or serious — that decision is strategy, made before any generation happens, not a byproduct of it.',
        ],
        [
          'This is exactly the gap the ',
          { text: 'brand-positioning prompt library', href: '/prompts/branding' },
          ' is meant to narrow — its explicit advice is to decide positioning before naming, not after — but even a well-run prompt is still a self-directed exercise, not an outside, experienced read on how your specific brand will actually land.',
        ],
      ],
    },
    {
      heading: 'What a branding agency actually does differently',
      body: [
        [
          'A real branding engagement starts from market research and competitive positioning specific to your business, not a generic naming exercise — understanding who else occupies your category, what gap genuinely exists, and what specific promise your brand can credibly make that competitors cannot. From there, the visual identity (logo, colour, typography) gets built to express that specific positioning, rather than assembled from generically pleasant choices with no strategic reasoning behind them.',
        ],
        [
          'This is ',
          { text: "Scult's branding work", href: SERVICE.href, external: true },
          ': positioning and market research first, identity built to express it second — the opposite order of generating assets and hoping a coherent story emerges from them afterward.',
        ],
      ],
    },
    {
      heading: 'The honest signal for when DIY stops being enough',
      body: [
        [
          'If you are a very early-stage business testing an idea, the free tools are a genuinely reasonable starting point — spending real money on brand strategy before you know if the business itself works is premature. The signal to invest in real strategy: once the business has real traction and real competitors, and the brand identity needs to do actual competitive work — differentiate you specifically, not just look professional in general.',
        ],
      ],
    },
    {
      heading: 'A worked example: outgrowing a generated identity',
      body: [
        [
          'A business launches with a generated name, palette and logo, gets real traction, and then discovers its identity reads generically similar to two direct competitors who happened to land on a similar aesthetic independently — a real risk when working from the same general design conventions everyone else also has access to. At that point, differentiating deliberately, not just aesthetically, becomes the actual problem worth solving, and that requires understanding the competitive landscape specifically, not another round of palette generation.',
        ],
      ],
    },
    {
      heading: 'Talk through where your brand actually stands',
      body: [
        [
          'Not sure whether your current identity is doing real competitive work or just looks fine? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " and we'll give you an honest read, not an automatic pitch to rebrand.",
        ],
      ],
    },
  ],
  relatedTools: [
    'business-name-generator',
    'slogan-generator',
    'color-palette-generator',
  ],
  relatedPrompts: [
    'define-brand-positioning-before-naming',
    'competitor-positioning-map',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
