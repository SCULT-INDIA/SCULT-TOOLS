import type { Prompt } from '../types'

/**
 * Startup & Strategy — Tier 2, business group. Founder prompts that force
 * rigor instead of cheerleading: Lean Startup validation, JTBD interviewing,
 * pitch-deck narrative structure, competitive-landscape and pricing
 * frameworks, GTM channel testing, and fundraising-mechanics explainers
 * scoped honestly (never investment or legal advice).
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'idea-validation-disconfirming-questions',
    category: 'startup',
    title: 'Turn a startup idea into a validation plan that could actually kill it',
    description:
      'Generate the falsifiable hypotheses, cheap disproving tests, and Mom-Test-style interview questions that could prove a startup idea wrong before you spend months building it.',
    promptText: `You are a startup advisor trained in Lean Startup validation and Rob Fitzpatrick's "Mom Test" interviewing method. Your job is to find the fastest way to prove this idea WRONG, not to encourage it.

Context:
- Idea: {{idea_description}}
- Target customer: {{target_customer}}
- Assumption I'm most worried about, if known: {{riskiest_assumption}}
- Time and budget available to test: {{timeframe_and_budget}}

Task:
1. Restate the idea as exactly 3 falsifiable hypotheses: (a) a real, specific problem this customer has, (b) that they would pay for a solution to it, (c) that they would find and adopt it the way you're planning to reach them. Each hypothesis must be something evidence could disprove — not a vague belief.
2. For each hypothesis, design the cheapest real-world test that could disprove it within {{timeframe_and_budget}} — a test that produces a real behavioral signal (a payment, a signed waitlist, a completed task), not an opinion.
3. Write 5 Mom-Test-style interview questions that ask ONLY about the customer's past behavior and current workarounds. No question may contain the words "would you" or "might you," or describe the idea itself. If a draft question breaks this rule, rewrite it before including it.
4. State plainly, for the single riskiest assumption, what a real failure signal would look like — and call out polite interest ("that's a cool idea," "I'd probably use that") as not evidence, since it isn't tied to a real commitment.

Format: four numbered sections, plain text, no encouragement or cheerleading language anywhere in the output.`,
    variables: [
      {
        name: 'idea_description',
        description: 'The startup idea, in your own words',
        example:
          'A subscription box that sends small-batch coffee based on a short flavor-preference quiz',
        required: true,
      },
      {
        name: 'target_customer',
        description: 'Who you think has this problem',
        example: 'Home coffee drinkers who already buy specialty beans online',
        required: true,
      },
      {
        name: 'riskiest_assumption',
        description: "The assumption you're most nervous about, if you know it",
        example: 'That people will trust a quiz more than picking beans themselves',
        required: false,
      },
      {
        name: 'timeframe_and_budget',
        description: 'How much time and money you can spend testing this',
        example: '2 weeks, under $200',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'idea-validation',
      'lean-startup',
      'the-mom-test',
      'customer-discovery',
      'founders',
    ],
    whyItWorks:
      "This flips the default failure mode of idea-validation prompts, which is to be asked what makes an idea good and then generate reasons it's good. Structuring the ask as three falsifiable hypotheses forces a claim evidence can actually contradict — the core of Lean Startup's build-measure-learn loop, where a hypothesis you can't fail isn't being tested, it's being confirmed. The banned-words rule ('would you', 'might you') is a direct implementation of the Mom Test: hypothetical questions get people to be nice to you, not honest, because everyone imagines themselves as the hero of a hypothetical future story. Naming polite interest as non-evidence closes the most common self-deception in early validation — founders mistake 'that's a cool idea' for market demand because it produces the same warm feeling as a real yes.",
    exampleOutput: `Hypotheses:
1. Specialty-bean buyers are frequently dissatisfied with beans they pick for themselves (problem).
2. They'd pay a premium over self-selecting for a pick they trust (willingness to pay).
3. A short flavor quiz alone is enough to earn that trust, without a human recommender (adoption mechanism).

Cheapest disproving tests (2 weeks, <$200):
1. Interview 8 specialty-bean buyers about their last 3 purchases — if most report high satisfaction picking themselves, hypothesis 1 is disproved.
2. Landing page with the quiz and a real "reserve your box — $34/mo" button, no product built — a low click-to-reserve rate after quiz completion disproves hypothesis 2.
3. Manually fulfill 10 quiz-based picks by hand — track how many reorder without a follow-up nudge, as a proxy for hypothesis 3.

Mom-Test questions:
1. Walk me through the last time you bought coffee beans — what did you look at?
2. What have you tried in the past when a bag of beans disappointed you?
3. What's the last thing you searched for related to picking coffee?
...

Riskiest assumption failure signal: If interviewees describe bean-picking as easy or enjoyable, or nobody has ever switched brands over disappointment, that's a real failure signal for hypothesis 1 — not "meh, could be more curated."`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-05' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
    ],
    changelog: [{ date: '2026-08-05', note: 'Initial publish.' }],
  },
  {
    slug: 'jtbd-customer-interview-question-generator',
    category: 'startup',
    title:
      'Generate JTBD interview questions that uncover the job, not the feature request',
    description:
      'Turn a product idea into a structured Jobs-to-be-Done interview script covering the timeline, the forces of progress, and the desired outcome — not a feature wishlist survey.',
    promptText: `You are a Jobs-to-be-Done researcher preparing an interview script. The goal is to uncover the job {{target_customer_segment}} is trying to get done, not to collect opinions about {{product_or_feature}}.

Context:
- Product or feature: {{product_or_feature}}
- Target customer segment: {{target_customer_segment}}
- What we know about their switching moment, if anything: {{known_switching_moment}}

Task: Write a JTBD interview script in three phases.

Phase 1 — Timeline (4 questions): Reconstruct the sequence of events before they started looking for a solution. Ask what they were doing before, what specifically triggered them to look for something new (the "struggle moment"), and what they tried first.

Phase 2 — Forces of progress (4 questions, one per force): Ask about the push (what's wrong with the old way that's pushing them away from it), the pull (what's attractive about a new solution), the anxiety (what makes them hesitate to switch — cost, learning curve, risk of choosing wrong), and the habit/attachment to the status quo (what keeps them using the old way despite its problems).

Phase 3 — Desired outcome (3 questions): Ask what "done" looks like for them — the outcome they're hiring a solution to produce — phrased around a specific past instance, not a general opinion.

For every question, add one line underneath explaining what it's designed to surface, and flag any question that asks about the future or asks the interviewee to evaluate {{product_or_feature}} directly — rewrite it to ask about past behavior instead.

Format: three headed phases, questions numbered within each, one-line rationale under each question.`,
    variables: [
      {
        name: 'product_or_feature',
        description: "The product or feature you're researching",
        example: 'A budgeting app for freelancers',
        required: true,
      },
      {
        name: 'target_customer_segment',
        description: "Who you're interviewing",
        example: 'Freelance designers who invoice 5+ clients a month',
        required: true,
      },
      {
        name: 'known_switching_moment',
        description:
          'What you already know about when they went looking for something new, if anything',
        example:
          'Several mentioned switching after a spreadsheet formula broke and cost them a client payment',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['jobs-to-be-done', 'jtbd', 'customer-interviews', 'user-research', 'founders'],
    whyItWorks:
      "This is built on the documented JTBD interviewing method from Bob Moesta and Chris Spiek's demand-side work (popularized via Clayton Christensen's milkshake study), which reconstructs a specific past switching event rather than asking for general opinions. The four forces of progress — push, pull, anxiety, and habit — are the actual named framework for why people switch or don't; asking about all four separately surfaces the anxiety and habit forces that a plain 'what problems do you have' question almost never reaches, because customers don't volunteer their own hesitation unprompted. Anchoring every question to a real past instance, and explicitly rewriting anything that asks the interviewee to evaluate the product directly, is what keeps the script from sliding into the same hypothetical-opinion trap that ruins most feature-feedback interviews.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-07-29' },
    ],
    changelog: [{ date: '2026-08-02', note: 'Initial publish.' }],
  },
  {
    slug: 'pitch-deck-narrative-outline',
    category: 'startup',
    title:
      'Turn raw startup facts into a pitch deck narrative investors can follow in one read',
    description:
      'Organize scattered facts about your startup into the standard problem-solution-market-traction-ask narrative arc, slide by slide, flagging any slot the facts genuinely can’t support yet.',
    promptText: `You are a pitch deck story editor. Your job is to organize scattered facts into the standard investor narrative arc — not to write slide copy, and not to invent facts that weren't given.

Context:
- Raw notes about the startup: {{raw_notes_about_startup}}
- Funding stage: {{funding_stage}}
- Funding ask: {{funding_ask}}

Task:
1. From the raw notes, extract: the problem in one sentence, the "why now" trigger (what changed that makes this the right time), the solution in one sentence, and the single most important traction fact.
2. Assign the extracted facts, and anything else usable in the notes, to this slide order: Problem → Why Now → Solution → Market Size → Product → Traction → Business Model → Competition → Team → Ask. For any slide with no supporting fact in the notes, write "Not yet answered — needs [specific missing fact]" instead of inventing content to fill the gap.
3. For each slide, write the single sentence a reader must walk away with — the "so what," not a content summary. If a slide's facts don't support a clear sentence, say so rather than forcing one.
4. Write the Ask slide as one exact number ({{funding_ask}}), the {{funding_stage}} it corresponds to, and one sentence on primary use of funds — no hedging language like "around" or "roughly" unless the input itself was a range.

Format: ten headed slide sections, one paragraph or "not yet answered" line each, ending with the Ask.`,
    variables: [
      {
        name: 'raw_notes_about_startup',
        description: 'Whatever you have — bullet points, a rambling doc, past deck text',
        example:
          'B2B tool for dental clinics to auto-generate insurance claim forms. 3 pilot clinics, one saved 6hrs/week on billing. New CMS billing rule kicked in this year forcing more paperwork.',
        required: true,
      },
      {
        name: 'funding_stage',
        description: 'The round being raised',
        example: 'Pre-seed',
        required: true,
      },
      {
        name: 'funding_ask',
        description: 'The exact amount being raised',
        example: '$750,000',
        required: true,
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
      "DocSend's own pitch-deck research found investors spend on average under four minutes on a deck before deciding whether to take a meeting — which means the narrative has to land in a single skim, not a careful read. Sequencing Problem before Solution is the actual mechanic that makes that skim work: naming the pain before the fix builds the tension a features-first deck skips straight past, so the reader feels why the solution matters instead of being told to trust that it does. The explicit 'not yet answered' flag for unsupported slides matters just as much — decks that fabricate a traction number or a market-size figure to fill a gap are the single most common thing that blows up in investor diligence, and it's cheaper to show an honest gap than to get caught rounding one up later.",
    exampleOutput: `Problem: Dental clinics lose hours per week to manual insurance claim paperwork, an already-thin administrative team's biggest recurring drain.
Why Now: A new CMS billing rule this year increased claim documentation requirements, making the manual process measurably worse right when clinics are looking for a fix.
Solution: Auto-generates compliant insurance claim forms directly from clinic scheduling data.
Market Size: Not yet answered — needs a sized estimate of dental clinics or claim volume, not just "big market."
Product: Not yet answered — needs a screenshot or workflow description from the notes.
Traction: 3 pilot clinics live; one reports saving 6 hours/week on billing — the number worth leading with.
...
Ask: Raising $750,000 pre-seed to hire two engineers and convert the 3 pilots into paying customers.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-06' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' },
    ],
    changelog: [{ date: '2026-08-06', note: 'Initial publish.' }],
  },
  {
    slug: 'competitive-landscape-analysis-framework',
    category: 'startup',
    title:
      'Map a competitive landscape by how customers actually choose, not a feature checklist',
    description:
      'Turn a list of competitors into a landscape analysis organized around the axes customers actually weigh — including the status-quo and DIY options a feature matrix always leaves out.',
    promptText: `You are a competitive strategy analyst. Build a landscape analysis organized around how the customer actually decides, not a generic feature checklist.

Context:
- Startup one-liner: {{startup_one_liner}}
- Direct competitors (same solution type, same customer): {{direct_competitors}}
- Indirect or substitute solutions (different approach, same underlying job — including doing nothing or DIY): {{indirect_or_substitute_solutions}}
- What customers actually weigh when choosing, if known: {{customer_decision_criteria}}

Task:
1. Confirm the direct-vs-indirect grouping is complete — explicitly check whether "doing nothing" or a manual/DIY workaround belongs in the indirect list even if it wasn't named, since status-quo inertia is usually the real biggest competitor for an early-stage startup.
2. Identify the two axes customers actually weigh when choosing between these options, using {{customer_decision_criteria}} if given, or inferring the two axes most likely to drive a real switching decision if not. State your reasoning — don't default to generic axes like "price vs. features" unless the input actually supports them.
3. Place every competitor plus {{startup_one_liner}} on those two axes as a text-described grid (which quadrant, and why), one sentence of reasoning per placement.
4. Write one honest differentiation sentence: what this startup is the only, best, or most credible option for. If the notes don't yet support a real differentiation claim, say so directly instead of writing a vague one ("more affordable and easier to use") that any competitor could also claim.

Format: four headed sections.`,
    variables: [
      {
        name: 'startup_one_liner',
        description: 'Your startup in one sentence',
        example: 'Automated insurance claim generation for dental clinics',
        required: true,
      },
      {
        name: 'direct_competitors',
        description: 'Companies selling essentially the same solution',
        example: 'DentalClaimHub, ClaimPilot',
        required: true,
      },
      {
        name: 'indirect_or_substitute_solutions',
        description: 'Different approaches to the same underlying job',
        example:
          'In-house billing staff, outsourced billing services, generic practice-management software',
        required: true,
      },
      {
        name: 'customer_decision_criteria',
        description: 'What you know customers actually weigh when choosing, if anything',
        example:
          'Clinics care most about staff time saved and claim rejection rate, less about price',
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
      "Feature-matrix comparisons fail for a specific reason: they compare capabilities, not the actual axes a buyer weighs when choosing, so two products can look identical on a checklist and still lose or win on an axis the checklist never captured (setup time, trust, switching risk). Forcing status-quo and DIY into the indirect set corrects a documented blind spot — founders reflexively list only named competing companies, even though for most early-stage products the real dominant competitor is 'the customer keeps doing it manually,' since inertia beats an imperfect but familiar workaround more often than any named rival does. Refusing to write a generic differentiation sentence when the facts don't support one guards against positioning claims like 'faster, cheaper, easier' that every competitor in the set could also truthfully claim, which read as noise to anyone evaluating more than one option.",
    verifiedAgainst: [{ tool: 'Claude', version: 'Sonnet 5', date: '2026-08-04' }],
    changelog: [{ date: '2026-08-04', note: 'Initial publish.' }],
  },
  {
    slug: 'value-based-pricing-tier-design',
    category: 'startup',
    title: 'Design pricing tiers around what each segment values, not round numbers',
    description:
      'Turn a feature list and target segments into value-based pricing tiers, with a deliberately chosen value metric and an explicit anchor tier — instead of copying a competitor’s price points.',
    promptText: `You are a SaaS pricing strategist using value-based, tiered pricing — pricing tied to what each segment actually values, not round numbers copied from a competitor.

Context:
- Product: {{product_description}}
- Customer segments: {{customer_segments}}
- Features/capabilities available to package: {{features_or_capabilities}}
- Candidate value metrics, if you have ideas: {{value_metric_candidates}}

Task:
1. From {{value_metric_candidates}} or by inferring from the product, propose the value metric each tier should scale on (per-seat, per-usage-unit, per-outcome, flat). State why it scales with the value the customer receives, rather than with your delivery cost — those are not the same thing.
2. Design 2-4 tiers, each named for and mapped to one segment in {{customer_segments}}. State which segment's willingness-to-pay and must-have needs each tier is built around.
3. Assign each item in {{features_or_capabilities}} to a tier. For any feature that would be a must-have reason to buy for a lower-priced segment, flag it explicitly if you're gating it behind a higher tier — that gate usually suppresses adoption of the entry tier rather than lifting revenue, and should be a deliberate choice, not an accident.
4. Name which tier is the intended default/anchor choice for most buyers, and explain the anchoring reasoning — that the presence of a deliberately less attractive higher or lower option makes the anchor tier look reasonably priced by comparison.

Format: a tier table (name, target segment, price basis, included features), followed by the anchor-tier reasoning as its own short paragraph.`,
    variables: [
      {
        name: 'product_description',
        description: 'What the product does',
        example: 'A scheduling and invoicing tool for independent tutors',
        required: true,
      },
      {
        name: 'customer_segments',
        description: 'The distinct buyer segments you sell to',
        example:
          'Solo tutors, small tutoring agencies (3-15 tutors), franchise tutoring centers',
        required: true,
      },
      {
        name: 'features_or_capabilities',
        description: 'Every feature or capability you could package',
        example:
          'Scheduling, automated invoicing, parent portal, multi-tutor calendar, payroll export, API access',
        required: true,
      },
      {
        name: 'value_metric_candidates',
        description: 'Ideas you already have for what to charge based on, if any',
        example: 'Per-tutor seat, or per-student billed',
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
      "The value-metric step is the actual mechanic that separates value-based pricing from arbitrary tiering: a metric like per-tutor-seat or per-student-billed should track the value the customer receives as they grow, not your cost to serve them, which is why picking the wrong metric (e.g. flat pricing for a product whose value clearly scales with usage) quietly caps revenue as customers grow without anyone noticing why. The anchor-tier instruction is the documented pricing-psychology decoy effect — a deliberately less attractive option on either side of the middle tier makes that middle tier look like the obviously reasonable choice by comparison, which is why most SaaS pricing pages are built around a highlighted 'most popular' tier rather than three neutral options. Flagging must-have features gated behind a higher tier forces a real trade-off decision instead of an accidental one, since gating something a lower segment truly needs to buy at all usually loses more entry-tier customers than it gains in upgrade revenue.",
    exampleOutput: `Solo — per-seat, $19/mo/tutor: scheduling, automated invoicing, parent portal.
Agency (anchor tier) — per-seat, $15/mo/tutor (5+ seats): everything in Solo, plus multi-tutor calendar and payroll export.
Franchise — custom, per-location: everything in Agency, plus API access and multi-location reporting.

Anchor reasoning: Agency is the intended default — its per-seat price is lower than Solo's, which makes it look like the "smart" choice for anyone with 3+ tutors, while Franchise's higher, undefined price makes Agency look concretely priced and easy to commit to by comparison.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-31' },
    ],
    changelog: [{ date: '2026-08-05', note: 'Initial publish.' }],
  },
  {
    slug: 'gtm-channel-selection-for-early-stage',
    category: 'startup',
    title:
      'Pick a GTM channel by testing cheaply across many, not betting on the obvious one',
    description:
      'Rank candidate go-to-market channels by fit and cost of a cheap test rather than raw potential, then get a pre-committed pass/fail test plan for the top two before spending real budget.',
    promptText: `You are a GTM strategist using the "bullseye" approach to channel selection: test cheaply across many channels before committing real budget to the one that looks obvious.

Context:
- Product: {{product_description}}
- Target customer: {{target_customer}}
- Budget/resources available: {{budget_or_resources}}
- Channels being considered, if any: {{channels_considered}}

Task:
1. List candidate GTM channels — use {{channels_considered}} plus any others clearly relevant to how {{target_customer}} actually discovers solutions like this, given {{budget_or_resources}}.
2. Score each channel on three axes only: (a) fit — how closely it matches where {{target_customer}} already looks for solutions, (b) cost/effort to run a real cheap test, (c) speed to a usable signal. Do not score on scale or long-term potential — that's a later-stage question, and scoring for it now is what leads teams to over-invest in a channel before it's proven at small scale.
3. Select the top 2 channels by that scoring and design a 2-week test for each, with a pass/fail metric stated in advance, before any test result exists to argue with.
4. Explicitly name any channel from the list that's a poor fit given the customer's actual buying behavior, and say why — so it doesn't get tried later just because it's popular or "what everyone does."

Format: scored table, then two test plans with pre-committed pass/fail metrics.`,
    variables: [
      {
        name: 'product_description',
        description: 'What the product is and does',
        example: 'Automated insurance claim generation for dental clinics',
        required: true,
      },
      {
        name: 'target_customer',
        description: 'Who buys it and, ideally, how they currently find solutions',
        example:
          'Dental office managers, who mostly find tools through their billing software vendor or peer referrals',
        required: true,
      },
      {
        name: 'budget_or_resources',
        description: 'What you actually have to spend or staff this with',
        example: '$1,500/month, one founder doing GTM part-time',
        required: true,
      },
      {
        name: 'channels_considered',
        description: 'Channels already on your shortlist, if any',
        example:
          'Cold email to office managers, dental conference booth, partnership with billing software vendors',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['go-to-market', 'channel-strategy', 'growth', 'early-stage', 'founders'],
    whyItWorks:
      "This is the Bullseye framework from Gabriel Weinberg and Justin Mares' Traction: rank many channels cheaply on fit, cost, and speed to signal before committing real budget to any one of them, because early-stage teams reliably default to whichever channel is most visible — usually the one their competitors are already using — rather than the one that actually fits how their specific customer buys. Explicitly excluding scale/potential from the scoring matters because that's the axis that makes an unproven channel look attractive on a spreadsheet before it's been tested at all; potential is a real question, but it's the wrong question to optimize for with the first dollar. Pre-committing the pass/fail metric before running the test is what stops a team from quietly redefining 'success' after a lukewarm result comes in, which is the most common way a bad channel keeps getting funded past the point the data already killed it.",
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' }],
    changelog: [{ date: '2026-08-03', note: 'Initial publish.' }],
  },
  {
    slug: 'mvp-scope-cut-list',
    category: 'startup',
    title:
      'Cut a feature wishlist down to the MVP that actually tests your riskiest assumption',
    description:
      'Take a full feature wishlist and your riskiest assumption, and get back the smallest version that tests it — plus a visible cut list naming what got left out and why.',
    promptText: `You are helping scope an MVP down to the smallest thing that tests one specific assumption — not the smallest version of the full product vision.

Context:
- Full feature wishlist: {{full_feature_wishlist}}
- Riskiest assumption to test: {{riskiest_assumption}}
- Who will use this test version: {{target_user_for_test}}

Task:
1. Restate {{riskiest_assumption}} as one testable hypothesis.
2. From {{full_feature_wishlist}}, select only the features {{target_user_for_test}} needs to genuinely put that hypothesis to the test — not features that would help a different, less risky assumption, and not features that make the product feel more complete but aren't load-bearing for this specific test.
3. List every feature you cut, next to the assumption it would actually test instead — so each cut is a visible decision with a reason, not a feature quietly dropped and forgotten.
4. Define, in advance, what a pass and a fail look like for this test — specific enough that you and a skeptical cofounder would agree on the result afterward without arguing about it.

Format: three sections — Included (with the assumption each feature tests), Cut (with the assumption each cut feature would have tested instead), Pass/Fail definition.`,
    variables: [
      {
        name: 'full_feature_wishlist',
        description: 'Every feature currently on the roadmap or wishlist',
        example:
          'Auto-generate claim forms, multi-clinic dashboard, claim status tracking, SMS notifications, analytics reporting, staff permission levels, white-label branding',
        required: true,
      },
      {
        name: 'riskiest_assumption',
        description: "The assumption you're least sure about",
        example:
          'That clinic staff will trust an auto-generated claim form enough to submit it without manually re-checking it',
        required: true,
      },
      {
        name: 'target_user_for_test',
        description: "Who's actually using this test version",
        example: 'One office manager at a single pilot clinic',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['mvp', 'product-scoping', 'lean-startup', 'roadmap', 'founders'],
    whyItWorks:
      "This grounds MVP scoping in Lean Startup's actual definition — an MVP exists to test one hypothesis, it is not a stripped-down version of the entire roadmap — which is a distinction most feature-cutting exercises collapse by asking 'what's the smallest version of everything' instead of 'what's the smallest thing that tests the one thing I'm actually unsure about.' The paired cut-list format, where every removed feature sits next to the assumption it would have tested, is what stops scope creep in reverse: without a written reason, a cut feature has a way of quietly getting re-added mid-build because nobody remembers why it left, or because it's easy to justify as 'just one more thing' in isolation. Defining pass/fail before building removes the after-the-fact wiggle room that lets a team call a weak result a win because the bar was never actually written down.",
    exampleOutput: `Hypothesis: Clinic staff will trust an auto-generated claim form enough to submit it without manually re-checking every field.

Included: Auto-generate claim forms (the core test), claim status tracking (needed to see if they follow up manually anyway, which would signal distrust).

Cut: Multi-clinic dashboard (tests a scaling assumption, not this one) — SMS notifications (tests engagement, not trust) — analytics reporting, staff permissions, white-label branding (all test later-stage assumptions about retention and expansion, not initial trust).

Pass/fail: Pass if the office manager submits at least 8 of 10 auto-generated forms without manually re-verifying every field first. Fail if they re-check every field regardless, or revert to their old manual process within the first week.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-06' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-07-30' },
    ],
    changelog: [{ date: '2026-08-06', note: 'Initial publish.' }],
  },
  {
    slug: 'monthly-investor-update-email',
    category: 'startup',
    title: 'Write a monthly investor update that gets replies, not silence',
    description:
      'Turn raw metrics and notes into a concise investor update — headline numbers first, honest lowlights included, and asks specific enough to actually act on.',
    promptText: `You are drafting a monthly investor update in the format investors actually read — headline numbers first, honest lowlights included, specific asks only.

Context:
- Company: {{company_name}}
- Period: {{reporting_period}}
- Key metrics, with trend vs. last period: {{key_metrics}}
- Highlights: {{highlights}}
- Lowlights or challenges: {{lowlights_or_challenges}}
- Specific asks, if any: {{specific_asks}}

Task:
1. Open with a one-line list of the 1-2 headline metrics from {{key_metrics}}, stated as numbers with trend (e.g. "MRR: $42k, up 11% MoM"). No adjective may substitute for a number that exists in the input.
2. Write Highlights as specific, verifiable facts from {{highlights}} — cut anything that's just momentum language ("strong month," "great traction") without a fact backing it up.
3. Write Lowlights/Challenges honestly from {{lowlights_or_challenges}} — do not soften a real problem into something that sounds like a highlight, and do not omit this section even if it feels uncomfortable to include.
4. If {{specific_asks}} is given, write each ask as one sentence naming exactly who or what is needed and by when — rewrite a vague ask like "any intros welcome" into something answerable, or drop it if it truly can't be made specific.

Format: ready-to-send email, headline metrics as a one-line list at the very top, then Highlights, Lowlights, and Asks as short sections, under 300 words total.`,
    variables: [
      {
        name: 'company_name',
        description: 'Your company name',
        example: 'Claimwise',
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
        example:
          'MRR $42k (up 11% MoM), 14 paying clinics (up from 11), churn: 1 clinic (billing dispute)',
        required: true,
      },
      {
        name: 'highlights',
        description: 'Specific facts worth calling out this period',
        example:
          'Closed first multi-location contract (4 clinics); reduced claim processing time from 40min to 12min per pilot clinic',
        required: true,
      },
      {
        name: 'lowlights_or_challenges',
        description: 'Real problems this period — do not skip this',
        example:
          'Lost 1 clinic over a billing dispute; hiring for the second engineer is behind schedule by 3 weeks',
        required: true,
      },
      {
        name: 'specific_asks',
        description: 'What you actually need from investors right now, if anything',
        example:
          'An intro to a dental-practice-management software company for a potential integration partnership',
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
      "This follows the widely-used YC-style investor update format, built around the fact that investors skim dozens of these updates and decide in seconds whether to read past the first line — a headline metric with trend gives them that decision instantly, where a narrative opener makes them dig for it. Including real lowlights is a trust signal, not a weakness: investors who've watched many portfolio companies pattern-match 'no bad news, ever' as a red flag, since it usually means the founder either isn't tracking problems or isn't disclosing them, either of which is worse than the problem itself. A specific, dated ask is what actually converts a skimmed email into a reply — a vague ask like 'any intros welcome' asks the reader to do the work of figuring out what to do with it, and that extra step is exactly where most asks quietly die unanswered.",
    exampleOutput: `Subject: Claimwise — July 2026 update

MRR: $42k, up 11% MoM. Paying clinics: 14, up from 11.

Highlights: Closed our first multi-location contract (4 clinics at once). Cut claim processing time from ~40min to ~12min per clinic across all pilots.

Lowlights: Lost one clinic over a billing dispute we're still resolving. Second engineer hire is 3 weeks behind schedule — actively interviewing.

Ask: Would love an intro to anyone at a dental-practice-management software company for a possible integration — happy to send a one-pager if useful.

Thanks for the continued support.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-07' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' },
    ],
    changelog: [{ date: '2026-08-07', note: 'Initial publish.' }],
  },
  {
    slug: 'fundraising-terms-plain-english-explainer',
    category: 'startup',
    title: 'Get fundraising terms explained in plain English before you sign anything',
    description:
      'Paste a term sheet or SAFE clause and get a plain-language walkthrough of what it mechanically does to ownership and payout — mechanics only, explicitly not legal or investment advice.',
    promptText: `You are explaining fundraising term-sheet mechanics in plain English. You explain what a term literally does to ownership, control, and payout math. You do not give legal advice, and you do not tell the founder whether to accept it.

Context:
- Instrument type: {{instrument_type}}
- Term or clause to explain: {{term_or_clause_text}}
- Current cap table summary, if you want a concrete example run through it: {{your_cap_table_summary}}

Task:
1. Restate {{term_or_clause_text}} in plain English — what it literally computes or controls mechanically (e.g. what a valuation cap does to the conversion price, what a 1x non-participating liquidation preference pays out on exit, what a pro-rata right lets the holder do in a future round).
2. Walk through one concrete numeric example. Use {{your_cap_table_summary}} if given; otherwise invent a simple, clearly labeled illustrative example with round numbers, and state explicitly that it's illustrative, not this founder's actual numbers.
3. State the typical/common range for this term in current early-stage market practice, explicitly labeled as general market color, not a benchmark or recommendation for this specific deal.
4. End with this exact reminder, unmodified: "This explains mechanics only. It is not legal or investment advice — have a startup lawyer review any term sheet before you sign."

Format: four numbered sections. Never state or imply an opinion on whether this founder should accept the term.`,
    variables: [
      {
        name: 'instrument_type',
        description: 'The type of instrument this term belongs to',
        example: 'SAFE (post-money)',
        required: true,
      },
      {
        name: 'term_or_clause_text',
        description: 'The exact clause or term you want explained',
        example: '"$8,000,000 post-money valuation cap, no discount"',
        required: true,
      },
      {
        name: 'your_cap_table_summary',
        description:
          'Your current cap table basics, if you want the example run on real numbers',
        example: 'Founders hold 100% pre-round, raising $500,000 on this SAFE',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['fundraising', 'term-sheet', 'safe-notes', 'cap-table', 'founders'],
    whyItWorks:
      "The prompt enforces a specific separation that most AI-generated fundraising answers blur: 'what a clause computes' is arithmetic and can be stated as fact, while 'whether to accept it' is a judgment call that depends on negotiation leverage, legal context, and risk tolerance the model doesn't have — collapsing those two into one answer is exactly where AI fundraising advice becomes genuinely risky. Running a concrete numeric example matters because these terms are famously counterintuitive in the abstract: a 1x liquidation preference sounds harmless as a sentence, but running an actual exit number through it is what makes a founder realize what it actually pays out first, before common stock sees anything. The hardcoded, unmodifiable lawyer-referral line is a fixed guardrail rather than a soft suggestion the model could be talked out of mid-conversation if a founder pushes for a stronger opinion.",
    exampleOutput: `Plain English: A $8,000,000 post-money valuation cap means this SAFE converts into equity at a price implying the company is worth at most $8,000,000 after the round, even if a later priced round values it higher — the cap sets the ceiling on the price the SAFE investor pays per share, protecting them from paying a future-round price for value created earlier.

Illustrative example (not this founder's real numbers): On a $1,000,000 raise with an $8,000,000 post-money cap, the SAFE investor's ownership is calculated as if the company were valued at $8,000,000 post-money — roughly 12.5% ownership from this SAFE alone, before accounting for any other SAFEs or the option pool.

Typical market range: Post-money caps on early SAFEs commonly sit in a wide range depending on stage and traction — this is general market color, not a benchmark for whether $8,000,000 is the right number for this specific deal.

This explains mechanics only. It is not legal or investment advice — have a startup lawyer review any term sheet before you sign.`,
    verifiedAgainst: [{ tool: 'Claude', version: 'Sonnet 5', date: '2026-08-07' }],
    changelog: [{ date: '2026-08-07', note: 'Initial publish.' }],
  },
  {
    slug: 'customer-discovery-interview-synthesis',
    category: 'startup',
    title: 'Turn a stack of customer discovery notes into patterns you can act on',
    description:
      'Feed in raw notes from multiple customer discovery interviews and get back the patterns that actually repeated, with verbatim quotes — not one loud opinion mistaken for consensus.',
    promptText: `You are synthesizing customer discovery interviews. Your job is to find what actually repeated across interviews, not to elevate the most articulate or most recent answer into a conclusion.

Context:
- Number of interviews: {{number_of_interviews}}
- Raw interview notes, labeled by interviewee if possible: {{interview_notes}}
- Hypothesis being tested, if any: {{hypothesis_being_tested}}

Task:
1. Extract the problem statements, current workarounds, and objections mentioned in each interview, keeping track of which interview each point came from.
2. Group points into a theme only when the same underlying point appears in at least 2 separate interviews. Anything said by only one interviewee gets labeled "Outlier — not yet a pattern," not promoted into a theme just because it was memorable or strongly worded.
3. For each real theme, quote the closest-to-verbatim language interviewees actually used, not your paraphrase of it, so the exact words are available for messaging or copy later.
4. If {{hypothesis_being_tested}} is given, state plainly whether the notes support it, contradict it, or leave it untested — ambiguous or mixed evidence must be reported as ambiguous, not rounded up to "confirmed."

Format: Themes (with interview count and verbatim quotes), Outliers, then a Hypothesis verdict section if applicable.`,
    variables: [
      {
        name: 'number_of_interviews',
        description: 'How many interviews these notes come from',
        example: '7',
        required: true,
      },
      {
        name: 'interview_notes',
        description: 'Raw notes, ideally labeled by which interview they came from',
        example:
          'Interview 1 (office manager, 3-dentist practice): "We spend maybe an hour a day just re-entering the same info into the claim form"...\nInterview 2 (office manager, solo practice): "Claims aren\'t really our problem, it\'s the follow-up when they get rejected"...',
        required: true,
      },
      {
        name: 'hypothesis_being_tested',
        description: "What you're trying to confirm or disconfirm, if anything specific",
        example:
          'That claim form data entry, not claim rejections, is the top time sink for office managers',
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
      "The 'appears in at least 2 interviews before it counts as a theme' rule is a standard qualitative-research safeguard against single-loud-customer bias, where one especially articulate or emotionally intense interview gets remembered and repeated internally as 'what customers think,' even when nobody else said anything close to it. Preserving verbatim quotes instead of paraphrasing them keeps the customer's own words available for later use in landing pages and ad copy, since messaging built from a customer's actual phrasing consistently tests better than a founder's tidied-up summary of what they meant. Refusing to round ambiguous or mixed evidence up to 'confirmed' directly counters the confirmation bias every founder brings into discovery interviews for an idea they're personally invested in — the failure mode this step exists to block.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-05' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-08-01' },
    ],
    changelog: [{ date: '2026-08-05', note: 'Initial publish.' }],
  },
  {
    slug: 'product-market-fit-signal-audit',
    category: 'startup',
    title:
      "Audit your product-market-fit signals honestly instead of eyeballing 'traction'",
    description:
      'Turn survey, retention, and channel-mix data into a structured PMF signal audit using the Sean Ellis "very disappointed" threshold and retention-curve shape — a real read, not a vibe.',
    promptText: `You are auditing product-market-fit signals honestly — the goal is an accurate read, not a comforting one.

Context:
- Company stage: {{company_stage}}
- Sean Ellis "how would you feel if you could no longer use this product" survey results, if collected: {{survey_results_summary}}
- Retention/cohort data: {{retention_data_summary}}
- Growth channel mix (organic/referral vs. paid), if known: {{growth_channel_mix}}

Task:
1. If {{survey_results_summary}} is given, restate the percentage who said "very disappointed" without the product, and state plainly whether it clears the commonly cited ~40% threshold. Label this as a widely-used rule of thumb, not a guarantee of anything, and note explicitly if the sample is too small to trust the percentage at all.
2. Read {{retention_data_summary}} for curve shape: does retention flatten after the initial drop-off (a "smile curve," the real PMF signal), or does it keep declining toward zero with no flattening (a "death spiral")? State which, and point to the specific numbers in the data that support your read.
3. If {{growth_channel_mix}} is given, treat a rising organic/referral share against flat or falling paid spend as a secondary PMF signal, and paid-dependent growth with no organic pull as an absence of that signal — state which applies.
4. Give one honest overall verdict — Strong signal / Mixed or early signal / No signal yet — and explicitly refuse to round a mixed result up to "we have PMF" just because some inputs looked good.

Format: four headed sections ending in one blunt verdict line.`,
    variables: [
      {
        name: 'company_stage',
        description: 'Roughly where the company is',
        example: 'Seed stage, 8 months post-launch',
        required: true,
      },
      {
        name: 'survey_results_summary',
        description: 'Results of a Sean Ellis-style PMF survey, if you ran one',
        example:
          '80 responses: 22% very disappointed, 51% somewhat disappointed, 27% not disappointed',
        required: false,
      },
      {
        name: 'retention_data_summary',
        description: 'Cohort or usage retention numbers over time',
        example: 'Week 1: 100%, Week 2: 48%, Week 4: 31%, Week 8: 29%, Week 12: 28%',
        required: true,
      },
      {
        name: 'growth_channel_mix',
        description: 'Rough breakdown of where signups come from, if known',
        example:
          'Month 1: 90% paid ads / 10% organic. Month 4: 60% paid / 40% organic, paid spend flat',
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
      "This uses two specific, evidence-based PMF heuristics instead of a vibe check: the Sean Ellis survey's ~40% 'very disappointed' threshold — the benchmark Superhuman famously used to drive its own product roadmap toward PMF — and the retention-curve 'smile vs. death spiral' shape, the standard way growth teams distinguish real product-market fit (usage stabilizing among a core group) from a leaky bucket that only looks like growth because acquisition spend keeps refilling it. The instruction to refuse rounding mixed signals up to 'we have PMF' directly targets founder motivated reasoning — self-assessed PMF calls are one of the most consistently over-optimistic judgments founders make about their own company, precisely because a 22% very-disappointed score and a retention curve that hasn't flattened yet are each individually easy to explain away, and much harder to explain away side by side.",
    exampleOutput: `Survey: 22% very disappointed — below the ~40% rule-of-thumb threshold, though 80 responses is a reasonable sample size to trust this read at seed stage.

Retention: Curve flattens from week 4 (31%) through week 12 (28%) — this reads as an early smile curve, not a death spiral, since it's stabilizing rather than continuing to decline.

Channel mix: Organic share rising (10% → 40%) while paid spend holds flat — a genuine secondary PMF signal, since it isn't just more ad spend producing more signups.

Verdict: Mixed / early signal. Retention and channel mix both point toward real pull, but the survey score alone doesn't clear the PMF threshold — treat this as promising, not confirmed.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-06' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
    ],
    changelog: [{ date: '2026-08-06', note: 'Initial publish.' }],
  },
  {
    slug: 'founder-market-fit-narrative',
    category: 'startup',
    title:
      'Turn your background into a founder-market-fit story investors actually believe',
    description:
      'Turn your background into a specific, checkable founder-market-fit narrative built only on facts that hold up under a follow-up question — not a generic passion statement.',
    promptText: `You are helping build a founder-market-fit narrative from real, checkable facts — not a generic passion statement investors have read a thousand times.

Context:
- Founder background: {{founder_background}}
- Startup problem space: {{startup_problem_space}}
- Unique insight or advantage, if you have one in mind: {{unique_insight_or_advantage}}
- How you personally encountered this problem: {{how_you_learned_about_problem}}

Task:
1. From {{founder_background}}, pull out only concrete, checkable facts — specific roles, years, projects, prior failures, credentials — that connect to {{startup_problem_space}}. Skip vague traits like "always passionate about" or "lifelong interest in" that can't actually be checked or falsified.
2. Write the founder-market-fit claim as one sentence, built on the single strongest checkable fact, not the most flattering-sounding one.
3. Identify what's missing. If the background doesn't yet show a real unfair advantage — deep domain expertise, unusual access to customers, a distribution edge, a credential that signals credibility to this specific market — say so plainly instead of manufacturing a connection that isn't really there.
4. Write a 3-4 sentence narrative paragraph, suitable for a pitch deck team slide, built only from the facts established above — no invented achievements, no rounding "worked adjacent to this industry" up to "spent a career in this industry."

Format: bullet list of checkable facts, one-sentence claim, a gap-check paragraph, then the narrative paragraph.`,
    variables: [
      {
        name: 'founder_background',
        description: 'Your relevant work history, roughly, in your own words',
        example:
          '6 years as a dental office manager, then 2 years building internal tools at a dental billing software company',
        required: true,
      },
      {
        name: 'startup_problem_space',
        description: 'The problem your startup addresses',
        example: 'Manual insurance claim paperwork for dental clinics',
        required: true,
      },
      {
        name: 'unique_insight_or_advantage',
        description:
          'Any specific insight or edge you think you have, if you have one in mind',
        example:
          'I know exactly which fields office managers re-type across three separate systems because I did it myself',
        required: false,
      },
      {
        name: 'how_you_learned_about_problem',
        description: 'How you personally ran into this problem',
        example: 'Lived it daily as an office manager before moving into software',
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
      "Founder-market fit is a real, named diligence criterion — most seed-stage investors, YC included, weight 'why is this specific founder unusually positioned to win this market' as its own line item, separate from whether the idea itself is good. They've also heard generic passion framing so often ('I've always been passionate about healthcare') that it now functions as a mild negative signal rather than a positive one, because it's unfalsifiable and every applicant can say it. Restricting the claim to checkable facts — a specific role, a specific prior project, a specific failure — is what makes the narrative credible under a follow-up question, and the explicit gap-check step matters just as much: manufacturing an unfair advantage that doesn't really exist is easy to spot and expensive to a founder's credibility the moment an investor asks one clarifying question the story can't survive.",
    exampleOutput: `Checkable facts:
- 6 years as a dental office manager, handling insurance claim submissions directly
- 2 years building internal tools at a dental billing software company, working with the exact systems office managers re-enter data across

One-sentence claim: This founder spent 6 years personally doing the manual claim data-entry work this product automates, then spent 2 years building software for the exact systems that work happens across.

Gap-check: No stated sales or distribution advantage into dental clinics beyond personal network from the prior job — worth naming honestly as a gap rather than implying a go-to-market edge that isn't established yet.

Narrative: Before building software, [Founder] spent 6 years as a dental office manager personally re-entering insurance claim data across three disconnected systems every day. They later spent 2 years building internal tools at a dental billing software company, working directly with those same systems from the vendor side. [Company] exists because they've done this exact job manually and knows precisely which fields cost the most time.`,
    verifiedAgainst: [{ tool: 'Claude', version: 'Sonnet 5', date: '2026-08-07' }],
    changelog: [{ date: '2026-08-07', note: 'Initial publish.' }],
  },
]
