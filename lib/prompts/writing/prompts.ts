import type { Prompt } from '../types'

/**
 * "Write & Communicate with AI" — Tier 3 (traffic/authority, not a growth
 * bet, see docs/research/prompt-library.md §4). No `serviceTarget` on any
 * entry here by default, matching the `json-formatter`/`word-counter`
 * LeadTier: C convention in `lib/tools/registry.ts` — this category exists
 * for topical breadth and to absorb general-LLM-writing search demand
 * (including the Jasper/Copy.ai query fold-in per §1), not to sell a
 * service. Each prompt still uses real role-context-task-format (RTF) or
 * CO-STAR structuring per §11.4's chat/LLM conventions, not a vague
 * one-liner — the "specificity beats vagueness" NN/g finding cited in the
 * brief applies just as much to a low-intent category as a high-intent one.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'tailor-a-cover-letter-to-a-job-posting',
    category: 'writing',
    title: 'Tailor a cover letter to a specific job posting',
    description:
      "Turns a generic resume and a job listing into a cover letter that mirrors the posting's own language and priorities, instead of a template that reads like it was sent to fifty other companies.",
    promptText: `You are an experienced career coach who has reviewed thousands of cover letters for {{industry}} roles and knows exactly what makes a hiring manager keep reading past the first paragraph.

TASK: Write a cover letter for the job posting below, using my background to show I'm a fit for what THIS posting specifically asks for — not a generic summary of my career.

JOB POSTING:
{{job_posting}}

MY BACKGROUND:
{{candidate_background}}

REQUIREMENTS:
- Open with a specific, non-generic hook tied to the company or role — no "I am writing to express my interest in..."
- Pull 2-3 of the posting's own priority phrases or requirements and directly address how my background matches each one — use its language, not a paraphrase
- Include one concrete, quantified example from my background (a number, a result, a scale) rather than a trait claim like "I'm a hard worker"
- Keep it to {{max_words}} words maximum
- Close with a specific next step, not "I look forward to hearing from you"
- Do not invent experience, employers, titles, or numbers that aren't in my background above — if something in the posting isn't covered by my background, don't fabricate a match for it

Write the letter now. After it, add a one-line note flagging any posting requirement my background doesn't clearly cover, so I know what to address in an interview.`,
    variables: [
      {
        name: 'industry',
        description:
          'The field or industry the role is in, so the tone calibrates correctly.',
        example: 'B2B SaaS marketing',
        required: true,
      },
      {
        name: 'job_posting',
        description:
          'The full text of the job listing, pasted in — the more complete, the better the match.',
        example:
          'Senior Content Marketing Manager at Fluent Systems. Own our blog and case study program, drive organic pipeline, manage one direct report. Requires 5+ years B2B content experience and a track record of measurable pipeline impact.',
        required: true,
      },
      {
        name: 'candidate_background',
        description:
          'A resume, bullet list, or plain-text summary of relevant experience and achievements.',
        example:
          '6 years in B2B content marketing. Grew organic blog traffic 3x at a martech startup over 18 months. Managed one junior writer. Led a case study program that was cited in 40% of closed-won sales calls.',
        required: true,
      },
      {
        name: 'max_words',
        description: 'A hard word ceiling to keep the letter skimmable.',
        example: '300',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['cover letter', 'job search', 'career', 'resume', 'hiring'],
    whyItWorks:
      'Role-context-task-format (RTF) framing does the heavy lifting: assigning the model the role of a career coach who has read "thousands" of letters primes it to judge against a real bar, not just generate polite prose. The core fix, though, is specificity over vagueness — the single most consistently cited failure mode in real cover letters is genericness, so the prompt forces the model to lift the posting\'s own phrases back at it (a lightweight few-shot anchor using the reader\'s own words) and demands one quantified example instead of an adjective. The explicit anti-fabrication instruction plus the closing gap-flag turns this from a text generator into something closer to an honest editor — it tells you where the letter is weak instead of papering over it.',
    exampleOutput:
      "Dear Fluent Systems Hiring Team,\n\nWhen I read that this role owns \"organic pipeline\" and not just \"content output,\" it told me exactly what kind of marketer you're looking for — and it's the same bar I've been held to for the last three years.\n\nAt [startup], I grew organic blog traffic 3x in 18 months, and built a case study program that sales cited in 40% of closed-won calls — which is to say, the content didn't just get read, it closed deals. Your posting asks for a track record of measurable pipeline impact; that case study program is mine.\n\nI've also managed a direct report, so the \"manage one junior writer\" line isn't a stretch for me — it's what I've been doing.\n\nI'd welcome a conversation about how I'd approach the first 90 days on your blog and case study program. Available this week if helpful.\n\n[Note: the posting doesn't specify which vertical Fluent Systems sells into — worth confirming in an interview so I can tailor examples further.]",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-28' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Added the anti-fabrication instruction and gap-flag closer after testing showed models would occasionally invent a matching detail rather than admit a gap.',
      },
      { date: '2026-07-15', note: 'Initial version published.' },
    ],
    relatedToolSlug: 'email-signature-generator',
  },
  {
    slug: 'write-a-cold-outreach-email-that-gets-replies',
    category: 'writing',
    title: 'Write a cold outreach email that actually gets a reply',
    description:
      'Builds a short, specific cold email around one real trigger or fact about the recipient, instead of the generic "I wanted to reach out" template that fills most inboxes.',
    promptText: `ROLE: You are a sales copywriter who specializes in short, high-reply-rate cold outreach — you've seen why 95% of cold emails get ignored and you write for the other 5%.

CONTEXT: I'm reaching out to {{recipient_role}} at {{recipient_company}}. Here's what I know about them and why I'm reaching out now: {{trigger_or_context}}

I'm offering: {{offer_or_ask}}

TASK: Write a cold outreach email using this structure:
1. Subject line — under 6 words, specific, not clickbait, no emoji
2. Opening line — reference the specific trigger/context above, not a generic compliment ("I saw your company is doing great work")
3. One sentence connecting that trigger to why I'm relevant to them, not the other way around
4. One sentence stating the ask, phrased as a low-friction yes/no question — not "let me know if you're interested"
5. No paragraph should exceed 2 sentences

FORMAT CONSTRAINTS:
- Total length under {{max_words}} words including subject line
- No generic filler phrases: "I hope this email finds you well," "I wanted to reach out," "circling back," "just touching base"
- Write like a specific person emailed them, not like a template with their name inserted
- End with a plain signoff, no forced urgency ("this offer expires Friday")

Write the email. Then write one alternate subject line as a backup option.`,
    variables: [
      {
        name: 'recipient_role',
        description: "The recipient's job title or function.",
        example: 'Head of Customer Success',
        required: true,
      },
      {
        name: 'recipient_company',
        description: "The company you're emailing into.",
        example: 'Northwind Analytics',
        required: true,
      },
      {
        name: 'trigger_or_context',
        description:
          'A specific, real fact that justifies emailing them right now — a launch, a hire, a post, a review, a shared connection.',
        example:
          'They just posted on LinkedIn about their support team drowning in ticket volume after a product launch tripled signups.',
        required: true,
      },
      {
        name: 'offer_or_ask',
        description:
          'What you actually want from this email — a call, a reply, a specific piece of feedback.',
        example:
          'A 15-minute call to show how we cut first-response time by 40% for a similarly-sized support team.',
        required: true,
      },
      {
        name: 'max_words',
        description: 'A hard ceiling on total length, subject included.',
        example: '90',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['cold email', 'outreach', 'sales', 'networking', 'business development'],
    whyItWorks:
      'This is one of the most heavily searched "write me an email" patterns there is, and also one of the most badly served by generic prompts — asking an LLM for "a cold email" with no constraints reliably produces the same bloated, complimenting, four-paragraph template everyone already ignores. The fix is almost entirely format constraint, not creativity: naming the exact forbidden filler phrases, capping paragraph length at 2 sentences, and forcing the ask into a yes/no question all remove the model\'s default instinct to pad and hedge. Requiring a real trigger as an input (rather than letting the model invent a compliment) is the single highest-leverage change, since a specific, true detail about the recipient is what actually earns a reply — genericness, not the offer, is the real cause of a cold email getting deleted.',
    exampleOutput:
      "Subject: Ticket volume after the launch\n\nHi Priya,\n\nSaw your post about support drowning after the launch tripled signups — that's a good problem to have and a rough couple of weeks either way.\n\nWe helped a similarly-sized team cut first-response time 40% during a comparable spike, mostly by triaging before a human ever sees the ticket.\n\nWorth a 15-minute call this week to see if the same approach fits your setup?\n\nBest,\n[Your name]\n\nAlternate subject: After Tuesday's launch",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Added explicit forbidden-filler-phrase list — without it, models drifted back to "hope this finds you well" openers about 1 in 4 runs.',
      },
      { date: '2026-07-10', note: 'Initial version published.' },
    ],
    relatedToolSlug: 'email-signature-generator',
  },
  {
    slug: 'rewrite-resume-bullets-with-quantified-impact',
    category: 'writing',
    title: 'Rewrite resume bullets to show quantified impact',
    description:
      'Converts flat, duty-listing resume bullets ("responsible for managing social media") into achievement-framed lines with a number, a result, or a scale — the pattern recruiters actually scan for.',
    promptText: `ROLE: You are a resume writer who has coached candidates into more interviews by fixing exactly one recurring problem: bullets that describe duties instead of results.

TASK: Rewrite each of the resume bullets below using this formula: [Action verb] + [what you did] + [quantified result or scale]. Every bullet should answer "so what happened because of this?"

CURRENT BULLETS:
{{current_bullets}}

ADDITIONAL CONTEXT (numbers, scale, timeframes I can use):
{{context_and_numbers}}

REQUIREMENTS:
- Start each bullet with a strong action verb, never "Responsible for," "Helped with," or "Worked on"
- Every bullet must include at least one number: a percentage, dollar amount, time saved, team size, or volume — pull from the context above; if no real number exists for a bullet, keep it qualitative but flag it rather than inventing a figure
- One line per bullet, no bullet longer than ~20 words
- Cut filler adjectives ("dynamic," "results-driven," "passionate")
- Keep the same underlying facts — sharpen the framing, don't add achievements that aren't supported by the context I gave you

Return the rewritten bullets in the same order as the originals. After the list, flag any bullet where you had to keep it qualitative because no number was available, and tell me what number would strengthen it most if I can find it.`,
    variables: [
      {
        name: 'current_bullets',
        description:
          'The existing resume bullets, one per line, exactly as they read today.',
        example:
          '- Responsible for managing company social media accounts\n- Helped onboard new employees\n- Worked on improving customer support response times',
        required: true,
      },
      {
        name: 'context_and_numbers',
        description:
          "Any real numbers, scale, or timeframes behind those bullets that aren't in the bullet text yet.",
        example:
          'Social media: grew follower count from 4k to 15k in one year, drove a 22% lift in site traffic from social. Onboarding: onboarded 12 new hires over 8 months, cut ramp-up time from 6 weeks to 4. Support: reduced average first-response time from 24 hours to 5 hours.',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['resume', 'career', 'job search', 'bullet points', 'hiring'],
    whyItWorks:
      'This gives the model an explicit formula (action verb + action + quantified result) rather than a vague "make this better" instruction — a structural constraint that\'s easy for the model to apply consistently across every bullet instead of improving only the first one and coasting on the rest. Splitting the raw bullets from the supporting numbers into two separate variables matters more than it looks: it stops the model from inventing plausible-sounding metrics to satisfy the "include a number" rule, because it only has real numbers to draw from. The instruction to flag ungrounded bullets rather than silently fabricate a number is the same anti-hallucination guardrail used in the cover-letter prompt above, applied to the place resumes most commonly get caught embellishing.',
    exampleOutput:
      '- Grew company social following from 4k to 15k followers in 12 months, driving a 22% increase in site traffic from social channels\n- Onboarded 12 new hires over 8 months, cutting average ramp-up time from 6 weeks to 4\n- Cut average customer support first-response time from 24 hours to 5 hours\n\nAll three bullets had a supporting number, so none needed to stay qualitative.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-29' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Split raw bullets and supporting numbers into separate variables after finding the model invented metrics when given bullets alone.',
      },
      { date: '2026-07-12', note: 'Initial version published.' },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'explain-a-topic-like-im-a-beginner',
    category: 'writing',
    title: "Explain a topic like I'm a complete beginner",
    description:
      "Gets a plain-language explanation of a confusing topic pitched to an actual, named starting knowledge level, with a concrete analogy and a check for what's still unclear — instead of a generic Wikipedia-style summary that assumes background you don't have.",
    promptText: `ROLE: You are a patient tutor who specializes in explaining {{subject_area}} to complete beginners. You never assume background knowledge that hasn't been established.

TOPIC TO EXPLAIN: {{topic}}

MY CURRENT LEVEL: {{current_knowledge}}

TASK:
1. Explain the topic in plain language, as if to someone who has never encountered it — define every term the first time you use it, in the same sentence
2. Give one concrete, everyday analogy that maps onto the core mechanism (not just a surface similarity)
3. Walk through one simple, specific example that shows the concept in action
4. End with 2-3 questions I could answer to prove I actually understood this, not just read it

CONSTRAINTS:
- No jargon without an immediate plain-language definition attached
- Keep the whole explanation under {{max_words}} words
- If the topic genuinely can't be simplified without losing accuracy, say so explicitly rather than oversimplifying into something misleading
- Do not pad with unnecessary caveats or history unless it directly helps the explanation land

After the explanation, ask me one clarifying question about what's still unclear, rather than assuming the explanation fully landed.`,
    variables: [
      {
        name: 'subject_area',
        description:
          'The broad field the topic sits in, so the tutor persona calibrates tone and depth.',
        example: 'macroeconomics',
        required: true,
      },
      {
        name: 'topic',
        description: 'The specific concept you want explained.',
        example: 'why interest rate hikes are used to fight inflation',
        required: true,
      },
      {
        name: 'current_knowledge',
        description:
          'An honest, specific statement of what you already know — the more specific, the better the calibration.',
        example:
          "I know inflation means prices go up, but I don't understand what raising interest rates actually does to cause prices to slow down.",
        required: true,
      },
      {
        name: 'max_words',
        description: 'A word ceiling so the explanation stays digestible in one sitting.',
        example: '350',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['study help', 'learning', 'explain simply', 'education', 'tutoring'],
    whyItWorks:
      'The key move is replacing the vague "explain like I\'m 5" framing with an actual, specific starting-knowledge statement — a model given a real (if simple) baseline can calibrate exactly what to define versus skip, where "like I\'m 5" is such an overused, unspecific instruction that models often revert to a generic tone rather than genuinely adjusting content depth. Requiring the analogy to map onto the actual mechanism (not just "feel similar") heads off the common failure mode of cute-but-misleading analogies. The closing comprehension-check questions and the explicit permission to say "this can\'t be simplified without losing accuracy" both work against the model\'s default bias toward confident, complete-sounding answers even when a concept resists compression.',
    exampleOutput:
      'Interest rates are basically the "price" of borrowing money. When a central bank raises them, borrowing gets more expensive for everyone — mortgages, business loans, credit cards.\n\nThink of the economy like a crowded highway. Lower interest rates are like a green light at every intersection: people borrow and spend freely, traffic (spending) speeds up, and if too many cars try to merge into the same lanes, you get gridlock — that gridlock is inflation. Raising rates is like turning some lights red: fewer people borrow, spending slows, and the "traffic" of demand eases off, which takes pressure off prices.\n\nExample: if a car loan goes from 4% to 8% interest, the monthly payment on the same car jumps — so fewer people buy cars right now. Multiply that across mortgages, business expansion, and credit cards, and total spending in the economy cools down, which is what\'s supposed to bring price growth back down.\n\nCheck your understanding — can you explain: (1) why a mortgage payment goes up when rates rise, (2) why slower spending would slow price increases, (3) what might go wrong if rates rise too fast?\n\nWhat part is still fuzzy — the borrowing-cost mechanism, or how slower spending actually connects to prices?',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-27' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-27' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Replaced "explain like I\'m 5" phrasing with a required current-knowledge variable after testing showed it produced noticeably better-calibrated explanations.',
      },
      { date: '2026-07-08', note: 'Initial version published.' },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'draft-a-script-for-a-difficult-conversation',
    category: 'writing',
    title: 'Draft a script for a difficult conversation or feedback session',
    description:
      'Builds a talking-points script for a hard conversation — a tough performance review, a boundary-setting talk, a difficult family discussion — that states the point directly without either softening it into mush or coming across as an attack.',
    promptText: `ROLE: You are a communication coach who specializes in helping people deliver direct, honest feedback without being either harsh or so hedged the message gets lost.

SITUATION: {{situation_description}}

MY RELATIONSHIP TO THE OTHER PERSON: {{relationship}}

WHAT I NEED THEM TO UNDERSTAND OR CHANGE: {{core_message}}

WHAT I'M WORRIED WILL GO WRONG: {{concern}}

TASK: Write a short script I can use as talking points (not a word-for-word speech to recite) with this structure:
1. An opening line that states why we're having this conversation, plainly, in one sentence — no long preamble
2. The core observation or issue, stated as a specific fact or behavior, not a character judgment (e.g. "the report was late three times this month" not "you're unreliable")
3. The impact of that issue, stated concretely
4. One direct question inviting their perspective, before I propose a solution
5. A proposed next step or ask, stated clearly

CONSTRAINTS:
- No corporate euphemism ("there's an opportunity for growth" when the meaning is "this isn't working")
- No sandwiching the real point between two compliments so it gets lost — say one genuine positive if true, then move to the point directly
- Keep the whole script under {{max_words}} words — this is talking points, not an essay
- Flag anywhere I should pause and actually listen rather than keep talking

After the script, give me one likely pushback they might have and a short, calm way to respond to it.`,
    variables: [
      {
        name: 'situation_description',
        description: 'What kind of conversation this is and the basic context.',
        example:
          'A performance conversation with a direct report whose work quality has slipped over the last two months.',
        required: true,
      },
      {
        name: 'relationship',
        description:
          'Your relationship to the other person — it changes tone and authority level.',
        example: 'I am their manager; we have a generally good working relationship.',
        required: true,
      },
      {
        name: 'core_message',
        description: 'The one thing you actually need them to hear or change.',
        example:
          "The last three deliverables were late without notice, and it's affecting the team's ability to plan.",
        required: true,
      },
      {
        name: 'concern',
        description:
          "What you're afraid will go wrong in the conversation — helps the model pre-address it.",
        example:
          "I don't want it to come across as an attack, and I'm worried they'll get defensive and shut down.",
        required: true,
      },
      {
        name: 'max_words',
        description:
          'A word ceiling to keep it as talking points, not a script to memorize.',
        example: '200',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'difficult conversation',
      'feedback',
      'management',
      'communication',
      'conflict resolution',
    ],
    whyItWorks:
      'The structural anchor here is separating observation from judgment — an explicit, worked example ("the report was late three times" vs. "you\'re unreliable") functions as a one-shot demonstration of the exact reframing the model needs to apply throughout, which is far more reliable than telling it to "be direct but kind" and hoping it infers the pattern. Naming the specific fear (getting defensive, coming across as an attack) lets the model design around that exact failure mode instead of producing a generic script that ignores what actually makes the conversation hard. Explicitly banning the compliment-sandwich and corporate-euphemism patterns matters because those are the model\'s own defaults when asked for "diplomatic" feedback — without the constraint, it tends to reproduce exactly the softening that makes real feedback conversations fail.',
    exampleOutput:
      'Opening: "I want to talk about the last few deliverables — this isn\'t a formal writeup, just a direct conversation."\n\nObservation: "The last three deliverables came in late without a heads-up beforehand."\n\nImpact: "That\'s made it hard for the team to plan around dependencies, and it\'s created some last-minute scrambling twice now."\n\n[Pause here — let them respond before proposing anything.]\n\nQuestion: "Can you walk me through what\'s been going on with timing on your end?"\n\nProposed step: "Going forward, I\'d like a heads-up at least two days out if something\'s going to slip, even if the reason is completely reasonable — that\'s really the core ask."\n\nLikely pushback: they may say they didn\'t think the delays were a big deal. Calm response: "I hear that — the timing itself might be fine most weeks, it\'s really the lack of a heads-up that\'s the issue, so that\'s the one thing I\'d ask to change."',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Added the worked observation-vs-judgment example inline after generic "be direct" phrasing kept producing softened, judgment-laden lines.',
      },
      { date: '2026-07-14', note: 'Initial version published.' },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'tighten-writing-to-a-strict-word-limit',
    category: 'writing',
    title: 'Tighten writing down to a strict word limit without losing the point',
    description:
      'Cuts a draft down to an exact word count by removing filler, hedging, and repetition first — instead of the usual AI move of chopping whole sentences and losing the actual argument.',
    promptText: `TASK: Cut the text below to {{target_word_count}} words or fewer, while preserving every distinct point it makes. Do not simply delete sentences from the end — actively tighten the language throughout.

TEXT TO TIGHTEN:
{{original_text}}

CUTTING PRIORITY (in this order):
1. Remove filler phrases and hedging ("it's important to note that," "in order to," "at the end of the day," "I think that")
2. Remove redundant restatement of the same point in different words
3. Combine sentences that make related points separately
4. Shorten remaining sentences by cutting unnecessary qualifiers and adjectives
5. Only as a last resort, cut a lower-priority supporting point entirely — and if you do, tell me which one and why

CONSTRAINTS:
- Keep the original tone (formal stays formal, casual stays casual)
- Keep every number, name, and specific claim from the original — don't generalize away specifics to save words
- The result must still read as complete sentences, not a bullet-point fragment version of the original
- Report the final word count at the end, and flag if you had to go even 5% over the target to keep the meaning intact rather than silently missing the target

Return the tightened version, then the word count, then any cuts made under priority 5.`,
    variables: [
      {
        name: 'original_text',
        description: 'The full text you want shortened.',
        example:
          "I think it's important to note that, at the end of the day, our Q3 results were actually pretty strong across the board. In order to achieve this, the team worked really hard and put in a lot of effort throughout the quarter, and I want to say that this hard work is what really drove the strong results we saw. Revenue grew by 18% year over year, which is a great outcome, and it's worth mentioning that this is the best quarterly growth we have had in over two years.",
        required: true,
      },
      {
        name: 'target_word_count',
        description: 'The exact word ceiling you need to hit.',
        example: '40',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['editing', 'word count', 'concise writing', 'tightening', 'copyediting'],
    whyItWorks:
      'Most "shorten this" prompts fail the same way: the model just deletes the back half of the text or converts prose into a choppy bullet list. Giving it an explicit, ordered cutting hierarchy — filler and hedges first, redundancy second, sentence-combining third, and whole-point deletion only as a documented last resort — forces the model to tighten language throughout the piece instead of amputating from the end. Naming actual filler phrases as a mini few-shot list ("it\'s important to note that," "at the end of the day") is more effective than the instruction "remove filler," since those exact hedges are also the phrases models themselves default to when asked to write more content, so they need to be named to be reliably cut. The self-report constraint (report the count, flag if over target) closes the loop instead of leaving you to recount by hand — pair this with the word-counter tool to verify the model\'s own count, since LLM word counts are frequently off by a few words.',
    exampleOutput:
      "Our Q3 results were strong: revenue grew 18% year over year, the best quarterly growth in over two years, driven by the team's work throughout the quarter.\n\nWord count: 27\n\nNo priority-5 cuts were needed — all points fit within the target after tightening filler and redundancy alone.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-30' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Added the ordered cutting hierarchy after finding unordered instructions led models to cut whole sentences from the end rather than tighten language throughout.',
      },
      { date: '2026-07-11', note: 'Initial version published.' },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'write-a-genuine-thank-you-or-follow-up-note',
    category: 'writing',
    title: 'Write a genuine thank-you or follow-up note',
    description:
      "Writes a short thank-you or follow-up note (after an interview, a meeting, a favor, a referral) that references one specific detail from the interaction, so it doesn't read as an obviously templated courtesy message.",
    promptText: `TASK: Write a short thank-you / follow-up note for the situation below.

WHO IT'S TO: {{recipient}}
WHAT HAPPENED: {{interaction_context}}
ONE SPECIFIC THING WORTH MENTIONING: {{specific_detail}}
WHAT I WANT THIS NOTE TO DO: {{goal}}

REQUIREMENTS:
- Reference the specific detail above in the first two sentences — the note should be recognizably about this exact interaction, not swappable with any other thank-you note
- Keep it to {{max_words}} words
- Match tone to the relationship: {{tone}}
- If the goal includes a next step (staying in touch, confirming a next meeting, asking a follow-up question), state it clearly in one sentence near the end, not buried
- No generic closing filler ("Thanks again for your time and consideration") — end on the specific note instead

Write the note. Then suggest one alternative subject line if this is being sent as an email rather than a handwritten note.`,
    variables: [
      {
        name: 'recipient',
        description: "Who you're writing to and your relationship to them.",
        example: 'The hiring manager who interviewed me for a product design role',
        required: true,
      },
      {
        name: 'interaction_context',
        description:
          'What actually happened — the meeting, favor, or event this note follows up on.',
        example:
          "A 45-minute interview where we talked through my portfolio and their team's current redesign project.",
        required: true,
      },
      {
        name: 'specific_detail',
        description:
          'One real, specific thing from the interaction to anchor the note in — a comment they made, a detail they shared, a moment worth referencing.',
        example:
          'She mentioned the team is struggling to get engineering buy-in on design changes, and I have a relevant story about solving exactly that at my last job.',
        required: true,
      },
      {
        name: 'goal',
        description: 'What you want the note to accomplish beyond politeness.',
        example:
          'Reinforce that I understand their actual problem and would be useful solving it, and keep myself top of mind before their decision.',
        required: true,
      },
      {
        name: 'tone',
        description: 'How formal or warm the note should read.',
        example: 'professional but warm, not stiff',
        required: true,
      },
      {
        name: 'max_words',
        description: 'A word ceiling — most thank-you notes fail by being too long.',
        example: '120',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['thank you note', 'follow up', 'interview follow-up', 'networking', 'email'],
    whyItWorks:
      'The specific-detail variable is the entire mechanism here — a thank-you note fails the moment it reads as swappable with any other thank-you note, and the only reliable way to stop an LLM from defaulting to that generic register is to hand it one real, concrete detail and require it to appear in the first two sentences, not buried at the end. This mirrors the cold-outreach prompt\'s trigger-fact requirement: specificity is doing the same job in both, anchoring the message in something true rather than letting the model fall back on template phrasing. Separating "what happened" from "what I actually want this note to accomplish" also matters, since a thank-you note that\'s purely polite reads differently from one that\'s quietly doing follow-up work (staying top of mind, reinforcing fit) — naming the goal explicitly lets the model write toward it instead of defaulting to pure courtesy.',
    exampleOutput:
      "Hi Maria,\n\nThank you for walking me through the redesign project yesterday — the engineering buy-in challenge you described is exactly the kind of problem I enjoy solving. At my last role, I ran into the same resistance and got past it by bringing engineers into the design review a stage earlier, which cut pushback significantly by the time changes were proposed.\n\nI'd love the chance to bring that same approach to your team. Happy to share more detail on how that process worked if it would be useful before your next round of decisions.\n\nThanks again for the thoughtful conversation.\n\nBest,\n[Your name]\n\nAlternative subject line: Following up on the redesign challenge",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Required the specific detail to land in the first two sentences after early drafts buried it near the end, undermining the whole point.',
      },
      { date: '2026-07-09', note: 'Initial version published.' },
    ],
    relatedToolSlug: 'email-signature-generator',
  },
  {
    slug: 'turn-messy-notes-into-a-coherent-paragraph',
    category: 'writing',
    title: 'Turn messy bullet notes into a coherent paragraph',
    description:
      "Converts scattered meeting notes, brainstorm fragments, or half-sentence bullet points into one or more flowing paragraphs with real transitions — without inventing connections or facts the notes don't support.",
    promptText: `TASK: Turn the raw notes below into {{output_format}} — clear, connected prose, not a list. Keep every distinct point from the notes; don't drop any and don't add any that aren't implied by what's there.

RAW NOTES:
{{raw_notes}}

CONTEXT (what these notes are for, if it changes how they should read): {{purpose}}

REQUIREMENTS:
- Group related notes together into logical paragraphs rather than following the original bullet order if a different order reads more naturally
- Add real transitions between ideas ("as a result," "meanwhile," "this matters because") only where the notes actually support that relationship — don't invent a causal or sequential link that isn't there
- If two notes seem to contradict each other or you're unsure how they connect, flag it rather than silently picking one interpretation
- Match this tone: {{tone}}
- Keep it to roughly {{target_length}}

Write the paragraph(s). Then list, in one line, any note you had to guess the intended meaning of, so I can confirm or correct it.`,
    variables: [
      {
        name: 'raw_notes',
        description:
          'The actual fragmentary notes, bullets, or shorthand you want turned into prose.',
        example:
          "- customer churned after 3 months\n- said onboarding was confusing\n- support ticket volume high in month 1\n- competitor has better docs\n- CS team flagged this in Q2 review\n- pricing wasn't the issue per exit survey",
        required: true,
      },
      {
        name: 'purpose',
        description:
          'What the resulting paragraph is for — changes emphasis and framing.',
        example:
          'This is going into a churn analysis summary for the product team, to argue we should invest in onboarding.',
        required: true,
      },
      {
        name: 'output_format',
        description: 'How many paragraphs or what shape the output should take.',
        example: 'a single paragraph',
        required: false,
      },
      {
        name: 'tone',
        description: 'The register the prose should read in.',
        example: 'plain, analytical, internal-memo tone',
        required: true,
      },
      {
        name: 'target_length',
        description: 'A rough length target so the output matches where it needs to go.',
        example: '100-120 words',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['note taking', 'meeting notes', 'summarizing', 'editing', 'productivity'],
    whyItWorks:
      'Turning fragments into prose is exactly where LLMs are most tempted to over-connect — smoothing choppy notes into flowing paragraphs naturally invites invented causal links ("as a result," "this led to") that the underlying notes never actually established. The explicit instruction to add transitions only where the notes support them, plus a required flag for guessed connections, directly targets that failure mode instead of leaving the model free to narrate a story that sounds coherent but overstates what the notes actually say. Asking for regrouping by logical relationship rather than preserving original bullet order is what makes the output read as genuinely written rather than a bullet list with periods swapped in for dashes — order-preservation is the default and usually the wrong choice for notes captured in the moment rather than in argument order.',
    exampleOutput:
      "The customer churned after three months, and the pattern points primarily to onboarding rather than price: the exit survey explicitly ruled out pricing as a factor, while support ticket volume spiked in the first month and the CS team flagged onboarding friction in the Q2 review. Confusing onboarding also compares unfavorably to a competitor whose documentation is stronger, which may be compounding the problem rather than causing it independently.\n\nGuessed connection: I inferred that the competitor's better docs are a contributing factor rather than a separate, unrelated note — worth confirming that's the intended read.",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-30' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Added the guessed-connection flag requirement after finding models would confidently assert causal links between unrelated notes.',
      },
      { date: '2026-07-13', note: 'Initial version published.' },
    ],
    relatedToolSlug: 'word-counter',
  },
]
