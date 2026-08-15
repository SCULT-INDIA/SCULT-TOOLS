import type { Tool } from '../types'

/** The content handover's draft listed icon.svg as one of the output files
 * and recommended "SVG where possible" — this tool's own `limitations`
 * already says otherwise: "No SVG output — that needs real vector source
 * art, not a rasterised wrapper." Corrected to the real four-file set. */
const SIZES_SUPPORT: Tool['supportContent'] = [
  {
    heading: 'The only favicon sizes you actually need',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          "You don't need a dozen files anymore. This set covers browsers, mobile, and PWA installs.",
        ],
      },
      {
        type: 'table',
        columns: ['File', 'Size', 'Used for'],
        rows: [
          [
            'favicon.ico',
            '16 / 32 / 48px (multi-size)',
            'Browser tabs and legacy lookups',
          ],
          ['apple-touch-icon.png', '180×180', 'iOS home screen'],
          ['icon-192.png', '192×192', 'Android and PWA installs'],
          ['icon-512.png', '512×512', 'PWA splash screen and install prompt'],
        ],
      },
      {
        type: 'code',
        intro: 'The HTML to paste in your <head>:',
        snippets: [
          {
            label: 'HTML',
            lang: 'html',
            code: `<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`,
          },
        ],
      },
      {
        type: 'prose',
        paragraphs: [
          "This generator outputs the full set — from an uploaded image, typed text, or an emoji — plus the exact code above. There's no SVG output; a favicon needs to stay legible at 16px, and that's a rasterising job, not a vector one.",
        ],
      },
    ],
  },
]

export const meta: Tool = {
  slug: 'favicon-generator',
  category: 'dev',
  title: 'Favicon Generator',
  h1: 'Favicon Generator',
  description:
    'Make a complete favicon set — favicon.ico, PNGs and apple-touch-icon — from an image, text or emoji. Everything is generated in your browser; nothing uploads.',
  tagline: 'Create perfect favicons for all platforms in seconds.',
  keywords: [
    'favicon generator',
    'favicon.ico generator',
    'ico converter',
    'emoji favicon',
    'apple touch icon generator',
  ],
  related: [
    'color-palette-generator',
    'business-name-generator',
    'website-speed-test',
    'json-formatter',
  ],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'C',
  updatedAt: '2026-07-29',
  owner: 'scult-dev',
  icon: 'AppWindow',
  runsInBrowser: true,
  howToUse: [
    'Pick a source: upload an image, type up to three characters, or choose an emoji.',
    'Check the live browser-tab preview in light and dark chrome — a favicon must survive both.',
    'Adjust colours and shape until the 16px version still reads clearly.',
    'Download the files individually or grab the whole set as one ZIP.',
    'Paste the HTML snippet into your <head> and drop the files in your site root.',
  ],
  howItWorks:
    'Your source is drawn onto a 512px canvas, then scaled to each target size with high-quality resampling. The favicon.ico is byte-assembled here as a real ICO container packing PNGs for 16, 32 and 48px, valid since Windows Vista. The apple-touch-icon is flattened onto a solid background because iOS ignores alpha. Nothing leaves your browser.',
  limitations: [
    'No SVG output — that needs real vector source art, not a rasterised wrapper.',
    'Detailed photos and busy logos turn to mud at 16px; simplify the source if the preview looks smudged.',
    'Emoji artwork comes from your device’s fonts, so it can look different on other platforms.',
  ],
  faq: [
    {
      q: 'Which favicon sizes do I actually need in 2026?',
      a: 'Four files cover everything: favicon.ico with 16/32/48px inside for browser tabs and legacy lookups, a 180px apple-touch-icon for iOS home screens, and 192px + 512px PNGs declared in site.webmanifest for Android and PWA installs. The dozens of sizes older tools produced are obsolete — platforms scale from these.',
    },
    {
      q: 'Where do the downloaded files go on my site?',
      a: 'Put all of them in the web root so they resolve at /favicon.ico, /icon-192.png and so on, then paste the HTML snippet into the <head> of every page. Browsers also probe /favicon.ico directly even without a link tag, which is why the root location matters.',
    },
    {
      q: 'Why is my new favicon not showing up?',
      a: 'Caching. Browsers cache favicons aggressively — sometimes for weeks — and a normal reload does not refetch them. Do a hard refresh, open the site in a private window to confirm the new file is live, or temporarily add a query string like /favicon.ico?v=2 to the link tag to force a refetch.',
    },
    {
      q: 'Is my image uploaded to a server?',
      a: 'No. The file is read, cropped, resized and encoded entirely inside your browser tab using the canvas API, and the ICO and ZIP containers are byte-assembled in JavaScript on your machine. Nothing — not the image, not even its filename — is transmitted anywhere.',
    },
    {
      q: 'Is a PNG inside a .ico file really valid?',
      a: 'Yes. The ICO container has accepted PNG payloads alongside classic BMP data since Windows Vista (2007), and every modern browser and OS reads them. PNG payloads are also much smaller than uncompressed 32-bit BMPs, which keeps the multi-size favicon.ico only a few kilobytes.',
    },
    {
      q: 'Can I legally use an emoji as my favicon?',
      a: 'Generally yes for the common sets: the emoji artwork bundled with major operating systems is licensed for rendering text, and open sets like Twemoji and Noto Emoji are explicitly free to use commercially with attribution. If your brand depends on it, verify the licence of the specific emoji font your system rendered.',
    },
    {
      q: 'Does it give me the HTML code to paste?',
      a: "Yes — alongside the generated files, it outputs the exact <link> tags for your <head>, so there's no guessing at the right attributes.",
    },
    {
      q: 'Is it free?',
      a: 'Yes — free, no signup, and no limit on how many times you regenerate the set.',
    },
  ],
  supportContent: SIZES_SUPPORT,
}
