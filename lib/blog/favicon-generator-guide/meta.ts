import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'favicon-generator-guide'
const SERVICE = resolveServiceLink('web-development', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every claim checked against lib/tools/favicon-generator/meta.ts — the
 * real four-file set (favicon.ico/apple-touch-icon/icon-192/icon-512), the
 * ICO-with-PNG-payload-since-Vista fact, and the explicit no-SVG limitation.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'How Many Favicon Sizes Do You Actually Need in 2026? (Just Four)',
  h1: 'Favicons in 2026: four files, not the dozen old guides still recommend',
  targetKeyword: 'favicon generator',
  description:
    'The favicon size list from a decade ago is obsolete. Four files cover every browser, iOS, Android and PWA install today — plus a free generator that builds all four locally.',
  dek: 'Search "favicon sizes" and most guides still list a dozen dimensions for platforms that stopped needing separate icons years ago. Here is the current, actually-correct set, why the ICO format still exists at all, and a free generator that builds it entirely in your browser.',
  sections: [
    {
      heading: 'The favicon set that actually matters today',
      body: [
        [
          'Four files cover everything a modern site needs, not the dozen-plus sizes older favicon guides still recommend from an era of far more fragmented device support: favicon.ico, a multi-size container packing 16, 32 and 48 pixel versions together in one file, for browser tabs and any legacy lookup that still checks the root path directly. apple-touch-icon.png at 180×180 pixels, for iOS home-screen bookmarks. icon-192.png at 192×192, and icon-512.png at 512×512, both declared in a site.webmanifest file, covering Android home-screen icons and PWA (Progressive Web App) install prompts and splash screens.',
        ],
        [
          'The ',
          { text: 'Favicon Generator', href: '/dev/favicon-generator' },
          " on this site outputs exactly this set — from an uploaded image, typed text (up to three characters), or an emoji — along with the exact HTML snippet needed to declare all four in a page's `<head>`. There is no guessing at which of the historical dozen sizes still matters; this is the current, correct, minimal set.",
        ],
      ],
    },
    {
      heading: 'Why a PNG inside a .ico file is not a hack',
      body: [
        [
          'It sounds unusual that a single favicon.ico file can contain PNG-encoded image data rather than the older, uncompressed BMP format the ICO container originally used exclusively — but this has been standard, universally supported behaviour since Windows Vista, back in 2007. Every modern browser and operating system reads PNG payloads inside an ICO container without issue, and the practical benefit is real: PNG compression keeps the combined multi-size favicon.ico file down to just a few kilobytes, where the older uncompressed 32-bit BMP approach for the same three sizes would be noticeably larger for identical visual output.',
        ],
        [
          'This generator byte-assembles the ICO container directly in your browser using the canvas API and JavaScript — packing the 16, 32 and 48 pixel PNG-encoded versions together into one valid multi-resolution file, exactly the format browsers expect, without any server-side image processing involved.',
        ],
      ],
    },
    {
      heading: 'Why there is deliberately no SVG output',
      body: [
        [
          "One limitation stated plainly rather than glossed over: this tool does not output an SVG favicon, and that is a deliberate scope decision rather than a missing feature waiting to ship. An SVG favicon needs genuine vector source artwork — actual paths and shapes defined mathematically — not a rasterised image wrapped in an SVG container pretending to be one. A favicon built from an uploaded photo, typed text, or an emoji is fundamentally raster content by nature (pixels, not vector paths), and wrapping that raster data in an SVG file format would not deliver any of SVG's actual benefits — infinite scalability, tiny file size for simple shapes — while adding format complexity for no real gain.",
        ],
        [
          'If a business genuinely needs a vector-based, infinitely-scalable brand mark as part of a full logo package, that starts with real vector design work — a different deliverable entirely from a favicon generated from an existing raster image.',
        ],
      ],
    },
    {
      heading: 'The single most common failure: caching, not a broken file',
      body: [
        [
          'The most frequent "my new favicon isn\'t showing up" report has nothing to do with the generated files themselves — it is browser caching, and browsers cache favicons unusually aggressively, sometimes for weeks at a time, in a way a normal page reload does not clear. Three fixes, in order of how likely each is to actually solve it: do a genuine hard refresh (not just a normal reload) on the page in question; open the site in a private or incognito window, where a fresh favicon fetch is far more likely; or, for a permanent fix during development, temporarily append a query string to the favicon link tag — something like /favicon.ico?v=2 — which forces browsers to treat it as a genuinely new resource rather than reusing a cached copy under the old URL.',
        ],
      ],
    },
    {
      heading: 'Where the files actually need to go, and what to paste',
      body: [
        [
          'All four generated files belong in your site\'s web root, so they resolve at exactly /favicon.ico, /apple-touch-icon.png, /icon-192.png and /icon-512.png — browsers, notably, also probe /favicon.ico directly even without any `<link>` tag present on the page, which is precisely why root placement matters regardless of what your HTML declares. Then paste the generated HTML snippet — `<link rel="icon" href="/favicon.ico" sizes="32x32">`, an apple-touch-icon link, and a manifest reference — into the `<head>` of every page on the site, not just the homepage.',
        ],
        [
          "Before finalising a source image, check the live preview in both light and dark browser chrome specifically — a favicon has to survive both, and something that reads clearly on a light tab bar can disappear or lose contrast entirely on a dark one. Detailed photos and busy logos also tend to turn to mud at the actual 16-pixel display size real browser tabs use, however sharp they look in the generator's larger preview; simplifying the source image before generating is usually the fix if the small preview looks smudged.",
        ],
      ],
    },
    {
      heading: 'Worked example: an emoji favicon for a fast-launching side project',
      body: [
        [
          "For a project that needs a favicon today without commissioning real logo work, pick the emoji source option, choose something visually distinctive at small sizes (simple, high-contrast emoji read better than detailed ones), and check the live preview in both light and dark chrome before downloading. Grab the full set as one ZIP, drop all four files into your project's public root, and paste the generated HTML snippet into your page template's `<head>`.",
        ],
        [
          "Worth knowing: emoji artwork comes from your own device's installed font, so the same emoji can render with a visibly different style on another platform or browser — check the preview specifically on whichever platform matters most to your actual audience before finalising it as a permanent brand element.",
        ],
      ],
    },
    {
      heading: 'Privacy and licensing, in brief',
      body: [
        [
          'Everything runs client-side: your source file is read, cropped, resized and encoded entirely inside your browser tab using the canvas API, and the ICO and ZIP containers are byte-assembled in JavaScript on your own machine — nothing, not even the filename, is ever transmitted anywhere. On using an emoji specifically as a favicon: generally permitted for the common emoji sets, since the artwork bundled with major operating systems is licensed for rendering text, and open sets like Twemoji and Noto Emoji are explicitly free to use commercially with attribution. If a brand identity genuinely depends on it long-term, verify the specific licence of whichever emoji font your system happened to render.',
        ],
      ],
    },
    {
      heading: 'When a favicon is the smallest piece of a bigger launch',
      body: [
        [
          "A favicon takes minutes with a generator like this one. A full site launch or rebuild — where the favicon is one small deliverable among dozens of actually harder decisions (information architecture, performance, the build itself) — is a fundamentally different scope of work. If that's the stage you're at, ",
          {
            text: "that's what Scult's web development team handles end to end",
            href: SERVICE.href,
            external: true,
          },
          ', with a favicon and every other small polish detail included as a matter of course rather than an afterthought.',
        ],
        [
          'Planning a bigger site build and want to talk through scope first? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          ' — no obligation, just an honest conversation about what the project actually needs.',
        ],
      ],
    },
    {
      heading: 'Pair it with the rest of your visual identity',
      body: [
        [
          'A favicon reads best when it comes from the same colour system as the rest of your site. The ',
          { text: 'Colour Palette Generator', href: '/design/color-palette-generator' },
          " builds a WCAG-checked palette you can pull your favicon's background and accent colours from directly, so the small icon in a browser tab actually matches the brand rather than being picked in isolation.",
        ],
      ],
    },
  ],
  relatedTools: [
    'favicon-generator',
    'color-palette-generator',
    'website-speed-test',
    'json-formatter',
  ],
  relatedPrompts: ['logo-brief-for-designer-or-image-generator'],
  serviceTarget: 'web-development',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
