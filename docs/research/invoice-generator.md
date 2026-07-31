# Invoice Generator — research brief

Search run: **"free invoice generator"** (July 2026), plus two refining searches
("free invoice generator online no signup pdf download", "invoice-generator.com
download PDF email required"). Feature claims below were verified by fetching
each competitor's own page; where a fetch was blocked that is stated explicitly
rather than filled in from memory.

> **Correction to the plan's hypothesis.** `docs/TOOL_REDESIGN_PLAN.md` §4 lists
> the research targets as *invoice-generator.com, Zoho, Invoice Ninja, Wave,
> FreshBooks*. Invoice Ninja, Wave and FreshBooks **did not appear** anywhere in
> the results for the head term — the accounting-suite players have been displaced
> by dedicated free-generator pages and by Bloom, Wise and Canva. The plan also
> hypothesised that "invoice-generator.com requires an email for PDF download"
> and that "Wave and Zoho require accounts". **That is no longer true and the USP
> below has been rewritten accordingly** — every one of the top five now hands you
> a PDF without an account. The real, still-standing differentiator is narrower
> and more interesting: *where the PDF is rendered*.

## Competitors

1. Invoice Generator (invoice-generator.com) — https://invoice-generator.com/
2. Bloom — https://bloom.io/invoice-generator
3. Zoho Invoice (free generator) — https://www.zoho.com/us/invoice/free-invoice-generator.html
4. Wise — https://wise.com/us/invoice-generator/
5. Canva — https://www.canva.com/invoice/

Also ranking, just outside the five: Invoice Simple
(https://www.invoicesimple.com/invoice-generator) and Ramp
(https://ramp.com/invoice-maker).

*Fetch failures, stated for the record:* invoicesimple.com and canva.com/invoice
both returned **HTTP 403** to our fetch. Canva's account requirement below is
sourced from third-party documentation of the editor ("You must have a Canva
account… to access and edit Canva templates"), not from Canva's own page.

## Common traits (3+ of 5) — table stakes

| Trait | Present in | Shipped? |
|---|---|---|
| Line items with an auto-computed amount column | 5 / 5 | Yes |
| Tax as a rate, applied to the invoice | 4 / 5 (all but Canva) | Yes — with a free-text label, so "GST 18%" / "VAT 20%" / "Sales tax" all read correctly |
| Discount, percent **or** flat | 3 / 5 (invoice-generator.com, Bloom, Zoho) | Yes — both kinds, applied before tax |
| Currency choice | 4 / 5 (150+ on invoice-generator.com and Bloom) | Yes — 8 currencies (see exclusions) |
| Logo upload | 4 / 5 (Bloom, Zoho, Wise, Canva) | Yes — via the shared `DropZone`, read locally |
| PDF download with no account | 4 / 5 (all but Canva) | Yes — and no watermark |
| Invoice numbering | 4 / 5 | Yes — suggested `INV-2026-001`, editable, plus a one-click "Next number" that follows *your* series |
| Issue date + due date | 4 / 5 | Yes — with Net 7 / 14 / 30 term presets |
| Live preview of the finished document | 4 / 5 | Yes — a full A4 sheet, and it is literally what prints |
| Notes / payment-terms field | 4 / 5 | Yes |
| Template or theme choice | 4 / 5 (80+ at Zoho, thousands at Canva) | **No** — see exclusions |

## Individual standouts

- **invoice-generator.com** — every adjustment (tax, discount, shipping) toggles
  between *percent* and *flat amount* inline, and it carries 150+ currencies. It
  is also the only one with a documented API, which is how we learned exactly how
  its PDF is produced.
- **Bloom** — payment-method blocks on the invoice itself (PayPal, Venmo, Zelle,
  Cash App, bank transfer) plus an optional tip line. The most complete
  *get-paid* story of the five.
- **Zoho Invoice** — 80+ templates and three genuinely different layout themes
  (Standard, Spreadsheet, Compact), so the document can match an existing
  house style.
- **Wise** — frames the whole tool around invoicing a client in another currency,
  which is the case its audience actually has.
- **Canva** — thousands of designed templates and a real design editor, so the
  invoice can be as considered as the rest of your brand.

## Our USP

**Ours is the only one where the invoice is never transmitted — the PDF is
produced by your own browser's print engine, so the amounts, your client's
details and your logo never leave the tab.**

This is verifiable rather than a slogan. invoice-generator.com's own developer
documentation describes the mechanism plainly: *"The API has a primary endpoint
that returns a PDF given details of an invoice"* — the invoice is **POSTed to
their server** and a rendered PDF comes back. Zoho, Bloom and Wise all render
server-side too; Canva requires an account before you can even open the editor.
So while all five will hand you a free, unwatermarked PDF, in every case your
client's name, your rates and your revenue have crossed a network first.

Two consequences that matter mid-task:

1. **It works with the network off.** Nothing here needs a round trip, so a
   flight, a bad hotel connection, or a client site with locked-down egress does
   not stop you invoicing.
2. **The draft is yours.** It autosaves to this browser and restores when you
   come back — where Zoho's equivalent ("Save Online") requires signing up for a
   Zoho account, and Bloom gates saved templates behind one.

The secondary claim — no account, no watermark, no invoice cap — is now table
stakes rather than a differentiator, and the brief says so instead of pretending
otherwise.

## Deliberately excluded

- **Template / theme picker (Zoho's 80, Canva's thousands).** One well-typeset A4
  document beats eighty mediocre ones, and a picker is a permanent maintenance
  surface with no correctness value: every theme multiplies the print-CSS
  surface that has to keep producing a clean single-sheet PDF. The effort went
  into making the *one* sheet good enough to send unedited.
- **Payment links / card and ACH acceptance (Bloom, Zoho).** Requires a server, a
  merchant account and a per-transaction cut — structurally incompatible with a
  tool that never talks to a server, and with the £0 running cost the registry
  records for this tool.
- **Emailing the invoice from the tool (invoice-generator.com, Invoice Simple).**
  Needs a mail server, which would mean uploading the invoice — the exact thing
  the USP rests on. Print → Save as PDF, then attach it from your own mail
  client, keeps the guarantee intact.
- **150+ currencies.** We ship 8 (INR, USD, EUR, GBP, AED, AUD, CAD, SGD) and the
  ceiling is a correctness one, not laziness: the money layer represents every
  amount in integer *minor units* fixed at 1/100 of a major unit. JPY and KRW
  have no minor unit and KWD has three decimal places, so listing them would
  inflate every total 100× or 10× through the same rounding step. A per-currency
  minor-unit exponent is the honest fix; until it exists, the list stays at
  currencies where 1/100 is correct. There is a test asserting exactly that.
- **A separate structured "pay to" block (bank, IFSC, UPI).** The notes field is
  seeded with it and labelled "Notes & payment details", which reaches the same
  place on the printed sheet without adding a field to the autosaved draft
  schema — and therefore without invalidating drafts saved by the previous
  version.
- **Shipping as a distinct line (invoice-generator.com only).** 1 of 5, and a
  line item already expresses it.

## Design decisions

**Layout — form left, document right.** This is the form-shaped case the
conventions describe. The left pane is the whole form and scrolls independently;
the right pane holds a live A4 sheet at full fidelity. Previously both lived in a
page-level two-column grid where the totals panel, the print button, three hint
paragraphs and the preview were stacked in the right column, so the *document* —
the actual product — started roughly 400px below the fold and the numbers you
were checking were in a different card from the sheet they print on.

**The preview is the product, so it got the design work.** The sheet now leads
with an amount-due block (the first thing a client's accounts team looks for),
carries a proper meta band (billed-to / dates / amount), repeats table headers
across page breaks, and is set in the display face for figures. It is
deliberately **monochrome**: colour on an invoice costs the recipient ink and
renders unpredictably on office printers, so structure comes from hairlines and
type weight. That is not off-brand — a document is a document.

**Toolbar carries what changes the whole document**: currency, payment terms, and
the print action. Per-field controls stay with their fields.

**Totals moved onto the sheet, and only onto the sheet.** The old layout printed
each figure twice — once in a "Totals" result card, once in the sheet — which
meant two places to disagree. The status bar now carries the running total and an
explicit *reconciled* signal instead, so the trust claim is stated once where it
is always visible.

**Two things carried over unchanged from the previous version, on purpose:**

1. **The print stylesheet.** `#invoice-sheet` is isolated twice over — a
   `visibility` pass for older engines, and a `:has()`-based `display: none` pass
   for evergreen ones that also collapses the sheet's ancestors so no blank
   pages trail the invoice. The redesign adds the sheet's new ancestors
   (`overflow`, `height`) to that collapse list, because the workspace's panes
   are independently scrolling boxes and a clipped ancestor would truncate the
   PDF.
2. **The row-id strategy.** Seeded rows use fixed ids (`line-a`…); only
   user-added rows come from a counter. A module-level counter for seeded rows
   caused a real hydration mismatch, because React's dev-mode double-invocation
   advanced it before the client's first paint and every label/input pairing
   broke. Anything time- or counter-derived in the server-rendered tree
   reintroduces that bug.
