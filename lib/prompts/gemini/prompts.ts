import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'gemini-long-context-multi-document-decision-memo',
    category: 'gemini',
    title: 'Turn a stack of scattered documents into one sourced decision memo',
    description:
      'A long-context synthesis prompt that loads every related document into the same context window as one connected evidence base and returns a single decision memo with inline citations and flagged disagreements, instead of a chain of disconnected per-document summaries that lose the connections between them.',
    promptText: `I'm giving you {{document_count}} documents in this conversation — some pasted, some uploaded as files — all relevant to one decision. Read every one of them in full, as a single connected body of evidence, before you write a single sentence of output. Do not summarize document 1, then document 2, then document 3 in sequence — that turn-by-turn approach is exactly what produces a stack of disconnected notes instead of a synthesis, and it's the failure mode this prompt exists to prevent.

DECISION THIS MEMO SUPPORTS
{{decision_topic}}

AUDIENCE
{{audience}} — write for what they already know and don't re-explain background they clearly have.

BEFORE YOU START WRITING
State how many of the {{document_count}} documents you actually read in full versus skimmed or could not fully access. If anything was too long to read completely in one pass, or a file failed to parse, say so explicitly before you write anything else. A memo built on a silent partial read is worse than no memo at all, because it looks equally confident either way.

BUILD ONE SHARED FACT BASE
Treat every fact from every document as an entry in one shared table, not nine separate summaries stapled together. Every fact you use in the memo needs a source tag — the document name or title, plus a page or section reference if one is visible in that document.

SURFACE DISAGREEMENT, DON'T RESOLVE IT
Wherever two or more documents give a different number, a different date, or a directly contradictory claim about the same thing, name the conflict explicitly on its own line. Do not quietly pick the figure that looks more official, more recent, or more precise and drop the other one. A reader making a real decision needs to know the inputs disagree, not just receive the answer you personally found more convincing.

STRUCTURE
Group every finding under these sections: {{memo_sections}}

For each section, lead with the actual conclusion in one sentence, then the supporting facts with their source tags underneath — don't bury the conclusion at the bottom of a paragraph of evidence.

WHAT'S STILL UNCLEAR
Close with a section listing every question these documents don't actually answer, even if an answer feels inferable. If none of the {{document_count}} documents state something the decision genuinely needs, name the gap. Don't fill it with a plausible-sounding assumption dressed up as a finding.

OUTPUT FORMAT
A memo, not a slide-deck outline and not a list of per-document summaries — {{target_length}}, written for {{audience}}, with inline citations formatted as (Source: document name, page/section). End with the disagreement list and the open-questions section as clearly labeled parts of the same document, not appendices someone has to hunt for.`,
    variables: [
      {
        name: 'document_count',
        description: 'How many documents you are pasting or uploading into the chat.',
        example: '9',
        required: true,
      },
      {
        name: 'decision_topic',
        description: 'The decision this synthesis needs to support.',
        example:
          'whether to consolidate two overlapping SaaS subscriptions into one enterprise contract',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who will read the memo, so the framing and detail level match.',
        example:
          'the finance director and the two team leads who currently own separate contracts',
        required: true,
      },
      {
        name: 'memo_sections',
        description: 'The section headers you want the findings grouped under.',
        example:
          'Cost comparison, Contract lock-in risk, Feature overlap, Migration effort',
        required: true,
      },
      {
        name: 'target_length',
        description: 'A rough length ceiling so the memo stays skimmable.',
        example: 'under three pages',
        required: false,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'long-context',
      'document-synthesis',
      'decision-memo',
      'multi-document',
      'research',
      'citations',
    ],
    whyItWorks:
      "Gemini's long-context window can hold every source document in the same context at once, which is the actual mechanism this prompt leans on — a synthesis built by summarizing documents one at a time in separate turns loses the ability to notice that document 3's figure contradicts document 7's, because by the time the model reads document 7 it never re-reads document 3 closely enough to compare them. Reading everything in one pass is what keeps that cross-document comparison possible at all. The instruction to surface contradictions rather than resolve them matters because long-context models have a well-documented pull toward quietly averaging or picking between conflicting numbers to produce one clean, confident answer, which hides exactly the information a real decision-maker needs to see and weigh themselves. Requiring a source tag on every fact turns the memo into something checkable — a reader who doubts a number can go straight to the cited document and page instead of having to re-verify the whole memo from scratch. The partial-read disclosure requirement guards against a specific and easy-to-miss failure: a very long or malformed upload can get truncated silently by the platform before it ever reaches the model, and without being told to check, the model will summarize what it saw as if it were the complete document, producing a confident memo built on a fraction of the actual evidence. The instruction to lead every section with a one-sentence conclusion before the supporting facts matters for a different reason: a busy audience reading a memo built from nine sources under time pressure will skim the first line of each section and decide from that alone whether to read further, so burying the actual finding under a paragraph of evidence — however well-sourced — means the memo fails at the one job it exists to do, regardless of how rigorous the synthesis underneath it was. Naming the audience explicitly also does real work beyond politeness: a memo written for people who already know the background will read as padded and condescending if it re-explains context they have, while one written without that calibration for people who don't have the background will read as confident but confusing, and a model given no signal about which situation it's in defaults to a generic middle register that under-serves both cases at once.",
    exampleOutput:
      "DECISION MEMO — SaaS Contract Consolidation\n\nCost comparison: Combining both tools under one enterprise contract saves an estimated 18% annually based on the vendor's tiered pricing sheet (Source: vendor_proposal.pdf, p.4) — but the current usage report shows Team B uses only 40% of the seats it's paying for today (Source: usage_export.csv), so the real savings may be understated if seat count is renegotiated down first.\n\nContract lock-in risk: vendor_proposal.pdf commits to a 3-year term for the discount; the current standalone contract (Source: current_msa.pdf, §2) is month-to-month — this is a meaningful increase in lock-in that the proposal's savings figure doesn't account for.\n\nWhat's still unclear: none of the 9 documents states whether Team B's low seat usage is temporary (a recent hire pause) or structural, which materially changes whether the consolidation math holds up in a year.",
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-20' }],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against Gemini 3 Pro on a nine-document SaaS-consolidation synthesis.',
      },
    ],
  },
  {
    slug: 'gemini-contract-redline-diff-analysis',
    category: 'gemini',
    title:
      'Diff a redlined contract against the original and flag every substantive change',
    description:
      "A long-context prompt that loads both the original and the redlined version of a contract into the same window and returns a change-by-change risk analysis, instead of a generic first read that misses a clause quietly weakened somewhere the visible tracked-changes markup doesn't draw the eye.",
    promptText: `I'm giving you two versions of the same contract: the original and a redlined counter-proposal. Read both in full before comparing anything — don't review the redline in isolation from what it's actually changing.

ORIGINAL
{{original_document}}

REDLINED COUNTER-PROPOSAL
{{redlined_document}}

CONTRACT CONTEXT
This is {{contract_type}}. {{your_party}}

WHAT COUNTS AS SUBSTANTIVE
Ignore pure formatting, renumbering, or wording changes that don't alter meaning or obligation — flooding the output with those is worse than useless, it buries the changes that actually matter. {{change_significance_threshold}}

INSTRUCTIONS
1. Go clause by clause. For every substantive change, quote the original wording and the new wording side by side, not just a paraphrase of what changed.
2. Classify each change into exactly one of: increases our obligation, reduces our protection, shifts cost to us, ambiguous/needs clarification, or favorable to us.
3. Cross-reference: if a change in one clause has a knock-on effect on another clause elsewhere in the document (a shortened notice period in §3 that makes a termination right in §9 harder to exercise in practice), name that connection explicitly — a change that looks small in isolation can be the one that matters most once you see what else it touches.
4. State plainly which of our known priorities this touches: {{known_priorities}}
5. This is a first-pass flag list to prepare for actual legal review, not legal advice itself — say so at the top of your output, and don't present any classification as a final legal determination.

DEFINED TERMS
If a redlined change modifies a defined term (a capitalized term with its own definition clause), search the rest of the redlined document for every other place that term is used and check whether the change to its definition actually alters what any of those other clauses now mean in practice — a definition change that looks narrow in isolation can quietly widen or narrow an obligation stated three sections away, and that connection is easy to miss unless you deliberately trace it.

CHANGES THAT WORK TOGETHER
Some redlines are only risky in combination — a shortened cure period paired with a broadened definition of what counts as a breach, for instance, is materially riskier than either change would be alone. Call out any pair or group of changes that compound each other's effect, not just each one individually.

IF NOTHING SUBSTANTIVE CHANGED IN A SECTION
Say so plainly rather than manufacturing a finding to fill out the output — a clause with no substantive redline doesn't need an entry just because every other clause got one; only flag sections that actually changed in a way that matters.

OUTPUT FORMAT
{{output_grouping}}. For each flagged change: clause reference, original vs. new wording, classification, and a one-line plain-English explanation of the practical effect. Follow the main list with a short section on compounding changes that only matter in combination, and end with a short list of changes you could not confidently classify and why, so a human reviewer knows exactly where to focus first.`,
    variables: [
      {
        name: 'original_document',
        description: 'The full text of the original, unmodified contract.',
        example:
          'Full text of the SaaS Master Services Agreement, original signed version.',
        required: true,
      },
      {
        name: 'redlined_document',
        description: "The counterparty's tracked-changes or redlined counter-proposal.",
        example: "Full text of the vendor's returned MSA with tracked-changes markup.",
        required: true,
      },
      {
        name: 'contract_type',
        description: 'What kind of contract this is, for context.',
        example: 'a 2-year SaaS vendor Master Services Agreement',
        required: true,
      },
      {
        name: 'your_party',
        description:
          'Which side of the contract you are on, since it changes what counts as risk.',
        example: 'We are the customer, not the vendor.',
        required: true,
      },
      {
        name: 'known_priorities',
        description: 'What actually matters to your side going into this review.',
        example:
          'payment terms and data-deletion timelines are non-negotiable for us; most other terms are open to discussion',
        required: true,
      },
      {
        name: 'change_significance_threshold',
        description: 'Any specific guidance on what to ignore versus flag.',
        example:
          'Ignore any change that is purely a section renumbering caused by an earlier deleted clause.',
        required: false,
      },
      {
        name: 'output_grouping',
        description: 'How you want the flagged changes organized in the output.',
        example:
          'grouped by contract section, most risky classification first within each section',
        required: true,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'long-context',
      'contract-review',
      'redline-diff',
      'legal-document-analysis',
      'risk-assessment',
      'due-diligence',
    ],
    whyItWorks:
      "Holding both the full original and the full redlined document in the same context window is what makes a genuine clause-by-clause diff possible — reviewing the redline alone, even with its own tracked-changes markup, only shows what the counterparty chose to visibly mark, and a party revising a contract in their own favor doesn't always mark every place a definition or a cross-reference elsewhere quietly shifts in meaning as a result. Asking for the original and new wording quoted side by side, rather than a paraphrase of the change, keeps every flagged item checkable against the actual contract text instead of trusting a summary of a summary. The cross-reference instruction targets the single most expensive kind of miss in contract review: a change that looks minor read in isolation — a shortened notice period, a redefinition of a defined term used elsewhere — but that quietly guts a separate clause's practical value once you trace where else that term or number is used, which is exactly the kind of connection a clause-by-clause read easily misses and a full-document long-context read is positioned to catch. Naming the specific known priorities up front changes what counts as a flag at all, not just how it's phrased — a clause a generic reviewer might rate as low-risk can be the single most important line item if it touches the one term your side has already decided is non-negotiable, and a model with no visibility into that priority has no way to weight it correctly on its own. The explicit not-legal-advice framing matters because a fluent, confidently classified risk table reads as more authoritative than it should be treated as — this output is meant to focus what a human (ideally counsel) looks at closely, not to replace that review. The instruction to trace a changed defined term through every other clause that uses it, rather than reviewing each redline where it visually appears, addresses a mechanic specific to how contracts are actually written: a definition clause is usually one short paragraph, but its effect is distributed across every place the defined term is later invoked, so a model reviewing redlines clause by clause in isolation will correctly flag the definition change itself while missing that it silently altered the meaning of an obligation stated four sections later that was never itself redlined. Calling out compounding changes separately from individual ones matters because risk in a negotiated contract is rarely additive — two moderate changes that interact can be materially more dangerous together than either reads in isolation, and a flat list that scores each change independently has no mechanism for surfacing that interaction at all.",
    exampleOutput:
      '§4.2 (Payment terms): Original — "Net 45 from invoice date." Redlined — "Net 15 from invoice date." Classification: shifts cost to us (working capital impact). Touches known priority: payment terms.\n\n§9.1 (Termination): Original — "either party may terminate with 90 days\' written notice." Redlined — "either party may terminate with 30 days\' written notice, provided all fees for the then-current term have been paid in full." Classification: ambiguous/needs clarification — the added payment condition could effectively block termination if a dispute over fees is unresolved at notice time; cross-references the payment-terms change above.\n\nCould not confidently classify: the revised definition of "Confidential Information" in §1.3 narrows the category, but it\'s unclear without seeing how the term is used downstream in §11 whether this favors or disadvantages us on balance.',
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-21' }],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Gemini 3 Pro on a redlined SaaS MSA counter-proposal.',
      },
    ],
  },
  {
    slug: 'gemini-multi-source-comparison-table',
    category: 'gemini',
    title:
      'Compare competing sources side by side without smoothing over where they disagree',
    description:
      'A long-context prompt that loads several full reports, reviews, or papers at once and produces a structured comparison table instead of a blended, opinion-free summary that quietly hides where the sources actually disagree.',
    promptText: `I'm giving you {{number_of_sources}} sources about {{comparison_topic}}: {{source_list}}

Read each one in full before comparing. Build a comparison, not a summary — a summary that blends four positions into one paragraph is exactly what this prompt is meant to avoid.

COMPARISON TABLE
Rows: {{comparison_criteria}}
Columns: one per source, using the source name/title as the column header.
For each cell, give the source's actual position, with a short quote or close paraphrase you could point back to if challenged — not your own averaged judgment of what the sources probably agree on.

AFTER THE TABLE
1. List every criterion where the sources actively disagree — not just differ slightly in emphasis or wording, but state a genuinely different position.
2. For each disagreement, classify it as one of: a factual dispute (they can't both be right), a difference in scope or timeframe (both may be correct for different situations), or a difference in methodology (they measured or defined something differently) — {{audience}} needs a different response to each of those three, so don't leave them lumped together as one undifferentiated "disagreement."
3. Do not resolve the disagreements for me by picking a winner unless I explicitly ask. Flag them and stop — presenting one position as the correct one defeats the purpose of asking for a comparison in the first place.
4. Name anything relevant to {{decision_context}} that none of the {{number_of_sources}} sources actually address, so I know where the evidence runs out.

SOURCE CREDIBILITY, NOTED NOT ENFORCED
Note anything relevant about each source's likely reliability — is it peer-reviewed, is it an official patient-education resource, is it an individual's personal account — as a separate line under the table, not folded into the table cells themselves. I want to weigh that myself once I can see all the positions side by side; don't let a source's perceived authority quietly influence how confidently you state its position in the comparison itself.

WHEN A SOURCE HEDGES
If a source itself states its finding with a caveat ("preliminary," "in a small sample," "further research needed"), carry that hedge into the table rather than smoothing it into an unqualified claim — a source that hedges its own conclusion is telling you something different than one that states it flatly, and collapsing that distinction in the retelling misrepresents what the source actually said.

IF TWO SOURCES AGREE BUT FOR DIFFERENT REASONS
Note it explicitly rather than treating agreement as automatically meaning the same underlying claim — two sources can land on the same recommendation while relying on different, even contradictory, reasoning, and that's worth surfacing rather than collapsing into simple agreement.`,
    variables: [
      {
        name: 'number_of_sources',
        description: 'How many sources you are providing.',
        example: '4',
        required: true,
      },
      {
        name: 'comparison_topic',
        description: 'What the sources are all addressing.',
        example: 'the health effects of intermittent fasting',
        required: true,
      },
      {
        name: 'source_list',
        description:
          'A short identifier for each source, so the columns are labeled clearly.',
        example:
          "a 2025 meta-analysis in a peer-reviewed journal, a hospital patient-education page, a popular-science book chapter, and a fitness influencer's long-form article",
        required: true,
      },
      {
        name: 'comparison_criteria',
        description: 'The specific dimensions to compare across sources.',
        example:
          'claimed metabolic effects, recommended fasting window, cited study population size, stated caveats or limitations',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who is using this comparison to decide something.',
        example: 'someone deciding whether to try it, with no medical background',
        required: true,
      },
      {
        name: 'decision_context',
        description:
          'What decision this comparison is ultimately feeding into, if relevant.',
        example:
          'whether this is safe to try alongside an existing type 2 diabetes management plan',
        required: false,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'long-context',
      'comparison-research',
      'multi-source',
      'research',
      'fact-checking',
    ],
    whyItWorks:
      "Loading every full source into the same long context window, rather than pre-summarizing each one in a separate pass, is what makes an honest comparison possible — a summary of a summary loses the specific claim, quote, or number needed to say precisely where two sources diverge, and by the time four separate summaries are stitched together, the original wording that would let you verify the disagreement is already gone. The explicit ban on picking a winner unless asked directly counters the strongest pull on a long-context synthesis task: models tend to resolve conflicting inputs into one confident, harmonized answer, which reads well but erases the disagreement the person doing the comparison actually needs to see and weigh for themselves — a comparison that quietly picks a side has stopped being a comparison. Classifying each disagreement as factual, scope-based, or methodological gives the reader an actionable next step instead of just the fact that a conflict exists — a factual dispute needs a tie-breaker source or more evidence, a scope difference might mean both sources are simply correct for different populations or timeframes, and a methodology difference means the numbers were never actually measuring the same thing in the first place, which is a completely different problem to have than a factual contradiction. Requiring a quote or close paraphrase in every cell, rather than the model's restated version of the position, keeps the whole table auditable — anyone who doubts a cell can check it against the actual source text instead of trusting the model's characterization of what that source said. Keeping source-credibility notes in a separate row rather than folded into the comparison cells themselves prevents a subtle but real distortion: once a model starts weighting how confidently it states a position by its own judgment of the source's authority, the comparison stops being a neutral record of what each source claims and becomes a pre-filtered version of it, which defeats the purpose of asking to see all positions side by side in the first place. Preserving a source's own hedging language rather than smoothing it into an unqualified claim matters because a finding stated as preliminary and a finding stated as established are different pieces of evidence even when the headline claim reads identically, and losing that distinction in translation makes two sources sound more aligned in certainty than they actually are.",
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Gemini 3 Pro comparing four sources with genuinely conflicting claims.',
      },
    ],
  },
  {
    slug: 'gemini-codebase-onboarding-doc-full-repo',
    category: 'gemini',
    title:
      'Turn an entire small-to-mid codebase into an onboarding doc a new engineer can trust',
    description:
      'A long-context prompt that reads a whole repository — every file pasted or uploaded, not a handful of representative snippets — and produces an onboarding document that names actual file paths and real architectural seams, instead of generic advice that could describe any Next.js or Python project.',
    promptText: `I'm giving you the source of {{repo_description}}. Read the whole thing before writing anything — {{file_count_or_scope}} — this only works if you're describing what's actually in these files, not what a project like this "would typically" look like.

WHO THIS IS FOR
{{new_engineer_context}}

MUST COVER
{{must_cover_topics}}

INSTRUCTIONS
1. Trace at least one real request or data flow end to end, naming the actual files involved in order — not a generic "the frontend calls the backend which calls the database" description that would apply to almost any web app.
2. Name the two or three files that are load-bearing enough that a mistake in them would break a large part of the system, and explain why, using what you actually found (heavy import fan-in, shared config, a central data model), not a guess about what's typically important in a codebase like this.
3. If you look for something specific — rate limiting, authentication, error handling — and genuinely can't find it anywhere in what I gave you, say plainly that you didn't find it, rather than describing how it "would typically be implemented" as if that were a fact about this codebase.
4. Known gotchas already understood by the team: {{known_gotchas}} — incorporate these rather than contradicting them from a fresh read that doesn't have this context.
5. Flag anything that looks like dead code or an unused file only if you can point to the actual evidence (no imports found anywhere in what was provided) — and even then, phrase it as "appears unused based on what I read," not a confident claim, since a partial upload can hide the one file that imports it.

CONFIGURATION AND ENVIRONMENT
Separately, list every place configuration actually lives — environment variables, config files, feature flags — and for each one, name the specific file where it's read, not just "config is handled via environment variables" as an unattributed generality. A new engineer's first real blocker is usually a missing or misconfigured environment variable, and a vague pointer wastes exactly the time this document is supposed to save.

DEPENDENCIES WORTH FLAGGING
Note any dependency that's doing unusually heavy lifting relative to how invisible it is in the code — a small utility import that's actually load-bearing across dozens of files, or a dependency whose version is pinned in a way that suggests a known compatibility issue. Skip a generic list of every dependency in the manifest; that's not useful and isn't what this document is for.

OUTPUT FORMAT
A short onboarding document: an architecture overview naming real files, the traced flow from step 1, the load-bearing files from step 2 with reasons, the configuration map, anything from step 3 you looked for but didn't find, and a "things to verify with a teammate before relying on this" section listing your own uncertainty, not just confident claims.`,
    variables: [
      {
        name: 'repo_description',
        description: 'What the codebase is, in plain terms.',
        example: 'a 40-file Next.js App Router site with a Postgres backend via Prisma',
        required: true,
      },
      {
        name: 'file_count_or_scope',
        description:
          'The actual scope of files being provided, so Gemini knows the boundary.',
        example: 'all files under app/, lib/, and prisma/ — roughly 6,800 lines total',
        required: true,
      },
      {
        name: 'new_engineer_context',
        description: 'Who this document is written for.',
        example:
          'a mid-level engineer who knows Next.js well but has never seen this specific codebase',
        required: true,
      },
      {
        name: 'must_cover_topics',
        description: 'The specific things this onboarding doc has to explain.',
        example:
          'how a request flows from a route handler to the database, where environment configuration actually lives, and what happens when a request is unauthenticated',
        required: true,
      },
      {
        name: 'known_gotchas',
        description:
          "Non-obvious facts the team already knows that a fresh read wouldn't.",
        example:
          "lib/legacy-adapter.ts looks dead but is still imported by one scheduled cron job — don't flag it for deletion.",
        required: false,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'long-context',
      'codebase-analysis',
      'onboarding',
      'developer-documentation',
      'architecture-review',
    ],
    whyItWorks:
      "Reading the whole repository in one context, instead of a handful of representative files chosen ahead of time, is what lets Gemini trace an actual import chain end to end and cite real file paths — a documentation pass built from a sample can only ever describe what a codebase like this typically looks like, which produces prose that reads as competent but is subtly wrong about this specific repository the moment it's checked against the actual files. The explicit instruction against inventing a typical implementation when something can't be found targets a very specific and common failure: when a model searches for a feature (say, rate limiting) and doesn't find it, the fluent default is to describe how such a thing is usually built in a stack like this one, which reads exactly like a factual claim about the codebase in front of it but is actually a guess dressed as documentation — a new engineer trusting that sentence would waste real time looking for a safeguard that was never actually implemented. Naming the load-bearing files by pointing to concrete evidence (import fan-in, a shared central data model) rather than intuition gives a checkable claim instead of an opinion — a reviewer can verify 'twelve other files import this one' far more easily than they can verify 'this feels important.' Seeding known team gotchas up front prevents the single most damaging failure mode of a fresh-eyes codebase read: flagging something the team already knows is intentional (a file that looks dead but is quietly load-bearing for one cron job) as a cleanup candidate, which is a mistake an onboarding document written by someone who does know the code would never make and a document generated without that context easily would. Requiring the configuration map to name the exact file where each setting is actually read, rather than a general statement that configuration is environment-driven, matters because the specific failure a new engineer hits in their first week is almost never architectural curiosity — it's a missing environment variable or a misread config file, and a document that describes the pattern in the abstract without pointing at the concrete file leaves that person doing the same repository-wide search the document was supposed to save them from doing themselves.",
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-23' }],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Gemini 3 Pro reading a full 40-file Next.js repository in one pass.',
      },
    ],
  },
  {
    slug: 'gemini-video-meeting-timestamped-notes',
    category: 'gemini',
    title:
      'Turn an uploaded meeting or presentation recording into timestamped notes and action items',
    description:
      "A native multimodal prompt for Gemini's video understanding that returns timestamped highlights, decisions, and action items — including what was shown on screen, not just said out loud — instead of a flat transcript of everything that happened.",
    promptText: `Watch the video I've uploaded above. This is {{video_description}}, roughly {{video_length}}.

Don't just transcribe it — extract the structure, and use both what's said and what's visually shown, since a screen share, a slide, or a whiteboard visible on camera can carry information the audio track alone never states out loud.

OUTPUT
1. A timestamped list of the {{number_of_moments}} most important moments (format: [mm:ss] — what happens/what's said), covering: {{focus_areas}}
2. Every decision made or commitment stated on camera, with the timestamp and who said it if identifiable — if speakers aren't visually distinguishable and names aren't stated, label them Speaker 1, Speaker 2, etc. consistently rather than guessing at identities.
3. Every action item mentioned, with an owner if named and any deadline mentioned. If an item is discussed but no owner is ever assigned on camera, say "no owner assigned" rather than inferring one from context.
4. Anything shown on screen — a slide, a number on a dashboard, a document — that adds information not said out loud, with its timestamp.
5. Anything said that contradicts something said earlier in the same video, with both timestamps.
6. If the audio is unclear or a section is inaudible, mark it as [unclear ~mm:ss] rather than guessing at words that sound plausible.

Skip filler, small talk, and restated points — only {{focus_areas}} matters for this pass. {{speaker_identification_context}}

TONE AND ENERGY, WHEN IT'S SIGNALING SOMETHING
If someone's tone shifts noticeably — a hesitant answer to a direct question, a laugh that reads as deflection rather than humor, a long pause before responding — note that as context next to the relevant point rather than only transcribing the words, but keep this to moments that genuinely change how a decision or commitment should be read, not a running commentary on everyone's mood throughout.

IF THE MEETING GOES OFF-TOPIC AND BACK
Note where the conversation genuinely leaves {{focus_areas}} and returns, rather than silently stitching the before-and-after together as if the detour never happened — a decision made just before a long tangent can get logically separated from the discussion that led to it if the notes paper over the gap.

REVISIT NOTE
If a point made earlier in the video gets revisited and changed later without either side explicitly acknowledging the change, flag that too, separately from a stated contradiction — a quiet drift in position across a long meeting is a different and subtler thing than someone directly contradicting an earlier statement.`,
    variables: [
      {
        name: 'video_description',
        description: 'What the video is, so Gemini knows what kind of content to expect.',
        example:
          'a 40-minute recording of our Q3 planning meeting, with a shared-screen slide deck for parts of it',
        required: true,
      },
      {
        name: 'video_length',
        description: 'Roughly how long the video runs.',
        example: '40 minutes',
        required: false,
      },
      {
        name: 'number_of_moments',
        description: 'How many key moments you want surfaced.',
        example: '10',
        required: true,
      },
      {
        name: 'focus_areas',
        description:
          'What actually matters in this video — keeps the output from ballooning into a full transcript.',
        example:
          'budget decisions, headcount discussion, and anything about the Q4 launch date',
        required: true,
      },
      {
        name: 'speaker_identification_context',
        description:
          'Any names or roles that help Gemini attribute statements correctly.',
        example:
          'Priya is the one sharing her screen for most of the meeting; Marcus joins by voice only, no camera.',
        required: false,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: ['video-analysis', 'multimodal', 'meeting-notes', 'timestamps', 'action-items'],
    whyItWorks:
      "Gemini processes uploaded video as sampled frames plus audio together, not audio routed through a separate speech-to-text pass with the picture discarded, so it can anchor output to visual timestamps and pull information straight off a shared screen or slide that the audio track never states in words — a plain transcript of the audio alone would simply miss a number visible only on a dashboard someone screen-shared without narrating it. Asking for structure instead of a transcript matters because a flat transcript of a 40-minute meeting is barely more useful than the video itself; naming focus_areas up front stops the model from treating every restated point as equally important and padding the output with small talk. The consistent Speaker N labeling instruction targets a real risk in multi-person recordings where names are mentioned inconsistently or not at all — guessing an identity from voice alone and stating it as fact can misattribute a commitment to the wrong person, which is a worse error than an honest, consistently-labeled unknown. The [unclear ~mm:ss] instruction directly targets a specific failure mode: video with noisy audio, cross-talk, or overlapping speakers gets transcribed with confident-sounding words that were never actually said, and marking those spans instead of guessing keeps the notes trustworthy enough to act on rather than requiring a full re-watch to verify. Asking for tone and energy shifts to be noted alongside the relevant point, rather than transcribed as neutral words, matters because the same sentence — 'sure, that works' — reads completely differently said flatly versus said after a long pause and a half-laugh, and a flat transcript necessarily discards that signal even though a human in the room would have registered it instantly and factored it into how seriously to take the agreement. The revisit-tracking instruction targets a specific and easy-to-miss pattern in long meetings: a position stated at minute 8 quietly shifts by minute 34 without anyone on the call explicitly flagging the change, and unless notes are built to actively watch for that drift, the summary ends up reporting only the earlier or only the later position as if it were the meeting's single stance throughout, silently erasing the fact that anything moved at all.",
    exampleOutput:
      '[04:12] — Priya shares her screen showing a revised Q4 launch timeline slide moving the date from Nov 3 to Nov 17; no verbal objection recorded.\n[11:40] — Decision: engineering headcount request tabled until next planning cycle (stated by Marcus, voice only).\n[unclear ~22:15] — cross-talk, cannot confirm who raised the budget concern.\nVisual-only info: the slide at [04:12] also shows a budget line item ($42K) never mentioned aloud in the recording.\nAction items: Priya to send revised launch timeline by Friday — no owner assigned for the follow-up budget review mentioned at [26:03].',
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-24' }],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Gemini 3 Pro on a 40-minute screen-shared planning meeting recording.',
      },
    ],
  },
  {
    slug: 'gemini-lecture-audio-structured-notes',
    category: 'gemini',
    title:
      'Turn a long lecture or podcast recording into structured, checkable study notes',
    description:
      'An audio-only multimodal prompt that turns a raw lecture, podcast, or interview recording into notes organized by concept and speaker, with timestamps and confidence flags on anything the audio makes genuinely hard to make out, instead of a single wall-of-text transcript.',
    promptText: `Listen to the audio I've uploaded above. This is {{audio_description}}, roughly {{recording_length}}.

WHO'S SPEAKING
{{number_of_speakers}} — if a speaker's identity isn't stated explicitly, use a consistent label like Speaker 1 rather than guessing a name from tone or accent.

STRUCTURE
{{topic_structure}}

INSTRUCTIONS
1. Organize notes by concept, in the order the recording actually covers them — don't impose a generic outline template that doesn't match how this specific recording is structured.
2. Note vocal emphasis where it's a real signal, not decoration: if the speaker raises their voice, repeats a point, or says something like "this matters" or "remember this," flag that line in the notes as emphasized — that's exactly the kind of moment a flat transcript throws away.
3. Attribute every claim and every question to the correct speaker. In a lecture with audience questions, do not let a tentative student question get folded into the notes as if it were an authoritative statement from the lecturer — keep questions and answers clearly separated and attributed.
4. Include a timestamp on every major note so I can jump back to the original audio to verify anything that matters.
5. Where the audio is mumbled, overlapping, or a term is unfamiliar enough that you're genuinely guessing at the word, mark it [unclear ~mm:ss] rather than transcribing a confident-sounding guess. A wrong term stated with total confidence is worse for someone studying from these notes than an honest gap.
6. {{minimum_note_detail}}
7. Where the recording references something visual that isn't itself in the audio — "as shown on this slide," "look at the diagram I'm pointing to" — note that a visual reference was made at that timestamp, so I know a slide deck or handout exists that these notes alone can't fully capture, rather than silently dropping the reference because there's no way to describe an image you can't see.
8. If the same concept is explained twice using two different explanations or analogies (common when a lecturer notices confusion and re-explains), keep both versions in the notes rather than merging them into one — the second explanation is often there specifically because the first one didn't land for part of the audience, and losing that alternate framing removes exactly the version that might work better for someone reviewing the notes later.

OUTPUT FORMAT
Notes grouped by concept/topic with timestamps, a separate short list of anything flagged as emphasized by the speaker, a list of every timestamp where a visual reference was made without accompanying audio description, and a final section naming every [unclear] span so I know exactly what to go back and re-listen to myself.`,
    variables: [
      {
        name: 'audio_description',
        description:
          'What the recording is, so Gemini knows what kind of content to expect.',
        example: 'a 55-minute university lecture on macroeconomic inflation targeting',
        required: true,
      },
      {
        name: 'recording_length',
        description: 'Roughly how long the recording runs.',
        example: '55 minutes',
        required: false,
      },
      {
        name: 'number_of_speakers',
        description: 'Who is speaking, and in what roles.',
        example: 'one primary lecturer, plus occasional student questions from the floor',
        required: true,
      },
      {
        name: 'topic_structure',
        description: 'How the notes should be organized.',
        example:
          'organize by the concepts the lecturer actually covers, in the order covered, not a generic textbook-chapter outline',
        required: true,
      },
      {
        name: 'minimum_note_detail',
        description: 'How thorough the notes need to be, to calibrate depth.',
        example:
          'enough detail that someone who missed the lecture could answer a quiz on it afterward',
        required: false,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'audio-analysis',
      'multimodal',
      'lecture-notes',
      'transcription',
      'study-notes',
      'speaker-diarization',
    ],
    whyItWorks:
      "Gemini processes audio natively as a single input rather than running a separate speech-to-text pass and handing the LLM a flattened transcript, which is what lets it carry tone and emphasis cues — a raised voice, a repeated phrase, a paused \"this will be on the exam\" — into the notes as signals of importance instead of losing that information the moment audio becomes plain text. Requiring consistent speaker attribution, rather than a best-guess name inferred from voice, matters specifically for lecture recordings with audience Q&A: misattributing a hesitant student's half-formed question to the lecturer as if it were an authoritative claim quietly corrupts study notes in a way that's hard to catch later, since the notes read equally confidently either way. Organizing by the concepts actually covered, in the order the recording covers them, rather than a generic template, preserves the lecturer's own logical scaffold — which is very often the actual structure being tested, and a reorganized outline can accidentally erase the reasoning chain that connected one concept to the next. The [unclear] flagging rule targets a real and common failure specific to lecture and podcast audio: a mumbled technical term, an unfamiliar name, or a moment of cross-talk gets transcribed as the closest plausible-sounding word rather than flagged as uncertain, and a student who doesn't know the material yet has no way to tell a hallucinated term from a real one unless the model is explicit about where its own confidence actually drops. Flagging visual references the audio alone can't resolve — \"as shown on this slide\" — matters because an audio-only prompt has no access to what was actually on screen, and silently absorbing that reference into the notes as if nothing was missing would let a student believe the notes are complete when a meaningful piece of the explanation was never available to capture in the first place; naming the gap is what tells them a slide deck or handout still needs to be found and reviewed separately. Preserving a second explanation of the same concept, rather than merging it into the first, respects a specific pedagogical signal: a lecturer typically only re-explains something because the first framing visibly didn't land, and collapsing both into one merged version optimizes for compactness at the exact point where redundancy was actually doing useful work for the audience the explanation didn't reach the first time.",
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-25' }],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Gemini 3 Pro on a 55-minute recorded university lecture with audience Q&A.',
      },
    ],
  },
  {
    slug: 'gemini-whiteboard-photo-action-plan',
    category: 'gemini',
    title: 'Turn a photo of a whiteboard brainstorm into an organized action plan',
    description:
      'A multimodal prompt that reads the handwriting, arrows, and groupings in a photographed whiteboard and turns the visual structure itself — not just the words — into an organized, de-duplicated action plan.',
    promptText: `Look at the photo I've attached of {{whiteboard_description}}.

Read the actual spatial layout, not just the words — arrows, circles, groupings, and crossed-out items all carry meaning here. Don't flatten a structured board into a random flat list; that throws away exactly the information that made it worth photographing instead of just listing the ideas from memory.

INSTRUCTIONS
1. Transcribe everything legible first, noting anything you genuinely can't read as [illegible] rather than guessing a plausible-sounding word to fill the gap.
2. Reconstruct the groupings the way they're actually drawn on the board — circled clusters, boxes, arrows connecting one idea to another. Tell me what connects to what, and don't invent a connection that isn't actually drawn just because two ideas seem related.
3. Treat anything crossed out or struck through as rejected, not as a live idea — list it separately under "Discarded," and don't quietly drop it from the notes entirely, since knowing what was considered and rejected is often as useful as knowing what survived.
4. Merge near-duplicate ideas written in different handwriting or in different spots on the board into one item, but tell me explicitly when you merged something and what the original separate items were, so I can un-merge it if you merged wrong.
5. Turn the surviving ideas into an action plan grouped by: {{grouping_scheme}}. Each action gets an owner placeholder and a rough priority ({{priority_scale}}).

Context that isn't visible on the board but matters here: {{additional_context}}

If the photo is angled, glare-affected, or cuts off part of the board, say which part is affected before presenting the plan, so I know whether to take another photo.

HANDWRITING FROM MULTIPLE PEOPLE
If different handwriting styles are visible, note when an idea appears to have been added later or by a different person than the surrounding cluster — a note squeezed into a margin in different handwriting is often a late addition or a dissenting comment, and treating it as part of the original cluster it was squeezed next to loses that distinction.

NUMBERS AND ESTIMATES ON THE BOARD
If any numbers, dates, or estimates are written on the board (a rough timeline, a headcount, a budget figure), carry them into the plan exactly as written rather than rounding or reinterpreting them — a number scrawled on a whiteboard during a brainstorm is often a deliberately rough placeholder, and representing it with more precision or confidence than it actually had misrepresents what was decided in the room.

ARROWS THAT POINT BUT DON'T CLEARLY CONNECT
If an arrow's start or end point is ambiguous — it could plausibly connect to either of two nearby items — say so rather than picking the more sensible-looking interpretation and presenting it as certain; a wrong guess about which two ideas are actually linked can misrepresent the group's actual reasoning.`,
    variables: [
      {
        name: 'whiteboard_description',
        description: 'What the whiteboard session was about, to set expectations.',
        example:
          'a 45-minute product roadmap brainstorm with the design and engineering leads',
        required: true,
      },
      {
        name: 'grouping_scheme',
        description: 'How you want the surviving ideas grouped in the final plan.',
        example: 'this quarter vs. next quarter vs. someday',
        required: true,
      },
      {
        name: 'priority_scale',
        description: 'The priority labels to apply.',
        example: 'high / medium / low',
        required: true,
      },
      {
        name: 'additional_context',
        description: 'Anything relevant that would not be visible from the photo alone.',
        example:
          'we already committed to shipping the mobile redesign this quarter, so anything competing with that engineering time should be flagged',
        required: false,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: ['multimodal', 'image-input', 'brainstorming', 'meeting-notes', 'whiteboard'],
    whyItWorks:
      "Gemini's multimodal image encoder reads spatial relationships directly from the pixels — what's circled, what an arrow connects, what's boxed together — rather than running OCR and discarding the layout, which is why the prompt explicitly demands groupings be reconstructed 'the way they're drawn' instead of flattened into a list; a plain OCR-then-summarize approach loses exactly this structure, since OCR by design only extracts text, not the drawn relationships between text blocks. The [illegible] instruction targets a specific and common failure with handwriting photos: a blurry or ambiguous word gets confidently transcribed as the closest plausible-sounding word rather than flagged, which quietly corrupts an action item into something nobody in the room actually wrote or said. Requiring crossed-out items to be filed as 'Discarded' rather than dropped or treated as live prevents rejected ideas from silently resurfacing in the final plan — a real risk since a merged or reorganized list has no visual strikethrough left to signal an idea was rejected the way the original board did. The explicit merge-disclosure rule matters because de-duplication is a judgment call, not a fact, and a model that silently merges two genuinely distinct ideas because they use similar words removes the one signal (the original separate wording) a human would need to catch and correct that mistake. Flagging handwriting that appears to be a later addition or a different contributor's note leans on the same spatial/visual reading the grouping instruction does — a margin note squeezed in afterward is visually distinguishable from the original cluster by spacing and often by pen pressure or size, and a model that flattens everything on the board into one undifferentiated pass loses the chance to notice that a late addition might represent a dissent or afterthought rather than a idea the room settled on together in the moment. Preserving numbers and estimates exactly as written, rather than reinterpreting them with more apparent precision, matters because a number scrawled during a live brainstorm is frequently a deliberately rough placeholder the group intends to revisit — presenting 'roughly 15 people?' as a firm headcount of 15 in a downstream action plan quietly launders a guess into a commitment nobody in the room actually made.",
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-27' }],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Gemini 3 Pro on a photographed product-roadmap whiteboard session.',
      },
    ],
  },
  {
    slug: 'gemini-screenshot-to-frontend-code',
    category: 'gemini',
    title: 'Turn a UI screenshot into working frontend code',
    description:
      "A multimodal prompt that treats a screenshot as a literal spec — spacing, hierarchy, text, and visible states — and returns matching component code instead of a loose visual approximation shaped by the model's own design defaults.",
    promptText: `Here's a screenshot of {{ui_description}}. Build this as {{framework}} code.

Match, don't reinterpret:
1. Layout structure — what's in a row vs. stacked, alignment, relative spacing — as closely as the screenshot actually shows it, not the layout you'd typically expect for a component like this.
2. Every visible text label, exactly as written, including button text, placeholder text, and any small print — don't paraphrase a label into something that sounds cleaner.
3. Visible states — if a button looks disabled or active, a field looks focused, or there's a badge or count shown, include that state in the code. Don't drop it for being "just a detail"; a visible state in a screenshot is a spec for that state, not decoration.
4. Colors and type choices close to what's shown; use {{design_system_reference}} tokens or variables if the screenshot maps onto one, otherwise use plain values and say explicitly that you did.

CONSTRAINTS
{{tech_constraints}}

Where the screenshot is ambiguous — a cut-off edge, an icon you're not fully sure of, a hover or focus state you can't see because it isn't visible in a static image — say plainly what's ambiguous and what assumption you made, instead of silently inventing a specific value and presenting it as if it came from the screenshot.

RESPONSIVE BEHAVIOR
A single screenshot only shows one viewport width. Build the component to behave reasonably at other sizes using ordinary responsive patterns, but say explicitly that you're extrapolating beyond what the screenshot actually shows for anything narrower or wider than the captured width — don't present a guessed mobile layout as if it were derived from evidence in the image.

ACCESSIBILITY BASICS
Even though a screenshot can't show what's in the accessibility tree, apply ordinary baseline practice regardless: real button/link elements instead of divs with click handlers, an alt attribute placeholder on any image, and a visible focus state even where the screenshot doesn't show one being triggered. Note this is a baseline addition, not something read directly off the image.

IF THE SCREENSHOT SHOWS AN INTERACTION MID-FLOW
If the screenshot appears to capture a transient state — a dropdown open, a toast notification visible, a modal mid-animation — build both the resting state and the captured state as two distinct states of the same component, rather than building only what's shown and leaving the resting state unaddressed.

NAMING AND FILE STRUCTURE
Name the component after what it is, not after the file it came from or a generic placeholder like Component1. If the screenshot clearly shows a piece of a larger page rather than a self-contained widget, say so, and note what surrounding layout context this piece would need once it's placed back into a real page rather than pretending it's fully self-sufficient in isolation.

OUTPUT
{{output_format}}`,
    variables: [
      {
        name: 'ui_description',
        description: 'What the screenshot shows, for context.',
        example: 'a pricing card component from a SaaS landing page',
        required: true,
      },
      {
        name: 'framework',
        description: 'The target framework/stack for the code.',
        example: 'React with Tailwind CSS',
        required: true,
      },
      {
        name: 'design_system_reference',
        description:
          'A design system or token set to map colors/spacing onto, if one exists.',
        example: 'our existing shadcn/ui theme tokens',
        required: false,
      },
      {
        name: 'tech_constraints',
        description: 'Any hard technical constraints on the output.',
        example:
          'no external icon libraries, use inline SVG only; must be a single component file',
        required: false,
      },
      {
        name: 'output_format',
        description: 'What you want returned.',
        example:
          'a single component file plus a one-line list of anything you were unsure about',
        required: true,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'screenshot-to-code',
      'multimodal',
      'frontend',
      'ui-development',
      'image-input',
    ],
    whyItWorks:
      "Gemini's multimodal vision path reads the screenshot's actual pixel layout — spacing, alignment, proportional sizing — directly, rather than working from a text description of the design, which is what makes 'match, don't reinterpret' an enforceable instruction rather than wishful thinking; without it, the model tends to substitute its own aesthetic defaults for the ones actually shown, since a different spacing scale or a more common component pattern is simply more heavily represented in what it's seen during training than this one specific screenshot is. Explicitly requiring visible states — disabled, focused, badge counts — to be included counters the tendency to treat a screenshot as a static mockup of only the happy path and quietly drop states that would otherwise need separate design documentation to specify; a visible disabled button in the screenshot is direct evidence of a real state in the actual product, not an artifact of the capture. The ambiguity-flagging instruction targets cropped or unclear regions specifically — a cut-off icon or an edge that's out of frame gets filled with a plausible guess by default, and naming that guess as a guess is the difference between code you can trust and code you have to re-verify against the original design anyway before shipping it. Explicitly separating what the screenshot proves from what's a reasonable responsive extrapolation matters because a single image is direct evidence for exactly one viewport width — a model that builds a mobile layout without saying so invites the reader to assume that layout came from the same visual authority as the desktop version it was actually captured from, when it's really an assumption dressed identically to a verified fact. Requiring baseline accessibility practices regardless of what the screenshot shows corrects for the fact that a static image structurally cannot show semantic markup, focus order, or ARIA attributes at all — treating the image as the complete spec would silently drop these, not because they weren't needed, but because there was never a channel for a screenshot to communicate them in the first place, so they have to be supplied from ordinary practice rather than from the image.",
    exampleOutput:
      'export function PricingCard() {\n  return (\n    <div className="rounded-xl border p-6 shadow-sm">\n      <h3 className="text-lg font-semibold">Pro</h3>\n      <p className="text-3xl font-bold mt-2">$29<span className="text-sm font-normal">/mo</span></p>\n      <button className="mt-4 w-full rounded-md bg-black text-white py-2" disabled>\n        Current plan\n      </button>\n    </div>\n  )\n}\n\nUnsure about: the small icon next to "Pro" was partially cut off at the top edge of the screenshot — used a generic badge placeholder instead of guessing which specific icon it was.',
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-28' }],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Gemini 3 Pro on a cropped pricing-card screenshot.',
      },
    ],
  },
  {
    slug: 'gemini-receipt-batch-expense-extraction',
    category: 'gemini',
    title:
      'Turn a batch of receipt and invoice photos into one clean expense spreadsheet',
    description:
      'A multimodal batch-extraction prompt that reads a stack of photographed receipts and invoices in one pass and returns one consistent, spreadsheet-ready table with a fixed column schema, instead of a differently-formatted summary per image that still needs manual cleanup before it can be used.',
    promptText: `I've attached {{number_of_receipts}} photos of receipts and invoices. Read all of them in this one pass and return one consistent table — not a separate summary per photo with its own formatting.

CATEGORIES
Assign each line item to the closest match from this fixed list: {{expense_categories}}. Never invent a new category, even if a receipt doesn't fit neatly — pick the closest one and note the mismatch in a comments field instead.

CURRENCY
{{currency_context}}

REQUIRED COLUMNS
{{required_columns}}

INSTRUCTIONS
1. One row per receipt (or one row per line item if a single receipt/invoice covers clearly separate expense categories — say which approach you used and be consistent about it across the whole batch).
2. If a photo is blurry, cropped, or a specific field (date, total, vendor name) isn't legible, leave that cell blank and add a note rather than guessing a plausible-looking value — a guessed total that's wrong is worse than an honest blank someone can fill in by checking the physical receipt.
3. If a receipt appears to be a duplicate of another one in the batch (same vendor, same amount, same date), flag it as a possible duplicate rather than silently including it twice or silently dropping one.
4. {{reimbursement_policy_notes}}
5. If a single photo actually shows two separate receipts (someone photographed a stack, or two receipts side by side), split them into two rows rather than merging their totals into one, and note that a split happened so it can be double-checked against the physical receipts.
6. If a vendor name is abbreviated, uses a franchise-location suffix, or is printed differently across receipts from what is clearly the same underlying business (e.g., a store number appended to the name), normalize it to one consistent name across the batch so a later pivot by vendor doesn't fragment into near-duplicate rows for what is really one vendor.
7. Note the language the receipt is printed in if it's not the expected one, since a receipt from a business trip abroad may need different tax handling than a routine domestic one.
8. If a receipt shows a tip or service charge as a separate line from the base amount, keep them as separate values rather than folding the tip into the base total, since some reimbursement policies cap tips independently of the meal amount itself.

OUTPUT FORMAT
A single table with the required columns above, ready to paste into a spreadsheet, followed by a short list of anything flagged: illegible fields, currency mismatches, split receipts, vendor-name normalizations made, and possible duplicates.`,
    variables: [
      {
        name: 'number_of_receipts',
        description: 'How many receipt/invoice photos you are providing.',
        example: '23',
        required: true,
      },
      {
        name: 'expense_categories',
        description: 'The closed list of categories to classify each line item under.',
        example: 'Travel, Meals, Software, Office supplies, Other',
        required: true,
      },
      {
        name: 'currency_context',
        description: 'What currency to expect and how to handle mismatches.',
        example:
          'All receipts should be in INR; flag any that appear to be in a different currency rather than converting them yourself.',
        required: true,
      },
      {
        name: 'required_columns',
        description: 'The exact columns the output table needs.',
        example:
          'date, vendor, category, amount, tax amount if shown, payment method if shown',
        required: true,
      },
      {
        name: 'reimbursement_policy_notes',
        description: 'Any policy rule that should be flagged, not silently enforced.',
        example:
          "Meals over ₹1,500 per receipt need a manager note per company policy — flag these, don't reject or adjust them yourself.",
        required: false,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'multimodal',
      'image-input',
      'expense-tracking',
      'batch-processing',
      'data-extraction',
      'ocr',
    ],
    whyItWorks:
      "Processing all receipt images in a single pass against one fixed column schema is what makes the output mergeable into one spreadsheet — extracting each photo in a separate chat turn produces inconsistent field names and date formats you'd have to reconcile by hand afterward anyway, which defeats the entire point of automating the extraction. A fixed, closed expense_categories list stops the model from inventing near-duplicate categories — 'Software' versus 'Subscriptions' versus 'SaaS Tools' across different receipts — which is the single most common reason an AI-extracted expense sheet still needs manual cleanup before anyone can build a pivot table from it; forcing every item into one of a small set of known buckets, with a comment for genuine mismatches, keeps the category column actually usable for aggregation. The currency-flagging instruction matters because a receipt photographed at an odd angle or on a low-quality thermal print can have its currency symbol misread entirely, and a wrong currency silently assumed corrupts a total that still looks perfectly plausible in the output — flagging it for a human to check is far safer than the model quietly converting a number it may have misread in the first place. Explicitly asking for reimbursement-policy flags rather than automatic enforcement keeps a genuine judgment call visible to the human approver — the model has no authority to decide a meal expense is or isn't within policy, and pretending otherwise by silently rejecting or adjusting a line item would hide a decision that should actually be made by a person. Normalizing vendor names across the batch matters specifically for the aggregation step that comes after extraction: a spreadsheet with 'Starbucks,' 'STARBUCKS #4471,' and 'Starbucks Coffee Co' as three distinct vendor strings will fragment what should be one line in a per-vendor summary into three, and that kind of fragmentation is invisible until someone tries to actually total spend by vendor and gets a wrong, artificially spread-out answer. Splitting a single photographed image that actually contains two separate physical receipts into two rows, rather than merging their totals, prevents a specific and hard-to-catch error: a merged total that happens to look like a plausible single-receipt amount will pass a casual review even though it's the sum of two unrelated purchases, and nothing about the output would signal that a split should have happened unless the model is told to actively look for it.",
    exampleOutput:
      'date | vendor | category | amount | tax | payment_method | notes\n2026-07-14 | Cafe Delight | Meals | 1,850 | 92 | Corporate card | flagged: over ₹1,500, needs manager note per policy\n2026-07-15 | [illegible] | Travel | [illegible] | — | — | photo too blurry to read total; original receipt needed\n2026-07-16 | Notion Labs Inc | Software | 1,200 | 60 | Corporate card | —\nPossible duplicate: rows 9 and 14 — same vendor (Uber), same amount (₹340), dates one day apart; verify before including both.',
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-29' }],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Gemini 3 Pro on a batch of 23 photographed receipts.',
      },
    ],
  },
  {
    slug: 'gemini-financial-pdf-chart-data-extraction',
    category: 'gemini',
    title:
      "Pull the actual numbers out of a financial report's charts, not just its text",
    description:
      'A multimodal PDF prompt that reads the visual charts and tables embedded in an annual report or financial statement — not just the surrounding narrative text — and returns the underlying data points, since a plain text extraction of the PDF misses anything rendered only as an image or vector chart.',
    promptText: `I've uploaded a PDF: {{report_description}}. Read the specific pages I'm pointing you to as images, not just as extracted text — the numbers I need are shown as charts, and a text-only extraction of this PDF would have nothing to extract from those pages.

PAGES/CHARTS OF INTEREST
{{charts_or_pages_of_interest}}

WHAT TO EXTRACT
{{metrics_needed}}

PRECISION RULES
{{precision_expectations}}

INSTRUCTIONS
1. For any value that has a printed data label directly on the chart (a number shown next to a bar or point), extract it exactly as printed and mark it as exact.
2. For any value you're reading off the chart's visual position with no printed label — estimating a bar's height against the axis — extract your best estimate and mark it explicitly as an estimate, with a stated range of uncertainty (for example, "approximately 18-19%, read off axis position").
3. State the chart type and axis scale you're reading (linear vs. log, whether the y-axis starts at zero or is truncated) before giving the numbers, since a truncated or non-zero axis changes how a value should be interpreted even once correctly read.
4. {{comparison_context}}
5. This extraction is meant to support further analysis, not to substitute for the company's actual filed financial statements or investor disclosures — say so plainly, and if a number here would materially affect a real decision, note that it should be verified against the primary filing.

LEGEND AND COLOR-CODING
If the chart uses a legend to distinguish multiple series (different segments, different years), confirm which color or pattern corresponds to which legend entry before reading values off the chart, and say if the legend itself is hard to match against the plotted lines or bars with confidence — a misread legend produces a value that looks precisely extracted but is actually attributed to the wrong series entirely.

STACKED VS. GROUPED CHARTS
If the chart is a stacked bar or area chart, note that each segment's value has to be read as the difference between its boundaries, not from the axis directly, and say explicitly if a segment's boundary is hard to pin down precisely — a small error in reading a stacked boundary compounds differently than the same error would in a simple bar chart.

OUTPUT FORMAT
A table: metric | year/period | value | exact or estimate | source page/chart. Follow it with a short note on axis scale or any chart formatting choice that affects how these numbers should be read, and a separate note on anything from the legend or stacking structure that added uncertainty to a specific value.`,
    variables: [
      {
        name: 'report_description',
        description: 'What the PDF is.',
        example: 'a 44-page annual report for a mid-cap manufacturing company',
        required: true,
      },
      {
        name: 'charts_or_pages_of_interest',
        description: 'Which specific pages or charts to focus on.',
        example:
          'the revenue-by-segment bar chart on page 12 and the five-year gross-margin trend line chart on page 18',
        required: true,
      },
      {
        name: 'metrics_needed',
        description: 'The exact metrics you need pulled out.',
        example:
          'revenue figures per segment per year, and gross margin percentage per year',
        required: true,
      },
      {
        name: 'precision_expectations',
        description: 'How you want precision and uncertainty handled.',
        example:
          'label anything read off a chart without a printed data label as an estimate, with a stated margin of uncertainty',
        required: true,
      },
      {
        name: 'comparison_context',
        description:
          'Whether to cross-check the chart numbers against the surrounding text.',
        example:
          'Flag anything that looks inconsistent with the headline figures stated in the narrative text elsewhere in the report.',
        required: false,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'multimodal',
      'pdf-analysis',
      'financial-analysis',
      'chart-reading',
      'data-extraction',
    ],
    whyItWorks:
      "Gemini reads the PDF's rendered pages as images alongside its text layer, so it can interpret a bar chart's relative heights or a line chart's plotted points even when the underlying numbers were never printed as text anywhere in the document — a text-only PDF extraction tool has literally nothing to extract from a chart image and would either report the page as empty of numeric content or silently skip it, which is a much worse failure than an honest estimate because it's easy to not notice the gap at all. Requiring an explicit estimate label with a stated uncertainty margin exists because reading a value off a chart's visual position is inherently approximate — the difference between a bar that looks like it hits 18% versus 19% on an unlabeled axis is a judgment call, and presenting that judgment with the same confidence as a printed figure would mislead anyone building an actual financial model on top of it. Requiring the axis scale and truncation to be stated before the numbers targets a specific and genuinely deceptive charting practice: a y-axis that starts at 80 instead of 0 makes a small difference look dramatic, and a value correctly read off that chart is still misleading if the axis distortion itself isn't flagged alongside it. The instruction to cross-check against the surrounding narrative text catches the case where a chart is genuinely mislabeled or uses an easily-misread scale — the accompanying prose often states the actual headline figure in words, which becomes a tie-breaker a chart-only reading has no way to access on its own. Confirming the legend against the plotted series before extracting any value addresses a specific and easy way to be confidently wrong: a color-coded chart with a legend that's positioned awkwardly or uses similar shades for two segments can be misread in a way that's internally consistent — every value looks reasonable — but is attributed to the wrong segment across the whole chart, which is a harder error to catch after the fact than an isolated bad reading of one point. The stacked-versus-grouped distinction matters because the two chart types require genuinely different arithmetic to extract a value at all — a grouped bar's height is its value directly off the axis, while a stacked segment's value is the gap between its own boundary and the one below it, and applying the wrong reading method to the wrong chart type produces numbers that are wrong by a consistent, chart-wide amount rather than randomly, which can make the error harder to notice on a spot check of just one or two values.",
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-30' }],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Gemini 3 Pro extracting chart data from a 44-page annual report PDF.',
      },
    ],
  },
  {
    slug: 'gemini-academic-paper-figure-critique',
    category: 'gemini',
    title:
      "Critique a research paper's methodology using its actual figures, not just its abstract",
    description:
      "A multimodal PDF prompt that reads a paper's figures, plots, and tables directly — sample sizes shown in a caption, error bars, axis scales — as evidence for a methodology critique, instead of a summary built only from the abstract and discussion text.",
    promptText: `I've uploaded a PDF of a research paper: {{paper_description}}. Read the figures and tables as images, not just the surrounding text — the critique below depends on what the figures actually show, which the abstract's prose claims may or may not accurately represent.

READER
{{reader_expertise}}

CRITIQUE FOCUS
{{critique_focus}}

INSTRUCTIONS
1. For each figure relevant to the critique focus, describe what it actually shows — axis labels, scale, error bars or confidence intervals if present, sample size if stated in the caption — before drawing any conclusion from it.
2. Check whether the abstract's or discussion section's claimed effect is visually consistent with what the figure actually plots. If the prose claims a "significant" or "substantial" effect, look at whether the plotted error bars or confidence intervals actually support that framing, and say plainly if they don't.
3. {{known_red_flags_to_check}}
4. Note the sample size for each key result, and whether it's large enough to support the strength of the claim being made — don't just report the number, say whether it changes how much weight the result should carry.
5. Distinguish between a methodological weakness (a real problem with how the study was designed or reported) and a stylistic choice (a chart style you'd personally do differently) — only the former belongs in a critique aimed at deciding whether to rely on this paper.

CONTROL GROUPS AND COMPARISONS
If a figure shows an experimental group against a control or comparison group, check whether the two groups are shown on the same scale and axis, and whether the figure makes it easy or hard to actually compare them visually — a comparison presented across two separate panels with different y-axis ranges can obscure a difference that would be obvious if both groups were plotted on one shared scale, and that's a methodology-adjacent presentation choice worth naming even if the underlying data is sound.

WHAT THE TABLES SHOW THAT THE FIGURES DON'T
Read any tables in the paper as carefully as the figures — a table often contains the exact numeric values (means, standard deviations, p-values) that a figure only represents visually, and a precise number in a table can confirm or contradict an impression formed from a figure's visual scale alone.

OUTPUT FORMAT
{{output_depth}}. Structure it as: a one-paragraph summary of what the paper claims, then a per-figure section noting what it actually shows and whether that supports the claim, then a section on what the tables add or contradict, then a final verdict on whether the methodology issues found are minor, moderate, or serious enough to affect whether this paper should be relied on for the stated purpose.`,
    variables: [
      {
        name: 'paper_description',
        description: 'What the paper is about and its rough length.',
        example:
          "a 14-page peer-reviewed paper on a new drug's effect on blood pressure, including 4 figures and 2 tables",
        required: true,
      },
      {
        name: 'reader_expertise',
        description: 'Who this critique is written for, to calibrate explanation depth.',
        example:
          'a graduate student who understands basic statistics but is not a specialist in this subfield',
        required: true,
      },
      {
        name: 'critique_focus',
        description: 'What specifically the critique should evaluate.',
        example:
          "sample size adequacy, whether the reported effect size is visually consistent with the error bars shown, and whether the abstract's conclusion matches what the figures actually show",
        required: true,
      },
      {
        name: 'known_red_flags_to_check',
        description: 'Specific things to look for, if you already suspect something.',
        example:
          "check whether any figure's y-axis is truncated in a way that visually exaggerates a small difference",
        required: false,
      },
      {
        name: 'output_depth',
        description: 'How this critique will actually be used.',
        example:
          'a structured critique aimed at deciding whether this paper is strong enough to cite in a literature review, not a full rewrite of the paper',
        required: true,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'multimodal',
      'pdf-analysis',
      'research',
      'academic-review',
      'figure-analysis',
      'fact-checking',
    ],
    whyItWorks:
      "Reading figures as images lets Gemini check whether the abstract's claimed effect is visually supported by the plotted error bars and confidence intervals, which a text-only reading of the abstract and discussion section cannot verify at all — the abstract's prose claim and the figure's actual plotted data can, and in a non-trivial number of published papers do, tell slightly different stories, and that gap is only visible if the figure itself is actually read rather than taken on faith from the surrounding text. The truncated-axis check targets a well-documented and specific way figures visually overstate a real but small effect: a y-axis that starts at 90 instead of 0 makes a 2-point difference look like a dramatic gap on the page, and this is checkable only by looking at the actual axis on the actual chart, not by reading what the caption or discussion section says the figure shows. Requiring the sample size to be weighed, not just reported, matters because a number alone ('n=24') means very little to a reader without domain expertise unless it's explicitly connected to how much confidence that sample size can actually support for the specific claim being made — the same n might be entirely adequate for one kind of effect and clearly underpowered for another. Separating methodological weaknesses from stylistic disagreements keeps the critique focused on what actually determines whether the paper should be trusted for a given purpose, rather than drifting into an aesthetic review of chart choices that have no bearing on whether the underlying finding holds up. Checking whether an experimental and control group are plotted on the same scale targets a specific and genuinely common presentation choice that can obscure a real methodological weakness: two panels with different y-axis ranges make groups look more similar or more different than a shared-scale comparison would, and this is a fact about the figure's construction that's only visible by actually looking at both axes side by side, not something a text-only read of the results section would surface. Cross-referencing the tables against the figures matters because the two convey different kinds of precision — a figure gives a fast visual impression of scale and spread, while a table often carries the exact numbers (a specific p-value, a precise standard deviation) that either confirm or quietly undercut the confidence a figure's visual presentation seems to project, and a critique that reads only the figures misses whichever of those two sources happens to tell the less flattering part of the story.",
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-31' }],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Gemini 3 Pro on a 14-page clinical study PDF with four figures.',
      },
    ],
  },
  {
    slug: 'gemini-photo-menu-translation-localization',
    category: 'gemini',
    title:
      'Translate and culturally localize the text inside a photo, not just the words',
    description:
      'A multimodal prompt for translating a photographed menu, sign, or label that asks for cultural and practical localization alongside the literal translation, instead of a flat word-for-word swap that produces something technically accurate but meaningless to the reader.',
    promptText: `Here's a photo of {{photo_description}}, originally in {{source_language}}. Translate it into {{target_language}} for {{reader_context}}.

For each item or line in the photo:
1. Give the literal translation first.
2. Then give a localized version if the literal translation would be confusing, misleading, or just odd to a {{target_language}} reader — explain in one line why you changed it (an idiom, a measurement unit, a culturally specific dish or reference the literal words don't convey).
3. Flag anything you can't read clearly in the photo as [unclear] rather than guessing at text that isn't actually legible — a confidently invented word based on a blurry photo is worse than an honest gap.
4. Convert any units, currency, or sizes to what's standard for {{reader_context}}, noting the original figure alongside the conversion so nothing is silently lost.

If something in the source has no real equivalent in {{target_language}} or for {{reader_context}} — a specific dish, an idiom, a cultural reference — say so explicitly instead of forcing an approximate translation that changes the actual meaning while looking fluent.

ALLERGENS AND DIETARY FLAGS
If the source text or common knowledge about the named dish suggests a common allergen or dietary consideration (shellfish, dairy, a specific nut, a meat that may not be expected in a dish's usual name), flag it explicitly even if the source text itself doesn't call it out — a menu written for local readers routinely omits information a first-time visitor would need, and staying silent because "the menu didn't say it" would miss the actual point of translating this for someone unfamiliar with the cuisine. Be clear this is a flag to ask about, not a guarantee, since ingredients can vary by kitchen.

REGIONAL VARIANTS
If a dish name is used differently across regions of {{source_language}}'s associated country or culture (the same name referring to a noticeably different dish elsewhere), note that ambiguity rather than picking one regional meaning silently — say which interpretation you went with and why, based on context in the photo if there is any.

SPICE LEVEL AND PREPARATION NOTES
If the photo or the item name implies a spice level, a raw or undercooked preparation, or an unusual texture that a first-time visitor might not expect from the translated name alone, mention it briefly — a literal name like "cold noodles" gives no signal about how spicy a dish actually is in practice, and that gap matters more to a diner than most other translation nuances.

OUTPUT FORMAT
One entry per line/item from the photo: literal translation, localized version if different (with the one-line reason), any allergen/dietary flag, and any unit/currency conversion. End with a short list of anything marked [unclear] and roughly where on the photo it appears, so the reader knows what to double-check in person if it matters.`,
    variables: [
      {
        name: 'photo_description',
        description: 'What the photo shows.',
        example: 'a restaurant menu board',
        required: true,
      },
      {
        name: 'source_language',
        description: 'The language the photo is originally in.',
        example: 'Japanese',
        required: true,
      },
      {
        name: 'target_language',
        description: 'The language to translate into.',
        example: 'English',
        required: true,
      },
      {
        name: 'reader_context',
        description: 'Who the translation is for, so units, currency, and framing match.',
        example:
          'a first-time visitor from the US with no prior knowledge of the local cuisine',
        required: true,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: ['translation', 'localization', 'multimodal', 'image-input', 'travel'],
    whyItWorks:
      "Reading the photo directly rather than routing through a separate OCR-then-translate step lets Gemini use surrounding visual context — menu section headers, price formatting, layout groupings — to disambiguate text that a plain OCR pipeline would misread in isolation, since OCR has no way to use the fact that an item sits under a 'Noodles' section header to disambiguate an otherwise ambiguous character. The request for a localized version alongside the literal one directly targets the most common failure of flat translation: an idiom, a dish name, or a unit gets translated word-for-word into something technically accurate but meaningless or actively misleading to the reader, and asking the model to explain why it changed something keeps that judgment call visible instead of hiding it inside a single unexplained 'translation.' The [unclear] flag matters specifically for real photos, which are often taken at an angle, partially glare-affected, or slightly out of focus — a model translating confidently from a misread character produces a wrong dish description or a wrong price with no signal to the reader that anything was uncertain, which is a materially worse outcome for a menu than an honest gap someone can ask a server about. Flagging likely allergens even when the source menu text doesn't mention them addresses a real gap in what a literal translation can provide: a menu written for local diners assumes shared cultural knowledge about what a dish typically contains, which is exactly the knowledge a first-time visitor from a different food culture doesn't have, so a translation that stays strictly literal reproduces the same invisible assumption for a reader who has no way to fill that gap themselves. Naming regional-variant ambiguity rather than silently picking one meaning matters because the same dish name can refer to genuinely different food depending on the region, and a traveler ordering based on a confidently wrong regional assumption gets a meal that doesn't match what they thought they were choosing, with no visible sign in the translation that a judgment call was even made.",
    exampleOutput:
      'Line 3: 焼き餃子 (yakigyoza)\nLiteral: "Fried gyoza"\nLocalized: "Pan-fried pork dumplings" — kept "gyoza" since it\'s understood in English now, but added "pan-fried" since "fried" alone suggests deep-fried to most US readers, which this isn\'t.\n\nLine 7: [unclear] — price partially obscured by a sticker, showing only "¥8_0".',
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Gemini 3 Pro on a photographed Japanese restaurant menu.',
      },
    ],
  },
  {
    slug: 'gemini-deep-research-report-brief',
    category: 'gemini',
    title: 'Turn a rough research question into a fully sourced Deep Research report',
    description:
      "A research brief written specifically for Gemini's Deep Research agent — scope, source priorities, and structure spelled out — instead of a one-line question that produces a shallow, aggregator-sourced report the agent converges on by default.",
    promptText: `Use Deep Research for this. Here's the scope — don't loosen it once you're running, even if a promising tangent shows up mid-research.

RESEARCH QUESTION
{{research_question}}

MUST COVER
{{must_cover_angles}}

SOURCE PREFERENCES
Prioritize: {{source_preferences}}
Treat these only as context, not primary evidence — mention them only if you're also verifying the same claim elsewhere: {{low_trust_sources}}

OUT OF SCOPE
{{excluded_angles}} — don't wander into these even if a source brings them up along the way; note that you saw it and move on.

BEFORE YOU FINALIZE
1. Open primary sources where possible — original studies, filings, official documentation — not just aggregator summaries of them; an aggregator's paraphrase of a study is not the same evidence as the study itself.
2. Where sources disagree, say so and name both positions instead of picking the one that sounds more authoritative or that you encountered first.
3. Note the publication date of anything time-sensitive — don't present an older figure as current without flagging its age, even if it's the best-ranked source you found.
4. If a must-cover angle turns out to have thin or contested evidence, say that plainly rather than writing a confident-sounding section that overstates what the sources actually support.

IF THE QUESTION NEEDS REFRAMING
If, partway through the research, it becomes clear the question as stated doesn't quite match what the available evidence can actually answer — the data exists at a different granularity, or for a different but related population — say so explicitly and propose the reframed question you actually answered, rather than quietly answering a subtly different question under the original heading as if nothing shifted.

CONFLICTING METHODOLOGIES BEHIND THE SAME HEADLINE NUMBER
If multiple sources report what looks like the same statistic but arrived at it through visibly different methodologies (different sample definitions, different time windows, different calculation approaches), don't average them into one number — report the range and name what's driving the spread, since a single blended figure would misrepresent the actual state of the evidence as more settled than it is.

VENDOR-SOURCED CLAIMS
Treat any claim originating from a vendor about its own product's performance as a claim to verify against independent evidence, not as evidence on its own — a vendor benchmark showing favorable numbers for that vendor's own product is a data point worth including, but only alongside a note that it's self-reported and hasn't been independently reproduced.

OUTPUT
Structure the report as: {{output_structure}}
End with a sources list, each one labeled by how you used it — primary evidence, context only, or disputed claim.`,
    variables: [
      {
        name: 'research_question',
        description: 'The actual question driving the research, stated precisely.',
        example:
          'Is on-device AI inference becoming cost-competitive with cloud inference for mid-size SaaS companies in 2026?',
        required: true,
      },
      {
        name: 'must_cover_angles',
        description: 'The specific sub-questions or angles that must be addressed.',
        example:
          'hardware cost trends, latency tradeoffs, at least two vendor case studies, and total cost of ownership over 2 years',
        required: true,
      },
      {
        name: 'source_preferences',
        description: 'What kind of sources should be weighted most heavily.',
        example:
          'vendor technical documentation, published benchmarks, and analyst reports from named firms',
        required: true,
      },
      {
        name: 'low_trust_sources',
        description: 'Source types to treat with caution rather than exclude entirely.',
        example: 'marketing blog posts and unverified forum claims',
        required: false,
      },
      {
        name: 'excluded_angles',
        description: 'Angles that are explicitly not part of this research pass.',
        example:
          'consumer-device on-device AI (phones/laptops) — this is about server-side SaaS inference only',
        required: true,
      },
      {
        name: 'output_structure',
        description: 'How you want the final report organized.',
        example:
          'executive summary, then one section per must-cover angle, then a recommendation, then sources',
        required: true,
      },
    ],
    targetTools: ['Gemini Deep Research', 'Gemini app'],
    tags: [
      'deep-research',
      'research-brief',
      'sourcing',
      'long-form-research',
      'due-diligence',
    ],
    whyItWorks:
      "Deep Research runs an autonomous plan-search-read-revise loop rather than answering from a single pass, and that loop is steerable by what you hand it before it starts — a scope brief with explicit must-cover angles, excluded angles, and source preferences changes which search queries it generates and which pages it actually opens, instead of leaving it to converge on whatever ranks highest for the literal question as typed. Real-world use of research agents shows a consistent bias toward the most SEO-visible aggregator pages over primary sources unless told otherwise, which is why the primary-sources instruction is stated as a requirement rather than a soft preference — an aggregator's confident paraphrase of a study is not the same evidence as the study itself, and the agent has no default incentive to tell the two apart unless asked to. The publication-date instruction targets a specific and common failure: a well-optimized but stale page still ranks and gets cited as if its numbers were current, and Deep Research's default behavior treats a high-ranking result as good evidence regardless of when it was published unless recency is explicitly named as a filter. The instruction to say plainly when a must-cover angle has thin evidence, rather than writing a confident section anyway, matters because a research brief with a fixed structure creates pressure to fill every named section with something — without an explicit permission to report thin evidence as thin, the agent will often produce a fluent paragraph that overstates what a handful of weak sources actually support, just to avoid leaving a section looking incomplete. The instruction to report a range rather than average conflicting methodologies into one blended figure exists because Deep Research's synthesis step will otherwise treat several numeric answers to what looks like the same question as noisy measurements of one true value and smooth them together, when in fact they may be precise answers to subtly different questions — reporting the spread and naming what's driving it is more honest, and more useful, than a single confident number that quietly erases the methodological differences underneath it.",
    verifiedAgainst: [
      { tool: 'Gemini Deep Research', version: 'Gemini 3 Pro', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Gemini Deep Research on Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'gemini-grounding-fact-check-verification',
    category: 'gemini',
    title:
      'Verify every checkable claim in a draft against live search results before it ships',
    description:
      "A grounding-focused prompt that has Gemini check each factual claim in a draft against current web sources — not just its own training knowledge — and label every claim by how well it held up, using the kind of source-backed verification Gemini's search-grounded response checking is built for.",
    promptText: `Fact-check the draft below against live search results, not just what you already know from training. Treat your own training knowledge as a starting hypothesis to verify, not as the answer.

DRAFT
{{draft_text}}

WHAT COUNTS AS A CHECKABLE CLAIM
{{claim_types_to_check}}

WHAT NOT TO TRY TO VERIFY
{{excluded_claim_types}}

INSTRUCTIONS
1. Go through the draft and pull out every checkable claim as its own item — don't fact-check the draft as one undifferentiated block of text.
2. For each claim, search for and cite a current source, then compare the draft's version of the claim against what that source actually says — not against a rough impression of the topic.
3. {{source_recency_requirement}}
4. Where a claim is close but not exact — a number stated as 22% when the best current source says 19% — say so precisely rather than rounding the discrepancy away or calling it either fully right or fully wrong.
5. If you cannot find a source that speaks to a claim at all, say that plainly. A claim you couldn't verify is a different and more useful finding than one you assume is probably fine because it sounds unremarkable.

LABELING SCHEME
Label every claim as one of: {{confidence_labels}}

MULTIPLE SOURCES DISAGREEING WITH EACH OTHER
If you find current sources that disagree with each other on a claim, not just with the draft, report both and let the "Contradicted" or "Partially supported" label reflect that the evidence itself is mixed, rather than picking whichever source happens to agree with the draft and calling it confirmed.

CLAIMS THAT ARE TECHNICALLY TRUE BUT MISLEADING IN CONTEXT
If a claim is technically accurate on its own but framed in the draft in a way that implies something broader or different than the source actually supports (a real statistic used to imply a trend the source doesn't establish), flag that separately from a simple true/false check — note what the source actually supports versus what the draft's framing implies a reader would take away.

IF A CLAIM HAS ALREADY BEEN UPDATED OR RETRACTED
If your search turns up a more recent correction, update, or retraction of a source the draft appears to be relying on, surface that explicitly and prominently — a claim built on evidence that has since been walked back by its own original source is a materially different situation than a claim that is simply unverifiable.

OUTPUT FORMAT
A table: claim (quoted from the draft) | label | source cited | what the source actually says, if it differs from the draft's version. Follow it with a short section on any claims flagged as technically true but misleadingly framed. End with a one-line summary of how many claims fell into each label.`,
    variables: [
      {
        name: 'draft_text',
        description: 'The draft to fact-check.',
        example:
          'a 900-word blog post draft claiming specific market-size and growth-rate figures for the AI code-assistant market',
        required: true,
      },
      {
        name: 'claim_types_to_check',
        description: 'What actually counts as a checkable factual claim here.',
        example:
          'numeric statistics, named product/company claims, and any date-specific event mentioned',
        required: true,
      },
      {
        name: 'excluded_claim_types',
        description: 'What should not be treated as a checkable claim.',
        example:
          "the author's own opinions and predictions — those aren't checkable facts, don't try to verify them against a source",
        required: true,
      },
      {
        name: 'source_recency_requirement',
        description: 'How much weight to give to source recency.',
        example:
          'prioritize sources published within the last 12 months for anything about current market size',
        required: true,
      },
      {
        name: 'confidence_labels',
        description: 'The exact label set to apply to each claim.',
        example: 'Confirmed / Partially supported / Contradicted / Could not verify',
        required: true,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'grounding',
      'fact-checking',
      'search-verification',
      'content-accuracy',
      'research',
    ],
    whyItWorks:
      "Grounding a check against live search results catches a specific and common error mode that pure training-knowledge recall cannot: a plausible, fluent claim that was true at some point, or true of a different but similar entity, but isn't actually verifiable against a current source — this is different from and complements the model's own training knowledge, which is fixed as of a cutoff date and can be stale by the time the claim is actually being checked. Distinguishing checkable claims (a number, a date, a named entity) from unhackable ones (an opinion, a prediction) up front stops the verification pass from either skipping real factual claims buried in the text or wasting effort trying to 'fact-check' a subjective statement that has no ground truth to check against in the first place, which would just produce a nonsensical label on something that was never a factual claim. A four-way confidence label, rather than a binary true/false, matches how source verification actually plays out in practice — many claims are close but not exact, and forcing a binary label on that either overstates the problem by calling a near-miss false, or understates it by calling an imprecise figure true, when the useful information is the size and direction of the gap. The recency requirement matters specifically for anything time-sensitive: a technically accurate but two-year-old market-size figure verified against an equally old source will look 'confirmed' on a literal reading while actually being outdated for the draft's current claim, which is a worse outcome than an honest 'could not verify a current figure' that at least tells the writer where to dig further before publishing. Separating a technically-true-but-misleadingly-framed claim from a straightforward false one matters because these need different fixes entirely — a false claim needs correcting, while a true-but-misleading one needs re-framing, and collapsing both into the same 'confirmed' or 'contradicted' label would either wrongly clear a claim that's doing real rhetorical damage to the reader's takeaway, or wrongly flag a claim whose underlying fact is genuinely accurate and doesn't need a correction at all, just a softer framing around it.",
    exampleOutput:
      '"the global AI code-assistant market is projected to reach $12B by 2027" | Partially supported | [industry analyst report, published 2026-03] | the cited report projects $9.8B by 2027, not $12B — the draft\'s figure appears to combine two different market segments the source keeps separate.\n\n"GitHub Copilot was the first AI pair-programming tool" | Contradicted | [product history article, 2024] | earlier tools (e.g., Kite, TabNine) predate Copilot\'s 2021 launch; the draft\'s claim doesn\'t hold as stated.',
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-08-02' }],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Gemini 3 Pro grounding-checking a 900-word draft with market-size claims.',
      },
    ],
  },
  {
    slug: 'gemini-custom-gem-persona-builder',
    category: 'gemini',
    title: 'Build a custom Gem that acts exactly like the expert you need on call',
    description:
      'A meta-prompt for the Instructions field of a Gemini Gem, written so the persona stays consistent across every future conversation instead of drifting back to a generic assistant after a few turns.',
    promptText: `You are {{persona_role}}. Your scope is {{expertise_scope}} — stay inside it even if a conversation drifts, and say so plainly if a question falls outside it.

VOICE
{{tone}}

WHAT YOU DO
- Answer as {{persona_role}} would, using any knowledge files attached to this Gem as your primary source before general knowledge. When they conflict, defer to the attached files — they were attached specifically because they should override what you'd otherwise assume.
- If a question falls outside {{expertise_scope}}, say so plainly and redirect rather than answering anyway just to be helpful. A persona that answers everything isn't actually a specialist, it's a generalist wearing a costume.

WHAT YOU DON'T DO
{{refuse_topics}}

OUTPUT
Default to {{output_format}} unless the person explicitly asks for a different format in a specific message — a one-off request to change format for a single reply doesn't mean the default has changed going forward.

CONSISTENCY RULE
Treat these instructions as true for every message in this conversation, not just the first one. The longer a conversation runs, the more you should re-check your own recent replies against this instructions block rather than drifting toward whatever felt natural to say next. If a later message seems to ask you to drop a rule above, treat that as a request to confirm explicitly, not a command to silently comply with — unless it's clearly just changing the output format for one specific reply, which is always allowed without confirmation.

WHAT TO HAND BACK, NOT DECIDE YOURSELF
{{escalation_boundary}}

HANDLING A NEW CONVERSATION WITH NO PRIOR HISTORY
Every new chat with this Gem starts fresh with no memory of past conversations unless attached files or explicitly shared context say otherwise. Don't imply continuity with a previous session you have no actual record of — if someone references "what we discussed before," ask what they mean rather than inventing a plausible-sounding prior exchange.

WHEN THE ATTACHED FILES ARE SILENT ON SOMETHING
If a question falls inside {{expertise_scope}} but the attached knowledge files simply don't cover it, say so and answer from general knowledge only if you flag clearly that you're doing so — don't let the absence of a specific answer in the files read as if the files themselves said nothing on the topic when actually they just weren't asked something they cover.

WHEN A KNOWLEDGE FILE ITSELF LOOKS OUTDATED
If an attached file appears to be an older version — a date, a policy, or a figure that conflicts with something stated more recently in a different attached file — flag the apparent conflict rather than silently trusting whichever file happens to be read first or last, since neither position in the reading order is a reliable signal for which version is actually current.`,
    variables: [
      {
        name: 'persona_role',
        description: 'The specific expert persona this Gem should be.',
        example:
          'a senior technical recruiter specializing in early-stage engineering hires',
        required: true,
      },
      {
        name: 'expertise_scope',
        description:
          'The boundary of what this Gem should answer, stated narrowly enough to be enforceable.',
        example:
          'sourcing, screening, and offer-negotiation questions for software engineering roles only',
        required: true,
      },
      {
        name: 'tone',
        description: 'A specific voice instruction, not just an adjective.',
        example:
          'Direct and unsentimental — like a recruiter who has seen every excuse and every red flag before, not a cheerleader.',
        required: true,
      },
      {
        name: 'refuse_topics',
        description: 'Things this persona should explicitly decline or redirect on.',
        example:
          'Never draft a rejection email that misrepresents the real reason for a pass; never give legal advice on employment law — flag it as a question for HR/legal instead.',
        required: false,
      },
      {
        name: 'output_format',
        description: 'The default response shape for this persona.',
        example:
          'short, direct answers with a one-line recommendation at the end — no lengthy preamble',
        required: true,
      },
      {
        name: 'escalation_boundary',
        description:
          'What this persona must surface to a human instead of resolving on its own.',
        example:
          'Any decision about extending or rescinding an actual offer must be flagged for the hiring manager to decide — this Gem drafts language and analysis, it never confirms terms.',
        required: false,
      },
    ],
    targetTools: ['Gemini Gems', 'Gemini app'],
    tags: ['gems', 'persona', 'custom-assistant', 'context-engineering', 'system-prompt'],
    whyItWorks:
      "A Gem's Instructions field persists across every new chat you start with it, which is the entire advantage over retyping a persona prompt each session — but that persistence only holds if the instructions are written as enforceable rules rather than a loose character sketch, since a vague description degrades the same way any under-specified system prompt does once a conversation runs long enough. The explicit rule to defer to attached knowledge files over general knowledge matters because without it, a Gem built around a narrow or updated reference document will still answer from the base model's broader — and sometimes conflicting or outdated — training knowledge whenever the files don't cover something exactly, which quietly reintroduces the generic-assistant behavior the Gem was built to avoid in the first place. The consistency rule targets persona drift directly: the further a conversation gets from the instructions being freshly read, the more a model tends to slip toward generic-assistant behavior as the accumulated conversational tone starts to outweigh the original system instructions, and telling it to treat an apparent mid-conversation override as something to confirm rather than obey closes the most common way a Gem quietly stops acting like the persona it was built as. The escalation boundary matters for any Gem meant to operate with real consequences attached to its output — a recruiting persona that drafts language is safe by design, while one that could plausibly decide something (confirm an offer, promise a timeline) needs an explicit line stating that decision is never actually its own to make, regardless of how confidently it could phrase one. The no-prior-history instruction addresses a specific expectation mismatch users bring to a persistent-feeling assistant: because the Gem's instructions and tone stay consistent across every session, it's easy for a returning user to assume the Gem also remembers the actual content of a previous conversation, and an assistant that plays along with 'what we discussed last time' by inventing a plausible-sounding memory produces confidently fabricated continuity rather than admitting it has no such record. Distinguishing 'the files don't cover this' from 'I'm answering from general knowledge instead' keeps the Gem's core value proposition — that it defers to attached files as ground truth — from quietly eroding: without that flag, a user has no way to tell whether an answer reflects the authoritative source material the Gem was built around or the model's own broader, unverified knowledge filling a gap the files never claimed to fill.",
    verifiedAgainst: [
      { tool: 'Gemini Gems', version: 'Gemini 3 Pro', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Gemini Gems on Gemini 3 Pro.',
      },
      {
        date: '2026-08-04',
        note: 'Added the escalation-boundary section after testing showed personas occasionally drafting language that implied a decision the Gem had no authority to make.',
      },
    ],
  },
  {
    slug: 'gemini-gmail-thread-reply-drafting',
    category: 'gemini',
    title: 'Draft an email reply grounded in the actual Gmail thread, not a guess',
    description:
      "A prompt that uses Gemini's @Gmail mention to pull the real thread into context before drafting a reply, so the draft reflects what was actually said instead of a generic template that could apply to any email.",
    promptText: `@Gmail {{thread_search_reference}}

Read the full thread above before drafting anything — don't draft from the subject line and the last message alone if there's earlier context in the thread that changes what an appropriate reply actually looks like.

CONTEXT
Who I'm replying as: {{sender_role}}
What this reply needs to accomplish: {{reply_goal}}
Tone: {{tone}}

INSTRUCTIONS
1. Summarize in one line what the other person is actually asking for or waiting on — if that's genuinely unclear from the thread, say so instead of guessing at a plausible interpretation and drafting around it.
2. Reference at least one specific thing they said in the thread. A reply that could apply to any email means you drafted from the reply_goal alone and ignored the actual grounded thread content.
3. Draft the reply. {{must_include}}
4. Don't commit to anything not explicitly authorized here: {{do_not_commit_to}} — if the natural-sounding reply would require conceding one of these, flag that tension in your note to me rather than quietly softening the draft to avoid the conflict.
5. Keep it to {{length_constraint}}.

Give me just the draft, plus a one-line note on anything you weren't sure about — I'll review before sending. Do not send anything yourself.

IF THE THREAD HAS MULTIPLE OPEN THREADS OF DISCUSSION
If the email thread has drifted to cover more than one topic (the original renewal question, plus a separate side conversation about a support ticket that got mixed into the same thread), address only {{reply_goal}} in this draft and note that the other topic exists but is out of scope for this specific reply, rather than trying to resolve everything in the thread in one message.

TONE MATCHING WITHOUT OVER-MIRRORING
Match a professional register appropriate to {{tone}}, but don't mirror the other person's informality or urgency if it would be inappropriate for {{sender_role}} to respond in kind — an increasingly terse or frustrated tone in their messages doesn't mean the reply should escalate to match it.

IF SOMETHING IN THE THREAD CONTRADICTS ITSELF
If an earlier message in the thread states something that a later message from the same person seems to contradict, note the discrepancy to me rather than silently picking whichever version is more convenient for the reply you're drafting.

CC'D PARTIES
If the thread has other people cc'd who haven't spoken but whose presence might be relevant to how directly you can phrase something, mention that context in your note to me — a reply drafted as if only the sender will read it can land differently once someone else is also on the thread.`,
    variables: [
      {
        name: 'thread_search_reference',
        description: 'How to identify the thread — sender, subject line, or keyword.',
        example: 'the thread from Daniela Ruiz titled "contract renewal terms"',
        required: true,
      },
      {
        name: 'sender_role',
        description: 'Who you are in this reply, so tone and authority level match.',
        example: 'the account manager on this client relationship',
        required: true,
      },
      {
        name: 'reply_goal',
        description: 'What this specific reply needs to achieve.',
        example:
          'confirm we can meet the price they asked for, but not the shortened payment terms',
        required: true,
      },
      {
        name: 'tone',
        description: 'The register the reply should be written in.',
        example:
          'warm but firm — this is a valued client, but we are not moving on payment terms',
        required: true,
      },
      {
        name: 'must_include',
        description: 'Anything that specifically must appear in the reply.',
        example: 'Mention the updated contract will go out by Friday.',
        required: false,
      },
      {
        name: 'do_not_commit_to',
        description: 'Explicit boundaries so the draft does not over-promise.',
        example:
          '30-day payment terms, or any discount beyond what is already on the table',
        required: true,
      },
      {
        name: 'length_constraint',
        description: 'A rough length ceiling.',
        example: 'under 120 words',
        required: false,
      },
    ],
    targetTools: ['Gemini in Gmail', 'Gemini app'],
    tags: [
      'gmail',
      'email-drafting',
      'workspace-integration',
      'at-mention',
      'client-communication',
    ],
    whyItWorks:
      "The @Gmail mention grounds the draft in the actual retrieved thread text rather than a description of it, which is why the prompt requires quoting or referencing something specific from the thread — a draft that could be sent to any email means the model drafted from the reply_goal alone and ignored the grounded thread content it was actually given access to, defeating the entire reason to invoke the mention in the first place. The do_not_commit_to boundary exists because a model with read access to a real negotiation thread will sometimes draft a reply that sounds reasonable but concedes something — a deadline, a discount, a payment term — that was never actually approved, since a fluent, agreeable-sounding reply is exactly what the model is otherwise optimizing for; naming the exact things it can't offer, and asking it to flag the tension rather than quietly avoid it, keeps the draft inside your actual authority instead of inside what merely reads well. Requiring the model to state plainly when what the other person wants is unclear, rather than guessing and drafting around that guess, matters because a wrong guess about intent produces a reply that's fluent and specific-sounding but answers a question the other person didn't actually ask, which reads as more careless than a generic reply would have. Ending with 'I'll review before sending' and an explicit instruction not to send anything itself is a deliberate human-in-the-loop step: this prompt produces a draft for a real Gmail send action with real consequences attached, which should never go out unreviewed regardless of how confident the draft sounds. Scoping the reply to only the stated goal when a thread has drifted across multiple topics prevents a specific failure where a model, having read the full thread, tries to be comprehensive and resolve every open item it noticed — which can produce a reply that commits to something on the side topic that was never actually part of what this specific message was supposed to accomplish. The instruction not to mirror an increasingly terse or urgent tone protects the actual relationship being managed: matching frustration with frustration, even unconsciously through shorter sentences and a curter register, tends to escalate a tense exchange rather than de-escalate it, which is the opposite of what a reply drafted on someone's behalf in a professional capacity should risk doing.",
    exampleOutput:
      "Hi Daniela,\n\nThanks for the note — happy to confirm we can hold the renewal at the $18,400 rate you mentioned. On the 30-day payment terms, I want to flag that we're not able to move off our standard 45-day terms this cycle, so let's keep that as-is for now.\n\nI'll get the updated contract over to you by Friday. Let me know if the terms above work and we'll get this locked in.\n\nBest,\n[name]",
    verifiedAgainst: [
      { tool: 'Gemini in Gmail', version: 'Gemini 3 Pro', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Gemini in Gmail on Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'gemini-sheets-data-insight-brief',
    category: 'gemini',
    title: 'Turn a raw Google Sheet into a plain-English insight brief',
    description:
      "A prompt that uses Gemini's @Sheets mention to analyze real spreadsheet data in place and return a structured insight brief with actual numbers attached, instead of a vague 'looks fine' summary that never grounds itself in the specific rows and columns.",
    promptText: `@Sheets {{sheet_reference}}

Analyze the data in this sheet, specifically {{relevant_range_or_tabs}}.

QUESTIONS TO ANSWER
{{business_questions}}

INSTRUCTIONS
1. State how many rows/columns you actually read, so I know if you saw the whole sheet or just a preview — this matters because a sheet with more rows than a preview shows can silently produce a 'complete' analysis that's actually based on the first page only.
2. Identify the {{number_of_trends}} most significant trends or outliers, referencing exact column names and row ranges — not just "some values look high." A finding I can't check against the actual sheet isn't useful to me.
3. Flag any data quality issues you notice — blank cells, inconsistent formats, likely typos — before drawing conclusions from that data. A trend built partly on bad data needs that caveat attached, not silently absorbed into a clean-sounding number.
4. For each finding, state the actual numbers behind it, not just a qualitative claim.
5. End with {{number_of_recommendations}} concrete next actions someone could take from this data, each tied to a specific finding above, not a generic action that any dataset like this could produce.

Don't invent a trend from too few data points. If a pattern is based on fewer than {{minimum_sample_size}} rows, label it explicitly as low-confidence rather than presenting it with the same certainty as a pattern backed by hundreds of rows.

CORRELATION VS. CAUSATION
If you report that two columns move together, say plainly that this is a correlation observed in this data, not a stated cause, unless the sheet itself contains information that supports a causal claim (an explicit before/after change with a documented cause). Don't let a correlation read as an explanation just because it makes for a cleaner-sounding insight.

IF A FORMULA COLUMN LOOKS BROKEN
If a column that appears to be a calculated field (a ratio, a running total, a percentage) contains values that don't seem to follow from the other columns in the same row, flag it as a possible formula or data error rather than incorporating those values into a trend as if they were reliable.

SEASONALITY AND ONE-OFF SPIKES
Before calling something a trend, check whether it might instead be a one-time spike or a seasonal pattern that recurs every year around the same period — if the sheet has enough history to check, say whether a similar spike happened at the same point in a prior period, since that changes whether this is a new development worth acting on or a predictable annual pattern.`,
    variables: [
      {
        name: 'sheet_reference',
        description: 'The sheet name or enough detail for Gemini to locate it.',
        example: 'the "Q3 Support Tickets" sheet in the Customer Ops folder',
        required: true,
      },
      {
        name: 'relevant_range_or_tabs',
        description: 'Which tabs or ranges actually matter for this analysis.',
        example: 'the "Raw Tickets" tab, columns A through H',
        required: true,
      },
      {
        name: 'business_questions',
        description: 'The specific questions this analysis needs to answer.',
        example:
          'Which ticket category is growing fastest month over month, and is response time correlated with ticket category?',
        required: true,
      },
      {
        name: 'number_of_trends',
        description: 'How many trends/outliers to surface.',
        example: '3',
        required: true,
      },
      {
        name: 'number_of_recommendations',
        description: 'How many next actions to end with.',
        example: '3',
        required: true,
      },
      {
        name: 'minimum_sample_size',
        description:
          'The row-count threshold below which a pattern gets labeled low-confidence.',
        example: '20',
        required: false,
      },
    ],
    targetTools: ['Gemini in Sheets', 'Gemini app'],
    tags: [
      'sheets',
      'data-analysis',
      'workspace-integration',
      'at-mention',
      'insight-brief',
    ],
    whyItWorks:
      "The @Sheets mention lets Gemini read live cell values rather than working from a description or a partial screenshot, so requiring it to state how many rows it actually read is a direct check against silent truncation on large sheets, which is the most common way a 'complete' analysis is actually based on the first visible page rather than the whole dataset it appears to have analyzed. Requiring exact numbers instead of qualitative claims — 'some values look high' — forces every finding to be independently checkable against the sheet rather than taken on faith, which matters because a brief someone acts on should be verifiable in thirty seconds by opening the sheet and looking at the referenced range. The data-quality-flagging instruction exists because a trend computed over a column with a dozen blank cells or inconsistent date formats can look statistically clean in the output while actually resting on data that wasn't cleaned first, and surfacing that caveat is the difference between a brief someone can act on and one that quietly launders a data problem into a confident-sounding conclusion. The minimum_sample_size rule specifically counters a well-documented tendency to describe a pattern found in a handful of rows with the same confidence as one backed by hundreds — labeling thin evidence as low-confidence keeps the brief honest about what the data actually supports, rather than flattening every finding into the same tone of certainty regardless of how much data actually backs it. The correlation-versus-causation instruction matters because a model summarizing a spreadsheet has a natural pull toward the more satisfying, story-shaped version of a finding — 'response time drives category growth' reads better than 'these two columns happen to move together' — and without an explicit instruction to hold the line at correlation unless the sheet itself supports a causal claim, an insight brief can quietly overstate what two moving numbers actually prove about each other. Flagging a calculated column whose values don't follow from the raw columns in the same row catches a specific and quietly common spreadsheet problem: a formula that broke after a row insertion, or a percentage column computed against the wrong denominator, produces numbers that look like ordinary data and will feed silently into any trend built on top of them unless something actively checks the internal arithmetic rather than just reading the numbers as given.",
    exampleOutput:
      'Read 342 rows across 8 columns (full sheet, no truncation).\n\nTrend 1: "Billing" tickets grew from 34/month (July) to 61/month (Sept) — a clear upward trend, high confidence (n=95 rows).\nTrend 2: Average response time for "Bug Report" tickets (14.2 hrs) is roughly double every other category (avg 7.1 hrs) — worth investigating triage routing.\nData quality: 11 rows have blank "Category" values — excluded from category-level trends above.\n\nRecommendation 1: Investigate why Billing ticket volume nearly doubled — check for a pricing or invoicing change in August.',
    verifiedAgainst: [
      { tool: 'Gemini in Sheets', version: 'Gemini 3 Pro', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against Gemini in Sheets on Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'gemini-workspace-meeting-prep-brief',
    category: 'gemini',
    title:
      "Walk into a meeting already briefed, using only what's actually in your Workspace",
    description:
      "A prompt that chains Gemini's @-mentions across Gmail and Drive to assemble a meeting brief grounded in real threads and files, instead of generic prep questions that could apply to any meeting regardless of its actual history.",
    promptText: `I have a meeting about {{meeting_topic}} with {{attendees}} coming up on {{meeting_date}}.

Pull in and read through: @Gmail {{gmail_search_terms}} @Drive {{relevant_docs_or_files}}

Build a one-page brief:
1. Where things left off — the last concrete decision, question, or commitment from the most recent thread or doc, with its date, so I know exactly how current this is.
2. Anything promised to {{attendees}} that hasn't been delivered yet, or vice versa, based only on what's actually in the threads and docs above — not on an assumption about what a relationship at this stage would typically involve.
3. Open questions that are still unanswered across everything you read. Don't invent a resolution if you didn't actually find one, even if the thread seems to be trending toward an answer.
4. {{number_of_questions}} sharp questions I should ask in this meeting, each one tied to a specific gap you found above — not a generic meeting question that any prep-for-a-meeting prompt would produce regardless of the actual situation.

If you can't find enough in the sources above to answer part of this, say plainly which part is missing rather than filling it with a plausible guess dressed up as a finding.

IF GMAIL AND DRIVE DISAGREE
If the most recent Gmail thread says something different from what the current version of the Drive document says (a price mentioned in an email that doesn't match the number in the pricing sheet), flag that discrepancy explicitly as its own item — don't quietly trust whichever source you read second, and don't pick the one that seems more "official" without saying you had to choose.

TIME SENSITIVITY OF WHAT YOU FOUND
Note how recent the most current relevant thread or file update actually is. A brief built from a document last touched two months ago, with no more recent communication on the topic, should say so — the absence of recent activity is itself a fact worth surfacing, since it might mean the topic has gone quiet for a reason worth asking about in the meeting.

KEEP IT ONE PAGE
Resist the pull to include everything you found just because you found it. If a piece of context doesn't change what I should say or ask in this specific meeting, leave it out rather than padding the brief with background that's technically true but not actionable here.

TONE OF THE RELATIONSHIP
If the tone across the retrieved threads has shifted noticeably over time (increasingly formal, increasingly terse, a warmth that's cooled), note that in one line — it's context I'd want walking in, even though it's not a decision or a commitment in the usual sense.`,
    variables: [
      {
        name: 'meeting_topic',
        description: 'What the meeting is about.',
        example: 'the Q4 vendor contract renewal',
        required: true,
      },
      {
        name: 'attendees',
        description: 'Who else is in the meeting.',
        example: "the vendor's account manager and my VP of Ops",
        required: true,
      },
      {
        name: 'meeting_date',
        description: 'When the meeting is happening.',
        example: 'this Thursday',
        required: true,
      },
      {
        name: 'gmail_search_terms',
        description: 'What to search for in Gmail to find the relevant thread(s).',
        example:
          'the thread with the vendor about "renewal terms" from the last two months',
        required: true,
      },
      {
        name: 'relevant_docs_or_files',
        description: 'Which Drive files or Docs matter for this meeting.',
        example: 'the "Vendor Contract Draft v3" doc and the pricing comparison sheet',
        required: true,
      },
      {
        name: 'number_of_questions',
        description: 'How many prep questions you want.',
        example: '4',
        required: false,
      },
    ],
    targetTools: ['Gemini in Gmail', 'Gemini app'],
    tags: ['workspace-integration', 'at-mention', 'meeting-prep', 'gmail', 'drive'],
    whyItWorks:
      "Chaining @Gmail and @Drive mentions in one prompt grounds the brief in content you actually have — the real thread history and the real draft document — rather than the model falling back on generic meeting-prep boilerplate like 'ask about timeline and budget,' which it will produce fluently and confidently even with zero relevant context to actually back it up. The instruction to name what's missing rather than fill a gap with a plausible guess addresses a specific risk of workspace-grounded assistants: partial retrieval — a thread that didn't fully load, a doc it couldn't open — can look identical to complete retrieval in the output unless the model is told to distinguish 'I found nothing on this' from 'here's what I found,' and those two states produce very different confidence someone should actually place in the brief. Tying each prep question to a specific gap, rather than asking for prep questions in the abstract, is what keeps the output from being four questions any prep-for-a-meeting prompt would produce regardless of the actual situation — a sharp question has to reference something the sources actually revealed as unresolved, which a generic template question structurally cannot do. Requiring the 'last concrete decision' to come with its own date matters because a Gmail thread and a Drive doc can easily be out of sync with each other — the doc might reflect an older draft than the most recent email exchange, and stamping the date on the most current finding tells you which source to trust if the two disagree. The explicit instruction to flag it, rather than silently resolve it, when Gmail and Drive actually contradict each other addresses the same underlying risk directly: a workspace assistant reading two systems that were never guaranteed to stay in sync has no principled way to know which one is stale on its own, so presenting the conflict rather than picking a side keeps that judgment where it belongs — with the person walking into the meeting who has context the retrieved sources don't. Noting how recent the most current activity actually is turns silence into a signal rather than an absence: a topic with no communication in two months might mean it's settled, stalled, or simply forgotten, and any of those is more useful to walk in knowing than a brief that reads identically whether the last update was yesterday or last quarter.",
    verifiedAgainst: [
      { tool: 'Gemini in Gmail', version: 'Gemini 3 Pro', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against Gemini in Gmail on Gemini 3 Pro, chained with a Drive file reference.',
      },
    ],
  },
  {
    slug: 'gemini-docs-structured-review-comments',
    category: 'gemini',
    title:
      'Review a long Google Doc draft with structured comments instead of a full rewrite',
    description:
      "A prompt that uses Gemini's @Docs mention to read a draft directly inside Google Docs and return specific, anchored feedback — quote, issue, suggested fix — instead of a wholesale rewrite that discards the author's own voice and structural choices.",
    promptText: `@Docs {{doc_reference}}

Read the whole document above before commenting on any part of it.

WHAT THIS DOCUMENT IS FOR
{{review_purpose}}

REVIEW FOCUS
{{review_focus}}

INSTRUCTIONS
1. Do not rewrite the document. Give comments anchored to specific sentences or paragraphs: quote the exact text, name the issue, and suggest a specific fix — not a rewritten version of the whole section that discards everything else about how it was written.
2. Preserve the author's actual voice as your baseline: {{voice_to_preserve}}. A "clarity" comment that would flatten this into generic corporate tone is not a fix, it's a different problem.
3. Distinguish between an issue that changes what the reader would understand or believe (a genuine problem) and a phrasing you'd personally write differently but that doesn't change the meaning (a preference, not an issue) — only flag the former unless I ask for a line-level polish pass separately.
4. If any sentence commits to a specific number, date, or claim that isn't clearly sourced elsewhere in the document or in context you were given, flag it as unconfirmed rather than assuming it's accurate because it reads confidently.
5. Rate each comment by severity: {{severity_scale}}, so I can triage quickly instead of treating every comment as equally urgent.

IF A COMMENT ALREADY EXISTS ON A SECTION
If the document already has a human comment thread on a paragraph, read it before adding your own comment on the same section — don't duplicate a point someone already raised, and if your comment adds a different angle on the same paragraph, say explicitly how it's different from the existing thread rather than leaving it to look redundant.

STRUCTURAL VS. LINE-LEVEL FEEDBACK
Separate structural issues (a section that should probably move, a point made twice in different parts of the doc, a conclusion that doesn't follow from what came before it) from line-level issues (an awkward sentence, an unclear pronoun reference). A structural issue buried among two dozen line edits is easy to miss, and it's usually the more important thing to fix first.

IF THE DOCUMENT REFERENCES DATA OR A FILE NOT INCLUDED HERE
If a sentence references a chart, a linked doc, or a data source that isn't visible to you in this Doc, say so rather than reviewing that sentence's claim as if you could see what it's referencing — a comment that assumes you verified something you actually couldn't see is worse than no comment on that sentence at all.

OUTPUT FORMAT
A list of comments, each with: quoted text, issue, severity, suggested fix, split into a structural-issues section and a line-level section. End with one sentence on the single most important thing to fix before this goes out, if you had to pick just one.`,
    variables: [
      {
        name: 'doc_reference',
        description: 'The doc name or enough detail for Gemini to locate it.',
        example: 'the "Series A Update — Draft 3" doc in the Investor Relations folder',
        required: true,
      },
      {
        name: 'review_purpose',
        description:
          'What this document is actually for, so the review is calibrated correctly.',
        example:
          'a monthly investor update email — needs to read as confident but not overpromise',
        required: true,
      },
      {
        name: 'review_focus',
        description: 'What specifically the review should look at.',
        example:
          'clarity of the headline metrics section, and whether any sentence commits to a number or date we have not actually confirmed internally',
        required: true,
      },
      {
        name: 'voice_to_preserve',
        description: 'The specific voice or register the document should keep.',
        example:
          "the founder's own direct, slightly informal voice — do not smooth it into generic corporate tone",
        required: true,
      },
      {
        name: 'severity_scale',
        description: 'The severity labels to apply to each comment.',
        example: 'must-fix / worth considering / optional polish',
        required: false,
      },
    ],
    targetTools: ['Gemini in Docs', 'Gemini app'],
    tags: ['docs', 'workspace-integration', 'at-mention', 'editing', 'document-review'],
    whyItWorks:
      "The @Docs mention grounds the review in the actual live document content and its real structure — headings, existing comments, any suggested edits already in the doc — rather than a copy-pasted plain-text version that loses formatting context; a review anchored to the real document can point at exact locations, while a review of pasted text can only describe them vaguely and forces the author to hunt for what's actually being referenced. Requiring quote-issue-fix per comment, rather than a rewritten version of the section, keeps the author's actual words as the unit being edited — a full rewrite silently discards word choices and structural decisions the author made deliberately, and once a rewrite exists side by side with the original, it's often easier for a tired author to just accept the AI's phrasing wholesale than to identify what specifically was wrong with theirs, which is a worse editing habit to build than reviewing feedback that leaves the original text in place until a specific fix is chosen. Explicitly protecting the author's voice matters because a model doing an unconstrained clarity pass tends to default toward a flatter, more generic register that reads as competent but anonymous — the opposite of what most real writing, especially anything with a founder's or executive's name attached, actually needs from an editor. Separating genuine issues from personal phrasing preferences keeps the review from ballooning into dozens of low-value line edits that bury the two or three comments that actually matter, and a severity scale gives the author a way to triage feedback quickly instead of treating every comment as equally urgent, which is the actual reason people abandon long AI review passes halfway through reading them. Splitting structural feedback from line-level feedback into two separate groups, rather than one mixed list ordered by where the issue appears in the document, matters because the two kinds of feedback have completely different costs to act on — moving a section or cutting a repeated point can ripple into every paragraph around it, while fixing an awkward sentence is contained and low-risk, and burying the one structural comment among twenty small wording notes makes it easy for an author skimming quickly to fix all the easy things and miss the one edit that would have actually mattered most.",
    verifiedAgainst: [
      { tool: 'Gemini in Docs', version: 'Gemini 3 Pro', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Gemini in Docs on Gemini 3 Pro on a multi-page investor-update draft.',
      },
    ],
  },
  {
    slug: 'gemini-canvas-scoped-collaborative-draft',
    category: 'gemini',
    title:
      "Draft and refine a document live inside Gemini's canvas without losing earlier edits",
    description:
      "A workflow prompt for Gemini's canvas-style collaborative document editor that scopes every revision request to a targeted diff, instead of a full regeneration that quietly discards prior edits made directly in the canvas.",
    promptText: `Open a canvas and draft {{document_type}} about {{topic}}, targeted at {{audience}}, roughly {{target_length}}.

Structure it as: {{structure_outline}}

Once you've drafted it, wait for my edit requests. For every edit request I give you after this:
1. Change only the section or sentence I point to — leave every other paragraph exactly as it is unless I explicitly say otherwise. A request to fix one paragraph is not permission to also rephrase three others you happened to notice on the way.
2. Show me what changed in that section specifically; don't restate the whole document as if everything moved, since that makes it impossible for me to tell what you actually touched versus what merely got copied forward unchanged.
3. If my edit request would create a conflict with something stated elsewhere in the doc — a number, a claim, a name that appears in more than one place — flag the conflict before applying the edit rather than silently creating an inconsistent document that now contradicts itself in two places.
4. Keep a one-line running note at the bottom titled "Open questions" for anything flagged as unresolved. Remove items from it only when I confirm they're resolved — don't quietly drop a flagged item just because a later edit touched the same area.

First draft only — don't add the "Open questions" note until there's actually something unresolved to put in it.

IF I EDIT THE CANVAS DIRECTLY
If I make a change directly in the canvas myself between your turns rather than asking you to, treat that as the new authoritative version of that section going forward — don't revert it back toward your own earlier draft on a later, unrelated edit request just because your version of that paragraph is still what you generated originally.

WHEN A REQUESTED EDIT WOULD BE BETTER SOLVED STRUCTURALLY
If an edit request would be cleaner solved by reordering two sections rather than rewriting the sentence I pointed to, say so and propose it rather than forcing an awkward sentence-level fix just to stay within the literal scope of what I asked — but don't make the structural change without me confirming first, since that's a bigger change than the one I actually requested.

RUNNING CHANGE LOG
Keep a short, separate running log at the very bottom (below "Open questions") noting which section changed on which request, in one line each, so I can scan back through the edit history without having to remember every request I made across a long session.`,
    variables: [
      {
        name: 'document_type',
        description: 'What kind of document this is.',
        example: 'a one-page internal proposal',
        required: true,
      },
      {
        name: 'topic',
        description: 'What the document is about.',
        example:
          'switching our team from weekly status meetings to async written updates',
        required: true,
      },
      {
        name: 'audience',
        description:
          'Who will read and eventually approve or push back on this document.',
        example: 'my manager and two peer team leads',
        required: true,
      },
      {
        name: 'target_length',
        description: 'A rough length ceiling.',
        example: 'under 500 words',
        required: false,
      },
      {
        name: 'structure_outline',
        description: 'The section structure you want the draft to follow.',
        example:
          'problem, proposed change, tradeoffs, what we will measure after 30 days',
        required: true,
      },
    ],
    targetTools: ['Gemini Canvas', 'Gemini app'],
    tags: [
      'canvas',
      'collaborative-editing',
      'docs',
      'revision-workflow',
      'document-drafting',
    ],
    whyItWorks:
      "Canvas is a persistent, directly editable document object rather than a fresh chat reply generated each turn, which is precisely what makes the scoped-edit rule necessary: the common canvas failure mode is a 'revise this paragraph' request triggering a full regeneration of the document that silently overwrites hand-edits you made directly in the canvas since the last turn, because the model has no built-in reason to treat the current canvas state as more authoritative than its own memory of what it last generated. Scoping every edit to the section pointed at, and showing only what changed, keeps the document's edit history legible instead of forcing you to diff the whole thing after every single request just to confirm nothing else moved. The conflict-flagging rule catches a specific cross-reference problem — a number or claim changed in one place but still quoted elsewhere in the doc — that a full-document regeneration would typically paper over by rewriting both instances inconsistently, or worse, only one of them, leaving a document that now silently contradicts itself in a way that's easy to miss on a skim-read. The running open-questions note matters because a canvas document accumulates edits across many turns, and without a persistent place to track what's still unresolved, an early flagged concern can quietly disappear from view the moment a later, unrelated edit touches a nearby paragraph — the note is the one place that survives edits by design, specifically so nothing gets silently dropped just because attention moved elsewhere. Treating a direct hand-edit made in the canvas as the new authoritative version, rather than something that might get reverted on a later generation, matters because canvas is a shared, two-way editable surface — a human edit made outside the chat interface is real, deliberate, and often the exact fix a subsequent 'revise this' request was working around, and a regeneration that quietly reverts it toward the model's own earlier phrasing effectively undoes work the person just did themselves, without any indication that happened. The running change log addresses a different problem than the open-questions note: across a genuinely long editing session with many small scoped requests, it becomes hard for a person to reconstruct which specific request produced which specific change, and a one-line-per-edit log turns that into something scannable instead of something that requires re-reading the whole conversation history to reconstruct.",
    verifiedAgainst: [
      { tool: 'Gemini Canvas', version: 'Gemini 3 Pro', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Gemini Canvas on Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'gemini-live-camera-realtime-troubleshooting',
    category: 'gemini',
    title:
      "Get real-time, hands-on guidance through Gemini Live's camera while you're mid-task",
    description:
      "A prompt for Gemini Live's camera-sharing mode that sets up real-time, step-by-step guidance for a physical hands-on task — repairing, assembling, or troubleshooting something in front of you — so the assistant reacts to what your camera actually shows instead of guessing from a text description of the problem.",
    promptText: `I'm sharing my camera with you live. I'm in the middle of: {{task_description}}

WHAT I HAVE IN FRONT OF ME
{{available_reference}}

HOW TO GUIDE ME
{{guidance_style}}

WHEN YOU CAN'T TELL WHAT YOU'RE LOOKING AT
{{uncertainty_handling}}

SAFETY
{{stop_conditions}}

INSTRUCTIONS
1. Give me one instruction at a time, based on what you can actually see right now — not a full list of steps up front that assumes I can hold every step in mind while my hands are busy and the camera is pointed at the part, not at a screen.
2. Wait for me to confirm I've done the step, or to show you the result on camera, before giving the next instruction. Don't advance just because a reasonable amount of time has passed.
3. If what you see doesn't match what the next step in a typical process for this task would expect, say so explicitly and ask a clarifying question rather than proceeding as if everything matches your expectation.
4. Narrate what you're actually seeing before giving an instruction based on it, so I can catch it immediately if you've misidentified a part or a state — don't just give the instruction and let me discover the mismatch after I've already acted on it.
5. If I tell you something went wrong, stop the sequence and ask what specifically happened before suggesting a next step — don't guess at the failure and route around it silently.

IF LIGHTING OR ANGLE MAKES SOMETHING GENUINELY HARD TO ASSESS
Rather than issuing an instruction based on a low-confidence read of the camera feed, tell me specifically what to do to improve the view — move closer, angle the camera differently, turn on more light — before continuing, rather than proceeding on a guess and correcting course later once the mistake is already visible in what I've done.

IF I ASK YOU TO SKIP A STEP
If I say I want to skip a step in the sequence, ask why before agreeing, since skipping a step in a physical assembly or repair process can sometimes make a later step impossible or unsafe in a way that isn't obvious until you're already past the point where it mattered — a quick check-in here costs a few seconds and can save having to undo several completed steps.

END-OF-TASK CHECK
Once the last step is complete, ask me to show the finished result on camera and do a final visual check against what a correct outcome should look like, rather than assuming success just because we reached the end of the instruction sequence without an error being reported.`,
    variables: [
      {
        name: 'task_description',
        description: 'The physical task you are doing right now.',
        example:
          "reassembling a stand mixer after replacing the drive belt, using the manufacturer's manual as reference",
        required: true,
      },
      {
        name: 'available_reference',
        description: 'Any reference material you have on hand.',
        example: 'I have the printed manual open to page 4, which shows the part order.',
        required: false,
      },
      {
        name: 'guidance_style',
        description: 'How you want the pacing of instructions to work.',
        example:
          'one step at a time — tell me the next single action, wait for me to say done or show you the result, then give the next one',
        required: true,
      },
      {
        name: 'uncertainty_handling',
        description: 'What should happen when the camera view is unclear or ambiguous.',
        example:
          "if you can't clearly see the part I'm holding up, or the angle is wrong, say so and ask me to reposition rather than guessing which part it is",
        required: true,
      },
      {
        name: 'stop_conditions',
        description:
          'Physical-safety situations that should halt the sequence immediately.',
        example:
          "if at any point what you see suggests I'm about to do something that could damage the part or injure me — a sharp edge, a spring under tension, exposed wiring — stop and flag it before giving the next instruction",
        required: true,
      },
    ],
    targetTools: ['Gemini Live', 'Gemini app'],
    tags: [
      'gemini-live',
      'multimodal',
      'real-time',
      'troubleshooting',
      'camera-input',
      'voice-interaction',
    ],
    whyItWorks:
      "Gemini Live's camera-sharing mode processes the live video feed continuously rather than a single static photo, so it can react to what changes between 'here's the part' and 'here's where I placed it' — a one-shot photo prompt can only ever assess a single frozen frame, which is the wrong shape for a task that's inherently a sequence of changing physical states, one instruction genuinely depending on the outcome of the last. One-step-at-a-time pacing matches how the interaction actually has to work in practice: a full instruction list given up front assumes you can hold every step in mind while your hands are occupied and the camera is pointed at the part instead of at a screen, whereas waiting for explicit confirmation before advancing keeps the guidance synchronized with your actual physical progress instead of racing ahead of where you actually are. The instruction to narrate what it's seeing before giving an instruction based on it directly targets a real and specific risk with live camera guidance: a confidently wrong identification of which part you're holding, stated as fact and immediately followed by an instruction, can send you one step further down a wrong assembly path before anyone notices — narrating the observation first gives you a chance to correct a misidentification before it becomes an acted-on instruction, rather than after. The explicit stop-condition rule exists because this use case has a physical-harm dimension a purely informational prompt doesn't carry — flagging a tensioned spring or an exposed wire before advancing to the next instruction is the actual safety mechanism doing real work here, not a legal disclaimer bolted onto the end of a response after the fact. Asking for a better camera angle rather than proceeding on a low-confidence read is a direct extension of the same principle that governs the rest of this prompt: a live video assistant that guesses through a poor view to keep the pace moving trades a few seconds of friction for the much larger cost of an instruction based on a misread part, which in a physical task can mean redoing several already-completed steps. The end-of-task visual check closes a specific gap that a purely sequential instruction-and-confirm loop leaves open — reaching the final step without an error being reported only means nothing visibly went wrong along the way, not that the actual physical outcome is correct, and those are different claims that a live camera check can distinguish in a way a simple 'done' confirmation from the person cannot.",
    verifiedAgainst: [
      { tool: 'Gemini Live', version: 'Gemini 3 Pro', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Gemini Live camera mode on Gemini 3 Pro during a physical appliance-repair task.',
      },
    ],
  },
  {
    slug: 'gemini-structured-json-schema-extraction',
    category: 'gemini',
    title: 'Force reliable structured JSON out of messy unstructured text, every time',
    description:
      "A controlled-generation prompt for the Gemini API's structured output mode that defines an explicit response schema so every call returns the same JSON shape regardless of how messy or inconsistently formatted the input text is, instead of an LLM-shaped JSON-ish string that needs a try/catch around every parse.",
    promptText: `TASK
{{extraction_task}}

INPUT TEXT
{{input_text}}

SCHEMA CONTRACT
Extract exactly these fields for every record, no more and no fewer: {{schema_fields}}

FIELD RULES
- Every field must be present in every record, even when there is nothing to extract for it — use the specified null/default rather than omitting the field.
- {{missing_field_policy}}
- {{enum_strictness}}
- Do not add commentary, an introductory sentence, or a trailing explanation outside the structured output — the schema contract above is the entire contents of a valid response, nothing else.

WHAT TO DO WITH AMBIGUOUS INPUT
If a single input record genuinely contains information for what should be two separate records (for example, one email requesting both a return and a separate unrelated complaint), split it into two records rather than merging mismatched information into one, and note the split has happened via whatever notes/flag field the schema provides for it.

CONSISTENCY ACROSS RECORDS
Apply the exact same interpretation of each field and each enum value to every record in this batch — if you'd classify a given phrase as "frustrated" sentiment in record 3, classify the same phrase the same way if it appears again in record 27. Don't let earlier or later records in the batch shift your calibration.

HANDLING RECORDS THAT DON'T FIT ANY SCHEMA FIELD WELL
If a record is genuinely too garbled, too short, or too off-topic to extract meaningful values for most fields, don't force plausible-looking values into every field anyway — populate what's genuinely extractable, set the rest to their null/default per the missing-field policy, and if the schema includes a review flag, set it so a human knows this record needs a manual look rather than trusting the automated extraction for it.

MULTI-LANGUAGE INPUT
If the batch includes records in more than one language, extract and classify consistently regardless of the source language — don't let sentiment or category classification become less reliable for non-English records than for English ones just because the underlying text differs; if you genuinely can't classify a non-English record with the same confidence, flag it via the review field rather than silently guessing.

VALIDATION BEFORE RETURNING
Before returning the final output, check your own result against the schema contract one more time: every record has every declared field, every enum value is one of the declared options, and no field contains a type mismatch (a string where a boolean was declared, for instance). This is a self-check, not optional — treat a self-caught schema violation the same as one a downstream validator would catch, and fix it before returning rather than after.

OUTPUT
Return only the structured data conforming to the schema contract above — one entry per record, in the order the input records appeared.`,
    variables: [
      {
        name: 'extraction_task',
        description: 'What is being extracted and why.',
        example:
          'extract structured order details from free-text customer support emails',
        required: true,
      },
      {
        name: 'input_text',
        description: 'The batch of unstructured text records to extract from.',
        example:
          "a support inbox export of 40 emails, each requesting a return, exchange, or refund in the customer's own words",
        required: true,
      },
      {
        name: 'schema_fields',
        description:
          'The exact field names, types, and enum values expected in every record.',
        example:
          'order_id (string or null), request_type (enum: return, exchange, refund, other), reason (short string), sentiment (enum: neutral, frustrated, angry), requires_human_review (boolean)',
        required: true,
      },
      {
        name: 'missing_field_policy',
        description: 'What to do when a field genuinely has no value in the source text.',
        example:
          'Set the field to null rather than guessing a plausible value, and only set requires_human_review to true if the email is genuinely ambiguous about request_type.',
        required: true,
      },
      {
        name: 'enum_strictness',
        description:
          'How to handle a value that does not cleanly map to a declared enum option.',
        example:
          'If a value doesn\'t cleanly map to one of the listed enum options, use "other" and add a one-line note explaining what it actually was — never invent a new enum value on the fly.',
        required: true,
      },
    ],
    targetTools: ['Gemini API', 'Vertex AI'],
    tags: [
      'structured-output',
      'json-schema',
      'controlled-generation',
      'data-extraction',
      'api',
      'batch-processing',
    ],
    whyItWorks:
      "The Gemini API's controlled generation (a declared response schema plus a JSON-only response mode) constrains the token-generation process itself to match the declared shape, which is mechanically different from asking a model in plain prose to 'return JSON' and hoping the output happens to parse — schema-constrained generation cannot emit a field name it wasn't told about or a value outside a declared enum, whereas prose-requested JSON routinely drifts (a trailing comma, an extra explanatory sentence before the object, a field renamed slightly between calls) in exactly the way that breaks a downstream JSON.parse call once it's actually running against real, messy production input instead of a clean test example. Declaring an explicit null-vs-guess policy for missing fields matters because an unconstrained extraction task will often fill a genuinely absent field — an order ID never mentioned in the email — with a plausible-looking placeholder rather than admit the information isn't there, and a downstream system consuming that field has no way to distinguish a real ID from a fabricated one unless the model is explicitly told that null is an acceptable, preferred answer over a guess. Routing unmappable values to an 'other' enum plus a free-text note, instead of letting the model invent a new enum value on the fly, keeps every downstream consumer's switch statement exhaustive and safe — a silently invented enum value is the kind of bug that doesn't surface in testing, only later, in production, against a real customer email nobody wrote a test case for. The explicit consistency-across-records instruction targets a specific batch-processing failure: without it, a model's threshold for what counts as 'frustrated' versus 'angry' sentiment can drift subtly across a long batch as it processes more examples, producing a dataset where the same underlying tone gets labeled two different ways depending on where in the batch it happened to appear.",
    exampleOutput:
      '[\n  {"order_id": "ORD-88213", "request_type": "refund", "reason": "item arrived damaged", "sentiment": "frustrated", "requires_human_review": false},\n  {"order_id": null, "request_type": "other", "reason": "asking about a delivery delay, not a return or refund", "sentiment": "neutral", "requires_human_review": true}\n]',
    verifiedAgainst: [
      { tool: 'Gemini API', version: 'Gemini 3 Pro', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial publish, verified against the Gemini API structured output mode on Gemini 3 Pro over a 40-email batch.',
      },
    ],
  },
  {
    slug: 'gemini-thinking-mode-constraint-planning',
    category: 'gemini',
    title:
      "Use Gemini's extended reasoning to solve a real multi-constraint scheduling problem",
    description:
      "A prompt structured for Gemini's extended-thinking reasoning mode that states every hard constraint and every soft preference explicitly for a genuinely constrained planning problem, so the model's reasoning step actually checks candidate solutions against all of them instead of producing a plausible-looking schedule that quietly violates one.",
    promptText: `PROBLEM
{{planning_problem}}

HARD CONSTRAINTS (a violated one makes the whole schedule invalid)
{{hard_constraints}}

SOFT PREFERENCES (optimize for these on a best-effort basis, but never at the expense of a hard constraint)
{{soft_preferences}}

PEOPLE AND DATA
{{people_and_constraints_data}}

INSTRUCTIONS
1. Think through this as a genuine constraint-satisfaction problem, not a single confident pass — generate a candidate schedule, then actively try to find a way it fails before presenting it.
2. {{verification_requirement}}
3. If you find a hard constraint violation during verification, don't patch just the one broken slot in isolation — re-check whether your fix creates a new violation elsewhere, since a schedule this constrained often has fixes that ripple.
4. If a genuinely impossible combination of hard constraints exists, — for example, everyone who could cover a specific weekend is on vacation that same weekend — say so explicitly rather than silently violating one constraint to produce a schedule that looks complete. Naming the actual conflict is more useful than a schedule I'd have to re-verify myself before trusting it.
5. Once you have a schedule that passes every hard constraint, note how well it satisfies the soft preferences and where it fell short, so I know what a human might want to adjust by hand.

IF THE FIRST CANDIDATE SCHEDULE FAILS VERIFICATION
Don't discard the whole candidate and start over from scratch by default — first check whether a small, targeted adjustment to the specific slot that failed resolves it without touching anything else, since a full restart risks losing soft-preference balance you'd already achieved elsewhere in the schedule. Only rebuild from scratch if a targeted fix genuinely isn't possible given the constraints.

EXPLAINING TRADE-OFFS, NOT JUST STATING THE RESULT
Where you had to choose between two soft preferences that couldn't both be fully satisfied (balancing hours evenly versus avoiding a repeated pairing), say which one you prioritized and why, so a human reviewing the schedule understands the trade-off that was made rather than just seeing the outcome without the reasoning behind it.

IF THE PROBLEM IS UNDERSPECIFIED
If the data provided leaves a genuine gap that affects the schedule (a ninth person mentioned in passing with no stated vacation dates), ask for the missing detail before proceeding rather than silently assuming a default that could be wrong.

OUTPUT FORMAT
The final schedule as a clear table. Below it: a section titled "Verification" showing each hard constraint from above and a one-line confirmation of how the final schedule satisfies it, a "Trade-offs" section explaining any soft-preference conflicts and how they were resolved, plus a short note on any soft preference it didn't fully achieve and why.`,
    variables: [
      {
        name: 'planning_problem',
        description: 'The actual scheduling or planning problem to solve.',
        example: 'building a two-week on-call rotation for an 8-person engineering team',
        required: true,
      },
      {
        name: 'hard_constraints',
        description: 'Every rule that must never be violated.',
        example:
          'no one is on-call two weekends in a row; nobody is scheduled during their stated vacation dates; every shift needs exactly one primary and one secondary',
        required: true,
      },
      {
        name: 'soft_preferences',
        description: 'What to optimize for, but which can be traded off if needed.',
        example:
          'try to balance total on-call hours roughly evenly across the 8 people over the two weeks, and avoid putting the same two people on together twice if it can be avoided',
        required: true,
      },
      {
        name: 'people_and_constraints_data',
        description:
          'The real people and their real specific constraints, as concrete data.',
        example:
          'the 8 names, each with their specific vacation dates and any standing preference already noted (e.g., Priya prefers not to be primary on weekends)',
        required: true,
      },
      {
        name: 'verification_requirement',
        description:
          'The explicit instruction to check the candidate solution against every constraint.',
        example:
          "After producing a candidate schedule, explicitly check it against every hard constraint listed above, one by one, and only present it as final if all of them pass — if one fails, revise and recheck rather than presenting a schedule you haven't actually verified.",
        required: true,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'reasoning',
      'constraint-satisfaction',
      'scheduling',
      'planning',
      'extended-thinking',
    ],
    whyItWorks:
      "Extended-thinking mode gives the model room to explore and backtrack from candidate solutions before committing to a final answer, which is exactly the shape a real constraint-satisfaction problem needs — a single-pass answer tends to satisfy the constraints stated earliest and most prominently while quietly dropping one stated later in the prompt, because token generation is sequential and doesn't naturally re-check earlier choices against a constraint introduced afterward without being explicitly told to loop back and verify. Explicitly separating hard constraints from soft preferences matters because they need genuinely different handling: a violated hard constraint invalidates the whole schedule and must trigger a revision, while a soft preference is something to optimize for only on a best-effort basis — collapsing both into one undifferentiated list of 'things to consider' is what produces a schedule that looks pretty good overall but has silently broken a rule that was never actually optional. The explicit verification step — checking the candidate schedule against every hard constraint one by one after generating it — forces a second, distinct reasoning pass dedicated purely to falsification, rather than trusting that the generation process already accounted for everything correctly; this catches the specific and common failure where a schedule looks locally reasonable shift by shift but violates a constraint only visible when checked against the full two-week picture at once, like the same person landing on two consecutive weekends. Providing the actual people, their real vacation dates, and any standing preferences as concrete data — rather than an abstracted version of the problem — is what makes the reasoning verifiable against ground truth at all: a schedule can only be checked against 'nobody works during their vacation' if the vacation dates are stated as facts the model can point back to during its own verification pass, not left implicit.",
    exampleOutput:
      'Verification: (1) No consecutive weekends — checked, no person repeats on adjacent weekends. (2) Vacation dates respected — checked against all 8 stated ranges, no conflicts. (3) One primary + one secondary per shift — checked, all 14 shifts covered.\n\nSoft preference note: hours are balanced within 4 hours of each other across the team, except Priya, who has 6 fewer hours than average because her vacation removed one full weekend of availability — flagging this as the one imbalance a human might want to address in the next rotation.',
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against Gemini 3 Pro extended-thinking mode on an 8-person on-call rotation problem.',
      },
    ],
  },
]
