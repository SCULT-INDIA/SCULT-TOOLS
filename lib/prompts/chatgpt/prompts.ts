import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'custom-instructions-persistent-profile-and-style',
    category: 'chatgpt',
    title: 'Set up Custom Instructions once so every new chat already gets you',
    description:
      'A ready-to-paste pair of Custom Instructions, one for what ChatGPT should know about you and one for how it should respond, so a brand-new conversation starts calibrated instead of you re-explaining your role and preferences every time.',
    promptText: `ABOUT ME — paste into the box labeled "What would you like ChatGPT to know about you?" in Settings > Personalization > Custom Instructions.

Role and context: {{role_and_context}}
What I am currently working on: {{current_focus}}
Background to assume without me repeating it: {{background_facts}}

HOW TO RESPOND — paste into the box labeled "How would you like ChatGPT to respond?"
- Default length: {{response_length}}. Do not pad a short answer to look thorough, and do not truncate a genuinely complex one just to hit a length target.
- Tone: {{tone_preference}}.
- {{things_to_avoid}}
- If a request is ambiguous, ask one clarifying question before producing a long answer built on a guess.
- State assumptions explicitly instead of silently picking one when a question could be read two ways.
- Do not open with an apology or a restatement of my question before answering it.`,
    variables: [
      {
        name: 'role_and_context',
        description: 'Who you are and the situation ChatGPT should assume by default.',
        example:
          'Product manager at a 12-person B2B SaaS startup, mostly non-technical stakeholders',
        required: true,
      },
      {
        name: 'current_focus',
        description:
          'What you are actively working on right now, so answers stay relevant without re-explaining it.',
        example: 'Launching a usage-based pricing model this quarter',
        required: true,
      },
      {
        name: 'background_facts',
        description:
          'Any standing fact that changes how answers should be pitched or explained.',
        example:
          'I know basic SQL but not Python, explain code concepts in plain language first',
        required: false,
      },
      {
        name: 'response_length',
        description:
          'The default answer length you want unless you ask for more or less.',
        example: 'Medium, a few paragraphs or a short list, not a wall of text',
        required: true,
      },
      {
        name: 'tone_preference',
        description: 'The register you want responses written in.',
        example: 'Direct and a little informal, skip the corporate hedging',
        required: true,
      },
      {
        name: 'things_to_avoid',
        description:
          'A specific behavior or suggestion you want ChatGPT to never default to.',
        example:
          'Never suggest hiring a consultant or agency as the answer to something I am trying to solve myself',
        required: false,
      },
    ],
    targetTools: ['ChatGPT (GPT-5.1)', 'ChatGPT (GPT-5)'],
    tags: [
      'custom-instructions',
      'personalization',
      'response-style',
      'onboarding',
      'prompt-setup',
    ],
    whyItWorks:
      'Custom Instructions are static text injected as system-level context at the start of every new conversation, which is mechanically different from Memory: Memory accumulates facts automatically over time from what you say across chats, while Custom Instructions are a fixed profile you write once and control directly. Splitting the "about me" facts from the "how to respond" rules mirrors the real two-field structure the settings page ships, and keeping them in separate blocks matters because a model asked to both know a fact and follow a style rule from one undifferentiated paragraph will sometimes recite the fact back as if it were being asked to, rather than quietly using it as background. The instruction to ask one clarifying question rather than guess specifically targets the first message of a brand-new thread, the one point where the model has no conversational context yet to catch a misread request, so it defaults to running with an assumption unless told otherwise. Naming a concrete length target with an explicit "do not pad" clause also closes a known side effect of length instructions alone: told only to keep answers short, a model will sometimes hit that target by omitting substance rather than saying less with the same content.',
    exampleOutput:
      'With this saved, asking "how should I think about pricing tiers" in a brand-new chat gets a direct, PM-context-aware answer at the requested length on the very first reply, instead of a generic pricing-strategy essay that has to be steered twice before it matches how you actually work.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Custom Instructions)', date: '2026-07-14' },
    ],
    changelog: [
      {
        date: '2026-07-14',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 Custom Instructions settings.',
      },
    ],
  },
  {
    slug: 'custom-gpt-action-schema-and-instructions-brief',
    category: 'chatgpt',
    title: 'Turn an API description into a working Custom GPT Action in one pass',
    description:
      'A setup prompt that generates the three things a Custom GPT with an Action actually needs — system instructions, an OpenAPI schema, and conversation starters — from a plain-English description of the API you want it to call.',
    promptText: `You are helping me configure a Custom GPT in GPT Builder that calls an external API through an Action. Produce three labeled, copy-paste-ready outputs.

API DESCRIPTION
{{api_description}}

ENDPOINTS TO EXPOSE
{{endpoints}}

AUTHENTICATION METHOD
{{auth_method}}

1. GPT INSTRUCTIONS — the system prompt for the Instructions field on the Configure tab: what this GPT does, when to call the Action versus answer from its own knowledge, and exactly what to say if the Action call fails or returns an error.
2. ACTION SCHEMA — a valid OpenAPI 3.1 JSON schema covering only the endpoints listed above, with an operationId and a one-line description per endpoint precise enough that the model can decide correctly when to call it.
3. CONVERSATION STARTERS — three example user messages that should trigger this GPT to call the Action, phrased the way a real user would actually type them.

CONSTRAINTS
- The schema must validate as OpenAPI 3.1. No placeholder types or invented fields.
- If {{auth_method}} needs an API key or bearer token, note in the instructions that it belongs in the Action's authentication settings, never hardcoded into the schema or the instructions text.
- The GPT instructions must explicitly tell the model to say the lookup failed rather than invent a plausible-looking result if the Action call errors or times out.`,
    variables: [
      {
        name: 'api_description',
        description: 'What the API does and how it is reached, in plain English.',
        example:
          'A REST API for our internal order-tracking system, returns order status by order ID over HTTPS',
        required: true,
      },
      {
        name: 'endpoints',
        description:
          'The specific endpoint(s) this GPT should be able to call, with their inputs and outputs.',
        example: 'GET /orders/{id} returns status, carrier, and estimated delivery date',
        required: true,
      },
      {
        name: 'auth_method',
        description: 'How requests to the API authenticate.',
        example: 'API key sent as a header named X-API-Key',
        required: true,
      },
    ],
    targetTools: ['ChatGPT (GPT Builder, GPT-5.1)', 'ChatGPT (Custom GPTs)'],
    tags: ['custom-gpt', 'gpt-actions', 'openapi', 'gpt-builder', 'api-integration'],
    whyItWorks:
      'A GPT Action is only as reliable as its OpenAPI schema and the instructions that tell the model when to reach for it: operationId is effectively the function name the model calls internally, and the per-endpoint description is what it reads to decide this is the right tool for this request, so vague or missing descriptions produce a GPT that either never calls the Action or calls the wrong one. Generating the instructions, the schema, and the conversation starters together in one pass keeps them consistent with each other, since a conversation starter that does not actually map to something the schema and instructions agree on is a common cause of a Custom GPT that looks configured but silently fails on its own example prompts. Separating authentication into a named constraint matters because the real auth configuration for an Action lives outside the schema, in its own settings pane, and a model asked to just write the schema will sometimes bake a placeholder key directly into it if not told explicitly where that value actually belongs. The explicit instruction to report a failed call rather than invent a result is the most load-bearing line here: tool-calling models are documented to paper over a failed or errored function call with a fluent, plausible-sounding answer unless directly told that doing so is worse than admitting the lookup did not work.',
    exampleOutput:
      'Instructions: "Call get_order_status whenever the user asks about an order, a shipment, or a delivery date. Never estimate a status from memory. If the call returns an error or times out, tell the user the lookup failed and ask them to confirm the order ID, do not guess a plausible status." Schema excerpt: {"paths": {"/orders/{id}": {"get": {"operationId": "getOrderStatus", "description": "Returns current status, carrier, and estimated delivery date for one order by ID.", "parameters": [{"name": "id", "in": "path", "required": true, "schema": {"type": "string"}}]}}}}',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Builder (GPT-5.1)', date: '2026-06-30' },
    ],
    changelog: [
      {
        date: '2026-06-30',
        note: 'Initial publish, verified against ChatGPT GPT Builder on GPT-5.1.',
      },
    ],
    relatedToolSlug: 'json-formatter',
  },
  {
    slug: 'chatgpt-memory-deliberate-update-and-cleanup',
    category: 'chatgpt',
    title: 'Decide what ChatGPT remembers about you instead of letting it drift',
    description:
      'A periodic audit prompt that makes ChatGPT show every memory addition and deletion before saving it, so long-term memory stays accurate instead of quietly accumulating stale facts.',
    promptText: `Show me every change to memory before you save any of it. Nothing gets written silently in this pass.

WHAT HAS CHANGED SINCE MEMORY WAS LAST UPDATED
{{recent_changes}}

WHAT I NO LONGER WANT REMEMBERED, IF ANYTHING
{{outdated_facts}}

Do the following, in order.
1. List every fact currently in memory about me that {{recent_changes}} makes outdated, and mark each one OUTDATED — REMOVE, with the reason.
2. List every new fact worth remembering long-term from {{recent_changes}}, marked NEW — ADD, phrased as a single durable fact about me, my work, or my preferences, not a summary of this conversation.
3. Remove anything named under things I no longer want remembered, and confirm explicitly that it has been forgotten, not just left unmentioned going forward.
4. Show the complete resulting list of what memory will contain after this update, and wait for me to confirm before saving anything.

Do not add a fact about the specific topic of this conversation unless it is genuinely durable. A one-off question I asked today is not memory-worthy just because we discussed it.`,
    variables: [
      {
        name: 'recent_changes',
        description:
          'What has changed about you, your work, or your situation since memory was last checked.',
        example:
          'Left my job at Acme Corp, now a freelance consultant working mostly with early-stage startups',
        required: true,
      },
      {
        name: 'outdated_facts',
        description:
          'Anything specific you want actively removed from memory, if applicable.',
        example: 'Forget that I was training for a marathon, I stopped in the spring',
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Memory, GPT-5.1)'],
    tags: ['memory', 'personalization', 'context-management', 'privacy'],
    whyItWorks:
      'ChatGPT writes to Memory both automatically, by inferring durable facts from what you say, and explicitly, when you say something like remember that, and both paths can be reviewed and edited under Settings > Personalization > Manage Memory, which is what makes an audit like this possible rather than theoretical. The propose-then-confirm structure matters because memory that updates silently in the background is memory you cannot debug when it starts giving stale-context answers weeks later, quietly assuming a job you left or a project you finished; forcing an explicit remove-and-add list before saving turns an invisible background process into something you actually approve line by line. Separating outdated removal from new addition into two distinct steps also prevents a common failure mode of unscoped memory edits, where a model asked to update memory adds the new fact but leaves the contradicted old one sitting alongside it, since nothing prompted it to check for the conflict. The closing constraint against saving one-off conversational details, rather than durable facts, is what keeps memory from slowly filling with the questions you asked instead of the things actually worth ChatGPT knowing about you going forward.',
    exampleOutput:
      'OUTDATED — REMOVE: "Works at Acme Corp" — superseded by the new freelance-consultant status. NEW — ADD: "Freelance consultant working primarily with early-stage startups." Forgotten as requested: "Training for a marathon." Resulting memory list: [role: freelance consultant, focus: early-stage startup clients, ... ] — confirm before saving?',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Memory)', date: '2026-07-05' },
    ],
    changelog: [
      {
        date: '2026-07-05',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 Memory settings.',
      },
    ],
  },
  {
    slug: 'chatgpt-canvas-targeted-revision-workflow',
    category: 'chatgpt',
    title: 'Draft in Canvas and get surgical edits instead of a full rewrite every round',
    description:
      'A Canvas setup prompt that locks each revision round to the exact section you point at, so asking for one paragraph to be sharper does not quietly rewrite the rest of the document.',
    promptText: `Open this in Canvas so we can iterate on one persistent draft instead of regenerating a new version in the chat each round.

DOCUMENT BRIEF
{{document_brief}}

AUDIENCE AND GOAL
{{audience_and_goal}}

LENGTH TARGET
{{length_target}}

Write the first full draft in canvas now.

For every revision after this first draft, I will point at a specific section rather than describing the whole document again. When I do:
- Edit only the part I pointed at. Leave every other paragraph exactly as it was, unless the edit has a direct knock-on effect elsewhere, for example a term you renamed that also appears later, and if so, name that follow-on edit before making it.
- Do not change tone, structure, or claims outside the section I pointed at.
- If my revision request is ambiguous, ask one clarifying question before editing the canvas.

First revision to apply after the initial draft, if any: {{first_revision}}`,
    variables: [
      {
        name: 'document_brief',
        description: 'What the document is and what it needs to accomplish.',
        example:
          'A one-page internal memo proposing we move standups to async written updates',
        required: true,
      },
      {
        name: 'audience_and_goal',
        description:
          'Who will read this and what they should think or do after reading it.',
        example:
          'Engineering leads who are skeptical of losing daily verbal syncs, goal is a trial period, not full buy-in',
        required: true,
      },
      {
        name: 'length_target',
        description: 'Roughly how long the finished document should be.',
        example: 'Under 400 words, fits on one screen without scrolling',
        required: true,
      },
      {
        name: 'first_revision',
        description:
          'A specific first change to apply once the draft exists. Leave blank to review the draft yourself first.',
        example:
          'Make the opening paragraph state the proposal in one sentence before any justification',
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Canvas, GPT-5.1)'],
    tags: ['canvas', 'iterative-editing', 'document-drafting', 'revision-workflow'],
    whyItWorks:
      'Canvas is a persistent editing surface separate from the chat stream specifically so a document or a piece of code can be revised in place rather than regenerated as a new wall of text every round, and it is documented to apply targeted edits, shown as a visible diff, when a revision request is scoped tightly enough for it to do so. The failure mode this prompt is built against is the vague revision request: told simply to make it better or tighten the intro, a model reverts to chat-style behavior and rewrites more of the canvas than was asked for, because nothing constrained the edit to a boundary. Instructing it to point at a specific section and edit only that section reinforces the exact interaction Canvas is designed around, where highlighting or naming a passage and requesting a change to it should produce a scoped diff, not a fresh draft. Requiring it to name any knock-on edit before making it, such as a renamed term that also appears elsewhere, prevents the opposite failure: an edit that is technically scoped to one section but silently breaks consistency with a part of the document the model was told not to touch.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Canvas)', date: '2026-07-18' },
    ],
    changelog: [
      {
        date: '2026-07-18',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 Canvas.',
      },
    ],
  },
  {
    slug: 'chatgpt-deep-research-mission-brief',
    category: 'chatgpt',
    title: 'Brief Deep Research properly so a ten-minute run is not wasted',
    description:
      'A structured brief for ChatGPT Deep Research that fixes scope, source quality, and output format upfront, since a Deep Research run cannot be redirected once it is already underway.',
    promptText: `Run this as a Deep Research task, not a quick answer.

RESEARCH QUESTION
{{research_question}}

DECISION THIS SUPPORTS
{{decision_context}}

SCOPE
- Time window: {{time_window}}
- Geography or market: {{geography}}
- Explicitly out of scope: {{out_of_scope}}

SOURCE BAR
- Prioritize primary sources, official filings, original studies, direct vendor documentation, over secondary summaries or aggregator blog posts.
- When sources disagree, say so explicitly and name both positions rather than picking one silently.
- Flag any claim that rests on a single source with no corroboration.

OUTPUT FORMAT
1. A three-sentence bottom line answering the research question directly.
2. A comparison table if more than one option is being evaluated: {{comparison_items}}.
3. Key findings grouped by sub-topic, each with an inline citation.
4. What you could not confirm, and why. Do not fill a gap with a plausible-sounding guess.
5. A short section on what would change the answer, so I know how fragile the conclusion is.

If the question as stated is too broad to research well in one pass, say so and propose a narrower version before running.

If you are on GPT-5.1 and can set a reasoning effort level for this chat, set it to high before running this brief. Multi-step research benefits from more thinking time than the default balanced setting.`,
    variables: [
      {
        name: 'research_question',
        description: 'The exact question the research run should answer.',
        example:
          'Which of these three payroll platforms handles multi-state contractor tax filing most reliably?',
        required: true,
      },
      {
        name: 'decision_context',
        description:
          'The real decision this research is feeding, so the run can filter for relevance instead of trying to be exhaustive.',
        example:
          'Choosing a payroll vendor to switch to before next quarter, has to support contractors in 6 states',
        required: true,
      },
      {
        name: 'time_window',
        description: 'How recent the sources need to be.',
        example: 'Last 18 months, this space changes with tax law updates',
        required: false,
      },
      {
        name: 'geography',
        description: 'The market or region the research should stay confined to.',
        example: 'United States only',
        required: false,
      },
      {
        name: 'out_of_scope',
        description: 'What the research should explicitly not spend time on.',
        example: 'International payroll, enterprise-tier pricing above 500 employees',
        required: false,
      },
      {
        name: 'comparison_items',
        description:
          'The specific options to compare, if the question involves more than one.',
        example: 'Gusto, Rippling, and Deel',
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Deep Research, GPT-5.1)'],
    tags: ['deep-research', 'research-brief', 'source-verification', 'decision-support'],
    whyItWorks:
      'Deep Research runs as an autonomous multi-step agent that browses and reads dozens of sources over several minutes before producing a cited report, and unlike a normal chat turn, you cannot course-correct it two minutes into a run the way you would nudge a reply that is going in the wrong direction, so the entire value of the output depends on how precisely the brief is written before it starts. Naming the decision this research supports gives the agent a relevance filter, what actually counts as a key finding versus noise, instead of leaving it to try to be exhaustive about the raw topic, which is how a research run comes back thorough but unusable. Stating a source-quality bar matters because an unconstrained agent otherwise weights a well-optimized blog post and a primary filing similarly at the retrieval stage; naming primary sources as the priority changes what it chooses to read, not just what it chooses to cite. The mandatory what you could not confirm section counters a specific tendency of long research summaries to smooth over a scarcity of good sources on one sub-question rather than flag it, because an honestly incomplete answer is more useful than a comprehensive-sounding one that quietly papers over a gap.',
    exampleOutput:
      'Bottom line: Gusto and Rippling both handle multi-state contractor filing reliably; Deel is strong internationally but has had recurring user-reported delays with US 1099 filings in two states this year. Comparison table: [Gusto | Rippling | Deel] x [multi-state support | pricing tier | reported issues]. Could not confirm: exact 1099 filing SLA for Rippling in Texas specifically, vendor documentation does not state it and no independent source addressed it directly.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'Deep Research (GPT-5.1)', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against ChatGPT Deep Research on GPT-5.1.',
      },
    ],
  },
  {
    slug: 'chatgpt-projects-shared-context-setup',
    category: 'chatgpt',
    title: 'Set up a ChatGPT Project so every new thread inherits the same context',
    description:
      'Project-level instructions and file-handling rules that make every new chat inside a ChatGPT Project start with the right standing context, instead of you re-uploading files and re-explaining the brief in every thread.',
    promptText: `PROJECT INSTRUCTIONS — paste into this Project's instructions field so every thread inside it inherits this context automatically.

PROJECT
{{project_name}}

WHAT THIS PROJECT IS FOR
{{project_purpose}}

STANDING CONTEXT (true for every thread in this project, do not re-ask for this)
{{standing_context}}

FILES IN THIS PROJECT
Treat the uploaded files as the current source of truth. If a new thread's question conflicts with something in an uploaded file, flag the conflict instead of silently trusting whichever is more recent in the conversation.

RULES FOR EVERY THREAD IN THIS PROJECT
- Assume I am mid-work on {{project_purpose}}, not asking a one-off question. Carry the standing context into your first response without me repeating it.
- If a thread's request would be better served by something already established in another thread in this project, say so, since threads in this project do not automatically share each other's conversation history.
- {{project_specific_rules}}

FIRST THREAD IN THIS PROJECT
{{first_task}}`,
    variables: [
      {
        name: 'project_name',
        description: 'The name of the Project as it appears in the sidebar.',
        example: 'Q3 Pricing Launch',
        required: true,
      },
      {
        name: 'project_purpose',
        description: 'The ongoing piece of work this Project exists to organize.',
        example:
          'Rolling out usage-based pricing tiers for the SaaS product this quarter',
        required: true,
      },
      {
        name: 'standing_context',
        description:
          'Facts true for the whole project that every thread should assume without being told again.',
        example:
          'Current plans are Starter, Growth, and Scale. Growth is the plan we are converting Starter users to.',
        required: true,
      },
      {
        name: 'project_specific_rules',
        description:
          'Any additional rule specific to how this project should be handled.',
        example:
          'Always flag any pricing number you suggest as a draft, never state it as decided',
        required: false,
      },
      {
        name: 'first_task',
        description: 'What the first thread in this Project should actually work on.',
        example:
          'Draft the customer-facing FAQ explaining the new tiers and the migration timeline',
        required: true,
      },
    ],
    targetTools: ['ChatGPT (Projects, GPT-5.1)'],
    tags: ['projects', 'workspace-organization', 'context-engineering', 'file-context'],
    whyItWorks:
      'A Project is a distinct container from both a single chat and from Custom Instructions: files and project-level instructions attached to it are available to every new thread opened inside that Project, which is what lets you run several separate standing contexts, a launch, a hiring process, a client, without them bleeding into each other or into your global Custom Instructions. Explicitly naming the uploaded files as the source of truth matters because a model will otherwise give recency more weight than provenance, treating a claim made three messages ago in the current thread as more authoritative than a fact sitting in a document, simply because it is closer in the context window. The line noting that sibling threads do not automatically share each others conversation history is a real, easily-missed mechanic: a Project gives every thread the same files and instructions, but it does not give thread B the transcript of thread A, so a rule reminding the model to say so when relevant prevents it from assuming continuity that is not actually there. Writing the standing context once, at the project level, is also what stops the earliest and most common Project failure: restating the same three paragraphs of background in every new thread you open.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Projects)', date: '2026-07-10' },
    ],
    changelog: [
      {
        date: '2026-07-10',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 Projects.',
      },
    ],
  },
  {
    slug: 'chatgpt-advanced-voice-mode-roleplay-practice',
    category: 'chatgpt',
    title:
      'Turn Advanced Voice Mode into a realistic practice partner with an actual debrief',
    description:
      'A pre-call setup prompt that locks Advanced Voice Mode into a persona for a live practice conversation, with a fixed stop word that switches it instantly from roleplay into structured feedback.',
    promptText: `We are about to switch to voice mode. Stay in character for the entire conversation until I say the stop word "{{stop_word}}", and do not break character to give meta-commentary mid-conversation even if I stumble.

SCENARIO
{{scenario}}

YOUR ROLE
{{ai_role}}

MY ROLE
{{my_role}}

DIFFICULTY AND BEHAVIOR
{{difficulty_notes}}

RULES FOR THIS SESSION
- Speak and react the way a real {{ai_role}} would. Interrupt naturally if I ramble, ask follow-up questions, and push back on a weak answer instead of accepting everything I say.
- Do not narrate stage directions out loud. Just be the character.
- Keep each turn conversational length, a back-and-forth, not a monologue.

When I say "{{stop_word}}", immediately drop the character and give feedback in this order: what worked, the single biggest thing to fix, and one specific line I could have said better with an example.

Start the scenario now with your opening line in character.`,
    variables: [
      {
        name: 'stop_word',
        description:
          'A word you would never naturally say inside the scenario, used to signal the session is over.',
        example: 'pineapple',
        required: true,
      },
      {
        name: 'scenario',
        description: 'The situation being rehearsed.',
        example:
          'A final-round interview for a senior product manager role at a mid-size fintech company',
        required: true,
      },
      {
        name: 'ai_role',
        description: 'Who ChatGPT should play.',
        example:
          'A skeptical hiring manager who has interviewed dozens of PM candidates this year',
        required: true,
      },
      {
        name: 'my_role',
        description: 'Who you are playing in the scenario.',
        example:
          'The candidate, aiming to sound confident without being evasive on weaknesses',
        required: true,
      },
      {
        name: 'difficulty_notes',
        description: 'How hard the practice partner should push.',
        example:
          'Ask at least two follow-up questions that probe for specifics whenever I give a vague answer',
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Advanced Voice Mode, GPT-5.1)'],
    tags: ['voice-mode', 'roleplay-practice', 'interview-prep', 'real-time-conversation'],
    whyItWorks:
      "Advanced Voice Mode differs from text chat in the thing that actually makes practice valuable: real-time turn-taking, interruption, and prosody, none of which a written back-and-forth reproduces, which is exactly why the persona and rules need to be set before switching modes rather than adjusted mid-conversation the way you would edit a text prompt. A literal stop word gives an unambiguous exit signal the model can key on instantly, which matters because a vague cue like okay that is probably enough is exactly the kind of phrase a model that is staying in character might read as part of the roleplay rather than an instruction to step out of it. Explicitly telling it to interrupt and push back, rather than validate every answer, counters voice mode's default conversational register toward being agreeable and encouraging, which is the wrong texture for rehearsing something like interview pressure or a hard sales objection where the value is in being made uncomfortable on purpose. Requesting feedback in a fixed order, what worked, the single biggest fix, one better line, also turns the debrief into something actionable the moment the character drops, instead of a generic that went well pep talk.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Advanced Voice Mode)', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 Advanced Voice Mode.',
      },
    ],
  },
  {
    slug: 'chatgpt-scheduled-task-notification-brief',
    category: 'chatgpt',
    title: 'Set up a recurring ChatGPT Task that is worth getting notified about',
    description:
      'A scheduling brief that gives a recurring ChatGPT Task an explicit worth-notifying threshold, so it stops sending a ping every single run regardless of whether anything actually changed.',
    promptText: `Create a scheduled task with this exact setup.

SCHEDULE
{{cadence}}

EACH TIME THIS RUNS, DO THIS
{{recurring_instructions}}

WHAT COUNTS AS WORTH NOTIFYING ME ABOUT
{{notify_threshold}}

RULES
- If nothing meets the notify threshold this run, send a single short line saying so. Do not send a full report with "nothing new" padded into it, and do not stay silent, since I need to know the task actually ran.
- Keep the notification itself under {{max_length}}. I am reading this on a lock screen, not opening a document.
- Do not repeat something you already flagged in a previous run unless {{recurring_instructions}} explicitly asks you to track it over time.
- Every notification must end with one line stating what it checked and when, so a silent failure is obvious rather than looking identical to nothing happened.

Confirm the schedule and the first run's exact instructions back to me before saving.`,
    variables: [
      {
        name: 'cadence',
        description: 'How often the task should run, in plain language.',
        example: 'Every weekday at 8am, my local time',
        required: true,
      },
      {
        name: 'recurring_instructions',
        description: 'What the task should actually do each time it runs.',
        example:
          'Check for any news mentioning our main competitor, Northwind Logistics, in the last 24 hours',
        required: true,
      },
      {
        name: 'notify_threshold',
        description: 'What has to be true for a run to be worth a notification at all.',
        example:
          'Only notify if the news involves a product launch, a funding round, or a pricing change, not routine PR',
        required: true,
      },
      {
        name: 'max_length',
        description: 'A hard cap on how long the notification text can be.',
        example: '3 sentences',
        required: true,
      },
    ],
    targetTools: ['ChatGPT (Tasks, GPT-5.1)'],
    tags: ['scheduled-tasks', 'automation', 'notifications', 'recurring-prompt'],
    whyItWorks:
      'A Task runs the same underlying instructions on a schedule and messages you when a run completes, executing entirely unattended, which means the entire design problem has to be solved upfront, unlike a live chat where you can redirect a bad answer the moment you see it. Stating an explicit worth-notifying threshold turns a recurring task from a guaranteed ping on a timer into an actual filter, which is what keeps a daily or weekly Task useful instead of becoming the first notification you mute because it fires every run regardless of whether anything changed. The instruction to send a short line rather than stay silent when nothing qualifies fixes a specific ambiguity in unattended automation: silence could mean nothing happened, or it could mean the task failed to run at all, and those two states are indistinguishable to you unless the task is explicitly told to report both outcomes differently. Requiring confirmation of the schedule and the exact first-run instructions before saving also catches a common setup mistake early, a natural-language cadence like every Monday getting parsed as every weekday, rather than discovering the misreading three silent, wrongly-timed runs later.',
    exampleOutput:
      'Confirmed schedule: every weekday at 8:00 AM. First run will check for Northwind Logistics news from the prior 24 hours and only notify on a launch, funding round, or pricing change. Sample notification if nothing qualifies: "Checked Northwind Logistics news as of 8:00 AM Tue — nothing met the notify threshold today."',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Tasks)', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 Tasks.',
      },
    ],
  },
  {
    slug: 'chatgpt-three-pass-self-critique-and-revise',
    category: 'chatgpt',
    title: 'Make ChatGPT critique its own draft before you ever see the final version',
    description:
      'A three-pass draft, critique, and revise prompt that forces a real self-critique against named criteria instead of letting the first fluent answer ship unexamined.',
    promptText: `Do this task in three visible passes, in one response. Do not skip straight to a polished answer.

TASK
{{task}}

PASS 1 — DRAFT
Write a first attempt. Do not over-optimize it yet, this is a working draft.

PASS 2 — CRITIQUE
Re-read your own draft as a skeptical editor who did not write it. Check specifically for: {{critique_criteria}}. Name at least two real weaknesses. If you genuinely cannot find one, that is itself suspicious, and you should look harder before concluding the draft is fine. Do not critique things that do not matter for this task just to have something to say.

PASS 3 — REVISION
Rewrite the draft to fix every weakness named in pass 2. Do not reintroduce a weakness you just fixed. After the revision, list which pass-2 criticism each change addresses.

Show all three passes, not just the final revision. I want to see what changed and why.`,
    variables: [
      {
        name: 'task',
        description: 'The actual thing to draft, critique, and revise.',
        example:
          'Write a 150-word LinkedIn post announcing our new pricing model without sounding like a press release',
        required: true,
      },
      {
        name: 'critique_criteria',
        description:
          'The specific things to check for in the critique pass, not a generic quality check.',
        example:
          'clichés, unsupported claims, and whether the hook in the first line actually earns a click to read more',
        required: true,
      },
    ],
    targetTools: ['ChatGPT (GPT-5.1)'],
    tags: [
      'self-critique',
      'reflection-prompting',
      'quality-control',
      'iterative-drafting',
    ],
    whyItWorks:
      'This is the draft, critique, revise pattern, sometimes called self-refine prompting, which is documented to measurably improve output quality over asking for a single-pass answer, because a model evaluating a draft it has already externalized as finished text engages a more critical mode than the generation mode it used to produce that same draft. First-pass generation is optimized to produce a plausible, fluent continuation; a critique pass explicitly told to look for what is wrong activates a different weighting than produce something good does, which is why asking for both in the same turn, rather than trusting the first draft, changes the outcome rather than just adding words. Naming specific critique criteria prevents the critique pass from defaulting to generic praise, the most common failure mode of unscoped self-evaluation, where a model politely validates its own work rather than actually stress-testing it. The instruction that finding zero weaknesses is itself suspicious directly targets a documented tendency for models to rate their own output more favorably than an independent judge would, and requiring the pass-2-to-pass-3 mapping at the end makes the revision auditable, so a reader can check that a named flaw was actually fixed rather than the model quietly rewriting for tone instead.',
    exampleOutput:
      'Pass 2 critique example: "Weakness 1: the opening line, We are excited to announce, is the exact cliché a press release uses and signals corporate-speak before anyone reads further. Weakness 2: the claim easier pricing for everyone is unsupported, nothing in the draft explains what changed or for whom." Pass 3 then replaces the opening with a specific number and removes the unsupported claim, mapped back to both named weaknesses.',
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-06-20' }],
    changelog: [
      {
        date: '2026-06-20',
        note: 'Initial publish, verified against ChatGPT GPT-5.1.',
      },
    ],
  },
  {
    slug: 'chatgpt-data-analysis-file-upload-audit',
    category: 'chatgpt',
    title: 'Get a trustworthy first read on a spreadsheet you just uploaded',
    description:
      'A file-analysis prompt that forces ChatGPT Advanced Data Analysis to profile the data, show the actual code behind every number, and name how the result could be wrong before handing you an answer.',
    promptText: `Before analyzing anything, profile the file I just uploaded and show me the actual code you ran, not just a description of it.

FILE CONTEXT
{{file_context}}

STEP 1 — DATA PROFILE
Run code to show: row count, column names and types, missing-value counts per column, and any column where the values look inconsistent, mixed formats, obvious typos, or duplicate rows. Flag anything found here before doing any analysis on it.

STEP 2 — ANALYSIS
{{analysis_request}}
Every number in your answer must come from code you actually executed on this file, shown inline, not estimated or recalled from a similar-looking file seen during training. If a number in your answer has no corresponding code output, remove it or flag it as an estimate.

STEP 3 — SANITY CHECK
Before presenting the final answer, state one way the result could be wrong given what step 1 found, for example a filtered-out set of rows, or a skewed distribution the mean is hiding, and whether you checked for it.

OUTPUT
{{output_format}}`,
    variables: [
      {
        name: 'file_context',
        description: 'What the uploaded file is and where it came from.',
        example:
          "A CSV export of last quarter's support tickets from our helpdesk system",
        required: true,
      },
      {
        name: 'analysis_request',
        description: 'The actual analysis you want performed.',
        example:
          'Break down average time-to-resolution by ticket priority and by the agent who closed it',
        required: true,
      },
      {
        name: 'output_format',
        description: 'How you want the final result presented.',
        example: 'A short summary paragraph followed by one table, no charts needed',
        required: true,
      },
    ],
    targetTools: ['ChatGPT (Advanced Data Analysis, GPT-5.1)'],
    tags: ['data-analysis', 'code-interpreter', 'file-upload', 'spreadsheet-analysis'],
    whyItWorks:
      "Advanced Data Analysis actually executes Python in a sandbox against the uploaded file, which means a number in the response can either be genuinely computed by that code or, if the model shortcuts the step, a plausible-sounding estimate presented with the same confidence, and the instruction to show the actual code closes that gap by making every number auditable against a visible calculation instead of trusted on the model's word alone. Front-loading a data profile pass matters because most bad spreadsheet analysis is not a wrong formula, it is an unnoticed data problem: mixed date formats, a currency column stored as text, duplicate rows silently inflating a sum, and catching that before the analysis prevents a technically correct calculation from running cleanly on dirty input and landing on a wrong number with total confidence. The sanity-check pass exploits something specific about how these models behave: asked directly to name its own analysis's weak point, a model can usually do it, even though it will not volunteer that critique unprompted, so a distinct instruction is needed because a bare is this right without a specific angle produces a generic yes.",
    exampleOutput:
      'Data profile: 4,218 rows, no missing values in priority or agent columns, but 37 rows have a resolution_time value of 0 that look like same-day auto-closes rather than genuine instant resolutions. Analysis run with pandas groupby on priority and agent, mean resolution time in hours shown per group. Sanity check: excluding those 37 zero-value rows changes the High priority average from 4.1 hours to 6.8 hours, so the headline number without that exclusion understates real resolution time.',
    verifiedAgainst: [
      {
        tool: 'ChatGPT',
        version: 'GPT-5.1 (Advanced Data Analysis)',
        date: '2026-07-08',
      },
    ],
    changelog: [
      {
        date: '2026-07-08',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 Advanced Data Analysis.',
      },
    ],
  },
  {
    slug: 'chatgpt-vision-structured-image-extraction',
    category: 'chatgpt',
    title: 'Get a structured, honestly-flagged read on an uploaded image',
    description:
      'A vision prompt that forces ChatGPT to flag illegible or ambiguous parts of an image explicitly, instead of quietly guessing a plausible value for text or details it cannot actually confirm.',
    promptText: `Look at the image I just uploaded and answer using only what is actually visible in it.

WHAT I NEED FROM THIS IMAGE
{{extraction_goal}}

OUTPUT FORMAT
{{output_format}}

RULES
- If any text in the image is small, blurry, cut off, or otherwise hard to read with confidence, say so explicitly next to that item instead of guessing a plausible value.
- Do not infer information that is not visible just because it is typical or expected, for example, do not assume a total that is not shown just because the line items suggest one.
- If the image contains more than one distinct thing that could match {{extraction_goal}}, list all matches instead of silently picking the most likely one.
- End with a one-line confidence note: high, medium, or low, and what would resolve it if not high, for example a higher-resolution version or a different angle.`,
    variables: [
      {
        name: 'extraction_goal',
        description: 'Exactly what you need pulled out of the image.',
        example: 'The vendor name, invoice number, and every line-item amount',
        required: true,
      },
      {
        name: 'output_format',
        description:
          'How the extracted information should be structured in the response.',
        example: 'A table with columns: field, value, confidence',
        required: true,
      },
    ],
    targetTools: ['ChatGPT (Vision, GPT-5.1)'],
    tags: ['vision', 'image-analysis', 'document-extraction', 'multimodal'],
    whyItWorks:
      'Vision models are documented to hallucinate plausible values for illegible or occluded regions of an image rather than reporting uncertainty by default, because the underlying generation objective favors a fluent, complete-looking answer over an honest gap, the same fluency-over-accuracy tendency text generation has, applied to pixels instead of facts. Instructing it to flag illegibility per item, rather than trusting a single end-of-response caveat, keeps the uncertainty attached to the specific value it belongs to instead of a blanket disclaimer that does not tell you which number to actually go double-check. The rule against inferring a typical value targets a specific vision failure mode on documents like receipts and invoices: the model has seen enough receipts with a printed subtotal that summing line items to a plausible total, when no total field is actually shown, is a completed pattern it is inclined to finish even though nothing asked it to compute anything. Asking for all matches rather than the single most likely one prevents silent disambiguation on an image with, say, two dates or two totals visible, where a confident wrong guess is worse than a surfaced ambiguity you can resolve yourself in two seconds.',
    exampleOutput:
      '| field | value | confidence |\n|---|---|---|\n| vendor name | Riverside Office Supply | high |\n| invoice number | INV-08841 | high |\n| line item 3 amount | $4?.50, last digit obscured by a fold in the paper | low |\nConfidence note: medium overall, a straighter photo of the bottom third of the invoice would resolve the one unclear amount.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Vision)', date: '2026-07-02' },
    ],
    changelog: [
      {
        date: '2026-07-02',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 Vision.',
      },
    ],
  },
  {
    slug: 'chatgpt-weighted-decision-matrix-builder',
    category: 'chatgpt',
    title: 'Turn a hard choice into a weighted decision matrix instead of a gut call',
    description:
      'A three-step weighted-scoring prompt that confirms criteria weights before scoring, shows the justification behind every score, and checks whether the winning option would flip under a small weight change.',
    promptText: `Help me decide between these options using a weighted decision matrix, not a narrative recommendation.

DECISION
{{decision}}

OPTIONS
{{options}}

CRITERIA THAT MATTER TO ME
{{criteria}}

STEP 1 — WEIGHTS
Propose a weight out of 10 for each criterion based on what I described above, and ask me to confirm or adjust before scoring anything. Do not invent a criterion I did not list unless you flag it separately as a suggested addition.

STEP 2 — SCORING
Once weights are confirmed, score every option against every criterion on a 1 to 5 scale with one sentence of justification per score, no unexplained numbers. Put this in a table: options as rows, criteria as columns, weighted total as the last column.

STEP 3 — SENSITIVITY CHECK
Tell me if the ranking is close. Specifically, name the smallest weight change on any single criterion that would flip the top choice. If the top two options are within 10% of each other's weighted total, say explicitly that the matrix is not decisive and name the real tiebreaker factor a spreadsheet cannot capture.

Do not tell me what to choose outside of this structure. Show the matrix and let the numbers make the case, or explicitly say they do not.

If your ChatGPT plan exposes a reasoning effort control for GPT-5.1, set it to high before running this. Keeping every score and the sensitivity check internally consistent benefits from extra thinking time, not the default setting.`,
    variables: [
      {
        name: 'decision',
        description: 'The choice being made, stated as a single question.',
        example: 'Which project management tool should our 15-person team switch to?',
        required: true,
      },
      {
        name: 'options',
        description: 'The specific options under consideration.',
        example: 'Linear, Asana, and staying on Trello',
        required: true,
      },
      {
        name: 'criteria',
        description: 'What actually matters for this decision, in your own words.',
        example:
          'Ease of onboarding non-technical teammates, integration with our existing Slack and GitHub setup, and price at our headcount',
        required: true,
      },
    ],
    targetTools: ['ChatGPT (GPT-5.1)'],
    tags: [
      'decision-making',
      'comparison-framework',
      'weighted-scoring',
      'structured-thinking',
    ],
    whyItWorks:
      'Asking directly for a recommendation invites a persuasive-sounding narrative that can rationalize essentially any conclusion, while forcing per-criterion, per-option scores with a one-sentence justification for every cell makes the reasoning auditable line by line instead of hidden inside prose that reads confidently regardless of whether the underlying comparison actually supports it. Requiring weight confirmation before any scoring happens prevents a subtler bias: a model that scores first and derives weights to match afterward tends to unconsciously produce numbers that support whatever conclusion it would have narratively recommended anyway, rather than weights that reflect what you actually said mattered. The sensitivity check is the most load-bearing step here: a weighted matrix that flips its top choice with a small nudge to one weight is not actually decisive, it only looks decisive because it produced a single ranked number, and naming that fragility explicitly stops the output format itself, a number with two decimal places, from lending false confidence to what is genuinely a close call that should come down to a factor the matrix cannot quantify.',
    exampleOutput:
      'Weights confirmed: onboarding ease 8, integrations 7, price 6. Scoring table shows Linear at 5.4 weighted total, Asana at 5.1, Trello at 3.2. Sensitivity check: Linear and Asana are within 6% of each other, so a one-point increase to the price weight alone would flip the top choice to Asana. The matrix calls this close, not decisive, and flags team familiarity with the tool as the real tiebreaker it cannot score.',
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against ChatGPT GPT-5.1.',
      },
    ],
  },
]
