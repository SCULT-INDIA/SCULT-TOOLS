import type { Prompt } from '../types'

/**
 * Startup & Strategy — Tier 2, business group. Founder prompts that force
 * rigor instead of cheerleading: Lean Startup and JTBD-style validation,
 * pitch and positioning narrative, competitive and pricing strategy,
 * go-to-market and MVP scoping, fundraising and cap-table mechanics
 * (explicitly not legal/investment advice), and the founder- and
 * team-facing decisions — cofounder equity, hiring, board meetings, risk
 * pre-mortems — that most AI prompt libraries skip entirely.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'startup-idea-validation-hypothesis-tests',
    category: 'startup',
    title: 'Turn a startup idea into hypotheses a good interview could actually kill',
    description:
      'Generates falsifiable hypotheses, the cheapest real-world test that could disprove each one, and Mom-Test-style interview questions — so a bad idea gets caught before months of building, not after.',
    promptText: `You are a startup advisor trained in Lean Startup validation and Rob Fitzpatrick's "Mom Test" interviewing method. Your job on this pass is to find the fastest way to prove this idea WRONG. Do not default to encouragement, and do not soften a real weakness into a "consideration."

CONTEXT
Idea: {{idea_description}}
Target customer: {{target_customer}}
Riskiest assumption, if you already suspect one: {{riskiest_assumption}}
Time and budget available to test: {{timeframe_and_budget}}
Any response you've already gotten (interest, signups, a demo reaction): {{early_signals_so_far}}

HYPOTHESIS EXTRACTION
Restate the idea as exactly three falsifiable hypotheses: (a) a specific, real problem this customer has today, (b) that they would pay to solve it, (c) that they would find and adopt a solution the way you're planning to reach them. Each must be a claim evidence could disprove, not a belief dressed up as one — if a hypothesis would survive any interview answer, rewrite it narrower until it wouldn't.

DISPROVING TESTS
For each hypothesis, design the cheapest test that could disprove it inside {{timeframe_and_budget}}. Every test must produce a real behavioral signal — a payment, a signed waitlist with a deposit, a completed task, a real usage log — never an opinion or a survey score standing in for behavior.

MOM-TEST INTERVIEW QUESTIONS
Write five interview questions that ask only about the customer's past behavior and current workarounds. No question may contain "would you," "might you," "do you think," or any framing that asks the interviewee to imagine a hypothetical future — evaluate every draft question against this rule before including it, and rewrite anything that fails.

RISKIEST-ASSUMPTION FAILURE SIGNAL
Using {{riskiest_assumption}} if given, or the shakiest of the three hypotheses if not, state plainly what a real failure signal for it would look like. Explicitly name polite interest — "that's a cool idea," "I'd probably use that" — as not evidence, and explain why it's a false positive if {{early_signals_so_far}} contains anything that reads like it.

OUTPUT FORMAT
Four numbered sections: Hypotheses, Disproving Tests, Mom-Test Questions, Riskiest-Assumption Failure Signal. Plain text, no encouragement or cheerleading language anywhere in the output, no bullet padding with adjectives that aren't doing work.`,
    variables: [
      {
        name: 'idea_description',
        description: 'The startup idea, in your own words',
        example:
          'A marketplace that matches retiring dentists with buyers looking to acquire an existing practice',
        required: true,
      },
      {
        name: 'target_customer',
        description: 'Who you think has this problem',
        example:
          'Solo-practice dentists within 5 years of retirement with no succession plan',
        required: true,
      },
      {
        name: 'riskiest_assumption',
        description: "The assumption you're most nervous about, if you know it",
        example:
          'That dentists will trust an online marketplace over their existing broker relationship',
        required: false,
      },
      {
        name: 'timeframe_and_budget',
        description: 'How much time and money you can spend testing this',
        example: '3 weeks, under $400',
        required: true,
      },
      {
        name: 'early_signals_so_far',
        description: 'Any response you already have, if any — good or bad',
        example:
          '4 dentists said "definitely interesting" when I described it at a conference booth',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'idea-validation',
      'lean-startup',
      'mom-test',
      'customer-discovery',
      'hypothesis-testing',
      'founders',
    ],
    whyItWorks:
      "The default failure mode of an idea-validation prompt is to be asked what makes an idea good and then dutifully generate reasons it's good — the model has no incentive to argue against the premise it was handed. Structuring the ask as three falsifiable hypotheses closes that loophole: a hypothesis is only useful if evidence could contradict it, which is the actual mechanic behind Lean Startup's build-measure-learn loop, and a claim you can't fail isn't being tested, it's being confirmed on a longer timeline. The banned-words rule against 'would you' and 'might you' is a direct, checkable implementation of the Mom Test's core finding — hypothetical questions get people to imagine themselves as the hero of a flattering future story, so they answer generously and inaccurately, whereas questions about specific past behavior can't be answered with a wish. Naming polite interest as a false positive, and cross-checking it against whatever early signal the founder already has, targets the single most common self-deception in early-stage validation: 'that's a cool idea' produces the same warm feeling in the founder's chest as a real buying signal does, so without an explicit rule distinguishing them, a founder pattern-matches the two and proceeds on evidence that was never actually there. Together these three checks turn a prompt that would otherwise just be an encouraging summary of the founder's own pitch into something closer to a hostile pre-mortem of the idea's weakest points, which is the only version of this exercise that's actually worth running before spending real time.",
    exampleOutput: `Hypotheses:
1. Retiring solo-practice dentists without a succession plan are actively looking for a buyer within their remaining practice years (problem).
2. They would pay a marketplace fee rather than rely solely on their existing broker (willingness to pay/switch).
3. They would trust and use an online listing to find a buyer, not just their local professional network (adoption channel).

Disproving tests (3 weeks, <$400): Interview 10 dentists nearing retirement about who they've already contacted about selling — if all have an active broker they trust and no interest in another channel, hypothesis 3 is disproved. Post 3 real listings with a small $50 listing fee — a near-zero paid-listing rate disproves hypothesis 2 regardless of interest expressed.

Mom-Test questions: Walk me through the last conversation you had about eventually selling your practice. Who have you already talked to about this? What's stopped you from listing it so far?

Riskiest-assumption failure signal: If dentists describe their broker relationship as central and irreplaceable, or nobody has shopped a broker's fee against alternatives, that's a real failure signal for trust in a new channel — the conference-booth "definitely interesting" reactions are not evidence against this, since agreeing something sounds interesting costs a stranger nothing.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-08' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against Claude Sonnet 5 and ChatGPT GPT-5.1.',
      },
    ],
  },
  {
    slug: 'startup-jtbd-customer-interview-script',
    category: 'startup',
    title: 'Write a JTBD interview script that surfaces the job, not a feature wishlist',
    description:
      "Builds a three-phase Jobs-to-be-Done interview script — timeline, forces of progress, desired outcome — anchored to a real past switching moment instead of the interviewee's opinion of your product.",
    promptText: `You are a Jobs-to-be-Done researcher preparing an interview script. The goal is to reconstruct the job {{target_customer_segment}} was trying to get done when they last switched solutions, not to collect opinions about {{product_or_feature}} itself.

CONTEXT
Product or feature under research: {{product_or_feature}}
Target customer segment: {{target_customer_segment}}
What's known about their switching moment, if anything: {{known_switching_moment}}
Planned interview length: {{interview_length_minutes}} minutes

PHASE 1 — TIMELINE (4 questions)
Reconstruct the sequence of events before they started looking for something new. Ask what they were doing before, what specifically triggered the search (the struggle moment — a breaking point, not a vague dissatisfaction), and what they tried first before finding a real solution.

PHASE 2 — FORCES OF PROGRESS (4 questions, one per force)
Ask about the push (what was actively wrong with the old way that was pushing them away from it), the pull (what was attractive about a new solution), the anxiety (what made them hesitate to switch — cost, learning curve, fear of choosing wrong), and the habit or attachment to the status quo (what kept them using the old way despite its problems). Do not merge these into one generic "what problems did you have" question — each force surfaces something different and gets flattened if combined.

PHASE 3 — DESIRED OUTCOME (3 questions)
Ask what "done" looked like for them — the outcome they were hiring a solution to produce — phrased around the specific past instance from Phase 1, never as a general opinion question.

INTERVIEWER DISCIPLINE
Under every question, add one line stating what it's designed to surface. Flag any question that asks about the future, asks for an opinion, or asks the interviewee to evaluate {{product_or_feature}} directly, and rewrite it to ask about a specific past instance instead — a script this size should have zero surviving violations by the time you're done.

OUTPUT FORMAT
Three headed phases, questions numbered within each phase, one-line rationale directly under every question, fitting comfortably inside {{interview_length_minutes}} minutes at a natural conversational pace.`,
    variables: [
      {
        name: 'product_or_feature',
        description: "The product or feature you're researching",
        example: 'A shift-scheduling app for restaurant managers',
        required: true,
      },
      {
        name: 'target_customer_segment',
        description: "Who you're interviewing",
        example:
          'Restaurant general managers running 15+ hourly staff across multiple shifts',
        required: true,
      },
      {
        name: 'known_switching_moment',
        description:
          'What you already know about when they went looking for something new, if anything',
        example:
          'Several mentioned switching after a group-text schedule mix-up left a shift uncovered',
        required: false,
      },
      {
        name: 'interview_length_minutes',
        description: 'How long the interview slot actually is',
        example: '30',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['jobs-to-be-done', 'jtbd', 'customer-interviews', 'user-research', 'founders'],
    whyItWorks:
      "This follows the documented JTBD interviewing method built by Bob Moesta and Chris Spiek (the demand-side thinking behind Clayton Christensen's milkshake study), which reconstructs one specific past switching event in detail rather than asking for a general opinion about a category of problem. The four forces of progress — push, pull, anxiety, and habit — are the actual named framework for why people switch or stay put, and separating them into four distinct questions matters because a plain 'what problems do you have' question almost never reaches anxiety or habit; customers don't volunteer their own hesitation or inertia unprompted, since admitting 'I was scared to switch' or 'I just kept using the old way out of habit' feels like an unflattering thing to say about yourself in an interview, so it has to be asked for directly. Anchoring every question to the specific past instance identified in Phase 1 — rather than letting Phase 2 and 3 drift into hypotheticals about switching in general — is what keeps the whole script grounded in something that actually happened and can't be answered with a flattering guess about future behavior. The interviewer-discipline pass at the end catches a failure mode that's easy to introduce by accident even when the phase structure is right: a well-intentioned follow-up question like 'would a feature like X have helped?' slips in naturally mid-interview and instantly breaks the past-behavior-only rule, and because it sounds so reasonable in the moment, it's the kind of violation a researcher would miss without an explicit rewrite-or-flag check built into the script before the interview happens rather than caught afterward in a transcript nobody re-reads closely enough.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 and Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'startup-pitch-deck-narrative-outline',
    category: 'startup',
    title:
      'Turn raw startup facts into a pitch narrative investors can follow in one skim',
    description:
      "Organizes scattered facts into the standard investor narrative arc slide by slide, writing the one sentence each slide must land, and flags any slot the facts genuinely can't support yet instead of inventing content to fill it.",
    promptText: `You are a pitch deck story editor. Organize scattered facts into the standard investor narrative arc — you are not writing slide copy or design notes, and you never invent a fact that wasn't given to you.

CONTEXT
Raw notes about the startup: {{raw_notes_about_startup}}
Funding stage: {{funding_stage}}
Funding ask: {{funding_ask}}
Anything the investor already knows or has heard, if this is a follow-up conversation: {{prior_context_with_investor}}

FACT EXTRACTION
From the raw notes, extract: the problem in one sentence, the "why now" trigger (what specifically changed that makes this the right moment), the solution in one sentence, and the single most important traction fact — the one number or event that would make a skeptical investor lean forward.

SLIDE ASSIGNMENT
Assign the extracted facts, and anything else usable in the notes, to this order: Problem → Why Now → Solution → Market Size → Product → Traction → Business Model → Competition → Team → Ask. For any slide with no supporting fact in the notes, write "Not yet answered — needs [specific missing fact]" rather than inventing content to fill the gap. A missing slide is a real, visible problem to fix before the pitch, not something to paper over.

THE ONE SENTENCE PER SLIDE
For every slide, write the single sentence a reader must walk away with — the "so what," not a content summary restating what's already on the slide. If a slide's facts genuinely don't support a clear sentence, say so rather than forcing a vague one that sounds fine but says nothing specific.

THE ASK
Write the Ask slide as one exact number ({{funding_ask}}), the {{funding_stage}} it corresponds to, and one sentence on primary use of funds. No hedging language like "around" or "roughly" unless the input itself was given as a range.

OUTPUT FORMAT
Ten headed slide sections in the order above, one paragraph or a "not yet answered" line each, ending with the Ask.`,
    variables: [
      {
        name: 'raw_notes_about_startup',
        description: 'Whatever you have — bullet points, a rambling doc, past deck text',
        example:
          'AI-assisted intake triage for urgent care clinics. 2 pilot clinics running it, one cut average wait-to-be-seen from 41min to 19min. State just approved telehealth triage reimbursement this year.',
        required: true,
      },
      {
        name: 'funding_stage',
        description: 'The round being raised',
        example: 'Seed',
        required: true,
      },
      {
        name: 'funding_ask',
        description: 'The exact amount being raised',
        example: '$1,400,000',
        required: true,
      },
      {
        name: 'prior_context_with_investor',
        description:
          'What this investor already knows, if this is a follow-up rather than a cold pitch',
        example: 'Met at a demo day, only saw a 90-second lightning pitch, no deck yet',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'pitch-deck',
      'fundraising',
      'narrative-structure',
      'investor-communication',
      'founders',
    ],
    whyItWorks:
      "DocSend's own pitch-deck research consistently finds investors spend only a few minutes on a first-look deck before deciding whether to take a meeting, which means the narrative has to land in a single skim rather than a careful read. Sequencing Problem before Solution is the actual mechanic that makes that skim work: naming the pain before the fix builds the tension a features-first deck skips straight past, so the reader feels why the solution matters instead of being asked to trust that it does on faith. Writing one required sentence per slide — the 'so what,' not a summary of the slide's own content — forces every slide to earn its place in the narrative rather than existing because the template says a deck needs ten slides; a slide that can't produce a clear sentence is a slide that isn't pulling weight, and that's a more useful thing to discover before the pitch than during it. The explicit 'not yet answered' flag for unsupported slides matters just as much as the sentence-per-slide rule: decks that fabricate a market-size figure or round a soft traction signal up to a hard number are the single most common thing that blows up in investor diligence once someone actually checks, and it is far cheaper to walk into a meeting with an honestly labeled gap than to get caught having rounded one up after an investor has already started asking around.",
    exampleOutput: `Problem: Urgent care clinics lose patients to abandonment and burn staff time on manual intake triage during peak hours.
Why Now: A new state reimbursement rule for telehealth triage this year removes the main financial reason clinics avoided automating this step.
Solution: AI-assisted intake triage that routes patients to the right care level before they're seen.
Market Size: Not yet answered — needs a sized estimate of addressable urgent care visit volume, not just "healthcare is huge."
Traction: 2 pilot clinics live; one cut average wait-to-be-seen from 41 to 19 minutes — the number worth leading with.
...
Ask: Raising $1,400,000 seed to hire a clinical ops lead and expand from 2 pilots to 10 paying clinics.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-06' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Claude Sonnet 5 and ChatGPT GPT-5.1.',
      },
    ],
  },
  {
    slug: 'startup-competitive-landscape-buyer-axes',
    category: 'startup',
    title:
      'Map a competitive landscape by how customers actually choose, not a feature checklist',
    description:
      'Places every competitor — including the status-quo and DIY options a feature matrix always leaves out — on the two axes customers actually weigh, then writes one honestly-checked differentiation sentence.',
    promptText: `You are a competitive strategy analyst. Build a landscape analysis organized around how the customer actually decides, not a generic feature checklist that treats every capability as equally decision-relevant.

CONTEXT
Startup one-liner: {{startup_one_liner}}
Direct competitors (same solution type, same customer): {{direct_competitors}}
Indirect or substitute solutions (different approach, same underlying job — including doing nothing or DIY): {{indirect_or_substitute_solutions}}
What customers actually weigh when choosing, if known: {{customer_decision_criteria}}

COMPLETENESS CHECK
Confirm the direct-vs-indirect grouping is actually complete before analyzing it. Explicitly check whether "doing nothing" or a manual/DIY workaround belongs in the indirect list even if it wasn't named — status-quo inertia is usually the real biggest competitor for an early-stage startup, and a landscape analysis that skips it is analyzing the wrong fight.

DECISION AXES
Identify the two axes customers actually weigh when choosing between these options, using {{customer_decision_criteria}} if given, or inferring the two axes most likely to drive a real switching decision if not. State your reasoning for choosing them — do not default to generic axes like "price vs. features" unless the input genuinely supports that being the real decision.

PLACEMENT
Place every competitor plus {{startup_one_liner}} on those two axes as a text-described grid — which quadrant, and one sentence of reasoning per placement, tied to something specific about how that option actually operates, not a vibe.

DIFFERENTIATION CHECK
Write one honest differentiation sentence: what this startup is the only, best, or most credible option for. If the notes don't yet support a real differentiation claim, say so directly instead of writing a vague one ("more affordable and easier to use") that any competitor in the list could also truthfully claim about itself.

OUTPUT FORMAT
Four headed sections: Completeness Check, Decision Axes (with reasoning), Placement Grid, Differentiation Check.`,
    variables: [
      {
        name: 'startup_one_liner',
        description: 'Your startup in one sentence',
        example: 'AI-assisted intake triage for urgent care clinics',
        required: true,
      },
      {
        name: 'direct_competitors',
        description: 'Companies selling essentially the same solution',
        example: 'TriageIQ, FastTrackHealth',
        required: true,
      },
      {
        name: 'indirect_or_substitute_solutions',
        description: 'Different approaches to the same underlying job',
        example:
          'Front-desk staff doing manual triage, a generic EHR intake form, an outsourced nurse triage line',
        required: true,
      },
      {
        name: 'customer_decision_criteria',
        description: 'What you know customers actually weigh when choosing, if anything',
        example:
          'Clinics care most about staff time saved during peak hours, much less about upfront cost',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: [
      'competitive-analysis',
      'positioning',
      'market-research',
      'strategy',
      'founders',
    ],
    whyItWorks:
      "Feature-matrix comparisons fail for a specific reason: they compare capabilities, not the actual axes a buyer weighs when choosing, so two products can look identical on a checklist and still lose or win on an axis the checklist never captured at all — setup time, staff trust, or switching risk rarely appear as rows on a feature grid, yet they're often what actually decides the sale. Forcing status-quo and DIY into the indirect set corrects a documented and specific blind spot: founders reflexively list only named competing companies, even though for most early-stage products the real dominant competitor is 'the customer keeps doing it manually,' since a familiar, imperfect workaround beats an unfamiliar, unproven product more often than any named rival ever does. Refusing to write a generic differentiation sentence when the facts don't support one guards against exactly the kind of positioning claim — 'faster, cheaper, easier' — that every competitor in the set could also truthfully make, which means it functions as noise rather than a real reason to choose, to anyone evaluating more than one option side by side. Requiring the two decision axes to be inferred from what customers actually weigh, rather than defaulted from a generic price-versus-features template, also protects against the single most common shortcut in a landscape analysis: picking axes that make the founder's own product look good in the top-right quadrant by construction, instead of axes that reflect what the buyer in {{customer_decision_criteria}} is actually optimizing for when nobody's watching.",
    verifiedAgainst: [{ tool: 'Claude', version: 'Sonnet 5', date: '2026-08-04' }],
    changelog: [
      { date: '2026-08-04', note: 'Initial publish, verified against Claude Sonnet 5.' },
    ],
  },
  {
    slug: 'startup-value-based-pricing-tiers',
    category: 'startup',
    title:
      'Design pricing tiers around what each segment values, not round numbers copied from a competitor',
    description:
      'Builds value-based pricing tiers around a deliberately chosen value metric and an explicit anchor tier, and flags any must-have feature gated behind a higher tier as a deliberate trade-off rather than an accident.',
    promptText: `You are a SaaS pricing strategist using value-based, tiered pricing — pricing tied to what each segment actually values, never round numbers copied from a competitor's pricing page.

CONTEXT
Product: {{product_description}}
Customer segments: {{customer_segments}}
Features/capabilities available to package: {{features_or_capabilities}}
Candidate value metrics, if you have ideas: {{value_metric_candidates}}
Current price, if any, and why it might be wrong: {{current_price_and_concern}}

VALUE METRIC
From {{value_metric_candidates}} or by inferring from the product, propose the value metric each tier should scale on — per-seat, per-usage-unit, per-outcome, or flat. State explicitly why it scales with the value the customer receives, not with your cost to deliver it — those are frequently not the same thing, and confusing them is the most common pricing mistake to make here.

TIER DESIGN
Design 2 to 4 tiers, each named for and mapped to one segment in {{customer_segments}}. State which segment's willingness-to-pay and must-have needs each tier is built around, and why that segment specifically would choose that tier over the others.

FEATURE ASSIGNMENT
Assign each item in {{features_or_capabilities}} to a tier. For any feature that would be a must-have reason to buy for a lower-priced segment, flag it explicitly if you're gating it behind a higher tier — that gate usually suppresses adoption of the entry tier rather than lifting revenue, so it needs to be a deliberate choice with a stated reason, never an accident of where a feature happened to land.

ANCHOR TIER
Name which tier is the intended default choice for most buyers, and explain the anchoring reasoning — that a deliberately less attractive higher or lower option makes the anchor tier look reasonably priced by comparison, not in isolation.

OUTPUT FORMAT
A tier table (name, target segment, price basis, included features), followed by the anchor-tier reasoning as its own short paragraph, addressing {{current_price_and_concern}} directly if given.`,
    variables: [
      {
        name: 'product_description',
        description: 'What the product does',
        example:
          'A shift-scheduling and labor-cost forecasting tool for restaurant managers',
        required: true,
      },
      {
        name: 'customer_segments',
        description: 'The distinct buyer segments you sell to',
        example:
          'Single independent restaurants, small local groups (3-8 locations), regional chains (20+ locations)',
        required: true,
      },
      {
        name: 'features_or_capabilities',
        description: 'Every feature or capability you could package',
        example:
          'Shift scheduling, labor-cost forecasting, multi-location dashboard, payroll export, shift-swap approvals, API access',
        required: true,
      },
      {
        name: 'value_metric_candidates',
        description: 'Ideas you already have for what to charge based on, if any',
        example: 'Per-location, or per-active-employee scheduled',
        required: false,
      },
      {
        name: 'current_price_and_concern',
        description:
          'What you charge today, and why you suspect it might be wrong, if applicable',
        example:
          '$79/month flat for everyone — a 25-location chain pays the same as a 1-location shop, which feels off',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'pricing-strategy',
      'saas-pricing',
      'value-based-pricing',
      'packaging',
      'founders',
    ],
    whyItWorks:
      "The value-metric step is the actual mechanic that separates value-based pricing from arbitrary tiering: a metric like per-location or per-employee-scheduled should track the value the customer receives as they grow, not your cost to serve them, which is exactly the mismatch a flat-price setup like {{current_price_and_concern}} reveals — a 25-location chain and a 1-location shop paying the same amount despite wildly different value received is a symptom of the wrong metric, not the wrong number. The anchor-tier instruction implements the documented pricing-psychology decoy effect: a deliberately less attractive option on either side of the middle tier makes that middle tier look like the obviously reasonable choice by comparison, which is why most SaaS pricing pages are visibly built around a highlighted 'most popular' tier rather than three neutral, evenly-weighted options. Flagging must-have features gated behind a higher tier forces a real trade-off decision instead of an accidental one — gating something a lower segment genuinely needs to buy at all usually loses more entry-tier customers than it gains in upgrade revenue, and that's a specific, checkable failure mode worth naming explicitly rather than discovering months later in a churn analysis when entry-tier signups quietly stop converting. Requiring each tier to map to a named segment's actual willingness-to-pay, rather than just splitting the feature list into thirds, also prevents the common trap of building a pricing page that reads as internally consistent but corresponds to no one's actual buying decision.",
    exampleOutput: `Independent — per-location, $49/mo: shift scheduling, shift-swap approvals.
Local Group (anchor tier) — per-location, $39/mo (3+ locations): everything in Independent, plus labor-cost forecasting and multi-location dashboard.
Regional — custom, per-location: everything in Local Group, plus payroll export and API access.

Anchor reasoning: Local Group is the intended default — its per-location price is lower than Independent's, making it look like the "smart" choice once a manager runs more than one site, while Regional's undefined custom price makes Local Group look concretely priced and easy to commit to by comparison.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 and Claude Sonnet 5.',
      },
    ],
  },
  {
    slug: 'startup-gtm-channel-bullseye-test-plan',
    category: 'startup',
    title:
      'Pick a GTM channel by testing cheaply across many, not betting on the obvious one',
    description:
      'Scores candidate go-to-market channels on fit, cost, and speed to signal rather than raw potential, then builds a pre-committed pass/fail test plan for the top two before any real budget gets spent.',
    promptText: `You are a GTM strategist using the "bullseye" approach to channel selection: test cheaply across many channels before committing real budget to the one that looks obvious.

CONTEXT
Product: {{product_description}}
Target customer: {{target_customer}}
Budget/resources available: {{budget_or_resources}}
Channels being considered, if any: {{channels_considered}}
What's already been tried, if anything, and the result: {{channels_already_tried}}

CANDIDATE CHANNELS
List candidate GTM channels — use {{channels_considered}} plus any others clearly relevant to how {{target_customer}} actually discovers solutions like this, given {{budget_or_resources}}. Do not repeat a channel from {{channels_already_tried}} without directly addressing why it's worth reconsidering or ruling it out for good.

SCORING
Score each channel on three axes only: fit (how closely it matches where {{target_customer}} already looks for solutions), cost/effort to run a real cheap test, and speed to a usable signal. Do not score on scale or long-term potential — that is a later-stage question, and scoring for it now is exactly what leads teams to over-invest in an unproven channel before it's actually worked at small scale.

TOP-TWO TEST PLANS
Select the top two channels by that scoring and design a 2-week test for each, with a pass/fail metric stated in advance, before any test result exists to argue with or rationalize around.

POOR-FIT CALLOUT
Explicitly name any channel from the list that's a poor fit given the customer's actual buying behavior, and say why — so it doesn't get tried later just because it's popular, cheap-sounding, or "what everyone in this space does."

OUTPUT FORMAT
A scored table across all candidate channels, then two test plans with pre-committed pass/fail metrics, then the poor-fit callout as a short closing note.`,
    variables: [
      {
        name: 'product_description',
        description: 'What the product is and does',
        example:
          'Shift-scheduling and labor-cost forecasting for independent restaurants',
        required: true,
      },
      {
        name: 'target_customer',
        description: 'Who buys it and, ideally, how they currently find solutions',
        example:
          'Restaurant owner-operators, who mostly find tools through their POS vendor marketplace or other owners in local groups',
        required: true,
      },
      {
        name: 'budget_or_resources',
        description: 'What you actually have to spend or staff this with',
        example: '$800/month, one founder doing GTM part-time alongside product work',
        required: true,
      },
      {
        name: 'channels_considered',
        description: 'Channels already on your shortlist, if any',
        example:
          'POS-vendor marketplace listing, local restaurant-owner Facebook groups, cold outreach to multi-location groups',
        required: false,
      },
      {
        name: 'channels_already_tried',
        description: "Anything you've already run, and what happened",
        example:
          'Ran Google Ads for 2 weeks, $300 spent, 2 signups, both churned within a week',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['go-to-market', 'channel-strategy', 'growth', 'early-stage', 'founders'],
    whyItWorks:
      "This is the Bullseye framework from Gabriel Weinberg and Justin Mares' Traction: rank many channels cheaply on fit, cost, and speed to signal before committing real budget to any single one, because early-stage teams reliably default to whichever channel is most visible — usually the one their competitors are already running — rather than the one that actually fits how their specific customer buys. Explicitly excluding scale and long-term potential from the scoring matters because that's precisely the axis that makes an unproven channel look attractive on a spreadsheet before it's been tested at all; potential is a real question eventually, but optimizing the first test for it is how a team ends up with a large, expensive bet on a channel nobody actually validated at small scale. Pre-committing the pass/fail metric before running the test is what stops a team from quietly redefining 'success' after a lukewarm result comes in — a documented and common pattern in the {{channels_already_tried}} data most founders already have sitting around from a channel they kept funding past the point the numbers had already answered the question. Requiring the model to directly address any previously-tried channel, rather than silently ignoring it, also closes a specific gap: a channel that already failed once needs an explicit reason to try again with a different test design, or it needs to be ruled out for good — leaving it unaddressed is how the same underperforming channel quietly gets re-tried every quarter under a slightly different name.",
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' }],
    changelog: [
      { date: '2026-08-03', note: 'Initial publish, verified against ChatGPT GPT-5.1.' },
    ],
  },
  {
    slug: 'startup-mvp-scope-cut-list',
    category: 'startup',
    title:
      'Cut a feature wishlist down to the MVP that actually tests your riskiest assumption',
    description:
      'Reduces a full feature wishlist to the smallest version that tests one specific assumption, with a visible cut list naming what got left out and which assumption it would have tested instead.',
    promptText: `You are helping scope an MVP down to the smallest thing that tests one specific assumption — not the smallest version of the full product vision, which is a different and much larger exercise.

CONTEXT
Full feature wishlist: {{full_feature_wishlist}}
Riskiest assumption to test: {{riskiest_assumption}}
Who will use this test version: {{target_user_for_test}}
How long you can run the test before needing a real answer: {{test_duration}}

HYPOTHESIS RESTATEMENT
Restate {{riskiest_assumption}} as one testable hypothesis, specific enough that a pass and a fail would look visibly different.

INCLUSION
From {{full_feature_wishlist}}, select only the features {{target_user_for_test}} needs to genuinely put that hypothesis to the test — not features that would help test a different, less risky assumption, and not features that make the product feel more complete but aren't load-bearing for this specific test.

CUT LIST
List every feature you cut, next to the assumption it would actually test instead — so each cut is a visible decision with a stated reason, not a feature quietly dropped and forgotten until someone asks where it went.

PASS/FAIL DEFINITION
Define, in advance and specific to {{test_duration}}, what a pass and a fail look like — specific enough that you and a skeptical cofounder would agree on the result afterward without arguing about what counts.

OUTPUT FORMAT
Three sections: Included (with the assumption each feature tests), Cut (with the assumption each cut feature would have tested instead), Pass/Fail Definition.`,
    variables: [
      {
        name: 'full_feature_wishlist',
        description: 'Every feature currently on the roadmap or wishlist',
        example:
          'AI-assisted triage form, multi-clinic dashboard, patient wait-time SMS updates, staff analytics reporting, role-based permissions, EHR integration',
        required: true,
      },
      {
        name: 'riskiest_assumption',
        description: "The assumption you're least sure about",
        example:
          'That front-desk staff will trust an AI triage recommendation enough to act on it without a nurse double-checking every case',
        required: true,
      },
      {
        name: 'target_user_for_test',
        description: "Who's actually using this test version",
        example: 'Front-desk staff at one pilot urgent care clinic',
        required: true,
      },
      {
        name: 'test_duration',
        description: 'How long you can realistically run this before needing an answer',
        example: '4 weeks',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['mvp', 'product-scoping', 'lean-startup', 'roadmap', 'founders'],
    whyItWorks:
      "This grounds MVP scoping in Lean Startup's actual definition — an MVP exists to test one hypothesis, it is not a stripped-down version of the entire roadmap — a distinction most feature-cutting exercises collapse by asking 'what's the smallest version of everything' instead of 'what's the smallest thing that tests the one thing I'm actually unsure about.' The paired cut-list format, where every removed feature sits next to the assumption it would have tested, is what stops scope creep in reverse: without a written reason, a cut feature has a way of quietly getting re-added mid-build because nobody remembers why it left, or because it's easy to justify as 'just one more thing' in isolation once the team is already deep in the build. Defining pass/fail before building, scaled explicitly to {{test_duration}}, removes the after-the-fact wiggle room that lets a team call a weak result a win because the bar was never actually written down — a fail metric defined for a 4-week test needs to be reachable in 4 weeks, and a metric borrowed from a longer or shorter test window quietly changes what the test is actually measuring without anyone noticing until the result comes in ambiguous. Anchoring inclusion to a single named user (not 'users' generally) also forces every feature decision through one concrete lens instead of an abstract audience, which is what keeps the cut list honest — it's much easier to rationalize keeping an unnecessary feature for 'users' in general than for one specific front-desk staffer at one specific pilot clinic whose actual week you're trying to picture.",
    exampleOutput: `Hypothesis: Front-desk staff will act on an AI triage recommendation without a nurse double-checking every case first.

Included: AI-assisted triage form (the core test), patient wait-time SMS updates (needed to see if staff override the AI recommendation when a patient complains, which would signal distrust).

Cut: Multi-clinic dashboard (tests a scaling assumption, not this one) — staff analytics reporting, role-based permissions (test later-stage operational assumptions) — EHR integration (tests adoption friction, not trust in the recommendation itself).

Pass/fail: Pass if staff act on at least 8 of 10 AI triage recommendations without pulling in a nurse to re-check within the 4-week window. Fail if a nurse re-checks the majority regardless, or staff quietly revert to their old manual process before the window closes.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-06' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Claude Sonnet 5 and Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'startup-monthly-investor-update-email',
    category: 'startup',
    title: 'Write a monthly investor update that gets replies, not silence',
    description:
      'Turns raw metrics and notes into a concise investor update — headline numbers first, honest lowlights included, and asks specific enough to actually act on within seconds of opening the email.',
    promptText: `You are drafting a monthly investor update in the format investors actually read to the end — headline numbers first, honest lowlights included, specific asks only.

CONTEXT
Company: {{company_name}}
Period: {{reporting_period}}
Key metrics, with trend vs. last period: {{key_metrics}}
Highlights: {{highlights}}
Lowlights or challenges: {{lowlights_or_challenges}}
Specific asks, if any: {{specific_asks}}

HEADLINE METRICS
Open with a one-line list of the 1-2 headline metrics from {{key_metrics}}, stated as numbers with trend (e.g. "MRR: $58k, up 9% MoM"). No adjective may substitute for a number that already exists in the input.

HIGHLIGHTS
Write Highlights as specific, verifiable facts from {{highlights}} — cut anything that's just momentum language ("strong month," "great traction") without a concrete fact backing it up. A highlight without a fact attached is a claim, not evidence.

LOWLIGHTS
Write Lowlights/Challenges honestly from {{lowlights_or_challenges}}. Do not soften a real problem into something that reads like a highlight, and do not omit this section even if it feels uncomfortable to send — an update with no lowlights ever is a specific pattern investors recognize, and not a flattering one.

ASKS
If {{specific_asks}} is given, write each ask as one sentence naming exactly who or what is needed and by when. Rewrite a vague ask like "any intros welcome" into something answerable in under a minute, or drop it entirely if it truly can't be made specific.

OUTPUT FORMAT
Ready-to-send email. Headline metrics as a one-line list at the very top, then Highlights, Lowlights, and Asks as short sections, under 300 words total.`,
    variables: [
      {
        name: 'company_name',
        description: 'Your company name',
        example: 'Triagely',
        required: true,
      },
      {
        name: 'reporting_period',
        description: 'The month or period this covers',
        example: 'July 2026',
        required: true,
      },
      {
        name: 'key_metrics',
        description: 'Your core metrics with trend vs. last period',
        example: 'MRR $58k (up 9% MoM), 9 paying clinics (up from 7), churn: 0',
        required: true,
      },
      {
        name: 'highlights',
        description: 'Specific facts worth calling out this period',
        example:
          'Signed our first multi-clinic regional group (5 locations); average wait-to-be-seen down to 19min from 41min at flagship pilot',
        required: true,
      },
      {
        name: 'lowlights_or_challenges',
        description: 'Real problems this period — do not skip this',
        example:
          'Onboarding the 5-location group is taking 3x longer than expected due to their legacy EHR export format',
        required: true,
      },
      {
        name: 'specific_asks',
        description: 'What you actually need from investors right now, if anything',
        example:
          'An intro to anyone who has sold into a regional urgent care group with 20+ locations before',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'investor-relations',
      'investor-update',
      'fundraising',
      'founder-communication',
      'startups',
    ],
    whyItWorks:
      "This follows the widely-used YC-style investor update format, built around the fact that investors skim dozens of these emails and decide in seconds whether to read past the first line — a headline metric with trend gives them that decision instantly, where a narrative opener makes them dig for it before they know if it's worth the time. Including real lowlights is a trust signal, not a weakness: investors who've watched many portfolio companies pattern-match 'no bad news, ever' as a red flag, since it usually means the founder either isn't tracking problems closely enough to notice them or isn't disclosing the ones they do notice — and both are worse signals than the problem itself would be. A specific, dated ask is what actually converts a skimmed email into a reply — a vague ask like 'any intros welcome' asks the reader to do the work of figuring out what to do with it, and that extra step is exactly where most asks quietly die unanswered in an inbox instead of getting forwarded to the one contact who could actually help. Capping the whole email under 300 words is also load-bearing rather than a style preference: an investor reading a fund's worth of monthly updates back to back has a real, finite budget of attention per company, and an update that respects that budget gets read fully far more often than a longer, more thorough one that gets skimmed for the first paragraph and abandoned.",
    exampleOutput: `Subject: Triagely — July 2026 update

MRR: $58k, up 9% MoM. Paying clinics: 9, up from 7. Churn: 0.

Highlights: Signed our first multi-location regional group (5 clinics at once). Cut average wait-to-be-seen at our flagship pilot from 41min to 19min.

Lowlights: Onboarding the 5-location group is running 3x slower than planned — their legacy EHR export format needs a custom mapping we're building now.

Ask: Would love an intro to anyone who's sold software into a 20+ location regional urgent care group before — happy to send a one-pager.

Thanks for the continued support.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-07' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial publish, verified against Claude Sonnet 5 and ChatGPT GPT-5.1.',
      },
    ],
  },
  {
    slug: 'startup-safe-term-sheet-mechanics-explainer',
    category: 'startup',
    title: 'Get a term sheet clause explained in plain English before you sign anything',
    description:
      'Walks through what a term sheet or SAFE clause mechanically does to ownership and payout, with a concrete numeric example — mechanics only, explicitly not legal or investment advice.',
    promptText: `You are explaining fundraising term-sheet mechanics in plain English. You explain what a term literally computes or controls — ownership, control, and payout math. You do not give legal advice, and you never state or imply whether the founder should accept it.

CONTEXT
Instrument type: {{instrument_type}}
Term or clause to explain: {{term_or_clause_text}}
Current cap table summary, if you want a concrete example run through it: {{your_cap_table_summary}}
Specific question you actually have about it: {{specific_concern}}

PLAIN-ENGLISH RESTATEMENT
Restate {{term_or_clause_text}} in plain English — what it literally computes or controls mechanically (e.g. what a valuation cap does to the conversion price, what a 1x non-participating liquidation preference pays out on exit, what a pro-rata right lets the holder do in a future round).

WORKED EXAMPLE
Walk through one concrete numeric example. Use {{your_cap_table_summary}} if given; otherwise invent a simple, clearly labeled illustrative example with round numbers, and state explicitly that it's illustrative, not this founder's actual numbers.

MARKET CONTEXT
State the typical/common range for this term in current early-stage market practice, explicitly labeled as general market color, not a benchmark or recommendation for this specific deal.

DIRECT ANSWER TO THE STATED CONCERN
If {{specific_concern}} names a specific question, answer that exact question mechanically — what the clause does or doesn't do about it — without drifting into whether it's a good or bad term for this founder to accept.

MANDATORY CLOSING LINE
End with this exact reminder, unmodified: "This explains mechanics only. It is not legal or investment advice — have a startup lawyer review any term sheet before you sign."

OUTPUT FORMAT
Five numbered sections in the order above. Never state or imply an opinion on whether this founder should accept the term.`,
    variables: [
      {
        name: 'instrument_type',
        description: 'The type of instrument this term belongs to',
        example: 'Priced seed round, Series Seed preferred stock',
        required: true,
      },
      {
        name: 'term_or_clause_text',
        description: 'The exact clause or term you want explained',
        example: '"1x non-participating liquidation preference"',
        required: true,
      },
      {
        name: 'your_cap_table_summary',
        description:
          'Your current cap table basics, if you want the example run on real numbers',
        example:
          'Founders hold 78% pre-round, raising $2,000,000 at a $9,000,000 pre-money valuation',
        required: false,
      },
      {
        name: 'specific_concern',
        description: 'The exact question you actually have about this term',
        example:
          'Does this mean the investor gets paid before founders on any exit, even a small one?',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: [
      'fundraising',
      'term-sheet',
      'safe-notes',
      'liquidation-preference',
      'founders',
    ],
    whyItWorks:
      "The prompt enforces a specific separation that most AI-generated fundraising answers blur: 'what a clause computes' is arithmetic and can be stated as fact, while 'whether to accept it' is a judgment call that depends on negotiation leverage, legal context, and risk tolerance the model has no access to — collapsing those two into one answer is exactly where AI fundraising advice becomes genuinely risky rather than just unhelpful. Running a concrete numeric example matters because these terms are famously counterintuitive in the abstract: a 1x non-participating liquidation preference sounds like a minor technicality as a sentence, but running an actual exit number through it — what founders and common shareholders keep versus what the preferred holder takes first — is what makes a founder realize what it actually pays out before common stock sees a dollar, in a way the sentence alone doesn't convey. Answering the {{specific_concern}} directly and mechanically, rather than letting the response drift into general education about the clause, targets a real failure mode of AI explanations of legal-adjacent topics: a founder asks one precise question ('does this trigger on a small exit too?') and gets back a broad tutorial that technically contains the answer somewhere but never states it plainly, which is functionally the same as not answering at all when the founder is about to sign something. The hardcoded, unmodifiable lawyer-referral line closing every response is a fixed guardrail rather than a soft suggestion the model could be talked out of mid-conversation if a founder pushes for a stronger opinion on whether to sign.",
    exampleOutput: `Plain English: A 1x non-participating liquidation preference means that on an exit, the preferred investor gets back at least their original investment before common shareholders receive anything — but they must choose either that preference or converting to common and sharing pro-rata, not both.

Illustrative example (not this founder's real numbers): On a $2,000,000 investment with a 1x preference, if the company sells for $6,000,000, the investor takes $2,000,000 first, then the remaining $4,000,000 splits among common shareholders per their ownership — unless converting to common and taking their pro-rata share of the full $6,000,000 would pay them more, in which case they'd choose that instead.

Typical market range: 1x non-participating is the most common liquidation preference structure at seed stage in current market practice — this is general market color, not a benchmark for this specific deal.

Direct answer: Yes — this clause applies on any exit, including a small one; it is not limited to a specific deal size, and there is no floor below which it stops applying.

This explains mechanics only. It is not legal or investment advice — have a startup lawyer review any term sheet before you sign.`,
    verifiedAgainst: [{ tool: 'Claude', version: 'Sonnet 5', date: '2026-08-07' }],
    changelog: [
      { date: '2026-08-07', note: 'Initial publish, verified against Claude Sonnet 5.' },
    ],
  },
  {
    slug: 'startup-customer-discovery-synthesis',
    category: 'startup',
    title:
      'Turn a stack of customer discovery notes into patterns you can actually act on',
    description:
      'Synthesizes raw notes from multiple customer discovery interviews into patterns that repeated at least twice, with verbatim quotes preserved — not one loud opinion mistaken for consensus.',
    promptText: `You are synthesizing customer discovery interviews. Your job is to find what actually repeated across interviews, not to elevate the most articulate or most recent answer into a conclusion the data doesn't support.

CONTEXT
Number of interviews: {{number_of_interviews}}
Raw interview notes, labeled by interviewee if possible: {{interview_notes}}
Hypothesis being tested, if any: {{hypothesis_being_tested}}

EXTRACTION
Extract the problem statements, current workarounds, and objections mentioned in each interview, keeping track of which interview each point came from — this tracking matters for the pattern rule below, so don't lose it in summarizing.

PATTERN RULE
Group points into a theme only when the same underlying point appears in at least 2 separate interviews. Anything said by only one interviewee gets labeled "Outlier — not yet a pattern," never promoted into a theme just because it was memorable, strongly worded, or came from a customer you particularly want to be right.

VERBATIM PRESERVATION
For each real theme, quote the closest-to-verbatim language interviewees actually used, not your paraphrase of it, so the exact words are available for messaging or copy work later — a founder's tidied-up summary of what a customer meant is not the same asset as the customer's own words.

HYPOTHESIS VERDICT
If {{hypothesis_being_tested}} is given, state plainly whether the notes support it, contradict it, or leave it untested. Ambiguous or mixed evidence must be reported as ambiguous — never rounded up to "confirmed" because most of the signal pointed that way.

OUTPUT FORMAT
Themes (with interview count and verbatim quotes), Outliers, then a Hypothesis Verdict section if applicable.`,
    variables: [
      {
        name: 'number_of_interviews',
        description: 'How many interviews these notes come from',
        example: '9',
        required: true,
      },
      {
        name: 'interview_notes',
        description: 'Raw notes, ideally labeled by which interview they came from',
        example:
          'Interview 1 (front-desk lead, single clinic): "Honestly the hardest part is just knowing who to see first when three people walk in at once"...\nInterview 2 (front-desk lead, second clinic): "I don\'t trust an app to tell me who\'s worse off, that\'s a judgment call"...',
        required: true,
      },
      {
        name: 'hypothesis_being_tested',
        description: "What you're trying to confirm or disconfirm, if anything specific",
        example:
          'That front-desk staff want triage help, not a triage decision made for them',
        required: false,
      },
    ],
    targetTools: ['Claude', 'Gemini', 'ChatGPT'],
    tags: [
      'customer-discovery',
      'qualitative-research',
      'user-research',
      'synthesis',
      'founders',
    ],
    whyItWorks:
      "The 'appears in at least 2 interviews before it counts as a theme' rule is a standard qualitative-research safeguard against single-loud-customer bias, where one especially articulate or emotionally intense interview gets remembered and repeated internally as 'what customers think,' even when nobody else in the sample said anything close to it. Preserving verbatim quotes instead of paraphrasing them keeps the customer's own words available for later use in landing pages and outreach copy, since messaging built from a customer's actual phrasing consistently tests better than a founder's tidied-up summary of what they think the customer meant — the difference between 'I don't trust an app to tell me who's worse off, that's a judgment call' and a paraphrase like 'staff want more control over triage decisions' is the difference between copy that lands and copy that sounds like every other SaaS pitch. Refusing to round ambiguous or mixed evidence up to 'confirmed' directly counters the confirmation bias every founder brings into discovery interviews for an idea they're personally invested in — it is exactly the failure mode this synthesis step exists to catch, since a founder reading their own raw notes has every incentive to read supportive intent into an ambiguous quote, while a synthesis pass held to an explicit ambiguity rule doesn't get to make that call quietly on the founder's behalf.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-05' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Claude Sonnet 5 and Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'startup-pmf-signal-audit',
    category: 'startup',
    title:
      "Audit your product-market-fit signals honestly instead of eyeballing 'traction'",
    description:
      'Reads survey, retention, and channel-mix data through the Sean Ellis "very disappointed" threshold and retention-curve shape to produce an honest PMF verdict instead of a vibe.',
    promptText: `You are auditing product-market-fit signals honestly — the goal is an accurate read on where things actually stand, not a comforting one that makes the team feel better without changing anything.

CONTEXT
Company stage: {{company_stage}}
Sean Ellis "how would you feel if you could no longer use this product" survey results, if collected: {{survey_results_summary}}
Retention/cohort data: {{retention_data_summary}}
Growth channel mix (organic/referral vs. paid), if known: {{growth_channel_mix}}

SURVEY READ
If {{survey_results_summary}} is given, restate the percentage who said "very disappointed" without the product, and state plainly whether it clears the commonly cited ~40% threshold. Label this as a widely-used rule of thumb, not a guarantee of anything, and flag explicitly if the sample is too small to trust the percentage at all.

RETENTION CURVE READ
Read {{retention_data_summary}} for curve shape: does retention flatten after the initial drop-off (a "smile curve," the real PMF signal), or does it keep declining toward zero with no flattening (a "death spiral")? State which, and point to the specific numbers in the data that support your read rather than asserting a shape without evidence.

CHANNEL MIX READ
If {{growth_channel_mix}} is given, treat a rising organic/referral share against flat or falling paid spend as a secondary PMF signal, and paid-dependent growth with no organic pull as an absence of that signal. State which applies and why.

OVERALL VERDICT
Give one honest overall verdict — Strong signal / Mixed or early signal / No signal yet — and explicitly refuse to round a mixed result up to "we have PMF" just because some individual inputs looked good in isolation.

OUTPUT FORMAT
Four headed sections ending in one blunt verdict line, calibrated to {{company_stage}} rather than judged against a mature-company bar.`,
    variables: [
      {
        name: 'company_stage',
        description: 'Roughly where the company is',
        example: 'Seed stage, 10 months post-launch',
        required: true,
      },
      {
        name: 'survey_results_summary',
        description: 'Results of a Sean Ellis-style PMF survey, if you ran one',
        example:
          '95 responses: 31% very disappointed, 48% somewhat disappointed, 21% not disappointed',
        required: false,
      },
      {
        name: 'retention_data_summary',
        description: 'Cohort or usage retention numbers over time',
        example: 'Week 1: 100%, Week 2: 61%, Week 4: 44%, Week 8: 41%, Week 12: 40%',
        required: true,
      },
      {
        name: 'growth_channel_mix',
        description: 'Rough breakdown of where signups come from, if known',
        example:
          'Month 1: 85% paid ads / 15% organic. Month 5: 55% paid / 45% organic, paid spend flat',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'product-market-fit',
      'retention',
      'pmf-signals',
      'growth-metrics',
      'startups',
    ],
    whyItWorks:
      "This uses two specific, evidence-based PMF heuristics instead of a vibe check: the Sean Ellis survey's ~40% 'very disappointed' threshold — the benchmark Superhuman famously used to drive its own product roadmap toward PMF — and the retention-curve 'smile vs. death spiral' shape, the standard way growth teams distinguish real product-market fit (usage stabilizing among a core group) from a leaky bucket that only looks like growth because acquisition spend keeps refilling it from the top. The instruction to refuse rounding mixed signals up to 'we have PMF' directly targets founder motivated reasoning — self-assessed PMF calls are one of the most consistently over-optimistic judgments founders make about their own company, precisely because a 31% very-disappointed score and a retention curve that just barely started flattening are each individually easy to explain away on their own, and much harder to explain away side by side once both are stated plainly in the same short verdict. Calibrating the read to {{company_stage}} rather than a fixed universal bar also matters mechanically: a retention curve that hasn't flattened yet by week 12 reads very differently for a company 10 months post-launch than for one 3 years in with the same numbers, and a verdict that ignores stage entirely either panics an early team over noise that will resolve with more cohorts, or gives a mature team false comfort from a curve that should have flattened by now and hasn't.",
    exampleOutput: `Survey: 31% very disappointed — below the ~40% rule-of-thumb threshold, and 95 responses is a reasonable sample size to trust this read at seed stage.

Retention: Curve flattens from week 4 (44%) through week 12 (40%) — this reads as an early smile curve, not a death spiral, since it's stabilizing rather than continuing to decline toward zero.

Channel mix: Organic share rising (15% → 45%) while paid spend holds flat — a genuine secondary PMF signal, since it isn't just more ad spend producing more signups.

Verdict: Mixed / early signal. Retention and channel mix both point toward real pull, but the survey score alone doesn't clear the PMF threshold yet — treat this as promising for a company 10 months in, not confirmed.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-06' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Claude Sonnet 5 and ChatGPT GPT-5.1.',
      },
    ],
  },
  {
    slug: 'startup-founder-market-fit-narrative',
    category: 'startup',
    title:
      'Turn your background into a founder-market-fit story investors actually believe',
    description:
      "Builds a founder-market-fit narrative from only checkable facts in your background, with an explicit gap-check that refuses to manufacture an unfair advantage that isn't really there.",
    promptText: `You are helping build a founder-market-fit narrative from real, checkable facts — not a generic passion statement investors have already read a thousand times and now mildly distrust.

CONTEXT
Founder background: {{founder_background}}
Startup problem space: {{startup_problem_space}}
Unique insight or advantage, if you have one in mind: {{unique_insight_or_advantage}}
How you personally encountered this problem: {{how_you_learned_about_problem}}

FACT EXTRACTION
From {{founder_background}}, pull out only concrete, checkable facts — specific roles, years, projects, prior failures, credentials — that connect to {{startup_problem_space}}. Skip vague traits like "always passionate about" or "lifelong interest in" that can't actually be checked or falsified by anyone who asks a follow-up question.

THE CLAIM
Write the founder-market-fit claim as one sentence, built on the single strongest checkable fact, not the most flattering-sounding one — those are frequently not the same fact.

GAP CHECK
Identify what's missing. If the background doesn't yet show a real unfair advantage — deep domain expertise, unusual access to customers, a distribution edge, a credential that signals credibility to this specific market — say so plainly instead of manufacturing a connection that isn't really there just because the narrative would read better with it.

NARRATIVE PARAGRAPH
Write a 3-4 sentence narrative paragraph, suitable for a pitch deck team slide, built only from the facts established above — no invented achievements, and no rounding "worked adjacent to this industry" up to "spent a career in this industry."

OUTPUT FORMAT
Bullet list of checkable facts, one-sentence claim, a gap-check paragraph, then the narrative paragraph.`,
    variables: [
      {
        name: 'founder_background',
        description: 'Your relevant work history, roughly, in your own words',
        example:
          '5 years as an ER charge nurse, then 18 months as a clinical product manager at a hospital-ops software company',
        required: true,
      },
      {
        name: 'startup_problem_space',
        description: 'The problem your startup addresses',
        example: 'Manual patient triage in high-volume urgent care and ER settings',
        required: true,
      },
      {
        name: 'unique_insight_or_advantage',
        description:
          'Any specific insight or edge you think you have, if you have one in mind',
        example:
          'I know exactly which triage signals experienced nurses actually rely on versus what the standard intake form asks for',
        required: false,
      },
      {
        name: 'how_you_learned_about_problem',
        description: 'How you personally ran into this problem',
        example:
          'Ran triage myself on overnight ER shifts for 5 years before moving into software',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'founder-market-fit',
      'pitch-deck',
      'team-slide',
      'fundraising-narrative',
      'founders',
    ],
    whyItWorks:
      "Founder-market fit is a real, named diligence criterion — most seed-stage investors, YC included, weight 'why is this specific founder unusually positioned to win this market' as its own line item, separate from whether the idea itself is good. They've also heard generic passion framing so often ('I've always been passionate about healthcare') that it now functions as a mild negative signal rather than a positive one, because it's unfalsifiable and every applicant in the batch can say it about their own space with equal sincerity. Restricting the claim to checkable facts — a specific role, a specific prior project, a specific number of years doing the actual job — is what makes the narrative credible under a follow-up question, since an investor who asks 'what did that actually look like day to day' gets a real answer instead of a founder backpedaling from a claim that was rounded up. The explicit gap-check step matters just as much as the fact extraction: manufacturing an unfair advantage that doesn't really exist is easy to spot and expensive to a founder's credibility the moment an investor asks one clarifying question the story can't survive, and naming the gap honestly up front — 'no stated distribution advantage yet' — reads as more credible to a diligenced investor than a narrative that pretends every box is checked, because investors who've sat through hundreds of these know no founder actually has every advantage.",
    exampleOutput: `Checkable facts:
- 5 years as an ER charge nurse, personally running triage on overnight shifts
- 18 months as a clinical product manager at a hospital-ops software company, working on intake and workflow tools

One-sentence claim: This founder personally ran ER triage for 5 years, then spent 18 months building the exact category of software this startup now automates.

Gap-check: No stated distribution advantage into urgent care chains beyond personal network from the prior nursing and PM roles — worth naming honestly rather than implying a go-to-market edge that isn't established yet.

Narrative: Before building software, [Founder] spent 5 years as an ER charge nurse, personally running triage on overnight shifts when three patients walked in at once. They later spent 18 months as a clinical product manager building intake and workflow tools at a hospital-ops software company. [Company] exists because they've made these exact triage calls themselves and know precisely which signals experienced staff actually rely on.`,
    verifiedAgainst: [{ tool: 'Claude', version: 'Sonnet 5', date: '2026-08-07' }],
    changelog: [
      { date: '2026-08-07', note: 'Initial publish, verified against Claude Sonnet 5.' },
    ],
  },
  {
    slug: 'startup-cofounder-equity-split-framework',
    category: 'startup',
    title: 'Structure a cofounder equity conversation before resentment forces it',
    description:
      "Turns each cofounder's actual contributions — time, capital, IP, opportunity cost — into a reasoned equity split proposal with a standard vesting schedule, plus the exact talking points for the conversation nobody wants to have first.",
    promptText: `You are a startup formation advisor helping cofounders structure an equity split based on actual contributions, with standard vesting protection — not a comforting "let's just do 50/50 and not think about it" shortcut that tends to cause resentment later.

CONTEXT
Cofounders and their contributions (time commitment, capital put in, prior related work/IP, network or credibility brought, opportunity cost of what they gave up to join): {{cofounder_contributions}}
Company stage: {{company_stage}}
Any equity split already informally discussed or assumed: {{existing_assumption}}
Biggest source of tension or disagreement so far, if any: {{tension_point}}

CONTRIBUTION SCORING
For each cofounder in {{cofounder_contributions}}, score their contribution across the dimensions given — do not silently weight time commitment above everything else; state explicitly how you're weighing each dimension and why, since different startups reasonably weigh these differently (a capital-light idea weighs time and IP heavily; a capital-intensive one weighs the check written).

SPLIT PROPOSAL
Propose an equity split as percentages that sum to 100%, tied directly and traceably back to the scoring above — not a round number picked for how clean it looks. If {{existing_assumption}} conflicts with what the contributions actually support, name the conflict directly rather than quietly defaulting to whichever number keeps the peace.

VESTING STRUCTURE
Recommend a standard vesting schedule (typically 4 years, 1-year cliff) applied equally to all cofounders regardless of the split percentage, and explain in one sentence what problem the cliff specifically solves — a cofounder who leaves at month 2 keeping a large equity stake they never earned.

THE CONVERSATION
If {{tension_point}} is given, write 3-4 direct talking points for addressing it in the actual conversation — plain, non-confrontational language that names the disagreement instead of talking around it.

OUTPUT FORMAT
Contribution scoring table, split proposal with reasoning, vesting recommendation, then conversation talking points if applicable.`,
    variables: [
      {
        name: 'cofounder_contributions',
        description:
          'Each cofounder and what they bring — time, capital, IP, network, opportunity cost',
        example:
          'Founder A: full-time from day one, wrote the original product spec, no capital in. Founder B: part-time for first 6 months while finishing a prior job, put in $30,000 seed capital, brings 8 years of industry contacts.',
        required: true,
      },
      {
        name: 'company_stage',
        description: 'Roughly where the company is right now',
        example: 'Pre-incorporation, about to file, no product built yet',
        required: true,
      },
      {
        name: 'existing_assumption',
        description: 'Any split already assumed or half-discussed, if any',
        example:
          'We loosely said 50/50 when we started talking, before Founder B put in the $30,000',
        required: false,
      },
      {
        name: 'tension_point',
        description: 'The specific thing causing friction, if there is one',
        example:
          "Founder A feels the $30,000 shouldn't count as much since it was framed as a loan, not an investment, when it was first mentioned",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'cofounder-equity',
      'vesting',
      'startup-formation',
      'equity-split',
      'founders',
    ],
    whyItWorks:
      "Vesting with a standard 1-year cliff is industry-standard specifically because it solves a named, recurring failure mode — a cofounder who leaves after two months keeps a full, unearned equity stake forever, which is the single most common cause of a 'cofounder divorce' turning into a permanent cap-table problem rather than a clean parting. Scoring contributions explicitly across named dimensions, rather than defaulting straight to an even split, matters because equal splits decided without an actual conversation about who's giving up what are one of the most frequently cited sources of later cofounder resentment — not because equal splits are wrong, but because they're often chosen to avoid an uncomfortable conversation rather than because the contributions were actually equal, and the gap between those two reasons surfaces eventually, usually at the worst possible time. Naming the conflict directly when {{existing_assumption}} doesn't match what the contributions support — rather than quietly picking whichever number keeps the peace in the moment — is what makes the split durable: an equity agreement reached by avoiding the hard part is exactly the kind that gets silently resented and eventually re-litigated once the company is worth fighting over, whereas one reached by naming the disagreement openly, even briefly awkwardly, tends to actually hold. Providing literal talking points for the tension point turns an abstract framework into something a founder can actually use in the room, which matters because most cofounders who know they need this conversation still put it off indefinitely without a concrete script to start from.",
    exampleOutput: `Contribution scoring: Founder A — full-time from day one (high time weight), wrote the original spec (moderate IP weight), no capital. Founder B — part-time for 6 months (lower time weight), $30,000 capital (meaningful weight pre-product), 8 years of industry contacts (moderate network weight, real but unproven until it converts to an actual customer or hire).

Split proposal: 58% / 42% (A/B) — A's full-time commitment and original IP outweigh B's capital and network at this pre-product stage, but B's $30,000 and contacts are real enough that an extreme split (e.g. 80/20) wouldn't reflect them fairly.

Vesting: 4-year vesting, 1-year cliff, for both founders regardless of split — this protects both sides if either leaves in the first year before real value has been created, not just the founder with the larger stake.

Conversation talking points: "I want to separate the $30,000 conversation from the equity conversation — can we agree first on whether it's a loan or an investment, since that changes how it should count?" "Whatever we land on, I want both our stakes to vest the same way — this isn't about trusting you less, it protects both of us the same."`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-08' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against Claude Sonnet 5 and ChatGPT GPT-5.1.',
      },
    ],
  },
  {
    slug: 'startup-one-line-positioning-statement',
    category: 'startup',
    title: 'Build a one-line positioning statement that survives a follow-up question',
    description:
      "Runs April Dunford's five-component positioning method — competitive alternatives, unique attributes, value, best-fit customer, market category — before compressing it into one line, so the punchy version is a distillation, not a copywriting guess.",
    promptText: `You are a positioning strategist using the five-component method from April Dunford's "Obviously Awesome": competitive alternatives, unique attributes, value, best-fit customer characteristics, and market category. You build the full structure first — the one-liner comes last, as a compression of it, never as the starting point.

CONTEXT
Product: {{product_description}}
Who currently buys or shows real interest: {{current_customers}}
What they'd do instead if this didn't exist: {{competitive_alternatives}}
Any positioning already in use that isn't working, and why you suspect it: {{current_positioning_concern}}

COMPETITIVE ALTERNATIVES
State what {{competitive_alternatives}} names, or infer it if not given — this must include the real alternative, which for an early-stage product is very often doing nothing or a manual workaround, not just named competitors.

UNIQUE ATTRIBUTES AND VALUE
List what this product does that the alternatives genuinely don't, then translate each attribute into the value it produces for the customer — an attribute is a fact about the product; value is what that fact means for the buyer's actual outcome, and these are not interchangeable.

BEST-FIT CUSTOMER
From {{current_customers}}, identify the characteristics that make this value uniquely important to them specifically — not a demographic description, but the situational trait that explains why this customer cares about this value more than another customer would.

MARKET CATEGORY
Name the market category this positions into, and state explicitly why that category (not a broader or narrower one) sets the right expectations and the right comparison set in the buyer's head.

THE ONE-LINER
Only now, compress the four components above into one sentence a stranger could repeat back accurately after hearing it once. If {{current_positioning_concern}} is given, state plainly what about the structure above explains why the current positioning wasn't working.

OUTPUT FORMAT
Four headed components in the order above, then the one-liner as its own final line, with the current-positioning diagnosis if applicable.`,
    variables: [
      {
        name: 'product_description',
        description: 'What the product actually does',
        example:
          'Software that auto-generates dental insurance claim forms from clinic scheduling data',
        required: true,
      },
      {
        name: 'current_customers',
        description: 'Who currently buys it or has shown real interest',
        example:
          'Office managers at 3-8 dentist multi-location practices, not solo practitioners',
        required: true,
      },
      {
        name: 'competitive_alternatives',
        description: "What buyers would do instead if this didn't exist",
        example:
          'Manually re-typing claim data across their PMS and the insurer portal, or paying an outsourced billing service per claim',
        required: true,
      },
      {
        name: 'current_positioning_concern',
        description: "What you're currently saying, and why you suspect it's not landing",
        example:
          '"AI-powered dental billing platform" — prospects nod politely but don\'t follow up',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['positioning', 'messaging', 'go-to-market', 'branding', 'founders'],
    whyItWorks:
      "Forcing competitive alternatives to be named first, before any product attribute is listed, is the specific corrective April Dunford's method applies to how most positioning actually gets written — starting from the product and working outward, instead of starting from what the customer would otherwise do and working inward, which is why a phrase like '{{current_positioning_concern}}' can sound accurate and still land flat: it describes the product without ever establishing what the buyer is being asked to give up or compare it against. Requiring an attribute-to-value translation step catches a specific, common substitution: '{{product_description}}' is a fact about the product, but 'saves your office manager six hours a week of re-typing' is the value that fact produces, and a positioning statement that stops at the attribute level reads as a spec sheet rather than a reason to care, even when the underlying fact is genuinely impressive. Identifying best-fit customer characteristics — the situational trait that makes this value matter more to this buyer than another one, like running multiple locations versus a solo practice — is what prevents the generic 'for everyone with this problem' positioning that dilutes a message until it's memorable to no one; a positioning statement aimed at everyone is usually heard clearly by no one, because nobody recognizes themselves specifically in it. Building the one-liner last, as a compression of the four structural components rather than a copywriting exercise done up front, is what keeps the punchy version honest — a clever one-liner written before the underlying logic is settled tends to survive the entire process even after the logic underneath it changes, simply because nobody wants to throw away a line that already sounds good.",
    exampleOutput: `Competitive alternatives: Manually re-typing claim data across systems, or paying per-claim for an outsourced billing service.

Unique attributes → value: Auto-generates claim forms directly from scheduling data → office managers stop re-typing the same information across three systems, reclaiming hours per week.

Best-fit customer: Multi-location practices (3-8 dentists), where the re-typing burden multiplies across locations and a single office manager often handles billing for all of them — a solo practice feels this pain far less.

Market category: Dental billing automation, not "AI platform" — this sets the comparison set as billing services and manual processes, not a vague AI category with no clear alternative to be measured against.

One-liner: For multi-location dental practices drowning their office manager in repetitive claim data-entry, [Product] auto-generates claim forms straight from your scheduling system — no re-typing, no outsourced billing fee per claim.

Diagnosis: "AI-powered dental billing platform" never states the alternative it's replacing or names who specifically benefits most, so it reads as a category label rather than a reason to switch.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-05' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Claude Sonnet 5 and Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'startup-north-star-metric-selection',
    category: 'startup',
    title: 'Pick a North Star metric that leads value instead of just reporting revenue',
    description:
      "Selects a North Star metric that reflects value actually delivered, is owned by a real team, and names a stated countermetric — so it can't be quietly gamed the moment it becomes the thing everyone optimizes for.",
    promptText: `You are a growth strategist selecting a North Star metric — the single metric that best reflects the core value the product delivers to customers, chosen to be a leading indicator, not revenue reported after the fact.

CONTEXT
Product: {{product_description}}
The core value customers get when the product is working well for them: {{core_value_delivered}}
Candidate metrics already being considered, if any: {{candidate_metrics}}
Team(s) that would actually own moving this metric: {{owning_teams}}

LEADING VS LAGGING CHECK
Evaluate {{candidate_metrics}} (or propose new candidates from {{core_value_delivered}} if none given) against one rule: does the metric move before revenue does, as a cause of value delivered, or does it just restate revenue in different units after the fact? Eliminate anything that's a lagging financial outcome dressed up as a North Star.

ACTIONABILITY CHECK
For each surviving candidate, name specifically which team in {{owning_teams}} could move it through their own work within a quarter. A metric no team can actually act on directly is a reporting number, not a North Star, regardless of how well it correlates with value.

FINAL SELECTION
Select one metric and state it as a specific, countable definition — not "engagement" but a stated action, count, and time window (e.g. "number of accounts completing X within Y days of signup").

COUNTERMETRIC
Name one countermetric that would catch the North Star metric being gamed — improved on paper while something that actually matters quietly gets worse (e.g. volume rising while quality or retention falls). State what pairing this countermetric protects against specifically.

OUTPUT FORMAT
Four headed sections: Leading vs Lagging Check, Actionability Check, Final Selection (with exact definition), Countermetric.`,
    variables: [
      {
        name: 'product_description',
        description: 'What the product does',
        example: 'A shift-scheduling app for restaurant managers',
        required: true,
      },
      {
        name: 'core_value_delivered',
        description:
          'What the customer actually gets when the product is working well for them',
        example:
          'Managers spend less time building schedules and have fewer last-minute uncovered shifts',
        required: true,
      },
      {
        name: 'candidate_metrics',
        description: 'Metrics already on the table, if any',
        example:
          'Monthly active managers, total shifts scheduled, MRR, number of shift-swap requests approved',
        required: false,
      },
      {
        name: 'owning_teams',
        description:
          'The team(s) that would actually be responsible for moving this metric',
        example:
          'Product team (scheduling UX) and a small customer success team (onboarding)',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['north-star-metric', 'growth-metrics', 'okrs', 'product-strategy', 'startups'],
    whyItWorks:
      "The leading-versus-lagging rule is the actual mechanic distinguishing a North Star metric from a revenue dashboard wearing a growth-strategy label — the whole point of North Star metric literature, from Slack's messages-sent-per-team to Facebook's early '7 friends in 10 days,' is that these are metrics which move before revenue does, as a cause of retained value rather than a restatement of it, so a candidate like MRR fails this check immediately even though it's the number leadership probably cares about most in a board meeting. The actionability check — naming which specific team in {{owning_teams}} could move the metric through their own work within a quarter — matters because a metric no one owns is a number people watch, not a number people act on; if the answer to 'whose job is it to move this' is genuinely unclear, the metric will get reported quarter after quarter with no real intervention behind its movement, which defeats the purpose of picking a North Star at all. The countermetric requirement targets Goodhart's Law directly — any single metric an organization optimizes hard enough eventually gets gamed in a way that improves the number while quietly damaging something the number was supposed to be a proxy for, and the classic example here is exactly the kind of thing {{candidate_metrics}} might include: total shifts scheduled can rise because scheduling got genuinely easier, or because managers are now scheduling more redundant shifts to route around a bug, and only a paired countermetric like uncovered-shift rate or manager churn would catch the difference before it shows up as a real problem months later.",
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' }],
    changelog: [
      { date: '2026-08-04', note: 'Initial publish, verified against ChatGPT GPT-5.1.' },
    ],
  },
  {
    slug: 'startup-churn-exit-interview-synthesis',
    category: 'startup',
    title:
      'Find out why customers actually left, not just which canned reason they clicked',
    description:
      'Synthesizes churned-customer exit notes by categorizing free-text reasons and separating never-activated churn from used-then-quit churn — the two need different fixes, and lumping them together produces mushy insight.',
    promptText: `You are synthesizing churn exit interviews and cancellation notes. Your job is to categorize what customers actually said in their own words, not to default to whichever canned multiple-choice reason they happened to click on their way out the door.

CONTEXT
Number of churned customers in this batch: {{number_of_churned_customers}}
Raw exit notes/interview transcripts, labeled by customer if possible: {{churn_notes}}
Canned cancellation-flow reasons selected, if collected separately from free text: {{canned_reasons_selected}}
Time each customer was active before churning, if known: {{tenure_before_churn}}

ACTIVATION SPLIT
First split the batch into two groups using {{tenure_before_churn}} and the notes: customers who never meaningfully activated (never reached real usage of the core value) versus customers who used the product for a real stretch and then quit. These are different problems — one is an onboarding failure, the other is a retention failure — and must be analyzed and reported separately, never merged into one combined churn theme.

FREE-TEXT OVER CANNED
For each group, extract the real reason from the free-text notes in {{churn_notes}}, not from {{canned_reasons_selected}} alone — a canned reason list anchors people toward whichever option is easiest to click, and the free text underneath frequently tells a different, more specific story. Where the canned reason and the free text disagree, report the free text as the primary signal and note the mismatch explicitly.

PATTERN RULE
Within each group, promote a reason to a real theme only if it appears in at least 2 customers' notes. A single vivid, detailed complaint is not a pattern by itself — label it "Isolated case" and keep it visible without treating it as representative of the batch.

OUTPUT FORMAT
Two headed groups (Never Activated, Used-Then-Quit), each with themes (count + representative quotes) and isolated cases, plus a short note on any canned-reason mismatches found.`,
    variables: [
      {
        name: 'number_of_churned_customers',
        description: 'How many churned customers this batch covers',
        example: '14',
        required: true,
      },
      {
        name: 'churn_notes',
        description: 'Raw exit notes or transcripts, ideally labeled by customer',
        example:
          'Customer 3 (active 11 weeks): "It worked fine, honestly, I just realized I was the only one on my team still using it after the new hire started"...\nCustomer 7 (active 2 days): "Never got past connecting our POS, gave up"...',
        required: true,
      },
      {
        name: 'canned_reasons_selected',
        description:
          'The dropdown/checkbox reason each customer selected on their way out, if collected',
        example:
          'Customer 3 selected "Too expensive." Customer 7 selected "Missing a feature I needed."',
        required: false,
      },
      {
        name: 'tenure_before_churn',
        description: 'How long each customer was active before cancelling, if known',
        example: 'Customer 3: 11 weeks. Customer 7: 2 days.',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: [
      'churn-analysis',
      'retention',
      'customer-research',
      'exit-interviews',
      'startups',
    ],
    whyItWorks:
      "Many churn exit surveys default to a multiple-choice reason list, and that list has a documented and specific bias: it anchors respondents toward whichever option is closest to their actual reason without being it exactly, because clicking a close-enough checkbox takes ten seconds and explaining the real, more complicated story takes longer than a departing customer is willing to spend — which is exactly why {{canned_reasons_selected}} and the free text underneath it frequently disagree, and why the prompt treats the free text as the primary signal rather than the canned click. Separating never-activated churn from used-then-quit churn matters because these are structurally different problems needing different fixes: a customer who never got past connecting their POS has an onboarding failure, and a customer who used the product for 11 weeks and then quit because their team stopped needing it has a retention or product-fit failure — lumping both into one 'churn reasons' theme produces a mushy, average-of-two-different-problems insight that doesn't point clearly at fixing either one. The n≥2 pattern rule applied to negative signal specifically matters because churn stories are unusually easy to over-react to — a single vivid, detailed complaint about a missing feature reads as urgent and specific in a way that makes it tempting to treat as representative, but without the same discipline applied to positive-signal synthesis (require at least 2 independent instances before calling it a theme), a team can end up rebuilding a roadmap around one departing customer's particularly well-articulated complaint.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-03' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Claude Sonnet 5 and ChatGPT GPT-5.1.',
      },
    ],
  },
  {
    slug: 'startup-first-hire-scorecard',
    category: 'startup',
    title: 'Write a first-hire scorecard before you write the job posting',
    description:
      'Builds a Who-style scorecard — mission, measurable outcomes, then competencies — and behavioral interview questions tied to each outcome, so the hiring bar exists in writing before a single resume gets read.',
    promptText: `You are a hiring advisor using the "Who: The A Method for Hiring" scorecard approach — the scorecard is written before the job posting, and outcomes come before competencies, never the reverse.

CONTEXT
Role being hired: {{role_title}}
What this hire needs to have accomplished 12 months from now for the hire to be a clear success: {{success_definition}}
Company stage/team size right now: {{company_stage}}
Traits or background you're currently assuming you want, if any: {{assumed_traits}}

MISSION
Write a one-sentence mission for the role — why it exists, tied directly to {{success_definition}}, not a generic responsibility description copied from a similar job posting elsewhere.

OUTCOMES
Write 3-4 specific, measurable outcomes this person must deliver in their first year, each with a number or a checkable state, not a vague responsibility ("owns marketing") — an outcome should be specific enough that you and this hire would agree in twelve months on whether it happened.

COMPETENCIES
Only after the outcomes are set, list the 4-6 competencies required to actually deliver them. If {{assumed_traits}} includes something that doesn't clearly trace back to one of the outcomes above, flag it as an assumption worth questioning rather than silently including it because it felt obviously relevant.

BEHAVIORAL INTERVIEW QUESTIONS
For each competency, write one behavioral question asking for a specific past instance ("tell me about a time you...") rather than a hypothetical ("what would you do if..."), plus a one-line answer to look for that would count as a strong signal versus a weak one.

SCORING RUBRIC
Give a 1-4 scoring anchor for each competency (1 = clear miss, 4 = clear exceptional) written before any interview happens, so a score can't be reverse-engineered from how much an interviewer liked the candidate personally.

OUTPUT FORMAT
Mission, Outcomes, Competencies (with the assumed-trait flag if applicable), then a table of behavioral questions with signal notes and the 1-4 rubric.`,
    variables: [
      {
        name: 'role_title',
        description: 'The role being hired',
        example: 'First customer success hire',
        required: true,
      },
      {
        name: 'success_definition',
        description:
          'What this hire needs to have accomplished in 12 months for it to be a clear success',
        example:
          'Onboarding time for a new clinic cut from 3 weeks to under 1 week, and churn among onboarded clinics under 5%',
        required: true,
      },
      {
        name: 'company_stage',
        description: 'Roughly where the company is and how big the team is now',
        example: '9 paying clinics, 4-person team, no dedicated CS function yet',
        required: true,
      },
      {
        name: 'assumed_traits',
        description: "Traits or background you're currently assuming you want, if any",
        example: 'Healthcare industry background, prior startup experience',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['hiring', 'scorecard', 'structured-interviews', 'team-building', 'founders'],
    whyItWorks:
      "Writing outcomes before competencies is the actual mechanic from the scorecard method that prevents a common and specific hiring failure — backfilling a job description around a personality the founder liked in an interview, rather than defining what success looks like first and then hiring for the traits that would actually produce it; without the outcomes-first order, it's easy to fall in love with a candidate's energy in a conversation and only notice months later that they were never actually equipped to hit the number that mattered. Requiring behavioral questions tied to specific past instances instead of hypothetical questions closes a gap in the interview process that mirrors the Mom Test problem in customer discovery: 'what would you do if a clinic threatened to churn' invites a flattering, rehearsed answer about what the candidate would ideally do, while 'tell me about a specific time a customer threatened to churn and what you actually did' can only be answered with something that really happened, which is a far more reliable predictor of how this person behaves under real pressure. Writing the 1-4 scoring rubric before the interview happens — with anchors defined in advance for what a 1 versus a 4 actually looks like — is what stops a specific and well-documented bias in unstructured hiring: an interviewer who liked a candidate personally will unconsciously score their answers more generously across every competency, and a rubric written and anchored before the conversation starts is what keeps a likable but under-qualified answer from getting graded up after the fact to match a gut feeling that formed in the first five minutes.",
    exampleOutput: `Mission: Own the onboarding-to-retention journey for every new clinic, so time-to-value drops and early churn stays rare.

Outcomes: Cut median onboarding time from 3 weeks to under 1 week within 6 months. Keep 12-month churn among onboarded clinics under 5%. Build a repeatable onboarding checklist usable without the founder's direct involvement within 90 days.

Competencies: Process design under ambiguity, direct customer communication under pressure, data literacy (can read a churn signal before it becomes a cancellation). Flagged assumption: "Healthcare industry background" doesn't clearly trace to any outcome above — worth testing for aptitude and communication style instead of requiring industry tenure specifically.

Sample question (process design): "Tell me about a time you built a repeatable process from scratch with no existing template to follow." Strong signal: names a specific ambiguous starting point and a concrete first version they shipped, not a "we workshopped it as a team" answer with no ownership.

Rubric: 1 = describes a process someone else designed. 4 = designed and iterated a process solo, with a measurable before/after.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-06' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Claude Sonnet 5 and ChatGPT GPT-5.1.',
      },
    ],
  },
  {
    slug: 'startup-board-meeting-deck-structure',
    category: 'startup',
    title: 'Structure a board meeting deck the room can actually use to make decisions',
    description:
      "Separates a board deck into metrics-for-reading versus decisions-needing-input, so the meeting itself is spent on the questions that actually need the board's judgment rather than a live narration of numbers they could have read beforehand.",
    promptText: `You are helping structure a board meeting deck built to be sent and read in advance — the meeting itself is for discussion and decisions, not a live narration of numbers the board could have absorbed on their own.

CONTEXT
Company: {{company_name}}
Period since last board meeting: {{reporting_period}}
Key metrics and trend: {{key_metrics}}
Wins and challenges since last meeting: {{wins_and_challenges}}
Specific decisions that actually need board input or a vote at this meeting: {{decisions_needing_input}}

METRICS DASHBOARD (FOR ASYNC READING)
Lay out {{key_metrics}} as a compact dashboard with trend arrows and one-line context per metric — written to be understood without anyone narrating it live, since the deck goes out at least 48 hours before the meeting and board members are expected to have read it.

WINS AND CHALLENGES (FOR ASYNC READING)
Summarize {{wins_and_challenges}} the same way — specific facts, not narrative buildup — clearly separated from the dashboard, and explicitly not requiring live walkthrough time in the actual meeting.

DECISIONS NEEDING BOARD INPUT (THE ACTUAL MEETING AGENDA)
For each item in {{decisions_needing_input}}, write: the decision framed as a specific question the board needs to answer, the options genuinely on the table, your recommendation and why, and what happens if no decision gets made today. This section is the real meeting agenda — everything above it exists so the meeting doesn't have to spend time on it.

FOLLOW-UP OWNERSHIP
For any decision made or action agreed to, note that it needs an explicit owner and a deadline captured in the meeting notes — flag this as a structural requirement of the deck's follow-up section, not an afterthought bolted on if there's time.

OUTPUT FORMAT
Three sections: Metrics Dashboard, Wins & Challenges, Decisions Needing Board Input (as the clear focal point), plus a one-line reminder that follow-ups need a named owner and deadline.`,
    variables: [
      {
        name: 'company_name',
        description: 'Your company name',
        example: 'Triagely',
        required: true,
      },
      {
        name: 'reporting_period',
        description: 'The period this board meeting covers',
        example: 'Since the last meeting, 10 weeks ago',
        required: true,
      },
      {
        name: 'key_metrics',
        description: 'Core metrics with trend since last meeting',
        example:
          'MRR $58k → $71k, paying clinics 9 → 12, cash on hand $410k, monthly burn $62k',
        required: true,
      },
      {
        name: 'wins_and_challenges',
        description: 'Specific facts worth the board knowing, good and bad',
        example:
          'Won a 5-location regional group; lost 1 clinic to a competitor on price; second engineer hire fell through after an offer decline',
        required: true,
      },
      {
        name: 'decisions_needing_input',
        description:
          'The actual questions you need the board to weigh in on or vote on this meeting',
        example:
          'Whether to extend runway by pausing the second engineer hire for a quarter, or raise a small bridge now while metrics are strong',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'board-meetings',
      'investor-relations',
      'governance',
      'founder-communication',
      'startups',
    ],
    whyItWorks:
      "Sending the deck in advance for async reading, rather than narrating it live, is a specific practice top-tier boards and VCs consistently push founders toward, because reading numbers out loud in the room wastes the one scarce resource a board meeting actually has — shared time for judgment calls only the board can make — on information transfer that a PDF sent 48 hours earlier accomplishes just as well without anyone's attention in the room. Explicitly separating 'decisions needing board input' from the metrics and wins-and-challenges sections forces the founder to know in advance exactly what they need from this specific meeting, rather than delivering a rambling update and hoping useful feedback emerges organically — a board that knows walking in that today's real agenda item is 'pause a hire versus raise a bridge' can actually prepare a position, while a board ambushed with that framing live in the room is far more likely to stall on a decision that needed a clear answer that day. Requiring a stated recommendation and a stated consequence of no decision for each agenda item — not just laying out options neutrally — matters because boards that are asked an open question with no anchor tend to default to more discussion and less decision, whereas a founder who states a recommendation gives the board something concrete to agree with, push back on, or amend, which is a fundamentally faster path to an actual resolution than an open-ended prompt for the room's opinion. Requiring a named owner and deadline on every follow-up addresses the most common way a board meeting fails silently — good discussion happens, a direction gets loosely agreed on, and then nothing changes before the next meeting because no single person was actually on the hook for the next step.",
    verifiedAgainst: [{ tool: 'Claude', version: 'Sonnet 5', date: '2026-08-05' }],
    changelog: [
      { date: '2026-08-05', note: 'Initial publish, verified against Claude Sonnet 5.' },
    ],
  },
  {
    slug: 'startup-runway-burn-rate-scenario-planning',
    category: 'startup',
    title:
      "Model runway scenarios with a trigger you'll actually act on, not just a number to watch",
    description:
      'Turns cash balance, burn, and revenue assumptions into 2-3 runway scenarios with a pre-committed action trigger for each — arithmetic and scenario modeling only, explicitly not financial or investment advice.',
    promptText: `You are modeling cash runway scenarios. You compute the arithmetic and lay out the scenarios clearly. You do not tell the founder which scenario to choose or whether to raise money — that decision depends on context you don't have.

CONTEXT
Current cash balance: {{cash_balance}}
Current monthly burn (net cash out): {{monthly_burn}}
Revenue growth assumption(s) you want modeled, stated as a range if uncertain: {{revenue_growth_assumptions}}
Cost changes under consideration (hire, cut, pause): {{cost_changes_under_consideration}}

BASELINE RUNWAY
Compute current runway in months as cash balance divided by current monthly burn, stated plainly with the exact arithmetic shown, not just the resulting number.

SCENARIO TABLE
Build 2-3 scenarios using {{cost_changes_under_consideration}} and {{revenue_growth_assumptions}} — for example, a base case (no changes), an aggressive-hiring case, and a cost-freeze case. For each, show resulting monthly burn, resulting runway in months, and which single input assumption the scenario is most sensitive to (the one that, if wrong, changes the runway number the most).

PRE-COMMITTED TRIGGERS
For each scenario, state a specific, numeric trigger that would mean switching plans — e.g. "if monthly burn exceeds X" or "if runway drops below Y months" — decided now, in advance, rather than left to be judged in the moment when the number arrives alongside every other pressure of that month.

SENSITIVITY FLAG
Name explicitly which single assumption across all scenarios the runway numbers are most fragile to, and state in one sentence what a 20% miss on that specific assumption would do to the runway figure — this is arithmetic, not a prediction of whether the miss will happen.

MANDATORY CLOSING LINE
End with this exact line, unmodified: "These are scenario calculations only, not financial or investment advice — validate assumptions with your own numbers before acting on any trigger."

OUTPUT FORMAT
Baseline Runway, Scenario Table, Pre-Committed Triggers, Sensitivity Flag, then the mandatory closing line.`,
    variables: [
      {
        name: 'cash_balance',
        description: 'Current cash on hand',
        example: '$410,000',
        required: true,
      },
      {
        name: 'monthly_burn',
        description: 'Current net monthly cash burn',
        example: '$62,000',
        required: true,
      },
      {
        name: 'revenue_growth_assumptions',
        description: 'Your revenue growth assumption, ideally as a range',
        example: 'MRR growing 6-10% month over month, currently at $71,000',
        required: true,
      },
      {
        name: 'cost_changes_under_consideration',
        description: "Specific hires, cuts, or pauses you're weighing",
        example:
          'A second engineer hire at $11,000/month fully loaded, currently paused pending this decision',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['runway', 'burn-rate', 'financial-planning', 'scenario-planning', 'startups'],
    whyItWorks:
      "Computing runway as cash divided by burn is pure arithmetic, while deciding whether to cut costs, keep hiring, or go raise is a strategic judgment call the model has no standing to make — the same mechanical-versus-judgment separation that keeps a term-sheet mechanics explainer honest applies here just as directly, and the mandatory closing line exists for the same reason: to keep a scenario calculation from silently drifting into advice about which scenario a founder should actually choose. Requiring a pre-committed numeric trigger for each scenario — decided now, before the month arrives — is the same logic behind pre-committing a GTM test's pass/fail metric: a founder staring at a live cash balance in a stressful month, with payroll due and hope that revenue growth will accelerate, is a much worse judge of when to act than the same founder modeling scenarios calmly today, and a trigger fixed in advance removes the temptation to keep hoping past the point the numbers already answered the question. Modeling multiple scenarios against a stated range for {{revenue_growth_assumptions}}, rather than a single point estimate, surfaces exactly how fragile the runway number is to the input most likely to be wrong — a single-point projection built on one optimistic growth number gives false precision and hides how much of the runway figure is actually riding on that one unproven assumption, whereas naming the sensitivity explicitly (what a 20% miss on growth does to the number) turns an invisible risk into a visible one the founder can actually plan around instead of discovering three months late.",
    exampleOutput: `Baseline runway: $410,000 ÷ $62,000/month ≈ 6.6 months at current burn.

Scenarios:
- Base case (no hire, current burn): runway ≈ 6.6 months. Most sensitive to revenue growth holding at 6%+ MoM.
- Hire case (+$11,000/month): burn → $73,000/month, runway ≈ 5.6 months. Most sensitive to whether the hire accelerates revenue enough to offset the added burn within 2-3 months.
- Cost-freeze case (defer hire, cut $8,000/month elsewhere): burn → $54,000/month, runway ≈ 7.6 months. Least sensitive to revenue assumptions of the three.

Triggers: Hire case — reconsider if MoM growth drops below 5% for two consecutive months. Base case — treat runway dropping below 5 months as the point to revisit hiring plans regardless of sentiment at the time.

Sensitivity: All three scenarios are most fragile to the revenue growth assumption; a 20% miss on 8% MoM growth (i.e., actual growth near 6.4%) would shrink runway by roughly 3-4 weeks across every scenario over a 6-month horizon.

These are scenario calculations only, not financial or investment advice — validate assumptions with your own numbers before acting on any trigger.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against ChatGPT GPT-5.1 and Claude Sonnet 5.',
      },
    ],
  },
  {
    slug: 'startup-icp-definition-from-deals',
    category: 'startup',
    title:
      'Define your ideal customer profile from actual deals, not an imagined persona',
    description:
      'Builds an ICP from patterns in closed-won deals contrasted against closed-lost and churned ones, expressed as concrete filters a salesperson could apply to a new lead in seconds, not an abstract description.',
    promptText: `You are defining an Ideal Customer Profile from actual deal outcomes — won, lost, and churned — not from an imagined persona nobody has checked against real data.

CONTEXT
Closed-won deals, with whatever detail you have (size, industry, team size, use case, how they found you): {{closed_won_deals}}
Closed-lost deals, with detail on why they didn't close: {{closed_lost_deals}}
Churned customers after signing, with whatever detail you have: {{churned_customers}}
Current ICP description, if you have one, and why you suspect it's too broad or off: {{current_icp_description}}

WON-DEAL PATTERN
From {{closed_won_deals}}, extract the characteristics that repeat across multiple won deals — not every individual deal's story, but the pattern that shows up more than once. Distinguish firmographic traits (size, industry, structure) from behavioral traits (how they evaluated, what triggered urgency).

LOST/CHURNED NEGATIVE PATTERN
From {{closed_lost_deals}} and {{churned_customers}}, extract what these have in common that the won deals don't — this is the disqualifying signal, the segment that looks similar on paper to a good-fit customer but reliably doesn't close or doesn't stick. State it as plainly as the positive pattern, since a founder's instinct is often to explain away lost deals individually rather than look for the pattern across them.

ICP AS FILTERS
Express the resulting ICP as concrete, checkable filters a salesperson could apply to a brand-new inbound lead within 30 seconds — specific size ranges, specific role titles, specific triggering situations — not an abstract paragraph description. If a filter can't be checked quickly against a real lead, rewrite it until it can.

CURRENT-ICP GAP CHECK
If {{current_icp_description}} is given, state plainly what it's getting wrong against the actual deal pattern — too broad, too narrow, or anchored on the wrong trait entirely — rather than a soft "mostly right, with some tweaks" verdict if the data says otherwise.

OUTPUT FORMAT
Won-Deal Pattern, Lost/Churned Negative Pattern, ICP as Filters (a short checkable list), Current-ICP Gap Check if applicable.`,
    variables: [
      {
        name: 'closed_won_deals',
        description: 'Your actual won deals with whatever detail you have',
        example:
          '12 dental practices, all multi-location (3-8 dentists), all found us through a billing-software-vendor partnership, all cited "staff time" as the buying trigger',
        required: true,
      },
      {
        name: 'closed_lost_deals',
        description: "Deals that didn't close, with why if known",
        example:
          "7 solo-practice dentists, most said price was too high for one dentist's claim volume",
        required: true,
      },
      {
        name: 'churned_customers',
        description: 'Customers who signed and then churned, with detail if available',
        example:
          '2 multi-location practices churned within 3 months — both had already outsourced billing to a service and only tried us as a side experiment',
        required: false,
      },
      {
        name: 'current_icp_description',
        description: 'Your current ICP description, if you have one written down',
        example:
          '"Dental practices looking to save time on billing" — feels too broad given how the actual deals have gone',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: ['ideal-customer-profile', 'icp', 'sales-strategy', 'segmentation', 'founders'],
    whyItWorks:
      "Building the ICP from patterns in actual won deals, instead of an imagined persona, is the standard antidote to the vague ICP most early-stage founders default to — 'anyone with this problem' — which sounds inclusive but is functionally useless to a salesperson trying to prioritize a lead list, because it doesn't exclude anything and therefore doesn't actually filter. Explicitly mining {{closed_lost_deals}} and {{churned_customers}} for a shared negative pattern matters just as much as the positive pattern, because founders have a strong instinct to explain away each lost deal individually — 'that one just had a weird budget cycle,' 'that one's manager was difficult' — rather than notice that seven individually-explained losses share the same underlying trait (in the example, single-dentist practices with low claim volume), and a negative pattern spotted across a whole batch is far more reliable than any single deal's post-mortem story. Requiring the ICP to be expressed as filters a salesperson could apply within 30 seconds, rather than an abstract paragraph, is what keeps it actionable instead of decorative — an ICP description that takes real interpretation to apply to a new lead will get applied inconsistently or not at all under sales pressure, while a checklist of specific, concrete traits gets used the same way every time regardless of who's doing the qualifying or how busy their week is.",
    exampleOutput: `Won-deal pattern: Multi-location practices (3-8 dentists), found via billing-software-vendor partnership, buying trigger was staff time saved — not price-driven.

Lost/churned negative pattern: Solo practices with low claim volume find the price hard to justify; multi-location practices that already outsource billing to a service treat the product as a side experiment and churn once the novelty wears off.

ICP as filters: 3+ dentist locations. Currently doing billing in-house (not already outsourced). Came in via a partnership or referral, not cold self-serve signup. Cites staff time, not price, as the stated pain in the first call.

Current-ICP gap: "Dental practices looking to save time on billing" is too broad on two axes — it doesn't exclude solo practices (which lose on price) or already-outsourced practices (which churn as side experiments), both of which the deal data clearly separates out.`,
    verifiedAgainst: [{ tool: 'Claude', version: 'Sonnet 5', date: '2026-08-04' }],
    changelog: [
      { date: '2026-08-04', note: 'Initial publish, verified against Claude Sonnet 5.' },
    ],
  },
  {
    slug: 'startup-yc-application-essay-tightening',
    category: 'startup',
    title: 'Tighten an accelerator application essay down to specific, checkable claims',
    description:
      'Rewrites raw application notes into concrete, number-backed answers inside a hard character limit, flagging buzzword phrases and vague market-size claims that reviewers screen out on sight.',
    promptText: `You are tightening a startup accelerator application essay (YC-style short-answer format). Every claim must be checkable — a specific noun, number, or named fact — never a phrase that sounds impressive but says nothing verifiable.

CONTEXT
Application question: {{application_question}}
Raw notes/draft answer: {{raw_draft_answer}}
Hard character or word limit: {{character_limit}}
Facts you're confident are accurate and can defend if asked: {{confirmed_facts}}

BUZZWORD SCAN
Scan {{raw_draft_answer}} for phrases that sound impressive but carry no checkable content — "game-changing," "revolutionary," "massive market," "disrupting," "cutting-edge," "passionate about" — and either replace each one with a specific fact from {{confirmed_facts}} or remove it entirely if no fact supports it. A reviewer who has read thousands of these applications screens these phrases out reflexively, not because the phrase is inherently bad, but because it's the specific pattern that signals an applicant is filling space instead of stating something real.

CONCRETENESS CHECK
For every remaining sentence, ask whether it contains a specific noun or number a reviewer could ask a follow-up question about. If a sentence would survive being deleted with no loss of information, delete it — every remaining word needs to be doing real work under the character limit.

LIMIT DISCIPLINE
Rewrite the answer to fit inside {{character_limit}}, prioritizing the most specific and most surprising fact first — the fact most likely to make a reviewer stop skimming — rather than a chronological or narrative ordering that saves the strongest point for last.

HONESTY CHECK
Flag anything in the tightened draft that goes beyond what {{confirmed_facts}} actually supports, even if it reads well — an application answer that oversells past what the founder can defend in a follow-up interview is worse than a shorter, more modest one that's entirely accurate.

OUTPUT FORMAT
Buzzword scan results (before/after), the tightened final answer fitting {{character_limit}} exactly, and an honesty-check note.`,
    variables: [
      {
        name: 'application_question',
        description: 'The exact application question being answered',
        example:
          'What is your company going to make? Please describe your product and what it does or will do.',
        required: true,
      },
      {
        name: 'raw_draft_answer',
        description: 'Your current draft, unedited',
        example:
          'We are building a revolutionary AI-powered platform that will disrupt the massive dental billing industry by using cutting-edge machine learning to transform how clinics handle insurance claims.',
        required: true,
      },
      {
        name: 'character_limit',
        description: 'The hard limit for this answer',
        example: '250 characters',
        required: true,
      },
      {
        name: 'confirmed_facts',
        description:
          'Specific facts you can actually defend if asked a follow-up question',
        example:
          'Auto-generates dental insurance claim forms from scheduling data; 12 paying multi-location practices; cuts claim processing time from ~40 to ~12 minutes per claim',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'accelerator-application',
      'yc-application',
      'fundraising',
      'pitch-writing',
      'founders',
    ],
    whyItWorks:
      "YC's own widely-shared public advice on application essays repeatedly flags concrete, specific answers over generic ones as the single biggest differentiator between applications that get a callback and applications that don't, and this prompt operationalizes that advice mechanically rather than leaving it as a vague style note the founder has to interpret themselves — every remaining sentence has to survive a specific, checkable test rather than just 'sounding' more concrete. Flagging buzzword phrases like 'revolutionary' and 'massive market' targets a documented, specific failure pattern reviewers see over and over in the exact same wording across thousands of applications, and they screen it out on sight not because the phrase itself is inherently disqualifying, but because it reliably signals an applicant reaching for impressive-sounding language in place of a fact they don't actually have yet — replacing it with a real number from {{confirmed_facts}} (12 paying practices, a 40-to-12-minute time cut) says something a competitor's buzzword-filled answer can't. Enforcing the hard {{character_limit}} rather than producing overflow text that gets trimmed later mirrors the actual constraint of the application itself, forcing the same prioritization decision under the same pressure a founder would face writing it directly — which fact goes first, what gets cut — instead of writing generously and hoping an edit pass catches the excess, which is exactly how vague filler survives into a final submission. The honesty check closing the process matters because a tightened, punchier answer is also an easier one to accidentally oversell past what {{confirmed_facts}} supports, and an application claim that can't survive a follow-up interview question does more damage to credibility than a shorter, less impressive-sounding answer that's fully accurate.",
    exampleOutput: `Buzzword scan: "revolutionary," "disrupt," "massive," "cutting-edge" all flagged — none are supported by a specific fact in the draft.

Tightened answer (fits 250 characters): "We auto-generate dental insurance claim forms directly from clinic scheduling data. 12 multi-location practices pay us today; one cut claim processing from 40 minutes to 12 minutes per claim."

Honesty check: No claims beyond confirmed facts — "12 paying practices" and the 40-to-12-minute figure are both directly from {{confirmed_facts}} and defensible in a follow-up interview.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-07' }],
    changelog: [
      { date: '2026-08-07', note: 'Initial publish, verified against ChatGPT GPT-5.1.' },
    ],
  },
  {
    slug: 'startup-cap-table-dilution-scenario-explainer',
    category: 'startup',
    title:
      'See what multiple funding rounds actually do to your ownership, not just this one',
    description:
      'Models founder dilution across sequential future rounds, including the option-pool refresh mechanic that hits existing shareholders specifically — mechanics and arithmetic only, explicitly not investment advice.',
    promptText: `You are modeling cap table dilution mechanics across multiple future funding rounds. You compute what each round does to ownership percentages. You do not advise on whether to raise, at what valuation, or whether a given amount of dilution is acceptable — that depends on context you don't have.

CONTEXT
Current cap table (holder: percentage): {{current_cap_table}}
Planned or hypothetical future rounds, each with a raise amount and pre-money valuation: {{planned_future_rounds}}
Whether an option pool refresh is planned at any of these rounds, and its target size: {{option_pool_refresh_plan}}
Specific question about dilution you actually want answered: {{specific_dilution_question}}

SINGLE-ROUND MECHANICS
For the first round in {{planned_future_rounds}}, show the arithmetic: new investor ownership = raise ÷ post-money valuation (pre-money + raise), and the resulting dilution to every existing holder in {{current_cap_table}}, proportional to their current stake unless {{option_pool_refresh_plan}} changes that.

OPTION POOL REFRESH MECHANIC
If {{option_pool_refresh_plan}} applies, show explicitly that a pre-money option pool refresh dilutes only existing shareholders (not the incoming investor), since the pool is typically carved out of the pre-money valuation before the new investor's ownership percentage is calculated — state this mechanic plainly, since it's a frequently misunderstood point that founders often don't realize hits them disproportionately relative to the round's headline dilution number.

COMPOUNDING ACROSS ROUNDS
Run the same mechanics sequentially across every round in {{planned_future_rounds}}, showing cumulative founder ownership after each round, not just the final number — the compounding effect across multiple rounds of dilution is easy to underweight intuitively when only looking at one round at a time.

DIRECT ANSWER
Answer {{specific_dilution_question}} directly and numerically using the model built above.

MANDATORY CLOSING LINE
End with this exact line, unmodified: "These are dilution mechanics and arithmetic only, not investment advice — a lawyer or startup-focused accountant should review actual terms before you rely on any of these numbers."

OUTPUT FORMAT
Single-Round Mechanics, Option Pool Refresh Mechanic (if applicable), Compounding Across Rounds (a running ownership table), Direct Answer, then the mandatory closing line.`,
    variables: [
      {
        name: 'current_cap_table',
        description: 'Current ownership breakdown',
        example:
          'Founder A: 42%, Founder B: 38%, existing option pool: 10%, seed investors: 10%',
        required: true,
      },
      {
        name: 'planned_future_rounds',
        description:
          'Each hypothetical or planned future round with raise amount and pre-money valuation',
        example:
          'Series A: raise $6,000,000 at $18,000,000 pre-money. Series B (2 years later): raise $15,000,000 at $50,000,000 pre-money.',
        required: true,
      },
      {
        name: 'option_pool_refresh_plan',
        description: 'Whether a pool refresh is planned, and target size, if applicable',
        example:
          'Series A includes a pool refresh to bring the pool back up to 12% pre-money',
        required: false,
      },
      {
        name: 'specific_dilution_question',
        description: 'The exact question you want answered numerically',
        example:
          'After both rounds, what percentage will the two founders combined actually hold?',
        required: true,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['cap-table', 'dilution', 'fundraising-mechanics', 'equity', 'founders'],
    whyItWorks:
      "Modeling dilution across sequential rounds, rather than just the next one in isolation, surfaces a compounding effect that a single-round view systematically hides — a founder who's comfortable with roughly 25% dilution once might not intuitively register that two or three rounds of similar dilution compound multiplicatively, not additively, so a plan that looks like 'giving up a quarter of the company a couple of times' can actually mean holding well under half of what a founder started with by the time a Series B closes, a specific arithmetic fact that's easy to underweight when each round gets evaluated on its own. Explicitly calling out the option-pool refresh as a mechanic that dilutes only existing shareholders, not the incoming investor, targets one of the most frequently misunderstood pieces of a term sheet: because the pool refresh is carved out pre-money, it's mathematically structured to hit founders and existing shareholders specifically, on top of whatever dilution the round's headline investor percentage already implies — and a founder who only tracks the round's advertised dilution number, without separately tracking the pool refresh sitting inside it, ends up more diluted than the number they thought they'd agreed to. The same mechanics-versus-advice separation used in the SAFE-clause and runway-scenario prompts applies here for the same underlying reason: computing what a round mechanically does to ownership is arithmetic a model can do reliably and transparently, while judging whether a given amount of future dilution is an acceptable price for growth capital depends on strategic context, leverage, and risk tolerance no cap-table snapshot can supply — which is exactly why the mandatory closing line and the explicit refusal to recommend a valuation or round size are load-bearing, not decorative.",
    exampleOutput: `Single-round mechanics (Series A): New investor gets $6,000,000 ÷ $24,000,000 post-money = 25% ownership. Remaining 75% is split proportionally among existing holders before any pool refresh.

Option pool refresh: A refresh to 12% pre-money is carved out of existing holders' shares before the Series A investor's 25% is calculated — this dilutes Founder A, Founder B, and prior investors specifically, not the incoming Series A investor.

Compounding across rounds: After Series A (with refresh): Founder A ≈ 29%, Founder B ≈ 26%. After Series B (25% raise ÷ post-money): Founder A ≈ 22%, Founder B ≈ 20%.

Direct answer: Combined founder ownership after both rounds is approximately 42%, down from 80% today — driven roughly equally by the two rounds' investor stakes and the Series A pool refresh.

These are dilution mechanics and arithmetic only, not investment advice — a lawyer or startup-focused accountant should review actual terms before you rely on any of these numbers.`,
    verifiedAgainst: [{ tool: 'Claude', version: 'Sonnet 5', date: '2026-08-08' }],
    changelog: [
      { date: '2026-08-08', note: 'Initial publish, verified against Claude Sonnet 5.' },
    ],
  },
  {
    slug: 'startup-premortem-risk-exercise',
    category: 'startup',
    title: 'Run a pre-mortem before a big launch instead of a post-mortem after it fails',
    description:
      "Uses Gary Klein's pre-mortem technique — imagining the decision has already failed a year out — to surface risks each team member names independently before groupthink sets in, then converts only the top risks into owned mitigations.",
    promptText: `You are facilitating a pre-mortem exercise using Gary Klein's technique: the team imagines the decision has already failed, a defined time in the future, and works backward to explain why — rather than brainstorming risks in the open-ended, socially awkward way that usually produces a short, safe list.

CONTEXT
The decision or launch being pre-mortemed: {{decision_or_launch}}
The future point being imagined, and the stated failure: {{future_point_and_failure}}
Team members/roles contributing, and their individual perspective if known: {{team_members_and_roles}}
Anything already flagged as a risk that people are reluctant to say out loud directly: {{known_reluctant_topic}}

INDEPENDENT-VOICE SIMULATION
For each person/role in {{team_members_and_roles}}, generate their individual pre-mortem contribution separately, from their specific vantage point, before merging anything — a finance-minded contributor and a customer-facing contributor should plausibly surface different failure causes, and merging too early loses that.

CAUSE GENERATION
For each individual contribution, generate 2-3 specific, plausible reasons {{future_point_and_failure}} happened, framed as if reporting a fact that already occurred ("we failed because X happened"), not as a hedge ("we might fail if X"). This hindsight framing is deliberate — do not soften it back into hedged language when merging perspectives.

MERGE AND RANK
Merge all individual causes into one list, removing exact duplicates but keeping distinct near-duplicates that reveal different underlying concerns. Rank by a combination of plausibility and severity, and if {{known_reluctant_topic}} doesn't appear anywhere in the merged list despite being flagged as a known concern, surface it explicitly and ask why it didn't get named.

MITIGATIONS FOR TOP RISKS ONLY
Convert only the top 3-5 ranked risks into a specific mitigation with a named owner — do not attempt to mitigate the entire list, since that dilutes effort across risks that don't warrant it and turns the exercise into a paperwork exercise instead of a decision-changing one.

OUTPUT FORMAT
Individual contributions (labeled by role), merged and ranked risk list, then mitigations with owners for the top 3-5 only.`,
    variables: [
      {
        name: 'decision_or_launch',
        description: 'The specific decision or launch being examined',
        example:
          'Launching self-serve signup (no sales call required) for the first time next quarter',
        required: true,
      },
      {
        name: 'future_point_and_failure',
        description:
          'The imagined future point and the stated failure to explain backward from',
        example:
          'Six months from now: self-serve signup has launched and monthly self-serve revenue is under $2,000, a clear failure against the $15,000 target',
        required: true,
      },
      {
        name: 'team_members_and_roles',
        description: 'Who is contributing, and their role/vantage point',
        example:
          'Founder (product), Head of Sales (worried about cannibalizing sales-assisted deals), Support lead (worried about support load from unqualified signups)',
        required: true,
      },
      {
        name: 'known_reluctant_topic',
        description:
          "A risk people already sense but haven't said out loud directly, if there is one",
        example:
          'Sales team may quietly deprioritize self-serve leads because commission structure still favors sales-assisted deals',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'pre-mortem',
      'risk-management',
      'decision-making',
      'team-facilitation',
      'startups',
    ],
    whyItWorks:
      "Framing the exercise as 'imagine it already failed' rather than 'what could go wrong' is the specific mechanism behind Gary Klein's pre-mortem technique, and it works for a documented psychological reason known as prospective hindsight: people are measurably better at generating reasons for a stated future failure than at open-ended risk brainstorming, because reporting on a fact that 'already happened' carries less social cost than volunteering a pessimistic prediction in a room that wants to feel good about a launch — naming a risk framed as an explanation feels like contributing evidence, while naming the same risk framed as a prediction feels like being the person who doubts the plan. Generating each team member's contribution independently before merging targets a separate and equally well-documented failure mode of live group brainstorming: whoever speaks first, often the most senior person in the room, tends to anchor the whole group's sense of what the real risks are, and everyone after them subconsciously builds on or defers to that first frame rather than surfacing an independent one — which is exactly why {{known_reluctant_topic}} exists as a check in this prompt, since a risk someone senses but hesitates to say aloud is disproportionately likely to get silently dropped in a live discussion that starts from someone else's frame, and explicitly checking whether it surfaced on its own is how the exercise catches its own blind spot instead of assuming a good process automatically produces a complete list. Restricting mitigations to only the top 3-5 ranked risks, instead of attempting to address every risk generated, is what keeps the exercise decision-changing rather than a compliance ritual — a mitigation list covering every risk equally dilutes attention across items that didn't warrant it and reliably produces a document that gets filed away, while a short list of owned, specific actions against the risks that actually matter most is the version of a pre-mortem that changes what the team does before launch instead of after the failure it predicted.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-09' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: 'Initial publish, verified against Claude Sonnet 5 and ChatGPT GPT-5.1.',
      },
    ],
  },
]
