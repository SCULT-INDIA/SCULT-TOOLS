import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'developer-tools-roundup'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: '3 Small Developer Tools That Run Entirely in Your Browser',
  h1: 'The utilities you open twenty times a day, and why they never touch a server',
  targetKeyword: 'developer utilities free browser',
  description:
    'JSON formatting, favicon generation, and QR codes — three tools that run entirely client-side, so pasting a real API payload or generating a UPI code is genuinely safe.',
  dek: 'Three small, high-frequency developer utilities, all built the same way: nothing you paste or upload ever leaves your browser tab.',
  sections: [
    {
      heading: 'JSON: format, minify, validate, safely',
      body: [
        [
          'The ',
          { text: 'JSON Formatter & Validator', href: '/dev/json-formatter' },
          " parses using the browser's native JSON.parse, translating raw error offsets into an actual line and column. Nothing is transmitted anywhere, which matters specifically because a JSON payload is often a real API response with real data in it.",
        ],
      ],
    },
    {
      heading: 'Favicons: the four-file set, built client-side',
      body: [
        [
          'The ',
          { text: 'Favicon Generator', href: '/dev/favicon-generator' },
          ' outputs favicon.ico, apple-touch-icon.png, icon-192.png and icon-512.png — byte-assembled directly in the browser using the canvas API, with the exact HTML snippet to paste.',
        ],
      ],
    },
    {
      heading: 'QR codes: no redirect, no expiry',
      body: [
        [
          'The ',
          { text: 'QR Code Generator', href: '/dev/qr-code-generator' },
          ' encodes a URL, text, WiFi credentials or a UPI address directly into the code — never through a redirect server that could stop working later, which is how most "free" QR services quietly work under the hood.',
        ],
      ],
    },
    {
      heading: 'Why "runs in your browser" is the actual selling point',
      body: [
        [
          'All three avoid the same failure mode: a server-side tool that could log, cache, or simply disappear. For a JSON payload with real data, a favicon source image, or a UPI payment address, that client-side guarantee is a genuine, checkable property — not a marketing claim.',
        ],
      ],
    },
    {
      heading: 'When these small utilities point to a bigger engineering need',
      body: [
        [
          "Recurring JSON integration issues, or a favicon that's one small piece of a much larger site build, are signals that a bigger engineering conversation is worth having. ",
          {
            text: "That's what Scult's software team handles",
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
  relatedTools: ['json-formatter', 'favicon-generator', 'qr-code-generator'],
  relatedPrompts: [],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 9,
}
