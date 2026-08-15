import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'qr-code-generator-guide'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every claim checked against lib/tools/qr-code-generator/meta.ts and
 * logic.ts — exactly four modes (url/text/wifi/upi), no logo overlay
 * (removed entirely, per QrCodeGenerator.tsx's own docblock), and the
 * NPCI UPI deep-link format.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Free UPI QR Code Generator: URL, WiFi, Text & Payment Codes',
  h1: 'A QR code that never expires, tracks nothing, and works even if we disappear',
  targetKeyword: 'upi qr code generator',
  description:
    'Generate a permanent QR code for a URL, WiFi network, plain text or UPI payment — no tracking redirect, no expiry, no subscription. Free, with real scan-reliability guidance.',
  dek: 'Most "free" QR generators quietly route every scan through their own redirect server — which means the code stops working the moment that company shuts down or starts charging. Here is why that matters, what this generator does differently, and how to make sure a printed code actually scans.',
  sections: [
    {
      heading: 'The QR code trap almost nobody notices until it breaks',
      body: [
        [
          'Most free QR code generators do not encode your destination directly into the code. Instead, they encode a link to their own server, which redirects to your actual destination — the trick that lets them offer "scan analytics" as a feature. The catch arrives later: if that company shuts down, gets acquired, or moves your code behind a paywall, every QR code you have ever printed — on packaging, signage, business cards, anything — silently stops working, because the code itself never contained your real destination in the first place.',
        ],
        [
          'The ',
          { text: 'QR Code Generator', href: '/dev/qr-code-generator' },
          " on this site avoids that failure mode by construction: generation happens entirely in your browser, and the code encodes your actual data directly — a URL, plain text, WiFi credentials, or a UPI payment address — never a redirect through anyone's servers. It keeps working for as long as the destination itself exists, with zero dependency on this site staying online, staying free, or staying the same company. The trade-off, stated plainly, is the one thing the redirect model buys you: there is no scan analytics, because there is no server in the loop to count anything.",
        ],
      ],
    },
    {
      heading: 'The four things a QR code can actually contain here',
      body: [
        [
          "This generator supports exactly four content types, not the seven-or-more list some competing tools advertise (phone number, email, WhatsApp deep link, vCard business card — none of those exist here, and it's worth knowing that upfront rather than discovering it mid-generation): a website URL, plain text, WiFi network credentials, and a UPI payment address.",
        ],
        [
          "The UPI mode is worth a closer look because it follows a real published specification rather than an invented format: NPCI's UPI deep-link spec, structured as `upi://pay?pa=<vpa>&pn=<name>&am=<amount>&cu=INR`. That means a UPI QR generated here opens directly in any UPI-compliant payment app — Google Pay, PhonePe, Paytm, a bank's own app — because it is speaking the same standard those apps already expect, not a proprietary format only this tool understands. A UPI payment address is designed to be shared publicly in the first place; it lets someone pay you, never lets anyone withdraw from your account, so displaying it at a counter or printing it on an invoice carries no real risk.",
        ],
        [
          'WiFi QR codes solve a genuinely annoying everyday problem — a guest scans, joins your network, and never sees or types the actual password, which matters more than it sounds for a long alphanumeric router password nobody wants to read aloud. URL and plain text cover everything else: a link to a menu, a review page, a product page, or just a block of text you want someone to receive by camera rather than by typing.',
        ],
      ],
    },
    {
      heading: 'Colour, contrast, and the logo feature that deliberately does not exist',
      body: [
        [
          'You can customise the two colours — the code itself and its background — to any hex values you choose, and a scan-quality panel actively warns you if the contrast between the two drops low enough to risk an unreliable scan. That warning is not decorative: a QR code is read by contrast, not colour recognition, so a light grey code on a white background can look fine to a human eye while scanning inconsistently for an actual camera.',
        ],
        [
          'What this generator will not do — deliberately, not as a missing feature waiting to ship — is overlay a logo in the centre of the code. A centre logo is a genuine trade-off against scan reliability: it covers real data modules, and while QR codes have built-in error correction that can tolerate some obstruction, adding a logo eats into that same error-correction budget that would otherwise protect against a scuffed sticker or a slightly crooked scan angle. Rather than ship a feature that quietly makes codes less reliable in the print conditions QR codes actually get used in, this tool leaves it out.',
        ],
        [
          'On error correction specifically: Medium is the sensible default for most uses. Switch to High for anything printed small, likely to get scuffed, or displayed as a sticker exposed to wear — packaging, product labels, anything handled repeatedly. The higher correction level costs a slightly denser code but buys real resilience against the kind of physical damage a printed QR code actually experiences over its lifetime.',
        ],
      ],
    },
    {
      heading: '11 ways businesses actually use this — grouped by where it pays off',
      body: [
        [
          'In payments and retail: a UPI QR at the counter for card-machine-free payment, a code on packaging linking to authenticity checks or reorder pages, and a QR on the printed bill that opens a loyalty or discount signup. In food and hospitality: a table QR that opens a digital menu — update the linked page any time without reprinting a single physical card — and a second code for table ordering or post-meal feedback.',
        ],
        [
          'In marketing and print: posters and flyers that send an offline audience straight to a landing page, vehicle or storefront signage linking to a booking page, and event check-in codes on tickets or badges. In reviews, social and connectivity: a direct link to your Google review page (genuinely useful for local search signal), a social-follow code linking straight to Instagram or WhatsApp, and a guest WiFi code so visitors join your network without ever typing a password.',
        ],
        [
          'Five practical rules that decide whether a printed code actually works in the wild: test it with two different phones before it goes to print, not one; keep contrast high — dark code on light background scans most reliably, always; do not shrink it below roughly 2×2 centimetres for anything read up close, and go noticeably larger for anything meant to be scanned from a distance; add a short prompt beside it — "Scan to pay" or "Scan for menu" measurably lifts scan rates over a bare code with no context; and use a static code, which is what this tool generates, for anything meant to be permanent — a "dynamic" QR from a subscription service can simply stop working the day that subscription lapses, which defeats the entire point of printing something durable.',
        ],
      ],
    },
    {
      heading: 'Worked example: a WiFi QR for a small café',
      body: [
        [
          'Open the generator, pick WiFi mode, and enter the network name and password exactly as configured on the router — case matters. Choose Medium error correction for a code that will sit on a laminated table card rather than get handled directly, download as SVG so it stays sharp however large you print the card, and test the scan with two different phone models before it goes anywhere near a printer.',
        ],
        [
          "If you're pairing this with a UPI code at the same counter — a common combination for small food businesses — generate that as a separate code rather than trying to combine both into one; a QR encodes one payload, and stacking two purposes into a single code is not something the format supports cleanly.",
        ],
      ],
    },
    {
      heading: 'When a QR code is part of a bigger campaign, not a one-off print job',
      body: [
        [
          'A single static code covers a single destination well. Once you are running an actual print or signage campaign — multiple codes across different placements, each one meant to be tracked against actual campaign performance rather than just "does it scan" — the honest next tool is not a QR generator at all but proper campaign tagging: pair a QR\'s destination URL with the ',
          { text: 'UTM Campaign URL Builder', href: '/seo/utm-builder' },
          ' so the destination page itself reports back which placement drove the visit, giving you the analytics this QR generator deliberately does not track at the code level.',
        ],
        [
          "If that's the scale you're operating at — coordinated offline-to-online campaigns across multiple print placements — ",
          {
            text: "that's exactly the kind of attribution work Scult's marketing team runs",
            href: SERVICE.href,
            external: true,
          },
          ' day to day, tying physical placements to real conversion data rather than guessing which poster or package insert actually worked.',
        ],
        [
          'Want a second opinion on a specific campaign plan before you commit to print? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " — bring the placements you're considering and we'll help you think through the tracking before the print run goes out.",
        ],
      ],
    },
  ],
  relatedTools: [
    'qr-code-generator',
    'utm-builder',
    'email-signature-generator',
    'favicon-generator',
  ],
  relatedPrompts: ['utm-naming-convention-for-a-campaign'],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 13,
}
