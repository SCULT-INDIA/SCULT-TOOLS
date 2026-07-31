import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'email-signature-generator',
  category: 'business',
  title: 'Email Signature Generator',
  h1: 'Email Signature Generator',
  description:
    'Design a professional email signature and copy it straight into Gmail or Outlook. Three layouts, brand colour, social links — built as bulletproof table HTML.',
  tagline: 'Signatures built from HTML that survives Outlook.',
  keywords: [
    'email signature generator',
    'free email signature generator',
    'gmail signature generator',
    'outlook signature template',
    'html email signature',
  ],
  related: ['invoice-generator', 'qr-code-generator', 'slogan-generator', 'word-counter'],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'C',
  serviceTarget: 'branding',
  updatedAt: '2026-07-29',
  owner: 'scult-business',
  icon: 'Mail',
  runsInBrowser: true,
  howToUse: [
    'Fill in your name, role and contact details — the preview updates as you type.',
    'Add up to four social links and an optional photo or logo URL.',
    'Pick one of the three layouts and set your brand accent colour.',
    'Click Copy signature, then paste it into your email settings using the Gmail or Outlook steps under the preview.',
  ],
  howItWorks:
    'Email clients render HTML like it is 1999, so this generator deliberately writes 1999-era markup: nested tables, every style declared inline, absolute pixel sizes, and an Arial/Helvetica font stack. Desktop Outlook renders messages with Microsoft Word’s engine, which ignores flexbox, grid and most modern CSS; Gmail strips <style> blocks entirely and keeps only inline styles. A signature built with div-and-class markup shatters in one client or the other — table markup survives both. The Copy signature button writes the markup to your clipboard as a text/html ClipboardItem with a plain-text fallback, which is why pasting into Gmail or Outlook’s signature editor keeps the formatting instead of dumping raw code. Every value you type is HTML-escaped before it enters the markup, phone numbers become dialable tel: links with spaces stripped, and a URL missing its protocol gets https:// added and flagged.',
  limitations: [
    'Your photo or logo must already be hosted at a public https URL — this tool runs entirely in your browser and does not upload or host image files. If that URL ever dies, the image vanishes from every email you have sent.',
    'Many clients block remote images by default (desktop Outlook and most corporate setups), so recipients may see your signature without the photo until they click to download pictures. Never put essential contact details inside an image.',
    'Dark-mode email clients may invert or recolour parts of the signature. Test in the clients your contacts actually use before rolling it out company-wide.',
  ],
  faq: [
    {
      q: 'Why do email signatures break in Outlook?',
      a: 'Desktop Outlook on Windows renders HTML with Microsoft Word’s engine, not a browser engine. Word ignores flexbox, grid, max-width and most modern CSS, so anything built like a web page collapses. Signatures made of nested tables with inline styles — what this tool generates — are the only markup Word renders faithfully.',
    },
    {
      q: 'How do I add the signature to Gmail?',
      a: 'Click Copy signature, then in Gmail open Settings, See all settings, and scroll to the Signature section on the General tab. Create a new signature, paste into the box, and click Save Changes at the bottom. The formatting carries over because the copy is rich text, not code.',
    },
    {
      q: 'Where should I host my signature photo or logo?',
      a: 'Anywhere that serves the image at a stable public https URL — your own website is best. Right-click the image on your site and copy its address. Avoid Google Drive or WhatsApp links; they are viewer pages, not direct image URLs, and will not render inside emails.',
    },
    {
      q: 'Can I use a custom font in my signature?',
      a: 'Not reliably. Most email clients refuse to load web fonts, so a custom font silently falls back to whatever the recipient has installed. This generator uses Arial/Helvetica on purpose — it renders identically everywhere, which matters more in a signature than typographic flair.',
    },
    {
      q: 'Is my information uploaded anywhere?',
      a: 'No. The signature is assembled entirely in your browser and copied from there to your clipboard. Nothing you type — names, phone numbers, links — ever leaves your device or touches a server.',
    },
  ],
}
