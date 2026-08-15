import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'exam-prep-revision-plan-weak-topic-triage',
    category: 'exam-prep',
    title: `Turn a stack of graded past papers into a revision plan that spends your remaining days on what's actually costing you marks`,
    description: `Feeds in your topic-by-topic scores from past papers or mock tests and gets back a day-by-day revision schedule weighted toward your weakest, highest-value topics instead of a generic full-syllabus re-read.`,
    promptText: `You are building me a revision schedule for the exact number of days I have left before my exam, based on where I'm actually losing marks, not a generic re-read of the whole syllabus in order.

EXAM AND DATE
{{exam_and_date}}

DAYS AVAILABLE AND DAILY STUDY HOURS
{{days_and_hours}}

TOPIC-BY-TOPIC PERFORMANCE
{{topic_performance}}

MARK WEIGHTING OF EACH TOPIC ON THE ACTUAL EXAM
{{topic_weighting}}

NON-NEGOTIABLE COMMITMENTS DURING THIS WINDOW
{{fixed_commitments}}

RULES
Rank topics by a combination of how many marks I'm losing on them and how many marks they're worth on the real exam — a topic I'm weak on but that's worth 2% of the paper should get less time than a topic I'm weak on that's worth 15%, even though both are "weak." Do not default to allocating time evenly across topics; state explicitly which topics are getting deliberately less time than their syllabus weight would suggest, and say why. Build in at least one full practice-paper sitting under timed conditions before the last two days, and reserve the final day for review only, not new material. For each day, name the specific topic, what "done" looks like for that day (e.g. "can solve all past-paper questions on this topic from the last 3 years without looking at notes"), and roughly how long it should take, adjusted to the hours I actually have that day. If the days available clearly aren't enough to adequately cover every weak topic at the depth the mark weighting would ideally deserve, say so plainly and tell me which topics you're deliberately triaging down to a lighter pass or dropping, rather than quietly producing an overstuffed schedule that looks complete but isn't realistic to finish.

OUTPUT FORMAT
A short paragraph stating the triage logic and which topics got cut or compressed and why, followed by a day-by-day table: Day | Topic | Goal for the day | Time budget | Resource type (notes review / practice questions / timed paper).`,
    variables: [
      {
        name: 'exam_and_date',
        description: `The specific exam and the date it's on.`,
        example: `CBSE Class 12 Physics board exam, 3 March 2027`,
        required: true,
      },
      {
        name: 'days_and_hours',
        description: `How many days are left and realistic daily study hours, accounting for other classes or commitments.`,
        example: `18 days left, roughly 3 usable hours on weekdays and 6 on weekends`,
        required: true,
      },
      {
        name: 'topic_performance',
        description: `Your actual scores or self-assessed confidence per topic from past papers or mocks.`,
        example: `Electrostatics 40%, Current Electricity 55%, Optics 85%, Modern Physics 35%, EM Induction 60%`,
        required: true,
      },
      {
        name: 'topic_weighting',
        description: `How much each topic is actually worth on the real exam, from the syllabus or past-paper pattern.`,
        example: `Electrostatics ~16% of paper, Current Electricity ~10%, Optics ~14%, Modern Physics ~10%, EM Induction ~12%`,
        required: true,
      },
      {
        name: 'fixed_commitments',
        description: `Anything already eating into the available days that the plan needs to work around.`,
        example: `Two other board exams (Chemistry, Math) in the same window needing roughly 1 hour/day each`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`revision-plan`, `study-schedule`, `exam-strategy`, `weak-topic-analysis`, `board-exams`],
    whyItWorks: `GPT-5.1 defaults to a well-meaning but structurally lazy move when asked for a "revision plan": it distributes days roughly evenly across whatever topic list it's given, because even coverage is the safest-looking answer and requires no judgment call about what to cut. Forcing it to combine two numbers per topic — weakness and mark-weighting — rather than one breaks that default, because there's no longer a single sortable list to spread evenly across; it has to actually multiply out which combination of low-score-and-high-weight topics deserves disproportionate time, which is a genuine reasoning step rather than a formatting one. The explicit instruction to name what's being triaged down or dropped matters because an unconstrained plan that's asked to cover everything in too few days will silently pad each topic's allotted time until the total adds up to the available hours, producing a schedule that looks complete on paper but was never checked against whether a real day's block is achievable — naming the triage forces the model to do that arithmetic check out loud instead of eliding it. The "done" criterion per day matters mechanically too: without a concrete exit condition, GPT-5.1's day-by-day plans tend to describe activities ("review electrostatics") rather than checkable outcomes, which means the plan can't tell you whether you're actually on schedule three days in, only whether you followed the itinerary.`,
    exampleOutput: `Triage note: Modern Physics (35% score, only 10% of paper) and Electrostatics (40% score, 16% of paper) get priority; Optics (85% score) drops to a single 90-minute refresh on Day 14 instead of a full day, since further gains there are marginal. Day 1 — Electrostatics: solve every past-paper question from 2022-2025 unaided, ~3 hrs. Day 2 — Electrostatics (cont.): redo only the ones missed yesterday plus Gauss's law edge cases, ~2 hrs...`,
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
    slug: 'exam-prep-practice-question-set-from-syllabus-gaps',
    category: 'exam-prep',
    title: `Generate a practice question set that targets the exact syllabus gap you just found, not a generic worksheet`,
    description: `Produces a small, graduated set of original practice questions aimed squarely at one topic you're struggling with, matched to your actual exam's question style and difficulty curve.`,
    promptText: `You are writing an original set of practice questions for one specific topic I need more reps on, styled to match the actual question format of my target exam.

EXAM AND QUESTION STYLE TO MATCH
{{exam_and_style}}

TOPIC AND SPECIFIC SUB-SKILL
{{topic_and_subskill}}

WHERE I'M CURRENTLY GETTING STUCK
{{failure_pattern}}

NUMBER AND DIFFICULTY SPREAD
{{question_count_and_spread}}

RULES
Write entirely original questions — do not reproduce or lightly reword any real past-paper question you may recognize from training data; treat the exam and style description as a format and difficulty target only, not a source to copy from. Sequence questions so difficulty actually climbs: the first one or two should be solvable using the core technique in its most standard form, and later ones should specifically target the failure pattern I described, including at least one that combines this topic with an adjacent one the way a real exam often does at the harder end. Do not write a question that tests something outside the stated topic and sub-skill just to add variety. For each question, state the mark value it would likely carry on the real exam and roughly how long a student should spend on it, so the set doubles as a timing calibration exercise, not just a knowledge check. Hold back the worked solutions and final answers into a clearly separated second section headed "SOLUTIONS," placed after all questions, so the question set can be attempted cold without answers being visible directly underneath each one.

OUTPUT FORMAT
Section 1: numbered questions with mark value and suggested time per question. Section 2, headed SOLUTIONS: full worked solution per question number, ending with a one-line note on which question(s) most directly target the failure pattern described above.`,
    variables: [
      {
        name: 'exam_and_style',
        description: `The target exam and what its questions typically look like — command words, typical mark allocation, structure.`,
        example: `AQA A-Level Chemistry Paper 2, six-mark 'explain' questions with a required chain of reasoning, not just a final answer`,
        required: true,
      },
      {
        name: 'topic_and_subskill',
        description: `The specific topic and the narrower sub-skill within it you want reps on.`,
        example: `Reaction kinetics — specifically interpreting rate-concentration graphs to determine reaction order, not the rate equation itself`,
        required: true,
      },
      {
        name: 'failure_pattern',
        description: `The specific way you keep getting these wrong, from your own attempts.`,
        example: `I keep confusing a graph that's a straight line through the origin (first order) with one that's a straight line with a non-zero intercept, and I mix up which axis pairing shows zero order`,
        required: true,
      },
      {
        name: 'question_count_and_spread',
        description: `How many questions you want and how the difficulty should be distributed.`,
        example: `6 questions total — 2 at standard difficulty, 3 targeting the graph-confusion error directly, 1 combining kinetics with equilibrium`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`practice-questions`, `exam-preparation`, `targeted-practice`, `question-generation`, `difficulty-calibration`],
    whyItWorks: `Naming the exact failure pattern rather than just the topic changes what GPT-5.1 optimizes the question set for: given only a topic name, it tends to generate the most common, textbook-representative examples of that topic, which is exactly the version of the question you've probably already seen and already know how to do — describing the specific confusion (e.g. mixing up graph intercepts for reaction order) forces it to construct scenarios engineered to trigger that exact misstep, which is a materially different and harder authoring task than generic topic coverage. Separating questions from solutions into two clearly headed sections matters because GPT-5.1, left to its own formatting instincts, will often interleave a worked answer directly under each question for helpfulness, which defeats the point of a cold-attempt practice set — an explicit structural instruction is needed because "don't show me the answer yet" is otherwise overridden by the model's default toward maximally helpful, immediately-complete responses. The instruction against reproducing recognized past-paper questions addresses a real and specific risk: exam board past papers are widely available training data, and a topic-and-style prompt without that guard can pull the model toward reconstructing a question it has effectively memorized rather than generating a new one, which is both a copyright concern and pedagogically useless since a memorized-and-regurgitated question isn't a genuine new rep.`,
    exampleOutput: `Q3 (4 marks, ~5 min): The graph shows concentration of X plotted against time, producing a straight line with a positive y-intercept that does not pass through the origin. State the order of reaction with respect to X and justify your answer using the shape of this specific graph... [Solutions section separately confirms: zero order, since a straight line on a concentration-time graph indicates a constant rate independent of concentration.]`,
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
    slug: 'exam-prep-mcq-distractor-quality-set',
    category: 'exam-prep',
    title: `Write MCQs where every wrong option represents a real misconception, not filler`,
    description: `Generates multiple-choice practice questions with distractors built from actual common errors on the topic, so getting one wrong tells you which specific misunderstanding you have instead of just that you guessed wrong.`,
    promptText: `Write a set of multiple-choice questions on the topic below where every incorrect option corresponds to a specific, real misconception someone could plausibly hold — not a random wrong number or an obviously silly option included just to fill four slots.

TOPIC
{{topic}}

EXAM CONTEXT
{{exam_context}}

KNOWN COMMON MISCONCEPTIONS ON THIS TOPIC
{{known_misconceptions}}

NUMBER OF QUESTIONS
{{question_count}}

CONSTRUCTION RULES
Each question must have exactly four options with exactly one correct answer. For every distractor, it must be traceable to a specific, nameable error — a sign error, a units mistake, an off-by-one in a formula, confusing two similar-sounding terms, applying the right method to the wrong step, or a misconception from the list I gave you. Never use "all of the above," "none of the above," or a distractor that's simply implausible on its face (e.g. wildly out-of-range numerically) — every option should require the test-taker to actually check their work to rule it out. Vary which position (A, B, C, or D) holds the correct answer across the set so the answer key isn't visually patterned. Do not tell me which option is correct anywhere near the question itself.

WHAT NOT TO DO
Do not write a question stem that gives away the answer through phrasing (e.g. a stem that only grammatically fits one option). Do not repeat the same misconception as the basis for a distractor more than twice across the set — vary which error each question is probing for.

OUTPUT FORMAT
Section 1: numbered questions, each with four lettered options, no answer indicated. Section 2, headed ANSWER KEY: for each question, the correct letter plus, for each of the three wrong options, a one-line note naming the specific misconception that option represents.`,
    variables: [
      {
        name: 'topic',
        description: `The specific topic the MCQs should cover.`,
        example: `Balancing redox equations using the half-reaction method`,
        required: true,
      },
      {
        name: 'exam_context',
        description: `The exam these are practice for, so difficulty and phrasing match.`,
        example: `NEET UG Chemistry, single-best-answer format, roughly 1 minute per question under exam conditions`,
        required: true,
      },
      {
        name: 'known_misconceptions',
        description: `Specific errors you or your students actually make on this topic, if known.`,
        example: `Forgetting to balance oxygen atoms using water before balancing hydrogen with H+ in acidic medium; adding electrons to the wrong side of a half-reaction`,
        required: false,
      },
      {
        name: 'question_count',
        description: `How many MCQs to generate.`,
        example: `8`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`mcq-generator`, `multiple-choice`, `distractor-design`, `exam-preparation`, `diagnostic-practice`],
    whyItWorks: `Left unguided, GPT-5.1's default distractor-writing habit is to generate one plausible near-miss and then pad the remaining two or three options with numerically or logically implausible filler, because a genuinely misconception-grounded distractor requires modeling a wrong mental process rather than just perturbing the right answer slightly — the explicit instruction to trace every option to a specific nameable error (sign flip, unit confusion, wrong formula step) forces the harder generative task instead of letting it default to the easier one. This matters diagnostically, not just for difficulty: an MCQ set built from real misconceptions turns a wrong answer into information about which specific error you're making, while an MCQ set with implausible filler distractors only tells you that you got it wrong, with no diagnostic value at all — which defeats the actual purpose of practicing with MCQs rather than open-response questions. Banning "all/none of the above" addresses a separate, well-documented pattern where these options let a test-taker (and the model) avoid fully committing to four independently-justified wrong answers, effectively reducing the question to three real options plus an escape hatch. The instruction to vary correct-answer position and avoid repeating the same misconception basis more than twice guards against a subtler failure mode: GPT-5.1 tends toward repetitive structural patterns across a batch of similar items unless explicitly told to vary them, which would otherwise let a test-taker pattern-match the answer key rather than the content.`,
    exampleOutput: `Q4: In acidic medium, which is the correctly balanced half-reaction for the reduction of MnO4- to Mn2+? ... Answer key Q4: Correct = C. Option A represents forgetting to balance oxygen atoms with water molecules before adding H+. Option B represents adding electrons to the reactant side instead of the product side. Option D represents a charge-balance error from miscounting the electrons needed.`,
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
    slug: 'exam-prep-flashcard-deck-active-recall',
    category: 'exam-prep',
    title: `Convert a dense set of notes into flashcards that actually test recall instead of recognition`,
    description: `Breaks your lecture notes or textbook chapter into atomic, one-fact-per-card flashcards written for genuine active recall, flagging anywhere your source notes are too vague to make a good card from.`,
    promptText: `Convert the notes below into flashcards for active recall practice — one atomic, testable fact per card, not a summary chopped into pieces.

SOURCE NOTES
{{source_notes}}

SUBJECT AND CARD PURPOSE
{{subject_and_purpose}}

CARD STYLE PREFERENCE
{{card_style}}

RULES
Each card must test exactly one fact, relationship, or step — if a note contains three related facts, that's three cards, not one card with a three-part answer. Write the front of each card as a genuine question or a cloze deletion, never as a fragment that just restates the back with a blank at the end, since that tests recognition of the sentence rather than recall of the fact. Where the source notes state a fact without enough context to make an unambiguous card (a term with no definition given, a number with no unit, a step referenced but not explained), do not silently invent the missing detail — instead output that card in a separate "NEEDS SOURCE CHECK" section naming exactly what's missing, so I go verify it rather than accidentally memorizing something you guessed at. For any card involving a process with multiple steps, also produce one additional card asking for the steps in order, separate from cards testing individual steps, since exam questions often test sequence specifically. Keep every card's back short enough to recall in under 10 seconates of thought — if a concept genuinely needs a paragraph to answer, that's a sign it should be split into two or more cards.

OUTPUT FORMAT
A numbered list of cards as "Front: ... / Back: ..." pairs, followed by a separate NEEDS SOURCE CHECK section listing anything you declined to turn into a card and why.`,
    variables: [
      {
        name: 'source_notes',
        description: `The actual notes, textbook excerpt, or lecture content to convert.`,
        example: `Krebs cycle notes: Acetyl-CoA (2C) combines with oxaloacetate (4C) to form citrate (6C). Citrate is converted through isocitrate to alpha-ketoglutarate, releasing CO2 and NADH. Alpha-ketoglutarate converts to succinyl-CoA, releasing another CO2 and NADH...`,
        required: true,
      },
      {
        name: 'subject_and_purpose',
        description: `The subject and what exam or test these cards are ultimately for.`,
        example: `AP Biology, cellular respiration unit, for the AP exam's free-response process questions`,
        required: true,
      },
      {
        name: 'card_style',
        description: `Whether you want question-and-answer style, cloze deletion, or a mix.`,
        example: `Mostly question-and-answer, but use cloze deletion for exact numbers or named steps I need to recall verbatim`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`flashcards`, `active-recall`, `study-tools`, `note-conversion`, `spaced-repetition`],
    whyItWorks: `GPT-5.1's default approach to "make flashcards from these notes" is to summarize the notes into digestible chunks and then reformat each chunk as a front/back pair, which produces cards that test whether you recognize a rephrased sentence, not whether you can independently retrieve the fact — the atomic, one-fact-per-card rule forces an actual decomposition step where a three-part note becomes three separate retrieval challenges instead of one recognition challenge dressed as a flashcard. The NEEDS SOURCE CHECK instruction targets a specific and consequential failure mode: language models are fluent enough to smoothly fill a gap in incomplete source material with a plausible-sounding invented detail, and because the output looks uniformly confident, a student has no way to tell which cards are grounded in their actual notes versus quietly fabricated — flagging gaps explicitly rather than filling them prevents a student from memorizing a hallucinated fact with the same confidence as a real one. The separate sequence-recall card for multi-step processes exists because testing individual steps in isolation doesn't verify that a student can reproduce the full order under exam conditions, which is specifically what free-response and long-answer exam formats actually demand — a deck built only from atomic single-fact cards can create false confidence in a student who knows each piece but can't reconstruct the whole sequence unprompted.`,
    exampleOutput: `Front: How many carbons does citrate have, and from combining which two molecules? / Back: 6 carbons, from acetyl-CoA (2C) and oxaloacetate (4C). Front: List the products released at the alpha-ketoglutarate to succinyl-CoA step. / Back: One CO2 and one NADH. NEEDS SOURCE CHECK: Your notes mention citrate converting 'through isocitrate' but don't state what enzyme catalyzes that step — verify before I make a card testing the enzyme name.`,
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
    slug: 'exam-prep-full-length-mock-test-timed',
    category: 'exam-prep',
    title: `Build a full-length timed mock test that simulates real exam pressure, with answers held back until you actually finish`,
    description: `Assembles a complete, section-timed mock exam matching your real exam's structure and difficulty, deliberately withholding the answer key in a separate follow-up so you take it cold under realistic timing.`,
    promptText: `Build me a full-length mock test that mirrors the real exam's structure, section timing, and difficulty as closely as possible, and hold back the answer key entirely — do not include it in this response.

EXAM BEING SIMULATED
{{exam_name}}

SECTION STRUCTURE AND TIMING
{{section_structure}}

TOPICS TO WEIGHT TOWARD
{{topic_weighting}}

DIFFICULTY CALIBRATION
{{difficulty_reference}}

PHASE 1 — BUILD THE TEST
Generate original questions for every section in the structure given, in the same order and with the same per-section time allocation as the real exam, so the whole thing can be printed or opened in one document and attempted start to finish with a single timer. Match difficulty to the reference given, not to what feels achievable — a mock test that's easier than the real exam produces false confidence, which is worse than no mock test at all. Distribute topic coverage according to the weighting given, not evenly across everything you can think of. At the top, state the total time allowed and each section's individual time budget clearly enough that I can set timers before starting.

PHASE 2 — WITHHOLD ANSWERS
Do not include any answers, mark schemes, or worked solutions in this response, even partially. End this response with only the line: "Reply 'grade it' once you've finished and timed yourself, and I'll provide the full answer key and a section-by-section score breakdown." This is a hard rule — a mock test with the answer key visible in the same response isn't a mock test, since it can't be attempted honestly under pressure.

OUTPUT FORMAT
Title and total/section timing block, then each section's questions in full, ending with the single withholding line above and nothing else.`,
    variables: [
      {
        name: 'exam_name',
        description: `The specific exam being simulated.`,
        example: `GRE General Test`,
        required: true,
      },
      {
        name: 'section_structure',
        description: `The real exam's section order, question counts, and time limits.`,
        example: `Two Verbal Reasoning sections (20 questions, 30 min each), two Quantitative Reasoning sections (20 questions, 35 min each), in that order`,
        required: true,
      },
      {
        name: 'topic_weighting',
        description: `How topics or question types should be distributed within sections.`,
        example: `Quant sections should be roughly 40% algebra, 30% arithmetic/data interpretation, 30% geometry, matching the real test's typical mix`,
        required: true,
      },
      {
        name: 'difficulty_reference',
        description: `A benchmark for how hard the questions should be.`,
        example: `Calibrate to the difficulty of official ETS practice test 2, not an easier introductory level`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`mock-test`, `timed-practice`, `full-length-exam`, `exam-simulation`, `test-conditions`],
    whyItWorks: `GPT-5.1's helpfulness training pushes it toward completeness by default, which for a request like "build me a mock test" usually means appending the answer key immediately after the questions so the response feels self-contained and useful in one shot — the explicit, repeated, hard-rule instruction to withhold answers and end on a single specific line is necessary because a softer phrasing like "don't show me the answers yet" is easy for the model to satisfy nominally while still leaking partial hints in surrounding commentary. Structuring the request as two phases, with Phase 2 defined entirely as a withholding action rather than a generation action, gives the model an explicit stopping point to execute rather than leaving "how much to hold back" as a judgment call it has to make mid-generation, which is where hint-leakage usually creeps in. The difficulty-calibration field matters because GPT-5.1, left to its own judgment about exam difficulty, tends to regress toward a moderate, broadly-accessible level that undershoots genuinely hard real exams — anchoring difficulty to a named reference (a specific official practice test) gives it a concrete target to match rather than an internal, uncalibrated sense of "hard enough," which is exactly the failure mode that produces a mock test easier than the real thing and the false confidence that comes with it.`,
    exampleOutput: `GRE Mock Test — Total time: 130 minutes. Section 1: Verbal Reasoning (30 min, 20 questions)... Section 4: Quantitative Reasoning (35 min, 20 questions)... [full questions follow for each section] ... Reply 'grade it' once you've finished and timed yourself, and I'll provide the full answer key and a section-by-section score breakdown.`,
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
    slug: 'exam-prep-answer-explanation-partial-credit-review',
    category: 'exam-prep',
    title: `Get your wrong exam answer explained the way a real grader would mark it, including where you'd have earned partial credit`,
    description: `Reviews your actual attempted answer against the correct one, pinpointing exactly where your reasoning diverged and how many marks that specific error would likely cost under real exam marking, rather than just restating the right answer.`,
    promptText: `Review my actual attempted answer to this question and explain precisely where it went wrong, the way an exam grader marking against a scheme would, not just by restating the correct solution.

QUESTION
{{question}}

MY ATTEMPTED ANSWER
{{my_answer}}

CORRECT ANSWER OR MARK SCHEME (IF I HAVE IT)
{{correct_answer_or_scheme}}

EXAM MARKING STYLE
{{marking_style}}

RULES
First identify exactly where my reasoning departs from a correct path — quote or paraphrase the specific line or step in my answer where the error starts, not just "the final answer is wrong." Distinguish between an error in method (I used the wrong approach entirely) and an error in execution (I used the right approach but made an arithmetic, sign, or transcription slip partway through), since these are graded very differently on most real mark schemes. Estimate, based on the marking style described, roughly how many of the available marks my attempt would likely have earned given where the error occurred — method marks for correct steps before the error, versus losing marks only from the error onward. If I did not provide an official mark scheme, say explicitly that your mark estimate is an approximation based on typical marking conventions for this exam type, not an authoritative score. Do not simply present the fully correct solution as your primary response — the correction should be secondary to, and clearly derived from, the diagnosis of my specific error.

OUTPUT FORMAT
1. Where the error starts (quote the specific step). 2. Method error or execution error, and why. 3. Estimated partial credit under the marking style given, with the caveat if no official scheme was provided. 4. The corrected path forward from the error point only, not a full restated solution from scratch.`,
    variables: [
      {
        name: 'question',
        description: `The exam question being reviewed.`,
        example: `A car accelerates uniformly from 5 m/s to 20 m/s over 6 seconds. Calculate the distance travelled during this time.`,
        required: true,
      },
      {
        name: 'my_answer',
        description: `Your actual attempted working and final answer, exactly as you wrote it.`,
        example: `a = (20-5)/6 = 2.5 m/s^2. s = ut + 0.5at^2 = 5(6) + 0.5(2.5)(6) = 30 + 7.5 = 37.5 m`,
        required: true,
      },
      {
        name: 'correct_answer_or_scheme',
        description: `The official correct answer or mark scheme, if you have access to it.`,
        example: `Official answer: 75 m, method mark for correct SUVAT equation, mark for correct substitution, mark for final answer`,
        required: false,
      },
      {
        name: 'marking_style',
        description: `How this exam typically allocates marks for working versus final answer.`,
        example: `GCSE Physics, method marks awarded for correct equation and substitution even if final arithmetic is wrong`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`answer-review`, `exam-marking`, `partial-credit`, `error-diagnosis`, `grading-feedback`],
    whyItWorks: `When simply asked to check an answer, GPT-5.1 tends to solve the problem fresh and present the correct solution as the primary output, treating the student's actual attempt as an afterthought to compare against at the end — this is the opposite of what's diagnostically useful, since a student reviewing a wrong answer already knows what's ultimately correct in outline and specifically needs to know where their own reasoning diverged. Requiring the model to quote the specific step where the error starts forces it to actually trace through the given attempt line by line rather than pattern-matching "this final number doesn't match" and working backward from the correct answer, which is a meaningfully different and more careful diagnostic pass. The method-versus-execution distinction is mechanically important because it maps directly onto how real mark schemes allocate partial credit — in the worked example above, the student used the exact right SUVAT equation but substituted t=6 twice instead of squaring it (0.5(2.5)(6) instead of 0.5(2.5)(6^2)), an execution slip that a real grader would likely still award method marks for, whereas GPT-5.1's default "the answer is wrong, here's the right one" response would obscure that the underlying approach was actually sound. The explicit caveat requirement when no official mark scheme is supplied matters because a partial-credit estimate stated with unwarranted confidence could mislead a student about how lenient or strict their real exam's grading actually is, when the model is in fact guessing at typical conventions rather than citing a scheme it was actually given.`,
    exampleOutput: `1. Error starts at: '0.5(2.5)(6)' — the time value was substituted as t instead of t-squared. 2. This is an execution error, not a method error: the correct equation (s = ut + 0.5at^2) and the correct acceleration value were both used correctly up to that point. 3. Under GCSE-style method marking, this would likely earn 2 of 3 marks — one for the correct equation choice, one for correct substitution of u and a, with the final mark lost for the squaring slip. 4. Corrected from that point: 0.5(2.5)(6^2) = 0.5(2.5)(36) = 45, giving s = 30 + 45 = 75 m.`,
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
    slug: 'exam-prep-formula-sheet-derivation-map',
    category: 'exam-prep',
    title: `Build a formula sheet that maps each formula to when to use it and the exact trap variant exams like to test`,
    description: `Organizes your exam's formulas into a reference sheet grouped by when to reach for each one, with the specific variable-substitution trap or edge case each formula is commonly tested with, not just a bare list of equations.`,
    promptText: `Build a formula reference sheet for the topics below, organized around when to use each formula and the specific way exam questions try to trip people up on it — not just a bare list of equations copied from a textbook.

EXAM AND TOPICS TO COVER
{{exam_and_topics}}

WHAT'S ALLOWED IN THE ACTUAL EXAM
{{exam_allowance}}

FORMULAS YOU ALREADY MIX UP
{{confused_formulas}}

FOR EACH FORMULA, INCLUDE
The formula itself with every variable defined and its unit stated. A one-line trigger: the specific phrase or setup in a question that signals this is the formula to reach for, since exam questions rarely say "use formula X" directly. The single most common trap variant — a case where the obvious-looking formula is actually the wrong one, a unit that needs converting first, or a variable that's easy to misidentify (e.g. confusing initial and final values, or radius and diameter). If two formulas are commonly confused for each other, place them adjacent and add one line distinguishing exactly when each applies, rather than listing them in unrelated sections where the distinction has to be worked out separately. Where the exam allowance means a formula is actually provided on the exam paper itself, mark it clearly as "given on paper — memorize when to use it, not the formula itself" so time isn't wasted memorizing something that will be printed in front of the student anyway.

WHAT NOT TO DO
Do not include a formula's full derivation unless a specific formula's derivation is itself commonly examined as a question type — state which ones fall into that category rather than deriving everything by default, since most students need the sheet for application speed, not re-derivation from scratch.

OUTPUT FORMAT
Grouped by topic, one formula per entry with sub-bullets for: Formula, Trigger, Trap, Given-on-paper status.`,
    variables: [
      {
        name: 'exam_and_topics',
        description: `The exam and specific topics the formula sheet should cover.`,
        example: `GATE Mechanical Engineering, Fluid Mechanics: Bernoulli's equation, continuity equation, Reynolds number`,
        required: true,
      },
      {
        name: 'exam_allowance',
        description: `What formulas, if any, are printed on the actual exam paper or a permitted formula sheet.`,
        example: `GATE provides no formula sheet — everything must be memorized`,
        required: true,
      },
      {
        name: 'confused_formulas',
        description: `Specific formulas you already know you mix up with each other.`,
        example: `I keep confusing when to apply Bernoulli's equation directly versus when I need to account for head loss first`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`formula-sheet`, `quick-reference`, `exam-strategy`, `derivation-map`, `study-tools`],
    whyItWorks: `A bare "give me a formula sheet" prompt gets GPT-5.1 to produce what's effectively a textbook appendix — formulas with variables defined but no indication of when each one actually applies, because that's the version of a formula sheet most represented in its training data and requires no judgment about exam-specific traps. Requiring an explicit "trigger" phrase per formula forces a different and more useful kind of output: a mapping from the way a question is actually worded to the formula it implies, which is the real skill being tested under time pressure, since most exam failures on formula-based questions come from picking the wrong tool, not from forgetting how to use the right one once identified. The trap-variant requirement targets a specific, well-documented category of exam question design — testing whether a student notices a unit that needs converting, or a variable that looks like the one they expect but isn't (diameter given where radius is needed) — and naming this explicitly stops the model from defaulting to a generic, trap-free formula list that doesn't reflect how these formulas are actually examined. The given-on-paper flag has a concrete practical payoff: for exams that print certain formulas on the paper itself, spending memorization effort on the formula's exact form rather than on recognizing when to deploy it is wasted study time, and the model has no way to know this distinction matters unless told explicitly what the real exam actually provides.`,
    exampleOutput: `Reynolds Number — Formula: Re = (rho * v * D) / mu, all SI units. Trigger: any question asking whether flow is laminar or turbulent, or referencing a pipe/pump system. Trap: students often plug in diameter when the problem gives radius, halving or doubling Re incorrectly; also check whether velocity given is average or centerline. Given-on-paper: No — GATE requires full memorization for this exam.`,
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
    slug: 'exam-prep-spaced-repetition-schedule-builder',
    category: 'exam-prep',
    title: `Build a spaced repetition schedule that actually lands your last review one or two days before the exam, not after`,
    description: `Calculates a review-interval schedule for a specific set of topics, working backward from your exam date so the final scheduled review falls at the right moment before the test instead of drifting past it.`,
    promptText: `Build me a spaced repetition schedule for the topics below, working backward from my exam date so the review intervals actually land before the exam instead of running past it.

EXAM DATE
{{exam_date}}

TOPICS AND WHEN I FIRST LEARNED EACH ONE
{{topics_and_first_learned}}

INTERVAL PREFERENCE
{{interval_preference}}

DAILY REVIEW CAPACITY
{{daily_capacity}}

RULES
For each topic, calculate review dates using the interval pattern given, starting from the date I first learned it, and check whether the naturally-expanding intervals would push a review past the exam date — if a topic's next natural interval would land after the exam, compress that interval down instead of letting the schedule silently skip a review the topic actually needs before test day. Every topic must have its final review land in the 1-2 days immediately before the exam, regardless of what the natural interval progression would otherwise produce, since a spaced repetition schedule that isn't anchored to end at the right moment is optimizing for long-term retention at the expense of the one date that actually matters here. When multiple topics' review dates land on the same day, check that day's combined review load against my stated daily capacity — if it's over capacity, tell me explicitly which topics to combine into a shorter combined review or shift by a day, rather than producing a schedule that assumes I have more time on that date than I actually do. Do not silently invent a first-learned date for any topic I didn't give one for — list those separately and ask me to fill them in rather than guessing.

OUTPUT FORMAT
A table: Topic | Review dates (in order) | Notes on any interval compression applied and why. Followed by a separate line flagging any day where combined review load exceeds stated daily capacity, with a suggested fix.`,
    variables: [
      {
        name: 'exam_date',
        description: `The date of the actual exam.`,
        example: `22 September 2026`,
        required: true,
      },
      {
        name: 'topics_and_first_learned',
        description: `The list of topics and the date each was first learned or studied.`,
        example: `Cell biology - learned 3 July, Genetics - learned 20 July, Evolution - learned 5 August, Ecology - learned 12 August`,
        required: true,
      },
      {
        name: 'interval_preference',
        description: `The spacing pattern you want to follow.`,
        example: `Roughly 1 day, 3 days, 7 days, 16 days, 35 days between reviews, expanding each time`,
        required: true,
      },
      {
        name: 'daily_capacity',
        description: `How much review time or how many topics you can realistically handle on a single day.`,
        example: `No more than 2 topics reviewed on any single day, roughly 45 minutes each`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`spaced-repetition`, `review-schedule`, `retention-strategy`, `study-planning`, `exam-countdown`],
    whyItWorks: `A standard spaced-repetition interval sequence is designed for indefinite long-term retention and has no inherent awareness of a hard deadline, so GPT-5.1 asked to "apply spaced repetition" without an anchoring instruction will project intervals forward from the first-learned date and let them land wherever the arithmetic naturally puts them — which for a topic learned early enough can mean the last calculated review falls weeks after the exam has already happened, quietly wasting the schedule's most important review on the wrong side of test day. Requiring every topic's final review to land in the 1-2 days before the exam regardless of the natural progression forces the model to work the problem backward as well as forward, checking each topic's trajectory against the fixed endpoint and compressing intervals where needed, which is a different and more constrained calculation than simply iterating a formula forward. The daily-capacity cross-check exists because expanding-interval schedules across multiple topics started on different dates will mathematically cluster several topics' review dates onto the same day with some regularity — without an explicit instruction to check combined load against a stated capacity, the model has no reason to notice that a given day's schedule silently assumes more available time than the student actually has, since each topic's interval was calculated independently of the others. The refusal to invent missing first-learned dates matters because a fabricated starting date would silently corrupt every downstream interval calculated from it, producing a schedule that looks precise while being anchored to a made-up fact.`,
    exampleOutput: `Ecology | Reviews: 13 Aug, 16 Aug, 23 Aug, 8 Sep, 20 Sep | Note: natural next interval after 8 Sep would be ~35 days (13 Oct), well past the 22 Sep exam — compressed to 20 Sep so the final review lands 2 days before test day. Flag: 20 Sep has both Ecology and Genetics scheduled, totaling ~90 min against your 2-topic/day capacity — no fix needed, but Evolution's 21 Sep review should not be added to the same day.`,
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
]
