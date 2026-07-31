# Colour Palette Generator — research brief

**Research run:** 30 July 2026, live WebSearch on the query `color palette generator`,
plus `color scheme generator harmony complementary analogous triadic tool` and
per-product feature checks. Page-1 organic results, in the order returned:

1. Canva Colors — https://www.canva.com/colors/color-palette-generator/
2. Figma — https://www.figma.com/color-palette-generator/
3. Muzli Colors — https://colors.muz.li/
4. *(The Noun Project blog listicle — content farm, excluded)*
5. Coolors — https://coolors.co/
6. ColorSpace — https://mycolor.space/
7. Jukebox Print — https://www.jukeboxprint.com/tools/color-palette-generator
8. Adobe Express / Adobe Color — https://color.adobe.com/
9. colourpalettegenerator.com — https://www.colourpalettegenerator.com/

**Correction to the plan's hypothesis.** `docs/TOOL_REDESIGN_PLAN.md` §4 guessed
Coolors, Adobe Color, Khroma, Paletton and Huemint. Coolors and Adobe Color are
confirmed. **Khroma, Paletton and Huemint did not appear anywhere on page 1** —
they have been displaced by Canva and Figma, both of which now rank above Coolors
on brand strength. The set analysed below is the real one.

## Competitors

1. **Coolors** — https://coolors.co/
2. **Adobe Color** — https://color.adobe.com/ (wheel: https://color.adobe.com/create/color-wheel)
3. **Canva Colors** — https://www.canva.com/colors/color-palette-generator/
4. **Figma** — https://www.figma.com/color-palette-generator/
5. **ColorSpace** — https://mycolor.space/

