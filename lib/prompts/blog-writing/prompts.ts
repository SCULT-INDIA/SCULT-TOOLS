import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'blog-writing-search-intent-outline',
    category: 'blog-writing',
    title: 'Build an outline that matches what the SERP is actually rewarding',
    description:
      'Turns a target keyword and notes on the top-ranking pages into a search-intent-driven outline — the sections, order, and depth the SERP is actually rewarding, sized to a real word count instead of a generic template.',
    promptText: `You are building a blog post outline for a specific keyword, based on what is actually ranking for it right now — not a generic listicle-of-headings template applied to any topic. The outline is the argument for why this post deserves to exist next to what's already there, not a restatement of it.

TARGET KEYWORD
{{target_keyword}}

SEARCH INTENT
{{search_intent}}

WHAT THE TOP-RANKING PAGES ARE ALREADY COVERING
{{serp_notes}}

AUDIENCE
{{audience}}

THIS POST'S DIFFERENTIATION ANGLE
{{differentiation_angle}}

TARGET LENGTH
{{word_count_target}}

OUTLINING RULES
Classify the search intent precisely before outlining anything — informational, commercial-investigation, transactional, or navigational — because the wrong classification produces a structurally wrong outline no amount of good writing later fixes: a commercial-investigation query wants a comparison structure with named alternatives and a decision framework, not a single-product deep dive, and treating it as informational produces a post that answers a question nobody who typed this phrase was actually asking. Read the SERP notes as a floor, not a ceiling: identify every subtopic the ranking pages already cover in common — that is the baseline this post must at least match to be considered complete by anyone comparing it side by side — and then identify what none of them cover well, which is where the differentiation angle actually has to land, woven into the sections that need it most, not bolted on as an extra section at the end. Do not propose a heading structure that copies the ranking pages' order for the sake of matching a "proven" structure; if the differentiation angle changes what should come first, put it first, and say explicitly why the reordering is deliberate rather than an oversight. Every H2 needs a one-line note underneath it stating the specific question that section answers, and for any section that overlaps with what the SERP notes already described, the specific way this post's version differs — a statistic none of them cite, a real example, a more current constraint the ranking pages predate. Size each section proportionally to the target length: a 1,800-word outline with nine H2s is nine underdeveloped stubs, not nine complete arguments — cut the section count to what can actually earn full paragraphs, and merge or drop anything that would otherwise be padding. Flag anywhere the differentiation angle is too thin to sustain a full section on its own — a single anecdote is not a section, it is a supporting detail inside one — rather than inflating it into its own H2 to make the outline look more substantial than the material supports.

OUTPUT FORMAT
1. One sentence stating the classified search intent and what that classification rules out structurally.
2. The full outline: H1, then each H2 with its "answers this question" note and its differentiation note where applicable.
3. A short list of what the top-ranking pages cover that this outline deliberately excludes, and why leaving it out doesn't leave the post incomplete.
4. Any section flagged as too thin to justify its own heading, with a note on where it should be folded in instead.`,
    variables: [
      {
        name: 'target_keyword',
        description: 'The exact keyword or query this post is built to satisfy.',
        example: 'best project management software for remote teams',
        required: true,
      },
      {
        name: 'search_intent',
        description: 'Your read on what someone typing this query actually wants.',
        example:
          'Commercial-investigation — they are actively comparing 3-5 tools before a trial signup, not looking for a definition of project management.',
        required: true,
      },
      {
        name: 'serp_notes',
        description:
          'Notes on the top 5-10 ranking pages: their headings, format, and angle.',
        example:
          'Top 6 results are all "10 best tools" listicles covering Asana, Monday, ClickUp, Notion, Trello, Linear — most include a comparison table and a "how we picked" methodology section, none mention async-first remote teams specifically.',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who is searching and how much they already know.',
        example:
          'Ops leads at 20-80 person fully-remote startups, already know the major tool names, shopping on price and async-collaboration features specifically.',
        required: true,
      },
      {
        name: 'differentiation_angle',
        description: 'What this post brings that the ranking pages do not.',
        example:
          'We surveyed 40 remote ops leads on which feature actually caused churn from their previous tool — original data none of the ranking pages have.',
        required: true,
      },
      {
        name: 'word_count_target',
        description: 'The real length this post is being commissioned at.',
        example: '2,000-2,400 words',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'content-outline',
      'search-intent',
      'seo-writing',
      'competitive-analysis',
      'content-planning',
      'serp-analysis',
    ],
    whyItWorks:
      "Classifying search intent before outlining anything is load-bearing because intent determines the outline's shape, not just its tone: ranking behavior visibly rewards structure that matches intent — a commercial-investigation query pulls comparison tables and named-alternative pages into the top results, an informational query pulls single-subject explainers — and an outline built for the wrong intent class can be well-researched and well-written and still structurally unable to satisfy the query, a failure no later editing pass fixes because the shape was wrong from the outline stage forward. Treating the SERP notes as a floor rather than a ceiling protects against the two opposite and equally common outlining failures: an outline that ignores what's already ranking and skips subtopics every competing page covers reads as incomplete to anyone comparing tabs side by side, while an outline that copies the existing structure wholesale produces a post with nothing left to differentiate it, since it already spent its structure matching what exists. Tying section count and depth to the stated word-count target directly targets a specific and common outlining failure: defaulting to seven or nine generic H2s regardless of how long the post is actually supposed to be, which looks thorough on the page but, once drafted, yields underdeveloped 150-word stubs instead of fewer sections that can each carry a real argument — a difference a reader notices immediately as the post trying to look comprehensive rather than actually being it. Requiring a differentiation note on the specific sections it applies to, rather than accepting one \"unique angle\" section bolted onto the end, is what makes the differentiation register as expertise instead of decoration: a post's one genuinely original section surrounded by eight sections restating the same ground as everyone else's page still reads, to a skimming human and to a ranking system parsing the whole document, as the same page as the others plus a footnote. Finally, forcing an explicit call on which of the ranking pages' subtopics get deliberately excluded, rather than silently omitting them, keeps that decision visible and defensible instead of quietly leaving a gap someone reviewing the outline against the competition would flag anyway, just later and after the draft is already written around it.",
    exampleOutput: `Intent: commercial-investigation — rules out a single-tool deep dive or a "what is project management" explainer structure.

H1: The Project Management Tools Remote Ops Leads Actually Keep Using
- H2: What every remote team needs that office-based comparisons skip (answers: why generic PM roundups mislead remote buyers) — differentiation: opens with the churn-survey data none of the competing pages have
- H2: The 6 tools compared on async collaboration, not just feature checklists (answers: how do these tools differ specifically for async work)
- H2: Where teams actually switched away, and why (answers: what caused churn) — differentiation: original survey data throughout
- H2: Pricing at the size that matters — 20 to 80 people (answers: what does this actually cost at our scale)

Excluded: a "history of project management software" section every top-3 result includes — cut, since it does nothing for a buyer already comparing named tools.

Flagged: "integrations" was considered as its own H2 but the source material only supports one paragraph — folded into the tool-comparison section instead.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-07-22' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-full-draft-from-outline',
    category: 'blog-writing',
    title: 'Draft a full post from an outline without losing the point of view',
    description:
      'Turns an approved outline plus real source material into a full draft that argues something specific and keeps one throughline, flagging where the source material ran short instead of inventing facts to fill the gap.',
    promptText: `You are drafting a full blog post from an approved outline. Your job is to write the argument the outline sketched, not just fill in prose under each heading — every section should advance the same point of view, and nothing in the draft should be invented to cover a gap the source material didn't actually fill.

APPROVED OUTLINE
{{outline}}

SOURCE MATERIAL
{{source_material}}

POINT OF VIEW / THESIS
{{point_of_view}}

AUDIENCE
{{audience}}

TONE REFERENCE
{{tone_reference}}

TARGET LENGTH
{{target_word_count}}

DRAFTING RULES
Follow the outline's heading order and structure unless a specific problem with it surfaces while drafting — if you deviate, say so explicitly rather than silently reorganizing. Every factual claim, statistic, or specific example in the draft must trace back to something in the source material; if a section in the outline needs a supporting fact the source material doesn't contain, write the section around what you do have and flag the gap explicitly rather than inventing a plausible-sounding statistic, example, or quote to fill it — a fabricated detail that reads smoothly is a worse outcome than an honestly incomplete section, because the incomplete section gets caught before publish and the fabricated one usually doesn't. Keep the stated point of view as the connective tissue running through every section, not just something mentioned in the intro and abandoned — each section should either advance the thesis, provide evidence for it, or address a complication to it; a section that could be dropped into a completely different post arguing the opposite thesis without needing a single word changed is a sign the point of view didn't actually make it into that section. Match the tone reference at the sentence level — its actual sentence length pattern, contraction use, and directness — not just an adjective summary of it; two drafts both aiming for "conversational but authoritative" can sound completely different depending on how that gets executed, so anchor to the actual reference text, not the label. Vary sentence length and paragraph rhythm deliberately; a draft where every paragraph runs three sentences of similar length and structure is one of the most identifiable signs of an unedited AI draft, and it reads as monotonous even when every individual sentence is fine. End sections with a bridge into what comes next rather than a hard stop that reads as the model finishing a checklist item and moving on — the post should read as one continuous argument with headings as signposts, not eight independent mini-essays stapled together.

OUTPUT FORMAT
1. The full draft, formatted with the outline's headings.
2. A short list of every place a fact, example, or statistic was needed but the source material didn't support one — state exactly what's missing.
3. One sentence confirming which single thesis the whole draft argues, so an editor can check it against every section directly.`,
    variables: [
      {
        name: 'outline',
        description: 'The approved outline this draft must follow.',
        example:
          'H1: Why Your Onboarding Emails Are Getting Ignored. H2s: The 3 seconds you actually get, What "personalized" actually means in an inbox, The one metric that predicts unsubscribes, A 4-email sequence that held a 61% open rate.',
        required: true,
      },
      {
        name: 'source_material',
        description: 'The facts, data, and quotes this draft is allowed to draw from.',
        example:
          'Internal case study: client X redesigned their 4-email onboarding sequence in March, open rate went from 22% to 61% over the next quarter, unsubscribe rate dropped from 4.1% to 1.3%. No data on click-through rate available.',
        required: true,
      },
      {
        name: 'point_of_view',
        description: 'The actual stance or thesis the post is arguing.',
        example:
          'Most onboarding sequences fail because they front-load feature explanations instead of answering "why did I sign up" in the first email.',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who is reading and what they already know.',
        example:
          'B2B SaaS marketers who already run an onboarding sequence and are looking to fix underperformance, not build one from scratch.',
        required: true,
      },
      {
        name: 'tone_reference',
        description: 'A real sample passage whose voice this draft should match.',
        example:
          '"Most welcome emails read like a table of contents. Nobody signed up to read a table of contents — they signed up because something specific was broken." (short, declarative, contraction-heavy)',
        required: true,
      },
      {
        name: 'target_word_count',
        description: 'The real length this draft should land at.',
        example: '1,600-1,800 words',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'drafting',
      'long-form-writing',
      'point-of-view',
      'content-writing',
      'editorial-process',
    ],
    whyItWorks:
      'Requiring every fact to trace back to the source material, with an explicit flag instead of an invented fill-in, targets the specific failure mode that makes AI-assisted drafting risky for publishable content: a model asked to write a complete-sounding section will produce a plausible statistic or example to cover a gap rather than leave visible white space, and a plausible fabrication is strictly worse than an honest gap because the gap gets caught in editing while the fabrication often survives all the way to publish, where it becomes a factual claim under the publication\'s name. Treating the point of view as connective tissue rather than an intro-only mention addresses a specific and common defect in AI-drafted long-form content: sections that are individually competent but collectively directionless, because each one was generated somewhat independently against its own heading rather than against the running argument — the test named in the prompt, whether a section could be lifted into a post arguing the opposite thesis unchanged, is a concrete, checkable signal of exactly this failure rather than a vague appeal to "cohesion." Anchoring tone to an actual reference passage instead of an adjective label works because voice is a function of concrete, countable choices — sentence length, contraction frequency, how often a sentence starts with a conjunction — and two people (or two model runs) both told to write "conversational but authoritative" will produce measurably different prose, while both shown the same reference passage converge much closer to the same register, because there\'s now something specific to pattern-match against instead of an adjective every writer interprets differently. The explicit instruction to vary sentence and paragraph rhythm targets a documented, easily-spotted tell of unedited AI prose — a run of same-length sentences and same-length paragraphs that reads as metronomic rather than written by someone actually thinking through an argument — and naming it directly, rather than trusting general "good writing" instructions to prevent it, catches a pattern that otherwise survives to the final draft because no single sentence in isolation looks wrong; the problem is only visible in the aggregate rhythm across a paragraph or page.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-07-23' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-cut-ai-filler-edit-pass',
    category: 'blog-writing',
    title: 'Edit pass that strips AI-flavored filler without flattening the voice',
    description:
      'A targeted editing pass that hunts specific hedging, throat-clearing, and empty-transition patterns common in AI-drafted prose and replaces them with sentences that carry actual information, while leaving genuine voice and legitimate nuance intact.',
    promptText: `You are editing a draft to remove the specific patterns that make prose read as AI-generated filler, without flattening genuine voice or cutting nuance that reflects real uncertainty. This is a precision edit, not a rewrite — most sentences should stay recognizably the same; you are cutting dead weight, not reworking the piece.

DRAFT
{{draft_text}}

PHRASES ALREADY FLAGGED BY THE TEAM
{{flagged_phrases}}

VOICE TO PRESERVE
{{voice_reference}}

FACTS THAT MUST NOT CHANGE
{{facts_not_to_touch}}

CUT TARGET
{{cut_target}}

EDITING RULES
Hunt for these specific patterns and cut or rewrite every instance found, not just the ones on the flagged list: throat-clearing openers that delay the actual point ("In today's fast-paced world," "When it comes to X," "It's no secret that"); hedge-stacking, where a sentence piles up multiple soft qualifiers that individually might be fine but together signal the writer doesn't actually want to commit to the claim ("it's worth noting that in many cases, this can arguably..."); empty transition phrases that connect nothing ("That being said," "At the end of the day," "Needless to say"); triplet padding, where three near-synonymous adjectives or verbs appear in a row doing the work of one ("robust, reliable, and dependable"); nominalizations that bury the actual action in a noun ("the implementation of the strategy resulted in an improvement" instead of "the strategy improved X"); passive voice that hides who is actually doing something, unless the actor is genuinely unknown or irrelevant; vague intensifiers with no number behind them ("significantly," "dramatically," "a huge number of") where a real figure is available or could be flagged as missing; and the "not only X but also Y" formula, which reads as a rhetorical flourish the third time it appears in one piece even if it was fine the first time. For each cut, keep the underlying claim exactly as true as it was before — cutting a hedge is different from cutting the uncertainty it was expressing; if a sentence hedges because the underlying fact is genuinely uncertain, tighten the hedge to one clear qualifier instead of deleting the uncertainty altogether and making the claim sound more certain than it actually is. Never touch anything listed under facts that must not change, including exact figures, names, dates, and specific claims — a filler-cutting pass has no license to also "improve" a fact. Preserve deliberate repetition that's doing rhetorical work — anaphora, an intentional callback to an earlier line — and don't mistake it for the same padding you're cutting elsewhere; the difference is whether the repeated structure is building toward something or just restating.

OUTPUT FORMAT
1. The edited draft, in full.
2. A cut log: each specific phrase or pattern removed, mapped to which of the categories above it fell under.
3. Confirmation of the word count before and after, checked against the cut target.
4. Anything you left in that looked like filler but turned out to be doing real rhetorical work, and why you kept it.`,
    variables: [
      {
        name: 'draft_text',
        description: 'The draft to edit for AI-flavored filler.',
        example:
          'A 1,400-word draft about remote onboarding that opens with "In today\'s fast-paced digital landscape, it\'s no secret that companies are increasingly turning to..."',
        required: true,
      },
      {
        name: 'flagged_phrases',
        description: 'Specific phrases the team has already flagged as overused.',
        example:
          '"unlock the power of", "in today\'s fast-paced world", "it\'s important to note that"',
        required: false,
      },
      {
        name: 'voice_reference',
        description: 'A short passage representing the voice to preserve.',
        example:
          '"Most onboarding sequences fail in the first email, not the fourth." — short, direct, no hedging where the writer actually knows the answer.',
        required: true,
      },
      {
        name: 'facts_not_to_touch',
        description:
          'Specific figures, names, or claims that must survive the edit unchanged.',
        example:
          'The 61% open rate figure and the client name "redacted per NDA" must stay exactly as written.',
        required: true,
      },
      {
        name: 'cut_target',
        description: 'How much leaner the draft should get, if there is a target.',
        example:
          'Trim by at least 12% without losing any of the four required takeaways.',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'editing',
      'ai-detection',
      'copyediting',
      'content-quality',
      'line-editing',
      'voice-preservation',
    ],
    whyItWorks:
      'Naming the specific patterns — hedge-stacking, nominalizations, triplet padding, empty transitions — instead of giving a generic "make this sound less AI" instruction matters because those are the actual, checkable habits that make prose read as machine-generated, and a model asked to fix an unnamed problem tends to do a light pass that leaves most of the pattern intact, while a model given a specific pattern to hunt can actually find and count every instance of it. The rule to preserve the underlying claim\'s real level of certainty while cutting the hedge that expresses it is the difference between editing and quietly overstating: a sentence hedges because the writer is genuinely unsure, and simply deleting "it\'s worth noting that this can arguably" without addressing why it was there in the first place can leave a claim reading more confident than the evidence actually supports — the fix is tightening to one honest qualifier, not removing the qualification entirely, which is a distinction a blanket "cut hedging" instruction would miss. The explicit carve-out for facts that must not change is necessary because a filler-cutting pass and a fact-checking pass are different jobs with different failure modes, and a model given license to tighten prose will sometimes also "smooth" a specific figure into a rounder, more rhythmically pleasing number if nothing stops it — flagging exact figures as untouchable keeps the edit scoped to prose mechanics only. Distinguishing rhetorical repetition from padding repetition addresses a real risk of over-correction: a pattern-matching edit that treats every instance of a repeated phrase as filler will also strip out a deliberate callback or anaphora a writer used on purpose, which is a net loss even though it technically matches the same surface pattern being hunted elsewhere — the instruction to check whether a repetition is "building toward something" gives the model an actual test to apply rather than a blanket rule that would remove legitimate craft along with the filler it\'s supposed to be cutting.',
    exampleOutput: `Cut log:
- "In today's fast-paced digital landscape, it's no secret that" → deleted, throat-clearing opener. Replaced with the actual first claim of the paragraph.
- "robust, reliable, and dependable onboarding flow" → "a reliable onboarding flow", triplet padding.
- "the implementation of a revised sequence resulted in an improvement in open rates" → "the revised sequence lifted open rates", nominalization.
- "significantly increased" (no number given) → flagged, not cut — no figure was available in source material to replace it with; left as a gap for the writer to fill rather than invented.

Word count: 1,412 → 1,238 (12.3% cut, target met).

Kept: the repeated line "most sequences fail in the first email" appears twice — once in the intro, once in the conclusion — kept as a deliberate callback, not padding.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-07-24' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'blog-writing-headline-ctr-mechanics',
    category: 'blog-writing',
    title: 'Write headlines built on real click mechanics, not clickbait',
    description:
      'Generates headline options grounded in specificity and an honest curiosity gap rather than superlative inflation, checked against character limits and against what competing SERP results are already saying.',
    promptText: `You are writing headline options for a blog post. The goal is a headline that earns the click by being specific and by opening a curiosity gap the article actually closes — not one that inflates with superlatives or teases something the post doesn't deliver.

TARGET KEYWORD
{{target_keyword}}

ANGLE OR PROMISE THE POST DELIVERS
{{angle_or_promise}}

AUDIENCE PAIN POINT
{{audience_pain_point}}

POST FORMAT
{{format_type}}

WHAT COMPETING HEADLINES ALREADY SAY
{{competing_headlines}}

BANNED WORDS OR PATTERNS
{{banned_patterns}}

HEADLINE RULES
Distinguish a genuine curiosity gap from clickbait: a curiosity gap is closable only by reading the post and the post genuinely closes it; clickbait opens a gap the post doesn't actually resolve, or resolves so thinly the reader feels cheated. Every headline should pass a simple test — could you write one sentence right now that satisfies the curiosity the headline opened, using only what the post's angle actually delivers? If not, the headline is overpromising. Prefer a concrete, specific detail over a vague superlative: a number, a named comparison, a timeframe, or a specific outcome does more real work than "ultimate," "best-ever," or "game-changing," which read as inflation because they carry no information a skeptical reader can check. Do not claim a superlative ("the only guide you need," "the definitive list") unless the angle or promise genuinely supports that specific claim — an unsupported superlative is the single fastest way to read as untrustworthy to an audience that has seen the same claim on ten other pages. Check the headline against what competing headlines already say: if every competing result already uses the same structure or the same stock phrase, using it again wins no differentiation in the SERP even if it's technically accurate — vary the structure enough to stand out visually in a list of ten blue links, without straying from what the post promises. Respect the banned words or patterns list literally, with no synonyms that reintroduce the same problem the ban was written to prevent. Produce one option that leads with the keyword near the front for search relevance and scannability, and at least one option optimized for a social share context instead, since a headline that works in a SERP snippet and one that works as a standalone social post are not always the same sentence — say which is which.

OUTPUT FORMAT
1. Five headline options, each under roughly 60 characters where intended for search, labeled by which specific mechanic each one uses (specificity, comparison, named number, contrarian framing, etc).
2. For each, the one-sentence answer to "what does this headline promise, exactly" — if you can't state it precisely, flag that option as too vague and don't include it in the final five.
3. A note on which option most directly differs in structure from the competing headlines listed above, and how.`,
    variables: [
      {
        name: 'target_keyword',
        description: 'The keyword this post targets.',
        example: 'how to reduce cart abandonment',
        required: true,
      },
      {
        name: 'angle_or_promise',
        description: 'What the post specifically delivers, in one sentence.',
        example:
          'A breakdown of the exact 5 checkout-flow changes that cut cart abandonment from 71% to 58% for a mid-size DTC store.',
        required: true,
      },
      {
        name: 'audience_pain_point',
        description: 'The specific frustration driving the search.',
        example:
          'Marketing lead has tried generic "add trust badges" advice already and needs something more specific.',
        required: true,
      },
      {
        name: 'format_type',
        description: 'The actual shape of the post — sets which mechanics apply.',
        example: 'Case-study-driven how-to, not a generic listicle',
        required: true,
      },
      {
        name: 'competing_headlines',
        description: 'What titles currently rank for this keyword.',
        example:
          '"11 Proven Ways to Reduce Cart Abandonment", "The Ultimate Guide to Cart Abandonment", "Cart Abandonment: Causes and Solutions"',
        required: true,
      },
      {
        name: 'banned_patterns',
        description: 'Words or structures the brand refuses to use in headlines.',
        example:
          'No "ultimate," no "game-changing," no bracketed year tags like "[2026]"',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['headlines', 'ctr-optimization', 'copywriting', 'seo-writing', 'titles'],
    whyItWorks:
      'The distinction between a genuine curiosity gap and clickbait is the actual mechanism behind why some specific headlines outperform vague superlative ones over time even when both get a comparable initial click: a headline that opens a gap the post doesn\'t close produces a fast bounce, which is a signal search engines and readers both eventually punish, while a headline whose promise the post actually delivers converts that click into time-on-page and, for a search engine watching aggregate behavior, a page that appears to satisfy the query it was clicked for. The "write the one sentence that satisfies the gap" test operationalizes this rather than leaving it to a vague sense of honesty — it forces a concrete check the model can actually run against the stated angle_or_promise, catching the specific failure mode where a headline promises "the secret to X" and the post underneath, when you try to state what that secret actually is in one sentence, turns out to have nothing that specific to offer. Preferring a checkable specific detail over an unsupported superlative targets a well-documented reader skepticism response: "ultimate," "best," and "game-changing" have been used on so many low-quality pages that they now function as a mild negative signal to an experienced searcher rather than a positive one, whereas a specific number or named comparison gives the reader something they can evaluate for plausibility before clicking, which paradoxically makes the specific claim more persuasive than the vague superlative it replaces. Checking against the actual competing headlines addresses a real and separate mechanic: in a results page of ten blue links, a headline structurally identical to three others directly above and below it does not stand out regardless of how good it is, and readers scanning a SERP process it as visually redundant before they ever get far enough to evaluate its content — deliberately varying structure against a known set of competitors is a differentiation move happening at the level of the results page itself, not just the sentence.',
    exampleOutput: `1. "We Changed 5 Checkout Steps and Cart Abandonment Dropped From 71% to 58%" (specificity — named number, real before/after)
2. "Why 'Add Trust Badges' Won't Fix Your Cart Abandonment Rate" (contrarian framing — targets the exact advice the audience already tried)
3. "The Cart Abandonment Fix That Isn't About Trust Badges or Free Shipping" (comparison — differentiates from generic-advice headlines directly)

Differs most from competitors: option 1 leads with a specific before/after figure where every competing headline uses a vague qualifier ("proven," "ultimate," "solutions") with no number attached at all.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-26' },
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Claude Sonnet 5).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-hook-introduction',
    category: 'blog-writing',
    title: 'Write an opening that earns the next sentence instead of restating the title',
    description:
      'Writes an introduction that states real stakes, uses a genuine piece of hook material honestly, and directly engages what the reader already believes — instead of the "In this article, we will discuss" formula.',
    promptText: `You are writing the introduction to a blog post. Its only job is to earn the reader's next sentence — not to restate the title, not to summarize the whole post before it's been read, and not to open with a throat-clearing statement about the general importance of the topic.

TITLE
{{title}}

THESIS
{{thesis}}

AUDIENCE
{{audience}}

WHERE THE READER IS STARTING FROM
{{reader_starting_point}}

HOOK MATERIAL AVAILABLE
{{hook_material}}

TARGET LENGTH
{{intro_length_target}}

INTRODUCTION RULES
Never open by restating the title in slightly different words — if the title already told the reader what this is about, the first sentence needs to do new work, not repeat old work. Skip every throat-clearing formula: no "In today's world," no "Have you ever wondered," no "In this article, we will explore" — a reader who clicked already decided the topic matters; the intro's job is to prove this specific post is worth their next thirty seconds, not to re-argue that the topic exists. State the real stakes early — what changes for the reader if they get this right versus wrong — using the actual thesis, not a generic claim that could sit atop any post on this general topic. Use the hook material honestly: if it's a statistic, use the real number, not a rounded or dramatized version of it; if it's a story or example, don't add specific details you don't actually have just to make it more vivid — a hook that's slightly fabricated to be punchier is a credibility risk the moment a reader who knows the real numbers notices the gap. Address where the reader is starting from directly — agree with it, complicate it, or contradict it — rather than writing an intro generic enough to open any post on this topic for any audience; an intro that doesn't engage what this specific reader already believes going in is doing no persuasive work at all. Promise something specific the post will deliver, not a vague benefit — "you'll leave with the actual number that predicted churn in our data," not "you'll learn everything you need to know." Land the thesis, or a clear pointer to it, before the introduction ends — a reader should be able to state roughly what this post argues before reaching the first H2, not have to guess until the conclusion.

OUTPUT FORMAT
1. The introduction, at the target length.
2. One sentence stating which mechanism it uses to hook (a stat, a contradiction of a common belief, a specific stake, a story) and why that mechanism fits this audience's starting point specifically.
3. Confirmation that every specific detail used in the hook traces to the hook material provided, with nothing added or dramatized beyond it.`,
    variables: [
      {
        name: 'title',
        description: 'The post title the intro sits under.',
        example: 'Your Onboarding Emails Are Getting Ignored — Here Is Why',
        required: true,
      },
      {
        name: 'thesis',
        description: 'What the post actually argues.',
        example:
          'Most onboarding sequences fail because they explain features in the first email instead of answering "why did I sign up."',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who is reading.',
        example:
          'B2B SaaS marketers who already run an onboarding sequence and assume the problem is subject lines, not sequencing.',
        required: true,
      },
      {
        name: 'reader_starting_point',
        description: 'What the reader likely already believes before reading.',
        example:
          'They believe their open rates are low because of weak subject lines and have already A/B tested several subject line variants with no improvement.',
        required: true,
      },
      {
        name: 'hook_material',
        description: 'A real stat, story, or claim available to open with.',
        example:
          "A client's open rate went from 22% to 61% after reordering the sequence — subject lines were never changed.",
        required: true,
      },
      {
        name: 'intro_length_target',
        description: 'How long the intro should run.',
        example: '3-4 short paragraphs, roughly 120-150 words',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'introductions',
      'hooks',
      'copywriting',
      'reader-engagement',
      'content-writing',
    ],
    whyItWorks:
      'Engaging where the reader is starting from, rather than writing an intro generic enough to sit atop any post on the topic, is the actual mechanism that makes an opening persuasive instead of merely present: an intro is doing real work only when it changes or confirms something the specific reader walked in believing, and a reader whose starting assumption — subject lines are the problem — gets directly named and complicated in the first paragraph is far more likely to keep reading than one shown a generic statement true of every onboarding-email post ever written, because the generic version gives them no reason to think this post knows anything about their specific situation. Banning the title restatement and the throat-clearing formula targets a real, well-documented reading behavior: a reader who clicked already made the decision that the topic matters, so an opening that re-establishes the topic\'s general importance is spending the reader\'s most valuable attention — the first few seconds after the click, when bounce risk is highest — on a case that\'s already been made, rather than on the one thing that actually needs proving now, which is that this specific post has something to say. Requiring the hook material to be used exactly as given, with no dramatized numbers or invented specific details, matters because a hook is functioning as a credibility signal as much as an attention device — the moment a reader who happens to know the real figure notices it\'s been rounded up or embellished, every subsequent claim in the post inherits that same suspicion, which is a worse outcome for the piece than a slightly less punchy but fully accurate hook would have been. Requiring the thesis to land, or be clearly pointed at, before the first H2 addresses a structural failure common in AI-drafted intros: a paragraph that builds atmosphere and stakes but never actually states what the post argues, leaving the reader to infer the thesis from context across several sections — asking for a version where a reader could state the thesis in their own words before the intro ends is a concrete test that catches this specific gap between "sounds like a good opening" and "actually tells the reader what this post is for."',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-07-25' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-cta-conclusion',
    category: 'blog-writing',
    title: 'Write a conclusion that moves the reader instead of just recapping',
    description:
      'Writes a closing section that resolves the one objection a reader is most likely still holding and points to a single next action, instead of re-listing the headings the reader just read.',
    promptText: `You are writing the conclusion to a blog post. Its job is to resolve the reader's most likely remaining doubt and point them toward one specific next action — not to summarize the headings they just finished reading.

POST THESIS
{{post_thesis}}

KEY TAKEAWAYS
{{key_takeaways}}

DESIRED NEXT ACTION
{{desired_next_action}}

OBJECTION STILL LINGERING
{{objection_still_lingering}}

TONE
{{tone}}

CONCLUSION RULES
Never open with "In conclusion," "To sum up," or a restatement of the H2 list in sentence form — a reader who just read the post does not need its headings read back to them, and a conclusion that does only that is the single most skippable paragraph on the page. Identify and directly resolve the objection still lingering — the specific doubt a reasonable reader would still have even after reading everything above, whether that's "this worked for them, but will it work for a team my size" or "this sounds like more work than we have time for" — and answer it in the conclusion's own words, don't just gesture at "as discussed above." State the desired next action once, clearly, framed as a natural continuation of the argument the post just made, not as an advertisement bolted onto an otherwise unrelated ending — the action should read like the obvious next step someone convinced by this post would take, not like a sponsor message inserted after the real content ended. Do not introduce a new unsupported claim in the conclusion that wasn't backed up somewhere in the body — a conclusion is not the place to reach for one more persuasive point that didn't earn its own section. Leave the reader with one specific, memorable line that reinforces the thesis in a form tighter than how it was first stated in the introduction — the conclusion gets to say the thesis better now that the reader has seen the evidence, not just repeat it. Keep the takeaways implicit in how the conclusion is written rather than listed out again as bullets unless the format specifically calls for a recap list — most posts don't need a second listing of what a reader who read the whole thing already has.

OUTPUT FORMAT
1. The conclusion, written in {{tone}}.
2. One sentence naming which specific objection it resolved and how.
3. Confirmation that the next action appears exactly once and reads as continuous with the argument, not inserted.`,
    variables: [
      {
        name: 'post_thesis',
        description: 'What the post argued.',
        example:
          'Reordering an onboarding sequence to answer "why did I sign up" first, before any feature explanation, fixes low open rates that subject-line testing can\'t.',
        required: true,
      },
      {
        name: 'key_takeaways',
        description: "The main points the post made, for the writer's reference only.",
        example:
          "First email should restate the reader's original problem; feature explanations belong in emails 2-3, not email 1; the case study saw open rate jump from 22% to 61%.",
        required: true,
      },
      {
        name: 'desired_next_action',
        description: 'What the reader should do after finishing this post.',
        example:
          'Open their current sequence and check what email 1 actually says versus what problem the signup page promised to solve.',
        required: true,
      },
      {
        name: 'objection_still_lingering',
        description:
          'The doubt a reasonable reader still has after reading the whole post.',
        example:
          'This is one case study — will reordering actually move the needle for a product with a longer, more technical onboarding flow?',
        required: true,
      },
      {
        name: 'tone',
        description: 'The register the conclusion should land in.',
        example:
          'Direct and slightly challenging, matching the rest of the post — not a soft, cheerleading wrap-up.',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'conclusions',
      'copywriting',
      'reader-engagement',
      'calls-to-action',
      'content-writing',
    ],
    whyItWorks:
      "Resolving the specific lingering objection, rather than closing with a generic recap, is the mechanism that makes a conclusion function as the argument's actual last move instead of its epilogue: a reader who finished the body with a real, specific doubt intact — will this work for my more technical product — has effectively not been fully persuaded yet, and a conclusion that skips past that doubt to a tidy summary leaves the persuasion job unfinished exactly at the last moment the writer had the reader's attention to finish it. Framing the next action as a continuation of the argument rather than an inserted CTA line targets a specific reader-trust cost: a call-to-action that reads as bolted-on marketing copy after the real content ended signals to the reader that the preceding argument existed partly to set up a pitch, which retroactively colors how they read everything above it, whereas a next action phrased as \"here's what someone convinced by this would naturally do\" doesn't carry that same tonal break because it's presented as advice continuing the piece's own logic, not a separate commercial ask layered on top of it. Banning new unsupported claims in the conclusion closes a specific structural gap: a conclusion is the one place in a post where a claim can slip in without the scrutiny an H2 section would get, since it reads as a wrap-up rather than new content, and readers are less likely to fact-check a closing line the same way they'd check a body paragraph — which is exactly why it's the wrong place to introduce anything that didn't already earn its keep with actual support earlier in the piece. Requiring the final thesis restatement to be tighter and sharper than the introduction's version, rather than a repeat of the same sentence, reflects a real asymmetry in what the reader knows at each point: the introduction stated the thesis to someone who hadn't seen the evidence yet, so it had to be provable-sounding but necessarily general, while the conclusion is stating the same thesis to someone who has now seen the case study, the mechanism, and the numbers — the sentence gets to compress all of that now, which is a genuinely different and more earned sentence, not a duplicate.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-07-26' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and Gemini (Gemini 3 Pro).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-transcript-to-post',
    category: 'blog-writing',
    title: 'Turn a raw webinar or interview transcript into a structured blog post',
    description:
      'Restructures a spoken transcript into a written argument built around its actual best insights rather than chronological order, keeping every direct quote verbatim and flagging anything that needs speaker confirmation before publish.',
    promptText: `You are converting a raw transcript — a webinar, podcast, or interview — into a structured blog post. Spoken language and written argument have different shapes; your job is to find the real structure inside the transcript's chronological mess, not just clean up the sentences in the order they were said.

TRANSCRIPT EXCERPT
{{transcript_excerpt}}

SPEAKER CREDENTIALS
{{speaker_credentials}}

KEY MOMENTS
{{key_moments}}

TARGET ANGLE
{{target_angle}}

AUDIENCE
{{audience}}

TARGET LENGTH
{{length_target}}

CONVERSION RULES
Identify the two or three actual best insights in the transcript based on the key moments flagged, and restructure the post around those, in whatever order builds the strongest written argument — not in the order they happened to come up in conversation, since a live talk's best point is often buried in an answer to an unrelated audience question near the end, and a post that follows chronological order will bury it there too. Strip filler that only exists because the source was spoken — false starts, "you know," "so, like I said," mid-sentence self-corrections — but preserve the actual substance and phrasing of what the speaker said whenever quoting them directly. When quoting the speaker, use their exact words, verbatim, without smoothing grammar or sharpening the phrasing to sound more polished — if a quote needs cleanup to be readable, either use "..." to mark an omission of filler words within it, or don't present it as a direct quote at all and instead attribute the idea to them in the surrounding prose. Add context the live audience had but a blog reader won't — a reference to a slide that isn't visible in text, a callback to something said ten minutes earlier ("as I mentioned") that a reader skimming the post has no way to have seen — spell out what was being referenced rather than leaving the callback dangling. Do not silently resolve an inaudible or ambiguous moment in the transcript by guessing what the speaker probably meant; flag it explicitly as needing speaker confirmation before publish, and write around it in a way that doesn't depend on the guessed content being correct. Credit the speaker using their actual stated credentials, not an inflated or vaguer version of them.

OUTPUT FORMAT
1. The structured post, with headings organized around the identified best insights, not the transcript's chronological order.
2. A short note on how the post's structure differs from the transcript's original order, and why the reordering serves the argument.
3. A list of every direct quote used, each one flagged as either verbatim or trimmed-with-ellipsis.
4. Anything flagged as needing speaker confirmation before publish, quoting the exact ambiguous or inaudible passage.`,
    variables: [
      {
        name: 'transcript_excerpt',
        description: 'The raw transcript text to work from.',
        example:
          'A 45-minute webinar transcript on API rate limiting, where the strongest concrete example — a specific incident where a naive retry loop caused a cascading outage — comes up in the Q&A at minute 38, not in the prepared talk.',
        required: true,
      },
      {
        name: 'speaker_credentials',
        description: 'How the speaker should actually be credited.',
        example:
          'Staff engineer at a payments company, led the incident response for the outage referenced in the talk',
        required: true,
      },
      {
        name: 'key_moments',
        description: 'The parts of the transcript worth building the post around.',
        example:
          "Minute 12 (why exponential backoff alone isn't enough), minute 38 (the cascading outage story from Q&A), minute 41 (the specific jitter formula they now use)",
        required: true,
      },
      {
        name: 'target_angle',
        description: 'The specific angle this post should take on the material.',
        example:
          'Framed as "the retry mistake that caused a real outage," not a general rate-limiting explainer.',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who is reading.',
        example:
          'Backend engineers who already know what rate limiting is and want the specific failure mode, not a 101 explainer.',
        required: true,
      },
      {
        name: 'length_target',
        description: 'The target length for the post.',
        example: '1,200-1,400 words',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'content-repurposing',
      'transcripts',
      'interviews',
      'editorial-process',
      'attribution',
    ],
    whyItWorks:
      "Restructuring around the identified best insights instead of chronological order addresses the core structural mismatch between a spoken talk and a written post: a live speaker builds toward points gradually, answers audience questions in whatever order they're asked, and often delivers their single best concrete example in response to a question near the end rather than in the prepared material — a transcript-to-post conversion that just cleans up sentences in original order inherits that same buried structure, producing a post where the strongest material is stuck in paragraph nine instead of leading the piece. The verbatim-quoting rule, with an explicit ellipsis convention for trimming filler rather than silent smoothing, matters because a quote attributed to a named, credentialed person carries a factual claim about what that person actually said — polishing a quote's grammar while still presenting it in quotation marks misrepresents the speaker's actual words under their own name, which is a different and more serious problem than simply writing awkward prose, and the ellipsis convention gives a legitimate way to remove genuine filler (\"um,\" a false start) without crossing into fabricating cleaner language the person didn't say. Explicitly flagging inaudible or ambiguous moments instead of guessing addresses a failure mode specific to transcript work that a general editing pass wouldn't catch: transcription errors and unclear audio are common, and a model asked to \"write a clean post from this transcript\" will often silently resolve an ambiguous phrase to whatever reading makes the surrounding sentence make sense grammatically, which can quietly put words in a real, named speaker's mouth that they never actually said — flagging it for confirmation instead keeps that risk visible rather than hidden inside otherwise-clean prose. Requiring context to be added for callbacks the original live audience had but a blog reader wouldn't (a reference to an unseen slide, an \"as I mentioned\" pointing at something said much earlier) targets a real comprehension gap: a talk's internal references work because the audience experienced the whole thing linearly and recently, while a blog reader may jump straight to a specific section, and an unresolved callback in text reads as a non sequitur rather than the natural echo it was in the room.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-07-27' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-content-brief-for-writer',
    category: 'blog-writing',
    title:
      'Turn an approved outline into a brief a freelance writer can execute without back-and-forth',
    description:
      'Converts an outline into a concrete content brief that specifies voice, required links, and rejection criteria in checkable terms, instead of vague adjectives a different writer would interpret a different way.',
    promptText: `You are turning an approved outline into a content brief for a freelance or contract writer who has not worked with this brand before. The brief's job is to answer every question the writer would otherwise have to ask, so the first draft comes back usable instead of needing a full rewrite.

APPROVED OUTLINE
{{outline}}

BRAND VOICE NOTES
{{brand_voice_notes}}

REQUIRED FACTS OR LINKS
{{must_include}}

SEO REQUIREMENTS
{{seo_requirements}}

EXAMPLES OF PAST POSTS THAT WORKED
{{examples_of_past_posts}}

DEADLINE AND LENGTH
{{deadline_and_length}}

BRIEF-WRITING RULES
State why this post exists and for whom in the first two lines — a writer who understands the actual goal makes better judgment calls on every sentence that follows than one just executing a heading list blind. Translate every voice adjective into something checkable: instead of "friendly, professional tone," specify what that actually means in sentence-level terms — contractions allowed or not, second person or third, how much humor, one real example sentence from a past post that hits the target register. Never leave a brand-voice instruction as an unqualified adjective a different writer could reasonably interpret three different ways; if the brand voice notes given are themselves vague, tighten them using the past-post examples as the actual reference. List every required fact, statistic, or link explicitly with where it should go and why it matters, not just "include relevant internal links" — a writer with no context on the site's link structure cannot make that call correctly, and guessing produces links that don't serve the actual SEO or user-journey goal. State the SEO requirements as specifics — target keyword, one or two secondary keywords, and roughly where each should naturally appear — not as an instruction to "optimize for SEO," which is unactionable without knowing what that means for this specific post. Give a real length range, not an approximate one — "1,500-1,800 words" is checkable, "around 1500ish" invites a draft that comes in at 900 or 2,400 and is technically not wrong. State explicitly what would get a draft sent back for revision — the specific, concrete criteria, not a vague "if it doesn't feel right" — so the writer knows the actual bar before submitting, not after missing it once.

OUTPUT FORMAT
A complete brief document with these sections in order: Why This Post Exists, Audience, Outline (as given), Voice (with the checkable specifics and one reference example), Required Facts/Links (each with placement), SEO Requirements, Length & Deadline, What Gets a Draft Sent Back.`,
    variables: [
      {
        name: 'outline',
        description: 'The approved outline this brief is built around.',
        example:
          "H1: The Onboarding Email Sequence That Doubled Our Open Rate. H2s: Why feature-first emails fail, The 4-email sequence we now use, The specific open-rate numbers, What we'd change next.",
        required: true,
      },
      {
        name: 'brand_voice_notes',
        description: 'How the brand currently describes its voice, however vague.',
        example:
          '"Direct, no fluff, a little irreverent — think a smart coworker explaining something, not a corporate blog."',
        required: true,
      },
      {
        name: 'must_include',
        description: 'Specific facts, stats, or links the draft must contain.',
        example:
          'Must link to the /email-sequence-builder tool page in the "4-email sequence" section, anchor text should describe the tool, not say "click here".',
        required: true,
      },
      {
        name: 'seo_requirements',
        description: 'The target and secondary keywords for this post.',
        example:
          'Primary: "onboarding email sequence". Secondary: "welcome email open rate", "email onboarding flow" — primary should appear in H1, first 100 words, and one H2.',
        required: true,
      },
      {
        name: 'examples_of_past_posts',
        description: 'A link or excerpt from a past post that nails the target voice.',
        example:
          'The "Why Your Trial Users Ghost You" post from March — same directness, same short-paragraph rhythm.',
        required: true,
      },
      {
        name: 'deadline_and_length',
        description: 'The real length range and delivery date.',
        example: '1,500-1,800 words, first draft due in 6 days',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'content-briefs',
      'freelance-writers',
      'editorial-process',
      'content-operations',
    ],
    whyItWorks:
      'Translating voice adjectives into checkable sentence-level specifics targets the single most common cause of a freelance draft coming back unusable: "friendly, professional" is a genuinely different instruction to different writers, and a brief that leaves it as an adjective outsources the actual voice decision to whoever\'s interpreting it that week, which produces inconsistent output across writers even when every individual writer followed the brief in good faith — anchoring to a real past-post example converts an ambiguous instruction into a pattern a writer can actually match against. Specifying required links with exact placement and purpose, rather than a general "include relevant internal links" instruction, matters because link placement decisions require context a new writer structurally doesn\'t have — which pages the site actually wants to send traffic to, which anchor text serves the SEO goal versus just describing the destination — and asking a writer without that context to "add relevant links" produces links that are relevant in a generic sense but don\'t serve the specific commercial or SEO purpose the brief-writer actually had in mind. Stating concrete rejection criteria up front, rather than discovering them only when a draft comes back wrong, changes the entire feedback loop\'s cost: a writer who knows the specific bar before writing can self-check against it, catching problems before submission, while a writer who only learns the bar from a rejected first draft has burned an entire revision cycle finding out information that could have been in the brief from the start — the difference between a one-round and a three-round editorial process on the exact same underlying quality bar. Stating a real length range instead of an approximate one closes a specific and avoidable gap: "around 1500ish" is compatible with both a 900-word draft and a 2,400-word draft, and a writer who hits either extreme has not technically violated the brief, which means the brief itself created the ambiguity the editor now has to resolve after the fact instead of before.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-07-28' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-serp-competitor-gap-analysis',
    category: 'blog-writing',
    title: 'Run a competitive gap analysis on the ranking pages before writing a word',
    description:
      'Audits the pages currently ranking for a target keyword to separate table-stakes coverage from genuine gaps, and gives an honest verdict on whether the keyword is even winnable before a draft gets commissioned.',
    promptText: `You are running a competitive gap analysis on a target keyword before any drafting starts. The goal is an honest verdict on what a new post would actually need to include to compete, and whether competing for this keyword is realistic at all given who already ranks — not a reflexive "here's how to beat them" without checking if that's true.

TARGET KEYWORD
{{target_keyword}}

COMPETITOR PAGES AND NOTES
{{competitor_notes}}

UNIQUE ASSETS AVAILABLE
{{unique_assets}}

SEARCH INTENT
{{search_intent}}

CONTEXT
{{refresh_or_new}}

ANALYSIS RULES
Catalog what's common across most of the ranking pages first — the subtopics, format elements, and depth level that appear in the majority of them. This is the table-stakes baseline: a new post missing any of it will read as thinner than the competition on a direct side-by-side comparison, regardless of how good its unique material is elsewhere. Separately catalog what's inconsistent or missing across the set — subtopics only one or two pages cover, angles nobody has taken, data nobody cites. This is where a genuine gap might exist, but confirm it's an actual gap and not just something every ranking page correctly judged unnecessary; not every omission is an opportunity. Check for a format mismatch: if most ranking pages use a table, a specific tool, an interactive element, or video, and the planned new post would be plain prose, name that mismatch explicitly, since matching table-stakes content while ignoring a format signal the query itself seems to reward is still a losing bet. Assess how current the competing pages actually are — outdated statistics, references to a deprecated product version, pricing that's since changed — since a specific, well-timed update can be a genuine advantage that has nothing to do with writing quality. Evaluate the ranking domains' evident authority for this specific topic, not just their general size — a page from a much larger site can still be beatable if it's clearly not the site's core subject area, while a page from a smaller but deeply specialized site can be a genuinely hard target to unseat regardless of how good a new post is. Give an honest verdict: state plainly whether this keyword looks winnable with the unique assets actually available, winnable but only with a specific format or authority investment beyond just better writing, or not realistically winnable right now — don't default to "yes, write a better post" as a reflexive answer when the notes don't actually support it.

OUTPUT FORMAT
1. Table-stakes checklist: what any competitive post here must include.
2. Genuine gaps found, each with a note on why it's a real opportunity and not a correctly-skipped non-issue.
3. Format or authority mismatches, if any.
4. The honest winnability verdict, stated in one direct paragraph.`,
    variables: [
      {
        name: 'target_keyword',
        description: 'The keyword being evaluated.',
        example: 'how to calculate customer acquisition cost',
        required: true,
      },
      {
        name: 'competitor_notes',
        description: 'Summaries of the top 5-10 ranking pages.',
        example:
          'Top 3 are from HubSpot, a well-known finance-SaaS blog, and a VC firm — all include a formula, a worked example, and a downloadable calculator; none address CAC specifically for usage-based pricing models.',
        required: true,
      },
      {
        name: 'unique_assets',
        description: 'What this post could bring that competitors do not have.',
        example:
          'Access to a real anonymized dataset of CAC benchmarks across 40 usage-based SaaS companies from an internal survey.',
        required: true,
      },
      {
        name: 'search_intent',
        description: 'What someone searching this actually wants.',
        example:
          'Informational with a calculation need — they want the formula and a way to apply it to their own numbers, not a product pitch.',
        required: true,
      },
      {
        name: 'refresh_or_new',
        description:
          'Whether this is a brand-new post or a refresh decision, and any relevant history.',
        example:
          'Considering a new post; the company has no existing page targeting this keyword today.',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: [
      'competitive-analysis',
      'content-strategy',
      'seo-research',
      'serp-analysis',
      'gap-analysis',
    ],
    whyItWorks:
      "Separating table-stakes coverage from genuine gaps addresses a common and expensive planning mistake: treating every subtopic the current top-ranking pages skip as an opportunity, when in reality most ranking pages skip the same things for the same good reason — they're out of scope, low-value, or actively confusing to include — and a differentiation angle built on a non-gap produces a section nobody wanted, dressed up as originality. Requiring a check on format mismatch, not just content depth, matters because a query's dominant ranking format is itself a signal about what that specific query rewards: if the pages ranking for a calculation-heavy keyword mostly ship an interactive calculator alongside their text, a well-written prose-only competitor is trying to win a fight it structurally can't win no matter how good the writing is, since it's competing on an axis — interactivity — that the format gap analysis exists specifically to surface before the writing investment gets made rather than after. The requirement for an honest winnability verdict, including the explicit permission to conclude a keyword isn't realistically winnable right now, targets a specific bias in how this kind of analysis usually gets requested: someone commissioning a competitive analysis has usually already decided to write the post, and a model that reflexively confirms winnability regardless of what the actual competitive notes show isn't doing analysis, it's providing cover for a decision that was made before the analysis started — naming the domains' evident topical authority as a real factor, separate from raw site size, gives the model a concrete basis for a negative verdict instead of an unfalsifiable one. Checking currency of competing pages as its own explicit factor is what surfaces a genuinely low-effort, high-confidence opportunity that a pure content-gap read would miss entirely: a page that's structurally excellent but cites three-year-old pricing or a deprecated product version can sometimes be beaten primarily by being current, which is a fundamentally different and often faster win than trying to out-write or out-research a well-built competing page from scratch.",
    verifiedAgainst: [
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-07-29' },
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Perplexity (Sonar Pro) and Claude (Claude Sonnet 5).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-listicle-real-differentiation',
    category: 'blog-writing',
    title:
      'Write a listicle where every item earns its place instead of padding to a round number',
    description:
      'Selects and writes list items against explicit inclusion criteria applied consistently, with a defensible list length instead of a forced round number, and depth that varies by how much each item actually warrants.',
    promptText: `You are writing a listicle. Every item on the final list must earn its place against explicit criteria applied consistently — this is not a countdown padded to a round number, and it's not a collection of items given artificially equal treatment regardless of how much each one actually deserves.

TOPIC
{{topic}}

CANDIDATE ITEMS
{{item_pool}}

SELECTION CRITERIA
{{selection_criteria}}

TARGET LIST LENGTH
{{target_list_length}}

AUDIENCE
{{audience}}

LISTICLE RULES
Apply the selection criteria to every candidate item consistently and show your work — for each item that makes the final cut, it should be clear which criteria it satisfies, and for any candidate that didn't make it, note briefly why. Do not force the list to the target length if the candidate pool doesn't actually support it: if only seven items genuinely meet the criteria well and the target was ten, say so and publish seven rather than padding with three items that are noticeably weaker just to hit a round number — a shorter, uniformly strong list beats a longer one with visible filler at the bottom, and readers notice the quality drop-off exactly where padding starts. Vary the depth of each entry based on its actual complexity, not a fixed word count per item — an item with more nuance, more caveats, or a less obvious fit earns more explanation; an item that's simple and self-evident doesn't need three paragraphs stretched to match the others' length. Avoid template collapse, where every entry follows an identical sentence structure with only the noun swapped ("X is great because it offers Y and Z" repeated eleven times) — vary how each entry opens and how its case is made, since identical structure is one of the fastest ways for a reader to notice the list was mechanically generated rather than actually considered. Order the items by a stated logic — most to least relevant for the stated use case, price ascending, or another explicit rule — not alphabetically or randomly unless there's a real reason alphabetical order serves the reader here. Where one item is genuinely stronger or weaker than another on the list, say so directly rather than describing every entry in equally glowing terms; false even-handedness that makes every item sound equally good gives the reader no actual basis for choosing between them, which defeats the point of writing a comparative list in the first place.

OUTPUT FORMAT
1. The final list, ordered per the stated logic, with each entry's depth matched to its actual complexity.
2. A one-line note under each entry naming which selection criteria it satisfies.
3. Excluded candidates and why, briefly.
4. If the final count differs from the target length, one sentence stating why and confirming that's the honest number, not a shortfall to apologize for.`,
    variables: [
      {
        name: 'topic',
        description: 'What the list is about.',
        example: 'Free tools for validating a SaaS pricing page before launch',
        required: true,
      },
      {
        name: 'item_pool',
        description: 'The candidates under consideration, more than the target count.',
        example:
          'Maze, Hotjar, PostHog, UserTesting, Lyssna (formerly UsabilityHub), Crazy Egg, FullStory, Optimal Workshop',
        required: true,
      },
      {
        name: 'selection_criteria',
        description: 'What actually qualifies an item for inclusion.',
        example:
          'Must have a genuinely usable free tier (not just a trial), must support testing a pricing page specifically (not just general session recording), must not require a sales call to start.',
        required: true,
      },
      {
        name: 'target_list_length',
        description:
          'The intended list length, treated as a target, not a hard requirement.',
        example: '8, but only if the criteria genuinely support that many',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who this list is written for.',
        example:
          'Solo founders and small teams pre-launch, price-sensitive, need to move fast without a procurement process',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['listicles', 'content-writing', 'product-roundups', 'editorial-standards'],
    whyItWorks:
      'Refusing to pad the list to a round number when the candidate pool doesn\'t support it targets a specific and visible reader-trust cost: a listicle with three noticeably weaker entries tacked onto the bottom to hit "10" reads, to anyone who reaches those last few items, as evidence the earlier strong entries might have been selected the same arbitrary way — the padding at the end retroactively undermines confidence in the whole list, not just the weak items themselves, which is a worse outcome than simply publishing an honest shorter list. Varying depth by actual complexity rather than forcing equal length per entry directly targets the most common tell of a mechanically generated listicle: a reader can feel the difference between a section that has three paragraphs because there was genuinely three paragraphs\' worth of nuance to cover and one that has three paragraphs because every entry was told to be three paragraphs regardless of how simple the underlying point actually was — the second pattern reads as filler even when every individual sentence is accurate, because the length doesn\'t match the substance. The prohibition on template collapse — the same sentence structure with the noun swapped across every entry — matters because that specific pattern is one of the most immediately recognizable signatures of unedited AI-generated list content, and a reader who spots it on item three stops trusting that the rest of the list reflects real, differentiated consideration of each item rather than the same evaluation template run eleven times with different names filled in. Requiring the write-up to say plainly when one item is stronger or weaker than another, instead of describing every entry in equally glowing terms, is what actually makes a comparative list useful for its stated purpose: a reader choosing between options needs the list to differentiate, and a list where every entry gets identical enthusiasm has, functionally, given the reader the same information they\'d get from a plain directory listing — the entire value proposition of a curated "best of" list is the curation itself expressing a real, stated preference, not a diplomatic non-opinion about everything on it.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-07-30' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-how-to-tutorial-verification',
    category: 'blog-writing',
    title:
      'Write a how-to post whose steps get checked against the real tool before publish',
    description:
      'Writes step-by-step tutorial content that flags any UI element or step not confirmed against an actual walkthrough, instead of guessing plausible-sounding menu labels that quietly go stale the moment the interface changes.',
    promptText: `You are writing a how-to tutorial. Every step needs to be either confirmed against an actual walkthrough of the tool or explicitly flagged as unconfirmed — a plausible-sounding button label that wasn't actually checked is exactly the kind of error that survives editing because it reads as correct even when it isn't.

TASK TO TEACH
{{task_to_teach}}

TOOL AND VERSION
{{tool_or_product_version}}

ACTUAL STEPS PERFORMED
{{actual_steps_performed}}

COMMON FAILURE POINTS
{{common_failure_points}}

AUDIENCE SKILL LEVEL
{{audience_skill_level}}

TUTORIAL RULES
Write only the steps that are confirmed in the actual walkthrough notes provided — never invent a plausible menu label, button name, or screen location to fill a gap in what was actually observed; if a step is needed but wasn't part of the confirmed walkthrough, write it as a flagged placeholder describing what needs to happen, with an explicit note that the exact UI location needs verification before publish, rather than guessing at wording that will read as confident and turn out to be wrong. Number steps atomically — one physical action per numbered step, not two or three actions compressed into one numbered line just to keep the list short; a reader following along loses their place the moment a single step secretly required them to do two things. After any step where a reader might reasonably wonder if they did it right, state what success actually looks like — what changes on screen, what confirmation appears — so the reader can self-check before moving to the next step instead of discovering three steps later that something went wrong earlier. Address every common failure point explicitly, with the actual fix, at the exact step where it's likely to occur — not gathered into a generic troubleshooting section at the end that a reader hits only after already getting stuck and giving up partway through. Note the specific product version this tutorial was verified against, and flag anywhere the walkthrough notes mention behavior that seems version-specific — a menu that moved in a recent redesign, a feature currently in beta — since an unpinned how-to silently goes stale the moment the interface changes, and a reader following an outdated tutorial with no version note has no way to know their confusion is the tutorial's fault, not their own.

OUTPUT FORMAT
1. The tutorial, numbered atomically, with success confirmation stated after any step where it matters and failure-point fixes inline at the relevant step.
2. A list of any steps written as flagged placeholders because they weren't in the confirmed walkthrough, stating exactly what needs verification.
3. The version note, stated plainly at the top of the tutorial, not buried in a footnote.`,
    variables: [
      {
        name: 'task_to_teach',
        description: 'What the reader will be able to do after following this tutorial.',
        example:
          'Set up a webhook that fires when a new row is added to an Airtable base',
        required: true,
      },
      {
        name: 'tool_or_product_version',
        description: 'The exact tool and version this was verified against.',
        example: 'Airtable, web app, as of the July 2026 Automations redesign',
        required: true,
      },
      {
        name: 'actual_steps_performed',
        description: 'Notes from someone who actually did the task, in order.',
        example:
          'Automations tab → Create automation → trigger "When record created" → select base and table → action "Send webhook" → paste URL → hit Test → confirmed 200 response in the log panel.',
        required: true,
      },
      {
        name: 'common_failure_points',
        description: 'Where people commonly get stuck doing this.',
        example:
          "The test webhook often returns a 401 if the receiving endpoint expects a specific header Airtable doesn't send by default — needs a note on adding a custom header in the action config.",
        required: true,
      },
      {
        name: 'audience_skill_level',
        description: 'How much the reader already knows.',
        example:
          'Comfortable with no-code tools generally, has never set up a webhook specifically before',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'tutorials',
      'how-to-content',
      'technical-writing',
      'content-accuracy',
      'documentation',
    ],
    whyItWorks:
      "Refusing to invent unconfirmed UI labels is the single highest-leverage rule in this prompt because of how tutorial errors actually get caught: a wrong menu label or button name reads exactly as confident and correct as a right one — there's no linguistic tell that distinguishes a guessed step from a verified one — which means the error survives every layer of editing that checks prose quality and only gets caught when an actual reader tries to follow the step and can't find what's described, at which point they blame themselves or abandon the tutorial rather than reporting the error, so the mistake quietly costs conversions for a long time before anyone notices it exists. Numbering atomically — one action per step — matters specifically for tutorial content because a reader following a how-to is typically alternating attention between the screen and the instructions, and a step that secretly bundles two actions means the reader's mental step-count desyncs from the actual state of the interface the moment they perform only the first action described, at which point every subsequent step is being read against a screen state the tutorial didn't actually account for. Placing failure-point fixes inline at the exact step where the problem occurs, rather than in an end-of-post troubleshooting section, reflects the real sequence of when a reader needs that information: a person who just hit a 401 error is stuck at that exact step, not reading through to the end of the post first, and a troubleshooting section they'd have to scroll down to find assumes a level of patience a genuinely stuck reader — who is now doubting whether they're even in the right tutorial — often doesn't have left by that point. Naming the specific verified product version explicitly addresses a structural property of how-to content that differs from most other blog formats: prose about a general topic ages slowly, but a tutorial's accuracy is entirely contingent on an interface that the tutorial's own publisher doesn't control and that can change on any release cycle, so a how-to with no version marker leaves a future reader with no way to tell whether their confusion means they made a mistake or means the tutorial itself is simply out of date for the version they're using.",
    exampleOutput: `Verified against: Airtable web app, Automations tab, as of the July 2026 redesign.

1. Open your base and click the Automations tab in the top navigation.
2. Click "Create automation."
3. Under Trigger, select "When record created."
4. Choose the table you want to watch for new records.
5. Under Action, select "Send webhook."
6. Paste your endpoint URL into the URL field.
   → If your endpoint requires an auth header, click "Add header" here — Airtable does not send one by default, and skipping this is the most common cause of a 401 on the next step.
7. Click "Test" and confirm you see a 200 response in the log panel below. If you see a 401, return to step 6 and check your header configuration.

Flagged for verification: the exact wording of the "Add header" field label — confirmed the feature exists at that step, but the precise button text wasn't captured in the walkthrough notes and should be checked against a live account before publish.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-07-31' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-case-study-from-interview-notes',
    category: 'blog-writing',
    title:
      'Turn raw customer interview notes into a case study post that reads like proof, not an ad',
    description:
      'Structures a customer case study around a quantified result and honest causal framing, using only quotes actually said in the interview, and applying anonymization constraints exactly instead of loosely.',
    promptText: `You are turning raw customer interview notes into a case study blog post. The post's credibility depends on reading like evidence a skeptical prospect would trust, not like a testimonial an ad team wrote — which means every claim, quote, and causal statement has to trace back to what the customer actually said.

INTERVIEW NOTES
{{interview_notes}}

CUSTOMER NAME AND ROLE
{{customer_name_and_role}}

QUANTIFIABLE RESULT
{{quantifiable_result}}

PERMISSION CONSTRAINTS
{{permission_constraints}}

AUDIENCE
{{audience}}

CASE STUDY RULES
Lead with the specific, quantified result, not the product name or a generic "success story" framing — a reader deciding whether to keep reading needs the concrete number in the first few lines, not buried after three paragraphs of company background. Structure the body as problem, approach, result, and what changed for the customer specifically — not a feature list dressed up in narrative language; a case study that just walks through the product's feature set with the customer's name attached reads as a product page wearing a disguise, not as evidence. Use direct quotes only where the interview notes actually contain that language — never construct a first-person quote that sounds like something the customer would plausibly say based on the general sentiment of the interview; if the notes describe a sentiment but don't contain a quotable line, paraphrase it in third person instead of manufacturing a quote and attributing it to a real, named person who never said those exact words. Apply the permission constraints exactly as given — if something is marked as not for publication, it does not appear in any form, including a lightly reworded paraphrase that would still let a reader identify the specific detail; if anonymization is required, apply it consistently throughout, not just in the first mention. Be honest about causality: if the interview notes describe the result as influenced by multiple factors — a team reorg, a pricing change, a new hire — alongside the product change, phrase the outcome as "moved after" or "coincided with," not as sole cause, unless the notes genuinely support a direct causal claim; a case study that overclaims causation is the fastest way to get challenged by a prospect's own team during a sales evaluation, and challenged claims damage the whole case study's credibility, not just the overstated line.

OUTPUT FORMAT
1. The case study, structured as problem, approach, result, and impact on the customer.
2. A quote log: every direct quote used, each one confirmed as present in the interview notes verbatim.
3. A note confirming every permission constraint was applied, and where.
4. One sentence stating how causality was framed and why that framing matches what the notes actually support.`,
    variables: [
      {
        name: 'interview_notes',
        description: 'Raw notes or transcript from the customer interview.',
        example:
          'Ops director said: "We were losing about 4 hours a week just reconciling the two spreadsheets before this." Mentioned they also hired a new ops hire around the same time, and switched project tools in Q2 — result likely a combination of all three, not the tool alone.',
        required: true,
      },
      {
        name: 'customer_name_and_role',
        description: 'How the customer should be credited, or anonymized designation.',
        example:
          'Priya Nair, Director of Operations at a 60-person logistics startup (real name, company approved for use)',
        required: true,
      },
      {
        name: 'quantifiable_result',
        description: 'The specific number this case study centers on.',
        example:
          'Reconciliation time dropped from roughly 4 hours/week to under 30 minutes/week',
        required: true,
      },
      {
        name: 'permission_constraints',
        description: 'What can and cannot be published, including anonymization needs.',
        example:
          "Company name and Priya's name and title are approved for use; specific revenue figures mentioned in the interview are not for publication.",
        required: true,
      },
      {
        name: 'audience',
        description: 'Who this case study needs to convince.',
        example:
          'Ops leads at similarly sized logistics or fulfillment companies evaluating whether to switch tools',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'case-studies',
      'customer-stories',
      'content-writing',
      'b2b-marketing',
      'editorial-integrity',
    ],
    whyItWorks:
      "Restricting direct quotes strictly to language actually present in the interview notes addresses a specific and serious risk unique to this format: a fabricated quote attributed to a real, named person is a factual misrepresentation of what that specific individual said, not just a stylistic embellishment — if the customer or their employer ever reads the published piece and finds a quote they don't recognize as their own words, it damages trust with that specific customer relationship in a way a generic marketing exaggeration wouldn't, which is a materially higher-stakes failure mode than the same problem in, say, a listicle or an opinion post. The honest-causality rule targets the credibility mechanism that makes case studies persuasive or not to a skeptical B2B buyer specifically: a prospect evaluating a purchase decision is actively looking for reasons to distrust a vendor's own case study, and an overclaimed causal link — crediting a single product change for a result the interview notes themselves describe as influenced by a reorg, a new hire, and a tool switch — is exactly the kind of claim a skeptical reader's own team will catch and use to discount the entire piece, whereas an honestly hedged \"moved after\" framing survives that scrutiny because it doesn't claim more than the underlying evidence supports. Applying permission constraints exactly, including to reworded paraphrases that could still re-identify a redacted detail, matters because the actual risk of an anonymization leak isn't the literal redacted term reappearing — it's a specific enough paraphrase that anyone who knows the customer can reconstruct exactly what was supposed to be hidden, which technically satisfies a rule read narrowly (\"don't publish the revenue figure\") while violating its actual intent (don't let a reader infer the revenue figure), so the rule has to be applied to the underlying information, not just its literal surface form. Leading with the quantified result rather than company background matters for the same reason a strong headline matters: a case study competing for a skeptical reader's limited attention needs to establish in the first few lines that reading further is worth it, and a number is the one thing in the entire piece a skimming reader can evaluate for relevance without reading any of the surrounding narrative first.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-01' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'blog-writing-refresh-underperforming-post',
    category: 'blog-writing',
    title:
      "Diagnose and refresh a post that's been sliding instead of rewriting it blind",
    description:
      'Diagnoses the actual cause behind a slipping post — content decay, competitive displacement, cannibalization, or a technical issue outside the content itself — before recommending a fix, instead of defaulting to "add more words."',
    promptText: `You are diagnosing why a published post's performance has slipped, before recommending any refresh. Different causes need different fixes, and rewriting the body text is the wrong response to at least two of the likely causes below — the diagnosis has to come first.

POST CONTENT
{{post_url_or_text}}

CURRENT ANALYTICS
{{current_analytics_notes}}

ORIGINAL PUBLISH DATE
{{original_publish_date}}

WHAT'S CHANGED SINCE PUBLISH
{{what_changed_since}}

TARGET KEYWORD
{{target_keyword}}

DIAGNOSTIC RULES
Separate the possible causes before recommending anything: content decay (the post's facts, screenshots, or examples are stale relative to a topic that's since moved on); competitive displacement (a newer or more thorough page has since outranked this one, and the gap is relative, not that this post got worse); cannibalization (another page on the same site now competes for the same query and traffic is likely split, not lost); or a non-content issue (indexing, a technical regression, a lost backlink, a SERP feature change) that a body-text rewrite would not fix at all. Use the analytics notes to identify which of these is most likely before proposing a fix — a pattern of stable impressions with falling click-through rate points at the title and meta description, not the body; a pattern of falling impressions with position holding steady points at a technical or indexing issue, not content quality; a pattern of falling position specifically on this keyword while impressions hold points at competitive displacement, which does call for a content refresh, but a targeted one addressing what specifically changed in the competitive set, not a generic top-to-bottom rewrite. Check the actual queries driving whatever traffic remains, not just the target keyword in isolation — if the post is now ranking for a related but different query than the one it was written for, that's itself a diagnosis, and the fix is realigning the content to what it's actually being found for, or accepting the drift and optimizing further in that direction, not blindly re-targeting the original keyword harder. Weigh what's changed since publish against the diagnosis — a competitor's specifically named new content, a product change that made an existing section wrong, an algorithm update the team is aware of — since a diagnosis with no plausible external cause behind it deserves more scrutiny before acting on it. Preserve the existing URL and publish date's accumulated authority unless there's a specific, named reason a new URL would be justified; recommend against a fresh URL by default. State the fix plan ranked by likely impact, not as an exhaustive checklist of every possible SEO improvement — a team executing a refresh needs to know what to do first, not everything that could theoretically help.

OUTPUT FORMAT
1. The most likely cause, named specifically, with the analytics evidence that points to it.
2. What that specific cause rules out — the fixes that would not actually help here even though they're generically good practice.
3. The fix plan, ranked by likely impact.
4. Any competing hypothesis you considered and ruled out, and why.`,
    variables: [
      {
        name: 'post_url_or_text',
        description: 'The post being diagnosed.',
        example:
          'A 2024 post titled "The Complete Guide to Email Deliverability," 2,800 words',
        required: true,
      },
      {
        name: 'current_analytics_notes',
        description:
          'Traffic, position, impressions, and CTR trends from search console or similar.',
        example:
          'Impressions flat over 6 months, average position dropped from 4 to 11, CTR dropped from 6.1% to 1.8% — the position drop coincides with two new competing guides published by larger sites in the same window.',
        required: true,
      },
      {
        name: 'original_publish_date',
        description: 'When the post first went live.',
        example: 'March 2024',
        required: true,
      },
      {
        name: 'what_changed_since',
        description:
          'Known competitor moves, product changes, or algorithm updates since publish.',
        example:
          'Two competing "deliverability guide" posts from larger email-marketing platforms published in the last 4 months, both include an interactive spam-score checker tool embedded in the post.',
        required: true,
      },
      {
        name: 'target_keyword',
        description: 'The keyword this post was originally written to rank for.',
        example: 'email deliverability guide',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: [
      'content-refresh',
      'seo-diagnostics',
      'content-decay',
      'search-console',
      'content-strategy',
    ],
    whyItWorks:
      "Separating content decay, competitive displacement, cannibalization, and non-content technical causes before recommending a fix matters because these four causes point to genuinely different, sometimes opposite remedies, and the single most common mistake in post-performance triage is defaulting to \"refresh the content\" regardless of which one actually applies — a rewrite spends real time and does nothing for a post that dropped in position because a competing site lost a backlink deal or because Google rolled out an algorithm update unrelated to on-page quality, and worse, it can look like it worked simply because rankings fluctuate for unrelated reasons afterward, teaching the team the wrong lesson about what actually moved the number. Reading the specific shape of the analytics pattern — stable impressions with falling CTR versus falling impressions with stable position versus falling position with stable impressions — turns a vague \"performance is down\" complaint into a diagnosis with an actual mechanism behind it, because each of those three patterns corresponds to a different part of the funnel (the snippet's appeal, the page's visibility, the page's competitiveness) failing, and the analytics data genuinely distinguishes between them if it's read for the pattern rather than just the overall downward trend. Checking what queries are actually driving current traffic, not just the original target keyword's position, catches a specific and easy-to-miss case: a post whose position on its intended keyword has technically fallen but which has organically drifted into ranking well for a related, adjacent query is not necessarily failing — it may simply have found a different, real audience than the one it was written for, and forcing a refresh that re-targets the original keyword harder can actively undo whatever is working about the drift. Recommending against a fresh URL by default addresses a specific overcorrection risk: a URL that's accumulated months or years of backlinks and crawl history carries real, hard-to-replace authority, and a diagnosis-driven refresh should default to preserving that unless a specific, named reason argues otherwise, rather than treating \"just start over\" as a low-cost option when it usually isn't.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-02' },
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and Perplexity (Sonar Pro).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'blog-writing-meta-title-description-ctr',
    category: 'blog-writing',
    title:
      'Write meta title and description pairs that earn the click without misleading it',
    description:
      'Writes a meta title and description pair where the description adds a distinct reason to click beyond the title, checked against real character-truncation limits and against what competing snippets already say.',
    promptText: `You are writing a meta title and description pair for a blog post's search snippet. The title and description have different jobs — the title has to be recognized and trusted in a fraction of a second, the description has to add the one additional reason to click that the title didn't have room for — and a pair that just restates the same idea twice wastes half the available snippet.

TARGET KEYWORD
{{target_keyword}}

ON-PAGE HEADLINE / H1
{{page_headline}}

UNIQUE VALUE PROPOSITION
{{unique_value_prop}}

WHAT COMPETING SNIPPETS ALREADY SAY
{{competing_serp_snippets}}

CHARACTER LIMITS
{{character_limits}}

META RULES
Write the meta title to be recognized and trusted, not to duplicate the on-page H1 word for word if the H1 itself doesn't fit well as a search snippet — the meta title can differ from the H1 when the H1 is written for a reader already on the page and the meta title needs to work as a cold, out-of-context first impression in a list of ten results. Give the meta description a distinct job from the title: it should add the one specific detail, outcome, or angle the title didn't have room for, not restate the title's claim in slightly different words — if reading the title and then the description feels redundant, the description isn't doing its job. Count characters against the real limits rather than estimating — a title much past roughly 55-60 characters and a description much past roughly 155-160 characters risk truncation with a trailing ellipsis mid-word, which reads as unfinished and untrustworthy; state the actual character count for each option so it can be checked, don't just assert that it fits. Never promise something in the description the page doesn't actually deliver — a description that oversells to win the click produces a reader who bounces within seconds once the page doesn't match what was promised, and a high bounce rate on a specific query is a worse long-term outcome than a slightly lower click-through rate from an honest description. Check the competing snippets provided and avoid reusing their exact phrasing or structure — if every competing snippet already says "complete guide" or "everything you need to know," using the same phrase again does zero differentiation work in a results page where the reader is scanning for what's different, not what's the same. Where the search intent supports it, end the description with a concrete reason to click now — a specific number, a named comparison, or what's included — rather than a generic call to action like "learn more" that adds no information.

OUTPUT FORMAT
1. Three title options, each with its exact character count.
2. Three description options, each with its exact character count and paired to a specific title, stating in one phrase what distinct job the description does versus its title.
3. The recommended pair, with one sentence on how it differs from the competing snippets listed.`,
    variables: [
      {
        name: 'target_keyword',
        description: 'The keyword this snippet targets.',
        example: 'how to calculate customer acquisition cost',
        required: true,
      },
      {
        name: 'page_headline',
        description: 'The actual on-page H1 or title.',
        example: 'Customer Acquisition Cost: The Formula and 3 Ways Teams Get It Wrong',
        required: true,
      },
      {
        name: 'unique_value_prop',
        description: 'What this specific page offers that a generic result would not.',
        example:
          'Includes a free downloadable CAC calculator pre-built for usage-based pricing models, not just flat subscriptions.',
        required: true,
      },
      {
        name: 'competing_serp_snippets',
        description: 'What currently shows in the results for this query.',
        example:
          '"CAC: The Complete Guide" — HubSpot; "How to Calculate CAC (With Formula)" — a finance blog; "Customer Acquisition Cost Explained" — a VC firm',
        required: true,
      },
      {
        name: 'character_limits',
        description: 'Custom limits if different from the standard ~60/~155 defaults.',
        example: 'Standard limits — no custom CMS constraint',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'meta-descriptions',
      'seo',
      'ctr-optimization',
      'serp-snippets',
      'on-page-seo',
    ],
    whyItWorks:
      "Giving the title and description genuinely different jobs, rather than treating the description as a slightly longer restatement of the title, is the mechanism that actually maximizes the information a searcher gets from a snippet that only has two short fields to work with — a description that repeats the title's claim in different words has, from the reader's perspective, wasted its entire allotment saying the same thing twice, while a description that adds a distinct detail the title had no room for effectively doubles the persuasive surface area of the same two-field snippet. Checking real character counts rather than estimating targets a specific, visible failure that erodes trust the moment it happens: a title or description truncated mid-word with a trailing ellipsis doesn't just look slightly off, it reads as an unfinished, low-quality result to a searcher scanning quickly, and it's a completely avoidable failure once the actual limit is checked rather than approximated, which is why the prompt requires the exact count stated rather than accepted on faith. The rule against overselling in the description addresses a real and measurable cost that's easy to discount when writing the snippet in isolation: click-through rate looks like the only metric that matters when you're optimizing a snippet, but a description that oversells produces a click followed by an immediate bounce once the page doesn't match, and search engines that observe aggregate post-click behavior treat a high bounce rate on a specific query as a negative signal about relevance — so an honest, slightly less thrilling description that produces a click followed by real engagement outperforms a punchier one that produces a click followed by an immediate back-button press. Checking the competing snippets and deliberately avoiding their exact phrasing targets the same differentiation problem as headline writing, but at the level of the actual results page a searcher is scanning: a snippet using the same stock phrase — \"complete guide,\" \"everything you need to know\" — as three other results directly above and below it does no work distinguishing this result from the others, regardless of how accurate the phrase is, because differentiation in a SERP happens relative to what's visually adjacent, not in the abstract.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-03' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'blog-writing-faq-section-real-questions',
    category: 'blog-writing',
    title: 'Build an FAQ section from real questions instead of manufactured ones',
    description:
      'Builds a post-ending FAQ from actual observed queries — People Also Ask data or real support tickets — with self-contained answers, instead of inventing plausible-sounding filler questions to hit a target count.',
    promptText: `You are building an FAQ section for the end of a blog post. Every question in it needs to be one real people actually ask — not a plausible-sounding question invented to pad the section to a round number, since an invented question answers nothing anyone was actually searching for.

TARGET KEYWORD
{{target_keyword}}

REAL "PEOPLE ALSO ASK" QUESTIONS OBSERVED
{{paa_questions}}

REAL SUPPORT OR CUSTOMER QUESTIONS
{{support_questions}}

POST BODY SUMMARY
{{post_body_summary}}

ANSWER LENGTH TARGET
{{answer_length_target}}

FAQ RULES
Only include a question with actual evidence someone asks it — from the People Also Ask data, from real support tickets, or from another documented source; do not invent an additional plausible-sounding question just to round the section out to a specific count, since a fabricated question that nobody actually searches or asks provides zero value against the actual point of an FAQ section, which is to catch real remaining questions, not to look thorough. Write each answer to be self-contained — a person may land on this exact answer through a search snippet, a voice assistant, or an AI answer engine without ever reading the article body above it, so the answer needs to make sense entirely on its own, without depending on context only established earlier in the post. At the same time, make sure the answer doesn't contradict or just duplicate the main body verbatim — if the post body already covers this exact point in more depth, the FAQ answer should be the tight, standalone version of it, not a copy-pasted paragraph, and it should be consistent with the body's actual claims, not a simplified version that quietly says something slightly different. Keep every answer tightly scoped to the specific question asked — resist the pull to turn a narrow question into a mini-essay covering three adjacent points nobody asked about in that specific question; a longer answer that wanders is worse for both a skimming reader and a voice-assistant excerpt than a shorter one that actually just answers what was asked. Order the FAQs by whatever priority signal is available — search frequency if known, or otherwise the sequence a reader would naturally have these questions in — rather than defaulting to alphabetical order, which has no relationship to how important or common any given question actually is. Flag any of the provided real questions that would actually be better served by adding a new section or expanding an existing one in the main body, rather than as an FAQ entry — a question that keeps surfacing in the People Also Ask data because the post is currently missing that content entirely is a signal to edit the body, not just add a short FAQ answer that papers over a real gap.

OUTPUT FORMAT
1. The FAQ section, questions ordered by priority, each answer self-contained and at the target length.
2. A source note per question — which came from PAA data, which from support tickets.
3. Any real question flagged as better served by a body-content edit than an FAQ entry, with a one-line reason.`,
    variables: [
      {
        name: 'target_keyword',
        description: 'The keyword this post and its FAQ section support.',
        example: 'how to calculate customer acquisition cost',
        required: true,
      },
      {
        name: 'paa_questions',
        description: 'Actual "People Also Ask" questions observed for this keyword.',
        example:
          '"What is a good CAC ratio?", "Is CAC the same as CPA?", "How often should you recalculate CAC?"',
        required: true,
      },
      {
        name: 'support_questions',
        description:
          'Real customer or support questions related to the topic, if available.',
        example:
          '"Does CAC include salaries of the sales team or just ad spend?" — asked repeatedly in the sales team\'s own onboarding calls',
        required: false,
      },
      {
        name: 'post_body_summary',
        description:
          'What the main article already covers, so FAQ answers stay consistent.',
        example:
          'The post covers the basic formula, a worked example, and a section distinguishing CAC from CPA — but does not currently address what counts as a "cost" in the numerator.',
        required: true,
      },
      {
        name: 'answer_length_target',
        description: 'How long each FAQ answer should run.',
        example: '2-3 sentences per answer, no bullet lists inside an answer',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'faq-content',
      'seo-writing',
      'people-also-ask',
      'answer-engines',
      'content-structure',
    ],
    whyItWorks:
      "Restricting FAQ questions to ones with actual observed evidence — real People Also Ask data or real support tickets — rather than inventing plausible ones targets the entire reason an FAQ section exists in the first place: it's meant to close real remaining gaps a real audience has, and a fabricated question that nobody actually asks fills space without closing any actual gap, which means a padded FAQ section can look complete while doing zero incremental work for either the reader or, for anyone using it as an SEO or answer-engine signal, for genuinely matching real query patterns. Requiring each answer to be fully self-contained reflects a real and specific way FAQ content gets consumed differently from the rest of a blog post: a snippet or a voice-assistant response surfaces the answer text alone, stripped of the surrounding article, so an answer written assuming the reader already absorbed context from three paragraphs earlier in the post will read as confusing or incomplete the moment it's extracted and shown on its own, which is the exact context it's most likely to actually be read in. Keeping answers tightly scoped to the specific question asked, rather than letting each one expand into a broader mini-essay, matters because scope creep in an FAQ answer defeats the format's actual advantage over a regular paragraph: the whole value of an FAQ is that a reader (or an extraction algorithm) can match a specific question to a specific, bounded answer, and an answer that wanders into three adjacent points makes that matching harder, not easier, even though it might read as more thorough in isolation. Flagging real observed questions that actually signal a missing body section, rather than routing every one of them into a short FAQ answer, catches a specific failure mode where FAQ sections become a dumping ground for content gaps that deserve real treatment: a question that keeps recurring in the People Also Ask data because the article genuinely doesn't cover that angle at all is a signal the article itself is incomplete, and a two-sentence FAQ answer patches the symptom without fixing the underlying gap the recurring question is actually pointing at.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-04' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against Claude (Claude Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
    relatedToolSlug: 'faq-schema-generator',
  },
  {
    slug: 'blog-writing-blog-outline-competitive-gap-analysis',
    category: 'blog-writing',
    title: `Build a blog outline by diffing against what's already ranking, not from a blank template`,
    description: `Turns a target keyword and the pages already ranking for it into an outline that covers the table-stakes subtopics every top result shares, then adds a specific unique-angle section those pages are missing.`,
    promptText: `You are building the outline for one specific blog post aimed at ranking for one specific keyword — not a generic outline template, but a structure built by diffing against the pages that already rank for this term.

TARGET KEYWORD
{{target_keyword}}

CURRENTLY RANKING (TOP 3-5 RESULTS)
{{top_ranking_pages}}

OUR UNIQUE ANGLE
{{unique_angle}}

READER'S INTENT STAGE
{{reader_intent_stage}}

TARGET LENGTH
{{target_word_count}}

STEPS
1. From the ranking pages I've described, infer the subtopics they cover in common — treat that shared coverage as table stakes the outline must include, since ranking below a competitor rarely happens because our unique angle is better elsewhere while we're silently missing a section every other result has.
2. Identify what none of the ranking pages cover well, using the unique angle I gave you as the seed, and place that as a distinct, named section rather than folding it invisibly into an existing H2 where a skimming reader (or a summarizing AI Overview) won't register it as new information.
3. Order sections by the reader's actual intent stage, not by what's easiest to write first — a reader in an early research stage needs framing and comparison before a deep implementation section; a reader already comparing named options needs the comparison near the top, not buried under generic background.
4. For each H2, write one line stating the single question that section must answer and the minimum subpoints (as H3s) needed to answer it completely enough that a reader wouldn't need to open a second tab.
5. Flag any H2 where satisfying it well would push the piece meaningfully past the target length, and propose either cutting it to a summary with a link to a dedicated piece, or flag that the target length itself may be unrealistic for this keyword's competitive coverage bar.

WHAT NOT TO DO
Do not propose an outline that reads as interchangeable with any other post on this general subject — every H2 should be something you could only have written after reading what I told you about the ranking pages and the unique angle. Do not pad the outline with a generic "conclusion" or "final thoughts" section unless it does real work (a specific next step, not a restated summary).

OUTPUT FORMAT
1. A one-sentence statement of the table-stakes coverage gap this outline closes.
2. The full outline: H1, then H2s with their one-line purpose and H3 subpoints.
3. A flagged note on length risk if any section threatens the target word count.`,
    variables: [
      {
        name: 'target_keyword',
        description: `The exact keyword or search query this post needs to rank for.`,
        example: `async standup tool for remote teams`,
        required: true,
      },
      {
        name: 'top_ranking_pages',
        description: `A short description of what the current top 3-5 ranking pages cover, in your own words.`,
        example: `Three SaaS comparison posts, all structured as '7 best tools' listicles covering Geekbot, Range, and Standuply, each with a features table and pricing but no discussion of async standup failure modes.`,
        required: true,
      },
      {
        name: 'unique_angle',
        description: `Specific data, experience, or product access you have that the ranking pages don't.`,
        example: `We ran a 6-month internal study across 40 remote teams tracking why async standups get abandoned after the first month.`,
        required: true,
      },
      {
        name: 'reader_intent_stage',
        description: `Where the reader is in their research when they land on this page.`,
        example: `Actively comparing 3-4 named tools before a trial signup, not just learning what async standups are.`,
        required: true,
      },
      {
        name: 'target_word_count',
        description: `The realistic length target for this post.`,
        example: `1,800-2,200 words`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `blog-outline`,
      `seo-content`,
      `content-strategy`,
      `competitive-analysis`,
      `content-planning`,
    ],
    whyItWorks: `Most outline prompts ask the model to structure a topic in the abstract, which produces a generically competent skeleton because the model has no signal about what would actually beat the pages currently occupying the result — this prompt instead forces a two-pass structure: first infer the shared coverage baseline from the described competitors, then treat the unique angle as a deliberate addition against that baseline rather than the whole premise of the post. That ordering matters because GPT-5.1 left to its own devices will often lead with whatever angle feels most interesting rather than what's structurally required to be competitive, and a post that's creative but missing a subtopic every ranking page covers will underperform regardless of how good the unique section is. Naming the reader's intent stage explicitly changes section ordering rather than just tone — a comparison-stage reader abandons a post that opens with generic definitional framing, so forcing the model to sequence by intent stage rather than by natural writing order (background, then detail, then comparison) closes a common structural failure mode. The length-risk flag exists because outline generation and length estimation are two different judgments the model tends to conflate — asking for the flag as a separate, explicit step prevents an outline that looks complete on paper from silently implying a 4,000-word draft when the target was 2,000, which only surfaces once someone starts writing against it.`,
    exampleOutput: `Coverage gap closed: none of the ranking listicles address *why* async standups get abandoned, only which tool to pick. H1: Async Standup Tools for Remote Teams (And Why Most Teams Stop Using Them). H2: What actually breaks after week 3 — not a tool problem, a habit problem (H3: the three abandonment patterns from our 40-team study). H2: How to evaluate a tool against those failure modes, not just a features table...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'blog-writing-content-calendar-launch-window-balance',
    category: 'blog-writing',
    title: `Plan a month of blog posts that don't let a product launch crowd out evergreen SEO`,
    description: `Builds a four-week content calendar for a small team balancing launch-tied announcement posts against evergreen SEO posts that need to keep publishing on schedule, with explicit owner and keyword assignments per slot.`,
    promptText: `You are building a four-week blog content calendar for a small team that has a product launch landing in the middle of the window — the risk I need you to actively manage is the launch crowding out every evergreen SEO post that was already supposed to publish that month.

PHASE 1 — INPUTS
TEAM AND CAPACITY
{{team_capacity}}

LAUNCH DATE AND CONTEXT
{{launch_date_context}}

EVERGREEN TOPICS ALREADY QUEUED
{{queued_evergreen_topics}}

PUBLISHING CADENCE
{{publishing_cadence}}

PHASE 2 — BUILD THE CALENDAR
Allocate slots across the four weeks first for the minimum viable launch coverage (an announcement post, and if capacity allows a follow-up post addressing likely objections or a comparison to what the launch replaces) — treat this as a fixed, non-negotiable block rather than something that expands to fill available time, since launch content has a habit of absorbing every slot around it once it starts getting attention. Then fill the remaining slots with the queued evergreen topics in the order that keeps the site publishing something every scheduled slot, never leaving a gap with the excuse that "the team was busy with launch." For each slot, assign: the topic, the target keyword if it's an SEO post, a one-line angle, and which team member from the capacity list is realistically positioned to own it based on what you were told about their bandwidth — do not assign two heavy pieces to the same person in the same week even if the calendar math would otherwise allow it.

PHASE 3 — RISK CHECK
Identify which evergreen topic is most likely to get bumped if the launch runs long, and propose in advance which specific slot it moves to rather than leaving "we'll fit it in later" as the plan — a displaced post with no assigned new slot reliably never gets published.

PHASE 4 — OUTPUT
Produce a week-by-week table: Week | Date | Topic | Type (launch/evergreen) | Target keyword | Owner | Status risk note (only where relevant). Follow the table with the one contingency slot identified in Phase 3.`,
    variables: [
      {
        name: 'team_capacity',
        description: `Who's writing, and their realistic bandwidth this month.`,
        example: `Two writers: Priya (full-time, can handle 3 posts) and Dev (also doing launch comms, realistically 1 post max this month).`,
        required: true,
      },
      {
        name: 'launch_date_context',
        description: `When the launch lands and what it is, briefly.`,
        example: `Launching a new integrations marketplace on the 15th, mid-month.`,
        required: true,
      },
      {
        name: 'queued_evergreen_topics',
        description: `The evergreen/SEO posts already planned or in the backlog for this period.`,
        example: `1) 'How to migrate from spreadsheet tracking to a PM tool' (target keyword: spreadsheet to project management migration), 2) 'Async vs sync team communication' (no hard keyword target yet), 3) a customer case study draft that's 80% done.`,
        required: true,
      },
      {
        name: 'publishing_cadence',
        description: `How often the blog is expected to publish.`,
        example: `Twice a week, Tuesday and Thursday.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `content-calendar`,
      `editorial-planning`,
      `content-strategy`,
      `team-workflow`,
      `product-launch`,
    ],
    whyItWorks: `A generic content calendar prompt treats every slot as interchangeable and lets the model spread topics evenly across the month, which looks tidy but ignores the actual failure pattern teams hit around a launch: launch content is high-visibility and gets protected, so evergreen posts quietly slide and never get rescheduled because no one owns the decision to move them. Fixing the launch block's size first, before allocating evergreen slots, mirrors how a real editorial calendar has to be built under a hard constraint rather than optimized top-down — GPT-5.1 tends to distribute topics evenly by default unless explicitly told a subset of the calendar is fixed and non-negotiable, so naming that block explicitly prevents it from treating a launch follow-up post as just one more flexible item. Forcing a named owner per slot, checked against stated bandwidth rather than assigned mechanically, catches the common scheduling error of loading two demanding pieces onto the person who's already stretched thin because of the launch itself — a plan that's mathematically balanced across the team but ignores who's actually available that week isn't a usable calendar, it's a spreadsheet exercise. The Phase 3 risk check exists because asking a model to output a plan without asking it to also name what breaks first under pressure produces a calendar that looks complete but has no answer for the near-certain case where the launch runs long — naming the specific post likely to get bumped and its replacement slot in advance is the difference between a contingency and a post that silently disappears from the pipeline.`,
    exampleOutput: `Week 2 | Tue 8/11 | Launch announcement: Integrations Marketplace is live | Launch | — | Dev | — || Week 2 | Thu 8/13 | Migrating from spreadsheets to a PM tool | Evergreen | spreadsheet to project management migration | Priya | — || Week 3 | Tue 8/18 | Launch follow-up: answering the 5 questions we got most | Launch | — | Dev | at risk if launch support volume is high...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'blog-writing-editorial-brief-first-time-freelancer',
    category: 'blog-writing',
    title: `Write an editorial brief a freelance writer who's never written for you can actually follow unsupervised`,
    description: `Produces a self-contained editorial brief for a first-time freelance writer, covering voice, structure, sourcing rules, and explicit do/don't boundaries, so the draft that comes back doesn't need a full rewrite pass to fix things the writer had no way of knowing.`,
    promptText: `You are writing an editorial brief for a freelance writer who has never written for us before and will not have access to ask us clarifying questions before the first draft is due — the brief has to be self-contained enough that gaps in it become gaps in the draft, not something a phone call would have caught.

POST TOPIC AND GOAL
{{topic_and_goal}}

BRAND VOICE (WITH A REFERENCE EXAMPLE)
{{voice_reference}}

REQUIRED STRUCTURE
{{required_structure}}

SOURCES THE WRITER SHOULD USE
{{approved_sources}}

DEADLINE AND WORD COUNT
{{deadline_and_length}}

Write the brief so a writer who knows nothing about us going in could produce a publishable-quality draft from it alone. State the voice as a comparison to the reference example rather than adjectives — describe specifically what the reference does (sentence length pattern, how it opens paragraphs, where it uses examples versus abstraction) so the writer has something concrete to match rather than a mood to guess at. State the required structure as a list of sections with a one-line purpose each, in the order they should appear, not just a suggested word-count split. List the approved sources explicitly and instruct the writer to flag, rather than silently substitute, any claim they can't support from those sources — a freelance writer without our context will otherwise reach for whatever ranks well in a quick search, which may contradict facts we already know are wrong or outdated.

WHAT NOT TO DO (INCLUDE THIS AS ITS OWN SECTION IN THE BRIEF)
Spell out common freelance-brief mistakes to specifically avoid for this piece: don't let the brief describe the topic so broadly that the writer could reasonably interpret it three different ways; don't leave the SEO keyword implicit inside a sentence when it should be a labeled field; don't assume the writer knows internal terms, product names, or acronyms we use casually — define every one that appears in the brief itself. If the brief as I've described it to you still leaves an ambiguity a first-time writer could plausibly misread, surface that ambiguity explicitly and resolve it rather than passing it through unaddressed.

OUTPUT FORMAT
1. The full brief, formatted with labeled sections: Topic & Angle, Audience, Voice (with the comparison points), Structure, Sources & Fact-Checking Rules, Do Not section, Deadline & Word Count.
2. A short separate note listing any ambiguity you caught and resolved that wasn't fully specified in what I gave you.`,
    variables: [
      {
        name: 'topic_and_goal',
        description: `The specific topic and what the post needs to accomplish for the business.`,
        example: `A post explaining our new usage-based pricing change, aimed at existing customers who might worry their bill is about to increase.`,
        required: true,
      },
      {
        name: 'voice_reference',
        description: `A link or description of an existing post whose voice the writer should match, plus what specifically makes it sound like us.`,
        example: `Our 'Why we killed seat-based pricing' post — short paragraphs, opens each section with a concrete customer scenario before explaining the reasoning, avoids exclamation points entirely.`,
        required: true,
      },
      {
        name: 'required_structure',
        description: `The sections the post must contain, in order.`,
        example: `1) What's changing (plain terms), 2) Why we made this change, 3) How to check if your bill changes, 4) What to do if you have questions.`,
        required: true,
      },
      {
        name: 'approved_sources',
        description: `What the writer is allowed to treat as fact, and where it comes from.`,
        example: `Our public pricing page and the internal pricing FAQ doc I'm attaching — no third-party pricing comparison sites, since our numbers there are already out of date.`,
        required: true,
      },
      {
        name: 'deadline_and_length',
        description: `When the draft is due and the expected length.`,
        example: `First draft due in 5 days, 900-1,100 words.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `editorial-brief`,
      `freelance-writing`,
      `content-ops`,
      `brand-voice`,
      `editorial-workflow`,
    ],
    whyItWorks: `A brief written for someone who already knows the brand can lean on shorthand — "keep it on-brand," "usual structure" — that a first-time freelancer has no way to decode, so the core mechanism here is forcing every instruction to be checkable by someone with zero prior context, which is a materially higher bar than writing a brief for an internal writer. Describing voice through concrete comparison points against a named reference post, rather than adjectives, matters because GPT-5.1 (and any writer, human or model) treats "conversational but professional" as satisfiable in dozens of contradictory ways, while "opens each section with a concrete scenario before the explanation" is a specific, matchable pattern that produces a draft closer to the reference on the first pass instead of the third revision. Naming approved sources explicitly and requiring flagged claims rather than silent substitutions closes a specific risk in freelance content ops: a writer working from a generic web search will often reach for the most SEO-visible source rather than the most accurate one, and a brand can end up publishing an outdated or simply wrong claim that a source the brand actually trusts would never have supported. The dedicated "what not to do" section exists because brief-writing has a known failure mode where the brief-writer assumes shared context that was never actually written down — asking the model to actively hunt for and resolve exactly that kind of ambiguity, rather than just format the fields it was given, is what prevents an internally coherent-looking brief from still landing ambiguously in the hands of someone outside the building.`,
    exampleOutput: `Topic & Angle: Reassure existing customers that our move to usage-based pricing is fair and easy to check, not a stealth price hike. Voice: Match 'Why we killed seat-based pricing' — short paragraphs (2-3 sentences), each section opens with a concrete customer scenario before the explanation, no exclamation points... Ambiguity resolved: your structure didn't specify whether 'how to check your bill' means a formula or a link to a calculator — I've assumed a link to the existing calculator tool, flag if that's wrong.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
