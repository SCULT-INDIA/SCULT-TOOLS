import type { Prompt } from '../types'

/**
 * Business Ops & Client Comms — Tier 2, extends Invoice Generator and Email
 * Signature Generator (docs/research/prompt-library.md §4). The unglamorous
 * writing every small business repeats: proposals, invoice line items,
 * client follow-ups, onboarding, and the two emails nobody enjoys writing —
 * chasing late payment and declining scope creep.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'client-proposal-that-gets-signed',
    category: 'business-ops',
    title: 'Write a client proposal that gets signed without three rounds of edits',
    description:
      'Turn a scoped project into a one-page proposal a client can approve on first read — deliverables, timeline, and price stated plainly, with nothing for them to get stuck on.',
    promptText: `You are a proposal writer for a small service business. Write a one-page client proposal that a non-technical decision-maker can approve without asking us to explain it first.

Context:
- Client: {{client_name}}
- Project: {{project_type}}
- Deliverables: {{deliverables}}
- Timeline: {{timeline}}
- Price and terms: {{price}}
- Our business: {{your_business_name}}

Task:
1. Open with one sentence stating the problem this project solves for {{client_name}}, in their language, not ours.
2. List deliverables as a short, scannable list — no filler adjectives.
3. State the timeline with named milestones, not just a duration.
4. State price and payment terms plainly, in the same section as the deliverables, not buried at the bottom.
5. Close with exactly one next action (e.g. "reply to confirm and we'll send the contract") — not three optional ones.

Format: plain text suitable for pasting into an email body, under 300 words, no headers that just repeat "Introduction" or "About Us". No em dashes.`,
    variables: [
      {
        name: 'client_name',
        description: 'Who the proposal is addressed to',
        example: 'Meridian Dental Group',
        required: true,
      },
      {
        name: 'project_type',
        description: "What you're proposing to do, in plain terms",
        example: 'a 6-week rebuild of their booking website',
        required: true,
      },
      {
        name: 'deliverables',
        description: 'What they get, as a short list',
        example: 'new booking site, mobile checkout, 3 months of hosting',
        required: true,
      },
      {
        name: 'timeline',
        description: 'How long it will take and any milestones',
        example: 'design wks 1-2, build wks 3-5, launch wk 6',
        required: true,
      },
      {
        name: 'price',
        description: 'Total price and payment terms',
        example: '$4,200 total, 50% upfront, 50% on launch',
        required: true,
      },
      {
        name: 'your_business_name',
        description: 'Your business name, for the sign-off',
        example: 'Northline Studio',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['proposals', 'client-communication', 'sales', 'freelancing'],
    whyItWorks:
      "Proposals stall for one of two reasons: the reader can't find the number, or they can't tell what to do next. This structure fixes both — price sits next to the deliverables it buys instead of at the bottom where it reads like a surprise, and the proposal ends with a single explicit action instead of a vague \"let us know your thoughts,\" the easiest sentence in business writing to ignore. Opening with the client's problem in their own words, not a list of your capabilities, is what makes a proposal read as written for them instead of a template with their name swapped in.",
    exampleOutput: `Subject: Proposal — Booking site rebuild for Meridian Dental Group

Right now, patients dropping off mid-booking on mobile is costing Meridian real appointments. This proposal fixes that.

What you get:
- Rebuilt booking site, mobile-first checkout
- 3 months of hosting included
- Staff walkthrough before launch

Timeline: 6 weeks — design (wks 1-2), build (wks 3-5), launch (wk 6).

Price: $4,200 total — 50% to start, 50% on launch.

Reply to confirm and we'll send the contract to get started this week.

— Northline Studio`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-28' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-10' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Re-verified against Claude Sonnet 5 — no changes needed.',
      },
      {
        date: '2026-06-02',
        note: 'Added the single-next-action rule after early drafts kept ending with two competing calls to action.',
      },
    ],
    relatedToolSlug: 'invoice-generator',
  },
  {
    slug: 'overdue-invoice-follow-up-email',
    category: 'business-ops',
    title: 'Chase an overdue invoice without sounding like a threat',
    description:
      'Get a late-paying client to actually pay — firm, specific, and free of passive-aggressive hedging — with tone calibrated to exactly how many days overdue they are.',
    promptText: `You are writing a payment follow-up email on behalf of a small business owner. Match the tone to how overdue the invoice is — do not default to either over-apologetic or aggressive.

Context:
- Client: {{client_name}}
- Invoice: {{invoice_number}}, due {{due_date}}, amount {{amount_due}}
- Days overdue: {{days_overdue}}
- Sender: {{your_name}}

Task: Write a follow-up email calibrated by days overdue:
- Under 14 days overdue: assume oversight. Friendly, brief, treat it as a reminder, no apology for sending it.
- 14-30 days overdue: state the facts plainly (invoice number, amount, due date, days overdue) and ask for a specific action — payment, or a reply with a new date — by a specific day.
- Over 30 days overdue: state the next consequence plainly if your business has one (late fee, pausing further work) without hostility, and still offer one easy way to resolve it today.

In every version: exactly one call to action, no more than two short paragraphs, no exclamation points, no phrase that apologizes for asking to be paid.

Format: ready-to-send email with subject line.`,
    variables: [
      {
        name: 'client_name',
        description: 'Who the email is addressed to',
        example: 'Jordan',
        required: true,
      },
      {
        name: 'invoice_number',
        description: 'The invoice number being chased',
        example: 'INV-0042',
        required: true,
      },
      {
        name: 'amount_due',
        description: 'The outstanding amount',
        example: '$1,850',
        required: true,
      },
      {
        name: 'due_date',
        description: 'When the invoice was originally due',
        example: 'July 15, 2026',
        required: true,
      },
      {
        name: 'days_overdue',
        description: 'How many days past due today',
        example: '18',
        required: true,
      },
      {
        name: 'your_name',
        description: 'Your name and business, for the sign-off',
        example: 'Priya, Northline Studio',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['invoicing', 'collections', 'client-communication', 'late-payment'],
    whyItWorks:
      "Two failure modes account for almost every payment email that doesn't work: over-apologizing, which signals to the reader that payment is optional and negotiable, and jumping straight to threats, which damages a relationship before cheaper levers — a plain factual restatement, a deadline — have been tried. Calibrating tone to days-overdue means the first nudge doesn't read as an accusation and the third one doesn't read as a soft ask that's easy to keep deferring. Asking for exactly one thing also matters more than it looks: an email offering three options lets the reader pick the easiest one to ignore, which is usually none of them.",
    exampleOutput: `Subject: Invoice INV-0042 — 18 days past due

Hi Jordan,

Invoice INV-0042 for $1,850 was due July 15 and is now 18 days overdue. Could you confirm a payment date, or let me know if something's holding it up?

Happy to resend the invoice or adjust the payment method if that helps.

Thanks,
Priya, Northline Studio`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-22' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-05-30' },
    ],
    changelog: [
      { date: '2026-07-22', note: 'Re-verified — no changes.' },
      {
        date: '2026-05-30',
        note: 'Split into three tone bands by days overdue instead of one generic reminder template.',
      },
    ],
    relatedToolSlug: 'invoice-generator',
  },
  {
    slug: 'scope-of-work-from-a-vague-request',
    category: 'business-ops',
    title: 'Turn a vague client request into a scope of work they can actually sign',
    description:
      'Take a client\'s loose, verbal ask — "can you just also handle..." — and turn it into a written scope with explicit inclusions, exclusions, and assumptions, before work starts, not after a dispute.',
    promptText: `You are a scoping assistant for a small service business, helping turn a loosely-worded client request into a written scope before any work starts on it.

Context:
- Existing agreement: {{project_context}}
- Client's request, as stated: {{client_request}}
- Available budget/hours: {{budget_or_hours_available}}
- Our business: {{your_business_name}}

Task:
1. Restate the request as a specific, bounded task — name exactly what would and would not be included.
2. List explicit exclusions — things a reasonable person might assume are included but aren't, given how the request was phrased.
3. List assumptions you're making to scope this (frequency, who supplies content, revision rounds) — flag each one as something to confirm with the client, not something to guess and proceed on.
4. Write 2-3 questions to send the client before quoting or starting, if the request is too vague to scope confidently as-is.

Format: short internal note, not a client-facing email — headed sections (Scope, Exclusions, Assumptions to confirm, Questions to ask).`,
    variables: [
      {
        name: 'client_request',
        description: "Paste the client's ask, roughly as they said it",
        example:
          '"Can you also handle our social posts while you\'re at it, shouldn\'t be much extra work"',
        required: true,
      },
      {
        name: 'project_context',
        description: "What you're already scoped or contracted to do",
        example: 'Monthly website maintenance retainer, 5 hrs/month',
        required: true,
      },
      {
        name: 'budget_or_hours_available',
        description: 'Budget or hours you actually have room for',
        example: 'No extra hours available this month',
        required: false,
      },
      {
        name: 'your_business_name',
        description: 'Your business name',
        example: 'Northline Studio',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['scope-of-work', 'contracts', 'client-communication', 'freelancing'],
    whyItWorks:
      'Almost every scope dispute traces back to something neither side actually disagreed about — it\'s something nobody said out loud. Writing exclusions down is as important as writing inclusions down, because "not included" is information a vague request never carries on its own. Turning assumptions into an explicit confirm-with-client list, instead of silently assuming and proceeding, moves the risk of "I thought that was included" to before the work starts, when it\'s a two-line email, instead of after, when it\'s an argument over an invoice.',
    exampleOutput: `Scope: Write and schedule 4 social posts/month across existing channels, using content the client supplies.

Exclusions: No graphic design or photography; no paid ad spend or boosting; no new channel setup.

Assumptions to confirm: Client supplies raw content/photos by the 1st of each month; 1 revision round per post; existing retainer hours don't cover this — treat as separate.

Questions to ask: Is this ongoing or a one-off? Who supplies the photos? Is there a budget for this separate from the retainer?`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-15' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-06-18' },
    ],
    changelog: [
      { date: '2026-07-15', note: 'Re-verified, no changes.' },
      {
        date: '2026-06-18',
        note: 'Added the explicit exclusions section after testers kept only listing what was included.',
      },
    ],
  },
  {
    slug: 'billable-line-item-descriptions',
    category: 'business-ops',
    title:
      "Turn a scattered week of work into invoice line items a client won't question",
    description:
      'Feed in the loose, scratch-note-style list you kept while doing the work, and get back clear, client-facing line-item descriptions ready to paste straight into an invoice.',
    promptText: `You are helping a freelancer or small agency turn rough internal work notes into clean, client-facing invoice line items.

Context:
- Client: {{client_name}}
- Billing basis: {{billing_unit}}
- Raw notes: {{raw_work_notes}}

Task:
1. Group the notes into related tasks — don't invent categories that don't map to what's actually written.
2. Rewrite each group as one outcome-oriented line-item description a non-technical client would understand — describe what changed or was delivered, not the internal process.
3. Order line items chronologically or by category, whichever reads more clearly.
4. If a note is too vague to confidently describe (e.g. "stuff", "misc"), do not invent detail — list it separately under "Needs clarification before invoicing" instead of guessing.

Format: a bullet list of line items ready to paste into an invoice, followed by a short "Needs clarification" list if anything was too vague.`,
    variables: [
      {
        name: 'raw_work_notes',
        description: 'Your rough notes or to-dos from the week, pasted as-is',
        example:
          'mon: fixed checkout bug, called w/ jordan re: layout, wed-thu: rebuilt product page, emails back and forth',
        required: true,
      },
      {
        name: 'billing_unit',
        description: 'How you bill this client',
        example: 'hourly at $85/hr',
        required: true,
      },
      {
        name: 'client_name',
        description: 'Who the invoice is for',
        example: 'Meridian Dental Group',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['invoicing', 'billing', 'line-items', 'freelancing'],
    whyItWorks:
      'A line item that reads like internal shorthand — "fixed stuff," "calls" — is the single most common trigger for a client emailing back to ask what they\'re paying for, which delays payment more than almost anything else. Rewriting each note as the outcome it produced ("Resolved checkout failing on Safari mobile" instead of "fixed bug") ties the charge to something the client actually experienced, so there\'s nothing to question. Refusing to invent detail for a vague note matters just as much — a fabricated-sounding description that turns out wrong is worse for trust than an honest "needs clarification" line, and it keeps the invoice accurate instead of merely plausible.',
    exampleOutput: `- Resolved checkout page failing to load on Safari mobile (Mon)
- Client call re: homepage layout feedback (Tue)
- Rebuilt product page layout per feedback (Wed–Thu)
- Email correspondence and revisions on product page (Thu–Fri)

Needs clarification before invoicing: none this week.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-05' },
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-05-12' },
    ],
    changelog: [
      { date: '2026-07-05', note: 'Re-verified, no changes.' },
      {
        date: '2026-05-12',
        note: 'Added the "needs clarification" fallback instead of letting the model guess at vague notes.',
      },
    ],
    relatedToolSlug: 'invoice-generator',
  },
  {
    slug: 'project-kickoff-email',
    category: 'business-ops',
    title: 'Send a kickoff email that sets expectations before the first status fight',
    description:
      "Open a new client engagement with one email that states scope, timeline, communication cadence, and who's responsible for what — so nobody has to guess three weeks in.",
    promptText: `You are writing the kickoff email that starts a new client project — the first written record either side can point back to if expectations drift later.

Context:
- Project: {{project_name}}
- Client: {{client_name}}
- Timeline: {{timeline}}
- Deliverables: {{deliverables}}
- Communication cadence: {{communication_cadence}}
- Point of contact: {{point_of_contact}}

Task: Write a kickoff email that:
1. Opens with one brief line of genuine enthusiasm — not three paragraphs of it.
2. Recaps scope and deliverables in a short list, so both sides start from the same written understanding.
3. States the timeline with milestones, not just a total duration.
4. States the communication cadence explicitly — how often, which channel, who sends it — as a commitment, not a suggestion.
5. Lists exactly what you need from the client and by when (approvals, access, content) so blockers surface now, not mid-project.
6. Names the point of contact and how to reach them for anything urgent.

Format: email, under 250 words, plain paragraphs and one short list, no corporate filler like "synergy" or "circle back."`,
    variables: [
      {
        name: 'project_name',
        description: 'The project name',
        example: 'Meridian booking site rebuild',
        required: true,
      },
      {
        name: 'client_name',
        description: 'Who the email is addressed to',
        example: 'Alex',
        required: true,
      },
      {
        name: 'timeline',
        description: 'Total duration and key milestones',
        example: '8 weeks, kickoff Aug 10, launch Oct 5',
        required: true,
      },
      {
        name: 'deliverables',
        description: 'What the client will receive',
        example: 'new booking site, mobile checkout, 3 months hosting',
        required: true,
      },
      {
        name: 'communication_cadence',
        description: 'How and how often you will update them',
        example: 'Friday afternoon email update, live call every other Monday',
        required: true,
      },
      {
        name: 'point_of_contact',
        description: 'Who to contact and how',
        example: 'Sam (project lead), sam@northline.studio',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['project-kickoff', 'client-communication', 'expectations', 'onboarding'],
    whyItWorks:
      'Most client friction mid-project isn\'t caused by bad work — it\'s caused by a pace or communication expectation that was never actually agreed on, just assumed differently by each side. Writing the cadence down ("Friday email, call every other Monday") turns a vague hope into a commitment both people can point back to when a week goes quiet. Listing what you need from the client, and by when, does the same job in the other direction — it converts "we\'re waiting on them" from a surprise three weeks in into something both sides already agreed to watch for.',
    exampleOutput: `Subject: Kicking off — Meridian booking site rebuild

Excited to get started on this.

Scope recap: new booking site, mobile checkout, 3 months hosting.

Timeline: 6 weeks — design wks 1–2, build wks 3–5, launch wk 6 (Oct 5).

You'll get a written update every Friday, plus a 20-minute call every other Monday.

What we need from you by Aug 12: brand assets/logo files, and access to your current hosting account.

Any urgent questions, reach Sam directly at sam@northline.studio.

Looking forward to it.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-30' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-06-08' },
    ],
    changelog: [
      { date: '2026-07-30', note: 'Re-verified, no changes.' },
      {
        date: '2026-06-08',
        note: 'Added the explicit "what we need from you, by when" step after kickoffs kept skipping it.',
      },
    ],
  },
  {
    slug: 'client-onboarding-checklist',
    category: 'business-ops',
    title:
      'Build a client onboarding checklist that survives the handoff from sales to delivery',
    description:
      'Generate a reusable, phase-by-phase onboarding checklist — access, information, and approvals you need from a new client — so nothing falls through the crack between the sales call and day one of work.',
    promptText: `You are building a reusable client onboarding checklist for a small service business, to run every time a new client signs.

Context:
- Service: {{service_type}}
- Access/info typically needed: {{required_access_or_info}}
- Typical time to start: {{typical_timeline_to_start}}

Task: Produce an onboarding checklist grouped into phases:
1. Paperwork (contract signed, deposit/invoice sent and paid)
2. Access & credentials (list each item from {{required_access_or_info}} as its own line)
3. Kickoff logistics (kickoff call or email scheduled, point of contact shared)
4. Assets & content needed from the client (anything you're waiting on them for before real work starts)

For every item: state who owns it (you or the client) and roughly when it's due, relative to signing — not a fixed calendar date, so the checklist is reusable across clients.

Format: a checklist with checkboxes, grouped under the four phase headers above.`,
    variables: [
      {
        name: 'service_type',
        description: 'What you deliver for this client',
        example: 'monthly website maintenance retainer',
        required: true,
      },
      {
        name: 'required_access_or_info',
        description: 'Access, logins, or information you typically need',
        example:
          'WordPress admin login, hosting account access, GA4 access, brand assets',
        required: true,
      },
      {
        name: 'typical_timeline_to_start',
        description: 'How soon work usually starts after signing',
        example: 'work starts within 5 business days of signed contract',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['client-onboarding', 'checklists', 'operations', 'project-management'],
    whyItWorks:
      'Most onboarding breakdowns aren\'t caused by a missing step — they\'re caused by an unassigned one, where each side assumed the other would chase it. Naming an explicit owner (you vs. client) per item removes that ambiguity, and due dates set relative to the signing date, rather than fixed calendar dates, are what let a single checklist actually get reused across every new client instead of being rewritten each time. Grouping into phases also makes a half-finished onboarding easy to audit at a glance — you can see "paperwork done, access half done, no assets yet" instead of scanning a flat, unordered list.',
    exampleOutput: `Paperwork
[ ] Contract signed (client)
[ ] Deposit invoiced and paid (you send, client pays — due before start)

Access & credentials
[ ] WordPress admin login (client, due day 1)
[ ] Hosting account access (client, due day 1)
[ ] GA4 access (client, due day 1)
[ ] Brand assets shared (client, due day 2)

Kickoff logistics
[ ] Kickoff call scheduled (you, due day 1)
[ ] Point of contact shared both ways (you, due day 1)

Assets & content
[ ] Any outstanding content/photos requested (you request day 1, client supplies by day 3)`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-06-25' },
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-05-02' },
    ],
    changelog: [
      { date: '2026-06-25', note: 'Re-verified, no changes.' },
      {
        date: '2026-05-02',
        note: 'Switched due dates from fixed calendar dates to "days since signing" so the checklist is reusable across clients.',
      },
    ],
  },
  {
    slug: 'decline-scope-creep-email',
    category: 'business-ops',
    title: "Say no to scope creep without sounding like you're punishing them for asking",
    description:
      'Turn down an out-of-scope request politely and specifically — acknowledging the ask is reasonable, naming why it sits outside the agreement, and offering a real path to get it done instead of a flat no.',
    promptText: `You are writing an email that declines an out-of-scope request from a client, without damaging the relationship or sounding punitive.

Context:
- Agreed scope: {{original_scope_summary}}
- New request: {{new_request}}
- Proposed path forward: {{how_to_proceed}}
- Our business: {{your_business_name}}

Task: Write an email that:
1. Acknowledges the request as reasonable to ask for — do not make the client feel wrong for raising it.
2. States specifically what part of the request falls outside the agreed scope, and why, referencing the original agreement rather than a vague "that's extra."
3. Proposes the concrete path forward from {{how_to_proceed}} as the solution, not as a consolation prize.
4. Ends with one specific next step or question (e.g. "want me to send a quote for that?").

Tone: warm but plain — no passive-aggressive hedging ("just to clarify," "as per my last email"), no over-apologizing for having a scope in the first place.

Format: short email, 3 short paragraphs max.`,
    variables: [
      {
        name: 'original_scope_summary',
        description: 'What was originally agreed',
        example: 'Website redesign: homepage, services, contact page. 2 revision rounds.',
        required: true,
      },
      {
        name: 'new_request',
        description: 'What the client is now asking for',
        example:
          'Client is now asking us to also build an online booking system into the site',
        required: true,
      },
      {
        name: 'how_to_proceed',
        description: 'The path forward you want to offer',
        example: 'Quote it separately as a $1,200 add-on, 2-week timeline',
        required: true,
      },
      {
        name: 'your_business_name',
        description: 'Your business name',
        example: 'Northline Studio',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['scope-creep', 'client-communication', 'boundaries', 'freelancing'],
    whyItWorks:
      'A flat "that\'s not in scope" reads as a rejection of the person, not the request, and tends to provoke an argument rather than resolve one. Separating "this is a reasonable thing to want" from "here\'s specifically why it sits outside what we agreed" reframes the boundary as a fact about the contract, not a judgment about the client for asking — that distinction is what keeps the conversation collaborative instead of defensive. Offering a concrete, priced path forward converts what could become a standoff into a sale: the client gets a way to get what they want, and you get paid for the extra work instead of quietly absorbing it to avoid an awkward conversation.',
    exampleOutput: `Subject: Re: adding online booking

Hi Alex,

Good instinct — booking would be a great addition. Our current scope covers the homepage, services and contact pages with two rounds of revisions, so a booking system sits outside what we scoped and quoted.

I can put together a separate quote for it — roughly $1,200 and a 2-week build, running alongside or after the current work, whichever you prefer.

Want me to send that quote over?

— Northline Studio`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-18' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-06-14' },
    ],
    changelog: [
      { date: '2026-07-18', note: 'Re-verified, no changes.' },
      {
        date: '2026-06-14',
        note: 'Added the explicit "acknowledge as reasonable" opening step after early drafts jumped straight to the boundary and read as defensive.',
      },
    ],
  },
  {
    slug: 'email-signature-copy',
    category: 'business-ops',
    title: 'Write email signature copy that reads senior, not try-hard',
    description:
      'Get tight, professional signature copy — name, title, one credibility line, and which links actually earn a place — sized correctly for the Email Signature Generator instead of a bio squeezed into a footer.',
    promptText: `You are writing copy for a professional email signature — not a bio, a signature that gets read in under two seconds.

Context:
- Name: {{full_name}}
- Title: {{job_title}}
- Company: {{company_name}}
- Credibility detail (optional): {{one_credibility_detail}}
- Candidate links: {{links_to_include}}

Task:
1. Write the name/title line exactly as it should appear (one line, no more than a comma's worth of extra detail).
2. If a credibility detail was given, write one optional tagline line under 60 characters using it — otherwise state clearly that this line should be omitted.
3. From the candidate links, recommend which 2-4 to actually include, ranked by how likely a recipient is to click them, with one line of reasoning per cut or keep decision.
4. Do not suggest adding anything not given in the input — no invented awards, no invented socials.

Format: three short sections — Name/title line, Tagline line (or "omit"), Recommended links (with reasoning) — ready to paste into an email signature generator.`,
    variables: [
      {
        name: 'full_name',
        description: 'Your full name',
        example: 'Priya Sharma',
        required: true,
      },
      {
        name: 'job_title',
        description: 'Your role or title',
        example: 'Founder',
        required: true,
      },
      {
        name: 'company_name',
        description: 'Your company or business name',
        example: 'Northline Studio',
        required: true,
      },
      {
        name: 'one_credibility_detail',
        description: 'One real stat, credential, or fact worth surfacing',
        example: '200+ invoices generated for small businesses',
        required: false,
      },
      {
        name: 'links_to_include',
        description: 'Every link you might include, comma-separated',
        example: 'website, LinkedIn, calendar booking link, phone',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['email-signature', 'branding', 'copywriting', 'client-communication'],
    whyItWorks:
      'A signature is read in under two seconds, so density is the enemy — one credibility line beats a compressed bio every time, because a reader either absorbs one clear fact or skips the whole block. The link-ranking step matters more than it looks: every link in a signature competes for the same sliver of attention, so five icons usually convert worse than two, because the reader has to decide which one matters instead of being shown the one that does. Refusing to invent detail keeps the output honest — a signature is one of the few pieces of copy a client reads on literally every email, so a fabricated-sounding credibility line is a durable, repeated credibility risk, not a one-time slip.',
    exampleOutput: `Name/title line: Priya Sharma, Founder — Northline Studio

Tagline line: 200+ invoices generated for small businesses

Recommended links: Website (most credible single click) and Calendar booking link (turns interest into a meeting directly) — include both. LinkedIn: cut unless actively used for outreach; it competes with the calendar link for the one click you actually want. Phone: omit from the signature block itself, list only if cold-call inquiries are welcome.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-26' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-06-01' },
    ],
    changelog: [
      { date: '2026-07-26', note: 'Re-verified, no changes.' },
      {
        date: '2026-06-01',
        note: 'Added the "rank links, don\'t just list them" step after outputs kept recommending every candidate link unchanged.',
      },
    ],
    relatedToolSlug: 'email-signature-generator',
  },
]