Muzli Colors ranked third but is a client-rendered SPA that returns no readable
markup to a fetch, so its feature list could not be verified and it is not counted
among the five. Canva's page returned HTTP 403 to a fetch; its features below come
from the search result snippet ("creates a color palette from your photo in
seconds"), which is thin evidence and is flagged as such rather than embellished.

## Common traits (3+ of 5) — table stakes

| Trait | Coolors | Adobe | Canva | Figma | ColorSpace |
|---|---|---|---|---|---|
| Named harmony modes (complementary / analogous / triadic / monochromatic) | yes | yes | — | yes ("shuffle schemes") | — |
| Lock / edit individual swatches | yes | yes (drag stops) | — | yes | — |
| Copy hex per swatch | yes | yes | yes | yes | yes |
| Export the whole palette (file or code) | yes (PDF/CSS/ASE/SVG/PNG) | yes (CC Libraries) | — | Figma handoff | — |
| Contrast / accessibility checking | yes | yes (WCAG + colour-blind sim) | — | FAQ mentions it, unanswered | — |
| Image-derived palettes | yes | yes | yes (primary mode) | — | — |
| Tints / shades from a base colour | yes | yes | — | — | yes |

Five traits clear the 3-of-5 bar: **harmony modes, per-swatch lock/edit, copy hex
per swatch, whole-palette export, contrast checking**. Image extraction also
clears it (3 of 5) and is excluded below with a reason.

### Shipped

| Trait | Status |
|---|---|
| Harmony modes | Yes — complementary, analogous, triadic, monochrome, rotated in OKLCH |
| Lock individual swatches | Yes — `aria-pressed` lock per band; locked slots survive a base change, a harmony change and a regenerate |
| Re-roll individual swatches | Yes — same hue, new lightness/chroma, so the slot keeps its role in the harmony |
| Copy hex per swatch | Yes — a copy button inside each band, drawn in that swatch's own safe text colour |
| Whole-palette export | Yes — CSS custom properties, Tailwind v4 `@theme`, JSON, hex list; copy or download, plus an SVG swatch sheet |
| Contrast checking | Yes — this is the USP, not a side panel; see below |
| Keyboard regenerate | Yes — Space, suppressed while focus is in a text field or on a button |
| Tints and shades | Yes — the 10-step OKLCH ramp of the base hue, on fixed perceptual lightness targets |

### Deliberately excluded

- **Image / photo colour extraction.** Present in 3 of 5, so it is genuinely table
  stakes and this is a real gap. Excluded because it is a different tool: it needs
  a `DropZone`, a canvas decode, and a k-means or median-cut quantiser to be worth
  anything — quantisation done badly returns five near-identical browns from any
  photograph. That is a pure-logic module with its own tests, not a control to bolt
  onto this pane, and shipping a bad version would undercut the correctness claim
  the whole tool rests on. Named as a follow-up, not silently dropped.
- **Colour-blindness simulation.** Adobe's is the best idea in the set and it is
  tempting. Excluded for now because a credible simulation needs the
  Machado/Oliveira/Fernandes deficiency matrices applied per swatch across three
  deficiency types, and a hand-waved approximation labelled "protanopia" is worse
  than no claim at all. It belongs in `logic.ts` with fixtures.
- **Palette browsing / trending palettes / accounts.** Coolors' library is its moat
  and requires a server, a database and a signup. Structurally incompatible with a
  client-only tool, and the plan's USP rests on not having one.
- **Gradients.** ColorSpace's speciality, and a separate job from a palette.
- **A shareable palette URL.** Coolors' `coolors.co/hex-hex-hex` is a genuinely
  good idea and cheap to encode. Excluded this pass because restoring a shared
  palette means pinning every slot to a literal hex, which fights the
  base-plus-harmony model the rest of the tool is built on; doing it properly means
  a third slot state. Follow-up.
- **PDF / PNG export.** The SVG sheet covers the same handoff need in a format that
  is text, diffs, and stays sharp at any size — without a PDF library in the bundle
  (the route budget is 90 KB gzipped).

## Individual standouts

- **Coolors** — the spacebar. Regeneration costs one keystroke, which is why it
  feels faster than everything else in the set. Taken, with the guard the original
  needs: it must not fire while you are typing a hex.
- **Adobe Color** — accessibility as a first-class tab: WCAG contrast plus
  colour-blind-safe checking on the palette you just made, rather than a separate
  contrast tool you have to paste into.
- **Canva** — the shortest path from a photograph to a palette.
- **Figma** — zero-friction handoff: the palette opens in the file you were going
  to use it in.
- **ColorSpace** — the most honest entry path in the set: one field, "just enter a
  colour", no chrome.

## Our USP

**Ours is the only one that computes a WCAG rating on every swatch as it is
generated and states, on the swatch itself, which text colour is safe on it — so
the palette that leaves the tool is already shippable.**

Three things make that true rather than a slogan:

1. **The rating is on the swatch, not in a separate checker.** Coolors and Adobe
   both have excellent contrast tools — as *separate pages*. You generate a
   palette, then go and paste pairs into a checker. Here every band already reads
   `White text safe · AAA pass · 8.21:1`, computed from that swatch's measured
   relative luminance.
2. **The safe text colour is proved, not asserted.** The label on each band is
   drawn *in* the colour it names. Because the black-on-X and white-on-X ratios
   cross at √(1.05/0.05) = 4.58:1, whichever of the two scores higher is always at
   least 4.58:1 — so the auto-chosen text colour clears AA for normal text on every
   possible swatch, and you are looking at the proof rather than a badge.
3. **The rating survives export.** The JSON export carries `safeTextColor`,
   `safeTextContrast` and `safeTextRating` per colour; the SVG sheet prints the
   verdict under each hex. Every competitor's export is hex-only, which throws the
   accessibility work away at the moment the palette leaves the tool.

The OKLCH engine is what makes the ratings worth having: hue rotation in HSL
changes perceived lightness by up to 4× between yellow and blue, so an HSL harmony
produces swatches whose contrast varies wildly for no reason the designer chose.
Holding L fixed in OKLab means an "equal-lightness triad" really is equal
lightness, and a 10-step ramp really has ten even steps.

Secondary, and true of the whole site: it runs in the tab, so there is nothing to
upload and no signup — Coolors gates unlimited saving, advanced PDF export and
colour-blind export behind Pro; Figma's handoff button leads to an account.

## Design decisions

- **The palette is the right pane and nothing else is.** Full-width horizontal
  bands, `flex-1` each, filling the pane height — so 2 swatches (complementary) and
  5 (monochrome) both look deliberate, and each band is wide enough to carry a
  large hex, the verdict sentence, and three actions on one line. A 5-across grid
  was rejected: at pane width each cell would be ~110 px, too narrow for the
  contrast sentence, which is the thing the tool exists to show.
- **Harmony lives in the toolbar, not the left pane.** It is a global mode switch
  affecting both panes, which is exactly what `ToolToolbar` is for and where every
  other rebuilt tool puts its mode toggle. The left pane keeps what is genuinely
  input: the base colour, the presets, and the export.
- **Space regenerates; the guards are the feature.** Two of them. The handler
  ignores the event when the target is an `input`, `textarea`, `select`, `button`,
  `a` or contenteditable, and when any modifier is held — without the `button`
  case the shortcut would hijack Space from every lock, re-roll and copy control
  in the pane, which is a keyboard trap dressed as a shortcut. And it only claims
  the key while the workspace is on screen — a synchronous `getBoundingClientRect`
  read at keydown — because Space is the page's scroll key and a bare window
  listener would take scrolling away from the whole route, including the
  explanation and FAQ below the tool. Coolors can get away with a global listener
  because its page *is* the tool; ours is not.
- **First paint is deterministic.** The seed palette is computed at module scope
  from a fixed base (`#7030F8`) and a fixed harmony, so the server HTML and the
  client's first render are identical. `Math.random()` appears nowhere; the seeded
  mulberry32 generator is created lazily inside the first event handler.
- **Locking relabels the swatch.** After locking, "Complement +180°" is a claim
  about geometry that no longer holds, so the label becomes "Complement +180° ·
  locked". A tool whose pitch is measured correctness cannot ship a quietly wrong
  label.
- **On-swatch controls use `currentColor`, not brand tokens.** A band's background
  is a user-generated colour, so `border-line-grey` or `text-ink-subtle` on it has
  no guaranteed contrast. Every control inside a band inherits the swatch's
  computed safe text colour for both its text and its border, which is ≥4.58:1 and
  therefore also clears the 3:1 non-text boundary requirement. Brand tokens are
  used for all the chrome outside the bands.
- **The ramp is a strip, not a second grid.** Ten cells across the foot of the
  output pane, each labelled with its step and hex. It is supporting evidence for
  the OKLCH claim, so it gets a supporting amount of space.
- **The status bar is the only live region.** It carries the last action ("Copied
  #7030f8", "New palette generated"), the base hex, how many swatches are locked
  and the base's own ratio on white — the tool showing its working instead of
  asserting a verdict.
