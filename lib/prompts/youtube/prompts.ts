import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'youtube-retention-structured-long-form-script',
    category: 'youtube',
    title: 'Write a long-form script structured around where viewers actually drop off',
    description:
      'Builds a full script around a cold open, a stated open loop, and a fixed pattern-interrupt cadence, and treats a past video\'s real retention-graph dip as a structural constraint rather than writing generically "engaging" prose.',
    promptText: `You are a YouTube scriptwriter building a long-form script around the platform's actual retention mechanics, not around what merely reads well on the page. A script that is well-written prose but ignores where real audiences bail — the first 15 seconds, right after a slow intro, at the midpoint lull — loses exactly the viewers whose watch time the recommendation system weighs most heavily.

VIDEO TOPIC
{{video_topic}}

TARGET LENGTH
{{target_length}}

CHANNEL AND AUDIENCE
{{channel_context}}

PAST RETENTION DATA
{{retention_data}}

KEY POINTS TO COVER
{{key_points}}

STRUCTURE RULES
Open with the payoff or central tension of the video within the first three sentences — not a channel intro, not "hey guys welcome back," not scene-setting. State plainly, in the viewer's language, what they will know or be able to do by the end, and open at least one specific unanswered question — an open loop — that the rest of the script is structured to resolve, not to answer immediately. Place a pattern interrupt — a new visual beat, a tone shift, a new sub-question, a cut to a different setting — at minimum every 60 to 90 seconds; a script that runs three or more straight minutes in the same visual and vocal register is a script asking to be scrubbed past, regardless of how accurate its content is. Never place the single most interesting point at the very end as a "big reveal" unless the whole script is explicitly built as a countdown toward it with stakes restated along the way — a surprise nobody was reminded to wait for lands as filler, not payoff. If the retention data shows a specific drop-off timestamp from a past video, treat that as a structural constraint on this script: name what likely caused it — a slow setup, a tangent, a repeated point — and build this script's equivalent section deliberately shorter or restructured around a fresh hook, rather than assuming the past drop was a fluke. Resolve every open loop you open; a curiosity gap that lures a viewer in and never pays off reads as a bait-and-switch and drives an explicit "not interested" signal, not just a soft attrition tick.

OUTPUT FORMAT
1. A cold-open hook (first 10-15 seconds), written as spoken lines, not a summary of what the hook should do.
2. A full script broken into labeled sections with a timestamp estimate for each, spoken lines throughout, [bracketed] notes for visual cuts or B-roll cues only where they matter to pacing.
3. A one-line note under each section naming the pattern-interrupt device used.
4. A list of every open loop opened in the hook or early sections, each paired with the exact section where it gets resolved.`,
    variables: [
      {
        name: 'video_topic',
        description: 'What the video is actually about.',
        example: 'Why your iPhone battery degrades faster in year one than year two',
        required: true,
      },
      {
        name: 'target_length',
        description: 'The intended runtime.',
        example: '9-11 minutes',
        required: true,
      },
      {
        name: 'channel_context',
        description: 'Channel size, niche, and typical viewer for this format.',
        example:
          'Tech explainer channel, 140K subscribers, average viewer age 22-34, prior videos in this format run 8-12 minutes',
        required: true,
      },
      {
        name: 'retention_data',
        description:
          "Where a comparable past video's audience retention graph actually dropped, and why.",
        example:
          'Last video on a similar topic fell from 71% to 38% retention between 0:45 and 1:30 — that section was a slow lithium-ion-history preamble before reaching the actual answer',
        required: false,
      },
      {
        name: 'key_points',
        description: 'The substantive claims and facts the script must cover.',
        example:
          "Battery chemistry degrades faster under heavy fast-charging cycles; software throttling masks the decline from the user; leaving the phone at 100% charge overnight is the single biggest accelerant most viewers don't know about",
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'youtube-script',
      'audience-retention',
      'video-structure',
      'watch-time',
      'hook-writing',
      'long-form-content',
    ],
    whyItWorks:
      'Audience retention — the percentage of viewers still watching at each timestamp, shown as a graph in YouTube Studio — is a direct input to what the recommendation system keeps surfacing a video for, which is why this prompt treats a past video\'s actual retention dip as a structural constraint rather than a footnote: a script that restructures the exact section type that caused a 33-point drop last time is targeting the real signal YouTube measures, not a generic instruction to "keep it engaging" that gives the model nothing concrete to act on. The fixed 60-to-90-second pattern-interrupt cadence exists because the steepest retention declines on most channels\' own graphs cluster around long uncut stretches of the same visual and vocal register — a static talking-head shot with no cutaway, no tone change, no new visual for three-plus minutes — so forcing a beat change on a fixed interval is a direct countermeasure to the failure mode the data itself shows, not an arbitrary pacing rule. Requiring the hook to open a genuine open loop, and requiring every open loop to be explicitly resolved somewhere in the script, targets a specific and common failure of AI-drafted hooks: a curiosity-gap opener that never actually gets answered reads to a real viewer as a bait-and-switch, which produces an explicit negative signal — a "not interested" click or a dislike — that is measurably worse for a channel than a viewer who simply drifted off partway through, because negative explicit feedback suppresses future recommendations more directly than soft attrition does. The rule against burying the single best point as an unearned "big reveal" addresses a subtler version of the same problem: viewers who leave before the reveal never experience the payoff at all, so a script that saves everything for the end is optimizing for a viewer who, per the very retention data this prompt asks for, statistically will not still be there. Naming the pattern-interrupt device used in each section, rather than leaving pacing as an invisible design choice, also gives whoever storyboards or edits the video a concrete cue to shoot or cut for, instead of a script that reads fine on paper and only reveals its pacing problems once it is already filmed.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-22' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'youtube-cold-open-hook-first-15-seconds',
    category: 'youtube',
    title: "Rewrite just the first 15 seconds when a finished script isn't landing",
    description:
      'Isolates the cold-open hook as its own deliverable — for testing multiple openings against one already-written video body — instead of rewriting the whole script when only the opening is the actual problem.',
    promptText: `You are rewriting only the first 10 to 15 seconds of a YouTube video — the cold open — for a script whose body is already finished and is not the problem. Treat this as an isolated component with its own job: earn the next 30 seconds of attention, nothing more. Do not summarize the whole video here and do not try to make this section carry the video's full argument.

VIDEO TOPIC AND ANGLE
{{video_topic}}

EXISTING SCRIPT BODY
{{script_body}}

WHY THE CURRENT OPEN ISN'T WORKING
{{current_hook_problem}}

VIEWER'S STARTING KNOWLEDGE
{{audience_starting_knowledge}}

NUMBER OF VARIANTS
{{number_of_variants}}

HOOK RULES
The first sentence must contain zero setup — no channel name, no "in this video," no scene description before the substance starts. Start either mid-action, mid-claim, or mid-question: a viewer who has watched zero seconds before this one should already be oriented toward a specific stake within that first sentence. Never promise something the script body does not actually deliver — read the existing script body before writing a single hook line, and reject any hook angle that the body cannot honestly pay off, even if it would test well as an isolated line. Match the register of the script body; a hook pitched more sensational than the video that follows it creates a mismatch that shows up as a fast drop the moment the tone shifts, not a save. Where the audience's starting knowledge is specified, do not open with information they already have as if it were new — that reads as slow to the exact viewer this video is for, even if it would be a fine hook for a beginner audience. If a stated reason explains why the current hook fails — too slow, too vague, promises the wrong thing, sounds like every other video on this topic — every variant you write must specifically avoid that named failure, not just be "punchier" in a way that could reintroduce the same problem in a new form.

OUTPUT FORMAT
Produce the requested number of hook variants, each as spoken lines only, each on its own numbered block. Under each variant, one line stating the specific psychological or curiosity mechanism it uses — a stated stake, a contradiction, a specific number, a direct question — and one line confirming exactly where in the existing script body this hook's implicit promise gets paid off.`,
    variables: [
      {
        name: 'video_topic',
        description: 'The video topic and its specific angle.',
        example:
          'Why "just drink more water" is bad advice for most people who are actually tired',
        required: true,
      },
      {
        name: 'script_body',
        description:
          'The already-written script the new hook needs to lead into honestly.',
        example:
          'A 7-minute script arguing that chronic tiredness in most sedentary adults correlates more strongly with poor sleep consistency and blood sugar swings than with hydration, citing three specific studies',
        required: true,
      },
      {
        name: 'current_hook_problem',
        description: 'What is specifically wrong with the current opening.',
        example:
          'Current hook opens with "Hey everyone, welcome back, today we\'re talking about hydration" — 9 seconds pass before any actual claim, and Studio shows a 22-point retention drop by second 15',
        required: true,
      },
      {
        name: 'audience_starting_knowledge',
        description: 'What the target viewer already knows or believes coming in.',
        example:
          "Already knows the basic '8 glasses a day' advice and has probably heard it debunked once before — a hook that re-explains that baseline will feel slow",
        required: false,
      },
      {
        name: 'number_of_variants',
        description: 'How many distinct hook options to produce.',
        example: '4',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'youtube-hook',
      'cold-open',
      'audience-retention',
      'script-writing',
      'ab-testing',
      'video-structure',
    ],
    whyItWorks:
      'Isolating the hook as its own artifact, separate from the script body, matches how the failure actually surfaces in the data: a retention graph with a sharp cliff in the first 15 seconds but a normal-looking curve for the rest of the video is telling you the opening is the specific broken part, and regenerating the entire script in response would touch nine minutes of content that was never the problem, discarding a body that already works while giving the model far more surface area to introduce a new mistake. Requiring the model to read the existing script body before writing any hook line, and rejecting any angle the body can\'t honestly pay off, targets the most common failure mode of hook-only rewrites done in isolation — an LLM asked only for "a punchier opening" has no way to know if a punchier claim is even true of the video that follows, and will happily generate a hook that promises a twist, a number, or a stake the body never actually delivers, creating exactly the bait-and-switch mismatch that produces a fast second drop the moment viewers hit the calmer, honest content underneath. Naming the specific reason the current hook fails, and requiring every variant to specifically avoid that named failure rather than just sound more energetic, prevents a subtle regression: a hook can get more exciting in tone while making the identical structural mistake — still opening with nine seconds of preamble, just louder preamble — and a vague "make it punchier" instruction will not catch that, while an instruction anchored to the specific diagnosed cause will. Tying each variant to the audience\'s actual starting knowledge stops a second common mismatch: a hook that re-explains a baseline fact the target viewer has already heard debunked reads as slow to exactly the audience the video is trying to hold, even though the identical hook line would work perfectly for a true beginner — the fix is not a better hook in the abstract, it\'s the right hook for who is actually watching. Requiring a stated payoff location for each variant turns an unfalsifiable creative claim ("this hook is more engaging") into something a reviewer can actually check against the finished script in thirty seconds.',
    exampleOutput: `1. "Your tiredness has nothing to do with water — it has to do with a spike your blood sugar took two hours ago."
Mechanism: direct contradiction of the assumed cause. Pays off at 1:40, where the blood-sugar-swing study is introduced.

2. "Three studies just found the exact opposite of what you've been told about why you're tired."
Mechanism: stated number + contradiction. Pays off across 1:40-4:10, where all three studies are covered in sequence.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-24' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Gemini (Gemini 3 Pro).',
      },
    ],
  },
  {
    slug: 'youtube-title-options-ctr-without-clickbait',
    category: 'youtube',
    title:
      "Generate title options that raise CTR without promising something the video doesn't deliver",
    description:
      'Produces a batch of title candidates scored against a stated click-through hypothesis and cross-checked line by line against what the video actually contains, so no option survives that the thumbnail-title pair would have to mislead on to earn the click.',
    promptText: `You are generating YouTube title options for a finished or near-finished video. Every title must be something a viewer would feel was accurate after watching the whole video — you are optimizing for click-through rate that survives contact with the actual content, not first-impression curiosity that collapses into a dislike or a fast exit once the video doesn't deliver what the title implied.

VIDEO CONTENT SUMMARY
{{video_summary}}

CURRENT OR PLACEHOLDER TITLE
{{current_title}}

TARGET KEYWORD OR SEARCH INTENT
{{target_keyword}}

THUMBNAIL CONCEPT (IF DECIDED)
{{thumbnail_concept}}

CHANNEL VOICE
{{channel_voice}}

TITLE RULES
Every specific number, superlative, or claim in a title — "5 mistakes," "the worst," "nobody tells you" — must be verifiably true of the video content summary provided; do not include something the video does not actually contain to make a title stronger. If the target keyword or search phrase is provided, at least half the title options must contain it in a natural position, since search-driven traffic depends on that literal match appearing in the title, not just implied by synonyms. Where a thumbnail concept is already decided, the title and thumbnail must not both make the same point — if the thumbnail already shows the shocking result visually, the title should supply the missing context or stakes instead of restating what the image already says, since a title-thumbnail pair that duplicates the same information wastes one of the two slots a viewer actually reads before deciding to click. Vary the mechanism across the options rather than producing five versions of the same curiosity-gap phrasing: include at least one option built on a stated number, one built on a direct question, one built on a specific named mistake or contradiction, and one that states the outcome plainly with no gap at all, since a fully transparent title is sometimes the highest-CTR option for a viewer who already trusts the channel and doesn't need to be teased. Match the channel voice given — a title that reads as a different channel wrote it breaks the trust a returning subscriber has already built with this specific channel's tone.

OUTPUT FORMAT
A numbered list of at least eight title options, each under 60 characters where possible. After each title, one line naming its specific mechanism (number, question, contradiction, plain statement, etc.) and one line confirming which exact part of the video content it is drawn from. Flag any title you considered but rejected specifically because it wasn't fully supportable by the content, and say why.`,
    variables: [
      {
        name: 'video_summary',
        description:
          'What actually happens in the video, in enough detail to fact-check a title against it.',
        example:
          'A personal-finance video testing four popular budgeting apps against the same real bank data for one month; two apps missed recurring subscriptions entirely, one had a data sync bug that double-counted a paycheck',
        required: true,
      },
      {
        name: 'current_title',
        description: 'The working title, if one already exists.',
        example: 'Testing 4 Budgeting Apps',
        required: false,
      },
      {
        name: 'target_keyword',
        description: 'The literal search phrase this video should be findable for.',
        example: 'best budgeting app 2026',
        required: false,
      },
      {
        name: 'thumbnail_concept',
        description:
          'What the thumbnail already shows or is planned to show, if decided.',
        example: 'Thumbnail shows four app logos with a big red X over two of them',
        required: false,
      },
      {
        name: 'channel_voice',
        description: "The channel's usual tone, so titles don't read as off-brand.",
        example:
          'Dry, slightly skeptical, numbers-first — avoids exclamation points and hype language',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'youtube-title',
      'click-through-rate',
      'thumbnail-strategy',
      'video-seo',
      'clickbait-avoidance',
    ],
    whyItWorks:
      "Click-through rate on impressions is the metric YouTube Studio surfaces as the direct measure of how well a title and thumbnail pair convert an impression into a view, but CTR earned by a claim the video doesn't back up shows up almost immediately as a collapsed audience-retention curve and a spike in the explicit dislike rate, because the viewer who clicked feels misled within the first minute — which is why this prompt fact-checks every number and superlative against the actual content summary before a title is allowed to survive, rather than treating CTR as the only variable that matters. Requiring the target keyword to appear literally, not just implied, in at least half the options reflects how YouTube's search indexing actually weighs title text as one of its strongest ranking signals for a search query, distinct from and generally stronger than the description or tags — a title that captures the idea of \"best budgeting app 2026\" through a clever paraphrase will not surface for that literal search the way a title containing the phrase itself will. The rule against the title and thumbnail restating the same information targets a specific, measurable inefficiency: a viewer scanning a results page or a suggested-videos rail processes the thumbnail and title together in under a second, and if both slots convey the identical fact — the image already shows the shocking result, the title just says it again in words — one of the two highest-value pieces of real estate a creator gets is being wasted on redundancy instead of adding context, stakes, or a second distinct hook. Deliberately varying the mechanism across options, including requiring one fully transparent, no-curiosity-gap option, matters because CTR performance is genuinely audience-dependent: a cold, first-time viewer from search often responds best to a plain, specific statement of outcome, while a returning subscriber already primed to trust the channel will click a vaguer curiosity-driven title precisely because they don't need to be convinced the payoff is real — testing across mechanisms rather than one formula is what actually surfaces which lever this specific video and audience responds to. Matching channel voice matters for a returning-viewer signal the algorithm also tracks: a title that reads like a different, more sensational channel wrote it can win a single click while quietly training regular viewers that this channel's titles can no longer be trusted at face value, which erodes exactly the return-viewer trust that drives long-term channel growth more reliably than any single video's CTR.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-21' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'youtube-thumbnail-concept-brief',
    category: 'youtube',
    title:
      'Write a thumbnail concept brief a designer or image model can actually execute',
    description:
      'Turns a video topic and title into a specific composition brief — subject, expression, contrast, text treatment, and what the title is left to say instead of the image — rather than a vague "make it eye-catching" note.',
    promptText: `You are writing a thumbnail concept brief for a YouTube video — a specification a designer, or an AI image tool, can execute directly, not a vague mood description. The brief must describe exactly what appears in the frame, because "make it pop" and "eye-catching" give the executor nothing to actually draw.

VIDEO TOPIC AND TITLE
{{video_topic_and_title}}

FINAL OR WORKING TITLE
{{title_text}}

CHANNEL THUMBNAIL STYLE
{{channel_thumbnail_style}}

KEY VISUAL ELEMENT AVAILABLE
{{available_visual}}

DEVICE CONTEXT
{{viewing_context}}

BRIEF RULES
Specify the single focal subject first — a face, an object, a before/after split — and justify why it, not something else in the video, is the strongest visual anchor; a thumbnail with two or three competing focal points loses to one with a single unmistakable subject at the small size thumbnails are actually viewed at. If a face is the focal subject, specify the exact expression in concrete terms — not "excited," but "eyebrows raised, mouth open mid-word, eyes wide, as if reacting to something just off-frame" — since a vague emotion word gives no direction and a genuinely legible expression at thumbnail size needs to be exaggerated well past how a person would actually look at that moment. Decide the text-on-thumbnail question deliberately: if the title text is already strong on its own, specify zero or minimal thumbnail text and say why, rather than defaulting to restating the title as an overlay — but if you do include text, cap it at three to five words in a typeface and color that stays legible at roughly 120 by 68 pixels, the actual size a thumbnail renders at on a mobile suggested-videos rail. Specify contrast and color deliberately relative to what a viewer will actually see it against — a thumbnail sitting in a feed of mostly blue-toned tech thumbnails should not also default to blue, and the brief should name the actual competing colors it needs to stand out from, not describe colors in isolation. State exactly what information the thumbnail is deliberately leaving for the title to carry, and what the title is leaving for the thumbnail to carry — the two should not duplicate the same fact.

OUTPUT FORMAT
1. One-paragraph concept statement naming the focal subject and the single idea the thumbnail communicates in under one second.
2. A composition spec: subject placement in-frame, expression or object detail, background treatment, color and contrast direction relative to feed context, any text with exact wording, size, and placement.
3. One line on what the title is left to say that the image deliberately does not.
4. If an AI image tool will generate this, a ready-to-use generation prompt matching the spec exactly.`,
    variables: [
      {
        name: 'video_topic_and_title',
        description:
          'What the video covers, for context on what visuals are even available.',
        example:
          'A video testing whether a $30 knife set can outperform a $300 professional set on five real kitchen tasks',
        required: true,
      },
      {
        name: 'title_text',
        description: 'The title this thumbnail will run alongside.',
        example: 'I Replaced My $300 Knives With $30 Ones for a Week',
        required: true,
      },
      {
        name: 'channel_thumbnail_style',
        description:
          "The channel's established thumbnail look, for consistency and recognizability.",
        example:
          'High-contrast close-ups on a plain dark background, bold white sans-serif text, red accent circle used as a recurring callout device',
        required: true,
      },
      {
        name: 'available_visual',
        description:
          'What real footage or asset actually exists to build the thumbnail from.',
        example:
          'Close-up shot of the cheap knife slicing cleanly through a tomato, and a separate shot of the expensive knife visibly chipped on its edge',
        required: true,
      },
      {
        name: 'viewing_context',
        description:
          'Where this thumbnail will mostly be seen, since feed context changes what stands out.',
        example:
          'Mostly mobile home-feed and suggested-videos rail, surrounded mostly by warm-toned cooking-channel thumbnails',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'youtube-thumbnail',
      'click-through-rate',
      'visual-design',
      'thumbnail-strategy',
      'video-seo',
    ],
    whyItWorks:
      "Specifying a single focal subject and rejecting multi-element compositions is grounded in the actual viewing conditions a thumbnail competes under: it is evaluated at roughly 120 by 68 pixels on a mobile suggested-videos rail, in a fraction of a second, alongside a dozen competitors doing the same thing — a composition with two or three points of interest that reads clearly on a full-size monitor becomes visual noise at that real render size, where only a single unmistakable shape survives the scroll-past glance. Demanding a concretely described expression rather than an emotion label addresses a specific gap between how a designer or image model interprets \"excited\" versus what is actually legible at thumbnail scale — a genuinely subtle, true-to-life expression of surprise disappears at that size, so the brief has to ask for the exaggerated, borderline-cartoonish version of the expression that reads instantly, which is a deliberate photographic choice, not an inaccuracy. Making the text-or-no-text decision explicit, with a real character cap and a legibility target tied to the actual render size, targets the common default failure of restating the title as a thumbnail overlay — when both elements say the same thing, the creator has spent two of the two available attention slots on one message instead of two, which is a wasted opportunity distinct from a bad thumbnail; a thumbnail with no text at all, letting a strong title carry the words, is frequently the higher-performing choice, but only if that's a deliberate call rather than an accidental default. Requiring contrast and color decisions relative to the actual feed context, not in isolation, matters because a thumbnail's job is fundamentally comparative — it needs to look different from whatever is next to it in a specific feed at a specific moment, and a well-designed thumbnail that happens to match the dominant color of everything around it will underperform an objectively less polished one that simply stands out, which is a context-dependent judgment a generic color-theory answer can't make without knowing what it's actually competing against. Splitting what the image says from what the title is left to say turns thumbnail and title into one coordinated two-part message instead of two independently optimized pieces that might duplicate or, worse, contradict each other.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-27' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Claude (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
    relatedToolSlug: 'color-palette-generator',
  },
  {
    slug: 'youtube-video-description-seo-structure',
    category: 'youtube',
    title:
      'Write a video description that actually helps search without keyword stuffing',
    description:
      "Structures a description around the fold, the transcript YouTube already indexes, and real link placement — instead of a keyword-repeated paragraph that reads as spam to both viewers and YouTube's own policy filters.",
    promptText: `You are writing a YouTube video description, structured for how the description is actually read — by a small number of humans who click "show more," and by YouTube's indexing of both the description text and the video's own closed-caption transcript. You are not writing a paragraph that repeats a keyword phrase to try to game search, which YouTube's own spam policies flag and which reads as obviously artificial to any real viewer who opens it.

VIDEO TOPIC AND KEY POINTS
{{video_topic}}

TARGET SEARCH PHRASES
{{target_search_phrases}}

TIMESTAMPS OR CHAPTERS
{{chapter_list}}

LINKS TO INCLUDE
{{links_to_include}}

CHANNEL CTA STANDARD
{{standard_cta}}

DESCRIPTION RULES
The first two to three lines — roughly the text visible before "show more" truncates it, about 150 characters — must contain the primary target search phrase used naturally and must independently make sense as a summary of the video, since this is the only part most viewers and most search-result previews ever actually display. Do not repeat the same target phrase more than twice in the full description; each additional use should be a natural variant or a related phrase a real searcher might type, not the identical string copy-pasted for density. Include the chapter list as actual timestamps in the mm:ss or h:mm:ss format YouTube auto-detects to render them as clickable jump links, and give each chapter a title that describes its content specifically enough to be useful as a standalone search snippet, not "Part 2" or "Continued." Place links in the order a viewer would actually want to act on them — the single most relevant link (the tool used, the product discussed) before general channel links like Discord or Patreon, since description text past the first handful of lines gets a small fraction of the clicks the top lines do. State the standard channel CTA once, briefly, and do not repeat subscribe-and-like language more than once — repeated CTAs read as desperate rather than persuasive and add length without changing the outcome. Do not include a keyword-stuffed closing paragraph or a long list of unrelated hashtags stapled to the bottom purely for reach; if hashtags are used, cap at 2-3 that a real viewer would recognize as genuinely relevant to the content.

OUTPUT FORMAT
The complete description text, ready to paste in, with clear line breaks between the opening summary, the chapter list, the links section, and the CTA line. After it, a short note confirming the primary search phrase's placement in the first three lines and confirming it was not repeated more than twice.`,
    variables: [
      {
        name: 'video_topic',
        description: 'What the video covers and its main points.',
        example:
          'A step-by-step guide to setting up a home espresso machine for the first time, covering grind size, dose, and tamping pressure',
        required: true,
      },
      {
        name: 'target_search_phrases',
        description: 'The real phrases someone would type to find this video.',
        example: 'home espresso setup for beginners, how to dial in espresso grind',
        required: true,
      },
      {
        name: 'chapter_list',
        description: 'The section breakdown with approximate timestamps.',
        example:
          '0:00 Intro, 0:45 Choosing your grind size, 3:10 Dosing and tamping, 7:20 Your first pull, 11:00 Common mistakes',
        required: true,
      },
      {
        name: 'links_to_include',
        description: 'Every link that should appear, in rough priority order.',
        example:
          'The exact grinder model used (Amazon link), a free dose-by-weight cheat sheet PDF, channel Discord, Instagram',
        required: true,
      },
      {
        name: 'standard_cta',
        description: "The channel's usual call to action, if it has one.",
        example: 'Subscribe for a new coffee-gear breakdown every Thursday',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'youtube-description',
      'video-seo',
      'youtube-chapters',
      'search-optimization',
      'keyword-strategy',
    ],
    whyItWorks:
      "Anchoring the primary search phrase to the first 150 characters targets the one part of a description that reliably gets read: YouTube truncates the description behind a \"show more\" toggle at roughly that length on both mobile and desktop, and that same truncated snippet is frequently what appears in a Google or YouTube search results preview, which means a keyword buried in paragraph four of a description that almost nobody expands is functionally invisible to both a human scanning results and, for practical purposes, to a searcher deciding whether to click. Capping keyword repetition at two uses rather than stuffing the phrase repeatedly is a direct response to YouTube's own documented spam and deceptive-practices policy, which explicitly treats excessive, unnatural keyword repetition in titles and descriptions as a policy violation subject to enforcement, not merely a stylistic weakness — this isn't just a readability preference, it's avoiding a categorization YouTube's systems are built to detect. Formatting chapters as literal mm:ss timestamps rather than a prose list matters mechanically: YouTube's player only auto-generates clickable chapter markers and a chapter menu when it detects timestamps in that exact recognized format starting from 0:00, and those chapter titles are also what YouTube surfaces as jump-to-timestamp links directly inside Google search results for well-optimized videos — a chapter titled \"Part 2\" instead of \"Choosing your grind size\" throws away a genuine search-visibility opportunity distinct from the description text itself. Ordering links by actual viewer intent rather than by channel-priority habit reflects a real, well-documented click-distribution pattern: engagement drops off sharply the further down a description a link sits, so a channel's Patreon link placed above the specific product a viewer came to find out about is optimizing for the creator's preference at the direct expense of the metric — click-through to the actually relevant link — that the description's structure should be serving first. Limiting hashtags to a small, genuinely relevant set rather than a long stapled-on list avoids a description that reads as obviously optimized-for-algorithm rather than written-for-a-human, which is itself a trust signal viewers pick up on even without being able to name why a description feels spammy.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-20' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'youtube-chapter-timestamps-from-transcript',
    category: 'youtube',
    title: 'Generate accurate chapter timestamps from a raw transcript',
    description:
      'Turns a raw, timestamped transcript into real chapter markers cut at genuine topic-change points, with search-usable titles — a job auto-chapters frequently gets wrong on transcripts with tangents or false starts.',
    promptText: `You are generating YouTube chapter markers from a raw, timestamped transcript. Chapters must be cut at genuine topic-change points in the actual content, not at mechanically even intervals, and each chapter title must work as a standalone search snippet — this is specifically needed because YouTube's own auto-chapters feature frequently misplaces cuts around tangents, false starts, and re-explanations, which is exactly the kind of judgment call this prompt is for.

RAW TRANSCRIPT WITH TIMESTAMPS
{{transcript_with_timestamps}}

VIDEO TOTAL LENGTH
{{video_length}}

TARGET SEARCH PHRASES FOR THIS VIDEO
{{target_search_phrases}}

KNOWN STRUCTURE NOTES
{{structure_notes}}

CHAPTER RULES
Identify a new chapter boundary only where the actual subject genuinely changes — a new sub-topic, a new step in a process, a shift from explanation to demonstration — never at a fixed interval like every two minutes regardless of content. If the speaker restates or circles back to an earlier point rather than introducing something new, that restatement belongs inside the existing chapter, not as a new one; a chapter list that fragments a single continuous explanation into three near-duplicate chapters is worse than useful, since it makes the jump-to menu look cluttered and imprecise. If the transcript contains a false start, a correction ("wait, let me redo that"), or an aside that gets cut in editing, do not create a chapter around it and do not let it shift your read of where the real topic boundary is — read past it to where the actual content resumes. The first chapter must start at 0:00 exactly, per YouTube's own requirement for chapters to register at all, even if the true content start is a few seconds later. Every chapter must be at least 10 seconds long; if the true topic segments are shorter than that, merge them into the nearest adjacent chapter rather than producing a chapter YouTube will refuse to register as its own entry. Title each chapter with a specific description of its actual content in 3-6 words — something a person scanning the jump-to menu, or seeing it as a snippet in a search result, could use to decide whether that segment is what they're looking for — never a generic label like "Continued" or "More Tips." Where a chapter's content matches one of the target search phrases closely, prefer phrasing that captures it naturally, without forcing an awkward match.

OUTPUT FORMAT
A list of timestamp-title pairs in the exact mm:ss (or h:mm:ss for videos over an hour) format YouTube auto-detects, one per line, starting at 0:00. After the list, one line for any place you merged what looked like two topics into one chapter, and why, and one line for any place you deliberately ignored a false start or aside in the transcript when placing a boundary.`,
    variables: [
      {
        name: 'transcript_with_timestamps',
        description:
          'The raw transcript with a timestamp at regular intervals or per sentence.',
        example:
          "[0:00] Alright so today... [0:38] okay let's actually talk about the three settings that matter... [4:12] now before I show you the results, wait, I should back up... [4:40] so the three settings again are... [9:05] let's look at what actually changed...",
        required: true,
      },
      {
        name: 'video_length',
        description: 'Total runtime of the video.',
        example: '14:32',
        required: true,
      },
      {
        name: 'target_search_phrases',
        description:
          'Phrases this video should be findable for, if chapter titles can capture them.',
        example: 'DaVinci Resolve color grading settings',
        required: false,
      },
      {
        name: 'structure_notes',
        description:
          "Anything about the video's real structure that isn't obvious from the transcript alone.",
        example:
          "The section starting around 4:12 has a false start where the speaker restarts the explanation — the real explanation doesn't begin until about 4:40",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'youtube-chapters',
      'video-seo',
      'transcript-processing',
      'search-optimization',
      'video-editing',
    ],
    whyItWorks:
      "YouTube's automatic chapter generation runs on the video's own transcript and tends to place boundaries at surface-level cues — a pause, a filler-word cluster, an even time interval — which is precisely why it misfires on exactly the material this prompt is built to handle: a false start, a mid-sentence correction, or a speaker circling back to restate a point earlier in the transcript all look, to a shallow pattern-matcher, like the start of something new, when a careful read of the actual content shows they aren't. Forcing chapter boundaries to require a genuine subject change, and explicitly instructing the model to read past a false start to where content actually resumes, targets that exact gap — this only works because the model is given the real transcript to reason over content, not a signal-only heuristic guessing from pauses and word frequency the way YouTube's automated feature does. The minimum 10-second chapter length rule isn't a stylistic preference — YouTube enforces its own minimum duration for a chapter to register as a distinct, clickable entry at all, and a chapter list that ignores this produces markers that either get silently merged by YouTube's player or, worse, fail to render as chapters entirely, which means a set of timestamps that look correct in a text list can quietly not exist as usable navigation on the actual video. Requiring the 0:00 start exactly, regardless of a few seconds of true dead air, mirrors YouTube's own documented requirement that the first chapter must begin at zero for the rest of the list to register — a chapter list starting at 0:04 because that's technically where content begins is a well-intentioned mistake that breaks the whole feature. The specific, non-generic titling rule matters for a second reason beyond the in-player jump menu: well-titled chapters are what YouTube surfaces as direct timestamp links inside Google search results for the video, so a chapter titled \"More Tips\" is not just unhelpful in the player's own menu, it is a wasted opportunity for that exact segment to independently rank and get clicked from a search results page for whichever specific thing it actually covers.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-23' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Claude (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'youtube-shorts-script-loop-optimized',
    category: 'youtube',
    title: 'Write a Shorts script built around the loop, not the story arc',
    description:
      'Structures a sub-60-second Shorts script so its last frame reconnects to its first, since Shorts ranks primarily on completion and rewatch rate on a separate feed from long-form watch time, not on the narrative-arc logic a full script would use.',
    promptText: `You are writing a YouTube Shorts script. Shorts run on a separate feed from long-form video, ranked primarily on completion rate and rewatch rate rather than absolute watch time, which changes the actual structural goal here: the aim is not "a satisfying story" the way a long-form script would be, it's a loop a viewer watches all the way through and then watches again without deciding to.

CONCEPT
{{concept}}

TARGET LENGTH
{{target_length}}

SOURCE MATERIAL
{{source_material}}

HOOK ANGLE
{{hook_angle}}

LOOP RULES
The first line spoken or shown on screen must be understandable with zero context and must create tension that only resolves by watching to the end — a viewer scrolling past has under one second to decide whether to stop, so there is no room for a setup sentence before the hook. The final frame or final line must connect back to the first one, either by literally repeating a visual or phrase from the opening, by leaving a detail unexplained that only makes sense once re-watched from the start, or by ending mid-motion in a way that flows naturally back into the opening frame — the goal is that a viewer who reaches the end has a reason to let it loop rather than swipe away, since a rewatch counts as additional watch time on the exact same piece of content instead of requiring a new view to be earned from scratch. Cut every line that does not directly serve the hook or the loop's setup and payoff — a Shorts script has no room for a scene-setting aside, a tangent, or a joke that doesn't advance toward the loop point; if a line's absence wouldn't change whether the loop works, cut it. Front-load the single most visually or verbally interesting moment as early as physically possible without spoiling the loop's payoff — waiting past the first three seconds for the best moment assumes a level of patience the format does not reward. State on-screen text only where it adds information the voice or visual doesn't already carry, since Shorts are frequently watched muted or half-attended, and both channels — audio and visual — should carry the core point independently, not redundantly.

OUTPUT FORMAT
1. The script as a numbered sequence of beats, each with an estimated duration in seconds, spoken or on-screen text, and a one-line visual direction.
2. One line explicitly stating the loop mechanic — exactly what connects the last beat back to the first.
3. Total runtime, confirmed to be under the target length.`,
    variables: [
      {
        name: 'concept',
        description: 'The core idea or moment the Short is built around.',
        example:
          'A quick demo showing a $4 kitchen gadget doing something that looks impossible the first time you see it',
        required: true,
      },
      {
        name: 'target_length',
        description: 'Maximum runtime for the Short.',
        example: '30 seconds',
        required: true,
      },
      {
        name: 'source_material',
        description: 'What footage, demo, or existing content this Short is built from.',
        example:
          'Existing footage of a citrus peeler tool removing an entire orange peel in one continuous spiral in under 4 seconds',
        required: true,
      },
      {
        name: 'hook_angle',
        description: 'The specific tension or claim the opening line should create.',
        example:
          "Open on the peel already halfway off, before revealing how — creates a 'wait, how' reaction instantly",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'youtube-shorts',
      'short-form-video',
      'loop-structure',
      'script-writing',
      'completion-rate',
    ],
    whyItWorks:
      "YouTube has confirmed Shorts run on a distinct recommendation surface from long-form video, and that surface weighs completion rate and rewatches heavily — a viewer who watches to the end and then sits through it again registers as a strong quality signal on a piece of content that took no additional production or discovery cost to earn, which is structurally different from long-form's absolute-watch-time model and is exactly why this prompt treats the loop, not the story arc, as the actual design target: a Short can have a technically satisfying three-act structure and still underperform one that has no real ending at all but reconnects cleanly to its own opening. The zero-context, sub-one-second hook requirement is a direct response to how Shorts are actually consumed — a full-screen, thumb-driven, rapid-scroll feed where the decision to stop scrolling happens almost instantly and with none of the search intent or channel-recognition context a long-form suggested video benefits from, so a script that assumes even three seconds of patience for a setup is designing for a feed that doesn't exist. The instruction to cut every line that doesn't serve the hook or the loop payoff targets a common failure when scripts get adapted down from longer-form thinking: a joke or aside that would be a nice pacing beat in a 10-minute video is dead weight in a 30-second one, because a Short's information density has to be near total — every second either builds toward the loop or it's actively working against completion. The audio-and-visual-independence rule matters because Shorts autoplay muted by default in-feed on many surfaces and a meaningful share of the audience never unmutes, so a script whose core point is only carried through narration, with on-screen text used purely as decoration, is invisible to a real fraction of its actual audience — and the reverse also holds, since a Short that requires reading dense on-screen text to understand loses viewers who have sound on and are watching, not reading. Explicitly naming the loop mechanic as its own required output line forces the model to commit to a real, checkable connection between first and last beat rather than a vague gesture toward one, since \"it should loop nicely\" left unspecified is exactly the kind of instruction that produces an ending that just stops instead of one engineered to flow back into the start.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-25' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Gemini (Gemini 3 Pro).',
      },
    ],
  },
  {
    slug: 'youtube-retention-graph-drop-diagnosis',
    category: 'youtube',
    title: "Diagnose why a specific video's retention graph drops where it does",
    description:
      'Reads a described audience-retention curve alongside the actual script or transcript to name the likely cause of a specific drop, distinguishing a real content problem from a normal, harmless dip — instead of assuming every dip needs fixing.',
    promptText: `You are diagnosing a specific drop in a YouTube video's audience retention graph by cross-referencing the described curve against the actual script or transcript for that section. You are not giving generic retention advice — you are explaining what most likely caused this specific drop, at this specific timestamp, in this specific video, and whether it's actually worth fixing.

RETENTION GRAPH DESCRIPTION
{{retention_description}}

SCRIPT OR TRANSCRIPT FOR THE FLAGGED SECTION
{{section_transcript}}

VIDEO CONTEXT
{{video_context}}

WHAT ELSE IS KNOWN
{{additional_context}}

DIAGNOSTIC RULES
First classify the drop by its shape, since different shapes mean different things: a sharp single-frame or single-second cliff usually means a specific moment — a jump cut, a sponsor segment starting, a scene change — actively pushed viewers to leave, and the transcript or edit at that exact timestamp should show a distinct trigger. A gradual decline over 20-60 seconds usually means the content itself lost the viewer's interest across that whole stretch, not at one instant — look for a slow setup, a repeated point, or a tangent spanning that range rather than hunting for one single line to blame. A drop that recovers shortly after — viewers leaving and then the curve flattening at a lower but stable level — usually means a specific segment (an ad read, an aside) filtered out viewers who weren't interested in it specifically, which is a different problem than a drop that keeps sloping downward and never stabilizes, which suggests the whole video lost the plot from that point on. Before recommending any fix, check whether the drop is actually large relative to the rest of the video's own curve — a small, ordinary dip that's in line with normal per-minute attrition elsewhere in the same video is not a problem to solve, and treating every wiggle in a retention graph as a crisis produces fixes for things that were never broken. Where the transcript shows a candidate cause, state your confidence honestly — a retention graph on its own can show where viewers left but cannot prove why, so name the mechanism you suspect and flag it as an inference, and note what would need to be true to confirm it, such as a comment thread mentioning the exact same section or a similar drop recurring across multiple videos at the same relative point.

OUTPUT FORMAT
1. Drop classification (cliff, gradual decline, filtering dip, or ordinary variation) with the reasoning.
2. Most likely cause, cited to the specific line, cut, or segment in the provided transcript, with a stated confidence level.
3. Whether this drop is actually worth acting on, given its size relative to the rest of the video's curve.
4. If worth fixing, one concrete, specific change to that section — not generic advice like "make it more engaging."`,
    variables: [
      {
        name: 'retention_description',
        description:
          'What the retention graph actually shows, described from YouTube Studio.',
        example:
          'Retention holds around 68% until 3:20, then drops sharply to 41% between 3:20 and 3:35, then flattens and declines only gradually for the rest of the video',
        required: true,
      },
      {
        name: 'section_transcript',
        description:
          'The script or transcript covering the flagged timestamp range and a bit before/after.',
        example:
          "[3:05] So that's the basic setup. [3:22] Quick word from today's sponsor, NordVPN — [3:58] okay, back to the actual build...",
        required: true,
      },
      {
        name: 'video_context',
        description: 'What kind of video this is and its typical retention baseline.',
        example:
          "A 12-minute DIY furniture build video; this channel's videos in this format usually average 55-60% overall retention",
        required: true,
      },
      {
        name: 'additional_context',
        description: 'Anything else relevant — comments, similar past drops, edit notes.',
        example:
          'Three separate comments on this video mention skipping "the ad part" — no comments mention the actual build content negatively',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'audience-retention',
      'youtube-analytics',
      'video-diagnostics',
      'watch-time',
      'content-strategy',
    ],
    whyItWorks:
      "Classifying the drop by shape before assigning a cause reflects a real distinction in what a retention curve can actually tell you: a sharp, near-vertical drop concentrated in a few seconds is consistent with a specific triggering moment because viewers don't gradually decide to leave in under two seconds, they react to something — a jump cut, an ad read starting, a tone shift — whereas a slow decline spread over a full minute cannot be pinned to one instant because no single second explains a decay that's spread across sixty of them; treating both shapes with the same generic \"find the boring part\" instruction throws away information the graph itself is actually encoding. Separating a filtering dip that recovers and stabilizes from a decline that never recovers matters because they imply opposite responses — a stable plateau after a drop usually means a specific segment, like a sponsor read, cleanly lost viewers who weren't interested in it while the rest of the audience stayed, which is often an acceptable and even expected cost of that segment, while a curve that keeps sloping downward past the flagged point means whatever caused the initial drop kept bleeding viewers afterward, which is the pattern that actually warrants a structural fix to the video, not just the one segment. Requiring a check against the video's own baseline before recommending any fix prevents the common overcorrection of treating every visible wiggle in a retention graph as a crisis: some attrition every minute is completely normal, described in YouTube's own creator guidance as an expected pattern, and a dip that's proportionally similar to normal per-minute drop-off elsewhere in the same video is statistical noise, not a signal, so spending editing effort \"fixing\" it treats a normal curve shape as a bug. Explicitly requiring the model to state its confidence and name what would confirm the inference is the most important honesty constraint here: a retention graph shows precisely where in time viewers left but says nothing directly about why, so any causal story drawn from a transcript alone is an informed guess, and corroborating evidence like a recurring comment thread or the same relative drop appearing across multiple videos is what would actually elevate that guess to something closer to a confirmed diagnosis rather than a plausible-sounding story matched after the fact to a shape in a graph.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-26' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Claude (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'youtube-sponsor-integration-ad-read-script',
    category: 'youtube',
    title:
      "Write a sponsor integration that doesn't tank retention or skip legal disclosure",
    description:
      'Places and scripts a mid-roll sponsor segment with a genuine content bridge on both sides and the exact FTC/YouTube disclosure language required, instead of a bolted-on read that causes a retention cliff and skips a legal requirement.',
    promptText: `You are writing a sponsored segment to integrate into an existing YouTube video — the actual ad-read script plus exactly where it goes and how it connects to the content on either side. A sponsor segment that interrupts the video with no bridge, and that omits required disclosure, costs the creator both retention and legal exposure; you are avoiding both.

VIDEO TOPIC AND WHERE THE SEGMENT WOULD GO
{{video_context}}

SPONSOR AND WHAT THEY WANT MENTIONED
{{sponsor_brief}}

DISCLOSURE REQUIREMENT
{{disclosure_type}}

CHANNEL VOICE
{{channel_voice}}

SEGMENT LENGTH TARGET
{{segment_length}}

INTEGRATION RULES
Never open the segment with a hard cut and a tone shift straight into "today's sponsor is" — bridge from the actual content into the segment with one or two sentences that connect logically, even loosely, to what was just being discussed, since a jarring transition is what makes a sponsor segment feel like an interruption instead of a continuation, and that feeling is what drives the skip. State the disclosure exactly as required by the type specified — this is not a stylistic choice the channel voice can override; "thanks to [sponsor] for supporting the channel" alone does not satisfy a paid-partnership disclosure requirement in most jurisdictions and platforms, and the specific required language or on-screen paid-promotion tag must be included, stated plainly, not buried in a mumbled aside. Write genuine, specific claims about the sponsor's product using only what's provided in the sponsor brief — do not invent a feature, statistic, or use case the brief didn't state, since a script that oversells the product creates a mismatch between the ad and the actual product a viewer might use, which damages channel trust with both the sponsor and the audience. End the segment with a bridge back into the video's actual content that mirrors the opening bridge — the segment should feel like a bracketed aside the viewer can mentally file as "over now," not a fade-out that leaves the viewer unsure whether the sponsor talk is really done. Keep the segment at or under the stated length target; a sponsor read that runs long relative to what was promised to the channel's own audience is the single most common cause of a viewer skipping the whole next 30 seconds via the seek bar rather than just this one segment, since the visible drop in the timeline UI itself signals "this part is skippable."

OUTPUT FORMAT
1. The exact bridge-in line(s), the full ad-read script, and the bridge-out line(s), as spoken lines.
2. The required on-screen or verbal disclosure text, stated exactly and flagged clearly as non-negotiable.
3. Where in the existing video this segment should be placed and why that specific point, not an earlier or later one, minimizes the jarring-transition problem.
4. Confirmation the total spoken segment fits the length target.`,
    variables: [
      {
        name: 'video_context',
        description:
          'What the video is about and roughly where the sponsor segment needs to sit.',
        example:
          'A video reviewing a mechanical keyboard build — segment needs to go somewhere in the middle, likely right after the switch-testing section and before the final assembly',
        required: true,
      },
      {
        name: 'sponsor_brief',
        description:
          'The sponsor, product, and the specific claims or features they want mentioned.',
        example:
          'Sponsor is a password manager app; wants biometric unlock and a "breach monitoring" feature mentioned, plus a specific discount code MECH20',
        required: true,
      },
      {
        name: 'disclosure_type',
        description:
          'What disclosure is legally or contractually required for this integration.',
        example:
          'Paid partnership — requires YouTube\'s built-in "Includes paid promotion" tag plus a clear verbal disclosure per FTC endorsement guidance',
        required: true,
      },
      {
        name: 'channel_voice',
        description: "The channel's usual tone.",
        example:
          'Dry, technical, slightly self-deprecating about spending too much on hobby gear',
        required: true,
      },
      {
        name: 'segment_length',
        description: 'The target duration promised for the sponsor read.',
        example: '45-60 seconds',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'sponsored-content',
      'ftc-disclosure',
      'ad-read',
      'audience-retention',
      'brand-partnership',
      'youtube-monetization',
    ],
    whyItWorks:
      "Requiring a real content bridge on both sides of the segment targets a specific, visible failure pattern in retention graphs: a sponsor read that hard-cuts in with a tone shift creates an unmistakable discontinuity a viewer registers almost instantly, and that recognition — \"this is the ad part now\" — is what drives an immediate skip via the seek bar, whereas a segment that flows out of and back into the actual content, even loosely, gives a viewer less of a clean edge to jump across. Treating the disclosure language as strictly non-negotiable, regardless of how it fits the channel's voice, reflects a genuine legal distinction most channel-voice guidance ignores: FTC endorsement guidance and YouTube's own paid-promotion policy specify what a disclosure must actually convey — a clear, unambiguous statement that the content is sponsored, not a vague thank-you that a viewer could read as organic enthusiasm — and a script that lets tone override that requirement can produce something that sounds natural but doesn't legally or contractually qualify as disclosure at all, which is a materially different and more serious problem than an awkward ad read. Restricting product claims to exactly what the sponsor brief provided, with no invented features or stats, protects against a failure mode specific to AI-drafted ad copy: a model asked to make a sponsor segment compelling will readily generate a plausible-sounding but unverified claim about a product it has no real information about, and if that claim turns out to be false or exaggerated, the cost lands on the creator's relationship with both the sponsor, who didn't approve the claim, and the audience, who trusted the creator's endorsement. The length-target enforcement connects to a specific, visible piece of YouTube's own player UI: the retention graph and the seek bar both show viewers roughly where they are in a video, and a sponsor segment that visibly runs long against what a channel typically does becomes identifiable at a glance on the seek bar's heatmap-like retention overlay, training regular viewers to recognize and skip that specific stretch on sight in future videos too, which compounds the cost of an over-long read well past the single video it appears in.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'youtube-repurpose-longform-into-shorts-clips',
    category: 'youtube',
    title: 'Pull the actual Shorts-worthy moments out of a long-form transcript',
    description:
      'Identifies specific timestamp ranges in a long-form transcript that work as standalone Shorts, and rejects moments that only make sense with the surrounding context the clip would cut away — instead of mechanically clipping the video\'s "highlights."',
    promptText: `You are identifying which specific moments in a long-form video's transcript are genuinely strong candidates for standalone YouTube Shorts, and rejecting ones that only seem interesting because of surrounding context a Short would cut away. Not every quotable or funny moment in a long video survives being extracted — the test is whether it works with zero prior context, not whether it was a highlight of the original.

FULL TRANSCRIPT WITH TIMESTAMPS
{{transcript_with_timestamps}}

ORIGINAL VIDEO TOPIC
{{video_topic}}

NUMBER OF CLIPS NEEDED
{{number_of_clips}}

CHANNEL SHORTS STRATEGY
{{shorts_strategy}}

SELECTION RULES
For each candidate moment, apply a strict test before including it: read only the 15-45 seconds around the clip's proposed boundaries, with zero surrounding context, and confirm it makes complete sense and lands its point on its own — if understanding it depends on something explained ten minutes earlier in the original video, reject it as a Shorts candidate even if it was a great moment in the full video. Prefer moments that already have a self-contained arc — a claim, then a demonstration or payoff, within the same short window — over moments that are just a strong isolated line with no setup or resolution nearby, since a strong line alone often needs the surrounding video to land and a self-contained arc doesn't. Note the exact in and out timestamps for each clip, and check the few seconds immediately before your proposed start point — if the actual sentence or thought genuinely begins slightly earlier than the "best" line, adjust the start point backward so the clip doesn't open mid-thought, which is a common editing mistake when clipping purely by "where the good part starts." Flag where a clip's context needs a single added on-screen caption to work without the surrounding video — for instance, naming what's being reacted to — rather than either forcing the clip to stand fully alone with no assist or silently including confusing unstated context. Rank the selected clips by how well each satisfies the zero-context test, not by how funny or dramatic the moment seemed in the original, since virality potential and originality of the point matter, but nothing outperforms actually being comprehensible in isolation.

OUTPUT FORMAT
For each of the requested number of clips: exact in/out timestamps, a transcript excerpt of just that range, a one-line note on why it passes the zero-context test, and any single caption needed to make it stand alone. Rank the full list from strongest to weakest zero-context candidate.`,
    variables: [
      {
        name: 'transcript_with_timestamps',
        description: 'The full long-form transcript with timestamps.',
        example:
          "[2:14] ...and that's when I realized the whole recipe was wrong from the start. [2:31] So here's what actually works: you brown the butter FIRST, before anything else touches the pan. [2:58] Watch what happens when I do it the other way...",
        required: true,
      },
      {
        name: 'video_topic',
        description: 'What the original long-form video is about.',
        example:
          'A 22-minute video troubleshooting why a classic cookie recipe kept coming out flat, testing five variables one at a time',
        required: true,
      },
      {
        name: 'number_of_clips',
        description: 'How many Shorts candidates to identify.',
        example: '5',
        required: true,
      },
      {
        name: 'shorts_strategy',
        description:
          "The channel's goal for its Shorts — driving to long-form, standalone growth, etc.",
        example:
          'Shorts are meant to drive discovery toward the long-form channel — prefer clips that clearly reference "the full breakdown" without giving away the full answer',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'youtube-shorts',
      'content-repurposing',
      'video-editing',
      'transcript-processing',
      'short-form-video',
    ],
    whyItWorks:
      'The zero-context test is the actual mechanism this whole prompt is built around, because the single most common mistake in mechanical highlight-clipping is mistaking "this was a great moment in the full video" for "this works as a standalone piece of content" — a line that lands because of ninety seconds of buildup earlier in the video will confuse or simply fail to land for a Shorts viewer who has none of that setup and won\'t go find it, no matter how good the line sounded in context, which is why the rule is explicit that great-in-context and works-alone are different properties and only the second one matters for this format. Preferring a self-contained claim-then-payoff arc over an isolated strong line targets a subtler version of the same problem: an isolated quotable line often relies on the audience already caring about the stakes established earlier, while a moment with its own mini setup and resolution inside a 30-45 second window carries its own stakes and doesn\'t need to borrow interest from content the clip doesn\'t include. Checking the few seconds before the proposed start point for a mid-thought opening addresses a specific, common technical clipping error: identifying the "best line" first and cutting right before it frequently starts the clip mid-sentence or mid-thought, because the actual idea often begins a beat earlier than the specific words that made the moment memorable, and a viewer who opens on an already-in-progress thought loses the exact clarity the zero-context test is trying to protect. Flagging where a single caption could rescue an otherwise-borderline clip, rather than only accepting fully self-sufficient moments, matters because it distinguishes two genuinely different fixes: some content problems need a caption supplying one piece of missing context — who\'s being replied to, what\'s being reacted to — which is a legitimate and common Shorts editing technique, while other content simply cannot be made to work standalone at any caption budget and should be rejected outright rather than patched with an increasingly elaborate caption trying to compensate for content that fundamentally depends on its original context.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-28' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Claude (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'youtube-tutorial-howto-script-outline',
    category: 'youtube',
    title:
      'Outline a how-to script paced for people actually following along, not just watching',
    description:
      'Structures a tutorial script around the moments a real viewer pauses to act, not just the moments a narrator finishes explaining — the specific gap where most instructional videos lose people who are trying to follow along in real time.',
    promptText: `You are outlining a how-to or tutorial video script paced for a viewer who is actually trying to follow along and do the thing, not just watch passively. A tutorial script that reads well as narration can still fail its actual audience if it never gives someone doing the task in real time a moment to catch up, which is a different failure than a boring or unclear explanation.

TASK BEING TAUGHT
{{task_topic}}

VIEWER SKILL LEVEL
{{skill_level}}

MATERIALS OR TOOLS REQUIRED
{{materials_required}}

KNOWN TRICKY STEPS
{{tricky_steps}}

TARGET LENGTH
{{target_length}}

OUTLINE RULES
Open by stating the full materials or tools list and the total time commitment before any instruction begins — a viewer deciding whether to follow along right now needs that information upfront, not discovered piecemeal as each tool is introduced mid-step, which forces someone already mid-task to pause and go find something they didn't know they'd need. Break the task into discrete numbered steps matched to natural stopping points in the actual physical or digital process, not to arbitrary time chunks — a step boundary should fall where a real person doing this would naturally look up from the task to check they're still on track, not wherever happens to be a clean two-minute mark. For any step flagged as tricky, slow the pacing specifically there: state the common mistake explicitly before it happens, not only how to do it correctly, since a viewer who doesn't know a mistake is common won't know to be careful at the one point where care actually matters. Build in an explicit verbal checkpoint after any step a viewer would need real time to complete alongside the video, not just watch — "pause here if you need to, this next part assumes the last step is done" — rather than assuming a viewer will manage their own pacing by scrubbing the video themselves, since most viewers won't. State results or symptoms of getting a step wrong, where relevant, so a viewer who's fallen behind or made a mistake has a way to self-diagnose rather than only discovering something's wrong at the very end. Do not front- or back-load all the tricky content — if there are multiple genuinely hard steps, each one gets its own slowdown and explicit mistake-warning in place, not just the first one encountered.

OUTPUT FORMAT
1. Materials/tools and total time, stated as a single upfront block.
2. Numbered steps, each with an estimated timestamp, the instruction, and — for any step matching a tricky step provided — the specific common mistake called out before the instruction.
3. Explicit checkpoint lines marked clearly, placed after any step requiring real hands-on time.
4. A closing troubleshooting note listing symptoms of the most likely things to go wrong and what they indicate.`,
    variables: [
      {
        name: 'task_topic',
        description: 'The specific task being taught.',
        example: 'Replacing a bicycle chain and adjusting the derailleur afterward',
        required: true,
      },
      {
        name: 'skill_level',
        description: 'What the target viewer already knows or has done before.',
        example:
          'Complete beginner — has never used bike tools before, may not own a chain tool yet',
        required: true,
      },
      {
        name: 'materials_required',
        description: 'Everything the viewer needs before starting.',
        example:
          'New chain sized to the bike, a chain tool, a small screwdriver, gloves recommended',
        required: true,
      },
      {
        name: 'tricky_steps',
        description:
          'Which specific steps commonly go wrong for someone at this skill level.',
        example:
          'Getting the new chain length exactly right (too many or too few links is the most common beginner mistake), and reconnecting the chain without the connector pin popping out under tension',
        required: true,
      },
      {
        name: 'target_length',
        description: 'Intended runtime.',
        example: '10-13 minutes',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'tutorial-script',
      'how-to-video',
      'instructional-design',
      'video-pacing',
      'script-writing',
    ],
    whyItWorks:
      'Separating "a script that reads clearly" from "a script paced for someone actually doing the task in real time" names a real and specific gap: a narrator can finish explaining a step in fifteen seconds while the physical or digital action it describes takes a viewer two full minutes to actually complete, and a script written only for narrative clarity has no mechanism to account for that mismatch — it just keeps talking, and a viewer following along either falls behind or gives up and switches to passive watching, defeating the tutorial\'s actual purpose. Requiring the materials and time commitment upfront, rather than introduced tool-by-tool as each is needed, targets a specific and common frustration in tutorial content: a viewer who is already elbow-deep in step four discovering they need a tool they don\'t own has to pause, go find or buy it, and return, which is a much worse experience than knowing that requirement before starting at all and deciding then whether to proceed. Slowing down specifically at flagged tricky steps, and stating the common mistake before the instruction rather than only the correct method, matters because knowing a step is difficult changes how carefully a person performs it — a viewer told nothing extra about a genuinely error-prone step approaches it with the same attention as an easy one, and the mistake the flag was meant to prevent happens anyway, silently, with the viewer only discovering something\'s wrong steps later when the consequence surfaces. The explicit checkpoint instruction addresses the single biggest structural difference between a tutorial and ordinary narrative video: video plays at a fixed pace and hands do not, so any step requiring real manual time needs an explicit, stated permission to pause — without it, most viewers won\'t self-manage pausing well, either rushing to keep up with narration that\'s already moved on or, less often, pausing so much they lose the thread of what comes next. The closing troubleshooting note, tied to specific symptoms rather than a generic "if something went wrong, redo it," gives a viewer who is already behind or already made a mistake a real diagnostic tool instead of leaving them to discover a compounding error only once the whole task visibly fails at the end.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-20' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-27' },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'youtube-listicle-top-n-script',
    category: 'youtube',
    title:
      'Write a "Top N" list video that earns its ranking instead of just numbering items',
    description:
      'Forces an explicit, stated ranking criterion behind a listicle-format script and orders items to build toward a genuine top pick — instead of a script that reads as an arbitrarily numbered list of unconnected mini-reviews.',
    promptText: `You are writing a "Top N" listicle-format YouTube script. The number in the title implies a ranking, and a script that just presents N items in an arbitrary order with no actual comparison between them breaks that implicit promise — you are writing a script that ranks against a stated, consistent criterion and makes the comparison between items visible, not just a sequence of separate mini-segments that happen to be numbered.

TOPIC AND LIST SIZE
{{topic_and_count}}

RANKING CRITERION
{{ranking_criterion}}

ITEMS AND WHAT'S KNOWN ABOUT EACH
{{items_list}}

ORDER DIRECTION
{{order_direction}}

TARGET LENGTH
{{target_length}}

SCRIPT RULES
State the ranking criterion explicitly near the start of the video, in plain language — "ranked by how much daily use you actually get, not by spec sheet or price" — so the audience knows what claim they're agreeing or disagreeing with, rather than leaving the ranking logic implicit and letting viewers assume whatever criterion they'd personally use. Every item's placement must be justified against that stated criterion specifically, with at least one direct comparison to an adjacent item on the list — "this ranks above the previous entry because X, even though the previous one technically Y" — since a listicle that never compares items against each other is really N separate reviews with numbers stapled on, not an actual ranking. If two items are close, say so explicitly and state what specifically tipped the ranking, rather than presenting every placement with equal, unearned confidence — a script that pretends a close call was obvious loses credibility with any viewer who happens to know the subject well. Build toward the top pick rather than front-loading the most interesting item early — increase the specificity or stakes of the comparisons as the list progresses, so the final 1-2 entries feel like the payoff of everything before them, not just the next number in sequence. If the order direction is ascending (counting up to number one) versus descending (starting at number one and counting down), commit fully to that structure's own pacing logic rather than mixing conventions — ascending builds suspense toward a reveal, descending front-loads the "best" claim and needs the rest of the list to still hold interest without a reveal to build toward.

OUTPUT FORMAT
1. A short intro segment stating the ranking criterion plainly.
2. Each list entry as spoken lines, in final order, each including the direct comparison-to-neighbor line required above.
3. A closing section stating the top pick's specific edge over the runner-up.
4. Explicitly flag any two adjacent items that were a genuinely close call and why.`,
    variables: [
      {
        name: 'topic_and_count',
        description: 'The list topic and how many items.',
        example: 'Top 7 noise-cancelling headphones under $200',
        required: true,
      },
      {
        name: 'ranking_criterion',
        description: 'The actual, stated basis for the ranking.',
        example:
          'Ranked by real-world noise cancellation performance in an actual commute environment, not by spec-sheet dB ratings or brand reputation',
        required: true,
      },
      {
        name: 'items_list',
        description:
          'The items and the relevant facts, test results, or notes about each.',
        example:
          'Sony WH-CH720N (strong ANC, weak bass), Anker Soundcore Q45 (best-in-class ANC for the price, bulkier fit), JBL Tune 760NC (mediocre ANC, great battery life)... plus 4 more with similar notes',
        required: true,
      },
      {
        name: 'order_direction',
        description: 'Ascending (building to #1) or descending (starting at #1).',
        example: 'Ascending — count up to the winner at the end',
        required: true,
      },
      {
        name: 'target_length',
        description: 'Intended video runtime.',
        example: '11-14 minutes',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'listicle-script',
      'youtube-script',
      'ranking-content',
      'comparison-video',
      'script-writing',
    ],
    whyItWorks:
      "Requiring the ranking criterion to be stated plainly near the top addresses a specific credibility gap in listicle content: a viewer watching a \"Top 7\" video has an implicit ranking criterion of their own in mind — usually price, usually overall quality — and if the video's actual criterion is something narrower and more specific, like real-world noise cancellation in commute noise rather than spec-sheet numbers, an unstated criterion means the audience is silently grading every placement against a standard the video was never actually optimizing for, producing comments arguing the ranking is wrong when the real disagreement is about what's being measured at all. Mandating a direct comparison to at least one adjacent item at every placement targets the single most common structural weakness of AI-generated listicles: an item-by-item summary with numbers attached reads exactly like N independent mini-reviews, because nothing in the script actually requires the model to reason about item 4 relative to item 3 — the comparison instruction forces that relative reasoning to happen and to show up on the page, which is the actual work a ranking is supposed to represent. Requiring an explicit call-out when two items are genuinely close, rather than uniform confident certainty at every rank, matters because real rankings of real products or ideas are rarely all equally clear-cut, and a script that asserts every single placement with identical confidence reads as either naive to anyone who actually knows the category well, or as a ranking generated without real comparative reasoning at all — acknowledging a close call is a stronger credibility signal than false uniform certainty, not a weaker one. The build-toward-the-top-pick pacing rule, and the requirement to commit fully to either ascending or descending logic rather than blending them, both target the same underlying problem from different angles: a listicle's dramatic structure and its ranking logic have to reinforce each other, since an ascending list that front-loads its most interesting comparison at position two has nowhere left to escalate to by the time it reaches the actual reveal, deflating the exact payoff the countdown structure exists to build toward.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-24' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Gemini (Gemini 3 Pro).',
      },
    ],
  },
  {
    slug: 'youtube-storytime-narrative-script',
    category: 'youtube',
    title:
      'Structure a storytime video with a real narrative arc, not just chronological retelling',
    description:
      'Rebuilds a personal-story video around what the storyteller understood by the end versus the start, with deliberate tension placement — instead of a flat, chronological "and then this happened" retelling that has no reason to hold attention.',
    promptText: `You are structuring a "storytime" narrative YouTube script — a first-person account of something that actually happened, told for an audience, not a court deposition. A story that just recounts events in the order they occurred, with no shaping, has no reason to hold attention past the first factual surprise; you are building an actual narrative arc on top of the true events, without inventing anything that didn't happen.

WHAT ACTUALLY HAPPENED
{{true_events}}

WHAT YOU UNDERSTOOD DIFFERENTLY BY THE END
{{narrative_shift}}

TONE
{{tone}}

TARGET LENGTH
{{target_length}}

SENSITIVE DETAILS TO HANDLE CAREFULLY
{{sensitive_details}}

NARRATIVE RULES
Identify the actual dramatic question the story is answering — not "what happened" but the specific thing the audience is meant to wonder throughout: will this person get away with it, was the storyteller right to trust someone, how did an ordinary decision turn into a disaster — and structure every scene to either build or complicate that question, not just to report the next chronological event. Do not reveal the ending's key turn earlier than the story earns it — if the true events include an early detail that gives away the ending's twist, either withhold restating its significance until later, or use it as deliberate foreshadowing the audience only recognizes in hindsight, rather than accidentally spoiling your own story's turn three minutes before it should land. Include the storyteller's real, in-the-moment belief or assumption at each stage, not just what's now known in hindsight — the tension of a good storytime often comes specifically from the gap between what the narrator believed then and what the audience, hearing it told after the fact, can already sense is about to go wrong; collapsing that gap by narrating everything with hindsight-informed certainty removes exactly the suspense that gap creates. Never invent a detail, quote, or event that didn't happen to heighten drama — if a real detail is genuinely unclear or forgotten, say so honestly in the script rather than fabricating a specific one, since a storytime audience's trust is the entire product and a single caught fabrication collapses it retroactively across the whole channel. Handle any sensitive detail specified with the exact level of specificity or vagueness requested — do not add identifying detail beyond what's given, and do not sensationalize a genuinely difficult moment past what the storyteller is actually comfortable sharing.

OUTPUT FORMAT
1. One line stating the dramatic question the whole story is built to answer.
2. The full script broken into scenes with approximate timestamps, written in first person, spoken lines.
3. A note on where the in-the-moment belief versus the hindsight reveal are deliberately kept separate, and where.
4. Confirmation that no invented detail was added beyond what was provided as true.`,
    variables: [
      {
        name: 'true_events',
        description:
          'What actually happened, in chronological order, as completely as the storyteller can recall.',
        example:
          "Moved in with a roommate found online, seemed normal for two months, then discovered they'd been forging the storyteller's signature on a shared lease addendum to add a third undisclosed occupant",
        required: true,
      },
      {
        name: 'narrative_shift',
        description:
          'What the storyteller believed at the start versus what they understood by the end.',
        example:
          "Believed being a 'chill, trusting' roommate was a virtue; ended up realizing that specific trust was what let two months of forged paperwork go unnoticed",
        required: true,
      },
      {
        name: 'tone',
        description: 'The emotional register the story should be told in.',
        example:
          'Mostly matter-of-fact and a little self-deprecating about being naive, not outraged or played for pure shock',
        required: true,
      },
      {
        name: 'target_length',
        description: 'Intended runtime.',
        example: '13-16 minutes',
        required: false,
      },
      {
        name: 'sensitive_details',
        description: 'Anything that needs to stay vague, unnamed, or handled carefully.',
        example:
          "Don't name the roommate's actual first name or city — refer to them only as 'the roommate'",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'storytime-script',
      'narrative-structure',
      'personal-story',
      'script-writing',
      'youtube-script',
    ],
    whyItWorks:
      'Naming the actual dramatic question before writing a single scene is what separates a shaped narrative from a chronological report of the same true events: "what happened" is a sequence of facts with no inherent reason to keep watching once the facts are known, while a specific question like "was trusting this person a mistake, and when did it become one" gives every scene a job — build the question or complicate it — that a purely chronological retelling has no equivalent mechanism for, even when both versions describe the identical real events. Deliberately preserving the gap between the storyteller\'s in-the-moment belief and their current hindsight knowledge targets the single most common flattening effect that happens when a true story gets narrated by someone who already knows how it ends: without a specific instruction to hold that gap open, the retelling naturally collapses into hindsight-informed certainty at every stage — "of course I should have seen the forged signature coming" — which removes exactly the tension a listener gets from knowing more than the past version of the narrator did at each point, the mechanism most true-crime and storytime narration actually runs on. The rule against fabricating detail to heighten drama is not merely an ethics instruction bolted onto a creative task — it\'s protecting the actual asset a storytime channel depends on, since the format\'s entire appeal rests on the audience\'s belief that this really happened, and a single caught invented detail doesn\'t just damage that one video, it retroactively makes every other story from the same channel suspect once an audience has reason to wonder what else was embellished. The explicit instruction to say "this part is unclear" rather than confidently fabricating a forgotten specific matters for the identical reason from a different angle: a script with a small, honestly-flagged gap reads as more credible, not less, than one with suspiciously perfect recall of a years-old conversation\'s exact wording, because real memory doesn\'t work that way and audiences who consume a lot of this format have learned to distrust the too-perfect version.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'youtube-channel-trailer-script',
    category: 'youtube',
    title: 'Write a channel trailer that sells the channel, not one specific video',
    description:
      "Scripts a 30-60 second trailer aimed specifically at non-subscribed visitors landing on the channel page, built around what makes the whole channel worth returning to — a distinct job from any single video's hook.",
    promptText: `You are writing a YouTube channel trailer script — the short video YouTube shows specifically to non-subscribed visitors who land on the channel's page, not to existing subscribers, who see a different featured video or nothing at all. This is a different job than any single video's hook: you are selling the reason to subscribe to everything this channel does, not the payoff of one topic.

CHANNEL NICHE AND WHAT IT ACTUALLY COVERS
{{channel_niche}}

UPLOAD FREQUENCY AND FORMAT MIX
{{upload_pattern}}

WHAT MAKES THIS CHANNEL DIFFERENT
{{differentiator}}

BEST-PERFORMING PAST VIDEO TOPICS
{{proof_points}}

TARGET LENGTH
{{target_length}}

TRAILER RULES
Open by naming the exact problem or interest this channel serves, in language the actual target viewer would use to describe wanting it — not the creator's own internal description of their mission — since a visitor lands on this page from a link, a search, or a suggested video and has a few seconds to decide if this channel is "for people like them" before clicking away. State the differentiator explicitly and specifically — what this channel does that a visitor can't get from the five other channels covering the same broad topic — rather than a generic claim like "in-depth and honest content," which every channel in every niche claims identically and which therefore differentiates nothing. Reference the upload frequency and format mix honestly, since a visitor deciding whether to subscribe is partly deciding whether this channel will actually show up in their feed with any regularity — an overpromise here ("new video every single day!") that the channel doesn't sustain creates a subscriber who mutes notifications within a month, which is a worse long-term outcome than an honest, more modest claim a visitor can actually trust. Use the best-performing past topics as concrete proof of what subscribing actually gets someone, named specifically enough that a visitor who liked one of them recognizes it, rather than a vague gesture at "videos like these." End with a direct, singular call to action — subscribe — and do not dilute it by also asking for a like, a comment, and a bell-icon tap in the same 10 seconds; a trailer asking for four things gets less of any one of them than a trailer asking clearly for one.

OUTPUT FORMAT
1. The full trailer script as spoken lines, timestamped in rough sections (open, differentiator, proof, CTA).
2. One line confirming the differentiator claim is specific to this channel and not a generic claim any competing channel could make word for word.
3. The single CTA line, isolated and clearly marked as the only ask in the script.`,
    variables: [
      {
        name: 'channel_niche',
        description:
          'What the channel is actually about, described the way a real visitor would look for it.',
        example:
          "Breaking down real personal-finance decisions (should I pay off debt or invest, is this apartment actually affordable) using the viewer's own numbers, not generic advice",
        required: true,
      },
      {
        name: 'upload_pattern',
        description: 'How often and what format the channel actually publishes.',
        example:
          'One 12-15 minute deep-dive every Tuesday, plus 2-3 Shorts per week pulled from that video',
        required: true,
      },
      {
        name: 'differentiator',
        description:
          'What specifically sets this channel apart from others covering the same broad topic.',
        example:
          'Every video works through a real anonymized viewer-submitted budget on screen, with actual numbers, instead of talking in hypotheticals',
        required: true,
      },
      {
        name: 'proof_points',
        description:
          'Specific past video topics that performed well and represent the channel well.',
        example:
          '"I Went Through a Viewer\'s Budget Who Makes $52K and Feels Broke" and "The Real Math on Renting vs Buying in 2026" — both channel highs for retention',
        required: true,
      },
      {
        name: 'target_length',
        description: 'Intended trailer runtime.',
        example: '45 seconds',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'channel-trailer',
      'subscriber-conversion',
      'channel-branding',
      'script-writing',
      'channel-strategy',
    ],
    whyItWorks:
      "Treating the trailer as a distinct job from a video hook matters because YouTube actually serves this specific piece of content only to non-subscribed visitors on the channel page — a completely different audience state than someone already mid-video, meaning the trailer's entire audience by definition doesn't yet know if they want anything from this channel at all, which is a colder, higher-uncertainty starting point than any single video's viewer, who at least clicked because one specific topic already interested them. Requiring the differentiator to be stated specifically enough that a competing channel in the same niche couldn't say the identical sentence targets the most common failure of trailer scripts: \"in-depth, honest, no-fluff content\" is claimed by enough channels in enough niches that it has become functionally meaningless as a differentiator, and a visitor deciding whether to subscribe has no way to use an interchangeable claim to distinguish this channel from the four others they might also be evaluating in the same sitting. Requiring an honest statement of upload frequency rather than an aspirational overclaim addresses a subscriber-retention cost that's easy to miss at the trailer stage: a subscriber who joins expecting daily uploads and gets weekly ones doesn't just feel mildly misled, they mute notifications or unsubscribe within the first few weeks, meaning an overpromising trailer actively converts curious visitors into subscribers who will functionally never see another video from the channel again, which is arguably worse than never converting them in the first place, since it also cost a subscriber-count number the channel now can't easily recover. Using specific named proof-point videos rather than a vague gesture at \"videos like these\" gives a visitor something concrete to mentally check against content they may have already half-seen suggested elsewhere, converting an abstract promise into a checkable claim. The single-CTA rule is grounded in a basic split-attention cost: a viewer given four simultaneous asks in a ten-second span has to parse and choose among them, and choice friction at the exact moment of highest intent — right after being convincingly pitched — measurably reduces the completion rate of whichever single action actually matters most for channel growth, which is a new subscription, not a like or a bell tap.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-23' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'youtube-outro-subscribe-cta-script',
    category: 'youtube',
    title: 'Write an outro that earns a subscribe instead of reciting one',
    description:
      'Scripts the final 20-30 seconds around a specific, earned reason to subscribe drawn from what this exact video delivered, rather than a generic "smash that subscribe button" line disconnected from the content that just played.',
    promptText: `You are writing the closing 20-30 seconds of a YouTube video — the outro segment where the call to action to subscribe, watch another video, or take some other next step happens. A generic "don't forget to like and subscribe" line disconnected from what the video just delivered gets tuned out; you are writing an outro that earns the ask by connecting it directly to the specific value this video just provided.

VIDEO TOPIC AND MAIN TAKEAWAY
{{video_summary}}

WHAT SUBSCRIBING ACTUALLY GETS THE VIEWER
{{subscribe_value_prop}}

NEXT VIDEO OR PLAYLIST TO SUGGEST
{{next_video_suggestion}}

CHANNEL VOICE
{{channel_voice}}

OUTRO RULES
Connect the subscribe ask directly to what this specific video delivered, not to the channel in the abstract — "if that surprised you, every video here tests a common assumption like this one the same way" is a claim earned by the video that just played; "subscribe for more content like this" is not, since it doesn't actually say what "this" is. State the concrete, specific thing a subscriber gets in the future, not a vague promise of "more great content" — a specific claim about upload frequency, format, or topic focus that a viewer can hold the channel accountable to is more persuasive than an unfalsifiable one, and it's also more honest. Choose exactly one next action to prioritize — watch a specific next video, or subscribe, or check the description for a resource — rather than stacking three asks with equal weight; if a next-video suggestion is provided, make the connection between this video and that one explicit ("if you're wondering whether the same thing applies to X, that's exactly what the next video tests") rather than a disconnected "check out this other video" tacked on after the real ending. Keep the outro proportional to its actual value — a 45-second outro on a 6-minute video eats a meaningful share of the runtime for a segment most viewers are already partly checked out for; match outro length to video length, and end decisively rather than trailing off with a slow fade that gives the impression the video hasn't actually finished. Do not repeat the exact same outro verbatim across every video if the channel does this often — even the specific detail should feel drawn from this video, not a template with the topic swapped in.

OUTPUT FORMAT
1. The outro script as spoken lines, timed to the target proportion of the video's length.
2. One line stating exactly which single action is being prioritized as the primary ask.
3. If a next video is suggested, the specific bridge line connecting this video's content to that one.`,
    variables: [
      {
        name: 'video_summary',
        description: 'What the video covered and its core takeaway.',
        example:
          'A video showing that a popular productivity app\'s "focus score" doesn\'t actually correlate with real task completion in a 30-day self-tracked test',
        required: true,
      },
      {
        name: 'subscribe_value_prop',
        description:
          'What a new subscriber will actually get from this channel going forward.',
        example:
          'A new video every other week specifically testing whether a popular productivity claim or app feature actually holds up under real, tracked use',
        required: true,
      },
      {
        name: 'next_video_suggestion',
        description: 'What video or playlist to point toward next, if any.',
        example:
          'A related video testing whether "time blocking" actually reduces task-switching, using the same tracking method',
        required: false,
      },
      {
        name: 'channel_voice',
        description: "The channel's tone.",
        example: 'Skeptical but not cynical, data-first, avoids hype language',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'youtube-outro',
      'subscriber-conversion',
      'call-to-action',
      'script-writing',
      'audience-retention',
    ],
    whyItWorks:
      'Grounding the subscribe ask in what this specific video just delivered, rather than an abstract appeal to the channel\'s general quality, works because the viewer\'s actual reason for trusting the channel at this exact moment is the video they just watched, not a claim about the channel\'s identity in general — an outro that draws a direct, specific line from "this video tested a popular claim and found it didn\'t hold up" to "every video here does exactly that" is making a claim the viewer can immediately verify against their own just-completed experience, while "subscribe for more content like this" asks for trust in an unstated, undefined "this" that the viewer has to supply the meaning of themselves. Requiring a concrete, checkable claim about future value — a real upload cadence, a real format description — rather than a vague promise targets the same honesty-as-persuasion mechanism the channel trailer prompt relies on: an unfalsifiable promise is easy to make and easy to tune out because audiences have heard the identical unfalsifiable promise from every other channel, while a specific claim is both more credible in the moment and something the channel is accountable to sustaining. Prioritizing exactly one action instead of stacking subscribe, like, comment, and next-video into equal asks addresses simple attention economics at a point in the video where viewer attention is already declining — retention graphs show attention dropping through most videos\' final segment even on videos that otherwise perform well, so an outro competing for that already-scarce remaining attention with multiple simultaneous requests will convert fewer of any single one than an outro making one clear ask. Matching outro length proportionally to video length, and explicitly warning against a slow fade-out, targets a real cost that\'s easy to overlook: an outro that runs disproportionately long relative to a short video is asking already-departing attention to sit through a segment providing diminishing new value, and a slow, meandering close signals to a viewer that nothing else important is coming, which is itself often the cue that triggers the click away — a crisp, decisive ending holds slightly more of that departing attention than an ending that visibly winds down before it actually stops.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-25' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'youtube-end-screen-suggested-video-strategy',
    category: 'youtube',
    title: 'Plan which videos an end screen should actually point to, and why',
    description:
      'Chooses end-screen elements based on session-time strategy — what keeps this specific viewer watching this channel next — instead of defaulting to "most recent upload" or a generic subscribe element in every video.',
    promptText: `You are planning the end-screen elements for a YouTube video — which specific videos, playlists, and subscribe prompt to place in the final 5-20 seconds, and why those specific choices over the available alternatives. This is a strategic placement decision, not a script; the goal is maximizing the chance a viewer who just finished this video keeps watching something else from this channel, which is a session-time decision, not a "what's newest" default.

THIS VIDEO'S TOPIC AND LIKELY VIEWER INTENT
{{video_topic}}

CANDIDATE VIDEOS OR PLAYLISTS TO CONSIDER
{{candidate_videos}}

CHANNEL'S TOP-PERFORMING CONTENT
{{top_performing_content}}

END SCREEN LENGTH AVAILABLE
{{available_duration}}

STRATEGY RULES
Prioritize a video that shares this video's actual viewer intent — the specific question or interest that brought someone to click this video in the first place — over a video that's merely topically adjacent or merely the channel's most recent upload; a viewer who watched a video comparing two products is a stronger candidate to watch another comparison than to watch an unrelated tutorial, even if the tutorial is newer or generally higher-performing. Where a candidate video is one of the channel's strongest performers by retention or watch time, weight it more heavily than a similarly relevant but weaker-performing option — an end screen is a recommendation, and recommending a video this channel's own data shows holds attention well compounds the chance this viewer keeps watching versus recommending one the data shows tends to lose people early. Match the number of end-screen elements to the actual available duration and to YouTube's own display limits — up to four elements can display, but a video with under roughly 25 seconds of usable end-screen time may only comfortably support one or two before elements overlap or get cut short; do not propose more elements than will actually render cleanly in the time available. If this video and the top candidate are part of a natural sequence — a follow-up, a "part 2," a direct comparison's counterpart — say so explicitly and prioritize that sequential relationship over a general popularity-based recommendation, since a viewer who was clearly left with an open question by this video is unusually likely to click through to the video that resolves it. Include the subscribe element only where it doesn't crowd out a genuinely higher-conversion video suggestion — a video with strong per-viewer conversion evidence toward watching a specific next video may reasonably use all its element slots on video suggestions rather than splitting attention with a subscribe prompt that has lower marginal value in that specific slot.

OUTPUT FORMAT
1. The recommended end-screen elements in priority order, each with the specific video or playlist and a one-line reason tied to viewer intent or performance data.
2. Confirmation the total element count fits the stated available duration.
3. If a sequential/follow-up relationship exists, one line naming it and why it outranks a purely popularity-based pick.`,
    variables: [
      {
        name: 'video_topic',
        description: "This video's topic and the likely reason someone clicked it.",
        example:
          'A video comparing two mirrorless cameras for wildlife photography specifically — viewers likely arrived comparing autofocus tracking specifically',
        required: true,
      },
      {
        name: 'candidate_videos',
        description: 'Videos or playlists that could plausibly go in the end screen.',
        example:
          'A comparison of two different camera brands for the same use case, a general "best cameras 2026" roundup, and a tutorial on wildlife photography settings unrelated to gear comparison',
        required: true,
      },
      {
        name: 'top_performing_content',
        description:
          "The channel's own data on which candidate videos actually hold attention well.",
        example:
          'The other brand comparison video has 74% average retention; the "best cameras 2026" roundup has 41% retention; the settings tutorial has 58%',
        required: false,
      },
      {
        name: 'available_duration',
        description:
          'How many seconds of usable end-screen time this video actually has.',
        example: '18 seconds',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'end-screen-strategy',
      'session-watch-time',
      'youtube-analytics',
      'content-strategy',
      'viewer-retention',
    ],
    whyItWorks:
      "Prioritizing shared viewer intent over topical adjacency or upload recency reflects what YouTube's own recommendation system is actually optimizing for at the channel level — session watch time, meaning how long a viewer stays engaged with content across multiple videos in one sitting, not just this single video's own metrics — and a viewer whose specific reason for clicking was a head-to-head comparison is a measurably better match for another comparison than for a generally newer or generally popular video that doesn't share that same intent, because intent match is what actually predicts whether the next click happens, not surface-level topic similarity. Weighting a candidate's own retention or watch-time performance into the decision, rather than treating all topically-relevant options as interchangeable, treats an end screen as a real recommendation with real data behind it instead of a slot to fill — a channel's own retention numbers are a direct, specific, first-party signal about which videos actually hold viewers, and ignoring that data in favor of a merely-relevant pick is leaving a channel's best available evidence on the table exactly where it would matter most. The element-count-versus-available-duration rule is a mechanical constraint many end-screen plans ignore: YouTube supports up to four end-screen elements displaying, but they need real screen time to render and be clickable, and a plan that proposes four elements onto a video with 15 seconds of usable end-screen space produces an outcome where elements overlap, get cut off before a viewer can read them, or simply blur together — a technically valid element count on paper that fails in the actual player. Recognizing an explicit sequential relationship — a natural part 2, a direct follow-up resolving a question this video raised — as a distinct, higher-priority category than general popularity matters because a viewer left with an unresolved question by design (per the earlier open-loop principle in scripting) is in an unusually high-intent state specifically for whatever resolves that exact question, a narrower and stronger signal than \"viewers of this video also tend to enjoy that video\" statistics can capture on their own.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'youtube-pinned-comment-engagement-seed',
    category: 'youtube',
    title:
      'Write a pinned comment that seeds real conversation, not just a subscribe reminder',
    description:
      'Drafts a pinned comment specifically engineered to invite a reply-worthy response — a question, a poll, a genuine ask — rather than a restated CTA that adds a comment count without adding any actual conversation.',
    promptText: `You are writing a pinned comment for a YouTube video — the comment that sits at the top of the comment section, visible to nearly every viewer who scrolls into comments at all. A pinned comment that just restates "thanks for watching, subscribe for more" occupies the single most visible spot in the section and does nothing to actually start a conversation; you are writing one specifically engineered to get a reply.

VIDEO TOPIC AND ANY OPEN QUESTION OR DEBATE IT RAISES
{{video_topic_and_debate}}

WHAT KIND OF RESPONSE WOULD BE MOST VALUABLE
{{desired_response_type}}

CHANNEL VOICE
{{channel_voice}}

ANYTHING CONTROVERSIAL OR SENSITIVE TO HANDLE CAREFULLY
{{sensitive_context}}

COMMENT RULES
Ask one specific, answerable question tied directly to a real point of disagreement, uncertainty, or personal variation in the video's content — not a generic "what did you think?" which requires a viewer to do the work of generating their own topic to respond to, versus a specific question that hands them something concrete to react to. Where the video makes a claim viewers might reasonably disagree with or have a different experience of, lean into that specific tension in the pinned comment rather than avoiding it — "curious if this matches what you've seen, or if your results were different" invites a genuine reply in a way "hope you enjoyed this" does not, because it explicitly signals disagreement or a different result is a welcome, expected response, not something to be quiet about. If the desired response type is data — viewers' own numbers, their own experience, a poll-style answer — phrase the question so a one-line reply genuinely counts as a full, satisfying answer, since a comment that requires real effort to answer well gets far fewer replies than one where even a short response feels complete. Keep the comment itself short — two to three sentences at most; a long pinned comment reads as another piece of content to skim past, while a short one gets read in full before a viewer decides whether to reply. If anything about the topic is genuinely sensitive or could produce a hostile pile-on rather than good-faith discussion, either soften the specific framing to invite constructive response over conflict, or recommend against pinning an engagement-bait question on this particular video at all, and say so plainly rather than optimizing for reply-count at the expense of a comment section actually worth having.

OUTPUT FORMAT
1. The pinned comment text, ready to post.
2. One line naming the specific mechanism used to invite a reply (a direct question, an invitation to disagree, a fill-in-the-blank prompt, etc.).
3. If the topic is sensitive enough that engagement-bait framing carries real risk, an explicit flag and a safer alternative, or a recommendation not to prompt this way at all.`,
    variables: [
      {
        name: 'video_topic_and_debate',
        description:
          'What the video covers and any point where viewers might reasonably disagree or vary.',
        example:
          "A video arguing a 4-day work week increased this specific team's output — some viewers will have tried it and had it fail, others will be skeptical it applies to their industry",
        required: true,
      },
      {
        name: 'desired_response_type',
        description: 'What kind of comment would actually be valuable to get.',
        example:
          "Viewers sharing whether they've tried a compressed work week themselves and what happened, even briefly",
        required: true,
      },
      {
        name: 'channel_voice',
        description: "The channel's usual tone.",
        example: 'Casual, curious, genuinely interested in being proven wrong',
        required: true,
      },
      {
        name: 'sensitive_context',
        description:
          'Anything about the topic that could invite hostility rather than good-faith discussion.',
        example:
          'Some viewers have strong feelings about remote-work policy generally — avoid framing that reads as taking a side on that broader debate',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'pinned-comment',
      'audience-engagement',
      'comment-strategy',
      'community-building',
      'youtube-algorithm',
    ],
    whyItWorks:
      'Asking one specific, answerable question rather than a generic invitation to comment lowers the actual cognitive cost of replying, which is the real bottleneck most pinned comments fail to address: a viewer willing to leave a reply but facing an open-ended "what did you think?" has to first invent a topic worth commenting on before they can respond at all, and most scrolling viewers won\'t do that extra work, while a specific question — did your results differ, have you tried this yourself — hands them a ready-made frame that a one-line reply can genuinely satisfy. Deliberately inviting disagreement or a different personal result, rather than only fishing for agreement, works because comment sections generate more total activity from a mix of confirming and dissenting replies than from an echo chamber of agreement — comment count and reply-to-reply conversation are both engagement signals a video benefits from, and a pinned comment that implicitly signals only positive agreement is welcome discourages exactly the dissenting replies that tend to generate the longest sub-threads, since other viewers often reply to a dissenting comment more than to a purely agreeing one. Keeping the comment itself short serves the same first-second-decision logic that governs a thumbnail or a hook: a pinned comment sits at the very top of a section a viewer is scrolling through quickly, and a long comment functions as another piece of content competing for the same skim-and-move-on attention a viewer is applying to everything below the video itself, while a short, immediately parseable question gets read in full before the scroll continues. Explicitly weighing whether the topic could produce a hostile pile-on rather than good-faith discussion, and being willing to recommend against an engagement-bait framing altogether, matters because reply-count is not costless — a pinned comment that successfully generates hundreds of replies through genuine hostility rather than substantive discussion is optimizing the wrong outcome, turning the single most visible spot in the comment section into the seed of the exact kind of comment section a channel doesn\'t actually want.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-21' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'youtube-community-post-reengagement',
    category: 'youtube',
    title:
      'Write a Community tab post that actually re-engages subscribers before an upload',
    description:
      'Drafts a pre-upload or between-upload Community post around a genuine reason to interact — a real choice, a real question, a specific teaser detail — rather than a generic "new video coming soon" announcement most subscribers scroll past.',
    promptText: `You are writing a YouTube Community tab post — the feed post format separate from an actual video upload, shown to subscribers who have Community activity enabled in their feed. A generic "new video dropping this week!" post gets scrolled past with no reason to stop; you are writing a post with a specific, concrete reason for a subscriber to actually interact with it.

PURPOSE OF THIS POST
{{post_purpose}}

CONTEXT (UPCOMING VIDEO, RECENT VIDEO, OR STANDALONE)
{{context}}

POST FORMAT AVAILABLE
{{post_format}}

CHANNEL VOICE
{{channel_voice}}

ANYTHING TO AVOID GIVING AWAY
{{spoiler_constraints}}

POST RULES
If the post format is a poll, the options must represent a genuine choice the channel would actually act on or that meaningfully splits opinion — not a fake poll where every option obviously leads to the same answer, since subscribers can tell a rhetorical poll from a real one, and a poll that isn't genuinely undecided reads as engagement-bait rather than a real question. If teasing an upcoming video, give exactly one concrete, specific detail — a number, a surprising fact, a decision point — rather than a vague tease with zero content ("something big is coming"), since a detail-free tease gives a subscriber nothing to react to or discuss while a specific one does, but respect anything flagged as needing to stay unrevealed. If the post follows a recent upload, reference something specific from the comments or from the video's actual content rather than a generic "thanks for watching" — subscribers who already watched and commented want to feel the post is responding to what actually happened, not a template that would fit any video from any channel. Match the ask to what a subscriber can do in a few seconds directly inside the post — vote, answer a one-word question, react to an image — since a Community post asking for a long-form reply competes with the much lower-effort ask a poll or emoji-reaction option already gives people, and most of the value of this format comes from its low friction, not from trying to extract essay-length engagement. Post with a clear reason tied to something actually happening — a real decision the channel is making, real behind-the-scenes context, a real follow-up to a specific comment thread — rather than posting purely to maintain a "stay active on Community" content-calendar quota with nothing to actually say.

OUTPUT FORMAT
1. The post text, plus poll options or image/text-post structure matching the specified format.
2. One line confirming the ask matches something answerable in a few seconds.
3. If it's a poll, confirmation the options represent a genuinely open question, not a rhetorical one.`,
    variables: [
      {
        name: 'post_purpose',
        description: 'What this post is actually trying to accomplish.',
        example:
          "Get subscriber input on which of two thumbnail directions to actually use for next week's upload",
        required: true,
      },
      {
        name: 'context',
        description: 'What this post relates to.',
        example:
          'Upcoming video comparing two air fryer brands — thumbnail decision needs to be made in the next 2 days',
        required: true,
      },
      {
        name: 'post_format',
        description: 'What format the post will use.',
        example: 'Poll with two image options',
        required: true,
      },
      {
        name: 'channel_voice',
        description: "The channel's usual tone.",
        example: 'Casual, a little self-aware about asking for help on something small',
        required: true,
      },
      {
        name: 'spoiler_constraints',
        description: 'Anything about the upcoming content that must not be revealed yet.',
        example:
          "Don't reveal which brand actually wins the comparison — the thumbnails themselves don't give it away either",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'community-tab',
      'subscriber-engagement',
      'youtube-algorithm',
      'audience-interaction',
      'community-building',
    ],
    whyItWorks:
      "Requiring a poll to represent a genuinely open question the channel would actually act on targets a credibility problem specific to this format: the Community tab's poll option is structurally identical whether the choice is real or decorative, so subscribers judge authenticity purely by content, and a poll where every option obviously funnels to the same practical outcome reads immediately as manufactured engagement rather than an actual question, which trains regular viewers to stop bothering to vote on this channel's polls specifically. Requiring exactly one concrete, specific teaser detail rather than a content-free tease addresses the same problem the cold-open hook prompt addresses in a different format: a detail-free \"something big is coming\" gives a subscriber literally nothing to form an opinion about or react to, whereas a single specific fact — a number, a decision point — gives them something concrete enough to comment on, guess about, or disagree with, which is what actually produces replies instead of passive scrolls-past. Tying a post-upload Community post to something specific from that video's own comments or content, rather than a generic thanks-for-watching, matters because subscribers who already watched and commented are being asked to re-engage with something they've already spent attention on, and a response that shows the channel actually noticed what they said is a meaningfully different experience than a templated acknowledgment that would fit identically under any video from any channel — specificity is what signals it wasn't automated. Matching the ask to what's answerable in a few seconds directly inside the format — a vote, a one-word reply, an emoji reaction — reflects the actual value proposition of the Community tab relative to the comment section on a video: its lower-friction, glanceable nature is the format's whole advantage, and a post that asks for a genuinely long, effortful reply is fighting against that advantage rather than using it, competing with the video's own comment section for the exact kind of engagement that section is already better suited to collect.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-22' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Gemini (Gemini 3 Pro).',
      },
    ],
  },
  {
    slug: 'youtube-competitor-content-gap-analysis',
    category: 'youtube',
    title:
      "Find real video ideas by mapping what competitor channels haven't covered well",
    description:
      'Structures a competitor content audit around genuine coverage gaps and quality gaps in a niche, distinguishing "nobody\'s made this video" from "everyone\'s made this video badly" — two different opportunities that need different follow-up.',
    promptText: `You are analyzing a set of competitor channels in the same niche to find real video idea opportunities — not a generic "make more content" suggestion, but specific gaps in what's already been covered, distinguishing between a topic nobody has covered and a topic many channels have covered poorly, since those are different opportunities requiring different videos.

NICHE AND CHANNEL'S OWN POSITIONING
{{niche_and_positioning}}

COMPETITOR CHANNELS AND THEIR RECENT/TOP CONTENT
{{competitor_content}}

OWN CHANNEL'S EXISTING VIDEO LIBRARY (TOPICS ALREADY COVERED)
{{own_existing_topics}}

AUDIENCE QUESTIONS OR COMPLAINTS OBSERVED
{{audience_signals}}

ANALYSIS RULES
Sort every identified opportunity into one of two categories and be explicit about which: a coverage gap, meaning a real, evidently-searched-for question or subtopic in this niche that none of the listed competitors have made a dedicated video on, versus a quality gap, meaning multiple competitors have covered the topic but done so shallowly, inaccurately, or in a way audience comments indicate frustration with — these require different responses; a coverage gap is an opportunity to be first, a quality gap is an opportunity to be visibly better on a topic search demand for is already proven. For any quality gap, cite the specific, concrete shortfall in the existing coverage — vague, dated information, a common complaint repeated across comment sections, a demonstrably wrong claim — rather than a vague "could be done better," since a real recommendation depends on describing exactly what better means here, not just asserting that it's possible. Do not recommend a topic already covered well and recently by the channel's own existing library, even if a competitor also covers it — a real gap has to be a gap for this specific channel, not just relative to competitors while ignoring the channel's own back catalog. Weight opportunities by evidence of real audience demand — a comment repeated across multiple competitor videos asking the same unanswered question, a competitor video with unusually high views relative to that channel's average signaling above-average interest in the specific topic — over a topic that simply seems interesting with no signal anyone is actually looking for it. Where the channel's stated positioning gives it a specific, credible angle competitors don't have — different expertise, access, format, audience trust — prioritize opportunities that specific angle would let this channel address more credibly than the competitors already covering it, rather than suggesting the channel simply make the same kind of video already out there.

OUTPUT FORMAT
A table: Opportunity | Coverage gap or quality gap | Evidence of demand | What specifically is missing or wrong in existing coverage | Why this channel's angle fits it. Follow with a ranked shortlist of the top 3-5 by strength of evidence, not by how interesting the topic sounds in the abstract.`,
    variables: [
      {
        name: 'niche_and_positioning',
        description:
          "The niche and what makes this specific channel's angle distinct within it.",
        example:
          "Home coffee brewing niche; this channel's angle is rigorous side-by-side taste testing with blind panels, unlike most channels' single-reviewer opinion format",
        required: true,
      },
      {
        name: 'competitor_content',
        description: 'What competitor channels have recently covered or are known for.',
        example:
          "Channel A covers gear reviews individually with no comparison testing; Channel B covers brewing techniques but hasn't touched water chemistry; Channel C's video on water hardness has 40+ comments saying the explanation was confusing",
        required: true,
      },
      {
        name: 'own_existing_topics',
        description:
          'What this channel has already made videos about, to avoid recommending a repeat.',
        example:
          'Already has videos on grind size, brew ratios, and a general gear roundup — nothing yet on water chemistry or filtered vs. tap water',
        required: true,
      },
      {
        name: 'audience_signals',
        description:
          'Actual comments, questions, or complaints observed across the niche.',
        example:
          "Multiple comments across two different competitor videos asking 'does the type of water actually matter or is that overkill' with no clear answer given in either",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: [
      'content-strategy',
      'competitor-analysis',
      'video-ideation',
      'niche-research',
      'content-gap-analysis',
    ],
    whyItWorks:
      "Splitting opportunities into coverage gaps and quality gaps targets a real strategic difference a single flat list of \"video ideas\" collapses: a genuine coverage gap — a topic nobody's covered — has an unknown, unproven demand and the risk that low search interest is exactly why nobody's covered it, while a quality gap has proven demand, evidenced by the fact that multiple channels already made videos on it and got real views and comments, and the actual opportunity there is execution quality, not topic novelty, which means the resulting video brief needs to name specifically what to do differently rather than simply what to cover. Requiring the specific shortfall in existing quality-gap coverage to be named concretely — a factual error, a repeated point of comment-section confusion, dated information — rather than accepting a vague \"could be better\" forces the model to do real comparative diagnostic work instead of pattern-matching \"this topic exists elsewhere, therefore there's room to also make one,\" which is a much weaker and less actionable claim. Checking proposed opportunities against the channel's own existing library, not just against competitors, catches a specific blind spot in most competitor-only analyses: a topic can look like a gap relative to three competitor channels while the channel doing the analysis already made a strong video on exactly that subject eighteen months ago, and recommending it again isn't a gap at all from this channel's actual perspective, even though it would appear as one if the analysis only ever looked outward. Weighting by real evidence of demand — a question repeated across multiple comment sections, a competitor video with anomalously high views for that channel — rather than by how interesting a topic merely sounds, is what keeps the output grounded in what audiences have actually shown they want rather than in what a model, with no real search-volume access, might otherwise guess sounds compelling. Prioritizing opportunities that specifically play to the channel's stated differentiated angle, rather than any generic gap regardless of fit, matters because the actual goal isn't finding a topic nobody's covered — it's finding a topic this specific channel, with its specific access, expertise, or format, is positioned to cover more credibly than the channels already sitting in that space, which is a categorically stronger opportunity than an unclaimed topic this channel has no particular edge on either.",
    verifiedAgainst: [
      { tool: 'Perplexity', version: 'Perplexity Pro (Sonar)', date: '2026-07-27' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Perplexity (Sonar) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'youtube-series-content-calendar-batch',
    category: 'youtube',
    title: 'Plan a video series with each episode earning its place in the sequence',
    description:
      "Batches out a multi-episode series where each entry's topic is justified by what the previous one couldn't cover and what it sets up for the next, instead of a loosely-related content calendar that happens to share a theme.",
    promptText: `You are planning a multi-episode YouTube series — a set of videos released on a schedule that are meant to build on each other, not just a batch of loosely related standalone topics that happen to share a theme. Each episode's place in the sequence has to be justified, not just its individual topic.

SERIES THEME AND GOAL
{{series_theme}}

NUMBER OF EPISODES AND CADENCE
{{episode_count_and_cadence}}

AUDIENCE ENTRY POINT
{{audience_entry_point}}

CONSTRAINTS OR MUST-INCLUDE TOPICS
{{constraints}}

PLANNING RULES
For each episode, state what it assumes the viewer already knows from the previous episode and what new thing it adds — if an episode doesn't genuinely depend on anything established before it, question whether it needs to be in this specific sequence position at all, versus being a standalone video that happens to share the series theme. Sequence episodes so that watching in order builds toward something a single episode alone couldn't deliver — a payoff, a completed project, a resolved question — and identify explicitly what that cumulative payoff is, since a series without one is really just several unrelated videos wearing a shared title card. Consider the audience entry point specified: if most new viewers will realistically discover episode 3 or 4 through search or recommendation before ever seeing episode 1, each episode needs enough self-contained context to not completely lose a viewer who starts there, even while still rewarding someone who watched from the start — full dependency on watching in strict order is a real risk for a series relying on YouTube's own discovery, which routes viewers to whichever episode matches their specific search, not necessarily the first one. Distribute the must-include constraint topics across the sequence at points where they genuinely fit the episode's actual content, rather than clustering all of them into one overstuffed episode or bolting them onto whichever episode has room left. Flag any episode that's weaker than the others — thinner content, lower expected interest — and place it deliberately, not at the very start where it would set a weak first impression, and not immediately after the strongest episode where the contrast would be most obvious.

OUTPUT FORMAT
A table: Episode # | Working title | What it assumes from before | What new thing it adds | How self-contained it is for a cold viewer arriving here first. Follow with one paragraph stating the series' cumulative payoff explicitly, and one line flagging the weakest episode and where it's placed and why.`,
    variables: [
      {
        name: 'series_theme',
        description: 'What the series is about and its overall goal.',
        example:
          'A series following one apartment renovation from empty room to finished, on a real budget, documenting real decisions and real mistakes',
        required: true,
      },
      {
        name: 'episode_count_and_cadence',
        description: 'How many episodes and how often they release.',
        example: '6 episodes, one every two weeks',
        required: true,
      },
      {
        name: 'audience_entry_point',
        description:
          'How realistically most viewers will actually discover episodes in this series.',
        example:
          'Likely discovery is scattered — a viewer searching "small bathroom renovation on a budget" might land directly on episode 4, not episode 1',
        required: true,
      },
      {
        name: 'constraints',
        description:
          'Anything that must be covered somewhere in the series, or hard limits on scope.',
        example:
          "Must include a dedicated budget-tracking episode and a 'what I'd do differently' retrospective; total series can't run longer than 6 episodes",
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'content-calendar',
      'video-series',
      'content-strategy',
      'series-planning',
      'youtube-discovery',
    ],
    whyItWorks:
      "Requiring each episode to state what it assumes from the previous one and what new thing it adds is the mechanism that actually distinguishes a real series from a themed batch: an episode that could run in any order, or be dropped entirely, without changing what any other episode needs to explain isn't structurally part of a sequence at all, it's a standalone video that happens to share a title card, and this test forces that distinction to be checked explicitly rather than assumed from the shared branding. Requiring an explicit statement of the series' cumulative payoff — the thing only achievable by watching the arc, not any single episode — targets the same gap from the opposite direction: without naming what the full sequence delivers that no individual episode does, there's no actual reason for a viewer to commit to a multi-episode arc instead of just watching whichever single entry interests them most and skipping the rest. The self-containment requirement for cold entry points reflects a real, specific mechanic of how YouTube's discovery actually works for a series: search and suggested-video placement route a new viewer to whichever specific episode matches their query or recommendation context, not to episode one by convention, so a series overly dependent on strict-order viewing will actively lose viewers who land on episode 4 confused and unequipped, when a small amount of self-contained context in that episode could have both served that cold viewer and still rewarded the viewer who's followed along from the start. Distributing must-include constraint topics to where they organically fit, rather than letting them cluster into a single overloaded episode, prevents a specific and common planning failure: constraints handed down as a checklist tend to get satisfied by cramming them wherever there's room, producing one bloated, unfocused episode surrounded by others that feel comparatively thin, when spreading the same content across natural fits keeps every episode's pacing and focus intact. Deliberately placing the weakest episode away from both the opening slot and right after the strongest entry addresses a sequencing risk specific to multi-episode content: a weak first impression can cost a viewer's commitment to the whole series before it's earned, and a weak episode immediately following the strongest one creates the sharpest possible contrast, making the dip in quality maximally obvious instead of comparatively minor.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-26' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'youtube-product-review-disclosure-script',
    category: 'youtube',
    title:
      'Write a gifted or sponsored product review that stays honest and properly disclosed',
    description:
      'Scripts a full product-review video that separates genuine assessment from the terms of how the product was obtained, and states the required disclosure clearly up front — instead of a review that reads as an ad because the terms of receipt shaped every claim in it.',
    promptText: `You are writing a full product review script for a product the creator received for free, at a discount, or as a paid partnership. The review has to be genuinely useful and honest, with the terms of how the product was obtained disclosed clearly and separated from the actual assessment — not folded quietly into praise that reads more like sponsored copy than an independent opinion.

PRODUCT AND HOW IT WAS OBTAINED
{{product_and_terms}}

GENUINE TESTING RESULTS, INCLUDING FLAWS
{{testing_results}}

DISCLOSURE REQUIREMENT
{{disclosure_requirement}}

ANY CONTRACTUAL CONTENT REQUIREMENTS FROM THE BRAND
{{brand_requirements}}

CHANNEL VOICE
{{channel_voice}}

SCRIPT RULES
State the disclosure — gifted, discounted, or paid partnership, whichever actually applies — clearly and early, in plain spoken language, not only as a small on-screen tag easy to miss; this is a legal and platform requirement, not a stylistic option the review's tone can soften or bury. Include every real flaw or limitation found in testing, even if a brand requirement exists to mention specific positive features — a contractual obligation to mention a feature is not the same as an obligation to omit a real problem, and a review that mentions every required positive point while silently dropping a genuine flaw found in testing has crossed from sponsored emphasis into a misleading review, which is a different and worse thing. Where a brand requirement asks for something a genuine test doesn't actually support — say, describing a feature as "revolutionary" when testing found it merely adequate — flag the conflict explicitly rather than complying with the stronger language or quietly writing around the problem; state honestly what testing actually showed and let a phrase like "revolutionary" only appear if it's a defensible description of the real result. Keep the disclosure and the actual assessment structurally distinct in the script — the disclosure states how the product was obtained and what obligations that created, the assessment states what testing found — so a viewer can tell which parts are procedural fact and which are the creator's actual opinion, rather than blending them into a single continuous stream where the distinction disappears. Where testing results are mixed, structure the conclusion around the actual mixed result — a genuine "good for X, not for Y" — instead of forcing a falsely uniform positive or negative verdict that flattens real nuance the testing surfaced.

OUTPUT FORMAT
1. The disclosure statement, exact required wording included, placed at the point in the script it needs to appear.
2. The full review script covering genuine testing results, both positive and negative, as spoken lines.
3. A closing verdict reflecting the real mixed or clear result from testing, not a flattened one.
4. A flagged list of any brand requirement that conflicted with a genuine testing finding, and how it was resolved honestly.`,
    variables: [
      {
        name: 'product_and_terms',
        description: 'The product and exactly how it was obtained.',
        example:
          'A robot vacuum sent free by the manufacturer, no payment made, no script approval required by the brand',
        required: true,
      },
      {
        name: 'testing_results',
        description: 'What real testing actually found, including anything negative.',
        example:
          'Navigation is genuinely excellent on hard floors and handles pet hair well; it repeatedly gets stuck on a specific type of low-pile rug fringe and the companion app crashed twice during setup',
        required: true,
      },
      {
        name: 'disclosure_requirement',
        description: 'What disclosure is legally or contractually required.',
        example:
          'FTC-required disclosure for a gifted product, plus YouTube\'s "includes paid promotion" tag is not required since no payment was made, but a verbal "this was sent to me for free" disclosure is required',
        required: true,
      },
      {
        name: 'brand_requirements',
        description:
          'Anything the brand contractually requires be mentioned, if this is a paid arrangement.',
        example:
          'None — this is an unpaid gifted unit with no content requirements from the manufacturer',
        required: false,
      },
      {
        name: 'channel_voice',
        description: "The channel's usual review tone.",
        example:
          'Direct, mentions price-to-performance explicitly, comfortable saying a product is mediocre',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'product-review',
      'ftc-disclosure',
      'sponsored-content',
      'review-script',
      'creator-transparency',
    ],
    whyItWorks:
      "Requiring the disclosure in clear spoken language, not only a small on-screen tag, targets a specific and well-documented enforcement gap: FTC endorsement guidance is explicit that a disclosure has to be clear and conspicuous — easily noticed and understood by the audience taking in the content the way they normally would — and a disclosure that exists only as brief on-screen text a viewer could easily miss while listening rather than reading does not reliably meet that standard, which is a materially different and more serious failure than an audience simply finding the review less persuasive. Separating brand-required positive mentions from the obligation to also report genuine flaws directly targets the actual mechanism by which a review quietly becomes an ad without ever using ad language: a contractual requirement to mention specific features is compatible with an honest review that also states real problems, and it's specifically the silent omission of a genuine flaw — not the required positive mention itself — that converts an honestly-disclosed sponsored review into a misleading one, so the rule isolates exactly the failure to guard against rather than treating any brand involvement as inherently compromising. Flagging language conflicts explicitly — a brand wanting \"revolutionary,\" testing showing merely adequate — rather than either complying or quietly softening the language creates a checkable record of exactly where commercial pressure and genuine findings diverged, which protects the creator's credibility in a durable way: an audience that later discovers a specific inflated claim didn't match real testing loses trust not just in that one review but retroactively in every review the channel has published, since the entire format depends on an assumption of genuine independent assessment that a single caught instance of language overriding evidence can collapse. Keeping the disclosure and the assessment structurally distinct in the script, rather than blended into one continuous stream, gives a viewer an actual way to parse which parts of what they're hearing are procedural fact about how the review came to exist and which parts are the creator's real opinion — a distinction that matters most exactly in a paid or gifted context, where the audience's default skepticism is highest and the clearest possible separation is what actually earns continued trust rather than eroding it further.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'youtube-qna-response-video-script',
    category: 'youtube',
    title: 'Turn real audience questions into a Q&A video that actually answers them',
    description:
      'Groups and answers real submitted or comment-sourced questions with specific, checkable answers, and explicitly separates a genuine answer from a graceful non-answer — rather than a Q&A script that restates a question back as a vague, feel-good response.',
    promptText: `You are writing a script for a Q&A video built from real audience-submitted or comment-sourced questions. A Q&A script has one job a normal video script doesn't: every question included has to get an actual answer, not a restated, vaguer version of the question dressed up as a response — if a genuine answer isn't available for a question, that has to be stated honestly, not papered over.

SUBMITTED QUESTIONS
{{submitted_questions}}

CHANNEL TOPIC AND EXPERTISE AREA
{{channel_expertise}}

TARGET LENGTH
{{target_length}}

CHANNEL VOICE
{{channel_voice}}

Q&A RULES
Group near-duplicate questions together and answer the combined version once, rather than answering the same underlying question three separate times with three separately-written but functionally identical answers — a viewer who submitted one version of a repeated question should still feel addressed even if their exact wording isn't the one read aloud. For every question, give an answer specific enough that a viewer could act on it or fact-check it — a real number, a real recommendation, a real named example — rather than a pleasant-sounding non-answer that just restates the question with more confident phrasing and no actual new information. If a question genuinely doesn't have a confident answer — outside the channel's real expertise, genuinely uncertain, or dependent on specifics the question didn't provide — say so plainly rather than generating a confident-sounding answer to a question that doesn't actually have one available; a wrong confident answer costs more credibility than an honest "I don't actually know, here's who or what I'd check instead." Order questions by a real logic, not just submission order — group by theme, or build from quick, simple answers early toward questions needing longer, more considered answers later, so the pacing doesn't randomly alternate between a ten-second answer and a three-minute one with no throughline. If a question is loaded, leading, or clearly baiting a reaction rather than seeking real information, either answer the genuine concern underneath the loaded framing directly, or note plainly that the framing itself is the actual problem with the question — don't pretend not to notice a clearly bad-faith question and answer it as if it were asked in good faith.

OUTPUT FORMAT
1. Grouped questions with their combined final wording as it will be read on camera.
2. The full answer script for each, spoken lines, ordered by the stated pacing logic.
3. Any question flagged as genuinely unanswerable with confidence, and the honest alternative response given instead.
4. Any question flagged as loaded or bad-faith, and how it was handled.`,
    variables: [
      {
        name: 'submitted_questions',
        description: 'The actual questions submitted or pulled from comments.',
        example:
          "'Is it too late to start investing at 35?', 'Should I pay off my car loan early or invest the extra?', 'Isn't all this index fund stuff just a bubble waiting to pop?', 'What's the actual minimum I need to start?'",
        required: true,
      },
      {
        name: 'channel_expertise',
        description:
          'What the channel is actually knowledgeable about, to be honest about limits.',
        example:
          "Personal finance content focused on budgeting and index investing basics — not a licensed financial advisor, doesn't give individualized investment advice",
        required: true,
      },
      {
        name: 'target_length',
        description: 'Intended runtime.',
        example: '15-18 minutes',
        required: false,
      },
      {
        name: 'channel_voice',
        description: "The channel's usual tone.",
        example:
          'Warm but blunt, comfortable saying "it depends" when it genuinely does, avoids hype',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'qna-video',
      'audience-engagement',
      'script-writing',
      'community-content',
      'video-structure',
    ],
    whyItWorks:
      'Requiring every included question to receive a specific, checkable answer rather than a restated non-answer targets the most common failure mode of AI-drafted Q&A content: a model asked to "answer" a question can satisfy the letter of the instruction by producing a confident-sounding paragraph that never actually commits to a number, a name, or a real recommendation, which reads as an answer on a first pass but leaves the viewer with nothing more actionable than the question itself contained. The explicit permission — really requirement — to say "I don\'t actually know" for a question genuinely outside the channel\'s expertise or confidence targets a distinct and more serious failure: a model has no built-in reluctance to generate a fluent, plausible-sounding answer to a question it has no real basis for answering well, and in a Q&A format specifically, a wrong but confident answer is more damaging than an honest non-answer, because a viewer who acts on a wrong confident answer and gets burned traces that outcome directly back to the specific video and question, unlike a vaguer piece of content where a wrong claim is harder to pin to one exact recommendation. Grouping near-duplicate questions into one combined answer rather than repeating functionally the same response under three different wordings keeps the pacing from feeling padded to any viewer watching the whole video straight through, even though each individual submitter whose question got folded into the group still gets their actual question addressed. Explicitly naming loaded or bad-faith questions rather than silently answering them as good-faith inquiries protects against a specific trap in audience Q&A: a question phrased to imply a conclusion — "isn\'t this whole thing just a bubble" — that gets answered as if it were a neutral information request ends up implicitly validating the loaded framing by engaging with it on its own terms, whereas naming the framing directly lets the response address the real underlying question honestly without either dodging it or accepting a premise the channel doesn\'t actually agree with.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-24' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Claude (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'youtube-livestream-rundown-script',
    category: 'youtube',
    title:
      'Build a livestream rundown that survives real chat interruptions and dead air',
    description:
      'Structures a livestream as flexible segments with built-in chat-engagement checkpoints and genuine filler-tolerant material, instead of a tight linear script that breaks the moment real-time chat, tech issues, or a slow start derail its timing.',
    promptText: `You are building a rundown for a YouTube livestream — not a word-for-word script, since a live stream has to survive real, unpredictable interruptions: chat questions arriving at random moments, a guest running late, a tech issue, a slower-than-expected start. You are building a flexible structure that holds up when the actual timing goes sideways, which a tightly scripted show does not.

STREAM TOPIC AND FORMAT
{{stream_topic}}

PLANNED DURATION
{{planned_duration}}

KEY SEGMENTS OR CONTENT TO COVER
{{key_segments}}

CHAT INTERACTION LEVEL EXPECTED
{{chat_interaction_level}}

TECHNICAL OR GUEST DEPENDENCIES
{{dependencies}}

RUNDOWN RULES
Build every segment with a minimum and a flexible-maximum duration, not a single fixed time — a segment planned for "exactly 12 minutes" breaks the moment chat asks an unexpectedly good question worth actually answering, or breaks the other direction when a guest gives a shorter answer than expected; give each segment a floor that guarantees the core content gets covered and a ceiling that can absorb real-time variation without derailing everything after it. Place at least one explicit chat-engagement checkpoint per segment — a specific moment to actively read and respond to chat, not just an assumption chat will get addressed "whenever" — since without a planned checkpoint, chat interaction either gets skipped entirely under time pressure or takes over the stream unplanned when the host feels obligated to catch up on a backlog of unanswered messages. Prepare genuine backup material — a tangent worth having, a chat-sourced question bank, a segment that can expand — for exactly the points in the rundown most likely to run short: after any planned segment shorter than five minutes, and immediately following any point dependent on something outside the host's control, like a guest joining or a technical setup step, since dead air at those exact points is the single most common live-stream failure and needs a specific answer ready, not just "figure it out live." Sequence any segment with a real technical or guest dependency so that a plausible delay in it doesn't strand the rest of the rundown — put a flexible, self-contained segment immediately before a dependency-heavy one, not immediately after, so a delay has somewhere to be absorbed without cascading. State explicitly which segments, if the stream runs long or short against the planned duration, are safe to cut or extend first, and which are the core content that must happen regardless of timing pressure.

OUTPUT FORMAT
1. A segment-by-segment rundown table: Segment | Floor time | Ceiling time | Chat checkpoint | Cut-first or protect priority.
2. A short list of backup material prepared for the specific short-segment and dependency points identified.
3. One line stating where a guest or technical dependency sits in the sequence and why that placement absorbs delay rather than cascading it.`,
    variables: [
      {
        name: 'stream_topic',
        description: 'What the stream is about and its format.',
        example:
          'A live build-along stream assembling a gaming PC from parts, with a guest co-host joining partway through',
        required: true,
      },
      {
        name: 'planned_duration',
        description: 'Intended total stream length.',
        example: '2 hours',
        required: true,
      },
      {
        name: 'key_segments',
        description: 'The main content blocks that need to happen.',
        example:
          'Unboxing and parts overview, motherboard and CPU installation, cooling and case assembly, first boot and troubleshooting, guest joins to discuss cable management and aesthetics',
        required: true,
      },
      {
        name: 'chat_interaction_level',
        description:
          'How much of the stream is meant to be chat-driven versus presenter-driven.',
        example:
          'Moderate — chat questions answered live during builds, but not a fully chat-directed format',
        required: true,
      },
      {
        name: 'dependencies',
        description:
          "Anything outside the host's direct control that the rundown needs to plan around.",
        example:
          'Guest co-host joins remotely around the 45-minute mark and has been late to two of the last three streams; first boot has about a 30% chance of needing troubleshooting based on past builds',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'livestream-planning',
      'stream-rundown',
      'live-content',
      'audience-engagement',
      'content-strategy',
    ],
    whyItWorks:
      "Building floor-and-ceiling durations instead of fixed segment times reflects the actual structural difference between a livestream and every other format in this category: a recorded video's timing is fully controlled in editing after the fact, while a livestream's timing is genuinely live and subject to real variance the host cannot edit away, so a rundown that assumes fixed durations is planning for a kind of certainty the format structurally cannot provide, and the first unexpectedly long chat question or unexpectedly quick guest answer breaks a rigid plan in a way it can't break a flexible one. Placing an explicit chat-engagement checkpoint in every segment, rather than trusting chat interaction to happen naturally, targets a specific and common live-stream failure pattern: without a planned moment for it, chat engagement either gets crowded out entirely when the host feels behind schedule and puts head-down focus on the content instead, or it swings the opposite direction and consumes the whole segment when the host tries to catch up on a growing backlog of unanswered messages, and a scheduled checkpoint prevents both failure modes by giving chat a guaranteed, bounded slot rather than an open-ended one. Preparing specific backup material for the exact points identified as short-segment or dependency-adjacent, rather than generic \"have some things ready,\" targets dead air at its actual highest-risk locations — the moment right after a five-minute segment ends early, or the moment a stream is waiting on a guest to connect, are the specific junctures where live content most visibly stalls, and having a named, ready tangent or chat question queued for exactly those points is a different and more reliable plan than trusting the host to improvise smoothly under real-time pressure. Sequencing a flexible segment immediately before, rather than after, a dependency-heavy one is what actually prevents cascading delay: a delay in a dependency the host can't control will push back whatever comes immediately after it in the rundown, so placing something absorbable there — instead of another tightly-timed segment — is what keeps one late guest from derailing the entire remaining schedule rather than just the one segment it directly affects.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-31' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
]
