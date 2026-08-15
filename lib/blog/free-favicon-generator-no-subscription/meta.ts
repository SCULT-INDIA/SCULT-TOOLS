import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'free-favicon-generator-no-subscription'
const SERVICE = resolveServiceLink('web-development', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Every claim checked against lib/tools/favicon-generator/meta.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Free Favicon Generator — Full Set, No Subscription',
  h1: "A favicon is a one-time task. It shouldn't need a recurring subscription.",
  targetKeyword: 'free favicon generator full set',
  description:
    'The complete four-file favicon set — favicon.ico, apple-touch-icon, and PWA icons — generated free, in your browser, with the HTML snippet included. No account, no tier.',
  dek: 'Some favicon services gate the full modern icon set (PWA-ready sizes, the HTML snippet) behind a paid tier, when the entire task is a one-time, five-minute job better suited to a free tool.',
  sections: [
    {
      heading: 'What a paid favicon service tends to gate',
      body: [
        [
          'Some favicon-generation services offer basic favicon.ico creation for free but reserve the fuller modern set — apple-touch-icon, PWA-ready icon-192 and icon-512, or the ready-to-paste HTML snippet — behind a paid tier or an account. For a task most sites do once and rarely revisit, that gate adds friction to something genuinely simple.',
        ],
        [
          'The ',
          { text: 'Favicon Generator', href: '/dev/favicon-generator' },
          ' produces the complete four-file set — favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png — plus the exact HTML to paste, free, with no tier gating any of it.',
        ],
      ],
    },
    {
      heading: 'The technical detail that makes the free version fully capable',
      body: [
        [
          'The multi-size favicon.ico this tool builds packs PNG-encoded data for 16, 32 and 48 pixels into one valid container — standard, universally-supported behaviour since Windows Vista, not a paid-tier feature gap. There is no technical reason a free generator would produce a lesser favicon.ico than a paid one; the format itself has been the same for two decades.',
        ],
      ],
    },
    {
      heading: 'Where a paid service might add something real',
      body: [
        [
          'Some paid design tools bundle favicon generation into a broader brand-asset management workflow — versioning, team asset libraries, integration with a design system. That is a real feature set for an organisation managing many brand assets across many projects, genuinely different from generating one favicon for one site.',
        ],
      ],
    },
    {
      heading: 'Worked example: the full set in under five minutes',
      body: [
        [
          "Upload your logo, type up to three characters, or pick an emoji. Check the live preview in light and dark browser chrome, download the ZIP with all four files, drop them in your project's public root, and paste the generated HTML snippet into your page's `<head>`. Pull your favicon's colours from the same ",
          { text: 'Colour Palette Generator', href: '/design/color-palette-generator' },
          " you're using for the rest of your site so the icon matches your actual brand system rather than being picked in isolation.",
        ],
      ],
    },
    {
      heading: 'When a favicon is part of a bigger build',
      body: [
        [
          "A favicon takes minutes. A full site build, where it's one small piece among much larger decisions, is different scope. If that's where you are, ",
          {
            text: "that's what Scult's web development team handles end to end",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through scope first.',
        ],
      ],
    },
  ],
  relatedTools: ['favicon-generator', 'color-palette-generator', 'website-speed-test'],
  relatedPrompts: ['logo-brief-for-designer-or-image-generator'],
  serviceTarget: 'web-development',
  updatedAt: '2026-08-15',
  readingMinutes: 9,
}
