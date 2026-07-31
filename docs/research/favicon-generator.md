# Favicon Generator — research brief

Search run: **2026-07-30**, keyword `favicon generator`, plus a second pass on
`best favicon generator 2026 ico apple-touch-icon site.webmanifest download`.
Every competitor below was fetched and read, not recalled.

## Competitors

1. RealFaviconGenerator — https://realfavicongenerator.net/
2. favicon.io — https://favicon.io/ (converter: https://favicon.io/favicon-converter/)
3. RedKetchup Favicon Generator — https://redketchup.io/favicon-generator
4. Favic-o-Matic — https://favicomatic.com/
5. Favicon & App Icon Generator — https://www.favicon-generator.org/

**Two notes on the set, so the selection is auditable:**

- **Canva** ranked in the organic top five
  (https://www.canva.com/create/favicon-generator/) and was excluded on purpose:
  it is a general design editor with a favicon landing page, and export runs
  through a Canva account. It is not a favicon tool, it is a funnel.
- **Favicon.cc** (https://www.favicon.cc/) did **not** appear in the top ten for
  this keyword. It ranks for `favicon editor` / `favicon.ico generator` instead.
  It was checked anyway because it is the canonical pixel-editor tool: hand-drawn
  16×16 grid, animated-ICO support, and a public gallery of user-submitted icons.
  Its output is a bare `favicon.ico` — no PNG ladder, no apple-touch-icon, no
  manifest. It is a different product, so it is not counted in the five.

**Confidence note.** RedKetchup's page returned only its intro copy when fetched,
so its feature list below is partial: text/colour/font/corner-radius controls,
all required sizes, and an HTML snippet are confirmed from its own copy; whether
it produces a ZIP, an apple-touch-icon, or a manifest is **unconfirmed**. It is
counted only toward traits it explicitly claims.

## Common traits (3+ of 5) — table stakes

| Trait | Count | Ours |
|---|---|---|
| Image upload as the primary source | 5/5 | Yes — shared `DropZone`, PNG/JPG/SVG/WebP |
| Multi-size PNG ladder including 16/32/48 and a large icon | 5/5 | Yes — 16, 32, 48, 180, 192, 512 |
| A multi-image `favicon.ico` bundling 16+32+48 | 4/5 | Yes — hand-rolled ICO encoder in `logic.ts` |
| `apple-touch-icon.png` at 180×180, transparency flattened | 4/5 | Yes, with a user-chosen flatten colour |
| Ready-to-paste `<link>` snippet for `<head>` | 5/5 | Yes — `buildHtmlSnippet()`, one click to copy |
| Download-all archive | 4/5 | Yes — STORE-method ZIP, real CRC-32, no dependency |
| A preview of the icon before you download | 3/5 | Yes — and more of it than any of them (see below) |
| Text / initials as an alternative source, with colour + shape | 3/5 | Yes, plus a 16px legibility contrast check |
| `site.webmanifest` / Android-PWA icon declarations | 3/5 | Yes — JSON-serialised, so a quote in the site name cannot break it |
| Free, no signup, no watermark | 5/5 | Yes |

Every table-stakes trait ships. Nothing on this list is excluded.

## Individual standouts

- **RealFaviconGenerator** — the **favicon checker**: point it at a live URL and it
  audits what is actually installed and what is missing. Nothing else in the set
  closes the loop after you have shipped.
- **favicon.io** — three zero-configuration entry points (image, text, emoji), each
  one screen from landing to a downloaded ZIP. The fastest path to "done" of the five.
- **RedKetchup** — corner radius and font on one screen with the result redrawing as
  you change them, rather than behind a submit.
- **Favic-o-Matic** — the **Lazy / Obsessive / Apocalypse** size presets: one click
  decides how deep the ladder goes instead of making you reason about it.
- **Favicon & App Icon Generator** — a built-in pixel editor for hand-nudging the
  16×16 grid, which is still the only way to fix a mark that resolves to mush.

## Our USP

**Ours is the only one where all three sources — an image, initials, or an emoji —
live in a single workspace that re-renders the entire set on every keystroke: both
browser-tab mocks, every size swatch, the iOS tile, and all five files.**

Three parts, each checkable:

1. **One workspace, three sources.** favicon.io splits image / text / emoji across
   three separate pages, each with its own submit. Favic-o-Matic and Favicon &
   App Icon Generator are image-only. RedKetchup is text-first. RFG has an upload
   path and a separate logo editor. Ours switches source with one segmented
   control and keeps every other setting.
2. **Live, not submit-and-see.** Changing the tile colour, the shape, the padding
   or a letter re-encodes the whole set — including the ICO — in single-digit
   milliseconds, because the ICO and ZIP writers are ours and run locally. Tools
   that round-trip a submit cannot afford to do this.
3. **Nothing leaves the tab, so it works offline.** Decode, crop, resize, ICO,
   ZIP: all in this document.

### Correction to the original premise

The brief this tool was assigned with said *"RealFaviconGenerator uploads your
image to their server."* **That has not been true since 2024.** RFG's own post
says so directly: "Today, the favicon generation runs entirely in your browser"
(https://realfavicongenerator.net/blog/why-favicon-privacy-matters), contrasted
with "When I started RealFaviconGenerator back in 2013, doing everything
server-side was simply how things worked." favicon.io likewise states its
converter "happens in your browser."

So **"the only one that never uploads" is not an honest USP any more** and is not
claimed here. What remains true, and is worth saying plainly:

- Ours **cannot** upload, because the tool has no server route at all — the claim
  is a structural property, not a policy that can change in a redeploy.
- Two of the five make **no statement** about where processing happens, and
  Favicon & App Icon Generator offers to publish your icon in a **public
  gallery** — the opposite posture.
- Offline is a consequence: once the page is loaded, the network is not involved.

## Deliberately excluded

- **Public favicon gallery** (Favicon & App Icon Generator, Favicon.cc).
  Publishing a visitor's unreleased brand mark is the exact inverse of the
  privacy posture, and there is no server to publish to.
- **Animated `.ico`** (Favicon.cc). No current browser animates a favicon. The
  format supports it; the consumers stopped.
- **Pixel editor** (Favicon & App Icon Generator, Favicon.cc). A drawing app is a
  different product. This tool's job is producing the correct *set* from a mark
  you already have.
- **Windows Metro tile + `browserconfig.xml`** (Favic-o-Matic). Microsoft retired
  pinned-site tiles; shipping the file is cargo cult that adds a request to every
  page load for nothing.
- **The full "Apocalypse" ladder** — 57, 72, 114, 120, 144, 152, 310px. Those are
  iOS 6 and Windows 8 artefacts. 180 (iOS) + 192/512 (Android/PWA) + the 16/32/48
  ICO covers every current consumer, and a smaller ZIP is a feature.
- **A live-URL favicon checker** (RFG's best idea, and genuinely the best idea in
  the set). It requires fetching a third-party site, which needs a server route
  and contradicts the no-network promise this tool is built on. This is a product
  choice, not a capability gap — the repo already has server routes for the speed
  test — and it is a tracked follow-up rather than a silent omission.
- **`favicon.svg` output.** Only 1–2 of the five ship it, so it is not table
  stakes, and a raster source cannot be vectorised honestly. Passing an *uploaded*
  SVG straight through as `favicon.svg` is the one honest version of this and is a
  follow-up: it needs a new option on `buildHtmlSnippet()` plus tests, and this
  pass deliberately did not touch the tested encoder layer.

## Design decisions

**Layout.** Shared `ToolWorkspace`. Source and shape are toolbar controls because
they change the entire output; per-source fields are the left pane; the right pane
is nothing but the result.

**The preview stack is the point of the right pane, in failure order.** A favicon
fails in three places and the pane shows all three, largest risk first:

1. **A 16px tab, in light chrome and in dark chrome, stacked.** This is where a
   mark actually dies — a dark logo vanishes on a dark tab strip. The `<img>` is
   the real generated 16px PNG at `width={16}`, not a scaled-up render, because a
   scaled preview is a lie about the only size that matters.
2. **16 / 32 / 48 swatches at native resolution**, so you can see what the ICO
   contains rather than trusting that it is fine.
3. **An iOS home-screen tile** at 60px with the app label under it, on dark, since
   that is the context where iOS's transparency flattening becomes visible.

**Two views in the output pane, `Preview` and `Install`.** While you are designing,
the previews are all you want; when you are done, the code is all you want. They
are mutually exclusive by workflow, so one segmented pair in the pane header keeps
both above the fold with no scrolling at 1366×768 — instead of a tall scroll where
the install snippet is always just out of sight. `Install` is source-independent,
which is what removes the second empty state: with no image chosen yet, the left
pane offers the drop zone and the right pane still has real, copyable content.

**Seeded with text, not an image.** A file input cannot be pre-filled, so an
image-first default guarantees an empty first paint. The tool opens on `S` in brand
violet with the shape applied, which means the first frame already shows two tab
mocks, three swatches, an iOS tile and five downloadable files.

**A contrast check on the text source.** Every competitor lets you pick a tile
colour and a letter colour and hands back the result. At 16px a 2:1 pair is a grey
smudge. `hexContrastRatio` from `lib/tools/shared/color` scores the pair, the
number is always shown, and below 3:1 it is called out in words — the same
"show your working rather than assert a verdict" approach as the QR tool's
scannability guard.

**Padding on the image source.** Borrowed from RFG's margin control and the reason
uploaded logos usually look wrong: a wordmark exported edge-to-edge needs
breathing room, an icon meant to fill the tile does not. Three steps, not a
slider, because the difference between 11% and 12% is not a decision anyone needs
to make.

**Shape applies to all three sources.** It fills the tile for text and for an
emoji with a background, and clips the image — so a circular avatar mark is one
click rather than a trip to an image editor.

**`logic.ts` is untouched.** The ICO encoder, the STORE-method ZIP writer with real
CRC-32, the crop maths, the grapheme clamp and the snippet builders were already
correct and covered by 27 assertions. The redesign is entirely at the component
layer. Canvas work — decode, crop, stepped-halving downscale, `toBlob` — stays in
the component because it needs a browser, and the pure byte-bashing stays in
`logic.ts` because it does not.

**The status bar is the only live region.** It carries the file count, the total set
size, and the download confirmation, so the download buttons do not each need to
announce themselves.
