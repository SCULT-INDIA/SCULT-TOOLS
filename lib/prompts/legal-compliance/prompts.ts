import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'legal-compliance-contract-summary-for-a-nonlawyer-signer',
    category: 'legal-compliance',
    title: `Turn a long contract into a summary a non-lawyer signer can actually act on`,
    description: `Produces a plain-language summary of a contract's obligations, deadlines, and money terms for someone who has to sign it but isn't a lawyer, with an explicit flag on anything that needs a real attorney's eyes before signature.`,
    promptText: `You are summarizing a contract for someone who has to decide whether to sign it but is not a lawyer and does not have one reviewing this particular draft. Your job is to make the practical terms legible, not to render a legal opinion on the contract.

CONTRACT TEXT OR PASTE
{{contract_text}}

SIGNER'S ROLE
{{signer_role}}

WHAT THEY MOST NEED TO KNOW
{{priority_concern}}

DEAL CONTEXT
{{deal_context}}

HOW TO SUMMARIZE
Organize the summary around what the signer actually has to do and what could go wrong for them, not around the contract's own section order. Pull out every obligation the signer takes on, every deadline or renewal/termination window, every dollar figure or payment trigger, and anything that auto-renews or locks them in past what a casual read would suggest. State each item in one plain sentence — no legal jargon carried over unexplained; if a defined term matters, say what it means in this contract, not just that it exists. Do not silently omit a term because it looks standard — boilerplate is exactly what non-lawyers skip past, and that's often where the real risk sits (indemnification, liability caps, auto-renewal, exclusivity, assignment restrictions). For each of those specifically, state plainly what it would mean in practice if invoked.

WHAT NOT TO DO
Do not tell the signer whether the contract is "fair" or "favorable" in a legal sense, and do not predict how a court would interpret an ambiguous clause — that is a legal judgment, not a summarization task. Do not soften a genuinely one-sided term into neutral language to make the summary read more comfortably.

OUTPUT FORMAT
1. One-paragraph plain-language overview of what this contract commits the signer to.
2. A table of obligations, deadlines, and money terms (What / When / Consequence if missed).
3. A short list of the standard-looking clauses (indemnification, liability, renewal, termination, assignment) with a one-line practical translation of each.
4. A closing section titled "Before you sign" that states in plain terms: this is a draft summary to help you read the contract faster, it is not legal advice, and any clause you're unsure about — especially indemnification, liability limits, or anything with financial exposure above what you're comfortable risking — should be reviewed by a qualified lawyer before you sign.`,
    variables: [
      {
        name: 'contract_text',
        description: `The contract text, or the sections you most need summarized if the full document is too long to paste.`,
        example: `12-page SaaS reseller agreement, sections 1-14 including payment terms, exclusivity, and termination clauses.`,
        required: true,
      },
      {
        name: 'signer_role',
        description: `Who the signer is and what they're agreeing to be responsible for.`,
        example: `Small business owner signing as the reseller; no in-house legal or procurement team.`,
        required: true,
      },
      {
        name: 'priority_concern',
        description: `The specific thing the signer is most worried about or confused by.`,
        example: `Whether the 90-day exclusivity clause blocks me from also reselling a competing product this year.`,
        required: false,
      },
      {
        name: 'deal_context',
        description: `Business context that changes what actually matters in the summary.`,
        example: `This is a 12-month pilot; we plan to renegotiate if volume targets aren't hit by month 6.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`contract-review`, `plain-language`, `legal-drafting`, `small-business`, `risk-flagging`],
    whyItWorks: `General-purpose contract summarization prompts tend to mirror the document's own structure and compress every clause by roughly the same amount, which buries the handful of terms that actually determine financial exposure underneath restated boilerplate the model treats as equally important. Reorganizing the instruction around what the signer has to do and what could go wrong for them forces GPT-5.1 to triage by consequence rather than by section order, and explicitly naming the categories that are boilerplate-but-dangerous (indemnification, liability caps, auto-renewal, exclusivity, assignment) counteracts a real pattern where a summarizer skims past clauses that read as standard legal filler precisely because they're common, when commonality has nothing to do with risk to this particular signer. The instruction to state what a defined term means in this contract rather than that it exists addresses the model's tendency to name a clause ("this is a standard indemnification provision") without translating what invoking it would actually cost the signer, which is the information a non-lawyer needs and the thing a bare label doesn't provide. Explicitly forbidding a fairness judgment or an interpretation prediction matters because a model asked to "summarize" will often drift into evaluative language unprompted, and that drift is exactly the line between a reading aid and something that reads as legal advice — keeping the output a faithful restatement rather than a verdict is what makes the mandatory closing disclaimer accurate rather than a token afterthought bolted onto advice-shaped content.`,
    exampleOutput: `Overview: This agreement makes you the exclusive reseller of the product in your territory for 12 months, in exchange for a minimum quarterly purchase commitment... Obligations table: Quarterly minimum order ($15,000) — due end of each quarter — missing it voids exclusivity, not the whole contract. Standard clauses: Indemnification (Section 9) — you'd be on the hook for legal costs if your marketing claims about the product turn out to be false, even if you didn't know they were false. Before you sign: this is a draft summary to help you read faster, not legal advice — have a lawyer review Section 9 and the exclusivity clause before signing.`,
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
    slug: 'legal-compliance-contract-clause-risk-flagging',
    category: 'legal-compliance',
    title: `Flag the clauses in a draft contract that carry outsized risk before it goes back to the other side`,
    description: `Scans a contract draft for clauses that create disproportionate risk relative to the deal size, ranks them by exposure, and produces redline talking points — framed as a starting point for negotiation, not a legal opinion.`,
    promptText: `Review the contract draft below and identify clauses that create risk disproportionate to the size or nature of this deal. This is risk-flagging to prepare for negotiation, not a legal opinion on enforceability.

CONTRACT DRAFT
{{contract_draft}}

DEAL SIZE AND NATURE
{{deal_context}}

OUR SIDE OF THE DEAL
{{our_role}}

KNOWN DEALBREAKERS
{{dealbreakers}}

PHASE 1 — SCAN
Go through the draft clause by clause and identify every provision that shifts risk, cost, or obligation onto our side disproportionately to the deal size stated above — uncapped liability, broad indemnification, one-sided termination rights, unusually long payment terms, IP assignment beyond what the deal requires, or auto-renewal without an out. Do not flag a clause just because it's unfavorable in the abstract; flag it because it's unfavorable relative to what this specific deal is worth to us.

PHASE 2 — RANK
Rank the flagged clauses by financial or operational exposure, highest first. For each one, state in one sentence what could actually happen if it were invoked against us, not just what the clause says.

PHASE 3 — TALKING POINTS
For each flagged clause, draft one negotiation talking point — a specific ask (cap the liability at X, mutual termination rights, narrow the indemnification scope) rather than a vague objection like "this seems risky." If a known dealbreaker is present, mark it separately as non-negotiable rather than a talking point.

WHAT NOT TO DO
Do not state whether any clause is enforceable or unenforceable under any jurisdiction's law — that determination depends on facts and law you have not verified and should not assert. Do not invent a specific statute, case, or regulation to justify a flag; if a legal basis matters, say that it should be confirmed by counsel rather than naming one.

OUTPUT FORMAT
1. Ranked table: Clause | What it does | Exposure if invoked | Talking point.
2. Separate short list of anything matching a known dealbreaker.
3. A closing line stating this is a draft risk-flagging pass to prepare for negotiation, not a legal opinion, and that the marked clauses — especially anything involving indemnification, liability caps, or IP — should be reviewed by a qualified lawyer before the contract is finalized or signed.`,
    variables: [
      {
        name: 'contract_draft',
        description: `The draft contract text to scan for risk.`,
        example: `Draft master services agreement from a vendor, sections on liability, IP, and payment terms.`,
        required: true,
      },
      {
        name: 'deal_context',
        description: `The size and nature of the deal, so risk can be judged relative to it.`,
        example: `$40,000 annual contract for a marketing automation tool, one-year term.`,
        required: true,
      },
      {
        name: 'our_role',
        description: `Which side of the contract you're on and what you're trying to protect.`,
        example: `We're the customer; main concern is not being liable for the vendor's data breach.`,
        required: true,
      },
      {
        name: 'dealbreakers',
        description: `Any terms you already know are non-negotiable for your side.`,
        example: `We will not accept uncapped liability under any circumstances.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`contract-risk`, `negotiation-prep`, `redlining`, `risk-assessment`, `vendor-contracts`],
    whyItWorks: `A generic "find the risky clauses" instruction produces a flat list because the model has no anchor for what counts as disproportionate, so it either flags everything that sounds legally serious or nothing at all; requiring the deal size and the user's specific side as inputs gives GPT-5.1 a concrete basis for relative judgment — a broad indemnification clause is a minor flag on a $2,000 deal and a major one on a $2 million deal, and the model can only make that distinction if the comparison point is stated rather than implied. Separating the scan phase from the ranking phase keeps the model from prematurely deciding a clause isn't worth mentioning while it's still cataloguing — a common failure mode where an LLM's first pass at "is this important" quietly drops borderline items before a ranking step ever gets to weigh them against each other. Forcing each flagged item into a specific negotiation ask rather than a general objection matters because "this seems risky" gives the person going back to the other side nothing to actually propose, while "cap liability at 12 months' fees" is something that can be pasted into a redline comment directly. The explicit ban on asserting enforceability or citing a specific law is the load-bearing safety constraint here: risk-flagging for negotiation prep is a business-judgment task the model can reasonably help with, but the moment it states a clause is unenforceable under some jurisdiction's law it has crossed into legal opinion territory without the facts, jurisdiction confirmation, or license to back it up.`,
    exampleOutput: `1. Indemnification (Sec. 8) — vendor requires us to indemnify them for any claim arising from our use of the product, uncapped. Exposure: could exceed contract value many times over in a serious incident. Talking point: propose a mutual indemnification cap at 2x annual fees. 2. Auto-renewal (Sec. 14) — renews for a full year unless cancelled 90 days out. Talking point: shorten notice window to 30 days. Dealbreaker match: none of the above conflicts with your stated non-negotiables. This is a draft risk-flagging pass, not a legal opinion — have a lawyer review the indemnification and liability sections before signing.`,
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
    slug: 'legal-compliance-nda-review-checklist-before-signing',
    category: 'legal-compliance',
    title: `Build a signing checklist for an NDA that flags one-sided terms before you agree to it`,
    description: `Walks through a draft NDA against a plain checklist of common one-sided terms — scope, duration, mutuality, carve-outs — and produces a go/hold list, framed as prep for a lawyer's review rather than a substitute for one.`,
    promptText: `Check the NDA below against the standard points that make an NDA either reasonable or one-sided, and produce a checklist I can use before deciding whether to sign or push back.

NDA TEXT
{{nda_text}}

WHO'S ASKING ME TO SIGN
{{counterparty_relationship}}

WHAT INFORMATION IS ACTUALLY AT STAKE
{{information_at_stake}}

CHECK EACH OF THESE AGAINST THE TEXT
- Is the confidentiality obligation mutual (both sides protect each other's information) or one-way, and does that match the actual relationship described above?
- How long does the confidentiality obligation last, and is that duration reasonable for the type of information at stake, or unusually long (e.g., indefinite, or 10+ years for information that won't stay sensitive that long)?
- Is the definition of "confidential information" narrow and specific, or so broad it could cover information that was already public or that I already knew?
- Are there standard carve-outs (information that becomes public through no fault of mine, information I already had, information I develop independently, information I'm legally compelled to disclose)? Flag if any of these is missing.
- Does the NDA try to restrict anything beyond confidentiality — non-compete language, IP assignment, or non-solicitation quietly folded in under an NDA label?
- What governing law and dispute resolution process does it specify, and does that match where I actually operate?

For each point, state plainly what the text actually says, then mark it Standard, Worth a Question, or Push Back — do not assign a legal severity beyond that three-way flag, and do not guess at how enforceable a given term would be in any specific jurisdiction.

OUTPUT FORMAT
1. A six-row checklist table (Point | What the text says | Flag).
2. A short list of any items marked Push Back with the specific plain-language reason.
3. A closing note: this checklist is a preparation aid to help you read the NDA critically before a conversation with a lawyer, not a legal opinion on the document — anything marked Push Back, and anything involving non-compete or IP language folded into the NDA, should go to a qualified lawyer before you sign.`,
    variables: [
      {
        name: 'nda_text',
        description: `The NDA text you've been asked to sign.`,
        example: `Two-page mutual NDA from a prospective client before a scoping call.`,
        required: true,
      },
      {
        name: 'counterparty_relationship',
        description: `Who is asking for the NDA and what the relationship actually is.`,
        example: `A potential client we'd be pitching a paid engagement to; not an employer or investor.`,
        required: true,
      },
      {
        name: 'information_at_stake',
        description: `What kind of information will actually be shared under this NDA.`,
        example: `Our pricing model and a rough project approach; no source code or trade secrets involved.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`nda-review`, `checklist`, `contract-prep`, `small-business`, `confidentiality`],
    whyItWorks: `NDAs are short enough that a model asked to "review" one in the abstract will often produce a generic list of NDA concepts rather than checking this specific document against them, because nothing in an open-ended request forces a claim-by-claim comparison; giving GPT-5.1 a fixed six-point checklist and instructing it to state what the text actually says before assigning a flag converts a vague review into a verification task, which is a much more reliable mode for a language model than open-ended risk judgment. Requiring the counterparty relationship and the actual information at stake as inputs is what lets the mutuality and duration checks mean anything — a one-way NDA is unremarkable when you're the one receiving someone else's trade secrets and alarming when the relationship is peer-to-peer, and a model without that context has no way to tell which situation it's looking at. Naming the specific carve-outs to check for (public-domain information, prior knowledge, independent development, legal compulsion) matters because their absence is a silent risk — a clause that isn't there doesn't announce itself, and a model scanning for "problems" tends to notice what's present and overlook what's conspicuously missing unless it's told exactly what to look for. The three-way flag system (Standard / Worth a Question / Push Back) keeps the output actionable without tipping into a legal severity rating the model has no basis to assign, and restricting the enforceability question entirely keeps the checklist a reading aid rather than something that could be mistaken for legal sign-off on a document with real confidentiality exposure.`,
    exampleOutput: `Mutuality: text says obligations apply to "both parties" — Standard, matches the relationship. Duration: confidentiality survives 7 years after termination — Worth a Question, longer than typical for pricing/approach info, ask if it can be reduced to 2-3 years. Carve-outs: missing an independent-development carve-out — Push Back, add standard language. Closing: this is a preparation checklist, not a legal opinion — take the Push Back item to a lawyer before signing.`,
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
    slug: 'legal-compliance-clause-comparison-across-contract-versions',
    category: 'legal-compliance',
    title: `Diff two versions of a contract clause and explain what actually changed in practice`,
    description: `Compares an original clause against a counterparty's redline and translates the change into what it means for you in practice, not just what words moved — built for spotting redlines that look small but shift real risk.`,
    promptText: `Compare the original clause and the redlined version below and tell me what actually changed — not the wording difference, but what changed in practice for the side I'm representing.

ORIGINAL CLAUSE
{{original_clause}}

REDLINED VERSION
{{redlined_clause}}

WHICH SIDE I'M ON
{{my_side}}

WHAT THIS CLAUSE GOVERNS
{{clause_subject}}

STEP 1: IDENTIFY THE MECHANICAL CHANGES
List every substantive word or phrase that changed between the two versions — added, removed, or reworded. Skip pure formatting or renumbering changes.

STEP 2: TRANSLATE EACH CHANGE INTO PRACTICAL EFFECT
For each mechanical change, state in one sentence what actually shifts for my side if this version were signed instead of the original — who bears a cost, who has to act by when, whose discretion expanded or narrowed. Pay particular attention to small-sounding changes that shift a lot in practice: "may" becoming "shall," a cap being removed, a notice period being shortened, "sole discretion" being added to one side only, or a carve-out being narrowed. These are the changes a quick read tends to miss because the sentence still looks similar.

STEP 3: NET ASSESSMENT
State in one line, from my side's perspective, whether this redline is better, worse, or neutral for me overall, and why — but do not phrase this as a legal conclusion about enforceability, only as a practical read of who the redline favors.

WHAT NOT TO DO
Do not assume the redlining party's motive; describe only what the words now do. Do not fill in any missing context about the deal that wasn't given to you — if the practical effect depends on a fact you don't have (like a dollar cap elsewhere in the contract), say what additional information you'd need rather than guessing.

OUTPUT FORMAT
1. Table: Change | Practical effect | Who it favors.
2. One-line net assessment.
3. Any missing context flagged as needed.
4. A closing line: this comparison is a drafting aid to help you spot what a redline actually does, not a legal opinion — before accepting or rejecting this redline, have a qualified lawyer confirm the practical read, especially for any change involving discretion, caps, or notice periods.`,
    variables: [
      {
        name: 'original_clause',
        description: `The clause as it stood before the redline.`,
        example: `"Either party may terminate this agreement upon 60 days' written notice."`,
        required: true,
      },
      {
        name: 'redlined_clause',
        description: `The counterparty's proposed revised version of the same clause.`,
        example: `"Client may terminate this agreement upon 60 days' written notice; Vendor may terminate at its sole discretion upon 10 days' written notice."`,
        required: true,
      },
      {
        name: 'my_side',
        description: `Which party you represent in this contract.`,
        example: `I represent the Client.`,
        required: true,
      },
      {
        name: 'clause_subject',
        description: `What the clause governs, for context.`,
        example: `Termination rights in a 12-month services agreement.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`clause-comparison`, `redline-review`, `contract-negotiation`, `legal-drafting`, `risk-flagging`],
    whyItWorks: `A model asked to "compare these two clauses" defaults to describing the textual diff, which is exactly what a word processor's track-changes view already shows for free — the actual value has to come from translating a wording shift into a practical consequence, which requires a separate, explicit step because language models tend to describe what changed in the sentence rather than what changed in the world unless told to make that translation deliberately. Splitting mechanical identification from practical translation into two steps prevents a common shortcut where the model jumps straight to a vague summary judgment ("this version favors the vendor") without ever surfacing the specific word that caused it, which leaves the reader unable to verify the claim against the actual redline. Naming the specific small-sounding-but-large-effect patterns to watch for — modal verb shifts, removed caps, shortened notice, one-sided discretion — matters because these are the exact changes an experienced contract reviewer trains themselves to catch and a first read tends to skim past, since the sentence structure looks almost identical to the original; giving the model this checklist compensates for the fact that it has no innate sense of which redlines are the ones lawyers specifically watch for. Instructing the model to flag missing context rather than guess at it addresses a real failure mode where an LLM asked for a "net assessment" will invent a plausible-sounding rationale to fill a gap in the facts it was given, which is exactly the kind of confident-sounding fabrication that's dangerous in a document meant to inform an actual negotiation position.`,
    exampleOutput: `Change: Vendor's termination right changed from mutual 60-day notice to a one-sided 10-day sole-discretion right. Practical effect: Vendor can now exit the engagement on 10 days' notice while you remain bound to 60, and "sole discretion" means they don't need a reason. Who it favors: Vendor, clearly. Net assessment: worse for Client — this redline removes the mutuality entirely. This is a drafting aid, not a legal opinion — confirm with a lawyer before accepting or rejecting.`,
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
    slug: 'legal-compliance-plain-english-legal-document-translation',
    category: 'legal-compliance',
    title: `Translate a dense legal document into plain English without losing what actually matters`,
    description: `Rewrites a legal document section by section into plain language a general reader can follow, preserving every substantive obligation and condition rather than just simplifying the vocabulary.`,
    promptText: `Translate the legal text below into plain English for someone who has no legal training. The goal is comprehension, not legal accuracy review — you're a translator here, not a reviewer.

LEGAL TEXT
{{legal_text}}

WHO'S READING THIS
{{reader_context}}

WHY THEY NEED TO UNDERSTAND IT
{{reading_purpose}}

TRANSLATION RULES
Go section by section rather than producing one blended summary — the reader should be able to find the plain-English version of any specific part they're confused about. For each section, preserve every obligation, condition, deadline, and exception exactly — simplify the sentence structure and vocabulary, not the substance. If a sentence has three conditions attached to it, the plain-English version needs all three conditions, just stated more clearly, not the most important one. When a legal term of art appears (e.g., "indemnify," "force majeure," "joint and several liability"), define it briefly the first time it appears in the terms this document actually uses it, since generic dictionary definitions sometimes miss how a specific document scopes the term. Where a sentence is genuinely ambiguous in the original — where two readings are both plausible — say so explicitly rather than picking one reading and presenting it as the only one; papering over real ambiguity with confident plain English is worse than leaving it visibly unresolved.

WHAT NOT TO DO
Do not add commentary on whether a term is fair, favorable, or standard — that's evaluation, not translation. Do not drop a qualifying phrase ("except where," "unless," "subject to") for readability; qualifiers carry the actual legal effect and a plain-English version that drops them is not a translation, it's a misrepresentation.

OUTPUT FORMAT
Section-by-section: original section heading, then a plain-English paragraph, then a short "Key terms used here" list if any term-of-art definitions applied. End with a closing note stating plainly that this is a plain-language translation to aid understanding, not a legal interpretation or advice, and that the reader should have a qualified lawyer confirm their understanding before relying on this translation for any decision, especially around obligations, deadlines, or liability.`,
    variables: [
      {
        name: 'legal_text',
        description: `The legal document or section you need translated.`,
        example: `A residential lease agreement's default and remedies clause.`,
        required: true,
      },
      {
        name: 'reader_context',
        description: `Who the reader is and what they already know.`,
        example: `First-time renter, no prior lease experience, English is not their first language.`,
        required: true,
      },
      {
        name: 'reading_purpose',
        description: `Why this reader needs to understand this document right now.`,
        example: `Deciding whether to sign before a move-in deadline this week.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`plain-language`, `legal-translation`, `contract-literacy`, `accessibility`, `consumer-legal`],
    whyItWorks: `The largest failure mode in plain-English legal translation isn't vocabulary, it's silent loss of qualifiers — a model asked to "simplify" a sentence will very naturally drop the "unless," "except where," or "subject to" clause because those words make a sentence harder to read, and yet those exact words are where the legal effect actually lives; explicitly instructing GPT-5.1 to preserve every condition and exception while only simplifying structure and vocabulary directly targets this failure rather than trusting a general "make it simpler" instruction to somehow preserve substance on its own. Going section by section instead of producing one blended summary matters for a document the reader will need to return to later — a reader confused about paragraph 4 of the original needs to be able to find paragraph 4's plain-English counterpart, not hunt through a merged narrative that reorganized the document's own structure. The instruction to flag genuine ambiguity rather than resolve it addresses a specific overconfidence pattern: language models asked to explain a legal sentence will often pick the more common or more sensible-sounding of two plausible readings and present it as settled, which is actively worse than leaving the ambiguity visible, because the reader now believes something is certain that a lawyer might read the opposite way. Separating translation from evaluation (no commentary on fairness) keeps the tool doing one job well instead of quietly sliding into legal opinion territory, which is what makes the closing disclaimer an accurate description of what was actually produced rather than a formality attached to something that already reads as advice.`,
    exampleOutput: `Section 14 — Default and Remedies. Plain English: If you don't pay rent by the date it's due, and you still haven't paid after receiving a written notice giving you 3 days to catch up, the landlord can start the legal process to end your lease early — but only after giving you that 3-day notice first. Key terms: 'notice to cure' means the landlord has to formally warn you and give you a chance to fix the problem before taking further action. This is a plain-language translation, not legal advice — confirm your understanding with a lawyer before making any decision based on it.`,
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
    slug: 'legal-compliance-internal-policy-first-draft',
    category: 'legal-compliance',
    title: `Draft a first-pass internal policy document that a real reviewer can mark up instead of starting from a blank page`,
    description: `Produces a structured first draft of an internal company policy — scope, rules, exceptions, enforcement — built to be edited by legal and leadership, not adopted as-is.`,
    promptText: `Draft a first-pass internal policy document for the topic below. This is a starting draft meant to be reviewed and edited by legal and leadership before adoption — write it as a strong first draft, not a finished, ready-to-publish policy.

POLICY TOPIC
{{policy_topic}}

WHO THE POLICY APPLIES TO
{{covered_population}}

THE PROBLEM THIS POLICY IS SOLVING
{{underlying_problem}}

KNOWN CONSTRAINTS
{{known_constraints}}

DRAFTING RULES
Open with a one-paragraph purpose statement that ties the policy directly to the problem it's solving — a policy without a stated reason invites the exact scope-creep and inconsistent enforcement it's meant to prevent. State the scope precisely: who is covered, who is explicitly not covered, and what situations fall outside the policy's reach — an unscoped policy either gets applied inconsistently or gets stretched to cover situations nobody thought through. Write the actual rules as specific, checkable statements (what is and isn't allowed, by when, reported to whom) rather than aspirational language a manager couldn't actually enforce. Include an exceptions section that names the realistic edge cases this topic tends to produce and states who has authority to grant an exception — a policy with no exceptions process either gets silently ignored in edge cases or applied rigidly in situations it was never meant to cover. Include a short enforcement section stating what happens on a first violation versus a repeated one, without inventing specific disciplinary consequences that should really be set by HR and legal — flag that this section needs their input rather than asserting a consequence as settled.

WHAT NOT TO DO
Do not cite a specific law, regulation, or industry standard as the basis for this policy unless one was given to you above — if a legal requirement is relevant, say that it should be confirmed and cited by counsel rather than naming one yourself. Do not present this draft's enforcement consequences as final; mark them as placeholders for legal and HR to confirm.

OUTPUT FORMAT
1. Purpose statement.
2. Scope (covered / not covered).
3. Policy rules as a numbered list.
4. Exceptions and who can grant them.
5. Enforcement (marked as draft, pending HR/legal input).
6. A closing note stating this is a first-draft internal policy for legal and leadership review, not a final or legally vetted document, and it should not be published, distributed, or enforced until a qualified lawyer has reviewed it for legal accuracy and enforceability.`,
    variables: [
      {
        name: 'policy_topic',
        description: `What the policy needs to cover.`,
        example: `Remote work equipment and expense reimbursement.`,
        required: true,
      },
      {
        name: 'covered_population',
        description: `Who this policy applies to.`,
        example: `All full-time employees working remotely more than 3 days a week; excludes contractors.`,
        required: true,
      },
      {
        name: 'underlying_problem',
        description: `The actual problem prompting this policy.`,
        example: `Inconsistent reimbursement decisions are causing complaints and manager confusion about what's covered.`,
        required: true,
      },
      {
        name: 'known_constraints',
        description: `Budget, existing policy, or precedent constraints the draft needs to respect.`,
        example: `Annual equipment budget capped at $500/employee; can't retroactively change already-approved purchases.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`policy-drafting`, `hr-policy`, `internal-governance`, `compliance-drafting`, `workplace-policy`],
    whyItWorks: `A policy draft's most common failure isn't bad prose, it's unenforceable rules dressed up as clear ones — asking for "policy rules" without insisting on checkable statements produces sentences like "employees should use good judgment when incurring expenses," which sounds like a rule but gives a manager nothing to actually enforce consistently, so the instruction here forces specific, verifiable conditions instead. Requiring an explicit scope with a stated "not covered" side matters because most real policy disputes happen exactly at the boundary the policy never named — a remote work policy silent on contractors will inevitably get invoked or ignored inconsistently for that group, and naming the boundary up front is what actually prevents the ambiguity from surfacing later as a dispute. The exceptions section is deliberately separated from the rules themselves because a policy that presents its rules as absolute either gets quietly broken in the first edge case or gets enforced rigidly against a situation nobody anticipated — naming realistic edge cases and an explicit exception authority gives the policy a pressure valve instead of leaving that decision to whoever encounters the edge case first. The instruction to mark enforcement consequences as placeholders rather than asserting them is the safety-critical piece: disciplinary consequences are a joint HR/legal decision with real employment-law exposure, and a model confidently inventing "first offense: written warning, second offense: termination" would hand a manager language that reads as settled policy when it's actually an unreviewed guess — flagging it as a placeholder keeps the draft honest about what still needs real institutional sign-off before anyone relies on it.`,
    exampleOutput: `Purpose: This policy establishes consistent rules for remote work equipment and expense reimbursement to eliminate the ad-hoc decisions currently causing employee complaints. Scope: Applies to full-time employees working remotely 3+ days/week; does not apply to contractors or hybrid employees under this threshold. Rules: 1. Employees may request reimbursement up to $500/year for home office equipment... Enforcement: [Draft — pending HR/legal input] Repeated over-budget claims without pre-approval may result in... This is a first draft for legal and leadership review, not a final document — it must be reviewed by a qualified lawyer before being published or enforced.`,
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
    slug: 'legal-compliance-regulatory-compliance-checklist-builder',
    category: 'legal-compliance',
    title: `Turn a regulation you name into a working checklist your team can actually run against`,
    description: `Converts a compliance requirement you specify into a structured, assignable checklist with owners and evidence needed — built to organize what your team already knows applies, not to determine what the law requires.`,
    promptText: `Build a working compliance checklist for the requirement I name below. I will tell you what the requirement is; your job is to structure it into an actionable checklist, not to determine or verify what the law itself requires.

THE REQUIREMENT (as I understand it — verify independently)
{{requirement_description}}

OUR ORGANIZATION
{{org_context}}

WHAT WE ALREADY HAVE IN PLACE
{{existing_measures}}

WHO WILL OWN THIS
{{team_structure}}

CHECKLIST-BUILDING RULES
Break the requirement as I've described it into discrete, assignable action items — each one a specific thing a specific role does, not a restated summary of the requirement itself. For each item, note what evidence or documentation would demonstrate it's been done, since a compliance checklist without an evidence trail is just a to-do list that can't survive an audit. Cross-reference against what I said we already have in place, and mark each item Done, Partial, or Not Started rather than assuming everything starts from zero. Assign each item to a role from the team structure I gave you, not a named individual, so the checklist survives personnel changes. Flag any item where you genuinely don't have enough information from what I described to know what "done" would look like, rather than guessing at a specific action to fill the gap.

WHAT NOT TO DO
Do not add requirements beyond what I described, even if they sound like things that regulation commonly requires — you were not given the actual regulatory text and should not assume you know its full scope from the name alone. Do not state a specific penalty, fine amount, or enforcement consequence for non-compliance unless I gave you that figure; if it matters, mark it as something to confirm from the actual regulatory source.

OUTPUT FORMAT
1. Checklist table: Action item | Owner role | Evidence needed | Status (Done/Partial/Not Started).
2. A short list of items flagged as needing more information.
3. A closing note stating this checklist organizes the requirement as described into an actionable structure — it is not a determination of full legal compliance, and the underlying requirement's actual scope, applicability to this organization, and completeness of this checklist should be confirmed by a qualified compliance lawyer before relying on it.`,
    variables: [
      {
        name: 'requirement_description',
        description: `The compliance requirement as you currently understand it — the model works from this description, not independent legal research.`,
        example: `Our state's data breach notification law requires notifying affected individuals within 30 days of discovering a breach involving personal information.`,
        required: true,
      },
      {
        name: 'org_context',
        description: `Basic facts about your organization relevant to applying the requirement.`,
        example: `50-person SaaS company, stores customer names/emails/payment info, no dedicated compliance team.`,
        required: true,
      },
      {
        name: 'existing_measures',
        description: `What you already have in place, if anything, so the checklist isn't built from a false zero.`,
        example: `We have an incident response doc but it doesn't specify a notification timeline.`,
        required: false,
      },
      {
        name: 'team_structure',
        description: `The roles available to own checklist items.`,
        example: `IT Lead, Head of Ops, outside counsel on retainer.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`compliance-checklist`, `regulatory-compliance`, `audit-prep`, `risk-management`, `governance`],
    whyItWorks: `The most dangerous failure mode in this task isn't a badly organized checklist, it's a confidently expanded one — a model asked to build a compliance checklist around a named regulation will often fill in plausible-sounding additional requirements from its general training data about what that category of law "usually" includes, which is exactly backwards when the user hasn't provided the actual regulatory text; explicitly restricting the model to the requirement as described, and forbidding it from adding requirements it merely suspects apply, keeps the output scoped to what was actually verified rather than what sounds right. Requiring an evidence-needed column for every item is what separates a compliance checklist from a generic to-do list — a checklist that just says "notify affected individuals" without specifying what documentation proves that happened (dated notification letters, a log of who was contacted and when) is useless in front of an actual auditor or regulator, and a model not explicitly told to think about evidence will produce action items without their proof trail. Cross-referencing against existing measures before assigning status matters because organizations rarely start from zero, and a checklist that ignores what's already in place either duplicates existing work or, worse, gets treated as the full task list when half of it was already handled — an inaccurate Done/Not Started read is arguably worse than no checklist at all because it creates false confidence. The instruction to flag insufficient information rather than guess directly targets the model's tendency to fill any gap with a specific, invented detail rather than an honest "I don't have enough to specify this" — which matters enormously here because a specific action item that isn't actually what the regulation requires is worse than an acknowledged gap, since the gap at least prompts someone to go check.`,
    exampleOutput: `1. Draft breach notification letter template — Owner: outside counsel — Evidence: signed-off template on file — Status: Not Started. 2. Define internal escalation path for suspected breaches — Owner: IT Lead — Evidence: documented escalation procedure — Status: Partial (incident response doc exists, lacks timeline). Flagged: unclear from your description whether the 30-day clock starts at discovery or confirmation — confirm with counsel. This checklist organizes the requirement as described; it is not a determination of full compliance — confirm scope and completeness with a qualified compliance lawyer.`,
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
    slug: 'legal-compliance-privacy-policy-first-draft',
    category: 'legal-compliance',
    title: `Draft a privacy policy first pass structured around what you actually do with data, not a generic template`,
    description: `Produces a structured privacy policy draft built from your actual data practices — what you collect, why, who you share it with — rather than a boilerplate template with blanks filled in, flagged clearly as a draft for legal review.`,
    promptText: `Draft a first-pass privacy policy based on the actual data practices I describe below. This is a structured draft to give legal a real starting point, not a finished policy ready to publish.

WHAT DATA WE COLLECT
{{data_collected}}

WHY WE COLLECT IT
{{collection_purpose}}

WHO WE SHARE IT WITH
{{third_party_sharing}}

WHERE OUR USERS ARE LOCATED
{{user_geography}}

DRAFTING RULES
Build the policy from the specific data practices I described, not from a generic privacy policy template with placeholder categories swapped in — if I didn't mention collecting location data, don't include a location data section just because most policies have one; conversely, if I described something specific, give it real detail rather than folding it into a vague catch-all category. Structure it in the sections a reader and a regulator both expect: what's collected, why, how long it's retained (flag this as needing input if I didn't specify it), who it's shared with and why, what rights users have over their data, and how to contact us about it. Write the user-rights section based on what geography I gave you — flag explicitly that specific regional rights (like a right to deletion or data portability) depend on where users are located and which specific regulations apply, and that this needs confirmation rather than assuming a specific regulatory regime applies.

WHAT NOT TO DO
Do not name a specific privacy law or regulation as one we comply with (e.g., do not assert GDPR or CCPA compliance) unless I told you we've confirmed that — asserting compliance with a specific regulatory framework is a legal claim, and an inaccurate one here creates real liability. Do not invent a data retention period, a specific third-party vendor name, or a specific user rights process I didn't describe.

OUTPUT FORMAT
1. Draft privacy policy in standard sections (Data We Collect, Why We Collect It, Retention, Sharing, User Rights, Contact).
2. A separate list of every place you flagged missing information or a compliance claim that needs legal confirmation before publishing.
3. A closing note stating clearly this is a first-draft privacy policy built from the practices described, not a finished or legally reviewed document, and it must be reviewed by a qualified privacy lawyer — and checked against the specific regulations that actually apply to your users' locations — before publishing.`,
    variables: [
      {
        name: 'data_collected',
        description: `The specific categories of data you actually collect.`,
        example: `Name, email, IP address, and in-app usage analytics; no payment data (handled by a third-party processor).`,
        required: true,
      },
      {
        name: 'collection_purpose',
        description: `Why you collect each category, in plain terms.`,
        example: `Email for account access and product updates; usage analytics to improve the product.`,
        required: true,
      },
      {
        name: 'third_party_sharing',
        description: `Who data is shared with and why.`,
        example: `Stripe for payment processing, Mixpanel for analytics; no data sold to advertisers.`,
        required: true,
      },
      {
        name: 'user_geography',
        description: `Where your users are located, since regional rights vary.`,
        example: `Mostly US-based, with a growing user base in the EU.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`privacy-policy`, `data-compliance`, `policy-drafting`, `gdpr-ccpa-prep`, `startup-legal`],
    whyItWorks: `The single biggest liability risk in an AI-drafted privacy policy is a confidently asserted compliance claim — a model given a template-style prompt will often include boilerplate language like "we comply with GDPR and CCPA" because that phrase appears constantly in real privacy policies it learned from, without any actual verification that the described practices meet either framework's requirements, which is precisely the kind of assertion that turns a helpful draft into a legal exposure if it ships unreviewed; explicitly forbidding that specific claim, and requiring geography-dependent rights to be flagged rather than assumed, keeps the model from manufacturing false confidence in a document users will actually read and potentially rely on. Building the policy from the described data practices rather than a generic template matters because privacy policies are routinely scrutinized clause-by-clause against actual practice during a regulatory inquiry or a lawsuit, and boilerplate language describing data handling the company doesn't actually do (or omitting handling it does do) is worse than an incomplete but accurate policy — a template swap-in produces exactly that mismatch risk. Requiring missing information (like retention periods) to be flagged rather than filled with an invented plausible default addresses the model's tendency to complete a structured document fully even when a specific fact wasn't provided, which here would mean fabricating a retention period that the company doesn't actually follow, creating a policy that promises something operationally untrue. Keeping the invented-detail prohibition explicit for third-party vendor names and rights processes closes the same gap for the sections most likely to be wrong in exactly the way a regulator or a plaintiff's lawyer would find first.`,
    exampleOutput: `Data We Collect: We collect your name, email address, IP address, and in-app usage data when you use our product. Why: Email is used for account access and product updates; usage data helps us improve features. Sharing: We share payment information with Stripe and usage analytics with Mixpanel; we do not sell data to advertisers. Flagged for legal review: retention period not specified — needs input; EU user rights (GDPR) require specific confirmation of applicability and process, not assumed. This is a first draft, not a finished policy — a qualified privacy lawyer must review it against applicable regulations before publishing.`,
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
    slug: 'legal-compliance-terms-of-service-outline',
    category: 'legal-compliance',
    title: `Outline a Terms of Service structure scoped to what your product actually does before a lawyer fills it in`,
    description: `Produces a section-by-section Terms of Service outline built around your product's actual features and business model, with each section's purpose explained, so a lawyer starts from a scoped structure instead of a blank page or a mismatched template.`,
    promptText: `Build a Terms of Service outline for the product described below. I need an outline — section headings with a description of what each section needs to cover for this specific product — not full legal language, since that needs to come from a lawyer.

PRODUCT DESCRIPTION
{{product_description}}

BUSINESS MODEL
{{business_model}}

USER-GENERATED CONTENT OR ACCOUNTS?
{{user_content_and_accounts}}

KNOWN RISK AREAS
{{known_risks}}

OUTLINE-BUILDING RULES
Start from what this specific product does, not a generic SaaS ToS checklist — if there's no user-generated content, don't include a content-moderation section just because most ToS documents have one; if there is, give it real weight since that's where a lot of actual dispute risk sits. For each section you include, write a short paragraph (not legal text) explaining what this section needs to address for this product specifically and why it matters here, so whoever drafts the real language later understands the purpose, not just the heading. Order sections by how central they are to this specific product's risk profile, not by whatever order a generic template uses — if payment disputes are the most likely real-world issue, that section shouldn't be buried near the bottom. Flag the sections that most need direct legal input rather than treating all sections as equally templatable — arbitration clauses, liability limitations, and any section touching a regulated activity should be marked as "needs counsel to draft this section specifically," not just reviewed after the fact.

WHAT NOT TO DO
Do not draft actual binding legal language for arbitration, liability limitation, or governing law clauses — describe what these sections need to accomplish and flag them for a lawyer to write, since getting this specific language wrong has outsized consequences. Do not assert that any particular clause is "standard" or "enforceable" — describe function, not legal effect.

OUTPUT FORMAT
1. Ordered outline: Section heading | Purpose paragraph | Needs-counsel flag (yes/no).
2. A short summary of which 2-3 sections carry the most real risk for this specific product and why.
3. A closing note stating this is a scoping outline to prepare for a lawyer's drafting work, not usable Terms of Service language, and the actual document must be drafted or reviewed by a qualified lawyer before publishing or requiring users to accept it.`,
    variables: [
      {
        name: 'product_description',
        description: `What the product actually does.`,
        example: `A marketplace app connecting freelance photographers with clients, including in-app messaging and payments.`,
        required: true,
      },
      {
        name: 'business_model',
        description: `How the business makes money, since this shapes payment and liability sections.`,
        example: `Takes a 15% commission on completed bookings; free to browse and message.`,
        required: true,
      },
      {
        name: 'user_content_and_accounts',
        description: `Whether users create accounts, post content, or interact with each other.`,
        example: `Users create profiles, upload portfolio images, and message each other directly.`,
        required: true,
      },
      {
        name: 'known_risks',
        description: `Risk areas you already know are relevant to this product.`,
        example: `Payment disputes between clients and photographers, and potential copyright issues with uploaded portfolio images.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`terms-of-service`, `legal-drafting`, `startup-legal`, `product-legal-prep`, `compliance-drafting`],
    whyItWorks: `Most ToS templates are ordered and weighted by convention rather than by what actually matters for a given product, and a model asked to "outline a ToS" without product-specific grounding will reproduce that same generic ordering — requiring the product description, business model, and content/account details up front forces the outline to be scoped to this product's actual risk surface, so a marketplace with direct user messaging and payment disputes gets those sections built out and ordered near the top, while a product with none of that skips sections that would otherwise be generic filler nobody needed. Writing a purpose paragraph instead of legal language for each section is the deliberate boundary that keeps this a scoping tool rather than an unauthorized attempt at drafting binding text — a lawyer working from "here's what this section needs to accomplish and why it matters for this product" starts from genuine leverage, while a lawyer handed AI-generated arbitration or liability language has to fully re-derive it anyway, so skipping straight to fake legal language for the highest-stakes clauses would waste effort and create false confidence. Explicitly flagging which sections need direct counsel input rather than treating everything as equally templatable reflects a real asymmetry in ToS risk: liability limitation and arbitration clauses have outsized legal consequences if worded even slightly wrong and courts scrutinize them heavily, while other sections are comparatively low-stakes boilerplate — treating them identically would either waste legal review time on the boilerplate or, worse, let the highest-risk sections get treated as templatable when they're exactly the ones that need the most careful, jurisdiction-specific drafting.`,
    exampleOutput: `1. Payment and Commission Disputes — Purpose: since the business takes a 15% commission on bookings, this section must define how disputes between client and photographer over completed work are handled and where the commission stands if a refund occurs — Needs counsel: yes. 2. User Content and IP Ownership — Purpose: portfolio images are user-uploaded; this section needs to clarify who owns uploaded content and how copyright disputes between users are handled — Needs counsel: yes. Top risk summary: payment disputes and uploaded-content IP ownership carry the most real-world risk for this product. This is a scoping outline, not usable ToS language — a qualified lawyer must draft or review the actual document before publishing.`,
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
    slug: 'legal-compliance-vendor-contract-review-prep',
    category: 'legal-compliance',
    title: `Prep for a vendor contract review call so you walk in with the right questions, not just the document`,
    description: `Turns a vendor contract draft into a prioritized list of questions and points to raise on the review call, organized around what actually matters for this specific vendor relationship rather than a generic contract checklist.`,
    promptText: `Help me prepare for a review call about the vendor contract below by turning it into a prioritized list of questions and points to raise — not a legal review, a call-prep tool.

VENDOR CONTRACT DRAFT
{{vendor_contract}}

WHAT WE'RE BUYING
{{service_description}}

WHY THIS VENDOR MATTERS TO US
{{vendor_importance}}

WHO'S ON THE CALL
{{call_participants}}

PHASE 1: SCAN FOR WHAT NEEDS A QUESTION
Read the draft and identify every place where the contract is vague, silent, or leaves something to the vendor's discretion on a point that matters to how we'd actually operate under it — SLA specifics, what happens on outage or breach, data ownership if we stop using the service, and price change mechanics are common blind spots but check the actual text, not just this generic list.

PHASE 2: TURN EACH GAP INTO A QUESTION
For each gap, write the actual question to ask on the call, phrased the way you'd say it out loud, not a restatement of the contract issue in legal terms. Prioritize by what would hurt most if left unresolved and only discovered later.

PHASE 3: PREP TALKING POINTS FOR THE PARTICIPANTS
Given who's on the call, note briefly who's best positioned to ask which question (a technical question probably lands better from whoever knows the technical stack, a budget question from whoever owns the budget).

WHAT NOT TO DO
Do not answer the questions yourself by guessing what the vendor's likely answer is — the point is to walk in prepared to ask, not to pre-fill the vendor's position. Do not state whether any specific term is legally enforceable or standard for this industry; flag it as a question for legal only if it seems like something outside what this team should decide informally.

OUTPUT FORMAT
1. Prioritized question list (highest-stakes first), each phrased conversationally.
2. Suggested asker for each question based on who's on the call.
3. A short separate list of anything that should go to legal for review rather than be resolved live on the call.
4. A closing note that this is call-prep, not a legal review — the final contract should be reviewed by a qualified lawyer before signature, especially anything flagged for legal above.`,
    variables: [
      {
        name: 'vendor_contract',
        description: `The vendor contract draft you're preparing to discuss.`,
        example: `Draft MSA from a cloud infrastructure vendor, including an SLA exhibit.`,
        required: true,
      },
      {
        name: 'service_description',
        description: `What you're actually buying from this vendor.`,
        example: `Managed database hosting for our production environment.`,
        required: true,
      },
      {
        name: 'vendor_importance',
        description: `How critical this vendor relationship is, since that changes what's worth pushing on.`,
        example: `This would host our core production database — an outage here takes our whole product down.`,
        required: true,
      },
      {
        name: 'call_participants',
        description: `Who will be on the review call and their roles.`,
        example: `Our CTO, Head of Finance, and me (Operations Lead).`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`vendor-contracts`, `negotiation-prep`, `meeting-prep`, `procurement`, `risk-flagging`],
    whyItWorks: `Vendor contract calls tend to go badly not because someone missed a clause but because the gaps — the things the contract is silent about — never get surfaced until they matter, usually during an actual outage or dispute; scanning specifically for vagueness and silence rather than just "problems" targets that pattern directly, since a model asked to find problems in a contract will focus on what's explicitly there and can walk right past what was left out, which is exactly where operational risk with a critical vendor tends to hide. Phasing this into scan-then-question-then-assign keeps the questions grounded in the actual contract text instead of drifting into a generic "things to ask vendors" list — the named blind spots (SLA specifics, breach/outage consequences, data portability, price mechanics) are given as things to check for in this text, not asserted as present, which keeps the output tied to what this draft specifically does or doesn't say. Assigning a suggested asker based on the real call participants matters practically: a technical SLA question landing from the CTO carries different weight and gets a different quality of vendor answer than the same question from Operations, and skipping this step produces a list that reads right but doesn't map to how the actual conversation will unfold. The instruction against pre-filling the vendor's likely answer addresses a subtle failure where a model, having just identified a gap, immediately starts speculating about what the vendor probably means or intends — which defeats the purpose of a live question and can anchor the team on an assumption that turns out to be wrong when the vendor actually answers.`,
    exampleOutput: `1. "What happens to our data if we terminate the contract — do we get an export, and how long do we have to retrieve it?" — Suggested asker: CTO (technical/data implications). Priority: high, since this hosts our core production database. 2. "Can you walk us through exactly what counts as a qualifying outage under the SLA, and what the credit actually looks like in dollars?" — Suggested asker: Head of Finance. Legal review list: the liability cap language in Section 11 should go to legal before signature. This is call-prep, not a legal review — a qualified lawyer should review the final contract before signing.`,
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
    slug: 'legal-compliance-employee-handbook-policy-draft',
    category: 'legal-compliance',
    title: `Draft an employee handbook policy section that a manager could actually apply consistently`,
    description: `Produces one handbook policy section at a time, written for consistent day-to-day application by managers who aren't HR specialists, flagged as a first draft pending HR and legal sign-off.`,
    promptText: `Draft one section of our employee handbook on the topic below. Write it so a manager who isn't an HR specialist could apply it consistently in a real situation, not so it merely reads well.

HANDBOOK TOPIC
{{handbook_topic}}

COMPANY CONTEXT
{{company_context}}

SITUATIONS THIS POLICY NEEDS TO HANDLE
{{real_situations}}

EXISTING PRACTICE (IF ANY)
{{existing_practice}}

DRAFTING APPROACH
Write the policy around the real situations described, since a handbook section that only covers the easy, obvious case and stays silent on the messy realistic ones is the section managers end up calling HR about anyway, defeating its purpose. State the rule for each situation as something a manager could apply without judgment calls beyond what the policy itself gives them — if a decision genuinely requires judgment, say explicitly whose judgment (the manager's, HR's, or legal's) rather than leaving it ambiguous who decides. Where the existing practice differs from what you're drafting, note the gap explicitly rather than silently changing established practice — a handbook that contradicts what people already understand to be true creates confusion and potential unfairness claims from anyone who acted on the old understanding. Keep the tone plain and direct — a handbook section is reference material an employee or manager reads once and needs to apply correctly months later without re-reading the whole thing, not a document meant to be read for tone.

WHAT NOT TO DO
Do not state a specific legal minimum (like a required number of leave days, notice period, or accommodation standard) as if it's settled — these vary by jurisdiction and change, and stating one as fact risks the handbook being wrong the moment it's published or in a different state or country. Mark any such number as "[confirm minimum with legal/HR for applicable jurisdiction]" instead of asserting a specific figure.

OUTPUT FORMAT
1. The policy section (heading, plain-language text, one worked example for the trickiest situation named).
2. A short list of any specific legal minimums or figures flagged for HR/legal confirmation.
3. A note on any gap between this draft and existing practice, if one was described.
4. A closing line stating this is a first-draft handbook section pending HR and legal review, and it should not be added to the handbook or relied upon by managers or employees until a qualified lawyer has confirmed it against applicable employment law.`,
    variables: [
      {
        name: 'handbook_topic',
        description: `The specific handbook topic to draft.`,
        example: `Requesting and approving unplanned sick leave.`,
        required: true,
      },
      {
        name: 'company_context',
        description: `Basic facts about the company relevant to this policy.`,
        example: `60-person company, mostly remote, managers across 4 different states.`,
        required: true,
      },
      {
        name: 'real_situations',
        description: `The actual messy scenarios this policy needs to cover, not just the easy case.`,
        example: `Employee calls in sick the morning of an important client meeting; employee has taken 5 unplanned sick days in one month.`,
        required: true,
      },
      {
        name: 'existing_practice',
        description: `How this is currently handled informally, if at all.`,
        example: `Currently just handled case-by-case by each manager with no consistent standard.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`employee-handbook`, `hr-policy`, `workplace-policy`, `manager-enablement`, `compliance-drafting`],
    whyItWorks: `A handbook policy drafted from the topic name alone tends to cover the easy, textbook version of the situation and stay silent on exactly the messy real cases that prompted someone to want a written policy in the first place — requiring the actual real situations as input and instructing the model to write the policy around them, including a worked example for the trickiest one, is what keeps the draft from being technically about the right topic while being practically useless the first time a manager hits an edge case. Insisting that every rule be applicable "without a judgment call beyond what the policy gives" — or explicit about whose judgment it is when one is unavoidable — targets a specific and common handbook failure where vague language ("managers should use discretion") gets written in because it sounds reasonable, but in practice produces inconsistent enforcement across managers, which is the exact problem multi-state or multi-manager companies write handbooks to prevent. Flagging the gap between the draft and existing informal practice matters because handbooks don't get written into a vacuum — employees and managers already have some shared understanding of how things work, and a new written policy that silently contradicts that understanding, rather than naming the change explicitly, creates a fairness problem for anyone who reasonably relied on the old norm. The prohibition on stating specific legal minimums as settled fact is the highest-stakes safety rule here: employment law thresholds (leave entitlements, notice periods, accommodation standards) are jurisdiction-specific and change over time, and a model asserting a specific number with confidence risks the handbook being factually wrong from the moment it's adopted in exactly the area — mandatory minimums — where getting it wrong creates real legal exposure.`,
    exampleOutput: `Unplanned Sick Leave. If you're unable to work due to illness, notify your manager as early as possible before your shift or scheduled meetings begin — a text or Slack message is sufficient; you do not need to provide a doctor's note for absences of [confirm minimum with legal/HR for applicable jurisdiction] days or fewer. Worked example: if you call in sick the morning of an important client meeting, notify your manager immediately so they can arrange coverage; the sick leave itself is still approved under this policy regardless of meeting timing. Flagged for legal/HR: minimum documentation threshold, and any state-specific paid sick leave requirements across your 4 states. This is a first draft pending HR and legal review — do not add to the handbook until confirmed by a qualified lawyer.`,
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
    slug: 'legal-compliance-compliance-risk-register-builder',
    category: 'legal-compliance',
    title: `Build a compliance risk register that ranks by actual exposure instead of listing every possible risk equally`,
    description: `Converts a list of compliance areas into a ranked risk register with likelihood, impact, and current mitigation status, so leadership sees where to act first instead of a flat inventory of everything that could go wrong.`,
    promptText: `Build a compliance risk register from the areas I describe below. The output needs to rank risks by actual exposure, not just list them — a register where everything looks equally urgent is not useful to leadership deciding where to spend limited time.

COMPLIANCE AREAS TO ASSESS
{{compliance_areas}}

ORGANIZATION PROFILE
{{org_profile}}

CURRENT MITIGATIONS IN PLACE
{{current_mitigations}}

WHO REVIEWS THIS REGISTER
{{register_audience}}

BUILDING THE REGISTER
For each compliance area, state the specific risk in concrete terms — not "data privacy risk" as a category, but the actual thing that could go wrong ("customer PII stored without encryption at rest, discovered during a breach"). Rate likelihood and impact separately using a simple scale (Low/Medium/High) based on the organization profile and current mitigations you were given, and explain the rating in one sentence rather than leaving the score unjustified — an unexplained score is not something the audience can push back on or trust. Cross-reference against the mitigations described so a risk with a strong existing control gets rated differently than the same risk with nothing in place — do not rate risks in a vacuum as if no mitigation existed when one was described. Sort the final register by combined exposure (likelihood x impact), highest first, so the audience reads top-to-bottom in priority order rather than having to re-sort a flat list themselves.

WHAT NOT TO DO
Do not assign a specific dollar figure or fine amount to any risk unless one was given to you — invented financial figures in a document leadership might act on are worse than no figure at all. Do not state that a risk is or isn't currently a compliance violation — a risk register describes exposure and priority, not a legal determination of current compliance status.

OUTPUT FORMAT
1. Ranked risk register table: Risk (specific) | Likelihood | Impact | Rating rationale | Current mitigation | Combined exposure.
2. Top 3 priorities called out separately with a one-line "why this first" for each.
3. A closing note stating this register is a prioritization tool built from the information described, not a legal compliance audit or determination — a qualified compliance lawyer or auditor should validate the actual compliance status of each area before this register is used to make final resourcing or disclosure decisions.`,
    variables: [
      {
        name: 'compliance_areas',
        description: `The compliance areas or categories you want assessed.`,
        example: `Data privacy handling, workplace safety documentation, and vendor contract compliance.`,
        required: true,
      },
      {
        name: 'org_profile',
        description: `Key facts about the organization that affect likelihood and impact.`,
        example: `80-person manufacturing company, handles customer PII for e-commerce orders, has a physical warehouse floor.`,
        required: true,
      },
      {
        name: 'current_mitigations',
        description: `What's currently in place for each area, so ratings reflect reality, not a blank slate.`,
        example: `Data encrypted in transit but not at rest; warehouse safety training done annually but not tracked per employee.`,
        required: true,
      },
      {
        name: 'register_audience',
        description: `Who will actually read and act on this register.`,
        example: `Executive leadership team deciding Q3 budget priorities.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`risk-register`, `compliance-management`, `risk-assessment`, `governance`, `audit-prep`],
    whyItWorks: `A risk register that scores every listed item as roughly the same severity fails at its one job, which is telling leadership where to act first — that flattening happens by default because a model given a list of compliance areas without instruction to differentiate will tend to rate most things Medium, the safe middle answer, unless it's explicitly forced to justify each rating against specific organizational facts and sort by combined exposure so the ranking is visible rather than something the reader has to reconstruct themselves. Requiring the risk to be stated as a concrete scenario rather than a category label ("PII stored without encryption at rest" instead of "data privacy risk") matters because a vague category doesn't tell leadership what to actually fix, while a specific failure mode does — and it also makes the likelihood/impact rating checkable, since a reader can look at the specific scenario and judge whether Medium or High makes sense, which a bare category name doesn't allow. Cross-referencing against current mitigations before rating is what keeps the register honest about present-tense risk rather than theoretical risk — the same category (data privacy) is a very different actual risk with encryption at rest in place versus without it, and rating in a vacuum would produce a register that doesn't reflect the organization's actual current exposure, defeating the register's purpose of guiding where new investment is most needed. The prohibitions on inventing dollar figures and on asserting current compliance violation status are both aimed at the same failure: a model will readily produce a specific-sounding number or a definitive compliance verdict because specificity reads as more authoritative, but neither is something the model can actually determine from a short description, and leadership acting on a fabricated fine estimate or an unverified violation claim is a worse outcome than the register simply flagging that a compliance lawyer or auditor needs to confirm it.`,
    exampleOutput: `1. Risk: Customer PII stored without encryption at rest, exposed in a breach scenario. Likelihood: Medium (e-commerce data is a common attack target; no current at-rest encryption). Impact: High (customer PII breach carries notification obligations and reputational cost). Current mitigation: encryption in transit only. Combined exposure: High. Top priority #1: this combines a plausible likelihood with severe impact and only partial mitigation — closing the at-rest encryption gap addresses the largest single exposure on this register. This register is a prioritization tool, not a compliance audit — validate actual compliance status with a qualified lawyer or auditor before final resourcing decisions.`,
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
    slug: 'legal-compliance-regulatory-change-brief',
    category: 'legal-compliance',
    title: `Turn a regulatory change you've heard about into a one-page brief leadership can actually act on`,
    description: `Structures a regulatory change you describe into a concise internal brief covering what it means for your organization specifically and what needs to happen next, without asserting facts about the regulation you haven't verified.`,
    promptText: `Write a one-page internal brief on the regulatory change described below, for the audience named. Use only what I've told you about the change — do not add detail about the regulation itself that I haven't given you, since you have not verified the actual regulatory text.

THE CHANGE (as I understand it — to be verified)
{{regulatory_change}}

SOURCE OF THIS INFORMATION
{{information_source}}

WHO THIS BRIEF IS FOR
{{brief_audience}}

WHY THIS MATTERS TO US SPECIFICALLY
{{org_relevance}}

BRIEF STRUCTURE
Open with a two-sentence plain summary of the change as I described it, clearly labeled as unverified pending confirmation from the actual regulatory source or counsel. Then explain, based only on the organizational relevance I gave you, what this could mean for us specifically — not a general explanation of the regulatory area, but the concrete operational implication for our situation. List open questions that need to be answered before we can act — what exactly is required, by when, who's affected, what the compliance mechanism looks like — rather than guessing at answers to fill gaps in what I described. Propose a short list of immediate next steps that don't depend on those open questions being resolved yet (e.g., "confirm with counsel whether this applies to us," "identify who owns this internally") so the brief is useful even before the details are nailed down.

WHAT NOT TO DO
Do not state an effective date, penalty amount, specific compliance mechanism, or scope of who's covered unless I explicitly gave you that detail — these are exactly the facts that need verification, and stating them with confidence when they came from an unverified source compounds the risk of the information being wrong. Do not cite a specific statute number, agency name, or legal source unless I gave it to you.

OUTPUT FORMAT
1. Summary (labeled unverified/pending confirmation).
2. Specific relevance to us.
3. Open questions needing verification.
4. Immediate next steps that don't require those answers first.
5. A closing line stating this brief is based on unverified information as described and must be confirmed against the actual regulatory source, and reviewed by a qualified compliance lawyer, before any compliance action, public statement, or resourcing decision is made based on it.`,
    variables: [
      {
        name: 'regulatory_change',
        description: `The regulatory change as you currently understand it.`,
        example: `I heard our state is introducing new pay transparency requirements for job postings starting sometime next year.`,
        required: true,
      },
      {
        name: 'information_source',
        description: `Where this information came from, since that affects how much verification is needed.`,
        example: `Mentioned in an industry newsletter; haven't seen the actual bill text.`,
        required: true,
      },
      {
        name: 'brief_audience',
        description: `Who this brief is for.`,
        example: `Head of HR and the executive team.`,
        required: true,
      },
      {
        name: 'org_relevance',
        description: `Why this specifically matters to your organization.`,
        example: `We post 15-20 job openings a month across 3 states and don't currently include salary ranges.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`regulatory-brief`, `compliance-communication`, `internal-comms`, `policy-monitoring`, `executive-briefing`],
    whyItWorks: `The realistic failure mode for this task isn't a badly structured brief, it's a model quietly upgrading an unverified rumor into a confidently stated fact — given a vague input like "I heard our state is introducing pay transparency requirements," a model asked to "write a brief" will often fill in a plausible effective date, scope, or penalty because briefs conventionally include those details and the model has seen many real regulatory briefs with them present, which here would mean inventing exactly the facts that haven't actually been confirmed and handing leadership something that looks authoritative but isn't. Explicitly restricting the model to what was described, and instructing it to list open questions rather than guess at their answers, is the direct countermeasure — it keeps the brief honest about the boundary between what's known and what needs verification, which is the entire point of a brief meant to prompt action rather than substitute for it. Requiring the organizational relevance section to stay concrete and specific (based only on the org_relevance input) rather than drifting into general commentary about the regulatory area keeps the brief useful to this specific audience instead of reading like a generic explainer they could have found in a newsletter themselves. Separating "open questions" from "immediate next steps that don't depend on those answers" solves a real organizational stall pattern where a brief that only lists unknowns produces no action because everyone is waiting for someone else to resolve the uncertainty first — giving concrete, unblocked next steps (confirm with counsel, assign an owner) means the brief drives movement even while the underlying facts are still being verified, which is exactly the state most regulatory-change briefs are written in.`,
    exampleOutput: `Summary (unverified, pending confirmation): We've heard from an industry newsletter that our state may introduce pay transparency requirements for job postings, though we haven't seen the actual bill text or an effective date. Relevance to us: we post 15-20 openings monthly across 3 states without salary ranges, so if this applies to us as described, it would require a real change to our hiring workflow. Open questions: exact effective date, which of our 3 states are covered, whether existing postings need updating or only new ones. Next steps: assign HR to confirm the bill's actual text and status this week; loop in outside counsel before making any posting changes. This brief is based on unverified information and must be confirmed against the actual regulatory source and reviewed by a qualified compliance lawyer before any action is taken.`,
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
    slug: 'legal-compliance-legal-issue-spotting-from-a-fact-pattern',
    category: 'legal-compliance',
    title: `Spot the legal issues buried in a messy fact pattern before you take it to a lawyer`,
    description: `Reads a real-world situation you describe and identifies which legal issues it might implicate, framed explicitly as issue-spotting to prepare for a lawyer conversation, never as an answer to whether you're in the right.`,
    promptText: `Read the situation below and spot which legal issues it might raise. This is issue-spotting to help me prepare for a conversation with a lawyer — not an assessment of who's right, who's liable, or what the outcome would be.

SITUATION
{{fact_pattern}}

WHO I AM IN THIS SITUATION
{{my_position}}

WHAT I'M TRYING TO FIGURE OUT
{{my_goal}}

WHAT I'VE ALREADY DONE, IF ANYTHING
{{actions_taken}}

ISSUE-SPOTTING RULES
Go through the fact pattern and name every area of law this situation could plausibly touch — contract, employment, IP, tort, regulatory, or others — based on what actually happened, not a generic list of areas that come up in situations like this in general. For each issue you spot, state the specific fact in the situation that triggers it, so I can see why you flagged it rather than just a bare label. Note where a single fact could cut multiple ways depending on details you don't have — issue-spotting means surfacing possibilities, not narrowing to the one you think is most likely, since a lawyer needs the full set of angles, not your best guess pre-filtered. Flag explicitly which facts, if you had them, would change which issues actually matter here — this tells me what to find out or clarify before or during the lawyer conversation.

WHAT NOT TO DO
Do not state who is likely liable, whether any action taken was lawful, or what the likely outcome would be — none of that is issue-spotting, all of it is legal judgment you're not positioned to make from a fact pattern alone. Do not recommend a specific legal strategy or course of action; recommend, at most, what to ask a lawyer.

OUTPUT FORMAT
1. Table: Legal area potentially implicated | Triggering fact | Why it's uncertain / what would change it.
2. A short list of facts worth clarifying before or during the lawyer conversation.
3. A closing note stating this is issue-spotting to prepare for a conversation with a lawyer, not legal advice or an assessment of your position, and a qualified lawyer should be consulted before you rely on any of these flagged issues to make a decision or take action.`,
    variables: [
      {
        name: 'fact_pattern',
        description: `What actually happened, in as much factual detail as you can give.`,
        example: `A former employee started a competing business using a client list they had access to during employment; no signed non-compete, but there was a confidentiality agreement.`,
        required: true,
      },
      {
        name: 'my_position',
        description: `Who you are in this situation.`,
        example: `I'm the former employer.`,
        required: true,
      },
      {
        name: 'my_goal',
        description: `What you're actually trying to figure out before talking to a lawyer.`,
        example: `Whether this is worth pursuing at all, and what I should have ready to show a lawyer.`,
        required: true,
      },
      {
        name: 'actions_taken',
        description: `Anything you've already done in response to the situation.`,
        example: `Sent a cease-and-desist email myself before thinking to consult a lawyer.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`issue-spotting`, `legal-prep`, `fact-pattern-analysis`, `pre-consultation`, `dispute-prep`],
    whyItWorks: `Issue-spotting is a genuinely different task from legal advice, and the difference lives entirely in whether the output narrows to a conclusion or stays open across possibilities — a model that isn't explicitly told to surface multiple angles will naturally converge on the single most likely-sounding issue and present it with more confidence than the fact pattern alone actually supports, which is the opposite of what someone preparing for a lawyer conversation needs, since the lawyer's actual value is often in the angles the client didn't think to ask about. Requiring each flagged issue to cite the specific triggering fact rather than stand as a bare label keeps the exercise anchored to what's actually in the fact pattern instead of a generic "situations like this often involve" list, and it gives the person reading the output a way to judge for themselves whether the flag makes sense given what they know that wasn't in the prompt. Explicitly asking what additional facts would change which issues matter is what makes this genuinely useful pre-consultation prep rather than a parlor trick — a lawyer's first move in an actual consultation is almost always to ask for missing facts, and surfacing that need in advance means the person walks in already knowing what to have ready, shortening the expensive part of the actual legal conversation. The hard prohibition on stating likely liability, lawfulness, or outcome is the core safety mechanism distinguishing this from unauthorized legal advice: issue-spotting from an incomplete, one-sided fact pattern cannot responsibly produce a liability judgment, because the model has only heard one side and none of the actual applicable law's nuance, and pretending otherwise would hand someone a false sense of their position's strength or weakness before they've even talked to someone qualified to assess it.`,
    exampleOutput: `Legal area: Breach of confidentiality agreement — Triggering fact: employee had access to the client list under a signed confidentiality agreement — Uncertainty: depends on whether the client list meets the agreement's definition of confidential information, which you'd need to check against the actual document. Legal area: Trade secret misappropriation — Triggering fact: use of a client list to compete — Uncertainty: depends on whether reasonable steps were taken to keep the list secret, which is a factual question a lawyer would need more detail to assess. Facts to clarify: what does the confidentiality agreement's definition section actually say; did you take any steps to mark the list confidential. This is issue-spotting to prepare for a lawyer conversation, not legal advice — consult a qualified lawyer before taking any further action, including anything related to your cease-and-desist email.`,
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
    slug: 'legal-compliance-ma-due-diligence-question-list',
    category: 'legal-compliance',
    title: `Build a due diligence question list scoped to what actually makes this specific deal risky`,
    description: `Produces a prioritized due diligence question list for a specific acquisition or investment, organized by which questions matter most given the deal's actual shape, rather than a generic due diligence template.`,
    promptText: `Build a due diligence question list for the deal described below. I need this scoped to what actually matters for this specific transaction, not a generic due diligence checklist copied across every deal type.

DEAL TYPE AND STRUCTURE
{{deal_structure}}

TARGET COMPANY DESCRIPTION
{{target_description}}

OUR BIGGEST CONCERNS GOING IN
{{key_concerns}}

WHAT WE ALREADY KNOW
{{known_information}}

BUILDING THE QUESTION LIST
Organize questions by category (financial, legal/contractual, IP, employment, operational, customer concentration — whichever categories the deal type and target description actually make relevant, not every possible category by default). Within each category, prioritize the questions that follow from the concerns stated above rather than treating every category as equally important — if customer concentration is the named worry, that category's questions should be sharper and more numerous than a category nobody flagged as a concern. Write each question as something you'd actually ask the target or their counsel, specific enough that a vague or evasive answer would itself be informative — "describe your customer contracts" is weak; "what percentage of revenue comes from your top 3 customers, and do those contracts have change-of-control termination rights" is a real question. Do not repeat what's already known — if I told you we already know something, don't ask a question that just re-asks it; ask the follow-up question that goes deeper from that known starting point.

WHAT NOT TO DO
Do not answer the due diligence questions yourself or predict what the target's answers will likely be. Do not assess deal risk or recommend proceeding or walking away — this is a question-generation task, not a deal recommendation.

OUTPUT FORMAT
1. Question list by category, prioritized within each category by relevance to stated concerns.
2. A short flagged list of any category where you have too little information about the deal to write specific questions, with a note on what's needed.
3. A closing note stating this is a due diligence question-preparation aid, not legal or financial due diligence itself, and the actual diligence process, document review, and risk assessment should be conducted by qualified legal and financial advisors before any decision to proceed with the transaction.`,
    variables: [
      {
        name: 'deal_structure',
        description: `What kind of transaction this is and its basic structure.`,
        example: `Acquiring a majority stake (70%) in a privately held software company, cash and stock mix.`,
        required: true,
      },
      {
        name: 'target_description',
        description: `What the target company does and its basic profile.`,
        example: `20-person B2B SaaS company selling to mid-market logistics companies, roughly $3M ARR.`,
        required: true,
      },
      {
        name: 'key_concerns',
        description: `What you're most worried about going into this deal specifically.`,
        example: `Customer concentration — we suspect a large share of revenue comes from just a couple of clients.`,
        required: true,
      },
      {
        name: 'known_information',
        description: `What you already know, so questions don't just re-ask it.`,
        example: `We know their top client is a logistics firm that's been with them 3 years; we don't know contract terms or renewal history.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`due-diligence`, `mergers-and-acquisitions`, `deal-prep`, `risk-assessment`, `investment-prep`],
    whyItWorks: `A generic due diligence checklist treats every deal identically, which is exactly wrong — a customer-concentration worry in a $3M ARR SaaS acquisition needs sharp, specific questions about top-client contract terms and renewal history, while the same checklist applied to a manufacturing asset purchase would waste effort on categories that don't actually carry the deal's real risk; requiring the deal structure, target description, and named concerns up front is what lets the model weight categories by actual relevance instead of listing all of them with equal, shallow coverage. Instructing the model to write questions specific enough that an evasive answer would itself be informative targets a real weakness in how models default to writing diligence questions — "describe your customer contracts" is the kind of question a target's counsel can answer with three vague sentences that sound complete but reveal nothing, while a question asking for a specific percentage and a specific contract term structurally can't be answered evasively without the evasion itself being a signal worth noting. The instruction not to re-ask what's already known and instead go one level deeper is what keeps the list from wasting the actual diligence conversation's limited time restating things the buyer's team has already established, and pushes the model to produce the harder, more useful follow-up question instead of the easy first-level one. The prohibition on predicting answers or recommending whether to proceed is the necessary boundary here: due diligence question generation is a legitimate prep task, but assessing the deal itself requires the actual documents, financials, and legal review that this exercise explicitly hasn't done, and a model volunteering a walk-away recommendation from a short description would be substituting a guess for the entire diligence process this list is meant to kick off.`,
    exampleOutput: `Customer Concentration: What percentage of total revenue comes from your top 3 customers individually and combined? For your largest customer specifically (the 3-year logistics client), what does the current contract term look like, when is the renewal date, and does it include a change-of-control termination right that could be triggered by this acquisition? Flagged: too little information provided about the company's cap table to write specific questions on equity structure — need target's cap table before that category can be scoped. This is a due diligence question-prep aid, not the diligence process itself — qualified legal and financial advisors should conduct the actual review before any decision to proceed.`,
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
    slug: 'legal-compliance-contract-negotiation-points-briefing',
    category: 'legal-compliance',
    title: `Turn a redlined contract draft into a negotiation-points briefing your team can actually use in the call`,
    description: `Builds a ranked negotiation-points briefing from a contract draft and your fallback positions, sorted by which clauses are worth spending leverage on versus which to concede early — framed throughout as a draft for a qualified lawyer to review before it's used in any actual negotiation.`,
    promptText: `You are preparing a negotiation-points briefing ahead of a contract call, from a draft agreement and my stated priorities — not a legal opinion on the contract, a working document my side can use to decide what to push on and what to let go.

CONTRACT DRAFT OR CLAUSE SUMMARY
{{contract_summary}}

MY PRIORITIES, RANKED
{{ranked_priorities}}

KNOWN FALLBACK POSITIONS
{{fallback_positions}}

COUNTERPARTY LEVERAGE OR CONTEXT
{{counterparty_context}}

WHAT THIS IS FOR
{{negotiation_purpose}}

HOW TO BUILD THE BRIEFING
Group every clause you're given into three tiers: must-hold (walk-away issues), negotiable-with-a-floor (concede only down to a stated fallback), and low-cost-to-concede (trade away early to build goodwill or extract something else). For each clause in the must-hold and negotiable tiers, write one line stating what we're asking for, one line stating the floor we'd accept, and one line suggesting what we could offer in exchange if the counterparty pushes back — never assume a concession is free just because it looks minor, since a clause that reads as boilerplate to a non-lawyer can carry real liability or IP consequences a court would weigh differently. Where I have not given you a fallback position for a must-hold item, say so explicitly and mark it as needing a decision before the call, rather than inventing a reasonable-sounding floor on your own. Do not draft actual contract language or propose specific legal wording changes — this briefing is for the human negotiators in the room, not a redline itself.

WHAT NOT TO DO
Do not state or imply what any clause legally means, what a court would likely rule, or what jurisdiction's law would apply to any of this — you have no way to verify governing law, enforceability, or precedent from the summary I've given you, and stating any of that as settled fact would be legal advice, which you are not qualified to give. Do not invent statistics about industry-standard terms or typical settlement ranges; if that context would help, say what additional input would let you add it rather than filling the gap with a plausible-sounding number.

OUTPUT FORMAT
1. Three-tier clause table: must-hold / negotiable-with-floor / low-cost-to-concede, each row showing ask, floor, and possible trade.
2. A short list of any must-hold items missing a fallback position, flagged for a decision before the call.
3. A one-paragraph opening-move suggestion for how to sequence the tiers in conversation.
4. A closing line stating plainly that this briefing is a negotiation planning draft only, not legal advice, and that the underlying contract terms and any fallback positions should be reviewed and approved by a qualified lawyer before anything here is relied on or signed.`,
    variables: [
      {
        name: 'contract_summary',
        description: `The draft contract or a clause-by-clause summary of what's on the table.`,
        example: `SaaS reseller agreement draft: 90-day termination notice, uncapped indemnification for data breach, exclusivity in three named territories, 18-month non-compete.`,
        required: true,
      },
      {
        name: 'ranked_priorities',
        description: `Your side's priorities in order, from most to least important.`,
        example: `1) cap indemnification, 2) shorten non-compete to 6 months, 3) keep exclusivity, 4) termination notice is flexible.`,
        required: true,
      },
      {
        name: 'fallback_positions',
        description: `Any floor positions you already know you'd accept if pushed.`,
        example: `Would accept indemnification capped at 12 months' fees paid; would accept a 9-month non-compete as a floor.`,
        required: false,
      },
      {
        name: 'counterparty_context',
        description: `What you know about the other side's leverage, urgency, or past behavior in negotiations.`,
        example: `They need signature before their fiscal quarter closes in 11 days and have not pushed back on exclusivity in two prior deals.`,
        required: false,
      },
      {
        name: 'negotiation_purpose',
        description: `What kind of call or exchange this briefing is prepping you for.`,
        example: `45-minute call with their VP of Partnerships and outside counsel, second round after their first redline.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`contract-negotiation`, `legal-draft`, `business-ops`, `briefing-document`, `risk-tiering`],
    whyItWorks: `The three-tier clause structure works because it forces GPT-5.1 to make an explicit tradeoff judgment per clause instead of producing a flat, undifferentiated summary of the contract — a model asked to just 'summarize the negotiation points' tends to list every clause with equal weight, which is useless in an actual room where you have maybe three real asks and need to know which one to spend leverage on first. Requiring a stated floor per must-hold clause, and explicitly flagging clauses where no floor was given, closes a specific failure mode: language models are fluent enough to generate a plausible-sounding fallback position on their own, and a briefing that quietly fills that gap can hand a negotiator a false sense of where the walk-away line is. The instruction to never draft actual contract language keeps the output in the right lane — a negotiation-points briefing is a human coordination document, and blurring it into redline drafting is exactly where an unqualified AI opinion starts masquerading as legal work product. The explicit refusal to characterize enforceability or governing law matters because indemnification caps, non-compete lengths, and exclusivity terms are all enforced wildly differently across jurisdictions, and a model has no way to know which jurisdiction's courts would actually hear this deal from a plain-text summary — asserting a view here would be indistinguishable from legal advice to someone reading quickly under time pressure, which is precisely the moment this document is meant to be used.`,
    exampleOutput: `MUST-HOLD: Uncapped indemnification — Ask: cap at 12 months' fees. Floor: not yet specified, needs a decision before the call. Trade: offer faster payment terms in exchange. NEGOTIABLE: Non-compete length — Ask: 6 months. Floor: 9 months. Trade: accept if exclusivity territory count is reduced by one. This briefing is a negotiation planning draft only, not legal advice — have a qualified lawyer review the underlying terms and confirm fallback positions before the call.`,
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
    slug: 'legal-compliance-contract-redline-summary-for-business-stakeholders',
    category: 'legal-compliance',
    title: `Translate a lawyer's redline into a plain-language summary business stakeholders will actually read`,
    description: `Converts tracked-changes contract redlines into a short, non-legal summary of what changed and why it might matter to the deal, so a busy stakeholder can decide what to ask about before signing — always flagged as a draft aid pending a qualified lawyer's review.`,
    promptText: `Summarize a contract redline for a non-lawyer business stakeholder who needs to understand what changed before a signing decision, without reading the full tracked-changes document themselves.

REDLINE OR LIST OF CHANGES
{{redline_changes}}

ORIGINAL CLAUSE CONTEXT
{{original_context}}

STAKEHOLDER'S ROLE AND WHAT THEY CARE ABOUT
{{stakeholder_role}}

DEAL STAKES
{{deal_stakes}}

STEP 1 — GROUP THE CHANGES
Sort every redline into one of three groups: changes that shift risk or money (who pays for what, who's liable, how much), changes that shift control or flexibility (who can terminate, who approves what, exclusivity), and changes that are administrative or clarifying only (typo fixes, defined-term cleanup, renumbering). Most redlines are mostly the third group — say so explicitly if that's what you find, rather than making every change sound equally consequential.

STEP 2 — EXPLAIN EACH SUBSTANTIVE CHANGE IN PLAIN LANGUAGE
For every change in the first two groups, write what it used to say, what it says now, and one sentence on what that shift means in practical business terms for {{stakeholder_role}} specifically — not a restatement of the legal language, an answer to "why would I care about this one." If a change's practical impact depends on facts you don't have (deal size, existing insurance coverage, how this compares to the prior version of the relationship), say what's missing rather than guessing at the impact.

STEP 3 — FLAG WHAT NEEDS A HUMAN DECISION
List the changes, if any, that look like they materially shift risk onto our side and would benefit from a direct conversation with counsel before signing, separate from changes that are probably fine to accept as routine.

WHAT NOT TO DO
Never state whether a clause is enforceable, standard for the industry, or legally favorable to either side — you are describing what changed and its plain-business meaning, not rendering a legal judgment on it, since you cannot verify governing law or industry norms from a redline alone.

OUTPUT FORMAT
A short memo: one-paragraph overview stating how many changes are risk/money, control/flexibility, or administrative; a table of the substantive changes with before / after / plain-business-meaning; a short flagged list for counsel follow-up; and a closing line stating this is a plain-language summary for internal discussion only, not legal advice, and that a qualified lawyer should review the actual redline and confirm every point here before the contract is signed.`,
    variables: [
      {
        name: 'redline_changes',
        description: `The tracked changes, or a list of what was added/removed/modified.`,
        example: `Liability cap raised from 1x to 3x annual fees; termination-for-convenience clause added with 30-day notice; three defined terms renumbered.`,
        required: true,
      },
      {
        name: 'original_context',
        description: `What the original clause said, if the redline alone doesn't make it clear.`,
        example: `Original agreement had no termination-for-convenience clause, only termination for cause with a 60-day cure period.`,
        required: false,
      },
      {
        name: 'stakeholder_role',
        description: `Who is reading this summary and what they're responsible for.`,
        example: `VP of Sales who owns the account relationship but has no legal background and is deciding whether to escalate to legal.`,
        required: true,
      },
      {
        name: 'deal_stakes',
        description: `Rough size or importance of the deal so impact framing is proportionate.`,
        example: `$480K annual contract, our third-largest customer, renewal not new business.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`redline-summary`, `contract-review`, `plain-language`, `stakeholder-communication`, `legal-draft`],
    whyItWorks: `The three-way sort into risk/money, control/flexibility, and administrative-only exists because GPT-5.1's default instinct on a raw redline is to walk through changes in document order and describe each with roughly equal narrative weight, which buries the two or three items a stakeholder actually needs to react to inside a wall of renumbering and defined-term cleanup — sorting first, and explicitly naming when most changes are administrative, gives the reader permission to skim past the noise instead of reading every line with the same anxious attention. Asking for the plain-business-meaning framed specifically around the named stakeholder's role, rather than a generic explanation, matters because 'why does this change matter' has a different answer for a salesperson worried about account continuity than for a finance lead worried about liability exposure, and a summary that answers the wrong version of that question gets skimmed and ignored. The instruction to say what's missing rather than guess at practical impact heads off a known model behavior: given a change plus adjacent business context, GPT-5.1 will readily infer a plausible-sounding consequence even when the actual facts needed (deal history, insurance coverage, prior relationship terms) weren't supplied, and a stakeholder repeating that inferred consequence to their own boss as if it were confirmed is exactly the failure this prompt is built to prevent. The refusal to characterize enforceability or industry-standard-ness keeps the summary in translation territory rather than legal-opinion territory, which is the only place an AI-generated document belongs before a lawyer has actually reviewed it.`,
    exampleOutput: `Overview: 5 changes total — 2 shift risk/money, 1 shifts control, 2 are administrative renumbering only. RISK CHANGE: Liability cap raised 1x to 3x annual fees. Before: capped at one year's fees. After: capped at three years' fees. What it means for you: if something goes wrong, our maximum exposure on this account triples — worth a direct conversation with legal before signing. This is a plain-language summary for internal discussion only, not legal advice — a qualified lawyer should review the actual redline before signing.`,
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
    slug: 'legal-compliance-contract-obligation-extraction-tracker',
    category: 'legal-compliance',
    title: `Pull every ongoing obligation out of a signed contract into a tracker someone can actually operationalize`,
    description: `Extracts every recurring duty, deadline, and reporting requirement buried in a contract's text into a structured obligation tracker with owners and cadences, so post-signature compliance doesn't depend on someone remembering a clause on page 34.`,
    promptText: `Extract every ongoing obligation from the contract text below into a structured tracker that an operations or compliance owner can use after signature — not a summary of the deal, a working list of duties that recur or come due on a schedule.

CONTRACT TEXT OR CLAUSE EXCERPTS
{{contract_text}}

WHO WILL OWN THIS TRACKER
{{tracker_owner}}

OBLIGATION TYPES TO PRIORITIZE
{{obligation_types}}

EXISTING TRACKING SYSTEM, IF ANY
{{existing_system}}

EXTRACTION RULES
Find every clause that creates a duty extending past signature date: recurring deliverables, notice requirements, reporting or audit-cooperation duties, insurance-maintenance requirements, renewal or termination notice windows, data-handling or security obligations, and payment-adjacent duties like invoicing cadence or true-up reconciliations. For each one, extract: the exact trigger (a date, an event, a recurring interval), what must be done, who the contract names as responsible (us or the counterparty), and what happens if it's missed, only if the contract states a consequence — do not infer a penalty that isn't written. If a clause is ambiguous about timing ("reasonable notice", "periodically") mark it as ambiguous and needing clarification rather than picking a specific number yourself. Distinguish one-time closing obligations (signing deliverables, initial setup) from truly recurring ones, since only the recurring ones need an ongoing tracker entry.

WHAT NOT TO DO
Do not assess whether any obligation is burdensome, standard, or negotiable — that judgment call already happened at signature; this exercise is pure extraction for operational tracking, not a re-review of deal terms. Do not calculate specific calendar dates from relative language (e.g. "within 30 days of go-live") unless I've told you the anchor date — flag it as needing a real date input instead of guessing when go-live happened.

OUTPUT FORMAT
A table: Obligation | Trigger | Responsible Party | Cadence | Consequence-if-missed (or "not stated") | Ambiguous? (yes/no, with note). Followed by a short separated list of one-time closing obligations, kept apart from the recurring tracker. End with a line stating this extraction is a draft operational aid only, and that a qualified lawyer should review the source contract and confirm the extracted obligations and their triggers are complete and accurate before this tracker is relied on for compliance purposes.`,
    variables: [
      {
        name: 'contract_text',
        description: `The contract text or the clauses most likely to contain ongoing duties.`,
        example: `Master services agreement, sections 4 (deliverables), 7 (insurance), 9 (data security), 12 (termination), plus Exhibit B (SLA reporting).`,
        required: true,
      },
      {
        name: 'tracker_owner',
        description: `Who will use this tracker day to day.`,
        example: `Vendor management team lead who monitors five active MSAs and reports quarterly to procurement.`,
        required: true,
      },
      {
        name: 'obligation_types',
        description: `Which categories of obligation matter most for this contract.`,
        example: `Insurance certificate renewals, SLA reporting deadlines, and data breach notification windows are the priority; payment terms are handled by a separate finance system.`,
        required: true,
      },
      {
        name: 'existing_system',
        description: `Any existing tracker or calendar this needs to feed into.`,
        example: `Team currently uses a shared spreadsheet with columns Obligation / Due / Owner / Status.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`obligation-extraction`, `contract-management`, `compliance-tracking`, `legal-draft`, `operations`],
    whyItWorks: `The instruction to separate one-time closing obligations from truly recurring ones addresses a common and costly extraction mistake: a naive prompt asked to 'list obligations' will mix in signing-day deliverables with genuinely ongoing duties, and an operations owner scanning that combined list either wastes time re-tracking things already done or, worse, treats a stale one-time item as still active and misses the recurring one buried below it. Requiring the exact trigger rather than a paraphrased sense of timing matters because GPT-5.1, like most models, will smooth over vague contractual language such as 'reasonable notice' or 'periodically' into a specific-sounding default (commonly 30 days) if not explicitly told to flag ambiguity instead — that smoothing is fine for a casual reading but dangerous in a tracker someone will set calendar reminders from, since the fabricated specificity looks identical to an actual contractual deadline once it's sitting in a spreadsheet cell. The refusal to calculate calendar dates from relative language without an anchor date closes the same gap at the point of highest consequence: 'within 30 days of go-live' is meaningless as a tracked deadline until go-live actually happens, and a model willing to just pick a plausible date would hand the owner a false due date that could cause an actual missed obligation. Restricting the model from judging whether any obligation is burdensome or negotiable keeps this squarely a post-signature operational tool rather than a re-litigation of a deal that's already closed, which is the correct scope for something meant to run for the life of the contract, not just at drafting time.`,
    exampleOutput: `Obligation: Maintain cyber liability insurance, $2M minimum. Trigger: continuous, certificate due annually on contract anniversary. Responsible: Vendor. Consequence if missed: not stated in excerpt provided — flag for full-document check. Ambiguous: no. This extraction is a draft operational aid only — a qualified lawyer should review the source contract and confirm completeness before this tracker is relied on.`,
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
    slug: 'legal-compliance-contract-renewal-date-tracker-draft',
    category: 'legal-compliance',
    title: `Build a renewal-and-notice-window tracker from a stack of contracts before an auto-renewal sneaks past you`,
    description: `Reads multiple contracts' renewal and termination-notice clauses and produces a single sorted tracker of upcoming deadlines with lead-time buffers, so nobody discovers an auto-renewal three days after the notice window already closed.`,
    promptText: `You're building a renewal and termination-notice tracker across several contracts, sorted by which deadline is coming up soonest, so nothing auto-renews or lapses by surprise.

CONTRACTS AND THEIR RENEWAL CLAUSES
{{contracts_list}}

TODAY'S DATE FOR CALCULATION
{{reference_date}}

HOW MUCH LEAD TIME YOUR TEAM NEEDS
{{internal_lead_time}}

WHO SHOULD BE ALERTED FOR EACH
{{alert_owners}}

STEP 1 — EXTRACT THE RENEWAL MECHANICS PER CONTRACT
For each contract, identify: the current term end date, whether it auto-renews or requires affirmative renewal, the length of the notice window required to prevent auto-renewal or to terminate, and who the notice must be given to and in what form if the contract specifies one (written notice, certified mail, a named contact). If any of these facts are missing from what I gave you, list the contract with "needs source document check" rather than guessing the term length or notice window.

STEP 2 — CALCULATE THE ACTUAL ACTION DEADLINE
For each contract with enough information, calculate the real internal deadline: the notice window's start date, minus your stated internal lead time, working backward from the term end date. Show your calculation, not just the final date, so it can be double-checked against the source contract.

STEP 3 — SORT AND FLAG
Sort every contract by action deadline, soonest first. Separately flag any contract where the action deadline has already passed relative to {{reference_date}} — this is the most important line in the whole output, since a passed deadline may mean an unwanted auto-renewal already locked in and needs immediate attention, not routine tracking.

WHAT NOT TO DO
Do not assume a default notice window (like 30 or 60 days) for any contract that doesn't state one — mark it unknown. Do not advise on whether it's actually worth terminating or renewing any given contract; this tracker is about deadline mechanics only, not a recommendation on the underlying business relationship.

OUTPUT FORMAT
A sorted table: Contract | Term End | Auto-Renew (Y/N) | Notice Window | Calculated Action Deadline | Alert Owner | Status flag (upcoming / URGENT-already-passed / needs-source-check). Then a short paragraph highlighting the single nearest deadline. Close with a line stating this tracker is a draft scheduling aid only, not legal advice, and that a qualified lawyer should verify the actual notice requirements and deadlines against the signed contracts before anyone relies on these dates.`,
    variables: [
      {
        name: 'contracts_list',
        description: `The contracts and whatever you know about their renewal terms.`,
        example: `Contract A: 2-year term ending Nov 30 2026, auto-renews unless written notice 90 days prior. Contract B: term end unclear, notice window not specified.`,
        required: true,
      },
      {
        name: 'reference_date',
        description: `The date to calculate all deadlines relative to.`,
        example: `2026-08-14`,
        required: true,
      },
      {
        name: 'internal_lead_time',
        description: `How much buffer your team wants before the actual legal deadline.`,
        example: `Two weeks internal buffer before the contractual notice deadline, to allow for approval routing.`,
        required: true,
      },
      {
        name: 'alert_owners',
        description: `Who should be flagged as responsible for acting on each contract's deadline.`,
        example: `Contract A owned by Procurement lead; Contract B owned by Legal ops.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`renewal-tracking`, `contract-management`, `compliance-calendar`, `legal-draft`, `deadline-management`],
    whyItWorks: `Requiring GPT-5.1 to show the calculation rather than just the final deadline date exists because a language model computing backward from a term-end date through a notice window and an internal lead-time buffer is doing multi-step arithmetic on dates, a task where a fluent-sounding wrong answer is common and hard to spot without the intermediate steps shown — a visible calculation lets a human catch an off-by-one error in the notice window before it becomes a missed deadline, where a bare final date would hide the exact same error behind confident formatting. The flag for already-passed deadlines is placed as the single most emphasized output element because that's the one scenario where an auto-renewal may have already silently locked in, and a sorted list that treats a passed deadline the same visual weight as a comfortable future one buries the actual emergency inside routine housekeeping. The refusal to assume a default notice window like 30 or 60 days when the contract doesn't state one directly targets a plausible-completion failure mode: those are the two most common notice-window lengths in commercial contracts, so a model filling the gap with one of them will often just happen to be right, which is exactly what makes it dangerous — an occasionally-correct guess presented with the same confidence as a verified figure teaches the user to trust a number that was, this time, fabricated. Keeping the tracker to deadline mechanics only, with no opinion on whether renewing is a good idea, is what keeps this a scheduling tool instead of a business-advice tool, which matters because the consequence of getting the underlying renewal decision wrong is a business call for a human, while the consequence of getting the date math wrong is the kind of error this specific prompt structure is built to catch.`,
    exampleOutput: `URGENT — Contract B: action deadline needs source check, term end date unclear from input, cannot confirm status relative to 2026-08-14. Contract A: term end 2026-11-30, 90-day notice window starts 2026-09-01, minus 14-day internal buffer = action deadline 2026-08-18. Nearest deadline: Contract A in 4 days. This tracker is a draft scheduling aid only — a qualified lawyer should verify actual notice requirements against the signed contracts before anyone relies on these dates.`,
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
    slug: 'legal-compliance-issue-spotting-legal-memo-draft',
    category: 'legal-compliance',
    title: `Draft an issue-spotting memo that separates what you know from what needs a lawyer's actual research`,
    description: `Produces a structured IRAC-style issue-spotting memo from a fact pattern, clearly separating stated facts from open legal questions that require actual research and sign-off, built explicitly as a first-pass internal draft rather than a legal opinion.`,
    promptText: `Draft an issue-spotting memo from the fact pattern below — a structured first pass that organizes the facts and flags the legal questions worth researching, not a legal opinion or conclusion on how those questions resolve.

FACT PATTERN
{{fact_pattern}}

WHO THIS MEMO IS FOR
{{memo_audience}}

SPECIFIC QUESTIONS ALREADY IN MIND
{{known_questions}}

JURISDICTION OR REGULATORY CONTEXT, IF KNOWN
{{jurisdiction_context}}

MEMO STRUCTURE
Issue: state each distinct legal question the fact pattern raises, as a question, not an answer — "does the notice clause's ambiguous language create an obligation to X" rather than a stated conclusion. Rule: for each issue, state only what legal framework or type of law would govern this question in general terms (contract interpretation principles, a named statute if I've told you which one applies, a regulatory regime) — do not state what any specific law actually says or requires, since you have not been given a verified source for its current text and jurisdictions vary. Application: apply the general framework category to these specific facts only to the extent of identifying which facts are legally relevant and why, without concluding how the question resolves. Conclusion: instead of a legal conclusion, state what specific research, document, or expert input would be needed to actually answer the question, and how urgent that research is relative to any deadline in the facts.

WHAT NOT TO DO
Never state what a statute or regulation requires, what a court would likely hold, or which party would likely prevail — treat every substantive legal question as open pending actual legal research, because you have no way to verify current, jurisdiction-specific law from a fact pattern alone, and presenting a guess as an answer here would be indistinguishable from unqualified legal advice. If I've stated a specific law or case as a known fact in the input, you may reference it as given, but do not extend it, interpret its scope, or predict its application beyond what I explicitly told you.

OUTPUT FORMAT
For each issue: Issue / Governing Framework (general category only) / Relevant Facts / Research Needed / Urgency. Then a one-paragraph summary ranking which issue needs research first given any deadline pressure in the facts. Close with a clearly labeled statement that this is an internal issue-spotting draft only, not a legal opinion or advice, and that it must be reviewed, researched, and completed by a qualified lawyer before any of these questions are treated as answered or acted upon.`,
    variables: [
      {
        name: 'fact_pattern',
        description: `The situation, in as much factual detail as you have.`,
        example: `Employee was terminated two days after filing an internal complaint about unpaid overtime; termination letter cites 'restructuring' with no other documentation of performance issues.`,
        required: true,
      },
      {
        name: 'memo_audience',
        description: `Who will read this first pass memo.`,
        example: `In-house HR director deciding whether to escalate to outside employment counsel.`,
        required: true,
      },
      {
        name: 'known_questions',
        description: `Any specific legal questions you already suspect are in play.`,
        example: `Possible retaliation claim; whether the restructuring justification is documented enough to hold up.`,
        required: false,
      },
      {
        name: 'jurisdiction_context',
        description: `Jurisdiction or regulatory regime, if you know it, stated as a given fact rather than something to be looked up.`,
        example: `Employee is based in California; company is aware California has specific retaliation protections but has not confirmed current statutory text.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`legal-memo`, `issue-spotting`, `irac`, `internal-draft`, `legal-research`],
    whyItWorks: `Structuring the Rule section to name only the general category of governing framework, never the substance of what a law actually requires, is the mechanism that keeps this exercise from silently becoming legal advice: GPT-5.1's training data includes enormous amounts of general legal commentary, which makes it fluent at producing a specific-sounding statement of 'what the law says' that is frequently outdated, jurisdiction-mismatched, or simply an oversimplification of a more nuanced doctrine — restricting the model to naming the category (contract interpretation, a named statute only if the user supplied it) rather than its content removes the exact surface where that fluent-but-unverified confidence would otherwise leak into the output. Requiring the Conclusion section to name research needed rather than a legal conclusion inverts the normal shape of a memo on purpose, because the actual value of a first-pass issue-spotting draft is organizing facts and questions for a lawyer to pick up efficiently, not pre-empting the answer a lawyer is specifically qualified and retained to determine — a memo that confidently concluded 'this is likely retaliation' would get treated as the answer by a busy reader even with a disclaimer attached, while a memo that says 'this needs a lawyer to check California Labor Code retaliation standards against these specific facts' cannot be mistaken for anything but a to-do list. Framing each issue as a question rather than a statement reinforces the same discipline throughout the document, and the urgency-ranking step gives the memo practical value — telling a reader which open question to send to counsel first — without requiring the model to have resolved any of them, which is the one thing it is never positioned to do reliably from a fact pattern alone.`,
    exampleOutput: `ISSUE: Does termination two days after an internal overtime complaint raise a retaliation concern under the applicable framework? GOVERNING FRAMEWORK: Employment retaliation principles generally (jurisdiction-specific statute not yet confirmed). RELEVANT FACTS: two-day gap between complaint and termination; stated reason (restructuring) has no supporting documentation. RESEARCH NEEDED: confirm applicable state retaliation statute and its causation standard; request documentation of the restructuring decision timeline. URGENCY: high, given proximity in time. This is an internal issue-spotting draft only, not legal advice — a qualified lawyer must research and complete this analysis before any conclusion is acted on.`,
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
    slug: 'legal-compliance-evidence-chronology-builder',
    category: 'legal-compliance',
    title: `Turn a pile of dated documents and emails into a clean evidence chronology without editorializing what it proves`,
    description: `Organizes messy, dated source material into a strict chronological timeline of events with source citations for each entry, deliberately stripped of any interpretation about what the sequence proves — built as a working draft for a qualified lawyer to verify and interpret.`,
    promptText: `Build a strict chronology from the dated source material below — a timeline of what happened when, with a citation to its source for every entry, and nothing added about what the sequence means or proves.

SOURCE MATERIAL (emails, notes, documents, with dates where available)
{{source_material}}

MATTER THIS CHRONOLOGY SUPPORTS
{{matter_context}}

WHAT COUNTS AS A RELEVANT EVENT
{{relevance_criteria}}

HOW PRECISE DATES NEED TO BE
{{date_precision_needs}}

EXTRACTION RULES
Go through the source material and pull out only dated or datable events, each as a single factual entry: what happened, exactly as stated in the source (paraphrase for length only, never for meaning), the date or best-available date range, and a citation back to which source document or message it came from. If a source is undated or only vaguely dated ("last week," "a few days after"), include it but mark the date as approximate and explain what it's approximate relative to. If two sources conflict on when something happened, include both entries with their respective sources rather than picking one as correct — that conflict itself may matter later and should not be silently resolved by you. Do not summarize multiple events into one entry if they happened on different dates, even if they're related — the chronology's value is in exact sequence, not narrative compression.

WHAT NOT TO DO
Do not add any interpretation, causal claim, or characterization of what the sequence shows, suggests, or proves — no "this establishes," no "this demonstrates a pattern," no editorializing adjectives about any party's conduct. A chronology that argues a position stops being a neutral chronology and becomes something only a lawyer should be constructing deliberately, with full awareness of how it will be used. Do not exclude an event because it seems unfavorable or irrelevant to {{matter_context}} — that judgment belongs to the lawyer using this, not to you.

OUTPUT FORMAT
A strict chronological table: Date (or approximate date, noted as such) | Event (factual, sourced) | Source citation | Conflict flag (if applicable). No narrative summary section, no conclusions. End with a line stating this chronology is a draft organizational aid only, built from the source material provided, and that a qualified lawyer must verify its accuracy against the original documents and determine its legal significance before it is used in any matter.`,
    variables: [
      {
        name: 'source_material',
        description: `The raw dated material to organize — emails, notes, texts, documents.`,
        example: `12 emails between two business partners spanning March-July 2026, plus 3 undated handwritten meeting notes referencing 'the March call'.`,
        required: true,
      },
      {
        name: 'matter_context',
        description: `The general matter this chronology is being built for, stated only as context, not as something to argue toward.`,
        example: `Internal review of a soured business partnership ahead of a possible dissolution discussion.`,
        required: true,
      },
      {
        name: 'relevance_criteria',
        description: `What kind of events should be pulled out versus left as background noise.`,
        example: `Any communication about financial contributions, decision-making authority, or stated intent to exit the partnership.`,
        required: true,
      },
      {
        name: 'date_precision_needs',
        description: `How precise the dates need to be for this use.`,
        example: `Exact dates where available; week-level precision is acceptable for anything only referenced indirectly.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`evidence-chronology`, `timeline-building`, `litigation-support`, `legal-draft`, `document-review`],
    whyItWorks: `The single hardest rule in this prompt — no interpretation, no causal claims, no characterizing adjectives — exists because a chronology's evidentiary value depends entirely on it being a neutral ordering of sourced facts, and GPT-5.1 left to its own devices will naturally narrate a sequence of events with connective interpretive language ('this suggests,' 'following this pattern') because that's what makes prose readable; that narrative gloss is exactly the thing that turns a useful organizational tool into an argument a lawyer would need to have deliberately constructed with full awareness of its persuasive framing, not something that arrived pre-baked from an AI draft. Requiring a source citation on every single entry, rather than a general note about which documents were used, matters because a chronology someone actually relies on needs to be independently checkable line by line against the underlying material — an entry without a traceable source is a claim resting on the model's summarization alone, which is not a standard anyone should accept for something meant to represent facts, not analysis. The instruction to preserve, not resolve, conflicting dates across sources is a specific defense against a model's tendency to quietly pick the more coherent-sounding version when two sources disagree; that conflict is frequently itself the meaningful fact (who said what, when, and whether accounts differ), and silently smoothing it away would erase exactly the kind of detail a chronology exists to preserve. Refusing to exclude events that seem unfavorable to the stated matter context keeps the model from doing the lawyer's job of selecting a narrative, which is a judgment call that requires legal strategy and privilege considerations an AI model has no visibility into and should never be making unsupervised.`,
    exampleOutput: `March 14, 2026 — Partner A emails Partner B proposing a 60/40 profit split, citing 'increased time commitment.' Source: Email, March 14 2026, 9:42am. Approx. late March 2026 (referenced as 'the March call' in handwritten notes, exact date not stated) — Handwritten note references a phone call where B allegedly agreed to revisit the split 'after Q2.' Source: Handwritten note, undated, cross-referenced to March. CONFLICT: Partner A's April 2 email states B 'never agreed to revisit anything.' This chronology is a draft organizational aid only — a qualified lawyer must verify its accuracy against original documents before it is used in any matter.`,
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
    slug: 'legal-compliance-case-research-summary-draft',
    category: 'legal-compliance',
    title: `Summarize what you already know about a legal question so a lawyer's research starts from an organized baseline`,
    description: `Organizes your team's existing knowledge, prior counsel notes, and open questions about a legal issue into a structured research brief that flags exactly what's assumed versus confirmed, so outside counsel's actual research time isn't spent re-deriving what you already had.`,
    promptText: `You're organizing what my team already knows, suspects, or has been told about a legal question into a research brief — this is a baseline document to hand to a lawyer doing the actual research, not a substitute for that research.

WHAT WE ALREADY KNOW OR HAVE BEEN TOLD
{{existing_knowledge}}

THE QUESTION WE NEED ANSWERED
{{core_question}}

SOURCE OF EACH PRIOR NOTE (prior counsel, internal team, general reading)
{{source_attribution}}

DEADLINE OR DECISION THIS RESEARCH FEEDS INTO
{{decision_deadline}}

HOW TO ORGANIZE THIS
First, restate the core question precisely — often what's actually blocking a decision is narrower than the general topic it's filed under, and getting this restatement wrong wastes a researcher's first hour. Second, go through everything I've told you and sort it into three buckets: confirmed by prior qualified counsel (cite which advice and when, if you know it), assumed or inherited from general reading or team folklore (things believed but never actually confirmed by a lawyer), and directly contradictory information (if two things I told you conflict, surface the conflict rather than picking the one that sounds more authoritative). Third, list what's specifically still unknown and would need actual legal research to resolve — be precise about the gap, not just "more research needed" in general.

WHAT NOT TO DO
Never attempt to answer the core question yourself, even provisionally or "just to get started" — that is precisely the work this brief is meant to hand off, not preempt, and a plausible-sounding provisional answer in this document risks being mistaken for a real one by someone skimming it later. Never upgrade something in the "assumed or inherited" bucket to "confirmed" based on how often it's repeated in what I gave you — repetition inside a company is not verification.

OUTPUT FORMAT
1. Restated core question.
2. Confirmed-by-prior-counsel table: item / source / date if known.
3. Assumed-or-inherited list: item / where it seems to have come from / why it's not confirmed.
4. Contradictions found, stated plainly.
5. Specific research gaps, phrased as precise open questions.
6. A closing line stating this is a research-organization draft only, not legal advice or a legal conclusion, and that the actual question must be researched and answered by a qualified lawyer.`,
    variables: [
      {
        name: 'existing_knowledge',
        description: `Everything your team currently believes, has been told, or has read about this question.`,
        example: `Prior outside counsel said in 2023 our standard NDA's non-solicit clause was enforceable in our home state; team has since assumed this applies to a new state we're expanding into.`,
        required: true,
      },
      {
        name: 'core_question',
        description: `The actual decision-blocking question, as specifically as you can state it.`,
        example: `Can we enforce the existing NDA's non-solicit clause against a departing employee now based in the new state?`,
        required: true,
      },
      {
        name: 'source_attribution',
        description: `Where each piece of existing knowledge came from.`,
        example: `2023 advice came from outside counsel via email; the 'applies to new state too' assumption came from an internal Slack thread, no lawyer involved.`,
        required: true,
      },
      {
        name: 'decision_deadline',
        description: `What decision this research needs to support and by when.`,
        example: `Need to decide by end of month whether to send a cease-and-desist letter to the departing employee's new employer.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`legal-research-brief`, `case-research`, `internal-knowledge-audit`, `legal-draft`, `outside-counsel`],
    whyItWorks: `The three-bucket sort — confirmed by prior counsel, assumed or inherited, and contradictory — targets a specific and expensive failure mode in how legal knowledge actually degrades inside a company: a piece of advice given by a lawyer in one specific context (a particular state, a particular year, a particular fact pattern) gets repeated informally until the team treats it as a general, portable rule, and by the time it reaches a new context nobody remembers it was ever conditional. GPT-5.1 is well suited to surfacing this pattern because it can read a mixed pile of notes and messages and separate what was actually attributed to counsel from what was inferred or assumed along the way, but only if explicitly instructed not to smooth the two together into one confident-sounding narrative, which is what a plain summarization request would naturally do. The instruction never to upgrade a repeated assumption to 'confirmed' status directly targets the mechanism by which company folklore acquires false authority — frequency of repetition inside internal messages has zero bearing on whether a lawyer actually verified the claim, and a model that let repetition count as evidence would launder an unverified assumption into something that reads as settled. The hard rule against attempting even a provisional answer to the core question exists because the entire value of this document is in making the handoff to a real lawyer cleaner and faster, not in trying to shortcut it — a provisional AI answer sitting at the top of a research brief is the single most likely thing to get copy-pasted into a decision memo under time pressure, which is exactly the scenario this prompt is designed to prevent.`,
    exampleOutput: `RESTATED QUESTION: Is the existing NDA's non-solicit clause, originally advised as enforceable in our home state, also enforceable against a former employee now in the new expansion state? CONFIRMED BY PRIOR COUNSEL: Non-solicit enforceability in home state — source: outside counsel email, 2023. ASSUMED OR INHERITED: That this advice extends to the new state — source: internal Slack thread, no counsel involved, never actually confirmed. RESEARCH GAP: Whether the new state's law treats non-solicit clauses the same way as the home state. This is a research-organization draft only — a qualified lawyer must research and answer the actual question.`,
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
    slug: 'legal-compliance-client-intake-summary-draft',
    category: 'legal-compliance',
    title: `Turn a rambling client intake call into a structured summary a lawyer can triage in two minutes`,
    description: `Converts raw intake notes or a call transcript into a structured client-matter summary with urgency flags and missing-information gaps clearly marked, so a lawyer's first read is triage-ready instead of a re-transcription exercise.`,
    promptText: `Structure the intake notes below into a client-matter summary a lawyer can triage quickly — organize what was said, do not add legal characterization to it.

RAW INTAKE NOTES OR CALL TRANSCRIPT
{{intake_notes}}

INTAKE PURPOSE
{{intake_purpose}}

PRACTICE AREA THIS LIKELY FALLS UNDER
{{practice_area}}

ANY STATED DEADLINE OR TIME-SENSITIVE EVENT
{{time_sensitivity}}

WHAT TO EXTRACT
Parties involved and their relationship to each other and to the client, stated plainly as given. The client's stated goal — what outcome they said they want, in their own words as closely as possible, since what a client asks for and what they legally need are sometimes different things a lawyer needs to notice on their own, not have pre-interpreted for them. A timeline of events as the client described them (not a formal chronology, just organized in the order the client experienced them). Any documents the client mentioned having or needing to find. Any deadline or urgency the client mentioned, flagged prominently. Any conflict-of-interest flags — names of other parties, companies, or individuals mentioned that the firm might need to check against existing clients or matters, listed plainly for a conflicts check, not assessed by you.

WHAT NOT TO DO
Do not characterize the strength of the client's position, suggest what legal claims might apply, or speculate about likely outcomes — this is an intake organization exercise, and a lawyer forming that judgment needs to do so directly from the facts, not from your pre-filtered read of them. Do not fill in gaps in the notes with plausible assumptions about what the client "probably meant" — if something is unclear or contradictory in the notes, flag it as a clarifying question to ask the client, rather than resolving the ambiguity yourself.

OUTPUT FORMAT
1. Parties and relationships.
2. Client's stated goal, in their own words where possible.
3. Timeline as experienced by the client.
4. Documents mentioned (have / need to find).
5. Urgency flags.
6. Names to run through conflicts check.
7. Open clarifying questions for the client.
8. A closing line noting this is an intake organization draft only, not a legal assessment of the matter, and that a qualified lawyer must review it and speak with the client directly before any advice is given or representation decisions are made.`,
    variables: [
      {
        name: 'intake_notes',
        description: `The raw notes or transcript from the intake conversation.`,
        example: `Client called about a landlord who kept the security deposit and won't respond to calls; mentioned a roommate also affected; wants deposit back before moving to new apartment next month.`,
        required: true,
      },
      {
        name: 'intake_purpose',
        description: `What this intake is for — a new client call, a follow-up, a referral screen.`,
        example: `First intake call for a prospective new client, deciding whether the firm should take the matter.`,
        required: true,
      },
      {
        name: 'practice_area',
        description: `The general area of law this seems to fall under, as a label only.`,
        example: `Residential landlord-tenant, security deposit dispute.`,
        required: true,
      },
      {
        name: 'time_sensitivity',
        description: `Any deadline, statute of limitations concern, or upcoming event the client mentioned.`,
        example: `Client is moving in 3 weeks and wants this resolved before then; unsure if there's a legal filing deadline.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`client-intake`, `legal-triage`, `law-firm-operations`, `legal-draft`, `conflicts-check`],
    whyItWorks: `Instructing the model to preserve the client's stated goal in their own words, rather than translating it into legal terminology, matters because the gap between what a client asks for ('I want my deposit back') and what they may actually need (a claim under a specific statutory deposit-return framework, or a broader dispute about habitability) is exactly the judgment a lawyer is trained and retained to make, and a summary that's already been translated into legal-sounding language robs the lawyer of seeing the client's original framing, which often contains cues about what they actually care about beyond the literal ask. The explicit conflicts-check extraction step exists because conflict screening is a procedural requirement most firms run before any substantive engagement, and it depends on completely and plainly listing every named party and organization mentioned — a summary that only surfaces 'legally relevant' names, using the model's own judgment of relevance, risks quietly dropping a name that turns out to matter for conflicts purposes even though it seemed incidental to the narrative. The hard rule against filling ambiguous gaps with plausible assumptions is the single most load-bearing instruction here: intake notes are frequently incomplete or contradictory because clients themselves are recalling events under stress, and GPT-5.1's default behavior when summarizing incomplete information is to quietly smooth it into a coherent narrative — converting every such gap into an explicit clarifying question instead means the lawyer's first follow-up call is targeted at the real open questions rather than starting from a summary that has silently papered over exactly the details that needed to be asked about. Refusing to characterize claim strength or likely outcome keeps the tool in the pre-legal-judgment lane, which is the only appropriate lane for an intake summary a lawyer hasn't yet independently reviewed against the client directly.`,
    exampleOutput: `CLIENT'S STATED GOAL (own words): 'I just want my deposit back before I move.' URGENCY FLAG: Client moving in 3 weeks; unclear if a legal filing deadline applies — ask client for exact move-out and lease-end dates. NAMES FOR CONFLICTS CHECK: [Landlord name], [Roommate name] — both mentioned, run through conflicts database. OPEN QUESTION: Client did not specify state or lease terms — needed before applying any deposit-return timeline. This is an intake organization draft only — a qualified lawyer must review it and speak with the client directly before any advice is given.`,
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
    slug: 'legal-compliance-compliance-training-module-outline',
    category: 'legal-compliance',
    title: `Outline a compliance training module from your actual policy, not a generic template that ignores it`,
    description: `Builds a training module outline — learning objectives, scenario-based exercises, and a knowledge check — grounded specifically in your organization's existing policy text, flagged as a draft for legal or compliance review before it's used to train anyone.`,
    promptText: `Outline a compliance training module built specifically from the policy text below, for the audience and delivery format I've described.

POLICY TEXT THIS TRAINING COVERS
{{policy_text}}

AUDIENCE
{{training_audience}}

DELIVERY FORMAT AND LENGTH
{{delivery_format}}

PAST INCIDENTS OR COMMON MISTAKES TO ADDRESS
{{common_mistakes}}

PHASE 1 — LEARNING OBJECTIVES
Write 3-5 learning objectives that map directly to specific provisions in the policy text I gave you, each one something a learner should be able to do differently after the training, not just "understand the policy." If the policy text doesn't clearly support an objective I might expect (e.g. it's a generic compliance area but the actual text is thin on a topic), say so rather than inventing content the policy doesn't actually cover.

PHASE 2 — SCENARIO-BASED EXERCISES
Write 2-3 realistic workplace scenarios that put the learner in a position to apply the specific policy language, ideally built around the common mistakes I've described if I gave you any — a scenario that's just a restatement of the rule in story form doesn't test anything; a good one puts the learner at a believable decision point where the wrong instinct is genuinely tempting. For each scenario, note what the correct action is according to the policy text, and what the tempting-but-wrong instinct would be and why it's wrong.

PHASE 3 — KNOWLEDGE CHECK
Write 4-6 knowledge check questions tied directly to the policy provisions and scenarios above, mixing scenario-application questions with direct policy-recall questions, avoiding trick questions that test wording memorization over actual understanding.

WHAT NOT TO DO
Do not invent specific legal requirements, penalties, or regulatory citations not present in the policy text I gave you — if the training should reference a specific law or regulation, ask me to supply the actual text or citation rather than stating one from general knowledge, since compliance training built on a misstated legal requirement can create liability rather than reduce it.

OUTPUT FORMAT
1. Learning objectives, each tied to a specific policy provision.
2. Scenario exercises with correct action and the wrong-instinct explanation.
3. Knowledge check questions with answer key.
4. A closing line stating this outline is a training-design draft only, and that the underlying policy content, legal citations, and factual claims must be reviewed and approved by a qualified lawyer or compliance officer before this training is delivered to any employee.`,
    variables: [
      {
        name: 'policy_text',
        description: `The actual policy text this training needs to teach.`,
        example: `Internal gift and hospitality policy: gifts over $75 from vendors must be reported to Compliance within 5 business days; cash gifts of any amount are prohibited.`,
        required: true,
      },
      {
        name: 'training_audience',
        description: `Who is taking this training.`,
        example: `Procurement team, all levels, mandatory annual refresher.`,
        required: true,
      },
      {
        name: 'delivery_format',
        description: `How this will be delivered and roughly how long it should take.`,
        example: `Self-paced e-learning module, target 15 minutes including knowledge check.`,
        required: true,
      },
      {
        name: 'common_mistakes',
        description: `Real past incidents or known common errors this training should specifically address.`,
        example: `Last year, two employees accepted vendor conference tickets valued over $75 without reporting, believing 'experiences' didn't count as gifts.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`compliance-training`, `learning-design`, `policy-training`, `legal-draft`, `scenario-based-learning`],
    whyItWorks: `Requiring every learning objective to map to a specific provision in the supplied policy text, and explicitly permitting the model to say the policy is thin on an expected topic, prevents the single most common failure of AI-generated compliance training: a model asked to write a generic 'gift and hospitality training' will readily produce plausible-sounding content drawn from common industry patterns rather than the organization's actual rules, and an employee trained on generic best practices instead of the specific $75 threshold and 5-day reporting window their own company enforces will confidently apply the wrong standard, which is arguably worse than no training at all. Anchoring the scenario exercises in real past incidents, when supplied, works because GPT-5.1 can extrapolate a believable 'tempting wrong instinct' from an actual documented mistake (employees rationalizing that an experience isn't a gift) far more precisely than it can invent a generic temptation from scratch — and a scenario built on the organization's real failure mode teaches the exact judgment call that previously went wrong, rather than a plausible-sounding but different one. The hard prohibition on inventing legal citations or penalties not present in the supplied policy text is the load-bearing safety rule in this prompt: compliance training that states a wrong dollar threshold, an incorrect reporting deadline, or a fabricated regulatory citation doesn't just fail to reduce risk, it actively creates a paper trail showing employees were affirmatively trained on incorrect information, which is a materially worse position in any later investigation than having given no training at all — grounding every substantive claim strictly in what was supplied, and asking for real citations rather than generating plausible ones, is what keeps the training outline from becoming that liability.`,
    exampleOutput: `LEARNING OBJECTIVE: Correctly identify when a vendor-provided experience (not just physical gifts) triggers the $75 reporting threshold, addressing last year's conference-ticket incident directly. SCENARIO: A vendor offers you two tickets to a conference valued at $200 each, framed as a 'networking opportunity' rather than a gift. Correct action per policy: report within 5 business days, since value exceeds $75 regardless of framing. Tempting wrong instinct: assuming 'experiences' are exempt from the gift definition, which the policy text does not support. This outline is a training-design draft only — the underlying policy content and any legal citations must be reviewed and approved by a qualified lawyer or compliance officer before delivery.`,
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
    slug: 'legal-compliance-compliance-audit-prep-checklist',
    category: 'legal-compliance',
    title: `Build an audit-readiness checklist from your actual control list, not a generic compliance framework`,
    description: `Turns your organization's stated controls and known gaps into a prioritized, evidence-mapped audit prep checklist that flags what documentation is missing before the auditor asks for it, framed as a working draft for a qualified compliance professional or lawyer to finalize.`,
    promptText: `Build an audit-readiness checklist from the control list and known gaps below, prioritized by what's most likely to get flagged first.

AUDIT TYPE AND SCOPE
{{audit_type}}

OUR STATED CONTROLS
{{controls_list}}

KNOWN GAPS OR WEAK SPOTS
{{known_gaps}}

PRIOR AUDIT FINDINGS, IF ANY
{{prior_findings}}

HOW TO BUILD THE CHECKLIST
For each control on the list, state what documentary evidence an auditor would typically expect to see to verify it's actually operating (not just written as policy) — a signed log, a system-generated report, a sample of completed reviews — and mark whether we've told you that evidence currently exists, is partially available, or is a known gap. Rank every item by audit risk: prior findings on the same control area should rank highest, since auditors specifically check whether previously flagged issues were actually remediated, followed by known gaps we've told you about, followed by controls we believe are solid but haven't been evidence-tested recently. For any known gap, suggest what interim compensating step (not a permanent fix, just something to have in place before the audit) could reduce exposure if there's genuinely no time to close the gap fully before the audit date.

WHAT NOT TO DO
Do not assume a control is adequately evidenced just because it's described in policy — policy language and operating evidence are different things, and conflating them is exactly the gap auditors are trained to catch. Do not invent specific regulatory citations, audit standards, or required evidence types beyond general good-practice patterns — if this audit is against a named standard or regulation, ask me to confirm its specific requirements rather than asserting them, since audit standards vary and an incorrect assumption here could leave a real gap looking falsely covered.

OUTPUT FORMAT
A prioritized table: Control | Expected Evidence Type | Evidence Status (have / partial / gap) | Risk Rank (based on prior findings > known gaps > untested) | Interim Compensating Step (if gap). Followed by a short summary of the top 3 highest-risk items to address first given time constraints. Close with a line stating this checklist is an audit-preparation draft only, and that a qualified compliance professional or lawyer must confirm the actual regulatory or standard-specific requirements and review this checklist before it's used to represent audit readiness.`,
    variables: [
      {
        name: 'audit_type',
        description: `The kind of audit and what it covers.`,
        example: `Annual SOC 2 Type II readiness review, focused on access control and change management domains.`,
        required: true,
      },
      {
        name: 'controls_list',
        description: `The controls you currently have documented or in place.`,
        example: `Quarterly access review, change approval workflow in Jira, offboarding checklist for departing employees.`,
        required: true,
      },
      {
        name: 'known_gaps',
        description: `Anything you already suspect is weak or unevidenced.`,
        example: `Offboarding checklist exists but we don't have consistent evidence it was completed for the last two departures.`,
        required: true,
      },
      {
        name: 'prior_findings',
        description: `Anything flagged in a previous audit that needs to show remediation this time.`,
        example: `Last year's audit flagged that access reviews were completed but not signed off by the control owner.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`audit-prep`, `compliance-checklist`, `controls-testing`, `legal-draft`, `risk-prioritization`],
    whyItWorks: `The distinction drawn throughout this prompt between a control existing in policy versus being evidenced in operation is the central mechanism auditors themselves use, and it's the exact distinction a naive AI summary would collapse — asked simply to 'check our controls,' a model will tend to treat a well-written policy description as if it implies operating evidence, when in reality an auditor's actual job is verifying the gap between the two, and a checklist that makes the same assumption an auditor is specifically trained to distrust would be actively counterproductive prep. Ranking prior audit findings above newly-known gaps, above untested-but-believed-solid controls, reflects how audits actually work in practice: an auditor who flagged something last cycle will specifically check whether it was remediated, so an unaddressed repeat finding carries materially higher risk than a fresh gap the auditor hasn't seen yet, and a flat, unprioritized checklist would waste limited prep time treating both with equal urgency. Suggesting interim compensating steps rather than full fixes is a deliberately narrow scope decision — with real time constraints before an audit date, the useful output is 'what reduces exposure right now,' not a long-term remediation plan that can't be executed before the audit anyway, and conflating the two would produce a checklist too ambitious to actually act on in the available window. The refusal to invent specific regulatory citations or standard-specific evidence requirements matters most in audits against a named framework (SOC 2, ISO 27001, a specific regulation), because those standards have precise, versioned requirements that change over time and vary by scope — a model confidently asserting what 'SOC 2 typically requires' from general pattern-matching risks giving false comfort that a gap is covered when the actual current standard requires something different, which is precisely the kind of false readiness an audit is meant to catch, not create.`,
    exampleOutput: `CONTROL: Offboarding checklist completion. EXPECTED EVIDENCE: Signed-off checklist per departure, system access-removal timestamp. EVIDENCE STATUS: Partial — checklist exists, sign-off evidence missing for last two departures. RISK RANK: High (known gap, and adjacent to last year's access-review sign-off finding). INTERIM STEP: Retroactively document and have the control owner sign off on the last two departures' completion before the audit window opens. This checklist is an audit-preparation draft only — a qualified compliance professional or lawyer must confirm actual requirements and review it before it represents audit readiness.`,
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
    slug: 'legal-compliance-data-processing-agreement-checklist-draft',
    category: 'legal-compliance',
    title: `Check a vendor's data processing agreement against your actual requirements before it goes to legal`,
    description: `Compares a vendor-supplied DPA against your stated data-handling requirements clause by clause, flagging gaps and mismatches so legal's actual review starts from a pre-sorted list instead of a blank read-through, always framed as a pre-review draft.`,
    promptText: `Compare the vendor's data processing agreement below against our stated requirements, clause by clause, and flag every gap or mismatch — this is a pre-screen for legal's actual review, not a legal sign-off on the DPA.

VENDOR'S DPA TEXT OR CLAUSE SUMMARY
{{dpa_text}}

OUR STATED REQUIREMENTS
{{our_requirements}}

DATA TYPES AND VOLUME INVOLVED
{{data_scope}}

SUB-PROCESSOR SITUATION
{{subprocessor_context}}

STEP 1 — MAP REQUIREMENTS TO CLAUSES
For each requirement I've stated, find the corresponding clause (if any) in the vendor's DPA and note whether it fully meets the requirement, partially meets it, or is silent on it entirely. If a requirement has no corresponding clause anywhere in what I gave you, mark it as a gap rather than assuming it's covered by a general clause that doesn't actually address it.

STEP 2 — FLAG SUB-PROCESSOR AND CROSS-BORDER ISSUES
Identify what the DPA says about sub-processor approval rights (do we get notified or must we approve new sub-processors) and what it says, if anything, about where data can be transferred or stored geographically. Flag if either topic is missing entirely, since silence on sub-processor rights or data location is itself often the biggest practical risk in a DPA, not just a technicality.

STEP 3 — FLAG BREACH NOTIFICATION MISMATCH
Compare the DPA's stated breach notification timeline against our requirement, if I've given you both, and flag any gap in days, since this is one of the most commonly negotiated and most consequential mismatches in DPA review.

WHAT NOT TO DO
Do not conclude whether this DPA is acceptable to sign — that is a risk decision for legal and the business owner, informed by factors beyond clause-matching, like the vendor relationship and available alternatives. Do not assert what any specific data protection law actually requires (retention limits, cross-border transfer mechanisms, notification deadlines) — if I haven't told you our specific regulatory requirement for a topic, mark it as "our requirement not specified" rather than filling it in from general knowledge of data protection law, since these requirements vary by jurisdiction and change over time.

OUTPUT FORMAT
A table: Our Requirement | Corresponding DPA Clause (or "none found") | Match Status (full / partial / gap / silent) | Note. A separate short section on sub-processor and cross-border flags. A separate line on breach notification timeline comparison. Close with a statement that this is a pre-review comparison draft only, not a legal assessment of the DPA's adequacy or enforceability, and that a qualified lawyer must review the full agreement and make the actual acceptance decision.`,
    variables: [
      {
        name: 'dpa_text',
        description: `The vendor's DPA text or a clause-by-clause summary.`,
        example: `Vendor DPA: sub-processors listed in Schedule A, notice-only (no approval right); breach notification 'without undue delay'; no explicit data location clause.`,
        required: true,
      },
      {
        name: 'our_requirements',
        description: `Your organization's stated requirements for any DPA.`,
        example: `Require prior approval (not just notice) for new sub-processors; breach notification within 72 hours; data must stay within named regions.`,
        required: true,
      },
      {
        name: 'data_scope',
        description: `What kind of data and how much is involved, for context on stakes.`,
        example: `Customer PII including payment card tokens for approximately 40,000 users.`,
        required: true,
      },
      {
        name: 'subprocessor_context',
        description: `Anything specific about sub-processor concerns for this vendor.`,
        example: `Vendor is known to use offshore support contractors; we specifically need visibility into who those are.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`dpa-review`, `data-processing-agreement`, `vendor-risk`, `legal-draft`, `privacy-compliance`],
    whyItWorks: `Structuring this as a clause-mapping exercise against explicitly stated requirements, rather than an open-ended 'review this DPA' request, matters because it forces a binary, checkable comparison for each requirement instead of a general narrative impression — a model asked to just review a DPA will produce a plausible-sounding summary of its overall tenor, while a model asked to map each stated requirement to its corresponding clause (or the explicit absence of one) produces something legal can act on directly, sorted by exactly where the gaps are. Treating silence on sub-processor approval rights or data location as a flag in its own right, rather than something to note only if it seems concerning, reflects a specific and common pattern in vendor DPAs: vendors frequently omit or soften exactly these two topics because they're the ones most likely to constrain the vendor's own operational flexibility, so a DPA that says nothing about data location isn't neutral, it's often a deliberate gap, and treating silence as equivalent to 'no issue found' would miss the most common way real risk hides in these documents. The explicit prohibition on asserting what data protection law actually requires — retention limits, transfer mechanisms, breach deadlines — protects against the most consequential failure mode in this domain: those requirements are jurisdiction-specific, frequently updated, and materially different across frameworks, so a model stating a specific number (like a breach notification deadline) from general pattern knowledge rather than the user's stated requirement risks the reviewer treating an outdated or wrong figure as an authoritative benchmark, when the only safe move is comparing against what the organization has actually confirmed as its own requirement.`,
    exampleOutput: `OUR REQUIREMENT: Prior approval required for new sub-processors. DPA CLAUSE: Schedule A lists current sub-processors, section 4.2 states notice-only for future additions. MATCH STATUS: Gap — DPA provides notice, not approval rights. FLAG: Sub-processor topic addressed but weaker than our stated requirement; recommend legal push for approval-rights language given known use of offshore contractors. This is a pre-review comparison draft only — a qualified lawyer must review the full agreement and make the actual acceptance decision.`,
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
    slug: 'legal-compliance-ai-governance-policy-draft',
    category: 'legal-compliance',
    title: `Draft an internal AI governance policy scoped to how your teams are actually using AI, not a boilerplate framework`,
    description: `Builds a first-draft AI governance policy grounded in your organization's actual tool usage, risk tiers, and approval workflow, explicitly positioned as a starting point for legal and compliance to revise rather than a finished, enforceable policy.`,
    promptText: `Draft a first-pass internal AI governance policy based on how our organization actually uses AI tools today, structured so legal and compliance have a concrete starting point to revise rather than a blank page.

HOW AI IS CURRENTLY USED HERE
{{current_ai_usage}}

RISK AREAS WE'RE MOST CONCERNED ABOUT
{{risk_concerns}}

EXISTING APPROVAL OR PROCUREMENT PROCESS, IF ANY
{{existing_process}}

REGULATORY CONTEXT WE'RE AWARE OF
{{regulatory_awareness}}

STRUCTURE THE POLICY IN THESE SECTIONS
Scope: state plainly what this policy covers (which tools, which use cases, which employees) based on what I've told you is actually happening, not a generic "all AI use" statement that doesn't reflect reality. Risk tiers: sort AI use cases we've described into tiers by consequence if something goes wrong (e.g. AI used for internal brainstorming vs. AI used to draft anything sent externally or make a decision about a person), and state a different approval requirement per tier rather than one blanket rule for everything. Approval workflow: describe, based on what I've told you about our existing process, who needs to approve a new AI tool or use case before it's adopted, and what information that approver needs to see. Data handling rules: state what categories of data should never be input into a general AI tool (based on what I tell you is sensitive here), phrased as a rule for employees to follow, not a restatement of a data protection law's requirements. Incident and misuse reporting: describe how an employee should report a suspected AI-related error, hallucination, or misuse, and who reviews it.

WHAT NOT TO DO
Do not cite a specific AI regulation, its provisions, or its compliance deadlines unless I've explicitly told you the citation and its content — regulatory frameworks in this space are new, changing quickly, and vary by jurisdiction, so state only in general terms that regulatory compliance is a consideration, and flag it as something legal needs to confirm against current law. Do not present any section of this draft as final or already-approved language — every section header should make clear this is a draft under active development, not a live policy an employee could be told to already follow.

OUTPUT FORMAT
A structured policy draft with the five sections above, each opening with "DRAFT —" to make its status unambiguous. End with an explicit statement that this entire document is an internal working draft only, has not been reviewed or approved by legal or compliance, must be reviewed by a qualified lawyer for accuracy against current and applicable law before any part of it is adopted, and should not be distributed to employees as an active policy until that review is complete.`,
    variables: [
      {
        name: 'current_ai_usage',
        description: `What AI tools are actually being used and by whom, as far as you know.`,
        example: `Marketing uses ChatGPT for draft copy; engineering uses GitHub Copilot; customer support has piloted an AI chatbot for tier-1 tickets; no formal approval process exists yet.`,
        required: true,
      },
      {
        name: 'risk_concerns',
        description: `What worries your organization most about current or future AI use.`,
        example: `Concerned about customer PII being pasted into consumer AI tools, and about AI-drafted external communications going out without human review.`,
        required: true,
      },
      {
        name: 'existing_process',
        description: `Any existing tool-approval or procurement process this should plug into.`,
        example: `New software generally goes through IT security review, but AI tools specifically haven't been routed through that process consistently.`,
        required: false,
      },
      {
        name: 'regulatory_awareness',
        description: `What you know, in general terms, about applicable regulatory context, without asserting specific legal requirements.`,
        example: `We operate in the EU and US and are aware AI-specific regulation is an emerging area we need legal to track.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`ai-governance`, `internal-policy`, `risk-tiering`, `legal-draft`, `ai-compliance`],
    whyItWorks: `Grounding the scope and risk tiers in the organization's actual described AI usage, rather than producing a generic 'responsible AI' template, is what makes this draft something legal can meaningfully edit instead of discard — a boilerplate governance policy pulled from common patterns will describe use cases the organization doesn't have and miss the ones it does (like an unrouted AI chatbot pilot in customer support), and a lawyer reviewing a policy that doesn't reflect reality has to do the harder job of first figuring out what's actually happening before they can even assess whether the policy addresses it. The risk-tier structure, with a different approval bar for internal brainstorming versus AI-drafted external communications or decisions about a person, matters because a single blanket rule for all AI use either over-restricts low-stakes internal experimentation (killing adoption teams actually need) or under-restricts genuinely consequential uses, and GPT-5.1 can meaningfully differentiate these tiers once given real examples of both ends of the spectrum, which a generic prompt without that input could not do credibly. The refusal to cite specific AI regulations or their provisions unless explicitly supplied is the most consequential guardrail in this prompt, because AI-specific regulatory frameworks are genuinely new and actively evolving across jurisdictions as of this writing, and a model asserting 'the law requires X' from general pattern knowledge in this exact space is more likely than in almost any other legal domain to be citing something outdated, proposed-but-not-enacted, or simply invented — the instruction to name regulatory compliance only as a consideration for legal to verify, never as a stated requirement, keeps the document honest about the limits of what an AI-generated policy draft can respons ibly assert. Opening every section with "DRAFT —" and repeating the do-not-distribute instruction is a deliberate redundancy against the specific risk that a policy document, once it exists in a shareable form, tends to get treated as final by whoever finds it first, regardless of what a single closing disclaimer says.`,
    exampleOutput: `DRAFT — RISK TIERS: Tier 1 (internal brainstorming, no external output) — no approval required, general awareness training sufficient. Tier 2 (AI-assisted drafting of anything sent externally, e.g. customer communications) — requires manager sign-off and human review before sending. Tier 3 (AI used to make or materially influence a decision about a person, e.g. hiring screening) — requires legal and compliance approval before any pilot begins. This entire document is an internal working draft only, not reviewed or approved by legal — a qualified lawyer must review it against current applicable law before any part of it is adopted.`,
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
    slug: 'legal-compliance-employee-ai-use-policy-draft',
    category: 'legal-compliance',
    title: `Write an employee-facing AI use policy short enough that people actually read it before ignoring it`,
    description: `Produces a concise, plain-language employee AI use policy covering approved tools, data red lines, and disclosure rules, deliberately kept short and specific so it gets read rather than skimmed, framed as a draft pending legal sign-off.`,
    promptText: `Write a short, plain-language employee-facing AI use policy — the kind an employee will actually read in three minutes, not a legal document nobody opens past the title.

APPROVED TOOLS AND USE CASES
{{approved_tools}}

HARD DATA RED LINES
{{data_red_lines}}

DISCLOSURE EXPECTATIONS
{{disclosure_rules}}

WHAT HAPPENS IF SOMEONE VIOLATES THIS
{{consequence_framing}}

WRITING RULES
Write this as short numbered rules an employee could actually remember, not paragraphs of legal prose — each rule should be one or two sentences, plain language, no defined-terms formality. Lead with what's allowed and encouraged before what's prohibited; a policy that opens entirely with restrictions reads as adversarial and gets skimmed defensively rather than actually absorbed. State every data red line as a concrete example of what not to paste into a general AI tool, not an abstract category — "customer social security numbers or full payment card numbers" lands with an employee in a way "personally identifiable information" does not, because it's instantly checkable against something they might actually be about to do. State the disclosure rule as a specific action (label AI-assisted content, note it in a specific field, tell your manager) rather than a vague expectation to "be transparent about AI use." State consequences honestly but without hostility — what actually happens on a first violation versus a repeated one, since a policy that implies immediate termination for any AI mistake trains people to hide mistakes rather than report them.

WHAT NOT TO DO
Do not write this in a formal legal register with defined terms and "whereas" clauses — that register signals "skip this" to most employees and defeats the actual goal, which is behavior change, not legal formality. Do not state that this policy fully satisfies any specific regulatory requirement — if regulatory compliance is a goal here, note that legal has reviewed this for that purpose only if I've told you that review already happened; otherwise, leave that claim out entirely.

OUTPUT FORMAT
A short policy: title, one-paragraph "why this exists" framed positively, a numbered "what's encouraged" section, a numbered "hard red lines" section with concrete examples, a short disclosure-rule section, and a brief, non-hostile consequences section. Total length under 500 words. Close with a line noting this is a draft pending legal review, and that it must be approved by a qualified lawyer or compliance officer before being published or enforced as an actual company policy.`,
    variables: [
      {
        name: 'approved_tools',
        description: `Which AI tools employees are actually allowed to use and for what.`,
        example: `ChatGPT Enterprise (company account) approved for drafting, brainstorming, and summarizing internal documents; no approval yet for customer-facing chatbots.`,
        required: true,
      },
      {
        name: 'data_red_lines',
        description: `The specific things employees must never paste into a general AI tool.`,
        example: `Customer names paired with account numbers, any unreleased financial results, source code from the payments repository.`,
        required: true,
      },
      {
        name: 'disclosure_rules',
        description: `What employees need to do to disclose AI assistance, if anything.`,
        example: `Any customer-facing email drafted with AI assistance must still be personally reviewed and sent by the employee, no auto-send.`,
        required: true,
      },
      {
        name: 'consequence_framing',
        description: `What actually happens on a first violation versus repeated ones.`,
        example: `First accidental red-line violation: report it immediately, no punishment, treated as a training moment. Repeated or deliberate violations go to HR.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`ai-use-policy`, `employee-policy`, `plain-language`, `legal-draft`, `data-handling`],
    whyItWorks: `The instruction to lead with what's encouraged before what's prohibited, and to keep the whole thing under 500 words, directly targets a known failure mode of internal policy documents: a policy that opens with restrictions and runs long reads as adversarial compliance theater, gets skimmed rather than internalized, and employees default back to whatever they were already doing the moment they close the document — a short, front-loaded-with-permission policy is measurably more likely to actually change behavior, which is the entire point of writing one. Requiring data red lines as concrete, instantly-checkable examples rather than abstract categories like 'personally identifiable information' matters because an employee about to paste something into a chat window needs a rule they can apply in the two seconds before hitting enter, and 'PII' requires them to first correctly classify what they're holding as PII, a step most people skip under time pressure — 'customer names paired with account numbers' requires no classification step at all, just pattern recognition against something they're looking at right now. The honest, non-punitive framing of first-violation consequences is a deliberate behavioral design choice, not just a tone preference: a policy that implies severe consequences for any AI-related mistake predictably drives underreporting, since an employee who accidentally pastes something sensitive will hide it rather than flag it if they believe disclosure ends badly for them, which defeats the entire purpose of having a reporting mechanism — stating plainly that a first accidental violation is a training moment, not a punishment, is what makes the reporting channel something people will actually use. The refusal to claim regulatory sufficiency unless legal has actually confirmed it protects against the document being relied on as evidence of compliance it hasn't actually earned, which matters most in exactly the scenario where this policy would later be scrutinized — after an incident, not before one.`,
    exampleOutput: `WHY THIS EXISTS: AI tools genuinely help us move faster — this policy exists so we can use them with confidence, not to slow anyone down. HARD RED LINES: Never paste a customer's name together with their account number or full card number into any AI tool. Never paste unreleased financial results. If you're not sure whether something counts, ask before pasting, not after. FIRST MISTAKE: If you accidentally paste something on this list, tell your manager right away — this is treated as a training moment, not a punishment, the first time. This is a draft pending legal review and must be approved by a qualified lawyer or compliance officer before being published or enforced.`,
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
    slug: 'legal-compliance-record-retention-schedule-draft',
    category: 'legal-compliance',
    title: `Draft a record retention schedule from your actual document types, not a generic industry template`,
    description: `Builds a record retention schedule mapped to your organization's real document categories and business reasons for keeping or discarding them, flagging every retention period that needs actual legal confirmation instead of asserting one.`,
    promptText: `Draft a record retention schedule from the document categories below, organized by business function, with every retention period flagged as needing legal confirmation rather than stated as settled.

OUR DOCUMENT CATEGORIES
{{document_categories}}

BUSINESS REASONS WE CURRENTLY KEEP OR DISCARD THINGS
{{current_practice}}

KNOWN LEGAL HOLDS OR PENDING MATTERS
{{legal_holds}}

STORAGE OR SYSTEM CONSTRAINTS
{{storage_constraints}}

HOW TO BUILD THIS
Group the document categories by business function (HR, finance, contracts, customer data, IT/security logs) since retention logic and applicable rules genuinely differ by function, and a single flat schedule across all categories usually signals nobody thought about the differences. For each category, state the business reason for keeping it at all (operational need, audit trail, historical reference) separately from any legal retention reason, since these can point to different lengths and conflating them hides which one is actually driving a given number. Where I've told you a current practice (e.g. "we currently keep invoices 7 years"), note whether it appears to be based on an actual confirmed legal requirement, a rule of thumb someone adopted, or unclear origin — flag "unclear origin" honestly rather than assuming it was set correctly. For every category, state clearly: "legal-minimum retention period: TO BE CONFIRMED BY COUNSEL" rather than asserting a specific number from general knowledge, since retention requirements vary by document type, industry, and jurisdiction and change over time. Cross-reference any category currently under a legal hold and flag it as exempt from normal disposal timing regardless of what schedule number eventually gets set, since a legal hold overrides any retention schedule until it's lifted.

WHAT NOT TO DO
Do not state a specific number of years as a legal requirement for any document category — every legal-minimum field must say "to be confirmed by counsel," with no exceptions, even for document types where a common retention period is widely known informally, because informally common is not the same as legally verified for this organization's specific situation. Do not recommend disposal of anything currently flagged under a legal hold, under any circumstance.

OUTPUT FORMAT
A table grouped by business function: Document Category | Business Reason to Retain | Current Practice (if stated) | Origin of Current Practice (confirmed / rule-of-thumb / unclear) | Legal-Minimum Retention (TO BE CONFIRMED BY COUNSEL) | Legal Hold Status. Close with a summary of which categories most urgently need actual legal confirmation given any known pending matters, and a statement that this schedule is a draft organizational framework only, not a legally accurate retention schedule, and must be reviewed and populated with confirmed retention periods by a qualified lawyer before it is adopted or used to guide any document disposal.`,
    variables: [
      {
        name: 'document_categories',
        description: `The actual types of documents/records your organization holds.`,
        example: `Employee personnel files, signed customer contracts, accounts payable invoices, terminated-employee records, server access logs.`,
        required: true,
      },
      {
        name: 'current_practice',
        description: `What you currently do, even informally, and why, if you know.`,
        example: `We keep invoices 7 years because finance has always done it that way; nobody remembers if that's from a specific requirement.`,
        required: true,
      },
      {
        name: 'legal_holds',
        description: `Any documents currently under a litigation hold or similar preservation obligation.`,
        example: `All records related to the Jensen contract dispute are under a hold since March 2026 per outside counsel instruction.`,
        required: false,
      },
      {
        name: 'storage_constraints',
        description: `Any practical system or storage limits affecting retention decisions.`,
        example: `Current document management system has a hard 10-year archive limit before automatic purge, which nobody has reconciled against legal requirements.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`record-retention`, `document-management`, `compliance-schedule`, `legal-draft`, `litigation-hold`],
    whyItWorks: `The absolute rule that every legal-minimum retention field reads 'to be confirmed by counsel,' with no exception even for document types where a period like 'seven years for financial records' is widely known informally, is the single most important guardrail in this prompt because retention periods are exactly the kind of fact GPT-5.1 can state with high, unwarranted confidence — these numbers genuinely are common across many organizations, which makes a plausible-sounding assertion frequently correct by coincidence, and that occasional correctness is precisely what makes an unconfirmed number dangerous: a reviewer who sees it hold up twice stops checking the third time, when this specific organization's actual jurisdiction, industry, or contractual obligations require something different. Separating business reason to retain from legal reason to retain, and flagging the origin of current practice as confirmed, rule-of-thumb, or unclear, targets a very common organizational blind spot: retention practices that started as someone's reasonable guess years ago calcify into 'the policy' simply through repetition, and by the time anyone tries to formalize a schedule, nobody can distinguish an actually-confirmed legal requirement from an inherited habit — making the model surface that distinction explicitly, rather than smoothing all current practices into a single confident-sounding table, is what turns this into a genuinely useful audit of existing assumptions rather than a rubber stamp on them. The absolute, no-exceptions rule against recommending disposal of anything under a legal hold exists because a litigation hold is a preservation obligation that overrides any retention schedule by design, and a mistake here — even one flowing from a plausible-sounding schedule an AI produced — could constitute actual spoliation of evidence with real legal consequences, which is categorically different in severity from every other kind of error a retention-schedule draft could contain, and is why this is the one instruction in the prompt stated with zero conditional language.`,
    exampleOutput: `CATEGORY: Accounts payable invoices. BUSINESS REASON TO RETAIN: Audit trail, dispute resolution with vendors. CURRENT PRACTICE: 7 years. ORIGIN: Rule-of-thumb, no one currently recalls a specific confirmed requirement. LEGAL-MINIMUM RETENTION: TO BE CONFIRMED BY COUNSEL. LEGAL HOLD STATUS: Not applicable. CATEGORY: Jensen contract dispute records. LEGAL HOLD STATUS: ACTIVE HOLD since March 2026 — exempt from any disposal regardless of schedule. This schedule is a draft organizational framework only — a qualified lawyer must review and populate confirmed retention periods before it is adopted or used to guide disposal.`,
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
    slug: 'legal-compliance-internal-legal-qa-response-draft',
    category: 'legal-compliance',
    title: `Draft a first-pass answer to a recurring internal legal question so the actual lawyer only has to edit, not start from scratch`,
    description: `Produces a draft response to a common internal legal-adjacent question, built strictly from prior approved answers and explicitly flagged wherever the current question differs from what was previously covered, so a lawyer's review is fast and the answer never gets sent without sign-off.`,
    promptText: `Draft a first-pass response to the internal question below, using only our prior approved answers as source material, so a lawyer only has to edit this rather than write a fresh answer from nothing.

THE QUESTION BEING ASKED
{{incoming_question}}

PRIOR APPROVED ANSWERS TO SIMILAR QUESTIONS
{{prior_approved_answers}}

WHO'S ASKING AND WHY
{{asker_context}}

HOW SIMILAR THIS QUESTION IS TO WHAT WAS PREVIOUSLY ANSWERED
{{similarity_assessment}}

HOW TO DRAFT THIS
First, identify exactly which parts of the current question are covered by the prior approved answers I've given you, and draft that portion using language adapted from those prior answers, staying as close to the original approved substance as possible rather than rephrasing it into something new that might drift from what was actually approved. Second, identify exactly which parts of the current question are NOT covered by any prior approved answer — a new fact pattern, a question about a situation the prior answers didn't address, anything at all novel — and mark that portion explicitly as requiring fresh legal input, with a one-line note on what specifically makes it different from the prior situation. Do not blend the covered and uncovered portions together in a way that makes it hard to tell which parts of the draft are backed by prior approval and which are new.

WHAT NOT TO DO
Do not extend a prior approved answer to cover a new situation just because it seems similar or the underlying principle feels like it should apply — a prior answer was approved for its specific facts, and extending it to new facts is a legal judgment only a lawyer should make, not something to do by pattern-matching resemblance. Do not present this draft as ready to send — it always needs lawyer review before going to the person who asked, no matter how closely it tracks prior approved language.

OUTPUT FORMAT
1. Draft response, ready for a lawyer to edit, with the portions covered by prior approved answers written first.
2. A clearly separated section titled "NOT COVERED BY PRIOR APPROVAL" listing anything in the current question that goes beyond what was previously answered, with a one-line note on what's different.
3. Source note: which prior approved answer(s) this draft draws from.
4. A closing line stating this is an internal draft only, has not been reviewed by a qualified lawyer, and must not be sent to the person who asked until a lawyer has reviewed and approved it, including the portions drawn from prior approved language.`,
    variables: [
      {
        name: 'incoming_question',
        description: `The actual question that came in.`,
        example: `Can a manager in the EU office approve expense reimbursements over $5,000 without a second sign-off, given our updated approval matrix?`,
        required: true,
      },
      {
        name: 'prior_approved_answers',
        description: `Previously approved answers to similar or related questions, as source material.`,
        example: `Prior approved answer (US offices, 2025): managers may approve up to $2,500 alone; anything above requires finance director sign-off, per the approval matrix effective Jan 2025.`,
        required: true,
      },
      {
        name: 'asker_context',
        description: `Who is asking and what's prompting the question.`,
        example: `EU regional manager asking ahead of a large conference sponsorship expense, wants to know before committing to the vendor.`,
        required: true,
      },
      {
        name: 'similarity_assessment',
        description: `Your own sense of how closely this matches what was previously answered, and where it might differ.`,
        example: `Similar question but the prior answer was specific to US offices under the 2025 matrix — unclear if the EU office follows the same matrix or a different one.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`internal-legal-qa`, `policy-response-draft`, `legal-draft`, `knowledge-reuse`, `response-triage`],
    whyItWorks: `The instruction to draft only the covered portion from prior approved language, and to explicitly separate out anything not covered rather than blending it in, is built around a specific and dangerous pattern-matching failure that language models are prone to: given a prior approved answer and a new, similar-sounding question, GPT-5.1 will readily generalize the underlying principle and apply it to the new facts, because that's exactly what makes it useful for most tasks — but a legal answer approved for one specific fact pattern (US offices, a specific approval matrix, a specific dollar threshold) was approved for those exact facts, and whether the same reasoning extends to a different office, a different matrix, or a different threshold is itself a legal judgment call, not a resemblance the model is positioned to validate. Explicitly calling out the EU-versus-US distinction as an example of where similarity assessment matters illustrates why this separation is not pedantic: an EU office may follow an entirely different approval matrix, and a draft that silently applied the US-approved threshold to an EU question would hand someone specific, wrong operational guidance dressed up as previously-approved policy, which is worse than an obviously incomplete draft because it looks fully resolved. Requiring a source note tying the draft back to which specific prior answer it drew from creates an audit trail that lets the reviewing lawyer instantly verify the draft actually tracks what was approved rather than a plausible-sounding paraphrase that drifted from the original substance during rewriting — language models restate things fluently, and fluent restatement is not the same guarantee as faithful restatement, so making the source traceable is what lets a human catch drift before it goes out. The repeated, unconditional instruction that this must never be sent without lawyer review — regardless of how closely it tracks prior approved language — exists because the entire value of this workflow (saving the lawyer time) creates exactly the temptation to skip the review step on a draft that looks clean, which is the one shortcut this prompt is explicitly designed to prevent.`,
    exampleOutput: `DRAFT RESPONSE (covered portion, drawn from prior approved 2025 answer): Per our approval matrix, managers may approve reimbursements up to $2,500 without additional sign-off; anything above that requires finance director approval. NOT COVERED BY PRIOR APPROVAL: The prior approved answer was specific to US offices under the 2025 matrix — whether the EU office follows the same matrix or a separate regional one was not addressed and needs confirmation before this answer can be extended to the EU manager's question. SOURCE: Prior approved answer, US offices, 2025 approval matrix. This is an internal draft only and must not be sent until a lawyer has reviewed and approved it.`,
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
]
