import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'instagram-caption-hook-first-line-before-more',
    category: 'instagram',
    title: `Write a caption whose first line survives the 'more' cutoff instead of getting swallowed by it`,
    description: `Builds an Instagram caption around the exact character budget the feed truncates at, so the hook does its job before a single tap on 'more', with the rest of the caption structured to reward the people who do tap through.`,
    promptText: `You are writing an Instagram caption for a single post, and the first constraint is mechanical, not creative: the feed cuts a caption off at roughly the first 125 characters (fewer on some devices) before showing '... more', so the opening line has to work as a complete, self-contained hook that earns the tap, not a sentence fragment that trails off mid-thought.

POST SUBJECT
{{post_subject}}

WHAT THE IMAGE OR VIDEO ALREADY SHOWS
{{visual_context}}

VOICE
{{brand_voice}}

DESIRED READER ACTION
{{desired_action}}

WORDS OR PHRASES TO AVOID
{{avoid_list}}

HOOK RULES
Write the opening line to be a complete thought on its own, readable and satisfying even if nobody ever taps 'more' — never a setup that only pays off in the truncated part, since a large share of impressions never get past the fold. Do not describe what is already visible in the image or video; the caption's job is to add something the visual can't say on its own (context, a stake, a tension, a specific number, an opinion), not to caption the obvious. Do not open with the post subject restated as a label ('New product drop!') — open with the one sentence a scrolling stranger would stop for.

BODY RULES
After the hook, structure the rest of the caption to reward someone who tapped 'more' with something the hook didn't already give away — a second beat, not a repeat of the first one in different words. End with exactly one call to action that matches the desired reader action, stated as a specific, low-friction ask (a question to answer in comments, a save prompt, a tag-a-friend prompt) rather than a generic 'let us know what you think!'. Keep total length appropriate to the platform's actual reading pattern — long enough to deliver the second beat, short enough that it doesn't feel like a blog post pasted under a photo.

OUTPUT FORMAT
1. The full caption, with a marked line showing exactly where the ~125-character 'more' cutoff falls.
2. Two alternate hook lines (different angle each), keeping the same body.
3. A one-line note on which of the three hooks is strongest for the stated desired action, and why.`,
    variables: [
      {
        name: 'post_subject',
        description: `What the post is actually about.`,
        example: `Launching a limited run of a hand-thrown ceramic mug in a new glaze color.`,
        required: true,
      },
      {
        name: 'visual_context',
        description: `What the accompanying photo or video already communicates, so the caption doesn't repeat it.`,
        example: `A close-up video of the glaze catching light as it's turned in hand, no text overlay, no product name visible.`,
        required: true,
      },
      {
        name: 'brand_voice',
        description: `The tone this account actually writes in.`,
        example: `Warm and a little wry, first person, never uses exclamation points more than once per caption.`,
        required: true,
      },
      {
        name: 'desired_action',
        description: `The one thing you want a reader to do after reading.`,
        example: `Comment which glaze color they'd want next, since we're deciding the next run from replies.`,
        required: true,
      },
      {
        name: 'avoid_list',
        description: `Words, phrases, or claims this caption should not use.`,
        example: `'Obsessed', 'game-changer', and any specific claim about how long the glaze took to develop — we haven't finalized that story yet.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `instagram-captions`,
      `social-copywriting`,
      `hook-writing`,
      `engagement`,
      `content-creation`,
    ],
    whyItWorks: `The instruction to write the opening line as a complete, self-contained thought rather than a cliffhanger fragment directly counters GPT-5.1's default caption-writing habit of front-loading a scene-setting clause ('When you finally get the glaze just right...') that only resolves after the cutoff — a structure that reads as unfinished to the large share of viewers who never tap 'more', which the model has no visibility into unless told explicitly that the feed truncates at a fixed character count. Naming the exact ~125-character mechanic gives the model a concrete target to write against instead of a vague 'make it punchy' instruction, which tends to produce generically short openers rather than openers engineered to survive a specific cutoff point. The rule against describing what the visual already shows addresses a separate, very common failure mode: without it, GPT-5.1 defaults to captioning the image literally ('a mug being turned in the light'), which is redundant information a viewer already has and wastes the one line most likely to be read. Requiring exactly one call to action, stated as a specific low-friction ask rather than an open-ended 'thoughts?', works because a single unambiguous action is what actually gets a measurable response — stacking multiple asks (comment AND share AND save) is a pattern the model reaches for when trying to maximize engagement surface area, but it splits attention and typically depresses response to all three rather than lifting any of them.`,
    exampleOutput: `Hook: "This glaze took four ruined batches before it did this." [~125-char cutoff falls here] Body: the fifth batch is the one you're looking at — a warm oatmeal base with a break of blue wherever the light hits thick. Fifteen mugs, no two identical. Reply with which color you want to see in the next run; we're picking from the comments. Alt hooks: "We almost didn't ship this color." / "Four batches said no. This one said yes."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'instagram-carousel-slide-by-slide-story-arc-script',
    category: 'instagram',
    title: `Script a carousel slide-by-slide so swipe two through the end earns its place, not just slide one`,
    description: `Turns a single idea into a full slide-by-slide carousel script — hook slide, escalating middle, closer — built around the specific point where most carousels lose their swipe-through and stall.`,
    promptText: `You are scripting an Instagram carousel, slide by slide, for the idea below. A carousel lives or dies on swipe-through: slide one only has to earn the swipe to slide two, but the real drop-off in most carousels happens around slide three or four, once the initial curiosity from the hook has been spent and nothing new has replaced it.

CORE IDEA
{{core_idea}}

TARGET SLIDE COUNT
{{slide_count}}

AUDIENCE'S STARTING KNOWLEDGE
{{audience_starting_point}}

ONE THING THEY SHOULD DO AFTER
{{post_action}}

BRAND VOICE
{{brand_voice}}

PHASE 1 — HOOK SLIDE (slide 1)
Write slide 1 as a single claim, question, or tension statement large enough to read in under two seconds, that makes the specific promise of what this carousel delivers — not a vague teaser ('swipe for tips') but a concrete stake ('the three things about {{core_idea}} that get people fired from doing this correctly'). State explicitly what slide 1 promises so later slides can be checked against it.

PHASE 2 — MIDDLE SLIDES (build up to slide {{slide_count}} minus 1)
Write each middle slide as one idea only — never combine two points on one slide, since a slide with two ideas competing for attention reads as neither. Order the middle slides so the information density or stakes increase toward the back half rather than front-loading the best point on slide 2; if the best point is used first, name that explicitly as a risk of what slide would need reordering. Slide 3 or 4 specifically must contain something the audience did not already expect from the hook — a specific number, a named mistake, or a concrete example — since this is the exact point where swipe-through typically drops, and generic restatement of the hook's premise loses people here.

PHASE 3 — CLOSER SLIDE (slide {{slide_count}})
Write the final slide to explicitly deliver on the promise stated in slide 1 and end with the one post action stated above, worded as a specific, immediate ask rather than a generic 'follow for more'.

WHAT NOT TO DO
Do not write a caption for the post in this pass — carousel slide text only. Do not repeat the hook's exact wording on the closer slide as if restating it were the payoff; the closer should reference the hook's promise while adding the resolution, not echo it.

OUTPUT FORMAT
A numbered list, one entry per slide, each with: the on-slide text (short enough to read at a glance) and a one-line design note (what visual element or emphasis that slide needs). After the slide list, one paragraph flagging where the highest swipe-away risk is in this specific script and what would fix it if testing shows a drop there.`,
    variables: [
      {
        name: 'core_idea',
        description: `The single idea this carousel exists to teach or argue.`,
        example: `Why batching a week of Instagram content in one sitting produces worse posts than spacing the same work across three shorter sessions.`,
        required: true,
      },
      {
        name: 'slide_count',
        description: `How many slides the carousel should be.`,
        example: `7`,
        required: true,
      },
      {
        name: 'audience_starting_point',
        description: `What the audience already believes or knows before seeing this.`,
        example: `They've heard 'batch your content' as generic productivity advice and assume more batching is always better.`,
        required: true,
      },
      {
        name: 'post_action',
        description: `What you want someone to do right after finishing the carousel.`,
        example: `Save the post and try splitting their next batch session into two shorter ones.`,
        required: true,
      },
      {
        name: 'brand_voice',
        description: `The tone this account writes carousels in.`,
        example: `Direct and slightly contrarian, short sentences, no motivational-poster language.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `instagram-carousel`,
      `content-scripting`,
      `swipe-through`,
      `social-copywriting`,
      `engagement`,
    ],
    whyItWorks: `Requiring slide 1 to state an explicit, checkable promise gives every later phase of the prompt a concrete target to be graded against, which is what turns 'write a carousel' from an open-ended creative request GPT-5.1 will pad with generic advice into a structure it can actually verify slide-by-slide before returning an answer. Naming slide three or four specifically as the highest-risk drop-off point matters because, left unprompted, the model tends to spread its best material evenly or front-load it on slide two out of a generic instinct to 'hook early and often' — but real swipe-through data on carousels consistently shows the mid-carousel slides as where attention actually collapses once initial curiosity is spent, so telling the model where the real risk sits produces a script that spends its strongest concrete detail exactly where it's needed rather than where a generic best-practices template would put it. The one-idea-per-slide rule closes a specific failure mode where GPT-5.1, asked for a fixed slide count on a meaty topic, will compress two points onto one slide to hit the target number rather than cutting content — forcing the count explicit and pairing it with 'never combine two points' makes the model resolve that tension by cutting scope, which is the correct trade-off, instead of silently doubling up a slide. Asking for an explicit swipe-away risk flag at the end forces a self-check pass rather than treating the first draft as final, which is where most of the actual quality gap between a templated carousel and a considered one shows up.`,
    exampleOutput: `Slide 1: "Batching more content in one sitting isn't more efficient — it's slower work in disguise." (Design: bold text, no image yet) ... Slide 4: "By hour three of a batch session, caption quality measurably drops — not because you're tired, but because you've stopped reacting to each post individually." (Design: before/after caption example) ... Slide 7: "Split your next batch into two 90-minute sessions, a day apart. Save this and try it before your next content day."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'instagram-creator-calendar-batch-shoot-day-content-map',
    category: 'instagram',
    title: `Map a month of Instagram content to the batch-shoot days you actually have, not an idealized daily grid`,
    description: `Builds a content calendar backwards from the real number of shoot days and available hours a creator has this month, instead of a generic 'post daily' grid that assumes unlimited production time.`,
    promptText: `You are building a one-month Instagram content calendar for a creator, and the starting constraint is production capacity, not posting frequency — the calendar has to be built backwards from the actual shoot days available this month, not forward from an ideal posting cadence that assumes unlimited time to produce content.

SHOOT DAYS AVAILABLE THIS MONTH
{{shoot_days_available}}

CONTENT PILLARS
{{content_pillars}}

FORMATS IN ROTATION
{{format_mix}}

RECURRING DATES OR LAUNCHES TO HIT
{{fixed_dates}}

HOURS AVAILABLE PER SHOOT DAY
{{hours_per_shoot_day}}

CALCULATE CAPACITY FIRST
Before assigning any post, calculate roughly how many pieces of finished content the stated shoot days and hours per day can realistically produce, given that a single shoot day typically yields multiple pieces (a carousel, a reel, and several photo posts) but not an unlimited number — state this capacity number explicitly and build the calendar to that number, not to a round posting target like 'one per day' that ignores it. If the fixed dates and content pillars together would require more output than the stated capacity supports, say so explicitly and propose what to cut or combine rather than quietly overcommitting the calendar to more posts than the shoot days can produce.

BUILD THE CALENDAR
Assign each planned post to the specific shoot day its raw material would come from, not just to a calendar date — a post scheduled for the 14th but shot on the 3rd should show both dates, so the creator knows when to actually capture it. Rotate through the stated content pillars and format mix so no single pillar or format repeats more than twice in a row. Place fixed dates and launches on their exact required day, then build the rest of the calendar around them, not the other way around.

OUTPUT FORMAT
A table with columns: Post Date | Shoot Day | Content Pillar | Format | Working Title/Hook | Notes. Precede the table with the calculated realistic capacity number and one sentence stating whether the requested output fits inside it. Follow the table with a short list of anything cut or combined to make the plan fit actual capacity.`,
    variables: [
      {
        name: 'shoot_days_available',
        description: `How many actual dedicated production days exist this month.`,
        example: `4 shoot days this month, each roughly a Saturday.`,
        required: true,
      },
      {
        name: 'content_pillars',
        description: `The recurring themes this account posts around.`,
        example: `Studio process, finished-product reveals, behind-the-scenes mistakes, customer features.`,
        required: true,
      },
      {
        name: 'format_mix',
        description: `The post formats actually in rotation.`,
        example: `Reels, carousels, and single-image posts — no Stories-only content counted here.`,
        required: true,
      },
      {
        name: 'fixed_dates',
        description: `Any launches, sales, or dates that must be hit regardless of shoot-day math.`,
        example: `New glaze color drops on the 18th and must have a reel ready that morning.`,
        required: false,
      },
      {
        name: 'hours_per_shoot_day',
        description: `Roughly how many hours are actually spent shooting on each shoot day.`,
        example: `About 3 hours per shoot day, including setup and teardown.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `content-calendar`,
      `instagram-planning`,
      `creator-workflow`,
      `batching`,
      `production-planning`,
    ],
    whyItWorks: `Forcing an explicit capacity calculation before any post gets assigned addresses the most common failure mode in AI-generated content calendars: asked to 'build a month of content,' GPT-5.1 defaults to a clean, evenly-spaced grid (a post every day, or every other day) because that's the statistically dominant pattern in the content-calendar templates it has seen, regardless of whether the stated production constraints could actually support that cadence — the calendar comes out looking complete and professional while being quietly unbuildable. Requiring the model to state the capacity number out loud and check the requested output against it converts an invisible assumption into a checkable claim, which is what makes the difference between a calendar that looks right and one that a single creator with four Saturdays a month can actually execute. Tying each post to the specific shoot day its raw footage comes from, rather than only to a publish date, closes a second gap: a generic calendar treats 'when to post' and 'when to shoot' as the same question, but for a solo creator they're not, and conflating them produces a plan where the creator discovers on the 13th that the footage for the 14th's post was never captured. The instruction to flag overcommitment and propose cuts, rather than silently fitting everything in by assuming more output per shoot day than was stated, matters because a model asked to satisfy multiple constraints at once (pillars, formats, fixed dates, capacity) will tend to resolve the tension by quietly relaxing whichever constraint was stated least precisely, and capacity is usually the one given as a rough number rather than a hard rule — naming it as the binding constraint stops that silent drift.`,
    exampleOutput: `Realistic capacity: 4 shoot days x ~3 hours ≈ enough raw footage for roughly 10-12 finished posts this month, not the 20 a strict alternate-day cadence would need — this plan fits 11. Post Date: Aug 18 | Shoot Day: Aug 16 | Pillar: Finished-product reveal | Format: Reel | Hook: "The glaze we almost didn't ship" | Notes: must be edited and scheduled by morning of the 18th for the launch.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'instagram-community-post-broadcast-channel-update',
    category: 'instagram',
    title: `Write a Broadcast Channel update that reads like an insider note, not a repost of the feed caption`,
    description: `Drafts an Instagram Broadcast Channel message for a creator's closest subscribers, written to feel like a direct, informal update rather than a copy-pasted version of whatever already went out on the main feed.`,
    promptText: `You are writing a message for an Instagram Broadcast Channel — the one-to-many channel a creator sends directly to subscribers who opted in specifically to hear from them, separate from the main feed. The people reading this chose to be here for something more direct than a public caption, so the message has to earn that trust rather than reuse feed copy.

UPDATE TO SHARE
{{update_content}}

HOW THIS RELATES TO SOMETHING ALREADY POSTED PUBLICLY
{{relation_to_public_post}}

WHY THIS SPECIFIC GROUP GETS IT FIRST OR DIFFERENTLY
{{channel_exclusivity_reason}}

DESIRED SUBSCRIBER RESPONSE
{{desired_response}}

CREATOR'S VOICE IN DMS
{{dm_voice}}

RULES
Write this in the voice the creator actually uses in a direct message to someone they know, not the more polished, third-person-adjacent voice of a public caption — Broadcast Channel messages that read like a repurposed feed caption are the single fastest way to make subscribers mute the channel, since the entire value proposition of subscribing was hearing something different. State plainly, without over-explaining, why this group is getting this update first, earlier, or in more detail than the general audience — the exclusivity has to be named, not just implied, or it reads as an identical broadcast that happened to arrive in a different inbox. If the update relates to something already posted publicly, reference it briefly rather than re-explaining it in full; assume the reader may or may not have seen the public post, so give enough context to follow along either way without repeating it wholesale. Close with the desired subscriber response stated as something concrete and answerable in the channel's reaction or reply feature — a specific question, a poll-style either/or, or a direct ask — rather than a vague 'let me know what you think.'

WHAT NOT TO DO
Do not add a hashtag block, an emoji-heavy sign-off, or any element that reads like it was written for public discovery — this channel has no discovery mechanic, so anything written to be found by strangers is wasted here and signals the message wasn't actually written for this specific audience.

OUTPUT FORMAT
1. The Broadcast Channel message, ready to send.
2. One line stating what makes this message something a subscriber couldn't have gotten from the public feed alone.`,
    variables: [
      {
        name: 'update_content',
        description: `What you're actually telling this group.`,
        example: `The glaze color that sold out in nine minutes on the public drop is getting a second, smaller restock next Tuesday.`,
        required: true,
      },
      {
        name: 'relation_to_public_post',
        description: `How this connects to something already posted on the main feed, if anything.`,
        example: `The original drop was announced in yesterday's reel, which most of this list has probably already seen.`,
        required: false,
      },
      {
        name: 'channel_exclusivity_reason',
        description: `Why this specific group is hearing it first or differently.`,
        example: `Broadcast subscribers get first access 24 hours before the restock goes on the public grid.`,
        required: true,
      },
      {
        name: 'desired_response',
        description: `What you want a subscriber to do after reading.`,
        example: `React with which of two restock times works better for them, since we're picking the drop time based on replies.`,
        required: true,
      },
      {
        name: 'dm_voice',
        description: `How this creator actually talks in a direct message, as opposed to a public caption.`,
        example: `Short, a little breathless, uses 'ok so' as an opener, no corporate phrasing at all.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `broadcast-channel`,
      `community-management`,
      `instagram-dm`,
      `subscriber-retention`,
      `social-copywriting`,
    ],
    whyItWorks: `The explicit instruction to write in DM voice rather than caption voice targets a specific and predictable drift: without a strong steer, GPT-5.1 tends to default toward the more polished, slightly promotional register it associates with 'Instagram content' in general, because that's the dominant pattern in its training examples of Instagram copy — but a Broadcast Channel is structurally a direct message thread, and content written in feed register inside a DM thread reads as visibly mismatched to the format the reader is actually looking at, which is exactly the tell that makes a subscriber mute a channel. Requiring the exclusivity reason to be stated plainly rather than implied closes a second gap: an unprompted draft will often just repeat the update without ever explaining why the channel is the right place to hear it, leaving the reader to wonder whether this message is meaningfully different from the public post at all, which erodes the entire reason someone subscribed. The explicit 'what not to do' section banning hashtags and discovery-oriented elements matters because those are reflexive additions the model reaches for on any Instagram-labeled task by default pattern-matching to public-post conventions, and they are actively counterproductive here since a Broadcast Channel has no algorithmic discovery surface for a hashtag to serve — including one signals the message was written generically rather than for this specific, closed audience, which is the opposite of what a channel update is supposed to communicate.`,
    exampleOutput: `Ok so — remember the glaze that sold out in nine minutes yesterday? We're doing a second, smaller restock next Tuesday, and you're hearing it 24 hours before it goes on the grid because you're here. React with 1 if morning works better, 2 if evening does — picking the drop time off whichever wins.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'instagram-audience-poll-story-sticker-decision-input',
    category: 'instagram',
    title: `Design a Stories poll that actually decides something, instead of collecting opinions nobody acts on`,
    description: `Writes the question and two options for an Instagram Stories poll sticker built to produce a real, actionable answer to a decision you're actually making, rather than a generic engagement-bait either/or.`,
    promptText: `You are writing a Stories poll sticker — question plus two option labels — and it has to be built around a decision that will actually change based on the result, not a generic engagement prompt where the answer changes nothing regardless of which side wins.

THE ACTUAL DECISION THIS POLL RESOLVES
{{decision_to_resolve}}

WHAT HAPPENS DIFFERENTLY DEPENDING ON THE RESULT
{{outcome_by_result}}

AUDIENCE CONTEXT NEEDED TO ANSWER
{{context_needed}}

RULES
Write the question so that both options are genuinely plausible outcomes of the actual decision, not a lopsided pair where one option is obviously correct — a poll where 95% of people will pick the same option isn't collecting information, it's a vote of approval dressed as a choice, and it should be flagged as such rather than written as if it were a real toss-up. Keep the question itself short enough to read in the two seconds a Stories viewer typically spends per frame, front-loading the actual choice rather than a setup sentence before it. Write the two option labels (each capped at the sticker's short character limit) so that someone who has not read any caption or context, only the Story frame itself, could answer meaningfully — if answering correctly requires information from a post they haven't seen, include that context directly in the Story frame's other text, not assumed as background knowledge. State explicitly, in the output, what you will actually do with each of the two possible results — if the answer would be 'nothing changes either way,' say so plainly instead of shipping the poll anyway.

WHAT NOT TO DO
Do not default to a poll about opinions on something already decided ('team pizza or team tacos?' when the menu is already finalized) just because it's an easy engagement format — every poll produced here should trace back to the stated decision. Do not write a question with three or more effective options crammed into two labels ('cats, dogs, or both?' squeezed into a two-option sticker) — if the real decision has more than two live options, say so and recommend a different sticker or a follow-up poll instead of distorting the question to fit two boxes.

OUTPUT FORMAT
1. The poll question text.
2. The two option labels.
3. One line stating what you will actually do for each possible result.
4. If the decision genuinely doesn't fit a binary poll, a note saying so instead of forcing it.`,
    variables: [
      {
        name: 'decision_to_resolve',
        description: `The actual choice you're trying to make with audience input.`,
        example: `Whether the next glaze restock should happen weekday evening or weekend morning.`,
        required: true,
      },
      {
        name: 'outcome_by_result',
        description: `What concretely happens for each of the two possible poll outcomes.`,
        example: `If evening wins, restock goes live Thursday 7pm; if morning wins, it goes live Saturday 9am — no other option is on the table.`,
        required: true,
      },
      {
        name: 'context_needed',
        description: `Any background a Story viewer needs, stated in the frame itself, to answer meaningfully.`,
        example: `Viewer needs to know the restock is happening this week at all — mention that in the frame text above the poll.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `instagram-stories`,
      `audience-polls`,
      `community-engagement`,
      `decision-making`,
      `social-copywriting`,
    ],
    whyItWorks: `Requiring the model to check whether both options are genuinely plausible, rather than accepting any two-option framing as valid, targets a specific and very common failure mode: asked to 'write an engaging poll,' GPT-5.1 defaults to whatever pairing sounds catchiest as a question (this-or-that framing, playful opposites) without checking whether the underlying choice is actually live — producing a poll that looks like audience research but functions as a popularity contest with a foregone conclusion, since one option is obviously going to win regardless of framing. Forcing an explicit statement of what happens for each possible result is the mechanism that keeps the poll honest: a model that has to write down 'if X wins, we do Y' before finalizing the question can't quietly ship a poll where the honest answer is 'nothing changes either way,' because that gap becomes visible in the output rather than staying an unexamined assumption. The rule against cramming three-plus real options into a two-option sticker addresses a structural mismatch the model won't flag on its own: a Stories poll sticker only supports two labels, so a model asked to poll a genuinely three-way decision will usually just pick the two most common options and silently drop the third, producing a poll that resolves a different, narrower question than the one actually being decided — naming this explicitly as something to flag rather than paper over keeps the tool from being used for a decision shape it structurally can't represent.`,
    exampleOutput: `Poll question: "Restock drops Thursday evening or Saturday morning?" Options: "Thurs 7pm" / "Sat 9am". Result plan: Thursday-evening win schedules the drop for 7pm that day; Saturday-morning win schedules it for 9am — no third option exists, so this fits the two-label format cleanly.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'instagram-creator-pitch-brand-partnership-outreach-dm',
    category: 'instagram',
    title: `Pitch a brand partnership in a DM that a busy marketing inbox actually reads past the first line`,
    description: `Writes a creator's cold outreach DM or email pitching a brand partnership, structured to survive the ten-second scan a real inbox gives it instead of reading like a form letter with the brand name swapped in.`,
    promptText: `You are writing a creator's outreach message pitching a brand partnership — sent cold or from a light existing relationship, to a person who receives many pitches like this and decides in the first few seconds whether to keep reading.

CREATOR AND NICHE
{{creator_profile}}

BRAND BEING PITCHED
{{target_brand}}

WHY THIS BRAND SPECIFICALLY, NOT JUST 'A BRAND LIKE THIS'
{{specific_fit_reason}}

PAST RESULTS THAT ARE ACTUALLY VERIFIABLE
{{proof_points}}

WHAT YOU'RE ASKING FOR
{{partnership_ask}}

OPENING RULES
Open with the specific-fit reason, not with an introduction of who the creator is — a pitch that leads with 'Hi, I'm a lifestyle creator with an engaged audience' reads as a form letter within the first sentence, because every brand's inbox is full of that exact opener; leading instead with something that could only have been written about this brand specifically is what signals a real pitch was written, not a template with find-and-replace. Do not claim a specific fit that isn't actually true — if the stated reason is generic enough that it could apply to five other brands unchanged, say so and ask for a sharper one rather than writing a pitch on a weak premise.

PROOF RULES
Include only the proof points given, stated exactly as provided — do not invent a follower count, engagement rate, or past brand name that wasn't given, and do not round or embellish a real number upward. If no concrete proof points were given, write the pitch without fabricating any and note plainly, in the output, that the pitch is currently proof-light and would land stronger with at least one concrete number or example added before sending.

ASK RULES
State the partnership ask as one specific, answerable thing, not a vague 'would love to collaborate' — a recipient should be able to say yes, no, or 'let's talk' to the literal sentence as written, without needing to ask what's actually being proposed.

OUTPUT FORMAT
1. The pitch message, sized for a DM or short email (not a multi-paragraph media kit).
2. One line flagging whether the fit reason given is genuinely brand-specific or generic enough to weaken, with a suggestion if it's the latter.
3. One line flagging whether proof points are present, missing, or thin, and what to add before sending if they're thin.`,
    variables: [
      {
        name: 'creator_profile',
        description: `Who the creator is and what they actually post about.`,
        example: `A home cook posting weekly reels of 20-minute weeknight dinners, mostly for people who don't consider themselves cooks.`,
        required: true,
      },
      {
        name: 'target_brand',
        description: `The specific brand being pitched.`,
        example: `A mid-size cast-iron cookware brand that mostly works with professional chefs, not home-cooking creators.`,
        required: true,
      },
      {
        name: 'specific_fit_reason',
        description: `The actual, specific reason this brand and this creator make sense together, not a generic category match.`,
        example: `The brand's own content skews toward intimidating restaurant-grade technique, while this creator's whole audience is people who are afraid of cast iron — a genuinely underserved angle for the brand.`,
        required: true,
      },
      {
        name: 'proof_points',
        description: `Real, verifiable numbers or past results — leave blank rather than let the model invent any.`,
        example: `Average reel views around 40,000 over the last 3 months; one past sponsored post for a spice brand drove a code redemption rate the brand described as 'above their typical creator average' (exact number not shared with me).`,
        required: false,
      },
      {
        name: 'partnership_ask',
        description: `The specific thing being proposed.`,
        example: `One sponsored reel showing a cast-iron skillet used in a beginner-friendly weeknight recipe, in exchange for a flat fee plus the pan.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `brand-partnerships`,
      `creator-outreach`,
      `pitch-writing`,
      `influencer-marketing`,
      `cold-outreach`,
    ],
    whyItWorks: `The rule against fabricating or rounding up proof points is the load-bearing safeguard in this prompt: GPT-5.1, asked to write a persuasive pitch with a proof-points field left thin or blank, will reliably fill the gap with a plausible-sounding placeholder number ('consistently strong engagement of around 8-10%') because a pitch with no numbers at all reads as weaker to the model's own sense of what a good pitch looks like — but a fabricated number in a real outreach message is a credibility risk the moment the brand asks for a screenshot, so the instruction to flag the gap explicitly instead of inventing a fix keeps the model honest about what it doesn't actually know. Requiring the opener to lead with the brand-specific fit reason rather than a creator self-introduction targets the single most common tell of a mass-sent pitch: a generic opener is the fastest signal a busy marketing inbox uses to triage a message into the 'form letter' pile within the first line, before the actual proof points or ask are ever read, so fixing the opening structure has outsized effect relative to polishing anything later in the message. Asking the model to separately judge whether the given fit reason is genuinely specific or generic-enough-to-weaken adds a check GPT-5.1 won't perform unprompted — left to its own judgment, the model tends to accept whatever fit reason it's given at face value and write confidently around it, rather than pushing back on a weak premise, so making that evaluation an explicit required output forces the self-critique that actually improves the pitch instead of just dressing up a shaky one.`,
    exampleOutput: `Pitch: "Your cast-iron content is built for people who already know what they're doing with it — my audience is 100% the opposite, and that gap is exactly why a beginner-friendly weeknight video with your pan could reach people your current content doesn't. I'd love to do one sponsored reel: a 20-minute weeknight dinner using the skillet, in exchange for a flat fee plus the pan. Open to a quick call this week?" Fit check: genuinely specific, not generic. Proof check: thin — add the average view number before sending.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'instagram-ugc-brief-creator-content-brief-for-brand',
    category: 'instagram',
    title: `Write a UGC brief specific enough that three different creators come back with usably different results`,
    description: `Produces a UGC content brief for a brand to send to Instagram creators — specific on the non-negotiables and deliberately open on everything else, so creators don't return three near-identical videos shaped by the same over-scripted brief.`,
    promptText: `You are writing a UGC (user-generated content) brief that a brand will send to several Instagram creators for a paid content collaboration. The brief has exactly one job that's easy to get wrong in both directions: be specific enough that every creator hits the same non-negotiable requirements, while staying open enough that three different creators sending this brief come back with three usably different videos, not three versions of the same script read in different voices.

PRODUCT OR SERVICE
{{product_or_service}}

NON-NEGOTIABLE REQUIREMENTS
{{non_negotiables}}

WHAT MUST NOT BE CLAIMED OR IMPLIED
{{prohibited_claims}}

USAGE RIGHTS AND WHERE THIS CONTENT WILL RUN
{{usage_rights}}

DELIVERABLE SPECS
{{deliverable_specs}}

BRIEF STRUCTURE
Separate the brief cleanly into two kinds of instruction and label them differently in the output: non-negotiables (exact requirements every creator's video must meet, stated as specific checkable rules — show the product being opened, say the product name aloud once, keep it under the stated length) versus creative direction (the problem the video should solve, the feeling it should land, a rough moment-by-moment shape) that deliberately leaves the specific words, setting, and delivery to the creator. Never write a line-by-line script for the creator to read verbatim unless a script was explicitly requested — a UGC brief that hands over exact dialogue defeats the reason brands hire multiple creators in the first place, which is to get several authentically different takes, not one script performed by different faces. State prohibited claims as specific things not to say or imply, not as a vague 'be honest' — a creator can't check their own draft against 'be honest' but can check it against 'never say this product replaces a specific named treatment or professional service.' State usage rights plainly and specifically (which platforms, how long, whether it can run as a paid ad) since this is the term creators care most about getting clear and is the one most often left vague in real briefs, leading to disputes after delivery.

WHAT NOT TO DO
Do not add generic brand-voice adjectives ('authentic, relatable, fun') as if they were requirements — if a specific tone is genuinely required, state it as a checkable rule instead ('no scripted-sounding read; visible imperfection like a stumble or retake left in is preferred over a polished delivery').

OUTPUT FORMAT
1. Non-negotiables, as a checklist.
2. Creative direction, as open guidance, explicitly not a script.
3. Prohibited claims, as a checklist.
4. Usage rights, stated plainly.
5. Deliverable specs (length, format, aspect ratio, due date).`,
    variables: [
      {
        name: 'product_or_service',
        description: `What's actually being featured.`,
        example: `A magnesium supplement marketed for sleep support.`,
        required: true,
      },
      {
        name: 'non_negotiables',
        description: `Specific, checkable requirements every video must meet.`,
        example: `Show the actual product packaging on camera, say the brand name aloud once, video must be 15-30 seconds, must include the paid-partnership label.`,
        required: true,
      },
      {
        name: 'prohibited_claims',
        description: `Specific things the video must not say or imply.`,
        example: `Never say or imply this treats insomnia or any diagnosed sleep disorder, never say 'guaranteed' results, never compare directly to a named competitor product.`,
        required: true,
      },
      {
        name: 'usage_rights',
        description: `Exactly where and how long this content can be used.`,
        example: `Brand can repost on its own Instagram and use as a paid ad for 6 months; creator keeps rights to post it on their own account indefinitely.`,
        required: true,
      },
      {
        name: 'deliverable_specs',
        description: `The concrete technical specs for what's delivered.`,
        example: `One 9:16 vertical video, 15-30 seconds, raw unedited file plus one edited version, due within 10 days of receiving product.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `ugc-brief`,
      `creator-collaboration`,
      `content-brief`,
      `influencer-marketing`,
      `brand-guidelines`,
    ],
    whyItWorks: `The explicit split between non-negotiables and creative direction, with a hard rule against writing verbatim dialogue unless asked, targets a specific default GPT-5.1 falls into when asked for a 'content brief': the model tends to over-specify by writing a full example script complete with dialogue and shot-by-shot direction, because a fully worked example feels more helpful and complete than open guidance — but for UGC specifically, an over-scripted brief sent to five creators produces five near-identical videos performed by different faces, which defeats the entire commercial reason a brand runs a multi-creator UGC campaign instead of just making one polished ad. Requiring prohibited claims to be stated as specific checkable rules rather than a vague 'be honest' or 'don't overclaim' matters because a creator improvising dialogue on camera needs a concrete boundary to self-check against in the moment, not a mood; a specific named prohibition ('never say this replaces a diagnosed treatment') is something a creator can catch themselves saying and cut, while a vague honesty instruction gives them nothing to actually catch. Requiring usage rights to be stated plainly and specifically addresses a known real-world failure point in UGC deals that has nothing to do with creative quality — vague usage terms are the single most common source of after-the-fact disputes between brands and creators, so making this a required, specific field rather than an afterthought closes the gap where a model asked for a 'brief' focuses entirely on the creative and treats the commercial terms as boilerplate to gesture at rather than spell out.`,
    exampleOutput: `Non-negotiables: show product packaging on camera; say brand name aloud once; 15-30 seconds; include #ad or paid-partnership label. Creative direction: film it like you're telling a friend about your actual nighttime routine — a stumble or unpolished retake is welcome, a scripted-sounding read is not. Prohibited claims: never imply this treats insomnia or any diagnosed condition; never say 'guaranteed'; never name a competitor. Usage rights: brand may repost and run as a paid ad for 6 months; creator retains rights to post on their own account indefinitely.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
