# Tool Redesign Plan — all 15 tools, from scratch

**Goal:** every tool on tools.scult.in should be the one a person keeps in their
bookmarks instead of the competitor they found first. That means beating the top
5 results for its keyword on UX, speed, and correctness — not matching them.

**Status:** plan only. No tool code changes yet. Execution begins after approval.

**Priority order, applied to every decision:** UX → performance/speed →
correctness → visual polish. When two conflict, the earlier one wins.

**Non-negotiable:** every visual change uses the existing brand system — Fraunces
display, Cabin body, the violet/cta/pastel tokens, the neo-brutalist controls.
New design elements are allowed and encouraged, but they must be built from these
tokens. No new colour, no new typeface, no second design language.

---

## 1. The problem, with evidence

This is not a guess. Loading `/dev/json-formatter` on the running dev server shows
the failure clearly, and it is systemic rather than tool-specific:

| Observed | Why it fails |
|---|---|
| Input is a ~40%-width box on the left; **output renders in a separate panel far below it** | For a formatter, input and output must be comparable side by side. Today you paste at the top and scroll to see the result. |
| **Two empty panels** ("Validation" and "Formatted JSON") both say *"Paste JSON to validate and format it."* | The same empty state twice, occupying ~40% of the first screen. Dead space where the product should be. |
| Controls (Indent, Options) sit **between** input and output | The eye has to travel input → controls → output. Competitors put controls in one toolbar above both panes. |
| Textarea is small and fixed | A JSON tool's editor should dominate the viewport. |
| No line numbers, no syntax colouring, no tree view | Every top competitor has at least two of these. |

The root cause is that **there is no shared workspace layout**. Each of the 15
tools invented its own arrangement, so quality varies per tool and none of them
use the full width the page already gives them. Fixing this per-tool would
produce 15 inconsistent fixes; the plan below fixes the pattern once, then tunes
each tool inside it.

---

## 2. The research method (run for every tool, no exceptions)

Five steps per tool. Output is a short written brief committed alongside the
tool, so the design rationale is auditable later.

**Step 1 — Identify the top 5.**
Search the tool's primary keyword the way a real user would ("json formatter",
"free invoice generator", "favicon generator"). Take the top 5 genuine
competitors from organic results — not our own listings, not pure content farms.
Record the URLs.

**Step 2 — Extract common traits.**
Note every feature/interaction present in **3 or more** of the 5. These are table
stakes: their presence is invisible, but their *absence* is immediately felt.
Shipping without them is why a tool feels amateur.

**Step 3 — Extract individual standouts.**
Note the single best idea unique to each competitor — the thing only they do
well. These are the borrowable edges.

**Step 4 — Define the USP.**
Write one sentence: *"Ours is the only one that ___."* It must be true, and it
must matter to someone mid-task. Our two structural advantages, available to
nearly every tool:
- **Client-side** — no upload round-trip, works offline, private by construction.
- **No signup, no gating** — several competitors gate export or watermark output.

A USP that is only "ours is prettier" is not a USP. If no honest USP exists for a
tool, say so in the brief and compete purely on execution quality.

**Step 5 — Compose the spec.**
`all common traits` + `the best 2–3 standouts` + `our USP`, laid out in the shared
workspace (§3), with an explicit list of what we deliberately **exclude** and why.
Excluding things is part of the design; feature-matching everything produces the
cluttered tools we are trying to beat.

### Worked example — JSON Formatter (research already done)

