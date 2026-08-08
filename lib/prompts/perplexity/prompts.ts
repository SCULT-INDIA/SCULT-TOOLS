import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'perplexity-deep-research-question-brief',
    category: 'perplexity',
    title:
      'Turn a vague research question into a Deep Research report with a real evidence trail',
    description:
      'A brief for Perplexity Deep Research mode that forces a stated research plan, a recency window, and an evidence table instead of a fluent-sounding single-pass answer.',
    promptText: `Run this as a Deep Research task, not a quick search. Before pulling sources, state the research plan you intend to follow — the sub-questions you will answer and the search angle for each — in two or three lines, then proceed.

RESEARCH QUESTION
{{research_question}}

WHAT THIS IS FOR
{{decision_context}}

SOURCE REQUIREMENTS
- Prioritize: {{must_include_source_types}}
- Recency window: only weight sources inside {{recency_window}} as current. Older sources may be cited for background but must be labeled as background, not current evidence.
- Do not treat one outlet's framing as the finding if other outlets or the underlying primary data disagree — surface the disagreement instead of picking a side silently.

FINAL REPORT FORMAT
1. Answer at a glance — three to five sentences, no hedge that isn't backed by an actual disagreement in the sources.
2. Evidence table — one row per key finding: Finding | Source | Date | Confidence (High/Medium/Low).
3. Where the evidence is thin or contested — name the specific gap, not a generic "more research is needed."
4. Full source list in the order cited.

If the question could reasonably be scoped two different ways, note the alternate scoping as an aside rather than silently picking one and hiding the ambiguity.`,
    variables: [
      {
        name: 'research_question',
        description:
          'The actual question to research, stated precisely enough to be checkable.',
        example:
          'Is on-device small-model inference actually cheaper than cloud API calls at production scale for a mid-size SaaS company in 2026?',
        required: true,
      },
      {
        name: 'decision_context',
        description:
          'What this research will be used to decide, so the report is scoped to what matters.',
        example:
          'Deciding whether to migrate our support-ticket classifier off a hosted API onto local inference this quarter.',
        required: false,
      },
      {
        name: 'must_include_source_types',
        description:
          'Source types to weight heavily, if any — benchmarks, vendor docs, independent analyses, etc.',
        example:
          'independent benchmark writeups and cost breakdowns, not vendor marketing pages',
        required: false,
      },
      {
        name: 'recency_window',
        description: 'How old a source can be and still count as current evidence.',
        example: 'last 9 months',
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Deep Research mode)', 'Perplexity Pro Search'],
    tags: [
      'deep-research',
      'pro-search',
      'research-brief',
      'evidence-table',
      'source-quality',
    ],
    whyItWorks:
      'Perplexity Deep Research runs an iterative loop of dozens of searches and page reads, forming and revising a plan mid-run before it writes the final synthesis — asking it to state that plan up front, in the sub-questions and search angles it will chase, anchors what the planning step actually searches for instead of letting it default to whatever the first page of results converts into steps. Deep Research trades latency for exhaustiveness by design, so naming a decision context and a recency window is a budget instruction, not decoration: it tells the tool what to spend that extra time on rather than spreading equally thin coverage across an unbounded question. Forcing a Finding/Source/Date/Confidence table instead of prose also surfaces disagreement structurally — two rows with the same Finding column and different Confidence values are visibly in tension, where the same disagreement buried in a paragraph reads as one smooth, and misleadingly certain, narrative.',
    exampleOutput:
      'Plan: (1) compare per-token cost of hosted API vs local GPU amortized cost at our volume, (2) check independent benchmarks for accuracy parity on classification tasks, (3) check operational overhead reports from teams who migrated.\n\nAnswer at a glance: At sub-1M requests/month, hosted APIs remain cheaper once you include GPU idle time and maintenance; the crossover point independent benchmarks report is closer to 5-10M requests/month for a classification-sized model.\n\nEvidence table (excerpt): "Crossover near 5-8M req/mo for 7B-class models" | independent infra benchmark, June 2026 | High confidence.',
    verifiedAgainst: [
      {
        tool: 'Perplexity Pro',
        version: 'Deep Research (Sonar-based)',
        date: '2026-07-18',
      },
    ],
    changelog: [
      {
        date: '2026-07-18',
        note: 'Initial publish, verified against Perplexity Pro Deep Research mode.',
      },
    ],
  },
  {
    slug: 'perplexity-space-project-instructions',
    category: 'perplexity',
    title:
      "Give a Perplexity Space persistent instructions so every new thread doesn't start from zero",
    description:
      'A custom-instructions document you paste into a Perplexity Space once, so role, source priorities, and output rules apply automatically to every future thread in that Space.',
    promptText: `SPACE INSTRUCTIONS — {{project_name}}

Apply these instructions to every thread created inside this Space, not only the current one.

ROLE
{{role_or_persona}}

SOURCE PRIORITIES
{{source_priorities}}

Any file uploaded to this Space's Files section is a primary source for questions asked here. When a question could be answered from an uploaded file, check the file before searching the live web, and state explicitly whether an answer is grounded in an uploaded file, the live web, or both — and where the two disagree.

OUTPUT RULES
{{output_format_rules}}

WHAT TO EXCLUDE
{{exclusions}}

If a new thread's question falls outside the scope of {{project_name}}, say so directly instead of quietly answering it as if it belonged here — an unrelated question landing in this Space is a signal it was filed in the wrong place, not something to route around silently.`,
    variables: [
      {
        name: 'project_name',
        description:
          'The name of the ongoing research project this Space is dedicated to.',
        example: 'Competitor Pricing Watch',
        required: true,
      },
      {
        name: 'role_or_persona',
        description: 'The role Perplexity should hold for every thread in this Space.',
        example:
          'A market-research analyst tracking B2B SaaS pricing pages for our category, reporting to a pricing committee.',
        required: true,
      },
      {
        name: 'source_priorities',
        description:
          'Which sources should be trusted first, and which should be treated skeptically.',
        example:
          'Trust vendor pricing pages and SEC filings first; treat third-party "best of" listicles as unreliable for exact pricing.',
        required: true,
      },
      {
        name: 'output_format_rules',
        description: 'Formatting or structure every answer in this Space should follow.',
        example:
          'Always end with a one-line "changed since last thread" note if anything relevant shifted since a prior thread in this Space.',
        required: false,
      },
      {
        name: 'exclusions',
        description:
          'Topics or question types that should be redirected elsewhere rather than answered in this Space.',
        example:
          'General product questions unrelated to pricing or packaging — those belong in the Product Space, not here.',
        required: false,
      },
    ],
    targetTools: ['Perplexity Spaces', 'Perplexity Pro'],
    tags: [
      'spaces',
      'custom-instructions',
      'context-engineering',
      'persistent-project',
      'file-upload',
    ],
    whyItWorks:
      "A single Perplexity thread's context does not carry over into a brand-new thread — Spaces are the actual persistence mechanism the product offers, since instructions and uploaded files attached to a Space apply to every thread created inside it going forward. Writing the role, source priorities, and output rules once at the Space level and pointing every future question at that Space is functionally the same move as a Claude Project's custom instructions or a repo's CLAUDE.md: say the constraint once, inherit it forever, instead of re-explaining sourcing rules in every new thread. The explicit instruction to check uploaded files before the live web, and to name which one an answer is grounded in, matters because Perplexity's default behavior is to search the web regardless of what's already sitting in the Space's Files tab — without being told to weigh the uploaded source first, it can produce an answer that ignores a document you specifically put there to be authoritative.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Spaces (2026)', date: '2026-06-24' },
    ],
    changelog: [
      {
        date: '2026-06-24',
        note: 'Initial publish, verified against Perplexity Spaces custom instructions behavior.',
      },
    ],
  },
  {
    slug: 'perplexity-source-triangulation-check',
    category: 'perplexity',
    title:
      'Force independent corroboration before you trust a claim, not citation-cluster agreement',
    description:
      'A verification prompt that requires a minimum number of genuinely independent sources for a claim, explicitly ruling out citations that all trace back to the same original report.',
    promptText: `Check the following claim against independent sources. Do not treat this as answered until you find at least {{minimum_independent_sources}} sources that are independent of each other — meaning none of them is simply reporting on, quoting, or citing one of the others as its evidence.

CLAIM TO CHECK
{{claim}}

RULES FOR WHAT COUNTS AS INDEPENDENT
- A news article that cites a press release, and the press release itself, are the same source, not two.
- Two outlets that both cite the same single study or the same wire report are the same source, not two.
- {{exclude_as_sole_evidence}} may be cited for context but does not count toward the independent-source minimum on its own.

OUTPUT
1. For each independent source found: what it actually says, in its own words or data — not a paraphrase that smooths over a difference between sources.
2. A one-line note on whether the sources agree, partially agree, or conflict. If they conflict, say what the disagreement is actually about — methodology, timeframe, definition — not just "sources disagree."
3. If you cannot find {{minimum_independent_sources}} truly independent sources, say so plainly instead of padding the list with derivative coverage to hit the number.`,
    variables: [
      {
        name: 'claim',
        description:
          'The specific claim to triangulate, stated as precisely as possible.',
        example:
          'A recent survey found that 40% of enterprise buyers now require an AI usage policy from vendors before signing a contract.',
        required: true,
      },
      {
        name: 'minimum_independent_sources',
        description:
          'How many independent sources must corroborate the claim before it counts as verified.',
        example: '3',
        required: true,
      },
      {
        name: 'exclude_as_sole_evidence',
        description:
          'Source types that should never count as the only evidence for the claim.',
        example: "Wikipedia, the vendor's own press release, single-author blog posts",
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro Search'],
    tags: [
      'source-triangulation',
      'fact-checking',
      'verification',
      'research-methodology',
      'citation-quality',
    ],
    whyItWorks:
      'Search-grounded answer engines have a documented failure mode of citation clustering — returning several citations that look like independent corroboration but are actually all downstream of one wire story or one press release repeating the same original claim. Explicitly defining what counts as independent, rather than just asking for "multiple sources," closes the exact loophole a citation count alone leaves open: a naive count treats five outlets quoting the same PR blast as five sources instead of one. Setting a numeric minimum forces the retrieval step to keep searching past the first agreeing cluster it finds, since stopping early would visibly fail the stated bar, and requiring the model to admit when it cannot reach that minimum prevents the alternative failure mode — padding a thin result with derivative coverage just to appear to have satisfied the requirement.',
    exampleOutput:
      "Source 1 (survey publisher, primary data): reports 41% of 500 surveyed enterprise buyers.\nSource 2 (independent industry outlet, own reporting): cites the same underlying survey but adds context from three named buyers confirming the policy requirement independently.\nSource 3: could not be verified as independent — it cites Source 1's press release only.\n\nVerdict: only 2 independent sources found, not the 3 requested. The 40% figure traces to one survey; corroboration beyond that survey is currently thin.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-05' },
    ],
    changelog: [
      {
        date: '2026-07-05',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-citation-accuracy-audit',
    category: 'perplexity',
    title: "Audit a Perplexity answer's citations before you rely on any of them",
    description:
      'A follow-up prompt that re-checks every numbered citation in a prior Perplexity answer against the actual source text, catching claims attached to a citation that only loosely supports them.',
    promptText: `Audit the accuracy of every citation in the answer below. This is a verification pass, not a rewrite — do not change or improve the original answer's wording.

ORIGINAL QUESTION
{{original_question}}

ANSWER TO AUDIT (with its citation markers and links, unedited)
{{perplexity_answer_text}}

FOR EACH CITED CLAIM
1. Open the actual source behind the citation marker.
2. State whether the source's own text directly supports the specific claim it is attached to, partially supports it, or does not support it at all.
3. If a citation supports a more general or a slightly different claim than the one it's attached to, say exactly what the gap is — do not mark it as supported just because it's topically related.
4. Flag any claim in the answer that has no citation attached at all.

OUTPUT FORMAT
A table: Claim | Citation # | Verdict (Supported / Partially Supported / Not Supported / Uncited) | What the source actually says.
End with one overall line on whether this answer is safe to cite further without independent verification.`,
    variables: [
      {
        name: 'perplexity_answer_text',
        description:
          'The prior Perplexity answer to audit, including its citation numbers and the source links Perplexity showed.',
        example:
          '"Company X\'s revenue grew 22% year over year [1], driven mainly by its enterprise segment [2]." with [1] and [2] linking to a Q2 earnings article and a separate product-launch blog post.',
        required: true,
      },
      {
        name: 'original_question',
        description: 'The question that produced the answer being audited, for context.',
        example: "What drove Company X's revenue growth last quarter?",
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro Search'],
    tags: [
      'citation-verification',
      'fact-checking',
      'quality-audit',
      'research-methodology',
    ],
    whyItWorks:
      "AI search tools have a known drift where a citation marker is attached to the correct general topic but not to the specific number or claim in that sentence — for example a growth percentage cited to an article that discusses the same company's growth but reports a different figure or period. Pasting the answer back in as a distinct verification task, rather than asking the same thread to double-check itself, narrows the job to something checkable: does this specific source text support this specific sentence, yes or no, rather than regenerating a fresh answer that could introduce new unverified claims. The instruction to flag partial support instead of a binary supported/not-supported catches the most common and most dangerous failure mode — a citation that is topically real but attached to a claim it doesn't actually make — which a looser audit would wave through as accurate simply because the link isn't broken.",
    exampleOutput:
      'Claim: "revenue grew 22% year over year" | Citation 1 | Partially Supported | The earnings article reports 19% year-over-year growth for the quarter referenced, not 22% — the 22% figure appears to be a different metric (sequential growth) in the same article, likely conflated.\n\nOverall: not safe to cite further without checking the exact growth figure against the primary earnings release.',
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-12' },
    ],
    changelog: [
      {
        date: '2026-07-12',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro.',
      },
    ],
  },
  {
    slug: 'perplexity-academic-literature-scan',
    category: 'perplexity',
    title:
      'Run an Academic-focus literature scan that surfaces methodology, not just conclusions',
    description:
      "A literature-scan prompt for Perplexity's Academic focus mode that forces a study-by-study synthesis table including sample size and stated limitations, not a flattened conclusions list.",
    promptText: `Use Academic focus / academic search mode for this so retrieval is scoped to peer-reviewed and scholarly sources rather than general web content.

TOPIC
{{research_topic}}

FIELD
{{field_or_discipline}}

SCOPE
- Publication window: {{year_range}}
- Find at least {{minimum_studies}} distinct studies — not {{minimum_studies}} citations that all trace back to the same handful of studies.
- {{specific_methodology_focus}}

OUTPUT FORMAT
A synthesis table, one row per study: Study (author, year) | Sample / Method | Key Finding | Stated Limitations | Link.

After the table:
1. Where the studies agree.
2. Where they genuinely conflict, and whether the conflict traces to different methods, populations, or definitions — not a vague "mixed results."
3. The single biggest gap in this literature as it stands relative to the topic above.

Do not summarize a study's conclusion without also giving its stated limitations — a finding reported without its own caveats is not a faithful summary of the paper.`,
    variables: [
      {
        name: 'research_topic',
        description:
          'The specific question or phenomenon the literature scan should address.',
        example:
          'Does spaced-repetition scheduling improve long-term retention more than fixed-interval review for adult learners?',
        required: true,
      },
      {
        name: 'field_or_discipline',
        description: 'The academic field to scope the search within.',
        example: 'cognitive psychology / educational psychology',
        required: false,
      },
      {
        name: 'year_range',
        description: 'The publication window to search within.',
        example: '2015-2026',
        required: false,
      },
      {
        name: 'minimum_studies',
        description: 'The minimum number of distinct studies the scan must surface.',
        example: '6',
        required: false,
      },
      {
        name: 'specific_methodology_focus',
        description:
          'Any methodology constraint worth naming, such as requiring randomized studies over correlational ones.',
        example:
          'Prioritize randomized controlled trials over observational or self-report studies where both exist.',
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Academic focus)', 'Perplexity Pro Search'],
    tags: [
      'academic-focus',
      'literature-review',
      'research',
      'synthesis-table',
      'methodology',
    ],
    whyItWorks:
      "Perplexity's Academic focus mode scopes retrieval toward indexed journals and preprint servers instead of general web content, which changes what is even eligible to show up as a source — a plain-web query on the same topic will surface summary blog posts and course pages ahead of the actual papers. Forcing a synthesis table with a dedicated Stated Limitations column matters because a plain narrative summary of academic findings tends to report the headline conclusion and drop the caveats the paper itself used to bound that conclusion — sample size, population, effect size — which is exactly the information a reader needs to judge how far the finding generalizes. Requiring the conflict analysis to name a mechanism (different methods, populations, or definitions) rather than accept 'mixed results' forces genuine synthesis instead of a list of study summaries sitting next to each other with no actual comparison performed.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Academic focus (2026)', date: '2026-06-30' },
    ],
    changelog: [
      {
        date: '2026-06-30',
        note: 'Initial publish, verified against Perplexity Pro Academic focus mode.',
      },
    ],
  },
  {
    slug: 'perplexity-competitor-landscape-space',
    category: 'perplexity',
    title:
      'Build a living competitor-comparison table inside a Space instead of a one-off answer',
    description:
      'A recurring competitive-research prompt designed to run inside a Perplexity Space, with fixed comparison columns and per-cell citations so the table can be safely re-run and extended over time.',
    promptText: `This question is part of an ongoing competitive research project — treat it as one round of a comparison table that will keep growing across future threads in this Space, not a standalone answer.

OUR COMPANY / PRODUCT
{{your_company}}

COMPETITORS TO COVER THIS ROUND
{{competitor_list}}

COMPARISON DIMENSIONS (keep these exact column headers every time this is run again)
{{comparison_dimensions}}

INDUSTRY CONTEXT
{{industry_context}}

OUTPUT FORMAT
A table: Competitor | {{comparison_dimensions}} — one citation per cell, not one citation covering the whole row. If a cell cannot be filled from a verifiable source, write "not publicly disclosed" rather than estimating a number and presenting it as fact.

After the table, one paragraph: what changed about the competitive picture since the last obvious public update from any of these competitors — product launch, pricing change, funding, leadership change — and flag anything time-sensitive as provisional rather than settled.`,
    variables: [
      {
        name: 'your_company',
        description: 'Your own company or product, for framing the comparison.',
        example: 'Northwind Analytics, a mid-market marketing attribution platform',
        required: true,
      },
      {
        name: 'competitor_list',
        description: 'The competitors to include in this round of the comparison.',
        example: 'Attribution.io, Ruler Analytics, Dreamdata',
        required: true,
      },
      {
        name: 'comparison_dimensions',
        description:
          'The fixed set of columns to compare on, kept identical across runs so the table stays comparable.',
        example:
          'Starting price, Free tier, Attribution model type, G2 rating, Last major feature launch',
        required: true,
      },
      {
        name: 'industry_context',
        description: 'Brief context on the market or category this comparison sits in.',
        example:
          'B2B marketing attribution software, mid-market segment ($10k-$100k ACV)',
        required: false,
      },
    ],
    targetTools: ['Perplexity Spaces', 'Perplexity Pro Search'],
    tags: [
      'competitive-research',
      'market-research',
      'spaces',
      'comparison-table',
      'due-diligence',
    ],
    whyItWorks:
      "Running this inside a Space rather than a one-off thread is the mechanic that makes the table durable: the Space's own instructions and thread history let you fix the comparison dimensions once and re-run the same shape of question in a new thread weeks later without redefining the columns from scratch, which is what turns a snapshot into a genuinely maintained comparison. Requiring one citation per cell instead of one per row closes a specific failure mode of table generation — a single strong source about Competitor A's pricing can otherwise get silently reused to justify a claim about Competitor A's rating or Competitor B's pricing in an adjacent cell, because the model is filling in a grid, not verifying each fact independently. Instructing 'not publicly disclosed' instead of an estimate matters because a competitive table that quietly fills every cell reads as more complete and more certain than the underlying public sourcing actually supports, which is worse for decision-making than an honest gap.",
    exampleOutput:
      'Attribution.io | $499/mo | No | Multi-touch, rules-based | 4.4/5 (G2, 210 reviews) | AI-assisted channel grouping, announced May 2026\nRuler Analytics | not publicly disclosed | No | First-touch + multi-touch | 4.6/5 (G2, 95 reviews) | not publicly disclosed\n\nSince the last round: Attribution.io shipped AI-assisted channel grouping in May 2026 — treat competitive parity claims about "manual grouping only" as outdated after that date.',
    verifiedAgainst: [
      {
        tool: 'Perplexity Pro',
        version: 'Spaces + Sonar Pro (2026)',
        date: '2026-07-09',
      },
    ],
    changelog: [
      {
        date: '2026-07-09',
        note: 'Initial publish, verified against Perplexity Spaces with Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-claim-fact-check',
    category: 'perplexity',
    title: "Fact-check one specific claim with a verdict you can't hedge around",
    description:
      'A closed-verdict fact-checking prompt that requires quoting the exact claim, weighing real counter-evidence, and committing to one of six named verdicts rather than a vague "it depends."',
    promptText: `Fact-check this exact claim. Quote it back to me first to confirm you are checking the actual wording, not a softened paraphrase of it.

CLAIM (verbatim)
{{exact_claim}}

WHERE I SAW IT
{{claim_source}}

CONTEXT THAT MIGHT MATTER
{{context}}

PROCESS
1. Confirm the precise, checkable assertion in the claim — if it bundles more than one assertion, separate them and check each on its own.
2. Find the best available evidence for it and the best available evidence against it. If you genuinely cannot find real counter-evidence, say that explicitly rather than inventing a weak devil's-advocate case just to appear balanced.
3. Give one verdict per assertion: True, False, Mostly True, Mostly False, Mixed, or Unverifiable. No other verdict labels.
4. Justify the verdict in two or three sentences citing the actual sources, not the general reputation of whoever made the claim.

Do not soften a False verdict into "this is disputed" if the weight of verifiable evidence actually points one way.`,
    variables: [
      {
        name: 'exact_claim',
        description:
          'The claim to check, quoted exactly as it was made — not your summary of it.',
        example:
          '"Remote workers are 23% more productive than in-office workers, according to a Stanford study."',
        required: true,
      },
      {
        name: 'claim_source',
        description: 'Where the claim was encountered, if known.',
        example: 'A LinkedIn post from a remote-work software vendor',
        required: false,
      },
      {
        name: 'context',
        description:
          'Any surrounding context that might affect how the claim should be interpreted.',
        example: "The post doesn't specify which Stanford study or what year.",
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro Search'],
    tags: ['fact-checking', 'claim-verification', 'verdict-schema', 'misinformation'],
    whyItWorks:
      "Quoting the exact claim back before checking it matters because the search step queries on the literal wording — a paraphrase can drift toward a softer version of the claim that was never actually asserted, and the model ends up 'verifying' a statement nobody made. Forcing a closed set of six verdict labels prevents the most common failure mode of open-ended fact-checking, where a model defaults to a non-committal 'this is complicated' that sounds careful but commits to nothing a reader can act on. Requiring genuine counter-evidence, and permitting the model to say none exists rather than manufacturing a weak opposing case, guards against a subtler failure — synthetic balance, where a model invents a flimsy 'on the other hand' argument purely to look even-handed, which actually makes a true claim look more contested than the evidence supports.",
    exampleOutput:
      'Claim confirmed: "Remote workers are 23% more productive than in-office workers, according to a Stanford study."\n\nAssertion: a specific Stanford study found a 23% productivity gap favoring remote work.\n\nVerdict: Mostly False. A widely cited 2015 Stanford study (Bloom et al.) found a roughly 13% productivity gain for a specific call-center task under a structured work-from-home arrangement, not a general 23% figure, and it does not generalize to knowledge work broadly. No Stanford study reporting 23% could be located; this figure appears to be a commonly repeated distortion of the original number.',
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-14' },
    ],
    changelog: [
      {
        date: '2026-07-14',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro.',
      },
    ],
  },
  {
    slug: 'perplexity-labs-mini-report-brief',
    category: 'perplexity',
    title:
      'Brief Perplexity Labs to produce a report, a data table, and a dashboard in one pass',
    description:
      'A deliverables-first brief for Perplexity Labs that names each output asset explicitly, so a multi-step research task produces a linked report, spreadsheet, and simple dashboard instead of just a written summary.',
    promptText: `Run this as a Labs task. I want more than a chat answer — build each of these as a distinct, linked asset in the same task, not just a written summary:

DELIVERABLES REQUIRED
{{required_assets}}

TOPIC / BRIEF
{{deliverable_topic}}

WHO THIS IS FOR
{{audience}}

DATA REQUIREMENTS
{{data_requirements}}

RULES
- The written report and the data table must agree with each other — if the report states a number, that number must appear in the table alongside its source, not only in prose.
- Any chart or dashboard view must be built from the data table produced in this same task, not from a separate, unlinked source.
- Cite sources on the data table itself, not only in the written report.
- If a requested asset genuinely cannot be built from available data — for example no public data exists for one comparison point — say so on that specific asset instead of quietly omitting it from the final deliverable set.`,
    variables: [
      {
        name: 'required_assets',
        description: 'The exact list of output assets Labs should produce in this task.',
        example:
          'a two-page written report, a spreadsheet of the underlying comparison data, and a simple one-page dashboard summarizing the top 3 findings',
        required: true,
      },
      {
        name: 'deliverable_topic',
        description: 'The topic or brief the deliverables should cover.',
        example:
          'Compare the total cost of ownership of three CRM platforms for a 40-person sales team over 3 years.',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who will read or use these deliverables.',
        example: 'Our VP of Sales, who needs to justify a platform switch to finance',
        required: false,
      },
      {
        name: 'data_requirements',
        description:
          'Specifics about what the underlying data should include or how it should be structured.',
        example:
          'Break costs into licensing, implementation, and estimated migration cost separately, not as one bundled number.',
        required: false,
      },
    ],
    targetTools: ['Perplexity Labs'],
    tags: ['perplexity-labs', 'mini-report', 'data-table', 'dashboard', 'deliverables'],
    whyItWorks:
      "Perplexity Labs is the slower, agentic mode built to output more than one artifact type per run — a written document, a spreadsheet of the underlying data, and a simple web page or dashboard — instead of a single chat-style answer, and it decides for itself which of those output types to bother building based on how open-ended the request reads. Naming the exact deliverable list up front removes that judgment call: an open request like 'research this and give me a report' can come back as text only, while explicitly listing a report, a spreadsheet, and a dashboard as required assets makes Labs treat each as a distinct commitment. The rule that the report and the table must agree, and that any chart must be built from that same table, exists because a multi-asset agentic task can otherwise generate each artifact from a slightly different pass over the sources, producing a report and a spreadsheet that quietly disagree with each other on the same number — linking them forces internal consistency instead of three separately-sourced outputs bundled together.",
    verifiedAgainst: [{ tool: 'Perplexity Labs', version: '2026', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Perplexity Labs multi-asset output mode.',
      },
    ],
  },
  {
    slug: 'perplexity-find-primary-source',
    category: 'perplexity',
    title:
      'Trace a stat or quote back to its actual primary source, not the article repeating it',
    description:
      'A citation-chain-walking prompt that instructs Perplexity to keep tracing backward past news aggregators until it reaches the original filing, dataset, or statement a widely repeated figure actually came from.',
    promptText: `Find the primary source behind this — the original document, filing, dataset, speech, or press release — not the most convenient article that mentions it.

STATISTIC OR QUOTE
{{statistic_or_quote}}

WHERE I FIRST SAW IT
{{where_you_saw_it}}

WHAT I'M GUESSING IT'S ABOUT
{{suspected_topic}}

PROCESS
1. Do not stop at the first news article or blog post that repeats this — treat that as a lead, not an answer.
2. Follow the citation chain backward: who did that article cite, and who did that source cite, until you reach something that is itself the original document rather than a summary of one.
3. If the trail dead-ends — the original source is paywalled, unlinked, or you genuinely cannot verify it exists — say exactly where the trail broke rather than presenting the last secondary source as if it were primary.
4. Once found, quote the exact relevant passage or number from the primary source itself, and note whether any secondary coverage along the way misquoted, rounded, or subtly changed it.`,
    variables: [
      {
        name: 'statistic_or_quote',
        description:
          'The specific number, statistic, or quote to trace back to its origin.',
        example: '"70% of AI projects fail to reach production"',
        required: true,
      },
      {
        name: 'where_you_saw_it',
        description: 'Where you first encountered the statistic or quote.',
        example: 'A conference keynote slide, no source cited on the slide itself',
        required: false,
      },
      {
        name: 'suspected_topic',
        description:
          'A guess at the broader topic or report this might trace back to, if any.',
        example: 'Possibly a Gartner or McKinsey survey on enterprise AI adoption',
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro Search'],
    tags: ['primary-source', 'citation-tracing', 'fact-checking', 'research-methodology'],
    whyItWorks:
      "A search-grounded answer engine's default behavior is to surface whichever page ranks best for the query, which is almost always a summary or aggregator article, not the original document — because ranking well and being first-to-publish are unrelated properties. Explicitly instructing the model to treat the first result as a lead rather than an answer, and to keep asking 'who did this cite' recursively, converts a single retrieval hop into a citation-chain walk, which is the actual mechanism needed to reach a primary source instead of the most convenient secondary one. Requiring it to name exactly where the trail broke, rather than quietly presenting the last thing it found as primary, matters because an unverifiable claim that looks resolved is more dangerous than one that's honestly marked unresolved — the whole point of the exercise is knowing which one you have.",
    exampleOutput:
      'Trail: conference slide (no source) -> a 2023 tech blog post citing "an industry report" with no link -> a 2022 news article citing "a recent Gartner survey" -> Gartner press release, October 2022, which actually states 85% of AI projects fail to reach production, not 70%.\n\nThe primary source is the Gartner press release, and the widely repeated "70%" figure appears to be a rounding or misquote drift introduced somewhere in the secondary coverage chain.',
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-06-28' },
    ],
    changelog: [
      {
        date: '2026-06-28',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-trend-analysis-with-citations',
    category: 'perplexity',
    title:
      'Map a trend across time with a dated citation for every data point, not a snapshot',
    description:
      'A trend-analysis prompt that requires a chronological, dated citation table and an explicit split between a real structural shift and a one-off headline dressed up as a trend.',
    promptText: `Analyze this as a trend over time, not a single current snapshot. Every data point needs its own date and citation — a trend claim with no dates attached is not a trend claim.

TREND TO ANALYZE
{{trend_topic}}

TIME WINDOW
{{time_window}}

MARKET / GEOGRAPHY
{{geography_or_market}}

METRIC TO TRACK
{{metric_focus}}

OUTPUT FORMAT
1. A chronological table: Date | Data point or event | Source. Sorted oldest to newest.
2. A short narrative distinguishing a real structural shift — sustained direction backed by multiple dated points — from noise: a single headline, a one-off event, or a seasonal blip that looks like a trend but isn't.
3. Flag explicitly if the most recent one or two data points might be too new to confirm the trend is continuing, rather than extrapolating confidently off a single recent point.
4. What would have to happen for this trend to reverse, based on what the sources say is actually driving it.`,
    variables: [
      {
        name: 'trend_topic',
        description: 'The trend to analyze.',
        example: 'Adoption of usage-based pricing among B2B SaaS companies',
        required: true,
      },
      {
        name: 'time_window',
        description: 'The time span the analysis should cover.',
        example: '2021 to present',
        required: true,
      },
      {
        name: 'geography_or_market',
        description: 'The market or geography to scope the trend to, if relevant.',
        example: 'North American mid-market SaaS',
        required: false,
      },
      {
        name: 'metric_focus',
        description: 'The specific metric or signal that should anchor each data point.',
        example:
          '% of new SaaS pricing pages listing usage-based tiers as the default option',
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro Search'],
    tags: ['trend-analysis', 'market-research', 'citations', 'chronological-analysis'],
    whyItWorks:
      "Asked for a trend without structural constraints, a model tends to answer with the current state framed as if it were the whole trend, because the most recent and most abundant sources are about now, not about the shape of change over time. Forcing every row of the output to carry its own date converts an impressionistic 'this is growing' into a chronological table a reader can actually eyeball for direction, gaps, and inflection points. The explicit instruction to separate structural shift from noise directly counters a specific and common error — treating a single recent headline as proof of a trend, when trend claims require multiple dated points moving the same direction, not one data point plus a narrative. Flagging the newest points as potentially unconfirmed also guards against the model's tendency to extrapolate a clean line through the most recent, least-verified data, which is exactly where a trend narrative is most likely to be wrong.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-02' },
    ],
    changelog: [
      {
        date: '2026-07-02',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-company-due-diligence-brief',
    category: 'perplexity',
    title:
      'Run a structured due-diligence brief on a company across fixed categories, not a vague overview',
    description:
      'A category-by-category due diligence brief covering corporate basics, leadership, financial signals, legal risk, and reputation, with explicit "should verify independently" flags on single-sourced claims.',
    promptText: `Run a due diligence brief on this company. This is being used for {{diligence_purpose}}, so weight what you surface accordingly — a brief for a vendor decision and one for an investment decision should not look identical.

COMPANY
{{company_name}}

JURISDICTION / MARKET
{{jurisdiction}}

SPECIFIC AREAS TO PRIORITIZE
{{focus_areas}}

CATEGORIES (cover every one — say "nothing significant found" rather than skipping a category silently)
1. Corporate basics — legal entity, ownership structure, founding date, headquarters, size (employees/revenue if disclosed).
2. Leadership — key executives, notable prior roles, any recent leadership departures and, if reported, why.
3. Financial signals — funding history, public financials if applicable, credit or rating signals, anything suggesting financial distress.
4. Legal and regulatory — active litigation, regulatory actions, sanctions, or significant past settlements.
5. Reputation and recent news — the last 6-12 months of coverage, separating substantive news from routine PR.
6. Red flags — anything that appears in only one outlet, is disputed, or you could not independently verify — mark this "should verify independently," not as settled fact.

Do not synthesize a cleaner story than the sourcing actually supports — if two sources disagree on a material fact, present both and say so.`,
    variables: [
      {
        name: 'company_name',
        description: 'The company to research.',
        example: 'Meridian Cloud Systems Inc.',
        required: true,
      },
      {
        name: 'diligence_purpose',
        description: 'Why this brief is being run, so emphasis is weighted correctly.',
        example:
          'evaluating them as a data-processing vendor before a contract signature',
        required: true,
      },
      {
        name: 'jurisdiction',
        description: 'The jurisdiction or market context relevant to the company.',
        example: 'Incorporated in Delaware, primary operations in the US and UK',
        required: false,
      },
      {
        name: 'focus_areas',
        description:
          'Any specific concern that should get extra attention beyond the standard categories.',
        example:
          'Their data-handling and breach history specifically, since this is for a data-processing agreement.',
        required: false,
      },
    ],
    targetTools: [
      'Perplexity Pro (Sonar Pro)',
      'Perplexity Comet',
      'Perplexity Pro Search',
    ],
    tags: ['due-diligence', 'company-research', 'vendor-vetting', 'risk-assessment'],
    whyItWorks:
      "Partitioning the brief into fixed named categories — corporate basics, leadership, financial signals, legal and regulatory, reputation, red flags — forces coverage of areas a narrower 'tell me about this company' would not reliably surface, the same mechanic behind a structured code-review rubric: closed categories with a required verdict per category prevent silent gaps, since skipping one is visibly different from filling it with 'nothing significant found.' For a task that benefits from browsing several distinct source types directly, such as an investor-relations page, a court records search, and a company's own careers or leadership page, running this through Perplexity Comet's agentic browsing lets the same brief navigate to each of those pages directly rather than relying only on what a search index has already crawled. The explicit 'should verify independently' flag on single-sourced claims keeps the synthesis honest about its own confidence level — a due diligence brief that reads as uniformly certain is more dangerous than one that visibly marks its own weak points.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-27' },
      { tool: 'Perplexity Comet', version: '2026 browser agent', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro and Perplexity Comet.',
      },
    ],
  },
  {
    slug: 'perplexity-whats-changed-since-last-check',
    category: 'perplexity',
    title:
      'Get only what changed since you last checked, not the whole topic re-explained',
    description:
      'A recurring monitoring prompt that anchors to a prior summary and cutoff date so each re-run reports only material changes since then, instead of a fresh full explanation every time.',
    promptText: `I already know the state of this as of {{last_checked_date}} — do not re-explain what's below, treat it as ground truth for what I already know.

TOPIC
{{topic_or_space_name}}

WHAT I ALREADY KNOW (as of {{last_checked_date}})
{{prior_summary}}

TASK
Search only for information dated after {{last_checked_date}}. Report only what is new or has materially changed since then — {{change_threshold}}.

RULES
- If nothing material changed, say that in one line. Do not manufacture a change out of routine, non-material coverage just to have something to report.
- For each change: what changed, the date it happened or was reported, and the source.
- If a change contradicts or updates something in what I already know above, say so explicitly — "this replaces/updates X above" — rather than adding it alongside without connecting it.
- Do not repeat anything from the prior summary above unless it is necessary context for understanding a new change.`,
    variables: [
      {
        name: 'topic_or_space_name',
        description: 'The topic being monitored over time.',
        example: 'Regulatory status of AI usage disclosure requirements in the EU',
        required: true,
      },
      {
        name: 'last_checked_date',
        description:
          'The date of the last check, used as the cutoff for what counts as new.',
        example: '2026-06-15',
        required: true,
      },
      {
        name: 'prior_summary',
        description:
          'The summary or answer from the last time this was checked, pasted in as the baseline.',
        example:
          'As of June 15, the EU AI Act disclosure requirements for general-purpose AI models were finalized but enforcement guidance was still pending from national regulators.',
        required: true,
      },
      {
        name: 'change_threshold',
        description:
          'What counts as material enough to report, to filter out minor or irrelevant updates.',
        example:
          'only changes that affect our compliance deadline or disclosure format, not general commentary or opinion pieces',
        required: false,
      },
    ],
    targetTools: ['Perplexity Spaces', 'Perplexity Pro (Sonar Pro)'],
    tags: ['monitoring', 'recurring-research', 'change-tracking', 'spaces'],
    whyItWorks:
      "A new Perplexity thread has no memory of a previous thread's answer, and even within a Space, a fresh question tends to get re-answered from scratch rather than diffed against what was already established — so the mechanic here is re-anchoring by hand: pasting the prior summary and its cutoff date back in as literal input turns a stateless lookup into a de facto recurring monitor. Restricting the search to dates after the cutoff, rather than asking a general question again, is what actually prevents the tool from re-surfacing and re-explaining facts that were already known, since without that constraint a fresh search naturally re-finds the same background sources it found last time and reports them as if new. The instruction to connect a new finding back to a specific line in the prior summary — 'this replaces X above' — matters because a list of updates with no stated relationship to prior knowledge leaves the reader to do the diffing themselves, which defeats the purpose of asking for only what changed in the first place.",
    exampleOutput:
      'Since June 15: national enforcement guidance was published July 28 by the relevant EU authority, specifying a phased disclosure rollout — this replaces the "enforcement guidance still pending" line in what you already know above. No other material changes found; two opinion pieces about the Act appeared in trade press but contain no new regulatory information.',
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Spaces + Sonar Pro', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Perplexity Spaces with Sonar Pro search.',
      },
    ],
  },
]
