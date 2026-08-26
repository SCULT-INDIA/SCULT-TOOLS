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
  {
    slug: 'sales-cold-outreach-multi-channel-sequence-plan',
    category: 'sales',
    title: `Turn one account into a coordinated 3-touch outreach plan across email, LinkedIn, and phone`,
    description: `Builds a short, sequenced cold outreach plan for a single named prospect that coordinates channel, message, and timing so each touch references the last instead of repeating the same pitch three ways.`,
    promptText: `You are planning a cold outreach sequence for ONE specific prospect I am trying to get a first conversation with — not a generic multi-channel template, a plan for this exact person and account.

PROSPECT AND ACCOUNT
{{prospect_and_account}}

WHAT I ACTUALLY SELL THEM
{{offer_relevance}}

CHANNELS AVAILABLE
{{available_channels}}

WHAT I ALREADY KNOW ABOUT THEM
{{known_context}}

TIMELINE PRESSURE
{{timeline_pressure}}

RULES FOR THE PLAN
Sequence the touches so each one explicitly assumes the prospect saw (or ignored) the one before it — the second touch should never read as if the first one never happened, and it must not repeat the same angle in different words. Assign each touch to the channel where that specific message actually lands best: a channel is a delivery mechanism, so don't put a message that needs visual proof (a metric, a screenshot) inside a plain cold call script, and don't put something that needs a real-time reaction inside an email. Space the touches based on the timeline pressure given, not a default cadence, and state the actual day-gap between each. For each touch, write the specific angle in one sentence before drafting anything — if you can't state the angle in one sentence, the touch is not ready to draft. Do not invent a specific statistic, case study result, or named client outcome — if the angle needs proof, mark it as "[INSERT: specific proof point]" and tell me what kind of proof would work best there rather than making one up.

WHAT NOT TO DO
Do not write three versions of the same generic pitch. Do not open every touch with "I wanted to reach out" or "following up on my last message" — vary the actual opening mechanism. Do not add a fourth touch beyond what the timeline pressure justifies.

OUTPUT FORMAT
A table with columns: Touch #, Channel, Day, One-line Angle, Draft Message. Below the table, one line flagging any proof point I need to supply before this plan is send-ready.`,
    variables: [
      {
        name: 'prospect_and_account',
        description: `The specific person and company, with role.`,
        example: `Maya Chen, VP of Revenue Operations at a 400-person logistics SaaS company, reports to the CRO.`,
        required: true,
      },
      {
        name: 'offer_relevance',
        description: `Why what you sell matters to this specific person's role right now.`,
        example: `We cut manual data entry between their CRM and billing system, which directly affects RevOps headcount planning.`,
        required: true,
      },
      {
        name: 'available_channels',
        description: `Which channels you can actually use for this prospect.`,
        example: `Work email, LinkedIn (2nd-degree connection), no verified phone number.`,
        required: true,
      },
      {
        name: 'known_context',
        description: `Any real signal you already have — a post, a job change, a hiring pattern.`,
        example: `She posted last week about her team drowning in reconciliation work before quarter close.`,
        required: false,
      },
      {
        name: 'timeline_pressure',
        description: `How fast you need a response and why.`,
        example: `Their fiscal year ends in five weeks and budget for next year locks after that.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `cold-outreach`,
      `sales-sequence`,
      `multi-channel`,
      `prospecting`,
      `b2b-sales`,
    ],
    whyItWorks: `The core failure mode this avoids is the one every generic cold-outreach template produces: three messages that are really the same pitch restated, sent through different pipes, which a prospect who sees more than one of them recognizes instantly and discounts accordingly. Forcing a one-sentence angle statement before any drafting happens works because GPT-5.1 will happily generate fluent, well-formatted outreach copy for an angle that doesn't actually hold up, and the one-sentence gate is the only checkpoint that catches a weak or repeated angle before it gets dressed up in persuasive language. Assigning channel by what the message actually needs — rather than treating email/LinkedIn/phone as interchangeable slots to fill in a fixed template — matches how the messages are actually received: a channel choice that ignores this produces technically-complete plans that read as three redundant asks rather than a build. The explicit ban on fabricated statistics and case results matters because outreach copy is exactly the kind of low-stakes-sounding creative task where a language model will generate a specific, plausible-sounding number or client name to make a sentence land better, and that fabricated specificity is far more damaging in sales outreach than in most contexts because it becomes a claim made to a real prospect on your behalf. Requiring the day-gap to be justified by the stated timeline pressure, rather than a default cadence, prevents the common failure where a five-week deadline gets a leisurely two-week-per-touch plan because that's the generic pattern most templates default to regardless of context.`,
    exampleOutput: `Touch 1 (Day 0, Email): Angle — name the reconciliation pain from her own post before pitching anything. Touch 2 (Day 3, LinkedIn): Angle — a specific mechanism for how the reconciliation gap gets closed, framed as a reply to the unanswered email rather than a fresh pitch. Touch 3 (Day 8, Email): Angle — tie the ask directly to her fiscal year-end deadline, with a two-line close asking for 15 minutes before budget locks.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-cold-email-first-line-personalization',
    category: 'sales',
    title: `Write a cold sales email whose first line proves you actually looked at the prospect`,
    description: `Drafts a short cold sales email where the opening line is built from one specific, verifiable fact about the prospect rather than a flattering generic observation, with the pitch tied directly back to that fact.`,
    promptText: `Write me one cold sales email. The whole point of this email is that the first line has to prove I actually looked at this specific prospect — not a generic compliment that could apply to anyone in their role.

PROSPECT
{{prospect_name_and_role}}

SPECIFIC FACT TO OPEN WITH
{{specific_fact}}

WHAT I'M SELLING AND WHY IT CONNECTS TO THAT FACT
{{product_and_connection}}

THE ASK
{{the_ask}}

My sending constraints: {{tone_and_length_constraints}}

Rules: the first line must reference the specific fact directly enough that the prospect could only conclude I read or saw the actual thing, not that I ran a mail-merge with a scraped detail. The second line must draw a real causal or relevant line from that fact to why I'm reaching out — not just fact, then unrelated pitch bolted on after a comma. Do not use the words "noticed," "came across," or "stumbled upon" — show that I looked, don't announce it. Keep the whole email under 120 words. End with a single low-friction ask — one specific yes/no question or a two-option time proposal, never an open-ended "let me know if you'd like to learn more." Do not invent a metric, dollar figure, or outcome I haven't given you — if the pitch needs a proof point, write "[ADD PROOF POINT]" instead of making one up. Write it in plain, direct language a busy person would actually send to a colleague, not marketing voice.

Give me the subject line and the email body, then one line noting anything you flagged as needing a real proof point.`,
    variables: [
      {
        name: 'prospect_name_and_role',
        description: `Who you're emailing and their role.`,
        example: `Daniel Ruiz, Head of Customer Success at a 60-person fintech startup.`,
        required: true,
      },
      {
        name: 'specific_fact',
        description: `One real, specific thing about them — a talk, a post, a hire, a product launch.`,
        example: `He posted a LinkedIn article last month arguing CS teams should own renewal targets, not sales.`,
        required: true,
      },
      {
        name: 'product_and_connection',
        description: `What you sell and the actual logical link to that fact.`,
        example: `We build renewal-risk scoring for CS teams — directly relevant if his team is about to own the renewal number.`,
        required: true,
      },
      {
        name: 'the_ask',
        description: `What you want them to do.`,
        example: `A 15-minute call next week to see if renewal-risk scoring fits before they finalize the ownership change.`,
        required: true,
      },
      {
        name: 'tone_and_length_constraints',
        description: `Any voice or length rules for this send.`,
        example: `Founder-to-founder tone, no exclamation points, must fit on one mobile screen without scrolling.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`cold-email`, `personalization`, `sales-copywriting`, `outreach`, `b2b-sales`],
    whyItWorks: `Banning the words "noticed," "came across," and "stumbled upon" targets a specific tell: those phrases are exactly the vocabulary a mail-merge personalization tool inserts around a scraped data point, and experienced buyers pattern-match on them instantly regardless of how relevant the underlying fact actually is — removing the announcement forces the model to demonstrate familiarity through specificity of reference instead of asserting it through a stock verb. Requiring line two to draw a causal link, rather than allowing a fact-then-pitch structure joined by a comma, closes the single most common failure mode in AI-generated cold email: a genuinely well-chosen personalization detail followed by a pitch that has no logical relationship to it, which reads as two unrelated sentences stapled together rather than one argument. The single low-friction ask constraint matters because GPT-5.1's default closing instinct for sales copy is an open, low-commitment "let me know if this is interesting" — which feels polite but is actually the highest-friction possible ask, since it requires the prospect to generate the next step themselves; a specific yes/no or two-option time proposal shifts that cognitive work onto the sender, where it belongs. The explicit ban on fabricated proof points exists because a model asked to write persuasive short copy will readily manufacture a specific-sounding percentage or outcome to make sentence two land harder, and unlike an internal draft, this text may get sent verbatim to a real prospect, so a plausible-sounding invented statistic is a liability, not a stylistic embellishment.`,
    exampleOutput: `Subject: renewal ownership post

Saw your take on CS owning renewal targets instead of sales — that's a structural shift most teams underestimate on the tooling side. If CS is about to inherit the number, you'll also inherit the guesswork on which accounts are actually at risk before they churn. Worth 15 minutes next week to see if that's a real gap for your team? Tuesday or Thursday afternoon both work on my end.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-follow-up-email-after-no-response',
    category: 'sales',
    title: `Write a follow-up email that adds new information instead of just asking 'did you see my last email'`,
    description: `Generates a follow-up to an unanswered sales email that introduces one genuinely new piece of value or context, so the second message earns a reply on its own rather than guilt-tripping the prospect about the first one.`,
    promptText: `I sent a sales email that got no response. Write me a follow-up — not a reminder that repeats the same pitch, something that would justify a reply even if the first email had never existed.

ORIGINAL EMAIL CONTEXT
{{original_email_summary}}

DAYS SINCE SENT
{{days_since_sent}}

WHAT'S NEW SINCE THEN
{{new_information}}

HOW MANY FOLLOW-UPS THIS IS
{{follow_up_number}}

DESIRED TONE
{{desired_tone}}

Write the follow-up so the new information carries the email — the fact that I sent something before should be implied by the reply-chain, not restated as "just following up on my email from last week" or "wanted to bump this to the top of your inbox." If this is the second follow-up, shorten it further and shift the ask down in size — a smaller, easier yes, not the same-size ask repeated with more urgency. If this is the third or later follow-up, write it as a genuine, low-pressure close-the-loop message that gives the prospect an easy, guilt-free way to say no and get taken off my radar — persistence past this point reads as pressure, not diligence, so the tone must shift accordingly rather than escalating. Do not use guilt-based openers like "I haven't heard back" or "crickets" as the entire premise of the email. Do not invent the new information if none was genuinely given to you — ask me for it instead of manufacturing a fake trigger event.

Output: subject line, email body, and one line stating which follow-up number this is and why the ask size matches it.`,
    variables: [
      {
        name: 'original_email_summary',
        description: `What the first email said, briefly.`,
        example: `Cold intro pitching our onboarding-automation tool, asked for a 20-minute demo.`,
        required: true,
      },
      {
        name: 'days_since_sent',
        description: `How long it's been with no reply.`,
        example: `9 days, no open tracked.`,
        required: true,
      },
      {
        name: 'new_information',
        description: `A real new fact, offer, or context to add — not filler.`,
        example: `We just shipped a Salesforce-native integration that removes the export step their team would have had to do manually.`,
        required: true,
      },
      {
        name: 'follow_up_number',
        description: `Which attempt this is in the sequence.`,
        example: `Second follow-up.`,
        required: true,
      },
      {
        name: 'desired_tone',
        description: `How this should sound.`,
        example: `Casual, low-pressure, like a quick add-on thought rather than a formal nudge.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `follow-up-email`,
      `sales-cadence`,
      `email-copywriting`,
      `prospecting`,
      `b2b-sales`,
    ],
    whyItWorks: `The instruction to let the new information carry the email, rather than opening with a reference to the unanswered first message, corrects for GPT-5.1's default follow-up pattern: asked for a "follow-up email," it reliably opens with some variant of "just wanted to follow up on my previous email," which is the single most skippable sentence in cold sales email because it tells the reader nothing changed and gives them zero new reason to open past the preview line. Scaling the ask size down as the follow-up number increases models a real sales instinct that a naive prompt doesn't encode by default: a second follow-up asking for the exact same 20-minute demo as the first signals that nothing has been learned from the silence, whereas shrinking the ask (a quick reply instead of a call, a yes/no instead of a scheduling negotiation) matches the declining probability of a big commitment as silence stretches on. The explicit tone shift required at the third-plus follow-up — toward a genuine, pressure-free close, rather than escalating urgency — exists because escalating persistence past two silent attempts reliably reads as pressure rather than diligence to the recipient, and a model without this instruction will often default to intensifying urgency language the more follow-ups are requested, which is the opposite of what actually improves reply rates at that stage. Refusing to manufacture a new trigger event when none was supplied prevents the model from inventing a plausible-sounding product update or news hook to satisfy the "new information" requirement, which would put a fabricated claim into an email sent to a real prospect.`,
    exampleOutput: `Subject: re: onboarding automation

Quick add — we just shipped a native Salesforce integration, so the manual export step I mentioned before is gone entirely on your end. If the timing's better now, happy to show it in 10 minutes flat, no deck. If not a fit right now, no worries at all — just let me know either way.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-discovery-call-question-bank',
    category: 'sales',
    title: `Build a discovery call question bank that digs past the first answer instead of checking boxes`,
    description: `Produces a discovery call question set organized by what you actually need to learn, with a built-in follow-up probe for each question so the call surfaces the real underlying problem instead of stopping at a surface-level answer.`,
    promptText: `Build me a discovery call question bank for an upcoming call. I don't want a generic list of "good discovery questions" — I want questions built around what I specifically need to learn from THIS prospect to know if we're a fit and to build a real business case later.

WHAT I'M SELLING
{{product_summary}}

WHO I'M TALKING TO
{{prospect_role_and_company}}

WHAT I NEED TO LEARN TO QUALIFY THEM
{{qualification_unknowns}}

CALL LENGTH
{{call_length}}

KNOWN RISK OR OBJECTION GOING IN
{{known_risk}}

For every question, write the obvious first-layer answer a prospect would likely give, then a specific follow-up question designed to get past that first answer to the real number, constraint, or motivation underneath it — a discovery call that stops at the first answer usually just confirms what the prospect already believes, not what's actually true. Organize the questions into three sections matched to what they should surface: current state and pain, decision process and stakeholders, and success criteria and timeline. Given the known risk or objection, write one question early in the call specifically designed to surface whether that risk is actually present, phrased as an open question, not a leading one that telegraphs the answer I want. Keep the total question count appropriate to the call length — do not hand me forty questions for a 20-minute call. Do not write questions that could be answered from public information already available; every question should require the prospect to tell me something I couldn't have found myself.

Format as a numbered list within each section: Question, then "Likely surface answer," then "Follow-up to go deeper."`,
    variables: [
      {
        name: 'product_summary',
        description: `What you sell, one or two sentences.`,
        example: `A contract review tool that flags risky clauses before legal sign-off, aimed at mid-market procurement teams.`,
        required: true,
      },
      {
        name: 'prospect_role_and_company',
        description: `Who's on the call and their company context.`,
        example: `Head of Procurement at a 900-person manufacturing company, first call, no prior contact with legal team.`,
        required: true,
      },
      {
        name: 'qualification_unknowns',
        description: `The specific things you don't yet know that determine fit.`,
        example: `How many contracts they process monthly, whether legal or procurement owns the review step, and their current turnaround time.`,
        required: true,
      },
      {
        name: 'call_length',
        description: `How much time you actually have.`,
        example: `30 minutes, first call.`,
        required: true,
      },
      {
        name: 'known_risk',
        description: `A concern or objection you suspect is present before the call starts.`,
        example: `Suspect they already have an in-house paralegal doing this manually and may see us as redundant.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `discovery-call`,
      `sales-questions`,
      `qualification`,
      `b2b-sales`,
      `sales-process`,
    ],
    whyItWorks: `The mechanism doing the real work here is the required "likely surface answer, then follow-up" pairing, because it forces the model to reason about the conversation as two layers instead of generating a flat list of nice-sounding open questions — a plain "give me discovery questions" prompt reliably produces questions like "what challenges are you facing?" that a prospect answers with whatever generic pain they'd tell anyone, and the conversation never gets past that first, socially-safe layer. Writing out the anticipated surface answer explicitly is what makes the follow-up land correctly, because a follow-up written without first predicting the likely first response tends to be generic ("can you tell me more?") rather than targeted at the specific gap between what a prospect usually says and what's actually driving the decision. Requiring the known-risk question to be phrased openly rather than leading it matters because a leading question ("you don't already have someone doing this in-house, right?") invites a defensive or performative answer, while an open version phrased around current process gets an honest description the rep can actually diagnose. Capping question count to the call length is a direct check against GPT-5.1's tendency, when asked for a "comprehensive" question bank, to produce an exhaustive list that would take three call lengths to actually ask — a list this long in practice gets skimmed rather than used, and the discipline of matching volume to available minutes is what makes the output something a rep could genuinely run from live on a call.`,
    exampleOutput: `Current state and pain — Q: "Walk me through what happens to a contract from the moment it lands on your desk to signature." Likely surface answer: "Legal reviews it, then it comes back to us for signature." Follow-up: "How long does that legal review step typically take, and has a deal ever slipped because of it?"`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-call-script-first-meeting-framework',
    category: 'sales',
    title: `Draft a first sales call script structured around branch points, not a straight-through monologue`,
    description: `Builds a first-meeting call script as a decision tree keyed to how the prospect actually responds at each stage, instead of a single scripted path that falls apart the moment the conversation deviates from it.`,
    promptText: `Write me a first sales call script — but structured as a branching flow keyed to how the prospect responds, not a single straight-through script I'd read top to bottom regardless of what they say.

MEETING CONTEXT
{{meeting_context}}

MY OPENING GOAL
{{opening_goal}}

MOST LIKELY POSITIVE RESPONSE AND MOST LIKELY SKEPTICAL RESPONSE
{{likely_responses}}

WHAT I MUST LEARN BEFORE THE CALL ENDS
{{must_learn}}

CALL LENGTH
{{call_length}}

Structure this as: an opening (stated, not scripted word-for-word — a natural framing of why I'm calling and what I hope to get out of the next N minutes), then a branch point after the opening with two paths: what to say and ask next if they respond positively/engaged, and what to say and ask next if they respond skeptically or flatly. Within each branch, include one more branch point for the most likely follow-on response, so the script has real depth on the two or three ways this conversation is actually likely to go, rather than one happy-path script that assumes perfect cooperation. At every branch, make sure the "must learn" items still get covered somewhere in the flow — flag explicitly if a branch risks ending the call before I've learned something I need. Write it as talking points and questions I'd actually say out loud, not as a formal transcript — should sound like a real person on a call, contractions included, not a written memo read aloud. Keep total script length appropriate for the stated call length; do not write a script that would take three times as long to actually deliver.

Format as a labeled tree: Opening, then Branch A (positive) with its own sub-branches, then Branch B (skeptical) with its own sub-branches. End with a checklist confirming where each "must learn" item gets covered.`,
    variables: [
      {
        name: 'meeting_context',
        description: `What kind of call this is and how it was booked.`,
        example: `30-minute intro call booked from an inbound demo request form, prospect has seen our website but not a live demo.`,
        required: true,
      },
      {
        name: 'opening_goal',
        description: `What you want to accomplish in the first two minutes.`,
        example: `Confirm what specifically triggered the demo request and set expectations for what the next 30 minutes will cover.`,
        required: true,
      },
      {
        name: 'likely_responses',
        description: `How you expect them to react at the key moment, both ways.`,
        example: `Positive: they engage and describe their current manual process unprompted. Skeptical: they say they're "just looking" and not evaluating anything seriously yet.`,
        required: true,
      },
      {
        name: 'must_learn',
        description: `The non-negotiable things you need to know before the call ends.`,
        example: `Their current tool (if any), rough team size using it, and who else would need to sign off on a purchase.`,
        required: true,
      },
      {
        name: 'call_length',
        description: `Total scheduled time.`,
        example: `30 minutes.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `sales-call-script`,
      `sales-conversation`,
      `discovery-call`,
      `b2b-sales`,
      `sales-enablement`,
    ],
    whyItWorks: `A linear script is the default output shape a model reaches for when simply asked for a "call script," and it fails the moment a real prospect deviates from the assumed happy path — which is most of the time — leaving the rep either improvising with no support or awkwardly forcing the conversation back onto a script that no longer fits what was just said. Structuring the request as an explicit branch tree forces the model to reason about the two or three realistic ways the conversation actually forks, rather than writing one confident monologue and calling it done; this is the same reason real sales enablement teams build call guides as decision trees rather than scripts, and stating that structure explicitly in the prompt is what gets GPT-5.1 to produce it instead of defaulting to prose. Requiring every "must learn" item to be traceable to a specific point in every branch — with an explicit flag if a branch risks ending the call before it's covered — catches the common failure where a skeptical-response branch politely wraps up the call without ever getting to the qualifying questions, which in a real call means walking away without the information needed to know if the prospect is even worth pursuing further. Insisting on spoken, contraction-included phrasing rather than formal written prose matters because a script that reads like an internal memo produces exactly that stilted cadence when a rep tries to deliver it live, while phrasing modeled on actual speech is something a rep can internalize and adapt in real time rather than read verbatim.`,
    exampleOutput: `Opening: "Thanks for grabbing time — before I show anything, I'd love to hear what made you fill out that demo request. What's going on right now that made this worth looking into?" Branch A (engaged, describes pain): ask what they're using today and what's breaking about it, then move toward the must-learn items on team size and sign-off. Branch B ("just looking"): acknowledge that directly, ask what would need to be true for this to become a real priority, then pivot to a lighter version of the must-learn questions framed as "so I don't waste your time later."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-objection-handling-response-bank',
    category: 'sales',
    title: `Build objection responses that validate the concern before pivoting, instead of arguing past it`,
    description: `Generates response frameworks for specific recurring sales objections that acknowledge the real concern first, then pivot with a genuine reframe or question rather than a scripted rebuttal that talks over what the prospect just said.`,
    promptText: `I need response frameworks for objections I keep hearing on sales calls. For each objection below, build a response that actually engages with the concern rather than a canned rebuttal that steamrolls past it.

OBJECTIONS I KEEP HEARING
{{objections_list}}

WHAT I'M SELLING
{{product_summary}}

WHERE IN THE SALES PROCESS THESE COME UP
{{stage_context}}

WHAT'S ACTUALLY TRUE ABOUT EACH CONCERN
{{honest_truth_per_objection}}

For each objection, write three parts: first, a genuine acknowledgment that names the specific concern back accurately — not a generic "I understand" but a sentence proving I heard the actual substance of what they said. Second, be honest about whether the concern is fully valid, partially valid, or based on a misunderstanding, using what I told you is actually true — if the concern is legitimate, say so; do not write a response that pretends every objection is secretly not a real problem, because a prospect can tell when they're being talked past rather than engaged with. Third, a specific question or reframe that moves the conversation forward — never a rebuttal that just restates my value proposition louder. If an objection in the list is actually a valid reason NOT to buy given what I told you is true, say so explicitly rather than forcing a pivot that oversells past a real disqualifier. Do not invent a competitor comparison, pricing detail, or feature claim that isn't something I've told you — if the response needs a specific fact I haven't given, write "[NEED: specific detail]" instead.

Format as one block per objection: Objection, Acknowledge, Honest Assessment, Reframe/Question.`,
    variables: [
      {
        name: 'objections_list',
        description: `The specific objections you're hearing, in the prospect's own words if possible.`,
        example: `"This seems like something our engineering team could just build in-house" and "we already have budget allocated to a different tool this quarter."`,
        required: true,
      },
      {
        name: 'product_summary',
        description: `What you're selling.`,
        example: `A managed data pipeline tool that replaces custom-built ETL scripts for mid-size analytics teams.`,
        required: true,
      },
      {
        name: 'stage_context',
        description: `Where in the sales cycle this objection tends to surface.`,
        example: `Usually comes up on the second call once engineering is looped in.`,
        required: true,
      },
      {
        name: 'honest_truth_per_objection',
        description: `What's genuinely true about each concern, including where it's valid.`,
        example: `Building in-house is genuinely possible for a strong team but takes 2-3 engineer-months and ongoing maintenance we absorb instead; the budget objection is often just an unstated priority ranking, not a hard no.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `objection-handling`,
      `sales-conversation`,
      `sales-training`,
      `b2b-sales`,
      `sales-enablement`,
    ],
    whyItWorks: `The instruction to rate each objection's validity honestly — fully valid, partially valid, or a misunderstanding — rather than defaulting to a universal pivot, exists because the single most common failure in AI-generated objection handling is treating every objection as equally dismissible, which produces responses that sound persuasive in isolation but collapse the moment a prospect who raised a genuinely valid concern realizes they're being argued past rather than heard; naming the honest truth first is what makes the eventual reframe credible instead of slippery. Requiring the acknowledgment to name the specific substance of the concern, not a generic "I hear you," matters because a vague acknowledgment is functionally indistinguishable from no acknowledgment at all to a prospect — it's a filler phrase that buys a beat before the pitch resumes, and prospects who've sat through enough sales calls recognize that pattern immediately. Explicitly allowing the model to say an objection is a valid reason not to buy, rather than forcing every objection into an overcome-and-pivot shape, is the most load-bearing rule in the prompt: without it, a model will reliably manufacture a reframe even for a disqualifying objection, which produces responses that oversell past a real mismatch and damages trust worse than losing the deal honestly would. Banning invented competitor comparisons, pricing specifics, or feature claims not supplied by the user closes off the model's tendency to fill in a persuasive-sounding but fabricated detail to make a reframe land harder — a fabricated claim used against a real prospect in a real objection-handling moment is a much higher-stakes error than the same fabrication in a first draft of ad copy.`,
    exampleOutput: `Objection: "We could just build this in-house." Acknowledge: "That's true, and if your team has the bandwidth, a custom pipeline is absolutely buildable." Honest Assessment: partially valid — building it is possible, but it typically runs 2-3 engineer-months plus ongoing maintenance that doesn't show up in the initial estimate. Reframe: "Is the real question whether it's buildable, or whether it's the best use of your team's next quarter — worth comparing what that maintenance load actually looks like six months in?"`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-demo-script-feature-to-outcome-mapping',
    category: 'sales',
    title: `Build a product demo script ordered by the prospect's stated priorities, not your feature list`,
    description: `Structures a sales demo around the specific outcomes a prospect said they care about, mapping each feature shown back to one of their stated priorities, and cutting anything that doesn't connect to something they actually mentioned.`,
    promptText: `Help me structure a product demo. I don't want a walkthrough of everything the product does in the order features exist in the UI — I want the demo ordered by what THIS prospect actually said they care about, with everything else cut or deprioritized.

PRODUCT FEATURES AVAILABLE TO SHOW
{{feature_list}}

WHAT THE PROSPECT SAID THEY CARE ABOUT (FROM DISCOVERY)
{{stated_priorities}}

WHO'S IN THE DEMO
{{demo_attendees}}

DEMO LENGTH
{{demo_length}}

For each stated priority, map it to the specific feature that most directly addresses it, and order the demo so the highest-stated priority is shown first, not last — a demo that saves the most relevant thing for the end risks running out of time before it gets there. For each feature you include, write one sentence connecting it explicitly back to the prospect's own words from discovery, so the transition sounds like "you mentioned X, here's how that works" rather than a feature tour that happens to include something relevant. Explicitly list which available features you are cutting from this demo and why — anything that doesn't map to a stated priority should be left out entirely rather than squeezed in for completeness, even if it's a feature I'm personally proud of. If multiple attendees are in the room with different priorities, note where the demo should pause and briefly check whether it's still landing for both, rather than optimizing only for whichever attendee spoke most during discovery. Do not claim the product does something not in the feature list I gave you.

Output format: an ordered list of demo segments (Segment, Feature Shown, Connects To Which Stated Priority, Talking Point Sentence), followed by a "Cut from this demo" list with a one-line reason for each cut.`,
    variables: [
      {
        name: 'feature_list',
        description: `Everything the product can actually do that you could show.`,
        example: `Automated invoice matching, custom approval workflows, real-time spend dashboards, multi-currency support, Slack notifications.`,
        required: true,
      },
      {
        name: 'stated_priorities',
        description: `What the prospect said mattered to them during discovery, in their own words.`,
        example: `"Our biggest headache is invoices sitting for approval for two weeks with no visibility into where they're stuck."`,
        required: true,
      },
      {
        name: 'demo_attendees',
        description: `Who will be in the room and their roles.`,
        example: `The AP manager who did discovery, plus her director who's seeing this for the first time.`,
        required: true,
      },
      {
        name: 'demo_length',
        description: `How much time is allotted.`,
        example: `25 minutes.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`sales-demo`, `demo-script`, `product-demo`, `b2b-sales`, `sales-enablement`],
    whyItWorks: `The core mechanism here is inverting the model's default demo structure: asked for a generic "demo script," GPT-5.1 tends to organize output around the product's own feature architecture — the order features exist in a UI or a marketing one-pager — because that's the most available organizing structure in the absence of other instructions, and that order has no necessary relationship to what any specific prospect cares about. Forcing every included feature to map explicitly back to the prospect's own discovery language is what prevents the demo from drifting into a generic capability tour; a feature shown without that connecting sentence gets presented as inherently impressive, while the same feature introduced as a direct answer to something the prospect said unprompted carries far more weight because it demonstrates the rep was listening, not reciting. The explicit "cut from this demo" list matters more than it looks — it's a deliberate check against the instinct to include a feature the rep is personally proud of or that showcases technical depth, even when it wasn't asked for; naming and justifying every cut forces the discipline that a demo's value comes from relevance, not comprehensiveness, and most demos fail by trying to be comprehensive. Ordering by the prospect's highest-stated priority first, rather than saving the strongest material for a big finish, directly addresses the real risk of a demo running over time and never reaching the part that actually mattered — a risk a model won't account for unless explicitly told to front-load rather than build to a climax.`,
    exampleOutput: `Segment 1: Automated invoice matching. Connects to: "invoices sitting for two weeks with no visibility." Talking point: "You mentioned invoices getting stuck for two weeks with no clear owner — here's what happens the moment one lands in the system." Cut from this demo: multi-currency support — nothing in discovery indicated cross-border operations, so this would be a tangent rather than a relevant capability.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-proposal-draft-from-discovery-notes',
    category: 'sales',
    title: `Turn raw discovery call notes into a sales proposal that argues the business case before the price`,
    description: `Converts messy discovery notes into a structured sales proposal that builds the case for change from the prospect's own stated problem before presenting the offer, instead of leading with a feature-and-price sheet.`,
    promptText: `Turn my discovery notes into a sales proposal draft. This needs to read as a business case built from what this specific prospect told me, not a standard feature-and-pricing sheet with their logo pasted on top.

RAW DISCOVERY NOTES
{{discovery_notes}}

WHAT WE'RE PROPOSING
{{proposed_solution}}

PRICING STRUCTURE
{{pricing_structure}}

WHO WILL READ THIS PROPOSAL
{{proposal_readers}}

COMPETING OPTIONS THEY'RE CONSIDERING (IF KNOWN)
{{competing_options}}

Structure the proposal in this order: first, the situation as the prospect described it in their own terms — restate their problem back accurately enough that they'd recognize it as their own words, not a generic pain-point paragraph. Second, the cost of the status quo — what continuing as-is actually costs them, in their own stated terms (time, risk, missed goal), not a generic "the cost of inaction" boilerplate section. Third, the proposed approach, connected explicitly back to the situation section point by point. Fourth, pricing, presented only after the case for change has been made, never as the opening move. If a reader on the list wasn't part of the original discovery call, add one framing sentence early in the proposal that briefly orients them, since they won't have the context the original stakeholder does. If competing options are known, address the comparison honestly and specifically rather than a vague "unlike other solutions" swipe. Do not fabricate a statistic, timeline, or outcome claim that isn't grounded in what I've given you — mark anything that needs a real number as "[CONFIRM: specific figure]".

Output as a structured proposal document with clear section headers, written for a business reader, not internal engineering language.`,
    variables: [
      {
        name: 'discovery_notes',
        description: `Raw, possibly messy notes from the actual discovery conversation.`,
        example: `Client said their support team is manually tagging tickets, takes ~3 hrs/day across 4 reps, backlog grows every Monday, wants to hit same-day resolution by Q3.`,
        required: true,
      },
      {
        name: 'proposed_solution',
        description: `What you're actually proposing to solve it.`,
        example: `Auto-tagging and routing tool integrated with their existing helpdesk, deployed in two weeks with no migration required.`,
        required: true,
      },
      {
        name: 'pricing_structure',
        description: `The actual pricing model and numbers.`,
        example: `$1,800/month for up to 10 agents, annual contract, first month free as pilot.`,
        required: true,
      },
      {
        name: 'proposal_readers',
        description: `Who will actually read this document.`,
        example: `The support director who did discovery, plus the VP of CX who wasn't on the call and controls the budget.`,
        required: true,
      },
      {
        name: 'competing_options',
        description: `What else they're evaluating, if you know.`,
        example: `Evaluating one competitor and also considering hiring a fifth support rep instead.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `sales-proposal`,
      `business-case`,
      `discovery-notes`,
      `b2b-sales`,
      `sales-enablement`,
    ],
    whyItWorks: `Sequencing pricing after the case for change, rather than allowing it near the top, corrects for the default structure most proposal templates and models alike gravitate toward — a summary, feature list, then pricing table — which frontloads the number before the reader has been given a reason to care what it costs relative to; a price without an established cost-of-status-quo has no anchor, so it reads as an isolated ask rather than a comparison against something worse. The instruction to restate the prospect's situation in language they'd recognize as their own, drawn directly from the discovery notes rather than paraphrased into generic pain-point language, is what makes a proposal feel bespoke instead of templated — a model given loose notes and told to "write a proposal" will smooth the specificity out into generic business prose unless explicitly told to preserve it, and that specificity is the single biggest signal to a prospect that this document was built for them rather than adapted from a boilerplate. The reader-orientation rule for stakeholders who weren't on the original call addresses a structural blind spot in most AI-drafted proposals: they're written as if every reader shares the context of whoever gave the discovery notes, but a VP seeing this cold needs a bridge sentence the original stakeholder doesn't, and without that instruction the document silently fails its secondary audience while looking complete to the primary one. Explicitly flagging fabricated-figure risk with a "[CONFIRM]" marker matters because a proposal is a document that gets sent to a real buyer as a basis for a real financial decision, making an invented statistic here materially riskier than in almost any other sales-copy context.`,
    exampleOutput: `The Situation: Your support team is manually tagging and routing tickets — roughly three hours a day across four reps — and the backlog compounds every Monday, pushing same-day resolution further out of reach as volume grows. The Cost of Continuing As-Is: at current pace, hitting your stated Q3 same-day-resolution goal would require either absorbing the growing backlog manually or adding headcount [CONFIRM: current backlog trend/volume] before the automation gap is addressed at all.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-rfp-response-section-drafting',
    category: 'sales',
    title: `Draft one RFP response section that answers exactly what was asked before adding anything else`,
    description: `Drafts a single RFP question-and-response pair so the answer directly and completely addresses the literal question asked first, with supporting detail added only after that, instead of a marketing paragraph that dodges the actual ask.`,
    promptText: `Draft my response to one RFP question. The evaluator scoring this is checking whether I directly answered what was literally asked — so that has to happen first, cleanly, before anything else gets added.

EXACT RFP QUESTION
{{rfp_question}}

OUR ACTUAL CAPABILITY RELATED TO THIS QUESTION
{{actual_capability}}

ANY LIMITATION OR PARTIAL GAP
{{known_limitation}}

FORMAT/LENGTH CONSTRAINTS FROM THE RFP
{{format_constraints}}

COMPETITIVE CONTEXT (IF RELEVANT)
{{competitive_context}}

Structure the response as: a direct, literal answer to the question in the first one or two sentences — if the question is yes/no or asks for a specific capability, that answer must be unambiguous and appear before any elaboration, because an evaluator scanning quickly needs to find it immediately, not infer it from a paragraph of context. After the direct answer, add supporting detail that substantiates the claim with specifics from what I've told you. If there's a known limitation or partial gap, disclose it plainly rather than burying it or omitting it — an RFP evaluator who later discovers an undisclosed gap during implementation treats it far worse than a gap disclosed upfront with a stated workaround. If competitive context is relevant, address it only by demonstrating our specific strength, never by naming or disparaging a competitor. Respect the stated format and length constraints exactly — if the RFP asks for a yes/no plus a 100-word explanation, do not deliver a 400-word essay. Do not invent a certification, integration, or capability I haven't confirmed I have — if the honest answer is "partially" or "not yet," write that, with a factual workaround if one exists, rather than stretching toward a confident yes.

Output just the response text, formatted exactly to the constraint given, ready to paste into the RFP document.`,
    variables: [
      {
        name: 'rfp_question',
        description: `The exact question text from the RFP.`,
        example: `"Does your platform support SSO via SAML 2.0 for enterprise customers? (Yes/No, 100 words max)"`,
        required: true,
      },
      {
        name: 'actual_capability',
        description: `What you genuinely can do relative to the question.`,
        example: `Yes, SAML 2.0 SSO is supported and has been in production for 18 months, currently used by 40+ enterprise accounts.`,
        required: true,
      },
      {
        name: 'known_limitation',
        description: `Any partial gap or caveat that's honestly true.`,
        example: `SCIM-based auto-provisioning isn't available yet; SSO itself works fully but user provisioning is currently manual on our side.`,
        required: false,
      },
      {
        name: 'format_constraints',
        description: `Exact format/length rules the RFP specifies.`,
        example: `Yes/No answer required first, followed by no more than 100 words of explanation.`,
        required: true,
      },
      {
        name: 'competitive_context',
        description: `Anything relevant about how this compares in the market, without naming competitors.`,
        example: `This has been a standard capability for us far longer than most competitors in this RFP have offered it.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `rfp-response`,
      `proposal-writing`,
      `b2b-sales`,
      `enterprise-sales`,
      `procurement`,
    ],
    whyItWorks: `Requiring the literal answer to appear in the first sentence, before any elaboration, directly counters how a language model defaults to answering yes/no questions in open-ended writing tasks — it tends to build up to the answer through context and qualification, which reads as evasive to an RFP evaluator who is often scoring dozens of responses against a checklist and needs the answer locatable in seconds, not inferable from a paragraph. The instruction to disclose a known limitation plainly rather than omit or bury it is the single highest-leverage rule in this prompt, because RFP responses are the rare sales document that gets checked against reality during implementation — an undisclosed gap discovered after signing damages trust and can trigger contractual disputes in a way a disclosed gap with a stated workaround never does, so the model needs to be explicitly told that honesty here is a competitive advantage, not a liability, or it will default to the confident, gap-free tone most persuasive writing defaults to. The strict format and length adherence matters because RFP scoring is frequently mechanical — many evaluators or their software literally check whether an answer fits the requested shape — and a model asked to "draft a strong response" without an explicit length constraint will reliably over-write, producing a technically excellent paragraph that fails the RFP's actual scoring rubric on format alone. Banning invented certifications or capabilities addresses the highest-stakes fabrication risk in this whole prompt set: an RFP response is frequently incorporated by reference into the eventual contract, so a confidently invented "yes" here is not just misleading copy, it can become a real, and false, contractual claim.`,
    exampleOutput: `Yes. Our platform has supported SAML 2.0 SSO in production for over 18 months and is currently used by 40+ enterprise accounts for authentication. SCIM-based auto-provisioning is not yet available; user provisioning is currently handled manually by our onboarding team as part of implementation, with automated provisioning on our public roadmap.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-lead-qualification-scorecard',
    category: 'sales',
    title: `Build a lead qualification scorecard from your last 10 closed-won and closed-lost deals`,
    description: `Derives a practical lead qualification scorecard from patterns in your own actual past deals rather than a generic BANT template, weighting the criteria that historically separated your real wins from your real losses.`,
    promptText: `Build me a lead qualification scorecard — but base it on my actual past deals, not a generic BANT or MEDDIC template that ignores what's actually predicted wins and losses for my business specifically.

CLOSED-WON DEAL PATTERNS
{{closed_won_patterns}}

CLOSED-LOST DEAL PATTERNS
{{closed_lost_patterns}}

WHAT I CAN REALISTICALLY LEARN ABOUT A LEAD EARLY (FIRST CALL OR FORM)
{{early_signal_availability}}

DEAL SIZE / SALES MOTION
{{deal_context}}

From the won and lost patterns given, identify the 4-6 factors that actually differed between deals that closed and deals that didn't — not a generic checklist of "budget, authority, need, timeline" applied without evidence, but factors you can genuinely infer separated the two groups based on what I told you. For each factor, state explicitly what evidence from the patterns supports including it — if a factor seems intuitively important but isn't actually supported by the won/lost data I gave you, leave it out or flag it as unconfirmed rather than including it because it's a standard qualification category. Weight each factor by how strongly it appears to differentiate outcomes, not equally by default. For each factor, specify how it can actually be assessed at the point I have it available (early call or intake form) — a factor that can only be known after weeks of a sales cycle isn't useful as an early qualification criterion, even if it's genuinely predictive later. Build a simple scoring rubric (e.g., 0-2 points per factor) and a threshold for what separates a lead worth pursuing now from one to nurture or disqualify. Do not invent additional deal patterns or assume information about my business I haven't given you.

Output: a table (Factor, Evidence From My Deals, Weight, How To Assess Early, Score Range) followed by the pursue/nurture/disqualify thresholds.`,
    variables: [
      {
        name: 'closed_won_patterns',
        description: `What tended to be true of deals that actually closed.`,
        example: `Almost all closed-won deals had a champion who was personally frustrated with the current process, not just assigned to evaluate options, and involved 3 or fewer stakeholders.`,
        required: true,
      },
      {
        name: 'closed_lost_patterns',
        description: `What tended to be true of deals that stalled or were lost.`,
        example: `Lost deals frequently involved a champion evaluating on behalf of a committee with 5+ stakeholders, and initial contact came from a generic content download, not a specific pain point.`,
        required: true,
      },
      {
        name: 'early_signal_availability',
        description: `What you can actually find out at first contact, realistically.`,
        example: `First call always covers current tooling, team size, and who initiated the evaluation; budget is rarely disclosed that early.`,
        required: true,
      },
      {
        name: 'deal_context',
        description: `Typical deal size and sales motion, for calibrating what 'worth pursuing' means.`,
        example: `Average deal ~$18k ACV, sales cycle 4-8 weeks, one rep handles the full cycle.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `lead-qualification`,
      `sales-scorecard`,
      `sales-process`,
      `b2b-sales`,
      `pipeline-management`,
    ],
    whyItWorks: `The instruction to derive factors from the actual won/lost patterns given, rather than defaulting to BANT or MEDDIC, matters because those frameworks are generic industry checklists that a model will reach for immediately if not explicitly redirected — they sound authoritative and complete, but a factor like "budget" being on a standard checklist says nothing about whether it actually predicted outcomes in this specific business's deal history, which is the only evidence that should determine what's on this particular scorecard. Requiring each factor to cite the specific evidence from the given patterns, and explicitly permitting the model to flag an intuitively-standard factor as unconfirmed rather than including it by default, is the check against a well-documented failure mode: language models asked to build a "qualification framework" tend to backfill in familiar categories (authority, timeline, competitive situation) that feel complete even when the actual data provided doesn't support them, because those categories are heavily represented in training data about sales generally. The requirement that every factor be assessable at the point it would actually be used — first call or intake form, not deep into the sales cycle — closes a subtler gap: a factor can be genuinely predictive of deal outcome while being useless for early qualification if it's only knowable after weeks of discovery, and a model not told to check for this will happily include lagging indicators as if they were usable filtering criteria on lead one. Weighting factors unequally rather than defaulting to a flat checklist reflects that real qualification signals aren't equally strong, and forcing the model to differentiate weight based on the given evidence produces a rubric that actually discriminates between good and bad leads instead of one where every box checked looks equally reassuring regardless of its real predictive value.`,
    exampleOutput: `Factor: Champion is personally frustrated with current process (vs. assigned to evaluate). Evidence: present in nearly all closed-won deals, largely absent in closed-lost. Weight: high (2 points). How to assess early: ask directly on the first call what specifically prompted them to look for a solution now, and listen for a personal pain statement vs. a generic mandate. Score range: 0 (assigned to evaluate, no personal stake) to 2 (unprompted, specific frustration stated).`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-icp-definition-from-closed-won-deals',
    category: 'sales',
    title: `Define your ideal customer profile from the deals that actually renewed, not your whole customer list`,
    description: `Builds an ICP definition weighted toward accounts that renewed and expanded rather than every closed-won deal ever, so the resulting profile targets accounts likely to stay and grow rather than just accounts easy to close once.`,
    promptText: `Help me define our ideal customer profile. I don't want this based on every deal we've ever closed — I want it weighted specifically toward the accounts that renewed and grew, because a customer profile built from every close, including the ones that churned fast, will point our sales team back at the same easy-but-bad-fit accounts.

ACCOUNTS THAT RENEWED AND EXPANDED
{{strong_accounts}}

ACCOUNTS THAT CHURNED OR NEVER EXPANDED
{{weak_accounts}}

OUR PRODUCT AND WHAT IT'S BUILT TO SOLVE
{{product_context}}

WHAT WE CAN ACTUALLY FILTER FOR DURING PROSPECTING
{{prospecting_filters}}

Compare the strong and weak account groups directly, and identify what genuinely differs between them across firmographics (size, industry, structure), the specific problem they had when they bought, and how they were using the product a few months in. Do not just describe the strong accounts in isolation — the profile only becomes useful once it's clear what distinguishes them FROM the weak accounts, since two groups that look identical on paper but had different outcomes means the real differentiator is something else you need to dig into, not the obvious firmographic traits. Be explicit about which differentiating traits can actually be checked during prospecting (before a deal even starts) versus which ones are only visible after the sale — an ICP is only actionable if a rep can screen for it before investing time in a deal, so clearly separate "usable at prospecting time" traits from "only knowable in hindsight" traits and build the profile primarily from the former. Where the strong and weak groups don't clearly differ on some dimension, say so rather than manufacturing a distinction that isn't really there. Do not assume information about accounts that wasn't given to you.

Output: a comparison table (Trait, Strong Accounts, Weak Accounts, Usable at Prospecting Time?), followed by a concise ICP statement built only from the traits that actually differentiated and are checkable early.`,
    variables: [
      {
        name: 'strong_accounts',
        description: `Traits and context of accounts that renewed and grew.`,
        example: `Mostly 50-200 person B2B services companies, bought because a specific manager was drowning in a manual reporting task, adopted across the whole team within 60 days.`,
        required: true,
      },
      {
        name: 'weak_accounts',
        description: `Traits and context of accounts that churned or stalled.`,
        example: `Similar company sizes on paper, but bought during a broad 'digital transformation' initiative with no specific owner, usage stayed limited to one person, churned at renewal.`,
        required: true,
      },
      {
        name: 'product_context',
        description: `What the product does and is meant to solve.`,
        example: `Workflow automation tool aimed at eliminating manual reporting and status-update work for operations teams.`,
        required: true,
      },
      {
        name: 'prospecting_filters',
        description: `What data or signals you can actually check before or during early outreach.`,
        example: `Company size, industry, job titles on LinkedIn, and whether a specific pain point is mentioned in outbound replies or discovery.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `ideal-customer-profile`,
      `icp`,
      `sales-strategy`,
      `b2b-sales`,
      `go-to-market`,
    ],
    whyItWorks: `Comparing the strong and weak account groups against each other, rather than describing the strong accounts alone, is the single mechanism that keeps this from producing a generic "who are our best customers" description — an ICP built only by describing winners tends to just restate obvious firmographic facts (company size, industry) that may be shared equally by the accounts that churned, which makes the resulting profile look complete while filtering for nothing useful. Explicitly separating traits that are checkable at prospecting time from traits only visible in hindsight addresses a very common and costly gap in AI-generated ICP work: a model asked to build a customer profile will readily surface a genuinely differentiating trait like "adopted across the whole team within 60 days," which is a real and true pattern but completely useless to a rep trying to qualify a lead before a deal has even started, since that information doesn't exist yet at that point — without this instruction, the resulting document reads as insightful but can't actually be operationalized in prospecting. Requiring the model to say explicitly when two groups don't differ on some dimension, rather than manufacturing a distinction, guards against the tendency to produce an evenly-weighted list of differentiators regardless of whether the underlying data actually supports each one — a real ICP usually has a small number of traits that matter a lot and several that don't matter at all, and forcing the model to admit the latter is what keeps the final profile sharp instead of diluted with plausible-sounding but unsupported criteria. This structure specifically counters the common go-to-market mistake of an ICP built from an entire closed-won list, which quietly re-encodes and reinforces whatever the sales team has been closing regardless of whether those accounts actually stuck around and grew.`,
    exampleOutput: `Trait: presence of a specific named pain owner at time of purchase. Strong accounts: present in nearly every case — a specific manager drowning in manual reporting. Weak accounts: largely absent — purchase driven by a broad initiative with no individual pain owner. Usable at prospecting time: yes, checkable directly in discovery conversation. ICP statement: 50-200 person B2B services companies where a specific operations or reporting manager can name the exact manual task costing them time today, not a company undergoing a broad, ownerless digital transformation initiative.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-account-research-briefing-before-call',
    category: 'sales',
    title: `Turn scattered research on a target account into a one-page briefing you'd actually read before a call`,
    description: `Synthesizes raw research notes on a target account into a short pre-call briefing organized around what changes how you'd actually run the call, cutting background trivia that wouldn't change a single thing you say.`,
    promptText: `I have a pile of research notes on an account before a call. Turn this into a one-page briefing — not a summary of everything I found, only what would actually change how I run the call.

RAW RESEARCH NOTES
{{raw_research_notes}}

WHO I'M MEETING AND THE MEETING'S PURPOSE
{{meeting_context}}

WHAT I ALREADY PLANNED TO SAY OR ASK
{{existing_plan}}

Go through the raw notes and keep only what would change something specific about how I run this call — a fact that's interesting but wouldn't alter a single question I ask or point I make doesn't belong in the briefing, no matter how notable it seemed while researching. For each fact you keep, state explicitly what it changes about my existing plan — a new question to ask, a talking point to drop because it's now clearly wrong, an assumption in my plan that this fact contradicts. If something in the raw notes actually contradicts an assumption baked into my existing plan, flag that prominently near the top, not buried in a bullet list, since walking into a call with a contradicted assumption is the single most costly failure this briefing needs to prevent. Organize by urgency to the call, not by research category — don't group by "company news" then "leadership" then "industry" the way a research report would; group by what I need to know first versus what's just useful context. Cut anything from the raw notes that is purely trivia with no connection to how I'd run this specific call. Do not add speculation beyond what's in the notes — if you're inferring something rather than reading it directly from the notes, label it clearly as an inference, not a fact.

Output: a "Check this before anything else" section (contradictions to my existing plan, if any), followed by a short list of kept facts each paired with what it changes about the call, capped at what fits on one page.`,
    variables: [
      {
        name: 'raw_research_notes',
        description: `Everything you found, unfiltered — company news, LinkedIn activity, funding, leadership changes, whatever you gathered.`,
        example: `Company raised a Series C four months ago, hired a new VP of Engineering last month who came from a competitor of ours, mentioned in a podcast that they're 'evaluating vendor consolidation' this quarter, CEO does a lot of public speaking on sustainability.`,
        required: true,
      },
      {
        name: 'meeting_context',
        description: `Who you're meeting and why.`,
        example: `Second call with the Director of IT, purpose is to move toward a technical evaluation.`,
        required: true,
      },
      {
        name: 'existing_plan',
        description: `What you already intended to cover or ask before this research pass.`,
        example: `Planned to pitch our platform as an add-on to their current stack and ask about their evaluation timeline.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `account-research`,
      `sales-preparation`,
      `pre-call-briefing`,
      `b2b-sales`,
      `sales-enablement`,
    ],
    whyItWorks: `The filter of "would this change something about how I run the call" is the mechanism that keeps this from turning into a research report, which is the default shape a model produces when simply asked to "summarize" account research — a summary organizes and compresses everything supplied, treating comprehensiveness as the goal, while a briefing has to actively discard most of what was gathered, and a model isn't naturally inclined to discard interesting-sounding material unless explicitly told that relevance to the specific call, not general interestingness, is the only criterion for inclusion. Requiring every kept fact to state explicitly what it changes about the existing plan turns the briefing from a list of trivia into a list of decisions — a fact stated alone ("they hired a new VP of Engineering from a competitor") is just information, but the same fact paired with its implication ("this person may already prefer a different vendor's approach — worth asking directly rather than assuming a blank slate") is something the rep can act on in the room. The instruction to surface plan-contradicting facts prominently near the top, rather than letting them sit in a bullet list, directly targets the most expensive failure mode a pre-call briefing can have: a rep who walks into a call still operating on an assumption the research has already disproven, and that failure is much more damaging than simply missing a nice-to-have detail, so it needs to be structurally impossible to bury. Requiring inferences to be explicitly labeled as such, rather than blended in with facts read directly from the notes, matters because a briefing consumed quickly right before a call gets treated at face value — an unlabeled inference presented with the same confidence as a sourced fact risks the rep repeating it back to the prospect as if it were established, which can be an awkward or even damaging assumption to voice out loud if it turns out to be wrong.`,
    exampleOutput: `Check this before anything else: their new VP of Engineering came directly from a competitor of ours — do not assume a neutral technical evaluation; ask directly early on whether that background is shaping their current vendor thinking, rather than pitching as if this is a blank-slate comparison. Kept fact: mentioned on a podcast they're 'evaluating vendor consolidation' this quarter. Changes: reframe the add-on pitch from your existing plan toward a consolidation angle instead, since 'another tool to add' may now work against you rather than for you.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-personalized-outreach-trigger-event',
    category: 'sales',
    title: `Build a cold outreach message from a specific trigger event instead of a generic timing coincidence`,
    description: `Writes a short outreach message anchored to a real, recent trigger event at the prospect's company, with an explicit check on whether the event genuinely justifies the outreach timing or is just being used as a flimsy excuse to message.`,
    promptText: `Write a short outreach message triggered by a specific event at this company. Before drafting anything, tell me honestly whether this event actually justifies reaching out now, or whether it's a weak excuse being stretched to look like good timing.

THE TRIGGER EVENT
{{trigger_event}}

COMPANY AND CONTACT
{{company_and_contact}}

WHAT I'M OFFERING
{{offer_summary}}

WHY I THINK THIS EVENT MATTERS TO THEM RIGHT NOW
{{why_relevant}}

First, assess honestly: does this trigger event create an actual, specific new need or pressure connected to what I'm offering, or is it just company news that happens to have occurred recently with no real causal link to my offer? If it's a weak link, say so plainly and tell me what would make a better trigger, rather than forcing a stretch connection into a message anyway. If the link is genuinely real, write the message so the event is the reason for the message's existence, not a decorative opening line bolted onto an otherwise generic pitch — the recipient should finish the message unable to imagine it being sent to them without this event having happened. Keep it short — under 100 words. State plainly, without hedging, why this specific moment is different from any other time you might have reached out. End with a single specific, low-effort next step. Do not invent details about the trigger event beyond what I've told you, and do not invent a statistic or outcome claim to strengthen the pitch.

Output: first, one line — "Real trigger" or "Weak link, here's why" — then, only if real, the message itself.`,
    variables: [
      {
        name: 'trigger_event',
        description: `The specific, real, recent thing that happened.`,
        example: `They announced last week they're opening a second warehouse location in a new region.`,
        required: true,
      },
      {
        name: 'company_and_contact',
        description: `Who you're reaching out to and their role.`,
        example: `Priya Nair, VP of Logistics, mid-size e-commerce retailer.`,
        required: true,
      },
      {
        name: 'offer_summary',
        description: `What you're offering, briefly.`,
        example: `Multi-location inventory sync software that prevents stock discrepancies across warehouses.`,
        required: true,
      },
      {
        name: 'why_relevant',
        description: `Your actual reasoning for why this event connects to your offer.`,
        example: `A second warehouse location almost always creates inventory sync problems in the first few months that a single-location setup never had.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `trigger-event-outreach`,
      `personalized-outreach`,
      `cold-outreach`,
      `b2b-sales`,
      `prospecting`,
    ],
    whyItWorks: `Requiring an honest validity check on the trigger event before any drafting happens is the load-bearing rule in this prompt, because a model asked to "write outreach based on this trigger event" will draft persuasive-sounding copy regardless of whether the underlying causal link is real — fluency in language generation is not correlated with the strength of the argument being made, so without an explicit instruction to evaluate the link first, the model will happily produce a confident-sounding message built on a coincidental timing connection that a savvy recipient will see through immediately as a stretch. The instruction that the recipient should "finish the message unable to imagine it being sent without this event having happened" is a concrete, checkable bar that rules out the most common failure in trigger-based outreach: an opening line that name-drops the event ("Congrats on the new warehouse!") followed by a generic pitch that could have been sent regardless — that structure uses the trigger as decoration rather than as the actual reason for the message, and prospects register that gap even when they can't articulate it. Capping the message under 100 words and requiring a plain, non-hedged statement of why this moment specifically differs from any other time works against GPT-5.1's tendency to soften time-sensitive claims with qualifiers ("this might be a good time to consider...") that dilute exactly the urgency a trigger-event message is supposed to carry — a trigger that's genuinely real deserves to be stated with actual confidence, and hedged phrasing undercuts the one advantage this message type has over generic cold outreach. Banning invented details or statistics beyond what's supplied protects against the model manufacturing a specific-sounding but false elaboration on the trigger event itself, which would misrepresent something publicly checkable about the prospect's own company back to them.`,
    exampleOutput: `Real trigger. Message: "Saw the new warehouse announcement — most retailers hit inventory sync gaps in the first few months of running two locations, usually before anyone's looking for a fix. Worth a quick look at how that plays out for your setup before it becomes a real headache? Happy to send a two-minute walkthrough, no call needed."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-linkedin-connection-request-message',
    category: 'sales',
    title: `Write a LinkedIn connection request note that earns acceptance without pretending to already know someone`,
    description: `Drafts a short LinkedIn connection request message within the character limit that gives a real, honest reason to connect instead of a vague networking platitude or a disguised pitch that gets read as spam.`,
    promptText: `Write me a LinkedIn connection request note. This has a hard character limit and one job: give this person a genuine, honest reason to accept — not a disguised sales pitch and not empty networking language.

WHO I'M CONNECTING WITH
{{prospect_and_role}}

MY ACTUAL REASON FOR CONNECTING
{{real_reason}}

ANY SHARED CONTEXT (MUTUAL CONNECTION, GROUP, EVENT)
{{shared_context}}

AM I PLANNING TO PITCH THEM SOON AFTER CONNECTING?
{{pitch_intent}}

Write this as a genuinely honest note, not a soft-sell disguised as a networking message — if my real reason for connecting is that I want to sell them something eventually, say something true and non-manipulative rather than pretending this is purely about admiring their work or wanting to "add value." Use the shared context only if it's real and specific enough that they'd recognize it, never a vague "we're both in the same industry" line that could apply to thousands of people. Keep it under 300 characters, since that's LinkedIn's connection note limit, and write it as something a real person would type, not a template with the name swapped in. If I indicated I plan to pitch soon after connecting, do not make a promise in this note about not selling to them ("just want to connect, no pitch!") if that isn't true — a note that lies about intent to get past the first hurdle damages trust the moment the pitch actually arrives. Do not use "I'd love to add you to my network" or "great profile" as the entire content of the message.

Output: the note text with a character count shown, plus one line noting if the stated reason and the stated future pitch intent are consistent with each other or if there's a mismatch I should reconsider.`,
    variables: [
      {
        name: 'prospect_and_role',
        description: `Who you're connecting with.`,
        example: `Head of Sales Ops at a company you've been researching as a target account.`,
        required: true,
      },
      {
        name: 'real_reason',
        description: `Your actual, honest reason for wanting to connect.`,
        example: `I think their team is a strong fit for what we sell and I want to build familiarity before reaching out with anything specific.`,
        required: true,
      },
      {
        name: 'shared_context',
        description: `Any real, specific shared connection point.`,
        example: `We're both members of the same 400-person RevOps Slack community and she posted a question I could genuinely speak to.`,
        required: false,
      },
      {
        name: 'pitch_intent',
        description: `Whether and when you plan to pitch after connecting.`,
        example: `Yes, planning to reach out with a specific offer within 2-3 weeks after connecting.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `linkedin-outreach`,
      `connection-request`,
      `social-selling`,
      `b2b-sales`,
      `prospecting`,
    ],
    whyItWorks: `The instruction to be honest about pitch intent rather than promising "no pitch" if a pitch is actually planned is the mechanism that keeps this prompt from producing the single most common form of LinkedIn spam: a connection note that explicitly disclaims sales intent, immediately followed by a pitch, which is a pattern experienced LinkedIn users recognize instantly and which damages trust more than an honest, upfront reason ever would — a model asked simply to write a "friendly, non-salesy" connection note will often default to exactly that false disclaimer because it's a common, socially safe-sounding phrase in its training data for this context, regardless of whether it's actually true for this specific outreach. Requiring the shared context to be specific enough that the recipient would recognize it themselves, rather than a generic "we're in the same industry" line, targets the second most common failure: connection notes that gesture at commonality without establishing anything concrete, which reads as templated regardless of how warmly it's phrased, because there's no way to verify the claim is really about this specific person. The hard 300-character constraint matters mechanically because LinkedIn's connection note field actually enforces that limit — a model not explicitly told the constraint will draft a warm, well-reasoned message well over the limit that would get silently truncated or rejected, so the length rule isn't a stylistic preference here, it's a platform mechanical requirement. Flagging a mismatch between the stated real reason and the stated pitch intent gives the user an explicit checkpoint to catch their own inconsistency before sending — if the honest reason given doesn't actually match what's about to happen next, that's worth surfacing before the note goes out, not after the relationship starts on a note that won't hold up.`,
    exampleOutput: `"Hi Maria — saw your question in the RevOps Slack about attribution gaps in multi-touch pipelines, and it's close to a problem I spend a lot of time on. Would like to connect and stay in each other's orbit — I do also work in this space commercially, so full disclosure there, but no pitch in this note." (287 characters) — Consistent: your stated intent to pitch within a few weeks is disclosed honestly rather than denied, so this note should hold up when that follow-up arrives.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-sequence-cadence-builder',
    category: 'sales',
    title: `Design a sales email sequence cadence where each step's timing is justified, not defaulted to a standard rhythm`,
    description: `Builds a multi-step sales sequence with day-by-day spacing that's explicitly justified by the buyer's likely decision cycle and attention span, rather than defaulting to a generic 3-5-7-day rhythm applied regardless of context.`,
    promptText: `Design a sales email sequence — the cadence and spacing between steps, not just the message content. I don't want the standard 3-5-7-14 day rhythm applied by default; I want each gap justified by something real about how this specific buyer actually decides.

WHO THIS SEQUENCE TARGETS
{{target_buyer}}

NUMBER OF STEPS DESIRED
{{number_of_steps}}

HOW THIS BUYER TYPICALLY MAKES THIS KIND OF DECISION
{{decision_cycle_context}}

WHAT HAPPENS IF THEY REPLY MID-SEQUENCE
{{reply_handling}}

For each step in the sequence, state the day it goes out relative to step one, and justify that specific gap based on the buyer's decision context I gave you — not a default interval. If this is a fast, low-commitment ask, the gaps should be short since attention fades quickly and there's little for the buyer to actually deliberate on; if this is a slower, higher-stakes decision involving other stakeholders, the gaps should be wider to match a realistic internal decision timeline, and say so explicitly. Vary the angle of each step so the sequence builds rather than repeats — state the one-sentence angle for each step before writing the message itself. Write out an explicit instruction for what happens if the buyer replies at any point mid-sequence — the sequence must stop or branch, never continue to send a scheduled step to someone who already responded, since that reads as an automation failure rather than a human process. Keep the total sequence length proportional to the number of steps requested; do not pad with steps that add no new angle just to hit a round number.

Output: a table (Step, Day, Angle, Gap Justification) for the whole sequence, followed by one explicit sentence describing the reply-handling rule to build into the actual sending tool.`,
    variables: [
      {
        name: 'target_buyer',
        description: `Who this sequence is aimed at.`,
        example: `Mid-market marketing directors evaluating tools for a Q3 budget cycle.`,
        required: true,
      },
      {
        name: 'number_of_steps',
        description: `How many touches you want in the sequence.`,
        example: `5 steps.`,
        required: true,
      },
      {
        name: 'decision_cycle_context',
        description: `What you know about how this buyer type actually decides.`,
        example: `Usually needs sign-off from a director above them and typically compares 2-3 vendors before committing, decision cycle runs 3-6 weeks.`,
        required: true,
      },
      {
        name: 'reply_handling',
        description: `What should happen operationally if they reply mid-sequence.`,
        example: `All remaining scheduled steps must stop immediately and the lead moves to manual handling by the assigned rep.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `sales-sequence`,
      `email-cadence`,
      `sales-automation`,
      `b2b-sales`,
      `prospecting`,
    ],
    whyItWorks: `The instruction to justify each gap by the buyer's actual decision cycle, rather than accepting a default rhythm, targets a specific and common failure in AI-generated sales sequences: asked for a "sales cadence," a model will very reliably reproduce the generic 3-5-7-14 day pattern that appears constantly in sales enablement content it was trained on, regardless of whether that spacing has any relationship to how the target buyer actually moves through a decision — a fast, low-commitment consumer-style ask and a slow, multi-stakeholder enterprise evaluation should never share the same cadence, and only an explicit instruction to reason from the given decision context, rather than pattern-match to the most common template, produces spacing that's actually appropriate. Requiring a one-sentence angle per step before drafting the message is the same mechanism used elsewhere to prevent repeated pitches, applied here specifically to cadence: a sequence with justified timing but repeated content still fails, because the buyer notices the same idea restated with different framing regardless of how well-spaced the sends are. The explicit reply-handling instruction addresses a real operational failure mode that has nothing to do with message quality and everything to do with automation: most sequence tools will keep firing scheduled steps to a contact who already replied unless a stop condition is explicitly configured, and a sequence design that only covers message content without addressing this leaves a gap that produces the single most reputation-damaging outcome in sales automation — continuing to send a scripted pitch to someone who already responded, which reads as impersonal at exactly the moment a real reply deserves a real response.`,
    exampleOutput: `Step 1, Day 0: initial pitch tied to Q3 budget timing. Step 2, Day 4: new angle — a specific evaluation criterion other marketing directors used when comparing vendors. Gap justification: short gap appropriate early since attention is highest right after first contact and nothing yet requires internal deliberation. Step 4, Day 18: gap justification — internal sign-off from a director above them typically takes 2-3 weeks, so this step is timed to land as their internal comparison phase is likely concluding, not before it.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-deal-review-late-stage-risk-audit',
    category: 'sales',
    title: `Run a deal desk-style risk audit on a late-stage opportunity before it goes to forecast`,
    description: `Turns raw CRM notes and rep commentary on a late-stage deal into a structured risk audit that surfaces the gaps a manager would catch in a live deal review, before the deal is committed to forecast.`,
    promptText: `You are acting as a deal desk reviewer auditing a single late-stage opportunity before it gets committed to this quarter's forecast. Your job is to find the gaps a skeptical sales manager would find in a live deal review, not to restate the rep's optimism back at them.

DEAL SUMMARY
{{deal_summary}}

STAGE AND CLOSE DATE
{{stage_and_close_date}}

KNOWN CHAMPION AND DECISION PROCESS
{{champion_and_process}}

OBJECTIONS OR OPEN RISKS THE REP HAS FLAGGED
{{flagged_risks}}

COMPETING PRIORITIES OR ALTERNATIVES
{{competing_alternatives}}

AUDIT RULES
Work stage by stage through MEDDIC-style checkpoints (metrics, economic buyer, decision criteria, decision process, identified pain, champion) but do not just print the framework as a checklist — for each checkpoint, state what evidence in the deal summary actually supports it being true, and separately state what is merely assumed because the rep believes it. Treat anything not confirmed by a specific quote, email, or documented next step as unconfirmed, even if the rep's narrative treats it as settled. Flag the single biggest risk to the stated close date specifically — not a generic list of risks — and explain the mechanism by which it could slip the date, not just that it exists. If the economic buyer has never been on a call or in a written exchange, say so plainly rather than inferring their support from the champion's account of internal conversations.

WHAT NOT TO DO
Do not soften an unconfirmed assumption into a hedge like "likely true" — either it's evidenced or it's a gap, stated as a gap. Do not recommend killing the deal or downgrading its stage yourself; a deal desk audit surfaces risk for a human to decide on, it doesn't unilaterally reclassify the opportunity.

OUTPUT FORMAT
1. A one-line current-state verdict: on track, at risk, or needs immediate escalation, with the single deciding reason.
2. A MEDDIC-style table: checkpoint, evidenced or assumed, supporting detail.
3. The single biggest risk to the close date and the mechanism by which it could slip.
4. Two to three specific next actions the rep should take before the next forecast call, each tied to closing a named gap above.`,
    variables: [
      {
        name: 'deal_summary',
        description: `The rep's narrative of the deal so far, in their own words.`,
        example: `Mid-market logistics company, 8-week eval, champion is the ops director who ran the pilot and says the team loves it, VP of ops has been looped on email but hasn't joined a call.`,
        required: true,
      },
      {
        name: 'stage_and_close_date',
        description: `Current CRM stage and the forecasted close date.`,
        example: `Stage: Negotiation. Close date: end of this month.`,
        required: true,
      },
      {
        name: 'champion_and_process',
        description: `Who the champion is and what's known about how the decision actually gets made.`,
        example: `Champion is the ops director; procurement process requires sign-off from finance and the VP of ops, neither of which has a scheduled meeting yet.`,
        required: true,
      },
      {
        name: 'flagged_risks',
        description: `Any objections, hesitations, or open questions the rep has already noted.`,
        example: `Champion mentioned budget is 'probably fine' but hasn't confirmed it's in this year's approved spend.`,
        required: true,
      },
      {
        name: 'competing_alternatives',
        description: `Other vendors, internal builds, or a do-nothing option still in play.`,
        example: `Prospect ran a parallel eval with one competitor six weeks ago; no confirmation that eval has formally ended.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `deal-review`,
      `forecast-accuracy`,
      `sales-management`,
      `meddic`,
      `pipeline-hygiene`,
    ],
    whyItWorks: `The prompt works by forcing a structural separation between evidenced and assumed facts, which directly counters a known failure mode of asking a model to just 'review this deal': left unconstrained, GPT-5.1 tends to mirror the tone and confidence level of the input text back to the user, so an optimistic rep narrative produces an optimistic-sounding review even when the underlying facts don't support it. Anchoring the audit to MEDDIC-style checkpoints but explicitly banning a bare checklist print-out forces the model to do the harder cross-referencing work of matching each checkpoint against a specific piece of evidence in the deal summary rather than accepting the rep's framing at face value — this is the same discipline a skeptical sales manager applies in a live deal review, and it's the part that generic 'summarize this deal' prompts skip. Explicitly instructing the model not to downgrade the deal's stage itself matters because a model given open latitude will sometimes overstep into a recommendation that isn't its call to make — a deal desk audit's value is in surfacing risk clearly enough for a human to decide, and blurring that boundary makes the tool feel like it's making calls above its authority, which erodes trust in the output faster than an incomplete audit would. Requiring the single biggest risk and its mechanism, rather than a flat list of risks, forces prioritization instead of hedge-everything output, which is what actually gets acted on in a five-minute forecast conversation.`,
    exampleOutput: `Verdict: At risk — economic buyer has never engaged directly. MEDDIC table: Economic Buyer marked 'Assumed' (VP of ops only on email CC, no direct confirmation of support). Biggest risk: if finance sign-off surfaces a budget gap the champion hasn't verified, the deal could slip past close date with no fallback plan in motion. Next actions: (1) get VP of ops on a call this week, (2) have champion confirm budget line item in writing, (3) ask directly whether the competing eval has formally closed.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-pipeline-analysis-stage-conversion-diagnostic',
    category: 'sales',
    title: `Diagnose where a sales pipeline is actually leaking, not just report stage counts`,
    description: `Takes raw stage-by-stage pipeline numbers and rep notes and identifies the specific point in the funnel losing the most value, with a plain-language explanation of why, instead of a restated summary table.`,
    promptText: `Diagnose where this sales pipeline is actually losing deals and value — not a restatement of the numbers I give you, an actual diagnosis of the weakest point in the funnel and why it's weak.

PIPELINE STAGE DATA
{{stage_data}}

TIME PERIOD COVERED
{{time_period}}

HISTORICAL BASELINE, IF KNOWN
{{historical_baseline}}

CONTEXT ON WHAT CHANGED THIS PERIOD
{{context_on_changes}}

Compare conversion rates stage-to-stage against the historical baseline if one is given; if no baseline exists, say explicitly that any conclusion about 'worse than normal' can't be made yet and instead identify which stage has the lowest raw conversion rate in this data alone. Identify the single stage transition losing the most total deal value, not the most deal count — a stage that loses ten small deals matters less than one losing three large ones. Connect that weak point to a plausible operational cause using the context I've given about what changed this period (new rep, pricing change, competitor entry, process change) rather than a generic explanation like 'follow-up needs improvement.' If the data is too thin to diagnose a cause with any confidence, say so and name exactly what additional data (win-loss reasons, rep-level breakdown, deal size distribution) would resolve the ambiguity, rather than guessing to fill the gap.

OUTPUT FORMAT
- One paragraph: the single weakest stage transition, in dollar-value terms, and why it's the priority over other stages.
- A short table: stage, conversion rate, comparison to baseline (or 'no baseline' noted), deal value lost.
- The most plausible operational cause, explicitly labeled as a hypothesis to validate, not a confirmed finding.
- If applicable, the specific additional data that would turn the hypothesis into a confirmed finding.`,
    variables: [
      {
        name: 'stage_data',
        description: `Deal counts and dollar values at each pipeline stage for the period.`,
        example: `Discovery: 40 deals / $2.1M. Demo: 22 deals / $1.4M. Proposal: 14 deals / $1.1M. Negotiation: 9 deals / $780K. Closed-won: 5 deals / $410K.`,
        required: true,
      },
      {
        name: 'time_period',
        description: `The period this data covers.`,
        example: `Q3, July through September.`,
        required: true,
      },
      {
        name: 'historical_baseline',
        description: `Prior-period conversion rates for comparison, if available.`,
        example: `Last quarter, Demo-to-Proposal conversion was 72%; this quarter it's showing lower.`,
        required: false,
      },
      {
        name: 'context_on_changes',
        description: `Anything that changed operationally this period that could explain a shift.`,
        example: `Two new reps ramped mid-quarter and a competitor launched a lower-priced tier in month two.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `pipeline-analysis`,
      `sales-ops`,
      `conversion-rate`,
      `funnel-diagnosis`,
      `revenue-operations`,
    ],
    whyItWorks: `The core mechanism here is forcing value-weighted rather than count-weighted analysis: without that instruction, a model summarizing pipeline data defaults to the most visible pattern in the numbers, which is usually the stage with the largest deal-count drop, even when that stage represents comparatively little revenue at risk — this is the same mistake a rushed human analyst makes when eyeballing a funnel chart. Explicitly requiring a baseline comparison before any 'worse than normal' claim, and requiring an honest 'no baseline available' fallback, closes a specific hallucination risk: GPT-5.1 will otherwise sometimes imply a trend or decline exists because the prompt's framing (asking to diagnose a 'leak') primes it toward finding a problem, even from a single snapshot of data with nothing to compare against. Labeling the operational cause explicitly as a hypothesis rather than a finding matters because correlation between 'two new reps ramped' and 'conversion dropped' is not causation, and a model that states this connection with unwarranted confidence produces a report that gets treated as diagnosed when it's actually just plausible — the hypothesis label keeps a sales leader from over-rotating on an unverified explanation. Finally, requiring a named list of what additional data would resolve ambiguity turns a dead-end 'I don't know' into an actionable next step for whoever runs sales ops, which is what separates a useful diagnostic from a shrug.`,
    exampleOutput: `Weakest transition: Demo to Proposal, down from a historical 72% to roughly 64% this quarter, representing an estimated $290K in deal value that stalled before reaching Proposal. Hypothesis (unconfirmed): the two newly ramped reps may be struggling to translate demo interest into a scoped proposal, though the competitor's new lower-priced tier launching mid-quarter is an equally plausible cause. To confirm: a rep-level breakdown of Demo-to-Proposal conversion, and win-loss notes from deals that stalled at Demo this quarter.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-forecast-commentary-cro-narrative',
    category: 'sales',
    title: `Turn a raw pipeline export into forecast commentary a CRO would actually trust`,
    description: `Writes the plain-language narrative that accompanies a forecast number — what changed since last week, what's driving upside or downside risk, and what's still uncertain — instead of restating the spreadsheet in prose.`,
    promptText: `Write the forecast commentary that goes alongside this week's number to the CRO — the narrative explaining what changed and why, not a restatement of the spreadsheet in sentence form.

THIS WEEK'S FORECAST NUMBER AND CATEGORY BREAKDOWN
{{forecast_number_breakdown}}

WHAT CHANGED SINCE LAST WEEK
{{week_over_week_changes}}

DEALS DRIVING THE MOVEMENT
{{key_deals}}

COMMIT LEVEL YOU'RE ACCOUNTABLE FOR
{{commit_level}}

WHAT NOT TO DO
Do not restate the number and category totals in prose — the CRO already has the spreadsheet in front of them; the commentary's only job is to explain movement and risk that the numbers alone don't show. Do not use hedge words like 'should' or 'hopefully' about a specific deal without naming the specific condition that hedge depends on — 'should close' is not commentary, 'closes if procurement returns the redline by Friday, which is the one open item' is. Do not present a deal moving in the rep's favor as more certain than the commit level implies; if a deal is only Best Case, don't describe it in language that would be appropriate for Commit.

WRITE THE COMMENTARY IN THIS SHAPE
Open with one sentence on the headline direction (up, down, flat) versus last week and the single largest driver of that movement. Then, for each deal significant enough to have moved the number meaningfully, state what changed, what has to happen for it to hold at its current commit level, and the date that condition needs to resolve by. Close with the one thing most likely to change next week's number in either direction, and what you're doing about it before the next forecast call.`,
    variables: [
      {
        name: 'forecast_number_breakdown',
        description: `The current forecast total and its Commit / Best Case / Pipeline breakdown.`,
        example: `$1.42M total: Commit $780K, Best Case $410K, Pipeline $230K.`,
        required: true,
      },
      {
        name: 'week_over_week_changes',
        description: `What moved compared to last week's forecast call.`,
        example: `Commit is up $120K from last week; one $95K deal slipped from Commit to Best Case.`,
        required: true,
      },
      {
        name: 'key_deals',
        description: `The specific deals responsible for the biggest swings, with their status.`,
        example: `Acme Corp, $95K, slipped to Best Case because legal review is taking longer than expected; Beacon Retail, $180K, moved into Commit after verbal approval from their CFO.`,
        required: true,
      },
      {
        name: 'commit_level',
        description: `What commit level you personally are accountable for this period.`,
        example: `I'm accountable for the $780K Commit number holding without slippage.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `forecast-commentary`,
      `revenue-forecasting`,
      `sales-leadership`,
      `commit-review`,
      `pipeline-narrative`,
    ],
    whyItWorks: `Forecast commentary fails most often by becoming a prose mirror of the spreadsheet the reader already has open, and the explicit 'what not to do' instruction against restating totals is what breaks GPT-5.1 out of its default summarization behavior, which is to compress the input data back into sentence form when given a structured dataset and asked to 'write commentary' without a sharper constraint. Requiring every hedge word to be paired with the specific condition it depends on closes a subtler failure mode: without that rule, a model asked to sound appropriately cautious will often generate generic hedges ('this deal should close soon') that read as commentary but carry zero new information a CRO could act on — tying the hedge to a named condition and a date converts vague caution into something the reader can actually follow up on. The instruction not to describe a Best Case deal in Commit-level language matters because sales forecasting has a well-known bias where reps and even AI-generated summaries drift optimistic language onto uncertain deals simply because positive framing reads better in a narrative — explicitly anchoring the language register to the deal's actual commit category prevents the commentary from quietly inflating confidence beyond what the categorization already represents. Ending on a single largest swing risk, rather than a list, mirrors how an actual forecast call works: leadership has time for one clear risk and one action, not an exhaustive risk register.`,
    exampleOutput: `Forecast is up $120K week-over-week, driven primarily by Beacon Retail moving into Commit after verbal CFO approval. Acme Corp ($95K) slipped from Commit to Best Case — legal review is the open item, and it needs to clear by Thursday to have any chance of closing this month. Biggest swing risk next week: if Acme's legal review slips past Thursday, expect it to move to next quarter's pipeline rather than staying in this month's Best Case.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-win-loss-interview-synthesis',
    category: 'sales',
    title: `Synthesize win-loss interview notes into patterns a sales team will actually act on`,
    description: `Pulls recurring themes out of a batch of win-loss interview transcripts or notes, separating what actually drove the decision from surface-level comments, so the output becomes a real input to messaging and product priorities.`,
    promptText: `You are synthesizing a batch of win-loss interview notes into patterns the sales and product teams can act on. Your job is to find what actually drove each decision, not just collect quotable lines.

WIN-LOSS INTERVIEW NOTES
{{interview_notes}}

DEAL OUTCOMES (win or loss, and to whom if a loss)
{{deal_outcomes}}

TIME WINDOW AND SEGMENT
{{time_window_segment}}

HYPOTHESIS YOU WANT TESTED, IF ANY
{{existing_hypothesis}}

PHASE 1 — EXTRACT
For each interview, separate what the buyer said explicitly caused the decision from what they said as polite context around it. Buyers often soften a real reason ('pricing was a factor, but honestly the team just felt more comfortable with the other vendor's onboarding') — extract the second half as the real driver, not the first half as the official reason.

PHASE 2 — GROUP
Group extracted drivers into recurring themes across the batch, and for each theme state how many of the interviews support it and whether it appears more in wins or losses. Do not force a theme that only shows up once into a 'pattern' — a single data point is an anecdote, not a pattern, and should be reported separately as one.

PHASE 3 — TEST THE HYPOTHESIS
If a hypothesis was given, state plainly whether this batch of interviews supports it, contradicts it, or is inconclusive, and why — do not let a stated hypothesis bias which quotes get emphasized in your synthesis.

OUTPUT FORMAT
1. Top three recurring themes, each with supporting interview count and win/loss skew.
2. Any single-interview anecdotes worth flagging separately, labeled as such.
3. Hypothesis verdict, if one was given.
4. One recommendation each for sales messaging and for product, each tied directly to a named theme above.`,
    variables: [
      {
        name: 'interview_notes',
        description: `Raw notes or transcript excerpts from the win-loss interviews.`,
        example: `Interview 1 (loss to Competitor X): 'Pricing was close, but their implementation team had a dedicated onboarding specialist and ours would've been self-serve.' Interview 2 (win): 'We picked you because the demo showed the reporting feature our finance team specifically needed.'`,
        required: true,
      },
      {
        name: 'deal_outcomes',
        description: `The win/loss outcome and competitor (if lost) for each interview.`,
        example: `Interview 1: Loss, to Competitor X. Interview 2: Win. Interview 3: Loss, to internal build.`,
        required: true,
      },
      {
        name: 'time_window_segment',
        description: `The time period and segment these interviews cover.`,
        example: `Last two quarters, mid-market deals over $50K ACV.`,
        required: true,
      },
      {
        name: 'existing_hypothesis',
        description: `A theory you already suspect and want checked against the data.`,
        example: `We suspect we're losing mid-market deals on implementation support, not price.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `win-loss-analysis`,
      `competitive-intelligence`,
      `sales-messaging`,
      `customer-research`,
      `revenue-strategy`,
    ],
    whyItWorks: `The two-half extraction rule in Phase 1 targets a specific, well-documented behavior in win-loss interviews: buyers routinely lead with a socially comfortable reason (price, timing) and only reveal the real driver as a secondary aside, because naming the real reason directly can feel like a criticism of a relationship with the vendor they're declining. A model asked to just 'summarize the reason for the loss' without this instruction will typically extract the first, more prominent sentence, because that's structurally where a stated reason usually lives in a sentence — explicitly directing it to weigh the softer aside as the real signal corrects for this positional bias. Requiring an explicit count and win/loss skew per theme, and refusing to promote a single mention into a 'pattern,' addresses the tendency of language models to smooth interview data into confident-sounding generalizations regardless of how many data points actually support them — without this constraint, one vivid quote can end up driving an entire recommendation, which is exactly how bad product and messaging decisions get made off thin qualitative data. The hypothesis-testing phase is deliberately placed after the theme extraction rather than before, and the instruction to not let it bias quote emphasis exists because stating a hypothesis upfront is a well-known way to induce confirmation bias in an LLM's synthesis — it will otherwise selectively surface supporting quotes once it 'knows' what answer is expected, which defeats the actual purpose of testing a hypothesis against evidence rather than confirming it.`,
    exampleOutput: `Top theme: implementation support depth, supported by 4 of 6 interviews, skewing heavily toward losses (3 losses, 1 win mentioning it positively). Anecdote (single mention, not a pattern): one buyer cited a specific integration with a niche tool as decisive — worth tracking, not yet actionable. Hypothesis verdict: supported — the batch backs the suspicion that implementation support, not price, is the recurring loss driver in mid-market deals. Recommendation for sales: lead mid-market pitches with the onboarding model explicitly, before pricing comes up.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-battlecard-named-competitor',
    category: 'sales',
    title: `Build a competitor battlecard reps will pull up mid-call, not skim once and forget`,
    description: `Produces a scannable, mid-call-usable battlecard for a specific named competitor, organized around the moments a rep actually needs it, rather than a generic feature-comparison document nobody opens twice.`,
    promptText: `Build a battlecard for {{competitor_name}} that a rep can actually pull up mid-call and use in under ten seconds — not a static feature comparison document that gets read once in onboarding and never opened again.

OUR PRODUCT AND POSITIONING
{{our_positioning}}

WHAT WE KNOW ABOUT {{competitor_name}}
{{competitor_intel}}

WHERE WE ACTUALLY LOSE TO THEM
{{honest_loss_reasons}}

DEAL SITUATIONS WHERE THIS COMES UP MOST
{{common_deal_situations}}

STRUCTURE THE BATTLECARD AROUND MOMENTS, NOT FEATURES
Organize by the specific moment a rep encounters this competitor — 'prospect mentions them unprompted,' 'prospect is actively comparing pricing,' 'prospect says a colleague recommended them' — with a one-line response for each, not a features table down one side and theirs down the other. For each moment, give the rep something to say, not just something to know; a fact without a sentence to deliver it in still leaves the rep improvising live. Include the honest loss reasons explicitly and tell the rep how to acknowledge a real weakness rather than deny it — a rep who denies a known weakness the prospect has already researched loses credibility on everything else they say afterward. Flag anything in the competitor intel that's more than two quarters old as potentially stale, since competitor products and pricing change and a battlecard confidently repeating outdated information is worse than one admitting a gap.

OUTPUT FORMAT
- A 'when this comes up' section: 4-6 real moments, each with a one-sentence thing to say.
- A 'where we honestly lose' section: 2-3 items, each with how to acknowledge it without conceding the whole deal.
- A 'landmine questions to ask' section: 2-3 questions that surface the competitor's actual weak point through the prospect's own answer, rather than the rep stating it directly.
- A staleness flag on any intel older than two quarters.`,
    variables: [
      {
        name: 'competitor_name',
        description: `The specific competitor this battlecard is for.`,
        example: `Northbeam Analytics`,
        required: true,
      },
      {
        name: 'our_positioning',
        description: `How your product is positioned and its core differentiators.`,
        example: `We're positioned on faster time-to-value — live in under a week — versus a heavier implementation.`,
        required: true,
      },
      {
        name: 'competitor_intel',
        description: `What you actually know about them: pricing, product gaps, recent changes.`,
        example: `They raised prices 15% last quarter and require a 6-week onboarding with a dedicated implementation team.`,
        required: true,
      },
      {
        name: 'honest_loss_reasons',
        description: `The real reasons deals are lost to this competitor, without spin.`,
        example: `Their reporting module is genuinely more customizable than ours for enterprise finance teams.`,
        required: true,
      },
      {
        name: 'common_deal_situations',
        description: `The specific moments in a sales cycle this competitor tends to come up.`,
        example: `Usually surfaces when the prospect is a former customer of theirs, or when finance stakeholders get looped in mid-cycle.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `competitive-battlecard`,
      `competitive-intelligence`,
      `sales-enablement`,
      `objection-handling`,
      `positioning`,
    ],
    whyItWorks: `Organizing around moments instead of features directly targets why most battlecards go unused: a side-by-side feature table requires the rep to do the translation work live, mapping a static document to whatever the prospect just said, under time pressure on a call — moment-based structure does that mapping in advance, so the rep is pattern-matching a trigger phrase to a ready response instead of improvising from a reference sheet, which is a fundamentally easier cognitive task mid-call. Requiring an honest acknowledgment of real weaknesses rather than a denial or deflection reflects a specific finding in competitive sales conversations: a prospect who has already done their own research and hears a rep flatly deny a known gap discounts everything else that rep says afterward, so the battlecard's value comes from giving the rep language that concedes the specific point while redirecting to what still matters, not from pretending the weakness doesn't exist. The landmine-questions section exists because a rep stating a competitor's weakness directly reads as biased sales talk, while the same weakness surfacing through the prospect's own answer to a well-placed question is self-persuasion, which is far more durable than being told something by the person trying to win their business. The staleness flag matters mechanically because competitor intel embedded in a prompt has no way to self-verify against current reality — GPT-5.1 will confidently repeat whatever intel it's given as current fact unless explicitly instructed to flag its age, and stale pricing or feature claims stated with false confidence is a more damaging failure than an acknowledged gap in the battlecard's freshness.`,
    exampleOutput: `When this comes up: prospect says 'we're also looking at Northbeam' -> 'A lot of teams compare us on implementation speed specifically — we're typically live in under a week versus their six-week onboarding.' Where we honestly lose: their reporting customization is genuinely deeper for complex finance use cases -> acknowledge it, then pivot to how fast the team can start using what we do have. Landmine question: 'How long did their team say implementation would take before you'd see full reporting live?'`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-negotiation-prep-procurement-pushback',
    category: 'sales',
    title: `Prep for a negotiation call where procurement is going to push on price and terms`,
    description: `Builds a negotiation prep brief for a specific upcoming call with procurement — likely pressure points, fallback positions ranked by what you'd actually give up first, and the walk-away line — instead of generic negotiation tactics.`,
    promptText: `Prep me for a negotiation call with {{prospect_company}}'s procurement team. I need a working brief for this specific call, not general negotiation advice.

DEAL TERMS ON THE TABLE
{{deal_terms}}

WHAT PROCUREMENT HAS ALREADY PUSHED ON
{{known_pushback}}

WHAT I CAN ACTUALLY FLEX ON, RANKED BY WHAT I'D GIVE UP FIRST
{{flexibility_ranked}}

MY WALK-AWAY LINE
{{walk_away_line}}

For each pushback point already flagged, give me the specific response to say out loud, not a strategy summary — the words I'd actually use on the call. Rank my flexibility items in the order I should offer them if pressed, starting with the one that costs least, and for each one state the specific ask I should get in return for giving it, since an unreciprocated concession trains procurement to keep pushing with no cost to them. If procurement is likely to bundle multiple asks together (price down and payment terms extended and a longer contract, all at once), tell me how to respond to a bundled ask without conceding to all three just because they were presented as one request. State my walk-away line back to me in the form I should actually deliver it in, calm and specific, not as an ultimatum threat — and tell me the one thing that would have to change for me to reconsider it, so I'm not boxed into a line I can't move off of if the conversation genuinely shifts.

OUTPUT FORMAT
1. A pushback-to-response table for each known pushback point.
2. My flexibility ladder, in order, each item paired with what I ask for in return.
3. A note on de-bundling a combined ask, if relevant.
4. My walk-away line, worded for delivery, plus the one condition that would change it.`,
    variables: [
      {
        name: 'prospect_company',
        description: `The company whose procurement team you're negotiating with.`,
        example: `Alderbrook Manufacturing`,
        required: true,
      },
      {
        name: 'deal_terms',
        description: `The current terms on the table before this call.`,
        example: `Annual contract, $84K, net-30 payment, standard 12-month term.`,
        required: true,
      },
      {
        name: 'known_pushback',
        description: `Specific pushback procurement has already raised, if any.`,
        example: `They've said the price needs to come down 15% to match what they claim a competitor quoted.`,
        required: true,
      },
      {
        name: 'flexibility_ranked',
        description: `What you can actually concede, in the order you'd give it up.`,
        example: `1) Extend payment terms to net-45. 2) A 5% discount for a 2-year commitment instead of 1-year. 3) Waive the onboarding fee.`,
        required: true,
      },
      {
        name: 'walk_away_line',
        description: `The point past which you won't go, and what happens if they push past it.`,
        example: `I won't go below $76K annual regardless of term length; below that, we'd need to cut scope instead.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `negotiation-prep`,
      `procurement`,
      `deal-terms`,
      `sales-strategy`,
      `objection-handling`,
    ],
    whyItWorks: `Requiring the actual words to say, rather than a strategy summary, matters because the gap in most negotiation prep isn't knowing the right approach in the abstract, it's having the specific sentence ready under real-time pressure on a call — a rep who understands 'anchor high and concede slowly' in theory still freezes if they haven't rehearsed the literal phrasing, so the prompt is deliberately built to produce script, not theory. Ranking flexibility items and pairing each with a required reciprocal ask directly encodes a core negotiation principle that's easy to state and easy to forget live: an unreciprocated concession costs you the item and signals to the other side that pressure alone moves your position, training them to keep pushing on every remaining point with no cost to doing so — writing the reciprocal ask into the brief in advance means it's said in the moment rather than remembered after the call is over. The de-bundling instruction addresses a specific procurement tactic where several asks presented as one request create pressure to concede across the board rather than negotiate each on its own merits; a model without this instruction will typically just answer the bundled ask as posed, missing the tactical framing entirely. Wording the walk-away line for calm delivery rather than as an ultimatum, and naming the one condition that would move it, matters because a walk-away line delivered as a threat invites the other side to test it, while the same line delivered as a stated fact with a named condition for reconsideration reads as confidence rather than posturing — and having the condition named in advance prevents the rep from either caving too easily or refusing to move even when the actual situation has genuinely changed.`,
    exampleOutput: `Pushback: 'need 15% off to match a competitor quote' -> 'I hear that, and I'd want to see that quote to compare line items directly — in my experience those numbers often aren't apples to apples once implementation and support are factored in. What I can do is extend payment terms to net-45, which changes your cash position without cutting the contract value.' Walk-away line: 'I can't go below $76K annual regardless of term length — if budget is the hard constraint, the honest move is to talk about scope, not price.'`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-pricing-conversation-discount-request',
    category: 'sales',
    title: `Script how to respond when a prospect asks for a discount you don't want to give`,
    description: `Writes the exact response to a specific discount request, holding the price while offering something that costs you less than the discount would, instead of a generic 'how to handle price objections' explainer.`,
    promptText: `A prospect just asked for a discount and I need to respond well on the call or in the follow-up email, not read a general explainer on handling price objections.

THE ACTUAL REQUEST
{{discount_request}}

WHERE THIS DEAL STANDS
{{deal_context}}

WHAT I CAN OFFER INSTEAD OF A STRAIGHT DISCOUNT
{{alternative_value_levers}}

HOW MUCH ROOM I ACTUALLY HAVE, IF ANY
{{real_flexibility}}

WHAT NOT TO DO
Do not open by justifying the price with a list of features — that answers a question the prospect didn't ask and reads as defensive. Do not say 'let me see what I can do' as a placeholder; if there's real flexibility, name the specific thing on the table, and if there isn't, say so plainly rather than implying movement that isn't coming. Do not offer a discount and a value-add in the same breath as if they're a package — the value-add is the alternative to the discount, not an addition on top of it, and blurring that undercuts the whole point of holding price.

WRITE ME THE RESPONSE
Write it in the voice I'd actually use, in whichever format ({{delivery_format}}) I need it in, opening by acknowledging the request directly without defensiveness, then moving to the alternative value lever framed as what I can actually do, and only naming a real discount number if I've told you I have room to give one. Close with a specific next step, not an open-ended 'let me know what you think.'`,
    variables: [
      {
        name: 'discount_request',
        description: `Exactly what the prospect asked for.`,
        example: `They asked for 20% off, saying budget was approved for less than our quoted price.`,
        required: true,
      },
      {
        name: 'deal_context',
        description: `Where the deal stands and any relevant leverage or urgency.`,
        example: `Verbally committed to us already, just need to get the number to work; deal is otherwise ready to sign this week.`,
        required: true,
      },
      {
        name: 'alternative_value_levers',
        description: `Things you can give instead of cutting price.`,
        example: `Can throw in the premium support tier free for year one, worth roughly what a 10% discount would cost us.`,
        required: true,
      },
      {
        name: 'real_flexibility',
        description: `How much actual price room you have, if any.`,
        example: `I have about 5% of real room if it comes to that, but I'd rather not lead with it.`,
        required: true,
      },
      {
        name: 'delivery_format',
        description: `Whether this needs to be a spoken response, an email, or a chat message.`,
        example: `A follow-up email after the call.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `pricing-objection`,
      `discount-strategy`,
      `sales-negotiation`,
      `value-selling`,
      `deal-closing`,
    ],
    whyItWorks: `The instruction against opening with a feature-justification list corrects a very common default pattern: when a model is given a price objection and asked to help respond, it tends toward defending the price's worth first, because that's the most obvious surface-level interpretation of 'they think it costs too much' — but a prospect who explicitly asked for a discount already accepts the value proposition and is negotiating terms, not asking to be resold, so a features-first response answers the wrong question and reads as not having listened. Banning 'let me see what I can do' as a placeholder targets a specific weak habit in sales language: it's filler that sounds like movement without committing to anything, and prospects recognize it as such, which either invites them to push harder for specifics or reads as evasive — forcing a concrete answer, positive or negative, is more respected than a vague non-answer either way. The rule against presenting a discount and a value-add together as a bundle protects the entire strategic point of the exercise: the alternative value lever exists specifically to avoid discounting, so if the model blends the two into one offer, it accidentally produces the outcome the prompt was trying to prevent — a full price cut with something extra piled on top, costing more than the discount alone would have. Gating any real discount number behind an explicit statement of actual flexibility prevents the model from inventing a plausible-sounding number when none was given, which matters because a fabricated discount figure delivered confidently in a drafted response could get sent to a real prospect as if it were an authorized offer.`,
    exampleOutput: `Thanks for being direct about the budget number — I want to find a way to make this work without just cutting the price, since I think it undersells what you're getting. What I can do is include the premium support tier free for the first year, which is worth roughly what the 20% would have cost us, and keeps the full platform intact rather than trimming anything. If that works, I can get the paperwork updated and back to you by end of day tomorrow.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-upsell-script-usage-triggered',
    category: 'sales',
    title: `Write an upsell conversation triggered by a customer hitting a usage ceiling`,
    description: `Turns a specific usage-limit trigger into an upsell conversation that reads as a helpful heads-up about their own growth, not a sales pitch disguised as a check-in.`,
    promptText: `A customer just hit a usage ceiling on their current plan, and I need to reach out about upgrading before it becomes a problem for them, not pitch an upsell out of nowhere.

CUSTOMER AND WHAT THEY HIT
{{usage_trigger}}

CURRENT PLAN AND WHAT THE NEXT TIER UNLOCKS
{{plan_and_next_tier}}

HOW THEY'VE BEEN USING THE PRODUCT
{{usage_pattern}}

RELATIONSHIP CONTEXT
{{relationship_context}}

PHASE 1 — FRAME THE TRIGGER AS THEIR SIGNAL, NOT MINE
Open by naming the specific usage pattern that triggered this outreach, framed as evidence of their own growth or adoption, not as an account limit I'm enforcing. The message should read as if I noticed something about their success and I'm flagging it proactively, because that's actually what happened — I shouldn't manufacture urgency that isn't there.

PHASE 2 — CONNECT THE NEXT TIER TO WHAT THEY'RE ALREADY DOING
Explain what the next tier unlocks specifically in terms of the usage pattern they're already exhibiting, not a generic list of everything in the higher tier — if they're hitting the ceiling on one specific feature, lead with what changes for that feature, and only mention other tier benefits briefly afterward.

PHASE 3 — MAKE THE NEXT STEP LOW-FRICTION
End with an easy next step — a short call, or just a yes/no on moving forward — rather than a hard pitch for a meeting, since this is a warm, expected conversation given the usage trigger, not a cold ask.

WHAT NOT TO DO
Do not use scarcity or urgency language ('upgrade now before you lose access') unless the account will actually be functionally limited soon — if it's a soft ceiling with no real consequence, say so honestly rather than inventing pressure.

OUTPUT FORMAT
A single outreach message (email or in-app message, matching {{delivery_channel}}), 120-180 words, plus one alternate subject line if it's an email.`,
    variables: [
      {
        name: 'usage_trigger',
        description: `The specific usage limit or pattern that triggered this outreach.`,
        example: `They've hit 95% of their monthly API call limit for the third month running.`,
        required: true,
      },
      {
        name: 'plan_and_next_tier',
        description: `The current plan and what specifically changes in the next tier.`,
        example: `Currently on Growth plan (100K calls/month); Scale plan raises the limit to 500K and adds priority rate limiting.`,
        required: true,
      },
      {
        name: 'usage_pattern',
        description: `What they've actually been doing with the product that led here.`,
        example: `Usage has climbed steadily as they've rolled the integration out to two more internal teams.`,
        required: true,
      },
      {
        name: 'relationship_context',
        description: `Who the contact is and the tone of the existing relationship.`,
        example: `Technical lead I've emailed with a few times, generally responsive, no prior pricing pushback.`,
        required: true,
      },
      {
        name: 'delivery_channel',
        description: `Whether this goes out as an email or an in-app message.`,
        example: `Email`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `upsell`,
      `usage-based-selling`,
      `customer-success`,
      `account-growth`,
      `expansion-revenue`,
    ],
    whyItWorks: `Framing the usage ceiling as the customer's own signal rather than an account limit being imposed is the mechanism that keeps this from reading as a disguised sales pitch: a model asked to 'write an upsell message' without this framing instruction defaults to product-benefit language centered on what the vendor offers, when the actually persuasive angle here is what the trigger says about the customer's own success, which they experience as being seen rather than sold to. Tying the next tier's benefits specifically to the usage pattern they're already exhibiting, instead of listing the full feature set of the higher plan, matters because a generic upgrade pitch forces the reader to do the work of figuring out which of five listed benefits actually applies to them — leading with the one thing directly tied to what triggered the message removes that translation work and makes the relevance immediately obvious. The explicit ban on manufactured urgency addresses a known weak spot in AI-generated sales copy: models trained on marketing text default toward scarcity language ('upgrade now') because it's a common persuasive pattern in the training distribution, but applying it to a soft, consequence-free usage ceiling creates false pressure that a technically sophisticated buyer (the kind hitting API limits) will notice and discount, damaging trust in every future outreach from the same sender. Ending on a low-friction next step rather than a meeting request reflects that this conversation is already warm and expected given the trigger — asking for more commitment than the moment calls for is a common upsell mistake that turns a natural next step into something that feels like a bigger ask than it needs to be.`,
    exampleOutput: `Subject: You're close to your API limit again this month — noticed the pattern. Hi Jordan, I saw your team's hit about 95% of the monthly API call limit for three months running now, which tracks with rolling the integration out to two more teams. That's a good problem to have. The Scale plan raises that ceiling to 500K calls and adds priority rate limiting, so you wouldn't need to think about this again for a while. Want me to send over what that would look like, or happy to hop on a quick call if easier?`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-cross-sell-adjacent-product-pitch',
    category: 'sales',
    title: `Pitch an adjacent product to an existing customer without sounding like a cold pitch`,
    description: `Writes a cross-sell pitch grounded in a specific problem the existing customer already has, connecting it to what they already trust about the relationship, instead of a generic new-product announcement.`,
    promptText: `Write a cross-sell pitch to {{customer_name}}, an existing customer, for {{adjacent_product}} — it needs to read like it's grounded in a real problem they have, not a generic 'check out our other product' announcement.

WHAT WE KNOW ABOUT A PROBLEM THIS PRODUCT SOLVES FOR THEM
{{known_problem}}

HOW LONG THEY'VE BEEN A CUSTOMER AND OF WHAT
{{tenure_and_current_product}}

WHY THIS ISN'T JUST A COINCIDENTAL PITCH
{{connection_to_existing_relationship}}

Ground the pitch in the specific known problem, stated in their own likely language, before mentioning the adjacent product by name — the problem has to feel recognized, not invented to justify a pitch. Reference the existing relationship specifically enough that it's clear this is coming from someone who actually knows their account, not a mail-merged cross-sell blast — cite something concrete about their tenure or current usage, not a vague 'as a valued customer' line. If the connection between the known problem and the adjacent product requires two logical steps rather than one, spell out the middle step explicitly rather than assuming the reader will make the jump themselves — a cross-sell pitch that requires the customer to do inference work to see the relevance loses them before they get to the ask. Keep the tone as a colleague flagging something useful, not a rep hitting quota, and make the next step something easy to say yes to.

OUTPUT FORMAT
One outreach message, {{length_target}} words, plus a one-line internal note on the strongest single reason this customer specifically is a good fit for the adjacent product, for my own reference before I send it.`,
    variables: [
      {
        name: 'customer_name',
        description: `The existing customer this pitch is for.`,
        example: `Riverton Health Group`,
        required: true,
      },
      {
        name: 'adjacent_product',
        description: `The product you're cross-selling.`,
        example: `Our analytics add-on module`,
        required: true,
      },
      {
        name: 'known_problem',
        description: `A specific problem you know or suspect this customer has that the adjacent product solves.`,
        example: `Their team has mentioned manually exporting data to build reports for their board meetings each month.`,
        required: true,
      },
      {
        name: 'tenure_and_current_product',
        description: `How long they've been a customer and what they currently use.`,
        example: `Customer for 18 months, on the core scheduling platform, generally satisfied based on last QBR.`,
        required: true,
      },
      {
        name: 'connection_to_existing_relationship',
        description: `Something specific tying this pitch to the real relationship, not a generic reason.`,
        example: `Their ops lead specifically asked in our last call whether there was a way to automate the board report exports.`,
        required: true,
      },
      {
        name: 'length_target',
        description: `Roughly how long the message should be.`,
        example: `100-150`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `cross-sell`,
      `account-growth`,
      `existing-customer-outreach`,
      `product-adoption`,
      `relationship-selling`,
    ],
    whyItWorks: `Requiring the problem to be stated in the customer's own likely language before the product is named addresses a structural weakness in AI-generated cross-sell copy: models will readily produce grammatically fluent product-benefit sentences, but a pitch that leads with the product name and works backward to a justification reads as exactly what it is — a pitch looking for a reason, rather than a reason that happens to have a pitch attached — and buyers who've seen enough vendor outreach can tell the difference on a skim. Requiring a specific, concrete detail about tenure or usage rather than a generic 'valued customer' line matters because that generic phrase is a well-known marker of mail-merge automation, and using it (or letting a model default to it, which it will if not told otherwise) signals to the reader that this wasn't actually written with their account in mind, undermining the entire premise of relationship-based cross-selling. The instruction to spell out an implied two-step logical connection rather than leaving it implicit exists because models tend to compress reasoning chains when writing persuasive copy — they'll happily state a conclusion ('this add-on would help you') without showing the connecting logic, but a reader who has to reconstruct that connection themselves is a reader who disengages before reaching the ask, since making an unstated inferential leap is real cognitive work that most recipients skimming an email won't do. The internal-note request at the end is a deliberate quality check: forcing the model to state its single strongest reasoning for fit, separate from the customer-facing copy, surfaces whether the pitch is actually grounded in something specific or whether it's dressed-up generic reasoning, before the message goes out.`,
    exampleOutput: `Hi Priya, I remember your ops lead asking on our last call whether there was a way to automate the manual data exports your team pulls together for board reporting each month. Our analytics add-on does exactly that — it would plug directly into the scheduling data you're already using and generate that board-ready report automatically, no manual export needed. Want me to put together a quick walkthrough of what it would look like with your actual data? Internal note: strongest fit reason — this directly answers a specific, recent, unprompted question from their own team, not an inferred need.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-renewal-outreach-at-risk-account',
    category: 'sales',
    title: `Draft renewal outreach for an account showing signs of churn risk before the contract date`,
    description: `Writes a renewal check-in for an account with early churn signals, surfacing the risk honestly to open a real conversation rather than a cheerful renewal reminder that ignores what's actually going on.`,
    promptText: `Draft renewal outreach for {{account_name}}, whose contract renews {{renewal_timeframe}}, but who's showing signs of churn risk — this needs to open a real conversation about what's going on, not a cheerful 'time to renew!' reminder that ignores the risk signals.

RISK SIGNALS OBSERVED
{{risk_signals}}

RELATIONSHIP AND CONTACT HISTORY
{{relationship_history}}

WHAT WE'D WANT TO OFFER OR ADDRESS IF THE RISK IS REAL
{{potential_remedy}}

SECTION 1 — ACKNOWLEDGE, DON'T IGNORE
Open by referencing something specific and true about their recent experience — a dip in usage, a support ticket that didn't resolve well, a champion who left — rather than opening with contract logistics as if nothing has changed. If you don't have a specific enough signal to reference honestly, say that explicitly instead of inventing a plausible-sounding one to open with.

SECTION 2 — ASK, DON'T ASSUME
Ask a direct, specific question about what's changed, rather than assuming you already know the cause of the risk signal and pitching a fix to a problem that might not be the real one — the point of this outreach is to find out what's actually happening, not to preemptively solve a guessed-at problem.

SECTION 3 — MAKE THE RENEWAL CONVERSATION SECONDARY
Mention the renewal date only after the relationship question, framed as something to figure out together once you understand what's going on, not as the primary reason for reaching out — leading with the contract date when the relationship is at risk reads as self-interested timing.

OUTPUT FORMAT
One outreach message ({{delivery_channel}}), plus a separate one-line internal note flagging the specific risk signal that most needs a real answer before this renewal can be considered safe.`,
    variables: [
      {
        name: 'account_name',
        description: `The at-risk account.`,
        example: `Fennimore Retail Group`,
        required: true,
      },
      {
        name: 'renewal_timeframe',
        description: `When the contract renews.`,
        example: `in six weeks`,
        required: true,
      },
      {
        name: 'risk_signals',
        description: `Specific, concrete signs of churn risk you've observed.`,
        example: `Logins dropped roughly 40% over the last two months, and their main champion left the company three weeks ago with no clear successor identified.`,
        required: true,
      },
      {
        name: 'relationship_history',
        description: `Who you've been dealing with and how the relationship has gone.`,
        example: `Previously strong relationship with the champion who left; no established contact with anyone else on their team yet.`,
        required: true,
      },
      {
        name: 'potential_remedy',
        description: `What you could offer or address if the risk turns out to be real.`,
        example: `Could offer a re-onboarding session for whoever takes over, or a temporary success-manager check-in cadence.`,
        required: false,
      },
      {
        name: 'delivery_channel',
        description: `How this outreach will be delivered.`,
        example: `Email, with a phone call as a planned follow-up if no response in three days.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `renewal-outreach`,
      `churn-prevention`,
      `customer-success`,
      `account-management`,
      `retention`,
    ],
    whyItWorks: `The instruction to acknowledge a real risk signal rather than open with contract logistics addresses a common failure of AI-generated renewal templates: asked to write 'renewal outreach' without more context, a model defaults to the generic register of a renewal reminder, because that's the more common pattern in its training data, even when the actual account context describes clear churn risk — the explicit acknowledgment requirement forces the output to match the real situation rather than the generic template shape the request superficially resembles. The instruction to ask rather than assume the cause matters because a model given a risk signal (dropped usage, a departed champion) will often jump straight to proposing a plausible-sounding fix, which risks solving the wrong problem entirely — usage dropping after a champion leaves could mean the replacement hasn't been onboarded, or it could mean the whole account is deprioritizing the tool internally, and these call for completely different responses, so the outreach needs to surface which one it actually is before offering a remedy. Making the renewal date secondary to the relationship question is a deliberate sequencing choice that changes how the message reads: leading with 'your contract renews in six weeks' to an account with visible risk signals reads as the vendor's self-interest driving the timing of the outreach, while leading with a genuine question about what changed and mentioning the date afterward reads as actually caring about the relationship independent of the contract clock — the same information in a different order produces a materially different impression on the reader. Requiring an internal note naming the specific risk signal needing an answer, separate from the customer-facing message, keeps the account owner honest about whether this renewal is actually safe rather than treating the act of sending outreach as having resolved the risk.`,
    exampleOutput: `Hi Marcus, I noticed things have looked a bit different on your end the past couple months — usage has dropped off some since Dana moved on, and I wanted to check in directly rather than assume what's going on. Is the team still finding the platform useful day-to-day, or has something shifted on your side? Once I understand where things stand, we can figure out the renewal together — no rush on that part yet. Internal note: the open risk signal that needs an answer before this renewal is safe is whether a successor to the departed champion has actually been assigned.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-expansion-plan-account-whitespace',
    category: 'sales',
    title: `Map an account expansion plan from usage data and org chart whitespace`,
    description: `Builds a phased expansion plan for an existing account using actual usage data and known org structure, identifying real whitespace to pursue and in what order, instead of a generic 'grow the account' outline.`,
    promptText: `Build an expansion plan for {{account_name}} based on actual usage data and what we know about their org, not a generic 'ways to grow this account' outline.

CURRENT FOOTPRINT AND USAGE DATA
{{current_footprint}}

ORG STRUCTURE AND KNOWN STAKEHOLDERS
{{org_structure}}

DEPARTMENTS OR TEAMS NOT YET USING THE PRODUCT
{{unused_departments}}

TIMELINE PRESSURE, IF ANY
{{timeline_pressure}}

PHASE 1 — IDENTIFY REAL WHITESPACE
Distinguish between whitespace that's actually reachable (a team with a known internal champion or a clear adjacent use case to current usage) and whitespace that's theoretical (a department that could technically use the product but with no identified path in). Rank only the reachable whitespace for the plan; list theoretical whitespace separately as longer-term and not yet actionable.

PHASE 2 — SEQUENCE THE EXPANSION
Sequence the reachable expansion targets in the order that makes the most sense given dependencies — for example, expanding within a department that already has a strong champion before cold-approaching a department with no internal advocate, since an internal referral changes the whole approach needed. For each step, name what has to be true before moving to the next one.

PHASE 3 — NAME THE RISK OF MOVING TOO FAST
If pursuing multiple expansion paths simultaneously risks overwhelming the main point of contact or creating internal confusion about who owns the relationship, say so explicitly and recommend a pace, rather than presenting an aggressive multi-track plan as if speed carries no cost.

OUTPUT FORMAT
1. Reachable whitespace, ranked, each with the specific reason it's reachable now.
2. Theoretical whitespace, listed separately, with what would need to change to make it reachable.
3. A sequenced plan with dependencies named at each step.
4. A pacing recommendation addressing the risk of moving on too many fronts at once.`,
    variables: [
      {
        name: 'account_name',
        description: `The account you're building an expansion plan for.`,
        example: `Corvallis Health Systems`,
        required: true,
      },
      {
        name: 'current_footprint',
        description: `What's currently deployed and how it's being used.`,
        example: `Deployed in the scheduling team, 45 active users, high daily engagement.`,
        required: true,
      },
      {
        name: 'org_structure',
        description: `What you know about the broader org and key people.`,
        example: `Scheduling reports up to Operations; Clinical Ops is a separate, larger department with its own budget and VP.`,
        required: true,
      },
      {
        name: 'unused_departments',
        description: `Departments or teams not currently using the product.`,
        example: `Clinical Ops, Billing, and a regional satellite office haven't adopted it.`,
        required: true,
      },
      {
        name: 'timeline_pressure',
        description: `Any deadline or budget-cycle pressure shaping the plan's pace.`,
        example: `Their next fiscal year budget planning starts in ten weeks, which is the real window to get a new line item considered.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `account-expansion`,
      `whitespace-mapping`,
      `account-planning`,
      `land-and-expand`,
      `enterprise-sales`,
    ],
    whyItWorks: `Distinguishing reachable from theoretical whitespace targets a specific weakness in AI-generated account plans: without that constraint, a model given an org chart and a list of unused departments will happily generate an expansion idea for every department, because more coverage looks more thorough, but a plan that treats an unreachable department (no champion, no adjacent use case, no known entry point) with the same weight as a genuinely reachable one produces a list of ideas rather than a plan anyone can actually execute against this quarter. Sequencing by dependency rather than listing targets in isolation reflects how account expansion actually works in practice: an internal referral from an existing champion fundamentally changes the sales motion needed compared to a cold approach into a department with no advocate, so treating both as equivalent next steps ignores the single biggest lever available in expansion selling, which is that an existing relationship inside the account is worth more than any external pitch. The explicit instruction to name the risk of moving on too many fronts at once counters a bias toward generating maximally ambitious plans: a model asked to build an 'expansion plan' will often produce an energetic, parallel-track plan because it reads as more valuable output, but overwhelming a single point of contact with multiple simultaneous asks is a known way to create internal confusion about deal ownership and actually slow expansion down rather than speed it up — naming this tradeoff explicitly keeps the plan honest about pace rather than optimizing for the appearance of ambition.`,
    exampleOutput: `Reachable whitespace: Clinical Ops — the scheduling team lead has a standing relationship with their director and has already mentioned interest informally; this is reachable now via warm introduction. Theoretical whitespace: Billing — no known contact, no clear adjacent use case yet; revisit once a use case or contact emerges. Sequenced plan: first, get the warm introduction to Clinical Ops's director before their fiscal planning window opens in ten weeks; only pursue Billing after Clinical Ops shows initial traction, to avoid running two unproven pitches into the same account simultaneously.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-partner-outreach-channel-recruit',
    category: 'sales',
    title: `Recruit a new channel partner with outreach that leads with their upside, not yours`,
    description: `Writes first-touch outreach to a prospective channel partner that opens with a concrete reason it benefits their business specifically, rather than a generic partnership-program pitch.`,
    promptText: `Write first-touch outreach recruiting {{prospective_partner}} as a channel partner. It needs to open with a concrete reason this benefits their business specifically — not a generic 'join our partner program' pitch that could be sent to anyone.

WHO THEY ARE AND WHAT THEY SELL
{{partner_profile}}

WHY THEIR CUSTOMER BASE OVERLAPS WITH OURS
{{customer_overlap}}

WHAT'S ACTUALLY IN IT FOR THEM
{{partner_upside}}

HOW WE FOUND THEM OR WHY WE'RE REACHING OUT NOW
{{outreach_trigger}}

Lead with the specific overlap between their existing customer base and what we offer, stated concretely enough that it's clear we understand their business, not just that we have a partner program to fill. State the upside for them specifically — new revenue stream, a way to round out their own offering, reduced churn from being able to solve a problem they currently can't — rather than defaulting to vague language like 'mutually beneficial partnership.' If there's a real reason we're reaching out now rather than generically at any time, name it, since a partnership pitch with no timing rationale reads as a mass outreach rather than a considered approach to this specific company. Keep the ask small for a first touch — a short exploratory call, not a request to sign a partner agreement — since channel partnerships take real evaluation on their side and asking for too much too soon signals we don't understand that.

OUTPUT FORMAT
One outreach email, under 150 words, with a subject line that references the specific overlap rather than a generic 'partnership opportunity' subject.`,
    variables: [
      {
        name: 'prospective_partner',
        description: `The company you're recruiting as a channel partner.`,
        example: `Meridian IT Consulting`,
        required: true,
      },
      {
        name: 'partner_profile',
        description: `What this company does and sells.`,
        example: `Mid-market IT consultancy that implements ERP systems for manufacturing clients.`,
        required: true,
      },
      {
        name: 'customer_overlap',
        description: `Why their customers and yours are the same or adjacent audience.`,
        example: `Their ERP implementation clients frequently need the inventory forecasting tool we sell as a follow-on purchase.`,
        required: true,
      },
      {
        name: 'partner_upside',
        description: `The concrete benefit to them specifically, not a generic partnership benefit.`,
        example: `They could offer our tool as an add-on to their implementation packages, adding a new margin line without building it themselves.`,
        required: true,
      },
      {
        name: 'outreach_trigger',
        description: `Why you're reaching out to them now, if there's a specific reason.`,
        example: `Saw they just announced a new manufacturing vertical practice, which is exactly where our forecasting tool is most relevant.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `channel-partnerships`,
      `partner-recruitment`,
      `b2b-outreach`,
      `co-selling`,
      `partnership-strategy`,
    ],
    whyItWorks: `Leading with the specific customer-base overlap rather than the partnership program itself corrects the most common failure mode in AI-generated partner outreach: asked to write a 'partner recruitment email,' a model will default to describing the partner program's structure and benefits, because that's the most literal reading of the request, but the recipient of a cold partnership pitch is evaluating one thing first — does this sender actually understand my business — and a message that opens with the sender's program rather than the recipient's specific customer overlap fails that test in the first sentence. Requiring the upside stated concretely rather than as 'mutually beneficial partnership' targets a specific weakness where language models reach for exactly that phrase as a safe, generic placeholder when a request involves partnership framing — it sounds appropriately professional while committing to nothing specific, and a recipient who has seen dozens of partner pitches recognizes it instantly as boilerplate, whereas a concretely stated benefit ('a new margin line without building it yourselves') is specific enough to be evaluated and acted on. The instruction to name a real timing trigger, when one exists, matters because a partnership pitch that could plausibly have been sent on any random day reads as mass outreach even when it isn't, while a timing hook tied to something the recipient just did (announcing a new practice area) signals genuine attention and research. Keeping the first-touch ask deliberately small reflects how channel partnership decisions actually get made — they require internal evaluation on the partner's side that a single email cannot shortcut, so asking for a signed agreement or major commitment in a first touch is a mismatch between what's being asked and what's realistic to grant this early, and it's a mismatch that reads as either naive or presumptuous.`,
    exampleOutput: `Subject: Your manufacturing clients probably need this after ERP go-live. Hi Sam, congrats on the new manufacturing vertical practice — that's exactly the client base where we keep seeing a specific gap after ERP implementation: inventory forecasting that the ERP itself doesn't really handle well. A few consultancies we work with now offer our tool as a natural add-on to their implementation packages, picking up a new margin line without building anything themselves. Worth a short call to see if it's a fit for your practice?`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-channel-strategy-conflict-rules',
    category: 'sales',
    title: `Design channel strategy rules that prevent partner and direct sales from fighting over the same deal`,
    description: `Drafts concrete channel conflict rules — deal registration, territory boundaries, and margin-sharing logic — targeted at the specific overlap causing friction, instead of a generic partner policy template.`,
    promptText: `Design channel conflict rules to stop direct sales and channel partners from fighting over the same deals — targeted at the specific overlap causing friction in our business, not a generic partner policy template copied from somewhere else.

WHERE THE CONFLICT IS ACTUALLY HAPPENING
{{conflict_pattern}}

CURRENT DEAL REGISTRATION PROCESS, IF ANY
{{current_process}}

TERRITORY OR SEGMENT DEFINITIONS TODAY
{{territory_definitions}}

WHAT'S POLITICALLY HARD TO CHANGE
{{political_constraints}}

WHAT NOT TO DO
Do not propose a full territory re-carve if the political constraints say that's off the table — work within the stated constraints rather than recommending the ideal-world answer and ignoring what you were told isn't feasible right now. Do not propose deal registration rules so loose that both sides can plausibly claim the same deal was registered first — a rule that doesn't actually resolve the ambiguity it's meant to resolve isn't a real rule, just a paperwork step. Do not recommend a margin-sharing formula without stating the specific scenario it's meant to handle — a formula floating with no worked example is unverifiable and partners will each interpret it differently.

BUILD THE RULES
For the specific conflict pattern described, propose a deal registration rule with a clear, checkable tiebreaker for the exact ambiguity that's currently causing disputes — not a generic 'first to register wins' rule if that's not actually what's causing the friction. Propose territory or segment boundary clarifications only where the current definition is genuinely ambiguous, not a full redesign. Provide one worked numerical example of how the margin-sharing or credit-splitting rule would apply to a real deal size, so it's testable rather than abstract.

OUTPUT FORMAT
1. The specific rule addressing the described conflict pattern, stated as a checkable procedure.
2. Any territory/segment clarification, scoped only to the actual ambiguity.
3. One worked numerical example of the credit or margin-sharing outcome.
4. One likely edge case this rule set still won't cleanly resolve, named honestly rather than glossed over.`,
    variables: [
      {
        name: 'conflict_pattern',
        description: `The specific, recurring way direct and partner sales are colliding.`,
        example: `Direct reps are cold-calling into accounts a partner already has an active relationship with, and neither side finds out until late in the deal.`,
        required: true,
      },
      {
        name: 'current_process',
        description: `What deal registration or conflict process, if any, exists today.`,
        example: `Partners can register a deal in the portal, but direct reps don't check it before prospecting, so overlaps aren't caught until a partner complains.`,
        required: true,
      },
      {
        name: 'territory_definitions',
        description: `How territories or segments are currently divided, if at all.`,
        example: `Direct sales owns accounts over 500 employees; partners own everything else, but the threshold isn't enforced anywhere systematically.`,
        required: true,
      },
      {
        name: 'political_constraints',
        description: `What's realistically off the table for organizational or relationship reasons.`,
        example: `Direct sales leadership won't accept losing any named enterprise accounts to partners, full stop.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `channel-conflict`,
      `deal-registration`,
      `partner-strategy`,
      `territory-management`,
      `sales-operations`,
    ],
    whyItWorks: `Constraining the model to work within stated political limits rather than proposing an ideal-world redesign addresses a common gap between what a model generates and what an organization can actually implement: asked open-endedly to 'fix channel conflict,' a model will often produce the theoretically cleanest answer (a full territory re-carve), but that answer is worthless if leadership has already ruled it out, and presenting it anyway wastes the reader's evaluation time on something dead on arrival — explicitly anchoring to the stated constraint forces a genuinely usable answer instead of a textbook one. The instruction against a registration rule loose enough for both sides to plausibly claim priority targets a specific, real weakness in how these rules get drafted: a rule like 'first to register wins' sounds decisive but is only as good as the tiebreaker for what counts as 'first' and what happens when both sides say they were first — a model asked to write a rule will often produce the surface-level version without the tiebreaker mechanics that make it actually enforceable, so the prompt forces the harder, more specific version. Requiring a worked numerical example for any margin-sharing formula matters because an abstract formula ('partners receive X% based on deal influence') is exactly the kind of language that different parties will each interpret in their own favor during an actual dispute — a concrete example applied to a real deal size exposes ambiguity in the formula before it becomes a live conflict, which is the whole point of designing the rule in the first place. Requiring one honestly-named edge case the rules still won't resolve prevents the output from reading as a complete solution when channel conflict is rarely fully solvable with policy alone — overstating completeness here just relocates the next dispute to a place nobody prepared for it.`,
    exampleOutput: `Rule: a partner-registered deal is protected only if registered before any direct rep has logged a first outbound touch to that account in the CRM, verified by timestamp, not by either side's recollection. Worked example: on a $120K deal where the partner sourced and ran the full sales cycle, the partner retains 100% margin credit; if direct sales assisted post-registration (e.g., an executive intro), a 15% credit split applies, worked out to $18K attributed to direct on that deal size. Edge case not cleanly resolved: a prospect who independently contacts direct sales after already being in a partner's registered pipeline, with no timestamp trail proving prior partner contact — this will still require manual adjudication.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-kpi-dashboard-narrative',
    category: 'sales',
    title: `Turn a sales KPI dashboard into a narrative leadership can act on in one read`,
    description: `Converts a raw set of sales KPI numbers into a short, prioritized narrative highlighting the one metric that most needs attention and why, instead of a flat recap of every number on the dashboard.`,
    promptText: `Turn these sales KPI numbers into a short narrative for leadership — the point is to prioritize what needs attention, not recap every metric on the dashboard in sentence form.

THIS PERIOD'S KPI NUMBERS
{{kpi_numbers}}

TARGETS OR PRIOR-PERIOD COMPARISON
{{targets_or_comparison}}

WHO THIS IS FOR AND WHAT THEY CARE ABOUT MOST
{{audience_focus}}

ANYTHING ALREADY BEING DONE ABOUT A KNOWN ISSUE
{{in_flight_actions}}

RULES
Identify the single metric most off target or most changed from the prior period, and lead with that — not the metric that happens to look best, and not an even-handed tour through all of them. For every other metric, mention it only briefly, and only if it's meaningfully off track; a metric hitting target doesn't need narrative attention beyond a one-line confirmation it's fine. State the likely driver behind the flagged metric's movement, tied to something concrete in the data or context given, not a vague 'market conditions' explanation that could apply to any number in any period. If something is already being done about the flagged issue, say so and state what change to expect and by when — don't let the narrative imply a problem is unaddressed if it's actually already being worked.

OUTPUT FORMAT
1. One-sentence headline: the metric most needing attention and the direction it's moving.
2. Two to three sentences on the likely driver, tied to something concrete.
3. What's already in motion to address it, if applicable, and the expected timeline.
4. A one-line status confirmation for every other metric that's on track, grouped together rather than narrated individually.`,
    variables: [
      {
        name: 'kpi_numbers',
        description: `The raw KPI figures for the period.`,
        example: `Win rate: 24% (target 30%). Avg deal size: $42K (target $40K). Sales cycle length: 68 days (target 55 days). Quota attainment: 88%.`,
        required: true,
      },
      {
        name: 'targets_or_comparison',
        description: `The targets or the prior period's numbers for comparison.`,
        example: `Targets as listed above; sales cycle length was 52 days last quarter.`,
        required: true,
      },
      {
        name: 'audience_focus',
        description: `Who's reading this and what they're most focused on right now.`,
        example: `VP of Sales presenting to the board, who is specifically concerned about elongating sales cycles.`,
        required: true,
      },
      {
        name: 'in_flight_actions',
        description: `Anything already being done to address a known issue.`,
        example: `Sales ops rolled out a new proposal template two weeks ago aimed at speeding up the negotiation stage.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `sales-kpi`,
      `revenue-reporting`,
      `sales-leadership`,
      `board-reporting`,
      `performance-metrics`,
    ],
    whyItWorks: `Forcing a single lead metric rather than an even-handed tour through the dashboard corrects the default behavior of a model asked to 'summarize these KPIs': without a prioritization instruction, it will typically address each number roughly in the order given, giving the impression that everything matters equally, when the actual value of a KPI narrative is telling a busy reader what to focus on first — a report that treats a 6% win-rate miss with the same weight as an on-target deal size fails at its one real job. Requiring the driver explanation to be tied to something concrete, and explicitly banning vague catch-all explanations like 'market conditions,' targets a specific weak habit in AI-generated business writing: those phrases are grammatically safe and universally applicable, which is exactly why models default to them when asked to explain a number's movement without being given (or without being pushed to use) a specific causal hook — forcing a concrete tie prevents the narrative from sounding analytical while actually saying nothing. Checking whether an issue is already being addressed before writing about it as unaddressed matters because a KPI narrative that implies a known problem has no response in motion reads as either an oversight or a criticism of leadership's inaction, when the truth might be that a fix already shipped two weeks ago and just hasn't shown up in the lagging metric yet — getting this wrong changes how the whole report is received by the audience it's written for. Grouping on-target metrics into a single confirmation line, rather than narrating each individually, mirrors how the target audience actually wants to consume this: confirmation that nothing else needs their attention right now, stated once, not repeated per metric.`,
    exampleOutput: `Win rate is the metric most needing attention this period, at 24% against a 30% target, alongside sales cycle length stretching to 68 days from 52 last quarter. The likely driver is the extended negotiation stage specifically, where deals are stalling on proposal turnaround. Sales ops rolled out a new proposal template two weeks ago targeting exactly this stage; expect early impact visible in next month's cycle-length numbers. All other metrics — average deal size and quota attainment — are on or near target this period.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-crm-summary-account-handoff',
    category: 'sales',
    title: `Summarize a messy CRM record into a clean handoff brief for a new account owner`,
    description: `Condenses a cluttered, multi-year CRM history into a handoff brief a new account owner can actually use on day one, separating durable relationship facts from stale one-off notes.`,
    promptText: `Summarize this account's CRM history into a clean handoff brief for a new account owner taking over — someone who needs to be useful on their first call, not read the full multi-year history to piece it together themselves.

RAW CRM NOTES AND ACTIVITY LOG
{{crm_notes}}

ACCOUNT VALUE AND CONTRACT STATUS
{{account_value_status}}

WHY THE HANDOFF IS HAPPENING
{{handoff_reason}}

Separate durable relationship facts — who the actual decision-makers and champions are, what they care about, any standing sensitivities or past friction — from stale one-off notes that were relevant to a single moment and don't matter anymore, like a scheduling note from eight months ago about a call that already happened. If the CRM notes contain contradictions (one note says the champion is happy, a later note says they raised a complaint), resolve it by trusting the more recent note and flag the contradiction explicitly rather than silently picking one and ignoring the other. If the reason for the handoff itself is relevant context the new owner should know (the previous rep left the company, was reassigned after a complaint, and so on) and it would materially change how the new owner should approach the account, say so plainly rather than omitting it out of excessive discretion. Do not include contact information (emails, phone numbers) since that lives in the CRM record itself and doesn't need restating here — this brief is for context, not as a contact card.

OUTPUT FORMAT
1. Who's who: key contacts, their role in the decision, and one line on what each cares about.
2. Account status: value, contract terms, and where things currently stand.
3. Relationship context: what's gone well, any friction points, and the handoff reason if it's relevant.
4. Any contradiction found in the notes, stated explicitly with which version you trusted and why.
5. The single most important thing for the new owner to know before their first call.`,
    variables: [
      {
        name: 'crm_notes',
        description: `The raw, messy CRM activity log and notes for the account.`,
        example: `18 months of call notes, including an early note calling the champion 'very enthusiastic' and a note from last month noting they filed a complaint about a support delay.`,
        required: true,
      },
      {
        name: 'account_value_status',
        description: `Current contract value and status.`,
        example: `$65K ACV, contract renews in 4 months, no upsell activity in the last year.`,
        required: true,
      },
      {
        name: 'handoff_reason',
        description: `Why this handoff is happening.`,
        example: `Previous account owner left the company; account was unassigned for three weeks before this reassignment.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `crm-hygiene`,
      `account-handoff`,
      `sales-operations`,
      `account-management`,
      `customer-context`,
    ],
    whyItWorks: `The explicit separation of durable relationship facts from stale one-off notes targets the core reason CRM handoffs fail: a multi-year activity log mixes permanently useful context (who the real decision-maker is) with time-bound noise (a scheduling note about a call that already happened), and a model asked to just 'summarize this CRM record' without that distinction will compress everything with roughly equal weight, producing a brief that's shorter than the original log but no more useful, because the new owner still can't tell what's still true from what expired months ago. The instruction to resolve contradictions by trusting the more recent note, while flagging the contradiction rather than silently picking a side, matters because CRM histories genuinely do contain outdated information alongside current information with no built-in way to tell which is which — a model that silently picks whichever note it processes as more prominent (often earlier, more detailed notes) risks handing the new owner a stale, contradicted fact stated with full confidence, which is worse than an acknowledged gap because it produces false confidence going into a first call. Requiring the handoff reason to be surfaced when materially relevant, rather than omitted for discretion, corrects a tendency for models to default toward blandly professional omissions when a topic seems sensitive (a rep leaving under complaint) — but a new account owner walking into a first call with an angry customer without knowing the previous rep departure was related to a complaint is set up to be blindsided, which is a real cost that outweighs the mild awkwardness of stating the context plainly. Excluding raw contact information keeps the brief focused on judgment and context, which is the part that actually requires synthesis, rather than padding it with data that's one click away in the CRM record itself.`,
    exampleOutput: `Who's who: Priya Shah, VP Operations, primary decision-maker, cares most about response time on support tickets. Account status: $65K ACV, renews in 4 months, no upsell motion in the past year. Relationship context: early relationship was strong, but a complaint was filed last month about a support delay — this is the more recent and more reliable signal, contradicting an earlier note calling the relationship 'very enthusiastic.' Handoff reason: relevant — the account sat unassigned for three weeks after the previous owner left, which likely contributed to the support complaint going unaddressed. Most important thing before the first call: acknowledge the recent support delay directly rather than opening with a generic introduction, since it's the freshest and most negative thing in their recent experience.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'sales-proposal-follow-up-sequence-after-silence',
    category: 'sales',
    title: `Turn a proposal that's gone quiet into a follow-up sequence the buyer actually answers`,
    description: `Builds a short, escalating follow-up sequence for a proposal stuck in silence — each message tied to a specific signal from the deal instead of a generic "just checking in" nudge, so it reads as informed rather than needy.`,
    promptText: `You are writing a follow-up message sequence for a sales proposal that has gone quiet — the prospect has not responded since it was sent, and a generic "just following up" email would read as either desperate or as filler the buyer has seen a hundred times before. Use the details below to write messages that only make sense for this specific deal.

PROPOSAL SUMMARY
{{proposal_summary}}

DAYS SINCE SENT AND PRIOR CONTACT
{{silence_context}}

STAKEHOLDER SITUATION
{{stakeholder_situation}}

LAST SIGNAL FROM THE BUYER
{{last_signal}}

DESIRED NEXT STEP
{{desired_next_step}}

RULES FOR THE SEQUENCE
Write exactly three messages, spaced for escalating urgency but never impatience: a light check-in, a value-add nudge, and a final "close the loop" message. Every message must reference something specific and real about this deal — a detail from the proposal, a date, a stakeholder's stated concern, or the last thing the buyer actually said — never a placeholder like "I wanted to touch base" that could be sent to any prospect. Do not open any message with "just checking in," "following up," "circling back," or "wanted to see if you had a chance" — these signal a message with no new information and buyers skim past them. Each message must give the recipient a reason to respond that isn't just guilt or politeness: new information, a genuine question tied to their stated concern, or a low-effort binary choice (a yes/no, a pick-one-of-two). If the stakeholder situation suggests the proposal may be stuck with a different person than the one who received it (a champion who's gone quiet, a committee decision, budget approval pending), address that possibility directly in at least one message rather than assuming the original recipient is the blocker. The final message in the sequence must include a graceful, low-pressure way for the buyer to signal "not now" or "not interested" without it feeling like a breakup email — closing a dead deal cleanly is more useful than one more unanswered message sitting in a pipeline.

WHAT NOT TO DO
Do not manufacture false urgency (fake limited-time pricing, invented deadlines) if none was actually given in the proposal. Do not repeat the entire proposal pitch again — assume the reader already read it once and needs a reason to re-engage, not a recap.

OUTPUT FORMAT
1. Message 1 (light check-in) — subject line and body, 3-5 sentences.
2. Message 2 (value-add nudge, sent if no reply to Message 1) — subject line and body.
3. Message 3 (close the loop) — subject line and body, including the low-pressure opt-out.
4. A one-line note on the recommended spacing between each message given the deal size and stakeholder situation described above.`,
    variables: [
      {
        name: 'proposal_summary',
        description: `What was actually proposed — the offer, price range, and scope, in enough detail to reference specific parts of it.`,
        example: `A 12-month contract for our mid-tier analytics plan at $850/month, including onboarding and a dedicated Slack channel, sent with a comparison against their current spreadsheet-based process.`,
        required: true,
      },
      {
        name: 'silence_context',
        description: `How long it's been since the proposal was sent and what contact, if any, has happened since.`,
        example: `Sent 9 days ago. One reply the day after ("looks good, reviewing internally") and nothing since.`,
        required: true,
      },
      {
        name: 'stakeholder_situation',
        description: `Who received the proposal and what you know or suspect about who else is involved in the decision.`,
        example: `Sent to the Head of Ops, who mentioned needing sign-off from the CFO before committing to anything over $500/month.`,
        required: true,
      },
      {
        name: 'last_signal',
        description: `The most recent specific thing the buyer said or did, even a small one.`,
        example: `Asked in the intro call whether the plan supports exporting data to their existing BI tool.`,
        required: true,
      },
      {
        name: 'desired_next_step',
        description: `The concrete action you want the buyer to take.`,
        example: `A 15-minute call with the CFO to walk through the ROI comparison, or a straight yes/no on moving to a contract.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT`],
    tags: [
      `proposal-follow-up`,
      `sales-outreach`,
      `email-sequence`,
      `deal-stalled`,
      `b2b-sales`,
      `closing`,
    ],
    whyItWorks: `Most proposal follow-ups fail for a structural reason that has nothing to do with wording: they carry zero new information, so a busy buyer correctly infers that ignoring it costs nothing. Forcing every message to reference a specific proposal detail, stakeholder concern, or prior answer removes the option to write a content-free nudge, which is the actual mechanism that gets a message read instead of archived — a model asked to be "polite but persistent" without that constraint will default to exactly the templated opener the rules explicitly ban, because that phrasing is statistically the most common pattern in its training data for this exact scenario. Naming the possibility that the real blocker is a second stakeholder (a CFO sign-off, a committee) rather than the original recipient matters because a follow-up sequence that only ever escalates pressure on the same person silently assumes single-threaded buying, and in the B2B context this template targets, deals stall at exactly this multi-stakeholder friction point far more often than at simple disinterest — addressing it directly gives the seller a second lever the sequence would otherwise miss entirely. The requirement to end with a genuine low-pressure exit is a deliberate counterweight to a model's tendency to keep escalating urgency across a sequence when asked for one; a dead deal that gets a clean "no" in message three is more valuable to a real pipeline than a fourth unanswered message, and stating this explicitly stops the AI from writing a slightly-more-desperate version of message two by default. Finally, banning invented urgency (fake deadlines, fabricated scarcity) keeps the output usable as-is rather than something the seller has to first strip of claims that aren't true, which is the difference between a draft and a liability.`,
    exampleOutput: `Message 1 — Subject: "Quick one on the BI export question" — Hi [Name], you'd asked whether the analytics plan exports cleanly to your BI tool during our call — wanted to confirm it does, via a direct connector, no manual CSV step. Figured that might be sitting as an open question while you're reviewing internally. Happy to send a two-line technical confirmation if that's useful for whoever needs to sign off. — Message 2 references the CFO approval threshold directly and offers a 15-minute call. — Message 3 closes with: "If now isn't the right time, no worries at all — just let me know and I'll close this out on my end so I'm not cluttering your inbox."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
