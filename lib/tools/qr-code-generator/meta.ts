import type { Tool } from '../types'

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
  ],
}
