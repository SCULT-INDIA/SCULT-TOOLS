import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'finance-monthly-budget-zero-based-rebuild',
    category: 'finance',
    title: `Rebuild a personal or team monthly budget from scratch when the old spreadsheet stopped matching reality`,
    description: `Turns a rough list of income and expense line items into a zero-based monthly budget with every dollar assigned a job, plus a named list of assumptions the requester needs to confirm before trusting the numbers.`,
    promptText: `You are helping rebuild a monthly budget from zero because the existing one has drifted so far from actual spending that patching it is no longer worth it. This is a structuring exercise, not financial advice — you are organizing the requester's own numbers into a clearer shape, not telling them what they should be spending or saving.

INCOME SOURCES
{{income_sources}}

KNOWN RECURRING EXPENSES
{{recurring_expenses}}

VARIABLE SPENDING CATEGORIES
{{variable_categories}}

BUDGETING METHOD REQUESTED
{{budgeting_method}}

TIMEFRAME
{{timeframe}}

RULES
Build the budget so every dollar of listed income is assigned to a category, a savings goal, or an explicit "unassigned" line — never let a difference between income and listed expenses vanish silently. Where a recurring expense could plausibly vary month to month (utilities, variable-rate anything), flag it as an estimate rather than presenting it with the same certainty as a fixed rent or subscription figure. If the requested budgeting method (zero-based, 50/30/20, envelope, etc.) doesn't fit cleanly with the categories given — for instance a 50/30/20 split when no expense has been tagged as a "want" versus a "need" — say so explicitly and propose the smallest change needed to make the categories usable rather than forcing a fit. Do not invent an expense category the requester didn't mention just because it's common (e.g. don't add "entertainment" if it wasn't listed); ask instead. Close with a short list of every number you had to assume or estimate rather than were given directly, so the requester knows exactly what to verify against their bank statement before using this.

OUTPUT FORMAT
1. A table: category | monthly amount | fixed or estimated | % of total income.
2. The unassigned/surplus or shortfall line, called out plainly.
3. Three to five specific follow-up questions that would tighten the accuracy of this budget.
4. The assumptions list described above.`,
    variables: [
      {
        name: 'income_sources',
        description: `Every source of income for the period, with amounts.`,
        example: `Salary $5,400/month after tax, freelance design work averaging $600/month over the last 3 months.`,
        required: true,
      },
      {
        name: 'recurring_expenses',
        description: `Known fixed or semi-fixed monthly costs.`,
        example: `Rent $1,800, car payment $310, phone $65, gym $40, streaming subscriptions $38 total.`,
        required: true,
      },
      {
        name: 'variable_categories',
        description: `Spending categories that fluctuate, with a rough range if known.`,
        example: `Groceries ($400-550), dining out ($150-300), gas ($120-180).`,
        required: true,
      },
      {
        name: 'budgeting_method',
        description: `The budgeting framework the requester wants applied.`,
        example: `Zero-based — every dollar assigned somewhere, nothing left unaccounted for.`,
        required: true,
      },
      {
        name: 'timeframe',
        description: `The period this budget covers.`,
        example: `Calendar month, starting the 1st, aligned to when rent is due.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`budgeting`, `personal-finance`, `zero-based-budget`, `money-management`, `financial-planning`],
    whyItWorks: `The instruction to assign every dollar to a category or an explicit "unassigned" line closes the single most common failure mode of AI-generated budgets: the model quietly reconciling income and expenses by adjusting a category total until the math looks clean, which produces a budget that balances on paper but no longer reflects what the requester actually listed. Forcing GPT-5.1 to flag estimated versus fixed figures matters because the model has no way to know a utility bill varies seasonally unless told, and left unprompted it will present a single guessed number with the same confidence as a fixed rent figure, which is exactly the kind of false precision that makes a budget look authoritative right up until it's wrong. Refusing to invent unlisted categories addresses a specific pattern where language models pattern-match to "what a typical budget looks like" and pad in categories like entertainment or subscriptions from training-data priors rather than sticking to what the requester actually described — a fabricated category is worse than a missing one because it looks like real input. The closing assumptions list exists because a budget is only as good as the numbers behind it, and naming every place the model had to infer or estimate turns the output into a checklist the requester can verify against a bank statement rather than a black box they have to trust wholesale.`,
    exampleOutput: `Category table: Rent $1,800 (fixed, 30%), Groceries $475 (estimated, midpoint of range), Car payment $310 (fixed)... Unassigned surplus: $312/month. Assumptions: assumed freelance income averages $600 based on a 3-month sample, not guaranteed each month; assumed groceries at range midpoint since no exact figure was given.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-expense-report-anomaly-flagging',
    category: 'finance',
    title: `Turn a raw expense export into an anomaly-flagged summary before it goes to whoever approves it`,
    description: `Structures a messy expense transaction list into categorized totals and calls out specific line items that look like duplicates, out-of-policy amounts, or unexplained spikes, so the approver isn't the first person to notice a problem.`,
    promptText: `You are analyzing a raw expense transaction export to prepare it for whoever reviews or approves it — the goal is to surface anything unusual before that person has to find it themselves, not to approve or reject anything yourself.

TRANSACTION DATA
{{transaction_data}}

EXPENSE POLICY LIMITS (if any)
{{policy_limits}}

COMPARISON PERIOD
{{comparison_period}}

WHO THIS GOES TO
{{report_recipient}}

STEP 1 — CATEGORIZE
Group every transaction into a category based on merchant name and description. If a transaction's category is genuinely ambiguous from the description alone, put it in an "uncategorized — needs description" bucket rather than guessing a category that might be wrong; a wrong category is worse than an honest gap.

STEP 2 — FLAG ANOMALIES
Flag, specifically and by transaction: potential duplicate charges (same amount, same or adjacent date, similar merchant), any single transaction that exceeds a stated policy limit, and any category whose total is a significant departure from the comparison period if one was given. For every flag, state the specific reason in one line — never a vague "this looks off," always the concrete pattern that triggered it (exact duplicate amount, which limit was exceeded and by how much, percentage change versus the prior period).

STEP 3 — DO NOT DECIDE
Do not label any flagged item as fraudulent, unauthorized, or a policy violation — you don't have the context to know if it was pre-approved. Use "flagged for review" language only, and note explicitly that a flag is not a conclusion.

OUTPUT FORMAT
1. Category totals table.
2. Numbered list of flagged items, each with the specific reason.
3. Uncategorized bucket, if any, listed by transaction so they can be manually assigned.
4. One line stating how many transactions were reviewed and how many were flagged, for a quick sanity check against the source file.`,
    variables: [
      {
        name: 'transaction_data',
        description: `The raw expense transactions — date, merchant, amount, description.`,
        example: `03/02 Delta Airlines $612.40 'flight'; 03/04 Marriott $890.00 'hotel 3 nights'; 03/04 Marriott $890.00 'hotel 3 nights' (again); 03/09 Staples $1,240 'office supplies'.`,
        required: true,
      },
      {
        name: 'policy_limits',
        description: `Any per-category spending caps from company policy.`,
        example: `Meals capped at $75/day, hotel capped at $300/night, no single office supply purchase over $500 without pre-approval.`,
        required: false,
      },
      {
        name: 'comparison_period',
        description: `A prior period's totals to compare against, if useful.`,
        example: `Prior month: travel $2,100 total, office supplies $180 total.`,
        required: false,
      },
      {
        name: 'report_recipient',
        description: `Who reviews this, so tone and detail level match their context.`,
        example: `Direct manager who has to co-sign expense reports over $1,000.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`expense-analysis`, `expense-report`, `anomaly-detection`, `business-expenses`, `finance-ops`],
    whyItWorks: `Requiring a specific one-line reason for every flag rather than allowing a general "this looks unusual" forces GPT-5.1 to commit to a checkable claim — a duplicate flag names the exact matching amount and date, a limit flag names the exact limit and overage — which means the approver can verify each flag in seconds instead of having to re-derive why the model thought something looked off, and it also prevents the model from padding the flagged list with low-confidence noise just to appear thorough. The explicit instruction not to label anything fraudulent or unauthorized addresses a real risk with expense-anomaly prompts specifically: a language model pattern-matching on "duplicate charge" or "over policy limit" will readily generate accusatory language, and that framing can do real reputational damage to an employee if a duplicate charge was actually a legitimate split payment or a pre-approved exception the model has no visibility into — "flagged for review" keeps the output as a triage aid rather than a verdict. The uncategorized bucket exists because forcing every ambiguous transaction into a specific category produces a summary that looks complete but silently buries misclassified spend inside the wrong line item, which is a worse outcome for a reviewer than an honest gap they can fill in ten seconds by reading the original description.`,
    exampleOutput: `Flagged items: (1) Two Marriott charges of $890.00 on 03/04 with identical descriptions — likely duplicate entry, review before reimbursing twice. (2) Staples $1,240 exceeds the $500 pre-approval threshold for office supplies by $740 — confirm pre-approval was obtained. Reviewed 47 transactions, 2 flagged.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-cash-flow-runway-projection',
    category: 'finance',
    title: `Project cash runway from a bank balance and known inflows/outflows before a hard funding or hiring decision`,
    description: `Builds a week-by-week or month-by-month cash flow projection from a starting balance and known future transactions, surfacing the exact date the balance would go negative under stated assumptions so a runway decision isn't based on a gut feel.`,
    promptText: `You are building a cash flow projection to answer one question precisely: given the current balance and known future inflows and outflows, when does the balance run out, or how much buffer is there against that? This is a structuring tool to organize the requester's own numbers, not a substitute for advice from an accountant or financial advisor on what decision to make with the result.

STARTING CASH POSITION
{{starting_balance}}

KNOWN INFLOWS
{{known_inflows}}

KNOWN OUTFLOWS
{{known_outflows}}

PROJECTION HORIZON
{{projection_horizon}}

UNCERTAIN ITEMS
{{uncertain_items}}

BUILD RULES
Project the running balance period by period (weekly if the horizon is under 3 months, monthly otherwise) and show the balance after each period, not just a final number — the point of a runway projection is seeing the trajectory, not just the endpoint. For every uncertain item (a deal that might close, a client payment that might be late), build the projection using the conservative case as the primary scenario, and separately note what the balance would look like if the optimistic case held instead — never blend an uncertain inflow into the main projection as if it were confirmed. If the balance is projected to go negative or below a reasonable minimum buffer at any point in the horizon, state the exact period this happens in, not just "runway is tight." Do not recommend a specific action (cut costs, raise a round, delay hiring) — surface the numbers and the date they imply, and let the requester or their advisor decide what to do about it.

OUTPUT FORMAT
1. Period-by-period table: period | inflows | outflows | net | running balance.
2. Conservative-case runway date (if applicable) stated as a specific period.
3. Optimistic-case comparison, if uncertain items were provided.
4. A one-line summary of which single assumption most changes the outcome if it's wrong.`,
    variables: [
      {
        name: 'starting_balance',
        description: `The current cash position as of a known date.`,
        example: `$84,000 in the operating account as of August 1.`,
        required: true,
      },
      {
        name: 'known_inflows',
        description: `Confirmed future income with dates and amounts.`,
        example: `Client invoice #1042, $22,000, due and expected August 15.`,
        required: true,
      },
      {
        name: 'known_outflows',
        description: `Confirmed recurring or scheduled expenses with dates.`,
        example: `Payroll $38,000 on the 1st and 15th each month, office rent $4,200 on the 1st, software subscriptions $1,900/month.`,
        required: true,
      },
      {
        name: 'projection_horizon',
        description: `How far out to project.`,
        example: `16 weeks, through late November.`,
        required: true,
      },
      {
        name: 'uncertain_items',
        description: `Inflows or outflows that aren't confirmed, with a rough probability if known.`,
        example: `A second client contract worth $15,000/month that may or may not close by September — call it 50/50.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`cash-flow`, `runway`, `financial-forecasting`, `small-business-finance`, `startup-finance`],
    whyItWorks: `Requiring the model to show the running balance after every period rather than just a final runway number matters because a single end-of-horizon figure hides the actual shape of the risk — a business can look fine on a 16-week average while dipping dangerously low in week 6 because payroll and rent land the same week an expected invoice slips, and that dip is invisible unless the trajectory is shown period by period. The conservative-versus-optimistic split for uncertain items exists specifically because GPT-5.1, like most language models, will otherwise average an uncertain 50/50 inflow into the main projection as a half-weighted number, which produces a balance figure that doesn't correspond to either real-world outcome — a deal either closes or it doesn't, and blending it produces a phantom middle scenario nobody should plan around. Refusing to recommend a specific action (cut costs, raise money, delay a hire) keeps the tool inside its actual competence: the model can compute what the numbers imply given the inputs, but which trade-off to make in response depends on context the model can't see — the founder's risk tolerance, what a lender or investor would think, what's contractually committed — so recommending a decision would be presenting a guess as advice. Naming the single most decision-relevant assumption last gives the requester one thing to sanity-check with their accountant instead of a wall of numbers with no sense of which one actually matters most.`,
    exampleOutput: `Week of Aug 15: inflow $22,000, outflow $38,000 (payroll), running balance $68,000. ... Week of Oct 3 (conservative case, second contract excluded): running balance dips to $6,200 before the next invoice lands. Optimistic case (second contract closes in Sept): balance stays above $40,000 throughout. Most decision-relevant assumption: whether the second contract closes before October payroll.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-financial-statement-first-read-summary',
    category: 'finance',
    title: `Get a structured first read on a company's financial statements before a meeting where you'll be asked about them`,
    description: `Summarizes an income statement, balance sheet, and cash flow statement into the handful of numbers and trends that actually matter for the stated purpose, flagging what needs a follow-up question rather than glossing over gaps.`,
    promptText: `You are producing a first-read summary of a set of financial statements so the requester walks into a meeting or conversation prepared, not an audit opinion and not investment advice. Assume the requester has limited time to read the full statements themselves and needs the load-bearing numbers surfaced.

STATEMENTS PROVIDED
{{statements_provided}}

PURPOSE OF THIS REVIEW
{{review_purpose}}

COMPARISON PERIOD (if available)
{{comparison_period}}

SPECIFIC CONCERNS TO CHECK
{{specific_concerns}}

RULES
Organize the summary around the stated purpose, not a generic top-to-bottom recitation of every line item — if the purpose is assessing whether the company can service new debt, lead with liquidity and coverage figures; if it's evaluating growth, lead with revenue and margin trends. Call out the two or three numbers that changed the most versus the comparison period, in both absolute and percentage terms, and note when a change is driven by a one-time item (an asset sale, a write-down) rather than the ongoing business, if that's stated or inferable from a line item label — otherwise say the statements don't specify and it should be asked about directly. Never state a conclusion about the company's financial health as settled fact ("this company is in trouble" or "this is a strong business") — describe what the numbers show and what follow-up question would confirm or change that read. If a figure needed to fully answer one of the specific concerns isn't present in what was provided, say exactly what's missing rather than estimating it or answering around the gap.

OUTPUT FORMAT
1. Three to five headline numbers relevant to the stated purpose, each with context (versus prior period, versus what would be typical to ask about).
2. Notable one-time items or anomalies, if any, and how confident you are they're one-time based on what's labeled.
3. Direct answers to each specific concern, or an explicit "not answerable from what's provided" plus what's missing.
4. Three questions worth asking in the meeting based on what the statements raise but don't resolve.`,
    variables: [
      {
        name: 'statements_provided',
        description: `Which statements are included and their headline figures.`,
        example: `Income statement and balance sheet for FY2025, no cash flow statement provided. Revenue $12.4M, net income $890K, total assets $9.1M, total liabilities $6.7M.`,
        required: true,
      },
      {
        name: 'review_purpose',
        description: `Why this review is happening.`,
        example: `Deciding whether to extend this company net-60 payment terms as a new vendor.`,
        required: true,
      },
      {
        name: 'comparison_period',
        description: `A prior year or period's figures to compare against.`,
        example: `FY2024: revenue $10.1M, net income $410K.`,
        required: false,
      },
      {
        name: 'specific_concerns',
        description: `Particular questions this review needs to answer.`,
        example: `Can they comfortably carry another $150K in receivables from us for 60 days? Is the net income growth from the core business or a one-time gain?`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`financial-statements`, `financial-analysis`, `balance-sheet`, `income-statement`, `due-diligence`],
    whyItWorks: `Anchoring the summary to a stated purpose rather than a generic line-by-line walkthrough is what keeps the output usable in a time-constrained meeting — GPT-5.1's default instinct on a bare "summarize these financials" request is to work top-to-bottom through the statement structure, which surfaces plenty of technically accurate numbers that have nothing to do with the actual decision at hand and buries the two or three that do. The instruction to distinguish one-time items from ongoing business performance addresses a specific way financial summaries mislead: a net income jump driven by a one-time asset sale looks identical to a genuine margin improvement in a plain summary, and treating them the same produces a completely wrong read on trend, so the prompt forces the model to check for a label suggesting a one-time item and to say plainly when it can't tell rather than assuming continuity. Refusing to state a settled conclusion about financial health matters because "this company is in trouble" or "this is healthy" is exactly the kind of confident-sounding claim a model can produce fluently without having anywhere near the full picture — access to only two of three core statements, no forward guidance, no context on industry norms — so keeping the framing at "here's what the numbers show, here's what would confirm it" stops the summary from overstating its own certainty. The explicit "not answerable from what's provided" path exists because silently answering around a data gap (e.g., assessing debt capacity without a cash flow statement) produces a plausible-sounding but ungrounded answer, and naming the missing input is more useful than a guess dressed as analysis.`,
    exampleOutput: `Revenue up 22.8% YoY ($10.1M to $12.4M). Net income up 117% ($410K to $890K) — check whether this reflects margin improvement or a one-time item; the statement doesn't label any gain/loss line so this needs a direct question. Not answerable from what's provided: net-60 receivables capacity requires a cash flow statement or AR aging schedule, neither of which was included.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-ratio-analysis-peer-benchmark',
    category: 'finance',
    title: `Calculate and interpret a company's key financial ratios against its own history and stated peers`,
    description: `Computes liquidity, profitability, and leverage ratios from provided financial figures and explains what each one implies in plain language, without pretending a ratio in isolation proves anything about the company's overall health.`,
    promptText: `Calculate and interpret financial ratios from the figures below. This is an explanatory and organizational exercise — show the math, explain what each ratio conventionally indicates, and be explicit about the limits of ratio analysis on its own; do not present the result as a verdict on whether this is a good investment or a healthy company.

FINANCIAL FIGURES
{{financial_figures}}

RATIOS TO CALCULATE
{{ratios_requested}}

PEER OR HISTORICAL BENCHMARK
{{benchmark_data}}

INDUSTRY CONTEXT
{{industry_context}}

RULES
For every ratio, show the formula, the inputs plugged in, and the resulting number — never state a ratio value without showing the calculation, since the calculation is what lets the requester verify it against their own figures. Explain what the ratio conventionally measures in one or two plain-language sentences, avoiding textbook definitions that don't connect to this specific company's numbers. Where a benchmark or peer figure was given, state the comparison directly (above, below, roughly in line) rather than leaving the requester to eyeball two numbers next to each other. Explicitly flag when a ratio's normal range depends heavily on industry — a current ratio or inventory turnover that looks concerning in one industry is unremarkable in another — and say so rather than applying a one-size-fits-all rule of thumb if industry context was given. Never combine multiple ratios into a single overall health score or letter grade; ratios each capture one dimension and stacking them into a composite score hides which one is actually driving a concern.

OUTPUT FORMAT
1. Table: ratio | formula | calculation | result | comparison to benchmark (if given).
2. One-paragraph plain-language explanation per ratio.
3. A closing note on which one or two ratios most warrant a follow-up question, and why, given the industry context.`,
    variables: [
      {
        name: 'financial_figures',
        description: `The raw balance sheet and income statement figures needed for the ratios.`,
        example: `Current assets $2.1M, current liabilities $1.4M, total debt $3.8M, total equity $2.9M, net income $610K, revenue $8.2M, inventory $650K, COGS $5.1M.`,
        required: true,
      },
      {
        name: 'ratios_requested',
        description: `Which specific ratios to compute.`,
        example: `Current ratio, debt-to-equity, net profit margin, inventory turnover.`,
        required: true,
      },
      {
        name: 'benchmark_data',
        description: `Peer company or historical figures to compare against.`,
        example: `Industry average current ratio 1.8, debt-to-equity 1.1; this company last year: current ratio 1.3, debt-to-equity 1.6.`,
        required: false,
      },
      {
        name: 'industry_context',
        description: `The industry, since normal ratio ranges vary widely by sector.`,
        example: `Mid-size grocery distributor — thin margins and high inventory turnover are typical for this sector.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`ratio-analysis`, `financial-ratios`, `benchmarking`, `financial-metrics`, `corporate-finance`],
    whyItWorks: `Requiring the formula and plugged-in inputs alongside every result, rather than just the final ratio, matters because a ratio calculation is exactly the kind of arithmetic where a language model can silently transpose a numerator and denominator or use the wrong period's figure, and showing the full calculation is what lets the requester catch that error against their own source numbers instead of trusting an opaque output. The instruction to flag industry-dependence explicitly rather than applying a universal rule of thumb addresses a specific and common misreading of ratio analysis: a current ratio of 1.3 reads as concerning by a generic "should be above 2.0" textbook rule, but is unremarkable for a grocery distributor with fast inventory turns and predictable receivables, so without the industry caveat the model would otherwise apply a one-size-fits-all threshold that actively misleads in exactly the cases where sector context matters most. Refusing to combine ratios into a composite score or letter grade is the most load-bearing rule in this prompt: a single "financial health score" is a lossy compression that hides which dimension — liquidity, leverage, or profitability — is actually driving a concern, and GPT-5.1 will readily generate a confident-sounding composite grade if asked to synthesize, which converts several honestly separate signals into one false sense of settled judgment. Keeping each ratio's explanation grounded in this company's actual numbers rather than a generic textbook definition also prevents the output from reading as filler copied from a finance glossary rather than analysis of the specific figures given.`,
    exampleOutput: `Current ratio: $2.1M / $1.4M = 1.50, versus industry average 1.8 (below) and last year's 1.3 (improved). This measures short-term ability to cover liabilities with liquid assets. For a grocery distributor with fast inventory turnover, 1.50 is likely adequate despite trailing the industry average — worth confirming against typical payment terms with suppliers.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-company-analysis-competitive-position-brief',
    category: 'finance',
    title: `Structure a company analysis brief around what actually differentiates it from named competitors`,
    description: `Organizes public information about a company's business model, financials, and competitive position into a decision-ready brief, built around explicit comparisons to named competitors rather than a generic company overview.`,
    promptText: `Structure a company analysis brief. Purpose: {{analysis_purpose}}. This is a research organization exercise using the information provided plus what you already know from training — not a real-time data pull, so flag anything that may be outdated and ask for current figures on the specific numbers that matter most for the stated purpose.

COMPANY
{{company_name}}

WHAT I ALREADY KNOW / HAVE GATHERED
{{known_information}}

NAMED COMPETITORS
{{named_competitors}}

KEY QUESTIONS THIS BRIEF NEEDS TO ANSWER
{{key_questions}}

Structure the brief in this order: (1) a two-sentence positioning statement — what this company actually sells and to whom, stated concretely rather than as marketing language lifted from its own materials; (2) a direct, named comparison against each competitor listed, one differentiator and one disadvantage per competitor, not a generic strengths/weaknesses list that could apply to any company in the sector; (3) the financial or operational signals available that are most relevant to the stated purpose, clearly separating anything from the provided information versus anything from general background knowledge, and flagging your knowledge cutoff limitation explicitly wherever a current figure (stock price, latest quarter's revenue, recent funding round) would materially change the analysis; (4) direct answers to the key questions listed, or an explicit statement of what current data would be needed to answer them properly. Do not present a stale or possibly outdated figure as if it were current — mark it as "as of my training data" or "as provided" wherever precision matters. Do not recommend an investment action; this is a positioning and structure exercise, not investment advice.

OUTPUT FORMAT
1. Positioning statement.
2. Competitor-by-competitor comparison table: competitor | this company's edge | this company's disadvantage.
3. Relevant signals, source-tagged (provided vs. background knowledge vs. needs current data).
4. Answers to key questions, or explicit data gaps.`,
    variables: [
      {
        name: 'analysis_purpose',
        description: `Why this brief is being written.`,
        example: `Prepping for a partnership conversation — need to understand where this company sits relative to two potential alternative partners.`,
        required: true,
      },
      {
        name: 'company_name',
        description: `The company being analyzed.`,
        example: `A mid-size logistics software vendor.`,
        required: true,
      },
      {
        name: 'known_information',
        description: `Whatever specific facts, figures, or documents the requester already has.`,
        example: `Their pricing page, a recent product announcement, and last year's stated customer count of 1,200 mid-market clients.`,
        required: false,
      },
      {
        name: 'named_competitors',
        description: `The specific competitors to compare against.`,
        example: `Two named logistics software competitors in the same mid-market segment.`,
        required: true,
      },
      {
        name: 'key_questions',
        description: `The specific things this brief needs to resolve.`,
        example: `Do they have a meaningfully different integration approach than the two competitors? Is their customer base concentrated in one vertical?`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`company-analysis`, `competitive-analysis`, `business-research`, `market-positioning`, `due-diligence`],
    whyItWorks: `Forcing a named, per-competitor comparison rather than a generic SWOT-style list is what makes the brief specific rather than interchangeable — a strengths/weaknesses list written without a named competitor in the sentence tends to read as boilerplate that could apply to any company in the category, while "here is exactly what this company does better and worse than competitor X specifically" forces a real comparison the model can't fake without engaging the actual details given. The source-tagging requirement (provided information vs. background knowledge vs. needs current data) is the most important mechanical safeguard here: GPT-5.1's training data has a cutoff, and financial or competitive positioning can shift meaningfully in months, so a company analysis that blends a possibly stale funding figure or headcount number in with fresh information the requester just supplied — without marking which is which — creates a false sense that everything in the brief is equally current when some of it may be a year or more out of date. Explicitly refusing to give investment advice keeps the brief in its actual lane: structuring and organizing a competitive picture is something the model can do well from provided and general knowledge, but recommending a financial action requires real-time data, risk tolerance, and legal considerations well outside what a training-data snapshot and a prompt can respons­ibly provide. The explicit data-gap section at the end converts "the model doesn't know" from a silent failure into a specific, actionable next step — a list of exactly what to go look up.`,
    exampleOutput: `Positioning: sells routing and dispatch software to mid-market trucking fleets, priced per-vehicle rather than per-seat. Versus Competitor A: edge — deeper integration with common ELD hardware; disadvantage — smaller customer base limits network-effect data for route optimization. Flag: 1,200 customer figure is as provided by requester, not independently verified or current.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-investment-research-structured-thesis-organizer',
    category: 'finance',
    title: `Organize your own investment research into a structured thesis with the counter-arguments named explicitly`,
    description: `Takes the notes, numbers, and reasoning a requester has already gathered about an investment idea and organizes them into a structured thesis with an explicit bear case, without ever telling the requester what to buy, sell, or hold.`,
    promptText: `IMPORTANT SCOPE NOTE: You are a research-organization aid, not a financial advisor. Do not recommend buying, selling, or holding anything, do not state a price target, and do not predict future performance. Your job is to take the requester's own research and reasoning and structure it clearly, including surfacing the strongest counter-argument to their own thesis — the analysis and any conclusion belongs to the requester (ideally after consulting a licensed financial advisor for anything they intend to act on), not to you.

WHAT I'M CONSIDERING
{{investment_idea}}

MY RESEARCH AND REASONING SO FAR
{{research_notes}}

WHAT I'M UNCERTAIN ABOUT
{{uncertainties}}

TIME HORIZON I'M THINKING IN
{{time_horizon}}

STRUCTURE THE THESIS AS:
1. Bull case — organize the requester's own reasoning into a clear, structured argument, without adding new facts or figures the requester didn't provide or that you can't clearly label as background knowledge versus their input.
2. Bear case — construct the strongest good-faith counter-argument to this specific thesis, addressing the actual reasoning given rather than a generic list of risks that could apply to any investment ("markets can go down" is not useful; the specific mechanism by which this thesis could be wrong is).
3. What would change the answer — name the one or two pieces of information or events that, if they turned out differently than assumed, would most undermine the bull case.
4. Open questions — the uncertainties the requester listed, restated as specific, answerable research questions rather than left as vague doubts.

At the end, include a plain-stated line: this is a research-organization tool, not investment advice, and any actual decision should involve a licensed financial advisor and the requester's own risk tolerance, not this output.

OUTPUT FORMAT
Follow the four sections above in order, each clearly labeled, ending with the disclaimer line.`,
    variables: [
      {
        name: 'investment_idea',
        description: `What the requester is considering, in their own words.`,
        example: `Adding to an existing position in a mid-cap renewable energy company ahead of an expected policy announcement.`,
        required: true,
      },
      {
        name: 'research_notes',
        description: `The requester's own reasoning, numbers, and sources gathered so far.`,
        example: `Company's last three quarters showed revenue growth accelerating; a policy tailwind is expected within 6 months based on public statements from regulators; my read is the market hasn't priced this in yet.`,
        required: true,
      },
      {
        name: 'uncertainties',
        description: `What the requester is unsure about in their own thesis.`,
        example: `Not sure how much of the expected growth is already priced into the current valuation, and not sure how reliable the policy timeline actually is.`,
        required: true,
      },
      {
        name: 'time_horizon',
        description: `How long the requester is thinking of holding this idea.`,
        example: `12-18 months.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`investment-research`, `financial-analysis`, `due-diligence`, `risk-analysis`, `investing`],
    whyItWorks: `The explicit instruction to build the bull case only from the requester's own provided reasoning, without adding new facts the model supplies from its own knowledge, is the key safeguard against a specific failure mode of investment-research prompts: a model asked to "strengthen my thesis" will readily generate supporting facts and figures that sound plausible but may be outdated, wrong, or simply invented, and presenting those as if they carry the same weight as the requester's actual research would quietly convert a research-organization aid into a source of fabricated financial claims. Requiring the bear case to address the specific mechanism of this thesis rather than generic market risk is what makes the counter-argument actually useful — GPT-5.1's default instinct on an open-ended "what could go wrong" prompt is to list universal disclaimers ("markets are volatile," "past performance doesn't guarantee future results") that are true of literally every investment and therefore inform the decision not at all; forcing engagement with the specific reasoning given (is the growth already priced in, is the policy timeline reliable) produces a counter-argument that could actually change the requester's mind. The hard refusal to name a price target, predict performance, or recommend an action isn't just a legal hedge — it reflects a real epistemic limit: the model has no live market data, no view of the requester's full portfolio or risk tolerance, and no way to verify whether its training-era information about the company is still accurate, so any specific buy/sell/hold recommendation would be a confident-sounding guess dressed as analysis. The final disclaimer line keeps that scope boundary visible in the actual output the requester reads, not just in the prompt they wrote.`,
    exampleOutput: `Bull case: revenue acceleration across three quarters combined with an anticipated policy tailwind suggests upside not yet reflected in price, per your research. Bear case: if the market has already priced in policy expectations via analyst forward estimates, the acceleration may already be reflected in current valuation, meaning the catalyst you're anticipating could be a 'sell the news' event rather than a re-rating. What would change the answer: confirmation of whether current valuation multiples already assume the policy change, and how firm the regulatory timeline actually is versus speculative. This is a research-organization tool, not investment advice; consult a licensed financial advisor before acting.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-stock-research-checklist-gap-finder',
    category: 'finance',
    title: `Run your own stock research against a structured checklist and get told exactly what's still missing`,
    description: `Takes whatever research a requester has already done on a stock and checks it against a structured due-diligence checklist, flagging gaps by name instead of generating a generic research template from scratch.`,
    promptText: `You are checking existing stock research against a structured due-diligence checklist to find what's missing, not writing a fresh research report and not telling the requester whether to invest. This is a gap-analysis exercise on the requester's own work.

STOCK / COMPANY
{{ticker_or_company}}

RESEARCH I'VE ALREADY DONE
{{existing_research}}

CHECKLIST AREAS TO COVER
{{checklist_areas}}

SPECIFIC RISK FACTORS I WANT CHECKED
{{risk_factors}}

For each checklist area, do one of three things: (a) if the existing research clearly covers it, say so and briefly restate what was found; (b) if the existing research touches on it but leaves an obvious gap (a number mentioned without its trend, a competitor named without a comparison), name the specific gap; (c) if the existing research doesn't address it at all, say so plainly rather than filling the gap yourself with unverified information — flag it as "not yet researched" and note what specifically should be looked up (e.g. "check the 10-K's risk factors section for supplier concentration" rather than a vague "do more research"). Do not generate new financial figures, price estimates, or forward projections to fill any gap — your job is to identify where the requester's own research is thin, not to substitute your own numbers for missing ones. For each specific risk factor listed, state directly whether the existing research addresses it, partially addresses it, or doesn't touch it at all.

OUTPUT FORMAT
1. Checklist table: area | status (covered / partial gap / not researched) | note.
2. Risk factor check: each listed risk factor | addressed / partial / not addressed | what's missing if not fully addressed.
3. A prioritized list of the three most important gaps to close before this research would be considered reasonably complete for the requester's own stated purpose.`,
    variables: [
      {
        name: 'ticker_or_company',
        description: `The stock or company being researched.`,
        example: `A mid-cap industrial equipment manufacturer.`,
        required: true,
      },
      {
        name: 'existing_research',
        description: `Everything the requester has already gathered and concluded.`,
        example: `Revenue has grown 8% annually for 3 years, gross margin around 34%, management owns about 12% of shares, main competitor is a larger diversified conglomerate.`,
        required: true,
      },
      {
        name: 'checklist_areas',
        description: `The standard due-diligence categories to check against.`,
        example: `Revenue quality and trend, competitive moat, management incentive alignment, balance sheet strength, valuation context.`,
        required: true,
      },
      {
        name: 'risk_factors',
        description: `Specific risks the requester wants explicitly checked.`,
        example: `Customer concentration (do they rely on one or two large clients), exposure to raw material price swings, debt maturity schedule.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`stock-research`, `due-diligence-checklist`, `investment-research`, `risk-assessment`, `equity-analysis`],
    whyItWorks: `The rule against generating new financial figures or filling a gap with the model's own numbers is the load-bearing constraint in this prompt, because a gap-analysis tool that quietly writes in plausible-sounding figures to complete a thin checklist item stops being a gap analysis and becomes a fabricated research report the requester might mistake for verified information — the entire value of the exercise depends on the boundary between "here's what you found" and "here's what's still missing" staying visible rather than getting blurred. Requiring a specific next action for every "not researched" flag ("check the 10-K's risk factors section for supplier concentration" rather than "do more research") matters because GPT-5.1 defaults to vague encouragement when it doesn't have a concrete instruction to be specific, and a checklist that just says "needs more work" everywhere gives the requester no actual direction on where their next hour of research time should go. The three-tier status system (covered / partial gap / not researched) is more useful than a binary done/not-done because most real research lands in the partial category — a number mentioned without its trend, a competitor named without a direct comparison — and collapsing that into a binary would either overstate how complete the research is or understate genuine partial progress already made. Checking named risk factors separately from the general checklist areas ensures that specific concerns the requester cares about (customer concentration, debt maturity) don't get lost inside a generic due-diligence template that wasn't built around this particular company's actual risk profile.`,
    exampleOutput: `Competitive moat: partial gap — you've named the main competitor but haven't compared market share, pricing power, or switching costs between the two. Customer concentration risk: not addressed — check the 10-K's customer concentration disclosure or investor presentation for revenue-by-customer breakdown. Top 3 gaps to close: customer concentration data, debt maturity schedule, and a direct valuation comparison against the named competitor.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-portfolio-holdings-concentration-review',
    category: 'finance',
    title: `Review a list of portfolio holdings for concentration and overlap risk before rebalancing`,
    description: `Analyzes a list of current holdings for sector, single-stock, and fund-overlap concentration, surfacing where risk is more bunched up than it might look at first glance, without recommending specific trades.`,
    promptText: `You are reviewing a portfolio's current holdings for concentration risk — structural exposure that's more bunched together than it might appear at a glance — not recommending what to buy, sell, or how to rebalance. This is a diagnostic, not a trading plan.

CURRENT HOLDINGS
{{current_holdings}}

APPROXIMATE POSITION SIZES
{{position_sizes}}

WHAT PROMPTED THIS REVIEW
{{review_trigger}}

KNOWN OVERLAP CONCERNS
{{overlap_concerns}}

CHECK FOR, IN ORDER:
1. Single-position concentration — any individual holding representing an outsized share of the total portfolio, stated as a specific percentage.
2. Sector or theme concentration — holdings that look diversified by name but share the same underlying sector or economic driver (e.g. multiple tech-adjacent positions, multiple holdings all exposed to the same commodity price).
3. Fund overlap — if any holdings are index funds or ETFs, note where their underlying holdings likely overlap significantly with each other or with individually held stocks, based on what's typically known about those funds' composition, and flag this as an estimate since you don't have their live current constituent lists.
4. Currency or geographic concentration, if relevant to what was listed.

For each concentration flagged, state the approximate percentage of the portfolio it represents and why it counts as concentration (shared sector, shared underlying driver, overlapping fund holdings) rather than just naming the positions. Do not recommend a specific trim, sale, or rebalancing trade — describe the concentration and let the requester or their advisor decide what, if anything, to do about it. If fund composition would need to be checked against a live prospectus or fact sheet to confirm a suspected overlap, say so explicitly rather than asserting it as fact.

OUTPUT FORMAT
1. Concentration findings, ordered by size of exposure, each with an approximate percentage and the reason it counts as concentrated.
2. A summary line: total portfolio percentage tied up in the single largest concentration theme found.
3. What would need to be verified (e.g., a fund's current holdings) to confirm any estimate-based flags.`,
    variables: [
      {
        name: 'current_holdings',
        description: `The full list of positions in the portfolio.`,
        example: `35% in a broad total-market index fund, 15% in a single large tech company stock, 12% in a semiconductor-sector ETF, 10% in a second individual tech stock, remainder spread across bonds and cash.`,
        required: true,
      },
      {
        name: 'position_sizes',
        description: `Approximate dollar or percentage size of each holding.`,
        example: `Total portfolio value roughly $180,000; percentages as listed above.`,
        required: true,
      },
      {
        name: 'review_trigger',
        description: `What prompted this review right now.`,
        example: `Portfolio hasn't been reviewed in about two years and has grown unevenly since then.`,
        required: false,
      },
      {
        name: 'overlap_concerns',
        description: `Any specific overlap the requester already suspects.`,
        example: `Suspect the tech stock and the semiconductor ETF are more correlated than they look.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`portfolio-review`, `concentration-risk`, `asset-allocation`, `portfolio-management`, `investing`],
    whyItWorks: `Separating the four concentration checks (single-position, sector/theme, fund overlap, currency/geography) into an explicit sequence matters because the most dangerous concentration in a portfolio is usually the kind that doesn't look like concentration on a simple list — a portfolio with five differently-named holdings can still be one large bet on a single sector, and a model asked generically to "review this portfolio" will often just restate the position list back with commentary rather than actively hunting for the shared underlying driver across positions that look diversified by name alone. Flagging fund-overlap estimates explicitly as estimates, with an instruction to name what would need checking against a live prospectus, is necessary because GPT-5.1 has no real-time access to a fund's current constituent list, which changes over time, so asserting a specific overlap percentage as fact would be presenting a training-data-era approximation with false precision — naming it as an estimate to be verified keeps the flag useful without overstating its certainty. Refusing to recommend a specific trim or rebalancing trade keeps the tool inside honest bounds: how to respond to a concentration risk depends on the requester's tax situation, risk tolerance, and time horizon, none of which a portfolio list alone reveals, and a specific trade recommendation would be advice the model isn't positioned to respons­ibly give. Requiring an approximate percentage for every flagged concentration, not just a qualitative "this looks heavy," is what turns the review into something actionable — a requester can decide for themselves whether 35% in one theme is acceptable, but only if the number is stated rather than implied.`,
    exampleOutput: `Sector concentration: the individual tech stock (15%), second tech stock (10%), and semiconductor ETF (12%) together represent roughly 37% of the portfolio with meaningful shared exposure to the same technology and chip-demand cycle, even though they're three separate line items. Estimate flag: exact overlap between the semiconductor ETF's holdings and the individual stocks would need checking against the ETF's current fact sheet to confirm the degree of double-counting.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-scenario-analysis-three-case-model',
    category: 'finance',
    title: `Build a best/base/worst case scenario model around one specific financial decision`,
    description: `Structures a three-case scenario analysis around a stated decision, forcing each case to change one clearly named variable rather than producing three vaguely different vibes labeled optimistic, likely, and pessimistic.`,
    promptText: `Build a three-case scenario model — best, base, and worst — around the specific decision below. This is a structuring exercise to organize the requester's own assumptions clearly, not a prediction of what will actually happen.

DECISION BEING EVALUATED
{{decision_context}}

BASE CASE ASSUMPTIONS
{{base_assumptions}}

KEY VARIABLE THAT DRIVES THE OUTCOME
{{key_variable}}

WHAT'S BEING MEASURED
{{output_metric}}

BUILD RULES
Identify the one or two variables that most drive the outcome (the key variable given, plus any other the base assumptions imply matters) and change only those between the three cases — do not let unrelated assumptions drift between cases for no stated reason, since a scenario analysis is only useful if the reader can see exactly what's different between cases and why. For each case, state the specific value each key variable takes, not just a label like "optimistic" — a scenario without a stated number for its key driver isn't a scenario, it's a mood. Show the resulting output metric for all three cases using the same calculation method, so the three results are genuinely comparable rather than each computed a slightly different way. State explicitly which case you're treating as most likely to occur, if the requester's assumptions imply one, or say that likelihood wasn't specified and all three should be weighed without an assumed probability. Do not present the base case as a forecast or promise — it is one plausible path built from stated assumptions, not a prediction endorsed with confidence.

OUTPUT FORMAT
1. Table: case | key variable value(s) | resulting output metric | one-line rationale for why this variable value represents this case.
2. A sensitivity note: how much the output metric changes per unit change in the key variable, so the requester can see how sensitive the whole model is to that one number being off.
3. What this model does not account for — factors outside the stated assumptions that could still change the outcome.`,
    variables: [
      {
        name: 'decision_context',
        description: `The specific decision this scenario analysis is meant to inform.`,
        example: `Whether to open a second retail location given uncertain foot traffic in the new area.`,
        required: true,
      },
      {
        name: 'base_assumptions',
        description: `The core assumptions behind the most likely case.`,
        example: `Expected monthly foot traffic of 4,000, conversion rate of 8%, average sale $34, fixed monthly costs for the new location $9,200.`,
        required: true,
      },
      {
        name: 'key_variable',
        description: `The single variable that most drives the result, which will differ between cases.`,
        example: `Monthly foot traffic — could range from 2,500 (worst case, slow area) to 6,000 (best case, if a nearby anchor store draws more people than expected).`,
        required: true,
      },
      {
        name: 'output_metric',
        description: `What number the scenario analysis should ultimately produce.`,
        example: `Monthly net profit or loss for the new location.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`scenario-analysis`, `financial-modeling`, `sensitivity-analysis`, `business-planning`, `decision-making`],
    whyItWorks: `The rule that only the stated key variables should change between cases, with everything else held constant, is what prevents scenario analysis from collapsing into three vaguely different narratives — a common failure mode where an "optimistic" case quietly assumes better foot traffic AND lower costs AND a shorter ramp-up period all at once, which makes it impossible to tell afterward which assumption actually drove the better outcome. Requiring a specific numeric value for the key variable in every case, not a label like "optimistic" or "pessimistic" on its own, forces GPT-5.1 past the point where it could otherwise produce three qualitatively different-sounding paragraphs without any of them being pinned to a number the requester could actually check their real-world outcome against later. The sensitivity note — how much the output moves per unit change in the key variable — exists because the real value of a three-case model isn't the three numbers themselves, it's understanding how fragile the base case is to being wrong about one assumption; a model that shows profit swinging wildly with a small change in foot traffic tells the requester this decision is far riskier than one that stays roughly profitable across a wide range, and that's a different piece of information than the three headline numbers alone convey. Refusing to present the base case as a forecast or promise matters because a three-case model built from the requester's own assumptions is only as good as those assumptions — the model has no independent way to verify that 4,000 monthly visitors is realistic for this specific location, so treating the base case as a confident prediction rather than one plausible path would overstate what the exercise actually establishes.`,
    exampleOutput: `Worst case: 2,500 monthly visitors -> net loss of roughly $1,900/month. Base case: 4,000 visitors -> net profit of roughly $1,700/month. Best case: 6,000 visitors -> net profit of roughly $6,900/month. Sensitivity: each additional 500 monthly visitors adds approximately $1,360 to monthly profit at the stated conversion rate and average sale — the model is highly sensitive to foot-traffic assumptions, which weren't independently verified.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-break-even-point-calculator-walkthrough',
    category: 'finance',
    title: `Calculate the break-even point for a new product or offering and show exactly how sensitive it is to price`,
    description: `Computes the break-even unit volume and revenue for a new product line from fixed costs, variable costs, and price, then shows how the break-even point shifts if price or cost assumptions change, instead of handing over a single static number.`,
    promptText: `Calculate the break-even point for the offering described below, and show how sensitive that number is to the assumptions behind it — a single break-even figure without sensitivity context is easy to misread as more certain than it is.

FIXED COSTS
{{fixed_costs}}

VARIABLE COST PER UNIT
{{variable_cost_per_unit}}

PLANNED SELLING PRICE
{{selling_price}}

UNCERTAIN COST OR PRICE ASSUMPTIONS
{{uncertain_assumptions}}

STEP 1 — BASE CALCULATION
Show the contribution margin per unit (price minus variable cost), then the break-even unit volume (fixed costs divided by contribution margin) and break-even revenue, with the formula and inputs shown at each step so the math can be checked line by line.

STEP 2 — SENSITIVITY
Recalculate break-even volume for a 10% and 20% swing in the selling price (both up and down) and, separately, for the same swings in variable cost per unit, holding the other variable constant in each case. Present this as a small table so the requester can see at a glance how much the break-even point moves for a given change in either lever, rather than just describing the sensitivity in prose.

STEP 3 — CONTEXT CHECK
If any uncertain assumptions were listed, state plainly which one, if it turned out wrong, would move the break-even point the most — the single input worth double-checking before relying on this number. Do not state a specific timeframe for reaching break-even volume (e.g. "you'll hit this in 4 months") unless the requester has provided an expected sales rate; if no sales rate was given, say the timeframe isn't calculable from what's provided rather than guessing one.

OUTPUT FORMAT
1. Base case: contribution margin, break-even units, break-even revenue, with formulas shown.
2. Sensitivity table: price/cost change | new break-even units | % change from base.
3. The single most consequential uncertain assumption, named directly.
4. Explicit note on timeframe-to-break-even being uncalculable if no sales rate was given.`,
    variables: [
      {
        name: 'fixed_costs',
        description: `Total fixed costs for the period being analyzed.`,
        example: `$45,000 for initial tooling, setup, and the first year's fixed licensing fee.`,
        required: true,
      },
      {
        name: 'variable_cost_per_unit',
        description: `The cost that scales with each unit sold.`,
        example: `$18 per unit (materials, packaging, and per-unit shipping).`,
        required: true,
      },
      {
        name: 'selling_price',
        description: `The planned price per unit.`,
        example: `$42 per unit.`,
        required: true,
      },
      {
        name: 'uncertain_assumptions',
        description: `Any cost or price input the requester isn't fully confident in.`,
        example: `Not fully sure the $18 per-unit cost will hold if a key supplier raises prices, which they've hinted at.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`break-even-analysis`, `unit-economics`, `pricing-strategy`, `financial-modeling`, `small-business-finance`],
    whyItWorks: `Requiring the sensitivity table as a mandatory second step, not an optional add-on, is what stops the output from being a single static number that looks more certain than it is — a break-even figure on its own invites the reader to treat it as fixed, when in reality a 10% price cut (a common early-stage pricing adjustment) might move the break-even volume by a much larger percentage than 10%, and that nonlinearity is exactly the kind of thing that's invisible until it's shown side by side in a table. Holding one variable constant while varying the other in each sensitivity pass, rather than varying both simultaneously, is a deliberate simplification that keeps the table readable and interpretable — varying both price and cost together would produce a matrix of scenarios that's more mathematically complete but harder to read at a glance, and for a first-pass break-even sensitivity check, isolating one lever at a time is the more useful default. The refusal to state a break-even timeframe without a given sales rate addresses a specific pattern where GPT-5.1, asked for a break-even analysis, will often helpfully add "at this rate you should break even in about 6 months" by silently assuming a sales velocity that was never actually provided — that fabricated assumption can be more consequential to a business decision than the break-even unit count itself, since it implies a specific runway need, so refusing to guess it and instead flagging the missing input keeps the output honest about what it can and can't calculate from what was given.`,
    exampleOutput: `Contribution margin: $42 - $18 = $24/unit. Break-even units: $45,000 / $24 = 1,875 units. Break-even revenue: 1,875 x $42 = $78,750. Sensitivity: a 10% price cut to $37.80 raises break-even units to roughly 2,273 (+21%) — the break-even point is more sensitive to price than the percentage price change itself. Most consequential uncertain assumption: the per-unit cost holding at $18 if the supplier raises prices as hinted.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-unit-economics-per-customer-teardown',
    category: 'finance',
    title: `Tear down per-unit or per-customer economics to find out if growth is actually making money or just making revenue`,
    description: `Breaks a business's per-unit or per-customer economics down into every cost that actually attaches to serving one more customer, distinguishing genuinely variable costs from costs that just feel variable, so growth decisions aren't made on a number that's quietly wrong.`,
    promptText: `You are tearing down the unit economics of one customer or one unit of the offering described below — the goal is finding out whether each additional customer is genuinely profitable on a fully-loaded basis, not just contributing revenue that looks good until the fixed costs it's actually eating into get counted somewhere else.

WHAT ONE "UNIT" IS
{{unit_definition}}

REVENUE PER UNIT
{{revenue_per_unit}}

COSTS I'VE ALREADY IDENTIFIED AS VARIABLE
{{identified_variable_costs}}

COSTS THAT MIGHT BE PARTIALLY VARIABLE
{{ambiguous_costs}}

GO THROUGH THIS SEQUENCE:
1. Confirm which of the identified variable costs are genuinely variable (scale directly with each additional unit) versus actually step-fixed (only increase in chunks, like needing to hire one more support person per 200 customers rather than a smooth per-customer cost) — a step-fixed cost misclassified as fully variable understates true unit economics at the margin right before the next step.
2. For each ambiguous cost listed, make a specific call: genuinely variable, step-fixed, or fixed, and state the reasoning in one line rather than leaving it unresolved.
3. Calculate contribution margin per unit using only the costs confirmed as genuinely variable, then separately show what the margin looks like if the step-fixed costs are averaged in at current volume — label this second number clearly as volume-dependent, since it will look worse as volume approaches the next step threshold.
4. Flag if the revenue-per-unit figure includes any one-time revenue (a setup fee, an upfront payment) that won't recur — blending one-time and recurring revenue into a single per-unit figure overstates the ongoing economics.

Do not conclude whether the business overall is profitable — this is a per-unit teardown, and overall profitability also depends on fixed costs and volume that aren't part of this specific calculation. State that boundary explicitly.

OUTPUT FORMAT
1. Cost classification table: cost | genuinely variable / step-fixed / fixed | reasoning.
2. Contribution margin per unit (variable costs only) and the volume-adjusted margin (including step-fixed costs at current volume).
3. One-time revenue flag, if applicable.
4. Explicit statement that this doesn't determine overall business profitability on its own.`,
    variables: [
      {
        name: 'unit_definition',
        description: `What exactly counts as one unit for this analysis.`,
        example: `One subscribing customer on the standard monthly plan.`,
        required: true,
      },
      {
        name: 'revenue_per_unit',
        description: `The revenue generated per unit, noting any one-time components.`,
        example: `$49/month recurring, plus a one-time $99 onboarding fee at signup.`,
        required: true,
      },
      {
        name: 'identified_variable_costs',
        description: `Costs the requester already believes are variable.`,
        example: `Cloud hosting cost per active user ($3.20/month), payment processing fees (2.9% + $0.30 per transaction).`,
        required: true,
      },
      {
        name: 'ambiguous_costs',
        description: `Costs the requester isn't sure how to classify.`,
        example: `Customer support staffing — currently 1 support rep per roughly 250 customers; and a shared data pipeline cost that increases in server-cluster increments.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`unit-economics`, `cost-analysis`, `financial-modeling`, `saas-metrics`, `profitability-analysis`],
    whyItWorks: `The distinction between genuinely variable and step-fixed costs is the entire point of this prompt and the thing most unit-economics summaries get wrong by default — a cost like customer support staffing doesn't smoothly increase with each new customer, it jumps in discrete chunks (one more hire per 250 customers), so treating it as a smooth per-unit cost either overstates margin at 249 customers or understates it right after the 251st hire, and neither treatment reflects what actually happens to cash flow at the margin. Requiring a one-line reasoning for every ambiguous cost classification, rather than letting the model quietly default one way, matters because GPT-5.1 will otherwise often just average an ambiguous cost into a per-unit figure without flagging that the underlying cost structure is lumpy, which produces a contribution margin that looks precise but hides a meaningfully different number depending on exactly how close the business is to its next staffing or infrastructure threshold. Separating the fully-variable margin from the volume-adjusted margin that includes step-fixed costs gives the requester two honestly different numbers instead of one blended figure that obscures which scenario they're actually in — near a threshold, the volume-adjusted number is the one that matters, and collapsing the two into one average would hide exactly the information a growth decision needs. The one-time-revenue flag exists because a business's own booked revenue figures often bundle a one-time onboarding or setup fee into what looks like a steady per-unit number, and that one-time boost makes month-one unit economics look meaningfully better than the ongoing, recurring reality — separating them keeps the growth decision honest about what repeats and what doesn't.`,
    exampleOutput: `Customer support: step-fixed — one additional rep needed per 250 customers, not a smooth per-customer cost; at current volume this adds roughly $0.85/customer/month averaged, but that jumps discontinuously at the next 250-customer threshold. Fully-variable contribution margin (hosting + processing only): $49 - $3.20 - $1.72 = $44.08/month. Volume-adjusted margin including averaged support cost: $43.23/month, worse as volume approaches the next hire threshold. One-time revenue flag: the $99 onboarding fee is not recurring and should be excluded from ongoing per-unit economics.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-ltv-cac-ratio-honest-inputs-check',
    category: 'finance',
    title: `Calculate LTV:CAC and stress-test whether the inputs feeding it are actually honest`,
    description: `Computes customer lifetime value against customer acquisition cost and, more importantly, interrogates whether the underlying churn, margin, and cost inputs are being measured in a way that would survive scrutiny, rather than accepting optimistic assumptions at face value.`,
    promptText: `Calculate the LTV:CAC ratio from the inputs below, and — this is the more important part — check whether the inputs themselves would hold up if someone skeptical looked at how they were derived. A lot of LTV:CAC numbers that circulate are technically calculated correctly from inputs that were quietly optimistic to begin with.

AVERAGE REVENUE PER CUSTOMER
{{revenue_per_customer}}

GROSS MARGIN
{{gross_margin}}

CHURN RATE / AVERAGE CUSTOMER LIFESPAN
{{churn_or_lifespan}}

CUSTOMER ACQUISITION COST AND HOW IT WAS CALCULATED
{{cac_and_methodology}}

STEP 1 — CALCULATE
Show LTV as (average revenue per customer x gross margin) / churn rate, or the equivalent lifespan-based formula if churn rate wasn't given directly, with the formula and inputs shown. Show the LTV:CAC ratio.

STEP 2 — INTERROGATE THE CHURN INPUT
If churn rate was given as a blended average across all customers, flag that blended churn can hide a bimodal reality — a cohort that mostly churns fast in month one and a cohort that stays for years produces the same average as a cohort that churns steadily, but implies very different LTV — and note this as a reason the LTV figure could be less reliable than it looks if cohort-level churn data exists and hasn't been checked.

STEP 3 — INTERROGATE THE CAC INPUT
Check what's included in the stated CAC calculation. If it only includes paid ad spend and excludes sales team salaries, commissions, marketing headcount, or tools, flag this explicitly as CAC likely being understated, since a narrowly-scoped CAC produces an artificially favorable ratio. State what a fully-loaded CAC would need to include to be considered complete.

STEP 4 — HONEST RATIO
Give the ratio as calculated from the inputs provided, then separately state how the ratio would likely shift (directionally, not with a fabricated precise number) if the flagged issues in steps 2 and 3 were corrected — do not invent a specific corrected number without the real data to support it; describe the direction and rough magnitude of the likely correction instead.

OUTPUT FORMAT
1. LTV calculation with formula shown, CAC as given, and the resulting ratio.
2. Churn input reliability flag.
3. CAC completeness flag, listing what's likely missing.
4. Directional honest assessment of which way the true ratio likely moves once those gaps are addressed.`,
    variables: [
      {
        name: 'revenue_per_customer',
        description: `Average revenue generated per customer over a set period.`,
        example: `$120/month average across the customer base.`,
        required: true,
      },
      {
        name: 'gross_margin',
        description: `Gross margin percentage on that revenue.`,
        example: `72% gross margin.`,
        required: true,
      },
      {
        name: 'churn_or_lifespan',
        description: `Monthly or annual churn rate, or average customer lifespan if churn isn't tracked directly.`,
        example: `4% monthly churn, blended across the whole customer base.`,
        required: true,
      },
      {
        name: 'cac_and_methodology',
        description: `The stated CAC figure and what's included in how it was calculated.`,
        example: `$340 per customer, calculated as total paid ad spend for the quarter divided by new customers acquired that quarter — doesn't include sales team salaries or marketing software costs.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`ltv-cac`, `saas-metrics`, `unit-economics`, `growth-metrics`, `financial-analysis`],
    whyItWorks: `The reason this prompt is built around interrogating the inputs rather than just computing the ratio is that LTV:CAC is one of the most commonly gamed metrics in business — not usually through outright fabrication, but through optimistic scoping decisions (a CAC that excludes sales salaries, a churn rate that's a blended average hiding a bad early-cohort problem) that are each individually defensible but compound into a ratio that looks much healthier than the real unit economics support. Flagging blended churn specifically is important because a blended average is mathematically identical whether it comes from a customer base that churns steadily or one that's bimodal — mostly gone in month one, with a smaller group that stays for years — and those two underlying realities imply very different true LTV even though they produce the same average churn number, which is exactly the kind of thing a single input figure can't reveal on its own. Requiring the model to state what a fully-loaded CAC should include, rather than accepting a narrowly-scoped figure silently, catches the single most common way this metric gets flattered: ad spend alone is usually a fraction of true acquisition cost once sales headcount, commissions, and tooling are counted, and a ratio built on ad-spend-only CAC systematically overstates how efficiently the business is actually acquiring customers. The instruction to describe the likely direction and rough magnitude of correction rather than inventing a specific corrected number is a deliberate honesty constraint — GPT-5.1 could easily generate a plausible-looking "corrected" ratio, but without the actual cohort churn data or fully-loaded cost figures, any specific number would be a fabrication dressed up as a more rigorous calculation, which is worse than clearly stating the direction of the likely correction and leaving the precise figure to be calculated once the real data is gathered.`,
    exampleOutput: `LTV = ($120 x 0.72) / 0.04 = $2,160. LTV:CAC = $2,160 / $340 = 6.35:1. Churn flag: 4% is stated as a blended average — if a large early-cohort churn spike exists and hasn't been checked, true LTV for the retained cohort could differ substantially from this blended figure. CAC flag: excludes sales salaries and marketing tooling — a fully-loaded CAC would likely be meaningfully higher, which would pull the ratio down from 6.35:1 toward a less favorable, though still uncalculated without the real cost data, number.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-pricing-analysis-margin-and-elasticity-check',
    category: 'finance',
    title: `Pressure-test a proposed price change against margin impact and what it implies about customer response`,
    description: `Analyzes a proposed price change by working through the exact margin math and naming the customer-response assumption implicit in it, instead of just validating whatever price point was proposed.`,
    promptText: `Analyze the proposed pricing change below by working through the actual math and naming the assumption about customer behavior it depends on — do not simply validate the proposed price as reasonable; the job is to show what has to be true for it to work.

CURRENT PRICING
{{current_pricing}}

PROPOSED CHANGE
{{proposed_change}}

CURRENT VOLUME AND MARGIN
{{current_volume_and_margin}}

REASON FOR THE CHANGE
{{change_rationale}}

STEP 1 — DIRECT MARGIN MATH
Calculate current total contribution (price minus variable cost, times volume) and the new contribution if volume stayed exactly the same at the new price. Show this as the immediate, mechanical effect before any consideration of how customers might actually respond.

STEP 2 — BREAK-EVEN VOLUME CHANGE
If this is a price increase, calculate the maximum volume drop that could occur before total contribution falls below the current level — this tells the requester how much customer attrition the price increase can tolerate before it becomes a net loss. If this is a price decrease, calculate the minimum volume increase needed to at least maintain current total contribution — this tells the requester how much new volume the discount needs to generate before it pays for itself.

STEP 3 — NAME THE ASSUMPTION
State plainly what has to be true about customer price sensitivity for this change to be a good idea, given the tolerance calculated in step 2 — is the implied tolerance a small, plausible shift, or does it require an aggressive assumption about how customers will respond that isn't obviously justified by anything in the reason given for the change? Do not assert a specific price elasticity number unless the requester provided one; naming the required tolerance in plain terms ("volume could drop by up to 18% and this would still be worth it" or "this needs volume to grow by at least 30% just to break even") is more honest than inventing an elasticity coefficient with no data behind it.

OUTPUT FORMAT
1. Direct margin math: current contribution vs. new contribution at unchanged volume.
2. Break-even volume tolerance, stated as a specific percentage.
3. Plain-language read on whether that tolerance looks like a safe or aggressive bet, tied explicitly to the stated reason for the change.`,
    variables: [
      {
        name: 'current_pricing',
        description: `The current price and variable cost per unit.`,
        example: `$29/unit price, $11/unit variable cost.`,
        required: true,
      },
      {
        name: 'proposed_change',
        description: `The specific new price being considered.`,
        example: `Raising the price to $34/unit.`,
        required: true,
      },
      {
        name: 'current_volume_and_margin',
        description: `Current sales volume over a defined period.`,
        example: `Roughly 2,400 units/month at current price.`,
        required: true,
      },
      {
        name: 'change_rationale',
        description: `Why this price change is being considered.`,
        example: `Input costs have risen and margin has been eroding; competitors in this space charge closer to $35-38.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`pricing-analysis`, `pricing-strategy`, `margin-analysis`, `elasticity`, `financial-modeling`],
    whyItWorks: `The break-even volume tolerance calculation is the mechanism that makes this prompt useful rather than just a margin calculator, because it converts an abstract question ("is this price change a good idea?") into a concrete, checkable claim ("volume can drop by up to 18% before this becomes a worse deal than the status quo") that the requester can actually hold up against their own judgment of how customers are likely to react. Refusing to assert a specific price elasticity coefficient unless the requester supplied real data is an important honesty constraint, because price elasticity is genuinely hard to estimate without actual historical data on how volume responded to past price changes, and a model asked to analyze pricing will otherwise readily generate a plausible-sounding elasticity number that has no real basis — presenting a fabricated coefficient with false precision would make the analysis look more rigorous than it actually is. Explicitly tying the plain-language read on tolerance back to the stated reason for the change (rising input costs, competitor pricing) is what keeps the conclusion grounded in this specific decision rather than a generic pricing-strategy lecture — the same 18% volume tolerance is a comfortable bet in a market where competitors already charge more, and a much riskier one if the rationale given doesn't actually support customers tolerating a higher price. Separating the purely mechanical margin math (step 1) from the behavioral-assumption framing (step 3) matters because the two are genuinely different kinds of claims — the math is simply arithmetic that either party can verify, while the customer-response question is a judgment call that depends on market knowledge the model doesn't have, and conflating the two would make an uncertain judgment look as solid as verified arithmetic.`,
    exampleOutput: `Current contribution: ($29 - $11) x 2,400 = $43,200/month. New contribution at unchanged volume: ($34 - $11) x 2,400 = $55,200/month. Break-even volume tolerance: volume could fall to roughly 1,878 units (a 21.75% drop) before contribution falls back to the current $43,200 level. Given that competitors already price at $35-38, a 21.75% volume-drop tolerance looks like a reasonably safe bet rather than an aggressive one — the stated rationale supports this move.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-revenue-forecast-driver-based-buildup',
    category: 'finance',
    title: `Build a revenue forecast from named drivers instead of a single trend line extrapolated forward`,
    description: `Constructs a forward revenue forecast by building up from the specific drivers that actually generate the revenue (leads, conversion, price, retention) rather than extrapolating a historical growth rate, so the forecast can be interrogated driver by driver instead of accepted or rejected as one black-box number.`,
    promptText: `Build a revenue forecast for the period below using a driver-based buildup — projecting from the specific components that generate revenue — rather than simply extrapolating a historical growth rate forward. A trend-line extrapolation is easy to produce but impossible to interrogate; a driver-based buildup can be checked piece by piece.

REVENUE MODEL / HOW REVENUE IS ACTUALLY GENERATED
{{revenue_model}}

HISTORICAL DRIVER DATA
{{historical_driver_data}}

FORECAST PERIOD
{{forecast_period}}

DRIVER ASSUMPTIONS FOR THE FORECAST
{{driver_assumptions}}

BUILD STEPS
1. Break the revenue model into its actual components (e.g. new leads x conversion rate x average deal size, or active customers x retention rate x average revenue per customer) rather than working with a single blended revenue growth percentage.
2. For each component, state the historical value, the assumed forward value, and the specific reason for any change between them — a driver assumption that just repeats the historical value unchanged should say so plainly ("held flat, no change assumed"), and a driver assumption that changes from history must state why, not just what.
3. Multiply the components together for each period in the forecast horizon to produce total revenue, showing the calculation, not just the final total.
4. Identify which single driver the total forecast is most sensitive to — the one where a modest error in the assumption would move total revenue the most — and say so explicitly, since that's the assumption most worth double-checking or tracking closely once the forecast period begins.

Do not smooth the forecast into an artificially even trend line if the underlying drivers imply lumpiness (e.g. a seasonal conversion rate, a known cohort of contracts renewing in a specific month) — let the forecast reflect the actual shape the drivers imply, even if that shape is uneven.

OUTPUT FORMAT
1. Driver table: component | historical value | forecast assumption | reason for any change.
2. Period-by-period revenue calculation showing the multiplication, not just results.
3. Most sensitive driver, named explicitly, with a one-line reason.`,
    variables: [
      {
        name: 'revenue_model',
        description: `How revenue is actually generated, broken into its real components.`,
        example: `Monthly new leads x demo-to-close conversion rate x average annual contract value, plus existing customer renewals.`,
        required: true,
      },
      {
        name: 'historical_driver_data',
        description: `Actual historical values for each driver component.`,
        example: `Averaging 140 leads/month over the last 2 quarters, 14% demo-to-close conversion, $8,400 average contract value, 88% renewal rate on existing accounts.`,
        required: true,
      },
      {
        name: 'forecast_period',
        description: `The period being forecast.`,
        example: `Next 4 quarters.`,
        required: true,
      },
      {
        name: 'driver_assumptions',
        description: `What's assumed to change, if anything, for each driver going forward.`,
        example: `Expecting leads to grow to 180/month by Q3 due to a new marketing channel launching; conversion rate assumed flat; a known batch of 12 large contracts renews in Q2.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`revenue-forecasting`, `financial-modeling`, `sales-forecasting`, `driver-based-planning`, `business-planning`],
    whyItWorks: `The core mechanical advantage of a driver-based buildup over a trend-line extrapolation is that every component is independently checkable against something real — a lead-volume assumption can be checked against the marketing team's own pipeline plan, a conversion-rate assumption can be checked against the sales team's recent close rates — whereas a single blended "revenue will grow 15% next year" number gives the requester nothing to push back on except a gut feeling about whether 15% sounds right. Requiring an explicit reason for any driver assumption that changes from its historical value, and an explicit "held flat" note for any that don't, closes a specific gap where GPT-5.1 might otherwise quietly assume improvement across every driver simultaneously (more leads, better conversion, higher deal size all at once) without ever being asked to justify why all three would improve together — stacking optimistic assumptions across multiple drivers compounds multiplicatively and can produce a wildly inflated forecast that no single assumption looks unreasonable in isolation. The instruction to preserve lumpiness rather than smoothing the forecast into an even trend line matters because real revenue often isn't even — a known batch of contract renewals landing in one specific quarter, or a seasonal conversion pattern, produces a forecast with real peaks and troughs, and a model that defaults to a smooth month-over-month growth curve for presentation tidiness would actively hide information the requester needs, like a cash crunch in the quarter before the big renewal batch lands. Naming the single most sensitive driver at the end gives the forecast an actual use during the period it covers — instead of just filing the forecast away, the requester knows which one number to track most closely as actuals come in, since that's the one whose error would move the whole forecast the most.`,
    exampleOutput: `Q1: 140 leads x 14% x $8,400 = $164,640 new business, plus renewals. Q2: 155 leads (ramping toward 180) x 14% x $8,400 = $182,280 new business, plus a named batch of 12 renewing contracts at 88% retention adding roughly $88,704. Most sensitive driver: the assumed conversion rate held flat at 14% — a 2-point miss on conversion moves new-business revenue by roughly 14%, more than an equivalent miss on lead volume alone.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-cost-reduction-lever-audit-without-headcount-first',
    category: 'finance',
    title: `Surface cost-reduction levers before headcount cuts become the default answer`,
    description: `Builds a structured audit of a specific cost line that separates one-time savings from recurring ones and forces non-headcount options onto the table before layoffs get proposed as the easy fix.`,
    promptText: `You are helping me build a cost-reduction analysis for one specific expense line before it goes to my leadership team, and I want headcount reduction to be the last option considered, not the first one that gets written down because it's the easiest to model.

EXPENSE LINE
{{expense_line}}

CURRENT ANNUAL SPEND
{{current_spend}}

TARGET REDUCTION
{{target_reduction}}

WHAT WE'VE ALREADY TRIED
{{prior_attempts}}

CONSTRAINTS I CANNOT VIOLATE
{{hard_constraints}}

HOW TO STRUCTURE THE AUDIT
First, break the expense line into its actual cost drivers rather than treating it as one number — ask me for the components you need if I haven't given them, since a vendor contract, a usage pattern, and a headcount cost inside the same line item respond to completely different levers. For each driver, generate savings options across four categories in this order: renegotiate or consolidate (same output, lower unit price), reduce usage or scope (same price, less consumed), substitute (a cheaper way to get the same outcome), and eliminate (stop doing it entirely) — only after exhausting those four should headcount appear as a fifth category, and it must appear explicitly labeled as last-resort with a one-line reason it's being included at all. For every option, state whether the saving is one-time or recurring, since a leadership team conflating a one-time vendor credit with a permanent run-rate reduction is the single most common way a cost-cutting plan quietly fails to hold in month four. Flag any option that conflicts with something I've already tried or a constraint I gave you, rather than silently including it. Do not invent a specific vendor name, contract term, or negotiated discount percentage — where you'd need a real number to make an option concrete, mark it as an input I need to supply.

WHAT NOT TO DO
Do not default to "reduce headcount by X%" as a shortcut when a real analysis of the other four categories hasn't been done — that's the exact failure mode this prompt exists to prevent. Do not present a savings estimate as precise when it depends on a negotiation outcome you can't know.

OUTPUT FORMAT
A table with columns: Lever, Category, Estimated Annual Impact (one-time vs recurring), What Has To Be True For This To Work, Risk. End with a one-paragraph recommended sequence — which levers to pull first based on speed to impact versus effort — and a closing line noting this is a structuring aid for your own review, not a substitute for sign-off from whoever owns the budget.`,
    variables: [
      {
        name: 'expense_line',
        description: `The specific cost line under review, not the whole budget.`,
        example: `Third-party SaaS tooling across the growth and support teams`,
        required: true,
      },
      {
        name: 'current_spend',
        description: `The current annual or run-rate spend on this line.`,
        example: `$412,000/year across 34 active vendor contracts`,
        required: true,
      },
      {
        name: 'target_reduction',
        description: `The reduction goal, as a percentage or dollar figure.`,
        example: `18% reduction ($74,000/year) by Q1`,
        required: true,
      },
      {
        name: 'prior_attempts',
        description: `What's already been tried on this line, so it isn't re-suggested.`,
        example: `Already consolidated two overlapping analytics tools last year; annual renewal negotiations already happen every renewal cycle`,
        required: false,
      },
      {
        name: 'hard_constraints',
        description: `Anything explicitly off the table.`,
        example: `Cannot touch the tools the support team uses for SLA-tracking; no new multi-year lock-in contracts`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`cost-reduction`, `budget-planning`, `finance-ops`, `cost-analysis`, `leadership-brief`],
    whyItWorks: `The ordering instruction — four non-headcount categories before headcount is even allowed to appear — exploits a specific, predictable behavior in how GPT-5.1 responds to open-ended cost-reduction requests: when a model isn't given a forced sequence, it tends to reach for the single largest, most legible line item first, which in most org budgets is compensation, producing a headcount-cut recommendation by default rather than because it's actually the best option. Forcing the model to work through renegotiate, reduce usage, substitute, and eliminate before headcount can appear means those cheaper, lower-risk, non-people levers actually get evaluated on their own merits instead of being skipped past. Separating one-time from recurring savings addresses the most common way a cost-cutting plan looks good in the boardroom slide and then fails to hold: a one-time vendor credit or a deferred renewal gets summed into the same annual number as a genuinely recurring reduction, and three months later finance is asking why the run rate didn't actually move. Requiring "what has to be true for this to work" per lever forces the plan to surface its own hidden assumptions — a renegotiation lever that assumes the vendor has slack to give, a usage-reduction lever that assumes a team will actually change behavior — rather than presenting a savings number as if it were already secured. Instructing the model not to invent a specific negotiated discount percentage matters because a model asked to model savings will otherwise happily produce a plausible-sounding 15% vendor discount with no basis, which reads as confident but is fabricated, and someone building a real board slide off that number would be building on nothing.`,
    exampleOutput: `Lever: Consolidate 3 overlapping analytics tools into 1 | Category: Renegotiate/Consolidate | Impact: ~$28,000/yr, recurring | Requires: confirming feature parity with the support team before cancellation | Risk: migration effort in Q1. Lever: Downgrade seat tiers for inactive SaaS logins | Category: Reduce usage | Impact: ~$9,000/yr, recurring | Requires: an active-usage audit per tool | Risk: low.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-variance-analysis-actual-vs-budget-narrative',
    category: 'finance',
    title: `Turn a raw actual-vs-budget export into a variance narrative someone can act on`,
    description: `Converts a messy actual-vs-budget line-item dump into a ranked variance explanation that separates timing shifts from real overruns, so the finance review meeting spends time on the three lines that matter instead of all forty.`,
    promptText: `Phase 1 — Ingest.
Here is the actual-vs-budget data for the period, as I have it (paste raw, don't reformat before giving it to me):
{{variance_data}}

Period: {{reporting_period}}
Materiality threshold: {{materiality_threshold}}

Phase 2 — Classify.
For every line where the variance exceeds the materiality threshold I gave you, classify it into exactly one of three buckets: Timing (the spend or revenue happened, just not in the period it was budgeted for, and nets out over the year), Rate (the volume was as planned but the unit cost or price differed), or Volume (more or less of the thing happened than planned, at roughly the budgeted rate). Do not classify a variance you can't actually explain from the data given — if the line item alone doesn't tell you which bucket it belongs to, say so explicitly and list it under "needs input" with the specific question you'd need answered, rather than guessing a plausible-sounding explanation.

Phase 3 — Rank.
Order the material variances by how much each one changes the full-year forecast if it persists at the same rate for the rest of the year, not by the size of the variance in this one period alone — a large one-time timing variance matters less going forward than a smaller variance that compounds every month.

Phase 4 — Narrative.
For the top five ranked items, write a two-sentence explanation each: what happened, and whether it needs action or will self-correct. Never write "variance due to timing" as a complete explanation on its own — state what specifically shifted and when it's expected to reverse, or flag that you don't have enough information to say it will reverse.

WHAT NOT TO DO
Do not smooth over an unfavorable variance with softer language than a favorable one of the same size gets — describe both with the same level of directness. Do not present any dollar figure you calculated as exact if the underlying period data was incomplete; say what's approximate.

OUTPUT FORMAT
1. A table: Line Item | Variance ($ and %) | Bucket | Persists If Unaddressed (full-year impact estimate).
2. The five-item narrative section, ranked.
3. A "needs input" list of anything you couldn't classify confidently, each with the specific question to ask the line owner.
4. One line noting this is a structuring aid for the review meeting, not a finalized management account.`,
    variables: [
      {
        name: 'variance_data',
        description: `The raw actual-vs-budget line items for the period.`,
        example: `Marketing: budget $85k, actual $121k. Contractor costs: budget $40k, actual $22k. Cloud hosting: budget $30k, actual $38k. (18 more lines)`,
        required: true,
      },
      {
        name: 'reporting_period',
        description: `The period the data covers.`,
        example: `July 2026 (month 7 of FY26)`,
        required: true,
      },
      {
        name: 'materiality_threshold',
        description: `The variance size below which a line shouldn't get individual attention.`,
        example: `Ignore anything under $5,000 or 10% of budget, whichever is larger`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`variance-analysis`, `budget-vs-actual`, `financial-reporting`, `fp&a`, `management-review`],
    whyItWorks: `Splitting variances into timing, rate, and volume buckets mirrors the actual root-cause taxonomy FP&A teams use, and forcing GPT-5.1 to commit to exactly one bucket per line (rather than a paragraph that vaguely gestures at all three) is what makes the classification checkable — a reviewer can look at a line marked "rate" and immediately ask "did our unit cost change," instead of parsing a hedge-everything explanation that doesn't actually commit to a cause. Ranking by projected full-year impact rather than raw period-variance size is the mechanical fix for the most common failure of a variance review meeting: without that instruction, a model (and most humans building a first-pass report) will sort by the biggest number in the current period, which over-weights one-time timing blips and under-weights a small but compounding rate problem that will be five times larger by year-end if nobody looks at it now. The explicit instruction to say "needs input" rather than guess addresses a specific model behavior — asked to explain a variance from a bare number with no context, a language model will readily generate a plausible-sounding narrative ("likely due to seasonal demand") that sounds authoritative but has zero basis in the actual data provided, and a finance reviewer who doesn't know the explanation was invented will waste the meeting debating a cause that was never real. Requiring equal directness for favorable and unfavorable variances closes a subtler bias where models (like people) tend to write softer, more hedged language around bad news and crisper language around good news, which distorts which items a reader takes seriously.`,
    exampleOutput: `Marketing: +$36k / +42% vs budget | Bucket: Volume | Persists-if-unaddressed: +$430k full year if the current spend rate holds, since two campaigns were pulled forward from Q3 rather than being incremental. Needs input: Cloud hosting overage — could be a rate change (provider price increase) or volume (usage growth); ask infra owner which.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-management-accounts-narrative-for-non-finance-readers',
    category: 'finance',
    title: `Write the narrative page that sits in front of the management accounts so non-finance readers actually read it`,
    description: `Turns a finished set of management accounts (P&L, balance sheet, cash summary) into the one-page narrative cover that non-finance department heads will actually read before the numbers, calling out what changed and why it matters to their decisions.`,
    promptText: `I have a completed set of management accounts for the period below, and I need the one-page narrative that goes in front of them — the thing a department head who doesn't read financial statements for a living will actually read before skipping to their own numbers.

PERIOD
{{period}}

KEY FIGURES
{{key_figures}}

READER AUDIENCE
{{reader_audience}}

DECISIONS THIS COULD AFFECT
{{pending_decisions}}

How to write it: open with the single most important thing that changed this period and why it matters to the reader audience specifically — not "revenue was $X" as an opener, since a bare number means nothing without knowing whether it's good, bad, or expected relative to plan. For each key figure, state the number, the comparison point (budget, prior period, or prior year — pick whichever is most relevant and say which you picked), and one sentence on what's driving it, written in plain language a department head with no finance background could act on without a follow-up question. If any of the pending decisions listed would be informed differently depending on how one of these figures is trending, say so explicitly and name which decision and how — this is the entire point of the narrative existing separately from the raw statements. Where you don't have enough detail in what I gave you to explain a driver confidently, write the honest version ("finance to confirm the specific driver") rather than inventing a plausible cause, since a fabricated explanation in a document that circulates to non-finance leaders is worse than an acknowledged gap.

AVOID
Accounting jargon without a plain-language gloss the first time it's used (e.g. if you use "accrual," define it once, briefly, in context). A narrative that just restates every number from the statements in sentence form — the value of this document is picking what matters, not transcribing.

OUTPUT
A one-page narrative: opening paragraph (the headline), a short section per key figure, a closing paragraph connecting to the pending decisions, and a one-line footer noting the figures are drawn from the underlying management accounts and any driver marked as unconfirmed should be checked with finance before being relied on for a decision.`,
    variables: [
      {
        name: 'period',
        description: `The reporting period covered.`,
        example: `Q2 FY26 (April–June)`,
        required: true,
      },
      {
        name: 'key_figures',
        description: `The actual figures from the completed management accounts.`,
        example: `Revenue $2.1M (budget $1.95M); Gross margin 61% (prior quarter 58%); Operating cash -$180k (planned -$220k); Headcount cost $640k (budget $640k)`,
        required: true,
      },
      {
        name: 'reader_audience',
        description: `Who this narrative is written for.`,
        example: `Department heads (product, sales, ops) at the monthly all-leads review, none of whom have a finance background`,
        required: true,
      },
      {
        name: 'pending_decisions',
        description: `Any upcoming decisions this narrative could reasonably inform.`,
        example: `Whether to greenlight two open sales hires this quarter; whether marketing gets a mid-year budget top-up`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`management-accounts`, `financial-narrative`, `fp&a`, `leadership-communication`, `monthly-reporting`],
    whyItWorks: `The instruction to lead with the most important change rather than a bare top-line figure directly counters GPT-5.1's default drafting instinct for financial summaries, which is to open with the largest or first-listed metric in whatever order it was given rather than the one that actually matters to the reader — without an explicit override, the model treats input order as significance order. Requiring a stated comparison point for every figure (budget, prior period, or prior year, named explicitly) matters because a raw number like "$2.1M revenue" carries no information on its own; a reader has to know what it's being measured against to know whether it's good news, and forcing the model to name its comparison point rather than leaving it implicit prevents the common failure where a narrative technically states true numbers but leaves the reader unable to tell if they should be pleased or worried. Tying figures explicitly to named pending decisions is the mechanism that makes this document worth writing separately from the statements themselves — a management-accounts narrative that doesn't connect to an actual upcoming decision is just a shorter version of the same document, and naming the decision forces the model to write for the reader's actual next action rather than for completeness. The instruction to write "finance to confirm" instead of inventing a driver is a direct guard against a specific failure mode: language models asked to explain a financial movement from limited context will readily produce a fluent, specific-sounding cause ("driven by the enterprise renewal cycle") that has no actual basis in the data supplied, and because this document circulates to non-finance leaders who have no way to spot the fabrication, an invented driver here is more dangerous than the same fabrication in a document finance-literate readers would catch.`,
    exampleOutput: `This quarter, gross margin moved from 58% to 61% while revenue landed slightly ahead of budget — the main driver was the mix shift toward the higher-margin enterprise tier, not a pricing change (finance to confirm the exact split). For the two open sales hires under review: cash is running $40k better than planned, which gives some room, but headcount cost is already exactly at budget, so approving both hires would need an explicit reforecast rather than assuming the cash cushion covers it automatically.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-board-finance-brief-three-questions-format',
    category: 'finance',
    title: `Compress the finance section of a board deck down to the three questions the board will actually ask`,
    description: `Rebuilds a sprawling finance update into the three questions a board is realistically going to ask, with the answer to each one pre-built, instead of a slide deck the board has to reverse-engineer questions from.`,
    promptText: `You're helping me prepare the finance section of an upcoming board update. I don't want a slide-by-slide summary of every metric — boards ask a small, predictable set of questions, and I want this brief built around answering those directly.

COMPANY STAGE
{{company_stage}}

PERIOD FINANCIALS
{{period_financials}}

RUNWAY / CASH POSITION
{{cash_position}}

ANYTHING OFF-PLAN THIS PERIOD
{{off_plan_items}}

BOARD COMPOSITION NOTE
{{board_composition}}

STEP 1 — Identify the three questions.
Based on the company stage and what's off-plan this period, identify the three questions this specific board is most likely to ask about the finances — not a generic list ("how's growth," "how's burn") but the three shaped by what's actually unusual or notable this period. If nothing is meaningfully off-plan, say so and build the three questions around what a board at this stage typically scrutinizes instead.

STEP 2 — Answer each one directly.
For each question, give the direct answer in the first sentence — not the supporting data first and the answer buried at the end. Follow with the two or three numbers that actually support that answer, and one sentence on what it means for a decision the board might make (e.g., approving a raise, approving a budget change) if relevant.

STEP 3 — Anticipate the follow-up.
For each of the three, add one likely follow-up question a sharp board member would ask next, and pre-answer it in a sentence — this is what separates a brief that survives the actual meeting from one that gets picked apart live.

WHAT NOT TO DO
Do not pad the brief with metrics that don't connect to one of the three questions just to look thorough. Do not present cash runway as a single confident number without stating the assumption behind it (e.g., current burn rate held flat) — runway changes with burn, and stating it as a bare fact rather than a projection under a named assumption is misleading.

OUTPUT FORMAT
Three sections, one per question, each with: Question, Direct Answer, Supporting Numbers, Likely Follow-Up + Pre-Answer. Close with one line noting these are the three most likely questions based on what's off-plan, not a guarantee of what will actually be asked, and that runway/cash figures are projections under stated assumptions, not guarantees.`,
    variables: [
      {
        name: 'company_stage',
        description: `Stage and rough size of the company, which shapes what boards scrutinize.`,
        example: `Series B, 65 employees, 18 months post-raise`,
        required: true,
      },
      {
        name: 'period_financials',
        description: `The core financial figures for the period.`,
        example: `MRR $340k (up 6% MoM); gross margin 74%; net burn $210k/month`,
        required: true,
      },
      {
        name: 'cash_position',
        description: `Current cash and runway, with the assumption it's based on.`,
        example: `$4.1M in the bank; ~19 months of runway at the current $210k/month burn rate`,
        required: true,
      },
      {
        name: 'off_plan_items',
        description: `Anything this period that deviated meaningfully from plan.`,
        example: `Churn ticked up from 2.1% to 3.4% monthly in the SMB segment; enterprise sales cycle running longer than modeled`,
        required: true,
      },
      {
        name: 'board_composition',
        description: `Anything about the board that shapes what they'll ask or how bluntly to write.`,
        example: `Two operator-investors who ask sharp unit-economics questions; one newer board member still ramping on the business`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`board-reporting`, `finance-brief`, `startup-finance`, `investor-communication`, `executive-summary`],
    whyItWorks: `Anchoring the brief to three anticipated questions rather than a metric-by-metric readout is a direct fix for the most common failure of board materials: a comprehensive deck gives every reader an equal amount of everything, which means the board still has to do the work of finding the one or two things they actually care about, and a model asked to "summarize the finances" defaults to comprehensiveness because that reads as thorough. Forcing the direct answer into the first sentence of each section, before the supporting numbers, matters because GPT-5.1's default structure for a data-backed answer is context-then-conclusion — lead with the setup, land the point at the end — which works for an explainer but fails a board member skimming under time pressure who needs the verdict before deciding whether to read the supporting detail at all. The anticipated-follow-up step is what actually differentiates a brief that holds up in the room from one that doesn't: boards rarely stop at the first answer, and pre-building the second-order question (why did churn move, not just that it moved) means the presenter isn't caught reconstructing an answer live in front of investors. Requiring the runway figure to be stated as a projection under a named assumption rather than a bare fact addresses a specific and consequential failure mode — burn rate is not fixed, and presenting "19 months of runway" without qualifying it as "at current burn" implies a false precision that could shape a board's confidence about fundraising timing incorrectly if burn changes even modestly next quarter.`,
    exampleOutput: `Q1: Why did SMB churn jump from 2.1% to 3.4%? Direct answer: it's concentrated in one onboarding cohort from a channel partner test, not a broad product or pricing issue. Supporting numbers: 80% of the increase traces to accounts from that single channel; churn in all other acquisition channels held flat at 2.0%. Likely follow-up: is this partner channel being paused? Pre-answer: yes, new sign-ups from that channel paused pending a cohort review.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-cfo-dashboard-metric-set-for-decision-cadence',
    category: 'finance',
    title: `Design a CFO dashboard around the decisions it needs to trigger, not every metric finance can pull`,
    description: `Builds a lean CFO dashboard spec — the metrics, thresholds, and review cadence — anchored to the specific decisions each metric is supposed to trigger, instead of a wall of KPIs nobody acts on.`,
    promptText: `Help me design the metric set for a CFO-level dashboard. The failure mode I'm trying to avoid is a dashboard with thirty metrics on it that nobody actually looks at every week because it's not clear which numbers are supposed to trigger which action.

BUSINESS MODEL
{{business_model}}

CURRENT DECISION CADENCE
{{decision_cadence}}

METRICS ALREADY TRACKED (if any)
{{existing_metrics}}

BIGGEST BLIND SPOT RIGHT NOW
{{blind_spot}}

For each metric you propose, you must state four things or the metric doesn't belong on the dashboard: what decision this number is supposed to inform, what threshold or trend would actually trigger that decision (not just "monitor closely" — a specific number or rate of change), how often it needs to be reviewed given how fast it can move, and who owns acting on it. Group metrics into three tiers: Weekly (fast-moving, needs frequent eyes because it can drift meaningfully in days), Monthly (structural, moves slower, monthly review is enough), and Trigger-only (doesn't need a standing review cadence at all, just an alert when it crosses a threshold). If a metric from the existing list doesn't clear the four-part bar above, flag it as a candidate to drop from the standing dashboard rather than silently keeping it, and explain what decision it fails to connect to. Address the stated blind spot directly — propose at least one metric specifically aimed at surfacing it earlier, and explain what signal it would have caught.

WHAT NOT TO DO
Do not propose a metric just because it's commonly tracked in this business model if it doesn't map to an actual decision this specific dashboard's audience makes. Do not set a threshold vaguely ("if it starts trending down") — commit to a specific number or rate, and note that it's a starting point to calibrate against actual historical volatility, not a claimed industry-standard figure.

OUTPUT FORMAT
A table: Metric | Tier | Decision It Triggers | Threshold | Owner | Review Cadence. Followed by a short "drop candidates" list with reasoning, and a closing note on the blind-spot metric specifically. End with one line noting thresholds are starting points to be calibrated against your own historical data, not fixed benchmarks.`,
    variables: [
      {
        name: 'business_model',
        description: `How the business makes money and its rough shape.`,
        example: `B2B SaaS, annual contracts with quarterly usage-based overage billing`,
        required: true,
      },
      {
        name: 'decision_cadence',
        description: `How often finance/leadership currently makes budget or resourcing decisions.`,
        example: `Monthly leadership review, quarterly board cycle, ad hoc hiring approvals in between`,
        required: true,
      },
      {
        name: 'existing_metrics',
        description: `Metrics currently on a dashboard, if any, to be evaluated for keep/drop.`,
        example: `MRR, gross churn, NPS, website traffic, headcount, total SaaS spend`,
        required: false,
      },
      {
        name: 'blind_spot',
        description: `The specific thing leadership feels they find out about too late.`,
        example: `We don't notice a customer segment's usage-based overage revenue softening until the invoice lands a month later`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`cfo-dashboard`, `kpi-design`, `finance-ops`, `decision-support`, `reporting-cadence`],
    whyItWorks: `Requiring a stated decision, threshold, owner, and cadence for every metric before it's allowed onto the dashboard is a forcing function against GPT-5.1's default tendency, when asked to "design a CFO dashboard," to produce a comprehensive best-practice metric list pulled from what's typically tracked in the stated business model — comprehensive and typical is exactly the failure mode described in the prompt, since a metric with no attached decision is dead weight that dilutes attention from the ones that matter. Tiering into weekly, monthly, and trigger-only forces an explicit judgment about volatility and review cost that a flat metric list never makes: a number that can swing meaningfully week to week genuinely needs different cadence than one that's structurally slow-moving, and collapsing everything into one "dashboard" without a cadence tier is how review meetings end up spending equal time on a number that hasn't moved in a quarter and one that just broke. The instruction to evaluate existing metrics against the same four-part bar and flag drop candidates matters because dashboards accrete metrics over time as different stakeholders request their pet number, and without an explicit instruction to prune, a model will simply add new metrics on top of the old list rather than doing the harder, more useful work of removing ones that no longer connect to a live decision. Directly addressing the named blind spot forces the model to reason backward from a real, admitted gap in visibility rather than only forward from generic best practice, which is what actually makes the output specific to this business instead of a template that would look the same for any SaaS company.`,
    exampleOutput: `Metric: Usage-based overage run-rate (trailing 7-day, projected to month-end) | Tier: Weekly | Decision: whether to flag an at-risk segment to sales before the invoice lands | Threshold: projected month-end overage revenue down >15% vs. same point last month | Owner: RevOps lead | Cadence: weekly, Monday. Drop candidate: NPS on the standing weekly dashboard — doesn't map to a weekly-cadence financial decision; recommend moving to the quarterly product review instead.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-invoice-follow-up-sequence-by-account-tier',
    category: 'finance',
    title: `Write an invoice follow-up sequence that escalates differently for a strategic account than a small one`,
    description: `Produces a staged overdue-invoice follow-up sequence with tone and escalation calibrated to account tier, so a strategic account doesn't get the same blunt reminder cadence as a small overdue client.`,
    promptText: `Write a follow-up sequence for an overdue invoice. I need this calibrated by account tier — a strategic account and a small transactional account should not get the identical escalation path, because damaging one relationship costs the business far more than the other.

INVOICE DETAILS
{{invoice_details}}

DAYS OVERDUE
{{days_overdue}}

ACCOUNT TIER
{{account_tier}}

RELATIONSHIP CONTEXT
{{relationship_context}}

PRIOR PAYMENT HISTORY
{{payment_history}}

Build a three-stage sequence: a first reminder (friendly, assumes oversight), a second follow-up (firmer, references the first message, asks for a specific commitment), and a final notice (states the next concrete step if payment doesn't arrive by a stated date). Calibrate tone and timing gaps between stages based on account tier and relationship context — a strategic account with a clean payment history should get more benefit-of-the-doubt language and a longer gap before the firmer stage, while a small account with a pattern of late payment in its history should move to firmer language sooner. Every stage must ask for a specific, checkable commitment (a payment date, or an explanation with a new date) rather than a vague "please remit at your earliest convenience," since an open-ended ask is easy to ignore and doesn't create anything to follow up against next time. Reference the actual invoice number and amount in every stage, not just the first — a recipient scanning a follow-up sequence should not have to dig up the original invoice.

WHAT NOT TO DO
Do not use identical escalation language across tiers — a template that ignores relationship context defeats the purpose of asking for it. Do not threaten a specific consequence (late fees, collections, service suspension) unless I've told you that's actually our policy — ask me to confirm rather than assuming a standard one.

OUTPUT FORMAT
Three labeled email drafts (Stage 1, 2, 3) each with a subject line, and a one-line note before each stage giving the recommended gap in business days before sending it and why that gap fits this account tier.`,
    variables: [
      {
        name: 'invoice_details',
        description: `Invoice number, amount, and original due date.`,
        example: `Invoice #INV-4471, $18,400, due July 15, 2026`,
        required: true,
      },
      {
        name: 'days_overdue',
        description: `How overdue the invoice currently is.`,
        example: `22 days overdue as of today`,
        required: true,
      },
      {
        name: 'account_tier',
        description: `Where this account sits in terms of strategic value.`,
        example: `Strategic account — top-5 by annual contract value, two-year relationship`,
        required: true,
      },
      {
        name: 'relationship_context',
        description: `Anything relevant about the current relationship or contact.`,
        example: `Our usual AP contact there is out on leave; a new contact just took over invoicing`,
        required: false,
      },
      {
        name: 'payment_history',
        description: `Pattern of past payment behavior for this account.`,
        example: `Always pays within 5-10 days of due date historically, no prior late-payment pattern`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`invoice-follow-up`, `accounts-receivable`, `collections`, `client-communication`, `cash-flow`],
    whyItWorks: `Calibrating tone and stage-gap by account tier and payment history directly targets a real cost asymmetry that a generic follow-up template ignores: the business cost of over-escalating with a strategic account that simply had an internal process hiccup is much higher than the cost of moving faster to firmness with a small account that has a documented late-payment pattern, and a one-size-fits-all sequence optimizes for neither case well. Requiring a specific, checkable commitment in every stage — a date, not "at your earliest convenience" — matters mechanically because an open-ended ask gives the recipient nothing concrete to be held to next time, whereas a stated date creates an unambiguous trigger for whether stage two is warranted at all; this is the difference between a follow-up sequence that actually resolves and one that just repeats the same soft ask three times. Referencing the invoice number and amount in every single stage rather than only the first prevents a common real failure where a recipient who missed or deleted the first email has to reconstruct context from a later, firmer-toned message with no reference point, which reads as needlessly aggressive out of context. The explicit instruction not to threaten a consequence unless the user has confirmed it's actual policy is a guard against GPT-5.1's tendency to fill in a plausible-sounding standard business practice (late fees, a collections referral) when asked to write a "final notice" — that's a specific claim about consequences that could be untrue for this business and would misrepresent policy to a customer if sent as written.`,
    exampleOutput: `Stage 1 (send now, day 22): "Hi [contact] — hope the transition is going smoothly. Just flagging that Invoice #INV-4471 ($18,400, due July 15) hasn't come through yet — could you confirm a payment date on your end?" Stage 2 (send in 5 business days if no response): firmer, references Stage 1, asks for a specific date or explanation by end of week. Stage 3 (send in 5 more business days): states the next concrete step — to be confirmed with the business's actual overdue-account policy before finalizing.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-collections-email-payment-plan-negotiation',
    category: 'finance',
    title: `Draft a collections email that opens the door to a payment plan instead of demanding the full balance`,
    description: `Writes a collections email for a customer who's shown genuine difficulty paying, structured to offer a specific payment plan option rather than a blanket demand, to protect the chance of recovering something rather than nothing.`,
    promptText: `I need a collections email for a customer who has an overdue balance and has shown signs of genuine payment difficulty, not just an administrative delay. Write this to maximize the chance of recovering the balance over time rather than demanding it all at once and losing the relationship or the payment entirely.

BALANCE AND ACCOUNT
{{balance_details}}

SIGNS OF DIFFICULTY
{{difficulty_signals}}

PAYMENT PLAN OPTIONS I CAN OFFER
{{plan_options}}

RELATIONSHIP VALUE
{{relationship_value}}

DEADLINE FOR A RESPONSE
{{response_deadline}}

Open by acknowledging the situation without assuming details you don't know — do not speculate about why they're behind (do not write "we understand times have been tough" as if that's confirmed; instead, open in a way that invites them to explain if there's something going on, without presuming it). Present the payment plan options concretely — specific installment amounts and dates, not "we can work something out" left vague, since a vague offer puts the burden back on the struggling customer to propose numbers, and they often won't respond at all rather than do that. State clearly what happens if there's no response by the deadline, but frame it as what happens next in the process rather than a threat, and only include an actual consequence if I've told you it's real. Close by giving them an easy way to respond even if none of the offered plans work for them — invite a counter-proposal — since the entire point of a payment-plan email is to keep the door open for a working number, not to present a take-it-or-leave-it ultimatum.

WHAT NOT TO DO
Do not use collections-agency-style language ("failure to remit will result in") for what is still an in-house, relationship-preserving outreach — that register signals a level of formal escalation I haven't told you is happening. Do not invent specific installment numbers if I haven't given you plan options — ask, or leave a clear placeholder.

OUTPUT FORMAT
One email draft with subject line, plus a one-paragraph note afterward on why this framing was chosen over a standard demand-for-payment template, so I can decide if it fits this specific customer.`,
    variables: [
      {
        name: 'balance_details',
        description: `The overdue balance and how long it's been outstanding.`,
        example: `$6,200 overdue, 45 days past due`,
        required: true,
      },
      {
        name: 'difficulty_signals',
        description: `What indicates this is genuine difficulty rather than a routine delay.`,
        example: `Customer proactively emailed two weeks ago saying they were having a slow quarter and would be late; no history of ignoring us before this`,
        required: true,
      },
      {
        name: 'plan_options',
        description: `The actual payment plan structures the business is willing to offer.`,
        example: `Either 3 monthly installments of ~$2,070, or a 50% payment now with the remainder in 30 days`,
        required: true,
      },
      {
        name: 'relationship_value',
        description: `How much this relationship is worth preserving, to calibrate tone.`,
        example: `Long-standing customer, 3 years, generally reliable before this`,
        required: false,
      },
      {
        name: 'response_deadline',
        description: `The date by which a response is needed.`,
        example: `Response requested within 7 days`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`collections`, `payment-plan`, `accounts-receivable`, `customer-communication`, `cash-recovery`],
    whyItWorks: `The instruction not to presume a specific reason for the difficulty ("we understand times have been tough") rather than inviting the customer to explain matters because an assumed narrative that turns out to be wrong reads as presumptuous and can actually damage the relationship further — the safer and more accurate move is to leave space for the customer's own explanation rather than have the model author one on their behalf. Requiring concrete installment amounts and dates rather than "we can work something out" targets a specific, well-documented behavioral pattern in payment recovery: a struggling customer who is asked to propose their own repayment structure often does nothing at all, because proposing a number feels like an admission and carries its own friction, whereas a concrete offer they can simply say yes to (or counter) removes that barrier to response. The instruction to avoid collections-agency register unless that escalation is actually happening is a guard against a specific mismatch GPT-5.1 can default into: asked to write a "collections email," the model's training data skews toward formal demand-letter phrasing, and applying that register to what's meant to be an in-house, relationship-preserving message misrepresents how escalated the situation actually is, which can needlessly panic a customer who was still planning to pay. Keeping the door open for a counter-proposal at the close is the mechanism that actually maximizes recovery — a rigid two-option ultimatum will lose customers whose real capacity doesn't match either offered plan, while an explicit invitation to counter captures partial recovery that a stricter email would have forfeited entirely.`,
    exampleOutput: `"Hi [name] — following up on the outstanding balance of $6,200. Thanks for the heads-up a couple weeks back that things were tight this quarter. To make this easier, we can split the balance into 3 monthly payments of $2,070, or take 50% now with the rest in 30 days — whichever fits better. If neither works, just let us know what would, and we'll figure it out together. Could you confirm a path by [date]?"`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-sop-document-from-tribal-knowledge-interview',
    category: 'finance',
    title: `Turn a rambling walkthrough of how someone actually does a finance task into a written SOP`,
    description: `Converts an unstructured description of how a finance process actually gets done today into a step-by-step SOP with explicit exception handling, so the process survives the person who currently holds it in their head leaving.`,
    promptText: `I'm going to describe, in my own unstructured words, how a finance process actually gets done today — not how it's supposed to work on paper, but what actually happens, including the workarounds. Turn this into a proper SOP document.

PROCESS NAME
{{process_name}}

MY RAW DESCRIPTION OF HOW IT ACTUALLY WORKS
{{raw_description}}

WHO CURRENTLY DOES THIS
{{current_owner}}

SYSTEMS INVOLVED
{{systems_involved}}

STEP 1 — Extract the actual sequence.
Read through my raw description and pull out the real sequence of steps in order, including any manual workarounds I mentioned (a spreadsheet someone maintains outside the system, a step someone does from memory) — do not clean these workarounds out of the process or silently replace them with how the process "should" ideally work; document what actually happens, since the point of this SOP is that someone else can do exactly what the current owner does, workarounds included, until those workarounds are deliberately fixed.

STEP 2 — Flag ambiguity.
Wherever my description was vague about a step (I said something like "then I just check it looks right" without saying what "right" means), do not invent a specific definition — list it as an open question I need to answer before this SOP is complete, with the specific clarifying question.

STEP 3 — Exception handling.
Ask me, or infer from what I said, what typically goes wrong in this process and what the current owner does about it — a SOP that only covers the happy path is unusable the first time reality deviates from it, which in a finance process is often.

STEP 4 — Structure.
Write the final SOP as: Purpose (one sentence), Trigger (what starts this process), Numbered Steps (each with the system/tool used and roughly how long it takes), Exception Handling (what to do when X goes wrong), and Owner/Backup (who does this and who covers if they're out).

WHAT NOT TO DO
Do not smooth an odd or inefficient step out of the documented process without flagging it — flag it as a note for future improvement, but still document what currently happens, since replacing it with your own idea of best practice would make the SOP inaccurate to reality.

OUTPUT FORMAT
The structured SOP per Step 4, followed by an "Open Questions" list from Step 2, and a separate "Improvement Ideas (not yet implemented)" list of anything you noticed that seemed inefficient — clearly separated so it's never confused with the documented current process.`,
    variables: [
      {
        name: 'process_name',
        description: `The specific finance process being documented.`,
        example: `Monthly credit card expense reconciliation`,
        required: true,
      },
      {
        name: 'raw_description',
        description: `An unstructured, in-your-own-words walkthrough of how the process actually happens.`,
        example: `So every month around the 3rd I pull the card statement, then I go through it line by line against the receipts folder, and honestly for the ones under $25 I usually just approve them without checking because it's not worth the time, then I email finance the total, and if something looks weird I just ask the person directly over Slack instead of going through the formal dispute process`,
        required: true,
      },
      {
        name: 'current_owner',
        description: `Who currently does this and their role.`,
        example: `Me, as ops manager — nobody else has ever done this end to end`,
        required: true,
      },
      {
        name: 'systems_involved',
        description: `Tools or systems touched during the process.`,
        example: `Amex portal for statements, a shared Google Sheet for tracking, Slack for questions, QuickBooks for the final entry`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`finance-sop`, `process-documentation`, `knowledge-transfer`, `finance-ops`, `internal-controls`],
    whyItWorks: `The instruction to document workarounds as-is rather than cleaning them into an idealized version of the process is the single most important structural choice here, because the entire point of an SOP written from a tribal-knowledge interview is continuity — someone else needs to be able to do exactly what the current owner does, including the informal under-$25 shortcut and the Slack-instead-of-formal-dispute habit, or the document is describing a process that doesn't actually exist and will fail the first time a successor tries to follow it literally. Separating flagged ambiguity into an explicit "open questions" list rather than letting the model quietly resolve it addresses a specific and risky behavior: when a raw description is vague ("I just check it looks right"), a language model asked to produce a clean SOP will confidently fill that gap with a plausible definition of its own invention, and a reader of the finished SOP has no way to tell that step was fabricated rather than reported — surfacing it as a question the actual process owner must answer keeps the document honest about where real information ends. Requiring exception handling as a mandatory section, not an afterthought, matters specifically for finance processes because reconciliation, approvals, and expense processes deviate from the happy path constantly in practice, and a SOP that only documents the clean-run sequence becomes useless during the first real anomaly, which is exactly when a written procedure is needed most. Keeping "improvement ideas" in a strictly separate list from the documented current process prevents the common failure where a well-intentioned rewrite quietly upgrades an inefficient real practice into a better-sounding hypothetical one, producing a document that reads well but doesn't match what actually happens on the ground.`,
    exampleOutput: `Step 4 (Reconciliation): Pull the Amex statement from the portal (~10 min). Cross-check each line against the receipts folder; items under $25 are approved without individual receipt-matching as a time-saving practice (flagged below as an improvement candidate). Email finance the reconciled total. Open Question: what does "looks weird" specifically trigger checking for — a merchant category mismatch, an amount outlier, or something else? Improvement Idea (not yet implemented): the under-$25 auto-approval and the informal Slack-based dispute resolution bypass the formal dispute process — worth a controls review, but currently documented as-is above.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-month-end-close-checklist-with-owner-and-dependency',
    category: 'finance',
    title: `Build a month-end close checklist that shows which steps block which, not just a flat list of tasks`,
    description: `Produces a month-end close checklist organized by dependency and owner rather than a flat task list, so the close doesn't stall on day six because someone didn't realize their step was blocking three others.`,
    promptText: `Build a month-end close checklist for our finance team. I don't want a flat list of tasks in no particular order — I want the dependency structure made explicit, because our close has stalled before when someone didn't realize their step was blocking three other people's steps.

TEAM AND ROLES
{{team_roles}}

CURRENT CLOSE TASKS (as I know them)
{{current_tasks}}

CLOSE TIMELINE TARGET
{{close_timeline}}

KNOWN PAST BOTTLENECKS
{{past_bottlenecks}}

For every task, state: the owner, what it depends on being finished first (name the specific upstream task, not just "earlier steps"), what depends on it being finished (downstream tasks that are blocked until this is done), and a rough duration. Organize the output as a dependency-ordered sequence, not an alphabetical or category-ordered list — tasks with no dependencies should be clearly identifiable as things that can start on day one in parallel. Where I've named a past bottleneck, trace it to the specific task in this list and note explicitly why it became a bottleneck (was it blocked on something upstream, understaffed, or a task that reliably takes longer than budgeted) and propose one specific change to prevent it recurring, not a generic "communicate better" suggestion.

WHAT NOT TO DO
Do not invent a dependency between two tasks that wouldn't actually block each other just to make the chart look more connected — if a task genuinely has no upstream dependency, say so plainly. Do not assign a duration with false precision ("47 minutes") — use a realistic range and note it should be calibrated against your team's actual historical timing, not treated as a fixed benchmark.

OUTPUT FORMAT
1. A dependency-ordered table: Task | Owner | Depends On | Blocks | Duration.
2. A short "can start immediately" list of zero-dependency tasks.
3. A "bottleneck fixes" section addressing each named past bottleneck specifically.
4. One line noting this checklist should be validated against your actual close cycle before being treated as final process.`,
    variables: [
      {
        name: 'team_roles',
        description: `Who is on the close team and their roles.`,
        example: `Controller, AP lead, AR lead, and a part-time bookkeeper who handles bank reconciliation`,
        required: true,
      },
      {
        name: 'current_tasks',
        description: `The close tasks as currently known, even if informally described.`,
        example: `Reconcile bank accounts, close AP subledger, close AR subledger, review accruals, run trial balance, review with controller, post adjusting entries, finalize P&L`,
        required: true,
      },
      {
        name: 'close_timeline',
        description: `The target number of business days to close.`,
        example: `5 business days target, currently taking 8`,
        required: true,
      },
      {
        name: 'past_bottlenecks',
        description: `Specific points where the close has historically stalled.`,
        example: `Accrual review has stalled twice waiting on department heads to confirm open POs; trial balance review with the controller has been delayed because it's scheduled before AR close finishes`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`month-end-close`, `close-checklist`, `finance-ops`, `process-design`, `accounting-workflow`],
    whyItWorks: `Requiring an explicit upstream dependency and downstream blocked-list per task, rather than a flat sequential checklist, is what actually diagnoses why a close stalls — a flat list makes every task look equally sequential even when several could run in parallel, which either falsely compresses the timeline (nobody notices a real blocking dependency) or falsely extends it (tasks that could run simultaneously get scheduled one after another out of habit); making dependency explicit surfaces both problems in the same structure. Tracing each named past bottleneck to a specific task and classifying why it became one (blocked upstream, understaffed, or a task that structurally runs long) rather than accepting a generic "communicate better" fix forces a real diagnosis: the example given — trial balance review scheduled before AR close actually finishes — is a scheduling-order bug, not a communication problem, and only naming the actual mechanism produces a fix that would prevent recurrence rather than a platitude that changes nothing. The instruction against inventing false dependencies matters because a model asked to build a dependency chart has an incentive to make the chart look complete and interconnected, and a fabricated dependency between two genuinely independent tasks would wrongly serialize work that could run in parallel, directly working against the stated goal of compressing an 8-day close to 5. Refusing false-precision durations ("47 minutes") while still requiring a duration estimate keeps the checklist honest about what's a real, calibratable estimate versus what would be spurious specificity dressed up as data — a range invites the team to validate against their own historical timing, while a fake-precise single number invites false confidence in a number that was never measured.`,
    exampleOutput: `Task: Accrual review | Owner: Controller | Depends on: department heads confirming open POs (currently unscheduled as its own task — this is the bottleneck) | Blocks: trial balance run | Duration: 1-2 days once inputs arrive. Bottleneck fix: add a standing day-2 deadline for department heads to confirm open POs, owned by the controller chasing it directly rather than waiting passively, since the current stall is an upstream input problem, not a review-capacity problem.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-model-assumptions-page-stress-test',
    category: 'finance',
    title: `Stress-test a financial model's assumptions page before someone else finds the weak one first`,
    description: `Runs a structured stress test on the assumptions driving a financial model, ranking them by how much the output actually depends on each one, so the shakiest assumption gets caught before an investor or exec finds it.`,
    promptText: `I'm about to share a financial model and I want the assumptions page stress-tested first — specifically, I want to know which assumptions the output is most sensitive to, before someone reviewing it finds the weak one and the whole model loses credibility over one bad input.

MODEL PURPOSE
{{model_purpose}}

KEY ASSUMPTIONS AS LISTED
{{key_assumptions}}

OUTPUT THE MODEL PRODUCES
{{model_output}}

WHO WILL REVIEW THIS
{{reviewer_audience}}

For each listed assumption, do three things. First, classify it as either a hard input (something observable or contractually fixed, like a signed price or a known headcount) or a judgment call (something projected or estimated, like a growth rate or a churn assumption) — judgment calls are where real scrutiny will land, and I want them clearly distinguished from hard inputs. Second, for each judgment call, estimate roughly how sensitive the model output is to a reasonable swing in that assumption (e.g., what happens to the output if this assumption is off by the kind of margin a projection like this typically is) — rank the judgment calls from most to least sensitive. Third, for the two or three most sensitive judgment calls, propose the specific, pointed question a skeptical reviewer would ask to test it ("where did the 8% monthly growth assumption come from, and does it hold if the biggest customer doesn't renew") — write these as the actual questions to prepare for, not vague advice like "be ready to defend your growth assumption."

WHAT NOT TO DO
Do not invent a specific sensitivity percentage or dollar swing as if you calculated it precisely — you don't have the underlying model mechanics, only the assumptions and stated output, so describe sensitivity directionally and qualitatively ("the output is disproportionately dependent on this one") rather than fabricating a specific number that looks like real modeling output. Do not tell me an assumption is reasonable or unreasonable — that's a judgment call for me and whoever set it, not something you can assert from a list of numbers alone.

OUTPUT FORMAT
1. A table: Assumption | Hard Input or Judgment Call | Sensitivity Rank (if judgment call) | Why.
2. The prepared-questions list for the top 2-3 most sensitive judgment calls.
3. One line noting this is a structuring aid to prepare for review, not a substitute for someone with real financial modeling expertise actually rebuilding the sensitivity analysis inside the model itself.`,
    variables: [
      {
        name: 'model_purpose',
        description: `What the financial model is for.`,
        example: `18-month cash flow and headcount forecast for a Series A pitch`,
        required: true,
      },
      {
        name: 'key_assumptions',
        description: `The assumptions the model is built on, as listed.`,
        example: `15% MoM revenue growth; 4% monthly gross churn; hiring 2 engineers per quarter at $160k loaded cost each; 70% gross margin held flat`,
        required: true,
      },
      {
        name: 'model_output',
        description: `What the model ultimately produces or is used to argue.`,
        example: `Shows the company reaching cash-flow breakeven in month 14 without an additional raise`,
        required: true,
      },
      {
        name: 'reviewer_audience',
        description: `Who will be scrutinizing this model.`,
        example: `A Series A investor's associate doing diligence, known for asking pointed unit-economics questions`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`financial-modeling`, `assumptions-review`, `fundraising-prep`, `sensitivity-analysis`, `diligence-prep`],
    whyItWorks: `Separating hard inputs from judgment calls before ranking anything is the structural move that makes this stress test useful rather than performative — a reviewer scrutinizing a model is not going to spend time questioning a signed contract price, they're going to go straight for the projected growth rate and churn assumption, and pre-sorting the list into these two categories mirrors exactly where real diligence attention lands, rather than treating every line item as equally worth defending. Explicitly instructing the model to describe sensitivity qualitatively and directionally rather than generating a specific percentage swing is the most important guardrail in this prompt: GPT-5.1, asked for a sensitivity analysis, can produce a fluent, numerically specific-looking answer ("a 3-point swing in churn changes breakeven by 2.4 months") that sounds like it came from actually running the model, when in fact the model was never given the underlying formulas to compute that — presenting a fabricated precise number as if it were real modeling output is more dangerous than an honest qualitative flag, because it would be repeated in a pitch as if it had been verified. Producing the actual pointed questions a skeptical reviewer would ask, rather than generic advice to "be ready to defend your assumptions," is what makes this genuinely useful preparation — a founder walking into diligence needs the literal question stated ("does breakeven still hold if the biggest customer doesn't renew") so they can pre-build the answer, not a reminder that scrutiny is coming. The closing instruction that this doesn't replace someone with real modeling expertise rebuilding true sensitivity analysis inside the model is an honest scope limit: a language model reasoning over a list of stated assumptions cannot actually recompute the model's real mechanical sensitivity, only reason about which inputs are inherently more speculative than others.`,
    exampleOutput: `Assumption: 15% MoM revenue growth | Judgment call | Sensitivity: highest | Why: compounds over 18 months, so a modest miss early compounds into a large deviation in the breakeven month, and it's the single most speculative number in the set relative to the hard-input hiring costs. Prepared question: "What does breakeven look like if growth runs at 10% instead of 15% for the first two quarters, and does the current cash position still cover the gap?"`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-valuation-framework-comparison-not-a-number',
    category: 'finance',
    title: `Build a valuation reasoning framework that compares methods instead of handing back a single number`,
    description: `Structures a comparison across valuation approaches for a specific situation, explaining what each method assumes and where they'd disagree, instead of producing one confident valuation figure that hides how much judgment went into it.`,
    promptText: `I need help structuring my thinking on a valuation question — not a single number, because a single confident valuation figure from an AI model would be misleading given how much judgment and market-specific data a real valuation actually requires. I want a framework comparing how different valuation approaches would reason about this situation and where they'd likely disagree.

SITUATION
{{valuation_situation}}

AVAILABLE FINANCIALS
{{available_financials}}

COMPARABLE CONTEXT I HAVE
{{comparable_context}}

WHAT THIS VALUATION IS FOR
{{valuation_purpose}}

For each of the following approaches that's actually applicable to this situation — comparables/multiples, discounted cash flow, and (if relevant) an asset-based or precedent-transaction approach — explain what that method fundamentally assumes about value, what specific inputs it would need that I haven't given you (be concrete: for DCF, that means a discount rate and terminal growth assumption; for comparables, that means an actual peer set and their current multiples), and roughly what kind of situation makes that method more or less reliable. Then explain where these approaches would likely land in meaningfully different places for a situation like this one specifically, and why — not a generic "methods can differ" caveat, but the actual mechanism (e.g., a DCF is more sensitive to long-term growth assumptions than a multiples approach, which anchors to current market sentiment instead).

WHAT NOT TO DO
Do not produce a specific dollar valuation or multiple as if it were a real output — you do not have real comparable company data, a real discount rate derivation, or audited financials, and a specific number would carry false authority. Do not claim a named industry-standard multiple or discount rate as fact; if I haven't given you a number, say what's missing and what kind of source would supply it (an actual comparable transaction database, a real cost-of-capital calculation).

OUTPUT FORMAT
1. A section per applicable method: What It Assumes | What Inputs Are Missing | When This Method Is More/Less Reliable Here.
2. A short section on where these methods would likely disagree for this specific situation and why.
3. A closing paragraph stating plainly that this is a framework for organizing the analysis, not a valuation, and that an actual number requires either a qualified valuation professional or the real inputs (verified comparables, an actual discount rate, audited financials) plugged into a proper model.`,
    variables: [
      {
        name: 'valuation_situation',
        description: `The specific valuation context.`,
        example: `Founder considering an early buyout offer for a 15%-owned stake in a private company`,
        required: true,
      },
      {
        name: 'available_financials',
        description: `What financial data is actually on hand.`,
        example: `Trailing 12-month revenue $3.2M, EBITDA roughly breakeven, no audited statements, two years of internal P&Ls`,
        required: true,
      },
      {
        name: 'comparable_context',
        description: `Any comparable company or transaction context available, even if incomplete.`,
        example: `One competitor raised at a reported 4x revenue multiple 18 months ago, but details of that deal's terms aren't public`,
        required: false,
      },
      {
        name: 'valuation_purpose',
        description: `What decision this valuation reasoning is meant to inform.`,
        example: `Deciding whether to accept, negotiate, or reject a buyout offer for the stake`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`valuation`, `financial-analysis`, `dcf`, `comparables`, `decision-framework`],
    whyItWorks: `Explicitly refusing to produce a single dollar figure or multiple, and instead structuring a comparison of what each method assumes, is the core design decision that keeps this prompt honest about what an AI model reasoning over incomplete inputs can actually contribute — a model asked directly "what is this worth" will produce a specific-sounding number by pattern-matching against typical multiples in its training data, and that number would carry an unearned appearance of rigor despite resting on no real comparable dataset, no derived discount rate, and no audited financials, which is precisely the kind of confident-but-baseless output this category exists to avoid. Requiring the model to name the concrete missing inputs for each method (an actual peer set with current multiples for comparables, a derived discount rate and terminal growth rate for DCF) rather than gesturing at methods abstractly is what makes this genuinely useful as a preparation exercise — it tells the user exactly what data they still need to gather before a real valuation could be responsibly attempted, which is actionable in a way a vague overview isn't. Explaining the actual mechanism behind why methods diverge (DCF's greater sensitivity to long-run growth assumptions versus comparables anchoring to current market sentiment) rather than a generic "different methods can give different answers" disclaimer gives the user a real intuition for which number to trust more in which market conditions, which is the actual reasoning skill this prompt is meant to build. The mandatory closing statement — that this organizes analysis but a real number needs a qualified valuation professional or actual verified inputs — keeps the tool correctly scoped as an explanation and structuring aid rather than something that could be mistaken for investment or valuation advice a reader might act on directly.`,
    exampleOutput: `Comparables approach assumes the market has already priced similar businesses correctly and that this company resembles that peer set closely enough to inherit its multiple — missing input: a real set of comparable transactions with disclosed terms, not a single rumored 4x figure from one competitor's raise. DCF assumes future cash flows can be reasonably projected and discounted at an appropriate rate reflecting risk — missing: an actual discount rate derivation and a defensible terminal growth assumption, which for a near-breakeven company is especially sensitive since small changes in the growth assumption swing the output disproportionately.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-ma-diligence-question-list-by-risk-category',
    category: 'finance',
    title: `Build an M&A diligence question list organized by risk category instead of a generic due-diligence template`,
    description: `Generates a due-diligence question list tailored to the specific deal and target, sorted by which risk category each question actually probes, so the questions asked reflect what could actually break this deal rather than a boilerplate checklist.`,
    promptText: `I'm preparing diligence questions ahead of an M&A conversation and I don't want a generic due-diligence checklist pulled from a template — I want questions organized around the specific risk categories that matter for this deal, given what I already know and don't know about the target.

DEAL TYPE AND STAGE
{{deal_type}}

TARGET COMPANY OVERVIEW
{{target_overview}}

WHAT WE ALREADY KNOW
{{known_information}}

SPECIFIC CONCERNS GOING IN
{{specific_concerns}}

Organize the diligence questions into risk categories relevant to this specific deal — likely including financial (revenue quality, customer concentration, working capital), legal/contractual (change-of-control clauses, litigation exposure), operational (key-person dependency, systems and process maturity), and any category suggested by the specific concerns I named — do not just default to a generic four-category template if the concerns I listed point to something else that deserves its own category (e.g., a specific regulatory exposure). For each category, generate questions that probe what we don't already know rather than re-asking what's in the target overview I gave you — a diligence list that re-derives publicly known facts wastes the limited time available with the target's team. For the specific concerns I named, make sure at least one pointed, hard-to-deflect question directly addresses each one — not a soft version of the question that could be answered evasively without actually resolving the concern.

WHAT NOT TO DO
Do not invent a specific red flag about this target that I haven't given you evidence for — frame concerns as things to verify, not as findings, since you have no actual access to the target's real financials or legal history. Do not pad the list with generic questions that would apply to any company being acquired if they don't connect to what's actually known or unknown about this specific target.

OUTPUT FORMAT
Sections by risk category, each with 3-6 pointed questions. A short "highest priority" subsection at the top pulling out the 5 questions across all categories most directly tied to the specific concerns named. Close with one line noting this is a structuring aid to prepare for diligence conversations and does not substitute for qualified legal, accounting, or M&A advisory review of the actual target materials.`,
    variables: [
      {
        name: 'deal_type',
        description: `What kind of deal this is and how far along.`,
        example: `Acquiring a competitor's book of business, early-stage conversations before an LOI`,
        required: true,
      },
      {
        name: 'target_overview',
        description: `What's publicly known or already shared about the target.`,
        example: `~$4M ARR, 40 customers, founder-led, 12 employees, no external funding raised`,
        required: true,
      },
      {
        name: 'known_information',
        description: `What has already been disclosed or verified.`,
        example: `Top 3 customers make up roughly 35% of revenue based on what the founder mentioned informally; no known litigation`,
        required: false,
      },
      {
        name: 'specific_concerns',
        description: `The particular things this acquirer is worried about going in.`,
        example: `Customer concentration risk, whether key engineering staff would actually stay post-acquisition, and whether the founder-led sales process would transfer to our sales team`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`ma-diligence`, `due-diligence`, `deal-preparation`, `risk-assessment`, `acquisition`],
    whyItWorks: `Instructing the model to build questions that probe what's unknown rather than re-deriving what's already in the target overview directly addresses the biggest practical waste in real diligence conversations: target management teams' time is limited and closely guarded, and a generic checklist that re-asks basic facts already disclosed burns that scarce time on questions that don't move the deal forward — anchoring the question generation to the known/unknown split given in the prompt keeps every question earning its place in the conversation. Requiring at least one pointed, hard-to-deflect question per named concern — rather than a softer, generically phrased version — matters because a vague question ("how do you think about customer concentration?") invites a reassuring, non-committal answer, while a specific one ("if your top customer left in the next twelve months, what would happen to the other 65% of revenue's growth trajectory") is much harder to answer evasively, and evasiveness itself is diagnostic information the acquirer needs to notice. The explicit instruction not to invent a specific red flag about the target is an important guard against a real risk with this kind of prompt: a language model generating a diligence list can slip from asking a probing question into stating a plausible-sounding concern as if it were an established fact about this particular target, and presenting a fabricated finding with the same confidence as a real one could misdirect the acquirer's actual diligence effort or even surface in a written memo as if it had evidentiary basis. The mandatory closing scope note — that this organizes preparation and doesn't substitute for qualified legal, accounting, or M&A advisory review — keeps the output correctly framed as a conversation-prep tool rather than something that could be mistaken for the actual diligence work itself, which requires real document review by qualified professionals.`,
    exampleOutput: `Highest priority: "Walk us through what happens to the top-3-customer relationships if there's a change of ownership — are any of those contracts personally tied to the founder's relationship rather than the product itself?" Financial category: "Beyond the informally cited 35% concentration figure, can we see actual customer-level revenue for the trailing 12 months to verify that split precisely?"`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-debt-schedule-covenant-headroom-check',
    category: 'finance',
    title: `Structure a debt schedule around covenant headroom, not just the amortization table`,
    description: `Builds a debt schedule framework that tracks covenant headroom alongside the standard amortization structure, flagging which covenant is closest to being tripped under a stated stress scenario instead of only listing payment amounts.`,
    promptText: `Help me structure a debt schedule for our current facility, but I want it built around covenant headroom, not just the amortization mechanics — the amortization schedule alone doesn't tell anyone what actually puts us at risk, which is tripping a covenant, not missing a payment.

FACILITY DETAILS
{{facility_details}}

COVENANTS ATTACHED
{{covenants}}

CURRENT FINANCIAL POSITION AGAINST EACH COVENANT
{{current_position}}

STRESS SCENARIO TO TEST
{{stress_scenario}}

First, lay out the standard schedule structure — principal balance, scheduled amortization, interest, and maturity — but keep this section brief, since it's mechanical and not where the real risk analysis lives. Second, and more importantly, for each covenant, state the current headroom (how far the current position is from the covenant threshold, in the actual units the covenant is measured in — a leverage ratio covenant needs headroom expressed in ratio terms, not dollars) and rank the covenants from least to most headroom, since the tightest one is the one that actually constrains the business's decisions. Third, apply the stress scenario I gave you and recalculate headroom under that scenario for each covenant — state plainly which covenant would be tripped first under the stress case and roughly how much deterioration it would take to trip it, using the numbers I've given you rather than inventing a specific breaking point you haven't actually derived from those numbers.

WHAT NOT TO DO
Do not present a headroom calculation as precise if I've given you rounded or approximate current-position figures — say the calculation is approximate and state the rounding. Do not recommend a specific renegotiation or refinancing action as if it were sound financial advice — describe what the numbers show and what kind of conversation they'd warrant with lenders or advisors, not a specific transaction to pursue.

OUTPUT FORMAT
1. Brief amortization summary.
2. Covenant headroom table: Covenant | Threshold | Current Position | Headroom | Rank (tightest first).
3. Stress-scenario section: recalculated headroom per covenant under the stated stress case, and which one would be tripped first.
4. A closing line stating this is a structuring aid for internal planning, not a substitute for your lender relationship team or a qualified financial advisor reviewing the actual credit agreement language.`,
    variables: [
      {
        name: 'facility_details',
        description: `The basic terms of the debt facility.`,
        example: `$8M term loan, 5-year amortization, current balance $6.1M, fixed rate 7.2%`,
        required: true,
      },
      {
        name: 'covenants',
        description: `The specific covenants attached to the facility, with their thresholds.`,
        example: `Max leverage ratio (debt/EBITDA) of 3.5x; minimum debt service coverage ratio (DSCR) of 1.25x; minimum liquidity of $500k`,
        required: true,
      },
      {
        name: 'current_position',
        description: `Where the business currently stands against each covenant.`,
        example: `Current leverage ratio ~2.8x; DSCR ~1.4x; liquidity ~$720k`,
        required: true,
      },
      {
        name: 'stress_scenario',
        description: `The specific downside scenario to test covenant headroom against.`,
        example: `EBITDA declines 20% over the next two quarters due to a large customer churning`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`debt-schedule`, `covenant-compliance`, `credit-facility`, `financial-planning`, `risk-analysis`],
    whyItWorks: `Keeping the amortization mechanics brief and putting the real analytical weight on covenant headroom reflects an actual asymmetry in what puts a borrower at risk: missing a scheduled payment is a highly visible, hard-to-miss event that a basic amortization table already tracks fine, while tripping a covenant is the more common and more consequential failure mode in practice, and it's silent until someone specifically checks headroom against the threshold — a schedule that only shows payment mechanics gives false comfort by omission. Requiring headroom stated in the covenant's own units (a ratio for a leverage covenant, a dollar figure for a minimum liquidity covenant) rather than a single normalized "risk score" keeps the analysis mechanically honest and directly comparable to how a lender actually measures compliance, rather than introducing an invented composite metric that obscures which specific covenant is actually tight. Ranking covenants from least to most headroom rather than listing them in the order they were given surfaces the one constraint that actually binds business decisions right now — a leverage covenant with wide headroom and a liquidity covenant with almost none are not equally important to watch, and an unordered list treats them as if they were. Applying the stress scenario and stating which covenant would trip first, using only the numbers supplied rather than inventing an unverified breaking point, is what turns this from a static compliance snapshot into a forward-looking risk tool, while the explicit refusal to recommend a specific refinancing or renegotiation action keeps the output correctly scoped as an internal planning aid rather than something that could be mistaken for actual credit-structuring advice, which needs a real advisor working from the actual credit agreement.`,
    exampleOutput: `Covenant: Minimum liquidity ($500k threshold) | Current: $720k | Headroom: $220k | Rank: tightest. Under the stress scenario (20% EBITDA decline), DSCR would tighten from 1.4x toward roughly 1.1x based on the inputs given, which would breach the 1.25x minimum before the leverage ratio covenant comes under comparable pressure — DSCR is the covenant most likely to trip first under this scenario, using the figures provided.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-fundraising-metrics-story-alignment-check',
    category: 'finance',
    title: `Check whether your fundraising metrics actually support the story you're planning to tell investors`,
    description: `Cross-checks a set of fundraising metrics against the growth narrative a founder plans to pitch, flagging where a metric contradicts or fails to support the story before an investor finds the gap first.`,
    promptText: `I'm preparing metrics for a fundraise and I want you to check whether the numbers I have actually support the story I'm planning to tell — not polish the numbers to fit the story, check for the gap, because an investor doing diligence will find any mismatch I miss.

THE STORY I PLAN TO TELL
{{fundraising_narrative}}

METRICS I HAVE
{{fundraising_metrics}}

STAGE AND ROUND
{{round_stage}}

WHAT INVESTORS AT THIS STAGE TYPICALLY PROBE
{{investor_focus}}

Go through the narrative claim by claim. For each specific claim in the story (e.g., "we have strong retention," "we're capital efficient," "growth is accelerating"), check it against the actual metrics provided and classify it as: Supported (the numbers clearly back this claim), Partially Supported (true in one dimension but a nearby metric complicates it — state exactly which one and how), or Not Supported / Overstated (the metrics don't back this claim as stated, or actively contradict it). Do not soften a Not Supported finding into Partially Supported to avoid an uncomfortable conclusion — if the numbers don't support the claim, say so plainly, since finding this now is strictly better than an investor finding it during diligence. For every Partially Supported or Not Supported finding, propose either a more accurate version of the claim the metrics do support, or the specific additional metric that would need to improve before the original claim could be made honestly.

WHAT NOT TO DO
Do not suggest reframing language whose only function is to make an unsupported claim sound better without changing what it actually asserts — a rewording that obscures rather than corrects a gap defeats the purpose of this check. Do not invent a benchmark for what "strong" retention or "capital efficient" means at this stage as if it were an established fact — note that the bar varies by sector and stage and that this framework works from the internal consistency of the story against the numbers, not an external benchmark claim.

OUTPUT FORMAT
A table: Narrative Claim | Classification | Supporting/Contradicting Metric | Note. Followed by a revised set of claims the metrics actually support cleanly. Close with one line noting this checks internal consistency between story and numbers, and is not a substitute for a fundraising advisor or investor's own diligence standards.`,
    variables: [
      {
        name: 'fundraising_narrative',
        description: `The core claims in the growth story being pitched.`,
        example: `We have strong retention, we're capital efficient relative to peers, and growth is accelerating quarter over quarter`,
        required: true,
      },
      {
        name: 'fundraising_metrics',
        description: `The actual metrics available to check the narrative against.`,
        example: `Gross revenue retention 91%, net revenue retention 104%; burn multiple 1.8x last quarter, 2.3x this quarter; QoQ revenue growth 22%, 19%, 24%, 21% over last 4 quarters`,
        required: true,
      },
      {
        name: 'round_stage',
        description: `The stage and round being raised.`,
        example: `Series A, targeting $8M`,
        required: true,
      },
      {
        name: 'investor_focus',
        description: `What investors at this stage/round are known to scrutinize most.`,
        example: `Series A investors here tend to focus hard on burn multiple trend and whether growth is compounding or plateauing`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`fundraising`, `investor-metrics`, `pitch-prep`, `startup-finance`, `diligence-prep`],
    whyItWorks: `The instruction to check the story against the numbers rather than polish the numbers to fit the story is the entire point of this prompt, and stating it explicitly matters because a model asked generically to "help with fundraising metrics" will often default to a persuasive-writing mode — making the existing story sound as compelling as possible — rather than the more adversarial, verification-oriented task actually being requested here; naming the distinction upfront redirects the model toward the harder, more useful job. The three-way classification (Supported, Partially Supported, Not Supported) rather than a binary yes/no is what makes this catch the failure mode that actually costs founders credibility with investors — the accelerating-growth example given is a real, common case: QoQ growth of 22%, 19%, 24%, 21% is not cleanly accelerating, it's noisy around a roughly flat rate, and a claim of "accelerating" would be the kind of overstatement a sophisticated investor catches within the first few minutes of looking at the raw quarterly numbers, doing real damage to trust in the rest of the deck. The explicit instruction not to soften a Not Supported finding into Partially Supported is a direct guard against a documented tendency in language models to hedge toward more agreeable, less confrontational conclusions when the honest answer is uncomfortable — the entire value of running this check before a pitch, rather than after an investor finds the gap, depends on the model actually being willing to say a claim doesn't hold up. Refusing to invent an external benchmark for what counts as "strong" retention or "capital efficient" keeps the tool honestly scoped to what it can actually verify — internal consistency between the stated story and the numbers given — rather than presenting a fabricated stage-appropriate benchmark as established fact, which the model has no real access to.`,
    exampleOutput: `Narrative claim: "Growth is accelerating quarter over quarter." Classification: Not Supported. Contradicting metric: QoQ growth of 22%, 19%, 24%, 21% over the last four quarters is noisy and roughly flat, not a clear accelerating trend. Note: a more accurate claim the metrics support is "we've sustained 20%+ QoQ growth for four consecutive quarters," which is a real and defensible claim without asserting an acceleration trend the data doesn't show.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'finance-investor-update-bad-news-lead-format',
    category: 'finance',
    title: `Write an investor update that leads with the one piece of bad news instead of burying it in paragraph four`,
    description: `Structures a monthly or quarterly investor update so a genuine piece of bad news is surfaced up front with the plan attached, rather than buried after several paragraphs of good news where investors will notice the burial more than the news itself.`,
    promptText: `Write my investor update for this period. There's a real piece of bad news in here this time, and I want it led with, not buried in paragraph four after the good news — investors notice a buried problem, and the burial itself reads as worse than the problem often is.

PERIOD METRICS
{{period_metrics}}

THE BAD NEWS
{{bad_news_item}}

WHAT WE'RE DOING ABOUT IT
{{mitigation_plan}}

OTHER NOTABLE ITEMS THIS PERIOD
{{other_items}}

ASKS FOR INVESTORS
{{investor_asks}}

Open with the bad news in the first paragraph, stated plainly — what happened, in one or two sentences, with no throat-clearing lead-in. Immediately follow it with the mitigation plan in the same paragraph or the next one — never state a problem without the response attached, since bad news with no attached plan reads as either not-yet-understood or not-yet-being-addressed, both of which are worse than the problem itself. After the bad news and plan are handled, move to the period metrics, stated plainly with the same directness given to the bad news — do not write the good news in more confident, more enthusiastic language than the bad news; consistent tone across both is what makes either one credible. Then cover other notable items briefly. Close with the specific investor asks, each one a concrete thing an investor could actually do (an intro, a specific piece of advice, a decision), not a vague "let us know if you can help."

WHAT NOT TO DO
Do not soften the bad news with hedging language that makes it unclear how serious it actually is — state it at the level of severity I've described, not softer. Do not invent a specific root cause or recovery timeline for the bad news beyond what I've told you — if I haven't given you a timeline for resolution, say that it's still being assessed rather than presenting one you constructed yourself.

OUTPUT FORMAT
A complete investor update email/memo: Bad News + Plan (opening), Period Metrics, Other Notable Items, Asks, sign-off. Keep total length tight — investor updates that run long get skimmed, which defeats the point of leading with the important thing.`,
    variables: [
      {
        name: 'period_metrics',
        description: `The core metrics for this update period.`,
        example: `MRR $410k (flat vs last month); gross margin 68%; cash $2.9M, ~14 months runway`,
        required: true,
      },
      {
        name: 'bad_news_item',
        description: `The actual bad news for this period, stated plainly.`,
        example: `Lost our second-largest customer ($22k MRR) to a competitor's aggressive pricing offer, effective next month`,
        required: true,
      },
      {
        name: 'mitigation_plan',
        description: `What's actually being done in response.`,
        example: `Reviewing pricing for the next 3 renewal-risk accounts this week; adding a 12-month lock-in discount option to reduce this exposure going forward`,
        required: true,
      },
      {
        name: 'other_items',
        description: `Other notable but non-critical updates for the period.`,
        example: `Shipped the new onboarding flow; hired a senior engineer starting next month`,
        required: false,
      },
      {
        name: 'investor_asks',
        description: `Specific things investors could actually help with.`,
        example: `An intro to anyone at [target enterprise logo] we're trying to reach; feedback on the new pricing tiers before we roll them out broadly`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`investor-update`, `startup-communication`, `board-relations`, `transparency`, `fundraising-relationships`],
    whyItWorks: `Leading with bad news rather than burying it addresses a well-known pattern in how investors actually read updates: skimming readers, which most investors are for most updates, form their read of the month largely from the first paragraph, and a bad-news item discovered in paragraph four after several paragraphs of good news reads as if it was being minimized or hidden, which damages trust more than the underlying bad news typically does on its own — leading with it signals the founder isn't managing the narrative, which is itself a credibility-building move. Requiring the mitigation plan to appear immediately attached to the bad news, rather than as a separate later section, matters because bad news presented without a response reads to an investor as either not yet understood or not yet being acted on, and either read is worse than the actual problem in most cases — pairing them in the same breath signals the founder is already on it. Instructing the model to hold the same level of directness for good news and bad news counters a specific stylistic drift models default to: praise language tends to run more enthusiastic and confident than problem language runs plain, and that asymmetry itself is a subtle tell that erodes an investor's trust in the more positive parts of the update, since if the good news get the enthusiastic treatment and the bad news gets softened, a sophisticated reader discounts both. The explicit refusal to invent a specific root cause or recovery timeline beyond what was actually given is a guard against a real risk: a model asked to write confidently about a resolution plan will tend to supply a plausible-sounding timeline on its own, and stating an invented timeline as if it were the founder's actual plan could set an expectation with investors that the founder never actually committed to and may not be able to meet.`,
    exampleOutput: `"Bad news first: we lost our second-largest customer ($22k MRR) to a competitor's aggressive pricing offer, effective next month. We're reviewing pricing for the next three renewal-risk accounts this week and rolling out a 12-month lock-in discount option to reduce this kind of exposure going forward. On the numbers: MRR held flat at $410k this month (this loss takes effect next period), gross margin steady at 68%, cash at $2.9M with about 14 months of runway."`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
