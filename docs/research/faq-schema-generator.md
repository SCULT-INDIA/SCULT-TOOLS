# FAQ Schema Generator — research brief

Searched 2026-07-30 with WebSearch for `faq schema generator` and
`free faq schema markup generator json-ld tool`. The competitor set below is the
intersection of the two result sets; each tool's feature list was then read
directly with WebFetch, except ToTheWeb (see the note under Competitors).

## Competitors

1. **SUSO Digital** — https://susodigital.com/tools/faq-schema-generator/
   (ranked first for the exact keyword in both searches)
2. **RankRanger Schema Markup Generator** — https://www.rankranger.com/schema-markup-generator/
3. **SEO Review Tools** — https://www.seoreviewtools.com/faq-schema-generator/
4. **Saijo George — FAQPage JSON-LD Schema Generator** — https://saijogeorge.com/json-ld-schema-generator/faq/
5. **ToTheWeb** — https://totheweb.com/learning_center/create-faq-schema-no-code-markup-tool/
   — *the page returned HTTP 403 to WebFetch, so its feature list comes from
   search-result snippets only and is thinner than the other four. Flagged rather
   than filled in with plausible guesses.*

Also present in the results and reviewed but not counted in the five:
SEOBotAI, iLoveSchema, Instant Schema, Texavor, UpliftSales, Meetanshi — dedicated
FAQ generators, but thin single-page tools around an ad or a product signup rather
than established SEO utilities.

### Two corrections to the hypotheses in `docs/TOOL_REDESIGN_PLAN.md` §4

- **SEOptimer does not ship an FAQ *schema* generator.** Its
  https://www.seoptimer.com/faq-generator is an AI *content* generator — you give
  it a topic, language and tone and it writes FAQ questions for you. Different
  product, different job. Not a competitor for this keyword.
- **Merkle / TechnicalSEO.com does not rank for `faq schema generator`.** Its
  https://technicalseo.com/tools/schema-markup-generator/ ranks for the broader
  `schema markup generator` term. WebFetch could not read its type dropdown, so
  whether FAQPage is still offered there is unconfirmed.
- Schema.dev did not appear in either result set.

## Common traits (3+ of 5) — table stakes

