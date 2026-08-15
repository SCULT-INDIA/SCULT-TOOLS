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
  {
    slug: 'writing-storytelling-work-anecdote-narrative-arc',
    category: 'writing',
    title: `Turn a flat work anecdote into a story with real tension, not a timeline of what happened`,
    description: `Restructures a raw, chronological anecdote into a scene-based narrative built around a want and a turn, ready to drop into a talk, an About page, or an application essay.`,
    promptText: `You are restructuring a true anecdote I'm going to give you, chronologically, into a short story with actual narrative tension — the kind that works in a talk, an About page, or an application essay, not a diary entry.

RAW ANECDOTE (as I'd tell it out loud, unpolished)
{{raw_anecdote}}

WHERE THIS WILL BE USED
{{use_context}}

WHAT I WANTED WHEN IT STARTED
{{protagonist_want}}

WHAT WAS ACTUALLY AT STAKE IF IT WENT WRONG
{{stakes_if_fails}}

TARGET LENGTH
{{target_length}}

RULES
Find the single moment in the raw anecdote where the outcome was genuinely uncertain — not the moment I've been trained by retelling to treat as the climax, but the actual point where I didn't know what would happen next. Open the story at or just before that moment, not at the beginning of the chronology; readers don't need the setup I think they need, they need the tension. Cut every event from the raw anecdote that didn't change what I wanted or what was at stake — a true story has more events in it than a good story does, and the job here is subtraction. State the want and the stakes early and concretely, in scene, not as a summary sentence explaining why this mattered — show the moment I realized what I stood to lose, don't tell me I realized it. End on the turn itself or just past it, not on a moral or a lesson tacked onto the end; if the story is well-built the point should already be obvious without being stated.

WHAT NOT TO DO
Do not add invented dialogue, invented people, or invented details I didn't give you — flag any gap you had to guess-fill instead of silently inventing texture to make it read more vividly. Do not soften the stakes to make me look better in hindsight; the version where I was genuinely unsure and it could have gone badly is the version with actual tension.

OUTPUT FORMAT
1. The restructured story, at the target length.
2. A one-line note on which moment you chose as the true opening and why the earlier chronology didn't need to be there.
3. A list of any details you flagged as gaps rather than invented.`,
    variables: [
      {
        name: 'raw_anecdote',
        description: `The true story as you'd tell it out loud, in order, unpolished.`,
        example: `We were three weeks from a client renewal and found out our main integration partner was shutting down their API with 10 days notice. I had to tell the client before they found out from the partner directly.`,
        required: true,
      },
      {
        name: 'use_context',
        description: `Where this story will actually be used.`,
        example: `Opening anecdote for a 12-minute conference talk on incident communication.`,
        required: true,
      },
      {
        name: 'protagonist_want',
        description: `What you wanted at the point the story starts, stated concretely.`,
        example: `I wanted to be the one who told the client, before they heard it secondhand and assumed we'd been hiding it.`,
        required: true,
      },
      {
        name: 'stakes_if_fails',
        description: `What was genuinely at risk if it went wrong.`,
        example: `A $400k renewal and, more immediately, the client's trust that we'd tell them bad news early rather than late.`,
        required: true,
      },
      {
        name: 'target_length',
        description: `How long the finished piece should run.`,
        example: `About 300 words, readable aloud in under two minutes.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`storytelling`, `narrative-structure`, `personal-narrative`, `public-speaking`, `creative-writing`],
    whyItWorks: `GPT-5.1's default move on a raw, chronological anecdote is to summarize it faithfully in order, because that's the safest way to preserve the facts it was given — which produces a report, not a story, since a report and a story differ mainly in where they start and what they cut. Naming the true moment of uncertainty and forcing the model to open there, rather than at the chronological beginning, works against its instinct to front-load context the way a status update would; most people's retelling of their own story has already been smoothed by hindsight into starting too early and explaining too much, so the instruction has to explicitly override the source material's own framing, not just follow it. Making stakes and want concrete and in-scene rather than summarized matters because the model will otherwise produce a sentence like 'I knew this mattered a lot,' which does the reporting work of a stakes statement without doing the story work of making a reader feel it — the difference only shows up when you require it to happen inside a moment rather than as connective narration. The explicit instruction against inventing dialogue or people addresses a specific and common failure mode: asked to make a true anecdote 'read more vividly,' models reliably add plausible-sounding texture — a remembered quote, a described reaction — that wasn't in the source, which is fine for pure fiction but turns a true story into an embellished one the moment it's presented as fact, so the prompt has to make fabrication a flagged exception rather than a silent default.`,
    exampleOutput: `The Slack notification came in at 4:47 on a Tuesday: our integration partner was shutting down their API in ten days. I read it twice before I understood what it meant for the renewal call I had booked for Thursday. The only real decision was whether the client heard it from me first, or from someone else's press release...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-short-story-flash-fiction-single-sitting',
    category: 'writing',
    title: `Write a complete flash-fiction story that lands in one sitting instead of reading like a truncated novel`,
    description: `Produces a self-contained short story at a specific word count with one clear turn, avoiding the common failure of flash fiction that reads like the first chapter of something longer.`,
    promptText: `You are writing a complete, self-contained flash-fiction story — not an excerpt, not the opening of something bigger, a whole story that resolves within its own length.

GENRE / TONE
{{genre}}

POV AND TENSE
{{pov}}

PROTAGONIST'S SITUATION AT THE START
{{protagonist_situation}}

HOW THE READER SHOULD FEEL AT THE LAST LINE
{{ending_feeling}}

TARGET WORD COUNT
{{word_count_target}}

STEP 1 — Pick one turn
Before drafting, decide on exactly one moment of change this story will deliver — a realization, a reversal, a decision made. Flash fiction fails when it tries to hold a whole arc's worth of incident in too little space; the fix is to compress scope, not compress prose. State that one turn to yourself first.

STEP 2 — Enter late, leave early
Begin as close to the turn as the situation allows — skip the arrival, the small talk, the establishing description a longer story could afford. End at or just past the turn, before the story would naturally want to explain its own meaning or show the aftermath settling.

STEP 3 — Draft to the target length
Write the story at {{word_count_target}}, holding to the single turn from Step 1. Every sentence should be doing at least one of: advancing toward the turn, establishing the one detail the ending needs to land, or characterizing the protagonist through action rather than description.

STEP 4 — Self-check before finalizing
Read your own draft back and check: does it read as complete, or does it read like a fragment that wants five more pages? If it reads like a fragment, the fix is almost always that too much incident was attempted — cut toward one turn, don't add words to compensate.

WHAT NOT TO DO
Do not append a moral, a summarizing final paragraph, or a line that explains what the story means — trust the single turn to carry it. Do not introduce a second major event or subplot; flash fiction breaks under a second engine of change.

OUTPUT FORMAT
1. The story at the target length.
2. One line naming the single turn you built it around.`,
    variables: [
      {
        name: 'genre',
        description: `Genre and tonal register for the piece.`,
        example: `Quiet literary realism, understated rather than dramatic.`,
        required: true,
      },
      {
        name: 'pov',
        description: `Point of view and tense.`,
        example: `First person, past tense.`,
        required: true,
      },
      {
        name: 'protagonist_situation',
        description: `Where the protagonist is and what's true for them as the story opens.`,
        example: `A woman sorting her late father's tools in his garage, three months after the funeral, having put this off as long as she could.`,
        required: true,
      },
      {
        name: 'ending_feeling',
        description: `The emotional note the last line should leave the reader on.`,
        example: `Not resolved grief, but a small, specific permission to stop holding onto something.`,
        required: true,
      },
      {
        name: 'word_count_target',
        description: `The exact target length.`,
        example: `750 words.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`short-story`, `flash-fiction`, `fiction-writing`, `creative-writing`, `narrative-craft`],
    whyItWorks: `Asked for a 'short story,' GPT-5.1 will often default to plot density calibrated for a novel chapter — an inciting incident, a complication, a climax, and a denouement all compressed into a few hundred words — which produces something that feels rushed rather than short, because the model is pattern-matching to 'story structure' generically rather than to the specific compression flash fiction requires. Forcing a single named turn before any prose is drafted works against that default by constraining scope at the planning stage, where it's cheap to fix, rather than trying to trim an overstuffed draft after the fact, which usually just produces a shorter but still-crowded piece. The 'enter late, leave early' instruction targets a second, related failure: models tend to open scenes with orienting description — where someone is, what the room looks like — because that's a safe, low-risk way to start, but in a length-constrained piece that orientation consumes a disproportionate share of the available words before any tension exists. Explicitly banning a closing moral or summarizing paragraph matters because models are trained on a lot of writing (personal essays, LinkedIn posts) that ends by stating its own takeaway, and that habit reads as amateurish in fiction, where the meaning is supposed to live in what happened, not in a sentence explaining it afterward. The self-check step gives the model a concrete diagnostic — 'does this read like a fragment' — rather than an abstract quality bar, which produces a more honest second pass than simply asking it to 'review and improve.'`,
    exampleOutput: `The wrench still had his grip oil on the handle, dark in the grooves where a hand had worn it smooth. I turned it over twice before I understood I wasn't looking for anything in these boxes. I was looking for a reason to keep them a little longer, and I'd just run out of one...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-novel-chapter-voice-continuity-draft',
    category: 'writing',
    title: `Draft a new novel chapter that stays in your established voice instead of drifting into generic prose`,
    description: `Drafts the next chapter of an in-progress novel using your existing prose as a voice reference, with an explicit goal for what the chapter must accomplish and what it must not do to the story so far.`,
    promptText: `You are drafting the next chapter of a novel already in progress. I'm giving you an excerpt from an earlier chapter as a voice reference — match its rhythm, vocabulary register, and narrative distance, not just its plot facts.

PREVIOUS CHAPTER EXCERPT (voice reference)
{{previous_chapter_excerpt}}

WHAT THIS NEW CHAPTER MUST ACCOMPLISH
{{chapter_goal}}

POV CHARACTER FOR THIS CHAPTER
{{pov_character}}

VOICE NOTES BEYOND WHAT'S VISIBLE IN THE EXCERPT
{{voice_notes}}

TARGET LENGTH
{{chapter_word_target}}

RULES
Before drafting, name three specific features of the reference excerpt's voice — sentence length pattern, what kind of detail gets noticed versus skipped, how internal thought is rendered — and hold to them, rather than defaulting to a generic competent-novel voice that could belong to any book. Accomplish the stated chapter goal through scene and event, not through a paragraph of narration that tells the reader the goal has been met. If the chapter goal requires information the reader doesn't have yet, deliver it through what the POV character notices or does, not through a block of backstory exposition dropped in whole. End the chapter on a note that creates a specific question for the reader, not a general sense of things continuing — a chapter should close having changed what the reader wants to know next.

WHAT NOT TO DO
Do not resolve anything the chapter goal didn't ask you to resolve — new chapters that quietly wrap up unrelated threads take control of the story away from me. Do not introduce a new named character with more than a line of description unless the chapter goal requires one; unplanned characters are a common way novel drafts drift off their outline. Do not summarize what 'happened so far' at the top of the chapter — start in scene.

OUTPUT FORMAT
1. The three voice features you identified from the reference, before the draft.
2. The chapter draft at the target length.
3. A one-line flag for anything you had to invent to make the chapter goal work, so I can check it against continuity.`,
    variables: [
      {
        name: 'previous_chapter_excerpt',
        description: `A representative passage (500-1500 words) from an earlier chapter, used purely as a voice reference.`,
        example: `[Pasted excerpt: 900 words from Chapter 4, third person limited, short declarative sentences, heavy on physical sensation, sparse dialogue tags]`,
        required: true,
      },
      {
        name: 'chapter_goal',
        description: `What this specific chapter needs to accomplish in the story.`,
        example: `The protagonist discovers the letter was forged, and has to decide whether to confront her brother or use the discovery as leverage.`,
        required: true,
      },
      {
        name: 'pov_character',
        description: `Whose point of view this chapter is told from.`,
        example: `Mireille, third person limited, same as most of the book.`,
        required: true,
      },
      {
        name: 'voice_notes',
        description: `Anything about the voice that matters but isn't obvious from a single excerpt.`,
        example: `She never narrates her own emotions directly — grief and anger both come out as physical detail or clipped dialogue.`,
        required: false,
      },
      {
        name: 'chapter_word_target',
        description: `Target chapter length.`,
        example: `2,200-2,600 words.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`novel-writing`, `fiction-writing`, `voice-consistency`, `long-form-fiction`, `creative-writing`],
    whyItWorks: `GPT-5.1 is very good at matching an explicit style description ('short declarative sentences') but far less reliable at inferring voice implicitly from a pasted excerpt alone, because voice-matching from example is a soft pattern-completion task the model performs unevenly across a long generation — it tends to hold the reference voice for the first few paragraphs and then drift toward its own default competent-novel register as the chapter goes on, especially once dialogue or exposition kicks in. Forcing it to name three specific, checkable voice features before drafting converts an implicit imitation task into an explicit constraint it can be held to sentence by sentence, which measurably reduces mid-chapter drift compared to just supplying the excerpt and asking it to 'match this style.' The instruction to deliver the chapter goal through scene rather than narration addresses the model's tendency, under a stated 'must accomplish X' requirement, to write a paragraph that announces the accomplishment directly — which reads as summary rather than as a lived chapter, and is a giveaway of AI-assisted drafting to an experienced reader. Banning unplanned new characters and unrelated thread resolution matters specifically for serialized fiction: an isolated chapter-drafting request has no visibility into the rest of the outline, so left unconstrained the model will sometimes 'helpfully' tie off a loose end or introduce a minor character to smooth a transition, silently altering continuity the author didn't ask it to touch — flagging invented details is the mechanism that lets an author catch this before it compounds across chapters.`,
    exampleOutput: `The seal had been broken and reset before, she was almost sure of it — the wax sat a shade too even along the fold, like something pressed twice. She didn't say anything to Julien at breakfast. She watched him butter his toast the same way he had every morning for eleven years and wondered how long she could keep doing that too...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-story-premise-avoid-first-cliche-version',
    category: 'writing',
    title: `Generate story premises from a vague spark idea that skip past the first, most obvious version of themselves`,
    description: `Takes a rough idea and produces several genuinely distinct premises built from it, each deliberately steering away from the most predictable take so you're choosing between real options, not near-duplicates.`,
    promptText: `You are generating distinct story premises from a rough spark idea I'll give you — not variations on one premise, genuinely different directions a writer could take this idea.

SPARK IDEA
{{spark_idea}}

GENRE
{{genre}}

WHAT I'VE ALREADY SEEN DONE WITH THIS IDEA (avoid these)
{{seen_before}}

INTENDED AUDIENCE
{{audience}}

NUMBER OF PREMISES
{{premise_count}}

RULES
Before generating anything, identify what the single most obvious, most-written version of this spark idea would be — the version most people would land on first — and do not include it among your answers; use it only as a marker of what to steer clear of. For each premise, change a different structural element from the obvious version: who the protagonist is, what they actually want versus what they think they want, what the central obstacle really is, or where in the timeline the story starts. Each premise must be specific enough to write from immediately — a named-enough protagonist, a concrete situation, a clear central tension — not a one-line pitch so abstract it could describe five different stories. State explicitly, for each premise, what makes it different from the obvious version, so I can tell the variation is deliberate rather than cosmetic.

WHAT NOT TO DO
Do not produce premises that differ only in surface details like character names or settings while keeping the same underlying conflict and shape — that's not a distinct premise, it's a reskin. Do not include any premise that matches something I listed under 'already seen done.'

OUTPUT FORMAT
For each premise: a title, a 2-3 sentence pitch, and one line naming the specific structural element it varies from the obvious version. Present {{premise_count}} of them, ranked by how much story potential you think each has for the stated audience.`,
    variables: [
      {
        name: 'spark_idea',
        description: `The rough, unfinished idea you're starting from.`,
        example: `A lighthouse keeper who starts receiving messages meant for a lighthouse that was decommissioned decades ago.`,
        required: true,
      },
      {
        name: 'genre',
        description: `The genre you want the premises in.`,
        example: `Literary speculative fiction, quiet and melancholic rather than horror.`,
        required: true,
      },
      {
        name: 'seen_before',
        description: `Versions of this idea you already know exist, to be explicitly avoided.`,
        example: `Ghost story where the keeper realizes they're actually dead; time-loop story where the messages are from their own future.`,
        required: false,
      },
      {
        name: 'audience',
        description: `Who the finished story is for.`,
        example: `Adult literary fiction readers, the kind who'd read Klara and the Sun.`,
        required: true,
      },
      {
        name: 'premise_count',
        description: `How many distinct premises to generate.`,
        example: `4`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`story-premise`, `brainstorming`, `creative-writing`, `idea-development`, `fiction-writing`],
    whyItWorks: `Asked to brainstorm premises from a spark idea, GPT-5.1's first few outputs reliably cluster around whatever the single most statistically common treatment of that idea is in its training distribution, because that's the lowest-perplexity, most reinforced completion for the prompt — which is exactly the version a writer wants to skip past, since if it's the first thing the model reaches for, it's likely also the first thing most other writers reach for. Explicitly naming the obvious version and instructing the model to treat it as a boundary rather than an option forces it to search a different, less-traveled part of its own output space for the actual answers, which produces measurably more distinct results than simply asking for 'creative' or 'unexpected' premises in the abstract — vague creativity instructions don't give the model anything concrete to diverge from. Requiring each premise to name the specific structural element it varies (protagonist, want-versus-need, obstacle, or timeline entry point) prevents the common failure mode of 'reskinned' premises that swap surface details like names and settings while leaving the same underlying shape intact, which happens because changing surface details is the cheapest way to appear to have generated something new without doing the harder work of restructuring. The audience field matters because premise quality is not audience-neutral — a premise with real potential for literary readers may be a poor fit for a middle-grade audience, and without that constraint the model tends to average toward a generic 'broadly appealing' pitch that doesn't strongly serve anyone.`,
    exampleOutput: `1. The Wrong Frequency — A retired keeper's estranged daughter, now a radio engineer, starts receiving the messages herself after inheriting the lighthouse, and has to decide whether decoding them means reopening a relationship she'd rather leave closed. Varies: protagonist is the inheritor, not the original keeper, shifting the story from haunting to inheritance.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-plot-outline-beats-that-cause-each-other',
    category: 'writing',
    title: `Turn a one-line premise into a full plot outline where each beat actually causes the next one`,
    description: `Expands a premise into a structured outline built on causation rather than a sequence of things that merely happen one after another, using whichever story structure fits the material.`,
    promptText: `You are expanding a story premise into a full plot outline. The test for every beat in this outline is causation, not sequence — each beat should happen because the previous one did, not just after it.

PREMISE
{{premise}}

GENRE
{{genre}}

STRUCTURE PREFERENCE
{{structure_preference}}

PROTAGONIST'S CENTRAL GOAL
{{protagonist_goal}}

SCOPE
{{chapter_or_scene_count}}

PHASE 1 — Spine
Before breaking out individual beats, state the causal spine of the whole story in one paragraph: what the protagonist wants, what specifically stands in the way, and what changes about them by the end. Everything in Phase 2 has to trace back to this spine.

PHASE 2 — Beat outline
Break the story into beats following {{structure_preference}}. For every beat, state not just what happens but why it happens given the beat before it — if a beat could be removed without breaking the causal chain to the next one, flag it as optional rather than including it as load-bearing. Pay particular attention to the midpoint and the low point: the midpoint should change what the protagonist is pursuing or how they're pursuing it, not just raise the stakes of the same pursuit, and the low point should be a direct consequence of a choice the protagonist made earlier, not bad luck imposed from outside.

PHASE 3 — Causality audit
Go back through your own beat list and check each transition: does beat N happen because of beat N-1, or merely after it? Flag any transition where you had to rely on coincidence or a character acting out of established character to make the sequence work, since those are the points most likely to feel unearned to a reader.

OUTPUT FORMAT
1. The spine paragraph.
2. The full beat outline, each beat with its one-line causal justification.
3. The causality audit findings from Phase 3, including anything flagged as weak.`,
    variables: [
      {
        name: 'premise',
        description: `The one-line (or short-paragraph) premise to expand.`,
        example: `A disbarred lawyer takes a job ghostwriting appeals for death row inmates, and finds evidence that could exonerate a client she's not allowed to legally represent.`,
        required: true,
      },
      {
        name: 'genre',
        description: `Genre for the story.`,
        example: `Literary thriller.`,
        required: true,
      },
      {
        name: 'structure_preference',
        description: `The structural framework to build the outline around.`,
        example: `Three-act structure with a clear midpoint reversal.`,
        required: true,
      },
      {
        name: 'protagonist_goal',
        description: `What the protagonist is actively trying to achieve.`,
        example: `Get the exonerating evidence to someone with standing to act on it before the scheduled execution date.`,
        required: true,
      },
      {
        name: 'chapter_or_scene_count',
        description: `The scale of the outline needed.`,
        example: `About 28 chapters, novel-length.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`plot-outline`, `story-structure`, `novel-planning`, `fiction-writing`, `creative-writing`],
    whyItWorks: `GPT-5.1 can reproduce the shape of a three-act or Save the Cat structure fluently because those labels are heavily represented in its training data, but fluency with the labels is not the same as causal soundness — a common failure is an outline where beats are correctly placed at the right percentage marks of the structure but connected to each other only by sequence ('and then'), which reads as competent on a beat-sheet but flat as an actual story, since readers track causation, not percentages. Requiring a stated causal spine before any beats are generated gives the model a single throughline to check every subsequent beat against, rather than generating beats independently from the structure template and hoping they cohere — this is the same reason outlining a spine first works for human writers, but it matters more for a model, which has no persistent sense of the story's logic across a long generation unless it's been made explicit and referable. The specific instruction about the midpoint (redirect the pursuit, not just escalate it) targets a very common generic-outline failure where the model treats midpoint purely as a stakes-raising checkpoint, producing a story that's structurally correct but monotonic in tension rather than genuinely turning. The causality audit as a separate, final pass matters because self-critique performed in the same breath as generation is measurably weaker than a dedicated second pass explicitly told what to look for — asking the model to re-read its own outline hunting specifically for coincidence-driven or out-of-character transitions catches problems that generating the outline correctly the first time often doesn't.`,
    exampleOutput: `Spine: Elena wants to restore some version of the legal legitimacy she lost, and takes the ghostwriting job believing it lets her practice law by proxy without the risk of practicing law directly — until she finds evidence that makes staying at arm's length morally impossible, forcing her to choose between the safety of her new, diminished role and the professional identity she gave up...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-character-profile-contradiction-and-want-vs-need',
    category: 'writing',
    title: `Build a character profile organized around contradiction and want-versus-need, not a stat sheet nobody will reread`,
    description: `Produces a character profile that centers on the internal contradiction driving the character, rather than a checklist of biographical facts that don't actually inform how they'd behave in a scene.`,
    promptText: `You are building a character profile for fiction. Skip the biographical-checklist format — the profile should center on the one contradiction that makes this character interesting to write scenes for.

CHARACTER'S ROLE IN THE STORY
{{character_role}}

SURFACE TRAIT (how others perceive them)
{{surface_trait}}

WHAT'S ACTUALLY DRIVING THEM UNDERNEATH
{{buried_wound}}

STORY CONTEXT
{{story_context}}

ONE DEFINING HABIT OR TIC
{{one_defining_habit}}

Build the profile around the gap between the surface trait and the buried wound — state explicitly what they want on the surface (their conscious goal) versus what they actually need (the thing the buried wound is really about), and be specific that these two things can be in direct conflict, since a character whose want and need already align has no real arc to play. Include: how the buried wound leaks out in small, unconscious ways even when the character is trying to hide it — a tell, not a confession. How they'd behave differently with someone who threatens the wound directly versus someone who has no idea it exists. One scenario where their defining habit would visibly crack under specific pressure, named concretely rather than left abstract. What they believe about themselves that the story will eventually prove wrong.

WHAT NOT TO DO
Do not include biographical filler that doesn't inform behavior — birthdate, favorite color, unless it's load-bearing for the story. Do not resolve the contradiction in the profile itself; the profile should set up the tension, not defuse it before any scene is written.

OUTPUT FORMAT
A profile of 300-500 words organized under: Want vs. Need, How the Wound Leaks Out, Behavior Under Two Different Pressures, The Crack Point, The Belief That Will Be Proven Wrong.`,
    variables: [
      {
        name: 'character_role',
        description: `This character's function in the story.`,
        example: `Secondary antagonist — the protagonist's former mentor, now a rival.`,
        required: true,
      },
      {
        name: 'surface_trait',
        description: `How this character reads to others on first impression.`,
        example: `Supremely confident, almost dismissive of anyone who second-guesses themselves.`,
        required: true,
      },
      {
        name: 'buried_wound',
        description: `What's actually driving the character underneath the surface trait.`,
        example: `He was publicly humiliated early in his career for a mistake that wasn't fully his fault, and has never stopped needing to be seen as infallible since.`,
        required: true,
      },
      {
        name: 'story_context',
        description: `Where this character sits in the plot, so the profile is useful, not generic.`,
        example: `He's about to be asked to publicly back the protagonist's research, which requires admitting his own earlier work was wrong.`,
        required: true,
      },
      {
        name: 'one_defining_habit',
        description: `A specific, concrete tic or habit tied to the character.`,
        example: `Reframes any criticism of his work as a misunderstanding of it, within seconds, almost reflexively.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`character-profile`, `character-development`, `fiction-writing`, `creative-writing`, `character-design`],
    whyItWorks: `Asked generically for a 'character profile,' GPT-5.1 defaults to a biographical-form structure — name, age, occupation, backstory, personality traits — because that's the most common shape 'character profile' takes across writing guides and templates in its training data, and that shape is genuinely unhelpful for a working novelist because most of those fields don't constrain how the character behaves in any specific scene. Forcing the profile to be organized around a stated want-versus-need gap does two things a flat trait list can't: it gives the model (and the writer) a testable prediction for how the character should behave in any new scene — check what they'd do if want and need pulled in different directions — and it prevents the common flattening where a model-generated character has consistent traits but no actual internal tension, which is what makes fictional characters feel inert rather than alive. The instruction to show how the wound 'leaks out' unconsciously, as a tell rather than a confession, pushes back against the model's tendency to have characters explain their own psychology in dialogue or narration, which is a frequent tell of AI-assisted or amateur characterization — real subtext shows up in behavior a character themselves would deny, not in self-aware statements. Explicitly refusing to resolve the contradiction in the profile matters because a model asked to build out a character will often, helpfully, also imply how their arc concludes — which pre-empts the writer's own plotting and can flatten the tension the profile was built to preserve for the actual story.`,
    exampleOutput: `Want vs. Need: He wants the protagonist's endorsement of his continued relevance in the field; he needs to stop needing anyone's endorsement at all, and to trust his own judgment even when it's wrong. The Crack Point: pressed privately, in a room with no audience, by someone who was there for the original humiliation and never mentions it — he'll fill the silence himself...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-character-arc-internal-external-alignment',
    category: 'writing',
    title: `Map a character's transformation arc so the internal change and the external plot actually cause each other`,
    description: `Builds a full character arc across your story's structure, checking at each act break that what the character believes and what the plot demands of them are locked together, not running on separate tracks.`,
    promptText: `You are mapping a character arc across the full length of a story — the point is not just naming the start and end states, but making sure the external plot is what forces the internal change at each stage, rather than the two running in parallel without touching.

CHARACTER
{{character_name}}

STARTING FLAW OR LIE THEY BELIEVE
{{starting_flaw_or_lie}}

EXTERNAL GOAL THEY'RE PURSUING
{{external_goal}}

STORY LENGTH / STRUCTURE
{{story_length_or_structure}}

DESIRED ENDING STATE
{{ending_state}}

For each major structural checkpoint in {{story_length_or_structure}}, state three things: what the character believes at this point, what the plot event forces them to confront, and how the confrontation changes (or fails to change) the belief. At the first checkpoint, the external goal and the internal lie should be compatible — the character can pursue the goal while still believing the lie, which is why the story hasn't forced the issue yet. At the midpoint, introduce a plot event that makes pursuing the external goal and holding onto the lie mutually exclusive for the first time — this is what should force visible strain, not just raised stakes. At the low point, the character should make a choice that is a direct consequence of still holding onto the old belief under pressure, and it should cost them something concrete tied to the external goal. At the climax, the character's changed belief (or their refusal to change) should be what determines the external outcome — not a separate plot mechanism resolving things while the internal arc is merely commented on alongside it.

WHAT NOT TO DO
Do not write an arc where the character simply 'learns a lesson' through realization alone, disconnected from a plot consequence forcing it — insight without cost reads as unearned. Do not have the ending state arrive through exposition or a character stating what they've learned; it should be visible in the choice they make at the climax.

OUTPUT FORMAT
A table or list with one row per structural checkpoint: Belief / Plot Pressure / Resulting Change (or resistance). Close with one paragraph on how the climax choice demonstrates the arc's completion (or deliberate incompletion, if the arc is tragic).`,
    variables: [
      {
        name: 'character_name',
        description: `The character whose arc is being mapped.`,
        example: `Dara`,
        required: true,
      },
      {
        name: 'starting_flaw_or_lie',
        description: `What the character wrongly believes at the start.`,
        example: `She believes that needing help from anyone is a form of failure she can't afford to be seen having.`,
        required: true,
      },
      {
        name: 'external_goal',
        description: `The concrete, plot-level thing the character is pursuing.`,
        example: `Rebuild her family's failing restaurant before the bank forecloses in four months.`,
        required: true,
      },
      {
        name: 'story_length_or_structure',
        description: `The scale and structural shape of the story this arc runs across.`,
        example: `Feature-length screenplay, standard three-act structure.`,
        required: true,
      },
      {
        name: 'ending_state',
        description: `What you want to be true about the character by the end.`,
        example: `She's able to ask for and accept help without treating it as proof she's failed.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`character-arc`, `story-structure`, `screenwriting`, `fiction-writing`, `creative-writing`],
    whyItWorks: `A generic request for a 'character arc' pulls GPT-5.1 toward a well-known but shallow template — belief at the start, belief at the end, a sentence in between gesturing at 'growth' — because that's the level of detail at which arcs are usually discussed in writing guides, without the connective machinery of exactly which plot event forces which internal shift. Requiring belief, plot pressure, and resulting change to be stated at every structural checkpoint forces the model to commit to a causal claim at each stage rather than a summary one, which surfaces the gap most quickly at the midpoint, where models left unconstrained tend to simply escalate the external stakes of the existing goal rather than making the goal and the belief actively incompatible — the explicit instruction to make them mutually exclusive at the midpoint is what produces a turn rather than an intensification. The low-point instruction — that the character's choice must be a direct consequence of the old belief, and must cost something tied to the external goal — targets a specific and common weak arc where a character 'hits bottom' through outside misfortune rather than through their own flaw, which makes the eventual change feel unearned because the character didn't actually cause their own crisis. Requiring the climax choice to determine the external outcome, rather than running alongside it, is the single most important constraint here: it's very easy for a model to write a satisfying internal realization in one paragraph and a satisfying plot resolution in the next without making the first one cause the second, and readers register that gap as a story where the character's growth 'didn't matter' to what actually happened.`,
    exampleOutput: `Midpoint: Dara is offered the exact loan that would save the restaurant, on the condition that her estranged brother co-signs — meaning the rescue itself now requires the one form of help she's spent the story refusing. Low point: rather than ask him, she takes a predatory short-term loan instead, believing it preserves her independence; it doesn't, and the terms accelerate the foreclosure timeline she was trying to avoid...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-dialogue-scene-subtext-distinct-voices',
    category: 'writing',
    title: `Write a dialogue-driven scene where what's said and what's meant are two different things`,
    description: `Produces a scene told almost entirely through dialogue between two distinct voices, where the real conflict runs underneath a surface conversation about something else.`,
    promptText: `You are writing a scene told almost entirely through dialogue between two characters — the real conflict between them should run underneath a surface conversation that's ostensibly about something else.

CHARACTERS AND RELATIONSHIP
{{characters_and_relationship}}

WHAT EACH CHARACTER WANTS FROM THIS CONVERSATION
{{scene_goal_for_each}}

SURFACE TOPIC (what they're literally discussing)
{{surface_topic}}

THE REAL CONFLICT (what it's actually about)
{{real_conflict}}

TARGET LENGTH
{{scene_length}}

WHAT NOT TO DO (read this before drafting)
Do not have either character state the real conflict directly, especially not near the end as a summarizing confession — the scene fails if it resolves into someone saying the subtext out loud. Do not use dialogue tags beyond 'said' except where genuinely necessary for clarity — no 'she exclaimed,' 'he retorted,' 'she said pointedly'; if the line needs an adverb to land, rewrite the line instead. Do not give both characters the same speech rhythm — if you can't tell who's speaking with the tags removed, the voices aren't distinct enough. Do not let either character be purely right or purely reasonable; the surface disagreement should be genuinely arguable from both sides even though the real conflict underneath is not symmetrical.

HOW TO BUILD IT
Write the surface topic as a real, specific disagreement — not a thin pretext, an actual point of friction that would exist between these two people independent of the deeper issue. Let the real conflict surface only through what each character avoids saying, what they overreact to relative to the stated topic, and where the conversation keeps almost turning toward the real thing before one of them redirects it — deliberately or not. Use action beats and small physical detail sparingly, only where they carry information dialogue alone can't (a pause, a look away, an unanswered question left hanging).

OUTPUT FORMAT
1. The scene, at target length, dialogue-forward with minimal tags and beats.
2. A one-line note on the exact line or moment where the real conflict comes closest to the surface without breaking through.`,
    variables: [
      {
        name: 'characters_and_relationship',
        description: `Who's in the scene and how they relate to each other.`,
        example: `Two adult sisters, Priya and Nell, three years after their mother's death and a fight over the estate they never fully resolved.`,
        required: true,
      },
      {
        name: 'scene_goal_for_each',
        description: `What each character is actually trying to get out of this specific conversation.`,
        example: `Priya wants Nell to agree to sell their mother's house; Nell wants Priya to admit she's selling it because she can't stand being in it, not because it's 'practical.'`,
        required: true,
      },
      {
        name: 'surface_topic',
        description: `The literal, stated topic of the conversation.`,
        example: `Whether to accept a specific cash offer on the house versus listing it and waiting for a better one.`,
        required: true,
      },
      {
        name: 'real_conflict',
        description: `What the conversation is actually about underneath.`,
        example: `Priya has never forgiven Nell for not being there in their mother's final weeks, and the house has become a proxy for that unresolved resentment.`,
        required: true,
      },
      {
        name: 'scene_length',
        description: `Target length for the scene.`,
        example: `600-800 words.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`dialogue-writing`, `subtext`, `fiction-writing`, `screenwriting`, `creative-writing`],
    whyItWorks: `GPT-5.1's default dialogue-writing pattern leans toward resolution and clarity — characters tend to arrive, by the end of a scene, at stating plainly what they feel, because that produces a satisfying-feeling close and mirrors how conflicts are typically resolved in explanatory prose, but it's exactly wrong for subtext-driven scenes, where the tension is supposed to remain unspoken and the reader does the work of inferring it. Explicitly banning a direct statement of the real conflict, especially near the end, closes off the model's most natural exit ramp and forces it to keep the scene running on the surface topic, which is where genuine subtext-driven dialogue actually lives. The ban on adverbial dialogue tags targets a specific, well-documented model habit — reaching for 'she said sharply' or 'he retorted' to convey emotional tone that the dialogue itself should be carrying — which is treated as a craft weakness in most professional style guides precisely because it lets the writer (or model) skip the harder work of making the line itself carry the tone through word choice and rhythm. Requiring distinct, tag-removable voices matters because models writing two characters in the same scene tend to converge both toward a similar 'neutral competent dialogue' register unless explicitly told to differentiate rhythm and vocabulary, which is checkable by the specific test given here — read it with the tags stripped and see if you can still tell who's talking. Finally, requiring the surface disagreement to be genuinely arguable from both sides, not a thin pretext, prevents the common failure where the ostensible topic feels obviously fake and the reader sees straight through to the 'real' conflict immediately, which collapses the layering the scene is built on.`,
    exampleOutput: `"It's forty thousand under what the Hendersons offered in March." "The Hendersons wanted to gut it. This buyer's keeping the kitchen." "Since when do you care what happens to the kitchen." Nell didn't answer that. Priya waited a beat too long before adding, "I just think we should get what it's worth."`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-scene-goal-conflict-disaster',
    category: 'writing',
    title: `Draft one scene using goal-conflict-disaster instead of a string of things happening`,
    description: `Writes a single scene structured around a concrete scene-level goal, real opposition, and a setback, grounded in specific sensory detail rather than generic description.`,
    promptText: `You are drafting a single scene from a story. Structure it around goal, conflict, and disaster — not a sequence of events that happen one after another without a driving question.

POV CHARACTER
{{pov_character}}

WHAT THE POV CHARACTER WANTS IN THIS SCENE SPECIFICALLY
{{scene_goal}}

WHAT'S STANDING IN THE WAY
{{opposition}}

SETTING AND SENSORY ANCHOR
{{setting_sensory_detail}}

TARGET LENGTH
{{scene_length_target}}

Before drafting, confirm the scene-level goal is concrete and achievable-or-failable within this one scene — not a book-length goal restated, but something specific the character could plausibly get or not get before the scene ends. Open the scene already in motion toward that goal, skipping arrival and setup. Let the opposition in {{opposition}} act with its own logic — it should be actively working against the goal, not passively present as an obstacle the character simply pushes past. Ground the scene in the sensory anchor given, but sparingly: one or two specific, concrete details woven into the action, not a paragraph of standalone description before anything happens. End the scene on a disaster relative to the stated goal — the character does not get what they wanted, or gets it in a way that creates a worse problem than the one they started with; a scene that simply achieves its goal cleanly has nowhere to go and kills momentum for whatever comes next.

WHAT NOT TO DO
Do not resolve the scene's tension in the character's favor without complication — a clean win is rarely dramatically useful mid-story. Do not let the scene wander into unrelated exposition or backstory; if it doesn't serve the goal-conflict-disaster spine, cut it.

OUTPUT FORMAT
1. The scene at target length.
2. One line stating the specific disaster and what new problem it creates going forward.`,
    variables: [
      {
        name: 'pov_character',
        description: `Whose point of view the scene is told from.`,
        example: `Tomas, a junior surgeon.`,
        required: true,
      },
      {
        name: 'scene_goal',
        description: `The specific, scene-scale thing the character wants.`,
        example: `Convince the attending surgeon to let him perform the incision himself for the first time.`,
        required: true,
      },
      {
        name: 'opposition',
        description: `What is actively working against that goal, with its own logic.`,
        example: `The attending, who has legitimate reasons to be cautious after a resident's error last month cost the hospital a malpractice claim.`,
        required: true,
      },
      {
        name: 'setting_sensory_detail',
        description: `The scene's location and one or two grounding sensory details.`,
        example: `Pre-op scrub room, the smell of surgical soap, the fluorescent hum, cold water running longer than it needs to.`,
        required: true,
      },
      {
        name: 'scene_length_target',
        description: `Target length for the scene.`,
        example: `500-700 words.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`scene-writing`, `fiction-writing`, `creative-writing`, `narrative-craft`, `story-structure`],
    whyItWorks: `Left to its own devices, GPT-5.1 tends to write scenes as a sequence of plausible actions loosely connected by 'and then,' because without an explicit driving question a scene has no internal test for what belongs in it and what doesn't — goal-conflict-disaster (a structure from the Dwight Swain school of scene craft) gives the model a concrete filter: every line either advances the stated goal, embodies the opposition, or sets up the disaster, and anything else is noise. Requiring the goal to be scene-scale and achievable-or-failable within the scene, rather than a restatement of the character's book-length ambition, matters because an underspecified goal produces a scene with no real tension to track — the reader (and the model generating the prose) has nothing concrete to be uncertain about. Instructing the opposition to act with its own logic rather than as a passive obstacle addresses a frequent weak-scene pattern where the antagonist or obstacle exists only to be overcome, with no legitimate reasoning of its own — scenes read as more genuinely tense when the opposing force has a real, defensible position, which is why the example asks for the attending's caution to be grounded in a specific prior incident rather than generic authority-figure resistance. The instruction to end on disaster rather than a clean win directly counters GPT-5.1's tendency toward satisfying, resolved endings even at the scene level, which is appropriate for a scene that closes out a story but actively undermines momentum mid-narrative — a scene that gives the character exactly what they wanted removes the question that was supposed to pull the reader into the next one.`,
    exampleOutput: `"You're not ready," Dr. Ansari said, not unkindly, already turning back toward the sink. Tomas kept his hands under the water a beat longer than necessary, the cold finally starting to bite. "I've done forty of these in sim." "Sim doesn't bleed." She handed him the retractor instead of the scalpel, which was, he understood slowly, its own kind of answer...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-plot-twist-foreshadowed-not-predictable',
    category: 'writing',
    title: `Engineer a plot twist that recontextualizes earlier scenes instead of coming out of nowhere`,
    description: `Takes a planned twist and your story so far, then works backward to identify exactly where and how to plant fair foreshadowing that reads as inevitable in hindsight without giving the twist away early.`,
    promptText: `You are helping engineer a plot twist so that it recontextualizes what came before rather than either being predictable or feeling like a cheat.

CURRENT PLOT SUMMARY SO FAR
{{current_plot_summary}}

PLANNED TWIST
{{planned_twist}}

SCENES ALREADY WRITTEN (that can't be changed)
{{scenes_already_written}}

WHERE THE TWIST REVEALS
{{twist_reveal_point}}

TONE
{{tone}}

RULES
First, check the twist against the scenes already written for outright contradiction — flag anything already on the page that the twist would directly contradict (not just fail to support), since that's a hard blocker, not a foreshadowing opportunity. Then identify two or three places in the existing scenes where a detail is currently neutral or throwaway but could be read, after the twist lands, as having meant something different all along — the goal is a detail a reader would go back and reread with a different meaning, not a detail so pointed it gives the game away on a first read. For anything not yet written between now and the reveal point, propose one or two additional beats that plant fair evidence — visible enough that a rereading reader can find it, disguised enough that a first-time reader reasonably reads past it by attaching it to a more obvious, plausible explanation. State explicitly, for each planted clue, what the plausible 'cover' explanation is that a first-time reader would land on instead of the truth.

WHAT NOT TO DO
Do not propose foreshadowing so heavy-handed that an attentive reader would call the twist on a first read — a twist that's obvious in advance isn't a twist. Do not propose changing anything in the already-written scenes; work only with what's there and what comes after.

OUTPUT FORMAT
1. Any contradiction flags against existing scenes.
2. Existing details that gain new meaning after the twist, with the reread-meaning stated.
3. New beats to plant before the reveal, each with its cover explanation.
4. A one-line gut check on whether the reveal point still lands as a surprise given everything above, or reads as over-signposted.`,
    variables: [
      {
        name: 'current_plot_summary',
        description: `Where the story currently stands.`,
        example: `A detective is investigating a series of burglaries at a research lab, working alongside a lab technician who's been unusually helpful with access and records.`,
        required: true,
      },
      {
        name: 'planned_twist',
        description: `The twist you intend to reveal.`,
        example: `The helpful lab technician is the one committing the burglaries, using her cooperation with the investigation to track exactly what the detective has found.`,
        required: true,
      },
      {
        name: 'scenes_already_written',
        description: `A summary of scenes already on the page, which can't be retroactively changed.`,
        example: `Three scenes: the technician reporting a break-in, the technician handing over security footage (with one hallway camera conveniently 'malfunctioning'), and the technician expressing sympathy for the detective's slow progress.`,
        required: true,
      },
      {
        name: 'twist_reveal_point',
        description: `Where in the story the twist is meant to be revealed.`,
        example: `End of Act 2, roughly 65% through.`,
        required: true,
      },
      {
        name: 'tone',
        description: `The tonal register the story is aiming for.`,
        example: `Grounded procedural, not pulpy — the reveal should feel earned rather than theatrical.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`plot-twist`, `foreshadowing`, `mystery-writing`, `story-structure`, `creative-writing`],
    whyItWorks: `GPT-5.1 is capable of generating a plausible twist and capable of generating plausible foreshadowing for it, but it doesn't automatically check the two against each other for the specific failure mode that ruins most amateur twists: foreshadowing planted in isolation tends to either give too much away (because the model, knowing the answer, writes clues that are obvious in hindsight-aware terms) or contradict existing material it wasn't explicitly checked against. Requiring an explicit contradiction check against the already-written scenes first addresses the more serious of the two risks, because a twist that technically doesn't fit what's already on the page is a worse failure than weak foreshadowing — readers forgive an under-clued twist more readily than one that required something earlier to have not been true. The instruction to identify a 'cover explanation' for every planted clue is the mechanism that actually produces fair-play foreshadowing rather than either over-signposting or pure retcon: a clue only works if a first-time reader has a more plausible, more obvious reason to read past it than the truth, and asking the model to state that alternative explanation explicitly forces it to check that the clue is genuinely deniable on a first read, not just technically present. This matters because models asked simply to 'add foreshadowing' tend to plant detail that's neutral to a first-time reader but also neutral in hindsight — it doesn't reread as meaningful, so it doesn't deliver the 'oh, of course' feeling twists are supposed to produce — whereas a clue with a named cover story is far more likely to gain retroactive weight specifically because it was disguised as something else, not just background noise.`,
    exampleOutput: `The malfunctioning hallway camera already on the page can be reread, after the twist, as her disabling the one angle that would have shown her own badge swipe at the wrong hour — cover explanation for a first-time reader: lab security systems are established elsewhere as generally unreliable, so one more glitch reads as institutional incompetence, not sabotage...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-worldbuilding-bible-story-driven-not-encyclopedic',
    category: 'writing',
    title: `Build a worldbuilding bible section that answers only what your story actually needs, not an encyclopedia nobody asked for`,
    description: `Develops one focused area of a fictional world in enough depth to support the story, while explicitly deciding what to leave undeveloped so the world serves the plot instead of sprawling past it.`,
    promptText: `You are developing one section of a worldbuilding bible for a fiction project. The goal is depth exactly where the story needs it, not exhaustive coverage of everything a world could theoretically have.

WORLD TYPE
{{world_type}}

STORY PREMISE THIS WORLD SUPPORTS
{{story_premise}}

WORLDBUILDING FOCUS AREA FOR THIS PASS
{{worldbuilding_focus_area}}

WHAT READERS WILL ACTUALLY SEE ON THE PAGE
{{what_readers_will_see}}

TONE
{{tone}}

PHASE 1 — Anchor to story need
Before inventing anything, state what specific story problem or scene this focus area needs to support — a worldbuilding detail that doesn't serve a scene, a character's constraint, or the plot's central tension is scope creep, however interesting it is on its own.

PHASE 2 — Build with internal logic
Develop {{worldbuilding_focus_area}} with enough internal cause-and-effect that it would survive a reader asking 'why' twice — not just what the rule or institution is, but what produced it and what it costs someone to live under it. Favor specificity that implies a larger world (a named local custom, a specific friction point) over broad, encyclopedia-style summary that explains everything and implies nothing.

PHASE 3 — Decide what stays off the page
Explicitly list two or three adjacent worldbuilding questions this focus area raises that you are deliberately NOT resolving in this pass, and why leaving them open serves the story better than answering them now — unresolved texture often reads as a bigger world than a fully-mapped one does.

WHAT NOT TO DO
Do not produce a lore-dump structured as an encyclopedia entry with no connection back to {{what_readers_will_see}} — if a detail wouldn't change a single scene, it doesn't belong in this pass. Do not resolve every internal contradiction or edge case; real institutions and cultures have unresolved tensions, and a worldbuilding element that's too neatly self-consistent can read as artificial.

OUTPUT FORMAT
1. The story-need anchor from Phase 1.
2. The developed worldbuilding content from Phase 2, organized under clear subheadings.
3. The deliberately-unresolved list from Phase 3.`,
    variables: [
      {
        name: 'world_type',
        description: `The broad category of setting.`,
        example: `Secondary-world fantasy, low magic, roughly early-industrial technology level.`,
        required: true,
      },
      {
        name: 'story_premise',
        description: `The story this world needs to support.`,
        example: `A city where water rights are controlled by a hereditary guild, and the protagonist is a smuggler moving illegal water access to unlicensed farms.`,
        required: true,
      },
      {
        name: 'worldbuilding_focus_area',
        description: `The specific area to develop in this pass.`,
        example: `The water guild's licensing system and how ordinary people experience and resent it.`,
        required: true,
      },
      {
        name: 'what_readers_will_see',
        description: `What of this worldbuilding will actually surface on the page.`,
        example: `A scene where the protagonist has to forge a water-rights seal convincingly enough to pass a checkpoint guard who's seen a hundred real ones.`,
        required: true,
      },
      {
        name: 'tone',
        description: `The tonal register of the world.`,
        example: `Grounded and bureaucratic rather than mystical — magic and myth are background, institutional pettiness is foreground.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`worldbuilding`, `fantasy-writing`, `fiction-writing`, `creative-writing`, `story-development`],
    whyItWorks: `Asked to 'build a world,' GPT-5.1 tends toward breadth-first, encyclopedia-style output — a bit of geography, a bit of history, a bit of religion, a bit of politics, each covered shallowly — because that mirrors how worldbuilding is often presented in wikis and guides, but it's close to useless for an actual writer, since most of that content will never touch a page and dilutes attention away from the one area the story actually needs developed in depth. Anchoring the pass to a stated story need before any content is generated is the single biggest lever here: it converts an open-ended creative task into a targeted one, and it gives a concrete test for scope creep — if a detail doesn't trace back to the stated scene or constraint, it shouldn't have been generated in the first place, rather than being generated and left for the writer to sort through afterward. The instruction to develop with internal cause-and-effect ('survive a reader asking why twice') pushes against the model's tendency to state worldbuilding facts as flat assertions — 'the guild controls water rights' — without the causal history that makes an institution feel real rather than declared; specificity that implies more of the world (a named local custom, a friction point) reads as authored, while broad summary reads as generated, and that distinction is often what separates worldbuilding that serves fiction from worldbuilding that serves a wiki page. Requiring an explicit list of deliberately unresolved adjacent questions matters because models default toward completeness and internal consistency when asked to build something, but real institutions have unaddressed edge cases and open tensions, and a world with none of those reads as artificially tidy — naming what's intentionally left open is what keeps the world from over-explaining itself.`,
    exampleOutput: `Story-need anchor: the protagonist's forged seal needs to be convincing enough to pass a checkpoint, which means the licensing system needs a specific, learnable visual/procedural signature a forger could study and almost-but-not-quite replicate. Deliberately unresolved: how the guild originally acquired water rights generations ago is left vague — a matter of competing oral histories the story doesn't need to adjudicate...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-fantasy-world-hard-magic-system-costs-limits',
    category: 'writing',
    title: `Design a magic system with real costs and limits so it can't quietly solve every plot problem`,
    description: `Builds a magic system defined primarily by what it costs and cannot do, so it functions as a source of story tension rather than a convenient way out of any obstacle the plot creates.`,
    promptText: `You are designing a magic system for a fantasy story. Define it primarily by its costs and hard limits — what it can do is the least important part of this design; what it can't do, and what using it costs the user, is what actually generates story tension.

SOURCE OF MAGIC
{{magic_source}}

WHO CAN USE IT AND HOW COMMON THAT IS
{{user_population}}

THE COST OR LIMIT YOU WANT AT THE CENTER OF THE SYSTEM
{{cost_or_limit}}

STORY CONFLICT THIS MAGIC MUST NOT BE ABLE TO TRIVIALIZE
{{story_conflict_it_must_not_trivialize}}

TONE
{{tone}}

RULES
Start from the cost, not the power — describe what using this magic actually takes from the user (physical, material, social, or moral) before describing what it lets them do, since a system built power-first tends to accumulate abilities that quietly undercut the plot later. Stress-test the system directly against {{story_conflict_it_must_not_trivialize}}: explicitly check whether a resourceful character with access to this magic could solve or bypass that conflict, and if so, tighten the limit until they genuinely can't — a magic system that can solve your plot's central problem needs to be constrained until it can't, not written around after the fact. Make the limit specific and mechanical enough that a reader could predict, in a new situation, whether the magic would work or fail — vague limits ('it's dangerous,' 'it takes a toll') don't hold up under a story's pressure the way a concrete one does ('it ages the user visibly, permanently, in proportion to how far into the future they see'). State who, within the world, would rationally choose not to use this magic even though they could, and why — a cost that nobody in-world takes seriously isn't really a cost.

WHAT NOT TO DO
Do not describe the system's upper limits in vague terms like 'immense power' or 'nearly limitless' — name the actual ceiling. Do not let the cost be something the story can simply route around with enough resources (a healing spell that undoes the cost, for instance) unless that workaround itself creates a new cost worth writing about.

OUTPUT FORMAT
1. Source and mechanism.
2. The core cost/limit, stated mechanically and specifically.
3. The stress test against the named story conflict, and how the limit was tightened if it initially failed the test.
4. Who chooses not to use it, and why.`,
    variables: [
      {
        name: 'magic_source',
        description: `Where the magic comes from.`,
        example: `Drawn from the user's own memories — casting requires giving up a real, specific memory as fuel.`,
        required: true,
      },
      {
        name: 'user_population',
        description: `Who can use this magic and how rare that is.`,
        example: `Roughly one in five thousand people can do it at all, and most who can never train it beyond minor uses.`,
        required: true,
      },
      {
        name: 'cost_or_limit',
        description: `The central cost or hard limit you want the system built around.`,
        example: `The bigger the effect, the more significant a memory has to be sacrificed — and the loss is permanent and irreversible.`,
        required: true,
      },
      {
        name: 'story_conflict_it_must_not_trivialize',
        description: `The plot conflict this magic must not be able to simply solve.`,
        example: `The protagonist needs to find her missing sister across a hostile border; the magic must not make this a trivial locate-and-teleport problem.`,
        required: true,
      },
      {
        name: 'tone',
        description: `Tonal register for the system.`,
        example: `Melancholic and personal rather than epic — magic should feel like grief, not spectacle.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`worldbuilding`, `magic-system`, `fantasy-writing`, `creative-writing`, `story-development`],
    whyItWorks: `Asked to design a magic system, GPT-5.1 tends to generate an interesting source and mechanism first and treat limitations as an afterthought bolted on at the end ('but it's very draining'), because power and mechanism are the more generative, more colorful part of the design space, while genuine constraint requires actively working against the model's tendency to make its own creation impressive — leading with the cost instead inverts that default and produces a system that's load-bearing for story tension rather than merely decorative. The explicit stress test against a named plot conflict is the mechanism that catches the single most common hard-magic-system failure in amateur fantasy writing: a system that seems appropriately limited in the abstract turns out, the moment it's checked against the story's actual central problem, to trivially solve it — because the author (or model) designed the system and the plot separately and never checked them against each other. Requiring the limit to be mechanically specific rather than a vague gesture at danger or toll matters because vague costs are the ones writers (and models) quietly forget to apply consistently in later scenes — a concrete, checkable rule like memory-loss scaled to effect size can be applied predictably scene to scene, while 'it's exhausting' can be waived whenever it's inconvenient to the plot. Naming who would rationally choose not to use the magic despite being able to is a specific test for whether the cost is real within the fiction's own logic — if every character in the world would obviously use this magic constantly regardless of the stated cost, the cost hasn't actually been designed with enough weight, which is a subtler failure mode than an absent cost but produces the same trivializing effect over the course of a story.`,
    exampleOutput: `Stress test: could the protagonist simply burn a minor memory to magically locate her sister across the border? Tightened limit: the spell doesn't locate a person, it only recalls a specific place tied to a specific shared memory as it existed at the time of that memory — meaning she can only 'find' places she and her sister have already been together, and only as they were then, forcing her to reconstruct where her sister might realistically go rather than simply being handed an answer...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-scifi-world-tech-causal-extrapolation',
    category: 'writing',
    title: `Extrapolate one speculative technology into a whole society with the second- and third-order effects worked out`,
    description: `Takes a single core piece of speculative technology and works out its full ripple of social, economic, and political consequences, rather than a setting that only shows the technology's surface novelty.`,
    promptText: `You are extrapolating one core speculative technology into a fully worked-out society for a science fiction story — the point is the chain of consequences the technology sets off, not just describing the technology itself.

CORE TECHNOLOGY
{{core_technology}}

POINT OF DIVERGENCE / ERA
{{point_of_divergence_era}}

WHO BENEFITS AND WHO IS LEFT BEHIND
{{who_benefits_who_is_left_behind}}

STORY FOCUS (what part of this society the plot actually needs)
{{story_focus}}

TONE
{{tone}}

PHASE 1 — First-order effects
State the immediate, obvious consequences of {{core_technology}} existing — what changes directly and quickly for the people who have access to it.

PHASE 2 — Second-order effects
Work out what those first-order changes cause in turn, once people, institutions, and markets have had time to adapt and route around them — new incentives, new inequalities, new forms of regulation or black market, new social behaviors that wouldn't have made sense before the technology existed. This is where most extrapolation stops too early; push at least one level further than the obvious.

PHASE 3 — Third-order effects and friction points
Go one step further: what does a generation raised entirely inside the second-order world take completely for granted that an outsider or an earlier generation would find strange or alarming? Identify at least one specific friction point where the technology's benefits and its costs are unevenly distributed, tied to {{who_benefits_who_is_left_behind}}, concrete enough to generate a scene.

PHASE 4 — Focus for the story
Of everything developed above, identify exactly what {{story_focus}} actually needs on the page, and note the rest as background the story can reference lightly without needing to explain in full.

WHAT NOT TO DO
Do not stop at first-order effects dressed up as worldbuilding — a society where the only visible change is 'now everyone has flying cars' isn't extrapolation, it's set dressing. Do not make every character equally benefited by the technology; uneven distribution is what makes speculative technology dramatically interesting rather than merely futuristic-looking.

OUTPUT FORMAT
Four clearly labeled sections matching Phases 1-4 above, each concrete and specific rather than abstract.`,
    variables: [
      {
        name: 'core_technology',
        description: `The one central speculative technology.`,
        example: `Cheap, reliable memory-transfer technology that lets a person's skill-memories (not full identity) be copied into another person's brain.`,
        required: true,
      },
      {
        name: 'point_of_divergence_era',
        description: `When and in what kind of society this technology emerged.`,
        example: `Introduced roughly 40 years before the story's present, in a setting otherwise close to contemporary developed-world infrastructure.`,
        required: true,
      },
      {
        name: 'who_benefits_who_is_left_behind',
        description: `The uneven distribution of the technology's effects.`,
        example: `Licensed professionals (surgeons, pilots) whose employers pay for transfers; unlicensed laborers who can't afford it and are increasingly locked out of skilled work entirely.`,
        required: true,
      },
      {
        name: 'story_focus',
        description: `What part of this world the actual story needs developed in depth.`,
        example: `A black market where illegally copied skill-memories are sold to unlicensed workers, and what happens when a botched transfer leaves someone with fragments of a stranger's memories.`,
        required: true,
      },
      {
        name: 'tone',
        description: `Tonal register.`,
        example: `Grounded near-future social realism, not action-adventure.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`worldbuilding`, `science-fiction`, `speculative-fiction`, `creative-writing`, `story-development`],
    whyItWorks: `GPT-5.1 is reliably good at generating first-order effects of a speculative technology — the immediate, obvious consequences are the most heavily represented pattern in science fiction writing and analysis it's seen — but it stops there more often than not unless explicitly pushed, because second- and third-order effects require simulating how institutions, markets, and social norms adapt over time, which is a harder, less pattern-matched reasoning chain than describing the technology's direct use. Structuring the request as an explicit phase sequence (first-order, then second-order, then third-order) forces the extrapolation past the point where most AI-generated worldbuilding stops — the phase 2 instruction to consider new black markets, new regulation, and new incentive structures targets specifically what separates memorable science fiction worldbuilding from technology that's just described as existing without changing anything structural about the society around it. The phase 3 instruction — what would a generation raised inside this world take for granted — is a specific technique for surfacing worldbuilding detail that reads as authentically lived-in rather than externally described, because it forces a shift in narrative distance from an outside observer cataloguing a technology to an inside perspective for which the technology is unremarkable background, which is closer to how real people actually experience the technologies that shape their lives. Requiring uneven distribution between who benefits and who's left behind, tied to a concrete friction point, is what keeps the extrapolation dramatically useful rather than merely clever — a technology that benefits everyone equally generates description, but a technology that creates winners and losers generates the specific kind of tension a plot can be built on, and naming that friction point concretely (rather than gesturing at 'inequality' abstractly) is what makes it usable in an actual scene.`,
    exampleOutput: `Third-order: the generation that grew up entirely under the licensing system doesn't experience 'not having a transferred skill' as a lack — it experiences it as a caste marker, visible in small unconscious ways (which hand you favor for fine motor tasks, which questions you hesitate on) that licensed professionals have stopped noticing they're reading in others...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-mystery-plot-fair-play-clue-ledger',
    category: 'writing',
    title: `Construct a fair-play mystery plot where an attentive reader could solve it, but almost nobody does`,
    description: `Builds a mystery plot with a clue ledger tracking exactly what's genuine evidence, what's a red herring, and what misdirection is doing the work of hiding the solution in plain sight.`,
    promptText: `You are constructing a fair-play mystery plot — one where the solution is genuinely deducible from clues available to the reader, but where misdirection makes it unlikely most readers actually get there first.

CRIME AND VICTIM
{{crime_and_victim}}

DETECTIVE OR INVESTIGATING POV
{{detective_or_pov}}

TRUE CULPRIT AND REAL MOTIVE
{{culprit_and_true_motive}}

NUMBER OF RED HERRINGS
{{red_herring_count}}

SETTING
{{setting}}

STEP 1 — Work backward from the solution
Starting from {{culprit_and_true_motive}}, identify every piece of physical evidence, testimony, or behavior that would genuinely exist in this scenario as a direct consequence of what actually happened — this is the pool of fair clues, and every one of them must be something the culprit could not have avoided leaving behind given how the crime was actually committed.

STEP 2 — Build the clue ledger
For every fair clue identified in Step 1, decide how it will be presented to the reader: in plain sight but misattributed to a different suspect, buried among unrelated detail so its significance isn't obvious on first encounter, or stated accurately but interpreted incorrectly by the POV character in a way the reader is likely to accept. For each of {{red_herring_count}} red herrings, build one that points toward a different, innocent suspect who has a genuine, plausible-looking reason to have done it — a red herring only works if the wrong suspect actually looks guilty on their own merits, not just coincidentally present.

STEP 3 — Fairness audit
Check the full ledger against one rule: could a reader who correctly noticed and correctly interpreted every fair clue arrive at the true solution using only information given on the page, without requiring a fact revealed for the first time in the final reveal? Flag anything that fails this test, since a mystery that depends on withheld information isn't fair-play, it's a trick.

OUTPUT FORMAT
1. The clue ledger: each fair clue, how it's presented/disguised, and where it appears in the story.
2. Each red herring and the innocent suspect it points to, with their plausible-looking reason.
3. The fairness audit result, including anything flagged and fixed.`,
    variables: [
      {
        name: 'crime_and_victim',
        description: `The crime and who it happened to.`,
        example: `A wealthy vineyard owner found dead after apparently falling from a cellar staircase; ruled accidental until the detective notices an inconsistency.`,
        required: true,
      },
      {
        name: 'detective_or_pov',
        description: `Who's investigating and whose perspective the reader follows.`,
        example: `A visiting wine critic who happened to be staying at the vineyard, an amateur with sharp observational instincts but no formal authority.`,
        required: true,
      },
      {
        name: 'culprit_and_true_motive',
        description: `Who actually did it and why, really.`,
        example: `The vineyard's longtime accountant, who had been quietly embezzling for years and killed the owner after being confronted, staging it to look like a fall.`,
        required: true,
      },
      {
        name: 'red_herring_count',
        description: `How many distinct red herrings to build.`,
        example: `3`,
        required: true,
      },
      {
        name: 'setting',
        description: `Where the story takes place.`,
        example: `An isolated vineyard estate in rural France during harvest season, with a small, closed circle of live-in staff and family.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`mystery-writing`, `plot-construction`, `fiction-writing`, `creative-writing`, `story-structure`],
    whyItWorks: `Asked to build a mystery, GPT-5.1 will readily generate a plausible-sounding solution and a set of clues, but without an explicit backward-construction step it tends to generate clues and solution somewhat independently, which is exactly how unfair mysteries happen — a clue that supports the solution only in retrospect, or a reveal that depends on a fact never actually shown to the reader, which is the single most common complaint against amateur mystery writing. Working backward from the solution and requiring every fair clue to be something the culprit 'could not have avoided leaving behind' forces logical consistency between what actually happened and what evidence exists, rather than generating evidence that merely sounds suggestive without a real causal link to the crime as committed. The instruction to build red herrings around suspects who look genuinely guilty on their own independent merits, not just coincidentally present, targets a specific weak-mystery pattern where misdirection relies purely on narrative suspicion-casting (a suspect acts nervous, for no clear reason) rather than the suspect having their own real, freestanding reason to look guilty — the latter is what makes a red herring satisfying to have been fooled by rather than annoying in hindsight. The final fairness audit — checking whether a reader who noticed and correctly interpreted every fair clue could reach the solution using only on-page information — is the mechanism that actually enforces the fair-play constraint, since it's a specific, checkable test rather than a vague aspiration to 'make it fair,' and running it as an explicit final pass catches the common case where an otherwise well-built mystery quietly depends on one piece of information that's only ever revealed in the final chapter.`,
    exampleOutput: `Fair clue: the accountant's ledger entries for the past two harvests show unusually round numbers in a business that never otherwise produces round numbers — presented on the page as a background detail the critic notices only because she happens to be numerically minded, not flagged as significant by the narrative itself. Red herring: the owner's estranged son, who inherits the estate and had a public argument with his father the week before...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-romance-plot-relationship-beats-internal-wound',
    category: 'writing',
    title: `Build a romance plot arc where the external relationship beats are driven by each character's internal wound`,
    description: `Maps a romance arc's key beats — meet, midpoint, black moment, resolution — so that each turn in the relationship is caused by what the two leads are individually afraid of, not just circumstance.`,
    promptText: `You are building a romance plot arc across its major beats, with the specific requirement that each relationship turn be caused by the characters' internal wounds, not by circumstance alone.

CHARACTER A'S WOUND
{{character_a_wound}}

CHARACTER B'S WOUND
{{character_b_wound}}

HOW THEY MEET
{{meet_context}}

CENTRAL EXTERNAL OBSTACLE
{{central_obstacle}}

ENDING TYPE
{{ending_type}}

MEET
Build the meeting in {{meet_context}} so that each character's first reaction to the other is filtered through their wound — not love at first sight in the abstract, but a specific, wound-colored read of the other person that will turn out to be at least partly wrong, and state what that misread is for each of them.

DEEPENING
As the relationship develops, choose one moment where {{central_obstacle}} could be sidestepped easily if either character simply said the true thing they're feeling — and have them not say it, specifically because of their wound, not because the plot needed to stall them. Name exactly what each is protecting by staying quiet.

MIDPOINT
Introduce a moment of real intimacy or trust that makes the relationship feel like it's working — then identify what about this exact success is what will make the coming crisis land harder, because it raises what each person now has to lose.

BLACK MOMENT
Build the low point as a direct consequence of the wound reasserting itself under pressure from {{central_obstacle}}, not as an external event that merely separates the characters by circumstance. State specifically what belief about themselves or about love each character reverts to at this point, and how it echoes their original wound.

RESOLUTION
Build the {{ending_type}} so that getting (or not getting) the other person requires each character to actually act against their original wound, not just have positive circumstances resolve around them — the internal change should be what makes the external ending possible.

WHAT NOT TO DO
Do not let a misunderstanding that either character could clear up in one honest sentence be the sole engine of the plot without a wound-based reason they wouldn't say that sentence. Do not resolve the wound through the other person's words alone — it should require the wounded character's own action to demonstrate the change.

OUTPUT FORMAT
Five labeled sections matching Meet / Deepening / Midpoint / Black Moment / Resolution, each concrete and scene-specific.`,
    variables: [
      {
        name: 'character_a_wound',
        description: `The first lead's core emotional wound.`,
        example: `Grew up as the reliable one in a chaotic family and equates being needed with being loved — terrified of being with someone who doesn't need her help.`,
        required: true,
      },
      {
        name: 'character_b_wound',
        description: `The second lead's core emotional wound.`,
        example: `Was left by a partner who said his independence was suffocating; now reflexively refuses help even when he badly needs it, to avoid ever being called a burden again.`,
        required: true,
      },
      {
        name: 'meet_context',
        description: `How and where they first meet.`,
        example: `She's a hospice social worker; he's the estranged son of one of her patients, back in town only to settle the estate.`,
        required: true,
      },
      {
        name: 'central_obstacle',
        description: `The main external thing standing between them.`,
        example: `He's leaving town in six weeks once the estate is settled, and has built his whole adult life around not staying anywhere.`,
        required: true,
      },
      {
        name: 'ending_type',
        description: `The kind of ending you want.`,
        example: `Happily ever after, but earned rather than convenient.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`romance-writing`, `story-structure`, `character-arc`, `fiction-writing`, `creative-writing`],
    whyItWorks: `GPT-5.1's default romance-plotting tends to sequence recognizable beats correctly — meet-cute, growing closeness, a misunderstanding, a breakup, a reconciliation — while leaving the connective tissue between beats largely circumstantial, because circumstance-driven plotting (a job transfer, a lie uncovered, a jealous rival) is easier to generate than psychologically caused plotting, which requires holding two separate internal wounds consistently across the whole arc and deriving each external beat from them. Explicitly requiring the meet, the deepening, the midpoint, and the black moment to each trace back to a named wound is what prevents the single most common weak-romance failure: the 'misunderstanding that one honest sentence would fix,' which readers register as an artificial plot device rather than real conflict, because there's no stated reason the character wouldn't just say the sentence — tying the silence explicitly to what the wound is protecting turns an arbitrary plot contrivance into psychologically motivated behavior. The midpoint instruction — that this exact intimacy is what makes the coming crisis land harder because it raises the stakes of loss — targets a subtler weakness where models write a midpoint high point and a subsequent black moment as separate beats without connecting what makes the fall matter more because of how high the high point was; naming that connection explicitly produces a more felt crisis rather than a merely sequenced one. Finally, requiring the resolution to be earned through the wounded character's own action rather than through the other person's words alone addresses a common soft-resolution pattern where one character 'convinces' the other to change through a speech — which resolves the plot mechanically but not psychologically, since real change in a wound-driven arc has to be demonstrated by the character choosing differently under the same kind of pressure that used to make them choose wrong.`,
    exampleOutput: `Black moment: when he finally, quietly asks for her help with something he can't manage alone — the first time in years he's asked anyone — she deflects into fixing it for him without being asked, exactly the pattern he fled the last time, and he reads her efficiency as proof he was right to never need anyone, not as the love it actually was...`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-horror-scene-cosmic-dread-escalation',
    category: 'writing',
    title: `Write a horror scene that earns its dread instead of front-loading the monster`,
    description: `Builds a single horror scene around a controlled escalation of wrongness — a mundane detail, a small deviation, then confirmation — so the fear comes from what the reader infers, not from an early reveal.`,
    promptText: `You are writing one self-contained horror scene (not a full story) for me. The goal is dread that builds through escalating small wrongness, not a monster or jump-scare dropped in on page one.

SETTING AND POV
{{setting_and_pov}}

WHAT IS ACTUALLY WRONG
{{true_threat}}

FIRST NOTICED DEVIATION
{{first_deviation}}

TARGET LENGTH
{{target_length}}

TONE REFERENCE
{{tone_reference}}

STRUCTURE RULES
Open in a state the reader would call normal or only mildly tense — do not open with anything already broken, since a scene that starts wrong has nowhere left to escalate to. Introduce the first deviation as something the point-of-view character could plausibly rationalize away (a draft, a trick of light, a misremembered detail) rather than something they immediately recognize as supernatural or dangerous — the rationalization itself is where the dread lives, not the eventual reveal. Escalate through at least three distinct beats, each one closing off a rationalization the previous beat still allowed, so the character (and reader) run out of ordinary explanations one at a time rather than all at once. Withhold a full, explicit statement of {{true_threat}} until at least two-thirds of the way through the scene — let concrete sensory detail (sound, smell, texture, something in the wrong place) carry the escalation instead of the narrator naming what's happening. End on a beat that confirms the threat is real without resolving it — no defeat, no explanation, no safety.

WHAT NOT TO DO
Do not use a stinger reveal as the very last line if the entire scene has already made the threat explicit two paragraphs earlier — the shock has to land once, at the right beat, not be repeated for a cheap final punch. Do not have the point-of-view character narrate their own fear in the abstract ("I felt a wave of terror") in place of writing the physical, sensory detail that would make a reader feel it themselves. Do not explain the mechanism or origin of {{true_threat}} inside this scene — that is a different scene's job; this one is about the character's dawning certainty, not lore.

OUTPUT FORMAT
1. The scene itself, in prose, hitting roughly {{target_length}}.
2. A one-line breakdown listing the escalation beats you used, in order, so I can see the structure underneath the prose.
3. One alternate final line, in case the one in the scene reads too final or too soft.`,
    variables: [
      {
        name: 'setting_and_pov',
        description: `Where the scene takes place and whose perspective it's told from.`,
        example: `A night-shift security guard alone in a self-storage facility, third-person limited, told close to his perspective.`,
        required: true,
      },
      {
        name: 'true_threat',
        description: `What is actually wrong in the scene, stated plainly for the writer even though it should be withheld from the reader for most of the scene.`,
        example: `One of the storage units is being rented and visited by someone who technically stopped existing eight months ago, according to the sign-in log.`,
        required: true,
      },
      {
        name: 'first_deviation',
        description: `The first small, explainable-away detail that starts the escalation.`,
        example: `A unit door he locked himself an hour ago is now unlatched, with no forced-entry damage.`,
        required: true,
      },
      {
        name: 'target_length',
        description: `Roughly how long the finished scene should run.`,
        example: `900-1,100 words`,
        required: true,
      },
      {
        name: 'tone_reference',
        description: `A comparable work or tonal touchstone to calibrate register — not to copy, just to anchor restraint versus explicitness.`,
        example: `Quiet, procedural dread — closer to a found-footage transcript than a slasher; the guard stays rational as long as possible.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`horror-writing`, `short-fiction`, `scene-writing`, `creative-writing`, `fiction-craft`],
    whyItWorks: `Horror scenes that state the threat immediately collapse the one mechanism that actually produces fear in prose: the gap between what the character can still rationalize and what the reader already suspects. Forcing an ordinary opening and a staged sequence of closing rationalizations gives GPT-5.1 an explicit scaffold to escalate against, which matters because left unconstrained the model's default instinct for horror is to front-load an explicit monster description or a named threat within the first few lines — it reaches for clarity where the genre needs withholding. Requiring the threat to stay implicit until two-thirds through the scene, and requiring physical sensory detail instead of abstract fear-naming ("I felt terror"), directly targets the model's tendency to summarize an emotional state in a single adjective-driven sentence rather than construct the concrete image that would make a reader supply that emotion themselves — dread is a reader inference, not a stated fact, and a model left to its own devices will state it because stating is cheaper than constructing. The explicit ban on a duplicate final stinger addresses a specific, observable failure mode: models trained on horror-adjacent fiction often try to land two shocks — a mid-scene reveal and then a twist ending — which dilutes both, since the emotional peak has already fired once. Ending on unresolved confirmation rather than defeat or explanation matters structurally too, since a self-contained scene (as opposed to a full story) has no room for denouement, and a model asked for "a horror scene" without that constraint will often accidentally wrap it up like a complete short story with a false sense of closure.`,
    exampleOutput: `The unit door wasn't just unlatched — it was open exactly the width Dale always left his own supply closet, a habit he'd never described to anyone. He told himself the wind had found some new way through concrete block. He told himself that twice more before the flashlight caught the sign-in sheet clipped to unit 214's door, its ink still wet, dated correctly, signed by a name he recognized from a obituary he'd read out loud to his wife eight months ago.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-comedy-sketch-corporate-meeting-satire',
    category: 'writing',
    title: `Write a comedy sketch that escalates one absurd premise instead of stacking unrelated jokes`,
    description: `Produces a short sketch built on a single comedic engine that escalates scene by scene, with a game clearly stated up front so every beat compounds instead of resetting to a fresh joke each time.`,
    promptText: `Write me a short comedy sketch. Before anything else, name the "game" of the sketch in one sentence — the one absurd premise or behavior that everything else escalates from — because a sketch without a stated game usually turns into a string of unrelated jokes wearing the same setting.

SETUP
{{setup}}

THE GAME
{{comedic_engine}}

CHARACTERS
{{characters}}

LENGTH
{{length}}

RULES
Open the sketch by establishing the game as something ordinary and almost reasonable — the funniest version of most premises starts with a character being completely sincere about something absurd, not announcing that something absurd is happening. Escalate the game at least twice: each escalation should be the same core behavior taken one level further or applied somewhere it clearly shouldn't fit, not a new, unrelated joke bolted onto the same scene. Give every character in the scene a distinct relationship to the game — someone driving it, someone reluctantly going along, and (if there's room) someone completely oblivious to how strange it's gotten — since a sketch where every character reacts identically to the absurdity flattens the comedy. Land a button (a final line or beat) that either escalates the game one last time past what seemed possible, or undercuts it hard in one line — not a summary or a moral.

WHAT NOT TO DO
Do not have a character explain why the situation is funny or comment on the absurdity directly ("can you believe this is happening") — that breaks the sincerity the game depends on. Do not introduce a second, unrelated comedic idea partway through just because the first one seems to be running out — escalate the one you started with harder instead of switching premises. Do not end on a tidy resolution where everyone agrees to stop the behavior and go back to normal; that deflates the escalation instead of paying it off.

OUTPUT FORMAT
1. The one-sentence game statement.
2. The sketch, formatted with character names in caps before their lines and brief stage directions in parentheses.
3. One alternate button line, in case the first one lands too soft.`,
    variables: [
      {
        name: 'setup',
        description: `Where the sketch takes place and what's ostensibly happening at the start.`,
        example: `A weekly all-hands meeting at a mid-size startup, presented over video call.`,
        required: true,
      },
      {
        name: 'comedic_engine',
        description: `The one absurd behavior or premise that escalates through the sketch.`,
        example: `The CEO has started answering every question with a sports metaphor so tortured it stops making sense, and insists everyone else adopt the metaphor too.`,
        required: true,
      },
      {
        name: 'characters',
        description: `Who's in the scene and their rough relationship to the game.`,
        example: `The CEO (driving it), an HR lead (reluctantly playing along to keep her job), and a new hire (completely oblivious, thinks this is just how the company talks).`,
        required: true,
      },
      {
        name: 'length',
        description: `Roughly how long the finished sketch should run.`,
        example: `About 90 seconds performed, roughly 350-450 words on the page.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`comedy-writing`, `sketch-comedy`, `scriptwriting`, `creative-writing`, `humor`],
    whyItWorks: `Comedy sketches fail most often not from weak individual jokes but from a missing comedic engine — a string of quips in the same setting reads as loosely funny at best, while a single game escalated through the scene builds compounding laughs because the audience's understanding of the rule sharpens with each beat. Requiring the game to be stated in one sentence before drafting forces GPT-5.1 to commit to a single mechanism rather than its default pattern of generating several loosely related jokes tied only by shared setting, which is the model's most common failure mode when asked for "a funny sketch" without a stated structural constraint. The instruction to open sincerely rather than announcing the absurdity targets a specific tendency models have toward lampshading their own jokes — having a character remark on how strange the situation is, which reads as the model hedging rather than trusting the premise, and which reliably kills the deadpan commitment that makes an absurd premise land as funny rather than just weird. Assigning each character a distinct relationship to the game (driving it, reluctantly complying, oblivious) prevents a flat scene where every character responds to the absurdity with the same generic exasperation, which is a second common default when a model isn't told characters need differentiated stances. Banning a tidy "everyone agrees to stop" ending matters because sketch comedy's comedic momentum depends on escalation continuing past the point of comfort — a model asked to write a short scene will often reach for narrative closure out of habit, and closure is the opposite of a strong act-out or button.`,
    exampleOutput: `CEO: (beaming) Look, Q3 is basically a full-court press with two minutes left and we're down a receiver, so what I need from Marketing is to just — throw it deep, you know? HR LEAD: (flat) We understand. We'll... throw it deep. NEW HIRE: (nodding earnestly, taking notes) Got it — deep throw, no receiver, got it.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-screenplay-scene-two-hander-confrontation',
    category: 'writing',
    title: `Draft a two-character confrontation scene in proper screenplay format, driven by subtext not statements`,
    description: `Writes a formatted screenplay scene where two characters want incompatible things and neither says so directly, using action lines and dialogue to carry what's actually being negotiated underneath the surface conversation.`,
    promptText: `Draft one screenplay scene in standard format (slugline, action lines, character names in caps, dialogue) between exactly two characters who each want something the other one won't give them directly.

SLUGLINE AND CONTEXT
{{slugline_and_context}}

CHARACTER A WANTS
{{character_a_want}}

CHARACTER B WANTS
{{character_b_want}}

WHAT NEITHER WILL SAY OUT LOUD
{{unspoken_stakes}}

PAGE LENGTH
{{page_length}}

RULES
Neither character should state their actual want directly at any point in the dialogue — the scene's job is to dramatize the gap between what's said and what's meant, so every line of dialogue should be doing something other than announcing intent: deflecting, testing, probing, changing the subject, or making a smaller ask that stands in for the real one. Use action lines only for what a camera could actually capture — a physical action, a look held a beat too long, an object picked up or set down — never for a character's internal thought or motive; if the scene needs the reader to know a motive, it has to be inferable from behavior and dialogue, not stated in an action line. Give the scene a clear turn: a moment partway through where the balance of power or information shifts, so the scene isn't just two people repeating their positions until the page runs out. End on the beat where the unresolved tension is at its sharpest, not on a line that resolves or explains it — a strong two-hander often ends on a exit, a refusal, or a line that reframes everything just said, not a summary.

WHAT NOT TO DO
Do not have either character deliver an on-the-nose line stating {{unspoken_stakes}} even once, even as a slip — the entire point is that it stays beneath the surface and the audience infers it. Do not pad the scene with small talk that doesn't advance the underlying negotiation between the two wants; every line should be doing double duty as surface conversation and subtextual maneuvering.

OUTPUT FORMAT
1. The scene in standard screenplay format.
2. A short subtext key below it: for each major exchange, one line stating what was actually said versus what was actually meant, so I can check the subtext is landing as intended.`,
    variables: [
      {
        name: 'slugline_and_context',
        description: `The scene heading and brief context for what's led up to this moment.`,
        example: `INT. KITCHEN - NIGHT. Two former business partners meet for the first time since one bought the other out of the company.`,
        required: true,
      },
      {
        name: 'character_a_want',
        description: `What the first character actually wants from this conversation.`,
        example: `An apology, or at least an acknowledgment that the buyout was a betrayal, not just business.`,
        required: true,
      },
      {
        name: 'character_b_want',
        description: `What the second character actually wants.`,
        example: `Forgiveness, without having to admit the buyout was personal as well as strategic.`,
        required: true,
      },
      {
        name: 'unspoken_stakes',
        description: `The real thing underneath the conversation that neither character says aloud.`,
        example: `They were also ending a romantic relationship at the same time as the business split, and both are pretending this meeting is only about the company.`,
        required: true,
      },
      {
        name: 'page_length',
        description: `Roughly how long the scene should run in screenplay pages.`,
        example: `2-3 pages`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`screenwriting`, `scene-writing`, `dialogue-craft`, `subtext`, `film-writing`],
    whyItWorks: `Two-hander confrontation scenes live or die on subtext, and the single most common failure mode when a model is asked to write conflict dialogue is to have characters state their wants and grievances plainly, because explicit statement is the most direct path to conveying information and models default toward directness unless explicitly redirected. Naming both wants and the unspoken stakes for the writer, while explicitly banning either character from voicing the unspoken stakes even once, forces GPT-5.1 to route the actual content of the scene through indirect dialogue moves — deflection, a smaller stand-in ask, a pointed silence — which is mechanically closer to how real confrontations under emotional stakes actually play out, since people rarely announce what they most want precisely when it matters most. Restricting action lines to only camera-capturable behavior addresses a specific screenplay-format failure: models frequently slip into prose-style interiority in action lines ("she feels betrayed but hides it"), which is unfilmable and is also a category error in the format itself — a script is a blueprint for what can be shot, not a description of interior states, and a director or actor has nothing to do with an unfilmable line. Requiring a clear power-shift turn partway through prevents the flatter default of two characters repeating their positions at each other until the page count is met, which is what happens when a model treats "conflict" as static opposition rather than a dynamic exchange with a hinge. Ending on the sharpest unresolved beat rather than a resolution matters because scenes that resolve too cleanly undercut the tension the whole page built, and a model given no explicit instruction about the ending will often default to a soft, conclusive final line out of a general pull toward narrative closure.`,
    exampleOutput: `A stands at the counter, turning a coffee mug slowly in her hands without drinking from it. B watches the mug, not her face. B: You still take it black. A: (a beat) You remembered that and not the part where you had Legal call me on a Friday.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-screenplay-outline-feature-three-act-beat-sheet',
    category: 'writing',
    title: `Turn a loose feature idea into a working three-act beat sheet with turning points named and justified`,
    description: `Converts a premise, protagonist, and ending into a structured beat sheet — major turning points, midpoint, and act breaks laid out as a table with a one-line justification for why each beat happens where it does.`,
    promptText: `Build a three-act beat sheet for a feature-length screenplay from the premise below. I don't want prose or scene-by-scene detail yet — I want the structural skeleton: the beats that have to exist for the story to function as a feature, with a reason attached to each one.

LOGLINE
{{logline}}

PROTAGONIST AND WANT
{{protagonist_and_want}}

ENDING STATE
{{ending_state}}

GENRE AND RUNTIME TARGET
{{genre_and_runtime}}

RULES
Produce the following beats at minimum, each tied to an approximate page number based on a standard one-page-per-minute runtime: Opening Image, Inciting Incident, Break into Act Two (the protagonist commits to pursuing the want, past the point of easy retreat), Midpoint (a false victory or false defeat that raises the stakes rather than just marking the halfway point), All Is Lost / Low Point, Break into Act Three, Climax, and Final Image. For every beat, write one sentence describing what happens and a second sentence justifying why it has to occur at that point in the structure rather than earlier or later — a beat sheet that just lists events without structural reasoning is a plot summary, not a beat sheet. The Midpoint must genuinely raise the stakes or change the nature of the protagonist's problem, not simply be the scene that happens to fall at the halfway page count — if the premise as given doesn't naturally produce a stakes-raising midpoint, say so explicitly and propose one rather than forcing a weak beat into that slot. The Final Image should meaningfully invert, mirror, or answer the Opening Image so the two beats read as a pair when placed side by side.

WHAT NOT TO DO
Do not write dialogue or scene description — every beat stays at the level of "what happens and why," not "how it's shot or said." Do not pad the sheet with minor character beats that aren't load-bearing for the three-act structure; if a beat doesn't change the protagonist's situation or the audience's understanding of the stakes, it doesn't belong in a structural outline.

OUTPUT FORMAT
A table with columns: Beat Name | Approx. Page | What Happens | Why It Belongs Here. Follow the table with one paragraph flagging any beat where the given premise created genuine structural tension (for example, an ending state that doesn't obviously follow from the stated want) and how you resolved it.`,
    variables: [
      {
        name: 'logline',
        description: `A one-to-two sentence summary of the film's core premise.`,
        example: `A disgraced weather forecaster gets one more shot at credibility when he's the only person who believes an approaching storm is far worse than official models predict.`,
        required: true,
      },
      {
        name: 'protagonist_and_want',
        description: `Who the story follows and what they want, stated as a concrete goal not a vague theme.`,
        example: `Mara, 42, wants her old network job back and, more specifically, wants to be right in public one more time after being wrong in public cost her everything.`,
        required: true,
      },
      {
        name: 'ending_state',
        description: `Roughly how the story ends — the state the protagonist and world are in by the final image.`,
        example: `She's right, the storm hits as she predicted, but she doesn't get the job back — she gets something she didn't know she wanted more: her estranged daughter's trust.`,
        required: true,
      },
      {
        name: 'genre_and_runtime',
        description: `The genre and target runtime, since beat placement and tone shift by both.`,
        example: `Disaster drama, roughly 105 minutes.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`screenwriting`, `story-structure`, `beat-sheet`, `three-act-structure`, `outlining`],
    whyItWorks: `A beat sheet is only useful if each beat is load-bearing and placed for a structural reason, and the single most common failure when a model generates one unprompted is to produce a plot summary chopped into named sections — an Opening Image and a Midpoint label slapped onto whatever events happen to fall near those page counts, without the events themselves doing the structural job those labels imply. Requiring a justification sentence alongside every beat forces GPT-5.1 to check its own placement rather than just naming beats in sequence, which surfaces the difference between a Midpoint that merely occurs at the halfway page and one that actually raises stakes — a distinction the model will not reliably self-enforce unless asked to argue for it. The explicit instruction to flag when the given premise doesn't naturally produce a strong midpoint or a clean final-image inversion matters because loglines supplied by a human are frequently underspecified for structure, and a model that silently forces a weak beat into a slot to satisfy the template produces an outline that looks complete but would fall apart the moment someone tried to write scenes from it — surfacing the tension instead lets the actual writer make the creative call rather than inheriting an invisible compromise. Pinning approximate page numbers to a one-page-per-minute convention gives the runtime target real teeth instead of leaving "105 minutes" as a number that never touches the actual beat placement, which is what happens when a runtime is stated but never operationalized against where events land. Banning dialogue and scene-level detail keeps the deliverable at the correct altitude — a beat sheet mixed with prose scenes is neither a clean structural document nor a usable draft, and separating the two lets each later stage of development work from the right level of abstraction.`,
    exampleOutput: `Midpoint (approx. p.55): Mara's storm model is confirmed correct by a rival network hours before her old bosses would admit it — but the confirmation comes from her daughter's amateur weather account going viral, which means Mara is now competing with the one person she was trying to reconnect with. Why here: this converts her external professional goal into an internal relational cost right at the point the story needs to complicate rather than simply confirm her original want.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-voiceover-script-60-second-explainer-timed',
    category: 'writing',
    title: `Write a 60-second voiceover script that's timed to the second, not just word-counted`,
    description: `Produces a voiceover script broken into timed segments matched to a realistic spoken pace, with pacing notes and a natural breath point marked, so it actually fits the video length instead of running long once a narrator reads it aloud.`,
    promptText: `Write a voiceover script for a {{video_length}} explainer video. This needs to actually fit the runtime when read aloud at a natural pace, not just look like the right length on the page — most voiceover scripts run long because they're word-counted instead of time-tested.

PRODUCT OR SUBJECT
{{subject}}

VIDEO STRUCTURE (what's on screen)
{{on_screen_structure}}

TARGET AUDIENCE
{{audience}}

READ PACE
{{read_pace}}

RULES
Budget the script against a spoken pace of {{read_pace}} words per minute, not the faster pace of silent reading — calculate the actual word count ceiling for {{video_length}} at that pace before writing a single line, and state that ceiling at the top of your output so the budget is checked, not assumed. Break the script into segments that match the on-screen structure given, and mark an approximate timestamp at the start of each segment (0:00, 0:08, 0:15, and so on) so it's clear which line should be playing under which visual. Write for the ear, not the eye: short sentences, no subordinate clauses stacked three deep, and no sentence a narrator would have to reread to figure out where the emphasis goes. Mark one natural breath point per sentence longer than about twelve words with a forward slash, so a voice talent has an explicit cue rather than guessing where to pause. End on a single clear call to action that fits in one breath, not a sentence that tries to both summarize the video and ask for the action.

WHAT NOT TO DO
Do not write a script that reads well silently but would run over {{video_length}} at a spoken pace — if the draft comes in over budget, cut content rather than asking the narrator to speed up, since a sped-up read undercuts clarity and trust. Do not stack more than one idea per on-screen segment; if a segment needs two ideas, that's a sign the on-screen structure needs an extra beat, and you should flag that rather than cramming both ideas into the given timestamp.

OUTPUT FORMAT
1. The word count ceiling you calculated, and the actual word count of your draft, so I can see it's within budget.
2. The full script broken into timestamped segments with breath marks.
3. One line flagging any place the on-screen structure was too tight for the content and what you cut to make it fit.`,
    variables: [
      {
        name: 'video_length',
        description: `The total runtime the voiceover must fit inside.`,
        example: `60 seconds`,
        required: true,
      },
      {
        name: 'subject',
        description: `The product or subject the explainer is about.`,
        example: `A budgeting app feature that automatically splits a paycheck into savings, bills, and spending buckets.`,
        required: true,
      },
      {
        name: 'on_screen_structure',
        description: `The rough visual beats the video will show, in order.`,
        example: `0-8s: problem (a chaotic pile of bills), 8-25s: app opens and auto-splits the paycheck, 25-45s: buckets update in real time as spending happens, 45-60s: app icon and download CTA.`,
        required: true,
      },
      {
        name: 'audience',
        description: `Who's watching and what they already know about the subject.`,
        example: `People in their 20s who've never used a budgeting app and are mildly skeptical that one would actually help.`,
        required: true,
      },
      {
        name: 'read_pace',
        description: `The spoken words-per-minute rate to budget against.`,
        example: `150 words per minute, a relaxed conversational read rather than a rushed ad-read pace.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`voiceover-script`, `video-scriptwriting`, `ad-copy`, `script-timing`, `explainer-video`],
    whyItWorks: `Voiceover scripts that run long almost never fail because the writer misjudged the topic — they fail because word count and spoken duration are different units, and a model asked to write "a 60-second script" defaults to producing a script that looks the right length on the page, since it has no built-in mechanism forcing it to check word count against a spoken-pace ceiling unless explicitly told to calculate one before drafting. Requiring the ceiling to be computed and stated up front, then checked against the actual draft's word count, converts an implicit assumption into a verifiable number the writer can catch before ever handing the script to a narrator, which matters because the cost of discovering a script runs long is highest at the recording session, not at the drafting stage. Timestamping segments against the given on-screen structure keeps the audio and visual tracks synchronized at the level of the actual deliverable, rather than producing a generic paragraph of narration that someone downstream has to manually chop and match to the storyboard — a task that introduces its own errors. The instruction to write for the ear rather than the eye targets a specific and common defect in model-written voiceover: sentences with stacked subordinate clauses read fine silently but force a narrator to make an unplanned interpretive choice about emphasis or pause mid-recording, and marking explicit breath points removes that ambiguity by giving the voice talent a concrete cue instead of a guess. Instructing the model to cut content rather than ask the narrator to speed up when a draft runs over budget matters because a rushed read measurably reduces comprehension and perceived trustworthiness in explainer-video research, so the fix belongs in the script, not in the performance.`,
    exampleOutput: `Word budget: 60 seconds at 150 wpm = approx. 150 words. Draft: 147 words. [0:00] Bills pile up. / Paychecks disappear before you notice. [0:08] What if your money sorted itself the moment it landed? [0:25] Meet AutoSplit — it divides every paycheck into savings, / bills, and spending, automatically.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-poem-occasion-form-constrained',
    category: 'writing',
    title: `Write an occasion poem in a specific form without it reading like a greeting-card template`,
    description: `Produces a poem for a real occasion in a chosen fixed form, using one concrete, specific memory as its anchor image so the form's constraints sharpen the meaning instead of forcing generic sentiment into the meter.`,
    promptText: `Write a poem for a specific occasion, in the form specified below. The biggest risk with occasion poems is that the form's constraints push the language toward generic sentiment — I want the opposite: one real, specific detail doing all the emotional work, with the form sharpening it rather than diluting it.

OCCASION
{{occasion}}

FORM
{{form}}

THE ONE CONCRETE MEMORY OR DETAIL TO ANCHOR ON
{{anchor_detail}}

WHO IT'S FOR
{{recipient}}

RULES
Build the entire poem around {{anchor_detail}} — do not introduce a second, unrelated memory or image partway through just to fill out the form's length requirement; if the form needs more material, find it by looking closer at the one detail already given (its texture, what led up to it, what it implies) rather than importing something new. Follow the technical requirements of {{form}} precisely (meter, rhyme scheme, line count, or repetition pattern, whichever applies) — state the scheme you're using at the top of your output before the poem itself, so any deviation is visible rather than silently smoothed over. Avoid the stock vocabulary of occasion poetry (words like "cherish," "treasure," "forever," "journey" used abstractly) unless one of those words is doing specific, load-bearing work tied to the anchor detail rather than functioning as filler sentiment. Let the final line or stanza turn — reveal something about the anchor detail or the relationship that wasn't obvious from the opening, rather than simply restating affection more emphatically.

WHAT NOT TO DO
Do not write generic praise that could apply to any {{recipient}} in this same occasion category — every line should only make sense for this specific person and this specific memory, such that swapping in a different name or occasion would break the poem. Do not sacrifice the anchor detail's specificity to make a rhyme or meter work; if a technical requirement of the form is fighting the concrete detail, flag the tension and pick the version that keeps the detail intact.

OUTPUT FORMAT
1. The form and scheme stated plainly (e.g., "Petrarchan sonnet, ABBAABBA CDECDE").
2. The poem.
3. One line noting any place you had to make a trade-off between the form's technical requirement and the anchor detail's specificity, and which way you resolved it.`,
    variables: [
      {
        name: 'occasion',
        description: `The event or milestone the poem is written for.`,
        example: `A father's retirement after 34 years as a high school shop teacher.`,
        required: true,
      },
      {
        name: 'form',
        description: `The specific poetic form to write in.`,
        example: `Shakespearean sonnet (14 lines, ABAB CDCD EFEF GG, iambic pentameter).`,
        required: true,
      },
      {
        name: 'anchor_detail',
        description: `One real, specific memory or image the entire poem should build from.`,
        example: `He kept a coffee can full of mismatched screws on his workbench and could find the right one by feel in under ten seconds, without looking.`,
        required: true,
      },
      {
        name: 'recipient',
        description: `Who the poem is for and their relationship to the writer, if relevant.`,
        example: `Written by his daughter, to be read aloud at his retirement dinner.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`poetry-writing`, `occasion-poem`, `formal-verse`, `creative-writing`, `greeting-verse`],
    whyItWorks: `Occasion poems default toward generic sentiment because a fixed form imposes real constraints (meter, rhyme, line count) that are easiest to satisfy with abstract, high-frequency emotional vocabulary — words like "cherish" and "forever" are metrically flexible and rhyme easily, which is exactly why they show up so often in weak occasion verse, and it's the same reason a model under a strict form constraint will reach for them unless explicitly redirected. Anchoring the entire poem on one supplied concrete detail and explicitly forbidding the introduction of a second, unrelated image forces GPT-5.1 to generate the form's required additional material by examining the given detail more closely rather than padding with new, generic content — which is the difference between a poem that could only be about this specific person and one that's a template with a name dropped in. Requiring the form's scheme to be stated explicitly before the poem itself creates a checkable commitment: a model asked simply to "write a sonnet" will sometimes produce fourteen lines with an inconsistent or drifting rhyme scheme because nothing forces it to track the pattern it's supposed to be holding, and stating the scheme up front makes any drift visible to both the model and the reader rather than silently smoothed over in generation. The instruction to flag trade-offs between the form's technical demands and the anchor detail's specificity matters because those two goals do genuinely conflict sometimes — a perfect rhyme sometimes only exists in more generic language — and surfacing the trade-off rather than silently resolving it toward the easier, blander option keeps the writer in control of which one wins.`,
    exampleOutput: `Not treasure, no — a coffee can of screws, / mismatched, unsorted, thirty years deep-worn; / his hand knew which to choose before he'd choose, / found by feel alone, past needing to be shown.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-free-verse-personal-memory-image-driven',
    category: 'writing',
    title: `Turn a specific personal memory into a free verse poem built on image, not statement`,
    description: `Converts a real, specific memory into a free verse poem that works through concrete sensory image and line-break rhythm rather than telling the reader what the memory meant, keeping the poem's meaning implicit and earned.`,
    promptText: `Write a free verse poem based on the memory described below. Free verse has no meter or rhyme scaffold to hide behind, so the whole poem has to earn its effect through image, specific detail, and line-break rhythm — not through stating what the memory means.

THE MEMORY
{{memory}}

WHAT IT MEANT, FOR YOUR OWN REFERENCE ONLY
{{underlying_meaning}}

SENSORY DETAILS AVAILABLE
{{sensory_details}}

DESIRED LENGTH
{{length}}

RULES
Never state {{underlying_meaning}} directly anywhere in the poem — it exists only so you understand what the poem is quietly building toward; the poem itself should let a reader arrive at something like that meaning through image and implication, without ever being told it outright. Use at least three of the sensory details given, and prioritize the ones that are unusual or oddly specific over the generic ones — a detail like "the smell of pencil shavings and rain through a cracked window" earns more than "it was a sad day." Let line breaks do real work: break lines at points that create a small pause, a double meaning, or a shift in emphasis, not simply at the end of a grammatical clause every time — vary line length rather than settling into one uniform rhythm for the whole poem. Avoid a closing line that summarizes or explains the poem's feeling; end instead on a concrete image, action, or unresolved detail that carries the weight without naming it.

WHAT NOT TO DO
Do not use abstract emotion words (grief, longing, nostalgia, love) as the primary carriers of feeling — if one appears at all, it should be doing secondary work beside a concrete image, never standing alone as the poem's main gesture. Do not organize the poem as a chronological narrative retelling of the memory from start to finish; free verse built from a memory works better circling or fragmenting the memory around its most charged details than marching through it in order.

OUTPUT FORMAT
1. The poem, with intentional line breaks and stanza spacing.
2. One paragraph, separate from the poem, naming which sensory details you used and why you chose those over the others given.`,
    variables: [
      {
        name: 'memory',
        description: `The real, specific memory the poem should be built from.`,
        example: `Sitting on the back step of a childhood house the week before it was sold, watching a neighbor's dog dig under the fence one last time.`,
        required: true,
      },
      {
        name: 'underlying_meaning',
        description: `What the memory actually meant or represents, kept out of the poem itself but used to guide its construction.`,
        example: `The recognition that leaving a place changes what it meant to belong somewhere, and that the realization arrived through something small and unrelated, not a big goodbye moment.`,
        required: true,
      },
      {
        name: 'sensory_details',
        description: `A list of concrete sensory details available from the memory to draw from.`,
        example: `The smell of cut grass and hot concrete, the dog's paws throwing dirt in a steady rhythm, a moving box visible through the screen door, the specific rust color of the fence.`,
        required: true,
      },
      {
        name: 'length',
        description: `Roughly how long the poem should be.`,
        example: `20-28 lines, in 3-4 stanzas of uneven length.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`free-verse`, `poetry-writing`, `personal-narrative`, `creative-writing`, `image-driven-poetry`],
    whyItWorks: `Free verse has no formal scaffold — no meter, no rhyme — to disguise a weak line, which means the entire burden of the poem's effect falls on image specificity and line-break rhythm, and a model without explicit constraint on those two levers will default to the easier path: stating the emotional payoff directly, since naming a feeling is more reliably "correct" than constructing an image that implies it. Keeping the underlying meaning as private context rather than content the poem can use forces GPT-5.1 to build toward that meaning through the sensory details actually supplied, which is the mechanical difference between a poem that shows and one that explains itself in its own final line — a distinction models don't reliably self-enforce because summarizing a feeling reads as a satisfying, complete-feeling gesture even though it's the weaker choice in the genre. Requiring at least three sensory details, with explicit preference for unusual over generic ones, counters a specific model tendency to reach for the most conventional sensory shorthand available (rain for sadness, sunlight for hope) rather than the oddly specific detail that actually distinguishes one memory from every other similar memory — genericness is the free-verse equivalent of the greeting-card cliché in formal poetry. The instruction to vary line-break placement rather than breaking only at clause boundaries targets a real default: models often produce free verse that is really just prose sentences chopped into roughly even lines, which forfeits the one structural tool free verse actually has. Banning a chronological, start-to-finish retelling matters because a memory poem organized as narrative reads as an anecdote with line breaks, while one organized around its most charged fragments reads as something closer to how memory itself actually resurfaces.`,
    exampleOutput: `The dog again, under the same gap in the fence,
as if no one had told him the yard
was already someone else's guess.
Boxes stacked wrong-side-out by the door,
their labels facing in, like even the tape
knew not to look at what it was leaving.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-children-story-early-reader-gentle-lesson',
    category: 'writing',
    title: `Write an early-reader story that teaches its lesson through what happens, not a stated moral`,
    description: `Produces a read-aloud-friendly children's story for early readers where the lesson emerges from the plot's consequences rather than a character or narrator stating it, with vocabulary and sentence length matched to the target age.`,
    promptText: `Write a short story for early readers, ages {{age_range}}. The lesson has to come from what happens in the story, not from a character or narrator announcing it at the end — kids this age can tell when they're being lectured, and it makes the story less enjoyable, not more instructive.

MAIN CHARACTER
{{main_character}}

THE SITUATION
{{situation}}

THE LESSON (for your reference only — must not be stated aloud in the story)
{{lesson}}

READ-ALOUD LENGTH
{{length}}

RULES
Show the lesson entirely through consequence: the character makes a choice, something happens as a direct result, and the character's situation or feelings change because of it — never insert a line where the character, narrator, or another character explains what should be learned. Match vocabulary and sentence length to ages {{age_range}}: short, concrete sentences, mostly one idea per sentence, and words a child that age would either already know or could reasonably sound out or infer from context — avoid abstract vocabulary the lesson tempts toward (words like "responsibility" or "consequences" used directly). Build in read-aloud rhythm — some repetition of a phrase or structure a child could start predicting and joining in on, and natural places for a parent's voice to pause or change tone. Give the character agency in fixing or responding to the situation themselves by the end, rather than having an adult character step in and resolve it for them — the character's own choice should drive the change in the last stretch of the story, since that's what makes the lesson feel earned rather than delivered.

WHAT NOT TO DO
Do not end with a sentence that names the lesson ("And from that day on, she always shared her toys") — end instead on the concrete result of the character's changed behavior. Do not make the character's mistake or the consequence frightening or shaming in tone; the story should be warm even while showing a real, felt consequence.

OUTPUT FORMAT
1. A short title.
2. The story, broken into short paragraphs suitable for read-aloud pacing.
3. One line (separate from the story) naming the lesson explicitly, just so I can confirm it's the one that was intended to come through.`,
    variables: [
      {
        name: 'age_range',
        description: `The target age range for the reader or listener.`,
        example: `Ages 4-6`,
        required: true,
      },
      {
        name: 'main_character',
        description: `Who the story follows.`,
        example: `Pip, a young raccoon who is very proud of being fast at everything.`,
        required: true,
      },
      {
        name: 'situation',
        description: `The core situation or conflict the character faces.`,
        example: `Pip races ahead of his friends on a forest path and gets lost because he didn't wait to see which fork they were taking.`,
        required: true,
      },
      {
        name: 'lesson',
        description: `The underlying lesson the story should teach without stating it outright.`,
        example: `Rushing ahead without your friends can leave you alone and lost, even if you're the fastest.`,
        required: true,
      },
      {
        name: 'length',
        description: `Roughly how long the story should run when read aloud.`,
        example: `About 2-3 minutes read aloud, roughly 400-550 words.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`children-story`, `early-reader`, `read-aloud`, `creative-writing`, `kids-content`],
    whyItWorks: `Children's stories that state their moral outright reliably read as flatter and less memorable than ones where the lesson emerges from consequence, and a model asked for "a story that teaches X" will very often default to a closing sentence naming the lesson directly, because explicit statement is the most reliable way to guarantee the stated goal was technically satisfied — it's the same shortcut that shows up in occasion poems reaching for "cherish" and "forever." Keeping the lesson as private context the model must build toward, rather than content available to state, forces the actual causal chain of the plot (a choice, a consequence, a changed feeling) to carry the meaning, which is mechanically closer to how children actually absorb narrative lessons — through pattern recognition across the story's events, not through being told. Matching vocabulary and sentence length explicitly to the given age range matters because a model's default register for a "children's story" prompt tends to land somewhere in a broad middle-grade zone unless a specific age is pinned down and enforced, which produces sentences with subordinate clauses or vocabulary a four-year-old listener would lose track of mid-sentence. Requiring the character to resolve their own situation rather than have an adult step in addresses a common softening instinct in generated children's content — an adult swooping in to fix things removes the exact narrative mechanism (agency leading to consequence leading to change) that makes the lesson land as earned rather than externally imposed. The instruction to keep tone warm rather than shaming matters because a consequence written as frightening or punitive teaches a different, unintended lesson about safety and self-worth rather than the intended one about behavior.`,
    exampleOutput: `Pip zoomed past Otto and Marisol without looking back. The path split into three, and Pip picked the middle one, sure his friends were right behind him. But when he stopped to catch his breath, the woods were quiet. Really quiet. "Otto?" he called. Nothing called back.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-interactive-story-branching-choice-narrative',
    category: 'writing',
    title: `Build a branching interactive story where choices actually diverge instead of reconverging on the same line`,
    description: `Produces a choose-your-own-path story with a mapped decision tree, where early choices meaningfully change what the reader experiences rather than all funneling back to one identical scene, with the branch map shown alongside the text.`,
    promptText: `Write a branching, choose-your-own-path interactive story with the structure below. The most common failure in generated interactive fiction is that branches look different for one paragraph and then reconverge on the same scene regardless of what the reader picked — I want the choices to actually matter for longer than that.

OPENING SITUATION
{{opening_situation}}

FIRST DECISION POINT
{{first_decision}}

DESIRED BRANCH DEPTH
{{branch_depth}}

ENDING VARIETY
{{ending_variety}}

RULES
Start with the opening situation and present the first decision as two or three genuinely different options, each implying a different kind of story (different risk, different relationship, different tone) rather than two paths that are cosmetically different but functionally the same scene. Carry the consequences of each choice forward for at least {{branch_depth}} — a choice's effects should still be visible or relevant that many decision points later, whether as a changed relationship, a resource gained or lost, or a door now closed that was open before. Before writing the full text, output a branch map showing the tree structure (which choice leads to which node, and where nodes do or don't reconverge) so the structure is checkable before reading the prose. If two branches do reconverge at some point for practical length reasons, make that convergence a deliberate, acknowledged choice you flag in the map — never let branches accidentally collapse into an identical scene without noting it as a decision.

WHAT NOT TO DO
Do not write a decision point where both options are followed by essentially the same next paragraph with a few swapped nouns — if that's the only way to keep the branch manageable, say so honestly rather than disguising it as a meaningful choice. Do not make every path funnel to one single ending; produce the number of distinct endings specified in {{ending_variety}}, each reflecting a different accumulated set of choices, not just a different final sentence bolted onto the same outcome.

OUTPUT FORMAT
1. The branch map, as an indented outline or simple tree diagram in text.
2. The full story text, with each node labeled to match the map, and choices presented clearly at the end of each node.
3. One paragraph noting any place branches were deliberately merged for length, and why.`,
    variables: [
      {
        name: 'opening_situation',
        description: `How the interactive story begins.`,
        example: `The reader wakes up on a supply ship that's just received a distress signal from a research station that officially stopped transmitting six months ago.`,
        required: true,
      },
      {
        name: 'first_decision',
        description: `The first meaningful choice the reader faces.`,
        example: `Investigate the signal immediately alone, report it to the captain and wait for orders, or quietly ignore it and continue the ship's original course.`,
        required: true,
      },
      {
        name: 'branch_depth',
        description: `How many further decision points a choice's consequences must remain visible for.`,
        example: `At least two further decision points after the one where the choice was made.`,
        required: true,
      },
      {
        name: 'ending_variety',
        description: `How many distinct endings the story should produce and roughly how they should differ.`,
        example: `Four endings: one where the reader escapes alone, one where they escape with a rescued survivor, one where they're stranded, and one where they choose to stay.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`interactive-fiction`, `branching-narrative`, `choose-your-own-adventure`, `creative-writing`, `story-structure`],
    whyItWorks: `Interactive fiction generated without explicit structural constraint tends to produce what's sometimes called an illusion of choice — branches that diverge cosmetically for a paragraph and then reconverge on an identical scene, because maintaining genuinely separate story states across multiple future decision points is combinatorially expensive, and a model optimizing for a complete-feeling response within a reasonable length will quietly collapse branches back together rather than track divergent state all the way through. Requiring a branch map before the prose forces GPT-5.1 to commit to the tree's actual shape as a discrete planning step, which makes silent reconvergence visible and checkable rather than something that happens invisibly inside prose generation — a map is much harder to fudge than a paragraph transition. Explicitly requiring consequences to remain visible a minimum number of decision points later targets the specific failure of a choice mattering for exactly one immediate beat and then evaporating, which is the most common way "branching" fiction ends up not actually being branching in any way a reader would notice on a replay. Permitting deliberate, flagged convergence rather than banning it outright is important because real interactive fiction does converge sometimes for practical reasons — the instruction isn't that convergence is always wrong, it's that unflagged, accidental convergence disguised as meaningful choice is the actual defect, and making the model own that trade-off explicitly prevents it from being hidden inside the narrative. Requiring a specific number of genuinely distinct endings, each tied to an accumulated choice history rather than a single final swapped sentence, closes the same gap at the story's terminal nodes that the branch-depth rule closes in the middle.`,
    exampleOutput: `Branch map:
- Investigate alone -> discover the signal is a recorded loop -> [go deeper / turn back]
- Report to captain -> squad sent together -> [reader leads / reader follows]
- Ignore signal -> station's automated distress becomes ship's problem later -> forced convergence, flagged below`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-game-narrative-faction-lore-bible',
    category: 'writing',
    title: `Build a game world's faction lore bible around unresolved tension, not settled history`,
    description: `Produces a lore document for a game world's factions that centers on live, ongoing conflicts writers and designers can build quests and dialogue from, rather than a closed timeline of events that leaves nothing open to build on.`,
    promptText: `Write a lore bible document for the game world below, focused on faction relationships. A lore document that only records settled history is hard to build content from — writers and quest designers need active, unresolved tension they can hook new material into, not a finished timeline with no open threads.

WORLD PREMISE
{{world_premise}}

FACTIONS
{{factions}}

CORE TENSION
{{core_tension}}

TONE
{{tone}}

RULES
For each faction, write: what it wants (a concrete goal, not an abstract ideology alone), what it's willing to do to get it that the others aren't, and one internal disagreement within the faction itself — no faction should be written as fully unified, since a faction with zero internal friction gives designers nowhere to place a rebel NPC or a splinter subplot. For every pair of factions with a meaningful relationship, state that relationship as a specific, current tension (a contested resource, a broken promise, a shared enemy neither trusts the other about) rather than a general one-line label like "rivals" — the specific tension is what a quest designer actually hooks a mission onto. Leave the core conflict explicitly unresolved: state where it currently stands and what would have to happen for either side to gain real ground, but do not resolve it or hint at a predetermined winner — a live lore bible should be able to support the story going multiple directions depending on what the game's actual plot ends up needing. Include at least one open question or gap explicitly marked as unresolved (something the document doesn't answer) so future writers know it's deliberately available for them to define rather than accidentally contradicting something already decided.

WHAT NOT TO DO
Do not write faction descriptions as static flavor text ("The Ashguard are a proud warrior people who value honor") without tying every trait to something a designer could build a quest or dialogue line from. Do not resolve the core tension or state which faction is "right" — that call belongs to whoever builds the actual story content, not the lore bible.

OUTPUT FORMAT
1. A short paragraph per faction: goal, tactics, internal disagreement.
2. A relationship table: Faction A | Faction B | Current Tension.
3. A paragraph on the core conflict's current state and what would shift it.
4. A list of 2-3 explicitly open questions left for future writers.`,
    variables: [
      {
        name: 'world_premise',
        description: `The setting and central premise of the game world.`,
        example: `A floating archipelago kept aloft by ancient engines that are slowly failing, forcing factions to compete over the last functioning repair sites.`,
        required: true,
      },
      {
        name: 'factions',
        description: `The major factions in the world, briefly.`,
        example: `The Engineers' Guild (controls repair knowledge), the Skyborn Clans (control the islands the engines are under), and the Underreach (scavengers who live in the failing lower islands).`,
        required: true,
      },
      {
        name: 'core_tension',
        description: `The central, world-defining conflict between factions.`,
        example: `The Engineers' Guild wants to consolidate all working engines onto fewer islands to guarantee survival for some, which would mean deliberately letting other islands fall.`,
        required: true,
      },
      {
        name: 'tone',
        description: `The tonal register the world and its factions should be written in.`,
        example: `Morally grey, closer to a resource-scarcity political drama than a clear-cut good-versus-evil fantasy conflict.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`game-writing`, `worldbuilding`, `lore-bible`, `faction-design`, `narrative-design`],
    whyItWorks: `Lore documents generated without explicit structural guidance tend to read as completed history — a tidy account of what each faction is and what already happened between them — because a model asked to "write the lore" treats the task as documentation of a finished world rather than infrastructure for content that doesn't exist yet, and finished-sounding prose is what a general-purpose writing request optimizes toward. Requiring an internal disagreement inside every faction and a specific, current tension (rather than a one-word relationship label) for every faction pair forces GPT-5.1 to generate hooks rather than flavor text, since a quest designer can build an actual mission from "a contested resource neither side will formally negotiate over" but cannot build one from "they are rivals." Explicitly instructing the model to leave the core conflict unresolved, with no predetermined winner even implied, targets a specific and common defect in generated worldbuilding: models tend toward narrative closure by habit, and an unprompted lore document will often subtly signal which faction is "right" through more sympathetic framing or a more competent-sounding strategy, which quietly forecloses story directions a studio's actual writers might want later. Requiring explicitly marked open questions matters for a practical production reason — a lore bible that answers everything invites future contradiction the moment a different writer needs to add something the document didn't anticipate, whereas deliberately flagged gaps signal "this is yours to define" rather than leaving ambiguity that reads as an oversight. Banning static flavor descriptions divorced from usable traits keeps every sentence in the document tied to something an actual designer could act on, rather than worldbuilding that reads well but produces nothing playable.`,
    exampleOutput: `Engineers' Guild vs. Skyborn Clans — Current Tension: the Guild holds the only functioning repair schematics, but the Clans physically control access to the engine sites themselves; neither will grant the other side unilateral authority, and a three-year-old agreement to share access has quietly stopped being honored by both sides without either formally breaking it.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-quest-design-rpg-side-quest-brief',
    category: 'writing',
    title: `Design an RPG side quest with a moral choice that has genuinely different consequences, not just different flavor text`,
    description: `Produces a complete side-quest design brief — objectives, NPCs, branch points, and rewards — built around a choice where each outcome changes something mechanical or narrative downstream, not just the dialogue the player hears at the end.`,
    promptText: `Design a side quest for the RPG described below. The failure I want to avoid is a quest with a "moral choice" where every option leads to the same reward and the same next state, just with different flavor text read aloud — I want the choice to actually branch something.

GAME AND SETTING
{{game_and_setting}}

QUEST GIVER AND HOOK
{{quest_giver_and_hook}}

CENTRAL DILEMMA
{{central_dilemma}}

PLAYER LEVEL / POWER CONTEXT
{{player_context}}

RULES
Define the quest giver, the hook that draws the player in, and at least one complicating piece of information the player only learns partway through that recontextualizes the dilemma — a side quest that presents its full moral complexity in the opening briefing gives the player nothing to discover. Present the central dilemma as a genuine trade-off where the "obviously good" option has a real, stated cost, and the "obviously bad" or self-interested option has a real, stated benefit beyond just reward gold — a choice where one option is purely worse in every dimension isn't actually a choice. For each resolution path, specify what changes beyond the immediate scene: a reward difference, a reputation or relationship change with a specific NPC or faction, or a change in what's available later (a vendor, an ally, a location) — state these concretely rather than leaving them as "the story continues differently." Include one twist or complication that could occur regardless of which path the player takes, so the quest isn't purely a fork with no shared texture — for example, a consequence that lands on the player no matter what they chose, forcing them to live with an outcome they didn't fully control.

WHAT NOT TO DO
Do not make any resolution path strictly better than the others in every measurable way (reward, reputation, and story outcome all at once) — every path needs a real cost attached to its benefit. Do not resolve the dilemma with a clearly telegraphed "correct" choice signposted by which NPC seems more trustworthy; bury the actual trade-off in genuine ambiguity.

OUTPUT FORMAT
1. Quest giver, hook, and the mid-quest complicating reveal.
2. The central dilemma stated as a real trade-off.
3. A table of resolution paths: Path | Immediate Outcome | Downstream Change | Cost.
4. The shared complication that occurs regardless of path chosen.`,
    variables: [
      {
        name: 'game_and_setting',
        description: `The game and world the quest takes place in.`,
        example: `A grounded fantasy RPG set in a war-torn border region between two kingdoms, mid-game.`,
        required: true,
      },
      {
        name: 'quest_giver_and_hook',
        description: `Who gives the quest and the initial reason the player gets involved.`,
        example: `A refugee camp elder asks the player to retrieve medicine stolen by a group of deserters hiding in the nearby hills.`,
        required: true,
      },
      {
        name: 'central_dilemma',
        description: `The core moral trade-off the quest should build toward.`,
        example: `The deserters stole the medicine because the camp's own quartermaster has been secretly rationing it to sell on the black market — turning in the deserters means the corrupt quartermaster keeps control of supplies.`,
        required: true,
      },
      {
        name: 'player_context',
        description: `The player's approximate level or power state, so rewards and stakes calibrate correctly.`,
        example: `Mid-game player, level 18 of 40, already has a base camp reputation system active.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`game-design`, `quest-writing`, `narrative-design`, `rpg-writing`, `branching-choice`],
    whyItWorks: `The single most common defect in generated RPG quest design is a moral choice that's cosmetically branching but mechanically flat — every path awards the same gold and item, and the only thing that differs is the line of dialogue the NPC delivers at the end, because generating genuinely different downstream game states (reputation changes, unlocked or locked vendors, altered NPC availability) is significantly harder than generating different flavor text, and a model will gravitate toward the cheaper version unless the downstream table is explicitly required. Requiring a stated cost for the "obviously good" option and a stated benefit for the self-interested one directly targets a specific model habit: default moral framing in generated content tends to make the altruistic choice strictly dominant so the player is never punished for being kind, which flattens the dilemma into a non-choice — real quest tension requires the good option to actually hurt in some dimension the player cares about. Requiring a mid-quest complicating reveal rather than presenting full moral complexity in the opening briefing matters because a quest that shows its whole hand immediately gives the player nothing to discover mid-play, which is a pacing defect distinct from the choice-design defect but equally common in a single-pass quest generation. Requiring a shared complication that lands regardless of path chosen prevents the quest from reading as a pure binary fork with two disconnected outcome trees, and mirrors how real narrative design uses a consequence the player can't fully avoid to make the choice feel like it happened inside a living world rather than a menu of options with no bleed-through between them. The explicit table format for downstream changes forces the concrete specificity (a named NPC's reputation, a specific vendor's availability) that prevents the vague "the story continues differently" hand-wave a model will otherwise default to.`,
    exampleOutput: `Path: Expose the quartermaster | Immediate Outcome: deserters cleared, medicine returned | Downstream Change: camp reputation +15, but the quartermaster's black-market contact (a recurring merchant NPC) refuses to trade with the player for the rest of the game | Cost: loses access to that merchant's discounted rare crafting materials entirely.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-character-dialogue-voice-differentiation-pass',
    category: 'writing',
    title: `Rewrite a dialogue pass so two characters who currently sound identical develop distinct voices`,
    description: `Diagnoses why two characters' dialogue currently reads interchangeably and rewrites their lines using distinct sentence rhythm, vocabulary habits, and conversational tells, without resorting to a surface gimmick like an accent or catchphrase.`,
    promptText: `I have dialogue where two characters sound too similar — if you covered the names, you couldn't tell who's speaking. Diagnose why, then rewrite it so their voices are genuinely distinct.

CURRENT DIALOGUE
{{current_dialogue}}

CHARACTER A BACKGROUND
{{character_a_background}}

CHARACTER B BACKGROUND
{{character_b_background}}

WHAT SHOULD STAY THE SAME
{{preserve}}

RULES
First, diagnose the current sameness in concrete terms: identify at least two specific patterns both characters currently share (for example: both speak in complete grammatical sentences of similar length, both hedge with the same filler words, both use the same register of vocabulary) rather than giving a vague note like "they need more personality." Then assign each character a distinct set of speech habits derived from their background, not from a surface gimmick — differentiate through sentence length and completeness (does one interrupt themselves, trail off, or speak in fragments while the other finishes every thought), through what each one asks versus asserts (does one respond to questions with more questions), through vocabulary register tied to their actual background rather than decoration, and through what each character avoids saying directly. Do not introduce an accent, a verbal tic, or a catchphrase as the primary differentiator — those are surface fixes that read as gimmicks rather than voice, and they don't hold up over a full script the way rhythm and habits of thought do. Rewrite the given dialogue preserving the plot content and the information each line conveys, plus anything listed under {{preserve}}, while changing how each character says it.

WHAT NOT TO DO
Do not make character B simply the polite, correct version of character A's blunt lines — that's still one voice with a politeness dial turned differently, not two distinct voices. Do not change what information each character reveals or when — the differentiation is entirely in delivery, not in altering the scene's actual plot content.

OUTPUT FORMAT
1. The diagnosis: at least two specific shared patterns in the current dialogue.
2. Each character's distinct speech-habit profile, in a short list.
3. The rewritten dialogue.
4. One line per character explaining a specific choice in the rewrite that ties back to their background.`,
    variables: [
      {
        name: 'current_dialogue',
        description: `The existing dialogue exchange that currently sounds interchangeable.`,
        example: `DETECTIVE: I think the witness is lying. NEIGHBOR: I think so too, honestly. DETECTIVE: We should talk to her again. NEIGHBOR: I agree, we probably should.`,
        required: true,
      },
      {
        name: 'character_a_background',
        description: `Relevant background for the first character that should inform their speech patterns.`,
        example: `A veteran detective, worked homicide for 20 years, trained herself out of ever asking a question she doesn't already suspect the answer to.`,
        required: true,
      },
      {
        name: 'character_b_background',
        description: `Relevant background for the second character.`,
        example: `A retired schoolteacher neighbor, used to filling silences for nervous students, genuinely uncertain and thinking out loud as she talks.`,
        required: true,
      },
      {
        name: 'preserve',
        description: `Any specific plot content, information, or beats that must survive the rewrite unchanged.`,
        example: `Both characters must still agree the witness should be questioned again, and the neighbor must still be the one to suggest it happen tomorrow morning.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`character-voice`, `dialogue-writing`, `script-revision`, `creative-writing`, `fiction-craft`],
    whyItWorks: `Interchangeable dialogue is usually a symptom of a model (or a first draft) defaulting to one implicit voice — complete grammatical sentences, moderate hedging, neutral vocabulary — and applying it to every speaker regardless of background, because that neutral register is the safest, most broadly comprehensible way to convey plot information, and conveying information correctly is what a first pass optimizes for before voice is considered at all. Requiring an explicit diagnosis of shared patterns before any rewriting forces GPT-5.1 to identify the actual mechanism of the sameness rather than jumping straight to a surface fix, which matters because the two most common surface fixes — an accent or a catchphrase — treat voice as decoration applied on top of identical underlying sentence construction, and neither holds up across a full script the way differences in sentence completeness, question-versus-assertion ratio, or what a character avoids saying actually do. Deriving each character's speech habits from their stated background rather than from an arbitrary contrast (one blunt, one polite) ties the differentiation to something with in-fiction logic — a detective who's spent twenty years distrusting testimony would genuinely construct sentences differently from a retired teacher accustomed to filling nervous silence, and that causal link is what makes the voice read as characterization rather than an assigned quirk. The explicit instruction to preserve plot content and information timing while changing only delivery isolates the actual variable under test — voice — from the scene's substance, which prevents the rewrite from accidentally becoming a different scene instead of the same scene said differently, which is a common side effect when a model given loose license to "make the dialogue more distinct" changes what's said along with how it's said.`,
    exampleOutput: `DETECTIVE: She's lying. Not about everything — about the timeline. NEIGHBOR: Do you think so? I mean — I don't know, maybe I'm reading too much into the way she kept looking at the clock, but— DETECTIVE: Tomorrow morning. We go back.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-story-revision-developmental-edit-diagnosis',
    category: 'writing',
    title: `Run a developmental edit pass that diagnoses structural problems before touching a single sentence`,
    description: `Reviews a draft at the structural level first — plot logic, character motivation, pacing gaps — and produces a prioritized list of what to fix and why, deliberately holding off on line-level prose suggestions until the bigger issues are named.`,
    promptText: `Do a developmental edit pass on the draft below. I don't want line-editing yet — prose polish is wasted effort if the underlying structure has a problem, so diagnose structure first and hold off on sentence-level notes entirely.

DRAFT
{{draft_text}}

WHAT THIS PIECE IS TRYING TO DO
{{intended_effect}}

WHAT I ALREADY SUSPECT IS WRONG
{{author_suspicion}}

SCOPE OF THIS DRAFT
{{scope}}

RULES
Evaluate the draft against four structural categories only, in this order, and do not move to the next category until the current one is addressed: (1) plot logic — does every major event follow causally from what came before, or are there jumps the reader has to take on faith; (2) character motivation — does every significant character action match what that character has been established to want, or does the plot require someone to act against their own established interest without acknowledgment; (3) pacing — are there stretches where nothing changes for the reader (no new information, no shifted stakes, no changed relationship) for longer than feels intentional; (4) stakes escalation — does tension actually increase across the draft, or does it plateau or dip somewhere it shouldn't. For each problem found, name the specific location in the draft, state the structural category it falls under, and explain the actual mechanism of the problem (not just "this is confusing" but what specifically breaks and why a reader would stumble there). Rank the identified problems by how much fixing each one would improve the piece, not by where they occur in the draft — a mid-draft plot-logic issue that undermines the ending matters more than an early pacing lull. Address {{author_suspicion}} explicitly: confirm it, refine it, or explain why you disagree with the specific reasoning, rather than either ignoring it or agreeing automatically to avoid friction.

WHAT NOT TO DO
Do not include any line-level prose suggestions (word choice, sentence rhythm, individual clunky phrasing) in this pass — flag that a section's prose felt weak only if it's inseparable from a structural issue, and otherwise leave it for a later editing pass entirely. Do not soften every note with excessive praise padding; state problems plainly, and note what's genuinely working only where it's structurally relevant (for example, a technique worth preserving through a fix).

OUTPUT FORMAT
1. Problems found, one per structural category, each with: location, category, mechanism of the problem, and severity (high/medium/low).
2. A ranked "fix this first" list of the top three problems by impact.
3. A direct response to {{author_suspicion}}.`,
    variables: [
      {
        name: 'draft_text',
        description: `The draft or excerpt to review.`,
        example: `[Pasted 2,500-word short story draft]`,
        required: true,
      },
      {
        name: 'intended_effect',
        description: `What the piece is trying to accomplish emotionally or narratively.`,
        example: `A quiet, unsettling story where the reader realizes the narrator has been an unreliable observer of her own marriage the entire time.`,
        required: true,
      },
      {
        name: 'author_suspicion',
        description: `What the author already suspects might be wrong, to be confirmed or challenged rather than ignored.`,
        example: `I think the ending twist doesn't land because I never planted enough doubt about the narrator earlier, so it feels like a rug-pull instead of a recontextualization.`,
        required: true,
      },
      {
        name: 'scope',
        description: `Whether this is a full piece, an excerpt, or a specific problem section, and any relevant context about what surrounds it.`,
        example: `Full short story, complete draft, roughly 2,500 words.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`developmental-editing`, `story-revision`, `manuscript-feedback`, `fiction-craft`, `editing`],
    whyItWorks: `Developmental problems and line-level prose problems require genuinely different fixes, and feedback that mixes them together — a note about a plot-logic gap sitting next to a note about a clunky adjective — makes it hard for a writer to know which fix actually matters most, because both read with equal weight on the page even though fixing a structural problem can make an entire section's prose issues moot by cutting or rewriting it wholesale. Explicitly restricting the pass to four named structural categories, evaluated in a fixed order, prevents GPT-5.1 from defaulting to its more comfortable mode of general encouraging feedback mixed with scattered line notes, which is what an unconstrained "give me feedback" request tends to produce since line-level comments are easier to generate in volume and feel more immediately actionable even when they're not the actual bottleneck. Requiring the mechanism of each problem to be named, not just flagged as "confusing," forces a causal explanation a writer can actually act on — knowing that a scene is confusing doesn't tell you what to fix, but knowing that a character acts against an established want without acknowledgment tells you exactly what needs to change. Ranking by impact rather than by location in the draft matters because writers (and models given no explicit instruction) tend to give feedback in the order they encounter it, which buries a high-impact early problem under several lower-impact ones simply because of where they happen to sit in the text. Requiring a direct, specific response to the author's own suspicion — confirm, refine, or push back with reasoning — prevents the sycophantic default many models fall into of agreeing with whatever the user already suspects, which defeats the actual purpose of asking for outside diagnostic feedback in the first place.`,
    exampleOutput: `Problem 1 — Location: paragraph 14, the narrator's account of the anniversary dinner. Category: plot logic / reliability setup. Mechanism: this is the first and only moment before the twist where her account of events could plausibly be doubted, and it's a single throwaway detail rather than a pattern — a reader has no real chance to suspect her before the reveal, which is exactly the rug-pull effect you suspected. Severity: high.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-pacing-audit-manuscript-tension-mapping',
    category: 'writing',
    title: `Map a manuscript's pacing scene by scene so slow stretches show up as data, not just a feeling`,
    description: `Produces a scene-by-scene table tracking tension level, new information, and page length so pacing problems become visible as patterns in the numbers rather than a vague sense that a section 'drags.'`,
    promptText: `Do a pacing audit of the manuscript excerpt below, scene by scene. I don't want a general impression of whether it drags — I want the actual pattern made visible so I can see exactly where and why.

MANUSCRIPT EXCERPT (broken into scenes if not already)
{{manuscript_excerpt}}

GENRE AND EXPECTED PACE
{{genre_and_pace}}

WHERE THE AUTHOR FEELS IT DRAGS
{{suspected_slow_section}}

RULES
Break the excerpt into its constituent scenes (or use the breaks already present) and, for each one, assess three things: a tension rating from 1-10 relative to the scene immediately before it (not an absolute score, since the same tension level reads differently depending on what preceded it), what new information or stakes-change the scene delivers to the reader (state it in one phrase, or state explicitly if none), and the scene's approximate length relative to how much new information it delivers, flagging a mismatch (a long scene delivering little new, or a critical beat rushed through in a few lines). After scoring every scene, identify the actual pattern: consecutive scenes with flat or declining tension and no new information are the real signature of a pacing problem, not any single scene's individual score — call out specific runs of scenes where this occurs by scene number. Directly address {{suspected_slow_section}}: confirm whether the data supports the author's instinct, and if the problem is somewhere else in the pattern instead, say so plainly rather than agreeing with the stated suspicion by default.

WHAT NOT TO DO
Do not give a single overall pacing verdict for the whole excerpt ("the pacing is generally fine" or "the pacing drags overall") without the scene-by-scene data to support exactly where — a global verdict without the underlying pattern isn't actionable. Do not suggest specific rewritten prose in this pass; the deliverable is diagnostic, not a rewrite — recommend what kind of fix a slow run needs (cut, compress, add stakes) without drafting the fix itself.

OUTPUT FORMAT
1. A table: Scene # | Relative Tension (1-10) | New Info/Stakes Delivered | Length vs. Info Mismatch (flag if any).
2. A short list of specific scene-number runs that show the flat-tension, no-new-information pattern.
3. A direct verdict on {{suspected_slow_section}}, confirming or redirecting based on the data.`,
    variables: [
      {
        name: 'manuscript_excerpt',
        description: `The manuscript section to audit, ideally already broken into identifiable scenes.`,
        example: `[Pasted chapters 4-6 of a novel manuscript, roughly 6,000 words, with scene breaks marked]`,
        required: true,
      },
      {
        name: 'genre_and_pace',
        description: `The genre and the pacing expectations that come with it.`,
        example: `Thriller, expected to maintain forward tension with no more than one genuinely quiet breather scene per three chapters.`,
        required: true,
      },
      {
        name: 'suspected_slow_section',
        description: `Where the author already suspects the pacing drags, to be confirmed or challenged with data.`,
        example: `I think chapter 5 drags because of the long flashback in the middle of it.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`pacing-audit`, `manuscript-feedback`, `story-structure`, `editing`, `fiction-craft`],
    whyItWorks: `Pacing problems are notoriously hard to self-diagnose because "this section drags" is a felt impression, not a located cause, and a model asked for general pacing feedback will tend to produce an equally impressionistic response — a paragraph confirming the vague feeling back to the writer without the underlying evidence, since impression-level feedback is easier to generate than a structured scene-by-scene accounting. Forcing a per-scene tension rating relative to the immediately preceding scene, rather than an absolute score, matters mechanically because pacing is a rate of change, not a static level — a scene rated 6/10 tension reads as a slowdown after a run of 8s and as a rise after a run of 3s, and an absolute scoring scheme would obscure exactly the pattern that constitutes a pacing problem. Requiring the new-information-or-stakes-change field alongside the tension score targets the actual mechanism of a dragging section: tension and plot momentum aren't the same thing, and a scene can maintain surface tension while delivering nothing new to the reader, which is the real signature of a stall even when no individual scene looks obviously weak in isolation. Requiring the model to identify runs of consecutive flat scenes, rather than commenting scene-by-scene without synthesis, is what actually converts the data into a usable diagnosis — a table of forty individual scores without a called-out pattern puts the synthesis work back on the writer, defeating the point of asking for an audit instead of raw notes. Requiring a direct, specific verdict on the author's own suspicion — rather than reflexive agreement — closes the same sycophancy gap relevant to developmental editing generally: a writer's instinct about where a problem lives is frequently pointed at the symptom (a flashback that felt slow to write) rather than the actual cause (a run of low-stakes scenes building up to it), and only a model willing to contradict the stated suspicion with evidence is useful here.`,
    exampleOutput: `Scene 14 (ch.5, the flashback): Tension 3/10 (down from 7 in scene 13). New info: none — restates backstory already established in chapter 2. Length vs. info: mismatch flagged, 900 words for zero new stakes. Pattern: scenes 12-15 show a four-scene flat run with no new information, which is the actual drag — not the flashback itself, but that it lands inside an already-declining stretch.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-opening-hook-first-page-rewrite',
    category: 'writing',
    title: `Rewrite a manuscript's opening page so the hook is a specific, active moment instead of scene-setting`,
    description: `Diagnoses why a current opening page fails to hook a reader or agent and produces rewritten opening options that start in an active, specific moment rather than establishing shot description or backstory, with a clear rationale for each option.`,
    promptText: `Rewrite the opening of the manuscript below. I want to fix the actual hook, which usually means the current opening is doing scene-setting or backstory when it should be dropping the reader into something already in motion.

CURRENT OPENING
{{current_opening}}

GENRE
{{genre}}

WHAT THE STORY IS ACTUALLY ABOUT
{{story_premise}}

WHAT MUST BE ESTABLISHED EARLY (non-negotiable context)
{{required_context}}

RULES
First, diagnose the current opening plainly: identify whether it opens with description, backstory, waking up, or a character alone in their thoughts before anything happens — name the specific pattern, since these are the most common openings that fail to hook and each has a slightly different fix. Then produce three distinct rewritten opening options, each starting at a different possible active moment — not three versions of the same scene with different wording, but three genuinely different points of entry into the story (for example: mid-conflict, mid-conversation with something already at stake, or immediately after a consequence has landed and the character is dealing with its fallout). For each option, weave in only the pieces of {{required_context}} that can be conveyed through action or dialogue in the moment, and explicitly flag any required context that doesn't fit naturally in an opening page — that context should move to a slightly later, better-suited point in the story rather than being forced into the opening through exposition. Each option should raise at least one specific, concrete question in the reader's mind by the end of the page that only continued reading can answer — state what that question is for each option.

WHAT NOT TO DO
Do not open any option with weather, physical scene description, or a character waking up unless {{genre}} specifically calls for that convention and it's handled with a twist that subverts the reader's expectation of it. Do not cram all of {{required_context}} into the opening page just because it's marked non-negotiable — flag what doesn't fit rather than sacrificing the hook to include it.

OUTPUT FORMAT
1. Diagnosis of the current opening's pattern and why it likely isn't hooking a reader.
2. Three rewritten opening options, each labeled with its entry point strategy.
3. For each option: the specific question it raises for the reader, and any required context it couldn't fit.`,
    variables: [
      {
        name: 'current_opening',
        description: `The manuscript's current opening page or paragraphs.`,
        example: `The morning sun rose over the small coastal town of Aldercliff, painting the water in shades of gold. Maria had lived here her whole life and often thought about how much the town had changed since she was a child.`,
        required: true,
      },
      {
        name: 'genre',
        description: `The genre the manuscript belongs to.`,
        example: `Literary mystery`,
        required: true,
      },
      {
        name: 'story_premise',
        description: `What the story is actually about, so the rewrite can anchor to real stakes.`,
        example: `Maria, a lighthouse keeper's daughter, discovers her father falsified the log the night a ship went missing, and has to decide whether to expose him decades later.`,
        required: true,
      },
      {
        name: 'required_context',
        description: `Information the author believes must be established early, to be tested against whether it actually fits the opening page.`,
        example: `The reader needs to know Maria has lived in Aldercliff her whole life and that her father recently died, leaving her his old logbooks.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`opening-hook`, `first-page`, `manuscript-revision`, `fiction-craft`, `editing`],
    whyItWorks: `Weak opening pages are one of the most common and well-documented reasons manuscripts fail to hook an agent or reader, and the specific failure pattern is well known in the industry — description, backstory, or a character waking up alone with their thoughts before anything is actually at stake — yet a model asked simply to "make the opening better" will often polish the prose of that same weak structure rather than replacing the structure itself, because sentence-level improvement is a safer, more bounded task than committing to a genuinely different entry point into the story. Requiring three options that each use a distinct entry strategy, rather than three lightly reworded versions of the same scene, forces GPT-5.1 to actually test different structural solutions instead of converging on one "safe" fix, which matters because the right entry point for a given story isn't obvious in advance and a writer benefits from seeing real alternatives rather than variations on a single guess. The instruction to flag required context that doesn't naturally fit the opening, rather than forcing all of it in, directly targets the most common reason writers themselves produce backstory-heavy openings: they've been told certain information is essential and try to front-load all of it, which is precisely the instinct that produces an opening full of exposition instead of action — separating what's genuinely needed on page one from what only feels urgent to the author is the actual fix, and a model that silently complies with "all of this is non-negotiable" reproduces the same problem rather than solving it. Requiring each option to raise an explicit, stated question that only continued reading resolves operationalizes "hook" into something checkable rather than a vague quality judgment — if a reader can't name the specific unanswered question after reading the page, the page hasn't actually hooked them regardless of how well-written the prose is.`,
    exampleOutput: `Option 2 (mid-conversation, something already at stake): "You're going to tell me the truth about that logbook, or I will." Maria set the leather-bound book on the table between them, its spine cracked from forty years of being kept somewhere no one would look. Her father didn't reach for it. Question raised: what actually happened the night the log was falsified, and why has Maria waited until now to confront it?`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'writing-social-post-from-messy-work-anecdote',
    category: 'writing',
    title: `Turn a messy, real work anecdote into a social post that doesn't read like every other founder story`,
    description: `Takes your rough, unedited memory of something that actually happened at work and shapes it into a platform-ready story post with a real narrative arc — without sanding it down into the same three LinkedIn cliché openers everyone recognizes and scrolls past.`,
    promptText: `You are shaping a real thing that happened into a social media story post. I'm going to give you the anecdote roughly as I remember it — out of order, missing some details, probably longer in the wrong places and shorter in the important ones. Your job is to find the actual narrative inside it, not to summarize it or dress it up with generic hooks.

THE RAW ANECDOTE (as I remember it, unedited)
{{raw_anecdote}}

WHERE THIS IS GOING
{{platform}}

THE POINT IT NEEDS TO LAND ON
{{narrative_takeaway}}

WHAT'S OFF LIMITS TO REVEAL
{{vulnerability_boundary}}

OPENING LINE CONSTRAINT
{{hook_constraint}}

HOW TO BUILD THE STORY
First, read through the raw anecdote and identify where the actual tension is — the moment something was uncertain, at risk, or about to go wrong, even if I buried it in the middle of my notes. A story post that opens with the setup and only gets to the tension in paragraph three has already lost the scroll; reorder the events around that moment, don't just retell them chronologically. Cut every detail that doesn't serve the specific takeaway I gave you, even if it's a detail I clearly liked — a story with three morals is a story with none, and "interesting but irrelevant" detail is the single biggest reason these posts run long and land soft. Write the opening line to the exact constraint I gave you, and if the most natural opening line you can find violates that constraint, tell me instead of quietly writing around it. Do not resolve the tension too early — hold the reader in the uncertain middle for at least two sentences longer than feels comfortable, since a story that gives away the outcome in the second line has nothing left pulling the reader down. End on the specific takeaway, stated as something the reader can actually use or recognize in their own situation, not as a moral wrapped in a hashtag.

WHAT NOT TO DO
Do not open with a rhetorical question, "nobody talks about," a bolded contrarian one-liner, or any other opener that's become a recognizable template on its own — if my raw anecdote already has a more specific, less generic first line buried in it, surface that one instead. Do not pad the piece with a listicle of "lessons learned" at the end; one takeaway, stated once, is stronger than three stated as bullets. Do not invent details, dialogue, or outcomes that weren't in what I gave you — if a beat is missing and the story genuinely needs it, ask me for it rather than filling it in with something plausible-sounding.

OUTPUT FORMAT
1. The finished post, formatted for the platform I named (line breaks, length, and structure appropriate to it).
2. One line naming which real moment you built the tension around, so I can confirm you picked the right one.
3. If the hook constraint conflicted with the strongest available opening line, say so and show me both options.`,
    variables: [
      {
        name: 'raw_anecdote',
        description: `The real story as you remember it, in whatever rough order it comes out — notes, not prose.`,
        example: `So we had this client who wanted to cancel like two days before their product launch, they were panicking about a bug we hadn't even confirmed was real yet, I remember it was a Friday night and I was the only one who saw the Slack message, turned out to be a caching issue on their end not ours, but I didn't know that yet when I called them`,
        required: true,
      },
      {
        name: 'platform',
        description: `Where this is being posted, which sets length and format.`,
        example: `LinkedIn text post, single column, no image — needs to work broken into short line-break paragraphs.`,
        required: true,
      },
      {
        name: 'narrative_takeaway',
        description: `The one thing you want the reader to walk away with — not a list of lessons, just one.`,
        example: `That staying reachable on a Friday night, even when it's not technically your job, is what actually saves client relationships — not the fix itself.`,
        required: true,
      },
      {
        name: 'vulnerability_boundary',
        description: `What must not be disclosed or identifiable, even implicitly (client name, exact numbers, coworkers involved).`,
        example: `Don't name the client or the product, don't imply which coworker didn't see the Slack message first.`,
        required: true,
      },
      {
        name: 'hook_constraint',
        description: `A specific rule for the opening line, if you have one, beyond just 'make it good.'`,
        example: `Open with a concrete detail or moment, not a question or a claim about what 'nobody' talks about.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`storytelling`, `social-media`, `linkedin`, `content-writing`, `narrative-structure`, `personal-branding`],
    whyItWorks: `GPT-5.1's default move on a request like 'turn this into a LinkedIn post' is to reach for the format it has seen most densely represented in training data for that exact request — the rhetorical-question hook, the chronological retell, the closing bullet list of 'lessons learned' — because those are the statistically safe, most-reinforced shape of a 'story post' as a genre, not because they're actually the strongest version of your specific story. Explicitly banning that named set of openers in the WHAT NOT TO DO section forces the model off its highest-probability default and back into the raw material you actually gave it, which is the only place a genuinely non-generic opening line can come from. The instruction to reorder around the tension rather than retell chronologically matters because models tend to preserve the sequence information was given in unless told otherwise — a chronological brain-dump fed in raw comes back as a chronological post unless the prompt explicitly authorizes restructuring, which is why the anecdote is deliberately supplied out of order here rather than pre-organized. Naming one single takeaway rather than letting the model infer 'the lessons' is what prevents the closing-bullet-list failure mode: an unconstrained model asked to wrap up a story will often hedge by offering two or three possible takeaways so it can't be wrong about which one you wanted, which is exactly the flattening effect that makes so many of these posts forgettable. The instruction not to invent missing beats matters mechanically too — a model filling narrative gaps with plausible-sounding invented dialogue or detail is the single fastest way a personal story stops being true, and asking the model to flag the gap instead keeps the authorship and factual accuracy with you rather than quietly delegating it.`,
    exampleOutput: `Friday, 9:47pm. A Slack message from a client I almost didn't see. Two days before their launch, they wanted out — convinced a bug we hadn't even confirmed was ours was about to blow up their weekend. [...] I picked up the phone not because it was my job, but because nobody else had seen the message yet. It turned out to be a caching issue on their end. That part didn't matter. What mattered was that someone answered. That's the part of client work nobody puts in the deck: the fix is rarely what saves the relationship. Being reachable when it counts is.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