*Competitors:* [JSONLint](https://jsonlint.com/), [CodeBeautify JSON Viewer](https://codebeautify.org/jsonviewer),
[JSONFormatter.org](https://jsonformatter.org/), [JSON Beautifier](https://jsonbeautifier.org/),
[Static.app JSON Beautifier](https://static.app/json-beautifier)

*Common traits (3+ of 5) — all must ship:*
- Two-pane layout, input and output side by side, full width
- Line numbers on both panes
- Validation errors reported **with a line number and a specific description**
- Syntax colouring / indentation that distinguishes keys, values, types
- One-click copy, plus download
- Minify as a first-class action, not a hidden option

*Individual standouts worth taking:*
- **CodeBeautify** — a collapsible **tree view** for exploring nested structures, toggled against the text view
- **CodeBeautify** — multiple input methods: paste, file, URL
- **JSONFormatter.org** — conversions out (JSON → CSV / XML / YAML)
- **JSONLint** — strict, unforgiving validation with a precise error caret

*Our USP:* ~~the only one of the six that never transmits the payload~~ —
**FALSE, corrected 2026-07-30 against a live SERP.** elmah.io advertises that it
"works without making any server requests" and json.site's own title is "Private,
Secure & Free": client-side processing is table stakes in this category, not a
differentiator. This tool has **no strong USP**, which §2 Step 4 explicitly allows —
it competes on execution (the workspace layout, error precision with the offending
line quoted, no ads, and a `<pre>`-based code surface that costs a few hundred bytes
against the 90 KB budget). See `docs/research/json-formatter.md`. The tree view is
the gap that would actually make it distinctive.

*Also wrong in the competitor list above:* CodeBeautify, jsonbeautifier.org and
Static.app do not rank for this keyword. The real top 5 is JSONLint,
jsonformatter.org, Toptal, Site24x7 and elmah.io.

*Deliberately excluded:* URL-fetch input (would require a server route and an
SSRF surface, contradicting the USP), and ad-supported "related tools" rails.

---

## 3. The shared Tool Workspace (build this first)

One layout primitive, adopted by all 15 tools. This is the highest-leverage item
in the plan — it fixes the systemic problem in §1 once.

```
┌─────────────────────────────────────────────────────────────┐
│ TOOLBAR   mode toggles · options · primary action · reset   │  sticky
├──────────────────────────────┬──────────────────────────────┤
│ INPUT PANE                   │ OUTPUT PANE                  │
│ (editor / form / dropzone)   │ (result / preview / verdict) │  equal height
│                              │ copy · download · share      │
└──────────────────────────────┴──────────────────────────────┘
│ STATUS BAR   validity · counts · timing · privacy badge     │
└─────────────────────────────────────────────────────────────┘
```

**Rules:**
- **Full container width** (1160px), not a narrow column. Panes are equal height
  and scroll independently.
- **Above the fold, always.** The workspace must be usable without scrolling on a
  1366×768 laptop. All prose (how it works, FAQ, limitations) stays below it —
  that ordering is already correct in `ToolShell` and must not regress.
- **Never two empty states.** One pane may be empty; the other must show
  something useful — a worked example, a shortcut list, or the tool's own
  explanation of what it will do.
- **Seeded by default.** Every tool paints with realistic sample data on first
  load, so the first frame demonstrates the tool working. A "Clear" action
  empties it.
- **Responsive collapse:** two panes → stacked, output first after a run on
  mobile (the result is what you came for).

**Component work required:**
- `ToolWorkspace` — the two-pane shell above
- `ToolToolbar` — consistent control row (segmented toggles, actions)
- `CodePane` — line-numbered, syntax-coloured, copyable text surface (JSON,
  schema, HTML, config outputs — reused by at least 6 tools)
- `StatusBar` — validity / counts / timing
- `DropZone` — unified file input (favicon, invoice logo)
- Upgrade `ResultPanel` to be workspace-aware rather than a standalone card

---

## 4. Per-tool research targets and expected direction

Competitors listed are the starting search targets; the real top-5 is confirmed
during Step 1. "Likely USP" is a hypothesis to validate, not a conclusion.

**Convention:** as each tool's research is actually run, a wrong hypothesis is
~~struck through~~ and the confirmed finding follows it, rather than being
overwritten. Keeping the bad guess visible is the point — it is the record of how
far off an informed assumption was, and the strike-throughs accumulating here are
the evidence that Step 1 is doing real work rather than rubber-stamping §4. So far
**every** hypothesis checked against a live SERP has needed correction.

### SEO
| Tool | Research targets | Likely USP |
|---|---|---|
| Schema Markup Generator | ~~Schema.dev, Google Structured Data Helper, SEOptimer~~ → **confirmed:** TechnicalSEO.com (Merkle), RankRanger, Attrock, Searchbloom, JSONLD.com | **Confirmed as written** — the first hypothesis to survive. All five mark a field with an asterisk and defer the verdict to Google's Rich Results Test, i.e. after you have finished and left. Ours names the missing required property while you type and jumps you to the field |
| FAQ Schema Generator | Saijo George, Merkle, RankRanger, SEOptimer, Schema.dev | Emits the visible HTML **and** the JSON-LD together — Google requires the content be on-page, and no competitor ships both |
| UTM Link Builder | Google's own builder, UTM.io, Terminus, CampaignTrackly, Effin Amazing | Enforces lowercase/consistency to stop the fragmented-campaign problem; presets persist locally |
| Marketing ROI Calculator | ~~HubSpot, WebFX, Omni Calculator, Klipfolio~~ → **confirmed:** SE Ranking, AMA, Piwik PRO, AgencyAnalytics, ClickUp (also Swetrix) | ~~Shows ROI and break-even ROAS together~~ → **corrected:** Swetrix already computes break-even ROAS, so co-presentation is not unique. The defensible claim is making it the *headline* with a worded verdict and the working shown |
| Website Speed Test | ~~PageSpeed Insights~~ → **confirmed:** Pingdom, DebugBear, Uptrends, WebPageTest, GTmetrix. PSI did not rank — it is the engine we call, not a SERP rival | Confirmed: a verdict sentence before any numbers, every rating written as a word, nothing behind a login (GTmetrix withholds full CWV unless logged in; DebugBear gates locations). Note this is the one tool that is **not** client-side, and the UI says so |

### Business
| Tool | Research targets | Likely USP |
|---|---|---|
| Invoice Generator | ~~Invoice Ninja, Wave, FreshBooks~~ → **confirmed:** invoice-generator.com, Bloom, Zoho, Wise, Canva (accounting suites displaced) | ~~no watermark and no account~~ → **partly FALSE:** 4 of 5 now hand over an unwatermarked PDF with no account (only Canva gates). Real claim: the invoice is never *transmitted* — invoice-generator.com's own API docs describe POSTing it to their server; ours comes from the browser print engine, so it works offline |
| Business Name Generator | ~~NameMesh, Brandroot~~ → **confirmed:** Namelix, Shopify, Looka, Squarespace, businessnamegenerator.com | Confirmed as written: prints the measurements behind each name (letter count, pronounceability, syllable split) and refuses to claim a domain is available when it cannot look |
| Slogan Generator | ~~Zyro, Ahrefs, Namify~~ → **confirmed:** QuillBot, Shopify, Oberlo, Designhill, logo.com | Confirmed, and extended: none of the five offers tone selection, character counts, or a shortlist. So the claim is the honesty *plus* per-line counts against the Google Ads 30-char headline and 90-char description limits |
| Email Signature Generator | ~~Designhill~~ → **confirmed:** HubSpot, WiseStamp, MySignature, Newoldstamp, SignatureForEmail | ~~Never gates output behind a form (HubSpot does)~~ → **this was FALSE.** HubSpot's page states "no account required" and hands over HTML. Real claim: shows the email-safe HTML as a peer view of the preview, provably Outlook-safe (tests assert no `class=`/`flex`/`grid`). Gating is real at Newoldstamp / SignatureForEmail / MySignature, not HubSpot |

### Developer
| Tool | Research targets | Likely USP |
|---|---|---|
| JSON Formatter | *(researched — see §2)* | Payload never leaves the tab |
| QR Code Generator | QRCode Monkey, QR Tiger, Canva, Adobe, qr-code-generator.com | No tracking redirect — the code encodes your data directly, so it never expires and can't be revoked |
| Favicon Generator | ~~Favicon.cc~~ → **confirmed:** RealFaviconGenerator, favicon.io, RedKetchup, Favic-o-Matic, favicon-generator.org | ~~Generated client-side (RealFaviconGenerator uploads)~~ → **this was FALSE and is now stale by two years.** RFG's own blog: since 2024 "the favicon generation runs entirely in your browser". favicon.io says the same. Real claim: all three sources (image / initials / emoji) in one workspace that re-renders the whole set — both tab mocks, every swatch, the iOS tile, all five files — on every keystroke, where favicon.io splits them across three pages with three submits |

### Productivity
| Tool | Research targets | Likely USP |
|---|---|---|
| Word Counter | wordcounter.net, Grammarly, Hemingway, charactercounttool.com | Unicode-correct counting (emoji = 1) plus live platform limits, with no ads |

### Design
| Tool | Research targets | Likely USP |
|---|---|---|
| Colour Palette Generator | ~~Khroma, Paletton, Huemint~~ (none on page 1) → **confirmed:** Coolors, Adobe Color, Canva, Figma, ColorSpace — Canva and Figma now outrank Coolors | Confirmed, and sharpened: Coolors and Adobe both have excellent contrast checkers, but as *separate pages*. Ours states the safe text colour **on the swatch itself** and carries the rating into every export — every competitor's export is hex-only |

### GEO / AEO
| Tool | Research targets | Likely USP |
|---|---|---|
| AI Visibility Checker | HubSpot AEO Grader, Otterly.ai, Peec AI, Profound, Scrunch | Ungated, and reports **per-bot** robots.txt verdicts with the exact rule that produced them |

---

## 5. Performance budget (enforced per tool route)

Speed is a stated priority, so it gets numbers rather than adjectives.

| Metric | Budget |
|---|---|
| First-party JS per tool route | ≤ 90 KB gzipped |
| Interaction → visible result | ≤ 50 ms for pure-computation tools |
| Lighthouse LCP (mobile, throttled) | < 1.8 s |
| Total Blocking Time | < 150 ms |
| CLS | < 0.05 |

**Techniques:**
- Keep tool logic pure and synchronous where it already is — no dependency added
  to a client bundle without justifying it against this budget.
- `dynamic()` per tool is already in place; keep heavy panes (tree view, canvas)
  behind a second-level dynamic import so they cost nothing until used.
- Debounce only what needs it. Cheap computations run on keystroke; expensive
  ones (image re-encode, diffing) debounce at ~150 ms with a visible pending state.
- Move any >16 ms computation to a Web Worker rather than dropping frames.
- No layout shift when results appear: reserve the output pane's height up front.

---

## 6. Brand constraints for new UI

New components are expected. They must be assembled from what exists:

- **Type:** Fraunces (display/headings), Cabin (body/UI). Monospace is permitted
  **only** inside code surfaces (`CodePane`) — it is a functional requirement
  there, not a style choice.
- **Colour:** existing tokens only. Editor syntax colours must be drawn from the
  brand ramp (violet-700 keys, green strings, ink-muted punctuation) rather than
  importing a third-party theme like Dracula or Monokai.
- **Controls:** the neo-brutalist system — `btn-brutal`, `chip-tool`, `field`,
  1px black borders, `7px 7px 0 0 #000` hard shadow on primaries.
- **Verified contrast rules carry over unchanged:** never white on `cta` or
  `mint`; `violet-700` (not 500) on pastel tiles; `ink-subtle-onice` on ice
  surfaces; the two-tone focus ring; the CTA's black border is load-bearing.
- **Motion:** `prefers-reduced-motion` respected; no animation on the critical
  path to first result.

---

## 7. Execution order

Sequenced so the shared foundation lands before the tools that depend on it, and
so the highest-traffic tools are fixed first.

**Phase 0 — Foundation**
Build `ToolWorkspace`, `ToolToolbar`, `CodePane`, `StatusBar`, `DropZone`.
Convert **JSON Formatter** as the reference implementation and validate the
pattern end to end before touching anything else.

**Phase 1 — Developer + Productivity** (highest search volume, simplest logic)
QR Code Generator · Favicon Generator · Word Counter

**Phase 2 — SEO** (the conversion-relevant cluster)
Schema Markup · FAQ Schema · UTM Builder · Marketing ROI · Website Speed Test

**Phase 3 — Business**
Invoice Generator · Business Name · Slogan · Email Signature

**Phase 4 — Design + GEO**
Colour Palette Generator · AI Visibility Checker

**Phase 5 — Cross-cutting pass**
Mobile audit of all 15 · axe accessibility sweep · Lighthouse budget gate in CI ·
final visual consistency review.

Each tool ships as its own reviewable unit: research brief → logic (with tests) →
component → verification. A tool is not "done" until it passes §8.

---

## 8. Definition of done (per tool)

- [ ] Research brief committed: 5 competitors, common traits, standouts, USP, exclusions
- [ ] Every common trait either implemented or explicitly excluded with a reason
- [ ] Uses `ToolWorkspace`; usable without scrolling at 1366×768
- [ ] Seeded with realistic sample data on first paint
- [ ] No duplicate empty states
- [ ] Results update within the §5 latency budget
- [ ] Pure logic in `logic.ts`, ≥12 real assertions in `logic.test.ts`
- [ ] Keyboard-operable end to end; visible focus; results announced politely
- [ ] Verified contrast rules respected
- [ ] Mobile: panes stack, result first, touch targets ≥44px
- [ ] `tsc --noEmit`, `biome check`, `vitest run`, `next build` all clean
- [ ] Screenshotted and reviewed against the competitor set

---

## 8b. Follow-ups surfaced during execution (not done)

Recorded rather than silently dropped. Each came out of the work, not a wishlist.

**Test infrastructure — the biggest one.** Three agents independently wrote
`@testing-library/react` interaction harnesses, ran them, and deleted them, because:

- `vitest.config.ts` `test.include` covers `lib/**/*.test.tsx` but **not**
  `components/**/*.test.tsx`, so a component test has no correct home.
- `@testing-library/jest-dom` is not installed or wired via `setupFiles`, so
  `toBeDisabled` / `toBeInTheDocument` do not exist. (This is exactly what produced
  the two stray `tsc` errors seen mid-session.)

Roughly 90 genuinely useful interaction assertions were written and thrown away as a
result — covering focus handoff on reorder, hydration parity, keyboard shortcuts
being suppressed inside inputs, and lock-state survival across regeneration. Wiring
both would convert throwaway verification into permanent regression cover. **This is
the highest-value remaining task in the file.**

**Per-route bundle attribution.** §5 sets ≤90 KB gzipped of first-party JS per tool
route, and that figure is currently **unverified**: Next 16 + Turbopack no longer
prints per-route sizes, and `build-manifest.json` exposes only `/_app`, so per-route
first-party JS cannot be attributed from the build output. What *is* measured: the
shared baseline is ~136 KB gz, all client chunks total ~316 KB gz for the whole site,
and `package.json` is **unchanged** — zero dependencies added across fifteen
rebuilds. To actually verify §5, add a bundle analyser or parse the Turbopack
client-reference manifest.

**Deferred features that are real gaps, not rejected ideas.**

- JSON formatter: a collapsible **tree view**. Two of five competitors have it and it
  is the one thing that would make the tool distinctive, since it has no USP.
- QR generator: **logo-in-centre**, done safely — bounded against the chosen error
  correction level's recovery capacity, which is the part competitors skip.
- Favicon: passing an uploaded **SVG** through to `favicon.svg`, and RFG's live-URL
  favicon checker (needs a server fetch).
- Schema markup: Recipe / JobPosting / VideoObject types.

**Also outstanding from the original build plan:** Playwright e2e, an automated axe
sweep, a Lighthouse budget gate in CI, and Sentry. The CI workflow exists but has
never run on a real runner.

## 9. Risks

| Risk | Mitigation |
|---|---|
| A rich editor (line numbers, syntax colour) blows the JS budget | Build a minimal purpose-made `CodePane` rather than pulling in CodeMirror/Monaco; measure before and after |
| 15 rewrites regress working, tested logic | Logic layers already have 502 passing tests — redesign the **component** layer and keep `logic.ts` intact wherever the contract still fits |
| Scope creep from feature-matching competitors | The exclusions list in each brief is mandatory, not optional |
| Visual drift across 15 separately-built tools | The shared workspace is the control; Phase 5 exists to catch what slipped |
| "Research" degrades into assumption | Each brief records actual URLs; hypotheses in §4 are labelled as such and must be confirmed or corrected |

