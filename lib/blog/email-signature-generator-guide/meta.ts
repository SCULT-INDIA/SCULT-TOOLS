import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'email-signature-generator-guide'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every claim checked against lib/tools/email-signature-generator/meta.ts —
 * the real three layouts (Classic/Stacked/Corporate), the table-based
 * inline-CSS construction, and why that specifically survives Outlook.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Why Email Signatures Break in Outlook (And How to Fix It for Good)',
  h1: "Your email signature looks fine in Gmail and broken in Outlook — here's why",
  targetKeyword: 'email signature generator',
  description:
    "Desktop Outlook renders email with Microsoft Word's engine, not a browser engine — which is why modern CSS signatures break. A free generator that builds the one format that survives both.",
  dek: 'A signature built like a small web page — flexbox, grid, modern CSS — looks perfect in Gmail and collapses in desktop Outlook, because Outlook is not rendering it with a browser at all. Here is the actual reason, and the table-based format that avoids it entirely.',
  sections: [
    {
      heading: "The real reason: Outlook doesn't use a browser engine",
      body: [
        [
          "Here is the fact that explains almost every broken email signature: desktop Outlook on Windows renders HTML using Microsoft Word's layout engine, not a browser engine like Chrome or Edge use. Word ignores flexbox, ignores CSS grid, ignores max-width, and ignores most modern CSS entirely — so any signature built the way a modern web page is built (a flex container with a photo and text side by side, for instance) simply collapses into a vertical stack of unstyled elements the moment it opens in desktop Outlook, while looking completely normal in Gmail or Apple Mail, which do use real browser engines.",
        ],
        [
          'The ',
          {
            text: 'Email Signature Generator',
            href: '/business/email-signature-generator',
          },
          " on this site sidesteps the entire problem by never using modern CSS layout in the first place: it builds nested-table markup with every style declared inline, directly on each element — the one construction method Word's engine has always rendered correctly, because that has been the email-signature convention since long before flexbox existed. It is not a clever workaround; it is simply building for the actual rendering engine your recipient will use, rather than assuming every email client behaves like a modern browser.",
        ],
      ],
    },
    {
      heading: 'The three layouts, and which fits which role',
      body: [
        [
          'Classic places a photo on the left with text to the right — the traditional, familiar signature shape most people expect, and a safe default for most roles. Stacked centres everything with a minimal, vertical arrangement — suits a cleaner, more modern aesthetic, and works particularly well when there is no photo at all. Corporate uses two columns with an accent rule dividing them — reads as more formal and structured, a natural fit for client-facing roles at a larger or more established business where the signature is effectively a small piece of brand collateral.',
        ],
        [
          "All three compile down to the identical table-based, inline-CSS construction underneath — the choice between them is purely visual, with zero difference in which email clients will render the result correctly. Pick whichever layout matches how the rest of your company's communication looks, rather than assuming one is technically safer than another.",
        ],
      ],
    },
    {
      heading: 'Copying it correctly: rich text, not raw code',
      body: [
        [
          "One detail that trips people up if they try to work around the tool rather than through it: clicking Copy signature copies the result to your clipboard as a real text/html ClipboardItem — rich, formatted content — not as raw HTML source text. Pasting it into Gmail or Outlook's signature box therefore preserves the actual formatting directly, because you are pasting a formatted signature, not a block of code that a signature box would otherwise display literally as text.",
        ],
        [
          'In Gmail specifically: click Copy signature, then in Gmail open Settings, See all settings, and scroll to the Signature section on the General tab. Create a new signature, paste directly into the box, and click Save Changes at the bottom — the formatting survives because the paste is rich text. In Outlook: copy the signature the same way, then in desktop Outlook go to File, Options, Mail, Signatures, or in Outlook on the web go to Settings, Mail, Compose and reply. Paste into a new signature and set it as your default.',
        ],
      ],
    },
    {
      heading: 'What can go wrong even with correct table markup',
      body: [
        [
          "Two remaining failure points worth knowing about, neither of which the table construction can fully solve. First: photo and logo URLs must already be hosted somewhere that serves them at a stable, public https address — this tool does not host or upload images itself, so a broken or private image link breaks the signature's visual identity even though the underlying HTML is perfectly correct. Google Drive and WhatsApp links in particular are viewer pages, not direct image URLs, and will not render at all inside an email; your own website, or a dedicated image host, is the reliable choice.",
        ],
        [
          'Second: many email clients block remote images by default for security and privacy reasons, showing a placeholder or a "click to download images" prompt until the recipient explicitly chooses to load them. This is a client-side setting entirely outside the signature\'s control — the markup is correct either way, the image is simply waiting for the recipient\'s own client to decide to fetch it.',
        ],
        [
          'One more limitation to keep in mind: custom web fonts are not reliably supported across email clients at all, so this generator deliberately uses Arial and Helvetica rather than attempting a branded typeface that would silently fall back to whatever font the recipient happens to have installed. In a signature specifically, rendering identically everywhere matters more than typographic flair — an inconsistent fallback font looks more unprofessional than a plain, universal one.',
        ],
      ],
    },
    {
      heading: 'Worked example: a Corporate-layout signature for a client-facing role',
      body: [
        [
          "Fill in your name, role and contact details — the preview updates live as you type. Add up to four social links (LinkedIn, a company site, whatever is relevant to the role) and, if you have one publicly hosted somewhere reliable, a photo or logo URL. Pick Corporate as the layout for a client-facing sales or account role, set your brand accent colour to match the rest of your company's visual identity, then click Copy signature and paste it into Outlook or Gmail using the steps above.",
        ],
        [
          'Test the result by sending yourself a real email through the client you actually use day to day — the live preview in the generator is accurate, but a real send-and-receive test catches the specific quirks of your own email client configuration that a generic preview cannot fully simulate.',
        ],
      ],
    },
    {
      heading: 'Privacy: nothing here is uploaded, including the sensitive parts',
      body: [
        [
          'Every field — your name, phone number, every social link — is assembled entirely in your browser and copied straight from there to your clipboard. Nothing you type ever touches a server, which matters more for this specific tool than it might first seem: an email signature routinely contains a direct phone number, a physical office address, and social profile links, exactly the kind of personal contact information that should not pass through a third-party server just to generate an HTML block.',
        ],
      ],
    },
    {
      heading: 'When a signature is part of a bigger identity rollout',
      body: [
        [
          "A single signature for one person is a five-minute job with this tool. Rolling a consistent, on-brand signature out across an entire team — with a shared template, correct brand colours applied uniformly, and a maintained standard as people join or change roles — is a different scale of problem, closer to a brand-consistency project than a one-off generation. That's exactly the kind of rollout ",
          { text: "Scult's branding team", href: SERVICE.href, external: true },
          " handles as part of a broader visual identity system, rather than each employee generating their own signature independently and drifting slightly out of sync with everyone else's.",
        ],
        [
          'Rolling this out across a team and want it done consistently the first time? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " and we'll talk through what a team-wide standard actually needs.",
        ],
      ],
    },
    {
      heading: 'Once the signature is live',
      body: [
        [
          "A finished signature pairs naturally with the rest of a small business's paperwork. If you send invoices regularly, the ",
          { text: 'Invoice Generator', href: '/business/invoice-generator' },
          ' produces the matching document your new signature will accompany, and a static ',
          { text: 'QR code', href: '/dev/qr-code-generator' },
          ' linking to a booking page or your UPI address is a small addition worth considering in the same signature — scanned directly from a phone rather than requiring the recipient to click a link buried in signature text.',
        ],
      ],
    },
  ],
  relatedTools: [
    'email-signature-generator',
    'invoice-generator',
    'qr-code-generator',
    'word-counter',
  ],
  relatedPrompts: ['email-signature-copy'],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
