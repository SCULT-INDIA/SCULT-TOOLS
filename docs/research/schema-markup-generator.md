# Schema Markup Generator — research brief

## Competitors

Confirmed against a live search for the primary keyword **"schema markup generator"**
(run 2026-07-30), then a second pass on **"free JSON-LD schema generator tool
structured data"** to catch tools that rank for the format rather than the label.
Listicles (InLinks' "11 tools" round-up) and the thin AI-tool clones
(`schemamarkupgenerators.com`, `airanklab`, `webtrek`) are excluded as content
farms rather than competitors.

1. **TechnicalSEO.com (Merkle)** — https://technicalseo.com/tools/schema-markup-generator/ — organic #1
2. **RankRanger** — https://www.rankranger.com/schema-markup-generator/ — organic #2
3. **Attrock** — https://attrock.com/schema-markup-generator/ — organic #3
4. **Searchbloom** — https://www.searchbloom.com/tools/schema-markup-generator-tool/ — organic #5
5. **JSONLD.com** — https://jsonld.com/json-ld-generator/ — #1 for the JSON-LD phrasing

**Corrections to the plan's hypothesis (§4).** The plan guessed Schema.dev,
Google's Structured Data Markup Helper and SEOptimer. None of the three ranked in
the top results for either query. Merkle and RankRanger were correct. Also
ranking, below the five above: `iplocation.io/schema-markup-generator` and
`instantschema.com`.

**Provenance.** Feature lists for RankRanger, Attrock, Searchbloom and JSONLD.com
were read off their own pages. TechnicalSEO.com's tool is a client-rendered SPA
and returns only chrome to a fetch, so its behaviour here is taken from InLinks'
review of it plus its own page title — thinner evidence than the other four, and
flagged rather than filled in with assumptions.

## Common traits (3+ of 5) — table stakes

| Trait | Count | Shipped |
|---|---|---|
| Pick a type, then a form specific to that type | 5/5 | Yes — 9 types, selector at the top of the left pane |
| Output rendered beside the form and updated as you type | 5/5 | Yes — `CodePane`, rebuilt on every keystroke (pure string building, no debounce) |
| One-click copy of the generated code | 5/5 | Yes — copies the `<script>` block or the bare JSON, whichever the toolbar is set to |
| A Test / Validate button linking out to Google's Rich Results Test | 5/5 | Yes — in the output pane header |
| Repeatable rows (`+Add` step / crumb / profile / hours) | 4/5 | Yes — with the row's output position, so a warning that says "Step 2" points at the row the JSON-LD will call step 2 |
| Required-vs-optional marking in the form | 3/5 | Yes — a Required badge per field, plus a filter that hides everything optional |
| Dropdowns for enumerated values (availability, day of week) | 3/5 | Yes — `select` fields from the spec table |
| 11–17 schema types | 5/5 | **No — 9.** See exclusions |
| Reset / refresh the form | 2/5 | Yes — Load example and Clear fields |

## Individual standouts

- **TechnicalSEO.com (Merkle)** — puts the relevant schema.org and Google
  documentation next to the form, so the field list cites its own source instead
  of asserting authority. **Taken:** every type links to the exact Google (or
  schema.org, where Google has no page) reference the Required flags come from.
- **RankRanger** — live character counters against Google's display limits
  (`headline` 110). Not taken; see exclusions.
- **Searchbloom** — auto-fills Organization and Person from Google's Knowledge
  Graph, and shows JSON-LD and Microdata side by side. Not taken; both break the
  client-side guarantee or double the surface for no eligibility gain.
- **JSONLD.com** — the widest coverage (17 types, 100+ LocalBusiness subtypes)
  and it preserves your form state between visits.
- **Attrock** — emits JSON-LD or RDFa from one form.

## Our USP

**Ours is the only one that names the missing Google-required property while you
are still typing — and takes you to the field.** Every competitor marks a field
with an asterisk and then hands you a button to Google's Rich Results Test; the
verdict arrives after you leave, in another tool, against markup you have already
finished. Here the count of satisfied requirements sits above the code at all
times, each shortfall is listed by exact field name ("Image URL is empty. Google
requires it for Article rich results"), and clicking one focuses that input.

Two supporting truths that follow from the same design:

- **Required means Google, not schema.org.** schema.org marks almost every
  property optional, so a generator that validates against it will happily call
  a Product with no offer valid. The `required` column in the spec table mirrors
  Google's rich-result documentation, and each type links to the page it came
  from.
- **Format, not just presence.** Absolute-URL, ISO-8601 date, date-time,
  duration and `{search_term_string}` checks; the lat/lng pair and the
  rating/review-count pair, which are invalid alone; and the breadcrumb rule that
  only the final crumb may omit its URL. These are the failures that make a
  filled-in form fail the Rich Results Test anyway.

The privacy claim is real but secondary here: nothing is uploaded, so unpublished
page content, prices and addresses stay in the tab.

## Deliberately excluded

- **Microdata and RDFa output** (Searchbloom, Attrock). Google recommends JSON-LD
  and reads it from one self-contained block; microdata has to be interleaved
  into HTML this tool cannot see, so the output would be a template the user
  still has to hand-merge. Two syntaxes to maintain, no extra eligibility.
- **Knowledge Graph auto-fill** (Searchbloom). Needs a server route holding an
  API key, and sends the entity you are marking up to a third party. That is the
  one thing the client-side design is protecting.
- **Recipe, JobPosting, VideoObject, and 100+ LocalBusiness subtypes.** Nine
  types against JSONLD.com's seventeen is the one table-stakes gap left open, and
  it is a considered one: each of those three carries requirements this form
  cannot honestly express yet (Recipe needs nutrition and cook/prep times as
  separate durations, JobPosting needs `validThrough` plus a salary structure with
  a unit, VideoObject needs `uploadDate` and a content or embed URL). Shipping
  them as thin forms would break the tool's only real claim — that if it says
  Google's requirements are met, they are. The tool's own limitations copy already
  states this exclusion by name.
- **FAQPage.** Deliberately a separate tool on this site
  (`/seo/faq-schema-generator`), because Google requires the Q&A text to be
  visible on the page, so that generator has to emit the on-page HTML alongside
  the JSON-LD. Folding it in here would produce markup with nothing to back it.
- **Character counters** (RankRanger). Google's 110-character headline figure is
  display truncation guidance, not a validity rule. Presenting it in the same
  panel as the requirement checks would blur a hard rule with a soft one, which
  is precisely the confusion this tool exists to remove.
- **Form-state persistence between visits** (JSONLD.com). Attractive, but it
  needs a versioned store for a nine-type value map, and the first paint is
  already a complete worked example rather than an empty form — so the value is
  restoring a half-finished session, not avoiding a cold start. Deferred, not
  dismissed.
- **Ads, signup walls, "related tools" rails.** None of the five gate output, and
  neither do we.

## Design decisions

**Left pane — type selector, then the form.** The selector is the first thing in
the pane rather than in the toolbar, because it changes what the entire form *is*;
the toolbar holds only things that change how the same content is presented. The
blurb and the reference link sit directly under it, so "why is this field
required?" is answerable in one click from the point of doubt.

**Right pane — verdict, code, then the fix list.** Three fixed bands: the
requirement count and what to do next; the JSON-LD in a line-numbered
`CodePane` with `language="json"`; and, only when there is something wrong, the
list of shortfalls. The code fills the leftover space, so on a laptop the thing
you came for is the biggest thing in the pane.

**Warnings are buttons, not text.** Naming the field is half the job; the other
half is getting there. Each row focuses and centres its input. Repeat rows are
numbered by their *output* position — matching `nonEmptyRows` in `logic.ts` — so
"Crumb 2" always means the crumb the JSON-LD will call position 2, even if there
is a blank row above it. A blank row is labelled as blank rather than numbered,
because it contributes nothing to the output.

**"Required only" never hides a problem.** The filter keeps required fields *and*
any field currently carrying a warning, so it can be left on while fixing things
and no jump target can be hidden behind it.

**Two Google notes no competitor shows.** HowTo rich results were retired in 2023
and the sitelinks search box in November 2024. Both types are still valid
schema.org and still worth emitting for machine understanding, so they stay — but
the tool says so on the type, instead of implying a rich result that no longer
exists.

**Contrast.** Verdict strips are `tile-green` / `tile-yellow` with `text-ink`;
accent text on those pastels is `violet-700`; every state pairs its colour with
an icon and wording, and invalid inputs get a black border plus an inline
message, so nothing depends on colour alone.
