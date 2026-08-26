import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'ui-design-website-ux-audit-conversion-funnel',
    category: 'ui-design',
    title: `Run a UX audit that ties every flagged issue to a specific funnel drop-off, not a generic heuristics checklist`,
    description: `Turns a page-by-page walkthrough of your signup or checkout flow into a prioritized list of UX issues, each one tied to where users actually abandon rather than a generic Nielsen-heuristics scorecard.`,
    promptText: `You are auditing a specific web flow before a redesign sprint starts, not producing a generic heuristics scorecard. I will describe the flow screen by screen; you will find the issues that plausibly explain where real users are dropping off, not every stylistic nitpick you can find.

FLOW BEING AUDITED
{{flow_description}}

SCREENS IN ORDER
{{screen_by_screen_notes}}

KNOWN DROP-OFF DATA
{{drop_off_data}}

PRIMARY USER AND GOAL
{{target_user_and_goal}}

PHASE 1 — WALK THE FLOW
Go screen by screen in the order given. For each screen, state the one decision or action the user is meant to take, and whether the screen's layout makes that action the obvious next step or makes the user hunt for it. Do not evaluate visual polish in this phase — only whether the intended action is findable and unambiguous.

PHASE 2 — MATCH ISSUES TO THE DROP-OFF DATA
If drop-off data was given, work backward from it: for the screen(s) with the worst known drop-off, generate the two or three most plausible UX reasons a user would abandon there specifically, not a generic list of best practices that could apply to any screen. If no drop-off data was given, say so explicitly and flag which screen you'd want data for first before trusting your own guess.

PHASE 3 — PRIORITIZE
Rank every issue found by estimated impact (how many users it plausibly affects) times ease of fix, not by how visually obvious the issue is. A subtle field-validation bug that silently blocks submission ranks above a spacing inconsistency, even though the spacing issue is easier to spot in a screenshot.

WHAT NOT TO DO
Do not pad the audit with a fixed set of heuristics applied uniformly regardless of whether they're relevant to this flow. Do not flag copy tone or branding preferences as UX issues unless they demonstrably block or confuse the user's next action.

OUTPUT FORMAT
A table: Screen | Issue | Why it plausibly causes drop-off | Estimated impact | Fix effort | Priority. Follow it with a two-sentence summary naming the single highest-priority fix and why it beats the others.`,
    variables: [
      {
        name: 'flow_description',
        description: `The specific flow being audited and what business outcome it drives.`,
        example: `Free-trial signup flow for a project-management SaaS, four screens from pricing page to first workspace created.`,
        required: true,
      },
      {
        name: 'screen_by_screen_notes',
        description: `A description of each screen in order — layout, fields, copy, what happens on submit.`,
        example: `Screen 1: pricing page with three tiers. Screen 2: email + password form, no social login. Screen 3: 6-field company-details form, all marked required. Screen 4: empty workspace with no onboarding checklist.`,
        required: true,
      },
      {
        name: 'drop_off_data',
        description: `Any known analytics on where users abandon, if you have it.`,
        example: `62% of signups who reach screen 3 never submit it; screen 2 to 3 conversion is 91%.`,
        required: false,
      },
      {
        name: 'target_user_and_goal',
        description: `Who is going through this flow and what they're actually trying to accomplish.`,
        example: `A solo freelancer trying to see if the tool can replace their spreadsheet before a client call in twenty minutes.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`ux-audit`, `conversion-optimization`, `user-flow`, `saas`, `prioritization`],
    whyItWorks: `GPT-5.1's default behavior when asked to "audit a UX flow" without constraints is to reach for a stock heuristics list (Nielsen's ten, or a generic accessibility-and-clarity checklist) and apply it uniformly to every screen, because that's the highest-probability completion for the bare instruction and it doesn't require the model to reason about what's actually causing abandonment on this specific flow. Anchoring Phase 2 to real drop-off data forces a different mode: instead of pattern-matching to generic best practices, the model has to work backward from an observed number and generate causal hypotheses that specifically explain that number, which produces genuinely diagnostic reasoning rather than a checklist recitation. Explicitly permitting "no data given, flag it" matters because otherwise the model will confidently rank issues by impact using invented percentages, which reads as authoritative but is fabricated; naming the absence of data is more useful than a confident-sounding guess dressed up as analysis. The impact-times-effort prioritization instruction counters a specific failure mode where visually obvious issues (spacing, color contrast, copy tone) get ranked above invisible ones (a validation rule that silently rejects valid input) simply because they're easier for a language model to describe vividly — forcing an explicit effort/impact axis breaks that bias toward describability over actual severity. The table-plus-two-sentence-summary format also matters practically: a bare table lets a stakeholder skim priorities, while the forced two-sentence takeaway prevents the audit from ending as an undifferentiated list where every row reads as equally urgent.`,
    exampleOutput: `Screen 3 | All 6 fields marked required, including 'company size' and 'phone number' | Users evaluating the tool solo have no company-size answer ready and abandon rather than guess | High (62% drop from data) | Low (make 4 of 6 fields optional) | P1. Screen 4 | Empty workspace, no first action suggested | User doesn't know what to do next and closes the tab | Medium | Low | P2. Summary: making the four non-essential fields on screen 3 optional is the single highest-leverage fix — it directly targets the only screen with measured drop-off data and requires no new design work.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-ui-screenshot-critique-before-dev-handoff',
    category: 'ui-design',
    title: `Get a screenshot critique that separates 'will confuse users' from 'I just don't like it' before a design goes to dev`,
    description: `Critiques a single UI screenshot against the interaction it's meant to support, sorting findings into what will actually cause user confusion versus aesthetic preference, so dev handoff isn't delayed over subjective taste.`,
    promptText: `Critique the attached UI screenshot before it goes to development. I need you to separate findings that will actually cause user confusion or errors from findings that are just aesthetic preference — a design review that treats both the same wastes engineering time relitigating taste.

SCREEN AND ITS JOB
{{screen_description}}

WHO USES IT AND WHEN
{{target_user}}

WHAT HAPPENS RIGHT BEFORE AND AFTER THIS SCREEN
{{interaction_context}}

CONSTRAINTS I CANNOT CHANGE
{{known_constraints}}

RULES FOR THE CRITIQUE
For every issue you flag, state which bucket it belongs in: "functional risk" (a user could genuinely misread, mis-click, or fail to complete the task because of this) or "preference" (a reasonable design choice, just not the one you'd personally make). Only elaborate on functional-risk items — for preference items, name them in one line and move on, don't argue for your preferred alternative as if it were objectively correct. For each functional-risk item, describe the specific mechanism of confusion: what a first-time user would likely think this element does, versus what it actually does, and why the gap exists (label ambiguity, visual hierarchy putting a secondary action above the primary one, a state that looks identical to a different state, etc.). Do not flag anything as a functional risk based on your own aesthetic taste dressed up as a usability claim — if you can't describe a specific way a real user would be misled, it belongs in the preference bucket or not at all. Respect the stated constraints; do not recommend a fix that violates one of them, and if the best fix for a functional risk requires violating a constraint, say so explicitly and offer the best fix that doesn't.

OUTPUT FORMAT
Functional risks (numbered, each with: what's confusing, why, and one fix that respects the constraints). Then preference notes as a short flat list, one line each, explicitly marked as skippable for this handoff.`,
    variables: [
      {
        name: 'screen_description',
        description: `What screen this is and the one job it's supposed to do.`,
        example: `Checkout review step for a subscription box — user confirms items, address, and total before paying.`,
        required: true,
      },
      {
        name: 'target_user',
        description: `Who sees this screen and in what state of mind.`,
        example: `A returning customer on mobile, mid-commute, expecting this to take under 30 seconds.`,
        required: true,
      },
      {
        name: 'interaction_context',
        description: `What screen comes before and after, so the critique accounts for what the user is carrying over.`,
        example: `Comes right after selecting a delivery date; next screen is a payment form. Back button returns to date selection.`,
        required: true,
      },
      {
        name: 'known_constraints',
        description: `Anything already locked in that a suggested fix cannot violate.`,
        example: `Cannot add a new screen — this must stay a single step; legal requires the cancellation-terms text to stay visible above the fold.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `ui-critique`,
      `design-review`,
      `dev-handoff`,
      `usability`,
      `screenshot-analysis`,
    ],
    whyItWorks: `A design critique that doesn't explicitly separate functional risk from preference tends to produce a wall of undifferentiated feedback where a genuine usability bug (a disabled-looking button that's actually clickable) sits next to a subjective opinion (this shade of blue feels cold) with equal apparent weight — this is the single most common reason design reviews stall handoff, because engineers can't tell which items are blocking and which are optional. Forcing the model to name the bucket for every item, and to justify functional-risk claims with a specific mechanism (what the user would think versus what's true, and why the gap exists) rather than an assertion, closes off the failure mode where GPT-5.1 dresses up a stylistic preference as a usability finding by attaching plausible-sounding jargon like "cognitive load" or "visual hierarchy" to what is actually just taste — the mechanism requirement makes that dressing-up visible because a real functional claim has to specify what gets misread and why, while a fake one has nowhere to go beyond the label. Explicitly respecting stated constraints, and requiring the model to say so when a good fix would violate one rather than silently proposing it anyway, matters because unconstrained redesign suggestions are the most common way a critique becomes unusable to the team receiving it — a suggestion that ignores a hard legal or technical constraint has to be re-filtered by a human before anything in the critique is actionable, defeating the point of asking for a scoped review in the first place.`,
    exampleOutput: `Functional risks: 1. The 'Edit address' link uses the same gray as disabled text, so a first-time user may believe it's inactive and not attempt to change a wrong address before paying — increase contrast to match the other tappable links, no layout change needed. Preference notes (skippable): item thumbnails could be slightly larger; total price uses a different font weight than the rest of the summary.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-mobile-ux-review-thumb-zone',
    category: 'ui-design',
    title: `Review a mobile UI screen for one-handed thumb reach before it ships`,
    description: `Reviews a mobile screen specifically for one-handed, thumb-driven use — flagging any primary action placed outside comfortable reach on common phone sizes rather than a generic mobile-friendliness pass.`,
    promptText: `Review this mobile screen specifically for one-handed thumb use. Most mobile UX reviews default to generic "mobile-friendliness" commentary about font sizes and tap targets; I need something narrower and more useful: where does this layout actively fight a user holding the phone in one hand and reaching with their thumb.

SCREEN LAYOUT
{{screen_layout}}

DEVICE SIZES IN SCOPE
{{device_sizes}}

PRIMARY ACTION ON THIS SCREEN
{{primary_action}}

EXPECTED USE CONTEXT
{{use_context}}

PHASE 1 — MAP THE SCREEN TO REACH ZONES
Divide the screen into natural, stretch, and unreachable zones for a right-handed thumb on the smallest device size in scope, then note whether the same map holds or shifts for the largest device size. Place every interactive element mentioned in the layout into one of these zones.

PHASE 2 — FLAG REACH CONFLICTS
Identify every case where the primary action sits in a stretch or unreachable zone, and every case where a destructive or hard-to-undo action (delete, remove, cancel-subscription) sits in the natural zone where an accidental thumb tap is most likely. These two conflicts matter more than any other mobile issue on this screen — surface them first.

PHASE 3 — SECONDARY MOBILE ISSUES
Only after phase 2, note anything else mobile-specific worth flagging (tap target sizing below the ~44px comfortable minimum, elements too close together for a thumb to hit reliably). Do not restate desktop-style critique here.

WHAT NOT TO DO
Do not produce a generic mobile checklist unrelated to thumb reach. Do not assume left-handed use unless told to — state clearly that the reach map assumes right-handed use and that a left-handed user mirrors it.

OUTPUT FORMAT
A short reach-zone map (natural / stretch / unreachable, with elements listed under each), then a numbered list of reach conflicts in priority order, then a short secondary-issues list. End with one line stating what would change if you also had to design for left-handed use.`,
    variables: [
      {
        name: 'screen_layout',
        description: `A description of every interactive element on screen and its rough position.`,
        example: `Top nav bar with back arrow and settings icon. Middle: scrolling list of saved cards. Bottom-right floating '+ Add card' button. Delete icon appears top-left on swipe.`,
        required: true,
      },
      {
        name: 'device_sizes',
        description: `The smallest and largest phone sizes you need this to work on.`,
        example: `iPhone SE (smallest) through iPhone 15 Pro Max (largest).`,
        required: true,
      },
      {
        name: 'primary_action',
        description: `The one action most users are on this screen to take.`,
        example: `Add a new saved payment card.`,
        required: true,
      },
      {
        name: 'use_context',
        description: `The physical situation the user is likely in while using this screen.`,
        example: `Standing in a checkout line, phone in one hand, other hand holding groceries.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `mobile-ux`,
      `thumb-zone`,
      `touch-targets`,
      `responsive-design`,
      `usability-review`,
    ],
    whyItWorks: `GPT-5.1, asked for a generic "mobile UX review," defaults to a well-worn list of font-size and tap-target advice because that's the most statistically common completion for the phrase "mobile UX" in its training distribution — it's not wrong, but it's also not specific to the actual failure mode of one-handed use, which is about geometric reach, not element size alone. Forcing an explicit reach-zone map before any critique changes the reasoning order: the model has to first commit to a spatial model of where a thumb can and can't comfortably go on the smallest device in scope, and only then evaluate the given layout against that model, which produces genuinely spatial reasoning instead of a recycled checklist. Prioritizing the two specific reach conflicts — primary action out of reach, destructive action in easy reach — matters because these are the two mobile ergonomics failures with the highest real-world cost (a stretch-zone primary action increases task abandonment and one-handed drop errors, while an easy-reach destructive action increases accidental-tap incidents) and a model given an open-ended "what's wrong" prompt will often bury these under less consequential spacing notes. Explicitly stating the right-handed assumption and offering the left-handed mirror as a one-line addendum rather than silently picking one handedness matters because roughly a tenth of users are left-handed and a review that quietly assumes right-handed use without saying so produces recommendations that are wrong for those users without anyone noticing the review made that assumption at all.`,
    exampleOutput: `Reach zones (right-handed, iPhone SE): Natural — bottom third of screen, floating '+ Add card' button. Stretch — middle list area. Unreachable — top nav bar, both icons. Reach conflict #1: the swipe-to-delete icon appears in the natural zone on the left edge of a list row, meaning an accidental one-handed swipe during scrolling could trigger a destructive action; add a confirmation step or move delete behind an explicit menu instead of a swipe gesture.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-accessibility-audit-wcag-severity',
    category: 'ui-design',
    title: `Turn a WCAG pass into a severity-ranked fix list engineers will actually act on`,
    description: `Reviews a screen or component against WCAG success criteria and outputs a severity-ranked list of concrete fixes rather than an undifferentiated wall of citations, so accessibility work gets triaged like any other bug backlog.`,
    promptText: `You are auditing the described screen or component against WCAG 2.2 success criteria, but I don't want a wall of citation numbers — I want a severity-ranked, engineer-actionable fix list, the same way a bug backlog would be triaged.

WHAT'S BEING AUDITED
{{component_description}}

CODE OR MARKUP DETAILS AVAILABLE
{{markup_details}}

KNOWN ASSISTIVE-TECH USERS IN YOUR AUDIENCE
{{known_at_users}}

RULES
For every issue you find, name the specific WCAG success criterion it relates to, but do not treat the citation itself as the deliverable — the deliverable is: what breaks for a real assistive-technology user, and what to change in the markup or design to fix it. Rank severity by real user impact, not by how many criteria a given issue happens to touch: an issue that makes an entire flow unusable with a screen reader (e.g., a custom dropdown with no keyboard path and no accessible name) is Critical even if it maps to only one criterion, while a cosmetic contrast ratio that's off by a fraction of a point on non-essential decorative text is Low even if it's a clean technical violation. Where the audit depends on facts you don't have — the actual DOM structure, whether a library component already handles ARIA roles internally, current contrast ratios you can't measure from a description alone — say so explicitly and describe what you'd check rather than asserting a violation you can't actually confirm. Do not state that any of this constitutes legal compliance sign-off; frame every finding as a technical audit for engineers, not a determination of whether the product meets any specific regulation, since that determination requires verification beyond what a text description can provide.

OUTPUT FORMAT
A table: Severity (Critical / Serious / Moderate / Low) | Issue | Affected users | Relevant WCAG criterion | Concrete fix. Sort by severity. End with a short list of anything you flagged as "can't confirm from this description" and what to check to confirm it.`,
    variables: [
      {
        name: 'component_description',
        description: `What UI is being audited and its purpose.`,
        example: `A custom date-picker component used in a hotel booking flow's check-in/check-out step.`,
        required: true,
      },
      {
        name: 'markup_details',
        description: `Any HTML/ARIA/code details you can provide — paste what you have.`,
        example: `Built as a <div> grid of clickable <span> cells with onClick handlers; no visible focus outline; no aria-label on the calendar container.`,
        required: false,
      },
      {
        name: 'known_at_users',
        description: `Whatever you know about assistive-technology use in your actual audience, if anything.`,
        example: `Support tickets mention at least two screen-reader users unable to select dates; no data on other assistive tech.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`accessibility`, `wcag`, `a11y-audit`, `screen-reader`, `engineering-triage`],
    whyItWorks: `A WCAG audit prompt without a severity framework tends to produce a flat list of citation numbers ordered by whichever success criteria the model happens to recall first, which reads as thorough but gives an engineering team no way to decide what to fix this sprint versus next quarter — severity has to be forced explicitly because the WCAG spec itself doesn't rank criteria by real-world user impact, it organizes them by conformance level (A/AA/AAA), which is a compliance concept, not a triage concept, and the two frequently diverge (a Level A keyboard-trap issue that blocks an entire flow is far more severe in practice than a Level AA contrast nuance on secondary text). Requiring the model to distinguish "can't confirm from this description" from a stated finding directly counters GPT-5.1's tendency to assert a specific violation (like a contrast ratio) with false precision when given only a text description and no actual computed color values or rendered DOM — asking for that explicit uncertainty flag produces a genuinely more trustworthy audit than one that states every finding with equal unwarranted confidence. The instruction to frame findings as a technical audit rather than compliance sign-off matters because a WCAG success-criterion citation is a technical fact, but whether a product satisfies a specific accessibility law (ADA, EN 301 549, or otherwise) is a legal determination outside what any text-based review can establish, and conflating the two would misrepresent an engineering triage document as something with legal weight it doesn't have.`,
    exampleOutput: `Critical | Date cells are non-focusable spans with only onClick handlers, no keyboard access at all | Keyboard-only and screen-reader users cannot select any date | WCAG 2.1.1 (Keyboard) | Convert cells to native <button> elements or add tabindex and key handlers for Enter/Space/arrow-key navigation. Can't confirm from this description: actual rendered contrast ratio of the selected-date highlight color — check with a contrast-checking tool against the real hex values.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-landing-page-wireframe-hero-to-cta',
    category: 'ui-design',
    title: `Wireframe a landing page section-by-section, anchored to the one action you want at each scroll depth`,
    description: `Produces a text-based wireframe of a landing page, section by section, where every block is justified by the one visitor decision it's meant to move — not a generic hero-features-testimonials-footer template filled in with your product name.`,
    promptText: `Wireframe a landing page for the product below, one section at a time. I don't want a generic hero-features-testimonials-CTA template with the labels swapped for my product — every section needs to earn its place by moving the visitor one step closer to the specific action I want.

PRODUCT AND OFFER
{{product_and_offer}}

VISITOR ARRIVING FROM
{{traffic_source}}

TARGET ACTION
{{target_action}}

OBJECTIONS THIS VISITOR LIKELY HAS
{{known_objections}}

PHASE 1 — DECIDE THE SECTION LIST
Before wireframing anything, decide which sections this specific page actually needs given the traffic source and objections — do not default to a fixed six-section template. A visitor arriving from a bottom-of-funnel search ad who already knows what the product does needs a different section list than one arriving cold from a display ad.

PHASE 2 — WIREFRAME EACH SECTION
For each section, in scroll order, output: the one job this section does (in terms of a visitor decision it resolves, not "builds trust" vagueness), a text-based layout sketch (rows of blocks, e.g. [headline] / [subhead] / [CTA button] / [supporting image]), and which specific listed objection or piece of missing information it addresses. If a section doesn't map to a specific objection or the target action, cut it — do not include a section just because landing pages conventionally have one.

PHASE 3 — CTA PLACEMENT AUDIT
After wireframing all sections, list every place the target action's CTA appears down the page and justify each placement by what the visitor has just been convinced of at that scroll depth.

WHAT NOT TO DO
Do not write actual marketing copy for headlines — use bracketed placeholder descriptions of what each headline should communicate, since the wireframe is about structure, not final copy. Do not include a testimonials or social-proof section unless an objection or trust gap actually calls for it.

OUTPUT FORMAT
Section list with one-line justification for inclusion, then the full section-by-section wireframe from Phase 2, then the CTA placement audit from Phase 3.`,
    variables: [
      {
        name: 'product_and_offer',
        description: `What the product does and the specific offer on this page.`,
        example: `A habit-tracking app; this page offers a 14-day free trial of the premium tier, no credit card required.`,
        required: true,
      },
      {
        name: 'traffic_source',
        description: `Where visitors to this specific page are coming from.`,
        example: `A Google search ad triggered by the query 'habit tracker app for ADHD'.`,
        required: true,
      },
      {
        name: 'target_action',
        description: `The one thing you want the visitor to do.`,
        example: `Start the 14-day free trial.`,
        required: true,
      },
      {
        name: 'known_objections',
        description: `The specific doubts or hesitations this visitor is likely to have.`,
        example: `Skeptical it will actually work for ADHD specifically, not just generic habit tracking; worried about another app they'll abandon in a week.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `landing-page`,
      `wireframe`,
      `conversion-design`,
      `cta-placement`,
      `information-architecture`,
    ],
    whyItWorks: `GPT-5.1's default completion for "wireframe a landing page" is a memorized template shape (hero, three feature cards, testimonials, pricing, final CTA, footer) because that structure appears constantly in its training data as the canonical landing-page pattern — it will fill that template in competently regardless of whether every section is actually earning its place for this specific visitor, which is why forcing a Phase 1 decision about the section list before any layout work is the load-bearing instruction here: it makes the model justify inclusion against the traffic source and objections rather than defaulting to the template's full section count. Requiring each section to resolve a named objection or move toward the target action, and explicitly permitting a section to be cut if it doesn't, breaks the bias toward padding a landing page with conventional sections (testimonials, social proof) that exist because they're common, not because they're needed for this particular cold-versus-warm traffic scenario. Using bracketed placeholder descriptions instead of real headline copy keeps the wireframe honest about what it's actually specifying — structure and information sequencing — rather than letting persuasive copywriting substitute for a genuine structural decision, which is a common failure mode where a wireframe prompt drifts into producing finished marketing copy that looks impressive but hasn't actually reasoned about layout. The CTA placement audit as a separate final phase matters because CTA repetition down a long page is only effective when each instance is justified by what's just been resolved above it — auditing placements after the fact catches a CTA repeated out of habit rather than because the visitor has just been given a new reason to act.`,
    exampleOutput: `Section list: Hero (justify: visitor already searched the exact need, so hero can name the ADHD-specific angle immediately) / How it adapts to ADHD (justify: addresses the 'just generic habit tracking' objection) / What happens after day 14 (justify: addresses the abandonment fear directly) / CTA. No testimonials section — search-ad traffic with high intent doesn't need social proof before the first CTA, only after the second objection is resolved.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-dashboard-wireframe-information-hierarchy',
    category: 'ui-design',
    title: `Wireframe a dashboard around the three-second glance test, not a grid of equal-weight widgets`,
    description: `Designs a dashboard's information hierarchy around the single question a user opens it to answer, ranking every widget by whether it earns a place in the first glance, a quick scan, or a click-through.`,
    promptText: `Wireframe the dashboard described below. Most dashboard wireframes default to a grid of equal-sized widgets, which fails the actual test a dashboard has to pass: a user glancing at it for three seconds should immediately know the one thing they came to check.

DASHBOARD PURPOSE
{{dashboard_purpose}}

WHO OPENS THIS AND WHY
{{user_and_trigger}}

DATA POINTS AVAILABLE
{{available_data_points}}

MOST COMMON FOLLOW-UP ACTION
{{common_followup_action}}

STEP 1 — RANK EVERY DATA POINT BY GLANCE TIER
Sort every listed data point into exactly one of three tiers: Glance (must be readable in three seconds without any interaction — this tier should have at most two or three items, since a glance tier crowded with ten equally-sized numbers defeats its own purpose), Scan (readable within about ten seconds of active scrolling or reading, supporting detail), or Click-through (available but tucked behind a click, drill-down, or secondary tab). Justify each placement by what the user in {{user_and_trigger}} is actually trying to find out, not by how interesting the data point is on its own.

STEP 2 — WIREFRAME THE LAYOUT
Produce a text-based grid wireframe (rows and columns of labeled blocks with relative sizing noted, e.g. [BIG: primary metric] [small: secondary metric] [small: secondary metric]) that gives Glance-tier items the largest visual weight and top-left-to-top-right reading priority, Scan-tier items visible but smaller, and Click-through items represented only as a labeled entry point (a tab, button, or link), not rendered in full.

STEP 3 — VALIDATE AGAINST THE FOLLOW-UP ACTION
Check that the most common follow-up action has a visible, one-click path from the dashboard's main view. If it doesn't, flag this as a structural gap and propose where to add the entry point.

WHAT NOT TO DO
Do not default to a uniform grid where every widget gets equal size regardless of tier. Do not include a data point in the Glance tier just because it's easy to visualize (like a pie chart) if it isn't actually what the user opens the dashboard to check.

OUTPUT FORMAT
The three-tier ranked list with justifications, then the text wireframe, then the follow-up-action validation note.`,
    variables: [
      {
        name: 'dashboard_purpose',
        description: `What this dashboard exists to help someone monitor or decide.`,
        example: `A support-team lead's daily view of ticket backlog health.`,
        required: true,
      },
      {
        name: 'user_and_trigger',
        description: `Who opens this and what prompts them to look at it.`,
        example: `Support team lead, opens it first thing each morning to decide if they need to reassign tickets before the day starts.`,
        required: true,
      },
      {
        name: 'available_data_points',
        description: `Every metric or data element that could go on this dashboard.`,
        example: `Open ticket count, average response time, tickets past SLA, agent-by-agent load, weekly trend chart, customer satisfaction score, ticket tags breakdown.`,
        required: true,
      },
      {
        name: 'common_followup_action',
        description: `The single most frequent thing the user does right after looking at this dashboard.`,
        example: `Reassigning tickets from an overloaded agent to one with spare capacity.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `dashboard-design`,
      `wireframe`,
      `information-hierarchy`,
      `data-visualization`,
      `ux-strategy`,
    ],
    whyItWorks: `Asked to wireframe a dashboard without a hierarchy constraint, GPT-5.1 tends to produce a uniform grid where every available data point gets roughly equal visual weight, because a flat list of metrics has no inherent ranking signal in the prompt and the model has no reason to privilege one box over another — the three-tier sort is the mechanism that forces an actual prioritization decision, and capping the Glance tier at two or three items is what prevents the model from simply relabeling most of the grid as "glance" and reproducing the same undifferentiated layout under a new name. Anchoring every tier placement to the specific user and trigger, rather than to which data point is most visually interesting to chart, counters a real bias in language models toward foregrounding whatever data is easiest to render attractively (a pie chart, a trend line) even when it isn't what the stated user actually needs first — a ticket-backlog lead opening the dashboard to catch an SLA breach doesn't need agent workload displayed as prominently as the count of tickets past SLA, even though a workload breakdown might make for a more visually rich widget. The follow-up-action validation step exists because a dashboard's job doesn't end at display — it's supposed to lead into an action — and a wireframe that nails information hierarchy but leaves the most common next action two clicks deep has still failed at its actual purpose; checking for this explicitly, as a distinct final step rather than hoping it falls out naturally from the layout, is what catches the gap before it reaches a designer.`,
    exampleOutput: `Glance tier: Tickets past SLA (this is the number that determines whether reassignment is needed today), Open ticket count. Scan tier: agent-by-agent load, average response time. Click-through: weekly trend chart, satisfaction score, tag breakdown. Layout: top row is one large SLA-breach counter with a red/green state indicator, next to open-ticket total; second row shows a compact per-agent load bar; a 'View trends' tab sits in the top-right for click-through items. Follow-up validation: reassigning an overloaded agent's tickets isn't reachable from the main view — add a one-click 'Reassign' action directly on each row of the per-agent load bar.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-mobile-app-flow-diagram-edge-cases',
    category: 'ui-design',
    title: `Map a mobile app flow that accounts for the exits and error branches, not just the happy path`,
    description: `Maps out a mobile app user flow as a full branching diagram in text, forcing every error state, permission denial, and abandonment point to be an explicit named screen instead of an implied dead end.`,
    promptText: `Map the user flow described below as a full branching diagram, in text form. Most flow diagrams only show the happy path and leave every error, denial, or abandonment as an implied dead end that nobody actually designs; I want those made explicit.

FLOW TO MAP
{{flow_to_map}}

ENTRY POINTS
{{entry_points}}

SYSTEM DEPENDENCIES INVOLVED
{{system_dependencies}}

For every step in the happy path, identify at least one thing that plausibly goes wrong at that exact step given the system dependencies involved (a permission the user denies, a network call that times out, a payment that's declined, a required field left empty), and add it as a named branch, not a footnote. Every branch must end in one of three explicit terminal states: recovery (the user is routed back into the happy path with the problem addressed), graceful exit (the user leaves the flow but in a state that doesn't corrupt data or block a future attempt), or dead end (the flow genuinely has nowhere for the user to go from here) — if you find a dead end, flag it explicitly as a design gap rather than silently omitting it, since a real dead end in a shipped flow is a bug, and naming it is more useful than pretending the happy path is the only path. For each entry point listed, note whether the flow behaves identically regardless of entry point or whether a specific step needs to change (for instance, a flow entered via a deep link may need to handle a user who isn't logged in yet, differently from a flow entered from inside the app where login is already established).

WHAT NOT TO DO
Do not invent error states that aren't plausible given the actual system dependencies listed — a flow with no payment step doesn't need a "payment declined" branch. Do not resolve every branch into a recovery state just to make the diagram look complete; some genuinely are dead ends, and disguising that as a soft recovery is worse than flagging it honestly.

OUTPUT FORMAT
A numbered step list for the happy path first, then for each step, an indented list of its error/exit branches with their terminal state labeled (recovery / graceful exit / dead end), then a short section on entry-point-specific differences, then a final list of every flagged dead end as a standalone "design gaps found" section.`,
    variables: [
      {
        name: 'flow_to_map',
        description: `The specific flow, start to finish, as you currently understand it.`,
        example: `Uploading a profile photo during onboarding: tap upload, choose camera or library, take/select photo, crop, confirm, photo appears on profile.`,
        required: true,
      },
      {
        name: 'entry_points',
        description: `Every place in the app a user could start this flow from.`,
        example: `From the onboarding wizard (new user, forced step) and from the profile edit screen (existing user, optional).`,
        required: true,
      },
      {
        name: 'system_dependencies',
        description: `What this flow relies on that could fail or be denied.`,
        example: `Camera permission, photo-library permission, an upload API call to cloud storage, image-size validation.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `user-flow`,
      `flow-mapping`,
      `edge-cases`,
      `mobile-app-design`,
      `error-states`,
    ],
    whyItWorks: `When asked to map a flow without a forcing function, GPT-5.1 defaults to narrating the happy path in prose because that's the shortest, most coherent completion of "describe this flow" — error and denial states get mentioned in passing, if at all, since nothing in an open-ended request obligates the model to enumerate them systematically. Requiring at least one plausible failure per step, tied specifically to the listed system dependencies, converts this from a narrative task into an enumeration task, which changes the completion strategy entirely: the model now has to check each step against the dependency list rather than just continuing the story forward, which is what actually surfaces the permission-denial and timeout branches that a prose description would skip past. The three-terminal-state requirement, and specifically the instruction to flag genuine dead ends rather than resolve everything into a recovery path, matters because models under an implicit pressure to produce a "complete-looking" diagram will tend to invent a plausible-sounding recovery for every branch even when a real dead end exists in the underlying system — asking explicitly for honesty about dead ends removes the incentive to paper over an actual design gap, which is exactly the kind of gap that ships silently in a real app because no one ever forced it into a diagram where its absence would be visible. The per-entry-point differencing step exists because flow diagrams are frequently drawn once for the most common entry point and then silently assumed to generalize, when a deep-link entry with no established session is a materially different flow than one reached from inside an already-authenticated app, and that difference has real consequences (a login-wall interruption mid-flow) that only surface if asked for directly.`,
    exampleOutput: `Step 3: Take/select photo. Branch — camera permission denied: recovery, route to a screen explaining why the permission is needed with a 'try again' or 'choose from library instead' option. Branch — photo library empty: graceful exit, let the user skip photo upload and return to onboarding without a photo, flagged for later. Design gaps found: if upload succeeds but the crop-confirm screen crashes before saving, there's currently no path back to the photo — this is a dead end and needs a retry mechanism.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-user-persona-from-real-research-not-invented-demographics',
    category: 'ui-design',
    title: `Build a user persona from actual research notes instead of inventing demographics that don't affect design decisions`,
    description: `Synthesizes raw interview or survey notes into a lean persona that only includes traits shown to actually change a design decision, rather than a padded demographic template with an invented name, age, and stock photo.`,
    promptText: `Build a user persona from the research notes below — not a padded demographic template with an invented name, age, hobbies, and stock-photo description that doesn't change a single design decision.

RAW RESEARCH NOTES
{{research_notes}}

HOW MANY PEOPLE THIS IS BASED ON
{{sample_size}}

DESIGN DECISION THIS PERSONA WILL INFORM
{{design_decision_context}}

RULES
Include a trait in the persona only if you can point to where in the research notes it came from and explain what design decision it would change if it were different — no trait earns a place in the persona just because personas conventionally include that category of information. If the notes don't support a detail some templates expect (age range, income, family status), leave it out entirely rather than inventing a plausible-sounding placeholder; an invented detail that happens to be wrong will misdirect the exact design decision this persona is meant to inform. Be explicit about confidence: state which traits are well-supported by multiple points in the notes versus which are inferred from a thin signal (one mention, an assumption bridging a gap in what was said), so whoever uses this persona later knows where the research is solid and where it's a working guess. If the sample size given is small, say so plainly in the output and note that this persona represents a hypothesis to validate further, not a confirmed segment.

WHAT NOT TO DO
Do not invent a name, stock-photo description, or "day in the life" narrative flourish — these read as complete but add nothing a design decision can act on. Do not average conflicting research notes into a bland middle description; if the notes show two genuinely different user types, say so and suggest this might be two personas, not one blended one.

OUTPUT FORMAT
A short persona with: a one-line summary of who this is and their core goal, then a table of Trait | Evidence from notes | Confidence (strong / inferred) | Design implication. End with an explicit note on sample size and confidence, and whether the notes suggest more than one persona is actually present.`,
    variables: [
      {
        name: 'research_notes',
        description: `Actual interview quotes, survey responses, or observation notes — the real raw material.`,
        example: `5 interview transcripts with small-business owners: 3 mentioned struggling to reconcile invoices manually at month-end; 2 said they check the app only on mobile during commutes; 1 explicitly said they don't trust automated categorization without a review step.`,
        required: true,
      },
      {
        name: 'sample_size',
        description: `How many people this research actually covers.`,
        example: `5 semi-structured interviews, no broader survey yet.`,
        required: true,
      },
      {
        name: 'design_decision_context',
        description: `What you're actually going to use this persona to decide.`,
        example: `Whether to build a one-tap 'auto-approve' feature for expense categorization or keep a manual review step in the flow.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `user-persona`,
      `ux-research`,
      `research-synthesis`,
      `design-decisions`,
      `user-centered-design`,
    ],
    whyItWorks: `Persona-generation prompts without a research-grounding constraint reliably produce GPT-5.1's most-memorized version of the artifact type — a name, an age, a stock-photo description, a quote, and a bulleted list of goals and frustrations that read as complete because they match the shape of a thousand persona templates in its training data, regardless of whether any of it is actually supported by real research; the model isn't lying so much as defaulting to the template's expected fields when the real notes don't cover them. Requiring an evidence citation for every trait and an explicit design-implication statement forces the model to check each candidate trait against two things it would otherwise skip: does the source material actually support this, and does it matter for the decision at hand — a trait that fails either check gets dropped, which is what prevents the persona from filling in with plausible-but-fabricated demographic filler. The strong-versus-inferred confidence labeling matters because research synthesis genuinely does contain a mix of well-triangulated findings (three of five interviewees said the same thing) and thin signals (one offhand comment), and collapsing both into equally confident-sounding bullet points misrepresents the actual state of the evidence to whoever uses the persona downstream to justify a decision. The instruction to flag a small sample size and the possibility of multiple distinct personas addresses a structural risk in persona synthesis specifically: averaging two genuinely different user types into one blended description produces a persona that doesn't actually describe anyone, which is a more damaging output than admitting the research points to a segment split that needs a second persona or more data before either can be trusted.`,
    exampleOutput: `Core goal: get monthly expense reconciliation done quickly without giving up a manual check on accuracy. Trait: distrusts full automation for categorization | Evidence: 1 of 5 interviewees stated this explicitly | Confidence: inferred | Implication: a one-tap auto-approve feature should default to a review step visible before submission, not silent auto-approval. Sample-size note: based on 5 interviews only — treat this as a hypothesis to validate with a larger survey before committing to the auto-approve default.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-jtbd-interview-script-avoid-leading-questions',
    category: 'ui-design',
    title: `Write a Jobs-to-be-Done interview script that surfaces the real switching trigger without leading the witness`,
    description: `Writes a JTBD-style user interview script focused on the specific moment someone decided to switch tools, phrased to avoid leading questions that would just confirm what you already assume.`,
    promptText: `Write a Jobs-to-be-Done interview script for talking to people who recently switched to (or away from) the product below. The point of a JTBD interview is to find the real trigger moment and struggle that led to the switch — not to confirm assumptions I already have, so every question needs to be checked for leading language before it goes in the script.

PRODUCT AND SWITCH DIRECTION
{{product_and_switch_direction}}

MY CURRENT ASSUMPTION ABOUT WHY THEY SWITCHED
{{current_assumption}}

INTERVIEW LENGTH
{{interview_length}}

STRUCTURE THE SCRIPT IN THIS ORDER
1. A timeline reconstruction opener that asks the person to walk through the actual sequence of events leading up to the switch, starting well before the switch itself — a JTBD interview should establish what was happening in their life or workflow before they even started looking for an alternative, not open with "why did you switch," which invites a tidy retrospective justification rather than the messier real sequence.
2. Struggle-moment questions that probe for the specific moment something became actively painful enough to prompt looking for alternatives — ask what they were doing right before that moment, not what they generally disliked about the old tool in the abstract.
3. A forces-of-progress set covering what pushed them away from the old solution, what pulled them toward the new one, what anxieties they had about switching, and what habits of the old tool they had to overcome — these are four genuinely different forces and deserve separate questions, not one blended "why did you switch" question.
4. A check against my stated assumption — include one question late in the script, phrased neutrally, that would surface disconfirming evidence if my assumption is wrong, rather than a question that could only confirm it.

RULES AGAINST LEADING LANGUAGE
For every question, check whether it presupposes an answer ("wasn't it frustrating when...") or offers the interviewee a category to agree with ("was it mainly the price, or the features?") rather than asking them to generate the category themselves. Rewrite any question that fails this check before including it.

WHAT NOT TO DO
Do not include generic satisfaction-survey questions (rate your experience 1-10) — JTBD interviews are about reconstructing a causal story, not scoring sentiment. Fit the total question count to the stated interview length; do not write more questions than could actually fit.

OUTPUT FORMAT
The script in the four sections above, each question numbered, with a one-line note under any question that was rewritten explaining what leading language was removed.`,
    variables: [
      {
        name: 'product_and_switch_direction',
        description: `The product and whether you're interviewing people who switched to it or away from it.`,
        example: `Interviewing customers who switched away from a spreadsheet-based system to our inventory-management app.`,
        required: true,
      },
      {
        name: 'current_assumption',
        description: `What you currently believe drove the switch, stated honestly so it can be checked.`,
        example: `We assume they switched because spreadsheets couldn't handle multi-location stock syncing.`,
        required: true,
      },
      {
        name: 'interview_length',
        description: `How long the actual interview slot is.`,
        example: `30 minutes.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `jtbd`,
      `user-interviews`,
      `research-methodology`,
      `switching-behavior`,
      `qualitative-research`,
    ],
    whyItWorks: `A JTBD interview script written without an explicit leading-language check tends to smuggle the interviewer's own hypothesis into the question wording — GPT-5.1 given only "write a JTBD script about why customers switched" will often produce questions shaped by whatever context clues it's given about the product, phrasing options as a menu ("was it price or features") that limits the interviewee to categories the researcher already had in mind, which defeats the entire premise of JTBD interviewing: finding the causal story the researcher didn't already assume. Building the script around timeline reconstruction rather than opening with "why did you switch" matters mechanically because a direct why-question invites a post-hoc, socially acceptable justification ("it had better features") rather than the actual messy sequence of events, while reconstructing the timeline forward from before the person even considered switching surfaces the real struggle moment, which is frequently different from the tidy reason a person would give if asked directly. Splitting the four forces of progress (push, pull, anxiety, habit) into separate questions rather than one blended question matters because these are genuinely distinct psychological forces in switching behavior, and a blended question lets an interviewee answer with whichever force is easiest to articulate, silently dropping the other three from the data entirely. The disconfirming-evidence question specifically counters confirmation bias in the researcher, not just the interviewee — a script built entirely from someone's existing hypothesis, however well-intentioned, will structurally tend to surface answers that confirm that hypothesis unless at least one question is deliberately built to have a real chance of contradicting it.`,
    exampleOutput: `Section 1, Q2: 'Take me back to a normal week before you started looking at other options — what did tracking inventory across locations actually look like day to day?' (Rewritten: original draft asked 'wasn't it hard to keep the spreadsheet updated across locations,' which presupposed the difficulty; the neutral version lets the interviewee describe the actual workflow without confirming a specific pain point in advance.)`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-user-story-invest-criteria',
    category: 'ui-design',
    title: `Write user stories that pass the INVEST test instead of restating a feature as a story`,
    description: `Rewrites a feature idea into properly scoped user stories that pass the INVEST criteria (independent, negotiable, valuable, estimable, small, testable), flagging any that are actually too large or too vague to be one story.`,
    promptText: `Turn the feature idea below into properly scoped user stories, checked against the INVEST criteria — independent, negotiable, valuable, estimable, small, testable. Most "user stories" people write are just the feature restated in the "As a... I want... so that..." template with no actual scoping thought behind them; I want the real thing.

FEATURE IDEA
{{feature_idea}}

USER TYPES INVOLVED
{{user_types}}

KNOWN TECHNICAL CONSTRAINT OR DEPENDENCY
{{technical_constraint}}

For each user type, draft the story in the standard format, then explicitly check it against each INVEST letter and flag any that fail: Independent — can this ship and be tested without another story shipping first, or does it silently depend on one (name the dependency if so, rather than ignoring it). Negotiable — is this a description of value and outcome, or does it specify implementation details that should be left to the team building it (rewrite to remove implementation prescriptions if present). Valuable — does completing this story produce something a real user would notice or benefit from, or is it a technical task disguised as a story (technical tasks belong on the backlog as tasks, not as user-facing stories — say so if this is actually one). Estimable — is there enough clarity here for a team to size it, or is a key unknown blocking estimation (name the unknown). Small — could this reasonably be finished within one sprint, or does it bundle multiple distinct pieces of value that should split into separate stories (if so, split it and show the split). Testable — is there a clear way to know when this is done, even before acceptance criteria are written out in full.

If a story fails Independent or Small, do not just flag it — actually perform the split or note the sequencing dependency explicitly, since flagging without resolving leaves the same scoping problem for someone else to solve later.

WHAT NOT TO DO
Do not write a story so vague it would pass every INVEST check trivially by saying nothing concrete ("As a user, I want a good experience"). Do not invent acceptance criteria in this pass — that's a separate step; keep this focused on story scoping.

OUTPUT FORMAT
For each story: the story text, then a short INVEST check as a bullet under each of the six letters (pass or the specific issue found), then, where a split or dependency was found, the resulting split stories or named dependency.`,
    variables: [
      {
        name: 'feature_idea',
        description: `The feature idea as it currently exists, even if it's rough.`,
        example: `Let users export their order history and also get notified when an export is ready, plus let them schedule recurring exports.`,
        required: true,
      },
      {
        name: 'user_types',
        description: `The distinct types of users who would use this feature, if there's more than one.`,
        example: `Individual shoppers exporting their own history; store admins exporting all customers' order history for accounting.`,
        required: true,
      },
      {
        name: 'technical_constraint',
        description: `Anything already known that limits how this can be built or sequenced.`,
        example: `Export generation runs as an async background job; there's no notification infrastructure yet, that would need to be built first.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `user-stories`,
      `agile`,
      `invest-criteria`,
      `backlog-grooming`,
      `product-management`,
    ],
    whyItWorks: `GPT-5.1 asked to "write user stories" without a scoping framework will reliably produce grammatically correct As-a/I-want/So-that sentences that restate the feature description almost verbatim, because the template itself doesn't force any decomposition — the model completes the sentence structure without needing to actually reason about size, dependency, or whether the story bundles multiple pieces of value, which is exactly the gap that makes so many real backlogs full of stories that are really epics wearing a story's format. Forcing an explicit per-letter INVEST check changes this because each letter asks a genuinely different structural question the model has to answer against the actual content, not just the template shape — checking "Small" specifically requires the model to notice that "export, notify, and schedule recurring" is three distinct pieces of value bundled into one ask, which a bare story-writing instruction would happily leave merged since nothing in the request format objects to size. The instruction to actually perform the split rather than just flag a failure matters because a flagged-but-unresolved INVEST failure just relocates the scoping work to whoever reads the output next — the value of running this check at authoring time is catching and fixing the problem before it enters a sprint-planning conversation, not producing a report of problems still waiting to be fixed. Explicitly separating story-scoping from acceptance-criteria-writing as two different steps matters because conflating them tends to produce stories that are either underspecified (no criteria at all) or overloaded with implementation detail baked into the story text itself, which then also fails the Negotiable check — keeping the two passes distinct lets each be checked on its own terms.`,
    exampleOutput: `Original: 'As a shopper, I want to export my order history, get notified when it's ready, and schedule recurring exports.' INVEST check — Small: FAIL, bundles three distinct pieces of value. Split into: Story 1 — 'As a shopper, I want to request an export of my order history so I can keep records outside the app' (Independent: yes, standalone). Story 2 — 'As a shopper, I want to be notified when my requested export is ready so I don't have to keep checking' (Independent: FAIL, depends on Story 1 shipping and on notification infrastructure not yet built — name this as a sequencing dependency, build after Story 1 and the notification system). Story 3 — recurring export scheduling, deferred as its own story pending the first two.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-acceptance-criteria-gherkin-edge-cases',
    category: 'ui-design',
    title: `Write acceptance criteria that cover the edge cases a developer will otherwise guess at`,
    description: `Writes Given/When/Then acceptance criteria for a user story that explicitly cover boundary and error conditions, instead of only the one happy-path scenario most acceptance criteria stop at.`,
    promptText: `Write acceptance criteria in Given/When/Then format for the story below. Most acceptance criteria stop at the one happy-path scenario and leave every boundary and error condition for the developer to guess at during implementation — I want those made explicit up front instead.

USER STORY
{{user_story}}

INPUT FIELDS OR USER ACTIONS INVOLVED
{{inputs_involved}}

SYSTEM STATE THAT COULD VARY
{{variable_system_state}}

First write the single happy-path scenario. Then, for every input field or user action listed, generate the boundary and error scenarios a developer would otherwise have to guess: an empty or missing value, a value at the edge of an allowed range, a value just past that edge, and a malformed or unexpected value if the field type allows one. For every item listed under system state that could vary, write a scenario for each meaningfully different state (e.g., if the feature depends on account status, write a scenario for each status that would produce different behavior, not just the default one). Do not invent scenarios for conditions that couldn't actually occur given the inputs described — a text field with a hard 50-character limit enforced by the input itself doesn't need a "value has one million characters" scenario if that's physically impossible to enter. For any edge case where the correct behavior genuinely isn't decided yet by the story as written, write the scenario with the Then clause marked "TBD — needs a decision" rather than inventing a plausible-sounding behavior that hasn't actually been agreed to, since a fabricated Then clause here would ship as an assumed requirement no one actually approved.

WHAT NOT TO DO
Do not write vague Then clauses like "the system handles it appropriately" — every Then must state the specific observable outcome. Do not pad the list with scenarios that are trivial restatements of each other differing only in cosmetic wording.

OUTPUT FORMAT
A numbered list of Given/When/Then scenarios, happy path first, then boundary/error scenarios grouped by which input or state condition they test. Mark any TBD scenarios clearly at the end in their own short list so they're easy to route back to whoever owns the decision.`,
    variables: [
      {
        name: 'user_story',
        description: `The user story these criteria are for.`,
        example: `As a customer, I want to apply a discount code at checkout so I can get the promotional price before paying.`,
        required: true,
      },
      {
        name: 'inputs_involved',
        description: `Every field or action a user interacts with in this story.`,
        example: `Discount code text field, max 20 characters, applied via an 'Apply' button.`,
        required: true,
      },
      {
        name: 'variable_system_state',
        description: `Anything about the backend or account state that could differ and change the outcome.`,
        example: `Code could be expired, already used by this account, valid but for a different product category, or valid and applicable.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`acceptance-criteria`, `gherkin`, `edge-cases`, `qa`, `user-stories`],
    whyItWorks: `Given/When/Then output without an explicit boundary-enumeration instruction tends to stop at the single happy-path scenario because that's the shortest complete-looking answer to "write acceptance criteria for this story," and GPT-5.1 has no built-in obligation to enumerate every input's edge cases unless the prompt makes that enumeration the actual deliverable rather than an optional nicety. Explicitly requiring a scenario for empty, boundary, past-boundary, and malformed values per listed input converts the task from narrating one scenario into systematically walking a checklist per field, which is what actually produces the missing-code, expired-code, and used-code scenarios that a bare "write acceptance criteria" request would likely skip in favor of just the successful-discount-applied case. The instruction against inventing scenarios for physically impossible conditions matters because an unconstrained edge-case generator will happily produce scenarios for inputs the actual field constraints already rule out, padding the list with noise that a reviewer then has to filter out manually — tying scenario generation to the actual stated constraints keeps the output proportional to genuine risk rather than to how many permutations are mathematically possible. The TBD-marking instruction for undecided behavior is the most consequential rule in the prompt: without it, a model asked to write a Then clause for every scenario will produce a plausible-sounding specific behavior even where the story as given genuinely hasn't settled what should happen, and that fabricated behavior can silently become the de facto requirement once it's in a ticket — marking it TBD instead routes the actual decision back to a human rather than letting an invented answer pass as one that was actually agreed to.`,
    exampleOutput: `Scenario — code already used by this account: Given a customer has previously redeemed discount code SAVE20 on their account, When they attempt to apply SAVE20 again at checkout, Then the system rejects the code and displays 'This code has already been used.' Scenario — code valid but for a different product category: TBD — needs a decision on whether the system should reject the code outright or apply it partially to eligible items in the cart.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-ux-research-synthesis-affinity-map',
    category: 'ui-design',
    title: `Synthesize raw usability-test notes into themes ranked by how many participants actually hit each one`,
    description: `Synthesizes raw usability-test or interview notes into an affinity-mapped set of themes, each one weighted by how many distinct participants actually surfaced it, rather than a list of interesting quotes presented as if equally representative.`,
    promptText: `Synthesize the raw research notes below into themes, the way an affinity-mapping session would, but with an explicit weight on each theme showing how many distinct participants actually raised it — not a curated list of the most quotable moments presented as if they're equally representative of what most people said.

RAW NOTES
{{raw_notes}}

NUMBER OF PARTICIPANTS
{{participant_count}}

RESEARCH QUESTION THIS WAS MEANT TO ANSWER
{{research_question}}

STEP 1 — EXTRACT DISCRETE OBSERVATIONS
Pull out every discrete observation from the notes, tagged with which participant it came from. Do not merge two different participants' points into one bullet even if they're similar — keep the count honest at this stage so it can be aggregated correctly next.

STEP 2 — GROUP INTO THEMES
Group the tagged observations into themes based on what they're actually about, not based on which ones make the best pull-quote. For each theme, state how many distinct participants it draws from out of the total, and note if a theme is actually held by only one person — a single-participant point can still be worth including if it's a serious risk, but it must be labeled as a one-person signal, not implied to be a shared finding.

STEP 3 — RANK BY PREVALENCE, FLAG BY SEVERITY
Rank themes primarily by how many participants raised them, but call out separately any low-prevalence theme that represents a severe risk (a safety issue, a blocking bug, a legal or trust concern) even though it wouldn't rank highly by count alone — prevalence and severity are different axes and both matter, so don't let a ranking by count alone bury a rare but serious finding.

STEP 4 — TIE BACK TO THE RESEARCH QUESTION
For each major theme, state explicitly whether it answers the original research question, contradicts an assumption behind it, or is a finding adjacent to the question but not actually what was asked.

WHAT NOT TO DO
Do not present a theme's supporting quote as more representative than it is by omitting the participant count. Do not invent a theme that isn't actually traceable back to specific observations in the notes.

OUTPUT FORMAT
A numbered list of themes ranked by prevalence, each with: theme name, participant count (e.g., '4 of 7'), one representative observation, and how it relates to the research question. Follow with a separate short 'severity flags' section for any low-prevalence but high-risk findings.`,
    variables: [
      {
        name: 'raw_notes',
        description: `The actual raw research notes or transcript excerpts, not a pre-summarized version.`,
        example: `7 usability test session notes for a new onboarding flow: P1 got stuck on the permissions screen; P2 also got stuck there and gave up; P3 breezed through but mentioned confusion about what 'workspace' meant; P4 got stuck on permissions too; P5 completed it with no issues; P6 accidentally granted a permission they didn't mean to and was upset when they noticed later; P7 also confused by 'workspace' terminology.`,
        required: true,
      },
      {
        name: 'participant_count',
        description: `Total number of participants in this research round.`,
        example: `7`,
        required: true,
      },
      {
        name: 'research_question',
        description: `What this research round was actually trying to find out.`,
        example: `Can new users complete onboarding without assistance in under 3 minutes?`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `ux-research`,
      `research-synthesis`,
      `affinity-mapping`,
      `usability-testing`,
      `qualitative-analysis`,
    ],
    whyItWorks: `Research synthesis prompted without an explicit prevalence count tends to produce GPT-5.1's most narratively satisfying summary — themes built around the most vivid or quotable observations in the notes, since a compelling quote is easier to foreground than a dry tally, which systematically overweights whichever participant happened to phrase their frustration most memorably regardless of how many other participants actually shared the underlying problem. Forcing a discrete, participant-tagged extraction as a separate first step before any grouping happens is what keeps the later count honest: if grouping and counting happen in the same pass, it's easy for the model to silently merge two similar-sounding but distinct participant observations into one theme and then report a prevalence number that's actually an artifact of how the grouping was done rather than a real count of who said what. Explicitly separating prevalence-ranking from severity-flagging addresses a real and common analytical error in research synthesis — a genuinely dangerous or trust-breaking finding (like a user accidentally granting a permission they didn't intend to) can come from just one participant out of seven, and a synthesis that ranks purely by count would bury it below three people casually mentioning unclear terminology, when the accidental-permission issue is very plausibly the more consequential finding regardless of how many people hit it. Tying every theme back explicitly to the original research question, and naming when a finding is adjacent to but not actually answering that question, prevents scope creep in the synthesis where interesting-but-tangential observations get treated as if they answer the question that was actually asked, which is a common way research readouts end up misdirecting a design decision toward a problem the study wasn't actually measuring.`,
    exampleOutput: `Theme 1 — Confusion at the permissions screen (4 of 7 participants: P1, P2, P4, and indirectly P6). Representative observation: P2 said 'I didn't understand what I was being asked to allow, so I just gave up.' Relation to research question: directly contradicts the assumption that onboarding is completable unassisted — this is the primary blocker to the 3-minute goal. Severity flags: P6's accidental permission grant (1 of 7) is low-prevalence but represents a trust/safety risk distinct from the completion-time question and should be escalated separately regardless of its low count.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-usability-test-script-unmoderated',
    category: 'ui-design',
    title: `Write an unmoderated usability test script that catches silent confusion, not just task completion`,
    description: `Writes an unmoderated usability-test script with task prompts and follow-up questions designed to surface confusion a participant powered through silently, since an unmoderated test has no facilitator there to notice a hesitation live.`,
    promptText: `Write an unmoderated usability test script for the flow below. The specific risk with unmoderated testing is that there's no facilitator present to notice a participant hesitating, backtracking, or looking confused in the moment — a participant who eventually completes a task can still have been confused the whole way through, and a script that only checks "did they finish" will miss that entirely.

FLOW BEING TESTED
{{flow_to_test}}

SPECIFIC CONCERN PROMPTING THIS TEST
{{specific_concern}}

PARTICIPANT SCREENING CRITERIA
{{screening_criteria}}

TEST LENGTH
{{test_length}}

STRUCTURE
1. Write a pre-task question that establishes the participant's expectation before they start — what do they think is about to happen — so a mismatch between expectation and reality is detectable afterward rather than only inferred from completion time.
2. Write the task prompts themselves as realistic scenarios, not literal instructions naming the UI elements to click — a prompt that says "tap the blue button" tests nothing, since it tells the participant exactly what to do instead of observing what they'd naturally try; describe the goal in the participant's own terms and let the interface do the rest.
3. After each task, write a small set of follow-up questions specifically aimed at surfacing silent confusion: what did they expect to happen when they took the key action, was there any point they weren't sure what to do next even if they figured it out, and would they have done anything differently if this weren't a test. Do not ask a generic satisfaction question here ("how would you rate this task") — a rating doesn't reveal where the hesitation happened.
4. Include an explicit instruction for the participant to think aloud, stated plainly at the start of the script, since unmoderated tests depend entirely on the participant self-reporting what a moderator would otherwise observe.
5. Tie the follow-up questions for the task most related to {{specific_concern}} directly back to that concern, phrased so they could surface disconfirming evidence, not just confirm the concern is real.

WHAT NOT TO DO
Do not write task instructions that name specific UI elements or steps. Do not write more tasks than fit comfortably in the stated test length, and do not front-load easy tasks only — include the task most related to the specific concern even if it's the hardest one.

OUTPUT FORMAT
The full script in the order above: think-aloud instruction, pre-task expectation question, then each task with its scenario prompt and follow-up questions, ending with a short debrief question set.`,
    variables: [
      {
        name: 'flow_to_test',
        description: `The flow or feature being tested in this session.`,
        example: `A redesigned settings page for managing notification preferences across email, push, and SMS.`,
        required: true,
      },
      {
        name: 'specific_concern',
        description: `The particular worry or hypothesis prompting this round of testing.`,
        example: `We're worried users won't realize SMS notifications need a separate opt-in from push notifications.`,
        required: true,
      },
      {
        name: 'screening_criteria',
        description: `Who should be recruited for this test.`,
        example: `Existing users who have never changed their default notification settings.`,
        required: true,
      },
      {
        name: 'test_length',
        description: `The total time budget for the session.`,
        example: `15 minutes, unmoderated, recorded via screen-and-audio capture.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `usability-testing`,
      `unmoderated-testing`,
      `test-script`,
      `ux-research`,
      `task-design`,
    ],
    whyItWorks: `A usability test script written without this constraint tends to default to instruction-style task prompts ("click the settings icon, then toggle SMS notifications on") because that reads as a clear, unambiguous test step — but a prompt that names the exact UI element being tested doesn't actually test whether a participant can find it themselves, it just checks whether they can follow directions, which is a fundamentally different and far less useful signal; describing the goal in the participant's own terms instead is what forces the interface's actual discoverability to be the thing under test. The specific risk named in the prompt — that unmoderated tests have no facilitator to catch a silent struggle — is real and well-documented in usability research: task completion rate alone conflates a participant who breezed through with one who hesitated, backtracked twice, and got there by trial and error, and both look identical in a binary completion metric. Requiring a pre-task expectation question and a post-task set specifically aimed at the moment of the key action (what did you expect, was there a point you weren't sure) gives the researcher a way to detect that gap after the fact using only self-report, which is the only signal available once there's no live observer — a generic satisfaction rating doesn't do this because a participant can rate a confusing-but-eventually-successful task highly out of relief at having finished it, masking exactly the friction the test was meant to catch. Explicitly requiring the concern-related task to be included even if it's the hardest, and phrasing its follow-up to allow disconfirming evidence, guards against the same confirmation-bias risk present in interview scripts: a test designed only to validate an existing worry will tend to produce data that validates it, unless at least one question is built with a genuine chance to show the worry is unfounded.`,
    exampleOutput: `Task 2 scenario: 'You just missed an important text alert from a friend and want to make sure you get text alerts for messages like that going forward. Show me how you'd set that up.' Follow-up: 'What did you expect to happen when you turned on notifications earlier in this task — did you think that already covered text messages, or did you know it was separate?' This is phrased to surface whether the participant assumed push and SMS were bundled, without stating that assumption as the expected answer.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-microcopy-button-and-empty-states',
    category: 'ui-design',
    title: `Write microcopy for one flow's buttons, empty states, and confirmations as a single consistent voice`,
    description: `Writes all the microcopy for one flow at once — buttons, empty states, confirmations, and tooltips — as a single consistent voice pass, catching inconsistencies that appear when each string is written in isolation.`,
    promptText: `Write the microcopy for every touchpoint in the flow below at once, as one voice pass — buttons, empty states, confirmation messages, and tooltips. Microcopy is usually written string-by-string as each screen gets built, which is exactly how a product ends up with three different tones and two different ways of saying "delete" across one flow; writing it all together is how that gets caught.

FLOW AND EVERY STRING NEEDED
{{flow_and_strings_needed}}

BRAND VOICE REFERENCE
{{brand_voice_reference}}

USER'S EMOTIONAL STATE AT KEY MOMENTS
{{emotional_context}}

RULES
Write every string in the same voice, established by the brand voice reference — but adapt tone within that voice to the emotional context at each moment; the voice stays consistent (word choice, formality, use of humor or restraint) while tone shifts appropriately (a delete-confirmation for a destructive action should not carry the same playful tone as an empty-state illustration caption, even in an otherwise playful brand voice). For every destructive or hard-to-undo action, the confirmation copy must state specifically what will happen and whether it can be undone — never a bare "Are you sure?" with no information added. For every empty state, the copy must tell the user what to do next to fill it, not just describe the absence ("No items yet" alone is a description; "Add your first item to get started" is actionable). Check every string against every other string in the set for consistency of terminology — if one button says "Remove" and another says "Delete" for functionally the same action, flag it and pick one term to use throughout. Keep every string as short as it can be while still being specific — cut filler words, but never cut the specific information (what will happen, whether it's reversible) needed for a confirmation to actually inform a decision.

WHAT NOT TO DO
Do not write generic placeholder-style copy ("Click here") that a template would produce regardless of context. Do not use exclamation points or forced enthusiasm on error or destructive-action copy even if the brand voice is generally upbeat elsewhere.

OUTPUT FORMAT
A table: Location in flow | String | Purpose (button / empty state / confirmation / tooltip). Follow with a short 'consistency check' note listing any terminology conflicts you found and resolved across the set.`,
    variables: [
      {
        name: 'flow_and_strings_needed',
        description: `Every screen in the flow and every string that needs copy.`,
        example: `A shared-document flow: 'Share' button, empty state for a document with no collaborators yet, confirmation for removing a collaborator, tooltip on the 'view-only' permission toggle.`,
        required: true,
      },
      {
        name: 'brand_voice_reference',
        description: `A description or example of the established brand voice.`,
        example: `Warm and plainspoken, avoids corporate jargon, occasional light humor in low-stakes moments, never uses exclamation points in more than one string per screen.`,
        required: true,
      },
      {
        name: 'emotional_context',
        description: `What a user is likely feeling at the key moments in this flow.`,
        example: `Slight anxiety when removing a collaborator (worried about hurting the relationship or losing shared work); mild uncertainty at the empty state (not sure if sharing is even worth setting up yet).`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `microcopy`,
      `ux-writing`,
      `voice-and-tone`,
      `empty-states`,
      `confirmation-dialogs`,
    ],
    whyItWorks: `Microcopy generated string-by-string, in separate requests or separate design sessions, is the actual root cause of the terminology drift real products ship with — one screen calling an action "Remove" and another calling the same underlying action "Delete" isn't usually a deliberate choice, it's what happens when no single pass ever compared the two strings against each other. Generating the entire flow's copy in one batch, with an explicit cross-string consistency check as its own instruction, is what catches this, because the model is holding every string in context simultaneously and can be made to compare them directly rather than writing each one fresh without memory of the others. The voice-versus-tone distinction — consistent word choice and formality throughout, but tone that shifts to match the emotional weight of the specific moment — matters because a brand voice applied uniformly without this distinction produces a genuinely bad result in high-stakes moments: an upbeat, playful voice used verbatim on a destructive-action confirmation reads as tone-deaf regardless of how well it fits the brand everywhere else, and GPT-5.1 asked only for "copy in this brand voice" with no tone-modulation instruction will tend to apply the voice sample's surface style uniformly rather than recognizing that restraint is itself sometimes the on-brand choice for a specific moment. Requiring confirmation copy to state the specific consequence and reversibility rather than a bare "Are you sure?" addresses a well-documented UX writing failure where the most common confirmation dialog in software gives the user no actual information to decide with — "are you sure" answers nothing about what happens if they say yes, and a user who doesn't know whether an action is reversible has to guess, which is precisely the moment microcopy exists to prevent.`,
    exampleOutput: `Location: Remove-collaborator confirmation | String: 'Remove Jamie from this document? They'll lose access immediately, but any comments they've already left will stay.' | Purpose: confirmation. Consistency check: original draft used 'Remove' on this screen and 'Delete' on the collaborator-list row menu for the same action — standardized on 'Remove' throughout since 'Delete' implies destroying the person's account access history, which isn't what happens here.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-error-message-rewrite-actionable',
    category: 'ui-design',
    title: `Rewrite a wall of raw error messages into ones a non-technical user can actually act on`,
    description: `Rewrites a list of raw, developer-facing error strings into user-facing messages that state what happened, why, and the one thing to do next, without inventing a cause the system doesn't actually report.`,
    promptText: `Rewrite the raw error messages below into user-facing versions a non-technical person could actually act on. These are currently written for developers debugging the system, not for the person who just hit the error mid-task.

RAW ERROR MESSAGES
{{raw_error_messages}}

WHERE EACH ERROR APPEARS
{{error_context}}

WHAT INFORMATION IS ACTUALLY AVAILABLE AT THE MOMENT OF THE ERROR
{{available_error_info}}

For each error, write a user-facing version with three parts: what happened, stated in plain language without internal system terms (no status codes, stack traces, or internal service names); why, but only using information actually available in {{available_error_info}} — if the underlying cause isn't actually known or exposed at that point in the system, say something honest and generic ("something went wrong on our end") rather than inventing a specific-sounding cause that isn't actually what the system detected, since a fabricated-but-specific cause is worse than an honest generic one because it can send a user or a support agent chasing the wrong fix; and next step, a single concrete action the user can take right now (retry, check a specific field, wait and try again, contact support with a specific reference code) rather than a vague "try again later" with no guidance on when "later" is or what changed. Match the tone to the severity of the error — a temporary network hiccup should read calmly, while an error that lost unsaved work should acknowledge that plainly rather than downplaying it. Never blame the user in the wording for something the system did (avoid phrasing that implies user error when the raw message indicates a system-side failure).

WHAT NOT TO DO
Do not soften a data-loss or security-relevant error into vague reassurance — state clearly what was and wasn't affected if that's knowable from the given context. Do not invent a specific retry time, error code, or cause that wasn't in the original raw message or the stated available information.

OUTPUT FORMAT
A table: Raw error | Where it appears | User-facing rewrite (what happened / why / next step) | Flag if the true cause isn't actually knowable at this point (meaning the rewrite had to stay honestly generic).`,
    variables: [
      {
        name: 'raw_error_messages',
        description: `The actual raw error strings as they currently appear or as logged.`,
        example: `'Error 500: Internal Server Error - upstream timeout at payment-gateway-service', 'Error 422: validation failed - field "email" does not match regex'`,
        required: true,
      },
      {
        name: 'error_context',
        description: `Where in the product each error surfaces to the user.`,
        example: `First error appears mid-checkout after clicking Pay; second appears on the signup form after submitting.`,
        required: true,
      },
      {
        name: 'available_error_info',
        description: `What the system actually knows or reports at the moment the error occurs.`,
        example: `The payment timeout is known to be transient, usually resolves on retry within a minute, no charge is made if it fails at this step; the email validation error only knows the format didn't match, not which specific rule was violated.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `error-messages`,
      `ux-writing`,
      `microcopy`,
      `error-handling`,
      `user-facing-copy`,
    ],
    whyItWorks: `Raw error strings handed to GPT-5.1 with a bare "make this user-friendly" instruction get a surface-level rewrite — friendlier words wrapped around the same underlying vagueness — because nothing in that instruction forces the model to check whether it actually knows the cause before stating one; the model will happily produce a specific-sounding explanation ("this happened because your session expired") that sounds like a real diagnosis but is actually invented, since a plausible guess is a perfectly good completion of "explain this error nicely" even when it isn't grounded in what the system actually reported. Explicitly restricting the "why" to only the information given in the available-error-info field, and requiring an honest generic fallback when the true cause isn't exposed, is what prevents this fabrication — it forces the model to treat the stated system knowledge as a hard boundary rather than a starting point to extrapolate plausibly from. The three-part structure (what / why / next step) matters because most bad error messages fail specifically at the third part — they describe a problem without ever telling the user what to actually do about it right now, leaving "try again later" as a non-answer that doesn't say when later is or what would be different — forcing a single concrete action per error closes that gap directly. Matching tone to severity, and the explicit instruction never to downplay a data-loss or security-relevant error, addresses a real and consequential failure mode in error copywriting: an error message trying too hard to sound reassuring can actively mislead a user into believing nothing serious happened when their work was in fact lost, which is a worse outcome than a blunter message that correctly conveys the actual severity of what occurred.`,
    exampleOutput: `Raw: 'Error 500: Internal Server Error - upstream timeout at payment-gateway-service' | Where: mid-checkout after clicking Pay | Rewrite: 'What happened: the payment step timed out before completing. Why: this is usually a brief connection issue on our end, not something wrong with your card. Next step: no charge was made — wait a few seconds and click Pay again.' | Flag: cause is knowable here (transient timeout, no charge), no generic fallback needed.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-empty-state-copy-and-layout-system',
    category: 'ui-design',
    title: `Design every empty state a dashboard can hit so 'no data yet' never reads like a bug`,
    description: `Produces copy, layout, and a next-action for each distinct empty state a product screen can show — first-use, filtered-to-zero, and error — so users never mistake an empty screen for a broken one.`,
    promptText: `You are designing the empty-state system for one specific screen in a product, covering every distinct reason that screen can render with nothing in it, not just a single generic "no data" message.

SCREEN
{{screen_name}}

DISTINCT EMPTY REASONS
{{empty_reasons}}

FIRST-USE USER CONTEXT
{{first_use_context}}

PRIMARY NEXT ACTION AVAILABLE
{{primary_action}}

VISUAL SYSTEM CONSTRAINTS
{{visual_constraints}}

RULES
Treat each entry in DISTINCT EMPTY REASONS as its own empty state with its own copy — a screen with zero rows because a brand-new account hasn't created anything yet is a different problem from the same screen showing zero rows because a filter matched nothing, and collapsing both into one "Nothing here" message is the single most common empty-state mistake, because the correct next action is different in each case (create the first thing vs. loosen the filter). For every state, write a headline that names what's actually true (not "No results" as a flat fact with no path forward) and a single sentence of supporting copy, then specify exactly one primary action button tied to that state's real next step — never stack two competing CTAs in an empty state, since a user who hit an empty screen is already uncertain and a choice between two vague buttons increases that uncertainty rather than resolving it. For the first-use state specifically, write copy that assumes zero prior context about the product's terminology, since this is often the very first thing a new account sees on that screen. For an error or failed-load state, the copy must never blame the user's input or connection speculatively — state only what's known (the load failed) and offer retry, never invent a diagnosis the system hasn't confirmed. Specify layout notes only where they change per state (e.g., whether an illustration is warranted or whether a filtered-to-zero state should stay minimal and inline rather than taking over the whole screen with a big illustration, which reads as overkill for a one-click filter fix).

WHAT NOT TO DO
Do not produce a single reusable empty-state template with a variable swapped in — that is exactly the failure mode of collapsing distinct problems into one message. Do not add humor or personality copy unless the product's existing voice already uses it elsewhere on this screen; empty states are a bad place to introduce a new tone the user hasn't seen before.

OUTPUT FORMAT
A table with one row per empty reason: State name | Headline | Supporting copy | Primary action label + destination | Layout note (illustration / inline / none). Close with one paragraph flagging any empty reason from the input that actually needs to be split further into two distinct states.`,
    variables: [
      {
        name: 'screen_name',
        description: `The specific screen or view being designed, not the whole product.`,
        example: `The Reports tab in a project-management SaaS dashboard.`,
        required: true,
      },
      {
        name: 'empty_reasons',
        description: `Every distinct reason this screen can currently render with zero items.`,
        example: `New account with no reports created yet; existing account with reports but the current filter/date-range matches none; the reports API call failed to load.`,
        required: true,
      },
      {
        name: 'first_use_context',
        description: `What a brand-new user does or doesn't already understand about this feature.`,
        example: `They've just signed up and have never created a report before; they don't yet know a report is built from saved views, not raw data.`,
        required: true,
      },
      {
        name: 'primary_action',
        description: `The one action each empty state should realistically push toward.`,
        example: `Create report from template; for the filtered-zero case, clear filters; for the error case, retry the load.`,
        required: true,
      },
      {
        name: 'visual_constraints',
        description: `Any layout or brand constraints the empty state must respect.`,
        example: `No custom illustrations available yet — use icon + text only, single column, matches the existing card component width.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `empty-states`,
      `ux-writing`,
      `dashboard-design`,
      `onboarding`,
      `product-design`,
    ],
    whyItWorks: `The prompt forces the model to treat empty-reason enumeration as the actual design problem rather than letting it default to writing one polished "empty state card" and calling the job done, which is what GPT-5.1 tends to produce when asked generically for "an empty state" — it reaches for a single tidy illustration-plus-message pattern because that's the most common training-data shape for the term, even though real products need at least three behaviorally distinct versions. Naming the first-use case separately matters because a new account's zero-state and an existing account's filtered-to-zero state look identical in the database (both are just an empty list) but require opposite framing: one needs to teach unfamiliar vocabulary and invite creation, the other needs to acknowledge an existing collection exists and help the user get back to it, and a model without this split reliably writes copy generic enough to technically fit both, which is the same as fitting neither well. The single-CTA constraint closes a specific failure mode where models asked for "an empty state with actions" list two or three buttons because more options feels more helpful, when in practice a user looking at nothing is in a low-confidence moment and a forced single next step reduces the decision instead of adding to it. The rule against inventing a diagnosis in the error state addresses a subtler drift: without an explicit constraint, models often write reassuring but false specifics like "check your connection," which is a guess dressed as information, and stating only the confirmed fact (the load failed) keeps the copy honest about what the system actually knows.`,
    exampleOutput: `First-use: Headline "No reports yet" / copy "Reports are built from saved views — create your first one from a template." / CTA "Create report from template" / layout: icon + text, no illustration. Filtered-to-zero: Headline "No reports match these filters" / copy "Try widening the date range or clearing a filter." / CTA "Clear filters" / layout: inline, no illustration. Load failed: Headline "Reports didn't load" / copy "Something went wrong on our end." / CTA "Retry" / layout: inline.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-onboarding-flow-first-session-activation',
    category: 'ui-design',
    title: `Map a first-session onboarding flow around the one action that actually predicts retention`,
    description: `Builds a step-by-step onboarding sequence anchored to a single activation milestone, cutting every step that doesn't move a new user toward it — with a named fallback for users who stall.`,
    promptText: `PRODUCT
{{product_description}}

ACTIVATION MILESTONE (the one action correlated with retention)
{{activation_milestone}}

CURRENT ONBOARDING STEPS (if any exist already)
{{current_steps}}

NEW USER STARTING KNOWLEDGE
{{starting_knowledge}}

WHERE USERS CURRENTLY STALL
{{stall_point}}

Phase 1 — Justify every step against the milestone.
For each step in CURRENT_STEPS, state in one line whether it moves the user closer to ACTIVATION_MILESTONE, is neutral scaffolding required to make the milestone reachable, or is unrelated setup that could be deferred to after activation (account preferences, notification settings, profile completeness, integrations the user doesn't need on day one). Be willing to recommend cutting or deferring a step even if it currently exists — the goal is the fastest honest path to the milestone, not preserving whatever's already built.

Phase 2 — Design the flow.
Lay out the onboarding sequence as an ordered list of screens, each with: what the user sees, what single action moves them forward, and what happens if they take no action (does it block, or let them skip and return later). Every screen must justify its own existence against the milestone from Phase 1; if a screen exists only to explain the product rather than get the user doing the actual thing, replace it with a version that has the user attempt the real action with guardrails instead of reading about it first.

Phase 3 — Design the stall recovery.
At STALL_POINT specifically, propose one intervention that addresses the likely reason a user gets stuck there (missing information, no clear next step, or a decision they're not ready to make) rather than a generic "need help?" prompt. State what triggers it (time on screen, an explicit exit attempt, a failed action) and what it offers.

WHAT NOT TO DO
Do not include a full feature tour as a required step — a tour a user must click through before reaching the milestone adds friction for a payoff (feature awareness) that matters far less than activation itself in the first session. Do not propose gamification (progress bars, checklists, confetti) as a substitute for actually shortening the path; if you include a progress indicator, it must reflect genuine proximity to the milestone, not just make the flow feel structured.

OUTPUT FORMAT
1. Phase 1 table: step | verdict (advances / scaffolding / defer) | one-line reason.
2. Phase 2 ordered flow, one entry per screen.
3. Phase 3 stall intervention: trigger, format, content.
4. One paragraph stating the fewest number of screens this flow could reach the milestone in, and what would have to be true of the product for that minimum to work.`,
    variables: [
      {
        name: 'product_description',
        description: `What the product does, in plain terms.`,
        example: `A team scheduling tool that generates shift rosters from staff availability.`,
        required: true,
      },
      {
        name: 'activation_milestone',
        description: `The single action shown to correlate with a user coming back / retaining.`,
        example: `Publishing their first completed roster to at least one staff member.`,
        required: true,
      },
      {
        name: 'current_steps',
        description: `The onboarding steps that exist today, if any.`,
        example: `Welcome screen, profile setup, invite team members, feature tour, connect calendar integration, create first roster.`,
        required: false,
      },
      {
        name: 'starting_knowledge',
        description: `What a brand-new user already understands or doesn't, coming in.`,
        example: `Most are managers who've used a spreadsheet for scheduling before and don't know what 'availability rules' means in this tool.`,
        required: true,
      },
      {
        name: 'stall_point',
        description: `Where in the current flow users most often stop or drop off.`,
        example: `After inviting their team, before creating the first roster — many never come back to actually build one.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `onboarding`,
      `activation`,
      `user-retention`,
      `product-design`,
      `first-session-ux`,
    ],
    whyItWorks: `Anchoring every phase to one named activation milestone stops the model from doing what it does by default when asked to "design an onboarding flow" generically: producing a well-rounded tour that introduces every feature roughly equally, because without an explicit success metric it has no basis to prioritize one path over another and treats comprehensiveness as the safest answer. Making Phase 1 an audit of existing steps against that single milestone, with explicit permission to recommend cutting things, counteracts sunk-cost thinking that shows up in how these models handle "current state" inputs — when given a list of existing steps, the default behavior is to keep all of them and improve their copy, because that reads as the conservative, low-risk suggestion, when the actually correct move is often deletion. Requiring the model to classify each step as advancing, scaffolding, or deferrable forces a real judgment call instead of a soft edit, and it's a distinction humans doing this exercise also frequently skip, which is why onboarding flows accumulate steps over time without anyone deciding any single one was worth its cost. The explicit ban on treating a feature tour as a required gate addresses a specific, common failure: tours read as thorough and safe to suggest, but they add real friction before the one thing that predicts retention, and a model that isn't told this will default to including one because tours are the most heavily represented onboarding pattern in general product-design writing it has seen. The stall-point phase is scoped to cause, not symptom, so the output is a targeted intervention rather than a reflexive "add a help tooltip."`,
    exampleOutput: `Phase 1: Feature tour -> defer (doesn't advance milestone, adds friction). Connect calendar integration -> defer (not required to publish first roster). Invite team members -> scaffolding (needed so there's someone to publish to, but can be simplified to one invite). Phase 2, 3 screens: (1) set availability for one week, prefilled with sensible defaults; (2) auto-generate a draft roster from that availability; (3) publish to the one invited teammate. Stall intervention at 'after inviting, before rostering': triggered after 24 hours of inactivity, an email with a one-click 'generate your draft roster now' link pre-filled from whatever availability was entered.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-checkout-flow-friction-audit',
    category: 'ui-design',
    title: `Audit a checkout flow step by step for the exact point shoppers are abandoning at`,
    description: `Walks a real checkout flow screen by screen against known drop-off data to identify which specific step is causing abandonment and what to change there first, instead of a generic best-practices checklist.`,
    promptText: `You are auditing a specific e-commerce checkout flow to find the step most likely responsible for its abandonment rate, using the actual flow and data provided, not a generic checkout best-practices list.

CURRENT CHECKOUT STEPS IN ORDER
{{checkout_steps}}

ABANDONMENT DATA BY STEP (if available)
{{abandonment_data}}

CUSTOMER TYPE
{{customer_type}}

PAYMENT AND SHIPPING OPTIONS OFFERED
{{payment_shipping_options}}

KNOWN CONSTRAINTS THAT CAN'T CHANGE
{{fixed_constraints}}

For each step in CHECKOUT_STEPS, evaluate it against three specific failure patterns rather than generic polish: (1) does it demand information the checkout doesn't actually need to complete this specific purchase (an account creation requirement, a phone number with no stated use, a marketing opt-in presented as if required); (2) does it introduce a cost or fact the customer hasn't seen yet at a point past where they've already invested effort (shipping cost revealed only at the final step, a fee appearing without earlier warning); (3) does it break the customer's expectation of what happens next (a step that looks like it might be the last one but isn't, no visible progress indicator, a back button that clears entered data). If ABANDONMENT_DATA is provided, treat the step with the sharpest drop as the priority even if other steps have more surface-level problems — do not spread recommendations evenly across all steps when the data points at one. If no abandonment data exists, name which single step is statistically most likely to be the leak based on the three failure patterns and say so explicitly, rather than presenting all steps as equally urgent.

For CUSTOMER_TYPE, check whether the flow assumes the wrong default — a first-time buyer forced through account-creation friction, or a returning customer forced to re-enter information the store should already have. Check FIXED_CONSTRAINTS before recommending anything that would require removing them; propose the best available fix that respects the constraint rather than an ideal-world redesign that ignores it.

WHAT NOT TO DO
Do not produce a generic 10-point checkout best-practices checklist (guest checkout, progress bar, trust badges) unless each point is tied back to a specific step in THIS flow with a specific reason it applies here. Do not recommend a full checkout rebuild as the first move; find the single highest-leverage fix first.

OUTPUT FORMAT
1. Step-by-step table: step | failure pattern found (or none) | severity.
2. The single highest-priority step to fix, with the specific reasoning for why it outranks the others.
3. One concrete fix for that step that respects FIXED_CONSTRAINTS.
4. One risk: what could get worse if this fix is made without also addressing anything else flagged.`,
    variables: [
      {
        name: 'checkout_steps',
        description: `The actual sequence of screens/steps in the current checkout, in order.`,
        example: `Cart review -> create account or guest checkout choice -> shipping address -> shipping method + cost shown -> payment info -> order review -> confirmation.`,
        required: true,
      },
      {
        name: 'abandonment_data',
        description: `Any known drop-off rate per step, if tracked.`,
        example: `68% proceed from cart to address, 71% from address to shipping method, only 40% proceed from shipping method to payment.`,
        required: false,
      },
      {
        name: 'customer_type',
        description: `Who is checking out — mostly first-time, mostly returning, or mixed.`,
        example: `About 80% first-time buyers arriving from paid social ads.`,
        required: true,
      },
      {
        name: 'payment_shipping_options',
        description: `What payment and shipping choices are currently offered.`,
        example: `Credit card and PayPal only, no Apple Pay; single flat-rate shipping option, no express tier.`,
        required: true,
      },
      {
        name: 'fixed_constraints',
        description: `Anything about the checkout that cannot be changed for this audit (platform limitation, legal requirement, business rule).`,
        example: `Built on a hosted e-commerce platform's checkout template — can reorder and hide fields but can't change the underlying page structure.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `checkout-ux`,
      `conversion-optimization`,
      `ecommerce`,
      `cart-abandonment`,
      `ux-audit`,
    ],
    whyItWorks: `Requiring the model to check each step against three named failure patterns instead of asking it to "review the checkout for UX issues" prevents the single most common output shape for that generic prompt: a restated best-practices list (add guest checkout, show trust badges, add a progress bar) that sounds authoritative but isn't actually derived from the specific flow provided, since GPT-5.1 has seen thousands of near-identical checkout-optimization listicles and will reach for that pattern by default when given room to. Making abandonment data the deciding factor when present, with an explicit instruction to concentrate on the sharpest drop rather than spreading recommendations evenly, corrects for the model's tendency toward diplomatic completeness — an unconstrained review will typically flag something at every step so no part of the audit reads as "fine," which produces a report that looks thorough but gives the reader no actual priority order to act on. Forcing an explicit priority call even without data ("say so explicitly") stops the model from hedging behind "it depends on your specific data" as an exit ramp, which is a common way models avoid committing to a specific, checkable claim when the input is incomplete. The fixed-constraints field matters because checkout audits routinely get thrown out by implementation teams when the top recommendation requires rebuilding infrastructure that was never on the table — anchoring the fix to what can't change forces a genuinely actionable answer instead of an ideal-world one nobody can ship this quarter.`,
    exampleOutput: `Priority step: shipping method (71% -> 40% drop). Failure pattern: cost surprise — flat shipping fee is not shown until this step even though it was calculable from the cart contents at step one. Fix within platform template constraints: surface an estimated shipping cost directly on the cart review screen using the same rate table, before the customer has invested two more steps of effort. Risk: doing only this without also revisiting the address-to-shipping-method drop may leave a smaller but real second leak unaddressed.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-navigation-system-for-growing-feature-set',
    category: 'ui-design',
    title: `Rework a product's navigation before it collapses under its own feature count`,
    description: `Redesigns the top-level navigation structure for a product that has outgrown its original nav, deciding what earns a primary slot versus what moves into a secondary or contextual location.`,
    promptText: `You are redesigning the primary navigation for a product whose feature count has outgrown the navigation structure it launched with, where new features have been bolted onto the existing nav rather than the nav being rethought.

CURRENT NAVIGATION ITEMS
{{current_nav_items}}

USAGE FREQUENCY PER ITEM (if known)
{{usage_frequency}}

USER ROLES THAT USE THIS PRODUCT
{{user_roles}}

NAV PATTERN CONSTRAINTS
{{nav_pattern_constraints}}

ITEMS THAT MUST STAY IN PRIMARY NAV REGARDLESS
{{must_stay_items}}

Decide, for each current nav item, whether it belongs in primary navigation, a secondary/nested location, or a contextual surface (inside a specific workflow rather than global nav at all). Base this on USAGE_FREQUENCY where given — an item used daily by most roles has a different claim on primary nav real estate than one used monthly by a fraction of roles, even if both were added to the nav at the same time historically. Where USER_ROLES differ meaningfully in what they need, decide whether the nav should be role-adaptive (different roles see a different primary set) or a single shared structure — state which you're recommending and why, since a role-adaptive nav has a real cost: it means no two users can be walked through the interface identically, which affects support and training as much as it affects design.

For any item you move out of primary nav, name specifically where it moves to and why a user looking for it would still find it there — never demote an item to a location that's effectively equivalent to deleting it. Respect every entry in MUST_STAY_ITEMS as non-negotiable even if usage data would argue against it; state the tension explicitly rather than silently overriding the constraint or silently complying without noting the conflict with the data.

Group the surviving primary items into a structure with a clear organizing logic (by user goal, by object type, by workflow stage) rather than an unordered flat list — name which logic you used and why it fits this product better than the alternatives.

WHAT NOT TO DO
Do not simply alphabetize or evenly distribute items across a fixed number of top-level slots as if the count were the only constraint — the organizing principle matters more than hitting a specific number of items. Do not recommend adding a search bar as a substitute for actually deciding the structure; search is a fallback for a bad hierarchy, not a fix for one.

OUTPUT FORMAT
1. Table: nav item | current location | recommended location | reason.
2. The organizing logic chosen for the primary nav group, stated in one sentence.
3. If role-adaptive nav is recommended, what differs per role and what stays constant.
4. Any conflict between MUST_STAY_ITEMS and the usage data, named explicitly.`,
    variables: [
      {
        name: 'current_nav_items',
        description: `The full list of items currently in the product's navigation.`,
        example: `Dashboard, Projects, Tasks, Reports, Team, Integrations, Billing, Automations, Templates, Settings, Help.`,
        required: true,
      },
      {
        name: 'usage_frequency',
        description: `How often each item is actually used, if tracked.`,
        example: `Tasks and Projects opened daily by nearly all users; Automations and Templates opened by under 15% monthly; Billing opened almost only by admins.`,
        required: false,
      },
      {
        name: 'user_roles',
        description: `The distinct roles or user types who use this product.`,
        example: `Individual contributors (mostly Tasks/Projects), team admins (Team/Billing/Integrations), and viewers with read-only access (mostly Reports).`,
        required: true,
      },
      {
        name: 'nav_pattern_constraints',
        description: `Any technical or design-system constraint on the nav pattern itself.`,
        example: `Left sidebar nav, currently no support for nested flyout menus, mobile app uses a separate bottom tab bar limited to 5 items.`,
        required: false,
      },
      {
        name: 'must_stay_items',
        description: `Any nav item that must remain in primary navigation for business or contractual reasons, regardless of usage.`,
        example: `Billing must stay visible in primary nav per a compliance requirement that payment status be easily reachable.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `navigation-design`,
      `information-architecture`,
      `saas-ux`,
      `design-systems`,
      `product-design`,
    ],
    whyItWorks: `Grounding the decision in usage frequency rather than asking the model to judge "what's important" in the abstract removes the main way GPT-5.1 goes wrong on nav redesigns without data: it defaults to preserving items that sound consequential (Billing, Settings, Integrations) over items that are actually opened constantly (Tasks, Projects), because importance-by-connotation is what it reaches for absent a real usage signal, and that produces a nav optimized for how the product looks in a sales demo rather than how it's actually used day to day. Forcing an explicit choice between a single shared nav and a role-adaptive one, with the real cost of role-adaptive nav stated up front, stops the model from recommending role-based personalization as a free win — it's the kind of suggestion that sounds sophisticated and tends to get proposed reflexively, but it has a genuine downstream cost in support complexity and inconsistent onboarding that a model won't surface unless explicitly asked to weigh it. The instruction to name a destination for anything demoted, and to check that a user would still find it there, targets a specific way navigation redesigns quietly become deletions: an item moved into a three-levels-deep settings submenu is, in practical terms, gone, even though it technically still exists in the product, and without this check a model will happily reorganize items into locations that are correct on paper but undiscoverable in practice. Banning the alphabetize-or-evenly-distribute move addresses a real evasion: given a request to reduce the item count, models often default to a structural trick (grouping into folders of similar size) rather than doing the harder work of an actual organizing principle grounded in how users think about the product.`,
    exampleOutput: `Tasks, Projects -> stay primary (daily use, all roles). Automations, Templates -> move to a secondary 'Workflow tools' menu reachable from the Projects area, not buried in Settings, since usage is low but concentrated among power users who look for it near where they build workflows. Billing -> stays primary per compliance constraint despite low general usage; noted as a tension with the frequency data. Organizing logic: grouped by user goal (Do the work / Manage the team / Configure the account) rather than by object type, since roles map cleanly onto those three goals.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-information-architecture-content-audit-sitemap',
    category: 'ui-design',
    title: `Turn a messy content inventory into a sitemap organized around what users actually search for`,
    description: `Takes a raw list of existing pages or sections and restructures them into a sitemap grounded in real user search terms and tasks, flagging orphaned or duplicate content along the way.`,
    promptText: `CONTENT INVENTORY (raw list of existing pages/sections)
{{content_inventory}}

WHAT USERS ARE ACTUALLY SEARCHING FOR OR ASKING
{{user_search_terms}}

EXISTING CATEGORIZATION (if any)
{{existing_categorization}}

SITE TYPE AND AUDIENCE
{{site_type_audience}}

STEP 1 — Match content to real demand.
Go through CONTENT_INVENTORY and match each item against USER_SEARCH_TERMS. Flag three categories explicitly: content that matches a real, frequent search term and should be easy to find; content that exists but matches nothing in the search data (orphaned content — flag it as a candidate for merging, deleting, or better labeling, not automatic deletion); and search terms that have no matching content at all (a gap to flag for content creation, separate from this IA exercise but worth naming).

STEP 2 — Detect duplication and fragmentation.
Identify items in CONTENT_INVENTORY that cover overlapping ground under different names — this happens naturally as content accumulates over time from different authors — and recommend which should merge, with the merged item's name based on the more frequently searched term between them, not whichever page happens to be older or was authored first.

STEP 3 — Build the sitemap.
Propose a hierarchy no more than three levels deep unless SITE_TYPE_AUDIENCE specifically justifies a fourth, since each additional required click measurably reduces the odds a user completes their task. Name top-level categories using the language from USER_SEARCH_TERMS rather than internal department or product-team naming — a category named after how the organization is structured internally is a common IA mistake because it optimizes for how content is produced rather than how it's found. For EXISTING_CATEGORIZATION, state explicitly what you're keeping and what you're changing, and why, rather than silently discarding prior work without acknowledgment.

WHAT NOT TO DO
Do not propose a category structure mirroring an internal org chart or product-team boundaries even if EXISTING_CATEGORIZATION already does this — that structure serves the people who built it, not the people searching for it. Do not merge two pieces of content into one page just because their names are similar; verify the actual content overlaps, not just the naming.

OUTPUT FORMAT
1. Table: content item | matched search term (or 'orphaned') | recommended sitemap location.
2. List of unmatched search terms (content gaps), separate from the IA recommendation itself.
3. Merge recommendations with reasoning.
4. The proposed sitemap as a nested list, top-level categories named in user language.
5. One paragraph on what's kept vs. changed from EXISTING_CATEGORIZATION and why.`,
    variables: [
      {
        name: 'content_inventory',
        description: `The raw list of existing pages, sections, or content pieces to organize.`,
        example: `Pricing, Plans & Billing FAQ, Enterprise Pricing, Refund Policy, How Billing Cycles Work, Payment Methods, Cancel Subscription, Upgrade Guide.`,
        required: true,
      },
      {
        name: 'user_search_terms',
        description: `Real search queries, support ticket subjects, or site-search data showing what users look for.`,
        example: `"how do I cancel my subscription", "change billing date", "upgrade plan", "refund policy", "enterprise pricing".`,
        required: true,
      },
      {
        name: 'existing_categorization',
        description: `How content is currently grouped or labeled, if at all.`,
        example: `Currently split across a top-level 'Billing' menu and a separate 'Enterprise' section maintained by a different team.`,
        required: false,
      },
      {
        name: 'site_type_audience',
        description: `What kind of site/product this is and who its primary audience is.`,
        example: `A help center for a B2B SaaS product, primarily accessed by account admins troubleshooting billing issues.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `information-architecture`,
      `sitemap`,
      `content-strategy`,
      `site-search`,
      `ux-research`,
    ],
    whyItWorks: `Requiring content to be matched against real search terms rather than sorted by topic in the abstract prevents the model's default behavior when asked to "organize this content": grouping by surface-level semantic similarity (all billing-sounding pages together), which produces a tidy-looking structure that can still bury the actual highest-demand page under a generic category label a user would never guess to click. The three-way classification (matched, orphaned, gap) matters because a model asked simply to build a sitemap will place every input item somewhere without ever flagging that some of it may not deserve a place at all, since silently organizing everything it's given feels more complete than questioning the inventory's contents — naming orphaned content explicitly is what actually surfaces the pruning opportunity a content audit exists to find. The merge-by-frequency-not-by-seniority rule targets a specific bias: when two similar items are found, a model will often default to keeping the one that reads as more "official" or complete rather than the one that matches the language users actually type, which quietly perpetuates internal jargon in the final IA. Requiring user-language category names instead of internal department names addresses the single most common real-world IA failure — organizations restructure content around how it's produced (which team owns "Enterprise") rather than how it's searched for, and a model mirroring EXISTING_CATEGORIZATION without being told to check it against search language will reproduce that same mistake rather than fix it.`,
    exampleOutput: `Cancel Subscription -> matched to "how do I cancel my subscription" -> keep as standalone top-level item under Billing. Plans & Billing FAQ and How Billing Cycles Work -> overlapping content, merge under "Billing Cycles & Payments" since that phrasing better matches "change billing date". Enterprise Pricing -> matched, but currently siloed in a separate section maintained by another team -> recommend surfacing it under the same top-level Billing category users actually search within, not a separate Enterprise menu.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-feature-prioritization-matrix-for-roadmap',
    category: 'ui-design',
    title: `Force a real feature-prioritization call instead of a roadmap where everything is 'high priority'`,
    description: `Scores a list of candidate features against effort, impact, and confidence, and produces a ranked shortlist with the trade-offs stated plainly — built to stop a roadmap conversation from ending in a tie.`,
    promptText: `CANDIDATE FEATURES
{{candidate_features}}

BUSINESS GOAL THIS QUARTER
{{business_goal}}

KNOWN EFFORT ESTIMATES (if any)
{{effort_estimates}}

EVIDENCE BEHIND EACH FEATURE'S EXPECTED IMPACT
{{impact_evidence}}

TEAM CAPACITY
{{team_capacity}}

For each feature in CANDIDATE_FEATURES, assign three scores on a 1-5 scale: Impact (tied specifically to BUSINESS_GOAL, not impact-in-general — a feature can be broadly useful and still score low here if it doesn't serve this quarter's specific goal), Effort (using EFFORT_ESTIMATES where given; where absent, state your estimate is a rough guess and flag it as needing real estimation before being relied on), and Confidence (how strong the evidence behind the impact claim actually is — a feature justified by one anecdotal customer request scores lower here than one backed by usage data or multiple independent requests, and you must state what IMPACT_EVIDENCE actually consists of for each feature, not just assert a confidence number).

Compute a priority signal from these three scores, but do not let the arithmetic alone decide — after ranking, sanity-check the top of the list against TEAM_CAPACITY and flag if the highest-scoring set of features would collectively exceed what the team can realistically ship this quarter, since a ranked list that ignores capacity is not a roadmap, it's a wish list. Where two features score near-identically, do not present them as tied; force a tiebreaker by naming the one additional factor (strategic sequencing, a dependency between them, an external commitment already made) that would actually decide between them in practice.

WHAT NOT TO DO
Do not inflate every feature's impact score to justify including it — if a feature genuinely doesn't serve BUSINESS_GOAL this quarter, its low score should be visible even if it's a good feature in general; a prioritization exercise that scores everything 4 or 5 has failed at its one job. Do not average the three scores into a single number without also showing them separately — leadership needs to see whether something ranked highly because it's truly high-impact or because it's merely low-effort.

OUTPUT FORMAT
1. Table: feature | impact score + one-line reason | effort score + basis | confidence score + evidence basis | resulting rank.
2. The ranked shortlist that fits within TEAM_CAPACITY, explicitly separated from the features that scored well but don't fit this quarter.
3. Any forced tiebreaker calls, with the deciding factor named.
4. One paragraph naming the feature most likely to be over- or under-rated by this exercise and why, so a human reviewer knows where to apply judgment.`,
    variables: [
      {
        name: 'candidate_features',
        description: `The list of features under consideration for the roadmap.`,
        example: `Bulk CSV export, in-app notifications, SSO login, dark mode, custom report builder, Slack integration.`,
        required: true,
      },
      {
        name: 'business_goal',
        description: `The specific goal this quarter's roadmap is meant to serve.`,
        example: `Reduce enterprise-tier churn, which exit interviews cite security/compliance gaps as a factor in.`,
        required: true,
      },
      {
        name: 'effort_estimates',
        description: `Any known engineering effort estimates, if they exist.`,
        example: `SSO login: ~3 weeks (two engineers); dark mode: ~1 week; custom report builder: ~6+ weeks, high uncertainty.`,
        required: false,
      },
      {
        name: 'impact_evidence',
        description: `What actually backs up the expected impact of each feature — data, requests, or a guess.`,
        example: `SSO login requested explicitly by 4 of the last 6 churned enterprise accounts; dark mode requested informally by a handful of individual users on Twitter with no revenue link.`,
        required: true,
      },
      {
        name: 'team_capacity',
        description: `What the team can realistically ship this quarter.`,
        example: `Two backend engineers and one designer, roughly 10 engineer-weeks of net new capacity after maintenance work.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `feature-prioritization`,
      `product-roadmap`,
      `prioritization-framework`,
      `product-strategy`,
      `impact-effort`,
    ],
    whyItWorks: `Tying the impact score specifically to a named business goal rather than asking for impact in general terms is what stops the exercise from collapsing into everything-is-important, which is the default failure mode when a model is asked to prioritize a features list without a fixed target — every feature on a real candidate list has some plausible story for why it matters generally, and only anchoring against one specific quarterly goal forces genuinely different scores across the list instead of a cluster of 4s. Requiring the confidence score to state what evidence it's actually based on, rather than asserting a number, closes a gap models otherwise exploit: it's easy to assign a confident-sounding score to a feature backed by a single anecdote, and forcing the evidence to be named alongside the number lets a human reviewer catch when "confidence: 4" is actually resting on one enthusiastic Slack message. Requiring a capacity sanity-check after the ranking, rather than trusting the arithmetic alone, addresses a structural limitation of any weighted-scoring approach: a ranked list is not automatically a feasible plan, and a model that stops at producing scores will hand back a wish list dressed up as a roadmap unless explicitly told to check the top of that list against what the team can actually build. Forcing a named tiebreaker instead of allowing ties matters because a real roadmap decision has to pick an order, and a model permitted to present two features as equally ranked is quietly pushing the actual decision back onto the human without having done the analytical work it was asked for.`,
    exampleOutput: `SSO login: Impact 5 (directly named by 4 of 6 churned enterprise accounts, matches this quarter's churn-reduction goal), Effort 3 (3 weeks, two engineers), Confidence 4 (multiple independent account requests, not anecdotal) -> rank 1, fits capacity. Dark mode: Impact 1 (no link to churn goal), Effort 4 (low effort), Confidence 2 (informal social requests only) -> ranks low despite ease of build; flagged as the feature most likely to get pushed up the list on 'quick win' instinct despite weak evidence.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-design-handoff-dev-ready-spec',
    category: 'ui-design',
    title: `Write a design handoff spec that survives contact with an engineer who wasn't in the design reviews`,
    description: `Converts a finished design into a developer-ready spec covering states, spacing, responsive behavior, and edge cases explicitly — the details that get silently skipped when handoff is just a Figma link.`,
    promptText: `DESIGN BEING HANDED OFF
{{design_summary}}

COMPONENT STATES THAT EXIST
{{component_states}}

DESIGN SYSTEM TOKENS AVAILABLE
{{design_tokens}}

KNOWN EDGE CASES OR UNUSUAL CONTENT
{{edge_cases}}

ENGINEER'S CONTEXT LEVEL
{{engineer_context}}

Write the handoff spec assuming the engineer implementing this was not in any of the design discussions and cannot ask you a clarifying question in real time — every ambiguity has to be resolved in the document itself. For each item in COMPONENT_STATES (default, hover, focus, disabled, loading, error, empty, if applicable), specify exactly what changes visually and behaviorally — do not leave a state as "same as default" without confirming that's actually intended rather than simply undesigned. Reference DESIGN_TOKENS by name for every spacing, color, and typography value rather than describing them visually ("a bit of padding", "the usual blue") — a spec that isn't traceable to actual token names forces the engineer to eyeball values from a screenshot, which is exactly what a spec exists to prevent.

For EDGE_CASES specifically (very long text, zero items, a value at the maximum the field allows, an unusually small or large image), state what should happen, since these are the cases most likely to have been designed for the happy path only and never explicitly resolved — if you genuinely don't know the answer for a given edge case, say so explicitly and flag it as an open question for the designer rather than inventing a plausible-sounding answer that could quietly become the de facto spec if the engineer just codes what's written.

Describe responsive behavior as explicit breakpoint rules (what happens at each named breakpoint), not a vague "should adapt for mobile" — if the source design only shows one viewport, say so and flag every other viewport's behavior as undefined rather than implying it was designed when it wasn't. Calibrate the level of explanation to ENGINEER_CONTEXT — do not over-explain design-system fundamentals to someone who works in this codebase daily, but do not assume shared context with someone new to the project or an outside contractor.

WHAT NOT TO DO
Do not describe the static default state in exhaustive detail while waving at other states with "styled consistently with the rest of the app" — that phrase is where handoff specs actually fail, because "consistent" is not a value an engineer can implement without guessing. Do not invent an edge-case behavior that wasn't actually decided; flagging an open question is a better outcome than a wrong guess.

OUTPUT FORMAT
1. Component states table: state | visual changes | token references | behavioral notes.
2. Edge cases table: case | resolved behavior or 'open question — needs designer input'.
3. Responsive behavior by breakpoint, or explicit note on what's undefined.
4. A short list of every open question flagged, pulled together in one place so nothing gets missed in the body of the spec.`,
    variables: [
      {
        name: 'design_summary',
        description: `What the design is and what it's for, briefly.`,
        example: `A multi-select dropdown filter component used across three list views in the app.`,
        required: true,
      },
      {
        name: 'component_states',
        description: `The states this component has, as designed.`,
        example: `Default (closed), open/focused, an option hovered, an option selected (shows a chip), disabled, no options available.`,
        required: true,
      },
      {
        name: 'design_tokens',
        description: `The actual design-system token names available to reference.`,
        example: `spacing-sm (8px), spacing-md (16px), color-border-default, color-border-focus, color-bg-disabled, text-body-sm.`,
        required: true,
      },
      {
        name: 'edge_cases',
        description: `Known unusual content scenarios that might not have been explicitly designed for.`,
        example: `A filter option label 40+ characters long; zero options available; all options selected at once (10+ chips).`,
        required: true,
      },
      {
        name: 'engineer_context',
        description: `How familiar the implementing engineer is with this codebase and design system.`,
        example: `A contractor brought on for two weeks who has never worked in this codebase before.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `design-handoff`,
      `dev-ready-spec`,
      `design-systems`,
      `design-engineering-collab`,
      `component-states`,
    ],
    whyItWorks: `Explicitly requiring every non-default state to be resolved rather than left as "same as default" targets the most common real handoff failure, which isn't a missing measurement — it's an unstated assumption that a state was intentionally left unstyled when it was actually just never designed, and a model asked generically to "write a spec" will describe the default state in loving detail while gliding past hover/error/empty states with vague reassurance, because those are exactly the states least represented in whatever mockup or summary it was given to work from. Requiring token names instead of visual descriptions forces traceability that closes the gap where a spec technically exists but an engineer still has to eyeball a screenshot for the actual pixel value — this is a known failure mode of design handoff broadly, and a model not explicitly told to reference tokens will default to descriptive language ("a bit of padding", "the usual blue") because that's how humans naturally describe designs conversationally, even though it fails as an implementable spec. The instruction to flag genuine unknowns as open questions rather than inventing plausible answers is the single most load-bearing rule here, because models under-instructed on this point will confidently fill an edge-case gap with a reasonable-sounding guess, and that guess silently becomes the shipped behavior the moment an engineer without access to the original designer codes exactly what the document says — flagging uncertainty explicitly is what keeps a fabricated answer from masquerading as a decision. Calibrating explanation depth to engineer context prevents two different failure directions: over-explaining wastes a familiar engineer's time and buries the actual decisions in filler, while under-explaining to an unfamiliar contractor assumes context that was never actually shared.`,
    exampleOutput: `State: no options available -> visual: dropdown shows text-body-sm gray message 'No matching filters' inside the closed control, spacing-sm padding, no chip row. State: all options selected (10+ chips) -> flagged as open question — no maximum chip-wrap behavior was specified in the source design; recommend the designer confirm whether chips wrap to a second row or collapse into a '+7 more' summary chip before implementation begins.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-responsive-breakpoint-behavior-spec',
    category: 'ui-design',
    title: `Specify what a layout actually does between breakpoints, not just at three fixed screen widths`,
    description: `Documents responsive behavior across the full width range a layout will actually be viewed at, including the in-between and edge widths a simple mobile/tablet/desktop spec usually leaves undefined.`,
    promptText: `LAYOUT / COMPONENT
{{layout_description}}

DESIGNED BREAKPOINTS AND WIDTHS
{{designed_breakpoints}}

CONTENT THAT VARIES IN LENGTH
{{variable_content}}

MINIMUM AND MAXIMUM SUPPORTED WIDTH
{{width_range}}

For each named breakpoint in DESIGNED_BREAKPOINTS, specify: column count/grid structure, what elements reflow, stack, or hide, and the exact spacing/type-scale token used at that width. Then, critically, specify what happens in the width ranges BETWEEN the named breakpoints — real viewports land on every width, not just the three or four exact pixel values usually shown in a design file, and a spec that only covers the named breakpoints leaves the actual majority of real-world widths (everything in between) implicitly undefined. State whether the layout should hold its current breakpoint's structure until the next one triggers (a step function) or should scale/reflow continuously between breakpoints, and be explicit about which elements do which — some things (a fixed-width sidebar) plausibly hold steady while others (a text column) plausibly reflow continuously, and treating the whole layout as one uniform behavior is usually wrong.

For VARIABLE_CONTENT specifically, specify what happens when content is unusually long or short at each breakpoint, since breakpoint specs are almost always built and tested against one representative piece of sample content and silently assume every other case behaves the same way. At WIDTH_RANGE's absolute minimum and maximum, state explicitly what's guaranteed to still work — do not let the spec imply infinite scalability in either direction; every layout has a width below which it breaks and a width above which the design intent stops making sense (e.g., a reading-width text column that shouldn't stretch edge-to-edge on an ultrawide monitor even though nothing technically prevents it).

WHAT NOT TO DO
Do not describe responsive behavior only at the named breakpoints and leave the transitions between them to be "handled by the framework" — that phrase is where most real responsive bugs live, since flexbox/grid defaults rarely match actual design intent without explicit rules. Do not treat all breakpoints as equally important if MINIMUM_AND_MAXIMUM_SUPPORTED_WIDTH or real traffic data suggests one range gets far more real-world use than another.

OUTPUT FORMAT
1. Table per named breakpoint: width | grid/column structure | elements that change | tokens used.
2. Between-breakpoint behavior: step function vs. continuous, stated per element type.
3. Variable-content behavior at each breakpoint (truncation, wrapping, or scroll — named explicitly, not left implicit).
4. Minimum and maximum width guarantees, and what's explicitly out of scope beyond them.`,
    variables: [
      {
        name: 'layout_description',
        description: `The layout or component whose responsive behavior needs specifying.`,
        example: `A two-column article page: main content column plus a sticky related-articles sidebar.`,
        required: true,
      },
      {
        name: 'designed_breakpoints',
        description: `The specific breakpoints already designed, with their widths.`,
        example: `Mobile (< 480px, single column, sidebar moves below content); tablet (480-1024px, single column, sidebar as horizontal strip); desktop (> 1024px, two-column with sticky sidebar).`,
        required: true,
      },
      {
        name: 'variable_content',
        description: `Content in this layout that varies significantly in length or size between instances.`,
        example: `Article headline can be one line or wrap to three; sidebar can show 2 to 15 related articles depending on the piece.`,
        required: true,
      },
      {
        name: 'width_range',
        description: `The actual minimum and maximum widths this layout must be guaranteed to support.`,
        example: `Minimum 320px (smallest supported phone), maximum unconstrained on desktop, but design intent assumes a max reading-column width regardless of monitor size.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `responsive-design`,
      `breakpoints`,
      `design-spec`,
      `css-layout`,
      `design-handoff`,
    ],
    whyItWorks: `Explicitly asking what happens between the named breakpoints, not just at them, corrects for the most common gap in responsive specs: a design file naturally only ever shows discrete artboards at fixed widths, so a model asked to "write the responsive spec" from that source material will describe those exact widths thoroughly and implicitly treat everything else as smoothly interpolated, when in reality most real device widths fall in the gaps and the actual behavior there depends entirely on which CSS layout technique is used underneath — a detail the source design never captures. Forcing a per-element step-function-vs-continuous distinction rather than one blanket answer for the whole layout addresses a specific over-simplification: different elements in the same layout very often need genuinely different transition behavior (a sidebar that snaps between two fixed states versus body text that should reflow continuously), and a model given room to answer at the whole-layout level will pick one behavior and apply it everywhere, silently getting some elements wrong. The variable-content instruction matters because breakpoint specs are built and visually checked against one sample of content, and asking what happens with genuinely long or short content forces the model to reason about a case the source design never actually showed, rather than quietly assuming the one example content length is representative. The explicit min/max guarantee section stops the model from implying infinite scalability, which is a subtle default failure — without a stated upper bound, output tends to describe "desktop" behavior as if it holds indefinitely as width increases, when real design intent almost always caps a reading column or content width well before an ultrawide monitor's actual pixel count.`,
    exampleOutput: `Between 480px and 1024px (tablet range): sidebar as horizontal strip is treated as a step function, not a continuous scale-down of the desktop sidebar — it fully restructures at the 480px boundary rather than gradually narrowing. Main text column reflows continuously across the same range. Variable content: sidebar with only 2 related articles at desktop width still reserves the full sidebar column rather than collapsing narrower, to avoid a layout that visibly shifts width based on content count. Maximum width: text column caps at 720px regardless of monitor width; sidebar and surrounding whitespace absorb any width beyond that.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-competitor-ux-teardown-for-specific-flow',
    category: 'ui-design',
    title: `Tear down a competitor's UX for one specific flow, not their whole product`,
    description: `Compares your product against named competitors on a single, specific user flow, producing concrete differences that explain a metric gap rather than a broad, unfocused 'what they do better' review.`,
    promptText: `OUR PRODUCT AND FLOW BEING COMPARED
{{our_flow}}

COMPETITORS TO ANALYZE
{{competitors}}

WHY THIS COMPARISON MATTERS RIGHT NOW
{{comparison_reason}}

WHAT WE ALREADY SUSPECT IS WEAKER
{{suspected_weakness}}

Scope this analysis to OUR_FLOW specifically and the equivalent flow in each competitor from COMPETITORS — do not expand into a general "how does their whole product compare to ours" review, which produces a report too broad to act on. For each competitor, walk their equivalent flow step by step the same way you'd audit your own product, noting at each step what's structurally different (fewer steps, different information order, a decision deferred to later versus asked upfront) rather than surface-level visual opinions ("theirs looks cleaner") that don't translate into an actionable change.

For SUSPECTED_WEAKNESS, check specifically whether the competitors actually address it differently or whether the suspicion doesn't hold up under a real side-by-side comparison — do not simply confirm the suspicion because it was suggested; if a competitor's flow has the same weakness or a different one entirely, say so plainly rather than finding evidence to fit the assumption.

After the step-by-step comparison, identify patterns that repeat across more than one competitor (if two or more independently made the same structural choice, that's a stronger signal than one competitor's one-off choice) versus a single competitor's idiosyncratic approach that may not generalize as a lesson. Tie every recommendation back to COMPARISON_REASON — a difference is only worth acting on if it plausibly affects the specific metric or problem that motivated this comparison in the first place, not every difference that exists.

WHAT NOT TO DO
Do not produce a feature-checklist comparison table ("they have X, we don't") as the primary output — that format flattens structural UX differences into presence/absence checkboxes and misses the actual reason a flow performs differently. Do not recommend copying a competitor's approach wholesale without checking whether the surrounding context (their user base, their business model, constraints they operate under) actually transfers to our product.

OUTPUT FORMAT
1. Step-by-step comparison table: step in our flow | equivalent step per competitor | structural difference noted.
2. Whether SUSPECTED_WEAKNESS held up, partially held up, or didn't hold up, with the specific evidence.
3. Patterns that repeat across 2+ competitors vs. single-competitor idiosyncrasies.
4. Two to three recommendations, each explicitly tied back to COMPARISON_REASON, with a one-line note on what context might not transfer from the competitor to us.`,
    variables: [
      {
        name: 'our_flow',
        description: `Our product and the specific flow being compared, described step by step.`,
        example: `Our new-user trial signup flow: email -> password -> company name -> plan selection -> credit card -> confirmation.`,
        required: true,
      },
      {
        name: 'competitors',
        description: `The named competitors whose equivalent flow will be analyzed.`,
        example: `Competitor A (direct competitor, similar pricing) and Competitor B (larger enterprise player, different market segment but often mentioned by prospects).`,
        required: true,
      },
      {
        name: 'comparison_reason',
        description: `The actual business reason this comparison is being done now.`,
        example: `Trial-to-paid conversion has dropped 8% over two quarters and we suspect the signup flow itself, not the product, is the cause.`,
        required: true,
      },
      {
        name: 'suspected_weakness',
        description: `What you already suspect might be the problem, to be checked rather than assumed.`,
        example: `We suspect asking for a credit card before the trial starts is costing us conversions that competitors avoid by not requiring it upfront.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `competitive-analysis`,
      `ux-research`,
      `conversion-optimization`,
      `signup-flow`,
      `product-strategy`,
    ],
    whyItWorks: `Scoping the analysis to one named flow rather than "the competitor's product" prevents the default shape a broader prompt produces — a wide-ranging, feature-by-feature comparison that reads as thorough but has no single actionable thread running through it, because a model given room to compare whole products will treat every difference as equally worth mentioning rather than concentrating on the one flow that actually matters to the business question at hand. Requiring the suspected weakness to be genuinely checked rather than confirmed by default counters a specific and common drift: when a prompt states an assumption ("we suspect the credit-card step is the problem"), a model without an explicit instruction to test rather than validate it will tend to find supporting evidence for the stated hypothesis, because agreeing with a stated premise reads as more helpful and coherent than contradicting the user's own framing — an instruction to say plainly if the suspicion doesn't hold up is what keeps the analysis honest rather than confirmatory. Distinguishing a pattern that repeats across multiple competitors from a single competitor's idiosyncratic choice matters because not every observed difference is a lesson — a change that only one competitor happens to have made could easily be a mistake or an artifact of their specific business model rather than a validated best practice, and treating every observation as equally instructive is how competitive analyses end up recommending changes that don't actually transfer. The explicit warning against copying an approach without checking whether surrounding context transfers addresses the single most common way competitive UX recommendations fail in practice: a structural choice that works for a company with a different user base, sales motion, or price point can make a real product worse if adopted without that context, and a model isn't naturally inclined to flag that mismatch unless told to check for it.`,
    exampleOutput: `Suspected weakness check: partially held up. Competitor A does defer credit-card entry to end of a 14-day trial (matches the suspicion); Competitor B still asks for a card upfront but only after showing a personalized setup step first, suggesting the actual lever may be sequencing/perceived value rather than the card requirement itself. Pattern across both competitors: both defer plan selection until after the user has seen the product working with their own data, which our flow asks for before any product interaction — flagged as the stronger, repeated signal worth acting on first.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-conversion-focused-landing-page-ux-review',
    category: 'ui-design',
    title: `Review a landing page's UX against the one conversion decision it's actually asking a visitor to make`,
    description: `Reviews a landing page's layout, copy hierarchy, and CTA placement against a single named conversion goal, flagging every element competing with that one decision instead of a generic visual critique.`,
    promptText: `LANDING PAGE CONTENT AND LAYOUT (describe section by section, top to bottom)
{{page_sections}}

SINGLE CONVERSION GOAL
{{conversion_goal}}

VISITOR CONTEXT (how they arrived, what they already know)
{{visitor_context}}

CURRENT CONVERSION RATE OR KNOWN ISSUE
{{current_performance}}

Name the one decision CONVERSION_GOAL is actually asking a visitor to make, then go through PAGE_SECTIONS top to bottom and, for each section, judge whether it moves the visitor toward that specific decision, is necessary supporting context the decision genuinely depends on, or is competing with it — a second CTA, a distracting link that leads away from the page, or content that would be valuable on a different page but only delays this one's actual ask. Be specific about competition: a navigation menu that lets a first-time visitor wander to five other pages before ever reaching the CTA is a form of competition even though nothing about it looks like a rival call-to-action.

Check whether the page's information order matches VISITOR_CONTEXT — a visitor arriving cold from a broad ad needs context this page may be skipping straight past into a hard ask, while a visitor arriving from a specific, already-informed source (an email to existing customers, a search for the exact product name) is being made to wade through context they don't need before reaching the CTA, which reads as friction rather than persuasion for that specific audience. If CURRENT_PERFORMANCE names a known issue or number, prioritize whichever section-level finding most plausibly explains it over items that are technically true but less consequential.

Evaluate the CTA itself: is its label a specific, low-ambiguity commitment ("Start your 14-day trial") or a vague action ("Learn more", "Get started") that doesn't tell the visitor what happens on click; is there exactly one primary CTA repeated at logical points down the page, or multiple different asks competing for the same click.

WHAT NOT TO DO
Do not produce a generic visual-design critique (color contrast, font pairing, spacing) unless a specific instance of it is actually interfering with the one named decision — this is a conversion-focused review, not a general design audit. Do not recommend adding more content or reassurance sections as a default fix; more sections between the visitor and the decision is itself often the problem, not the solution.

OUTPUT FORMAT
1. The one decision this page is asking for, stated in one sentence.
2. Section-by-section table: section | verdict (advances / necessary context / competes) | reasoning.
3. Visitor-context fit: is the information order right for how VISITOR_CONTEXT actually arrives.
4. CTA evaluation: label clarity, count/placement, one specific recommended change.
5. If CURRENT_PERFORMANCE names an issue, the single finding above that most plausibly explains it.`,
    variables: [
      {
        name: 'page_sections',
        description: `The landing page's actual content, described section by section from top to bottom.`,
        example: `Hero with headline + CTA -> logo bar of customer names -> three-feature grid -> customer testimonial -> pricing table -> FAQ accordion -> footer CTA repeat.`,
        required: true,
      },
      {
        name: 'conversion_goal',
        description: `The single, specific action this page exists to drive.`,
        example: `Get the visitor to start a free 14-day trial by entering their email.`,
        required: true,
      },
      {
        name: 'visitor_context',
        description: `How visitors actually arrive at this page and what they already know.`,
        example: `80% arrive from a paid search ad for a generic category term, meaning most have never heard of this specific product before landing.`,
        required: true,
      },
      {
        name: 'current_performance',
        description: `The known conversion rate or specific problem being investigated, if any.`,
        example: `Conversion rate is 1.2%, well below the 3-4% this category typically sees for a similar offer.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `conversion-ux`,
      `landing-page-review`,
      `cta-optimization`,
      `growth-design`,
      `ux-audit`,
    ],
    whyItWorks: `Naming the single decision the page is asking for before reviewing anything else prevents the model's default posture toward landing-page reviews, which is a general aesthetic and best-practices critique (contrast, whitespace, font choices) — that's the most heavily represented pattern in generic "review this landing page" material it has seen, and it produces a report full of true but low-leverage observations unless the review is explicitly anchored to what the page is actually trying to get someone to do. Framing internal navigation and unrelated content as forms of competition with the CTA, not just a second visible call-to-action, catches a real and common miss — a model asked generically to check for "competing CTAs" will look for a second button, but a nav bar that lets a first-time cold visitor click away to four other pages is functionally the same failure even though it doesn't look like a rival ask, and it takes an explicit instruction to get the model to name that as competition rather than treating navigation as structurally exempt from the analysis. Checking information order against how the visitor actually arrives (cold ad traffic versus a warm, already-informed visitor) targets a mismatch that's invisible if you only look at the page in isolation — the same page can be correctly sequenced for one traffic source and badly sequenced for another, and a model reviewing the page without being told who's actually looking at it will judge the sequencing against an assumed generic visitor rather than the real one. The explicit ban on defaulting to "add more reassurance content" as a fix matters because that's the single most common generic landing-page recommendation, and it's frequently wrong for a conversion problem, since more sections between the visitor and the ask is itself often the mechanism suppressing conversion, not a fix for it.`,
    exampleOutput: `The one decision: whether to hand over an email address to start a 14-day trial. FAQ accordion section: verdict — competes; for cold ad traffic with no prior product context, an FAQ this early reads as a reason to hesitate rather than reassurance, and it sits above the pricing table a warm, cold visitor hasn't earned context for yet. CTA evaluation: 'Get started' used in hero and footer is ambiguous about what happens next; recommend 'Start your 14-day trial' to make the actual commitment explicit and reduce the anxiety of an unstated next step for a visitor who has never heard of the product before this page.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ui-design-visual-qa-regression-checklist-before-release',
    category: 'ui-design',
    title: `Build a design QA checklist specific to what actually broke last time, not a generic pixel-perfect checklist`,
    description: `Produces a targeted visual and interaction QA checklist for a specific release, weighted toward the components most likely to regress based on what actually changed and what has broken before.`,
    promptText: `WHAT CHANGED IN THIS RELEASE
{{release_changes}}

COMPONENTS OR SCREENS TOUCHED
{{touched_components}}

WHAT HAS BROKEN IN PAST RELEASES (regression history)
{{regression_history}}

DEVICES/BROWSERS THAT MATTER MOST FOR THIS PRODUCT
{{device_priority}}

Build a QA checklist weighted specifically toward what RELEASE_CHANGES actually touched and what REGRESSION_HISTORY shows has broken before — do not produce a generic full-app pixel-perfect checklist that treats every screen as equally at risk, since a shared component change (a button style, a shared layout wrapper, a design token value) has ripple effects across screens that were never directly edited in this release, and those indirect blast-radius screens deserve specific checklist items even though they don't appear in TOUCHED_COMPONENTS. For each item in RELEASE_CHANGES, name the specific screens or components that could be indirectly affected through shared components or tokens, not just the ones directly edited.

For each item in REGRESSION_HISTORY, write a checklist item that specifically re-tests that exact past failure at the current state of DEVICE_PRIORITY, rather than a generic "check for regressions" — a regression that happened once in a specific component under specific conditions is more likely to recur under the same conditions than a random new part of the app is to fail for the first time, and QA time is better spent verifying known fragile points than uniformly re-checking everything.

Write each checklist item as a specific, checkable pass/fail statement ("the dropdown's focus ring is visible against the dark-mode background at 1x and 2x zoom") rather than a vague reminder ("check dropdown looks okay") — a checklist item that isn't falsifiable doesn't actually get executed consistently, it gets glanced at and marked done. Order the checklist by risk, with items tied to direct changes and known regression history first, and lower-risk general items last, so a QA pass that runs out of time still covers the highest-value checks first.

WHAT NOT TO DO
Do not produce an undifferentiated checklist covering every screen in the app equally regardless of what actually changed — that wastes QA time on low-risk areas and, by trying to cover everything, often results in less actual scrutiny of the areas that matter most. Do not write checklist items as reminders to "look carefully" without a specific, checkable condition attached.

OUTPUT FORMAT
1. Directly changed items: checklist item | why it's at risk | device/browser to check on.
2. Indirect blast-radius items: affected screen | shared component/token causing the risk | checklist item.
3. Regression-history re-checks: past failure | specific re-test | device/browser.
4. The full checklist ordered by risk, highest first.`,
    variables: [
      {
        name: 'release_changes',
        description: `What actually changed in this specific release, in design/frontend terms.`,
        example: `Updated the shared Button component's border-radius token and hover state; redesigned the checkout summary card.`,
        required: true,
      },
      {
        name: 'touched_components',
        description: `The specific screens or components directly edited for this release.`,
        example: `Checkout summary card, primary Button component (used app-wide).`,
        required: true,
      },
      {
        name: 'regression_history',
        description: `Specific things that have broken in past releases, ideally more than once.`,
        example: `Focus ring visibility on dark-mode backgrounds has broken twice before after button/token changes; mobile Safari has previously mis-rendered sticky footer CTAs after CSS changes.`,
        required: true,
      },
      {
        name: 'device_priority',
        description: `The devices and browsers that matter most for this product's actual user base.`,
        example: `iOS Safari and Chrome on Android are the top two by traffic share; desktop Chrome and Safari next; Firefox is under 2% of traffic.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `design-qa`,
      `visual-regression`,
      `release-checklist`,
      `frontend-testing`,
      `design-systems`,
    ],
    whyItWorks: `Weighting the checklist toward what actually changed rather than producing a full-app pixel-perfect list corrects for the default shape a generic QA-checklist prompt produces — an exhaustive, evenly-distributed list that looks thorough but spreads limited QA time evenly across low-risk and high-risk areas alike, when in a real release the risk is heavily concentrated in what changed and what's shared with it. Requiring the blast-radius step — explicitly naming screens affected indirectly through a shared component or token, not just the screens directly edited — targets a specific and common release-QA gap: a shared Button-component change is technically a one-line diff in one file, but its actual risk surface spans every screen using that component, and a model asked simply to "list what to check" based on the edited files will miss everything not directly touched, since that's the literal scope of the input unless explicitly told to reason about shared dependencies. Turning regression history into specific re-tests of the exact prior failure, rather than a generic "watch for regressions" reminder, reflects a real pattern in software defects: the same component tends to break the same way again under the same conditions (a focus-ring contrast issue recurring after subsequent token changes), so re-testing the exact prior failure is a better use of QA time than treating every past incident as fully resolved and moving on. Requiring each item to be a falsifiable pass/fail statement rather than a vague reminder addresses the practical reason checklists fail in real teams — an item like "check dropdown looks okay" gets a quick glance and a checkmark under release-day time pressure, while a specific, checkable condition is much harder to mark done without actually having looked.`,
    exampleOutput: `Regression re-check: 'Focus ring visibility on dark-mode backgrounds has broken twice before after button changes' -> specific re-test: verify the primary Button's focus ring maintains a 3:1 contrast ratio against the dark-mode checkout background specifically, on iOS Safari and desktop Chrome, since prior regressions occurred after border-radius/token changes exactly like this release's. Blast-radius item: the app-wide Button token change affects the pricing page's upgrade CTA, which wasn't directly edited this release but shares the same component — added as a specific checklist item despite not appearing in TOUCHED_COMPONENTS.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
