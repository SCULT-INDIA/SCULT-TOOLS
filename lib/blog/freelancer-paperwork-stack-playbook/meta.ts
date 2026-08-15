import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'freelancer-paperwork-stack-playbook'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: "A Freelancer's Complete Paperwork Stack in One Afternoon (Free)",
  h1: 'Invoice, signature, proposal and follow-up — the whole admin stack, free',
  targetKeyword: 'freelancer business setup checklist',
  description:
    'A GST-ready invoice, an Outlook-safe email signature, a proposal template, and follow-up email prompts — the complete client-facing paperwork stack, built free in one sitting.',
  dek: 'The paperwork side of freelancing is genuinely solvable in an afternoon with the right free tools and prompts, in the right order — here is that order.',
  sections: [
    {
      heading: 'Step 1: the signature every outgoing email needs',
      body: [
        [
          'Start with the ',
          {
            text: 'Email Signature Generator',
            href: '/business/email-signature-generator',
          },
          ' — everything else you send from here on carries this signature, so building it first means every subsequent email already looks professional. Pick a layout, set your brand accent colour, and use the ',
          {
            text: 'email signature copy prompt',
            href: '/prompts/business-ops/email-signature-copy',
          },
          ' if the wording needs polish.',
        ],
      ],
    },
    {
      heading: 'Step 2: a proposal template that actually gets signed',
      body: [
        [
          'Run the ',
          {
            text: 'client proposal prompt',
            href: '/prompts/business-ops/client-proposal-that-gets-signed',
          },
          ' against your typical engagement shape once, and keep the result as a reusable template rather than rewriting a proposal from scratch for every new client.',
        ],
      ],
    },
    {
      heading: 'Step 3: scope of work, before the project starts',
      body: [
        [
          "Turn a client's vague first request into a real scope document with the ",
          {
            text: 'scope-of-work prompt',
            href: '/prompts/business-ops/scope-of-work-from-a-vague-request',
          },
          ' — the single highest-leverage document for avoiding a scope dispute weeks into a project.',
        ],
      ],
    },
    {
      heading: 'Step 4: the invoice itself',
      body: [
        [
          'The ',
          { text: 'Invoice Generator', href: '/business/invoice-generator' },
          ' handles the actual billing — GST mode with correct CGST/SGST/IGST splits, eight currencies for international clients, and a live A4 preview printed straight to PDF. Use the ',
          {
            text: 'billable line-item descriptions prompt',
            href: '/prompts/business-ops/billable-line-item-descriptions',
          },
          ' so every line item is clear enough that a client never has to ask what it covers.',
        ],
      ],
    },
    {
      heading: 'Step 5: the two emails nobody enjoys writing',
      body: [
        [
          'Keep the ',
          {
            text: 'overdue invoice follow-up',
            href: '/prompts/business-ops/overdue-invoice-follow-up-email',
          },
          ' and ',
          {
            text: 'decline scope-creep email',
            href: '/prompts/business-ops/decline-scope-creep-email',
          },
          ' prompts ready before you need them — both are genuinely hard to word well under time pressure, which is exactly when you will need them.',
        ],
      ],
    },
    {
      heading: 'What this stack does not cover',
      body: [
        [
          'None of this tracks payment status across many clients or scales past a manageable handful of active engagements — there is no ledger, just the single autosaved invoice draft in your browser. Past a certain volume, ',
          {
            text: 'that becomes real software territory',
            href: SERVICE.href,
            external: true,
          },
          ', not a bigger free tool.',
        ],
      ],
    },
    {
      heading: 'Once the stack is outgrowing you',
      body: [
        [
          'Sending enough invoices that tracking payment status by memory has become genuinely hard? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " and we'll help you figure out whether it's time for real operational software.",
        ],
      ],
    },
  ],
  relatedTools: ['invoice-generator', 'email-signature-generator'],
  relatedPrompts: [
    'client-proposal-that-gets-signed',
    'scope-of-work-from-a-vague-request',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
