import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'students-concept-explainer-prerequisite-gap-check',
    category: 'students',
    title: `Get a concept explained at the exact level where your understanding actually breaks down`,
    description: `Diagnoses which prerequisite idea you're actually missing before explaining a confusing concept, so the explanation targets the real gap instead of restating the textbook at you.`,
    promptText: `You are explaining a concept I'm stuck on, but before you explain anything, you need to find out where my understanding actually breaks down — not assume I'm starting from zero and not assume I have every prerequisite either.

CONCEPT I'M STUCK ON
{{concept}}

WHAT I ALREADY TRIED TO UNDERSTAND IT FROM
{{source_material}}

WHERE IT STOPPED MAKING SENSE
{{breakdown_point}}

MY COURSE LEVEL
{{course_level}}

STEP 1 — DIAGNOSE
Based on where I said it stopped making sense, name the single most likely prerequisite idea I'm missing or misremembering — be specific about which one, not a general "you need more background." Ask me one short question that would confirm or rule out that specific gap before you explain the main concept. Wait-style: state the question clearly as something for me to answer, don't just assume the answer and barrel ahead.

STEP 2 — EXPLAIN (only after stating the diagnostic question)
Give a provisional explanation that assumes the most likely gap is real, built in this order: the prerequisite piece first, stated in one or two sentences; then the concept itself, connected explicitly back to that prerequisite ("this is why that first piece matters"); then one concrete worked example at my course level, not a toy example simpler than what I'll actually be tested on.

WHAT NOT TO DO
Do not just restate the definition from {{source_material}} in different words — if my source already gave me that definition and I'm still stuck, repeating it reworded is not an explanation. Do not pile on three alternative explanations or three different analogies; pick the one path most likely to fix the specific gap you diagnosed and commit to it.

OUTPUT FORMAT
1. Diagnostic question (one sentence).
2. Provisional explanation (prerequisite -> connection -> concept -> one worked example).
3. One check-your-understanding question I should be able to answer if this landed.`,
    variables: [
      {
        name: 'concept',
        description: `The specific concept you're stuck on, named precisely.`,
        example: `Why torque is a vector, not just a magnitude`,
        required: true,
      },
      {
        name: 'source_material',
        description: `What you already read or watched to try to understand it.`,
        example: `My physics textbook's chapter 9 section and the professor's slide deck`,
        required: true,
      },
      {
        name: 'breakdown_point',
        description: `The exact sentence, step, or moment where it stopped making sense.`,
        example: `It made sense until they used the right-hand rule to say the direction is out of the page, and I don't understand why direction even applies to a twisting force`,
        required: true,
      },
      {
        name: 'course_level',
        description: `Your course and level, so the explanation and example match what you'll be tested on.`,
        example: `Intro physics for engineers, first-year college, calculus-based`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`concept-explainer`, `study-help`, `diagnostic-learning`, `physics`, `study-skills`],
    whyItWorks: `Most concept-explainer prompts just ask a model to "explain X simply," which produces a generically simplified restatement of the same source material the student already read and got stuck on — GPT-5.1 defaults to reorganizing available information rather than identifying what's actually absent, so without an explicit diagnostic step it will happily re-explain the definition in slightly different words and the student stays stuck at the same point. Forcing a diagnostic question before any explanation changes the task from "simplify this text" to "identify a specific missing prerequisite," which uses the breakdown-point detail as a symptom to reason backward from, the way a tutor would ask a clarifying question rather than launching into a lecture. Ordering the explanation as prerequisite-first, then explicit connection, then concept, then a single worked example at the stated course level matters because it mirrors how conceptual gaps actually cascade — a student who is stuck on torque's directionality is very often actually missing how the right-hand rule encodes rotation direction as a vector, and no amount of rephrasing torque itself fixes that; the model has to be forced to consider the layer beneath the stated confusion, not the confusion itself. Restricting the explanation to one worked example rather than several analogies matters because GPT-5.1's default instinct when uncertain about what will land is to offer multiple framings, which fragments attention and gives an unfocused student three half-understood models instead of one solid one; committing to a single path forces the diagnosis to actually be used rather than hedged around.`,
    exampleOutput: `Diagnostic question: Do you understand why a force applied off-center (not through the object's pivot point) makes something rotate rather than just slide? Provisional explanation: Torque isn't a new kind of force — it's how we measure a force's twisting effect, which depends on both how hard you push and where you push relative to the pivot. Because that twisting effect has a specific rotational direction (clockwise vs counterclockwise, or in 3D, an axis), we represent it as a vector using the right-hand rule: curl your fingers in the rotation direction, your thumb points along the torque vector...`,
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
    slug: 'students-eli5-analogy-without-losing-the-mechanism',
    category: 'students',
    title: `Get a true ELI5 that keeps the actual mechanism instead of trading accuracy for cuteness`,
    description: `Produces a simplified explanation built around one analogy that maps onto the real mechanism piece by piece, then explicitly flags where the analogy breaks down so you don't walk away with a wrong mental model.`,
    promptText: `Explain {{topic}} to me the way you'd explain it to a curious 10-year-old, but I need the explanation to still be technically honest — not simplified to the point where it's actually wrong.

TOPIC
{{topic}}

WHY I NEED TO UNDERSTAND IT
{{context}}

WHAT I ALREADY KNOW THAT'S RELATED
{{related_knowledge}}

Pick exactly one analogy or everyday comparison and build the whole explanation around it — do not switch analogies partway through, and do not offer a backup analogy "in case that one didn't land," since juggling two half-explained comparisons is worse than committing to one. Map each real component of {{topic}} onto a specific part of the analogy explicitly, in a short list, so I can see which piece of the analogy stands for which real thing rather than just enjoying the story. After the mapped explanation, add a short section titled "Where this analogy breaks down" that states plainly the one or two places where the comparison stops being accurate, so I don't accidentally build a wrong mental model out of the parts of the analogy that don't actually correspond to reality. Use {{related_knowledge}} as your anchor point — connect the new idea to something I already know rather than starting from nothing, since a 10-year-old explanation still has to start somewhere familiar to actually be simple.

WHAT NOT TO DO
Do not use jargon and then immediately define it — if a word needs a definition, don't use it at all; find the plain-language version instead. Do not add caveats and hedges throughout the main explanation (save the one honest caveat for the breakdown section).

OUTPUT FORMAT
1. The single analogy, introduced in one or two sentences.
2. The mapped explanation (analogy piece -> real thing, as a short list).
3. "Where this analogy breaks down" (1-2 sentences).
4. One follow-up question I could ask if I want to go one level deeper.`,
    variables: [
      {
        name: 'topic',
        description: `The specific thing you need explained simply.`,
        example: `How a blockchain actually prevents someone from double-spending the same coin`,
        required: true,
      },
      {
        name: 'context',
        description: `Why you need this right now — helps calibrate depth and what actually matters.`,
        example: `My roommate keeps talking about crypto and I want to actually follow the conversation, not just nod`,
        required: true,
      },
      {
        name: 'related_knowledge',
        description: `Something you already understand that the explanation can anchor to.`,
        example: `I understand how a shared Google Doc's edit history works`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`eli5`, `analogy`, `simple-explanation`, `study-help`, `concept-learning`],
    whyItWorks: `A bare "explain like I'm 5" request lets GPT-5.1 default to whatever analogy sounds most vivid rather than one that actually maps cleanly onto the mechanism, and models under a simplicity instruction tend to drift toward oversimplification that quietly drops or distorts the part of the concept that made it confusing in the first place — the double-spending problem, for instance, gets glossed into "it's like a shared ledger everyone can see," which is true but skips the actual mechanism of why consensus prevents fraud. Requiring an explicit piece-by-piece mapping between the analogy and the real components forces the model to check its own analogy against the actual mechanism rather than free-associating a comparison and hoping it's roughly right, which is the difference between an analogy that teaches and one that just entertains. The "where this breaks down" section exists because every analogy simplifies by dropping some structure, and a student who only gets the analogy without being told what it doesn't cover will confidently apply the wrong parts of it later — a blockchain isn't literally a Google Doc where anyone can just overwrite history, and if that gap isn't flagged the learner will eventually get tripped up by their own mental model. Committing to one analogy rather than offering alternates matters because GPT-5.1, when uncertain which framing will land, tends to hedge by offering two or three comparisons in parallel, which for a genuine beginner just means juggling several partially-understood metaphors instead of building one solid one all the way through.`,
    exampleOutput: `Analogy: think of a shared notebook that everyone in your class has an identical copy of. Mapping: each new transaction = a new line written in everyone's notebook at once; a "block" = a page that gets sealed once it's full; mining/consensus = everyone comparing notebooks and only accepting the version most people agree on. Where this breaks down: unlike a real classroom notebook, nobody can just physically show you their copy is fake — the actual mechanism uses cryptographic math to make copying or forging a page computationally expensive rather than socially checked...`,
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
    slug: 'students-study-plan-fixed-hours-exam-countdown',
    category: 'students',
    title: `Build a study plan that fits the hours you actually have left before the exam, not the hours you wish you had`,
    description: `Reverse-engineers a day-by-day study plan from your real available hours and a topic list ranked by weight and weakness, so the schedule is something you can realistically follow instead of an idealized plan that collapses by day three.`,
    promptText: `Build me a study plan for an upcoming exam, working backward from the actual hours I have available — not an idealized plan assuming unlimited time.

EXAM AND DATE
{{exam_details}}

TOPICS TO COVER, WITH ROUGH WEIGHT ON THE EXAM
{{topic_list}}

MY REALISTIC AVAILABLE HOURS PER DAY UNTIL THEN
{{available_hours}}

WHERE I'M WEAKEST RIGHT NOW
{{weak_areas}}

Step 1: Calculate total available study hours between now and the exam date using {{available_hours}}, and state that total number explicitly before building anything — if the math doesn't support covering every topic at the depth {{topic_list}} implies, say so plainly and tell me what has to be cut or compressed rather than quietly producing an overstuffed plan that assumes I'll find extra hours somewhere.

Step 2: Allocate hours across topics using both exam weight and current weakness from {{weak_areas}} — a heavily-weighted topic I already know well needs a light review pass, not equal time to a heavily-weighted topic I'm weak in. Never allocate equal time per topic by default; that's the most common way study plans waste hours on things that don't need it.

Step 3: Build the actual day-by-day schedule, and for the final 2 days before the exam, allocate that time specifically to active recall and practice problems across everything, not new material — cramming new content in the last 48 hours has the worst return of any block in the plan.

WHAT NOT TO DO
Do not build a plan with study blocks longer than 90 minutes without a break marked in the schedule. Do not assume weekends give the same hours as weekdays unless {{available_hours}} says so.

OUTPUT FORMAT
1. Total available hours and an honest assessment of whether the topic list fits.
2. A table: day, topics, hours, focus type (new material / review / practice problems / active recall).
3. One paragraph flagging the single highest-risk day in the plan and why.`,
    variables: [
      {
        name: 'exam_details',
        description: `The exam name, format, and exact date.`,
        example: `Organic Chemistry II final, mostly mechanism problems and one essay question, on September 3rd`,
        required: true,
      },
      {
        name: 'topic_list',
        description: `Topics on the exam with a rough sense of how heavily each is weighted.`,
        example: `SN1/SN2 reactions (30%), aromaticity (25%), spectroscopy (20%), stereochemistry (25%)`,
        required: true,
      },
      {
        name: 'available_hours',
        description: `Realistic hours per day you can actually study, accounting for classes, work, and life.`,
        example: `2 hours on weekdays, 5 hours on Saturday, 3 hours on Sunday`,
        required: true,
      },
      {
        name: 'weak_areas',
        description: `Which topics you're currently weakest in, honestly assessed.`,
        example: `Stereochemistry — I still mix up R/S assignments under time pressure; spectroscopy I'm solid on`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`study-plan`, `exam-prep`, `time-management`, `active-recall`, `study-schedule`],
    whyItWorks: `The most common failure of AI-generated study plans is that they divide topics evenly across however many days are left without ever checking whether the total hours actually support the depth implied by the topic list, producing a plan that looks organized but silently assumes the student has more time than they do — forcing an explicit total-hours calculation up front, stated as a number before any schedule is built, catches that mismatch the same way a real tutor would say "you don't have enough time to cover all of this at the level you want, here's what to cut" rather than pretending otherwise. Weighting allocation by both exam weight and current weakness rather than exam weight alone matters because a naive weighting scheme still wastes hours reviewing a heavily-tested topic the student already knows cold, when that same time would close a bigger score gap in a weaker area; GPT-5.1 will default to a simple proportional split unless explicitly told to cross-reference weight against weakness, since that's the lower-effort interpretation of "allocate by importance." Reserving the final 48 hours specifically for active recall and practice problems rather than new material reflects a well-established real effect in learning: cramming genuinely new content in the last day or two before an exam has a worse time-to-retention payoff than retrieval practice on material already seen once, because recognition-level familiarity from a first pass doesn't transfer to exam-condition recall without a retrieval attempt — a plan that lets new material bleed into the final two days is optimizing for coverage instead of what the exam actually measures. Capping study blocks at 90 minutes with breaks marked directly in the schedule matters because a plan is only useful if it's actually followable, and a schedule of unbroken 3-hour blocks looks efficient on paper but gets abandoned by day two.`,
    exampleOutput: `Total available hours: 10 weekdays x 2h + 2 Saturdays x 5h + 2 Sundays x 3h = 36 hours. Given four topics at this weighting and your stereochemistry gap, 36 hours is workable but tight — spectroscopy review will need to be compressed to a single pass rather than the two passes ideally warranted. Day 1 (Mon, 2h): Stereochemistry fundamentals, R/S assignment drills (new + practice)...`,
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
    slug: 'students-lesson-plan-mixed-readiness-classroom',
    category: 'students',
    title: `Draft a lesson plan that still works when half the class already gets it and half doesn't`,
    description: `Builds a single-period lesson plan with a built-in branch point for students who finish the core task early and ones who need more scaffolding, instead of pretending the whole class moves at the same pace.`,
    promptText: `You are helping me draft a lesson plan for one class period, and I need it to actually work for a mixed-readiness classroom — not assume every student is at the same starting point.

SUBJECT AND GRADE LEVEL
{{subject_grade}}

LEARNING OBJECTIVE FOR THIS PERIOD
{{objective}}

CLASS PERIOD LENGTH
{{period_length}}

WHAT I KNOW ABOUT THE READINESS SPREAD
{{readiness_spread}}

MATERIALS I ALREADY HAVE ACCESS TO
{{available_materials}}

Build the lesson in four timed segments: a hook (short, tied directly to {{objective}}, not a generic warm-up unrelated to today's content), direct instruction, guided practice, and independent practice — give each segment a specific minute allocation that sums to {{period_length}}. For the independent practice segment specifically, write two parallel tracks based on {{readiness_spread}}: a "core task" every student attempts, and an explicit branch — an extension task for students who finish the core task early that goes deeper on the same objective rather than just being "more of the same, but harder," and a scaffolded version of the core task for students who are struggling, that removes one specific source of difficulty rather than just simplifying everything. Name the exact trigger for switching a student onto either branch (e.g., "finishes the core task with 8+ minutes left" or "stuck on step 2 for more than 3 minutes") — a branch nobody can identify when to use in the moment doesn't actually get used. Write one formative check — something you can observe or collect in under 2 minutes — that tells you by the end of the period whether {{objective}} actually landed, distinct from just asking "any questions?"

WHAT NOT TO DO
Do not write generic classroom-management language ("engage students," "foster a positive environment") — every line should be a concrete instructional move. Do not assume materials beyond {{available_materials}} are available.

OUTPUT FORMAT
1. Table: segment, minutes, what the teacher does, what students do.
2. The independent-practice branch: core task, early-finisher extension with its trigger, and struggling-student scaffold with its trigger.
3. The formative check and what result would mean the objective didn't land.`,
    variables: [
      {
        name: 'subject_grade',
        description: `The subject and grade level you're teaching.`,
        example: `7th grade math`,
        required: true,
      },
      {
        name: 'objective',
        description: `The specific, single learning objective for this one period.`,
        example: `Students can solve two-step linear equations involving negative coefficients`,
        required: true,
      },
      {
        name: 'period_length',
        description: `How long the class period actually runs.`,
        example: `50 minutes`,
        required: true,
      },
      {
        name: 'readiness_spread',
        description: `What you know about how the class varies in current understanding.`,
        example: `About a third can already do one-step equations fluently; a third are shaky on integer operations, which will make negative coefficients hard regardless of the new content`,
        required: true,
      },
      {
        name: 'available_materials',
        description: `What resources, tech, and manipulatives you actually have on hand.`,
        example: `Whiteboards for pairs, a class set of Chromebooks, no printer access today`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`lesson-plan`, `differentiated-instruction`, `teaching`, `classroom-management`, `formative-assessment`],
    whyItWorks: `A generic lesson-plan prompt produces a single linear sequence of activities that implicitly assumes a homogeneous class, which is why so many AI-drafted lesson plans look clean on paper but fall apart the moment a third of the room finishes in half the time and another third is stuck on a prerequisite skill the plan didn't account for — explicitly requiring two branches inside independent practice, keyed to the actual readiness spread the teacher described, forces the plan to engage with the classroom that actually exists rather than an idealized average student. Naming a concrete, observable trigger for switching a student onto either branch (finishing with a specific number of minutes left, or being stuck on a specific step for a specific duration) matters because differentiation instructions that just say "give struggling students more support" are unusable in the middle of teaching thirty kids — a teacher needs a decision rule they can apply in the moment without stopping to think, and GPT-5.1 will produce that level of concreteness only when explicitly asked for a trigger rather than a general description of who needs what. Requiring the extension task to go deeper on the same objective rather than being generically harder addresses a common shallow pattern where "advanced" work is just more repetitions of the same skill at bigger numbers, which doesn't actually extend understanding of the underlying objective. The formative check requirement — something collectible in under two minutes with a stated failure signal — exists because "any questions?" produces silence regardless of whether the room understood the material, and a lesson plan without a real read on whether the objective landed leaves the teacher planning tomorrow's lesson on a guess rather than evidence.`,
    exampleOutput: `Hook (5 min): Show a two-step equation from last week (one-step-plus-familiar) next to today's target equation with a negative coefficient, ask students to predict what's different. Direct instruction (12 min)... Independent practice (18 min): Core task — 6 two-step equations with negative coefficients. Extension (trigger: finishes core task with 8+ min left): equations requiring the same skill but with a variable on both sides, extending the same objective rather than just more repetitions. Scaffold (trigger: stuck on step 2, sign of the coefficient, for 3+ min): equations pre-marked with the sign-flip step isolated as its own line...`,
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
    slug: 'students-worksheet-graduated-difficulty-with-answer-key',
    category: 'students',
    title: `Generate a practice worksheet that actually ramps in difficulty instead of scattering easy and hard problems randomly`,
    description: `Produces a worksheet of practice problems ordered by genuine difficulty progression on one skill, with a matching answer key showing worked steps, not just final answers.`,
    promptText: `Create a practice worksheet on one specific skill, with problems that genuinely ramp in difficulty rather than being randomly ordered at similar difficulty.

SKILL TO PRACTICE
{{skill}}

GRADE OR COURSE LEVEL
{{level}}

NUMBER OF PROBLEMS
{{problem_count}}

SPECIFIC ERROR PATTERN TO TARGET
{{common_mistake}}

Divide {{problem_count}} problems into three difficulty bands of roughly equal size: foundational (tests the core mechanic alone, nothing else), applied (the core mechanic embedded in a slightly more realistic or multi-step context), and stretch (combines the skill with one adjacent skill or requires noticing an exception to the usual pattern). Within the applied and stretch bands, deliberately include at least one problem specifically engineered to trigger {{common_mistake}} — not by making it a trick question, but by presenting a normal-looking problem where the shortcut a student would use if they have that misconception gives a visibly wrong answer, so getting it wrong is diagnostic rather than just unlucky. Label each problem's band inline in a way a teacher could strip out before printing for students (e.g., a bracketed tag) but leave visible in the version I'm looking at now.

Then produce a separate answer key. For every problem in the applied and stretch bands, show the worked steps, not just the final answer — a final-answer-only key doesn't let anyone check where a wrong answer went wrong. For the problem(s) targeting {{common_mistake}} specifically, add one line in the answer key explaining what the wrong answer would look like if a student made exactly that mistake, so a teacher grading by hand can recognize it instantly instead of having to re-derive it.

WHAT NOT TO DO
Do not make the stretch band so difficult it requires content outside {{level}} — stretch means harder application of what's already been taught, not new material.

OUTPUT FORMAT
1. The worksheet, problems grouped and labeled by band.
2. The answer key with worked steps, and the diagnostic note on the targeted-mistake problem(s).`,
    variables: [
      {
        name: 'skill',
        description: `The one specific skill this worksheet drills.`,
        example: `Finding the area of composite shapes made of rectangles and triangles`,
        required: true,
      },
      {
        name: 'level',
        description: `Grade level or course, to bound vocabulary and complexity.`,
        example: `6th grade math`,
        required: true,
      },
      {
        name: 'problem_count',
        description: `Total number of problems on the worksheet.`,
        example: `12`,
        required: true,
      },
      {
        name: 'common_mistake',
        description: `The specific misconception or error pattern you want at least one problem to catch.`,
        example: `Students forget to subtract the cut-out triangle's area and just add all the shape areas together`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`worksheet`, `practice-problems`, `answer-key`, `math-practice`, `teaching-resources`],
    whyItWorks: `A default worksheet-generation prompt produces problems that are all roughly the same difficulty with only surface-level numbers changed, because GPT-5.1's easiest interpretation of "practice problems" is variation on a template rather than genuine escalation — explicitly defining three bands with a stated purpose for each (isolate the mechanic, apply it in context, combine it with something else) forces a real difficulty gradient instead of a list that only looks varied. Engineering a specific problem to trigger a named common mistake — rather than just hoping some problem happens to catch it — is what makes a worksheet diagnostic instead of just repetitive; a problem constructed so that the exact shortcut behind {{common_mistake}} produces a plausible-looking wrong answer means a teacher can look at which students got that one specific problem wrong and know precisely what to reteach, rather than only knowing a student missed a problem for unspecified reasons. Requiring worked steps in the answer key rather than final answers only matters because a bare answer key can confirm a student got something wrong but can't show where, which is the entire diagnostic value of an error-pattern-targeted worksheet in the first place — and adding an explicit note on what the wrong answer looks like if the targeted mistake was made turns grading from a slow re-derivation into instant pattern recognition, since the teacher doesn't have to reconstruct the error path themselves for every wrong answer they see. Bounding the stretch band to stay within {{level}}'s existing content, rather than letting difficulty escalate into material not yet taught, keeps the worksheet aligned to what "stretch" is supposed to mean — harder application of known material, not a preview of next unit.`,
    exampleOutput: `[Foundational] 1. Find the area of a rectangle 8cm x 5cm. [Applied] 5. A garden is shaped like a rectangle 10m x 6m with a triangular flower bed (base 4m, height 3m) removed from one corner — find the remaining area. [Stretch, targets common mistake] 9. A room's floor plan is an L-shape formed by a 12ft x 10ft rectangle with a 4ft x 3ft triangular corner cut off for a closet nook — find the usable floor area. Answer key #9: Correct approach subtracts the triangle (6 sq ft) from the rectangle (120 sq ft) = 114 sq ft. If a student adds instead of subtracts the cut corner, they'd get 126 sq ft — that wrong answer flags the targeted misconception directly...`,
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
    slug: 'students-homework-coach-stuck-step-diagnosis',
    category: 'students',
    title: `Get unstuck on a specific homework problem without being handed the answer`,
    description: `Walks through exactly where you're stuck on one problem, gives you the next single step rather than the full solution, and only escalates to more help if that step alone doesn't unstick you.`,
    promptText: `I'm stuck on a specific homework problem and I want to actually learn how to solve it, not just get the answer. Coach me through it step by step, giving me only the next step at a time.

THE PROBLEM
{{problem}}

WHERE I GOT STUCK
{{stuck_point}}

WHAT I'VE TRIED SO FAR
{{attempts_so_far}}

WHAT WE'VE COVERED IN CLASS RECENTLY
{{recent_class_material}}

Rules for this session: never give me the full solution up front, even if I ask for it directly — if I ask for the answer outright, remind me briefly why working through it will help more, then offer the next step instead. Look at {{stuck_point}} and {{attempts_so_far}} first and diagnose the most likely reason I'm stuck — a missing piece of recently-covered material, a misapplied rule, or a step I skipped — before giving me anything. State that diagnosis to me in one sentence so I understand why I got stuck, not just what to do next. Then give me exactly one next step: either a guiding question that should unstick me on my own, or, if a guiding question wouldn't be enough given {{recent_class_material}}, the smallest concrete hint that lets me continue myself. After I respond with what I did with that step, check my work specifically for the error pattern you diagnosed — if it's fixed, give me the next step; if I made the same kind of mistake again, explain that specific misconception plainly (not just "try again") before continuing.

WHAT NOT TO DO
Do not solve more than one step ahead of where I currently am. Do not give generic encouragement filler between steps — keep responses short and focused on the next move.

OUTPUT FORMAT
1. One-sentence diagnosis of why I'm likely stuck.
2. One next step (question or minimal hint) — nothing beyond that.
3. A prompt for me to show what I did before you continue.`,
    variables: [
      {
        name: 'problem',
        description: `The exact homework problem, as given.`,
        example: `Solve for x: 3(x - 4) + 2x = 5x - 12 + 6`,
        required: true,
      },
      {
        name: 'stuck_point',
        description: `Exactly where in your attempt things stopped making sense.`,
        example: `I distributed the 3 and got 3x - 12, but then I'm not sure what to do with the 2x on the same side`,
        required: true,
      },
      {
        name: 'attempts_so_far',
        description: `What you actually tried, including any wrong turns.`,
        example: `I tried combining 3x and 2x into 5x, giving 5x - 12 = 5x - 6, and then got confused because the x terms seem to cancel out`,
        required: true,
      },
      {
        name: 'recent_class_material',
        description: `What's been covered recently, to calibrate what you should already know vs. what's genuinely new.`,
        example: `We just started combining like terms across an equals sign, haven't done equations with variables on both sides yet as its own topic`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`homework-help`, `homework-coach`, `step-by-step`, `math-tutoring`, `active-learning`],
    whyItWorks: `Left unconstrained, GPT-5.1's default response to a homework question is to solve it end to end, because a complete solution is the most directly "helpful"-looking output and the model has no built-in incentive to withhold it — the explicit rule against giving the full solution, plus the instruction to reiterate that rule even under direct pressure to just give the answer, is what keeps the interaction pedagogically useful instead of collapsing into an answer-delivery service the first time the student pushes back. Requiring a diagnosis before any help is given matters because {{stuck_point}} and {{attempts_so_far}} together usually contain enough signal to identify the actual misconception (in the example, the student's work reveals they don't yet know how to handle x-terms canceling to a false statement), and skipping straight to "here's the next step" without naming that misconception means the student can execute the fix mechanically without understanding why the previous approach failed, which sets them up to repeat the same error on the next problem. Limiting help to exactly one step at a time, gated behind the student showing their own work before the next step is revealed, forces genuine retrieval and application rather than passive reading — this mirrors how effective human tutoring actually works and directly counters the model's tendency to front-load everything it knows about a problem into one response. The instruction to check specifically for the diagnosed error pattern on the student's follow-up, rather than just checking if the final answer is right, means a student who fixes the symptom but not the underlying misconception gets caught immediately rather than being told "looks good" and moving on with a fragile understanding.`,
    exampleOutput: `Diagnosis: it looks like you haven't yet hit variable-on-both-sides equations as a named topic, so when the x terms combined to 5x on both sides, you didn't have a frame for what that means (the equation becomes 5x - 12 = 5x - 6). Next step: try subtracting 5x from both sides and tell me what you're left with — what does that tell you about this equation?`,
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
    slug: 'students-socratic-tutor-question-only-no-answers',
    category: 'students',
    title: `Run a strict Socratic tutoring session where the AI is only allowed to ask questions, never state facts`,
    description: `Sets up a tutoring conversation with a hard rule that the AI can only respond in questions, forcing you to construct the reasoning yourself instead of pattern-matching to a given explanation.`,
    promptText: `Run a Socratic tutoring session with me on the topic below. Your only allowed move in this entire conversation is to ask me a question — you are never permitted to state a fact, give an explanation, or confirm/deny an answer directly, even when I ask you to.

TOPIC
{{topic}}

MY CURRENT UNDERSTANDING (STARTING POINT)
{{starting_understanding}}

GOAL OF THIS SESSION
{{session_goal}}

HARD RULE
Every single response from you must be a question, and nothing else — no statements before the question, no "That's correct, and now...", no explanations tacked onto the end. If I answer wrong, do not tell me I'm wrong; ask a question that would lead me to notice the problem myself (e.g., ask me to apply my answer to a case where it clearly fails, or ask me to restate my reasoning out loud). If I get stuck and can't answer at all, do not give me the answer — ask a smaller, more specific question that breaks the current question into an easier first step, working backward toward something I can actually answer from {{starting_understanding}}. If I directly ask you to just tell me the answer, respond only with a question that reframes the ask (e.g., "What do you think would happen if...") — never break character to explain why you're doing this.

Start the session now with a single opening question based on {{session_goal}} and {{starting_understanding}} — pick a question that's answerable from where I'm currently starting, not one that assumes knowledge beyond {{starting_understanding}}.

OUTPUT FORMAT
Just the single opening question. Every message after this, in the whole session, follows the same hard rule: one question, nothing else.`,
    variables: [
      {
        name: 'topic',
        description: `The topic or question this session is working toward understanding.`,
        example: `Why supply and demand curves shift versus move along the curve`,
        required: true,
      },
      {
        name: 'starting_understanding',
        description: `What you currently understand, honestly, as the starting point for questions.`,
        example: `I know the basic shapes of the curves and that price is on the y-axis, but I keep mixing up 'shift' and 'movement along'`,
        required: true,
      },
      {
        name: 'session_goal',
        description: `What you want to be able to do or explain by the end of the session.`,
        example: `Be able to correctly identify, for five different scenarios, whether it's a shift or a movement along the curve`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`socratic-method`, `tutoring`, `active-recall`, `economics`, `critical-thinking`],
    whyItWorks: `GPT-5.1's default conversational instinct, even when explicitly asked to be Socratic, is to slip an explanation or confirmation into the response alongside a question — a phrase like "That's close, remember that a shift means..." followed by a question still does the cognitive work for the student, because the student can extract the fact from the sentence before the question mark ever registers. The hard, absolute rule that every single message must be a question and literally nothing else closes that loophole mechanically rather than relying on the model's general sense of what "Socratic" means, which is exactly the kind of instruction that needs to be stated as an inviolable constraint rather than a stylistic preference, since a partial adherence still lets the answer leak through. The instruction for what to do when the student is simply wrong — ask a question that surfaces the failure themselves, such as applying their own answer to a case where it breaks — is the actual mechanism of Socratic method: the student discovers the contradiction in their own reasoning rather than being told there is one, which produces a correction that's self-generated and therefore stickier than one handed to them. The fallback for a genuinely stuck student, decomposing into a smaller answerable question rather than defaulting to an explanation, keeps the entire session inside the question-only constraint even at the point where a normal tutor would be most tempted to just explain — this is the hardest part of the rule to hold and the part most likely to break down without an explicit instruction for exactly that failure case. The instruction to resist a direct request for the answer by reframing rather than breaking character prevents the single most common way this kind of prompt collapses in practice, since students under time pressure will predictably ask for the answer directly at some point in the session.`,
    exampleOutput: `Opening question: If the price of gasoline suddenly drops for reasons unrelated to the demand for cars, what do you think happens to how many cars people want to buy at each possible price — and would you draw that as the same demand curve, or a new one?`,
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
    slug: 'students-essay-feedback-rubric-anchored-revision-priority',
    category: 'students',
    title: `Get essay feedback ranked by what would actually raise your grade, not a scattershot list of every issue found`,
    description: `Scores your draft against the actual rubric criteria, then ranks feedback by realistic point impact so you know what to fix first with limited revision time, instead of an undifferentiated wall of comments.`,
    promptText: `Give me feedback on this essay draft, but I need it prioritized by what will actually move my grade, not a flat list of every issue you notice — I have limited time before this is due and need to know what to fix first.

ESSAY DRAFT
{{essay_text}}

RUBRIC OR GRADING CRITERIA
{{rubric}}

ASSIGNMENT PROMPT
{{assignment_prompt}}

TIME I HAVE TO REVISE
{{time_available}}

First, go criterion by criterion through {{rubric}} and give an honest current-draft assessment against each one — not a vague impression, but which specific part of the essay is or isn't meeting that criterion, quoting or referencing the actual passage. Then rank the issues you found by realistic point impact: which fix would move the score the most for the effort it takes, given {{time_available}}. A large structural issue (the thesis doesn't actually match what the body paragraphs argue) that's fixable in the time available should outrank a dozen small wording issues, even though the wording issues are individually easier to explain. For each of the top 3 priority issues, give a specific instruction for the fix — not "strengthen your thesis" but the actual sentence-level or paragraph-level change to make, tied to the actual text in {{essay_text}}. Explicitly flag if the essay doesn't actually answer {{assignment_prompt}} as asked, since that's a category of problem no amount of line-editing fixes and it needs to be caught before anything else.

WHAT NOT TO DO
Do not rewrite the essay for me or produce a corrected version — that's not what's being asked, and it would replace my thinking rather than improve my draft. Do not comment on every small grammar issue in prose; if there are recurring small issues, name the pattern once rather than flagging each instance.

OUTPUT FORMAT
1. Criterion-by-criterion assessment (rubric item -> current state -> met/partially met/not met).
2. Whether the essay actually answers the assignment prompt as asked.
3. Top 3 priority fixes, ranked, each with a specific actionable instruction.
4. One line on what NOT to spend revision time on given {{time_available}}.`,
    variables: [
      {
        name: 'essay_text',
        description: `The full essay draft text.`,
        example: `[Full text of a 5-paragraph essay on the causes of the fall of the Roman Republic]`,
        required: true,
      },
      {
        name: 'rubric',
        description: `The actual grading rubric or criteria, as specifically as you have it.`,
        example: `Thesis clarity (20%), use of evidence (30%), organization (20%), analysis depth (20%), mechanics (10%)`,
        required: true,
      },
      {
        name: 'assignment_prompt',
        description: `The original assignment question or prompt.`,
        example: `Argue whether economic inequality or institutional breakdown was the more significant cause of the Republic's fall, using at least two primary sources`,
        required: true,
      },
      {
        name: 'time_available',
        description: `How much time you realistically have to revise before the deadline.`,
        example: `About 90 minutes tonight before it's due tomorrow morning`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`essay-feedback`, `writing-help`, `rubric`, `revision`, `academic-writing`],
    whyItWorks: `An unconstrained feedback request produces a flat, undifferentiated list where a missing comma and a thesis that doesn't match the argument get roughly equal billing, because GPT-5.1 without a ranking instruction tends to surface issues in the order it notices them while reading, not in the order that matters for the grade — explicitly requiring a rubric-anchored, point-impact ranking forces the model to weigh severity against the actual grading weights rather than treating every observation as equally worth mentioning. Requiring the criterion-by-criterion pass to reference actual passages from {{essay_text}} rather than give an impressionistic summary keeps the assessment grounded and falsifiable — a vague "your evidence use is a bit thin" is not actionable, but pointing to the specific paragraph where a claim has no citation is. Explicitly checking whether the essay answers {{assignment_prompt}} as asked, as a distinct and prioritized first check, matters because this is the single highest-impact category of essay problem and the easiest for both a rushed student and a surface-reading model to miss — an essay that's well-written but argues a different question than the one assigned will lose points no amount of sentence-level polish recovers, and it needs to surface before line-level feedback, not buried inside a general comment. Weighting fixes by effort-to-impact given the actual time budget in {{time_available}} is what turns generic feedback into a usable revision plan under real constraints — the same feedback that's correct in the abstract is useless if it recommends restructuring three paragraphs when the student has ninety minutes, and asking the model to reason about realistic revision scope rather than idealized thoroughness is what keeps the top-3 list actually followable before the deadline.`,
    exampleOutput: `Thesis clarity: PARTIALLY MET — your intro thesis states inequality was 'the primary cause,' but paragraphs 3 and 4 spend more analytical depth on institutional breakdown (the Gracchi reforms, Senate gridlock) than on inequality itself, creating a mismatch a grader will notice. Priority fix #1 (highest impact, ~20 min): either revise the thesis to reflect that institutional breakdown gets the stronger argument in your body paragraphs, or add a paragraph of evidence that actually supports the inequality claim at the same depth...`,
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
    slug: 'students-research-question-narrowing-from-broad-topic',
    category: 'students',
    title: `Turn a broad topic idea into a research question that's actually answerable in the scope you have`,
    description: `Narrows a broad topic into a specific, arguable research question sized to your page count and available sources, flagging when the original topic is too broad or too narrow before you commit to it.`,
    promptText: `Help me turn a broad topic idea into an actual research question I can write a focused paper on — right now I just have a general area of interest, not a question.

BROAD TOPIC OR AREA OF INTEREST
{{broad_topic}}

ASSIGNMENT CONSTRAINTS
{{assignment_constraints}}

WHAT SOURCES I ALREADY HAVE ACCESS TO OR HAVE FOUND
{{available_sources}}

WHAT SPECIFICALLY DREW ME TO THIS TOPIC
{{personal_angle}}

First, tell me honestly whether {{broad_topic}} as stated is too broad, too narrow, or roughly the right scope for {{assignment_constraints}} — a topic that would need a full book to answer properly cannot become a good research question just by adding a question mark to it, and a topic already narrow enough for one paragraph of evidence has the opposite problem. Then propose three candidate research questions narrowed from the broad topic, each one arguable (has a real answer someone could reasonably disagree with, not a question with one obvious factual answer) and each sized differently — one that would work well at the shorter end of {{assignment_constraints}}, one in the middle, and one that would need the fuller scope. For each candidate question, name the one specific angle or lens it takes (a particular time period, population, mechanism, or comparison) that makes it answerable rather than another restatement of the broad topic. Check each candidate against {{available_sources}} and flag plainly if a candidate would require source types I don't currently have access to. Recommend which of the three best fits both {{assignment_constraints}} and {{personal_angle}}, and say why.

WHAT NOT TO DO
Do not propose a question that's really a yes/no factual question dressed up as analysis ("Did X happen?") — a research question needs room for an actual argument. Do not just rephrase {{broad_topic}} with "How does" tacked on the front.

OUTPUT FORMAT
1. Scope assessment of the original topic (too broad / too narrow / about right, and why).
2. Three candidate research questions, each with its specific angle and source-availability check.
3. Recommendation with reasoning.`,
    variables: [
      {
        name: 'broad_topic',
        description: `The general topic or area you're starting from.`,
        example: `The effects of social media on teenagers`,
        required: true,
      },
      {
        name: 'assignment_constraints',
        description: `Length, source requirements, and any scope constraints from the assignment.`,
        example: `8-10 pages, at least 5 peer-reviewed sources, for an intro psychology research methods course`,
        required: true,
      },
      {
        name: 'available_sources',
        description: `What sources you've already found or have easy access to.`,
        example: `University library database access to PsycINFO, found a few 2023-2024 studies on Instagram use and adolescent anxiety`,
        required: false,
      },
      {
        name: 'personal_angle',
        description: `What genuinely interests you about this topic, to keep the final question one you'll want to actually research.`,
        example: `I'm interested in whether the effect differs by platform type, since my little sister uses TikTok completely differently than Instagram`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`research-question`, `academic-writing`, `research-paper`, `topic-narrowing`, `research-methods`],
    whyItWorks: `Students given a broad topic and asked to "make it a research question" typically get back a question that's just the topic with "How does" or "What is the impact of" tacked onto the front, which is exactly what GPT-5.1 will produce without explicit pressure to actually narrow scope — the model's default move is light rephrasing rather than genuine decomposition into an answerable, arguable claim. Requiring an honest scope assessment before any candidate questions are proposed forces the model to actually reason about whether "social media's effects on teenagers" fits in 8-10 pages, which it plainly does not without narrowing by platform, outcome measure, or age band — and stating that mismatch explicitly, rather than silently producing a still-too-broad question, is what prevents a student from writing four pages of introduction just trying to bound an unbounded topic. Requiring three candidates at different scope sizes rather than one "best" answer gives the student a genuine choice calibrated to how much time and how many pages they actually have, since the right scope depends on constraints the model can't fully anticipate on its own. Naming the specific narrowing lens for each candidate (a particular platform, age range, or outcome) is what separates an actual research question from a restated topic — a question only becomes researchable once it specifies which mechanism or comparison it's isolating, and without being asked to name that lens explicitly, a model tends to produce questions that sound narrower than they actually are. Checking each candidate against sources the student has already found closes the gap between an interesting question and a writeable one — a beautifully scoped question that requires source types outside {{available_sources}} sets the student up to discover a research dead-end days before the deadline instead of now.`,
    exampleOutput: `Scope assessment: 'The effects of social media on teenagers' is too broad for 8-10 pages — it spans multiple platforms, age ranges, and outcome domains (mental health, academic performance, social skills), any one of which could fill a full paper alone. Candidate 1 (shorter scope): Does daily Instagram use duration correlate with self-reported anxiety symptoms in 13-15 year-olds, based on 2023-2024 studies? Candidate 2 (mid scope, fits your platform-comparison interest): How do anxiety outcomes associated with image-based platforms like Instagram differ from those associated with short-video platforms like TikTok among teenagers?...`,
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
    slug: 'students-study-notes-lecture-transcript-to-tested-material',
    category: 'students',
    title: `Turn a messy lecture transcript into study notes organized around what's actually likely to be tested`,
    description: `Converts a raw lecture transcript or your own scribbled notes into clean, hierarchical study notes, flagging which points the professor emphasized as likely test material versus tangents and asides.`,
    promptText: `Turn the lecture material below into clean study notes, organized to help me study for an exam — not just a cleaned-up transcript, but notes that surface what's actually likely to be tested.

RAW LECTURE MATERIAL (transcript, recording notes, or my own scribbles)
{{raw_material}}

COURSE AND TOPIC
{{course_topic}}

SIGNALS THE PROFESSOR GAVE ABOUT IMPORTANCE
{{emphasis_signals}}

First pass: extract the actual content structure from {{raw_material}} — the real hierarchy of main ideas and supporting points, not the chronological order the professor happened to say things in, since lectures often circle back to a point or introduce something out of order. Organize as nested headers and bullet points, main idea first with supporting details and examples underneath, not a flat wall of restated sentences.

Second pass: go back through and mark, inline, anything that lines up with {{emphasis_signals}} — a point the professor said was important, repeated, wrote on the board, or connected explicitly to the exam or assignment — with a distinct marker (e.g., a bracketed [LIKELY TESTED] tag) placed right at that bullet, not collected in a separate list disconnected from the actual content. Distinguish this from asides, jokes, personal anecdotes, or tangents that appeared in {{raw_material}} — either cut those entirely or compress them to a single line at most, since they take up space in the notes without being retrievable exam content.

Third pass: for any concept mentioned that seems to depend on something from an earlier class not included in {{raw_material}}, flag it with a note like "assumes prior material on X — check earlier notes" rather than either fabricating what that prior material said or silently leaving a gap.

WHAT NOT TO DO
Do not just summarize the lecture in prose paragraphs — that's not study notes, it's a summary, and it's harder to scan under time pressure. Do not invent content not present in {{raw_material}} to fill perceived gaps.

OUTPUT FORMAT
Nested header/bullet study notes with inline [LIKELY TESTED] tags and inline "assumes prior material" flags where relevant.`,
    variables: [
      {
        name: 'raw_material',
        description: `The actual lecture transcript, recording-based notes, or your own rough notes.`,
        example: `[Pasted 40-minute lecture transcript on cellular respiration, including some tangents about the professor's research lab]`,
        required: true,
      },
      {
        name: 'course_topic',
        description: `The course and the specific topic this lecture covered.`,
        example: `AP Biology, cellular respiration and the electron transport chain`,
        required: true,
      },
      {
        name: 'emphasis_signals',
        description: `Anything you noticed the professor did to signal importance.`,
        example: `She said 'this will definitely be on the test' twice, and spent an unusually long time on the chemiosmosis diagram compared to everything else`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`study-notes`, `note-taking`, `lecture-notes`, `exam-prep`, `study-organization`],
    whyItWorks: `A raw lecture transcript is organized by the order a professor happened to speak, which is rarely the same as the logical hierarchy of the material — professors circle back, digress, and answer questions out of sequence — so a naive "summarize this lecture" prompt tends to preserve that chronological messiness rather than restructure it, leaving the student with cleaner sentences but the same disorganized shape. Explicitly instructing a first pass focused on extracting the real content hierarchy, independent of speaking order, is what actually produces studyable notes rather than a tidied transcript, since exam prep depends on being able to scan main ideas and drill into supporting detail, not read linearly. Inline emphasis tagging tied to concrete signals — repetition, board work, or a direct statement of exam relevance — rather than a generic sense of "important-sounding," gives the tagging an actual evidentiary basis; without being anchored to {{emphasis_signals}}, GPT-5.1 tends to guess at importance based on which sentences sound authoritative in isolation, which frequently misses what a specific professor actually emphasized in the room and instead reflects generic textbook-style weighting. Placing those tags inline at the relevant bullet rather than collecting them into a separate "key points" list keeps the emphasis signal attached to its actual content, which matters because a detached importance list loses the supporting detail a student would need to actually explain that point on an exam. The instruction to flag rather than fabricate any content that depends on unincluded prior material directly guards against a known failure mode — a model asked to produce comprehensive-looking notes will readily invent a plausible-sounding gap-filler explanation of a prerequisite concept, and a student studying from notes containing confidently fabricated content has no way to distinguish it from what was actually said in the room.`,
    exampleOutput: `## Electron Transport Chain\\n- Located in inner mitochondrial membrane [LIKELY TESTED — repeated twice, extended board diagram]\\n  - Complexes I-IV pass electrons down an energy gradient\\n  - Creates H+ gradient across membrane (chemiosmosis) [LIKELY TESTED — professor said 'this will definitely be on the test']\\n    - assumes prior material on proton gradients from the intro membrane transport unit — check earlier notes\\n  - ATP synthase uses gradient to produce ATP\\n- (Lab research tangent about professor's own ETC research — omitted, not exam-relevant)`,
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
    slug: 'students-chapter-summary-argument-not-just-events',
    category: 'students',
    title: `Summarize a textbook chapter by its actual argument and evidence chain, not a scene-by-scene recap`,
    description: `Produces a chapter summary structured around the author's core claim and the evidence that supports it, distinguishing load-bearing content from illustrative examples so you retain the argument, not just a sequence of facts.`,
    promptText: `Summarize this chapter for me, but structure the summary around the actual argument the chapter is making, not a beginning-to-end recap of everything that happened in it.

CHAPTER TEXT OR DETAILED CONTENTS
{{chapter_text}}

SUBJECT AND COURSE
{{subject_course}}

WHAT I'M USING THIS SUMMARY FOR
{{purpose}}

First, identify the chapter's central claim or thesis in one or two sentences — what is this chapter actually arguing or trying to establish, not just what topic it covers. Then map out the evidence chain: the specific pieces of evidence, examples, or sub-arguments the chapter uses to build toward that central claim, in the logical order they support the argument (which may not be the order they appear in the text, if the chapter builds up to a claim before stating it outright). For each piece of evidence, note in one phrase why it's there — what specifically it's proving or illustrating — rather than just restating what it says. Explicitly separate load-bearing content (an example or piece of evidence the argument would actually fall apart without) from illustrative content (an example that helps understanding but that the argument doesn't structurally depend on) — mark each distinctly, since {{purpose}} probably means I need to prioritize the load-bearing content if I'm short on review time. If the chapter reaches a stated conclusion or implication distinct from its central claim, state that separately at the end.

WHAT NOT TO DO
Do not produce a paragraph-by-paragraph or section-by-section recap — that reproduces the chapter's structure rather than its argument, which isn't a summary, it's a shortened copy. Do not add outside information or context not present in {{chapter_text}}.

OUTPUT FORMAT
1. Central claim (1-2 sentences).
2. Evidence chain, each item marked [LOAD-BEARING] or [ILLUSTRATIVE], with a one-phrase note on what it's proving.
3. Stated conclusion/implication, if distinct from the central claim.`,
    variables: [
      {
        name: 'chapter_text',
        description: `The chapter's text, or a detailed rundown of its contents if you can't paste the full text.`,
        example: `[Pasted text of a history chapter arguing that railroad expansion, not gold discoveries alone, was the primary driver of westward US settlement patterns]`,
        required: true,
      },
      {
        name: 'subject_course',
        description: `The subject and course this chapter is from.`,
        example: `US History survey course, expansion and settlement unit`,
        required: true,
      },
      {
        name: 'purpose',
        description: `What you're actually using this summary for, to calibrate depth and priority.`,
        example: `Quick review the night before a midterm covering four chapters, not first-pass learning`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`chapter-summary`, `study-notes`, `reading-comprehension`, `exam-prep`, `textbook-review`],
    whyItWorks: `A generic "summarize this chapter" request produces a compressed version of the chapter's own structure — a shorter recap that hits the same points in the same order the text presented them — because that's the lowest-effort form of summarization and matches what GPT-5.1 defaults to without a specific instruction to restructure around argument rather than sequence; the problem is that a sequential recap preserves surface content while discarding the thing a student actually needs to retain, which is the logical chain connecting evidence to claim. Requiring the central claim to be stated first, separate from the summary itself, forces the model to commit to what the chapter is actually arguing before it's allowed to list supporting content, which prevents the common failure where a summary lists five interesting facts from the chapter without ever making clear what they were collectively building toward. Reordering the evidence chain by logical support rather than textual appearance order matters specifically for chapters (common in history, philosophy, and argument-driven science writing) that build up to a thesis rather than stating it in the first paragraph — a sequential summary of such a chapter reproduces the suspense structure of the original writing, which is exactly backward for study purposes, where the student needs the destination stated up front and the evidence organized as support for it. The load-bearing versus illustrative distinction directly serves the stated {{purpose}} — a student reviewing the night before an exam across four chapters needs to know which examples are structurally necessary to explain the argument if asked, versus which ones were included mainly to aid comprehension and can be skipped under time pressure; without this explicit split, all content in a summary reads as equally essential, which is precisely the information a time-constrained review needs but a flat summary doesn't provide.`,
    exampleOutput: `Central claim: The chapter argues that railroad expansion, more than gold rushes, was the primary structural driver of westward settlement patterns in the 1850s-1870s. Evidence chain: [LOAD-BEARING] Settlement density data showing towns clustering along rail lines rather than mining sites after 1869 — this is the chapter's core empirical support, the argument doesn't work without it. [ILLUSTRATIVE] The anecdote about a specific boomtown that emptied after its mine dried up but persisted because of a rail spur — helps make the pattern concrete but the argument doesn't structurally depend on this one case...`,
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
    slug: 'students-memory-technique-matched-to-content-type',
    category: 'students',
    title: `Get a memorization technique actually matched to what kind of information you're trying to retain`,
    description: `Diagnoses whether your material is a sequence, an unordered set, a mapping between pairs, or a process, then builds one memory technique fitted to that specific structure instead of defaulting to generic flashcards.`,
    promptText: `I need to memorize something for an exam and I want an actual memory technique suited to what this specific material is, not just "make flashcards" by default.

WHAT I NEED TO MEMORIZE
{{material}}

HOW IT WILL BE TESTED
{{test_format}}

HOW MUCH TIME I HAVE TO BUILD AND PRACTICE THE TECHNIQUE
{{time_available}}

First, classify {{material}} by its actual structure: is it an ordered sequence that must be recalled in order (steps of a process, chronological events), an unordered set of discrete facts with no inherent order, a set of paired associations (term-to-definition, cause-to-effect), or a hierarchical/nested structure (categories with sub-items)? State which one it is and why, since the right memory technique depends entirely on this and a mismatched technique wastes the practice time in {{time_available}}. Then build one specific memory technique fitted to that structure — for an ordered sequence, that likely means a method of loci or a linking/story method that encodes order; for paired associations, that likely means keyword/imagery mnemonics per pair; for a large unordered set, that likely means categorization/chunking into meaningful groups rather than one long list; for hierarchical material, that likely means building the technique around the hierarchy itself rather than flattening it into a list. Walk through the technique applied to the actual content in {{material}}, not a generic description of the method — show me the specific images, links, or chunks for this specific content. Account for {{test_format}} — if I'll be tested by recognition (multiple choice) the technique can lean lighter than if I need to produce the sequence or definitions from memory unprompted.

WHAT NOT TO DO
Do not default to "just make flashcards and use spaced repetition" as the answer regardless of content structure — that's a fine general study habit but it's not a technique fitted to this specific material, and the request is for the latter.

OUTPUT FORMAT
1. Content structure classification and why.
2. The specific technique chosen and why it fits that structure and {{test_format}}.
3. The technique fully worked through on the actual content in {{material}}.
4. A short practice check I can use to test if it's sticking.`,
    variables: [
      {
        name: 'material',
        description: `The actual content you need to memorize.`,
        example: `The order of the 8 steps of glycolysis and the enzyme that catalyzes each one`,
        required: true,
      },
      {
        name: 'test_format',
        description: `How you'll actually be tested on this.`,
        example: `Fill-in-the-blank diagram where I have to write each enzyme name from memory, no word bank`,
        required: true,
      },
      {
        name: 'time_available',
        description: `How much time you have to build and rehearse the technique before the exam.`,
        example: `About 3 days, roughly 30 minutes a day`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`memory-technique`, `mnemonics`, `study-skills`, `exam-prep`, `active-recall`],
    whyItWorks: `The default AI response to any memorization request, regardless of what's actually being memorized, tends to be "make flashcards and use spaced repetition" — which is genuinely good general advice but is content-agnostic and misses that different information structures have well-established, structurally-matched techniques that dramatically outperform generic flashcards for that specific structure; an ordered sequence like the steps of glycolysis is a textbook case for a method-of-loci or linking mnemonic that encodes the order itself, something flashcards don't do at all, since flashcards test each fact in isolation without reinforcing sequence. Forcing an explicit classification step before recommending any technique is what prevents the model from defaulting to its generic answer — stating which of the four structural categories the material falls into, and requiring a justification, means the recommendation has to actually follow from the content's shape rather than being a one-size-fits-all suggestion. Requiring the technique to be worked through on the actual content in {{material}}, rather than described abstractly ("use vivid imagery to link each item"), is what makes this usable rather than theoretical — a student told to "use the method of loci" in the abstract still has to do all the hard creative work of actually applying it, whereas walking through specific images tied to specific enzyme names does that generative work for them, which is the actual value of asking an AI for this rather than reading a general study-skills article. Accounting for {{test_format}} matters because a recognition-based test (multiple choice) tolerates a much lighter memory technique than free recall does — building an elaborate mnemonic system for content that will only ever be recognized, not produced from scratch, is more effort than the task warrants, and the reverse mismatch (light review for a fill-in-blank test with no word bank) leaves the student underprepared for what retrieval will actually demand.`,
    exampleOutput: `Classification: ordered sequence — glycolysis's 8 steps must be recalled in exact order with the matching enzyme for a fill-in-blank diagram, so this needs a technique that encodes sequence, not just facts. Technique: method of loci through your bedroom, one location per step... Step 1 (Hexokinase phosphorylates glucose) = your bedroom door, glowing and being 'locked' shut by a giant key (hexokinase = 'hex' key)...`,
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
    slug: 'students-learning-roadmap-self-taught-skill-with-checkpoints',
    category: 'students',
    title: `Build a self-taught learning roadmap with real checkpoints, not just a list of topics to eventually cover`,
    description: `Sequences a self-directed learning goal into stages with a concrete, testable checkpoint at the end of each one, so you know objectively whether you're ready to move on instead of guessing.`,
    promptText: `I want to learn {{skill_or_subject}} on my own and I need an actual roadmap — sequenced stages with a real checkpoint at the end of each one that tells me objectively whether I'm ready to move to the next stage, not just a list of topics to work through in order.

SKILL OR SUBJECT
{{skill_or_subject}}

MY CURRENT STARTING POINT
{{current_level}}

WHY I'M LEARNING THIS / END GOAL
{{end_goal}}

TIME I CAN REALISTICALLY COMMIT
{{time_commitment}}

Break the path from {{current_level}} to {{end_goal}} into stages, where each stage is defined by what you'll be able to DO by the end of it, not just what topic you'll have "covered." For each stage, name the specific prerequisite skill from the previous stage it depends on, so the sequencing has an actual logical reason rather than an arbitrary conventional order. For each stage, give one concrete checkpoint — something you build, solve, or produce that has a clear pass/fail or graded quality, not "feel comfortable with X" — that tells you objectively whether to move on or whether you need more time in that stage. Be honest about a realistic time estimate per stage given {{time_commitment}}, and flag if {{end_goal}} within the time implied is unrealistic given a typical learning pace, rather than producing an falsely encouraging timeline. Name the single most common point where self-taught learners in this area quit or plateau, and what to do differently at that specific point.

WHAT NOT TO DO
Do not just list resources (course names, book titles) as the plan — a roadmap is the sequence and checkpoints, resources are secondary and optional to include. Do not make every checkpoint a quiz or reading comprehension check; prioritize checkpoints that require actually doing the skill.

OUTPUT FORMAT
1. Stages, each with: what you'll be able to do, prerequisite from prior stage, concrete checkpoint, realistic time estimate.
2. Honest assessment of whether {{end_goal}} fits {{time_commitment}}.
3. The common quit/plateau point and what to do differently there.`,
    variables: [
      {
        name: 'skill_or_subject',
        description: `What you're trying to learn.`,
        example: `Web development, specifically building a full working web app from scratch`,
        required: true,
      },
      {
        name: 'current_level',
        description: `What you actually know now, honestly.`,
        example: `I know basic HTML/CSS from a weekend tutorial, no JavaScript, no backend experience at all`,
        required: true,
      },
      {
        name: 'end_goal',
        description: `What you actually want to be able to do, and why.`,
        example: `Build and deploy a simple app with user accounts and a database, to launch a small side project idea`,
        required: true,
      },
      {
        name: 'time_commitment',
        description: `Realistic hours per week you can commit, and over what total timeframe.`,
        example: `About 6 hours a week, want to be there in 4 months`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`learning-roadmap`, `self-directed-learning`, `skill-building`, `web-development`, `study-plan`],
    whyItWorks: `A generic "learning roadmap" prompt tends to produce a topic list ordered by conventional curriculum sequence (HTML, then CSS, then JavaScript, then a framework) without any mechanism for the learner to know whether they've actually reached proficiency at any stage, which is why so many self-taught learners either move on prematurely with gaps that compound later, or stall indefinitely on one stage with no objective signal that they're ready to progress. Requiring each stage to be defined by a doable capability rather than a covered topic, paired with a concrete checkpoint with a real pass/fail signal, is what turns a reading list into an actual roadmap — "build a webpage that fetches and displays data from a public API" is a checkpoint you either did or didn't complete, while "understand APIs" is a feeling with no objective resolution, and GPT-5.1 defaults to the latter kind of vague milestone unless explicitly told to make each one a concrete producible artifact. Naming the specific prerequisite dependency between consecutive stages forces genuine sequencing logic rather than an arbitrary conventional order — this matters because self-taught paths frequently waste time front-loading topics in the order textbooks present them rather than the order actual dependency requires, and a model asked to justify sequencing has to reason about what a later stage genuinely requires rather than default to convention. Requiring an honest time-realism check against {{end_goal}} and {{time_commitment}} counters a real tendency for AI-generated plans to be uniformly encouraging regardless of whether the timeline is plausible, which sets learners up for a demoralizing gap between the promised timeline and actual progress. Naming the common quit/plateau point for this specific skill area, rather than generic encouragement about persistence, gives the learner something concrete to watch for and a specific counter-strategy, which is far more actionable than being told to "stay motivated."`,
    exampleOutput: `Stage 2: Interactive front-end with JavaScript. What you'll be able to do: build a page where user actions (clicks, form input) change what's displayed without reloading the page. Prerequisite from Stage 1: comfortable writing and structuring HTML/CSS without a tutorial open. Checkpoint: build a working to-do list app (add, check off, delete items) with no framework, from a blank file. Realistic time estimate: 3-4 weeks at 6 hrs/week. Common quit point: this is where many self-taught learners hit their first real debugging wall (undefined is not a function-type errors) and conclude they're 'not cut out for programming' — the fix isn't more tutorials, it's deliberately practicing reading error messages and using console.log to inspect state rather than guessing at fixes...`,
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
    slug: 'students-coding-tutor-debug-your-own-broken-code',
    category: 'students',
    title: `Debug your own broken code with a tutor that makes you find the bug instead of just fixing it for you`,
    description: `Guides you to locate and understand a bug in your own code through targeted questions about what you expected versus what happened, only showing the actual fix after you've identified the cause yourself.`,
    promptText: `I have a bug in my code and I want to actually learn to debug, not just get the fix. Act as a coding tutor who helps me find the bug myself rather than fixing it for me.

MY CODE
{{code}}

WHAT I EXPECTED TO HAPPEN
{{expected_behavior}}

WHAT ACTUALLY HAPPENS
{{actual_behavior}}

LANGUAGE/CONTEXT
{{language_context}}

Do not point out the bug directly or rewrite the code, even if I ask you to just fix it — if I ask for the fix outright, briefly say why finding it yourself will help more, then continue with the next question instead. Start by asking me to trace through my own code step by step for the specific input where {{actual_behavior}} occurs, predicting out loud what each line does — this surfaces the gap between what I think the code does and what it actually does. Based on {{expected_behavior}} versus {{actual_behavior}}, narrow toward the likely region of the bug (e.g., "before we go further, what does this specific variable look like right after this specific line runs — is that what you'd expect?") but phrase it as a question I answer, not a statement you make. If I trace through and correctly identify the actual bug myself, confirm it and then ask me what the fix should be, rather than immediately telling me. If after two rounds of guided questions I'm still genuinely stuck, narrow the region further with a more specific question, but do not name the exact bug or line until I've had a real chance to find it through the narrowed question.

WHAT NOT TO DO
Do not run or execute the code and just report the output — the point is for me to build a mental model of execution, not receive one. Do not ask more than one question per response; layering multiple questions makes it unclear what to actually respond to.

OUTPUT FORMAT
One guiding question at a time, narrowing progressively. No code fixes until I've identified the cause.`,
    variables: [
      {
        name: 'code',
        description: `The actual code with the bug.`,
        example: `def find_max(numbers):\\n    max_val = 0\\n    for n in numbers:\\n        if n > max_val:\\n            max_val = n\\n    return max_val`,
        required: true,
      },
      {
        name: 'expected_behavior',
        description: `What you expected the code to do.`,
        example: `Return the largest number in the list, including when all numbers are negative`,
        required: true,
      },
      {
        name: 'actual_behavior',
        description: `What actually happens when you run it.`,
        example: `find_max([-5, -2, -8]) returns 0 instead of -2`,
        required: true,
      },
      {
        name: 'language_context',
        description: `Programming language and any relevant course/assignment context.`,
        example: `Python, intro CS course, second week covering functions and loops`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`coding-tutor`, `debugging`, `learn-to-code`, `python`, `computer-science`],
    whyItWorks: `GPT-5.1's default response to a bug report with code attached is to identify the bug and produce a corrected version immediately, since that's the most directly useful-looking output and matches the model's general helpfulness bias — but a student who receives a fixed version of their own code without doing the diagnostic work themselves doesn't build the debugging skill that will actually matter on the next bug, which won't come with a tutor attached. Forcing a step-by-step trace of the student's own code against the specific failing input, before any hint about where the bug lives, mirrors the actual skill professional developers use (mentally or literally stepping through execution) and surfaces the gap between the student's assumed behavior and actual behavior directly through their own reasoning rather than through being told — in the example, a student tracing max_val = 0 against an all-negative input list will themselves notice that 0 is larger than every number in the list, which is a far stickier realization than being told "you initialized max_val wrong." The rule against naming the bug even under direct pressure to just fix it is necessary because students under time pressure predictably ask for the answer, and without an explicit instruction to resist that ask while still being brief about why, the interaction collapses into a debugging service on the first frustrated request. Narrowing progressively through questions rather than one broad question addresses the reality that a totally open-ended "what do you think is wrong?" is often too unconstrained for a genuinely stuck beginner — each question needs to shrink the search space based on the previous answer, the same way a human tutor would follow up on what the student just said rather than repeating the same broad prompt. Limiting to one question per turn prevents the common failure where a multi-part question lets a student answer the easy part and skip the part that would have actually revealed the bug.`,
    exampleOutput: `Let's trace find_max([-5, -2, -8]) line by line. Before the loop starts, what value does max_val hold? Now, on the very first iteration, n is -5 — based on the code's condition (if n > max_val), does -5 > max_val evaluate to True or False given what max_val currently is?`,
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
    slug: 'students-math-solver-show-work-and-flag-the-decision-point',
    category: 'students',
    title: `Get a math problem solved with the actual decision points flagged, not just a clean final derivation`,
    description: `Solves a math problem step by step but explicitly flags each point where a method or approach had to be chosen among alternatives, so you learn the decision-making, not just a derivation that looks obvious in hindsight.`,
    promptText: `Solve this problem step by step, but I need you to explicitly flag every point where you had to choose a method or approach among real alternatives — not just show a clean derivation that makes the solution look more obvious than it actually was to arrive at.

PROBLEM
{{problem}}

WHAT METHODS WE'VE COVERED SO FAR IN CLASS
{{covered_methods}}

WHAT I'M SUPPOSED TO PRACTICE FOR
{{practice_goal}}

Solve the problem using only methods from {{covered_methods}} — if the most elegant solution uses something we haven't covered, use the approach we have covered instead, even if it's longer, since the point is practicing what I'm actually responsible for. At every step where there was a genuine choice of approach (which algebraic manipulation to try first, whether to substitute or use a formula directly, which case to check first in a multi-case problem), stop and state explicitly: what the choice point was, what the alternatives were, and why you picked the one you did over the others — not just proceeding as if there were only ever one obvious next move. Where a step is just mechanical execution of an already-chosen approach (arithmetic, simplifying an expression) with no real decision involved, don't flag it — only genuine decision points, so the flags stay meaningful rather than becoming noise on every line. After the full solution, add a short section naming the one decision point in this problem most likely to trip someone up on a similar problem under exam conditions, and what signal in the problem should have pointed toward the right choice.

WHAT NOT TO DO
Do not use a method outside {{covered_methods}} even if it's shorter. Do not flag purely mechanical steps as decision points — that dilutes the signal on what's genuinely worth learning to recognize.

OUTPUT FORMAT
1. Step-by-step solution with inline [DECISION POINT] flags only at genuine choice points, each with the alternatives considered and why this one was chosen.
2. Final answer.
3. The single most exam-relevant decision point in this problem and the signal that should cue the right choice.`,
    variables: [
      {
        name: 'problem',
        description: `The exact math problem to solve.`,
        example: `Solve the system: x^2 + y^2 = 25 and y = x + 1`,
        required: true,
      },
      {
        name: 'covered_methods',
        description: `The specific methods and techniques covered in class so far, to bound which approach is used.`,
        example: `Substitution method for systems, factoring quadratics, the quadratic formula — haven't covered matrix methods yet`,
        required: true,
      },
      {
        name: 'practice_goal',
        description: `What you're actually trying to get better at with this problem.`,
        example: `Recognizing when to substitute versus when to try factoring first on nonlinear systems, since I keep picking the slower path on the actual quiz`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`math-solver`, `step-by-step-solutions`, `problem-solving`, `algebra`, `test-prep`],
    whyItWorks: `A default "solve this step by step" request produces a clean forward derivation that reads as though each step was the only reasonable next move, which is precisely the opposite of what a struggling student needs to see — real problem-solving involves genuine decision points (which variable to substitute, which case to check first) that experienced solvers pick quickly because of pattern recognition built over many problems, and a clean derivation hides exactly the judgment call a student is actually trying to learn to make. Explicitly requiring the alternatives at each real choice point, and the reason one was picked over the others, surfaces the tacit expertise that a standard worked solution erases — a student practicing to recognize when to substitute versus factor first (the stated {{practice_goal}}) learns nothing from seeing only the winning path; they need to see what else was on the table and why it lost. Restricting flags to genuine decision points and explicitly excluding mechanical execution steps keeps the signal meaningful — GPT-5.1, if not told to distinguish these, tends toward over-explaining every line uniformly, which buries the two or three moments that actually matter for learning under a wall of commentary on routine arithmetic. Constraining the solution to only {{covered_methods}}, even when a shorter method exists outside that set, matters pedagogically because a technically valid but uncovered method is invisible knowledge to the student on an actual exam — a solution using matrix methods when the student has only learned substitution doesn't help them practice what they'll actually be tested on, it just demonstrates that the AI knows more math than the course has covered, which is irrelevant to the practice goal. The final flagged "most exam-relevant decision point" section translates the specific problem into a transferable pattern-recognition cue, which is the actual skill exam performance depends on — students who can execute algebra fine but consistently pick the slower approach under time pressure are failing at pattern recognition, not mechanics, and that's precisely what generic step-by-step solvers never address.`,
    exampleOutput: `[DECISION POINT] We have two equations: one is a circle (x^2+y^2=25), one is linear (y=x+1). Alternatives: substitute the linear equation into the circle equation, or try to manipulate both into a common form. Chosen: substitution, because one equation is already solved for y — this is the fastest path whenever one equation of a nonlinear system is already isolated for a variable, which is the signal to look for before trying anything else. Substituting: x^2 + (x+1)^2 = 25...`,
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
    slug: 'students-lab-report-experiment-writeup-assistant',
    category: 'students',
    title: `Turn raw lab notebook data into a lab report that survives your instructor's error-analysis check`,
    description: `Converts messy handwritten-style lab notes — hypothesis, method, raw numbers, what went wrong — into a properly structured lab report with a real error-analysis section, instead of a polished-sounding writeup that quietly skips the messy parts.`,
    promptText: `You are helping me write up a science lab report from my raw notes for a class I'm currently taking. Do not invent any data, readings, or outcomes I haven't given you — if something is missing, ask me for it or mark it as [NEEDS DATA] rather than filling in a plausible-sounding number.

EXPERIMENT
{{experiment_description}}

HYPOTHESIS I WROTE BEFORE STARTING
{{original_hypothesis}}

RAW DATA / OBSERVATIONS
{{raw_data}}

WHAT WENT WRONG OR LOOKED OFF DURING THE RUN
{{anomalies}}

REQUIRED REPORT SECTIONS
{{required_sections}}

RULES
Write the Results section reporting exactly the numbers I gave you, not rounded or smoothed to look cleaner than they are. Write the Discussion section so it explicitly addresses the anomalies I listed rather than writing around them as if the run went perfectly — an instructor grading error analysis is specifically checking whether I noticed and explained the messy parts, so a report that reads too clean is a worse grade, not a better one. If my original hypothesis doesn't match what the data actually showed, say so directly in the Discussion instead of quietly rewriting the hypothesis to fit the results after the fact. Where a required section needs a citation or a known physical constant, tell me to verify the exact value rather than stating one as fact, since I need the real source value, not an approximation.

WHAT NOT TO DO
Do not add a generic "sources of error could include human error and equipment limitations" line — every error-analysis point must trace back to something I actually reported. Do not editorialize about how well or poorly the experiment went; describe what happened and let the data argument speak.

OUTPUT FORMAT
The full report broken into the required sections as headers, each with the actual content filled in. End with a short list (2-4 lines) flagging anything I need to double-check or supply before submitting — a real constant to verify, a measurement that seems like it might be a typo, or a section I gave too little detail on.`,
    variables: [
      {
        name: 'experiment_description',
        description: `What the experiment was and what class it's for.`,
        example: `Determining the specific heat capacity of an unknown metal sample using calorimetry, for AP Chemistry.`,
        required: true,
      },
      {
        name: 'original_hypothesis',
        description: `The hypothesis you wrote before running the experiment.`,
        example: `I predicted the metal was aluminum based on its density, so specific heat should come out close to 0.90 J/g°C.`,
        required: true,
      },
      {
        name: 'raw_data',
        description: `The actual numbers and observations you recorded, unedited.`,
        example: `Metal mass 24.3g, initial temp 98.6°C, water mass 100.1g, water initial temp 21.4°C, final equilibrium temp 24.8°C. Calculated specific heat: 0.61 J/g°C.`,
        required: true,
      },
      {
        name: 'anomalies',
        description: `Anything that looked wrong, was rushed, or didn't go as planned during the run.`,
        example: `The metal sample sat out of the boiling water for about 8 seconds before we could drop it in the calorimeter, and the thermometer read jumped oddly right at the start.`,
        required: true,
      },
      {
        name: 'required_sections',
        description: `The exact section headers your instructor requires.`,
        example: `Purpose, Hypothesis, Materials & Procedure, Data & Results, Error Analysis, Discussion, Conclusion.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`lab-report`, `science-writing`, `error-analysis`, `homework-help`, `chemistry`, `data-reporting`],
    whyItWorks: `GPT-5.1, left unconstrained, defaults toward a narratively satisfying writeup — it will smooth over a hypothesis that didn't pan out and generate a generic "human error, equipment limitations" error-analysis line because that phrasing appears constantly in training data as the template answer, not because it engaged with your specific run. Explicitly instructing it to flag missing data with a literal marker like [NEEDS DATA] rather than interpolating a plausible number matters because a specific-heat calculation, a titration endpoint, or a yield percentage is exactly the kind of number a language model can generate that looks internally consistent but is fabricated — and an instructor checking a lab report against a data sheet will catch a fabricated number immediately, which is a worse outcome than an honest gap. Forcing the Discussion section to reconcile the stated hypothesis against the actual data addresses a specific model tendency: without that instruction, GPT-5.1 tends to retroactively soften a wrong hypothesis into something that sounds like it was closer to right than it was, which undermines the entire pedagogical point of an error-analysis section — that section exists specifically to reward you for noticing when the prediction and the result diverged and explaining why, not for hiding the divergence. The explicit "what not to do" ban on generic error-source language forces the model to trace each claimed error back to something concretely listed in the anomalies field, which is the difference between a report that reads as authored by someone who was in the room for the experiment versus one that reads as templated filler bolted onto real numbers.`,
    exampleOutput: `Error Analysis: The calculated specific heat (0.61 J/g°C) is notably lower than the value predicted for aluminum (0.90 J/g°C), which is inconsistent with the original hypothesis. The 8-second delay in transferring the heated metal sample into the calorimeter likely allowed measurable heat loss to the air before data collection began, which would lower the apparent heat released and thus lower the calculated specific heat. The anomalous early thermometer reading suggests possible incomplete water-metal thermal equilibration at the start of timing, which should be verified against the raw temperature-time log if available.`,
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
    slug: 'students-language-grammar-drill-set-builder',
    category: 'students',
    title: `Build a grammar drill set targeted at the one mistake you keep actually making`,
    description: `Generates a focused set of practice sentences for one specific grammar point you're struggling with in a language you're learning, sized to your real level instead of a generic textbook chapter's worth of exercises.`,
    promptText: `Build me a targeted practice set for one specific grammar point in {{target_language}} that I keep getting wrong, not a general review of the whole topic area.

MY LEVEL
{{proficiency_level}}

THE SPECIFIC GRAMMAR POINT
{{grammar_point}}

EXAMPLES OF MY ACTUAL MISTAKES
{{my_mistakes}}

HOW MANY ITEMS AND IN WHAT MIX
{{set_size_and_mix}}

Build the set in three parts. First, a one-paragraph explanation of the rule stated in terms of the specific mistake pattern I showed you — not the textbook definition, but why my exact error happens and what distinguishes the correct form from what I keep writing. Second, the practice items themselves: a mix of fill-in-the-blank, sentence correction (where you give me a sentence with the mistake already in it and I have to fix it), and translation-direction items, matching the mix I specified. Make each item test the actual distinction I'm confusing, not a broader area of the grammar point I already have right — if my mistakes show I've confused two specific forms, every item should force a choice between exactly those two, not drift into testing the grammar point's other, unrelated edge cases. Third, an answer key with a one-line reason per answer that references the same distinction from your explanation, so a wrong answer sends me back to the same explanation rather than a new one.

If my example mistakes actually show two different underlying confusions rather than one, tell me that directly and ask which one to build the set around, rather than building one set that tries to cover both and ends up testing neither well.

Deliver the set as: (1) the explanation paragraph, (2) numbered practice items grouped by type, (3) the answer key.`,
    variables: [
      {
        name: 'target_language',
        description: `The language you're learning.`,
        example: `Spanish`,
        required: true,
      },
      {
        name: 'proficiency_level',
        description: `Your rough level, so item difficulty and vocabulary match what you can actually handle.`,
        example: `Second-year high school Spanish, comfortable with present tense, shaky on past tenses.`,
        required: true,
      },
      {
        name: 'grammar_point',
        description: `The specific grammar area, named as precisely as you can.`,
        example: `Choosing between preterite and imperfect past tense.`,
        required: true,
      },
      {
        name: 'my_mistakes',
        description: `Real sentences you got wrong, ideally from a graded quiz or homework.`,
        example: `I wrote 'Cuando era niño, fui a la playa todos los veranos' when it should have been 'iba' — I keep using preterite for repeated past actions.`,
        required: true,
      },
      {
        name: 'set_size_and_mix',
        description: `How many items you want and the split across exercise types.`,
        example: `12 items total: 5 fill-in-the-blank, 4 sentence correction, 3 translation.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`language-learning`, `grammar-practice`, `spanish`, `study-drill`, `second-language-acquisition`],
    whyItWorks: `A prompt that just says "give me practice with preterite vs imperfect" gets GPT-5.1 to generate a broad, textbook-shaped set that samples across the whole grammar topic evenly, because without a stated error pattern the model has no signal for which sub-distinction actually matters to you and defaults to comprehensive coverage as the safest-seeming answer. Feeding it your actual wrong sentences changes the task from "teach this grammar point" to "resolve this specific confusion," which is a narrower and more useful target — the model can identify that your error is specifically about habitual/repeated past actions being marked with preterite instead of imperfect, and then construct every item to force exactly that choice, which drills the actual gap far faster than a set that also tests preterite-vs-imperfect distinctions you already have right. Asking the model to check whether your mistakes reveal one confusion or two matters because self-diagnosed grammar mistakes often bundle multiple issues that look similar on the surface (e.g., aspect confusion versus irregular-verb-conjugation errors) but need different drill types to fix; a model that silently picks one interpretation and builds a sanitized single-purpose set may drill the wrong thing entirely, while surfacing the ambiguity lets you correct it before generating twelve items that don't address your real problem. Tying each answer-key explanation back to the same opening rule, rather than a fresh ad hoc justification per item, keeps the whole set coherent as one lesson instead of twelve disconnected trivia facts, which is what actually gets a distinction to stick after repeated exposure.`,
    exampleOutput: `3. Fill in the blank: De niña, mi abuela ______ (ir) a la iglesia todos los domingos.
Answer: iba — repeated/habitual past action ('every Sunday') takes imperfect, not preterite, matching the same pattern from your 'fui a la playa todos los veranos' mistake.`,
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
    slug: 'students-vocabulary-list-from-text-with-spaced-repetition',
    category: 'students',
    title: `Pull a real study vocabulary list out of an assigned reading, sized for spaced repetition, not a glossary dump`,
    description: `Extracts only the words from an assigned text that are actually worth memorizing, with example sentences and a spaced-repetition-friendly format, instead of every unfamiliar-looking word in the passage.`,
    promptText: `Pull a vocabulary study list from the text below, but only the words actually worth memorizing for {{purpose}} — not every word that merely looks advanced.

SOURCE TEXT
{{source_text}}

WHY I'M STUDYING THIS
{{purpose}}

WORDS I ALREADY KNOW (skip these even if they appear)
{{known_words}}

TARGET LIST SIZE
{{target_count}}

Selection rule: include a word only if it's likely to recur in this subject area beyond this one text, or if not knowing it would block understanding a sentence in the passage — skip proper nouns, one-off technical terms unique to this exact passage, and words you judge I likely already know from context even if they weren't in my known-words list. For each selected word, give: the word as it appears in the text, a definition in plain language (not a dictionary-copy definition), the exact sentence from the source text it appeared in, and one new example sentence in a different context so I'm not just memorizing the original sentence shape. Format each entry as a front/back flashcard pair — front is the word alone, back is definition plus both example sentences — so this can be dropped directly into a spaced-repetition app without reformatting.

If the text is short enough that meeting the target count would force you to include marginal words just to hit the number, tell me the real count you'd recommend instead and explain briefly why, rather than padding the list to match what I asked for.

Output as a numbered flashcard list in the front/back format described, followed by one line noting any words you deliberately excluded that I might expect to see (like a word that looked hard but you judged as already-known from context).`,
    variables: [
      {
        name: 'source_text',
        description: `The assigned passage or excerpt to pull vocabulary from.`,
        example: `Chapter 3 of 'The Great Gatsby' (paste or describe the excerpt), roughly 1,200 words covering Nick's first visit to Gatsby's party.`,
        required: true,
      },
      {
        name: 'purpose',
        description: `What you're studying this for, since that changes which words matter.`,
        example: `AP English Literature exam prep — need vocabulary that shows up across period-appropriate texts, not just this novel.`,
        required: true,
      },
      {
        name: 'known_words',
        description: `Words you already know so they don't clutter the list even if they appear in the text.`,
        example: `affluence, gaudy, wistful`,
        required: false,
      },
      {
        name: 'target_count',
        description: `Roughly how many vocabulary words you want.`,
        example: `15`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`vocabulary`, `spaced-repetition`, `flashcards`, `reading-study`, `language-arts`, `exam-prep`],
    whyItWorks: `Asked to "pull vocabulary" from a text with no selection rule, GPT-5.1 tends to over-include: it flags every word above a certain register as noteworthy, which produces a list dominated by words you'll recognize by context and never see again versus the smaller set of words that actually recur across a subject area or genuinely block comprehension — the selection rule here gives the model an actual filter (recurs beyond this text, or blocks understanding) instead of a vague "advanced-sounding" threshold, which is the difference between a 40-word glossary dump and a 15-word list worth memorizing. Requiring a second, freshly generated example sentence in addition to the original source sentence directly targets a known weakness of rote vocabulary study: if you only ever see a word in the one sentence it was drilled from, recall becomes tied to that sentence's shape rather than the word's actual meaning, so a slightly reworded appearance on a real exam can fail to trigger recognition — a second context sentence forces the definition itself to do the work. Instructing the model to say when hitting your target count would force marginal inclusions matters because a target count is a proxy for "a useful amount," not a hard requirement, and a model that silently pads a 9-word natural list up to a requested 15 by including words you didn't need is optimizing for matching the number you asked for rather than the actual goal the number was standing in for.`,
    exampleOutput: `7. Front: languid
Back: Moving or done in a slow, relaxed, low-energy way. Source: "She was languid in her chair, as if the heat had settled into her bones." New: The dog stretched into a languid pose on the porch, unbothered by the afternoon sun.`,
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
    slug: 'students-reading-passage-comprehension-question-generator',
    category: 'students',
    title: `Generate comprehension questions that actually test different levels of understanding, not ten variations on 'what happened'`,
    description: `Builds a set of reading comprehension questions across distinct cognitive levels — literal recall, inference, and evaluation — from a specific passage, so self-testing catches the gap between remembering a passage and actually understanding it.`,
    promptText: `Generate reading comprehension questions from the passage below, spread across genuinely different levels of understanding rather than ten questions that all just test recall of what happened.

PASSAGE
{{passage_text}}

WHAT THIS IS FOR
{{study_context}}

QUESTION LEVELS AND HOW MANY OF EACH
{{level_distribution}}

Build questions at three distinct levels, matching the counts I specified: (1) literal — answerable by pointing to one specific sentence or detail in the passage; (2) inferential — requires connecting two or more parts of the passage that aren't stated together, or reading between the lines of something implied but not said outright; (3) evaluative — requires a judgment about the passage itself, like identifying an author's assumption, a weakness in an argument, or what evidence would change the conclusion. Label each question with its level so I know what kind of thinking it's testing. For every question, write an answer key entry that doesn't just give the answer but names exactly where in the passage it comes from (a quote or paraphrase) so I can check my reasoning, not just my final answer. For inferential and evaluative questions specifically, the answer key must explain the reasoning chain, not just assert the conclusion — if a question requires connecting two facts, name both facts and how they connect.

Do not write an evaluative question that actually only requires locating information (a common failure mode where a question is labeled "analyze" but is answerable straight from the text) — if you can't construct a genuine evaluative question from this passage, say so and tell me why rather than mislabeling a recall question to hit the count.

Output as three labeled sections (Literal, Inferential, Evaluative), each with numbered questions, followed by a separate answer key section in the same order.`,
    variables: [
      {
        name: 'passage_text',
        description: `The reading passage to build questions from.`,
        example: `A 600-word excerpt from a science journalism article on why octopuses are considered unusually intelligent despite short lifespans.`,
        required: true,
      },
      {
        name: 'study_context',
        description: `What you're preparing for, since that shapes question style.`,
        example: `Practicing for a standardized reading comprehension section that mixes detail, inference, and author's-purpose questions.`,
        required: true,
      },
      {
        name: 'level_distribution',
        description: `How many questions at each cognitive level.`,
        example: `3 literal, 4 inferential, 2 evaluative.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`reading-comprehension`, `study-questions`, `test-prep`, `critical-thinking`, `bloom-taxonomy`],
    whyItWorks: `Without an explicit level distinction, GPT-5.1's default question-generation behavior clusters heavily around literal recall, because recall questions are the easiest to generate reliably correct answer keys for and the model has no signal that you want the harder, more ambiguous inferential and evaluative categories represented — naming the three levels and forcing a labeled split makes the model allocate effort to the categories it would otherwise under-produce. The explicit ban on mislabeling a recall question as "evaluative" targets a specific and common failure mode in AI-generated study questions: a question that sounds analytical ("analyze why the author chose this structure") but is actually answerable by finding one sentence that states the reason directly is a fake-inference question, and self-testing against it teaches false confidence because getting it right doesn't confirm you can actually make inferences, only that you can locate text. Requiring the answer key to show the reasoning chain rather than just the final answer is what makes this usable for self-study specifically: a bare answer key lets you confirm you got a question right or wrong but not why, whereas naming both facts an inferential question connects and how they connect lets you diagnose whether a wrong answer came from missing a detail versus failing to connect two details you did notice — those are different remediation paths, and collapsing them into one letter grade of correct/incorrect wastes the diagnostic value the exercise could have had.`,
    exampleOutput: `Inferential Q2: Why might the article's structure devote more space to octopus cognition than to their lifespan, despite opening with the lifespan paradox?
Answer: The article states octopuses live only 1-2 years (paragraph 1) and separately details extensive problem-solving research (paragraphs 3-5); connecting these suggests the author frames the short lifespan as the surprising contrast that motivates deeper explanation of the cognition research, using structure to build toward the paradox's resolution rather than treating both facts as equally weighted.`,
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
    slug: 'students-class-presentation-outline-speaker-notes',
    category: 'students',
    title: `Build a class presentation outline that actually fits your time slot, with speaker notes you won't just read off the slide`,
    description: `Turns your topic and research notes into a slide-by-slide outline with a real time budget per section and speaker notes written to be spoken, not slide text repeated out loud.`,
    promptText: `Build me a presentation outline for a class assignment, budgeted to my actual time limit, with speaker notes that add to the slides instead of repeating them.

ASSIGNMENT
{{assignment_topic}}

TIME LIMIT
{{time_limit}}

MY RESEARCH / KEY POINTS SO FAR
{{research_notes}}

WHAT I HAVE TO INCLUDE (grading requirements)
{{grading_requirements}}

Build the outline slide by slide, and assign each slide a specific time budget in seconds or minutes that sums to my total time limit, not a generic "intro/body/conclusion" split — front-load the requirements from the grading criteria into the slides where they'll get the most visible weight, since a grader skimming for specific criteria should be able to find them without hunting. For each slide, give: a short slide title, 2-4 bullet points of what actually appears on the slide (kept short — a slide is a visual aid, not a script), and separate speaker notes written as what I'd actually say out loud, which must add context, an example, or a transition the bullets don't already say rather than just reading the bullets back in sentence form. Flag any slide where my research notes don't give you enough to fill the time budget, rather than padding the speaker notes with filler to hit the time.

After the outline, do a total time check: add up the per-slide budgets and confirm they match my stated limit, and if my research notes are thin relative to the time limit, say so directly and suggest either where to add more depth or whether to trim the limit's use elsewhere (like question-buffer time) instead of stretching thin content.

Output as: (1) slide-by-slide outline with time budgets, bullets, and speaker notes, (2) the total time check, (3) a one-line list of any grading requirements you weren't given enough detail to address.`,
    variables: [
      {
        name: 'assignment_topic',
        description: `The presentation topic and class it's for.`,
        example: `Explaining the causes of the 2008 financial crisis, for AP Macroeconomics.`,
        required: true,
      },
      {
        name: 'time_limit',
        description: `Your actual allotted presentation time.`,
        example: `6 minutes, plus 2 minutes for questions.`,
        required: true,
      },
      {
        name: 'research_notes',
        description: `Whatever research or key points you've already gathered, even if rough.`,
        example: `Subprime mortgages, mortgage-backed securities, credit rating agency failures, Lehman Brothers collapse, TARP bailout.`,
        required: true,
      },
      {
        name: 'grading_requirements',
        description: `Specific things the rubric or teacher said you must include.`,
        example: `Must cite at least two causes with supporting evidence, must include one visual/chart, must state one lasting policy change.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`presentation-prep`, `public-speaking`, `slide-outline`, `time-management`, `classroom-assignment`],
    whyItWorks: `Asked for a presentation outline without a time budget, GPT-5.1 tends to produce a roughly even three-act structure regardless of your actual time limit, because "intro/body/conclusion" is the default presentation shape in its training distribution and it has no forcing function to size each section against a real constraint — assigning explicit per-slide time budgets that must sum to your stated limit turns an aesthetic structure into an arithmetic one the model has to satisfy, which is what actually prevents the common student failure of running eight minutes over on a six-minute slot. Explicitly separating slide bullets from speaker notes and requiring the notes to add something the bullets don't targets a specific, very common AI-generated-presentation failure: without that instruction, the model tends to write speaker notes that are just the bullet points rephrased into full sentences, which produces the exact "reading the slide out loud" delivery style that presentation rubrics penalize and that makes a talk boring to sit through regardless of content quality. The instruction to flag thin sections rather than pad them with filler matters because a model under an implicit "fill this time slot" pressure will generate plausible-sounding elaboration to hit a duration target even when your actual research doesn't support that much content, and presenting padded, low-density material for two extra minutes reads as worse to a grader than an honest, tighter presentation that ends slightly early — the model flagging the gap gives you the chance to actually research more or trim the ask, instead of unknowingly walking in with a presentation that thins out under audience questions.`,
    exampleOutput: `Slide 3 — Mortgage-Backed Securities (60 sec)
Bullets: Bundled subprime loans sold as securities; rating agencies mislabeled risk; banks held concentrated exposure.
Speaker notes: Here's the part that surprises people — these securities got top ratings from agencies who were paid by the same banks issuing them, which is a conflict of interest worth pointing out explicitly since it's a common follow-up question. Transition: that mislabeled risk is exactly what turned a housing problem into a banking-system problem, which is where Lehman comes in.`,
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
    slug: 'students-decode-teacher-feedback-into-revision-checklist',
    category: 'students',
    title: `Turn a teacher's three-word margin comments into a concrete revision checklist you can actually act on`,
    description: `Translates short, vague grading comments like 'unclear' or 'needs more support' into a specific, checkable list of what to actually change in your next draft, instead of leaving you to guess what the teacher meant.`,
    promptText: `Help me turn vague grading comments on my paper into an actual revision checklist I can act on, since the comments alone don't tell me what specifically to change.

ASSIGNMENT AND WHAT IT'S GRADED ON
{{assignment_context}}

MY TEACHER'S ACTUAL COMMENTS (verbatim)
{{teacher_comments}}

RELEVANT EXCERPT FROM MY PAPER EACH COMMENT WAS ATTACHED TO
{{paper_excerpts}}

For each comment, do three things: state the most likely specific meaning behind it given where in my paper it was attached and what the assignment is graded on; if the comment is genuinely ambiguous between two plausible meanings, say both and tell me which is more likely given context, rather than picking silently; and give one concrete action I can take to address it, specific enough that I'd know whether I actually did it — not "be clearer" but the actual sentence-level or paragraph-level change to make. Where a comment references something that needs outside verification, like a factual claim or a citation format rule, tell me to check the actual assignment guidelines or a citation manual rather than asserting a rule as if you know my teacher's specific standard.

If several comments seem to point at one underlying, recurring issue rather than several separate problems, say so and name the single root cause — a student fixing five symptoms individually often still misses the one pattern the teacher was actually flagging across the whole paper.

Output as a checklist: one line per comment with the likely meaning and the concrete action, followed by a short note at the end naming any recurring pattern across comments and the one change that would fix all of them at once.`,
    variables: [
      {
        name: 'assignment_context',
        description: `What the assignment was and what it's graded on.`,
        example: `A 5-paragraph argumentative essay on whether social media should be regulated for minors, graded on thesis clarity, evidence use, and counterargument handling.`,
        required: true,
      },
      {
        name: 'teacher_comments',
        description: `The exact short comments written on your paper, word for word.`,
        example: `'Unclear' (next to paragraph 2 topic sentence), 'needs more support' (next to paragraph 3), 'so what?' (in the margin of the conclusion), 'weak' (circled next to the thesis).`,
        required: true,
      },
      {
        name: 'paper_excerpts',
        description: `The actual sentence or passage each comment was written next to.`,
        example: `Thesis: 'Social media has both good and bad effects on minors.' Paragraph 2 topic sentence: 'Another effect is on mental health.' Paragraph 3: cites one statistic with no explanation of where it's from.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`teacher-feedback`, `essay-revision`, `writing-help`, `grading-comments`, `self-editing`],
    whyItWorks: `A short margin comment like "unclear" or "weak" is compressed shorthand for a specific, teacher-legible problem, but handed to GPT-5.1 without the surrounding paper excerpt it produces generic writing advice about clarity in the abstract, because the model has no way to diagnose what specifically triggered that word without seeing the actual sentence it was attached to — pairing each comment with its exact excerpt lets the model reason about the concrete gap (a thesis stating both sides without taking a position reads as "weak" specifically because it isn't arguable, not because the prose is unclear) instead of guessing generically. Requiring the model to state two interpretations when a comment is genuinely ambiguous, rather than picking one silently, matters because acting confidently on the wrong interpretation of a vague comment wastes a whole revision cycle — a student who revises for "unclear phrasing" when the teacher actually meant "unclear argument structure" gets marked down again on the exact same comment, and surfacing the ambiguity lets the student make an informed guess or actually ask the teacher rather than getting a false sense of having addressed it. Asking the model to look for one recurring root cause across multiple comments targets a specific and common pattern in essay feedback: several surface-level comments (weak thesis, unclear topic sentence, 'so what' on the conclusion) frequently trace back to a single underlying issue — commonly a thesis that doesn't stake out an actual arguable position — and a student who patches each comment as an isolated fix without noticing the shared root often turns in a revision that still reads as unfocused, because the individual patches don't cohere around one clear argument the way an addressed root cause would.`,
    exampleOutput: `Thesis (circled 'weak'): Most likely meaning — the thesis states both sides ('has both good and bad effects') without taking an arguable position, which reads as weak because there's nothing here a reader could disagree with. Action: rewrite the thesis to commit to one side, e.g., 'Social media should be regulated for minors because its mental health risks outweigh its social benefits.'

Recurring pattern: the 'weak' thesis and the 'so what?' on the conclusion are likely the same root issue — without a thesis that takes a real position, the conclusion has nothing specific to circle back to and reads as restating rather than resolving an argument. Fixing the thesis first should make the conclusion issue mostly resolve itself.`,
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
    slug: 'students-reverse-engineer-rubric-from-assignment-prompt',
    category: 'students',
    title: `Reverse-engineer a grading rubric from an assignment sheet that doesn't come with one`,
    description: `Builds a likely rubric from an assignment prompt and any past graded work you have, so you know what's actually being weighted before you submit instead of finding out from the grade.`,
    promptText: `My teacher gave me an assignment prompt with no rubric attached. Build me a likely rubric so I know what's actually going to be weighted before I submit, based on what the prompt itself emphasizes and any past graded work from this teacher I can show you as a pattern.

ASSIGNMENT PROMPT (verbatim)
{{assignment_prompt}}

CLASS AND ASSIGNMENT TYPE
{{class_context}}

PAST GRADED WORK FROM THIS TEACHER, IF ANY (what was rewarded or marked down)
{{past_feedback_pattern}}

Build the rubric as 4-6 criteria, each with a name, a one-line description of what earns full marks versus what's a common way to lose points on it, and a rough weight relative to the others (you don't need exact percentages, but rank them heaviest to lightest). Base the weighting primarily on what the prompt itself spends the most words and emphasis on — a prompt that spends three sentences on how sources must be cited and one sentence on formatting is signaling that citations matter more, even if it never says so explicitly. If I gave you past graded feedback, use it to check or adjust your guessed weighting rather than ignoring it, since a teacher's actual past grading pattern is stronger evidence than a first read of this one prompt.

Be explicit about your confidence: mark any criterion you're inferring mostly from general norms for this assignment type, versus one you can point to a specific sentence in the prompt for. Do not present a guessed rubric as if it were the teacher's actual rubric — say clearly that this is your best inference and that confirming with the teacher directly, especially on anything you flagged as low-confidence, is worth doing if there's time before the deadline.

Output as a rubric table: criterion, what earns full marks, common ways to lose points, relative weight, and a confidence flag (high/medium/low) per row. End with one line naming the single highest-weighted criterion and the one thing most likely to cost the most points if missed.`,
    variables: [
      {
        name: 'assignment_prompt',
        description: `The exact assignment sheet or prompt text as given.`,
        example: `"Write a 4-6 page analysis of a primary source document of your choosing from this unit. Your analysis must contextualize the document's origin, evaluate its reliability as a historical source, and connect it to at least two course themes. Proper Chicago-style citations required throughout."`,
        required: true,
      },
      {
        name: 'class_context',
        description: `The class and the general type of assignment.`,
        example: `AP World History, primary source analysis paper, third one this semester.`,
        required: true,
      },
      {
        name: 'past_feedback_pattern',
        description: `What this teacher has rewarded or penalized on past similar assignments, if you have that history.`,
        example: `Last paper lost points mainly for citation formatting errors and for summarizing the source instead of evaluating its reliability; got full marks on the thematic connections section.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`rubric`, `grading-criteria`, `assignment-planning`, `study-strategy`, `essay-writing`],
    whyItWorks: `When an assignment prompt has no attached rubric, GPT-5.1 asked to just "explain the assignment" tends to restate the prompt's stated tasks with roughly equal weight given to each, because without an explicit instruction to look for emphasis signals it treats the prompt as a flat list of instructions rather than as a document that itself encodes priority through how much space and specificity it gives each requirement — instructing the model to weight based on relative emphasis (three sentences on citation standards versus one on formatting) extracts a real, usable signal from a document that was never designed to be machine-read for grading weight, which is closer to how an experienced student actually reads an assignment sheet than a naive equal-weighting summary. Feeding in past graded feedback from the same teacher matters because a single assignment prompt is a weak predictor of actual grading behavior on its own — teachers routinely emphasize things in the prompt they don't end up weighting heavily in practice, and vice versa, so real historical evidence of what specifically cost or earned points from this teacher should override a first-pass reading of the prompt's own language when the two conflict, and the instruction explicitly tells the model to treat the historical pattern as stronger evidence rather than averaging it in as one more equal input. The required confidence flag per row exists because a guessed rubric presented with uniform authority is actively misleading — a student who treats every row as equally certain might spend their limited revision time on a low-confidence guess instead of the high-confidence, directly-stated-in-the-prompt requirement that's actually safest to prioritize, and marking the distinction lets the student decide where confirming with the teacher directly is worth the extra step before a deadline.`,
    exampleOutput: `Criterion: Source reliability evaluation | Full marks: Explicitly assesses bias, provenance, and limitations of the source, not just summarizing its content | Common point loss: Describing what the source says instead of evaluating how trustworthy or limited it is as evidence | Weight: Highest | Confidence: High (prompt explicitly separates 'evaluate reliability' from 'contextualize origin' as distinct tasks, and past feedback confirms this was penalized before).`,
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
