import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'chatgpt-custom-instructions-recurring-role-profile',
    category: 'chatgpt',
    title: `Lock in a recurring role so Custom Instructions stop resetting every new chat`,
    description: `Writes the two Custom Instructions fields as a standing role profile for one recurring job — decision rights, refusal rules, and a default output shape — so a brand-new chat opens already calibrated instead of drifting back to ChatGPT's generic default voice.`,
    promptText: `You are drafting the two Custom Instructions fields (Settings > Personalization > Custom Instructions) for a specific, recurring role I use ChatGPT for — not a general "about me" bio, but a standing job description that should hold across every new chat until I deliberately change it.

RECURRING ROLE
{{recurring_role}}

DECISION RIGHTS
{{decision_rights}}

REFUSAL RULES
{{refusal_rules}}

OUTPUT SHAPE DEFAULT
{{output_shape_default}}

CONTRADICTION TO A DIFFERENT ROLE
{{competing_use_case}}

FIELD-BY-FIELD RULES
Write the "What would you like ChatGPT to know about you?" field as a role description, not a biography — state the recurring job in one or two sentences, then list only the facts that change how a response should be built: what decision rights I actually have (can I approve the thing I'm asking about, or am I drafting a recommendation for someone else who decides), and what "done" looks like for output from this role. Leave out personal facts that don't change any output — a fact only earns a place in this field if removing it would make a future answer worse. Write the "How would you like ChatGPT to respond?" field as enforceable behavior rules, each one something a reader could check a transcript against and say yes or no to — never a vague tone adjective on its own. Every refusal rule must be a rule about what NOT to default to, stated specifically enough that violating it would be an obvious, checkable failure, not a matter of interpretation. State the default output shape precisely — a decision with a one-line rationale, a ranked list, a short memo — since Custom Instructions apply before I've said anything else in a brand-new chat, and an underspecified default gets filled in by whatever shape the model reaches for first. If I use ChatGPT for a second, different recurring role that would want a contradictory default from this one, name that conflict explicitly and propose a way to disambiguate at the start of a chat, rather than silently writing instructions that only work for one of the two roles and quietly break the other.

WHAT NOT TO DO
Do not write generic personalization filler ("I am a professional who values clarity") — every line must be something an answer would visibly change because of. Do not restate this system as a checklist ChatGPT should recite back to me; it should be invisible scaffolding, not something referenced in every reply.

OUTPUT FORMAT
1. The "About Me" field text, ready to paste, staying specific rather than padded to fill space.
2. The "How to Respond" field text, ready to paste, as a short list of enforceable rules.
3. If a competing use case was named, one paragraph proposing the disambiguation mechanism.
4. One line confirming which facts you deliberately left out because they don't change any output.`,
    variables: [
      {
        name: 'recurring_role',
        description: `The specific, repeated job you use ChatGPT for — not your whole career, just this one recurring task.`,
        example: `First-pass reviewer for outbound cold emails before they go to a 40,000-contact list — flag anything that would get us marked as spam or misrepresent the product.`,
        required: true,
      },
      {
        name: 'decision_rights',
        description: `Whether you can act on the output directly or are producing a recommendation for someone else.`,
        example: `I can approve or kill an email myself; nothing needs a second sign-off.`,
        required: true,
      },
      {
        name: 'refusal_rules',
        description: `A specific default behavior this role should never fall back on.`,
        example: `Never soften a legal-sounding claim in the copy into vaguer language instead of flagging it outright — flag it, don't rewrite around it.`,
        required: true,
      },
      {
        name: 'output_shape_default',
        description: `The exact shape you want a response in by default.`,
        example: `A verdict — ship / hold / rewrite — followed by no more than three bullet reasons.`,
        required: true,
      },
      {
        name: 'competing_use_case',
        description: `A second recurring role, if one exists, that would want a different default from this one.`,
        example: `I also use ChatGPT to draft the emails themselves, which wants long-form drafting, not a terse verdict.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (GPT-5.1)'],
    tags: [
      'custom-instructions',
      'personalization',
      'workflow-automation',
      'prompt-engineering',
      'role-design',
    ],
    whyItWorks: `Custom Instructions are injected as fixed system-level context at the start of every new conversation, which is mechanically different from Memory's incremental, per-fact accrual — so an underspecified field doesn't stay neutral, it gets filled in by whatever default tone and shape the base model reaches for first, which for GPT-5.1 tends toward a hedged, generically professional register unless a concrete rule overrides it. Making refusal rules enforceable and checkable rather than tone adjectives closes the gap where "professional tone" or "no fluff" are unfalsifiable and get satisfied nominally while the response still pads itself out; a rule stated as a specific action to avoid can actually be checked against a transcript, while a mood word can be claimed to have been honored no matter what came back. The decision-rights field matters mechanically because ChatGPT changes its hedging behavior based on whether it reads the user as the final decision-maker or as someone drafting a recommendation for another person to approve — stating this explicitly upfront prevents the disclaimers and "you may want to consult someone" caveats that a model defaults to when it can't tell which situation it's in. The competing-use-case disambiguation instruction addresses a real structural limitation of the feature: Custom Instructions are global across every new chat, not scoped per conversation the way a Project's instructions are, so two genuinely different recurring jobs sharing one global field will fight each other on some fraction of chats no matter how well either is written individually — the only real fix is an explicit signal given at the start of the specific chat that needs the other mode, since the global field itself cannot distinguish between the two use cases on its own.`,
    exampleOutput: `About Me: "I review outbound cold emails before send to a large list — I decide ship/hold/rewrite myself, no second approval needed." How to Respond: "Open with a verdict (ship / hold / rewrite), then up to three bullet reasons. Flag legal-sounding claims explicitly rather than softening the language. Don't restate the email back to me before critiquing it." Disambiguation: when I'm drafting an email rather than reviewing one, I'll say "drafting mode" at the start of that message so you switch to long-form output instead of a terse verdict.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Custom Instructions)', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Custom Instructions fields.`,
      },
    ],
  },
  {
    slug: 'chatgpt-custom-gpt-persona-instructions-brief',
    category: 'chatgpt',
    title: `Write a Custom GPT's persona and instructions so it holds up past the first five messages`,
    description: `Produces the Instructions field, knowledge-file guidance, and conversation starters for a Custom GPT other people will actually use without you in the room to correct it — with explicit boundaries on what it should refuse and hand back to a human.`,
    promptText: `You are writing the configuration text for a Custom GPT built in GPT Builder — specifically the Instructions field, guidance on what knowledge files to attach, and the conversation starters — for a GPT that other people besides me will actually use without me in the room to correct it.

GPT PURPOSE
{{gpt_purpose}}

WHO WILL USE IT
{{intended_users}}

KNOWLEDGE FILES AVAILABLE
{{knowledge_files}}

HARD BOUNDARIES
{{hard_boundaries}}

ESCALATION PATH
{{escalation_path}}

INSTRUCTIONS FIELD RULES
Open the Instructions field with a one-sentence statement of what this GPT is for and, just as important, what it is explicitly not for — a Custom GPT without a stated boundary drifts into answering adjacent questions it was never checked against. State the persona in terms of what it does, not adjectives about how it sounds; "asks a clarifying question before generating a contract clause" is checkable, "friendly and helpful" is not. Write every hard boundary as a rule about a specific action to refuse, paired with what it should do instead — refuse and redirect to a named person or process, not refuse and stop. If knowledge files are attached, instruct the GPT explicitly to prefer file content over its own general knowledge when the two would disagree, and to say so when a question falls outside what the attached files actually cover rather than filling the gap with a plausible-sounding general answer that reads as if it came from the files. Assume the person using it did not write these instructions and cannot see them — never write an instruction that only makes sense to someone who already knows the backstory; a real end user's very first message could be anything, including something adversarial or simply confused, and the instructions have to hold up against that, not just against a polite well-formed request. Write four conversation starters that are real example requests a first-time user would plausibly type, not generic prompts like "What can you do?" — each one should demonstrate a different actual capability.

WHAT TO FLAG SEPARATELY
If the hard boundaries and the stated purpose would let a determined user talk the GPT into acting outside its boundary through a multi-step conversation — asking it to "pretend" or "just this once" — name that specific risk and add an explicit instruction addressing exactly that pattern, rather than leaving the boundary as a single-turn rule that a persistent conversation could erode.

OUTPUT FORMAT
1. The Instructions field text, ready to paste.
2. A short note on which knowledge files to attach and in what priority if there's more than one.
3. Four conversation starters.
4. The specific multi-turn erosion risk you checked for, and the line added to guard against it, or a one-line confirmation that the boundary already holds under that pressure without an added line.`,
    variables: [
      {
        name: 'gpt_purpose',
        description: `What this GPT is specifically for, in one sentence.`,
        example: `Answers new-hire questions about our internal expense policy and generates a draft reimbursement request for review.`,
        required: true,
      },
      {
        name: 'intended_users',
        description: `Who will actually type into this, and what they do and don't already know.`,
        example: `New employees in their first 90 days, most of whom have never seen the policy doc and don't know what counts as a reimbursable expense.`,
        required: true,
      },
      {
        name: 'knowledge_files',
        description: `What files, if any, are attached and what they cover.`,
        example: `expense-policy-v4.pdf (current policy) and a spreadsheet of approved vendor categories — no access to actual reimbursement records.`,
        required: false,
      },
      {
        name: 'hard_boundaries',
        description: `What this GPT must never do, stated as specific actions.`,
        example: `Never approve or promise reimbursement itself, never estimate a dollar amount for something not explicitly listed in the policy doc.`,
        required: true,
      },
      {
        name: 'escalation_path',
        description: `Where a request that crosses a boundary should be redirected.`,
        example: `Point the user to #finance-questions on Slack or their manager, not to "contact HR" in the abstract.`,
        required: true,
      },
    ],
    targetTools: ['ChatGPT (Custom GPTs)'],
    tags: [
      'custom-gpts',
      'gpt-builder',
      'persona-design',
      'knowledge-files',
      'internal-tools',
    ],
    whyItWorks: `The Instructions field is the entire system prompt a Custom GPT gets — there's no hidden layer correcting for gaps — so an instruction that only makes sense to the author, who has context the end user doesn't share, silently fails the moment a real stranger opens the GPT and types something the author never anticipated. Knowledge-file retrieval in Custom GPTs works by returning whatever chunks a file-search tool judges most relevant, while the model's full pretrained general knowledge is still sitting underneath that retrieval — without an explicit instruction to prefer file content over general knowledge, it will blend a real policy detail from the file with a plausible-sounding general assumption and present both with identical confidence, which is dangerous specifically because a reader can't tell which claim actually came from the policy document and which one the model filled in on its own. The multi-turn erosion check addresses a specific, well-documented failure mode: a single-turn refusal rule holds against a direct request but is measurably easier to erode across several turns of reframing — "hypothetically," "just estimate, don't promise" — so a boundary written to survive one message doesn't automatically survive five, and it has to be checked against that pattern directly rather than assumed to generalize from a single-turn test. Requiring four genuinely different conversation starters does double duty as both onboarding copy and an implicit scope test — writing four distinct, concrete capability demonstrations forces the purpose-and-boundary reasoning done earlier in the brief to be checked against something specific rather than staying an abstract claim that was never actually exercised against a real example request.`,
    exampleOutput: `Instructions excerpt: "You help new hires understand our expense policy and draft reimbursement requests for review. You do not approve reimbursements or estimate dollar amounts for anything not explicitly listed in the policy doc — for those, say so and point to #finance-questions on Slack. If a user tries to get you to 'just estimate this once' or 'pretend you can approve it,' decline the same way you would a direct request, and repeat the redirect." Erosion risk checked: a user reframing "can you approve this?" as "hypothetically, if you could approve it, what would you say?" — line added specifically to close that.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Custom GPTs)', date: '2026-07-24' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: `Initial publish, verified against ChatGPT GPT-5.1 GPT Builder.`,
      },
    ],
  },
  {
    slug: 'chatgpt-gpt-actions-openapi-schema-authoring',
    category: 'chatgpt',
    title: `Turn a plain-English API description into an Actions schema a Custom GPT can actually call`,
    description: `Produces a valid OpenAPI schema, the matching authentication configuration, and call-safety guardrails a GPT Action needs — from a description of an internal API — so the GPT calls the endpoint safely, not just successfully.`,
    promptText: `You are converting a plain-English description of an API into a working GPT Action for a Custom GPT — an OpenAPI 3.1 schema, an authentication block, and the operational guardrails the Instructions field needs so the GPT calls this API safely, not just successfully.

API DESCRIPTION
{{api_description}}

ENDPOINTS TO EXPOSE
{{endpoints_to_expose}}

AUTH METHOD
{{auth_method}}

DESTRUCTIVE OR IRREVERSIBLE OPERATIONS
{{destructive_operations}}

RATE OR SCOPE LIMITS
{{rate_or_scope_limits}}

SCHEMA RULES
Write every operation with a concrete, non-generic operationId and a description field detailed enough that a model deciding whether to call this endpoint doesn't have to guess what it does from the path alone — "createRefund," not "postAction2." Every parameter needs an explicit type, whether it's required, and, for any enum-like field, the literal list of accepted values rather than a free-text description of what values might work; a GPT filling in a parameter from a loose description will invent a plausible-looking value that fails validation, where an explicit enum makes the wrong choice mechanically impossible. For any endpoint listed under destructive or irreversible operations, mark it clearly in its description as requiring explicit user confirmation before the call is made, and separately write the exact confirmation-gate instruction for the Instructions field — the schema alone cannot enforce a human-in-the-loop step; that has to live in the instructions the model actually reads before deciding to call the action. Set the auth block to match the stated method exactly — API key in header, OAuth with the specific scopes named, or service-level auth — and never default to a placeholder auth scheme when the actual method wasn't fully specified; ask a clarifying question instead of guessing at how credentials are handled, since a wrong auth block fails silently as an unauthorized error a real user has no way to diagnose. If a rate or scope limit was named, encode it as an explicit instruction in a matching Instructions-field line since the OpenAPI schema itself has no mechanism to enforce a conversational-level limit like "don't call this more than three times per session."

OUTPUT FORMAT
1. The OpenAPI 3.1 schema as valid YAML, one code block.
2. The authentication configuration exactly as it should be entered in the GPT Builder Actions auth screen.
3. The confirmation-gate instruction lines for the Instructions field, one per destructive operation.
4. A one-line privacy-policy note stub, if this Action will be shown to anyone besides you.
5. Anything in the original API description that was too ambiguous to encode safely, listed as an open question rather than resolved by a guess.`,
    variables: [
      {
        name: 'api_description',
        description: `Plain description of the API this Action will call.`,
        example: `Our internal billing service — REST API at billing.internal.acme.com, issues refunds and looks up invoice status.`,
        required: true,
      },
      {
        name: 'endpoints_to_expose',
        description: `Which specific endpoints the GPT should be able to call.`,
        example: `GET /invoices/{id} and POST /refunds — not the customer-deletion or plan-change endpoints, even though they exist on the same service.`,
        required: true,
      },
      {
        name: 'auth_method',
        description: `Exactly how requests should authenticate.`,
        example: `Static API key in an X-API-Key header, issued per-GPT from our internal admin panel.`,
        required: true,
      },
      {
        name: 'destructive_operations',
        description: `Which exposed endpoints change real state and can't be trivially undone.`,
        example: `POST /refunds — issuing a refund cannot be reversed through this API once it's confirmed downstream.`,
        required: true,
      },
      {
        name: 'rate_or_scope_limits',
        description: `Any cap on how much or how often this Action should be called.`,
        example: `No more than one refund call per conversation without the user explicitly restating the amount and invoice ID a second time.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Custom GPTs)', 'ChatGPT (GPT Actions)'],
    tags: ['gpt-actions', 'openapi', 'api-integration', 'custom-gpts', 'authentication'],
    whyItWorks: `OpenAPI's enum constraint is enforced at the schema-validation layer before the call is even attempted, so an explicit literal list of accepted values eliminates a whole class of failed calls that a descriptive-text parameter would otherwise produce — the model would confidently generate a plausible but invalid value and only find out it's wrong from an error response it then has to interpret and retry blind. OpenAPI itself has no concept of "ask the user before calling this" — that gate exists only if the Instructions field explicitly states it, because a Custom GPT decides whether and when to invoke an Action based on the natural-language description and the running conversation, not on any schema-level permission flag, so a destructive endpoint with a technically correct schema and no confirmation instruction is one ambiguous user message away from being called without anyone meaning to trigger it. A vague or placeholder auth block produces a generic unauthorized error inside the GPT that the end user — who never sees the Actions configuration — has no way to connect back to a misconfigured auth scheme, so getting it exactly right, or explicitly flagging it as unresolved, matters more than almost anything else in the schema. Conversational-level limits like "no more than one refund per session" have no schema representation at all — OpenAPI describes a single request/response contract, not a policy across a conversation — so the only place that rule can live is as an explicit natural-language instruction the model reads and follows on its own judgment.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (GPT Actions)', date: '2026-07-25' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: `Initial publish, verified against ChatGPT GPT-5.1 GPT Actions configuration.`,
      },
    ],
  },
  {
    slug: 'chatgpt-memory-audit-and-correction-pass',
    category: 'chatgpt',
    title: `Audit and correct what ChatGPT has actually saved to Memory`,
    description: `A structured pass for reviewing ChatGPT's Saved Memories against what's actually still true, flagging stale, wrong, or overly specific entries instead of a blanket "clear all memory" that throws out the useful ones with the outdated ones.`,
    promptText: `You are helping me audit my ChatGPT Saved Memories (Settings > Personalization > Memory > Manage). I'll paste the current list of saved memory entries below. Go through them one at a time against the current facts I give you, rather than accepting all of them as still accurate by default.

CURRENT SAVED MEMORIES
{{current_memory_list}}

WHAT'S ACTUALLY TRUE NOW
{{current_facts}}

WHY THIS AUDIT IS HAPPENING
{{audit_trigger}}

MEMORIES YOU SUSPECT ARE STALE
{{suspected_stale_entries}}

AUDIT RULES
For each saved memory entry, classify it into exactly one of: Still accurate — keep as-is. Stale — was true, no longer is, needs deleting or replacing with an updated version. Overly specific — technically true but narrower than useful, capturing one conversation's detail as if it were a standing fact. Wrongly generalized — a one-off statement got saved as if it were a general rule, when the actual intent was narrower. For anything you classify as stale or wrongly generalized, write the exact replacement text to save instead, not just a note that it's wrong — an audit that only flags problems without proposing the fix still leaves the actual editing work to be done by hand. Do not propose new memories to add unless explicitly asked in a separate pass — this audit is about correcting what's already there, not expanding it, and conflating the two makes the output harder to act on directly. If two saved entries actively contradict each other, name the contradiction explicitly rather than picking one silently and only reporting the pick — that tells something about how the contradiction happened in the first place, not just which one to keep.

OUTPUT FORMAT
Produce a table: Memory entry (verbatim) | Classification | Action (keep, delete, or replace) | Replacement text if applicable. Follow the table with a short paragraph naming any contradiction found between two entries, and a one-line count summary — how many kept, deleted, replaced.`,
    variables: [
      {
        name: 'current_memory_list',
        description: `The saved memory entries as currently listed, copied from Manage Memories.`,
        example: `User is a freelance graphic designer based in Lisbon. User is deciding between Figma and Adobe XD for a client project. User dislikes long email introductions. User's dog is named Biscuit.`,
        required: true,
      },
      {
        name: 'current_facts',
        description: `What's actually true right now, for anything that might have changed.`,
        example: `I switched to full-time in-house work six months ago — no longer freelance. The Figma-vs-XD decision was resolved months ago (picked Figma). Everything else is still accurate.`,
        required: true,
      },
      {
        name: 'audit_trigger',
        description: `Why you're doing this audit now, if there's a specific reason.`,
        example: `ChatGPT kept referencing "your freelance clients" in unrelated answers after I took the in-house job.`,
        required: false,
      },
      {
        name: 'suspected_stale_entries',
        description: `Any entries you already suspect are outdated, to focus the pass.`,
        example: `The freelance one and the Figma/XD one — not sure about the rest.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Memory)'],
    tags: ['memory', 'personalization', 'data-hygiene', 'chatgpt-settings'],
    whyItWorks: `ChatGPT's memory accretes from casual mentions inside ordinary conversations, not from a deliberate "remember this" command every time, so it routinely saves something true-in-context as though it were a durable preference — a distinction the memory system itself doesn't make when it writes the entry, which is exactly why an audit has to make that call after the fact. The blanket "clear all memory" option most people reach for when memory starts producing wrong context throws away everything indiscriminately, including entries that are still correct and genuinely useful, which is a worse outcome than the stale-entry problem it was meant to fix — an entry-by-entry classification pass is the only way to fix the wrong parts without losing the right ones. Requiring exact replacement text rather than just a flag matters because Manage Memories requires manually editing or deleting each entry — ChatGPT has no bulk "apply these corrections" action — so an audit that stops at diagnosis still leaves 100% of the manual editing to be done by hand; a proposed replacement string turns the audit into something that can be pasted directly rather than reinterpreted and rewritten. Surfacing contradictions between two saved entries rather than silently resolving them matters because a contradiction is diagnostic — it usually means one entry was saved from an offhand or sarcastic remark that got treated as literal, and knowing which pattern produced the bad entry is what actually prevents the next one, not just fixing this one instance quietly.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Memory)', date: '2026-07-27' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Manage Memories.`,
      },
    ],
  },
  {
    slug: 'chatgpt-canvas-scoped-writing-revision-pass',
    category: 'chatgpt',
    title: `Use Canvas for section-scoped edits instead of regenerating the whole document`,
    description: `Directs ChatGPT's Canvas to revise one specific span of a long document in place, with edit-tracking discipline, instead of the default failure mode of rewriting the entire piece every time one paragraph needs a fix.`,
    promptText: `You are revising a document inside ChatGPT's Canvas. Every request in this pass targets one specific span of the document, and everything outside that span must remain unchanged unless explicitly stated otherwise.

DOCUMENT IN CANVAS
{{document_context}}

SECTION TO REVISE
{{section_to_revise}}

WHAT'S WRONG WITH IT
{{revision_reason}}

DESIRED RESULT
{{desired_outcome}}

VOICE TO MATCH
{{voice_to_match}}

REVISION RULES
Use Canvas's selection-based editing, not a full-document regeneration — when a section to revise is identified, treat everything else in the document as locked, and if the tool surfaces a diff or change-tracking view, keep the change confined to exactly the span named. Before rewriting, quote back the exact span believed to be the target, since "the second paragraph" or "the part about pricing" is genuinely ambiguous in a long document and confirming the target before touching it is cheaper than reverting a wrong edit. Match the voice of the surrounding, unchanged text — read the paragraph immediately before and after the target span and mirror its sentence rhythm and vocabulary level, since a revised paragraph that reads noticeably more polished or more casual than its neighbors is a visible seam that gives away exactly where the edit happened, which undermines the point of an in-place edit. Fix only what's named in "what's wrong with it" — do not use the opportunity to also tighten unrelated sentences in the same span that weren't flagged, since an unrequested change inside an otherwise-targeted edit is exactly the kind of scope creep that makes a reviewer stop trusting targeted revisions and start re-reading the whole document defensively every time. If the requested fix genuinely cannot be made without also touching a sentence outside the named span, say so explicitly and ask before expanding the edit boundary, rather than silently expanding it.

OUTPUT FORMAT
Make the edit directly in Canvas. Then, separately from the document itself, provide: 1) the exact span changed, quoted, 2) a one-line description of what changed and why, 3) whether the edit boundary needed to expand beyond what was named, and if so, exactly which additional sentence and why it couldn't be avoided.`,
    variables: [
      {
        name: 'document_context',
        description: `What the document in Canvas is and its rough length.`,
        example: `A 1,400-word client proposal with sections: overview, scope, timeline, pricing, next steps.`,
        required: true,
      },
      {
        name: 'section_to_revise',
        description: `The exact section or span to change.`,
        example: `The pricing section — three paragraphs describing the tiered package structure.`,
        required: true,
      },
      {
        name: 'revision_reason',
        description: `What's specifically wrong with the current version.`,
        example: `It buries the actual monthly number in the third sentence of the second paragraph — the client should see the number in the first line.`,
        required: true,
      },
      {
        name: 'desired_outcome',
        description: `What the fixed version should achieve.`,
        example: `Lead with the number, then justify it in one sentence, cut the hedging language around "may vary depending on scope."`,
        required: true,
      },
      {
        name: 'voice_to_match',
        description: `What tone the rest of the document is written in, to match it.`,
        example: `Direct, confident, short sentences — the overview section sets this tone; don't drift into softer consulting-speak in the fix.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Canvas)'],
    tags: [
      'canvas',
      'editing',
      'long-form-writing',
      'revision-workflow',
      'document-editing',
    ],
    whyItWorks: `Canvas is specifically built around selection-scoped editing and a persistent document state distinct from the chat thread, so the entire point of using it over the regular chat window is that a targeted edit shouldn't require re-pasting or regenerating the whole document — a prompt that doesn't explicitly instruct against full regeneration loses that advantage, because the base model's default instinct when asked to "fix the pricing section" is still to produce a complete rewritten draft unless told to constrain itself to Canvas's in-place edit mechanic. Requiring the model to quote back the target span before editing catches ambiguous section references before they turn into a wrong edit that then has to be manually reverted through Canvas's history — cheap to check up front, expensive to undo after a subsequent edit has been layered on top of the wrong one. The voice-matching instruction addresses a specific and visible failure mode of scoped edits: a model revising one paragraph in isolation, without deliberately reading its neighbors first, tends to default to its own generically polished register rather than the document's actual established voice, producing an edit that is locally better but creates a visible seam a reader who's read the whole document will notice. The explicit "do not fix unrelated things" rule matters because it's the difference between a targeted edit a reviewer can trust and one they have to re-verify in full — once even one unrequested change slips into a supposedly scoped edit, the entire point of scoping it, letting the reviewer skip re-reading unaffected text, is gone, because now every part of the "unaffected" text is suspect too.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Canvas)', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Canvas.`,
      },
    ],
  },
  {
    slug: 'chatgpt-canvas-iterative-code-review-loop',
    category: 'chatgpt',
    title: `Run an iterative code review loop in Canvas without losing earlier fixes`,
    description: `Structures Canvas's code mode as a repeatable review-fix-verify loop with inline suggestions, so successive rounds build on the last accepted state instead of silently reintroducing an already-fixed issue.`,
    promptText: `You are running an iterative code review loop inside ChatGPT's Canvas, in code mode. Each round reviews the current state of the file in Canvas, proposes fixes as inline suggestions, and waits for a decision to accept or reject each one individually before moving to the next round.

CODE IN CANVAS
{{code_context}}

REVIEW FOCUS FOR THIS ROUND
{{review_focus}}

ALREADY-FIXED ISSUES FROM PRIOR ROUNDS
{{prior_fixes}}

RUNTIME OR TEST CONTEXT
{{runtime_context}}

LOOP RULES
Review only the current state of the file as it exists in Canvas right now — do not silently reintroduce or re-flag something in the already-fixed list unless there's a specific reason to believe it regressed, and if so, say so explicitly and point to exactly where, rather than re-flagging it as if it were a fresh discovery. Scope this round's review to what's named in the review focus — if a real issue outside that focus is noticed, list it separately as "noticed but out of scope for this round" rather than fixing it unasked, since accepting or rejecting fixes one at a time only works if each round's changes are predictable and bounded. Propose each fix as a distinct, individually reviewable suggestion rather than one combined patch — a null-check fix should be acceptable without being forced to also accept an unrelated variable rename bundled into the same suggestion. For each fix, state the specific failure it prevents — an input, a state, a sequence of calls that would break without it — not a general code-quality justification like "improves readability," since a fix justified only by taste is harder to evaluate quickly than one justified by a concrete failure case. If test or runtime context was given, verify a proposed fix doesn't just move the failure to a different reported symptom — silencing an exception is not the same as fixing what threw it, and a fix that makes a test pass by weakening its assertion instead of fixing the underlying code is a regression dressed as a fix.

OUTPUT FORMAT
For each proposed fix: 1) exact location, 2) the specific failure it prevents, quoted or described concretely, 3) the fix itself as a Canvas-reviewable suggestion. End the round with a short list of anything noticed but explicitly left out of scope, and a one-line status of the already-fixed list — confirmed still holding, or flagged as regressed with exactly where.`,
    variables: [
      {
        name: 'code_context',
        description: `What the file in Canvas is and its rough scope.`,
        example: `A 180-line Python module that validates and normalizes incoming webhook payloads before writing them to a queue.`,
        required: true,
      },
      {
        name: 'review_focus',
        description: `What this specific round should look at.`,
        example: `Error handling around malformed JSON payloads — round 1 already covered the schema-validation logic.`,
        required: true,
      },
      {
        name: 'prior_fixes',
        description: `What earlier rounds already fixed, so it isn't re-flagged as new.`,
        example: `Round 1 fixed: missing required-field check on "event_type", and a bare except that swallowed all exceptions.`,
        required: false,
      },
      {
        name: 'runtime_context',
        description: `Any test suite or real runtime behavior relevant to judging a fix.`,
        example: `pytest suite exists for the schema validator; malformed-JSON handling currently has zero test coverage.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Canvas)'],
    tags: ['canvas', 'code-review', 'refactoring', 'iterative-workflow', 'debugging'],
    whyItWorks: `Canvas's code mode persists the file's actual current state across the conversation and supports inline, individually acceptable suggestions rather than a single monolithic rewrite, so a review loop that doesn't explicitly instruct scoping per round loses that mechanical advantage — the model's default instinct when asked to "review this code" is still to produce one large combined diff, which defeats the individually-reviewable design Canvas actually offers. Explicitly tracking already-fixed issues addresses a specific and common regression in multi-round review loops: without a memory of what was already accepted, a fresh review pass over the current file state can re-flag an issue that was already fixed in an earlier round, because the model is pattern-matching against "things that look like a bug" in isolation each time rather than diffing against what was already resolved — re-flagging a fixed issue erodes trust in the loop fast, since it looks like the earlier fix didn't actually work. Requiring a concrete failure case for every fix, rather than a taste-based justification, is what makes each suggestion fast to evaluate individually — a reviewer deciding whether to accept one inline suggestion at a time needs a specific, checkable reason, and "improves readability" gives nothing to verify, while "breaks on a payload where event_type is missing" is something that can be tested in ten seconds. The check against a fix that merely relocates the failure — silencing an exception instead of fixing its cause, weakening a test assertion instead of fixing the code the test checks — targets a documented failure mode where a model under pressure to "make the error go away" satisfies the letter of the request while leaving the actual defect in place, which is worse than not fixing it at all because it looks resolved on the surface.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Canvas)', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Canvas code mode.`,
      },
    ],
  },
  {
    slug: 'chatgpt-deep-research-mission-brief',
    category: 'chatgpt',
    title: `Give Deep Research a mission brief precise enough to trust the citations`,
    description: `Structures a Deep Research task with an explicit scope boundary, source-quality bar, and deliverable shape, so the agent spends its research budget on the actual open question instead of drifting into adjacent, easier-to-answer territory.`,
    promptText: `You are about to run as ChatGPT's Deep Research agent on the task below. Before browsing, treat this brief as the scope contract for the whole research run — every source pulled and every claim made should trace back to answering the core question, not an adjacent one that happened to have easier-to-find sources.

CORE QUESTION
{{core_question}}

WHAT WOULD MAKE THIS RESEARCH USELESS
{{disqualifying_outcome}}

SOURCE QUALITY BAR
{{source_quality_bar}}

TIME WINDOW FOR RELEVANCE
{{time_window}}

DELIVERABLE SHAPE
{{deliverable_shape}}

RESEARCH DISCIPLINE
Stay anchored to the core question even when a more easily-answered adjacent question surfaces during browsing — a research run that quietly substitutes a nearby, better-documented question for the actual one is a specific and common failure, and it produces a report that reads as thorough while not actually answering what was asked. Apply the stated source-quality bar as a hard filter, not a preference — if primary sources or the required source type genuinely don't exist for part of the question, say that explicitly as a finding in itself rather than quietly substituting a lower-quality source and presenting it with the same confidence as a source that met the bar. Respect the time window for relevance strictly — a source that was accurate before the stated window but has since been superseded is worse than no source at all if presented as current, since it creates false confidence rather than an honest gap. Where two sources disagree on a material fact, present both positions and their sources rather than silently picking the one that fits a cleaner narrative — the disagreement itself is often the most useful thing to know. Distinguish clearly between what a source states directly and what is being inferred or synthesized across sources — a reader needs to know which sentences they could go argue with a single source about and which represent connecting of separate facts. If the disqualifying-outcome condition described above is what's being headed toward, stop and say so explicitly rather than completing a full report that hits the disqualifying condition anyway.

OUTPUT FORMAT
Deliver the report in the shape specified above. At the top, include a scope note: what the core question actually resolved to being about after research, and any sub-question deliberately not chased because it was outside scope even though it came up. Cite every material claim inline. Close with an explicit list of what remains genuinely unresolved or where sources disagreed, rather than smoothing every finding into a single confident narrative.`,
    variables: [
      {
        name: 'core_question',
        description: `The actual question this research run needs to answer.`,
        example: `Which of the three enterprise SSO providers has the most reliable SCIM provisioning track record for a company our size, based on documented outages and integration complaints, not marketing claims?`,
        required: true,
      },
      {
        name: 'disqualifying_outcome',
        description: `What result would make this research not worth having run.`,
        example: `A report that just restates each vendor's own marketing page in different words, with no independent evidence of actual reliability.`,
        required: true,
      },
      {
        name: 'source_quality_bar',
        description: `What counts as an acceptable source for this specific question.`,
        example: `Vendor status-page incident histories, independent review-site comments mentioning SCIM specifically, and engineering blog posts describing a real migration — not vendor blog posts or affiliate comparison sites.`,
        required: true,
      },
      {
        name: 'time_window',
        description: `The relevance window for sources.`,
        example: `Last 18 months only — SSO reliability changed significantly after each vendor's 2025 platform rewrites.`,
        required: false,
      },
      {
        name: 'deliverable_shape',
        description: `The exact structure wanted for the final report.`,
        example: `A comparison table (provider, documented incidents, SCIM-specific complaints, source) followed by a three-paragraph recommendation, not a long narrative essay.`,
        required: true,
      },
    ],
    targetTools: ['ChatGPT (Deep Research)'],
    tags: [
      'deep-research',
      'research-methodology',
      'source-verification',
      'competitive-analysis',
    ],
    whyItWorks: `Deep Research runs as an autonomous multi-step browsing agent that decides its own next search query based on what it's already found, which means an underspecified core question genuinely can drift — the agent's own search results progressively reshape what it treats as "the question," and if that drift isn't explicitly guarded against, the final report can be internally coherent and well-cited while quietly answering a narrower or easier version of what was actually asked. A hard source-quality bar matters specifically because the agent's search results routinely surface vendor marketing content and SEO-optimized comparison sites ranked highly for exactly this kind of comparison query, and without an explicit instruction to name a real gap rather than fill it with a lower-quality source, the report can present a marketing claim with the same citation-backed confidence as an independently verified fact — a materially more dangerous kind of wrong than an honest "no good source exists for this." Requiring disagreeing sources to be shown rather than resolved into one narrative addresses how these reports get used downstream — a single confident number extracted from a report and repeated as fact in a decision meeting is far more consequential than the report itself, and if the underlying sources actually disagreed, that disagreement is exactly the information a decision-maker needs and the one thing a smoothed narrative erases. The explicit instruction to stop and flag a disqualifying outcome rather than complete the report anyway matters because Deep Research otherwise always produces a polished-looking deliverable regardless of whether the underlying research actually succeeded — a report's professional formatting carries no signal about whether it answered the question, so that judgment has to be made explicitly rather than inferred from the fact that a report exists at all.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Deep Research)', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Deep Research.`,
      },
    ],
  },
  {
    slug: 'chatgpt-projects-shared-context-setup',
    category: 'chatgpt',
    title: `Set up a Project so every chat in a workstream shares the same ground truth`,
    description: `Configures a ChatGPT Project's files and project-level instructions as durable shared context for an ongoing piece of work, with an explicit policy for what belongs at the project level versus what stays in one thread.`,
    promptText: `You are helping set up a ChatGPT Project as the shared context container for an ongoing piece of work, so every new chat started inside it already has the right ground truth without re-explaining it, and so a fact that's true for one specific conversation doesn't leak into the project level and quietly apply everywhere.

WORKSTREAM
{{workstream_description}}

FILES TO ATTACH
{{files_to_attach}}

FACTS THAT APPLY TO EVERY CHAT IN THIS PROJECT
{{project_level_facts}}

FACTS THAT ARE THREAD-SPECIFIC, NOT PROJECT-WIDE
{{thread_specific_facts}}

HOW LONG THIS PROJECT WILL LIVE
{{project_lifespan}}

SETUP RULES
Write the project-level custom instructions to hold only facts and rules that would be true for every conversation started inside this project, for as long as the project exists — a fact that's only true this week, or only relevant to one specific sub-task, belongs in that individual thread's opening message, not the project instructions, because project instructions apply silently to every new thread, and a stale one-off fact baked in there will keep resurfacing in unrelated conversations long after it stopped being true. Decide file placement by whether the file is reference material every thread in this project might need to check, versus a one-off input relevant to a single task — attach the former at the project level, and route the latter to the specific thread that needs it, since every file attached at the project level is available to every thread in the project, including ones that have nothing to do with what that file covers. If a fact seems like it might actually be project-wide but was only mentioned in the context of one specific task, flag that ambiguity and ask rather than deciding unilaterally — the cost of a wrongly-scoped fact differs in each direction: too narrow means re-explaining it every new thread, too broad means it silently colors answers in threads it has nothing to do with. Given the stated project lifespan, note anything in the project-level facts likely to go stale before the project ends, as a prompt to come back and update it rather than assuming project instructions set once stay accurate forever.

OUTPUT FORMAT
1. The project-level custom instructions text, ready to paste into the Project's instructions field.
2. A file-by-file placement recommendation: project level or thread-specific, with the reason for each.
3. Any fact flagged as ambiguous in scope, with the question that needs answering to resolve it.
4. Anything likely to go stale before the project's stated end date, with a suggested check-in point.`,
    variables: [
      {
        name: 'workstream_description',
        description: `What this Project is for, at the scale of a real ongoing initiative, not a single task.`,
        example: `Rebuilding our customer onboarding flow over the next quarter — spans product, support docs, and email sequence work.`,
        required: true,
      },
      {
        name: 'files_to_attach',
        description: `What files exist that might belong in this project.`,
        example: `Current onboarding flow screenshots (reference for all threads), a specific vendor contract PDF (only relevant to one thread), and our brand voice guide.`,
        required: true,
      },
      {
        name: 'project_level_facts',
        description: `What should be true context for every thread in this project.`,
        example: `We're targeting self-serve SMB customers, not enterprise; the redesign has to ship before the Q4 renewal cycle; brand voice is direct, no exclamation points.`,
        required: true,
      },
      {
        name: 'thread_specific_facts',
        description: `What's only relevant to one particular conversation, not the whole project.`,
        example: `The specific vendor's pricing tiers — only matters for the one thread about that contract.`,
        required: false,
      },
      {
        name: 'project_lifespan',
        description: `Roughly how long this Project will stay active.`,
        example: `Through end of Q4 this year, then likely archived.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Projects)'],
    tags: ['projects', 'shared-context', 'knowledge-management', 'workflow-organization'],
    whyItWorks: `Project-level custom instructions and files apply automatically to every new chat created inside that Project without being restated, which is exactly the durability the feature is for, but that same mechanic is what makes an incorrectly-scoped fact expensive — a detail relevant to one sub-task, once placed at the project level, now silently colors every unrelated thread started inside the project going forward, including ones started months later by which point the original context is easy to forget existed at all. The file-placement distinction matters for the same structural reason: a file attached at the project level is retrievable by every thread's file-search, not just the thread that actually needs it, so a one-off contract PDF sitting at the project level is available to be quoted from in a thread discussing an entirely unrelated part of the work, creating a real risk of a detail from the wrong document surfacing in an answer where it doesn't belong. Explicitly flagging facts of ambiguous scope rather than deciding silently addresses an asymmetry in the cost of getting the placement wrong in each direction — under-scoping just means mild repetition, cheap to fix by restating it, while over-scoping means an assumption quietly shapes answers in contexts where it was never actually true, which is much harder to notice because nothing about a wrong answer signals that a project-level instruction caused it. Naming likely staleness against the project's stated lifespan turns an implicit assumption — that instructions written once stay accurate — into an explicit thing to revisit, which matters because nothing in ChatGPT's interface prompts a review or expiry of project instructions; they simply keep applying until someone manually notices they're wrong and edits them.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Projects)', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Projects.`,
      },
    ],
  },
  {
    slug: 'chatgpt-advanced-voice-language-practice-session',
    category: 'chatgpt',
    title: `Structure an Advanced Voice Mode session for language practice that actually corrects you`,
    description: `Sets explicit correction rules, pacing, and code-switching boundaries for a spoken practice conversation in Advanced Voice Mode, so the session doesn't default to the polite-conversation-partner behavior that lets every mistake slide to keep the conversation flowing.`,
    promptText: `You are my spoken conversation partner for language practice in Advanced Voice Mode. Before starting, these are the rules for this session — confirm the correction rule specifically, then start the conversation in character.

TARGET LANGUAGE AND MY LEVEL
{{target_language_and_level}}

CONVERSATION SCENARIO
{{conversation_scenario}}

CORRECTION STYLE
{{correction_style}}

WORDS OR STRUCTURES I'M SPECIFICALLY PRACTICING
{{focus_structures}}

WHEN I CAN SWITCH TO ENGLISH
{{code_switch_rule}}

SESSION RULES
Stay in the conversation scenario and in the target language for the entire session except when the code-switch rule explicitly allows a break — do not default back to English just because of hesitation, mispronunciation, or a pause; a real conversation partner who speaks the language natively wouldn't switch languages the moment a learner stumbled, and neither should this session, since the entire value of voice practice is staying inside the target language under time pressure. Apply the correction style exactly as specified rather than defaulting to letting errors pass to keep the conversation flowing smoothly — a spoken practice partner that never corrects anything is pleasant to talk to and useless to practice with. If the correction style calls for corrections after a sentence finishes rather than interrupting mid-sentence, hold the correction until the sentence is actually finished, even if the error happens early — interrupting mid-thought breaks the flow practice is supposed to build, a different skill than accuracy that shouldn't be sacrificed to fix accuracy faster. Prioritize corrections that touch the specific structures being practiced over incidental smaller errors elsewhere in the same sentence — note a one-off pronunciation issue only if it's a repeated pattern, not every single time. Keep your own pace and vocabulary level appropriate to the stated level — speaking back at a native, fast, idiom-dense register when the learner is at an intermediate level defeats the point of a practice session calibrated to where they actually are.

SESSION START
Begin the conversation now, in character for the scenario, entirely in the target language.

END-OF-SESSION SUMMARY
When told the session is over, switch to English and give: the recurring error pattern corrected most, one specific thing that improved if genuine improvement was noticed, and one structure to focus on next time.`,
    variables: [
      {
        name: 'target_language_and_level',
        description: `The language and current level in it.`,
        example: `Spanish, upper-intermediate — comfortable with present and past tense, subjunctive is still shaky.`,
        required: true,
      },
      {
        name: 'conversation_scenario',
        description: `The specific situation to role-play.`,
        example: `Checking into a hotel where there's a problem with the reservation and negotiating a solution.`,
        required: true,
      },
      {
        name: 'correction_style',
        description: `Exactly when and how corrections should happen.`,
        example: `Correct after each full sentence, not mid-sentence — repeat the corrected version once, then continue the conversation in character.`,
        required: true,
      },
      {
        name: 'focus_structures',
        description: `The specific grammar or vocabulary this session is meant to drill.`,
        example: `Subjunctive mood for hypothetical requests ("if there were another room available...") and hotel-specific vocabulary.`,
        required: true,
      },
      {
        name: 'code_switch_rule',
        description: `The exact condition under which English is allowed.`,
        example: `Only if explicitly requested by saying "switch to English" — not automatically after silence or an ungrammatical sentence.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Advanced Voice Mode)'],
    tags: [
      'advanced-voice-mode',
      'language-learning',
      'speaking-practice',
      'roleplay',
      'pronunciation',
    ],
    whyItWorks: `Advanced Voice Mode is built for natural, low-latency spoken back-and-forth, and that same design optimizes by default for keeping a conversation flowing smoothly — exactly right for a casual chat and exactly wrong for deliberate practice, since a model tuned to be a pleasant conversational partner tends to let a grammatical slip pass rather than interrupt the flow it's designed to protect, unless a session explicitly overrides that default with a stated correction rule. The explicit code-switch boundary matters because voice interaction makes it unusually easy for the model to "help" by switching to English the moment it detects hesitation, which feels considerate in a casual conversation but directly undermines a practice session whose entire premise is staying inside the target language under real time pressure — without a stated rule, hesitation gets read as a signal to switch, the opposite of what practice under pressure needs. Prioritizing corrections tied to the stated focus structures over incidental smaller errors reflects a real constraint of spoken correction specifically: unlike a written correction where every error can be marked simultaneously on a page, a spoken correction has to be sequenced one at a time in real conversational time, and correcting everything turns a short practice session into a grammar lecture that never gets through the scenario. Calibrating the model's own speaking pace and vocabulary to the stated level, rather than the register it would use with a native speaker, matters because Advanced Voice Mode's default register is whatever a fluent, naturally-paced adult speaker would use — accurate for a native-level user, functionally an unintelligible firehose for an intermediate one, in a modality where, unlike text, there's no way to pause and re-read something moving too fast.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Advanced Voice Mode)', date: '2026-07-21' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Advanced Voice Mode.`,
      },
    ],
  },
  {
    slug: 'chatgpt-scheduled-task-recurring-output-contract',
    category: 'chatgpt',
    title: `Configure a Scheduled Task with a trigger and output contract that won't drift`,
    description: `Writes a recurring ChatGPT Task's instructions with an explicit trigger condition, source list, and output shape, so a weekly automated digest stays consistent in format run after run instead of quietly reinterpreting the brief differently each week.`,
    promptText: `You are the instructions for a recurring ChatGPT Scheduled Task. This text runs automatically on the schedule below with no one reviewing it before it sends — write it as instructions to a future automated run, precise enough that the tenth run looks structurally identical to the first.

TASK PURPOSE
{{task_purpose}}

SCHEDULE
{{schedule}}

SOURCES TO CHECK EACH RUN
{{sources_to_check}}

OUTPUT SHAPE
{{output_shape}}

WHAT COUNTS AS NOTHING TO REPORT
{{nothing_to_report_condition}}

TASK RULES
State the exact output shape as a template with labeled fields, not a description of the kind of thing to produce — "a short paragraph summarizing the week" invites a different structure every run, while a template with named sections produces the same shape every time regardless of how much content there is to fill it with. Define explicitly what counts as "nothing to report" for this specific task, and instruct the run to say so plainly in that exact case rather than either skipping the run silently or manufacturing a report out of trivial changes just to have something to send — an automated task with no content still needs to confirm it checked and found nothing, since a missing message and a genuinely-empty week look identical from the outside and only one of them means the check actually ran. Name the sources to check explicitly and instruct the run to note if a named source was unreachable or returned nothing usable, rather than silently substituting a different source or omitting that source's section without saying why — since no one is reviewing this before it sends, a silently dropped source is a silent gap in coverage that could go unnoticed for weeks. Keep the same section order and heading wording across every run, even when one section has unusually little to say that week — a stray reordering or renamed heading between runs looks like a bug to whoever reads the digest weekly and expects it to look the same. If the task's own instructions reference "this week" or "recent," make explicit what date range that resolves to relative to the run date, so a task running slightly early or late one week doesn't silently shift what counts as "this week" without anyone noticing the boundary moved.

OUTPUT FORMAT
Produce the Task's instruction text exactly as it should be entered into the Scheduled Tasks setup, structured as: trigger/schedule statement, source list with the fallback behavior per source, the output template with labeled sections, and the explicit nothing-to-report statement to use verbatim when that condition is met.`,
    variables: [
      {
        name: 'task_purpose',
        description: `What this recurring task is actually for.`,
        example: `A Monday-morning digest of anything three named competitors changed on their public pricing pages the prior week.`,
        required: true,
      },
      {
        name: 'schedule',
        description: `How often and when it runs.`,
        example: `Every Monday at 7am local time.`,
        required: true,
      },
      {
        name: 'sources_to_check',
        description: `The exact sources to check each run.`,
        example: `Pricing pages for Competitor A, Competitor B, and Competitor C — public URLs, no login required.`,
        required: true,
      },
      {
        name: 'output_shape',
        description: `The exact template structure for the output.`,
        example: `Headline (one line), What changed (bulleted, per competitor), Why it matters (one sentence per change), Source link.`,
        required: true,
      },
      {
        name: 'nothing_to_report_condition',
        description: `What counts as genuinely nothing happening, versus a trivial change not worth reporting.`,
        example: `A typo fix or a copyright-year update doesn't count as a change worth reporting; an actual price, tier, or feature change does.`,
        required: true,
      },
    ],
    targetTools: ['ChatGPT (Tasks)'],
    tags: [
      'scheduled-tasks',
      'automation',
      'competitive-monitoring',
      'recurring-workflow',
    ],
    whyItWorks: `A Scheduled Task runs unattended on its trigger with no human reviewing the prompt or output before it's delivered, which is the single biggest difference from an ordinary chat — in an interactive conversation a vague instruction just gets clarified with a follow-up question, but an unattended task has no one there to ask, so every ambiguity in the brief becomes a run-to-run inconsistency instead of a one-time question. A labeled-field template constrains the model's output structure in a way a descriptive instruction doesn't — a description like "summarize what changed" is satisfied by many different structures depending on how much there is to say that week, while a template with named sections forces the same shape whether there's one change or ten, which is what makes ten consecutive runs actually comparable to each other at a glance. Explicitly defining "nothing to report" and requiring the task to say so verbatim closes a specific and easy-to-miss failure mode: a task with genuinely nothing to say and a task that silently failed to check its sources produce the exact same visible outcome — no new message — unless the task is instructed to actively confirm a null result, at which point a missing confirmation itself becomes the signal that something went wrong with the run. Naming fallback behavior per source rather than leaving source failures unaddressed matters because an unattended task that can't reach one of its sources has no reviewer to notice and flag the gap in the moment — the omission compounds specifically because each individual run looks complete on its own, and only a reader comparing several weeks' digests against each other would eventually notice one competitor's section has quietly gone missing.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Tasks)', date: '2026-07-23' },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Scheduled Tasks.`,
      },
    ],
  },
  {
    slug: 'chatgpt-code-interpreter-dataset-quality-audit',
    category: 'chatgpt',
    title: `Audit an uploaded dataset in Code Interpreter before it produces a single chart`,
    description: `Forces a data-quality pass — types, nulls, duplicates, outliers, and join integrity — on an uploaded file before Code Interpreter runs any analysis or chart request on it, so a confident-looking chart doesn't quietly rest on a column full of silently miscoerced values.`,
    promptText: `You are auditing a dataset uploaded here, using Code Interpreter, before doing any actual analysis, chart, or summary statistic on it. Run this audit first and show the results before touching the actual question — do not skip ahead to answering it on unverified data.

DATASET
{{dataset_description}}

WHAT I ULTIMATELY WANT TO ANALYZE
{{analysis_goal}}

KNOWN QUIRKS IN THE SOURCE DATA
{{known_data_quirks}}

EXPECTED SCALE
{{expected_scale}}

AUDIT STEPS
Run and show the actual code for each of these checks, not just a prose summary of what the data probably looks like — column names, inferred dtypes, and whether each dtype actually matches what the column should logically be, such as a date column read in as a string, a numeric ID column read in as a float that silently drops a leading zero, or a currency column that's a string because of a stray dollar sign or comma. Row count and a check against the expected scale given — if the actual row count is off by an order of magnitude from what was expected, stop and flag it before proceeding, since that's usually a sign the whole file loaded wrong, not that the data itself is just smaller than expected. Null counts per column, and for any column with unexpected nulls, show a few actual example rows rather than just the count, to distinguish a real gap from a load artifact. Duplicate rows, and separately, duplicate values in whatever column should logically be a unique identifier — these are different problems and need to be reported separately, since a duplicate full row is often a genuine data issue while a duplicate ID with different row contents usually means a join or ingestion bug upstream. Obvious outliers in any numeric column central to the analysis goal — values off by orders of magnitude from the rest of the column, more often a unit mismatch or a data-entry error than a genuine extreme value. If known data quirks were given, verify explicitly whether each one is still present in this specific file, rather than assuming it applies uniformly — a quirk mentioned as historical may already be fixed in this particular upload.

OUTPUT FORMAT
A findings table: Check | Result | Row/column examples if relevant | Severity (blocks analysis, should fix first, informational only). After the table, one paragraph naming anything that should stop the actual analysis until resolved, or an explicit confirmation that nothing found blocks moving forward — do not proceed to the actual analysis goal in the same response unless nothing blocks it.`,
    variables: [
      {
        name: 'dataset_description',
        description: `What the uploaded file is.`,
        example: `orders_export.csv — 14 months of e-commerce order records exported from Shopify, roughly 40 columns.`,
        required: true,
      },
      {
        name: 'analysis_goal',
        description: `What you actually want to analyze once the data checks out.`,
        example: `Monthly revenue trend by product category, to spot which categories are actually growing versus flat.`,
        required: true,
      },
      {
        name: 'known_data_quirks',
        description: `Any known issue with this data source already known about.`,
        example: `Refunded orders sometimes show up as a second row with a negative amount instead of modifying the original row — need to confirm whether that's still true in this export.`,
        required: false,
      },
      {
        name: 'expected_scale',
        description: `Roughly how big the dataset should be, to sanity-check the load.`,
        example: `Should be somewhere around 60,000-80,000 order rows based on known order volume for this period.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Code Interpreter)', 'ChatGPT (Data Analysis)'],
    tags: [
      'code-interpreter',
      'data-analysis',
      'data-quality',
      'exploratory-analysis',
      'csv',
    ],
    whyItWorks: `Code Interpreter runs real Python in a sandbox and will happily produce a chart or a summary statistic from whatever pandas infers about a column's dtype without flagging the inference as uncertain, so a currency column read in as a string because of a stray dollar sign will silently be excluded from a sum or average, or a numeric ID with a leading zero will get coerced to a float and lose it — unless the audit explicitly checks inferred dtype against what the column logically should be, that kind of silent miscoercion produces a chart that looks entirely normal while resting on wrong or partial data underneath it. Requiring the actual code to run and be shown, rather than a prose description of what the data probably looks like, matters because a model can describe a dataset's likely shape based on column names alone and produce a plausible-sounding summary that was never actually checked against the real loaded file — showing the executed code and its literal output is what turns "probably fine" into a verified claim. Separating duplicate full rows from duplicate unique-identifier values addresses two genuinely different root causes that get conflated by a single "check for duplicates" instruction: a repeated full row usually indicates a re-export or accidental double-upload, while a duplicate ID with different row contents usually indicates an upstream join or ingestion bug, and the fix for each is different, so collapsing them into one finding hides which problem is actually present. The order-of-magnitude row-count check against an expected scale catches the single most common and most consequential loading failure — a wrong delimiter, a truncated file, a header row misread as data — before any analysis compounds the error; a chart built on a file silently missing most of its rows can show a trend in the exact opposite direction of what the complete data would show.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Code Interpreter)', date: '2026-07-24' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Code Interpreter.`,
      },
    ],
  },
  {
    slug: 'chatgpt-vision-receipt-policy-reconciliation',
    category: 'chatgpt',
    title: `Reconcile a stack of receipt photos against an expense policy in one pass`,
    description: `Uses Vision to extract structured line-item data from multiple receipt photos at once and checks each one against a stated expense policy, flagging exactly which line and rule triggered a compliance issue instead of a flat pass/fail per receipt.`,
    promptText: `You are extracting structured data from the uploaded receipt photos and checking each one against the expense policy below. Treat OCR uncertainty as a real risk to flag, not something to resolve by silently picking the most plausible reading.

RECEIPT IMAGES
{{receipt_images}}

EXPENSE POLICY
{{expense_policy}}

TRIP OR PURPOSE CONTEXT
{{trip_context}}

CURRENCY OR CONVERSION NOTES
{{currency_notes}}

EXTRACTION AND CHECK RULES
For each receipt image, extract: merchant name, date, total amount, currency, and a line-item breakdown if the receipt shows one — do not collapse a receipt with multiple distinct items into a single total if the policy has per-category rules, since a policy that caps meal spend but allows unlimited ground transportation needs the two line items on one combined taxi-plus-lunch receipt distinguished, not summed. For any field where the photo is blurry, at an angle, or the text is genuinely ambiguous, say so explicitly next to that field rather than picking the more common-looking number and presenting it with the same confidence as a clearly legible one; an expense report built on a silently-guessed number is worse than one with an honest gap, since the guess looks verified when it isn't. Check each extracted receipt against every applicable policy rule individually and name which specific rule triggered any flag — "exceeds policy" is not useful on its own; the specific section and the specific dollar amount by which it was exceeded is what someone approving the report can actually act on. If the trip context indicates a legitimately higher-cost exception the policy itself allows for, apply the correct applicable rule, not the default one, and state which rule applies and why. If currency conversion is relevant, show the conversion rate and date used, since a rate that's a few days stale changes whether a receipt is actually within a dollar-denominated cap or not.

OUTPUT FORMAT
A table: Receipt (image reference) | Merchant | Date | Amount (as extracted, with currency) | Extraction confidence flag if any | Policy check result | Specific rule cited if flagged. After the table, a one-line total and a separate list of every receipt where extraction confidence was flagged, since those need a human to verify against the physical receipt before the report is submitted, not just before it's approved.`,
    variables: [
      {
        name: 'receipt_images',
        description: `The receipt photos being processed in this batch.`,
        example: `Six photos from a two-day client trip — two restaurant receipts, one taxi receipt, two hotel folios, one printed conference registration receipt.`,
        required: true,
      },
      {
        name: 'expense_policy',
        description: `The relevant policy rules that apply.`,
        example: `Meals capped at $40/person for solo meals, $75/person for client-attended meals; ground transport uncapped but requires a business purpose note; hotel must be pre-approved rate or below.`,
        required: true,
      },
      {
        name: 'trip_context',
        description: `What this trip was for, since it can change which policy rule applies.`,
        example: `Client visit to close a renewal — the two restaurant receipts were client dinners with two attendees each, not solo meals.`,
        required: true,
      },
      {
        name: 'currency_notes',
        description: `Whether any receipts are in a different currency and how to convert.`,
        example: `All receipts are in USD except the taxi receipt, which is in CAD — convert using the rate on the date of travel.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (Vision)'],
    tags: [
      'vision',
      'ocr',
      'expense-reports',
      'policy-compliance',
      'document-extraction',
    ],
    whyItWorks: `Vision-based extraction from a photo is fundamentally a probabilistic read of pixels, not a database lookup, so a blurry or angled total genuinely has more than one plausible reading, and a model under no instruction to flag that ambiguity will resolve it silently by picking whichever reading looks most typical for a receipt of that kind — which means the extracted number can be confidently wrong in a way that's indistinguishable, in the output, from a number that was clearly legible and correctly read; only an explicit confidence flag on a per-field basis preserves that distinction for whoever reviews the report. Requiring the specific policy rule cited alongside every flag, rather than a bare "exceeds policy," matters because expense report review is usually done by someone who cannot instantly recall which of several dollar caps applies to which expense category — a citation to the specific section and the specific dollar amount exceeded is the difference between a flag resolved in one glance and one that sends the approver back to reread the whole policy document. Distinguishing a group client meal from a solo meal, and applying the correspondingly different cap, addresses a real failure mode of naive expense-checking: a flat cap read without context flags every client dinner as over policy, generating false positives that then have to be manually reviewed and dismissed one by one, defeating the purpose of an automated first pass if every legitimate exception still requires a human to catch the mistake. Showing the specific conversion rate and date used for any non-native-currency receipt makes the currency conversion itself auditable — a stale or wrong rate silently shifts whether a receipt reads as within or outside a dollar-denominated cap, and a reviewer with no visibility into which rate was applied has no way to catch that kind of error even if something feels off.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Vision)', date: '2026-07-27' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Vision.`,
      },
    ],
  },
  {
    slug: 'chatgpt-web-search-verification-first-brief',
    category: 'chatgpt',
    title: `Structure a live web-search query so it separates verified facts from best guesses`,
    description: `Directs ChatGPT's web search on a fast-moving or recent topic to tag every claim with a confidence level and a source, rather than blending confirmed facts and plausible inference into one uniformly confident-sounding answer.`,
    promptText: `You are answering the question below using live web search, on a topic where the facts are recent enough or contested enough that getting the sourcing right matters more than getting a smooth answer. Search first, then answer — and tag every material claim with where it came from and how confident it actually is.

QUESTION
{{research_question}}

WHY RECENCY OR VERIFICATION MATTERS HERE
{{why_verification_matters}}

SOURCE PREFERENCE
{{source_preference}}

WHAT I ALREADY BELIEVE, TO CHECK RATHER THAN CONFIRM
{{existing_belief_to_check}}

SEARCH AND ANSWER RULES
Search before answering, using multiple distinct queries if the topic has more than one angle, rather than answering from general knowledge and only searching to backfill a citation for what was already going to be said — the search results should be able to change the answer, not just decorate it. For every material claim, mark it as: Confirmed (multiple independent sources agree, cite at least two), Single-sourced (only one source found, name it and note that it's unconfirmed elsewhere), or Inference (synthesis or reasoning across sources, not a direct claim any one source makes) — do not present an inference with the same confidence as a confirmed fact just because it sounds equally plausible in the final answer. Apply the stated source preference as a real filter on which sources get weighted — if the preference calls for primary sources and the actual top search results are dominated by a different kind of source, say so explicitly rather than quietly using what came up first. If the stated existing belief turns out to be accurate, say so plainly rather than treating confirmation as a less interesting answer to give than correction. If it turns out to be outdated, partially wrong, or contested, say specifically what changed or what the actual state of disagreement is, not just that it's no longer accurate without the update itself. Note explicitly if search results are themselves stale relative to how fast this specific topic is moving — a source from even a few weeks ago on a fast-moving story can already be superseded.

OUTPUT FORMAT
Lead with a direct answer to the question in one or two sentences. Then a claim-by-claim breakdown: Claim | Confidence tag | Source(s). Close with one line on whether the stated existing belief held up, was updated, or was contradicted, and by what.`,
    variables: [
      {
        name: 'research_question',
        description: `The actual question needing a live, sourced answer.`,
        example: `Has the vendor we use for background checks changed its standard turnaround time in the last few months?`,
        required: true,
      },
      {
        name: 'why_verification_matters',
        description: `Why getting this exactly right, with sourcing, matters here.`,
        example: `We're quoting turnaround time to candidates in offer letters — an outdated number creates a broken promise.`,
        required: true,
      },
      {
        name: 'source_preference',
        description: `What kind of source should be weighted, if that matters.`,
        example: `The vendor's own status/changelog page and direct customer reports over third-party review aggregator summaries.`,
        required: false,
      },
      {
        name: 'existing_belief_to_check',
        description: `What's currently believed to be true, stated so it can be checked rather than just assumed.`,
        example: `Believed to still be 3-5 business days, which is what it was when the contract was signed eight months ago.`,
        required: true,
      },
    ],
    targetTools: ['ChatGPT (Web Search)'],
    tags: [
      'web-search',
      'fact-checking',
      'source-verification',
      'research',
      'confidence-tagging',
    ],
    whyItWorks: `ChatGPT's web search retrieves and reads live pages and can genuinely change an answer based on what it finds, but nothing about the underlying model changes its own confident, fluent writing style based on how well-sourced a given sentence actually is — a claim backed by two independent sources and a claim that's really the model's own inference read identically fluent in prose, so confidence tagging has to be an explicit instruction, because the model has no built-in incentive to visibly hedge an inference just because it's less certain than a directly-sourced fact. Requiring the search to happen before forming the answer, rather than after, targets a specific and easy default: a model asked a question it has some prior belief about can search mostly to find a citation supporting what it already planned to say, producing search-backed-looking output that never actually let new information change the conclusion. Explicitly checking a stated existing belief against symmetrical bias in either direction matters because a model given "check whether X is still true" can develop a subtle bias toward finding something has changed, since a correction reads as more informative than a plain confirmation, and that bias is exactly backward when the actual base rate of a specific claim staying true is high. Flagging when search results themselves are stale relative to the topic's own pace of change closes a gap specific to live search that a static-knowledge answer doesn't have: a page from three weeks ago is presented by search tooling as "found live," which reads as current, but for a genuinely fast-moving situation three weeks old can already be wrong — the risk isn't that the source is unreliable, it's that even a reliable source can be outdated by the time it's retrieved.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Web Search)', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Web Search.`,
      },
    ],
  },
  {
    slug: 'chatgpt-structured-json-output-chat-pipeline',
    category: 'chatgpt',
    title: `Get ChatGPT's chat interface to emit JSON reliable enough to feed into a script`,
    description: `Builds a JSON-output contract for the consumer ChatGPT app — where there is no schema-enforcement toggle the way the API has — with an explicit self-check step, since the chat interface's adherence depends entirely on how rigorously the prompt itself specifies and validates the shape.`,
    promptText: `You are producing JSON output from inside the ChatGPT chat interface that will be copied directly into a script — there is no schema-validation layer here the way there is calling the API with a response_format; the only thing enforcing the shape is this prompt and your own self-check before showing the output.

SOURCE CONTENT TO CONVERT
{{source_content}}

TARGET SCHEMA
{{target_schema}}

FIELDS THAT CAN BE NULL VERSUS FIELDS THAT MUST ALWAYS HAVE A VALUE
{{nullable_vs_required_fields}}

WHAT THE DOWNSTREAM SCRIPT DOES WITH THIS
{{downstream_usage}}

OUTPUT RULES
Produce only the JSON object — no prose before it, no explanation after it, no markdown code fence unless explicitly requested — since a downstream script parsing this output with a direct JSON parser will fail on any leading or trailing text, and a friendly one-line introduction before the JSON is enough to break a naive parse. Match the target schema's field names, nesting, and types exactly — if the schema says a field is a number, do not return it as a numeric-looking string, and if it says an array, do not collapse a single-item result into a bare object instead of a one-element array, since a downstream script written against the schema will branch on the type it expects and silently mishandle the type it actually got, often without throwing an error at all. Follow the nullable-versus-required distinction exactly — a required field with genuinely no value in the source content should get an explicit sentinel value agreed on in advance, not be omitted from the object entirely, since an omitted key and a null value are different things to most parsers and omission is more likely to throw an unhandled key-error downstream than a null read would. Before producing the final output, do a self-check pass that the JSON is syntactically valid — matched braces and brackets, no trailing commas, all strings properly quoted and escaped — and silently fix anything found, rather than showing output that hasn't been checked. If any part of the source content doesn't map cleanly onto the schema, do not silently drop or coerce it; stop and ask before generating the object, since a downstream script trusting a schema it thinks was followed exactly has no way to detect a silent, plausible-looking deviation on its own.

OUTPUT FORMAT
The JSON object exactly as specified above, and nothing else, unless something needed flagging per the last rule, in which case flag it before producing any JSON at all rather than producing a guessed version alongside the flag.`,
    variables: [
      {
        name: 'source_content',
        description: `The unstructured content to convert into JSON.`,
        example: `A block of freeform customer feedback text pasted from a support ticket, needing conversion into a structured sentiment record.`,
        required: true,
      },
      {
        name: 'target_schema',
        description: `The exact schema shape the output must match.`,
        example: `{ "ticket_id": string, "sentiment": "positive" | "neutral" | "negative", "topics": string[], "urgency_score": number (1-5) }`,
        required: true,
      },
      {
        name: 'nullable_vs_required_fields',
        description: `Which fields can be empty and which must always have a real value.`,
        example: `ticket_id and sentiment are required, never null. topics can be an empty array if nothing specific was mentioned. urgency_score defaults to 1 if nothing suggests urgency.`,
        required: true,
      },
      {
        name: 'downstream_usage',
        description: `What script or system will actually consume this output.`,
        example: `A Python script that loops over these objects and inserts each one as a row into a Postgres table — it will throw on a missing required key.`,
        required: true,
      },
    ],
    targetTools: ['ChatGPT (GPT-5.1)'],
    tags: [
      'structured-output',
      'json',
      'data-pipeline',
      'prompt-engineering',
      'automation',
    ],
    whyItWorks: `The consumer ChatGPT chat interface has no equivalent of the API's response_format json_schema parameter, which actually constrains token generation to a valid schema at the decoding level — in the chat app, JSON output is just regular text generation that happens to look like JSON, so its validity depends entirely on the model choosing to follow the instructed shape, which is exactly why an explicit self-validation step before the final output matters here in a way it wouldn't if this were an API call with structured outputs enforced by the platform itself. The no-prose, no-fence instruction targets a specific and extremely common default: ChatGPT's conversational tuning makes it want to introduce output with a friendly lead-in sentence even when asked for "just the JSON," and a script parsing a string that starts with "Sure, here's the JSON:" throws immediately, a failure that has nothing to do with whether the JSON itself was correct. The omission-versus-null distinction is a real and common source of downstream bugs: most JSON consumers treat a missing key and a key present with a null value differently — a script that does a direct key lookup throws on omission but returns cleanly on an explicit null — so an instruction that only says "handle missing values" without specifying which behavior is wanted leaves that choice to the model's default, which is inconsistent across cases and turns into an intermittent bug. Requiring an explicit stop when the source content doesn't map cleanly onto the schema, rather than a silent best-effort coercion, matters because a script trusting a stated schema has no independent way to verify the model actually honored it — a plausible-looking but silently wrong type coercion will pass a naive downstream insert without error and corrupt the row's meaning in a way nobody will notice until much later, if ever.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-31' }],
    changelog: [
      {
        date: '2026-07-31',
        note: `Initial publish, verified against ChatGPT GPT-5.1 chat interface (no API structured-output enforcement).`,
      },
    ],
  },
  {
    slug: 'chatgpt-gpt-store-listing-starter-prompts',
    category: 'chatgpt',
    title: `Write a GPT Store listing that gets picked over the ten other GPTs like it`,
    description: `Produces the public-facing name, description, category, and conversation starters for publishing a Custom GPT to the GPT Store, written to differentiate a specific real capability from the generic competing listings a searcher will see next to it.`,
    promptText: `You are writing the public GPT Store listing for a Custom GPT already built and configured — the name, description, category, and conversation starters a stranger browsing or searching the Store will actually see before opening the GPT itself.

WHAT THE GPT ACTUALLY DOES
{{gpt_capability}}

WHO IT'S REALLY FOR
{{target_user}}

WHAT MAKES IT DIFFERENT FROM SIMILAR GPTS
{{differentiator}}

CATEGORY IT SHOULD LIST UNDER
{{store_category}}

LISTING RULES
Write the name to describe the specific outcome the GPT produces, not a vague capability word — a name like "Contract Clause Explainer" tells a searcher exactly what they'll get, while something like "Legal Helper" reads as one of dozens of similarly generic names already crowding the same category and gives a browsing user no reason to open this one over the next result. Write the description's first sentence to state the specific differentiator, not a restatement of the category — a searcher scanning a results page reads only the first line of most listings before deciding whether to open one, so if the actual point of differentiation is buried in sentence three, it functions the same as not having a differentiator at all for anyone who doesn't click through. Do not claim a capability the GPT doesn't actually have configured — if it doesn't have a live-data Action wired up, don't write a description implying it checks real-time information, since a listing overselling a capability produces a one-star review the moment a user tests the exact thing the description promised and the GPT can't do it. Write four conversation starters that are the actual first messages a real target user would type, in their own likely phrasing, not generic prompts — each one should imply a different real use case so a browsing user can tell from the starters alone whether their specific situation is covered. Pick the single most accurate category rather than the highest-traffic one if they differ — a GPT that's genuinely a writing tool mis-categorized under Productivity to catch more browse traffic gets discovered by the wrong audience and reviewed against expectations it was never built to meet.

OUTPUT FORMAT
1. Name, with a one-line note on why it beats a more generic alternative considered and rejected.
2. Description, front-loaded with the differentiator in its first sentence.
3. Recommended category.
4. Four conversation starters in the target user's own likely phrasing.`,
    variables: [
      {
        name: 'gpt_capability',
        description: `What the GPT actually does, concretely, based on its real configuration.`,
        example: `Reads an uploaded lease or vendor contract PDF and explains each clause in plain English, flagging which clauses are unusually one-sided compared to standard templates — no live legal-database lookup, purely reasoning over the uploaded document.`,
        required: true,
      },
      {
        name: 'target_user',
        description: `Who this is realistically built for.`,
        example: `Small business owners signing their first commercial lease or vendor contract without a lawyer on retainer.`,
        required: true,
      },
      {
        name: 'differentiator',
        description: `What makes this GPT different from other similar listings already in the Store.`,
        example: `Most "contract review" GPTs in the Store just summarize; this one specifically flags clauses that deviate from standard boilerplate, which is the actual thing a non-lawyer can't judge on their own.`,
        required: true,
      },
      {
        name: 'store_category',
        description: `Which Store category this belongs in, and any competing option considered.`,
        example: `Considered "Productivity" but "Legal" is the more accurate fit even though Productivity likely has more browse traffic.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (GPT Store)'],
    tags: ['gpt-store', 'custom-gpts', 'positioning', 'listing-copy', 'discoverability'],
    whyItWorks: `The GPT Store's browse and search results surface primarily the name and the first line of the description before a user ever opens the GPT, which structurally means a generic name competing against dozens of similarly generic names in the same category has essentially no differentiation signal at the exact moment a user is deciding what to click — the specificity requirement isn't stylistic preference, it's responding directly to how the discovery surface truncates and ranks information. Front-loading the differentiator in the description's first sentence matters for the identical reason applied to a different field — a searcher who reads one line per result before clicking has already made their decision by the time a buried differentiator would have registered, so a description that saves its actual point of difference for sentence three is functionally indistinguishable, to that searcher, from a description with no differentiator at all. The rule against overselling capability targets a specific mechanism by which GPT Store ratings actually form: a user opens a GPT because the listing promised something specific, tests exactly that thing first, and a mismatch between the promised capability and the actual configured Action set produces an immediate, specific, and public negative review that damages every future searcher's first impression — unlike a vague underclaim, which just fails to attract as many users but never actively burns the ones it does attract. Choosing the accurate category over the highest-traffic one addresses a delayed cost that's easy to discount when writing the listing: a mis-categorized GPT does get more initial browse impressions, but the users it attracts are browsing that category for a different kind of tool, so they open it, find it doesn't match what other GPTs in that category do, and leave a review reflecting the category's expectations rather than the GPT's actual design.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (GPT Store)', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: `Initial publish, verified against ChatGPT GPT-5.1 GPT Store listing flow.`,
      },
    ],
  },
  {
    slug: 'chatgpt-temporary-chat-sensitive-one-off-brief',
    category: 'chatgpt',
    title: `Structure a sensitive one-off request as a Temporary Chat, deliberately`,
    description: `Frames a genuinely sensitive, one-time request for a Temporary Chat session — which doesn't use Memory, doesn't appear in history, and isn't referenced by future chats — with the context normally supplied by Custom Instructions and Memory restated explicitly, since none of that ambient context carries into this mode.`,
    promptText: `This is a Temporary Chat — no Memory, no Custom Instructions carried in from regular settings, and this conversation won't appear in chat history or be referenced by any future chat. Because none of the usual saved context applies here, everything relevant is being restated below instead of being assumed already known.

WHAT I NEED HELP WITH
{{sensitive_request}}

CONTEXT YOU'D NORMALLY HAVE FROM MEMORY OR CUSTOM INSTRUCTIONS
{{restated_context}}

WHY THIS IS A TEMPORARY CHAT AND NOT A REGULAR ONE
{{privacy_reason}}

WHAT KIND OF RESPONSE ACTUALLY HELPS HERE
{{response_need}}

SESSION RULES
Treat this exactly as a first message from someone with no prior history — do not reference or assume any fact that would normally come from Memory, since none of it is loaded in this mode, and referencing something that couldn't actually be known here would be a strange and specifically concerning thing to do, not a helpful personalization. Respond using only the context explicitly restated above plus what's in this conversation itself — if something relevant would help but hasn't been stated, ask for it directly rather than filling the gap with an assumption, since the entire reason this is a Temporary Chat rather than a regular one is being deliberate about exactly what is and isn't carried anywhere, and a filled-in assumption is context that wasn't actually chosen to be shared. Match the response to what's actually needed given the stated response_need — if a decision framework is needed rather than reassurance, or a draft rather than validation, give that specifically rather than defaulting to a supportive tone that doesn't actually address the practical thing asked for. If the request involves a decision with real consequences — a difficult conversation, a financial or legal situation, a health-related question — be direct about the limits of what a single conversation can responsibly resolve, and say plainly where a professional is genuinely the better next step rather than continuing to generate confident-sounding advice past that point, since being a private, one-off conversation doesn't change what kind of help is actually appropriate to give.

OUTPUT FORMAT
Answer the actual request directly and specifically, in the shape named in response_need. If something in the request would benefit from professional input beyond what a single conversation can responsibly provide, say so plainly and specifically — naming the kind of professional and why — rather than either over-promising a complete answer or refusing to engage with the parts that are genuinely answerable.`,
    variables: [
      {
        name: 'sensitive_request',
        description: `What help is actually needed in this session.`,
        example: `Drafting exactly what to say in a conversation with a manager about being passed over for a promotion that was verbally promised.`,
        required: true,
      },
      {
        name: 'restated_context',
        description: `The background facts that would normally be in Memory or Custom Instructions, restated here since they aren't loaded.`,
        example: `Senior engineer, five years at this company, manager said verbally in March the promotion was happening this cycle, then it went to someone else with less tenure with no explanation given.`,
        required: true,
      },
      {
        name: 'privacy_reason',
        description: `Why this specific request is being deliberately kept out of Memory/history.`,
        example: `This involves a specific coworker and manager by role and situation — no part of it should surface later in an unrelated work conversation.`,
        required: true,
      },
      {
        name: 'response_need',
        description: `What kind of response actually helps, since the default supportive tone might not be it.`,
        example: `No reassurance needed that this is unfair — three concrete phrasings for opening the conversation that don't come across as accusatory.`,
        required: true,
      },
    ],
    targetTools: ['ChatGPT (Temporary Chat)'],
    tags: ['temporary-chat', 'privacy', 'sensitive-topics', 'memory-boundaries'],
    whyItWorks: `A Temporary Chat is specifically excluded from Memory writes, from Custom Instructions injection, and from chat history, which means every piece of ambient context a regular chat would have accumulated or been configured with simply isn't present here — restating it explicitly is not redundant politeness, it's the only way that context actually gets into this specific conversation at all, since there is no other channel carrying it in. The instruction against referencing any fact "from Memory" matters as a genuine correctness constraint, not just a privacy nicety, because a model that somehow implied familiarity with a fact it has no mechanism to actually know in this mode would be a signal of something functioning incorrectly — the whole value proposition of choosing this mode over a regular chat depends on trusting that context genuinely doesn't leak across the boundary. Naming a specific response_need rather than leaving the tone to default matters more here than in most contexts because sensitive requests are exactly where a model's default supportive, validating register is most likely to substitute for the actually useful response — someone asking for concrete phrasing to use in a difficult conversation is generally not asking to be told their feelings are valid, and defaulting to reassurance when specific tactical help was requested wastes the one thing a Temporary Chat's deliberate privacy framing was meant to protect: a direct, undiluted answer to the actual ask. Explicitly naming the limit of what a single conversation can responsibly resolve for consequential situations matters because the privacy framing of a Temporary Chat can create a false sense that more can be safely resolved in-chat than actually should be — the fact that a conversation is private and won't be remembered doesn't change whether a legal, medical, or financial situation has passed the point where a professional's involvement matters more than a longer or more confident-sounding chat response.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Temporary Chat)', date: '2026-07-20' },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Temporary Chat mode.`,
      },
    ],
  },
  {
    slug: 'chatgpt-multi-pdf-cross-document-comparison',
    category: 'chatgpt',
    title: `Get a structured comparison across several uploaded PDFs, not a summary of each one`,
    description: `Directs ChatGPT to build a cross-document comparison table across multiple uploaded PDFs — flagging contradictions and coverage gaps between them — instead of the default failure mode of producing one separate summary per file that leaves the actual comparing to the reader.`,
    promptText: `You are comparing multiple uploaded PDF documents against each other on the specific dimensions below — not summarizing each document individually and leaving the actual comparison to be done manually afterward.

DOCUMENTS UPLOADED
{{documents_uploaded}}

DIMENSIONS TO COMPARE ACROSS ALL OF THEM
{{comparison_dimensions}}

WHY THIS COMPARISON MATTERS
{{decision_context}}

WHAT COUNTS AS A MATERIAL DIFFERENCE VERSUS BOILERPLATE VARIATION
{{materiality_threshold}}

COMPARISON RULES
Build the output around the comparison dimensions, not around the documents — for each dimension, pull the relevant language or figure from every document that addresses it, so the structure itself makes differences visible at a glance, rather than requiring several separate per-document summaries to be held in mind and manually cross-referenced. Quote the actual relevant clause or figure from each document for each dimension, not a paraphrase — a paraphrase can accidentally normalize two documents that actually use materially different language into sounding like they say the same thing, when a legal or contractual difference specifically lives in word choice. If a document doesn't address a given dimension at all, say so explicitly as "not addressed" rather than leaving that cell blank or inferring a default from what's typical, since silence in a contract is itself meaningful and different from an explicit term that happens to match a typical default. Apply the stated materiality threshold to decide what's worth flagging as a genuine difference — boilerplate variation in formatting or word order that doesn't change the actual substance shouldn't be flagged with the same weight as a difference that changes an actual number, obligation, or right. Where documents genuinely contradict each other on the same point, flag that explicitly as a contradiction requiring resolution, not just a difference to note, since a contradiction usually means someone needs to determine which version is actually controlling before proceeding.

OUTPUT FORMAT
A table: Dimension (rows) by Document (columns), with the actual quoted language or figure in each cell, "not addressed" where silent. Below the table, a separate list of anything flagged as a genuine contradiction requiring resolution, and a separate list of material differences that aren't contradictions but should inform the decision named in decision_context.`,
    variables: [
      {
        name: 'documents_uploaded',
        description: `What documents are being compared.`,
        example: `Three vendor service agreements — Vendor A, Vendor B, Vendor C — for the same category of service, each roughly 15-20 pages.`,
        required: true,
      },
      {
        name: 'comparison_dimensions',
        description: `The specific dimensions to compare across all documents.`,
        example: `Liability cap amount, termination notice period, renewal auto-renewal terms, and data ownership on termination.`,
        required: true,
      },
      {
        name: 'decision_context',
        description: `Why this comparison is being done — what decision it feeds.`,
        example: `Deciding which vendor to actually sign with, or which specific clauses to push back on in the one already tentatively picked.`,
        required: true,
      },
      {
        name: 'materiality_threshold',
        description: `What counts as a real difference versus something not worth flagging.`,
        example: `A liability cap differing by more than 20% or a notice period differing by more than a week counts as material; near-identical boilerplate legal phrasing doesn't.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (GPT-5.1)'],
    tags: [
      'pdf-analysis',
      'contract-comparison',
      'document-synthesis',
      'file-uploads',
      'due-diligence',
    ],
    whyItWorks: `The default, unconstrained response to "compare these documents" is very often a separate per-document summary section, because that's the more natural default structure for processing several distinct files one at a time — explicitly requiring the output to be organized by comparison dimension rather than by document forces the actual cross-referencing work to happen inside the response instead of being silently deferred to whoever reads three separate summaries afterward and has to do the comparing themselves. Requiring an actual quote rather than a paraphrase for each cell matters specifically for documents like contracts where the substance lives in precise wording — a paraphrase that renders two differently-scoped termination clauses as both meaning roughly "30-day termination notice" erases a materially different scope of when termination is even allowed, a distinction only preserved by keeping the actual clause language intact. Explicitly marking silence as "not addressed" rather than an inferred default addresses a specific interpretive risk in contract comparison: a document that says nothing about a liability cap is not the same as a document that explicitly states "no cap," and treating the two as equivalent because "no mention" superficially resembles "no cap" would erase a real and consequential difference in what each document actually commits its parties to. Separating outright contradictions from material-but-non-contradictory differences matters because they call for different next actions — a contradiction between two documents describing what's supposed to be comparable terms usually signals an error or an outdated version somewhere that needs resolving before any decision can be made confidently, while a material difference between two vendors' actual differing terms is simply information to weigh.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' }],
    changelog: [
      {
        date: '2026-08-02',
        note: `Initial publish, verified against ChatGPT GPT-5.1 multi-file PDF uploads.`,
      },
    ],
  },
  {
    slug: 'chatgpt-reasoning-effort-mode-selection-brief',
    category: 'chatgpt',
    title: `Pick the right reasoning depth for the task before you type the prompt`,
    description: `A short decision pass for choosing between ChatGPT's fast/instant response mode and its extended-thinking mode for a specific task, plus how to phrase the request so it actually invokes the depth chosen instead of getting auto-routed to the wrong one.`,
    promptText: `Before sending the actual task, help decide which response mode this specific task actually needs, and how to phrase the request so it invokes that mode deliberately rather than however the model happens to auto-route it.

THE ACTUAL TASK
{{actual_task}}

WHAT KIND OF WRONG ANSWER WOULD BE COSTLY HERE
{{cost_of_being_wrong}}

HOW MANY CONSTRAINTS OR MOVING PARTS
{{constraint_count}}

TIME SENSITIVITY
{{time_sensitivity}}

SELECTION RULES
Recommend extended-thinking, or a higher-tier reasoning mode if available and warranted, specifically when the task has multiple interacting constraints that have to be satisfied simultaneously — a scheduling problem with several hard constraints, a multi-step logical deduction, a plan that has to account for several dependent variables at once — since these are exactly the cases where a fast, single-pass answer is most likely to satisfy some constraints while silently violating others it didn't have the working-through space to check against each other. Recommend the fast/instant mode when the task is a lookup, a rephrasing, a short creative draft, or anything where a wrong first answer is cheap and quick to spot and correct in a follow-up — spending extended reasoning time on a task that doesn't actually benefit from it just adds latency without changing the quality of what comes back. Weight the recommendation toward extended thinking whenever the cost of being wrong is high and the mistake wouldn't be obvious on a quick read — a subtly wrong answer that looks plausible is far more dangerous than an obviously wrong one, since only the obviously wrong one gets caught and redone; if a wrong answer here would look fine and get acted on before anyone noticed, that alone is reason enough to slow down. Note that phrasing a request to explicitly ask for reasoning through a problem step by step, naming and checking each constraint individually, or working through multiple scenarios before answering tends to invoke deeper processing even within a single mode, so the actual prompt wording matters independently of which mode toggle is selected. If time sensitivity conflicts with the recommended mode, say so explicitly rather than picking one consideration and ignoring the other, since that's a real tradeoff to be decided, not something to resolve silently in the recommendation.

OUTPUT FORMAT
One paragraph: recommended mode, the specific reason from the rules above that drove the recommendation, and a suggested phrasing for the actual request that would invoke that depth of processing regardless of mode selection. If there's a genuine mode-versus-time tradeoff, name it explicitly as a decision to be made, not one made silently.`,
    variables: [
      {
        name: 'actual_task',
        description: `What the task actually is.`,
        example: `Building a two-week on-call rotation for a 6-person team that respects everyone's stated blackout dates, keeps consecutive on-call weeks at least 3 apart per person, and balances weekend coverage evenly.`,
        required: true,
      },
      {
        name: 'cost_of_being_wrong',
        description: `What happens if the output is wrong and it isn't caught quickly.`,
        example: `A rotation that silently double-books someone during their stated blackout week would only surface when they're already unavailable during their shift — expensive and embarrassing to fix after the fact.`,
        required: true,
      },
      {
        name: 'constraint_count',
        description: `Roughly how many interacting constraints or moving parts are involved.`,
        example: `Six people, five blackout-date constraints, a minimum-gap rule, and a fairness rule across two months — at least four rules interacting simultaneously.`,
        required: true,
      },
      {
        name: 'time_sensitivity',
        description: `How urgently the answer is actually needed.`,
        example: `Needed by end of day, but not in the next five minutes — there's room for a slower, more careful pass.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (GPT-5.1)'],
    tags: [
      'model-selection',
      'reasoning-effort',
      'prompt-engineering',
      'planning',
      'decision-framework',
    ],
    whyItWorks: `GPT-5.1-era ChatGPT routes between fast and extended-reasoning processing based partly on automatic complexity signals in the request and partly on explicit mode selection, and the automatic routing is a heuristic, not a guarantee — a request that reads as simple on its surface phrasing but is actually a multi-constraint scheduling problem can get auto-routed to fast processing that produces a single coherent-looking pass without ever checking all the constraints against each other simultaneously, exactly the failure mode extended reasoning exists to reduce. The specific criterion of "multiple interacting constraints" rather than a vaguer notion of "hard problems" gives a concrete, checkable trigger: a fast single pass through a problem tends to satisfy constraints roughly in the order it considers them and can commit to an early choice that turns out to conflict with a constraint considered later, whereas extended reasoning's actual mechanistic advantage is exploring and backtracking across exactly that kind of interaction before committing to a final answer. Weighting the recommendation by whether a wrong answer would be obviously wrong or subtly wrong targets a real asymmetry in how errors get caught: an obviously wrong answer gets redone immediately at near-zero additional cost, while a subtly wrong one that looks fine can get acted on and only surface as a problem much later, when it's far more expensive to unwind. Naming that prompt phrasing itself — instructing explicit step-by-step constraint-checking — can invoke deeper working-through independently of the mode toggle matters because relying on the mode selector alone treats depth as a binary switch, when in practice the actual text of the request meaningfully shapes how much the model works through a problem before committing to an answer, regardless of which processing tier picked the request up.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' }],
    changelog: [
      {
        date: '2026-07-30',
        note: `Initial publish, verified against ChatGPT GPT-5.1 mode routing.`,
      },
    ],
  },
  {
    slug: 'chatgpt-weighted-decision-matrix-with-sensitivity-check',
    category: 'chatgpt',
    title: `Build a weighted decision matrix that can't be gamed by picking favorite-friendly weights`,
    description: `Constructs a weighted-criteria decision matrix for choosing between real options, with an explicit sensitivity check showing whether the recommended winner actually holds up across a reasonable range of weightings, instead of a single static score that quietly depended on one specific weight split.`,
    promptText: `You are building a weighted decision matrix to help choose between the options below, on the criteria named — and then stress-testing whether the winning option actually holds up, or whether it only wins because of one specific weighting choice.

OPTIONS BEING COMPARED
{{options_list}}

DECISION CRITERIA
{{decision_criteria}}

INITIAL WEIGHT SPLIT
{{initial_weights}}

WHAT ACTUALLY MATTERS MOST IF IT COMES DOWN TO A CLOSE CALL
{{tiebreaker_priority}}

MATRIX RULES
Score every option against every criterion on a consistent numeric scale, and for each score, state the specific evidence or reasoning behind that number in one line, not just the number alone — a matrix full of unexplained scores invites both sides to unconsciously adjust a score to match a preferred outcome rather than reflect the actual evidence, and a stated one-line justification per score is what makes each one checkable independently. Apply the initial weight split given to compute the first-pass winner, but then run a sensitivity check: identify how much the weights would need to shift before a different option becomes the winner, and name specifically which criterion's weight is most responsible for the current result — if the winning option only wins under a narrow band of weightings and a small, defensible change flips the result, that's a materially different and more fragile answer than one that wins across a wide range of reasonable weightings, and the matrix should say which situation this actually is rather than presenting a single static score as if it were equally decisive either way. If two options score within a small margin of each other after weighting, don't round that up to a confident recommendation — say explicitly that it's a close call and use the stated tiebreaker priority to make the actual call, naming that it's being used specifically because the weighted scores alone didn't clearly separate the two. Do not let a criterion weighted low quietly override one weighted high just because it happens to have a more dramatic score spread between options — the stated weights represent what actually matters, and a criterion's score spread being more visually dramatic is not a reason to let it carry more real influence than its stated weight assigns it.

OUTPUT FORMAT
1. The full scoring matrix: Option (rows) by Criterion (columns), each cell as score plus one-line justification.
2. Weighted totals and the first-pass winner.
3. The sensitivity check: how much weights would need to shift to flip the result, and which criterion's weight is most load-bearing.
4. If it was a close call, one paragraph applying the tiebreaker priority explicitly.`,
    variables: [
      {
        name: 'options_list',
        description: `The actual options being compared.`,
        example: `Three office lease options: Building A (cheaper, further from transit), Building B (mid-price, on transit line), Building C (most expensive, includes a build-out allowance).`,
        required: true,
      },
      {
        name: 'decision_criteria',
        description: `The specific criteria the decision should be judged on.`,
        example: `Monthly cost, commute accessibility for the team, and flexibility to expand headcount within the lease term.`,
        required: true,
      },
      {
        name: 'initial_weights',
        description: `The starting weight split across criteria, as currently seen.`,
        example: `Cost 40%, commute accessibility 35%, expansion flexibility 25%.`,
        required: true,
      },
      {
        name: 'tiebreaker_priority',
        description: `What should decide it if the weighted scores come out close.`,
        example: `If it's genuinely close, commute accessibility wins — a bad commute is the thing most likely to actually cost the team people.`,
        required: false,
      },
    ],
    targetTools: ['ChatGPT (GPT-5.1)'],
    tags: [
      'decision-making',
      'decision-matrix',
      'weighted-scoring',
      'sensitivity-analysis',
      'business-strategy',
    ],
    whyItWorks: `A decision matrix's output is only as trustworthy as its inputs, and an unexplained numeric score is trivially easy to nudge toward a preferred conclusion without anyone necessarily noticing, because a bare number carries no evidence trail a reader could push back on; requiring a one-line justification per score converts each cell from an opinion into a checkable claim, which is what actually lets a reviewer catch a score that doesn't match its own stated reasoning. The sensitivity check targets a specific and common blind spot in weighted scoring exercises: a single weighted total presents one specific weighting choice's output as though it were the answer, when in reality most real decisions have genuine, defensible disagreement about the exact weight split, and a result that only holds under one narrow weighting is a fundamentally weaker basis for a decision than one that's robust across a wide range of reasonable splits. Explicitly flagging a close call and deferring to a pre-stated tiebreaker, rather than rounding a small margin up to a confident recommendation, prevents a specific kind of overclaiming: weighted scores computed to decimal precision create an illusion of exactness that a genuinely close real-world tradeoff doesn't actually have, and presenting a fractional-point margin as a clear winner manufactures false confidence in a distinction the scoring method wasn't actually precise enough to draw. Protecting a low-weighted criterion from being overridden by a more visually dramatic score spread matters because that's a specific and easy-to-miss way a matrix can quietly betray its own stated weights — an unweighted glance at raw scores can read a more dramatic spread on a lower-weighted criterion as more decisive than the math says it should be, and the matrix has to hold the actual arithmetic to the stated weights rather than to which column visually looks more differentiated.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-26' }],
    changelog: [
      {
        date: '2026-07-26',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
