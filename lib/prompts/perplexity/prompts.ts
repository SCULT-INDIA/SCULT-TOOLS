import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'perplexity-deep-research-question-brief',
    category: 'perplexity',
    title:
      'Turn a vague research question into a Deep Research report with a real evidence trail',
    description:
      'A brief for Perplexity Deep Research mode that forces a stated research plan, named source priorities, a recency window, and a Finding/Source/Date/Confidence table instead of a fluent-sounding single-pass answer.',
    promptText: `Run this as a Deep Research task, not a quick search. Before pulling any sources, state the research plan you intend to follow — the sub-questions you will answer and the search angle for each one — in three to five lines, then proceed with that plan. If you have to revise the plan mid-run because early results point somewhere the original plan didn't anticipate, say so explicitly rather than quietly following the new direction without flagging the change.

RESEARCH QUESTION
{{research_question}}

WHAT THIS IS FOR
{{decision_context}}

SOURCE REQUIREMENTS
- Prioritize: {{must_include_source_types}}
- Actively deprioritize: {{excluded_source_types}} — these may appear in search results but should not anchor a finding on their own.
- Recency window: only weight sources inside {{recency_window}} as current evidence. Older sources may be cited for background or historical context, but must be explicitly labeled as background, not as support for a current claim.
- Do not treat one outlet's framing of a fact as the fact itself if other outlets, or the underlying primary data, frame it differently — surface the disagreement in the framing rather than silently adopting the first version you found.

WHAT WOULD CHANGE THE ANSWER
Before finalizing, note explicitly what kind of new evidence — a specific study, a specific data release, a specific event — would be strong enough to change the answer you're about to give. If nothing you found would plausibly change your answer, say that too; it's a useful signal about how settled the question actually is.

FINAL REPORT FORMAT
1. Answer at a glance — three to five sentences, with no hedge word ("may," "could," "possibly") that isn't backed by an actual, named disagreement in the sources rather than generic caution.
2. Evidence table — one row per key finding: Finding | Source | Date | Confidence (High/Medium/Low). Confidence should reflect how many independent sources agree and how directly each one addresses the specific finding, not how confidently any single source states it.
3. Where the evidence is thin or contested — name the specific gap (a missing data point, a methodology disagreement, a claim only one outlet makes) rather than a generic "more research is needed."
4. Full source list in the order first cited, with publication dates.

If the original question could reasonably be scoped two different ways — a narrower reading and a broader one — note the alternate scoping as an aside and explain which one you answered, rather than silently picking one and hiding that a choice was made.`,
    variables: [
      {
        name: 'research_question',
        description:
          'The actual question to research, stated precisely enough to be checkable against the final answer.',
        example:
          'Is on-device small-model inference actually cheaper than cloud API calls at production scale for a mid-size SaaS company in 2026?',
        required: true,
      },
      {
        name: 'decision_context',
        description:
          'What this research will be used to decide, so the report is scoped to what actually matters for that decision.',
        example:
          'Deciding whether to migrate our support-ticket classifier off a hosted API onto local inference this quarter.',
        required: true,
      },
      {
        name: 'must_include_source_types',
        description:
          'Source types to weight heavily, if any — benchmarks, vendor docs, independent analyses, regulatory filings, etc.',
        example:
          'independent benchmark writeups and infrastructure cost breakdowns, not vendor marketing pages',
        required: false,
      },
      {
        name: 'excluded_source_types',
        description:
          'Source types that should be treated as unreliable evidence for this specific question, even if they appear in search results.',
        example:
          'affiliate-linked "best AI tools" listicles and any article that reads as sponsored content',
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
      'decision-support',
    ],
    whyItWorks:
      "Perplexity Deep Research runs an iterative loop of dozens of searches and page reads, forming and revising a plan mid-run before it writes the final synthesis — asking it to state that plan up front, in the sub-questions and search angles it will chase, anchors what the planning step actually searches for instead of letting it default to whatever the first page of results happens to convert into steps. Deep Research trades latency for exhaustiveness by design, so naming a decision context and a recency window is a budget instruction, not decoration: it tells the tool what to spend that extra time on rather than spreading equally thin coverage across an unbounded question, and it tells the tool which of two technically-correct-but-differently-scoped answers is the one you actually need. Forcing a Finding/Source/Date/Confidence table instead of prose also surfaces disagreement structurally — two rows with the same Finding column and different Confidence values are visibly in tension, where the same disagreement buried in a paragraph reads as one smooth, and misleadingly certain, narrative. The 'what would change the answer' step does something a report format alone cannot: it forces the model to commit to a falsifiability condition instead of hedging indefinitely, which is the actual difference between a research report that helps a decision get made and one that reads well but leaves every option still open. And the deprioritized-source-types field matters because Deep Research's retrieval step will happily surface a well-optimized listicle or a sponsored comparison page if it ranks well for the query — naming what to discount doesn't remove those pages from the search results, but it stops them from anchoring a Confidence rating they haven't earned.",
    exampleOutput:
      'Plan: (1) compare per-token cost of hosted API vs local GPU amortized cost at our volume, (2) check independent benchmarks for accuracy parity on classification tasks, (3) check operational overhead reports from teams who migrated.\n\nAnswer at a glance: At sub-1M requests/month, hosted APIs remain cheaper once you include GPU idle time and maintenance; the crossover point independent benchmarks report is closer to 5-10M requests/month for a classification-sized model.\n\nEvidence table (excerpt): "Crossover near 5-8M req/mo for 7B-class models" | independent infra benchmark, June 2026 | High confidence.\n\nWhat would change this: a sustained drop in GPU spot pricing below current levels, or a hosted provider cutting per-token pricing by more than 30% — neither appears imminent based on current vendor announcements.',
    verifiedAgainst: [
      {
        tool: 'Perplexity Pro',
        version: 'Deep Research (Sonar-based)',
        date: '2026-07-22',
      },
    ],
    changelog: [
      {
        date: '2026-07-22',
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
      'A custom-instructions document you paste into a Perplexity Space once, so role, source priorities, file-grounding rules, and output format apply automatically to every future thread created inside that Space.',
    promptText: `SPACE INSTRUCTIONS — {{project_name}}

Apply these instructions to every thread created inside this Space from now on, not only to the current one. Treat this document as the standing brief for this Space, the way a repository's README sets expectations for every commit made to it.

ROLE
{{role_or_persona}}

SOURCE PRIORITIES
{{source_priorities}}

FILE-GROUNDING RULE
Any file uploaded to this Space's Files section is a primary source for questions asked here. When a question could plausibly be answered from an uploaded file, check the file before searching the live web. In every answer, state explicitly whether the response is grounded in an uploaded file, the live web, or both — and if the two disagree on a specific point, say so by name rather than quietly picking whichever one produced the cleaner-sounding answer.

OUTPUT RULES
{{output_format_rules}}

WHAT TO EXCLUDE
{{exclusions}}

RECURRING FORMAT
Unless a specific thread's question calls for something different, close every answer in this Space with a one-line "confidence and freshness" note: how current the underlying sources are, and whether anything material could plausibly have changed since those sources were published.

SCOPE DISCIPLINE
If a new thread's question falls outside the scope of {{project_name}} as described above, say so directly instead of quietly answering it as if it belonged here. A question that doesn't fit this Space's brief is a signal it was filed in the wrong place, not something to route around silently — name what Space or context it probably belongs to instead, if you can tell.

REVISION NOTE
If these instructions are ever updated, treat the update as replacing this entire document, not layering on top of it — do not keep applying an old rule from a version of these instructions that has since been superseded, even if it was referenced in an earlier thread in this Space.`,
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
          'A market-research analyst tracking B2B SaaS pricing pages for our category, reporting to a pricing committee that meets monthly.',
        required: true,
      },
      {
        name: 'source_priorities',
        description:
          "Which sources should be trusted first, and which should be treated skeptically, specific to this Space's subject matter.",
        example:
          'Trust vendor pricing pages and SEC filings first; treat third-party "best of" listicles as unreliable for exact pricing figures.',
        required: true,
      },
      {
        name: 'output_format_rules',
        description: 'Formatting or structure every answer in this Space should follow.',
        example:
          'Always end with a one-line "changed since last thread" note if anything relevant shifted since the most recent prior thread in this Space.',
        required: false,
      },
      {
        name: 'exclusions',
        description:
          'Topics or question types that should be redirected elsewhere rather than answered in this Space.',
        example:
          'General product-feature questions unrelated to pricing or packaging — those belong in the Product Space, not here.',
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
      "A single Perplexity thread's context does not carry over into a brand-new thread — Spaces are the actual persistence mechanism the product offers, since instructions and uploaded files attached to a Space apply to every thread created inside it going forward, rather than living and dying with one conversation. Writing the role, source priorities, and output rules once at the Space level and pointing every future question at that Space is functionally the same move as a Claude Project's custom instructions or a repository's CLAUDE.md file: say the constraint once, inherit it forever, instead of re-explaining sourcing rules in every new thread and drifting slightly each time you retype them from memory. The explicit instruction to check uploaded files before the live web, and to name which one an answer is grounded in, matters because Perplexity's default behavior is to search the web regardless of what's already sitting in the Space's Files tab — without being told to weigh the uploaded source first, it can produce an answer that ignores a document you specifically put there precisely because it was meant to be authoritative for that Space. The revision-note clause closes a subtler gap: because Spaces accumulate thread history over time, a model answering a new thread can find and follow an older, already-superseded version of the instructions referenced in a stale prior thread rather than the current document, so explicitly stating that a new version replaces rather than layers onto the old one prevents a Space from silently running on outdated rules months after you updated them. The scope-discipline clause exists for the same durability reason a due-diligence rubric names its own categories — a Space that quietly answers anything asked of it, on-topic or not, degrades into a generic chatbot over time and loses the actual value of having scoped it in the first place.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Spaces (2026)', date: '2026-07-20' },
    ],
    changelog: [
      {
        date: '2026-07-20',
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
      'A verification prompt that requires a stated minimum of genuinely independent sources for a claim, explicitly ruling out citations that all trace back to the same original press release, study, or wire report.',
    promptText: `Check the following claim against independent sources. Do not treat this as answered until you find at least {{minimum_independent_sources}} sources that are independent of each other — meaning none of them is simply reporting on, quoting, summarizing, or citing one of the others as its own evidence.

CLAIM TO CHECK
{{claim}}

WHERE I ENCOUNTERED IT
{{claim_context}}

RULES FOR WHAT COUNTS AS INDEPENDENT
- A news article that cites a press release, and the press release itself, are the same source, not two.
- Two outlets that both cite the same single study, survey, or wire report are the same source counted twice, not two independent confirmations.
- A company's own blog post and a "sponsored" or "in partnership with" piece written using that company's talking points count as one source, regardless of the byline.
- {{exclude_as_sole_evidence}} may be cited for context but does not count toward the independent-source minimum on its own.

WORKING THROUGH THE CITATION CHAIN
For each candidate source, briefly check what it cites as its own evidence before counting it. If a source doesn't name where its figure came from at all, flag it as unsourced rather than assuming it's independent just because it doesn't explicitly credit another outlet.

OUTPUT
1. For each independent source found: what it actually says, in its own words or its own data — not a paraphrase that smooths over a difference between two sources' exact wording or numbers.
2. A one-line note on whether the independent sources agree, partially agree, or conflict. If they conflict, say specifically what the disagreement is about — methodology, timeframe, definition, sample — not just "sources disagree."
3. If you cannot find {{minimum_independent_sources}} truly independent sources, say so plainly and state how many you actually found, rather than padding the list with derivative coverage to hit the requested number.
4. A one-line verdict: is this claim currently well-corroborated, thinly corroborated, or effectively single-sourced dressed up as consensus?`,
    variables: [
      {
        name: 'claim',
        description:
          'The specific claim to triangulate, stated as precisely as possible, including any number or figure involved.',
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
        name: 'claim_context',
        description:
          "Where the claim was encountered, for context on why it's being checked.",
        example:
          "It's being quoted in a vendor's sales deck as a justification for a new compliance feature.",
        required: false,
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
      'Search-grounded answer engines have a documented failure mode of citation clustering — returning several citations that look like independent corroboration but are actually all downstream of one wire story or one press release repeating the same original claim in slightly different words. Explicitly defining what counts as independent, rather than just asking for "multiple sources," closes the exact loophole a citation count alone leaves open: a naive count treats five outlets quoting the same PR blast as five sources instead of one, and a model asked only for "a few sources" has no reason to notice they\'re the same underlying claim wearing five different bylines. Instructing the model to check each candidate source\'s own citation before counting it turns triangulation from a surface-level tally into an actual chain-walk, which is the mechanism that catches the case where an article never explicitly says "according to X" but is nonetheless just paraphrasing X without attribution — a pattern plain citation-counting misses entirely because there\'s no visible citation to flag. Setting a numeric minimum forces the retrieval step to keep searching past the first agreeing cluster it finds, since stopping early would visibly fail the stated bar rather than just under-deliver quietly, and requiring the model to admit when it cannot reach that minimum prevents the alternative and more common failure mode: padding a thin result with derivative coverage just to appear to have satisfied the requirement, which is worse than an honest shortfall because it manufactures false confidence in exactly the place a reader is relying on the count to mean something.',
    exampleOutput:
      "Source 1 (survey publisher, primary data): reports 41% of 500 surveyed enterprise buyers.\nSource 2 (independent industry outlet, own reporting): cites the same underlying survey but adds context from three named buyers confirming the policy requirement independently.\nSource 3: could not be verified as independent — it cites Source 1's press release only, with no additional reporting of its own.\n\nVerdict: only 2 independent sources found, not the 3 requested. The 40% figure traces to one survey; corroboration beyond that survey is currently thin, so treat this as thinly corroborated rather than confirmed.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-24' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-citation-accuracy-audit',
    category: 'perplexity',
    title: "Audit a Perplexity answer's citations before you rely on any of them",
    description:
      'A follow-up prompt that re-checks every numbered citation in a prior Perplexity answer against the actual source text, catching claims attached to a citation that only loosely or partially supports them.',
    promptText: `Audit the accuracy of every citation in the answer below. This is a verification pass, not a rewrite — do not change, improve, or "clean up" the original answer's wording, and do not add new claims that weren't in the original.

ORIGINAL QUESTION
{{original_question}}

ANSWER TO AUDIT (with its citation markers and links, unedited)
{{perplexity_answer_text}}

FOR EACH CITED CLAIM
1. Open the actual source behind the citation marker — do not rely on the citation's own preview text or headline as a stand-in for reading the relevant passage.
2. State whether the source's own text directly supports the specific claim it's attached to, partially supports it, or does not support it at all.
3. If a citation supports a more general claim, an earlier or later time period, or a slightly different number than the one it's attached to, say exactly what the gap is — do not mark it as supported just because it's topically related to the right subject.
4. Flag any claim in the answer that has no citation attached at all, and separately flag any citation number that appears to be reused for two claims that actually need different support.

SEVERITY WEIGHTING
Distinguish a cosmetic gap (a rounded number, a slightly loose paraphrase that doesn't change the meaning) from a material one (a wrong figure, a claim the source doesn't make, a date that changes the claim's currency). Weight the overall verdict on material gaps, not cosmetic ones — but list both.

OUTPUT FORMAT
A table: Claim | Citation # | Verdict (Supported / Partially Supported / Not Supported / Uncited) | Severity (Material / Cosmetic / N/A) | What the source actually says.

End with one overall line on whether this answer is safe to cite further without independent verification, and if not, which specific claims are the blocking issue.`,
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
        description:
          'The question that produced the answer being audited, for context on scope.',
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
      'severity-triage',
    ],
    whyItWorks:
      "AI search tools have a known drift where a citation marker is attached to the correct general topic but not to the specific number or claim in that sentence — for example a growth percentage cited to an article that discusses the same company's growth but reports a different figure or a different reporting period. Pasting the answer back in as a distinct verification task, rather than asking the same thread to double-check itself, narrows the job to something genuinely checkable: does this specific source text support this specific sentence, yes or no, rather than regenerating a fresh answer that could introduce new unverified claims while appearing to be a correction. The instruction to open the actual source text rather than trust the citation preview matters because Perplexity's own citation snippets are short and can look supportive on their own even when the full linked page contradicts or complicates the claim once read in context — a preview-only check would pass exactly the citations most worth catching. The severity-weighting step exists because a naive audit that treats every discrepancy as equally alarming trains you to ignore the output the second time, since most real answers have at least one cosmetic rounding difference; separating material gaps (a wrong figure, an unsupported claim) from cosmetic ones (a rounded number) is what keeps the audit's verdict actionable instead of noisy. And flagging reused citation numbers catches a specific and easy-to-miss failure — a single citation genuinely supporting one claim getting stretched to also back a second, adjacent claim it was never actually about, which reads as thorough sourcing but is really one piece of evidence doing double duty it can't support.",
    exampleOutput:
      'Claim: "revenue grew 22% year over year" | Citation 1 | Partially Supported | Material | The earnings article reports 19% year-over-year growth for the quarter referenced, not 22% — the 22% figure appears to be a different metric (sequential growth) in the same article, likely conflated.\n\nOverall: not safe to cite further without checking the exact growth figure against the primary earnings release — this is the blocking issue, the enterprise-segment attribution in the second claim checks out cleanly.',
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-26',
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
      "A literature-scan prompt for Perplexity's Academic focus mode that forces a study-by-study synthesis table including sample size, method, and stated limitations, not a flattened list of headline conclusions.",
    promptText: `Use Academic focus / academic search mode for this so retrieval is scoped to peer-reviewed and scholarly sources rather than general web content, blog summaries, or course pages that happen to mention this topic.

TOPIC
{{research_topic}}

FIELD
{{field_or_discipline}}

SCOPE
- Publication window: {{year_range}}.
- Find at least {{minimum_studies}} distinct studies — not {{minimum_studies}} citations that all trace back to the same handful of underlying studies via review articles or meta-analyses citing the same primary sources.
- {{specific_methodology_focus}}

OUTPUT FORMAT
A synthesis table, one row per study: Study (author, year) | Sample / Method | Key Finding | Stated Limitations | Link.

Do not summarize a study's conclusion without also giving its stated limitations in the same row — a finding reported without its own caveats is not a faithful summary of the paper, and a reader comparing two studies needs the limitations sitting right next to the finding, not buried in a separate section they might not read.

AFTER THE TABLE
1. Where the studies genuinely agree — and whether that agreement holds across different methods and populations, or only within one narrow subset of the studies found.
2. Where they genuinely conflict, and whether the conflict traces to different methods, populations, definitions of the key variable, or time periods studied — not a vague "mixed results" that doesn't explain why the results are mixed.
3. If a meta-analysis or systematic review exists on this exact topic, name it and note whether its conclusion matches or complicates the individual-study picture above it.
4. The single biggest gap in this literature as it currently stands relative to the topic above — a population never studied, a method never applied, a time period with no coverage.

Note explicitly if the field uses a specific methodology as its gold standard (such as randomized controlled trials in clinical or educational research) and flag any included study that falls short of that standard, rather than presenting all study types as equally strong evidence.`,
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
          'Prioritize randomized controlled trials over observational or self-report studies where both exist for the same question.',
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
      "Perplexity's Academic focus mode scopes retrieval toward indexed journals and preprint servers instead of general web content, which changes what is even eligible to show up as a source — a plain-web query on the same topic will surface summary blog posts and course pages ahead of the actual papers, and no amount of prompt wording on a general search recovers that lost precision once the retrieval pool itself is wrong. Forcing a synthesis table with a dedicated Stated Limitations column matters because a plain narrative summary of academic findings tends to report the headline conclusion and drop the caveats the paper itself used to bound that conclusion — sample size, population, effect size, generalizability — which is exactly the information a reader needs to judge how far the finding actually travels beyond the specific study that produced it. Requiring the conflict analysis to name a mechanism (different methods, populations, definitions, or time periods) rather than accept 'mixed results' forces genuine synthesis instead of a list of study summaries sitting next to each other with no actual comparison performed between them. And naming the field's gold-standard methodology and flagging studies that fall short of it addresses a specific risk in scholarly retrieval: a search can return a mix of rigorous and weak-methodology studies with no signal distinguishing them by default, and without an explicit instruction to weight by method, a synthesis will often treat a large observational study and a small randomized trial as equally strong evidence simply because both are peer-reviewed and both showed up in the same academic-focus search.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Academic focus (2026)', date: '2026-07-21' },
    ],
    changelog: [
      {
        date: '2026-07-21',
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
      'A recurring competitive-research prompt designed to run inside a Perplexity Space, with fixed comparison columns and per-cell citations so the table can be safely re-run and extended round after round without losing comparability.',
    promptText: `This question is part of an ongoing competitive research project — treat it as one round of a comparison table that will keep growing across future threads in this Space, not a standalone answer to be optimized in isolation.

OUR COMPANY / PRODUCT
{{your_company}}

COMPETITORS TO COVER THIS ROUND
{{competitor_list}}

COMPARISON DIMENSIONS (keep these exact column headers every time this is run again — do not rename, reorder, or merge them even if a different phrasing would read more naturally for this round)
{{comparison_dimensions}}

INDUSTRY CONTEXT
{{industry_context}}

OUTPUT FORMAT
A table: Competitor | {{comparison_dimensions}} — with one citation per cell, not one citation covering the whole row. If a cell cannot be filled from a verifiable public source, write "not publicly disclosed" rather than estimating a number and presenting it as fact, and rather than leaving the cell blank in a way that looks like an oversight instead of a deliberate gap.

CONSISTENCY CHECK
If any competitor in this round was also covered in a prior round of this same comparison (assume prior threads in this Space exist), briefly note whether anything in their row has changed since then, and flag if a number in this round looks inconsistent with what a prior round likely reported for the same dimension, so drift gets caught rather than silently compounding round over round.

AFTER THE TABLE
One paragraph: what changed about the competitive picture since the last obvious public update from any of these competitors — a product launch, a pricing change, a funding round, a leadership change. Flag anything time-sensitive or recently announced as provisional rather than settled, since recent announcements are the most likely place for a source to be wrong or incomplete.`,
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
          'The fixed set of columns to compare on, kept identical across runs so the table stays comparable over time.',
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
      "Running this inside a Space rather than a one-off thread is the mechanic that makes the table durable: the Space's own instructions and thread history let you fix the comparison dimensions once and re-run the same shape of question in a new thread weeks later without redefining the columns from scratch, which is what turns a snapshot into a genuinely maintained comparison instead of a document that has to be rebuilt every time someone asks for an update. Requiring one citation per cell instead of one per row closes a specific failure mode of table generation — a single strong source about Competitor A's pricing can otherwise get silently reused to justify a claim about Competitor A's rating or Competitor B's pricing in an adjacent cell, because the model is filling in a grid pattern, not verifying each fact independently against its own source. Instructing 'not publicly disclosed' instead of an estimate matters because a competitive table that quietly fills every cell reads as more complete and more certain than the underlying public sourcing actually supports, which is worse for decision-making than an honest gap that flags exactly where more digging would be needed. The consistency-check step is the one piece that specifically exploits running this in a Space rather than a fresh thread: because the model can see prior threads in the same Space, asking it to flag a number that looks inconsistent with what a previous round likely reported catches slow data drift — a pricing figure that quietly crept from one round to the next without anyone updating it on purpose — that a single isolated run would have no way to notice, since it would have nothing to compare against.",
    exampleOutput:
      'Attribution.io | $499/mo | No | Multi-touch, rules-based | 4.4/5 (G2, 210 reviews) | AI-assisted channel grouping, announced May 2026\nRuler Analytics | not publicly disclosed | No | First-touch + multi-touch | 4.6/5 (G2, 95 reviews) | not publicly disclosed\n\nSince the last round: Attribution.io shipped AI-assisted channel grouping in May 2026 — treat any competitive parity claim about "manual grouping only" as outdated after that date.',
    verifiedAgainst: [
      {
        tool: 'Perplexity Pro',
        version: 'Spaces + Sonar Pro (2026)',
        date: '2026-07-27',
      },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Perplexity Spaces with Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-claim-fact-check',
    category: 'perplexity',
    title: "Fact-check one specific claim with a verdict you can't hedge around",
    description:
      'A closed-verdict fact-checking prompt that requires quoting the exact claim, weighing real counter-evidence, separating bundled assertions, and committing to one of six named verdicts rather than a vague "it depends."',
    promptText: `Fact-check this exact claim. Quote it back to me first to confirm you're checking the actual wording, not a softened or strengthened paraphrase of it — even a small change in wording can turn a checkable claim into a different one.

CLAIM (verbatim)
{{exact_claim}}

WHERE I SAW IT
{{claim_source}}

CONTEXT THAT MIGHT MATTER
{{context}}

PROCESS
1. Confirm the precise, checkable assertion in the claim. If it bundles more than one assertion — a statistic and an attribution, or a cause and an effect — separate them explicitly and check each one on its own, since a claim can be half-right and half-wrong and a single blended verdict would hide that.
2. Find the best available evidence for the claim and the best available evidence against it. If you genuinely cannot find real counter-evidence after a real search, say that explicitly rather than inventing a weak devil's-advocate case just to appear balanced.
3. Give one verdict per assertion, using only these six labels: True, False, Mostly True, Mostly False, Mixed, or Unverifiable. Do not introduce a different label or soften a label with extra qualifiers.
4. Justify each verdict in two or three sentences citing the actual sources and their actual content — not the general reputation of whoever made the claim, and not what "seems plausible" given how the claim is phrased.
5. If the claim attributes itself to a specific study, report, or person, separately verify that the attribution itself is accurate — a real fact wrongly attributed to a specific source is a different kind of error than the fact being wrong, and both should be named if both apply.

Do not soften a False verdict into "this is disputed" or "context is needed" if the weight of verifiable evidence actually points clearly one way — reserve "Mixed" for cases where the evidence itself is genuinely divided, not for cases where you'd simply rather not commit.`,
    variables: [
      {
        name: 'exact_claim',
        description:
          'The claim to check, quoted exactly as it was made — not your summary or paraphrase of it.',
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
      "Quoting the exact claim back before checking it matters because the search step queries on the literal wording — a paraphrase can drift toward a softer or stronger version of the claim that was never actually asserted, and the model ends up 'verifying' a statement nobody made while the actual claim goes unchecked. Splitting bundled assertions apart is what catches the single most common shape of a misleading claim: a real number attached to a wrong or exaggerated attribution, where the number checks out and the source doesn't, or vice versa — collapsing both into one verdict would either wrongly clear the whole claim on the strength of the real number, or wrongly condemn a real number because of a bad attribution wrapped around it. Forcing a closed set of six verdict labels prevents the most common failure mode of open-ended fact-checking, where a model defaults to a non-committal 'this is complicated' that sounds careful but commits to nothing a reader can actually act on — reserving 'Mixed' specifically for genuinely divided evidence, rather than as an escape hatch, is what keeps that label meaningful instead of becoming the default answer to anything uncomfortable. Requiring genuine counter-evidence, and permitting the model to say none exists rather than manufacturing a weak opposing case, guards against a subtler failure — synthetic balance, where a model invents a flimsy 'on the other hand' argument purely to look even-handed, which actually makes a true claim look more contested than the evidence supports and does real damage to a reader trying to gauge how settled something is. The separate attribution check exists because misinformation research consistently finds that a real, correctly-measured statistic gets detached from its original source and reattached to a more prestigious-sounding one as it spreads — checking the number and the attribution as two distinct facts is the only way to catch that specific and very common drift.",
    exampleOutput:
      'Claim confirmed: "Remote workers are 23% more productive than in-office workers, according to a Stanford study."\n\nAssertion 1 (the figure): a specific study found a 23% productivity gap favoring remote work. Verdict: Mostly False. A widely cited 2015 Stanford study (Bloom et al.) found a roughly 13% productivity gain for a specific call-center task under a structured work-from-home arrangement, not a general 23% figure.\n\nAssertion 2 (the attribution): the 23% figure is attributed to "a Stanford study." Verdict: Unverifiable. No Stanford study reporting 23% could be located; this figure appears to be a commonly repeated distortion of the original 13% number, possibly conflated with a different, unrelated statistic.',
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro.',
      },
    ],
  },
  {
    slug: 'perplexity-labs-mini-report-brief',
    category: 'perplexity',
    title:
      'Brief Perplexity Labs to produce a report, a data table, and a dashboard in one linked pass',
    description:
      'A deliverables-first brief for Perplexity Labs that names each output asset explicitly, so a multi-step research task produces a linked report, spreadsheet, and simple dashboard that all agree with each other instead of just a written summary.',
    promptText: `Run this as a Labs task. I want more than a chat answer — build each of these as a distinct, linked asset in the same task, not just a written summary with numbers mentioned in passing.

DELIVERABLES REQUIRED
{{required_assets}}

TOPIC / BRIEF
{{deliverable_topic}}

WHO THIS IS FOR
{{audience}}

DATA REQUIREMENTS
{{data_requirements}}

CROSS-ASSET CONSISTENCY RULES
- The written report and the data table must agree with each other — if the report states a number, that exact number must appear in the table alongside its source, not only in prose where it can't be checked against the underlying data.
- Any chart or dashboard view must be built from the data table produced in this same task, not from a separate, unlinked source pulled in just for the visual.
- Use the same units, currency, and time period consistently across every asset — if the report states an annual figure and the table happens to show a monthly one, convert one to match the other and say which conversion was applied.

SOURCING
Cite sources on the data table itself, row by row, not only in the written report's prose or footnotes — a reader should be able to check any single data point without cross-referencing a different document.

GAPS
If a requested asset genuinely cannot be built from available data — for example, no public data exists for one specific comparison point you were asked to include — say so explicitly on that specific asset and explain what's missing, instead of quietly omitting it from the final deliverable set or filling the gap with an unlabeled estimate.

FINAL CHECK
Before finishing, re-read the report and the table side by side and flag any number that doesn't match between them, rather than assuming they're consistent because they came from the same task.`,
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
      "Perplexity Labs is the slower, agentic mode built to output more than one artifact type per run — a written document, a spreadsheet of the underlying data, and a simple web page or dashboard — instead of a single chat-style answer, and it decides for itself which of those output types to bother building based on how open-ended the request reads. Naming the exact deliverable list up front removes that judgment call: an open request like 'research this and give me a report' can come back as text only, while explicitly listing a report, a spreadsheet, and a dashboard as required assets makes Labs treat each as a distinct commitment it has to satisfy, not an optional extra it can skip if the topic seems to call for less. The rule that the report and the table must agree, and that any chart must be built from that same table, exists because a multi-asset agentic task can otherwise generate each artifact from a slightly different pass over the sources, producing a report and a spreadsheet that quietly disagree with each other on the same number — linking them forces internal consistency instead of three separately-sourced outputs bundled together under one task label. The final side-by-side check step matters because self-consistency checking works dramatically better as a distinct, named step performed after the fact than as an implicit expectation baked into generation — a model asked to 'make sure it's consistent' while writing has no actual mechanism to compare a number it wrote three sections ago against one it's writing now, whereas asked to re-read and compare afterward, it's running an actual comparison pass over completed text rather than trying to hold every number in working memory while still generating.",
    verifiedAgainst: [{ tool: 'Perplexity Labs', version: '2026', date: '2026-07-31' }],
    changelog: [
      {
        date: '2026-07-31',
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
      'A citation-chain-walking prompt that instructs Perplexity to keep tracing backward past news aggregators and blog summaries until it reaches the original filing, dataset, speech, or statement a widely repeated figure actually came from.',
    promptText: `Find the primary source behind this — the original document, filing, dataset, speech, or press release — not the most convenient article that mentions it or the version of it that ranks highest in search.

STATISTIC OR QUOTE
{{statistic_or_quote}}

WHERE I FIRST SAW IT
{{where_you_saw_it}}

WHAT I'M GUESSING IT'S ABOUT
{{suspected_topic}}

PROCESS
1. Do not stop at the first news article or blog post that repeats this — treat that as a lead pointing somewhere, not as the answer itself.
2. Follow the citation chain backward: who did that article cite as its source, and who did that source cite, continuing until you reach something that is itself the original document rather than a summary or report of one. A press release from the organization that generated the data counts as primary; a news article summarizing that press release does not, even if it adds analysis.
3. Along the way, note every place the chain passed through, not just the endpoint — a short list of the intermediate sources helps confirm the chain is real and lets me verify it myself if needed.
4. If the trail dead-ends — the original source is paywalled, unlinked, no longer exists, or you genuinely cannot verify it exists at all — say exactly where the trail broke and what the last verifiable link was, rather than presenting that last secondary source as if it were primary just because the chain stopped there.
5. Once found, quote the exact relevant passage or number from the primary source itself, in its original wording, and note whether any secondary coverage along the way misquoted, rounded, changed the timeframe, or otherwise subtly altered it before it reached where I first saw it.

CONFIDENCE
State your confidence that the source you found is genuinely the original — high confidence if it's an explicit dataset, filing, or transcript; lower confidence if it's the earliest version you could find but you can't rule out an even earlier origin.`,
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
      "A search-grounded answer engine's default behavior is to surface whichever page ranks best for the query, which is almost always a summary or aggregator article, not the original document — because ranking well and being first-to-publish the underlying data are entirely unrelated properties, and search relevance has no way to distinguish a primary filing from a well-optimized recap of it. Explicitly instructing the model to treat the first result as a lead rather than an answer, and to keep asking 'who did this cite' recursively, converts a single retrieval hop into a genuine citation-chain walk, which is the actual mechanism needed to reach a primary source instead of the most convenient secondary one a normal search would settle on. Requiring the intermediate sources to be listed, not just the endpoint, matters because a chain-walk that only reports its conclusion is unverifiable by the reader — showing each link lets you independently confirm the chain is real rather than trusting a single unsupported claim of 'I traced this back and here's the origin.' Requiring it to name exactly where the trail broke, rather than quietly presenting the last thing it found as primary, matters because an unverifiable claim that looks resolved is more dangerous than one that's honestly marked unresolved — the whole point of the exercise is knowing which one you actually have at the end, and a model under no pressure to distinguish the two will default to sounding resolved either way.",
    exampleOutput:
      'Chain: conference slide (no source) -> a 2023 tech blog post citing "an industry report" with no link -> a 2022 news article citing "a recent Gartner survey" -> Gartner press release, October 2022, which actually states 85% of AI projects fail to reach production, not 70%.\n\nConfidence: high — the press release is an explicit, dated primary statement from Gartner itself. The primary source is that press release, and the widely repeated "70%" figure appears to be a rounding or misquote drift introduced somewhere in the secondary coverage chain, likely at the 2023 blog post.',
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-23' },
    ],
    changelog: [
      {
        date: '2026-07-23',
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
      'A trend-analysis prompt that requires a chronological, dated citation table and an explicit split between a real structural shift and a one-off headline dressed up as a trend, plus a named reversal condition.',
    promptText: `Analyze this as a trend over time, not a single current snapshot. Every data point needs its own date and citation — a trend claim with no dates attached to its evidence is not a trend claim, it's a description of the present moment wearing a trend's clothing.

TREND TO ANALYZE
{{trend_topic}}

TIME WINDOW
{{time_window}}

MARKET / GEOGRAPHY
{{geography_or_market}}

METRIC TO TRACK
{{metric_focus}}

OUTPUT FORMAT
1. A chronological table: Date | Data point or event | Source. Sorted oldest to newest, so the shape of the change is visible at a glance rather than needing to be reconstructed from a narrative.
2. A short narrative distinguishing a real structural shift — sustained direction backed by multiple dated points across more than one source — from noise: a single headline, a one-off event, or a seasonal blip that superficially looks like a trend but isn't. Name specifically which rows in the table above are load-bearing for calling this a real trend versus which are just recent color.
3. Flag explicitly if the most recent one or two data points might be too new to confirm the trend is continuing, rather than extrapolating confidently off a single recent point that hasn't been corroborated by anything after it yet.
4. What would have to happen for this trend to reverse, based on what the sources say is actually driving it — not a generic "market conditions could change," but the specific mechanism (a regulatory action, a competitor move, a cost shift) that the sources themselves point to as the driver, and therefore also the plausible point of reversal.
5. If the available data has any obvious gap in coverage — a period with no data points, a source type that's missing entirely — name the gap instead of letting the table's smoothness imply more continuous coverage than actually exists.`,
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
      "Asked for a trend without structural constraints, a model tends to answer with the current state framed as if it were the whole trend, because the most recent and most abundant sources are about now, not about the shape of change over time, and retrieval naturally over-represents whatever is most recently published. Forcing every row of the output to carry its own date converts an impressionistic 'this is growing' into a chronological table a reader can actually eyeball for direction, gaps, and inflection points, rather than a narrative that asserts a slope without showing the points it was fit to. The explicit instruction to name which rows are load-bearing for the trend claim directly counters a specific and common error — treating a single recent headline as proof of a trend, when a genuine trend claim requires multiple dated points moving the same direction across more than one source, not one data point plus a confident narrative wrapped around it. Flagging the newest points as potentially unconfirmed also guards against the model's tendency to extrapolate a clean line through the most recent, least-verified data, which is exactly where a trend narrative is most likely to be wrong, since the newest data hasn't yet had time to be corroborated or contradicted by anything that comes after it. Naming a specific reversal mechanism rather than a generic hedge is what makes the analysis useful for planning rather than just descriptive — a reader who knows the trend depends on a specific driver can actually watch for that driver changing, where a vague 'this could change' gives them nothing concrete to monitor.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-25' },
    ],
    changelog: [
      {
        date: '2026-07-25',
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
      'A category-by-category due diligence brief covering corporate basics, leadership, financial signals, legal risk, and reputation, with explicit "should verify independently" flags on single-sourced claims and a weighting rule tied to why the brief is being run.',
    promptText: `Run a due diligence brief on this company. This is being used for {{diligence_purpose}}, so weight what you surface accordingly — a brief for a vendor decision and one for an investment decision should not look identical, since they're screening for different risks entirely.

COMPANY
{{company_name}}

JURISDICTION / MARKET
{{jurisdiction}}

SPECIFIC AREAS TO PRIORITIZE
{{focus_areas}}

CATEGORIES (cover every one — say "nothing significant found" rather than skipping a category silently, since a skipped category and a genuinely clean category should never look identical in the final output)
1. Corporate basics — legal entity, ownership structure, founding date, headquarters, size (employees/revenue if disclosed).
2. Leadership — key executives, notable prior roles, any recent leadership departures and, if reported, why.
3. Financial signals — funding history, public financials if applicable, credit or rating signals, anything suggesting financial distress or unusual instability.
4. Legal and regulatory — active litigation, regulatory actions, sanctions, or significant past settlements, with dates and current status (resolved vs. ongoing).
5. Reputation and recent news — the last 6-12 months of coverage, separating substantive news (a real operational or legal development) from routine PR (a funding announcement, an award, a partnership press release with no independent verification).
6. Red flags — anything that appears in only one outlet, is disputed by the company, or you could not independently verify — mark this "should verify independently," not as settled fact, and say specifically what verification step would resolve it.

WEIGHTING BY PURPOSE
Given the stated diligence purpose, name which one or two categories above matter most for this specific decision, and make sure those get the deepest coverage rather than treating all six categories as equally important by default.

Do not synthesize a cleaner story than the sourcing actually supports — if two sources disagree on a material fact, present both explicitly and say so, rather than picking the version that makes for a tidier narrative.`,
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
      "Partitioning the brief into fixed named categories — corporate basics, leadership, financial signals, legal and regulatory, reputation, red flags — forces coverage of areas a narrower 'tell me about this company' would not reliably surface, the same mechanic behind a structured code-review rubric: closed categories with a required verdict per category prevent silent gaps, since skipping one is visibly different from filling it with 'nothing significant found.' For a task that benefits from browsing several distinct source types directly, such as an investor-relations page, a court records search, and a company's own careers or leadership page, running this through Perplexity Comet's agentic browsing lets the same brief navigate to each of those pages directly rather than relying only on what a search index has already crawled, which matters for source types — like a specific court docket or a leadership page's own bio text — that don't always surface cleanly through a standard web search even when they exist and are current. The weighting-by-purpose step exists because a fixed six-category structure, applied identically regardless of why the brief was requested, wastes depth on categories that don't matter for the actual decision at hand — a vendor screen genuinely cares less about founder biography than an investment screen does, and naming that up front tells the model where to actually spend its research effort rather than distributing it evenly by default. The explicit 'should verify independently' flag on single-sourced claims keeps the synthesis honest about its own confidence level — a due diligence brief that reads as uniformly certain is more dangerous than one that visibly marks its own weak points, because the reader has no way to tell where the actual risk in relying on the brief sits.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-08-01' },
      { tool: 'Perplexity Comet', version: '2026 browser agent', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
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
      'A recurring monitoring prompt that anchors to a prior summary and cutoff date so each re-run reports only material changes since then, explicitly connecting new findings back to what they replace, instead of a fresh full explanation every time.',
    promptText: `I already know the state of this as of {{last_checked_date}} — do not re-explain what's below, treat it as ground truth for what I already know and build only on top of it.

TOPIC
{{topic_or_space_name}}

WHAT I ALREADY KNOW (as of {{last_checked_date}})
{{prior_summary}}

TASK
Search only for information dated after {{last_checked_date}}. Report only what is new or has materially changed since then — {{change_threshold}}.

RULES
- If nothing material changed, say that in one line, and briefly note what you searched to confirm that, so "nothing changed" reads as a checked result rather than a skipped step.
- Do not manufacture a change out of routine, non-material coverage just to have something to report — a new article restating the same known facts is not a change.
- For each real change: state what changed, the date it happened or was reported, and the source.
- If a change contradicts or updates something in what I already know above, say so explicitly — "this replaces/updates X above" — rather than adding it alongside the old information without connecting the two, which would leave me holding two versions of the same fact with no indication which one is now current.
- Do not repeat anything from the prior summary above unless it is necessary context for understanding why a new change matters.
- If you find something that seems significant but you're not fully confident it's actually new (it might already be reflected in what I know, phrased differently), flag it as "possibly already known, please confirm" rather than either silently dropping it or confidently presenting it as new.`,
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
      "A new Perplexity thread has no memory of a previous thread's answer, and even within a Space, a fresh question tends to get re-answered from scratch rather than diffed against what was already established — so the mechanic here is re-anchoring by hand: pasting the prior summary and its cutoff date back in as literal input turns a stateless lookup into a de facto recurring monitor. Restricting the search to dates after the cutoff, rather than asking a general question again, is what actually prevents the tool from re-surfacing and re-explaining facts that were already known, since without that constraint a fresh search naturally re-finds the same background sources it found last time and reports them as if they were new. The instruction to connect a new finding back to a specific line in the prior summary — 'this replaces X above' — matters because a list of updates with no stated relationship to prior knowledge leaves the reader to do the diffing themselves, which defeats the purpose of asking for only what changed in the first place. The 'possibly already known, please confirm' flag exists for a genuinely hard sub-problem this setup creates: distinguishing a finding that's actually new from one that's the same underlying fact restated in different words is not a task the model can resolve with certainty on its own, since it can't see inside your head to know exactly how you'd phrase what you already know — giving it an explicit third option between 'definitely new' and 'silently drop it' turns an unreliable binary judgment call into a flagged item you can resolve yourself in seconds, which is far cheaper than either missing a real update or being told about the same fact twice under two different names.",
    exampleOutput:
      'Since June 15: national enforcement guidance was published July 28 by the relevant EU authority, specifying a phased disclosure rollout — this replaces the "enforcement guidance still pending" line in what you already know above. No other material changes found; two opinion pieces about the Act appeared in trade press but contain no new regulatory information, so they are not reported as changes.',
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Spaces + Sonar Pro', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Perplexity Spaces with Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-comet-multistep-task-brief',
    category: 'perplexity',
    title:
      'Brief the Comet browser agent for a bounded multi-step task instead of one open-ended ask',
    description:
      'A task brief for Perplexity Comet that names every site to visit, the exact data to pull from each, the stop condition, and what to do when a step fails — so an agentic browsing run stays inside a defined scope instead of wandering or quietly skipping a hard step.',
    promptText: `Run this as a Comet agentic browsing task. Treat the steps below as a fixed checklist to complete, not a loose suggestion of where to start looking.

GOAL
{{task_goal}}

SITES TO VISIT, IN ORDER
{{site_list}}

WHAT TO PULL FROM EACH SITE
{{data_to_extract}}

STOP CONDITION
{{stop_condition}}

RULES FOR NAVIGATION
- Stay within the sites listed above unless one of them explicitly links to a page that is clearly necessary to complete the goal (for example, a company site linking to its own SEC filing) — if you go beyond the listed sites, say exactly which page and why.
- Do not fill in a missing data point by inferring it from a different, unrelated page just to complete the checklist — mark it as "not found on this site" instead.
- If a site requires a login, a paywall, or a CAPTCHA to access the specific page needed, stop at that page and report it as blocked rather than attempting to find a workaround or substituting a different, lower-quality source without saying so.

WHEN A STEP FAILS
If a site has changed its layout, moved a page, or no longer has the requested information, say specifically which step failed and why, then continue to the remaining steps rather than abandoning the whole task because one step didn't go as planned.

OUTPUT FORMAT
1. A table or list, one row per site: Site | Data found | Notes (including "blocked," "not found," or "page structure changed" where relevant).
2. A short summary answering the original goal, built only from what was actually found — if the goal can't be fully answered because of gaps in the table above, say so rather than filling the summary with confident-sounding language that outruns what was actually verified.
3. A one-line note on anything encountered that seemed relevant to the goal but was outside the scope of the sites listed, in case it's worth a follow-up task.`,
    variables: [
      {
        name: 'task_goal',
        description: 'The overall outcome this browsing task needs to produce.',
        example:
          'Confirm the current return policy window and whether it differs for sale items, across our three main furniture retail competitors.',
        required: true,
      },
      {
        name: 'site_list',
        description:
          'The exact sites (or specific pages) to visit, in the order to check them.',
        example:
          'oakwoodfurniture.com/returns, cascadehome.com/policies/returns, birchandbolt.com (search their FAQ or footer for return policy)',
        required: true,
      },
      {
        name: 'data_to_extract',
        description: 'The specific fields or facts to pull from each site.',
        example:
          'Return window in days, whether sale/clearance items are excluded, whether return shipping is free or charged to the customer',
        required: true,
      },
      {
        name: 'stop_condition',
        description: "What defines the task as finished, so it doesn't run indefinitely.",
        example:
          'Stop once all three sites have been checked, regardless of whether every field was found on every site.',
        required: true,
      },
    ],
    targetTools: ['Perplexity Comet'],
    tags: [
      'comet',
      'browser-agent',
      'agentic-browsing',
      'competitive-research',
      'automation',
    ],
    whyItWorks:
      "Comet's browsing agent operates by actually navigating pages rather than querying a search index, which means it can reach information a standard web search never indexes well — a specific policy page buried three clicks into a footer, a filing that sits behind a site's own document viewer — but that same navigational freedom is exactly what makes an unbounded brief risky, since an agent told only the end goal has to decide for itself where to look and can drift into pages that seem plausibly related without ever being told to stop. Naming the exact sites and the exact fields to pull from each converts an open-ended browsing task into a checklist the agent can complete or visibly fail to complete, rather than an exploration that could end almost anywhere depending on what it happens to find first. The explicit rule against inferring a missing field from an unrelated page addresses a real risk specific to agentic browsing: an agent under implicit pressure to fill in a complete-looking table can quietly substitute a plausible-sounding number from a different page — a competitor's general FAQ instead of their specific returns page — which produces a table that looks complete but contains a fabricated data point wearing the same formatting as the verified ones. And the per-step failure-handling rule matters because a browsing agent that hits one blocked or restructured page can otherwise treat that as reason to either abandon the whole task or silently skip the failure and report the remaining steps as if nothing went wrong — requiring it to name the specific failure and keep going is what produces a genuinely useful partial result instead of an all-or-nothing one.",
    verifiedAgainst: [
      { tool: 'Perplexity Comet', version: '2026 browser agent', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against Perplexity Comet agentic browsing mode.',
      },
    ],
  },
  {
    slug: 'perplexity-finance-focus-company-snapshot',
    category: 'perplexity',
    title:
      'Pull a structured financial snapshot of a public company with figures tied to filings, not headlines',
    description:
      "A brief for Perplexity's Finance features that requests a named set of financial metrics tied to the specific filing or reporting period each one came from, and explicitly separates a reported figure from an analyst estimate.",
    promptText: `Pull a financial snapshot for this company using current market and filings data, not general commentary about the company.

COMPANY / TICKER
{{company_or_ticker}}

METRICS REQUIRED
{{required_metrics}}

REPORTING PERIOD
{{reporting_period}}

WHAT THIS IS FOR
{{use_context}}

RULES
- For every figure, state the exact source: which filing (10-Q, 10-K, earnings call transcript), which reporting period it covers, and the date it was reported or filed. A number with no filing or period attached is not usable for this.
- Explicitly separate a reported, actual figure from an analyst estimate, a forward guidance number, or a consensus projection — label each one accordingly rather than presenting all figures in the same neutral tone as if they carried equal certainty.
- If a metric has been restated, revised, or corrected since its original filing, use the most recent corrected figure and note that a correction occurred.
- If the most recent filed data is older than what a live market quote would suggest (for example, revenue from a quarter that ended two months ago while the stock price is real-time), note that mismatch explicitly rather than presenting a stale filed figure next to a live price as if they're from the same moment.

COMPARISON CONTEXT
{{comparison_context}}

OUTPUT FORMAT
A table: Metric | Value | Type (Reported / Estimate / Guidance) | Period | Source (filing + date). Follow with two or three sentences of plain-language context on what these numbers suggest, explicitly avoiding language that reads as investment advice or a buy/sell recommendation — describe what the numbers show, not what to do about them.`,
    variables: [
      {
        name: 'company_or_ticker',
        description: 'The company or its stock ticker to pull the snapshot for.',
        example: 'NVDA (Nvidia Corporation)',
        required: true,
      },
      {
        name: 'required_metrics',
        description: 'The specific financial metrics to include in the snapshot.',
        example:
          'Revenue, gross margin, operating income, free cash flow, and year-over-year growth for each',
        required: true,
      },
      {
        name: 'reporting_period',
        description: 'The specific period the snapshot should cover.',
        example: 'Most recently reported fiscal quarter',
        required: true,
      },
      {
        name: 'use_context',
        description:
          'What this snapshot is being used for, to keep the framing appropriately scoped.',
        example:
          'Preparing internal talking points comparing our cloud-spend supplier to its own recent earnings trend',
        required: false,
      },
      {
        name: 'comparison_context',
        description: 'Any comparison point to include alongside the raw figures.',
        example:
          'Compare each metric to the same quarter one year prior, and to the prior sequential quarter',
        required: false,
      },
    ],
    targetTools: ['Perplexity Finance', 'Perplexity Pro (Sonar Pro)'],
    tags: ['finance', 'company-snapshot', 'filings', 'financial-research'],
    whyItWorks:
      "Perplexity's Finance features surface structured market and filings data alongside its general search, which matters here because financial figures scattered across news commentary are frequently rounded, restated in a headline-friendly way, or quietly mixing a reported actual with a forward estimate without saying so — anchoring the request to filings and reporting periods specifically routes the retrieval toward the primary financial documents rather than the secondary commentary written about them. Requiring every figure to carry its filing type, period, and date closes a real and specific confusion in financial reporting: a headline number is frequently a non-GAAP adjusted figure, a forward guidance projection, or an analyst consensus estimate presented with the same confident phrasing as an actual reported result, and a reader with no way to tell which is which can easily treat a projection as a fact that already happened. The mismatch-flagging rule addresses a structural quirk of financial data specifically — a live stock price updates continuously while the underlying fundamentals it's implicitly being judged against are only as current as the last quarterly filing, so a snapshot that silently juxtaposes a real-time price with quarter-old revenue without saying so implies a tighter connection between the two than actually exists. And the explicit instruction to avoid advice-flavored language keeps the output in the category of a research aid rather than a recommendation — a distinction worth stating outright given how easily a confident-sounding summary of financial figures can read as implicit investment guidance even when none was intended.",
    verifiedAgainst: [
      { tool: 'Perplexity Finance', version: '2026', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Perplexity Finance features and Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-reddit-focus-real-world-experience',
    category: 'perplexity',
    title:
      'Use Reddit focus mode to find what people actually experienced, not what a brand claims',
    description:
      "A prompt for Perplexity's Reddit focus mode that specifically seeks out unfiltered, first-hand user experience — including complaints and failure cases — as a deliberate counterweight to a product or company's own marketing claims.",
    promptText: `Use Reddit focus mode for this — I specifically want real user discussion and first-hand accounts, not marketing copy, review-site summaries, or official documentation restated in different words.

WHAT I'M TRYING TO LEARN
{{question_or_decision}}

PRODUCT / TOPIC
{{product_or_topic}}

OFFICIAL CLAIM TO CHECK AGAINST (if any)
{{official_claim}}

WHAT COUNTS AS USEFUL HERE
- Prioritize threads and comments with specific, concrete detail — a named failure mode, a specific workaround someone found, an exact number or timeframe — over comments that just express general sentiment ("love it" or "hate it") with no detail behind it.
- Note roughly how much agreement or disagreement exists across different threads and different subreddits, not just what the single most upvoted comment says — a top comment can reflect one vocal user's experience rather than the median one.
- Distinguish an old, possibly outdated complaint (a bug or limitation from a version that may have since been fixed) from a recent one, and flag the date of the thread or comment for anything time-sensitive.
- If the official claim above conflicts with what real users are reporting, say so directly and describe the specific gap — what the claim says versus what people are actually experiencing — rather than smoothing the two into one blended narrative.

WHAT TO WATCH FOR
Flag anything that reads like undisclosed promotion (an account that only ever posts positively about this one product, unusually polished language for a casual forum post) rather than treating every comment as an equally trustworthy, ordinary user.

OUTPUT FORMAT
1. A short summary of the general sentiment, with a rough sense of how split or unified it is.
2. Specific, quoted or closely paraphrased examples for both the positive and negative experiences found, each with a note on how recent it is.
3. Where this diverges from the official claim, stated explicitly.
4. Anything you'd flag as likely inauthentic or promotional rather than genuine user experience.`,
    variables: [
      {
        name: 'question_or_decision',
        description:
          "What you're actually trying to figure out from real user experience.",
        example:
          "Whether this mattress actually stays cool through the night for hot sleepers, since that's the main reason we'd buy it",
        required: true,
      },
      {
        name: 'product_or_topic',
        description: 'The specific product, service, or topic to research.',
        example: 'The Cirrus Sleep hybrid mattress, medium-firm model',
        required: true,
      },
      {
        name: 'official_claim',
        description:
          'The marketing or official claim to check real experience against, if any.',
        example:
          "The product page claims it's '30% cooler than a standard memory foam mattress' based on their own lab testing.",
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Reddit focus)', 'Perplexity Pro Search'],
    tags: ['reddit-focus', 'user-experience', 'product-research', 'sentiment-analysis'],
    whyItWorks:
      "Reddit focus mode scopes retrieval specifically to Reddit's own discussion threads rather than the general web, which changes what's structurally available as a source in a way that matters here: a general web search on a product name is dominated by the brand's own pages, affiliate review sites optimized to rank well and convert clicks, and press coverage that's often just a rewritten press release, none of which are actually first-hand accounts even when they read like recommendations. Explicitly prioritizing specific, concrete detail over generic sentiment matters because Reddit threads contain a huge amount of low-information agreement or disagreement ('this is great,' 'this is trash') sitting right alongside genuinely useful specific accounts, and a summary that weighs both equally ends up diluted by the noise instead of anchored on the comments that actually carry information. Asking for a rough sense of agreement across threads rather than just the top comment corrects for how Reddit's own upvote mechanism works — the most upvoted comment in a thread reflects what resonated with that thread's specific audience at that specific moment, which is a different signal from what the balance of user experience actually looks like across many threads and communities, and treating one as a stand-in for the other systematically overweights whichever opinion happened to get there first or matched the loudest subreddit's priors. The promotional-content flag exists because forums are a known target for undisclosed marketing seeding, and a synthesis that treats every comment as equally genuine user experience will unknowingly launder planted positive content into what's presented as organic consensus — naming the specific signals that suggest inauthenticity (single-topic posting history, unusually polished phrasing) gives the model something concrete to check for instead of a vague instruction to 'be skeptical.'",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Reddit focus (2026)', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Perplexity Pro Reddit focus mode.',
      },
    ],
  },
  {
    slug: 'perplexity-visual-search-identification-brief',
    category: 'perplexity',
    title:
      'Identify an object, place, or product from a photo, then research it with real citations',
    description:
      'A two-stage prompt for image-based visual search that separates the identification step from the research step, requiring an explicit confidence level on the identification before any downstream claims get built on top of it.',
    promptText: `I'm uploading an image. Do this in two clearly separated stages — do not skip straight to research before the identification stage is explicitly confirmed.

WHAT I'M TRYING TO IDENTIFY
{{identification_target}}

WHAT I ALREADY KNOW OR SUSPECT
{{prior_guess}}

STAGE 1 — IDENTIFICATION
Identify {{identification_target}} from the image as specifically as the visible evidence actually supports — not more specifically than that. State your confidence level explicitly: certain, fairly confident, or a best guess among a few plausible candidates. If there are multiple plausible candidates that the image alone can't distinguish between, name all of them rather than committing to just the most likely one and hiding the ambiguity.

Do not proceed to Stage 2 research based on an identification you're not at least fairly confident in — if identification stalls at "best guess among several candidates," say so and either ask a clarifying question or research all the plausible candidates in parallel, clearly labeled, rather than picking one arbitrarily and researching only that one.

STAGE 2 — RESEARCH
Once identification is confirmed or narrowed, research this:
{{research_request}}

RULES FOR STAGE 2
- Every factual claim in this stage should be about the identified subject specifically, not about the general category it belongs to, unless I asked for category-level context.
- If Stage 1 ended with more than one plausible candidate, keep the research for each candidate clearly separated rather than blending facts about different candidates into one answer.
- Cite sources for Stage 2 the same way you would for a text-only research question — this doesn't become less rigorous just because it started from an image.

OUTPUT FORMAT
Stage 1 result and confidence level first, clearly labeled. Then Stage 2 research, clearly labeled, built only on top of the Stage 1 result.`,
    variables: [
      {
        name: 'identification_target',
        description: "What kind of thing you're trying to identify in the image.",
        example: 'This specific chair design',
        required: true,
      },
      {
        name: 'prior_guess',
        description: 'Any existing guess or partial information you already have.',
        example:
          'I think it might be a mid-century design, possibly Scandinavian, but I have no brand or designer name.',
        required: false,
      },
      {
        name: 'research_request',
        description: 'What you want researched once the subject is identified.',
        example:
          "The original retail price when released, who designed it, and whether it's still in production or only available secondhand",
        required: true,
      },
    ],
    targetTools: ['Perplexity Pro (visual search)', 'Perplexity app'],
    tags: ['visual-search', 'image-identification', 'product-research', 'multimodal'],
    whyItWorks:
      "Splitting identification from research into two explicitly separated stages exists because the two steps fail in different ways and a single blended pass hides which one actually went wrong: an answer that turns out to be wrong could be a bad identification (the wrong chair entirely) or bad research on a correct identification (the right chair, but a wrong price), and a reader has no way to tell which without the stages being visible separately. Requiring an explicit confidence level on the identification, and naming multiple candidates rather than committing to one when the image genuinely doesn't disambiguate, matters because visual identification from a single photo is inherently probabilistic in a way text search usually isn't — a partial angle, unusual lighting, or a design with several close variants can make two or three candidates equally plausible, and a model under implicit pressure to give one clean answer will often just pick the most common or most likely-sounding candidate and present it with the same confidence as a certain match. Refusing to proceed to Stage 2 on a low-confidence identification is the mechanism that actually prevents the most damaging failure mode of this kind of task: a research answer built on a wrong identification doesn't look wrong on its own, since every fact in it can be perfectly accurate about the wrong subject — a real price, a real designer, a real production history, just for a different chair — which is far harder to catch after the fact than an identification that honestly stalled and asked for help disambiguating.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Visual search (2026)', date: '2026-07-21' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Perplexity Pro visual/image search.',
      },
    ],
  },
  {
    slug: 'perplexity-pages-shareable-report',
    category: 'perplexity',
    title:
      'Turn a research thread into a structured Perplexity Page worth sharing publicly',
    description:
      'A brief for generating a Perplexity Page that specifies section structure, a target reader who was not part of the original research thread, and a rule against carrying over conversational asides that only made sense in context.',
    promptText: `Turn this research into a Perplexity Page — a standalone, structured document meant to be read and shared on its own, not a transcript of how we got here.

TOPIC
{{page_topic}}

SOURCE MATERIAL
{{source_thread_or_summary}}

WHO WILL READ THIS
{{target_reader}}

SECTION STRUCTURE REQUIRED
{{required_sections}}

REWRITING RULES
- The target reader was not part of the original research conversation and has no idea what was asked, refined, or corrected along the way — write for someone seeing this topic fresh, not someone following our back-and-forth.
- Drop any conversational aside, hedge, or self-correction that only made sense in the moment ("actually, let me revise that" or "as I mentioned above") — the Page should read as a finished document, not a cleaned-up chat log.
- Every factual claim carried over from the source material keeps its citation — do not strip citations during the rewrite for readability, and do not introduce a new claim in the Page that wasn't actually established and cited in the source research.
- If the source research contained an unresolved question or a flagged gap, keep that gap visible in the Page rather than smoothing it into confident-sounding prose just because the Page format looks more finished than a thread.

TONE AND LENGTH
{{tone_and_length}}

OUTPUT
The finished Page content, organized under the section headers specified above, with a short one-line summary at the top stating what this Page covers and as of what date — since anyone opening a shared link later has no way to know how current it was when written unless it's stated explicitly.`,
    variables: [
      {
        name: 'page_topic',
        description: 'The title and core subject of the Page.',
        example:
          'How usage-based pricing actually works across the major dev-tool platforms',
        required: true,
      },
      {
        name: 'source_thread_or_summary',
        description:
          'The prior research thread or its key findings to build the Page from.',
        example:
          'The full Deep Research thread comparing pricing models across five API platforms, including the evidence table',
        required: true,
      },
      {
        name: 'target_reader',
        description:
          'Who this Page is being written for, since it will be read outside the original context.',
        example:
          'A product manager at a partner company who asked for "the pricing research" but wasn\'t in any of the original threads',
        required: true,
      },
      {
        name: 'required_sections',
        description: 'The section headers the Page should be organized under.',
        example:
          'Summary, How the pricing models differ, Cost comparison at three usage tiers, Open questions, Sources',
        required: true,
      },
      {
        name: 'tone_and_length',
        description: 'Desired tone and rough length for the finished Page.',
        example:
          'Plain, direct, no marketing language — roughly the length of a two-page internal memo',
        required: false,
      },
    ],
    targetTools: ['Perplexity Pages', 'Perplexity Pro'],
    tags: ['perplexity-pages', 'report-writing', 'knowledge-sharing', 'documentation'],
    whyItWorks:
      'A Perplexity Page is meant to stand alone as a shareable artifact, which is a fundamentally different job than a research thread, whose structure — a series of questions, refinements, and corrections — only makes sense to someone who was present for the back-and-forth; asking for the reformatting explicitly, rather than just "turn this into a Page," is what forces the model to actually rebuild the structure for a cold reader instead of lightly editing the conversational log it already has. Naming a specific target reader who wasn\'t part of the original thread is the concrete mechanism that catches conversational residue a generic "make this readable" instruction would miss — a model reformatting its own prior output has every incentive to preserve phrasing that felt natural in context (self-corrections, references to "as discussed above") because it doesn\'t have an outside reader\'s perspective to notice those phrases no longer point to anything the new reader can see. The citation-preservation rule matters specifically because reformatting for readability is exactly the kind of pass where citations get quietly dropped — they add visual clutter to a document being polished for presentation, and a rewrite optimized purely for flow will trim them first unless explicitly told that citations are load-bearing content, not formatting overhead. And keeping unresolved gaps visible rather than smoothed over addresses a specific risk of the Page format itself: a shared, professionally formatted document reads as more authoritative and complete than a thread of typed questions and answers, even when the underlying research has exactly the same open questions in both — the formatting itself creates a false signal of completeness that the content has to actively resist.',
    verifiedAgainst: [{ tool: 'Perplexity Pages', version: '2026', date: '2026-07-24' }],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Perplexity Pages generation.',
      },
    ],
  },
  {
    slug: 'perplexity-structured-buying-decision-comparison',
    category: 'perplexity',
    title:
      'Compare two specific purchase options against your own stated priorities, not generic pros and cons',
    description:
      'A buying-decision prompt that requires the comparison to be weighted against a stated, ranked list of what actually matters to the buyer, rather than a generic feature-by-feature rundown that treats every difference as equally important.',
    promptText: `Help me decide between these two specific options. I don't want a generic pros-and-cons list — I want the comparison weighted against what actually matters to me, in the order I've ranked it.

OPTIONS TO COMPARE
{{option_a}}
vs
{{option_b}}

MY PRIORITIES, RANKED (most important first)
{{ranked_priorities}}

MY CONSTRAINTS
{{hard_constraints}}

WHAT I'M NOT WORRIED ABOUT
{{explicitly_not_a_concern}}

PROCESS
1. For each of my ranked priorities, state what each option actually offers, with a source for any factual claim (a spec, a price, a review-based reliability claim) — not a vague "generally considered good for X."
2. Check both options against my hard constraints first. If either option fails a hard constraint outright, say so plainly and explain that the remaining comparison is now academic for that option unless the constraint can be worked around, and say how.
3. Do not spend meaningful space comparing the two on {{explicitly_not_a_concern}} — a short acknowledgment that they're comparable there is enough; don't let a difference I said doesn't matter drive the recommendation.
4. If the two options are genuinely close on my top priority, say so explicitly rather than manufacturing a tiebreaker — being told "these are close enough that it's a coin flip on your top priority" is more useful than a confident recommendation built on a difference too small to matter in practice.

RECOMMENDATION
End with a direct recommendation given everything above, and — separately — name the one thing that would flip that recommendation if it turned out to be wrong (a price change, a spec I misremembered, a priority I ranked differently than I actually feel about it).`,
    variables: [
      {
        name: 'option_a',
        description: 'The first option being compared, specific enough to research.',
        example: 'The Framework Laptop 16 (AMD Ryzen 7040 configuration)',
        required: true,
      },
      {
        name: 'option_b',
        description: 'The second option being compared.',
        example: 'The Lenovo ThinkPad P16s Gen 3',
        required: true,
      },
      {
        name: 'ranked_priorities',
        description: 'What matters most to the buyer, in explicit rank order.',
        example:
          '1) repairability and upgradeability, 2) battery life for a full workday, 3) build quality, 4) price',
        required: true,
      },
      {
        name: 'hard_constraints',
        description:
          'Any non-negotiable requirement that would rule an option out entirely.',
        example: 'Must be available with at least 32GB RAM and ship to Canada',
        required: false,
      },
      {
        name: 'explicitly_not_a_concern',
        description:
          "A dimension the buyer has already decided doesn't matter, to keep the comparison from wasting space there.",
        example: "Gaming performance — I don't game on this machine",
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro Search'],
    tags: [
      'buying-decision',
      'product-comparison',
      'weighted-priorities',
      'decision-support',
    ],
    whyItWorks:
      "A generic pros-and-cons list treats every point of difference between two options as roughly equal in importance, which produces a comparison that reads as thorough but doesn't actually help a decision, because the reader still has to mentally re-weight every bullet point against what they personally care about — work the prompt should be doing, not offloading back onto the person who asked for help deciding. Requiring the comparison to walk through the buyer's own ranked priorities in order, rather than a neutral feature list, forces the structure of the output to match the actual structure of the decision, so the most important factor gets the most attention instead of getting one bullet point buried in the middle of a longer list alongside far less important ones. Checking hard constraints first and explicitly declaring the rest of the comparison \"academic\" for a failing option prevents a specific and common failure of comparison prompts: continuing to earnestly compare battery life and build quality between two options when one of them doesn't even ship with enough RAM to meet a stated requirement, which wastes the reader's attention on a decision that was already made by the constraint. And instructing the model to admit when two options are genuinely close on the top priority, rather than manufacturing a tiebreaker, matters because a confident-sounding recommendation built on a difference too small to be real in practice is actively worse than an honest 'these are close' — it gives the reader false certainty about a choice that, if the truth were stated, they might reasonably decide either way on grounds the comparison can't see, like personal aesthetic preference.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-travel-itinerary-research-brief',
    category: 'perplexity',
    title:
      'Research a trip itinerary with real, dated costs and rules, not generic travel-blog advice',
    description:
      "A travel-planning brief that requires current, dated figures for costs, visa requirements, and safety advisories with sources, explicitly distinguishing what's currently accurate from what a generic travel article might repeat from years ago.",
    promptText: `Research this trip with current, sourced information — not the kind of generic "10 tips for visiting X" advice that gets copied across travel blogs regardless of whether it's still accurate.

TRIP
{{destination_and_dates}}

TRAVELERS
{{traveler_details}}

WHAT I NEED RESEARCHED
{{research_scope}}

BUDGET CONTEXT
{{budget_context}}

RULES FOR EACH CATEGORY BELOW
For every cost, requirement, or rule, state the date the information was published or last confirmed current — travel costs, visa rules, and safety situations all change, and a figure with no date attached could be from any year.

1. Visa and entry requirements for {{traveler_details}}'s nationality specifically — not a generic overview that doesn't account for nationality-specific rules, and note if requirements changed recently or are expected to change before the trip dates.
2. Realistic cost ranges for the specific categories in {{research_scope}} — cite actual current listings or recent traveler reports where possible, not a single "average cost" figure with no source, and separate a budget-tier estimate from a mid-range one if costs vary widely.
3. Any current safety advisories, health requirements, or notable local conditions (weather patterns, ongoing events, seasonal closures) specific to the exact dates of travel, not a generic year-round description of the destination.
4. Anything in this itinerary that depends on something that could plausibly change between now and the travel dates — a visa policy under discussion, a seasonal closure that hasn't been confirmed for this specific year yet — flagged explicitly as provisional.

OUTPUT FORMAT
Organized by the categories above, each item with its source and the date that source was current. End with a short list of what to double-check closer to the travel dates, specifically because it's time-sensitive.`,
    variables: [
      {
        name: 'destination_and_dates',
        description: 'Where and when the trip is happening.',
        example: 'Lisbon and the Azores, October 12-24, 2026',
        required: true,
      },
      {
        name: 'traveler_details',
        description:
          'Nationality and any relevant traveler specifics that affect requirements.',
        example: 'Two adults, Canadian passports',
        required: true,
      },
      {
        name: 'research_scope',
        description: 'The specific cost or planning categories to research.',
        example:
          'Mid-range hotel costs, average restaurant meal cost, inter-island ferry prices',
        required: true,
      },
      {
        name: 'budget_context',
        description:
          'Overall budget level, so cost research is scoped to a relevant tier.',
        example:
          'Aiming for a mid-range trip, roughly $150-200/day per person excluding flights',
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro Search'],
    tags: ['travel-planning', 'itinerary-research', 'visa-requirements', 'cost-research'],
    whyItWorks:
      'Travel content is one of the most heavily duplicated categories on the open web — a huge share of "visiting X" articles are lightly reworded versions of the same handful of original posts, some of them years old, and a search-grounded answer engine asked a generic travel question will often surface and synthesize exactly that duplicated content rather than anything current. Requiring a date on every cost, requirement, and rule directly targets this specific problem: a visa rule or an entry fee stated with no date attached is functionally unverifiable, since travel policy and pricing both change over time spans short enough that a three-year-old blog post can be actively wrong rather than just slightly outdated. Scoping visa and entry rules to the traveler\'s actual nationality rather than a generic overview matters because entry requirements are nationality-specific by design — a generic "here\'s what you need to visit" article usually defaults to describing requirements for one or two of the largest source markets for that destination, which may be entirely wrong for a different nationality, and presenting that mismatch as universal advice is a common and easy-to-miss error. Flagging seasonal or policy-dependent items as provisional, tied specifically to the travel dates rather than the current date, exists because trip planning often happens weeks or months ahead of departure — a safety advisory or a seasonal closure accurate today is a different claim from one guaranteed accurate on the actual travel dates, and collapsing the two into one confident-sounding answer hides exactly the kind of change a traveler most needs to catch before departing, not after.',
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-19' },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-regulatory-compliance-checklist',
    category: 'perplexity',
    title:
      'Build a sourced regulatory-requirement checklist for a specific jurisdiction and activity',
    description:
      'A research aid — not legal advice — that maps the specific, currently-in-force regulatory requirements applying to a defined business activity in a named jurisdiction, with each requirement tied to its source statute or regulator and a flag on anything pending or under review.',
    promptText: `Build a checklist of the regulatory requirements that currently apply to this specific activity in this specific jurisdiction. This is a research aid to help me know what to ask our actual legal counsel about — it is not legal advice, and I will treat it that way regardless of how confidently anything below is stated.

ACTIVITY
{{business_activity}}

JURISDICTION
{{jurisdiction}}

BUSINESS CONTEXT
{{business_context}}

FOR EACH REQUIREMENT FOUND
- Name the specific requirement in plain language.
- Cite the specific statute, regulation, or regulator guidance it comes from — not a secondary summary of the law, but the actual name of the regulation or the regulator publishing the requirement.
- State whether it's currently in force, scheduled to take effect on a future date, or currently proposed/under review but not yet law — these are three different statuses and should never be presented identically.
- Note the last time this specific requirement was confirmed current, since regulations get amended and a checklist item with no freshness indicator is not trustworthy on its own.

SCOPE
{{scope_boundaries}}

GAPS AND UNCERTAINTY
If a requirement is genuinely ambiguous — reasonable people or reasonable sources interpret it differently, or it's a gray area that hasn't been tested — say so explicitly rather than picking one interpretation and presenting it as settled. If you cannot find clear requirements for part of the activity described, say which part is uncovered rather than silently omitting it.

OUTPUT FORMAT
A checklist grouped by regulatory area (for example: licensing, data handling, employment, tax), each item with its source, status, and freshness note as described above. End with an explicit, direct restatement that this is a starting point for a conversation with qualified legal counsel in {{jurisdiction}}, not a substitute for that conversation.`,
    variables: [
      {
        name: 'business_activity',
        description:
          'The specific business activity the compliance checklist should cover.',
        example:
          'Operating a subscription-based telehealth platform connecting patients with licensed therapists',
        required: true,
      },
      {
        name: 'jurisdiction',
        description: 'The specific jurisdiction whose regulations apply.',
        example: 'California, United States',
        required: true,
      },
      {
        name: 'business_context',
        description:
          'Relevant context about the business that affects which rules apply.',
        example:
          'A 12-person startup, not yet operating in any other state, handling patient health information',
        required: false,
      },
      {
        name: 'scope_boundaries',
        description: 'What areas of regulation to include or exclude from this pass.',
        example:
          'Focus on data privacy and licensing requirements specifically; general employment law and standard business tax registration can be a brief mention only',
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro Search'],
    tags: ['regulatory-research', 'compliance', 'due-diligence', 'legal-research-aid'],
    whyItWorks:
      "Regulatory summaries written for a general audience routinely blur the line between what's currently in force, what's scheduled to take effect later, and what's merely proposed — a news article covering a pending bill and an official regulator's page describing current law can look identically confident, and a synthesis that doesn't force a status label onto every item will tend to flatten that distinction into one uniform-sounding checklist, which is exactly backwards for something meant to inform real compliance decisions. Requiring the actual statute or regulator name as the citation, rather than a secondary summary of the law, matters because plain-language explainer articles about regulation are frequently written before an amendment or a court ruling changes the underlying requirement, and a citation trail that stops at the explainer rather than the regulation itself has no way to catch that the explainer has since gone stale. The freshness note on every item exists for the same reason a financial filing needs a reporting period attached — regulatory requirements are not static facts, and a checklist item with no indication of when it was last confirmed current is functionally an unverified claim wearing the formatting of a verified one. And the explicit gaps-and-uncertainty instruction, paired with the closing restatement that this supports rather than replaces legal counsel, keeps the entire exercise honestly scoped as what it actually is: a way to walk into a conversation with a lawyer already knowing what questions to ask, not a way to skip that conversation, which matters because regulatory interpretation genuinely requires judgment a research synthesis isn't positioned to exercise.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-health-claim-evidence-check',
    category: 'perplexity',
    title:
      'Check a health or treatment claim against clinical evidence, not anecdote or marketing',
    description:
      'An evidence-tiering prompt — explicitly not medical advice — that requires a health or treatment claim to be checked against clinical-trial evidence specifically, with anecdotal and marketing-sourced claims flagged and ranked separately rather than blended into one confidence level.',
    promptText: `Check this health or treatment claim against the actual clinical evidence. This is a research aid to help me understand what the evidence says and ask my doctor better questions — it is not medical advice, and any decision about my own health goes through an actual clinician, not this answer.

CLAIM
{{health_claim}}

WHERE I ENCOUNTERED IT
{{claim_source}}

RELEVANT CONTEXT
{{relevant_context}}

EVIDENCE TIERS — do not blend these together
1. Systematic reviews and meta-analyses on this specific claim, if any exist.
2. Individual randomized controlled trials, noting sample size and whether it was tested on a population comparable to the context I gave above.
3. Observational studies or smaller/preliminary trials — genuinely informative but weaker evidence, and should be labeled as such rather than presented with the same confidence as tier 1 or 2.
4. Anecdotal reports, forum discussion, or individual practitioner opinion — potentially worth mentioning as context on how the claim is perceived, but explicitly not evidence for whether the claim is true.

FOR EACH TIER FOUND
State what the evidence actually shows, including effect size where reported, not just direction ("helped" vs. "reduced symptom severity by roughly X in Y% of participants"). Note any significant limitation the evidence itself acknowledges — small sample, short follow-up period, funding source, population that may not generalize to my context.

WEIGHING IT ALL
State an overall sense of how strong the evidence is for this specific claim, driven mainly by the highest tier of evidence that actually exists — a single tier-4 anecdote and a well-powered tier-2 trial should never produce the same confidence level in the final answer, even if you mention both.

If credible clinical evidence directly contradicts the claim, or if there is currently no credible evidence either way, say that plainly rather than defaulting to a noncommittal "more research is needed" that avoids stating what's actually known so far.

Close with an explicit reminder that this is a summary of publicly available research, not a diagnosis or treatment recommendation, and that any decision belongs with a licensed clinician who knows my actual medical history.`,
    variables: [
      {
        name: 'health_claim',
        description: 'The specific health or treatment claim to check.',
        example:
          'Magnesium glycinate supplementation before bed significantly improves sleep quality in adults with mild insomnia.',
        required: true,
      },
      {
        name: 'claim_source',
        description: 'Where the claim was encountered.',
        example:
          "A wellness influencer's Instagram post promoting a specific supplement brand",
        required: false,
      },
      {
        name: 'relevant_context',
        description:
          'Relevant personal or population context that affects how the evidence should be weighed, without needing sensitive medical detail.',
        example:
          'Generally healthy adult, no diagnosed sleep disorder beyond occasional trouble falling asleep',
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro (Academic focus)'],
    tags: ['health-research', 'evidence-tiers', 'clinical-evidence', 'fact-checking'],
    whyItWorks:
      'Health claims circulating outside clinical literature routinely mix genuinely rigorous evidence with anecdote and marketing copy in a way that reads as uniformly confident regardless of which one it actually is — a supplement brand\'s page and a peer-reviewed meta-analysis can both state a benefit in the same declarative sentence structure, and a synthesis that doesn\'t explicitly separate evidence tiers will tend to inherit that flattening rather than correct for it. Requiring a distinct tier structure, and explicitly forbidding a single anecdote and a well-powered trial from producing the same confidence level, is the direct fix for that specific failure — it forces the model\'s stated confidence to actually track the strength of what it found rather than the volume or persuasiveness of how the claim is usually phrased online, since marketing content is by nature written to be maximally convincing regardless of the underlying evidence quality. Asking for effect size rather than just direction matters because "helped" or "improved" conveys almost no usable information on its own — a treatment that improves an outcome for 5% of a narrow subgroup and one that improves it for 60% of a general population are both technically "shown to help," and only the effect size actually distinguishes a meaningful clinical finding from a statistically detectable but practically negligible one. And the explicit not-medical-advice framing, restated at the close rather than only as a disclaimer at the top, matters because a well-organized, evidence-tiered answer can read as more authoritative than a typical AI response precisely because of how carefully it\'s structured — which makes the reminder that this supports rather than replaces a clinician\'s judgment more necessary here, not less, since the format\'s own credibility is part of what needs to be kept in check.',
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro and Academic focus mode.',
      },
    ],
  },
  {
    slug: 'perplexity-technical-concept-primary-docs-explainer',
    category: 'perplexity',
    title:
      'Explain a technical concept grounded in official documentation, not third-party tutorials',
    description:
      "A technical-explainer prompt that requires every claim about a specific tool, API, or protocol's behavior to be checked against its own official documentation or source, with third-party tutorials explicitly used only to check for outdated or version-specific drift.",
    promptText: `Explain this technical concept, but ground every specific behavioral claim in the tool's own official documentation, source code, or official changelog — not in third-party tutorials, Stack Overflow answers, or blog posts, which frequently describe an older version's behavior without saying so.

CONCEPT / FEATURE
{{technical_concept}}

TOOL / VERSION
{{tool_and_version}}

WHY I NEED THIS
{{use_case_context}}

MY CURRENT UNDERSTANDING (correct me if this is wrong or outdated)
{{current_understanding}}

RULES
- For any claim about specific behavior, default values, or configuration options, cite the official documentation page or the specific source file/changelog entry, not a tutorial's paraphrase of it.
- If the official documentation is ambiguous, incomplete, or contradicts itself between pages, say so explicitly rather than picking whichever reading sounds cleaner.
- You may use third-party tutorials or forum posts specifically to flag "this changed in version X and a lot of older tutorials still describe the old behavior" — that's a legitimate and useful use of secondary sources, distinct from using them as the primary evidence for how the feature currently works.
- If my current understanding above is based on outdated behavior, name specifically what changed and in which version, rather than just correcting me without explaining why my prior understanding was reasonable at some point.

OUTPUT FORMAT
1. A clear explanation of how the concept actually works in the specified version, with inline citations to official sources.
2. A short "common misconception" note if third-party content commonly describes this differently, explaining specifically why the common version is wrong or outdated.
3. A minimal, correct example if relevant, verified against the same official source rather than adapted from a tutorial's example.`,
    variables: [
      {
        name: 'technical_concept',
        description: 'The specific concept, feature, or behavior to explain.',
        example:
          'How React Server Components handle data fetching and caching by default',
        required: true,
      },
      {
        name: 'tool_and_version',
        description: 'The exact tool and version this should be scoped to.',
        example: 'Next.js 15 App Router',
        required: true,
      },
      {
        name: 'use_case_context',
        description: 'Why this needs to be current and accurate, for scoping depth.',
        example:
          'Deciding whether our existing data-fetching pattern needs to change after upgrading from Next.js 13',
        required: false,
      },
      {
        name: 'current_understanding',
        description:
          'What you currently believe about how this works, so it can be checked and corrected specifically.',
        example:
          'I believe fetch calls in Server Components are cached indefinitely by default unless explicitly opted out.',
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro Search'],
    tags: ['technical-research', 'documentation', 'developer-tools', 'version-accuracy'],
    whyItWorks:
      "Technical tutorials and forum answers have an extremely long shelf life on the open web relative to how fast the tools they describe actually change — a Stack Overflow answer from three major versions ago still ranks well for the same search query today, and a search-grounded answer engine has no inherent reason to prefer the currently-accurate official doc over the more heavily-linked, better-SEO'd tutorial describing an old default. Explicitly anchoring every behavioral claim to official documentation or source rather than secondary explainers routes retrieval toward the one source type that's actually authoritative about current behavior, while still permitting third-party content for the specific, legitimate task of flagging version drift — a distinction that matters because banning secondary sources entirely would also throw away one of the most useful signals available: a tutorial explicitly warning that behavior changed is itself evidence worth surfacing, just not evidence about what the current behavior is. Requiring the model to name what changed and in which version, rather than just correcting an outdated understanding, matters for a practical reason specific to technical work — a developer's mental model of a tool is frequently correct for the version they learned it on, and treating it as simply wrong without dating the actual change makes it harder to know whether other related assumptions from around that same era also need rechecking. And flagging documentation that's ambiguous or self-contradictory rather than silently picking a reading matters because official docs are themselves imperfect artifacts, often lagging behind a feature's actual shipped behavior or containing pages written by different authors at different times that were never fully reconciled — treating the documentation as infallible just because it's the primary source would trade one blind spot for another.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-breaking-news-verification-check',
    category: 'perplexity',
    title:
      'Check a breaking or fast-moving story before sharing it, with a timestamp on every source',
    description:
      "A live-event verification prompt built for genuinely fast-moving stories, requiring a publish timestamp on every source and an explicit split between what multiple outlets have confirmed and what is still single-sourced or unconfirmed, so an early report doesn't get treated as settled fact.",
    promptText: `Check the current state of this fast-moving story before I share or act on it. Treat this as genuinely live — the situation may have facts still emerging or changing, and I need to know specifically what's confirmed versus what's still developing, not a single blended narrative.

STORY / EVENT
{{event_description}}

WHAT I SAW AND WHERE
{{initial_report}}

WHAT THIS IS FOR
{{decision_context}}

RULES
- For every source, state its publish or last-updated timestamp, as precisely as available (date and time, not just date, if the story is developing within a single day) — a live story needs finer time resolution than a normal research question does.
- Explicitly separate what multiple independent outlets are now reporting consistently from what still traces back to a single initial report, an unconfirmed account, or an official statement that hasn't yet been independently verified by other reporting.
- If any major outlet has issued a correction, retraction, or update to their initial reporting on this story, surface that specifically — an early version of a fast-moving story being wrong or incomplete is common, not unusual, and a correction is important signal, not noise to filter out.
- Note if the most recent information you can find is itself already some time old relative to how fast this story is moving — say explicitly how stale your most recent source is, since a "current" answer to a live story can go stale within hours.

OUTPUT FORMAT
1. What is now confirmed by multiple independent sources, each with its timestamp.
2. What is still single-sourced, attributed to an unnamed source, or otherwise unconfirmed — clearly separated from the section above.
3. Any correction or retraction found, and what it changed.
4. A one-line note on how confident I should be treating this as settled right now, given how fast it's moving and how recent the best available information actually is.

Do not synthesize the confirmed and unconfirmed sections into one smooth narrative — keep the distinction visible in the final output, not just in your own reasoning.`,
    variables: [
      {
        name: 'event_description',
        description: 'The event or story to check.',
        example: 'Reports of a major cloud provider outage affecting multiple regions',
        required: true,
      },
      {
        name: 'initial_report',
        description: 'Where and how you first encountered this, for context.',
        example:
          'A post on a social platform citing "reports from affected users," no official statement linked',
        required: true,
      },
      {
        name: 'decision_context',
        description:
          'What you need this verification for, so urgency and depth are scoped correctly.',
        example:
          'Deciding whether to post a public status update to our own customers about a possible dependency on this provider',
        required: false,
      },
    ],
    targetTools: ['Perplexity Pro (Sonar Pro)', 'Perplexity Pro Search'],
    tags: ['breaking-news', 'live-verification', 'source-timestamps', 'misinformation'],
    whyItWorks:
      "Fast-moving stories are the specific case where a search-grounded answer engine's biggest structural weakness — no guaranteed freshness on any given result — matters most, because the gap between a story's initial, often-wrong first report and its later, corrected version can be a matter of hours, and a synthesis that doesn't force fine-grained timestamps onto every source has no way to signal to the reader which version of the story they're actually looking at. Requiring a confirmed-versus-unconfirmed split, rather than one blended narrative, directly targets the actual mechanism by which breaking-news misinformation spreads: an early single-sourced report gets repeated by outlet after outlet within the first hour, and a naive citation count at that stage would read as strong corroboration when it's really the same unverified claim propagating faster than anyone has had time to check it — separating the two explicitly forces the model to notice whether later, independent reporting has actually confirmed the early claim or just repeated it. Explicitly asking for corrections and retractions, framed as expected and useful rather than as noise, matters because a model doing a single retrieval pass on a live story will often just find whatever is most recently indexed without checking whether an earlier claim from the same story has since been walked back — and for genuinely volatile stories, the correction is frequently more informative than the original claim, since it tells you specifically what the initial version got wrong. And the explicit staleness check on the model's own most recent source — the model naming exactly how old its best information is, relative to how fast the situation is moving — matters because a well-organized, timestamped-looking answer can still be built entirely from sources that are already outdated by the time it's assembled, and that risk is invisible to the reader unless the model states its own information's age directly rather than just formatting it confidently.",
    verifiedAgainst: [
      { tool: 'Perplexity Pro', version: 'Sonar Pro', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against Perplexity Pro Sonar Pro search.',
      },
    ],
  },
  {
    slug: 'perplexity-source-evaluation-credibility-scorecard',
    category: 'perplexity',
    title: `Turn a pile of open tabs into a credibility scorecard instead of a gut-feel judgment call`,
    description: `A Comet browsing brief that scores each source you've gathered on independence, track record, and how directly it addresses the claim — instead of letting the most confidently written page win by default.`,
    promptText: `You are scoring the sources currently open in my browser tabs (or the ones I list below) for how much weight each one should actually carry on the claim I'm evaluating — not for how well-written or authoritative each page sounds.

CLAIM BEING EVALUATED
{{claim_under_evaluation}}

SOURCES TO SCORE
{{source_list_or_tabs}}

WHAT THIS DECISION AFFECTS
{{decision_stakes}}

SCORING RULES
For each source, open it and check four things before assigning a score: (1) Independence — is this outlet/author reporting original findings, citing someone else's, or repackaging a press release with no added verification; (2) track record on this specific topic — has this source been right, wrong, or walked-back on similar claims before, based on what you can find; (3) directness — does the source actually address {{claim_under_evaluation}}, or does it address something adjacent that's being stretched to fit; (4) disclosed interest — does the source (or whoever it's citing) have a financial or reputational stake in the claim being true. A source that reads confidently but fails on directness or independence should score lower than a hedged source that's closer to the primary data — do not let writing quality substitute for evidentiary weight.

SCORE EACH SOURCE
Name | Independence (High/Med/Low) | Directness (High/Med/Low) | Disclosed Interest (None/Some/Significant) | One-line reason for the overall weight you're giving it.

OVERALL VERDICT
State which 1-2 sources should actually anchor a decision on {{decision_stakes}}, and which sources — even if they showed up high in search results — should be treated as color or background only. If every source you found shares the same weakness (e.g. all trace back to one original report), say so explicitly, since that changes how much total confidence the claim deserves regardless of how many pages repeat it.

If you cannot verify one of the four checks for a source (e.g. the author's track record isn't findable), say that plainly rather than assigning a score anyway — an unscoreable gap is different from a low score and the two should never look the same in the output.`,
    variables: [
      {
        name: 'claim_under_evaluation',
        description: `The specific claim you need to weigh evidence on, stated precisely.`,
        example: `That a particular third-party logistics vendor has a 98% on-time delivery rate for cold-chain shipments.`,
        required: true,
      },
      {
        name: 'source_list_or_tabs',
        description: `URLs or a description of the open tabs/pages Comet should evaluate.`,
        example: `The vendor's own case study page, a trade-publication article citing the vendor, and a Reddit thread from logistics managers discussing the vendor.`,
        required: true,
      },
      {
        name: 'decision_stakes',
        description: `What this evaluation will actually be used to decide.`,
        example: `Whether to sign a 2-year contract with this vendor for our perishable-goods line.`,
        required: true,
      },
    ],
    targetTools: [`Perplexity Comet`],
    tags: [`source-evaluation`, `credibility-scoring`, `comet-browsing`, `due-diligence`, `research-analyst`],
    whyItWorks: `Comet operates as a browser agent that actually opens and reads the tabs in front of you rather than only running a search-index query, which makes it possible to check independence and directness against the live page itself — including bylines, disclosure statements, and outbound citations a search snippet would never surface. The four-check structure exists because a language model's default failure mode on source evaluation is fluency bias: a well-organized, confidently written page scores as more credible than a messier one even when the messier one is closer to primary data, so forcing independence and directness to be scored as separate, named fields breaks the correlation between writing quality and evidentiary weight instead of letting one contaminate the other. Requiring the model to check whether every source traces back to the same original report matters specifically because repeated citation creates an illusion of corroboration — five articles citing one press release is one data point wearing five costumes, and a scorecard that scores each article independently without flagging shared ancestry would overstate confidence exactly where it shouldn't. The instruction to distinguish an unscoreable gap from an actual low score matters because a model under instruction to always produce a score will otherwise quietly convert 'I couldn't verify this' into a middling default score, which erases the single most useful signal in the whole exercise — that some claims simply cannot be checked with what's available, and a decision resting on them should carry more caveats, not fewer.`,
    exampleOutput: `Vendor case study page | Independence: Low | Directness: High | Disclosed Interest: Significant | Reason: directly addresses the claim but is the vendor's own marketing content. Trade-publication article | Independence: Med | Directness: Med | Disclosed Interest: None found | Reason: cites the vendor's stat without independent verification. Reddit thread | Independence: High | Directness: Low | Disclosed Interest: None | Reason: firsthand accounts but anecdotal, not the specific 98% figure. Verdict: none of the three sources independently verifies the 98% figure — treat it as vendor-claimed, not confirmed, before signing.`,
    verifiedAgainst: [
      { tool: 'Perplexity Comet', version: '2026 browser agent', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against Perplexity Comet 2026 browser agent.`,
      },
    ],
  },
  {
    slug: 'perplexity-fact-check-claim-verification-browsing-trail',
    category: 'perplexity',
    title: `Fact-check a specific claim by making Comet show its browsing trail, not just its verdict`,
    description: `A verification prompt that requires Comet to name what it actually checked, where the primary source lives, and what a good-faith opposing reading would look like — instead of a flat true/false with no visible work.`,
    promptText: `Fact-check the claim below the way a careful editor would before it goes into something I'm putting my name on — not by summarizing what search results say about it, but by actually tracing it back to where it originates.

CLAIM TO CHECK
{{claim_text}}

WHERE I ENCOUNTERED IT
{{original_context}}

HOW STRICT TO BE
{{verification_bar}}

STEPS
1. Identify what kind of claim this is — a statistic, a quote, an event, a causal assertion — because each needs a different check. A statistic needs its original dataset or methodology; a quote needs the original recording or transcript, not a paraphrase in a later article; an event needs at least one primary account, not just coverage of coverage.
2. Trace it to the earliest identifiable source you can actually reach, and note how many steps of paraphrasing sit between that source and the version I encountered ({{original_context}}). More than one or two steps of paraphrasing is itself a risk signal worth naming.
3. Check whether the claim has been corrected, retracted, or disputed anywhere since it was first published — a claim that was true when written but has since been walked back should be flagged as such, not reported as still-current.
4. State the strongest good-faith version of a different reading of the same underlying facts, if one exists — not a strawman, but a real alternative interpretation someone informed could hold.

VERDICT
Give one of: Confirmed / Confirmed with caveats / Unconfirmed — can't verify / False / Partially true, misleadingly framed. Do not use "true" or "false" alone if the honest answer is closer to "technically accurate but missing context that changes its meaning" — that distinction is the actual point of this check.

SHOW YOUR TRAIL
List the specific pages you checked, in the order you checked them, and what each one told you — including any that turned out to be a dead end or a repeat of an earlier source.`,
    variables: [
      {
        name: 'claim_text',
        description: `The exact claim to verify, quoted as precisely as possible.`,
        example: `"A recent study found that remote-first companies have 40% lower voluntary turnover than office-mandated ones."`,
        required: true,
      },
      {
        name: 'original_context',
        description: `Where you saw the claim and in what form, so the paraphrase-distance can be measured.`,
        example: `A LinkedIn post summarizing an HR newsletter, which itself summarized a longer report.`,
        required: true,
      },
      {
        name: 'verification_bar',
        description: `How strict the check needs to be given what's riding on it.`,
        example: `High bar — this is going into a board deck recommending a policy change, not a casual Slack message.`,
        required: true,
      },
    ],
    targetTools: [`Perplexity Comet`],
    tags: [`fact-checking`, `claim-verification`, `primary-source-tracing`, `comet-browsing`, `editorial-review`],
    whyItWorks: `Asking for a flat true/false invites the single most common fact-checking failure: a claim that is technically accurate but stripped of the context that made it meaningful reads as 'true' under a binary system, when the honest and useful answer is that it's misleading. The five-option verdict scale exists specifically to make that distinction sayable instead of forcing it into a box it doesn't fit. The paraphrase-distance step matters because claims degrade predictably as they pass through summarization layers — a hedge in the original study becomes a flat statement two summaries later, and a model asked only 'is this true' has no structural reason to notice how many hops separate what it's checking from where the number actually came from; asking it to count the hops as a named step forces that degradation into view. Requiring Comet to check for retractions or corrections addresses a specific weakness of confident single-pass answers: a claim can have been accurate at publication and false now, and a check that only verifies the original claim's initial accuracy without checking what happened since will happily confirm something that's since been walked back. The 'show your trail' requirement is not cosmetic — a browser agent that can actually navigate to primary sources should be held to a different standard than a search-snippet summary, and forcing it to list the specific pages checked, in order, makes it possible to catch the difference between genuine verification and a plausible-sounding restatement of what search results already implied.`,
    exampleOutput: `Claim type: statistic. Traced to: a 2025 workplace-analytics firm report (not the HR newsletter or LinkedIn post, both of which paraphrased it). Paraphrase distance: 2 steps, and the LinkedIn post dropped the original's caveat that the sample was self-selected companies already committed to remote work. Since publication: no retraction found, but a 2026 follow-up from a different analytics firm found a smaller 22% gap using a broader sample. Verdict: Partially true, misleadingly framed — the 40% figure is real but comes from a non-representative sample and a more recent, broader study found a substantially smaller effect.`,
    verifiedAgainst: [
      { tool: 'Perplexity Comet', version: '2026 browser agent', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against Perplexity Comet 2026 browser agent.`,
      },
    ],
  },
  {
    slug: 'perplexity-citation-extraction-quote-provenance-table',
    category: 'perplexity',
    title: `Pull every citable claim out of a page (or thread of pages) into a table with exact quotes and provenance`,
    description: `A structured extraction prompt for Comet that separates verbatim quotes from paraphrase, keeps page-level provenance for each one, and flags anything that can't be traced back to where it's attributed — built for anyone assembling a sourced document from multiple browser tabs.`,
    promptText: `Extract every claim from the source(s) below that would need a citation if I used it in {{output_document_type}}, and build a citation table I can paste directly into that document.

SOURCE(S) TO EXTRACT FROM
{{source_pages}}

WHAT COUNTS AS CITABLE HERE
{{citable_claim_types}}

CITATION FORMAT NEEDED
{{citation_style}}

EXTRACTION RULES
Go through the source(s) and pull out every claim matching {{citable_claim_types}} — do not paraphrase a claim into your own words in the extraction itself; capture it as close to verbatim as the source states it, and mark clearly whether what you captured is a direct quote (use quotation marks exactly as in the source) or your own compressed restatement of a longer passage (mark this explicitly as "paraphrased"). For every claim, note the exact page or section it came from — not just the site name — so I can find it again without re-reading the whole source. If a claim on the page is itself attributed to another source that isn't the page in front of you (e.g. "according to a 2025 industry report..."), note that the citation trail goes one level deeper and flag it rather than citing the page you're reading as if it were the origin.

OUTPUT TABLE
Claim (quote or paraphrase, labeled) | Exact location (page/section/paragraph) | Attributed origin if different from the page itself | Formatted citation in {{citation_style}}.

WHAT NOT TO DO
Do not invent a page number, publication date, or author name if the source doesn't actually display one — write "not stated on page" rather than guessing, since a fabricated citation detail is worse than an honest gap. Do not silently merge two similar claims from different parts of the source into one row if they're phrased differently — list them separately even if redundant, and let me decide whether to consolidate.

End with a short list of any claims you found compelling but could not locate a specific, quotable location for — these need a second look before they go in the document.`,
    variables: [
      {
        name: 'output_document_type',
        description: `What you're building the citations for, so citability is scoped correctly.`,
        example: `an internal competitive-analysis memo that will be reviewed by legal before wider distribution`,
        required: true,
      },
      {
        name: 'source_pages',
        description: `The specific page(s) or open tabs Comet should extract from.`,
        example: `three competitor pricing pages and one analyst report PDF, all currently open`,
        required: true,
      },
      {
        name: 'citable_claim_types',
        description: `What kinds of statements actually need a citation for this document.`,
        example: `pricing figures, feature availability claims, and any stated customer counts — not general marketing language`,
        required: true,
      },
      {
        name: 'citation_style',
        description: `The citation format the output should be formatted in.`,
        example: `informal internal style: [Source name, page/section, access date]`,
        required: false,
      },
    ],
    targetTools: [`Perplexity Comet`],
    tags: [`citation-extraction`, `provenance-tracking`, `quote-verification`, `comet-browsing`, `document-sourcing`],
    whyItWorks: `The quote-versus-paraphrase distinction is the single highest-leverage rule in this prompt because a language model's default extraction behavior is to lightly rephrase everything into consistent prose, which quietly turns an exact quote into something that looks like one but isn't — a difference that matters enormously the moment a citation gets checked against its source. Requiring page- or section-level location rather than just the site name matters because Comet is browsing live pages, not summarizing an index entry, so it actually has access to where on the page a claim sits — asking for that level of detail uses the one capability a browsing agent has that a plain search-summary tool doesn't. The instruction to flag one-level-deeper attribution (a page citing another source) exists because extraction tools commonly collapse a chain of attribution into a single citation to the page in front of them, which silently misattributes a claim to whoever happened to repeat it rather than whoever originated it — flagging this explicitly keeps the citation trail honest instead of one hop short. The explicit ban on inventing missing details (a page number, an author, a date) addresses a known model failure mode under table-formatting pressure: an empty cell feels incomplete, and the path of least resistance is to fill it with something plausible rather than admit the source doesn't provide it — writing 'not stated on page' as the required fallback removes the incentive to guess. Keeping duplicate-seeming claims as separate rows rather than letting the model silently consolidate them preserves editorial control over a judgment call that belongs to the person assembling the document, not to the extraction step.`,
    exampleOutput: `Claim: "pricing starts at $49/seat/month for teams under 20" (direct quote) | Location: pricing page, second pricing tier card | Attributed origin: the page itself | Citation: [Competitor X pricing page, 2026-08-09]. Claim: over 10,000 companies use the product (paraphrased from "joins the 10k+ companies already...") | Location: homepage hero section | Attributed origin: page itself, no methodology given for the count | Citation: [Competitor X homepage, 2026-08-09]. Flagged for second look: a claim about "industry-leading uptime" with no specific figure or source named anywhere on the page.`,
    verifiedAgainst: [
      { tool: 'Perplexity Comet', version: '2026 browser agent', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Perplexity Comet 2026 browser agent.`,
      },
    ],
  },
  {
    slug: 'perplexity-contradiction-finder-cross-source-audit',
    category: 'perplexity',
    title: `Find where your sources actually disagree before you write something that pretends they don't`,
    description: `A cross-source audit prompt for Comet that hunts specifically for contradictions between the pages you've gathered — on numbers, dates, causes, and attribution — rather than producing a synthesis that smooths disagreement into false consensus.`,
    promptText: `Compare the sources below and find every place where they actually disagree with each other — not where they simply cover different aspects of the same topic, but where two or more say something that cannot both be true as stated.

SOURCES TO COMPARE
{{source_set}}

TOPIC THEY'RE ALL ABOUT
{{shared_topic}}

WHY THIS MATTERS RIGHT NOW
{{stakes_or_deadline}}

WHAT COUNTS AS A CONTRADICTION
Look specifically for: different numbers reported for the same metric (even if close — note both and the gap); different dates given for the same event; different causal explanations offered for the same outcome; different people or organizations credited or blamed for the same thing; and one source stating something as settled that another source frames as disputed or unconfirmed. Do not report two sources as contradicting each other if they're actually just covering different scopes or time periods that happen to look like disagreement at a glance — check the scope before flagging it as a real conflict.

FOR EACH CONTRADICTION FOUND
State the two (or more) conflicting claims side by side, name which source said which, and give your best assessment of why they might disagree — different methodology, different time period, one source being outdated, one source having a stake in a particular framing, or genuinely unresolved uncertainty in the underlying facts. Rank each contradiction by how much it would matter to someone relying on {{shared_topic}} for {{stakes_or_deadline}} — a contradiction on the core number matters more than a contradiction on a minor supporting detail.

WHAT NOT TO DO
Do not resolve a contradiction by picking a side and reporting only the version you find more credible unless you also show the rejected claim and say explicitly why you're discounting it. Do not average two conflicting numbers together and present the average as if it were a finding — an average of two disagreeing sources is not itself evidence of anything.

CLOSE WITH
A one-line statement of whether the sources are in strong overall agreement with a few edge disagreements, or whether the disagreement is central enough that {{shared_topic}} should be treated as genuinely unsettled right now.`,
    variables: [
      {
        name: 'source_set',
        description: `The specific pages, articles, or reports being compared.`,
        example: `four news articles and one regulatory filing about the same product recall, all currently open in tabs`,
        required: true,
      },
      {
        name: 'shared_topic',
        description: `The specific topic or event all the sources are covering.`,
        example: `the scope and cause of a manufacturer's recent product recall`,
        required: true,
      },
      {
        name: 'stakes_or_deadline',
        description: `What decision or deadline makes resolving the disagreement matter.`,
        example: `deciding by Friday whether our company needs to issue our own customer notice`,
        required: true,
      },
    ],
    targetTools: [`Perplexity Comet`],
    tags: [`contradiction-detection`, `cross-source-audit`, `source-triangulation`, `comet-browsing`, `conflict-resolution`],
    whyItWorks: `A model asked to simply synthesize multiple sources will default to smoothing over disagreement into a single coherent-sounding narrative, because fluent synthesis is the path of least resistance and a paragraph that acknowledges no tension reads more confidently than one that surfaces it — this prompt exists specifically to counteract that pull by making contradiction-hunting the primary task instead of a byproduct of summarizing. The explicit list of contradiction types (numbers, dates, causal attribution, credit/blame, settled-versus-disputed framing) matters because an unguided search for 'disagreement' tends to catch only the most obvious cases and miss subtler ones, like one source treating something as established fact that another source explicitly flags as still under investigation — naming these categories forces a systematic pass rather than an impressionistic one. The instruction to check scope before flagging a false contradiction addresses a real failure mode: two sources covering different time windows or different sub-populations of the same broader topic will often look contradictory at a surface read when they're actually both accurate about different things, and treating every surface-level mismatch as a real conflict would flood the output with false positives that bury the genuine ones. Banning the average-the-numbers move matters because averaging two disagreeing figures manufactures a false sense of precision — the midpoint of two contested numbers has no evidentiary status of its own, and presenting it as a finding would be a worse outcome than honestly reporting the disagreement and letting the reader decide how to weigh it.`,
    exampleOutput: `Contradiction 1 (high stakes): Article A reports the recall affects 12,000 units; Article B and the regulatory filing report 45,000 units. Article A appears to cite only the initial press release before the scope was expanded — likely outdated rather than a genuine disagreement. Contradiction 2 (lower stakes): Two articles differ on whether the defect was a manufacturing error or a design flaw; this appears to be a genuine unresolved disagreement, since the regulatory filing itself states the cause is still under investigation. Overall: the units-affected number should be treated as unsettled until the regulatory filing's figure is confirmed as final, and any customer notice should use a range rather than a single figure.`,
    verifiedAgainst: [
      { tool: 'Perplexity Comet', version: '2026 browser agent', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against Perplexity Comet 2026 browser agent.`,
      },
    ],
  },
  {
    slug: 'perplexity-due-diligence-vendor-background-brief',
    category: 'perplexity',
    title: `Run a background check on a vendor or counterparty before you're the one explaining why nobody checked`,
    description: `A phased due-diligence brief for Comet covering public record, reputation, litigation history, and financial-stability signals — built so the research task can't quietly stop at whatever the company's own site says about itself.`,
    promptText: `Run a due-diligence background check on the counterparty below before we move forward with {{engagement_type}}. Treat this as a research task with distinct phases, not a single search-and-summarize pass — go through each phase in order and don't skip one because an earlier phase already looked reassuring.

COUNTERPARTY
{{counterparty_name}}

WHAT WE'RE ABOUT TO ENTER INTO
{{engagement_type}}

WHAT WOULD BE DISQUALIFYING
{{disqualifying_concerns}}

PHASE 1 — WHO THEY ARE
Confirm the legal entity name, where it's registered, how long it's operated under this name, and whether it's a subsidiary of, or recently spun out from, another company. Note if the entity name on their marketing materials differs from any legal or registration filings you can find.

PHASE 2 — TRACK RECORD
Search for litigation, regulatory action, or formal complaints involving this entity or its named leadership — not just news coverage, which can lag or miss smaller actions. Separately search for customer or partner complaints in forums, review sites, or industry groups, and note whether a pattern shows up across multiple independent sources or whether it's a single loud complaint.

PHASE 3 — FINANCIAL AND OPERATIONAL SIGNALS
Look for any public signal of financial instability — layoffs, executive departures in a short window, funding difficulties, missed public deadlines — while being clear that absence of bad news is not the same as confirmed stability, and say so rather than treating silence as a clean bill of health.

PHASE 4 — CHECK AGAINST DISQUALIFYING CONCERNS
Go back through {{disqualifying_concerns}} specifically and state, for each one, whether you found evidence for it, evidence against it, or no evidence either way — don't fold this into the general narrative above; address each concern by name so none of them can get lost in a longer summary.

FINAL BRIEF
One paragraph verdict: proceed, proceed with named conditions, or hold pending more research — and if it's the last one, say specifically what additional check would resolve the open question, not just that more research is needed in general.`,
    variables: [
      {
        name: 'counterparty_name',
        description: `The company or individual being checked.`,
        example: `a mid-size contract manufacturer we're considering for a multi-year supply agreement`,
        required: true,
      },
      {
        name: 'engagement_type',
        description: `What kind of relationship or transaction this due diligence is in service of.`,
        example: `signing a 3-year exclusive supply contract worth roughly $2M annually`,
        required: true,
      },
      {
        name: 'disqualifying_concerns',
        description: `Specific concerns that would actually change the decision if confirmed.`,
        example: `any pending litigation over IP theft, any history of missed delivery deadlines with past clients, or ownership ties to a competitor`,
        required: true,
      },
    ],
    targetTools: [`Perplexity Comet`],
    tags: [`due-diligence`, `vendor-vetting`, `background-check`, `comet-browsing`, `risk-assessment`],
    whyItWorks: `Structuring this as four ordered phases rather than one open-ended 'research this company' instruction matters because unstructured due-diligence research tends to stop as soon as it finds something reassuring — a clean-looking marketing site or a few positive reviews satisfies the surface-level goal and the search stops before checking litigation records or financial-instability signals that don't show up on page one of a general search. Phasing forces those checks to happen regardless of what earlier phases found, which is exactly the discipline a real due-diligence process is supposed to enforce. Separating the legal-entity check into its own phase matters because a subsidiary or recently renamed entity can carry a clean record simply because the record is attached to the wrong name — checking registration and entity history first prevents every later phase from unknowingly searching for the wrong legal name. The instruction that absence of bad news isn't confirmed stability directly counters a model's tendency to report a null result ('no evidence of financial trouble found') in language that reads as reassurance rather than as the more accurate 'this wasn't checkable with public information' — the distinction matters enormously to whoever is relying on this brief to make a real decision. Requiring each disqualifying concern to be addressed by name in its own dedicated phase, rather than folded into a general narrative, exists because a long-form summary can technically mention a concern in passing while never actually stating whether evidence for or against it was found — named, itemized treatment closes that gap and makes the brief auditable against the specific concerns that were supposed to be checked.`,
    exampleOutput: `Phase 1: Legal entity registered under a slightly different name than shown on their marketing site; operating for 6 years, no subsidiary ties found. Phase 2: One small-claims dispute found from 2023, resolved; no pattern of complaints across review sites beyond normal variance. Phase 3: A senior operations executive departed in the past 4 months per LinkedIn; no public statement on the reason, no other instability signals found. Phase 4 (disqualifying concerns): no evidence of IP litigation found; no pattern of missed deadlines found in available reviews; no ownership ties to a named competitor found. Verdict: proceed with a condition — get a direct explanation for the recent executive departure before signing, since it's the one open item without a public answer.`,
    verifiedAgainst: [
      { tool: 'Perplexity Comet', version: '2026 browser agent', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against Perplexity Comet 2026 browser agent.`,
      },
    ],
  },
  {
    slug: 'perplexity-source-comparison-competing-narratives-table',
    category: 'perplexity',
    title: `Lay two competing accounts of the same story side by side without letting one quietly win by default`,
    description: `A short, direct comparison prompt for when two sources tell meaningfully different versions of the same event — built to keep both accounts intact and visible rather than blending them into whichever one Comet found more persuasive.`,
    promptText: `Compare these two accounts of the same event side by side. Do not blend them into one combined narrative — I need to see exactly where they overlap and exactly where they diverge, kept clearly separate.

EVENT
{{event_description}}

ACCOUNT A
{{source_a}}

ACCOUNT B
{{source_b}}

WHAT I'M TRYING TO FIGURE OUT
{{comparison_purpose}}

Build a two-column comparison covering: what happened (the core sequence of events, and where the two accounts agree versus diverge on it), who is credited or blamed, what evidence or sourcing each account offers for its version (a named witness, a document, an anonymous source, no sourcing given), and what each account leaves out that the other one includes. Where the two accounts simply can't both be accurate, say so plainly rather than implying a middle-ground version that neither source actually supports.

Then answer {{comparison_purpose}} directly, stating which account your answer leans on and why — and naming the specific piece of missing information that, if it surfaced, would most change which account looks more credible.`,
    variables: [
      {
        name: 'event_description',
        description: `A neutral one-line description of the event both accounts are covering.`,
        example: `a public dispute between two former co-founders over who originated a product idea`,
        required: true,
      },
      {
        name: 'source_a',
        description: `The first account — a URL, quote, or summary of what it says.`,
        example: `founder A's blog post timeline of events`,
        required: true,
      },
      {
        name: 'source_b',
        description: `The second, competing account.`,
        example: `founder B's public statement responding to the blog post`,
        required: true,
      },
      {
        name: 'comparison_purpose',
        description: `What you're actually trying to determine by comparing the two.`,
        example: `whether our company should continue publicly crediting founder A as the sole originator in our own materials`,
        required: true,
      },
    ],
    targetTools: [`Perplexity Comet`],
    tags: [`source-comparison`, `competing-narratives`, `bias-detection`, `comet-browsing`, `evidence-weighing`],
    whyItWorks: `The explicit instruction not to blend the two accounts matters because a language model's default behavior when comparing two versions of a story is to produce a synthesized middle account — a version that sounds balanced but that neither original source actually supports, which is a worse outcome than honestly reporting two accounts that disagree, since the synthesized middle can misrepresent both. Keeping the comparison in a strict two-column structure, rather than a flowing paragraph, prevents the model from silently resolving a divergence by choosing which detail to lead with — a structural constraint does work here that an instruction alone can't, because a table format makes an unaddressed cell visible in a way a paragraph doesn't. Asking specifically what evidence or sourcing each account offers — a named witness versus an anonymous source versus no sourcing at all — matters because the two accounts of a personal or reputational dispute often differ far more in evidentiary weight than they do in the plausibility of the story itself, and a plain narrative comparison tends to treat both accounts as equally weighted by default simply because both are being described in the same register. Requiring the final answer to name the specific missing piece of information that would flip the comparison is the mechanism that keeps the whole exercise honest about its own uncertainty — it's an explicit acknowledgment that the comparison, however careful, is being made with an incomplete picture, and states exactly what would close that gap rather than implying the comparison is more settled than it is.`,
    exampleOutput: `Agreement: both accounts agree the product idea was discussed at a specific meeting in early 2024. Divergence: Account A says the idea was fully specced by founder A before the meeting; Account B says it emerged collaboratively during the meeting itself. Sourcing: Account A offers a dated internal document; Account B offers no documentary evidence, only its own recollection. Given the documentary evidence gap, this leans toward Account A's version being more defensible for now — though the specific missing piece that would change this is whether founder B can produce any dated notes or messages predating the meeting.`,
    verifiedAgainst: [
      { tool: 'Perplexity Comet', version: '2026 browser agent', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against Perplexity Comet 2026 browser agent.`,
      },
    ],
  },
  {
    slug: 'perplexity-pre-publish-verification-checklist',
    category: 'perplexity',
    title: `Run a pre-publish verification pass so a factual mistake doesn't ship because nobody re-checked the draft`,
    description: `A final-pass checklist prompt for Comet that re-verifies every checkable claim in a near-final draft against live sources, rather than trusting whatever was verified when the draft was first written.`,
    promptText: `Before this piece goes out, run a verification checklist against the draft below. Treat every version-1 fact-check as potentially stale — re-verify against current sources now, not against whatever was true when the draft was first written.

DRAFT TO CHECK
{{draft_text}}

WHERE THIS IS PUBLISHING
{{publication_context}}

DEADLINE PRESSURE
{{deadline_note}}

CHECKLIST — GO CLAIM BY CLAIM
For every factual claim in the draft (a number, a name, a date, a quote, a status like "currently" or "as of now"), do the following: (1) check whether it's still accurate as of today, not just whether it was accurate when likely written; (2) check whether it's attributed to the right source in the draft, or whether the draft's citation doesn't actually match what that source says; (3) flag any claim stated more strongly in the draft than the underlying source actually supports (a source that says "likely" being reported in the draft as certain); (4) flag any claim that has no clear source at all, even if it reads as common knowledge.

OUTPUT
A numbered list matching the order claims appear in the draft: Claim | Status (Still accurate / Now outdated / Misattributed / Overstated / Unsourced) | What to fix, in one sentence. Only include claims that need a flag — don't pad the list with claims that checked out cleanly, since {{deadline_note}} means the list needs to be scannable, not exhaustive busywork.

End with a single line: publish as-is, publish after fixing the flagged items, or hold — do not soften this into "looks mostly good" if there's a flagged item serious enough to actually delay publication.`,
    variables: [
      {
        name: 'draft_text',
        description: `The near-final draft text to verify before it publishes.`,
        example: `a 900-word blog post citing three industry statistics and two named executives' public statements`,
        required: true,
      },
      {
        name: 'publication_context',
        description: `Where and to whom this will publish, which affects how strict the check needs to be.`,
        example: `the company's public blog, which gets cited by trade press`,
        required: true,
      },
      {
        name: 'deadline_note',
        description: `The time pressure this check is operating under, so the output stays proportionate.`,
        example: `publishing in 40 minutes, this is the last check before it goes live`,
        required: false,
      },
    ],
    targetTools: [`Perplexity Comet`],
    tags: [`pre-publish-check`, `verification-checklist`, `fact-check`, `comet-browsing`, `editorial-qa`],
    whyItWorks: `The instruction to treat every earlier fact-check as potentially stale exists because the single most common way a true claim becomes false in a published piece isn't sloppy original research — it's simply time passing between when a fact was checked and when the piece actually ships, and a verification pass that only re-reads the draft without re-checking against current sources will happily confirm a number that was accurate weeks ago and isn't anymore. Splitting the check into four distinct failure modes — outdated, misattributed, overstated, unsourced — matters because these are mechanistically different problems with different fixes, and collapsing them into one generic 'fact-check this' instruction tends to catch only the most obvious kind (outright wrong) while missing the subtler and arguably more common ones, like a source that hedges with 'likely' being flattened into a confident claim somewhere in the editing process. The overstatement check specifically matters for anything assembled from multiple drafts or contributors, since certainty tends to accumulate through revision even when the underlying evidence hasn't gotten any stronger — each pass smooths out a hedge that felt unnecessary in isolation, and only a check that compares the final wording back against the actual source will catch the cumulative drift. Limiting the output to only flagged claims, rather than a full annotated pass over every sentence, is a deliberate proportionality choice for a time-pressured final check — a long list of items that all checked out fine buries the one item that actually needs fixing, which is the opposite of what a pre-publish gate is for.`,
    exampleOutput: `3. Claim: "the executive said adoption would triple by year-end" | Status: Overstated | Fix: the source quote actually says adoption "could plausibly" triple, not that it will — soften the draft's wording to match. 5. Claim: "the platform serves 2 million users" | Status: Now outdated | Fix: the company's own site now states 2.4 million as of last week; update the figure or add an as-of date. Verdict: publish after fixing the two flagged items — neither requires new reporting, just a wording correction and a figure update.`,
    verifiedAgainst: [
      { tool: 'Perplexity Comet', version: '2026 browser agent', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against Perplexity Comet 2026 browser agent.`,
      },
    ],
  },
]
