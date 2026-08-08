import type { Prompt } from '../types'

/**
 * Sales & Outreach (Tier 2) — the 1:1 selling conversation and pipeline-
 * movement layer, deliberately distinct from two neighboring categories:
 * `ads` (paid marketing, campaign copy, UTM/attribution) and `business-ops`
 * (proposals-from-scratch, invoicing, client onboarding for services
 * businesses). Every prompt here assumes an actual deal or prospect in
 * motion — cold outreach personalization, MEDDIC-based discovery, objection
 * handling, cadence design, tailoring an existing proposal to one buyer's
 * discovery answers, champion enablement, deal-risk scoring, renewal/upsell
 * conversations, competitor battle cards, LinkedIn prospecting, CRM note
 * structuring, and lost-deal post-mortems.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'cold-email-from-a-specific-trigger-event',
    category: 'sales',
    title: "Turn one research signal into a cold email that doesn't read like a template",
    description:
      'Build a cold-outreach email around a single verifiable trigger event instead of a generic personalization token, with banned generic openers spelled out.',
    promptText: `I'm writing a cold email to {{prospect_name}}, {{prospect_title}} at {{company_name}}. I want to open with ONE specific, real signal about them or their company — not a generic compliment.

The trigger/signal I found: {{trigger_signal}}
What we sell: {{product_or_service}}
The specific problem it solves that connects to this trigger: {{relevance_link}}
What I want them to do next: {{cta}}

Write a cold email following this structure, each part as ONE sentence except where noted:
1. OBSERVATION — reference {{trigger_signal}} specifically enough that they could not mistake this for a mass email. No "I noticed you're the {{prospect_title}} at {{company_name}}" openers — that's not a signal, that's a mail-merge field.
2. RELEVANCE — connect the observation to a problem {{company_name}} likely has right now, using {{relevance_link}}. Do not pitch yet.
3. VALUE — one sentence naming what we do, framed as the solution to the problem just named, not a feature list.
4. ASK — {{cta}}, framed as a low-friction yes/no question, not "let me know if you're interested."

Constraints: under 90 words total. No "I hope this email finds you well." No em dashes. Write 3 variants that differ in the observation-to-relevance bridge, not just synonym-swapping, so I can see genuinely different angles.

After the 3 variants, tell me honestly whether {{trigger_signal}} is strong enough to build an email around, or too generic to use — say so even if it means the answer is "this one's weak."`,
    variables: [
      {
        name: 'prospect_name',
        description: 'The person you are emailing',
        example: 'Priya Menon',
        required: true,
      },
      {
        name: 'prospect_title',
        description: "The prospect's job title",
        example: 'VP of Operations',
        required: true,
      },
      {
        name: 'company_name',
        description: 'Their company',
        example: 'Fenwick Logistics',
        required: true,
      },
      {
        name: 'trigger_signal',
        description:
          'The specific, verifiable fact you found — a funding round, job change, product launch, hiring page, LinkedIn post — not a guess',
        example: 'Posted on LinkedIn last week about opening a third regional warehouse',
        required: true,
      },
      {
        name: 'product_or_service',
        description: 'What you sell, in plain terms',
        example: 'route-planning software for multi-warehouse logistics teams',
        required: true,
      },
      {
        name: 'relevance_link',
        description:
          'The one-sentence reasoning connecting the trigger to a problem your product solves',
        example:
          'A third warehouse usually means route planning that worked for two locations starts breaking down',
        required: true,
      },
      {
        name: 'cta',
        description: 'The low-friction next step you want',
        example: 'Worth a 15-minute call next week, or is this not the right time?',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Apollo.io'],
    tags: [
      'cold-email',
      'outbound',
      'personalization',
      'prospecting',
      'trigger-events',
      'b2b-sales',
    ],
    whyItWorks:
      'Naming and banning the specific generic opener ("I noticed you\'re the {{prospect_title}} at {{company_name}}") is the load-bearing move here — that exact sentence pattern is what makes mail-merge personalization instantly recognizable, and most prompts never rule it out explicitly. Capping the email at 90 words and forcing three variants that differ in reasoning path, not phrasing, stops the model from padding with filler or generating three emails that make the identical point in different words. The closing instruction to call out a weak trigger signal matters because a model asked only to "write the email" will personalize convincingly around a signal that has no real relevance link, which is how forced personalization ends up reading worse than no personalization at all.',
    exampleOutput:
      'Priya — saw your post about the third warehouse going live next month. Most route-planning setups that work fine for two sites start falling apart once a third hub enters the mix — drivers end up covering overlapping zones nobody planned for. We built routing software specifically for that multi-warehouse handoff. Worth 15 minutes next week, or is this not the right time?',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-14' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-16' },
    ],
    changelog: [
      {
        date: '2026-07-16',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'meddic-discovery-call-question-script',
    category: 'sales',
    title: 'Build a MEDDIC discovery-call question script for one specific deal',
    description:
      'Generate open-ended discovery questions mapped to each MEDDIC pillar for a named deal, so the call surfaces real qualification gaps instead of generic rapport-building chat.',
    promptText: `I have a discovery call coming up with {{contact_name}}, {{contact_title}} at {{company_name}}, a {{deal_stage}} deal for {{product_or_service}}. Here's what I already know: {{known_context}}.

Build a MEDDIC-based discovery question script for this specific call — not a generic list. Reference what I already know above wherever it's relevant.

For each MEDDIC pillar, give me 2-3 open-ended questions (no yes/no questions) plus one embedded follow-up to use if their first answer comes back vague:

- METRICS — what quantifiable outcome would make this a win for them
- ECONOMIC BUYER — who actually signs off on budget, and how to ask this without sounding like I'm trying to go around {{contact_name}}
- DECISION CRITERIA — what they'll formally evaluate options against
- DECISION PROCESS — the actual steps and timeline between "interested" and "signed"
- IDENTIFY PAIN — the specific, costed pain driving urgency now, not a generic pain point
- CHAMPION — whether {{contact_name}} has the standing and motivation to sell this internally when I'm not in the room

Then flag which 2 pillars are the biggest qualification risk for this deal based on {{known_context}}, and tell me which single question I should prioritize per pillar if the call runs short on time.`,
    variables: [
      {
        name: 'contact_name',
        description: 'Who you are speaking with',
        example: 'David Okafor',
        required: true,
      },
      {
        name: 'contact_title',
        description: "This person's title",
        example: 'Director of Customer Support',
        required: true,
      },
      {
        name: 'company_name',
        description: 'Their company',
        example: 'Clearline Payments',
        required: true,
      },
      {
        name: 'deal_stage',
        description: 'Where this deal sits right now',
        example: 'second call, post-demo, no economic buyer identified yet',
        required: true,
      },
      {
        name: 'product_or_service',
        description: 'What you are selling',
        example: 'a help-desk platform with AI-assisted ticket routing',
        required: true,
      },
      {
        name: 'known_context',
        description:
          'What you already know about the deal, team, or pain — used to tailor the questions instead of generating a generic script',
        example:
          'They mentioned support tickets doubled after a product launch; David keeps saying "we" but has never named a budget owner',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'meddic',
      'discovery-call',
      'sales-qualification',
      'b2b-sales',
      'pipeline',
      'question-script',
    ],
    whyItWorks:
      'MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion) is a documented enterprise-sales qualification framework precisely because each pillar catches a different way deals stall later — a deal with strong pain but no confirmed economic buyer looks healthy on a call and then goes quiet for a month. Forcing open-ended questions plus a vague-answer follow-up mirrors how discovery actually works: the first answer to "how are you measuring success" is almost always too soft to qualify on, and a script without a follow-up baked in leaves reps stuck when that happens. Asking the model to name the two riskiest pillars from your actual known_context, not a generic warning, is what turns a checklist into deal-specific prep.',
    exampleOutput:
      'ECONOMIC BUYER — "Beyond your team, who signs off when a tool like this gets approved for budget?" Follow-up if vague: "If this were approved tomorrow, whose signature would actually be on the PO?"\n\nBiggest risk pillars for this deal: Economic Buyer and Decision Process — David keeps saying "we" without naming anyone, which usually means either he doesn\'t know who the buyer is or hasn\'t asked. Prioritize the Economic Buyer question if time is short.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-20' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'sales-objection-handling-response-script',
    category: 'sales',
    title: 'Turn a real objection into an isolate-and-respond script, not a rebuttal',
    description:
      'Build a response to a specific objection you actually heard using the isolate-the-real-objection technique, so you address the actual blocker instead of the first thing they said.',
    promptText: `A prospect just said this during a sales call: "{{objection_verbatim}}"

Context: deal stage is {{deal_stage}}, they're evaluating us against {{competitor_or_alternative}}, and here's what I know about their priorities so far: {{known_priorities}}.

Help me respond using the isolate-the-real-objection technique instead of rebutting the surface statement:

1. ACKNOWLEDGE — one sentence that shows I heard them without agreeing or conceding yet.
2. ISOLATE — one question that tests whether "{{objection_verbatim}}" is the real blocker or a stand-in for something else (price objections are often a value or urgency problem in disguise; give me a question that would surface which one this is).
3. TWO RESPONSE PATHS — write a version of the response for each way they could answer the isolating question, so I'm not stuck if the first path doesn't fit.
4. CONFIRM — one closing question that checks whether the objection is actually resolved, not just whether they've stopped arguing.

Keep every line something I could actually say out loud on a call — no marketing language, no more than 2 sentences per step.

Then tell me: based on {{known_priorities}}, is this objection likely genuine, or a polite way of saying no to something else? Be direct even if the honest answer is "you may be further behind in this deal than the objection suggests."`,
    variables: [
      {
        name: 'objection_verbatim',
        description:
          'What the prospect actually said, as close to word-for-word as you have it',
        example: "It's more than we budgeted for this year.",
        required: true,
      },
      {
        name: 'deal_stage',
        description: 'Where this deal sits right now',
        example: 'proposal sent, second follow-up',
        required: true,
      },
      {
        name: 'competitor_or_alternative',
        description:
          'What they are evaluating against, including "doing nothing" if that applies',
        example: 'a cheaper competitor and the option of doing nothing this year',
        required: false,
      },
      {
        name: 'known_priorities',
        description: 'What you already know about what this buyer actually cares about',
        example:
          'They said the current process costs them a full day per week in manual work',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gong'],
    tags: [
      'objection-handling',
      'discovery-call',
      'negotiation',
      'b2b-sales',
      'sales-scripts',
    ],
    whyItWorks:
      'Isolating the objection before responding to it is a standard technique across Sandler- and SPIN-derived sales training precisely because surface objections are frequently a proxy: "it\'s too expensive" is often really "I haven\'t seen enough value" or "I\'m not the one who has to justify this," and a rebuttal aimed at price alone leaves the real blocker untouched. Writing two response paths instead of one forces branching prep rather than a single memorized line that breaks the moment the conversation goes sideways. The confirm step targets a specific, common failure: reps who treat an objection as handled the moment the prospect stops pushing back, rather than when they\'ve actually agreed — those are not the same event.',
    exampleOutput:
      '2. ISOLATE: "If the budget wasn\'t a constraint at all, is this the direction you\'d want to go — or is there something else giving you pause too?"\n\n4. CONFIRM: "Does that change how this fits for this year, or is budget still the thing standing in the way?"',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-24' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-25' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'post-call-follow-up-cadence-sequence',
    category: 'sales',
    title: 'Build a follow-up cadence that never repeats "just checking in"',
    description:
      'Turn one open item from a sales call into a multi-touch, multi-channel cadence where every touch adds a new piece of value, ending in an explicit break-up message instead of silence.',
    promptText: `I need a follow-up cadence after {{last_interaction}} with {{contact_name}} at {{company_name}}. Deal stage: {{deal_stage}}. What's still open/unresolved: {{open_item}}. Channels I can use: {{channels}}.

Build a {{num_touches}}-touch cadence over {{cadence_length}}, mixing the channels listed. For every touch, give me:
- Day number (relative to today)
- Channel
- The ONE new piece of value, information, or reason to reply it adds — no touch may just restate the last one or say "following up" / "just checking in" / "wanted to bump this"
- The exact message or call talking point, ready to send/say

The last touch must be an explicit break-up message: state plainly that you'll stop reaching out, and give them one easy way to restart contact later, without guilt-tripping them.

After the cadence, tell me which single touch is most likely to actually get a response given {{open_item}}, and why the others are more likely to be ignored.`,
    variables: [
      {
        name: 'last_interaction',
        description: 'What just happened before this cadence starts',
        example: 'a demo where they said budget approval was pending',
        required: true,
      },
      {
        name: 'contact_name',
        description: 'Who you are following up with',
        example: 'Sarah Lindqvist',
        required: true,
      },
      {
        name: 'company_name',
        description: 'Their company',
        example: 'Northbridge Analytics',
        required: true,
      },
      {
        name: 'deal_stage',
        description: 'Where this deal sits right now',
        example: 'post-demo, awaiting internal budget sign-off',
        required: true,
      },
      {
        name: 'open_item',
        description: "What's unresolved that this cadence needs to move forward",
        example: 'whether the CFO has actually seen the proposal yet',
        required: true,
      },
      {
        name: 'channels',
        description: 'The channels available for this cadence',
        example: 'email, LinkedIn, phone',
        required: true,
      },
      {
        name: 'num_touches',
        description: 'How many touches the cadence should have',
        example: '5',
        required: true,
      },
      {
        name: 'cadence_length',
        description: 'How long the cadence should run',
        example: '3 weeks',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Outreach.io'],
    tags: [
      'follow-up',
      'sales-cadence',
      'outbound',
      'pipeline',
      'multi-channel',
      'b2b-sales',
    ],
    whyItWorks:
      'Banning "just checking in" and "bumping this" is grounded in a well-documented pattern in outbound sales: near-zero-value bump messages consistently get the lowest reply rates of any touch in a cadence because they ask for the prospect\'s time without offering anything new. Requiring one new piece of value per touch forces the model to justify why each touch deserves to exist rather than generating five variations of the same nudge. The mandatory break-up message is a standard cadence-design principle for a specific reason: sequences that end with an explicit exit message reliably out-reply ones that just trail off, because stating "I\'ll stop reaching out" triggers a reply from prospects who don\'t want to be dropped but hadn\'t gotten around to responding.',
    exampleOutput:
      'Day 12 — LinkedIn: "Sarah — I\'ll stop following up on this one for now. If the timing shifts on your end, just reply here and I\'ll pick it back up — no explanation needed." Most likely to land: Day 3 email, since it offers the ROI one-pager the CFO would actually need to sign off, not a status check.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-27' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'tailor-a-sales-proposal-to-discovery-call-findings',
    category: 'sales',
    title: 'Rework a standard proposal around what one buyer actually said in discovery',
    description:
      "Take your standard proposal outline and a buyer's specific discovery answers, then get back exactly which sections to reorder, cut, or rewrite so the proposal argues their case, not your default pitch.",
    promptText: `I have a standard proposal/deck outline for {{product_or_service}}. Current sections, in order: {{current_outline}}.

Here's what this specific buyer, {{contact_name}} at {{company_name}}, told me in discovery:
- Their stated success metric: {{success_metric}}
- Their decision criteria (what they said they're evaluating options against): {{decision_criteria}}
- Who else is involved in the decision and what they likely care about: {{other_stakeholders}}
- Budget/timeline signals: {{budget_timeline_signal}}
- Competing option, if any: {{competing_option}}

Rework the proposal for this buyer specifically:
1. Reorder the sections so the one matching {{decision_criteria}} comes right after the opening, not wherever it sits in {{current_outline}}.
2. For each section, tell me whether to keep, cut, or rewrite it — and if rewrite, give me the new framing in one sentence using their language from {{success_metric}}, not generic feature language.
3. Write one paragraph addressing {{other_stakeholders}} directly — the concern they'd raise that {{contact_name}} alone can't answer.
4. If {{competing_option}} is filled in, write one paragraph that draws a fair contrast without naming or badmouthing them directly.

Flag anywhere I'm asking you to tailor language for a criterion I haven't actually confirmed they hold — don't let me overclaim fit based on a guess.`,
    variables: [
      {
        name: 'product_or_service',
        description: 'What the proposal is for',
        example: 'a mid-market inventory forecasting platform',
        required: true,
      },
      {
        name: 'current_outline',
        description: 'Your existing proposal or deck section order',
        example:
          'Company overview, product features, case studies, pricing, implementation timeline',
        required: true,
      },
      {
        name: 'contact_name',
        description: 'Your primary contact for this deal',
        example: 'Marcus Webb',
        required: true,
      },
      {
        name: 'company_name',
        description: 'The buyer company',
        example: 'Bramwell Retail Group',
        required: true,
      },
      {
        name: 'success_metric',
        description: 'The outcome they said would make this a win, in their words',
        example: 'cutting stockouts on their top 200 SKUs by half before peak season',
        required: true,
      },
      {
        name: 'decision_criteria',
        description: "What they said they'll evaluate options against",
        example: 'ease of integration with their existing ERP, and time-to-first-value',
        required: true,
      },
      {
        name: 'other_stakeholders',
        description: 'Who else is involved and what they likely care about',
        example: 'the CFO, who will care about implementation cost and payback period',
        required: false,
      },
      {
        name: 'budget_timeline_signal',
        description: 'Anything they said about budget or timeline',
        example: 'wants to be live before their Q4 peak season, budget not yet confirmed',
        required: false,
      },
      {
        name: 'competing_option',
        description: 'A named competitor or alternative they mentioned, if any',
        example: 'a cheaper point solution they already trialed',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'proposal',
      'meddic',
      'decision-criteria',
      'b2b-sales',
      'sales-enablement',
      'pipeline',
    ],
    whyItWorks: `This is deliberately an edit-and-reorder task, not a from-scratch proposal generator — it assumes you already have a standard deck and need it to argue one buyer's specific case. That's a direct application of MEDDIC's Decision Criteria pillar: map your pitch to what they said they'd evaluate against, in their own words, rather than your default feature order. The stakeholder paragraph mirrors the real B2B buying-committee dynamic where a single champion can't pre-answer every question a CFO or IT lead will raise once the proposal circulates without you in the room. The explicit instruction to flag ungrounded tailoring is what stops the model from quietly inventing a fit-claim for a criterion you never actually confirmed the buyer holds — the most common way a "tailored" proposal ends up overclaiming.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'champion-enablement-internal-pitch-one-pager',
    category: 'sales',
    title:
      'Give your internal champion the ammo to sell the deal when you are not in the room',
    description:
      'Turn what you know about a deal into a one-page internal pitch your champion can use to defend it to their own stakeholders, anticipating the objections you will never hear directly.',
    promptText: `{{champion_name}} at {{company_name}} is championing {{product_or_service}} internally but needs to convince {{internal_stakeholders}}, who I have no direct access to. Likely priorities: {{stakeholder_priorities}}. The internal concern I'm most worried about: {{anticipated_objection}}.

Write a one-page internal pitch document {{champion_name}} could forward or present, written in their voice — a colleague recommending this, not a vendor pitching it:

1. A 2-sentence framing of the problem, in {{company_name}}'s language, not our marketing language.
2. Why now — the cost of waiting, specific to {{stakeholder_priorities}}.
3. What was evaluated and why this won. If {{competing_option}} is given, contrast fairly; if not, skip this section rather than inventing a comparison.
4. A pre-emptive answer to {{anticipated_objection}} — written as {{champion_name}} addressing it themselves, not as a rebuttal coming from us.
5. The ask — the one specific decision or approval needed next, stated plainly.

Keep it under 400 words, no vendor superlatives ("best-in-class", "cutting-edge"), and written so {{champion_name}} doesn't have to defend a claim they can't personally back up if challenged.`,
    variables: [
      {
        name: 'champion_name',
        description: 'Your internal advocate at the buying company',
        example: 'Renata Silva',
        required: true,
      },
      {
        name: 'company_name',
        description: 'The buying company',
        example: 'Solstice Cloud Services',
        required: true,
      },
      {
        name: 'product_or_service',
        description: 'What is being championed',
        example: 'a vendor-risk monitoring platform',
        required: true,
      },
      {
        name: 'internal_stakeholders',
        description:
          'Who your champion needs to convince that you have no direct access to',
        example: 'the CISO and the head of procurement',
        required: true,
      },
      {
        name: 'stakeholder_priorities',
        description: 'What those stakeholders likely care about',
        example:
          'audit readiness before their SOC 2 renewal, and avoiding new vendor sprawl',
        required: true,
      },
      {
        name: 'anticipated_objection',
        description: "The internal pushback you're most worried about",
        example: 'that this overlaps with a tool they already pay for',
        required: true,
      },
      {
        name: 'competing_option',
        description: 'A named alternative that was evaluated, if any',
        example: 'an in-house spreadsheet-based process',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'champion-enablement',
      'meddic',
      'enterprise-sales',
      'internal-selling',
      'b2b-sales',
    ],
    whyItWorks:
      "Champion enablement is a named concept inside MEDDIC's Champion pillar for a specific reason: a champion with real motivation but no ammunition still loses internal battles, because they get asked a question in a room you're not in and have nothing prepared to say. Writing the document in the champion's voice rather than vendor voice is what makes it usable — a deck that reads as obviously vendor-written loses credibility the moment a champion forwards it internally under their own name. The instructions to skip the comparison section rather than invent one, and to avoid superlatives the champion can't personally defend, directly target the risk of over-arming a champion with talking points that collapse the moment their own stakeholder pushes back with a follow-up question the champion can't answer.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'deal-risk-assessment-before-forecast-call',
    category: 'sales',
    title: 'Stress-test a deal before you call it committed on the forecast',
    description:
      "Run a specific deal's signals against the documented ways B2B deals actually slip, so real risk gets flagged before a forecast call instead of after the deal slides another quarter.",
    promptText: `I need an honest risk read on this deal before I call it {{forecast_category}} on our forecast.

Deal: {{company_name}}, {{deal_value}}, expected close {{expected_close_date}}.
Last contact: {{last_contact_date}} with {{last_contact_person}}.
Stakeholders engaged so far: {{stakeholders_engaged}}.
Economic buyer confirmed: {{economic_buyer_status}}.
Next step booked: {{next_step_status}}.
Anything that's changed or gone quiet recently: {{recent_changes}}.

Assess this deal against these known ways deals slip, and for each, tell me if it applies here and how strongly:
1. SINGLE-THREADED — only one stakeholder engaged, no relationship with the actual economic buyer
2. NO CONFIRMED NEXT STEP — momentum exists but nothing is calendared
3. VERBAL YES, NO PROCESS — enthusiasm without a confirmed decision process or timeline
4. GOING QUIET — a drop in responsiveness that doesn't match the stated urgency
5. COMPETITIVE OR STATUS-QUO RISK — a real alternative (including "do nothing") that hasn't been ruled out

Give me an overall risk level (Low/Medium/High) with the ONE reason driving that level, not an average of five scores. Then give me the single next action that would most reduce risk, not a list of five things to do.

Be willing to tell me this deal should move to a later quarter or be marked at-risk even if that's not what I want to hear going into the forecast call.`,
    variables: [
      {
        name: 'company_name',
        description: 'The account this deal is with',
        example: 'Vantage Freight Co.',
        required: true,
      },
      {
        name: 'deal_value',
        description: 'The deal size',
        example: '$68,000 ACV',
        required: true,
      },
      {
        name: 'expected_close_date',
        description: 'The date currently on the forecast',
        example: 'August 29, 2026',
        required: true,
      },
      {
        name: 'last_contact_date',
        description: 'When you last actually heard from them',
        example: '11 days ago',
        required: true,
      },
      {
        name: 'last_contact_person',
        description: 'Who that last contact was with',
        example: 'the ops manager, not the VP who was on earlier calls',
        required: false,
      },
      {
        name: 'stakeholders_engaged',
        description: 'Who has actually been part of the conversation so far',
        example: 'one ops manager; no one from finance or leadership has joined a call',
        required: true,
      },
      {
        name: 'economic_buyer_status',
        description: 'Whether the actual budget owner has been identified and engaged',
        example:
          'named but never joined a call — all info is secondhand from the ops manager',
        required: true,
      },
      {
        name: 'next_step_status',
        description: 'Whether a concrete next step with a date is on the calendar',
        example: 'no, they said they would "circle back after budget review"',
        required: true,
      },
      {
        name: 'recent_changes',
        description: 'Any recent shift in responsiveness, org changes, or urgency',
        example: 'went from replying same-day to no response in over a week',
        required: false,
      },
      {
        name: 'forecast_category',
        description: 'What you were about to call this deal',
        example: 'commit',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Clari'],
    tags: [
      'deal-risk',
      'forecasting',
      'pipeline-review',
      'sales-management',
      'b2b-sales',
    ],
    whyItWorks:
      'The checklist is built from documented, recurring reasons enterprise deals slip — single-threading, verbal-yes-without-process, and unconfirmed next steps are the same signal categories revenue-intelligence platforms like Clari and Gong quantify from call and email metadata; this prompt applies the same logic manually from what a rep already knows without needing that instrumentation. Forcing one reason to drive the overall risk level, instead of an averaged score, closes the most common failure of a risk write-up that nets out to a vague "medium" without telling anyone what to actually fix. The explicit instruction to be willing to downgrade the forecast counters sunk-cost bias — reps walking into a forecast call they already verbally committed to their manager have a structural incentive to round every ambiguous signal up, not down.',
    exampleOutput:
      'Overall risk: HIGH. Driving reason: the economic buyer has never joined a call and everything about their position is secondhand from the ops manager — this is a single-threaded deal wearing a "commit" label. Single next action: get a call booked with the named economic buyer before this stays on the forecast at this stage.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'renewal-upsell-conversation-from-usage-data',
    category: 'sales',
    title: 'Build a renewal or upsell conversation around value already delivered',
    description:
      'Turn account usage and outcome data into a renewal or expansion talk track that leads with proof of value realized, so pricing becomes the second conversation, not the opener.',
    promptText: `Renewal/expansion conversation coming up with {{account_name}}, contract {{renewal_or_upsell}}, current contract ends {{contract_end_date}}.

What we know about their usage and outcomes: {{usage_data}}
Original goal when they signed: {{original_goal}}
Any friction or underuse we should acknowledge honestly: {{friction_points}}
What we want to propose: {{proposed_change}}

Build a talk track for this conversation in this order:
1. OPEN with a specific outcome from {{usage_data}} tied back to {{original_goal}} — proof, not a thank-you-for-being-a-customer line.
2. If {{friction_points}} is filled in, acknowledge it directly before moving on — don't let the value story paper over a real problem they'll bring up anyway.
3. Bridge to {{proposed_change}} as the logical next step given the outcome just described, not as a separate pricing conversation.
4. Handle the most likely pushback specific to whether this is a renewal or an upsell (renewal: "why increase price for the same thing"; upsell: "we're not even using what we already have") and give me the actual response.
5. Close with one specific next step and date, not "let's stay in touch."

Write it as talking points I'd use on a call, not a script to read verbatim. If {{usage_data}} doesn't actually support a strong value story, tell me that instead of manufacturing one.`,
    variables: [
      {
        name: 'account_name',
        description: 'The customer account',
        example: 'Ashgrove Manufacturing',
        required: true,
      },
      {
        name: 'renewal_or_upsell',
        description: 'Which type of conversation this is',
        example: 'renewal, with a proposed 15% price increase',
        required: true,
      },
      {
        name: 'contract_end_date',
        description: 'When the current contract ends',
        example: 'October 1, 2026',
        required: true,
      },
      {
        name: 'usage_data',
        description:
          'What you actually know about how they use the product and what it produced',
        example:
          'processed 40% more orders through the platform than last year with the same headcount',
        required: true,
      },
      {
        name: 'original_goal',
        description: 'What they said they wanted when they signed',
        example: 'handle order growth without adding headcount in the warehouse',
        required: true,
      },
      {
        name: 'friction_points',
        description: 'Any real underuse or complaint worth acknowledging honestly',
        example: 'one team stopped using the reporting module after a rocky rollout',
        required: false,
      },
      {
        name: 'proposed_change',
        description: 'What you want to propose',
        example: 'renewing at the higher tier that unlocks multi-warehouse reporting',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gainsight'],
    tags: ['renewal', 'upsell', 'customer-success', 'account-management', 'b2b-sales'],
    whyItWorks:
      "Leading with a specific usage outcome tied back to the original signing goal is the standard alternative to a discount-led renewal — framing the conversation around realized value rather than price tends to hold up better under pushback than a discount-led approach, because a price-led opener invites a price-led objection by default. Acknowledging real friction before the value pitch, not after, matters because a customer will bring up the rocky reporting-module rollout themselves the moment you finish talking, and addressing it first removes their easiest way to discount everything else you just said. The instruction to admit when usage_data doesn't support a strong story is a direct guard against the model manufacturing a value narrative from thin or genuinely weak inputs.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'competitor-battle-card-for-sales-calls',
    category: 'sales',
    title: 'Build a competitor battle card you can actually use mid-call',
    description:
      'Turn what you know about a named competitor into a scannable, honest battle card — including where they beat you — built for a glance mid-call, not a slide nobody reads.',
    promptText: `Build a battle card for when we're up against {{competitor_name}} in a deal. What we know about them: {{competitor_known_info}}. Our actual differentiation, as far as we can honestly claim it: {{our_differentiation}}. Deals we've won or lost against them before: {{past_deal_history}}.

Structure it for a rep to glance at mid-call, not read as a document:

1. WHEN THEY COME UP — the 1-sentence version of how prospects usually describe {{competitor_name}} when comparing us, based on {{past_deal_history}} if given.
2. WHERE THEY'RE ACTUALLY STRONGER — be honest about this, at least one point, using {{competitor_known_info}}. A battle card that claims we win everywhere gets a rep caught flat-footed.
3. WHERE WE WIN — {{our_differentiation}}, stated as buyer-facing outcomes, not internal feature comparisons.
4. LANDMINES TO AVOID SETTING OFF — questions or claims that would let {{competitor_name}} counter easily, so I know what not to say.
5. THREE PROOF POINTS — customer outcomes or specifics I could cite, flagged clearly if they're illustrative examples rather than verified facts I've confirmed.
6. ONE QUESTION TO ASK — that surfaces whether the prospect's actual priorities favor us over {{competitor_name}}, without badmouthing them.

Keep each section to 2-3 lines max — this needs to be scannable in the 10 seconds before I unmute.`,
    variables: [
      {
        name: 'competitor_name',
        description: 'The competitor this battle card is for',
        example: 'Ledgerline',
        required: true,
      },
      {
        name: 'competitor_known_info',
        description:
          'What you actually know about them — pricing, positioning, gaps, strengths',
        example: 'cheaper entry tier, but no native integration with major ERPs',
        required: true,
      },
      {
        name: 'our_differentiation',
        description: 'What you can honestly claim as your differentiation',
        example: 'native ERP integrations and same-day onboarding',
        required: true,
      },
      {
        name: 'past_deal_history',
        description: 'What has actually happened in past deals against this competitor',
        example: 'won 3 of the last 4 head-to-head deals where ERP integration mattered',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Klue'],
    tags: [
      'battle-card',
      'competitive-intelligence',
      'sales-enablement',
      'objection-handling',
      'b2b-sales',
    ],
    whyItWorks:
      'The explicit "where they\'re actually stronger" section targets the single biggest failure mode of internally-written battle cards: content that only lists advantages reads as marketing, not intelligence, and a rep who trusts it gets blindsided the first time a prospect raises the exact weakness the card never mentioned. Flagging proof points as illustrative versus verified stops the model from inventing a customer outcome that sounds like a citable stat but isn\'t something you can actually back up if a prospect asks for the account name. The line-capped, scannable format matches how battle cards actually get used in practice — glanced at in the seconds before unmuting on a call, not read start to finish like a memo.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'linkedin-prospecting-message-from-profile-signals',
    category: 'sales',
    title: 'Write a LinkedIn outreach message that earns a reply before you ever pitch',
    description:
      "Build a two-touch LinkedIn sequence — a connection note under the platform's 300-character limit and a value-first follow-up — using specific profile signals instead of a recycled connection request.",
    promptText: `I want to reach out to {{prospect_name}}, {{prospect_title}} at {{company_name}}, on LinkedIn. Here's what's actually on their profile or recent activity: {{profile_signal}}. What we do: {{product_or_service}}. The reason I think this is relevant to them specifically: {{relevance_reason}}.

Write two messages:

1. CONNECTION NOTE — under 300 characters (LinkedIn's hard limit), referencing {{profile_signal}} specifically, with zero pitch. This message's only job is to be worth accepting.
2. FIRST MESSAGE AFTER THEY ACCEPT — sent as a follow-up, not immediately after connecting. Lead with something genuinely useful or interesting tied to {{relevance_reason}} — a specific observation, question, or resource — before any mention of {{product_or_service}}. If you can't avoid pitching in this message without it feeling hollow, say so instead of forcing a pitch in.

Tone: like a peer who did their homework, not a rep working a list. No "I came across your profile and was impressed by your experience" — that line shows up in more automated outreach than any other and reads as exactly that.

After both messages, tell me honestly whether {{profile_signal}} is specific enough to justify personalization, or generic enough that this will read like a templated message with a name swapped in.`,
    variables: [
      {
        name: 'prospect_name',
        description: 'Who you want to connect with',
        example: 'Anjali Rao',
        required: true,
      },
      {
        name: 'prospect_title',
        description: 'Their job title',
        example: 'Head of Revenue Operations',
        required: true,
      },
      {
        name: 'company_name',
        description: 'Their company',
        example: 'Wayfinder Analytics',
        required: true,
      },
      {
        name: 'profile_signal',
        description: 'Something specific and real from their profile or recent activity',
        example:
          'commented on a post about RevOps teams drowning in disconnected spreadsheets',
        required: true,
      },
      {
        name: 'product_or_service',
        description: 'What you offer',
        example: 'a RevOps reporting platform that unifies pipeline data across tools',
        required: true,
      },
      {
        name: 'relevance_reason',
        description: 'Why this profile signal is actually relevant to what you sell',
        example:
          'her comment specifically named the spreadsheet-reconciliation problem we solve',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'LinkedIn Sales Navigator'],
    tags: ['linkedin', 'social-selling', 'prospecting', 'outbound', 'b2b-sales'],
    whyItWorks:
      'LinkedIn actually caps connection request notes at 300 characters, so writing to that constraint from the start avoids drafting a message that gets silently truncated on send. Splitting into two touches reflects a real product-behavior pattern: pitching inside the connection note itself tends to lower accept rates, so delaying any ask to a second message sent after acceptance is a widely taught LinkedIn prospecting sequence rather than an arbitrary structure. Banning "I came across your profile and was impressed by your experience" targets the single most overused line in automated LinkedIn outreach — one that signals mail-merge to a recipient within the first few words, no matter how personalized the rest of the message is.',
    exampleOutput:
      'Connection note (187 chars): "Anjali — your comment about RevOps teams drowning in spreadsheet reconciliation hit close to home, that\'s the exact problem we spend our days on. Would love to connect."',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'sales-call-summary-to-crm-notes',
    category: 'sales',
    title: 'Turn a call transcript into structured CRM notes, not a wall of text',
    description:
      "Convert raw call notes or a transcript into the specific fields your CRM opportunity record actually uses, so the next person who opens the deal doesn't have to re-read the whole call.",
    promptText: `Here are my raw notes/transcript from a call with {{contact_name}} at {{company_name}}: {{raw_notes}}

Convert this into structured CRM notes using these exact fields, in this order — leave a field explicitly marked "not discussed" rather than guessing or leaving it blank:

- CALL SUMMARY (2-3 sentences, what actually happened)
- PAIN/USE CASE (their stated problem, in their words where possible)
- METRICS (any number, quota, or measurable outcome they mentioned)
- ECONOMIC BUYER (named person, or "not yet identified")
- DECISION CRITERIA (what they said they'll evaluate against)
- DECISION PROCESS/TIMELINE (steps and dates, or "not discussed")
- COMPETITION (named alternatives, or "none mentioned")
- RISKS/OPEN QUESTIONS (anything unresolved or concerning)
- NEXT STEP (the specific committed action and date — not "will follow up")

Rules: don't infer a field from vague language if it wasn't actually said — mark it "not discussed" instead of a confident-sounding guess. Keep each field to 1-2 lines. Flag if NEXT STEP wasn't actually confirmed on the call rather than writing one that sounds resolved.`,
    variables: [
      {
        name: 'contact_name',
        description: 'Who the call was with',
        example: 'Tomas Reyes',
        required: true,
      },
      {
        name: 'company_name',
        description: 'Their company',
        example: 'Halifax Freight Systems',
        required: true,
      },
      {
        name: 'raw_notes',
        description: 'Your raw notes or the call transcript, pasted as-is',
        example:
          "Tomas said their current dispatch process takes 3 hours a day of manual work, mentioned they're also looking at a competitor, said he'd need to check with his boss on budget, no firm next date set",
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Salesforce (Agentforce)', 'HubSpot (Breeze)'],
    tags: ['crm', 'call-notes', 'meddic', 'pipeline-hygiene', 'sales-ops', 'b2b-sales'],
    whyItWorks:
      'The fixed field list mirrors the actual opportunity-record structure most CRMs use, and maps directly onto MEDDIC fields many sales orgs already require, so the output can be pasted straight into the record instead of translated by hand first. The "not discussed" instruction is the load-bearing rule: AI-generated call summaries left unconstrained tend to smooth over gaps by inferring a plausible-sounding answer, which quietly corrupts CRM data — a fabricated Economic Buyer field is worse than an honestly empty one, because the next rep who opens the deal has no reason to double-check it. Flagging an unconfirmed next step rather than writing a tidy one directly targets pipeline hygiene, since vague next steps are one of the most common reasons deals stall without anyone noticing.',
    exampleOutput:
      'ECONOMIC BUYER: not yet identified — Tomas said he\'d "check with his boss," name not given.\nNEXT STEP: not confirmed — no date was set on the call; flag for follow-up to lock one in before this deal ages further.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
  {
    slug: 'lost-deal-post-mortem-analysis',
    category: 'sales',
    title: 'Run an honest post-mortem on a lost deal before writing it off as "budget"',
    description:
      'Turn your deal history and notes on a lost deal into a real post-mortem tested against actual loss-reason categories, instead of accepting the reflexive one-word reason logged and forgotten.',
    promptText: `We lost this deal: {{company_name}}, logged reason "{{logged_loss_reason}}". Deal history/notes: {{deal_history}}. Stage at time of loss: {{stage_at_loss}}.

Run a real post-mortem, not a rubber-stamp of the logged reason:

1. Test the logged reason "{{logged_loss_reason}}" against {{deal_history}} — does the evidence actually support it, or does it look like a proxy for something else (the most common example: a deal logged as "lost to competitor" or "budget" that was actually "no decision" — the prospect did nothing rather than actively choosing an alternative)?
2. Identify the earliest point in {{deal_history}} where this deal was already at risk, even if it didn't look like it then — a specific stage or interaction, not "communication could have been better."
3. Name ONE thing that, if done differently at that point, plausibly changes the outcome — must be specific and actionable, not "should have built more urgency."
4. Name ONE thing that was actually outside our control, so the takeaway isn't "everything was our fault."

Then give me a one-line lesson I could apply to the next deal at a similar stage — the kind of thing worth saying out loud in a pipeline review, not a vague "stay closer to the champion."`,
    variables: [
      {
        name: 'company_name',
        description: 'The account this lost deal was with',
        example: 'Greymoor Industrial',
        required: true,
      },
      {
        name: 'logged_loss_reason',
        description: 'The reason currently logged in the CRM',
        example: 'lost to competitor',
        required: true,
      },
      {
        name: 'deal_history',
        description: 'A summary of what actually happened across the deal',
        example:
          'strong first two calls, champion went quiet after their VP reorg was announced, one follow-up email got a one-line reply, then nothing; we assumed they picked a competitor',
        required: true,
      },
      {
        name: 'stage_at_loss',
        description: 'What stage the deal was marked lost at',
        example: 'proposal sent, awaiting signature',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Salesforce'],
    tags: [
      'win-loss-analysis',
      'post-mortem',
      'pipeline-review',
      'sales-coaching',
      'b2b-sales',
    ],
    whyItWorks:
      'Testing the logged reason against the actual evidence targets a well-documented pattern in B2B win/loss analysis: "no decision" — the prospect simply going quiet rather than actively choosing a competitor — is consistently one of the most common real outcomes in competitive deals, far more often than reps log it, because "lost to Competitor X" is a less uncomfortable box to check than "I never got a next step after their reorg." Forcing the model to name one in-control and one out-of-control factor prevents both failure modes of a post-mortem: the self-flagellating version that blames the rep for everything, and the defensive version that blames the market for everything — neither produces a lesson anyone can actually apply to the next deal.',
    exampleOutput:
      'The evidence doesn\'t clearly support "lost to competitor" — there\'s no mention of a competitor anywhere in the deal history, only a VP reorg followed by silence. This looks more like "no decision," with the reorg as the likely cause. Earliest risk point: the champion going quiet after the reorg was announced, with no attempt to identify a new stakeholder. Lesson: when a champion\'s org changes mid-deal, treat it as a re-qualification trigger, not a delay to wait out.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-07' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial version, verified against GPT-5.1 and Claude Sonnet 4.5.',
      },
    ],
  },
]
