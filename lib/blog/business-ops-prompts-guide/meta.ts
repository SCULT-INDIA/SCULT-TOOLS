import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'business-ops-prompts-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/business-ops/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'The Client Emails Every Freelancer Rewrites From Scratch (Free Prompts)',
  h1: "You've written this exact email before. You shouldn't have to write it again.",
  targetKeyword: 'client communication prompts freelancer',
  description:
    'Proposals, scope-of-work docs, invoice follow-ups and scope-creep pushback — prompts for the unglamorous writing every small business repeats, extending the Invoice Generator.',
  dek: 'Every freelancer and small consultancy rewrites the same handful of emails and documents constantly — a proposal, a scope-creep pushback, an overdue-invoice follow-up — usually from memory, usually slightly worse each time under deadline pressure.',
  sections: [
    {
      heading: 'The repeated writing nobody templates',
      body: [
        [
          'A handful of specific documents and emails come up constantly for any freelancer or small consultancy, and most people rewrite each one from memory every time rather than working from a genuinely good template. The ',
          {
            text: 'Business Ops & Client Comms prompt library',
            href: '/prompts/business-ops',
          },
          ' covers exactly that recurring writing.',
        ],
      ],
    },
    {
      heading: 'Winning and scoping the work',
      body: [
        [
          'A ',
          {
            text: 'client proposal that actually gets signed',
            href: '/prompts/business-ops/client-proposal-that-gets-signed',
          },
          ' is structured around what actually moves a prospect to say yes, not a generic capabilities deck. Turning ',
          {
            text: 'a vague client request into a real scope of work',
            href: '/prompts/business-ops/scope-of-work-from-a-vague-request',
          },
          ' forces the specificity that prevents scope disputes three weeks into a project.',
        ],
      ],
    },
    {
      heading: 'Starting and running the project',
      body: [
        [
          'A ',
          {
            text: 'project kickoff email',
            href: '/prompts/business-ops/project-kickoff-email',
          },
          ' sets expectations before work begins rather than discovering misalignment mid-project. A ',
          {
            text: 'client onboarding checklist',
            href: '/prompts/business-ops/client-onboarding-checklist',
          },
          ' makes the start of every engagement consistent rather than reinvented per client.',
        ],
      ],
    },
    {
      heading: 'The email nobody enjoys writing: pushing back on scope creep',
      body: [
        [
          'Declining scope creep without damaging the relationship — ',
          {
            text: 'this prompt',
            href: '/prompts/business-ops/decline-scope-creep-email',
          },
          ' — is genuinely difficult to word well under time pressure, which is exactly why having a solid template matters here more than almost anywhere else in client communication.',
        ],
      ],
    },
    {
      heading: 'Getting paid: invoice language and follow-up',
      body: [
        [
          'Writing clear ',
          {
            text: 'billable line-item descriptions',
            href: '/prompts/business-ops/billable-line-item-descriptions',
          },
          ' extends directly into the ',
          { text: 'Invoice Generator', href: '/business/invoice-generator' },
          "'s line items — clarity here reduces client questions about what they're actually being billed for. And an ",
          {
            text: 'overdue invoice follow-up email',
            href: '/prompts/business-ops/overdue-invoice-follow-up-email',
          },
          " needs a firm-but-professional tone that's genuinely hard to strike consistently without a template.",
        ],
      ],
    },
    {
      heading: 'The final polish: signature copy for every outgoing email',
      body: [
        [
          'Email signature copy — ',
          { text: 'this prompt', href: '/prompts/business-ops/email-signature-copy' },
          ' — feeds directly into the ',
          {
            text: 'Email Signature Generator',
            href: '/business/email-signature-generator',
          },
          ', giving every one of the emails and documents above the same consistent, professional sign-off rather than a signature nobody has revisited since it was first set up.',
        ],
      ],
    },
    {
      heading: 'When client operations need a real system, not just better emails',
      body: [
        [
          "Better templates fix the writing. If the actual operational problem is tracking many clients, projects and invoices without a proper system, that's software, not copywriting. ",
          {
            text: "That's exactly what Scult's software team builds",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your operations.',
        ],
      ],
    },
  ],
  relatedTools: ['invoice-generator', 'email-signature-generator'],
  relatedPrompts: ['client-proposal-that-gets-signed', 'billable-line-item-descriptions'],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