| Trait | In | Shipped here |
|---|---|---|
| Unlimited Q&A pairs via an "add question" button | 5 of 5 | Yes — no cap |
| Live JSON-LD that updates as you type | 4 of 5 (SUSO, SEO Review Tools, Saijo George, RankRanger) | Yes — pure computation on every keystroke, no debounce |
| One-click copy to clipboard | 5 of 5 | Yes |
| Remove an individual Q&A row | 4 of 5 | Yes — keyboard-operable button per row |
| A link out to a validator | 3 of 5 (SUSO → schema.org validator; SEO Review Tools and Saijo George → Google's Rich Results Test) | Yes — schema.org validator, see below |
| Reset / clear the whole form | 3 of 5 | Yes |

**None of the five ships any of these:** reordering rows, per-row or aggregate
validation warnings, a rendered preview of the FAQ, or the visible HTML block.

**The validator link is deliberately not Google's Rich Results Test.** Google
added a deprecation notice to its FAQ structured-data documentation on
2026-05-07, FAQ rich results stopped appearing in search that day, and Rich
Results Test support for FAQPage was removed in June 2026. Two of the three
competitors that link to a validator still point at a test that no longer
recognises this markup. The schema.org validator still validates FAQPage, so
that is where the link goes.

## Individual standouts

- **SUSO Digital** — the only one of the five whose validator link points at
  schema.org rather than a Google test that no longer covers FAQPage, plus
  step-by-step implementation guidance next to the tool.
- **RankRanger** — one form covering FAQPage, HowTo, Article, JobPosting,
  LocalBusiness, Product, Event and Person, so you learn one interface for eight
  schema types.
- **SEO Review Tools** — pre-populates the output box with the FAQPage skeleton
  before you type anything, so the shape of what you are building is visible from
  the first second.
- **Saijo George** — minified *and* prettified output as a first-class toggle,
  plus a "send to Tag Manager" path for people who inject schema via GTM.
- **ToTheWeb** — the surrounding guidance is the strongest of the five: it names
  the failure mode that actually bites (a WordPress FAQ plugin already emitting
  FAQPage JSON-LD, so the manual paste produces two conflicting blocks) and
  recommends a question count per article length.

## Our USP

**Ours is the only one that emits the visible FAQ HTML alongside the JSON-LD, so
the markup describes content that is actually on the page instead of describing
content you still have to go and build.**

All five competitors hand you a `<script type="application/ld+json">` block and
stop. That is half a deliverable: structured data is only valid when it describes
what the page shows, and this is the half of the job every one of them leaves to
you. The point survives the May 2026 rich-result deprecation intact — arguably it
gets sharper. With no rich result to win, the on-page text is now the *only* thing
any reader ever sees, human or AI answer engine, so schema pointing at content
that does not exist is pure cost.

Two smaller edges, both true and both absent from all five:

- **Warnings, not just output.** Duplicate questions (case- and
  whitespace-insensitive), half-filled rows silently dropped from the schema, and
  answers past the ~1,200-character point where FAQ answers get truncated are all
  named with the row number. The competitors emit whatever you typed.
- **Runs in the tab.** No network round-trip, works offline, and unreleased FAQ
  copy is never posted to someone else's server.

## Deliberately excluded

- **Other schema types (HowTo, Product, Article…).** RankRanger's breadth is
  genuinely useful, but this route is the FAQ tool; the site's separate schema
  markup generator is where breadth belongs. Bolting eight types onto this form
  would make the common case worse.
- **Minified output toggle** (Saijo George's best idea). The whole value of the
  JSON-LD pane is that you can read it and check it before pasting; a minifier is
  one keystroke in any editor, and the site already ships a JSON formatter that
  does it properly.
- **AI question generation** (SEOptimer's product, and an upsell on SEO Review
  Tools). Needs a server and a model, breaks the offline/private claim, and
  invents answers for a business it knows nothing about.
- **Download as a file.** None of the five offers it and nobody wants an
  `faq.json` on disk — this output goes to the clipboard and into a template.
- **A "send to Google Tag Manager" path.** Injecting FAQPage via GTM means the
  markup depends on JavaScript that a crawler may not run, which is the opposite
  of the advice this tool gives.

## Design decisions

- **Left pane = the repeatable rows, right pane = the output.** The rows are the
  only input, and they grow without bound, so they get the scrolling pane. The old
  layout put the output format toggle, the result, an advisory box, the warnings
  and the preview in one right-hand column that ran far past the fold.
- **Format toggle lives in the toolbar**, above both panes, because it changes the
  whole right-hand side. It was previously a fieldset sitting inside the output
  column, below the input it did not belong to.
- **The right pane splits into three fixed regions**: a one-line explanation of
  the selected output, the `CodePane` (which takes the remaining height and
  scrolls), and the accordion preview pinned to the bottom. The preview is the
  USP made visible, so it is never something you have to scroll to find.
- **The preview is real `<details>`/`<summary>`**, the same elements the HTML
  output emits, so what you see is what ships rather than a lookalike built from
  divs.
- **Warnings sit under the rows, in the left pane**, not next to the output. Every
  warning names a row number, and the fix is always in a row — putting the
  message next to the thing you edit beats putting it next to the thing you copy.
- **Reordering is two buttons per row, not drag-and-drop.** FAQ order is the order
  Google reads the entries in, so it matters; a drag handle would make that
  unreachable by keyboard. Move-up/move-down also lets focus follow the row it
  moved, and when a move lands a row at an edge and disables the button that was
  just pressed, focus is handed to the opposite button rather than dropped.
- **Row keys are stable ids, never the array index.** Rows are reorderable and
  deletable, so an index key would re-label two textareas in place instead of
  moving them — taking the cursor, the selection and any expanded preview state
  with it. Seeded rows carry fixed ids so the server and client agree on the
  first render; only rows the user adds draw from a counter.
- **`logic.ts` is untouched.** It already builds the schema, escapes every `<` as
  the six-character sequence `\u003c` so an answer containing a closing script tag
  cannot break out of the `<script>` element it gets pasted into, HTML-escapes the
  visible block, detects duplicates and raises every warning — with 19 tests over
  it. The redesign is the component layer only.
