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
  {
    slug: 'business-ops-inbox-triage-reply-drafts-by-decision-type',
    category: 'business-ops',
    title: `Turn a dumped-in inbox into ranked replies sorted by what decision each one actually needs`,
    description: `Pastes a batch of unanswered emails and gets each one triaged by decision type, with a draft reply for anything that doesn't need your personal judgment call.`,
    promptText: `You are triaging a backlog of unanswered emails for me — not summarizing them, but sorting each one by what kind of decision it actually requires and drafting a reply for anything that doesn't need my personal judgment.

EMAIL BACKLOG
{{email_batch}}

MY ROLE AND AUTHORITY
{{my_role}}

STANDING DEFAULTS FOR ROUTINE REQUESTS
{{standing_defaults}}

THINGS THAT MUST NEVER BE AUTO-REPLIED
{{never_auto_reply}}

For each email, first classify it into exactly one bucket: (1) routine — answerable from my standing defaults with no judgment call, (2) needs-my-call — the answer depends on a preference or trade-off only I can make, (3) needs-someone-else — I'm not the right person and it should be forwarded, or (4) no-reply-needed — informational only. Do not default everything into needs-my-call just to be safe; that defeats the point of triage. For bucket 1, write the full reply ready to send, using my standing defaults, and say which default you used. For bucket 2, do not draft a reply — instead write the one specific question I need to answer before a reply can exist, phrased so I can respond in a single word or sentence. For bucket 3, name who it should go to and a one-line forwarding note. For bucket 4, just confirm no action is needed and why. Never invent a commitment, price, date, or promise on my behalf that isn't backed by something explicitly in my standing defaults — if a routine-looking email actually requires a judgment call hiding inside it, reclassify it to bucket 2 rather than guessing.

WHAT NOT TO DO
Do not summarize the emails back to me in prose before triaging — go straight to the classification. Do not batch multiple unrelated emails into one combined reply even if they're from the same sender.

OUTPUT FORMAT
A table: Email (subject/sender), Bucket, Action (draft reply text, the one question, forward-to name, or "no action"). End with a one-line count of how many landed in each bucket.`,
    variables: [
      {
        name: 'email_batch',
        description: `The raw text of the unanswered emails, pasted as-is.`,
        example: `5 emails: a vendor asking to reschedule a call, a client asking if a discount is still valid, a colleague asking for a doc link, a newsletter reply-all thread, and a partner proposing a new contract term.`,
        required: true,
      },
      {
        name: 'my_role',
        description: `What you're authorized to decide versus what needs escalation.`,
        example: `I'm the ops manager — I can reschedule calls and answer process questions, but I can't approve discounts or new contract terms.`,
        required: true,
      },
      {
        name: 'standing_defaults',
        description: `The routine answers you'd give without thinking, so the model can draft real replies.`,
        example: `Standard reschedule window is any weekday 10am-4pm; doc links live in the shared drive under /ops/current; newsletter threads get no reply.`,
        required: true,
      },
      {
        name: 'never_auto_reply',
        description: `Categories of email that should never get an auto-drafted reply, no matter how routine they look.`,
        example: `Anything mentioning a refund, legal threat, or a price different from the published rate card.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `inbox-triage`,
      `email-management`,
      `workflow-automation`,
      `operations`,
      `decision-routing`,
    ],
    whyItWorks: `The core failure mode of asking an LLM to "help with my inbox" is that it treats every email with the same generic helpfulness, which either produces a wall of drafted replies you now have to individually vet for made-up commitments, or a wall of summaries that just re-describes the problem back to you without reducing your workload. Forcing an explicit four-way classification before any drafting happens changes the task from open-ended assistance into a bounded sorting problem, which GPT-5.1 handles far more reliably than open-ended judgment — it's much better at applying a stated rule (does this match a standing default, yes or no) than at silently inferring when it should defer to you. The instruction to surface a single answerable question for bucket 2, rather than drafting a placeholder reply, matters because a half-drafted reply with a guessed answer is more dangerous than no draft at all — it looks finished, so it's more likely to get sent without a real check, whereas a bare question forces you to actually supply the missing judgment before anything goes out. Explicitly naming a never-auto-reply category closes a specific failure mode: the model treating a phrase like "is the discount still valid" as routine because the surrounding email reads politely, when in fact any dollar-figure deviation from a rate card is exactly the kind of thing that shouldn't be answered on autopilot. The reclassification instruction — if a routine-looking email hides a judgment call, move it to bucket 2 rather than guessing — exists because the model's default failure under time pressure is to force borderline cases into whichever bucket lets it produce more finished-looking output, and this explicitly removes that incentive.`,
    exampleOutput: `| Email | Bucket | Action |
|---|---|---|
| Vendor reschedule request | Routine | Draft: "Happy to move our call — I'm free any weekday 10am-4pm, let me know what works." (used reschedule-window default) |
| Client discount question | Needs-my-call | Question: is the 15% discount still valid past the original quote date, yes or no? |
| Colleague doc link | Routine | Draft: link to /ops/current shared drive folder |

Bucket counts: 2 routine, 1 needs-my-call, 1 needs-someone-else, 1 no-reply-needed.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-meeting-agenda-decision-forcing-structure',
    category: 'business-ops',
    title: `Build a meeting agenda that forces a decision instead of producing another discussion`,
    description: `Converts a loose list of topics into an agenda where every item names the decision it must end in, who owns it, and what happens if the meeting runs out of time.`,
    promptText: `You are building the agenda for a meeting I'm running. My real problem with agendas isn't listing topics — it's that meetings run long and end without decisions because the agenda never forced one in the first place.

MEETING PURPOSE AND ATTENDEES
{{meeting_context}}

RAW TOPIC LIST
{{raw_topics}}

TOTAL TIME AVAILABLE
{{time_budget}}

DECISIONS THAT ABSOLUTELY MUST GET MADE THIS MEETING
{{must_decide}}

For every topic, rewrite it as a decision statement, not a subject label — "marketing budget" becomes "decide whether Q3 marketing budget increases by 20% or stays flat." If a topic in the raw list can't be phrased as a decision because it's genuinely just informational, mark it as an FYI item and cap it at two minutes with no discussion slot — FYI items are read, not debated. Assign each decision item an explicit owner (the person who will actually say yes/no) and a time box in minutes, with the must-decide items getting priority time allocation even if it means cutting or shortening lower-priority items to fit the total time budget. Order items so the must-decide items come first, not last, since agendas that save the important decision for the end are exactly what let it get punted when time runs out. For every item, write one pre-read question the owner should think about before the meeting starts, so the meeting isn't the first moment they're confronting the trade-off. Add an explicit "if we run out of time" rule at the bottom: which lower-priority items get bumped to a follow-up versus decided asynchronously by the owner without a meeting at all.

WHAT NOT TO DO
Do not add generic agenda boilerplate like "introductions" or "any other business" unless I explicitly listed them. Do not pad the agenda with more items than the time budget can actually hold — cut instead.

OUTPUT FORMAT
A numbered agenda: item name (as a decision statement or FYI), owner, minutes, pre-read question. Followed by a short "if we run out of time" section.`,
    variables: [
      {
        name: 'meeting_context',
        description: `Who's in the meeting and what it's broadly for.`,
        example: `Weekly ops sync, 6 attendees: me, two team leads, finance, and two ICs.`,
        required: true,
      },
      {
        name: 'raw_topics',
        description: `The unfiltered list of things people want to talk about.`,
        example: `Q3 marketing budget, new vendor contract, office move update, hiring plan for support team, someone's PTO conflict.`,
        required: true,
      },
      {
        name: 'time_budget',
        description: `How long the meeting actually runs.`,
        example: `45 minutes`,
        required: true,
      },
      {
        name: 'must_decide',
        description: `The one or two things that cannot leave the meeting undecided, even if everything else gets cut.`,
        example: `The vendor contract decision, since the vendor's offer expires Friday.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `meeting-agenda`,
      `decision-making`,
      `operations`,
      `time-management`,
      `facilitation`,
    ],
    whyItWorks: `Most agenda generators produce a list of topic labels because that's the shape of the raw input they're given, and GPT-5.1 will happily mirror the input's shape back unless explicitly told to transform it — asking it to rewrite every topic as a decision statement forces a structural change that a topic label can't hide behind: you can't write "decide whether Q3 marketing budget increases by 20%" without someone having to actually pick an answer, whereas "marketing budget" as an item can be discussed indefinitely without resolution. Ordering must-decide items first rather than last directly counters a known meeting-dynamics failure — items placed at the end of an agenda are the first casualties when earlier items run over, so a model that defaults to listing items in the order given (which usually mirrors whatever order they occurred to someone, not priority) will silently reproduce that failure unless explicitly told to reorder by priority instead of input order. The pre-read question per item exists because a model asked to just "add discussion notes" tends to write summary bullets restating the topic, which don't change anyone's preparation; a question specifically aimed at the owner's trade-off forces the model to identify what the actual tension in the decision is, which is a genuinely harder inferential step than restating the topic and produces a materially more useful artifact. The explicit "if we run out of time" section matters because without it, a time-boxed agenda that inevitably runs over defaults back to whichever items happen to be last, re-creating the exact problem being solved — naming in advance which items get bumped versus decided asynchronously turns an implicit, ad-hoc triage decision made under time pressure into an explicit one made calmly beforehand.`,
    exampleOutput: `1. DECIDE: Sign or decline the vendor contract before Friday's expiration — Owner: Finance — 15 min — Pre-read: what's the real cost of a 2-week extension request instead of deciding today?
2. DECIDE: Approve or hold Q3 marketing budget at 20% increase — Owner: Marketing lead — 12 min — Pre-read: what specific outcome would justify the increase?

If we run out of time: office move update becomes an async Slack post; PTO conflict is resolved by the two people directly involved without a meeting.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-meeting-notes-to-owned-action-items',
    category: 'business-ops',
    title: `Extract action items from raw meeting notes that name a real owner instead of a vague "team will follow up"`,
    description: `Pastes messy meeting notes or a transcript and gets back a clean action item list where every task has a specific owner, a real deadline, and a note on what happens if it's not tracked.`,
    promptText: `You are extracting action items from meeting notes I'm pasting below. My recurring problem is that action items come out of meetings vague — "team will follow up," no date, no name — and then nothing happens because nobody actually owns them.

RAW MEETING NOTES OR TRANSCRIPT
{{meeting_notes}}

ATTENDEES AND THEIR ROLES
{{attendees}}

EXISTING TRACKING SYSTEM
{{tracking_system}}

DEFAULT DEADLINE IF NONE WAS STATED
{{default_deadline}}

Read through the notes and pull out every action item, whether it was stated explicitly ("John will send the deck") or only implied (someone said they'd "look into" something without a formal commitment). For each one, assign a specific named owner using the attendee list — never write "team" or "someone" as an owner; if the notes genuinely don't make clear who owns it, flag that explicitly as "owner unclear" rather than guessing a name, and list it separately so it doesn't get silently lost among properly-owned items. If a deadline was stated, use it; if not, apply the default deadline rule and say you did so. For each action item, add a one-line note on the actual dependency or blocker mentioned in the notes, if any was mentioned — this is often the difference between an item that will get done and one that's quietly waiting on something else. Flag any action item that sounds like a repeat of something from a previous meeting (implied by phrasing like "still need to" or "following up again on") since a recurring undone item is a signal worth surfacing on its own, not just another row in the list.

WHAT NOT TO DO
Do not summarize the meeting's discussion or decisions in prose — only extract action items. Do not merge two distinct action items into one line even if they were mentioned in the same sentence.

OUTPUT FORMAT
A table: Action item, Owner, Deadline, Dependency/blocker, Repeat flag (yes/no). Then a separate short list of any "owner unclear" items needing my attention before they can be assigned.`,
    variables: [
      {
        name: 'meeting_notes',
        description: `The raw notes or transcript text, however messy.`,
        example: `Rough bullet notes from a 30-minute product sync, mixing decisions and casual asides.`,
        required: true,
      },
      {
        name: 'attendees',
        description: `Who was in the meeting and their role, so owners can be matched to names correctly.`,
        example: `Priya (eng lead), Marco (design), Sam (PM, me).`,
        required: true,
      },
      {
        name: 'tracking_system',
        description: `Where these action items ultimately need to live, if relevant to formatting.`,
        example: `Linear tickets under the 'Q3-launch' project.`,
        required: false,
      },
      {
        name: 'default_deadline',
        description: `What deadline to assume when the notes don't state one.`,
        example: `One week from the meeting date unless otherwise specified.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `meeting-notes`,
      `action-items`,
      `task-tracking`,
      `operations`,
      `accountability`,
    ],
    whyItWorks: `The single biggest reason action items from meetings don't get done is that they were never assigned to an actual person in the first place, and a model asked generically to "extract action items" will faithfully reproduce whatever ambiguity was in the source notes — if the notes say "team will follow up," the naive extraction just repeats that phrase, preserving the exact ambiguity that caused the problem. Explicitly forbidding "team" or "someone" as an owner and requiring either a real name from the attendee list or an explicit "owner unclear" flag forces a binary check GPT-5.1 handles reliably (is there a name attached, yes or no) rather than a fuzzier judgment call about whether an owner is "clear enough," and separating unclear items into their own list means they can't hide inside a table that otherwise looks fully actionable. Explicitly including implied commitments ("look into" phrasing) alongside stated ones matters because meeting notes rarely record commitments in a uniform grammatical form, and a model that only pattern-matches on explicit "X will do Y" phrasing will systematically miss the softer, hedged commitments that are often the ones most likely to be forgotten precisely because they were never stated forcefully. The repeat-flag instruction gives the model a genuinely useful signal to surface: an item phrased as "still need to" or "following up again" indicates the same task survived at least one previous meeting undone, which is exactly the kind of pattern a busy person skimming a flat action-item list would miss but that changes how the item should be handled — it needs a harder deadline or an escalation, not just another polite restatement.`,
    exampleOutput: `| Action item | Owner | Deadline | Dependency | Repeat |
|---|---|---|---|---|
| Send updated onboarding deck to sales | Priya | Aug 22 | Waiting on final design assets from Marco | No |
| Follow up on API rate-limit issue | Owner unclear | Aug 22 (default) | None mentioned | Yes — flagged "again" in notes |

Owner unclear: API rate-limit follow-up — notes don't say who raised or owns this.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-daily-priorities-triage-against-actual-capacity',
    category: 'business-ops',
    title: `Cut a bloated to-do list down to what actually fits in today, ranked by real cost of delay`,
    description: `Takes a messy task dump and the hours you actually have today, then returns a realistic short list ranked by what genuinely breaks if it slips, with everything else explicitly deferred instead of silently dropped.`,
    promptText: `You are helping me figure out what to actually work on today. I don't need a generic productivity pep talk — I need my task list cut down to what realistically fits in the hours I have, ranked by what actually breaks if it slips versus what just feels urgent.

FULL TASK LIST
{{task_list}}

HOURS ACTUALLY AVAILABLE TODAY
{{available_hours}}

FIXED COMMITMENTS ALREADY ON THE CALENDAR
{{fixed_commitments}}

ANYTHING WITH A HARD EXTERNAL DEADLINE TODAY
{{hard_deadlines}}

First estimate a realistic time cost for each task, not an optimistic best-case number — if a task's true effort is unclear, say so and estimate a range rather than a single confident-sounding number. Subtract the fixed commitments from the available hours to get real working time, then rank tasks by actual cost of delay: something with a hard external deadline today outranks something that merely feels important but has no real consequence if it slips a day. Select only the tasks that fit inside the real working time, in priority order, and explicitly list everything that got cut, with a one-line reason for each — "cut: no real deadline, can slip to tomorrow without consequence" is a valid and expected outcome, not a failure of the list. If the hard-deadline items alone exceed the available hours, say so plainly and tell me which of the hard-deadline items I need to renegotiate or delegate today rather than pretending the day has more capacity than it does. Do not silently drop a hard-deadline item from the final list without flagging it as a capacity conflict I need to actively resolve.

WHAT NOT TO DO
Do not moralize about time management or add generic productivity advice. Do not pad the final list with more tasks than the real available hours support just to look thorough.

OUTPUT FORMAT
Two sections: "Today" (ranked task, estimated time, why it made the cut) and "Cut for today" (task, one-line reason). If capacity is short of hard deadlines, a third section flagging exactly that conflict.`,
    variables: [
      {
        name: 'task_list',
        description: `Everything currently on your plate, unsorted.`,
        example: `Finalize vendor contract, respond to 12 emails, prep Friday's board deck, fix the broken invoice template, onboard the new hire's laptop access, review a teammate's draft proposal.`,
        required: true,
      },
      {
        name: 'available_hours',
        description: `The real number of working hours you have today, not the full workday.`,
        example: `5 hours between meetings`,
        required: true,
      },
      {
        name: 'fixed_commitments',
        description: `Meetings or blocks already locked in that eat into the available hours.`,
        example: `1-hour standup, 30-min 1:1 with my manager.`,
        required: true,
      },
      {
        name: 'hard_deadlines',
        description: `Anything with a real external consequence if it doesn't happen today.`,
        example: `Vendor contract must be signed by 5pm or the discount expires.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `daily-planning`,
      `prioritization`,
      `time-management`,
      `operations`,
      `capacity-planning`,
    ],
    whyItWorks: `The failure mode of most AI-generated priority lists is that they rank tasks by apparent importance in the language used to describe them rather than by actual capacity math, producing a list that looks thoughtfully ordered but doesn't fit inside the hours available — asking GPT-5.1 to explicitly subtract fixed commitments from available hours before ranking anything forces it to treat capacity as a hard constraint to solve against, not a vague backdrop, which changes the output from a wish list into something that could actually be executed today. Distinguishing cost-of-delay from felt urgency directly targets a well-documented cognitive bias the model would otherwise mirror from the input: tasks described with urgent-sounding language ("need to," "asap") get inflated priority in naive summarization even when they have no real external consequence, while a task that's quietly time-critical but blandly worded gets underranked; explicitly defining cost of delay in terms of hard external deadlines forces a check against actual consequence rather than surface tone. Requiring an explicit "cut for today" list with reasons, rather than just silently omitting lower-priority tasks, matters because an assistant that just doesn't mention a task creates ambiguity about whether it was considered and rejected or simply missed — stating the cut explicitly turns an implicit gap into a deliberate, reviewable decision you can override if the reasoning is wrong. The instruction to flag a hard-deadline capacity conflict rather than quietly making the numbers work is the most important safety valve: an assistant under instruction to "fit everything in" will often be prompted to produce an artificially tight, unrealistic schedule rather than deliver the harder but more useful message that today's hard deadlines simply don't fit and something needs to be renegotiated.`,
    exampleOutput: `Today:
1. Vendor contract finalization — 1.5 hrs — hard deadline at 5pm, discount expires
2. Fix broken invoice template — 1 hr — blocking finance's month-end close today

Cut for today:
- Board deck prep — no deadline until Friday, can start tomorrow
- New hire laptop access — not time-sensitive, delegate to IT

Capacity conflict: none — hard deadlines fit within your 3.5 real working hours.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-weekly-plan-buffer-aware-scheduling',
    category: 'business-ops',
    title: `Build a weekly plan that leaves real buffer instead of scheduling every hour back to back`,
    description: `Turns a week's worth of commitments and goals into a day-by-day plan that deliberately reserves slack for the inevitable fire drill, instead of optimistically packing every hour.`,
    promptText: `You are building my plan for the upcoming week. My past plans have all failed the same way: they schedule every available hour back to back, so the first unplanned interruption — which always happens — blows up the entire week and I end up behind on everything by Wednesday.

GOALS FOR THE WEEK
{{weekly_goals}}

FIXED COMMITMENTS (meetings, recurring blocks)
{{fixed_commitments}}

TYPICAL INTERRUPTION LOAD
{{interruption_pattern}}

DAYS AVAILABLE
{{available_days}}

Build a day-by-day plan, but before assigning any actual work, reserve a buffer block on each day sized to my typical interruption pattern — do not schedule that buffer time with anything, and do not let it silently shrink because the goals list is long. Assign the weekly goals to specific days based on real dependencies (what has to happen before what) and natural deadline pressure within the week, not evenly spread for the sake of looking balanced. If the goals, once realistically time-estimated, don't fit into the days available after buffer and fixed commitments are subtracted, say so explicitly and tell me which goal should be cut or pushed to next week rather than compressing everyone's daily plan to a false density that ignores the interruption pattern I gave you. For each day, name the one thing that must happen that day even if everything else about the day goes wrong — this is the anchor task the day is built around, not just the first item on the list. At the end, note which single day has the least slack and is therefore most at risk if this week's typical interruption lands there.

WHAT NOT TO DO
Do not produce an hour-by-hour calendar grid — a day-level plan with named blocks is more honest about what's actually controllable a week out. Do not treat the buffer block as available capacity if the goals don't fit; the buffer stays protected even under pressure.

OUTPUT FORMAT
A day-by-day list (Monday through the available days): anchor task, other assigned work, buffer block (unscheduled). End with a one-line note on the most at-risk day and, if applicable, what to cut.`,
    variables: [
      {
        name: 'weekly_goals',
        description: `What you're actually trying to accomplish this week.`,
        example: `Ship the Q3 report draft, finish two vendor evaluations, clear the backlog of approval requests.`,
        required: true,
      },
      {
        name: 'fixed_commitments',
        description: `Recurring meetings or blocks already locked into the week.`,
        example: `Monday and Thursday leadership syncs (1 hr each), daily standup (15 min).`,
        required: true,
      },
      {
        name: 'interruption_pattern',
        description: `Roughly how much unplanned disruption a typical week actually brings.`,
        example: `Usually 1-2 hours a day of unplanned urgent requests, worse on Tuesdays.`,
        required: true,
      },
      {
        name: 'available_days',
        description: `Which days of the week you're actually planning against.`,
        example: `Monday through Friday, with Friday afternoon reserved for a personal commitment.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `weekly-planning`,
      `time-blocking`,
      `operations`,
      `capacity-planning`,
      `productivity`,
    ],
    whyItWorks: `A model asked to "plan my week" from a goals list and a calendar will, by default, produce the most visually complete-looking artifact it can — which in practice means filling every open hour, because an empty block reads as an unsolved part of the task rather than a deliberate feature; explicitly instructing it to reserve and protect a buffer block before assigning any work inverts that default, treating unscheduled time as a required output rather than leftover space to be filled. This matters specifically because GPT-5.1's tendency toward thoroughness works against realistic planning here — a longer, denser-looking plan reads as more helpful in isolation, even though a real week with zero slack is structurally guaranteed to fail on first contact with any interruption, which is precisely the failure the person asking for this prompt is trying to escape. The anchor-task framing for each day forces a genuinely different kind of prioritization than a simple task list: naming the one thing that survives even if the day goes sideways requires the model to reason about what's load-bearing versus what's merely scheduled, which produces a plan that degrades gracefully under real-world disruption instead of one where every item has equal, undifferentiated importance. Explicitly instructing the model to say the goals don't fit and to name what should be cut, rather than silently compressing the daily plan to make everything appear to fit, closes off the most common way these plans quietly become fiction — an assistant under implicit pressure to be maximally helpful will compress estimates until the math works on paper, and stating this rule up front removes the incentive to do that.`,
    exampleOutput: `Monday — Anchor: draft outline for Q3 report. Other: start vendor evaluation #1. Buffer: 1.5 hrs reserved, unscheduled.
Tuesday — Anchor: clear approval backlog (highest interruption-risk day). Buffer: 2 hrs reserved.
...
Most at-risk day: Tuesday, given your historically heavier interruption load and only one anchor task with no fallback if it slips.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-decision-matrix-with-forced-tradeoff-weighting',
    category: 'business-ops',
    title: `Build a decision matrix that exposes which criteria you're secretly prioritizing instead of pretending they're all equal`,
    description: `Scores a real business decision against your stated criteria and weights, then explicitly surfaces the cases where the top-scoring option only wins because of how the weights were set — so you catch a rigged-feeling result before you act on it.`,
    promptText: `You are building a weighted decision matrix for a real choice I need to make. I don't want a matrix that just outputs a winner — I want to see exactly how sensitive that winner is to the weights I chose, because I've been burned before by a matrix that made a decision look more objective than it actually was.

DECISION TO MAKE
{{decision_description}}

OPTIONS ON THE TABLE
{{options_list}}

CRITERIA THAT MATTER
{{criteria}}

MY INITIAL WEIGHTING (if I have one)
{{initial_weights}}

First, if I didn't give you initial weights, ask me to rank the criteria roughly rather than assuming an even split — an even split across criteria is itself a real choice with consequences, not a neutral default, so don't apply it silently. Score every option against every criterion on a consistent scale, and for any score that's genuinely a guess rather than something backed by real information I gave you, mark it clearly as an assumption rather than presenting it with the same confidence as a score based on stated facts. Calculate the weighted total for each option. Then do the actual valuable part: identify how much the top-scoring option's weighted total would need to shift, or how much a single criterion's weight would need to change, before a different option would win — if the answer is "barely at all," say so plainly, because that means the decision is more finely balanced than the single winning number suggests and shouldn't be treated as a clear-cut answer. If one criterion is doing almost all the work in separating the top two options, name that criterion explicitly, since that's usually the real crux of the decision, not the aggregate score.

WHAT NOT TO DO
Do not present the winning option as an obviously correct answer if the sensitivity analysis shows it's close. Do not invent criteria I didn't ask for, even if they seem relevant — ask if I want to add them instead.

OUTPUT FORMAT
The scored matrix as a table (options x criteria, weighted total per option). Then a short sensitivity section: how fragile the top result is, and which single criterion or weight change would flip it.`,
    variables: [
      {
        name: 'decision_description',
        description: `The actual decision, stated plainly.`,
        example: `Which of two office lease options to sign for the next 3 years.`,
        required: true,
      },
      {
        name: 'options_list',
        description: `The real choices being compared, with any known facts about each.`,
        example: `Option A: downtown, higher rent, better transit access. Option B: suburban, lower rent, requires a shuttle.`,
        required: true,
      },
      {
        name: 'criteria',
        description: `What actually matters in this decision.`,
        example: `Monthly cost, employee commute time, room to grow headcount, lease flexibility.`,
        required: true,
      },
      {
        name: 'initial_weights',
        description: `How you'd currently rank the importance of each criterion, if you already have a sense of it.`,
        example: `Cost matters most, then room to grow, then commute, then flexibility.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `decision-matrix`,
      `decision-making`,
      `operations`,
      `prioritization`,
      `risk-analysis`,
    ],
    whyItWorks: `A standard decision matrix prompt produces a single confident-looking winner, and the danger is that a weighted score table has the visual authority of objective math even when the weights themselves were arbitrary or unexamined — GPT-5.1 will happily compute a clean weighted sum from whatever numbers it's given without flagging that the inputs, not just the arithmetic, are where the real judgment call lives. Explicitly instructing it to treat an even weighting as a real, consequential choice rather than a neutral default addresses a specific, common mistake: people who don't provide weights usually get an implicit equal split, which quietly encodes the assumption that every criterion matters the same amount, and that assumption is rarely true and rarely examined once a matrix produces a tidy-looking table. The sensitivity analysis is the mechanistically important addition, because it's the part a plain decision matrix never does on its own: rather than stopping at "Option A wins with 8.4 vs 7.9," asking how much a weight would need to shift before the winner changes reframes a close numeric margin as what it actually is — a genuinely uncertain decision — rather than letting a 0.5-point gap masquerade as a clear verdict. Requiring assumption-flagging on any guessed score matters because a matrix mixes fact-based and guessed inputs at the same visual weight by default; without an explicit flag, a confidently-stated made-up score for "lease flexibility" looks identical in the table to a score backed by an actual quoted lease term, and the person reading the output has no way to tell which numbers deserve scrutiny before the decision is finalized.`,
    exampleOutput: `| Option | Cost (40%) | Growth room (30%) | Commute (20%) | Flexibility (10%) | Weighted total |
|---|---|---|---|---|---|
| A (downtown) | 6 | 8 | 9 | 5* | 7.1 |
| B (suburban) | 9 | 6 | 4 | 7* | 6.9 |
(*flexibility scores are assumptions — no lease terms provided)

Sensitivity: the gap is 0.2 points — shifting cost weight down by just 5% flips the winner to B. This is a close call, not a clear one; cost weighting is the real crux.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-swot-with-evidence-graded-claims',
    category: 'business-ops',
    title: `Run a SWOT that grades every claim by how well-supported it is, instead of four lists of confident guesses`,
    description: `Builds a SWOT analysis for a real business situation where every entry is tagged as fact, informed inference, or open question — so the finished analysis doesn't quietly present speculation with the same authority as verified information.`,
    promptText: `You are running a SWOT analysis for a real situation I'm facing. The thing that makes most SWOT analyses useless is that every entry reads with the same flat confidence whether it's a documented fact or a guess dressed up in analyst language — I want the confidence level visible, not hidden.

SITUATION AND CONTEXT
{{situation_description}}

KNOWN FACTS I CAN CONFIRM
{{known_facts}}

WHAT I'M UNCERTAIN ABOUT
{{open_uncertainties}}

COMPETITIVE OR MARKET CONTEXT
{{market_context}}

Build the four SWOT quadrants, but tag every single entry with one of three labels: [FACT] for something directly supported by what I told you, [INFERENCE] for a reasonable conclusion drawn from the facts but not itself stated by me, or [OPEN QUESTION] for something that would materially change the analysis if answered but that I haven't given you enough to resolve — do not present an inference with the same bare confidence as a fact, and do not fill an empty-feeling quadrant with generic industry boilerplate ("strong brand" for a strength with nothing to back it) just to make the list look fuller. For each entry, keep it specific to my actual situation — a strength or weakness that could apply to literally any company in the industry doesn't belong here. After the four quadrants, pull out the two or three open questions that would most change the strategic picture if answered, and say specifically what answering each one would let us conclude that we can't conclude now. Flag any strength and weakness that are actually two sides of the same underlying trait, since that's a common pattern worth surfacing explicitly rather than leaving as two disconnected entries.

WHAT NOT TO DO
Do not produce four evenly-sized lists just for visual symmetry — a thin quadrant with two honest entries beats a padded one with six weak ones. Do not soften a real weakness into euphemistic language.

OUTPUT FORMAT
Four labeled quadrants (Strengths, Weaknesses, Opportunities, Threats), each entry tagged [FACT]/[INFERENCE]/[OPEN QUESTION]. Then a short "most consequential open questions" section and any strength/weakness pairing worth flagging.`,
    variables: [
      {
        name: 'situation_description',
        description: `The real business situation being analyzed.`,
        example: `Whether our 12-person SaaS company should expand into the EU market next year.`,
        required: true,
      },
      {
        name: 'known_facts',
        description: `What you can actually confirm, not guess at.`,
        example: `We have 40 paying customers in the UK already, our product is GDPR-compliant, we have no local support staff in any EU timezone.`,
        required: true,
      },
      {
        name: 'open_uncertainties',
        description: `What you genuinely don't know but suspect matters.`,
        example: `Not sure how price-sensitive continental European customers are compared to UK customers, or whether our current pricing tier translates.`,
        required: true,
      },
      {
        name: 'market_context',
        description: `Relevant competitive landscape, if known.`,
        example: `Two established competitors already operate in France and Germany with local sales teams.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `swot-analysis`,
      `strategy`,
      `business-analysis`,
      `operations`,
      `decision-making`,
    ],
    whyItWorks: `A generic SWOT prompt produces four lists that all read with identical declarative confidence, and this is a genuine failure mode rather than a stylistic quibble — GPT-5.1, like most models, tends to fill in a requested structure completely even when the underlying evidence to support every cell doesn't actually exist, because leaving a quadrant sparse reads as an incomplete answer to the model even though a thin, honest quadrant is more useful than a padded one. Explicitly requiring a fact/inference/open-question tag on every entry forces a different kind of reasoning: instead of generating a plausible-sounding claim and stopping, the model has to check that claim against what was actually supplied versus what it's extrapolating, which surfaces exactly the boundary between what you actually know and what the model is inferring on your behalf — a boundary a flat, untagged list erases entirely. The instruction against generic industry boilerplate targets a specific, very common SWOT failure: asked for strengths, a model will readily produce category-level truisms ("strong brand," "agile team") that could apply to nearly any company in the sector and therefore convey no actual information about this specific situation; forcing specificity to the given context makes these generic filler answers structurally harder to produce because there's nothing concrete to hang them on. Surfacing the two or three highest-leverage open questions at the end, rather than leaving open questions scattered flatly across four quadrants, does the genuinely useful analytical work of ranking which unknowns are actually load-bearing for the decision — most open questions don't matter equally, and a model that just lists them without ranking leaves you to do that prioritization yourself, defeating the purpose of asking for help in the first place.`,
    exampleOutput: `Strengths:
[FACT] 40 existing paying UK customers
[FACT] Product is GDPR-compliant

Weaknesses:
[FACT] No local support staff in EU timezones
[INFERENCE] Support response times to continental customers would likely lag UK customers given the timezone gap

Most consequential open question: how price-sensitive are continental customers relative to UK ones? Answering this would determine whether current pricing can transfer or needs a local tier.

Flagged pairing: existing UK customer base (strength) and no EU support staff (weakness) are two sides of the same "UK-only operating model" trait.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-executive-brief-one-page-decision-ready',
    category: 'business-ops',
    title: `Compress a sprawling update into a one-page executive brief that leads with the decision the exec actually needs to make`,
    description: `Turns a long internal update or report into a genuinely one-page brief structured around what the executive reader needs to decide or know right now, not a shortened version of the original document's structure.`,
    promptText: `You are compressing a long internal update into a one-page executive brief. The most common failure I've seen with AI-shortened briefs is that they're just a smaller version of the original document's structure — same sections, same order, just trimmed — instead of being reorganized around what an executive reader actually needs first.

SOURCE MATERIAL (long update, report, or notes)
{{source_material}}

WHO THIS BRIEF IS FOR AND WHAT THEY CARE ABOUT
{{executive_reader}}

WHAT DECISION OR RESPONSE THIS BRIEF SHOULD ENABLE
{{decision_needed}}

HARD CONSTRAINT ON LENGTH
{{length_constraint}}

Do not summarize the source material section by section in its original order. Instead, start from the decision or response this brief needs to enable, and work backward: the first sentence should state the bottom line — what's happening and what you need from the reader — before any supporting detail. Follow with only the facts that materially inform that decision; anything interesting but not decision-relevant gets cut entirely, not just shortened, even if it was a major section in the source material. If the source material contains a risk, a number that moved significantly, or an open item that could surprise the reader later if omitted, it must appear even if it's inconvenient — never quietly smooth over bad news to make the brief read more positively. If the source material has gaps that would matter for the reader's decision — a number that's missing, a status that's genuinely unclear — say so explicitly rather than implying completeness by silence. Respect the length constraint strictly; if the true content can't responsibly fit, say so and name what you had to leave out rather than silently violating the limit or covering everything but making it dense and unreadable.

WHAT NOT TO DO
Do not use hedging executive-speak that says nothing ("there are some considerations") — every sentence should be checkable against a fact. Do not bury the actual ask in the last paragraph.

OUTPUT FORMAT
A one-page brief: bottom line (1-2 sentences), key facts supporting it (bullets), any risk or bad news that must be surfaced, the specific ask or decision needed, and anything explicitly left out due to the length constraint.`,
    variables: [
      {
        name: 'source_material',
        description: `The long update, report, or notes being compressed.`,
        example: `A 4-page project status update covering timeline, budget, three workstreams, and a vendor issue.`,
        required: true,
      },
      {
        name: 'executive_reader',
        description: `Who's reading this and what they specifically care about.`,
        example: `The VP of Operations, who cares about budget and timeline risk, not workstream-level detail.`,
        required: true,
      },
      {
        name: 'decision_needed',
        description: `What you actually need the reader to do or decide after reading this.`,
        example: `Approve an extra two weeks of timeline and a small budget overage caused by the vendor issue.`,
        required: true,
      },
      {
        name: 'length_constraint',
        description: `The real hard limit on length.`,
        example: `Must fit on one page, under 300 words.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `executive-brief`,
      `business-writing`,
      `communication`,
      `operations`,
      `reporting`,
    ],
    whyItWorks: `A generic "summarize this" instruction produces exactly what it sounds like — a shorter version of the original document's own structure — because compression without reorganization is the path of least resistance for a model working section by section through source text; explicitly telling it to work backward from the decision needed forces a genuinely different generation process, where the model has to first identify what matters to the specific reader and then select facts that serve that, rather than mechanically trimming each existing section by the same proportion. Requiring that risks and bad news survive compression even when inconvenient addresses a specific, well-documented tendency in AI-generated business writing: when asked to summarize and told who the audience is, models often smooth toward a more positive-sounding, executive-palatable tone, quietly softening or omitting unflattering details in a way that would be actively harmful in a brief meant to enable a real decision — stating this rule explicitly overrides that default toward diplomatic vagueness. The instruction to flag gaps rather than imply completeness targets a subtler failure: a fluent, confident-sounding brief reads as complete regardless of whether the underlying source material actually had gaps, and a reader has no way to distinguish "this is genuinely resolved" from "the model just didn't mention what it didn't know" unless the uncertainty is stated outright. Enforcing the length constraint as a hard limit that forces explicit trade-offs, rather than a soft target the model quietly overshoots, matters because GPT-5.1 tends toward thoroughness by default — asked to be brief but comprehensive, it will often produce something dense and long rather than genuinely short, and only an explicit instruction to name what was cut, rather than just aiming for brevity, forces the actual triage decision to happen and be visible.`,
    exampleOutput: `Bottom line: The vendor delay pushes launch by two weeks and adds $8k to budget — need your approval on both by Thursday.

Key facts: Vendor missed the integration deadline (confirmed Aug 6); two of three workstreams remain on original schedule; the $8k covers expedited shipping to recover part of the delay.

Risk: if not approved by Thursday, the delay could extend to four weeks due to the vendor's next available slot.

Ask: approve the 2-week extension and $8k overage.

Left out due to length: workstream-level detail on the two on-track streams — available on request.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-project-status-update-with-real-risk-surfaced',
    category: 'business-ops',
    title: `Write a project status update that surfaces real risk instead of defaulting every line to "on track"`,
    description: `Builds a stakeholder-ready project update from raw notes where status per workstream is graded against actual evidence, not optimistic rounding, and any risk gets a real next step attached.`,
    promptText: `You are writing a project status update for stakeholders from my raw working notes. My past updates have all had the same problem: everything gets rounded up to "on track" because that's the easy, safe-sounding thing to write, and then a real problem surfaces two weeks later that stakeholders had no warning about.

RAW PROJECT NOTES
{{project_notes}}

WORKSTREAMS AND THEIR OWNERS
{{workstreams}}

ORIGINAL TIMELINE AND MILESTONES
{{original_timeline}}

WHO IS READING THIS UPDATE
{{stakeholder_audience}}

For each workstream, assign a status of on-track, at-risk, or blocked based strictly on the evidence in my notes, not on how the workstream owner phrased their update to me — if the notes describe a slipped date, an unresolved dependency, or a "we're a bit behind but should catch up," that is at-risk or blocked, not on-track, regardless of how casually it was mentioned. Do not round a genuinely uncertain status up to on-track just because no one has explicitly called it a problem yet. For every at-risk or blocked item, state the specific evidence that earned that status, the concrete next step being taken, and the date by which it needs to resolve before it affects the overall timeline — an at-risk flag without a next step is just an alarm with no plan attached, which is nearly as unhelpful as no flag at all. Compare current progress against the original timeline explicitly and say plainly whether the overall project is still on schedule, not just whether individual workstreams feel fine in isolation — several workstreams can each be individually "mostly fine" while their combined slippage still threatens the milestone. Tailor the level of technical detail to the stated stakeholder audience, but never let that tailoring soften an actual risk into vaguer language.

WHAT NOT TO DO
Do not use the phrase "on track" for anything with an unresolved open risk attached, even a small one. Do not bury the riskiest workstream at the bottom of the list.

OUTPUT FORMAT
Overall project status (one line). Then per workstream: status, evidence, next step, resolution date if at-risk/blocked. Order workstreams by risk level, riskiest first.`,
    variables: [
      {
        name: 'project_notes',
        description: `Your raw, unfiltered working notes on how things are actually going.`,
        example: `Backend team says API integration is 'mostly done, just a few edge cases left'; design is waiting on stakeholder sign-off that's been pending 5 days; QA hasn't started yet.`,
        required: true,
      },
      {
        name: 'workstreams',
        description: `The distinct workstreams and who owns each.`,
        example: `Backend integration (owned by Priya), Design sign-off (owned by Marco), QA (owned by Sam).`,
        required: true,
      },
      {
        name: 'original_timeline',
        description: `What was originally promised and by when.`,
        example: `Full launch scheduled for Sept 1; design sign-off was supposed to complete by Aug 5.`,
        required: true,
      },
      {
        name: 'stakeholder_audience',
        description: `Who's reading this and how technical they are.`,
        example: `Non-technical VP who wants plain-language status, not engineering jargon.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `project-status`,
      `stakeholder-communication`,
      `risk-management`,
      `operations`,
      `reporting`,
    ],
    whyItWorks: `The reason status updates drift toward uniform "on track" language isn't usually dishonesty — it's that casual, hedged phrasing from a workstream owner ("mostly done, just a few edge cases") gets faithfully summarized by a model into equally casual, reassuring-sounding language, which reads as on-track even when the underlying evidence describes something genuinely uncertain; explicitly instructing the model to grade status against the evidence rather than the tone of the source notes breaks that mirroring effect and forces a harder, more useful judgment call. Requiring a specific next step attached to every at-risk or blocked item targets a common failure in AI-generated status reports: it's easy for a model to correctly identify a risk from the notes but then stop there, producing a flag with no accompanying plan, which functionally tells a stakeholder there's a problem without telling them what's being done about it — arguably worse than no flag, since it invites anxious follow-up questions the update should have already answered. Explicitly requiring an aggregate on-schedule judgment, not just per-workstream status, addresses a structural blind spot: several workstreams individually described as "a little behind but manageable" can combine into a genuine milestone risk that no single workstream status captures on its own, and a model working workstream-by-workstream without an aggregation step will never surface that combined effect unless specifically told to check for it. Ordering by risk level rather than by whatever order the workstreams were listed in matters because burying the riskiest item at the bottom of a list is a subtle way status updates hide problems even when every individual status is technically accurate — a stakeholder skimming from the top should hit the worst news first, not last.`,
    exampleOutput: `Overall: at risk — combined slippage in design sign-off and unstarted QA threatens the Sept 1 launch date.

1. Design sign-off — AT RISK — evidence: stakeholder approval pending 5 days past the Aug 5 target — next step: Marco escalating directly to the approver today — resolution needed by Aug 15.
2. QA — AT RISK — evidence: has not started, was scheduled to begin Aug 10 — next step: Sam starting as soon as backend edge cases close — resolution needed by Aug 18.
3. Backend integration — ON TRACK — edge cases remaining are scoped and estimated at 2 days.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-internal-memo-single-ask-structure',
    category: 'business-ops',
    title: `Write an internal business memo built around a single ask instead of three buried asks and a wall of context`,
    description: `Drafts an internal memo that leads with exactly one clear ask, moves all supporting context below it, and explicitly checks whether a second hidden ask is smuggled inside the reasoning.`,
    promptText: `You are drafting an internal business memo for me. The memos I write badly all have the same problem: I bury the actual ask three paragraphs in, surrounded by background context, and by the time the reader gets there they've lost the thread of what I actually need from them.

WHO THE MEMO IS TO AND THE ONE THING I NEED FROM THEM
{{memo_audience_and_ask}}

BACKGROUND CONTEXT THEY NEED TO EVALUATE THE ASK
{{background_context}}

ANY CONSTRAINT OR DEADLINE ON THE ASK
{{ask_constraint}}

COUNTERARGUMENT I EXPECT TO HEAR
{{expected_pushback}}

First, check whether the ask I gave you is actually a single ask or secretly two — if answering it requires the reader to make more than one distinct decision (e.g. "approve the budget and also pick which vendor"), say so explicitly and ask me which one this memo is actually about, because a memo trying to secure two decisions at once usually gets neither cleanly. Open the memo with the single ask stated in one sentence, before any background — a reader should know exactly what's being requested from the very first line, not discover it after reading context. Follow with only the background context that's load-bearing for evaluating this specific ask; anything interesting-but-not-decision-relevant should be cut, not just shortened. Address the expected pushback directly and specifically, not with a vague reassurance — state the actual counterargument and respond to it on its merits, since a memo that avoids the strongest objection looks like it's hiding from it rather than having considered it. State the constraint or deadline plainly near the ask, not buried at the end where a skimming reader might miss it entirely. Close with exactly what response or action you need and by when.

WHAT NOT TO DO
Do not use throat-clearing openers like "I hope this finds you well" or "I wanted to reach out about." Do not soften the ask into a suggestion if it's actually a request requiring a real decision.

OUTPUT FORMAT
A memo: one-sentence ask up top, background (only load-bearing points), direct response to the expected pushback, constraint/deadline, closing action needed. If a hidden second ask was detected, flag it before the memo itself.`,
    variables: [
      {
        name: 'memo_audience_and_ask',
        description: `Who's reading this and the single thing you need from them.`,
        example: `To my director: approve a $15k budget increase for the contractor extension.`,
        required: true,
      },
      {
        name: 'background_context',
        description: `What they need to know to actually evaluate the ask, not everything you know about the topic.`,
        example: `Original contractor budget was $40k for 3 months; scope grew mid-project due to a client-requested feature; without the extra $15k the project stalls at 80% complete.`,
        required: true,
      },
      {
        name: 'ask_constraint',
        description: `Any real deadline or limitation on the ask.`,
        example: `Need approval by end of week or the contractor's rate lock expires.`,
        required: true,
      },
      {
        name: 'expected_pushback',
        description: `The objection you genuinely expect to hear.`,
        example: `They'll likely ask why this wasn't caught in the original scoping.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `business-memo`,
      `business-writing`,
      `communication`,
      `operations`,
      `persuasion`,
    ],
    whyItWorks: `The instinct to front-load context before the ask is a natural writing habit, but it's actively counterproductive for a reader skimming a memo among a dozen other things — GPT-5.1 asked to "write a memo about X" will, absent explicit instruction, default to something like a chronological narrative structure (background, then reasoning, then request) because that mirrors how the requester's own notes are usually organized when handed over; explicitly requiring the ask in the first sentence forces a structural inversion that has to be deliberately instructed rather than assumed. The single-ask detection step exists because a memo trying to secure two separate decisions at once is a common and specific failure mode — a reader who's asked to approve a budget and simultaneously weigh in on a vendor choice will often stall on the harder or more ambiguous of the two, which then blocks the easier one from getting decided at all; checking for this explicitly and surfacing it before drafting, rather than silently drafting a memo that tries to do both, catches the problem before it costs a delayed decision. Requiring the memo to address expected pushback directly and specifically, rather than with generic reassurance, matters because a model asked to draft a persuasive memo will often produce confident, one-sided language that omits counterarguments entirely — which reads well in isolation but is far less effective with an actual skeptical reader who will think of the objection anyway; addressing it head-on inside the memo is generally more persuasive than hoping it doesn't come up, and forces the draft to actually reason through the strongest objection rather than avoid it. Placing the constraint or deadline near the ask rather than at the end targets simple reading behavior: readers skimming for the action item often stop once they've registered the ask, so a deadline buried in a closing paragraph is genuinely more likely to be missed than one stated adjacent to the request itself.`,
    exampleOutput: `Ask: I need approval for a $15k budget increase to complete the contractor extension by end of week.

Context: the original $40k/3-month scope grew when the client requested an added feature mid-project; without the extra $15k, the project stalls at 80% complete.

Anticipated question — why wasn't this caught in original scoping: the feature request came from the client after signoff, not from a scoping miss on our side.

Deadline: approval needed by Friday or the contractor's current rate lock expires and re-negotiation could cost more.

Action needed: approve or decline by Friday EOD.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-brainstorm-with-constraint-stress-test',
    category: 'business-ops',
    title: `Run a brainstorm that stress-tests each idea against your real constraints instead of handing back a generic idea dump`,
    description: `Generates business ideas for a specific problem, then immediately filters each one against your actual budget, timeline, and team constraints so you're not left to discover the impractical ones yourself.`,
    promptText: `You are brainstorming solutions to a specific business problem I have. I don't want a generic idea dump — I've gotten those before and half the ideas turn out to be impossible the moment I check them against what I can actually do.

THE PROBLEM TO SOLVE
{{problem_statement}}

REAL CONSTRAINTS (budget, timeline, team size, tools already in use)
{{real_constraints}}

WHAT'S ALREADY BEEN TRIED AND DIDN'T WORK
{{already_tried}}

HOW MANY IDEAS AND WHAT KIND OF RISK APPETITE
{{idea_scope}}

Generate ideas at the requested scope, but for every single idea, immediately check it against the real constraints I gave you before including it in the final list — if an idea would clearly blow the budget, take longer than the timeline allows, or require a skillset the team doesn't have, either adapt it into a version that fits the constraints or drop it and say why, rather than listing an idea I'd have to filter out myself later. Do not repeat, in a slightly rephrased form, anything from the already-tried list — if a new idea is a close cousin of something that already failed, name the resemblance explicitly and explain what's genuinely different about it this time, otherwise leave it out. Mix idea types deliberately rather than generating variations on the same underlying approach — include at least one idea that solves the problem by removing a constraint rather than working within it (e.g., a cheaper approach that sidesteps the budget issue entirely, not just a smaller version of an expensive idea), and one that's a genuinely low-effort test rather than a full commitment, so I have a cheap way to validate direction before committing real resources. For every idea, name the biggest way it could fail, not just why it could work — an idea presented with no failure mode considered isn't ready to act on.

WHAT NOT TO DO
Do not pad the list with filler ideas just to hit a requested count — fewer genuinely fitting ideas beats hitting a number with weak ones. Do not include an idea that plainly violates a stated constraint without flagging that violation.

OUTPUT FORMAT
A numbered list of ideas: idea, why it fits the constraints (or how it was adapted to fit), its type (removes-constraint / low-effort-test / standard), and its main failure risk.`,
    variables: [
      {
        name: 'problem_statement',
        description: `The actual business problem you're trying to solve.`,
        example: `Customer support response times have crept up to 24 hours and complaints are rising.`,
        required: true,
      },
      {
        name: 'real_constraints',
        description: `What you're actually working with, not an idealized version.`,
        example: `No budget for new hires this quarter, small 3-person support team, already using Zendesk.`,
        required: true,
      },
      {
        name: 'already_tried',
        description: `What's been attempted and failed, so it's not repeated.`,
        example: `Tried adding a canned-response macro library, didn't move the needle much.`,
        required: true,
      },
      {
        name: 'idea_scope',
        description: `How many ideas you want and how bold versus conservative they should be.`,
        example: `5 ideas, mostly conservative but open to one bolder option.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `brainstorming`,
      `ideation`,
      `operations`,
      `problem-solving`,
      `constraint-based-planning`,
    ],
    whyItWorks: `A plain brainstorm prompt produces ideas evaluated only against the abstract problem statement, not the real constraints surrounding it, because generating and constraint-checking are two separate reasoning steps and a model asked only to generate will stop after the first one — explicitly requiring every idea to be checked against budget, timeline, and team constraints before inclusion forces the second step to actually happen, rather than leaving the filtering work for the person reading the list to do by hand, which is exactly the wasted effort this prompt exists to eliminate. The instruction to check against the already-tried list, and specifically to name the resemblance when a new idea is a close cousin of a failed one, targets a real limitation: without an explicit failed-attempts list, the model has no way to know that "add more canned responses" was already tried, and will readily suggest a lightly rephrased version of it as if it were new, since surface novelty in phrasing is easy to produce even when the underlying approach is identical to something that already didn't work. Deliberately requiring a constraint-removing idea and a low-effort-test idea, rather than leaving idea diversity to chance, counters the tendency of brainstorm outputs to cluster around variations of the most obvious framing of the problem — asked generically for ideas about slow support response times, most generated ideas will be "more of the same category" (more macros, more staff, more automation) rather than a genuinely different angle like eliminating the underlying cause of ticket volume; naming these categories explicitly forces genuine variety in approach, not just in wording. Requiring a stated failure mode for every idea addresses the fact that brainstorm output is naturally generated in an optimistic, pitch-like register — each idea sounds appealing because that's the framing the task implies — and without an explicit instruction to also state how it could fail, that one-sided framing goes unchallenged, leaving the reader to independently discover the downside only after time has been invested trying it.`,
    exampleOutput: `1. Implement a tiered triage system routing simple tickets to auto-suggested answers — Type: standard, adapted to fit no-new-hire constraint by using existing Zendesk automation rather than new tooling — Failure risk: auto-suggestions could feel impersonal and increase complaint rate if not tuned carefully.
2. Publish a public self-serve FAQ to deflect the most common ticket categories before they're ever filed — Type: removes-constraint, sidesteps the team-size limit by reducing incoming volume rather than processing it faster — Failure risk: only works if the top ticket categories are genuinely repetitive; needs a quick audit first.
3. Run a 1-week test giving the 3-person team a shared "first response within 4 hours" target on just the top 20% highest-volume ticket type — Type: low-effort-test — Failure risk: could reveal the real bottleneck is elsewhere in the process, not response speed itself.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-reverse-brief-clarify-request-before-work-starts',
    category: 'business-ops',
    title: `Write a reverse brief that proves you understood a vague request before spending real time on it`,
    description: `Turns a loosely worded request from a manager or client into a reverse brief — restating the goal, assumptions, and success criteria in your own words for their confirmation — so mismatched expectations surface before the work, not after.`,
    promptText: `You are helping me write a reverse brief — restating a request back to whoever gave it to me, in my own words, so they can confirm I've understood it correctly before I spend real time on the work. The goal is to catch a misunderstanding now, not after I deliver something that misses the point.

THE ORIGINAL REQUEST, AS GIVEN TO ME
{{original_request}}

WHO GAVE ME THIS REQUEST AND OUR WORKING RELATIONSHIP
{{requester_context}}

MY OWN GUESS AT WHAT THEY ACTUALLY WANT, IF I HAVE ONE
{{my_interpretation}}

WHAT WOULD MAKE THIS A WASTED EFFORT IF I GOT IT WRONG
{{wasted_effort_scenario}}

Restate the request in your own words, but do not simply rephrase it more politely — restate it at the level of the actual goal behind the request, not just its literal wording, since a literal restatement can accidentally confirm a misunderstanding just as easily as catch one. Identify every assumption you'd have to make to start the work today, and list each one explicitly as something needing a yes/no confirmation rather than proceeding on a silent guess — if the original request left the format, audience, deadline, or level of polish ambiguous, that ambiguity has to become a visible question, not an assumption baked invisibly into how you restate the brief. State what "done" would concretely look like, specific enough that both of us could look at the finished output together and agree whether it matches — a vague success criterion defeats the purpose of a reverse brief just as much as skipping it entirely. If my own interpretation was provided, check it against the original request and flag any part of it that seems like a stretch or an assumption I'm making rather than something the request actually supports. Explicitly name the specific way this could go wrong that would waste real effort, and turn that into the single most important question to ask before starting.

WHAT NOT TO DO
Do not write this as a formal document with headers if the relationship is casual — match the tone to the working relationship described. Do not list more than the assumptions that would genuinely change the output if answered differently.

OUTPUT FORMAT
A short message: restated goal, list of assumptions needing confirmation (each phrased as a direct yes/no question), what "done" looks like, and the single most important clarifying question to ask before starting.`,
    variables: [
      {
        name: 'original_request',
        description: `The request exactly as it was given to you, however vague.`,
        example: `"Can you put together something for the board on where we stand with the new product line?"`,
        required: true,
      },
      {
        name: 'requester_context',
        description: `Who asked and what your working relationship is like, to set tone.`,
        example: `My VP, fairly informal Slack-based communication normally.`,
        required: true,
      },
      {
        name: 'my_interpretation',
        description: `Your current best guess at what they actually want, if you have one.`,
        example: `I'm guessing they want a slide or two, not a full written report, focused on revenue traction so far.`,
        required: false,
      },
      {
        name: 'wasted_effort_scenario',
        description: `What specifically would make the work wasted if you guessed wrong.`,
        example: `If I spend two days on a detailed report but they actually just wanted three bullet points for a five-minute board update.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `reverse-brief`,
      `communication`,
      `operations`,
      `expectation-setting`,
      `workflow`,
    ],
    whyItWorks: `A reverse brief only works if it restates the request at the level of underlying goal rather than surface wording, because a literal rephrasing of an ambiguous request will faithfully preserve the exact same ambiguity — if the original request never specified format, restating it in slightly different words without addressing that gap gives the requester nothing new to confirm or correct, which defeats the entire purpose; explicitly instructing the model to restate at the goal level forces it to make an interpretive leap the requester can then actually validate or reject. Converting every ambiguity into an explicit yes/no question, rather than folding a best guess silently into the restated brief, matters because a model asked to "clarify a request" will often resolve ambiguity on its own by picking the most plausible interpretation and presenting it as settled fact — which looks efficient but reintroduces exactly the risk a reverse brief is meant to eliminate, since a busy requester skimming a confident-sounding brief is more likely to just say "looks good" without noticing that a real assumption was quietly baked in rather than actually asked. Checking the user's own stated interpretation against the original request, rather than accepting it uncritically, matters because the person asking is often the one most likely to have already anchored on a plausible-but-wrong reading of the request — an assistant that just formats their interpretation nicely without independently checking it against the source adds no real value over what they'd have written themselves. Naming the single most important clarifying question, rather than presenting a flat list of equally-weighted assumptions, does the actual prioritization work a rushed requester needs — a five-item confirmation list often gets skimmed and rubber-stamped, but a message that clearly flags one specific, well-chosen question is far more likely to actually get a considered answer before the work begins.`,
    exampleOutput: `Restated goal: you want something that gives the board a clear read on the new product line's traction so far — sounds like this is about giving them confidence in the direction, not a comprehensive operational report.

Assumptions needing confirmation:
- Format: is this 2-3 slides, or a written one-pager? (assuming slides based on 'for the board')
- Focus: revenue traction specifically, or also team/roadmap progress?

Done looks like: a board member could glance at it and answer 'is this product line working' in under a minute.

Most important question: is this meant to stand alone, or will you be presenting it live and just need supporting visuals?`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-risk-register-with-owner-and-early-warning-signal',
    category: 'business-ops',
    title: `Build a risk register where every risk has a real owner and a specific early-warning signal, not just a severity rating`,
    description: `Turns a list of known project or business risks into a proper risk register — each entry scored on likelihood and impact, assigned a real owner, and paired with a concrete signal that would tell you the risk is materializing before it's too late to react.`,
    promptText: `You are building a risk register for a real project or initiative. Most risk registers I've seen are just a list with a severity color next to each item, which doesn't actually help anyone act — I want each risk to have a real owner and something specific that would tell us it's starting to happen before it's a crisis.

PROJECT OR INITIATIVE
{{project_description}}

KNOWN RISKS (as raw notes, don't worry about formatting)
{{known_risks}}

TEAM MEMBERS WHO COULD OWN A RISK
{{team_members}}

RISK TOLERANCE OR CONTEXT
{{risk_tolerance}}

For each risk, score likelihood and impact on a simple scale and explain briefly why, grounded in what's specific to this project rather than a generic industry-standard justification. Assign a real owner from the team list — the owner should be whoever is best positioned to notice the risk starting to materialize and act on it, not necessarily the most senior person available; if no one on the list is well-positioned to own a given risk, say so explicitly rather than defaulting it to me. For every risk, name a specific, observable early-warning signal — something concrete that could actually be noticed in the ordinary course of work, not a vague restatement of the risk itself ("budget overrun" is not a signal; "vendor invoice comes in 15% over the last quote" is). Write a mitigation step that's genuinely preventive, distinct from a fallback response that only kicks in after the risk has already occurred — both matter, and they shouldn't be conflated into one vague line. Rank the register by a combination of likelihood and impact, but flag separately any low-likelihood, high-impact risk that could get buried by that ranking even though it deserves specific attention precisely because it's easy to dismiss until it happens.

WHAT NOT TO DO
Do not invent risks I didn't mention, even plausible-sounding ones — ask if I want to add categories instead. Do not write a mitigation step that's actually just a restatement of "monitor the situation."

OUTPUT FORMAT
A table: Risk, Likelihood, Impact, Owner, Early-warning signal, Preventive step, Fallback response. Ranked by severity, with a separate flagged note for any low-likelihood/high-impact risk.`,
    variables: [
      {
        name: 'project_description',
        description: `The project or initiative the risks belong to.`,
        example: `A 4-month migration of our billing system to a new vendor platform.`,
        required: true,
      },
      {
        name: 'known_risks',
        description: `The risks you're already aware of, in whatever rough form.`,
        example: `Vendor could miss the data migration deadline, some customer data might not map cleanly to the new schema, the old system's support contract expires mid-migration.`,
        required: true,
      },
      {
        name: 'team_members',
        description: `Who's actually available to own a risk, with enough context to judge fit.`,
        example: `Dana (engineering lead, close to the technical migration work), Theo (vendor relationship manager), me (project sponsor, less hands-on day to day).`,
        required: true,
      },
      {
        name: 'risk_tolerance',
        description: `How conservative or aggressive the organization's appetite for risk is here, if relevant.`,
        example: `Low tolerance — this system touches customer billing, so even a minor data error is costly.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `risk-register`,
      `risk-management`,
      `operations`,
      `project-management`,
      `planning`,
    ],
    whyItWorks: `A risk register that's just a severity-rated list fails in practice because severity alone doesn't tell anyone what to actually watch for, and a model asked generically to "assess risks" will readily produce a plausible-sounding score without being forced to specify anything observable — requiring an early-warning signal per risk, and explicitly rejecting a restated risk as a valid signal ("budget overrun" isn't a signal for a budget-overrun risk), forces a genuinely harder inferential step: identifying what a person doing ordinary work would actually notice in the days or weeks before the risk fully materializes, which is a different and more useful kind of reasoning than just restating the risk with a number attached. Assigning ownership based on who's best positioned to notice the risk, rather than defaulting to the most senior person or the project sponsor, matters because risk ownership tied to hierarchy rather than proximity to the actual signal produces a register where the nominal owner is the last person to find out something's going wrong — GPT-5.1 left to its own devices will often default the highest-authority person as owner of everything, since that reads as the safe, deferential choice, and explicitly overriding that default toward proximity-to-signal produces a more functionally useful register. Separating a preventive mitigation step from a fallback response addresses a common conflation in risk documentation: "monitor the situation and address if it happens" gets written as if it covers both prevention and response, when in fact it does neither — forcing the two apart makes it obvious when a risk actually has no real preventive action available, which is itself useful information the combined phrasing would have hidden. Explicitly flagging the low-likelihood, high-impact risk separately from the severity ranking counters a specific bias in how these registers get used in practice: a straightforward severity sort naturally buries a low-likelihood item near the bottom, right where it's most likely to be ignored, even though the entire reason risk registers separate likelihood from impact in the first place is that some of the worst outcomes are exactly the ones that look unlikely until the day they happen.`,
    exampleOutput: `| Risk | Likelihood | Impact | Owner | Early-warning signal | Preventive step | Fallback |
|---|---|---|---|---|---|---|
| Customer data doesn't map cleanly to new schema | Medium | High | Dana | A test migration batch produces more than 2% unmapped records | Run a full schema-mapping dry run on a sample dataset before go-live | Manual reconciliation process for unmapped records, staffed for the first 2 weeks post-migration |
| Support contract expires mid-migration | Low | High | Theo | Contract renewal notice not received 30 days before expiration | Renegotiate contract extension now, before migration start | Emergency short-term support agreement at premium rate |

Flagged: support contract expiration is low-likelihood but high-impact — don't let its low ranking on the severity list delay Theo starting the renewal conversation now.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-stakeholder-update-bad-news-first-structure',
    category: 'business-ops',
    title: `Write a stakeholder update that leads with bad news instead of burying it under three paragraphs of good news`,
    description: `Drafts a stakeholder update where anything that could disappoint or surprise the reader comes first and in plain language, with good news kept genuinely proportional instead of used to soften or crowd out the real message.`,
    promptText: `You are drafting a stakeholder update for me. My honest failure pattern with these is that I lead with the good news to soften the reader up, and by the time I get to the actual bad news three paragraphs later, it reads as buried or reluctant — which damages trust more than just saying it plainly upfront would.

RAW UPDATE MATERIAL (good and bad, unsorted)
{{update_material}}

STAKEHOLDER RELATIONSHIP AND HOW MUCH DIRECTNESS IS APPROPRIATE
{{stakeholder_relationship}}

WHAT SPECIFICALLY CHANGED SINCE THE LAST UPDATE
{{whats_changed}}

ANY ASK OR RESPONSE YOU NEED FROM THEM
{{ask_from_stakeholder}}

Sort the raw material into what's actually bad news (missed a deadline, cost more, a risk materialized), what's neutral status, and what's genuinely good news. Open the update with the bad news, if there is any, stated in plain declarative language — not softened with qualifiers like "slightly behind" when the notes describe something more serious, and not preceded by good news used as a cushion. If there's no real bad news this cycle, say that plainly as the opening line instead of manufacturing false urgency. For each piece of bad news, include what caused it and what's being done about it in the same breath, not as a separate section the reader has to hunt for — bad news without a stated response reads as an admission with no plan. Only after the bad news is fully stated, include neutral status and genuine good news, kept proportional to its actual significance rather than inflated to balance out the earlier bad news — a small win described with the same enthusiasm as a major one erodes credibility over time. Clearly separate what changed since the last update from unchanged background context, since a stakeholder reading multiple updates over time needs to know what's actually new this cycle, not a full restatement of everything they've already heard before. Close with the specific ask or response needed, stated plainly.

WHAT NOT TO DO
Do not use a euphemism to describe a real problem. Do not open with an apology in place of a clear statement of what happened.

OUTPUT FORMAT
An update: bad news first (or explicit "no bad news this cycle"), cause and response together, then proportional good/neutral news, what's new since last time, closing ask.`,
    variables: [
      {
        name: 'update_material',
        description: `Everything relevant this cycle, unsorted, good and bad mixed together.`,
        example: `Missed the mid-August integration milestone by a week due to a vendor delay; signed two new pilot customers; team morale is fine; budget is tracking on target.`,
        required: true,
      },
      {
        name: 'stakeholder_relationship',
        description: `Who you're updating and how direct you can be with them.`,
        example: `Board member, expects direct plain-language updates, no patience for spin.`,
        required: true,
      },
      {
        name: 'whats_changed',
        description: `What's actually different from the previous update cycle.`,
        example: `Last update we hadn't yet identified the vendor delay; this cycle we have, plus the two new pilot signings are new.`,
        required: true,
      },
      {
        name: 'ask_from_stakeholder',
        description: `What you need them to do or decide, if anything.`,
        example: `Need their sign-off on a one-week extension to the public launch date.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `stakeholder-update`,
      `communication`,
      `operations`,
      `transparency`,
      `reporting`,
    ],
    whyItWorks: `The instinct to lead with good news before delivering bad news is a natural social softening move, but it's precisely the pattern that erodes trust with sophisticated stakeholders over repeated updates, because they learn to read the good-news preamble as a signal that something worse is coming — a model asked generically to "write an update" will default toward this same softening structure since it mirrors typical business-writing conventions it's seen, so explicitly instructing bad news first is necessary to override that trained default rather than something the model would naturally choose on its own. Requiring cause and response to appear together with the bad news, rather than as a separate section, matters because separating them creates a gap where the reader sits with unresolved anxiety about what's being done, and a model asked only to "report the bad news" will often state the fact cleanly and leave the response for a later paragraph, which is a reasonable document structure in the abstract but a worse experience for a stakeholder reading top to bottom. Explicitly requiring that good news stays proportional to its actual significance targets a specific failure where a model, having just delivered bad news, tends to compensate by inflating the following good news slightly to balance the emotional register of the whole document — this is a subtle drift toward narrative balance rather than factual accuracy, and stating the rule directly prevents a small pilot signing from getting described with the same weight as a major milestone. Separating what's changed since the last update from unchanged background context solves a real problem with recurring stakeholder updates specifically: without this instruction, a model summarizing raw material has no way to know what the reader already heard last cycle, and will default to a complete restatement of the full situation every time, which trains recipients to skim past updates because most of the content is stale repetition rather than genuinely new information.`,
    exampleOutput: `We missed the mid-August integration milestone by a week due to a vendor delay we identified this cycle. We're addressing it by adding a second engineer to the integration work and have a firm new date of Aug 22.

What's new this cycle: the vendor delay (previously unknown) and two new pilot customer signings.

Other progress: budget remains on target; two new pilot customers signed, a solid but expected addition given our current pipeline.

Ask: need your sign-off on shifting the public launch date by one week to Aug 29.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-sop-with-decision-points-and-failure-recovery',
    category: 'business-ops',
    title: `Write an SOP that names the decision points and how to recover from mistakes, not just the happy-path steps`,
    description: `Turns a description of how a task is actually done into a standard operating procedure that explicitly marks where judgment is required, what a correct outcome looks like at each step, and how to recover when something goes wrong.`,
    promptText: `You are writing a standard operating procedure for a task I do (or someone on my team does) regularly. Every SOP I've tried to write myself ends up as a clean happy-path list of steps that falls apart the first time something doesn't go as expected, because it never says what to do when a step doesn't produce the expected result.

THE TASK, DESCRIBED IN MY OWN WORDS
{{task_description}}

WHO WILL ACTUALLY FOLLOW THIS SOP
{{sop_audience}}

WHAT USUALLY GOES WRONG WHEN THIS TASK IS DONE
{{common_mistakes}}

TOOLS OR SYSTEMS INVOLVED
{{tools_involved}}

Break the task into numbered steps, but for each step, state what a correct outcome looks like before moving to the next step — not just the action to take, but how the person doing it would know it worked. Mark clearly which steps are pure mechanical execution (no judgment needed, same action every time) versus which steps require a real decision (something depends on a variable circumstance), and for every decision step, state the actual criteria for making that call rather than leaving it to instinct — an SOP that says "use your judgment" at a step has usually just failed to do the actual work of specifying the decision rule. For every item in the common-mistakes list, find the step where that mistake would actually occur and add a specific recovery instruction right at that step — what to do if it's caught immediately versus what to do if it's discovered later, since the two often require different fixes. Assume the person following this SOP has never done the task before and cannot ask me questions in the moment — if a step assumes context that isn't stated in the SOP itself, add it rather than assuming it's obvious. Note explicitly which step, if skipped or rushed, would cause the most damage, so a time-pressured reader knows exactly where not to cut corners.

WHAT NOT TO DO
Do not write a step that says "use your best judgment" without specifying the actual decision criteria. Do not omit recovery instructions for a known common mistake just because it seems obvious to you.

OUTPUT FORMAT
Numbered steps: action, expected outcome/how to verify it worked, mechanical or judgment-required (with criteria if judgment), recovery instruction if this is a step where a listed mistake commonly occurs. End with one line flagging the highest-stakes step.`,
    variables: [
      {
        name: 'task_description',
        description: `How the task is actually done today, in your own words, however informal.`,
        example: `Onboarding a new client into our billing system — creating their account, setting up their payment method, and configuring their plan tier.`,
        required: true,
      },
      {
        name: 'sop_audience',
        description: `Who will actually be following this, and their experience level.`,
        example: `New support hires in their first two weeks, no prior billing-system experience.`,
        required: true,
      },
      {
        name: 'common_mistakes',
        description: `What actually tends to go wrong when this task is done, based on real experience.`,
        example: `People forget to verify the payment method actually charges successfully before marking the client active, and sometimes select the wrong plan tier default.`,
        required: true,
      },
      {
        name: 'tools_involved',
        description: `The actual systems or tools used to do the task.`,
        example: `Our internal CRM and Stripe for payment processing.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`sop`, `process-documentation`, `operations`, `training`, `standardization`],
    whyItWorks: `A generic "write me an SOP" request produces a clean list of happy-path steps because that's the easiest coherent structure to generate from a task description, and a model isn't naturally prompted to invent the failure cases on its own unless the task description happens to mention them — explicitly supplying a common-mistakes list and requiring a recovery instruction be attached at the exact step where each mistake occurs forces the SOP to cover the actual failure surface of the task rather than just its intended path, which is the entire difference between a document that helps in the calm case and one that helps when something has already gone wrong. Requiring an explicit "how would you know it worked" check at every step targets a specific gap in naive SOP generation: steps described as actions ("set up the payment method") don't tell the reader how to verify the action actually succeeded, and a first-time user with no prior context has no way to distinguish a step that appeared to work from one that actually did — stating the verification criterion at each step closes that gap directly. Distinguishing mechanical steps from judgment-required ones, and demanding real decision criteria rather than allowing "use your judgment" as an answer, matters because that phrase is exactly where SOPs quietly fail new employees — it's the point where the document silently hands the hard part of the task back to someone who, by definition of needing an SOP at all, doesn't yet have the experience to exercise that judgment; forcing the model to specify the actual decision rule does the harder work the vague phrase was skipping. Flagging the single highest-stakes step explicitly matters because a flat numbered list gives every step equal visual weight regardless of actual consequence, and a new employee working under time pressure has no way to know, without being told directly, which step is the one place they absolutely cannot cut a corner.`,
    exampleOutput: `Step 3: Set up payment method in Stripe. Expected outcome: a successful test charge confirmation appears in Stripe before proceeding — do not proceed on account creation alone. Judgment required: no, mechanical verification. Recovery: if the client is later found active without a verified charge, immediately pause the account in the CRM and re-run verification before re-activating — do not wait for a billing cycle to surface the issue.

Highest-stakes step: Step 3 (payment verification) — skipping this is the single most common source of downstream billing disputes.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-process-improvement-bottleneck-audit',
    category: 'business-ops',
    title: `Turn a vague 'this process is broken' complaint into a ranked bottleneck audit`,
    description: `Takes a messy, informally-described workflow and produces a step-by-step bottleneck audit with a ranked, realistic fix list — instead of a generic 'streamline your processes' essay.`,
    promptText: `You are auditing one specific internal process that people keep complaining about, to find where it actually breaks down and what's realistic to fix first.

PROCESS UNDER REVIEW
{{process_name}}

CURRENT STEPS AS THEY ACTUALLY HAPPEN
{{current_steps}}

THE PAIN POINT PEOPLE REPORTED
{{pain_point_reported}}

SOMETHING THAT CANNOT CHANGE
{{constraint_that_cant_change}}

WHO WOULD ACTUALLY APPROVE A FIX
{{decision_maker_for_fix}}

Do this in four phases.

PHASE 1 — MAP THE REAL FLOW
Rewrite the steps as they actually happen, not as the org chart says they should happen, and number each one. Where the reported pain point doesn't map cleanly onto any single step, say so explicitly rather than forcing it onto the nearest one — a complaint about 'it's slow' often traces back to a handoff between two steps, not either step itself.

PHASE 2 — FIND THE BOTTLENECK, NOT A SYMPTOM
Identify which specific step or handoff is the actual constraint — the one where work queues up waiting on a single person, a single approval, or a single tool — and distinguish it from steps that are merely annoying but not actually slowing anything down. A step can be tedious and not be the bottleneck; only flag a step as the bottleneck if removing it would measurably speed up the whole process.

PHASE 3 — RESPECT THE FIXED CONSTRAINT
Every fix you propose must work within the stated unchangeable constraint. If the constraint itself is the bottleneck, say that plainly instead of proposing a fix that quietly assumes the constraint away — a recommendation the decision-maker can't actually implement is worse than no recommendation.

PHASE 4 — RANK REALISTIC FIXES
Propose three fixes ranked by effort-to-impact ratio, cheapest and fastest first. For each, state what it requires from the named decision-maker specifically — an approval, a tool purchase, a policy change — since a fix with no clear owner never gets implemented.

WHAT NOT TO DO
Do not recommend generic process-improvement moves ('implement better communication', 'add a project management tool') unless you tie them to the specific bottleneck found in Phase 2. Do not propose a fix that requires unlimited headcount or budget without flagging that as the trade-off.

OUTPUT FORMAT
1. Numbered flow map with the pain point located on it.
2. One paragraph naming the actual bottleneck.
3. Three ranked fixes, each with owner and rough effort.
4. One line on what happens if nothing changes.`,
    variables: [
      {
        name: 'process_name',
        description: `The specific process being audited, named precisely.`,
        example: `New client onboarding, from signed contract to first invoice.`,
        required: true,
      },
      {
        name: 'current_steps',
        description: `The steps as they actually happen today, in plain language, warts included.`,
        example: `Sales emails ops a PDF contract, ops manually re-keys it into the billing system, finance waits for ops to confirm before setting up the account, no one owns following up if ops is backlogged.`,
        required: true,
      },
      {
        name: 'pain_point_reported',
        description: `What people are actually complaining about.`,
        example: `Clients are waiting 9-12 days for their first invoice and sales is fielding angry calls.`,
        required: true,
      },
      {
        name: 'constraint_that_cant_change',
        description: `Something fixed — a system, a headcount limit, a compliance step — that any fix has to work around.`,
        example: `The billing system cannot be replaced this year; it's mid-contract with the vendor.`,
        required: true,
      },
      {
        name: 'decision_maker_for_fix',
        description: `Who would have to approve or resource a fix.`,
        example: `The Ops Director, who controls the ops team's workflow tools and priorities.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `process-improvement`,
      `operations`,
      `workflow-audit`,
      `root-cause`,
      `efficiency`,
    ],
    whyItWorks: `Most process-improvement requests fail because they ask the model to diagnose and fix in one pass, which produces generic advice pattern-matched to the word 'process' rather than to the specific flow described — GPT-5.1 will happily generate 'streamline communication and adopt a PM tool' for almost any input if not forced to locate a concrete constraint first. Separating mapping from bottleneck-identification forces the model to commit to a specific step or handoff as the actual constraint before it's allowed to propose anything, which closes off the easy move of recommending something vague enough to sound applicable to any process. The instruction to distinguish 'annoying' from 'actually the bottleneck' matters because models trained on general business writing conflate the two constantly — a step can generate the most complaints while a different, quieter handoff is what's actually queuing work, and only forcing an explicit distinction surfaces that. Requiring every fix to respect a stated unchangeable constraint prevents the single most common failure mode in AI-generated operational advice: recommendations that implicitly assume unlimited budget, headcount, or a system swap that isn't actually on the table, which reads well but is useless to the person who has to implement it. Naming a specific decision-maker per fix converts the output from an essay into something that can actually move — a fix with no owner is advice, a fix with a named approver and a stated ask is a next step someone can take into a real conversation this week.`,
    exampleOutput: `The actual bottleneck isn't sales or finance — it's the manual re-keying step ops does alone, with no backup when the ops lead is out. Cheapest fix: build a shared intake template sales fills in correctly the first time, cutting rework. Needs the Ops Director's sign-off to make the template mandatory before a contract routes to ops.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-delegation-handoff-brief-two-week-absence',
    category: 'business-ops',
    title: `Write a delegation handoff brief that survives you being unreachable for two weeks`,
    description: `Produces a delegation brief with explicit decision authority, escalation triggers, and check-in cadence — built so the task doesn't stall or get re-decided the moment you're offline.`,
    promptText: `You are writing a delegation handoff brief for a task I'm handing off, written so the person taking it over doesn't need to reach me to keep moving.

TASK BEING DELEGATED
{{task_to_delegate}}

WHO IT'S GOING TO
{{delegate_name_and_level}}

DECISION AUTHORITY I'M GRANTING
{{decision_authority_granted}}

CHECK-IN CADENCE
{{check_in_cadence}}

ESCALATION TRIGGER
{{escalation_trigger}}

Most delegation fails not because the task wasn't explained but because the authority boundary was never stated, so the delegate either stalls on things they were actually allowed to decide, or decides things they weren't. Write the brief so that boundary is unmistakable.

Open with the task itself and what 'done' looks like — specific enough that the delegate can self-check without asking me. Then write the decision-authority section as a list of concrete decision types with a yes/no next to each: what they can decide alone, what they should decide and just inform me after, and what requires waiting for me. A decision-rights section that just says 'use your judgment' is not a boundary — replace any vague authority language from what I gave you with the sharpest concrete version you can construct from context, and flag anywhere the input was genuinely ambiguous rather than guessing silently. Write the escalation trigger as a specific, observable condition — not 'if something goes wrong' but the exact signal that should make them stop and escalate instead of proceeding on their own judgment. State the check-in cadence as a concrete rhythm with a default channel, and specify what happens if I don't respond within that cadence given I'm unreachable — the delegate needs a documented default action, not a dependency on my responsiveness. Close with a short list of the two or three most likely places this task goes sideways, based on the task description, and what the delegate should do in each case without waiting for me.

Do not write this as a generic delegation template with placeholders like 'insert responsibilities here' — every line should be usable as-is, referencing the actual task. Do not soften the authority boundary to be diplomatic; an ambiguous boundary is the exact failure mode this brief exists to prevent.

OUTPUT FORMAT
1. Task and definition of done, two to three sentences.
2. Decision-authority table: decision type, decide-alone / inform-after / wait-for-me.
3. Escalation trigger, stated as an observable condition, with the default action if I'm unreachable.
4. Two or three likely failure points and the delegate's default response to each.`,
    variables: [
      {
        name: 'task_to_delegate',
        description: `The task being handed off, specifically.`,
        example: `Finalizing and sending the Q3 vendor renewal contracts to our three top-tier suppliers.`,
        required: true,
      },
      {
        name: 'delegate_name_and_level',
        description: `Who's taking it on and their seniority relative to the task.`,
        example: `Priya, a mid-level ops analyst who has read the contracts but has never negotiated one solo.`,
        required: true,
      },
      {
        name: 'decision_authority_granted',
        description: `What you're actually willing to let them decide without you.`,
        example: `She can accept standard terms and up to a 5% price increase without checking with me; anything beyond that needs me.`,
        required: true,
      },
      {
        name: 'check_in_cadence',
        description: `How often and through what channel they should update you.`,
        example: `A short Slack update every Friday, even if there's nothing to report.`,
        required: true,
      },
      {
        name: 'escalation_trigger',
        description: `The specific condition that should make them stop and escalate rather than decide alone.`,
        example: `If a vendor threatens to walk away from the deal entirely, or asks for a term we've never granted before.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`delegation`, `management`, `raci`, `handoff`, `operations`],
    whyItWorks: `The single most common delegation failure is not unclear task description but an unclear authority boundary, and GPT-5.1 defaults toward diplomatic hedging language ('use your best judgment', 'feel free to decide') when asked to write delegation instructions in a neutral tone — which is precisely the failure mode this prompt targets by forcing every decision type into an explicit decide-alone / inform-after / wait-for-me bucket instead of a soft suggestion. Stating the escalation trigger as an observable, checkable condition rather than an open-ended 'if something goes wrong' matters because an unobservable trigger leaves the delegate guessing whether the current situation qualifies, which recreates the exact dependency on the delegator the brief is supposed to eliminate — a concrete signal like a vendor threatening to walk removes that guesswork entirely. Requiring a documented default action for what happens if the delegator is unreachable within the check-in cadence addresses a specific structural gap in most handoff documents: they describe the ideal case where the delegator responds promptly, but say nothing about the realistic case of a two-week absence, so the delegate stalls exactly when autonomy matters most. Asking the model to flag ambiguity in the authority input rather than silently resolving it in either direction is important because an AI-generated brief that guesses wrong on scope either grants too much authority (creating real risk) or too little (recreating the bottleneck) — surfacing the ambiguity lets the actual delegator make that call instead of an assumption baked silently into the document.`,
    exampleOutput: `Decide-alone: accepting standard terms, price changes up to 5%. Inform-after: any change to payment terms or delivery timelines. Wait-for-me: anything involving exclusivity clauses or contract termination language. Escalation trigger: a vendor refuses the 5% cap outright — stop, do not counter-offer, message me directly rather than waiting for Friday's check-in.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-time-blocking-weekly-calendar-plan',
    category: 'business-ops',
    title: `Build a weekly time-blocking plan around your actual meeting load, not an idealized week`,
    description: `Generates a realistic weekly time-block schedule that works around your fixed meetings and real energy patterns instead of assuming an empty calendar.`,
    promptText: `Build me a weekly time-blocking schedule that works around my actual week, not a fantasy version of it.

FIXED COMMITMENTS THIS WEEK
{{fixed_commitments}}

TOP PRIORITY THIS WEEK
{{top_priority_this_week}}

DEEP WORK HOURS I ACTUALLY NEED
{{deep_work_hours_needed}}

MY ENERGY PATTERN
{{energy_pattern}}

RECURRING TIME WASTERS
{{recurring_time_wasters}}

Start from the fixed commitments as immovable and build everything else around the gaps they leave — do not propose a schedule that assumes any of them can move, and if the gaps left are genuinely too fragmented to fit the stated deep work hours, say so directly instead of squeezing an unrealistic block in anyway. Place deep work in the windows that match my stated energy pattern where a gap of the right size actually exists; if my highest-energy window is already occupied by fixed commitments, say that plainly rather than defaulting to the textbook advice of 'do deep work in the morning' regardless of what I told you. Give the top priority the first usable deep-work block of the week, not the last one — a priority scheduled for Friday afternoon after everything else has taken the good slots isn't actually prioritized. For each recurring time-waster listed, either block a fixed, minimal window for it (so it stops bleeding into everything else) or flag it as something to actually eliminate this week rather than schedule — decide which based on whether it sounds like a necessary recurring task or a habit.

Do not produce a generic Monday-through-Friday grid with identical daily structure — a real week has different shapes on different days because of the fixed commitments, and the schedule should visibly reflect that. Do not schedule back-to-back deep work blocks longer than what's realistic for sustained focus without at least a short buffer between them.

OUTPUT FORMAT
A day-by-day table (Mon-Fri) with time blocks labeled by type — Fixed / Deep Work / Time-Waster Containment / Buffer — followed by one line flagging any day where the top priority didn't get a real slot, and why.`,
    variables: [
      {
        name: 'fixed_commitments',
        description: `Meetings and obligations that cannot move this week.`,
        example: `Daily 9:30-10am standup, Tuesday 2-4pm client review, Thursday 11am-12:30pm all-hands.`,
        required: true,
      },
      {
        name: 'top_priority_this_week',
        description: `The one thing that most needs protected focus time.`,
        example: `Finishing the Q3 budget model before Friday's finance sync.`,
        required: true,
      },
      {
        name: 'deep_work_hours_needed',
        description: `Roughly how many hours of uninterrupted focus you actually need.`,
        example: `About 8 hours total across the week, ideally in blocks of 90 minutes or more.`,
        required: true,
      },
      {
        name: 'energy_pattern',
        description: `When you're actually sharpest and when you're not.`,
        example: `Sharpest 8-11am, a hard crash after lunch until about 3pm, second wind late afternoon.`,
        required: true,
      },
      {
        name: 'recurring_time_wasters',
        description: `The habitual things that eat time without you scheduling them.`,
        example: `Checking Slack constantly between tasks, and unplanned 'quick calls' that run 30+ minutes.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `time-blocking`,
      `productivity`,
      `calendar-planning`,
      `focus-time`,
      `operations`,
    ],
    whyItWorks: `Generic time-blocking templates fail in practice because they're built around an idealized week with no meetings, so the first real fixed commitment collides with the plan and the whole thing gets abandoned by Tuesday — anchoring the model to the actual fixed commitments as immovable, and instructing it to say plainly when the remaining gaps can't fit the requested deep work hours, forces an honest schedule instead of an aspirational one that looks good but doesn't survive contact with the real calendar. GPT-5.1's default advice on deep work timing leans heavily on generic 'mornings are best for focus' guidance from its training distribution; explicitly requiring the schedule to match the stated energy pattern, and to flag it directly when the high-energy window is already occupied by a fixed meeting, prevents the model from overriding your actual reported energy data with textbook productivity advice that doesn't apply to your week. Placing the top priority in the first usable slot rather than wherever fits addresses a subtle scheduling bias: without an explicit instruction, priority-ranking naturally gets treated as informational rather than structural, and the stated priority ends up in the least protected slot simply because it was mentioned last in the reasoning. Forcing a decision between 'contain' and 'eliminate' for each named time-waster is what separates a time-blocking plan from a wish list — scheduling around a bad habit without addressing it just reproduces the same lost time inside a nicer-looking grid.`,
    exampleOutput: `Monday: 8-9:30am Deep Work (budget model — top priority gets the first slot), 9:30-10am Fixed (standup), 10-10:15am Buffer, 10:15-11am Time-Waster Containment (batch Slack replies)... Flag: Wednesday's only open deep-work window is 1-2:30pm, which falls in your stated post-lunch energy crash — consider swapping a lower-focus task into that slot instead.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-kpi-review-monthly-scorecard-narrative',
    category: 'business-ops',
    title: `Turn a raw KPI spreadsheet dump into a monthly review narrative leadership can actually act on`,
    description: `Converts a list of KPI numbers into a monthly review narrative that explains what moved, why, and what decision it implies — instead of a flat status recap nobody remembers by the next meeting.`,
    promptText: `You are turning a raw list of monthly KPIs into a short narrative for a review meeting — the goal is a story leadership can act on, not a restated spreadsheet.

KPI LIST WITH TARGETS AND ACTUALS
{{kpi_list_with_targets_and_actuals}}

TREND VS PRIOR MONTH
{{prior_month_trend}}

KNOWN EXTERNAL FACTOR
{{known_external_factor}}

WHO THIS REVIEW IS FOR
{{audience_for_review}}

DECISION NEEDED FROM THIS REVIEW
{{decision_needed_from_review}}

PHASE 1 — SORT BY WHAT MATTERS, NOT BY LIST ORDER
Re-rank the KPIs by how much each one actually changes the decision named above, not in the order they were given to you. A metric that's far off target but irrelevant to the decision gets a brief mention; a metric close to target but directly tied to the decision gets the most space.

PHASE 2 — EXPLAIN THE MOVEMENT, DON'T JUST REPORT IT
For each KPI you give real space to, state the number, whether it's better or worse than the trend, and a plausible reason tied to the known external factor where relevant — but do not invent a cause that wasn't given to you; if the reason for a move isn't clear from what I gave you, say the cause is unconfirmed rather than fabricating an explanation that sounds authoritative.

PHASE 3 — CONNECT TO THE DECISION
End with a direct statement of what this month's data implies for the specific decision leadership needs to make, stated as a recommendation with the confidence level attached — not a neutral 'the data suggests several possibilities' non-answer.

WHAT NOT TO DO
Do not describe every KPI with equal length regardless of relevance — that's what makes scorecard reviews forgettable. Do not use unexplained jargon the stated audience wouldn't already use themselves; match the register to who's in the room.

OUTPUT FORMAT
1. One-paragraph headline: the single most important thing this month's numbers say.
2. Two to four KPI call-outs, ranked by relevance to the decision, each with number, direction, and cause (or 'cause unconfirmed').
3. A one-paragraph recommendation tied explicitly to the stated decision, with a stated confidence level.`,
    variables: [
      {
        name: 'kpi_list_with_targets_and_actuals',
        description: `The raw KPI numbers, targets, and actuals for the month.`,
        example: `Customer churn: target 3%, actual 4.2%. Support ticket resolution time: target 24hrs, actual 19hrs. NPS: target 45, actual 41.`,
        required: true,
      },
      {
        name: 'prior_month_trend',
        description: `How this month compares to last month for the same metrics.`,
        example: `Churn was 3.1% last month, so it worsened. Resolution time improved from 27hrs. NPS was flat at 42.`,
        required: true,
      },
      {
        name: 'known_external_factor',
        description: `Anything happening outside normal operations that could plausibly explain a move.`,
        example: `A pricing increase took effect mid-month, and a competitor launched a heavily discounted plan the same week.`,
        required: false,
      },
      {
        name: 'audience_for_review',
        description: `Who's actually in the room for this review.`,
        example: `The VP of Customer Success and the CFO, neither of whom looks at the raw dashboards day-to-day.`,
        required: true,
      },
      {
        name: 'decision_needed_from_review',
        description: `The actual decision this review needs to move forward.`,
        example: `Whether to roll back the recent pricing increase before it hits next month's renewal cohort.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `kpi-review`,
      `reporting`,
      `operations`,
      `scorecard`,
      `executive-communication`,
    ],
    whyItWorks: `A flat KPI list gives every metric the same visual weight, which is exactly why scorecard reviews are forgettable — GPT-5.1, left to its own devices, tends to reproduce that same flatness by summarizing metrics in the order given rather than by relevance, so explicitly instructing a re-rank by decision-relevance in Phase 1 is what forces the output to read as a narrative instead of a restated table. The instruction to say 'cause unconfirmed' rather than inventing an explanation directly targets a known failure mode of language models asked to explain metric movement: without a hard constraint, the model will construct a plausible-sounding causal story connecting the external factor to the number even when no such link was actually stated, because a confident causal narrative is a more satisfying completion than an honest gap — forcing the model to distinguish stated fact from inference keeps a fabricated cause from being presented with the same authority as a real one. Matching the register to the named audience matters mechanically because a model with no audience constraint defaults to a dashboard-analyst register full of internal shorthand, which reads as noise to a CFO or VP who doesn't touch the underlying data day to day. Ending with a stated confidence level on the recommendation, rather than a hedge-everything summary, is the difference between a review that produces a decision and one that produces another meeting to decide whether to decide — an explicit confidence level gives leadership something to either act on or explicitly challenge, instead of a non-committal 'it depends' that changes nothing.`,
    exampleOutput: `Headline: Churn worsened for the second straight month, and the timing lines up closely enough with the pricing increase that it's the leading suspect, though not confirmed. Churn: 4.2% vs 3% target, worse than last month's 3.1% — plausibly tied to the pricing change, cause unconfirmed. Recommendation (moderate confidence): hold off on a full rollback, but exempt the renewal cohort most exposed to the increase before next month's cycle.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-qbr-outline-decision-first',
    category: 'business-ops',
    title: `Outline a QBR that leads with the one decision you need, not a status recap`,
    description: `Builds a QBR outline structured around a single leadership decision, with the status recap compressed to only what supports that ask.`,
    promptText: `Outline a Quarterly Business Review that opens with the decision I actually need from leadership, not a full status recap that buries the ask on slide 14.

QUARTER AND SCOPE
{{quarter_and_scope}}

HEADLINE RESULT
{{headline_result}}

BIGGEST MISS
{{biggest_miss}}

WHAT I NEED FROM LEADERSHIP
{{ask_from_leadership}}

NEXT QUARTER'S BIG BET
{{next_quarter_bet}}

The outline should be built backwards from the ask, not forwards from the quarter's events. Start with the ask stated plainly on the first slide, along with the one or two facts leadership needs to evaluate it — everything else in the deck exists to support that ask, not to document everything that happened this quarter. Slide 2 states the headline result in one line, framed in terms of what it means for the ask, not as a standalone achievement. Slide 3 addresses the biggest miss directly and briefly — name it, give the real reason without spin, and state what's already been done about it, since an unaddressed miss that leadership already knows about will derail the conversation into forensics the moment it's raised from the audience instead of preempted on the slide. Slide 4 covers next quarter's big bet only as far as it relates to the ask — if approving the ask changes what's possible next quarter, say so explicitly.

WHAT NOT TO DO
Do not build a chronological quarter recap and tack the ask onto the end — that's the default structure that buries asks, which is exactly what this outline exists to avoid. Do not pad the miss slide with justifications that read as excuse-making; state the reason once, plainly, and move to what's being done.

OUTPUT FORMAT
A slide-by-slide outline (4-6 slides), each with a one-line slide title and 2-3 bullet points of actual content, followed by one line stating the single question you expect leadership to ask and how the deck already answers it.`,
    variables: [
      {
        name: 'quarter_and_scope',
        description: `Which quarter and what part of the business this QBR covers.`,
        example: `Q2 2026, North America mid-market sales segment.`,
        required: true,
      },
      {
        name: 'headline_result',
        description: `The single most important result from the quarter.`,
        example: `Closed $2.1M in new ARR against a $1.8M target.`,
        required: true,
      },
      {
        name: 'biggest_miss',
        description: `The thing that didn't go well that leadership already knows or will ask about.`,
        example: `Renewal rate dropped to 84% from 91%, driven mostly by one large account churning.`,
        required: true,
      },
      {
        name: 'ask_from_leadership',
        description: `The actual decision or resource you need from this review.`,
        example: `Approval to hire two additional account managers to protect renewal coverage next quarter.`,
        required: true,
      },
      {
        name: 'next_quarter_bet',
        description: `The one big thing you're planning to try next quarter.`,
        example: `Piloting a proactive renewal check-in program 90 days before contract end.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `qbr`,
      `executive-presentation`,
      `operations`,
      `business-review`,
      `stakeholder-communication`,
    ],
    whyItWorks: `QBR decks built chronologically bury the ask because that's the default narrative shape for 'here's what happened this quarter' writing, and GPT-5.1 will reproduce that shape reliably unless explicitly told to build backwards from the decision instead — putting the ask on slide one and instructing every subsequent slide to justify it, rather than simply report on the quarter, restructures the entire piece of writing around a different organizing principle than the one models default to for review documents. Addressing the biggest miss on slide three rather than letting it surface as a Q&A ambush is a specific, well-known pattern in how executive reviews actually go wrong: an unaddressed known miss doesn't stay quiet, it gets raised by someone in the room, and if the deck hasn't already framed it, the framing gets set live and adversarially instead of on your terms — pre-empting it with the real reason and the fix in progress removes the highest-risk moment in the meeting before it happens. The instruction against excuse-padding on the miss slide matters because models asked to 'address a miss' tend to over-explain and stack justifications, which reads to a leadership audience as defensiveness and actually undermines credibility more than a single plain sentence would. Ending with a stated prediction of the one question leadership will ask forces the model to actually stress-test its own outline from the audience's side rather than just presenting content, which is what catches gaps a purely forward-written recap would miss.`,
    exampleOutput: `Slide 1 — The Ask: Approve two additional AM hires to protect renewal coverage heading into Q3, where 30% of ARR is up for renewal. Slide 2 — Headline: Beat new ARR target by $300K, but that growth is exposed if renewal coverage doesn't improve. Slide 3 — The Miss: Renewal rate fell to 84%, driven by one large account with no dedicated AM; a proactive check-in pilot is already scoped for Q3.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-presentation-outline-stakeholder-objection-first',
    category: 'business-ops',
    title: `Structure a stakeholder presentation around the one objection that'll actually sink it`,
    description: `Builds a presentation outline that surfaces and addresses the single most likely objection early, instead of hoping it doesn't come up until Q&A.`,
    promptText: `Structure a presentation outline for a specific stakeholder audience, built around defusing the one objection most likely to actually derail it — not a generic problem-solution-ask template.

PRESENTATION GOAL
{{presentation_goal}}

AUDIENCE AND WHAT'S AT STAKE FOR THEM
{{audience_and_stake}}

MOST LIKELY OBJECTION
{{likely_objection}}

SUPPORTING EVIDENCE AVAILABLE
{{supporting_evidence_available}}

TIME LIMIT
{{time_limit}}

First, decide where in the presentation the likely objection should be addressed: if it's fundamental enough that the audience will be silently skeptical of everything said before it's answered, address it early, even before the main pitch; if it's more of a detail that would come up near the end, place it there instead — do not default to 'address objections at the end' as a rule, decide based on how load-bearing this specific objection actually is to the audience's stated stake. Build the rest of the outline so that every section either sets up evidence needed to counter the objection or moves the goal forward — cut anything that does neither, especially given the stated time limit forces real prioritization. Where the supporting evidence available is genuinely insufficient to fully answer the objection, do not paper over that gap with confident language — say directly that the evidence doesn't fully settle it, and outline how the presentation should acknowledge that honestly while still making the case, since a stakeholder audience that catches a bluffed answer to their real objection will trust nothing else in the deck afterward.

WHAT NOT TO DO
Do not use a generic outline shape (situation-complication-resolution, or problem-solution-benefits) applied mechanically — build the shape around this specific objection and audience. Do not exceed a section count that fits the stated time limit; a 10-minute slot does not get a 12-section outline.

OUTPUT FORMAT
1. One line stating where the objection is placed in the outline and why.
2. Section-by-section outline with a one-line purpose per section, sized to the time limit.
3. If the evidence is insufficient to fully answer the objection, one paragraph on how the outline handles that honestly.`,
    variables: [
      {
        name: 'presentation_goal',
        description: `What you actually want to happen as a result of this presentation.`,
        example: `Get budget approval for a 6-month pilot of a new customer support ticketing platform.`,
        required: true,
      },
      {
        name: 'audience_and_stake',
        description: `Who's watching and what they personally have riding on the decision.`,
        example: `The CFO, who's wary after the last tooling migration went over budget and disrupted support coverage for a month.`,
        required: true,
      },
      {
        name: 'likely_objection',
        description: `The specific pushback most likely to actually derail the pitch.`,
        example: `That this is just another tool migration that will repeat last year's budget overrun and disruption.`,
        required: true,
      },
      {
        name: 'supporting_evidence_available',
        description: `What proof or data you actually have to counter the objection.`,
        example: `A fixed-price vendor quote and a parallel-run plan that keeps the old system live during transition, but no case study from a company our exact size.`,
        required: true,
      },
      {
        name: 'time_limit',
        description: `How long you actually have to present.`,
        example: `15 minutes, including Q&A.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `presentation-outline`,
      `stakeholder-communication`,
      `operations`,
      `executive-buy-in`,
      `storytelling`,
    ],
    whyItWorks: `Generic presentation templates place objection-handling at the end because that's the conventional structure in business-writing training data, but a load-bearing objection left until the final slides means the audience spends the entire presentation in silent skepticism, discounting every earlier claim — forcing the model to explicitly decide where the objection belongs based on how fundamental it is to the audience's stated stake, rather than defaulting to end-placement, produces a structure that actually matches how a skeptical stakeholder processes information in real time. The instruction against papering over insufficient evidence targets a specific and costly failure mode: language models asked to 'address an objection' will often generate confident-sounding language that implies the evidence fully settles the concern even when it doesn't, because a hedged answer reads as weaker prose — but a stakeholder audience that later discovers the confident answer was thinner than it sounded stops trusting every other claim in the deck, which is a worse outcome than an honest acknowledgment up front. Sizing the section count to the actual time limit matters because outlines generated without a hard constraint tend toward comprehensive coverage of the topic rather than a version cut down to what fits, and a presenter who walks in with more content than time available either rushes past the objection-handling section (defeating the whole point of this structure) or runs over and loses the room before the ask lands. Anchoring every section to either 'sets up the objection rebuttal' or 'advances the goal' as a binary filter is what prevents scope creep back toward a generic comprehensive-overview structure.`,
    exampleOutput: `Objection placement: address it second, right after stating the goal, since the CFO's skepticism about repeat budget overruns will color every subsequent slide if left unaddressed. Section 2 — Why This Isn't Last Year: the fixed-price quote and parallel-run plan, stated plainly, with an honest note that we don't have a same-size case study yet, followed by what would trigger an early stop if the pilot underperforms.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-internal-change-announcement-reply-all-proof',
    category: 'business-ops',
    title: `Draft an internal change announcement that survives the reply-all pile-on`,
    description: `Writes an internal announcement of an operational change with the likely objections pre-empted in the text itself, so it doesn't spiral into a reply-all thread of confusion and complaints.`,
    promptText: `Write an internal announcement for an operational change, structured to pre-empt the confusion and complaints it will predictably generate rather than triggering a reply-all thread.

WHAT'S CHANGING
{{change_being_announced}}

WHO IS AFFECTED
{{who_is_affected}}

WHY THIS IS CHANGING
{{reason_for_change}}

EFFECTIVE DATE
{{effective_date}}

WHO TO CONTACT WITH QUESTIONS
{{who_to_contact_with_questions}}

Open with what's changing and the effective date in the first two sentences — do not bury the actual news under throat-clearing about company values or a long preamble; people affected by a change scan for 'what changed and when' first and read the reasoning only if that's already clear. State the reason for the change honestly and specifically enough to be believed — a reason that sounds like corporate boilerplate ('to better serve our stakeholders') invites more suspicion and pushback than a plain, specific one, even when the plain one is less flattering. Anticipate the two or three questions this specific group of affected people will actually have — not generic FAQ filler — and answer them directly in the body, since an announcement that leaves an obvious question unanswered is what actually triggers a reply-all thread, as people ask it publicly instead of privately. Name the single point of contact clearly and make it the only channel offered, so questions route to one place instead of scattering across replies, DMs, and hallway conversations that create conflicting answers.

WHAT NOT TO DO
Do not use passive voice to soften who made the decision ('it has been decided that...') — state who owns the decision. Do not promise reassurance you can't back up ('this won't affect your workload') unless that's actually true; an announcement caught overpromising loses credibility for every future one.

OUTPUT FORMAT
A ready-to-send announcement: subject line, opening two sentences stating the change and date, a short reasoning paragraph, a 2-3 item anticipated-question section answered directly, and a closing line naming the single contact point.`,
    variables: [
      {
        name: 'change_being_announced',
        description: `The specific operational change taking effect.`,
        example: `Switching the expense reimbursement process from monthly batch approval to a rolling weekly approval cycle.`,
        required: true,
      },
      {
        name: 'who_is_affected',
        description: `Who this actually touches.`,
        example: `All employees who submit expense reports, roughly 400 people across three departments.`,
        required: true,
      },
      {
        name: 'reason_for_change',
        description: `The real, specific reason for the change.`,
        example: `The monthly batch process was causing a two-week backlog that delayed reimbursements past the point employees were fronting real money.`,
        required: true,
      },
      {
        name: 'effective_date',
        description: `When the change actually takes effect.`,
        example: `Starting the first Monday of next month.`,
        required: true,
      },
      {
        name: 'who_to_contact_with_questions',
        description: `The single named contact point for questions.`,
        example: `The Finance Ops team via the #finance-help Slack channel, not individual finance staff.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `internal-communications`,
      `change-management`,
      `operations`,
      `announcement`,
      `employee-communication`,
    ],
    whyItWorks: `Reply-all pile-ons on internal announcements are, mechanically, almost always caused by an obvious question left unanswered in the original message — someone asks it publicly because there was no other visible channel, and once one person replies-all, others pile on with their own questions in the same thread; instructing the model to specifically anticipate this group's likely questions and answer them inline, rather than writing a generic body paragraph, closes off the exact trigger condition. GPT-5.1's default register for internal announcements leans toward soft, values-forward corporate phrasing ('to better serve our team') when not given a concrete reason, and that vagueness reads as evasive to an audience already primed to be annoyed by a process change — requiring the reasoning to be specific and honest, even when it's less flattering, produces language that reads as trustworthy specifically because it doesn't sound like boilerplate. The instruction to open with the change and date in the first two sentences targets how people actually read mass internal emails: they scan for personal relevance before reading justification, so an announcement that leads with preamble gets skimmed past its own reasoning entirely and the reader goes straight to asking the question the announcement was trying to pre-empt. Naming exactly one contact channel, and instructing the model not to let multiple people appear as valid contacts, prevents the scattered-and-conflicting-answers problem that happens when questions get fielded by whoever happens to reply first, which is often not the person with the actual correct answer.`,
    exampleOutput: `Subject: Expense approvals move to weekly starting [date]. Starting the first Monday of next month, expense reimbursements will be approved weekly instead of in a monthly batch. This is changing because the monthly cycle was creating a two-week backlog that left people fronting real money longer than it should. If you're mid-cycle when this switches, your current report will be processed under the new weekly schedule automatically. Questions go to #finance-help, not individual Finance staff.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-internal-policy-first-draft-redlinable',
    category: 'business-ops',
    title: `Draft a first-pass internal policy a reviewer can redline instead of rewrite from scratch`,
    description: `Produces a structured first-draft internal operating policy — scope, rules, exceptions, enforcement — built to move a review conversation forward, not to be treated as a finished or authoritative document.`,
    promptText: `Draft a first-pass internal operating policy on the topic below. Treat this explicitly as a working draft meant to give a reviewer something concrete to redline, not a finished or authoritative policy — state that plainly in the draft's own header so nobody mistakes it for final.

POLICY TOPIC
{{policy_topic}}

WHAT PROMPTED THIS (GAP OR INCIDENT)
{{current_gap_or_incident}}

WHO THIS POLICY APPLIES TO
{{who_policy_applies_to}}

EXCEPTIONS THAT SHOULD BE ALLOWED
{{exceptions_allowed}}

HOW THIS GETS ENFORCED
{{enforcement_mechanism}}

Open the draft with a header stating clearly: 'DRAFT — for internal review, not yet approved; requires sign-off from [the appropriate reviewer, e.g. HR/Legal/relevant department owner] before distribution or enforcement.' Then write the policy body in four short sections: Purpose (tied directly to the gap or incident that prompted it, stated factually, not dramatized), Scope (exactly who it applies to and, just as important, who it explicitly does not), Rules (stated as specific, checkable requirements — 'requests must be submitted 5 business days in advance' rather than 'requests should be submitted with reasonable notice'), and Exceptions (the named exceptions, plus who has authority to grant an exception not explicitly listed, since a policy with zero exception path invites people to just ignore it). Add a brief Enforcement section stating the mechanism given, and where it's unclear who actually enforces it, flag that as an open question for the reviewer rather than inventing an enforcement authority that wasn't stated. Do not invent specific legal requirements, regulations, or compliance obligations to justify the policy — where the input doesn't specify a compliance basis, note that the compliance basis, if any, still needs confirming by the appropriate reviewer rather than asserting one.

OUTPUT FORMAT
A short, ready-to-review draft with the draft-status header, then Purpose / Scope / Rules / Exceptions / Enforcement sections, ending with a short 'Open Questions for Reviewer' list naming anything the draft had to guess at or leave unresolved.`,
    variables: [
      {
        name: 'policy_topic',
        description: `The specific operational area this policy covers.`,
        example: `Remote work eligibility and expectations for customer-facing support staff.`,
        required: true,
      },
      {
        name: 'current_gap_or_incident',
        description: `What prompted the need for a policy — a gap, inconsistency, or specific incident.`,
        example: `Three different managers have approved remote work under three different informal rules, and one team lead is now getting pushback for being stricter than the others.`,
        required: true,
      },
      {
        name: 'who_policy_applies_to',
        description: `The specific group covered, and who's explicitly excluded.`,
        example: `All customer support staff below director level; does not apply to on-site facilities or IT staff who need physical presence.`,
        required: true,
      },
      {
        name: 'exceptions_allowed',
        description: `What exceptions should exist, if any.`,
        example: `Temporary remote work for a documented medical reason, approved case-by-case by the department director.`,
        required: false,
      },
      {
        name: 'enforcement_mechanism',
        description: `How compliance is actually checked or enforced, as far as you know.`,
        example: `Manager sign-off logged in the HR system; unclear yet who audits it after the fact.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `policy-drafting`,
      `operations`,
      `internal-policy`,
      `hr-adjacent`,
      `governance`,
    ],
    whyItWorks: `The single biggest risk of AI-drafted internal policy is that a fluent, confidently-formatted document gets treated as final and distributed before the right person has actually reviewed it, so the explicit draft-status header instruction addresses that risk structurally rather than relying on the reader to remember it's a draft — putting the caveat inside the artifact itself means it travels with the document even if it gets forwarded or copied into another tool. GPT-5.1 tends to write policy rules in soft, non-checkable language ('with reasonable notice', 'as appropriate') when not explicitly constrained, because that phrasing sounds professional in isolation — but a rule that can't be checked against an actual case is unenforceable and just relocates the ambiguity from before the policy existed to after it exists, so requiring specific, checkable requirements is what makes the draft actually useful rather than cosmetically official. The instruction against inventing a specific compliance or legal basis is a direct guard against a common and risky failure mode: a model asked to justify a policy will sometimes reach for a plausible-sounding regulatory reason to make the writing sound more authoritative, and presenting a fabricated compliance basis as fact inside a document that might get treated as settled is exactly the kind of error that compounds if nobody catches it before distribution. Ending with an explicit open-questions list converts the draft from something that looks finished into something that visibly still needs a specific person's judgment, which is the entire point of treating this as a redline starting point rather than a shortcut around the actual review the topic requires.`,
    exampleOutput: `DRAFT — for internal review, not yet approved; requires sign-off from HR before distribution or enforcement. Purpose: to resolve inconsistent remote-work approvals across support teams following manager disagreement over informal rules. Scope: applies to all customer support staff below director level; does not apply to on-site facilities or IT roles. Open Questions for Reviewer: who audits manager sign-offs after the fact is not yet defined and needs a named owner before this can be enforced consistently.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-brd-stakeholder-ask-to-requirements',
    category: 'business-ops',
    title: `Turn a stakeholder's one-paragraph ask into a BRD a developer won't have to guess at`,
    description: `Expands a loosely-worded stakeholder request into a business requirements document with explicit scope boundaries and a measurable success metric, closing the gaps that cause rework later.`,
    promptText: `Turn the stakeholder request below into a business requirements document precise enough that a developer or vendor wouldn't need to guess at anything material.

BUSINESS PROBLEM AS STATED
{{business_problem_statement}}

REQUESTER AND OTHER STAKEHOLDERS
{{requester_and_stakeholders}}

WHAT'S IN SCOPE (AS UNDERSTOOD SO FAR)
{{in_scope_summary}}

WHAT'S EXPLICITLY OUT OF SCOPE
{{out_of_scope_items}}

HOW SUCCESS WILL BE MEASURED
{{success_metric}}

Start by restating the business problem in your own words, separate from any solution — stakeholders often describe a desired solution when they mean to describe a problem, and conflating the two locks in an approach before the actual need is fully understood; if the input reads like a solution disguised as a problem, name that distinction explicitly. Write the in-scope section as concrete, testable requirements, not aspirations — each requirement should be something a developer could build against and a reviewer could verify as done or not done. The out-of-scope section matters as much as the in-scope one: state explicitly what this project will NOT do, especially anything a stakeholder might reasonably assume is included but isn't, since unstated scope assumptions are the most common source of late-stage rework and disputed 'that wasn't in scope' arguments. Where the input leaves a requirement ambiguous — timing, volume, edge cases, who approves what — do not silently pick an interpretation; list it as an open question requiring stakeholder confirmation, tagged with who should answer it. State the success metric as something measurable with a real number or checkable condition, and if what was given is vague ('improve efficiency'), push back on it in the document by proposing a specific measurable version rather than accepting the vague one as-is.

WHAT NOT TO DO
Do not fill scope gaps with your own assumptions presented as settled fact — every genuine gap becomes a flagged open question, not an invented default. Do not write requirements as user-story fluff without concrete acceptance criteria.

OUTPUT FORMAT
1. Business Problem (restated, solution-neutral).
2. In-Scope Requirements (numbered, each testable).
3. Out-of-Scope (explicit list).
4. Success Metric (measurable, with a pushback note if the original was vague).
5. Open Questions for Stakeholder Confirmation, each tagged with who should answer it.`,
    variables: [
      {
        name: 'business_problem_statement',
        description: `The stakeholder's original request, in whatever loose form it came in.`,
        example: `"We need a dashboard so managers can see team performance without asking finance for reports every week."`,
        required: true,
      },
      {
        name: 'requester_and_stakeholders',
        description: `Who asked for this and who else has a stake in the outcome.`,
        example: `Requested by the VP of Operations; other stakeholders include team managers who'd use it and Finance, who currently owns the underlying data.`,
        required: true,
      },
      {
        name: 'in_scope_summary',
        description: `What you currently understand to be included, even loosely.`,
        example: `A dashboard showing per-team KPI actuals vs targets, refreshed weekly, viewable by managers for their own team only.`,
        required: true,
      },
      {
        name: 'out_of_scope_items',
        description: `Anything you already know should NOT be included, even if a stakeholder might assume it is.`,
        example: `Not building any new data source — pulls only from existing Finance spreadsheets; not giving managers edit access to underlying numbers.`,
        required: true,
      },
      {
        name: 'success_metric',
        description: `How success will be judged, even if currently vague.`,
        example: `Given as 'managers stop asking Finance for reports' — no number attached yet.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `brd`,
      `requirements-gathering`,
      `operations`,
      `project-management`,
      `scope-definition`,
    ],
    whyItWorks: `Stakeholders reliably describe a desired solution when asked for a problem statement, and a model that accepts the solution-shaped input at face value locks in an approach before anyone has actually verified it's the right one — instructing the model to separate problem from solution and flag when the input conflates them catches this at the one point in the process where it's still cheap to fix, before a developer has built against it. The out-of-scope section is weighted as heavily as in-scope specifically because late-stage project disputes are overwhelmingly about unstated assumptions rather than stated requirements — nobody argues about what's explicitly written down, they argue about what one side assumed was included and the other side never confirmed, so forcing explicit exclusions surfaces exactly the kind of assumption that would otherwise surface as a disagreement three sprints in. The instruction to convert ambiguity into a tagged open question rather than a silent assumption directly targets how GPT-5.1 behaves under an underspecified brief: left unconstrained, it fills gaps with a plausible-sounding default that reads as confident and settled, which is more dangerous in a requirements document than an admitted gap, because a developer building against a confidently-stated but silently-assumed requirement has no signal that it was ever in question. Pushing back on a vague success metric rather than accepting it verbatim matters because 'managers stop asking Finance for reports' is not something anyone can verify was achieved — a requirements document that inherits an unmeasurable goal from the original stakeholder ask guarantees an unresolvable argument later about whether the project succeeded.`,
    exampleOutput: `Business Problem (restated): Team managers currently lack direct visibility into their own team's KPI performance and depend on ad hoc requests to Finance, creating delay and repeated manual reporting work for Finance. Open Question (for VP of Operations): should the weekly refresh be a fixed day/time, and does 'per-team only' visibility need any exception for cross-team roll-up views for the VP's own use? Success Metric (pushback): 'managers stop asking Finance for reports' isn't directly measurable — proposing instead: a 90% reduction in ad hoc reporting requests to Finance within 60 days of launch, tracked via the Finance team's existing request log.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-project-kickoff-brief-three-questions',
    category: 'business-ops',
    title: `Write a project kickoff brief that answers the three questions every kickoff meeting re-litigates`,
    description: `Produces a kickoff brief pre-answering scope, ownership, and done-ness before the meeting starts, so the actual kickoff conversation moves past the questions that usually eat the whole hour.`,
    promptText: `Write a project kickoff brief for the project below, built specifically to answer the three questions every kickoff meeting ends up re-litigating live: who owns what, what does done actually look like, and what happens when something in scope turns out to be harder than expected.

PROJECT NAME AND GOAL
{{project_name_and_goal}}

SPONSOR AND DECISION MAKER
{{sponsor_and_decision_maker}}

TEAM MEMBERS AND ROLES
{{team_members_and_roles}}

HARD DEADLINE OR CONSTRAINT
{{hard_deadline_or_constraint}}

DEFINITION OF DONE
{{definition_of_done}}

Open with the goal in one sentence, stated as an outcome, not an activity — 'ship a working self-serve refund flow' rather than 'work on refunds.' Then build an ownership table from the team members and roles given: for each person, state not their job title but the specific decision types they own for this project, since kickoff meetings burn time re-deciding ownership that was never actually assigned to a name. Write the definition of done as a specific, checkable condition — something the team could point to and agree it's either met or not met — and if what was given is vague ('the feature works well'), rewrite it as the sharpest checkable version you can construct and flag that it needs the sponsor's confirmation. State the hard deadline plainly along with what it actually constrains — if the deadline conflicts with the definition of done given the team size, say so directly rather than presenting both as simultaneously achievable when they may not be. Add a short section anticipating what happens if a scoped-in piece of work turns out to be significantly harder than expected mid-project — name who has authority to cut scope versus who has authority to push the deadline, since without this stated upfront, that exact moment turns into an unplanned escalation later.

WHAT NOT TO DO
Do not write generic kickoff boilerplate ('let's align on goals and next steps') — every line should reference this specific project. Do not leave ownership assigned to a team or department rather than a named individual; a shared owner is not an owner.

OUTPUT FORMAT
1. Goal, one sentence, outcome-framed.
2. Ownership table: name, specific decisions they own.
3. Definition of done, checkable, with a flag if it was sharpened from something vaguer.
4. Deadline/constraint, with an explicit note if it conflicts with the definition of done.
5. Scope-pressure plan: who cuts scope vs. who moves the deadline if something proves harder than expected.`,
    variables: [
      {
        name: 'project_name_and_goal',
        description: `The project and its actual intended outcome.`,
        example: `Self-serve refund flow — let customers request and receive standard refunds without a support ticket.`,
        required: true,
      },
      {
        name: 'sponsor_and_decision_maker',
        description: `Who's sponsoring this and who has final say on scope/deadline trade-offs.`,
        example: `Sponsored by the Head of Support; final scope/deadline calls rest with the Product Lead, Marcus.`,
        required: true,
      },
      {
        name: 'team_members_and_roles',
        description: `Who's on the team and their functional role.`,
        example: `Priya (backend engineer), Sam (frontend engineer), Dana (support ops, part-time on this project), Marcus (product lead).`,
        required: true,
      },
      {
        name: 'hard_deadline_or_constraint',
        description: `Any fixed date or resource limit that can't move.`,
        example: `Must launch before the holiday return-season spike, six weeks from now.`,
        required: true,
      },
      {
        name: 'definition_of_done',
        description: `What 'finished' looks like, even if currently loosely stated.`,
        example: `Given as 'refunds should be self-service' — no specifics on which refund types or what edge cases are covered.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `project-kickoff`,
      `project-management`,
      `operations`,
      `team-alignment`,
      `scope-planning`,
    ],
    whyItWorks: `Kickoff meetings that feel like they accomplished nothing usually spent the hour re-litigating exactly three things live — who's actually responsible for what, what counts as finished, and what happens if scope turns out to be bigger than expected — because none of them were pinned down beforehand in writing, so building the brief specifically around pre-answering those three collapses the part of the meeting that otherwise eats all the time into a document people can react to instead of construct from scratch in the room. The instruction to assign ownership to a named individual for specific decision types, not a role or a shared team, targets a very common and costly ambiguity: 'the engineering team owns backend decisions' sounds like an assignment but functions as no assignment at all the moment a real decision needs to be made under time pressure, because no single person feels the accountability is theirs specifically. Sharpening a vague definition of done into a checkable condition — and explicitly flagging that it needs sponsor confirmation rather than silently presenting the sharpened version as agreed — matters because GPT-5.1 will otherwise happily generate a confident-sounding 'done' criterion that reads as settled, when in fact it's the model's own interpretation standing in for a decision the sponsor never actually made; flagging it preserves the sponsor's authority to correct it before the team builds against the wrong target. The scope-pressure section addresses the single most common cause of late-project conflict: without a stated-in-advance answer to 'who decides whether we cut scope or move the deadline,' that decision gets made reactively and often by whoever's loudest in a stressed conversation, rather than by whoever was actually supposed to make it.`,
    exampleOutput: `Goal: Ship a self-serve refund flow so customers can request and receive standard refunds without opening a support ticket. Definition of done (sharpened, needs Marcus's confirmation): customers can request a refund for any order under $200 placed within 30 days, receive automatic approval without support involvement, and see confirmation within 24 hours — orders over $200 or outside 30 days still route to support manually. Scope-pressure plan: Marcus decides whether to cut a refund type from scope; the six-week launch deadline itself does not move without the Head of Support's sign-off.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-okr-draft-sandbagged-target-check',
    category: 'business-ops',
    title: `Draft quarterly OKRs that fail the 'sandbagged target' test before your manager does`,
    description: `Drafts quarterly objectives and key results with an explicit stretch-vs-committed distinction and dependency check, so they hold up to scrutiny instead of getting quietly padded for safety.`,
    promptText: `Draft quarterly OKRs for the team/function below, and specifically stress-test them for being sandbagged — targets set comfortably low so they're easy to hit — before I take them into review.

TEAM OR FUNCTION
{{team_or_function}}

OBJECTIVE THEME
{{objective_theme}}

CURRENT BASELINE METRIC
{{current_baseline_metric}}

STRETCH VS. COMMITTED INTENT
{{stretch_vs_committed}}

DEPENDENCY ON ANOTHER TEAM
{{dependency_on_other_team}}

Write one objective — a qualitative statement of direction, not a number — and two to three key results under it, each a specific measurable target with a number and a deadline. For each key result, check it explicitly against the current baseline: if the target is barely above the baseline given the quarter's timeframe, flag it as a likely sandbagged target rather than presenting it as ambitious, and propose a genuinely stretch alternative alongside it so I can see both. Respect the stated stretch-vs-committed intent — a key result explicitly meant to be a safe committed target should be labeled as such rather than dressed up in stretch language, and a key result meant to be a real stretch should be allowed to carry real risk of missing, since OKRs that are all committed and none stretch defeat the purpose of the framework. Where a key result depends on another team delivering something first, state that dependency explicitly next to the key result and flag the risk that hitting this KR is partly outside this team's control — an OKR that silently assumes another team's cooperation sets the owning team up to be blamed for someone else's miss.

WHAT NOT TO DO
Do not write key results as activities ('launch the new dashboard') instead of outcomes ('reduce average resolution time to under 4 hours') — an activity can be completed without moving anything that matters. Do not inflate the objective statement with vague ambition language that isn't backed by an actual key result underneath it.

OUTPUT FORMAT
1. Objective (one sentence, direction not number).
2. Two to three key results, each numbered, with target, deadline, and a stretch/committed label.
3. For any KR flagged as likely sandbagged, the stretch alternative shown alongside it.
4. Dependency flags for any KR partly outside this team's control.`,
    variables: [
      {
        name: 'team_or_function',
        description: `Which team or function these OKRs are for.`,
        example: `Customer Support, 12-person team.`,
        required: true,
      },
      {
        name: 'objective_theme',
        description: `The general direction or theme for the quarter.`,
        example: `Reduce how long customers wait for a resolved answer.`,
        required: true,
      },
      {
        name: 'current_baseline_metric',
        description: `Where things stand today, as a real number.`,
        example: `Average resolution time is currently 9.5 hours; first-response time is 2 hours.`,
        required: true,
      },
      {
        name: 'stretch_vs_committed',
        description: `Whether you want this quarter's OKRs to be a safe committed bar or a genuine stretch.`,
        example: `Want one committed KR we're confident we'll hit, and one real stretch KR even if there's a real chance we miss it.`,
        required: true,
      },
      {
        name: 'dependency_on_other_team',
        description: `Anything this team needs from another team to hit its targets.`,
        example: `Faster resolution depends partly on Engineering shipping a promised macro-automation feature, which isn't fully in Support's control.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `okr`,
      `goal-setting`,
      `operations`,
      `performance-management`,
      `quarterly-planning`,
    ],
    whyItWorks: `OKRs get sandbagged constantly because a target set comfortably close to the current baseline is easy to defend in the moment and easy to hit later, and a model asked to 'draft ambitious OKRs' without a baseline comparison has no way to actually judge ambition — it can only generate ambitious-sounding language attached to whatever number it's given, which is exactly how confidently-worded sandbagged targets get through review. Explicitly checking each key result against the stated current baseline, and flagging anything too close to it as likely sandbagged rather than accepting the framing given, forces a numeric sanity check instead of a vibes-based one, and showing the stretch alternative alongside it gives the person reviewing something concrete to compare against rather than just a warning. The instruction to respect the stated stretch-vs-committed intent, rather than uniformly dressing every KR in ambitious language, matters because a common failure of AI-assisted goal-setting is flattening a genuinely mixed portfolio — some targets meant to be safe, some meant to carry real risk — into uniformly optimistic phrasing that obscures which is which, defeating the entire point of separating stretch from committed goals in the OKR framework to begin with. Flagging cross-team dependencies explicitly next to the affected key result addresses a specific accountability failure mode: a team held to a target that quietly depends on another team's unshipped work gets blamed for a miss that wasn't actually within its control, and surfacing the dependency in the document itself — rather than leaving it as an unstated assumption — gives the team something concrete to raise in the actual OKR review before commitments are locked in.`,
    exampleOutput: `KR1 (committed): Reduce first-response time from 2 hours to under 90 minutes by end of quarter. KR2 (stretch, dependency flagged): Reduce average resolution time from 9.5 hours to under 5 hours by end of quarter — partly dependent on Engineering shipping the macro-automation feature; if that slips, this target is at real risk regardless of Support's own execution. Sandbagged-target check: a target of 8.5 hours would have been within easy reach of the current baseline without real effort — 5 hours is the genuine stretch version shown here instead.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-strategy-plan-executive-one-pager',
    category: 'business-ops',
    title: `Compress a strategy plan into a one-pager an executive will actually finish reading`,
    description: `Distills a strategic plan into a single readable page organized around the actual decision requested, cutting anything that doesn't serve that decision.`,
    promptText: `Compress this into a strategy one-pager built to actually get read in full by a busy executive, not a shortened version of a longer deck.

STRATEGIC QUESTION BEING ANSWERED
{{strategic_question}}

TIME HORIZON
{{time_horizon}}

REAL RESOURCING SITUATION
{{resourcing_reality}}

COMPETING PRIORITY
{{competing_priority}}

DECISION REQUESTED
{{decision_requested}}

Everything on this page has to earn its place against one test: does it change how the reader thinks about the decision requested. Cut anything that's context for its own sake. Open with the decision requested stated as a single sentence, before any background — an executive reading this should know within five seconds what they're being asked to approve or weigh in on. Follow with the strategic recommendation itself, stated plainly, then the two or three reasons behind it, each backed by something concrete from the resourcing reality or competing priority given — not abstract strategic language that could apply to any plan. Address the competing priority head-on rather than ignoring it: state explicitly what this strategy would take resources away from, since an executive weighing a recommendation is implicitly weighing it against what else that resourcing could do, and a one-pager that pretends there's no trade-off reads as either naive or dishonest. State the time horizon plainly and tie the recommendation's urgency to it — why does this decision need to happen on this timeline rather than later.

WHAT NOT TO DO
Do not open with mission-statement-style framing ('as we look to the future...') — get to the decision immediately. Do not list more than three supporting reasons; a one-pager that tries to be comprehensive stops being a one-pager in substance even if it fits on one physical page.

OUTPUT FORMAT
A single page: decision requested (one sentence), recommendation (one paragraph), three or fewer supporting reasons (each tied to something concrete), the competing-priority trade-off stated plainly, and the time-horizon urgency in one closing sentence.`,
    variables: [
      {
        name: 'strategic_question',
        description: `The actual strategic question this plan is answering.`,
        example: `Should we expand into the SMB segment or double down on enterprise for the next two years?`,
        required: true,
      },
      {
        name: 'time_horizon',
        description: `The timeframe this strategy covers.`,
        example: `Next 18 months, with a check-in at the 9-month mark.`,
        required: true,
      },
      {
        name: 'resourcing_reality',
        description: `What resources actually exist to execute this, realistically.`,
        example: `One dedicated product manager and a 4-person engineering pod that would need to be pulled off the enterprise roadmap.`,
        required: true,
      },
      {
        name: 'competing_priority',
        description: `What this strategy would take resources away from.`,
        example: `Would delay the planned enterprise SSO integration by one quarter.`,
        required: true,
      },
      {
        name: 'decision_requested',
        description: `The specific decision or approval you need from the reader.`,
        example: `Approval to reallocate the 4-person engineering pod to an SMB pilot for two quarters.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `strategy-plan`,
      `executive-communication`,
      `operations`,
      `one-pager`,
      `resource-allocation`,
    ],
    whyItWorks: `Strategy documents that fail to get read in full almost always front-load context and save the actual ask for the end, which works against how executives actually triage reading material — they decide within the first few seconds whether something requires their full attention, and a document that makes them read background before reaching the decision gets skimmed or deferred; opening with the decision requested as a single sentence is a direct fix for that triage behavior rather than a stylistic preference. GPT-5.1 tends toward comprehensive, mission-framed openings on strategy documents by default because that's the register most strategy-writing training data uses, so explicitly forbidding the 'as we look to the future' framing and capping supporting reasons at three is necessary to override that default toward something that actually reads as a one-pager in substance, not just in page count. Requiring the competing-priority trade-off to be stated plainly, rather than omitted, targets a specific credibility problem: any real resource allocation decision has an opportunity cost, and an executive evaluating a recommendation is implicitly comparing it against what else those resources could do — a one-pager that omits the trade-off either looks naive about how resourcing actually works or looks like it's deliberately hiding the cost, and either read undermines the recommendation's credibility more than stating the trade-off honestly would. Tying urgency explicitly to the stated time horizon prevents the common failure of strategy documents that argue a course of action is correct without ever establishing why it needs deciding now rather than next quarter, which is often the first question a resourcing-constrained executive actually asks.`,
    exampleOutput: `Decision requested: Approve reallocating the 4-person engineering pod to a two-quarter SMB pilot. Recommendation: Pursue the SMB pilot now rather than waiting, because the competitive window in that segment is narrowing faster than our enterprise roadmap slip would cost us. Trade-off: this delays the enterprise SSO integration by one quarter — a real cost, but a recoverable one against a 9-month check-in.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-positioning-statement-compared-to-what',
    category: 'business-ops',
    title: `Write a positioning statement that survives someone asking 'compared to what?'`,
    description: `Builds a market positioning statement explicitly anchored against the real current alternative customers use, instead of vague category language that collapses under the first tough question.`,
    promptText: `Write a market positioning statement for the offer below, built to survive the first question a skeptical prospect or exec always asks: 'compared to what?'

PRODUCT OR OFFER
{{product_or_offer}}

TARGET CUSTOMER SEGMENT
{{target_customer_segment}}

MAIN ALTERNATIVE THEY USE TODAY
{{main_alternative_they_use_today}}

PROOF POINT AVAILABLE
{{proof_point_available}}

CATEGORY FRAME
{{category_frame}}

A positioning statement that doesn't name a real alternative is not actually positioning anything — it's just a description. Write the statement explicitly against the stated main alternative: name what that alternative is (by type if not by brand), state honestly what it does reasonably well, and then state the specific, narrow thing this offer does differently that the alternative structurally can't match — not a longer list of features, one sharp difference. Anchor that difference to the proof point given; if the proof point is thin or anecdotal, don't inflate the language to sound more definitive than the evidence supports — state the claim at the confidence level the actual proof point justifies, and note plainly if stronger proof is still needed before using this in a competitive claim externally. Use the category frame to tell the reader what kind of thing this even is before making any comparison — positioning against an alternative only lands if the reader already understands what category both options belong to.

WHAT NOT TO DO
Do not write positioning that's actually a features list dressed as a statement. Do not use the alternative as a strawman — describing it unfairly weakly is exactly what invites the 'compared to what?' pushback in the first place, because a sophisticated reader will recognize the alternative wasn't given a fair shake and discount the whole claim.

OUTPUT FORMAT
1. Category frame sentence (what kind of thing this is).
2. Honest one-line characterization of the main alternative.
3. The one sharp difference, stated plainly.
4. The positioning statement itself (2-3 sentences, ready to use).
5. A confidence note on whether the proof point given is strong enough for this to be used as a competitive claim externally, or still needs firming up.`,
    variables: [
      {
        name: 'product_or_offer',
        description: `What's being positioned.`,
        example: `A scheduling tool for service businesses that auto-fills last-minute cancellations from a waitlist.`,
        required: true,
      },
      {
        name: 'target_customer_segment',
        description: `Who this is actually for.`,
        example: `Independent hair salons and small med-spa clinics with 2-8 staff.`,
        required: true,
      },
      {
        name: 'main_alternative_they_use_today',
        description: `What this segment actually uses right now instead.`,
        example: `A generic calendar-based booking tool with no waitlist automation, plus manual texting when someone cancels.`,
        required: true,
      },
      {
        name: 'proof_point_available',
        description: `What evidence you actually have to back the claimed difference.`,
        example: `Three pilot salons filled an average of 60% of cancelled slots within 2 hours using the waitlist feature, versus an estimated 15% manually — small sample size, no formal case study yet.`,
        required: true,
      },
      {
        name: 'category_frame',
        description: `What category or kind of tool this is, for a reader unfamiliar with it.`,
        example: `A booking and scheduling platform built specifically for appointment-based service businesses.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `positioning`,
      `messaging`,
      `operations`,
      `competitive-strategy`,
      `marketing-ops`,
    ],
    whyItWorks: `Positioning statements that name no real alternative aren't actually positioning — they're just describing the product in isolation, and a sophisticated reader's very first move is to ask what this is being compared to, which is exactly the question an alternative-free statement has no answer for; anchoring the whole exercise to the stated main alternative from the start forces the output to actually answer that question rather than merely sound like it does. The instruction to characterize the alternative honestly, including what it does reasonably well, targets a specific weakness in AI-generated competitive copy: models asked to differentiate a product will often default to a strawman characterization of the alternative because a weak alternative makes the differentiation land more easily in the text — but a reader who knows the real alternative and recognizes the strawman discounts the entire claim, so an honest characterization is what actually earns the comparison's credibility. Requiring the claim's confidence level to match the actual strength of the given proof point is a direct guard against a common failure mode where a thin, small-sample data point gets inflated into confident, unqualified language purely because confident language reads better — stating the claim at the level the evidence supports, and flagging when it isn't yet strong enough for external competitive use, prevents a company from making a claim in the market that a beefed-up sample size or a competitor's rebuttal could later expose as overstated. Leading with the category frame addresses a structural precondition for positioning to work at all: a reader has to understand what category both the offer and the alternative belong to before a comparison between them means anything, and skipping that frame is a common reason otherwise sharp positioning statements fail to land with an unfamiliar audience.`,
    exampleOutput: `Category: a scheduling platform built for appointment-based service businesses. The alternative: generic calendar booking tools handle scheduling fine, but leave cancellations to manual texting, which is slow and depends on whoever's at the front desk that day. The sharp difference: automated waitlist fill for last-minute cancellations, structurally something a generic calendar tool isn't built to do. Confidence note: the 60% vs. 15% fill-rate comparison comes from three pilot salons — directionally strong, but too small a sample to state as a hard competitive claim externally without a larger study first.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-vendor-evaluation-scorecard-loudest-voice',
    category: 'business-ops',
    title: `Build a vendor evaluation scorecard that stops the loudest stakeholder from picking the vendor`,
    description: `Produces a weighted vendor evaluation scorecard built from must-haves and stated priorities, structured to make the final choice defensible instead of decided by whoever argued hardest in the room.`,
    promptText: `Build a vendor evaluation scorecard for the options below, structured so the winning vendor is decided by the scorecard, not by whoever argues most persuasively in the room.

VENDOR OPTIONS
{{vendor_options}}

MUST-HAVE REQUIREMENTS
{{must_have_requirements}}

BUDGET CEILING
{{budget_ceiling}}

WEIGHTING PRIORITY
{{weighting_priority}}

INCUMBENT VENDOR, IF ANY
{{incumbent_vendor_if_any}}

Start by applying the must-have requirements as a hard filter, before any scoring happens — any vendor that fails a genuine must-have gets eliminated outright and does not proceed to the weighted comparison, regardless of how strong it looks elsewhere, since letting a must-have failure get outweighed by other strengths defeats the purpose of calling it a must-have. For the vendors that pass the filter, build scoring criteria directly from the weighting priority given, and assign weights that reflect the stated priority explicitly rather than defaulting to equal weighting across categories, which quietly hides the actual priority instead of expressing it. Score each surviving vendor against the criteria using only the information given — where the input doesn't actually support a confident score on some criterion, mark it as insufficient information rather than guessing a plausible-looking number, since a fabricated score dressed up in a clean table looks more authoritative than the actual state of the evidence justifies. If there's an incumbent vendor, do not give it implicit credit for familiarity or switching-cost-avoidance unless that was named as an actual weighted criterion — an incumbent should win or lose on the same criteria as everyone else, with switching cost scored explicitly as its own line item if it matters, not folded invisibly into every other score as a thumb on the scale.

WHAT NOT TO DO
Do not produce a scorecard where every vendor scores similarly across the board — if the underlying evidence actually differentiates them, the scores should show it; a scorecard that hedges into near-ties on every line isn't doing the job of a scorecard. Do not let budget ceiling function as just another weighted criterion if any vendor actually exceeds it — a hard budget ceiling is a filter, like the must-haves, not a score.

OUTPUT FORMAT
1. Must-have filter results: which vendors are eliminated and on which specific requirement.
2. Budget filter results: which vendors exceed the ceiling.
3. Weighted scorecard table for surviving vendors: criteria, weight, score per vendor, with 'insufficient information' marked explicitly where relevant.
4. Final ranked recommendation with the specific reasoning, including how the incumbent (if any) fared on switching cost as an explicit line.`,
    variables: [
      {
        name: 'vendor_options',
        description: `The vendors being compared.`,
        example: `VendorA, VendorB, and the current provider VendorC.`,
        required: true,
      },
      {
        name: 'must_have_requirements',
        description: `Non-negotiable requirements any vendor must meet to even be considered.`,
        example: `Must support SSO integration and must have SOC 2 Type II certification already in place, not in progress.`,
        required: true,
      },
      {
        name: 'budget_ceiling',
        description: `The hard budget limit, if one exists.`,
        example: `$45,000/year all-in, no exceptions without separate executive approval.`,
        required: true,
      },
      {
        name: 'weighting_priority',
        description: `What actually matters most in this decision, in relative order.`,
        example: `Reliability and uptime matter most, followed by ease of integration with our existing stack, then price, then support responsiveness.`,
        required: true,
      },
      {
        name: 'incumbent_vendor_if_any',
        description: `The current vendor, if replacing one, and any relevant switching cost.`,
        example: `VendorC is the incumbent; switching would require about 3 weeks of migration work and retraining 15 staff.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `vendor-evaluation`,
      `procurement`,
      `operations`,
      `decision-making`,
      `scorecard`,
    ],
    whyItWorks: `Vendor decisions get hijacked by whoever argues most persuasively in the room specifically when there's no pre-agreed structure forcing the comparison to happen on stated criteria rather than in-the-moment rhetoric — building the must-have filter and weighting scheme before any vendor-specific scoring happens is what takes the decision out of the room and puts it into a structure that was agreed to before anyone knew which vendor it would favor. Treating must-haves and the budget ceiling as hard filters rather than weighted criteria matters because folding a genuine non-negotiable into a weighted score allows a vendor to compensate for failing it with strength elsewhere, which quietly defeats the entire reason for calling something a must-have in the first place — a requirement that can be outweighed was never actually a requirement. The instruction to mark 'insufficient information' rather than guessing a plausible score directly targets a specific and dangerous failure mode of AI-generated comparison tables: a clean, fully-populated scorecard looks more rigorous and more finished than a partially-populated honest one, so a model under no constraint will tend to fill every cell with a confident-looking number even where the input evidence doesn't actually support one, which makes a genuinely uncertain comparison look more settled than it is. Explicitly separating incumbent switching cost into its own scored line item, rather than letting it silently bias every other score, addresses a well-documented bias in vendor re-evaluations — status quo familiarity tends to get baked invisibly into every criterion in favor of the incumbent unless it's forced into the open as one explicit, debatable line that can be weighed on its own merits against the stated priorities.`,
    exampleOutput: `Must-have filter: VendorB eliminated — no SOC 2 Type II certification in place, only 'in progress.' Budget filter: VendorA and VendorC both within the $45,000 ceiling. Weighted scorecard: Reliability (weight 4) — VendorA: 4/5, VendorC: 3/5. Switching cost (weight 2, scored explicitly): VendorC scores 5/5 (no migration needed), VendorA scores 2/5 (3 weeks migration, 15 staff retrained). Final recommendation: VendorA, on the strength of reliability and integration outweighing VendorC's switching-cost advantage — though the margin is close enough that a final gut-check on integration risk with your specific stack is worth a direct reference call before committing.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'business-ops-business-case-memo-trade-off-first',
    category: 'business-ops',
    title: `Write a business case memo that leads with the trade-off, not the pitch`,
    description: `Structures a business case investment memo around the real trade-off and opportunity cost up front, instead of a persuasive pitch that saves the hard part for the end.`,
    promptText: `Write a business case memo for the proposed investment below, structured to lead with the actual trade-off rather than a persuasive pitch that saves the hard part for the last page.

PROPOSED INVESTMENT
{{proposed_investment}}

COST AND TIME ESTIMATE
{{cost_and_time_estimate}}

EXPECTED RETURN OR BENEFIT
{{expected_return_or_benefit}}

OPPORTUNITY COST / ALTERNATIVE USE OF RESOURCES
{{opportunity_cost_alternative}}

KEY RISK OR ASSUMPTION
{{key_risk_or_assumption}}

Open with the trade-off itself, stated as a single direct sentence: this investment costs X and takes Y, against Z alternative use of the same resources — before any argument for why it's worth it. A reader evaluating a business case is fundamentally comparing this option against what else the resources could do, and a memo that leads with benefits and only mentions the alternative use deep in the document reads as though it's hiding the comparison rather than making it plainly. After the trade-off, state the expected return in terms that are actually comparable to the cost — same units, same timeframe where possible — rather than incommensurable language that sounds compelling but can't actually be weighed against the cost stated earlier. State the key risk or assumption honestly and specifically, including what would have to be true for the expected return to actually materialize, and do not soften a genuinely load-bearing assumption into a throwaway caveat at the bottom — if the entire case rests on one assumption holding, that assumption belongs near the top, not buried. Close with a plain recommendation and, if relevant, what the smallest reasonable version of this investment would look like as a way to test the key assumption before committing the full amount.

WHAT NOT TO DO
Do not open with problem-framing or context-setting before the trade-off is stated — get to it in the first sentence. Do not present the expected return with more certainty than the key risk/assumption section actually supports; the two sections need to be consistent with each other, not written as if by two different people with different levels of confidence.

OUTPUT FORMAT
1. Trade-off statement (one sentence): cost/time vs. the alternative use.
2. Expected return, stated in comparable terms to the cost.
3. Key risk/assumption, stated plainly, with what would have to be true for the return to materialize.
4. Recommendation, including a smaller test-the-assumption version if one makes sense.`,
    variables: [
      {
        name: 'proposed_investment',
        description: `What's being proposed.`,
        example: `Building an in-house customer data platform instead of continuing to pay for the current third-party analytics vendor.`,
        required: true,
      },
      {
        name: 'cost_and_time_estimate',
        description: `The real cost and timeline.`,
        example: `Estimated $180,000 in engineering time over 5 months, plus ongoing infrastructure cost of roughly $2,000/month.`,
        required: true,
      },
      {
        name: 'expected_return_or_benefit',
        description: `What this is expected to produce, stated as concretely as possible.`,
        example: `Eliminates the current $95,000/year vendor contract and is expected to cut data-latency issues that currently delay two downstream reporting processes by about a day each.`,
        required: true,
      },
      {
        name: 'opportunity_cost_alternative',
        description: `What else those same resources could realistically do instead.`,
        example: `The same 5-month engineering effort could instead complete the mobile app redesign that's been queued for two quarters.`,
        required: true,
      },
      {
        name: 'key_risk_or_assumption',
        description: `The single biggest thing this case depends on being true.`,
        example: `Assumes the in-house platform can match the vendor's current uptime and data accuracy, which the team has never built at this scale before.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `business-case`,
      `investment-memo`,
      `operations`,
      `resource-allocation`,
      `decision-making`,
    ],
    whyItWorks: `Business case memos that lead with benefits and defer the opportunity cost to a footnote read, to a sophisticated reader, as though the trade-off is being obscured rather than genuinely weighed — and since the reader's actual job is to compare this option against everything else the same resources could do, opening with the trade-off stated plainly is what respects that the comparison, not the pitch, is the real content of the decision. Requiring the expected return to be stated in units comparable to the cost — same timeframe, same kind of measure — directly targets a common weakness in AI-generated business cases, where the model will happily produce compelling but incommensurable language ('this unlocks significant strategic value') that sounds substantive but can't actually be checked against the dollar-and-time cost stated a paragraph earlier, leaving the reader to do the comparison work the memo was supposed to do for them. Insisting the key risk or assumption be stated with the same weight as the rest of the case, rather than softened into a bottom-of-page caveat, matters because a case that rests entirely on one uncertain assumption but presents that assumption as a minor footnote is functionally misleading about its own confidence level — a reader who only skims the confident-sounding return section and skips the caveat walks away with a false sense of certainty that the memo itself created by underweighting its own biggest risk. Requiring internal consistency between the confidence of the return section and the honesty of the risk section addresses a specific and common tell in AI-drafted business writing: sections generated somewhat independently can end up reading as though written by two different people with two different risk appetites, which an attentive reader notices immediately and which undermines trust in the whole document once spotted.`,
    exampleOutput: `Trade-off: this investment costs roughly $180,000 in engineering time over 5 months, against the alternative of finishing the mobile app redesign that's been queued for two quarters using the same team. Expected return: eliminates a $95,000/year vendor contract and is projected to cut a roughly one-day reporting delay in two downstream processes, though full payback on the $180,000 build cost takes about 22 months at current vendor pricing. Key risk: the whole case depends on the in-house platform matching the vendor's current uptime, which this team has not built at this scale before — recommend a scoped 6-week proof-of-concept on the highest-risk data pipeline before committing the full 5-month build.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
