import type { Prompt } from '../types'

/**
 * LinkedIn (Tier 2, marketing group) — post, profile and thought-leadership
 * prompts calibrated to the platform's actual register: hook-first post
 * structure, native document/carousel posts, profile About/headline
 * optimization, comment strategy for visibility, and content-calendar
 * planning. Deliberately distinct from `sales` (1:1 prospecting DMs) — this
 * category is scoped to public content and profile strategy only.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'linkedin-post-hook-first-line',
    category: 'linkedin',
    title: 'Write a first line that survives LinkedIn\'s "see more" cutoff',
    description:
      'Generate several first-line options for a LinkedIn post, each built to work as a complete thought before LinkedIn truncates it, not a teaser fragment cut off mid-sentence.',
    promptText: `I'm writing a LinkedIn post about: {{post_topic}}.
The core insight or result I want to lead with: {{key_insight_or_result}}.
Who I'm writing for: {{audience}}.
Tone: {{tone}}.

LinkedIn truncates posts behind "...see more" after roughly 140-210 characters depending on device, so the first line has to work as a stand-alone sentence that earns the tap, not a fragment that only makes sense once you keep reading.

Write 6 hook-line options for the first line of this post, each under 150 characters, using a different mechanism:
1. A specific, verifiable number or result (no rounded, vague stats)
2. A contrarian or "unpopular opinion" framing of {{key_insight_or_result}}
3. A direct question the audience is already asking themselves
4. A short, concrete scene or moment, not an abstract statement
5. A "most people think X, but..." reframe
6. A plain, confident statement of the outcome, with no adjectives doing the work

For each one, check whether it would still read as a complete thought if LinkedIn cut it off at exactly 150 characters — if it wouldn't, rewrite it until it does. Do not use engagement-bait phrasing like "Comment YES if...", "Tag someone who...", or "This will blow your mind."`,
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
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['linkedin-hooks', 'post-writing', 'algorithm', 'copywriting', 'feed-strategy'],
    whyItWorks:
      'LinkedIn\'s feed algorithm weights dwell time and genuine comments over raw click-through, and it also demotes posts flagged as engagement bait — so a hook engineered purely to force a click ("You won\'t believe what happened next...") works against the same system it\'s trying to game. Testing each line against the "does it survive a cut at 150 characters" rule targets the actual UI mechanic doing the damage: most weak hooks fail not because the idea is bad but because the sentence was written to resolve on line two, and line two is exactly what "...see more" hides on a phone screen.',
    exampleOutput:
      '1. (Number) "We cut 6 hours of meetings per engineer per month by deleting one recurring event." (89 chars — stands alone)\n2. (Contrarian) "Weekly status meetings are a tax on the people already telling you the truth in Slack." (92 chars — stands alone)\n3. (Question) "How many hours did your team lose to a meeting that could have been a message?" (82 chars — stands alone)',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-14' },
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-15' },
    ],
    changelog: [
      {
        date: '2026-07-15',
        note: 'Initial version, with the 150-character stand-alone test added after early drafts kept producing hooks that only resolved on line two.',
      },
    ],
  },
  {
    slug: 'linkedin-personal-story-to-lesson-post',
    category: 'linkedin',
    title: 'Turn a work memory into a story-driven LinkedIn post with a real lesson',
    description:
      'Structure a raw work anecdote into hook, setup, turn, and lesson — the beat structure that keeps a personal story from reading as either a humble-brag or a vague inspirational quote.',
    promptText: `Here's what actually happened, in my own words, unpolished: {{raw_story}}.
Who I'm writing this for: {{audience}}.
The lesson I want it to land on, if I have one in mind: {{lesson_you_want_to_land}}.
Length preference: {{length_preference}}.

Turn this into a LinkedIn post using this beat structure, in this order:
1. Hook (1 line) — the moment of tension or the outcome, not "Let me tell you a story about..."
2. Setup (2-4 short lines) — just enough context to understand the stakes: what was I trying to do, what did I think would happen
3. Turn (2-4 short lines) — what actually happened, including the specific detail that makes it feel true (a real number, a quote someone said, a decision I made)
4. Lesson (2-3 lines) — the takeaway, stated plainly, generalized to something the reader can use — not a moral I'm handing down
5. Soft close (1 line) — a genuine question or observation that invites a comment, not a command to comment

Keep paragraphs to 1-2 sentences with a line break between them, the way people actually write on LinkedIn, not dense paragraphs. Don't sand off the specific, slightly embarrassing or uncertain details — those are what make it read as true instead of as a LinkedIn story.`,
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
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['storytelling', 'personal-branding', 'post-structure', 'thought-leadership'],
    whyItWorks:
      'A story post without a delayed payoff gets skimmed and scrolled past; the hook-setup-turn-lesson order deliberately withholds the point until the reader has invested a few lines, which is what keeps dwell time up on a platform whose algorithm rewards exactly that. Explicitly instructing the model to keep the "specific, slightly embarrassing or uncertain" detail rather than smoothing it into generic inspiration is the difference between a story that reads as lived experience and the templated "I failed, then I learned, then I grew" post format LinkedIn users have become numb to.',
    exampleOutput:
      "I told a client we'd hit a deadline I already knew we'd miss.\n\nNot because I was optimistic. Because I was scared of losing the account.\n\nTwo weeks later, I made the call I'd been avoiding: we're late, here's why, here's the new date.\n\nThey stayed. Not despite that call — because of it. They told me later it was the first time a vendor had been straight with them about bad news before it became their problem too.\n\nThe lesson wasn't \"communicate better.\" It was that the lie I was protecting was smaller than the trust the truth would cost me — I just couldn't see that until after.\n\nWhat's the deadline you're not admitting you'll miss right now?",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-11' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-12' },
    ],
    changelog: [{ date: '2026-07-12', note: 'Initial version.' }],
  },
  {
    slug: 'linkedin-carousel-document-post-outline',
    category: 'linkedin',
    title: 'Outline a swipeable LinkedIn carousel from a single idea',
    description:
      "Turn one idea into a slide-by-slide outline for LinkedIn's native document-upload carousel format, built around one point per slide instead of a wall of text repeated across pages.",
    promptText: `The core idea I want to turn into a carousel: {{core_idea}}.
Who this is for: {{audience}}.
Roughly how many slides: {{number_of_slides}}.
Anything specific to include (data, steps, examples): {{specifics_to_include}}.

I'm going to upload this as a PDF using LinkedIn's native document post feature, which renders as a swipeable carousel in the feed. Outline it slide by slide:

Slide 1 (cover): a hook line that works the same way a post's first line does — a claim, number, or tension, not a title like "5 Tips for X"
Slides 2 through second-to-last: one idea per slide, each with a short slide title (under 8 words) and 1-3 lines of supporting text — no slide should require the reader to read a paragraph to get the point
Final slide: a summary of the single most important takeaway, plus a soft call to action (follow, save, or a genuine question) — not a generic "Like and share!"

For each slide, also give me one design note (e.g., "big number as the visual anchor," "before/after split," "single quote, nothing else") so this reads as a designed carousel, not slides of bullet points. Flag if any slide is trying to cram in more than one idea — split it instead.`,
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
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['carousel', 'document-post', 'content-format', 'linkedin-algorithm'],
    whyItWorks:
      'Native document posts render as a slide-by-slide swipe, and each swipe is a fresh dwell-time event — which is the documented reason carousels tend to out-reach a text post of the same length on LinkedIn: the format itself manufactures more time-on-post than a single scroll past a paragraph. That advantage collapses if a slide asks the reader to read a paragraph to understand it, so forcing one idea per slide and flagging overloaded slides protects the exact mechanic that makes the format work, rather than just repackaging a blog post into slide-shaped chunks.',
    exampleOutput:
      'Slide 1 (cover): "Nobody on my team owns product decisions. Here\'s the 4-bucket system that replaced a PM." Design note: big bold text, no image.\nSlide 2: "Bucket 1 — Fix now." Text: "Breaks core workflow for >5% of active users. Ships within the week, no discussion." Design note: red accent, single stat callout.\nSlide 3: "Bucket 2 — Roadmap." Text: "Valid, not urgent. Goes in the next planning cycle, requester gets a real date." Design note: calendar icon motif.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-18' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-19' },
    ],
    changelog: [{ date: '2026-07-19', note: 'Initial version.' }],
  },
  {
    slug: 'linkedin-about-section-rewrite',
    category: 'linkedin',
    title: 'Rewrite your LinkedIn About section so it reads as a person, not a resume',
    description:
      "Turn disjointed notes or a resume-voice draft into a first-person About section that opens strong before LinkedIn's preview cutoff and reads like it was written by the person, not extracted from a CV.",
    promptText: `Here's what I have now, or rough notes about myself: {{current_about_or_notes}}.
My role and what I actually focus on: {{role_and_focus}}.
Words or phrases people would search to find someone like me: {{keywords_to_include}}.
Who's likely to read this (recruiters, clients, peers): {{audience_reading_this}}.

Rewrite this as a LinkedIn About section, first person, under 2,600 characters (LinkedIn's field limit). Rules:
1. The first 2-3 sentences must work as a complete, compelling summary on their own — LinkedIn shows only roughly the first 300 characters before "...see more," on both the profile and in search results, so don't front-load context that only pays off later.
2. Write like the person is talking, not like a resume summarizing them in third person — no "Jane is a results-driven professional with 10 years of experience."
3. Work in the keywords from {{keywords_to_include}} naturally, inside real sentences — not as a bolted-on list of skills at the end.
4. Include one or two specifics (a real number, a real project type, a real turning point) instead of only abstractions like "passionate" or "dedicated."
5. End with one plain sentence saying what you want the reader to do — connect, reach out, view your portfolio — not left implicit.

After the rewrite, give me the character count and confirm it's under 2,600.`,
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
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['profile-optimization', 'about-section', 'personal-branding', 'linkedin-seo'],
    whyItWorks:
      "The About field truncates to roughly its first 300 characters in both the profile view and in search result snippets, so an opening line written as throat-clearing (\"I've always been passionate about...\") burns the only guaranteed-visible real estate the section has. Writing in first person matters because LinkedIn is a social feed, not a CV database — third-person resume voice is the fastest tell that a profile was copy-pasted rather than written for the platform it's on, and LinkedIn's People Search also indexes About-section text, so naturally embedded keywords do double duty as both voice and searchability.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-21' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial version; added the explicit 300-character opening rule after drafts kept saving the actual point for paragraph two.',
      },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'linkedin-headline-optimization',
    category: 'linkedin',
    title: 'Rewrite your LinkedIn headline to work everywhere it actually appears',
    description:
      'Turn a plain job title into a 220-character headline that still makes sense in the compact spaces it shows up in most — search results, comments, and connection requests — not just under your name on the full profile.',
    promptText: `My current title or headline: {{current_title_or_role}}.
Who I help or who I work with: {{who_you_help}}.
The specific outcome, expertise, or proof point I want represented: {{specific_outcome_or_expertise}}.
Keywords people might search to find someone like me: {{keywords_for_search}}.

LinkedIn's headline field has a 220-character hard limit, but it also renders in places that truncate much shorter — beside every comment you leave, in the connection-request preview, and in search result rows — so it needs to hold up compressed, not just at full length.

Give me:
1. A full-length version (180-220 characters) combining role, who I help, and the specific outcome or proof point, using {{keywords_for_search}} naturally
2. A compact version (under 80 characters) that keeps only the highest-value phrase — the one thing that should survive if everything else gets cut
3. One alternate full-length version with a different structural approach (e.g., leading with the outcome instead of the title)

For each, count the exact characters and confirm it's within 220. Avoid generic filler like "passionate," "results-driven," or "thought leader" — every word should be doing search or comprehension work.`,
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
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['headline', 'profile-optimization', 'personal-branding', 'linkedin-search'],
    whyItWorks:
      "The headline is the single most-repeated piece of text on LinkedIn — it shows next to every comment, every reaction notification, and every row of a search result, most of which truncate well before the 220-character limit on mobile. A headline optimized only for the full-profile view wastes its highest-frequency exposure, which is why this asks for a compact version that survives truncation on its own, not just a longer sentence typed to the character limit. LinkedIn's People Search also weights headline text for keyword matching, so front-loading the searchable role and audience terms — instead of burying them after a string of adjectives — is what actually helps you get found, not just look polished.",
    exampleOutput:
      'Full: "Senior Product Designer helping B2B SaaS teams ship enterprise-grade UI | Design systems, UX research | Cut onboarding drop-off 33% at [Company]" (149 chars)\nCompact: "Product Designer — B2B SaaS onboarding & design systems" (58 chars)',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-23' },
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-24' },
    ],
    changelog: [{ date: '2026-07-24', note: 'Initial version.' }],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'linkedin-comment-strategy-for-visibility',
    category: 'linkedin',
    title: "Draft comments on other people's posts that actually earn you visibility",
    description:
      'Generate substantive, specific comment drafts for target posts — built to be worth replying to, not a "Great post!" that gets buried and signals nothing.',
    promptText: `Here's the post I want to comment on (paste the text or a summary): {{post_content_or_summary}}.
My angle or expertise relevant to this: {{your_expertise_or_angle}}.
My relationship to the poster, if any: {{relationship_to_poster}}.
What I want this comment to do for me: {{goal}}.

Write 3 comment drafts, each a genuinely different move:
1. Add a concrete example, data point, or counterpoint from my own experience that extends the post — not a restatement of what they already said
2. Ask a specific follow-up question that a thoughtful reader would actually want answered, showing I engaged with the argument, not just the topic
3. Offer one specific resource, framework, or distinction that adds something the post didn't cover

Keep each under 400 characters so it doesn't get visually buried as a wall of text in the feed. None of the three may contain "Great post," "So true," "Love this," or any variation of a pure affirmation with no added content. Each comment should read as more about the post's idea than about me — if a draft is really just self-promotion wearing a comment's clothing, rewrite it.`,
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
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'comment-strategy',
      'engagement',
      'visibility',
      'networking',
      'linkedin-algorithm',
    ],
    whyItWorks:
      "LinkedIn's algorithm treats a comment as a stronger relevance signal than a like, and it can surface an active commenter's profile to the original poster's network and mutual connections — but only when the comment itself earns further engagement, like replies or reactions on the comment. A generic \"Great post!\" gets buried under dozens of identical ones and produces no downstream signal, while a comment substantive enough to get its own reply extends the visibility chain further than the original post alone. The instruction to reject anything that's \"self-promotion wearing a comment's clothing\" targets the second-most common failure — a comment that technically isn't a bare affirmation but is really just a pitch, which readers and posters both recognize instantly.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-26' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-27' },
    ],
    changelog: [{ date: '2026-07-27', note: 'Initial version.' }],
  },
  {
    slug: 'linkedin-thought-leadership-content-calendar',
    category: 'linkedin',
    title:
      'Build a month of LinkedIn content around 3-4 real pillars, not a posting schedule',
    description:
      'Turn your expertise and a business goal into a month of planned posts with real format variety and a reason each one exists, instead of a generic "post 3x a week" list.',
    promptText: `My area of expertise: {{expertise_area}}.
The business goal this content should move: {{business_goal}}.
How often I can realistically post: {{posting_frequency}}.
Formats I'm comfortable producing: {{formats_available}}.

First, define 3-4 content pillars — recurring themes within {{expertise_area}} that each connect to {{business_goal}} in a specific, stated way (not just "thought leadership" as a pillar).

Then build a 4-week calendar at {{posting_frequency}} that:
1. Rotates pillars so no two consecutive posts hit the same one
2. Rotates format across {{formats_available}} — don't schedule six text-only posts in a row if a carousel or poll option exists
3. For each slot, gives: week, format, pillar, a working title/hook idea, and one line on what this specific post is meant to do for {{business_goal}}

Close with a short note on which pillar is currently underused relative to how important it is to {{business_goal}}, so I know where the calendar is thin.`,
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
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['content-calendar', 'thought-leadership', 'content-strategy', 'planning'],
    whyItWorks:
      "A content calendar that's just a cadence with no argument behind it produces a month of posts that don't add up to anything measurable — a quarter later, nobody can say which posts actually moved the goal. Tying every slot to both a pillar and a stated reason it serves {{business_goal}} means the calendar can be reviewed for whether it's working, not just whether it shipped. Forcing format rotation, not just topic rotation, matters because LinkedIn's formats reach differently — carousels and documents earn more dwell time, polls get fast low-effort interaction, plain text relies entirely on the hook — so six posts of the same format in a row leaves real reach on the table regardless of how good the writing is.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-29' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
    ],
    changelog: [{ date: '2026-07-30', note: 'Initial version.' }],
  },
  {
    slug: 'linkedin-case-study-post-from-project',
    category: 'linkedin',
    title:
      'Turn a client project into a LinkedIn case-study post that reads as proof, not a press release',
    description:
      'Structure a real project outcome into a situation-obstacle-action-result post that leads with tension instead of "Case Study:", without inventing any number you were not actually given.',
    promptText: `Project context: {{project_context}}.
The obstacle or challenge going in: {{obstacle_or_challenge}}.
What was actually done: {{what_you_did}}.
The real result or outcome: {{result_or_outcome}}.
Can I name the client, or does this need to be anonymized: {{client_permission}}.

Write this as a LinkedIn post using this structure:
1. Hook — lead with the tension in the result itself (the gap between where things started and where they ended), not with "Case study:" or "Excited to share a project we finished"
2. Situation — 2-3 lines of context, only what's needed to understand the stakes
3. Obstacle — what specifically made this hard, stated honestly, not softened into "a unique challenge"
4. Action — what was actually done, specific enough that a reader in a similar position could learn from it, not just "we implemented a strategic solution"
5. Result — state {{result_or_outcome}} exactly as given, with no rounding up, estimating, or adding a number that wasn't provided
6. Close — one line on what this generalizes to for someone else in a similar position, not just "DM me to learn more"

If {{client_permission}} means the client can't be named, anonymize by industry and rough size, not with a fictional company name that could be mistaken for real. If any part of the result is unclear or unverifiable from what I gave you, flag it instead of smoothing over the gap.`,
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
    tags: ['case-study', 'social-proof', 'post-structure', 'b2b-marketing'],
    whyItWorks:
      'Case-study posts fail on LinkedIn in two predictable ways: they open like a press release ("Excited to share..."), which reads as promotional and gets scrolled past, or they inflate the result because the format itself tempts a rounder, more impressive-sounding number. Leading with the tension in the result — the gap, not the announcement — borrows the same mechanic that makes any hook work, and the explicit no-invented-numbers instruction matters because a specific but false number is more damaging than a vague true one: an unverifiable stat is one of the fastest ways a proof-of-work post gets challenged and discredited in its own comments.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-01' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
    ],
    changelog: [{ date: '2026-08-02', note: 'Initial version.' }],
  },
  {
    slug: 'linkedin-poll-question-design',
    category: 'linkedin',
    title: 'Design a LinkedIn poll that reveals a real signal, not just clicks',
    description:
      "Turn a topic into 2-4 poll options phrased with genuine tension, sized to LinkedIn's option-length limit — and get flagged if the poll you asked for is actually just engagement bait with no informational value.",
    promptText: `Topic or question I'm considering polling on: {{topic_or_question}}.
Who I'm polling: {{audience}}.
What I actually want to learn from the results: {{what_you_want_to_learn}}.

LinkedIn polls allow 2-4 answer options, each limited to 30 characters, and run for a duration you set (from 1 day up to 2 weeks). Give me:

1. Three poll question variants on this topic, each with 2-4 options that create genuine tension — meaning a reasonably informed audience member could plausibly land on more than one option, not a poll where 90%+ will obviously pick the same answer
2. For each variant, one sentence on what a specific result split (e.g., "if it comes back 70/30 toward option A") would actually tell me, distinct from what a different split would tell me
3. A flag on any variant that's really just engagement bait dressed as a poll — one with an obvious "correct" answer, or where every option restates the same underlying opinion — and a rewritten version if so

Keep option text literal and specific — no option should require a qualifier or "it depends" to make sense as a real answer.`,
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
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['polls', 'engagement', 'audience-research', 'linkedin-native-features'],
    whyItWorks:
      'A LinkedIn poll only pays off if the result distribution tells you something you didn\'t already know — a poll where the outcome is obvious before a single vote comes in ("Do you value good communication? Yes / Obviously yes") collects clicks but zero signal, and audiences increasingly call this out as manipulative in the comments, which costs more credibility than the engagement was worth. Designing real tension into the options is what turns the poll into informal audience research instead of a vanity-metric play, and the 30-character option limit forces you to state that tension as a literal claim instead of hedging it into vagueness.',
    exampleOutput:
      'Variant: "Should feature kickoffs require a written doc first?" Options: "Yes, always" / "Only for big features" / "No, slows us down" / "We skip docs entirely." A 70/30 split toward "only for big features" would tell you the team already has an implicit size threshold — a near-even 4-way split would tell you there\'s no shared norm at all, which is itself useful to know before proposing a new process.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-08-04' },
    ],
    changelog: [{ date: '2026-08-04', note: 'Initial version.' }],
  },
  {
    slug: 'linkedin-repurpose-blog-post-into-post',
    category: 'linkedin',
    title: "Repurpose a blog post into a LinkedIn post that doesn't read like a summary",
    description:
      "Extract the single strongest argument from a long-form post and rewrite it for LinkedIn's feed register — short lines, one idea, a native hook — instead of pasting in the blog's own headline and headers.",
    promptText: `Here's the blog post content or a detailed summary: {{blog_post_content_or_summary}}.
The single argument I want to lead with, if I already know it: {{single_argument_to_lead_with}}.
Blog URL, for your reference only — don't quote it in the post: {{blog_url}}.
Who I'm writing this LinkedIn version for: {{audience}}.

Do this in two steps:
1. Identify the ONE argument or insight in this post that's strong enough to carry a standalone LinkedIn post on its own — not a summary of every section. Tell me which one you picked and why the others didn't make the cut.
2. Rewrite it entirely in LinkedIn's native register: 1-2 sentence paragraphs with line breaks between them, no subheadings, no bullet-point dump of the blog's sections. Open with a hook line that has nothing to do with the blog's own headline — blog headlines are written for search intent, not for stopping a scroll.

Then answer honestly: should the blog link go in the post body, or should I hold it for the first comment instead? Explain the real tradeoff — native links may reduce on-platform reach because they pull attention off LinkedIn, but many creators now treat "link in first comment" as an unofficial workaround rather than a documented rule — don't state either option as a guaranteed algorithm fact.

End with a call to action that feels native to a LinkedIn post, not "read the full article here."`,
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
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['repurposing', 'content-strategy', 'blog-to-social', 'post-writing'],
    whyItWorks:
      "A blog post's structure — SEO-driven headers, longer paragraphs, a headline written to match search intent — is instantly recognizable as crossposted if pasted in with only light trimming, which kills the native feel both readers and the algorithm reward. Forcing the model to name the single strongest argument, and explain what it left out, prevents the default failure mode of repurposing tools: compressing every section instead of committing to one point. The honest, hedged answer on link placement matters because the link-in-first-comment habit is a widely repeated creator heuristic, not a confirmed platform rule, and a prompt that asserts it as settled fact would be teaching a myth as if it were documented behavior.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-05' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
    ],
    changelog: [{ date: '2026-08-06', note: 'Initial version.' }],
    relatedToolSlug: 'utm-builder',
  },
  {
    slug: 'linkedin-hiring-post-that-attracts-candidates',
    category: 'linkedin',
    title: 'Write a LinkedIn hiring post that gets read, not scrolled past',
    description:
      'Turn a job opening into a post-native hiring announcement that leads with the real problem the hire will own, distinct from a pasted job description with a company logo.',
    promptText: `Role: {{role_title}}.
What this person will actually spend their time doing: {{what_they_will_actually_do}}.
Team and company context: {{team_or_company_context}}.
What's genuinely different about this role or team, if anything: {{what_makes_this_role_different}}.
How to apply: {{how_to_apply}}.

Write a LinkedIn hiring post, not a job description. Structure:
1. Hook — lead with the real problem this hire will own or solve, specific enough that the right candidate recognizes it, not "We're hiring a {{role_title}}!"
2. A typical week — 2-3 concrete things this person will actually do, not a list of responsibilities lifted from a JD template
3. One honest line about what's genuinely hard about this role — not a fake weakness like "you'll work with passionate people," an actual difficulty
4. One true, specific line about the team or company — grounded in something real from {{team_or_company_context}}, not a generic "fast-paced, dynamic environment"
5. A single clear next action: {{how_to_apply}}

Do not use "rockstar," "ninja," "wear many hats," "work hard play hard," "fast-paced environment," or any close variant of these. After writing it, check your own draft against that list and flag if any snuck in anyway.`,
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
    whyItWorks:
      "A hiring post that reads like the job description gets scrolled past because candidates already see dozens of nearly identical ones in a single feed session — leading with the real problem the hire will own, instead of the title, is what lets the right candidate self-select in in the first line. The instruction to include one genuinely hard part of the role matters because omitting it doesn't make the role look better, it makes the post read as less honest, and honesty about difficulty is what separates a post a serious candidate trusts from one written by whoever owns the careers page. Banning specific corporate hiring clichés — and asking the model to self-check against them — targets phrases that have become a documented candidate-repellent signal precisely because every recruiter on the platform uses the same ones.",
    exampleOutput:
      "Our billing pipeline breaks every time we get a traffic spike, and right now that's a 2am page for whoever's on call.\n\nWe're hiring a senior backend engineer to rebuild it properly — not patch it again.\n\nA typical week: redesigning the queue architecture, pairing with our one other backend engineer on load testing, and making the call on what gets rebuilt first versus what can wait.\n\nHonest part: there's no dedicated DevOps here yet, so you'll own more infrastructure decisions than a senior role at a bigger company usually would.\n\nWe're 4 engineers, ship every Friday, and you'd be the first person with real architectural ownership on this system.\n\nDM me or apply at example.com/careers/backend-engineer.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-06' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-07' },
    ],
    changelog: [{ date: '2026-08-07', note: 'Initial version.' }],
  },
  {
    slug: 'linkedin-post-performance-analysis-and-iterate',
    category: 'linkedin',
    title: 'Turn your LinkedIn post analytics into one specific next-post hypothesis',
    description:
      "Feed in the numbers LinkedIn's own post analytics panel gives you and get a plain-language read on what actually happened, plus exactly one testable change for the next post — not a re-explanation of the numbers you already have.",
    promptText: `The post, summarized: {{post_content_summary}}.
The analytics as shown in LinkedIn's post-analytics panel — impressions, reactions, comments, reposts, and the follower vs. non-follower split from Discovery if you have it: {{analytics_data}}.
A comparable previous post's numbers, if I have one: {{comparison_post}}.
What I want the next post to do better: {{goal_for_next_post}}.

Treat every number in {{analytics_data}} as correct — do not recalculate, round, or estimate anything I didn't give you. Give me:

1. One-sentence verdict on whether this beat or underperformed relative to {{comparison_post}} — if I didn't give you a comparison, say so instead of inventing a baseline
2. The specific signal that explains the result — for example, a high non-follower percentage suggests the algorithm pushed this beyond my existing network (often via a topic or hashtag), while a high comment-to-reaction ratio suggests the content itself triggered discussion rather than passive scrolling-by likes. Name which signal is actually present here, don't just say "engagement was good."
3. One concrete, testable change for the next post — a single variable (hook style, or format, or posting time, or topic), not three at once, so I can actually attribute the next result to something
4. One thing that's already working and shouldn't be changed, so I don't accidentally undo it while testing the other variable

If the data given doesn't support a confident read on any of these, say what additional number you'd need instead of guessing.`,
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
    ],
    targetTools: ['Claude', 'ChatGPT'],
    tags: ['analytics', 'performance-analysis', 'iteration', 'content-strategy'],
    whyItWorks:
      'LinkedIn\'s native analytics panel breaks impressions into a follower vs. non-follower split under Discovery, and reports reactions, comments, and reposts separately — these are different signals that call for different next moves, and collapsing them into a single "engagement was good" verdict wastes the one piece of real data available. A high non-follower percentage points at topic or hashtag-driven algorithmic push beyond your existing network; a high comment-to-reaction ratio points at the content itself provoking discussion rather than passive liking — this prompt is scoped to reading those signals honestly rather than recalculating anything, the same discipline used for interpreting ad performance data elsewhere in this library. Restricting the recommendation to one changed variable is what makes the next post an actual test instead of a guess with three simultaneous changes and no way to know afterward which one mattered.',
    exampleOutput:
      "Verdict: this outperformed the comparison post on both reach and depth — impressions up 45%, but the more telling number is comments per impression, which is roughly 3x the carousel post's rate.\nSignal: 71% non-follower reach plus a high comment count together suggest this spread via genuine discussion, not just algorithmic hashtag push alone — the story format is doing real work here, not just topic luck.\nOne variable to test next: try the same personal-story structure on a topic outside your usual niche, to see if the discussion-driving effect is about the format or about this specific story.\nDon't change: keep it text-only and link-free — you have no evidence a link or carousel format would have done better here, and changing it now would confound the next test.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-07' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial version, scoped to interpretation-only after testing showed models will otherwise "helpfully" estimate missing metrics instead of asking for them.',
      },
    ],
  },
] as const
