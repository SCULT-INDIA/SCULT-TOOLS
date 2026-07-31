# Tool redesign conventions (read before touching a tool)

You are redesigning ONE tool. Follow `docs/TOOL_REDESIGN_PLAN.md` — this file is
the operational summary of it. Repo root: `D:\CLAUDE\tools.scult.in`.

## Read these first

- `docs/TOOL_REDESIGN_PLAN.md` — the method, the workspace spec, the budgets
- `components/tools/JsonFormatter.tsx` — **the reference implementation.** Match
  its shape. It is the pattern every other tool adopts.
- `components/tools/workspace/` — the shared primitives you must build on
- `app/globals.css` — the only design tokens that exist
- `lib/tools/<your-slug>/logic.ts` — your tool's existing, already-tested logic

## Step 1 — Research (do this before writing any code)

Use WebSearch. Search the tool's primary keyword the way a user would.

1. Identify the **top 5 real competitors** (not content farms, not us).
2. List every feature/interaction present in **3 or more** — these are table
   stakes and you must ship them or explicitly justify excluding them.
3. List the single best idea unique to each competitor.
4. Write the USP in one sentence: *"Ours is the only one that ___."* It must be
   true. Our structural advantages: runs client-side (private, offline-capable,
   no upload round-trip) and never gates output behind a signup.
5. Write the brief to `docs/research/<slug>.md` using this exact shape:

```markdown
# <Tool name> — research brief

## Competitors
1. <name> — <url>
… (5 total)

## Common traits (3+ of 5) — table stakes
- …

## Individual standouts
- **<competitor>** — <the one thing they do best>

## Our USP
<one sentence>

## Deliberately excluded
- <thing> — <why>

## Design decisions
<how the above maps into the workspace layout>
```

**Do not invent competitors or features.** If a search returns little, say so in
the brief rather than filling it with plausible-sounding entries.

## Step 2 — Rebuild the component

Files you may create/modify:
- `components/tools/<ComponentName>.tsx` — the rebuild
- `lib/tools/<slug>/logic.ts` + `logic.test.ts` — **only if** a new table-stakes
  feature needs new pure logic. Prefer extending over rewriting: the existing
  logic already passes tests, and regressing it is the main risk.
- `docs/research/<slug>.md` — your brief

**Never modify:** `lib/tools/registry.ts`, `components/tools/index.tsx`,
`components/ui/Icon.tsx`, `lib/tools/categories.ts`, `app/globals.css`,
`components/tools/workspace/**`, `components/tools/ToolShell.tsx`, or any other
tool's files. They already reference yours by exact name. If you genuinely need
a change in a shared file, note it in your report instead of making it.

### Layout contract (non-negotiable)

Use `ToolWorkspace` from `@/components/tools/workspace`:

```tsx
<ToolWorkspace
  toolbar={<ToolToolbar …>…</ToolToolbar>}
  input={<Pane title="…">…</Pane>}
  output={<Pane title="…" actions={<CopyButton text={…} />}>…</Pane>}
  status={<StatusBar … />}
/>
```

- Controls go in the **toolbar**, above both panes — never between them.
- **Seed with realistic sample data** so the first paint shows the tool working.
- **Never two empty states.** If input is empty, the output pane explains what
  will appear; do not repeat the same sentence in both.
- Usable without scrolling at **1366×768**.
- Results update **as you type** for pure computation. Only debounce genuinely
  expensive work (image re-encode, heavy parse) at ~150 ms with a pending state.

Some tools are form-shaped rather than editor-shaped (invoice, email signature,
schema). That is fine: the left pane holds the form, the right holds the live
preview. The workspace still applies.

