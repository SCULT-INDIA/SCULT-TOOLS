# JSON Formatter — research brief

> **Provenance.** Confirmed against a live search for "json formatter validator
> online free" (July 2026). This brief exists because `JsonFormatter.tsx` referenced
> it while it did not — the tool was built from the worked example in
> `docs/TOOL_REDESIGN_PLAN.md` §2, which was itself written from memory. Checking it
> against a real SERP **invalidated the USP**, so the correction is recorded here
> and in the plan.

## Competitors (from the live SERP)

1. JSONLint — https://jsonlint.com/
2. jsonformatter.org — https://jsonformatter.org/
3. Toptal JSON Formatter — https://www.toptal.com/developers/json-formatter
4. Site24x7 JSON Formatter — https://www.site24x7.com/tools/json-formatter.html
5. elmah.io JSON Formatter — https://elmah.io/tools/json-formatter/

Also surfaced: [onlinejsonformatter.com](https://onlinejsonformatter.com/),
[validatejson.com](https://validatejson.com/),
[classic.online-json.com](https://classic.online-json.com/) and
[json.site](https://json.site/).

**Wrong in the plan's §2 example:** CodeBeautify, JSON Beautifier
(jsonbeautifier.org) and Static.app's beautifier — cited there as three of the six —
do **not** rank for this keyword. Only JSONLint and jsonformatter.org survived.

## Common traits (3+ of 5) — table stakes

- Two-pane layout, input and output comparable side by side
- Line numbers
- Validation errors reported with a **line number and a specific description**
- Syntax colouring distinguishing keys, values and types
- One-click copy, and usually download
- Minify as a first-class action, not a buried option

### Shipped

| Trait | Status |
|---|---|
| Two panes, full width | Yes — 559px each, equal height, independently scrolling |
| Line numbers | Yes — gutter count verified equal to rendered line count (15/15) |
| Error line + column + description | Yes — e.g. `Line 3, column 10 — Expected double-quoted property name`, with the offending line quoted back |
| Syntax colouring | Yes — 6 distinct brand-ramp colours, verified in the running page |
| Copy | Yes |
| Minify | Yes — a toolbar segment, not a checkbox |

### Deliberately excluded

- **Tree view.** jsonformatter.org and Site24x7 both have one and it is genuinely
  the best idea in the set for exploring deep structures. Excluded for now because
  a collapsible tree is a second rendering mode with its own keyboard model, and
  doing it badly is worse than not having it. This is the most defensible thing to
  build next — it is a real gap, not a rejected idea.
- **URL-fetch input.** Would need a server route and an SSRF surface for a tool
  whose whole point is that nothing leaves the tab.
- **JSON → CSV / XML / YAML conversion.** jsonformatter.org's differentiator. Each
  target format is its own correctness problem (CSV flattening of nested arrays has
  no single right answer), and getting it subtly wrong is worse than omitting it.
- **Ad-supported "related tools" rails.**

## Individual standouts

- **JSONLint** — the strictest, most precise error reporting; the benchmark for
  "where exactly is my error".
- **jsonformatter.org** — tree view plus conversions out to other formats.
- **Site24x7** — colour-highlighted object tree aimed at breaking down complex
  payloads.
- **Toptal** — the cleanest, least cluttered presentation of the five.
- **elmah.io** — states plainly that it works without any server request.

## Our USP

**There isn't a strong one, and this brief is not going to invent one.**

Plan §2 Step 4 allows exactly this: *"If no honest USP exists for a tool, say so in
the brief and compete purely on execution quality."* That is the situation here.

The claim originally assigned — *"the only one of the six that never transmits the
payload"* — is **false**. elmah.io advertises that it "works without making any
server requests", and json.site's page title is "JSON Formatter Online — Private,
Secure & Free". Client-side processing is now table stakes in this category, not a
differentiator. Repeating the claim would have been the kind of thing a developer
checks in ten seconds and never returns after.

What we compete on instead, all verified rather than asserted:

- **The workspace layout itself.** This tool is what motivated the whole redesign:
  input was ~40% width with the result in a separate panel far below it, and two
  empty panels both saying "Paste JSON to validate and format it."
- **Error precision with the line quoted back.** Line, column, description *and* the
  offending source line, tinted in the gutter and the body.
- **No ads, no rails, no signup.** Several competitors in this set are heavily
  monetised; the page shifting while you paste is a real cost.
- **Weight.** `CodePane` is a `<pre>` plus a gutter — a few hundred bytes against
  the plan's 90 KB budget, where CodeMirror or Monaco would spend most of it.

Honest summary: this is a well-executed instance of a solved category. The tree
view is the thing that would actually make it distinctive.

## Design decisions

- **Controls in one toolbar above both panes** — indent, minify, sort keys — rather
  than between input and output where the previous version had them.
- **Seeded with a realistic invoice payload**, so the first paint demonstrates
  formatting, colouring and the stats readout instead of showing empty panels.
- **One empty state, never two.** When the input is cleared, the output pane
  explains what will appear there rather than repeating the input's prompt.
- **`tokenizeJson` is a lexer, not a parser**, and lives in `lib/` with a
  lossless-round-trip test: `CodePane` renders tokens *in place of* the raw line, so
  a dropped character would silently corrupt what is displayed. That property is the
  most important test in the file.
- **Brand `green` excluded from the syntax ramp** — it is a background colour and
  lands near 2:1 as text on white.
