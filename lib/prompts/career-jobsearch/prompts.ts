import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'career-jobsearch-resume-tailoring-jd-keyword-match',
    category: 'career-jobsearch',
    title: `Rewrite your resume against one job description without inventing new experience`,
    description: `Maps your actual resume bullets against a specific job posting, rewrites the ones worth saving to mirror the posting's real priorities, and flags gaps honestly instead of papering over them with borrowed language.`,
    promptText: `You are helping me tailor my resume to one specific job posting. This is not a generic resume polish — every change has to trace back to something the posting actually asks for, and I want to know what you couldn't fix, not just what you improved.

MY CURRENT RESUME
{{resume_text}}

TARGET JOB POSTING
{{job_posting_text}}

ROLE LEVEL I'M APPLYING AT
{{seniority_level}}

BULLETS I'M UNSURE ABOUT
{{uncertain_bullets}}

STEP 1 — EXTRACT THE POSTING'S REAL PRIORITIES
Read the posting and list the 5-8 requirements or responsibilities that actually differentiate this role from a generic version of the same title — skip boilerplate lines every posting in this field includes ("strong communication skills") unless the posting gives them unusual weight or repeats them.

STEP 2 — MAP MY RESUME AGAINST THOSE PRIORITIES
For each priority, tell me which existing bullet on my resume already speaks to it (quote it), which priority has no matching bullet at all, and which bullet is technically related but currently buried in vague language that hides the match.

STEP 3 — REWRITE ONLY WHAT'S WORTH REWRITING
For bullets that map to a real priority, rewrite them to lead with the outcome and use the posting's own terminology where it's accurate to my experience — never invent a metric, tool, or scope I didn't give you. For bullets that map to nothing on the posting, leave them as-is and tell me they're likely to read as filler to this specific reader, don't silently cut them since I may want them for other applications.

WHAT NOT TO DO
Do not add skills, tools, years of experience, or outcomes I did not state, even if the posting clearly wants them — if there's a real gap, name it in Step 4 instead of quietly closing it with invented text. Do not reorder my whole resume structure unless the posting's priority order genuinely contradicts my current bullet order.

STEP 4 — HONEST GAP CALL-OUT
List the priorities from Step 1 that my resume genuinely cannot support, and one sentence each on whether that's a dealbreaker gap or something a cover letter could reasonably address instead.

OUTPUT FORMAT
A priorities table (priority / matching bullet or "none" / gap severity), the rewritten bullets grouped by resume section, and the Step 4 gap list.`,
    variables: [
      {
        name: 'resume_text',
        description: `Your current resume content, pasted as plain text.`,
        example: `Senior Product Analyst, Meridian Health (2022-present): Built weekly reporting dashboards for the clinical ops team using SQL and Looker...`,
        required: true,
      },
      {
        name: 'job_posting_text',
        description: `The full text of the specific job posting you're applying to.`,
        example: `Senior Product Analyst — Care Navigation. Own the metrics layer for a 12-person product team, partner with data engineering on a self-serve reporting migration, present findings to VP-level stakeholders monthly...`,
        required: true,
      },
      {
        name: 'seniority_level',
        description: `The level you're applying at, especially if it differs from your current title.`,
        example: `Applying as Senior, same level as my current title, not a step up.`,
        required: true,
      },
      {
        name: 'uncertain_bullets',
        description: `Any bullets you already suspect are weak or filler, so the model checks them specifically.`,
        example: `The 'cross-functional collaborator' bullet at the bottom — I added it late and I'm not sure it says anything.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`resume`, `job-description-matching`, `ats`, `career-tailoring`, `job-search`],
    whyItWorks: `The failure mode this avoids is the most common one in AI-assisted resume editing: a model asked to "tailor this resume to this job" will happily invent a matching metric or reword a responsibility into something the candidate never actually did, because closing every gap reads as more helpful than leaving one open. Forcing an explicit Step 1/Step 2 extraction-then-mapping sequence before any rewriting happens changes what the model is optimizing for — it has to name the specific posting requirement a bullet maps to before it's allowed to touch that bullet's language, which makes a fabricated match visible as an unsupported claim rather than letting it disappear into a plausible-sounding rewrite. The explicit "leave it as-is and tell me" instruction for unmapped bullets matters because GPT-5.1's default instinct on a tailoring task is to touch everything on the page to look thorough, which quietly erodes bullets that might matter for a different application the candidate is running in parallel — most job seekers keep one resume that gets tailored per role, not fifteen resumes, so silent overwrites compound. Requiring a final honest gap list rather than stopping at the rewrite is the part that actually protects the candidate: an ATS-savvy hiring manager or the ATS itself will find the same gap the model just glossed over, so surfacing it lets the candidate decide whether to address it in a cover letter, a portfolio addendum, or simply accept the risk — a decision only the candidate can make, not one a rewrite should make silently on their behalf.`,
    exampleOutput: `Priority: 'own the metrics layer for a 12-person product team' — Matching bullet: 'Built weekly reporting dashboards...' (partial match, scope unclear). Rewritten: 'Owned the metrics layer for a 12-person product team, building and maintaining the weekly reporting dashboards clinical ops relied on for prioritization.' Gap: no bullet addresses 'self-serve reporting migration' — this is a real gap, likely worth one sentence in your cover letter rather than a fabricated resume line.`,
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
    slug: 'career-jobsearch-ats-resume-formatting-audit',
    category: 'career-jobsearch',
    title: `Audit your resume file for the specific ways applicant tracking systems mis-parse it`,
    description: `Checks your resume's actual formatting choices — tables, columns, headers, file structure — against known ATS parsing failure points, rather than giving generic 'use simple formatting' advice.`,
    promptText: `Act as someone who has actually looked at how applicant tracking systems parse resumes and mis-parse them — not a generic formatting checklist, but a review of the specific choices in this document.

MY RESUME (describe layout and paste text)
{{resume_description_and_text}}

FILE FORMAT I PLAN TO SUBMIT
{{file_format}}

SECTIONS I'VE USED
{{section_headers}}

ANY VISUAL ELEMENTS
{{visual_elements}}

Check for these specific parsing failure points, and only report the ones that actually apply to this document:

1. Multi-column layouts or text boxes — these are read out of order or dropped entirely by many parsers, so anything inside one may not reach the ATS's parsed text at all.
2. Non-standard section headers — a parser matching against expected headers ("Work Experience," "Education") may fail to bucket content under a header like "My Journey" or "Where I've Been," even though a human reader would understand it fine.
3. Tables used for skills or dates — table cell content is frequently concatenated in the wrong order or lost when a parser flattens the table.
4. Contact info in a header/footer field — some parsers don't read document headers/footers at all, which can mean your name and email never make it into the parsed candidate record.
5. Dates in an inconsistent or unusual format — a parser trying to calculate total years of experience can miscount if date formats vary between entries.
6. Special characters or icons used as bullet points or section dividers — these sometimes render as garbage characters or get stripped, breaking the visual structure a human reviewer would later see in the ATS's rendered view.
7. File format itself — note if the chosen format is more or less reliably parsed than the alternative.

For every issue found, tell me exactly which resume element triggers it, what a parser is likely to do with it, and the minimal fix that preserves the visual choice as much as possible rather than defaulting to "just make it plain text."

WHAT NOT TO DO
Do not tell me to strip all formatting and visual identity from the resume as a first resort — most of these systems can handle single-column layouts with normal headers just fine, so only flag genuine risk points, and say explicitly if the resume has none.

End with a one-line verdict: safe to submit as-is, or specific fixes needed before submitting.`,
    variables: [
      {
        name: 'resume_description_and_text',
        description: `A description of your resume's visual layout plus the pasted text content.`,
        example: `Two-column layout — left column has skills and a headshot, right column has experience. Text: [pasted resume content]`,
        required: true,
      },
      {
        name: 'file_format',
        description: `The file format you're planning to submit.`,
        example: `PDF exported from Canva.`,
        required: true,
      },
      {
        name: 'section_headers',
        description: `The exact section header text you've used.`,
        example: `My Story, What I Bring, Where I've Worked, Credentials`,
        required: true,
      },
      {
        name: 'visual_elements',
        description: `Any icons, tables, graphics, or non-text elements on the resume.`,
        example: `Skill bars (visual progress bars) for software proficiency, a small icon next to each contact detail.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`ats`, `resume-formatting`, `resume-audit`, `job-search`, `parsing`],
    whyItWorks: `The generic version of this advice — "use a simple ATS-friendly template" — is unhelpful because it doesn't tell a candidate whether their specific document has a real problem or a cosmetic one, and it pushes people to strip visual identity they didn't need to strip. Structuring the prompt as a checklist of seven named, specific parsing failure modes forces the model to check the actual document against each one and report only what applies, rather than defaulting to the same boilerplate warning regardless of input — a two-column layout with a headshot genuinely does risk column-order scrambling in older ATS parsers, but a single-column resume with a slightly unusual section header like "Where I've Worked" has a narrower, more specific risk (header-matching failure on that one section, not the whole document). Asking for the minimal fix that preserves the visual choice, rather than defaulting to plain text, matters because over-correction is the most common bad advice in this space — most modern ATS platforms (Workday, Greenhouse, Lever) parse single-column PDFs with normal fonts reasonably well, so a candidate who guts every visual choice out of fear is trading a real but narrow risk for a resume that reads as less considered to the human reviewer who sees it after the ATS parses it. The explicit "what not to do" instruction exists because a model asked to audit formatting will often pattern-match to generic ATS folklore (never use PDF, never use any icon) that isn't actually true across the range of systems in use, and stating that constraint upfront keeps the answer grounded in the specific document rather than reciting outdated rules.`,
    exampleOutput: `Issue found: two-column layout. Your skills and headshot sit in a left column that many ATS parsers will read out of sequence with your right-column experience text, potentially interleaving the two into garbled parsed text. Fix: move skills to a single-column block either above or below your experience section rather than beside it; you can keep the headshot as a design element since most parsers ignore images rather than misreading them. Verdict: needs one structural fix before submitting.`,
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
    slug: 'career-jobsearch-cover-letter-role-specific-narrative',
    category: 'career-jobsearch',
    title: `Draft a cover letter built around one real reason you want this specific job, not a template`,
    description: `Builds a short cover letter around a genuine, specific connection between your background and this one role, and refuses to fall back on generic enthusiasm language when that connection is thin.`,
    promptText: `Help me write a cover letter for one specific job. I want it built around a real, specific reason I'm a fit for this role — not assembled from cover letter template phrases.

JOB POSTING
{{job_posting}}

COMPANY AND WHY IT CAUGHT MY ATTENTION
{{company_context}}

MY RELEVANT BACKGROUND
{{relevant_background}}

THE ONE THING I WANT THIS LETTER TO PROVE
{{core_thesis}}

TONE
{{tone_preference}}

Before writing anything, tell me honestly whether the material I've given you supports a genuinely specific letter or only a generic one — if my company context or core thesis is thin, say so and ask me one clarifying question rather than writing around the gap with enthusiasm language.

If the material supports a real letter, write it to this structure: open with the specific thing that connects me to this role or company (not "I am excited to apply"), spend the middle proving the core thesis with one or two concrete details from my background rather than restating my resume, and close with a specific, low-pressure next step rather than a generic "I look forward to hearing from you."

Length: no more than 300 words. A cover letter this long gets skimmed in under a minute, and padding it to look thorough works against that.

WHAT NOT TO DO
Do not use any of these phrases or their close variants: "I am writing to express my interest," "I believe I would be a great fit," "I am a highly motivated professional," "team player," "passionate about." If you catch yourself about to write a sentence that only exists to sound enthusiastic rather than to prove something specific, cut it.

After the letter, add a two-line note: which sentence in the letter is doing the most real work, and which sentence you kept only because cover letters conventionally include something like it (if any).`,
    variables: [
      {
        name: 'job_posting',
        description: `The job posting text.`,
        example: `Growth Marketing Manager at a Series B fintech, owns paid acquisition and lifecycle campaigns...`,
        required: true,
      },
      {
        name: 'company_context',
        description: `What specifically drew you to this company, not generic praise.`,
        example: `I used their budgeting app for two years before they had a marketing team big enough to hire for this role, and I have specific opinions about where their onboarding funnel loses people.`,
        required: true,
      },
      {
        name: 'relevant_background',
        description: `Your actual relevant experience, in your own words.`,
        example: `Ran paid acquisition for a smaller fintech competitor for 3 years, cut CAC by 30% by killing underperforming channels rather than adding new ones.`,
        required: true,
      },
      {
        name: 'core_thesis',
        description: `The one specific claim you want the letter to prove about your fit.`,
        example: `That I understand this exact user (budget-conscious millennials) because I've marketed to the same segment, not just fintech broadly.`,
        required: true,
      },
      {
        name: 'tone_preference',
        description: `How direct or formal you want the letter to read.`,
        example: `Direct and slightly informal — this company's own marketing voice is casual, so a stiff formal letter would read as tone-deaf.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`cover-letter`, `job-application`, `narrative-writing`, `career-tailoring`, `job-search`],
    whyItWorks: `Cover letters generated by AI models tend to read as interchangeable because the model, left to its own defaults, reaches for the same register of enthusiasm phrases that show up across millions of training examples of this exact document type — "passionate about," "great fit," "excited to apply" are statistically the most common phrases in this genre, which is exactly why a hiring manager who reads dozens of these a week recognizes them instantly as filler. Naming the specific banned phrases directly, rather than giving a vague instruction like "avoid clichés," works because GPT-5.1 can reliably avoid a named phrase but is much less reliable at self-identifying what counts as a cliché in the abstract — an explicit list gives it a checkable constraint instead of a vibe to interpret. The upfront honesty check, where the model has to assess whether the input material actually supports a specific letter before writing one, exists because the alternative failure mode is worse than a generic letter: a model asked to write something specific from thin material will often invent a plausible-sounding but false connection to the company rather than admit the gap, and a candidate who ships a cover letter built on a fabricated detail risks it surfacing badly in an interview when asked to elaborate on something they never actually said. The closing self-assessment — which sentence does the most work, which is filler — gives the candidate a fast way to spot-check the output themselves rather than trusting a confident-sounding letter at face value, which matters because a model's own confidence in its writing is not a reliable signal of whether it actually avoided the traps it was told to avoid.`,
    exampleOutput: `"I've used [Company]'s app for two years, back when it was just budgeting alerts — I have specific opinions about where the onboarding funnel loses people, because I watched myself almost drop off at the same step. At my last role, I cut CAC 30% not by adding channels but by killing three that looked fine in aggregate and were quietly burning budget on users who never activated..." Most-work sentence: the CAC line, because it's the one concrete proof point. Kept-by-convention sentence: none — every line ties to the thesis.`,
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
    slug: 'career-jobsearch-linkedin-about-section-rewrite',
    category: 'career-jobsearch',
    title: `Rewrite your LinkedIn About section so it reads like a person a recruiter would message, not a résumé restated`,
    description: `Turns your background into a first-person About section built around what you actually want your next role to be, structured for the way people actually skim LinkedIn profiles.`,
    promptText: `Rewrite my LinkedIn About section. Most About sections just restate the resume in first person — I want mine to actually help someone deciding whether to message me.

CURRENT ABOUT SECTION (if any)
{{current_about_text}}

MY BACKGROUND, IN MY OWN WORDS
{{background_summary}}

WHAT I ACTUALLY WANT NEXT
{{target_direction}}

WHO I WANT TO READ THIS AND ACT ON IT
{{intended_reader}}

Anyone reading a LinkedIn About section is deciding, in the first two lines before the "see more" cutoff, whether to keep reading — so those first two lines have to do real work, not warm up with a generic opening like "I am a results-driven professional with X years of experience."

Structure it like this: open with a specific, concrete statement of what you actually do and for whom, phrased so the first two lines work standalone even if nobody clicks "see more." Follow with 2-3 short paragraphs that give one real example each of the kind of problem you solve, using specifics from my background rather than restating job titles. Close with an explicit, low-friction statement of what you're open to right now, matched to who I said I want reading this — a hiring manager wants different signal than a former colleague deciding whether to refer you internally.

Keep total length under 150 words for the section before "see more" logic typically truncates, and under 400 words total.

WHAT NOT TO DO
Do not use third person. Do not open with your job title as the first words. Do not include a skills list — LinkedIn already has a dedicated Skills section for that, and repeating it here wastes the About section's actual value.

After the rewrite, tell me in one sentence what specific claim in the new version a reader could fact-check against my Experience section below it, and confirm it holds up.`,
    variables: [
      {
        name: 'current_about_text',
        description: `Your existing About section text, if you have one.`,
        example: `I am a results-driven marketing professional with 8 years of experience in B2B SaaS...`,
        required: false,
      },
      {
        name: 'background_summary',
        description: `Your background described in your own words, not resume bullets.`,
        example: `I've spent the last 6 years figuring out how to make enterprise software demos actually convert, mostly by rebuilding sales decks nobody else wanted to touch.`,
        required: true,
      },
      {
        name: 'target_direction',
        description: `What you actually want your next role or opportunity to be.`,
        example: `I want to move from individual contributor sales engineering into a role that owns the demo strategy for a whole product line.`,
        required: true,
      },
      {
        name: 'intended_reader',
        description: `Who you most want to read this and take action.`,
        example: `Sales engineering directors at mid-size B2B SaaS companies who are hiring, plus former colleagues who might refer me.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`linkedin`, `personal-branding`, `profile-optimization`, `job-search`, `networking`],
    whyItWorks: `LinkedIn truncates the About section behind a "see more" link after roughly two to three lines on both desktop and mobile, which means the overwhelming majority of profile viewers only ever read that opening fragment — a fact most AI-generated About sections ignore entirely, opening instead with a warm-up sentence ("I am a results-driven professional...") that burns the only guaranteed-visible real estate on a sentence that could apply to almost anyone. Instructing the model to make the first two lines work as a standalone unit forces it to front-load the one specific, differentiating claim rather than treating the opening as throat-clearing before the "real" content later in the section that most readers will never scroll to see. The instruction to match the closing call-to-action to a specific named reader — a hiring manager versus a former colleague considering a referral — matters because those two readers are looking for structurally different signals: a hiring manager wants a checkable statement of what you're open to and roughly when, while a colleague considering a referral wants enough specificity to know which of their own contacts to mention you to, and a single generic "open to new opportunities" line serves neither well. The closing fact-check instruction addresses a subtler risk: a rewritten About section that reads compellingly can drift into a claim that isn't quite supported by what's actually listed in the Experience section beneath it, and a profile viewer who scrolls down expecting the About section's claim to be substantiated and finds a mismatch loses trust in the whole profile — catching that gap before publishing is cheaper than fixing it after a recruiter has already formed the impression.`,
    exampleOutput: `"I make enterprise software demos actually convert — usually by rebuilding the deck nobody else wanted to touch. Six years doing this at [Company/industry], watching where prospects tune out and fixing that specific moment..." Fact-check note: the claim 'six years' should match the total tenure visible in your Experience section below — confirm before publishing.`,
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
    slug: 'career-jobsearch-linkedin-headline-positioning',
    category: 'career-jobsearch',
    title: `Write a LinkedIn headline that says what you actually do, not a stack of buzzwords`,
    description: `Generates several genuinely different headline options built around your actual positioning and target audience, each with a stated trade-off, instead of one templated buzzword string.`,
    promptText: `Write me LinkedIn headline options. Most headline advice produces a string of separator-pipe buzzwords ("Growth | Strategy | Innovation") that says nothing specific — I want options that actually communicate something a real reader would act on.

WHAT I ACTUALLY DO
{{what_you_do}}

HOW I WANT TO BE FOUND
{{search_context}}

CURRENT HEADLINE (if any)
{{current_headline}}

WHO'S SEARCHING FOR SOMEONE LIKE ME
{{target_searcher}}

Generate 4 headline options, each testing a genuinely different positioning angle rather than four rewordings of the same idea:
1. Role-and-outcome framing — leads with your function and the concrete result you produce.
2. Audience-first framing — leads with who you serve, useful if being found by that specific audience matters more than your title.
3. Specificity-over-breadth framing — narrows to your actual niche even if it sounds less impressive-sounding than a broader title would.
4. One option that deliberately breaks the "pipe-separated buzzwords" convention entirely and reads as one plain sentence.

For each option, stay within LinkedIn's 220-character limit, and after each one add a one-line note on what kind of searcher or reader it's optimized for and what it deliberately trades away.

WHAT NOT TO DO
Do not use vague nouns like "Innovator," "Thought Leader," "Change Agent," or "Synergy" in any option — these are the exact words that make headlines interchangeable and searchable-keyword-poor at the same time. Do not stack more than one job title with a slash unless I actually hold both roles concurrently right now.

End with your own recommendation of which option to use given what I said about how I want to be found, and why the others are worse fits for that specific goal rather than just worse in general.`,
    variables: [
      {
        name: 'what_you_do',
        description: `A plain description of your actual function and what you produce.`,
        example: `I design onboarding flows for B2B SaaS products, specifically the first-7-days experience that determines whether a trial converts.`,
        required: true,
      },
      {
        name: 'search_context',
        description: `What you actually want to be found for on LinkedIn — recruiter search, industry visibility, referrals.`,
        example: `I want recruiters searching for 'product designer onboarding' or 'UX activation' to find me, more than general 'product designer' search traffic.`,
        required: true,
      },
      {
        name: 'current_headline',
        description: `Your existing headline, if you have one.`,
        example: `Product Designer | UX | Growth | SaaS`,
        required: false,
      },
      {
        name: 'target_searcher',
        description: `Who you believe is actually searching LinkedIn for someone like you.`,
        example: `In-house recruiters and hiring managers at Series B-D SaaS companies filling a senior product design role.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`linkedin`, `headline`, `personal-branding`, `job-search`, `keyword-optimization`],
    whyItWorks: `LinkedIn's own recruiter search tooling matches keywords in the headline field with real weight, which is exactly why the pipe-separated buzzword convention became common — but the specific words most people default to ("Innovator," "Thought Leader," "Synergy") are not terms recruiters actually type into a search bar, so the convention's form survives while its original keyword-matching function has been hollowed out by word choice. Generating four options built around genuinely different positioning logics, rather than four surface rewordings, forces the model to actually reason about the trade-off between searchability and impressiveness-sounding language instead of defaulting to one safe middle-ground answer that tries to please everyone and therefore optimizes for no one in particular. The audience-first framing option exists because most headline advice defaults to role-first framing without asking whether the person's actual goal is to be found by title-matching search versus by a specific type of reader recognizing themselves in the description — these produce structurally different headlines, and asking for both surfaces the trade-off explicitly rather than silently picking one. Naming the specific banned words directly, the same mechanism as the cover letter and About section prompts in this same batch, works better than "avoid buzzwords" as an instruction because GPT-5.1 can reliably suppress a named term but treats "buzzword" itself as a vague category it interprets inconsistently across separate generations. The closing recommendation, tied explicitly back to the stated search goal rather than a general "which is best," keeps the model from hedging with "it depends" as its final answer, which is a common failure mode when a model is asked to choose among its own generated options without a concrete goal to weigh them against.`,
    exampleOutput: `Option 2 (audience-first): 'Helping B2B SaaS teams fix the first 7 days of trial — before churn decides for you.' Trade-off: strong hook for a hiring manager who already has this exact problem, weaker for keyword search on 'Product Designer' broadly. Recommendation: given you said recruiters searching 'UX activation' matter more than broad title search, Option 3 (specificity-over-breadth) is the better fit — it contains the actual search term.`,
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
    slug: 'career-jobsearch-job-description-decoder',
    category: 'career-jobsearch',
    title: `Decode what a job posting is really asking for versus what it's just listing`,
    description: `Separates a job posting's actual must-have requirements from boilerplate padding and reads between the lines for what the posting's phrasing implies about team maturity, scope, and likely day-to-day.`,
    promptText: `I need you to decode a job posting, not summarize it. Job postings mix genuine requirements with boilerplate and sometimes signal things about the role that aren't stated directly — I want that separated out.

JOB POSTING
{{job_posting_text}}

WHAT I ALREADY KNOW ABOUT THIS COMPANY
{{known_company_context}}

WHAT I'M UNSURE WHETHER TO APPLY FOR
{{application_hesitation}}

Do four things with this posting:

1. MUST-HAVE VS BOILERPLATE. Separate the requirements into ones this specific posting seems to genuinely care about (repeated, given detail, tied to a named responsibility) versus ones that read as standard boilerplate every posting for this title includes regardless of the actual role ("strong communication skills," "bachelor's degree preferred"). Tell me which list each requirement lands in and why.

2. WHAT THE PHRASING IMPLIES BUT DOESN'T STATE. Read between the lines on scope and maturity — does the phrasing suggest this role is being created for the first time versus backfilling someone, does the listed responsibility list suggest one person is meant to cover work that's usually split across two roles, does an unusually long "nice to have" list suggest the team doesn't actually know what they need yet. Flag anything like this as an inference, clearly labeled as your read rather than a stated fact.

3. QUESTIONS WORTH ASKING IN AN INTERVIEW. Based on what's ambiguous or implied rather than stated, give me 3 questions that would clarify the gap, phrased the way I'd actually ask them in an interview rather than as generic "what does success look like" questions.

4. FIT CHECK AGAINST MY HESITATION. Given what I said I'm unsure about, tell me directly whether this posting's actual (non-boilerplate) requirements resolve that hesitation one way or the other, and say so even if the honest answer is that the posting doesn't give you enough to tell.

WHAT NOT TO DO
Do not just restate the posting's bullet points back to me in a different order — every line of output should add interpretation the posting itself didn't spell out, or it isn't worth including.`,
    variables: [
      {
        name: 'job_posting_text',
        description: `The full job posting text.`,
        example: `Senior Data Analyst — a newly created role reporting to the Head of Ops. Own reporting for a team of 40, build the first version of a metrics dashboard from scratch, present to leadership monthly. Nice to have: SQL, Python, Tableau, Looker, dbt, Airflow, stakeholder management, forecasting experience, familiarity with logistics...`,
        required: true,
      },
      {
        name: 'known_company_context',
        description: `Anything you already know about the company that's relevant to reading the posting.`,
        example: `They raised a Series B six months ago and I've heard from a friend there that ops is still fairly scrappy/undefined.`,
        required: false,
      },
      {
        name: 'application_hesitation',
        description: `The specific thing making you unsure whether to apply.`,
        example: `I'm worried 'newly created role' means no infrastructure exists yet and I'd spend a year just building pipes instead of doing analysis.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`job-description`, `job-search-strategy`, `interview-prep`, `career-research`, `application-strategy`],
    whyItWorks: `A job posting is written by whoever had time to write it — sometimes the hiring manager, sometimes recruiting, sometimes a template inherited from the last time the role was open — and its phrasing carries real signal about team maturity and scope that a plain summary discards by flattening everything into one undifferentiated bullet list. Splitting requirements into genuinely-emphasized versus boilerplate works because postings tend to give real weight (repetition, specificity, tie to a named responsibility) to what the hiring manager actually cares about, while requirements copied from an HR template read as generic and disconnected from the rest of the text — a model instructed to look for that contrast, rather than just listing every bullet at equal weight, surfaces a distinction a skimming human reader usually processes intuitively but couldn't necessarily articulate. The instruction to clearly label inferences as inferences rather than facts matters because this is exactly the kind of task where a confident-sounding model could present a guess ("this role is probably a demotion for someone") with the same authority as a directly stated fact from the posting, and a candidate making an application or negotiation decision needs to know which parts of the analysis are solid ground versus informed speculation. Generating interview questions from the ambiguous parts specifically, rather than generic culture-fit questions, is more useful because it turns the decode into something actionable in the actual interview — a candidate who asks "is this role backfilling someone or is the team splitting existing scope onto a new headcount" gets real signal back, while a generic "what does a typical day look like" question rarely surfaces the same information.`,
    exampleOutput: `Must-have (emphasized): 'own reporting for a team of 40' and 'build the first version of a metrics dashboard from scratch' — both tied to specific, named responsibility. Boilerplate: the six-tool 'nice to have' list reads as the team not yet knowing their own stack, likely inherited from a generic template. Inference (labeled as a read, not fact): a newly created role with an unusually long tool wishlist and a Series B six months ago suggests ops infrastructure is genuinely immature — your hesitation about spending a year on pipes rather than analysis is well-founded and worth asking about directly.`,
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
    slug: 'career-jobsearch-skill-gap-analysis-plan',
    category: 'career-jobsearch',
    title: `Turn a job posting's requirements gap into a specific, time-boxed plan instead of a vague skills list`,
    description: `Compares your actual skills against a target role's requirements and produces a concrete closing plan with real time estimates, rather than a generic list of things to learn someday.`,
    promptText: `Compare my current skills against what a target role actually requires, and build me a specific plan to close the real gap — not a vague "learn Python" list.

MY CURRENT SKILLS AND EXPERIENCE
{{current_skills}}

TARGET ROLE REQUIREMENTS
{{target_role_requirements}}

TIME I REALISTICALLY HAVE
{{available_time}}

MY LEARNING CONSTRAINTS
{{learning_constraints}}

Work through this in phases:

PHASE 1 — REAL GAP, NOT SURFACE GAP
For each requirement in the target role, classify it as: already have it (say where it shows in my background), transferable (I have something adjacent that would close most of the gap with practice, not from-scratch learning), or genuine gap (I have nothing close to this). Be skeptical of your own "transferable" calls — if it's a stretch, say so rather than rounding up to make the gap look smaller than it is.

PHASE 2 — PRIORITIZE BY WHAT ACTUALLY BLOCKS APPLYING
Of the genuine gaps, tell me which ones would likely get my application filtered out before a human even reads it (hard requirement, keyword-matched, or asked directly in a screening question) versus which ones matter more once I'm already in front of a person, since those two categories need different urgency.

PHASE 3 — TIME-BOXED CLOSING PLAN
Given the time I actually have, build a plan only for the gaps that are worth closing before I start applying versus ones I should plan to close after landing an interview or even after starting the role. For each gap in the "close before applying" bucket, give a specific method (not "take a course" in the abstract — name the type of resource and a realistic time estimate) and be honest if the timeline I have isn't enough to genuinely close a given gap, rather than compressing a plan to fit a deadline that can't support it.

WHAT NOT TO DO
Do not recommend generic "learn X" advice without tying it to a specific proof point I could show or talk about in an interview — a skill only counts as closed if I could demonstrate it, not just claim it.

OUTPUT FORMAT
A three-column gap table (requirement / current status / priority), then the time-boxed plan only for the gaps worth closing now, then one paragraph on what to say honestly about any gap you're advising me to leave open.`,
    variables: [
      {
        name: 'current_skills',
        description: `Your actual current skills and experience, described honestly.`,
        example: `5 years as a backend engineer in Python/Django, no real frontend experience beyond basic HTML/CSS, never worked with a design system.`,
        required: true,
      },
      {
        name: 'target_role_requirements',
        description: `The requirements of the role you're targeting.`,
        example: `Full-stack engineer role requiring React, TypeScript, and comfort working directly from Figma designs without a dedicated frontend dev.`,
        required: true,
      },
      {
        name: 'available_time',
        description: `How much time you realistically have before you plan to start applying.`,
        example: `About 6 weeks, evenings and weekends only, alongside my current full-time job.`,
        required: true,
      },
      {
        name: 'learning_constraints',
        description: `Anything that limits how you can realistically learn.`,
        example: `I learn best by building something real, not by watching video courses passively — courses I've bought in the past I never finish.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`skill-gap-analysis`, `career-planning`, `upskilling`, `job-search-strategy`, `learning-plan`],
    whyItWorks: `A generic skill-gap output — "you should learn React and TypeScript" — is nearly useless on its own because it doesn't answer the question that actually determines what a candidate should do this week: is this gap severe enough to block getting past an ATS keyword filter or a screening question, or is it something that matters more once a human is already evaluating the whole candidate. Phase 2's split between application-blocking gaps and interview-stage gaps forces the model to reason about where in the funnel a given requirement actually gets checked, which changes the urgency and the kind of proof needed — a hard keyword-matched requirement needs something resume-visible fast, while a requirement that surfaces in a technical interview has more room for in-progress learning to be discussed honestly rather than fully mastered. The instruction to be skeptical of the model's own "transferable" classifications addresses a specific optimism bias: a model asked to assess how close someone's existing skills are to a requirement tends to round up, treating "I've touched HTML/CSS" as closer to "comfortable working from Figma designs" than it honestly is, because a smaller gap makes for a more encouraging-sounding answer — explicitly asking it to flag its own stretch calls counteracts that. Requiring every closing-plan item to tie to a demonstrable proof point, rather than accepting a course-completion certificate as sufficient, matters because what actually gets evaluated in an interview or portfolio review is whether the candidate can show or discuss the skill in action, not whether they can claim exposure to it — a plan built around proof points produces talking points for the interview itself, not just a private sense of having studied.`,
    exampleOutput: `Requirement: 'comfort working from Figma designs.' Status: genuine gap, not transferable — basic CSS knowledge doesn't cover component-based design system work. Priority: interview-stage, not application-blocking, since it's rarely a resume keyword filter. Plan: spend two weekends rebuilding one real Figma community file as working React components, so you have a specific link to show and discuss rather than a claimed familiarity.`,
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
    slug: 'career-jobsearch-interview-questions-role-prep',
    category: 'career-jobsearch',
    title: `Generate the interview questions this specific role is actually likely to ask, ranked by how likely they are`,
    description: `Predicts likely interview questions from the actual posting and interview stage rather than a generic 'top 50 interview questions' list, and ranks them by how likely this specific interviewer is to ask.`,
    promptText: `Predict the interview questions I'm actually likely to get for this specific interview — not a generic top-50 list that applies to any job with this title.

JOB POSTING
{{job_posting}}

INTERVIEW STAGE AND INTERVIEWER
{{interview_stage}}

MY BACKGROUND (so questions can be tailored to likely follow-ups on my specific history)
{{my_background}}

ANYTHING UNUSUAL ON MY RESUME AN INTERVIEWER MIGHT PROBE
{{resume_flags}}

Generate questions in three tiers, ranked within each tier by how likely they are given the specific posting and stage:

TIER 1 — ALMOST CERTAIN. Questions this interviewer is very likely to ask given the stage (a recruiter screen asks different things than a hiring manager round, which asks different things than a panel with a future peer) and the posting's stated priorities. For each, note which specific line in the posting or which fact about the stage makes you confident it's coming.

TIER 2 — LIKELY FOLLOW-UPS ON MY SPECIFIC HISTORY. Given what's on my resume, including anything unusual I flagged, predict the specific probing questions an attentive interviewer would ask about my background — a gap in employment, a short tenure, a career pivot, an unusual title. Don't just list "tell me about this gap" generically; phrase it the way an interviewer would actually ask given the specific fact.

TIER 3 — LOW-PROBABILITY BUT HIGH-STAKES IF ASKED. Questions unlikely for this stage but that would be hard to recover from if asked unprepared — flag these separately so I know they're worth a few minutes of prep even at low odds.

For every question across all tiers, add one line on what the interviewer is actually trying to learn by asking it, not just the question's surface topic — this determines how to answer it, not just what to say.

WHAT NOT TO DO
Do not include generic filler questions ("where do you see yourself in 5 years") unless something about this specific posting or stage makes it genuinely likely — most of these lists pad with the same dozen questions regardless of context.`,
    variables: [
      {
        name: 'job_posting',
        description: `The job posting for the role you're interviewing for.`,
        example: `Customer Success Manager at a B2B SaaS company, portfolio of 40 enterprise accounts, heavy focus on renewal and expansion revenue.`,
        required: true,
      },
      {
        name: 'interview_stage',
        description: `Which interview this is and who's conducting it.`,
        example: `Second round, 45 minutes with the VP of Customer Success who will be my direct manager.`,
        required: true,
      },
      {
        name: 'my_background',
        description: `Your relevant background and career history.`,
        example: `3 years as a CSM at a smaller startup, before that 2 years in sales — I moved from sales into CS.`,
        required: true,
      },
      {
        name: 'resume_flags',
        description: `Anything unusual on your resume you expect might get probed.`,
        example: `I left my last role after only 9 months, and I moved from a sales title into customer success, which isn't the usual path.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`interview-prep`, `interview-questions`, `job-interview`, `career-prep`, `job-search`],
    whyItWorks: `Generic "top interview questions for X role" lists are low-value precisely because they're generic — they apply equally to any posting with the same title regardless of what that specific posting emphasizes or what stage of the process is being prepped for, which means a candidate using one spends prep time on questions unlikely to actually come up while missing the ones specific to their situation. Tying Tier 1 questions explicitly back to a specific line in the posting or a fact about the interview stage forces the model to reason from this candidate's actual situation rather than pattern-matching to the generic training-data version of "customer success manager interview questions," and stating the source of each prediction lets the candidate judge the model's confidence themselves rather than take a flat list on faith. Tier 2's focus on resume-specific follow-ups matters because an attentive interviewer's most probing questions are frequently reactive to something specific on the resume in front of them — a nine-month tenure or an unusual career pivot — rather than generic behavioral questions, and these are exactly the questions a candidate is most likely to be unprepared for if they only rehearsed generic lists, since they can't be predicted without knowing the specific resume. Adding the "what is the interviewer actually trying to learn" line for every question is the mechanism that makes this genuinely useful for answering rather than just for prediction — a question's surface topic ("tell me about a time you handled conflict") often maps to a specific underlying concern (can this person de-escalate an angry enterprise client without escalating internally), and an answer aimed at the surface topic without addressing the underlying concern reads as technically responsive but ultimately unconvincing to the interviewer.`,
    exampleOutput: `Tier 2: 'You moved from sales into customer success after two years — what made you want off the number?' Likely because your resume flag names an unusual sales-to-CS pivot, and a VP hiring for renewal/expansion revenue will want to know you didn't just burn out on quota. What they're actually learning: whether you view CS as a retreat from sales pressure or a deliberate move toward a different kind of client relationship — answer toward the latter specifically.`,
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
    slug: 'career-jobsearch-interview-answers-talking-points',
    category: 'career-jobsearch',
    title: `Build talking points for a hard interview question from your real experience, not a script to memorize`,
    description: `Turns one specific, difficult interview question into a set of true talking points anchored in your actual experience, structured so you can speak them naturally rather than reciting a memorized paragraph.`,
    promptText: `I have a specific interview question I need to prepare for, and I don't want a script — I want talking points built from my real experience that I can speak naturally, in different words, every time I'm asked something like it.

THE QUESTION
{{interview_question}}

WHY THIS QUESTION IS HARD FOR ME SPECIFICALLY
{{why_hard}}

MY RELEVANT REAL EXPERIENCE
{{relevant_experience}}

WHAT I DON'T WANT TO SAY
{{things_to_avoid_saying}}

Do this in three parts:

PART 1 — WHAT THE QUESTION IS REALLY PROBING
One sentence on what an interviewer asking this is actually trying to learn about me, beyond the surface topic, so the talking points below aim at the real concern rather than a technically correct but off-target answer.

PART 2 — 3-4 TALKING POINTS, NOT A SCRIPT
Give me talking points as short phrases or bullet fragments I could glance at and speak from, not full sentences to memorize and recite — memorized answers read as memorized in an interview, and I want this to sound like me talking, not me reciting. Each talking point should anchor to something specific and true from my real experience, not a generic principle. Order them in the sequence I should actually hit them if I were speaking off the cuff, and note where the strongest point should land (usually not first, since interviewers remember what comes right before a pause more than what opens).

PART 3 — HANDLE THE HARD PART DIRECTLY
Given what I said makes this question hard for me specifically, and what I don't want to say, give me one honest way to acknowledge the hard part without volunteering more than necessary or lying about it — a version that would survive a good follow-up question rather than one that only works if the interviewer doesn't push.

WHAT NOT TO DO
Do not write this as a paragraph I'm meant to memorize and deliver verbatim. Do not tell me to just "be honest and confident" without giving me the actual words or specific angle to be honest and confident about — that instruction alone is not usable prep.`,
    variables: [
      {
        name: 'interview_question',
        description: `The specific interview question you need to prepare for.`,
        example: `Why did you leave your last job after only eight months?`,
        required: true,
      },
      {
        name: 'why_hard',
        description: `Why this specific question is difficult for you, honestly.`,
        example: `The real reason is I took the job without realizing the manager was going to be let go two months in, and the replacement manager and I didn't get along at all — I don't want to badmouth anyone.`,
        required: true,
      },
      {
        name: 'relevant_experience',
        description: `The real, true facts of your experience relevant to the question.`,
        example: `I delivered everything I was asked to in those 8 months, including a project the new manager later took credit for in a company all-hands, which is when I started looking.`,
        required: true,
      },
      {
        name: 'things_to_avoid_saying',
        description: `Anything you specifically don't want to say or imply in the answer.`,
        example: `I don't want to say anything that sounds like I'm blaming my old manager directly, even though there's truth to it.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`interview-answers`, `interview-prep`, `behavioral-interview`, `job-search`, `communication-coaching`],
    whyItWorks: `A full memorized script is a worse interview prep artifact than talking points because interview delivery of a memorized paragraph has a distinct, recognizable cadence — flatter intonation, recitation pauses, over-precise word choice — that experienced interviewers pick up on even when they can't articulate why an answer feels rehearsed, and it also breaks badly under a follow-up question that doesn't match the script's assumed path, leaving the candidate visibly stuck. Producing short talking-point fragments instead forces the candidate to actually reconstruct the sentence in their own words each time it's practiced, which is closer to how the answer will actually need to be produced live in the room, and the instruction to order them with the strongest point placed just before a natural pause rather than first exploits a real and well-documented memory effect in how interviewers recall answers — recency within a delivered answer weighs more than the same information delivered at the very start. Part 1's explicit statement of what the question is really probing matters because "why did you leave your last job" is rarely actually asking for a factual timeline — it's usually screening for whether the candidate handles conflict or disappointment professionally, and an answer that nails the facts but misses that underlying concern reads as technically responsive but not reassuring. Part 3's requirement that the honest angle survive a good follow-up question, rather than only working if the interviewer doesn't push, is the part that actually protects the candidate in a live conversation — an answer engineered to sound good on the first pass but collapse under "can you say more about that" is a bigger risk than a slightly less polished answer that holds up consistently.`,
    exampleOutput: `Part 3: 'The team went through a manager transition a couple months into my start, which changed some of the day-to-day dynamics — I stayed focused on delivering what I'd committed to, but it became clear the new direction and I weren't a great match long-term, so I started looking for a role with more stability.' This holds up if pushed with 'what wasn't a good match' — you can add one concrete, non-blaming specific rather than deflecting.`,
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
    slug: 'career-jobsearch-star-story-bank',
    category: 'career-jobsearch',
    title: `Build a reusable STAR story bank from your real work history that flexes to different behavioral questions`,
    description: `Turns your actual career moments into a small set of STAR stories built to be reusable across many different behavioral questions, with explicit notes on which question angles each story can flex to answer.`,
    promptText: `Help me build a STAR story bank from my real career moments — a small set of stories I can flex across many different behavioral interview questions, rather than one story per question I might get asked.

MOMENTS FROM MY CAREER I THINK ARE STRONG STORY MATERIAL
{{career_moments}}

COMMON BEHAVIORAL THEMES I EXPECT TO BE ASKED ABOUT
{{expected_themes}}

How many distinct stories: aim for 4-5 stories that together cover the themes I listed, not one story per theme — a single strong story often demonstrates 2-3 different competencies depending on which part of it you emphasize.

For each of my career moments, build it out as:
SITUATION — one or two sentences of real context, specific enough to be credible, not generic.
TASK — what I was actually responsible for, stated so it's clear what decision or ownership was mine versus the team's.
ACTION — the specific choices I made, in enough detail that a follow-up question ("why did you choose that approach over the alternative") has a real answer available, not just an outcome-first summary that skips the reasoning.
RESULT — the actual outcome, including anything imperfect about it — a result that's suspiciously perfect reads as embellished, and naming a real trade-off or limitation makes the story more credible, not less.

After each story, list which of my expected themes it can answer, and for each theme it covers, one sentence on which part of the story to emphasize or lead with to make it land as an answer to that specific theme rather than reading as the same story told the same way regardless of what was asked.

WHAT NOT TO DO
Do not invent details, outcomes, or numbers I didn't give you — if a story is missing a concrete result, ask me for it rather than filling in a plausible-sounding one. Do not force a story to cover a theme it doesn't genuinely fit; tell me instead if one of my expected themes has no strong story in the set and needs new material.

End with a coverage map: my expected themes down one side, my stories across the top, marked where each story covers each theme.`,
    variables: [
      {
        name: 'career_moments',
        description: `A rough description of 4-6 real moments from your career that might make good stories.`,
        example: `1) Rebuilt a broken onboarding process after a bad launch, 2) disagreed with my manager about a vendor choice and turned out right, 3) took over a project mid-stream after the previous owner left, 4) mentored a junior hire who almost quit in their first month.`,
        required: true,
      },
      {
        name: 'expected_themes',
        description: `The behavioral competencies or themes you expect to be tested on.`,
        example: `Leadership, conflict/disagreement with authority, ambiguity/ownership, mentorship, handling failure.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`star-method`, `behavioral-interview`, `interview-prep`, `career-storytelling`, `job-search`],
    whyItWorks: `Building one story per anticipated question is a losing strategy because behavioral interview question banks are effectively infinite in surface phrasing while the underlying competencies they test are a small, stable set — leadership, conflict, ambiguity, failure recovery — which means a well-built small set of stories that each flex across several competencies covers far more ground than a large set of narrow, single-purpose ones, and is also easier to actually keep fresh in memory under interview pressure. The instruction to build 4-5 flexible stories rather than one-per-theme forces the model to identify which real moments in the candidate's history are naturally rich enough to support multiple competencies depending on emphasis, which is a genuine skill difference from just categorizing moments into single boxes. Requiring the Action section to include the reasoning behind a choice, not just the choice and its outcome, matters because a competent interviewer's most revealing follow-up question is almost always "why did you do it that way instead of the alternative," and a candidate whose STAR prep only covers the outcome-level story has nothing prepared for that follow-up, which is exactly the moment a rehearsed-sounding story starts to visibly fall apart. The instruction to preserve an imperfect result rather than polish it into a clean win addresses a subtle credibility problem: STAR stories that resolve too neatly, with every outcome unambiguously positive and every number suspiciously round, read to experienced interviewers as embellished or cherry-picked, while a story that names a real trade-off or partial result reads as something that actually happened. The refusal to invent missing details protects the candidate from the single worst outcome in interview prep — being caught contradicting a detail the candidate never actually said but the model fabricated to fill a gap, which is far worse for credibility than simply not having a number ready.`,
    exampleOutput: `Story 2 (vendor disagreement): covers 'conflict/disagreement with authority' and 'ownership.' For the conflict theme, lead with the specific moment you pushed back and what evidence you brought, not the eventual vindication — the vindication should land as the Result, not be foreshadowed early, since interviewers are testing how you handled the disagreement in the moment, not whether you were later proven right.`,
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
    slug: 'career-jobsearch-mock-interview-simulator',
    category: 'career-jobsearch',
    title: `Run a mock interview that actually interrupts, follows up, and pushes back like a real interviewer would`,
    description: `Runs a live, adaptive mock interview session that asks follow-up questions based on your actual answers and pushes back on vague ones, instead of just reciting a fixed question list one after another.`,
    promptText: `Run a mock interview with me for a specific role. I don't want a static list of questions read out one after another — I want you to act as the actual interviewer, listening to my answers and reacting to them the way a real person would, including following up and pushing back when an answer is vague.

ROLE AND STAGE
{{role_and_stage}}

INTERVIEWER PERSONA
{{interviewer_persona}}

WHAT I WANT THIS SESSION TO STRESS-TEST
{{focus_area}}

HOW TO GIVE FEEDBACK
{{feedback_timing}}

Run this as a real back-and-forth, one question at a time — never dump multiple questions in one message. Take on the interviewer persona I described and stay in character for the questions themselves. After each answer I give, before moving to your next question, decide whether the answer was specific and complete enough to move on, or vague/incomplete enough that a real interviewer in this persona would follow up — if it needs a follow-up, ask it in character rather than breaking to give feedback first, the same way a real interview would actually unfold.

Start with a first question appropriate to the stage and persona, then wait for my answer before doing anything else.

WHAT NOT TO DO
Do not soften your follow-ups to spare my feelings mid-interview — a real interviewer wouldn't, and the value of this exercise is finding out where my answers actually don't hold up under a real follow-up, not feeling good about the session. Do not move to a new topic just because I gave a decent answer if there's an obvious, specific follow-up a real interviewer in this persona would ask.

Only break character to give feedback based on what I said about feedback timing above — if I asked for end-of-session feedback, stay fully in character through every question and follow-up, and only switch to a feedback voice when I explicitly say the interview is over.`,
    variables: [
      {
        name: 'role_and_stage',
        description: `The specific role and which interview stage to simulate.`,
        example: `Engineering Manager role, first-round hiring manager interview, 30 minutes.`,
        required: true,
      },
      {
        name: 'interviewer_persona',
        description: `What kind of interviewer to simulate — their style and priorities.`,
        example: `A direct, no-small-talk VP of Engineering who cares most about how I handle underperforming reports, and who asks pointed follow-ups rather than letting vague answers slide.`,
        required: true,
      },
      {
        name: 'focus_area',
        description: `What you specifically want this mock session to test or push on.`,
        example: `I want to be pushed hardest on how I actually handle a direct report who is missing deadlines, since that's the area I feel least rehearsed in.`,
        required: true,
      },
      {
        name: 'feedback_timing',
        description: `When you want feedback — after every answer, or only at the end.`,
        example: `Only at the end — I want the full session to feel like a real interview without breaks for coaching in the middle.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`mock-interview`, `interview-simulation`, `interview-prep`, `roleplay`, `job-search`],
    whyItWorks: `A static list of questions read one after another fails to simulate the actual pressure point of a real interview, which is rarely the first question itself but the follow-up that comes after a vague or incomplete answer — a candidate can rehearse a polished response to every anticipated question on a list and still be caught flat-footed by "can you say more about what specifically you did there" in a live conversation, because that follow-up only exists in response to what was actually said, not to a question written in advance. Explicitly instructing the model to evaluate each answer before deciding whether to advance or follow up forces it to actually behave adaptively turn-by-turn rather than defaulting to its base pattern of working through a pre-planned list regardless of answer quality, which is the single biggest gap between a scripted Q&A and something that resembles a real interview's actual information-seeking behavior. The instruction to stay in persona through follow-ups rather than breaking to coach mid-session matters mechanically because GPT-5.1's default helpful-assistant instinct is to interject encouragement or gentle correction as soon as it notices a weak answer, which is exactly the behavior a real interviewer doesn't exhibit and exactly the behavior that would let the candidate mentally relax between questions instead of staying under the pressure the exercise is meant to simulate. Explicitly forbidding the model from softening follow-ups to spare feelings addresses a specific and well-documented tendency of instruction-tuned models toward excessive agreeableness — without that constraint stated up front, the model will tend to accept a mediocre answer and move on rather than push, which defeats the entire purpose of a stress-test session and would leave the candidate with false confidence walking into the real interview.`,
    exampleOutput: `Interviewer: "Walk me through the last time a direct report was consistently missing deadlines." [Candidate answers vaguely] Interviewer, in character: "You said you 'had a conversation' with them — what did you actually say, and what changed afterward that told you it worked?"`,
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
    slug: 'career-jobsearch-technical-interview-prep',
    category: 'career-jobsearch',
    title: `Prep for a technical interview by working through your actual weak spots, not a generic problem set`,
    description: `Builds a technical interview prep plan around your stated weak areas and the specific role's likely technical bar, then walks through practice problems with real-time reasoning checks instead of just handing you answers.`,
    promptText: `Help me prepare for a technical interview. I don't want a generic problem set — I want prep focused on where I'm actually weak, calibrated to the technical bar this specific role and stage is likely to test.

ROLE AND TECHNICAL AREA
{{role_and_technical_area}}

INTERVIEW FORMAT
{{interview_format}}

MY CURRENT LEVEL AND SPECIFIC WEAK SPOTS
{{weak_spots}}

TIME AVAILABLE TO PREP
{{prep_time}}

STEP 1 — CALIBRATE THE BAR
Given the role, level, and interview format, tell me what technical bar is actually being tested here — not the theoretical maximum depth this topic could go to, but what a candidate at this level in this format is realistically expected to demonstrate in the time given. Being calibrated wrong in either direction wastes prep time: overshooting means I over-prepare topics unlikely to come up, undershooting means I walk in underprepared.

STEP 2 — PLAN AROUND MY ACTUAL WEAK SPOTS
Given my stated weak spots and the time I have, tell me which weak spots are worth closing before this interview versus which ones I should accept the risk on and focus my limited time elsewhere, and why.

STEP 3 — WORK THROUGH ONE PROBLEM LIVE, WITH ME REASONING OUT LOUD
Give me one practice problem calibrated to Step 1's bar and targeted at a weak spot from Step 2. Do not give me the answer or a hint yet — wait for me to attempt it and explain my reasoning first. Once I respond, do not just tell me if I'm right or wrong: ask me a targeted question about the specific part of my reasoning that's weakest, the way an interviewer probing for understanding rather than just a correct final answer would, before confirming or correcting anything.

WHAT NOT TO DO
Do not hand me a fully worked solution before I've attempted the problem myself — the value of live practice is in the struggle and the follow-up questions, not in reading a clean answer. Do not pick a problem more advanced than Step 1's calibrated bar just because it's more interesting to discuss.

After I've worked through the problem with your follow-ups, give me a short honest assessment of what specifically I should keep practicing before the real interview.`,
    variables: [
      {
        name: 'role_and_technical_area',
        description: `The role and the specific technical domain being tested.`,
        example: `Backend engineer role, technical screen focused on data structures/algorithms and SQL query design.`,
        required: true,
      },
      {
        name: 'interview_format',
        description: `The actual format — live coding, take-home, whiteboard, pair programming.`,
        example: `45-minute live coding round on a shared editor, no whiteboard, interviewer can see me type in real time.`,
        required: true,
      },
      {
        name: 'weak_spots',
        description: `Your honest self-assessment of specific weak areas.`,
        example: `I'm solid on basic data structures but freeze up on anything involving graph traversal, and I tend to jump to coding before fully explaining my approach out loud.`,
        required: true,
      },
      {
        name: 'prep_time',
        description: `How much time you have before the interview.`,
        example: `3 days, about 90 minutes per day.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`technical-interview`, `interview-prep`, `coding-interview`, `job-search`, `practice-problems`],
    whyItWorks: `The most common failure in AI-assisted technical interview prep is miscalibration in either direction — a model asked to help prep for a technical interview will often default to either generic textbook-difficulty problems that don't reflect what a 45-minute live-coding screen actually tests, or occasionally the opposite, showing off with an unnecessarily advanced problem that wastes the candidate's limited prep time on depth the actual interview will never probe. Forcing an explicit Step 1 calibration — reasoning about what this specific format and level realistically test, separate from the theoretical depth of the topic — makes the model's assumption about difficulty visible and correctable before any practice time is spent, rather than silently baking in a miscalibrated assumption. The instruction to withhold the answer until the candidate attempts the problem and explains their reasoning first is the mechanism that actually produces useful practice rather than passive reading: a model's default behavior when given a problem to "help with" is to be maximally helpful immediately, which for interview prep specifically defeats the purpose, since the actual skill being tested in a live technical interview is producing reasoning under time pressure without help, not recognizing a correct answer once shown one. The instruction to probe the weakest part of the candidate's stated reasoning, rather than a binary right/wrong judgment, mirrors how a real technical interviewer actually operates — most technical interviews are explicitly scored on process and communication, not just a correct final answer, so a mock session that only confirms correctness misses the exact skill (reasoning out loud, handling being questioned mid-thought) that determines the real outcome.`,
    exampleOutput: `Step 1: for a 45-minute live-coding screen at this level, expect one medium-difficulty graph or tree problem with follow-up variations, not a hard-difficulty multi-part problem — the format doesn't have time for that depth. Problem: given a list of flight routes, determine if you can reach a destination within k stops. [Candidate attempts] Follow-up: "You said you'd use BFS — walk me through why BFS and not DFS matters specifically for the 'within k stops' constraint."`,
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
    slug: 'career-jobsearch-behavioral-interview-red-flags',
    category: 'career-jobsearch',
    title: `Check your behavioral interview answers for the specific things that quietly read as red flags`,
    description: `Reviews your drafted behavioral answers for specific, well-documented red-flag patterns — blame-shifting, vague ownership, unverifiable claims — rather than generic tone feedback.`,
    promptText: `Review my behavioral interview answers for specific red-flag patterns that experienced interviewers are trained to notice, not generic feedback about tone or confidence.

MY DRAFTED ANSWERS
{{drafted_answers}}

QUESTIONS THEY'RE ANSWERING
{{corresponding_questions}}

ROLE I'M INTERVIEWING FOR
{{target_role}}

Check each answer against these specific patterns, and only flag ones that genuinely appear rather than forcing every pattern onto every answer:

1. BLAME WITHOUT OWNERSHIP. Does the answer describe a problem as something that happened to me or was caused by someone else, without naming what I specifically did or could have done differently — even in a story about someone else's failure, a strong answer usually still contains a piece of my own agency or reflection.
2. VAGUE PRONOUNS HIDING UNCLEAR CONTRIBUTION. Does the answer use "we" throughout a section where the interviewer is specifically trying to learn what I personally did, in a way that could be covering for a smaller individual contribution than the story implies.
3. UNVERIFIABLE OR SUSPICIOUSLY ROUND CLAIMS. Any metric or outcome stated with a precision or magnitude that reads as invented or rounded up rather than remembered — a real number is often oddly specific or hedged, not a clean round figure.
4. UNRESOLVED TENSION LEFT HANGING. Does the story raise a conflict or difficulty and then jump straight to a resolved outcome without explaining the actual mechanism that got from one to the other, which reads as either an incomplete story or one where the real answer is being avoided.
5. MISMATCH WITH ROLE PRIORITIES. Does the answer emphasize a quality or skill that isn't actually what this specific role cares about, suggesting the story was recycled from a different application without adapting the emphasis.

For each flag you raise, quote the specific sentence that triggers it and give me one concrete rewrite direction, not just "add more ownership" in the abstract.

WHAT NOT TO DO
Do not flag something as a red flag just to have something to say about every answer — if an answer is genuinely clean, say so plainly rather than manufacturing a minor nitpick.

End with which single answer, if any, has the most serious flag and should be fixed first given limited prep time.`,
    variables: [
      {
        name: 'drafted_answers',
        description: `Your drafted behavioral interview answers, in full.`,
        example: `When the project fell behind schedule, we decided to cut some features to hit the deadline. We ended up shipping on time and the client was happy with the result...`,
        required: true,
      },
      {
        name: 'corresponding_questions',
        description: `The questions each drafted answer is responding to.`,
        example: `Tell me about a time a project you were on fell behind schedule.`,
        required: true,
      },
      {
        name: 'target_role',
        description: `The role you're interviewing for, so mismatch-with-priorities can be checked.`,
        example: `Technical Project Manager role that specifically emphasizes stakeholder communication under pressure.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`behavioral-interview`, `interview-prep`, `answer-review`, `job-search`, `communication-coaching`],
    whyItWorks: `Generic feedback like "sound more confident" or "be more specific" is nearly unusable because it doesn't tell the candidate which sentence to change or how — this prompt instead names five specific, well-documented patterns experienced interviewers are actually trained to notice, which gives the model a checkable framework to apply to the actual text rather than an open-ended impression to form. The "we" pattern specifically matters because it's one of the most common and most subtle red flags in behavioral interviewing — a candidate describing team accomplishments in first-person-plural throughout an answer to a question explicitly asking what they personally did is a pattern interviewers are specifically trained to probe with a direct follow-up ("what did you specifically do"), and catching it before the interview is far cheaper than being caught by that follow-up live. The instruction to flag suspiciously round or precise numbers addresses a specific tell that experienced interviewers watch for: real remembered metrics tend to be oddly specific ("we cut it from 14 days to 9") or explicitly hedged ("roughly a third faster, I'd have to check the exact number"), while a fabricated-sounding number defaults to a clean round figure the brain reaches for when inventing rather than recalling, and a model reviewing a draft can be instructed to notice that same tell a skeptical human interviewer would notice. The explicit instruction against manufacturing a flag on every answer matters because a model asked to "find problems" will tend to find something in every input regardless of actual quality, which erodes the signal value of the flags that are genuinely serious — telling it plainly that a clean answer should be reported as clean keeps the flagged issues meaningful rather than diluted by forced nitpicks.`,
    exampleOutput: `Flag (pattern 2, vague pronouns): "We decided to cut some features" — for a question specifically about your role in a project falling behind, this hides whether the decision was yours to make or you were following someone else's call. Rewrite direction: name your specific role in that decision — did you propose the cut, push back on it, or execute someone else's call — since the interviewer is trying to learn your individual judgment under pressure, not the team's collective outcome.`,
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
    slug: 'career-jobsearch-salary-counteroffer-negotiation-script',
    category: 'career-jobsearch',
    title: `Build a salary counteroffer script anchored to real numbers, not generic negotiation confidence lines`,
    description: `Builds a specific counteroffer script from your actual offer, market data, and leverage, with responses prepared for the likely pushback rather than generic 'just ask confidently' negotiation advice.`,
    promptText: `Help me build a salary counteroffer script for a real offer I have in hand. I want it anchored to actual numbers and my actual leverage, not generic "negotiate with confidence" advice.

THE OFFER I RECEIVED
{{current_offer}}

MARKET DATA I HAVE (do not assume a figure I haven't given you)
{{market_data}}

MY ACTUAL LEVERAGE
{{leverage}}

WHAT MATTERS MOST TO ME BEYOND BASE SALARY
{{other_priorities}}

Build this in stages:

STAGE 1 — SANITY-CHECK THE ASK
Given the offer and the market data I actually gave you, tell me honestly whether my target counter number is a reasonable ask, an aggressive-but-defensible ask, or likely to read as out of touch with this specific offer — and say so even if the honest answer is that I don't have enough real market data to justify a specific target number yet, rather than inventing a market rate to support whatever number I want.

STAGE 2 — THE SCRIPT
Write the actual counteroffer message or call script, structured as: open with genuine enthusiasm for the role stated specifically rather than as boilerplate, state the ask directly without over-apologizing for asking, back it with the real leverage I gave you rather than a vague "based on my experience," and explicitly leave room for the other priorities I listed if base salary alone doesn't move.

STAGE 3 — PREPARE FOR PUSHBACK
Give me the two or three most likely responses a recruiter or hiring manager would give to this specific counter (band constraints, "this is our best offer," a request to justify the number further), and for each, a response that holds the ask or trades toward one of my other priorities rather than immediately folding to the original number.

WHAT NOT TO DO
Do not write generic hype language ("I know I'm worth it," "I bring so much value") that isn't backed by a specific fact from what I gave you. Do not invent a competing offer or market benchmark I didn't actually give you to strengthen the script — if I don't have real leverage on a point, tell me the ask on that point is weaker rather than manufacturing false leverage.

End with one honest sentence on what the biggest risk is in sending this counter as written.`,
    variables: [
      {
        name: 'current_offer',
        description: `The actual offer details you received.`,
        example: `Base $118,000, no signing bonus, standard equity grant, title of Senior Analyst.`,
        required: true,
      },
      {
        name: 'market_data',
        description: `Any real market data you actually have — a specific source, not a vague sense.`,
        example: `Levels.fyi shows similar titles at comparable companies in this city at $125-135k base; I don't have a competing offer.`,
        required: false,
      },
      {
        name: 'leverage',
        description: `Your actual leverage in this specific negotiation.`,
        example: `No competing offer, but I have a specific in-demand certification the posting listed as 'nice to have' that I have and most candidates for this req apparently didn't.`,
        required: true,
      },
      {
        name: 'other_priorities',
        description: `What matters to you besides base salary, in case that's where flexibility exists.`,
        example: `A remote-work day per week matters more to me than an extra few thousand in base, and I'd trade some base ask for it.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`salary-negotiation`, `counteroffer`, `job-offer`, `compensation`, `job-search`],
    whyItWorks: `Generic negotiation advice built around confidence-projecting phrases ("know your worth," "ask with confidence") is weak advice because the actual variable that determines a counteroffer's success is whether the number and the justification behind it are grounded in something the other side finds credible, not the tone in which it's delivered — a confidently delivered ask with no real backing is easier for a recruiter to decline than a modestly delivered ask backed by a specific, verifiable data point. Stage 1's sanity check exists because the single most damaging mistake in a salary negotiation is anchoring on a number the market data doesn't actually support, which can read as out of touch and cost credibility for the rest of the conversation — having the model check the target against only the real data provided, rather than assuming whatever number the candidate wants is defensible, catches that risk before the message is sent rather than after a recruiter has already formed an impression. The explicit instruction never to invent a competing offer or market benchmark the candidate didn't actually provide is the single most important safeguard in this prompt: a fabricated competing offer used as negotiation leverage is not just ethically compromising, it's discoverable and reputation-damaging if a recruiter asks a natural, specific follow-up question about it, and a model that fills in a plausible-sounding number to strengthen a script is optimizing for a persuasive-looking output at the cost of the candidate's actual credibility in a professional relationship they may need again. Building in the Stage 3 pushback rehearsal, rather than stopping at the initial script, matters because the actual point of friction in most salary negotiations isn't the opening ask but what happens after the first "that's not something we can do" — a candidate with a prepared, specific response to that exact moment is far less likely to fold immediately out of the reflexive discomfort many people feel when a negotiation gets pushed back on.`,
    exampleOutput: `Stage 1: your target of $130k is defensible given the Levels.fyi range you cited ($125-135k) — reasonable, not aggressive, especially paired with the certification leverage. Stage 3, pushback 'this is our best offer': 'I understand base is fixed at this stage — given that, would there be flexibility on a remote day per week or a signing bonus to help close the gap?' This holds the ask while redirecting to your stated secondary priority rather than folding outright.`,
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
    slug: 'career-jobsearch-recruiter-outreach-cold-message',
    category: 'career-jobsearch',
    title: `Write a cold recruiter outreach message that gets read past the first line, not deleted as a form letter`,
    description: `Drafts a short, specific cold outreach message to a recruiter or hiring manager anchored in a real, checkable reason you're reaching out to them specifically, instead of a mass-message template.`,
    promptText: `Write me a cold outreach message to a recruiter or hiring manager. Recruiters get dozens of these a day and can spot a mass-sent template in the first sentence — I want this to read as clearly written for this one person, because it actually is.

WHO I'M MESSAGING AND WHY THEM SPECIFICALLY
{{recipient_and_reason}}

MY BACKGROUND, RELEVANT TO THEM
{{relevant_background}}

WHAT I ACTUALLY WANT FROM THIS MESSAGE
{{ask}}

PLATFORM
{{platform}}

Write a message under 100 words for LinkedIn or 150 words for email — length itself signals whether this is a template or a real message, and recruiters skim, so brevity is not a nice-to-have here.

Open with the specific, real reason you're messaging this person rather than a general company (a post they made, a specific role they're hiring for, a specific team they lead) — this has to be something a reader could verify is true about them specifically, not something that would also be true of any recruiter at any company. State your relevant background in one sentence, chosen for relevance to what you opened with, not a summary of your whole career. State the actual ask clearly and make it easy to say yes to — a specific, low-effort next step, not an open-ended "let me know your thoughts."

WHAT NOT TO DO
Do not open with "I hope this message finds you well" or any equivalent throat-clearing. Do not attach your entire career history — this message's only job is to earn a reply, not to be a resume substitute. Do not make the ask vague or high-effort ("would love to pick your brain sometime") when a specific, bounded ask ("open to a 15-minute call next week if the timing's not right to apply yet") is easier to say yes to.

After the message, give me one line on what would make a recruiter delete this versus reply, specific to what you wrote, not a generic tip.`,
    variables: [
      {
        name: 'recipient_and_reason',
        description: `Who you're messaging and the real, specific reason you're reaching out to them.`,
        example: `A technical recruiter at a mid-size fintech who posted last week about a hard-to-fill senior backend role on their team.`,
        required: true,
      },
      {
        name: 'relevant_background',
        description: `Your background, focused on what's relevant to this specific outreach.`,
        example: `5 years backend engineering, most recently building payment reconciliation systems, directly relevant to a fintech backend role.`,
        required: true,
      },
      {
        name: 'ask',
        description: `What you actually want out of this message.`,
        example: `I want a 15-minute intro call, not to be walked through the full application process yet.`,
        required: true,
      },
      {
        name: 'platform',
        description: `Where you're sending this — LinkedIn message, email, InMail.`,
        example: `LinkedIn direct message.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`recruiter-outreach`, `cold-messaging`, `networking`, `job-search`, `linkedin`],
    whyItWorks: `Recruiters who handle high message volume develop fast pattern-recognition for template messages, and the tell isn't usually bad writing — it's a message whose opening line would be equally true sent to any recruiter at any company, which is exactly the kind of line a model defaults to unless explicitly instructed otherwise, because a generic compliment or interest statement is easier to generate than a specific, verifiable one. Requiring the opening to be something a reader could verify is true about them specifically — a real post, a real role, a real team they lead — forces the model to actually use the input material rather than falling back to safe, portable phrasing that would work in any cold message, and it's the single biggest signal that separates a message a recruiter actually reads from one they pattern-match and archive. The explicit word-count ceiling matters mechanically because message length itself functions as a signal independent of content — a long, thorough-sounding message increases the effort of reading it without necessarily increasing its persuasiveness, and a recruiter skimming a message on their phone between other tasks is more likely to fully read and respond to something short enough to finish in the time it takes to glance at it. Making the ask specific and low-effort rather than open-ended ("would love to pick your brain sometime") addresses a real behavioral friction point: an open-ended ask requires the recipient to do the work of proposing a next step themselves, which is an extra cognitive cost that makes ignoring the message the path of least resistance, while a bounded, specific ask ("a 15-minute call next week") only requires a yes or no, which measurably increases reply rates in cold outreach generally, not just in job search contexts.`,
    exampleOutput: `"Hi [Name] — saw your post about the backend role your team's been trying to fill. I've spent the last few years building payment reconciliation systems, which sounds close to what you're describing. Not sure if it's the right fit yet, but would a 15-minute call next week make sense to find out?" Delete-trigger note: if the opening line could've been sent to any fintech recruiter, this reads as templated — the reference to 'your team's been trying to fill' is what makes it specific to them.`,
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
    slug: 'career-jobsearch-networking-message-warm-intro-request',
    category: 'career-jobsearch',
    title: `Turn a thin connection into a networking message that actually gets a reply`,
    description: `Drafts a short LinkedIn or email networking message tailored to exactly how you know (or don't yet know) the person, so it reads as a real ask instead of a mass-sent template.`,
    promptText: `You are drafting a networking message I will send to one specific person — not a mass template, a message this one recipient will read and decide whether to answer within about ten seconds.

WHO I'M MESSAGING
{{recipient_context}}

HOW WE'RE CONNECTED
{{connection_basis}}

WHAT I ACTUALLY WANT
{{specific_ask}}

WHAT I CAN OFFER OR REFERENCE
{{shared_relevance}}

PLATFORM AND LENGTH
{{platform_and_length}}

RULES
Open with the specific, true reason I'm messaging this person and not a hundred others — reference the connection basis in the first sentence, not buried after a generic greeting. State the ask in one sentence, and make it a low-effort, specific ask (a 15-minute call on a named topic, an answer to one named question, a referral to a named role) rather than an open-ended "pick your brain" request that forces them to do the work of figuring out what I want. If the connection basis is weak or nonexistent (a cold LinkedIn message to a stranger), say so plainly in your reasoning and write the message to earn attention on the strength of the ask and the shared relevance alone — do not fabricate a warmer connection than actually exists. Never use flattery that could apply to anyone ("I've been following your incredible work") unless I gave you something specific to point to. Keep the message short enough to read in the platform's preview pane without a "see more" click — that means genuinely brief for LinkedIn, slightly longer is fine for email. End with a specific, easy next step the recipient can say yes to without scheduling overhead (a yes/no question, a suggested 15-minute window, a single link).

WHAT NOT TO DO
Do not open with "I hope this message finds you well" or any other line that signals mass-template. Do not ask them to "jump on a call to learn more about my background" — that puts the burden of structuring the conversation on them. Do not thank them in advance for something they haven't agreed to yet.

OUTPUT FORMAT
1. The message itself, ready to send, sized to the stated platform.
2. One alternate subject line or opening line if this is an email, so I can A/B the open.
3. A one-line note on what would make this message stronger if I have more specific shared context to add.`,
    variables: [
      {
        name: 'recipient_context',
        description: `Who this person is and why they matter to your search — role, company, seniority.`,
        example: `Senior PM at a Series C fintech I'm targeting; two levels above the role I'd apply for.`,
        required: true,
      },
      {
        name: 'connection_basis',
        description: `The real, specific connection between you and them, or none if it's cold.`,
        example: `We both attended the same three-day product conference last month; no direct interaction there.`,
        required: true,
      },
      {
        name: 'specific_ask',
        description: `The one concrete thing you want, stated as a low-effort request.`,
        example: `A 15-minute call about how their team structures the PM interview loop, not a job referral yet.`,
        required: true,
      },
      {
        name: 'shared_relevance',
        description: `Something specific you can reference that makes the outreach relevant to them, not just you.`,
        example: `I built a similar usage-based pricing model at my current company and can compare notes.`,
        required: false,
      },
      {
        name: 'platform_and_length',
        description: `Where this is being sent and the length constraint that implies.`,
        example: `LinkedIn connection-request note, must fit under 300 characters.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`networking`, `linkedin-outreach`, `cold-message`, `career-search`, `email-drafting`],
    whyItWorks: `The instruction to open with the connection basis in sentence one exploits how people actually triage LinkedIn and email inboxes: they decide relevance from the first line before reading the ask, so burying the "why you" after a greeting means the message gets judged as generic before the real content is even seen. Forcing the model to name whether the connection is genuinely warm or actually cold prevents GPT-5.1's default politeness bias from inventing a rapport that doesn't exist — left unconstrained, it tends to write "great to reconnect" language for a recipient the user has never actually spoken to, which reads as either confused or dishonest the moment the recipient checks. Specifying that the ask must be low-effort and singular addresses a real failure mode of networking messages: an open-ended "would love to pick your brain" ask requires the recipient to invent the agenda, and busy people route effort-shifting requests straight to ignored rather than doing that work for a near-stranger. The platform-and-length constraint matters mechanically because LinkedIn truncates messages in the notification preview and connection-request notes have a hard character cap — a message written without that constraint in mind often gets cut off mid-sentence exactly where the ask was going to land. Ending on a single yes/no question or proposed time window rather than an open "let me know if you're free" closes the loop the way a specific calendar invite does compared to a vague "we should catch up sometime" — it converts a reply from an effortful scheduling negotiation into a one-tap response, which is the single biggest lever on reply rate for a message this short.`,
    exampleOutput: `Hi Priya — we were both at the SaaStr product track last month (I was on the pricing-model panel audience). I'm restructuring my company's usage-based pricing and would love 15 minutes to hear how your team handles PM interview loops for pricing-focused roles — not asking about openings yet, just comparing notes. Would a quick call next Tuesday or Wednesday work?`,
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
    slug: 'career-jobsearch-cold-application-no-job-posting',
    category: 'career-jobsearch',
    title: `Write a cold application to a company with no open role posted`,
    description: `Produces a cold-outreach application email that makes a case for creating a role or considering you for a future one, built around a specific problem you'd solve rather than a generic 'I'd love to work here.'`,
    promptText: `You are writing a cold application email to a company that has not posted an open role matching what I do — this is a speculative outreach, not a response to a job listing, so it has to earn attention on its own.

PHASE 1 — IDENTIFY THE HOOK
From the company context below, identify one specific, plausible problem or gap this company likely has that matches what I can do. Do not invent a fact about the company you weren't given — if you're not confident in a specific problem, say so and ask me to confirm one rather than guessing at their internal challenges.

COMPANY CONTEXT
{{company_context}}

MY RELEVANT CAPABILITY
{{relevant_capability}}

WHO I'M ADDRESSING THIS TO
{{recipient_role}}

PHASE 2 — DRAFT THE EMAIL
Open by naming the specific problem or gap, not by announcing that I'm job-hunting — the email should read like it's about their situation first. State my relevant capability as evidence I could help with that specific problem, using one concrete result rather than a list of skills. Explicitly acknowledge that I don't know whether they have budget or headcount for this right now, and frame the ask accordingly — not "are you hiring," but a smaller, answerable question like whether this is a problem worth a short conversation. Keep it to under 150 words in the body.

PHASE 3 — SUBJECT LINE
Write a subject line that names the specific problem or opportunity, not "Application for [Role]" or "Interested in opportunities at [Company]" — those read as mass-sent and get filtered accordingly.

WHAT NOT TO DO
Do not attach a resume-summary paragraph that lists job titles and years of experience — that's what the actual resume is for, not this email. Do not use "I've always admired your company's mission" or similarly unfalsifiable flattery. Do not ask them to "keep me in mind for future openings" as the primary ask — that's too passive to prompt a reply.

OUTPUT FORMAT
1. Subject line.
2. Email body, under 150 words.
3. A one-line flag if any part of the company context you were given felt too thin to build a credible hook from, so I can supply more before sending.`,
    variables: [
      {
        name: 'company_context',
        description: `What you actually know about the company's situation, product, or recent moves — facts, not guesses.`,
        example: `They just launched in a new country and their careers page has no listed operations or localization roles.`,
        required: true,
      },
      {
        name: 'relevant_capability',
        description: `The specific thing you do that maps to the likely problem, with one concrete result.`,
        example: `I ran market-entry localization for a similar-sized company's launch into three EU markets, cutting time-to-first-revenue by six weeks.`,
        required: true,
      },
      {
        name: 'recipient_role',
        description: `Who you're sending this to and their likely level of authority over the problem.`,
        example: `Head of International Expansion — likely the actual decision-maker, not just HR.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`cold-application`, `speculative-outreach`, `job-search-email`, `career-search`, `networking`],
    whyItWorks: `The explicit instruction against guessing at unconfirmed facts about the company matters because cold applications live or die on credibility in the first two sentences, and GPT-5.1 will otherwise happily fabricate a plausible-sounding company challenge from thin context, which reads as confident until the recipient — who actually knows their own company — spots the guess and discounts the whole email. Naming the problem before announcing the job search reframes the email from a request (give me something) to an offer (here's something useful), which changes which mental bucket a hiring manager sorts it into on first read; unsolicited job requests get filtered fast, unsolicited useful observations get a reply more often because they cost the recipient nothing to consider. The under-150-word constraint is load-bearing rather than arbitrary — a cold email to someone who didn't ask for it competes against a full inbox of email people did ask for, and length itself signals whether this is worth opening now or archiving for later. Asking a small, answerable question ("is this worth 15 minutes") instead of the large, effort-shifting "are you hiring" respects that most recipients cannot honestly answer a headcount question on the spot but can answer a scoped yes/no about whether a problem is real. Separating the resume-summary content out entirely stops the email from duplicating the resume's job, which is the single most common reason cold applications read as generic — they restate a background instead of making a case for why this specific background matters to this specific, named problem right now.`,
    exampleOutput: `Subject: Localization gap in your new market launch

Hi Marcus — I noticed your recent expansion announcement doesn't have a listed localization or in-market operations role yet, which is usually the first hire that determines whether time-to-revenue is 3 months or 9. I ran that exact function for a similarly-sized company's EU launch and cut time-to-first-revenue by six weeks by fixing the localization handoff early. I don't know if this is a gap you're actively solving for right now — worth a 15-minute call if it is?`,
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
    slug: 'career-jobsearch-portfolio-project-description',
    category: 'career-jobsearch',
    title: `Write a portfolio project description that survives a 30-second skim`,
    description: `Turns a messy list of what you built and did on a project into a tight portfolio entry structured around the decision you made and the result it produced, not a feature list.`,
    promptText: `You are writing one project description for my online portfolio — the kind a hiring manager will skim in under 30 seconds before deciding whether to click through or keep scrolling.

THE PROJECT
{{project_raw_notes}}

MY ROLE ON IT
{{my_role}}

WHO WILL BE READING THIS
{{portfolio_audience}}

RULES
Lead with the outcome or the interesting problem, not the tech stack or the timeline — a reader deciding whether to keep reading needs to know what happened before they need to know what tools were used. State my specific role clearly if this was a team project; never let the description read as if I built the whole thing solo when I didn't, and never undersell my part either — name the one or two decisions that were actually mine. Include one number or concrete detail that makes the result verifiable rather than a vague claim like "significantly improved" — if I didn't give you a number, ask me for one instead of inventing one. Mention the tools or stack only after the outcome, as supporting detail, not as the opening line.

WHAT NOT TO DO
Do not write "Led development of a full-stack application using React, Node, and PostgreSQL" as an opening line — that tells the reader nothing about why the project mattered before asking them to care about the stack. Do not pad the description with adjectives like "robust," "scalable," or "cutting-edge" that aren't backed by a specific detail in my notes.

OUTPUT FORMAT
A single paragraph, 60-90 words, followed by a 3-bullet "key details" list (role, stack, result) for readers who skim rather than read the paragraph.`,
    variables: [
      {
        name: 'project_raw_notes',
        description: `A messy, unstructured description of what the project was and what happened.`,
        example: `Built an internal tool that let support agents search past tickets by similarity instead of exact keyword match; before this they were missing duplicate issues constantly.`,
        required: true,
      },
      {
        name: 'my_role',
        description: `What you specifically did, especially if it was a team effort.`,
        example: `Solo-built the backend similarity search and the ranking logic; a teammate did the frontend UI.`,
        required: true,
      },
      {
        name: 'portfolio_audience',
        description: `Who is likely to read this portfolio and what they'd care about most.`,
        example: `Engineering managers screening for backend/ML-adjacent hires at mid-size B2B SaaS companies.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`portfolio-writing`, `project-description`, `personal-website`, `career-search`, `resume-content`],
    whyItWorks: `Leading with outcome instead of stack directly counters a specific pattern in how portfolios get skimmed: a reader scanning ten project cards in two minutes decides which ones to click based on whether the first sentence signals a problem worth understanding, and "built using React, Node, and PostgreSQL" gives them nothing to evaluate until they've already invested reading time in the stack list. Requiring a real number rather than a vague superlative closes a specific gap that GPT-5.1 otherwise fills by default — asked to describe impact with only qualitative notes, it reaches for "significantly improved" or "greatly reduced," phrasing that reads as filler precisely because it's unfalsifiable, whereas a reader who sees a specific number can decide for themselves whether it's impressive. The role-attribution rule matters because team project descriptions have a specific credibility failure mode in both directions: overclaiming solo ownership of a team deliverable gets caught the moment an interviewer asks a follow-up question the candidate can't answer, while underselling a real individual contribution wastes the one chance the portfolio has to make a specific hire-worthy skill visible. The 60-90 word cap paired with a separate skim-friendly bullet list serves two different reading behaviors simultaneously — the paragraph is for someone who commits to reading, the bullets are for someone who never will, and most portfolio visitors are the second kind, so building only the paragraph leaves that reader with nothing.`,
    exampleOutput: `Support agents were missing duplicate tickets constantly because search only matched exact keywords. I built a similarity-based search backend and ranking logic that surfaced related past tickets even when the wording didn't match, cutting duplicate-ticket investigation time noticeably for the support team. A teammate built the frontend on top of the API I designed.

Role: Backend + ranking logic (solo)
Stack: Python, embeddings-based similarity search, PostgreSQL
Result: Reduced duplicate-ticket investigation time for the support team`,
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
    slug: 'career-jobsearch-github-readme-project-profile',
    category: 'career-jobsearch',
    title: `Write a GitHub README that gets a recruiter past the first ten seconds`,
    description: `Structures a project README so a recruiter or hiring manager who has never seen your code before understands what it does and why it's worth their time in the first screen, before diving into setup instructions.`,
    promptText: `You are writing the README.md for one of my GitHub projects, with a specific secondary reader in mind: a recruiter or hiring manager who clicks through from my resume or LinkedIn and has never seen this repo before, and who will decide within the first screen whether to keep reading.

PHASE 1 — WHAT THE PROJECT ACTUALLY DOES
{{project_description}}

PHASE 2 — WHAT MAKES IT WORTH LOOKING AT
{{notable_technical_decision}}

PHASE 3 — SETUP DETAILS
{{setup_and_stack}}

STRUCTURE RULES
Open with a one-to-two sentence plain-language summary of what the project does and why it exists — written for someone with zero context, not someone who already knows the domain. Immediately after that, include one specific technical decision or challenge that a technical reader would find genuinely interesting, stated concretely enough that it signals real engineering judgment rather than "followed best practices." Only after those two things, include the standard sections: installation, usage, and stack — a recruiter clicking through rarely reads past the top third, so anything critical to their decision must live there, not at the bottom where only a contributor would find it. If there's a live demo, a screenshot, or a GIF available, note where it should go in the README even if I haven't provided the asset yet, rather than skipping that section silently.

WHAT NOT TO DO
Do not open with a badge row (build status, license, stars) as the first thing in the file — badges are useful but they're not what makes a stranger care. Do not write a generic project description that could describe a tutorial clone ("A simple to-do app built with React and Firebase") without naming what's actually distinct about this implementation.

OUTPUT FORMAT
Full README.md content in Markdown, in this section order: title, one-line tagline, plain-language summary, the interesting technical decision, screenshot/demo placeholder note if relevant, installation, usage, stack, license line.`,
    variables: [
      {
        name: 'project_description',
        description: `Plain-language explanation of what the project does, for someone with no domain context.`,
        example: `A CLI tool that diffs two Terraform state files and flags changes that would cause downtime, before apply.`,
        required: true,
      },
      {
        name: 'notable_technical_decision',
        description: `One real engineering choice or tricky problem that shows judgment, not just implementation.`,
        example: `Had to parse Terraform's internal state JSON schema across three incompatible versions without a shared library, so I wrote a version-detection adapter layer.`,
        required: true,
      },
      {
        name: 'setup_and_stack',
        description: `The actual tech stack and how to install/run it.`,
        example: `Go, no external dependencies; go install github.com/user/tfdiff@latest.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`github-readme`, `developer-portfolio`, `technical-writing`, `career-search`, `software-engineering`],
    whyItWorks: `The two-audience framing — a contributor who needs setup steps and a recruiter who needs neither — resolves a real structural conflict in most auto-generated READMEs: templates optimized purely for contributor onboarding front-load badges and installation steps, which is correct for someone about to run the code but wastes the exact ten seconds a recruiter actually spends before clicking away, so the ordering has to be deliberately inverted from the contributor-first default. Requiring one concrete technical decision rather than a generic "built with best practices" line matters because a hiring manager skimming a GitHub profile is specifically looking for signal that distinguishes an original project from a tutorial clone, and vague competence claims are exactly what a tutorial-clone README also contains — a specific, named engineering problem (version-incompatible schemas, a tricky race condition, a deliberate tradeoff) is the kind of detail that a copy-pasted project simply doesn't have, because it only exists if the person actually built the thing. Placing that detail in the top third rather than in a "Technical Details" section near the bottom reflects how GitHub renders READMEs — most of the file sits below the fold on first load, and anything meant to influence a fast decision has to survive without scrolling. The explicit instruction to note a screenshot placeholder even without the asset prevents ChatGPT from silently omitting a section it has no image to fill, which would otherwise leave a visually flat README that undersells a project that might have a genuinely good demo to show.`,
    exampleOutput: `# tfdiff

Catch downtime-causing Terraform changes before you apply them.

tfdiff compares two Terraform state files and flags any change — a forced resource replacement, a deleted dependency — that would cause an outage, surfacing it before \`terraform apply\` runs.

**The interesting part:** Terraform's state JSON schema has changed incompatibly across major versions with no shared parsing library, so tfdiff includes a version-detection adapter layer that normalizes three schema generations into one internal diff format.

[Screenshot/demo placeholder: terminal output showing a flagged breaking change]

## Install
\`go install github.com/user/tfdiff@latest\``,
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
    slug: 'career-jobsearch-career-roadmap-decision-tree',
    category: 'career-jobsearch',
    title: `Build a career roadmap as a decision tree, not a straight-line plan`,
    description: `Produces a multi-year career plan structured around the actual decision points and forks ahead of you — what has to be true to unlock each path — instead of a single confident linear timeline that ignores how uncertain the next move actually is.`,
    promptText: `You are helping me build a career roadmap for the next 3-5 years — but I don't want a single confident straight-line plan, because I genuinely don't know which of two or three directions is right yet, and a fake-precise timeline would be more misleading than useful.

CURRENT POSITION
{{current_position}}

DIRECTIONS I'M CONSIDERING
{{candidate_directions}}

WHAT WOULD MAKE ME CHOOSE ONE OVER ANOTHER
{{deciding_factors}}

CONSTRAINTS
{{constraints}}

Build this as a decision tree, not a single path. For each candidate direction, identify the near-term move that's common to it and at least one other direction — the thing worth doing regardless of which path turns out right — versus the moves that are direction-specific and would need to be reversed or abandoned if I picked differently. For each direction, name the specific signal or decision point, roughly timed, at which I'd have enough information to commit or rule it out — not a vague "see how it goes" but a concrete thing to observe (a project outcome, a skill gap that either closes or doesn't, feedback from a specific type of stakeholder). Where two directions genuinely trade off against each other given my stated constraints, say so plainly rather than implying I can pursue both fully at once. If one of the candidate directions is clearly weaker given my stated deciding factors, say that directly rather than treating all options as equally viable out of politeness.

OUTPUT FORMAT
1. A short list of "no-regret moves" — things worth doing under any of the directions, with rough timing.
2. One subsection per candidate direction: the direction-specific moves, the decision point that would confirm or rule it out, and roughly when that signal would appear.
3. A one-paragraph honest read on whether any direction looks weaker than the others given what I've told you, or whether it's genuinely too early to tell.`,
    variables: [
      {
        name: 'current_position',
        description: `Your current role, level, and what you actually do day to day.`,
        example: `Mid-level data analyst at a retail company, mostly building dashboards and ad hoc reporting.`,
        required: true,
      },
      {
        name: 'candidate_directions',
        description: `The 2-4 directions genuinely under consideration.`,
        example: `1) Move toward data science / ML, 2) move into analytics management, 3) move into a product-adjacent analytics role at a startup.`,
        required: true,
      },
      {
        name: 'deciding_factors',
        description: `What would actually tip you toward one path — not abstract values, specific things you'd weigh.`,
        example: `Whether I enjoy people-management (untested), and whether I can get hands-on ML project experience in my current role within a year.`,
        required: true,
      },
      {
        name: 'constraints',
        description: `Real limits on time, location, income, or risk tolerance.`,
        example: `Can't take a pay cut for at least 18 months; based in a city with few ML-heavy employers.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`career-planning`, `career-roadmap`, `decision-making`, `career-search`, `long-term-strategy`],
    whyItWorks: `Explicitly asking for a decision tree instead of a linear plan preempts a specific default behavior: asked for a "5-year career roadmap" without this framing, GPT-5.1 tends to produce a single confident year-by-year narrative that reads well but papers over the real uncertainty of an unresolved fork, which is actively counterproductive when the honest state of things is that the user doesn't yet know which path is right and forcing false precision would just produce a plan that gets abandoned at year one. Separating no-regret moves from direction-specific moves gives the plan something actionable to do this week regardless of which fork gets taken, which matters because career plans that are entirely conditional on a future decision tend to produce paralysis in the present — there's always a reason to wait for more information before acting. Requiring a concrete, observable signal for each decision point rather than a vague "see how it goes" addresses the fact that unstructured self-reflection about career fit is notoriously unreliable; a person rarely discovers whether they like people-management by introspecting about it, but they do find out by managing one project and noticing whether it energized or drained them, so the prompt forces the model to name that kind of concrete test rather than deferring the whole decision to an unspecified future feeling. The instruction to say plainly when one direction looks weaker matters because an AI model's default politeness bias tends toward presenting all user-suggested options as equally viable, which is a disservice when the user's own stated constraints — a fixed geography with few ML employers, an income floor — already rule one path down; naming that directly is more useful than diplomatic neutrality.`,
    exampleOutput: `No-regret moves: pick up one hands-on statistical modeling project in your current role within 3 months regardless of direction — this serves both the data-science and analytics-management paths.

Direction: Data science / ML — Decision point: within 6-9 months, whether you can land a genuine modeling project (not just dashboards) internally. If your company has no such project pipeline, this path likely requires a lateral move to test, which conflicts with your no-pay-cut constraint for the next 18 months...`,
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
    slug: 'career-jobsearch-promotion-case-document',
    category: 'career-jobsearch',
    title: `Build a promotion case document your manager can forward without editing`,
    description: `Assembles a promotion-justification document organized around the target level's actual competency bar, with your evidence mapped directly to each criterion, so your manager can forward it to the promotion committee with minimal rework.`,
    promptText: `You are helping me build a document making the case for my promotion, structured so my manager can forward it to a promotion committee with minimal editing on their end.

CURRENT ROLE AND TARGET LEVEL
{{current_and_target_level}}

COMPETENCY CRITERIA FOR THE TARGET LEVEL
{{target_level_criteria}}

EVIDENCE I HAVE
{{raw_evidence}}

KNOWN GAPS
{{known_gaps}}

PHASE 1 — MAP EVIDENCE TO CRITERIA
For each criterion in the target level bar, find the strongest piece of evidence from what I gave you that demonstrates it, stated as a specific outcome with scope and impact — not a restated job duty. If a criterion has no strong evidence, say so explicitly rather than stretching a weak example to fit; a gap named honestly is more useful to my manager than a forced fit that a sharp committee member will see through.

PHASE 2 — ADDRESS THE KNOWN GAPS
For each gap I named, write one sentence that either reframes it with mitigating context (scope was limited by something outside my control) or names a concrete plan to close it — do not write defensive language that sounds like an excuse; state it as a fact and a forward plan.

PHASE 3 — ASSEMBLE THE DOCUMENT
Write a one-paragraph summary case at the top, stating the target level and the core argument in plain terms, before the detailed evidence-to-criteria mapping. This is the paragraph a busy committee member reads if they read nothing else, so it has to carry the whole argument on its own.

WHAT NOT TO DO
Do not use inflated language ("instrumental," "pivotal," "drove massive impact") without a specific number or scope backing it. Do not list every project I've touched — a promotion case is stronger with three well-evidenced criteria than ten thin ones.

OUTPUT FORMAT
1. Summary paragraph.
2. Criterion-by-criterion evidence mapping (criterion, evidence, scope/impact).
3. Gap acknowledgment section.
4. A one-line note on which criterion has the weakest supporting evidence, so I know what to strengthen before submitting.`,
    variables: [
      {
        name: 'current_and_target_level',
        description: `Your current title/level and the level you're seeking.`,
        example: `Senior Software Engineer seeking promotion to Staff Engineer.`,
        required: true,
      },
      {
        name: 'target_level_criteria',
        description: `The actual competency bar for the target level, from your company's leveling guide if one exists.`,
        example: `Staff bar requires: cross-team technical influence, mentorship of senior engineers, and ownership of a system with org-wide impact.`,
        required: true,
      },
      {
        name: 'raw_evidence',
        description: `Unstructured notes on what you've actually done that might count as evidence.`,
        example: `Led the migration to a new event bus adopted by four teams; mentored two senior engineers informally; wrote the RFC that became the team's default architecture pattern.`,
        required: true,
      },
      {
        name: 'known_gaps',
        description: `Areas of the criteria you know are weaker, stated honestly.`,
        example: `Mentorship was informal, never assigned officially, and I haven't yet presented at an all-hands or similar org-wide forum.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`promotion-case`, `career-advancement`, `performance-review`, `career-search`, `workplace-documentation`],
    whyItWorks: `Mapping evidence directly to the target level's stated criteria, rather than writing a general accomplishments summary, matches how promotion committees actually evaluate cases — most leveling processes score against a defined competency bar, and a document organized around that bar lets a committee member verify the case criterion by criterion instead of having to reverse-engineer which of several achievements maps to which requirement, which is exactly the extra work that gets a case tabled for "more evidence needed" at the next cycle instead of approved this one. Instructing the model to name a criterion with no strong evidence rather than stretching a weak example addresses a specific risk with promotion cases: committees include people who've seen dozens of these and can spot an evidence stretch immediately, and a document that oversells one weak point casts doubt on the strong points sitting right next to it, so an honest gap is actually the more credible choice, not the weaker one. The instruction to reframe known gaps as fact-plus-forward-plan rather than defensive justification matters because language that reads as an excuse ("I wasn't given the opportunity to...") signals passivity to a promotion committee looking specifically for ownership behavior, whereas the same underlying fact stated plainly alongside a concrete next step signals the opposite. The summary-paragraph-first structure exists because promotion packets are frequently skimmed rather than read in full by every committee member, and a document whose strongest argument is buried in section four effectively has no argument for the reader who only gets through the first paragraph before the meeting starts.`,
    exampleOutput: `Summary: [Name] is ready for Staff Engineer based on three concrete signals: cross-team technical influence (led the event-bus migration adopted by four teams), architectural ownership (authored the RFC that became the team's default pattern), and emerging mentorship (informally guided two senior engineers, though not yet in an officially assigned capacity — a natural next step for this cycle).

Criterion: Cross-team technical influence | Evidence: Led migration to new event bus | Scope: Adopted by 4 teams, replacing a legacy system with recurring incident load...`,
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
    slug: 'career-jobsearch-performance-self-review-draft',
    category: 'career-jobsearch',
    title: `Draft a self-review that reads as confident evidence, not a humble-brag or a list of tasks`,
    description: `Turns a rough log of what you did this review period into a structured self-review draft organized by impact, calibrated to sound confident without sounding inflated, and flagging any section still too thin to submit as-is.`,
    promptText: `You are drafting my self-review for this performance cycle from the raw notes below. The goal is a draft that reads as confident, evidenced self-assessment — not a humble list of completed tasks, and not inflated language that oversells thin results.

REVIEW PERIOD AND FORMAT
{{review_period_and_format}}

RAW NOTES ON WHAT I DID
{{raw_notes}}

STATED COMPANY VALUES OR REVIEW CATEGORIES
{{review_categories}}

AREAS I STRUGGLED WITH
{{struggles}}

For each review category or company value listed, pull the strongest matching example from my raw notes and write it as: what the situation was, what I specifically did, and what changed as a result — using a real number or concrete detail wherever one exists in my notes. If a category has only a weak or generic matching example, say so rather than forcing a thin task into a strong-sounding sentence. For the section on areas I struggled with, write it as a specific, honest account of what happened and what I'm doing differently now, not a rehearsed line like "I sometimes take on too much because I care about quality" — reviewers see that exact sentence constantly and it reads as evasive rather than reflective. Write in first person, confident and factual, avoiding both self-deprecating hedges ("I think I maybe helped a bit with...") and inflated corporate language ("spearheaded," "synergized") that isn't backed by a specific detail in my notes.

OUTPUT FORMAT
1. One short opening paragraph summarizing the period at a high level.
2. One section per review category, each with situation/action/result structure.
3. One honest, specific section on an area of growth.
4. A flagged list of any category where the underlying evidence was thin, so I know where to gather more detail before submitting.`,
    variables: [
      {
        name: 'review_period_and_format',
        description: `The time period being reviewed and any format constraints your company uses.`,
        example: `H2 2026 review, company uses a 4-category rating rubric with a 300-word limit per category.`,
        required: true,
      },
      {
        name: 'raw_notes',
        description: `Unstructured notes on what you actually did this period.`,
        example: `Shipped the new onboarding flow, cut signup drop-off by 12%; ran three A/B tests, two shipped, one killed for no lift; covered for a teammate on parental leave for 6 weeks.`,
        required: true,
      },
      {
        name: 'review_categories',
        description: `The specific categories or values your review format is scored against.`,
        example: `Impact, Collaboration, Technical Craft, Ownership.`,
        required: true,
      },
      {
        name: 'struggles',
        description: `An honest account of something that didn't go well or an area to grow.`,
        example: `Missed the deadline on the onboarding flow by two weeks because I underestimated the QA cycle; didn't flag the risk early enough.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`performance-review`, `self-review`, `workplace-writing`, `career-search`, `professional-development`],
    whyItWorks: `Requiring a situation/action/result structure per category rather than a free-flowing paragraph forces specificity precisely where self-reviews tend to go generic under time pressure — most people writing their own review default to restating job duties ("I worked on the onboarding flow") because that's what comes to mind fastest, while a structured prompt for what changed as a result pulls out the actual outcome, which is what a manager or calibration committee is scoring against. The instruction to flag thin categories rather than force a fit matters because self-reviews get read alongside a manager's independent assessment, and an inflated claim that doesn't match the manager's own memory of the period damages credibility on every other claim in the document, not just the weak one — an honest gap is a smaller cost than a credibility hit. Explicitly banning the rehearsed "I care too much about quality" line for the growth-areas section addresses a known pattern reviewers are fatigued by: that exact sentence is common enough that it now reads as a deflection rather than genuine reflection, and naming a real, specific miss (a missed deadline, a risk not flagged early) reads as more mature, not more damaging, precisely because it's concrete enough to have actually been learned from. The ban on both self-deprecating hedges and inflated corporate language matters because both failure modes come from the same underlying problem — writing about your own work without an external structure to anchor to — and GPT-5.1 left unconstrained will often mirror whichever register the raw notes were written in, so both directions need an explicit counter-instruction rather than assuming the model will land in the middle on its own.`,
    exampleOutput: `Impact: I led the redesign of the onboarding flow, identifying the signup-drop-off point through funnel analysis and shipping a revised flow that cut drop-off by 12%. I also ran three A/B tests this period; two shipped changes that held up post-launch, and one was killed early once data showed no lift, which saved the team from building out a feature that wouldn't have paid off.

Growth area: I underestimated the QA cycle on the onboarding redesign and missed the original deadline by two weeks. The real issue was that I didn't flag the risk once I saw QA finding more edge cases than expected — I'm now building a mid-cycle checkpoint into my own project planning specifically to surface that kind of risk earlier.`,
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
    slug: 'career-jobsearch-career-pivot-narrative',
    category: 'career-jobsearch',
    title: `Build a career pivot narrative that survives the obvious interview follow-up`,
    description: `Writes the story you'll tell about why you're changing fields or roles, stress-tested against the skeptical follow-up question every interviewer actually asks, instead of a feel-good version that collapses under scrutiny.`,
    promptText: `I'm pivoting from one field or role to another, and I need a narrative I can tell in interviews about why — one that holds up when an interviewer pushes back with the obvious skeptical follow-up, not just a version that sounds good on first telling.

WHERE I'M COMING FROM
{{current_background}}

WHERE I'M PIVOTING TO
{{target_field}}

THE REAL REASON I'M MAKING THIS CHANGE
{{real_reason}}

WHAT TRANSFERS AND WHAT DOESN'T
{{transferable_and_gaps}}

First, write the narrative itself: why this pivot, framed around a specific realization or turning point rather than a vague "I've always been passionate about X" — interviewers hear that line constantly and it signals a rehearsed answer rather than a real one. Ground the narrative in the real reason I gave you, even if it's less flattering than an idealized version (bored, wanted more money, burned out) — reshape it into something honest and forward-looking rather than replacing it with a fabricated passion story. Then, anticipate the single most obvious skeptical follow-up an interviewer would ask given this specific pivot (usually some version of "why should we believe you'll stick with this" or "you have no direct experience, why you") and write the answer to that follow-up as its own short paragraph — this is the part that actually gets tested in the room, not the opening narrative. Name explicitly what skills or experience genuinely transfer from my background, backed by something specific from my notes, and name the real gap honestly rather than glossing over it, paired with what I'm doing to close it.

WHAT NOT TO DO
Do not write a version of this story that would fall apart the moment someone asks "okay, but why now, specifically?" Do not claim a lifelong passion for the new field if the real reason was more circumstantial — a fabricated passion story is exactly the kind of answer an experienced interviewer has heard many times and discounts on instinct.

OUTPUT FORMAT
1. The narrative (60-100 words, interview-spoken length).
2. The anticipated follow-up question.
3. The answer to that follow-up (2-3 sentences).
4. What transfers, and the one gap named honestly with a closing plan.`,
    variables: [
      {
        name: 'current_background',
        description: `Your current field, role, and how long you've been in it.`,
        example: `6 years in corporate accounting, most recently as a senior financial analyst.`,
        required: true,
      },
      {
        name: 'target_field',
        description: `The field or role you're pivoting toward.`,
        example: `Data analytics roles in tech, specifically business intelligence.`,
        required: true,
      },
      {
        name: 'real_reason',
        description: `The actual, honest reason for the pivot, even if unflattering.`,
        example: `Accounting work stopped being intellectually engaging after year 3; the BI-adjacent modeling work I did occasionally was the only part I looked forward to.`,
        required: true,
      },
      {
        name: 'transferable_and_gaps',
        description: `What genuinely carries over and what the real gap is.`,
        example: `Strong SQL and financial modeling transfer directly; I have no experience with the BI tooling stack (Looker, dbt) common in these roles, currently doing a self-paced course.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`career-pivot`, `interview-prep`, `career-change`, `career-search`, `personal-narrative`],
    whyItWorks: `Anchoring the narrative in the real, even unflattering reason rather than a manufactured passion story matters because experienced interviewers pattern-match on career-change stories constantly, and the generic "I've always been passionate about data" framing from someone with six years in an unrelated field is instantly recognizable as a rehearsed cover story — it invites more scrutiny, not less, precisely because it's the answer everyone gives. Writing the anticipated follow-up as a separate, explicit step rather than folding it into the main narrative reflects how pivot stories actually get tested in an interview: the opening narrative is rarely where an interviewer pushes, it's the immediate next question ("why should we believe this sticks") where a candidate's prepared story either survives or visibly cracks, so preparing only the opening line and improvising the follow-up live is exactly where most pivot narratives fail under real pressure. Naming the real skill gap honestly, paired with a concrete closing action, works because interviewers evaluating a career-changer are specifically screening for self-awareness about the transition's actual difficulty — a candidate who claims the pivot requires no real adjustment reads as either naive about the target field or dishonest about their current skill level, while a candidate who names the gap and shows an active plan to close it demonstrates exactly the judgment a hiring manager is trying to assess. Keeping the core narrative to interview-spoken length (60-100 words) matters mechanically because a written paragraph and a spoken answer have different natural lengths — a narrative drafted to read well on paper often runs 30-40% longer than it should when spoken aloud in an actual interview room, so the length constraint has to be enforced explicitly rather than left to the model's default writing register.`,
    exampleOutput: `Narrative: Six years into corporate accounting, the parts of my job I actually looked forward to were the occasional modeling and analysis projects, not the core reporting work. When I got pulled into a BI-adjacent project last year, it confirmed what I'd been noticing for a while.

Anticipated follow-up: "You have no direct BI experience — why should we believe this sticks?"

Answer: My SQL and financial modeling skills transfer directly to BI work, and I'm actively closing the tooling gap through a self-paced Looker/dbt course rather than waiting to be hired to learn it.`,
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
    slug: 'career-jobsearch-personal-brand-positioning-statement',
    category: 'career-jobsearch',
    title: `Write a personal brand positioning statement you can actually reuse everywhere`,
    description: `Produces a one-paragraph personal positioning statement and three shorter variants (LinkedIn headline, bio line, elevator intro) built from what genuinely differentiates you, not generic buzzwords that could describe anyone in your field.`,
    promptText: `You are helping me write a personal brand positioning statement — the core sentence or two I'll adapt across my LinkedIn headline, bio, and how I introduce myself, so it needs to say something specific enough that it wouldn't equally describe most other people in my field.

WHAT I DO
{{role_and_field}}

WHAT MAKES MY APPROACH DIFFERENT
{{differentiator}}

WHO I WANT THIS TO RESONATE WITH
{{target_audience}}

EVIDENCE BEHIND THE DIFFERENTIATOR
{{supporting_evidence}}

First, test the differentiator I gave you: would it also describe a typical person in my field, or is it genuinely specific to me? If it's generic ("passionate about solving problems," "data-driven decision maker"), say so and push me to be more specific rather than writing polished copy around a generic claim. Build the positioning statement around the differentiator only once it's specific enough, backed by the supporting evidence I gave you as an implicit credibility anchor even if the statement itself doesn't cite the evidence directly. Write the statement for the specific audience I named — the same underlying differentiator gets framed differently depending on whether I'm speaking to hiring managers, potential clients, or peers in my field.

WHAT NOT TO DO
Do not use industry buzzwords that have lost specific meaning through overuse ("thought leader," "growth-minded," "results-oriented") unless paired with something concrete that earns the word. Do not write a statement so broad it would also fit a LinkedIn profile you've never seen — if it could be copy-pasted onto someone else's profile without anyone noticing, it isn't working yet.

OUTPUT FORMAT
1. The full positioning statement (2-3 sentences).
2. A LinkedIn headline version (under 220 characters).
3. A one-line bio version.
4. A spoken elevator-intro version (15-20 seconds spoken length).
5. A flag if the differentiator I provided needed to be sharpened before you could build a genuinely specific statement from it.`,
    variables: [
      {
        name: 'role_and_field',
        description: `Your current role and industry, briefly.`,
        example: `UX researcher in enterprise B2B software.`,
        required: true,
      },
      {
        name: 'differentiator',
        description: `What you believe sets your approach apart — a starting hypothesis, may need sharpening.`,
        example: `I focus specifically on research for internal/admin tools that most researchers ignore in favor of customer-facing products.`,
        required: true,
      },
      {
        name: 'target_audience',
        description: `Who this positioning statement needs to resonate with most.`,
        example: `Hiring managers at mid-size SaaS companies building internal tooling teams.`,
        required: true,
      },
      {
        name: 'supporting_evidence',
        description: `Concrete proof behind the claimed differentiator.`,
        example: `Led research on 3 internal admin-tool redesigns that each cut internal support ticket volume by double digits.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`personal-branding`, `linkedin-headline`, `career-positioning`, `career-search`, `professional-bio`],
    whyItWorks: `Building in an explicit specificity test before writing any polished copy addresses the single most common failure mode of personal branding exercises: asked to describe what makes them different, most people reach for a trait that's actually near-universal in their field ("data-driven," "passionate about the user"), and a model that writes confident, well-structured prose around that generic input just produces a more polished version of a statement that still says nothing distinguishing — the fix has to happen at the differentiator stage, not the wordsmithing stage, which is why the check comes first as its own explicit step rather than being folded silently into the writing. Tying the statement to concrete supporting evidence, even when the evidence isn't quoted directly in the final copy, keeps the claim honest in a way that matters specifically because personal brand statements get tested in interviews and networking conversations where a follow-up question ("tell me about that") is likely — a differentiator with no real evidence behind it collapses the first time someone asks for an example, while one grounded in a real pattern of work has somewhere to go. Writing distinct versions per audience rather than one statement to paste everywhere reflects that the same true differentiator earns attention differently depending on the reader's own incentives — a hiring manager cares about business outcomes tied to the differentiator, a peer cares about the intellectual approach behind it — and a single generic version optimized for no one in particular tends to undersell the claim to everyone. The instruction to flag whether the input differentiator itself was too generic to build from gives the user a clear signal to do more of their own thinking rather than accepting fluent-sounding output that quietly papered over a weak starting input.`,
    exampleOutput: `Positioning statement: Most UX research in enterprise software chases customer-facing polish while internal tools — the ones employees are stuck using all day — go unresearched. I focus specifically on that gap, and it shows: three internal admin-tool redesigns I led each cut support ticket volume by double digits.

LinkedIn headline: UX Researcher focused on internal/admin tools — the products your employees use all day and no one else researches.`,
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
    slug: 'career-jobsearch-job-search-tracker-system',
    category: 'career-jobsearch',
    title: `Set up a job search tracker that flags stalled applications instead of just logging them`,
    description: `Designs a job application tracking system with built-in staleness rules and follow-up triggers, so applications that have gone quiet surface automatically instead of getting forgotten in a spreadsheet nobody re-checks.`,
    promptText: `You are helping me design a job search tracking system — not just a table format, but a set of rules for what counts as a stalled application that needs action, since most trackers I've tried become a spreadsheet I fill in once and never look at again.

SEARCH VOLUME AND STAGE
{{search_scale}}

MY TYPICAL APPLICATION STAGES
{{application_stages}}

WHAT COUNTS AS "GONE QUIET" FOR ME
{{staleness_definition}}

HOW OFTEN I'LL ACTUALLY CHECK THIS
{{check_frequency}}

PHASE 1 — DESIGN THE COLUMNS
Design a tracker table with columns that support action, not just record-keeping — beyond the obvious (company, role, date applied, stage), include a "next action" column and a "next action due" date column, since a tracker without an explicit next step per row is just a log, not a tool.

PHASE 2 — DEFINE STALENESS RULES
For each stage in my process, define a specific number of days after which a row with no update counts as stalled and needs a follow-up action, based on the staleness definition I gave you — do not invent a one-size-fits-all rule if the stages have genuinely different natural timelines (a "waiting to hear after first application" stage tolerates a longer silence than "no response after final-round interview").

PHASE 3 — BUILD THE CHECK-IN ROUTINE
Given how often I said I'll actually check this, write a short routine for what I do each time I check in — which column to sort by, which rows need action today versus which can wait — sized to something I'll realistically do given my stated check frequency, not an idealized daily ritual I won't keep up.

OUTPUT FORMAT
1. The table structure (column names and what goes in each).
2. Staleness rule per stage, as a simple table (stage, day threshold, action).
3. The check-in routine, as a short numbered list.`,
    variables: [
      {
        name: 'search_scale',
        description: `Roughly how many applications you're managing and what stage of the search you're in.`,
        example: `Actively applying, roughly 5-8 applications open at any time, been searching for 2 months.`,
        required: true,
      },
      {
        name: 'application_stages',
        description: `The typical stages your applications move through.`,
        example: `Applied, recruiter screen, hiring manager interview, final round, offer/reject.`,
        required: true,
      },
      {
        name: 'staleness_definition',
        description: `What silence at each stage actually feels concerning versus normal.`,
        example: `No response 2 weeks after applying feels normal; no response 1 week after a final-round interview feels like a bad sign.`,
        required: true,
      },
      {
        name: 'check_frequency',
        description: `How often you'll realistically check and update the tracker.`,
        example: `Once a week, Sunday evening.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`job-search-tracker`, `application-management`, `job-search-organization`, `career-search`, `productivity-system`],
    whyItWorks: `Requiring a next-action and next-action-due column rather than just status fields addresses the specific reason most job search trackers get abandoned: a spreadsheet that only records what stage each application is in requires the user to independently reconstruct what to do about it every time they open the file, which is exactly the extra cognitive step that makes people stop opening it after a few weeks — a tracker that already states the next action per row removes that reconstruction cost entirely. Defining stage-specific staleness thresholds rather than one blanket rule matters because the natural silence tolerance genuinely differs by stage — two weeks of silence after a first application is unremarkable given typical recruiter workloads, but the same two weeks after a final-round interview is a meaningfully different signal, and collapsing both into one generic "follow up after 10 days" rule either creates false alarms early or misses a real one late. Sizing the check-in routine to the user's actual stated frequency rather than prescribing a daily habit reflects a common failure pattern in productivity system design: a system that assumes more diligence than the person will realistically sustain gets used for a week and then quietly dropped, whereas a routine explicitly scoped to a weekly 10-minute check-in is something that can survive contact with an actual busy job search. Building the routine around sorting by the due-date column rather than reviewing every row in order matters mechanically once the applicant has more than a handful of open applications — without a sort-first instruction, a weekly check-in degenerates into re-reading every stale row from the top, which is precisely the tedium that causes trackers to get abandoned in the first place.`,
    exampleOutput: `Staleness rules:
Applied -> 14 days no response -> Send a short follow-up note to the recruiter or hiring contact if one exists.
Hiring manager interview -> 7 days no response -> Send a follow-up; if no response after a second 7 days, mark as likely-cold.
Final round -> 5 days no response -> Follow up directly; treat as a signal worth a direct, polite status-check email.

Check-in routine: 1) Sort by "next action due," oldest first. 2) Action every row due today or overdue before touching anything else. 3) Spend no more than 2 minutes per row that isn't yet due.`,
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
    slug: 'career-jobsearch-application-follow-up-email',
    category: 'career-jobsearch',
    title: `Write a follow-up email that gives a stalled application a reason to get answered`,
    description: `Drafts a short, specific follow-up email for an application that's gone quiet, timed and worded to the exact stage you're stuck at instead of a generic 'just checking in' that recruiters routinely ignore.`,
    promptText: `You are writing a follow-up email for a job application that's gone quiet. Recruiters get generic "just checking in" emails constantly and mostly skip them, so this one needs a specific reason to be worth a reply.

WHERE THIS APPLICATION STANDS
{{application_stage}}

TIME SINCE LAST CONTACT
{{time_elapsed}}

WHAT'S NEW SINCE I LAST HEARD FROM THEM
{{new_development}}

WHO I'M EMAILING
{{recipient}}

Open the email with the specific stage and timeline ("following up on my [role] interview from [date]") so the recipient doesn't have to search their inbox to place who I am. If I have a genuine new development since last contact — a competing offer with a real deadline, a new relevant accomplishment, a scheduling constraint — lead with that as the actual reason for the email, since a follow-up anchored to something new and true gives the recipient a specific reason to prioritize a reply over the dozens of other things in their inbox; if I don't have anything new, say so and write a shorter, more direct version that simply asks for a timeline update rather than manufacturing a fake reason to write. Keep the tone patient and professional regardless of how long the silence has been — even a long unexplained silence doesn't warrant a passive-aggressive or impatient tone, since hiring processes stall for reasons that have nothing to do with the candidate. End with a specific, easy question (a rough timeline, rather than an open "any updates?") that the recipient can answer in one line.

WHAT NOT TO DO
Do not write "I wanted to circle back and see if there's any update" as the entire email — that's the generic version this prompt exists to avoid. Do not imply frustration or entitlement about the wait, even subtly, regardless of how long it's been.

OUTPUT FORMAT
Subject line and email body, under 100 words in the body.`,
    variables: [
      {
        name: 'application_stage',
        description: `The exact stage this application is at.`,
        example: `Completed final-round interview (panel with three team members) on the 28th.`,
        required: true,
      },
      {
        name: 'time_elapsed',
        description: `How long it's been since your last contact with them.`,
        example: `12 days since the final round, no response since.`,
        required: true,
      },
      {
        name: 'new_development',
        description: `Anything genuinely new since you last heard from them, or none.`,
        example: `I received a competing offer with a decision deadline in 8 days.`,
        required: false,
      },
      {
        name: 'recipient',
        description: `Who you're emailing and your relationship so far.`,
        example: `The recruiter who's been my point of contact throughout, not the hiring manager directly.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`follow-up-email`, `job-application`, `recruiter-communication`, `career-search`, `email-drafting`],
    whyItWorks: `Conditioning the email's core content on whether a genuine new development exists, rather than always manufacturing urgency, matters because recruiters can tell the difference between a real deadline and a fabricated one, and a fake sense of urgency used once and later found to be hollow (no competing offer ever materializes) costs credibility on every future interaction with that recruiter — the honest version, even the shorter, plainer one with no news to report, is the safer default and the instruction to write it that way when there's genuinely nothing new prevents GPT-5.1 from inventing filler urgency to make the email feel more compelling. Anchoring the opening line to the exact stage and date rather than a vague greeting solves a practical problem: a recruiter managing dozens of open requisitions cannot instantly place which candidate and which role a bare "following up!" refers to, and the extra half-second of friction to figure that out is often enough for the email to get deprioritized rather than answered on the spot. The instruction to keep tone strictly patient regardless of elapsed time addresses a specific temptation that grows the longer a silence lasts — a candidate who's waited three weeks past an expected timeline is naturally more likely to let irritation leak into the phrasing, but from the recruiter's side that irritation reads as a red flag about how the candidate would handle ambiguity on the job, so the instruction has to hold especially firm precisely when the elapsed time is longest. Ending on a specific, easy-to-answer question rather than an open "any updates" converts the ask from something that requires the recruiter to compose a status paragraph into something answerable in one sentence, which is the difference between an email that gets a two-line reply today and one that gets mentally filed as "respond properly later" and then forgotten.`,
    exampleOutput: `Subject: Following up on the [Role] final round (Jan 28)

Hi Sam — following up on my final-round interview for the [Role] position on the 28th. I wanted to flag that I've received a competing offer with a decision deadline next Wednesday, so I wanted to check whether there's a rough timeline I could expect on your end before then. Happy to answer anything further in the meantime.`,
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
    slug: 'career-jobsearch-recruiter-inbound-reply-triage',
    category: 'career-jobsearch',
    title: `Reply to an unsolicited recruiter message without wasting time on a mismatched role`,
    description: `Drafts a reply to an inbound recruiter message that quickly establishes fit or mismatch, so you don't end up three emails deep into a role that was never right, and gives you a template for the polite decline as well as the genuine-interest version.`,
    promptText: `A recruiter reached out to me about a role. Before I write anything back, help me figure out whether this is actually worth pursuing, then draft the right kind of reply.

THE RECRUITER'S MESSAGE
{{recruiter_message}}

MY CURRENT SITUATION AND WHAT I'M ACTUALLY LOOKING FOR
{{my_criteria}}

RULES
First, assess fit against what I actually said I'm looking for — not against whether the role sounds impressive in the abstract. If the recruiter's message is too vague to assess (no real details on comp, level, or scope, just "exciting opportunity"), say that plainly and draft a reply that asks for the specific missing details before I commit any more time, rather than a reply that politely proceeds on incomplete information. If the role is a clear mismatch against my stated criteria, draft a brief, polite decline that doesn't over-explain or apologize excessively — a short, clear no preserves the relationship better than a long justification the recruiter didn't ask for. If the role looks like a plausible fit, draft a reply expressing real interest that asks 2-3 specific qualifying questions before agreeing to a call — the questions should be things that would change whether I proceed, not generic questions I'd ask anyway once on the call.

WHAT NOT TO DO
Do not draft a reply that agrees to "hop on a quick call" before basic fit questions (comp range, level, location/remote policy) are answered, if the recruiter's original message didn't already cover them — getting on a call to learn information that could have been an email exchange wastes both people's time. Do not write an enthusiastic reply to a role that doesn't match my stated criteria just because the recruiter's message sounded flattering.

OUTPUT FORMAT
1. A one-line fit assessment (good fit / mismatch / too vague to tell).
2. The drafted reply matching that assessment.
3. If qualifying questions were included, a one-line note on why each one matters enough to ask before a call.`,
    variables: [
      {
        name: 'recruiter_message',
        description: `The actual inbound message from the recruiter, as close to verbatim as possible.`,
        example: `"Hi! I came across your profile and think you'd be a great fit for an exciting Senior Engineer role at a fast-growing startup. Would you be open to a quick chat this week?"`,
        required: true,
      },
      {
        name: 'my_criteria',
        description: `What you're actually looking for right now — comp floor, seniority, remote policy, industries to avoid, etc.`,
        example: `Only considering fully remote roles, minimum $160k base, staff-level or above, not interested in early-stage pre-seed startups.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`recruiter-outreach`, `inbound-recruiter-reply`, `job-search-triage`, `career-search`, `email-drafting`],
    whyItWorks: `Assessing fit against the candidate's own stated criteria rather than the abstract appeal of the message matters because inbound recruiter messages are written to sound exciting regardless of actual fit — "exciting opportunity at a fast-growing startup" is boilerplate language that appears whether or not the role matches what the candidate is actually looking for, and a reply drafted from the tone of the message rather than the candidate's real requirements would happily walk them into a call for a role that was never viable. Instructing the model to flag a vague message rather than proceed politely on missing information addresses a specific time-cost problem in job searching: getting on an intro call only to learn in the first two minutes that the comp range or seniority level is wrong is a preventable waste that a well-placed email question would have avoided, so the reply has to actively surface that information gap rather than treating a call as free to schedule. Keeping the decline reply short and unapologetic rather than heavily justified reflects how professional rejections actually land — recruiters manage high volumes of both outbound and inbound conversations, and a long, over-explained decline reads as more effortful to read than a short one while providing no additional value to either party; a brief, clear no is the version that preserves the relationship for a future, better-matched role. Requiring that qualifying questions be ones that would actually change the decision to proceed, rather than generic questions the candidate would ask anyway on a call, keeps the email from becoming its own multi-round negotiation — the questions exist specifically to filter out a bad fit before a call happens, not to replace the call itself.`,
    exampleOutput: `Fit assessment: Too vague to tell.

Reply: "Thanks for reaching out! Before scheduling a call, could you share a bit more detail — the seniority level for this role, whether it's fully remote, and a rough comp range? Want to make sure we're aligned before we spend time on a call."`,
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
    slug: 'career-jobsearch-offer-comparison-decision-matrix',
    category: 'career-jobsearch',
    title: `Compare two job offers on the factors that will actually matter in year two`,
    description: `Builds a structured offer comparison that weighs total compensation, growth trajectory, and quality-of-life factors against what you said matters most, instead of anchoring on whichever number is biggest in year one.`,
    promptText: `I have two job offers and need a real comparison — not just base salary side by side, since I know that's not actually the full picture and I don't want to make this decision on the one number that's easiest to compare.

OFFER A
{{offer_a_details}}

OFFER B
{{offer_b_details}}

WHAT ACTUALLY MATTERS MOST TO ME RIGHT NOW
{{priority_factors}}

PHASE 1 — NORMALIZE THE COMPENSATION
Calculate a genuinely comparable total-compensation figure for each offer, accounting for base, bonus target (state clearly if it's not guaranteed), equity (state the assumptions you're making about vesting and valuation, and flag that startup equity is a real-terms unknown, not a number to treat as cash-equivalent), and any other named compensation component. Show the math, not just the final number, so I can sanity-check your assumptions.

PHASE 2 — SCORE THE NON-COMP FACTORS
Against the priority factors I listed, score each offer honestly — if one offer is clearly stronger on a factor I said matters most, say so directly rather than finding a way to make both offers sound equally good out of diplomacy.

PHASE 3 — PROJECT TWO YEARS OUT, NOT JUST YEAR ONE
For each offer, note anything in the details that would change the picture by year two — a defined promotion path, a compensation structure that's front-loaded or back-loaded, a role with limited growth ceiling regardless of the starting numbers. A decision based only on year-one numbers can look different once a longer trajectory is considered.

OUTPUT FORMAT
1. A compensation comparison table with the math shown.
2. A priority-factor scoring table (factor, Offer A, Offer B, which is stronger).
3. A short year-two outlook paragraph per offer.
4. A direct recommendation given everything above, stated as a recommendation with reasoning, not a noncommittal "it depends."`,
    variables: [
      {
        name: 'offer_a_details',
        description: `Full details of the first offer.`,
        example: `Base $145k, 10% target bonus (historically paid ~80%), no equity, hybrid 3 days/week, established company, standard promotion cycle every 2 years.`,
        required: true,
      },
      {
        name: 'offer_b_details',
        description: `Full details of the second offer.`,
        example: `Base $130k, no bonus, 0.15% equity over 4-year vest (Series B, last valuation $400M), fully remote, faster-moving team, no formal promotion cycle yet.`,
        required: true,
      },
      {
        name: 'priority_factors',
        description: `What you actually care about most right now, ranked if possible.`,
        example: `In order: remote flexibility, long-term earning potential, day-to-day work variety. Least important: brand name recognition.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`job-offer-comparison`, `salary-negotiation`, `career-decision`, `career-search`, `compensation-analysis`],
    whyItWorks: `Requiring the compensation math to be shown rather than just the final normalized number matters because equity valuations and bonus targets involve real assumptions — a startup equity grant's actual value depends entirely on an exit or valuation event that may never happen, and collapsing that into a single comparable dollar figure without showing the assumption baked in would let the user anchor on a false-precision number that treats speculative equity the same as guaranteed cash, which is a genuinely common and costly mistake in offer comparisons. Instructing the model to score priority factors honestly rather than diplomatically split the difference addresses a specific failure mode in AI-assisted decision support: asked to compare two things a user is emotionally invested in, models often default to a balanced, both-sides framing that avoids taking a clear position, which feels safe but is actually unhelpful when one offer is genuinely and clearly stronger on the exact factor the user said matters most — false balance here just pushes the hard decision back onto the user without giving them anything new. The explicit two-year projection phase exists because job offer comparisons evaluated only on year-one numbers systematically undervalue offers with back-loaded structures (a slower-vesting equity grant, a defined promotion path that kicks in at year two) relative to offers that look stronger purely because they're front-loaded, and a comparison that stops at year one is implicitly comparing the two offers at different points in their actual value curves rather than on equal footing. Ending with a direct recommendation rather than a noncommittal "it depends" matters because the entire point of running this comparison was to get help making the decision — a summary that restates both offers' tradeoffs without taking a position given the user's own stated priorities fails at the one thing the exercise was for.`,
    exampleOutput: `Compensation comparison: Offer A guaranteed cash ~$261k/yr (145k base + 80% of 10% target bonus, historically reliable). Offer B guaranteed cash $130k/yr; the 0.15% equity grant is a real-terms unknown tied to a future exit and should not be treated as equivalent to cash — at the last valuation it implies a theoretical ~$600k over 4 years, but Series B equity commonly returns far less or nothing.

Recommendation: Given that remote flexibility ranked as your top priority and Offer B is fully remote versus Offer A's hybrid requirement, and your stated tolerance for equity risk...`,
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
    slug: 'career-jobsearch-interview-thank-you-email',
    category: 'career-jobsearch',
    title: `Write a post-interview thank-you email that references something real from the room`,
    description: `Drafts a same-day thank-you email anchored to a specific moment from the actual interview conversation, so it reads as a genuine follow-up rather than the templated 'thank you for your time' note every other candidate sends.`,
    promptText: `Write a thank-you email to send after my interview today. It has to reference something specific from the actual conversation — interviewers read a lot of generic thank-you notes and can tell the difference immediately.

WHO I SPOKE WITH AND FOR WHAT ROLE
{{interviewer_and_role}}

SOMETHING SPECIFIC THAT CAME UP IN THE CONVERSATION
{{specific_moment}}

SOMETHING I WISH I'D SAID BETTER OR WANT TO REINFORCE
{{follow_up_point}}

Open by thanking them for their time, but move immediately into the specific moment from the conversation rather than lingering on the thank-you itself — the specific reference is what makes this email worth reading, and it should appear in the first two sentences, not buried further down. If there's a point I want to reinforce or clarify that I didn't land as well as I wanted to in the room, include one short paragraph addressing it directly and briefly — framed as an addition, not as walking back something I said, since re-litigating an answer at length reads as anxious rather than as a considered follow-up. Keep the whole email under 120 words — a thank-you note that goes long undercuts its own purpose, since the interviewer already has everything else they need from the actual interview.

WHAT NOT TO DO
Do not write "Thank you for taking the time to speak with me today, I really enjoyed our conversation and learning more about the role" as the opening — that sentence could be sent to any interviewer for any role and reads as templated the instant it's recognized as such. Do not apologize for or over-explain a weak answer from the interview; briefly reinforcing a point once is fine, dwelling on it is not.

OUTPUT FORMAT
Subject line and email body, under 120 words.`,
    variables: [
      {
        name: 'interviewer_and_role',
        description: `Who you spoke with and what role this was for.`,
        example: `Interview with Dana, the hiring manager, for a Product Marketing Manager role.`,
        required: true,
      },
      {
        name: 'specific_moment',
        description: `An actual detail, question, or moment from the real conversation.`,
        example: `Dana mentioned the team is struggling to get sales and marketing aligned on messaging for a new product line launching in Q1.`,
        required: true,
      },
      {
        name: 'follow_up_point',
        description: `Something you want to reinforce or add to, if anything.`,
        example: `I gave a vague answer on my experience with sales enablement content and want to mention the specific playbook I built at my current company.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`thank-you-email`, `interview-follow-up`, `post-interview`, `career-search`, `email-drafting`],
    whyItWorks: `Requiring the specific conversational moment to appear in the first two sentences rather than after a generic thank-you preamble matters because interviewers who conduct several interviews for the same role read thank-you notes quickly looking specifically for a signal that distinguishes this candidate from the others, and a note that opens with the same boilerplate gratitude line every candidate sends gives them nothing to notice until well into the email, if they keep reading at all. Treating the follow-up point as a brief addition rather than a correction addresses a specific psychological trap candidates fall into after an interview — replaying a weak answer and wanting to fully re-explain it, which read from the interviewer's side as anxiety or a lack of confidence in the original answer rather than as useful supplementary information; framing it as "one more thing that's relevant" rather than "let me try that answer again" keeps the tone forward-looking instead of defensive. The under-120-word constraint exists because a thank-you email's function is narrow and time-sensitive — it needs to land same-day, be read in under a minute, and reinforce a positive impression, not carry the substantive weight the actual interview already carried, so a long thank-you note actually works against its own purpose by implying the interview itself didn't fully make the case and needs a lengthy coda to compensate. Banning the specific generic opening line by name, rather than just instructing the model to "be specific," matters because that exact sentence pattern is common enough across templates that most interviewers have an implicit trained recognition of it, and a soft instruction to be specific doesn't reliably override GPT-5.1's default drift toward familiar professional-email phrasing without a hard constraint naming the pattern to avoid.`,
    exampleOutput: `Subject: Great speaking today, Dana

Hi Dana — thanks for the time today. The sales-and-marketing alignment challenge you mentioned for the Q1 launch stuck with me; it's almost exactly the gap I closed at my current company by building a shared messaging playbook both teams actually used. On my earlier answer about sales enablement experience, that playbook is the concrete example I wish I'd led with. Looking forward to hearing next steps.`,
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
    slug: 'career-jobsearch-resume-achievement-rewriter',
    category: 'career-jobsearch',
    title: `Rewrite a flat resume bullet into an achievement statement that survives a follow-up question`,
    description: `Takes a task-list resume bullet and rewrites it around scope, action, and measurable result, while flagging any rewrite that oversells beyond what you can actually back up in an interview.`,
    promptText: `Rewrite the resume bullet below into a real achievement statement. The test isn't just whether it sounds more impressive — it's whether I could answer a direct follow-up question about it in an interview without backpedaling.

ORIGINAL BULLET
{{original_bullet}}

WHAT ACTUALLY HAPPENED (fuller context)
{{fuller_context}}

TARGET ROLE THIS RESUME IS FOR
{{target_role}}

RULES
Rewrite the bullet using the fuller context to surface the actual scope (team size, budget, timeline, scale) and the specific result, not just the action taken — a bullet that only describes the task ("managed a project") without scope or result reads identically to every other candidate's version of the same task. Use a real number from the fuller context if one exists; if the fuller context doesn't contain a number that would support a strong metric-led bullet, do not invent one — write the strongest honest version without a fabricated statistic, and say so, rather than producing a bullet I couldn't defend if asked "how did you measure that." Tailor which part of the achievement to emphasize based on the target role — the same underlying accomplishment should foreground a different angle for a role that values leadership versus one that values technical depth.

WHAT NOT TO DO
Do not use a strong action verb as a substitute for a real result — "spearheaded," "orchestrated," and similar words don't make a bullet stronger if there's no result attached to justify the word. Do not write a percentage or dollar figure that isn't actually present or clearly derivable from the fuller context I gave you.

OUTPUT FORMAT
1. The rewritten bullet.
2. A one-line note on what specific follow-up question an interviewer would likely ask about this bullet, so I can prepare the answer.
3. If no strong metric was available in the context you were given, a flag saying so and a suggestion for what number I should go find before finalizing this bullet.`,
    variables: [
      {
        name: 'original_bullet',
        description: `The current flat, task-focused resume bullet.`,
        example: `Managed social media accounts for the company.`,
        required: true,
      },
      {
        name: 'fuller_context',
        description: `The real details behind the bullet that didn't make it into the flat version.`,
        example: `Ran Instagram and LinkedIn for a 40-person company; grew Instagram followers from 2,000 to 9,000 in 8 months; no paid budget, all organic.`,
        required: true,
      },
      {
        name: 'target_role',
        description: `The role this resume is being tailored for.`,
        example: `Applying for a Marketing Manager role at a mid-size DTC brand.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`resume-writing`, `achievement-bullets`, `resume-optimization`, `career-search`, `job-application`],
    whyItWorks: `Framing the test as "could you defend this in an interview" rather than "does this sound impressive" changes what the model optimizes for in a way that matters practically: a bullet engineered purely to sound strong on the page can include a number or claim the candidate can't actually walk through when an interviewer asks the natural next question, and that gap gets discovered at the worst possible moment — mid-interview — rather than caught safely during drafting, so building the defensibility test into the instruction itself catches it early. The explicit ban on inventing a metric when the provided context doesn't support one addresses a specific and well-documented behavior: asked to make a resume bullet stronger, models reliably reach for a plausible-sounding percentage because metric-led bullets are the recognized strong pattern, and without a hard constraint against fabrication, a genuinely honest but metric-free achievement gets "improved" into a bullet with a number that was never verified against reality, which is a real risk the candidate would have to answer for later. Tailoring emphasis to the target role rather than writing one universal version of the achievement reflects that resumes get customized per application specifically because the same underlying fact supports different framings — the Instagram growth story is a leadership-and-strategy story for a marketing manager role and could be a completely different technical-execution story for a growth-engineering role, and a bullet optimized generically undersells whichever angle actually matters to this specific reader. Surfacing the likely interview follow-up question alongside the rewritten bullet turns the exercise into interview preparation, not just resume polish — the same information that makes a bullet worth including on the page is what an interviewer will probe on, so preparing the answer at the same time the bullet is written closes a preparation gap that's normally left for the candidate to discover unprepared in the room.`,
    exampleOutput: `Rewrite: Grew company Instagram from 2,000 to 9,000 followers (350%) in 8 months entirely through organic content strategy, with no paid ad budget, while also managing LinkedIn presence for a 40-person company.

Likely follow-up: "What specifically did you change in your content strategy that drove that growth?" — be ready with 2-3 concrete tactics, not just the outcome number.`,
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
]