**Form-shaped tools should pass a cap as well as a floor**, e.g.
`minHeight="min-h-[34rem] lg:h-[40rem]"`. `minHeight` is a free class slot applied
to both pane sections, and a floor alone is not enough: the grid row is auto-sized,
so the taller pane wins. A long form then stretches the row — measured at 1065px on
the schema tool and ~1,600px on the invoice — stranding hundreds of pixels of blank
space beside a much shorter preview, and pushing the toolbar and status bar out of
view. Capping from `lg` up keeps both in view and lets each pane scroll on its own.
Three separate agents hit this independently, so treat it as the default for any
tool whose form is longer than its output.

### Available primitives

`ToolWorkspace`, `Pane`, `ToolToolbar`, `ToolbarGroup`, `SegmentButton`,
`ToolbarAction`, `CodePane` (line-numbered + JSON syntax colouring),
`StatusBar`, `ErrorDetail`, `DropZone`, plus `CopyButton` / `ResultPanel` /
`ResultRow` from `@/components/tools/ResultPanel`.

## Step 3 — Hard rules

**Types.** TS strict + `noUncheckedIndexedAccess`: indexing yields `T | undefined`
— guard it, never `!`. No `any`. No unused locals. `import type` for types.

**Brand.** Only existing tokens. Fraunces display / Cabin body; monospace only
inside code surfaces. Controls are the neo-brutalist set (`btn-brutal`,
`chip-tool`, `field`). No new colour, no new typeface, no imported syntax theme.

