import type { Tool } from '../types'

/**
 * The content handover's draft claimed this tool supports phone, email,
 * WhatsApp and vCard modes and a centre logo overlay. Neither is true —
 * `QrMode` in logic.ts is only `'url' | 'text' | 'wifi' | 'upi'`, and
 * QrCodeGenerator.tsx's own docblock says a logo overlay "had no backing
 * implementation anywhere in the codebase... removed entirely." Written to
 * match what actually ships, not the draft.
 */
const USES_SUPPORT: Tool['supportContent'] = [
  {
    heading: '11 practical ways to use a QR code',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'A QR code turns anything printed — a poster, a package, a receipt, a shopfront — into a tap-free link to something digital. Point a phone camera at it and it opens instantly. Here are the use cases that actually earn their place, grouped by where they pay off.',
        ],
      },
      {
        type: 'list',
        intro: 'Payments & retail',
        items: [
          'UPI payments — display a UPI QR at your counter so customers pay by scanning, no card machine needed.',
          'Product packaging — link to how-to videos, authenticity checks, or reorder pages.',
          'Loyalty & offers — a QR on the bill that opens a discount or signup page.',
        ],
      },
      {
        type: 'list',
        intro: 'Food & hospitality',
        items: [
          'Digital menus — a table QR that opens your menu; update the page any time without reprinting a single card.',
          'Table ordering or feedback — link to an order form or a review page.',
        ],
      },
      {
        type: 'list',
        intro: 'Marketing & print',
        items: [
          'Posters & flyers — send offline audiences straight to a landing page or campaign.',
          'Vehicle or storefront signage — a QR on a wrap or window decal linking to your site or booking page.',
          'Event check-in — tickets and badges that scan to register.',
        ],
      },
      {
        type: 'list',
        intro: 'Reviews, social & connectivity',
        items: [
          'Google review link — a QR that opens your "leave a review" page, useful for local search.',
          'Social follow — a QR linking straight to your Instagram or WhatsApp.',
          'Guest WiFi — guests scan to join your network without typing a password.',
        ],
      },
      {
        type: 'list',
        intro: 'Tips so your QR actually works:',
        items: [
          'Test it before you print — scan with two different phones first.',
          'Keep contrast high; dark code on a light background scans most reliably.',
          "Don't shrink it too far — aim for at least 2×2 cm on print, bigger for anything read from a distance.",
          'Add a short prompt next to it — "Scan to pay" or "Scan for menu" measurably lifts scan rates.',
          'Use a static QR (what this tool generates) for anything permanent — it never expires, unlike many "dynamic" QR services that stop working if a subscription lapses.',
        ],
      },
    ],
  },
]

export const meta: Tool = {
  slug: 'qr-code-generator',
  category: 'dev',
  title: 'QR Code Generator (with UPI)',
  h1: 'QR Code Generator — URL, Text, WiFi & UPI',
  description:
    'Generate a high-resolution QR code for a link, text, WiFi network or UPI payment. Downloads as PNG or SVG, generated locally with no tracking redirect.',
  tagline: 'Generate a permanent QR code — no redirect, no tracking, no expiry.',
  keywords: ['qr code generator', 'upi qr code generator', 'wifi qr code'],
  related: [
    'utm-builder',
    'email-signature-generator',
    'marketing-roi-calculator',
    'favicon-generator',
  ],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'C',
  updatedAt: '2026-07-28',
  owner: 'scult-growth',
  icon: 'QrCode',
  runsInBrowser: true,
  howToUse: [
    'Choose what the code should contain.',
    'Fill in the fields — for UPI, your VPA and optional amount.',
    'Pick a size and error-correction level.',
    'Download as PNG for print or SVG for scaling.',
  ],
  howItWorks:
    'QR generation happens entirely in your browser, so the code encodes your data directly rather than a tracking redirect on our domain — unlike most free generators, it keeps working even if we go away or start charging. UPI codes follow the NPCI deep-link spec: `upi://pay?pa=<vpa>&pn=<name>&am=<amount>&cu=INR`.',
  limitations: [
    "The code can't be edited after printing and there's no scan analytics — that's the trade-off for permanence.",
    'Very long inputs need a denser matrix, which needs a larger printed size to stay scannable.',
  ],
  faq: [
    {
      q: 'Do these QR codes expire?',
      a: 'No. The data is inside the code itself, so it works for as long as the destination does — with no dependency on us.',
    },
    {
      q: 'Which error-correction level should I use?',
      a: 'Medium is the sensible default. Use High for anything printed small or likely to get scuffed, such as stickers or packaging.',
    },
    {
      q: 'Is the UPI QR safe to share?',
      a: 'Yes. A UPI payment address is designed to be public — it lets people pay you, not withdraw from you.',
    },
    {
      q: 'Is it free?',
      a: 'Yes — completely free, no signup, and no limit on how many codes you create.',
    },
    {
      q: 'Do you track scans or store my data?',
      a: 'No. Generation happens entirely in this tab — the QR encodes your data directly rather than a link through a redirect on our servers, so there is nothing for us to track or store even if we wanted to.',
    },
    {
      q: 'What formats can I download?',
      a: "PNG for everyday use, or SVG for print and large formats — SVG stays sharp at any size since it's not made of pixels.",
    },
    {
      q: 'Can I customise the colours, or add a logo?',
      a: "Colours, yes — pick any two hex values for the code and background, and the scan-quality panel warns you if the contrast gets too low to scan reliably. A centre logo isn't supported; adding one is a real trade-off against scan reliability that this tool deliberately doesn't offer.",
    },
    {
      q: 'What can a QR code contain?',
      a: 'Four types: a website URL, plain text, WiFi credentials (network name and password), or a UPI payment address. Pick the type, fill in the fields, and download.',
    },
  ],
  supportContent: USES_SUPPORT,
}
