import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'x-twitter-thread-hook-to-payoff-structure',
    category: 'x-twitter',
    title: `Turn one real insight into an X thread that doesn't lose readers after tweet two`,
    description: `Builds a numbered X thread from a single specific insight you already have, structured so each tweet earns the next tap instead of front-loading everything into the hook and coasting on filler after it.`,
    promptText: `You are structuring an X (Twitter) thread from one specific insight or result I already have — not inventing a topic, just turning something true and specific into a thread that keeps people reading past the first two tweets, which is where most threads lose their audience.

THE INSIGHT OR RESULT
{{core_insight}}

WHO ALREADY BELIEVES THE OPPOSITE
{{common_belief_this_contradicts}}

PROOF I ACTUALLY HAVE
{{supporting_evidence}}

THREAD LENGTH TARGET
{{thread_length}}

CLOSING ASK
{{closing_ask}}

STRUCTURE RULES
Write the first tweet as a claim that is specific enough to be wrong — a vague hook like "here's what nobody tells you about X" gets scrolled past because it promises nothing checkable, while a hook that states the actual contradicted belief and the surprising result creates an open loop a reader wants closed. Every tweet from 2 onward must do exactly one job: advance the argument, add a specific piece of evidence, or address the most obvious objection a skeptical reader would have at that exact point — never restate the hook in different words to pad the count toward a round number. If I don't have enough real evidence to support a claim in the thread, say so explicitly and either cut that beat or mark it as something I need to verify before posting, rather than inventing a statistic or a specific number to make a tweet sound more authoritative than what I actually gave you. Place the strongest piece of proof by tweet 3 or 4, not saved for the end — threads lose the bulk of their remaining readers in the first few taps, so the payoff has to arrive before that drop-off, with the ending reserved for the takeaway and the ask rather than the best evidence. Write the closing tweet as a specific ask tied to the argument just made, not a generic "thoughts?" or "follow for more."

WHAT NOT TO DO
Do not use thread-starter clichés ("A thread 🧵", "Let that sink in", "Save this for later"). Do not write filler tweets whose only content is a transition phrase. Do not exceed the requested tweet count by padding — if the argument is genuinely finished in fewer tweets than the target, say so and give me the shorter version instead.

OUTPUT FORMAT
Numbered tweets (1/, 2/, 3/...), each under 280 characters, with a one-line note after the draft flagging any claim you couldn't verify from what I gave you and where you'd want a real number or link before I post it.`,
    variables: [
      {
        name: 'core_insight',
        description: `The one specific, true thing this thread is actually about.`,
        example: `We cut our onboarding email sequence from 9 emails to 3 and activation rate went up, not down.`,
        required: true,
      },
      {
        name: 'common_belief_this_contradicts',
        description: `What most people in this space currently assume, that your insight pushes against.`,
        example: `Most growth advice says more touchpoints in onboarding always improves activation.`,
        required: true,
      },
      {
        name: 'supporting_evidence',
        description: `The actual proof you have — numbers, screenshots, a before/after, a specific mechanism.`,
        example: `Activation went from 34% to 41% over 6 weeks after the cut, same cohort size, no other changes shipped that period.`,
        required: true,
      },
      {
        name: 'thread_length',
        description: `Roughly how many tweets you want, as a target not a hard requirement.`,
        example: `6-8 tweets`,
        required: true,
      },
      {
        name: 'closing_ask',
        description: `What you actually want the reader to do after finishing the thread.`,
        example: `Ask people to reply with their current onboarding email count so I can compare.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `x-threads`,
      `twitter-growth`,
      `content-writing`,
      `hook-writing`,
      `social-media`,
    ],
    whyItWorks: `X's own engagement curve for threads drops off sharply after the first couple of tweets — most of the audience that will ever see tweet 4 already decided whether to keep reading by tweet 2, which is why the prompt forces the strongest proof point into tweets 3-4 instead of holding it for a big finish nobody reaches. Requiring the hook to state the specific contradicted belief rather than a vague teaser matters mechanically because GPT-5.1, left unconstrained, defaults to curiosity-gap openers ("here's what nobody tells you") that read as generic pattern-matches on viral-thread structure rather than a claim with actual content — a reader can't evaluate whether to care about an empty tease, but a specific contradicted-belief-plus-result hook gives them something to agree or disagree with immediately, which is what drives the tap to expand. The explicit instruction to flag unverifiable claims rather than invent supporting numbers exists because the model's fluent default is to generate a plausible-sounding statistic to make a weak beat feel stronger, and a fabricated number in a thread that gets any traction is the single fastest way to get quote-tweeted with a correction. Capping each tweet to one job (advance, evidence, or objection-handling) prevents the common failure mode of a thread that restates its own hook three different ways to hit a target length — which reads as padding to anyone scrolling and kills the reshare rate long before it kills the read-through rate.`,
    exampleOutput: `1/ We cut our onboarding sequence from 9 emails to 3. Activation went UP, not down.

2/ The assumption we'd never questioned: more touchpoints = more activated users. Turns out past a point, they just teach people to skim.

3/ Same cohort size, 6 weeks, no other changes shipped: 34% -> 41% activation after the cut.

[Note: verified against the 6-week cohort numbers given; no claim beyond that was invented.]`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'x-twitter-reply-cta-without-link-penalty',
    category: 'x-twitter',
    title: `Write the follow-up reply that carries your link so the main post doesn't get throttled`,
    description: `Splits a post's call-to-action into a link-free main tweet and a first-reply that carries the actual link, tuned to the platform's known reach penalty on outbound links in the primary post.`,
    promptText: `Write two things: an X post with no outbound link, and the first reply to that same post that carries the actual call-to-action link — the standard workaround for the reach penalty X applies to posts with an external link in the body.

WHAT I'M PROMOTING
{{offer_or_content}}

WHERE THE LINK GOES
{{destination_link_context}}

WHY SOMEONE SHOULD CARE (NOT WHAT IT IS)
{{reader_benefit}}

TONE ON THIS ACCOUNT
{{account_voice}}

Steps:
1. Write the main post so it stands completely on its own as a piece of content — someone who never sees the reply should still get something worth their read (an opinion, a result, a specific claim), not a stub that only makes sense as a lead-in to a link. Never write a main post that is just a teaser sentence ending in "more below" or "link in reply" as its entire content — that's asking for the click without earning it.
2. Write the reply as a natural continuation of the exact claim made in the main post, not a repeat of the same sentence with a URL tacked on. The reply should read like the obvious next thing to say, given what the main post just argued.
3. State explicitly, in the reply, what the reader gets by clicking — not "check it out here" but the actual concrete thing (what's in it, how long it takes, what changes for them).
4. If the offer or content genuinely can't be summarized honestly in one post without the link, say so and tell me to reconsider whether this is a thread instead of a single post plus reply — don't force a bad fit.

WHAT NOT TO DO
Do not put the link, or any phrase implying a hidden link ("link below", "more info in thread"), anywhere in the main post text. Do not write generic CTA language ("don't miss out", "check the link") in the reply — name the specific benefit instead.

OUTPUT FORMAT
Main post (no link), then the reply (with a placeholder [LINK] where the URL goes), each under 280 characters, followed by one line confirming the main post would read as complete content on its own.`,
    variables: [
      {
        name: 'offer_or_content',
        description: `The specific thing you're promoting through the link.`,
        example: `A free calculator that estimates SaaS churn cost based on plan tier and cancellation reason.`,
        required: true,
      },
      {
        name: 'destination_link_context',
        description: `What's actually on the other side of the link, concretely.`,
        example: `A one-page tool, no signup wall, gives a dollar estimate in under 10 seconds.`,
        required: true,
      },
      {
        name: 'reader_benefit',
        description: `Why someone should care, framed as their outcome, not a feature description.`,
        example: `Lets a founder walk into a board meeting with a real number instead of a guess.`,
        required: true,
      },
      {
        name: 'account_voice',
        description: `The tone this specific account uses, so the CTA doesn't clash with it.`,
        example: `Blunt, a little dry, no exclamation points, speaks like a practitioner not a marketer.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `twitter-cta`,
      `link-strategy`,
      `x-algorithm`,
      `social-copywriting`,
      `engagement`,
    ],
    whyItWorks: `X's ranking system has consistently deprioritized posts carrying an external link in the body relative to link-free posts, because the platform is optimized to keep attention inside the app rather than route it out — putting the link in the first reply instead sidesteps that penalty while keeping the URL one tap away for anyone who reads the thread. The instruction to make the main post stand alone as complete content matters because GPT-5.1's default instinct for a "post plus reply" CTA structure is to write the main post as a bare teaser ("here's something you need to see"), which technically follows the link-placement rule but produces a post with nothing for the algorithm or a human reader to engage with on its own merits — a post that only works as bait for its reply gets neither the standalone engagement nor, often, the click, since readers who don't expand replies see nothing of value. Forcing the reply to state the concrete benefit rather than generic CTA phrasing addresses the specific pattern where "check it out here" reads as low-effort promotional copy that gets scrolled past even when the link cost nothing to click — a reader deciding whether to tap a link in a reply is making a much colder decision than one already reading an expanded thread, so the benefit has to be legible in that one line without any of the main post's context carrying over.`,
    exampleOutput: `Main: "Every founder I talk to guesses their churn cost instead of calculating it. The guess is almost always wrong, and usually wrong in the expensive direction."
Reply: "Built a one-page calculator for this — plan tier + cancellation reason in, real dollar number out, no signup. [LINK]"`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'x-twitter-viral-hook-first-line-rewrite',
    category: 'x-twitter',
    title: `Rewrite a flat opening line into ten hooks that survive the timeline's first half-second`,
    description: `Takes a post you've already drafted and generates ten alternative first lines built around distinct hook mechanisms, each tagged with why it earns attention, instead of ten variations of the same curiosity-gap phrasing.`,
    promptText: `You are a specialist in X/Twitter hook-writing. I already have a post drafted — the argument and content are done. Your only job is the first line: generate ten alternative opening lines, each using a genuinely different hook mechanism, not ten reshuffles of the same one.

DRAFTED POST (content is final, only the opener is up for revision)
{{drafted_post}}

WHO THIS NEEDS TO STOP-SCROLL
{{target_reader}}

HOOK MECHANISMS TO DRAW FROM (use at least 6 of these across your 10, don't default to one):
- A specific, surprising number pulled from the post's own content
- A contradicted assumption stated as fact, then immediately undercut
- A direct address to a specific identity in the target reader
- A confession of a mistake or wrong belief you used to hold
- A blunt claim that sounds like an overstatement until the reader checks the content
- A question that only the target reader would stop to answer honestly

RULES
Every hook must be traceable to something actually in the drafted post — do not invent a number, result, or claim that isn't already there just to make an opener punchier; if the post doesn't contain a strong enough number or result to hook on, say so and tell me which hook mechanisms are viable given what's actually in the draft. After each hook, add a one-line tag naming which mechanism it uses and, in a few words, why it would stop that specific target reader rather than a general audience. Do not produce two hooks that are the same mechanism with different word choice — if you can't genuinely fill six distinct mechanisms from the list given the content, produce fewer, correctly labeled, rather than padding to ten with near-duplicates.

WHAT NOT TO DO
Do not write hooks that promise something the rest of the post doesn't deliver — a hook is only as good as whether the payoff actually lands, and an opener that oversells the content gets read as clickbait and hurts the account's credibility on the next post. Avoid "Twitter voice" clichés ("unpopular opinion:", "nobody talks about this but", "hot take") unless the post's content genuinely is a contrarian take that earns that framing.

OUTPUT FORMAT
A numbered list of up to 10 hooks, each followed by its mechanism tag and one-line reasoning. End with your top 2 picks and a one-sentence reason each is the strongest match for the target reader specifically.`,
    variables: [
      {
        name: 'drafted_post',
        description: `The full post content, minus the opening line, that you want a hook for.`,
        example: `...we tested 4 pricing pages against the same traffic. The one with the fewest features listed converted 22% higher than the one with the most.`,
        required: true,
      },
      {
        name: 'target_reader',
        description: `The specific person you need this to stop for, not a broad demographic.`,
        example: `SaaS founders currently deciding between a feature-heavy or minimal pricing page redesign.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `viral-hooks`,
      `twitter-copywriting`,
      `x-growth`,
      `hook-writing`,
      `attention-design`,
    ],
    whyItWorks: `Requiring at least six distinct hook mechanisms rather than letting the model free-associate ten openers matters because GPT-5.1's unconstrained default, when asked for hook variations, tends to converge on one or two high-frequency patterns from its training distribution (contrarian-claim framing and curiosity-gap framing especially) and produce nine reshuffles of those rather than genuinely different attention mechanisms — naming the mechanisms explicitly and requiring a minimum spread forces actual variety instead of superficial wording changes around the same idea. Tying every hook back to content that's actually in the drafted post closes the most damaging failure mode in hook-writing: a hook so much stronger than the payoff that the reader feels baited, which on X specifically tends to produce a reply calling out the mismatch rather than silent scrolling past, since the platform's reply-first culture actively rewards catching an overpromise. The mechanism tag with reasoning is not decoration — it forces the model to justify why a given hook fits the stated target reader rather than a generic audience, which surfaces the difference between a hook that's clever in the abstract and one that would actually make the specific person named in target_reader stop on their specific timeline, where a founder deciding on pricing page design reacts to a different signal than a general marketing audience would.`,
    exampleOutput: `1. "We removed 60% of our pricing page's feature list. Conversion went up 22%." — Mechanism: surprising number from the post's own content. Stops founders currently weighing feature-density decisions because the number contradicts the default instinct to list more, not less.
2. "I used to think a pricing page's job was to prove we had every feature. It isn't." — Mechanism: confession of a former wrong belief. Lands with founders who currently hold that same belief right now.
Top picks: #1 for its directness with a founder audience that responds to numbers over narrative; #2 for founders earlier in their own pricing-page debate who haven't seen a result yet.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'x-twitter-build-in-public-progress-update',
    category: 'x-twitter',
    title: `Draft a build-in-public update that shares the actual number instead of vague momentum language`,
    description: `Converts a raw progress note (a metric, a setback, a shipped feature) into a build-in-public post that names the real number and the real context behind it, avoiding the vague-positivity tone that makes most build-in-public posts blur together.`,
    promptText: `Draft a build-in-public update post for X based on what actually happened this week. I'll give you the real situation — including anything that didn't go well — and you turn it into a post that reads as an honest specific update, not generic startup-momentum language.

WHAT ACTUALLY HAPPENED THIS WEEK
{{weekly_update}}

THE NUMBER OR METRIC BEHIND IT
{{specific_metric}}

WHAT DIDN'T GO AS PLANNED, IF ANYTHING
{{setback_or_honesty_note}}

WHAT'S NEXT
{{next_step}}

HARD RULES
Lead with the specific number or concrete fact, not a mood statement — "shipped the export feature, 12 people used it in the first 48 hours" beats "excited to share some progress this week" because the second sentence could describe literally any startup on any week and gives a reader nothing to react to. If there's a setback in what I gave you, include it plainly, in the same tone as the win — do not spin it into a disguised positive ("failing forward", "great learning experience") unless I've actually framed it that way myself; state what happened and, if I've given you one, what you're doing differently because of it. Do not manufacture optimism the update doesn't actually support — if the week was genuinely rough, the post can be honest about that without being self-pitying; match the actual weight of what happened rather than defaulting to upbeat framing regardless of the input. Keep the post to one clear beat: what happened, the number behind it, and what's next — do not pad it with a mission-statement reminder about the broader vision unless that context is genuinely necessary to make the number make sense.

WHAT NOT TO DO
Do not use build-in-public boilerplate ("grateful for this journey", "the grind continues", "day X of building") unless I've explicitly told you this account uses that framing. Do not add a call-to-action asking people to follow or share unless I ask for one separately — an honest update earns its own engagement without an appended ask.

OUTPUT FORMAT
One draft post under 280 characters. If the honest version doesn't fit in one post, offer a two-tweet version instead of cutting the honesty to make it fit, and say which parts you kept versus cut and why.`,
    variables: [
      {
        name: 'weekly_update',
        description: `What actually happened this week, in plain terms.`,
        example: `Shipped CSV export after it sat in the backlog for two months; also lost our biggest customer to a competitor.`,
        required: true,
      },
      {
        name: 'specific_metric',
        description: `The real number tied to the update.`,
        example: `12 of our 40 active users used the export feature within 48 hours of launch.`,
        required: true,
      },
      {
        name: 'setback_or_honesty_note',
        description: `Anything that didn't go well this week, stated plainly.`,
        example: `The customer we lost was 18% of MRR; they left because we didn't have export until now.`,
        required: false,
      },
      {
        name: 'next_step',
        description: `What you're doing next as a direct result of this week.`,
        example: `Auditing every other feature request tied to churned customers from the last quarter.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `build-in-public`,
      `startup-updates`,
      `twitter-copywriting`,
      `founder-content`,
      `transparency`,
    ],
    whyItWorks: `The build-in-public genre on X has become saturated with interchangeable momentum language precisely because most founders write the update from the vague feeling of the week rather than the specific fact of it, and GPT-5.1 asked for a generic "progress update" will default to that same register ("excited to share", "the journey continues") since it's the highest-frequency pattern for the genre in its training data — anchoring the prompt on a real number and requiring it to lead the post is what actually differentiates the output, because a concrete fact can't be interchanged with any other startup's update the way a mood statement can. The instruction to include a genuine setback in the same tone as the win, without spinning it into disguised positivity, targets a specific credibility problem: readers on X have seen enough "failing forward" framing to recognize it as a dodge, and a post that names a real loss (a churned customer, a missed number) plainly reads as more trustworthy than one that reflexively reframes every setback as growth, which paradoxically makes the wins in the same account's other posts more believable too. Capping the post to one beat (what happened, the number, what's next) rather than looping back to the broader mission statement matters because that reflexive vision-reminder is exactly the kind of padding that makes build-in-public updates blur together — a reader following an account across many weeks already knows the mission; what they're evaluating week to week is whether this specific update contains anything real, which is the one thing generic momentum language can never supply.`,
    exampleOutput: `"Shipped CSV export this week after it sat in the backlog two months. 12 of our 40 active users used it within 48 hours. Also lost our biggest customer — 18% of MRR — because we didn't have this sooner. Auditing every other churn-linked feature request now."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