**Verified contrast — these are measured, not opinions:**
- Never white text on `cta` (1.61:1) or `mint` (1.68:1) or any pastel — use `text-ink`.
- Inside `tile-*` pastels, accent text is `violet-700`, never `violet-500` (4.41:1 fails).
- On `bg-ice`, use `ink-subtle-onice`, never `ink-subtle` (4.32:1 fails).
- Brand `green` (#23CA87) is a background colour. As text on white it is ~2:1 — never use it for text.
- Colour is never the only signal: pair it with an icon, weight, or wording.

**Accessibility.** Real `<label htmlFor>` on every input. Grouped controls in
`<fieldset><legend>`. `aria-pressed` on toggles. `type="button"` always. Icons
`aria-hidden`. One polite live region per tool — `StatusBar` already is one, so
do not add a second.

**Performance.** ≤90 KB gzipped added per route; ≤50 ms interaction→result for
pure computation. No new dependency without justifying it against that budget —
build small and purpose-made instead. Anything >16 ms goes to a Web Worker.

**Mobile.** Panes stack; touch targets ≥44 px; inputs ≥16 px font (the `field`
class handles it).

## Step 4 — Verify (do not report success you have not seen)

From the repo root:

```
npx vitest run lib/tools/<slug>
npx tsc --noEmit
npx biome check components/tools/<ComponentName>.tsx lib/tools/<slug>
```

Fix everything originating in YOUR files. Ignore errors from other tools' files —
other agents are working concurrently.

If a dev server is running on :3000, load `http://localhost:3000/<category>/<slug>`
and confirm it renders and the tool actually works. If the port is busy or the
server is down, say so in your report rather than claiming a visual check.

## Known traps (found the hard way — read before debugging)

- **`TriangleAlert`, not `AlertTriangle`.** This lucide version dropped the old
  alias. Brand marks (Github/Linkedin/Twitter) are gone too — use text labels
  rather than substituting an unrelated generic icon.
- **A library that sets inline `style.width` beats your Tailwind classes.**
  `qrcode`'s `toCanvas` writes `style.width`/`height` in px to match its `width`
  option, so `w-full max-w-[Npx]` silently loses and the element overflows its
  pane — invisibly, because the pane scrolls. Reassert the sizing after the draw
  resolves. Check computed width against the parent's, don't eyeball it.
- **Early returns must include every required field.** An interface with
  `warnings: readonly string[]` and a return that omits it is a `tsc` error *and* a
  runtime crash wherever the caller does `...result.warnings`. Spreading
  `undefined` in an array literal throws.
- **`toFixed` rounds the stored double, not the decimal you typed.** `6.055` is
  held a hair below its decimal value, so it rounds *down*. Do not write a test
  asserting half-up rounding on a 3-decimal literal.
- **Grep output escaping is unreliable in this repo.** It has rendered `/^[a-z]/`
  as `\^[a-z]` and `href="/"` as `href="\"`, both of which look like real
  corruption. Always `Read` the actual lines before "fixing" a file based on grep.
- **The workspace does not fit entirely above the fold at 1366×768.** Header,
  breadcrumb, h1, tagline and badges consume ~410px. The toolbar, both pane headers
  and the first input fields do fit, which is enough to start working. Do not try
  to win the remaining pixels by shrinking the h1 — it earns its place in search.

## Already fixed in shared files (do not re-report)

Reported by redesign agents and since fixed — if you spot these, they are done:

- **Touch targets.** `SegmentButton`, `ToolbarAction` and `CopyButton` are now
  `min-h-11 sm:min-h-9` — 44px on touch viewports, 36px from `sm` up. Tool controls
  under 44px on mobile went from 37 to 0.
- **`CopyButton` failed silently.** Its `catch` reset to idle, so a blocked
  clipboard produced no feedback at all. It now has a third `failed` state that
  says "Press Ctrl+C" with an `sr-only` explanation, and widens
  `navigator.clipboard` rather than trusting lib.dom's always-present type.
- **`CodePane language="html"` rendered uncoloured.** `tokenizeHtml` now exists in
  `lib/tools/shared/tokenize.ts` (tag / attr / string / comment, same lossless
  round-trip contract as the JSON lexer, 23 tests). `language="html"` now colours.

## No author/organisation signature block — anywhere

`D:\CLAUDE\CLAUDE.md` §0 mandates an `Author / Designation / Organization` block on
every markdown document. **That rule is explicitly overridden for this repository**
by a direct instruction from the user to remove it site-wide, which §0's own
"unless the user explicitly overrides it in chat" clause permits.

Do not add one to a brief, a component docstring, a README, or a diagram. Four
briefs reintroduced it by following the global rule in good faith and had to be
cleaned up; two other agents flagged the inconsistency rather than guessing, which
was the right call. This note exists so nobody has to guess again.

## Provenance rule for briefs

Every brief must record where its competitor list came from. If live search was
unavailable, say so **in the brief** and mark the list as an unconfirmed
hypothesis — never present recalled products as a captured SERP.

When the search *does* run, expect to be wrong: of the three briefs written from
memory here, all three had materially incorrect competitor sets, and two had a USP
that a competitor already advertised as its own headline. Record the correction
rather than quietly editing the guess into a fact — a USP that survives contact
with the real SERP is worth more than one that reads well.

## Declutter pass (2026-07-31 — user directive)

The user's rule: **the tool is the page.** Keep text only where it is needed
most. `ToolShell` has already been recentred and compacted (do not touch it).
Inside a tool, the targets are:

- **Redundant field hints.** A hint that restates the label ("Enter the URL"
  under a field labelled URL) or repeats page prose goes. A hint carrying real
  constraint knowledge (SSID byte limits, GA4 casing consequences, scanability)
  stays — that is the "needed most" text.
- **Duplicated privacy claims.** The StatusBar `privacyNote` is the one place
  this belongs on the workspace. In-pane paragraphs repeating it go.
- **Explainer paragraphs inside panes** that duplicate `meta.ts` `howItWorks`.
  The page already renders that below the tool.
- **meta.ts taglines over ~120 characters** — tighten without losing the
  keyword. Do NOT gut `howItWorks`/`limitations`/`faq`: that is the SEO and
  E-E-A-T material, it lives below the fold, and it stays.

Never delete: warnings, errors, a11y text (`sr-only`, aria-*), anything a test
asserts. Verify with `npx tsc --noEmit`, biome on your files, and
`npx vitest run --no-file-parallelism lib/tools/<slug>` per slug.

## Step 5 — Report

State: the 5 competitors found, the USP, what you shipped, what you excluded and
why, which verification commands you actually ran and their results, and anything
a shared file would need that you deliberately did not change.
