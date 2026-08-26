import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'hr-management-job-description-scorecard-aligned-jd',
    category: 'hr-management',
    title: `Write a job description that matches the actual hiring bar instead of a wish list nobody meets`,
    description: `Turns a hiring manager's notes into a job description built around a true must-have vs. nice-to-have split, so the posting attracts candidates who can actually clear the bar instead of scaring off good ones with an inflated requirements list.`,
    promptText: `You are drafting a job description for a specific open role, working from a hiring manager's raw notes rather than a generic template. Your job is to separate what this role genuinely requires on day one from what is aspirational, and to write a posting that reflects that split honestly.

ROLE AND TEAM CONTEXT
{{role_and_team}}

HIRING MANAGER'S RAW NOTES
{{raw_notes}}

MUST-HAVE VS NICE-TO-HAVE SIGNAL
{{requirement_signal}}

WHAT SUCCESS LOOKS LIKE AT 6 MONTHS
{{six_month_success}}

COMPENSATION AND LOCATION CONSTRAINTS
{{comp_and_location}}

RULES FOR BUILDING THE REQUIREMENTS LIST
Read the raw notes and separate every requirement into one of two buckets: things a candidate literally cannot do the job without, and things that are genuinely helpful but the manager would still interview someone missing them. If the notes list more than five items as "required," push back inside your output — note explicitly which of those you moved to preferred and why, rather than silently keeping an inflated list, since a bloated requirements section is the single biggest reason qualified candidates self-select out before applying. Do not invent a requirement that is not implied by the notes or the six-month success definition, and do not pad the list with generic filler like "strong communication skills" unless the notes point at a specific communication failure mode this role needs to avoid repeating.

WRITING RULES
Open with two sentences on what the person in this seat will actually own, not a company boilerplate paragraph. Write the day-to-day responsibilities as what the person does, tied to the six-month success definition, not a duty list copied from the last posting. Keep the tone specific enough that someone doing this exact job today would recognize it as their own role, not a generic version of the title. If compensation range or location policy is given, state it plainly and do not hedge around it.

WHAT NOT TO DO
Do not use gendered or age-coded language ("digital native," "young and energetic") or credential-inflation phrases ("rockstar," "ninja"). Do not list a degree requirement unless the notes explicitly require one for a licensing or regulatory reason.

OUTPUT FORMAT
1. The job description itself, ready to post, with sections for Role Summary, What You'll Own, Must-Have Requirements, Preferred Requirements, and Compensation/Location.
2. A short callout listing any requirement you moved from "must-have" in the notes to "preferred" in the output, and the one-line reason.`,
    variables: [
      {
        name: 'role_and_team',
        description: `The title, team, and who this person reports to.`,
        example: `Senior Data Analyst, reporting to the Head of Growth, on a 5-person analytics team supporting a subscription SaaS product.`,
        required: true,
      },
      {
        name: 'raw_notes',
        description: `The hiring manager's unstructured notes on what they want, copy-pasted as-is.`,
        example: `Needs SQL, dbt experience, Python nice to have, 5+ years exp, needs to present to execs, familiar with Looker, should know statistics, MBA preferred, needs to manage a junior analyst eventually.`,
        required: true,
      },
      {
        name: 'requirement_signal',
        description: `Anything you already know about which listed requirements are truly non-negotiable versus aspirational.`,
        example: `SQL and dbt are non-negotiable since the team's whole stack runs on it; the MBA and people-management line were the manager thinking out loud, not real requirements for this hire.`,
        required: false,
      },
      {
        name: 'six_month_success',
        description: `What this person will have delivered or be doing by month six.`,
        example: `Owns the weekly growth metrics dashboard independently and has shipped one self-serve analysis that changed a pricing decision.`,
        required: true,
      },
      {
        name: 'comp_and_location',
        description: `Salary range and location/remote policy for this role, if set.`,
        example: `$110k-$135k base, hybrid 2 days/week in the Austin office, no remote option for this particular team.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `job-description`,
      `hiring`,
      `recruiting`,
      `job-posting`,
      `talent-acquisition`,
    ],
    whyItWorks: `The core failure mode this prompt targets is well documented in hiring research: requisitions written by committee or lifted from an old posting accumulate requirements nobody actually needs, and candidates — particularly those from underrepresented groups, per widely cited internal hiring studies at large tech companies — will not apply unless they meet nearly all of them, while over-confident but under-qualified candidates apply anyway. Forcing the model to bucket every line from the raw notes into must-have or preferred, and to explicitly flag anything it demoted, creates an auditable trail the hiring manager can react to ("actually no, the MBA line really does matter because...") rather than a silent rewrite they have to reverse-engineer. Anchoring the requirements to a stated six-month success definition gives the model a concrete test for each requirement — would missing this actually block the person from hitting that outcome — instead of the vaguer instruction to "only include necessary requirements," which GPT-5.1 will otherwise satisfy by simply keeping the list roughly as-is and softening the language. The explicit ban on gendered and inflation language matters because these are exactly the phrases that survive default drafting since they read as enthusiastic rather than exclusionary on a first pass, and a model asked generically to "write an inclusive JD" will often only catch the most obvious slurs, not the subtler coded phrases. Naming a hard cap ("more than five" required items) gives the model a concrete threshold to push back against rather than an open-ended judgment call it can rationalize away.`,
    exampleOutput: `Role Summary: You'll own the growth team's core metrics infrastructure and be the first analytical voice in pricing and retention decisions... Must-Have Requirements: Advanced SQL, hands-on dbt experience, ability to present findings directly to execs. Preferred: Python, Looker familiarity, prior people-management exposure. Callout: Moved 'MBA preferred' and 'manage a junior analyst' from required to preferred/removed — neither is needed to hit the 6-month dashboard-ownership goal described.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-candidate-scorecard-panel-consistency',
    category: 'hr-management',
    title: `Build a candidate scorecard that stops a 4-person panel from scoring the same interview four different ways`,
    description: `Generates a per-candidate scorecard tied to the specific competencies this role was actually interviewed for, so a hiring panel's individual scores are comparable instead of reflecting how generous or strict each interviewer happens to be.`,
    promptText: `You are building a candidate scorecard for a specific role, to be filled out by each interviewer independently right after their interview slot, before the panel debrief.

ROLE BEING HIRED FOR
{{role_title}}

COMPETENCIES THIS PANEL IS INTERVIEWING FOR
{{competencies}}

WHO INTERVIEWS FOR WHICH COMPETENCY
{{interviewer_assignments}}

PAST SCORING INCONSISTENCY YOU'VE SEEN
{{past_inconsistency}}

Build the scorecard as one row per competency, each with a 1-4 scale (not 1-5 — force a lean rather than a comfortable middle score) and a one-line behavioral anchor for what a 1, 2, 3, and 4 look like specifically for that competency in this role, not a generic scale reused across competencies. Every anchor must describe an observable behavior or answer quality from the actual interview, not an inference about the candidate's character — "gave a concrete example with a measurable outcome" is scorable, "seemed smart" is not. For every competency, add a required text field prompting the interviewer to write the specific evidence (a quote, an example the candidate gave) that led to their score, since a number with no evidence is unusable at debrief and is the exact failure mode described in the past-inconsistency note. Include one field at the end for a clear hire/no-hire lean and a one-sentence reason, separate from the competency scores, because a panel debrief needs the interviewer's actual recommendation, not just an average of numbers that can mask a single disqualifying red flag. If the past-inconsistency note describes a specific pattern (e.g., one interviewer always scores high, or scores drift based on interview order), add one line of guidance directly on the scorecard addressing that exact pattern.

WHAT NOT TO DO
Do not create a single generic "culture fit" line — if culture or values matter to this hire, name the specific observable behavior that represents it (per the competencies list) rather than an unscorable catch-all that tends to be used to justify decisions made on other, unstated grounds.

OUTPUT FORMAT
A fillable scorecard: one section per competency (name, 1-4 scale with the four behavioral anchors, evidence field), then a final Hire Lean section. Keep it to something an interviewer can complete in under 5 minutes right after the interview ends.`,
    variables: [
      {
        name: 'role_title',
        description: `The role this candidate is interviewing for.`,
        example: `Staff Backend Engineer, Payments team`,
        required: true,
      },
      {
        name: 'competencies',
        description: `The specific competencies this interview loop is structured around.`,
        example: `System design under real constraints, debugging a live incident scenario, mentoring/code review judgment, and communicating a tradeoff to a non-technical stakeholder.`,
        required: true,
      },
      {
        name: 'interviewer_assignments',
        description: `Which interviewer owns which competency, so the scorecard can be split per person if needed.`,
        example: `Priya covers system design, Marco covers the debugging scenario, Dee covers mentoring and communication.`,
        required: false,
      },
      {
        name: 'past_inconsistency',
        description: `A specific scoring pattern this team has seen go wrong before.`,
        example: `Whoever interviews last in the day tends to score a full point lower than whoever interviews first, regardless of the candidate.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `candidate-scorecard`,
      `hiring`,
      `interview-process`,
      `recruiting`,
      `panel-interview`,
    ],
    whyItWorks: `Structured interviewing research (most notably Google's own re:Work findings and decades of industrial-organizational psychology on interview validity) consistently shows that unstructured, holistic "gut feel" scoring has close to zero predictive validity, while structured scoring against pre-defined behavioral anchors dramatically improves both predictive validity and inter-rater agreement — the entire value of a scorecard comes from forcing comparable judgments, not from the form itself. A 1-4 scale rather than 1-5 is a deliberate mechanism to eliminate the safe, noncommittal middle score that raters gravitate toward when uncertain, which is exactly the score that provides no signal at debrief. Requiring a written evidence field next to every number addresses the specific failure mode of a debrief where four interviewers each say "I gave a 3" with no way to tell whether they mean the same thing by it — the evidence field is what actually gets compared, with the number serving only as a sort key. Separating the hire/no-hire lean from the competency average matters mechanically because averaging can mathematically wash out a single disqualifying signal (a strong system-design score cannot offset a candidate who was dishonest about a past project), so the recommendation needs to be captured as its own explicit judgment rather than derived. Feeding in a specific known scoring-drift pattern lets the model add one targeted counter-instruction on the form itself, which is more likely to actually change interviewer behavior in the moment than a generic "be consistent" reminder given once in a training session weeks earlier.`,
    exampleOutput: `System Design (1-4): 1 = could not identify the core bottleneck even with hints; 2 = identified bottleneck but proposed solution ignored a stated constraint; 3 = proposed a workable design, missed one edge case; 4 = proposed a workable design and proactively flagged the tradeoff we were testing for. Evidence: [interviewer fills in]. Hire Lean: Hire / No Hire / Lean Hire, one sentence why.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-interview-rubric-calibration-before-loop',
    category: 'hr-management',
    title: `Calibrate what a 1 through 4 actually means before four interviewers disagree about it in the debrief`,
    description: `Produces the scoring rubric itself — the shared definition of what each competency and each score level means — that a hiring panel reviews together before interviews start, so scorecards filled out later are measuring the same thing.`,
    promptText: `You are writing the interview scoring rubric for a role — the calibration document a panel reviews together in a 15-minute pre-loop meeting, before any interviews happen. This is not the per-candidate scorecard; it is the shared reference that defines what each score level means, so that a "3" from one interviewer means the same thing as a "3" from another.

ROLE
{{role_title}}

COMPETENCIES TO CALIBRATE
{{competencies}}

A REAL PAST CANDIDATE ANSWER PER COMPETENCY, IF AVAILABLE
{{example_answers}}

COMMON DISAGREEMENT THIS PANEL HAS HAD
{{past_disagreement}}

For each competency, write a short definition of what it means specifically in this role (not a dictionary definition of the competency in general), then four behavioral anchors for scores 1 through 4, each describing what an interviewer would actually observe or hear, phrased so two different people watching the same answer would independently land on the same score. If a real past candidate answer is provided for a competency, use it as a worked example: state what score that answer would earn under this rubric and exactly why, since a worked example calibrates a panel faster than an abstract anchor alone. Where the past-disagreement note describes a specific point of confusion (e.g., the panel couldn't agree whether a candidate who used an AI tool during a live coding round should be scored down), resolve that exact question explicitly in the rubric rather than leaving it as unaddressed edge-case ambiguity that will resurface in the next loop.

STRUCTURE THIS AS A CALIBRATION DISCUSSION, NOT A FORM
Unlike a scorecard, this document should read as guidance to be discussed and adjusted by the panel before it's finalized — include one open question per competency where the anchors are genuinely debatable, so the panel has something concrete to align on rather than silently rubber-stamping a document nobody actually agreed to.

OUTPUT FORMAT
One section per competency: definition, four scored anchors, worked example (if given), and one open calibration question. End with a short paragraph on how this rubric relates to but differs from the scorecard interviewers will fill out per candidate.`,
    variables: [
      {
        name: 'role_title',
        description: `The role this rubric is being built for.`,
        example: `Customer Success Manager, mid-market segment`,
        required: true,
      },
      {
        name: 'competencies',
        description: `The competencies the interview loop is structured around.`,
        example: `Handling an angry customer escalation, identifying an upsell opportunity organically, and cross-functional advocacy for a customer's feature request.`,
        required: true,
      },
      {
        name: 'example_answers',
        description: `A real anonymized answer from a past interview, to use as a calibration anchor.`,
        example: `For the escalation question, one past candidate said they'd 'apologize and offer a discount immediately' with no diagnostic questions asked first.`,
        required: false,
      },
      {
        name: 'past_disagreement',
        description: `A specific point where this panel has previously disagreed on scoring.`,
        example: `Two interviewers disagreed on whether a candidate who admitted they'd never used our specific CRM tool should be scored down on the upsell competency.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `interview-rubric`,
      `hiring-calibration`,
      `structured-interviewing`,
      `recruiting`,
      `panel-training`,
    ],
    whyItWorks: `The distinction this prompt enforces — a rubric as a shared pre-loop calibration document versus a scorecard as a per-candidate scoring form — mirrors how structured-interviewing programs at mature talent-acquisition functions actually separate the two artifacts, because conflating them is exactly how panels end up disagreeing at debrief without realizing they were scoring different definitions of the same number the whole time. Using a real past candidate answer as a worked example is the single highest-leverage calibration technique available: an abstract anchor like "handles escalation well" is interpreted differently by every reader, but showing an actual transcript and asking "what would this score, and why" forces the panel to argue out their disagreement on a concrete case before it costs a real candidate a fair evaluation. Resolving a named past disagreement explicitly, rather than leaving the rubric to imply a general principle and hoping it generalizes, matters because the disagreements that actually recur in a real hiring loop tend to be specific edge cases (tool familiarity, live-AI-assistance, a candidate who over-prepared a rehearsed answer) that a generic rubric never anticipates — writing the resolution into the document is the only way it survives contact with the next controversial candidate. Deliberately including an open calibration question per competency, rather than presenting the rubric as finished, exploits the fact that a panel that is handed a document to silently accept will not internalize it the way a panel that argues through one debatable point per competency will — the discussion itself is what produces consistent scoring later, not the document's existence.`,
    exampleOutput: `Competency: Handling an Angry Escalation. Definition: can the candidate de-escalate before jumping to a remedy? Anchor 3: 'asks at least one diagnostic question before offering any concession, stays calm, offers a specific next step.' Worked example: the past answer offering an immediate discount with no diagnostic question would score a 2 under this rubric — jumps straight to remedy, no de-escalation step. Open question: should offering a discount immediately ever score a 3 if the customer is clearly a high-value account?`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-interview-questions-competency-probes',
    category: 'hr-management',
    title: `Generate interview questions with the follow-up probes that catch a rehearsed answer`,
    description: `Writes a set of role-specific interview questions, each paired with two or three follow-up probes designed to surface real depth or expose a memorized answer, plus a flag on any question that risks drifting into illegal or discriminatory territory.`,
    promptText: `Write interview questions for the role and competencies below, for a single interview slot of a specific length. Every question needs follow-up probes attached, not just the headline question, because the headline question alone rarely distinguishes a candidate who lived the experience from one who prepared a polished story about it.

ROLE
{{role_title}}

COMPETENCIES TO PROBE IN THIS SLOT
{{competencies}}

INTERVIEW SLOT LENGTH
{{slot_length}}

RED FLAGS THIS ROLE SPECIFICALLY CARES ABOUT
{{role_red_flags}}

For each competency, write one primary behavioral question ("tell me about a time...") and then two or three follow-up probes that go after specifics a rehearsed answer usually skips: what exactly the candidate personally did versus what their team did, what the actual measurable outcome was, what they would do differently now, and what constraint or disagreement they had to navigate that a clean success story tends to omit. Order the questions so the total time fits the given slot length, allowing roughly 8-10 minutes per competency including probes, and note where to cut if the candidate's answer is already thorough and where to dig if it's noticeably vague. Where a role-specific red flag is given, include at least one question or probe designed to surface it directly rather than hoping it comes up incidentally.

COMPLIANCE CHECK
After the question list, review every question for topics that are illegal or inadvisable to ask in a hiring interview in most US jurisdictions (age, marital or family status, disability, religion, national origin, salary history where banned by local law) and flag any question that risks touching one of these, with a suggested rewrite that gets at the legitimate underlying concern without the risky framing. Do not silently omit the flag — even if you don't think a question crosses the line, if it is adjacent to one of these topics, say so explicitly so the interviewer can judge it themselves.

OUTPUT FORMAT
One section per competency (primary question, 2-3 probes, rough time allocation), followed by a Compliance Check section listing any flagged question, why, and the suggested rewrite.`,
    variables: [
      {
        name: 'role_title',
        description: `The role being interviewed for.`,
        example: `Field Sales Manager, covering a 6-person regional team`,
        required: true,
      },
      {
        name: 'competencies',
        description: `The specific things this interview slot needs to assess.`,
        example: `Coaching a rep through a lost deal, managing a rep who's missing quota, and adapting a sales process across two very different regional markets.`,
        required: true,
      },
      {
        name: 'slot_length',
        description: `How long the actual interview slot is.`,
        example: `45 minutes including intro and candidate questions at the end`,
        required: true,
      },
      {
        name: 'role_red_flags',
        description: `A specific concern this hiring team has been burned by before with this type of role.`,
        example: `We've hired sales managers before who could talk a great game about coaching but had actually never run a real 1:1 skill-building session, just performance write-ups.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `interview-questions`,
      `behavioral-interviewing`,
      `hiring-compliance`,
      `recruiting`,
      `candidate-assessment`,
    ],
    whyItWorks: `The mechanistic reason a headline behavioral question alone under-performs is well established in interviewing practice: a candidate who has done ten interviews for similar roles has almost certainly rehearsed a polished STAR-format answer to "tell me about a time you coached someone," so the differentiating signal lives in the follow-up, where an unrehearsed candidate either produces specific, consistent detail or starts contradicting themselves and hedging. Naming the specific probe categories — personal contribution versus team's, measurable outcome, what they'd change, the constraint a clean story tends to omit — gives the model a concrete template for manufacturing exactly the kind of probe that catches this, rather than generating generic "can you tell me more?" filler that a prepared candidate handles as easily as the original question. Building in the time-per-competency allocation matters practically because interviewers without an explicit budget tend to let the first question run long and then have to rush or skip the last competency entirely, silently turning a three-competency loop into a two-competency one without anyone noticing until the debrief has a gap. The compliance check is included as a mandatory, non-optional pass specifically because interview questions drift into legally risky territory gradually and innocuously — a manager asking about "availability for a demanding schedule" is often reaching for a legitimate concern about the role's hours but is one follow-up question away from effectively asking about caregiving responsibilities, which is exactly the kind of adjacent-but-not-explicit risk a single compliance pass is designed to catch before it reaches a real candidate.`,
    exampleOutput: `Coaching a rep through a lost deal — Primary: Tell me about a time you coached a rep after they lost a deal they were confident about. Probes: What specifically did you say to them versus what did they figure out on their own? What was different about their next deal? What would you do differently if you coached that same conversation again today? Compliance flag: none in this section. Time: ~9 minutes.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-onboarding-plan-first-two-weeks',
    category: 'hr-management',
    title: `Build a first-two-weeks onboarding plan that gets a remote hire to their first real contribution, not just a meetings calendar`,
    description: `Produces a day-by-day onboarding schedule for a new hire's first two weeks, anchored to one concrete early contribution they'll make, instead of a generic checklist of orientation meetings that leaves the new hire unsure what they're actually supposed to be doing.`,
    promptText: `Build a day-by-day onboarding plan for the first two weeks of a new hire, for the role and context below. The goal is not just "complete orientation" — it's getting this person to one real, visible contribution before the two weeks are up, so they leave week two knowing they've already added value rather than just having sat through meetings.

ROLE AND START CONTEXT
{{role_and_context}}

TEAM STRUCTURE AND WHO THEY'LL WORK WITH
{{team_structure}}

SPECIFIC TOOLS/SYSTEMS ACCESS THEY NEED
{{tools_and_access}}

FIRST REAL CONTRIBUTION TARGET
{{first_contribution}}

What has gone wrong in past onboarding for this team
{{past_onboarding_failure}}

Build the plan across 10 working days. Days 1-2 should cover the unavoidable logistics (access, tooling, key introductions) but compress them — do not let orientation sprawl past day 2, since a new hire who is still doing pure logistics by day 4 loses momentum and starts to disengage. From day 3 onward, structure every day around building toward the stated first-contribution target: what they need to learn or shadow, who they need to talk to, and what small piece of real work they can start touching, even in a limited or supervised way, well before day 10. Name specific people from the team structure for specific days ("pair with Jordan on a live ticket") rather than generic placeholders like "meet with team members," since vague introductions are the exact thing that makes a new hire's first week feel unstructured. If a past onboarding failure is named, build a specific counter-measure into the relevant day rather than a generic "communicate clearly" fix.

END-OF-WEEK-TWO CHECK-IN
End the plan with a short structured check-in agenda for the manager to run at the end of day 10: what the new hire has learned, what they contributed, what's still confusing, and one thing the plan should adjust for the next new hire based on how this one actually went.

OUTPUT FORMAT
A table or day-by-day list (Day 1 through Day 10), each day with 2-4 concrete items, followed by the End-of-Week-Two Check-In agenda.`,
    variables: [
      {
        name: 'role_and_context',
        description: `The role, whether remote/hybrid, and any relevant start-date context.`,
        example: `Backend Engineer joining a fully remote, distributed-across-timezones platform team, starting the Monday after a long weekend.`,
        required: true,
      },
      {
        name: 'team_structure',
        description: `Who's on the team and who the new hire will actually interact with, by name and role.`,
        example: `Manager is Alex; Jordan is the closest peer engineer who'll do most pairing; Sam owns the on-call rotation the new hire will eventually join.`,
        required: true,
      },
      {
        name: 'tools_and_access',
        description: `The specific systems, repos, or accounts they'll need provisioned.`,
        example: `GitHub org access, staging environment credentials, VPN, and read access to the incident-response runbook repo.`,
        required: true,
      },
      {
        name: 'first_contribution',
        description: `The concrete, real piece of work you want them to have touched by day 10.`,
        example: `Ship a small, low-risk bug fix to production with Jordan reviewing, even if it's just a one-line fix, so they've been through the real deploy process once.`,
        required: true,
      },
      {
        name: 'past_onboarding_failure',
        description: `A specific thing that has gone wrong onboarding people onto this team before.`,
        example: `The last two hires didn't get staging access until day 5 because IT tickets sat unclaimed, which killed a week of momentum.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `onboarding-plan`,
      `new-hire-experience`,
      `remote-onboarding`,
      `people-management`,
      `employee-experience`,
    ],
    whyItWorks: `Onboarding research consistently identifies time-to-first-contribution as one of the strongest predictors of new-hire retention and engagement, because a new hire's sense of competence and belonging forms in the first two to three weeks and is driven far more by having done something real than by having attended orientation sessions — this is why the prompt structures the entire plan backward from a named first-contribution target rather than forward from a checklist of logistics. Capping pure logistics at two days addresses a specific, common failure pattern where IT provisioning delays and calendar-driven orientation sprawl silently eat the first week, so by the time real work starts the new hire has already disengaged or started to worry they were a bad hiring decision. Naming specific real people for specific days rather than "meet the team" placeholders matters because a generic introduction schedule produces exactly the kind of onboarding experience new hires describe as isolating even when every box was technically checked — a plan that says "pair with Jordan on a live ticket Wednesday" creates an actual accountable commitment that shows up on Jordan's calendar too, whereas a vague plan tends to quietly not happen. Feeding in a specific named past failure and requiring a counter-measure rather than generic advice forces the plan to fix the actual thing that broke last time (e.g., an access-provisioning bottleneck) instead of producing the same generic template that already failed to prevent it once. The structured end-of-week-two check-in closes the loop by turning the new hire's actual lived experience into an input for improving the next onboarding cycle, rather than treating the plan as a one-time artifact nobody revisits.`,
    exampleOutput: `Day 1: laptop/VPN setup, GitHub org access request submitted immediately (flagged urgent given past IT delays), intro call with Alex. Day 3: Jordan walks through the staging deploy process live. Day 7: pairs with Jordan on the identified low-risk bug fix, opens the PR. Day 9: Jordan reviews and approves; new hire ships to production with Jordan watching. Day 10 check-in: what surprised you this week, what's still unclear about the on-call rotation, one thing to change for the next hire.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-30-60-90-plan-new-manager',
    category: 'hr-management',
    title: `Draft a 30-60-90 day plan for a new manager that names the political landmines, not just the goals`,
    description: `Builds a phased 30-60-90 day plan for someone stepping into a new leadership role, structured around what they need to observe before acting, what early trust-building move to make, and which specific team dynamics could sink a well-intentioned first change.`,
    promptText: `Write a 30-60-90 day plan for someone starting a new leadership role described below. This should read like advice from someone who has actually seen new managers succeed and fail in similar situations, not a generic "listen first, then act" template.

NEW ROLE AND SITUATION
{{new_role_situation}}

WHAT THIS TEAM/ORG IS LIKE RIGHT NOW
{{current_team_state}}

WHAT THIS PERSON IS EXPECTED TO CHANGE OR IMPROVE
{{expected_change}}

KNOWN SENSITIVE DYNAMICS
{{known_sensitivities}}

DAYS 1-30: OBSERVE AND BUILD TRUST
Focus this phase on specific listening actions (named 1:1s to run, specific questions to ask, what to deliberately not change yet) rather than generic advice to "build relationships." If a known sensitive dynamic is named (a passed-over internal candidate, a team recovering from a layoff, a predecessor who left on bad terms), name the specific behavior this new manager should adopt or avoid because of it — do not leave this as an unstated undertone the manager has to infer for themselves.

DAYS 31-60: MAKE ONE VISIBLE, LOW-RISK CHANGE
Name one specific, contained change this person should make in this window that demonstrates competence and responsiveness to what they heard in days 1-30, without touching anything structurally risky yet (compensation, headcount, reporting lines). Explain why this particular window is wrong for anything higher-risk.

DAYS 61-90: ADDRESS THE EXPECTED CHANGE DIRECTLY
By this phase, connect back to the expected-change input and lay out the first real move toward it, including one specific risk this move carries given the known sensitivities, and how to sequence communication about it so it doesn't blindside the team.

WHAT NOT TO DO
Do not suggest any change in days 1-30 beyond genuinely reversible, low-stakes adjustments. Do not have this person send a team-wide "here's my vision" message before day 30 — that reads as arriving with a pre-formed agenda rather than one shaped by what they actually heard.

OUTPUT FORMAT
Three phase sections (Days 1-30, 31-60, 61-90), each with 3-5 concrete actions, followed by a short paragraph naming the single biggest risk to this plan given the known sensitivities.`,
    variables: [
      {
        name: 'new_role_situation',
        description: `The role, whether internal promotion or external hire, and the immediate situation.`,
        example: `Newly promoted Engineering Manager over a team of 6 she used to be a peer on, one of whom also applied for the role.`,
        required: true,
      },
      {
        name: 'current_team_state',
        description: `The honest current state of the team or org she's stepping into.`,
        example: `Team shipped reliably but morale has been flat since a reorg six months ago cut their headcount from 8 to 6 with no backfill.`,
        required: true,
      },
      {
        name: 'expected_change',
        description: `What leadership actually expects this person to improve or change.`,
        example: `Cut the team's deploy cycle time in half over the next two quarters.`,
        required: true,
      },
      {
        name: 'known_sensitivities',
        description: `The specific interpersonal or political landmines already known about.`,
        example: `The peer who also applied for the role is well-liked and technically excellent; how she's treated in the first month will be watched closely by the rest of the team.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `30-60-90-plan`,
      `new-manager`,
      `leadership-transition`,
      `people-management`,
      `onboarding`,
    ],
    whyItWorks: `Leadership-transition research (echoing the structure Michael Watkins popularized in first-90-days frameworks) consistently finds that the specific failure mode for new managers is not lack of ambition but moving too fast on structural change before earning credibility, or moving too slowly and reading as passive — a generic "listen first, then act" template gives no way to actually calibrate that timing to the specific situation. Requiring the plan to name a genuinely low-risk, reversible change for days 31-60 forces a concrete distinction between a competence-signaling move (visible, contained, easy to reverse if wrong) and the higher-risk structural changes leadership actually wants, which is exactly the distinction new managers blur when they're anxious to prove themselves quickly. Feeding in a known sensitivity — here, a passed-over internal candidate — and requiring the plan to name explicit behavior around it rather than leaving it as subtext matters because this is precisely the kind of dynamic a new manager under pressure will handle by instinct and often get wrong (either over-correcting with visible favoritism to reassure the passed-over peer, or avoiding them altogether, both of which the rest of the team will notice and read as a signal). Explicitly banning a pre-day-30 "vision" announcement targets a specific, common new-manager mistake: arriving with a pre-formed agenda reads as not having actually listened, undermining the exact trust-building the first 30 days are meant to establish, even when the content of the vision is objectively sound.`,
    exampleOutput: `Days 1-30: Run individual 1:1s with all 6 engineers before any group meeting; ask each one directly what's working and what they'd change if they were in this seat; treat the peer who also applied with the same cadence and substance as everyone else, no more no less, since either extra warmth or visible distance will be read as a signal by the team. Days 31-60: Fix one concrete process friction surfaced in the 1:1s (e.g., a slow code-review turnaround) as a visible, reversible win. Days 61-90: Introduce the deploy-cycle-time initiative, framed around the team's own stated frustrations with the current process rather than as a top-down mandate.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-employee-announcement-sensitive-promotion',
    category: 'hr-management',
    title: `Draft an internal promotion announcement that doesn't accidentally sting the people who didn't get the role`,
    description: `Writes an internal announcement for a promotion or role change, calibrated to the specific interpersonal context so it reads as genuine recognition rather than a corporate press release, without stirring resentment among people who applied and weren't chosen.`,
    promptText: `Draft an internal announcement for the personnel change below. Match the tone to how this specific team actually communicates, not a generic corporate HR voice.

WHAT'S BEING ANNOUNCED
{{announcement_type}}

BACKGROUND ON THE PERSON AND WHY THIS DECISION WAS MADE
{{decision_background}}

AUDIENCE AND CHANNEL
{{audience_and_channel}}

SENSITIVITY TO MANAGE
{{sensitivity}}

Write an announcement in three parts: what's changing, in one direct sentence up front rather than buried after a long preamble; specific, genuine detail about why this person earned this — a real accomplishment or pattern of work, not generic praise like "hardworking and a great team player" that could describe anyone; and a brief, natural note on what happens next (reporting line change, transition timeline, who to direct related questions to). If a sensitivity is named — other internal candidates, a team that's been through recent turmoil, a person whose promotion might read as favoritism — do not address it by adding a defensive disclaimer paragraph explaining the decision process; instead, write the announcement so its substance (specific, earned detail) makes the reasoning self-evident without needing to argue for it. Keep the length appropriate to the channel: short and direct for a team Slack channel, slightly more complete for a company-wide email, but never longer than it needs to be to convey genuine specific recognition.

WHAT NOT TO DO
Do not use the phrase "we're excited to announce" or other stock corporate-announcement openers. Do not list the person's full resume or years of tenure as the justification in place of a specific accomplishment. Do not thank "everyone who applied" in a way that reads as a consolation line pointed at people who didn't get the role — if that needs to be communicated at all, it should happen in a separate, private conversation with those specific individuals, not folded into the public announcement.

OUTPUT FORMAT
The announcement text itself, formatted for the stated channel, plus one separate short note (not part of the announcement) suggesting what the manager should say privately to anyone who applied and wasn't chosen, before the public announcement goes out.`,
    variables: [
      {
        name: 'announcement_type',
        description: `What kind of change is being announced.`,
        example: `Internal promotion of a senior individual contributor to Team Lead.`,
        required: true,
      },
      {
        name: 'decision_background',
        description: `The real, specific reason this decision was made.`,
        example: `She's been informally mentoring the two newest hires for months and was the one who redesigned the on-call rotation that cut weekend pages in half.`,
        required: true,
      },
      {
        name: 'audience_and_channel',
        description: `Who will see this and where it's being posted.`,
        example: `Company-wide Slack #announcements channel, ~180 people, mostly people who don't know her directly.`,
        required: true,
      },
      {
        name: 'sensitivity',
        description: `The specific interpersonal risk this announcement needs to navigate.`,
        example: `Two other people on the team also applied for this role and were not selected; both are still on the team she'll now lead.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `employee-announcement`,
      `internal-communications`,
      `promotion-announcement`,
      `people-management`,
      `workplace-communication`,
    ],
    whyItWorks: `The mechanistic problem with a generic corporate announcement template is that it substitutes stock phrasing ("excited to announce," "great team player") for the actual, specific evidence of why a decision was made — and it is precisely the absence of specifics that reads as suspicious or political to an audience that includes people who might have wanted the outcome to go differently. Making the announcement's substance carry the justification, instead of adding a defensive paragraph explaining the decision process, works because a defensive explanation implicitly signals that the decision needs defending, which invites exactly the scrutiny and second-guessing it's trying to prevent, whereas a specific, concrete accomplishment (redesigning the on-call rotation, mentoring new hires) is self-evidently a reason and doesn't read as an argument being made. Explicitly banning a "thank everyone who applied" line in the public announcement addresses a common but backfiring instinct: naming that other people applied, even generously, publicly signals to the whole company that this was a competitive process with named losers, which is a worse outcome for the passed-over candidates' dignity than simply not raising it at all — the actual acknowledgment they need belongs in a private conversation their manager has with them before the public post goes out, which is why the prompt separates that into its own private-note output rather than folding it into the announcement itself. Matching tone and length to the actual channel (a Slack post is read very differently than a company-wide email) prevents the common failure of over-formalizing a genuinely warm piece of news into something that reads as impersonal HR process to an audience that knows the person as a colleague, not a personnel file entry.`,
    exampleOutput: `Maya's moving into the Team Lead role, effective next Monday. Over the past few months she's quietly redesigned our on-call rotation and cut weekend pages in half, and she's been the person the two newest engineers go to when they're stuck. If you've got questions about the transition, reach out to her manager directly. Private note: before this goes out, her manager should tell the two other internal applicants directly and specifically what they'd need to show next time, separate from this announcement.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-performance-review-evidence-based-draft',
    category: 'hr-management',
    title: `Turn scattered manager notes into a performance review that would survive the employee pushing back on it`,
    description: `Converts a manager's raw notes and examples from the review period into a structured performance review draft grounded in specific, checkable evidence, flagging any vague or unsupported claim before it goes in front of the employee.`,
    promptText: `You are helping a manager draft a performance review from their raw notes for the period below. This is a working draft for the manager to review and edit, not a final document — treat it as a first pass that needs to hold up if the employee pushes back on any specific claim in it.

EMPLOYEE ROLE AND REVIEW PERIOD
{{role_and_period}}

MANAGER'S RAW NOTES AND EXAMPLES
{{raw_notes}}

RATING OR LEVEL SYSTEM IN USE
{{rating_system}}

AREAS THE MANAGER WANTS TO EMPHASIZE
{{emphasis_areas}}

For every strength or growth area you write, trace it back to something specific in the raw notes — a project, a date, a measurable outcome, a direct quote from feedback the manager received about this person. If the raw notes contain a claim that is vague or unsupported ("needs to be more proactive," "great attitude") with no specific example behind it in the notes, do not simply write it into the review as-is — flag it separately and ask the manager for the specific instance that led them to that impression, since an unsupported claim in a written review is both legally exposed and the single most common thing employees push back on successfully. Write growth areas as specific, actionable next steps tied to an actual situation, not as character critiques — "missed the deadline on the Miller account renewal by four days without flagging it in advance" is actionable, "needs better time management" is not. If a rating or level system is given, do not just assign the number — write the narrative in a way that makes the assigned rating obviously consistent with the evidence, so the rating doesn't read as disconnected from the text above it.

WHAT NOT TO DO
Do not use hedging language that undercuts a legitimate concern ("just a small thing, but...") or inflate a genuine strength into vague superlatives ("exceptional in every way") that make the review harder to act on either way.

OUTPUT FORMAT
1. The review draft itself: overall summary, strengths (with evidence), growth areas (with evidence and next steps), and the rating with a one-line justification tying it to the evidence above.
2. A separate "Needs a specific example" list of any claim in the manager's notes you could not ground in a concrete instance.

A note on scope: this is a working draft to support the manager's own judgment, not a substitute for it, and should be reviewed and personalized by the manager before it's shared with the employee.`,
    variables: [
      {
        name: 'role_and_period',
        description: `The employee's role and the time period this review covers.`,
        example: `Product Marketing Manager, H1 2026 review cycle.`,
        required: true,
      },
      {
        name: 'raw_notes',
        description: `The manager's unstructured notes, examples, and impressions from the period.`,
        example: `Led the launch of the pricing page redesign, conversion went up 12%. Great in cross-functional meetings. Missed the deadline on the competitor battlecard project by two weeks, didn't flag it was slipping until the day it was due. Sometimes seems disengaged in team meetings.`,
        required: true,
      },
      {
        name: 'rating_system',
        description: `The company's rating scale or level system, if one exists.`,
        example: `5-point scale: Below Expectations, Partially Meets, Meets, Exceeds, Significantly Exceeds.`,
        required: false,
      },
      {
        name: 'emphasis_areas',
        description: `What the manager specifically wants this review to land on.`,
        example: `Wants to be direct about the missed deadline pattern since it's happened twice now, without undoing credit for the pricing page win.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `performance-review`,
      `people-management`,
      `employee-feedback`,
      `hr-documentation`,
      `manager-tools`,
    ],
    whyItWorks: `Performance-review defensibility, both practically and in any later HR or legal review, rests almost entirely on whether every claim is traceable to a specific, dated, checkable instance rather than a general impression, which is exactly the distinction this prompt forces by requiring every strength and growth area to trace back to something concrete in the raw notes. The explicit instruction to flag rather than silently include vague claims like "needs to be more proactive" targets the most common way reviews go wrong: a manager's genuine but underspecified impression gets written into a formal document, the employee reasonably asks "can you give me an example," and the manager has none ready, which damages trust in the whole review regardless of how accurate the other, well-supported points were — catching this at draft time, before the conversation, is far cheaper than catching it in the room. Rewriting growth areas as specific situations with next steps rather than character critiques matters mechanically because language like "needs better time management" is not actionable — it gives the employee nothing concrete to change — while "flag slipping deadlines earlier, at least a week out" describes an observable behavior they can actually demonstrate improvement on at the next review. Requiring the narrative to make the assigned rating "obviously consistent" with the evidence addresses a specific credibility gap that shows up often in real reviews, where a manager's text reads mostly positive but the number assigned is middling, leaving the employee confused about which one to trust — GPT-5.1 left to draft freely will often produce this exact mismatch because it generates the narrative and the rating somewhat independently unless explicitly told to reconcile them.`,
    exampleOutput: `Strengths: Led the pricing page redesign end-to-end, resulting in a 12% conversion lift — a clear, measurable win this cycle. Growth area: The competitor battlecard project slipped two weeks past deadline, and the delay wasn't flagged until the due date itself; going forward, raise a slipping timeline at least a week out so the team can adjust. Needs a specific example: 'sometimes seems disengaged in team meetings' has no concrete instance in the notes — what specifically happened that gave this impression?`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-feedback-conversation-missed-deadlines-script',
    category: 'hr-management',
    title: `Prep for a hard feedback conversation about a repeated pattern, not just one bad week`,
    description: `Builds talking points and likely-response handling for a direct, specific feedback conversation about a recurring performance issue, so the manager stays anchored to the pattern and a concrete ask instead of drifting into vague criticism or backing off under pushback.`,
    promptText: `Help me prepare for a feedback conversation with a direct report about the specific pattern below. I need talking points I can actually say out loud, not a theoretical framework.

WHO AND THE PATTERN
{{who_and_pattern}}

SPECIFIC INSTANCES (dates, what happened)
{{specific_instances}}

WHAT I WANT TO BE TRUE AFTER THIS CONVERSATION
{{desired_outcome}}

HOW THIS PERSON TYPICALLY REACTS TO FEEDBACK
{{typical_reaction}}

Open the conversation with a direct, one-sentence statement of the pattern, naming at least two of the specific instances by name or date so it's immediately clear this isn't about one bad day — vague opens like "I wanted to check in about how things have been going" give the person room to steer the conversation away from the actual issue before it's even named. Write the core of the conversation as the specific things I actually need to say, including exact phrasing options for the hardest part — naming the pattern without it turning into a character judgment ("this isn't about effort, it's about the last three deadlines specifically"). Given how this person typically reacts to feedback, prepare me for their most likely response and give me a specific way to hold the line on the pattern without escalating or backing down — if they tend to get defensive, give me language that acknowledges what's fair in their pushback while still not letting the core ask get negotiated away; if they tend to go quiet, give me a way to draw out what's actually going on rather than filling the silence myself. End with a concrete, mutually specific next step and a named follow-up date, not an open-ended "let's see how it goes."

WHAT NOT TO DO
Do not write this as a script to be read verbatim — write it as talking points and specific phrases I can adapt in my own voice. Do not soften the opening statement with a compliment sandwich; leading with unrelated praise before the real issue trains the person to brace for bad news every time I start with something positive.

OUTPUT FORMAT
1. Opening statement (1-2 sentences, exact wording).
2. Core talking points (bulleted, with at least one exact phrase for the hardest part to say).
3. Anticipated reaction and how to respond to it.
4. Closing: the specific next step and follow-up date.`,
    variables: [
      {
        name: 'who_and_pattern',
        description: `The person and the recurring issue, stated plainly.`,
        example: `A senior analyst on my team who has missed three internal deadlines in the last two months, each time without flagging the slip in advance.`,
        required: true,
      },
      {
        name: 'specific_instances',
        description: `The actual dated instances that make up the pattern.`,
        example: `Missed the Q2 forecast deadline by 2 days (no heads up), missed the board deck data pull by 1 day (flagged same-day), missed the pricing analysis by 3 days (no heads up until asked).`,
        required: true,
      },
      {
        name: 'desired_outcome',
        description: `What you specifically want different after this conversation.`,
        example: `I want them to flag a slipping deadline at least 2 days before it's due, every time, no exceptions, starting now.`,
        required: true,
      },
      {
        name: 'typical_reaction',
        description: `How this person usually responds when given critical feedback.`,
        example: `Tends to get defensive fast and lists all the other things they're juggling as justification.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `feedback-conversation`,
      `difficult-conversations`,
      `people-management`,
      `performance-management`,
      `manager-coaching`,
    ],
    whyItWorks: `Feedback research (echoing the radical-candor and crucial-conversations literature managers are commonly trained on) consistently identifies the vague, softened opening as the single biggest reason hard conversations fail to land — an opener like "how have things been going" hands the other person the conversational initiative and lets a well-practiced deflector steer toward safer ground before the actual issue is even stated, which is why this prompt forces a named, dated, specific opening line instead. Explicitly banning the compliment sandwich targets a well-known but counterproductive habit: opening with unrelated praise before a criticism trains the recipient to associate any positive opener from this manager with incoming bad news, which corrodes the value of future genuine praise and doesn't actually soften the blow of the criticism itself, just delays it awkwardly. Preparing for the specific, named typical reaction rather than a generic "how to handle pushback" script matters because the correct response genuinely differs by reaction type — a defensive person needs their fair points acknowledged without conceding the core ask, while a person who goes quiet needs space and a direct question rather than a manager who fills silence with more talking, which is the instinctive but wrong move for that situation. Requiring a concrete, dated follow-up rather than an open-ended "let's see how it goes" close addresses the mechanism by which feedback conversations quietly fail to change anything: without a specific next checkpoint, both parties can silently agree the conversation happened and move on without either party being accountable for whether the actual behavior changed.`,
    exampleOutput: `Opening: 'I want to talk about a pattern — you've missed three internal deadlines in the last two months, and two of those three I only found out the day they were due.' Core: 'This isn't about effort, it's specifically about the lack of a heads-up before the deadline slips.' If defensive: 'You're right that you've had a lot on your plate — that's a real, separate conversation about workload. Separately, I need a heads-up at least two days out every time, no exceptions.' Close: 'Let's check in on this specifically next Friday.'`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-1-1-agenda-recurring-manager-report',
    category: 'hr-management',
    title: `Set up a recurring 1:1 agenda that survives the third week of getting skipped for status updates`,
    description: `Builds a reusable 1:1 meeting structure for a specific manager-report pair, weighted toward the report's actual priorities and career goals so the meeting doesn't quietly collapse into a status-update readout the report could have sent in a Slack message.`,
    promptText: `Build a recurring 1:1 agenda template for the manager-report pair below, designed to survive being run weekly for months without collapsing into pure status updates.

MANAGER AND REPORT
{{manager_and_report}}

MEETING LENGTH AND FREQUENCY
{{meeting_cadence}}

WHAT THIS 1:1 HAS DRIFTED INTO BEING
{{current_drift}}

REPORT'S STATED CAREER GOAL OR GROWTH AREA
{{career_goal}}

Structure the template with the report owning the majority of the agenda, not the manager — this is their meeting, not a manager-led check-in, and the template should say so explicitly at the top. Allocate roughly the given meeting length across three zones: a short section for anything genuinely time-sensitive that couldn't wait (capped tightly, since this is exactly the section that expands to eat the whole meeting if left uncapped), a section for whatever the report actually wants to raise that week (left open, prompted by a rotating question rather than a blank field, since a blank "anything else" field is what a tired report skips), and a recurring section tied to the stated career goal, so growth conversations happen on a predictable cadence rather than only when there's spare time left over. If the current-drift note describes a specific failure pattern (the meeting has become pure status updates, or gets cancelled whenever the manager is busy), add one explicit structural fix for that exact pattern rather than a generic reminder to "make time for 1:1s."

WHAT NOT TO DO
Do not include a generic "how are you doing" opener with no more specific prompt behind it — a template that only ever asks that gets a reflexive "fine" and burns the opening minutes on nothing. Do not make every section mandatory every week; name which section can be skipped in a light week so the template doesn't create its own pressure to fill time with filler.

OUTPUT FORMAT
The reusable agenda template itself (section names, rough time allocation, the rotating prompts for the open section), followed by one paragraph directly addressing the named current-drift pattern and the specific structural change meant to fix it.`,
    variables: [
      {
        name: 'manager_and_report',
        description: `Who the two people are and their relationship/role context.`,
        example: `Engineering manager and a mid-level engineer who's been on the team for a year and a half.`,
        required: true,
      },
      {
        name: 'meeting_cadence',
        description: `How long and how often this 1:1 happens.`,
        example: `30 minutes, weekly, Tuesday afternoons.`,
        required: true,
      },
      {
        name: 'current_drift',
        description: `What this specific 1:1 has actually turned into over time.`,
        example: `It's become a rundown of sprint ticket status that's already visible in the project tracker — nothing surprising or personal comes up anymore.`,
        required: true,
      },
      {
        name: 'career_goal',
        description: `What the report has said they want to grow toward.`,
        example: `Wants to move toward a tech lead track and get more experience scoping projects before they're assigned, not just executing them.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `1-1-agenda`,
      `people-management`,
      `manager-report-meetings`,
      `career-development`,
      `team-management`,
    ],
    whyItWorks: `The well-documented failure mode of recurring 1:1s is that they quietly regress to status-update meetings because status updates are the path of least resistance for both parties when nothing more specific is on the agenda — a manager under time pressure defaults to asking about ticket progress, and a report with nothing pre-loaded defaults to answering with exactly that, so the drift is structural, not a one-time lapse, which is why a generic reminder to "make 1:1s more personal" rarely fixes it and this prompt instead builds the fix into the template's actual structure. Capping the time-sensitive-items section tightly targets the specific mechanism by which status updates crowd out everything else: without an explicit cap, urgent-feeling but low-value updates naturally expand to consume the full meeting because they feel more immediately actionable than a career conversation, even when they're objectively less important over a longer horizon. Using a rotating prompt instead of a blank "anything else" field addresses a real behavioral pattern: a tired or busy person facing an open-ended blank field defaults to "nothing, I'm good," while a specific rotating question (what's the most interesting problem you worked on this week, what's something you're stuck on that you haven't raised yet) actually produces an answer because it's concrete enough to react to rather than requiring the report to generate a topic from nothing. Building a recurring, guaranteed slot for the stated career goal rather than leaving growth conversations to "whenever there's time" directly counters the observed pattern where career development conversations are the first thing dropped under time pressure precisely because they don't feel urgent in any single week, even though their absence compounds into real career stagnation over a year.`,
    exampleOutput: `This is your meeting — you own the agenda. Time-Sensitive (5 min cap): anything that genuinely can't wait until next week. Your Topic (15 min, rotating prompt): 'What's something you're stuck on that hasn't come up yet?' Career Track (10 min, every other week): progress toward tech-lead scoping experience — what project could you help scope next sprint? Fix for the drift: sprint-ticket status moves out of this meeting entirely and into the async project tracker update, freeing the full 30 minutes for the two sections above.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-team-agenda-weekly-sync-focus',
    category: 'hr-management',
    title: `Rebuild a weekly team meeting agenda so it's not just a status readout everyone tunes out of`,
    description: `Redesigns a recurring team meeting's agenda around actual decisions and cross-team blockers rather than a round-robin status update, and gives the facilitator specific language to redirect the meeting when it drifts back into old habits.`,
    promptText: `This team's weekly sync has a specific problem, described below, and I need a redesigned agenda plus the actual facilitator language to make the new structure stick, not just a new template that quietly reverts to the old pattern within a month.

TEAM AND MEETING CONTEXT
{{team_and_context}}

CURRENT AGENDA AND WHAT'S WRONG WITH IT
{{current_agenda_problem}}

WHAT ACTUALLY NEEDS TO HAPPEN IN THIS MEETING
{{actual_needs}}

MEETING LENGTH AND ATTENDEES
{{meeting_logistics}}

Redesign the agenda around the stated actual needs — typically real cross-team blockers, decisions that need a room full of the right people to make, and anything genuinely better discussed live than async — and explicitly move anything that's pure status (what did you do this week) out of the live meeting and into an async pre-read the team posts before the meeting starts, since status information doesn't need a synchronous meeting to transmit and the current-agenda-problem almost always traces back to exactly this kind of content eating live time it doesn't need. For each live agenda item, name who owns bringing it and what decision or output the meeting should produce by the end of that item, not just "discuss X," since an item with no defined output is what causes discussions to run long and go in circles. Give the facilitator two or three specific phrases to use in the room when the meeting starts drifting back into status-update mode ("let's take that to the async doc and come back to the blocker") — the redesign will not survive contact with an established meeting habit unless the facilitator has ready language for the moment it starts sliding back, not a rule that only exists on paper.

WHAT NOT TO DO
Do not simply relabel the same status-update items with new section headers — if an item genuinely doesn't need live discussion, cut it from the live meeting entirely rather than keeping it under a different name.

OUTPUT FORMAT
1. The async pre-read template (what goes there instead of live time).
2. The live meeting agenda (item, owner, intended output, rough time).
3. The facilitator's redirect phrases for when old habits resurface.`,
    variables: [
      {
        name: 'team_and_context',
        description: `The team and what kind of work this meeting supports.`,
        example: `8-person product team, weekly Monday sync, spans design, engineering, and product management.`,
        required: true,
      },
      {
        name: 'current_agenda_problem',
        description: `What's actually wrong with the meeting as it runs today.`,
        example: `Every person gives a 3-4 minute status update round-robin, eating 40 of the 45 minutes, leaving no real time for the cross-team blocker that's actually been stuck for two weeks.`,
        required: true,
      },
      {
        name: 'actual_needs',
        description: `What this meeting should actually be accomplishing.`,
        example: `Unblocking a decision on API contract ownership between two engineers who disagree, and deciding whether to cut a feature from this sprint.`,
        required: true,
      },
      {
        name: 'meeting_logistics',
        description: `Length of the meeting and who attends.`,
        example: `45 minutes, all 8 team members plus the EM, every Monday at 10am.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `team-agenda`,
      `meeting-design`,
      `team-management`,
      `productivity`,
      `facilitation`,
    ],
    whyItWorks: `The specific inefficiency this prompt targets — a round-robin status update consuming most of a meeting's time budget — is a well-known meeting-design failure because status information is asynchronous by nature (it doesn't require the whole room's simultaneous attention to transmit) while the things that actually justify a synchronous meeting are decisions and blockers that need real-time back-and-forth among specific people, and conflating the two in one agenda guarantees the synchronous-only items get squeezed. Explicitly moving status into an async pre-read isn't just a formatting change, it changes what the live meeting is mechanically for, which is the actual fix — merely retitling agenda sections while keeping the same status-round-robin content, the thing this prompt explicitly bans, produces no real change in how the time gets spent. Requiring a named owner and a defined output for every live item (a decision, not just "discuss") targets the specific way meeting items expand to fill available time: an item framed as open discussion has no natural stopping point, while an item framed as "we leave this meeting having decided X" gives the room a concrete signal for when it's done. Providing the facilitator specific in-the-moment redirect phrases, rather than just a new agenda document, addresses the real mechanism by which meeting redesigns fail in practice — an established meeting habit doesn't disappear because a new template exists, it resurfaces the first time someone starts a status update out of habit, and without a ready phrase to redirect it gracefully in the moment, the facilitator either lets it happen (reverting to the old pattern) or has to invent an awkward interruption on the spot, which most facilitators avoid doing and so the meeting drifts back within a few weeks.`,
    exampleOutput: `Async pre-read (posted by Friday EOD): what shipped this week, what's blocked and by what, nothing needing live discussion. Live agenda: API contract ownership decision (owner: EM, output: a decided owner by end of item, 15 min); sprint feature cut decision (owner: PM, output: yes/no decided, 15 min). Facilitator phrase: 'That sounds like a status update, let's drop it in the doc and keep this time for the blocker.'`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-team-health-check-psychological-safety',
    category: 'hr-management',
    title: `Design a team health check that surfaces the thing people won't say out loud in the regular team meeting`,
    description: `Builds a lightweight, recurring team health check tuned to specific dynamics this team is actually navigating, structured to reduce the social risk of an honest answer so it catches problems before they show up in exit interviews.`,
    promptText: `Design a recurring team health check for the team described below — a short, regular pulse check on team dynamics, not a full annual engagement survey — tuned to what's actually going on with this team right now.

TEAM CONTEXT
{{team_context}}

SPECIFIC DYNAMIC YOU'RE WORRIED ABOUT
{{specific_concern}}

HOW OFTEN AND HOW THIS GETS RUN
{{cadence_and_format}}

WHAT'S BEEN TRIED BEFORE THAT DIDN'T SURFACE ANYTHING USEFUL
{{past_attempt_failure}}

Design 5-7 questions, mixing a few numeric or scale ratings (so trends are trackable over time) with at least two open-ended questions specifically worded to lower the social risk of an honest negative answer — for example, asking "what's one thing that would make this team work better" rather than "is anything wrong," since the first is framed as constructive input anyone can answer honestly while the second requires someone to affirmatively name a problem, which people are far less willing to do in a small team where anonymity is thin. If a specific dynamic is named as a concern (uneven workload, one person dominating discussion, quiet disengagement from a specific subgroup), include at least one question aimed at surfacing that exact pattern without naming a person or being so specific that a single respondent's answer is instantly identifiable. If a past attempt is described as having failed to surface anything useful, diagnose in one sentence why it likely failed (too infrequent, too generic, answers were visible to the whole team, no visible follow-through last time) and design this version specifically to avoid that failure.

WHAT TO DO WITH THE RESULTS
Include a short closing note on how results should be shared back to the team — always in aggregate, never traceable to an individual respondent on a small team, and always with at least one visible action taken as a result, since a team health check that produces no visible follow-through trains people to stop answering honestly the next time.

OUTPUT FORMAT
The question list (numbered, noting scale vs. open-ended), a one-line note on why each open-ended question is worded the way it is, and the closing note on sharing results and follow-through.`,
    variables: [
      {
        name: 'team_context',
        description: `The team's size, function, and current situation.`,
        example: `6-person design team, has been stable for a year but recently added two new hires in the last quarter.`,
        required: true,
      },
      {
        name: 'specific_concern',
        description: `The specific dynamic you suspect might be happening but haven't confirmed.`,
        example: `Suspect the two newest hires feel like they can't push back on design decisions in critique sessions because the two senior designers dominate the conversation.`,
        required: true,
      },
      {
        name: 'cadence_and_format',
        description: `How often this runs and the format (anonymous form, verbal round in a meeting, etc).`,
        example: `Monthly, anonymous form, results shared back in the following team meeting.`,
        required: true,
      },
      {
        name: 'past_attempt_failure',
        description: `A past health check or pulse survey that didn't produce anything useful.`,
        example: `We ran a generic 'rate your happiness 1-10' survey twice last year and got flat 7s and 8s from everyone with no comments, so we stopped.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `team-health-check`,
      `psychological-safety`,
      `team-management`,
      `employee-wellbeing`,
      `team-dynamics`,
    ],
    whyItWorks: `The near-universal failure of generic "rate your happiness 1-10" pulse checks, exactly like the past attempt described in this prompt, has a specific mechanistic cause: a bare numeric scale with no concrete framing gives respondents nothing to anchor an honest answer to, so people default to a socially safe middle-to-positive number rather than doing the harder cognitive work of identifying and naming a real problem, which produces flat, uninformative results that look fine on paper regardless of the team's actual state. Wording open-ended questions as constructive asks ("what would make this better") rather than problem-identification asks ("is anything wrong") lowers the specific social cost of an honest answer, because suggesting an improvement is a normal, low-risk act of engagement while naming a problem implicitly requires blaming a cause, which respondents in a small team — where anonymity is thin because there are only a handful of possible authors for any given comment — are reasonably reluctant to do directly. Targeting a named suspected dynamic (senior designers dominating critique) with a carefully generic-enough question threads a real design constraint: specific enough to actually surface the pattern if it's real, but not so specific that a single respondent's answer would be instantly attributable, which matters because if respondents believe their answer is identifiable, the entire mechanism of honest anonymous feedback collapses regardless of how the question is worded. The requirement to close the loop with visible action addresses the single most common reason pulse checks degrade over repeated cycles: people calibrate their willingness to answer honestly based on whether past honesty produced any visible change, so a health check that surfaces real feedback but is followed by no visible action trains the team to stop bothering with honest answers well before the underlying problem is fixed.`,
    exampleOutput: `Q3 (open-ended): 'What's one thing that would make design critique sessions work better for you?' — worded as a constructive ask rather than 'is critique working,' which requires naming a problem directly. Closing note: results shared in aggregate only at the next team meeting, with at least one specific change (e.g., a rotating critique-lead role) named as a direct response to what came up.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-employee-survey-attrition-diagnosis',
    category: 'hr-management',
    title: `Design an engagement survey aimed at one specific attrition problem, not a generic annual checkbox`,
    description: `Builds a targeted employee survey structured around a specific, named business problem this organization is trying to diagnose, so the questions actually produce evidence for a decision instead of generic satisfaction scores nobody acts on.`,
    promptText: `Design an employee survey aimed specifically at the problem below — not a generic annual engagement survey, a diagnostic instrument built to produce evidence for a real decision.

THE SPECIFIC PROBLEM YOU'RE TRYING TO DIAGNOSE
{{specific_problem}}

WHO THIS SURVEY GOES TO
{{survey_population}}

DECISION THIS SURVEY NEEDS TO INFORM
{{decision_to_inform}}

WHAT DATA YOU ALREADY HAVE
{{existing_data}}

CONSTRAINTS (length, anonymity, timing)
{{constraints}}

Build the survey backward from the decision it needs to inform — every question should exist because its answer would change what that decision looks like, not because it's a standard engagement-survey topic. If existing data already tells you something (exit interview themes, attrition numbers by team or tenure), do not ask a question that would just re-confirm what you already know; use those existing findings to sharpen a more specific follow-up question instead. Mix a small number of scaled questions for trend-tracking with a larger share of specific, situational questions that ask about a concrete recent experience ("think of the last time you considered leaving — what was the specific trigger") rather than abstract satisfaction ratings, since concrete recall questions produce far more actionable detail than an abstract "how satisfied are you" score. Group questions so that a segment cut (by tenure, team, or role level, as relevant to the specific problem) would actually be possible without breaking anonymity, and flag if the given population is small enough that any segment cut risks identifying individual respondents.

WHAT NOT TO DO
Do not include generic filler questions common in engagement survey templates ("I would recommend this company as a great place to work") unless they specifically bear on the stated decision — every question in this survey has to earn its place by being use-case-relevant, not by being a standard question everyone asks.

OUTPUT FORMAT
1. The survey questions themselves, each tagged with which specific decision-relevant angle it addresses.
2. A short note on segment-cut risk given the stated population size.
3. One paragraph on what existing data made a generic question unnecessary and what more specific question replaced it.`,
    variables: [
      {
        name: 'specific_problem',
        description: `The concrete business problem driving this survey.`,
        example: `Voluntary attrition on the customer support team has been 34% over the last 12 months, well above the company average of 12%, and leadership needs to know why before approving a retention budget.`,
        required: true,
      },
      {
        name: 'survey_population',
        description: `Who exactly will receive this survey.`,
        example: `All 22 current customer support agents, across 3 team leads.`,
        required: true,
      },
      {
        name: 'decision_to_inform',
        description: `The actual decision leadership will make based on this data.`,
        example: `Whether to approve a compensation adjustment, a schedule-flexibility change, or a management-training investment, or some combination — the survey needs to point at which one matters most.`,
        required: true,
      },
      {
        name: 'existing_data',
        description: `What you already know from other sources, so the survey doesn't waste questions re-confirming it.`,
        example: `Exit interviews from the last 6 departures all mentioned inflexible scheduling as a factor, but none mentioned compensation directly.`,
        required: false,
      },
      {
        name: 'constraints',
        description: `Practical limits on length, anonymity, and timing.`,
        example: `Must be anonymous, under 10 minutes to complete, needs to go out before next quarter's budget planning cycle.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `employee-survey`,
      `engagement-survey`,
      `attrition`,
      `hr-analytics`,
      `people-management`,
    ],
    whyItWorks: `The core mechanistic weakness of a generic annual engagement survey is that its questions are chosen to be broadly reusable across every company and team rather than to inform any specific decision, which produces data that is comparable year-over-year but rarely actionable for a particular live problem — building the survey backward from a named decision instead forces every question to justify its own inclusion by whether its answer would actually change that decision, which is a fundamentally different and much stricter design constraint. Using existing data (here, exit interviews already pointing at scheduling, not compensation) to eliminate redundant questions and sharpen follow-ups matters because asking a question you already know the general answer to wastes limited survey length and respondent attention on confirmation rather than the more specific detail still needed to act — if scheduling is already implicated, the useful question is not "is scheduling a problem" but "which specific scheduling constraint is the biggest issue," which existing data alone can't answer. Concrete situational recall questions ("think of the last time you considered leaving") outperform abstract satisfaction scales because they engage episodic memory of an actual event rather than asking someone to generate an abstract self-assessment on the spot, which tends to regress toward a socially neutral middle score — this is a well-established survey-methodology finding and is exactly why a satisfaction scale alone produces flat, low-signal results on a small team. Flagging segment-cut anonymity risk explicitly matters because a 22-person population split by 3 team leads means some segments could be as small as 6-8 people, small enough that a distinctive comment is plausibly attributable to a specific respondent, and a survey that promises anonymity but doesn't structurally protect it will be answered less honestly by respondents who correctly suspect they could be identified.`,
    exampleOutput: `Q: 'Think about the last time you seriously considered leaving in the past 6 months. What was the specific trigger?' (decision angle: distinguishes compensation vs. scheduling vs. management driver). Segment-cut note: with only 22 respondents across 3 leads, cutting by individual team risks groups as small as 6-8, so report findings by tenure band instead of by team lead to protect anonymity. Existing-data note: since exit interviews already implicate scheduling, the survey skips a general 'is scheduling flexible enough' question and instead asks which specific schedule constraint (weekend rotation, shift start time, PTO approval lag) is the biggest issue.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-engagement-analysis-open-text-synthesis',
    category: 'hr-management',
    title: `Turn a pile of open-ended survey comments into themes leadership can actually act on this quarter`,
    description: `Synthesizes raw open-text survey responses into a small number of concrete, prioritized themes with representative quotes and a recommended action per theme, instead of a vague summary that restates the survey question back at leadership.`,
    promptText: `Analyze the open-ended survey responses below and produce a synthesis leadership can act on, not a restated summary of what the survey asked.

SURVEY CONTEXT AND QUESTION ASKED
{{survey_context}}

RAW OPEN-TEXT RESPONSES
{{raw_responses}}

WHAT LEADERSHIP NEEDS TO DECIDE FROM THIS
{{decision_needed}}

KNOWN CONTEXT THAT MIGHT EXPLAIN A THEME
{{known_context}}

Read through the raw responses and group them into no more than 5 themes, ranked by how many distinct respondents raised something in that theme, not by how emotionally strong any single comment sounds — a theme mentioned by 2 people should not outrank one mentioned by 12 just because the 2 people wrote more dramatically. For each theme, include 2-3 representative quotes pulled directly from the raw responses (verbatim, not paraphrased, so leadership can see the actual language people used) and a rough count or proportion of respondents who raised it. For each theme, propose one specific, concrete action leadership could plausibly take this quarter — not a vague direction like "improve communication," but something specific enough to actually be approved or rejected as a real decision. If known context is given that plausibly explains why a theme is showing up (a recent reorg, a tool migration, a leadership change), name that connection explicitly rather than presenting the theme as if it emerged from nowhere, since a theme presented without its likely cause reads as a mystery leadership has to re-diagnose from scratch. Note anywhere the responses genuinely conflict with each other (some people want more structure, others want less) rather than averaging them into a mushy middle recommendation that satisfies neither group.

WHAT NOT TO DO
Do not pad the synthesis with a restated methodology section explaining how you grouped things — lead directly with the themes. Do not editorialize beyond what the actual responses support; if a theme is thin (2-3 mentions), say so plainly rather than inflating it to sound more significant than the data shows.

OUTPUT FORMAT
Ranked themes (1 through up to 5), each with: proportion of respondents, 2-3 verbatim quotes, likely cause if known, and one specific proposed action. End with a short "Where responses conflict" note if applicable.`,
    variables: [
      {
        name: 'survey_context',
        description: `What survey this is and the specific question the open text answers.`,
        example: `Quarterly engagement survey, open text question: 'What's the biggest obstacle to doing your best work right now?'`,
        required: true,
      },
      {
        name: 'raw_responses',
        description: `The actual open-text responses, pasted in as-is.`,
        example: `'Too many meetings, I have 6 hours of meetings some days and no focus time.' / 'Unclear priorities since the reorg, don't know who owns what anymore.' / 'Meetings eat my whole calendar, hard to get deep work done.' / ...`,
        required: true,
      },
      {
        name: 'decision_needed',
        description: `The actual decision leadership is trying to make using this synthesis.`,
        example: `Whether to introduce a company-wide no-meeting day, restructure team ownership post-reorg, or both.`,
        required: true,
      },
      {
        name: 'known_context',
        description: `Recent events that might explain a theme showing up in the comments.`,
        example: `The company completed a reorg two months ago that merged two previously separate product teams.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `engagement-analysis`,
      `employee-survey`,
      `hr-analytics`,
      `qualitative-analysis`,
      `people-management`,
    ],
    whyItWorks: `The specific failure mode of a naive open-text synthesis is ranking themes by the vividness or emotional intensity of individual comments rather than by how many distinct people actually raised the underlying issue, which systematically overweights a small number of articulate or frustrated respondents and produces a synthesis that reflects who wrote the most memorable comment rather than what the broader population actually experiences — ranking explicitly by respondent count rather than comment intensity corrects for this. Requiring verbatim quotes rather than paraphrases matters because paraphrasing open-text feedback for a leadership audience tends to launder specific, often pointed language into vaguer corporate-safe phrasing, which is exactly the softening that causes leadership to underestimate how strongly a theme is actually felt — the real words people used are the evidence, and paraphrasing loses exactly the signal that should inform how seriously to take it. Forcing every theme's proposed action to be specific enough to be approved or rejected as a real decision, rather than a vague direction like "improve communication," targets the common way survey syntheses fail to produce change: a report that ends in generalities gives leadership nothing concrete to say yes or no to, so it tends to be acknowledged and then shelved, whereas "introduce a company-wide no-meeting day" is a specific proposal someone can actually approve this quarter. Surfacing genuine conflicts between respondents rather than averaging them into a mushy middle addresses a real analytical trap: if half the respondents want more structure post-reorg and half want less, a synthesis that proposes "moderately adjust structure" satisfies neither group and obscures that there are actually two distinct needs in the population that may require two different responses, not one compromise position.`,
    exampleOutput: `Theme 1 (raised by ~40% of respondents): Meeting overload crowding out focus time. Quotes: 'I have 6 hours of meetings some days and no focus time.' Likely unrelated to the reorg — this is a pre-existing calendar-culture issue. Proposed action: pilot a company-wide no-meeting Wednesday for one quarter. Theme 2 (~25%): Unclear ownership since the reorg. Quotes: 'Don't know who owns what anymore.' Likely cause: directly tied to the team merger two months ago. Proposed action: publish an updated RACI for the merged teams within 2 weeks.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-learning-plan-ic-to-tech-lead-track',
    category: 'hr-management',
    title: `Build a learning plan for the specific gap standing between an IC and the promotion they want`,
    description: `Produces an individual development plan targeted at the exact skill or experience gap between where an employee is now and the next role they're aiming for, with concrete practice opportunities rather than a generic list of courses to complete.`,
    promptText: `Build an individual learning and development plan for the employee below, targeted specifically at the gap between where they are now and the role they're aiming for — not a generic list of online courses.

CURRENT ROLE AND TARGET ROLE
{{current_and_target_role}}

SPECIFIC GAP IDENTIFIED (by the employee, manager, or a past review)
{{specific_gap}}

WHAT REAL WORK IS COMING UP THEY COULD PRACTICE THIS ON
{{upcoming_work_opportunities}}

TIMEFRAME AND TIME BUDGET
{{timeframe_and_budget}}

Structure the plan around the specific gap, not a generic competency framework for the target role — if the gap is "has never scoped a project independently before it's assigned," the plan should be entirely about creating and supporting opportunities to do exactly that, not a broad curriculum covering every tech-lead skill in general. For each phase of the timeframe, tie at least one action to a real, upcoming piece of work from the given list, since a skill practiced on an actual live project with real stakes builds far more real capability than a course completed in isolation with no application — a course or reading should only appear in the plan as direct preparation for a specific named opportunity to apply it, not as a stand-alone item. Name what "support with training wheels" looks like early in the timeframe (a manager reviewing a draft scope before it's shared) and how that support should visibly reduce over the timeframe, ending with the employee doing the target skill with real autonomy, not just having been exposed to it. Include one specific way progress will be checked partway through the timeframe, not just at the very end, so a plan that isn't working can be caught and adjusted rather than only being evaluated as a pass/fail at the deadline.

WHAT NOT TO DO
Do not list generic leadership courses, books, or certifications unless they're tied to a specific step in the plan where the employee will apply what they learned within a defined short window afterward — content consumed with no near-term application slot is the most common way development plans get built and then quietly ignored.

OUTPUT FORMAT
A phased plan (early / mid / late within the given timeframe), each phase with: the specific action, the real work it's tied to, what level of manager support is provided, and the format. End with the mid-point progress check and what would trigger adjusting the plan.`,
    variables: [
      {
        name: 'current_and_target_role',
        description: `Where the employee is now and what role or track they're aiming for.`,
        example: `Mid-level Software Engineer aiming for a Tech Lead role within the next year.`,
        required: true,
      },
      {
        name: 'specific_gap',
        description: `The concrete, named gap between where they are and the target.`,
        example: `Has strong execution skills but has never scoped a project from an ambiguous problem statement — every project so far has arrived already scoped by someone else.`,
        required: true,
      },
      {
        name: 'upcoming_work_opportunities',
        description: `Real projects or work coming up in the near term that could serve as practice.`,
        example: `A new internal tooling project starting next quarter has no assigned scoper yet — currently just a one-paragraph problem statement from the PM.`,
        required: true,
      },
      {
        name: 'timeframe_and_budget',
        description: `How long this plan covers and how much dedicated time/support is realistic.`,
        example: `6 months, with roughly 2 hours a week of dedicated time and biweekly 30-minute check-ins with the manager.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `learning-plan`,
      `career-development`,
      `individual-development-plan`,
      `people-management`,
      `employee-growth`,
    ],
    whyItWorks: `Adult-learning and skill-transfer research consistently finds that capability built through applied, real-stakes practice with fading support (a well-documented pattern sometimes called scaffolded or graduated-responsibility learning) transfers to on-the-job performance far more reliably than content consumed in isolation, which is the specific reason this prompt bans standalone courses or books unless they're tied to a named near-term application slot — a course completed with no immediate place to apply it decays quickly and rarely changes actual behavior on the job. Anchoring every phase to a real, upcoming piece of work rather than a hypothetical practice exercise matters because the stakes and ambiguity of real work are precisely what the target skill (scoping from an ambiguous problem) needs practice handling — a sanitized practice exercise with a pre-defined answer doesn't exercise the actual judgment gap the plan is meant to close. Making the manager-support level explicit and explicitly fading over the timeframe (reviewing a draft scope early, versus full autonomy later) targets a common failure in informal development plans where support either never fades, so the employee never gets to demonstrate real independence and the promotion case stays weak, or fades too abruptly, so the employee is thrown into full autonomy before they're ready and a bad outcome sets back both their confidence and their case for promotion. Building in a mid-point check rather than only a final evaluation addresses the practical reality that a six-month plan with no interim signal risks discovering only at the end that the chosen opportunity didn't actually exercise the gap as intended, or that support needs adjusting, by which point there's no time left in the plan to correct course.`,
    exampleOutput: `Early (Month 1-2): employee drafts an initial scope for the new tooling project from the PM's one-paragraph brief; manager reviews the draft before it's shared with the PM, providing feedback but not rewriting it. Mid (Month 3-4): employee presents the refined scope directly to the PM and stakeholders with manager present but silent, stepping in only if asked. Late (Month 5-6): employee scopes the next project independently with no manager review before it goes out. Mid-point check (end of Month 3): did the manager have to substantially rewrite the scope, or just refine it? If substantial rewriting was still needed, extend the training-wheels phase before removing manager review at the presentation stage.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-training-program-role-specific-skill-gap',
    category: 'hr-management',
    title: `Build a training program from an actual skill gap, not a generic curriculum`,
    description: `Turns a specific, observed skill gap on a real team into a phased training program with measurable checkpoints, instead of a generic course outline that looks the same for every role.`,
    promptText: `You are designing a training program to close one specific, observed skill gap on a real team — not a general onboarding curriculum, and not a list of course titles copied from an LMS catalog.

TEAM AND ROLE
{{team_and_role}}

OBSERVED GAP
{{observed_gap}}

EVIDENCE THE GAP IS REAL
{{evidence}}

TIME AND BUDGET CONSTRAINTS
{{constraints}}

HOW SUCCESS WILL BE MEASURED
{{success_measure}}

PHASE 1 — DIAGNOSE
Restate the gap as a behavior someone can currently do versus a behavior they need to be able to do, not as a vague trait like "needs more experience." If the evidence provided is thin or anecdotal (a single complaint, one bad quarter), say so explicitly and propose one cheap way to confirm the gap is real and shared across more than one person before building a program around it.

PHASE 2 — DESIGN
Build the program in three stages: a short foundational stage (what they need to know), a practice stage (a real task or simulation drawn from actual work, not a hypothetical case study), and a reinforcement stage (spaced follow-up, not a one-time session that decays within a month). For each stage, specify format, duration, and who delivers it — do not default to "a workshop" as the answer for every stage.

PHASE 3 — MEASURE
Define what improvement looks like in terms of the success measure given, at a specific checkpoint (30/60/90 days), and name one leading indicator that would show up before the lagging outcome metric does.

WHAT NOT TO DO
Do not propose a program that requires more budget or time than the stated constraints allow — if the ideal program doesn't fit, say what you cut and why, rather than silently ignoring the constraint. Do not recommend a certification or course by brand name as if you have verified it fits this exact gap; describe the type of content needed and let the requester source it.

OUTPUT FORMAT
1. The gap restated as a specific behavior change.
2. A confidence note on the evidence, with a cheap validation step if evidence is thin.
3. The three-stage program as a table (stage / format / duration / owner).
4. The 30/60/90 measurement plan with one leading indicator.`,
    variables: [
      {
        name: 'team_and_role',
        description: `Which team and role this training is for.`,
        example: `8-person support team, tier-1 agents handling billing disputes.`,
        required: true,
      },
      {
        name: 'observed_gap',
        description: `The specific skill gap you've observed, not a general weakness.`,
        example: `Agents can process a refund but can't de-escalate a customer who's already threatening to charge back before the ticket is even opened.`,
        required: true,
      },
      {
        name: 'evidence',
        description: `What made you notice this gap — data, complaints, escalations.`,
        example: `Chargeback rate on billing tickets is up 40% quarter over quarter, and QA flags de-escalation as the top miss.`,
        required: true,
      },
      {
        name: 'constraints',
        description: `Real limits on time and budget for the program.`,
        example: `No budget for outside vendors; can use 2 hours per week per agent for 3 weeks max.`,
        required: true,
      },
      {
        name: 'success_measure',
        description: `The outcome metric this training is ultimately meant to move.`,
        example: `Chargeback rate on billing tickets back under 15% within one quarter.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `training-program`,
      `skills-gap`,
      `l-and-d`,
      `onboarding`,
      `performance-management`,
    ],
    whyItWorks: `Generic training-program prompts fail because they let the model default to a familiar three-part shape (intro session, workshop, quiz) regardless of what the actual gap is, since that shape is heavily represented in generic corporate-training text GPT-5.1 has seen. Forcing the gap to be restated as a specific behavior change before any design work happens blocks that shortcut, because a behavior-level restatement can't be answered with a stock curriculum — it has to reference the actual failure mode. Requiring a confidence check on the evidence matters mechanically because GPT-5.1, given a stated problem, will proceed to solve it as true by default rather than interrogating whether the premise holds; explicitly asking it to flag thin evidence and propose a validation step counteracts that eagerness-to-solve bias, which matters here because building a multi-week program around one anecdote wastes real manager and employee time. Naming a leading indicator alongside the lagging outcome metric closes a specific gap in how these prompts are usually answered: a model asked only for a success measure will name the outcome metric and stop there, but a training program that only gets checked at the 90-day lagging metric gives no early signal to adjust course, so the instruction has to explicitly ask for both. The constraint-fit rule exists because an unconstrained answer is a worse answer disguised as a better one — a program that would be great with unlimited budget but silently ignores the two-hours-a-week ceiling isn't actually usable, so the prompt forces the model to show its cuts rather than produce an aspirational plan nobody can execute.`,
    exampleOutput: `Gap restated: agents can execute a refund transaction but freeze or over-apologize when a customer is already hostile before a ticket exists, escalating faster than necessary. Evidence confidence: moderate — chargeback data is solid, but QA's "de-escalation miss" tag hasn't been validated by listening to actual calls; recommend pulling 10 flagged calls before finalizing. Program: Stage 1 (30 min self-paced video on de-escalation framework), Stage 2 (90 min live role-play using 3 real anonymized transcripts, led by the QA lead), Stage 3 (weekly 15-min call-review huddle for 3 weeks). 30-day leading indicator: QA de-escalation score; 90-day lagging: chargeback rate.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-internal-job-post-lateral-move-transparency',
    category: 'hr-management',
    title: `Write an internal job post that's honest about who this move is and isn't for`,
    description: `Drafts an internal-mobility job post that states eligibility and transfer mechanics plainly, so people self-select accurately instead of applying blind and finding out the constraints in an awkward conversation later.`,
    promptText: `You are writing an internal job posting for {{company_name}}'s internal mobility board. This is not an external job ad — the audience already works here and needs different information than an outside candidate would.

ROLE AND TEAM
{{role_and_team}}

WHY THIS OPENING EXISTS
{{opening_reason}}

ELIGIBILITY AND TRANSFER RULES
{{eligibility_rules}}

WHAT CHANGES FOR THE PERSON WHO MOVES
{{what_changes}}

STATE UP FRONT, PLAINLY: who this role is realistically for (tenure, current level, current manager sign-off needed or not), what happens to the person's current team when they leave (backfill plan or not — internal applicants worry about this and rarely ask directly), and any transfer mechanics that are non-negotiable (notice period, whether current manager gets a heads-up before or after the internal application, cooling-off period if it doesn't work out). Do not write this the way an external posting would be written — skip the "about our company" boilerplate entirely, since the reader already works here, and spend that space instead on the specifics above.

Write the role responsibilities as what's actually different from a typical external posting for a similar title: call out what carries over from the person's current role versus what is genuinely new, since an internal mover's biggest uncertainty is usually how much of their existing expertise transfers versus how much they're starting over.

End with a short, honest paragraph on the realistic downside of taking this move — not a legal disclaimer, but a plain statement of the actual trade-off (lower visibility for a while, learning curve, whatever applies) so no one is misled by an ad optimized only to attract applicants.

OUTPUT FORMAT
1. Role title and one-line summary.
2. Eligibility section, stated plainly.
3. Responsibilities, split into "carries over" and "new."
4. What changes for the mover (team, manager, level, comp process if relevant).
5. The honest trade-off paragraph.
6. How and by when to apply, and what happens to their current role once they do.`,
    variables: [
      {
        name: 'company_name',
        description: `Company name for the posting.`,
        example: `Northwind Logistics`,
        required: true,
      },
      {
        name: 'role_and_team',
        description: `The open role and which team it sits on.`,
        example: `Senior Data Analyst on the Revenue Operations team, reporting to the RevOps Director.`,
        required: true,
      },
      {
        name: 'opening_reason',
        description: `Why the role is open — backfill, new function, growth.`,
        example: `New role created to support a fast-growing forecasting function; not a backfill.`,
        required: true,
      },
      {
        name: 'eligibility_rules',
        description: `Concrete eligibility and process constraints for internal movers.`,
        example: `Must be at current company 12+ months and in current role 6+ months; needs current manager's sign-off before final interview, not before applying.`,
        required: true,
      },
      {
        name: 'what_changes',
        description: `What concretely changes for someone who takes this role.`,
        example: `Moves from IC-3 to IC-4 level, new manager, comp reviewed at next cycle rather than immediately.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `internal-mobility`,
      `job-posting`,
      `recruiting`,
      `career-development`,
      `hr-communications`,
    ],
    whyItWorks: `The core failure mode this avoids is that internal job posts, left to a model's default instincts, get written as slightly-shortened external ads — the same generic "about us" framing and marketing tone — because that's the dominant pattern in the training data for "job posting." Explicitly instructing the model to skip the company-boilerplate section forces it to recognize the audience difference structurally rather than stylistically, since an internal reader already has that context and the space is better spent on mechanics an external ad would never need to cover. The eligibility-and-mechanics section is the highest-value part of this prompt because internal movers' real anxiety — what happens to my current team, does my manager find out before or after I apply — is exactly the information a generically upbeat job post omits; asking GPT-5.1 to state it plainly counteracts its tendency to default to positive, recruitment-optimized framing when given a "write a job post" instruction, since without an explicit override it treats the task as persuasion rather than disclosure. The "carries over versus new" responsibilities split works because it forces a concrete comparison against the person's current role, which a generic template can't produce since it has no notion of what the reader currently does — this only works because the prompt requires the model to reason about the specific transition, not just describe the destination role in isolation. The honest trade-off paragraph exists to counteract a model's default optimism bias in any "write an ad for X" framing; without it, the output reads as pure upside, which internal audiences recognize immediately as spin and discount accordingly, undermining trust in the posting process itself.`,
    exampleOutput: `Eligibility: open to anyone at Northwind 12+ months, in their current role at least 6 months. Your current manager is looped in after you clear the first interview, not before you apply, so you can explore quietly. Carries over: your SQL and dashboarding skills transfer directly. New: you'll own forecast modeling end-to-end, which is a step up in ambiguity from your current reporting-focused work. The honest trade-off: for the first two quarters you'll have less visibility than you do now, since RevOps reports up through Finance rather than the exec team directly.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-recruiter-outreach-passive-candidate-specific-hook',
    category: 'hr-management',
    title: `Write a recruiter outreach message that references something the candidate actually did`,
    description: `Drafts a short, non-generic outreach message to a passive candidate anchored in a specific, real piece of their public work, built to survive the candidate's built-in skepticism toward mass recruiter spam.`,
    promptText: `Write a short outreach message to a passive candidate who is not job-hunting and gets recruiter messages constantly. The only way this message gets a reply is if it doesn't read like every other one they ignore.

CANDIDATE AND WHAT THEY DID THAT CAUGHT YOUR ATTENTION
{{candidate_hook}}

ROLE YOU'RE REACHING OUT ABOUT
{{role_summary}}

WHY THIS PERSON SPECIFICALLY, NOT JUST "THIS TITLE"
{{why_this_person}}

WHAT YOU CAN ACTUALLY OFFER THAT'S DIFFERENT FROM WHERE THEY ARE
{{differentiator}}

HOW YOU FOUND THEM
{{source}}

Open with the specific thing they did — not "I came across your profile," which every ignored message also says, but the actual project, talk, post, or shipped thing, named precisely enough that a screenshot of it would match. Connect that specific thing to the role in one sentence, not a paragraph — the connection should be a single clear reason, not a list of ways they're "a great fit." State plainly how you found them; candidates are more likely to respond when the sourcing method isn't mysterious, and pretending a cold LinkedIn search was an organic discovery reads as manipulative once they notice, which they usually do.

Keep the whole message under 120 words. Do not include a bulleted list of the role's responsibilities or a link to a full job description in the first message — that's a second-message asset, not an opener. Do not use the word "exciting," "passionate," or "rockstar," and do not open with the recipient's first name followed immediately by flattery about their profile in general terms, since that pattern is the single most-ignored recruiter opener that exists.

End with a low-friction ask — a single question that's easy to answer with one line, not "let me know if you'd be interested in learning more," which asks the candidate to do the work of figuring out how to respond.

OUTPUT FORMAT
1. Subject line (if email) or opening line (if InMail/LinkedIn), under 10 words.
2. The message body, under 120 words.
3. One alternate opening line in case the first doesn't land, using a different specific hook if more than one was given.`,
    variables: [
      {
        name: 'candidate_hook',
        description: `The specific, real, verifiable thing the candidate did that prompted this outreach.`,
        example: `Gave a conference talk last month on migrating a payments system off a legacy monolith with zero downtime.`,
        required: true,
      },
      {
        name: 'role_summary',
        description: `One or two sentences on the role.`,
        example: `Staff Backend Engineer leading a similar legacy-to-microservices migration for a fintech scaleup.`,
        required: true,
      },
      {
        name: 'why_this_person',
        description: `The single clearest reason this specific person, not just this job title, is relevant.`,
        example: `We're six months into the exact kind of zero-downtime migration she described, and are missing someone who's actually done it before.`,
        required: true,
      },
      {
        name: 'differentiator',
        description: `What's genuinely different here from wherever they currently are.`,
        example: `She'd own the migration architecture directly instead of being one of six engineers executing someone else's plan.`,
        required: true,
      },
      {
        name: 'source',
        description: `How you actually found this candidate, stated plainly.`,
        example: `Found the talk recording on the conference's YouTube channel.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `recruiter-outreach`,
      `passive-candidates`,
      `sourcing`,
      `recruiting-email`,
      `talent-acquisition`,
    ],
    whyItWorks: `Passive-candidate outreach fails at the volume most recruiters send it, and the reason is structural rather than stylistic: recipients pattern-match on a handful of tells (generic profile flattery, vague "exciting opportunity" language, a bulleted responsibilities list in message one) within the first two lines and stop reading, regardless of how good the actual role is. Explicitly naming the words and patterns to avoid works because GPT-5.1's default register for "recruiter outreach" leans exactly toward that overused vocabulary, since it's overrepresented in the training data for the genre — a negative instruction list is doing real work here, not padding, because without it the model reaches for "passionate," "rockstar," and generic profile praise almost by default. Requiring the hook to be specific enough that "a screenshot would match" forces concreteness that a vague instruction like "personalize the outreach" doesn't reliably produce, since a model can satisfy "personalize" with a paraphrased generality that still reads as templated. Stating the sourcing method plainly rather than let the model default to a mysterious "came across your profile" phrasing matters because that phrase is itself a well-known tell that experienced candidates recognize as evasive, and transparency about sourcing measurably improves response rates because it removes one layer of suspicion the reader would otherwise have to resolve before deciding whether to trust the rest of the message. The word-count ceiling forces every other instruction to compress into what actually matters, since without it the model will default to including the full role rationale in message one, which the low-friction-ask instruction is specifically designed to prevent by pushing detail into a second message the candidate has to opt into first.`,
    exampleOutput: `Subject: Zero-downtime migration talk. Body: Hi Priya — watched your talk on the payments-system migration off the legacy monolith with zero downtime. We're six months into almost the identical migration at a fintech scaleup and don't have anyone on the team who's actually done this before, not just read about it. This role would have you owning the migration architecture directly rather than executing someone else's plan. Worth a 15-minute call to compare notes, even if it's not the right timing? Found your talk on the conference's YouTube channel, for full transparency.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-rejection-email-final-round-constructive-feedback',
    category: 'hr-management',
    title: `Write a final-round rejection email that gives real feedback without creating legal exposure`,
    description: `Drafts a rejection email for a candidate who made it to the final round, giving one specific, useful reason without comparative statements or promises the company can't stand behind.`,
    promptText: `You are writing a rejection email for a candidate who made it to the final round of interviews — further than a generic "thank you for applying" rejection, and deserving of a more specific response, but one that stays within safe, defensible bounds.

CANDIDATE AND ROLE
{{candidate_and_role}}

ACTUAL REASON FOR THE DECISION
{{decision_reason}}

STRENGTHS WORTH NAMING
{{genuine_strengths}}

FUTURE RELATIONSHIP
{{future_relationship}}

Write the email to name one specific, defensible reason for the decision — tied to the role's actual requirements, never a comparison to the other finalist ("we chose someone with more X" invites the reader to wonder what X they supposedly lack, which is both unhelpful and legally sloppier than describing what the role needed). State the reason as a gap against the role's needs, not a judgment about the person overall — "the role needed deeper hands-on experience with Y in the first 90 days" is defensible; "you're not senior enough" is not.

Name at least one genuine strength specifically, using something they actually demonstrated in the process, not generic praise — this should read as evidence you paid attention, not as a consolation prize.

Do not promise future consideration, a specific other role, or that the company will "keep them in mind" unless that is genuinely true and someone is actually going to follow up — an insincere promise here is worse than no promise, since it sets an expectation that will go unmet and damages the company's reputation with a candidate who was otherwise a near-miss.

Do not include any statement that could be read as feedback on protected characteristics, personality judgments, or comparisons to specific other candidates. Keep the tone warm but brief — a final-round candidate deserves respect, not an essay.

OUTPUT FORMAT
1. Subject line.
2. Email body, three short paragraphs: the decision stated plainly and early, one specific defensible reason plus one genuine strength, and a warm closing that matches the future-relationship input exactly (no embellishment beyond what was stated as true).`,
    variables: [
      {
        name: 'candidate_and_role',
        description: `Who the candidate is and what role they interviewed for.`,
        example: `Marcus, final-round candidate for Senior Product Manager, Growth team.`,
        required: true,
      },
      {
        name: 'decision_reason',
        description: `The real, specific, role-tied reason for the decision.`,
        example: `The role needs someone who has run paid-acquisition experiments hands-on in the last two years; Marcus's experience there was managerial oversight rather than direct execution.`,
        required: true,
      },
      {
        name: 'genuine_strengths',
        description: `Something specific and real the candidate demonstrated.`,
        example: `His breakdown of our onboarding funnel in the case study interview was sharper than any other candidate's — he found a drop-off point our own team had missed.`,
        required: true,
      },
      {
        name: 'future_relationship',
        description: `What is actually true about future contact — be honest here, not aspirational.`,
        example: `We'd genuinely like to keep him in mind if a more senior, strategy-focused role opens in the next two quarters, and our VP of Product will personally reach out if that happens.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `rejection-email`,
      `candidate-experience`,
      `recruiting-communications`,
      `employer-branding`,
      `hr-writing`,
    ],
    whyItWorks: `The instruction to avoid comparative language ("we chose someone with more X") is doing the most legally and practically important work in this prompt: comparative rejection language invites the candidate to reverse-engineer what they supposedly lack relative to another specific person, which both feels worse to receive and creates a paper trail that reads badly out of context if the decision is ever scrutinized, whereas a gap-against-role-requirements framing is defensible because it's about the job's needs, not a ranking of people. GPT-5.1 defaults toward warm, softening language when asked to write a rejection, which without guardrails tends to produce vague reassurance ("you were a strong candidate, it was a tough decision") that says nothing specific — requiring one named, role-tied reason forces the output past that vagueness into something a candidate can actually learn from, which is the entire point of giving final-round feedback at all instead of a form rejection. The instruction against insincere future-consideration promises exists because a model asked to write something "warm" will reach for exactly that kind of soft closer by default, and here it's explicitly gated behind whether it's genuinely true, which requires the requester to have actually decided that before generating the email rather than letting boilerplate warmth manufacture a commitment nobody intends to keep. The prohibition on personality judgments and protected-characteristic-adjacent language matters because "not senior enough" or similar phrasing, even when not legally protected-characteristic language itself, reads as a judgment about the person rather than a fit assessment against the role, and that distinction is exactly the line between defensible hiring communication and something that sounds like a pretext if ever examined.`,
    exampleOutput: `Subject: Update on the Senior PM, Growth role. Body: Hi Marcus — after a lot of deliberation, we've decided to move forward with another candidate for the Senior Product Manager, Growth role. The role specifically needs someone who has run paid-acquisition experiments hands-on in the last two years, and your recent experience has been more on the managerial-oversight side of that work. That said, your breakdown of our onboarding funnel in the case study interview was the sharpest of any candidate we saw — you caught a drop-off point our own team had missed. If a more senior, strategy-focused role opens on our team in the next two quarters, our VP of Product will personally reach out.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-offer-email-negotiation-ready-comp-breakdown',
    category: 'hr-management',
    title: `Draft an offer email that's built to survive a counter-offer conversation, not just a signature`,
    description: `Writes a job offer email with a clear compensation breakdown and pre-planned flexibility, so the recruiter isn't improvising when the candidate comes back with a competing offer.`,
    promptText: `You are drafting a job offer email for a candidate who is likely to negotiate or has a competing offer — write it so the flexibility and the firm lines are already sorted out before it's sent, not figured out live during a negotiation call.

CANDIDATE AND ROLE
{{candidate_and_role}}

FULL COMPENSATION COMPONENTS
{{comp_components}}

WHAT IS ACTUALLY NEGOTIABLE VS FIXED
{{negotiation_room}}

KNOWN COMPETING OFFER OR LEVERAGE
{{competing_context}}

DEADLINE AND NEXT STEPS
{{deadline_and_next_steps}}

Open the email with the decision itself, plainly, before any compensation detail — candidates re-read offer emails several times and the headline decision should be unambiguous on first read. Break the compensation down component by component (base, bonus target and how it's calculated, equity with vesting schedule, sign-on if any, benefits highlights relevant to this specific candidate's stated priorities if known) rather than a single lump total, since a lump number invites the candidate to interrogate what's actually behind it in a follow-up call anyway.

Separately from the email itself, write a short internal negotiation brief (not for the candidate) stating exactly which components have real room to move and by how much, which are genuinely fixed policy, and one thing to offer instead of base salary if the candidate pushes on base specifically and there's no room there (extra sign-on, an earlier review date, more equity). If a competing offer or leverage point was given, name the most likely angle the candidate will push on and prepare the one strongest response to it in advance, rather than leaving that for whoever takes the call to invent on the spot.

WHAT NOT TO DO
Do not include speculative compensation figures not present in the input — if equity value or bonus payout history isn't given, describe the mechanism (vesting schedule, target percentage) without inventing a dollar estimate. Do not write the offer email in a tone that oversells the negotiation flexibility that was stated as fixed; if a component is genuinely non-negotiable, the email shouldn't imply otherwise just to sound generous.

OUTPUT FORMAT
1. The candidate-facing offer email, with the compensation breakdown as a clearly labeled list.
2. The internal-only negotiation brief: movable components with room, fixed components, the one alternative lever if base is pushed, and the prepared response to the most likely competing-offer angle.`,
    variables: [
      {
        name: 'candidate_and_role',
        description: `Candidate name and the role being offered.`,
        example: `Elena Vasquez, Senior UX Researcher.`,
        required: true,
      },
      {
        name: 'comp_components',
        description: `The full breakdown of what's being offered.`,
        example: `Base $142,000, annual bonus target 10% based on company performance, 8,000 RSUs vesting over 4 years with a 1-year cliff, no sign-on currently offered.`,
        required: true,
      },
      {
        name: 'negotiation_room',
        description: `What can actually move and what's fixed policy.`,
        example: `Base has up to $8,000 of room; bonus target and vesting schedule are fixed company-wide policy and cannot change.`,
        required: true,
      },
      {
        name: 'competing_context',
        description: `Any known competing offer or leverage the candidate has.`,
        example: `She mentioned a verbal offer from another company with a higher base but no equity component.`,
        required: false,
      },
      {
        name: 'deadline_and_next_steps',
        description: `The response deadline and what happens after acceptance.`,
        example: `Needs a response within 5 business days; background check and start-date scheduling follow acceptance.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`offer-letter`, `compensation`, `negotiation`, `recruiting`, `total-rewards`],
    whyItWorks: `The instruction to produce a separate internal negotiation brief alongside the candidate-facing email addresses a real operational failure mode: most offer negotiations go wrong not because the offer itself was bad but because whoever fields the candidate's counter has to improvise in real time, and improvised responses to pushback tend to either over-concede on things that were actually fixed or under-offer on things that had real room, both of which cost the company either money or the candidate. Asking GPT-5.1 to name the most likely angle a candidate with a specific competing offer will push on works because it's a concrete prediction task the model can actually reason about from the stated leverage (higher base, no equity implies the push will be on base or on articulating the equity's value), rather than a vague "prepare for negotiation" instruction that produces generic advice with no connection to this specific situation. The explicit prohibition on inventing speculative equity value matters because a model given "write a compelling offer" framing will often reach for a hypothetical payout estimate to make the number feel more concrete and persuasive, which is actively dangerous here since a made-up equity valuation stated in an offer email creates a real expectation the company may not be able to honor and can constitute a misrepresentation if the equity underperforms. Requiring the compensation to be broken into components rather than a lump total reduces the candidate's need to ask basic clarifying questions in a follow-up call, but more importantly it forces transparency about what's actually driving the number, which tends to reduce a specific and common objection pattern where a candidate assumes a headline number is inflated by soft benefits and negotiates against it without understanding what it's actually built from.`,
    exampleOutput: `Candidate email: We're excited to offer you the Senior UX Researcher role. Base salary: $142,000/year. Annual bonus target: 10%, tied to company performance. Equity: 8,000 RSUs vesting over 4 years with a 1-year cliff. Please let us know by [date]. Internal brief: Base has $8,000 of room; bonus target and vesting schedule are fixed. If she pushes on base beyond that, offer an earlier first equity review instead. Likely angle given her competing offer: she'll frame the other company's higher base as the deciding factor — lead with total 4-year value including vesting, not just year-one cash comparison.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-compensation-review-pay-compression-flag',
    category: 'hr-management',
    title: `Run a compensation review that surfaces pay compression before it becomes a retention problem`,
    description: `Analyzes a team's pay data against tenure and level to flag compression and inequity risks in a clear table, so the review produces decisions instead of just a spreadsheet everyone nods at.`,
    promptText: `You are running a compensation review for one team, looking specifically for pay compression (newer hires paid close to or above longer-tenured people at the same level) and any pattern that would look like inequity if scrutinized.

TEAM PAY DATA
{{pay_data}}

LEVELING FRAMEWORK IN USE
{{leveling_framework}}

BUDGET AVAILABLE FOR ADJUSTMENTS
{{adjustment_budget}}

KNOWN CONTEXT PER PERSON (performance, market moves, tenure)
{{person_context}}

STEP 1 — BUILD THE COMPARISON TABLE
Group people by level (not by title alone, if title and level can diverge) and list current pay, tenure at company, tenure at level, and last increase date, in one table sorted by level then by tenure descending.

STEP 2 — FLAG COMPRESSION AND ANOMALIES
For each level group, flag any case where a shorter-tenured person is paid within 5% of or above a longer-tenured person at the same level with equal or stronger performance context, and separately flag anyone more than two standard deviations of that level's pay range below the group's median with no performance or context reason given. Do not speculate about causes not in the data (do not guess at gender or other protected-characteristic patterns from names or any other proxy) — flag the pay pattern itself and note explicitly that any deeper equity analysis needs the company's formal pay-equity process, not this review.

STEP 3 — PRIORITIZE WITHIN BUDGET
Rank the flagged cases by retention risk (recent tenure with strong performance and no increase is higher risk than a compression case involving someone with a documented performance issue), and show how far the stated adjustment budget goes against that ranked list — state plainly if the budget doesn't cover every flagged case and which ones would be deferred.

OUTPUT FORMAT
1. The full comparison table.
2. Flagged compression cases and flagged below-median anomalies, each with the specific numbers that triggered the flag.
3. A ranked adjustment list showing what the given budget covers and what it doesn't.
4. One line stating that any suspected systemic equity issue beyond individual compression cases should go through the company's formal pay-equity audit process rather than being resolved ad hoc here.`,
    variables: [
      {
        name: 'pay_data',
        description: `The raw pay data for the team being reviewed.`,
        example: `12 engineers at levels L3-L5 with current base, hire date, and last increase date for each.`,
        required: true,
      },
      {
        name: 'leveling_framework',
        description: `How levels are defined so grouping is accurate.`,
        example: `L3 = 0-2 years scope, L4 = owns a subsystem, L5 = owns cross-team technical direction.`,
        required: true,
      },
      {
        name: 'adjustment_budget',
        description: `Total budget available for pay adjustments this cycle.`,
        example: `$45,000 total across the team for this cycle.`,
        required: true,
      },
      {
        name: 'person_context',
        description: `Relevant performance and market context per person, not just raw numbers.`,
        example: `Two L4s hired in the last 6 months came in at market rate which is now higher than three L4s hired 3 years ago with strong performance ratings since.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `compensation-review`,
      `pay-equity`,
      `pay-compression`,
      `total-rewards`,
      `retention`,
    ],
    whyItWorks: `The explicit instruction not to speculate about protected-characteristic patterns from names or proxies is the single most important constraint in this prompt, because a model asked to "look for inequity" in a pay table has enough surface pattern-matching capability to produce guesses that look analytically confident but are actually unfounded inference from names or other proxies — output like that is worse than no analysis at all, since it can manufacture a false equity concern or, just as dangerously, miss a real one while appearing to have covered it; routing anything beyond individual compression flags to the company's formal pay-equity process keeps the tool doing what it can actually do reliably (arithmetic and pattern flagging on the data given) rather than what it can't (causal inference about protected characteristics from insufficient data). The two-part flagging rule — compression by tenure comparison and below-median anomaly by standard deviation — gives GPT-5.1 a concrete, checkable rule to apply consistently across every row rather than an open-ended "look for problems" instruction, which tends to produce inconsistent flagging where the model catches obvious cases and misses subtler ones depending on where they fall in the list; a numeric threshold applied uniformly removes that inconsistency. Ranking flagged cases by retention risk rather than presenting them in table order matters because a compensation review's actual output needs to be a decision under a real budget constraint, not just a list of interesting patterns — without an explicit ranking instruction, the model would present flags neutrally and leave the prioritization work, which is the actual hard part of the task, to the reader instead of doing it as part of the deliverable.`,
    exampleOutput: `L4 group: Priya (hired 3.2 years ago, $118,000, strong performance, no increase in 14 months) sits within 3% of Jordan (hired 5 months ago, $121,000, market-rate new hire) — flagged as compression. Anomaly: no below-median flags in this group. Ranked adjustment: Priya is highest retention risk (strong performer, stale pay, direct compression exposure) — a $9,000 adjustment brings her to $127,000, clearing compression and using about 20% of the $45,000 budget. Two lower-priority flagged cases would need to be deferred to next cycle at current budget.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-promotion-case-calibration-committee-memo',
    category: 'hr-management',
    title: `Write a promotion justification memo that survives a calibration committee's scrutiny`,
    description: `Turns a manager's case for promoting someone into a memo built on specific evidence against the next level's actual bar, structured to hold up when a calibration committee pushes back.`,
    promptText: `Write a promotion justification memo for a calibration committee that hasn't worked with this person day to day and will push back on anything that reads as manager advocacy rather than evidence.

PERSON AND PROPOSED MOVE
{{person_and_move}}

NEXT LEVEL'S ACTUAL BAR
{{level_bar}}

SPECIFIC EVIDENCE
{{evidence}}

COUNTERARGUMENT YOU EXPECT
{{expected_pushback}}

Open with the promotion ask stated as a claim against the next level's specific bar, not a general "they're ready" statement — "meets the L4 bar because they've independently owned two cross-team technical decisions in the last two quarters" is a checkable claim; "they're clearly operating at the next level" is not. For each piece of evidence given, connect it explicitly to one specific element of the level bar rather than listing accomplishments and leaving the committee to map them itself — the committee's job is to judge the connection, not reconstruct it.

Address the expected pushback directly and by name, in its own section, rather than hoping the evidence section preempts it implicitly. If the honest answer to the pushback is that the evidence is thinner in that specific area, say so plainly and state what would need to be true to fully close that gap — a memo that oversells a weak spot loses credibility faster than one that acknowledges it and argues the rest of the case still clears the bar.

Do not use comparative language against specific named peers ("more ready than X") — anchor every claim to the level bar itself, not to a relative ranking, since a committee evaluates against the bar, not a beauty contest between individuals. Do not inflate a single strong quarter into a pattern if the timeframe given doesn't support that framing — state the actual timeframe the evidence covers.

OUTPUT FORMAT
1. The promotion claim, stated against the specific level bar.
2. Evidence section, each item explicitly mapped to a bar element.
3. A dedicated "anticipated pushback" section addressing the expected counterargument honestly, including any real gap.
4. A one-paragraph recommendation stating whether the case clears the bar as-is or what would need to be true to close it.`,
    variables: [
      {
        name: 'person_and_move',
        description: `Who is being proposed for promotion and to what level.`,
        example: `Devon Okafor, Software Engineer L3 to L4.`,
        required: true,
      },
      {
        name: 'level_bar',
        description: `The specific, actual criteria for the target level.`,
        example: `L4 requires independently owning a subsystem's technical direction and mentoring at least one L2/L3 without direct oversight.`,
        required: true,
      },
      {
        name: 'evidence',
        description: `Specific, dated accomplishments to use as evidence.`,
        example: `Led the migration of the notifications service off the legacy queue independently over 2 quarters; has been informally mentoring a new L2 hire since March with positive feedback from that hire.`,
        required: true,
      },
      {
        name: 'expected_pushback',
        description: `The counterargument you expect the committee to raise.`,
        example: `Committee may say one migration project isn't enough breadth to prove sustained L4-level ownership.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `promotion`,
      `calibration`,
      `performance-review`,
      `career-ladder`,
      `manager-toolkit`,
    ],
    whyItWorks: `Calibration committees exist specifically to catch cases where a manager's genuine belief in their report substitutes for evidence against a shared bar, so a memo that reads as advocacy rather than argument gets discounted immediately regardless of whether the underlying case is actually strong — requiring every evidence item to be explicitly mapped to a specific bar element forces the memo into the form a committee can actually evaluate quickly, rather than one it has to reverse-engineer, which matters practically because committees review many cases in one sitting and an unmapped list of accomplishments reads as unprocessed input rather than a finished argument. The dedicated pushback section exists because GPT-5.1, asked to write a persuasive memo, will default toward presenting the strongest possible case and omitting weaknesses unless explicitly instructed otherwise — that omission is exactly what makes advocacy memos fail in front of a skeptical committee, since the first question calibration reviewers ask is usually the obvious counterargument, and a memo that has visibly already answered it honestly reads as more credible, not less, than one that pretends no counterargument exists. Prohibiting comparative language against named peers matters for the same reason it matters in the compensation-review prompt: a bar-referenced claim is verifiable against a shared standard, while a relative claim ("more ready than X") just imports a different, unstated bar (be better than a specific person) that the committee never agreed to evaluate against, and also creates an unnecessary and unfair comparison on the record. Explicitly requiring the actual evidence timeframe to be stated protects against a subtler failure mode where one strong quarter gets rhetorically inflated into "a consistent pattern," which a model optimizing for persuasiveness will do by default unless told to be precise about how much time the evidence actually spans.`,
    exampleOutput: `Claim: Devon meets the L4 bar of independently owning a subsystem's technical direction and mentoring without oversight. Evidence: led the notifications-service migration off the legacy queue independently over 2 quarters (maps to independent technical ownership); has informally mentored a new L2 hire since March with positive feedback (maps to mentoring criterion). Anticipated pushback: committee may argue one migration project is too narrow to prove sustained ownership — this is a fair concern; the mentoring evidence and the migration's cross-team scope partially offset it, but a second independent project would close this gap more fully. Recommendation: case clears the bar on balance, though a second data point next quarter would remove the one open question.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-succession-plan-key-role-single-point-of-failure',
    category: 'hr-management',
    title: `Build a succession plan for the one role that would actually hurt if the person left tomorrow`,
    description: `Maps bench strength and readiness gaps for a specific single-point-of-failure role, so succession planning produces a real development plan for named people instead of an abstract org-chart exercise.`,
    promptText: `Build a succession plan for one specific role that would create real disruption if the current person left with normal notice — not a company-wide succession exercise, just this one role, treated seriously because the risk is real.

ROLE AND CURRENT PERSON
{{role_and_person}}

WHY THIS ROLE IS A SINGLE POINT OF FAILURE
{{spof_reason}}

INTERNAL CANDIDATES TO CONSIDER
{{internal_candidates}}

CURRENT FLIGHT RISK SIGNAL, IF ANY
{{flight_risk_signal}}

For each internal candidate given, assess readiness against the role's actual requirements on a realistic timeline (ready now, ready in 12 months with specific development, ready in 24+ months or unlikely) — do not default every candidate to a hopeful "could grow into it" without naming the specific gap and what closing it would require. If no internal candidate is genuinely close, say so plainly rather than stretching a weak internal case to avoid recommending an external search, since a succession plan that pretends readiness exists when it doesn't leaves the organization exposed at the exact moment it matters.

For the single most viable candidate, write a concrete 12-month development plan tied to the specific gap identified, not a generic "more leadership exposure" recommendation — name the actual project, stretch assignment, or exposure opportunity that would close that specific gap.

Separately, address the interim coverage question directly: if the current person left with only standard notice today, name who would cover the most critical parts of the role in the gap, even if that coverage is partial or comes with an explicit tradeoff (something else that would have to slip).

If a flight-risk signal was given, treat the timeline in this plan as more urgent accordingly, and say so explicitly rather than treating this as a routine, unhurried planning exercise.

OUTPUT FORMAT
1. Readiness assessment per candidate (ready now / 12 months / 24+ months or unlikely), with the specific gap named for each.
2. If no strong internal candidate exists, a plain statement recommending an external search be started in parallel.
3. A 12-month development plan for the most viable candidate.
4. An interim coverage plan for a sudden departure, naming who covers what and what tradeoff that creates.`,
    variables: [
      {
        name: 'role_and_person',
        description: `The specific role and who currently holds it.`,
        example: `Head of Infrastructure, currently held by one person for the last 6 years.`,
        required: true,
      },
      {
        name: 'spof_reason',
        description: `Why this specific role is a real single point of failure.`,
        example: `He is the only person who fully understands the legacy on-prem-to-cloud hybrid setup that half the product still runs on.`,
        required: true,
      },
      {
        name: 'internal_candidates',
        description: `Names and current levels of internal people worth considering.`,
        example: `Two senior infrastructure engineers, both 2-3 years tenure, neither has managed people or owned architecture decisions independently yet.`,
        required: true,
      },
      {
        name: 'flight_risk_signal',
        description: `Any signal, if one exists, that the current person might leave sooner than expected.`,
        example: `He mentioned in his last 1:1 that he's been approached by a recruiter and is 'thinking about what's next' in general terms.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `succession-planning`,
      `bench-strength`,
      `key-role-risk`,
      `retention`,
      `org-development`,
    ],
    whyItWorks: `Succession plans routinely fail as an exercise because the default output for this kind of request is a comforting fiction — every internal candidate gets marked as having growth potential regardless of the actual gap, since a model asked to assess readiness will lean toward optimistic, encouraging framing unless explicitly told that overstating readiness is itself the failure mode being guarded against here. Requiring a named, specific gap for every readiness tier, rather than accepting a vague "could grow into it," forces GPT-5.1 to actually reason about what's missing between the candidate's current scope and the role's requirements instead of pattern-matching to generic development language, which is the difference between a plan that produces an actual 12-month assignment and one that produces a sentence nobody can act on. The instruction to say plainly when no internal candidate is genuinely close addresses a specific organizational bias this exercise is prone to: succession planning is often run to demonstrate internal bench depth exists, which creates pressure, even unstated, to find a plausible internal story rather than admit the org needs to look outside — an AI drafting tool has no stake in that internal political pressure, so it's well positioned to state the honest assessment if explicitly instructed to prioritize accuracy over a reassuring narrative. The interim-coverage section exists because a succession plan focused only on the 12-24 month horizon leaves the actually dangerous window uncovered — the two-week-notice gap — and asking for that explicitly, including the tradeoff the interim coverage creates, prevents the plan from looking complete while leaving the highest-probability near-term risk unaddressed. Treating a stated flight-risk signal as urgency-shifting rather than just background color matters because a model given ambiguous risk information will often average it into a moderate, business-as-usual tone unless told directly that the mentioned signal should change the plan's pacing.`,
    exampleOutput: `Candidate A: ready in 12 months with specific development — has strong technical depth but has never owned an architecture decision independently; needs to lead one significant infra project end-to-end with formal ownership, not just execution. Candidate B: 24+ months or unlikely without a role change — strong IC but has shown no interest in the people-management half of this role in two prior conversations. No candidate is ready now; given the recruiter contact mentioned, recommend starting a quiet external search in parallel rather than waiting the full 12 months. Interim coverage: Candidate A could cover architecture decisions with the current person's remote availability for urgent escalations only, which would slow the pending database migration by roughly one quarter.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-workforce-planning-headcount-scenario-model',
    category: 'hr-management',
    title: `Model three honest headcount scenarios instead of one optimistic hiring plan`,
    description: `Builds a headcount plan across a growth, flat, and freeze scenario for the next few quarters, forcing each scenario to name what actually gets cut or delayed rather than presenting only the plan leadership wants to hear.`,
    promptText: `Build a workforce plan across three honest scenarios for the next {{planning_horizon}} — growth, flat, and freeze — for one function, so leadership has a real plan for more than just the optimistic case.

FUNCTION AND CURRENT HEADCOUNT
{{function_and_headcount}}

CURRENT OR EXPECTED WORKLOAD DRIVERS
{{workload_drivers}}

OPEN REQS AND THEIR STATUS
{{open_reqs}}

BUDGET SIGNAL FOR EACH SCENARIO
{{budget_signal}}

For the growth scenario, size headcount to the stated workload drivers and note which open reqs actually need to be filled versus which are nice-to-have expansion, since "growth" scenarios tend to get built by adding roles without checking whether the workload driver actually justifies each one specifically.

For the flat scenario, hold headcount roughly level and identify which open reqs get paused, not just "reprioritized" euphemistically — name the specific req and the real consequence of not filling it (a project slips, a team absorbs more on-call load, whatever is true).

For the freeze scenario, go further than pausing open reqs: identify what current work would have to stop or be descoped given existing headcount and workload, and name it specifically rather than assuming the same team can just absorb everything by working harder — an unfunded freeze scenario that doesn't name a tradeoff isn't a real scenario, it's wishful thinking with a different label.

For each scenario, name the single most likely trigger that would tell leadership this scenario is the one actually playing out (a specific revenue signal, a specific attrition rate, a specific delivery slip) rather than leaving the decision of "which scenario are we in" as a vague quarterly gut check.

OUTPUT FORMAT
A table with one row per scenario (growth / flat / freeze), columns for: net headcount change, which open reqs proceed vs pause vs cancel, the one concrete tradeoff or consequence, and the trigger signal that would indicate this scenario is the one happening. Follow the table with one paragraph recommending which scenario currently looks most likely given the inputs provided, stated as a judgment call, not a certainty.`,
    variables: [
      {
        name: 'planning_horizon',
        description: `The time period this plan covers.`,
        example: `next two quarters`,
        required: true,
      },
      {
        name: 'function_and_headcount',
        description: `Which function this plan is for and current headcount.`,
        example: `Customer Success team, currently 14 people.`,
        required: true,
      },
      {
        name: 'workload_drivers',
        description: `What's actually driving headcount need in this function.`,
        example: `Customer count expected to grow 20% if the enterprise deal pipeline closes as forecast; flat otherwise.`,
        required: true,
      },
      {
        name: 'open_reqs',
        description: `Current open requisitions and where they stand.`,
        example: `3 open reqs: 1 approved and in final interviews, 2 approved but sourcing hasn't started.`,
        required: true,
      },
      {
        name: 'budget_signal',
        description: `What's known about budget likelihood for each scenario.`,
        example: `Finance has said budget for all 3 reqs is contingent on Q3 revenue hitting target; freeze scenario would mean a hiring pause company-wide.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `workforce-planning`,
      `headcount-planning`,
      `scenario-planning`,
      `hr-strategy`,
      `budget-planning`,
    ],
    whyItWorks: `Workforce plans built without a forced multi-scenario structure tend to collapse into a single optimistic plan with soft hedging language, because a model given "build a workforce plan" without further constraint will default to the scenario implied by the framing of the request, usually growth, and treat the other possibilities as an afterthought footnote rather than a fully worked-out alternative. Requiring each of the three scenarios to name a specific, concrete tradeoff rather than accepting a euphemism like "reprioritized" matters because "reprioritized" is exactly the kind of soft language GPT-5.1 will default to when asked to describe cutting something, since it avoids stating an uncomfortable consequence directly — forcing a named specific consequence (a project slips, a team absorbs more load) produces a plan leadership can actually act on, versus one that sounds responsible while committing to nothing. The freeze scenario's requirement to identify what current work stops, not just what future hiring pauses, closes a common gap in these exercises: a freeze scenario that only talks about not hiring is incomplete, because the actual operational question under a freeze is what the existing team stops doing, and a model left to its own devices will often quietly assume the same output continues with fewer people, which is not a real scenario but an unstated assumption of proportionally higher productivity that usually doesn't hold. Requiring a named trigger signal per scenario converts this from a document that gets built once and filed away into an operational tool leadership can actually check against reality quarter to quarter, which matters because scenario plans without trigger signals tend to never get revisited until the situation has already deteriorated past the point where the flat or freeze plan could be implemented calmly.`,
    exampleOutput: `Growth row: net +2 (the approved req in final interviews plus one of the two unsourced reqs; the second unsourced req is genuinely nice-to-have, not workload-justified). Flat row: net 0, the req in final interviews still proceeds since it's already committed, the two unsourced reqs pause, meaning on-call load per person rises roughly 15%. Freeze row: net 0 including canceling the in-flight interview process, and the team would need to descope proactive account check-ins to cover reactive support only. Trigger for freeze: if Q3 revenue comes in more than 8% under forecast. Recommendation: flat scenario currently looks most likely given the enterprise pipeline is only partially committed.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-competency-matrix-role-leveling-framework',
    category: 'hr-management',
    title: `Build a competency matrix that levels distinguish by scope, not by adjectives`,
    description: `Constructs a role-leveling matrix across skill dimensions where each level is defined by a checkable scope difference, avoiding the common failure where every level description just uses a bigger adjective.`,
    promptText: `Build a competency matrix for {{job_family}} across {{levels}}, where each level within each skill dimension is distinguished by a concrete difference in scope or autonomy — not by inflating the same description with stronger adjectives at each level up.

SKILL DIMENSIONS TO INCLUDE
{{skill_dimensions}}

CURRENT VAGUE LANGUAGE TO REPLACE, IF ANY
{{current_language}}

EXAMPLES OF ACTUAL WORK AT DIFFERENT LEVELS
{{work_examples}}

For each skill dimension, write a one- or two-sentence description per level that names a concrete difference: what kind of problem they handle (well-defined vs ambiguous), how much oversight is involved (reviewed before, reviewed after, none), and what scope of impact (their own work, their team's, multiple teams). Two adjacent levels should never be distinguishable only by intensity words like "strong," "excellent," or "advanced" applied to the same sentence — if you can't state a concrete difference in problem type, oversight, or scope between two levels, say so explicitly rather than inventing a fake distinction to fill the cell.

If current vague language was provided, rewrite each instance to show what it was actually failing to distinguish, and give the sharper replacement — treat this as a before/after pair so the reasoning is visible, not just the fix.

If real work examples were given, use them as calibration anchors: check that your level descriptions would actually sort those specific examples correctly, and flag if any example doesn't cleanly fit the level it was supposedly an example of, since that mismatch usually reveals the framework's boundary is drawn in the wrong place.

WHAT NOT TO DO
Do not produce a matrix where every cell reads as a template with only the adjective swapped ({dimension} at a {level} level requires {stronger word} skills) — that pattern indicates you haven't actually reasoned about what changes at each level and should be treated as a failed draft to redo, not a finished answer.

OUTPUT FORMAT
1. The matrix as a table: rows are skill dimensions, columns are levels, cells are the concrete level description.
2. If vague language was provided, a before/after table showing what was ambiguous and the sharper replacement.
3. If work examples were given, a note on whether each sorted cleanly into its expected level or revealed a boundary problem.`,
    variables: [
      {
        name: 'job_family',
        description: `The job family this competency matrix is for.`,
        example: `Product Design`,
        required: true,
      },
      {
        name: 'levels',
        description: `The levels to build the matrix across.`,
        example: `IC2 through IC5`,
        required: true,
      },
      {
        name: 'skill_dimensions',
        description: `The specific skill dimensions to define per level.`,
        example: `Problem framing, cross-functional influence, design system ownership, mentoring.`,
        required: true,
      },
      {
        name: 'current_language',
        description: `Existing level descriptions that are too vague to distinguish, if any exist.`,
        example: `Current IC3 and IC4 both say 'demonstrates strong design craft and collaborates well with engineering' with no other difference.`,
        required: false,
      },
      {
        name: 'work_examples',
        description: `Real examples of work believed to represent specific levels, for calibration.`,
        example: `An IC4 redesigned the checkout flow end-to-end across three squads with no senior oversight; an IC3 owns the empty-states pattern for one product area with weekly design review.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `competency-matrix`,
      `career-ladder`,
      `job-leveling`,
      `org-design`,
      `performance-framework`,
    ],
    whyItWorks: `Competency matrices produced without an explicit constraint against adjective-inflation almost universally fall into the exact failure pattern this prompt names directly, because "describe skill X at increasing levels" is a template GPT-5.1 (and most level frameworks it has seen in training data) satisfies most easily by keeping the sentence structure identical and swapping in a stronger word — "solid" becomes "strong" becomes "exceptional" — which produces a matrix that looks complete but gives a calibration committee nothing to actually check a person against, since "exceptional" versus "strong" isn't observable in real work the way "reviewed after the fact" versus "reviewed before shipping" is. Explicitly instructing the model to say so when it can't find a concrete distinction, rather than inventing one to fill the cell, matters because the default behavior when asked to complete a table is to fill every cell somehow, and an honestly blank or flagged cell is more useful output than a confidently fabricated fake distinction that later gets used to make a real promotion decision. The before/after treatment of existing vague language does double duty: it produces the fix, but showing what the vague version was actually failing to distinguish teaches the requester to recognize the pattern themselves in the other level descriptions they didn't submit for rewrite, which is more valuable long-term than a one-time fix. Using real work examples as calibration anchors is the most mechanically important check in the prompt, because a level framework that sounds coherent in the abstract can still misplace real work when applied, and asking the model to actually test its own definitions against concrete examples — and flag when an example doesn't fit — catches exactly the kind of boundary error that only surfaces when a framework meets real cases, which abstract-only construction can never reveal.`,
    exampleOutput: `Design system ownership, IC3: owns a defined pattern within one product area, changes reviewed by a senior designer before shipping. IC4: owns design system decisions across multiple product areas, changes ship without prior review but are audited after the fact in monthly design reviews. Before/after: vague 'strong collaboration with engineering' at both IC3 and IC4 replaced — IC3 collaborates within a single squad's sprint cycle; IC4 sets design-engineering handoff norms adopted by other squads. Calibration check: the IC4 checkout-redesign example fits cleanly (cross-squad scope, no prior oversight); the IC3 empty-states example fits cleanly (single area, weekly review).`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-team-okrs-cascade-avoid-vanity-metrics',
    category: 'hr-management',
    title: `Cascade a team's OKRs from a company goal without smuggling in vanity metrics`,
    description: `Derives team-level OKRs from a stated company goal, forcing each key result to be something the team can actually move and something that would matter even if the number looked good for the wrong reason.`,
    promptText: `Cascade OKRs for {{team_name}} from the company-level goal below, for {{time_period}}.

COMPANY GOAL
{{company_goal}}

WHAT THIS TEAM ACTUALLY CONTROLS
{{team_control}}

CURRENT BASELINE METRICS
{{current_baseline}}

KNOWN RISKS OF GAMING A METRIC
{{gaming_risk}}

Write one objective that states in plain language how this team's work contributes to the company goal — not a restatement of the company goal with the team's name attached, which is the most common cascading failure and produces an objective the team has no distinct ownership of.

For each key result, apply two checks before including it: first, is this something the team can actually move through its own actions, not something that depends primarily on another team's execution or on market conditions outside anyone's control; second, could this number go up for a bad reason that the gaming risk describes, and if so, either pair it with a guardrail metric that would catch that failure mode, or state explicitly why the risk is acceptable given how the metric is being used.

Use the current baseline to set targets that are ambitious but state the reasoning for the specific target chosen — not a round number picked because it sounds aspirational, but a number derived from the baseline plus a stated assumption about what's achievable and why.

Limit this to at most 3 key results per objective and at most 2 objectives total — a longer list doesn't represent more ambition, it represents a team that hasn't decided what actually matters most this period, which is a worse planning outcome than a shorter, sharper list.

OUTPUT FORMAT
1. Objective 1 (and objective 2 if truly needed), each stated as this team's distinct contribution to the company goal.
2. Up to 3 key results per objective, each with: the target, the reasoning behind that specific target given the baseline, and either a paired guardrail metric or an explicit note on why the gaming risk is acceptable here.
3. One line confirming every key result passed the "can this team actually move it" check, or naming which one didn't and was cut for that reason.`,
    variables: [
      {
        name: 'team_name',
        description: `The team these OKRs are for.`,
        example: `Onboarding Engineering team`,
        required: true,
      },
      {
        name: 'time_period',
        description: `The OKR period.`,
        example: `Q4`,
        required: true,
      },
      {
        name: 'company_goal',
        description: `The company-level goal being cascaded from.`,
        example: `Reduce customer time-to-first-value from 14 days to 7 days company-wide.`,
        required: true,
      },
      {
        name: 'team_control',
        description: `What this specific team can actually influence toward the company goal.`,
        example: `This team owns the self-serve setup wizard and the first-week email sequence, but not sales handoff quality or customer success staffing.`,
        required: true,
      },
      {
        name: 'current_baseline',
        description: `Current metric baselines relevant to the goal.`,
        example: `Setup wizard completion rate is currently 61%; average time to complete is 22 minutes.`,
        required: true,
      },
      {
        name: 'gaming_risk',
        description: `A known way a relevant metric could be gamed or misleadingly improved.`,
        example: `Completion rate could rise if we simplify the wizard by skipping steps that actually predict long-term retention.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `okrs`,
      `goal-setting`,
      `team-planning`,
      `performance-metrics`,
      `strategy-cascade`,
    ],
    whyItWorks: `The most common OKR-cascading failure is a team objective that's just the company goal copy-pasted with the team's name inserted, and this happens because "cascade OKRs from this company goal" is easy for a model to satisfy by restating rather than by doing the harder work of identifying what this specific team, as opposed to any other team, actually contributes — explicitly requiring the objective to state the team's distinct contribution forces that harder reasoning step rather than accepting the shortcut. The two-part check per key result — can the team actually move it, and can it be gamed — matters because these are the two failure modes that make OKRs useless in practice: a key result the team can't control produces frustration and gets ignored by quarter's end, while a gameable metric produces a technically-hit target that doesn't represent real progress, and a model asked only to "write good key results" won't reliably self-check for either failure unless told explicitly to apply both tests, since both require reasoning about causality and second-order effects that a surface-level metric-writing task doesn't naturally prompt. Requiring the target's reasoning to be shown, tied to the actual baseline, rather than accepting a round aspirational number addresses a specific and common tell of low-effort OKR-writing: targets like "increase completion rate to 80%" that sound ambitious but have no connection to what the baseline and known constraints actually support, which either sets teams up to miss by a wide margin or, worse, teaches them that OKR targets are rhetorical rather than real commitments. The hard cap on objectives and key results forces prioritization to actually happen rather than be deferred, since without a limit a model asked to "cascade OKRs" will often generate a comprehensive-looking list that covers every plausible angle, which reads as thorough but actually represents the opposite of the focusing function OKRs are supposed to serve.`,
    exampleOutput: `Objective: Make self-serve onboarding fast enough on its own to meaningfully move the company's 7-day time-to-value goal. Key Result 1: raise setup wizard completion rate from 61% to 72%, paired with a guardrail that average post-setup week-4 retention doesn't drop below its current baseline, since completion could otherwise be inflated by cutting predictive steps. Key Result 2: cut average wizard completion time from 22 to 15 minutes, a target derived from removing two redundant steps identified in last quarter's session recordings, not a round-number guess. Confirmation: both key results are within this team's direct control since sales handoff and CS staffing were explicitly excluded from scope.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-manager-coaching-first-time-hard-feedback-prep',
    category: 'hr-management',
    title: `Coach a first-time manager through the specific hard conversation they're dreading`,
    description: `Prepares a first-time manager for one real, upcoming difficult feedback conversation with a script, likely reactions, and recovery lines, rather than generic feedback-giving theory they've probably already heard.`,
    promptText: `Coach me — a first-time manager — through a specific hard feedback conversation I have coming up. Skip the general theory of giving feedback; I need help with this exact conversation.

WHO THIS IS WITH AND THE SITUATION
{{conversation_context}}

WHAT I'VE TRIED ALREADY, IF ANYTHING
{{prior_attempts}}

WHAT I'M SPECIFICALLY AFRAID WILL HAPPEN
{{feared_reaction}}

WHAT ACTUALLY NEEDS TO CHANGE
{{desired_outcome}}

Start by naming, in one sentence, the core message this conversation needs to land — the one thing that has to be true in their head when they walk out, even if everything else about the conversation goes imperfectly. Then write an opening line that gets to that core message within the first thirty seconds, since first-time managers most often fail by over-cushioning the opening until the actual point gets lost or arrives so late the person has already tuned out waiting for a "but."

Given what I said I'm specifically afraid will happen, write out that reaction as a realistic response, then give me one line to say back to it that neither backs down from the core message nor escalates the tension — a first-time manager's most common mistake here is either caving the moment there's pushback or getting defensive and turning it into an argument.

If I've already tried addressing this and it didn't work, name specifically what about the previous attempt likely failed to land (too vague, too easy to explain away, not tied to a concrete example) before telling me what to do differently this time — repeating the same approach with more emphasis is the single most common mistake managers make on a second attempt.

End with one thing to explicitly avoid saying in this specific conversation, based on the situation described, not a generic feedback no-no list.

OUTPUT FORMAT
1. The core message in one sentence.
2. The opening line.
3. Their likely reaction (given what I'm afraid of) and my one-line response to it.
4. If a prior attempt was described, what likely went wrong with it and what to do differently.
5. One specific thing not to say in this conversation.`,
    variables: [
      {
        name: 'conversation_context',
        description: `Who this is with and what's actually going on.`,
        example: `My direct report has missed three deadlines this month and blames unclear requirements each time, but the requirements were the same as they've always been.`,
        required: true,
      },
      {
        name: 'prior_attempts',
        description: `What you've already tried, if anything, and how it went.`,
        example: `I mentioned it lightly in our last 1:1 as 'let's tighten up on deadlines' and nothing changed.`,
        required: false,
      },
      {
        name: 'feared_reaction',
        description: `What you're specifically worried will happen in this conversation.`,
        example: `I think they'll get defensive and say the team doesn't give them enough support, which will make me feel like I have to apologize instead of holding the line.`,
        required: true,
      },
      {
        name: 'desired_outcome',
        description: `What concretely needs to change after this conversation.`,
        example: `They need to flag blockers within 24 hours instead of missing the deadline silently and explaining after the fact.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `manager-coaching`,
      `difficult-conversations`,
      `feedback`,
      `first-time-manager`,
      `people-management`,
    ],
    whyItWorks: `First-time managers rarely fail at feedback conversations because they don't know feedback theory — most have read or heard the standard frameworks — they fail because the specific conversation in front of them has a specific person's specific likely reaction, and generic theory doesn't tell them what to actually say when that reaction happens in real time; this prompt is built around that gap rather than repeating theory the manager has already been exposed to. Asking for the core message as a single sentence before anything else forces clarity that a first-time manager often hasn't actually reached themselves — it's common to enter a hard conversation with a vague sense that "something needs to improve" rather than one crisp, landable point, and a model asked to help with a conversation will happily produce a full script around a fuzzy goal unless the goal is nailed down first, so this step exists to catch that fuzziness before it propagates into the whole script. Pre-scripting the response to the specifically feared reaction is the highest-value part of the prompt mechanically, because rehearsing a response to a predicted reaction reduces in-the-moment improvisation exactly where first-time managers are weakest — under real-time social pressure — and GPT-5.1 can reason concretely about what response neither concedes the core message nor escalates conflict when given the actual feared reaction, rather than producing a generic "stay calm and listen" answer that provides no actual words to say. Diagnosing what a prior soft attempt likely failed to communicate, rather than just recommending a stronger version of the same approach, matters because "say it again but more firmly" is the default naive next step and usually fails the same way, since the actual defect (probably that "let's tighten up on deadlines" was vague enough to not clearly connect to a specific accountability expectation) needs to be named and fixed, not just delivered with more emphasis.`,
    exampleOutput: `Core message: missed deadlines with a silent explanation afterward is the actual problem, not the deadlines themselves — the fix is flagging blockers within 24 hours, every time. Opening line: "I want to talk about the pattern on the last three deadlines, and I want to get straight to what needs to change rather than walk around it." Their likely reaction: "the team doesn't give me enough support to hit these." Your response: "That might be true and I want to hear specifics after this — but the immediate fix isn't more support, it's flagging the blocker the day it happens instead of after the deadline passes." Prior attempt likely failed because "let's tighten up on deadlines" named a symptom, not the actual required behavior change, so it was easy to nod at without changing anything. Avoid saying: don't frame this as "I'm disappointed," which will read as personal and trigger defensiveness rather than focus on the specific behavior.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-conflict-resolution-peer-mediation-session-script',
    category: 'hr-management',
    title: `Script a peer mediation session so the HR facilitator isn't improvising the structure live`,
    description: `Builds a structured mediation script for a peer conflict, with ground rules, a facilitation sequence, and a plan for the moment either person tries to relitigate the past instead of solving forward.`,
    promptText: `You are structuring a mediation session between two peers in conflict, for an HR business partner or manager who will facilitate it. This needs to be a session structure, not generic conflict-resolution advice.

THE TWO PEOPLE AND THE CORE CONFLICT
{{conflict_summary}}

WHAT EACH PERSON HAS SAID PRIVATELY, IF KNOWN
{{private_positions}}

WHAT HAS ALREADY BEEN TRIED
{{prior_attempts}}

DESIRED WORKING OUTCOME
{{desired_outcome}}

Open with three or four ground rules stated as behaviors, not values — "each person gets uninterrupted time to state their view before any response" is enforceable in the room; "be respectful" is not, since either person can claim they were being respectful while the other disagrees.

Sequence the session in stages: each person states their view of the situation without the other responding yet, the facilitator names the one or two points where their accounts actually conflict (not every difference, just the load-bearing ones), then a structured discussion of just those specific points, ending with a concrete forward-looking agreement rather than a resolution of who was right about the past.

Given the private positions, if provided, prepare the facilitator for the specific moment this conversation is most likely to derail — usually one person relitigating a past incident instead of engaging with the forward-looking question — and script one redirect line the facilitator can use in that exact moment, naming what triggers it and what to say.

The desired working outcome should be written as a specific, checkable agreement (how they'll handle the next instance of the friction point, not a vague "communicate better") that both people would recognize as real if it happened, and clearly recognize as broken if it didn't.

WHAT NOT TO DO
Do not write this as an assignment of blame between the two people — a mediation script that reads as siding with one person's account will fail the moment the other person senses it, and the facilitator's credibility as neutral is the mechanism that makes the rest of the structure work at all.

OUTPUT FORMAT
1. Ground rules (3-4, each stated as a checkable behavior).
2. The session sequence, stage by stage.
3. The specific likely derailment moment and the facilitator's redirect line for it.
4. The forward-looking agreement, stated specifically enough to check later.`,
    variables: [
      {
        name: 'conflict_summary',
        description: `Who the two people are and the core conflict, neutrally stated.`,
        example: `Two team leads, Sam and Priya, in ongoing friction over who has final say on shared roadmap prioritization decisions.`,
        required: true,
      },
      {
        name: 'private_positions',
        description: `What each person has said privately about the conflict, if you know it.`,
        example: `Sam feels Priya overrides his calls in front of the team without discussing it with him first; Priya feels Sam moves too slowly and she steps in only when a deadline is at real risk.`,
        required: false,
      },
      {
        name: 'prior_attempts',
        description: `What's already been tried to resolve this.`,
        example: `Their shared manager asked them to 'just talk it out' once, which resulted in both feeling unheard and the friction resurfacing within two weeks.`,
        required: false,
      },
      {
        name: 'desired_outcome',
        description: `What a real, working resolution should look like going forward.`,
        example: `A clear rule for who has final call in a prioritization disagreement and how the other person raises a concern before, not after, a decision is made public.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `conflict-resolution`,
      `mediation`,
      `hr-business-partner`,
      `team-dynamics`,
      `manager-toolkit`,
    ],
    whyItWorks: `Mediation sessions run without a structural script tend to collapse into an unstructured venting session, because without an explicit sequence a facilitator will let each person respond immediately to the other's account, which turns the session into a back-and-forth relitigating of specific incidents rather than progress toward a forward-looking agreement — sequencing the session so each person states their view fully before any response, and having the facilitator name only the load-bearing points of disagreement rather than every difference, keeps the conversation from sprawling into every minor grievance either person has accumulated. Requiring ground rules to be stated as checkable behaviors rather than values addresses a specific enforcement problem: a rule like "be respectful" gives the facilitator nothing to point to in the room when someone violates it, since the violator can always claim they were being respectful from their own perspective, whereas "uninterrupted time before response" is something the facilitator can visibly and neutrally enforce without it becoming its own dispute. Preparing the facilitator for the specific predicted derailment moment, using the actual private positions given, is the highest-value part of the prompt because GPT-5.1 can reason concretely from two stated, conflicting private accounts to identify where the conversation is most likely to snag — usually where one person's account of "what really happened" contradicts the other's — and scripting a redirect line in advance means the facilitator has language ready rather than improvising under the social pressure of the room, which is exactly when facilitators tend to accidentally take a side. The explicit prohibition on writing this as blame-assignment matters because a model given both people's private positions has enough information to form an implicit judgment about who's more "right," and if that judgment leaks into the ground rules or sequencing, the facilitator loses the neutral positioning the entire mediation structure depends on to function.`,
    exampleOutput: `Ground rules: each person gets two uninterrupted minutes to state their view; no response is given until both have spoken; either person can request a two-minute pause if the conversation escalates; the facilitator names disagreement points before either person responds to them directly. Sequence: Sam states his view, Priya states hers, facilitator names the one load-bearing conflict (who has final call on prioritization) rather than every friction point mentioned. Likely derailment: Priya may bring up a specific incident from two months ago as evidence Sam is 'always too slow' — facilitator redirect: 'Let's park that specific example and focus on the rule going forward so this doesn't happen again, regardless of who was right that time.' Forward agreement: Sam has final call on roadmap prioritization; Priya raises any concern to him directly before it becomes public, with a 24-hour response window before she can escalate to their shared manager.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-change-management-reorg-phased-comms-plan',
    category: 'hr-management',
    title: `Sequence a reorg communication plan so nobody hears their new reality from a rumor first`,
    description: `Builds a phased communication plan for a team reorganization that sequences who hears what and when, specifically to prevent the common failure where affected people learn their fate secondhand before the official announcement.`,
    promptText: `Build a phased communication plan for {{reorg_description}}, sequenced specifically so no one directly affected hears about their situation secondhand before they hear it from someone who should have told them directly.

WHO IS AFFECTED AND HOW
{{affected_groups}}

TIMELINE CONSTRAINTS
{{timeline}}

WHAT CANNOT BE SHARED YET AND WHY
{{confidentiality_constraints}}

BIGGEST LEAK OR RUMOR RISK
{{leak_risk}}

STAGE 1 — WHO NEEDS TO KNOW BEFORE ANYONE ELSE
List, in strict order, exactly who is told first, second, third — this is not a simultaneous announcement; identify every person whose role changes and make sure each one is told directly by their own manager before any broader announcement goes out, since the single worst version of this rollout is someone learning their team is being dissolved from a company-wide email rather than from their manager first.

STAGE 2 — MANAGER ENABLEMENT
Before Stage 1 conversations happen, managers delivering the direct news need a short script and an FAQ of the hardest questions their specific reports are likely to ask, tailored to what's actually changing for that group, not a generic "here's how to talk about change" doc.

STAGE 3 — BROADER ANNOUNCEMENT
Draft the wider announcement (team meeting or company-wide as appropriate) that comes only after Stage 1 is fully complete, and explicitly state within the plan the minimum time gap required between Stage 1 completing and Stage 3 going out.

STAGE 4 — LEAK CONTINGENCY
Given the stated leak risk, write a short contingency: what happens to the sequencing if word starts spreading before Stage 1 is complete — name the specific trigger for accelerating the timeline and what gets compressed or skipped if that trigger happens.

WHAT NOT TO DO
Do not write vague talking points that avoid stating what's actually changing — people experiencing a reorg can tell immediately when language is being managed rather than informative, and vagueness in this specific context reads as either bad news being hidden or the plan not actually being finalized, both of which are worse than a clear, direct statement of what's changing and what isn't yet decided.

OUTPUT FORMAT
1. Stage 1 order of who's told, by whom, and roughly when.
2. Stage 2 manager script and FAQ.
3. Stage 3 broader announcement draft, with the required minimum gap after Stage 1 stated explicitly.
4. Stage 4 leak contingency plan.`,
    variables: [
      {
        name: 'reorg_description',
        description: `What's actually changing in this reorg.`,
        example: `Merging the Support and Success teams into one Customer Experience org under a single new director.`,
        required: true,
      },
      {
        name: 'affected_groups',
        description: `Who is affected and how, specifically.`,
        example: `12 Support agents and 8 Success managers; two of the current team leads will no longer have direct reports and move into individual contributor senior roles.`,
        required: true,
      },
      {
        name: 'timeline',
        description: `Real constraints on when this needs to happen.`,
        example: `New org needs to be announced company-wide within 10 business days due to an already-scheduled all-hands.`,
        required: true,
      },
      {
        name: 'confidentiality_constraints',
        description: `What can't be shared yet and why.`,
        example: `The new director hasn't been formally offered the role yet, so their name can't be confirmed until that's signed.`,
        required: true,
      },
      {
        name: 'leak_risk',
        description: `The biggest known risk of this leaking before the planned sequence.`,
        example: `One of the affected team leads already suspects something is happening because of recent closed-door meetings and has been asking pointed questions.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `change-management`,
      `reorg-communications`,
      `internal-comms`,
      `organizational-change`,
      `hr-strategy`,
    ],
    whyItWorks: `The single most damaging and common failure in reorg rollouts is sequencing, not content — people can generally handle difficult news about their role changing, but they cannot forgive hearing it secondhand or from a company-wide email before their own manager told them directly, and that failure mode is purely about order and timing, which is exactly why this prompt forces a strict, explicit ordering of who's told first rather than treating communication as a single document to draft. Requiring the manager-enablement stage to happen before the direct conversations, with a script and FAQ tailored to the specific group's actual likely questions rather than a generic change-communication template, matters because a manager delivering news they haven't been prepared to handle will improvise under pressure and often either overpromise ("nothing will really change" when things clearly will) or underdeliver information the report actually needs, and GPT-5.1 can produce a genuinely tailored FAQ here because the specific changes were stated as input, rather than falling back to generic change-management talking points that don't address what this particular group will actually ask. Explicitly requiring a stated minimum time gap between Stage 1 completing and the broader announcement forces a concrete commitment that prevents the common real-world failure where Stage 1 conversations and the broader announcement get compressed together under time pressure, collapsing the very sequencing the plan exists to protect. The leak-contingency stage exists because reorg plans are frequently disrupted by exactly the risk described in the input — someone already suspects something — and a plan without an explicit contingency for that leaves whoever is running the rollout without a pre-decided answer when it happens, forcing an improvised decision about whether to accelerate under exactly the kind of time pressure that produces bad judgment calls. The explicit instruction against vague talking points matters because a model asked to write "communications for a sensitive reorg" will, without a direct counter-instruction, drift toward safe, non-specific corporate language, which in this specific context reads to affected employees as evasive rather than careful, undermining the trust the entire communication plan depends on.`,
    exampleOutput: `Stage 1 order: 1) the two current team leads losing direct reports, told individually by their VP, day 1 morning. 2) the 20 affected agents/managers, told by their current direct manager in 1:1s, day 1 afternoon through day 2 morning. Stage 2: manager script includes a direct line — 'Your role and team structure are changing; here's specifically what's different and what isn't decided yet' — plus an FAQ answering whether current reports change (yes, to the new director once confirmed) and whether compensation changes (no, confirm explicitly if true). Stage 3: company-wide announcement goes out no earlier than 24 hours after all Stage 1 conversations are confirmed complete. Stage 4: if the team lead who already suspects something asks directly before their scheduled Stage 1 conversation, the VP moves that one conversation up immediately rather than risk them hearing it from a peer first, compressing only that individual's timing, not the whole sequence.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'hr-management-hr-faq-self-service-policy-doc',
    category: 'hr-management',
    title: `Write an HR FAQ that actually stops the same three tickets from repeating`,
    description: `Builds a self-service FAQ for one specific policy, targeted at the exact questions generating repeat tickets, so it reduces real ticket volume instead of restating the policy document in a different format.`,
    promptText: `Write a self-service FAQ for {{policy_name}} aimed specifically at reducing the repeat questions HR keeps fielding — not a restatement of the policy document in Q&A format, which employees already skip past because it doesn't actually answer their real question.

THE ACTUAL POLICY
{{policy_summary}}

THE SPECIFIC QUESTIONS THAT KEEP COMING IN AS TICKETS
{{recurring_questions}}

EDGE CASES THAT AREN'T CLEARLY COVERED BY THE POLICY AS WRITTEN
{{edge_cases}}

WHERE TO GO FOR SOMETHING NOT COVERED HERE
{{escalation_path}}

For each recurring question given, write the answer as the actual specific thing employees want to know, not the general policy principle it falls under — if the recurring question is "can I work from a different state for a month," answer that exact scenario directly, rather than restating the general remote-work policy and leaving the employee to interpret whether it applies to their case.

For each edge case that isn't clearly covered by the policy as written, do not invent a confident-sounding answer the policy doesn't actually support — say plainly that this specific situation isn't addressed by current policy and needs to go through the stated escalation path, since a wrong confident answer here creates a worse problem than an honest "this isn't covered, here's who to ask," and could create a precedent or expectation HR never actually agreed to.

Order the FAQ by actual question frequency, most common first, not by the policy document's internal structure — employees scanning a long FAQ give up after the first few entries, so the questions generating the most tickets need to be answered before anything else.

Write each answer short enough to resolve the question in one read, with a pointer to the full policy document only for anyone who wants the complete detail, rather than trying to compress the entire policy into every answer.

OUTPUT FORMAT
1. FAQ ordered by frequency, each entry as a specific question and a direct, specific answer.
2. A separate short section for the given edge cases, each explicitly marked as not covered by current policy with the escalation path stated.
3. One line noting which recurring questions, if any, revealed that the policy itself is ambiguous and might be worth clarifying at the source rather than just explaining better.`,
    variables: [
      {
        name: 'policy_name',
        description: `The specific policy this FAQ covers.`,
        example: `the hybrid work policy`,
        required: true,
      },
      {
        name: 'policy_summary',
        description: `What the actual policy says.`,
        example: `Employees are expected in office 3 days per week, Tuesday-Thursday fixed, with manager approval required for any exception.`,
        required: true,
      },
      {
        name: 'recurring_questions',
        description: `The actual specific questions generating repeat tickets.`,
        example: `Can I work from a different city/state for a few weeks; what happens if my 3 fixed days fall on a public holiday; can I swap one of my in-office days for a different day of the week.`,
        required: true,
      },
      {
        name: 'edge_cases',
        description: `Situations the written policy doesn't clearly address.`,
        example: `Someone with a temporary medical accommodation needing to be fully remote for 6 weeks isn't addressed by the standard exception process, which is built for one-off days.`,
        required: false,
      },
      {
        name: 'escalation_path',
        description: `Where a question not covered here should go.`,
        example: `Their direct manager first, and if still unresolved, the People Ops team via the internal HR ticketing system.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `hr-faq`,
      `self-service`,
      `policy-communication`,
      `employee-experience`,
      `hr-operations`,
    ],
    whyItWorks: `Most HR FAQs fail to reduce ticket volume because they're structured around the policy document's own logic rather than around the actual questions employees are asking, which is a subtle but important distinction — a policy document is organized to be internally consistent and complete, while a FAQ needs to be organized around what a confused employee is actually trying to figure out in the moment, and those two organizing principles produce genuinely different documents even when covering identical content. Explicitly requiring each recurring question to be answered as the specific scenario rather than the general principle it falls under directly targets why FAQs get skipped: an employee wondering whether they can work from a different state for a month doesn't want the general remote-work philosophy restated, they want a yes/no/conditional answer to their exact situation, and a model given only "write an FAQ about this policy" will default to organizing by policy topic rather than by literal question, since that's the more natural document structure without an explicit override. The instruction against inventing confident answers for edge cases the policy doesn't cover is the most operationally important guardrail here, because a model is generally happy to extrapolate a plausible-sounding answer from policy principles when asked a specific edge-case question, and a plausible-sounding wrong answer in a company FAQ can become a de facto policy precedent once an employee acts on it and points back to the document — explicitly requiring an honest "not covered, escalate here" for genuine gaps prevents the FAQ from accidentally making policy it was never authorized to make. Ordering by actual ticket frequency rather than the policy's internal structure matters practically because a long FAQ that requires scrolling past ten low-frequency questions to reach the one generating 80% of tickets fails at its core job regardless of how well each individual answer is written, since most readers won't get that far.`,
    exampleOutput: `Q: Can I work from a different city or state for a few weeks? A: Not under the standard policy — the 3-day in-office requirement assumes you're local enough to be in the office Tuesday-Thursday; a multi-week remote stint needs manager approval as a specific exception, not the standard day-swap process. Edge case: an employee needing 6 weeks fully remote for a medical accommodation isn't addressed by the standard exception process, which is built for one-off days — this needs to go through your manager and then People Ops directly, not the standard exception form. Note: the day-swap question and the holiday question both suggest the policy's exception process itself is ambiguous about anything longer than a single day, which may be worth clarifying at the policy level rather than continuing to explain case by case.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
