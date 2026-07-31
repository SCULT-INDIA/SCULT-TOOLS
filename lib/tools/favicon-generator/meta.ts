import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'favicon-generator',
  category: 'dev',
  title: 'Favicon Generator',
  h1: 'Favicon Generator',
  description:
    'Make a complete favicon set — favicon.ico, PNGs and apple-touch-icon — from an image, text or emoji. Everything is generated in your browser; nothing uploads.',
  tagline: 'One image, letter or emoji in — the whole favicon set out.',
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
    'Your source is drawn onto a 512px canvas — an image gets centre-cropped to a square, text and emoji are rendered directly — then scaled down to each target size with high-quality resampling. The favicon.ico is assembled here in the browser: ICO is not an image format but a container, a 6-byte ICONDIR header plus a 16-byte directory entry per image (with the quirk that 256px is encoded as a 0 width byte), followed by the payloads. We pack real PNGs inside it, which has been valid since Windows Vista and is what every modern browser expects, so one .ico carries crisp 16, 32 and 48px versions and the renderer picks the right one. The apple-touch-icon is flattened onto a solid background because iOS ignores alpha and paints transparency black. Android and PWA installs need no extra files beyond one 512px PNG plus a 192px one declared in site.webmanifest — Chrome scales those for every launcher density. The ZIP download is built by our own STORE-method writer with per-file CRC-32 checksums; PNGs are already compressed, so the archive stores them as-is. No canvas data, image or filename ever leaves this tab.',
  limitations: [
    'No SVG favicon output. An SVG favicon is worth adding by hand — it needs real vector source art, and rasterising a bitmap into an SVG wrapper would only inflate the file without gaining sharpness.',
    'Detailed photos and busy logos turn to mud at 16px. A favicon needs one bold shape, one or two colours, and near-zero fine detail — if the 16px preview looks smudged, simplify the source rather than fighting the scaler.',
    'Emoji rendering uses the fonts installed on your device, so the exact emoji artwork can differ slightly from what visitors on other platforms would draw — the generated PNGs freeze whichever design your system uses.',
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
  ],
}
