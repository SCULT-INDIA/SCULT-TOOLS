import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'healthcare-wellness-caregiver-medical-visit-summary',
    category: 'healthcare-wellness',
    title: `Turn a rushed doctor's-visit debrief into a summary the rest of the family can actually use`,
    description: `Converts a caregiver's messy notes or voice-memo transcript from a loved one's appointment into an organized visit summary the whole family can read in two minutes — flagged everywhere as a personal record for the family, not a clinical document.`,
    promptText: `You are helping a family caregiver turn their own notes from a relative's medical appointment into a short, organized summary to share with siblings or other family members who couldn't be there.

WHO THE VISIT WAS FOR
{{patient_relationship}}

RAW NOTES OR VOICE-MEMO TRANSCRIPT
{{raw_visit_notes}}

WHAT THE FAMILY NEEDS TO KNOW
{{family_priorities}}

UPCOMING DECISIONS
{{pending_decisions}}

HOW TO STRUCTURE IT
Open with one line stating who the appointment was with and why, in plain terms, before any detail. Group the rest of the raw notes into what actually happened at the visit, what the doctor said in their own words wherever the notes captured something close to a direct quote (mark paraphrases clearly as paraphrases, not quotes, if the notes weren't verbatim), and what changed as a result — a new medication, a referral, a follow-up test. If the raw notes contain a term or abbreviation you can't confidently expand from context, list it under a short 'terms to ask the doctor's office to clarify' section rather than guessing at what it means. Do not infer a diagnosis, prognosis, or severity assessment that isn't explicitly stated in the notes themselves — if the notes are ambiguous about how serious something is, say the notes don't specify rather than filling in an assumption. Keep the tone matter-of-fact; this is a family status update, not a reassurance exercise, so don't add comforting language that isn't grounded in what was actually said at the visit.

WHAT NOT TO DO
Do not turn this into a to-do list for the caregiver themselves — that's a separate document. Do not speculate about what a lab result or scan finding might mean beyond what the notes already say the doctor concluded.

OUTPUT FORMAT
1. One-line visit summary (who, with whom, why).
2. What happened / what was said (bulleted, paraphrases marked as such).
3. What changed (new meds, referrals, tests, dosage changes).
4. Pending decisions the family should weigh in on, tied to the dates given.
5. Terms to clarify with the doctor's office, if any.
6. A closing line stating plainly that this summary is a personal family record based on one caregiver's notes, not a medical record, and that any decision about care should be confirmed directly with the treating clinician.`,
    variables: [
      {
        name: 'patient_relationship',
        description: `Who the appointment was for and the caregiver's relationship to them.`,
        example: `My mother, 78, saw her cardiologist for a follow-up after a hospital stay in June.`,
        required: true,
      },
      {
        name: 'raw_visit_notes',
        description: `The caregiver's own notes or a transcript of a voice memo recorded right after the visit.`,
        example: `Dr. Patel said the swelling in her ankles is 'much better than last time,' adjusted the water pill to a lower dose, wants a follow-up echo in 6 weeks, mentioned something about 'BNP levels' trending down.`,
        required: true,
      },
      {
        name: 'family_priorities',
        description: `What the family members receiving this actually care about knowing.`,
        example: `My brother wants to know if she's stable enough to travel for Thanksgiving; my sister wants the medication change in writing.`,
        required: true,
      },
      {
        name: 'pending_decisions',
        description: `Any decision the family needs to make or weigh in on, with relevant dates.`,
        example: `Whether to schedule the follow-up echo for the week of Sept 14 or wait until after the family visit.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`caregiving`, `patient-communication`, `family-caregiver`, `visit-summary`, `health-literacy`],
    whyItWorks: `The instruction to mark paraphrases as paraphrases rather than quotes directly counters a specific failure mode of language models summarizing informal notes: given a loosely worded fragment like "much better than last time," the model's default behavior is to smooth it into a confident, quote-like clinical statement, which misrepresents the certainty of what was actually said and can mislead family members who weren't present to judge tone or hedging themselves. Explicitly forbidding inference of diagnosis or severity from ambiguous notes matters because GPT-5.1 is otherwise very good at pattern-completing a plausible-sounding medical interpretation from partial information — a term like "BNP levels trending down" invites exactly the kind of confident elaboration a caregiver has no way to fact-check, so the prompt forces the gap to surface as a flagged unknown instead of a filled-in guess. Routing unclear abbreviations into a dedicated "terms to clarify" section rather than silently expanding them prevents a second, subtler failure: a wrong expansion of an abbreviation reads exactly as confidently as a correct one, and family members downstream have no signal to distinguish the two. The closing disclaimer is placed at the very end, after the substantive content, specifically so it reads as a genuine boundary statement about the document's status rather than legal boilerplate skimmed past at the top — its function is to make sure nobody in the family thread treats this caregiver's paraphrase as equivalent to the actual chart note.`,
    exampleOutput: `Visit summary: Mom saw Dr. Patel (cardiology) for a post-hospital follow-up on Aug 5.
What happened: Ankle swelling described as much improved since last visit. Water-pill dose was lowered. A follow-up echo was scheduled for 6 weeks out.
What changed: Furosemide dose reduced (exact new dose not captured in the notes — confirm with pharmacy). Echo ordered.
Terms to clarify: what "BNP levels trending down" means for her specific case.
This is a personal family summary based on one caregiver's notes, not a medical record — confirm any care decision directly with Dr. Patel's office.`,
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
    slug: 'healthcare-wellness-appointment-prep-question-list',
    category: 'healthcare-wellness',
    title: `Build a question list for a doctor's appointment that won't dissolve the second you sit down`,
    description: `Turns a jumble of symptoms, worries, and half-remembered questions into a short, prioritized list to bring into an appointment, ordered so the most important items get asked even if time runs short.`,
    promptText: `You are helping someone prepare for an upcoming medical appointment by turning their scattered notes into a short, prioritized question list they can actually use in the room.

APPOINTMENT TYPE AND REASON
{{appointment_reason}}

WHAT'S BEEN GOING ON
{{current_situation}}

QUESTIONS AND WORRIES SO FAR
{{raw_questions}}

TIME LIKELY AVAILABLE
{{appointment_length}}

RULES
1. Rank every question by what would actually change a decision if answered, not by how worried it makes the person — a question about a scary-sounding symptom that turns out to be minor still ranks below a question that affects an active treatment choice.
2. Cut every list down to fit realistically inside the stated appointment length, assuming roughly two minutes per substantive question once the clinician's own agenda is accounted for; put anything that doesn't fit into a clearly separate "if there's time" section instead of silently dropping it.
3. Rewrite vague worries into a specific, answerable question — "is this normal" becomes something the clinician can actually respond to in one exchange.
4. Where the raw notes describe a symptom, keep the description factual (what, when, how often, what makes it better or worse) and do not editorialize about what it might mean.
5. If the same underlying concern appears more than once in different words, merge it into one question instead of asking it twice.

OUTPUT FORMAT
Top questions (ranked, fits the stated time): numbered list, each one phrased as it would actually be asked out loud.
If there's time: a second short list.
One line at the end reminding the person to write down the clinician's actual answers during the visit, since this list is only meant to prepare for the conversation and is not a substitute for what the treating clinician tells them directly.`,
    variables: [
      {
        name: 'appointment_reason',
        description: `What kind of appointment this is and why it was scheduled.`,
        example: `15-minute follow-up with my primary care doctor after a knee injury three weeks ago.`,
        required: true,
      },
      {
        name: 'current_situation',
        description: `A factual rundown of symptoms or context relevant to the visit.`,
        example: `Swelling has gone down but there's still a clicking sound going up stairs, and I can't fully straighten the leg first thing in the morning.`,
        required: true,
      },
      {
        name: 'raw_questions',
        description: `Whatever questions or worries the person has jotted down, in whatever order they occurred to them.`,
        example: `Should I get an MRI? Is it okay to keep running? Why does it click? Is this going to need surgery? Can I go back to the gym next week?`,
        required: true,
      },
      {
        name: 'appointment_length',
        description: `How long the appointment is expected to run.`,
        example: `15 minutes`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`appointment-prep`, `patient-advocacy`, `question-list`, `health-literacy`, `primary-care`],
    whyItWorks: `Ranking by decision-relevance rather than by anxiety level is the core mechanism here, because left unguided a model asked to prioritize "worries" will over-weight whatever sounds most alarming in the raw text rather than whatever is most likely to change what the clinician actually does — a scary-sounding but low-stakes question about clicking joints will otherwise crowd out a question that genuinely affects a return-to-activity decision. The explicit two-minutes-per-question budget forces a real cutoff instead of an open-ended list that looks thorough on paper but is impossible to get through in a 15-minute slot, which is the single most common reason patients report leaving appointments having forgotten their most important question — it got buried in a long list rather than surfaced first. Rewriting vague worries into specific, answerable questions matters because "is this normal" invites a generic reassurance response from any clinician working quickly, whereas a specific version ("is a clicking sound going up stairs at three weeks post-injury expected, or does it need imaging") gets a real, checkable answer in the same amount of time. Merging duplicate concerns keeps the list from padding itself with restated variations, which otherwise eats into the same fixed time budget the ranking rule is trying to protect. The closing instruction to write down the clinician's actual answers reinforces that this list is scaffolding for the conversation, not a replacement for whatever the treating clinician says once asked.`,
    exampleOutput: `Top questions (fits 15 min):
1. Is the clicking when going up stairs expected at three weeks, or does it warrant an MRI now?
2. Is running safe to resume, and if not yet, what's the timeline?
3. Based on today's exam, does this look like something surgery would ever be on the table for?
If there's time: Is the gym (non-running exercise) okay to resume next week?
Remember to write down the doctor's actual answers — this list is only meant to prepare for the conversation.`,
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
    slug: 'healthcare-wellness-lab-results-plain-language-summary',
    category: 'healthcare-wellness',
    title: `Translate a lab report full of jargon into plain language without inventing a diagnosis`,
    description: `Rewrites a lab or imaging report's dense terminology into plain-language explanations of what each value or line actually measures — strictly stopping short of interpreting what the results mean for the patient's specific situation.`,
    promptText: `You are translating the technical language on a lab or imaging report into plain English, one line at a time, for someone who wants to understand what they're reading before their follow-up call with the ordering clinician.

REPORT TEXT OR VALUES
{{report_content}}

WHAT THE PERSON ALREADY UNDERSTANDS
{{existing_knowledge}}

SPECIFIC LINES THEY'RE CONFUSED BY
{{confusing_terms}}

HARD RULE — DO NOT CROSS THIS LINE
For every line or value in the report, explain only what it measures and, if the report itself states a reference range, where the value falls relative to that range in neutral terms (within range, above range, below range). Do not state or imply what an out-of-range value means for this specific person's health, do not suggest a likely cause, and do not use words like "concerning," "good news," or "nothing to worry about" — those are judgments only the ordering clinician can make with the full clinical picture, which this report alone doesn't contain. If a term appears without an accompanying reference range in the report, say plainly that no range was given rather than supplying a general population range from outside knowledge, since ranges vary by lab and by the person's specific circumstances.

HOW TO WRITE EACH EXPLANATION
Use one short paragraph per value or finding: what it is, in plain language; what it's generally used to help assess, one sentence, kept general rather than specific to this person; and where this result falls against the report's own stated range, stated neutrally. Skip explanation for anything the person already says they understand, and give the most detail to whatever's listed under confusing terms.

OUTPUT FORMAT
1. A short glossary-style list, one entry per value or finding, plain language, neutral, in the order the report lists them.
2. A closing section titled "Questions worth asking the ordering clinician," turning any out-of-range or unclear item into a specific question the person can ask, rather than an answer this document is supplying itself.
3. One final line stating clearly that this is a plain-language reading aid, not an interpretation of what the results mean, and that only the ordering clinician can explain what these results mean for this person specifically.`,
    variables: [
      {
        name: 'report_content',
        description: `The raw text or values from the lab or imaging report.`,
        example: `TSH: 6.8 mIU/L (ref 0.4-4.0). Free T4: 1.1 ng/dL (ref 0.8-1.8). Vitamin D, 25-OH: 22 ng/mL (ref 30-100).`,
        required: true,
      },
      {
        name: 'existing_knowledge',
        description: `What the person says they already understand, so the summary doesn't over-explain.`,
        example: `I know vitamin D is about bone health and sunlight, but I have no idea what TSH or T4 measure.`,
        required: false,
      },
      {
        name: 'confusing_terms',
        description: `Specific lines or terms the person flagged as confusing.`,
        example: `What does TSH actually stand for and measure, and why does the range look different from Free T4's range?`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`lab-results`, `health-literacy`, `patient-education`, `plain-language`, `medical-jargon`],
    whyItWorks: `The explicit ban on words like "concerning" or "nothing to worry about" targets a very specific and common model behavior: when a language model is shown an out-of-range lab value, its default instinct — trained on medical text where out-of-range values are usually discussed alongside their clinical significance — is to append an implied severity judgment even when only asked to define the term, because definition and interpretation are rarely separated in the source material it learned from. Forcing the explanation to stop at "what it measures" and "where it falls against the report's own stated range" breaks that habitual pairing and keeps the tool inside its actual competence, which is language translation, not clinical judgment that depends on symptoms, history, and other results the report alone doesn't contain. Refusing to backfill a missing reference range from general population data closes a subtler risk: lab reference ranges vary meaningfully by lab, by assay method, and by patient population (age, sex, pregnancy status), so a plausible-looking generic range presented as if it were this report's own range could make a genuinely normal result look abnormal or vice versa. Converting every out-of-range or unclear item into a question for the ordering clinician, rather than leaving it as a flat statement, keeps the deliverable oriented toward the actual conversation that needs to happen, and the closing disclaimer is stated in terms of what the document is (a reading aid) rather than generic boilerplate, which keeps it from being skimmed as filler.`,
    exampleOutput: `TSH (thyroid-stimulating hormone): a hormone that signals the thyroid gland to produce thyroid hormone. This report's value is above the stated reference range.
Free T4: the active thyroid hormone TSH regulates. This value is within the stated reference range.
Questions worth asking: My TSH is above range but my Free T4 is within range — what does that combination usually get checked next for?
This is a plain-language reading aid, not an interpretation of these results — only the ordering clinician can explain what they mean for you specifically.`,
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
    slug: 'healthcare-wellness-medication-question-list-for-pharmacist',
    category: 'healthcare-wellness',
    title: `Turn a new prescription and a messy medicine cabinet into a tight question list for the pharmacist`,
    description: `Cross-references a newly prescribed medication against a person's existing medications and habits to produce a short, specific list of questions worth asking the pharmacist at pickup — never an assessment of whether the combination is actually safe.`,
    promptText: `You are helping someone prepare specific questions to ask their pharmacist about a new prescription, given what else they're currently taking.

NEW PRESCRIPTION
{{new_medication}}

CURRENT MEDICATIONS AND SUPPLEMENTS
{{current_medications}}

RELEVANT HABITS OR CONDITIONS
{{relevant_context}}

SPECIFIC CONCERNS ALREADY IN MIND
{{existing_concerns}}

WHAT TO DO
Look at the new medication next to everything already listed and identify categories of question worth raising — timing relative to other doses, whether to take with or without food, anything in the person's habits (alcohol use, grapefruit, an existing supplement) that commonly comes up as a question for this kind of medication in general terms — but do not state that an interaction exists or assess risk yourself; turn every one of these into a direct question for the pharmacist to answer, phrased so it can be answered in one exchange at the counter. If the person's existing concerns already cover something you'd otherwise raise, don't repeat it — just sharpen the phrasing if it's vague. Note anything on the list that would specifically benefit from being asked before leaving the pharmacy rather than looked up later, and mark those as priority.

WHAT NOT TO DO
Do not name a specific interaction as fact, do not say a combination is "fine" or "risky," and do not suggest stopping, skipping, or adjusting any dose — all of that is the pharmacist's or prescriber's call, not something to resolve here. Do not pad the list with generic questions that apply to any medication ("what are the side effects") unless the person's context makes that question specifically relevant.

OUTPUT FORMAT
1. Priority questions — ask before leaving the pharmacy (numbered, phrased as spoken questions).
2. Worth asking if there's time.
3. One closing line stating this list is meant to prompt a conversation with a licensed pharmacist or prescriber, and that no interaction, risk, or dosing decision should be assumed from this list alone.`,
    variables: [
      {
        name: 'new_medication',
        description: `The newly prescribed medication and its stated purpose.`,
        example: `Prescribed metronidazole for a dental infection, 7-day course.`,
        required: true,
      },
      {
        name: 'current_medications',
        description: `Everything the person is currently taking, prescription or otherwise.`,
        example: `Daily warfarin for a heart condition, a multivitamin, and occasional ibuprofen for headaches.`,
        required: true,
      },
      {
        name: 'relevant_context',
        description: `Habits or conditions that might matter for how the new medication is taken.`,
        example: `I have two glasses of wine most weekends and I'm going out of town for a wedding during the course.`,
        required: false,
      },
      {
        name: 'existing_concerns',
        description: `Anything the person is already specifically worried about.`,
        example: `I've heard this antibiotic and alcohol don't mix well.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`medication-safety`, `pharmacist-questions`, `patient-advocacy`, `prescription`, `health-literacy`],
    whyItWorks: `The instruction to raise categories of question rather than assert an interaction directly addresses the highest-stakes failure mode in this whole prompt: a language model asked to compare two medications will often produce a confident-sounding interaction claim that is either outdated, missing a dosage-dependent nuance, or simply wrong for this specific formulation, and a patient acting on that claim instead of a pharmacist's actual lookup against current drug-interaction databases is a realistic harm path. Converting every candidate concern into a question rather than a statement keeps the output structurally incapable of being mistaken for clinical advice, because a question has no truth value to be wrong about — it just directs attention to the right place, which is exactly what the pharmacist's actual professional tool (real-time interaction-checking software tied to the person's full medication history) is built to resolve. Flagging which questions specifically benefit from being asked before leaving the pharmacy — rather than treating the whole list as equally deferrable — reflects a real practical distinction: a timing or food-interaction question is often quick and best resolved at the counter, while a general side-effect question can wait, so the priority split makes the list usable in the actual two-minute window most people get with a pharmacist. Suppressing generic filler questions unless the specific context makes them relevant keeps the list short enough to actually get through in that window, which matters more here than looking exhaustive.`,
    exampleOutput: `Priority questions — ask before leaving the pharmacy:
1. Does metronidazole need to be spaced apart from my warfarin dose, or can they be taken together?
2. Is alcohol something to avoid entirely during this course, or just in large amounts?
Worth asking if there's time:
3. Does this need to be taken with food?
This list is meant to prompt a conversation with your pharmacist — no interaction, risk, or dosing decision should be assumed from it alone.`,
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
    slug: 'healthcare-wellness-symptom-timeline-organizer',
    category: 'healthcare-wellness',
    title: `Turn weeks of scattered symptom notes into a timeline a doctor can actually read in one glance`,
    description: `Organizes loose, chronologically messy symptom notes — texts to yourself, app logs, memory fragments — into a clean timeline with pattern flags, built for handing to a clinician rather than for self-diagnosing.`,
    promptText: `Symptom notes rarely arrive in order. You are organizing a person's scattered symptom entries into a clean chronological timeline they can hand to a clinician, without interpreting what the pattern means medically.

RAW SYMPTOM NOTES (in whatever order they were captured)
{{raw_symptom_notes}}

SYMPTOM OR SYMPTOMS BEING TRACKED
{{tracked_symptoms}}

RELEVANT CONTEXT (medications, cycle, activity, sleep — whatever might correlate)
{{context_factors}}

WHAT THE UPCOMING VISIT IS FOR
{{visit_purpose}}

STEP 1 — REORDER
Pull every dated or datable entry from the raw notes into strict chronological order. If an entry has no clear date, place it in a separate "undated entries" list rather than guessing where it belongs.

STEP 2 — NORMALIZE
For each entry, note what was reported (severity in the person's own words, duration, what if anything was happening around the same time from the context factors) without upgrading vague language into clinical terms it didn't use — if the note says "bad," keep it as "bad," don't convert it to a numeric severity scale that wasn't in the original.

STEP 3 — FLAG PATTERNS, DON'T EXPLAIN THEM
If a pattern is visible directly in the data — entries cluster around a particular time of day, day of cycle, or day after a specific activity — state the pattern as an observation ("occurred on 4 of the 5 days logged after evening exercise") without proposing why it might be happening. Do not suggest a trigger, cause, or diagnosis, even a tentative one.

STEP 4 — FLAG GAPS
Note any stretch of time with no entries, since a clinician will want to know whether that means symptom-free or simply not logged.

OUTPUT FORMAT
1. Chronological timeline table: date, what was reported, relevant context noted alongside it.
2. Undated entries, separately.
3. Observed patterns (data only, no proposed explanation).
4. Logging gaps.
5. A closing line noting this timeline is an organizational aid built from the person's own notes, and that any pattern shown here needs the treating clinician's interpretation, not a conclusion drawn from the log alone.`,
    variables: [
      {
        name: 'raw_symptom_notes',
        description: `The unsorted notes, in whatever form they were originally captured.`,
        example: `Aug 2: bad headache evening. Forgot to log Aug 3-4. felt fine most of last week. Aug 1 - dull headache after gym. headache again July 30 evening, took ibuprofen.`,
        required: true,
      },
      {
        name: 'tracked_symptoms',
        description: `What symptom or symptoms are being tracked.`,
        example: `Recurring evening headaches.`,
        required: true,
      },
      {
        name: 'context_factors',
        description: `Anything that might correlate and is worth carrying alongside each entry.`,
        example: `I started a new pre-workout supplement three weeks ago and I've been sleeping less than usual.`,
        required: false,
      },
      {
        name: 'visit_purpose',
        description: `What the upcoming appointment is for, so the timeline is scoped appropriately.`,
        example: `First visit with a neurologist to discuss recurring headaches.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`symptom-tracking`, `patient-advocacy`, `appointment-prep`, `health-literacy`, `timeline`],
    whyItWorks: `The instruction not to upgrade vague self-reported language ("bad") into a numeric or clinical-sounding scale prevents a subtle distortion that language models introduce by default when asked to "organize" symptom data: normalizing loose language into structured severity scores makes the output look more rigorous than the underlying data actually is, and a clinician reading a fabricated 7/10 next to a headache the person only ever described as "bad" is being handed false precision. Separating observed patterns from proposed explanations is the load-bearing rule in this prompt — stating "occurred on 4 of 5 days after evening exercise" is a factual claim about the data itself, fully verifiable by rereading the log, whereas naming a trigger or cause requires clinical judgment about physiology, other conditions, and information the log doesn't contain, and GPT-5.1 will readily supply a plausible-sounding cause if not explicitly blocked from doing so, since pattern-plus-explanation is the default shape this kind of write-up takes in general text. Flagging logging gaps rather than treating silence as "symptom-free" matters because an absent entry is genuinely ambiguous — a clinician needs to know the difference between a good week and an unlogged week, and collapsing that distinction would misrepresent the actual frequency of the symptom. The undated-entries bucket keeps the chronological timeline itself trustworthy by refusing to force an uncertain placement into a false-precision date slot.`,
    exampleOutput: `Timeline:
Jul 30 (evening): headache, took ibuprofen.
Aug 1: dull headache after gym.
Aug 2 (evening): bad headache.
Undated entries: "felt fine most of last week" — no specific dates given.
Logging gaps: Aug 3-4 not logged.
Observed pattern: headaches reported on 2 of 3 logged days following gym/exercise sessions.
This timeline is an organizational aid built from your own notes — the pattern shown needs your neurologist's interpretation.`,
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
    slug: 'healthcare-wellness-patient-handout-plain-language',
    category: 'healthcare-wellness',
    title: `Draft a patient education handout a clinic can actually hand out without a physician rewriting every line`,
    description: `Produces a plain-language patient handout on a general condition or procedure for a clinic's own review and approval — written at a stated reading level, with every clinical claim marked for the reviewing clinician to verify rather than presented as settled fact.`,
    promptText: `You are drafting a general patient education handout for a clinic to review, edit, and approve before handing it to patients — not a document that goes out under your authorship, and not a substitute for the reviewing clinician's own clinical judgment about what to include.

TOPIC AND HANDOUT PURPOSE
{{handout_topic}}

INTENDED READING LEVEL / AUDIENCE
{{reading_level}}

WHAT THE CLINIC WANTS COVERED
{{content_scope}}

WHAT TO EXPLICITLY LEAVE OUT
{{exclusions}}

DRAFTING RULES
Write at the stated reading level using short sentences, common words over clinical jargon, and a defined term the first time any necessary medical word appears. Structure the handout around what a patient actually needs to decide or do — what this is, what to expect, what to watch for, when to call the clinic — rather than a textbook-style explanation of mechanism for its own sake. Every specific clinical claim (a statistic, a typical timeline, a specific drug name or dose, a described risk) must be written as a placeholder for the reviewing clinician to confirm or fill in rather than stated as settled fact you are asserting — write it as "[clinic to confirm: typical timeframe]" rather than inventing a plausible-sounding number, since a wrong number in a handout that looks authoritative is worse than an obvious blank. Keep the tone calm and direct without minimizing anything the clinic scope asked to be covered — don't soften a genuine warning sign into vaguer language to sound gentler.

WHAT NOT TO DO
Do not present this as if it were a finished, clinically-approved document — it is a draft. Do not include a specific named statistic, study finding, or drug dosage as fact anywhere in the draft.

OUTPUT FORMAT
1. Handout draft, formatted with clear headers (What this is / What to expect / Warning signs — call us if / Everyday questions).
2. A separate list of every placeholder inserted, so the reviewing clinician can find and resolve each one quickly.
3. A closing line, to appear on the handout itself, stating that this is general information reviewed and approved by the clinic's own clinicians, and is not a substitute for individual medical advice — with a note to the clinic that this exact line should be adjusted to match their own approved disclaimer language before use.`,
    variables: [
      {
        name: 'handout_topic',
        description: `The general condition, procedure, or topic the handout covers.`,
        example: `What to expect after an outpatient knee arthroscopy.`,
        required: true,
      },
      {
        name: 'reading_level',
        description: `The intended reading level and audience for the handout.`,
        example: `6th-grade reading level, adult patients, English as a possible second language for some.`,
        required: true,
      },
      {
        name: 'content_scope',
        description: `What the clinic specifically wants the handout to address.`,
        example: `Pain management expectations, when to resume walking/driving, and clear signs of infection to watch for.`,
        required: true,
      },
      {
        name: 'exclusions',
        description: `Anything the clinic wants deliberately left out of this particular handout.`,
        example: `Don't get into physical therapy exercises — that's a separate handout from the PT team.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`patient-education`, `health-literacy`, `clinical-handout`, `plain-language`, `content-drafting`],
    whyItWorks: `Forcing every specific clinical claim into an explicit, labeled placeholder rather than letting the model state a plausible number as fact is the central safeguard here, because a language model asked to draft "what to expect after knee arthroscopy" will readily generate a specific-sounding but unverified statistic or timeline that reads with the same confident tone as something the clinic actually vetted — and a wrong number embedded in an otherwise well-formatted, professional-looking handout is far more dangerous than an obviously blank field, since clinic staff are far less likely to catch it in review. Structuring the handout around decisions and actions (what to expect, when to call) rather than mechanism-first explanation reflects how patients actually use these documents under stress or discomfort — they're scanning for "is what I'm feeling normal" and "when do I need to act," not reading linearly for background education, so burying the warning-signs section under general pathophysiology defeats the handout's actual purpose. The instruction against softening a genuine warning sign to sound gentler exists because plain-language rewriting has a real failure mode where clarity gets traded for a warmer tone, and a hedged warning sign is a worse outcome than a blunt one. Framing the closing disclaimer as something the clinic must adjust to match its own approved language — rather than a fixed boilerplate line — keeps the deliverable honest about its own status: a draft awaiting the clinic's actual clinical sign-off, not a finished patient-facing document.`,
    exampleOutput: `What to expect: Most people can walk with crutches the same day, though [clinic to confirm: typical timeframe] before walking without support varies by procedure extent.
Warning signs — call us if: your knee becomes hot, red, or swollen well beyond the surgical area, or you develop a fever.
Placeholders to resolve: typical timeframe for walking unassisted; typical return-to-driving window; pain medication schedule.
[Clinic-approved disclaimer to be inserted here before distribution.]`,
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
    slug: 'healthcare-wellness-discharge-instructions-checklist',
    category: 'healthcare-wellness',
    title: `Turn dense hospital discharge paperwork into a checklist someone can actually follow at home`,
    description: `Converts multi-page discharge paperwork into a short, dated checklist of medications, follow-ups, and restrictions — written for the patient or caregiver managing recovery at home, with every clinical instruction preserved exactly as written rather than reworded.`,
    promptText: `Hospital discharge paperwork is usually several pages of dense text covering medications, follow-ups, and restrictions all mixed together. You are converting it into a short, usable checklist for the patient or their caregiver to follow at home, changing nothing about the actual medical content.

DISCHARGE PAPERWORK TEXT
{{discharge_text}}

WHO WILL BE FOLLOWING THIS AT HOME
{{home_caregiver_situation}}

DISCHARGE DATE
{{discharge_date}}

RULES
Extract every medication instruction, follow-up appointment, activity restriction, and "call us if" warning sign exactly as the paperwork states it — do not reword a dosage, a restriction, or a warning sign in a way that changes its meaning, even slightly, since these are the actual clinical instructions and this checklist's only job is to make them easier to track, not to reinterpret them. Where the paperwork gives a relative timeframe ("in 3-5 days," "for the next week"), convert it to an actual calendar date using the discharge date given, and show both the original wording and the calculated date side by side so nothing is lost if the calculation needs checking. Group everything by what it's for (medications, follow-up appointments, activity restrictions, warning signs) rather than by the order it appeared in the paperwork, since the original document's order is usually determined by hospital forms, not by what's most useful to track day to day. If any instruction in the paperwork is illegible, contradictory, or unclear from the text provided, list it separately as something to call the discharging facility to clarify rather than guessing at the intended meaning.

WHAT NOT TO DO
Do not summarize a warning sign into vaguer or shorter language that drops specificity. Do not add any instruction, restriction, or piece of advice that wasn't in the original paperwork, even if it seems like standard practice.

OUTPUT FORMAT
1. Medications: name, dose, timing, and any special instructions, exactly as written.
2. Follow-up appointments: what, with whom, and the calculated date alongside the original wording.
3. Activity restrictions: what, until when (calculated date alongside original wording).
4. Call the facility immediately if: every warning sign, verbatim.
5. Unclear items to call and confirm.
6. A closing line stating this checklist reorganizes the discharging facility's own instructions and does not replace them — the original paperwork should be kept and referred to if anything here is in question.`,
    variables: [
      {
        name: 'discharge_text',
        description: `The raw text of the discharge paperwork, or a description of its contents.`,
        example: `Take amoxicillin 500mg three times daily for 7 days. No heavy lifting over 10 lbs for 2 weeks. Follow up with Dr. Reyes in 5-7 days. Call us or go to the ER if you develop a fever over 101F, redness spreading from the incision, or the wound reopens.`,
        required: true,
      },
      {
        name: 'home_caregiver_situation',
        description: `Who will actually be managing this checklist day to day.`,
        example: `My husband will be tracking my medications and appointments while I recover from surgery.`,
        required: true,
      },
      {
        name: 'discharge_date',
        description: `The actual date of discharge, used to convert relative timeframes into real dates.`,
        example: `August 11, 2026`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`hospital-discharge`, `caregiving`, `patient-safety`, `checklist`, `recovery-planning`],
    whyItWorks: `The rule against rewording any dosage, restriction, or warning sign — even slightly — exists because discharge instructions are precise clinical language where a synonym swap can quietly change meaning: "no heavy lifting over 10 lbs" restated loosely as "take it easy with lifting" removes the actual threshold a caregiver needs to enforce, and a model asked to "simplify" text will do exactly that kind of lossy paraphrase by default unless explicitly told the content itself is off-limits for rewording. Converting relative timeframes into calculated calendar dates, while keeping the original wording visible alongside the calculation, solves a real and common home-recovery failure — "follow up in 5-7 days" is easy to lose track of once a person is managing pain and medication schedules, but a wrong date silently substituted for the original phrase with no way to check the math is worse than the ambiguity it replaced, so showing both lets an error be caught rather than trusted blindly. Reorganizing by category instead of preserving the document's original order reflects that hospital discharge forms are typically laid out to satisfy documentation and billing requirements, not to be read linearly by an exhausted caregiver managing several concerns at once — grouping by "medications" versus "warning signs" matches how the information actually gets used day to day. Routing illegible or contradictory content into a separate "call to confirm" bucket rather than silently resolving it prevents the model from guessing at clinical intent it has no authority to guess at, which is exactly the kind of gap-filling behavior that turns a helpful reorganization into a genuine safety risk if left unchecked.`,
    exampleOutput: `Medications: Amoxicillin 500mg, 3x daily, for 7 days (as written).
Follow-up: Dr. Reyes, in 5-7 days (original wording) = Aug 16-18, 2026 (calculated from Aug 11 discharge).
Activity restrictions: No lifting over 10 lbs, for 2 weeks (original wording) = through Aug 25, 2026.
Call the facility immediately if: fever over 101F, redness spreading from the incision, or the wound reopens (verbatim).
This checklist reorganizes the discharging facility's own instructions and does not replace them.`,
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
    slug: 'healthcare-wellness-clinical-note-draft-assist',
    category: 'healthcare-wellness',
    title: `Turn dictated encounter notes into an organized clinical note draft awaiting your own sign-off`,
    description: `For clinicians turning their own dictated or shorthand encounter notes into a structured draft note — every clinical judgment stays exactly as dictated, with the draft explicitly flagged as unsigned and requiring the clinician's own review before it enters the chart.`,
    promptText: `You are helping a clinician convert their own dictated or shorthand notes from a patient encounter into an organized draft note — this draft is for the clinician's own review and sign-off, not a finished chart entry, and every clinical judgment in it comes from the clinician's own dictation, not from you.

DICTATED / SHORTHAND NOTES
{{dictated_notes}}

ENCOUNTER TYPE
{{encounter_type}}

PREFERRED NOTE STRUCTURE
{{note_structure}}

ABBREVIATIONS OR SHORTHAND SPECIFIC TO THIS CLINICIAN'S PRACTICE
{{practice_shorthand}}

RULES
Organize the dictated content into the requested structure without adding a single clinical assessment, differential, or plan element that wasn't stated in the dictation — your job is reorganization and clarity, not clinical contribution. Expand shorthand only where the clinician has told you what it means in the practice_shorthand field; leave anything else exactly as dictated rather than guessing at an expansion, and flag it in a separate list. Preserve the clinician's own clinical language and terminology choices rather than substituting your own phrasing for a clinical judgment call, even if a different phrasing seems more standard — this is their note, not a rewrite of their thinking. If the dictation is ambiguous about which section something belongs in (an observation that could be exam finding or assessment depending on context), place it in the section it reads most literally as, and flag the ambiguity rather than silently resolving it in either direction.

WHAT NOT TO DO
Do not add a diagnosis, differential item, medication, or follow-up instruction that wasn't in the dictation, even if it would typically be expected for this kind of encounter. Do not smooth over an incomplete thought in the dictation by finishing it yourself.

OUTPUT FORMAT
1. Draft note in the requested structure, using only content from the dictation.
2. Shorthand left unexpanded, flagged for the clinician to confirm or expand themselves.
3. Ambiguous placements flagged with a one-line note on why.
4. A header and footer line on the draft itself stating: "DRAFT — unsigned, pending clinician review. Not a final chart entry."`,
    variables: [
      {
        name: 'dictated_notes',
        description: `The clinician's own raw dictated or shorthand notes from the encounter.`,
        example: `pt c/o RLQ pain x2d, no fever, appetite dec. exam soft nontender except mild RLQ tenderness no rebound. plan cbc, us abd, f/u results tomorrow`,
        required: true,
      },
      {
        name: 'encounter_type',
        description: `What kind of encounter this was.`,
        example: `Urgent care visit, adult, abdominal pain.`,
        required: true,
      },
      {
        name: 'note_structure',
        description: `The note format the clinician wants the draft organized into.`,
        example: `Standard SOAP format.`,
        required: true,
      },
      {
        name: 'practice_shorthand',
        description: `Shorthand specific to this clinician's own practice that the model should be told how to expand.`,
        example: `'f/u' means follow-up, 'us abd' means abdominal ultrasound, 'c/o' means complains of.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`clinical-documentation`, `note-drafting`, `soap-note`, `clinician-workflow`, `medical-scribe`],
    whyItWorks: `The hard rule against adding any clinical content not present in the dictation is what keeps this tool inside a documentation-formatting role rather than drifting into clinical decision support, which matters because a language model organizing an abdominal-pain encounter has more than enough pattern knowledge to "helpfully" suggest a differential or a typical next step — exactly the kind of unsolicited addition that could get silently absorbed into a signed chart note if the clinician is reviewing quickly and the added line reads plausibly. Only expanding shorthand the clinician has explicitly defined, rather than the model's own best guess at common medical abbreviations, protects against a subtler risk: many abbreviations are genuinely ambiguous or practice-specific (a clinician's "f/u" might mean something different in a different specialty or even a different clinician's personal habit), and a wrong silent expansion inserted into clinical documentation is a data-integrity problem, not just a stylistic one. Flagging rather than resolving ambiguous section placement matters because the assessment/exam distinction is itself a clinical judgment in gray-area cases, and making that call invisibly would mean the tool quietly participated in clinical reasoning rather than just reformatting it. The mandatory unsigned/draft header and footer is there specifically so this text can never be mistaken for or accidentally copy-pasted as a finalized, attested chart entry — it has to carry that status visibly at both ends of the document, not just in a cover note that could get stripped off.`,
    exampleOutput: `DRAFT — unsigned, pending clinician review. Not a final chart entry.
S: Patient reports right lower quadrant pain for 2 days, no fever, decreased appetite.
O: Abdomen soft, nontender except mild RLQ tenderness, no rebound.
A: [not stated in dictation — clinician to add]
P: CBC, abdominal ultrasound, follow-up with results tomorrow.
Shorthand left unexpanded: none — all terms matched practice_shorthand provided.
DRAFT — unsigned, pending clinician review. Not a final chart entry.`,
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
    slug: 'healthcare-wellness-soap-note-draft-from-visit-notes',
    category: 'healthcare-wellness',
    title: `Force loose visit notes into a proper SOAP structure without smuggling in a single unstated assessment`,
    description: `Restructures a clinician's free-text visit notes into Subjective, Objective, Assessment, and Plan sections strictly using only what was written — designed as an unsigned draft the clinician edits and finalizes themselves.`,
    promptText: `Take the following free-text visit notes and restructure them into SOAP format. Nothing else — no added clinical content, no smoothing, no filling gaps.

FREE-TEXT NOTES
{{free_text_notes}}

PATIENT CONTEXT (age, reason for visit only, no other clinical detail needed)
{{visit_context}}

HOW TO SORT CONTENT INTO EACH SECTION
Subjective: anything reported in the patient's own words or paraphrased complaint, history, or symptom description — nothing the clinician observed or measured.
Objective: anything measured, observed, or tested — vitals, exam findings, results — nothing inferred from those findings.
Assessment: only if the notes explicitly state a diagnosis, impression, or differential — if the notes don't contain one, write "Not stated in source notes — clinician to complete" rather than inferring one from the subjective and objective content, even if an assessment seems obvious from context.
Plan: only actions explicitly stated in the notes — tests ordered, medications prescribed, follow-up scheduled, referrals made.

If a piece of the free-text notes doesn't clearly belong to one section (a comment that mixes observation and interpretation in the same sentence), split it at the natural boundary and place each half where it belongs, noting the split rather than guessing which single section it fits.

OUTPUT FORMAT
S:
O:
A:
P:
Below the four sections, a short list of anything from the source notes you couldn't confidently place, for the clinician to resolve.
Mark the entire output, top and bottom, as: "UNSIGNED DRAFT — for clinician review and completion, not a final note."`,
    variables: [
      {
        name: 'free_text_notes',
        description: `The clinician's own free-text notes from the visit, in whatever order they were written.`,
        example: `45yo here for annual physical, feels well overall, mentions occasional lower back stiffness in the mornings, no numbness or radiation. BP 128/82, HR 72, otherwise unremarkable exam. Discussed weight loss goals, wants to start walking 3x/week. Ordered routine labs, f/u in 3 months.`,
        required: true,
      },
      {
        name: 'visit_context',
        description: `Basic context — age and reason for the visit — used only to label the note, not to infer clinical content.`,
        example: `45-year-old, annual physical exam.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`soap-note`, `clinical-documentation`, `clinician-workflow`, `note-drafting`, `ehr`],
    whyItWorks: `The rule that Assessment must default to "not stated — clinician to complete" rather than an inferred diagnosis is the single most important line in this prompt, because SOAP notes are exactly the kind of text a model has seen enormous volumes of during training, and it has a strong learned prior that a Subjective plus Objective section is almost always followed by a plausible Assessment — the model will readily generate one that sounds clinically reasonable given the symptoms described, and a fabricated assessment silently inserted into a note the clinician later signs without noticing is a direct path to a documentation error attributed to the wrong author. Splitting a sentence that mixes observation and interpretation at its natural boundary, rather than forcing the whole sentence into one section, respects the fact that clinicians genuinely do write notes this way in practice — a single sentence often contains both a measured finding and an interpretive comment — and silently choosing one section for the whole sentence would either lose the objective content or misrepresent an interpretation as a raw observation. Restricting patient context to age and visit reason only, rather than allowing broader clinical background into that field, keeps the reorganization task honestly scoped to what the free-text notes themselves contain, so nothing outside the clinician's own documentation can leak into the draft as if it had been part of the visit record. The unsigned-draft framing at both the top and bottom guards against exactly the failure mode of a note being copy-pasted into an EHR mid-review, before the clinician has completed the Assessment section the tool deliberately left blank.`,
    exampleOutput: `UNSIGNED DRAFT — for clinician review and completion, not a final note.
S: 45-year-old presents for annual physical, feels well overall. Reports occasional lower back stiffness in the mornings, no numbness or radiation.
O: BP 128/82, HR 72, exam otherwise unremarkable.
A: Not stated in source notes — clinician to complete.
P: Routine labs ordered, follow-up in 3 months.
Couldn't confidently place: discussion of weight-loss goals and plan to walk 3x/week — placed under Subjective as reported intent, flag if it belongs in Plan instead.
UNSIGNED DRAFT — for clinician review and completion, not a final note.`,
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
    slug: 'healthcare-wellness-patient-follow-up-message-draft',
    category: 'healthcare-wellness',
    title: `Draft a post-visit follow-up message that sounds like the clinic, not like a form letter`,
    description: `Writes a follow-up message to a patient after a visit or test result — checking in, confirming next steps, answering a routine question — for the clinician or clinic staff member to review and send under their own name.`,
    promptText: `Draft a follow-up message to a patient after a recent visit or result. This is a message the clinician or clinic staff member reviews and sends themselves — not something that goes out automatically or under your name.

WHO THIS IS TO AND WHY
{{message_purpose}}

KEY POINTS TO INCLUDE
{{key_points}}

TONE THE CLINIC WANTS
{{tone_preference}}

ANYTHING SENSITIVE TO HANDLE CAREFULLY
{{sensitive_content}}

HOW TO WRITE IT
Open by referencing the specific visit or result so the patient immediately knows what this is about, rather than a generic greeting. Cover the key points in the order the patient would need them — what's confirmed or resolved first, then anything requiring action from them, then how to reach the clinic with questions. If any key point involves a result or finding, state only what was given in the key points field, in the same terms — do not add interpretation, reassurance language, or severity framing that wasn't explicitly provided, since the person sending this message is the one qualified to characterize the finding, not this draft. Keep sentences short enough to be read on a phone screen. If sensitive content is flagged, handle it plainly and respectfully without being clinical to the point of feeling cold, but do not soften a factual point to the point of changing its meaning.

WHAT NOT TO DO
Do not invent next steps, reassurances, or interpretations beyond the key points given. Do not make the message sound automated — no "this is an automated message" framing, since a real person is sending it after review.

OUTPUT FORMAT
1. Subject line, if this is going by portal message or email.
2. Message body, ready for the sender to review, edit, and personalize before sending.
3. One bracketed note at the end (not part of the message itself) reminding the sender to confirm every clinical detail before sending, since this draft only reflects the key points supplied.`,
    variables: [
      {
        name: 'message_purpose',
        description: `Who the message is going to and the reason for it.`,
        example: `Patient who had bloodwork done last week; sending to share that results came back and next steps.`,
        required: true,
      },
      {
        name: 'key_points',
        description: `The exact facts or results to communicate, stated plainly by the sender.`,
        example: `Cholesterol panel results are back and within normal range. No action needed. Continue current diet and exercise routine. Next annual bloodwork in 12 months unless something changes.`,
        required: true,
      },
      {
        name: 'tone_preference',
        description: `The tone the clinic wants for this particular message.`,
        example: `Warm but brief — this patient prefers efficient communication.`,
        required: true,
      },
      {
        name: 'sensitive_content',
        description: `Anything in the message that needs careful, non-clinical-sounding handling.`,
        example: `N/A for this one — routine normal result.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`patient-communication`, `follow-up-message`, `clinic-workflow`, `portal-messaging`, `patient-experience`],
    whyItWorks: `Restricting the message to only the key points supplied, in the same terms, is what keeps this a communication-drafting tool rather than something making an independent clinical characterization: if a model is handed "cholesterol results back, within range" and asked to write a warm patient message, its default instinct is to add reassuring color ("great news, nothing to worry about here") that goes slightly beyond what was actually stated, and that small addition compounds badly when the same drafting pattern is reused for an abnormal result, where an unintended reassuring tone could actively undercut a warning the sender meant to convey. Ordering the content by what's resolved, then action items, then contact information reflects how people actually read short messages on a phone — they skim for whether they need to do anything before reading the full context, so front-loading resolved status and burying action items in paragraph three means they're more likely to be missed. The explicit ban on "automated message" framing matters for a specific reason: presenting this as automated would misrepresent the fact that a licensed clinician or staff member is reviewing and personally sending it, which is exactly the accountability structure that makes this drafting tool appropriate to use in the first place — it's a draft awaiting a real person's review, not a system generating patient-facing clinical communication unsupervised. The closing bracketed reminder is placed outside the message body itself so it never accidentally gets copy-pasted into what the patient actually receives.`,
    exampleOutput: `Subject: Your recent bloodwork results
Hi [Patient name], your cholesterol panel from last week is back and within normal range — no action needed on your end. Keep up your current diet and exercise routine, and we'll see you for your next annual bloodwork in about 12 months unless anything changes before then. Reach out anytime if you have questions.
[Reminder: confirm every clinical detail above matches the actual result before sending — this draft only reflects the key points you supplied.]`,
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
    slug: 'healthcare-wellness-care-plan-summary-for-family',
    category: 'healthcare-wellness',
    title: `Compress a multi-page care plan into a one-page summary the whole family can actually follow`,
    description: `Distills a long, clinical-language care plan into a one-page action summary for family members coordinating a loved one's care — organized by who does what and when, with the original plan preserved as the source of truth.`,
    promptText: `Families coordinating a relative's care often get a multi-page care plan full of clinical language that never gets fully read by anyone but the person managing it. You are compressing that plan into a one-page summary organized around who does what and when.

FULL CARE PLAN TEXT
{{care_plan_text}}

WHO'S INVOLVED IN CARE
{{family_roles}}

WHAT THE FAMILY KEEPS ASKING ABOUT
{{recurring_questions}}

RULES
Pull every actionable item from the plan — medications, therapies, appointments, dietary instructions, monitoring tasks — and assign each one to whichever listed family member's role it matches, based only on what the plan and the stated roles actually say; if it's unclear who's responsible for something, list it under "unassigned — needs a family decision" rather than guessing. Keep every clinical instruction's actual content unchanged — compress the surrounding language, not the substance of the instruction itself. Where the recurring family questions are directly answered somewhere in the plan, surface that answer explicitly near the top so it stops being re-asked; where a recurring question isn't answered anywhere in the plan, say so plainly instead of inferring an answer the plan doesn't actually give.

WHAT NOT TO DO
Do not shorten a specific instruction (a dose, a frequency, a restriction) in a way that changes what it requires. Do not answer a family question with anything beyond what the plan itself states, even if the answer seems like reasonable common sense.

OUTPUT FORMAT
1. One-page summary organized by family member/role, listing exactly what each person is responsible for and when.
2. Answers to the recurring questions, sourced directly from the plan, or flagged as not addressed in the plan.
3. Unassigned items needing a family decision.
4. A closing line stating that the full care plan remains the authoritative document, this is a coordination aid built from it, and any change to the plan itself needs to go through the care team that authored it.`,
    variables: [
      {
        name: 'care_plan_text',
        description: `The full text of the care plan being summarized.`,
        example: `Patient requires assistance with medication administration twice daily (morning and evening), physical therapy exercises 3x weekly per attached sheet, low-sodium diet per dietitian consult, weekly weight checks to monitor fluid retention, and monthly follow-up with cardiology.`,
        required: true,
      },
      {
        name: 'family_roles',
        description: `Who's involved in the person's care and what they've each taken on, or their availability.`,
        example: `Daughter lives nearby and handles daily visits; son lives out of state but manages finances and calls weekly; home health aide comes weekday mornings.`,
        required: true,
      },
      {
        name: 'recurring_questions',
        description: `Questions the family keeps re-asking that this summary should try to resolve.`,
        example: `Whose job is it to actually track the weekly weight checks, and does the home health aide handle the PT exercises or does someone else need to?`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`caregiving`, `care-coordination`, `family-caregiver`, `care-plan`, `health-literacy`],
    whyItWorks: `The rule against inferring who's responsible for an unassigned task addresses the most common real-world breakdown in family caregiving — a task with no clearly designated owner tends to get either duplicated or dropped entirely, and a model asked to organize a care plan by role will otherwise make a plausible-sounding assumption about who probably handles it, which papers over the actual coordination gap instead of surfacing it for the family to resolve deliberately. Compressing the language around an instruction while leaving its substance untouched matters for the same reason it matters in discharge instructions: "weekly weight checks to monitor fluid retention" compressed into "keep an eye on weight" quietly drops both the frequency and the clinical reason for the task, and a family member skimming a shortened summary has no way to recover what was lost unless the instruction's actual content was preserved exactly. Answering recurring family questions only when the plan itself actually answers them — and saying so plainly when it doesn't — prevents the summary from becoming a second, informal source of truth that quietly diverges from the plan the care team actually wrote; if the model filled an unanswered question with a reasonable-sounding guess, that guess could get treated as settled by a family member who never goes back to the original document. The closing line reasserting the full plan's authority exists because a one-page summary is deliberately lossy by design — it's meant to make the plan usable day to day, not to replace it as the record the care team should be consulted against when something changes.`,
    exampleOutput: `Daughter (daily visits): morning and evening medication administration; weekly weight checks (currently unassigned in the plan — needs a family decision on who tracks this).
Son (remote): monthly cardiology follow-up scheduling and confirming attendance.
Home health aide (weekday mornings): assistance with medication per the plan; PT exercises not explicitly assigned to the aide in the plan — needs confirmation from the PT team.
Recurring questions: Weekly weight tracking — not assigned to anyone in the plan as written; PT exercise responsibility — not addressed in the plan.
The full care plan remains the authoritative document — any change should go through the care team that authored it.`,
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
    slug: 'healthcare-wellness-health-article-plain-language-draft',
    category: 'healthcare-wellness',
    title: `Draft a general wellness article that reads like it was written by someone who actually cares about accuracy`,
    description: `Produces a plain-language, general-audience health or wellness article draft on a broad topic — kept deliberately general rather than personalized, with every specific claim marked for the reviewing editor or clinician to verify before publication.`,
    promptText: `You are drafting a general-audience wellness article for editorial review before publication — general information for a broad readership, never advice tailored to any one reader's situation, and every specific factual claim needs a human reviewer's sign-off before this goes live.

ARTICLE TOPIC
{{article_topic}}

TARGET PUBLICATION / AUDIENCE
{{publication_context}}

KEY ANGLE OR TAKEAWAY
{{key_angle}}

WORD COUNT TARGET
{{word_count}}

DRAFTING RULES
Write for a general reader with no assumed medical background, defining any necessary term in plain language the first time it appears. Keep every claim about a study finding, statistic, or specific health effect clearly hedged and marked for verification — write "[verify: specific statistic/study]" inline rather than inventing a plausible-sounding number, percentage, or named study, since a fabricated but confident-sounding statistic is the single most damaging thing a health article can contain. Frame every piece of general information as exactly that — general information that applies broadly, not personalized guidance — and avoid language that tells the reader what they specifically should do, favoring language about what's generally recommended or commonly understood instead. Build the article around the key angle given rather than trying to cover the topic exhaustively, since a focused article a reader finishes is worth more than an exhaustive one they abandon halfway through.

WHAT NOT TO DO
Do not include any specific statistic, study citation, or clinical claim as unverified fact — every one must be flagged. Do not write in a tone that implies personal medical authority ("in my clinical experience") since this is general content, not a byline claiming clinical credentials.

OUTPUT FORMAT
1. Headline options (2-3).
2. Article draft at the target word count, structured with subheadings.
3. A separate list of every claim flagged for verification, so an editor or reviewing clinician can check each one before publication.
4. A standard closing line for the article itself: this article is for general informational purposes and is not a substitute for professional medical advice; readers with specific health concerns should consult a qualified clinician.`,
    variables: [
      {
        name: 'article_topic',
        description: `The broad wellness or health topic the article covers.`,
        example: `Why sleep consistency might matter more than total sleep hours.`,
        required: true,
      },
      {
        name: 'publication_context',
        description: `Where this will run and who reads it.`,
        example: `Company wellness newsletter, read by employees across all departments, casual tone.`,
        required: true,
      },
      {
        name: 'key_angle',
        description: `The specific takeaway or angle the article should build around.`,
        example: `Going to bed and waking up at consistent times may matter as much as hitting a specific number of hours.`,
        required: true,
      },
      {
        name: 'word_count',
        description: `The target length for the article.`,
        example: `600 words`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`health-content`, `wellness-writing`, `content-drafting`, `editorial-review`, `plain-language`],
    whyItWorks: `The instruction to flag every specific statistic or study reference as "[verify]" rather than let the model produce one directly targets a well-documented failure mode: language models writing on health topics will generate plausible-sounding but unverifiable specifics — a percentage, a study name, an effect size — because the surrounding prose pattern strongly favors that kind of concrete-sounding detail, and readers cannot distinguish a fabricated statistic from a real one by tone alone since both are written with identical confidence. Framing content as general information rather than personalized guidance, and enforcing that through word choice ("generally recommended" instead of "you should"), keeps the article structurally honest about what it actually is — broad-audience content that necessarily can't account for an individual reader's medications, conditions, or circumstances — which matters because the moment an article starts issuing reader-specific imperatives, it's implicitly claiming to know things about the reader it has no way to know. Anchoring the draft to one key angle rather than exhaustive topic coverage is a genuine engagement mechanism, not just a stylistic preference — a focused wellness article that a reader actually finishes delivers its one accurate, verified point, while a broader piece that loses the reader halfway through delivers none of its content at all, verified or not. The separated verification list exists specifically so an editor reviewing a finished-looking draft doesn't have to hunt through prose for inline flags — every claim needing a real check is pulled into one place where it's actually likely to get checked before publication.`,
    exampleOutput: `Headline options: "Why the Time You Sleep Might Matter More Than How Long"; "Consistency, Not Just Hours: Rethinking Sleep"
Draft excerpt: Getting seven or eight hours matters, but going to bed and waking up at roughly the same time each day may be just as important for how rested you feel. [verify: specific statistic/study on sleep regularity and daytime alertness].
Flagged for verification: any specific study or percentage referenced regarding sleep-consistency effects.
This article is for general informational purposes and is not a substitute for professional medical advice; readers with specific health concerns should consult a qualified clinician.`,
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
    slug: 'healthcare-wellness-medical-terms-glossary-for-patients',
    category: 'healthcare-wellness',
    title: `Build a personal glossary of the medical terms scattered across your own chart or reports`,
    description: `Pulls every unfamiliar medical term out of a patient's own chart notes, reports, or after-visit summaries and defines each one in plain language, without ever explaining what a term means specifically for that patient's own case.`,
    promptText: `Build a plain-language glossary of medical terms found in the following document, for someone trying to understand their own chart or reports.

DOCUMENT TEXT
{{document_text}}

TERMS ALREADY UNDERSTOOD (skip these)
{{known_terms}}

PRIMARY GOAL FOR UNDERSTANDING THIS
{{understanding_goal}}

HOW TO BUILD THE GLOSSARY
Scan the document and pull out every term, abbreviation, or piece of jargon likely unfamiliar to someone without a medical background, skipping anything already listed as known. Define each term generally — what it means, what kind of thing it is (a condition, a measurement, a type of test, a body structure) — using general, textbook-level definitions, not an explanation of what that specific instance of the term means for this particular document or patient. If a term is ambiguous out of context (an abbreviation with more than one common meaning), give the most likely general meaning based on the surrounding text and note that it could mean something else if it doesn't fit. Organize entries alphabetically rather than in the order they appear in the document, since this is meant to function as a reference someone can come back to, not a linear read-through.

WHAT NOT TO DO
Do not explain what a term's presence in this specific document implies about the patient's condition, severity, or prognosis — that crosses from defining a word into interpreting a case, which isn't what a glossary is for. Do not skip a term because it seems minor; someone building a personal glossary benefits from completeness more than editorial judgment about what's worth defining.

OUTPUT FORMAT
Alphabetical glossary: term, plain-language definition, one line noting where in the document it appears (e.g., "appears in the assessment section") so the person can find it in context.
A closing line stating this glossary defines general medical vocabulary only and does not interpret what any of these terms mean for this person's own health — that requires the clinician who wrote or ordered the document.`,
    variables: [
      {
        name: 'document_text',
        description: `The chart notes, report, or after-visit summary containing the unfamiliar terms.`,
        example: `Impression: mild bilateral pes planus, no acute osseous abnormality. Recommend orthotics as needed, f/u PRN.`,
        required: true,
      },
      {
        name: 'known_terms',
        description: `Terms the person already understands, so the glossary doesn't waste space on them.`,
        example: `I already know what 'bilateral' means.`,
        required: false,
      },
      {
        name: 'understanding_goal',
        description: `What the person is ultimately trying to get out of understanding this document.`,
        example: `I want to understand my own foot X-ray report before a follow-up call with the podiatrist.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`health-literacy`, `medical-jargon`, `patient-education`, `glossary`, `plain-language`],
    whyItWorks: `The line between defining a term generally and interpreting what it means for this specific document is the entire safety mechanism of this prompt, and it's a genuinely fine line for a model to hold: asked to define "pes planus" in a document that also says "mild" and "as needed," the natural pull is to blend the general definition with an implicit read on how significant this particular finding is — a model will often slide from "pes planus means flat feet" into something like "this is a mild, not particularly concerning finding," which has quietly crossed from vocabulary into case interpretation using information (the surrounding words "mild," "as needed") that the person building a glossary didn't ask to have synthesized into a judgment. Alphabetizing rather than following document order reinforces that this is meant to be a standing reference tool, not a narrative walkthrough of the report — someone re-reading their chart six months later needs to look up one term quickly, not re-read the whole structure. Explicitly allowing ambiguous abbreviations to be flagged as possibly meaning something else, rather than picking one confident definition, matters because medical abbreviations are genuinely overloaded across specialties, and a wrong confident definition is worse than an honestly uncertain one since the reader has no independent way to catch the error. The instruction to define everything rather than exercise editorial judgment about what's "worth" defining keeps the tool from silently deciding what matters in someone else's own medical document, which isn't a call a glossary tool should be making on the patient's behalf.`,
    exampleOutput: `Bilateral: affecting both sides of the body (already known — skipped).
Osseous: relating to bone.
Pes planus: the medical term for flat feet, a condition where the arch of the foot is lower than typical. (Appears in the impression section.)
PRN: a common medical abbreviation meaning "as needed" — could occasionally appear with a different specific meaning depending on context, but this is the standard reading. (Appears in the recommendation section.)
This glossary defines general medical vocabulary only and does not interpret what these terms mean for your own health — that requires your podiatrist.`,
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
    slug: 'healthcare-wellness-wellness-habit-tracker-plan',
    category: 'healthcare-wellness',
    title: `Design a personal habit-tracking plan that survives the first bad week`,
    description: `Builds a realistic, personalized plan for tracking general wellness habits — sleep, hydration, movement, stress check-ins — designed around a person's actual schedule and past attempts at habit-tracking that didn't stick.`,
    promptText: `Build me a wellness habit-tracking plan around general habits I'm trying to build — general lifestyle habits, not a medical or clinical program, and not a substitute for guidance from a doctor if any of these habits relate to an actual health condition.

HABITS I WANT TO TRACK
{{target_habits}}

DAILY SCHEDULE REALITY
{{schedule_constraints}}

WHAT'S FAILED BEFORE
{{past_attempts}}

WHAT ACTUALLY MOTIVATES ME
{{motivation_style}}

BUILD THE PLAN AROUND THESE RULES
Design a tracking method that fits inside the schedule constraints given, not an idealized schedule — if mornings are chaotic, don't build a plan that assumes a calm morning routine. For each habit, name the specific, smallest version of it worth tracking daily (not the aspirational full version), since a habit stated too ambitiously is the most common reason tracking gets abandoned within two weeks. Directly address whatever caused past attempts to fail — if the past attempts note says tracking felt like a chore, don't just propose another spreadsheet; propose something structurally different. Match the check-in cadence and reward structure to the stated motivation style rather than a generic streak-counter approach, since not everyone is motivated by the same mechanism.

DO NOT DO THIS
Do not suggest a habit-tracking approach that requires more daily time or willpower than the schedule constraints can realistically support. Do not include specific health claims about what any of these habits will measurably do for the body — describe the habit and the tracking method, not a promised physiological outcome.

OUTPUT FORMAT
1. Habit-by-habit tracking plan: the specific minimum version to track, how, and how often.
2. Why this specific structure addresses what failed before.
3. A simple weekly check-in format.
4. A closing note: this is a general lifestyle plan, not medical guidance, and if any of these habits are tied to managing a diagnosed condition, the approach should be checked with the treating clinician first.`,
    variables: [
      {
        name: 'target_habits',
        description: `The general wellness habits the person wants to track.`,
        example: `Drinking more water, walking daily, and getting to bed by a consistent time.`,
        required: true,
      },
      {
        name: 'schedule_constraints',
        description: `The real shape of the person's day, not an idealized version.`,
        example: `Up at 6am to get kids ready, working 9-6 at a desk job, evenings are unpredictable depending on the kids.`,
        required: true,
      },
      {
        name: 'past_attempts',
        description: `What habit-tracking approaches this person has tried before and why they stopped.`,
        example: `Tried a habit-tracking app twice, stopped both times within two weeks because logging felt like homework.`,
        required: true,
      },
      {
        name: 'motivation_style',
        description: `What actually keeps this person engaged versus what doesn't.`,
        example: `I respond better to seeing progress visually than to streaks or reminders that feel naggy.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`wellness-habits`, `habit-tracking`, `personal-wellness`, `self-improvement`, `behavior-change`],
    whyItWorks: `Anchoring the plan to the smallest trackable version of each habit rather than its aspirational form directly counters the most common and well-documented reason self-directed habit plans collapse within two to three weeks: an ambitious daily target creates a binary pass/fail every single day, and a handful of missed days early on tends to trigger total abandonment rather than a scaled-back continuation, whereas a genuinely minimal version is easy enough to hit on a bad day that the habit survives the bad day instead of dying with it. Explicitly requiring the plan to address the stated reason a past attempt failed — rather than proposing a generically "better" version of the same mechanism — matters because "logging felt like homework" is a structural complaint about the tracking method itself, not about willpower, and a model that isn't forced to engage with that specific failure will default to recommending another daily-log-style app that fails for the identical reason. Matching cadence and reward structure to the person's stated motivation style rather than a one-size streak-counter reflects that habit-formation research finds meaningfully different people respond to different reinforcement mechanisms, and defaulting to whatever the most commonly discussed method is (streaks, reminders) ignores a preference the person already told you doesn't work for them. The closing note about checking with a treating clinician exists because general lifestyle habits like hydration or sleep timing can intersect with an actual medical condition or medication regimen in ways this general planning exercise has no visibility into.`,
    exampleOutput: `Water: track only "did I refill my bottle at my desk by 10am" — yes/no, once a day, not ounce counts.
Walking: track "did I take one walk today," any length, rather than a step-count target.
Bedtime: track "lights out within 30 minutes of target time" rather than an exact clock-time streak.
Why this fits: replaces the app-based daily log (which felt like homework) with a single visual weekly grid you fill in by hand — you said you respond better to seeing progress visually than to streaks.
This is a general lifestyle plan, not medical guidance — if any of these habits are tied to managing a diagnosed condition, check the approach with your doctor first.`,
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
    slug: 'healthcare-wellness-nutrition-question-list-for-dietitian',
    category: 'healthcare-wellness',
    title: `Prepare specific nutrition questions for a dietitian instead of generic diet questions`,
    description: `Converts a person's food habits, goals, and confusion into a sharp, specific list of questions for an actual registered dietitian consult — deliberately avoiding generating diet advice itself.`,
    promptText: `You are helping someone prepare for a consult with a registered dietitian by turning their current eating habits, goals, and points of confusion into a specific question list — you are not creating a diet plan or telling them what to eat.

CURRENT EATING HABITS
{{current_habits}}

GOAL FOR THIS CONSULT
{{consult_goal}}

CONFLICTING INFORMATION THEY'VE ENCOUNTERED
{{conflicting_info}}

RELEVANT HEALTH CONTEXT (conditions, medications, allergies — factual only)
{{health_context}}

HOW TO BUILD THE QUESTION LIST
Turn the stated goal into questions specific enough that a dietitian can give a concrete answer in the consult rather than a general lecture — "how should I eat healthier" becomes something anchored to this person's actual current habits and stated goal. Where the person has encountered conflicting information (two sources disagreeing on something), turn that directly into a question asking the dietitian to reconcile the specific conflict, rather than you resolving which source is right yourself. Where health context is given (a condition, medication, or allergy), generate questions about how that context should shape the eating pattern being discussed, without answering those questions yourself — the interaction between a specific health condition and dietary choices is exactly what needs a licensed professional's input, not a general answer. Group related questions together rather than listing them in the order they came up.

WHAT NOT TO DO
Do not recommend a specific diet, meal plan, macro target, or supplement. Do not resolve the conflicting information yourself by declaring one source correct — that's what the appointment is for.

OUTPUT FORMAT
1. Questions about the stated goal, grounded in current habits.
2. Questions asking the dietitian to reconcile the specific conflicting information encountered.
3. Questions about how the health context should shape recommendations.
4. A closing line noting this list is meant to make the consult more productive and does not itself contain dietary advice — any specific recommendation should come from the dietitian directly.`,
    variables: [
      {
        name: 'current_habits',
        description: `A factual description of what the person currently eats and when.`,
        example: `Skip breakfast most days, eat a large lunch around 1pm, snack a lot in the evening while working late.`,
        required: true,
      },
      {
        name: 'consult_goal',
        description: `What the person is hoping to get out of this consult.`,
        example: `I want more consistent energy through the afternoon and to stop the late-night snacking.`,
        required: true,
      },
      {
        name: 'conflicting_info',
        description: `Specific conflicting advice or claims the person has run into.`,
        example: `One article said skipping breakfast is fine if I'm not hungry, another said it wrecks my metabolism.`,
        required: false,
      },
      {
        name: 'health_context',
        description: `Any relevant condition, medication, or allergy that might affect dietary recommendations, stated factually.`,
        example: `I take metformin for prediabetes and I'm allergic to tree nuts.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`nutrition`, `dietitian-consult`, `patient-advocacy`, `question-list`, `health-literacy`],
    whyItWorks: `The rule against resolving conflicting nutrition claims directly is the central guardrail, because nutrition is a domain saturated with confident-sounding but genuinely conflicting popular claims, and a model asked to help someone "figure out" whether skipping breakfast is fine will readily pick a side and defend it persuasively — which feels helpful but substitutes the model's synthesis of general internet-level nutrition discourse for what should be an individualized answer from someone who can actually account for this person's metabolism, medication, and goals. Turning the health context into questions about how that context should shape recommendations, rather than answering those questions directly, matters specifically because the person mentioned taking metformin for prediabetes — a real drug-diet interaction consideration that a general-purpose model has no business resolving unprompted, since getting it wrong in a domain this consequential is a meaningfully different risk than getting a generic productivity tip wrong. Anchoring every question to the person's actual stated current habits rather than leaving them abstract is what makes the resulting consult productive at all: a dietitian can give a genuinely useful, specific answer to "given that I currently skip breakfast and snack heavily around 9pm while working late, what would you actually change first" in a way they can't to an unanchored "how do I eat better," which just produces the same generic lecture the person could have gotten anywhere. Grouping by topic rather than order-encountered keeps the list usable inside whatever limited time the actual consult allows.`,
    exampleOutput: `Questions about your goal: Given that I currently skip breakfast and snack heavily around 9pm while working late, what would you suggest changing first to help afternoon energy specifically?
Reconciling conflicting info: I've seen conflicting claims about whether skipping breakfast affects metabolism — what's the actual answer for someone with my current eating pattern?
Health context questions: Given that I take metformin for prediabetes, does my current meal timing (skipping breakfast, large 1pm lunch) matter for how the medication works?
This list is meant to make the consult more productive and does not itself contain dietary advice — any specific recommendation should come from the dietitian directly.`,
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
    slug: 'healthcare-wellness-exercise-planner-progressive-program',
    category: 'healthcare-wellness',
    title: `Build a progressive exercise program that adjusts to a real injury history instead of a generic template`,
    description: `Turns a person's current activity level, time budget, and past injuries into a phased, adjustable exercise program with built-in checkpoints for pain or fatigue, plus a plain caveat that it isn't a substitute for a clinician's sign-off.`,
    promptText: `You are drafting a phased exercise program for one specific person, not a generic "beginner workout plan" pulled from a template. The program has to account for what they can actually do this week, not an idealized version of them.

CURRENT ACTIVITY LEVEL
{{current_activity_level}}

GOAL
{{primary_goal}}

TIME AND EQUIPMENT AVAILABLE
{{time_and_equipment}}

RELEVANT INJURY OR HEALTH HISTORY
{{injury_or_health_history}}

WEEKS TO PLAN
{{program_length_weeks}}

STRUCTURE RULES
Build the program in phases, not a flat repeating week — each phase should progress load, duration, or complexity by a small, named increment from the phase before it, and state explicitly what triggers moving to the next phase (for example, completing a phase without pain above a stated threshold, not just "after two weeks"). For every phase, name at least one modification for the injury or health history given, rather than writing the ideal version of an exercise and leaving the person to guess how to adapt it themselves. Build in an explicit checkpoint after every phase asking the person to rate soreness, pain location, and energy, and state what changes if the answer is worse than the phase before (regress the load, extend the phase, or stop and check with a clinician) rather than assuming progress is always safe to continue. Do not invent a specific injury mechanism, rehab timeline, or clinical claim about what is or is not safe for the named condition — where the injury history matters to a specific exercise choice, say so and flag it as something to confirm with a physical therapist or physician rather than asserting it yourself.

MANDATORY DISCLAIMER
Open the program with a short, plain-language note that this is a general fitness planning aid, not a medical or physical therapy assessment, and that anyone with an existing injury, diagnosed condition, or recent surgery should have this reviewed by a physician or physical therapist before starting, especially the phases involving load progression.

OUTPUT FORMAT
1. The disclaimer, first, in plain language.
2. A phase-by-phase table: phase name, duration, sessions per week, key exercises with the stated modification, and the checkpoint question.
3. A one-paragraph note on what would make this plan stop being appropriate (a new symptom, a missed checkpoint, worsening pain) and what to do instead.`,
    variables: [
      {
        name: 'current_activity_level',
        description: `What the person actually does now, not an aspirational baseline.`,
        example: `Walks about 20 minutes most days, hasn't done structured strength training in over a year.`,
        required: true,
      },
      {
        name: 'primary_goal',
        description: `The specific outcome they're building toward.`,
        example: `Build enough lower-body strength to comfortably hike a moderate trail in 10 weeks.`,
        required: true,
      },
      {
        name: 'time_and_equipment',
        description: `Realistic weekly time budget and what equipment is actually on hand.`,
        example: `3 sessions of 40 minutes a week, home setup with a set of dumbbells and a resistance band, no gym access.`,
        required: true,
      },
      {
        name: 'injury_or_health_history',
        description: `Any past or current injury, diagnosed condition, or restriction that should shape exercise choices.`,
        example: `Mild recurring lower back tightness, no diagnosed disc issue; twisted right ankle badly two years ago, occasionally feels unstable on uneven ground.`,
        required: true,
      },
      {
        name: 'program_length_weeks',
        description: `How many weeks the program should cover.`,
        example: `10 weeks`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`exercise-planning`, `fitness-program`, `wellness`, `personal-training`, `injury-aware`],
    whyItWorks: `A flat, undifferentiated workout template fails the moment it meets a real body with a real injury history, because GPT-5.1 will happily generate a polished-looking plan without ever surfacing the fact that it's guessing about what's safe for a specific joint or muscle group — the injury field forces the model to either name a concrete modification per phase or explicitly flag the gap, rather than silently writing around the risk. Requiring named phase-transition triggers (a soreness threshold, not a calendar date) matters because a generic plan that just says "week 3, add more weight" treats progress as guaranteed, when the actual failure mode in home fitness programs is people pushing through pain because the plan gave them permission to advance regardless of how the previous phase felt. Structuring a checkpoint after every phase, with an explicit branch for what happens on a worse-than-expected answer, converts the plan from a one-way script into something that can regress or pause itself — which is the behavior a real coach would have and a static template never does. The mandatory disclaimer is placed first, not buried at the end, because that's the point where someone with a genuine injury history decides whether to keep reading or to book a physical therapy appointment first, and a caveat appended after the exercises have already been prescribed does far less to change behavior than one that precedes them. None of this replaces a clinical assessment — it constrains the model to flag exactly the moments where one is warranted instead of asserting confidence it hasn't earned.`,
    exampleOutput: `Note: This is a general fitness planning aid, not a physical therapy assessment — given the ankle history, have a PT review the balance-work phases before starting. Phase 1 (Weeks 1-2, 3x/week): bodyweight squats, glute bridges, banded lateral walks; ankle modification: hold a wall for balance work rather than free-standing. Checkpoint: rate soreness 0-10 and note if the ankle felt unstable — if unstable, repeat Phase 1 rather than advancing.`,
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
    slug: 'healthcare-wellness-mental-wellness-journal-prompts',
    category: 'healthcare-wellness',
    title: `Design a week of guided journal prompts around one specific stressor, not generic gratitude prompts`,
    description: `Produces a short run of daily journaling prompts tied to a named stressor or pattern the person wants to work through, escalating gently in specificity, with an explicit line that this is reflective writing support, not therapy.`,
    promptText: `You are writing a short sequence of guided journal prompts for one person working through one specific, named stressor or pattern — not a generic "gratitude journal" list that could apply to anyone.

THE STRESSOR OR PATTERN
{{stressor_or_pattern}}

WHAT THEY'VE ALREADY TRIED
{{prior_coping_attempts}}

NUMBER OF DAYS
{{number_of_days}}

TONE THEY WANT
{{tone_preference}}

ANYTHING OFF LIMITS
{{off_limits_topics}}

RULES
Write one prompt per day that builds on the day before rather than a flat list of unrelated questions — early prompts should be observational (noticing when the pattern shows up), middle prompts should ask about triggers or context, and later prompts should ask what a small next step could look like, so the sequence has a shape rather than repeating the same question in different words. Every prompt must be a genuine question, not a disguised instruction to feel a certain way — never write a prompt that presumes the answer ("write about how grateful you are for...") when the actual stressor is something the person is still struggling with. Respect the off-limits list completely; if a natural prompt would brush against it, write around it rather than softening it into something that still touches the topic. Do not diagnose the stressor as a named clinical condition (anxiety disorder, depression, etc.) and do not suggest journaling is a substitute for treatment if what's described sounds like it may be more than everyday stress — if the description includes signs that suggest professional support could help (persistent low mood, safety concerns, an escalating pattern), name that plainly rather than staying silent about it.

MANDATORY DISCLAIMER
Include a short note before the prompts stating this is reflective journaling support for everyday stress, not therapy or a mental health diagnosis, and that if the pattern feels severe, persistent, or unsafe, a licensed therapist or counselor should be involved rather than relying on journaling alone.

WHAT NOT TO DO
Do not pad the sequence with stock wellness phrases ("be kind to yourself") that aren't tied to the specific stressor named above — every prompt should read as if it was written after actually listening to what this person described.

OUTPUT FORMAT
The disclaimer, then one prompt per day, numbered, each 1-2 sentences, with a one-line note on what that day's prompt is building toward.`,
    variables: [
      {
        name: 'stressor_or_pattern',
        description: `The specific thing being worked through, described concretely.`,
        example: `Feeling resentful and drained after almost every visit with a particular family member, then guilty for feeling that way.`,
        required: true,
      },
      {
        name: 'prior_coping_attempts',
        description: `What the person has already tried, so prompts don't repeat it.`,
        example: `Has tried limiting visit length and talking to a friend about it, hasn't tried writing anything down before.`,
        required: false,
      },
      {
        name: 'number_of_days',
        description: `How many days the sequence should cover.`,
        example: `7 days`,
        required: true,
      },
      {
        name: 'tone_preference',
        description: `The register the prompts should land in.`,
        example: `Plain and direct, not overly soft or poetic.`,
        required: true,
      },
      {
        name: 'off_limits_topics',
        description: `Anything the prompts should not touch, even indirectly.`,
        example: `Don't bring up the family member's health condition directly, it's a separate sore point.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`journaling`, `mental-wellness`, `self-reflection`, `stress-management`, `guided-writing`],
    whyItWorks: `Generic journal-prompt lists fail because they're written to apply to anyone, which means they apply to no one in particular — asking for the specific stressor and what's already been tried forces GPT-5.1 to write prompts that reference the actual shape of the problem instead of reaching for its default stock of gratitude and self-compassion phrasing, which is the most common failure mode when a prompt underspecifies the situation. Sequencing prompts from observation to trigger-context to next-step gives the week an arc instead of seven interchangeable questions, which matters because reflective writing tends to go shallow when every prompt sits at the same level of abstraction; a person needs the early days to just notice the pattern before being asked what to do about it. The instruction against presumptive framing (prompts that assume gratitude or a resolved feeling) exists because that phrasing is a common failure specific to wellness content generation — it silently invalidates whatever the person is actually feeling by writing the answer into the question. The instruction to name when a described pattern suggests professional support may help, rather than staying silent, is the safety-relevant piece: a model that only ever produces journal prompts regardless of severity risks implicitly framing serious, persistent distress as something self-help writing alone should resolve, so the prompt explicitly requires the model to flag that boundary rather than assume journaling is always sufficient. The disclaimer sits before the content because it needs to frame expectations before the person starts engaging with prompts that could otherwise read as a stand-in for actual mental health care.`,
    exampleOutput: `Note: This is reflective journaling support for everyday stress, not therapy — if this pattern feels persistent or overwhelming, a licensed therapist is worth involving. Day 1: Describe the last visit in plain detail — what happened right before the resentment showed up? (Building toward: noticing the trigger moment.) Day 2: What did you do with that feeling in the moment — say it, swallow it, distract from it?`,
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
    slug: 'healthcare-wellness-consumer-health-research-summary',
    category: 'healthcare-wellness',
    title: `Turn a pile of health research links into a doctor-visit prep sheet, not a diagnosis`,
    description: `Summarizes what someone has already read about a health topic into an organized set of questions and observations to bring to an actual appointment, explicitly refusing to render a verdict on their situation itself.`,
    promptText: `You are helping someone organize their own health research ahead of an upcoming appointment. They have been reading about a topic and want the material turned into something useful to bring to their clinician — not a conclusion about what's wrong with them.

TOPIC THEY'VE BEEN RESEARCHING
{{research_topic}}

WHAT THEY'VE READ OR BEEN TOLD
{{sources_or_findings}}

THEIR OWN SYMPTOMS OR SITUATION
{{personal_situation}}

UPCOMING APPOINTMENT TYPE
{{appointment_type}}

WHAT THEY WANT OUT OF THIS
{{desired_outcome}}

RULES
Organize what they've read into categories (things multiple sources agreed on, things sources disagreed on, things that seem specific to their situation versus general information) rather than just restating it back in the same order. Do not resolve disagreements between sources yourself and do not tell them which explanation is more likely correct for their case — that is exactly the judgment their clinician is there to make with information you don't have (an exam, test results, full history). Convert the research into a list of specific questions to ask at the appointment, phrased so a clinician could answer them directly, rather than vague questions like "is this serious." Separate anything in their own description that sounds urgent (a symptom that's rapidly worsening, or a described red-flag symptom they mentioned reading about) into its own flagged line recommending they not wait for the scheduled appointment if it applies, rather than filing it in with the general prep notes.

WHAT NOT TO DO
Do not state as fact any specific statistic, prevalence number, or named study finding that wasn't explicitly given to you in their notes — if they mention a statistic, you can reflect it back as "you noted that X source said..." but never generate a new one, and never state a treatment's effectiveness as settled fact.

MANDATORY DISCLAIMER
State plainly, before the summary, that this is a personal research organization aid to prepare for a real appointment, not a diagnosis or medical opinion, and that everything here needs review and interpretation by a qualified clinician who has actually examined them.

OUTPUT FORMAT
1. The disclaimer.
2. Any flagged urgent item, if present, at the very top.
3. A short table: what sources agreed on / where sources disagreed / what seems specific to their situation.
4. A numbered list of questions to bring to the appointment.`,
    variables: [
      {
        name: 'research_topic',
        description: `The general health topic being researched.`,
        example: `Persistent afternoon fatigue and whether it could be related to thyroid function.`,
        required: true,
      },
      {
        name: 'sources_or_findings',
        description: `What they've actually read or been told, summarized in their own words.`,
        example: `Read two articles saying fatigue plus cold sensitivity can point to hypothyroidism, one forum thread saying it's often just poor sleep, no lab work done yet.`,
        required: true,
      },
      {
        name: 'personal_situation',
        description: `Their own symptoms, timeline, and context.`,
        example: `Fatigue every afternoon for about 3 months, also noticed hair thinning recently, no other new symptoms.`,
        required: true,
      },
      {
        name: 'appointment_type',
        description: `What kind of appointment this is prep for.`,
        example: `First visit with a new primary care physician, mostly a general checkup.`,
        required: true,
      },
      {
        name: 'desired_outcome',
        description: `What they want to walk away from the appointment having covered.`,
        example: `Wants to leave with either a lab order or a clear explanation for why one isn't needed yet.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`health-research`, `appointment-prep`, `patient-advocacy`, `consumer-health`, `medical-questions`],
    whyItWorks: `The core risk in this task is a model quietly sliding from organizing research into interpreting it — GPT-5.1 is fluent enough to produce a confident-sounding synthesis that reads like a diagnosis even when it's just pattern-matching across the sources it was given, so the prompt explicitly forbids resolving disagreements or ranking likelihood, forcing the output to stay in the category of "here's what you found and where it conflicts" rather than "here's what's probably going on." Structuring output around agreement/disagreement/personal-relevance rather than a flat restatement gives the person something a clinician can actually use in a short visit, because a clinician's limited appointment time is better spent resolving the disagreement than re-reading a wall of undifferentiated notes. Requiring urgent-sounding symptoms to be pulled into their own flagged line matters because burying a red flag inside general prep notes defeats the purpose — if something in their own description suggests waiting for a scheduled appointment isn't appropriate, that needs to be impossible to miss, not one bullet among many. The rule against inventing statistics or study findings addresses a specific failure mode of consumer health prompts: a model asked to "summarize research" will sometimes fabricate a plausible-sounding number to fill a gap, which is worse than no number at all since it launders a guess as fact. Framing this explicitly as appointment prep, not diagnosis, both in the disclaimer and in the structural rules, keeps the tool doing the thing it can actually do well — organizing what a person already knows — instead of the thing only an examining clinician can do.`,
    exampleOutput: `Note: This organizes your own research for your appointment — it isn't a diagnosis. Sources agreed: fatigue + cold sensitivity are commonly discussed together with thyroid function. Sources disagreed: whether lab work is needed before or after ruling out sleep issues. Specific to you: the hair thinning wasn't mentioned in the general articles you read. Questions to ask: "Given the fatigue, hair thinning, and duration, would you order thyroid labs at this visit or wait?"`,
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
    slug: 'healthcare-wellness-clinical-literature-review-brief',
    category: 'healthcare-wellness',
    title: `Synthesize a stack of clinical papers into a structured internal brief a clinician still has to sign off on`,
    description: `Turns a set of paper abstracts or excerpts a healthcare professional has gathered into a structured evidence brief with methodology, effect direction, and limitations laid out per source, framed explicitly as a synthesis aid requiring clinical review before informing any care decision.`,
    promptText: `You are producing an internal evidence brief for a clinician or clinical researcher who has gathered a set of papers on one question and needs them synthesized into a structured working document — not a final answer to act on directly.

CLINICAL QUESTION
{{clinical_question}}

PAPERS OR EXCERPTS PROVIDED
{{papers_provided}}

INTENDED USE OF THIS BRIEF
{{intended_use}}

AUDIENCE
{{audience}}

PROCESS
For each paper provided, extract only what is actually stated in the excerpt: study design, population/sample size if given, the reported direction and magnitude of effect, and any limitation the authors themselves note — never infer a finding that isn't explicitly present in the text given to you. Group papers by whether their findings point the same direction, point in opposing directions, or are too methodologically different to compare directly (e.g. different populations, different outcome measures), and say so plainly rather than averaging conflicting findings into a single smoothed-over conclusion. Write a short synthesis paragraph per question that describes the state of the evidence as provided (strong and consistent, mixed, thin, contradictory) without translating that into a clinical recommendation — a recommendation is a decision for the clinician using this brief, informed by patient-specific factors this brief has no access to. Flag explicitly anywhere the provided papers are old, small, industry-funded (if stated), or otherwise limited in a way that should temper how much weight the synthesis paragraph gives them.

WHAT NOT TO DO
Do not search your own general knowledge to fill in gaps the provided papers don't cover, do not cite a study, statistic, or guideline that was not given to you in the input, and do not phrase the synthesis as though it settles the clinical question — it organizes the evidence someone already collected, nothing more.

MANDATORY DISCLAIMER
Open the brief with a note that this is an evidence-organization aid built only from the material provided, requires independent verification of every source against the original publication, and must be reviewed and interpreted by a qualified clinician or researcher before informing any patient care decision.

OUTPUT FORMAT
1. The disclaimer.
2. A per-paper table: citation as given, design, population, reported effect, noted limitation.
3. A grouping section: agreement / disagreement / not comparable.
4. A synthesis paragraph per question, ending in a plain statement of what remains uncertain.`,
    variables: [
      {
        name: 'clinical_question',
        description: `The specific question the literature is being gathered to inform.`,
        example: `Does adding structured sleep hygiene counseling improve outcomes for adult patients on first-line treatment for mild insomnia?`,
        required: true,
      },
      {
        name: 'papers_provided',
        description: `The abstracts, excerpts, or citations actually being synthesized — pasted in full.`,
        example: `Three abstracts pasted in: a 2019 RCT (n=120) showing modest improvement, a 2021 observational study (n=450) showing no significant difference, and a small pilot (n=24) industry-funded study showing large improvement.`,
        required: true,
      },
      {
        name: 'intended_use',
        description: `What this brief will actually be used for internally.`,
        example: `Internal discussion document for a clinic considering whether to add a counseling protocol, not a patient-facing document.`,
        required: true,
      },
      {
        name: 'audience',
        description: `Who will read this brief.`,
        example: `A small group of primary care physicians and a clinic administrator, all with a research-literacy background.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`clinical-literature`, `evidence-synthesis`, `medical-research`, `literature-review`, `clinical-brief`],
    whyItWorks: `The single biggest risk in literature synthesis tasks is a model quietly supplementing the provided papers with its own general training-data knowledge of a topic, producing a brief that reads as more comprehensive than the actual evidence base the clinician assembled — the explicit instruction to extract only what's stated in the given excerpts, and never to cite anything not provided, closes that gap by keeping the model's role strictly extractive rather than generative on the factual content. Requiring per-paper extraction of design, population, and self-reported limitations before any synthesis forces the model to surface the methodological differences that make studies hard to compare, rather than jumping straight to a smoothed conclusion that hides the fact that a 24-person industry-funded pilot and a 450-person observational study don't actually carry equal evidentiary weight. Grouping into agreement/disagreement/not-comparable, instead of a single blended paragraph, mirrors how an actual evidence review is read by a clinician deciding how much to trust it — averaging conflicting findings into one number is a well-documented failure mode in lay summarization of research and is exactly what this structure prevents. The explicit ban on translating synthesis into a recommendation matters because that is precisely the point where a language model's fluency becomes dangerous: it can produce a confident-sounding "should" statement about patient care with no access to the actual patient, and the brief's whole value is in organizing evidence for someone who does have that context to make the call. The disclaimer is framed around independent verification specifically because a model can misstate what a paper says even when instructed not to, so the clinician using this brief is told upfront to check the brief against the original sources, not just accept the synthesis at face value.`,
    exampleOutput: `Note: Built only from the three abstracts provided; verify each against the original publication before relying on this brief, and have a qualified clinician review it before it informs any care decision. Agreement: none of the three fully agree. Disagreement: the RCT and pilot show improvement, the larger observational study shows none. Limitation flagged: the pilot showing the largest effect is small (n=24) and industry-funded per the abstract, which should reduce how much weight it carries relative to the larger observational study.`,
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
    slug: 'healthcare-wellness-patient-faq-procedure-prep',
    category: 'healthcare-wellness',
    title: `Write a patient FAQ for one specific procedure that answers the anxious questions, not just the logistical ones`,
    description: `Drafts a patient-facing FAQ for a specific procedure or visit type that covers the practical logistics and the quieter worry-driven questions patients don't always ask out loud, framed as a draft requiring clinical sign-off before publishing.`,
    promptText: `You are drafting a patient FAQ page for one specific procedure or visit type offered by a practice. Patients reading this are often anxious, not just looking for logistics.

PROCEDURE OR VISIT TYPE
{{procedure_name}}

WHAT PATIENTS TYPICALLY ASK THE FRONT DESK
{{common_questions}}

WHAT THE PRACTICE WANTS TO REASSURE PATIENTS ABOUT
{{reassurance_points}}

PRACTICAL LOGISTICS
{{logistics_details}}

QUESTIONS THIS FAQ SHOULD EXPLICITLY NOT ANSWER
{{questions_out_of_scope}}

RULES
Write two tiers of questions: the logistical ones patients ask out loud (how long does it take, what should I wear, can someone drive me) and the quieter ones patients often don't ask directly but are clearly worried about (will it hurt, what if something goes wrong, how will I know if I need to come back sooner) — infer the second tier from what's anxiety-adjacent to this specific procedure, don't just list generic FAQ filler. Answer each question in plain, calm language without minimizing real discomfort or risk — "most patients describe mild discomfort, not pain" is honest; "it's completely painless" is not, unless that's actually and specifically true for this procedure. For any question that would require a specific clinical judgment about an individual patient's situation (their own risk factors, what a symptom they're describing means, whether they personally should proceed), write the answer as "this depends on your specific situation — ask your care team at your visit" rather than attempting a general answer that could be wrong for someone with an atypical case. Leave the explicitly out-of-scope questions off the page entirely rather than answering them badly.

WHAT NOT TO DO
Do not state a specific complication rate, success rate, or recovery timeline as a hard number unless it was given to you above — write "ask your provider about the expected timeline for your case" instead of inventing a plausible-sounding average.

MANDATORY DISCLAIMER
Add a closing line on the FAQ page stating that this page is general information, not personalized medical advice, and that any question about a patient's own symptoms, risks, or readiness for the procedure should be directed to their care team — and open the draft to the practice with a note that clinical staff must review and approve every answer before this goes live.

OUTPUT FORMAT
1. A one-line note to the practice: "clinical review required before publishing."
2. Logistics questions and answers.
3. Anxiety-driven questions and answers.
4. The closing patient-facing disclaimer line, written exactly as it should appear on the page.`,
    variables: [
      {
        name: 'procedure_name',
        description: `The specific procedure or visit type this FAQ is for.`,
        example: `Outpatient colonoscopy under sedation.`,
        required: true,
      },
      {
        name: 'common_questions',
        description: `What the front desk actually gets asked about this procedure.`,
        example: `How long is the prep, can I drive myself home, how long until I get results.`,
        required: true,
      },
      {
        name: 'reassurance_points',
        description: `Specific, true things the practice wants patients to know that ease anxiety.`,
        example: `Sedation means most patients don't remember the procedure itself; a nurse checks in throughout recovery before discharge.`,
        required: true,
      },
      {
        name: 'logistics_details',
        description: `Concrete timing, arrival, and requirement details.`,
        example: `Prep starts the evening before, procedure itself takes 20-30 minutes, plan for 2-3 hours total at the facility including recovery.`,
        required: true,
      },
      {
        name: 'questions_out_of_scope',
        description: `Questions this FAQ should leave off entirely rather than answer generically.`,
        example: `Whether a specific medication needs to be paused beforehand — that's patient-specific and handled during the pre-procedure call.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`patient-faq`, `patient-communication`, `healthcare-content`, `procedure-prep`, `front-desk`],
    whyItWorks: `Most procedure FAQs are written entirely around logistics because that's what front-desk staff actually get asked, but the questions a patient is silently anxious about rarely get voiced to a receptionist and never make it into the source material — asking the model to explicitly infer a second tier of anxiety-adjacent questions specific to this procedure, rather than pulling from a generic FAQ template, produces content that addresses what's actually keeping someone up the night before, which is where a lot of patient FAQ pages fall short. The instruction against minimizing real discomfort ("most patients describe mild discomfort" versus a blanket "painless") matters because overpromising comfort is a specific, common failure in patient-facing healthcare copy that erodes trust the moment a patient's actual experience doesn't match the page, and it's also the kind of overclaim that shouldn't be published without clinical sign-off in the first place. Routing any question that depends on individual risk factors to "ask your care team" rather than attempting a general answer prevents the page from accidentally functioning as personalized medical advice — a FAQ page is read by people with wildly different health histories, and a generically correct answer for a typical patient can be actively wrong for someone with an atypical one. The ban on inventing specific complication or success rates addresses a distinct risk: a fluent model asked to write reassuring healthcare copy will sometimes produce a plausible-sounding statistic to round out an answer, and a fabricated number on a real clinical FAQ page is a credibility and safety problem, not just a stylistic one. The clinical-review note at the top exists because this is a draft for a real publishing workflow, and it should never reach a patient before someone with clinical authority has checked every answer against how the practice actually performs the procedure.`,
    exampleOutput: `Clinical review required before publishing. Q: Will the procedure hurt? A: Most patients under sedation don't recall the procedure at all; some describe mild bloating afterward from the air used during the exam, not pain. Q: What if I have questions about my own risk given my health history? A: That depends on your specific situation — please raise it with your care team at your pre-procedure appointment.`,
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
    slug: 'healthcare-wellness-patient-facing-copy-readability',
    category: 'healthcare-wellness',
    title: `Rewrite clinical-sounding marketing copy for a health service at an eighth-grade reading level without losing accuracy`,
    description: `Takes stiff, jargon-heavy copy for a healthcare or wellness service and rewrites it for plain-language readability, flagging any claim that needs a clinician's confirmation rather than softening it into something vague.`,
    promptText: `You are rewriting marketing or website copy for a healthcare or wellness service so it reads clearly to a general patient audience, without quietly changing what it claims.

ORIGINAL COPY
{{original_copy}}

SERVICE THIS COPY DESCRIBES
{{service_description}}

TARGET AUDIENCE
{{target_audience}}

TARGET READING LEVEL
{{target_reading_level}}

BRAND VOICE NOTES
{{brand_voice_notes}}

RULES
Rewrite sentence by sentence for the target reading level: shorter sentences, common words instead of clinical jargon (explain a term in plain language the first time it appears if it can't be avoided), and active voice instead of passive constructions that hide who is doing what. Preserve every specific claim in the original exactly as strong or as qualified as it was written — do not make a hedged claim sound more certain in the simplified version, and do not make a strong claim sound softer either; readability and accuracy are separate jobs and this task is only the first one. Anywhere the original copy contains a claim that sounds like it needs a citation, statistic, or clinical validation that isn't provided in the input, flag it in a separate list rather than either inventing a supporting number or silently deleting the claim — that decision belongs to whoever owns the medical accuracy of this page, not to a rewrite for readability. Keep the brand voice notes in mind for word choice and warmth, but never let brand voice override plain accuracy — a friendlier phrase that changes what's actually being promised is not an acceptable trade.

WHAT NOT TO DO
Do not add new reassurances, guarantees, or outcome claims that weren't in the original copy, even ones that sound like natural marketing language — every claim in the output must trace back to something stated or clearly implied in the input.

MANDATORY DISCLAIMER
Add a note to whoever requested this rewrite (not on the patient-facing page itself) stating that this is a readability and plain-language pass only, that medical claims have been preserved rather than fact-checked, and that a qualified clinician or medical-review team must confirm the flagged claims and approve final accuracy before publishing.

OUTPUT FORMAT
1. The rewritten copy, formatted the same way as the original (paragraphs, bullets, etc.).
2. A flagged-claims list: the original sentence and why it needs clinical confirmation.
3. The internal disclaimer note.`,
    variables: [
      {
        name: 'original_copy',
        description: `The actual existing copy to be rewritten, pasted in full.`,
        example: `"Our proprietary recovery protocol utilizes evidence-based modalities to optimize musculoskeletal outcomes, significantly reducing time to full functional restoration for the majority of our patient population."`,
        required: true,
      },
      {
        name: 'service_description',
        description: `What the service actually is, in plain terms.`,
        example: `An outpatient physical therapy clinic specializing in post-surgical knee and shoulder rehab.`,
        required: true,
      },
      {
        name: 'target_audience',
        description: `Who reads this page.`,
        example: `Adults recovering from recent orthopedic surgery, many reading it while still in pain and looking for a clinic.`,
        required: true,
      },
      {
        name: 'target_reading_level',
        description: `The specific reading level to hit.`,
        example: `Eighth-grade reading level.`,
        required: true,
      },
      {
        name: 'brand_voice_notes',
        description: `Any tone guidance from the brand, if it has one.`,
        example: `Warm and encouraging, avoid sounding clinical or cold, but never twee.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`healthcare-copywriting`, `plain-language`, `patient-communication`, `readability`, `content-rewrite`],
    whyItWorks: `Readability rewrites of healthcare copy fail in a specific, predictable way: simplifying jargon-heavy sentences tends to accidentally strengthen or soften the underlying claim, because plain words carry different connotations than the hedged clinical phrasing they replace — "significantly reducing time to full functional restoration for the majority of our patient population" simplified carelessly can turn into "you'll heal faster," which is a stronger, unqualified promise the original never actually made. Explicitly separating the readability job from the accuracy job, and instructing the model to preserve hedge strength exactly, is what prevents that drift, since GPT-5.1 will otherwise optimize for a punchier, more confident-sounding sentence when asked to make copy "clearer," which reads well but changes the claim. Flagging any claim that implies an uncited statistic or clinical validation, rather than inventing a number or silently cutting the sentence, matters because both of those alternatives make an editorial decision that isn't the model's to make — a deleted claim might be one the practice can actually support with data they have but didn't paste in, and an invented statistic is a fabricated clinical claim on a real patient-facing page. The explicit ban on adding new reassurances addresses the very common failure mode where a model asked to make marketing copy "warmer" adds outcome language that sounds natural for the genre but was never actually claimed by the source. The disclaimer here is addressed to the internal team, not the patient, because the deliverable itself is a draft in a publishing pipeline — the point where a clinician needs to intervene is before publication, checking the flagged list against what the practice can actually substantiate.`,
    exampleOutput: `Rewritten: "After surgery, our physical therapy team helps you get back to moving comfortably. We use methods backed by research, and most patients recover function sooner than they expected." Flagged: the original's "significantly reducing time to full functional restoration for the majority" implies a comparative statistic — confirm this against actual outcome data before publishing, or soften to avoid an unsupported comparison claim.`,
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
    slug: 'healthcare-wellness-telehealth-intake-form-draft',
    category: 'healthcare-wellness',
    title: `Draft a telehealth intake form's questions so triage staff get answers they can actually act on`,
    description: `Builds the question set and branching logic for a telehealth intake form for one specific visit type, structured so answers are specific enough for triage staff to act on, with an explicit note that clinical staff must approve the final form and its urgent-symptom routing before it goes live.`,
    promptText: `You are drafting the question set for a telehealth intake form for one specific visit type. The form needs to produce answers precise enough for triage staff to act on, not vague enough that a nurse has to call the patient back to ask what they actually meant.

VISIT TYPE
{{visit_type}}

WHAT TRIAGE STAFF NEED TO KNOW TO ROUTE THIS CORRECTLY
{{triage_needs}}

SYMPTOMS OR SITUATIONS THAT SHOULD TRIGGER AN URGENT FLAG
{{urgent_flag_criteria}}

EXISTING FORM FIELDS TO KEEP (if any)
{{existing_fields}}

PATIENT POPULATION
{{patient_population}}

RULES
Write each question so the possible answers are specific enough to act on — prefer a structured choice (severity scale, duration bucket, yes/no with a specific follow-up) over an open free-text box for anything triage staff need to make a routing decision from, and reserve free text for things that genuinely can't be pre-structured ("anything else we should know"). Build explicit branching: state which answer to which question should trigger the urgent-flag path, and write the on-screen message the patient sees when that path triggers, directing them to call emergency services or a specific urgent line rather than simply submitting the form and waiting. Order the questions so anything relevant to the urgent-flag criteria appears early, not buried after a long series of demographic or insurance questions, so a patient in real distress doesn't have to complete unrelated fields first. Do not write a question that requires the patient to already know clinical terminology to answer correctly — describe what to look for in plain terms, not the name of the sign a clinician would use for it.

WHAT NOT TO DO
Do not write questions or branching logic that would let the form itself render a diagnosis or a treatment recommendation to the patient — the form's only job is to gather structured information and flag urgency; every non-urgent path should end in "this will be reviewed by your care team," not a suggested diagnosis or plan.

MANDATORY DISCLAIMER
Add a line, both to the practice and as on-screen text for the patient, stating that this intake form does not replace an emergency evaluation, that anyone experiencing a flagged urgent symptom should seek immediate care rather than waiting for form review, and that the full question set and urgent-flag logic must be reviewed and approved by clinical staff before this form is used with real patients.

OUTPUT FORMAT
1. The disclaimer.
2. The ordered question list, each with its answer format (structured choice options listed, or free text).
3. The branching logic table: trigger answer -> urgent flag -> patient-facing message shown.
4. A short note to clinical staff on what they specifically need to review before go-live.`,
    variables: [
      {
        name: 'visit_type',
        description: `The specific telehealth visit this intake form is for.`,
        example: `Same-day telehealth visit for a new skin rash.`,
        required: true,
      },
      {
        name: 'triage_needs',
        description: `What information staff actually need to route the visit to the right provider or urgency level.`,
        example: `Need to know rash location, spread rate, whether there's fever, and whether the patient has any known allergy history.`,
        required: true,
      },
      {
        name: 'urgent_flag_criteria',
        description: `What should trigger the form to flag the visit as urgent rather than routine.`,
        example: `Difficulty breathing, swelling of the face or throat, rash spreading rapidly within hours, or high fever.`,
        required: true,
      },
      {
        name: 'existing_fields',
        description: `Any current form fields the practice wants kept as-is.`,
        example: `Keep the existing insurance and pharmacy fields unchanged.`,
        required: false,
      },
      {
        name: 'patient_population',
        description: `Who typically fills this form out.`,
        example: `General adult population, form needs to be usable on a phone, some patients may be filling it out for a child.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`telehealth`, `intake-forms`, `patient-triage`, `healthcare-operations`, `form-design`],
    whyItWorks: `Intake forms fail operationally in a specific, well-known way: open-ended free-text fields produce answers too vague for triage staff to act on directly, forcing a callback loop that defeats the purpose of an intake form in the first place — forcing structured-choice answers wherever a routing decision depends on the response, and reserving free text for genuinely unstructured information, is what closes that gap. Requiring explicit branching logic with a stated patient-facing message at the urgent-flag trigger matters because a form that silently "flags" something in a back-end field without telling the patient what to do next leaves a person with a real emergency sitting at their screen waiting for a callback instead of calling for help immediately, which is the actual harm this kind of form exists to prevent. Ordering urgent-relevant questions early rather than after routine demographic fields is a direct fix for a common form-design mistake: a patient in genuine distress filling out ten fields about insurance before reaching the question that would flag them is a real, documented failure pattern in badly sequenced intake forms. The instruction against clinical terminology in the questions themselves keeps the form usable by the patient population it's actually written for, since a triage question phrased in clinical language will get inconsistent, sometimes wrong answers from patients who don't recognize the term. The explicit ban on the form rendering any diagnosis or treatment suggestion is the safety-critical rule — an intake form's entire legitimate function is structured information-gathering and urgency flagging, and any drift toward the form appearing to offer clinical judgment on its own would mislead a patient about what they're interacting with, which is why clinical sign-off on the final logic is stated as mandatory before real use.`,
    exampleOutput: `Q3: Is the rash spreading noticeably within the last few hours? (Yes / No / Not sure) -> If Yes, and combined with reported facial or throat swelling, trigger urgent flag. Patient-facing message on trigger: "Based on your answers, this may need immediate attention. Please call 911 or go to the nearest emergency department now rather than waiting for this form to be reviewed."`,
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
    slug: 'healthcare-wellness-chatbot-scripted-flows',
    category: 'healthcare-wellness',
    title: `Script a healthcare chatbot's conversation flows so it routes and reassures without ever sounding like it's diagnosing`,
    description: `Writes the branching dialogue for a patient-facing healthcare chatbot handling a specific set of common requests, with explicit escalation paths for anything resembling a symptom question, so the bot never drifts into sounding clinically authoritative.`,
    promptText: `You are scripting the conversation flows for a patient-facing chatbot used by a healthcare practice or wellness service. The bot's job is to route, schedule, and answer logistics questions — it must never sound like it is assessing or diagnosing a patient's symptoms.

BOT'S INTENDED FUNCTIONS
{{bot_functions}}

COMMON REQUEST TYPES TO SCRIPT
{{request_types}}

WHAT SHOULD ALWAYS ESCALATE TO A HUMAN
{{escalation_triggers}}

TONE
{{tone_guidance}}

EXISTING SYSTEM CONSTRAINTS
{{system_constraints}}

RULES
For each request type, write the full flow: the bot's opening response, the follow-up questions it asks to route correctly, and the resolution (booked, information given, or handed to a human) — a flow that dead-ends without a clear resolution is incomplete. The instant a user's message contains anything that reads as a symptom description, a request for medical advice, or an emotional crisis, the flow must branch to the escalation path rather than attempting to be helpful about the medical content itself — write the exact bot line that performs this handoff, and make it warm rather than a cold form-letter refusal, since a curt refusal at a vulnerable moment is its own failure. Write the bot's refusal-and-redirect lines so they name what it can help with instead, rather than a bare "I can't help with that" that leaves the user stuck. For any flow where the user might reasonably follow up with a symptom-adjacent question mid-flow (for example, asking to reschedule because they feel too unwell to come in), write that specific branch explicitly rather than assuming it won't come up.

WHAT NOT TO DO
Do not write any bot line that names a possible cause for a symptom, suggests a self-care remedy, or implies reassurance about how serious something is ("that's probably nothing to worry about") — even a well-intentioned reassuring line here is a boundary violation for a bot whose actual job is routing, not clinical judgment.

MANDATORY DISCLAIMER
Write a short standing disclaimer line the bot shows at the start of every session, stating plainly that it can help with scheduling and general information but cannot assess symptoms or give medical advice, and that any health concern should be directed to their care team or, for emergencies, to call emergency services — and add an internal note that all scripted flows must be reviewed and approved by clinical and compliance staff before deployment.

OUTPUT FORMAT
1. The standing disclaimer shown at session start.
2. Each request type as a labeled flow: opening line, follow-up questions, resolution.
3. The escalation flow, written out in full, including the exact handoff line.
4. The internal review note.`,
    variables: [
      {
        name: 'bot_functions',
        description: `What this chatbot is actually built to do.`,
        example: `Appointment scheduling and rescheduling, office hours and location info, prescription refill request routing.`,
        required: true,
      },
      {
        name: 'request_types',
        description: `The specific request categories to script full flows for.`,
        example: `Book a new appointment, reschedule an existing one, request a prescription refill, ask about office hours.`,
        required: true,
      },
      {
        name: 'escalation_triggers',
        description: `What kinds of messages must always route to a human rather than the bot handling it.`,
        example: `Any mention of symptoms, pain, medication side effects, or emotional distress; anything the bot doesn't have a matching flow for.`,
        required: true,
      },
      {
        name: 'tone_guidance',
        description: `How the bot should sound.`,
        example: `Friendly and efficient, not overly chatty, should feel like a helpful front-desk staffer.`,
        required: true,
      },
      {
        name: 'system_constraints',
        description: `Any technical limits the flows need to respect.`,
        example: `Bot can only see open appointment slots for the next 14 days; cannot access lab results or medical records.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`healthcare-chatbot`, `conversation-design`, `patient-routing`, `chatbot-scripting`, `escalation-flows`],
    whyItWorks: `The failure mode this prompt is built around is chatbot scope creep: a bot scripted only for scheduling will, without an explicit and specific escalation instruction, still generate a plausible-sounding reassuring reply the moment a user types something symptom-adjacent, because a fluent model asked to be "helpful" will try to be helpful about whatever the user actually said rather than staying inside its intended lane — which is why the rule bans not just diagnosis but reassurance lines like "probably nothing to worry about," since even a well-meaning reassurance is clinical judgment the bot has no basis to offer. Writing the escalation handoff as a warm, specific line rather than a form-letter refusal matters because the moment someone types a symptom into a healthcare chatbot is often a moment of real anxiety, and a cold "I cannot assist with that" at that exact moment reads as dismissive in a way that can discourage someone from then seeking the human help they actually need. Requiring the mid-flow branch (a user asking to reschedule "because I feel too unwell") to be scripted explicitly, rather than left implicit, addresses a realistic edge case that generic chatbot scripts typically miss — real users don't cleanly separate a logistics request from a health complaint, and a flow that only handles the clean case will mishandle the common messy one. The standing session-start disclaimer, shown before any interaction rather than only triggered on escalation, sets the user's expectation of what the bot is for from the first message, which reduces the odds someone treats a routing bot as a source of medical judgment in the first place. The internal review note is there because a chatbot's scripted flows are a deployed product surface, not a one-off document — clinical and compliance review before launch is the actual safeguard, not the disclaimer text alone.`,
    exampleOutput: `Session start: "Hi, I can help you schedule, reschedule, or ask about office hours and refills. I can't assess symptoms or give medical advice — for a health concern, I'll connect you with your care team, and for an emergency please call emergency services." Escalation line: "That sounds like something your care team should hear directly rather than me trying to sort out — I'm connecting you with our nurse line now, and if this feels urgent, please call 911 or go to the nearest ER."`,
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
    slug: 'healthcare-wellness-medical-document-plain-summary',
    category: 'healthcare-wellness',
    title: `Turn a discharge summary or medical letter into a plain-language summary a patient or caregiver can actually use`,
    description: `Converts a dense medical document into a plain-language summary structured around what the patient needs to do next, flagging anything ambiguous for the care team rather than guessing at its meaning.`,
    promptText: `You are converting a medical document into a plain-language summary for the patient or a family caregiver who needs to act on it, not for another clinician.

DOCUMENT TYPE
{{document_type}}

DOCUMENT TEXT
{{document_text}}

WHO WILL BE READING THE SUMMARY
{{reader_context}}

WHAT THEY MOST NEED TO GET RIGHT
{{critical_action_items}}

RULES
Organize the summary around what the reader needs to do, not the order the original document presents information in — lead with medication changes and follow-up actions, then diagnosis and explanation, then background detail, since a caregiver skimming this needs the action items first. Translate every clinical term into plain language on first use (a dosage instruction, a diagnosis name, a follow-up test) without dropping any specific number, date, or dosage from the original — a simplified summary that loses a specific detail (a dose, a date, a threshold) is more dangerous than one that keeps clinical wording the reader has to look up. If anything in the original document is ambiguous, contradictory, or uses an abbreviation you cannot confidently expand, do not guess at its meaning — list it separately as "confirm this with your care team" rather than silently resolving the ambiguity yourself, since a wrong guess here is worse than an acknowledged gap. Preserve every specific instruction exactly (medication name, dose, frequency, duration) rather than paraphrasing it loosely — plain language applies to explanation, not to the numbers themselves.

WHAT NOT TO DO
Do not add any explanation, reassurance, or interpretation of the diagnosis or prognosis that isn't explicitly stated in the source document, even if it would make the summary read more smoothly — anything not in the original is not this summary's to add.

MANDATORY DISCLAIMER
Open the summary with a note stating this is a plain-language translation aid, not a replacement for talking to the care team, and that any confusion, question, or symptom the reader is worried about should be raised directly with the clinician who wrote the original document rather than resolved by this summary.

OUTPUT FORMAT
1. The disclaimer.
2. "What to do now" section: action items in order of urgency, with exact medication/dose/date details preserved.
3. "What happened / what this means" section, in plain language.
4. "Confirm with your care team" list of anything ambiguous or uncertain in the original.`,
    variables: [
      {
        name: 'document_type',
        description: `What kind of medical document this is.`,
        example: `Hospital discharge summary after a short admission for pneumonia.`,
        required: true,
      },
      {
        name: 'document_text',
        description: `The actual document text to summarize, pasted in full.`,
        example: `Discharge summary noting a new prescription for amoxicillin-clavulanate 875mg twice daily for 7 days, follow-up chest X-ray in 4-6 weeks, and a note to return to ED if fever exceeds 101F or breathing worsens.`,
        required: true,
      },
      {
        name: 'reader_context',
        description: `Who is actually going to read this summary.`,
        example: `The patient's adult daughter, who is coordinating care and doesn't have a medical background.`,
        required: true,
      },
      {
        name: 'critical_action_items',
        description: `What absolutely must come through correctly, even if everything else were lost.`,
        example: `The exact antibiotic dosing schedule and the specific fever threshold that means go back to the ER.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`medical-documents`, `plain-language`, `patient-summary`, `caregiver-support`, `discharge-instructions`],
    whyItWorks: `Discharge summaries and medical letters are written in an order that makes clinical sense to another clinician — background, findings, then instructions at the end — which is close to the worst order for a caregiver skimming under stress, so reordering the summary around action items first directly fixes the actual failure mode of these documents in real use: important instructions getting missed because they were buried on the second page. The rule to preserve every specific number and date exactly, even while simplifying the surrounding language, exists because the single most dangerous failure in a plain-language medical summary isn't clunky phrasing, it's a dropped or altered dose, date, or threshold — GPT-5.1 is fluent enough to paraphrase a dosage instruction in a way that sounds natural but subtly loses precision ("take it a couple times a day" instead of "875mg twice daily"), and this rule exists specifically to prevent that class of error. Requiring ambiguous or contradictory content to be listed separately as "confirm with your care team," rather than resolved with a best guess, matters because a model guessing at what an unclear abbreviation or an apparently contradictory instruction means is exactly the situation where a wrong guess does more harm than an honest gap — the reader can act on an acknowledged unknown by calling the clinic, but they can't correct a wrong interpretation they don't know is wrong. The explicit ban on adding interpretation or reassurance not present in the source keeps the summary a translation, not a second medical opinion, which is the line this task must not cross. The disclaimer directs the reader back to the original clinician for anything they're unsure about, because the summary's job is comprehension, not decision-making on ambiguous or worrying content.`,
    exampleOutput: `Note: this is a plain-language translation of the discharge paperwork, not a substitute for talking to the care team. What to do now: take amoxicillin-clavulanate 875mg twice a day for 7 days (don't skip doses even if feeling better); schedule a follow-up chest X-ray in 4 to 6 weeks; go back to the ER right away if fever goes above 101F or breathing gets worse. Confirm with care team: the discharge note also mentions "cont. prior home meds" without listing them — confirm which medications this refers to.`,
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
    slug: 'healthcare-wellness-care-coordination-handoff-note',
    category: 'healthcare-wellness',
    title: `Draft a care-coordination handoff note between providers that flags gaps instead of papering over them`,
    description: `Writes a structured handoff note summarizing a patient's care across multiple providers for a care coordinator, explicitly surfacing gaps or conflicting information rather than smoothing them into a clean narrative, framed as a draft for clinical review before it enters any record.`,
    promptText: `You are drafting a care-coordination handoff note that summarizes a patient's situation across multiple providers or care settings, for a care coordinator or case manager to review and use — not a finished clinical note to be entered into a record as-is.

PATIENT SITUATION
{{patient_situation}}

PROVIDERS OR SETTINGS INVOLVED
{{providers_involved}}

INFORMATION GATHERED SO FAR
{{information_gathered}}

PURPOSE OF THIS HANDOFF
{{handoff_purpose}}

WHO RECEIVES THIS NOTE
{{recipient}}

RULES
Structure the note around what the receiving party needs to know to act, not a chronological retelling of every interaction — lead with active issues and pending actions, then relevant history, then background. Where information from different providers or settings conflicts (a medication list that doesn't match between two sources, a diagnosis noted differently in two places), do not pick the version that seems more likely correct and present only that one — state both versions and flag the conflict explicitly as something that needs reconciliation, since guessing which source is right is not this note's job. Where information is simply missing (a provider hasn't yet reported back, a test result is pending), say so plainly rather than writing around the gap in a way that makes the note read as more complete than it actually is. List every open action item with whose responsibility it is, if known, and mark it clearly if ownership is unclear rather than assuming it defaults to any particular party.

WHAT NOT TO DO
Do not add clinical interpretation, a suggested diagnosis, or a recommended next step that wasn't explicitly part of the information gathered — a coordination note organizes what's known and what's outstanding; it does not generate new clinical judgment.

MANDATORY DISCLAIMER
Add a note at the top stating that this is a coordination draft assembled from the information provided, that any conflicting or missing information listed here must be reconciled and confirmed by the treating clinicians before being relied on, and that this draft should be reviewed by a qualified clinician or care team lead before it is finalized or entered into any official record.

OUTPUT FORMAT
1. The disclaimer.
2. Active issues and pending actions, with owner if known.
3. Conflicting information flagged explicitly, both versions shown.
4. Missing information / pending items.
5. Relevant background, last.`,
    variables: [
      {
        name: 'patient_situation',
        description: `A brief description of the patient's overall situation prompting this handoff.`,
        example: `Recently discharged after a fall, now being followed by both a home health nurse and an outpatient physical therapist, family requesting a coordinated plan.`,
        required: true,
      },
      {
        name: 'providers_involved',
        description: `Which providers or care settings are part of this handoff.`,
        example: `Hospital discharge team, home health nursing agency, outpatient PT clinic, primary care physician.`,
        required: true,
      },
      {
        name: 'information_gathered',
        description: `What's actually been collected so far from each source, including anything that conflicts.`,
        example: `Discharge summary lists a blood thinner as discontinued; home health nurse's notes still list it as active. PT hasn't yet received the discharge summary.`,
        required: true,
      },
      {
        name: 'handoff_purpose',
        description: `What this handoff note needs to accomplish.`,
        example: `Get all three providers aligned on the current medication list and confirm who's tracking the fall-risk follow-up plan.`,
        required: true,
      },
      {
        name: 'recipient',
        description: `Who will actually read and act on this note.`,
        example: `A case manager who will call each provider to reconcile the open items.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`care-coordination`, `clinical-handoff`, `case-management`, `patient-safety`, `healthcare-communication`],
    whyItWorks: `Handoff notes fail patients most often not through missing information but through smoothed-over conflicting information — two sources disagreeing about whether a medication is active is a well-documented root cause of care-coordination errors, and a model asked to "summarize" the situation will, by default, tend to resolve the conflict into one clean-sounding version rather than presenting the discrepancy, because a single coherent narrative reads better than two contradictory ones. The explicit instruction to show both conflicting versions and flag them for reconciliation, rather than picking the more plausible one, exists specifically to prevent that smoothing, since the coordinator reading this note is the person positioned to actually call and resolve it — the note's job is to make the conflict impossible to miss, not to guess at an answer. Leading with active issues and pending actions rather than a chronological account matches how a care coordinator actually uses a handoff note under time pressure — they need the open loop first, not a full narrative history, which is the same structural logic that improves any operational handoff document. Explicitly marking ownership as unclear when it is, rather than defaulting an action item to whichever party is mentioned last, prevents the common failure where an item silently falls through the cracks because everyone assumed someone else owned it. The ban on adding clinical interpretation matters because this note sits between multiple licensed clinicians' own judgment — it is a coordination artifact, and any drift toward the model contributing its own diagnostic reasoning would insert an unlicensed opinion into a clinical decision chain, which is exactly why review by a clinician or care lead is required before this note is finalized or entered into a record.`,
    exampleOutput: `Note: Coordination draft from information gathered so far — conflicting and missing items below must be reconciled and confirmed by the treating clinicians before this is finalized. Conflict flagged: discharge summary marks the blood thinner as discontinued; home health notes still list it as active — needs reconciliation before the next dose is given. Missing: PT clinic has not yet received the discharge summary. Open action, owner unclear: confirming which medication list is current.`,
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
    slug: 'healthcare-wellness-health-risk-screening-checklist',
    category: 'healthcare-wellness',
    title: `Build a non-diagnostic health risk screening checklist for a workplace wellness program`,
    description: `Produces a self-report risk screening checklist for a workplace or community wellness program that flags who should talk to a clinician next, without ever scoring or labeling an individual's actual risk level itself.`,
    promptText: `You are building a self-report health risk screening checklist for a workplace or community wellness program. The checklist's only job is to help someone notice patterns worth raising with a clinician — it must never produce a risk score, label, or verdict about an individual's actual health status.

PROGRAM CONTEXT
{{program_context}}

RISK AREAS TO COVER
{{risk_areas}}

HOW RESULTS WILL BE USED
{{results_usage}}

AUDIENCE
{{audience_description}}

RULES
Write each checklist item as a plain factual question about a behavior, symptom frequency, or history ("in the past month, how many days did you...") rather than a question that requires the person to already have interpreted their own risk ("do you have high blood pressure risk"). Group items by risk area, and after each group, write a plain instruction for what a person should do with a pattern of "yes" or concerning answers in that group — always "consider discussing this with a doctor," never a score, tier, or label like "moderate risk" or "high risk," since assigning a risk tier from a self-report checklist without clinical context is exactly the kind of judgment this tool should not make. Keep the checklist anonymous-compatible by design — do not require or reference anything that would only make sense if results were being centrally scored or ranked against other participants, since that shifts the tool from self-reflection aid toward something that resembles a clinical assessment.

WHAT NOT TO DO
Do not include a scoring formula, point system, or cutoff threshold anywhere in the checklist, even one you're inclined to add for user-friendliness — an unscored checklist that prompts a conversation is safer and more accurate than a scored one that implies a false level of diagnostic precision.

MANDATORY DISCLAIMER
Open the checklist with a note stating plainly that this is a self-reflection tool, not a medical screening or diagnostic instrument, that it does not calculate a risk score, and that any pattern of concerning answers should be discussed with a qualified clinician, who is the only one positioned to actually assess health risk.

OUTPUT FORMAT
1. The disclaimer.
2. Checklist items grouped by risk area, each as a plain yes/no or frequency question.
3. After each group, the plain instruction line ("if you answered yes to several of these, consider raising it with your doctor").
4. A closing line restating that this checklist doesn't score or diagnose anything.`,
    variables: [
      {
        name: 'program_context',
        description: `What kind of program this checklist is part of.`,
        example: `An annual voluntary wellness screening event at a mid-size company, self-administered on paper.`,
        required: true,
      },
      {
        name: 'risk_areas',
        description: `The specific areas the checklist should cover.`,
        example: `Sleep quality, stress levels, physical activity frequency, and family history awareness.`,
        required: true,
      },
      {
        name: 'results_usage',
        description: `What happens to the answers after someone fills it out.`,
        example: `Kept entirely by the individual — not collected or reported to HR or the employer in any form.`,
        required: true,
      },
      {
        name: 'audience_description',
        description: `Who will be completing this checklist.`,
        example: `Adult employees across a wide age range, mixed health literacy, completing it voluntarily on their own time.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`health-screening`, `workplace-wellness`, `risk-checklist`, `preventive-health`, `self-assessment`],
    whyItWorks: `The most dangerous thing a lay-audience risk checklist can do is imply diagnostic precision it doesn't have — a point-scored checklist that outputs "you are at moderate risk" sounds authoritative but is built on self-report data with no clinical context, and a person reading a false "low risk" result may reasonably (and wrongly) decide a real symptom doesn't need attention, which is worse than no checklist at all. Explicitly banning any scoring formula or cutoff threshold, and requiring every group to end in "consider discussing this with a doctor" rather than a tier label, keeps the tool doing the one thing it can safely do: prompting a conversation, not replacing clinical judgment with an unearned number. Phrasing items as plain behavioral or frequency questions rather than ones requiring the respondent to have already assessed their own risk ("do you have high blood pressure risk") matters because self-assessment questions produce unreliable answers from people without clinical training — a frequency question ("how many days in the past month") is something anyone can answer accurately regardless of health literacy, which is exactly the design principle behind validated screening instruments used in real preventive care programs. The anonymous-compatible design rule exists because centralizing or ranking individual results turns a private self-reflection tool into something that functions like workplace health surveillance, which raises a different set of concerns entirely and isn't what this checklist is meant to be. The disclaimer stating explicitly that no score is calculated addresses a specific expectation mismatch: many people assume any checklist with yes/no questions must produce some kind of number, so the note has to say plainly that this one deliberately doesn't, and why.`,
    exampleOutput: `Note: this is a self-reflection tool, not a medical screening — it does not calculate a risk score. Sleep: In the past month, how many nights did you get less than 6 hours of sleep? / How many days did you feel tired despite a full night's sleep? If you answered yes to several of these, consider raising your sleep patterns with your doctor rather than assuming it's just normal tiredness.`,
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
    slug: 'healthcare-wellness-informed-consent-plain-language',
    category: 'healthcare-wellness',
    title: `Translate an informed consent form into plain language without softening what's actually being consented to`,
    description: `Rewrites a dense informed consent document into plain language a patient can genuinely understand before signing, preserving every risk and obligation at full strength, framed explicitly as a draft requiring legal and clinical sign-off before use.`,
    promptText: `You are rewriting an informed consent form into plain language so a patient can genuinely understand what they are agreeing to before signing — not summarizing it in a way that makes it easier to skim past.

ORIGINAL CONSENT FORM TEXT
{{original_consent_text}}

PROCEDURE OR TREATMENT THIS COVERS
{{procedure_covered}}

WHO WILL BE SIGNING
{{signer_context}}

TARGET READING LEVEL
{{target_reading_level}}

RULES
Rewrite each section (what the procedure involves, risks, alternatives, right to withdraw consent) in plain language, translating legal and clinical terms on first use, but preserve every specific risk, obligation, and right listed in the original exactly — a plain-language version that drops a risk because it was hard to phrase simply is worse than the dense original, since the whole point of consent is that nothing material gets lost. Do not soften the severity of any listed risk in the rewrite — if the original says a risk is "rare but serious," the plain version must convey both that it's rare and that it's serious, not just one or the other. Keep the structure of what the patient is actually agreeing to fully intact: what they're consenting to, what risks and alternatives they were told about, and their right to ask questions or withdraw consent, since a consent form that reads easily but reorganizes or trims these elements changes what it legally and ethically represents. Where the original text is ambiguous about what exactly is being authorized, do not resolve the ambiguity yourself in the plain-language version — flag it as a section that needs clarification from whoever drafted the original, since guessing at scope of consent is not a plain-language task.

WHAT NOT TO DO
Do not add reassuring language not present in the original ("this is a very safe procedure") and do not remove or shorten the alternatives section, even if it's the least-read part of the original document — alternatives are a core part of informed consent, not filler.

MANDATORY DISCLAIMER
Add a note to whoever requested this rewrite stating that this is a readability pass only, that it has not been reviewed for legal or clinical accuracy, and that a qualified clinician and, where applicable, legal or compliance counsel must review and approve the plain-language version against the original before it is used with any real patient for actual consent.

OUTPUT FORMAT
1. The rewritten plain-language consent form, section by section matching the original's structure.
2. A flagged-ambiguity list, if any.
3. The internal disclaimer note to the requester.`,
    variables: [
      {
        name: 'original_consent_text',
        description: `The actual consent form text to rewrite, pasted in full.`,
        example: `Dense legal-clinical text describing a minor outpatient surgical procedure, listing risks including infection, bleeding, and a rare but serious anesthesia complication, plus an alternatives section describing a non-surgical option.`,
        required: true,
      },
      {
        name: 'procedure_covered',
        description: `What procedure or treatment this consent form is for.`,
        example: `Outpatient hernia repair surgery under general anesthesia.`,
        required: true,
      },
      {
        name: 'signer_context',
        description: `Who will actually be reading and signing this.`,
        example: `Adult patients of varying reading levels and English proficiency, signing the morning of the procedure.`,
        required: true,
      },
      {
        name: 'target_reading_level',
        description: `The reading level target for the rewrite.`,
        example: `Sixth to eighth-grade reading level.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`informed-consent`, `plain-language`, `patient-rights`, `healthcare-compliance`, `legal-clinical-review`],
    whyItWorks: `Informed consent forms are a genuinely high-stakes readability task because the entire ethical and legal purpose of the document is that the patient actually understood what they agreed to — a plain-language rewrite that quietly drops a risk, trims the alternatives section, or softens "rare but serious" into just "rare" doesn't just read more smoothly, it changes what informed consent was actually obtained for, which is why the rule requires every risk, obligation, and right to be preserved at full strength rather than trading completeness for readability. The specific instruction to preserve both halves of a qualified risk statement (rare, and separately, serious) exists because simplification pressure naturally collapses two-part hedges into one, and a model optimizing purely for plain phrasing will tend to keep whichever half reads more smoothly and drop the other, silently changing the risk disclosure. Requiring the alternatives section to stay fully intact, even flagging it as often the least-read part of the original, addresses a known pattern in consent-form drafting where alternatives get compressed first because they feel secondary — but they're a required element of informed consent precisely because a patient can't meaningfully consent to one option without knowing what the others were. The instruction to flag rather than resolve ambiguity about the actual scope of what's being authorized matters because a plain-language rewrite is not the place to make a substantive legal or clinical decision about what a vague original clause covers — that has to go back to whoever drafted it. The mandatory disclaimer to the requester, not the patient, reflects that this is a draft in a compliance pipeline: a rewritten consent form must be checked against the original by both clinical and legal review before it can be used to obtain actual consent from a real patient.`,
    exampleOutput: `Rewritten: "This surgery repairs the weak spot in your abdominal wall (hernia) using general anesthesia, which means you'll be fully asleep. Risks include infection and bleeding, which happen sometimes. There's also a rare but serious risk related to the anesthesia itself. An alternative to surgery is a non-surgical option using a supportive belt, which doesn't fix the hernia but may reduce discomfort for some patients — your doctor can explain whether that's a reasonable choice for you." Internal note: readability pass only, not yet reviewed for legal or clinical accuracy — clinical and compliance sign-off required before patient use.`,
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
    slug: 'healthcare-wellness-public-health-campaign-messaging',
    category: 'healthcare-wellness',
    title: `Write public health campaign messaging that persuades without overstating what the evidence actually says`,
    description: `Drafts audience-specific messaging for a public health awareness campaign, keeping every factual claim tied to what's actually cited by the requester and routing any missing statistic back for verification instead of inventing one.`,
    promptText: `You are writing messaging for a public health awareness campaign aimed at a specific audience segment, for a specific action the campaign wants to encourage.

CAMPAIGN TOPIC AND GOAL
{{campaign_topic_and_goal}}

TARGET AUDIENCE SEGMENT
{{audience_segment}}

FACTS OR STATISTICS PROVIDED TO CITE
{{provided_facts}}

CHANNELS THIS WILL RUN ON
{{channels}}

BARRIERS THIS AUDIENCE FACES TO TAKING THE ACTION
{{known_barriers}}

RULES
Write messaging that addresses the specific barriers this audience actually faces (cost, access, distrust, inconvenience, competing priorities) rather than generic "here's why you should" messaging that assumes the only obstacle is awareness — if a barrier is access-related, the message should point toward removing that barrier (where to go, what it costs, whether it's free), not just repeat the recommendation more emphatically. Use only the facts or statistics explicitly provided to you, cited exactly as given — if a claim would strengthen the message but no supporting fact was provided, write a placeholder noting "insert verified statistic here" rather than inventing a plausible-sounding number, since a fabricated statistic in public health messaging is a credibility risk that can undermine the entire campaign if ever traced back. Match tone and format to the audience segment and channel, but do not use fear-based messaging that overstates risk beyond what the provided facts support — persuasive does not mean alarmist, and overstating risk to drive action tends to backfire into distrust once audiences sense the exaggeration. Write at least two variants where the campaign goal could reasonably be communicated with different framings (a benefit-forward frame and a barrier-removal frame) so the requester has a real choice, not a single take dressed up as the only option.

WHAT NOT TO DO
Do not name a specific health authority, study, or guideline as the source of a claim unless that source was given to you explicitly — attributing a claim to an unverified source is worse than leaving it unattributed.

MANDATORY DISCLAIMER
Add a note to the requester stating that every factual claim in this messaging must be verified against current public health guidance by a qualified public health official or clinician before publication, and that any placeholder statistic must be filled with a verified source before this campaign runs.

OUTPUT FORMAT
1. The internal disclaimer note.
2. Two messaging variants (benefit-forward, barrier-removal), each with headline and body copy sized for the stated channel.
3. A list of any placeholder statistics that still need a verified source.`,
    variables: [
      {
        name: 'campaign_topic_and_goal',
        description: `The topic and the specific action the campaign wants people to take.`,
        example: `Encouraging seasonal flu vaccination among adults who haven't gotten one in the past two years.`,
        required: true,
      },
      {
        name: 'audience_segment',
        description: `The specific audience this messaging targets.`,
        example: `Working adults aged 30-50 without a regular primary care provider, mostly reached through workplace channels.`,
        required: true,
      },
      {
        name: 'provided_facts',
        description: `The actual facts or statistics available to cite, given explicitly.`,
        example: `Local health department confirmed free flu shot clinics are available at three community sites through the end of November, no appointment needed.`,
        required: true,
      },
      {
        name: 'channels',
        description: `Where this messaging will actually appear.`,
        example: `Workplace break-room posters and a short internal email blast.`,
        required: true,
      },
      {
        name: 'known_barriers',
        description: `What's actually stopping this audience from taking the action.`,
        example: `Lack of a regular doctor makes it feel like a hassle to figure out where to go; many assume it costs money or requires an appointment.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`public-health-campaign`, `health-communication`, `campaign-messaging`, `behavior-change`, `risk-communication`],
    whyItWorks: `Public health messaging that only restates "you should do this" fails the audience that already knows the recommendation but faces a practical barrier to acting on it — addressing the specific named barrier (no regular provider, assumed cost or appointment hassle) rather than generic persuasion is what actually moves behavior, because the messaging now removes the exact obstacle in the audience's way instead of repeating information they've likely already heard. The instruction to use only explicitly provided facts and to insert a placeholder rather than inventing a statistic addresses a specific and serious risk in public health content: a fabricated number that later gets fact-checked and found wrong doesn't just discredit that one claim, it gives skeptical audiences a concrete reason to distrust the entire campaign, which is a much larger cost than a temporary placeholder. Capping the intensity of the messaging to what the provided facts actually support, rather than allowing fear-based escalation, reflects a well-established pattern in health communication research: messaging that overstates risk to drive urgency tends to produce short-term compliance at the cost of longer-term credibility once the audience recognizes the exaggeration, which is a worse outcome for a campaign that will need to be trusted again in future cycles. Requiring two distinct framings (benefit-forward versus barrier-removal) rather than a single take gives the requester an actual choice grounded in which barrier matters more for this specific audience, instead of presenting one draft as though it were the only reasonable option. The disclaimer requiring verification of every factual claim before publication exists because campaign messaging is public-facing content representing an organization's authority on health guidance, and that authority is only as good as the accuracy of what it claims — a step no drafting tool can substitute for.`,
    exampleOutput: `Barrier-removal variant — headline: "No doctor? No appointment needed." Body: "Get your flu shot at one of three community clinics through the end of November — free, walk-in, no appointment required." Placeholder flagged: none used, all claims traced to the provided fact about free walk-in clinics.`,
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
    slug: 'healthcare-wellness-health-content-accuracy-qa',
    category: 'healthcare-wellness',
    title: `Run a health content draft through a claim-by-claim QA pass before it goes anywhere near publish`,
    description: `Audits a draft piece of health or wellness content claim by claim, separating what's supported by cited sources from what's asserted without one, and flagging anything that reads as diagnostic or prescriptive for a clinician to review before it ships.`,
    promptText: `You are running a quality-assurance pass on a draft piece of health or wellness content before it goes to a clinician for final review. Your job is to find every problem, not to make the draft sound more finished than it is.

DRAFT CONTENT
{{draft_content}}

SOURCES OR CITATIONS PROVIDED
{{sources_provided}}

INTENDED PUBLICATION CONTEXT
{{publication_context}}

AUDIENCE
{{intended_audience}}

PROCESS
Go through the draft claim by claim. For each factual or clinical claim, mark it as: supported by a provided source (cite which one), asserted without a provided source, or written in a way that's vague enough to be unverifiable as stated — vague claims are still a problem, since "studies show" without a specific source is functionally an unsupported claim wearing a disguise. Separately flag any sentence that reads as personalized medical advice, a specific treatment recommendation, or a diagnostic statement ("if you have X symptom, you likely have Y") rather than general information, since that category needs to be rewritten as general education framed for a reader to discuss with their own clinician, not asserted as applicable to any individual reader. Check whether the content anywhere implies certainty inconsistent with the strength of the underlying evidence (a single small study written up as settled fact, a common but unproven folk claim stated as established) and flag the mismatch specifically. Do not fix these problems yourself in this pass — this is a QA report, not a rewrite, so the person who wrote the draft or the clinician reviewing it makes the actual edit decisions.

WHAT NOT TO DO
Do not add a citation of your own to fill a gap you found, and do not soften your assessment of a flagged claim because the surrounding writing is otherwise good — a QA pass that pulls punches to be polite defeats its own purpose.

MANDATORY DISCLAIMER
Open the QA report with a note stating that this pass checks internal consistency, sourcing, and tone against the material provided, that it is not itself a clinical fact-check, and that final medical accuracy sign-off must come from a qualified clinician before publication regardless of how this report reads.

OUTPUT FORMAT
1. The disclaimer.
2. A claim-by-claim table: claim (quoted), status (supported / unsourced / vague-unverifiable), note.
3. A separate list of any sentences flagged as personalized-advice or diagnostic-sounding language, with the exact quote.
4. A short overall risk summary: how many high-priority issues before this should go to clinical review.`,
    variables: [
      {
        name: 'draft_content',
        description: `The actual draft content being QA'd, pasted in full.`,
        example: `A 600-word blog post about magnesium and sleep quality, including the line 'studies show magnesium significantly improves sleep for most adults' with no citation attached.`,
        required: true,
      },
      {
        name: 'sources_provided',
        description: `Whatever citations or sources actually exist for the claims in the draft.`,
        example: `One small 2012 study on magnesium supplementation and self-reported sleep quality in older adults with insomnia, provided as a link.`,
        required: true,
      },
      {
        name: 'publication_context',
        description: `Where and how this content will be published.`,
        example: `Public-facing wellness blog on a supplement retailer's website.`,
        required: true,
      },
      {
        name: 'intended_audience',
        description: `Who this content is written for.`,
        example: `General adult consumers researching sleep aids, no assumed medical background.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`health-content-qa`, `content-accuracy`, `editorial-review`, `misinformation-check`, `medical-fact-check`],
    whyItWorks: `The specific trap in health content QA is a vague-but-confident claim like "studies show" that sounds sourced without actually citing anything checkable — treating that phrasing as its own flagged category, distinct from a plainly unsourced claim, matters because a lazy content-QA pass would only catch claims with zero supporting language and miss the more common pattern of hedge-language doing the work of a citation without any of its accountability. Separating "supported," "unsourced," and "vague-unverifiable" into three distinct statuses rather than a binary sourced/unsourced check gives whoever reviews the report a much more actionable picture, since a vague claim and a flatly unsupported one require slightly different fixes (add a real citation versus rewrite the claim entirely). Flagging sentences that read as personalized advice or diagnostic framing as a wholly separate category from sourcing issues addresses a distinct risk: a claim can be perfectly well-sourced in general and still be dangerous if it's phrased in a way that lets an individual reader apply it to themselves as a diagnosis ("if you have X, you likely have Y"), which is a framing problem, not a citation problem, and needs to be caught even when the underlying fact is accurate. The instruction against the model fixing the draft itself, and against softening flagged issues to be polite, keeps this pass functioning as a QA gate rather than a co-authoring pass — a QA report that quietly resolves issues on the writer's behalf, or downgrades a real problem because the prose reads well, stops being a reliable gate before it reaches clinical review. The disclaimer is explicit that this pass is not itself a clinical fact-check, because internal consistency and sourcing checks are necessary but not sufficient — only a qualified clinician can confirm the underlying medical accuracy the sourcing check assumes.`,
    exampleOutput: `Note: this checks sourcing, consistency, and framing only — it is not a clinical fact-check; final sign-off must come from a qualified clinician. Claim: "studies show magnesium significantly improves sleep for most adults" — status: vague-unverifiable (no specific source named in the sentence, and the one provided source is a small study on older adults with insomnia, not "most adults" generally). Flagged as overreaching relative to the underlying evidence.`,
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
    slug: 'healthcare-wellness-patient-health-education-handout',
    category: 'healthcare-wellness',
    title: `Write a day-to-day self-care handout for a specific recovery period without turning it into medical advice`,
    description: `Produces a practical, day-by-day patient education handout for managing a specific recovery or condition-management period at home, sticking to general self-care guidance and routing anything patient-specific back to the care team.`,
    promptText: `You are writing a patient education handout for managing a specific recovery period or condition day-to-day at home. This is general self-care guidance meant to accompany, not replace, whatever the patient's own care team already told them.

CONDITION OR RECOVERY PERIOD
{{condition_or_recovery}}

TYPICAL DAY-TO-DAY MANAGEMENT TASKS
{{daily_management_tasks}}

WHAT SHOULD PROMPT CALLING THE CARE TEAM
{{warning_signs}}

READER CONTEXT
{{reader_context}}

ANYTHING SPECIFIC TO THIS PRACTICE'S PROTOCOL
{{practice_specific_notes}}

RULES
Organize the handout day-by-day or stage-by-stage for the recovery period rather than as one undifferentiated list of tips, since a patient managing something like a post-op recovery needs to know what's expected of them today specifically, not a flat list they have to mentally sequence themselves. Write guidance as general, widely-applicable self-care practices (rest, hydration, activity pacing, wound or symptom monitoring in general terms) rather than anything that depends on the individual patient's specific risk factors, other conditions, or medications — if a tip would need to be adjusted for someone on blood thinners or with diabetes, for example, note that as "ask your care team if this applies differently to you" rather than writing one version and hoping it fits everyone. Make the warning-signs section impossible to miss — its own clearly labeled section, not folded into general tips — and write it as specific, recognizable signs (a described symptom, not a clinical term) paired with exactly what to do (call the office, go to urgent care, call emergency services) rather than a vague "contact your doctor if you have concerns."

WHAT NOT TO DO
Do not include a specific medication name, dose, or schedule unless it was explicitly given to you in the practice-specific notes — general handouts should say "take your prescribed medication as directed" rather than guessing at a typical regimen, since guessing here could contradict what this specific patient was actually told.

MANDATORY DISCLAIMER
Open the handout with a note stating that this is general self-care information, not a substitute for the specific instructions given by the patient's own care team, and that anything in this handout that conflicts with what their provider told them should be resolved by asking their provider, not by following this handout instead — and close with a note to the practice that clinical staff should review this handout before it's given to patients.

OUTPUT FORMAT
1. The opening disclaimer.
2. Day-by-day or stage-by-stage self-care guidance.
3. A clearly separated "call your care team if..." section.
4. The closing note to clinical staff about review before distribution.`,
    variables: [
      {
        name: 'condition_or_recovery',
        description: `The specific recovery period or condition this handout covers.`,
        example: `First two weeks of recovery after an outpatient knee arthroscopy.`,
        required: true,
      },
      {
        name: 'daily_management_tasks',
        description: `What the patient is generally expected to do day-to-day during this period.`,
        example: `Ice and elevate the knee several times a day, gradually increase weight-bearing as tolerated, attend the first PT session around day 10.`,
        required: true,
      },
      {
        name: 'warning_signs',
        description: `Specific signs that should prompt contacting the care team or seeking urgent care.`,
        example: `Increasing redness or warmth around the incision, fever, calf pain or swelling, or sudden increased pain not controlled by prescribed medication.`,
        required: true,
      },
      {
        name: 'reader_context',
        description: `Who will actually be reading and using this handout.`,
        example: `Adult patients discharged same-day after surgery, often reading this at home while still somewhat groggy from anesthesia, sometimes with a caregiver reading it to them.`,
        required: true,
      },
      {
        name: 'practice_specific_notes',
        description: `Anything specific to how this particular practice manages this recovery.`,
        example: `This practice's standard protocol includes a follow-up call from a nurse on day 3, separate from the day-10 PT appointment.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`patient-education`, `recovery-guidance`, `healthcare-handout`, `post-op-care`, `self-care-instructions`],
    whyItWorks: `Patient handouts commonly fail by presenting recovery as a flat list of tips rather than a sequence, which forces a patient who is often reading it while still groggy or in pain to do the mental work of figuring out what applies today versus next week — organizing the handout day-by-day or stage-by-stage does that sequencing for them, which matters most exactly when their capacity to do it themselves is lowest. Writing guidance only at the level of general self-care practices, and explicitly routing anything that depends on individual risk factors (blood thinners, diabetes, other conditions) back to "ask your care team," prevents the handout from silently functioning as personalized medical advice for a population of patients who don't all share the same risk profile — a tip that's safe for a healthy 30-year-old can be actively wrong for someone with a bleeding disorder, and a general handout has no way to know which reader is which. Making the warning-signs section its own unmissable block, described in plain recognizable symptoms rather than clinical terms, and paired with a specific action rather than a vague "contact your doctor if concerned," directly targets the actual failure mode of buried warning signs — a patient skimming a long handout is far more likely to notice a clearly labeled, separated section than a warning folded into paragraph six. The ban on inventing a specific medication name or dose unless it was explicitly provided addresses a genuinely dangerous failure mode: a plausible-sounding but wrong dosage guess in a handout could directly contradict what this particular patient's surgeon actually prescribed, so the handout defers to "as directed" rather than guessing. The clinical-review note at the close exists because, however carefully structured, this is still a draft entering a real clinical publishing workflow and needs sign-off before a patient ever sees it.`,
    exampleOutput: `Note: this is general self-care guidance, not a substitute for what your surgical team told you — if anything here conflicts with their instructions, follow their instructions and ask them to clarify. Days 1-3: ice the knee 20 minutes every 2-3 hours, keep it elevated above heart level when resting, take prescribed medication as directed. Call your care team if: the incision area becomes increasingly red or warm, you develop a fever, or you notice new calf swelling or pain — these should be reported the same day, not saved for your next appointment.`,
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
]
