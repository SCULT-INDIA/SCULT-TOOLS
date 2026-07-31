import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'invoice-generator',
  category: 'business',
  title: 'Free Invoice Generator',
  h1: 'Free Invoice Generator',
  description:
    'Create a clean, professional invoice in your browser and print it straight to PDF. Line items, GST or VAT, percentage or flat discounts, eight currencies — and nothing you type is ever uploaded.',
  tagline:
    'A professional invoice, made in your browser — printed to PDF, uploaded nowhere.',
  keywords: [
    'free invoice generator',
    'invoice generator online',
    'invoice maker',
    'gst invoice generator',
    'invoice template india',
  ],
  related: [
    'email-signature-generator',
    'marketing-roi-calculator',
    'qr-code-generator',
    'business-name-generator',
  ],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'B',
  serviceTarget: 'custom-software',
  updatedAt: '2026-07-29',
  owner: 'scult-business',
  icon: 'Receipt',
  runsInBrowser: true,
  howToUse: [
    'Fill in your business details and your client’s — the invoice preview updates as you type.',
    'Add line items with a quantity and rate; set your tax label, discount and currency.',
    'Pick a payment term — Net 7, 14 or 30 — to fill the due date, and use Next number to continue your invoice series.',
    'Check the live A4 preview, then press Print → Save as PDF in your browser’s dialog.',
    'Come back any time — the draft autosaves to this browser, so nothing is lost.',
  ],
  howItWorks:
    'Every amount is handled in integer minor units (paise, cents) rather than floating-point rupees: each line’s quantity × rate is rounded once to the nearest paisa, the subtotal is an exact integer sum of those rounded lines, and the discount and tax are each rounded exactly once more. That is what guarantees the printed columns always reconcile — subtotal − discount + tax equals the total to the last paisa, which is not true of tools that round a floating-point chain at the end. The discount is applied before tax, matching how GST and VAT treat a trade discount shown on the invoice: tax is charged on the discounted taxable value, not the gross. Export is deliberately your browser’s own Print → Save as PDF rather than a server-generated file: a print stylesheet isolates the A4 sheet from the rest of the page, so the invoice never leaves your machine — no upload, no account, no watermark.',
  limitations: [
    'This produces a professional invoice document, not a GST-compliant e-invoice — it does not register anything on the GST portal or generate an IRN and signed QR code, which businesses above the e-invoicing turnover threshold must obtain through the Invoice Registration Portal.',
    'It keeps no client records, ledgers or invoice sequences beyond the single autosaved draft in your browser — it is a document generator, not accounting software.',
    'The PDF comes from your browser’s print engine, so exact margins depend on the print dialog; turn off “Headers and footers” there for a clean sheet.',
  ],
  faq: [
    {
      q: 'Is this invoice generator really free?',
      a: 'Yes — fully free, with no account, no watermark on the invoice, and no limit on how many invoices you create. It runs entirely in your browser, so it costs nothing to operate and there is nothing to upsell.',
    },
    {
      q: 'Where is my invoice data stored?',
      a: 'Only in your own browser. The draft autosaves to localStorage on your device and is restored when you return. Nothing — not the amounts, your client’s details, or your logo — is sent to any server.',
    },
    {
      q: 'Can I use it for GST invoices?',
      a: 'For a regular GST tax invoice, yes: put your GSTIN in the address block, set the tax label to “GST 18%” (or your slab), and the tax is correctly charged on the post-discount value. It does not generate an IRN or the signed QR code required for e-invoicing.',
    },
    {
      q: 'How do I get a PDF of my invoice?',
      a: 'Press the Print button and choose “Save as PDF” as the destination in your browser’s print dialog. The print stylesheet strips everything except the invoice sheet, so the PDF contains only the A4 invoice.',
    },
    {
      q: 'Can I add my company logo?',
      a: 'Yes — drop a PNG, JPG, SVG or WebP under 1 MB onto the logo area, or click to choose one. It is read locally into the page, shown on the invoice, and saved with your browser draft. Like everything else here, it is never uploaded anywhere.',
    },
    {
      q: 'Why is the discount applied before tax?',
      a: 'Because that is the standard GST/VAT treatment of a discount shown on the invoice: the taxable value is the price after the discount, and tax is charged on that. Applying tax first would overstate the tax you collect.',
    },
  ],
}
