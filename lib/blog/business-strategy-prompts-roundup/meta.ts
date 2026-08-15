import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'business-strategy-prompts-roundup'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'Business Prompts: Founder Rigor and the Client Admin Nobody Templates',
  h1: 'From cap tables to overdue-invoice emails — two very different kinds of business writing',
  targetKeyword: 'business strategy prompts for founders',
  description:
    'Startup validation, pitch narratives and pricing, plus proposals, scope-of-work docs and invoice follow-ups — two business prompt libraries covering founder strategy and daily client ops.',
  dek: 'Startup strategy and everyday client communication are both "business" prompts, but they solve completely different problems — one forces rigor on big decisions, the other templates the small writing that recurs constantly.',
  sections: [
    {
      heading: 'Startup & Strategy: forcing rigor instead of cheerleading',
      body: [
        [
          'The ',
          { text: 'Startup & Strategy library', href: '/prompts/startup' },
          ' is built to force disconfirming questions rather than validate an idea — hypothesis-driven idea validation, honest PMF signal audits, cap table and term-sheet mechanics explained plainly, and premortem risk exercises.',
        ],
      ],
    },
    {
      heading: 'Business Ops & Client Comms: the writing everyone repeats',
      body: [
        [
          'The ',
          { text: 'Business Ops & Client Comms library', href: '/prompts/business-ops' },
          ' covers the specific, recurring documents a freelancer or small consultancy writes constantly — proposals, scope-of-work docs, project kickoffs, and the genuinely hard-to-word scope-creep pushback and overdue-invoice follow-up emails.',
        ],
      ],
    },
    {
      heading: 'Where this content connects to the free tools directly',
      body: [
        [
          'Billable line-item descriptions from the Business Ops library feed straight into the ',
          { text: 'Invoice Generator', href: '/business/invoice-generator' },
          "'s line items, and email signature copy feeds into the ",
          {
            text: 'Email Signature Generator',
            href: '/business/email-signature-generator',
          },
          '.',
        ],
      ],
    },
    {
      heading: 'The thin spots: finance and consulting frameworks',
      body: [
        [
          'This site does not yet have dedicated Finance & Analysis or Consulting & Frameworks prompt libraries — both are empty today, worth stating rather than pretending otherwise.',
        ],
      ],
    },
    {
      heading: 'When business writing needs to be a real system',
      body: [
        [
          'Better templates fix individual documents. Tracking many clients and projects at real operational scale is software, not copywriting. ',
          {
            text: "That's exactly what Scult's software team builds",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk it through.',
        ],
      ],
    },
  ],
  relatedTools: ['invoice-generator', 'email-signature-generator'],
  relatedPrompts: [
    'startup-idea-validation-hypothesis-tests',
    'client-proposal-that-gets-signed',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 10,
}
