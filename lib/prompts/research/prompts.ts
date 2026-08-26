import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'research-plan-scope-lock-before-deep-research',
    category: 'research',
    title: `Lock a research plan's scope before Deep Research burns its run on the wrong question`,
    description: `Forces a decision-first research plan — the exact question, what would change your mind, and what's explicitly out of scope — before you spend a Deep Research run chasing a question nobody actually needs answered.`,
    promptText: `You are helping me write a research plan for a decision I actually have to make, not a general topic to explore. Before this plan goes into a Deep Research run, it needs to be scoped tightly enough that the run doesn't wander into interesting-but-irrelevant territory.

DECISION THIS RESEARCH FEEDS
{{decision_at_stake}}

CURRENT BEST GUESS
{{current_belief}}

WHAT WOULD CHANGE MY MIND
{{disconfirming_evidence}}

OUT OF SCOPE
{{explicit_exclusions}}

DEADLINE AND DEPTH
{{time_budget}}

RULES
Start from the decision, not the topic — every section of the plan should trace back to how it would change what I do next. If a sub-question wouldn't change the decision either way, cut it, even if it's genuinely interesting. Write the current best guess as a real position, not a neutral placeholder, because a research plan built against "I don't know yet" produces a survey of the whole topic instead of a targeted check of one belief. State the disconfirming evidence as a concrete, checkable observation — the plan should include an explicit instruction to actively look for that observation, not just accumulate confirming detail. Take the exclusions seriously: name adjacent topics people commonly conflate with this one and mark them as out of scope so the eventual research run doesn't drift into them just because they're nearby. Size the plan to the time budget — a two-hour research pass and a two-week one should produce structurally different plans, not the same outline with more or fewer bullets.

WHAT NOT TO DO
Do not produce a generic research outline (background, analysis, findings, conclusion) — that shape belongs to a report, not a plan for gathering evidence. Do not hedge the current best guess into vagueness to sound neutral.

OUTPUT FORMAT
1. The single decision this research must inform, restated in one sentence.
2. 3-5 sub-questions, each tagged with which way an answer would push the decision.
3. The specific disconfirming check to run.
4. Explicit exclusions list.
5. A recommended source mix (primary data, expert commentary, competitor filings, etc.) sized to the time budget.`,
    variables: [
      {
        name: 'decision_at_stake',
        description: `The actual decision this research needs to inform.`,
        example: `Whether to add a self-serve annual plan alongside our existing monthly-only pricing before Q1.`,
        required: true,
      },
      {
        name: 'current_belief',
        description: `Your working hypothesis before doing the research, stated as a real position.`,
        example: `I think annual pricing would raise ARPU but I'm worried it would tank our trial-to-paid conversion rate.`,
        required: true,
      },
      {
        name: 'disconfirming_evidence',
        description: `The specific thing that, if found, would change your mind.`,
        example: `If two or more comparable SaaS tools our size saw conversion drop more than 15% after adding an annual-only upsell path.`,
        required: true,
      },
      {
        name: 'explicit_exclusions',
        description: `Adjacent topics to deliberately keep out of the plan.`,
        example: `Not researching enterprise contract pricing or multi-year deals — this is only about the self-serve tier.`,
        required: true,
      },
      {
        name: 'time_budget',
        description: `How much time and depth this research pass should target.`,
        example: `One afternoon, roughly 90 minutes of active research, not a multi-week study.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `research-plan`,
      `decision-making`,
      `deep-research`,
      `scoping`,
      `prompt-engineering`,
    ],
    whyItWorks: `A research plan that starts from a topic rather than a decision tends to produce a symmetrical, balanced-sounding outline because there's no asymmetry in the prompt to break the tie — every sub-question looks equally worth including, which is exactly how Deep Research-style tools end up spending their run breadth-first across ten shallow angles instead of depth-first on the one or two that matter. Anchoring the plan to a specific decision and a stated current belief gives the model something to be wrong against: sub-questions get filtered by whether an answer would actually change what happens next, which is a checkable test rather than a vibe. The disconfirming-evidence field matters mechanically because absent an explicit instruction to look for the falsifying case, a model doing broad research over many sources tends toward confirmation by default — most retrievable content about any given belief skews toward supporting evidence simply because that's what gets published and indexed, so the plan has to name the specific shape of contrary evidence to actively hunt for rather than passively wait to encounter it. The explicit exclusions list closes a related gap: without a stated boundary, a sufficiently capable research pass will treat "related and interesting" as license to include, and every included tangent competes for the same limited research budget as the questions that actually matter to the decision.`,
    exampleOutput: `Decision: whether to launch a self-serve annual plan by Q1. Sub-questions: (1) Do comparable SaaS tools see conversion drops after adding annual-only upsells? [would push against launching] (2) What ARPU lift have similar companies reported? [would push toward launching]... Disconfirming check: actively search for post-mortems or forum threads describing conversion drops above 15%, not just case studies celebrating ARPU wins. Excluded: enterprise multi-year contracts.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-deep-research-brief-source-tiering',
    category: 'research',
    title: `Write a Deep Research brief that tells ChatGPT which sources outrank which before it starts pulling`,
    description: `Produces a Deep Research brief with an explicit source-priority order and named low-trust categories, so a long autonomous run doesn't quietly treat a vendor blog post and an independent benchmark as equally authoritative.`,
    promptText: `Write a Deep Research brief for a multi-step autonomous research run. The brief needs to do more than state the topic — it needs to tell the research process which kinds of sources to trust more than others, because a long autonomous pass will pull from dozens of sources and has no way to know my priorities unless I state them upfront.

RESEARCH TOPIC
{{research_topic}}

TRUSTED SOURCE TYPES, IN ORDER
{{source_priority_order}}

LOW-TRUST OR SELF-INTERESTED SOURCES TO FLAG
{{low_trust_sources}}

RECENCY REQUIREMENT
{{recency_window}}

CONTRADICTION HANDLING
When sources disagree, do not average their claims into a middle-ground summary — that produces a number or conclusion no actual source supports. Instead, state each source's position separately, note which is higher-priority per my ordering, and flag the disagreement explicitly rather than resolving it silently. Any claim sourced only from a vendor's own marketing material or a paid placement must be labeled as such in-line, not folded into the narrative as if it were independent.

RECENCY RULE
Apply {{recency_window}} strictly — a source published before that window should only be cited if no more recent source covers the same claim, and that fact should be stated.

OUTPUT FORMAT
Produce the final brief as: (1) the research question restated in one line, (2) the source priority order as a numbered list, (3) explicitly named low-trust categories, (4) the recency cutoff, (5) one line instructing the research process to log which tier each major claim in its final report came from.`,
    variables: [
      {
        name: 'research_topic',
        description: `The specific question this Deep Research run needs to answer.`,
        example: `How reliable is on-device AI transcription accuracy for accented English speech compared to cloud-based transcription in 2026?`,
        required: true,
      },
      {
        name: 'source_priority_order',
        description: `The kinds of sources you trust most, ranked.`,
        example: `1) Independent benchmark studies with published methodology, 2) academic papers, 3) engineering blog posts from the model vendors themselves, 4) tech journalism.`,
        required: true,
      },
      {
        name: 'low_trust_sources',
        description: `Source categories to flag as potentially self-interested or unreliable.`,
        example: `Vendor press releases, affiliate-linked "best AI transcription tools" roundup articles, and any source that doesn't disclose its test methodology.`,
        required: true,
      },
      {
        name: 'recency_window',
        description: `How recent a source needs to be to count as current evidence.`,
        example: `Published within the last 12 months — this space moves fast enough that older benchmarks are close to meaningless.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1 Deep Research)`],
    tags: [
      `deep-research`,
      `source-evaluation`,
      `research-brief`,
      `fact-checking`,
      `prompt-engineering`,
    ],
    whyItWorks: `Deep Research-style tools operate by issuing many search queries and synthesizing across whatever surfaces, and without an explicit priority ordering the synthesis step treats every retrieved passage as roughly interchangeable evidence — a benchmark with a disclosed methodology and a vendor's own marketing copy both just become "a source that says X," and the summarization step has a structural tendency to average disagreeing numbers into a plausible-sounding midpoint that no individual source actually reported, because a middle value reads as the most defensible synthesis even though it's evidence-free. Naming the low-trust categories upfront gives the model a concrete pattern to check retrieved content against — "is this a vendor's own claim about its own product" is a checkable question the model can apply source-by-source, whereas "be skeptical of biased sources" with no examples leaves the judgment call underspecified and inconsistently applied across the dozens of sources a long run touches. The recency window matters because search-based retrieval doesn't rank by publish date unless told to, so an older, more heavily-cited source can outrank a newer, more accurate one simply because it has more inbound links and mentions; stating the cutoff explicitly forces the model to check dates rather than default to citation volume as its proxy for authority. Requiring a per-claim source tier in the final output creates an audit trail that lets you catch it if the process quietly violated its own priority order somewhere in a long run.`,
    exampleOutput: `Research question: How does on-device transcription accuracy for accented English compare to cloud transcription in 2026? Findings — Tier 1 (independent benchmark, published methodology): a 2026 university study found on-device models trailed cloud by 4-7 WER points on non-native accents. Tier 3 (vendor blog, flagged as self-interested): Vendor X's own post claims near-parity, but discloses no test set. Disagreement noted: the two claims conflict; the independent benchmark is weighted higher per the stated priority order.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1 Deep Research.`,
      },
    ],
  },
  {
    slug: 'research-literature-review-disagreement-matrix',
    category: 'research',
    title: `Turn a pile of papers into a literature review that shows where the studies actually disagree`,
    description: `Builds a literature review organized around points of disagreement between studies rather than a paper-by-paper summary, so contradictions surface instead of getting smoothed into one comfortable narrative.`,
    promptText: `I'm giving you a set of papers or paper summaries on the same general topic. Write a literature review that is organized around where these studies agree and, more importantly, where they disagree — not a list that summarizes each paper in turn.

TOPIC AND REVIEW PURPOSE
{{review_topic}}

PAPERS OR SOURCES
{{source_list}}

KNOWN METHODOLOGICAL DIFFERENCES
{{methodology_variance}}

REVIEW SCOPE BOUNDARY
{{scope_boundary}}

STRUCTURE
For each major claim relevant to the topic, group the sources that address it and state explicitly whether they converge or conflict. Where they conflict, do not resolve the conflict yourself by picking a side — instead, identify whether the disagreement traces to a methodological difference (different sample, different measure, different time period) named in {{methodology_variance}}, or whether it looks like a genuine unresolved contradiction in the field. Order the review by claim, not by paper — a paper that touches three separate claims should appear in three different sections, not get one summary paragraph that flattens all three findings together.

WHAT NOT TO DO
Do not write a review that reads as a string of "Smith et al. found X. Jones et al. found Y." sentences with no synthesis between them — that's an annotated bibliography, not a review. Do not manufacture consensus language ("the literature broadly agrees") when what you actually have is two or three papers that happen not to contradict each other yet.

OUTPUT FORMAT
1. A short framing paragraph stating the review's scope.
2. One section per major claim, each ending with an explicit convergence/conflict verdict and, if conflicting, the likely methodological cause.
3. A closing paragraph naming the single biggest open contradiction the field hasn't resolved.
4. A note on any source that fell outside {{scope_boundary}} and was excluded, and why.`,
    variables: [
      {
        name: 'review_topic',
        description: `The specific topic and what the review needs to establish.`,
        example: `Whether standing desks measurably reduce lower-back pain in office workers, for an internal wellness-benefit recommendation.`,
        required: true,
      },
      {
        name: 'source_list',
        description: `The papers, abstracts, or summaries being reviewed.`,
        example: `Six studies pasted in as abstracts, ranging from a 2015 RCT with 40 participants to a 2024 meta-analysis of 12 studies.`,
        required: true,
      },
      {
        name: 'methodology_variance',
        description: `Known differences in how the studies were run, to check disagreements against.`,
        example: `The older studies self-reported pain on a 1-10 scale weekly; the newer meta-analysis used a validated clinical instrument administered monthly.`,
        required: false,
      },
      {
        name: 'scope_boundary',
        description: `What counts as in-scope for this review versus adjacent research to exclude.`,
        example: `Only office-worker populations — exclude studies on manufacturing or industrial standing workstations.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `literature-review`,
      `academic-research`,
      `synthesis`,
      `evidence-evaluation`,
      `research-writing`,
    ],
    whyItWorks: `Asked to summarize a set of papers with no other instruction, a model's default organizing principle is the input order — one paragraph per paper, in the sequence they were pasted — because that requires no synthesis judgment and is the safest way to guarantee every source gets mentioned; the result reads complete but never actually compares anything. Restructuring the task around claims rather than papers forces a different kind of pass over the material: the model has to first extract what each paper actually found, then re-group by finding rather than by source, which is the step that surfaces disagreement, because two papers addressing the identical claim sit next to each other instead of three sections apart. Explicitly forbidding invented consensus language matters because language models have a documented tendency toward hedge-free, harmonizing phrasing when synthesizing multiple sources — "the literature suggests" is a smoother sentence to generate than "these two sources disagree and neither is obviously more reliable," so without an explicit instruction against it, real disagreement gets written over with false unity. Tying each conflict back to named methodological differences gives the model a legitimate way to explain disagreement without picking a winner — it's the difference between "these studies contradict each other" (an unhelpful dead end) and "these studies used different pain-measurement instruments and different sample sizes, which plausibly explains the gap" (an actual analytical finding a reader can act on).`,
    exampleOutput: `Claim: standing desks reduce self-reported lower-back pain. Four of six sources report a modest reduction; two report no significant effect. The two null-result studies both used the validated clinical instrument rather than self-reported weekly scores, suggesting the positive results may partly reflect a less sensitive measurement approach rather than a true larger effect. Verdict: conflicting, likely methodology-driven rather than a genuine contradiction in the underlying effect.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-paper-summary-limitations-preserved',
    category: 'research',
    title: `Summarize a paper without quietly smoothing over the limitations it reported on itself`,
    description: `Produces a paper summary that keeps the authors' own stated caveats and sample limitations intact, rather than compressing a hedged finding into a confident one-line takeaway.`,
    promptText: `Summarize the paper below for someone who needs to decide whether to act on its finding, not just know what it says in the abstract.

PAPER OR ABSTRACT TEXT
{{paper_text}}

WHO THIS SUMMARY IS FOR
{{reader_context}}

DECISION THIS MIGHT INFORM
{{intended_use}}

RULES
Preserve the authors' own stated limitations, sample size, and scope caveats in the summary itself — do not compress "in a sample of 24 undergraduate participants, we observed a moderate effect" into "the study found that X works," because the second version is a stronger claim than the paper actually supports and would mislead {{reader_context}} about how much weight to put on it. If the paper's own discussion or limitations section flags a specific weakness (small sample, non-representative population, correlational rather than causal design, funding source), name that weakness in the summary rather than only in a separate "limitations" footnote most readers skip. Distinguish clearly between what the paper found and what the paper's authors speculate about in their discussion section — speculation dressed as a finding is a common way summaries overstate a paper's actual evidence.

WHAT NOT TO DO
Do not add a confidence level or practical recommendation the paper itself doesn't support, even if {{intended_use}} would benefit from a clean answer — say plainly if the paper is too limited in scope to actually inform that decision.

OUTPUT FORMAT
1. One-sentence plain-language statement of what was studied and found.
2. The specific finding, with sample size and study design named.
3. The authors' own stated limitations, verbatim or closely paraphrased.
4. A one-line verdict on whether this paper alone is strong enough evidence to act on {{intended_use}}, or whether it's one data point among several needed.`,
    variables: [
      {
        name: 'paper_text',
        description: `The paper text, abstract, or key sections being summarized.`,
        example: `A pasted abstract and discussion section from a study on remote-work productivity self-reports across 24 tech company employees.`,
        required: true,
      },
      {
        name: 'reader_context',
        description: `Who will read this summary and what they already know.`,
        example: `A non-technical VP of People who doesn't read primary research regularly and will likely act on the headline takeaway.`,
        required: true,
      },
      {
        name: 'intended_use',
        description: `The decision or claim this summary might be used to support.`,
        example: `Whether to cite this study in a company-wide memo justifying a permanent remote-work policy.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `paper-summary`,
      `academic-research`,
      `evidence-evaluation`,
      `critical-reading`,
      `research-writing`,
    ],
    whyItWorks: `Summarization inherently compresses, and the easiest compression a model can produce is one that drops qualifiers — "a moderate effect was observed in a small non-representative sample" loses its hedges far more readily than it loses its subject and verb, because hedges are exactly the words a shorter sentence sacrifices first. That default produces summaries that are technically about the right topic but overstate the paper's actual evidentiary weight, which matters enormously when the summary's reader — often someone who will never open the original paper — treats the compressed version as the full claim. Explicitly instructing the model to preserve sample size, design, and the authors' own limitations forces those details to survive the compression pass rather than being the first casualties of it. The instruction to separate finding from discussion-section speculation addresses a specific structural feature of academic papers: authors routinely speculate more broadly in the discussion than their actual data supports, because that's where a paper is allowed to gesture at implications, and a summary that draws from the discussion section as if it were the results section imports that broader, less-supported claim without flagging that it's speculation rather than evidence. Naming the intended use and asking for an explicit verdict on whether the paper alone can support it prevents the summary from silently doing the reader's decision-making for them by implication — it forces the gap between what was found and what someone wants to do with it into the open instead of leaving it to be assumed.`,
    exampleOutput: `What was studied: self-reported productivity among 24 remote tech employees over 8 weeks. Finding: participants reported feeling moderately more productive, but the study used self-report only, no objective output measure, and the sample was small and drawn from a single company. Authors' own caveat: they explicitly note the finding may not generalize beyond tech-sector knowledge work. Verdict: too limited alone to anchor a company-wide policy memo — useful as one supporting data point, not a standalone justification.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-question-falsifiability-tightening',
    category: 'research',
    title: `Turn a vague research question into one a study could actually prove wrong`,
    description: `Rewrites a broad, unanswerable research question into a specific, falsifiable version with a stated measurement and a defined population, so the resulting research effort has a real finish line.`,
    promptText: `Here is a research question I want to investigate. Help me tighten it into something falsifiable — a version where a specific finding could actually prove it wrong, not just something interesting to explore indefinitely.

ORIGINAL QUESTION
{{original_question}}

WHY I CARE ABOUT THIS
{{underlying_motivation}}

WHO OR WHAT THIS APPLIES TO
{{target_population}}

WHAT I ALREADY SUSPECT
{{prior_expectation}}

Diagnose what makes the original question unfalsifiable or too broad as stated — usually it's an undefined population ("do people" — which people?), an undefined outcome measure ("does it help" — help by what measure, over what timeframe?), or a comparison with no baseline ("is X better" — better than what?). Name the specific gap in {{original_question}} before rewriting it. Then produce a tightened version that specifies the population from {{target_population}}, names a concrete, measurable outcome, and states an explicit comparison or baseline. The tightened question should be falsifiable in the sense that you could describe, right now, a specific result that would count as a "no."

WHAT NOT TO DO
Do not just rephrase the original question in fancier language while leaving the same ambiguity intact. Do not narrow the question so far that it stops addressing {{underlying_motivation}} at all — the tightened version has to still answer the real thing you care about.

OUTPUT FORMAT
1. The specific ambiguity or unfalsifiable element in the original question.
2. The tightened, falsifiable research question.
3. One sentence describing what a "no" result would look like.
4. If the tightening narrowed the scope meaningfully from {{underlying_motivation}}, one line flagging that trade-off explicitly.`,
    variables: [
      {
        name: 'original_question',
        description: `The broad or vague question you started with.`,
        example: `Does gamification improve employee training outcomes?`,
        required: true,
      },
      {
        name: 'underlying_motivation',
        description: `The real reason you want this answered.`,
        example: `We're deciding whether to spend budget adding badges and leaderboards to our compliance training platform.`,
        required: true,
      },
      {
        name: 'target_population',
        description: `Who or what the finding needs to apply to.`,
        example: `Adult employees completing mandatory annual compliance training, not students or gamers in general.`,
        required: true,
      },
      {
        name: 'prior_expectation',
        description: `What you currently suspect the answer might be.`,
        example: `I suspect it might boost completion rates but not actual retention of the material.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `research-question`,
      `hypothesis-design`,
      `study-design`,
      `research-methodology`,
      `prompt-engineering`,
    ],
    whyItWorks: `A question like "does gamification improve training outcomes" has no single answer because "outcomes" and "improve" are undefined variables the model has to silently pick a value for in order to respond at all — left unspecified, it will typically answer about the most commonly-discussed version of the topic in its training data, which may not be the version relevant to the actual decision at hand. Asking the model to first diagnose the specific ambiguity, rather than jumping straight to a rewrite, forces it to name what's actually missing (population, outcome measure, or baseline) instead of pattern-matching to a generically "better-sounding" version of the same underspecified question. Requiring the tightened question to support a describable "no" result is the practical test for falsifiability: a question phrased so broadly that literally any finding could be spun as a confirming answer isn't actually researchable, it's just a topic, and stating the shape of a negative result upfront is the cheapest way to check whether the rewrite actually fixed that. The trade-off flag at the end matters because tightening a question for falsifiability and preserving the original motivation are in some tension — a maximally falsifiable question is often narrower than the thing someone actually cares about — and surfacing that trade-off explicitly means the person asking gets to decide whether the narrower, answerable version still serves their real purpose, rather than discovering the gap only after the research is done.`,
    exampleOutput: `Ambiguity: "improve training outcomes" doesn't specify whether that means completion rate, quiz score, or long-term retention. Tightened question: Among adult employees completing mandatory annual compliance training, does adding badges and a leaderboard increase 30-day post-training quiz retention scores compared to the same training without gamification? A "no" result: retention scores show no statistically meaningful difference between the gamified and non-gamified groups.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-hypothesis-testable-prediction-builder',
    category: 'research',
    title: `Convert a hunch into a hypothesis with a prediction specific enough to be wrong`,
    description: `Turns an informal belief about cause and effect into a testable hypothesis with a stated direction, a named confounder to rule out, and a concrete prediction — so it's clear in advance what evidence would count against it.`,
    promptText: `I have a hunch, not yet a real hypothesis. Help me turn it into one that's actually testable.

THE HUNCH
{{informal_belief}}

WHAT I THINK CAUSES WHAT
{{proposed_mechanism}}

OBVIOUS ALTERNATIVE EXPLANATION
{{competing_explanation}}

WHAT DATA I COULD ACTUALLY GET
{{available_data}}

Restate the hunch as a formal hypothesis with a clear independent and dependent variable and a stated direction (increases, decreases, has no effect) — not just "X is related to Y," which is true of almost everything given enough data and predicts nothing specific. Then name the single most obvious alternative explanation for why the pattern might appear even if my proposed mechanism is wrong — using {{competing_explanation}} as a starting point but sharpening it if there's a more obvious confound I'm missing — and state what evidence would distinguish my mechanism from that alternative rather than being consistent with both. Check the hypothesis against {{available_data}}: if the data I can actually get couldn't distinguish between my hypothesis and the alternative explanation, say so plainly rather than producing a hypothesis I have no way to actually test.

WHAT NOT TO DO
Do not produce a hypothesis so hedged ("X may be associated with Y under some conditions") that no realistic result could ever contradict it. Do not skip past the alternative explanation just because the hunch feels intuitively right to me — the alternative is the whole point of this exercise.

OUTPUT FORMAT
1. The formal hypothesis, with variables and direction stated plainly.
2. The single strongest alternative explanation, and what result would rule it in versus out.
3. A one-line prediction: what specific result would you expect to see if the hypothesis is true.
4. A verdict on whether {{available_data}} is actually sufficient to test this, and if not, what data would be needed instead.`,
    variables: [
      {
        name: 'informal_belief',
        description: `The hunch in your own words, before formalizing it.`,
        example: `I think our support ticket volume spikes on Mondays because of the weekend content backlog, not because of anything about Mondays themselves.`,
        required: true,
      },
      {
        name: 'proposed_mechanism',
        description: `Your theory for why the pattern happens.`,
        example: `Users hit issues over the weekend when support is slower to respond, and file tickets once they're back at their desks Monday.`,
        required: true,
      },
      {
        name: 'competing_explanation',
        description: `An alternative reason the same pattern could show up.`,
        example: `Maybe it's simply that more people are actively using the product on Mondays overall, so ticket volume scales with usage, not with a weekend backlog.`,
        required: true,
      },
      {
        name: 'available_data',
        description: `What data you can realistically pull to test this.`,
        example: `Ticket timestamps and categories for the last 6 months, plus daily active user counts for the same period.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `hypothesis`,
      `research-methodology`,
      `study-design`,
      `causal-reasoning`,
      `data-analysis`,
    ],
    whyItWorks: `An informal hunch like "X is related to Y" is compatible with almost any observed pattern, which is precisely why it isn't useful as a research hypothesis — a claim that can't be wrong under any realistic outcome hasn't actually staked out a position, it's described a topic. Forcing a stated direction and named variables converts a vague intuition into something a specific dataset could actually contradict, which is the property that makes it worth testing at all rather than just discussing. The alternative-explanation step matters because a model asked directly "is my hunch right" will tend to validate the framing it was given, since the informal belief supplies most of the context for what a "good answer" looks like — explicitly requiring a competing explanation and a way to distinguish it forces a genuine adversarial check rather than an agreeable elaboration of the user's own idea. The final data-sufficiency check closes the most common practical failure in DIY hypothesis testing: someone forms a hypothesis and a plausible alternative, but the data they actually have access to (in this example, ticket timestamps without a way to separate weekend-origin tickets from Monday-origin ones) can't actually tell the two apart, so the whole exercise would produce a result that looks like confirmation regardless of which explanation is true. Surfacing that gap before analysis starts, rather than after producing an unfalsifiable-in-practice conclusion, is the difference between a hypothesis that's testable in principle and one that's testable with the data actually on hand.`,
    exampleOutput: `Hypothesis: Weekend-originated user issues increase Monday ticket volume, independent of overall Monday usage levels. Alternative: ticket volume simply scales with daily active users, which may also be higher Monday. Distinguishing evidence: if ticket volume normalized per active user is still higher on Mondays, the backlog theory holds; if it's flat once normalized, usage volume alone explains it. Data check: available data (timestamps + DAU) is sufficient to run this normalization — no additional data needed.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-evidence-table-source-reliability-grading',
    category: 'research',
    title: `Build an evidence table that grades each source's reliability instead of just listing it`,
    description: `Produces a structured evidence table with a reliability grade and stated basis for that grade per source, so a reader can weigh conflicting claims instead of treating every row as equally trustworthy.`,
    promptText: `Build an evidence table from the sources below. Every row needs a reliability grade with a stated reason — not just the claim itself — because a table that lists ten sources with no weighting implies they're all equally trustworthy, which is rarely true.

CLAIM OR QUESTION BEING EVALUATED
{{claim_under_review}}

SOURCES
{{source_list}}

GRADING CRITERIA I CARE ABOUT
{{grading_criteria}}

For each source, extract: the specific claim it makes relevant to {{claim_under_review}}, the type of source it is (peer-reviewed study, industry report, vendor material, journalism, forum/anecdote), and a reliability grade (High / Medium / Low) based on {{grading_criteria}}. State the one-sentence reason for each grade — sample size, disclosed methodology, conflict of interest, recency, or lack of any of those. Where two sources give conflicting claims, note the conflict directly in an adjacent row or a flagged note rather than letting it pass silently. Sort or group the table so the highest-reliability sources are easy to find rather than randomly interspersed with low-reliability ones.

WHAT NOT TO DO
Do not grade every source as "Medium" as a way of avoiding a real judgment call — if the grading criteria genuinely can't distinguish two sources, say so explicitly rather than defaulting to the middle grade as a non-answer.

OUTPUT FORMAT
A table with columns: Source | Claim | Source Type | Reliability Grade | Basis for Grade. Follow the table with a two-sentence summary of what the highest-reliability sources actually support, separate from what the full source list as a whole seems to suggest.`,
    variables: [
      {
        name: 'claim_under_review',
        description: `The specific claim or question the evidence table is evaluating.`,
        example: `Whether a four-day work week measurably reduces employee burnout without reducing output.`,
        required: true,
      },
      {
        name: 'source_list',
        description: `The sources to include, pasted in or summarized.`,
        example: `A 2023 UK pilot study report, three company blog posts describing their own four-day-week experiments, and two news articles covering the pilot.`,
        required: true,
      },
      {
        name: 'grading_criteria',
        description: `What you personally weight most when judging source reliability.`,
        example: `Sample size and whether the source has a financial incentive to report a positive result matter more to me than how recent it is.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `evidence-table`,
      `source-evaluation`,
      `fact-checking`,
      `research-methodology`,
      `decision-support`,
    ],
    whyItWorks: `An evidence table with no grading column implicitly treats every row as equally weighted evidence, and readers tend to take a table's structure at face value — ten rows of claims reads as ten independent confirmations, even if seven of them trace back to the same underlying press release or the same company's own marketing. Requiring an explicit reliability grade with a stated basis forces the model to actually interrogate each source's provenance rather than just extracting its headline claim, which is the step that catches a vendor blog post dressed up as independent evidence or a small pilot study being cited with the same confidence as a large peer-reviewed one. Explicitly forbidding a default-to-Medium pattern matters because "Medium" is the safest grade to assign when a model wants to avoid committing to a judgment — it sounds appropriately cautious without actually being useful, and a table where most rows land on Medium has quietly abdicated the one job the table exists to do. Separating the summary of what the highest-reliability sources support from what the full source list suggests as a whole directly addresses the averaging failure mode: if three low-quality sources and one high-quality source disagree, a naive synthesis leans toward the majority view by source count, when the correct read is usually to weight the single well-evidenced source more heavily than three weaker ones saying the opposite.`,
    exampleOutput: `Source: 2023 UK four-day-week pilot report | Claim: burnout scores dropped, output held steady | Type: independent pilot study | Grade: High | Basis: large multi-company sample, pre-registered methodology, no financial stake in outcome. Source: Company X blog post | Claim: "huge productivity gains" | Type: vendor/company self-report | Grade: Low | Basis: single company, no control group, incentive to report success publicly.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-competitor-research-capability-not-copy',
    category: 'research',
    title: `Research competitors around what they can actually do, not what their marketing copy claims`,
    description: `Builds a competitor research brief that separates verifiable product capability from marketing language, and flags claims that couldn't be confirmed rather than repeating them as fact.`,
    promptText: `I need competitor research that's useful for a real product decision, which means it can't just repeat what each competitor's website says about itself. Marketing copy describes what a company wants you to believe, not necessarily what the product does.

MY PRODUCT AND THE DECISION THIS INFORMS
{{our_context}}

COMPETITORS TO RESEARCH
{{competitor_list}}

SPECIFIC CAPABILITIES I NEED VERIFIED
{{capabilities_to_check}}

WHERE TO LOOK BEYOND THEIR OWN SITE
{{independent_source_hint}}

For each competitor, separate two things clearly: what they claim on their own marketing pages, and what can be independently verified through {{independent_source_hint}} — review sites, changelog/release notes, documentation, user forums, or third-party comparisons. Where a marketing claim can't be verified independently, say so explicitly rather than repeating it as if it were a confirmed fact; a lot of competitor research fails exactly here by transcribing homepage copy as if it were neutral information. For each capability in {{capabilities_to_check}}, give a direct verdict: confirmed working (with source), claimed but unverified, or confirmed absent/limited. Flag anything that looks like a common SaaS overstatement pattern — "AI-powered" with no specifics, "enterprise-grade" with no named certification, "99.9% uptime" with no public status page to check it against.

WHAT NOT TO DO
Do not present the research as a feature-comparison table with checkmarks pulled straight from each competitor's own pricing page — that's just relaying their sales pitch, not researching them.

OUTPUT FORMAT
Per competitor: 1) one-line summary of their actual positioning, 2) a table of the requested capabilities with a confirmed/claimed/absent verdict and source for each, 3) the single most overstated marketing claim you found on their site, named specifically.`,
    variables: [
      {
        name: 'our_context',
        description: `Your product and what decision this competitor research feeds.`,
        example: `We're a mid-market project management tool deciding whether to build native time tracking or keep recommending an integration partner.`,
        required: true,
      },
      {
        name: 'competitor_list',
        description: `The specific competitors to research.`,
        example: `Asana, Monday.com, and ClickUp.`,
        required: true,
      },
      {
        name: 'capabilities_to_check',
        description: `The exact capabilities you need verified, not a general overview.`,
        example: `Native time tracking, whether it supports billable-vs-non-billable hour tagging, and whether it exports to QuickBooks without a third-party connector.`,
        required: true,
      },
      {
        name: 'independent_source_hint',
        description: `Where to look for verification beyond the competitor's own site.`,
        example: `G2 and Capterra reviews, their public changelog pages, and their help-center documentation rather than their marketing pages.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`, `Perplexity`],
    tags: [
      `competitor-research`,
      `market-research`,
      `product-strategy`,
      `fact-checking`,
      `research-methodology`,
    ],
    whyItWorks: `A model asked to research a competitor will, absent other instruction, gravitate toward that competitor's own homepage and pricing page as the primary source, simply because that content is written to be the clearest, most quotable summary of the product and is usually the most heavily indexed page about it — which means the research ends up repeating the subject's own sales pitch back as if it were neutral fact. Explicitly separating "what they claim" from "what's independently verifiable" forces a second retrieval pass against a different kind of source, and naming specific independent source types (review sites, changelogs, documentation) gives the model concrete places to check a claim against rather than leaving "verify" as an abstract instruction it has no obvious way to act on. Requiring a three-way verdict per capability — confirmed, claimed-but-unverified, or absent — matters because it removes the middle-ground option of just describing the feature neutrally without committing to whether it's real; a plain description reads as tacit endorsement even when the model never actually confirmed the claim. Asking specifically for the single most overstated marketing claim trains attention on the genre of vague SaaS superlative language ("AI-powered," "enterprise-grade") that's specifically designed to sound substantive while being unfalsifiable, which is exactly the kind of claim that would otherwise slip through a feature-comparison table unchallenged because it isn't a concrete enough statement to obviously flag as false.`,
    exampleOutput: `Competitor: Monday.com. Positioning: broad work-OS platform targeting cross-functional teams. Native time tracking: confirmed present (documented in their help center), but billable/non-billable tagging requires a paid add-on per their own docs — claimed as "built-in" on the marketing page, actually gated behind a higher tier. Most overstated claim: "AI-powered resource management" with no specifics on what the AI actually does differently from rule-based automation.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-market-research-tam-assumption-audit',
    category: 'research',
    title: `Size a market without letting ChatGPT quietly invent the number in the middle of the math`,
    description: `Builds a market-sizing analysis where every multiplier and assumption is stated and sourced separately, so a confident-looking TAM figure doesn't hide an invented number two steps upstream.`,
    promptText: `Help me size this market, but every number in the final figure has to trace back to either a cited source or an explicitly labeled assumption — no unlabeled numbers just appearing in the middle of the math.

MARKET TO SIZE
{{market_definition}}

NUMBERS I ALREADY HAVE
{{known_data_points}}

GAPS I EXPECT YOU'LL HAVE TO ESTIMATE
{{likely_assumption_gaps}}

APPROACH PREFERENCE
{{sizing_approach}}

Build the sizing using {{sizing_approach}} (top-down from a broader known market, or bottom-up from unit economics — whichever I specified). At every step, label each number as either "sourced" (with the source named) or "assumed" (with the reasoning for the assumed value stated plainly, not just the number). If you have to estimate something not covered in {{known_data_points}} or {{likely_assumption_gaps}}, flag it explicitly as a new assumption rather than quietly inserting a plausible-sounding figure. Where an assumption meaningfully drives the final number, note how sensitive the final TAM is to that one assumption — if changing it by half would roughly halve or double the output, that needs to be visible, not buried in a single pass-through calculation.

WHAT NOT TO DO
Do not present a single polished TAM figure with the underlying assumptions relegated to a footnote no one will read — the assumptions are the most important part of this output, not an afterthought. Do not round or smooth an estimate to make it look more precise than the underlying data supports.

OUTPUT FORMAT
1. The sizing calculation, step by step, each line labeled sourced or assumed.
2. A final TAM range (not a single false-precision number) with the low and high bound explained by which assumptions drove each end.
3. The single assumption the final number is most sensitive to.`,
    variables: [
      {
        name: 'market_definition',
        description: `The specific market being sized, defined narrowly enough to be meaningful.`,
        example: `The addressable market for a B2B SaaS tool that automates expense report categorization for companies with 50-500 employees in the US.`,
        required: true,
      },
      {
        name: 'known_data_points',
        description: `Any real numbers you already have and can cite.`,
        example: `US Census data shows roughly 45,000 companies in the 50-500 employee range; our current customer data shows average contract value of $8,400/year.`,
        required: true,
      },
      {
        name: 'likely_assumption_gaps',
        description: `Where you expect estimation will be needed because no clean data exists.`,
        example: `No public data on what percentage of those companies currently use any automated expense tool versus manual processes.`,
        required: false,
      },
      {
        name: 'sizing_approach',
        description: `Whether to size top-down from a broader market or bottom-up from unit economics.`,
        example: `Bottom-up, starting from the number of eligible companies and our known average contract value.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `market-research`,
      `market-sizing`,
      `tam-analysis`,
      `business-research`,
      `data-analysis`,
    ],
    whyItWorks: `Market-sizing exercises are especially prone to a specific failure mode where a model chains several multiplications together and, when it hits a step with no clean data, fills the gap with a plausible round number — a "15% adoption rate" or "roughly 20% of companies" — that reads as confidently as the sourced figures around it, because the output format doesn't distinguish a cited statistic from a made-up placeholder once they're both just numbers in the same equation. Requiring every line to be explicitly labeled sourced or assumed breaks that camouflage: an assumed number sitting next to its stated reasoning invites scrutiny in a way the same number embedded silently in a multiplication chain never would. The sensitivity-flagging requirement matters because market sizing math compounds multiplicatively, so a single soft assumption near the start of the chain can swing the final TAM by multiples, and a single polished output number gives no signal about which input to actually go verify if the number needs to hold up under real scrutiny — asking specifically which assumption the output is most sensitive to turns a black-box calculation into something a reader can prioritize checking. Requiring a range rather than a single figure directly counters the false-precision problem: a bottom-up calculation built partly from assumptions cannot honestly produce a number precise to the dollar, and presenting one anyway implies a level of certainty the underlying inputs don't support.`,
    exampleOutput: `45,000 eligible companies [sourced: Census data] x $8,400 average contract value [sourced: internal data] x est. 30% realistic penetration ceiling within 5 years [assumed: comparable SaaS categories typically plateau between 20-40% penetration] = roughly $113M-$151M TAM range. Most sensitive assumption: the 30% penetration ceiling — at 20% the TAM drops to roughly $76M, at 40% it rises to roughly $151M.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-customer-research-outlier-preserving-synthesis',
    category: 'research',
    title: `Synthesize customer interviews into jobs-to-be-done findings without averaging away the outliers`,
    description: `Turns a batch of customer interview notes into a jobs-to-be-done synthesis that keeps a genuinely different customer segment visible instead of blending it into a single averaged persona.`,
    promptText: `I'm giving you raw notes or transcripts from customer interviews. Synthesize them into a jobs-to-be-done analysis — but do not collapse everyone into a single average customer if the notes actually show meaningfully different segments underneath.

INTERVIEW NOTES OR TRANSCRIPTS
{{interview_notes}}

PRODUCT OR DECISION THIS INFORMS
{{research_purpose}}

NUMBER OF INTERVIEWS AND ANY KNOWN SEGMENT SPLIT
{{sample_context}}

Before synthesizing, check whether the interviews actually describe one coherent job-to-be-done or multiple distinct ones — if two or more interviewees describe wanting the product for clearly different underlying reasons, do not merge those into one blended "customers want X" statement, because the blended version will describe no real customer accurately. Where a genuine minority pattern shows up (even from just one or two interviews) that contradicts or sits outside the majority pattern, name it as a distinct finding rather than treating it as noise to average out — a minority pattern in qualitative research this small a sample is often a real signal, not statistical noise, precisely because the sample is too small for anything to average out cleanly in the first place. For the majority pattern(s), state the job to be done in the classic structure: when [situation], I want to [motivation], so I can [expected outcome] — grounded in actual quotes or close paraphrases from the notes, not a generic restatement.

WHAT NOT TO DO
Do not present findings as percentages ("60% of customers said...") from a small qualitative sample — that language implies statistical rigor this kind of research doesn't have. Do not silently smooth a contradictory interview into agreement with the majority to make the write-up cleaner.

OUTPUT FORMAT
1. The primary job-to-be-done statement(s), with supporting quotes.
2. Any distinct minority pattern found, named explicitly as such, not folded into the majority.
3. One line on what {{research_purpose}} this most directly informs, and what it doesn't yet tell you.`,
    variables: [
      {
        name: 'interview_notes',
        description: `The raw interview notes, transcripts, or summaries to synthesize.`,
        example: `Notes from 8 customer interviews about why they signed up for a budgeting app, mostly focused on debt payoff but two mentioning saving for a specific goal instead.`,
        required: true,
      },
      {
        name: 'research_purpose',
        description: `The product decision or roadmap question this synthesis needs to inform.`,
        example: `Deciding whether our next feature investment should be a debt-payoff planner or a savings-goal tracker.`,
        required: true,
      },
      {
        name: 'sample_context',
        description: `How many interviews this is based on and any known segment information.`,
        example: `8 interviews total, all existing paying customers, no prior segmentation done.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `customer-research`,
      `jobs-to-be-done`,
      `qualitative-research`,
      `user-research`,
      `product-strategy`,
    ],
    whyItWorks: `Synthesizing qualitative interviews into a single narrative is a compression task, and the model's default compression strategy is to find the central tendency and state that as the finding — which works fine when the underlying interviews genuinely cluster around one job-to-be-done, but actively destroys information when they don't, because a blended "customers want debt payoff and also savings tracking" statement ends up describing neither group's actual motivation precisely. Explicitly instructing the model to check for multiple distinct jobs before synthesizing, rather than synthesizing first, changes the order of operations in a way that matters: it has to hold the segments apart mentally before it's allowed to average anything, rather than averaging by default and only noticing the split if asked to check afterward. The instruction to preserve a minority pattern from even one or two interviews addresses a specific statistical misunderstanding that creeps into small-sample qualitative synthesis — with 8 interviews, "only 2 people said this" is not a weak signal to be smoothed toward the majority the way it would be in a 500-person survey, because there's no law of large numbers operating at n=8 to justify treating a minority view as noise. Forbidding percentage language on a small qualitative sample matters because stating "25% of customers" about 2 out of 8 people borrows the rhetorical authority of quantitative research for a sample size where that framing is actively misleading — someone skimming the report would treat that percentage as more robust than the underlying two conversations actually support.`,
    exampleOutput: `Primary job-to-be-done (6 of 8 interviews): When I'm carrying credit card debt and feel like I'm not making progress, I want a clear payoff plan I can actually follow, so I can see a real end date instead of an open-ended balance. Distinct minority pattern (2 interviews): these two users weren't in debt at all — they wanted the app purely to save toward a specific goal (a house down payment), a meaningfully different job the debt-payoff framing doesn't serve.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-trend-analysis-signal-vs-noise',
    category: 'research',
    title: `Separate a real trend from a noisy spike before it goes in a strategy deck`,
    description: `Runs a trend analysis that explicitly checks whether a pattern is sustained and structural or a short-term spike, before presenting it as a trend worth acting on.`,
    promptText: `I've noticed what looks like a trend and want to know whether it's real before I put it in a strategy document. Help me stress-test it, not just describe it.

WHAT LOOKS LIKE A TREND
{{observed_pattern}}

DATA OR SOURCES I'M BASING THIS ON
{{supporting_data}}

TIME WINDOW OBSERVED
{{time_window}}

WHAT DECISION THIS WOULD JUSTIFY
{{intended_action}}

First, check the time window — a pattern visible over {{time_window}} needs to be checked against a longer baseline before calling it a trend rather than a seasonal blip or a one-off spike; if you don't have longer historical context in {{supporting_data}}, say explicitly that the trend can't yet be distinguished from a short-term fluctuation. Second, name at least one plausible cause for the pattern that is NOT the interesting narrative explanation, and check whether the mundane explanation is at least as consistent with the data as the interesting one — a specific one-off event, a seasonal cycle, a change in how the data was measured, or a small sample size inflating an ordinary fluctuation into something that looks dramatic. Third, only call it a genuine trend if it's structural (driven by a lasting underlying cause) rather than episodic, and state which one your evidence actually supports.

WHAT NOT TO DO
Do not describe a pattern as an emerging trend just because the framing I gave it sounds compelling — the fact that I noticed it and found it interesting is not evidence that it's real or lasting. Do not recommend {{intended_action}} on the strength of a pattern you've just flagged as possibly noise.

OUTPUT FORMAT
1. A verdict: genuine structural trend / likely noise or short-term spike / can't tell yet given available data.
2. The mundane alternative explanation you checked, and why it does or doesn't hold up.
3. What additional data or time window would resolve the uncertainty if the verdict is "can't tell yet."
4. Whether {{intended_action}} is currently justified by this evidence, stated plainly.`,
    variables: [
      {
        name: 'observed_pattern',
        description: `The pattern that looks like a trend.`,
        example: `Sign-ups from a specific industry vertical (dental clinics) have tripled over the past 6 weeks.`,
        required: true,
      },
      {
        name: 'supporting_data',
        description: `The actual data or sources behind the observation.`,
        example: `Weekly sign-up counts by industry tag for the past 6 weeks, no data further back than that available yet.`,
        required: true,
      },
      {
        name: 'time_window',
        description: `How long the pattern has been observed.`,
        example: `6 weeks.`,
        required: true,
      },
      {
        name: 'intended_action',
        description: `What decision or investment this trend would be used to justify.`,
        example: `Building a dedicated onboarding flow and marketing push specifically targeted at dental clinics.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `trend-analysis`,
      `data-analysis`,
      `business-research`,
      `strategy`,
      `research-methodology`,
    ],
    whyItWorks: `A model asked to analyze "what looks like a trend" is primed by the user's own framing to find and elaborate on that trend, since agreeing with the premise of a request is the path of least resistance — which means without a specific instruction to stress-test the pattern, the output will tend to describe why the trend makes sense rather than checking whether it's actually there. Requiring the mundane alternative explanation first forces a genuinely adversarial pass: a specific one-off cause (a single referral partner, a seasonal event, a measurement artifact) is concrete enough to actually check against the data, unlike a vague instruction to "be careful" which produces no real scrutiny. The time-window check matters mechanistically because six weeks of data has no way to distinguish a structural shift from a seasonal or coincidental blip — the honest answer when longer historical context isn't available is genuine uncertainty, and a model that fills that gap with a confident trend narrative anyway is doing exactly the kind of unwarranted extrapolation that turns short-term noise into a strategy-deck slide. Explicitly forbidding a recommendation to act on a pattern the analysis itself just flagged as possibly noise closes the most consequential failure mode: a hedge buried in paragraph three of an analysis gets ignored by a reader skimming for the recommendation in the executive summary, so the instruction has to prevent the recommendation from being made at all rather than trusting the hedge to survive downstream summarization.`,
    exampleOutput: `Verdict: can't tell yet given available data. Mundane alternative checked: a single dental-industry conference happened in week 3 of the window and one attendee posted about the product in a niche Slack community — this alone could explain a temporary spike without any lasting shift in the dental-clinic segment's interest. Additional data needed: sign-up trend for this vertical over the prior 6 months, and whether the spike sustains for another 4-6 weeks after the conference effect fades. Current recommendation: do not yet build a dedicated onboarding flow based on this data alone.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-tech-landscape-buy-vs-build-map',
    category: 'research',
    title: `Map a technology landscape around the one decision it actually needs to inform`,
    description: `Produces a technology landscape brief organized around a specific buy-vs-build or vendor-selection decision, rather than a broad survey of every player in the space.`,
    promptText: `Map the technology landscape for the area below, but keep it organized around the actual decision I'm making — not a comprehensive survey of every vendor and approach that exists in this space.

TECHNOLOGY AREA
{{technology_area}}

THE DECISION THIS MAP FEEDS
{{decision_to_make}}

CONSTRAINTS THAT RULE OPTIONS IN OR OUT
{{hard_constraints}}

WHAT I ALREADY KNOW OR HAVE RULED OUT
{{prior_knowledge}}

Organize the landscape around {{decision_to_make}}, grouping approaches or vendors by how they answer that decision rather than by category labels that don't map to it (e.g., don't just list "open source vs proprietary vs managed" if what actually matters to the decision is something else, like data residency or integration effort). Apply {{hard_constraints}} as hard filters, not soft preferences — an option that fails a hard constraint should be excluded entirely and named as excluded, not included with a caveat. For each option that survives the filter, state what would make it the right choice and what would make it the wrong one, tied to the actual decision, not a generic list of pros and cons. Skip re-explaining anything already covered in {{prior_knowledge}} — treat that as already known rather than restating it.

WHAT NOT TO DO
Do not produce an exhaustive vendor list padded out for completeness — every entry in the final map has to be a genuine live option for {{decision_to_make}}, not a name mentioned for thoroughness. Do not present a "clear winner" unless the evidence genuinely supports one; a landscape this early usually narrows the field, it doesn't always pick the final answer.

OUTPUT FORMAT
1. The decision restated in one line.
2. Options excluded outright by {{hard_constraints}}, named and why.
3. A table of the remaining live options: name, right-fit scenario, wrong-fit scenario, and open question still needing an answer before committing.
4. If evidence points clearly toward one option, say so plainly; if it doesn't, say that plainly too instead of forcing a recommendation.`,
    variables: [
      {
        name: 'technology_area',
        description: `The specific technology space being mapped.`,
        example: `Vector database options for a RAG-based internal knowledge search tool.`,
        required: true,
      },
      {
        name: 'decision_to_make',
        description: `The concrete decision this landscape needs to resolve.`,
        example: `Whether to self-host an open-source vector store or use a managed service, for a team of 4 engineers with limited ops bandwidth.`,
        required: true,
      },
      {
        name: 'hard_constraints',
        description: `Non-negotiable constraints that rule options in or out entirely.`,
        example: `Must support on-prem deployment for one specific client's data residency requirement; budget under $2,000/month at current scale.`,
        required: true,
      },
      {
        name: 'prior_knowledge',
        description: `What you already know or have already ruled out, to avoid re-explaining.`,
        example: `Already ruled out fully-managed enterprise options as too expensive for our current scale — no need to re-litigate that.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `tech-landscape`,
      `buy-vs-build`,
      `technology-research`,
      `vendor-evaluation`,
      `decision-making`,
    ],
    whyItWorks: `A generic "map the landscape" request gives a model no principle for what to include or exclude, so it defaults to the most common organizing scheme for that technology category found in its training data — usually a category taxonomy like open-source-vs-managed that may have nothing to do with the actual decision at hand, and it tends toward completeness (listing every notable player) because that reads as more thorough even when most of those players are irrelevant to the specific choice being made. Anchoring the map explicitly to one decision changes the sorting logic entirely: instead of grouping by industry-standard category labels, the model has to group by how each option answers the actual question, which is a fundamentally different and more useful cut of the same information. Treating hard constraints as filters rather than soft caveats matters because a model asked to "keep constraints in mind" will often include a constraint-violating option anyway with a footnote acknowledging the mismatch, which leaves a decision-maker to do the actual filtering themselves — explicitly requiring exclusion forces that filtering to happen upfront where it belongs. Refusing to force a "clear winner" when the evidence doesn't support one addresses a specific pressure in landscape research: a confident recommendation reads as more useful and complete than an honest "it depends, here's what would tip it," so a model will lean toward manufacturing a top pick unless explicitly told that a genuinely still-open decision is an acceptable and more honest output than a premature one.`,
    exampleOutput: `Decision: self-host vs. managed vector store for a 4-person eng team. Excluded outright: fully cloud-only managed options with no on-prem deployment path (fails data residency constraint for one client). Remaining options table: pgvector (self-hosted) — right fit if the team is comfortable owning Postgres ops; wrong fit if uptime SLAs matter more than cost. Weaviate (self-hostable, has managed tier) — right fit if wanting a migration path to managed later without a rewrite. Open question for both: actual ops burden estimate given the team's current bandwidth is still unverified.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-patent-brief-prior-art-risk-flagging',
    category: 'research',
    title: `Draft a patent landscape brief that flags prior-art risk instead of quietly hiding it`,
    description: `Produces a preliminary patent landscape brief for internal use that names potentially conflicting prior art and open uncertainty explicitly, framed clearly as a research aid for an attorney's review rather than a legal opinion.`,
    promptText: `Draft a preliminary patent landscape brief for internal use — this is a research aid to help prepare for a conversation with a patent attorney, not a legal opinion, and the output must say so plainly.

INVENTION OR FEATURE BEING ASSESSED
{{invention_description}}

WHAT MAKES IT DIFFERENT FROM EXISTING APPROACHES, AS I UNDERSTAND IT
{{claimed_novelty}}

KNOWN SIMILAR PRODUCTS OR PATENTS I'M AWARE OF
{{known_similar_art}}

INTENDED USE OF THIS BRIEF
{{intended_use}}

Open the brief with an explicit statement that this is a non-legal, preliminary research aid only, that it does not constitute legal advice or a formal freedom-to-operate opinion, and that any launch or filing decision requires review by a qualified patent attorney. Do not assert that any specific patent is or is not infringed, and do not state as fact whether {{invention_description}} is or isn't novel — instead, describe what {{claimed_novelty}} appears to be based on the information given, name the specific similar products or approaches in {{known_similar_art}} that look closest to it, and flag exactly where the overlap or distinction seems to lie, explicitly framed as "this looks worth having an attorney check" rather than a conclusion. Where you don't have enough information to assess overlap with a named prior approach, say so and note that as an open question for the attorney conversation rather than guessing. Never invent a specific patent number, filing date, or legal standard as if you had looked it up — if the brief needs a specific existing patent identified, instruct me to have that pulled from an actual patent database or provided by counsel rather than presenting an invented one.

WHAT NOT TO DO
Do not soften this into pure reassurance ("this looks clearly novel") or pure alarm ("this clearly infringes") — either overclaim is worse than the honest, bounded uncertainty this brief is supposed to represent.

OUTPUT FORMAT
1. The non-legal-advice disclaimer, stated plainly at the top.
2. A one-paragraph description of the claimed novelty as understood.
3. A table of known similar art with the specific point of overlap or distinction for each, and a confidence note (clear overlap worth flagging / unclear, needs attorney review / distinction looks meaningful based on information given).
4. A closing list of the specific open questions to bring to the attorney conversation.`,
    variables: [
      {
        name: 'invention_description',
        description: `The invention or product feature being assessed.`,
        example: `A method for automatically re-ranking search results based on a user's real-time scroll behavior within the same session.`,
        required: true,
      },
      {
        name: 'claimed_novelty',
        description: `What you believe makes this different from existing approaches.`,
        example: `Most re-ranking systems we're aware of use click data after the fact; ours adjusts ranking live, mid-session, based on scroll dwell time before any click happens.`,
        required: true,
      },
      {
        name: 'known_similar_art',
        description: `Similar products, patents, or approaches you're already aware of.`,
        example: `A major search engine's public engineering blog post describing a session-based re-ranking signal, and one competitor's patent filing we found mentioned in a news article.`,
        required: true,
      },
      {
        name: 'intended_use',
        description: `What this brief will actually be used for.`,
        example: `Prep material for a 30-minute call with outside patent counsel before deciding whether to file.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `patent-research`,
      `prior-art`,
      `ip-strategy`,
      `legal-research-aid`,
      `tech-landscape`,
    ],
    whyItWorks: `This is deliberately scoped as a non-legal internal research aid, not a substitute for counsel, because a model has no reliable way to perform an actual freedom-to-operate search against the real patent record, and asserting novelty or infringement as fact would present an unverified guess with the confidence of a real legal opinion — the explicit disclaimer at the top, plus the instruction never to invent a specific patent number or filing date, exists precisely to prevent that guess from being mistaken for verified legal fact. The three-tier confidence framing (clear overlap worth flagging / unclear, needs review / distinction looks meaningful) matters mechanically because a binary yes/no on novelty forces the model to resolve genuine uncertainty in one direction or the other, and either resolution overclaims confidence it doesn't actually have; a graded confidence note lets the brief honestly represent "I can see why this might matter, but I can't determine the actual answer" as a legitimate output rather than forcing a false binary. Explicitly forbidding both pure reassurance and pure alarm addresses the two failure modes a model tends toward under ambiguity — either agreeably confirming the user's belief that their invention is novel (since that's what the framing implies they want to hear), or overcorrecting into exaggerated caution that treats every tangential similarity as a serious risk; both directions are less useful to an attorney than a plainly stated, specific list of open questions. The instruction to route any need for a real patent number to an actual database or counsel, rather than fabricating one, is the direct guardrail against the single most damaging failure mode here: a specific-sounding but invented patent citation would look exactly as credible as a real one to someone relying on this brief.`,
    exampleOutput: `This is a preliminary, non-legal research aid only — it does not constitute legal advice or a freedom-to-operate opinion, and any filing or launch decision should be reviewed by a qualified patent attorney before acting on it. Claimed novelty: live, pre-click scroll-based re-ranking versus post-click historical re-ranking. Known similar art: [Search Engine] blog post describing session-based signals — unclear, needs review, since the blog post doesn't specify whether it's pre-click or post-click. Open questions for counsel: does the described competitor patent filing cover pre-click behavioral signals specifically, or only post-click data.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-academic-outline-argument-skeleton',
    category: 'research',
    title: `Build an academic paper outline around the argument's skeleton, not just section headers`,
    description: `Produces an academic outline where every section is defined by the specific claim it needs to establish and what evidence would support it, instead of generic headers like Introduction and Discussion with no argumentative content.`,
    promptText: `Build an outline for this paper — but every section needs to be defined by what it has to argue or establish, not just a generic academic header. A section labeled "Discussion" with no stated content is not an outline, it's a template.

PAPER TOPIC AND THESIS
{{paper_thesis}}

REQUIRED SECTIONS OR FORMAT
{{required_format}}

EVIDENCE OR SOURCES ALREADY AVAILABLE
{{available_evidence}}

KNOWN WEAK POINT IN THE ARGUMENT
{{acknowledged_weakness}}

For each required section from {{required_format}}, state the specific claim that section exists to establish, in one sentence, before listing sub-points under it. Under each claim, note which piece of {{available_evidence}} would support it and flag any claim that doesn't yet have supporting evidence lined up. Build in an explicit place in the outline to address {{acknowledged_weakness}} — do not let the outline quietly avoid the paper's own weak point by never mentioning it; a reviewer will find it whether the outline plans for it or not, so plan for it deliberately, ideally in the section where it does the least damage to the overall argument (usually addressed head-on rather than left for a rebuttal to raise first). Make sure each section's claim actually builds toward {{paper_thesis}} — a section that doesn't move the thesis forward, however conventionally expected it is in this type of paper, should be flagged as filler rather than included silently.

WHAT NOT TO DO
Do not write full prose for any section — this is a skeleton of claims and evidence pointers, not a draft. Do not include a section just because papers in this format conventionally have one if it isn't earning its place in this specific argument.

OUTPUT FORMAT
Section-by-section: 1) section name, 2) the one-sentence claim it exists to establish, 3) bullet sub-points, 4) which available evidence supports it or a flag that none does yet. Close with a note on where {{acknowledged_weakness}} is addressed and why that placement was chosen.`,
    variables: [
      {
        name: 'paper_thesis',
        description: `The paper's topic and central argument.`,
        example: `Arguing that asynchronous code review practices reduce senior engineer burnout without measurably slowing merge times, based on internal team data.`,
        required: true,
      },
      {
        name: 'required_format',
        description: `The section structure or format this paper needs to follow.`,
        example: `Standard IMRaD format: Introduction, Methods, Results, Discussion, Conclusion, per the target venue's submission guidelines.`,
        required: true,
      },
      {
        name: 'available_evidence',
        description: `The evidence, data, or sources already available to support the argument.`,
        example: `6 months of merge-time data across two teams, one using async review and one using synchronous review, plus an anonymous burnout survey from both teams.`,
        required: true,
      },
      {
        name: 'acknowledged_weakness',
        description: `The known weak point or vulnerability in the argument.`,
        example: `The two teams weren't randomly assigned to review styles — the async team happened to also be working on a less time-pressured project during the study period.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `academic-outline`,
      `research-writing`,
      `argument-structure`,
      `academic-research`,
      `writing-process`,
    ],
    whyItWorks: `A generic academic outline defaults to the conventional section names for the paper's format because those are the most heavily represented pattern in any training data covering that genre, and generic headers require no actual engagement with the argument to produce — which is exactly why an outline built this way so often turns out to be hollow scaffolding once someone sits down to actually write the Discussion section and realizes it has no defined content. Requiring a one-sentence claim per section forces the model to work out what each section is actually for in this specific argument before naming it, which is a meaningfully different and harder task than just recalling that papers in this format conventionally have a Discussion section. Tying each claim to specific available evidence, and flagging gaps where none exists yet, surfaces the outline's actual weaknesses at the cheapest possible stage — before a full draft has been written around a claim nobody can actually support with the data on hand. The instruction to deliberately place the acknowledged weakness rather than let it go unaddressed matters because a model given a thesis to argue for will, absent explicit instruction otherwise, tend to build the outline as pure advocacy for that thesis, since that's the straightforward way to satisfy "help me argue for X" — deliberately building in the paper's own weak point, and choosing where to address it head-on, produces a more credible outline than one that silently hopes a reviewer won't notice the confound, which they will.`,
    exampleOutput: `Methods section — Claim: the study design isolates review-style effects on merge time and burnout while being transparent about its limitations. Evidence: 6 months of merge-time data, both teams' burnout surveys. Weakness placement: the confound (async team also had a lighter project load) is addressed directly in Methods rather than left for Discussion, framed as a limitation the Results section's interpretation must account for rather than a surprise raised later.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-synthesis-conflicting-findings-reconciliation',
    category: 'research',
    title: `Synthesize research findings that disagree with each other without quietly picking a favorite`,
    description: `Produces a research synthesis across multiple findings or reports that keeps genuine disagreement visible and traces it to a specific cause, rather than resolving conflicting evidence into one clean narrative.`,
    promptText: `Synthesize the findings below into a single coherent brief. Some of these findings disagree with each other, and the synthesis needs to represent that honestly rather than resolving the disagreement into one clean story.

FINDINGS TO SYNTHESIZE
{{findings_list}}

WHAT THIS SYNTHESIS NEEDS TO SUPPORT
{{synthesis_purpose}}

KNOWN DIFFERENCES BETWEEN THE SOURCES
{{source_differences}}

Group the findings by the specific claim they address, not by which report they came from. Where two findings addressing the same claim agree, state that plainly and move on without over-elaborating. Where they disagree, do three things: state the disagreement explicitly, check whether {{source_differences}} explains it (different methodology, different population, different time period), and if it doesn't cleanly explain it, say so rather than inventing a resolution. Never write a summary sentence that blends two disagreeing findings into a single averaged claim neither source actually made — "studies suggest a moderate effect" is not an acceptable synthesis of one study finding a large effect and another finding none. State which findings are most load-bearing for {{synthesis_purpose}} and which are tangential, since not every finding in the source list carries equal weight for the actual purpose of this synthesis.

WHAT NOT TO DO
Do not present the synthesis as more unified or conclusive than the underlying findings actually are — a genuinely split evidence base should read as split, not smoothed into false consensus for the sake of a cleaner-sounding brief.

OUTPUT FORMAT
1. Findings grouped by claim, each marked as convergent or conflicting.
2. For each conflict, the explanation checked and whether it resolved the disagreement.
3. A short "bottom line for {{synthesis_purpose}}" section that states plainly what's well-supported, what's contested, and what remains genuinely unknown.`,
    variables: [
      {
        name: 'findings_list',
        description: `The set of findings, reports, or studies to synthesize.`,
        example: `Three internal analyses on whether a pricing change increased churn — one team's cohort analysis says yes, another team's survey data says users didn't notice a difference, a third says it's too early to tell.`,
        required: true,
      },
      {
        name: 'synthesis_purpose',
        description: `What this synthesis needs to actually support or decide.`,
        example: `Deciding whether to roll back the pricing change company-wide next quarter.`,
        required: true,
      },
      {
        name: 'source_differences',
        description: `Known differences between the sources that might explain disagreement.`,
        example: `The cohort analysis only covers customers who joined after the price change; the survey included long-tenured customers who may be less price-sensitive.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `research-synthesis`,
      `conflicting-evidence`,
      `data-analysis`,
      `decision-support`,
      `research-methodology`,
    ],
    whyItWorks: `Asked to produce one coherent brief from multiple findings, a model's cleanest path is to write a unifying narrative sentence that sits comfortably between disagreeing results — "studies suggest a moderate effect" when the actual inputs were one strong effect and one null result — because that sentence is fluent and sounds authoritative even though no individual source actually supports it; it's synthetic in the worst sense, a claim manufactured by the act of averaging rather than found in any evidence. Grouping by claim rather than by source is what makes disagreement visible in the first place, since findings about the identical question end up adjacent instead of scattered across separate per-source summaries where a reader has to notice the contradiction themselves. Checking each disagreement against named source differences gives the model a legitimate, evidence-grounded way to explain a conflict without picking a winner arbitrarily — and explicitly allowing "this doesn't cleanly explain it" as a valid answer matters because not every disagreement has a tidy methodological explanation, and forcing one where none genuinely exists just relocates the false-resolution problem one level down. The final "bottom line" structure that separates well-supported, contested, and genuinely unknown directly serves the stated decision purpose: a decision-maker reading this needs to know not just what the evidence says but how confident to be in each piece of it, and collapsing that distinction into one smooth paragraph would strip out exactly the information needed to weigh a split evidence base responsibly.`,
    exampleOutput: `Claim: the pricing change increased churn. Conflicting — cohort analysis shows a measurable churn increase among new customers; survey data shows long-tenured customers reporting no noticed change. Explanation checked: source difference (new vs. long-tenured customers) plausibly explains part of the gap, since new customers have less switching-cost inertia, but doesn't fully resolve it since the survey may simply be less sensitive than behavioral cohort data. Bottom line: churn impact on new customers looks reasonably well-supported; impact on the existing base remains genuinely unclear and needs more data before a company-wide rollback decision.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-literature-gap-map-from-source-list',
    category: 'research',
    title: `Turn a pile of sources into a defensible research-gap map instead of a vague 'more research is needed' line`,
    description: `Takes the sources you've already gathered and sorts what they actually agree on, conflict on, and never touch — so the gap you claim is one you can point to in the table, not one you're guessing at.`,
    promptText: `You are helping me build a research-gap map from a set of sources I've already collected — not finding new sources, and not writing the polished "gaps in the literature" paragraph yet. Your job is to sort what I have into agreement, conflict, and silence, so any gap I claim afterward is one I can point to directly.

RESEARCH QUESTION
{{research_question}}

SOURCES (list each with its core claim/finding in one line)
{{source_list}}

WHAT COUNTS AS "COVERED" HERE
{{coverage_definition}}

SUSPECTED GAP (if I already have a hunch)
{{suspected_gap}}

HOW TO SORT
Group the sources into three buckets: claims multiple sources converge on, claims sources actively conflict on (state both sides and which sources hold each), and sub-questions inside my research question that none of the sources address at all. For the conflict bucket, do not average the disagreement into a mushy middle position — name the disagreement as a disagreement, because a real gap-in-the-literature claim is often "these two camps contradict each other and nobody has reconciled it," not just "nobody looked." For the silence bucket, only list a sub-question as uncovered if it's a piece of my actual research question, not a tangential curiosity — an uncovered tangent isn't a gap, it's just something outside scope. If I gave you a suspected gap, check it against the sorted evidence and tell me plainly whether the sources actually support that being a gap or whether one of them already addresses it and I missed it.

WHAT NOT TO DO
Do not invent a source, a study, or a specific finding to fill in a bucket — if you don't have enough information from what I gave you to judge whether something is covered, say that explicitly instead of guessing. Do not write the final "gap statement" prose yet; this pass is the sorting, not the write-up.

OUTPUT FORMAT
1. Convergence table: claim, which sources support it.
2. Conflict table: the disagreement stated as a disagreement, which sources are on each side.
3. Uncovered sub-questions: a short list, each tied to a specific piece of my research question.
4. A verdict on the suspected gap, if given — supported, partially addressed, or already answered by [source].`,
    variables: [
      {
        name: 'research_question',
        description: `The overall question your research is trying to answer.`,
        example: `Does async standups improve delivery velocity for distributed engineering teams compared to synchronous daily standups?`,
        required: true,
      },
      {
        name: 'source_list',
        description: `Each source you've gathered with its core claim in a line.`,
        example: `Smith 2023: async standups cut meeting time 40% but self-reported alignment dropped. Chen 2024: no significant velocity difference either way, small sample (n=12 teams). Patel 2022: async works only when paired with written decision logs.`,
        required: true,
      },
      {
        name: 'coverage_definition',
        description: `What you count as a source actually addressing part of the question versus just mentioning it in passing.`,
        example: `A source counts as covering velocity only if it reports a measured delivery metric, not just a survey of team sentiment.`,
        required: true,
      },
      {
        name: 'suspected_gap',
        description: `A gap you already suspect exists, to be checked rather than assumed.`,
        example: `I suspect nobody has studied this specifically for teams spanning more than 6 time zones.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `literature-review`,
      `research-gap`,
      `evidence-synthesis`,
      `academic-writing`,
      `deep-research`,
    ],
    whyItWorks: `The core failure this avoids is the model quietly averaging a genuine disagreement between sources into a hedged middle position — GPT-5.1's default synthesis behavior tends to smooth conflicting claims into something like "results are mixed," which erases exactly the information a gap statement needs, since a real contradiction between two credible sources is often the gap itself, not noise to be flattened. Forcing three explicit buckets (convergence, conflict, silence) rather than one blended narrative keeps the disagreement visible as a disagreement, with sources attributed to each side, so the writer can later argue "camp A and camp B haven't been reconciled" instead of just asserting a vague absence. The instruction to only count a sub-question as uncovered if it's tied to a specific piece of the stated research question closes a common failure mode where a model pads out a gap list with tangential curiosities that sound like gaps but were never actually in scope — this keeps the gap map defensible rather than padded for length. Explicitly forbidding invented sources matters because when a coverage definition is ambiguous, a model under instruction to be thorough will sometimes produce a plausible-sounding citation-shaped claim to fill a bucket rather than admit uncertainty; naming this as the one thing to never do gives the model a clear, checkable failure to avoid rather than a vague quality aspiration. Checking the suspected gap against the sorted evidence rather than accepting it at face value also protects against confirmation bias baked into the prompt itself.`,
    exampleOutput: `Convergence: all three sources agree written documentation matters for async setups. Conflict: Smith reports a velocity gain, Chen finds no significant difference — worth noting Chen's sample is much smaller and may be underpowered rather than genuinely null. Uncovered: none of the three sources measure outcomes specifically for teams spanning more than 6 time zones. Suspected gap verdict: partially supported — timezone-spread specifically is untouched, but the broader async-vs-sync velocity question already has conflicting rather than absent evidence.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-interview-transcript-synthesis-across-participants',
    category: 'research',
    title: `Synthesize a stack of interview transcripts into themes without losing which participant actually said what`,
    description: `Turns raw or lightly-cleaned interview transcripts into a theme map with direct quotes attributed to specific participants, so the synthesis stays traceable back to the source instead of reading like one anonymous composite voice.`,
    promptText: `You are synthesizing multiple interview transcripts into a theme map. I need the output to stay traceable — every theme should be backed by attributed quotes, not a paraphrased blend that could have come from anyone.

STUDY GOAL
{{study_goal}}

TRANSCRIPTS (paste each with a participant label)
{{transcripts}}

PARTICIPANT CONTEXT
{{participant_context}}

MINIMUM QUOTE THRESHOLD
{{quote_threshold}}

STEP 1 — OPEN CODING
Read through each transcript and pull out short, direct phrases that capture a distinct idea, attributed to the participant who said it. Do not merge similar-sounding phrases from different participants yet.

STEP 2 — THEME GROUPING
Group the coded phrases into themes only when a phrase from {{quote_threshold}} confirms the pattern is shared, not idiosyncratic to one person. For each theme, name it in the participants' own language where possible rather than abstract academic terminology, and list which participants contributed to it and which did not.

STEP 3 — TENSION CHECK
Flag any theme where participants seem to agree on the surface but mean something different underneath — for example two people both saying "communication was hard" while one means volume of messages and the other means unclear ownership. Do not resolve these into one meaning; state both readings.

STEP 4 — OUTLIERS
List anything a single participant said that contradicts the majority theme, labeled as an outlier rather than folded silently into the nearest theme.

WHAT NOT TO DO
Never produce a quote that isn't a close match to something actually in the transcripts I gave you — if a theme feels true but you can't point to the specific line supporting it, say the theme is your inference, not participant-sourced.

OUTPUT FORMAT
For each theme: name, participant count, 2-3 attributed quotes, and one line noting any tension or outlier tied to it. End with a short list of themes with only single-participant support, marked as tentative.`,
    variables: [
      {
        name: 'study_goal',
        description: `What the interviews were trying to find out.`,
        example: `Understanding why new sales reps disengage from the CRM within their first 60 days.`,
        required: true,
      },
      {
        name: 'transcripts',
        description: `The interview transcripts, each labeled with a participant identifier.`,
        example: `Participant A (Rep, 3 months tenure): 'I stopped logging calls because nobody ever looked at the data anyway.' Participant B (Rep, 5 months): 'The fields ask for stuff that doesn't map to how we actually sell.'`,
        required: true,
      },
      {
        name: 'participant_context',
        description: `Relevant background on participants that affects how to weigh their statements.`,
        example: `All five participants are reps hired in the same quarter under the same manager; none have prior CRM experience from a previous job.`,
        required: false,
      },
      {
        name: 'quote_threshold',
        description: `How many participants need to raise something before it counts as a theme rather than an individual view.`,
        example: `at least 3 of the 5 participants`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `interview-synthesis`,
      `qualitative-research`,
      `thematic-analysis`,
      `user-research`,
      `deep-research`,
    ],
    whyItWorks: `The step-by-step structure — open coding before theme grouping — exists specifically to stop GPT-5.1 from doing what it does by default when handed raw transcripts in one pass: jumping straight to plausible-sounding themes and retrofitting quotes to match them, rather than letting the themes emerge from what's actually attributed to specific speakers. Requiring a minimum-participant threshold before something counts as a theme prevents a single vivid quote from one participant getting inflated into a headline finding, which is a common and misleading pattern in synthesized qualitative writeups where the most quotable line wins regardless of how many people actually said something like it. The tension-check step targets a specific failure mode of language-model synthesis: the model tends to treat surface-similar phrasing as semantic agreement, collapsing "communication was hard" into one meaning when the underlying complaints might be structurally different — naming this explicitly as something to check, rather than resolve, keeps the nuance visible instead of smoothing it away for a cleaner-sounding output. Explicitly forbidding fabricated or approximate quotes matters because a model asked to synthesize themes under a fixed format will, absent this constraint, sometimes generate a quote that reads as representative of a theme even if no participant said anything that close to it — flagging that as the single thing never to do gives it a hard boundary rather than a vague accuracy aspiration, and the requirement to mark theories as "my inference" when unsupported keeps analytical leaps distinguishable from participant-sourced findings.`,
    exampleOutput: `Theme: 'Data entry feels like busywork' (4/5 participants). Quotes: A — 'nobody ever looked at the data anyway'; C — 'I fill it in because I have to, not because it helps me.' Tension: B's version is about fields not mapping to their sales motion, which is a design complaint rather than a motivation complaint — worth treating as adjacent, not identical. Outlier: participant E actually finds the CRM useful for tracking their own follow-ups, contradicting the majority pattern.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-survey-instrument-bias-review-before-fielding',
    category: 'research',
    title: `Pressure-test a draft survey for leading questions and bad scales before it goes out to real respondents`,
    description: `Reviews a drafted survey question-by-question for leading phrasing, double-barreled questions, and scale mismatches, and rewrites only the flagged items — so you're not re-explaining your whole study to get one clean pass on wording.`,
    promptText: `Review this draft survey instrument for wording problems before it goes out to respondents. I want a question-by-question audit, not a general commentary on survey design.

SURVEY GOAL
{{survey_goal}}

DRAFT QUESTIONS (numbered, with response scale noted)
{{draft_questions}}

RESPONDENT POPULATION
{{respondent_population}}

KNOWN SENSITIVE TOPIC
{{sensitive_topic}}

For every question, check it against four specific failure types and only flag the ones that actually apply — don't pad the audit with a pass/fail note on every category for every question:

1. LEADING PHRASING — wording that signals a preferred answer (e.g. "How much did you enjoy..." assumes enjoyment happened).
2. DOUBLE-BARRELED — asking two things in one question so a single answer can't be interpreted (e.g. "Was the onboarding fast and clear?" — fast and clear can diverge).
3. SCALE MISMATCH — a response scale that doesn't fit the question's actual range of possible answers, including scales missing a genuine "does not apply" option where one is needed.
4. SENSITIVE-TOPIC HANDLING — if {{sensitive_topic}} applies to a question, check whether the phrasing and answer options let a respondent answer honestly without visible judgment, and whether an opt-out is available.

For every flagged question, give the specific rewrite, not just the diagnosis — a respondent-facing survey needs the fixed wording ready to drop in, not a description of what's wrong with it. If a question has no issues, just list it as clean; do not manufacture a minor note to justify commentary on it.

After the question-by-question audit, do one pass across the whole instrument for question-order effects — whether an earlier question could prime how {{respondent_population}} answers a later one — and flag only genuine ordering risks, not hypothetical ones.

OUTPUT FORMAT
A table: question number, issue type (or "clean"), and rewrite where applicable. Followed by a short list of any order-effect risks across the instrument as a whole.`,
    variables: [
      {
        name: 'survey_goal',
        description: `What decision or understanding this survey is meant to produce.`,
        example: `Deciding whether to keep or drop the optional onboarding webinar based on perceived usefulness.`,
        required: true,
      },
      {
        name: 'draft_questions',
        description: `The numbered survey questions as currently drafted, with their response scale.`,
        example: `1. Did you find the onboarding webinar helpful and well-organized? (Yes/No) 2. How much did you enjoy using the product in your first week? (1-5 scale)`,
        required: true,
      },
      {
        name: 'respondent_population',
        description: `Who will actually answer this survey.`,
        example: `New customers within their first 30 days, mostly small business owners with limited time to respond.`,
        required: true,
      },
      {
        name: 'sensitive_topic',
        description: `Any topic in the survey that respondents might feel judged answering honestly about.`,
        example: `Whether they've considered canceling their subscription.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `survey-design`,
      `questionnaire-review`,
      `research-methods`,
      `bias-check`,
      `deep-research`,
    ],
    whyItWorks: `Naming four specific, checkable failure categories instead of asking for a general wording review matters because an open-ended "review this survey" prompt tends to produce GPT-5.1's default critique register — broad, hedged observations like "consider whether questions are neutral" — which sounds thorough but gives nothing a survey author can act on directly; a named failure type with a definition forces a verdict per question instead of vague commentary. The instruction to only flag categories that actually apply, rather than reporting pass/fail on every category for every question, prevents the output from ballooning into a padded audit where genuine issues get buried under routine "no issue here" notes — this is a common failure mode when a model is given a checklist and defaults to exhaustively confirming every box rather than surfacing only what matters. Requiring the actual rewrite rather than just the diagnosis closes the gap between "here's what's wrong" and something a researcher can paste directly into the field-ready instrument, which matters because leading and double-barreled phrasing is often genuinely hard to fix well, and a diagnosis without a fix just shifts the hard part back onto the person who asked for help. The sensitive-topic handling check exists because default survey phrasing frequently telegraphs an expected answer on topics respondents already feel judged about, and a model reviewing generically won't reliably catch this unless the specific topic is named as something to check for — naming it turns a general awareness into a targeted, checkable pass.`,
    exampleOutput: `Q1: double-barreled (helpful and well-organized can diverge) — rewrite as two separate questions, one per attribute, each on a 1-5 scale. Q2: leading phrasing (assumes enjoyment) — rewrite: 'How would you describe your experience using the product in your first week?' with a neutral 1-5 scale labeled from 'very negative' to 'very positive.' Order-effect risk: placing the cancellation-consideration question immediately after a satisfaction question may anchor respondents' answer — consider separating them with a neutral filler question.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-desk-research-brief-with-source-confidence-tiers',
    category: 'research',
    title: `Run a desk research pass that tells you which findings to trust and which to verify yourself`,
    description: `Produces a structured desk research brief that separates findings by how confident you should be in them, rather than presenting a scraped-together summary as uniformly reliable.`,
    promptText: `I need a desk research brief on the topic below. Structure it so I can immediately tell which claims are solid enough to act on and which need independent verification before I use them — do not present everything with the same level of apparent confidence.

RESEARCH TOPIC
{{research_topic}}

DECISION THIS WILL INFORM
{{decision_context}}

WHAT I ALREADY KNOW (so you don't re-explain it)
{{prior_knowledge}}

TIME BOX
{{time_box}}

STRUCTURE THE BRIEF AS THREE CONFIDENCE TIERS:
TIER 1 — WELL-ESTABLISHED: points that are widely corroborated or definitional, where you're confident in the claim itself even if you can't pin an exact source.
TIER 2 — LIKELY BUT UNVERIFIED: points that sound right based on general patterns in the space but that you cannot confirm are current, precise, or specific to the exact context in {{research_topic}} — flag these explicitly as needing a check against a live source before they're used in {{decision_context}}.
TIER 3 — OPEN QUESTIONS: things relevant to the decision that desk research genuinely can't answer without either primary research or a source you don't have access to — name these directly rather than papering over them with a plausible-sounding guess.

For every specific number, statistic, or named claim (a market size, a percentage, a named competitor's practice), do not present it as fact unless you're highly confident it's both accurate and current — if you're not sure, either omit the specific figure and describe the shape of the finding qualitatively, or place it in Tier 2 with an explicit note to verify. Never invent a number to make a point sound more concrete than it is.

Given the time box, prioritize breadth of the Tier 1 and Tier 3 sections over exhaustive Tier 2 detail — a decision-maker on a tight clock needs to know what's solid and what's missing more than a long list of half-confirmed maybes.

OUTPUT FORMAT
Three labeled tiers as above, each with short bulleted points. End with a one-line summary of what would most change the decision in {{decision_context}} if it turned out to be wrong.`,
    variables: [
      {
        name: 'research_topic',
        description: `The specific topic the desk research should cover.`,
        example: `How mid-market SaaS companies typically structure usage-based pricing tiers.`,
        required: true,
      },
      {
        name: 'decision_context',
        description: `What decision this research is meant to support.`,
        example: `Deciding whether to move our product from seat-based to usage-based pricing next quarter.`,
        required: true,
      },
      {
        name: 'prior_knowledge',
        description: `What you already know, so the brief doesn't waste space re-explaining it.`,
        example: `We already know the basic difference between seat-based and usage-based models; skip that part.`,
        required: false,
      },
      {
        name: 'time_box',
        description: `How much depth this brief should aim for given the time available.`,
        example: `This needs to be useful for a decision meeting tomorrow, not an exhaustive report.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `desk-research`,
      `secondary-research`,
      `research-brief`,
      `decision-support`,
      `deep-research`,
    ],
    whyItWorks: `The three-tier confidence structure directly counters the single biggest risk of using a language model for desk research: GPT-5.1 states well-established background knowledge and half-remembered, possibly outdated specifics in the exact same fluent, confident register, so a reader has no built-in signal for which claims to trust — forcing an explicit tier split makes the model's own uncertainty visible instead of hidden behind uniformly confident prose. The instruction to never invent a specific number targets a well-documented failure mode where a model asked for concrete figures will produce a plausible-sounding statistic that fits the expected shape of an answer even when it has no reliable basis for that exact number — permitting a qualitative description instead of a fabricated figure gives the model an honest way out that doesn't sacrifice usefulness. Naming Tier 3 as questions desk research genuinely cannot answer matters because a model under pressure to be comprehensive will otherwise stretch a weak inference to cover a real gap rather than admitting the gap exists, which is far more dangerous for a decision-maker than an honest "we don't know" — an unacknowledged gap gets treated as covered ground. The time-box instruction to prioritize Tier 1 and Tier 3 breadth over Tier 2 depth reflects how these briefs actually get used: a decision-maker on a clock needs to know what's solid and what's missing far more urgently than an exhaustive list of maybes, so the prioritization keeps the brief matched to how much attention it will realistically get.`,
    exampleOutput: `Tier 1: Usage-based pricing is now standard for infrastructure and API-metered products; hybrid seat-plus-usage models are increasingly common as a transition step. Tier 2: exact adoption percentages across mid-market SaaS specifically vary by source and may be dated — verify against a recent survey before citing a number in the meeting. Tier 3: how usage-based pricing affects net revenue retention specifically for products with highly variable per-customer usage isn't something desk research alone can answer confidently; this needs your own cohort data.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-executive-briefing-from-raw-research-notes',
    category: 'research',
    title: `Compress a stack of research notes into an executive briefing an exec will actually read to the end`,
    description: `Turns raw research notes into a one-page executive briefing that leads with the decision-relevant takeaway and pushes supporting detail into an appendix, instead of a chronological recap of everything you found.`,
    promptText: `Compress the research notes below into an executive briefing for someone who has five minutes and needs to leave with a clear takeaway, not a chronological account of how the research unfolded.

RAW RESEARCH NOTES
{{research_notes}}

WHO IS READING THIS
{{executive_reader}}

DECISION AT STAKE
{{decision_at_stake}}

MY OWN RECOMMENDATION (if I have one)
{{recommendation}}

Open with the bottom line, not the background — the first two sentences should state what this means for {{decision_at_stake}}, before any explanation of methodology or process. Do not lead with "we conducted research into X"; lead with what was found and what it implies. Reorganize the notes by decision relevance, not by the order I researched them in — group findings under what supports the decision, what argues against it, and what's still uncertain, since a chronological recap is the format research notes naturally come in but never the format a time-pressed reader needs. Cut anything from the notes that's interesting but doesn't bear on {{decision_at_stake}} — a briefing is not obligated to use everything I gathered.

If I gave you my own recommendation, state clearly whether the compressed evidence actually supports it, partially supports it, or points a different direction — do not silently reshape the evidence to flatter a recommendation I've already committed to; an executive briefing that quietly confirms whatever the requester already believed is worse than no briefing at all.

Push any supporting detail an exec might ask about in the room — the numbers behind a claim, a caveat, a source note — into a labeled appendix rather than the main body, so the main body stays skimmable in under a minute while the detail is still one scroll away if someone asks a follow-up.

OUTPUT FORMAT
1. Bottom line (2-3 sentences).
2. Supports / against / uncertain, as short bullets.
3. Recommendation verdict, if one was given.
4. Appendix: detail bullets, clearly separated from the main body.`,
    variables: [
      {
        name: 'research_notes',
        description: `The raw notes, findings, or summaries you've gathered, in whatever order you have them.`,
        example: `Competitor A raised prices 15% last quarter with no visible churn spike. Competitor B tried the same and lost 8% of accounts within two months. Our support ticket volume correlates more with feature gaps than price in exit surveys.`,
        required: true,
      },
      {
        name: 'executive_reader',
        description: `Who is reading this and what they already care about.`,
        example: `The VP of Product, who is under pressure from the board to show a credible path to margin improvement this quarter.`,
        required: true,
      },
      {
        name: 'decision_at_stake',
        description: `The actual decision this briefing needs to inform.`,
        example: `Whether to raise prices 10% across the board next quarter.`,
        required: true,
      },
      {
        name: 'recommendation',
        description: `Your own leaning or recommendation, to be checked against the evidence rather than assumed correct.`,
        example: `I'm currently leaning toward raising prices but only for new customers, not existing ones.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `executive-summary`,
      `research-communication`,
      `decision-brief`,
      `stakeholder-communication`,
      `deep-research`,
    ],
    whyItWorks: `The instruction to open with the bottom line rather than background targets a specific and very common failure of model-generated summaries: GPT-5.1's default compression of long notes tends to preserve the original narrative order — methodology, then findings, then implications — because that's the shape most source material comes in, but that order is precisely backwards for an executive reader who needs the implication first and only wants the methodology if they ask. Reorganizing by decision relevance instead of chronology forces genuinely different findings that happen to be about the same topic into an argument structure (supports, against, uncertain) rather than a list, which is what actually helps someone make a call rather than just informs them. The instruction to check the given recommendation against the compressed evidence rather than assume it's correct directly counters a subtle form of sycophancy: when a draft already states what the requester wants to conclude, a model asked to summarize supporting research tends to shape the compression toward confirming that conclusion, quietly downgrading contradicting notes to minor caveats — naming this risk explicitly and requiring an honest verdict (supports, partially supports, or contradicts) breaks that default and makes the briefing actually useful for catching a wrong call before it's made in front of a board. Pushing supporting detail to a clearly labeled appendix rather than cutting it entirely solves the real tension in executive communication between being skimmable and being defensible when someone asks a follow-up question in the room — the appendix keeps both properties without forcing a choice between them.`,
    exampleOutput: `Bottom line: the price increase carries real churn risk based on Competitor B's outcome, and our own exit-survey data suggests the actual driver of churn is feature gaps, not price — raising prices without addressing that gap first repeats the pattern that hurt Competitor B rather than Competitor A. Supports: no visible churn from Competitor A's increase. Against: Competitor B's near-identical move lost 8% of accounts. Uncertain: whether our product's feature-gap profile is closer to A's or B's at the time of their price changes. Recommendation verdict: partially supported — new-customer-only pricing avoids the existing-base churn risk seen in Competitor B's case, but the underlying feature-gap issue should be addressed independently of the pricing decision.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-findings-to-publishable-article-outline',
    category: 'research',
    title: `Turn a completed research writeup into a publishable article outline without losing the caveats that made it honest`,
    description: `Converts a finished research document into a structured outline for a blog post or article aimed at a wider audience, while explicitly protecting the caveats and limitations that a punchier rewrite usually strips out first.`,
    promptText: `Take the research writeup below and produce an outline for turning it into a publishable article for {{publication_context}} — not the full article yet, an outline I can review before drafting starts.

SOURCE RESEARCH WRITEUP
{{research_writeup}}

TARGET AUDIENCE
{{target_audience}}

PUBLICATION CONTEXT
{{publication_context}}

MUST-KEEP CAVEATS
{{must_keep_caveats}}

Build the outline around the single strongest, most concrete finding as the hook — not the broadest claim the research could theoretically support, and not the methodology. A wider audience reads for what changed or what surprised, not for how thorough the process was; lead the outline with whichever finding would make someone actually stop scrolling, and say explicitly why you picked that one over the others in the source material.

For every caveat listed in {{must_keep_caveats}}, mark exactly where in the outline it needs to survive into the article — do not let a caveat get implicitly dropped just because it complicates the narrative; if a caveat genuinely can't fit without undermining the hook, flag that tension directly rather than quietly outlining around it.

Write each outline section as what it needs to accomplish for the reader, not just a section title — "establishes why this matters to someone who's never thought about it" is more useful at outline stage than a title like "Background."

Flag any claim in the source writeup that was appropriately hedged for a research context but would read as an unqualified fact if simplified for {{target_audience}} without its original caveat — this is the most common way a faithful research writeup turns into a misleading popular article, and it needs to be caught at outline stage, before drafting, not fixed after the fact.

OUTPUT FORMAT
1. The chosen hook and one line on why it beats the alternatives.
2. Section-by-section outline, each with its job, not just a title.
3. A caveat placement map — which section carries which must-keep caveat.
4. A flagged list of claims that need explicit hedging preserved when simplified.`,
    variables: [
      {
        name: 'research_writeup',
        description: `The finished research document, report, or findings summary to adapt.`,
        example: `Full 12-page internal report on why churned customers cite 'too complex' twice as often in exit interviews as in the exit survey, with a discussion of interviewer framing effects and small sample caveats.`,
        required: true,
      },
      {
        name: 'target_audience',
        description: `Who the published article is actually for.`,
        example: `Product managers at other companies who read our blog for practical churn-reduction ideas, not academics.`,
        required: true,
      },
      {
        name: 'publication_context',
        description: `Where this will run and what that implies about length and tone.`,
        example: `Our company blog, roughly 900-1200 words, casual-professional tone.`,
        required: true,
      },
      {
        name: 'must_keep_caveats',
        description: `Specific limitations or caveats from the research that must not be dropped in the popular version.`,
        example: `The exit-interview sample was only 14 customers, and interviewers knew the study's hypothesis in advance, which could have shaped the questions asked.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `research-communication`,
      `content-strategy`,
      `article-outline`,
      `science-communication`,
      `deep-research`,
    ],
    whyItWorks: `The explicit caveat-placement map exists because the single most predictable failure of turning a hedged research writeup into a punchier public-facing piece is that hedges are the first thing a simplification pass cuts, precisely because they weaken the hook a general-audience piece is built around — GPT-5.1, when asked generically to make research "more readable," will smooth away qualifiers like small sample size or interviewer bias by default, since removing them genuinely does make the writing punchier, which is exactly the wrong optimization for a piece whose credibility depends on those limits being visible. Requiring the outline to name where each specific caveat lands, rather than trusting it to survive an unstructured rewrite, forces the tradeoff to be made consciously at outline stage instead of silently during drafting, when it's much harder to notice something is missing. The instruction to flag claims that were safely hedged in the original but would read as unqualified fact once simplified targets the same failure from a different angle — it's not just about preserving caveats that already exist as sentences, but catching claims whose entire safety depended on surrounding qualification that a simpler sentence structure would strip away invisibly. Choosing the hook based on the strongest concrete finding rather than the broadest claim also matters mechanically: a model asked to make research "compelling" for a wide audience will often reach for the most sweeping, generalizable-sounding claim in the source material because it sounds impactful, even when that's the claim the original research supported most weakly — anchoring the hook selection to concreteness rather than scope keeps the article's headline claim as strong as its underlying evidence.`,
    exampleOutput: `Hook: exit interviews surface complexity complaints twice as often as the survey does — chosen over the broader 'customers find our product too complex' claim because it's the specific, surprising, evidence-backed finding, not an inflated generalization. Caveat placement: the small sample size (n=14) belongs in the section explaining the finding itself, stated plainly rather than buried in a footnote; the interviewer-bias caveat belongs immediately after any claim that leans on interview data specifically. Flagged claim: 'customers find the product too complex' reads as fact if published without noting it's drawn from a small, potentially primed sample — needs the caveat attached directly to the sentence, not just nearby.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-literature-comparison-matrix-builder',
    category: 'research',
    title: `Build a literature comparison matrix that actually lets you compare studies, not just list them`,
    description: `Produces a structured comparison matrix across a set of studies or sources on consistent dimensions you choose, so you can scan for patterns across methodology and findings instead of reading each source's summary in isolation.`,
    promptText: `Build a literature comparison matrix from the sources below, structured so studies can actually be compared against each other on the same dimensions, not just summarized one after another.

SOURCES
{{sources}}

COMPARISON DIMENSIONS
{{comparison_dimensions}}

WHAT I'M TRYING TO DECIDE OR ARGUE
{{purpose}}

For each source, extract only what's needed to fill each dimension in {{comparison_dimensions}} — do not include a general summary of the source alongside the matrix; the matrix itself is the deliverable, not a supplement to a separate summary. If a source doesn't report information for a given dimension, mark that cell as "not reported" rather than leaving it blank or inferring a plausible value — a matrix that silently fills gaps with inference is more dangerous than one that's honest about what's missing, because the gaps are exactly what someone comparing methodologies needs to see.

After the matrix, add one row of pattern notes per dimension: where sources cluster, where they diverge, and whether any divergence tracks a specific difference in method (sample size, population, measurement approach) rather than being unexplained disagreement. Only claim a divergence "tracks a methodological difference" if the sources actually differ on that specific method — don't manufacture a tidy methodological explanation for a disagreement that might just be genuine disagreement.

Given what I'm trying to decide or argue, close with a short note on which specific cells in the matrix are most load-bearing for that purpose — the ones where the sources most directly bear on my actual question, as distinct from dimensions that are interesting background but don't move my argument either way.

OUTPUT FORMAT
A matrix table: rows are sources, columns are the comparison dimensions. Below it, one pattern-note line per dimension. Close with the load-bearing cells note.`,
    variables: [
      {
        name: 'sources',
        description: `The studies or sources to compare, with enough detail from each to fill the dimensions.`,
        example: `Study A (n=200, retail workers): found flexible scheduling increased retention 12%. Study B (n=45, healthcare workers): found no retention effect but improved self-reported wellbeing. Study C (n=310, mixed industries): retention improved only among workers with caregiving responsibilities.`,
        required: true,
      },
      {
        name: 'comparison_dimensions',
        description: `The specific columns you want the matrix built on.`,
        example: `sample size and population, methodology (survey/experiment/observational), retention effect found, wellbeing effect found, key limitation stated by the authors`,
        required: true,
      },
      {
        name: 'purpose',
        description: `What decision or argument this comparison is meant to support.`,
        example: `Deciding whether to recommend flexible scheduling company-wide or only for specific employee segments.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `literature-review`,
      `comparison-matrix`,
      `academic-research`,
      `evidence-synthesis`,
      `deep-research`,
    ],
    whyItWorks: `Requiring the matrix to be the sole deliverable rather than a matrix-plus-summary combination forces genuine dimensional extraction instead of GPT-5.1's default tendency to fall back on prose summarization, which is a more natural output shape for the model but defeats the entire point of a comparison matrix — the value of a matrix is that identical dimensions sit in the same column across every row, letting a reader scan down and compare directly, and a parallel summary paragraph lets the model quietly avoid the harder job of forcing inconsistent source reporting into consistent categories. The explicit "not reported" rule instead of leaving cells blank or silently inferring a value targets a specific and consequential failure: a model filling a structured table under implicit pressure to look complete will often infer a plausible value for a missing dimension rather than admit the source didn't report it, and for a literature comparison this is actively harmful because gaps in reporting are frequently the most useful signal — for instance if none of the studies report attrition rate, that absence itself is worth knowing, not something to paper over with a guess. The instruction to only attribute a divergence to a methodological difference when the sources genuinely differ on that specific method guards against a related pattern where a model asked to explain disagreement reaches for the most available tidy explanation (different sample sizes, different populations) even when the sources are actually just similar-method studies that disagree, which would misrepresent the disagreement as more resolved than it is. Closing with which cells are load-bearing for the stated purpose keeps the matrix from becoming an undifferentiated wall of comparison points, directing attention to the specific evidence that actually bears on the decision at hand rather than treating every dimension as equally decision-relevant.`,
    exampleOutput: `Row for Study A: n=200/retail, survey-based, +12% retention, not reported (wellbeing), authors note self-selection bias in respondents. Pattern note on retention effect: two of three studies find a positive effect, but Study C's effect is concentrated specifically among caregivers, suggesting the retention benefit may not be uniform. Load-bearing cells: the population column and Study C's caregiver-specific finding matter most for deciding whether to recommend flexible scheduling company-wide versus segment-targeted.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'research-findings-presentation-storyline-builder',
    category: 'research',
    title: `Build a research presentation storyline that survives an audience skipping straight to slide 12`,
    description: `Structures a research presentation around a single argument thread with a clear slide-by-slide storyline, so the deck holds up even for someone who jumps ahead or only reads the headlines.`,
    promptText: `Build a slide-by-slide storyline for a research presentation from the findings below — not the slide content itself yet, the structural outline of what each slide argues and how it connects to the one before it.

RESEARCH FINDINGS
{{research_findings}}

AUDIENCE
{{audience}}

CORE ARGUMENT I WANT THE DECK TO MAKE
{{core_argument}}

TIME LIMIT
{{time_limit}}

Start by stating the core argument as a single sentence a viewer should be able to state back after seeing the deck, then build every slide as a step that either establishes a piece of evidence for that argument or addresses the most likely objection to it — cut any finding from {{research_findings}} that's true and interesting but doesn't serve the core argument, even if it took real effort to uncover.

For each slide, write its headline as the actual claim of that slide, not a topic label — "Retention improved 12% under flexible scheduling" is a slide headline, "Retention Results" is not, because a reader skimming headlines alone should be able to reconstruct the deck's argument without reading the supporting content on any slide.

Assume someone in the room will jump straight to a specific slide or ask about it out of order — for each slide, note in one line whether it depends on a claim established earlier that would need a quick recap if someone jumped ahead, so the presenter knows which slides are safe to present out of sequence and which need a bridge sentence.

Given the time limit, mark which slides are core (the argument breaks without them) versus supporting (useful but cuttable if time runs short) — a presenter needs an honest answer to "what do I cut if I'm running long," not a deck where every slide claims to be essential.

OUTPUT FORMAT
For each slide: number, claim-headline, core or supporting, and a one-line note on whether it depends on an earlier slide's claim. End with the one-sentence core argument the deck should leave the audience able to repeat.`,
    variables: [
      {
        name: 'research_findings',
        description: `The research findings available to build the deck from.`,
        example: `Flexible scheduling raised retention 12% overall, effect was concentrated in employees with caregiving responsibilities, no effect on productivity metrics, cost to implement was under $50/employee/year.`,
        required: true,
      },
      {
        name: 'audience',
        description: `Who is watching this presentation and what they already care about.`,
        example: `The exec team, who are primarily worried about cost and whether this creates a fairness perception issue between employees.`,
        required: true,
      },
      {
        name: 'core_argument',
        description: `The single argument you want the deck to land, before it's broken into slides.`,
        example: `We should offer flexible scheduling as an opt-in for all employees, not restrict it to caregivers, because the cost is low and restricting it risks a fairness backlash.`,
        required: true,
      },
      {
        name: 'time_limit',
        description: `How long the presentation actually has, which determines what's core versus cuttable.`,
        example: `10 minutes total, including questions.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `research-presentation`,
      `storyline-design`,
      `data-storytelling`,
      `stakeholder-communication`,
      `deep-research`,
    ],
    whyItWorks: `Requiring slide headlines to state the actual claim rather than a topic label directly targets the most common structural weakness in research decks — a title like 'Retention Results' asks the audience to hold the interpretation in their head until they've processed the chart beneath it, while a claim-headline front-loads the interpretation so the argument survives even if someone only reads the headline row, which is closer to how a skimming or distracted audience actually consumes a deck. The instruction to cut findings that don't serve the stated core argument, even effortful ones, counters GPT-5.1's default bias toward exhaustive inclusion when it has a rich set of findings available — a model building a deck from a full findings list will tend to give every real finding a slide out of a sense that leaving out something true wastes the research, when a presentation's job is persuasion toward one argument, not a complete report of everything discovered. Marking each slide's dependency on an earlier claim addresses a real structural risk specific to live presentations that a slide deck built for linear reading ignores: executives frequently jump to a slide that interests them or interrupt with a question out of the planned order, and a deck built without accounting for this leaves the presenter unable to answer a mid-deck question without silently backfilling context the audience hasn't seen yet — flagging dependencies in advance lets the presenter prepare a one-line bridge rather than getting caught improvising it live. The core-versus-supporting split tied to the actual time limit gives an honest answer to a pressure a presenter genuinely faces (running long and needing to cut on the fly) rather than a deck that implicitly claims every slide is equally load-bearing, which is what happens by default when a model is simply asked to "turn these findings into a deck" without being told time is genuinely constrained.`,
    exampleOutput: `Slide 3: 'Flexible scheduling costs under $50/employee/year to implement' — core, no dependency on earlier slides, safe to present out of order. Slide 5: 'The 12% retention gain is concentrated among caregivers, not evenly spread' — supporting but load-bearing for the fairness argument; depends on slide 3's cost figure being established first if asked why not just restrict it to caregivers. Core argument: offer flexible scheduling to all employees as opt-in, since the cost is low and restricting it by role risks a fairness backlash without saving meaningfully on cost.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
