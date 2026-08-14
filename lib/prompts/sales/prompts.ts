import type { Prompt } from '../types'

/**
 * Sales & Outreach (Tier 2) — the 1:1 selling conversation and pipeline-
 * movement layer, deliberately distinct from two neighboring categories:
 * `ads` (paid marketing, campaign copy, UTM/attribution) and `business-ops`
 * (proposals-from-scratch, invoicing, client onboarding for services
 * businesses). Every prompt here assumes an actual deal, prospect, or
 * account in motion — cold outreach across email/phone/LinkedIn/video,
 * MEDDIC-based discovery and multi-threading, objection handling and
 * negotiation, mutual action plans, proposal and demo tailoring, champion
 * and CFO enablement, deal-risk scoring and forecast hygiene, renewal/
 * upsell/QBR conversations, competitor battle cards, CRM note structuring,
 * lost-deal post-mortems, and the sales-to-CS handoff at close.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'sales-cold-email-single-trigger-signal',
    category: 'sales',
    title:
      "Turn one verified research signal into a cold email that doesn't read like a mail-merge",
    description:
      'Builds a cold-outreach email around exactly one verifiable trigger event with a specific banned-opener list, three genuinely different relevance angles, and an honest read on whether the signal was strong enough to use.',
    promptText: `You are drafting a cold outreach email for a B2B sales rep. The entire email is built around ONE verified, specific signal about the prospect or their company — never a generic compliment, never a guess dressed up as research, and never a fact so broadly true of the segment that it could apply to any of a hundred companies.

PROSPECT
{{prospect_name}}, {{prospect_title}} at {{company_name}}

VERIFIED TRIGGER SIGNAL
{{trigger_signal}}

WHAT WE SELL
{{product_or_service}}

WHY THE TRIGGER CONNECTS TO A PROBLEM WE SOLVE
{{relevance_link}}

DESIRED NEXT STEP
{{cta}}

STRUCTURE — four moves, each one sentence unless noted
1. OBSERVATION — reference {{trigger_signal}} specifically enough that the recipient could not mistake this for a mass send. If the sentence would still make sense with the name and company swapped out, it is not specific enough — rewrite it until it wouldn't.
2. RELEVANCE BRIDGE — connect the observation to a problem {{company_name}} likely has right now, using {{relevance_link}}. Do not pitch in this sentence.
3. VALUE, ONE LINE — name what we do, framed as the answer to the problem just named, not a feature list and not a tagline.
4. ASK — {{cta}}, phrased as a low-friction yes/no question a busy person could answer from their phone, never "let me know if you're interested" or "happy to share more whenever works."

BANNED PATTERNS
Do not write "I noticed you're the {{prospect_title}} at {{company_name}}" or any variant of it — a job title lookup is not a signal, it is a mail-merge field wearing a signal's clothes. Do not write "I hope this email finds you well," "I wanted to reach out," "just following up" framing, or use an em dash anywhere in the body. No more than one question mark in the entire email.

LENGTH AND FORMAT
Under 90 words total, plain text, no bullet points, no bold, five lines maximum counting greeting and signoff. Write a subject line separately, under six words, that hints at the trigger without giving away the entire pitch — a subject that reads like the opener of a real note, not a campaign headline.

VARIANTS
Write three variants that differ in the RELEVANCE BRIDGE specifically — three genuinely different reasons the trigger matters to this buyer, not the same reasoning restated with synonyms swapped in. If you can only find one real angle, say so instead of manufacturing two weak ones just to hit the count.

HONESTY CHECK
After the three variants, state plainly whether {{trigger_signal}} is strong enough to carry a personalized email, or too generic or stale to use as the anchor — a signal that's true of most companies in the segment, or one that's more than roughly 60 days old, should be flagged as weak even though it technically fits the format above.`,
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
        example:
          'Posted on LinkedIn eight days ago about opening a third regional warehouse',
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
          'A third warehouse usually means route planning that worked for two locations starts breaking down almost immediately',
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
      'email-copy',
    ],
    whyItWorks:
      'Naming and banning the exact generic opener — "I noticed you\'re the {{prospect_title}} at {{company_name}}" — is the load-bearing move, because that precise sentence pattern is what makes mail-merge personalization instantly recognizable to anyone who has received more than a handful of cold emails, and most prompts asking a model to "personalize" an email never rule it out by name, so the model reaches for it as its default safe move. The self-check embedded in step one — would this sentence still make sense with the name and company swapped out — gives the model a concrete falsifiable test for specificity instead of a vague instruction to "be specific," which models otherwise satisfy by inserting the company name into an otherwise generic sentence and calling that personalization. Capping the email at 90 words and forcing three variants that differ specifically in the relevance bridge, not the phrasing around it, stops two separate failure modes at once: a model padding the email with filler to sound more thorough, and a model generating three drafts that make the identical argument in different words and presenting that as meaningful variation. The closing instruction to call out a weak trigger signal — and specifically to flag a signal older than roughly 60 days or one true of most companies in the segment — matters because a model asked only to write the email will personalize convincingly around almost any signal it is handed, confident tone included, which is exactly how forced personalization built on a thin signal ends up reading worse to the recipient than an honest, ungimmicked email would have. There is also a compounding cost this prompt is designed to catch before it happens: a rep who sends five emails built on stale or generic signals and gets zero replies will often conclude that personalization itself doesn\'t work for their list, when the real lesson was that the specific signals chosen weren\'t good enough to justify the personalization technique — the honesty check exists to separate those two conclusions before the rep burns through the list.',
    exampleOutput:
      'Priya — saw your post about the third warehouse going live next month. Most route-planning setups that work fine for two sites start falling apart once a third hub enters the mix, drivers end up covering overlapping zones nobody planned for. We built routing software specifically for that multi-warehouse handoff. Worth 15 minutes next week, or is this not the right time?',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-21' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-cold-call-opener-and-voicemail-drop',
    category: 'sales',
    title: 'Pair a cold-call opener with a voicemail drop that earns a callback',
    description:
      'Writes a 20-second phone opener built to survive the first ten seconds before a hang-up, plus a matching voicemail for when the call goes unanswered, with the pattern-interrupt line and the objection it is meant to preempt made explicit.',
    promptText: `You are writing a cold-call opening script and a matching voicemail drop for a B2B sales rep calling {{prospect_name}}, {{prospect_title}} at {{company_name}}. Most cold calls are decided in the first ten seconds — before the prospect has consciously decided anything, they've already decided whether this is a pitch to escape or a person worth another ten seconds. Write for that reality.

CONTEXT FOR THE CALL
{{trigger_or_reason}}

WHAT WE SELL
{{product_or_service}}

OBJECTION TO PREEMPT
{{objection_to_preempt}}

DESIRED NEXT STEP
{{cta}}

LIVE-CALL OPENER
Write the opener as a sequence of short, speakable lines, not a paragraph — nothing longer than about 12 words per line, because a sentence too long to say in one breath is a sentence that will get interrupted. Structure: (1) a permission-based, non-scripted-sounding greeting that names the reason for the call inside the first breath, not after a warm-up; (2) a one-line acknowledgment that this is an unscheduled call, since pretending otherwise reads as evasive the instant the prospect notices; (3) a pattern-interrupt line built from {{trigger_or_reason}} specific enough that a generic telemarketer script could not have produced it; (4) a direct, low-stakes ask for permission to continue for 30 seconds, framed as a genuine question the prospect can say no to, not a rhetorical one. If {{objection_to_preempt}} names something the prospect is likely to say in the first ten seconds — "we already have a vendor for this," "not the right person," "no budget this year" — write one line that addresses it before it's raised, without sounding defensive about an objection nobody has voiced yet.

VOICEMAIL DROP
Write a separate voicemail, under 20 seconds when read aloud at a normal conversational pace — that's roughly 45 to 55 words including the callback request. State your name and company once, not twice. Reference {{trigger_or_reason}} in one sentence, the same anchor as the live opener, since a voicemail that sounds like a different call than the one they might have half-heard about creates confusion, not curiosity. State {{cta}} as a specific, low-friction ask, and give a callback number spoken at a deliberately slower pace than the rest of the message, since a number said at normal speaking speed is the single most common reason a prospect who wants to call back can't.

WHAT NOT TO DO
No "how are you today" as an opener — it signals script before a single real word has been said. No apologizing for the interruption; an apology invites the prospect to agree that this is, in fact, an unwelcome interruption. No stacking more than one question in the live opener before pausing to actually let them answer.

OUTPUT FORMAT
1. The live-call opener, line by line, with a word count per line.
2. The voicemail script, with its total word count and estimated read-aloud duration.
3. One sentence naming which specific moment in the opener is most likely to get a hang-up, and why the pattern-interrupt line is built to survive it.`,
    variables: [
      {
        name: 'prospect_name',
        description: 'Who you are calling',
        example: 'Daniel Osei',
        required: true,
      },
      {
        name: 'prospect_title',
        description: "The prospect's job title",
        example: 'Head of IT Infrastructure',
        required: true,
      },
      {
        name: 'company_name',
        description: 'Their company',
        example: 'Merrow Health Systems',
        required: true,
      },
      {
        name: 'trigger_or_reason',
        description: 'The specific, real reason for this call right now',
        example:
          'Their company posted a job listing last week for a "Cloud Migration Lead," suggesting an infrastructure overhaul is starting',
        required: true,
      },
      {
        name: 'product_or_service',
        description: 'What you sell, in plain terms',
        example: 'a managed cloud-cost monitoring platform for healthcare IT teams',
        required: true,
      },
      {
        name: 'objection_to_preempt',
        description: 'The specific pushback most likely in the first ten seconds',
        example: '"We already have a vendor for cost monitoring"',
        required: false,
      },
      {
        name: 'cta',
        description: 'What you want by the end of the call or voicemail',
        example: 'A 10-minute call next Tuesday or Wednesday afternoon',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gong'],
    tags: [
      'cold-call',
      'voicemail',
      'phone-prospecting',
      'outbound',
      'b2b-sales',
      'sales-scripts',
    ],
    whyItWorks:
      "Structuring the opener as short, speakable lines rather than a written paragraph respects a real constraint of live speech that a paragraph-style script actively works against: a sentence long enough to require a mid-sentence breath is a sentence with a natural interruption point, and a prospect looking for a reason to hang up will use exactly that pause, so keeping every line short enough to say in one breath removes the easiest excuse to cut the call short before the actual ask is even reached. Naming a specific pattern-interrupt line tied to a real trigger, rather than a generic warm-up, targets the documented psychology of cold-call reception: prospects pattern-match an unfamiliar caller's first few words against every telemarketing call they've ever received, and a script that sounds like every other script gets sorted into that bucket and dismissed before the actual value proposition is heard, regardless of how good that value proposition is. Acknowledging the call is unscheduled, rather than pretending otherwise, is a deliberate transparency move that removes a specific objection before it can be raised — a prospect who notices they're being handled without an admission of the obvious becomes more guarded, not less, and naming it plainly signals a rep confident enough not to need the pretense. The voicemail's slow-callback-number instruction targets a genuinely common and easily overlooked failure: a phone number spoken at the same pace as the rest of a fluent, rehearsed message is frequently impossible to write down accurately on a first listen, meaning a voicemail that otherwise did everything right can still fail purely on delivery mechanics, and a rep who never notices this keeps blaming voicemail response rates on message content when the actual bottleneck was never legible. Requiring the same trigger anchor in both the live opener and the voicemail, rather than two disconnected messages, closes a subtler gap: a prospect who receives a call, misses it, and then hears an unrelated voicemail has no way to connect the two into one coherent outreach attempt, which quietly doubles the cognitive load of deciding whether to call back at all.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-23' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-24' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Claude (Sonnet 4.5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'sales-linkedin-two-touch-prospecting',
    category: 'sales',
    title: 'Write a LinkedIn outreach message that earns a reply before you ever pitch',
    description:
      "Builds a two-touch LinkedIn sequence — a connection note under the platform's 300-character limit and a value-first follow-up sent after acceptance — anchored to a specific profile signal instead of a recycled connection request.",
    promptText: `I want to reach out to {{prospect_name}}, {{prospect_title}} at {{company_name}}, on LinkedIn. Here's what's actually on their profile or recent activity: {{profile_signal}}. What we do: {{product_or_service}}. The reason I think this is relevant to them specifically: {{relevance_reason}}. My own relevant background or reason for reaching out: {{sender_context}}.

Write two messages, built to be sent days apart, not back to back.

1. CONNECTION NOTE — hard cap 300 characters, LinkedIn's platform limit for connection request notes, referencing {{profile_signal}} specifically, with zero pitch anywhere in it. This message has exactly one job: be worth accepting. If you cannot reference {{profile_signal}} specifically within the character limit without cutting it down to something generic, say so rather than quietly writing a note that only technically mentions it.

2. FIRST MESSAGE AFTER THEY ACCEPT — written as a separate follow-up sent after the connection is accepted, not immediately, and never in the same breath as the connection request itself. Lead with something genuinely useful, interesting, or specific tied to {{relevance_reason}} — an observation, a question, a resource — before any mention of {{product_or_service}}. If {{sender_context}} gives a real reason for the outreach beyond selling something, use it here; a rep with a genuine shared context has more room to be direct than one with none. If you cannot avoid the message feeling like a pitch given what's actually available, say so explicitly instead of forcing one in just to satisfy the structure.

TONE
Write both messages like a peer who did their homework, not a rep working a list. Ban "I came across your profile and was impressed by your experience" and any close variant of it — that exact phrase, or something functionally identical to it, appears in more automated LinkedIn outreach than any other single line, and it signals templated outreach within the first few words regardless of how personalized the rest of the message is. Ban exclamation points in both messages; enthusiasm punctuation reads as sales voice on a platform where the best-performing outreach reads like it was typed by a person, not scheduled by a sequence tool.

LENGTH
Connection note: one to two sentences, hard character cap as stated. Follow-up message: no more than four sentences, since a long first message after connecting reads as presumptuous before any real rapport exists.

CLOSING HONESTY CHECK
After both messages, state plainly whether {{profile_signal}} is specific enough to justify the personalization used, or generic enough that a reader would recognize this as a templated message with a name swapped in — a signal like "works in your industry" or "has an impressive career" should be flagged as too weak to carry either message, even if the messages themselves read smoothly.`,
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
      {
        name: 'sender_context',
        description:
          'Any real, non-pitchy reason you have for reaching out, if one exists',
        example: 'we both spoke at the same regional RevOps meetup last spring',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'LinkedIn Sales Navigator'],
    tags: ['linkedin', 'social-selling', 'prospecting', 'outbound', 'b2b-sales'],
    whyItWorks:
      'LinkedIn actually enforces a 300-character limit on connection request notes at the platform level, so writing to that constraint from the first draft avoids producing a note that reads well in isolation and then gets silently truncated mid-sentence the moment it\'s actually sent — a failure a rep often doesn\'t notice until a prospect replies confused about a sentence that never finished. Splitting the outreach into two touches instead of pitching inside the connection request itself reflects a real, widely observed behavior pattern on the platform: a connection note that asks for something beyond the connection itself measurably lowers accept rates, because it reframes an easy, low-stakes yes into a request with strings attached before any relationship exists to justify the ask. Explicitly banning "I came across your profile and was impressed by your experience" targets the single most recognizable line in automated LinkedIn outreach — it has become a tell in the same way "Dear Sir or Madam" is a tell for a mass mailing, and a model left to write generic personalization gravitates toward it by default because it technically applies to any profile without requiring any actual reading of it. The instruction to use sender_context when a genuine shared connection exists — a shared event, a mutual contact, overlapping work — matters because that kind of context licenses a level of directness that pure profile-based personalization cannot; conflating the two produces messages that either overclaim a relationship that doesn\'t exist or underuse one that does. The closing honesty check exists because profile-based personalization is uniquely easy to fake convincingly: a model can write two fluent, specific-sounding messages around a signal that is actually generic — "has an impressive career," "works in tech" — and the fluency of the writing gives no signal at all about whether the underlying anchor could support it, which is exactly the gap a rep needs flagged before hitting send on a message that will read as templated to the one person best positioned to notice.',
    exampleOutput:
      'Connection note (187 characters): "Anjali — your comment about RevOps teams drowning in spreadsheet reconciliation hit close to home, that\'s the exact problem we spend our days on. Would love to connect."',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-personalized-video-outreach-script',
    category: 'sales',
    title:
      'Script a personalized video outreach message that survives the first three seconds',
    description:
      'Writes a talk-track for a short Loom or Vidyard-style prospecting video, structured around what has to happen before the viewer decides to close the tab, with the on-screen visual cue named for every line.',
    promptText: `You are writing the spoken talk-track for a short, personalized prospecting video I'll record and send to {{prospect_name}}, {{prospect_title}} at {{company_name}}. This is a script to be read aloud on camera or screen-share, not an email — write it as speech, with natural pauses and contractions, not as formal written prose.

WHY THIS PROSPECT, RIGHT NOW
{{trigger_or_context}}

WHAT WE SELL
{{product_or_service}}

TARGET LENGTH
{{video_length_target}}

DESIRED NEXT STEP
{{cta}}

STRUCTURE
A prospecting video gets judged in its first three seconds, before the viewer has processed a single full sentence — most either keep watching or close the tab based on what they see and hear in that window, not on the pitch that comes later. Structure the script accordingly:
1. FIRST THREE SECONDS — the opening line must say the prospect's name and reference {{trigger_or_context}} specifically enough that a viewer immediately understands why this exists and isn't a templated video with their name pasted over a placeholder. No "hey, thanks for taking the time to watch this" as an opener — that line burns the most valuable three seconds of attention on nothing.
2. WHY THIS, WHY YOU — one or two sentences connecting {{trigger_or_context}} to a real problem {{product_or_service}} addresses, spoken the way you'd actually say it to a person's face, not the way you'd write it in a deck.
3. THE ONE THING TO SHOW — name exactly one screen, product view, or visual to cut to during this section, and write the line that should be spoken while it's on screen — a video with no clear visual moment is just an audio message with extra production effort, and one with several unrelated visual cuts is harder to follow than no video at all.
4. THE ASK — {{cta}}, spoken as a direct, specific question, with a natural pause written in immediately after it, since a recorded video can't wait for a real answer, but the pause signals sincerity rather than a rep who is clearly just reading through to the end.

DELIVERY NOTES
Mark where a natural pause belongs with (pause). Mark where to say the prospect's name a second time, later in the script, since a name used only once at the very start is easy for the brain to register as generic. Flag any sentence over roughly 20 words for a rewrite — a sentence that reads fine on a page frequently sounds rehearsed and stilted out loud, and this script is meant to be delivered close to conversationally, with a light script as a safety net rather than word-for-word recitation.

WHAT NOT TO INCLUDE
No mention of "as you can see in this video" — if it's on screen, it doesn't need to be narrated as being on screen. No apology for the video's length or format ("sorry this is a bit long" or similar) — an apology just draws attention to the exact thing you don't want the viewer thinking about.

OUTPUT FORMAT
1. The full script, timestamped in roughly 10-second blocks against {{video_length_target}}.
2. For each block, the one on-screen visual it should pair with.
3. One sentence flagging the single moment most likely to lose the viewer's attention, and why the script is structured to get past it before that moment arrives.`,
    variables: [
      {
        name: 'prospect_name',
        description: 'Who the video is for',
        example: 'Julia Ferreira',
        required: true,
      },
      {
        name: 'prospect_title',
        description: 'Their job title',
        example: 'Director of Customer Onboarding',
        required: true,
      },
      {
        name: 'company_name',
        description: 'Their company',
        example: 'Ridgeline SaaS',
        required: true,
      },
      {
        name: 'trigger_or_context',
        description: 'The specific reason this video exists for this person right now',
        example: 'their careers page just listed three open onboarding-specialist roles',
        required: true,
      },
      {
        name: 'product_or_service',
        description: 'What you sell, in plain terms',
        example:
          'an onboarding-automation platform that reduces manual specialist workload',
        required: true,
      },
      {
        name: 'video_length_target',
        description: 'How long the finished video should run',
        example: '75 seconds',
        required: true,
      },
      {
        name: 'cta',
        description: 'What you want the viewer to do next',
        example: 'reply with a good 15-minute window this week',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: [
      'video-prospecting',
      'loom',
      'vidyard',
      'outbound',
      'personalization',
      'b2b-sales',
    ],
    whyItWorks:
      "Anchoring the entire structure to a documented three-second attention window reflects how prospecting videos actually get consumed: a viewer who receives an unsolicited video from an unfamiliar sender makes a near-instant keep-watching-or-close decision, almost entirely on the strength of the opening seconds, which is why the script forces the name-and-trigger reference into the very first line rather than easing into it after a pleasantry — a video that spends its first three seconds thanking the viewer for their time has already lost the only window it had to prove this isn't generic. Naming exactly one on-screen visual per section, rather than leaving the visual track unplanned, targets a specific weakness of prospecting video as a medium compared to email: a video with no visual anchor is strictly worse than a well-written email, since it demands more of the viewer's time to extract the same information, and a video that cuts between several unrelated screens is actively harder to follow, so the format only earns its extra effort when the visual is doing real work the words alone couldn't. Flagging any sentence over roughly 20 words for a rewrite addresses a gap between written and spoken language that catches most first-time video scripters off guard: prose that reads perfectly well silently on a page frequently sounds stilted, breathless, or over-rehearsed the moment it's actually spoken aloud, because writing and speech tolerate different sentence lengths and rhythms, and a script optimized for the page rather than for the mouth undermines the entire point of using video, which is to sound like a real person rather than a read-aloud email. The instruction to use the prospect's name a second time later in the script, not only in the opening line, is a small but deliberate counter to a common perception problem — a name used exactly once at the very start is easy for a skeptical viewer to write off as a mail-merge insert into an otherwise templated video, while a second, more natural use of the name later signals that the whole thing, not just the opening line, was actually built for this one recipient.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-warm-referral-intro-request',
    category: 'sales',
    title:
      'Ask an existing customer for a warm introduction without making it awkward for them',
    description:
      'Writes the request you send an existing happy customer asking them to introduce you to a specific new prospect, structured to make forwarding effortless and to give the customer a real, honest reason to make the ask.',
    promptText: `I want to ask {{referrer_name}}, an existing customer, to make a warm introduction to {{target_prospect_name}} at {{target_company}}. Here's the relationship: {{referrer_relationship}}. Here's why I think an introduction to {{target_prospect_name}} specifically makes sense: {{why_relevant}}. What I'd actually want from the intro: {{ask_specifics}}.

Write two things.

1. THE ASK TO {{referrer_name}} — a short message asking them to make the introduction. This is not a forwardable pitch in disguise; it's a direct, personal request to someone who already has a relationship with us. State plainly why I'm asking them specifically rather than reaching out cold, reference {{referrer_relationship}} briefly so it doesn't read as if I forgot who they are, and name {{why_relevant}} so they understand why this particular introduction, not just "know anyone who might be interested." Make it genuinely easy to say no — include one sentence giving them a clear, low-guilt way to decline or defer if the ask doesn't sit right with them, since a customer who feels cornered into making an introduction they're unsure about will often make a half-hearted one that helps nobody, including us.

2. THE FORWARDABLE BLURB — a separate, short paragraph {{referrer_name}} could paste directly into their own message to {{target_prospect_name}}, written in a warm, first-person voice that could plausibly be theirs, not ours. It should explain in one or two sentences why they think the introduction is worth {{target_prospect_name}}'s time, using {{why_relevant}}, and should not read like vendor copy that happens to be signed by a customer — no superlatives, no feature list, nothing {{referrer_name}} would feel uncomfortable calling their own genuine opinion if {{target_prospect_name}} pushed back on it. If {{ask_specifics}} names a particular next step, work it into this blurb as the natural close, not a hard sell.

CONSTRAINTS
Keep the ask to {{referrer_name}} under 120 words. Keep the forwardable blurb under 80 words — a paragraph that long already tests how much a customer will actually bother to personalize before forwarding it, and a longer one risks getting forwarded unedited with obvious vendor language a customer wouldn't naturally use.

HONESTY CHECK
Look at {{referrer_relationship}} and {{why_relevant}} together and tell me plainly if this ask is asking too much for the strength of the relationship — a customer who signed three weeks ago and has barely used the product yet is not the same referral position as one who's been a vocal advocate for a year, and the ask should not pretend otherwise. If the relationship doesn't clearly support this specific ask, say so and suggest a lighter alternative instead of writing the strong version anyway.`,
    variables: [
      {
        name: 'referrer_name',
        description: 'The existing customer you are asking',
        example: 'Marcus Webb',
        required: true,
      },
      {
        name: 'referrer_relationship',
        description: 'How you actually know them and how strong the relationship is',
        example:
          'customer for 14 months, has given us two positive references already and referred one other deal',
        required: true,
      },
      {
        name: 'target_prospect_name',
        description: 'Who you want introduced to',
        example: 'Elena Vasquez',
        required: true,
      },
      {
        name: 'target_company',
        description: "The prospect's company",
        example: 'Northfield Manufacturing',
        required: true,
      },
      {
        name: 'why_relevant',
        description: 'Why this specific introduction makes sense right now',
        example:
          'Marcus and Elena serve on the same regional operations council and Elena mentioned a similar pain point at their last meeting',
        required: true,
      },
      {
        name: 'ask_specifics',
        description: 'What you actually want out of the introduction',
        example:
          'just an email introduction so I can set up my own first call, nothing more',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: ['referrals', 'warm-intro', 'customer-advocacy', 'prospecting', 'b2b-sales'],
    whyItWorks:
      "Separating the private ask to the referrer from the forwardable blurb is the structural core of this prompt, because those two pieces of text have different audiences and different jobs: the ask has to justify, to someone who already trusts you, why this specific favor and why now, while the blurb has to read as an authentic opinion the referrer would actually say in their own words to someone they know — collapsing the two into one message either under-explains the ask to the referrer or hands them vendor-sounding copy they'll feel awkward forwarding under their own name, and both failures reduce the odds the introduction actually happens. Building in an explicit, low-guilt way to decline addresses a real dynamic in customer relationships that a purely persuasive ask ignores: a customer who feels socially cornered into an introduction they're not fully behind will often make a lukewarm one just to close the request out, and a lukewarm forwarded message from a real customer typically does less for a deal than no introduction at all, because it signals faint enthusiasm to the very person whose opinion is supposed to carry weight. Explicitly banning vendor-style superlatives from the forwardable blurb and testing it against whether the referrer would feel comfortable if pushed back on protects the one thing that makes a warm introduction valuable in the first place — perceived independence from the vendor — since the moment a forwarded message reads as marketing copy with someone else's name on it, the prospect discounts it exactly the way they'd discount an ad, and the entire point of asking for a warm intro rather than sending a cold email evaporates. The honesty check on relationship strength matters because referral asks scale with relationship depth in a way that's easy to ignore when you're focused on the target account rather than the person doing you the favor — a three-week-old customer and a year-long advocate are not equivalent referral sources, and a prompt that lets a rep apply the same strong ask to both is optimizing for the deal at the expense of a relationship that took real work to build.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-meddic-discovery-call-question-script',
    category: 'sales',
    title: 'Build a MEDDIC discovery-call question script for one specific deal',
    description:
      'Generates open-ended discovery questions mapped to each MEDDIC pillar for a named deal, with a built-in vague-answer follow-up per pillar, so the call surfaces real qualification gaps instead of generic rapport-building chat.',
    promptText: `I have a discovery call coming up with {{contact_name}}, {{contact_title}} at {{company_name}}, a {{deal_stage}} deal for {{product_or_service}}. Here's what I already know: {{known_context}}. Time available on the call: {{call_length}}.

Build a MEDDIC-based discovery question script for this specific call — not a generic list that would work equally well for any deal. Reference {{known_context}} wherever it's actually relevant, and don't force a reference to it into a pillar it has nothing to do with just to seem tailored.

For each MEDDIC pillar, give me 2-3 open-ended questions (no yes/no questions, and no question a prepared prospect could answer in one word) plus one embedded follow-up to use if their first answer comes back vague or deflects the question without really answering it:

- METRICS — what quantifiable outcome would make this a win for them, specific enough that you could check back against it in three months
- ECONOMIC BUYER — who actually signs off on budget, and how to ask this without sounding like you're trying to route around {{contact_name}} or imply they don't have real authority
- DECISION CRITERIA — what they'll formally evaluate options against, distinguishing must-haves from nice-to-haves
- DECISION PROCESS — the actual steps, approvals, and realistic timeline between "interested" and a signed contract, not the timeline they'd give if asked to guess out loud
- IDENTIFY PAIN — the specific, costed pain driving urgency now, in their own operational terms, not a generic industry pain point that could apply to any company in the space
- CHAMPION — whether {{contact_name}} actually has the internal standing and personal motivation to sell this when you're not in the room, versus simply being cooperative on a call

PRIORITIZATION
Flag which two pillars are the biggest qualification risk for this specific deal based on {{known_context}} — not a generic "always watch Economic Buyer and Champion" answer, but a judgment grounded in what's actually known or unknown here. Then, for each of the six pillars, tell me the single highest-priority question to ask first if the call runs short on time, ordered so the most qualification-critical information comes out even if the call gets cut to half its planned length.

CALL FLOW
Sequence the pillars in an order that flows like a real conversation rather than an interrogation checklist — Identify Pain typically belongs early since it earns the right to ask harder questions later, and Economic Buyer and Decision Process typically land better once some trust and context have been established, not as the opening question.

OUTPUT FORMAT
1. Questions grouped by pillar, in the recommended call-flow order, with the vague-answer follow-up nested directly under each main question.
2. The two highest-risk pillars for this deal, with the specific reasoning from {{known_context}}.
3. The time-constrained priority order, one question per pillar.`,
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
      {
        name: 'call_length',
        description: 'How much time is actually booked for the call',
        example: '30 minutes',
        required: false,
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
      'MEDDIC — Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion — is a documented enterprise-sales qualification framework precisely because each pillar catches a different, independent way deals stall later, and a deal can score well on some pillars while quietly failing on others: strong pain with no confirmed economic buyer looks healthy on a call and then goes silent for a month once it hits an approval step nobody actually mapped. Forcing open-ended questions plus a built-in vague-answer follow-up mirrors how real discovery calls actually unfold rather than how a checklist imagines them going: the first answer to "how are you measuring success" is almost always too soft to qualify on — "we just want things to run smoother" — and a script with no planned follow-up leaves the rep improvising in the moment exactly when a sharper question would matter most. Sequencing the pillars to match a real conversation\'s natural trust curve, rather than running through MEDDIC\'s six letters in alphabetical or memorized order, matters because Economic Buyer and Decision Process questions asked before any rapport or pain has been established read as presumptuous or even a little suspicious — "who signs off on this" lands very differently in minute two than in minute fifteen of the same call. Asking the model to name the two riskiest pillars from the actual known_context, rather than defaulting to a generic warning about the usual suspects, is what turns a reusable checklist into deal-specific prep — a deal with a confirmed budget owner but a vague, unconfirmed pain story has a completely different risk profile than one with the reverse, and a script that doesn\'t distinguish the two is giving the same advice regardless of what\'s actually happening in this deal. Building an explicit time-constrained priority order in advance, rather than leaving triage to the moment the call runs long, protects against the single most common real-world failure of a discovery script: a call that gets cut short by ten minutes and ends with the rep having asked whatever question happened to come up next in the list, rather than the one question that would have most reduced the deal\'s actual qualification risk.',
    exampleOutput:
      'ECONOMIC BUYER — "Beyond your team, who signs off when a tool like this gets approved for budget?" Follow-up if vague: "If this were approved tomorrow, whose signature would actually be on the PO?"\n\nBiggest risk pillars for this deal: Economic Buyer and Decision Process — David keeps saying "we" without naming anyone, which usually means either he doesn\'t know who the buyer is or hasn\'t asked yet. Prioritize the Economic Buyer question first if time is short.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-19' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-20' },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-multi-threading-single-threaded-deal',
    category: 'sales',
    title: 'Turn a single-threaded deal into a multi-threaded one before it stalls',
    description:
      'Maps who else in the buying org likely needs to be involved, ranks them by risk of being missed, and drafts the specific ask to your current contact for a warm path to each one — for a deal currently riding on one relationship.',
    promptText: `This deal is riding on one relationship and I need to fix that before it stalls or dies quietly. Deal: {{company_name}}, {{deal_stage}}, deal value roughly {{deal_value}}. Current contact: {{current_contact}}, {{current_contact_title}} — this is the only person I've actually spoken with so far. What I know about the org structure or team, even secondhand: {{known_org_structure}}. Why this matters now: {{why_single_threaded_is_risky}}.

STAKEHOLDER MAP
Based on {{known_org_structure}} and the nature of {{product_or_service}}, list the likely additional people who plausibly need to be involved before this can close — an economic buyer if not already identified, anyone whose workflow the product actually touches day to day, anyone in procurement, security, or IT who could gate the deal at the finish line, and anyone with a plausible reason to be skeptical of a purchase like this. For each, state their likely role in the decision and, honestly, whether this is a confident inference from what's known or a reasonable guess that needs to be checked directly on the next call rather than assumed.

RISK RANKING
Rank the missing stakeholders by how much risk their absence adds to the deal specifically — not a generic ranking, but one grounded in {{deal_stage}} and {{known_org_structure}}. Someone who could block the deal at the very end (security review, procurement sign-off) but hasn't been engaged yet is a different risk than someone who's merely nice to have looped in for buy-in.

THE ASK TO {{current_contact}}
Write the actual message or talking point to ask {{current_contact}} for a path to the highest-risk missing stakeholder — framed as something that helps them too, not as a request that implies distrust in their ability to carry the deal alone. Never phrase it as "can I talk to your boss" or anything that could read as going around them; frame it around a legitimate reason the other person's involvement helps the deal move faster or get evaluated more fairly, and let {{current_contact}} be the one who looks good for making the connection.

FALLBACK IF {{current_contact}} RESISTS
Give me one alternate path to the same stakeholder that doesn't depend on {{current_contact}}'s cooperation — LinkedIn outreach, a mutual connection, an event, a different internal referral — for the specific case where the ask above doesn't work or gets a soft no, since a multi-threading plan with no fallback is really a single-threading plan with extra analysis attached.

HONESTY CHECK
Tell me plainly if {{known_org_structure}} is too thin to build a real stakeholder map from, versus enough to work with — don't manufacture a confident-sounding org chart from information that's really just a guess, and say explicitly which names on the list are informed inference rather than something actually confirmed.`,
    variables: [
      {
        name: 'company_name',
        description: 'The account this deal is with',
        example: 'Brightwell Insurance Group',
        required: true,
      },
      {
        name: 'deal_stage',
        description: 'Where the deal sits right now',
        example: 'third call, verbal interest, no other stakeholders looped in yet',
        required: true,
      },
      {
        name: 'deal_value',
        description: 'Approximate deal size',
        example: '$54,000 ACV',
        required: false,
      },
      {
        name: 'current_contact',
        description: 'The one person you have been talking to',
        example: 'Wendy Zhao',
        required: true,
      },
      {
        name: 'current_contact_title',
        description: "That person's title",
        example: 'Senior Claims Operations Manager',
        required: true,
      },
      {
        name: 'known_org_structure',
        description: 'Anything you know, even secondhand, about the broader team or org',
        example:
          'she mentioned reporting to a VP of Claims and has said "IT would need to sign off" once in passing',
        required: true,
      },
      {
        name: 'why_single_threaded_is_risky',
        description: 'The concrete reason this needs to change now',
        example:
          "Wendy went quiet for eight days after our last call with no explanation, and there's no one else who could tell me why",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'LinkedIn Sales Navigator'],
    tags: [
      'multi-threading',
      'stakeholder-mapping',
      'meddic',
      'enterprise-sales',
      'deal-risk',
      'b2b-sales',
    ],
    whyItWorks:
      "Single-threading — a deal running through exactly one point of contact with no other relationship inside the buying org — is one of the most consistently cited reasons enterprise deals go dark without warning, because the entire deal's survival depends on one person's continued availability, motivation, and internal standing, all three of which can change for reasons that have nothing to do with the deal itself: a reorg, a change in priorities, or simply someone getting busy on something unrelated. Separating the stakeholder map from a confidence label on each entry — confident inference versus a guess to check directly — matters because org charts built entirely from secondhand fragments are exactly the kind of output an LLM will otherwise present with uniform, unearned confidence, and a rep who acts on a guessed name as if it were confirmed can walk into a next call referencing a stakeholder who turns out to be the wrong person or doesn't exist in the role assumed, which damages credibility with the very contact being asked to make the introduction. Framing the ask to the current contact around a benefit to them, rather than as a request that implies they can't carry the deal alone, targets a real relational risk in multi-threading: a contact who feels bypassed or distrusted becomes a worse champion, not a better one, so the exact same request phrased two different ways can either strengthen or damage the one relationship the deal currently has. Requiring a fallback path that doesn't depend on the current contact's cooperation is what actually makes this a risk-mitigation plan rather than a single-threaded plan with an extra step added on top — if the only path to every other stakeholder still runs entirely through the one relationship already identified as a point of failure, nothing about the deal's structural risk has actually changed, it has just been described more thoroughly.",
    exampleOutput:
      'Highest risk missing stakeholder: whoever in IT signs off on new tools — Wendy mentioned this once in passing and it was never followed up on, and a late-stage IT block after verbal interest is one of the most common ways a deal at this stage stalls without an obvious cause. Ask to Wendy: "Since IT sign-off will come up eventually, would it help to get someone from that team looped in early so there\'s no surprise at the finish line? Happy to keep it a quick, low-key intro call."',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-26' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-27' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-isolate-real-objection-response-script',
    category: 'sales',
    title: 'Turn a real objection into an isolate-and-respond script, not a rebuttal',
    description:
      'Builds a response to an objection you actually heard using the isolate-the-real-objection technique, with two branching response paths so the answer to a surface objection reveals what it is actually standing in for.',
    promptText: `A prospect just said this during a sales call: "{{objection_verbatim}}"

Context: deal stage is {{deal_stage}}, they're evaluating us against {{competitor_or_alternative}}, and here's what I know about their priorities so far: {{known_priorities}}.

Help me respond using the isolate-the-real-objection technique instead of rebutting the surface statement, since a surface objection is frequently a proxy for something the prospect either hasn't fully articulated to themselves yet or isn't comfortable saying outright.

1. ACKNOWLEDGE — one sentence that shows I actually heard them, without agreeing or conceding to the objection yet, and without launching straight into a counter-argument that makes it sound like their concern was dismissed the instant it was raised.

2. ISOLATE — one question that tests whether "{{objection_verbatim}}" is the real blocker or a stand-in for something else. Price objections in particular are frequently a value problem, an urgency problem, or an authority problem wearing a price objection's clothes — write a question specific to this objection and this deal context, not a generic "is price the only thing standing in our way" line that prospects have heard often enough to answer reflexively without really thinking about it.

3. TWO RESPONSE PATHS — write a version of the response for each of the two most likely ways they could answer the isolating question, so I'm not stuck improvising if the first path doesn't fit what they actually say. Each path should lead somewhere different — if both paths end up recommending the same next move regardless of their answer, the isolating question wasn't actually doing any diagnostic work.

4. CONFIRM — one closing question that checks whether the objection is genuinely resolved, not merely whether they've stopped arguing about it out loud; going quiet on an objection and being satisfied with the answer are not the same event, and a script that treats silence as resolution will walk straight into the same objection resurfacing later at a worse moment, like right before signature.

DELIVERY CONSTRAINT
Keep every line something I could actually say out loud on a call, in my own voice — no marketing language, no more than two sentences per step, nothing that would sound obviously scripted if said verbatim to a person who's paying attention.

HONEST READ ON THIS DEAL
Based on {{known_priorities}} and {{deal_stage}}, tell me directly whether "{{objection_verbatim}}" is likely a genuine, resolvable concern, or a polite way of signaling something closer to "no" that the isolate-and-respond technique alone won't fix — be willing to say the deal may be further behind than this objection on its own suggests, even if that's an uncomfortable read heading into the next call.`,
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
      'Isolating an objection before responding to it is a standard technique across Sandler- and SPIN-derived sales training precisely because surface objections are frequently a proxy for something else entirely: "it\'s too expensive" is often really "I haven\'t seen enough value to justify this cost" or "I\'m not the one who has to defend this internally," and a rebuttal aimed squarely at price alone leaves the actual blocker completely untouched even if the prospect momentarily stops pushing back. Requiring the isolating question to be specific to this deal, rather than a generic "is price the only thing" line, matters because prospects who evaluate software regularly have heard the generic version enough times to answer it on reflex without actually engaging with what\'s being asked, while a question grounded in {{known_priorities}} forces a more honest, considered answer because it references something they actually said, not a script they can recognize and deflect. Writing two genuinely divergent response paths, rather than one, forces branching preparation instead of a single memorized line that works only if the conversation goes exactly the way it was rehearsed — and the requirement that the two paths lead somewhere different is what stops the model from producing two response drafts that only superficially differ while recommending the identical next step regardless of what the prospect actually says, which would mean the isolating question was cosmetic rather than diagnostic. The confirm step targets a specific and common failure in how reps track objections mentally: treating an objection as handled the moment a prospect stops pushing back on it, rather than the moment they\'ve actually agreed it\'s resolved, are two different events that get conflated constantly, and the gap between them is exactly where an objection quietly resurfaces weeks later, often at the worst possible moment in the deal, like the day before a contract was supposed to be signed.',
    exampleOutput:
      '2. ISOLATE: "If the budget wasn\'t a constraint at all, is this the direction you\'d want to go, or is there something else giving you pause too?"\n\n4. CONFIRM: "Does that change how this fits for this year, or is budget still the thing standing in the way?"',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-24' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-25' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-negotiation-concession-strategy',
    category: 'sales',
    title: 'Plan a pricing negotiation before the prospect names their number',
    description:
      'Prepares a concession strategy for a specific deal — what to trade, in what order, and where the real walk-away line is — instead of improvising discounts live on the call as the buyer pushes.',
    promptText: `I have a negotiation coming up on this deal and want to walk in with an actual concession strategy, not improvise discounts live as the conversation happens.

Deal: {{company_name}}, current deal value {{deal_value}}. What they've asked for: {{requested_concession}}. Our actual walk-away position — the terms below which this deal stops making sense for us: {{our_walk_away_terms}}. Leverage we have in this negotiation: {{leverage_we_have}}. Leverage they have: {{leverage_they_have}}.

CONCESSION LADDER
Build an ordered list of things we could concede, from least costly to us to most costly, and for each one, name what we should ask for in return — a concession given for free trains the other side to expect the next one for free too, so no item on this ladder should be handed over without something requested back, even something small and mostly symbolic like a faster reference call or a case study commitment. Do not put price itself as the first rung; identify at least two non-price concessions (payment terms, contract length, onboarding scope, a pilot period) to offer before price becomes the primary lever, since a negotiation that goes straight to a price cut has nowhere left to go once that's spent.

READING {{requested_concession}} AGAINST {{leverage_they_have}}
Assess honestly whether {{requested_concession}} is proportional to the leverage they actually have, or whether it's an anchor they're testing simply because asking costs them nothing — a prospect with a real competing offer in hand and a firm deadline has different leverage than one who mentioned budget concerns with no other option on the table, and the response should differ accordingly.

SCRIPT FOR THE MOMENT THEY PUSH
Write the actual language for the specific point in the conversation where they push past the first concession offered — not a generic "let me see what I can do," but a response that holds the line while leaving the relationship intact, and a second version for if they push a second time past that.

THE WALK-AWAY LINE
State plainly, in one sentence, the actual point past {{our_walk_away_terms}} where the right move is to let the deal go rather than concede further, and write the one sentence I'd actually say to communicate that without threatening or bluffing — a walk-away line that isn't genuinely backed by a willingness to walk is a bluff the other side can usually sense, and calling that bluff costs more credibility than not having tried the line at all.

HONESTY CHECK
If {{leverage_we_have}} is genuinely weaker than {{leverage_they_have}} in this specific deal, say so plainly rather than writing a confident-sounding strategy that assumes leverage we don't actually have — a negotiation plan built on overstated leverage is a plan to lose the negotiation while feeling prepared going in.`,
    variables: [
      {
        name: 'company_name',
        description: 'The account this negotiation is with',
        example: 'Castleford Retail Group',
        required: true,
      },
      {
        name: 'deal_value',
        description: 'Current proposed deal value',
        example: '$92,000 annual contract',
        required: true,
      },
      {
        name: 'requested_concession',
        description: 'What the prospect has actually asked for',
        example: 'a 20% discount and a month-to-month contract instead of annual',
        required: true,
      },
      {
        name: 'our_walk_away_terms',
        description: 'The actual floor below which this deal stops making sense',
        example: 'no more than a 10% discount, and a minimum 12-month term',
        required: true,
      },
      {
        name: 'leverage_we_have',
        description: 'What actually gives you negotiating strength here',
        example:
          "we're the only vendor with the integration they specifically need, confirmed in discovery",
        required: true,
      },
      {
        name: 'leverage_they_have',
        description: 'What gives the prospect negotiating strength here',
        example:
          'a competitor quote roughly 15% below ours that they mentioned unprompted',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: ['negotiation', 'pricing', 'deal-strategy', 'discounting', 'b2b-sales'],
    whyItWorks:
      'Building an ordered concession ladder before the negotiation happens, rather than deciding what to give up in the moment, targets a well-documented risk of live discounting: a concession granted without anything requested in return trains the other side that every future ask will also be free, and a rep improvising under time pressure on a call rarely remembers to ask for something back in the moment, even when they know intellectually that reciprocity matters — planning it in advance removes the dependency on remembering it live. Requiring at least two non-price concessions to precede price as the primary lever reflects a specific structural property of price concessions that other concessions don\'t share: once a price number has been reduced, there is no natural way to un-reduce it later in the same negotiation, whereas a payment-terms or onboarding-scope concession can be offered, evaluated, and left on the table without permanently anchoring the eventual price the buyer will accept as fair. Reading the requested concession against the actual leverage each side holds, rather than responding to every ask with the same posture, matters because a request tested at zero cost to the person asking — "can you do better on price" said without a real alternative in hand — deserves a different response than the identical words backed by a genuine competing offer and a real deadline, and treating both the same either gives away value unnecessarily or holds too firm against a buyer who has real options and will walk. The explicit walk-away line, paired with the warning that an unbacked walk-away threat costs more credibility than never attempting one, targets a specific tell experienced buyers learn to recognize: a seller who states a firm limit and then concedes past it anyway teaches the buyer that every future "firm" limit from that seller is also negotiable, which erodes negotiating position on every deal after this one, not just this one. The honesty check on leverage asymmetry exists because a negotiation strategy is only as good as its assumptions about relative power, and a model asked to "build a negotiation strategy" will produce a confident-sounding one regardless of whether the underlying leverage claim actually holds, which is precisely the condition under which a rep walks into a room prepared for a negotiation they don\'t actually have the strength to win on the terms planned.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-01' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Claude (Sonnet 4.5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'sales-post-call-followup-cadence',
    category: 'sales',
    title: 'Build a follow-up cadence that never repeats "just checking in"',
    description:
      'Turns one open item from a sales call into a multi-touch, multi-channel cadence where every touch adds a new piece of value, ending in an explicit break-up message instead of trailing off into silence.',
    promptText: `I need a follow-up cadence after {{last_interaction}} with {{contact_name}} at {{company_name}}. Deal stage: {{deal_stage}}. What's still open or unresolved: {{open_item}}. Channels I can use: {{channels}}.

Build a {{num_touches}}-touch cadence over {{cadence_length}}, mixing the channels listed rather than running them all through one channel. For every touch, give me:
- Day number, relative to today
- Channel
- The ONE new piece of value, information, or reason to reply it adds — no touch may simply restate the last one, and no touch may use "following up," "just checking in," "wanted to bump this," or any functional equivalent of those phrases, since a touch with nothing new to say is a touch asking for attention it hasn't earned
- The exact message or call talking point, ready to send or say without further editing

VARY THE VALUE TYPE ACROSS TOUCHES
Don't make every touch a variation of the same value type — mix genuinely different kinds of value across the sequence: a relevant piece of content or data point, a direct question that moves {{open_item}} forward, a small proof point or customer story, a deadline or time-sensitive reason to act, and a check on whether priorities have simply changed. A cadence where every touch is "here's another article" is nearly as repetitive as one where every touch just says "checking in," even though no single touch technically breaks the banned-phrase rule.

THE BREAK-UP TOUCH
The last touch must be an explicit break-up message: state plainly that you'll stop reaching out on this cadence, and give them one easy, low-guilt way to restart contact later if their situation changes — no guilt-tripping, no exaggerated finality ("this is truly the last time"), just a clear, honest close.

MOST-LIKELY-TO-LAND CALL
After the full cadence, tell me which single touch is most likely to actually get a response given {{open_item}} specifically, and explain plainly why the others are more likely to be read and ignored — don't hedge this into "they're all equally important," since if that were true there'd be no reason to sequence them at all.

TIMING SANITY CHECK
Look at the spacing between touches relative to {{cadence_length}} and {{deal_stage}} and flag if the cadence is too aggressive (multiple touches close together reading as pressure) or too sparse (long silent gaps that let the deal go cold) for a deal at this specific stage — a cold-outbound cadence and a post-demo cadence should not be spaced identically.`,
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
      'Banning "just checking in" and "bumping this" is grounded in a widely documented pattern in outbound sales: near-zero-value bump messages consistently produce the lowest reply rates of any touch type in a cadence, because they ask explicitly for the prospect\'s time and attention while offering nothing new in exchange, which is a bad trade from the recipient\'s side of the inbox even if it costs the sender nothing to send. Requiring the value type to vary across touches, not just the wording, closes a gap the banned-phrase rule alone doesn\'t catch: a model told only to avoid specific phrases will happily generate five touches that are all, functionally, "here\'s another resource," which is repetitive in substance even while being technically compliant with the letter of the instruction, and a prospect notices the pattern of a cadence, not just the vocabulary of any single message in it. The mandatory break-up message reflects a specific, counterintuitive and well-supported cadence-design principle: sequences that end with an explicit exit message reliably out-perform ones that simply trail off into nothing, because stating plainly "I\'ll stop reaching out after this" creates a natural deadline effect and often prompts a reply from prospects who never intended to ghost the conversation but also never got around to replying to an open-ended thread with no clear end. Requiring a timing sanity check against deal stage specifically addresses a common one-size-fits-all mistake: the same five-touches-over-three-weeks template applied to both a cold-outbound sequence and a warm post-demo follow-up, when the two situations call for genuinely different pacing — pushing a warm, recently-engaged prospect with the same touch frequency used on someone who has never responded reads as pressure, while spacing out a warm follow-up as sparsely as a cold sequence lets real, active momentum go cold for no reason.',
    exampleOutput:
      'Day 12 — LinkedIn: "Sarah — I\'ll stop following up on this one for now. If the timing shifts on your end, just reply here and I\'ll pick it back up, no explanation needed." Most likely to land: the Day 3 email, since it offers the ROI one-pager the CFO would actually need to sign off on, not a status check.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-27' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-stall-after-interest-recovery',
    category: 'sales',
    title: 'Recover a deal that went quiet right after it looked interested',
    description:
      'Diagnoses and responds to the specific pattern where a prospect showed real interest, asked for information, and then went silent — distinguishing genuine reconsideration from a soft no, without sending another generic nudge.',
    promptText: `A deal went quiet right after showing real interest, and I want to actually diagnose why before sending another nudge that gets ignored like the last one.

Deal: {{company_name}}, contact {{contact_name}}, stage {{deal_stage}}. The specific signal of interest before they went quiet: {{last_signal_of_interest}}. What they specifically asked for or agreed to before going quiet: {{what_they_asked_for}}. How long it's actually been since any real response: {{time_since_last_contact}}.

DIAGNOSE BEFORE RESPONDING
This exact pattern — real interest, a specific ask granted, then silence — has a small number of common causes, and the right response differs sharply depending on which one it actually is. Walk through these possibilities against what's known and name which one or two are most plausible here, not all five treated as equally likely: (1) the request itself surfaced a new internal step, like a security review or budget approval, that's now quietly consuming time on their end without them thinking to update you; (2) a genuine change in priority or urgency happened on their side, unrelated to your product, that has nothing to do with anything you did or said; (3) what was sent didn't actually answer the real question behind the ask, and they've moved on without saying so rather than asking a follow-up; (4) the interest was real but was never anchored to a specific enough next step or date, so it simply had nothing forcing a reply; (5) this was a soft no from the start, and the information request was a polite way to end the conversation without directly declining.

THE RECOVERY MESSAGE
Based on the one or two most plausible causes identified above, write a message that doesn't just ask "did you get a chance to look at this" — that phrasing assumes cause 4 or 5 and will read as naive if the real cause is 1 or 2. Instead, write a message that gives them an easy, specific, low-effort way to signal which situation it actually is without having to write an explanation — a short multiple-choice-style question embedded naturally in the message works better here than an open-ended "how's it going," since an open question to someone who's already gone quiet is asking for more effort than a one-line answer.

WHAT NOT TO DO
Do not send anything that repeats {{what_they_asked_for}} back to them as if reminding them it exists will prompt a response — if they haven't engaged with it in {{time_since_last_contact}}, restating that it exists adds no new information. Do not apologize for following up; there's nothing to apologize for, and an apology subtly reframes a reasonable business follow-up as an intrusion.

HONEST READ
Given {{time_since_last_contact}} and everything else known, tell me plainly whether this deal is still realistically alive or should be moved to a much longer-cycle nurture track instead of an active-deal cadence — a quiet deal chased with active-deal urgency past a certain point just looks needy rather than diligent.`,
    variables: [
      {
        name: 'company_name',
        description: 'The account that went quiet',
        example: 'Ferngate Logistics',
        required: true,
      },
      {
        name: 'contact_name',
        description: 'Who went quiet',
        example: 'Tobias Lindgren',
        required: true,
      },
      {
        name: 'deal_stage',
        description: 'Where the deal was at when it went quiet',
        example: 'demo completed, asked for a formal proposal',
        required: true,
      },
      {
        name: 'last_signal_of_interest',
        description: 'The specific thing that showed real interest before the silence',
        example:
          'asked detailed pricing questions on the demo call and said he wanted to bring it to his team',
        required: true,
      },
      {
        name: 'what_they_asked_for',
        description:
          'What was specifically requested or agreed to right before the silence',
        example:
          'a formal proposal with three pricing tiers, which was sent within a day',
        required: true,
      },
      {
        name: 'time_since_last_contact',
        description: 'How long it has actually been since any real response',
        example: '17 days, no response to two follow-up emails',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: ['deal-recovery', 'follow-up', 'pipeline-hygiene', 'stalled-deal', 'b2b-sales'],
    whyItWorks:
      "Naming a specific set of plausible causes for the interest-then-silence pattern, rather than treating every stalled deal identically, matters because the correct next message genuinely depends on which cause is actually true — a message assuming a new internal review is quietly underway reads as understanding and patient if that's exactly what happened, but reads as naive and easy to ignore if the real cause was a soft no dressed up as an information request, and a rep who sends the wrong-cause message wastes the one follow-up attempt that might have actually worked. Rejecting the reflexive \"did you get a chance to look at this\" as a default response targets a message that's technically polite but analytically empty: it assumes the recipient simply hasn't acted yet, which is only one of several plausible explanations, and if the true cause is a new internal gatekeeper or a quiet change in priority, that message asks the prospect to do the diagnostic work themselves by explaining a situation they may not feel like explaining to a vendor at all. Designing the recovery message around a low-effort, near-multiple-choice answer rather than an open-ended question respects a specific asymmetry in re-engagement: a prospect who has already gone quiet has, by definition, already shown they won't volunteer a full explanation, so a message asking for one is asking for more effort than the prospect has already demonstrated they're willing to give, while a structured question that can be answered in a single short line meets them at the actual effort level they've shown. The closing honest read on whether the deal is still realistically active addresses a real cost of open-ended pipeline hygiene: a deal chased indefinitely with active-deal urgency past the point where the evidence suggests it's gone cold consumes a rep's attention that could go toward deals actually showing signals of life, and a forecast that keeps a truly stalled deal listed as active distorts pipeline numbers for everyone relying on that forecast, not just the rep working the deal.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-tailor-proposal-to-discovery-findings',
    category: 'sales',
    title: 'Rework a standard proposal around what one buyer actually said in discovery',
    description:
      "Takes a standard proposal outline and one buyer's specific discovery answers, then returns exactly which sections to reorder, cut, or rewrite so the proposal argues their case, not the default pitch.",
    promptText: `I have a standard proposal or deck outline for {{product_or_service}}. Current sections, in order: {{current_outline}}.

Here's what this specific buyer, {{contact_name}} at {{company_name}}, told me in discovery:
- Their stated success metric: {{success_metric}}
- Their decision criteria, what they said they're evaluating options against: {{decision_criteria}}
- Who else is involved in the decision and what they likely care about: {{other_stakeholders}}
- Budget or timeline signals: {{budget_timeline_signal}}
- Competing option, if any: {{competing_option}}

Rework the proposal for this buyer specifically, not as a generic best-practices reshuffle:

1. REORDER — move the section matching {{decision_criteria}} to right after the opening, regardless of where it currently sits in {{current_outline}}. If nothing in the current outline actually addresses {{decision_criteria}} directly, say so and tell me what new section needs to be added rather than pretending an existing section covers it well enough.

2. SECTION-BY-SECTION CALL — for each section in {{current_outline}}, tell me plainly: keep as-is, cut entirely, or rewrite. If rewrite, give the new framing in one sentence using {{contact_name}}'s own language from {{success_metric}}, not generic feature language — a section reframed around "cutting stockouts on our top 200 SKUs by half" reads completely differently to this buyer than the same section framed around "advanced inventory optimization."

3. STAKEHOLDER PARAGRAPH — write one paragraph addressing {{other_stakeholders}} directly, focused on the concern they'd raise that {{contact_name}} alone can't fully answer for them. This paragraph should read as if it anticipates being read by someone who wasn't in the discovery calls and has their own separate priorities, not as an extension of the pitch to {{contact_name}}.

4. FAIR COMPETITIVE CONTRAST — if {{competing_option}} is filled in, write one paragraph drawing a fair contrast without naming or disparaging them directly; frame it around what matters to this buyer's {{decision_criteria}}, not a feature-for-feature comparison table. If {{competing_option}} is empty, skip this section entirely rather than inventing a generic "why choose us" paragraph with nothing real to contrast against.

GROUNDING CHECK
Flag anywhere the rewrite tailors language to a criterion or priority that wasn't actually confirmed in discovery — don't let a plausible-sounding inference get written as if it were something the buyer stated directly. Overclaiming fit based on an educated guess is the single most common way a "tailored" proposal quietly stops being honest, and it's the kind of gap that surfaces badly if the buyer asks a follow-up question the proposal implied was already answered.

OUTPUT FORMAT
1. The new section order.
2. The keep/cut/rewrite call per section, with the one-sentence new framing for each rewrite.
3. The stakeholder paragraph.
4. The competitive contrast paragraph, or an explicit note that it was skipped and why.
5. The grounding-check flags, if any.`,
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
    whyItWorks: `This is deliberately an edit-and-reorder task rather than a from-scratch proposal generator, because it assumes a standard deck already exists and needs to argue one specific buyer's case — that framing is a direct application of MEDDIC's Decision Criteria pillar, mapping the pitch to what the buyer said they'd actually evaluate options against, in their own words, rather than defaulting to whatever order the template happened to ship in. The instruction to say plainly when no existing section covers {{decision_criteria}} at all, rather than forcing a weak fit, protects against a subtle failure mode where a model asked to reorder sections will always find something in the existing outline to promote to the top, even when nothing there actually addresses the buyer's real evaluation criteria, producing a proposal that looks reordered without actually being more relevant. The stakeholder paragraph mirrors a well-documented B2B buying-committee dynamic: a single champion cannot pre-answer every question a CFO or IT lead will raise once a proposal circulates without the rep in the room to field follow-ups live, so a section written to anticipate that separate reader's priorities does real work a champion-only pitch cannot do on its own. The explicit instruction to skip the competitive contrast section entirely when no real competing option was named, rather than manufacturing a generic "why us" paragraph, matters because an invented comparison against nothing in particular reads as filler to a sophisticated buyer and actually weakens the proposal's credibility relative to simply not including that section at all. The grounding check is the load-bearing constraint of the whole prompt: it's what stops the model from quietly inventing a fit-claim for a criterion the buyer never actually confirmed holding, which is the most common way a "tailored" proposal ends up overclaiming and then gets caught out the moment a stakeholder asks a direct question the proposal implied was already settled.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-demo-agenda-from-discovery-findings',
    category: 'sales',
    title:
      'Build a demo agenda around what discovery actually revealed, not a default feature tour',
    description:
      'Turns discovery findings into a time-boxed live demo agenda ordered by buyer priority rather than product logic, with a named counter for a known skeptic in the room.',
    promptText: `I have a live demo coming up with {{company_name}} and want an agenda built around what discovery actually revealed, not our default feature-tour order.

Who's attending: {{attendees}}. What discovery revealed about priorities and pain: {{discovery_findings}}. Features or workflows that must be shown, non-negotiably, regardless of ordering: {{must_show_features}}. Time allotted: {{time_allotted}}. A known skeptic in the room, if there is one, and why: {{known_skeptic}}.

AGENDA ORDER
Order the demo by what {{discovery_findings}} showed actually matters to this specific audience, not by the logical order features would be introduced to someone learning the product from zero. If the thing that matters most to this buyer happens to be the fifth feature in a typical default demo flow, it goes first here anyway, since a demo that opens with fifteen minutes of context-setting before reaching the one thing the buyer actually came to see risks losing their attention before the payoff arrives.

FOR EACH AGENDA SEGMENT
Give me: the time allotted, the specific discovery finding it's directly answering (not a generic "shows value" label), the one thing to say while showing it that ties back to that finding in the buyer's own language, and one likely question this segment will provoke from this specific audience, with a one-line answer ready for it.

MULTI-ATTENDEE HANDLING
If {{attendees}} includes more than one role, name which segment of the agenda is primarily for which attendee, and flag any point where two attendees in the room are likely to want to see genuinely different things at the same moment — a technical lead wanting to see the API and a business buyer wanting to see the ROI dashboard rarely want the same five minutes of screen time, and the agenda should either sequence around that or explicitly call out the segment as one where the other attendee should be told up front that their part is coming shortly.

HANDLING {{known_skeptic}}
If a known skeptic is named, identify the specific point in the agenda where their skepticism is most likely to surface as a question or pushback, and build in one line addressing it proactively before they have to ask — not by naming them directly as a target, but by simply making sure the segment doesn't leave an obvious opening for the exact objection they're likely to raise.

TIME DISCIPLINE
If the sum of segment times exceeds {{time_allotted}}, cut something and say plainly what got cut and why it was the lowest-priority item relative to {{discovery_findings}} — never silently overrun the agenda and hope the call runs long; a demo that hasn't reached its most important point when time runs out is a demo that failed regardless of how good the earlier segments were.

CLOSE
End the agenda with a specific next-step ask tied to what was just shown, not a generic "any questions?" close — the ask should name a concrete next action and, if possible, a date.`,
    variables: [
      {
        name: 'company_name',
        description: 'The account this demo is for',
        example: 'Aldergate Health Network',
        required: true,
      },
      {
        name: 'attendees',
        description: 'Who is actually attending and their roles',
        example:
          'the Director of Clinical Ops (business buyer), and their IT Security lead',
        required: true,
      },
      {
        name: 'discovery_findings',
        description: 'What discovery actually revealed about priorities and pain',
        example:
          "clinical ops is drowning in manual scheduling conflicts; IT security's main concern is data residency for patient records",
        required: true,
      },
      {
        name: 'must_show_features',
        description: 'Features or workflows that must be shown no matter the ordering',
        example: 'the audit-log export, since it came up as a compliance requirement',
        required: false,
      },
      {
        name: 'time_allotted',
        description: 'Total time available for the demo',
        example: '40 minutes including Q&A',
        required: true,
      },
      {
        name: 'known_skeptic',
        description: 'A specific person expected to push back, and why',
        example:
          'the IT Security lead was burned by a previous vendor over a data residency issue',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: ['demo', 'discovery-call', 'sales-enablement', 'meddic', 'b2b-sales'],
    whyItWorks:
      "Ordering the demo by buyer priority rather than product logic directly targets the most common self-inflicted failure of live demos: a rep who defaults to the product's natural onboarding order — the sequence a new user would learn features in — ends up spending the first several minutes on context the buyer doesn't need, and if the meeting runs long or gets interrupted, the segment that actually mattered most to the buyer is the one most likely to get cut or rushed, precisely because it was scheduled last by habit rather than by relevance. Requiring each segment to name the specific discovery finding it answers, rather than a generic value label, forces the same discipline the proposal-tailoring prompt applies to written material onto a live, real-time format — a demo segment justified only as 'shows value' could be shown to any prospect regardless of what discovery revealed, which is the live-call equivalent of a proposal that never actually engages with what the buyer said. Explicitly handling multiple attendees with different priorities addresses a structural reality of enterprise demos that a single-audience script ignores: a business buyer and a technical evaluator in the same room frequently want to see different things in the same five minutes, and a demo agenda that doesn't plan for that divergence either bores one attendee while satisfying the other, or worse, never actually reaches the specific proof point the skeptical technical evaluator needed to see, leaving their concern unaddressed and unspoken until after the call. The time-discipline instruction — cut something and say what, rather than silently overrunning — matters because an agenda that's allowed to overrun in practice always overruns on the earlier, easier segments and squeezes whatever was scheduled last, so forcing an explicit pre-planned cut ensures that if something has to go, it's a deliberate, lowest-priority choice made in advance rather than an accidental one made under live time pressure.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-mutual-action-plan-builder',
    category: 'sales',
    title: 'Build a mutual action plan the buyer will actually co-own',
    description:
      'Drafts a joint close plan with milestones, named owners on both sides, and dependency flags — structured so the buyer treats it as a shared roadmap they helped shape, not a vendor-imposed deadline sheet.',
    promptText: `I want to build a mutual action plan for {{company_name}} to actually get us to a signed deal by {{target_close_date}}, not a one-sided deadline sheet I hand them and hope they follow.

What we sell: {{product_or_service}}. Milestones we already know need to happen, from either side: {{key_milestones_known}}. Who's involved on both sides so far: {{stakeholders_both_sides}}. Risks already visible in how this deal has gone so far: {{risks_identified}}.

BUILD THE PLAN
List every milestone between now and signature, on both sides, not just the ones on our side — a mutual action plan that only tracks what we owe them isn't mutual, it reads as a project plan for their benefit only, and a real one has clear obligations on the buyer's side too: internal stakeholder reviews, security or procurement steps, budget approval, whatever {{key_milestones_known}} and the deal's nature actually require. For each milestone: a target date worked backward from {{target_close_date}}, not forward from today (working backward surfaces whether the timeline is actually realistic before committing to it), an owner named from {{stakeholders_both_sides}} — never "TBD" or an unowned milestone, since an unowned step is the single most common place a mutual action plan quietly stalls — and any milestone it depends on finishing first.

DEPENDENCY FLAGS
Call out explicitly any milestone that depends on a step owned by the other side finishing first, since dependency chains crossing between the two organizations are where mutual action plans most often break down silently — our side waiting on their internal approval, with neither side proactively checking in on it, is a specific and common failure this plan needs to make visible rather than hide inside a flat list.

RISK-DRIVEN ADJUSTMENTS
Given {{risks_identified}}, flag which milestone in the plan is most likely to slip, and build in one specific buffer or check-in point around it rather than pretending the plan will execute exactly as drafted.

HOW TO PRESENT IT
Write one short paragraph of framing language for introducing this plan to {{stakeholders_both_sides}} that positions it as something built together in the next conversation, not something delivered as a finished document — a mutual action plan the buyer had no hand in shaping tends to get treated as the vendor's homework rather than a shared commitment, and the framing should invite them to adjust dates or add missing steps rather than simply asking them to sign off on what's already been decided.

OUTPUT FORMAT
1. The full milestone table: milestone, owner, target date, dependency.
2. The dependency flags.
3. The risk-driven adjustment and where the buffer goes.
4. The framing paragraph for introducing it.`,
    variables: [
      {
        name: 'company_name',
        description: 'The account this plan is for',
        example: 'Larkspur Financial Group',
        required: true,
      },
      {
        name: 'product_or_service',
        description: 'What is being sold',
        example: 'a fraud-detection platform for mid-size banks',
        required: true,
      },
      {
        name: 'target_close_date',
        description: 'The date this plan is built backward from',
        example: 'September 30, 2026',
        required: true,
      },
      {
        name: 'key_milestones_known',
        description: 'Milestones already known to be needed from prior conversations',
        example: 'a security review, a pilot with two branches, and CFO budget sign-off',
        required: true,
      },
      {
        name: 'stakeholders_both_sides',
        description: 'Who is involved on our side and theirs',
        example:
          'our implementation lead and their IT director on the technical side; their CFO and our AE on the commercial side',
        required: true,
      },
      {
        name: 'risks_identified',
        description: 'Anything already visible that could slip this timeline',
        example:
          'their IT director mentioned being short-staffed through the next two months',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'DealHub'],
    tags: [
      'mutual-action-plan',
      'close-plan',
      'enterprise-sales',
      'deal-management',
      'b2b-sales',
    ],
    whyItWorks:
      "Requiring milestones on both sides, not just the vendor's, is what actually distinguishes a mutual action plan from a project timeline disguised as one — a plan that only lists what the seller owes the buyer reads as a sales-driven pressure document the moment the buyer notices they have no listed obligations of their own, and buyers who've been through enough vendor cycles notice that asymmetry immediately. Working milestone dates backward from the target close date, rather than forward from today, surfaces a specific and valuable piece of information before it becomes a crisis: if working backward from a real close date produces a milestone that needs to start yesterday, that's evidence the target date itself may be unrealistic, and it's far better to discover that in a planning exercise than three weeks into a schedule that was quietly impossible from the start. Mandating a named owner for every milestone, with an explicit ban on 'TBD,' targets the most common way these plans fail in practice: an unowned step doesn't get missed dramatically, it just sits, because nobody on either side experiences it as their specific job to move forward, and a plan with even one unowned milestone effectively has an unmonitored gap built into it. Explicitly flagging cross-organizational dependencies — a milestone on our side waiting on an internal approval on theirs — matters because that exact kind of dependency is invisible in a flat milestone list and only becomes visible when someone notices the date has already passed, at which point recovering lost time is much harder than it would have been to build in a proactive check-in from the start. The framing-language requirement reflects a real, documented dynamic in how these plans get received: a mutual action plan presented as a finished, vendor-authored document tends to get treated by the buyer as the vendor's own project artifact rather than a shared commitment, while one explicitly introduced as a draft to be shaped together invites the buyer's own edits and, more importantly, their own sense of ownership over hitting the dates.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-champion-enablement-internal-pitch-onepager',
    category: 'sales',
    title:
      'Give your internal champion the ammo to sell the deal when you are not in the room',
    description:
      'Turns what you know about a deal into a one-page internal pitch your champion can forward or present in their own voice, pre-armed against the specific internal objection you never get to hear directly.',
    promptText: `{{champion_name}} at {{company_name}} is championing {{product_or_service}} internally but needs to convince {{internal_stakeholders}}, who I have no direct access to. Likely priorities of those stakeholders: {{stakeholder_priorities}}. The internal concern I'm most worried about surfacing without me there to respond: {{anticipated_objection}}. A named alternative that was evaluated, if any: {{competing_option}}.

Write a one-page internal pitch document {{champion_name}} could forward or present, written entirely in their voice — a colleague recommending something they believe in to their own team, never a vendor pitching a customer, and never a document that reads as though it was obviously drafted by us and merely signed by them.

1. PROBLEM FRAMING — two sentences describing the problem in {{company_name}}'s own operational language, not our marketing language, grounded in something {{champion_name}} has actually said matters to them.

2. WHY NOW — the specific cost of waiting, tied directly to {{stakeholder_priorities}}, not a generic urgency line that could apply to any unaddressed problem at any company.

3. WHAT WAS EVALUATED — if {{competing_option}} is given, one paragraph contrasting fairly and specifically, framed around this company's actual priorities rather than a generic feature comparison; if {{competing_option}} is empty, skip this section outright rather than inventing a comparison against nothing, since a fabricated "here's what else we looked at" section is easy for a sharp internal stakeholder to spot as filler.

4. PRE-EMPTIVE ANSWER TO THE HARD QUESTION — address {{anticipated_objection}} directly, written as {{champion_name}} raising and answering it themselves before anyone else in the room does, not as a rebuttal that reads like it's coming from us through them. A champion who proactively names the objection under their own steam reads as someone who's thought it through; the identical content presented as a canned vendor rebuttal reads as coached.

5. THE ASK — the one specific decision or approval needed next, stated plainly, with no ambiguity about who needs to do what by when.

CONSTRAINTS
Under 400 words total. No vendor superlatives anywhere — no "best-in-class," "cutting-edge," "revolutionary," or similar — since those phrases are the fastest way to make a document read as vendor-authored regardless of whose name is on it. Write nothing {{champion_name}} couldn't personally defend if directly challenged on it in the room; if a claim would require them to say "that's what the vendor told me" rather than "that's what I believe," rewrite it or cut it.

HONESTY CHECK
If {{anticipated_objection}} is something this pitch genuinely can't pre-empt convincingly given what's actually known, say so rather than forcing a confident-sounding answer that would leave {{champion_name}} exposed the moment a sharp follow-up question tests it.`,
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
      "Champion enablement is named as its own concept inside MEDDIC's Champion pillar for a specific reason: a champion with real motivation but no ammunition still loses internal battles, because they get asked a hard question in a room the vendor is never in and, without something prepared, either improvise an answer that undersells the case or defer the question entirely, both of which stall the deal at exactly the moment it needed to move forward. Writing the document in the champion's own voice rather than vendor voice is what actually makes it usable rather than merely well-written — a document that reads as obviously vendor-authored loses credibility the instant a champion forwards it under their own name, because the recipient's first read is 'did they write this or did the vendor,' and any hint of the latter discounts everything in it regardless of how accurate the content is. The instruction to skip the competing-option section entirely rather than invent one, and to ban vendor superlatives outright, both target the same underlying risk from different angles: a pitch that oversells itself with generic marketing language or manufactures a comparison against nothing is the fastest way to convert a champion's credible internal voice back into a recognizable vendor pitch, undoing the entire point of writing it in their voice in the first place. Requiring the pre-emptive objection answer to be framed as the champion raising it themselves, rather than as a rebuttal coming through them from the vendor, exploits a real credibility asymmetry: the same content lands very differently depending on whether it sounds like independent judgment or a coached response, and a stakeholder pushing on {{anticipated_objection}} is specifically testing whether the champion has genuinely thought it through, which a canned-sounding rebuttal fails even when its logic is sound. The closing honesty check exists because not every objection can be credibly pre-empted with the information actually available, and a model instructed only to 'write a pre-emptive answer' will produce one regardless, arming the champion with a confident answer that collapses under a sharp follow-up question — which is a worse outcome for the champion's credibility than walking in with an honest 'we're still working through that' answer to the same question.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-cfo-roi-business-case-onepager',
    category: 'sales',
    title:
      'Build the ROI business case the CFO will actually read, not the deck your champion saw',
    description:
      "Writes a quantified, numbers-first ROI justification aimed at an economic buyer who wasn't in any of the discovery calls, structured to survive the specific scrutiny a finance stakeholder applies that a champion never would.",
    promptText: `I need a business-case document aimed at {{cfo_name_or_title}} at {{company_name}}, who has not been on a single call with us and will read this cold, applying a level of financial scrutiny that {{champion_name_if_any}} never did.

What we sell: {{product_or_service}}. The quantified cost of the problem today, as specifically as it's known: {{quantified_cost_of_problem}}. The expected ROI or payback timeline: {{expected_roi_or_payback}}. Other budget priorities this is competing against for approval: {{competing_priorities}}.

WRITE FOR A SKEPTICAL FINANCIAL READER
A CFO reading this is not evaluating whether the product is good; they're evaluating whether the number being asked for is the best use of that specific amount of money against every other use of it this quarter. Write accordingly: lead with the cost of the current problem in {{quantified_cost_of_problem}}, stated as a number, not a narrative — a CFO who reads "significant inefficiencies" has learned nothing, while one who reads a specific dollar or hour figure has something to actually evaluate. Follow immediately with {{expected_roi_or_payback}}, stated with its actual assumptions visible, not hidden behind a headline multiple — if the ROI figure assumes a specific adoption rate, time savings per employee, or volume figure, name that assumption explicitly rather than presenting the output number alone, since a CFO who can't see the assumption behind a number will either distrust the number or, worse, quietly discount it without saying so.

ADDRESS THE COMPETING-PRIORITIES REALITY
Acknowledge directly, in one section, that this spend is competing against {{competing_priorities}} for the same limited budget — do not write as if this is the only decision on the CFO's desk this quarter. Make the case for why this specific spend clears the bar relative to typical hurdle rates for a purchase like this, not by claiming it's more important than everything else in the abstract, but by being explicit about the payback timeline and the downside of not acting, so the CFO has an actual comparison point rather than a vague appeal to priority.

RISK AND DOWNSIDE SECTION
Include one honest section on what happens if the projected ROI doesn't fully materialize — the realistic downside case, not just the best case. A business case with only an upside scenario reads as sales material to a financial reader trained to look for exactly what's missing; naming the downside case, even briefly, is what signals this was written with their scrutiny in mind rather than around it.

FORMAT
One page, numbers-first, no product screenshots or feature descriptions — a CFO business case is not a product pitch, and any section that reads like one should be cut. Use a simple cost-versus-benefit structure a finance reader could summarize in one sentence to their own boss.

HONESTY CHECK
If {{quantified_cost_of_problem}} or {{expected_roi_or_payback}} is genuinely soft — an estimate with no real supporting data behind it — say so plainly rather than presenting it with false precision; a CFO who catches one unsupported number in a business case will discount every other number in it too, even the solid ones.`,
    variables: [
      {
        name: 'cfo_name_or_title',
        description: 'The economic buyer this document is actually aimed at',
        example: 'the CFO, Grace Halvorsen',
        required: true,
      },
      {
        name: 'company_name',
        description: 'The buying company',
        example: 'Windmere Manufacturing',
        required: true,
      },
      {
        name: 'product_or_service',
        description: 'What is being proposed',
        example: 'a predictive-maintenance platform for factory equipment',
        required: true,
      },
      {
        name: 'quantified_cost_of_problem',
        description:
          'The actual dollar or time cost of the current problem, as specifically as known',
        example:
          'unplanned downtime cost roughly $340,000 last year across two plants, per their own maintenance logs',
        required: true,
      },
      {
        name: 'expected_roi_or_payback',
        description: 'The expected return and its timeline, with assumptions',
        example:
          'projected 9-month payback assuming a 30% reduction in unplanned downtime, based on comparable deployments',
        required: true,
      },
      {
        name: 'competing_priorities',
        description: 'What else this spend is competing against for the same budget',
        example:
          'a planned ERP upgrade and a warehouse automation project both up for approval this quarter',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: [
      'roi',
      'business-case',
      'economic-buyer',
      'meddic',
      'enterprise-sales',
      'b2b-sales',
    ],
    whyItWorks:
      "Leading with a specific dollar or time figure rather than a narrative description of the problem is what separates a document a CFO can actually act on from one they set aside: a financial reader evaluating a spend request is looking for a number to run against a hurdle rate or a comparison, and a phrase like \"significant inefficiencies\" gives them nothing to compute, forcing them to either ask a follow-up question that delays the decision or discount the request as insufficiently substantiated. Requiring the ROI figure's underlying assumptions to be stated explicitly, rather than presenting a clean headline multiple alone, targets a specific and well-founded skepticism financial readers bring to vendor-supplied numbers: an ROI figure with no visible assumption is functionally unfalsifiable, and a sophisticated reader's response to an unfalsifiable number is not belief, it's quiet discounting, which produces the same practical outcome as not including the number at all, just with the CFO's trust in the rest of the document eroded along the way. Explicitly acknowledging that this spend is competing against other real budget priorities, rather than writing as if this were the only decision on the desk, reflects the actual context a CFO evaluates any request within — a business case that argues for the product's value in isolation is answering a question the CFO isn't actually asking, since their real question is comparative: does this specific spend clear the bar better than the other things I could spend the same money on this quarter. Including an honest downside section is arguably the single highest-leverage element of the whole document, because financial readers are specifically trained to notice what's conspicuously absent from an all-upside pitch, and a business case that names its own realistic downside signals it was written with their scrutiny already anticipated rather than written to survive it by omission — which is exactly the difference between a document a CFO trusts enough to approve and one they file as sales collateral.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-04' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Claude (Sonnet 4.5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'sales-deal-risk-assessment-before-forecast-call',
    category: 'sales',
    title: 'Stress-test a deal before you call it committed on the forecast',
    description:
      "Runs a specific deal's signals against the documented ways B2B deals actually slip, so real risk gets flagged before a forecast call instead of after the deal slides another quarter, with one reason driving the risk level, not an averaged score.",
    promptText: `I need an honest risk read on this deal before I call it {{forecast_category}} on our forecast.

Deal: {{company_name}}, {{deal_value}}, expected close {{expected_close_date}}.
Last contact: {{last_contact_date}} with {{last_contact_person}}.
Stakeholders engaged so far: {{stakeholders_engaged}}.
Economic buyer confirmed: {{economic_buyer_status}}.
Next step booked: {{next_step_status}}.
Anything that's changed or gone quiet recently: {{recent_changes}}.

Assess this deal against these documented ways deals slip, and for each, tell me plainly whether it applies here and how strongly, with one supporting sentence grounded in the actual details above, not a generic statement that would apply to any deal:
1. SINGLE-THREADED — only one stakeholder engaged, no direct relationship with the actual economic buyer
2. NO CONFIRMED NEXT STEP — momentum described in words but nothing calendared with a date
3. VERBAL YES, NO PROCESS — enthusiasm expressed without a confirmed decision process, approval chain, or timeline behind it
4. GOING QUIET — a drop in responsiveness that doesn't match the urgency the deal supposedly has
5. COMPETITIVE OR STATUS-QUO RISK — a real alternative, including "do nothing," that hasn't actually been ruled out

OVERALL RISK LEVEL
Give me an overall risk level — Low, Medium, or High — with the ONE reason actually driving that level, not an average across all five categories. A deal that's High risk because of one severe factor and Low risk on the other four is still High risk overall; averaging the five into a comfortable Medium hides exactly the thing that matters most.

SINGLE NEXT ACTION
Give me the single next action that would most reduce risk — not a list of five things to do, since a list of five equally-weighted actions is how a real risk gets buried among lower-priority housekeeping tasks and nothing actually gets fixed before the next forecast call.

WILLINGNESS TO DOWNGRADE
Be willing to tell me this deal should move to a later quarter or be marked at-risk even if that's not what I want to hear going into the forecast call — a forecast that already has this deal counted as {{forecast_category}} creates real pressure to find reasons it's fine, and the read here needs to hold up against that pressure, not accommodate it.

FORMAT
A short table for the five risk categories (category, applies?, strength, supporting detail), followed by the overall risk level and reason, the single next action, and one closing sentence naming the specific evidence that would change this read if it came in before the forecast call.`,
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
        name: 'stakeholders_engaged',
        description: 'Who has actually been part of the conversation so far',
        example: 'one ops manager; no one from finance or leadership has joined a call',
        required: true,
      },
      {
        name: 'economic_buyer_status',
        description: 'Whether the actual budget owner has been identified and engaged',
        example:
          'named but never joined a call, all info is secondhand from the ops manager',
        required: true,
      },
      {
        name: 'next_step_status',
        description: 'Whether a concrete next step with a date is on the calendar',
        example: 'no, they said they would "circle back after budget review"',
        required: true,
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
      'The five-category checklist is built from documented, recurring reasons enterprise deals slip — single-threading, verbal-yes-without-process, and unconfirmed next steps are the same signal categories revenue-intelligence platforms like Clari and Gong quantify from call and email metadata at scale, and this prompt applies the same underlying logic manually from what a rep already knows, without needing that instrumentation to reach a similar diagnosis. Requiring one supporting sentence grounded in the actual deal details for each category, rather than a bare applies-or-not judgment, forces the assessment to stay falsifiable against the real facts of this specific deal instead of collapsing into a generic risk checklist that would read identically for any deal handed to it. Forcing one reason to drive the overall risk level, instead of an averaged score across all five categories, closes the most common failure of a risk write-up that nets out to a comfortable, non-actionable "medium" — a deal that\'s severely single-threaded but otherwise fine on paper is genuinely high-risk, and averaging that severe factor against four calmer ones produces a number that actively hides the one thing a manager reviewing the forecast most needs to see. The explicit instruction to name a single next action rather than a list matters for the same reason a triage room treats one critical patient differently from five stable ones: a list of five equally-weighted to-dos diffuses accountability and attention across all of them, and in practice a rep under time pressure will pick whichever is easiest to do, not whichever most reduces actual risk, so forcing a single answer removes that easy-option escape hatch. The explicit instruction to be willing to downgrade the forecast counters a specific and well-known sunk-cost dynamic in forecast calls: a rep who has already mentally or verbally committed a deal to their manager has a structural incentive to round every ambiguous signal upward rather than down, and an assessment tool that doesn\'t explicitly counteract that incentive will tend to confirm whatever category the rep walked in wanting to hear.',
    exampleOutput:
      'Overall risk: HIGH. Driving reason: the economic buyer has never joined a call and everything about their position is secondhand from the ops manager — this is a single-threaded deal wearing a "commit" label. Single next action: get a call booked with the named economic buyer before this stays on the forecast at this stage.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-competitor-battle-card-builder',
    category: 'sales',
    title: 'Build a competitor battle card you can actually use mid-call',
    description:
      'Turns what you know about a named competitor into a scannable, honest battle card — including where they beat you — built for a glance mid-call, not a slide nobody reads, with proof points flagged as illustrative or verified.',
    promptText: `Build a battle card for when we're up against {{competitor_name}} in a deal. What we know about them: {{competitor_known_info}}. Our actual differentiation, as far as we can honestly claim it: {{our_differentiation}}. Deals we've won or lost against them before: {{past_deal_history}}.

Structure it for a rep to glance at mid-call, not read as a full document — every section needs to be scannable in the ten seconds before unmuting, not comprehensive:

1. WHEN THEY COME UP — the one-sentence version of how prospects typically describe {{competitor_name}} when comparing us, based on {{past_deal_history}} if given; if no deal history exists yet, base this on {{competitor_known_info}} instead and say plainly that it's an inference rather than a pattern observed across real deals.

2. WHERE THEY'RE ACTUALLY STRONGER — be honest here, at least one real point, using {{competitor_known_info}}. A battle card that claims we win everywhere gets a rep caught flat-footed the first time a prospect raises the exact strength the card never mentioned, and the rep's credibility takes the hit, not the card's.

3. WHERE WE WIN — {{our_differentiation}}, stated as buyer-facing outcomes a prospect would actually care about, not internal feature comparisons a prospect has no way to evaluate on their own.

4. LANDMINES TO AVOID SETTING OFF — specific questions or claims that would let {{competitor_name}} counter easily if the rep raises them unprompted; a battle card should tell a rep what not to say just as much as what to say.

5. THREE PROOF POINTS — customer outcomes or specifics the rep could cite live on a call, each explicitly flagged as either a verified fact confirmed with a named account, or an illustrative example that shouldn't be cited as a specific customer result if pressed for the account name.

6. ONE QUESTION TO ASK — a question that surfaces whether the prospect's actual stated priorities favor us over {{competitor_name}}, phrased so it never requires badmouthing the competitor to work.

LENGTH DISCIPLINE
Each section capped at two to three lines. If a section can't be made scannable at that length without losing the substance that actually matters, that's a signal the underlying information is too thin or too complicated for this battle card format — say so rather than quietly writing a longer section that breaks the scannability the whole card depends on.

HONESTY CHECK
If {{past_deal_history}} is empty or too thin to support a real pattern, say so in section 1 rather than writing a confident-sounding "how prospects typically describe them" line based on no actual deal evidence — an inferred pattern presented as an observed one is the fastest way for this card to mislead the exact rep relying on it to be accurate mid-call.`,
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
      "The explicit \"where they're actually stronger\" section targets the single biggest structural failure mode of internally-written battle cards: content that only lists advantages reads as marketing collateral rather than intelligence, and a rep who trusts a one-sided card gets genuinely blindsided the first time a prospect raises the exact weakness the card conveniently never mentioned, at which point the rep looks unprepared in front of the buyer through no fault of their own preparation. Flagging every proof point as illustrative versus verified stops the model from inventing a customer outcome that sounds precisely like a citable statistic but isn't something the rep can actually back up if a prospect asks for the account name on a live call — the difference between those two categories is invisible in the text of the proof point itself, which is exactly why it has to be labeled rather than left for the rep to discover the hard way mid-conversation. The line-capped, scannable format matches how battle cards actually get used in the field rather than how they get written in an enablement meeting: glanced at in the seconds before unmuting on a call, not read start to finish like a memo, and a card that fails the ten-second scan test in practice gets ignored entirely regardless of how accurate its content is, making length discipline a functional requirement, not a stylistic preference. The honesty check on {{past_deal_history}} matters because a pattern inferred from zero or one data point and a pattern actually observed across several real deals are different claims wearing the same confident sentence structure, and a rep repeating an inferred pattern to a prospect as if it were a track record is making a claim the data doesn't actually support — which is a small credibility risk in the moment but a compounding one if the prospect happens to reference a customer who had the opposite experience.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-renewal-upsell-value-talk-track',
    category: 'sales',
    title: 'Build a renewal or upsell conversation around value already delivered',
    description:
      'Turns account usage and outcome data into a renewal or expansion talk track that leads with proof of value realized, so pricing becomes the second conversation, not the opener, with an honest check on whether the usage story actually supports it.',
    promptText: `Renewal or expansion conversation coming up with {{account_name}}, {{renewal_or_upsell}}, current contract ends {{contract_end_date}}.

What we know about their usage and outcomes: {{usage_data}}
Original goal when they signed: {{original_goal}}
Any friction or underuse we should acknowledge honestly: {{friction_points}}
What we want to propose: {{proposed_change}}

Build a talk track for this conversation in this order:

1. OPEN with a specific outcome from {{usage_data}} tied directly back to {{original_goal}} — proof stated as a number or concrete result wherever {{usage_data}} allows it, not a generic "thank you for being a customer" line that offers no evidence the relationship actually delivered anything.

2. If {{friction_points}} is filled in, acknowledge it directly before moving on to the pitch — do not let the value story quietly paper over a real problem the account will bring up themselves the moment the value pitch finishes; naming it first removes their easiest way to discount everything said afterward.

3. Bridge to {{proposed_change}} as the logical next step given the outcome just described, framed as a continuation of the value story rather than a separate pricing conversation that happens to follow it — the bridge sentence should make the proposed change feel like the natural next chapter of a story already in progress, not a new ask layered on top of an unrelated recap.

4. Handle the single most likely pushback specific to whether this is a renewal or an upsell — for a renewal, that's typically "why increase the price for the same thing we already have"; for an upsell, it's typically "we're not even fully using what we already pay for" — and give the actual response to whichever one applies, grounded in {{usage_data}} and {{friction_points}}, not a generic renewal-pushback script.

5. Close with one specific next step and date, never "let's stay in touch" or an open-ended "let me know your thoughts" — a renewal or upsell conversation without a concrete next step is a conversation that will need to be restarted from scratch closer to the actual deadline.

FORMAT
Write it as talking points a rep would use live on a call, in natural spoken phrasing, not a script to be read verbatim word for word.

HONESTY CHECK
If {{usage_data}} doesn't actually support a strong value story — thin, ambiguous, or contradicted by {{friction_points}} — say that plainly instead of manufacturing a confident value narrative from weak or missing evidence; a renewal pitch built on an overstated value claim is the fastest way to get directly and awkwardly contradicted by the account's own team in the room.`,
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
      "Leading with a specific usage outcome tied back to the original signing goal is the standard alternative to a discount-led renewal opener for a structural reason: framing the conversation around realized value tends to hold up better under later pushback than a discount-led approach, because a price-led opener invites a price-led objection by default — the first thing said sets the frame for everything that follows, and opening on price makes price the frame for the entire call. Acknowledging real friction before the value pitch, not after or not at all, matters because a customer who has a genuine underuse or rollout complaint will bring it up themselves the moment the rep finishes an all-upside recap, and a rep who's already named it first has removed the account's easiest and most obvious way to discount the rest of the pitch — silence on a known problem doesn't make the account forget it exists, it just guarantees they'll be the one to raise it, on their terms, at a moment the rep didn't choose. Framing the pricing or expansion ask as the next chapter of an ongoing value story, rather than a separate conversation appended after the recap, exploits a real difference in how the same ask is received depending on its framing: an ask that flows narratively out of a demonstrated result reads as an earned continuation, while the identical ask presented as an unrelated new topic reads as the real reason the call was scheduled, with the value recap functioning as a transparent lead-in to soften it. The instruction to admit when {{usage_data}} doesn't actually support a strong story is a direct guard against the model manufacturing a confident value narrative from thin or genuinely weak inputs — a renewal pitch that overstates value the account's own team can see isn't real risks getting directly and visibly contradicted in the room, which damages trust in every future conversation with that account far more than simply not having a strong value story to lead with in the first place.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-qbr-agenda-for-renewing-account',
    category: 'sales',
    title:
      'Build a quarterly business review agenda that earns the renewal conversation instead of ambushing it',
    description:
      "Structures a QBR agenda for an enterprise account around usage evidence and a named risk, so the renewal or expansion discussion at the end lands as an earned conclusion rather than a surprise pivot the account didn't see coming.",
    promptText: `I have a quarterly business review coming up with {{account_name}}, renewal date {{renewal_date}}, and want the agenda structured so the renewal or expansion conversation at the end feels like an earned conclusion, not a surprise pivot after a generic check-in.

Usage and outcome data since the last QBR or since signing: {{usage_data}}. Who's attending from their side: {{stakeholders_attending}}. A specific expansion opportunity worth raising, if there is one: {{expansion_opportunity}}. A known risk or open concern on the account: {{known_risk}}.

AGENDA STRUCTURE
Build the agenda in this order, each with a time estimate against a total of roughly 45 minutes unless told otherwise:
1. RECAP OF GOALS SET LAST TIME — one or two sentences restating what success was supposed to look like when this account last set goals, so the review has a stated baseline to measure against rather than starting from an ungrounded "how's everything going."
2. RESULTS AGAINST THAT BASELINE — the specific outcomes from {{usage_data}}, stated as numbers or concrete results wherever the data allows, mapped directly back to the goals just restated — a QBR that shows usage statistics with no link back to a stated goal is showing activity, not value.
3. THE HONEST PART — address {{known_risk}} directly and specifically, not folded into a vague "any feedback for us?" prompt that lets it go unspoken if the account doesn't volunteer it themselves; naming a known risk first, before the account has to raise it, signals the relationship can handle honesty and builds more trust than pretending it isn't there.
4. FORWARD LOOK — if {{expansion_opportunity}} is filled in, introduce it here as a natural extension of the results just shown, grounded in something specific from {{usage_data}} or the account's own stated goals, not a generic upsell pitch dropped into an unrelated slot; if it's empty, skip this section rather than forcing a manufactured expansion angle that isn't actually grounded in anything real about this account.
5. RENEWAL OR NEXT STEPS — close with the specific ask relevant to {{renewal_date}}'s proximity, with a concrete next step and date, not an open-ended "let's regroup soon."

MULTI-STAKEHOLDER HANDLING
Given {{stakeholders_attending}}, flag if any listed attendee is likely to care about a different part of this agenda than the others — a technical stakeholder attending mainly to hear about the risk item, alongside a business stakeholder mainly there for the renewal conversation, changes how much time each section should actually get.

HONESTY CHECK
If {{usage_data}} doesn't clearly connect back to the goals stated in section 1, say so directly in the agenda draft rather than forcing a connection that isn't really there — a QBR that overstates the link between activity and outcome is exactly the kind of review a sophisticated account stakeholder will quietly stop trusting after noticing the gap once.`,
    variables: [
      {
        name: 'account_name',
        description: 'The account this QBR is for',
        example: 'Corville Distribution Partners',
        required: true,
      },
      {
        name: 'renewal_date',
        description: 'When the contract is up for renewal',
        example: 'November 15, 2026',
        required: true,
      },
      {
        name: 'usage_data',
        description:
          'What actually happened with usage and outcomes since the last review',
        example:
          'onboarded two new regional teams onto the platform, ticket resolution time down 22% quarter over quarter',
        required: true,
      },
      {
        name: 'stakeholders_attending',
        description: "Who's actually going to be in the room from their side",
        example:
          'the VP of Operations who signed originally, and a new Ops Manager who joined last quarter',
        required: true,
      },
      {
        name: 'expansion_opportunity',
        description: 'A specific, grounded expansion angle worth raising, if one exists',
        example:
          'the two new regional teams are still on the base tier, which caps the reporting dashboards they clearly want based on their usage patterns',
        required: false,
      },
      {
        name: 'known_risk',
        description: 'A real, known concern or open issue on this account',
        example:
          'the new Ops Manager mentioned in passing that leadership questioned the cost at a recent budget review',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gainsight'],
    tags: [
      'qbr',
      'account-management',
      'customer-success',
      'renewal',
      'enterprise-sales',
      'b2b-sales',
    ],
    whyItWorks: `Structuring the agenda around a restated baseline before showing results is what turns a QBR from a status update into an actual review: usage statistics presented with no reference back to a goal the account itself set are, from the account's perspective, just activity metrics, and activity metrics don't independently make the case for renewal or expansion the way outcomes measured against a stated goal do — the baseline restatement is what gives the later numbers a frame to be evaluated against instead of floating unanchored. Addressing the known risk in its own explicit section, rather than folding it into an open-ended feedback prompt at the end, matters because a vague "anything on your mind?" question relies entirely on the account volunteering a concern that may feel awkward or political to raise unprompted, while naming it directly signals the relationship is secure enough to handle the conversation head-on — accounts that have a known concern sitting unaddressed under the surface of an otherwise upbeat QBR tend to notice the omission, and noticing it erodes trust more than the concern itself would have. Making the expansion pitch, when there is one, an extension of results already shown rather than an unrelated new topic exploits the same narrative-continuation logic that works in renewal conversations generally: an ask that flows out of a result just demonstrated reads as earned, while the identical ask dropped into an agenda with no connection to what came before reads as the real reason for the meeting, undermining the credibility of the review that preceded it. The instruction to skip the expansion section entirely when no real angle exists, rather than manufacturing one, protects the format's core value: a QBR whose closing pitch is grounded in nothing real about this specific account teaches that stakeholder to treat every future QBR as a sales call with extra slides, which defeats the purpose of the format the very first time it's noticed.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-call-transcript-to-crm-fields',
    category: 'sales',
    title: 'Turn a call transcript into structured CRM notes, not a wall of text',
    description:
      "Converts raw call notes or a transcript into the specific fields a CRM opportunity record actually uses, marking anything not genuinely discussed as such instead of a confident-sounding guess, so the next person on the deal doesn't have to re-read the whole call.",
    promptText: `Here are my raw notes or transcript from a call with {{contact_name}} at {{company_name}}: {{raw_notes}}

Convert this into structured CRM notes using these exact fields, in this exact order — leave a field explicitly marked "not discussed" rather than guessing or leaving it blank, since a blank field looks like an oversight while "not discussed" is an honest, useful signal to whoever reads this next:

- CALL SUMMARY — two to three sentences, what actually happened on the call, not what was hoped to happen
- PAIN OR USE CASE — their stated problem, in their own words wherever possible, not a paraphrase that sounds more like a product pitch than what they actually said
- METRICS — any number, quota, or measurable outcome they mentioned, quoted directly if possible
- ECONOMIC BUYER — a named person, or "not yet identified" if nobody specific was named
- DECISION CRITERIA — what they said they'll evaluate options against, or "not discussed" if this never came up
- DECISION PROCESS OR TIMELINE — the actual steps and dates mentioned, or "not discussed" if none were given
- COMPETITION — named alternatives they mentioned, or "none mentioned" if the call gave no signal either way
- RISKS OR OPEN QUESTIONS — anything unresolved, concerning, or contradictory from the call that the next person reading this should know about before acting on the deal
- NEXT STEP — the specific committed action and date, exactly as agreed on the call — never write a next step that sounds resolved if it wasn't actually confirmed before the call ended

RULES
Do not infer a field from vague or adjacent language if it wasn't actually said directly — a prospect saying "we're pretty deliberate about these decisions" is not the same as stating an actual decision process, and writing it into the DECISION PROCESS field as if it were specific detail manufactures a false sense of qualification for whoever reads this next. Keep each field to one or two lines maximum; if a field needs more than that to capture what happened, that's usually a sign the raw notes need a follow-up call to actually clarify it, not a longer CRM note. Flag explicitly if NEXT STEP wasn't actually confirmed on the call, rather than writing one that reads as settled — a next step invented to make the notes look complete is worse for pipeline hygiene than an honestly blank one, because nobody will think to double-check something that already looks resolved.

OUTPUT FORMAT
The nine fields, in the order given, ready to paste directly into a CRM opportunity record.`,
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
      'The fixed field list mirrors the actual opportunity-record structure most CRMs use and maps directly onto MEDDIC fields many sales orgs already require reps to fill in, so the output can be pasted straight into the record rather than translated by hand from a loose narrative summary first. The "not discussed" instruction is the load-bearing rule in the entire prompt: AI-generated call summaries left unconstrained tend to smooth over genuine gaps by inferring a plausible-sounding answer from adjacent context, which quietly corrupts CRM data in a way that\'s much harder to catch than an obvious error — a fabricated-sounding but wrong Economic Buyer field is worse than an honestly empty one, because the next rep who opens the deal has no visible reason to double-check something that already reads as settled fact. The rule against inferring a decision process from vague language like "we\'re pretty deliberate about these decisions" targets a specific and common failure mode: that sentence signals a general disposition, not an actual named process with real steps, and a model asked to fill in a Decision Process field will otherwise happily convert atmosphere into apparent detail, manufacturing a false sense of qualification that the rest of the deal team then unknowingly relies on. Flagging an unconfirmed next step rather than writing a tidy, resolved-sounding one directly targets pipeline hygiene at its most common failure point, since a vague or missing next step is one of the most frequently cited reasons deals stall without anyone noticing — and a next step that\'s been quietly invented to make the notes look complete is actually worse than a missing one, because nobody flags a field that already looks fine for a follow-up check.',
    exampleOutput:
      'ECONOMIC BUYER: not yet identified — Tomas said he\'d "check with his boss," name not given.\nNEXT STEP: not confirmed — no date was set on the call; flag for follow-up to lock one in before this deal ages further.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-to-cs-handoff-brief-at-close',
    category: 'sales',
    title: 'Write the sales-to-CS handoff that keeps every promise made during the sale',
    description:
      'Structures the account context, commitments, and risk flags a closing rep hands to customer success, so a promise made during the sales cycle does not quietly disappear the moment the account changes hands.',
    promptText: `This deal at {{account_name}} just closed and I need to hand it off to customer success without any promise or context getting lost in the transition. Deal summary: {{deal_summary}}. Specific promises or commitments made during the sales cycle: {{promises_made_during_sale}}. Key stakeholders and their roles: {{key_stakeholders}}. Any known risks or red flags from the sales process: {{known_risks_or_red_flags}}. What success looks like for this account, in their own stated terms: {{success_criteria}}.

WRITE THE HANDOFF BRIEF
1. WHO'S WHO — {{key_stakeholders}}, each with their actual role in the decision, not just their job title — who was the champion, who was the economic buyer, who was skeptical, who barely showed up to calls but will likely resurface post-sale as a day-to-day user. CS walking in blind to who actually mattered during the sale wastes their first several interactions rebuilding context that already exists.

2. WHAT WAS PROMISED — every specific commitment from {{promises_made_during_sale}}, stated plainly enough that CS could be held to the exact same standard the prospect heard during the sales cycle. If any commitment was informal or made in passing rather than formally documented in the contract, flag it as such rather than letting it blend in with the contractual commitments — an informal promise that CS doesn't know about is the single most common source of a customer's very first complaint post-close, and it's almost always something the sales team said with good intentions that never made it into any document CS actually has access to.

3. WHAT SUCCESS LOOKS LIKE — {{success_criteria}} in the customer's own words wherever possible, not a rephrased version that drifts toward generic product-success language; if the customer defines success narrowly and specifically, CS needs that exact framing to know what "on track" actually means for this account, not a generic health-score proxy.

4. RISK FLAGS — {{known_risks_or_red_flags}}, stated directly with enough context that CS understands not just that a risk exists but why it matters and what to watch for — a risk flag with no context attached tends to get treated as boilerplate and skipped over the same way generic disclaimers get skipped.

5. FIRST 30 DAYS — based on everything above, name the single highest-priority thing CS should do or check on in the first month, and the single thing most likely to go wrong if nobody does anything differently from a standard onboarding.

CONSTRAINT
Write this for someone who was in none of the sales calls and has zero context beyond what's in this document — do not assume any shared context with the sales team that isn't explicitly written out here.

HONESTY CHECK
If {{promises_made_during_sale}} includes anything that sounds like it may have overstated what the product or team can actually deliver, flag it directly rather than passing it along at face value — a handoff brief that quietly launders an overpromise into an apparently normal commitment sets CS up to fail at something that was never realistic in the first place.`,
    variables: [
      {
        name: 'account_name',
        description: 'The account that just closed',
        example: 'Thornbury Retail Holdings',
        required: true,
      },
      {
        name: 'deal_summary',
        description: 'A short summary of the deal itself',
        example:
          '18-month contract, mid-tier plan, primary use case is inventory forecasting across 40 stores',
        required: true,
      },
      {
        name: 'promises_made_during_sale',
        description:
          'Specific commitments made during the sales cycle, formal or informal',
        example:
          'promised a dedicated onboarding specialist for the first 60 days and a custom report built for their regional manager view',
        required: true,
      },
      {
        name: 'key_stakeholders',
        description: 'Who was involved and what role they actually played',
        example:
          'the VP of Merchandising was the champion and economic buyer; the IT lead was mildly skeptical about data migration but came around after a technical call',
        required: true,
      },
      {
        name: 'known_risks_or_red_flags',
        description: 'Anything concerning that came up during the sales process',
        example:
          'the VP mentioned this is their second attempt at a forecasting tool after a failed rollout with a previous vendor two years ago',
        required: false,
      },
      {
        name: 'success_criteria',
        description: 'What the customer said success looks like, in their own terms',
        example:
          'wants to see stockout rate on their top 50 SKUs drop noticeably before their holiday planning cycle starts',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gainsight'],
    tags: [
      'handoff',
      'customer-success',
      'onboarding',
      'account-management',
      'b2b-sales',
    ],
    whyItWorks:
      "Separating who's who by actual role in the decision, rather than by job title alone, matters because job title tells CS almost nothing about how to prioritize their own early attention — a VP who barely engaged during the sale and an IT lead who quietly did the real evaluation work are both plausible holders of a senior title, and CS treating them identically because their titles look similar wastes the narrow early window where getting the right person's attention matters most. Explicitly flagging informal promises separately from contractual commitments targets what is, in practice, one of the single most common sources of a new customer's first complaint: a sales rep who tells a prospect something true and well-intentioned in the moment — a specific report will get built, a certain specialist will handle onboarding — that never makes it into any document CS actually has visibility into, so the promise simply evaporates from the record the instant the deal closes, and the customer's first interaction with CS becomes explaining a commitment CS has never heard of and has no way to independently verify was ever made. Capturing success criteria in the customer's own specific words, rather than translated into generic product-health language, is what lets CS actually tell the difference between an account that's healthy by a standard usage metric and one that's failing by the actual, narrower bar the customer set for themselves — a customer who defined success as a specific stockout-rate improvement before a specific seasonal deadline is not adequately served by a CS team tracking generic login frequency as their proxy for account health. The instruction to flag anything that sounds like it may have overstated deliverability, rather than passing every sales-cycle claim along at equal face value, protects CS from inheriting a doomed expectation without knowing it — a handoff that treats every promise as equally solid sets CS up to be blindsided by a customer holding them to a commitment the sales team may have made optimistically, and naming that risk at handoff time is meaningfully cheaper than discovering it three months in when the account is already unhappy.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
  {
    slug: 'sales-lost-deal-post-mortem-analysis',
    category: 'sales',
    title: 'Run an honest post-mortem on a lost deal before writing it off as "budget"',
    description:
      'Turns deal history and notes on a lost deal into a real post-mortem tested against documented loss-reason patterns, instead of accepting the reflexive one-word reason logged and forgotten, with one in-control and one out-of-control factor named separately.',
    promptText: `We lost this deal: {{company_name}}, logged reason "{{logged_loss_reason}}". Deal history and notes: {{deal_history}}. Stage at time of loss: {{stage_at_loss}}. Roughly how much time elapsed between the last real engagement and marking it lost: {{time_to_loss_confirmation}}.

Run a real post-mortem, not a rubber-stamp of the logged reason:

1. TEST THE LOGGED REASON — check "{{logged_loss_reason}}" against what {{deal_history}} actually shows evidence for, not what it's plausible to assume. Specifically check whether it looks like a proxy for something else — the most common pattern being a deal logged as "lost to competitor" or "budget" that the evidence actually supports reading as "no decision," where the prospect simply went quiet and did nothing, rather than actively choosing an alternative. If the deal history contains no actual mention of a competitor winning or an explicit budget rejection, say so plainly rather than accepting the logged label at face value just because it's already written down.

2. FIND THE EARLIEST RISK POINT — identify the earliest point in {{deal_history}} where this deal was already genuinely at risk, even if it didn't look that way at the time — name a specific stage, interaction, or event, not a vague "communication could have been better" that could describe any lost deal ever logged.

3. ONE THING WITHIN OUR CONTROL — name one specific, actionable thing that, if done differently at that earliest risk point, plausibly changes the outcome — it must be concrete enough to actually do differently next time, not "should have built more urgency," which is a diagnosis dressed up as an action.

4. ONE THING OUTSIDE OUR CONTROL — name one real factor that was genuinely outside the rep's control, so the takeaway from this post-mortem isn't "everything here was our fault" — a post-mortem that finds only self-blame is exactly as unhelpful as one that finds none.

5. THE LESSON — a one-line lesson that could actually be applied to the next deal at a similar stage, worth saying out loud in a pipeline review, not a vague platitude like "stay closer to the champion" that every post-mortem in history could equally have concluded with.

HONESTY CHECK
If {{deal_history}} genuinely doesn't contain enough detail to determine whether the logged reason holds up, say that plainly rather than forcing a confident-sounding verdict from thin evidence — a fabricated-sounding certainty about why a deal was lost is worse for the next deal than an honest "we don't actually know enough to say" that at least prompts better note-taking going forward.`,
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
      {
        name: 'time_to_loss_confirmation',
        description:
          'How long it took to actually confirm the deal was lost after engagement dropped off',
        example: 'about six weeks of silence before marking it lost',
        required: false,
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
    whyItWorks: `Testing the logged reason against the actual evidence in the deal history, rather than accepting it as settled, targets a well-documented pattern in B2B win/loss analysis: "no decision" — the prospect simply going quiet rather than actively choosing a competitor — is consistently one of the most common real outcomes in competitive deals, far more often than reps actually log it that way, because "lost to Competitor X" is a more comfortable, less self-implicating box to check than "I never got a next step after their reorg and let it go quiet." Requiring a specific, named earliest risk point rather than a generic "communication could have been better" observation forces the post-mortem to locate an actual moment in the deal's timeline, which is what makes the lesson from this deal transferable to a different deal at a similar stage — a vague communication critique applies equally to every lost deal ever logged and therefore teaches nothing specific about this one. Splitting the analysis into one in-control factor and one out-of-control factor, and requiring both rather than either one alone, prevents the two failure modes a post-mortem can fall into on its own: an entirely self-blaming version that concludes everything was the rep's fault, which is demoralizing and usually inaccurate, and an entirely externalizing version that blames the market or the buyer's org chart for everything, which teaches the rep nothing they could act on differently next time — a real post-mortem almost always contains genuine elements of both, and forcing both to be named prevents either one from crowding out the other. The honesty check on evidence thinness matters because a model asked to diagnose a lost deal will produce a confident-sounding verdict regardless of how much real detail the deal history actually contains, and a fabricated-sounding certainty about why a specific deal was lost is more dangerous than an honest admission of insufficient evidence, because the false certainty gets treated as a real lesson and applied to future deals, while the honest gap at least prompts better note-taking discipline going forward.`,
    exampleOutput:
      'The evidence doesn\'t clearly support "lost to competitor" — there\'s no mention of a competitor anywhere in the deal history, only a VP reorg followed by silence. This looks more like "no decision," with the reorg as the likely trigger. Earliest risk point: the champion going quiet after the reorg was announced, with no attempt made to identify a new stakeholder. Lesson: when a champion\'s org changes mid-deal, treat it as a re-qualification trigger, not a delay to simply wait out.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-07' },
      { tool: 'Claude', version: 'Sonnet 4.5', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.5).',
      },
    ],
  },
]
