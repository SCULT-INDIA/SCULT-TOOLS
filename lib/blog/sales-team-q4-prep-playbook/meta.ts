import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'sales-team-q4-prep-playbook'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Prepping a Sales Team for a Big Quarter: Outreach to Renewal',
  h1: 'A quarter-end push needs more than motivation — it needs real scripts',
  targetKeyword: 'sales team quarter prep',
  description:
    'Outreach templates, discovery scripts, objection handling, and renewal talk tracks — a real sales-team preparation playbook for a critical quarter, using free prompts.',
  dek: 'Hitting a big quarterly number is rarely a motivation problem — it is a preparation problem, across outreach, discovery, negotiation and renewal, each needing its own genuine script.',
  sections: [
    {
      heading: 'Refresh outreach before the quarter starts',
      body: [
        [
          'Update ',
          {
            text: 'cold email templates built around a single trigger signal',
            href: '/prompts/sales/sales-cold-email-single-trigger-signal',
          },
          ' rather than reusing whatever worked last quarter unchanged — the specific trigger that earned replies before may already be stale.',
        ],
      ],
    },
    {
      heading: 'Sharpen discovery calls',
      body: [
        [
          'Refresh the ',
          {
            text: 'MEDDIC discovery question script',
            href: '/prompts/sales/sales-meddic-discovery-call-question-script',
          },
          ' the whole team uses, so qualification criteria are consistent across every rep rather than varying by who happens to be on the call.',
        ],
      ],
    },
    {
      heading: 'Prepare for the objections that will actually come up',
      body: [
        [
          'Build a real ',
          {
            text: 'competitor battle card',
            href: '/prompts/sales/sales-competitor-battle-card-builder',
          },
          ' for whichever competitors are actually showing up in deals this quarter, and rehearse isolating the ',
          {
            text: 'real objection behind a stated one',
            href: '/prompts/sales/sales-isolate-real-objection-response-script',
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Keep deals honest heading into forecast calls',
      body: [
        [
          'Run every deal expected to close this quarter through a real ',
          {
            text: 'deal risk assessment',
            href: '/prompts/sales/sales-deal-risk-assessment-before-forecast-call',
          },
          ' before the forecast call — an honest forecast now avoids a worse surprise later.',
        ],
      ],
    },
    {
      heading: 'Do not neglect renewals while chasing new logos',
      body: [
        [
          'Prepare ',
          {
            text: 'renewal QBR agendas',
            href: '/prompts/sales/sales-qbr-agenda-for-renewing-account',
          },
          ' and ',
          {
            text: 'value talk tracks',
            href: '/prompts/sales/sales-renewal-upsell-value-talk-track',
          },
          ' for accounts up for renewal this quarter — an existing account lost to inattention while chasing new logos is a genuinely avoidable loss.',
        ],
      ],
    },
    {
      heading: 'What good scripts do not replace',
      body: [
        [
          'These sharpen individual conversations. A genuinely full-funnel pipeline generating enough opportunities for the team to work is a separate, ongoing marketing investment — ',
          {
            text: "the kind Scult's growth team runs",
            href: SERVICE.href,
            external: true,
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Fuel the pipeline behind the scripts',
      body: [
        [
          'Scripts are ready but pipeline is thin? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: ['marketing-roi-calculator'],
  relatedPrompts: [
    'sales-meddic-discovery-call-question-script',
    'sales-deal-risk-assessment-before-forecast-call',
  ],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
