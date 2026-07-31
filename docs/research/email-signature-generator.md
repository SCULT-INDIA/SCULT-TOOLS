# Email Signature Generator — research brief

Searched 2026-07-30 with WebSearch (queries: `email signature generator`,
`free email signature generator gmail outlook html`) and confirmed each product's
feature set by fetching its own landing page. URLs below are the ones the SERP
returned, not reconstructed from memory.

## Competitors

1. HubSpot Email Signature Generator — https://www.hubspot.com/email-signature-generator
2. WiseStamp — https://www.wisestamp.com/email-signature-generator/
3. MySignature — https://mysignature.io/
4. Newoldstamp — https://newoldstamp.com/email-signature-generator/
5. SignatureForEmail — https://signatureforemail.com/

Also ranking on both queries: **Canva**
(https://www.canva.com/create/email-signatures/) and **Gimmio**
(https://gimm.io/en_US/email-signature-generator). Canva is excluded from the five
because it is not actually a competitor at the job: Canva's own help centre states
HTML export is not available, so what you get is a flat image and the links inside
it are not clickable — you have to re-add every link by hand in Gmail afterwards.
Gimmio's page would not render for inspection (JS-only shell), so rather than
guess at its features it is recorded here as present in the results and not
counted toward the trait analysis.

### Corrections to the plan's hypothesis

`docs/TOOL_REDESIGN_PLAN.md` §4 guessed the set as *HubSpot, WiseStamp,
MySignature, Designhill* and proposed the USP "never gates output behind a form
(HubSpot does)". Two corrections, both material:

- **Designhill does not rank for the keyword.** What ranks is its *blog listicle*
  about other people's generators (`designhill.com/design-blog/...`), which is a
  content farm result, not the tool. Newoldstamp and SignatureForEmail rank in its
  place. Mail-Signatures.com did not appear either.
- **HubSpot is not gated.** Its page states "completely free with no hidden
  costs, no trial period, and no account required", and it hands over the HTML
  source. The planned USP was therefore false as written and has been rewritten
  below. Gating is real in this market — but it is Newoldstamp, SignatureForEmail
  and MySignature doing it, not HubSpot.

## Common traits (3+ of 5) — table stakes

| Trait | Seen in | Status here |
|---|---|---|
| Several ready-made layouts | 5/5 | **Shipped** — 3 (Classic, Stacked, Corporate) |
| Photo / headshot **and** company logo | 5/5 | **Shipped** — one image slot, by URL |
| Social links | 5/5 | **Shipped** — LinkedIn, X, Instagram, GitHub |
| Live preview while editing | 4/5 | **Shipped** — recomputed per keystroke, no debounce |
| Brand colour customisation | 5/5 | **Shipped** — picker + hex field, validated |
| Copy as rich text, ready to paste into the client | 5/5 | **Shipped** — `text/html` + `text/plain` ClipboardItem |
| Raw HTML source available | 4/5 | **Shipped** — as a peer view of the preview, pretty-printed, with line numbers |
| Per-client install instructions | 4/5 | **Shipped** — Gmail, Outlook (Windows), Outlook web, Apple Mail |
| Mobile preview | 4/5 | **Shipped** — 360px width toggle on the preview frame |
| Promotional banner / CTA button | 4/5 | **Excluded** — see below |
| Font family choice | 3/5 | **Excluded** — see below |

## Deliberately excluded

- **Promotional banners and CTA buttons.** Four of the five offer them, and for
  three of those the banner is the hook for the paid tier: it is where click
  tracking, campaign scheduling and analytics get sold. We cannot offer tracking
  (there is no server, which is the point) so we would be shipping the decoration
  without the function. A banner also needs a second hosted image, doubling the
  "my signature broke because the image URL died" failure mode that is already the
  tool's main limitation.
- **Font family choice.** Three of the five let you pick a font, from lists that
  read as safe — Georgia, Verdana, Tahoma, Trebuchet MS. They are not safe. Those
  are Microsoft core fonts: present on Windows and macOS, absent from stock
  Android and most Linux, so choosing one means an unpredictable silent fallback
  in exactly the clients you cannot test. Arial/Helvetica/sans-serif is the only
  stack that resolves everywhere, so it is the only one offered. Stated in the
  UI rather than hidden, so the absence reads as a decision.
- **Hosting your photo.** Every competitor uploads and stores the image. We take a
  URL instead. That is a genuine downgrade in convenience and is called out in the
  field hint — but hosting files would need a server, a storage bill and an image
  moderation problem, and it would break the claim that nothing you type leaves
  the tab.
- **One-click browser-extension install into Gmail** (WiseStamp, Newoldstamp).
  2/5, and it requires shipping an extension with read/write access to the user's
  mailbox. Copy-and-paste costs the user ten seconds and costs them no permissions.
- **Handwritten-signature drawing** (HubSpot, SignatureForEmail). 2/5, not table
  stakes, and it produces an image — see the hosting point above.
- **Legal disclaimer block.** 2/5. It is a paragraph of text the user's legal team
  supplies; pasting it under the signature in their own client is not a feature.

## Individual standouts

- **HubSpot** — the honest benchmark of the set: 12 templates, no account, no
  watermark, HTML source included. Anything we claim has to be true *against
  HubSpot*, not against the paywalled tools.
- **WiseStamp** — installs the signature for you (Chrome extension for Gmail,
  one-click for Outlook/Yahoo/Apple Mail) instead of making you paste it.
- **MySignature** — the deepest template gallery and the clearest per-client
  install guides, one page per client.
- **Newoldstamp** — banner campaigns with scheduling plus click analytics; the
  most complete "signature as a marketing channel" product. Its free tier adds
  Newoldstamp branding to your signature; removing it is a paid plan.
- **SignatureForEmail** — the widest field set by far (10 social icons, 3 CTA
  buttons, custom text rows, dark-mode and multi-device previews). Its catch is
  that the full HTML code and branding removal are behind payment.

## Our USP

**Ours is the only one that shows you the exact email-safe HTML it produced,
next to the preview, and never uploads or hosts anything to do it.**

Three parts, each checkable rather than asserted:

1. **The source is a peer view, not a buried export.** Every other tool treats
   the HTML as a copy-to-clipboard afterthought — HubSpot's own community has a
   thread titled "Email signature generator source code copy does nothing". Here
   the markup is a toggle away from the render, pretty-printed with line numbers,
   because the whole reason signatures collapse in Outlook is invisible in a
   preview and obvious in the source.
2. **The markup is provably Outlook-safe.** Desktop Outlook renders mail with
   Microsoft Word's engine — no flexbox, no grid, unreliable margins — and Gmail
   deletes `<style>` blocks. So the generator emits nested tables with a style
   attribute on every element, and `logic.test.ts` asserts on every template that
   the output contains no `class=`, no `flex` and no `grid`. That is a test, not
   a marketing sentence.
3. **Nothing leaves the tab, and nothing is gated.** No account, no watermark row,
   no paid tier holding the HTML back — the three paywalled competitors each hold
   back one of those. Your photo stays at your own URL; your phone number and
   address are assembled by JavaScript in your browser and go from there to your
   clipboard.

The one thing we cannot claim: being the *only* ungated generator. HubSpot is
ungated too. The difference against HubSpot is inspectability and locality, not
price.

## Design decisions

- **Left pane: template chips first, then the fields.** Layout is the decision
  that changes everything else, so it leads. The chips carry a small abstract
  glyph of the arrangement, because "Corporate" means nothing until you see that
  it is two columns split by a rule.
- **Right pane: the signature inside a mock compose window.** A signature judged
  on white nothing looks fine; judged under "Best," at the bottom of a real
  message it is obvious when the photo is too big or the accent too loud. The
  frame is chrome, drawn in brand tokens; the signature inside it is the user's
  own styling and is deliberately exempt from our palette.
- **Preview / HTML is a toggle in the toolbar, not two stacked panels.** They are
  the same artefact at two levels of detail, so they occupy the same space.
- **Preview width toggle (Desktop / 360px).** Signatures are read on phones more
  than on desktops, and a 64px photo plus three inline links is exactly the
  combination that wraps badly at 360px. Hidden in HTML view, where it is
  meaningless.
- **Two copy buttons, clearly different.** "Copy signature" writes a `text/html`
  ClipboardItem (with a `text/plain` half) — that is the one that keeps formatting
  when pasted into Gmail's signature box. "Copy HTML" writes the source, for
  people pasting into an Outlook admin console or a template. When `ClipboardItem`
  is unsupported the rich copy falls back to copying the raw HTML and says so in
  the button rather than failing silently.
- **Install instructions are a segmented picker, not four stacked accordions.**
  Four clients, one visible set of steps, so the pane height does not jump.
- **The status bar carries the one number that predicts trouble:** the byte size
  of the signature, next to Gmail's 10,000-character signature ceiling, plus
  whether a remote image is present (the other main cause of a signature that
  looks broken on arrival).
