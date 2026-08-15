import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'startup-founder-prompts-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/startup/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Startup Prompts That Force Rigor Instead of Cheerleading',
  h1: 'An AI that just validates your startup idea is worse than no feedback at all',
  targetKeyword: 'startup founder prompts',
  description:
    'Idea validation with real disconfirming questions, pitch narratives, pricing, cap table scenarios — founder prompts that force rigor instead of enthusiasm.',
  dek: 'Ask most AI assistants to evaluate a startup idea and you get encouragement dressed up as analysis. These prompts are built to force the disconfirming question a founder actually needs answered.',
  sections: [
    {
      heading: 'Why cheerleading is worse than no feedback',
      body: [
        [
          'A generic prompt asking an AI to evaluate a business idea tends to produce enthusiasm with a thin veneer of analysis — validating language dressed up as rigor. The ',
          { text: 'Startup & Strategy prompt library', href: '/prompts/startup' },
          ' is built specifically to force real, disconfirming questions instead.',
        ],
        [
          'The foundational entry, ',
          {
            text: 'idea validation with real hypothesis tests',
            href: '/prompts/startup/startup-idea-validation-hypothesis-tests',
          },
          ', structures validation as a set of falsifiable hypotheses to actually test, not a persuasive case to build.',
        ],
      ],
    },
    {
      heading: 'Customer discovery and product-market fit signals',
      body: [
        [
          'A ',
          {
            text: 'Jobs-to-be-Done customer interview script',
            href: '/prompts/startup/startup-jtbd-customer-interview-script',
          },
          ' gets past surface-level feature requests to the actual underlying job a customer is hiring your product for. Synthesizing ',
          {
            text: 'raw customer discovery notes',
            href: '/prompts/startup/startup-customer-discovery-synthesis',
          },
          ' turns scattered conversations into a real pattern. And an honest ',
          {
            text: 'product-market fit signal audit',
            href: '/prompts/startup/startup-pmf-signal-audit',
          },
          ' checks for real evidence rather than founder optimism.',
        ],
      ],
    },
    {
      heading: 'Positioning, pricing, and go-to-market',
      body: [
        [
          'A ',
          {
            text: 'one-line positioning statement',
            href: '/prompts/startup/startup-one-line-positioning-statement',
          },
          ' forces clarity most founders avoid by writing three paragraphs instead of one sharp sentence. ',
          {
            text: 'Value-based pricing tiers',
            href: '/prompts/startup/startup-value-based-pricing-tiers',
          },
          ' price against actual customer value rather than cost-plus guessing. And a ',
          {
            text: 'GTM channel bullseye test plan',
            href: '/prompts/startup/startup-gtm-channel-bullseye-test-plan',
          },
          ' tests channels systematically instead of picking the one that sounds most exciting.',
        ],
      ],
    },
    {
      heading: 'The investor conversation: deck, pitch and updates',
      body: [
        [
          'A ',
          {
            text: 'pitch deck narrative outline',
            href: '/prompts/startup/startup-pitch-deck-narrative-outline',
          },
          ' and a ',
          {
            text: 'founder-market fit narrative',
            href: '/prompts/startup/startup-founder-market-fit-narrative',
          },
          ' both address the story half of fundraising, not just the slides. A ',
          {
            text: 'monthly investor update email',
            href: '/prompts/startup/startup-monthly-investor-update-email',
          },
          ' keeps existing investors genuinely informed between rounds, and tightening ',
          {
            text: 'a YC application essay',
            href: '/prompts/startup/startup-yc-application-essay-tightening',
          },
          ' respects a format with almost no room for padding.',
        ],
      ],
    },
    {
      heading: 'The unglamorous mechanics: term sheets, cap tables, equity splits',
      body: [
        [
          'A plain-English ',
          {
            text: 'SAFE term sheet mechanics explainer',
            href: '/prompts/startup/startup-safe-term-sheet-mechanics-explainer',
          },
          ' and a ',
          {
            text: 'cap table dilution scenario explainer',
            href: '/prompts/startup/startup-cap-table-dilution-scenario-explainer',
          },
          ' turn genuinely confusing mechanics into something a founder can actually reason about. A ',
          {
            text: 'co-founder equity split framework',
            href: '/prompts/startup/startup-cofounder-equity-split-framework',
          },
          ' structures a conversation many founding teams avoid having explicitly until it becomes a real problem.',
        ],
      ],
    },
    {
      heading: 'Operating discipline: metrics, hiring, runway',
      body: [
        [
          'Selecting a real ',
          {
            text: 'North Star metric',
            href: '/prompts/startup/startup-north-star-metric-selection',
          },
          ' forces one honest measure of progress rather than a dashboard of vanity numbers. A ',
          {
            text: 'first-hire scorecard',
            href: '/prompts/startup/startup-first-hire-scorecard',
          },
          ' brings rigor to the highest-stakes early decision a founder makes. And ',
          {
            text: 'runway and burn-rate scenario planning',
            href: '/prompts/startup/startup-runway-burn-rate-scenario-planning',
          },
          ' forces the uncomfortable but necessary math before it becomes an emergency.',
        ],
      ],
    },
    {
      heading: 'Learning from churn and running a real board meeting',
      body: [
        [
          'Synthesizing ',
          {
            text: 'churn exit interviews',
            href: '/prompts/startup/startup-churn-exit-interview-synthesis',
          },
          ' finds the real pattern behind lost customers rather than one loud anecdote. Structuring a ',
          {
            text: 'board meeting deck',
            href: '/prompts/startup/startup-board-meeting-deck-structure',
          },
          ' and defining a real ',
          {
            text: 'ICP from actual closed deals',
            href: '/prompts/startup/startup-icp-definition-from-deals',
          },
          ' — data, not assumption — both bring the same evidence-first discipline to governance and targeting. A ',
          {
            text: 'premortem risk exercise',
            href: '/prompts/startup/startup-premortem-risk-exercise',
          },
          ' surfaces failure modes before they happen rather than after.',
        ],
      ],
    },
    {
      heading: 'When the startup needs a real product built, not just planning',
      body: [
        [
          'These prompts sharpen strategy and thinking. Building the actual product, MVP, or platform the strategy is meant to support is real engineering work. ',
          {
            text: "That's exactly what Scult's software team builds for founders",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your build.',
        ],
      ],
    },
  ],
  relatedTools: ['business-name-generator', 'marketing-roi-calculator'],
  relatedPrompts: [
    'startup-idea-validation-hypothesis-tests',
    'startup-one-line-positioning-statement',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 13,
}
