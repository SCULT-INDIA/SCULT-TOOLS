import type { Prompt } from '../types'

/**
 * LinkedIn (Tier 2, marketing group) — post, profile and thought-leadership
 * prompts calibrated to the platform's actual register: hook-first post
 * structure, native document/carousel posts, profile field optimization,
 * comment and poll strategy for visibility, content-calendar planning, and
 * the recurring high-stakes post types (hiring, case study, job search,
 * event promotion, conference recap, disagreement, employee advocacy).
 * Deliberately distinct from `sales` (1:1 prospecting DMs) — this category
 * is scoped to public content, profile strategy, and native-feature use
 * only, never cold outreach.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'linkedin-post-hook-first-line',
    category: 'linkedin',
    title: 'Write a first line that survives LinkedIn\'s "see more" cutoff',
    description:
      'Generate six hook-line options for a LinkedIn post, each built on a different mechanism and tested against the actual character count where LinkedIn truncates a post, so every option reads as a complete thought before the cutoff rather than a fragment that only resolves after the tap.',
    promptText: `TOPIC
{{post_topic}}

CORE INSIGHT OR RESULT TO LEAD WITH
{{key_insight_or_result}}

AUDIENCE
{{audience}}

TONE
{{tone}}

WHY THE FIRST LINE IS THE ONLY LINE THAT MATTERS RIGHT NOW
LinkedIn truncates a post behind a "...see more" toggle after roughly 140-210 characters, depending on device and whether the viewer is in the app or on the desktop feed. Everything before that cutoff has to work as a complete, self-contained thought that earns the tap, not a fragment that only resolves once the reader has already committed to expanding it. A first line written as a teaser that depends on line two is a first line that gets scrolled past by everyone who was not already going to click regardless of what came next.

GENERATE SIX HOOK OPTIONS, EACH A DIFFERENT MECHANISM
1. A specific, verifiable number or result tied to {{key_insight_or_result}} — no rounded, vague stats like "significantly improved."
2. A contrarian or "unpopular opinion" framing of the same insight, stated as a claim, not a hedge.
3. A direct question {{audience}} is already asking themselves privately, not a rhetorical one aimed at nobody in particular.
4. A short, concrete scene or moment — a specific thing that happened, not an abstract statement about a category of things.
5. A "most people think X, but..." reframe that names the actual wrong assumption before correcting it.
6. A plain, confident statement of the outcome with no adjectives doing the work — cut "amazing," "incredible," and "game-changing" entirely.

THE TRUNCATION TEST
For each of the six, check whether it would still read as a complete thought if LinkedIn cut it off at exactly 150 characters. If it would not — if the sentence's meaning depends on a clause after that point — rewrite it until it stands alone. State the character count next to each option so this is checkable, not assumed.

WHAT TO AVOID
No engagement-bait phrasing: "Comment YES if...", "Tag someone who...", "This will change how you think forever," or any variant that asks for a mechanical action instead of a genuine reaction. Also avoid stacking two mechanisms in the same line — a hook that is both a question and a number in one sentence usually reads as cluttered rather than doing either job well.

AVOID REPEATING A RECENT PATTERN
{{avoid_repeats_from}}

OUTPUT FORMAT
Number each of the six hooks 1 through 6, matching the mechanism list above. After each one, state its character count and one clause confirming (or fixing) that it survives the 150-character truncation test. Close with which one you would lead with for {{audience}} specifically, and why the other five would not work as well for this particular topic — not a generic ranking that would apply to any topic.`,
    variables: [
      {
        name: 'post_topic',
        description: 'What the post is about, in one line',
        example: 'Why we stopped doing weekly status meetings',
        required: true,
      },
      {
        name: 'key_insight_or_result',
        description: 'The specific insight, result, or claim the post is built around',
        example: 'Cutting weekly meetings freed up 6 hours per engineer per month',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who you want this to land with',
        example: 'Engineering managers at 50-200 person startups',
        required: true,
      },
      {
        name: 'tone',
        description: 'The tone the hook should carry',
        example: 'Confident, a little blunt, not salesy',
        required: false,
      },
      {
        name: 'avoid_repeats_from',
        description:
          "A hook style or specific opening you have used in your last few posts, so today's draft is not a repeat structure",
        example: 'Used a "most people think X" reframe in each of my last two posts',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'linkedin-hooks',
      'post-writing',
      'algorithm',
      'copywriting',
      'feed-strategy',
      'character-limits',
    ],
    whyItWorks: `LinkedIn's feed algorithm weights dwell time and genuine comment activity over raw click-through, and it also demotes posts flagged as engagement bait, so a hook engineered purely to force a click ("You won't believe what happened next...") works against the same system it is trying to game rather than with it. Testing each line against the "does it survive a cut at 150 characters" rule targets the actual UI mechanic doing the damage: most weak hooks fail not because the underlying idea is bad but because the sentence was written to resolve on line two, and line two is exactly what "...see more" hides on a phone screen, where the majority of LinkedIn's traffic actually happens.

Generating six options across six distinct mechanisms — number, contrarian frame, question, scene, reframe, plain statement — rather than six variations on one mechanism is what prevents over-indexing on a single trick that happened to work once. A number-led hook works when the number is genuinely surprising, but the same topic run through a contrarian frame or a concrete scene can land with a different segment of the same audience for a completely different reason, and generating all six side by side is what makes that comparison possible before anything gets published, rather than after a weak version has already gone out and can't be un-posted.

Requiring an explicit character count next to each option, rather than trusting a model's own sense of "this feels short enough," matters because judging text length from feel is unreliable — a sentence that reads as punchy and short can still run past 150 characters once counted, and the whole point of the truncation test is defeated if the count backing it is only an impression rather than an actual tally. Naming a recent pattern to avoid repeating also targets a real authorial blind spot: a writer who reliably reaches for the same contrarian-frame structure will not notice the repetition themselves nearly as easily as a reader scrolling past several of their posts in the same week will.`,
    exampleOutput: `1. (Number) "We cut 6 hours of meetings per engineer per month by deleting one recurring event." (89 chars — stands alone)
2. (Contrarian) "Weekly status meetings are a tax on the people already telling you the truth in Slack." (92 chars — stands alone)
3. (Question) "How many hours did your team lose to a meeting that could have been a message?" (82 chars — stands alone)
4. (Scene) "Tuesday, 9am, twelve people staring at a shared screen that hasn't changed since Monday." (91 chars — stands alone)
5. (Reframe) "Most people think fewer meetings means less alignment. Ours went up after we deleted one." (94 chars — stands alone)
6. (Plain) "We deleted our weekly status meeting. Nothing broke. Six hours came back per engineer." (89 chars — stands alone)

Lead with #1 for engineering managers specifically — a verifiable number outperforms a reframe with this audience because they will mentally cross-check it against their own team's meeting load within the first line.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-20' },
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-21' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish for the rewritten linkedin category, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 5).',
      },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'linkedin-personal-story-to-lesson-post',
    category: 'linkedin',
    title: 'Turn a work memory into a story-driven LinkedIn post with a real lesson',
    description:
      "Structure a raw, unpolished work anecdote into a hook-setup-turn-lesson post using LinkedIn's actual short-line, high-white-space format, while explicitly protecting the unflattering or uncertain detail that makes the story read as lived rather than as a templated failure-to-growth arc.",
    promptText: `RAW STORY, IN YOUR OWN WORDS, UNPOLISHED
{{raw_story}}

AUDIENCE
{{audience}}

LESSON YOU WANT IT TO LAND ON, IF YOU HAVE ONE IN MIND
{{lesson_you_want_to_land}}

LENGTH PREFERENCE
{{length_preference}}

THE DETAIL YOU'RE TEMPTED TO SAND OFF
{{what_you_almost_cut}}

WHY THE BEAT ORDER MATTERS HERE
A story post that gives away its point in the first two lines gets skimmed and scrolled past — the entire value of a personal-story format is a delayed payoff that keeps a reader reading past the point they'd normally bail, which is also exactly what LinkedIn's feed ranking rewards through dwell time. Withhold the lesson until it has been earned by the setup and the turn; do not state it early even if doing so feels clearer while drafting.

BUILD THE POST IN THIS ORDER
1. HOOK (1 line) — the moment of tension or the outcome itself, never "Let me tell you a story about..." or any variant that announces a story is coming instead of just starting it.
2. SETUP (2-4 short lines) — only the context required to understand the stakes: what you were trying to do, what you believed would happen, who else was involved if relevant. Cut anything that doesn't change how the turn lands.
3. TURN (2-4 short lines) — what actually happened, including one specific, slightly uncomfortable detail from {{what_you_almost_cut}} that most people would be tempted to smooth over. That detail is what makes this read as true instead of as a constructed inspirational arc.
4. LESSON (2-3 lines) — the takeaway stated plainly and generalized to something the reader can actually use in their own situation, not a moral handed down from a position of having already figured it out.
5. SOFT CLOSE (1 line) — a genuine question or observation that invites a real comment, not a command ("Comment below if...") and not a rhetorical question nobody would actually answer.

FORMATTING
Keep paragraphs to one or two sentences with a line break between them — the way people actually write on LinkedIn's feed, not dense paragraphs that read like an essay. Avoid starting more than one line in a row with "I" — vary the sentence openings so the rhythm doesn't flatten into a list of things that happened to you.

WHAT NOT TO DO
Do not sand off the specific, slightly embarrassing, or uncertain detail from {{what_you_almost_cut}} — polishing it away is what turns a true story into a generic "I failed, then I learned, then I grew" template readers have become numb to. Do not add a detail, quote, or number that wasn't in {{raw_story}} to make the story land harder; if the story genuinely needs a stronger detail to work, say so honestly instead of inventing one.

OUTPUT
The finished post, formatted with line breaks as it would actually appear on LinkedIn, followed by one line noting whether {{what_you_almost_cut}} made it into the final draft and where — if it got cut anyway, say why, and whether the post still works honestly without it.`,
    variables: [
      {
        name: 'raw_story',
        description:
          'The actual memory, written out messily — details matter more than polish',
        example:
          'I told a client we could hit a deadline we clearly could not, because I was scared of losing the account. We missed it by two weeks and I had to call and admit it. They stayed as a client anyway, and told me later it was the call that made them trust us more, not less.',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who this post is written for',
        example:
          'Freelancers and small agency owners who struggle to push back on clients',
        required: true,
      },
      {
        name: 'lesson_you_want_to_land',
        description: 'The takeaway you want readers to walk away with, if you have one',
        example: 'Honesty about a missed deadline builds more trust than a confident lie',
        required: false,
      },
      {
        name: 'length_preference',
        description: 'Roughly how long the finished post should be',
        example: 'Short — under 150 words',
        required: false,
      },
      {
        name: 'what_you_almost_cut',
        description:
          'The unflattering or uncertain specific detail you were tempted to edit out',
        example:
          "The part where I nearly didn't make the call at all and drafted an excuse email first",
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: [
      'storytelling',
      'personal-branding',
      'post-structure',
      'thought-leadership',
      'authenticity',
    ],
    whyItWorks: `Withholding the lesson until the turn has landed exploits the same dwell-time mechanic that makes any hook work, but for the whole post instead of just the first line: LinkedIn's feed ranking weights time spent actually reading a post, and a story that gives away its point in line two gives a reader permission to stop reading immediately, while one that only resolves at the lesson beat keeps them reading through the setup and turn to get there.

Explicitly protecting the detail named in {{what_you_almost_cut}} targets the actual difference between a story that reads as lived experience and the templated "I failed, then I learned, then I grew" format LinkedIn readers have become measurably fatigued by. The instinct to sand off an unflattering or uncertain detail during editing is completely understandable, but it is also specifically what turns a real memory into an inspirational-quote shape indistinguishable from thousands of others, so naming that detail as a required input rather than trusting it to survive editing is what keeps it in the final draft.

The instruction never to invent a stronger detail or number than what appears in {{raw_story}} matters because a fabricated specific is more damaging than a vague true one if it is ever checked — a plausible-sounding "we lost the account" detail that did not happen is discoverable and destroys trust in every other claim in the post the moment it is caught, whereas a true story with a genuinely soft or uncertain ending is still more credible than a punched-up fake one.

The formatting rule about line breaks and varied sentence openings is not cosmetic. LinkedIn's feed renders text at a width where dense paragraphs visually read as a wall of text and get skipped before a reader even starts reading the words, while short lines with white space between them signal "this is quick to read" before the content itself is evaluated at all — a real first-impression filter that operates before writing quality has a chance to matter.`,
    exampleOutput: `I told a client we'd hit a deadline I already knew we'd miss.

Not because I was optimistic. Because I was scared of losing the account.

I actually drafted an excuse email first — something vague about "unforeseen delays" — and sat on it for a day before deleting it and picking up the phone instead.

Two weeks later, I made the call I'd been avoiding: we're late, here's why, here's the new date.

They stayed. Not despite that call — because of it. They told me later it was the first time a vendor had been straight with them about bad news before it became their problem too.

The lesson wasn't "communicate better." It was that the lie I was protecting was smaller than the trust the truth would cost me — I just couldn't see that until after.

What's the deadline you're not admitting you'll miss right now?`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-22' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-23' },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-carousel-document-post-outline',
    category: 'linkedin',
    title: 'Outline a swipeable LinkedIn carousel from a single idea',
    description:
      "Turn one idea into a slide-by-slide outline for LinkedIn's native document-upload carousel format, built around exactly one point per slide and a design note per slide, so it reads as a designed sequence instead of a wall of bullet points split across pages.",
    promptText: `CORE IDEA
{{core_idea}}

AUDIENCE
{{audience}}

ROUGH SLIDE COUNT
{{number_of_slides}}

SPECIFICS THAT MUST APPEAR (data, steps, examples)
{{specifics_to_include}}

DESIGN CONSTRAINTS
{{design_constraints}}

WHY EVERY SLIDE HAS TO EARN ITS OWN SWIPE
This will be uploaded as a PDF through LinkedIn's native document-post feature, which renders as a swipeable carousel directly in the feed. Each swipe is a fresh decision point where a reader can stop — unlike a single post's one-time scroll-past risk, a carousel loses a share of its audience at every slide, so a slide that doesn't clearly earn the next swipe is where the carousel actually dies, even if slide one was strong.

STRUCTURE
COVER SLIDE (slide 1) — a hook line that works exactly the way a post's first line does: a claim, a number, or a real tension, never a title-card phrasing like "5 Tips for X" or "A Thread on Y." The cover has to make someone want to see slide 2 specifically, not just describe what's coming.

BODY SLIDES (slide 2 through second-to-last) — exactly one idea per slide. Each gets a short slide title under 8 words and 1-3 lines of supporting text — no slide should require a reader to actually read a paragraph to get the point; if it does, that's two ideas fighting for one slide, so split it into two.

FINAL SLIDE — the single most important takeaway, stated once, plainly, plus a soft call to action: follow, save, or a genuine question — never a generic "Like and share!" disconnected from what the carousel actually delivered.

FOR EVERY SLIDE, INCLUDE ONE DESIGN NOTE
A short visual direction — "big number as the sole visual anchor," "before/after split down the middle," "one quote, nothing else on the slide" — so this reads as a designed sequence rather than slides of bullet points pasted into a template. If two consecutive slides would use the same design note, vary at least one of them so the sequence doesn't visually flatten.

OVERLOAD CHECK
After drafting, review every slide against the one-idea rule. Flag any slide that's actually trying to carry two ideas at once — a step plus a caveat, a number plus an unrelated tip — and split it into two slides instead of leaving it dense.

CONSTRAINTS FROM SPECIFICS AND DESIGN
Every fact, step, or example named in {{specifics_to_include}} must appear on some slide — do not drop one because it doesn't fit the slide count cleanly; adjust the slide count instead and say so. Respect {{design_constraints}} on what's actually producible (for example, text and simple icons only, no custom illustration) rather than suggesting a design note that isn't achievable with the stated tools.

OUTPUT
A slide-by-slide list: slide number, title, supporting text, design note. Close with the overload check results and, if the ideal slide count differs from {{number_of_slides}}, the adjusted count and why.`,
    variables: [
      {
        name: 'core_idea',
        description: 'The single idea or framework this carousel is built around',
        example: 'A 4-step framework for triaging inbound feature requests without a PM',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who the carousel is written for',
        example: 'Early-stage founders who are still doing product management themselves',
        required: true,
      },
      {
        name: 'number_of_slides',
        description: 'Roughly how many slides you want, including cover and close',
        example: '8',
        required: false,
      },
      {
        name: 'specifics_to_include',
        description: 'Any real data, steps, or examples that must appear',
        example:
          'The 4 triage buckets: fix now, roadmap, decline with reason, needs more data',
        required: false,
      },
      {
        name: 'design_constraints',
        description: 'What is actually producible given the tools and skills available',
        example:
          'Making slides in Canva, text and simple icons only, no custom illustration',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['carousel', 'document-post', 'content-format', 'linkedin-algorithm', 'design'],
    whyItWorks: `Native document posts render as a slide-by-slide swipe, and every swipe is a separate dwell-time event the algorithm can register — this is the documented mechanical reason carousels tend to out-reach a text post of comparable length: the format itself manufactures more total time-on-post than a single scroll past one block of text, but only if a reader keeps swiping.

That advantage is conditional, not automatic, which is why the one-idea-per-slide rule and the explicit overload check matter more here than in almost any other format. A carousel that asks a reader to parse a paragraph on slide 4 gives them a natural exit point mid-sequence, and because the entire reach benefit depends on completed swipes, one dense slide can cap the carousel's performance regardless of how strong the surrounding slides are.

Requiring a distinct design note per slide, with variation flagged between consecutive slides, targets a specific and common carousel failure: a deck that is functionally a slideshow of identical bullet-point templates with new text dropped in reads as a document, not a designed sequence, and readers can tell the difference within the first two slides — the design note forces an actual visual decision for every slide rather than a template default.

The instruction to adjust slide count rather than drop a required fact from {{specifics_to_include}} protects against the failure mode where a fixed slide-count target quietly wins over the content itself. A carousel with the requested number of slides but a missing key data point is worse than one that runs two slides longer than asked but says everything it needed to say.`,
    exampleOutput: `Slide 1 (cover): "Nobody on my team owns product decisions. Here's the 4-bucket system that replaced a PM." Design note: big bold text, no image.
Slide 2: "Bucket 1 — Fix now." Text: "Breaks core workflow for >5% of active users. Ships within the week, no discussion." Design note: red accent, single stat callout.
Slide 3: "Bucket 2 — Roadmap." Text: "Valid, not urgent. Goes in the next planning cycle, requester gets a real date." Design note: calendar icon motif.
Overload check: none of the current 8 slides carry more than one idea — bucket 3 (decline with reason) was originally paired with an example on the same slide, split into slides 5 and 6 instead.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-23' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-24' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-about-section-rewrite',
    category: 'linkedin',
    title: 'Rewrite your LinkedIn About section so it reads as a person, not a resume',
    description:
      "Turn disjointed notes or a resume-voice draft into a first-person About section that opens strong before LinkedIn's preview cutoff and reads like it was written by the person, not extracted from a CV, with keywords worked into real sentences instead of bolted onto the end.",
    promptText: `CURRENT ABOUT TEXT OR ROUGH NOTES
{{current_about_or_notes}}

ROLE AND ACTUAL FOCUS
{{role_and_focus}}

SEARCH KEYWORDS TO INCLUDE
{{keywords_to_include}}

WHO IS LIKELY TO READ THIS
{{audience_reading_this}}

WHAT YOU WANT THE READER TO DO NEXT
{{portfolio_or_contact_link}}

CHARACTER LIMIT AND TRUNCATION POINT
The About field has a hard limit of 2,600 characters, but LinkedIn shows only roughly the first 300 characters before a "...see more" cutoff — on the profile itself and, separately, in search-result snippets. That means the section effectively has two audiences: the small number who click to expand, and the much larger number who only ever see the first three sentences.

RULES
1. OPENING (first 2-3 sentences, roughly 300 characters) — must work as a complete, compelling summary entirely on its own, since most readers never see past it. Do not front-load throat-clearing ("I've always been passionate about...") or context that only pays off in a later sentence — assume the reader stops here unless the opening itself earns the click to expand.
2. VOICE — write like the person is talking, first person, not like a resume summarizing them in third person. "Jane is a results-driven professional with 10 years of experience" is exactly the register to avoid; write it the way the person would actually describe their own work to a peer.
3. KEYWORDS — work every term from {{keywords_to_include}} naturally into real sentences describing actual work, not as a bolted-on list of skills at the end that reads like a tag cloud.
4. SPECIFICS OVER ABSTRACTIONS — include one or two concrete specifics (a real number, a real project type, a real turning point) rather than relying only on abstractions like "passionate," "dedicated," or "results-driven" that could describe almost anyone in the field.
5. CLOSE WITH A CLEAR ASK — end with one plain sentence stating what you want the reader to do, using {{portfolio_or_contact_link}} if given: connect, reach out about a specific kind of work, or view a portfolio. Don't leave the intended action implicit and hope the reader infers it.

FULL-SECTION STRUCTURE
After the opening 2-3 sentences, use the remaining space — still comfortably under 2,600 characters total — to expand on {{role_and_focus}} with one or two more concrete examples, then land on the closing ask. Do not pad the middle just to use more of the character budget; a shorter, sharper About section outperforms a long one that repeats the opening's point in different words.

OUTPUT
The full rewritten About section, followed by its exact character count and a confirmation it's under 2,600, plus a separate note on the character count of just the opening 2-3 sentences so the truncation-visible portion can be checked on its own.`,
    variables: [
      {
        name: 'current_about_or_notes',
        description:
          'Your existing About text, or rough unstructured notes about yourself',
        example:
          'I have 8 years in B2B marketing. I led demand gen at two startups. I like data-driven growth and building teams.',
        required: true,
      },
      {
        name: 'role_and_focus',
        description: 'What you actually do day to day and what you focus on',
        example:
          'Head of Growth at a seed-stage fintech, focused on organic and lifecycle',
        required: true,
      },
      {
        name: 'keywords_to_include',
        description: 'Terms someone searching for you would use, to work in naturally',
        example: 'demand generation, B2B SaaS, lifecycle marketing, fintech',
        required: false,
      },
      {
        name: 'audience_reading_this',
        description: 'Who is most likely to actually read this section',
        example: 'Recruiters sourcing growth leads, and founders considering hiring me',
        required: false,
      },
      {
        name: 'portfolio_or_contact_link',
        description: 'The specific next step or link to point readers toward',
        example: 'DM me, or see case studies at example.com/work',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['profile-optimization', 'about-section', 'personal-branding', 'linkedin-seo'],
    whyItWorks: `The About field truncates to roughly its first 300 characters in two separate places — the profile view itself and LinkedIn's own search-result snippets — which means the opening sentences aren't just an introduction to the rest of the section, they're effectively the only guaranteed-visible copy the section has for a large share of the people who ever encounter it. An opening spent on throat-clearing burns the section's single highest-leverage space.

Writing in first person rather than third-person resume voice matters because LinkedIn is structurally a social feed people scroll through the way they'd read a post, not a document database like a resume PDF. Third-person summary is the fastest tell that a profile was copy-pasted from a CV rather than written for the platform it's actually displayed on, and readers register that mismatch before they process any of the actual content.

LinkedIn's People Search indexes About-section text for keyword matching, which is why naturally embedded keywords do double duty here in a way they wouldn't in a resume — a term appearing in a real sentence about actual work both reads naturally to a human and is available to the same search index a recruiter's query hits, whereas a bolted-on skills list at the end satisfies only the second purpose while actively hurting the first.

The instruction against padding the middle just to use more of the character budget targets a specific temptation this format creates: because the limit is generous (2,600 characters) relative to what most people actually need to say, there's a pull toward filling the space, but a section that restates its opening point in slightly different words across three more sentences reads as repetitive to the smaller audience who does read past the cutoff, undermining exactly the credibility the opening worked to establish.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-24' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-25' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish for the rewritten linkedin category; added the explicit 300-character opening rule and the closing-ask variable after drafts kept saving the actual point for paragraph two and leaving the next step implicit.',
      },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'linkedin-headline-optimization',
    category: 'linkedin',
    title: 'Rewrite your LinkedIn headline to work everywhere it actually appears',
    description:
      'Produce a full-length, compact, and structurally alternate headline — each independently authored for the specific rendering context it will appear in, from the full profile view down to the truncated space beside a comment or inside a search result row.',
    promptText: `CURRENT TITLE OR HEADLINE
{{current_title_or_role}}

WHO YOU HELP
{{who_you_help}}

SPECIFIC OUTCOME OR PROOF POINT
{{specific_outcome_or_expertise}}

SEARCH KEYWORDS
{{keywords_for_search}}

WHERE THIS HEADLINE GETS SEEN MOST OFTEN
{{headline_rendering_priority}}

WHERE THIS HEADLINE ACTUALLY GETS SEEN
The headline field has a 220-character hard limit at full length, but it renders in several compact contexts that truncate far shorter: beside every comment you leave on someone else's post, in the connection-request preview a stranger sees before accepting, in notification emails, and in every row of a search-result list. A headline written only to look good under your name on the full profile is optimized for the context it's actually seen in least.

DELIVER THREE VERSIONS
1. FULL-LENGTH (180-220 characters) — combine role, who you help, and the specific outcome or proof point from {{specific_outcome_or_expertise}}, working in {{keywords_for_search}} naturally rather than as a keyword-stuffed fragment. This is the version shown on the full profile view.
2. COMPACT (under 80 characters) — keep only the single highest-value phrase: the one thing that should survive if everything else gets cut by a narrow rendering context. This is not a shortened version of the full-length one; decide independently what the one thing is that matters most if only one thing gets through.
3. ALTERNATE FULL-LENGTH — a second full-length version taking a genuinely different structural approach from version 1: if version 1 leads with the title, lead this one with the outcome; if version 1 is a single flowing phrase, structure this one with a pipe-separated list of role, audience, and proof point.

CHARACTER DISCIPLINE
For each version, state the exact character count and confirm it fits its stated budget. Do not estimate — count.

LANGUAGE DISCIPLINE
Cut generic filler entirely: "passionate," "results-driven," "thought leader," "dynamic," "innovative." Every remaining word should be doing either search work (a term someone would actually type) or comprehension work (telling a stranger something specific and true) — nothing should be there purely for tone.

PRIORITY WEIGHTING
If {{headline_rendering_priority}} indicates this headline is seen mostly in one specific context — mostly in search because of active job hunting, or mostly beside comments because of frequent posting — say which of the three versions should actually be set as the live headline given that, rather than defaulting to the full-length one as the "main" version by convention.

OUTPUT
The three versions labeled full-length, compact, and alternate, each with its character count, followed by one line on which of the three you'd actually set as the primary headline and why, given {{who_you_help}}, {{keywords_for_search}}, and {{headline_rendering_priority}}.`,
    variables: [
      {
        name: 'current_title_or_role',
        description: 'Your current headline or job title',
        example: 'Senior Product Designer at a Series B startup',
        required: true,
      },
      {
        name: 'who_you_help',
        description: 'Who you work with or who benefits from what you do',
        example: 'B2B SaaS teams shipping their first enterprise-grade UI',
        required: true,
      },
      {
        name: 'specific_outcome_or_expertise',
        description: 'A concrete outcome, specialization, or proof point',
        example: 'Led the redesign that cut onboarding drop-off by a third',
        required: true,
      },
      {
        name: 'keywords_for_search',
        description: 'Terms a recruiter or client would type to search for you',
        example: 'product design, design systems, B2B SaaS, UX research',
        required: false,
      },
      {
        name: 'headline_rendering_priority',
        description:
          'Where this headline is most likely to be seen most often, if you know',
        example: "Mostly in search results right now — I'm actively job hunting",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['headline', 'profile-optimization', 'personal-branding', 'linkedin-search'],
    whyItWorks: `The headline is the single most-repeated piece of text a profile owner controls on LinkedIn — it appears beside every comment left on any post, in every connection-request preview, in reaction and mention notifications, and in every row of a search result. Most of these renderings truncate well before the 220-character limit on mobile specifically, so a headline tuned only for the full-profile view is tuned for its lowest-frequency appearance, not its highest.

That's the direct reason this asks for an independently authored compact version rather than a truncated slice of the full-length one. The phrase that matters most in a one-time full read isn't necessarily the phrase that matters most when only 60-80 characters render, so a compact version has to be authored with that specific constraint in mind, not derived mechanically by cutting the long version down.

LinkedIn's People Search weights headline text heavily for keyword matching, arguably more than any other single profile field, which is why front-loading {{keywords_for_search}} into real, comprehensible phrasing — rather than burying searchable terms after a string of adjectives — changes actual discoverability, not just how polished the headline reads to someone who already found the profile another way.

Requiring an exact character count rather than an estimate matters mechanically: headline character limits are enforced hard by LinkedIn's own field validation, and a version that "feels" close to 220 characters but is actually 235 will get silently truncated at save time, which defeats the entire point of hand-crafting a full-length version if the count was never actually verified. Weighting the recommendation by where the headline is seen most often, rather than always defaulting to the full-length version as the canonical one, matches the fact that "primary" is context-dependent, not a fixed property of the longest version.`,
    exampleOutput: `Full: "Senior Product Designer helping B2B SaaS teams ship enterprise-grade UI | Design systems, UX research | Cut onboarding drop-off 33% at [Company]" (149 chars)
Compact: "Product Designer — B2B SaaS onboarding & design systems" (58 chars)
Alternate: "Cut onboarding drop-off 33% by redesigning it from scratch | Senior Product Designer | Design systems + UX research for B2B SaaS" (133 chars)
Recommendation: since headline_rendering_priority indicates active job search, lead with the Alternate — recruiters scanning search results respond faster to the outcome than the title.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-25' },
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish for the rewritten linkedin category, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 5).',
      },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'linkedin-comment-strategy-for-visibility',
    category: 'linkedin',
    title: "Draft comments on other people's posts that actually earn you visibility",
    description:
      'Generate substantive, specific comment drafts across three genuinely different moves — extend, question, resource — built to earn a reply and chain into further visibility, instead of a "Great post!" that gets buried and signals nothing.',
    promptText: `TARGET POST
{{post_content_or_summary}}

YOUR RELEVANT EXPERTISE OR ANGLE
{{your_expertise_or_angle}}

RELATIONSHIP TO THE POSTER
{{relationship_to_poster}}

WHAT YOU WANT THIS COMMENT TO DO FOR YOU
{{goal}}

HOW MANY DRAFTS TO GENERATE
{{number_of_drafts}}

WHY A GENERIC COMMENT SIGNALS NOTHING
LinkedIn's ranking treats a comment as a stronger relevance signal than a like, and an active commenter's profile can surface to the original poster's own network and mutual connections — but only when the comment itself earns further engagement, such as a reply or reactions on the comment specifically. A comment that just restates or praises the post produces no downstream signal and gets buried under every other identical one under the same post.

DRAFT {{number_of_drafts}} DISTINCT COMMENTS, EACH A GENUINELY DIFFERENT MOVE
1. EXTEND — add a concrete example, data point, or counterpoint from {{your_expertise_or_angle}} that builds on the post's actual argument, not a restatement of what it already said in different words.
2. QUESTION — ask a specific follow-up question a thoughtful reader would actually want answered, one that shows you engaged with the argument's substance, not just its topic.
3. RESOURCE OR DISTINCTION — offer one specific framework, resource, or distinction the post didn't cover, adding something genuinely new to the thread rather than agreeing more elaborately.
If {{number_of_drafts}} calls for more than three, generate additional distinct moves beyond these three rather than producing near-duplicates of one of them.

LENGTH AND SELF-PROMOTION DISCIPLINE
Keep each comment under 400 characters so it doesn't visually read as a wall of text competing with the post itself. None of the drafts may contain "Great post," "So true," "Love this," or a close variant with no added content attached. Each comment should read as more about the post's idea than about you — if a draft is functionally self-promotion wearing a comment's shape, rewrite it before including it rather than including it and flagging it afterward.

RELATIONSHIP CALIBRATION
Adjust tone and directness based on {{relationship_to_poster}} — a comment on a stranger's post earning cold visibility should establish relevant credibility briefly and naturally within the substance of the comment itself, not through a separate self-introduction sentence; a comment on someone you know can skip that entirely and get straight to the point.

OUTPUT
The requested number of comment drafts, each labeled by which move it is, each with its character count, plus one line on which draft you'd post first given {{goal}} and why the others are secondary rather than simultaneous options.`,
    variables: [
      {
        name: 'post_content_or_summary',
        description: "The post you're commenting on, pasted in or summarized",
        example:
          'A founder posted that they stopped doing quarterly OKRs because the team spent more time reporting on goals than working toward them.',
        required: true,
      },
      {
        name: 'your_expertise_or_angle',
        description: 'What you bring to this specific topic',
        example:
          "I've run OKRs at two companies — worked at 15 people, broke down completely at 80",
        required: true,
      },
      {
        name: 'relationship_to_poster',
        description: 'Whether you know this person, follow them, or found the post cold',
        example: "Don't know them personally, found the post via a mutual connection",
        required: false,
      },
      {
        name: 'goal',
        description: 'What you want this comment to accomplish for you',
        example: 'Get noticed by other operations leaders who might see this thread',
        required: false,
      },
      {
        name: 'number_of_drafts',
        description: 'How many distinct comment options you want',
        example: '3',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'comment-strategy',
      'engagement',
      'visibility',
      'networking',
      'linkedin-algorithm',
    ],
    whyItWorks: `LinkedIn's engagement ranking explicitly weights comments above likes as a relevance signal, and a commenter's own profile becomes visible to the poster's network specifically through the comment thread — but this visibility mechanism only activates when the comment itself draws further engagement, meaning a bare affirmation that gets zero replies produces functionally no downstream reach even though it technically counts as "engaging" on the post.

The three required move-types — extend, question, resource — are calibrated to be the three shapes of comment most likely to earn a reply from either the original poster or another reader, because each one leaves something specific for someone else to respond to: a counterpoint to react to, a question to actually answer, a resource to acknowledge. A pure affirmation gives the reader nothing to do except like it and move on, which is the actual mechanical reason affirmation comments don't chain into further visibility.

The instruction to reject any draft that's self-promotion wearing a comment's shape targets the second most common failure mode, one step subtler than a bare "great post." A comment that name-drops your own company or credentials while nominally responding to the post is recognized by both the poster and other readers as a pitch, and readers who recognize a comment as self-promotional are measurably less likely to engage with it — which defeats the entire visibility mechanism this strategy depends on, even though the comment technically added content.

Calibrating tone to {{relationship_to_poster}} matters because a comment establishing credibility explicitly ("As someone who's run this at two companies...") reads as necessary context on a cold post where nobody knows you, but reads as an odd, unnecessary flex on a post from someone who already knows exactly who you are — the same sentence performs differently depending on what the reader already knows about the commenter's relationship to the poster.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-26' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-27' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-thought-leadership-content-calendar',
    category: 'linkedin',
    title:
      'Build a month of LinkedIn content around 3-4 real pillars, not a posting schedule',
    description:
      'Turn your expertise and a business goal into a planned content run with real format variety and a stated, checkable reason each slot exists, instead of a generic "post 3x a week" list that can\'t be reviewed for whether it actually worked.',
    promptText: `EXPERTISE AREA
{{expertise_area}}

BUSINESS GOAL THIS CONTENT SHOULD MOVE
{{business_goal}}

REALISTIC POSTING FREQUENCY
{{posting_frequency}}

FORMATS YOU CAN ACTUALLY PRODUCE
{{formats_available}}

TIME HORIZON FOR THIS CALENDAR
{{calendar_duration}}

STEP ONE: DEFINE 3-4 REAL PILLARS
Before building any calendar, define 3-4 content pillars — recurring themes within {{expertise_area}} that each connect to {{business_goal}} in a specific, stated way. "Thought leadership" is not a pillar; "case-study breakdowns of pricing decisions we've reversed and why" is a pillar. For each one, state in one sentence exactly how it's supposed to move {{business_goal}}, not just that it's related to the topic.

STEP TWO: BUILD THE CALENDAR
Build a calendar spanning {{calendar_duration}} at {{posting_frequency}} that:
1. ROTATES PILLARS so no two consecutive posts hit the same one — a reader following closely should see the range across a couple of weeks, not a run of three posts on the same theme back to back.
2. ROTATES FORMAT across {{formats_available}} — do not schedule several text-only posts in a row if a carousel, poll, or document post option exists in that list; different formats earn different kinds of engagement, and a calendar that's accidentally all one format is leaving reach on the table regardless of topic quality.
3. FOR EVERY SLOT, GIVES: the date or week, the format, the pillar it belongs to, a working title or hook idea specific enough to actually write from later (not "post about pricing"), and one line on exactly what this specific post is meant to do for {{business_goal}} — a reader reaction, a specific kind of inbound interest, or a piece of credibility being built for a later ask.

STEP THREE: AUDIT THE BALANCE
Close with a short note identifying which pillar is currently underused relative to how important it actually is to {{business_goal}} — not just which pillar has the fewest slots, but which underused pillar's absence is actually costing something, versus a pillar that's fine with fewer posts because it's doing a smaller job.

CONSTRAINT
Do not invent a pillar outside {{expertise_area}} just to add variety — a calendar with a pillar the author can't actually speak to with real specificity produces posts that read as generic the moment they're written, regardless of how well the calendar slot was planned.

OUTPUT
The pillar list with its one-sentence "how this moves the goal" statement, then the full calendar table, then the balance audit note.`,
    variables: [
      {
        name: 'expertise_area',
        description: 'What you actually know deeply enough to post about consistently',
        example: 'B2B pricing strategy for usage-based SaaS products',
        required: true,
      },
      {
        name: 'business_goal',
        description: 'What this content is ultimately meant to move',
        example: 'Get inbound consulting inquiries from mid-market SaaS founders',
        required: true,
      },
      {
        name: 'posting_frequency',
        description: 'How often you can realistically post without burning out',
        example: '3 times per week',
        required: true,
      },
      {
        name: 'formats_available',
        description: 'The formats you can actually produce',
        example: 'Text posts, carousels, and occasional polls — no video for now',
        required: false,
      },
      {
        name: 'calendar_duration',
        description: 'How far out this calendar should plan',
        example: '4 weeks',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['content-calendar', 'thought-leadership', 'content-strategy', 'planning'],
    whyItWorks: `A calendar that's just a cadence with no argument behind each slot produces a month of posts that don't add up to anything measurable in retrospect — a quarter later, nobody can say which specific posts moved {{business_goal}} versus which were just cadence-filling, because nothing about the plan connected an individual post to a specific intended effect at the time it was scheduled.

Tying every slot to both a pillar and a one-line stated reason it serves the business goal is what makes the calendar reviewable rather than just executable. A calendar can be checked afterward against reality — did the pricing-pillar posts actually generate the kind of inbound they were meant to? — only if each slot made a specific, falsifiable claim about its own purpose up front, rather than a vague "builds thought leadership" applied uniformly to every entry.

Forcing format rotation in addition to topic rotation matters because LinkedIn's different native formats reach and convert attention differently. Carousels and document posts tend to earn more cumulative dwell time through repeated swipes, polls generate fast low-effort interaction that surfaces the post to more feeds, and plain text relies entirely on the opening hook with no structural assist — so a calendar that's accidentally uniform in format is really running one content strategy five different times while looking like five different strategies.

The constraint against inventing a pillar outside genuine expertise protects the calendar's own success criteria. A pillar chosen for variety rather than depth produces posts the author can't actually write with real specifics, and a content calendar's entire value collapses if executing it just produces generic posts on schedule — a thin pillar with no real material behind it costs more in credibility than the topical variety was worth.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-27' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-case-study-post-from-project',
    category: 'linkedin',
    title:
      'Turn a client project into a LinkedIn case-study post that reads as proof, not a press release',
    description:
      'Structure a real project outcome into a situation-obstacle-action-result post that leads with tension instead of "Case study:", with an explicit honesty check against inventing or rounding any number you weren\'t actually given.',
    promptText: `PROJECT CONTEXT
{{project_context}}

OBSTACLE OR CHALLENGE GOING IN
{{obstacle_or_challenge}}

WHAT WAS ACTUALLY DONE
{{what_you_did}}

REAL RESULT OR OUTCOME
{{result_or_outcome}}

CLIENT NAMING PERMISSION
{{client_permission}}

WHY "CASE STUDY:" IS THE WORST POSSIBLE OPENING
A post that opens with "Case study:" or "Excited to share a project we just wrapped" announces itself as promotional before a single fact has been delivered, which gives a scrolling reader every reason to keep scrolling. The post has to open with the actual tension in the result — the gap between where things started and where they ended — the same mechanic that makes any hook work, applied to proof-of-work content instead of an opinion.

STRUCTURE
1. HOOK — lead with the tension in {{result_or_outcome}} itself, stated as a claim or number, never with "Case study" or an announcement framing.
2. SITUATION (2-3 lines) — only the context needed to understand the stakes; cut anything that doesn't change how the obstacle or result lands.
3. OBSTACLE — state {{obstacle_or_challenge}} honestly and specifically, never softened into "a unique challenge" or "some initial hurdles" — name the actual thing that made this hard.
4. ACTION — describe {{what_you_did}} specifically enough that a reader in a similar position could actually learn something concrete from it, not "we implemented a strategic solution" or any phrase that could describe literally any project.
5. RESULT — state {{result_or_outcome}} exactly as given, with no rounding up, no adding precision that wasn't provided, and no estimating a number you weren't given even if a rounder or bigger-sounding figure would read better.
6. CLOSE — one line on what this generalizes to for someone else in a comparable position, not a bare "DM me to learn more" with no connective tissue to the story just told.

NAMING AND ANONYMIZATION
If {{client_permission}} means the client can't be named, anonymize by real industry and rough size ("a mid-size D2C skincare brand") rather than a fictional company name specific enough to be mistaken for a real, identifiable business — a fake name reads as more deceptive than an honest, generic description, even though both are technically anonymized.

HONESTY CHECK
If any part of {{result_or_outcome}} as given is ambiguous, unverifiable from what was provided, or would require an inference to state cleanly, flag that gap explicitly in your output instead of smoothing over it with confident-sounding language that goes beyond what was actually given.

OUTPUT
The finished post, followed by a separate line listing anything flagged under the honesty check, or an explicit statement that every claim in the post traces directly to something provided, with nothing added or rounded.`,
    variables: [
      {
        name: 'project_context',
        description: 'Basic context on the project and who it was for',
        example: '3-month engagement redesigning checkout flow for a mid-size D2C brand',
        required: true,
      },
      {
        name: 'obstacle_or_challenge',
        description: 'What made this specifically hard, honestly stated',
        example:
          'Mobile checkout had 6 form fields and no saved payment info, and the team had never run an A/B test before',
        required: true,
      },
      {
        name: 'what_you_did',
        description: 'The specific actions taken, not a vague summary',
        example:
          'Cut the form to 2 fields, added Apple Pay/Google Pay, ran a 4-week A/B test against the old flow',
        required: true,
      },
      {
        name: 'result_or_outcome',
        description: 'The real, client-approved result — exact figures only',
        example:
          'Mobile checkout completion rate went from 41% to 58% over the test period',
        required: true,
      },
      {
        name: 'client_permission',
        description: 'Whether the client can be named or must be anonymized',
        example: "Can't name them — anonymize as a mid-size D2C skincare brand",
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: [
      'case-study',
      'social-proof',
      'post-structure',
      'b2b-marketing',
      'honesty-check',
    ],
    whyItWorks: `Case-study posts fail in one of two predictable, opposite ways: they open like a press release ("Excited to share..."), signaling promotion before any fact lands and triggering an immediate scroll-past, or they inflate the result because the case-study format itself creates a pull toward a rounder, more impressive-sounding number than what was actually measured. Leading with the tension in the result rather than an announcement targets the first failure, and the explicit no-rounding, no-inventing instruction targets the second.

The no-invented-numbers rule matters more here than in most content because a specific, false number is strictly more damaging than a vague, true one once challenged. A precise-sounding "conversion increased 47%" that turns out not to match reality is one of the fastest ways a proof-of-work post gets discredited publicly in its own comments, by exactly the technically literate audience that case-study content is trying to earn credibility with, whereas an honestly vaguer true claim survives scrutiny.

The instruction to anonymize by real industry and rough size, rather than inventing a plausible-but-fictional company name, addresses a subtler trust problem: a fictional name specific enough to sound like a real company invites a reader to wonder whether the whole company is fictional too, while an honest "a mid-size D2C skincare brand" reads as a deliberate, stated anonymization choice rather than a fabrication trying to pass as specific.

Naming what the honest generalization looks like, rather than closing with a content-free call to action, is what actually makes the case study useful to someone who isn't the client. A reader in a comparable situation gets something transferable to their own problem, whereas a bare "DM me to learn more" asks the reader to do the work of extracting the lesson themselves before deciding whether it was even worth their time.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-28' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-poll-question-design',
    category: 'linkedin',
    title: 'Design a LinkedIn poll that reveals a real signal, not just clicks',
    description:
      "Turn a topic into three poll question variants, each with genuinely contested options sized to LinkedIn's option-length limit, with a stated interpretation for at least two possible result splits — and a flag on any variant that's really just engagement bait dressed as a poll.",
    promptText: `TOPIC OR QUESTION
{{topic_or_question}}

AUDIENCE
{{audience}}

WHAT YOU ACTUALLY WANT TO LEARN
{{what_you_want_to_learn}}

POLL DURATION YOU'RE CONSIDERING
{{poll_duration}}

TYPICAL REACH ON YOUR POSTS
{{typical_reach}}

WHY MOST LINKEDIN POLLS COLLECT CLICKS AND ZERO SIGNAL
LinkedIn polls allow 2-4 answer options, each limited to 30 characters, running for a duration you set from 1 day up to 2 weeks. A poll only pays off if the result distribution tells you something you didn't already know — a poll where the outcome is obvious before a single vote comes in ("Do you value good communication? Yes / Obviously yes") collects easy clicks but zero real signal, and audiences increasingly call this pattern out as manipulative in the comments, which costs more credibility than the engagement was worth.

DELIVER THREE VARIANTS
For each of three distinct poll question phrasings on {{topic_or_question}}, give 2-4 options that create genuine tension — meaning a reasonably informed member of {{audience}} could plausibly land on more than one option, not a poll where the overwhelming majority will obviously pick the same answer before reading the others.

FOR EACH VARIANT
1. State what a specific result split would actually tell you — for example, what a 70/30 lean toward one option would reveal about {{audience}}'s real position, distinct from what a near-even four-way split would reveal. These two outcomes should teach you genuinely different things, not the same conclusion phrased two ways.
2. Confirm each option is literal and specific enough to stand as a real answer on its own — no option should require a mental "it depends" qualifier to make sense; if an option needs a caveat to be chosen honestly, rewrite it or split it into two options.

BAIT CHECK
Flag any variant that's really engagement bait dressed as a poll — one with an obvious "correct" answer everyone converges on, or where every option restates the same underlying opinion in different words — and provide a rewritten version that restores genuine tension, rather than just noting the problem and leaving it unfixed.

DURATION AND SAMPLE NOTE
Given {{typical_reach}}, state whether {{poll_duration}} is long enough to reach a meaningful sample before drawing a conclusion, and whether a shorter or longer window would change what the results actually mean — a poll on a fast-moving news topic and a poll on an evergreen debate don't need the same duration to produce a reliable signal.

OUTPUT
The three variants with their options, the "what a specific split would tell you" note for each, the bait check result (with a rewrite if flagged), and the duration recommendation.`,
    variables: [
      {
        name: 'topic_or_question',
        description: 'The topic or draft question you want to poll on',
        example: 'Whether teams should require a written doc before any feature kickoff',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who is likely to see and vote on this poll',
        example: 'Product managers and engineering leads following me',
        required: true,
      },
      {
        name: 'what_you_want_to_learn',
        description: "What you're actually trying to find out, beyond raw engagement",
        example:
          'Whether "written doc first" is still the norm or if teams have moved on',
        required: false,
      },
      {
        name: 'poll_duration',
        description: 'How long you plan to run the poll',
        example: '1 week',
        required: false,
      },
      {
        name: 'typical_reach',
        description: 'Roughly how many people usually see your posts',
        example: 'Usually 3,000-5,000 impressions within the first 48 hours',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['polls', 'engagement', 'audience-research', 'linkedin-native-features'],
    whyItWorks: `A poll's entire informational value lives in whether the result distribution could plausibly have gone more than one way — this is a testable property of the question design itself, not a matter of luck once it's posted, which is why asking for genuine tension in the options up front, rather than checking engagement numbers afterward, is the point where this actually gets fixed. By the time a poll has already run for a week with an obvious answer, the wasted signal opportunity can't be recovered.

Requiring a distinct, stated interpretation for at least two different possible result splits forces the question design to actually be useful research rather than a vanity-metric play. If a 70/30 split and a 50/50 split would lead to writing the exact same follow-up conclusion either way, the poll wasn't actually measuring anything, and stating the two interpretations explicitly in advance is what surfaces that emptiness before the poll goes live rather than after it's already collected votes nobody can meaningfully interpret.

The 30-character option limit is a genuine design constraint, not just a UI quirk. It forces a claim to be stated literally rather than hedged with a qualifier, which is exactly the property real tension needs: an option like "It depends on team size" isn't a real answer a voter can commit to, it's an escape hatch, and the character limit incidentally makes hedge-phrased options harder to write, which is a small mechanical assist toward better question design.

LinkedIn audiences have grown specifically attentive to polls with an obviously "correct" option, and calling that pattern out publicly in the comments of the poll itself has become a common response — which means a bait-y poll doesn't just fail to generate signal, it actively risks a negative comment thread about the poll's own design, making the bait check a credibility safeguard as much as a data-quality one.`,
    exampleOutput: `Variant: "Should feature kickoffs require a written doc first?" Options: "Yes, always" / "Only for big features" / "No, slows us down" / "We skip docs entirely." A 70/30 split toward "only for big features" would tell you the team already has an implicit size threshold — a near-even 4-way split would tell you there's no shared norm at all, which is itself useful to know before proposing a new process.
Bait check: no variant flagged — all three keep at least two options with plausible support in the target audience.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish for the rewritten linkedin category, verified against ChatGPT (GPT-5.1) and Gemini (Gemini 3 Pro).',
      },
    ],
  },
  {
    slug: 'linkedin-repurpose-blog-post-into-post',
    category: 'linkedin',
    title: "Repurpose a blog post into a LinkedIn post that doesn't read like a summary",
    description:
      "Extract the single strongest argument from a long-form post, name what got left out and why, and rewrite the chosen argument entirely in LinkedIn's native register — with an honest, hedged answer on link placement instead of a stated rule presented as settled fact.",
    promptText: `BLOG POST CONTENT OR SUMMARY
{{blog_post_content_or_summary}}

STRONGEST ARGUMENT, IF ALREADY KNOWN
{{single_argument_to_lead_with}}

BLOG URL (reference only, not to be quoted in the post)
{{blog_url}}

AUDIENCE FOR THE LINKEDIN VERSION
{{audience}}

WHAT YOU WANT THE READER TO DO AFTER READING
{{cta_goal}}

TWO-STEP PROCESS
STEP ONE — PICK ONE ARGUMENT
Identify the single argument or insight in the source that's strong enough to carry a standalone LinkedIn post entirely on its own — not a summary of every section of the post. State which one you picked and, just as important, name the other candidate arguments you considered and why each one didn't make the cut for a single post. A repurposing pass that can't explain what it left out usually hasn't actually chosen anything, it's just compressed everything.

STEP TWO — REWRITE IN LINKEDIN'S NATIVE REGISTER
Rewrite the chosen argument entirely in the feed's actual register: 1-2 sentence paragraphs with a line break between them, no subheadings, no bullet-point dump of the blog's sections repackaged as a list. Open with a hook line that has nothing to do with the blog's own headline — blog headlines are written for search intent and click-through from a results page, an entirely different job than stopping a scroll, so reusing one as the post's opening line is importing the wrong tool for this job.

LINK PLACEMENT — ANSWER HONESTLY, NOT WITH A RULE OF THUMB
Address whether the blog link belongs in the post body or should be held for the first comment instead. Explain the real, current tradeoff: a native link in the body may reduce on-platform reach because it pulls attention off LinkedIn before the post has had time to fully circulate, while many creators now treat "link in first comment" as an unofficial workaround rather than a documented platform rule. State this as the honest, hedged tradeoff it actually is — do not present either option as a guaranteed algorithmic fact, since that would be presenting a widely repeated creator heuristic as settled, verified behavior.

CLOSE TOWARD A SPECIFIC GOAL
End with a call to action aimed at {{cta_goal}} that feels native to a LinkedIn post — an invitation to discuss, disagree, or share a related experience — not "read the full article here," which reads as a redirect away from the platform rather than an invitation to engage on it.

OUTPUT
The chosen argument and the rejected candidates with reasons, the rewritten post, and the link-placement recommendation with its stated tradeoff.`,
    variables: [
      {
        name: 'blog_post_content_or_summary',
        description:
          'The blog post text, or a thorough summary of its argument and sections',
        example:
          'A 1,400-word post arguing that most startups over-invest in onboarding flows before they have enough retained users to know what actually needs onboarding, with 3 supporting examples.',
        required: true,
      },
      {
        name: 'single_argument_to_lead_with',
        description: "The one argument you already think is strongest, if you've decided",
        example:
          "You can't design onboarding for a retention problem you haven't diagnosed yet",
        required: false,
      },
      {
        name: 'blog_url',
        description: 'The URL of the original post, for context only',
        example: 'https://example.com/blog/onboarding-before-retention',
        required: false,
      },
      {
        name: 'audience',
        description: 'Who this LinkedIn version is written for',
        example:
          'Early-stage founders and product leads obsessing over onboarding too early',
        required: true,
      },
      {
        name: 'cta_goal',
        description: 'What you want the reader to do after reading, beyond reacting',
        example:
          'Get people replying with their own experience trying to fix onboarding too early',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['repurposing', 'content-strategy', 'blog-to-social', 'post-writing'],
    whyItWorks: `A blog post's structure — SEO-driven subheadings, longer paragraphs built for skimmability on a search-results landing page, and a headline written to match search intent rather than to stop a scroll — is instantly recognizable as crossposted the moment any of that structure survives into the feed, even after light trimming. Readers register "this was pasted from somewhere else" before they process whether the content itself is good, which is a first-impression cost this rewrite step is specifically designed to eliminate.

Forcing the model to name the single strongest argument and explicitly state what it left out, rather than silently compressing everything, prevents the default failure mode of most repurposing attempts: compressing every section proportionally instead of committing to one point, which produces a post that reads as a shrunk blog post rather than a real, native piece of content that happens to share a source with one.

The honest, hedged answer on link placement matters specifically because the "link in first comment" habit is a widely repeated creator heuristic passed around informally, not a confirmed rule from LinkedIn's own documentation about how its ranking treats native versus off-platform links. A prompt that stated it as settled fact would be teaching a myth as though it were verified platform behavior, and the actual honest answer — a real tradeoff, not a solved problem — is more useful than false confidence either way.

Explicitly banning the reused blog headline as the post's hook targets a subtle but common mistake: a headline optimized for search intent describes the topic ("5 Reasons Startups Over-Invest in Onboarding"), while a hook optimized for a scroll has to create tension or curiosity in the first line regardless of topic — these are different jobs, and a headline doing double duty as a hook usually does neither job particularly well.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-30' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    relatedToolSlug: 'utm-builder',
  },
  {
    slug: 'linkedin-hiring-post-that-attracts-candidates',
    category: 'linkedin',
    title: 'Write a LinkedIn hiring post that gets read, not scrolled past',
    description:
      'Turn a job opening into a post-native hiring announcement that leads with the real problem the hire will own and names one genuinely hard part of the role, distinct from a pasted job description with a company logo attached.',
    promptText: `ROLE
{{role_title}}

WHAT THIS PERSON WILL ACTUALLY SPEND TIME DOING
{{what_they_will_actually_do}}

TEAM AND COMPANY CONTEXT
{{team_or_company_context}}

WHAT'S GENUINELY DIFFERENT ABOUT THIS ROLE, IF ANYTHING
{{what_makes_this_role_different}}

HOW TO APPLY
{{how_to_apply}}

WHY A PASTED JOB DESCRIPTION GETS SCROLLED PAST
A candidate actively looking sees dozens of nearly identical hiring posts in a single feed session, most of which are a job description with a company logo attached. The post's only real job is to give the right candidate a reason to recognize themselves in the first line — leading with the actual problem this hire will own does that; leading with the title or "We're hiring!" does not, because both of those are true of every other post in the same feed session.

STRUCTURE
1. HOOK — lead with the real problem this hire will own or solve, specific enough that the right candidate recognizes it immediately, never "We're hiring a {{role_title}}!" or any framing that announces the post's category before delivering its content.
2. A TYPICAL WEEK — 2-3 concrete things this person will actually do, drawn from {{what_they_will_actually_do}}, not a list of responsibilities that reads like it was lifted from a generic job-description template for this title.
3. ONE HONEST DIFFICULTY — state one genuinely hard part of the role, not a fake weakness dressed up as a positive ("you'll work with passionate people" is not a difficulty, it's a compliment wearing a difficulty's clothes). Name an actual constraint, gap, or hard tradeoff a candidate should walk in knowing about.
4. ONE TRUE, SPECIFIC DETAIL about the team or company, grounded in something real from {{team_or_company_context}} — never a generic "fast-paced, dynamic environment" that could describe any company posting any job.
5. A SINGLE CLEAR NEXT ACTION — exactly what's given in {{how_to_apply}}, stated once, clearly, at the end.

BANNED PHRASES
Do not use "rockstar," "ninja," "wear many hats," "work hard play hard," "fast-paced environment," or any close variant of these — they function as a documented candidate-repellent signal precisely because every other recruiting post on the platform uses the same handful of phrases, so a post using them reads as generated from the same template as everything the candidate is already scrolling past.

SELF-CHECK
After drafting, review the post specifically against the banned-phrase list above and flag if any snuck in under a slightly different wording (a synonym for "wears many hats," for instance) rather than the exact phrase — the intent behind the ban matters more than the literal string match.

OUTPUT
The finished post, followed by a confirmation that the self-check ran and found nothing from the banned list, or a note on what was caught and fixed.`,
    variables: [
      {
        name: 'role_title',
        description: 'The job title being hired for',
        example: 'Senior Backend Engineer',
        required: true,
      },
      {
        name: 'what_they_will_actually_do',
        description: 'The real, specific work this person will own',
        example:
          'Rebuild our billing pipeline off a legacy system that breaks under load spikes',
        required: true,
      },
      {
        name: 'team_or_company_context',
        description:
          'Real, specific context about the team or company — not marketing copy',
        example: 'Team of 4 engineers, no dedicated DevOps, we ship every Friday',
        required: true,
      },
      {
        name: 'what_makes_this_role_different',
        description: 'Anything genuinely distinct about this role, if there is something',
        example:
          'You would be the first backend hire with real ownership over architecture',
        required: false,
      },
      {
        name: 'how_to_apply',
        description: 'The exact next action for an interested candidate',
        example: 'DM me directly or apply at example.com/careers/backend-engineer',
        required: true,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['hiring', 'recruiting', 'employer-branding', 'job-post'],
    whyItWorks: `A hiring post competing against dozens of visually near-identical job-description-with-a-logo posts in the same feed session has to win in the first line specifically, because that's the only part of the post most candidates will see before deciding whether to keep reading. Leading with the actual problem the hire will own, instead of the job title, is what lets the right candidate self-select in based on content rather than a title match alone, which is a stronger and faster filter than any title could provide by itself.

Including one genuinely hard part of the role is counterintuitive but mechanically important: omitting the honest difficulty doesn't make the role look more attractive, it makes the entire post read as less trustworthy, because every experienced candidate already assumes every role has real difficulties, and a post with none listed reads as either naive or dishonest about what the job actually involves — naming one difficulty plainly is what signals the rest of the post's claims are probably honest too.

Banning specific corporate hiring clichés and requiring an explicit self-check against them targets a real, documented pattern: phrases like "wears many hats" and "fast-paced environment" have become recognizable candidate-repellent signals precisely because they're used interchangeably across thousands of otherwise-different job posts, which means using them costs credibility regardless of how good the actual role is — the self-check step exists because these phrases are common enough that they slip in as filler even when the rest of the draft is genuinely specific.

Requiring the specific team or company detail to be grounded in {{team_or_company_context}}, rather than allowed to default to generic descriptive language, matters because a specific true detail — "4 engineers, no dedicated DevOps, ship every Friday" — gives a candidate something concrete to evaluate fit against, while "fast-paced, dynamic environment" gives them nothing to actually assess. The second phrase is compatible with almost any company, which is precisely why it communicates nothing.`,
    exampleOutput: `Our billing pipeline breaks every time we get a traffic spike, and right now that's a 2am page for whoever's on call.

We're hiring a senior backend engineer to rebuild it properly — not patch it again.

A typical week: redesigning the queue architecture, pairing with our one other backend engineer on load testing, and making the call on what gets rebuilt first versus what can wait.

Honest part: there's no dedicated DevOps here yet, so you'll own more infrastructure decisions than a senior role at a bigger company usually would.

We're 4 engineers, ship every Friday, and you'd be the first person with real architectural ownership on this system.

DM me or apply at example.com/careers/backend-engineer.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-31' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-post-performance-analysis-and-iterate',
    category: 'linkedin',
    title: 'Turn your LinkedIn post analytics into one specific next-post hypothesis',
    description:
      "Feed in the numbers LinkedIn's own post-analytics panel gives you and get a plain-language read on what actually happened, plus exactly one testable change for the next post — not a re-explanation of the numbers you already have, and no invented or rounded figures.",
    promptText: `POST SUMMARY
{{post_content_summary}}

ANALYTICS AS SHOWN IN LINKEDIN'S POST-ANALYTICS PANEL
{{analytics_data}}

COMPARABLE PREVIOUS POST, IF AVAILABLE
{{comparison_post}}

WHAT YOU WANT THE NEXT POST TO DO BETTER
{{goal_for_next_post}}

TIME SINCE THIS POST WENT LIVE
{{time_since_posting}}

DATA DISCIPLINE
Treat every number in {{analytics_data}} as correct exactly as given. Do not recalculate, round, estimate, or infer a number that wasn't provided, even if a rounder or more impressive-sounding figure would make the analysis read more cleanly. If a number needed for a clean read is missing, say what's missing instead of substituting an assumption for it.

DELIVER FOUR THINGS
1. VERDICT — one sentence on whether this beat or underperformed {{comparison_post}}. If no comparison was given, say so plainly instead of inventing an implicit baseline to compare against.
2. THE SPECIFIC SIGNAL — LinkedIn's Discovery breakdown separates impressions into a follower versus non-follower split, and separately reports reactions, comments, and reposts; these are different signals calling for different next moves. A high non-follower percentage suggests the algorithm pushed this post beyond the existing network, often via topic or hashtag; a high comment-to-reaction ratio suggests the content itself provoked genuine discussion rather than passive scrolling-by likes. Name which specific signal is actually present in {{analytics_data}} — don't collapse everything into a vague "engagement was good."
3. ONE TESTABLE CHANGE — a single variable to change for the next post: hook style, format, posting time, or topic — never more than one at once, so a result from the next post can actually be attributed to something specific rather than to an unknown combination of simultaneous changes.
4. ONE THING THAT'S ALREADY WORKING — something to deliberately hold constant while testing the variable above, so a real improvement doesn't get accidentally undone by changing something that was already contributing to the result.

TIME-CONTEXT CHECK
Factor in {{time_since_posting}} — a post analyzed six hours after publishing and one analyzed two weeks later are at very different points in their lifecycle, and a verdict on the six-hour version should be stated as provisional, not final, if the comparison post's numbers were captured at a later point in its own lifecycle.

GAP HANDLING
If the data given genuinely doesn't support a confident read on any of the four items above, say exactly what additional number or context you'd need instead of producing a plausible-sounding guess in its place.

OUTPUT
The four items in order, each clearly labeled, plus the time-context caveat if relevant, plus any explicit data gaps named rather than papered over.`,
    variables: [
      {
        name: 'post_content_summary',
        description: 'A short summary of what the post said and its format',
        example:
          'Text-only post, personal story about a missed deadline with a client, no link',
        required: true,
      },
      {
        name: 'analytics_data',
        description: 'The actual numbers from the post-analytics panel, pasted as given',
        example:
          'Impressions: 14,200. Reactions: 310. Comments: 62. Reposts: 8. Discovery: 71% non-follower, 29% follower.',
        required: true,
      },
      {
        name: 'comparison_post',
        description: "A previous post's numbers to compare against, if available",
        example:
          "Last month's carousel post: 9,800 impressions, 190 reactions, 14 comments, 44% non-follower",
        required: false,
      },
      {
        name: 'goal_for_next_post',
        description: 'What you specifically want the next post to improve',
        example:
          'More comments from people I could plausibly work with, not just raw reach',
        required: false,
      },
      {
        name: 'time_since_posting',
        description:
          'How long ago the post went live, since this affects how final the read is',
        example: '5 days — the post has largely finished circulating',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT'],
    tags: ['analytics', 'performance-analysis', 'iteration', 'content-strategy'],
    whyItWorks: `LinkedIn's own analytics panel breaks impressions into a follower-versus-non-follower Discovery split and reports reactions, comments, and reposts as separate figures specifically because they represent different underlying behaviors. A non-follower spike points at algorithmic distribution beyond the existing audience, usually topic- or hashtag-driven, while a high comment-to-reaction ratio points at the content itself provoking active thought rather than passive scrolling-by approval. Collapsing these into one "engagement was good" verdict throws away the one piece of diagnostic information the platform actually provides for free.

The strict data-discipline rule — treat every given number as correct, never round or estimate a missing one — exists because a plausible-sounding fabricated number is worse than an honest gap. A model asked to interpret performance data will, left unconstrained, sometimes "helpfully" smooth over a missing figure with a reasonable-sounding estimate, and a business decision made on that estimate is a decision made on a number nobody actually measured, which compounds silently across a series of posts if it's never caught.

Restricting the recommendation to exactly one changed variable is what turns the next post into an actual experiment rather than a fresh guess. A post that simultaneously changes the hook style, the format, and the posting time, then does better or worse than the last one, produces zero attributable information about which of the three changes mattered, whereas a single-variable change means the next comparison actually teaches something usable for the post after that.

Requiring one thing to deliberately hold constant protects the experiment from its own success: a common failure after a strong post is to change everything for the next one out of enthusiasm, which accidentally discards whatever was already working alongside whatever gets newly tested. Naming the thing to protect is what keeps a real improvement from being undone by an unrelated, well-intentioned change made in the same pass.`,
    exampleOutput: `Verdict: this outperformed the comparison post on both reach and depth — impressions up 45%, but the more telling number is comments per impression, which is roughly 3x the carousel post's rate.
Signal: 71% non-follower reach plus a high comment count together suggest this spread via genuine discussion, not just algorithmic hashtag push alone — the story format is doing real work here, not just topic luck.
One variable to test next: try the same personal-story structure on a topic outside your usual niche, to see if the discussion-driving effect is about the format or about this specific story.
Don't change: keep it text-only and link-free — you have no evidence a link or carousel format would have done better here, and changing it now would confound the next test.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-01' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish for the rewritten linkedin category, scoped to interpretation-only after testing showed models will otherwise "helpfully" estimate missing metrics instead of asking for them.',
      },
    ],
  },
  {
    slug: 'linkedin-newsletter-issue-outline',
    category: 'linkedin',
    title: 'Outline a LinkedIn Newsletter issue that earns the next subscribe',
    description:
      "Structure a recurring LinkedIn Newsletter issue around a subject-line-style headline, a skimmable subheading structure, and one small recurring feature — because a newsletter's job is retention across issues, not one-time reach the way a single post's job is.",
    promptText: `NEWSLETTER TOPIC AND THIS ISSUE'S FOCUS
{{newsletter_topic_and_issue_focus}}

NEWSLETTER NAME AND EXISTING PREMISE
{{newsletter_name_and_premise}}

WHO SUBSCRIBES, NOT JUST WHO READS THIS ONE ISSUE
{{subscriber_audience}}

WHAT THIS ISSUE COVERS, IN YOUR OWN WORDS
{{issue_content_notes}}

HOW LONG PAST ISSUES HAVE RUN
{{typical_issue_length}}

WHY A NEWSLETTER ISSUE IS A DIFFERENT JOB THAN A POST
LinkedIn Newsletters notify every subscriber the moment an issue publishes, and surface it in subscribers' feeds and notification bell; the newsletter also builds a subscriber count publicly displayed on your profile. Treat this differently from a normal post because you're writing for people who already opted in to hear from you again, not a cold feed impression — the goal is retention (does this subscriber open issue 12?), not one-time reach.

STRUCTURE
1. HEADLINE — must work as a subject-line-style headline, not a hook line for a scroll; specific enough that a subscriber knows if this issue applies to them before opening, the way a good email subject line works rather than the way a curiosity-gap post hook works.
2. COVER FRAMING — one to two sentences under the headline stating the concrete question or problem this issue answers.
3. BODY STRUCTURE — since a newsletter issue can run far longer than a normal post without truncation being the immediate concern, structure with 3-5 subheadings, each a genuine section, not filler; every subheading should be skimmable on its own so a subscriber can navigate to the part relevant to them.
4. ONE RECURRING ELEMENT — every issue should contain at least one small recurring feature (a "found this" link roundup, a reader question, a number of the week) so subscribers who skip a topic-heavy issue still have a reason to open the next one.
5. CLOSE — end each issue with a specific, single next action or a question inviting subscriber reply, not a generic "let me know your thoughts."

CONTENT AND LENGTH CHECK
Don't pad with an introduction paragraph restating the headline — the first two sentences carry the entire framing job. Flag if {{issue_content_notes}} contains only enough material for a normal post, not a full issue — better to say "this is a post, not an issue" than to pad thin content to look substantial. Compare the implied length against {{typical_issue_length}} and flag if this draft runs notably shorter or longer without a stated reason.

OUTPUT
Headline, cover framing, then body organized under the subheadings, recurring element clearly marked, close. After the draft, one line stating whether this issue's length matches the established pattern from {{typical_issue_length}}.`,
    variables: [
      {
        name: 'newsletter_topic_and_issue_focus',
        description:
          'What this newsletter covers overall, and what this specific issue is about',
        example:
          'A weekly newsletter on B2B pricing strategy — this issue covers usage-based pricing rollout mistakes',
        required: true,
      },
      {
        name: 'newsletter_name_and_premise',
        description:
          "The newsletter's name and its established angle or promise to subscribers",
        example:
          '"The Pricing Post" — a weekly breakdown of one real pricing decision, good or bad',
        required: true,
      },
      {
        name: 'subscriber_audience',
        description:
          'Who subscribes to this specific newsletter, not just who might read one issue',
        example:
          'B2B SaaS founders and RevOps leads who opted in expecting pricing-specific content',
        required: true,
      },
      {
        name: 'issue_content_notes',
        description: 'What you actually want to cover in this issue, in your own words',
        example:
          'Three companies that rolled out usage-based pricing and had to walk it back within a year, and what each one missed',
        required: true,
      },
      {
        name: 'typical_issue_length',
        description: 'Roughly how long past issues have run, for consistency',
        example: 'Past issues have run 700-900 words with 4 subheadings',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: [
      'newsletter',
      'long-form',
      'subscriber-retention',
      'content-strategy',
      'linkedin-native-features',
    ],
    whyItWorks: `LinkedIn Newsletters push a notification to every subscriber on publish and surface the issue via feed and bell — meaning the population reading this is opted-in and returning, unlike a single post, which changes what "good" writing means here: retention across issues, not one-time reach, so the calibration criteria differ from a normal post prompt in a way that matters for every structural decision in the outline.

The explicit recurring-element requirement names actual subscriber behavior: a subscriber who isn't interested in this issue's specific topic decides whether to keep opening future issues based on whether there is something reliably there for them regardless of topic. A topic-only newsletter has no floor — every issue is a fresh bet on whether this week's subject matches this subscriber's current interest, with nothing constant to fall back on.

The instruction to flag thin content protects the newsletter's stated cadence. Issue-quality variance — some issues meaty, some functionally filler — is one of the most common reasons subscribers cite for unsubscribing when asked directly, and forcing the model to name when material doesn't support the length format keeps that padding from ever quietly happening in the first place, rather than catching it after publish when the damage to subscriber trust is already done.

Treating the headline as subject-line-style rather than hook-style matters because the two formats are read under different conditions: a post hook has to survive a scroll and a truncation cutoff in a crowded feed, while a newsletter headline is read by someone who already decided to open a notification — the job there is accurate self-selection ("does this issue apply to me right now"), not curiosity-gap tension, and conflating the two produces a headline that either underperforms in the feed or misleads a subscriber about what the issue actually covers.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-02' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-recommendation-writing-for-colleague',
    category: 'linkedin',
    title:
      'Write a LinkedIn recommendation that would actually help someone get their next role',
    description:
      'Turn specific, real memories of working with someone into a recommendation structured around a hire-relevant claim and one honest specific detail, instead of a string of interchangeable adjectives that could describe almost anyone on the platform.',
    promptText: `WHO I'M WRITING THIS FOR AND OUR WORKING RELATIONSHIP
{{person_and_relationship}}

WHAT I ACTUALLY SAW THEM DO — specific projects, situations, decisions
{{specific_examples}}

THE ROLE OR DIRECTION THEY'RE LIKELY GOING FOR NEXT, IF I KNOW
{{their_likely_next_role}}

ONE THING THEY'D WANT EMPHASIZED, IF THEY TOLD ME
{{what_they_want_emphasized}}

HOW WELL I ACTUALLY KNOW THEM
{{how_well_you_know_them}}

WHY GENERIC PRAISE ACTIVELY UNDERMINES CREDIBILITY
A LinkedIn recommendation sits permanently on the recipient's profile next to their role history, and a hiring manager or recruiter skimming a profile reads it as third-party evidence — but only if it reads as specific. A recommendation built entirely from adjectives ("hardworking," "great team player," "a pleasure to work with") is recognized instantly as a template and actually undermines credibility because it signals the writer either didn't know the person well or didn't think enough to write something real.

RULES
1. OPEN with one sentence naming the actual working relationship and duration — how you know them, not a generic "I had the pleasure."
2. LEAD the body with the single most relevant claim to {{their_likely_next_role}} if known, otherwise the single strongest thing you actually witnessed — not a list of five traits given equal weight.
3. BACK the claim with one specific example from {{specific_examples}} — a real project, a real decision, a moment, not a restated trait ("they are very organized, for example they are organized").
4. INCLUDE exactly one honest specific detail that isn't generic praise — something only someone who actually worked with them would know or say (a role they stepped into unasked, a hard moment they handled a specific way).
5. CLOSE with one sentence stating plainly what kind of team or role they'd be strong in next, tied to the evidence above, not a generic "any team would be lucky to have them."
6. KEEP it under 1,900 characters — LinkedIn recommendations have no strict limit, but readability drops hard past this length.

HONESTY CONSTRAINT
Do not claim a closeness or scope of work you weren't given in {{how_well_you_know_them}} — if you only worked with them for a few months on one project, the recommendation should read like that, not like a five-year mentor relationship. A recommendation that overstates the relationship is checkable against the same profile's dates and titles, and a mismatch there costs the writer's credibility, not just the request's usefulness.

OUTPUT
The recommendation text, its character count, plus one line noting which specific example carried the most weight and why you led with it over the others given.`,
    variables: [
      {
        name: 'person_and_relationship',
        description: "Who you're writing this for and how you actually know them",
        example: 'A designer I managed for 14 months on the growth team',
        required: true,
      },
      {
        name: 'specific_examples',
        description: 'Real projects, decisions, or moments you actually witnessed',
        example:
          'She redesigned our onboarding flow after independently noticing drop-off data nobody had asked her to look at, and pushed back on a launch date when usability testing surfaced a real problem, which delayed us two weeks but avoided a much worse post-launch fix',
        required: true,
      },
      {
        name: 'their_likely_next_role',
        description: "What role or direction they're likely pursuing next, if you know",
        example: 'Senior product designer roles at a larger B2B SaaS company',
        required: false,
      },
      {
        name: 'what_they_want_emphasized',
        description: "Anything specific they told you they'd want highlighted",
        example: 'Their ability to work independently without close direction',
        required: false,
      },
      {
        name: 'how_well_you_know_them',
        description:
          'The real scope and duration of the working relationship, stated plainly',
        example: 'Direct manager for 14 months, worked closely on 3 major projects',
        required: true,
      },
    ],
    targetTools: ['Claude', 'ChatGPT'],
    tags: [
      'recommendations',
      'testimonials',
      'profile-optimization',
      'networking',
      'career',
    ],
    whyItWorks: `Recommendations sit permanently attached to a specific role in a profile's history, next to real names, which is precisely why generic-adjective ones are so easy for a reader to spot and discount — a reader skimming five recommendations quickly learns to differentiate the two that mention an actual project from the three that could be pasted onto any employee at any company.

Leading with the claim most relevant to the person's likely next role, rather than listing traits in whatever order they come to mind, matches how a hiring manager actually reads a profile: they are scanning for evidence relevant to a specific decision, not building a rounded personality profile, so a recommendation structured around "why this decision" outperforms one structured around "who this person is in general," even when both versions contain the same underlying facts about the person.

The honesty constraint about scope of relationship protects against the second most damaging failure mode after genericness: an inflated claim of closeness or authority ("I mentored them for years") that a reader can quietly cross-check against the stated job titles and dates on the same profile. A mismatch there costs the writer's own credibility on every other claim in the recommendation, not just the inflated one, because a reader who catches one overstatement reasonably discounts the rest of the text too.

Requiring exactly one honest specific detail beyond the main evidence-backed claim targets a real gap in most recommendations: even a well-structured one built around a single strong claim can still read as constructed if every sentence in it serves the argument too neatly, whereas one small, specific, slightly unpolished detail — the kind only an actual colleague would think to mention — is what signals the whole thing was written by someone who was really there, not assembled from a template with the right shape.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-02' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-featured-section-curation-plan',
    category: 'linkedin',
    title: "Decide what belongs in your LinkedIn Featured section, and cut what doesn't",
    description:
      "Turn a scattered list of your posts, articles, media, and links into a curated Featured section that argues one specific thing about you to a specific visitor, instead of a junk drawer of everything you've ever published in upload order.",
    promptText: `CANDIDATE ITEMS I COULD FEATURE
{{candidate_items}}

WHO IS MOST LIKELY TO LOOK AT MY PROFILE RIGHT NOW
{{primary_visitor}}

THE ONE THING I WANT A VISITOR TO WALK AWAY BELIEVING
{{single_takeaway}}

HOW MANY SLOTS I HAVE OR WANT TO USE
{{slot_count}}

ANYTHING CURRENTLY FEATURED I SHOULD RECONSIDER
{{currently_featured}}

WHY THIS SECTION IS THE ONE PART OF A PROFILE YOU FULLY CONTROL
The Featured section sits directly under About, above the work-experience timeline, and is the only part of a profile where you — not a chronological feed or an algorithm — choose exactly what a visitor sees first and in what order. Most profiles either leave it empty or fill it with everything available, which does roughly the same job as leaving it empty, because a visitor skims a wall of six unranked items about the same way they skim none.

TASK
1. For each item in {{candidate_items}}, state in one line what specific claim about you it provides evidence for — not a description of what the item is, a description of what it proves.
2. Group items that prove the same claim and pick only the strongest one from each group — redundant proof of the same point wastes a slot that could prove something else entirely.
3. Select and order exactly {{slot_count}} items so that, read left to right, they build toward {{single_takeaway}} rather than presenting a random assortment — order matters because the leftmost items are what a visitor sees without any interaction on most viewports.
4. For each selected item, write the exact title or caption text LinkedIn will display it under — short, specific, never the item's default filename or an untitled link preview.
5. For anything cut, or anything from {{currently_featured}} being removed, state the specific reason — not just "less relevant" but what it fails to prove that a kept item proves better.

CONSTRAINT
Don't recommend cramming in an item "just to show range" if it doesn't serve {{single_takeaway}} — a Featured section proving five unrelated things about you proves none of them convincingly to a visitor who spends ten seconds on it.

OUTPUT
The final ordered list with captions, then a short "cut and why" list, then one line on whether {{single_takeaway}} is actually well-served by what's realistically available in {{candidate_items}} — flag it if the strongest available items don't actually support the takeaway you said you wanted.`,
    variables: [
      {
        name: 'candidate_items',
        description:
          'Everything you could feature — posts, articles, links, media, documents',
        example:
          '3 LinkedIn posts about pricing case studies, one Article on usage-based pricing, a link to a podcast appearance, a slide deck from a webinar',
        required: true,
      },
      {
        name: 'primary_visitor',
        description: 'Who actually looks at your profile most right now',
        example:
          'Founders considering hiring a pricing consultant, found via referral or a post',
        required: true,
      },
      {
        name: 'single_takeaway',
        description: 'The one thing you want a visitor to walk away believing about you',
        example:
          'This person has actually diagnosed and fixed real pricing mistakes, not just theorized about them',
        required: true,
      },
      {
        name: 'slot_count',
        description: 'How many featured items you want to end up with',
        example: '4',
        required: false,
      },
      {
        name: 'currently_featured',
        description:
          'What is currently in your Featured section, if anything, to reconsider',
        example:
          'An old conference speaker badge and a general "About me" video from 2 years ago',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['featured-section', 'profile-optimization', 'personal-branding', 'curation'],
    whyItWorks: `The Featured section is positioned directly below About and above the reverse-chronological work history — it is structurally the one part of a LinkedIn profile under full author control, not fed by an algorithm or forced into date order, which is exactly why an unranked pile of items in it fails: nothing about the section's design does the prioritization for you the way a feed's recency sort would for a post.

Requiring a one-line "what claim does this prove" pass before selection targets the actual reason most Featured sections are incoherent: items get added because they exist and felt worth sharing at the time, not because they were chosen against a stated goal. Forcing the claim-first framing surfaces redundant proof — three case studies proving the same "I ship results" point — that a visual skim of titles alone would not reveal, since the titles can look different even when the underlying claim is identical.

The order constraint matters because the section renders as a horizontally scrollable row where the first one or two items are visible without any interaction on most viewports. An item buried at slot five is functionally unseen by a large share of visitors, so treating slot order as a real design decision rather than upload order is what actually changes what most visitors take away from the ten seconds they spend on this part of the profile.

The instruction to name a specific reason for every cut, rather than a vague "less relevant," forces the curation itself to be defensible — a cut made against a stated claim ("this proves I can speak publicly, which isn't the takeaway we're going for") is a real editorial decision, while a cut made on vibes alone is exactly the kind of judgment call that gets silently reversed the next time someone edits the section and can't remember why an item was removed.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-03' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and Gemini (Gemini 3 Pro).',
      },
    ],
  },
  {
    slug: 'linkedin-article-vs-post-decision-and-outline',
    category: 'linkedin',
    title:
      'Decide if this idea is a LinkedIn Article or a post, then outline whichever one it is',
    description:
      "Run an idea against the real structural tradeoff between LinkedIn's native long-form Articles and the feed post format — reach now versus findability later — then produce the outline for whichever format the idea actually earns, instead of defaulting to Article for anything over three paragraphs.",
    promptText: `THE IDEA OR ARGUMENT
{{idea_or_argument}}

HOW MUCH MATERIAL I ACTUALLY HAVE
{{material_available}}

WHO THIS IS FOR
{{audience}}

WHETHER THIS NEEDS TO BE FINDABLE LATER VIA SEARCH, NOT JUST SEEN ONCE IN THE FEED
{{needs_findability}}

WHY THIS IS A REAL TRADEOFF, NOT JUST A LENGTH DECISION
LinkedIn Articles are indexed and can surface in search — both LinkedIn's own and, at times, external search engines — far longer than a post's effective feed life. They support real subheadings, embedded images, and a much longer format, but get meaningfully less feed distribution and impression volume than a native post, and readers have to click through rather than consuming in-feed. A post reaches more people in the first 48 hours; an Article works for less but for longer, is more discoverable months later, and reads as more considered.

DECISION STEP
Look at {{material_available}} and {{needs_findability}} and decide: does this argument actually need Article-length space to make its case — multiple sub-arguments, evidence that needs unpacking, something worth someone finding via search in six months — or is it one point that a well-hooked post would deliver more efficiently and to a larger immediate audience? State the decision and the specific reason, not a default toward the longer format because more content feels more substantial.

IF POST
Produce a hook-first outline — hook line, 3-5 short paragraph beats, close — sized to the single strongest point in {{idea_or_argument}}, explicitly setting aside any sub-points that don't fit. Name what got cut and why cutting it doesn't weaken the core argument.

IF ARTICLE
Produce a full outline: a headline written for both a scrolling reader and a future searcher, so it should name the actual topic, not a curiosity-gap tease; a short opening that states the argument's conclusion up front rather than building to it, since Articles are opted into by a click and there is no "see more" cutoff forcing a delayed payoff; 3-6 subheadings each covering one sub-argument from {{material_available}}; and a closing section that states what a reader should do or think differently, not just a summary of what was said.

ACCOMPANYING FEED POST
If the decision is Article, still write a short native post (2-4 lines) meant to accompany and link to it in the feed, since an Article posted with no accompanying feed post gets close to zero organic discovery on its own.

OUTPUT
The decision and reason, then the outline for whichever format was chosen, then, if Article, the accompanying feed post.`,
    variables: [
      {
        name: 'idea_or_argument',
        description: 'The core idea or argument you want to write about',
        example:
          'Most product teams measure feature adoption too early to mean anything useful',
        required: true,
      },
      {
        name: 'material_available',
        description:
          'How much you actually have to say — a rough word count or list of sub-points',
        example:
          '4 distinct sub-arguments with a real example for each, roughly 1,200 words worth of material',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who this is written for',
        example:
          'Product managers at Series A-B startups making adoption-metric decisions',
        required: true,
      },
      {
        name: 'needs_findability',
        description:
          'Whether this needs to be searchable later, not just seen once in the feed',
        example:
          'Yes — I want to link this from my profile and reuse it as a reference for months',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT'],
    tags: [
      'long-form',
      'linkedin-articles',
      'content-strategy',
      'seo',
      'format-decision',
    ],
    whyItWorks: `This names the actual tradeoff LinkedIn's own format design creates: Articles get indexed and persist findably for a much longer window than a feed post's effective lifespan, but the platform's own distribution mechanics send Articles meaningfully less initial reach than a native post of comparable quality. Treating "worth writing a lot about" and "worth an Article specifically" as the same question is the actual mistake this prompt is built to catch, and it is a mistake the length of the draft alone can't reveal — a long, rambling post is still the wrong call even at Article length, and a tight, well-evidenced short piece can still be the wrong call as a post if it needs to be found again in six months.

The instruction to state the argument's conclusion up front for an Article, rather than building suspense, matches a real behavioral difference: a reader who clicked into an Article already opted in past the feed's scroll-past decision, so there's no equivalent of the "see more" truncation forcing a delayed payoff. The incentive structure that makes hook-and-withhold work for a post actively works against an Article, where a reader who has to hunt for the point mid-Article is more likely to abandon it than a feed scroller who never fully committed to reading in the first place.

Requiring an accompanying feed post when Article is chosen targets a documented distribution gap: an Article without a linked feed post has essentially no independent discovery path outside a visitor's own profile or a direct link, so treating the two as one publishing unit rather than a single standalone Article is what actually gets an Article read at all, not an afterthought tacked on to the outline once the "real" work of writing the Article is done.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-03' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-company-page-post-brand-voice',
    category: 'linkedin',
    title: "Write a Company Page post that doesn't read like it was written by nobody",
    description:
      "Draft posts for a LinkedIn Company Page in a defined brand voice, routed through a named person's quote where possible, that name a real audience benefit instead of announcing company news at the company itself.",
    promptText: `WHAT WE'RE ANNOUNCING OR POSTING ABOUT
{{announcement_or_topic}}

COMPANY, WHAT WE DO, IN ONE LINE
{{company_and_what_it_does}}

WHO ACTUALLY FOLLOWS THIS PAGE
{{page_audience}}

BRAND VOICE NOTES
{{brand_voice_notes}}

WHETHER A NAMED PERSON SHOULD BE QUOTED OR CREDITED
{{named_person_option}}

WHY COMPANY PAGE POSTS START AT A DISTRIBUTION DISADVANTAGE
Company Page posts structurally underperform personal-profile posts on LinkedIn's own distribution — the platform's algorithm and its users both engage more with posts that appear to come from a person, not an organization. A page post that reads like a press release compounds an existing distribution disadvantage instead of working around it. A page post that works either translates company news into something the specific audience in {{page_audience}} gets value from directly, or borrows a real person's voice via a quote or named credit, rather than speaking in the page's own institutional voice throughout.

RULES
1. Do not open with "We're excited to announce" or any close variant — open with the concrete thing that changed for {{page_audience}}, stated plainly.
2. If {{named_person_option}} allows it, build the post around a quote or attributed observation from a real named person at the company — a founder, the engineer who built the thing, a customer-facing lead — rather than writing purely as the institutional "we."
3. State one specific detail that only someone who actually worked on this would know — a real number, a real tradeoff made, a real timeline — not marketing language a competitor's identical announcement could reuse word for word.
4. Match {{brand_voice_notes}} exactly on formality and personality level; do not default to a generic "professional but friendly" voice if the notes specify something more distinct.
5. Close with a single next action relevant to {{page_audience}} specifically — not a generic "learn more" if the actual next step is different for different segments of the audience, in which case say so and offer two close options.

LENGTH CHECK
Keep total length under what a scrolling reader would read as a press release. If the draft is running past roughly 150 words with no quote or specific detail yet introduced, that is itself a sign it has drifted into institutional voice — flag it rather than only fixing it silently.

OUTPUT
The post, then one line stating which of the five rules was hardest to satisfy given what was provided, and what would need to be true (for example, an actual person willing to be quoted) to satisfy it fully next time.`,
    variables: [
      {
        name: 'announcement_or_topic',
        description: 'What the post is actually about',
        example:
          'We just shipped a feature that cuts our average support ticket response time from 6 hours to 40 minutes',
        required: true,
      },
      {
        name: 'company_and_what_it_does',
        description: 'One line on who the company is and what it does',
        example: 'A 40-person customer support platform for mid-market e-commerce brands',
        required: true,
      },
      {
        name: 'page_audience',
        description: 'Who actually follows this page, specifically',
        example: 'Existing customers, plus support-team leads evaluating the platform',
        required: true,
      },
      {
        name: 'brand_voice_notes',
        description: 'How formal, how much personality, and any words to avoid',
        example:
          'Direct and a little dry, no exclamation points, never say "revolutionary" or "game-changing"',
        required: true,
      },
      {
        name: 'named_person_option',
        description: 'Whether a named person at the company can be quoted or credited',
        example:
          'Yes — the engineering lead who built this is willing to be quoted directly',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['company-page', 'brand-voice', 'b2b-marketing', 'announcements'],
    whyItWorks: `LinkedIn's own engagement patterns and its algorithm both structurally favor posts that read as coming from an identifiable person over posts from an organizational page — this is a real, documented distribution gap, not a stylistic preference, which is why routing the post through a named person's quote or voice is a mechanical workaround for a real handicap, not just a tone choice.

The instruction to open with the concrete change for the audience, not the announcement itself, targets the actual difference between institutional and audience-first writing. "We're excited to announce our Series B" states news about the company; "Our support response time is about to get three times faster because of what we just closed" states news about the reader's experience — the same underlying fact, framed around who is reading rather than who is speaking.

The self-check for drifting past roughly 150 words with no specific detail catches company-voice posts at the exact point they tend to go wrong. Institutional writing has no natural length limit the way a personal anecdote does, because there's no single person's actual memory constraining how much can be said, so a length-plus-specificity check substitutes for the self-editing instinct a founder writing about their own work would apply naturally but that a "the company" voice does not.

Requiring the specific detail to be something only someone who actually worked on the thing would know — a real number, a real tradeoff, a real timeline — is what keeps the post from being interchangeable with a competitor's identical announcement. Marketing language ("we're thrilled to bring this innovative solution to market") is by design reusable across any product launch; a fact only insiders would know is not, which is the actual signal a reader uses to judge whether a company post is substance or noise.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-04' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and Gemini (Gemini 3 Pro).',
      },
    ],
  },
  {
    slug: 'linkedin-job-search-announcement-post',
    category: 'linkedin',
    title: "Announce that you're job searching without it reading as a distress signal",
    description:
      'Turn a layoff, contract ending, or intentional job change into a post that states the situation plainly and gives readers a specific, pattern-matchable role and constraint to act on, instead of a vague "open to opportunities" post that gives connections nothing to actually do.',
    promptText: `WHAT ACTUALLY HAPPENED
{{situation}}

ROLE AND TYPE OF WORK YOU'RE LOOKING FOR, SPECIFICALLY
{{target_role_and_type}}

STRONGEST 1-2 PIECES OF CONCRETE EXPERIENCE
{{strongest_experience}}

HOW MUCH YOU WANT TO SAY ABOUT WHY YOU'RE LOOKING
{{disclosure_level}}

CONSTRAINTS
{{constraints}}

WHY "OPEN TO OPPORTUNITIES" ASKS FOR HELP WITHOUT GIVING ANYONE SOMETHING TO DO
A job-search post's actual job is to give the reader — most of whom are not hiring managers but people who might know one — a specific enough picture of what you do and what you're looking for that they could plausibly think of a real person or opening within a few seconds of reading it. "Open to new opportunities, DM me!" gives a connection nothing concrete to match against their own network, so it gets a few reflexive likes and produces almost no actual referrals.

RULES
1. State {{situation}} in one honest sentence, calibrated to {{disclosure_level}} — a layoff can be stated plainly as a fact, not apologized for or hedged into vagueness; if {{disclosure_level}} says keep it brief, one clause is enough, but don't omit it entirely if it's true, since vagueness here reads as evasive rather than discreet.
2. Name {{target_role_and_type}} specifically enough that a reader could actually pattern-match it against a role they've seen — "something in product" gives a connection nothing; "product manager roles at 20-80 person B2B SaaS companies" gives them something to hold in mind next time they hear of an opening.
3. Lead with {{strongest_experience}} as evidence, not a resume-style list — one or two specific, verifiable things you actually did, not a compressed list of every skill.
4. State {{constraints}} plainly and early enough that a reader doesn't waste a referral on something that doesn't fit — remote-only, a location, a start date. Vagueness here wastes goodwill on mismatches.
5. Close with the single easiest action for a reader to take — not "reach out" in the abstract, but something concrete: forward this to someone specific, comment with a company name, or a direct link. A lower-effort ask gets more actual referrals than a broad one.

TONE CONSTRAINT
Do not include false confidence language ("excited for this next chapter!") if {{disclosure_level}} and {{situation}} suggest this wasn't voluntary — forced positivity reads as inauthentic to exactly the audience whose help you're asking for, and can cost more credibility than a plain, calm statement of fact.

OUTPUT
The post, then one line noting whether {{target_role_and_type}} as given is specific enough for a reader to actually pattern-match against, or still too broad — and if too broad, what would need to be narrowed.`,
    variables: [
      {
        name: 'situation',
        description:
          'What actually happened — layoff, contract ending, intentional move, or other',
        example:
          'Laid off two weeks ago as part of a 15% company-wide reduction, nothing performance-related',
        required: true,
      },
      {
        name: 'target_role_and_type',
        description: 'The specific role and type of company or work you want next',
        example:
          'Product manager roles at 20-80 person B2B SaaS companies, ideally usage-based pricing products',
        required: true,
      },
      {
        name: 'strongest_experience',
        description: "The 1-2 strongest, most concrete things you've actually done",
        example:
          'Led the pricing model redesign that took our expansion revenue from flat to 22% quarter-over-quarter growth',
        required: true,
      },
      {
        name: 'disclosure_level',
        description: "How much you want to say about why you're looking",
        example:
          'Brief — one clause naming the layoff, no further detail about the company or circumstances',
        required: true,
      },
      {
        name: 'constraints',
        description: 'Location, remote preference, timeline, or other real constraints',
        example:
          'Remote only, based in the US Central time zone, available to start immediately',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['job-search', 'career-transition', 'networking', 'personal-branding'],
    whyItWorks: `The overwhelming majority of the people who see this post are not hiring managers with an open req — they're people who might, days or weeks later, hear someone mention a role that fits. The entire value of the post is whether it left them with a specific enough mental tag to retrieve later, and "open to opportunities" creates no retrievable tag at all, which is the actual reason those posts generate likes but almost no real referrals.

Calibrating honesty about {{situation}} to {{disclosure_level}} instead of defaulting to forced positivity matters because LinkedIn audiences have grown specifically skeptical of upbeat layoff announcements — a post that performs enthusiasm about an involuntary situation reads as inauthentic to the same network being asked for help, while a plainly stated, unapologetic fact tends to generate more genuine responses because it doesn't ask the reader to perform belief in a framing they can see through.

The low-effort-action close targets a real behavioral pattern: most people who could help with a referral won't take an ambiguous, multi-step action ("reach out if you know anyone"), but will take a specific, near-zero-effort one — forward this, comment a company name. Narrowing the ask to the smallest unit of help someone could give is what converts passive sympathy into an actual lead days after the post has left the feed.

Requiring {{constraints}} to be stated plainly and early, rather than left to a comment-thread clarification later, protects the referral pipeline itself: a reader who thinks of a great-sounding opening but doesn't know it's on-site in a city you can't relocate to either wastes a referral making the introduction anyway, or — more commonly — decides it's probably not a fit and says nothing, when a two-second constraint check up front would have told them either way before they had to guess.`,
    exampleOutput: `Two weeks ago I was part of a 15% reduction — nothing about my role or performance, just a broader cut.

I'm looking for product manager roles at 20-80 person B2B SaaS companies, specifically ones working on usage-based pricing.

Most recently, I led a pricing model redesign that took our expansion revenue from flat to 22% quarter-over-quarter growth — the kind of problem I actually want to keep solving.

Remote only, US Central time zone, available to start immediately.

If a role like this crosses your feed in the next few weeks, a comment with the company name would mean more than you'd think.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-04' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-event-webinar-promotion-post',
    category: 'linkedin',
    title:
      'Write the three-post sequence that actually fills a webinar, not just the announcement',
    description:
      'Plan the announce, reminder, and last-call posts for a webinar or event as three distinct posts with three different jobs and three different hooks, instead of the same announcement copy-pasted three times with a new date.',
    promptText: `EVENT OR WEBINAR TOPIC AND FORMAT
{{event_topic_and_format}}

DATE, TIME, AND REGISTRATION METHOD
{{event_logistics}}

WHO SHOULD ATTEND, SPECIFICALLY
{{target_attendee}}

THE SPECIFIC THING A REGISTRANT WALKS AWAY ABLE TO DO
{{concrete_takeaway}}

WHO'S SPEAKING OR HOSTING, AND WHY THEY'RE CREDIBLE ON THIS
{{speaker_credibility}}

WHY ONE ANNOUNCEMENT RARELY FILLS A ROOM
Most registrations for an event come from people who see it more than once, in a different framing each time, not from the first impression alone. Posting the identical copy three times with only the date changed reads as repetitive to anyone following closely and wastes two of the three touches that could have done a different job.

WRITE THREE DISTINCT POSTS
1. ANNOUNCE (1-2 weeks' notice) — leads with {{concrete_takeaway}} as the hook, not the event's existence ("I'm hosting a webinar" is not the interesting part; what someone walks away able to do is). Includes {{speaker_credibility}} as a specific reason to trust the content, not just a bio line. Ends with the registration action clearly.
2. REMINDER (1-2 days before) — assumes some readers already registered and some are seeing this cold; leads with a specific detail that will actually happen in the session (a real example that will be walked through, a specific question that will get answered) that wasn't in the announce post, giving anyone who saw the first post a new reason to care rather than just repeating it. States the exact time again, including timezone.
3. LAST CALL (same day, a few hours before or "starting now/soon") — short, urgency-driven, but urgency grounded in something real (seats capped, a specific thing happening at the start that latecomers will miss) rather than manufactured scarcity language ("only a few spots left!") that isn't true.

STRUCTURAL VARIATION CONSTRAINT
No two of the three posts may share their opening line or hook mechanism — if the announce post leads with a number, the reminder should lead with something else (a scene, a question, a named detail), so a reader following your feed doesn't recognize the same structure being reused with new dates plugged in.

OUTPUT
The three posts, clearly labeled with their intended send timing relative to the event, plus one line on what specific new information each later post adds beyond "this is still happening," since a reminder that adds nothing new is functionally just a repost.`,
    variables: [
      {
        name: 'event_topic_and_format',
        description: 'What the event covers and its format',
        example:
          '45-minute live webinar walking through a real usage-based pricing rollout, with Q&A',
        required: true,
      },
      {
        name: 'event_logistics',
        description: 'Date, time, timezone, and how to register',
        example: 'Thursday Aug 20, 11am ET, register at example.com/webinar',
        required: true,
      },
      {
        name: 'target_attendee',
        description: 'Who specifically should attend',
        example:
          'RevOps and pricing leads at B2B SaaS companies considering a pricing model change',
        required: true,
      },
      {
        name: 'concrete_takeaway',
        description: 'The specific thing a registrant walks away able to do',
        example:
          'Walk away with a checklist for the 5 things to test before rolling out usage-based pricing company-wide',
        required: true,
      },
      {
        name: 'speaker_credibility',
        description: 'Who is presenting and why they are credible on this specific topic',
        example:
          'Hosted by someone who has run 3 real usage-based pricing rollouts, including one that had to be reversed',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['event-promotion', 'webinars', 'post-sequence', 'urgency', 'b2b-marketing'],
    whyItWorks: `Event registration data across platforms consistently shows most registrants convert after seeing a promotion more than once, in different framings — not from a single high-quality announcement. This is the direct reason a three-post sequence with three distinct jobs (introduce the value, add a new specific detail, create real urgency) outperforms one good post reposted with a new date: each post is targeting a reader who didn't convert on the previous one, for a different reason each time.

Requiring the reminder post to include a detail that wasn't in the announcement — a specific example, a specific question that gets answered — directly addresses why reminders usually underperform: a reader who already saw and passed on the announcement has no new information to update on if the reminder just restates the same pitch, so nothing changes their earlier decision not to register.

Grounding last-call urgency in something real — a capped seat count, something specific happening at start — instead of manufactured scarcity language matters because LinkedIn audiences have become measurably numb to fake urgency phrasing, and a false scarcity claim a reader can see through (there clearly are more than "a few spots left" on a webinar with no attendance cap) costs more credibility with that reader for future promotions than the marginal urgency was worth.

The structural-variation constraint — no shared opening line or hook mechanism across the three posts — targets what actually gives a copy-pasted sequence away even when the date has been updated each time: a follower scrolling past all three in the same week recognizes the skeleton before they register the new content, and that recognition itself reads as low-effort regardless of how good any individual post's writing is.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-05' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
    relatedToolSlug: 'utm-builder',
  },
  {
    slug: 'linkedin-conference-speaking-recap-post',
    category: 'linkedin',
    title:
      "Turn a conference talk into a recap post that's useful to people who weren't there",
    description:
      'Write a post-event recap that extracts the single most useful idea from a talk or panel for someone who never attended, instead of a stage-photo-and-thanks post that only makes sense to the small number of people who were already in the room.',
    promptText: `EVENT NAME AND YOUR ROLE
{{event_and_role}}

WHAT YOU ACTUALLY TALKED ABOUT OR HEARD DISCUSSED
{{talk_content_or_notes}}

THE ONE IDEA WORTH EXTRACTING FOR SOMEONE WHO WASN'T THERE
{{extractable_idea}}

PEOPLE OR ORGANIZERS TO CREDIT, IF ANY
{{people_to_credit}}

AVAILABLE MEDIA
{{available_media}}

WHY THE DEFAULT RECAP FAILS EVERYONE WHO WASN'T THERE
The default conference recap — a stage photo, "had a blast speaking at [Event]!", a thank-you list of organizers — makes sense only to the small number of people who were physically in that room, and reads as pure self-promotion to everyone else, which is most of the audience. A recap that earns wider engagement treats the talk as source material for a standalone post, not as the subject of a thank-you note.

STRUCTURE
1. HOOK — lead with {{extractable_idea}} itself, stated as a claim, exactly the way a hook would open a standalone post on the topic — not "Just got off stage at {{event_and_role}}."
2. WHY THIS CAME UP — one to two lines of context on the talk or panel that surfaced this idea, brief enough that someone who wasn't there doesn't need more background than this to follow the point.
3. THE IDEA, UNPACKED — 2-4 lines actually explaining {{extractable_idea}}, as if writing the post you'd write on this topic regardless of the event — this is the part that has to work with zero conference context.
4. CREDIT — if {{people_to_credit}} names anyone (a co-panelist whose point this built on, the organizers), credit them specifically for a specific contribution, not a generic thank-you list tagging everyone involved.
5. CLOSE — a genuine question or invitation to discuss the idea itself, not "great conversation, thanks for having me!"

LANGUAGE CONSTRAINT
The words "great event," "amazing conversation," or "learned so much" may not appear unless followed immediately by the specific thing that made it great, amazing, or a learning — those phrases with no specific referent are the exact filler that makes recap posts skippable.

MEDIA PLACEMENT
If {{available_media}} includes a recording or slides, note where in the post that link belongs — typically first comment, so it doesn't compete with the native reach of a text-first post — rather than defaulting to putting it in the body.

OUTPUT
The post, then one line confirming the post would make sense and hold interest for someone who has never heard of {{event_and_role}} at all — if it wouldn't, say what's still too dependent on event context.`,
    variables: [
      {
        name: 'event_and_role',
        description: 'The event name and your role there',
        example: 'Panelist at a regional SaaS operators conference',
        required: true,
      },
      {
        name: 'talk_content_or_notes',
        description: 'What you actually talked about or heard discussed',
        example:
          'A panel on pricing model changes, where three operators shared what they got wrong the first time',
        required: true,
      },
      {
        name: 'extractable_idea',
        description: 'The single idea worth extracting for someone who was not there',
        example:
          'Every panelist who reversed a pricing change had skipped testing it on their highest-value existing customers first',
        required: true,
      },
      {
        name: 'people_to_credit',
        description: 'Anyone specific to credit for a specific contribution',
        example:
          'A co-panelist, Maria Chen, whose point about customer-tier testing sparked this idea',
        required: false,
      },
      {
        name: 'available_media',
        description: 'Whether you have a recording, slides, or photos to reference',
        example: 'A recording will be posted by the organizers in about a week',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['event-recap', 'thought-leadership', 'public-speaking', 'personal-branding'],
    whyItWorks: `A recap built around a stage photo and thanks is legible only to people who share the specific context of having attended — for everyone else in the feed, which is nearly everyone who sees the post, it reads as an unverifiable claim of having done something impressive with no content to evaluate, which is functionally the same as pure self-promotion even when that's not the intent.

Treating the talk as source material and writing the post you'd write on the topic regardless of the event is what makes the recap actually portable. The explicit "would this make sense to someone who's never heard of this event" check at the end targets the single most common failure of recap posts directly, rather than trusting that the "unpack the idea" section alone will catch it.

Naming the filler phrases ("great event," "learned so much") and banning them without a specific referent addresses a documented pattern in low-engagement conference posts — vague enthusiasm words are frequently the entire content of a recap post, and forcing every instance of one to be followed by the actual specific thing it refers to either produces real content or reveals that the post has none to offer.

Crediting a specific person for a specific contribution, rather than a blanket thank-you list, does more actual relationship work than it looks like: a named, specific credit ("Maria's point about customer-tier testing sparked this") is something the credited person can genuinely engage with and might reshare, while a list of five names tagged in a closing line reads as an obligation discharged rather than a real acknowledgment, and rarely gets any response from the people named in it.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-05' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-disagreement-post-without-backlash',
    category: 'linkedin',
    title:
      'Write a post that disagrees with a common view in your field without reading as a dunk',
    description:
      'Turn a genuine professional disagreement into a post that states the counter-position with real evidence, names what would change your mind, and preempts the strongest expected counter-reply — instead of a contrarian-for-clout take with nothing under it.',
    promptText: `THE COMMON VIEW OR PRACTICE YOU DISAGREE WITH
{{common_view}}

YOUR ACTUAL REASON FOR DISAGREEING
{{your_reasoning}}

WHO HOLDS THE VIEW YOU'RE DISAGREEING WITH
{{who_holds_this_view}}

HOW CONFIDENT YOU ACTUALLY ARE
{{confidence_level}}

AUDIENCE
{{audience}}

WHY A DISAGREEMENT POST USUALLY FAILS IN ONE OF TWO WAYS
A disagreement post that works reads as someone who has actually thought about the opposing view and still landed somewhere different, which is what earns substantive replies instead of a pile-on in either direction. A disagreement post that fails either dunks on a strawman version of the common view nobody actually holds, or states an opinion with no evidence behind it, inviting a reply that just restates the position it disagreed with, unchallenged, because nothing here gave anyone a reason to update.

RULES
1. STATE THE COMMON VIEW ACCURATELY FIRST — in a form that {{who_holds_this_view}} would recognize as a fair, non-strawmanned version of what they actually believe, before disagreeing with it. If you can't state it fairly, that's a sign you're arguing with a caricature, not the actual position — flag this if it seems true.
2. LEAD THE DISAGREEMENT WITH {{your_reasoning}} AS EVIDENCE, not just the contrary opinion stated more forcefully — "X is wrong" restated with more conviction isn't an argument; the specific reason, example, or mechanism behind the disagreement is what makes it one.
3. CALIBRATE THE CONFIDENCE OF THE LANGUAGE TO {{confidence_level}} — a post claiming certainty it doesn't actually have invites replies that attack the certainty rather than engage with the substance; if you're genuinely open to being wrong, say so plainly rather than performing more conviction than you have for effect.
4. NAME WHAT WOULD CHANGE YOUR MIND, if there's a genuine answer — a specific piece of evidence or counter-example that would move you. This is the single strongest signal that a disagreement is in good faith rather than a fixed position dressed as an open one.
5. ANTICIPATE THE STRONGEST COUNTER-REPLY you'd actually expect from {{who_holds_this_view}} and address it directly in the post, rather than leaving it for the comments — addressing it up front changes the shape of the discussion that follows.

FRAMING CONSTRAINT
Do not use "hot take," "unpopular opinion but," or any framing device that announces the post is provocative before making the argument — let the disagreement itself carry that weight; announcing it in advance primes readers to react to the framing instead of the substance.

OUTPUT
The post, then a separate one-line note on the single most likely reply you'd get that would actually land — the strongest real objection, not a weak one easy to have already answered — so you know what to expect and aren't caught flat-footed by the first substantive pushback.`,
    variables: [
      {
        name: 'common_view',
        description: 'The mainstream view or practice you disagree with',
        example:
          'Most operators believe every SaaS company should eventually move to usage-based pricing',
        required: true,
      },
      {
        name: 'your_reasoning',
        description:
          'The actual evidence, experience, or mechanism behind your disagreement',
        example:
          "I've watched 3 companies adopt it and reverse it within a year because it made revenue forecasting nearly impossible for their finance teams",
        required: true,
      },
      {
        name: 'who_holds_this_view',
        description: "Who actually holds the view you're disagreeing with",
        example:
          "RevOps leads and pricing consultants who've mostly seen the model work at large-scale infrastructure companies",
        required: true,
      },
      {
        name: 'confidence_level',
        description: 'How confident you genuinely are, stated honestly',
        example:
          'Fairly confident for companies under $20M ARR, genuinely uncertain past that size',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who this is written for',
        example: 'Founders and RevOps leads evaluating a pricing model change',
        required: true,
      },
    ],
    targetTools: ['Claude', 'ChatGPT'],
    tags: [
      'thought-leadership',
      'contrarian-takes',
      'professional-discourse',
      'credibility',
    ],
    whyItWorks: `Requiring the common view to be stated in a form its actual holders would recognize as fair, before disagreeing with it, is the single mechanical difference between a post that generates real discussion and one that just gets dismissed by the exact audience it needed to reach. A strawmanned opening is visible instantly to anyone who genuinely holds the view, and their first reply becomes "that's not what we actually think," which derails the entire thread away from the substantive disagreement before it starts.

Naming what would change your mind is doing real epistemic work, not just performing open-mindedness. A position with a stated falsification condition reads as considered and invites someone to actually try to meet that condition with a real counter-example, while a position with no stated condition for updating reads — correctly — as fixed regardless of what tone it's delivered in, which changes what kind of replies it draws.

Preemptively addressing the strongest expected counter-reply, rather than leaving it for the comments, changes the actual shape of the ensuing discussion. A comment section where the obvious objection was already addressed in the post skips straight to the more interesting second-order discussion, while a comment section where the obvious objection wasn't addressed gets dominated by dozens of people independently making the exact same first point, which crowds out anything more substantive from ever surfacing.

Banning framing devices like "hot take" or "unpopular opinion but" matters because these phrases prime the reader's reaction before the argument itself has been read — a reader told in advance that a post is provocative reads everything that follows through that lens and reacts to the framing, while the same argument presented without the warning label gets evaluated on its actual content, which is a meaningfully different and generally more substantive kind of engagement.`,
    exampleOutput: `Most RevOps leads I talk to still treat usage-based pricing as the natural endpoint every SaaS company eventually reaches. I think that's true for infrastructure products with genuinely variable cost-to-serve — and wrong for almost everyone else.

I've watched three companies adopt it and reverse it within a year, all for the same reason: it made revenue forecasting nearly impossible for finance, not because customers hated it.

I'd change my mind on this if someone showed me a company under $20M ARR that moved to usage-based pricing and kept forecast accuracy within 10% for two consecutive quarters — I haven't seen one yet, but I'm not claiming it can't exist.

The obvious pushback is that seat-based pricing has its own well-documented problems. It does — I'm not arguing seat-based is better, just that "usage-based is the natural next step" skips past a forecasting cost most companies underestimate until they're living it.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-06' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-report-into-post-atomization',
    category: 'linkedin',
    title:
      "Turn one long report into five LinkedIn posts that don't feel like the same source recycled",
    description:
      'Extract several genuinely distinct, standalone posts from one long report or whitepaper, each built around a different specific finding with its own hook mechanism, and get told honestly when the source only supports fewer strong posts than requested.',
    promptText: `THE REPORT OR LONG DOCUMENT
{{report_content_or_summary}}

HOW MANY POSTS YOU WANT OUT OF THIS
{{number_of_posts_wanted}}

WHO YOU'RE WRITING FOR
{{audience}}

OVER WHAT TIMEFRAME THESE WILL POST
{{posting_timeframe}}

WHETHER THE REPORT SHOULD BE LINKED, AND WHERE
{{link_placement_preference}}

WHY ATOMIZING A REPORT USUALLY PRODUCES A WEAKENED SERIES INSTEAD OF SEVERAL POSTS
The mistake in turning one long document into multiple posts is treating them as the same argument chopped into pieces — post 2 recognizably a continuation of post 1's framing — instead of as genuinely separate posts that each stand alone. A reader encountering post 3 in their feed almost certainly never saw posts 1 or 2, and a post that only makes sense as part of a series performs like a fragment to everyone except the small number who happened to see the whole sequence in order.

TASK
1. FIND {{number_of_posts_wanted}} DISTINCT, POST-WORTHY FINDINGS in the source — not sections of the document, findings. A report's table of contents is not a list of good post topics; a good post topic is one specific claim, number, or insight strong enough to justify a reader's attention entirely on its own, wherever in the source it happens to live.
2. FOR EACH FINDING, write a standalone post — its own hook (using a different mechanism each time: a number, a contrarian framing, a specific scenario, and so on, not the same hook style five times), enough context to make sense with zero knowledge of the source report, and a close relevant to {{audience}}.
3. VARY THE ANGLE, not just the topic — if two findings are both about the same underlying trend, make sure the posts approach it from genuinely different angles (one as a number, one as an implication for a specific role) rather than reading as the same point restated with a different statistic attached.
4. DO NOT let any post reference another one in the set ("as I covered last week," "part 3 of my series on...") — each has to work if it's the only one a given reader ever sees, per {{posting_timeframe}}, unless you're deliberately building a named series, in which case say so explicitly and structure accordingly instead of defaulting into it.

HONESTY CONSTRAINT
If the source material only genuinely supports fewer distinct, strong posts than {{number_of_posts_wanted}}, say so and give the smaller honest number rather than padding out weak, repetitive posts to hit the requested count.

OUTPUT
The requested number of posts (or the honest smaller number, with the reason), each labeled by which specific finding it's built on, plus a one-line note on where the source report link belongs per {{link_placement_preference}} and why that placement over the alternative.`,
    variables: [
      {
        name: 'report_content_or_summary',
        description: 'The report content, or a detailed section-by-section summary',
        example:
          'A 12-page industry report on usage-based pricing adoption, with sections on adoption rates, forecasting impact, customer reactions, and reversal case studies',
        required: true,
      },
      {
        name: 'number_of_posts_wanted',
        description: 'How many posts you want out of this source',
        example: '5',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who these posts are written for',
        example: 'RevOps leads and pricing consultants',
        required: true,
      },
      {
        name: 'posting_timeframe',
        description:
          'Over what period these will be posted, so cross-references are avoided correctly',
        example: 'Spread over 3 weeks, roughly twice a week',
        required: false,
      },
      {
        name: 'link_placement_preference',
        description: 'Whether the source report should be linked, and where',
        example: 'Yes, link it — undecided whether in the body or first comment',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: [
      'content-repurposing',
      'content-atomization',
      'thought-leadership',
      'long-form',
    ],
    whyItWorks: `A reader encountering any single post from a series in their feed has, in the vast majority of cases, seen none of the others — LinkedIn's feed is not sequential and doesn't guarantee ordered delivery even to followers, which is the direct reason a post that only makes sense as "part 3" performs like an orphaned fragment to nearly everyone who sees it. The atomization has to produce posts that are actually standalone, not a serialized document with page breaks inserted.

Requiring a different hook mechanism per post, and a genuinely different angle rather than the same trend restated with a new statistic, targets the actual failure mode of report-atomization: it is easy to mechanically extract five different numbers from one document and much harder to notice that the resulting five posts all make essentially the same point in the same shape, which reads to anyone following the account closely as a mechanical batch job rather than five separately considered posts.

The instruction to give the honest, smaller count if the source doesn't support more good posts protects against the specific incentive this kind of prompt creates: asked for five posts, a model under no other constraint will produce five posts by padding weaker findings up to sound substantial, which is a worse outcome for the account's credibility over a month of posting than publishing three strong ones and being honest that a fourth and fifth weren't there in the source.

The instruction to explicitly decide whether this is a deliberate named series or a set of unrelated standalone posts — rather than defaulting into cross-references by accident — matters because the two formats have genuinely different success conditions: a deliberate series can lean on sequence and cumulative context because readers who follow it expect that, while a set of standalone posts sharing a source has to hide that shared origin entirely or it reads as a lazier version of the series format without actually committing to it.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-07' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'linkedin-employee-advocacy-post-templates',
    category: 'linkedin',
    title:
      'Draft posts for your team to personalize, not a script everyone posts word-for-word',
    description:
      "Produce a small set of genuinely different starting drafts for an employee-advocacy moment, each written from a different role's actual vantage point, built to be personalized rather than posted as-is — so five teammates writing about the same news don't visibly post the same paragraph with a different name at the top.",
    promptText: `THE COMPANY MOMENT EVERYONE'S POSTING ABOUT
{{company_moment}}

WHO'S BEING ASKED TO POST
{{posting_roles}}

THE ONE FACT THAT MUST STAY ACCURATE ACROSS EVERY VERSION
{{must_stay_accurate}}

HOW MANY DISTINCT DRAFT STARTING POINTS YOU NEED
{{number_of_variants}}

ANYTHING EMPLOYEES SHOULD NOT SAY
{{do_not_say}}

WHY VISIBLE COORDINATION IS THE ACTUAL FAILURE MODE, NOT LOW VOLUME
The failure mode of employee-advocacy content is not that nobody posts — it's that everyone posts the same company-provided paragraph with only the byline changed, which is instantly recognizable to anyone who follows more than one person at the company and reads as coordinated messaging rather than genuine enthusiasm, which actually costs more credibility than if nobody had posted about it at all.

TASK
Produce {{number_of_variants}} distinct starting drafts, each written from a genuinely different vantage point implied by {{posting_roles}} — not the same paragraph in a different tone, but a structurally different post because the actual experience of {{company_moment}} was different for each role. For example: someone who built the thing has a different true thing to say than someone who will now sell it, who has a different true thing to say than someone who just watched it happen from an adjacent team.

FOR EACH DRAFT
1. Open from that role's actual vantage point on {{company_moment}} — what they specifically saw, did, or noticed, not the company's official framing restated in first person.
2. Include {{must_stay_accurate}} exactly as given, since this is the one thing that cannot drift between versions even as everything else does — state it plainly, don't paraphrase it into something looser that might not match the other versions or the company's public statement.
3. End with an explicit note-to-poster: "this is a starting draft — change [specific thing] to make it actually yours before posting," naming one concrete thing about that specific draft that should be personalized (a real memory, a specific number they'd know from their own vantage point, their own voice on the close) rather than a generic "feel free to edit."

STRUCTURAL AND TOPIC CONSTRAINTS
No two drafts may share an opening sentence structure, a specific phrase, or the same closing line — if two roles would naturally produce very similar posts, deliberately diverge the structure (one leads with a number, another with a question, another with a short scene) so that even minimally-edited versions don't read as obviously related to each other in the feed. Respect {{do_not_say}} in every version without exception — flag if satisfying a specific draft's honest vantage point would require going anywhere near a restricted topic, rather than quietly working around it in a way that changes the point.

OUTPUT
The requested number of drafts, each labeled by role, each ending with its specific personalization note, plus one line confirming {{must_stay_accurate}} appears identically (not paraphrased differently) across every version.`,
    variables: [
      {
        name: 'company_moment',
        description: 'The company news, launch, or milestone everyone is posting about',
        example:
          'We just launched a self-serve tier after 3 years of being enterprise-only',
        required: true,
      },
      {
        name: 'posting_roles',
        description:
          'The roles being asked to post, so drafts can genuinely vary by vantage point',
        example:
          'The engineer who built the self-serve billing flow, a sales rep, and a customer success lead',
        required: true,
      },
      {
        name: 'must_stay_accurate',
        description: 'The one fact or claim that must not drift between any version',
        example: 'Self-serve pricing starts at $49/month, no sales call required',
        required: true,
      },
      {
        name: 'number_of_variants',
        description: 'How many distinct starting drafts you need',
        example: '3',
        required: true,
      },
      {
        name: 'do_not_say',
        description:
          'Anything employees should avoid for legal, competitive, or tone reasons',
        example:
          'Do not mention the enterprise-tier customer we lost partly because of the missing self-serve option',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['employee-advocacy', 'brand-voice', 'launch-content', 'team-enablement'],
    whyItWorks: `The actual signal that damages employee-advocacy content isn't low volume, it's visible coordination — a viewer who sees three employees post near-identical paragraphs about the same launch on the same day updates toward "this was assigned," not "these people are genuinely excited," which is a worse outcome for the company's credibility than if the moment had gone unposted by anyone at all. Starting from genuinely different role-based vantage points is what produces posts that are actually different, not just differently worded.

Locking {{must_stay_accurate}} to appear identically, unparaphrased, across every draft while deliberately letting everything else vary addresses a specific tension in this exact task: the whole point is variation, but a launch or milestone post usually has one or two facts (a date, a number, a claim) that legal, PR, or plain accuracy require to stay fixed regardless of who's posting. Treating "vary everything" and "keep this one thing exact" as two different, explicitly separated instructions is what prevents an enthusiastic personalization from accidentally drifting a stated number or claim between five different employees' versions.

The explicit no-shared-structure constraint — same opening shape, same closing line — targets what actually gives coordinated posting away even after individual edits. People often personalize the details of a provided draft (a name, a specific memory) while keeping its skeleton, tone, and phrase choices intact, and skeletal similarity across posts is exactly what a reader following multiple employees at once notices, even when every individual detail has technically been changed.

Requiring each draft to end with a specific, named personalization instruction rather than a generic "edit as needed" matters because a generic invitation to personalize gets skipped under time pressure far more often than a specific one — an employee handed "change the number in the second line to something from your own experience" has a concrete, low-effort task, while one handed "make this your own" is more likely to post the draft close to verbatim, which recreates the exact coordination problem this whole exercise exists to avoid.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-08' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: 'Initial publish for the rewritten linkedin category, verified against Claude (Sonnet 5) and ChatGPT (GPT-5.1).',
      },
    ],
  },
] as const
