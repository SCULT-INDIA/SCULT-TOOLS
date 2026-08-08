import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'gemini-long-context-multi-document-synthesis',
    category: 'gemini',
    title: 'Synthesize hundreds of pages of scattered documents into one decision memo',
    description:
      "A long-context prompt for Gemini's 1M+ token window that reads every document dropped into the chat as one connected body of evidence and returns a single decision memo instead of a stack of disconnected summaries.",
    promptText: `I'm giving you {{document_count}} documents in this conversation (pasted or uploaded) about {{decision_topic}}. Read all of them as a single connected body of evidence before you write anything — don't summarize them one at a time.

CONTEXT
Decision to be made: {{decision_topic}}
Audience for the memo: {{audience}}

INSTRUCTIONS
1. Read every document fully before drafting. If any document appears truncated or you could not read all of it, say so explicitly before continuing — don't silently summarize a partial read as if it were complete.
2. Build one shared fact base across all documents. Note the source (file name or document title) next to every fact you use.
3. Flag every place where two or more documents disagree, contradict each other, or give different numbers for the same thing. Don't quietly pick one number and drop the other.
4. Group findings under: {{memo_sections}}
5. End with a "What's still unclear" section listing questions the documents don't answer — don't invent an answer to fill the gap.

OUTPUT FORMAT
A memo, not a list of summaries — {{target_length}}, written for {{audience}}, with inline source citations like (Source: filename, page/section if visible).`,
    variables: [
      {
        name: 'document_count',
        description: 'How many documents you are pasting or uploading into the chat.',
        example: '7',
        required: true,
      },
      {
        name: 'decision_topic',
        description: 'The decision this synthesis needs to support.',
        example: 'whether to renew or switch our warehouse management vendor',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who will read the memo, so the framing and detail level match.',
        example: 'the ops leadership team, none of whom read the underlying contracts',
        required: true,
      },
      {
        name: 'memo_sections',
        description: 'The section headers you want the findings grouped under.',
        example:
          'Cost comparison, Contract risk, Integration effort, Vendor track record',
        required: true,
      },
      {
        name: 'target_length',
        description: 'A rough length ceiling so the memo stays skimmable.',
        example: 'no more than two pages',
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
    ],
    whyItWorks:
      "Gemini's long-context window can hold every source document in the same context at once, which is the whole point of using it here — a synthesis built from documents summarized one at a time in separate turns loses the ability to notice that Document 3's number contradicts Document 5's, because by the time it reads Document 5 it never re-reads Document 3 closely. Reading everything in one pass keeps that cross-document comparison possible. The explicit instruction to flag contradictions instead of resolving them matters because long-context models have a documented tendency to quietly average or pick between conflicting numbers rather than surface the conflict, which hides exactly the information a decision-maker needs. The partial-read disclosure requirement guards against the failure mode where a very long or malformed upload gets truncated silently and the model summarizes what it saw as if it were the whole document.",
    exampleOutput:
      "DECISION MEMO — Warehouse Vendor Renewal\n\nCost comparison: Current vendor quotes $4.20/unit (Source: renewal_quote.pdf), incumbent contract cites $3.95/unit for the same tier (Source: original_msa.pdf, §4.2) — these two documents disagree on the current effective rate; worth confirming which is live before deciding.\n\nContract risk: 90-day termination notice required (Source: original_msa.pdf, §9)...\n\nWhat's still unclear: None of the seven documents state the actual current inventory volume, so the cost comparison above is per-unit only, not a total spend projection.",
    verifiedAgainst: [
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-06-12' },
      { tool: 'Gemini', version: 'Gemini 3 Flash', date: '2026-06-19' },
    ],
    changelog: [
      {
        date: '2026-06-12',
        note: 'Initial publish, verified against Gemini 3 Pro with a 7-document synthesis.',
      },
    ],
  },
  {
    slug: 'gemini-video-analysis-structured-notes',
    category: 'gemini',
    title: 'Turn an uploaded video into timestamped notes and action items',
    description:
      "A native multimodal prompt for Gemini's video understanding that returns timestamped highlights, decisions, and action items instead of a flat transcript of everything said.",
    promptText: `Watch the video I've uploaded above. This is {{video_description}}, roughly {{video_length}}.

Don't just transcribe it — extract the structure.

OUTPUT
1. A timestamped list of the {{number_of_moments}} most important moments (format: [mm:ss] — what happens/what's said), covering: {{focus_areas}}
2. Every decision made or commitment stated on camera, with the timestamp and who said it, if identifiable.
3. Every action item mentioned, with an owner (if named) and any deadline mentioned.
4. Anything said that contradicts something said earlier in the same video — with both timestamps.
5. If the audio is unclear or a section is inaudible, mark it as [unclear ~mm:ss] rather than guessing at words.

Skip filler, small talk, and restated points — only {{focus_areas}} matters for this pass.`,
    variables: [
      {
        name: 'video_description',
        description: 'What the video is, so Gemini knows what kind of content to expect.',
        example: 'a 40-minute recording of our Q3 planning meeting',
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
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: [
      'video-analysis',
      'multimodal',
      'meeting-notes',
      'timestamps',
      'transcription',
    ],
    whyItWorks:
      "Gemini processes uploaded video as sampled frames plus audio together, not audio-only through a separate speech-to-text pass, so it can anchor output to visual timestamps and reference what's shown on screen, not just what's said. Asking for structure instead of a transcript matters because a flat transcript of a 40-minute meeting is barely more useful than the video itself — naming focus_areas up front stops the model from treating every restated point as equally important. The [unclear ~mm:ss] instruction directly targets a real failure mode: video with noisy audio or overlapping speakers gets transcribed with confident-sounding words that were never actually said, and marking those spans instead of guessing keeps the notes trustworthy enough to act on.",
    exampleOutput:
      '[04:12] — Priya proposes moving the Q4 launch from Nov 3 to Nov 17; no objection recorded.\n[11:40] — Decision: engineering headcount request tabled until next planning cycle (stated by Marcus).\n[unclear ~22:15] — cross-talk, can\'t confirm who raised the budget concern.\nAction items: Priya to send revised launch timeline by Friday (no year stated — assumed current).\nContradiction: at [04:12] the launch date moves to Nov 17, but at [31:02] someone references "the Nov 3 launch" — flagging for clarification.',
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-05-20' }],
    changelog: [
      {
        date: '2026-05-20',
        note: 'Initial publish, verified against Gemini 3 Pro on a 40-minute meeting recording.',
      },
    ],
  },
  {
    slug: 'gemini-deep-research-report-brief',
    category: 'gemini',
    title: 'Turn a rough research question into a fully sourced Deep Research report',
    description:
      "A research brief written specifically for Gemini's Deep Research agent — scope, source priorities, and structure spelled out — instead of a one-line question that produces a shallow, aggregator-sourced report.",
    promptText: `Use Deep Research for this. Here's the scope — don't loosen it once you're running.

RESEARCH QUESTION
{{research_question}}

MUST COVER
{{must_cover_angles}}

SOURCE PREFERENCES
Prioritize: {{source_preferences}}
Treat these only as context, not primary evidence — mention them only if you're also verifying the claim elsewhere: {{low_trust_sources}}

OUT OF SCOPE
{{excluded_angles}} — don't wander into these even if a source brings them up.

BEFORE YOU FINALIZE
- Open primary sources where possible (original studies, filings, official documentation), not just aggregator summaries of them.
- Where sources disagree, say so and name both positions instead of picking the one that sounds more authoritative.
- Note the publication date of anything time-sensitive — don't present an older figure as current without flagging it.

OUTPUT
Structure the report as: {{output_structure}}
End with a sources list, each one labeled by how you used it (primary evidence / context / disputed claim).`,
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
        example: 'marketing blog posts and unverified Reddit/forum claims',
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
      'Deep Research runs an autonomous plan-search-read-revise loop rather than answering from a single pass, and that loop is steerable by what you hand it before it starts — a scope brief with explicit must-cover angles, excluded angles, and source preferences changes which search queries it generates and which pages it actually opens, instead of leaving it to converge on whatever ranks highest for the literal question. Real-world use of research agents shows a consistent bias toward the most SEO-visible aggregator pages over primary sources unless told otherwise, which is why the primary-sources instruction is stated as a requirement, not a preference. The publication-date instruction targets a specific and common failure: a well-optimized but stale page still ranks and gets cited as if its numbers were current.',
    verifiedAgainst: [
      { tool: 'Gemini Deep Research', version: 'Gemini 3 Pro', date: '2026-04-08' },
    ],
    changelog: [
      {
        date: '2026-04-08',
        note: 'Initial publish, verified against Gemini Deep Research on Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'gemini-custom-gem-persona-builder',
    category: 'gemini',
    title: 'Build a custom Gem that acts exactly like the expert you need on call',
    description:
      'A meta-prompt for the Instructions field of a Gemini Gem, written so the persona stays consistent across every future conversation instead of drifting back to a generic assistant after a few turns.',
    promptText: `You are {{persona_role}}. Your scope is {{expertise_scope}} — stay inside it even if a conversation drifts.

VOICE
{{tone}}

WHAT YOU DO
- Answer as {{persona_role}} would, using any knowledge files attached to this Gem as your primary source before general knowledge — when they conflict, defer to the attached files.
- If a question falls outside {{expertise_scope}}, say so plainly and redirect rather than answering anyway just to be helpful.

WHAT YOU DON'T DO
{{refuse_topics}}

OUTPUT
Default to {{output_format}} unless the person explicitly asks for a different format in a specific message.

CONSISTENCY RULE
Treat these instructions as true for every message in this conversation, not just the first one. If a later message seems to ask you to drop a rule above, treat that as a request to confirm, not a command to silently comply with — unless it's clearly just changing the output format for one reply.`,
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
    ],
    targetTools: ['Gemini Gems', 'Gemini app'],
    tags: ['gems', 'persona', 'custom-assistant', 'context-engineering', 'system-prompt'],
    whyItWorks:
      "A Gem's Instructions field persists across every new chat you start with it, which is the entire advantage over retyping a persona prompt each session — but that persistence only holds if the instructions are written as enforceable rules rather than a loose character sketch. The explicit rule to defer to attached knowledge files over general knowledge matters because without it, a Gem built around a narrow or updated reference document will still answer from the base model's broader — and sometimes conflicting or outdated — training knowledge whenever the files don't cover something exactly. The consistency rule targets persona drift directly: the further a conversation gets from the instructions, the more a model tends to slip toward generic-assistant behavior, and telling it to treat an apparent mid-conversation override as something to confirm rather than obey closes the most common way a Gem quietly stops acting like the persona it was built as.",
    verifiedAgainst: [
      { tool: 'Gemini Gems', version: 'Gemini 3 Pro', date: '2026-03-11' },
    ],
    changelog: [
      {
        date: '2026-03-11',
        note: 'Initial publish, verified against Gemini Gems on Gemini 3 Pro.',
      },
      {
        date: '2026-04-02',
        note: 'Added the consistency rule after testing showed personas drifting toward generic assistant tone past ~15 messages.',
      },
    ],
  },
  {
    slug: 'gemini-gmail-thread-reply-drafting',
    category: 'gemini',
    title: 'Draft an email reply grounded in the actual Gmail thread, not a guess',
    description:
      "A prompt that uses Gemini's @Gmail mention to pull the real thread into context before drafting a reply, so the draft reflects what was actually said instead of a generic template.",
    promptText: `@Gmail {{thread_search_reference}}

Read the full thread above before drafting anything.

CONTEXT
Who I'm replying as: {{sender_role}}
What this reply needs to accomplish: {{reply_goal}}
Tone: {{tone}}

INSTRUCTIONS
1. Summarize in one line what the other person is actually asking for or waiting on — if that's unclear from the thread, say so instead of guessing.
2. Reference at least one specific thing they said in the thread — don't write a reply that could apply to any email.
3. Draft the reply. {{must_include}}
4. Don't commit to anything not explicitly authorized here: {{do_not_commit_to}}
5. Keep it to {{length_constraint}}.

Give me just the draft — I'll review before sending.`,
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
      "The @Gmail mention grounds the draft in the actual retrieved thread text rather than a description of it, which is why the prompt requires quoting something specific back — a draft that could be sent to any email means the model drafted from the reply_goal alone and ignored the grounded thread content. The do_not_commit_to boundary exists because a model with read access to a real negotiation thread will sometimes draft a reply that sounds reasonable but concedes something (a deadline, a discount, a term) that was never actually approved — naming the exact things it can't offer keeps the draft inside your actual authority. Ending with 'I'll review before sending' is a deliberate human-in-the-loop step: this prompt produces a draft for a real Gmail send action, which should never go out unreviewed.",
    exampleOutput:
      "Hi Daniela,\n\nThanks for the note — happy to confirm we can hold the renewal at the $18,400 rate you mentioned. On the 30-day payment terms, I want to flag that we're not able to move off our standard 45-day terms this cycle, so let's keep that as-is for now.\n\nI'll get the updated contract over to you by Friday. Let me know if the terms above work and we'll get this locked in.\n\nBest,\n[name]",
    verifiedAgainst: [
      { tool: 'Gemini in Gmail', version: 'Gemini 3 Pro', date: '2026-05-04' },
    ],
    changelog: [
      {
        date: '2026-05-04',
        note: 'Initial publish, verified against Gemini in Gmail on Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'gemini-sheets-data-analysis-insight-brief',
    category: 'gemini',
    title: 'Turn a raw Google Sheet into a plain-English insight brief',
    description:
      "A prompt that uses Gemini's @Sheets mention to analyze real spreadsheet data in place and return a structured insight brief with numbers attached, instead of a vague 'looks fine' summary.",
    promptText: `@Sheets {{sheet_reference}}

Analyze the data in this sheet, specifically {{relevant_range_or_tabs}}.

QUESTIONS TO ANSWER
{{business_questions}}

INSTRUCTIONS
1. State how many rows/columns you actually read, so I know if you saw the whole sheet or just a preview.
2. Identify the {{number_of_trends}} most significant trends or outliers, referencing exact column names and row ranges — not just "some values look high."
3. Flag any data quality issues you notice (blank cells, inconsistent formats, likely typos) before drawing conclusions from that data.
4. For each finding, state the actual numbers behind it, not just a qualitative claim.
5. End with {{number_of_recommendations}} concrete next actions someone could take from this data, each tied to a specific finding above.

Don't invent a trend from too few data points — if a pattern is based on fewer than {{minimum_sample_size}} rows, label it as low-confidence.`,
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
      "The @Sheets mention lets Gemini read live cell values rather than working from a description or a partial screenshot, so requiring it to state how many rows it actually read is a direct check against silent truncation on large sheets, which is the most common way a 'complete' analysis is actually based on the first visible page. Requiring exact numbers instead of qualitative claims ('some values look high') forces every finding to be independently checkable against the sheet rather than taken on faith. The minimum_sample_size rule specifically counters a well-documented LLM tendency to describe a pattern found in a handful of rows with the same confidence as one backed by hundreds — labeling thin evidence as low-confidence keeps the brief honest about what the data actually supports.",
    exampleOutput:
      'Read 342 rows across 8 columns (full sheet, no truncation).\n\nTrend 1: "Billing" tickets grew from 34/month (July) to 61/month (Sept) — a clear upward trend, high confidence (n=95 rows).\nTrend 2: Average response time for "Bug Report" tickets (14.2 hrs) is roughly double every other category (avg 7.1 hrs) — worth investigating triage routing.\nData quality: 11 rows have blank "Category" values — excluded from category-level trends above.\n\nRecommendation 1: Investigate why Billing ticket volume nearly doubled — check for a pricing or invoicing change in August.',
    verifiedAgainst: [
      { tool: 'Gemini in Sheets', version: 'Gemini 3 Pro', date: '2026-05-27' },
    ],
    changelog: [
      {
        date: '2026-05-27',
        note: 'Initial publish, verified against Gemini in Sheets on Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'gemini-whiteboard-photo-to-action-plan',
    category: 'gemini',
    title: 'Turn a photo of a whiteboard brainstorm into an organized action plan',
    description:
      'A multimodal prompt that reads the handwriting, arrows, and groupings in a photographed whiteboard and turns the visual structure — not just the words — into an organized, de-duplicated action plan.',
    promptText: `Look at the photo I've attached of {{whiteboard_description}}.

Read the actual spatial layout, not just the words — arrows, circles, groupings, and crossed-out items all carry meaning; don't flatten them into a random list.

INSTRUCTIONS
1. Transcribe everything legible first, noting anything you genuinely can't read as [illegible] rather than guessing a plausible-sounding word.
2. Reconstruct the groupings the way they're actually drawn on the board (circled clusters, boxes, arrows between items) — tell me what connects to what.
3. Treat anything crossed out or struck through as rejected, not as a live idea — list it separately under "Discarded."
4. Merge near-duplicate ideas written in different handwriting or different spots into one item, but tell me when you merged something.
5. Turn the surviving ideas into an action plan grouped by: {{grouping_scheme}}. Each action gets an owner placeholder and a rough priority ({{priority_scale}}).

Context that isn't visible on the board but matters here: {{additional_context}}`,
    variables: [
      {
        name: 'whiteboard_description',
        description: 'What the whiteboard session was about, to set expectations.',
        example: 'a 45-minute product roadmap brainstorm with the design and eng leads',
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
      "Gemini's multimodal image encoder reads spatial relationships directly from the pixels — what's circled, what an arrow connects, what's boxed together — rather than running OCR and discarding the layout, which is why the prompt explicitly demands the groupings be reconstructed 'the way they're drawn' instead of flattened into a list; a plain OCR-then-summarize approach loses exactly this structure. The [illegible] instruction targets a specific and common failure with handwriting photos: a blurry or ambiguous word gets confidently transcribed as the closest plausible-sounding word rather than flagged, which quietly corrupts an action item. Requiring crossed-out items to be filed as 'Discarded' rather than dropped or treated as live prevents rejected ideas from silently resurfacing in the final plan.",
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-02-16' }],
    changelog: [
      {
        date: '2026-02-16',
        note: 'Initial publish, verified against Gemini 3 Pro on a photographed whiteboard session.',
      },
    ],
  },
  {
    slug: 'gemini-canvas-scoped-collaborative-draft',
    category: 'gemini',
    title:
      "Draft and refine a document live inside Gemini's canvas without losing earlier edits",
    description:
      "A workflow prompt for Gemini's canvas-style collaborative document editor that scopes every revision request to a targeted diff, instead of a full regeneration that quietly discards prior edits.",
    promptText: `Open a canvas and draft {{document_type}} about {{topic}}, targeted at {{audience}}, roughly {{target_length}}.

Structure it as: {{structure_outline}}

Once you've drafted it, wait for my edit requests. For every edit request I give you after this:
1. Change only the section or sentence I point to — leave every other paragraph exactly as it is unless I say otherwise.
2. Show me what changed in that section; don't restate the whole document as if everything moved.
3. If my edit request would create a conflict with something stated elsewhere in the doc (a number, a claim, a name), flag the conflict before applying the edit rather than silently creating an inconsistent document.
4. Keep a one-line running note at the bottom titled "Open questions" for anything flagged as unresolved — remove items from it only when I confirm they're resolved.

First draft only — don't add the "Open questions" note until there's actually something unresolved.`,
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
      "Canvas is a persistent, directly editable document object rather than a fresh chat reply each turn, which is precisely what makes the scoped-edit rule necessary: the common canvas failure mode is a 'revise this paragraph' request triggering a full regeneration of the document that silently overwrites hand-edits you made directly in the canvas since the last turn. Scoping every edit to the section pointed at, and showing only what changed, keeps the document's edit history legible instead of forcing you to diff the whole thing after every request. The conflict-flagging rule catches a specific cross-reference problem — a number or claim changed in one place but still quoted elsewhere in the doc — that a full-document regeneration would typically paper over by just rewriting both instances inconsistently or, worse, only one of them.",
    verifiedAgainst: [
      { tool: 'Gemini Canvas', version: 'Gemini 3 Pro', date: '2026-03-25' },
    ],
    changelog: [
      {
        date: '2026-03-25',
        note: 'Initial publish, verified against Gemini Canvas on Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'gemini-multi-source-comparison-research',
    category: 'gemini',
    title:
      'Compare multiple competing sources side-by-side without losing the disagreements',
    description:
      'A long-context prompt that loads several full reports, reviews, or papers at once and produces a structured comparison table instead of a blended, opinion-free summary that hides where the sources actually disagree.',
    promptText: `I'm giving you {{number_of_sources}} sources about {{comparison_topic}}: {{source_list}}

Read each one in full before comparing. Build a comparison, not a summary.

COMPARISON TABLE
Rows: {{comparison_criteria}}
Columns: one per source (use the source name/title as the column header)
For each cell, give the source's actual position, with a short quote or paraphrase you could point back to — not your own averaged judgment.

AFTER THE TABLE
1. List every criterion where the sources actively disagree, not just differ in emphasis.
2. For each disagreement, note whether it looks like a factual dispute, a difference in scope/timeframe, or a difference in methodology — those need different responses from {{audience}}.
3. Don't resolve the disagreements for me by picking a "winner" unless I ask — flag them and stop.
4. Name anything relevant to {{decision_context}} that none of the sources address.`,
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
          "2024 meta-analysis in a peer-reviewed journal, a hospital patient-education page, a popular science book chapter, and a fitness influencer's long-form article",
        required: true,
      },
      {
        name: 'comparison_criteria',
        description: 'The specific dimensions to compare across sources.',
        example:
          'claimed metabolic effects, recommended fasting window, cited study population size, stated caveats/limitations',
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
          'whether this is safe to try alongside a existing type 2 diabetes management plan',
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
      "Loading every full source into the same long context window, rather than pre-summarizing each one in a separate pass, is what makes an honest comparison possible — a summary of a summary loses the specific claim, quote, or number needed to say precisely where two sources diverge. The explicit ban on picking a 'winner' unless asked directly counters the strongest pull on a long-context synthesis task: models tend to resolve conflicting inputs into one confident, harmonized answer, which reads well but erases the disagreement the person doing the comparison actually needs to see and weigh themselves. Classifying each disagreement as factual, scope-based, or methodological gives the reader a reason for the conflict, not just the fact that one exists — a factual dispute needs a tie-breaker source, a scope difference might mean both sources are simply correct for different situations.",
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-04-30' }],
    changelog: [
      {
        date: '2026-04-30',
        note: 'Initial publish, verified against Gemini 3 Pro comparing four sources across conflicting claims.',
      },
    ],
  },
  {
    slug: 'gemini-workspace-meeting-prep-brief',
    category: 'gemini',
    title:
      "Walk into a meeting already briefed, using only what's actually in your Workspace",
    description:
      "A prompt that chains Gemini's @-mentions across Gmail and Drive to assemble a meeting brief grounded in real threads and files, instead of generic prep questions that could apply to any meeting.",
    promptText: `I have a meeting about {{meeting_topic}} with {{attendees}} coming up on {{meeting_date}}.

Pull in and read through: @Gmail {{gmail_search_terms}} @Drive {{relevant_docs_or_files}}

Build a one-page brief:
1. Where things left off — the last concrete decision, question, or commitment from the most recent thread/doc, with its date.
2. Anything promised to {{attendees}} that hasn't been delivered yet, or vice versa, based only on what's in the threads/docs above.
3. Open questions that are still unanswered across everything you read — don't invent a resolution if you didn't find one.
4. {{number_of_questions}} sharp questions I should ask in this meeting, each one tied to a specific gap you found above, not a generic meeting question.

If you can't find enough in the sources above to answer part of this, say which part is missing rather than filling it with a plausible guess.`,
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
      "Chaining @Gmail and @Drive mentions in one prompt grounds the brief in content you actually have — the real thread history and the real draft document — rather than the model falling back on generic meeting-prep boilerplate like 'ask about timeline and budget,' which it will produce confidently even with zero relevant context. The instruction to name what's missing rather than fill a gap with a plausible guess addresses a specific risk of workspace-grounded assistants: partial retrieval (a thread that didn't fully load, a doc it couldn't open) can look identical to complete retrieval in the output unless the model is told to distinguish 'I found nothing on this' from 'here's what I found.' Tying each prep question to a specific gap, rather than asking for prep questions in the abstract, is what keeps the output from being four questions any prep-for-a-meeting prompt would produce regardless of the actual situation.",
    verifiedAgainst: [
      { tool: 'Gemini in Gmail', version: 'Gemini 3 Pro', date: '2026-06-05' },
    ],
    changelog: [
      {
        date: '2026-06-05',
        note: 'Initial publish, verified against Gemini in Gmail on Gemini 3 Pro, chained with a Drive file reference.',
      },
    ],
  },
  {
    slug: 'gemini-screenshot-to-frontend-code',
    category: 'gemini',
    title: 'Turn a UI screenshot into working frontend code',
    description:
      'A multimodal prompt that treats a screenshot as a literal spec — spacing, hierarchy, text, and visible states — and returns matching component code instead of a loose visual approximation.',
    promptText: `Here's a screenshot of {{ui_description}}. Build this as {{framework}} code.

Match, don't reinterpret:
1. Layout structure (what's in a row vs. stacked, alignment, spacing) as closely as the screenshot shows it.
2. Every visible text label, exactly as written, including button text and placeholder text.
3. Visible states — if a button looks disabled/active, a field looks focused, or there's a badge/count, include that state in the code; don't drop it because it's "just a detail."
4. Colors and type choices close to what's shown; use {{design_system_reference}} tokens/variables if it maps to one, otherwise use plain values and say so.

Constraints: {{tech_constraints}}

Where the screenshot is ambiguous (a cut-off edge, an icon you're not fully sure of, a hover state you can't see), say what's ambiguous instead of silently inventing a specific value.

Output: {{output_format}}`,
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
      "Gemini's multimodal vision path reads the screenshot's actual pixel layout — spacing, alignment, proportional sizing — directly, rather than working from a text description of the design, which is what makes 'match, don't reinterpret' an enforceable instruction rather than wishful thinking; without it, the model tends to substitute its own aesthetic defaults for the ones actually shown (different spacing scale, a component pattern it's seen more often in training). Explicitly requiring visible states (disabled, focused, badge counts) to be included counters the tendency to treat a screenshot as a static mockup of the 'happy path' only and quietly drop states that would otherwise need separate design documentation. The ambiguity-flagging instruction targets cropped or unclear regions specifically — a cut-off icon or an edge that's out of frame gets filled with a plausible guess by default, and naming that guess as a guess is the difference between code you can trust and code you have to re-verify against the original design anyway.",
    exampleOutput:
      'export function PricingCard() {\n  return (\n    <div className="rounded-xl border p-6 shadow-sm">\n      <h3 className="text-lg font-semibold">Pro</h3>\n      <p className="text-3xl font-bold mt-2">$29<span className="text-sm font-normal">/mo</span></p>\n      <button className="mt-4 w-full rounded-md bg-black text-white py-2" disabled>\n        Current plan\n      </button>\n    </div>\n  )\n}\n\nUnsure about: the small icon next to "Pro" was partially cut off at the top edge of the screenshot — used a generic badge placeholder instead of guessing which icon it was.',
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-02' }],
    changelog: [
      {
        date: '2026-07-02',
        note: 'Initial publish, verified against Gemini 3 Pro on a cropped pricing-card screenshot.',
      },
    ],
  },
  {
    slug: 'gemini-photo-translation-localization',
    category: 'gemini',
    title:
      'Translate and culturally localize the text inside a photo, not just the words',
    description:
      'A multimodal prompt for translating a photographed menu, sign, or label that asks for cultural and practical localization alongside the literal translation, instead of a flat word-for-word swap.',
    promptText: `Here's a photo of {{photo_description}}, originally in {{source_language}}. Translate it into {{target_language}} for {{reader_context}}.

For each item/line in the photo:
1. Give the literal translation.
2. Then a localized version if the literal translation would be confusing, misleading, or just odd to a {{target_language}} reader — explain in one line why you changed it (an idiom, a measurement unit, a culturally specific dish or reference).
3. Flag anything you can't read clearly in the photo as [unclear] rather than guessing text that isn't really there.
4. Convert any units, currency, or sizes to what's standard for {{reader_context}}, noting the original alongside the conversion.

If something in the source has no real equivalent in {{target_language}}/{{reader_context}} (a dish, an idiom, a cultural reference), say so explicitly instead of forcing an approximate translation that changes the meaning.`,
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
          'a first-time visitor from the US with no dietary restrictions knowledge of the local cuisine',
        required: true,
      },
    ],
    targetTools: ['Gemini (Gemini 3 Pro)', 'Gemini app'],
    tags: ['translation', 'localization', 'multimodal', 'image-input', 'travel'],
    whyItWorks:
      "Reading the photo directly rather than routing through a separate OCR step lets Gemini use surrounding visual context (menu section headers, price formatting, layout) to disambiguate text that a plain OCR-then-translate pipeline would get wrong in isolation. The request for a localized version alongside the literal one directly targets the most common failure of flat translation: an idiom, a dish name, or a unit gets translated word-for-word into something technically accurate but meaningless or misleading to the reader, and asking the model to explain why it changed something keeps that judgment call visible instead of hidden inside a single 'translation.' The [unclear] flag matters specifically for real photos, which are often at an angle, partially glared-over, or slightly blurry — a model translating confidently from a misread character produces a wrong dish description with no signal that anything was uncertain.",
    exampleOutput:
      'Line 3: 焼き餃子 (yakigyoza)\nLiteral: "Fried gyoza"\nLocalized: "Pan-fried pork dumplings" — kept as "gyoza" is understood in English now, but added "pan-fried" since "fried" alone suggests deep-fried to most US readers, which this isn\'t.\n\nLine 7: [unclear] — price partially obscured by a sticker, showing only "¥8_0".',
    verifiedAgainst: [{ tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-06-28' }],
    changelog: [
      {
        date: '2026-06-28',
        note: 'Initial publish, verified against Gemini 3 Pro on a photographed Japanese restaurant menu.',
      },
    ],
  },
]
