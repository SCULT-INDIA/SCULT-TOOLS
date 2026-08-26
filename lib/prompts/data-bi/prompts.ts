import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'data-bi-dataset-first-look-summary-before-analysis',
    category: 'data-bi',
    title: `Get a trustworthy first read on a new dataset before you build anything on top of it`,
    description: `Turns a raw data dump into a structured first-look summary — shape, likely grain, suspicious columns, and the three questions you should answer before trusting any number from it.`,
    promptText: `You are a senior data analyst doing the first-look pass on a dataset someone just handed you, before any dashboard, report, or model gets built on top of it. Your job is not to describe the data politely — it's to tell me whether I can trust it yet.

DATASET DESCRIPTION
{{dataset_description}}

COLUMNS AND SAMPLE VALUES
{{columns_and_samples}}

INTENDED USE
{{intended_use}}

KNOWN CONTEXT
{{known_context}}

What I need from you:

1. State the likely grain of this dataset in one sentence (one row per what, exactly) — if the columns given don't make the grain obvious, say so explicitly instead of guessing confidently, and name the one or two columns that would confirm it.
2. List every column that looks structurally suspicious: a numeric column with an implausible range, a date column with an inconsistent format, an ID column that isn't actually unique, a categorical column with near-duplicate values that are probably the same thing typed differently ("NY" vs "New York" vs "ny"). For each one, name the specific risk it poses to the intended use, not just that it "needs cleaning."
3. Identify what's missing that the intended use would need but this dataset doesn't obviously provide — a join key, a time dimension, a denominator for a rate you'd want to compute.
4. Write three yes/no questions I should get answered by whoever owns this data before I build anything on it — each one a question where a wrong assumed answer would silently produce a wrong number downstream, not a generic "what does this data represent" question.

WHAT NOT TO DO
Do not write a generic column-by-column data dictionary restating what each column obviously is — only surface columns and facts that actually change whether the data can be trusted. Do not invent row counts, date ranges, or specific values you weren't given; if a sample is too small to judge something, say that explicitly rather than extrapolating confidently from three rows.

OUTPUT FORMAT
- Grain statement (one sentence, plus a confidence flag: confirmed / probable / unconfirmed)
- Suspicious columns table: column | issue | downstream risk
- Missing-for-intended-use list
- Three yes/no questions for the data owner
- One line: is this dataset safe to build on now, or only after the questions above are answered`,
    variables: [
      {
        name: 'dataset_description',
        description: `What the dataset is and where it came from.`,
        example: `A weekly export from our billing system covering every invoice issued in the last 18 months, roughly 40,000 rows, pulled by an ops analyst who has since left.`,
        required: true,
      },
      {
        name: 'columns_and_samples',
        description: `Column names with a few representative sample values for each.`,
        example: `invoice_id (INV-2044, INV-2045...), customer_name (Acme Corp, acme corp, ACME CORPORATION), amount_due (1200.00, -450.00, 99999.99), status (paid, Paid, PAID, void)`,
        required: true,
      },
      {
        name: 'intended_use',
        description: `What you actually plan to build or decide using this data.`,
        example: `Monthly revenue recognition dashboard for finance leadership, broken out by customer segment.`,
        required: true,
      },
      {
        name: 'known_context',
        description: `Anything you already know or suspect about quirks in the data.`,
        example: `I've heard the billing system double-logs some invoices when a payment retry happens, but no one has confirmed how often.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `data-quality`,
      `dataset-audit`,
      `data-analysis`,
      `bi-workflow`,
      `data-cleaning`,
    ],
    whyItWorks: `The prompt deliberately reframes the task away from "summarize this dataset," which pulls GPT-5.1 toward a neutral, descriptive column dictionary that restates the obvious and gives false confidence, and toward "judge whether this is trustworthy," which activates a more skeptical evaluation frame where the model is rewarded for flagging problems rather than describing structure politely. Forcing an explicit grain statement with a confidence flag matters because grain ambiguity is the single most common silent cause of wrong aggregate numbers in BI work — a model asked to summarize data will often just assume a grain and move on, while one asked to state it with a confidence flag has to notice and admit when the columns given don't actually establish it. Requiring the downstream risk for each suspicious column, rather than a generic "needs cleaning" flag, forces specificity that prevents the model from padding the list with cosmetic nitpicks (a lowercase status value) that don't actually threaten the intended use, while missing a genuinely dangerous one (a status value like "void" that should be excluded from revenue but might not be). The explicit ban on inventing row counts or extrapolating from a small sample addresses a real failure mode: language models asked to analyze data they were only given a few sample rows of will often speak confidently about patterns across the whole dataset, and naming this restriction upfront produces appropriately hedged answers instead of fabricated precision.`,
    exampleOutput: `Grain: one row per invoice issued (probable — confirm invoice_id is truly unique, since duplicates from payment retries were mentioned as a known risk). Suspicious columns: customer_name (case/spacing inconsistency, e.g. 'Acme Corp' vs 'ACME CORPORATION' — will fragment a customer-segment rollup unless normalized); amount_due (contains a negative value and a value near 99999.99 that looks like a placeholder, not a real charge — both would distort a revenue sum). Missing: no explicit invoice date column was shown — confirm one exists before building a monthly view. Questions: (1) Does a duplicate invoice_id always mean a payment retry, or can it also mean a genuine duplicate charge? (2) Should void-status rows be excluded from revenue recognition entirely? (3) Is amount_due always in the same currency across all rows?`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-messy-column-cleaning-plan-with-audit-trail',
    category: 'data-bi',
    title: `Turn a messy spreadsheet column into a defensible cleaning plan you can hand to someone else`,
    description: `Produces a step-by-step data cleaning plan for a specific messy column — with the exact transformation rule for each pattern of mess and a log of what changed, so the cleaning is reproducible instead of a one-off manual fix.`,
    promptText: `Act as a senior data analyst writing a cleaning plan for one messy column in a dataset — not performing the cleaning silently, but producing a plan specific enough that someone else (or a future me) could apply it consistently and audit what changed.

COLUMN NAME AND PURPOSE
{{column_name_purpose}}

MESS PATTERNS OBSERVED
{{mess_patterns}}

DOWNSTREAM USE
{{downstream_use}}

VALUES THAT SHOULD NOT BE TOUCHED
{{do_not_touch}}

Steps:

1. Group the mess patterns you were given into distinct categories (e.g. casing inconsistency, whitespace, near-duplicate free-text entries meaning the same thing, out-of-range values, placeholder values disguised as real data). For each category, write the exact transformation rule in plain language, precise enough to implement in a formula, script, or find-and-replace.
2. For any near-duplicate free-text values (misspellings, abbreviations, different formats of the same entity), propose a canonical value and list which observed variants should map to it — flag any case where you're genuinely unsure two variants mean the same thing rather than guessing.
3. Identify which rows should be excluded or flagged rather than cleaned — a value that isn't messy, it's actually invalid or contradicts the do-not-touch list.
4. Write the cleaning as an ordered sequence (order matters when one rule could interact with another — e.g. trimming whitespace before checking for exact duplicates).

WHAT NOT TO DO
Do not silently fix everything into one lump "data was cleaned" statement — every rule must be traceable to a specific observed pattern. Do not invent a canonical mapping for a value you were not given evidence for; say it needs a human decision instead of guessing.

OUTPUT FORMAT
1. Ordered cleaning steps (numbered, each with: pattern -> rule -> example before/after)
2. Canonical value mapping table for free-text entries, with an "uncertain" flag column
3. Rows to exclude or flag, with reason
4. A one-paragraph audit note summarizing what changed and what still needs a human decision`,
    variables: [
      {
        name: 'column_name_purpose',
        description: `The column and what it's supposed to represent.`,
        example: `region — should be the sales region an order shipped to, used to roll up revenue by territory.`,
        required: true,
      },
      {
        name: 'mess_patterns',
        description: `The specific messy values you've actually seen in this column.`,
        example: `APAC, Apac, Asia Pacific, EMEA, emea, N/A, (blank), West-Coast, west coast`,
        required: true,
      },
      {
        name: 'downstream_use',
        description: `What breaks if this column stays messy.`,
        example: `A pivot table grouping revenue by region currently shows 9 groups for what should be 4 real regions.`,
        required: true,
      },
      {
        name: 'do_not_touch',
        description: `Values that look messy but are actually intentional and must be preserved as-is.`,
        example: `"N/A" specifically means the order had no assigned region yet and should stay separate from real regions, not get merged into one.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `data-cleaning`,
      `data-quality`,
      `spreadsheet-workflow`,
      `data-analysis`,
      `reproducibility`,
    ],
    whyItWorks: `Asking for a cleaning plan rather than cleaned output matters because GPT-5.1 cannot see your actual full dataset — if you ask it to just clean the column, it will either fabricate cleaned rows that look plausible but aren't real, or hedge everything into vagueness; asking for an explicit, ordered rule set instead produces something you can mechanically apply to the real data yourself, in a spreadsheet formula, a script, or a find-and-replace pass, and something a colleague can audit later without re-deriving the logic. The ordering requirement (trim whitespace before checking duplicates) exists because cleaning rules genuinely do interact, and a model asked for an unordered list of fixes will frequently produce a set that's individually correct but wrong in combination when applied in the wrong sequence, e.g. checking for exact duplicates before normalizing case, which would miss matches. Requiring an "uncertain" flag on the canonical mapping table specifically counters a known model tendency to complete pattern-matching tasks with unwarranted confidence — without being told explicitly that guessing is worse than flagging uncertainty, the model will resolve every ambiguous abbreviation into a guessed canonical form rather than admitting two variants might refer to different real-world things. The do-not-touch input is the safeguard against the most damaging cleaning failure mode: a model, seeing an odd-looking value like "N/A," will often want to normalize it away entirely, silently destroying a meaningful distinction (missing vs. assigned) that the person building the dashboard actually needs preserved.`,
    exampleOutput: `Step 1 — Casing/whitespace: rule = trim leading/trailing whitespace, then title-case all region values. Example: 'west coast' -> 'West Coast'. Step 2 — Canonical mapping: APAC/Apac/Asia Pacific -> 'APAC' (confident); EMEA/emea -> 'EMEA' (confident); West-Coast/west coast -> 'West Coast' (confident). Rows to flag: blank and 'N/A' values should NOT be merged into any region per your do-not-touch instruction — flag as 'Unassigned' distinct from the four real regions. Audit note: 4 canonical regions established from 9 observed variants; blanks and N/A preserved as a separate Unassigned bucket per instruction; no uncertain mappings required a human decision in this pass.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-sql-query-from-plain-english-analytics-question',
    category: 'data-bi',
    title: `Get a SQL query for an analytics question you can actually explain and defend, not just paste and run`,
    description: `Converts a plain-English analytics question into a SQL query written for your actual schema, plus a plain-English explanation of every join and filter, so you're never running a query you couldn't defend if someone asked how the number was computed.`,
    promptText: `You are a senior data analyst writing SQL for an analytics question. Do not just produce a query — produce one I can defend when someone asks how the number was computed.

QUESTION
{{analytics_question}}

RELEVANT TABLES AND COLUMNS
{{schema_context}}

SQL DIALECT
{{sql_dialect}}

EDGE CASES TO HANDLE
{{edge_cases}}

Rules:
- Write the query using only the tables and columns given — if answering the question properly requires a table or column you weren't given, say exactly what's missing instead of inventing a plausible-sounding table name.
- Handle NULLs explicitly wherever they'd silently change the answer (a NULL in a join key dropping rows, a NULL in an aggregated column being ignored by SUM/AVG) rather than leaving default SQL NULL behavior to work in your favor by accident.
- If the question is ambiguous about a boundary condition (inclusive/exclusive date range, how to treat duplicate rows, whether cancelled/refunded records count), state the assumption you made explicitly rather than silently picking one interpretation.
- Use CTEs to make the logic legible in stages rather than one dense nested query, unless the dialect or performance context given makes that impractical.

OUTPUT FORMAT
1. The SQL query, fully formatted for the given dialect.
2. A plain-English walkthrough of what each CTE or major clause does and why, written so a non-SQL-fluent stakeholder could follow the logic.
3. Every assumption you made about an ambiguous boundary condition, listed explicitly.
4. One sentence on what could make this query slow at scale and the simplest fix, if the table sizes given suggest that's a real risk — otherwise say performance isn't a concern here.`,
    variables: [
      {
        name: 'analytics_question',
        description: `The actual business question you need answered.`,
        example: `What percentage of customers who made a first purchase in Q1 made a second purchase within 60 days?`,
        required: true,
      },
      {
        name: 'schema_context',
        description: `The relevant tables and columns, with types where they matter.`,
        example: `orders(order_id, customer_id, order_date, status, amount); customers(customer_id, signup_date, region)`,
        required: true,
      },
      {
        name: 'sql_dialect',
        description: `The SQL flavor you're running this in.`,
        example: `PostgreSQL 15, running in Redshift-compatible mode`,
        required: true,
      },
      {
        name: 'edge_cases',
        description: `Known messy realities in the data that could change the answer.`,
        example: `About 5% of orders have status = 'refunded' and roughly 200 customer_id values are duplicated across two legacy migration batches.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `sql`,
      `data-analysis`,
      `analytics-engineering`,
      `bi-workflow`,
      `query-writing`,
    ],
    whyItWorks: `Requiring a plain-English walkthrough alongside the query forces the model to actually justify each join and filter rather than produce syntactically valid SQL that silently encodes a wrong assumption — GPT-5.1, like most models, can write a query that runs and returns a number without ever surfacing that it treated a NULL join key in a way that dropped 8% of rows, and the walkthrough requirement makes that behavior visible instead of hidden inside working syntax. Explicitly requiring NULL handling and boundary-condition assumptions to be stated addresses the most common way an analytics query is technically correct but practically wrong: SQL's default NULL semantics (a NULL never equals anything, including another NULL, and is silently excluded from most aggregates) are a frequent, invisible source of undercounting, and a model not told to check for this will happily generate a query that runs cleanly while quietly excluding real rows. The instruction to say what's missing rather than invent a plausible table name matters because a model given a partial schema and no permission to say "I don't have enough" will fabricate a column name that fits the pattern of the ones it was given — which looks completely legitimate in a code block and fails only when someone actually runs it against the real database. The CTE-staging requirement is a readability choice with a real payoff: a dense single query is much harder for a reviewer to audit for the exact assumption that made the query wrong, while a staged CTE query makes each transformation checkable against the plain-English explanation next to it.`,
    exampleOutput: `WITH first_purchases AS (SELECT customer_id, MIN(order_date) AS first_order_date FROM orders WHERE status != 'refunded' GROUP BY customer_id), repeat_purchases AS (SELECT o.customer_id FROM orders o JOIN first_purchases fp ON o.customer_id = fp.customer_id WHERE o.order_date > fp.first_order_date AND o.order_date <= fp.first_order_date + INTERVAL '60 days' AND o.status != 'refunded') SELECT ROUND(100.0 * COUNT(DISTINCT rp.customer_id) / COUNT(DISTINCT fp.customer_id), 1) AS repeat_purchase_pct FROM first_purchases fp LEFT JOIN repeat_purchases rp ON fp.customer_id = rp.customer_id; Assumption stated: refunded orders were excluded from both the first-purchase and repeat-purchase counts, and the 60-day window was treated as inclusive of day 60.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-excel-formula-builder-with-failure-modes',
    category: 'data-bi',
    title: `Get an Excel formula that survives contact with your actual messy spreadsheet, not just the happy path`,
    description: `Builds an Excel formula for a specific calculation and explicitly stress-tests it against blanks, text-in-number-columns, and merged cells before handing it back, so it doesn't break the moment it hits real data.`,
    promptText: `Act as a senior data analyst who has been burned before by Excel formulas that work perfectly in a demo and break the moment someone opens the real workbook. Build me a formula for the task below, and stress-test it before handing it back.

WHAT THE FORMULA SHOULD CALCULATE
{{calculation_goal}}

COLUMN LAYOUT
{{column_layout}}

EXCEL VERSION
{{excel_version}}

KNOWN MESSINESS IN THE SHEET
{{known_messiness}}

Do the following in order:
1. Write the formula.
2. Stress-test it yourself, in writing, against these specific failure modes before presenting it as final: blank cells in any referenced range, text accidentally sitting in a numeric column, a #N/A or #REF! propagating from an upstream cell, and (if relevant to the version given) whether it needs to be an array formula or will spill automatically.
3. If the formula as first written would break under any of those conditions, revise it and show the fixed version, explaining what changed and why.
4. Note any behavior difference if this workbook might later be opened in an older Excel version or Google Sheets.

WHAT NOT TO DO
Do not hand back a formula that only works on clean, complete data without saying so — if a genuinely more robust version exists but is meaningfully more complex, give me both and let me choose, rather than silently picking simplicity over robustness or vice versa.

OUTPUT FORMAT
1. Final formula, ready to paste, with cell references matching the column layout given.
2. Plain-English explanation of what it does, one sentence per logical part.
3. Stress-test results: which failure modes it now handles and how, listed explicitly.
4. Compatibility note (older Excel / Google Sheets), only if relevant.`,
    variables: [
      {
        name: 'calculation_goal',
        description: `What the formula needs to calculate.`,
        example: `The average order value for each region, excluding any orders marked as refunded, ignoring blank rows.`,
        required: true,
      },
      {
        name: 'column_layout',
        description: `Which columns hold which data.`,
        example: `Column B = region, Column D = order status, Column F = order amount, data starts row 2, roughly 3,000 rows.`,
        required: true,
      },
      {
        name: 'excel_version',
        description: `The Excel version or platform you're actually using.`,
        example: `Microsoft 365 desktop, so dynamic array functions like FILTER and UNIQUE are available.`,
        required: true,
      },
      {
        name: 'known_messiness',
        description: `Anything already known to be inconsistent in the sheet.`,
        example: `Column D sometimes has 'Refunded' and sometimes 'refunded' typed manually, and roughly 40 rows have a blank order amount pending finance entry.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `excel`,
      `spreadsheet-formulas`,
      `data-analysis`,
      `bi-workflow`,
      `office-productivity`,
    ],
    whyItWorks: `The explicit stress-test step matters because a model asked to just "write a formula" optimizes for the shortest formula that satisfies the stated goal on the assumption of clean input, since that's the pattern most represented in generic examples it's drawing on — nothing about a bare request signals that the sheet is messy, so nothing pushes the model to defensively handle blanks or stray text. Naming the specific failure modes (blank cells, text-in-numeric-column, propagated errors, array/spill behavior) rather than saying "make it robust" matters because "robust" is exactly the kind of unfalsifiable instruction that gets nominally satisfied without changing the actual formula — a model can claim a formula is robust while it still divides by a blank cell and returns #DIV/0!. Requiring the version-specific check on spill behavior versus array formulas addresses a genuine compatibility trap: a formula written assuming Microsoft 365's dynamic arrays will look identical in syntax but behave completely differently (or error outright) in an older desktop version or when the workbook is opened in Google Sheets, and this is exactly the kind of environment detail a model won't proactively flag unless the version is both requested and used as a checkpoint. Offering both a simple and a more defensive version when they diverge meaningfully respects a real trade-off — sometimes a three-nested-function robust formula is genuinely worse for a spreadsheet three other people will edit by hand, and the choice of which to keep belongs to the person who knows their team, not to the model defaulting silently to whichever it finds more impressive.`,
    exampleOutput: `=IFERROR(AVERAGEIFS(F2:F3000,B2:B3000,"Region A",D2:D3000,"<>*refund*",F2:F3000,"<>"),"No data") — this excludes blanks in the amount column, matches 'Refunded' case-insensitively via a wildcard-style filter approach, and returns a clear 'No data' label instead of a #DIV/0! error if a region has zero qualifying rows. Stress test: blanks in F handled via the exclusion condition; mixed-case 'refunded'/'Refunded' handled since AVERAGEIFS criteria matching is case-insensitive by default; propagated #N/A from upstream would still break this — recommend wrapping upstream lookup cells in their own IFERROR first.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-google-sheets-formula-with-collaboration-safeguards',
    category: 'data-bi',
    title: `Write a Google Sheets formula that won't quietly break when three other people are editing the same sheet`,
    description: `Builds a Google Sheets formula for a specific calculation with explicit safeguards against the failure modes unique to a shared, live-edited sheet — inserted rows, someone typing over a reference cell, and stale cached values.`,
    promptText: `You're helping build a formula for a Google Sheet that isn't just used by me — it's a live, shared sheet that a few other people edit directly, which creates failure modes a single-user spreadsheet doesn't have.

CALCULATION NEEDED
{{calculation_needed}}

SHEET LAYOUT
{{sheet_layout}}

WHO ELSE EDITS THIS SHEET
{{other_editors}}

HOW IT'S USED DOWNSTREAM
{{downstream_use}}

Build the formula, then check it specifically against these shared-sheet risks:
- Would this formula silently break or shift incorrectly if someone inserts a row in the middle of the range it references?
- Does it rely on any cell reference that a non-technical collaborator might reasonably type over (a hardcoded threshold value sitting in a random cell versus a labeled input cell)?
- If this feeds a chart, pivot table, or another sheet via IMPORTRANGE, will a formula error in one cell (like #REF!) propagate and silently break those downstream views, or fail loudly enough that someone would notice?

If the answer to any of those is "yes, it would break silently," revise the formula or the sheet structure recommendation to close that gap — for example, using whole-column or named-range references instead of fixed cell ranges, or pulling a hardcoded value out into a clearly labeled, protected input cell.

WHAT NOT TO DO
Do not recommend a structural change (like protected ranges or a separate inputs tab) without explaining specifically which risk it closes — every recommendation should map to one of the three risks above, not be generic "best practice" advice.

OUTPUT FORMAT
1. The formula, ready to paste.
2. For each of the three shared-sheet risks: does it apply here, and if so, what was changed to address it.
3. Any sheet-structure recommendation (named ranges, a protected inputs tab, etc.), each tied explicitly to a named risk.
4. One line noting if any risk remains open and why it's acceptable to leave it, if you conclude that.`,
    variables: [
      {
        name: 'calculation_needed',
        description: `What the formula needs to calculate.`,
        example: `Flag any row where actual spend exceeds 110% of the budgeted amount for that line item.`,
        required: true,
      },
      {
        name: 'sheet_layout',
        description: `How the sheet is currently laid out.`,
        example: `Column C = budgeted amount, Column D = actual spend, both starting row 3; row 1-2 are merged header cells.`,
        required: true,
      },
      {
        name: 'other_editors',
        description: `Who else touches this sheet and how technical they are.`,
        example: `Two project managers who update actual spend weekly by typing directly into cells, neither is comfortable with formulas.`,
        required: true,
      },
      {
        name: 'downstream_use',
        description: `What else in the workbook depends on this calculation.`,
        example: `A conditional-formatting rule and a summary pivot on a second tab both reference this flag column.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `google-sheets`,
      `spreadsheet-formulas`,
      `collaboration`,
      `bi-workflow`,
      `data-analysis`,
    ],
    whyItWorks: `Framing the risks specifically around a shared, live-edited sheet — rather than asking generically for a good formula — targets a category of failure that only exists because other people are editing the file, which a model has no reason to consider unless the collaborative context is stated: a formula that's perfectly correct in isolation can still break the moment a non-technical collaborator inserts a row above the referenced range, since a fixed range reference doesn't always auto-adjust the same way a whole-column or named range does. Asking explicitly whether a hardcoded value sits in a cell a collaborator might type over addresses a very common, very quiet failure in shared sheets: someone updates what they think is just a number and doesn't realize it was actually a threshold the whole calculation depended on, and the sheet keeps producing numbers that look plausible but are now wrong. Requiring the propagation check on IMPORTRANGE and downstream pivots or charts matters because Google Sheets error propagation is not always obvious to the person actually looking at the summary tab — a #REF! error two tabs upstream can resolve into a chart that just quietly shows a shorter data range or a stale cached value instead of an obvious red error cell, which is far more dangerous than a loud failure because nobody investigates a chart that still looks fine. Tying every structural recommendation to a specific named risk, rather than allowing generic "best practice" advice, keeps the model from padding the answer with boilerplate like "consider using named ranges" without ever connecting that suggestion to an actual failure mode present in this specific sheet.`,
    exampleOutput: `=IF(D3:D="","",IF(D3:D>C3:C*1.1,"Over budget","OK")) using a whole-column ARRAYFORMULA reference rather than D3:D200, so a row inserted anywhere below row 3 is automatically included. Risk check: row-insertion risk closed by using whole-column references; the 1.1 threshold is currently hardcoded in the formula rather than a labeled cell — recommend moving it to a named cell 'Budget_Threshold' on an Inputs tab so a PM adjusting it doesn't need to edit the formula directly; IMPORTRANGE propagation risk is low here since nothing downstream currently pulls from this column via IMPORTRANGE.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-power-bi-dax-measure-with-context-transition-check',
    category: 'data-bi',
    title: `Write a Power BI DAX measure that gets filter context right, not just one that compiles`,
    description: `Builds a DAX measure for a specific requirement and explicitly checks it against row-context-versus-filter-context mistakes and slicer interactions, since a DAX measure that compiles cleanly can still return a silently wrong number.`,
    promptText: `Act as a senior BI developer writing a DAX measure for Power BI. DAX measures that compile without error can still be quietly wrong because of filter context and context transition mistakes — check for that specifically before presenting the measure as final.

MEASURE GOAL
{{measure_goal}}

DATA MODEL
{{data_model}}

HOW IT WILL BE USED
{{usage_context}}

RELATED EXISTING MEASURES
{{related_measures}}

Steps:
1. Write the DAX measure.
2. Explicitly walk through what filter context this measure will see in each place it's actually going to be used (a matrix visual sliced by date and by category, a card total, a slicer selection) and confirm the measure behaves correctly in each — not just in isolation.
3. If the measure involves an iterator function (SUMX, AVERAGEX) or CALCULATE with a context transition, state explicitly what row context is being converted to filter context and why that's the correct behavior for this specific goal, rather than assuming it's obviously fine.
4. Check whether this measure would silently produce a misleading total when totals/subtotals are shown in the same visual (a common DAX trap where a ratio or average measure sums correctly at the detail level but not at the total row) — if so, provide the corrected version that handles the total row separately.

WHAT NOT TO DO
Do not present a measure as final without walking through at least one concrete filter-context scenario from the usage context given — a measure that's only validated in the abstract is exactly the kind that breaks the first time someone adds it to a matrix with a total row.

OUTPUT FORMAT
1. DAX measure, final version.
2. Filter-context walkthrough for each real usage scenario given.
3. Total-row behavior check and fix if needed.
4. One-sentence plain-English summary of what this measure means, for a non-technical stakeholder reading the report.`,
    variables: [
      {
        name: 'measure_goal',
        description: `What the measure needs to calculate.`,
        example: `Average revenue per active customer, where 'active' means they had at least one transaction in the selected period.`,
        required: true,
      },
      {
        name: 'data_model',
        description: `The relevant tables and relationships in the model.`,
        example: `Fact_Sales (many-to-one to Dim_Customer on CustomerKey, many-to-one to Dim_Date on DateKey); Dim_Customer has a Status column.`,
        required: true,
      },
      {
        name: 'usage_context',
        description: `Exactly where and how this measure will appear in the report.`,
        example: `A matrix with customer segment on rows, month on columns, with a grand total row and column both turned on.`,
        required: true,
      },
      {
        name: 'related_measures',
        description: `Other existing measures this one depends on or should stay consistent with.`,
        example: `[Total Revenue] and [Active Customer Count] already exist as separate measures in the model.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`power-bi`, `dax`, `data-modeling`, `bi-workflow`, `data-analysis`],
    whyItWorks: `DAX's central difficulty — that a measure's result depends on the filter context it's evaluated inside, and that iterator functions and CALCULATE trigger context transition from row context to filter context — is precisely the kind of subtlety a model will state correctly if asked to explain DAX in the abstract, but will still get wrong in a generated measure if it isn't forced to actually trace through the specific usage scenario, because writing syntactically valid DAX and reasoning correctly about context transition are different skills that don't always co-occur in a single generation pass. Explicitly requiring the filter-context walkthrough against the real report layout (matrix with these specific rows, columns, and totals) rather than accepting the measure once it looks plausible catches the most common real-world DAX bug: a ratio-style measure (average revenue per active customer) that computes correctly for each individual cell in the matrix but produces a mathematically wrong number in the grand total row, because a total row's filter context is a UNION of everything below it, not a scaled version of one cell — a model not specifically checked against this will present the naive version as done, since it looks completely correct until someone notices the total row doesn't match a manual sanity check. Requiring related existing measures to be named forces internal consistency — a new measure reinventing a different definition of "active customer" than one that already exists elsewhere in the model is a very common source of two report pages disagreeing with each other, and stating the related measures upfront lets the model flag that divergence rather than silently duplicating logic with a subtly different filter condition.`,
    exampleOutput: `Avg Revenue per Active Customer := DIVIDE([Total Revenue], [Active Customer Count]) — reusing your existing measures rather than redefining 'active' independently. Filter-context walkthrough: in the matrix cells, both measures are correctly filtered by the row's segment and column's month via the model relationships; in the grand total row, DIVIDE still correctly recomputes total revenue over total active customers for that full context rather than summing the per-cell ratios, so the total row is mathematically valid, not just visually present.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-power-bi-report-insight-narrative-for-stakeholders',
    category: 'data-bi',
    title: `Turn a Power BI report full of numbers into three insights an executive will actually act on`,
    description: `Reads a description of your Power BI report's visuals and numbers and produces a short, ranked insight narrative — what actually matters, what's noise, and what decision each insight should trigger.`,
    promptText: `You are a senior data analyst preparing the narrative that goes on top of a Power BI report before it reaches an executive audience. The report itself has the numbers; your job is to say what matters and why, in a way that survives someone skimming it in 90 seconds.

REPORT CONTENTS
{{report_contents}}

AUDIENCE
{{audience}}

BUSINESS CONTEXT
{{business_context}}

WHAT DECISION THIS MIGHT INFORM
{{decision_context}}

Do the following:
1. From everything in the report contents, select only the moves that are both statistically meaningful (not just noise in a volatile metric) and business-relevant to the decision context — most numbers in a report are neither, and shouldn't make the cut.
2. Rank your selected insights by how much they should change what the audience does next, not by how dramatic the percentage change looks — a 3% move in the metric that actually drives the decision outranks a 40% move in a metric nobody's about to act on.
3. For each insight, state it as: what happened, the most likely explanation given the business context (flagged clearly as a hypothesis if you don't have enough context to be sure), and the specific action or question it should prompt.
4. Explicitly call out anything in the report that looks alarming at a glance but is probably not worth executive attention, and say why — this protects the audience from chasing noise.

WHAT NOT TO DO
Do not summarize every visual in the report — an insight narrative that mentions everything is equivalent to mentioning nothing. Do not state a causal explanation as fact when the business context doesn't actually support it; flag it as your best hypothesis and say what would confirm it.

OUTPUT FORMAT
1. Top 3 insights, ranked, each as: what happened / likely explanation (hypothesis-flagged if uncertain) / recommended action or question
2. "Looks alarming but probably isn't" section, one to two items, with the reason
3. One sentence: the single thing this audience should remember if they read nothing else`,
    variables: [
      {
        name: 'report_contents',
        description: `What visuals and numbers the report actually contains.`,
        example: `Monthly revenue trend (up 4% MoM), churn rate by segment (SMB churn spiked to 9% this month vs 5% average), NPS trend (flat), regional sales map (unchanged distribution).`,
        required: true,
      },
      {
        name: 'audience',
        description: `Who's actually going to read this and what they care about.`,
        example: `VP of Customer Success and the exec staff meeting, who care about retention and are not deep in the underlying data themselves.`,
        required: true,
      },
      {
        name: 'business_context',
        description: `Anything happening in the business that could explain the numbers.`,
        example: `We raised SMB pricing 15% at the start of this month; support ticket volume has not notably changed.`,
        required: true,
      },
      {
        name: 'decision_context',
        description: `What decision or discussion this report is actually feeding into.`,
        example: `Whether to roll back or phase in the SMB pricing change before it hits the enterprise segment next quarter.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `power-bi`,
      `data-storytelling`,
      `executive-reporting`,
      `bi-workflow`,
      `data-analysis`,
    ],
    whyItWorks: `Ranking insights by decision impact rather than by magnitude of change directly counters the most common failure mode of AI-generated report summaries: without this instruction, a model defaults to surfacing whatever number moved the most in percentage terms, because that's the most salient signal in the raw data, even when a small move in the metric that actually matters to the decision at hand is far more important — this is exactly the kind of judgment call that requires the decision context to be given explicitly, since the model has no way to know which metric the room actually cares about otherwise. Requiring hypotheses about causation to be explicitly flagged as hypotheses, with a note on what would confirm them, prevents the single most damaging thing an AI-written executive summary can do: stating a plausible-sounding causal story (the SMB churn spike was caused by the pricing change) as settled fact when the business context given doesn't actually establish that link, which can send a room into a decision based on a coincidence the model dressed up as an explanation. The "looks alarming but probably isn't" section exists because executive audiences skimming a dashboard tend to overreact to whatever visual looks most dramatic regardless of whether it's actually meaningful, and having the model proactively name and defuse a scary-looking-but-likely-noise metric does real work that a purely additive insight list can't do — it requires actively arguing against attention rather than just directing it. Capping this at three ranked insights plus one closing sentence is a deliberate constraint against the model's tendency to be comprehensive when asked to summarize a report, since a report that mentions every visual is functionally useless to an audience trying to act in 90 seconds.`,
    exampleOutput: `Insight 1: SMB churn spiked to 9% from a 5% average this month, most likely explanation is the 15% pricing increase that took effect the same month (hypothesis — confirm by checking whether churned accounts skew toward customers near the price-sensitivity threshold before the increase). Recommended action: pull a cohort of churned SMB accounts and check their prior spend tier before deciding on the enterprise rollout. Looks alarming but probably isn't: the regional sales map shows an unchanged distribution, which might look like stagnation but is actually consistent with normal seasonal flatness at this point in the quarter.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-dashboard-requirements-doc-before-building',
    category: 'data-bi',
    title: `Write the dashboard requirements doc that stops you from rebuilding it three times`,
    description: `Interviews the request behind a dashboard ask and produces a requirements doc — audience, decisions it needs to support, grain, and refresh cadence — pinned down before a single visual gets built.`,
    promptText: `A stakeholder has asked for a dashboard. Before anything gets built, help me turn that request into an actual requirements document — most dashboard rebuilds happen because this step got skipped, not because the tool was wrong.

ORIGINAL REQUEST (AS ASKED)
{{original_request}}

WHO ASKED AND WHO ELSE WILL USE IT
{{stakeholders}}

DATA AVAILABLE
{{data_available}}

CONSTRAINTS
{{constraints}}

Work through this:

1. Translate the original request into the actual decisions this dashboard needs to support — a request like "I want to see our sales numbers" is not a requirement, it's a topic; press for what decision gets made differently depending on what the dashboard shows, and if the request as given doesn't reveal that, list the clarifying questions you'd need answered first rather than guessing.
2. Define the grain of the dashboard's primary view (what one row/one data point represents) and the time granularity (daily, weekly, real-time) — justify the choice against the decisions identified in step 1, not against what's easiest to build.
3. List the minimum set of visuals needed to support those decisions, explicitly excluding anything that would be "nice to see" but doesn't change what anyone does — flag those separately as a phase-two candidate list instead of just leaving them out silently.
4. Define refresh cadence and acceptable data latency based on how the decisions actually get made (a weekly ops meeting doesn't need real-time data; a fraud-monitoring view might).
5. Name the one metric definition most likely to cause disagreement later (e.g. what counts as "active," how a cancelled order is treated) and propose a specific definition to lock in now, before multiple versions of that number start circulating.

OUTPUT FORMAT
- Decisions this dashboard must support (bullet list)
- Grain and time granularity, with justification
- Core visuals (minimum viable), one line each on what decision it supports
- Phase-two candidates (explicitly deferred, not just omitted)
- Refresh cadence and why
- The one metric definition to lock in now, with a proposed definition`,
    variables: [
      {
        name: 'original_request',
        description: `The dashboard request more or less as the stakeholder actually said it.`,
        example: `"Can we get a dashboard that shows how the sales team is doing?"`,
        required: true,
      },
      {
        name: 'stakeholders',
        description: `Who asked and who else would realistically look at this.`,
        example: `The VP of Sales asked; the dashboard will also be checked weekly by regional sales managers and pulled up in the Monday leadership meeting.`,
        required: true,
      },
      {
        name: 'data_available',
        description: `What data actually exists to build this from.`,
        example: `CRM export with deal stage, deal value, owner, close date; updated nightly, no real-time feed available.`,
        required: true,
      },
      {
        name: 'constraints',
        description: `Any deadline, tooling, or resourcing limits on this build.`,
        example: `Needs a first version ready in one week using existing Power BI licenses, no budget for a new data pipeline.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `dashboard-design`,
      `requirements-gathering`,
      `bi-workflow`,
      `stakeholder-management`,
      `data-analysis`,
    ],
    whyItWorks: `Forcing the translation from a vague request into named decisions is the single highest-leverage move in this prompt, because "I want to see our sales numbers" genuinely contains no information about what should be built — a model asked to just design a dashboard from that sentence will invent a plausible generic sales dashboard (funnel, pipeline value, win rate) that may have nothing to do with what the VP actually needs to decide, and will do so confidently rather than flagging the ambiguity, since nothing in the prompt otherwise tells it that guessing is worse than asking. Requiring the grain and refresh cadence to be justified against the named decisions, not against ease of build, prevents the common default where a model (or a builder under time pressure) picks whatever granularity the source data happens to already be in, producing a dashboard that's technically accurate but wrong-grained for the actual use — a weekly leadership review doesn't need a daily-grain view, and building one anyway just adds noise the audience has to mentally filter out every time. The explicit phase-two list, rather than silent omission of nice-to-have visuals, matters politically as much as technically: stakeholders who asked for something and don't see it anywhere in the output tend to assume it was forgotten rather than deliberately deferred, and a visible phase-two list turns a scope cut into a stated plan rather than a perceived gap. Naming the single metric definition most likely to cause future disagreement front-loads the fight that would otherwise happen three months later when the sales team's "win rate" and finance's "win rate" turn out to be computed differently — catching this before the build means one definition gets built in from the start instead of two dashboards quietly disagreeing with each other.`,
    exampleOutput: `Decisions this dashboard must support: whether a regional manager needs to intervene on a rep's pipeline this week; whether the VP should flag a regional shortfall before the Monday leadership meeting. Grain: one row per open deal, rolled up to weekly snapshots by rep and region — daily is unnecessary since the only recurring decision cadence identified is the weekly manager check-in and Monday meeting. Metric to lock in now: define 'active pipeline' as deals not in Closed-Won or Closed-Lost stage with a close date in the current or next quarter, since 'active' is the term most likely to get redefined differently by different regional managers later.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-kpi-selection-with-gaming-resistance-check',
    category: 'data-bi',
    title: `Pick KPIs that are hard to game and actually track the thing your team is supposed to improve`,
    description: `Selects and stress-tests a small KPI set for a specific team goal — checking each candidate for how easily it can be gamed or how it might drive the wrong behavior before it goes on a scorecard.`,
    promptText: `Help me choose the KPIs for a team scorecard. The real risk isn't picking a metric that's hard to calculate — it's picking one that's easy to game or that quietly incentivizes the wrong behavior once people start optimizing for it.

TEAM AND GOAL
{{team_and_goal}}

CANDIDATE METRICS UNDER CONSIDERATION
{{candidate_metrics}}

HOW THESE WILL BE USED
{{how_used}}

AVAILABLE DATA
{{available_data}}

For each candidate metric:
1. State in one sentence what behavior it would actually reward if someone optimized purely for this number and nothing else.
2. Identify the most plausible way someone could improve this metric without improving the underlying thing it's supposed to represent (a support team hitting a fast-response-time KPI by sending a low-quality canned reply immediately, for example) — be specific to this metric and this team, not generic.
3. Recommend keep, drop, or pair-with-a-counterbalancing-metric, and if pairing, name the specific counterbalancing metric that would catch the gaming behavior you identified.

Then:
4. Recommend a final set of 3-5 KPIs total (not one per candidate — some will be dropped or merged), each with its exact definition (including edge-case handling, like how a cancelled or refunded transaction is treated) so two people computing it independently would get the same number.
5. Flag which of the final KPIs are leading indicators (predict future outcomes) versus lagging indicators (report what already happened), since a scorecard made entirely of lagging indicators tells a team what to feel bad about but not what to do differently.

OUTPUT FORMAT
- Per-candidate table: metric | what it rewards if gamed | specific gaming risk | recommendation
- Final KPI set (3-5), each with a precise definition and edge-case handling
- Leading vs. lagging label for each final KPI
- One paragraph on what's deliberately NOT being measured and why that's an acceptable trade-off`,
    variables: [
      {
        name: 'team_and_goal',
        description: `The team this scorecard is for and what they're actually trying to achieve.`,
        example: `Customer support team, goal is to resolve issues in a way that keeps customers from churning, not just to close tickets.`,
        required: true,
      },
      {
        name: 'candidate_metrics',
        description: `The metrics currently being considered.`,
        example: `Average first response time, tickets closed per agent per day, customer satisfaction score (CSAT), ticket reopen rate.`,
        required: true,
      },
      {
        name: 'how_used',
        description: `How these numbers will actually be used once tracked.`,
        example: `Reviewed monthly by the support manager, and factored informally into individual agent performance conversations.`,
        required: true,
      },
      {
        name: 'available_data',
        description: `What data actually exists to compute these from.`,
        example: `Zendesk export with timestamps for first response, resolution, and reopen events, plus a post-resolution CSAT survey with roughly 30% response rate.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `kpi-design`,
      `performance-metrics`,
      `bi-workflow`,
      `goal-setting`,
      `data-analysis`,
    ],
    whyItWorks: `Asking specifically what behavior a metric rewards if optimized in isolation, rather than asking whether it's a "good metric," reframes the task around Goodhart's-law-style failure, which is the actual mechanism by which KPIs go wrong in practice — a model asked generically to evaluate metrics will list textbook pros and cons (easy to measure, industry standard) without ever simulating what a person under pressure to hit the number would actually do, while asking it to state the rewarded behavior explicitly forces that simulation, surfacing gaming vectors like an agent closing tickets fast without actually resolving the issue, since "tickets closed per day" rewards speed of closure, not quality of resolution. Requiring the recommendation to be specifically keep/drop/pair-with-a-counterbalance, rather than an open-ended discussion, matters because pointing out a gaming risk without prescribing a structural fix just produces an anxious list of caveats attached to a scorecard that still ships unchanged — pairing forces a concrete answer (if ticket-closure speed is kept, it must ship next to a reopen-rate or CSAT metric that would catch the gaming) rather than a vague warning that gets ignored under deadline pressure. The leading-versus-lagging classification exists because a scorecard built entirely from lagging indicators (CSAT, reopen rate, all of which report on tickets already closed) tells a manager what already went wrong without pointing at anything actionable this week, and naming this split forces at least a conversation about whether a leading indicator (like first-response time, if it isn't dropped for gaming reasons) belongs in the set. The closing paragraph on what's deliberately not measured matters because every KPI set is an implicit statement of what doesn't count, and making that explicit prevents the team from assuming an unlisted dimension (like ticket complexity) was overlooked rather than deliberately excluded.`,
    exampleOutput: `Average first response time: rewards fast acknowledgment; gaming risk is an agent firing an instant canned non-answer to stop the clock without addressing the issue — recommend pairing with reopen rate to catch that. Tickets closed per agent per day: rewards raw closure volume; gaming risk is closing complex tickets prematurely — recommend dropping in favor of a weighted resolution-quality metric instead. Final set: CSAT (lagging), reopen rate within 7 days (lagging), first response time paired with reopen rate as its counterbalance (leading + lagging pair). Deliberately not measured: ticket complexity or issue category mix, since normalizing for that would require a taxonomy that doesn't exist yet — acceptable trade-off for a first version.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-chart-type-recommendation-for-a-specific-claim',
    category: 'data-bi',
    title: `Pick the chart type that actually proves your point instead of just displaying your data`,
    description: `Recommends the right chart type for the specific claim a visualization needs to support, rejecting whichever default chart type would technically show the data but bury or misrepresent the actual point.`,
    promptText: `I need help picking a chart type — not for "this data" in the abstract, but for the specific claim I need this chart to make clear to someone glancing at it.

THE DATA
{{the_data}}

THE CLAIM THIS CHART NEEDS TO SUPPORT
{{the_claim}}

AUDIENCE AND VIEWING CONTEXT
{{audience_context}}

CHART TYPES ALREADY BEING CONSIDERED
{{considered_chart_types}}

Do this:
1. State what a viewer needs to be able to see at a glance for the claim to land — a comparison between a small number of categories, a trend over time, a part-to-whole relationship, a correlation between two variables, an outlier standing apart from a distribution. Different claims need genuinely different chart types, and naming this first prevents defaulting to whatever chart type is most familiar regardless of fit.
2. For each chart type already being considered, say plainly whether it would actually make the claim visible or would technically display the data while burying the point (e.g., a pie chart with nine slices of similar size showing a part-to-whole relationship no one can visually rank; a line chart connecting categorical, non-sequential data as if it were a trend).
3. Recommend the best chart type for this specific claim, even if it's not among the ones being considered, and justify it against the claim stated in step 1, not against general chart-type popularity.
4. Flag one specific way this chart type could still be built badly (wrong axis start point, too many categories crammed in, a misleading dual axis) that would undercut the claim even with the right chart type chosen, and how to avoid it.

WHAT NOT TO DO
Do not recommend a chart type based on how much data it can technically hold — recommend based on what the eye can extract from it in the few seconds a real viewer will actually spend looking.

OUTPUT FORMAT
1. What the viewer needs to see at a glance (one sentence)
2. Verdict on each considered chart type: makes the claim visible / buries it, and why
3. Recommended chart type, with justification tied to the claim
4. One specific execution risk for that chart type and how to avoid it`,
    variables: [
      {
        name: 'the_data',
        description: `What the underlying data actually is.`,
        example: `Monthly active users for 6 product features over the last 12 months.`,
        required: true,
      },
      {
        name: 'the_claim',
        description: `The specific point this chart needs to make clear, not just the topic.`,
        example: `Two of the six features have been steadily losing usage for 4 straight months while the other four are flat or growing.`,
        required: true,
      },
      {
        name: 'audience_context',
        description: `Who's looking at this and for how long/where.`,
        example: `Product leadership, glancing at a slide for maybe 10 seconds during a roadmap review, not exploring it interactively.`,
        required: true,
      },
      {
        name: 'considered_chart_types',
        description: `What chart types are currently on the table, if any.`,
        example: `A stacked bar chart and a pie chart showing feature share of total usage were the first two ideas.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `data-visualization`,
      `chart-design`,
      `bi-workflow`,
      `dashboard-design`,
      `data-storytelling`,
    ],
    whyItWorks: `Anchoring the recommendation to a specific stated claim rather than the data in the abstract matters because the same dataset genuinely supports different correct chart choices depending on what point is being made — six features' usage over time could be shown as a stacked bar, a small-multiples set of line charts, or a pie chart of current share, and only one of those actually makes "two features are declining while four are stable" visible at a glance; a model asked only "what chart should I use for this data" has no way to know which of those equally valid-looking options actually serves the point, so it defaults to whichever chart type is statistically most common for that data shape, not the one that proves the claim. Explicitly requiring a verdict on chart types already under consideration, rather than only proposing an alternative from scratch, forces confrontation with the actual failure mode at hand — a pie chart with six unevenly-changing slices over time doesn't even show change, it shows a single snapshot, and if this gap isn't named explicitly the recommendation reads as a preference rather than a correction of a real mismatch between the chart chosen and the point being made. Requiring one specific execution risk for the recommended chart type (rather than presenting the recommendation as risk-free) matters because chart-type selection is necessary but not sufficient — a line chart is the right structural choice for a declining-trend claim, but a truncated y-axis or an unlabeled inflection point can still make that correct chart type fail to land the claim in the ten seconds a real executive audience will spend on it, and naming the specific risk up front is what turns a correct chart type recommendation into one that will actually survive being put on a slide.`,
    exampleOutput: `What the viewer needs to see: two lines trending down against four that are flat or rising, over 12 months. Verdict: the pie chart doesn't show change over time at all, it's a single-moment snapshot, so it can't support this claim regardless of how it's built; the stacked bar chart could work but risks burying the two declining features' trend inside stacked segments that shift relative size for reasons unrelated to their own trend. Recommendation: a small-multiples line chart, one small panel per feature, all sharing the same y-axis scale, so the two declining lines are visually obvious without requiring the viewer to mentally subtract stacked segments. Execution risk: if each panel gets its own independent y-axis scale instead of a shared one, a small feature's modest decline could look visually identical to a large feature's steep one — fix by locking all six panels to the same y-axis range.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-trend-analysis-signal-versus-noise',
    category: 'data-bi',
    title: `Find out if a trend in your numbers is real or just noise before you tell anyone about it`,
    description: `Analyzes a described time-series trend for whether it's a genuine signal worth acting on or normal noise/seasonality dressed up as a story, before it gets repeated in a meeting as fact.`,
    promptText: `Act as a skeptical senior data analyst asked to sanity-check a trend before it gets repeated as a finding in a meeting. Your default assumption should be that most short-term movement in business metrics is noise, not signal — make me convince you otherwise with the data given, don't confirm the trend just because it was described to you as one.

THE TREND AS DESCRIBED
{{trend_description}}

UNDERLYING DATA POINTS
{{underlying_data}}

KNOWN SEASONAL OR CYCLICAL PATTERNS
{{known_patterns}}

WHAT WOULD CHANGE BASED ON THIS TREND BEING REAL
{{decision_stakes}}

Work through, in order:
1. Restate the trend as a specific, falsifiable claim ("metric X moved from A to B over period Y"), not the vaguer narrative version it was described as.
2. Check it against the known seasonal or cyclical patterns given — if this movement is plausibly explained by a pattern that recurs every year/quarter/week regardless of anything else changing, say so and state how confident you are in that alternative explanation.
3. Assess whether the number of data points and the size of the move are sufficient to distinguish a real shift from normal volatility in this specific metric — a two-data-point trend is not a trend, and a metric that's naturally volatile needs a bigger move to mean something than a naturally stable one.
4. If there's a plausible confound (something else that changed around the same time that could explain the movement instead of, or in addition to, whatever's being credited), name it explicitly.
5. Give a verdict: likely real signal, likely noise/seasonality, or genuinely insufficient data to say — and be willing to land on the third option rather than forcing a confident answer either way.

WHAT NOT TO DO
Do not treat the fact that a trend was described to you as evidence that it's real — evaluate it as skeptically as if you found the raw numbers yourself with no accompanying narrative.

OUTPUT FORMAT
1. Restated falsifiable claim
2. Seasonal/cyclical check and confidence in that alternative explanation
3. Signal-vs-noise assessment given data volume and this metric's normal volatility
4. Plausible confounds
5. Verdict, with the confidence level explicitly stated, and what additional data (if any) would resolve remaining uncertainty`,
    variables: [
      {
        name: 'trend_description',
        description: `The trend as someone described it to you, narrative included.`,
        example: `"Our website traffic has been climbing for the last three weeks, seems like the new blog strategy is working."`,
        required: true,
      },
      {
        name: 'underlying_data',
        description: `The actual numbers behind the described trend.`,
        example: `Weekly sessions: 12,400 / 12,900 / 13,600 over the last 3 weeks, versus a typical weekly range of 11,000-14,500 over the prior 6 months.`,
        required: true,
      },
      {
        name: 'known_patterns',
        description: `Any known seasonal, weekly, or cyclical pattern in this metric.`,
        example: `Traffic historically climbs every year from late summer into September as back-to-school search interest picks up.`,
        required: false,
      },
      {
        name: 'decision_stakes',
        description: `What would actually change if this trend is confirmed as real.`,
        example: `Marketing wants to double the content budget for next quarter if the blog strategy is confirmed as the driver.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `trend-analysis`,
      `statistical-reasoning`,
      `bi-workflow`,
      `data-analysis`,
      `data-storytelling`,
    ],
    whyItWorks: `Explicitly instructing the model to default to skepticism and require the data to convince it, rather than accepting the trend as described, directly counters a well-documented conversational tendency: a model handed a confident narrative ("seems like the new blog strategy is working") will, by default, tend to agree with and elaborate on the framing it was given rather than independently interrogate it, since agreeing with a plausible-sounding premise is the lower-friction continuation; stating the skeptical prior upfront overrides that default and forces the analysis to start from the null hypothesis that this is noise. Requiring the trend to be restated as a specific falsifiable claim before anything else matters because vague narrative framing ("traffic has been climbing") smuggles in a direction and a cause simultaneously, while a restated claim (sessions moved from A to B over three weeks) can actually be checked against normal volatility for that metric, separating the measurement from the story being told about it. The explicit instruction to check data volume and volatility against this specific metric, rather than trends in general, matters because three weeks of an inherently noisy metric like weekly web traffic is a very different evidentiary bar than three weeks of a naturally stable metric like headcount — a model not pushed to make this comparison metric-specific will apply a generic "three data points isn't much" caveat without actually engaging with whether three weeks is enough for this particular metric's normal swing range. Naming the decision stakes explicitly (a budget doubling riding on this) raises the bar the analysis is implicitly being held to, and permitting "insufficient data to say" as a legitimate final verdict — rather than forcing a binary real/fake conclusion — is what allows the model to actually land there instead of defaulting to whichever answer sounds more decisive.`,
    exampleOutput: `Restated claim: weekly sessions rose from 12,400 to 13,600 (about 9.7%) over three consecutive weeks. Seasonal check: this window overlaps with the known late-summer-into-September traffic climb, which is a strong alternative explanation independent of any blog strategy change — moderate-to-high confidence this pattern alone could account for most of the movement. Signal-vs-noise: 13,600 sits within the prior 6-month normal range (11,000-14,500), so this move has not yet exceeded typical volatility for this metric. Verdict: insufficient data to attribute this to the blog strategy specifically — recommend comparing this year's late-summer climb rate against last year's same-period climb rate before committing to a budget decision based on this trend.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-anomaly-triage-before-alerting-the-team',
    category: 'data-bi',
    title: `Triage a data anomaly before you page anyone about it`,
    description: `Works through a spotted anomaly in a metric or dataset to separate a real operational problem from a data-pipeline glitch or reporting artifact, before escalating it to a team that will drop what they're doing.`,
    promptText: `I've spotted something anomalous in a metric and need to triage it before deciding whether to escalate — escalating a false alarm burns trust with the team, but sitting on a real issue is worse. Work through this like an on-call analyst would.

THE ANOMALY
{{anomaly_description}}

WHAT'S NORMAL FOR THIS METRIC
{{normal_baseline}}

RECENT CHANGES THAT COULD BE RELATED
{{recent_changes}}

WHO WOULD GET PAGED IF THIS IS ESCALATED
{{escalation_target}}

Work through these in order, and stop early with a recommendation the moment one of them gives a clear answer rather than always running the full sequence:

1. Rule out a reporting/pipeline artifact first: does the anomaly's shape look like something a real business event would produce, or does it look like a classic pipeline symptom (a value dropping to exactly zero, a sudden duplicate spike, a metric that stops updating rather than moving)? A hard cliff to exactly zero is a very different signal from a gradual real decline.
2. Check whether the recent changes given plausibly explain it, and how directly — a deploy that touched this exact system an hour before the anomaly started is a much stronger candidate than an unrelated change from three days ago.
3. Assess severity if this turns out to be real: is this the kind of anomaly that gets worse the longer it's unaddressed (an active outage or data-loss issue) or one that's already fully realized and just needs investigation on a normal timeline (a one-time data entry error)?
4. Recommend one of: escalate now to the person/team named, investigate further yourself first and only escalate if a specific check comes back positive (name that check), or downgrade — log it as noise and move on.

WHAT NOT TO DO
Do not recommend escalation just because something looks unusual — plenty of anomalies are explainable, non-urgent, or artifacts, and treating every anomaly as page-worthy is how alert fatigue starts.

OUTPUT FORMAT
1. Pipeline-artifact check: result and reasoning
2. Recent-change correlation: result and how directly it explains the anomaly
3. Severity-if-real assessment
4. Recommendation: escalate now / investigate further first (name the specific check) / downgrade as noise
5. If escalating, the exact one-paragraph summary to send, written so the recipient understands the issue and its urgency without needing to ask a follow-up question first`,
    variables: [
      {
        name: 'anomaly_description',
        description: `What you actually observed.`,
        example: `Checkout completion rate dropped from a typical 68% to 41% starting at roughly 2:15pm today, still at that level as of now.`,
        required: true,
      },
      {
        name: 'normal_baseline',
        description: `What normal looks like for this metric.`,
        example: `Checkout completion rate typically ranges 65-72% on weekdays, with a known dip to around 58% during major promotional traffic spikes.`,
        required: true,
      },
      {
        name: 'recent_changes',
        description: `Anything that changed recently that could plausibly be related.`,
        example: `A payment provider integration was updated at 2:00pm today; no marketing campaigns launched today.`,
        required: true,
      },
      {
        name: 'escalation_target',
        description: `Who would actually get notified if this is escalated.`,
        example: `The on-call engineering lead, who would be pulled off other work immediately if paged.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `anomaly-detection`,
      `incident-triage`,
      `bi-workflow`,
      `data-analysis`,
      `operational-monitoring`,
    ],
    whyItWorks: `Ordering the checks with pipeline-artifact elimination first, and permitting an early stop rather than requiring the full sequence every time, mirrors how an experienced on-call analyst actually triages, and matters here because a model asked open-endedly to "analyze this anomaly" has no default preference for checking the boring, unglamorous explanation (broken pipeline) before the interesting one (a real business event), and will often jump straight to narrative explanations that make for a better-sounding answer even when a hard cliff to exactly zero is a textbook pipeline symptom that a real business event essentially never produces on its own. Requiring the recent-change correlation to be scored by directness (an hour-old deploy to this exact system versus a three-day-old unrelated change) rather than just listed as "could be related" prevents the common failure where a model surfaces every plausible-sounding recent change with equal weight, which is functionally useless to someone trying to decide what to actually investigate first — the payment-provider deploy fifteen minutes before the drop should visibly outrank a marketing change that didn't even happen. The explicit ban on escalating just because something "looks unusual" targets alert fatigue directly: an on-call system or analyst that escalates every anomaly regardless of severity trains the receiving team to deprioritize or ignore future alerts, so the model needs to be told explicitly that recommending escalation is a cost with its own downside, not a free default safe choice. Requiring the exact escalation message to be drafted, not just a recommendation to escalate, matters because the person being paged needs to understand severity and likely cause in the first sentence without a back-and-forth, and a vague "something's wrong with checkout, can you look" message wastes the exact response time the escalation was meant to protect.`,
    exampleOutput: `Pipeline-artifact check: the drop is a step change to a new sustained level (68% to 41%), not a cliff to zero and not a stopped-updating symptom, which looks more consistent with a real behavioral change than a pipeline break. Recent-change correlation: the payment provider integration update at 2:00pm is a very strong candidate — it started roughly 15 minutes before the anomaly and touches the exact system involved. Severity: this looks like an active, ongoing issue that gets worse the longer it runs, since every additional minute means more lost completions. Recommendation: escalate now to the on-call engineering lead. Escalation message: "Checkout completion rate dropped from ~68% to 41% starting ~2:15pm today and hasn't recovered — timing lines up closely with the 2:00pm payment provider integration update, which is the leading suspect. Recommend checking that integration first."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-cohort-retention-analysis-plan-and-read',
    category: 'data-bi',
    title: `Design a cohort retention analysis that answers the actual question instead of just producing a heatmap`,
    description: `Designs a cohort analysis structure matched to a specific retention question, then reads a described cohort result for the pattern that actually matters, rather than just describing the shape of the heatmap.`,
    promptText: `Help me with a cohort retention analysis in two parts: first designing it correctly for my actual question, then reading the results once I have them.

PART 1 - DESIGN
RETENTION QUESTION
{{retention_question}}

AVAILABLE DATA
{{available_data}}

What I need: the right cohort definition (grouped by signup week, by acquisition channel, by initial plan tier — whichever actually matches the question), the right retention event definition (what counts as "still retained" — a login, a specific action, a paid renewal), and the right time window granularity (day 1/7/30 vs week-by-week vs month-by-month), each justified against the retention question specifically rather than picked by default convention.

PART 2 - READ THE RESULT
COHORT DATA
{{cohort_data}}

Once you've confirmed the design, read this actual cohort data for:
1. Whether retention curves are converging to a stable long-run plateau or continuing to decay — this distinguishes healthy products with a stable core user base from ones quietly losing everyone eventually, and it's the single most important read of any retention curve.
2. Which specific cohort(s) deviate meaningfully from the others, and whether that lines up with anything that changed around when that cohort joined (an onboarding change, an acquisition channel shift, a pricing change).
3. Whether the earliest cohorts (most time to mature) are systematically different from recent ones in a way that suggests survivorship bias in how the data is being read, rather than an actual trend.

WHAT NOT TO DO
Do not just describe the shape of the retention curve ("retention declines over time, as expected") — every cohort analysis declines over time by definition; the useful read is where it plateaus, which cohorts deviate, and why.

OUTPUT FORMAT
1. Recommended cohort definition, retention event definition, and time granularity, each with a one-line justification
2. Plateau read: does this cohort set show a stable long-run floor, and at roughly what retention level
3. Deviating cohort(s) and the most plausible explanation, flagged as hypothesis if not confirmed
4. Survivorship-bias check on early-vs-recent cohort comparison
5. One paragraph: the single most important takeaway for whoever owns retention`,
    variables: [
      {
        name: 'retention_question',
        description: `The actual retention question you're trying to answer.`,
        example: `Did the new onboarding flow we launched 10 weeks ago improve 30-day retention compared to before?`,
        required: true,
      },
      {
        name: 'available_data',
        description: `What data you actually have to build the cohort analysis from.`,
        example: `Signup timestamp, weekly login events, and plan tier for every user since 6 months before the onboarding change.`,
        required: true,
      },
      {
        name: 'cohort_data',
        description: `The actual cohort retention data once you have it (can be a described table or pasted numbers).`,
        example: `Week 0 cohorts at 100% by definition; by week 4, pre-change cohorts average 22% retained, post-change cohorts average 31% retained; both curves still declining slightly through week 10.`,
        required: true,
      },
      {
        name: 'known_context',
        description: `Anything else that changed around the same time that could confound the read.`,
        example: `A pricing promotion ran for 3 weeks starting right after the onboarding change, targeting the same new-signup population.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `cohort-analysis`,
      `retention-analysis`,
      `bi-workflow`,
      `data-analysis`,
      `product-analytics`,
    ],
    whyItWorks: `Splitting this into a design phase before a read phase matters because cohort analysis has more failure modes in its setup than in its interpretation — the wrong cohort grouping (by signup week when the real driver is acquisition channel) or the wrong retention event (counting any login when the real question is about paid renewal) will produce a technically correct-looking heatmap that answers a different question than the one being asked, and a model asked only to "analyze this cohort data" has no way to catch a mis-specified design after the fact. Requiring the plateau read specifically, rather than accepting a generic "retention declines over time" observation, targets the actual information content in a retention curve: every cohort curve declines by construction, so noting the decline is content-free, while where it plateaus (or whether it plateaus at all) is the one number that distinguishes a healthy sticky product from one slowly bleeding its entire user base, and a model not explicitly told this will default to describing the curve's shape rather than extracting its single most decision-relevant feature. Explicitly requiring the deviating-cohort check to be tied to something that actually changed around that cohort's join date, flagged as hypothesis rather than fact, prevents the model from noting a deviation and stopping there — an unexplained deviation is much less useful than one connected to a plausible cause, even a tentative one, since it gives whoever owns retention somewhere concrete to look next. The survivorship-bias check exists because comparing an old cohort that's had a year to mature against a three-week-old cohort is a very common way to draw a false conclusion about improvement or decline — older cohorts always look more "resolved" than younger ones purely due to more elapsed time, and a model not instructed to check for this will sometimes read a maturity artifact as a real trend.`,
    exampleOutput: `Cohort definition: group by signup week, retention event defined as any login within the 30-day window (matches your stated question about the onboarding flow specifically). Plateau read: neither curve has clearly plateaued through week 10 yet, both are still declining slightly, so it's premature to call a stable floor for either group. Deviating cohorts: post-change cohorts sit consistently above pre-change ones (31% vs 22% at week 4), but the 3-week pricing promotion overlapping the same new-signup window is a plausible confound — recommend isolating cohorts that signed up after the promotion ended before crediting the full lift to onboarding alone.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-funnel-drop-off-diagnosis-not-just-a-funnel-chart',
    category: 'data-bi',
    title: `Diagnose why a funnel is leaking, not just draw the funnel chart`,
    description: `Takes a described conversion funnel and its drop-off numbers and produces a ranked, specific diagnosis of the most likely cause at the worst step, instead of stopping at describing where the drop-off happens.`,
    promptText: `I have funnel data and know where the biggest drop-off is. What I actually need is a diagnosis of why, ranked by plausibility, so the team investigating it knows where to look first instead of starting from zero.

FUNNEL STEPS AND CONVERSION RATES
{{funnel_data}}

WHAT EACH STEP ACTUALLY REQUIRES OF THE USER
{{step_context}}

SEGMENT BREAKDOWN IF AVAILABLE
{{segment_breakdown}}

ANYTHING RECENTLY CHANGED
{{recent_changes}}

Do this:
1. Identify the step with the worst relative drop-off (not necessarily the worst absolute numbers — a step that loses 80% of a small remaining group can matter less than one that loses 30% of a much larger group, depending on the stated business goal) and justify which one you picked as "worst" against that goal.
2. For that step specifically, generate 3-4 concrete, distinct hypotheses for why users are dropping off there, each grounded in what that step actually requires of the user (a form with too many required fields, a step requiring information the user doesn't have handy yet, a page load or technical friction point, a price or commitment reveal that wasn't expected earlier in the flow).
3. Rank the hypotheses by plausibility given the segment breakdown and recent changes provided — a hypothesis that would predict a specific pattern in the segment data (e.g., "if it's a mobile-specific technical issue, mobile users should convert far worse than desktop at this exact step") should be checked against whether that pattern actually appears.
4. For your top-ranked hypothesis, state the single fastest, cheapest way to confirm or rule it out before committing to a fix.

WHAT NOT TO DO
Do not stop at describing the funnel ("most users drop off between step 3 and step 4") — that much is already visible in the numbers given; the entire value of this exercise is in the ranked, checkable hypotheses about why.

OUTPUT FORMAT
1. Worst step identified, with justification against the stated business goal
2. 3-4 distinct hypotheses for that step, each specific and grounded in what the step requires
3. Ranked plausibility, with reasoning tied to segment/recent-change data where it supports or contradicts a hypothesis
4. Fastest/cheapest way to test the top hypothesis`,
    variables: [
      {
        name: 'funnel_data',
        description: `The funnel steps and conversion rate between each.`,
        example: `Landing page (100%) -> Signup form started (34%) -> Signup form completed (28%) -> Payment info entered (9%) -> Purchase completed (7%)`,
        required: true,
      },
      {
        name: 'step_context',
        description: `What each step actually asks the user to do.`,
        example: `Signup form asks for name, email, company size, and phone number; payment step reveals the full annual price for the first time.`,
        required: true,
      },
      {
        name: 'segment_breakdown',
        description: `Any breakdown of the drop-off by device, channel, or user type.`,
        example: `Mobile users drop from form-completed to payment-info at 12%, desktop users at 41% — a much bigger mobile-specific gap.`,
        required: false,
      },
      {
        name: 'recent_changes',
        description: `Anything that changed recently near this part of the funnel.`,
        example: `The phone number field was made a required field on the signup form three weeks ago; nothing changed on the payment step.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `funnel-analysis`,
      `conversion-optimization`,
      `bi-workflow`,
      `data-analysis`,
      `product-analytics`,
    ],
    whyItWorks: `Requiring the "worst step" to be identified relative to a stated business goal rather than by raw percentage drop directly addresses a common analytical mistake: the step with the largest percentage drop is not automatically the one most worth fixing, since a huge percentage loss at a step with very few remaining users can matter less in absolute terms than a smaller percentage loss earlier in the funnel where volume is much higher, and a model not pushed to justify against the actual goal will default to reporting whichever single number looks most dramatic rather than the one that would move the outcome that matters most. Grounding each hypothesis in what the specific step actually requires of the user, rather than accepting generic funnel-drop explanations ("users lose interest," "friction"), forces the kind of specificity that's actually actionable — a hypothesis has to name a concrete mechanism (a newly-required phone number field, an unexpected price reveal) that someone could go check, rather than restating that a drop-off happened in vaguer language. Requiring each hypothesis to predict a specific, checkable pattern in the segment data, and then checking whether that pattern actually shows up, converts unfalsifiable speculation into something closer to an actual test — a technical mobile-friction hypothesis should predict mobile underperforming desktop at that exact step, and when the segment data instead shows mobile converting better, that hypothesis should be demoted rather than left standing alongside every other guess with equal weight. The instruction against stopping at description exists because summarizing a funnel chart in words is a task with almost no added value when the person asking already has the chart in front of them — the entire reason to bring in a model here is to generate and rank testable causal hypotheses, not to restate visible numbers as a sentence.`,
    exampleOutput: `Worst step (by goal-weighted impact): form-completed to payment-info-entered, since it loses the largest absolute number of users despite not having the single worst percentage drop. Hypotheses: (1) the newly-required phone number field added friction — predicts this drop should have worsened specifically after the 3-weeks-ago change, worth checking against a before/after comparison; (2) the price reveal at this step surprises users who didn't expect the annual commitment — predicts users who saw pricing earlier (e.g., via a pricing-page referral) should convert better here than those who didn't; (3) mobile-specific technical friction — this is contradicted by the segment data showing mobile actually converting better (12% drop) than desktop (41% drop) at this step, so demote this hypothesis. Fastest test: compare this step's conversion rate for the 3 weeks before versus after the phone number field became required, since that data likely already exists and requires no new instrumentation.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-customer-segmentation-actionable-not-just-descriptive',
    category: 'data-bi',
    title: `Build a customer segmentation that tells your team what to actually do differently for each group`,
    description: `Designs a customer segmentation scheme tied to a specific business action, rejecting descriptive-only segments that are interesting to look at but don't change what anyone does for any given group.`,
    promptText: `Help me design a customer segmentation. The test I want you to hold every segment to: if this segment didn't exist, would the team behind it actually treat that group of customers any differently? A segmentation that's interesting to look at but doesn't change a single action isn't done yet.

BUSINESS GOAL FOR SEGMENTING
{{business_goal}}

DATA AVAILABLE FOR SEGMENTATION
{{available_data}}

WHO WILL ACT ON THESE SEGMENTS
{{who_acts_on_it}}

EXISTING SEGMENTATION IF ANY
{{existing_segmentation}}

Do this:
1. Propose 3-5 candidate segments based on the available data and business goal, each defined precisely enough (specific thresholds, not vague labels like "high value") that a person could look at any customer record and assign them to exactly one segment without ambiguity.
2. For each candidate segment, state the specific different action the team named would take for that group versus another group — if you can't identify a concrete different action, cut the segment or merge it into a neighboring one rather than keeping it for descriptive completeness.
3. Check for segments that sound different but would actually contain almost entirely the same customers in practice given the data available (e.g., "high spend" and "long tenure" segments that are 90% overlapping in this business) — flag any such overlap and recommend collapsing them.
4. If an existing segmentation is already in use, explicitly compare your proposal against it and say whether it's worth the disruption of changing, or whether the existing one is fine and doesn't need replacing.

WHAT NOT TO DO
Do not propose a segmentation scheme purely because it's a common industry framework (RFM, personas, life-stage) unless it passes the different-action test above for this specific business — a well-known framework that doesn't change anyone's behavior here is still not worth shipping.

OUTPUT FORMAT
1. Segment definitions (precise, threshold-based), 3-5 total after merging
2. Action mapped to each segment, stated as what the named team does differently
3. Overlap check results and any recommended merges
4. Verdict on replacing the existing segmentation, if one exists, with a one-line reason`,
    variables: [
      {
        name: 'business_goal',
        description: `What you're actually trying to accomplish by segmenting customers.`,
        example: `Reduce churn among mid-market accounts by targeting retention efforts where they'll have the most impact.`,
        required: true,
      },
      {
        name: 'available_data',
        description: `What customer-level data actually exists to segment on.`,
        example: `Monthly spend, tenure in months, product usage frequency (logins/week), support ticket count, plan tier.`,
        required: true,
      },
      {
        name: 'who_acts_on_it',
        description: `Who will actually use these segments and what levers they have.`,
        example: `The customer success team, who can assign a dedicated CSM, offer a training session, or flag an account for an executive check-in.`,
        required: true,
      },
      {
        name: 'existing_segmentation',
        description: `Any segmentation scheme already in use, if replacing one.`,
        example: `Currently just split by plan tier (Basic/Pro/Enterprise), which the CS team says doesn't actually predict who's about to churn.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `customer-segmentation`,
      `retention-strategy`,
      `bi-workflow`,
      `data-analysis`,
      `customer-success`,
    ],
    whyItWorks: `Holding every candidate segment to an explicit different-action test is the load-bearing instruction here, because segmentation is one of the analytics tasks most prone to producing output that looks sophisticated and complete while being entirely inert — a model asked simply to "segment these customers" will happily produce a clean, well-labeled scheme (power users, casual users, at-risk users) that reads as thorough analysis but that no one downstream actually changes their behavior based on, since nothing in a generic request forces the connection back to a concrete action; requiring that connection explicitly, and requiring segments that fail the test to be cut rather than kept for descriptive completeness, is what turns a taxonomy exercise into an operational tool. Requiring precise, threshold-based segment definitions rather than descriptive labels addresses a related failure: "high-value customer" sounds like a segment but isn't actually usable until someone defines the exact spend or usage threshold that puts a customer in it, and without being pushed for precision a model will happily generate segment names that sound rigorous while leaving the actual boundary fuzzy, which means two different people applying the scheme would sort customers differently. The overlap check specifically targets a subtle but common segmentation failure: a business's data often has enough natural correlation between different-sounding dimensions (long-tenure customers often are high-spend customers) that two segments proposed independently turn out to describe almost the same population, adding apparent granularity without adding real distinctions, and this only gets caught by explicitly checking correlation against the actual available data rather than assuming distinct-sounding labels imply distinct populations. Requiring an honest comparison against an existing segmentation, including the option to conclude the existing one is fine, keeps the model from defaulting to always recommending a change just because it was asked to design something — genuine analytical honesty here includes the possibility that no change is warranted.`,
    exampleOutput: `Segment: 'At-risk mid-market' = plan tier Pro or Enterprise, login frequency down more than 40% versus their own 90-day average, tenure over 6 months. Action: CS assigns a dedicated CSM outreach within 5 business days, versus no proactive outreach for stable accounts. Overlap check: a proposed 'low engagement' segment based purely on login frequency alone overlapped roughly 85% with this at-risk segment once tenure and tier were factored in — recommend merging rather than keeping both. Verdict on existing plan-tier-only segmentation: worth replacing, since plan tier alone doesn't capture the usage-decline signal the CS team says actually predicts churn.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-revenue-analysis-variance-driver-breakdown',
    category: 'data-bi',
    title: `Turn a revenue variance into a driver-by-driver breakdown instead of one vague explanation`,
    description: `Takes a period-over-period revenue number and your raw line items and produces a ranked breakdown of what actually moved — price, volume, mix, or new/lost accounts — so you're not stuck writing "revenue was up due to strong performance."`,
    promptText: `You are a senior data analyst decomposing a revenue change into its actual drivers, not writing a summary sentence about it.

PERIOD BEING COMPARED
{{comparison_period}}

REVENUE MOVEMENT
{{revenue_movement}}

RAW LINE ITEMS AVAILABLE
{{available_data}}

KNOWN ONE-OFF EVENTS
{{known_events}}

AUDIENCE FOR THE ANALYSIS
{{audience}}

DECOMPOSITION RULES
Split the total revenue movement into the standard components that actually explain it: price change, volume/unit change, mix shift (which products or segments grew as a share of the total), and customer-count effects (new accounts, expansions, churned/downgraded accounts) — and be explicit when the data given can't distinguish between two of these, rather than picking one arbitrarily and presenting it as certain. Rank the drivers by dollar contribution, largest first, and show what percentage of the total movement each one explains — if the components don't sum cleanly to 100% of the movement, say so and name the residual rather than silently forcing the numbers to reconcile. Treat any known one-off event as a separate line, not folded into "volume" or "mix," so the underlying run-rate trend isn't distorted by something that won't repeat next period. If the raw data given is insufficient to separate price from volume or to isolate a specific segment, state plainly what additional field or cut would be needed rather than guessing at a split you can't actually support.

WHAT NOT TO DO
Do not produce a narrative paragraph before the breakdown exists — the ranked driver table comes first, prose commentary comes after. Do not describe a driver as "strong performance" or "market conditions" without a number attached; every driver line must carry a dollar or percentage figure or be flagged as unquantifiable with the current data.

OUTPUT FORMAT
1. One-line headline: total movement and direction.
2. Ranked table: driver | dollar contribution | % of total movement | confidence (data-supported vs. estimated).
3. Any residual/unreconciled amount, named explicitly.
4. Two to three sentences of plain-language interpretation for {{audience}}.
5. What additional data, if any, would sharpen the split.`,
    variables: [
      {
        name: 'comparison_period',
        description: `The two periods being compared.`,
        example: `Q2 2026 vs. Q1 2026, North America segment only`,
        required: true,
      },
      {
        name: 'revenue_movement',
        description: `The headline number that needs explaining.`,
        example: `Revenue rose from $4.1M to $4.6M, a $500K increase`,
        required: true,
      },
      {
        name: 'available_data',
        description: `What raw fields or exports you actually have to work from.`,
        example: `Order-level export with unit price, quantity, product SKU, and customer ID per transaction for both quarters`,
        required: true,
      },
      {
        name: 'known_events',
        description: `Any one-off event that shouldn't be read as a trend.`,
        example: `A single $180K enterprise deal closed in the last week of Q2 that won't recur quarterly`,
        required: false,
      },
      {
        name: 'audience',
        description: `Who will read the resulting explanation.`,
        example: `The VP of Finance, ahead of a board deck`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `revenue-analysis`,
      `financial-reporting`,
      `data-analysis`,
      `variance-analysis`,
      `business-intelligence`,
    ],
    whyItWorks: `GPT-5.1's default behavior on a vague ask like "explain this revenue change" is to produce a fluent narrative first, because narrative is the path of least resistance for a language model and there's no structural gate forcing it to quantify before it writes prose — this prompt closes that gap by mandating the ranked driver table as output step one and prose only as step four, so the model has to do the decomposition arithmetic before it's allowed to write the sentence that sounds convincing. The instruction to name a residual rather than force a reconciliation matters because language models have a strong tendency toward false precision: asked to make components sum to a total, the default move is to quietly adjust one number until it fits, which manufactures a number that wasn't actually in the data. Requiring an explicit confidence tag per driver (data-supported vs. estimated) directly targets the most common failure mode in AI-generated revenue analysis — presenting an inferred split (e.g., assuming price vs. volume based on typical patterns) with the same confident tone as a split that's actually derivable from the line items provided, which misleads a reader who can't tell the difference from the prose alone. Separating one-off events into their own line rather than absorbing them into "volume" prevents the classic mistake of a single large deal inflating an apparent trend, which matters specifically because the next reader of this analysis (finance leadership, per the audience field) will extrapolate whatever trend they're shown into a forecast.`,
    exampleOutput: `Headline: Revenue up $500K (+12.2%) QoQ.
Driver | $ | % of movement | Confidence
One-off enterprise deal | $180K | 36% | Data-supported (isolated in export)
Unit volume growth (recurring SKUs) | $210K | 42% | Data-supported
Price increase (mid-tier plan) | $75K | 15% | Data-supported
Mix shift toward premium SKU | $35K | 7% | Estimated — needs SKU-level margin data to confirm
Residual: none, components reconcile to reported total.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-sales-forecast-pipeline-coverage-check',
    category: 'data-bi',
    title: `Pressure-test a sales forecast against pipeline coverage before you present it, not after it misses`,
    description: `Feeds your current pipeline and historical conversion rates through a coverage-ratio check so an optimistic forecast gets flagged before it goes to leadership, instead of the gap surfacing at quarter-end.`,
    promptText: `Act as a senior data analyst whose job is to stress-test a sales forecast, not to produce a nicer-looking version of it.

FORECAST TARGET
{{forecast_target}}

CURRENT PIPELINE
{{current_pipeline}}

HISTORICAL CONVERSION RATES
{{historical_conversion}}

TIME REMAINING IN PERIOD
{{time_remaining}}

STEP 1 — COVERAGE RATIO
Calculate pipeline coverage: total open pipeline value divided by the remaining gap to target. State the industry-typical healthy ratio you're comparing against (commonly cited as 3x-4x for this stage of a cycle) only as a benchmark to compare to, not as an assumed fact about this specific business — ask me to confirm what coverage ratio has actually worked historically for this team if that's not given.

STEP 2 — STAGE-WEIGHTED REALITY CHECK
Apply the historical conversion rates by stage to the current pipeline to produce a probability-weighted forecast, separate from the sales team's stated commit number. Show both numbers side by side and flag the gap between them explicitly — a sales-stated commit that's meaningfully above the stage-weighted number is the single most useful thing this analysis can surface, so don't let it get smoothed over into a single blended figure.

STEP 3 — WHAT WOULD HAVE TO BE TRUE
State explicitly what would have to be true for the higher (commit) number to actually land — e.g., a conversion rate meaningfully above historical average, or a specific set of named deals all closing on schedule. Do not present this as a prediction that it will happen; present it as the condition under which it could.

STEP 4 — RISK FLAGS
Flag any deal or cohort that's disproportionately responsible for the gap between weighted and commit forecasts (for example, three deals accounting for 40% of the shortfall between the two numbers), since concentration risk in a forecast is different from an evenly distributed shortfall and should be called out as such.

WHAT NOT TO DO
Do not round the stage-weighted number up to make the forecast look closer to target than the math supports. Do not present the sales-stated commit as validated just because it was provided as an input.

OUTPUT FORMAT
1. Coverage ratio with a one-line verdict (healthy / thin / concerning, given the benchmark stated).
2. Table: commit forecast vs. stage-weighted forecast vs. gap.
3. Conditions required for the commit number to hold.
4. Named concentration risks, if any.
5. One paragraph, plain language, for whoever needs to act on this before period close.`,
    variables: [
      {
        name: 'forecast_target',
        description: `The number the team is being measured against.`,
        example: `$2.8M in new bookings for Q3`,
        required: true,
      },
      {
        name: 'current_pipeline',
        description: `The open pipeline broken down by stage and value.`,
        example: `Stage 1 (qualified): $1.9M across 22 deals; Stage 2 (proposal): $1.1M across 9 deals; Stage 3 (verbal): $600K across 4 deals`,
        required: true,
      },
      {
        name: 'historical_conversion',
        description: `Historical close rates by stage, if known.`,
        example: `Stage 1 closes at 18%, Stage 2 at 45%, Stage 3 at 78%, based on the last four quarters`,
        required: true,
      },
      {
        name: 'time_remaining',
        description: `How much of the period is left.`,
        example: `5 weeks left in the quarter`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `sales-forecast`,
      `pipeline-analysis`,
      `revenue-operations`,
      `data-analysis`,
      `forecasting`,
    ],
    whyItWorks: `Sales forecasting has a well-known failure mode where the sales-stated commit number and the statistically weighted number diverge, and a model asked to just "forecast the quarter" will tend to anchor on whatever number was given the most prominence in the prompt rather than independently recomputing it — structuring the task as two explicit, separately labeled calculations (commit vs. stage-weighted) forces GPT-5.1 to actually run the probability-weighting arithmetic instead of defaulting to restating the input. Requiring the benchmark coverage ratio to be stated as an external reference rather than an assumed fact matters because a 3x-4x rule of thumb is a generic sales-ops heuristic, not a verified fact about any specific company's historical conversion behavior, and presenting it with unearned specificity would violate the basic rule that a model shouldn't assert a business-specific fact it can't actually verify from the data given — the prompt instead treats it as a labeled benchmark and pushes back to the user to confirm what's actually worked for this team. The "what would have to be true" framing exploits a specific strength of instructing the model to state a conditional rather than a prediction: it produces the same useful information (the gap between confidence levels) without the model overstepping into asserting deals will close, which it has no basis to assert. Flagging concentration risk separately from the raw gap number matters because a $400K shortfall spread across forty deals and a $400K shortfall concentrated in three deals are operationally very different problems requiring different interventions, and a blended forecast number alone erases that distinction entirely.`,
    exampleOutput: `Coverage ratio: 3.9x remaining gap ($900K) — within the healthy 3-4x range, but concentrated late-stage.
Commit forecast: $2.85M | Stage-weighted forecast: $2.41M | Gap: $440K
Condition for commit to hold: all 4 Stage 3 deals close on schedule at above-average value.
Concentration risk: 2 of those 4 deals represent 61% of the gap between commit and weighted forecast.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-ab-test-result-significance-readout',
    category: 'data-bi',
    title: `Get a straight verdict on an A/B test instead of a hedge that avoids saying whether it won`,
    description: `Runs your test results through a significance and practical-impact check and forces a plain ship/hold/kill call, instead of the noncommittal "trending positive" summary that leaves the actual decision to you.`,
    promptText: `You are reading out an A/B test result the way a senior data analyst would to a product team that needs an actual decision, not a hedge.

TEST SETUP
{{test_setup}}

RESULTS
{{test_results}}

SAMPLE SIZE AND DURATION
{{sample_and_duration}}

DECISION AT STAKE
{{decision_at_stake}}

What I need from you:

1. State the statistical significance of the result plainly — the p-value or confidence interval if given, and whether it crosses the standard 95% threshold. If significance can't actually be calculated from what I've given you (missing sample size, no variance data), say that explicitly instead of eyeballing a verdict from the topline numbers alone.
2. Separate statistical significance from practical significance. A result can be statistically significant and still too small to justify the engineering or design cost of shipping it — state both dimensions and don't let a small but "significant" lift get inflated into a slam-dunk recommendation.
3. Check whether the test ran long enough to cover a full business cycle (e.g., at least one full week, ideally two, to avoid day-of-week bias) given the duration provided, and flag it if it didn't.
4. Give one of exactly three verdicts: SHIP, HOLD FOR MORE DATA, or KILL — with the one sentence of reasoning that would change if a manager pushed back on it.
5. Name the single biggest risk in trusting this result as-is (novelty effect, seasonality, a segment that skews the topline number, sample ratio mismatch) if one is plausible given what's described.

WHAT NOT TO DO
Do not use words like "promising," "trending well," or "worth considering" as a substitute for one of the three verdicts — pick one. Do not treat a large percentage lift on a small sample as equivalent in confidence to the same lift on a large sample; call out the difference.

OUTPUT FORMAT
1. Verdict: SHIP / HOLD FOR MORE DATA / KILL, in bold, first line.
2. Statistical significance readout (one line).
3. Practical significance readout (one line).
4. Duration/cycle-coverage check (one line).
5. Single biggest risk to trusting this result.
6. Two-sentence rationale a skeptical stakeholder could push back on.`,
    variables: [
      {
        name: 'test_setup',
        description: `What was tested against what.`,
        example: `Checkout page: control (single-page checkout) vs. variant (3-step checkout with progress bar)`,
        required: true,
      },
      {
        name: 'test_results',
        description: `The topline metrics from both arms.`,
        example: `Control: 4.1% conversion, 12,400 sessions. Variant: 4.6% conversion, 12,600 sessions.`,
        required: true,
      },
      {
        name: 'sample_and_duration',
        description: `How long the test ran and total sample size.`,
        example: `Ran for 9 days, roughly 25,000 total sessions split evenly`,
        required: true,
      },
      {
        name: 'decision_at_stake',
        description: `What actually happens depending on the verdict.`,
        example: `Whether to roll the 3-step checkout out to 100% of traffic next sprint`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `ab-testing`,
      `experimentation`,
      `statistical-analysis`,
      `product-analytics`,
      `data-analysis`,
    ],
    whyItWorks: `Asked to summarize an A/B test without a forced-choice constraint, GPT-5.1 tends to produce hedged, non-committal language because a confident wrong call feels riskier to generate than a vague one that can't be pinned down later — restricting the output to exactly three named verdicts removes that escape hatch and forces the model to actually commit to a position based on the numbers given, the same discipline a rigorous human analyst would apply. Separating statistical from practical significance targets a specific and common misreading of experiment results: a genuinely significant p-value on a 0.5-percentage-point lift can still not be worth the engineering cost to ship, and collapsing both into one "it worked" statement is exactly the kind of oversimplification that gets a team to ship low-value changes because the test was "significant." The explicit duration/cycle-coverage check exists because a 9-day test spans less than two full weekly cycles, which is a known source of misleading results if weekday and weekend behavior differ, and a model summarizing only the topline percentages has no structural reason to flag that unless explicitly told to check for it. Requiring the single biggest trust risk to be named, rather than leaving the analysis as a clean number, mirrors what a skeptical stakeholder would ask in the room anyway — surfacing it in advance means the person presenting this readout isn't caught flat-footed defending a result they haven't actually stress-tested themselves.`,
    exampleOutput: `Verdict: HOLD FOR MORE DATA
Statistical significance: p ≈ 0.09, does not clear the 95% threshold.
Practical significance: +0.5pp lift would be worth shipping if confirmed, but isn't confirmed yet.
Duration check: 9 days covers barely one full cycle — recommend extending to 14.
Biggest risk: sample size is borderline for a lift this small; could be noise.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-survey-open-text-theme-coding',
    category: 'data-bi',
    title: `Code hundreds of open-text survey responses into themes without losing the outlier that matters`,
    description: `Turns a pile of raw open-ended survey answers into a ranked theme list with verbatim quotes as evidence, while explicitly holding back rare-but-important comments from getting averaged away.`,
    promptText: `You are coding open-text survey responses into themes the way a research analyst would for a stakeholder who will act on the results, not just skimming for a vibe.

SURVEY QUESTION ASKED
{{survey_question}}

RAW RESPONSES
{{raw_responses}}

RESPONDENT COUNT AND CONTEXT
{{respondent_context}}

WHAT THE RESULTS WILL BE USED FOR
{{intended_use}}

CODING RULES
Read through the responses and derive themes from what's actually written — do not start from a preset list of themes you'd expect to see and force-fit responses into it. Each theme needs: a short label, the count and percentage of respondents who raised it, and two to three verbatim quotes (unedited, exact wording) as evidence, so a reader can sanity-check the coding against the actual words used. Rank themes by frequency, but keep a separate section for any response that doesn't fit the top themes and represents a distinct, potentially important signal on its own — a single respondent describing a serious usability blocker or a safety concern should never be discarded just because it's not common; flag it separately with a note on why it might matter disproportionately to its frequency. If a response touches multiple themes, count it under all of them and say so, rather than forcing every response into exactly one bucket. State your confidence in the coding for ambiguous or sarcastic responses where the theme assignment is a judgment call, rather than presenting every categorization with equal certainty.

WHAT NOT TO DO
Do not paraphrase or clean up quotes when presenting them as evidence — use the respondent's exact words, typos and all, or the evidence loses its verifying power. Do not silently merge a small theme into a larger adjacent one just to make the list tidier.

OUTPUT FORMAT
1. Ranked theme table: theme | count | % of respondents | 2-3 verbatim quotes.
2. Notable outlier responses that don't fit the top themes, with a one-line note on why each might matter.
3. Any response coded under multiple themes, listed once with its themes noted.
4. Two-sentence summary suited to {{intended_use}}.`,
    variables: [
      {
        name: 'survey_question',
        description: `The exact open-ended question respondents answered.`,
        example: `"What, if anything, made it hard to complete your order today?"`,
        required: true,
      },
      {
        name: 'raw_responses',
        description: `The pasted set of raw text answers.`,
        example: `A list of 140 free-text responses pasted directly from the survey export`,
        required: true,
      },
      {
        name: 'respondent_context',
        description: `Who answered and roughly how many.`,
        example: `140 responses from customers who completed checkout in the last 30 days`,
        required: true,
      },
      {
        name: 'intended_use',
        description: `What decision or document this coding will feed into.`,
        example: `Prioritizing the next sprint's checkout fixes with the product team`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `survey-analysis`,
      `qualitative-coding`,
      `customer-feedback`,
      `data-analysis`,
      `research`,
    ],
    whyItWorks: `A model summarizing open-text survey data by default tends to produce a smooth, averaged narrative that reads well but quietly discards the low-frequency signal, because frequent phrases dominate what gets synthesized into prose — explicitly requiring a separate outlier section reverses that default by giving rare responses a protected place in the output regardless of how the frequency ranking shakes out, which matters because in product and safety-adjacent feedback the single respondent describing a blocking bug is often more actionable than the twenty saying "good overall." Requiring verbatim, unedited quotes as evidence for every theme forces the model to ground its categorization in something checkable rather than asserting a theme exists on its own authority — a reader can immediately verify "price complaints, 22%" against the actual three quotes shown, which a paraphrased summary would make impossible to audit. Instructing the model to derive themes bottom-up from the actual text, instead of starting from an expected list, addresses a specific failure mode where a model primed with domain expectations (checkout surveys "usually" surface price, speed, and trust issues) pattern-matches responses into those familiar buckets even when the actual text is describing something different, silently forcing new signal into old categories. Allowing multi-theme tagging rather than a forced single bucket per response reflects how people actually write open-text feedback — a single sentence complaining about both price and a confusing checkout flow is two data points, and forcing it into one bucket understates both themes' true frequency.`,
    exampleOutput: `Theme: Confusing shipping cost timing — 31 responses (22%) — "i didnt see the shipping fee until the very last step and almost left"; "shipping cost popped up out of nowhere".
Outlier flag: One response described being unable to complete checkout on a screen reader — only 1 mention, but represents a distinct accessibility blocker worth flagging regardless of frequency.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-data-storytelling-narrative-from-metrics',
    category: 'data-bi',
    title: `Build the narrative arc around a set of metrics before you build a single slide`,
    description: `Takes a pile of disconnected numbers and finds the actual story connecting them — tension, turning point, resolution — so a reporting deck doesn't end up as a wall of charts with no throughline.`,
    promptText: `Help me find the actual narrative connecting a set of metrics before I build anything visual, the way a data storyteller would structure a talk rather than a report.

METRICS I HAVE
{{available_metrics}}

TIME WINDOW COVERED
{{time_window}}

WHO WILL HEAR THIS STORY
{{audience}}

THE ONE THING I NEED THEM TO DO AFTER HEARING IT
{{desired_action}}

Do this in three passes.

PASS ONE — FIND THE TENSION
Look across the metrics for the actual tension: a number that surprised someone, a trend that reversed, a contradiction between two metrics that should normally move together but didn't. State the tension in one sentence. If the metrics given don't contain an obvious tension — everything is flat or moving in the expected direction — say that plainly rather than manufacturing drama that isn't there.

PASS TWO — FIND THE TURNING POINT
Identify the specific moment or metric where the story pivots — the point where the number that seemed like the main character turns out not to be, or where a smaller metric explains the bigger one. Name which raw metrics are evidence for this pivot and which are supporting context, since not every number in the pile deserves equal weight in the story.

PASS THREE — BUILD THE ARC
Sequence a narrative arc: setup (what was expected), tension (what actually happened), turning point (why), resolution (what this means and what {{audience}} should do about it, tied directly to {{desired_action}}). For each beat, name which specific metric or chart would carry it visually — this becomes your slide order, not an afterthought once the deck exists.

WHAT NOT TO DO
Do not force a three-act structure onto data that's genuinely just a steady, unremarkable trend — a flat story told honestly beats a fake turning point. Do not bury the resolution at the end if {{desired_action}} needs to happen urgently; state upfront when the arc should be compressed for time-pressured audiences.

OUTPUT FORMAT
1. The tension, in one sentence (or an honest statement that there isn't one).
2. The turning point and its supporting metric(s).
3. The four-beat arc, each beat with its carrying metric/chart named.
4. One line on whether this audience needs the compressed or full version of the story.`,
    variables: [
      {
        name: 'available_metrics',
        description: `The raw set of numbers you're working from.`,
        example: `Signups up 40% this quarter, but activation rate down from 62% to 48%, and support tickets up 3x`,
        required: true,
      },
      {
        name: 'time_window',
        description: `The period the metrics span.`,
        example: `Last two quarters, Q1 and Q2 2026`,
        required: true,
      },
      {
        name: 'audience',
        description: `Who's hearing this presented.`,
        example: `The executive team at the quarterly business review`,
        required: true,
      },
      {
        name: 'desired_action',
        description: `The one thing you want them to do or decide after hearing it.`,
        example: `Approve reallocating two engineers from acquisition to onboarding for Q3`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `data-storytelling`,
      `presentation-design`,
      `executive-communication`,
      `data-analysis`,
      `narrative-structure`,
    ],
    whyItWorks: `A model asked to "turn these metrics into a story" will default to a chronological recap — metric one went up, metric two went down, metric three stayed flat — because that's the least interpretive path through a list of numbers, and it produces a deck that reads as a wall of charts precisely because no beat was ever designated as more important than another. Forcing a three-pass structure (tension, turning point, arc) makes the model do the actual analytical work of ranking which metrics matter to the story before any visual gets planned, which mirrors how experienced data storytellers actually work backward from the point they need to land rather than forward from whatever data happens to exist. The explicit permission to say "there's no real tension here" is a deliberate guard against a known model behavior: asked to build a compelling narrative, a language model will often manufacture drama in flat data because dramatic language is what "storytelling" tends to pattern-match to, and a false turning point in a business context actively misleads the audience about what actually happened. Tying the resolution beat directly to the named desired_action addresses the actual purpose of a data story in a business setting — it's not entertainment, it's a persuasion structure meant to produce a specific decision, so a story that resolves into vague inspiration rather than the concrete ask fails at its actual job even if every chart in it is accurate. Naming which metric carries which beat before the deck exists prevents the common failure where slide order gets decided by chart aesthetics rather than by what the narrative actually needs at that moment.`,
    exampleOutput: `Tension: signups grew 40% while activation fell from 62% to 48% — growth and quality moved in opposite directions.
Turning point: the support-ticket spike (3x) traces to the same cohort driving signup growth, suggesting the new acquisition channel is bringing in users who need more help, not fewer.
Arc: Setup (signup growth looked like a win) → Tension (activation dropped as growth rose) → Turning point (ticket data ties it to one channel) → Resolution (reallocate two engineers to onboarding for that cohort in Q3).`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-executive-data-brief-one-pager',
    category: 'data-bi',
    title: `Compress a full analysis into a one-page brief an executive will actually read before the meeting`,
    description: `Distills a longer analysis or dashboard into a single page built for a five-minute pre-read, with the decision needed stated up top instead of buried under methodology.`,
    promptText: `Compress the analysis below into a one-page executive brief built for someone who will read it in under five minutes before a meeting, not a research report.

FULL ANALYSIS OR FINDINGS
{{full_analysis}}

DECISION THIS BRIEF IS FEEDING
{{decision_needed}}

EXECUTIVE'S FAMILIARITY WITH THE TOPIC
{{executive_context}}

DEADLINE PRESSURE
{{timing}}

RULES FOR THE BRIEF
Open with the decision or ask, not the background — the first line should be the thing you want the executive to do or approve, stated as plainly as you'd say it out loud. Follow with no more than three supporting facts, each one a specific number, not a qualitative claim ("engagement improved" is not a fact; "engagement rose from 34% to 41%" is). State the confidence level of the finding in one phrase (well-supported by three months of data vs. an early read on two weeks) so the executive knows how much weight to put on it without needing to ask. Name the single biggest risk or unknown explicitly rather than letting the brief read as unqualified good news — an executive brief that hides the risk gets the reader blindsided later when someone else raises it in the room. Match the level of technical detail to {{executive_context}} — do not define terms this specific executive already knows, and do not assume familiarity with terms they don't.

WHAT NOT TO DO
Do not include methodology, data sources, or how the analysis was run unless {{executive_context}} indicates this executive specifically asks about method — that detail belongs in an appendix, not the one page. Do not soften the ask into a menu of options if a specific recommendation is warranted by the data; hedging into "here are three paths forward" when one is clearly better is a way of avoiding the actual recommendation.

OUTPUT FORMAT
1. The ask/decision, one sentence, first line, bolded.
2. Up to three supporting facts, each with a specific number.
3. Confidence level of the finding, one phrase.
4. The single biggest risk or unknown, one sentence.
5. Recommended next step, one sentence.
(Total length: fits on one page, roughly 150-250 words excluding this list.)`,
    variables: [
      {
        name: 'full_analysis',
        description: `The longer analysis, dashboard summary, or findings to compress.`,
        example: `A four-page writeup on churn drivers in the SMB segment, including cohort tables and a regression summary`,
        required: true,
      },
      {
        name: 'decision_needed',
        description: `What the executive actually needs to decide or approve.`,
        example: `Whether to approve a dedicated SMB retention specialist role for Q4`,
        required: true,
      },
      {
        name: 'executive_context',
        description: `How familiar this specific executive already is with the topic.`,
        example: `Has seen churn numbers monthly for a year, doesn't need churn defined, but hasn't seen this cohort breakdown before`,
        required: true,
      },
      {
        name: 'timing',
        description: `How much lead time the executive has before acting on this.`,
        example: `This is the pre-read for a meeting happening tomorrow morning`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `executive-communication`,
      `data-brief`,
      `business-intelligence`,
      `reporting`,
      `decision-support`,
    ],
    whyItWorks: `Language models asked to "summarize" a longer document tend to compress proportionally — keeping roughly the same structure at a smaller scale, background first, conclusion last — which is exactly backward for an executive brief, where the entire value of the one-pager is that the decision comes first so a reader who only has thirty seconds still gets the point; explicitly mandating that ordering overrides the model's default compression instinct rather than relying on it to reorder on its own. Requiring every supporting fact to be a specific number rather than a qualitative claim closes a common failure in AI-written business summaries, where "engagement improved significantly" sounds confident but is actually less informative than the underlying number, and an executive reading multiple such briefs a week can tell the difference between analysis and padding. Naming a confidence level per finding matters mechanically because a model with no explicit instruction to distinguish data maturity will present a two-week early read and a three-month trend with identical confident phrasing, and an executive making a resourcing decision needs to know which one they're actually looking at. Forcing the single biggest risk into the brief directly counters a real tendency toward one-sided positivity in AI-generated business writing — a brief that only presents supporting evidence for the ask reads as advocacy rather than analysis, and a sharp executive will ask about the downside anyway, so surfacing it preemptively is what makes the brief trustworthy rather than something to be second-guessed in the room.`,
    exampleOutput: `Ask: Approve a dedicated SMB retention specialist role for Q4.
Facts: SMB churn rose from 4.1% to 6.3% monthly over the last two quarters; accounts with zero support contact in month one churn at 2.4x the rate of those with contact; the cohort represents $340K in at-risk ARR.
Confidence: well-supported — three-quarter cohort trend, not a single-month blip.
Biggest risk: we haven't isolated whether it's a product gap or a support-coverage gap — this role addresses the second, not necessarily the first.
Next step: approve the role now; commission a parallel product-gap review in parallel.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-data-dictionary-from-raw-schema',
    category: 'data-bi',
    title: `Generate a real data dictionary from a raw schema dump instead of column names with guessed descriptions`,
    description: `Turns a raw table schema or column list into a data dictionary with definitions, types, and known ambiguities flagged for confirmation, rather than confidently inventing what an unclear field means.`,
    promptText: `You are building a data dictionary entry-by-entry from the schema I give you, in the disciplined style of a data analyst who documents ambiguity rather than papering over it.

RAW SCHEMA OR COLUMN LIST
{{raw_schema}}

TABLE/DATASET PURPOSE (IF KNOWN)
{{dataset_purpose}}

ANY BUSINESS CONTEXT ALREADY KNOWN
{{business_context}}

WHO WILL USE THIS DICTIONARY
{{intended_users}}

For each column, produce: the column name, inferred data type, a plain-language definition, and a note on units or format where relevant (currency, timezone, encoding). Where a column name is genuinely self-explanatory given standard conventions (e.g., created_at as a timestamp) and the business context provided, write the definition directly. Where a column name is ambiguous, non-obvious, or could plausibly mean two different things (a column called status with no visible value list, a column called amount with no stated currency or sign convention), do not guess — write the definition as "needs confirmation" and state the specific question that would resolve it, rather than inventing a plausible-sounding definition that might be wrong and would look authoritative regardless. Flag any column that looks like it duplicates or overlaps with another (two date columns that might represent the same event) as worth reconciling before this dictionary is treated as final. Note any column whose name suggests personal or sensitive data (email, ssn, ip_address-style fields) so that access-control questions get raised at documentation time rather than after the data's already in wide use.

WHAT NOT TO DO
Do not write a confident-sounding definition for a column you're actually guessing at — an incorrect data dictionary entry is worse than an honest "unconfirmed," because it gets treated as ground truth by everyone who reads it afterward. Do not skip flagging likely enum columns (status, type, category-style fields) as needing their actual value list documented — a definition without the possible values is incomplete for this kind of field.

OUTPUT FORMAT
Table: column name | inferred type | definition | confirmed or needs-confirmation | note (units, sensitive-data flag, overlap flag, or the specific question to resolve it).
Followed by: a short list of the columns most in need of a follow-up conversation with whoever owns this data, ranked by how much of the dictionary's usefulness depends on getting them right.`,
    variables: [
      {
        name: 'raw_schema',
        description: `The actual column names and types, pasted as-is.`,
        example: `user_id (int), status (varchar), amount (decimal), created_at (timestamp), updated_at (timestamp), src (varchar), flag (boolean)`,
        required: true,
      },
      {
        name: 'dataset_purpose',
        description: `What this table is for, if known.`,
        example: `Tracks subscription billing events for the core SaaS product`,
        required: false,
      },
      {
        name: 'business_context',
        description: `Any domain knowledge already available about naming conventions or values.`,
        example: `"src" likely refers to acquisition channel based on how it's used elsewhere in the codebase, but not confirmed for this table`,
        required: false,
      },
      {
        name: 'intended_users',
        description: `Who will rely on this dictionary.`,
        example: `New analysts on the BI team who didn't build this pipeline`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `data-dictionary`,
      `data-documentation`,
      `schema-design`,
      `data-governance`,
      `business-intelligence`,
    ],
    whyItWorks: `A language model handed an ambiguous column name will, by default, produce a plausible guess rather than an admission of uncertainty, because a confident-sounding answer is the statistically likely completion and there's no built-in penalty for being specifically wrong versus vaguely right — this prompt breaks that default by giving "needs confirmation" equal standing as a valid, complete answer in the output format, so the model isn't implicitly rewarded for filling every cell with something. This matters disproportionately for data dictionaries specifically because, unlike a one-off analysis a human immediately sanity-checks, a data dictionary is exactly the kind of artifact that gets treated as settled reference material by people who never see the original ambiguous schema and have no way to independently notice a wrong guess — an incorrect entry here propagates silently into every downstream query someone writes based on trusting the definition. Requiring the specific disambiguating question, not just a flag, is what makes the "needs confirmation" entries actually actionable rather than just a shrug — "amount: needs confirmation" tells the reader nothing useful, while "amount: needs confirmation — is this pre-tax or post-tax, and can it be negative for refunds?" is something a data owner can answer in one sentence. Flagging likely sensitive-data columns during the documentation pass, rather than leaving that to a separate security review, matters because a data dictionary is often the first structured artifact anyone produces about a table, and it's the cheapest possible point to raise an access-control question, before the field has been copied into five downstream reports that would each need auditing later.`,
    exampleOutput: `status | varchar | Likely subscription state (active/cancelled/etc.) | needs confirmation | No visible value list — confirm the full set of possible values and whether "paused" exists as a distinct state from "cancelled."
amount | decimal | Billing amount for the event | needs confirmation | Currency and sign convention unclear — confirm whether refunds are represented as negative values in this same column.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-etl-source-to-target-mapping',
    category: 'data-bi',
    title: `Draft a source-to-target ETL mapping that names every transformation instead of leaving it implicit`,
    description: `Produces a field-by-field mapping between a source system and a target schema, including the exact transformation logic and the edge cases that would silently break a naive one-to-one copy.`,
    promptText: `Draft a source-to-target mapping document for an ETL job, at the level of specificity an engineer could actually implement from without asking follow-up questions.

SOURCE SCHEMA
{{source_schema}}

TARGET SCHEMA
{{target_schema}}

KNOWN BUSINESS RULES THAT AFFECT THE MAPPING
{{business_rules}}

LOAD PATTERN
{{load_pattern}}

For every target field, state which source field(s) it comes from and the exact transformation applied — not just "maps to," but the actual logic: a data type cast, a unit conversion, a concatenation, a lookup against a reference table, or a conditional (if X then Y else Z). Where a target field has no obvious single-source mapping — it's derived from a calculation across multiple source fields, or it doesn't exist in the source at all and needs a default or an external lookup — say so explicitly and state what the default or derivation rule should be, asking me to confirm it rather than inventing a plausible-sounding default silently. Flag every place where a naive direct copy would silently produce wrong data: a source field that can be null where the target requires not-null, a source date in a different timezone than the target expects, a source enum whose value set doesn't fully match the target enum's allowed values, or a source field that can contain duplicates where the target has a uniqueness constraint. For {{load_pattern}}, state how the mapping handles updates to existing rows versus new rows — specifically whether this is a full overwrite, an upsert keyed on a stated field, or an append-only load, since the transformation logic for a field can differ between an initial load and an incremental one.

WHAT NOT TO DO
Do not write "direct mapping" for any field without checking whether type, nullability, or value-set actually align between source and target — check each of those three before calling anything a "direct" pass-through. Do not invent a default value for a required target field without flagging it as a decision that needs sign-off.

OUTPUT FORMAT
Table: target field | source field(s) | transformation logic | edge cases/flags | confirmed or needs sign-off.
Followed by: a short list of fields that need a business-rule decision before this mapping can be implemented as-is.`,
    variables: [
      {
        name: 'source_schema',
        description: `The source system's relevant fields and types.`,
        example: `legacy_users table: id (int), full_name (varchar), signup_date (varchar, format MM/DD/YYYY), status_code (int, 1-4), country (varchar, free text)`,
        required: true,
      },
      {
        name: 'target_schema',
        description: `The target system's schema you're loading into.`,
        example: `users table: user_id (uuid), first_name (varchar not null), last_name (varchar not null), created_at (timestamp UTC not null), account_status (enum: active/paused/cancelled/pending), country_code (char(2), ISO 3166-1)`,
        required: true,
      },
      {
        name: 'business_rules',
        description: `Any known rules that affect how fields should be derived or handled.`,
        example: `status_code 1 and 2 both map to "active" historically, but the business wants status_code 2 (trial) split out as its own state going forward`,
        required: false,
      },
      {
        name: 'load_pattern',
        description: `How the load actually runs — full refresh, incremental, append-only.`,
        example: `Nightly incremental load, upserting on legacy id mapped to a new surrogate user_id`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `etl`,
      `data-mapping`,
      `data-engineering`,
      `schema-migration`,
      `data-integration`,
    ],
    whyItWorks: `The most common way an ETL mapping document fails in practice isn't a wrong mapping, it's an implicit one — a field labeled "direct mapping" that turns out to hide a type mismatch or a nullability conflict that only surfaces as a production error weeks later, and a model asked generically to "map these fields" has no structural reason to check type, nullability, and value-set alignment unless told to check exactly those three things for every field, which is why the prompt names them explicitly rather than leaving "check for edge cases" as a vague instruction the model could satisfy superficially. Requiring the transformation logic to be stated as actual executable logic (a cast, a lookup, a conditional) rather than the word "maps to" forces GPT-5.1 to think through what the transformation function would actually need to do, which surfaces gaps — like a free-text country field needing a lookup table to become an ISO country code — that a vaguer instruction would let slide past as an assumed detail. The instruction to flag rather than silently invent a default for fields with no clear source is a direct application of the general rule that a model shouldn't assert an unverifiable business decision as fact — a default value for a required field is a business decision, not a technical one, and treating it as a technical detail the model can just fill in is how ETL jobs end up encoding an accidental policy nobody actually approved. Separating the load-pattern-specific logic (how upserts versus initial loads treat the same field differently) matters because the same transformation can be correct on day one and wrong on every incremental run after it if, for instance, a field should only be set on insert and never overwritten on update — a mapping that doesn't distinguish the two will get implemented as one static rule that's actually two different rules pretending to be one.`,
    exampleOutput: `account_status | status_code | Lookup: 1→active, 2→trial (per updated rule, previously bundled into active), 3→paused, 4→cancelled | Business rule change flagged: confirm whether historical rows with status_code=2 should be backfilled as "trial" or left as "active" for continuity | Needs sign-off
country_code | country | Requires lookup against ISO 3166-1 reference table; free-text source values ("USA", "United States", "U.S.") will need fuzzy-matching or a manual mapping table before load | Edge case: unmapped free-text values need a fallback rule | Needs sign-off`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-csv-transform-cleanup-spec',
    category: 'data-bi',
    title: `Turn a messy CSV export into a precise cleanup spec before you touch the actual data`,
    description: `Reads a sample of a messy CSV and produces an exact, ordered list of cleanup transformations to apply, so the fix is a repeatable spec you can hand to a script rather than a one-off manual scrub.`,
    promptText: `Look at the sample rows below from a messy CSV export and write the exact, ordered cleanup spec needed to make it analysis-ready — not the cleaned data itself, the spec for cleaning it, since this needs to be repeatable on every future export from the same source.

SAMPLE ROWS (WITH HEADER)
{{sample_rows}}

WHAT THIS DATA WILL FEED INTO
{{downstream_use}}

KNOWN QUIRKS FROM THIS SOURCE
{{known_quirks}}

Go column by column. For each column, identify every distinct problem visible in the sample: inconsistent date formats, inconsistent casing or whitespace, a numeric column stored as text with currency symbols or thousands separators, mixed null representations ("N/A", empty string, "null", "-" all meaning the same thing), duplicate rows or duplicate keys, and encoding artifacts (mangled characters from a bad encoding conversion). For each problem found, write the exact rule to fix it — not "clean up the dates" but "parse as MM/DD/YYYY where day/month are unambiguous; for ambiguous dates like 03/04/2026, flag for manual review rather than guessing the format" — a fix I could hand directly to someone writing a script. Order the rules in the sequence they should actually be applied, since some fixes depend on others running first (deduplication should generally happen after whitespace/casing normalization, or near-duplicates caused by a trailing space won't be caught). Call out anything in the sample that looks like it needs a human decision rather than an automated rule — a row that looks like test data mixed into a production export, or a value that's ambiguous even after normalization.

WHAT NOT TO DO
Do not just say "standardize the date format" without naming the actual target format and how to handle ambiguous cases. Do not silently assume how nulls should be handled downstream (dropped vs. imputed vs. kept as null) — state the assumption and flag it as something to confirm against {{downstream_use}}.

OUTPUT FORMAT
1. Column-by-column problem list with the exact fix rule for each.
2. The applied order of operations, numbered.
3. Rows or values needing a human decision rather than an automated rule.
4. Any assumption made about null-handling, flagged for confirmation.`,
    variables: [
      {
        name: 'sample_rows',
        description: `A representative sample of the messy raw data, header included.`,
        example: `name,signup_date,revenue,region
 JOHN SMITH ,03/04/2026,"$1,204.50",us
jane doe,2026-03-05,N/A,US 
John Smith,03/04/2026,1204.50,United States`,
        required: true,
      },
      {
        name: 'downstream_use',
        description: `What this cleaned data will be used for.`,
        example: `Loading into a BI dashboard that aggregates revenue by region and month`,
        required: true,
      },
      {
        name: 'known_quirks',
        description: `Any pattern you already know about from experience with this export.`,
        example: `This export sometimes duplicates a row if the source system times out and retries the batch job`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `csv-cleaning`,
      `data-transformation`,
      `data-cleaning`,
      `etl`,
      `spreadsheet-automation`,
    ],
    whyItWorks: `Asked to "clean this CSV," a model will often just clean the sample rows shown and hand back tidied data, which solves the wrong problem entirely for anyone dealing with a recurring export — the actual need is a reusable rule set, not a one-time fix, so this prompt explicitly redirects the output away from cleaned data and toward a spec, which forces the model to generalize each observed problem into a rule rather than a patch applied to the specific rows in front of it. Requiring the exact target format and an explicit ambiguous-case rule (rather than "standardize dates") matters because date ambiguity — is 03/04/2026 March 4th or April 3rd — is precisely the kind of judgment call a model will silently resolve one way if not told to flag it, and a script built from a spec that quietly picked a guess will misparse a meaningful fraction of ambiguous dates without anyone noticing until a downstream aggregate looks wrong. Ordering the operations rather than listing them as an unordered set addresses a real dependency in data cleaning that's easy to overlook — deduplication run before whitespace trimming will miss the exact duplicates that trimming would have revealed, since " JOHN SMITH " and "John Smith" won't be recognized as the same key until normalization happens first — and a model asked only for a list of fixes has no reason to surface that ordering constraint unless the prompt asks for a sequence specifically. Flagging null-handling as an assumption to confirm rather than silently picking one (drop vs. impute vs. keep) matters because whether "N/A" revenue should become $0, a blank, or an excluded row changes the actual aggregate numbers in the downstream dashboard, making it a business decision disguised as a technical cleanup step.`,
    exampleOutput: `Column: signup_date — Problem: two formats present (MM/DD/YYYY and YYYY-MM-DD). Fix: parse both to ISO YYYY-MM-DD; where a date like 03/04/2026 is ambiguous (both day and month ≤12), flag row for manual review rather than guessing.
Column: revenue — Problem: currency symbol, thousands separator, and "N/A" as null all present. Fix: strip "$" and ",", cast to decimal; treat "N/A" as null, not zero — confirm with downstream dashboard owner before deciding whether nulls should be excluded from the revenue aggregate or shown as $0.
Order: 1) trim whitespace/normalize case, 2) parse dates, 3) parse currency, 4) deduplicate on normalized name+date+region.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-json-transform-schema-reshape',
    category: 'data-bi',
    title: `Reshape a nested JSON payload into a flat schema without losing fields that only appear sometimes`,
    description: `Designs the exact flattening logic for a nested JSON API response into a tabular schema, explicitly accounting for fields that are optional, inconsistently typed, or only present in some records.`,
    promptText: `Design a flattening spec to turn the nested JSON sample below into a flat, tabular schema — the spec itself, not just an example of the flattened output, since this needs to run against every future payload from this API, not just the sample shown.

SAMPLE JSON PAYLOAD
{{sample_json}}

TARGET USE
{{target_use}}

KNOWN VARIABILITY ACROSS RECORDS
{{known_variability}}

Work through the payload structure and propose a flat schema: one row per {{target_use}}'s natural unit (a single event, order, or user — state which one you're choosing and why if it's not obvious from the payload). For each nested object or array, decide and state explicitly how it should be handled: flattened into prefixed columns (address.city, address.zip), exploded into multiple rows (one row per item in an array, with a clear rule for how the parent fields repeat across the exploded rows), or kept as a raw JSON string column if it's too variable to usefully flatten — and give the reasoning for which choice fits which field, not just the mechanical result. Explicitly handle fields that appear in some records and not others: state the exact behavior for a missing field (null vs. a specific default) rather than leaving it to whatever the flattening code happens to do by accident. Where a field's type is inconsistent across records in a way the sample hints at (a quantity field that's sometimes a string and sometimes a number, an array that's sometimes absent and sometimes empty), flag it as a normalization rule to build in, not something to discover later when the flattening script throws an error on a record shaped differently than the sample.

WHAT NOT TO DO
Do not just show one example of the sample payload flattened — the deliverable is the general rule, applicable to a payload you haven't seen, not a one-off transformation of the one example given. Do not silently choose "explode into rows" for every array without checking whether that specific array's cardinality actually calls for it versus a flattened summary column (e.g., a count or a comma-joined list).

OUTPUT FORMAT
1. Chosen row grain and why.
2. Field-by-field flattening rule: source path | target column(s) | flatten/explode/raw-JSON | missing-value behavior.
3. Type-inconsistency flags with the normalization rule for each.
4. One worked example showing the sample payload run through the spec.`,
    variables: [
      {
        name: 'sample_json',
        description: `A representative nested JSON payload from the source.`,
        example: `{"order_id": "A1", "customer": {"id": 9, "email": "x@y.com"}, "items": [{"sku": "S1", "qty": 2}, {"sku": "S2", "qty": "1"}], "discount": null}`,
        required: true,
      },
      {
        name: 'target_use',
        description: `What tabular structure and grain this needs to become.`,
        example: `One row per order-line-item, for loading into a revenue-by-SKU BI table`,
        required: true,
      },
      {
        name: 'known_variability',
        description: `What you already know varies between payloads beyond the sample.`,
        example: `The "discount" field is sometimes a nested object with amount/reason instead of null, and "items" can occasionally be an empty array for cancelled orders`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`json-transform`, `data-modeling`, `api-data`, `etl`, `schema-design`],
    whyItWorks: `A model asked to flatten a JSON sample will naturally just flatten the one example given, which produces something that looks complete but is actually just a demonstration — this prompt forces a shift from output to spec by explicitly requiring the reasoning for each structural choice (why this array explodes into rows versus that one collapses into a summary column), which is the part of the work that generalizes to payloads not yet seen, whereas the flattened example alone would not. Naming the row grain explicitly and asking for the reasoning behind it addresses a subtle but common design error in JSON flattening: choosing the wrong natural unit (one row per order instead of one row per line-item, for instance) doesn't cause an error, it just silently produces a schema that can't answer the questions the downstream use actually needs answered, and that mistake is invisible until someone tries to run an aggregate query against it later. Requiring explicit missing-value behavior per field, rather than leaving it to "whatever the flattening code does," matters because in most real flattening implementations a genuinely absent field and a field present with a null value can end up looking identical in the output table unless the spec states which is which, and that distinction can matter for a downstream count or an aggregate that treats "never had a discount" differently from "had a $0 discount." Flagging type inconsistency (a quantity field that's sometimes string, sometimes number) as a spec-level rule rather than an implementation afterthought is what prevents the actual, common production failure mode of a flattening script working fine against the sample and then throwing a type error the first time a real-world payload deviates from it — building the normalization rule into the spec up front means the eventual code handles that case by design, not by a patch added after the first crash.`,
    exampleOutput: `Row grain: one row per order line-item (order_id + item index), because target_use aggregates revenue by SKU.
customer.email → customer_email | flatten | required, no missing-value case observed in sample.
items[].qty → item_qty | explode (one row per item) | type-inconsistency flag: cast to integer, treating string "1" and numeric 2 identically; log any non-numeric value rather than silently coercing to 0.
discount → discount_amount, discount_reason | flatten with null-safe defaults (0, null) | known variability flag: object shape sometimes differs from sample — confirm both shapes before finalizing.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-validation-rules-from-business-logic',
    category: 'data-bi',
    title: `Turn a description of business logic into a checkable list of data validation rules`,
    description: `Converts a plain-language description of how a business process should work into explicit, testable validation rules for a dataset, with each rule stated so a failing row can actually be identified.`,
    promptText: `Convert the business logic described below into a set of explicit, testable data validation rules — every rule needs to be something a query could actually check against real rows, not a restated version of the business description.

BUSINESS PROCESS DESCRIPTION
{{process_description}}

TABLE(S) INVOLVED
{{tables_involved}}

KNOWN EDGE CASES ALREADY SEEN
{{known_edge_cases}}

SEVERITY THIS MATTERS FOR
{{severity_context}}

Read the business logic and extract every implicit rule it depends on — not just the rules explicitly stated, but the ones the description assumes without saying (if the description says "a refund can't exceed the original order amount," that implies a rule about what happens when a refund exactly equals it, and a rule about what "original order amount" means if the order itself was later modified). For every rule, write it in a checkable form: the field(s) involved, the condition that should hold, and what a violation looks like concretely (e.g., "refund_amount should never exceed order_amount for the same order_id; a violation is any row where refund_amount > order_amount"). Classify each rule's severity based on {{severity_context}} — a hard constraint that should block a record from loading at all versus a soft warning that should be flagged for review but not block anything, since treating every rule as equally blocking will stop good data from loading over a rule that was only ever meant to be advisory. For any known edge case, write the rule so it explicitly accounts for that case rather than flagging every instance of it as a false-positive violation forever. Where the business description is ambiguous about what should actually happen in a genuinely unclear scenario (what if a refund is issued after the order was itself edited), state the ambiguity plainly and ask which behavior is intended rather than picking one silently.

WHAT NOT TO DO
Do not write a rule as a restatement of the business sentence ("refunds should be reasonable") — every rule must be phrased as a concrete, evaluable condition. Do not mark every rule as a hard blocker by default; that's a business decision requiring input from whoever owns {{severity_context}}, not a default to assume.

OUTPUT FORMAT
Table: rule # | fields involved | condition | what a violation looks like | severity (hard block / soft warning, with why) | edge case handled (if any).
Followed by: any ambiguous scenario in the business description that needs a decision before the rule can be finalized.`,
    variables: [
      {
        name: 'process_description',
        description: `The plain-language description of how the business process is supposed to work.`,
        example: `A refund can be issued for up to 30 days after purchase, can't exceed the original order amount, and requires a reason code. Partial refunds are allowed.`,
        required: true,
      },
      {
        name: 'tables_involved',
        description: `Which tables/fields the rules need to check across.`,
        example: `orders table (order_id, order_amount, purchase_date) joined to refunds table (refund_id, order_id, refund_amount, refund_date, reason_code)`,
        required: true,
      },
      {
        name: 'known_edge_cases',
        description: `Any exception pattern you already know happens in practice.`,
        example: `Occasionally a single order gets two partial refunds that together approach the full order amount — this is legitimate, not a violation`,
        required: false,
      },
      {
        name: 'severity_context',
        description: `What's at stake if a rule is violated, to inform hard-block vs. soft-warning classification.`,
        example: `This feeds a finance reconciliation report — a refund exceeding the order amount is a hard data-integrity problem, but a missing reason code is just sloppy entry`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `data-validation`,
      `data-quality`,
      `business-rules`,
      `data-governance`,
      `business-intelligence`,
    ],
    whyItWorks: `Business logic as described in plain language is almost never a complete specification — it states the intended happy path and leaves the edge cases and boundary conditions implicit, and a model asked to "write validation rules from this" will, by default, restate the explicit sentence as a rule without doing the harder work of surfacing what the sentence assumes but doesn't say, which is exactly the gap this prompt closes by explicitly instructing extraction of implicit rules, not just stated ones. Requiring every rule to specify concretely what a violation looks like, rather than a restated business sentence, is what actually makes a rule testable — "refunds should be reasonable" cannot be checked by any query, while "refund_amount > order_amount" can be run against the table today, and the difference between those two forms is the entire value of turning business logic into validation logic in the first place. Forcing an explicit hard-block versus soft-warning classification addresses a specific and costly failure mode in real data pipelines: a validation layer that treats every rule as equally blocking will eventually halt a legitimate load over a rule that was only ever meant to flag something for human review, and that classification is a business risk-tolerance decision that the model has no basis to make silently — surfacing it as a decision to confirm, tied to the stated severity context, keeps that judgment with the person who actually owns the consequences. Handling the known edge case explicitly (two partial refunds that together approach the order total) rather than leaving the rule naive prevents the common operational annoyance of a validation system that cries wolf on legitimate transactions constantly, which is how teams end up ignoring their own validation alerts entirely after enough false positives erode trust in them.`,
    exampleOutput: `Rule 3 | refund_amount, order_amount, order_id | Sum of all refund_amounts for a given order_id should never exceed that order's order_amount | Violation: SUM(refund_amount) GROUP BY order_id > order_amount | Hard block (finance reconciliation integrity) | Edge case handled: rule sums across multiple partial refunds per order rather than checking each refund row independently, so two legitimate partial refunds don't falsely trigger.
Ambiguity flagged: description doesn't say what "original order amount" means if the order was edited after purchase — confirm whether refund rules should check against the current order_amount or the amount at time of purchase.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-kpi-definition-spec-sheet',
    category: 'data-bi',
    title: `Write a KPI definition precise enough that two teams calculate it the same way`,
    description: `Produces a full KPI spec — exact formula, inclusion/exclusion rules, edge cases, and calculation cadence — so the metric doesn't quietly mean something different in two different dashboards.`,
    promptText: `Write a formal KPI definition spec for the metric below, precise enough that two different analysts working independently would compute the identical number from the same raw data.

METRIC NAME AND ROUGH INTENT
{{metric_intent}}

AVAILABLE DATA TO CALCULATE IT FROM
{{available_data}}

WHERE THIS METRIC WILL BE USED
{{usage_context}}

COMPETING DEFINITIONS ALREADY IN USE, IF ANY
{{existing_definitions}}

Write the exact formula as an equation using the actual field names from {{available_data}}, not a plain-language description of the concept — "active users" is not a definition; "COUNT(DISTINCT user_id) WHERE last_event_date >= CURRENT_DATE - 30" is. State every inclusion and exclusion rule explicitly: does the metric include internal/test accounts, does it include free-tier users if the business also has paid tiers, does it count a user who churned and came back within the window as one user or a new one. Name the calculation cadence and the point-in-time behavior — is this calculated as of end-of-day, is it a trailing window or a calendar-period snapshot, and what happens to a historical value of this metric when it's recalculated later (does day 45's number for "last 30 days" change retroactively as new data arrives, or is it locked once calculated). If {{existing_definitions}} shows this metric is already calculated differently somewhere else in the business, name the specific discrepancy between the two definitions and state which one this spec is choosing, with the reasoning, rather than adding a third silent variant to the pile. Flag any input field this formula depends on that could itself be unreliable (a last_event_date field that's known to lag by a day for one platform) as a caveat that affects how much to trust the number.

WHAT NOT TO DO
Do not write the definition as a paragraph of prose with the formula implied — the formula must be a literal expression against named fields. Do not silently resolve a conflict with an existing definition without naming that a conflict existed and what was chosen.

OUTPUT FORMAT
1. Metric name and one-sentence business intent.
2. Exact formula, as an expression against named fields.
3. Inclusion/exclusion rules, as a bullet list.
4. Calculation cadence and point-in-time/recalculation behavior.
5. Any conflict with an existing definition, and which one this spec adopts and why.
6. Known reliability caveats on the underlying data.`,
    variables: [
      {
        name: 'metric_intent',
        description: `The metric's name and the rough business idea behind it.`,
        example: `"Monthly Active Users" — meant to capture how many customers are actively using the product in a given month`,
        required: true,
      },
      {
        name: 'available_data',
        description: `The actual fields and tables this could be calculated from.`,
        example: `events table with user_id, event_type, event_timestamp, platform; users table with user_id, plan_tier, is_internal_test_account, signup_date`,
        required: true,
      },
      {
        name: 'usage_context',
        description: `Where the number will actually show up and who reads it.`,
        example: `The board deck's growth section, alongside revenue metrics, compared month over month`,
        required: true,
      },
      {
        name: 'existing_definitions',
        description: `Any other place in the business this metric is already calculated, if differently.`,
        example: `Product team's internal dashboard counts anyone with any event including passive page-loads; this new spec is meant to require a meaningful action event instead`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `kpi-definition`,
      `metric-design`,
      `data-governance`,
      `business-intelligence`,
      `reporting`,
    ],
    whyItWorks: `The single most common way KPI definitions cause organizational confusion isn't a wrong formula, it's an underspecified one that two teams each interpret slightly differently and calculate consistently within their own dashboard but inconsistently against each other's — a model asked to "define this metric" will happily produce fluent prose that sounds precise ("active users are customers who engaged with the product") while leaving every actual edge case (test accounts, churned-and-returned users, timezone of day boundaries) unresolved, which is why this prompt requires the formula to be a literal expression against named fields rather than a description, since prose can be reread two different ways but an actual SQL-shaped expression cannot. Requiring explicit inclusion/exclusion rules for test accounts, tier segmentation, and re-engaged users targets the exact list of decisions that silently vary between two teams' independently-built dashboards of the "same" metric, and none of those decisions have an objectively correct default — they're business choices that need to be made once, explicitly, and then referenced consistently rather than re-decided ad hoc by whoever happens to be writing the next query. The explicit handling of recalculation behavior (does a trailing-30-day metric's historical value shift as new data lands) matters because this is the single most common source of a metric appearing to "change" after the fact with no code change to explain it, confusing anyone who pulled the number on two different days and got two different answers for what they assumed was a fixed historical fact. Requiring an explicit conflict-resolution statement when a competing definition already exists, rather than silently producing a third version, directly prevents KPI proliferation — the well-known organizational failure mode where five teams each have their own "official" definition of the same-named metric and no single spec is treated as authoritative, because no one ever explicitly reconciled the differences when the second definition was written.`,
    exampleOutput: `Formula: COUNT(DISTINCT e.user_id) WHERE e.event_type IN ('core_action_types') AND e.event_timestamp >= DATE_TRUNC('month', CURRENT_DATE) AND u.is_internal_test_account = FALSE, joined events to users on user_id.
Inclusion/exclusion: excludes internal test accounts; includes both free and paid tiers unless a tier-specific cut is requested separately; a churned-and-returned user within the same calendar month counts once, not twice.
Conflict flagged: product dashboard counts passive page-views as "active"; this spec requires a core action event instead, producing a materially lower number — recommend product dashboard be updated to match this definition rather than maintaining two MAU figures.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-root-cause-analysis-metric-drop',
    category: 'data-bi',
    title: `Trace a sudden metric drop back to its actual cause instead of the first correlated event you notice`,
    description: `Works through a structured root-cause process for an unexplained metric drop, ruling out data artifacts and coincidental timing before committing to a causal story.`,
    promptText: `Investigate the metric drop described below the way a rigorous analyst would — ruling out boring explanations first, before reaching for an interesting causal story.

THE METRIC AND THE DROP
{{metric_and_drop}}

WHAT ELSE CHANGED AROUND THE SAME TIME
{{concurrent_changes}}

SEGMENTS OR CUTS AVAILABLE
{{available_segments}}

HOW URGENT THIS IS
{{urgency}}

Work through these checks in order, and do not skip ahead to a causal explanation before ruling out the earlier, less interesting ones.

CHECK 1 — DATA ARTIFACT
Is there any chance this drop is a measurement or pipeline issue rather than a real behavior change — a tracking change, a timezone shift in how the data is bucketed, a reporting delay that makes the most recent period look artificially low because data is still landing? State explicitly whether this can be ruled out with the information given, or whether it needs to be checked before anything else in this analysis is trustworthy.

CHECK 2 — SEASONALITY OR CALENDAR EFFECT
Could this be an expected calendar pattern (day-of-week effect, a holiday, a known seasonal dip) rather than an anomaly at all? Compare against the same period in prior cycles if that comparison is possible from what's given.

CHECK 3 — SEGMENT CONCENTRATION
Using {{available_segments}}, check whether the drop is broad-based across all segments or concentrated in one — a drop that's actually isolated to one platform, region, or user cohort has a very different likely cause than one that's uniform across everything, and averaging across segments would hide exactly this distinction.

CHECK 4 — CAUSAL CANDIDATES
Only once checks 1-3 haven't fully explained the drop, evaluate {{concurrent_changes}} as possible causes, ranked by how well the timing and the segment concentration found in Check 3 actually line up with each candidate — a change that rolled out to everyone doesn't explain a drop that's concentrated in one segment, so use Check 3's finding to filter which candidates are even plausible.

WHAT NOT TO DO
Do not jump straight to the most narratively satisfying explanation from {{concurrent_changes}} without first checking whether the drop is even real, seasonal, or segment-specific. Correlation in timing between the drop and a concurrent change is not sufficient on its own — state explicitly what additional evidence would confirm or rule out each causal candidate.

OUTPUT FORMAT
1. Check 1-3 results, one line each, with a clear "ruled out" or "can't rule out with current data" verdict.
2. Most likely causal candidate(s), ranked, with the specific evidence supporting each.
3. What additional data or check would confirm the leading candidate.
4. A one-line "do not act on this yet if..." caveat given {{urgency}}.`,
    variables: [
      {
        name: 'metric_and_drop',
        description: `What metric dropped, by how much, and over what timeframe.`,
        example: `Daily active users dropped 18% starting last Tuesday and hasn't recovered`,
        required: true,
      },
      {
        name: 'concurrent_changes',
        description: `Anything else that changed around the same time, deploys, campaigns, external events.`,
        example: `A new login flow shipped Monday night; also a competitor launched a promotional campaign that same week`,
        required: true,
      },
      {
        name: 'available_segments',
        description: `What cuts of the data you can actually check.`,
        example: `Can segment by platform (iOS/Android/web), by country, and by new vs. returning user`,
        required: true,
      },
      {
        name: 'urgency',
        description: `How much pressure there is to act before the analysis is fully confirmed.`,
        example: `Leadership wants an explanation in the next two hours for a stakeholder update`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `root-cause-analysis`,
      `data-analysis`,
      `metric-investigation`,
      `incident-analysis`,
      `business-intelligence`,
    ],
    whyItWorks: `Given both a metric drop and a list of things that changed at the same time, a model will naturally gravitate toward pairing them into a causal story, because a specific, named cause makes for a more satisfying and complete-sounding answer than "we're not sure yet" — this prompt counters that pull by hard-sequencing the investigation so that data-artifact and seasonality checks must be addressed and explicitly ruled out before the model is even allowed to evaluate the causal candidates, which mirrors the actual discipline good analysts apply and prevents the single most common root-cause mistake: confidently blaming a shipped feature for a drop that was actually a reporting lag or an ordinary weekly pattern. The segment-concentration check (Check 3) placed before the causal evaluation (Check 4) matters mechanically because it changes what evidence is even admissible for the later step — a company-wide login flow change cannot explain a drop that later analysis shows is isolated to one country, and running the segmentation check first means that finding actively filters which causal candidates get taken seriously, rather than the model evaluating each candidate in isolation and picking whichever fits the surface-level correlation best. Explicitly requiring the model to state what additional evidence would confirm the leading candidate — rather than stopping at a plausible-sounding story — reflects the actual epistemic status of a same-day root-cause analysis: correlation in timing is a hypothesis, not a conclusion, and treating it as settled before that confirming evidence exists is how organizations end up reverting a shipped feature that had nothing to do with the actual drop. The urgency-aware caveat at the end exists because time-pressured stakeholders often act on the first plausible story regardless of how it's hedged in the prose above it, so putting the "don't act on this yet" line as its own explicit, unmissable output item is what actually gets read under pressure.`,
    exampleOutput: `Check 1 (data artifact): Ruled out — pipeline shows consistent volume, no reporting lag pattern in the trailing 3 days.
Check 2 (seasonality): Ruled out — same week last year shows no comparable dip.
Check 3 (segment concentration): Drop is concentrated in Android, down 34%, while iOS and web are flat — this rules out the competitor campaign (which would hit all platforms) as the primary driver.
Leading candidate: the new login flow, shipped Monday night, appears to have an Android-specific bug. Confirming evidence needed: Android crash logs or funnel drop-off data for the new login screen specifically.
Caveat: do not attribute this to the competitor campaign in the stakeholder update — the segment data doesn't support that explanation.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-scenario-analysis-what-if-model',
    category: 'data-bi',
    title: `Build a what-if scenario model that shows its assumptions instead of one confident-looking number`,
    description: `Structures a scenario/what-if analysis around explicit, adjustable assumptions and a spread of outcomes, so the output is a decision tool rather than a single fabricated-precision forecast.`,
    promptText: `Build a scenario analysis for the decision below, structured around explicit assumptions rather than a single point estimate that hides how sensitive the answer is to what you assumed.

DECISION BEING EVALUATED
{{decision_context}}

KEY VARIABLES THAT DRIVE THE OUTCOME
{{key_variables}}

BASELINE DATA OR CURRENT STATE
{{baseline_data}}

TIME HORIZON
{{time_horizon}}

STRUCTURE
Identify the two or three variables in {{key_variables}} that the outcome is actually most sensitive to — not every variable deserves its own scenario axis, so name which ones matter enough to vary and which can be held at a reasonable fixed assumption instead. State every assumption as an explicit, numbered input (growth rate, cost per unit, adoption rate — whatever applies) with the specific value used, not folded invisibly into a formula, so anyone reviewing this can see exactly what was assumed and challenge any single input without redoing the whole model. Build three named scenarios — conservative, base case, and optimistic — each defined by a specific, stated combination of the key variables at low/expected/high values, not just three outcome numbers with no visible inputs behind them. Show the actual outcome number for each scenario, and state which scenario the current trajectory most resembles based on {{baseline_data}}, so the analysis connects to where things stand today rather than floating as three abstract hypotheticals. Identify the single assumption the outcome is most sensitive to — the one where a modest change in that one input moves the final number more than an equivalent change in any other input — since that's the one variable worth watching or de-risking most closely.

WHAT NOT TO DO
Do not produce a single "expected value" number as the headline without the three scenarios and their assumptions visible alongside it — a lone number invites false confidence in what is actually a range. Do not vary every input across every scenario if the sensitivity check shows most of them barely move the outcome; that dilutes attention away from what actually matters.

OUTPUT FORMAT
1. The 2-3 variables chosen as scenario axes, and why the others were held fixed.
2. Table: scenario | key variable values | resulting outcome.
3. Which scenario current data most resembles.
4. The single most sensitive assumption, and what a plausible swing in it does to the outcome.
5. One paragraph translating the range into a decision recommendation.`,
    variables: [
      {
        name: 'decision_context',
        description: `The actual decision this scenario analysis needs to inform.`,
        example: `Whether to open a second fulfillment warehouse in the Midwest next year`,
        required: true,
      },
      {
        name: 'key_variables',
        description: `The inputs that plausibly drive the outcome.`,
        example: `Order volume growth rate, average shipping cost saved per order, warehouse setup and lease cost, ramp-up time to full efficiency`,
        required: true,
      },
      {
        name: 'baseline_data',
        description: `What's actually known today to ground the scenarios in reality.`,
        example: `Current order volume growing 12% YoY, current average shipping cost per order is $6.40, a comparable warehouse elsewhere took 5 months to reach efficiency`,
        required: true,
      },
      {
        name: 'time_horizon',
        description: `How far out the scenario should project.`,
        example: `24 months from opening`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `scenario-analysis`,
      `forecasting`,
      `financial-modeling`,
      `decision-support`,
      `data-analysis`,
    ],
    whyItWorks: `A model asked to "model this decision" will often produce a single confident number, because a point estimate reads as more decisive and complete than a range with visible assumptions, even though the single number is actually less honest about what's genuinely known versus assumed — requiring three named scenarios with explicit, numbered assumption values forces the model to expose exactly what it's assuming rather than let those assumptions disappear into an opaque calculation, which is the entire point of a scenario analysis as a decision tool rather than a forecast. Requiring the sensitivity identification — which single assumption moves the outcome most — targets a specific and valuable piece of information that a flat three-scenario table doesn't automatically surface: knowing that the warehouse decision is mostly sensitive to ramp-up time, and much less sensitive to the shipping-cost assumption, tells the decision-maker exactly which number is worth spending more effort de-risking or verifying before committing, versus which ones can be left as reasonable estimates. Anchoring the scenarios explicitly to which one the current baseline data most resembles prevents the common failure of a scenario analysis floating as three disconnected hypotheticals with no bridge back to where things actually stand today — without that anchor, a reader has no way to judge whether the "optimistic" scenario is a stretch or already roughly on track, which is precisely the judgment the analysis exists to support. Limiting scenario axes to the two or three variables that actually matter, rather than varying every input, reflects a deliberate anti-complexity choice: a model given free rein will often vary every listed variable simultaneously to seem thorough, producing a combinatorial mess of scenarios that obscures rather than clarifies which few things the outcome is actually riding on.`,
    exampleOutput: `Scenario axes chosen: order volume growth rate and ramp-up time to efficiency — setup/lease cost held fixed since it varies little in practice.
Conservative: 8% growth, 8-month ramp → 24-month net savings: $410K.
Base case: 12% growth, 5-month ramp → 24-month net savings: $780K.
Optimistic: 16% growth, 3-month ramp → 24-month net savings: $1.15M.
Current trajectory most resembles: base case, given the 12% YoY growth already observed.
Most sensitive assumption: ramp-up time — a 2-month delay beyond the base case erases roughly 35% of projected savings, more than an equivalent swing in growth rate would.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'data-bi-analytics-qa-dashboard-audit',
    category: 'data-bi',
    title: `Audit a dashboard for the specific mistakes that make numbers look right until someone checks`,
    description: `Runs a structured QA pass over a dashboard's metric definitions, filters, and calculations, targeting the exact class of silent errors that pass a casual glance but break under a real audit.`,
    promptText: `Run a QA audit on the dashboard described below the way an experienced analyst would before it ships to a wide audience — looking specifically for the errors that look fine at a glance and only surface when someone checks the math.

DASHBOARD DESCRIPTION
{{dashboard_description}}

METRIC DEFINITIONS AS BUILT
{{metric_definitions}}

KNOWN DATA SOURCES FEEDING IT
{{data_sources}}

AUDIENCE AND STAKES
{{audience_and_stakes}}

Check each of the following categories and report a finding or an explicit "checked, no issue found" for each — do not skip a category just because nothing obvious jumped out.

1. DOUBLE-COUNTING — could any metric be summing across a join that fans out rows, inflating a total (e.g., joining orders to a one-to-many items table and then summing an order-level field, multiplying it by item count)?
2. FILTER LEAKAGE — does every chart on the dashboard apply the same date range and segment filters consistently, or could one chart be silently using a different implicit window than the one displayed in the filter control, producing numbers that don't actually correspond to what the filter appears to say?
3. DENOMINATOR MISMATCH — for any rate or percentage metric, does the numerator and denominator come from genuinely the same population and time window, or could a rate be computed from a numerator filtered one way and a denominator filtered another, producing a percentage that isn't actually measuring what it claims to?
4. TIMEZONE/BOUNDARY DRIFT — for any metric bucketed by day or month, is the timezone used for bucketing stated and consistent across all data sources feeding it, given that {{data_sources}} may log timestamps in different timezones?
5. SURVIVORSHIP OR SAMPLE BIAS — does any metric implicitly exclude a group in a way that biases the result (e.g., an "average session length" that only includes completed sessions, silently excluding the abandoned ones that would pull the average down)?

WHAT NOT TO DO
Do not report only the issues found and silently skip the categories where nothing was wrong — an audit needs to show its work on every category checked, not just the ones with findings. Do not treat a suspected issue as confirmed without stating what would need to be checked in the actual data to confirm it.

OUTPUT FORMAT
For each of the 5 categories: verdict (issue found / no issue found / can't determine from what's given) and, for any issue found, exactly what to check in the real data to confirm it and what the fix would look like.
Followed by: overall risk level given {{audience_and_stakes}}, and whether this dashboard should ship as-is, ship with a caveat noted, or be held pending fixes.`,
    variables: [
      {
        name: 'dashboard_description',
        description: `What the dashboard shows and how it's built, at a level someone unfamiliar with it could follow.`,
        example: `A revenue-by-region dashboard joining an orders table to a shipments table, with charts for total revenue, average order value, and on-time delivery rate`,
        required: true,
      },
      {
        name: 'metric_definitions',
        description: `The actual calculation logic behind each metric as currently built.`,
        example: `Total revenue = SUM(orders.amount) after joining to shipments on order_id; on-time rate = COUNT(delivered_on_time)/COUNT(all shipment rows)`,
        required: true,
      },
      {
        name: 'data_sources',
        description: `Where the underlying data comes from and any known quirks.`,
        example: `Orders table logged in UTC from the checkout system; shipments table logged in local warehouse time from a separate logistics vendor system`,
        required: true,
      },
      {
        name: 'audience_and_stakes',
        description: `Who will see this and what decisions ride on it.`,
        example: `Regional VPs use this weekly to evaluate performance bonuses tied to on-time delivery rate`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `analytics-qa`,
      `dashboard-audit`,
      `data-quality`,
      `business-intelligence`,
      `data-validation`,
    ],
    whyItWorks: `The dangerous class of dashboard bug is never the one that produces an obviously wrong number — those get caught immediately — it's the one that produces a plausible-looking number that's subtly wrong for a structural reason like a join fan-out or a mismatched denominator, and a model asked generically to "check this dashboard for errors" has no reliable way to surface those without being pointed at the specific mechanical patterns that cause them, which is why this prompt names five concrete failure categories rather than leaving the audit open-ended. Requiring an explicit verdict for every category, including "no issue found," rather than only reporting problems, matters because a report that only lists findings gives no way to distinguish "this category was checked and is clean" from "this category was never actually examined" — and for an audit specifically, that distinction is the entire deliverable, since the value of a QA pass is knowing what was actually verified, not just what happened to look wrong. The join-fan-out and denominator-mismatch checks target the two most common and most silent classes of dashboard error in practice — a one-to-many join silently multiplying an order-level total by the number of line items, or a percentage computed from a numerator and denominator drawn from subtly different filtered populations — both of which produce numbers that pass every casual sanity check because they're the right order of magnitude and move in believable directions, and neither is visible without someone specifically checking the join and filter logic, not just eyeballing the chart. The instruction to state what to check in the real data to confirm any suspected issue, rather than asserting it as confirmed, respects the actual limit of what's verifiable from a described metric definition versus an actual query result — the model can spot the structural risk pattern from the description given, but confirming it as an actual bug requires running the real numbers, and conflating those two would overstate the audit's certainty.`,
    exampleOutput: `1. Double-counting: Issue found — joining orders to shipments (likely one-to-many if an order ships in multiple packages) before summing orders.amount would inflate total revenue. Check: compare SUM(orders.amount) pre-join vs. post-join for a sample of multi-shipment orders. Fix: sum revenue from the orders table directly, join to shipments only for delivery-rate metrics.
3. Denominator mismatch: Issue found — on-time rate's denominator (all shipment rows) doesn't specify the same date filter as revenue charts. Check: confirm the date range filter applies identically to both the numerator and denominator query.
4. Timezone drift: Issue found — orders logged in UTC, shipments in local warehouse time; daily buckets could misalign by hours near midnight. Fix: standardize both to one timezone before bucketing.
Overall risk: high, given this feeds bonus calculations — recommend holding pending fixes to items 1, 3, and 4.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
