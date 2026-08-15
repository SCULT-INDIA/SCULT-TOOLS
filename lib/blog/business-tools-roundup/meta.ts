import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'business-tools-roundup'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: '4 Free Business Tools That Save Freelancers Real Hours Every Week',
  h1: 'Invoices, names, slogans and signatures — the paperwork every small business repeats',
  targetKeyword: 'free business tools for freelancers',
  description:
    'Invoice generation with correct GST math, a name generator, a slogan generator, and Outlook-safe email signatures — four free tools covering the recurring admin every freelancer does.',
  dek: 'The unglamorous, repetitive parts of running a small business — invoices, a company name, a signature, a tagline — are exactly what these four free tools handle without a subscription.',
  sections: [
    {
      heading: 'Invoicing: correct math, in your browser',
      body: [
        [
          'The ',
          { text: 'Invoice Generator', href: '/business/invoice-generator' },
          ' applies the discount-before-tax rule correctly by construction and supports GST mode with automatic CGST/SGST/IGST splits, across eight real currencies. Nothing is uploaded — the draft autosaves to your own browser.',
        ],
      ],
    },
    {
      heading: 'Identity: naming and slogans, without an AI credit meter',
      body: [
        [
          'The ',
          { text: 'Business Name Generator', href: '/business/business-name-generator' },
          ' builds names from five explainable strategies — no AI call, no credit limit. The ',
          { text: 'Slogan Generator', href: '/business/slogan-generator' },
          ' draws from hand-written template banks across five tones, with built-in Google Ads character badges.',
        ],
      ],
    },
    {
      heading: 'Professional polish: a signature that survives Outlook',
      body: [
        [
          'The ',
          {
            text: 'Email Signature Generator',
            href: '/business/email-signature-generator',
          },
          " builds table-based, inline-CSS HTML — the one construction method desktop Outlook's Word-based rendering engine actually renders correctly, across three layout options.",
        ],
      ],
    },
    {
      heading: 'A realistic weekly workflow',
      body: [
        [
          'Send an invoice with the ',
          { text: 'Invoice Generator', href: '/business/invoice-generator' },
          ', using a signature built once with the ',
          {
            text: 'Email Signature Generator',
            href: '/business/email-signature-generator',
          },
          ' on the email it goes out with. When naming a new offering or service line, run it through the name and slogan generators together — a matching tagline is a quick, free signal for whether a name has real legs.',
        ],
      ],
    },
    {
      heading: 'What these tools genuinely will not do',
      body: [
        [
          "None of these decide brand strategy or positioning — a name generator has no opinion on whether your business should read as premium or accessible. That decision is strategy, and it's where ",
          { text: "Scult's branding team", href: SERVICE.href, external: true },
          ' picks up once you have outgrown a DIY starting point.',
        ],
      ],
    },
    {
      heading: 'Talk through your brand',
      body: [
        [
          'Used all four and want a second opinion on where your brand actually stands? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: [
    'invoice-generator',
    'business-name-generator',
    'slogan-generator',
    'email-signature-generator',
  ],
  relatedPrompts: ['client-proposal-that-gets-signed'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 10,
}
