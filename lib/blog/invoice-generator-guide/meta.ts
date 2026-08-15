import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'invoice-generator-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every claim checked against lib/tools/invoice-generator/meta.ts —
 * Classic/Minimal/Agency are purely visual styles (not billing-purpose
 * templates), GST mode is an independent toggle, eight real currencies
 * (INR/USD/EUR/GBP/AED/AUD/CAD/SGD), and the discount-before-tax rule.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Free GST Invoice Generator for Indian Freelancers (No Signup)',
  h1: 'A clean, correct invoice in under a minute — GST-ready, uploaded nowhere',
  targetKeyword: 'free invoice generator india',
  description:
    'Create a professional invoice with correct GST math, eight currencies and a live A4 preview — printed straight to PDF from your browser. Free, no signup, nothing uploaded.',
  dek: 'Most invoicing tools either cost a monthly subscription for something you use twice a month, or get the tax maths subtly wrong in a way you only discover when a client questions it. This one is free, runs entirely in your browser, and gets the one calculation that actually matters — discount before tax — right by construction.',
  sections: [
    {
      heading: "Why 'discount before tax' is the detail that actually matters",
      body: [
        [
          'Here is a mistake that shows up constantly in hand-built spreadsheet invoices: applying a discount after calculating tax, rather than before it. The correct order — the one that matches standard GST and VAT treatment everywhere — is to apply the discount first, then charge tax on the resulting, lower taxable value. Get the order backwards and you overstate the tax you collect on every single invoice, a small error that compounds across a full financial year and creates exactly the kind of discrepancy an accountant flags during reconciliation.',
        ],
        [
          'The ',
          { text: 'Invoice Generator', href: '/business/invoice-generator' },
          ' on this site applies the discount before tax by construction — you cannot generate an invoice that gets this order wrong, because the calculation is not something you configure, it is simply how the tool works. Underneath that, amounts are computed in integer minor units rather than floating-point decimals: each line total is rounded exactly once, and the discount and tax are each rounded exactly once more, so the subtotal minus the discount plus the tax reconciles perfectly rather than drifting by a paisa or a cent the way floating-point rounding errors tend to accumulate across many line items.',
        ],
      ],
    },
    {
      heading: 'Three visual styles, not three billing modes',
      body: [
        [
          "It's worth being precise about what Classic, Minimal and Agency actually are here, because it is easy to assume otherwise: these are three visual layouts — different fonts, spacing and header treatments — and nothing else. Switching between them can never change what a client is actually billed; the underlying line items, tax calculation and totals are completely independent of which style renders them. Pick whichever one matches your brand's tone and move on; there is no functional trade-off buried in the choice.",
        ],
        [
          'GST mode is a separate, independent toggle from the visual style — turn it on for a standard Indian tax invoice with a GSTIN field and automatic CGST/SGST/IGST splits calculated correctly on the post-discount taxable value. One honest limitation worth stating plainly: this produces a standard GST tax invoice, not a government e-invoice — there is no IRN (Invoice Reference Number) or signed QR code from the government e-invoicing portal, which specific turnover thresholds require. If your business is above that e-invoicing threshold, this tool covers the invoice document itself but not the government registration step on top of it — confirm your specific obligation with an accountant, since this is guidance, not tax advice.',
        ],
      ],
    },
    {
      heading: 'Billing internationally: the eight currencies that actually work',
      body: [
        [
          'A generic invoice template that only handles rupees becomes a real problem the moment you take on a client outside India. This generator supports eight currencies with correct local formatting for each — INR, USD, EUR, GBP, AED, AUD, CAD and SGD — so a US client sees an invoice formatted the way US invoices actually look, not a rupee template with the symbol swapped out. Switching currency does not touch the underlying maths; it only changes how the same calculated totals are displayed and labelled.',
        ],
        [
          'For a freelancer or small agency taking on international clients for the first time, getting this formatting right on the first invoice matters more than it seems — an invoice that looks locally unfamiliar reads as less professional to the person paying it, entirely independent of whether the actual numbers are correct.',
        ],
      ],
    },
    {
      heading: 'Where your data actually lives (and where it never goes)',
      body: [
        [
          "Every field you fill in — your business details, your client's information, every line item, even an uploaded logo — is read and rendered entirely in your own browser tab. The draft autosaves to your browser's local storage as you type, so closing the tab and coming back later restores exactly where you left off, but nothing is ever transmitted to a server. That includes the logo: drop a PNG, JPG, SVG or WebP under 1MB onto the logo area and it is read locally into the page and saved with your browser draft — never uploaded anywhere, the same as every other field.",
        ],
        [
          'This matters more for an invoice specifically than for most of the free tools on this site, because an invoice by definition contains genuinely sensitive information — client names, addresses, exact amounts charged, sometimes a GSTIN. A tool that quietly uploaded that to a server for "processing" would be a real privacy exposure; this one has no server in the loop to upload it to.',
        ],
      ],
    },
    {
      heading: 'Worked example: a Net 30 invoice with a discount, start to finish',
      body: [
        [
          "Fill in your business details and your client's — the A4 preview updates live as you type. Add line items with a description, quantity and rate; the subtotal calculates automatically. Apply a percentage or flat discount if one applies, set your tax label and rate (or switch on GST mode for the automatic CGST/SGST/IGST split), and pick a payment term — Net 7, 14 or 30 — which fills in the due date for you rather than requiring you to calculate it by hand.",
        ],
        [
          'Check the live preview against your expectations, then use your browser\'s own Print dialog and choose "Save as PDF" as the destination — the print stylesheet strips away everything except the invoice sheet itself, so the resulting PDF contains exactly the A4 invoice and nothing else. Use "Next number" to continue your invoice numbering series consistently across multiple invoices, since a professional invoice sequence matters for your own bookkeeping as much as for how it looks to the client.',
        ],
      ],
    },
    {
      heading: 'What this tool deliberately does not do',
      body: [
        [
          'There is no client database and no invoice ledger beyond the single autosaved draft in your browser — if you send dozens of invoices a month and need to track payment status, aging, or a full client history, that is genuinely a different category of tool (proper accounting or invoicing software with a real backend), not a gap in this one. This tool is built for the specific, common case of a freelancer or small business that needs a correct, professional invoice generated quickly without paying a monthly subscription for features they use occasionally.',
        ],
        [
          'If you have outgrown that scope — you need recurring invoices, payment tracking, multi-user access, or integration with actual accounting software — ',
          {
            text: "that's a real software project, and it's the kind of thing Scult's custom software team builds",
            href: SERVICE.href,
            external: true,
          },
          ', tailored to how your specific business actually invoices rather than a one-size template.',
        ],
        [
          'Not sure whether you need a bigger system yet, or just a better process around this tool? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " and we'll talk through it honestly — sometimes the free tool genuinely is enough.",
        ],
      ],
    },
    {
      heading: 'Pair it with the rest of your invoicing workflow',
      body: [
        [
          'Once an invoice is out, an ',
          {
            text: 'Email Signature Generator',
            href: '/business/email-signature-generator',
          },
          ' signature on the email you send it with adds a level of professional polish that a bare-text email lacks — and, unlike a plain-text signature, one built as bulletproof table HTML actually survives Outlook, which strips most modern CSS. If you accept payment via UPI, a static ',
          { text: 'QR code', href: '/dev/qr-code-generator' },
          ' on the invoice itself lets a client pay by scanning, encoded directly with your UPI address rather than through a redirect that could stop working later.',
        ],
      ],
    },
  ],
  relatedTools: [
    'invoice-generator',
    'email-signature-generator',
    'qr-code-generator',
    'business-name-generator',
  ],
  relatedPrompts: ['billable-line-item-descriptions'],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 13,
}
