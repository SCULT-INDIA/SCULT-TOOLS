import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'grok-x-realtime-brand-sentiment-scan',
    category: 'grok',
    title: 'Turn live X mentions into a brand sentiment scan Grok can actually see',
    description:
      'Pulls a real-time read on how a brand, product, or campaign is landing on X right now, weighting recency and separating organic reaction from bot and engagement-farming noise, instead of a static analytics-dashboard sentiment score.',
    promptText: `You are running a real-time sentiment scan using Grok's live access to the X post index — not a generic social-listening report written from memory or a stale training snapshot. Every claim about "what people are saying" must trace back to posts from the stated time window, not general impressions of how a brand like this is usually discussed.

SUBJECT
{{brand_or_topic}}

TIME WINDOW
{{time_window}}

WHY THIS SCAN MATTERS RIGHT NOW
{{trigger_context}}

KNOWN NOISE SOURCES
{{noise_sources}}

SEGMENTS TO BREAK OUT
{{segments_to_break_out}}

SCAN RULES
Search the live X post index for {{brand_or_topic}} across {{time_window}}, not your training data's general sense of the brand's reputation — if a claim can't be tied to an actual post from this window, it does not belong in this scan. Separate genuine organic reaction from engagement-farming and bot amplification: a cluster of near-identical phrasing posted within minutes of each other, accounts with no history beyond this topic, or reply-guy quote-tweets clearly written to ride a trending tag are noise, not sentiment, and inflating a sentiment score with them misrepresents what real users think. Weight recency deliberately — a post from ten minutes ago tells you something a post from three days ago inside the same window does not, especially if sentiment is visibly shifting within the window itself; call out a shift in direction if one is happening, not just a net average that hides it. Break sentiment out by the segments named above rather than a single blended number, since a single average can hide an angry vocal minority sitting inside an otherwise neutral majority. Quote actual posts, paraphrased or lightly redacted for anonymity if the account is not a public figure or verified brand account, as evidence for every claim — a sentiment finding with no quoted post backing it is an assertion, not a scan result. Distinguish a genuine complaint about the product or brand from a complaint about something adjacent it is getting blamed for unfairly — a shipping delay caused by a carrier, a feature request being read as a bug — and flag the distinction rather than folding both into one negative bucket. If the volume of relevant posts in this window is too thin to support a real read — a few dozen posts, mostly from accounts that also posted about ten other brands today — say so plainly instead of manufacturing a confident sentiment score from noise-level volume.

OUTPUT FORMAT
1. Headline read: one sentence, net direction and whether it's stable or shifting within the window.
2. A table: Segment | Sentiment (positive / mixed / negative) | Approximate volume | Representative quote | Noise filtered out.
3. Anything you excluded as bot or engagement-farming noise and why, specific enough that someone could spot-check your call.
4. A confidence note: how much real signal this window actually contained, not just the sentiment conclusion itself.`,
    variables: [
      {
        name: 'brand_or_topic',
        description: 'The specific brand, product, or campaign to scan.',
        example:
          'The DTC skincare brand Lumenne, specifically its new retinol serum launch',
        required: true,
      },
      {
        name: 'time_window',
        description: 'The exact window of live posts to search.',
        example: 'Past 6 hours, since the launch post went up at 9am ET',
        required: true,
      },
      {
        name: 'trigger_context',
        description: 'Why this scan is happening right now — the decision it feeds.',
        example:
          "Just launched a paid influencer push this morning; marketing wants to know if it's landing before doubling down on spend this afternoon.",
        required: true,
      },
      {
        name: 'noise_sources',
        description: 'Any known source of inflated or coordinated posting to watch for.',
        example:
          "The brand's own affiliate program pays a flat fee per post using the hashtag #LumenneGlow, so a wave of near-identical praise is expected and should not count as organic sentiment.",
        required: true,
      },
      {
        name: 'segments_to_break_out',
        description: 'The specific audience or account segments to report separately.',
        example:
          'Paid affiliate posts, unpaid customer reactions, and skincare-community accounts known for ingredient-level critique',
        required: true,
      },
    ],
    targetTools: ['Grok', 'Grok on X'],
    tags: [
      'social-listening',
      'sentiment-analysis',
      'real-time-monitoring',
      'brand-monitoring',
      'x-twitter',
    ],
    whyItWorks:
      "Grok's advantage here is native indexing of X's live firehose, so it can retrieve posts from minutes ago rather than being limited to a training-data cutoff or a periodic search-engine crawl; this is different from a generic LLM asked to guess sentiment from memory of how a brand is generally discussed, which produces a plausible-sounding but time-blind answer regardless of what's actually happening right now. The instruction to distinguish engagement-farming and bot clusters from organic reaction matters because live social platforms have real coordinated-posting patterns triggered by affiliate programs, brand-ambassador rewards, and clout-chasing quote-tweets, and a naive volume-based percent-positive score treats a paid coordinated wave identically to unprompted reaction, producing a number that's technically accurate about what got posted and completely wrong about what it means. Requiring quoted-post evidence for every claim converts sentiment analysis from an unfalsifiable vibe into something checkable — a stakeholder can pull the same window and verify the read, which is the only way a live-social sentiment claim earns any trust at all. Breaking sentiment out by segment rather than one blended number addresses a specific statistical trap: an angry, vocal minority of ingredient-critique accounts can sit inside an otherwise neutral-to-positive majority, and a single averaged score would either wash that minority out entirely or let it drag the whole number down in a way that misrepresents both groups. The explicit low-volume honesty rule matters because a six-hour window on a mid-size brand can easily produce sentiment-adjacent noise dressed up as signal, and a model under pressure to 'give a read' will smooth over thin data into false confidence unless directly told that naming the thinness is itself part of the job, not a failure to complete it. Weighting recency and explicitly calling out a shift in direction within the window closes a gap a single net score always creates: two scans that both land on 'mostly positive' can describe completely different situations if one is steady across six hours and the other flipped from strongly positive to increasingly negative in the last ninety minutes, and only the second version tells the marketing team the thing they actually need before deciding whether to keep spending into the same audience this afternoon.",
    exampleOutput: `Headline read: net positive but softening — the first two hours skewed strongly positive on unboxing photos, but the last ninety minutes show a rising thread of "why does this smell like the old formula" replies.

Segment | Sentiment | Volume | Quote | Noise filtered
Paid affiliate | positive | ~140 posts | "obsessed with the new serum, #LumenneGlow" | Excluded from organic read — flat-fee affiliate copy
Unpaid customers | mixed, trending negative | ~35 posts | "reformulated and nobody told us?" | none
Ingredient-critique accounts | negative | ~9 posts | breakdown thread flagging a changed preservative | none, small but credible sample

Filtered: 40+ near-identical "can't wait to try this" posts from accounts created this week, consistent with a giveaway-entry requirement, not genuine anticipation.

Confidence: moderate on the positive affiliate read, low-but-real on the reformulation complaint — only 9 accounts, but all from established skincare-critique voices, worth escalating before the afternoon spend decision.`,
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Grok 4.1 with live X index access.',
      },
    ],
  },
  {
    slug: 'grok-breaking-news-live-synthesis',
    category: 'grok',
    title:
      'Synthesize a breaking story from live X posts without laundering rumor into fact',
    description:
      'Tracks a fast-moving breaking-news event through live X posts and separates confirmed reporting from unverified eyewitness claims and outright speculation, with a credibility tier attached to every claim instead of one flattened narrative.',
    promptText: `You are synthesizing a breaking news event as it develops on X, using Grok's live post index. Your job is not to write the most complete-sounding story — it's to keep every claim honestly tagged by how solid its source actually is, because a fast-moving story flattened into one clean narrative is how confirmed facts and unverified rumor end up looking equally certain.

EVENT
{{event_description}}

TIME WINDOW
{{time_window}}

KNOWN CREDIBLE SOURCES
{{known_credible_sources}}

WHAT'S STILL UNCONFIRMED
{{open_questions}}

AUDIENCE AND STAKES
{{audience_and_stakes}}

SYNTHESIS RULES
Pull directly from the live X post index for {{event_description}} within {{time_window}} — do not fill gaps with what a similar past event usually looks like, since breaking stories routinely defy the pattern the last similar one followed. Tier every claim by source strength: Tier 1 is an official statement, a credentialed reporter with a named outlet, or an on-record account with institutional accountability; Tier 2 is an eyewitness post with corroborating detail — location, timestamp, a photo or video matching the claim — but no institutional backing; Tier 3 is a claim being repeated widely with no visible original source, or a screenshot of unknown provenance. Never merge tiers in the prose — a sentence that blends a Tier 1 fact with a Tier 3 rumor without a seam between them is exactly the failure mode this exists to prevent. When multiple accounts are reporting the same specific detail, check whether they're independent or whether they're all quote-tweeting or copying the same original post — five posts repeating one uncorroborated claim is not five confirmations, it's one claim with a wide retweet radius, and treating it as five independent sources is a specific and common way rumors get laundered into apparent fact. Explicitly track what has changed since {{time_window}} started — a detail that was reported and later walked back or corrected matters as much as what's currently believed true, and dropping the correction silently misleads anyone who saw the earlier, wrong version. If the named credible sources above have posted anything relevant, prioritize and clearly label their claims above general public posts. Flag anything where the story is moving fast enough that this synthesis itself will likely be stale within the hour, and say so rather than presenting it as a settled account.

OUTPUT FORMAT
1. Confirmed (Tier 1 only): short, plain statements, each with its source named.
2. Likely but not confirmed (Tier 2): each claim with its corroborating detail stated explicitly.
3. Circulating but unverified (Tier 3): named as rumor, explicitly not stated as fact, with a note on how widely it's spreading.
4. Corrections: anything reported earlier in the window that has since been walked back or contradicted.
5. A one-line staleness warning stating how fast this is likely to change.`,
    variables: [
      {
        name: 'event_description',
        description: 'The specific breaking event being tracked.',
        example:
          'Reports of a major outage affecting a regional transit system during evening rush hour',
        required: true,
      },
      {
        name: 'time_window',
        description: 'The window of live posts to synthesize.',
        example: 'Last 90 minutes',
        required: true,
      },
      {
        name: 'known_credible_sources',
        description:
          'Named accounts whose posts should be weighted above general public posts.',
        example:
          "The transit authority's official account, and two local beat reporters who cover this system regularly",
        required: true,
      },
      {
        name: 'open_questions',
        description: 'What is explicitly still unresolved about the event.',
        example:
          "Whether it's a signal failure or a power issue, and whether service will resume before the evening commute ends",
        required: true,
      },
      {
        name: 'audience_and_stakes',
        description: 'Who is reading this synthesis and what they need to decide.',
        example:
          "An internal comms team deciding what to tell employees about tonight's commute — wrong information here sends people to a station that isn't running",
        required: true,
      },
    ],
    targetTools: ['Grok', 'Grok on X'],
    tags: [
      'breaking-news',
      'fact-checking',
      'source-verification',
      'real-time-monitoring',
      'misinformation',
    ],
    whyItWorks:
      "Grok's live indexing of X posts as they're published, rather than a search snapshot refreshed on some crawl interval, is what makes tracking a story in its first ninety minutes possible at all; a model without that live access is reconstructing the story from whatever got indexed hours later, by which point the tiering exercise is moot because the story has already resolved. The tiering rule targets the actual mechanism by which misinformation spreads fastest on a platform built around retweets and quote-posts: a single uncorroborated claim can appear to have five independent sources within minutes purely through reposting, and a model asked to summarize what's being said without a tiering discipline will count repost volume as corroboration, manufacturing false confidence in a claim that traces back to exactly one unverified origin. Explicitly tracking corrections is what stops a synthesis from becoming actively misleading rather than just incomplete — a detail reported at minute ten and quietly wrong by minute forty is the exact pattern that makes early breaking-news threads dangerous to trust at face value, and a synthesis that only reflects the current state without flagging what changed hides that instability from a reader who might act on the version they saw first. The instruction not to fill gaps with pattern-matching from a similar past event addresses a specific and subtle failure: large language models are trained on enormous amounts of text about how past similar events typically unfolded, which makes them prone to unconsciously completing a partial breaking story with plausible-sounding detail drawn from precedent rather than from anything actually reported this time — a transit outage doesn't have to resemble the last transit outage, and treating it as though it must is how a synthesis quietly invents facts nobody actually posted. The staleness warning matters because the entire value of this exercise decays on a timescale of minutes to hours, and presenting any breaking-news synthesis with the same fixed authority as a settled report, with no signal about how fast the ground truth might move, sets up whoever reads it to act on a version of events that may already be stale by the time they finish reading.",
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-07-23' }],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Grok 4.1 with live X index access.',
      },
    ],
  },
  {
    slug: 'grok-deepsearch-structured-research-brief',
    category: 'grok',
    title: "Give Grok's DeepSearch a research brief it can't shortcut",
    description:
      "Structures a multi-step DeepSearch query with explicit sub-questions and a source-diversity requirement, so Grok's agentic search actually branches and cross-checks instead of answering the first plausible page it opens.",
    promptText: `You are running Grok's DeepSearch (or Deeper Search) mode on a research question that genuinely needs multiple search-and-read cycles, not a single query it can answer from the first page it opens. Treat this as an agentic research task with sub-questions you expect to see addressed individually, not one broad prompt hoping the agent figures out the right decomposition on its own.

RESEARCH QUESTION
{{research_question}}

SUB-QUESTIONS TO ANSWER SEPARATELY
{{sub_questions}}

SOURCE DIVERSITY REQUIREMENT
{{source_diversity_requirement}}

WHAT WOULD MAKE THIS ANSWER USELESS
{{failure_condition}}

DEPTH VS BREADTH PREFERENCE
{{depth_preference}}

RESEARCH RULES
Work through each sub-question above as its own search-and-read cycle, not as a single combined query — if the sub-questions are genuinely separable, searching them separately is what surfaces sources that answer one well and would be missed entirely by a blended query built to cover all of them at once. Meet the source-diversity requirement literally: if it specifies avoiding single-domain reliance, do not let three of your five citations come from the same publication even if that publication happens to have written the most convenient-to-cite piece. Prefer a primary source — the original filing, the paper itself, the transcript, the dataset — over a secondary summary of it whenever both are findable, and note explicitly when you had to settle for a secondary source because the primary one wasn't accessible or didn't exist. When two sources disagree on a factual point, do not silently pick the one that sounds more authoritative — state the disagreement, name both sources, and give your read on which is more likely correct and why, or say the disagreement is genuinely unresolved if it is. Watch for the specific failure condition named above throughout the research, not just at the end — if you notice partway through that you're heading toward exactly the kind of answer that was flagged as useless, change direction rather than finishing the shallow pass and noting the problem in a caveat at the bottom. Respect the stated depth-versus-breadth preference: if the ask is for depth on a narrower question, do not pad the answer with tangentially related points just to look thorough, and if the ask is for breadth, do not sink disproportionate effort into one sub-question at the expense of leaving others thin.

OUTPUT FORMAT
1. A direct answer to the core research question in two to three sentences.
2. Each sub-question, answered individually with its own citations — not folded into one paragraph.
3. Any disagreement found between sources, stated explicitly with both positions named.
4. A source list noting which sources are primary versus secondary, and confirming the diversity requirement was met or explaining why it couldn't be.
5. Anything you weren't able to verify to the standard this brief asked for, named specifically.`,
    variables: [
      {
        name: 'research_question',
        description: 'The core question DeepSearch needs to answer.',
        example:
          'Is on-device AI inference actually cheaper than cloud API calls at the volume a mid-size app would run, or is that mostly marketing framing?',
        required: true,
      },
      {
        name: 'sub_questions',
        description: 'The question broken into separable parts to search individually.',
        example:
          'One, what does on-device inference actually cost in hardware and battery terms per call at scale. Two, what do current cloud API providers charge per million tokens for a comparable model class. Three, where does the crossover point sit, and does it depend heavily on request volume.',
        required: true,
      },
      {
        name: 'source_diversity_requirement',
        description: 'The specific rule for how independent the citations must be.',
        example:
          "No more than one citation from any single AI lab's own blog or marketing page — every cost claim from a vendor needs an independent source checking it.",
        required: true,
      },
      {
        name: 'failure_condition',
        description: 'What a genuinely useless answer would look like for this question.',
        example:
          "An answer that just repeats one hardware vendor's press release framing without an independent cost comparison would be useless — we already have that press release.",
        required: true,
      },
      {
        name: 'depth_preference',
        description:
          'Whether the brief prioritizes depth on one part or even breadth across all.',
        example:
          'Depth over breadth — this feeds a real infrastructure decision, so the crossover-point sub-question deserves the most rigor even if the other two end up shorter.',
        required: true,
      },
    ],
    targetTools: ['Grok DeepSearch'],
    tags: [
      'deepsearch',
      'research',
      'agentic-search',
      'source-verification',
      'fact-checking',
    ],
    whyItWorks:
      "DeepSearch is an agentic mode that runs its own multi-step loop — issuing a search, reading results, deciding whether to search again — rather than answering from a single retrieval pass, which means the quality of its output depends heavily on how the initial query is decomposed; a single broad prompt gives the agent full discretion over that decomposition, and it will frequently take the shortest path that produces a plausible-sounding answer rather than the path that actually covers the question. Handing it pre-split sub-questions removes that discretion at the exact point where it matters most — each sub-question becomes its own forced search cycle, which is what surfaces a source that answers one narrow piece precisely but would never rank highly enough in a blended query to get pulled in at all. The literal source-diversity requirement exists because an agentic searcher optimizing for 'find something that answers this' has no built-in preference for independence between sources, and a lab's own blog post, a review site's paraphrase of that blog post, and a news article quoting the review site can all get cited as three separate sources while actually being one claim laundered through three domains — naming the requirement explicitly, and requiring a stated confirmation that it was met, is what stops that from happening invisibly. The explicit primary-over-secondary preference matters because DeepSearch's read step will happily settle for whichever page loads and parses cleanly, and a well-written summary article is often easier to extract a clean answer from than the primary filing or transcript it's summarizing, which means the path of least resistance for the agent systematically favors secondary sources unless told otherwise. Naming the specific failure condition up front, and asking the model to watch for it mid-research rather than confess it as a caveat afterward, matters because an agent that has already spent its search budget heading toward a shallow answer has much less incentive to admit the shortfall than to write a confident caveat and call the job done — catching the drift while there's still search budget left to correct course is the only point where the instruction can actually change the outcome.",
    verifiedAgainst: [
      { tool: 'Grok DeepSearch', version: 'Grok 4.1', date: '2026-07-24' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Grok 4.1 DeepSearch mode.',
      },
    ],
  },
  {
    slug: 'grok-viral-claim-fact-check',
    category: 'grok',
    title: "Fact-check a claim that's spreading on X before you repeat it",
    description:
      "Runs a viral claim through Grok's live X access, Grokipedia, and independent sources in a deliberate order, treating Grokipedia's own AI-generated entries as a lead to verify rather than a settled citation.",
    promptText: `You are fact-checking a specific claim that is currently spreading on X, using Grok's live post access alongside independent web sources. Grokipedia may be one input, but it is never the final word here — it is itself AI-generated rather than consensus-reviewed by independent human editors the way Wikipedia is, so treat anything it says as a lead to verify against a primary or independently reported source, not as a citation you can stop at.

THE CLAIM
{{the_claim}}

WHERE IT'S SPREADING
{{spread_context}}

COUNTER-CLAIMS OR DENIALS ALREADY CIRCULATING
{{counter_claims}}

WHY THIS ONE MATTERS
{{stakes}}

WHAT WOULD SETTLE IT
{{settling_evidence}}

VERIFICATION RULES
Start by finding the claim's origin — the earliest identifiable post or source making this specific claim, not the most-shared version of it — since a claim often mutates as it spreads, and the version with tens of thousands of reposts may already be a distorted retelling of a more modest original statement. Check whether the claim is checkable at all before spending effort verifying it: some viral claims are unfalsifiable as worded, built on phrases like "everyone knows" or "sources say," and the honest finding is that the claim can't be verified or debunked as stated, not a confident verdict either way. If you consult Grokipedia, treat its entry the same way you'd treat any single unsigned source — useful for a quick orientation, not sufficient on its own — and independently confirm anything load-bearing in your verdict against a source with clearer provenance: a primary document, a named reporter, an institution's own statement. If a counter-claim or denial named above is already circulating, weigh it with the same rigor as the original claim — a denial is not automatically true just because it is a denial. Distinguish false from missing context from true but misleadingly framed — a claim can be technically accurate and still functionally misinformation because of what it omits, and collapsing that distinction into a binary true or false loses the actual finding. Note the claim's current spread velocity and where it's concentrated — a claim confined to a handful of accounts you can name is a different situation than one that's crossed into mainstream reach, and the write-up should reflect the actual scale, not the scale it feels like from inside one search. If the settling evidence named above genuinely exists and you found it, cite it directly and state the verdict plainly. If it doesn't exist or you couldn't find it, say precisely what's missing rather than rendering a verdict anyway on softer grounds.

OUTPUT FORMAT
1. Verdict: true / false / missing context / true but misleadingly framed / unverifiable as worded — pick exactly one and defend it in two sentences.
2. The claim's likely origin, with the earliest source you could identify.
3. Evidence for and against, each item sourced, including anything from Grokipedia explicitly labeled as such and separately verified.
4. Spread assessment: roughly how far and how fast, and where it's concentrated.
5. What would change this verdict if new evidence surfaced — the specific thing that's still open.`,
    variables: [
      {
        name: 'the_claim',
        description: 'The specific claim to fact-check.',
        example:
          'A claim circulating that a well-known food brand quietly changed a core ingredient in its flagship product without updating the label',
        required: true,
      },
      {
        name: 'spread_context',
        description: 'Where and how the claim is currently spreading.',
        example:
          'Started in a niche health-focused X community three days ago, now being quote-tweeted by several accounts with six-figure followings',
        required: true,
      },
      {
        name: 'counter_claims',
        description: 'Any denial or counter-claim already circulating, if one exists.',
        example:
          "The brand's official account replied to one thread saying the label is current, but did not address the ingredient-change part of the claim directly",
        required: false,
      },
      {
        name: 'stakes',
        description: 'Why getting this verdict right matters.',
        example:
          'A journalist following up wants to know if this is worth a real story or a debunked rumor before pitching it to an editor',
        required: true,
      },
      {
        name: 'settling_evidence',
        description: 'The specific evidence that would actually resolve the claim.',
        example:
          'The actual current ingredient list filed with the relevant regulator, compared against an archived version of the label from before the alleged change',
        required: true,
      },
    ],
    targetTools: ['Grok', 'Grokipedia', 'Grok on X'],
    tags: [
      'fact-checking',
      'misinformation',
      'source-verification',
      'grokipedia',
      'x-twitter',
    ],
    whyItWorks:
      "The instruction to treat Grokipedia as a lead rather than a citation is the load-bearing mechanism here, and it's specific to this tool: Grokipedia is generated largely by Grok itself rather than built through the layered human editing, citation-requirement, and dispute-resolution process Wikipedia uses, which means an entry can read with the same confident, well-formatted authority as a heavily-vetted article while carrying the same blind spots or errors the underlying model has elsewhere — treating its fluency as evidence of its accuracy is exactly the trap this rule closes. Requiring the claim's origin to be found before its most-shared version is verified targets a real and common distortion pattern: claims compress and sharpen as they get reposted, so the version currently going viral is frequently a more extreme or more certain restatement of a hedged original, and fact-checking the loud version without finding the quiet original risks confirming or debunking a claim that was never actually made in those words. The three-way split beyond true and false, adding 'missing context' and 'true but misleadingly framed,' reflects how most consequential misinformation actually works: outright fabrication is comparatively rare and comparatively easy to debunk, while a real, verifiable fact presented with a misleading frame or a convenient omission is both more common and more resistant to a binary verdict, and forcing the check into only two buckets produces a false 'true' on claims that are technically accurate and still deceptive in effect. Requiring any circulating denial to be checked with the same rigor as the original claim closes a specific asymmetry: an official denial carries institutional weight that makes it tempting to accept at face value, but a denial addressing only part of a claim, or issued before all the evidence was in, is exactly as checkable as the claim it's denying. The spread-assessment requirement matters for calibrating response, not just truth: a claim confined to a handful of accounts warrants a different reaction than the same claim after it's been picked up by accounts with real reach, and treating every viral claim as equally viral regardless of actual velocity leads to over-reacting to fringe noise or under-reacting to something genuinely spreading.",
    exampleOutput: `Verdict: missing context. The ingredient itself was changed, per the regulator filing dated four months ago, but the label update the filing required was applied — the claim's own screenshot compares the new label against a photo of old packaging still sitting on store shelves, not against the current one.

Origin: traced to a single post from a niche account three days ago, framed as the brand quietly swapping the ingredient without telling anyone — the six-figure-follower accounts amplifying it are all quote-tweeting that same original post, not independently reporting it.

Grokipedia's entry on the product states the ingredient change occurred but doesn't mention the label update — independently confirmed against the regulator's public filing database, which does show the updated label on file.

Counter-claim: the brand's official account replied to one thread saying the label is current, but never addressed the ingredient-change part directly — a partial denial, not a full rebuttal.

Spread: concentrated in one health-focused community plus four large quote-tweets; hasn't reached mainstream outlets yet.

Would change verdict: if it turns out the regulator's filing predates actual retail rollout of the new label, the "missing context" read would shift closer to "true" for a real transitional window — worth checking shelf-date data before publishing.`,
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-07-25' }],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Grok 4.1 with Grokipedia cross-check.',
      },
    ],
  },
  {
    slug: 'grok-trending-topic-content-angle-brief',
    category: 'grok',
    title: "Turn a live X trend into a content angle before it's stale",
    description:
      "Uses Grok's real-time trend visibility to find a genuinely differentiated content angle inside a trending topic for a specific niche account, instead of a generic reaction post that arrives after the moment has already passed.",
    promptText: `You are finding a content angle inside a currently trending X topic for a specific niche account, using Grok's live visibility into what's actually trending right now rather than a lagging trending-this-week roundup. The bar is a genuinely differentiated angle this account can credibly claim, not a generic reaction post that a hundred other accounts are also about to publish.

NICHE / ACCOUNT VOICE
{{niche_and_voice}}

CURRENT TREND CONTEXT
{{trend_context}}

WHAT THIS ACCOUNT CAN CREDIBLY SAY
{{credible_angle_constraint}}

POSTING WINDOW
{{posting_window}}

WHAT TO AVOID
{{angles_to_avoid}}

ANGLE RULES
Check the trend's actual current stage before proposing anything — a topic still climbing has room for an early, substantive take; a topic that's already peaked and is being commented on by every account in the niche needs either a genuinely new angle nobody's taken yet or should be skipped entirely, since a late, generic reaction reads as behind rather than engaged. Ground the angle in what this specific account can credibly say that a generic commentary account cannot — a real experience, a specific piece of expertise, a stance the account has taken before and can extend — not a hot take manufactured purely because the topic is trending. Reject any angle that only works if the account has zero connection to the topic beyond the topic being trending — that produces exactly the disposable engagement-bait content that erodes an account's credibility over time even when an individual post performs well. Respect the posting window: a trend has a real half-life on X, and an angle that requires research or production time exceeding the window is the wrong angle regardless of how good it is, not a reason to extend the deadline. Explicitly avoid every item in the avoid-list, and if the strongest angle you can find is actually a variant of something on that list, say so and offer the next-best genuinely different option rather than lightly disguising the avoided angle and presenting it anyway. Flag if the trend has a real risk of reversing — a story that's still developing and could look very different in an hour — since posting a confident take on an unstable story is a specific way to end up publicly wrong within the same posting window this angle was meant for.

OUTPUT FORMAT
1. Trend stage assessment: climbing, peaked, or declining, with your read on how much runway is left.
2. Two to three distinct angle options, each with the specific credible connection to this account named explicitly.
3. For each, a one-line draft hook — not a full post, just the opening line that would need to earn the rest of the read.
4. Which angle you'd actually post and why, including the reversal risk if there is one.`,
    variables: [
      {
        name: 'niche_and_voice',
        description: "The account's niche and established tone.",
        example:
          'A B2B SaaS founder account, direct and lightly self-deprecating tone, mostly posts about pricing strategy and early hiring mistakes',
        required: true,
      },
      {
        name: 'trend_context',
        description: 'What is currently trending and roughly how it started.',
        example:
          'A widely-discussed thread arguing that most startups are pricing their product wrong at launch, currently getting heavy engagement from other founder accounts',
        required: true,
      },
      {
        name: 'credible_angle_constraint',
        description:
          'What this account has actually done or said before that it can extend.',
        example:
          'This account has publicly posted twice before about a specific pricing mistake made in year one, so a take building on that track record is credible; a generic pricing-matters take is not',
        required: true,
      },
      {
        name: 'posting_window',
        description:
          'How long the trend realistically has left to be worth posting into.',
        example:
          'Next 45 minutes — the thread is about two hours old and founder-account engagement on this kind of topic typically fades within three to four hours',
        required: true,
      },
      {
        name: 'angles_to_avoid',
        description: 'Specific angle types that must not be used.',
        example:
          "Restating the original thread's point in different words, and anything that reads as disagreeing with the original poster just to be contrarian",
        required: true,
      },
    ],
    targetTools: ['Grok', 'Grok on X'],
    tags: [
      'content-strategy',
      'trend-analysis',
      'x-twitter',
      'real-time-monitoring',
      'social-media',
    ],
    whyItWorks:
      "Grok's advantage here is seeing the trend's live trajectory — how fast a topic is climbing, whether reply volume is accelerating or already tapering — rather than a stale trending list that reflects the last several hours rather than the current minute, which is the actual information a time-sensitive posting decision depends on; a content brief built from yesterday's trend data is solving a problem that's already over by the time it's answered. The credible-connection requirement targets the specific reason most trend-jacking content underperforms even when it's well-written: readers on X can tell the difference between an account extending something it's genuinely established a position on and an account manufacturing relevance to a topic purely because it's trending, and the latter reads as opportunistic in a way that costs more credibility over time than the individual post gains in reach. Tying the angle explicitly to the posting window enforces a real constraint the model would otherwise ignore: an angle that would require actual research or a properly produced thread is a fine idea on a normal day and the wrong idea inside a 45-minute trend window, and without a hard constraint on production time, a model asked for the best angle will happily propose something too slow to execute before the moment passes. Explicitly checking whether the strongest angle found is secretly a disguised version of something on the avoid-list matters because a model given a constraint will sometimes satisfy it superficially — reword the avoided angle rather than genuinely find a different one — and naming that check as a required step, with an instruction to surface the next-best option instead of quietly rationalizing a near-miss, is what keeps the constraint actually binding. The reversal-risk flag exists because live trends are not always settled facts by the time they're trending — a story still developing, a quote later shown to be edited, a claim that gets walked back — and a confident take built on a topic's current shape can look actively wrong within the same short window it was written for, which is a cost specific to reacting to something live rather than something that's already fully played out.",
    exampleOutput: `Trend stage: climbing, roughly 90 minutes in — reply volume still rising, this account has a real window.

Angle 1 (recommended): Extend the year-one pricing mistake this account already posted about twice — frame the thread's point as confirming what was learned the expensive way, with the specific number from that mistake as the hook. Hook: "I lost four months of runway to the exact mistake this thread is describing — here's the number nobody warned me about."

Angle 2: Push back narrowly on one sub-claim in the thread — that usage-based pricing is always safer at launch — using this account's own hiring-cost data as the counterexample. Hook: "Usage-based pricing didn't save us — it just moved the mistake somewhere harder to see."

Reversal risk: low — this is a strategy debate, not a developing news story, so the underlying claim isn't likely to flip within the window.`,
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-07-26' }],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Grok 4.1 live trend visibility on X.',
      },
    ],
  },
  {
    slug: 'grok-competitor-x-mentions-report',
    category: 'grok',
    title: 'Build a competitive intelligence report from live X mentions, not a vibe',
    description:
      'Structures a competitor-mentions scan into a comparison table with sourced quotes and explicit per-dimension confidence levels, so a competitive read holds up under a follow-up question instead of collapsing into an unsupported impression.',
    promptText: `You are building a competitive intelligence report from live X mentions of named competitors, using Grok's real-time post access. Every comparative claim needs a source; an impression that people seem to like a competitor more than us, with no post backing it, is not a finding — it's a guess wearing a findings format.

OUR BRAND
{{our_brand}}

NAMED COMPETITORS
{{named_competitors}}

TIME WINDOW
{{time_window}}

SPECIFIC COMPARISON DIMENSIONS
{{comparison_dimensions}}

DECISION THIS REPORT FEEDS
{{decision_context}}

REPORT RULES
Search live X mentions for our brand and each named competitor separately across {{time_window}}, then compare only along the specific dimensions listed — do not drift into a general who's-winning narrative if the ask was about one specific thing, like response time to complaints or a specific feature people are requesting. Match volume to context before drawing any conclusion from it: a competitor with ten times the mention volume might simply have ten times the user base, so a raw mention-count difference is not evidence of a sentiment or quality gap on its own — normalize your read by mentioning the scale difference explicitly rather than letting it silently inflate a comparison. Separate what users are praising a competitor for from what users are merely mentioning neutrally — a competitor named in passing while a user is still deciding is a different data point than one being actively praised, and folding both into one tally overstates the competitor's actual standing. Look specifically for churn signals — users explicitly stating they left one product for another and why — since these are the highest-value data points in a competitive scan and are easy to lose inside a larger volume of generic mentions if you're not searching for that pattern directly. Note anything a competitor appears to be doing that's generating notably positive reaction and that we are not currently doing, since that is the most actionable output of a report like this — a comparison that only confirms existing assumptions without surfacing a concrete gap has not earned its own existence. State your confidence per dimension separately rather than one blanket confidence for the whole report — a comparison might be well-supported on pricing sentiment and thin on support-quality sentiment within the same time window, and collapsing that into one number hides which conclusions are safe to act on.

OUTPUT FORMAT
1. A table: Dimension | Us | {{named_competitors}} | Confidence | Key supporting quote per brand.
2. Churn signals found, quoted, with the stated reason for switching.
3. The single most actionable gap: something a competitor is doing well that generated real positive reaction and we are not currently doing.
4. What this report cannot tell you — the specific question {{decision_context}} needs answered that live X mentions alone cannot settle.`,
    variables: [
      {
        name: 'our_brand',
        description: 'The brand being compared against competitors.',
        example:
          'Fieldnote, a field-service scheduling app for small contracting businesses',
        required: true,
      },
      {
        name: 'named_competitors',
        description: 'The specific competitors to search mentions for.',
        example: 'Jobber and Housecall Pro',
        required: true,
      },
      {
        name: 'time_window',
        description: 'The window of live mentions to search.',
        example: 'Past 30 days',
        required: true,
      },
      {
        name: 'comparison_dimensions',
        description: 'The specific, narrow dimensions to compare on.',
        example:
          'Mobile app reliability complaints, and response time when users publicly complain about a bug',
        required: true,
      },
      {
        name: 'decision_context',
        description: 'The actual decision this comparison is meant to inform.',
        example:
          'Product team deciding whether mobile stability should be next quarter’s top engineering priority over the two features currently ahead of it in the backlog',
        required: true,
      },
    ],
    targetTools: ['Grok', 'Grok on X'],
    tags: [
      'competitive-intelligence',
      'social-listening',
      'x-twitter',
      'market-research',
      'churn-analysis',
    ],
    whyItWorks:
      "The requirement to normalize mention volume against user-base scale addresses the single most common distortion in any social-listening comparison: absolute mention counts are driven as much by how many people use a product as by how they feel about it, and a report that presents raw counts side by side without acknowledging the scale gap invites a reader to draw a sentiment conclusion from what is actually mostly a market-share fact, which is a different claim entirely. Separating praise from neutral mention matters because a passing mention from someone still deciding and a genuine 'this is better than everything I've tried' post are both technically mentions of a competitor, but only one of them is evidence of anything resembling satisfaction, and a naive tally that counts both the same way manufactures a rosier competitor picture than the actual posts support. The explicit instruction to search for churn signals as their own pattern, rather than trusting them to surface inside a general mentions scan, reflects how live search actually behaves: a churn admission is one post among potentially hundreds of more generic mentions in a 30-day window, and a broad query optimized for volume will not reliably surface the rare, highest-value post unless the search is specifically pointed at that pattern rather than left to emerge on its own. Per-dimension confidence, instead of one report-wide confidence score, matches how live-social evidence actually distributes — a heavily discussed reliability complaint might produce dozens of clear posts while a support-response-time comparison might rest on five ambiguous ones within the same window, and forcing a single confidence number across both dimensions would either overstate the thin one or understate the strong one. The final requirement to name what this report cannot tell you exists because a competitive intelligence report built entirely from public social posts is structurally blind to anything users don't post about — churned users who left quietly without a public complaint, or satisfied users who never mention a product they have no complaint about — and naming that blind spot explicitly is what stops a decision-maker from treating a social-listening scan as a substitute for the actual usage or win-loss data the underlying decision may still require.",
    exampleOutput: `Dimension | Fieldnote | Jobber | Housecall Pro | Confidence | Quote
Mobile reliability complaints | 4 posts, all about a specific scheduling-sync crash | 11 posts, mostly about slow load times, not crashes | 6 posts, mixed | medium — scale-adjusted, Jobber's rate is still higher than ours | "Jobber crashed on me mid-job again, third time this month"
Support response time (public complaints) | 2 posts, both resolved within a day in-thread | 5 posts, no visible public resolution in-thread | 3 posts, one resolved within hours | low on Housecall Pro, small sample

Churn signal: one post explicitly stating a switch from Jobber to us, citing the scheduling-sync crash as the reason — worth flagging to product as a real, if single, data point.

Actionable gap: Housecall Pro's fast public support replies are getting visibly praised in-thread; we have no equivalent public-reply pattern to compare against.

What this can't tell you: whether mobile stability actually outranks the two features ahead of it in the backlog — that requires usage and revenue-impact data this scan doesn't have access to.`,
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-07-27' }],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Grok 4.1 with live X mention search.',
      },
    ],
  },
  {
    slug: 'grok-post-performance-root-cause',
    category: 'grok',
    title: 'Diagnose why a specific X post over- or under-performed',
    description:
      "Uses Grok's access to the live reply and quote-post thread under a specific post to identify the actual driver of its performance, instead of a generic virality explainer disconnected from what actually happened.",
    promptText: `You are diagnosing why one specific X post performed the way it did, using Grok's access to the actual reply thread, quote-posts, and who engaged with it — not a generic explainer about what makes posts go viral, disconnected from what actually happened under this post.

THE POST
{{the_post}}

PERFORMANCE DATA
{{performance_data}}

WHAT WAS EXPECTED
{{expectation}}

ACCOUNT'S RECENT BASELINE
{{recent_baseline}}

DIAGNOSIS RULES
Read the actual reply thread and quote-posts under {{the_post}}, not just the aggregate numbers — the numbers tell you it over- or under-performed, but the actual driver is almost always visible in what people said in reply, who quoted it and with what commentary, and at what point in the thread engagement accelerated or stalled. Distinguish a post that performed well because of genuine resonance with its stated point from one that performed well because of an unrelated reason — a reply from a much larger account, a screenshot getting shared out of context, a wording that read as funnier or more provocative than intended — since the second case is not a repeatable lesson about what to post next, even though the surface metric looks identical to the first case. Check whether the account's own recent baseline explains part of the result before crediting or blaming this specific post — a post that outperforms a baseline that's been climbing for unrelated reasons over the past month is a different story than a genuine outlier against a flat baseline, and the diagnosis should say which one this actually is. Look specifically for the moment engagement inflected — the first big quote-post, a reply that got its own traction, a specific line getting screenshotted — and name it rather than describing the whole trajectory as one smooth curve, since posts rarely perform evenly across their lifespan and the inflection point is usually where the actual causal story lives. If the honest answer is that this looks like noise — a normal-range result with no identifiable driver worth extracting a lesson from — say that directly rather than manufacturing a narrative to justify the exercise, since not every post's performance has a lesson worth learning from it.

OUTPUT FORMAT
1. One-paragraph verdict: what actually drove this result, in plain terms.
2. The specific inflection point in the thread, quoted or described, where the trajectory changed.
3. Whether this is a repeatable pattern or a one-off (an unrelated account boost, an out-of-context share) and why.
4. One concrete thing to try again next time, tied directly to the identified driver, not a generic best practice.
5. If the result looks like unexplainable noise, say so plainly instead of forcing a lesson.`,
    variables: [
      {
        name: 'the_post',
        description: 'The specific post being diagnosed.',
        example:
          'A post from a productivity-tools account sharing a short, blunt opinion about a common note-taking mistake, no image, no thread',
        required: true,
      },
      {
        name: 'performance_data',
        description: 'The actual metrics that make this result notable.',
        example:
          "3x the account's typical impressions and 6x typical replies within the first four hours, then flattened out",
        required: true,
      },
      {
        name: 'expectation',
        description: 'What the account expected this post to do before it posted.',
        example:
          "The account expected this post to perform roughly average — it wasn't flagged internally as a strong candidate before posting",
        required: true,
      },
      {
        name: 'recent_baseline',
        description: "The account's normal recent performance for context.",
        example:
          "This account's average post over the last 30 days gets modest, stable engagement with no other outlier in that window",
        required: true,
      },
    ],
    targetTools: ['Grok', 'Grok on X'],
    tags: [
      'post-performance-analysis',
      'x-twitter',
      'content-strategy',
      'social-media-analytics',
      'real-time-monitoring',
    ],
    whyItWorks:
      "Reading the actual reply thread and quote-post chain, rather than only the aggregate impression and engagement counts, is what makes a real causal diagnosis possible at all — the top-line numbers can only tell you that something unusual happened, while the actual mechanism, a reply from a larger account, a specific line getting screenshotted, a wording that read as funnier than intended, is only visible in the qualitative content of what people actually said and did under the post, which is exactly the layer Grok's live thread access can see and a metrics dashboard alone cannot. The instruction to separate genuine resonance from an unrelated boost targets a specific and consequential misattribution risk: a post that worked because a much larger account happened to quote it will look statistically identical, in the aggregate numbers, to a post that worked because its actual point struck a chord, but only the second case generalizes into an actual lesson about what to write next — treating the first as a repeatable pattern leads to a strategy built on a coincidence. Checking the account's own recent baseline before attributing the result to this one post addresses a basic causal-inference gap that a metrics-only read skips entirely: a result that's merely riding a broader upward trend the account has had for unrelated reasons over the past month is not evidence about this specific post at all, and crediting it as if it were produces a false lesson that won't replicate on the next post. Locating the actual inflection point in the thread, rather than describing overall performance as one smooth trajectory, matters because engagement on X rarely accumulates evenly; it typically has a specific triggering event, and identifying that event is usually the entire causal story, while a summary that only reports the shape of the curve without naming what caused the bend gives no actionable signal at all. The explicit permission to conclude a result is noise is the rule doing the most real work here, because a model asked to diagnose performance has a strong pull toward manufacturing a satisfying narrative regardless of whether the underlying data supports one, and a result inside normal variance with no identifiable driver produces more business damage when it's forced into a false lesson than when it's honestly labeled unexplained.",
    exampleOutput: `Verdict: this was driven almost entirely by one quote-post from an account with roughly 40x this account's following, added about ninety minutes after the original post, agreeing with the point and adding an example — replies accelerated sharply right after that quote, not gradually from the original audience.

Inflection point: the quote-post itself, timestamped around 1h30m in; reply volume in the 30 minutes after it exceeds the total from the first 90 minutes combined.

Pattern type: largely a one-off — the underlying opinion is solid and on-brand, but the multiplier here was an external account's reach, not something this account controls or can reliably reproduce.

Try again: the opinion itself landed well with the original small audience even before the quote-post, given a healthy early reply-to-impression ratio — worth posting more short, blunt single-opinion takes like this one, just without expecting the same multiplier.

Not noise — there's a clear, named driver, just one that isn't repeatable on demand.`,
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-07-28' }],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Grok 4.1 with live thread and quote-post access.',
      },
    ],
  },
  {
    slug: 'grok-steelman-red-team-decision',
    category: 'grok',
    title: 'Get Grok to actually argue the other side before you commit',
    description:
      "Uses Grok's more candid, less hedge-heavy conversational register to build the strongest honest case against an internal decision before it ships, instead of a softened devil's-advocate pass that pulls its punches.",
    promptText: `You are red-teaming a decision that's about to be finalized. Argue the strongest honest case against it — not a token devil's-advocate pass that raises one mild concern and then reassures everyone the original plan is still fine. Use a direct, unhedged register: say plainly what you actually think is the weakest part of this decision, even if it's an uncomfortable thing to put in writing, and don't soften a real concern into a vague suggestion just to be polite.

THE DECISION
{{the_decision}}

REASONING BEHIND IT SO FAR
{{stated_reasoning}}

WHO NEEDS TO HEAR THE HONEST VERSION
{{audience}}

WHAT WOULD ACTUALLY CHANGE THIS DECISION
{{reversibility_bar}}

TOPICS THAT ARE OFF LIMITS
{{off_limits_topics}}

RED-TEAM RULES
Build the actual strongest case against the decision, not the easiest one to counter — if there's an argument against this that would genuinely worry the people who made the decision if they heard it stated plainly, that is the argument this needs, not a milder one that's simpler to write and easier for them to dismiss. Do not manufacture disagreement if the decision is genuinely sound — a red-team that always finds a serious flaw regardless of the actual decision is worthless, since nobody can tell a real warning from a reflexive one; if the honest strongest case against this is genuinely weak, say that directly and explain why the decision holds up, rather than padding out a token list of minor concerns to look thorough. Separate a fixable flaw in the plan from a fundamental flaw in the premise — a bad decision can sometimes be salvaged with a specific change, while a decision built on a wrong assumption at its foundation needs to be reconsidered entirely, and conflating the two produces a set of tweaks that doesn't address the real problem. State the worst plausible outcome explicitly and concretely — not that there could be risks, but the actual specific way this goes wrong, with enough detail that someone reading it can picture exactly what happens and to whom. Respect the stated off-limits topics without softening everything else to compensate — those specific topics are out of scope for a defined reason, but nothing else on the list should get watered down just because something else got fenced off. Anchor every criticism in {{stated_reasoning}} directly — point at the specific piece of the existing logic that the criticism actually undermines, rather than raising a general worry disconnected from the argument that was actually made for the decision.

OUTPUT FORMAT
1. The single strongest argument against this decision, stated in two or three direct sentences, no hedging language.
2. Whether the flaw is fixable-with-a-change or fundamental-to-the-premise, and why.
3. The worst plausible concrete outcome if this decision proceeds unchanged.
4. A secondary, weaker concern worth flagging even if it's not decision-changing on its own.
5. Your honest read on whether this decision should proceed as-is, get modified, or get reconsidered from scratch — pick one.`,
    variables: [
      {
        name: 'the_decision',
        description: 'The specific decision being red-teamed.',
        example:
          'Moving the entire customer support function from a mixed in-house and outsourced model to a fully outsourced call center to cut costs 30% next quarter',
        required: true,
      },
      {
        name: 'stated_reasoning',
        description: 'The actual case that has been made for the decision so far.',
        example:
          'Support costs have grown faster than revenue for two straight quarters, and the outsourced vendor quoted a fixed per-ticket rate well below current in-house cost per ticket',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who this honest pushback is actually for.',
        example:
          "The VP who is presenting this to the executive team next week and wants to know what pushback to expect before she's in the room",
        required: true,
      },
      {
        name: 'reversibility_bar',
        description:
          'How costly or difficult reversing this decision would be if it turns out wrong.',
        example:
          'This is a 12-month vendor contract with a real penalty for early termination, so getting it wrong is expensive to reverse',
        required: true,
      },
      {
        name: 'off_limits_topics',
        description: 'What is explicitly out of scope for this particular red-team pass.',
        example:
          'Do not relitigate whether cost reduction is the right priority this quarter — that decision is already made above this one; focus only on whether full outsourcing is the right way to achieve it',
        required: true,
      },
    ],
    targetTools: ['Grok'],
    tags: [
      'decision-making',
      'red-teaming',
      'risk-analysis',
      'critical-thinking',
      'business-strategy',
    ],
    whyItWorks:
      "xAI has positioned Grok's conversational register as deliberately less hedge-heavy and less inclined toward reflexive both-sides softening than assistants tuned harder toward always landing on a reassuring middle ground, and a red-team exercise is one of the few genuinely legitimate professional uses of that trait — the entire point of red-teaming is to surface the version of the criticism that would actually worry the decision-makers if they heard it, and a model that defaults to softening every strong claim into a hedge undermines that purpose by construction, regardless of how good its underlying analysis is. The explicit permission to conclude the decision is sound, rather than manufacturing a flaw to justify the exercise, matters because a red-team prompt that always produces a serious-sounding concern trains its own users to stop trusting it — if every decision gets flagged as risky, 'risky' stops carrying any information, and the one time a red-team output should actually change someone's mind gets lost in the noise of every previous output that cried wolf for the same reason. Separating a fixable flaw from a fundamentally wrong premise reflects a real and useful distinction in how bad decisions actually fail: a sound strategy executed with one wrong parameter needs a tweak, while a strategy built on a wrong assumption about the world needs to be abandoned rather than patched, and collapsing the two into one undifferentiated pile of concerns leaves the actual decision-maker unable to tell which kind of response the situation calls for. Requiring the worst outcome to be stated concretely rather than abstractly targets the specific way vague risk language fails to change anyone's mind — a specific, pictureable scenario creates the kind of visceral clarity that actually informs a real go or no-go decision, whereas a generic risk category is easy to nod at and then ignore. Anchoring every criticism directly to a specific piece of the stated reasoning, rather than allowing free-floating worries, is what keeps the red-team actionable instead of just uncomfortable — a criticism that names exactly which assumption in the original argument it's attacking gives the decision-maker something concrete to either defend or revise, while an unanchored objection just adds anxiety without giving anyone a specific next move.",
    exampleOutput: `Strongest argument: the 30% cost projection assumes ticket volume and complexity stay flat, but a fully outsourced vendor paid per-ticket has a direct financial incentive to close tickets fast rather than well — if resolution quality drops and ticket volume rises from repeat contacts, the actual cost curve could look nothing like the quoted rate times current volume.

Fixable or fundamental: fixable-with-a-change. The premise, that outsourcing can be cheaper, isn't wrong, but the plan as stated has no quality-based penalty clause in the vendor contract, which is what turns a plausible cost play into a real quality risk.

Worst plausible outcome: support quality visibly degrades within two months, customer complaints about being bounced between agents spike, and the company is locked into the contract's early-termination penalty for the remaining ten months while actively bleeding retention.

Secondary concern: the two quarters of rising cost cited as justification haven't been checked against whether ticket volume itself grew for a one-time reason, like a product launch or pricing change, that might already be settling back down on its own.

Recommendation: modify, not proceed as-is or scrap. Push for a quality-linked penalty clause in the vendor contract before signing, given the reversibility bar stated.`,
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-07-29' }],
    changelog: [
      { date: '2026-07-29', note: 'Initial publish, verified against Grok 4.1.' },
    ],
  },
  {
    slug: 'grok-code-fast-agentic-bug-fix-brief',
    category: 'grok',
    title:
      'Brief Grok Code Fast for an agentic bug fix without an open-ended blast radius',
    description:
      "Scopes a bug-fix task for Grok Code Fast's speed-optimized agentic coding loop with an explicit blast-radius boundary and a required diff-review step, so fast iteration doesn't turn into fast, wide, unreviewed changes.",
    promptText: `You are using Grok Code Fast in an agentic coding loop to diagnose and fix a specific bug. Code Fast is tuned for speed across many tool-calling iterations, not for the deepest possible single-shot reasoning, so this brief gives you a tight blast radius up front rather than relying on you to infer scope discipline mid-task while you're moving fast through file reads and edits.

BUG DESCRIPTION
{{bug_description}}

REPRODUCTION STEPS
{{repro_steps}}

FILES YOU MAY TOUCH
{{allowed_files}}

FILES OFF LIMITS
{{off_limits_files}}

TEST COMMAND TO VERIFY THE FIX
{{test_command}}

TASK RULES
Reproduce the bug first, using the exact steps given, before writing any fix — if you can't reproduce it with the steps as given, stop and report that mismatch rather than guessing at a plausible-sounding fix for a bug you haven't actually confirmed. Stay strictly inside the allowed files list; if the actual root cause lives in a file outside that list, stop and report where the real fix needs to happen instead of finding a workaround inside the allowed files that papers over the symptom without touching the real cause. Make the smallest change that fixes the actual root cause, not the smallest change that makes the specific repro steps stop failing — a fix that special-cases the exact input in the repro steps while leaving the underlying logic error in place is not a fix, it's a patch that will resurface on the next slightly different input. Run the test command after every change, not only once at the end, so a fix that resolves the original bug but breaks something else gets caught immediately, in the same iteration, rather than surfacing later as a separate bug report against the same code. Do not refactor, rename, or reformat anything beyond what the fix itself requires, even inside the allowed files — a bug-fix diff padded with unrelated cleanup is harder to review and harder to revert if the fix itself turns out to be wrong. When the fix is verified, stop — do not continue looking for other things to improve in the allowed files just because you're already in there; a scope-creep pass is a separate task with its own brief, not a bonus round on this one.

OUTPUT FORMAT
1. Confirmation the bug reproduced as described, or a report of the mismatch if it didn't.
2. Root cause, stated in one or two sentences — what was actually wrong, not just where.
3. The diff, and only the diff — no restated full files unless a file is new.
4. Test command output after the fix, showing it passes.
5. Anything you noticed outside the allowed files that looks related but wasn't touched, flagged for a separate task.`,
    variables: [
      {
        name: 'bug_description',
        description: 'The bug as reported, in plain terms.',
        example:
          "Users report that changing their timezone in account settings doesn't update timestamps already shown on the dashboard until a full page reload",
        required: true,
      },
      {
        name: 'repro_steps',
        description: 'Exact steps to reproduce the bug.',
        example:
          'One, log in with an account set to America/New_York. Two, note the timestamp on any dashboard event. Three, change timezone to Asia/Tokyo in settings without reloading. Four, observe the dashboard still shows the New York-based timestamp.',
        required: true,
      },
      {
        name: 'allowed_files',
        description: 'The specific files the agent may edit.',
        example:
          'src/features/dashboard/useEventTimestamps.ts and src/features/settings/timezoneStore.ts',
        required: true,
      },
      {
        name: 'off_limits_files',
        description:
          'Files that must not be touched, with the reason, if any apply to this task.',
        example:
          'Anything under src/features/billing — a past incident there means billing changes require a separate, human-reviewed PR regardless of how related it looks',
        required: false,
      },
      {
        name: 'test_command',
        description: 'The exact command to run to verify the fix.',
        example: 'npm run test -- useEventTimestamps.spec.ts',
        required: true,
      },
    ],
    targetTools: ['Grok Code Fast'],
    tags: ['agentic-coding', 'bug-fix', 'code-review', 'scoped-tasks', 'testing'],
    whyItWorks:
      "Grok Code Fast is specifically optimized for speed and cost across many tool-calling turns in an agentic loop, reading files, making an edit, running a command, reading the result, rather than for the deepest possible reasoning on a single turn, which means it will move through a codebase quickly and confidently, and a brief with no explicit blast-radius boundary is trusting that speed-tuned confidence to also self-limit its own scope, which is exactly the trade-off a fast, iteration-heavy model is least suited to make unsupervised. Naming allowed and off-limits files explicitly, rather than describing the bug and trusting the agent to infer reasonable boundaries, matters because an agentic loop optimized to keep making progress will often follow a plausible lead into an adjacent file if the actual root cause isn't where the bug report suggested, which is sometimes exactly the right instinct, and sometimes how a fix-a-timestamp-bug task quietly turns into an unreviewed edit inside billing code three files away, which is why the off-limits list carries a stated reason rather than reading as an arbitrary restriction. Requiring reproduction before any fix, and an explicit stop-and-report if reproduction fails, targets the specific failure mode of a fast agentic loop: it's quicker to pattern-match a plausible fix from the bug description than to actually verify the described behavior first, and a model under speed pressure has every incentive to skip straight to writing code rather than confirming the premise, which is how confident-looking fixes for bugs that don't reproduce as described end up shipped. Running the test command after every change rather than once at the end catches a regression at the exact iteration that introduced it, while the agent still has full context on what it just changed — the same regression caught only at the end requires the model to reconstruct which of several edits caused it, which a fast, high-iteration-count model handles less reliably than a single well-scoped diff-and-verify cycle. The explicit stop condition after verification, no bonus scope-creep pass, matters because an agentic coding loop with no defined end state will keep finding small things to improve once it's already inside a file, and each of those improvements is an unreviewed change riding along on a diff that was supposed to be one narrow bug fix, which is precisely the pattern that makes a fast model's output slower to review than the time it saved writing it.",
    exampleOutput: `Reproduced: confirmed. Timezone change in settings updates the store immediately, but useEventTimestamps memoizes formatted timestamps keyed only on the raw event time, not on the current timezone, so the memo never invalidates when timezone changes.

Root cause: the useMemo dependency array in useEventTimestamps.ts includes events but not the current timezone value from timezoneStore, so a timezone change alone never triggers recomputation.

Diff: useEventTimestamps.ts, added timezone to the useMemo dependency array; timezoneStore.ts unchanged, no fix needed there.

Test output: useEventTimestamps.spec.ts, 6 passed, including a new case for timezone change without event change.

Outside allowed files, not touched: settings/TimezoneSelector.tsx shows the same stale-timestamp pattern in a preview panel — looks related, flagging as a separate task rather than fixing here.`,
    verifiedAgainst: [
      { tool: 'Grok Code Fast', version: 'Grok Code Fast 1', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Grok Code Fast 1 in an agentic tool-calling loop.',
      },
    ],
  },
  {
    slug: 'grok-long-context-contract-risk-scan',
    category: 'grok',
    title: "Feed a full contract into Grok's long context window for one pass, not five",
    description:
      "Structures a single-pass risk scan across an entire long document using Grok's extended context window, with cross-reference checks between clauses that only a whole-document read can catch, instead of a chunked summary that misses contradictions across sections.",
    promptText: `You are running a risk scan across an entire long document in one pass, using Grok's extended context window to hold the whole thing at once rather than summarizing it section by section. The specific value of a whole-document read is catching a contradiction or inconsistency between two clauses that sit far apart in the document — a risk that a chunked, section-by-section review would structurally miss, since no single chunk would ever contain both halves of the contradiction.

DOCUMENT
{{document_text}}

DOCUMENT TYPE AND PURPOSE
{{document_type}}

WHAT THE READER ACTUALLY NEEDS TO KNOW
{{reader_concern}}

KNOWN PROBLEM AREAS FROM PAST DOCUMENTS OF THIS KIND
{{known_risk_patterns}}

SCAN RULES
Read the entire document before flagging anything, and specifically check whether any clause, definition, or number appears more than once with a different value or different wording each time — a defined term used one way early in the document and a subtly different way much later, a liability figure stated once and a different figure appearing in an exhibit, a defined time period appearing once with a carve-out and once without — since this exact class of inconsistency is the reason a whole-document pass exists at all, and is invisible to any review that only ever holds one section in view. Flag every clause that materially favors the other party in a way that isn't obviously standard for this type of document — distinguish a boilerplate clause that appears in essentially every document of this kind from one that's been quietly tilted further than standard, and say explicitly which category each flagged clause falls into. Check the known problem areas named above specifically, even if nothing else about the document raises a flag — a pattern that's caused a real problem in a past document of this kind deserves a direct, deliberate check here, not just a hope that the general read happens to catch it again. Note anything defined and then never actually used elsewhere in the document, and anything used that was never defined — both are real drafting risks, not just tidiness issues, since an undefined term used in an operative clause creates real ambiguity about what was actually agreed to. State plainly where you are uncertain whether a clause is actually risky versus merely unusual-sounding to you without deeper knowledge of standard practice in this specific document type — a risk scan that reports every unfamiliar clause as dangerous is not more careful, it's less useful, because it can't be trusted to distinguish a real problem from an unfamiliar but perfectly normal structure.

OUTPUT FORMAT
1. Cross-document inconsistencies found: each one naming both locations and both conflicting values or wordings.
2. Materially unfavorable clauses: each tagged standard-but-present or unusually tilted, with the specific language quoted.
3. Findings against each known problem area named above, even if the finding is checked and not present here.
4. Undefined-but-used and defined-but-unused terms.
5. Anything flagged with genuine uncertainty about whether it's actually a risk, named as such rather than folded in with the confident findings.`,
    variables: [
      {
        name: 'document_text',
        description: 'The full text of the document to scan.',
        example:
          'The full text of a 40-page vendor services agreement, including all exhibits and schedules',
        required: true,
      },
      {
        name: 'document_type',
        description: 'What kind of document this is and who is reviewing it.',
        example:
          'A services agreement with a software vendor, being reviewed before signature by the business side, not by outside counsel',
        required: true,
      },
      {
        name: 'reader_concern',
        description: 'The specific question the reader actually needs answered.',
        example:
          "Whether this can be terminated without penalty if the vendor's service levels slip, and whether liability is capped somewhere unfavorable relative to what was verbally negotiated",
        required: true,
      },
      {
        name: 'known_risk_patterns',
        description:
          'A specific problem pattern seen in past documents of this kind, if one exists.',
        example:
          'Past vendor contracts from this same vendor have had a liability cap in the main body that gets quietly overridden by a higher, less favorable figure buried in an exhibit',
        required: false,
      },
    ],
    targetTools: ['Grok'],
    tags: [
      'contract-review',
      'risk-analysis',
      'long-context',
      'document-analysis',
      'due-diligence',
    ],
    whyItWorks:
      "The core mechanism this prompt is built around is real and specific to what a long context window actually enables: a contradiction between a clause early in a document and a clause much later can only be caught by something holding both in view at the same time, and a review process that chunks a document into sections and summarizes each independently, the pattern a shorter-context model or a naive multi-pass summary is forced into, structurally cannot surface that class of finding, because no single chunk ever contains both halves of the inconsistency being checked. Requiring the standard-versus-unusually-tilted distinction on every unfavorable clause targets a specific failure mode of AI-generated contract review: flagging every clause that favors the other party, without distinguishing ordinary boilerplate from something genuinely unusual, produces a long list that trains its reader to stop reading carefully, because most of it is noise a competent reviewer already expects to see in any document of this type — the useful signal is specifically the deviation from what's standard, not the mere presence of a one-sided clause. Directly checking the named known-risk patterns, rather than trusting the general scan to rediscover them independently, matters because a pattern that's caused a real problem before is exactly the kind of specific, narrow thing a broad scan can miss on any given pass — general-purpose review catches general-purpose issues reliably, but a known, previously-costly quirk specific to one counterparty or one document template deserves a direct, named check rather than incidental discovery. The undefined-term check reflects a real drafting hazard distinct from ordinary ambiguity: a term used in an operative clause that was never actually defined anywhere in the document creates a genuine gap in what was agreed to, not a style issue, and it's a specific pattern worth checking mechanically across an entire document rather than trusting it to be caught by a reader focused on substantive clause content. The explicit permission to flag genuine uncertainty, separately from confident findings, matters because a document-review tool with no honest uncertainty channel either overclaims risk on unfamiliar-but-normal clauses or underclaims it by omission, and a reader relying on this scan needs to know which findings are load-bearing enough to escalate to actual counsel and which are the model's own hedge on something outside general business review's competence to fully assess.",
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-07-31' }],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Grok 4.1 with a full-document single-pass context window.',
      },
    ],
  },
  {
    slug: 'grok-heavy-multiagent-scenario-analysis',
    category: 'grok',
    title: 'Give Grok Heavy a scenario question worth its parallel-agent cost',
    description:
      "Structures a genuinely multi-variable scenario question for Grok Heavy's parallel multi-agent mode, with an explicit disagreement-surfacing requirement, so the extra compute buys real cross-checked reasoning instead of restating one agent's answer five times.",
    promptText: `You are using Grok Heavy's multi-agent mode, where several agents work the same problem in parallel and their answers get cross-checked and consolidated before you see a final result. This mode costs meaningfully more time and compute than a single-pass answer, so this brief is for a question that genuinely has enough moving parts and enough ways to go wrong that independent parallel reasoning is likely to catch something a single pass would miss, not a question with one clean, checkable answer that doesn't need several agents converging on it.

SCENARIO
{{scenario_description}}

KEY VARIABLES IN PLAY
{{key_variables}}

WHAT A WRONG ANSWER WOULD COST
{{cost_of_error}}

DECISION THIS FEEDS
{{decision_context}}

ANALYSIS RULES
Work through the scenario considering how the key variables interact with each other, not just each variable's effect in isolation — the actual value of multi-agent parallel reasoning on a scenario like this comes from catching an interaction effect that a single straight-line pass through the variables one at a time would miss, so the analysis needs to explicitly address how {{key_variables}} combine, not just list each one's individual impact. Where independent reasoning paths would plausibly disagree on a genuinely uncertain point, surface that disagreement rather than presenting one smoothed-over consensus view — a scenario analysis that reports full agreement on every point when the underlying question actually has real uncertainty is more likely hiding disagreement behind an averaged answer than genuinely finding consensus, and the disagreement itself is often the most useful output for a decision-maker weighing real risk. Identify the specific assumption this analysis is most sensitive to — the one input that, if wrong, changes the recommendation the most — and state it explicitly rather than burying it inside a wall of even-weighted considerations; a decision-maker needs to know which one number or assumption to double-check before trusting the rest of the analysis. Rank scenarios or options by expected outcome and separately by worst-case downside, since the option with the best expected outcome is not always the right choice once {{cost_of_error}} is accounted for — a decision that feeds something with a high cost of getting wrong should weight the worst-case column more heavily than a decision that's cheap to reverse if it turns out wrong. State plainly if the question, on reflection, actually has a single clear answer once properly worked through — do not manufacture false complexity or artificial uncertainty just to look like it justified the parallel-reasoning approach.

OUTPUT FORMAT
1. The recommended path, stated plainly, with the reasoning that supports it.
2. Where genuine disagreement or uncertainty exists among plausible reasoning paths, named explicitly rather than smoothed over.
3. The single assumption this recommendation is most sensitive to.
4. A table: Option | Expected outcome | Worst-case downside | Recommended given {{cost_of_error}}.
5. If the scenario turned out simpler than it looked, say so directly.`,
    variables: [
      {
        name: 'scenario_description',
        description: 'The multi-variable scenario or decision being analyzed.',
        example:
          'Deciding between three market-entry sequences for a B2B product entering three adjacent countries, where entering in the wrong order risks losing first-mover advantage in the largest market to a known competitor already expanding there',
        required: true,
      },
      {
        name: 'key_variables',
        description: 'The specific variables whose interaction actually matters.',
        example:
          'Regulatory approval timelines that differ by country, the competitor’s known expansion pace, and internal team capacity that can only properly support one full launch at a time',
        required: true,
      },
      {
        name: 'cost_of_error',
        description:
          'What getting this wrong would actually cost, and how reversible it is.',
        example:
          "A wrong sequencing choice could mean losing the largest market's first-mover position permanently — reversing that decision six months in is not realistically possible",
        required: true,
      },
      {
        name: 'decision_context',
        description:
          'What this analysis is feeding, and what form of answer it needs to take.',
        example:
          'The go-to-market team needs a sequencing recommendation to present to leadership next week, with leadership expecting a single clear recommendation, not three options with no ranking',
        required: true,
      },
    ],
    targetTools: ['Grok Heavy'],
    tags: [
      'scenario-analysis',
      'decision-making',
      'multi-agent-reasoning',
      'strategic-planning',
      'risk-analysis',
    ],
    whyItWorks:
      "Grok Heavy's actual mechanism, running several agents on the same problem independently and consolidating their outputs, only pays for itself on a question where independent reasoning paths are likely to genuinely diverge somewhere, which is why this brief is deliberately scoped to a scenario with real interacting variables and a plausible source of disagreement, rather than a question with one clean derivable answer that several parallel agents would just converge on identically at several times the cost of one. The instruction to surface disagreement rather than present a smoothed consensus targets the specific way a consolidation step can quietly discard the most valuable output of running multiple agents in the first place: if some agents lean one way and others lean another on a genuinely uncertain sub-question, an averaged or majority-vote final answer erases exactly the signal, that this point is contested, that a decision-maker facing real uncertainty most needs to see, and a report that reads as unanimous when the underlying reasoning wasn't is a worse outcome than a single-agent answer that at least doesn't claim false certainty. Requiring the single most sensitivity-driving assumption to be named explicitly, rather than left implicit inside an evenly-weighted list of considerations, matters because a leadership audience reading a strategic recommendation needs one specific thing to sanity-check before trusting the rest — a recommendation that depends heavily on an assumed competitor timeline is a fundamentally different risk than one that's robust across a wide range of that assumption, and burying which one this is inside undifferentiated prose defeats the purpose of asking for a recommendation at all. Splitting expected outcome from worst-case downside, and explicitly weighting the latter by the stated cost of error, reflects a real asymmetry in decision quality that a single expected-value ranking hides: an option with a marginally better average outcome but a catastrophic and irreversible downside is frequently the wrong choice once the cost of being wrong is factored in, and a scenario analysis that only ranks by expected outcome will systematically favor options that look best on average while ignoring exactly the tail risk this kind of high-stakes, hard-to-reverse decision is supposed to be managing against. The permission to report the scenario as simpler than expected exists because the multi-agent framing itself creates pressure to justify its own use with a complex-sounding answer, and naming that as an acceptable, even preferred, outcome keeps the analysis honest rather than manufacturing artificial nuance to match the compute spent finding it.",
    verifiedAgainst: [
      { tool: 'Grok Heavy', version: 'Grok 4.1 Heavy', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Grok 4.1 Heavy multi-agent mode.',
      },
    ],
  },
  {
    slug: 'grok-vision-screenshot-context-analysis',
    category: 'grok',
    title: 'Read a screenshot posted on X the way the thread actually means it',
    description:
      "Analyzes an image attached to a specific X post together with the surrounding thread's own context and claims, so Grok's multimodal read catches what the screenshot actually shows rather than what the post's caption claims it shows.",
    promptText: `You are analyzing an image attached to a specific X post, using Grok's multimodal vision capability together with the actual surrounding thread context — the post's caption, the replies, and any competing interpretation already being argued about in the thread. Your job is to check what the image actually shows against what the post claims it shows, not to simply describe the image in isolation or accept the caption's framing as accurate by default.

THE POST AND IMAGE
{{post_and_image}}

THE CLAIM BEING MADE ABOUT IT
{{claim_about_image}}

COMPETING INTERPRETATIONS IN THE THREAD
{{competing_interpretations}}

WHAT WOULD SETTLE THE DISPUTE
{{settling_detail}}

ANALYSIS RULES
Describe only what is actually visible in the image first, independent of the caption's framing — timestamps, visible UI elements if it's a screenshot of an app or platform, any text legible in the image itself, signs of editing or cropping — before evaluating whether that description supports, contradicts, or is simply silent on the specific claim being made about it. Check for the specific, checkable signs of manipulation or selective framing that are common in screenshots circulating on social platforms: a visibly cropped edge that could be hiding contradicting context just outside the frame, inconsistent fonts or spacing suggesting an edited screenshot rather than a genuine capture, a timestamp or metadata detail that doesn't line up with the claimed date or context, or a caption that describes something the image itself does not actually show and requires the viewer to take on faith. State explicitly whether the image, on its own, is sufficient evidence for the claim being made, is consistent with the claim but doesn't independently prove it, or actually contradicts what's being claimed — these are three different findings, and treating consistent-with as equivalent to proves is the specific mistake that lets a genuinely ambiguous screenshot get treated as settled evidence. If the competing interpretations already circulating in the thread are visible to you, address each one directly against what's actually in the image, rather than only evaluating the original poster's framing and ignoring the pushback already happening underneath it. Name the specific additional detail — a fuller screenshot, the original unedited source, a second independent angle — that would actually settle the dispute if it existed, rather than declaring the matter closed based on what's currently visible if genuine ambiguity remains.

OUTPUT FORMAT
1. Plain description of what's visible in the image, with no interpretation yet.
2. Verdict: sufficient evidence for the claim / consistent but not proof / contradicts the claim — pick one and defend it.
3. Response to each competing interpretation already circulating, addressed directly.
4. Any visible sign of cropping, editing, or inconsistency worth flagging.
5. What specific additional detail would actually settle this if the current image doesn't.`,
    variables: [
      {
        name: 'post_and_image',
        description: 'The post and the specific image attached to it.',
        example:
          "A screenshot claiming to show an error message from a specific company's app, posted with the caption implying the company's service is currently broken for everyone",
        required: true,
      },
      {
        name: 'claim_about_image',
        description: 'What the post claims the image proves.',
        example:
          'The caption states this proves a widespread, ongoing outage affecting all users right now',
        required: true,
      },
      {
        name: 'competing_interpretations',
        description:
          'Any competing reads already visible in the replies, if there are any.',
        example:
          'Several replies argue the screenshot could be an old cached screenshot being reposted, since a similar error was reported on this app months ago; a couple of replies say the service is working fine for them right now',
        required: false,
      },
      {
        name: 'settling_detail',
        description: 'What kind of evidence would actually resolve the dispute.',
        example:
          "A visible current timestamp in the screenshot's own UI, or independent confirmation from other users experiencing the same error right now",
        required: true,
      },
    ],
    targetTools: ['Grok', 'Grok on X'],
    tags: [
      'multimodal-analysis',
      'image-verification',
      'fact-checking',
      'x-twitter',
      'misinformation',
    ],
    whyItWorks:
      "The instruction to describe the image independent of the caption before evaluating the claim is the key structural safeguard here, because a caption primes interpretation — a vision model asked directly whether an image shows an outage is far more likely to read ambiguous visual evidence through the lens of the question it was just asked than one first asked to describe plainly what's visible and only then asked whether that description actually supports the claim, which is the same reason a careful human fact-checker separates description from interpretation as two distinct steps rather than one. The three-way verdict, sufficient evidence, consistent-but-not-proof, or contradicts, targets a specific and common sloppy move in screenshot-based claims: a single error screenshot is very often consistent with a wider outage without being remotely sufficient to prove one, since it's equally consistent with one user having one bad request, and collapsing that distinction into a binary supports-or-doesn't answer would force a genuinely ambiguous piece of evidence into a false confident bucket in either direction. Checking for specific, nameable manipulation signals, cropping, font inconsistency, a mismatched timestamp, rather than a vague sense of whether something looks edited, grounds the visual check in artifacts that are actually detectable from the image itself, which is the difference between a real forensic check and a model simply asserting confidence or suspicion with nothing underneath it that a skeptical reader could verify independently. Addressing competing interpretations already visible in the thread directly, rather than only evaluating the original poster's framing, matters because the replies underneath a disputed screenshot often already contain the actual counter-evidence, someone noting the error is months-old, someone confirming the service works fine for them right now, and an analysis that only engages with the caption while ignoring the pushback happening in the same thread is solving a narrower and less useful problem than the one actually in front of it. Naming the specific detail that would settle the dispute, rather than declaring a verdict as final when real ambiguity remains, keeps the analysis honest about the actual epistemic status of a single screenshot: a cropped or context-free image is frequently genuinely unresolvable on its own, and saying so plainly, with a concrete next check named, is more useful to someone trying to get to the truth than an overconfident verdict manufactured because a clean answer felt more satisfying to deliver than an honest not-settled-yet.",
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-08-02' }],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Grok 4.1 multimodal vision with live thread context.',
      },
    ],
  },
  {
    slug: 'grok-voice-mode-assistant-script',
    category: 'grok',
    title: 'Design a Grok Voice Mode persona brief for a real spoken use case',
    description:
      "Writes a conversational persona and turn-taking brief for Grok Voice Mode's real-time spoken interaction, scoped to a specific hands-busy use case, instead of a generic chatbot personality description that ignores what makes spoken conversation different from typed chat.",
    promptText: `You are writing a persona and interaction brief for Grok Voice Mode, for a specific real-time spoken use case where the user's hands and eyes are occupied with something else. A voice interaction has a different set of constraints than a typed chat — no scrollback to reread, no skimming ahead, and a real cost to a response that's too long to hold in working memory while listening — so this brief needs to specify the interaction's shape, not just the assistant's personality.

USE CASE
{{use_case}}

USER STATE WHILE TALKING
{{user_state}}

PERSONA AND TONE
{{persona_and_tone}}

INTERRUPTION AND CORRECTION BEHAVIOR
{{interruption_behavior}}

WHAT MUST NEVER HAPPEN
{{hard_constraints}}

BRIEF RULES
Keep every spoken response short enough to be understood on first listen without rereading — there is no rereading in a voice interface, so a response that would be perfectly fine as three sentences of dense text needs to be restructured for listening comprehension: shorter sentences, one idea per sentence, and the most important piece of information stated first in case attention lapses partway through. Design for interruption as a normal event, not an error case — {{user_state}} means the user may need to cut the assistant off mid-sentence to react to something in their actual environment, and the assistant resuming exactly where it left off, rather than restarting the whole response or losing the thread entirely, is the difference between a usable hands-busy assistant and an annoying one. Never make the user repeat information they already gave earlier in the same conversation just because the assistant's turn ended — the persona should track what's already been said and refer back to it naturally, the way a person would, rather than asking a redundant clarifying question a moment after the answer was already given. Build in an explicit, low-effort way for the user to correct a misunderstanding without a long back-and-forth — a single short phrase that resets or redirects, since a voice interface with a clunky correction flow is worse than a text interface with the same problem, because correcting by voice while distracted is inherently harder than typing a correction. Respect the hard constraints named above as absolute, not as tone guidance to be balanced against being helpful — if a hard constraint says never do something, the persona brief should make clear that not doing it takes priority over sounding more natural or more helpful in the specific moment where the two conflict.

OUTPUT FORMAT
1. A one-paragraph persona description: tone, pacing, and vocabulary level appropriate to {{use_case}} and {{user_state}}.
2. Three to five example exchanges showing realistic back-and-forth, including at least one interruption and one correction.
3. The specific phrase or pattern the user should be able to use to correct a misunderstanding.
4. How the hard constraints get enforced in practice, with a concrete example of the assistant declining or redirecting rather than complying.`,
    variables: [
      {
        name: 'use_case',
        description: 'The specific hands-busy spoken use case.',
        example:
          'A hands-free cooking assistant guiding someone through a recipe step by step while their hands are covered in flour',
        required: true,
      },
      {
        name: 'user_state',
        description:
          'What the user is physically doing and how attention is split while talking to it.',
        example:
          'Standing at a counter, hands occupied, attention split between the assistant and the actual cooking task, likely to interrupt to ask about substitutions or timing',
        required: true,
      },
      {
        name: 'persona_and_tone',
        description:
          'The specific tone this assistant should have, described concretely.',
        example:
          'Warm and unhurried, like a patient friend talking you through a recipe over the phone, not a brisk instructional voice reading a list',
        required: true,
      },
      {
        name: 'interruption_behavior',
        description:
          'How the assistant should specifically behave when interrupted mid-response.',
        example:
          'If interrupted mid-step, stop immediately, answer the interruption directly, then offer to resume the step rather than restarting the whole instruction from the beginning',
        required: true,
      },
      {
        name: 'hard_constraints',
        description:
          'Anything the assistant must never do regardless of how helpful it would sound.',
        example:
          'Never suggest an ingredient substitution involving a known allergen category, like nuts, shellfish, or dairy, without first asking whether that’s a concern for this cook, even if it seems like the obvious swap',
        required: true,
      },
    ],
    targetTools: ['Grok Voice Mode'],
    tags: [
      'voice-ui',
      'conversational-design',
      'persona-design',
      'hands-free',
      'interaction-design',
    ],
    whyItWorks:
      "The no-rereading constraint is the structural fact this entire brief is built around, and it's genuinely different from designing for a typed chat interface: a user reading text can skim ahead, reread a dense sentence, or scroll back to check a detail, none of which is available in a spoken interaction, so a response that would read as perfectly clear and appropriately detailed in text can be genuinely incomprehensible spoken aloud at the same information density, which is why the brief asks for restructuring, not just shortening. Treating interruption as a normal event rather than an edge case reflects how Grok Voice Mode's real-time spoken turn-taking actually needs to behave for a hands-busy use case specifically — a user with flour-covered hands mid-recipe is not politely waiting for the assistant to finish a sentence before reacting to something on the stove, and a voice assistant that either can't be interrupted cleanly or restarts its entire response after being cut off creates real friction precisely at the moment the user most needs a fast, situational answer, not a full replay of information they already partly heard. The instruction against making the user repeat already-given information addresses a specific credibility cost unique to sustained voice interaction: a typed chat interface visibly shows the whole conversation history, so a redundant question reads as a minor annoyance the user can just glance up and reference, but a spoken assistant that asks something already answered moments ago reads as not actually listening, which erodes trust in the assistant's competence far faster in voice than the equivalent slip would in text. The requirement for a specific, low-effort correction phrase matters because correcting a misunderstanding by voice while distracted is measurably harder than typing a correction, there's no edit-and-resend, no visible transcript to point at, so a correction path that requires a multi-turn clarifying exchange imposes a real cognitive cost exactly when the user has the least attention to spare for it. Making the hard constraints override tone rather than compete with it matters because a persona explicitly designed to sound warm, natural, and accommodating creates real pressure, in the moment, to just agree with a reasonable-sounding request, and a brief that treats the constraint as one more consideration to balance against sounding helpful, rather than as something that simply wins the conflict outright, leaves exactly the gap where a warm, agreeable persona talks itself into the one thing it was never supposed to do.",
    verifiedAgainst: [
      { tool: 'Grok Voice Mode', version: 'Grok 4.1', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Grok Voice Mode on Grok 4.1.',
      },
    ],
  },
  {
    slug: 'grok-x-customer-complaint-reply-drafts',
    category: 'grok',
    title: 'Draft real, on-brand replies to actual complaints Grok found on X',
    description:
      'Finds specific, current customer complaints about a brand on X and drafts individually tailored, policy-compliant reply options for each one, instead of a single generic apology template stretched across every complaint.',
    promptText: `You are finding specific, current customer complaints about a brand on X using Grok's live post access, and drafting a tailored reply option for each one — not a single generic apology template that gets pasted under every complaint regardless of what it actually says. A complaint about a billing error and a complaint about a rude support interaction need genuinely different replies, not the same we're-sorry-to-hear-this line with the specifics swapped out.

BRAND
{{brand}}

TIME WINDOW
{{time_window}}

BRAND VOICE AND ESCALATION POLICY
{{voice_and_policy}}

WHAT THE REPLY CANNOT DO
{{reply_constraints}}

PRIORITIZATION CRITERIA
{{prioritization_criteria}}

REPLY RULES
Find complaints specifically, not general mentions — a complaint has a clear grievance and often an implicit or explicit ask, while a neutral or mixed mention does not need a reply drafted for it at all, so filter for the former before drafting anything. Read each complaint's specific content closely enough that the drafted reply responds to what was actually said, not to the general category of complaint it belongs to — if the complaint names a specific order number, a specific interaction, or a specific broken feature, the reply should reference that specific detail, not a generic acknowledgment that could apply to any complaint of that type. Match the reply's tone and length to the platform and the specific complaint's intensity — a brief, calm complaint gets a brief, calm reply; a complaint written in visible frustration gets a reply that actually acknowledges the frustration in its opening line rather than jumping straight to a procedural next step, since a purely procedural reply to visible anger reads as tone-deaf regardless of how correct the procedure itself is. Never draft a reply that makes a commitment the brand voice and escalation policy doesn't actually authorize — a refund promise, a guarantee about resolution timing, an admission of fault on a matter that's still being investigated — and where the honest answer requires escalating to a private channel rather than resolving publicly, the drafted reply should say that plainly rather than pretending the public reply itself resolves anything. Respect every item in the reply constraints list as an absolute boundary, not a style preference to be weighed against sounding maximally reassuring in the moment. Prioritize which complaints get a reply drafted first using the stated criteria — visibility, severity, how long it's been unanswered — rather than working through them in whatever order they happened to surface in the search, since a support or comms team acting on this output needs the most urgent ones addressed first, not the easiest ones to write a reply for.

OUTPUT FORMAT
1. A prioritized list of complaints found, each with the account (redacted if not public or verified), the complaint quoted, and the priority reason.
2. For each, a drafted reply, and a one-line note on why that specific tone and length were chosen for this complaint.
3. Any complaint you deliberately did not draft a public reply for because it needs private escalation instead, with a one-line reason.
4. Anything that came up in the search that didn't qualify as a complaint and was correctly excluded.`,
    variables: [
      {
        name: 'brand',
        description: 'The brand whose complaints are being found and replied to.',
        example: 'A mid-size meal-kit delivery service',
        required: true,
      },
      {
        name: 'time_window',
        description: 'The window of live complaints to search.',
        example: 'Past 24 hours',
        required: true,
      },
      {
        name: 'voice_and_policy',
        description: "The brand's voice guidelines and escalation rules.",
        example:
          'Warm, first-name, no corporate jargon; escalation policy says any complaint mentioning a missing or spoiled delivery must move to DM or a private channel, never resolved with a public promise of a specific refund amount',
        required: true,
      },
      {
        name: 'reply_constraints',
        description: 'What a reply is absolutely never allowed to say.',
        example:
          "Never promise a specific refund amount or timeline in a public reply; never confirm or deny an operational detail, like which supplier caused an issue, that hasn't been internally confirmed",
        required: true,
      },
      {
        name: 'prioritization_criteria',
        description: 'How to rank which complaints get addressed first.',
        example:
          'Complaints from accounts with visible follower counts over 5,000 first, then complaints mentioning food safety specifically, then everything else by how long it’s gone unanswered',
        required: true,
      },
    ],
    targetTools: ['Grok', 'Grok on X'],
    tags: [
      'customer-service',
      'social-media-management',
      'community-management',
      'x-twitter',
      'brand-voice',
    ],
    whyItWorks:
      "Requiring the reply to reference the complaint's actual specific content, rather than its general category, targets the exact quality gap that makes AI-drafted customer-service replies detectable and, worse, feel dismissive to the person receiving them — a reply that could be pasted under any complaint of the same type signals to the complainer that nobody actually read what they wrote, which frequently escalates a frustrated customer into an angrier one, turning a service recovery opportunity into a second, public grievance about being ignored. Matching reply tone to the complaint's actual visible intensity, rather than a uniform calm-and-professional register for everything, reflects a real and well-documented service-recovery principle: a purely procedural response to a visibly angry complaint reads as tone-deaf regardless of how technically correct the procedure is, because it skips the acknowledgment step the complainer is actually looking for before they're ready to hear the resolution steps at all. The absolute restriction against unauthorized commitments, a specific refund figure, a timeline, an admission of fault mid-investigation, matters because a public reply on X is a durable, screenshottable, quotable artifact in a way a private support ticket is not, and a drafted reply that promises something the brand's actual policy hasn't authorized creates a real commitment the company is now on the record for, regardless of whether a human ever reviewed the draft before it was used verbatim. Requiring escalation-worthy complaints to be flagged rather than answered publicly reflects the specific reason escalation policies exist in the first place: a food-safety complaint resolved with a reassuring-sounding public reply looks, to every other person who sees it, like the matter is handled, which can suppress exactly the kind of follow-up scrutiny a real safety issue needs, so the policy boundary has to survive contact with a draft that's otherwise been optimized to sound maximally warm and resolving. The prioritization-by-stated-criteria requirement, rather than search-order default, matters because live search surfaces complaints in whatever order they're found, which has no relationship to actual business urgency, and a support team working through a list of drafted replies needs the high-visibility, high-severity items addressed first, not a technically complete but practically misordered output that undersells its own usefulness under real time pressure.",
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-08-04' }],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against Grok 4.1 with live X complaint search.',
      },
    ],
  },
  {
    slug: 'grok-narrative-vs-crowd-sentiment-gap',
    category: 'grok',
    title: 'Check the gap between the official announcement and what X actually thinks',
    description:
      'Compares an official press release or announcement against the live, unfiltered crowd reaction on X to surface where the two genuinely diverge, instead of assuming public reaction simply mirrors whatever the announcement claimed.',
    promptText: `You are checking the gap between an official announcement and the live public reaction to it on X, using Grok's real-time post access. The point of this exercise is specifically to find where the crowd's actual read diverges from the announcement's own framing — if you find that public reaction simply restates the announcement's talking points with no gap at all, say that plainly, but check hard for a real gap before concluding there isn't one.

THE ANNOUNCEMENT
{{the_announcement}}

TIME SINCE IT WENT OUT
{{time_since_announcement}}

WHAT THE ANNOUNCEMENT CLAIMS OR IMPLIES
{{announcement_claims}}

WHO IS REACTING
{{reacting_audience}}

WHY THIS GAP CHECK MATTERS NOW
{{why_now}}

GAP-CHECK RULES
Read the announcement closely enough to separate its factual claims from its framing and implied narrative — a press release stating a specific fact is different from the narrative wrapped around that fact, such as a claim that customers have been asking for this and are thrilled, and the gap you're looking for is much more often in the second part than the first, since the factual claim is usually true while the surrounding narrative is where a real disconnect from actual reaction tends to live. Search live X reaction specifically among {{reacting_audience}}, not the general public, since a genuine gap-check needs reaction from the people the announcement was actually aimed at or actually affects, not an unrelated general audience that has no real stake in the announcement's content and may not even be discussing it. Distinguish reaction to the substance of the announcement from reaction to how it was delivered — some of the sharpest public pushback to an announcement is about tone, timing, or delivery choices rather than disagreement with the actual content, and conflating the two produces a confused read on what the actual gap is about. Quote specific posts as evidence for the gap you identify — a claimed disconnect between narrative and reaction needs the same evidentiary standard as any other sentiment claim, not an impression stated with confidence but nothing backing it. If reaction is genuinely mixed rather than clearly landing on one side of the gap, report it as mixed with the actual split named, rather than picking whichever side makes for a cleaner-sounding finding. Note explicitly if the reaction is still forming — {{time_since_announcement}} might be too recent for a stable read — and say so rather than presenting an early, still-shifting reaction as a settled verdict on how this landed.

OUTPUT FORMAT
1. The announcement's core factual claim versus its surrounding narrative framing, stated separately.
2. The actual crowd reaction found, quoted, from {{reacting_audience}} specifically.
3. Where the gap is, if there is one: substance, delivery, or both, stated explicitly with supporting quotes.
4. If reaction is genuinely mixed or still forming, say so plainly rather than forcing a clean verdict.
5. One sentence on what this gap, if real, actually implies for whoever needs to act on {{why_now}}.`,
    variables: [
      {
        name: 'the_announcement',
        description: 'The specific official announcement being checked.',
        example:
          "A company's press release announcing a redesigned pricing structure, framed as simpler and more transparent based on direct customer feedback",
        required: true,
      },
      {
        name: 'time_since_announcement',
        description: 'How long it has been since the announcement went out.',
        example: 'About 4 hours',
        required: true,
      },
      {
        name: 'announcement_claims',
        description: 'The specific things the announcement claims or implies.',
        example:
          'That the new pricing is simpler, more transparent, and was directly requested by customers',
        required: true,
      },
      {
        name: 'reacting_audience',
        description: 'The specific audience whose reaction actually matters here.',
        example:
          'Current paying customers of this specific product, identifiable by posts referencing their actual account or usage, not general commentary accounts discussing pricing strategy in the abstract',
        required: true,
      },
      {
        name: 'why_now',
        description: 'What decision this gap-check is feeding, and by when.',
        example:
          'The comms team needs to know before end of day whether to prepare a follow-up clarification post or whether the current messaging is landing fine as-is',
        required: true,
      },
    ],
    targetTools: ['Grok', 'Grok on X'],
    tags: [
      'sentiment-analysis',
      'crisis-communications',
      'real-time-monitoring',
      'x-twitter',
      'brand-monitoring',
    ],
    whyItWorks:
      "Separating an announcement's factual claim from its surrounding narrative framing is the structural move that makes this kind of gap-check actually findable rather than a vague comparison of positive tone versus reaction — a company's factual claim is nearly always accurate, so a gap-check that doesn't split framing from fact will usually find no disconnect at the factual layer and wrongly conclude the announcement landed fine, missing the much more common real gap, which lives specifically in a narrative claim like customers asked for this running headlong into a comment section full of customers saying they didn't. Restricting the search to the specific reacting audience named, rather than general public sentiment, matters because an announcement aimed at existing customers can generate completely different reactions from that group than from commentators, competitors, or unrelated accounts weighing in on the topic in the abstract, and a gap-check that can't tell these audiences apart risks reporting outside noise as if it were the actual affected population's verdict — Grok's live X access is what makes filtering to a specific, identifiable audience segment possible at all, rather than reading whatever the loudest accounts happen to be saying. Distinguishing reaction to substance from reaction to delivery targets a real and common confusion in how public pushback gets interpreted: an announcement can be substantively fine and still generate sharp reaction purely because of tone or timing, and treating both kinds of pushback as evidence against the substance itself leads to fixing the wrong problem. The explicit instruction to report mixed reaction as mixed, rather than forcing a clean verdict, and to flag when a reaction is still forming rather than settled, matters because both a false clean verdict and a premature settled-verdict claim lead a comms team to the same bad outcome: acting confidently on a read of public sentiment that isn't actually as clear or as final as it's being presented, at the exact moment, hours into a fast-moving reaction, when that overconfidence costs the most.",
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-08-05' }],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Grok 4.1 with live, audience-filtered X search.',
      },
    ],
  },
  {
    slug: 'grok-niche-x-community-daily-digest',
    category: 'grok',
    title: "Build a daily X digest for one niche that's actually worth reading",
    description:
      "Structures a recurring daily digest of a specific niche's real X conversation, ranked by genuine relevance to a stated interest rather than raw engagement, so it reads as a briefing worth five minutes instead of a list of whatever went viral for unrelated reasons.",
    promptText: `You are building a daily digest of one specific niche's X conversation, using Grok's live post access, for someone who wants to stay current in this niche without scrolling the platform themselves. The bar for inclusion is genuine relevance to the stated interest, not raw engagement — a post that went viral for reasons unrelated to this niche's actual substance does not belong in this digest just because the numbers were big.

NICHE
{{niche}}

SPECIFIC INTEREST WITHIN THE NICHE
{{specific_interest}}

TIME WINDOW
{{time_window}}

WHO THIS DIGEST IS FOR
{{reader_context}}

DIGEST LENGTH TARGET
{{length_target}}

DIGEST RULES
Search live X conversation within {{niche}} over {{time_window}}, and filter for genuine substance relevant to {{specific_interest}} specifically, not just anything tagged with the niche's common hashtags — a niche's hashtag gets used by promotional accounts, unrelated meme content, and genuine substantive discussion all at once, and this digest exists specifically to do the filtering a raw hashtag search doesn't do. Prioritize by actual relevance and information value to {{reader_context}}, not by like or repost count — a post with modest engagement from a credible, specialized account inside the niche is often more valuable to include than a post with ten times the engagement from an account with no track record in this specific area, and ranking by raw numbers alone would systematically surface the latter over the former. Group related posts into one digest item rather than listing each individually — if three accounts are discussing the same specific development, that's one story with three sources, not three separate digest entries, and treating it as three inflates the digest's apparent length without adding real information. Include a brief note of why each item matters to {{specific_interest}}, not just what was said — a digest that only restates content without connecting it to the reader's actual stated interest requires the reader to do the relevance-judgment work themselves, which defeats the point of a curated digest. Respect the stated length target strictly — a digest that runs long because everything found seemed worth including has failed at the actual curation task, which is choosing what's genuinely worth five minutes of someone's attention, not reporting everything that technically qualified. If the window was genuinely quiet for this niche, say so directly rather than padding the digest with marginal items to hit the length target.

OUTPUT FORMAT
1. {{length_target}}-appropriate number of digest items, each with: what happened, why it matters to {{specific_interest}}, and the source post or posts it's drawn from.
2. Ordered by relevance to the stated interest, most important first.
3. A one-line note if the window was quiet and the digest is intentionally shorter than the target as a result.`,
    variables: [
      {
        name: 'niche',
        description:
          'The specific niche or community whose conversation is being tracked.',
        example:
          'Applied machine learning research shared informally on X, not published papers',
        required: true,
      },
      {
        name: 'specific_interest',
        description:
          'The narrower interest within the niche that filters what counts as relevant.',
        example:
          'Practical findings about running smaller open-weight models efficiently on consumer hardware, specifically quantization and inference-speed tricks',
        required: true,
      },
      {
        name: 'time_window',
        description: 'The window of live conversation to digest.',
        example: 'Past 24 hours',
        required: true,
      },
      {
        name: 'reader_context',
        description: 'Who is reading this digest and what they actually need from it.',
        example:
          'An independent developer who wants a five-minute daily catch-up before starting work, not a research literature review',
        required: true,
      },
      {
        name: 'length_target',
        description:
          'The strict target for how many items and roughly how long the digest should be.',
        example: '3 to 5 items, roughly 400 words total',
        required: true,
      },
    ],
    targetTools: ['Grok', 'Grok on X'],
    tags: [
      'content-curation',
      'daily-digest',
      'x-twitter',
      'real-time-monitoring',
      'research-tracking',
    ],
    whyItWorks:
      "Filtering for substance relevant to the specific stated interest, rather than everything tagged with the niche's common hashtags, addresses a real and specific noise problem on X: a niche hashtag is used simultaneously by genuine practitioners, accounts posting for engagement inside a popular tag, and promotional content riding the same tag for visibility, and a raw hashtag pull mixes all three together with no way to tell them apart — the filtering this digest does is the actual value-add over a user just searching the hashtag themselves, and skipping that filter turns the digest into something no more useful than the raw search it was meant to replace. Ranking by relevance and source credibility rather than engagement count targets a specific and well-known distortion of platform metrics: engagement numbers reward whatever the platform's distribution mechanics happen to amplify at a given moment, which correlates only loosely with actual information value inside a specialized niche, and a digest that defaults to whatever got the most likes will systematically promote whatever's broadly accessible or provocative over a quieter, more technically substantive post from a specialist account with a smaller but more credible following. Grouping related posts into one item rather than several matters because live X conversation about one development frequently spreads across multiple accounts discussing the same thing from slightly different angles, and a digest that treats each as a separate entry inflates its own apparent thoroughness while actually giving the reader multiple restatements of one piece of information dressed up as several. Requiring a stated reason each item matters to the specific interest, not just a restatement of content, is what turns a link list into an actual digest — without that connective layer, the reader still has to do the work of figuring out why something's included, which is exactly the cognitive labor a curated digest exists to remove. The hard length-target discipline, including the explicit permission to run short on a quiet day, matters because the primary way an AI-generated digest fails its own purpose is by padding to look comprehensive, and a five-minute daily briefing that quietly becomes fifteen minutes because everything technically qualified has stopped being the low-effort daily habit it was designed to be, while a real information-quiet day handled honestly, with a short digest and a note saying why, keeps the format trustworthy on the days that do have real substance to report.",
    exampleOutput: `1. Several independent posts (3 accounts) converged on a specific 4-bit quantization technique showing meaningfully less quality loss than the common baseline on a 7B-class model when run locally — matters directly to your interest since it's a concrete, testable trick for consumer-hardware inference, not just a benchmark claim. Sourced from three separate threads discussing the same technique with slightly different test setups.

2. One detailed post from a developer with a track record in this space benchmarking inference speed across three consumer GPU tiers for the same model size — useful as a rough hardware-expectation baseline before you try it yourself.

3. A shorter, single-source note about a memory-mapping trick for loading larger models with less peak RAM — smaller finding, included because it's directly actionable, not because of engagement, since this post only had modest reach.

Window note: relatively quiet 24 hours for this specific interest beyond these three — no padding added to reach five items.`,
    verifiedAgainst: [{ tool: 'Grok', version: 'Grok 4.1', date: '2026-08-06' }],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Grok 4.1 with live, niche-filtered X search.',
      },
    ],
  },
]
