import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'email-marketing-newsletter-recurring-issue-without-filler',
    category: 'email-marketing',
    title: `Draft a recurring newsletter issue that doesn't pad out a thin week with filler`,
    description: `Turns a messy list of this week's updates into a structured newsletter issue with a real lead story, honest section-skipping when there's nothing worth saying, and a subject line that matches what's actually inside.`,
    promptText: `You are drafting this week's issue of a recurring newsletter I send on a fixed schedule, using the raw updates I give you below rather than inventing content to fill out the usual sections.

NEWSLETTER PURPOSE AND AUDIENCE
{{newsletter_purpose}}

RAW UPDATES FOR THIS ISSUE
{{raw_updates}}

RECURRING SECTION STRUCTURE
{{section_structure}}

VOICE TO MATCH
{{voice_sample}}

RULES FOR THIS ISSUE
Read the raw updates first and decide which one is genuinely the lead story based on what would matter most to the audience described above, not just whichever item I listed first. If a recurring section in the structure has nothing worth including this week, say so explicitly and cut it rather than stretching a minor update to fill the space or inventing a generic tip to plug the gap — an issue with four sections and one real story reads better than five padded ones. Write in the voice sample's actual sentence rhythm and vocabulary, not a generic newsletter voice — if the sample is short and clipped, do not write in long marketing sentences. Every section needs one specific, concrete detail (a number, a name, a date) pulled from the raw updates; if a raw update is vague, flag it back to me as needing a specific detail rather than writing around the vagueness with confident-sounding filler. Write three subject line options that each describe what's actually inside this specific issue, not a generic teaser that would fit any issue you could send.

WHAT NOT TO DO
Do not add a closing inspirational line, a generic "stay tuned" sign-off, or a recap of what past issues covered unless the voice sample shows that's normally part of the format. Do not soften or hedge any specific number or claim from the raw updates.

OUTPUT FORMAT
1. Three subject line options.
2. The full issue body in the recurring section structure, with any cut section named and the one-line reason it was cut.
3. A list of any raw update that was too vague to state as a concrete detail, with the specific question I'd need to answer to fix it.`,
    variables: [
      {
        name: 'newsletter_purpose',
        description: `What this newsletter is for and who reads it.`,
        example: `Weekly product update for our 4,200 beta users — they read it to decide whether to log back in this week.`,
        required: true,
      },
      {
        name: 'raw_updates',
        description: `Unstructured bullet points or notes about what happened this week.`,
        example: `- shipped bulk export (been requested since March)
- fixed the timezone bug in scheduling
- nothing new on mobile app, still in review with Apple
- support response time crept up to 14hrs, working on it`,
        required: true,
      },
      {
        name: 'section_structure',
        description: `The recurring sections this newsletter normally has.`,
        example: `Lead story, Shipped this week, Known issues, One thing we're working on, Community shoutout.`,
        required: true,
      },
      {
        name: 'voice_sample',
        description: `A short excerpt of a past issue showing the actual tone and sentence style to match.`,
        example: `"Bulk export shipped. You asked, we built it, here's how to use it in under a minute."`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`newsletter`, `email-copywriting`, `content-planning`, `editorial-voice`, `subject-lines`],
    whyItWorks: `GPT-5.1 defaults to filling every named slot in a structure you give it, because a recurring template reads as an implicit demand for completeness — without an explicit instruction to cut a section, it will manufacture plausible-sounding content for "Community shoutout" or "One thing we're working on" even when your raw updates contain nothing for that slot, which is exactly how newsletters drift into feeling padded and interchangeable week over week. Naming the lead-story decision as a judgment call based on audience relevance, rather than defaulting to list order, matters because the model otherwise treats the first bullet you typed as the most important one by position alone, which is an accident of how you happened to jot notes down, not a reflection of what the audience cares about. Requiring one concrete detail per section closes GPT-5.1's tendency to smooth a vague input into confident, general-sounding prose — when a raw update is thin, the model's fluency will paper over that thinness with generic phrasing unless it's told that flagging the gap back to you is the correct move, not writing around it. The voice-sample matching works because without a concrete style anchor, GPT-5.1 reverts to a mid-register, slightly promotional newsletter voice that is recognizable across thousands of AI-drafted newsletters; pointing it at your own actual sentence rhythm forces it to pattern-match against your specific cadence instead of its own default. Finally, tying subject lines to what's actually inside this issue rather than a generic teaser formula prevents the common failure where the subject line could be reused verbatim on any week's issue, which is a sign it was generated from the newsletter's category rather than its content.`,
    exampleOutput: `Subject line options: "Bulk export is live (you asked in March)" / "This week: exports, a timezone fix, and a support update" / "Shipped: the export feature you've been waiting on". Lead story: Bulk export ships... Cut section: Community shoutout — no submissions came in this week, cutting rather than reusing an old one.`,
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
    slug: 'email-marketing-welcome-series-first-90-days-sequence',
    category: 'email-marketing',
    title: `Build a welcome series that earns the right to sell instead of pitching in email one`,
    description: `Plans a multi-email welcome sequence around what a new subscriber or customer actually needs to succeed first, sequencing the ask so it lands after value has been delivered, not before.`,
    promptText: `You are planning a welcome email series for people who just signed up or purchased, sequenced across the first days of their experience with us.

WHAT SOMEONE JUST SIGNED UP FOR
{{signup_context}}

NUMBER OF EMAILS AND SEND WINDOW
{{sequence_length}}

BIGGEST EARLY DROP-OFF POINT
{{drop_off_point}}

THE EVENTUAL ASK
{{eventual_ask}}

PLANNING PHASE
First, map out what a new subscriber actually needs to know or do to get their first real win, in the order they'd need it — before writing any copy, list this as a numbered sequence of jobs-to-be-done, not marketing beats. Identify which email in the sequence is positioned right before or right after the drop-off point named above, since that's the email doing the most load-bearing work in the whole series, and flag it as such.

DRAFTING PHASE
For each email in the sequence, write a subject line and full body copy. The first email should not mention the eventual ask at all — its only job is orienting someone who just arrived and doesn't yet trust us. Only introduce the eventual ask once at least one earlier email has already delivered a concrete piece of value the reader could act on without paying for anything further; state explicitly which earlier email earned that right before the ask appears. Every email needs exactly one call to action, not a menu of three links competing for attention. Write short, skimmable body copy assuming most recipients read on a phone and decide whether to keep reading within the first two lines.

WHAT NOT TO DO
Do not open any email in the series with "Welcome to the family" or an equivalent stock phrase. Do not repeat the same call to action in back-to-back emails — if someone didn't click yesterday's link, the next email should either address why or offer a different next step, not just resend the same ask.

OUTPUT FORMAT
1. The jobs-to-be-done map, in order, with the load-bearing email flagged.
2. Each email as: send timing, subject line, body copy, single CTA.
3. One line stating which email first earns the right to make the eventual ask, and what it earned that right with.`,
    variables: [
      {
        name: 'signup_context',
        description: `What action triggered this welcome series.`,
        example: `Signed up for a free 14-day trial of a project management tool, hasn't invited teammates or created a project yet.`,
        required: true,
      },
      {
        name: 'sequence_length',
        description: `How many emails, over what span of time.`,
        example: `5 emails over the 14-day trial window.`,
        required: true,
      },
      {
        name: 'drop_off_point',
        description: `Where most people currently disengage or churn in this early period.`,
        example: `About 60% never create a second project after the first one — most churn happens around day 4.`,
        required: true,
      },
      {
        name: 'eventual_ask',
        description: `What you eventually want the reader to do — usually the paid conversion moment.`,
        example: `Upgrade to a paid seat before the trial ends on day 14.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`welcome-series`, `onboarding-email`, `lifecycle-marketing`, `email-sequence`, `customer-activation`],
    whyItWorks: `Separating the planning phase from the drafting phase forces GPT-5.1 to commit to a jobs-to-be-done map before it starts generating persuasive copy, which matters because the model's default behavior when asked directly for "welcome emails" is to reach for a generic five-email arc — welcome, feature highlight, social proof, urgency, discount — regardless of what the actual new user needs to do first; making it plan the sequence of real jobs first, in a separate step it has to commit to in writing, anchors the later copy to your actual product's activation path instead of a template it has seen thousands of times in training data. Flagging the drop-off point as load-bearing changes what the model optimizes for in that specific email — without that instruction it treats every email in the sequence with roughly equal weight, when in reality one email is doing the real work of preventing the churn you actually measured. The rule against mentioning the eventual ask in email one addresses GPT-5.1's tendency to front-load a call to action because it was told there's an eventual ask at all — language models weight information given anywhere in a prompt as relevant to the immediate output unless explicitly told to withhold it until a condition (delivering value first) has been met in the sequence itself. Banning repeated identical CTAs in consecutive emails counters a specific failure mode where the model treats "remind them again" as sufficient sequencing logic, rather than treating an unclicked link as a signal that the previous ask's framing didn't land and needs to change, not just repeat.`,
    exampleOutput: `Email 1 (Day 0): "Here's what your first project should look like" — orientation only, no ask. Email 3 (Day 4, flagged as load-bearing, sits right at the drop-off point): "The teams that stick around all did this one thing by day 4" — invites creating a second project, still no upgrade ask. Email 5 (Day 12): first mention of upgrading, framed against the two wins already delivered.`,
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
    slug: 'email-marketing-nurture-sequence-stalled-lead-reengagement',
    category: 'email-marketing',
    title: `Write a nurture sequence for leads who went quiet, without escalating to a hard pitch by email three`,
    description: `Builds a multi-touch nurture sequence for leads who stopped responding after initial interest, keeping each email genuinely useful on its own so the sequence doesn't read as a slow-motion sales pitch.`,
    promptText: `You are writing a nurture email sequence for leads who showed real interest at some point but have gone quiet — not cold outbound, and not a re-engagement campaign for people who never responded at all.

WHERE THE LEAD STALLED
{{stall_point}}

WHAT WE KNOW ABOUT THEM
{{lead_context}}

SEQUENCE LENGTH AND CADENCE
{{sequence_cadence}}

WHAT SUCCESS LOOKS LIKE
{{success_definition}}

For each email in the sequence, decide what specific, standalone value it offers someone who never replies to any of them — a genuinely new piece of information, a relevant example, or a direct answer to the likely reason they stalled — and write that value first, with the ask for a reply or meeting reduced to a single low-effort line at the end, never the center of the email. As the sequence progresses, each email should acknowledge, briefly and without guilt-tripping, that they haven't responded to the previous ones, then immediately move past it into new value rather than dwelling on the silence. Vary the specific reason offered for reaching out again across emails so the sequence doesn't read as the same pitch resent three times with a different subject line — if you can't identify a genuinely different reason for a given email, say so instead of inventing one that reads as filler. The final email in the sequence should be a genuine break-up email that closes the loop honestly — state plainly that this is the last email on this topic, offer one easy way back in, and mean it; do not write a break-up email that's secretly still trying to extend the sequence.

WHAT NOT TO DO
Do not use urgency or scarcity language anywhere in the sequence — these leads have already shown they don't respond to pressure, and adding it now reads as a strategy shift they'll notice. Do not apologize repeatedly for "following up again" in every email; say it once, briefly, in the email where it's most relevant, not as a reflexive opener every time.

OUTPUT FORMAT
For each email: send timing relative to the last email, subject line, body copy, the single specific reason this email exists that's distinct from the others. Close with the break-up email clearly labeled as such.`,
    variables: [
      {
        name: 'stall_point',
        description: `Where in the relationship the lead went quiet.`,
        example: `Had one discovery call, seemed genuinely interested in the reporting feature, then stopped replying to emails after we sent pricing.`,
        required: true,
      },
      {
        name: 'lead_context',
        description: `What you actually know about this lead's situation or need.`,
        example: `Mid-size logistics company, mentioned they're currently stitching together three spreadsheets for weekly reporting.`,
        required: true,
      },
      {
        name: 'sequence_cadence',
        description: `How many emails and how far apart.`,
        example: `4 emails, roughly one every 8-10 days.`,
        required: true,
      },
      {
        name: 'success_definition',
        description: `What counts as this sequence working.`,
        example: `A reply of any kind — even "not now" — that lets us close the loop instead of leaving them in limbo indefinitely.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`nurture-sequence`, `lead-reengagement`, `b2b-email`, `sales-follow-up`, `email-cadence`],
    whyItWorks: `GPT-5.1 tends to treat a stated business goal (getting a reply, closing a deal) as the organizing principle of everything it writes toward that goal, which is why nurture sequences generated without explicit constraints escalate in pushiness by the third email even when told to be soft-touch — the model reads persistence as helpfulness toward your stated objective. Requiring standalone value before the ask, in that order, structurally limits how much of each email can be pitch, because the model has to produce something substantive first and is then instructed to keep the ask to a single low-effort line, which prevents the gradual reversion toward a harder sell that happens when the value and the ask are left to blend together across a sequence. Naming a distinct reason for each email and requiring the model to admit when it can't find one addresses a specific pattern-completion failure: without that check, GPT-5.1 will generate four emails that differ in surface wording but repeat the same underlying pitch, because it's pattern-matching to "nurture sequence" as a genre with a known shape rather than reasoning about whether this specific lead actually has four distinct reasons to hear from you again. The break-up email instruction — that it must be honestly final, not a hidden sequence extension — counters the model's tendency to hedge every closing statement, since GPT-5.1 will otherwise soften "this is my last email" with language that keeps the door ajar in a way that undermines the whole point of a genuine break-up email, which only works as a re-engagement tactic if the recipient believes it's actually final.`,
    exampleOutput: `Email 2 (Day 10): leads with a short case study from a similar-sized logistics client who consolidated three spreadsheets into one weekly report, one line acknowledging the pricing email went unanswered, ends with "happy to send the template we built for them if useful — no need to reply otherwise."`,
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
    slug: 'email-marketing-abandoned-cart-sequence-real-objection',
    category: 'email-marketing',
    title: `Write an abandoned cart sequence that addresses the actual reason people didn't check out`,
    description: `Builds a short abandoned cart recovery sequence keyed to the real, specific objection or friction point behind the abandonment instead of defaulting straight to a discount code.`,
    promptText: `You are writing an abandoned cart recovery sequence for people who added items and left without completing checkout.

WHAT'S IN THE CART
{{cart_contents}}

MOST LIKELY REASON FOR ABANDONING
{{likely_objection}}

DISCOUNT POLICY
{{discount_policy}}

NUMBER OF EMAILS
{{email_count}}

Start by addressing the likely objection directly in the first email — if the reason is shipping cost, show shipping cost or a way around it; if it's hesitation about fit or sizing, address that specifically; if it's simple distraction, a plain reminder with the cart contents is enough and doesn't need an objection-handling angle bolted on. Do not introduce a discount in the first email unless the discount policy explicitly says every cart gets one immediately — check the discount policy before writing anything and follow exactly what it allows for each email's position in the sequence, since training a customer that abandoning always produces a discount by email one creates a habit that costs money on every future cart regardless of whether they intended to buy anyway. Show the actual cart contents (item names, and if given, images or prices) in every email — a recovery email that makes someone remember what they were buying works differently from one that only gestures at "the items in your cart." If the sequence includes more than one email, each later email should either address a different possible objection than the one before it, or escalate the offer only exactly as far as the discount policy permits — never invent a discount tier the policy didn't authorize.

WHAT NOT TO DO
Do not use countdown-timer urgency language ("only 2 left," "price goes up in 24 hours") unless that's factually true and stated in the cart contents or policy — do not fabricate scarcity.

OUTPUT FORMAT
For each email: send timing after abandonment, subject line, body copy referencing actual cart contents, and which specific objection (or none) it's addressing. State explicitly which discount, if any, appears in which email and confirm it matches the stated policy.`,
    variables: [
      {
        name: 'cart_contents',
        description: `What's actually in the abandoned cart.`,
        example: `One pair of running shoes, size 10, $89, plus a $12 pair of insoles added afterward.`,
        required: true,
      },
      {
        name: 'likely_objection',
        description: `Your best read on why this type of cart usually gets abandoned.`,
        example: `Checkout shows $14 flat shipping that isn't visible on the product page, which we suspect causes sticker shock at the final step.`,
        required: true,
      },
      {
        name: 'discount_policy',
        description: `Exactly what discounts are and aren't authorized at each stage.`,
        example: `No discount in email 1. Email 2 (24hrs later) may offer free shipping only. Email 3 (72hrs later) may offer 10% off, one-time use.`,
        required: true,
      },
      {
        name: 'email_count',
        description: `How many emails in the sequence.`,
        example: `3 emails over 4 days.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`abandoned-cart`, `ecommerce-email`, `cart-recovery`, `discount-strategy`, `objection-handling`],
    whyItWorks: `GPT-5.1's training data for abandoned cart emails is dominated by examples that lead with a discount, because that's the most common pattern across public ecommerce email templates — left unconstrained, the model reaches for "here's 10% off to come back" as the default opener even when no discount policy has been given, simply because that's the statistically dominant shape of the genre it's pattern-matching against. Forcing it to check the discount policy before writing anything, and explicitly forbidding invented discount tiers, closes that gap by making policy compliance a precondition of drafting rather than something checked after the fact, when the model has already anchored on a discount-first structure that's harder to walk back cleanly. Keying the first email to the specific stated objection rather than a generic reminder matters because a real abandonment reason (visible shipping cost, sizing doubt, simple distraction) calls for a genuinely different first move, and GPT-5.1 defaults to a one-size-fits-all "you left something in your cart!" template unless it's given a specific mechanism of abandonment to write against — showing shipping cost transparently is a structurally different email than reassuring about sizing, and collapsing both into the same template wastes the one email most likely to still catch someone before they've fully moved on. Requiring actual cart contents in every email, not a vague gesture at "your items," counters the model's tendency to write generically reusable copy that could apply to any cart, which is measurably less effective at prompting the specific memory of what someone was about to buy. The scarcity-fabrication ban addresses a compliance-relevant failure mode: GPT-5.1 will readily generate "only 2 left" language as a stock urgency device unless told plainly that it must be factually grounded in what was actually provided.`,
    exampleOutput: `Email 1 (2hrs): "Your size 10s are still here" — shows shoes + insoles with images, no discount, no urgency, just a clear "complete your order" link plus a one-line note that shipping is a flat $14, addressing the objection directly.`,
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
    slug: 'email-marketing-launch-email-real-differentiator-not-hype',
    category: 'email-marketing',
    title: `Write a product launch email that leads with what's actually new, not generic launch-day hype`,
    description: `Drafts a launch announcement email built around the one specific thing that changed for the reader, avoiding stock launch-day phrasing that could describe almost any product release.`,
    promptText: `You are writing the primary launch announcement email for something we're releasing today.

WHAT'S LAUNCHING
{{launch_details}}

WHO THIS EMAIL GOES TO
{{recipient_segment}}

THE SPECIFIC PROBLEM THIS SOLVES FOR THEM
{{problem_solved}}

WHAT'S NOT INCLUDED (LIMITATIONS)
{{known_limitations}}

Before writing the email, state in one sentence what a recipient in this segment could not do yesterday that they can do today because of this launch — if you can't state that concretely from the launch details given, ask me for the missing specific rather than writing a vaguer version of the email around the gap. Lead the email with that one sentence, or a sharper rewrite of it, rather than opening with "We're excited to announce" or any equivalent stock opener — the reader should understand what changed for them inside the first line, not after a paragraph of preamble. Mention the known limitations plainly, in one short line, rather than omitting them — a launch email that oversells by silence creates support tickets and trust erosion the moment someone hits the limitation themselves; frame the limitation factually, not apologetically. Write toward the recipient segment specifically named above, not a generic "valued customer" — if the segment has a distinguishing trait (existing users of a specific feature, people who previously asked for this exact thing, a specific plan tier), the email should read differently than it would to a segment without that trait.

WHAT NOT TO DO
Do not use superlatives ("game-changing," "revolutionary," "the future of X") anywhere in the copy. Do not include more than one call to action — a launch email exists to drive one action, typically try it or read more, not multiple competing links.

OUTPUT FORMAT
1. The one-sentence "what changed" statement, or the specific question needed if it can't be stated concretely.
2. Subject line.
3. Full email body.
4. The limitation line as it appears in the email, isolated for review.`,
    variables: [
      {
        name: 'launch_details',
        description: `What's actually launching and its core mechanics.`,
        example: `Real-time collaborative editing in the reporting tool — up to 5 people can edit the same report simultaneously, changes sync in under a second.`,
        required: true,
      },
      {
        name: 'recipient_segment',
        description: `Who specifically this email is going to.`,
        example: `Users on the Team plan who have created at least 3 reports in the last 60 days — the people who'd actually feel this pain.`,
        required: true,
      },
      {
        name: 'problem_solved',
        description: `The specific friction this launch removes.`,
        example: `Previously only one person could edit a report at a time, so teams were emailing screenshots back and forth to coordinate changes.`,
        required: true,
      },
      {
        name: 'known_limitations',
        description: `What the launch does not yet do, stated plainly.`,
        example: `Doesn't support offline editing yet — all collaborators need an active connection.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`product-launch`, `launch-email`, `email-copywriting`, `feature-announcement`, `saas-marketing`],
    whyItWorks: `GPT-5.1's default register for "write a launch email" pulls heavily from a training-data cluster of generic SaaS launch copy — "We're thrilled to announce," "game-changing," "the wait is over" — because that phrasing appears across thousands of real launch emails regardless of what actually launched, making it the model's path of least resistance unless explicitly blocked. Forcing the one-sentence "what changed yesterday versus today" statement as a mandatory first step, with permission to ask for a missing specific rather than writing around the gap, prevents the model from doing what it does by default when given thin launch details: smoothing an underspecified feature description into confident, generic excitement that describes the launch category rather than this specific launch. That one sentence, required to lead the email, structurally displaces the stock opener because there's no room left for both. Requiring the known limitation to appear plainly, not hedged or omitted, counters GPT-5.1's tendency toward maximally positive framing in promotional copy — left to its own judgment about tone, the model treats omitting a limitation as consistent with an upbeat launch voice, when in practice silently omitting it just moves the disappointment to the moment a customer discovers the gap themselves, at a worse time than in the announcement. Naming the recipient segment's distinguishing trait and requiring the copy to reflect it addresses the model's default fallback to "valued customer" framing whenever a segment is named generically — the specific trait (existing feature usage, prior request) is exactly the detail that makes a launch email read as relevant rather than mass-blasted, and GPT-5.1 will not surface that distinction on its own unless told the trait exists and must show up in the copy.`,
    exampleOutput: `What changed: "Teams on this plan can now edit the same report together in real time instead of emailing screenshots back and forth." Subject: "No more screenshot-emailing your report edits". Limitation line: "Heads up — this needs an active connection for now; offline editing isn't supported yet."`,
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
    slug: 'email-marketing-promo-email-discount-without-margin-guesswork',
    category: 'email-marketing',
    title: `Write a promo email that fits an exact discount and margin constraint instead of guessing at urgency`,
    description: `Builds a single promotional email around a specific discount, expiry, and margin ceiling you supply, keeping the urgency and offer framing strictly inside what the business can actually afford.`,
    promptText: `You are writing one promotional email for a time-bound offer.

THE OFFER
{{offer_details}}

WHY THIS OFFER, RIGHT NOW
{{offer_rationale}}

MARGIN OR STOCK CONSTRAINT
{{margin_constraint}}

AUDIENCE FOR THIS SEND
{{audience_segment}}

First check whether the offer rationale given actually justifies the offer being promoted — a real reason (seasonal inventory clearing, a genuine short-term partnership, an actual stock constraint) reads differently in copy than an offer with no real reason behind it beyond wanting to drive short-term revenue; if no real rationale was given, write the email using honest, neutral framing ("a limited-time discount on X") rather than inventing a justification that isn't true. Respect the margin or stock constraint exactly as stated — if it says the discount can't be extended or stacked with other offers, state that plainly in the email itself so a reader doesn't email support asking whether it stacks; if stock is genuinely limited, say the real constraint rather than a vaguer "while supplies last" if a more specific number or fact was given. Match the offer's urgency language to how much time is actually left — a 48-hour offer can carry real urgency language, a two-week offer should not be written with the same tightened, breathless pacing as one closing tonight. Write for the specific audience segment named, referencing what's true about them if it's relevant (existing customers vs. new, past purchasers of a related item), rather than a generic "you" that could be anyone on the list.

WHAT NOT TO DO
Do not fabricate a countdown, a claimed number of people who've already redeemed it, or any social-proof statistic that wasn't given to you. Do not stack more than one urgency device (countdown plus scarcity plus "last chance" plus exclusivity) in a single email — pick the one that's actually true and real, and let it carry the email rather than piling on unverified ones.

OUTPUT FORMAT
1. Subject line.
2. Full email body.
3. One line confirming the constraint (margin, stacking, stock) is stated accurately in the copy, or noting where you need me to confirm a number before send.`,
    variables: [
      {
        name: 'offer_details',
        description: `The exact offer — discount amount, what it applies to, and expiry.`,
        example: `20% off all outdoor gear, code CAMP20, valid through Sunday 11:59pm, cannot be combined with other codes.`,
        required: true,
      },
      {
        name: 'offer_rationale',
        description: `The actual business reason for this offer, if there is one.`,
        example: `Clearing end-of-season tent inventory before the new line arrives next month.`,
        required: false,
      },
      {
        name: 'margin_constraint',
        description: `Any real limitation on how the discount can be applied.`,
        example: `Cannot stack with the loyalty program's existing 10% member discount — one or the other, not both.`,
        required: true,
      },
      {
        name: 'audience_segment',
        description: `Who specifically is receiving this send.`,
        example: `Customers who bought a tent or sleeping bag in the last 12 months but haven't purchased since.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`promo-email`, `discount-email`, `email-copywriting`, `urgency-messaging`, `ecommerce-marketing`],
    whyItWorks: `GPT-5.1 treats a promotional email prompt as license to reach for its full default toolkit of urgency devices — countdown framing, implied scarcity, social-proof numbers — because those are the dominant surface features of promotional copy in its training distribution, and the model has no independent way to know which of those devices are actually true for your offer unless told explicitly which ones are and aren't. The instruction to check whether the stated rationale actually justifies the offer, and to fall back to neutral framing when it doesn't, matters because the model will otherwise happily manufacture a plausible-sounding reason ("we're so excited to offer you this deal") that reads as marketing filler with no real justification behind it, which is a distinct problem from lying about numbers but still degrades trust the same way generic hype does. Matching urgency intensity to actual time remaining directly counters a specific miscalibration: GPT-5.1's default promotional register is uniformly urgent regardless of whether the deal closes in six hours or two weeks, because "promo email" as a genre pulls toward maximum urgency by default rather than urgency proportional to the real deadline, and only an explicit instruction to calibrate against the stated expiry corrects that. The ban on fabricated countdowns and redemption counts addresses a compliance-relevant failure mode — GPT-5.1 will generate a specific-sounding number ("127 people have already claimed this") as a stock social-proof device even with no such number provided, because specific numbers read as more persuasive than vague ones and the model optimizes toward persuasiveness unless explicitly blocked from inventing the specificity itself. Requiring the margin/stacking constraint to be stated plainly in the copy also does real operational work: it's the difference between an email that generates support tickets from confused customers and one that heads the question off before it's asked.`,
    exampleOutput: `Subject: "20% off outdoor gear through Sunday". Body opens: "You picked up a tent from us this year — here's 20% off anything in outdoor gear through Sunday at midnight (code CAMP20). Note: this can't be combined with your loyalty discount, so it's one or the other, whichever saves you more."`,
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
