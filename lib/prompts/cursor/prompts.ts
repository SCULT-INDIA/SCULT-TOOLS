import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'cursor-agent-mode-multifile-feature-brief',
    category: 'cursor',
    title:
      "Brief Cursor's Agent mode to build a multi-file feature without wandering into untouched files",
    description:
      "A Composer/Agent-mode brief that names the files in scope, the data contract between them, the codebase's existing conventions, and what to leave alone, plus a forced pre-edit plan, so an autonomous multi-file build stays inside the feature you actually asked for instead of expanding into whatever the semantic index surfaces as related.",
    promptText: `You are working in Cursor's Agent mode with multi-file edit access across this repository's indexed codebase. Build the feature below end to end, but treat every boundary in this brief as a hard constraint, not a suggestion you can override if you find a "better" way mid-edit.

FEATURE
{{feature_description}}

FILES YOU MAY CREATE OR MODIFY
{{files_in_scope}}

DATA CONTRACT BETWEEN THESE FILES
{{data_contract}}

OUT OF SCOPE — DO NOT TOUCH EVEN IF IT LOOKS RELATED
{{out_of_scope}}

CODEBASE CONVENTIONS TO MATCH
{{codebase_conventions}}

BEFORE WRITING ANY CODE
List every file you intend to create or modify, in the order you'll edit them, and state which sentence of the feature description each edit satisfies. If that plan requires a file outside FILES YOU MAY CREATE OR MODIFY, stop here and name it explicitly before touching it — do not expand scope silently mid-session just because the codebase index surfaced a plausible "related" file while you were searching for something else.

WHILE EDITING
- Keep the data contract above literal on both ends of every file boundary it crosses. If satisfying the feature actually requires changing a field name or shape, say so and wait for confirmation rather than adapting one side quietly while the other goes stale.
- Do not add a new dependency, even a small one, without naming it and the specific reason it's needed first — a "simpler" implementation using an existing utility is always the default unless one genuinely doesn't exist.
- Match the codebase conventions given above exactly — naming patterns, error-handling style, where types live — rather than defaulting to whatever pattern is most common in your own training data. A new file that's individually well-written but stylistically foreign to everything around it has failed this brief even if it works.
- Do not run a workspace-wide build, lint, or test command when the change only touches a handful of files; use the narrowest scoped command available and say which one you ran.

WHEN DONE
List every file changed, one line each, mapped to the specific requirement it satisfies. Separately, list anything from the feature description you could not finish and exactly why — a missing dependency, an ambiguous requirement, a conflict with an existing pattern — rather than silently shipping a partial implementation dressed up as complete. If you made any judgment call the brief didn't explicitly cover, name it and the reasoning, so it can be checked rather than discovered later.`,
    variables: [
      {
        name: 'feature_description',
        description:
          'What the feature does and the user-facing behavior it must have, stated concretely enough to plan from.',
        example:
          'Add a "save search" button on the results page that stores the current filters under a name and lists saved searches in the sidebar for the logged-in user.',
        required: true,
      },
      {
        name: 'files_in_scope',
        description:
          'The exact files or directories Agent mode is allowed to create or edit for this task.',
        example:
          'app/search/results/page.tsx, app/search/results/SavedSearches.tsx (new), lib/searches/store.ts (new), app/api/searches/route.ts (new)',
        required: true,
      },
      {
        name: 'data_contract',
        description:
          'The shape of data passed between the files above, stated explicitly so it stays consistent on both ends.',
        example:
          'SavedSearch = { id: string, name: string, filters: FilterState, createdAt: string }. The API route returns SavedSearch[]; the sidebar component takes searches: SavedSearch[] as a prop.',
        required: true,
      },
      {
        name: 'out_of_scope',
        description:
          'Adjacent files or systems that must not change even if the agent notices something related while working.',
        example:
          'Do not touch the existing filter-parsing logic in lib/search/parseFilters.ts, and do not modify the results table component itself.',
        required: true,
      },
      {
        name: 'codebase_conventions',
        description:
          "The existing patterns new code must match — naming, error handling, where types live — so the model doesn't default to generic patterns.",
        example:
          'API routes return { data, error } tuples, never throw across the route boundary. Shared types live in lib/types/, never inline in a component file. Errors are logged via lib/logger.ts, never console.log.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'agent-mode',
      'composer',
      'multi-file-edit',
      'feature-build',
      'scope-control',
      'codebase-conventions',
    ],
    whyItWorks:
      'Agent mode\'s usefulness on a multi-file feature comes directly from its ability to semantically search the whole indexed codebase and open whatever file looks relevant without being told the exact path — which is also exactly what makes it capable of touching five files you never mentioned, because "looks relevant" and "is in scope" are not the same test, and only a human brief can supply the second one. Naming FILES YOU MAY CREATE OR MODIFY converts an implicit assumption into a hard boundary the model can actually check itself against, and requiring a file-by-file plan before any edit lands means you see the blast radius as a list while it\'s still cheap to correct, not as an already-applied diff spread across the repo that has to be reverse-engineered back into scope. The DATA_CONTRACT field solves a different problem specific to multi-file agent work: the model writes the producer and the consumer of a shape in separate tool calls within the same session, and without a literal contract to check both sides against, a field silently renamed on one end (filters becomes filterState) leaves the other end stale while every individual file still looks internally correct — the kind of bug that a single-file review never catches because no single diff shows the mismatch. CODEBASE_CONVENTIONS earns its place because Cursor\'s underlying model has strong priors from its own training distribution about how a search feature or an API route "should" look, and those priors are frequently at odds with a specific codebase\'s actual house style; stating conventions explicitly overrides the model\'s default pattern-matching with the one pattern that actually matters here. Finally, requiring the model to report unfinished work by name rather than silently ship a partial implementation matters because a confident closing summary is the default output regardless of completeness — the brief has to ask for the gap explicitly, or it simply won\'t surface on its own.',
    exampleOutput: `Plan before editing:
1. lib/searches/store.ts (new) — SavedSearch type + storage adapter, following the { data, error } convention.
2. app/api/searches/route.ts (new) — GET/POST using the store, errors logged via lib/logger.ts.
3. app/search/results/SavedSearches.tsx (new) — renders searches, calls POST on save.
4. app/search/results/page.tsx (edit) — add the Save button, wire it to SavedSearches.

Proceeding in that order. Nothing outside the listed files touched — filter parsing and the results table untouched.

Summary:
- lib/searches/store.ts: added, satisfies "store the current filters under a name."
- app/api/searches/route.ts: added, satisfies "list saved searches" (GET) and the save action (POST).
- app/search/results/SavedSearches.tsx: added, satisfies "lists saved searches in the sidebar."
- app/search/results/page.tsx: edited only to add the Save button and mount the sidebar component.

Not completed: per-user scoping was described as "for the logged-in user" but no auth context is wired into this route group yet — flagging rather than guessing at an auth pattern that isn't there.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-05' }],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Cursor 2.2 Agent mode multi-file edits.',
      },
    ],
  },
  {
    slug: 'cursor-cmdk-scoped-inline-edit-brief',
    category: 'cursor',
    title:
      'Force Cmd+K to change only the highlighted lines, not the whole block around them',
    description:
      "A Cmd+K inline-edit instruction that states the transformation, an explicit byte-identical preserve list, and a fallback rule for when the transformation can't be done cleanly, tuned for the selection-scoped inline editor rather than a whole-file Agent pass.",
    promptText: `[Cmd+K on the selected block — this instruction applies only to the highlighted selection, not the surrounding file]

Transform only the selected code. Do not touch anything outside the highlight, and do not restyle, reindent, or rename anything inside it that the transformation itself doesn't require changing.

WHAT THE SELECTED CODE CURRENTLY DOES
{{selected_code_purpose}}

TRANSFORMATION
{{transformation}}

MUST STAY BYTE-IDENTICAL
{{preserve_list}}

CALLERS THAT DEPEND ON THIS BLOCK
{{callers_context}}

RULES
- Keep existing function and variable names, parameter order, and the surrounding formatting style unless the transformation explicitly requires changing one of them.
- If the transformation genuinely cannot be done without changing something listed under MUST STAY BYTE-IDENTICAL, stop and explain exactly why in one or two sentences instead of doing it anyway and hoping it goes unnoticed in review.
- If you need information about what's outside the selection to do this correctly — a type definition, an import, a sibling function's signature — say what you need rather than guessing at its shape and writing code that assumes it.
- Do not add error handling, logging, or comments beyond what the transformation itself calls for. A larger, more "complete" version of the block than what was asked for is still an out-of-scope change.

After the edit, state in one line whether every item under MUST STAY BYTE-IDENTICAL actually held, or name the one that didn't and why it was unavoidable.`,
    variables: [
      {
        name: 'selected_code_purpose',
        description:
          'A one- or two-sentence statement of what the highlighted block currently does, for anchoring intent.',
        example:
          'This function fetches a user by id and returns null if the id is missing or the fetch fails.',
        required: true,
      },
      {
        name: 'transformation',
        description:
          'The specific change to make to the selection — one transformation, stated concretely, not a bundle of unrelated changes.',
        example:
          'Add retry with exponential backoff (max 3 attempts, base delay 100ms) around the fetch call.',
        required: true,
      },
      {
        name: 'preserve_list',
        description:
          'Exact names, signatures, or return shapes that must not change as a side effect of the transformation.',
        example:
          'The function signature getUser(id: string): Promise<User | null> and its null-on-missing-id behavior.',
        required: true,
      },
      {
        name: 'callers_context',
        description:
          "How the result of this block is used elsewhere, so the model doesn't change a shape a caller relies on without knowing it.",
        example:
          'Called from three places: UserProfile.tsx checks for null to show a "not found" state, AdminPanel.tsx awaits it in a Promise.all with two other fetches, and a background job retries the whole call on any thrown error already.',
        required: false,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'cmd-k',
      'inline-edit',
      'selection-scoped',
      'targeted-refactor',
      'contained-change',
    ],
    whyItWorks:
      "Cmd+K's diff preview is scoped to the highlighted selection and a narrow band of surrounding context, which is a much smaller window than Agent mode's full-repo index — that narrowness is the whole point of using Cmd+K instead of Agent mode for a small change, but it also means Cmd+K's regeneration of the block is a full rewrite of that span, not a line-level patch, so nothing stops it from reformatting the entire selection while it's in there changing one thing unless it's told not to. Stating what the selected code currently does anchors intent for an editor that isn't reasoning over the rest of the file the way an Agent-mode pass would; without that anchor, a transformation instruction like \"add retry\" has no stated baseline behavior to preserve against, only the code's shape to infer it from. The MUST_STAY_BYTE_IDENTICAL list is the actual lever: it converts an implicit expectation — \"obviously keep the signature the same\" — into something checkable, which matters specifically for Cmd+K because a rewritten block that happens to change a return type or drop the null-check branch will still look plausible in the diff preview unless the reviewer is checking against a stated list rather than a general impression of \"looks right.\" CALLERS_CONTEXT closes a gap that's easy to miss precisely because Cmd+K's view is deliberately narrow: the model regenerating the selected function has no visibility into how its return value gets consumed three files away unless told, so a change that looks internally consistent — say, throwing instead of returning null on failure — can silently break a caller that was written assuming the old contract, and Cmd+K's scoped diff view will never surface that break because the caller file isn't part of what's being shown.",
    exampleOutput: `async function getUser(id: string): Promise<User | null> {
  if (!id) return null
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await fetchUser(id)
    } catch (err) {
      if (attempt === 2) throw err
      await sleep(2 ** attempt * 100)
    }
  }
  return null
}
// Signature and null-on-missing-id behavior held unchanged, as required.
// Note: caller AdminPanel.tsx uses Promise.all — a thrown error here after 3 failed
// attempts will now reject the whole Promise.all, same as its existing background-job
// retry path already assumed, so no caller behavior changes.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Cursor 2.2 Cmd+K inline edit.',
      },
    ],
  },
  {
    slug: 'cursor-bugbot-focused-pr-review-brief',
    category: 'cursor',
    title:
      'Point Cursor BugBot at the actual risk in a PR instead of a generic pass over the diff',
    description:
      "A PR description written for BugBot, Cursor's automated PR-review agent, that states risk areas and known trade-offs up front and defines exactly how findings must be classified and cited, so its comment thread concentrates on real logic and security risk instead of restating the diff or re-litigating a deliberate choice.",
    promptText: `PR SUMMARY
{{pr_summary}}

RISK AREAS TO FOCUS REVIEW ON
{{risk_areas}}

KNOWN TRADE-OFFS — do not flag these as bugs, they were a deliberate choice
{{known_tradeoffs}}

TEST COVERAGE ADDED IN THIS PR
{{test_coverage_notes}}

@BugBot review this PR against the risk areas above specifically. For each finding:
1. Cite the exact file and line.
2. Classify it as Bug, Security, or Style.
3. Rate it Blocking or Minor.
4. State whether the test coverage listed above would have caught it — if it would have, and the tests are passing, explain the contradiction rather than just flagging the risk in isolation.

Skip anything already listed under known trade-offs entirely. If you disagree with a trade-off on its merits, raise it as a Minor note explicitly labeled "disagreement with stated trade-off," not as a Blocking finding — a deliberate choice the author already made is not the same category of problem as a bug they didn't notice.

Do not restate what the diff already makes visible (a renamed variable, a moved function) as a finding. A finding without a specific failure scenario attached — an input, a state, or a sequence of calls that produces the wrong result — is not a finding; note it separately as an observation if it seems worth mentioning at all.

If the risk areas above turn out not to be where the actual problems are, say so directly instead of manufacturing a finding to justify the review having focused there.`,
    variables: [
      {
        name: 'pr_summary',
        description:
          'What this PR does, in plain language — the thing a reviewer needs before reading a single line of diff.',
        example:
          'Switches the checkout discount calculation from a flat percentage to a tiered table looked up by cart total.',
        required: true,
      },
      {
        name: 'risk_areas',
        description:
          'The specific parts of the change most likely to hide a real bug — named files, edge cases, or invariants.',
        example:
          'The boundary values between tiers (is $100.00 exactly tier 2 or tier 3?), and whether the old flat-percentage code path is fully removed or still reachable from the cart API.',
        required: true,
      },
      {
        name: 'known_tradeoffs',
        description:
          'Deliberate design choices in this PR that a reviewer, human or bot, might otherwise flag as a defect.',
        example:
          'Tier boundaries are hardcoded, not config-driven — intentional for this release; a follow-up ticket will move them to settings.',
        required: false,
      },
      {
        name: 'test_coverage_notes',
        description:
          'What the new/changed tests actually assert, so BugBot can reason about whether a finding is already covered.',
        example:
          'tiers.test.ts asserts exact-boundary behavior at $99.99/$100.00/$100.01, and one test for the removed flat-discount path returning a 404.',
        required: true,
      },
    ],
    targetTools: ['Cursor BugBot', 'Cursor 2.2'],
    tags: [
      'bugbot',
      'pr-review',
      'code-review',
      'automated-review',
      'github',
      'risk-triage',
    ],
    whyItWorks:
      'BugBot runs automatically against a PR\'s diff once enabled on a repo and posts inline comments without anyone writing a review prompt at all by default, which is exactly the problem this brief solves: with no steer, it reviews the whole diff at a uniform level of attention, and its comment thread ends up mixing genuine logic risk with restated-diff narration and style nits in no particular order, which trains reviewers to skim past the thread entirely after a few PRs of low signal. Naming RISK_AREAS concentrates its attention the same way a scoped rubric concentrates any LLM reviewer — it\'s told where the actual uncertainty in this change lives, rather than treating every changed line as equally suspicious, which matters because an automated reviewer with no steer tends to spend equal words on a renamed variable and a genuine boundary-condition bug. KNOWN_TRADEOFFS suppresses the single most common false-positive pattern in automated PR review: a deliberate simplification gets flagged as a defect because the reviewer has no way to distinguish an oversight from a choice, and downgrading disagreement to an explicitly labeled Minor note rather than a Blocking finding means a legitimate design debate doesn\'t block a merge that both the author and BugBot might actually be right about, just from different priorities. The requirement to check findings against TEST_COVERAGE_NOTES adds a layer most review prompts skip entirely: it forces BugBot to reconcile "tests are passing" with "here is a bug," which either surfaces a real gap in the tests (they claim to cover the boundary but don\'t actually assert what they claim to) or catches BugBot manufacturing a finding for a case that\'s already provably handled — a specific check against a specific failure mode of automated review, not a generic instruction to "be thorough."',
    exampleOutput: `BugBot findings:
1. checkout/pricing/tiers.ts:34 — Bug, Blocking. Tier lookup uses cartTotal > threshold, so a cart total of exactly $100.00 falls into tier 1, not tier 2 as the PR summary implies. tiers.test.ts asserts $100.00 as tier 2 but the test currently passes because the fixture cart total is actually $100.01 — the boundary case is not really covered despite the test name claiming it is.
2. checkout/pricing/legacy.ts:12 — Bug, Blocking. calculateFlatDiscount is still exported and still called from api/cart/quote.ts, so the old code path you asked me to check is in fact still reachable. No test covers this call site.
3. checkout/pricing/tiers.ts:8 — disagreement with stated trade-off, Minor. Hardcoded tier boundaries are noted as intentional, but the follow-up ticket referenced isn't linked anywhere in this PR or its description.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-30' }],
    changelog: [
      {
        date: '2026-07-30',
        note: "Initial publish, verified against Cursor BugBot's GitHub PR integration on Cursor 2.2.",
      },
    ],
  },
  {
    slug: 'cursor-background-agent-async-task-brief',
    category: 'cursor',
    title: 'Write a Background Agent brief that survives running with nobody watching',
    description:
      "A self-contained task brief for Cursor's Background Agents — the async, remote-run agent mode — with success criteria, a conservative-default policy for ambiguity, and a reviewable-PR requirement, since no one answers follow-up questions while it works in an isolated container.",
    promptText: `BACKGROUND AGENT TASK

This runs unattended in a remote, isolated environment. No one is present to answer follow-up questions while you work — resolve ambiguity by choosing the most conservative option and documenting the choice in your final summary, rather than pausing to ask a question that will never be answered.

TASK
{{task_description}}

SUCCESS CRITERIA — the task is only done when every one of these is true
{{success_criteria}}

CHECK-IN POINTS — pause and report progress at these milestones, but keep working past them unless a later run explicitly tells you to stop
{{checkin_points}}

REPOSITORY ACCESS AND ENVIRONMENT NOTES
{{environment_notes}}

RULES FOR UNATTENDED WORK
- Commit in small, reviewable increments with descriptive messages, not one giant commit at the end that has to be reverse-engineered into individual decisions during review.
- If you hit a blocker none of the success criteria resolve, stop, write down exactly what you tried, why it failed, and what information would unblock it — then leave the branch in a working, buildable state rather than half-finished with a broken build.
- Do not install, upgrade, or remove a dependency that isn't required by the task description without flagging it explicitly in a commit message and the final summary.
- Open a draft PR when finished, with a summary of every decision you made without being able to ask, organized so it can be reviewed in one pass rather than reconstructed from individual commits.
- If the task description and success criteria conflict with each other at any point, treat the success criteria as authoritative and note the conflict — don't silently pick whichever reading is easier to implement.

Before finishing, re-read the success criteria one more time against what actually shipped and state, item by item, whether each one holds.`,
    variables: [
      {
        name: 'task_description',
        description:
          'The full task, stated with enough detail to start without a clarifying question.',
        example:
          'Migrate all remaining class components in src/components/legacy/ to function components with hooks, preserving existing prop interfaces exactly.',
        required: true,
      },
      {
        name: 'success_criteria',
        description:
          'A checklist that defines done, since no one is present to say "looks good, keep going."',
        example:
          '1. Zero class components remain under src/components/legacy/. 2. Existing prop types are unchanged. 3. Full test suite passes. 4. No new console warnings in dev mode.',
        required: true,
      },
      {
        name: 'checkin_points',
        description:
          'Natural progress milestones to report at, even though the agent should keep going past them.',
        example:
          'After every 5 components migrated, and immediately if any existing test starts failing.',
        required: true,
      },
      {
        name: 'environment_notes',
        description:
          'Anything about the remote environment that differs from a local dev setup and could silently break the run.',
        example:
          'The remote container has no access to the .env.local secrets used for the third-party image CDN — any component that calls it should be mocked in tests, not skipped.',
        required: true,
      },
    ],
    targetTools: ['Cursor Background Agents', 'Cursor 2.2'],
    tags: [
      'background-agents',
      'async-agent',
      'long-running-task',
      'unattended-agent',
      'remote-agent',
    ],
    whyItWorks:
      'Background Agents run in an isolated, cloud-provisioned checkout disconnected from your live editor session and execute asynchronously, which removes the entire back-and-forth clarification loop a live Agent-mode session gets for free — you notice mid-turn that it\'s about to do something wrong and say so before it commits to the wrong path. None of that exists here, so the brief has to front-load every decision point that would normally get resolved in chat, which is why "resolve ambiguity conservatively and document the choice" is doing real load-bearing work: it substitutes a standing policy for the live human judgment call that simply isn\'t available, rather than leaving the agent to either guess silently or stall waiting on an answer that will never arrive. SUCCESS_CRITERIA plays the equivalent substitute role for the human "yes, that\'s right, keep going" signal a synchronous session provides implicitly on every turn. ENVIRONMENT_NOTES exists because a remote container is not a copy of your local machine with the same secrets, mounted drives, or running services, and an agent that discovers a missing credential mid-task by trial and error will burn its unattended run time on retries or silently skip the affected code path rather than surfacing the actual constraint — naming the gap up front turns a debugging dead end into a known boundary condition. Requiring small, descriptive commits and a draft PR at the end matches how the output is actually consumed: you review it as a diff or a PR afterward, asynchronously, not as a live edit stream you\'re watching in real time, so the deliverable has to already be shaped for after-the-fact review rather than reconstructed into that shape once the run is over and the reasoning behind each change has to be inferred from the final state alone.',
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-02' }],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Cursor 2.2 Background Agents.',
      },
    ],
  },
  {
    slug: 'cursor-agent-checkpoint-rollback-brief',
    category: 'cursor',
    title:
      "Turn Cursor's Agent-mode checkpoints into a real rollback plan for a risky refactor",
    description:
      'A refactor brief that breaks a risky change into checkpoint-sized steps and tells the agent to stop and name the last good checkpoint on failure — instead of patching a bad step with a second speculative fix — plus a named rollback trigger phrase for mid-session use.',
    promptText: `REFACTOR GOAL
{{refactor_goal}}

Break this into the smallest steps that each leave the codebase working and independently checkpointable. Treat each of the following as a checkpoint boundary — after completing each one, pause, report what changed and what you verified, and wait for acknowledgment before continuing to the next:
{{risky_steps}}

VERIFICATION AT EACH CHECKPOINT
{{verification_method}}

If a step fails verification, do not patch around it with a second speculative change layered on top. Stop, name the last good checkpoint by its step number, describe exactly what went wrong and what you observed, and wait — do not attempt a fix-forward on your own initiative once a step has already failed once.

ROLLBACK SIGNAL
If I say "{{rollback_signal}}" at any point, treat it as an unambiguous instruction to stop immediately, tell me exactly what to roll back to relative to the last acknowledged checkpoint, and take no further action until told otherwise. Do not interpret it as feedback to fix forward, and do not treat any other phrasing as equivalent to it, even something that sounds similar — this exact phrase is the only trigger.

BUDGET
{{step_budget}}

If you're about to exceed the step budget before reaching the refactor goal, stop at the next checkpoint and report that explicitly rather than continuing past it assuming it doesn't matter.`,
    variables: [
      {
        name: 'refactor_goal',
        description:
          'The end state of the refactor, described as an outcome, not a list of mechanical steps.',
        example:
          'Replace the three separate date-formatting utilities with one shared formatDate function, no behavior change anywhere it is used.',
        required: true,
      },
      {
        name: 'risky_steps',
        description:
          'The specific sub-steps most likely to break something, in the order you want them attempted.',
        example:
          '1. Write the unified formatDate covering all existing format strings. 2. Swap callers in src/reports/ first (lowest traffic). 3. Swap callers in src/dashboard/ (highest traffic, do last).',
        required: true,
      },
      {
        name: 'verification_method',
        description:
          'How the agent should confirm a step actually worked before calling it a good checkpoint.',
        example:
          'Run the existing date-formatting test suite (npm test -- date) and manually diff three sample outputs against the old function for each swapped caller.',
        required: true,
      },
      {
        name: 'rollback_signal',
        description:
          'The exact phrase you will use mid-session to trigger an immediate stop-and-rollback instruction.',
        example: 'roll it back',
        required: true,
      },
      {
        name: 'step_budget',
        description:
          "A rough ceiling on scope so the agent doesn't keep expanding a checkpointed refactor indefinitely.",
        example:
          'No more than 6 checkpoint steps total — if the dashboard callers alone need more than 2 steps, stop and report before splitting further.',
        required: false,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: ['checkpoints', 'rollback', 'refactor', 'agent-mode', 'safety-net'],
    whyItWorks:
      'Agent mode checkpoints the workspace after each turn, so you can roll back to before a specific edit without discarding the whole session — but that safety net is only as useful as the granularity of the steps between checkpoints and how quickly a bad one gets caught. Breaking the refactor into named RISKY_STEPS gives you several small checkpoint boundaries to actually roll back to instead of one large diff where checkpoint granularity is worthless because the whole change landed in a single turn — a checkpoint before and after one 40-file diff isn\'t a safety net, it\'s a coin flip. The instruction to stop and name the last good checkpoint on failure, rather than patch around it, targets a specific and well-documented agent tendency: once an edit doesn\'t work, the model\'s default next move is a second corrective change layered on top of the first rather than a clean rollback, and every layer on top makes the eventual rollback point harder to identify and the accumulated diff harder to review as a single decision. VERIFICATION_METHOD matters because "safe to checkpoint" is meaningless without a stated bar for what counts as verified — without it, the agent\'s own confidence that a step worked is the only signal, and that confidence is exactly what\'s unreliable enough to need a checkpoint system in the first place. Naming a literal ROLLBACK_SIGNAL phrase gives you a one-word interrupt that unambiguously means stop and undo, distinct from any other correction you might type mid-session — a plain "that\'s not right" is genuinely ambiguous between "fix it" and "undo it," and an agent mid-edit will default to the interpretation that lets it keep working rather than the one that stops it.',
    exampleOutput: `Step 1 complete: unified formatDate written in src/lib/date.ts, covers all 4 format strings found. Verification: npm test -- date passes (12/12). Safe to checkpoint here — waiting for acknowledgment.

Step 2 complete: swapped 3 callers in src/reports/. Verification: same test suite passes; manually diffed sample outputs for all 3 callers against the old function, identical. Safe to checkpoint here.

Step 3: swapping callers in src/dashboard/ — verification failed. DashboardHeader.tsx passed a Date object where the other callers passed an ISO string; formatDate assumed string input and threw.

Stopping here rather than patching formatDate to silently accept both types. Last good checkpoint: end of Step 2. Waiting for direction.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-06' }],
    changelog: [
      {
        date: '2026-08-06',
        note: "Initial publish, verified against Cursor 2.2's Agent-mode checkpoint/rollback behavior.",
      },
    ],
  },
  {
    slug: 'cursor-multiroot-workspace-package-boundary-brief',
    category: 'cursor',
    title:
      'Tell Cursor which package actually owns a change in a multi-root monorepo workspace',
    description:
      "A context brief for Cursor's multi-root workspace support that names the owning package, treats sibling packages as read-only context, and states shared-file boundaries, so semantic search across the flattened index doesn't cross package lines while looking for a similarly named symbol.",
    promptText: `This workspace has multiple roots open at once, and the codebase index treats them as one searchable space by default. Before editing anything, confirm which root and package this change actually belongs in.

OWNING PACKAGE FOR THIS CHANGE
{{owning_package}}

SIBLING PACKAGES IN THIS WORKSPACE — context only, do not edit these
{{sibling_packages}}

SHARED FILES / ROOT-LEVEL BOUNDARY RULES
{{shared_files_boundary}}

PACKAGE-SCOPED COMMANDS TO USE
{{scoped_commands}}

RULES
- Make all edits inside the owning package unless a shared file must change to satisfy the task — if so, name the shared file explicitly and ask before editing it, even if the change looks trivial.
- If a symbol, type, or utility you need already exists in a sibling package, import it from there. Do not redefine or fork a local copy inside the owning package, even if that seems faster or avoids adding a cross-package dependency — say if importing it would require adding one, and ask first.
- Don't run a workspace-wide build, lint, or test command when a package-scoped equivalent exists. Use the commands named above and state exactly which one you ran and against which package.
- If the semantic search for "where does X live" surfaces a same-named symbol in more than one package, stop and confirm which one is actually relevant before assuming it's the one in the owning package.

Before finishing, state explicitly whether any shared or root-level file was touched, and if so, why it was unavoidable given the task.`,
    variables: [
      {
        name: 'owning_package',
        description: 'The specific package/root this change belongs to.',
        example: 'packages/checkout-service',
        required: true,
      },
      {
        name: 'sibling_packages',
        description:
          'Other packages open in the same workspace that provide context but should not be edited.',
        example: 'packages/shared-ui, packages/payments-sdk, packages/admin-dashboard',
        required: true,
      },
      {
        name: 'shared_files_boundary',
        description:
          'Which shared/root-level files are off-limits or require explicit confirmation before editing.',
        example:
          'pnpm-workspace.yaml and the root tsconfig.base.json are off-limits without asking first. packages/shared-ui/src/index.ts (the public export list) requires confirmation before adding new exports.',
        required: true,
      },
      {
        name: 'scoped_commands',
        description:
          'The package-scoped build/lint/test commands to use instead of workspace-wide ones.',
        example:
          'pnpm --filter checkout-service test, pnpm --filter checkout-service lint, pnpm --filter checkout-service build',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'multi-root-workspace',
      'monorepo',
      'context-briefing',
      'package-boundaries',
      'agent-mode',
    ],
    whyItWorks:
      "Multi-root workspace support means Cursor's indexer sees several package roots at once and its semantic code search treats that as one searchable space by default — that's the point of the feature for cross-package navigation, but it also means a similarly named file or function in another root is a plausible edit target unless the agent is explicitly told which root actually owns this specific change. Without OWNING_PACKAGE stated up front, a \"closest semantic match\" search across roots can surface a same-named helper in a sibling package as the thing to modify, or the model can duplicate a type that already exists in a package it was never told to treat as read-only, producing two divergent copies of the same concept that will silently drift apart the moment one gets updated and the other doesn't. Naming shared-file boundaries closes a second, more damaging gap: monorepo root config — workspace manifests, base tsconfig, a shared package's public export list — affects every package silently and simultaneously, so an edit there is exactly the kind of change that should never happen without an explicit ask, even though nothing in a narrowly scoped task description would obviously exclude it from an agent reasoning purely from \"what files need to change to make this work.\" Requiring package-scoped commands over workspace-wide ones prevents a slower but real failure mode where a workspace-level test run silently exercises and reports on packages the change never touched, producing a results summary that looks like broader verification happened when it actually just added noise and runtime without adding signal. The explicit stop-and-confirm rule for ambiguous same-named symbols matters because that ambiguity is invisible from inside a single search result — the agent sees one plausible match per package and has no built-in reason to suspect there's a second one worth checking unless told the possibility exists.",
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-24' }],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Cursor 2.2 multi-root workspace support in a pnpm monorepo.',
      },
    ],
  },
  {
    slug: 'cursor-design-mock-component-brief',
    category: 'cursor',
    title:
      'Turn a pasted design screenshot into a component built from your existing design system',
    description:
      "A brief for pasting a screenshot or Figma export into Cursor's chat or Agent mode that locks the output to your existing component primitives and design tokens, names the interactions a static image can't show, and forces the model to flag anything it interpreted rather than measured.",
    promptText: `I'm attaching a design mock (screenshot/image). Build this as a component in this codebase, not a plausible-looking reimplementation from scratch.

WHAT THE MOCK SHOWS
{{mock_description}}

USE THESE EXISTING PRIMITIVES — do not invent new ones or pull in a new UI library
{{component_library}}

RESPONSIVE BREAKPOINTS TO MATCH
{{breakpoints}}

INTERACTIONS NOT VISIBLE IN A STATIC MOCK
{{interaction_notes}}

ACCESSIBILITY REQUIREMENTS
{{accessibility_notes}}

Match spacing, type scale, and color to what's visible in the image as closely as this codebase's existing tokens allow. If an exact match requires a new token or a one-off value not covered by an existing one, name it explicitly and ask rather than hardcoding a raw hex code or pixel value that will drift from the rest of the system the next time it's touched.

Compose the component from the primitives listed above wherever they cover what the mock shows. If the mock shows something none of the listed primitives can produce — a layout pattern, a variant, a piece of visual treatment — say so explicitly rather than silently writing custom markup that happens to look right in isolation while bypassing the design system entirely.

When done, list every part of the mock you interpreted rather than measured exactly — a color that fell between two existing tokens, a spacing value estimated from the image rather than read from a spec — so it can be checked against the source file by whoever has access to it.`,
    variables: [
      {
        name: 'mock_description',
        description:
          'What the mock shows in words, in case the image is ambiguous, cropped, or missing a state.',
        example:
          'A pricing card with a plan name, price, a bulleted feature list, and a CTA button, in a 3-column row on desktop.',
        required: true,
      },
      {
        name: 'component_library',
        description: 'The existing primitives to build from, named exactly.',
        example:
          'Card, Button (variant="primary"), Badge, and the spacing scale in tailwind.config.ts — no other npm UI package.',
        required: true,
      },
      {
        name: 'breakpoints',
        description:
          'The breakpoints this component needs to work at, since a static mock usually only shows one.',
        example:
          'Desktop (3-column) at 1024px+, tablet (2-column) at 640-1023px, mobile (1-column, stacked) below 640px.',
        required: true,
      },
      {
        name: 'interaction_notes',
        description:
          "Hover states, loading states, or click behavior the static image can't show.",
        example:
          'Hover raises the card with a subtle shadow; clicking the CTA shows a loading spinner in the button for at least 400ms before navigating.',
        required: false,
      },
      {
        name: 'accessibility_notes',
        description: 'Specific a11y requirements the mock alone would never communicate.',
        example:
          'CTA button must be reachable by keyboard tab order, price must have an aria-label including the billing period, and color contrast must meet WCAG AA against the card background.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'design-to-code',
      'mock-to-component',
      'multimodal',
      'design-system',
      'agent-mode',
      'accessibility',
    ],
    whyItWorks:
      'Cursor\'s chat and Agent mode accept image attachments and reason over them multimodally, but a static image can\'t convey which of your existing components a given element should map to, what happens on hover, or whether a color is an exact token match or a close approximation — without being told, the model defaults to writing new one-off markup and inline styles that happen to look right against the screenshot in isolation while ignoring every primitive your design system already has, because pixel-matching a flat image is a fundamentally different task from composing from a component library, and nothing in the image itself signals which one it\'s supposed to be doing. Naming COMPONENT_LIBRARY explicitly turns "build this" into "compose this from what already exists," which is the actual difference between a component that matches the mock today and one that also matches the rest of the app after the next design-token update. ACCESSIBILITY_NOTES exists because a design mock is a visual artifact and structurally cannot encode keyboard behavior, ARIA labeling, or contrast requirements — an agent working from the image alone has no signal that any of that matters unless told, and a component that\'s visually correct but keyboard-untestable will pass a design review and fail an accessibility audit weeks later. Requiring it to flag any hardcoded value it invented — a one-off hex, a pixel value with no token behind it — surfaces exactly the gap between "looks right against the screenshot" and "fits the actual design system," which is where mock-to-code output usually drifts silently until a design review or a later refactor catches a value nobody remembers adding and nobody can trace back to a decision.',
    exampleOutput: `Built PricingCard using Card, Button, and Badge from your library. Spacing uses the existing gap-4/gap-6 scale; type uses text-lg/font-semibold for the price, matching your existing Heading styles. CTA button is a native <button> inside Button, keyboard-focusable by default; price span has aria-label="$49 per month".

Flagged for review: the mock's price text appears to be a slightly darker gray than any existing text-* token in tailwind.config.ts — used text-slate-700 (closest existing token) rather than inventing a new shade. Please confirm against the source file if exact match matters here.

Breakpoints implemented: grid-cols-3 at lg:, grid-cols-2 at sm:, grid-cols-1 below that, per the stated ranges.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-27' }],
    changelog: [
      {
        date: '2026-07-27',
        note: "Initial publish, verified against Cursor 2.2's multimodal chat/Agent-mode image input.",
      },
    ],
  },
  {
    slug: 'cursor-agent-spec-driven-test-brief',
    category: 'cursor',
    title:
      "Have Cursor's Agent mode write tests against the spec, not against whatever the code already does",
    description:
      'An Agent-mode brief for generating tests against documented behavior rather than the implementation as found, with a forced tripwire requiring the model to prove each test would actually fail if the behavior broke, so a passing suite means something.',
    promptText: `Write tests for {{module_to_test}} using {{test_framework}}. Work in Agent mode: read the implementation yourself, but write tests against the expected behavior below — not against whatever the code currently happens to do if the two disagree. Flag any disagreement between the two instead of silently encoding the current behavior as correct just because it's what's there.

BEHAVIOR THIS MODULE MUST GUARANTEE
{{behaviors_to_cover}}

EDGE CASES TO COVER EXPLICITLY
{{edge_cases}}

EXISTING TEST CONVENTIONS IN THIS CODEBASE
{{test_conventions}}

RULES
- Every test must fail if the corresponding behavior breaks. Before finishing, pick one test per behavior and describe the specific code change that would make it fail, to prove it isn't vacuous.
- Do not mock the function under test itself.
- Do not write a test that only asserts a function was called — assert on its actual output or side effect, since a called-with assertion alone would still pass even if the real logic underneath were deleted.
- If two of the edge cases above turn out to be handled by the exact same code path, say so instead of writing two tests that will always pass or fail together and calling that two units of coverage.
- Follow the existing test conventions given above exactly — file naming, setup/teardown pattern, assertion style — rather than introducing a second convention alongside the first one in the same codebase.
- If a behavior in the list is genuinely untestable without a change to the module itself (a hidden dependency, no seam to inject a fake), say so explicitly rather than writing a test that looks like it covers it but actually tests something adjacent.`,
    variables: [
      {
        name: 'module_to_test',
        description: 'The file, function, or module to write tests for.',
        example: 'lib/pricing/applyDiscount.ts',
        required: true,
      },
      {
        name: 'test_framework',
        description: 'The test runner and assertion style already used in this codebase.',
        example: 'Vitest with @testing-library conventions',
        required: true,
      },
      {
        name: 'behaviors_to_cover',
        description:
          'The intended, documented behavior — not just "whatever it does now."',
        example:
          'Applies a percentage discount, clamps the result at $0 minimum, and never discounts an already-free item further.',
        required: true,
      },
      {
        name: 'edge_cases',
        description:
          'Specific boundary conditions that intended behavior must handle correctly.',
        example:
          'Discount of exactly 100%, discount over 100%, negative price input, discount applied to a $0 item.',
        required: true,
      },
      {
        name: 'test_conventions',
        description:
          "This codebase's existing test file naming, setup pattern, and assertion style, so new tests fit in rather than forming a second style.",
        example:
          'Test files live alongside source as *.test.ts, use describe/it blocks, and prefer toStrictEqual over toEqual for object comparisons.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: ['test-generation', 'agent-mode', 'tdd', 'regression-testing', 'edge-cases'],
    whyItWorks:
      'Agent mode reads the implementation before writing tests, which creates a specific and well-documented failure mode: it\'s easy for a model to generate assertions that mirror the current implementation\'s exact behavior rather than the intended behavior, which lets a test suite pass at a high coverage percentage while encoding a live bug as "correct" permanently, since every future run confirms the bug is still there instead of catching it. Separating BEHAVIORS_TO_COVER from "go read the implementation" forces a comparison between intent and code instead of a transcription of one into the other, and explicitly asking it to flag disagreement gives it permission to say the code is wrong rather than assume the code is the spec by default, which is the model\'s natural resting assumption when no other source of truth is given. TEST_CONVENTIONS matters for a reason specific to agent-generated test suites rather than human-written ones: a model given no existing style to match will default to whatever pattern is most common in its own training distribution, which produces a second test-writing convention living alongside the codebase\'s actual one, and a codebase with two test styles is measurably harder for a human to scan for what\'s actually being asserted, since the reader has to first figure out which dialect a given file is written in before evaluating whether it\'s correct. The "describe what would make this test fail" step is a concrete tripwire against the single most common form of AI-generated test padding — an assertion that a mock was called, which adds a line of coverage-percentage without adding any actual regression protection, since it would still pass if the real logic were deleted entirely and replaced with a stub that just called through.',
    exampleOutput: `describe('applyDiscount', () => {
  it('clamps at $0 minimum even with discount over 100%', () => {
    expect(applyDiscount(10, 150)).toBe(0)
  })
  // Fails if the clamp is removed or changed to Math.max(-Infinity, ...) —
  // verified by temporarily removing the clamp and confirming it returns -5.

  it('never further discounts an already-free item', () => {
    expect(applyDiscount(0, 50)).toBe(0)
  })
})

Flag: edge cases "discount of exactly 100%" and "discount over 100%" both hit the same clamp branch in the current implementation — written as one parameterized test, not two, since they'd always pass or fail together.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-21' }],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Cursor 2.2 Agent mode with Vitest.',
      },
    ],
  },
  {
    slug: 'cursor-staged-dependency-upgrade-brief',
    category: 'cursor',
    title:
      "Run a major dependency upgrade through Cursor's Agent mode in triage-migrate-verify stages",
    description:
      'A staged upgrade brief that requires triage of every affected API usage against a stated breaking-changes list before any file changes, so the blast radius gets reviewed as a plan rather than discovered after the fact spread across dozens of already-applied edits.',
    promptText: `Upgrade {{package_name}} from {{current_version}} to {{target_version}} across this codebase. Do this in three explicit stages and stop between each for confirmation before continuing to the next — do not collapse these into one pass even if the changes look small.

STAGE 1 — TRIAGE
Search the codebase for every usage of {{package_name}}'s APIs. Cross-reference against these known breaking changes and report which usages are affected, and which are not, before changing anything:
{{breaking_changes_notes}}

STAGE 2 — MIGRATE
Only after triage is confirmed: update the dependency version and migrate each affected usage found in Stage 1. Do not touch files that only import the package without using an affected API, even if you notice something you'd personally write differently while you're in there.

STAGE 3 — VERIFY
Run the build, typecheck, and test suite: {{verification_commands}}. If anything fails that Stage 1 did not predict, stop and report it as a gap in the triage rather than silently patching around it — a failure the triage missed is information about what the breaking-changes list was missing, not just a bug to fix and move past.

ROLLBACK PLAN IF STAGE 3 FAILS BADLY
{{rollback_plan}}

Do not upgrade any other dependency as a side effect, even a peer dependency the package manager suggests bumping, without naming it and asking first.`,
    variables: [
      {
        name: 'package_name',
        description: 'The dependency being upgraded.',
        example: 'react-router-dom',
        required: true,
      },
      {
        name: 'current_version',
        description: 'The version currently installed.',
        example: '6.22.0',
        required: true,
      },
      {
        name: 'target_version',
        description: 'The version to upgrade to.',
        example: '7.1.0',
        required: true,
      },
      {
        name: 'breaking_changes_notes',
        description:
          "Known breaking changes from the changelog/migration guide, pasted or summarized — the model's triage is only as good as what it's told to check for.",
        example:
          "useNavigate's replace option moved into a NavigateOptions object; <Switch> was removed in favor of nested <Routes>; loader/action data APIs changed shape.",
        required: true,
      },
      {
        name: 'verification_commands',
        description:
          'The exact commands to run for Stage 3, so verification is checkable rather than "run the tests" left vague.',
        example: 'npm run build, npm run typecheck, npm test -- --run',
        required: true,
      },
      {
        name: 'rollback_plan',
        description:
          'What to do if verification fails in a way that suggests the upgrade should be reverted rather than patched through.',
        example:
          'Revert the dependency version bump and all Stage 2 file changes via git, leave a note in the PR describing what failed, and stop rather than attempting a partial upgrade.',
        required: false,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'dependency-upgrade',
      'agent-mode',
      'migration',
      'breaking-changes',
      'staged-rollout',
    ],
    whyItWorks:
      'An unscoped "upgrade this package" request in Agent mode tends to bump the version number and then start editing whatever breaks at typecheck time, which quietly conflates two very different categories of change: code the migration guide says must change, and code that merely needs a type assertion or a cast to compile without actually being correct against the new API\'s real behavior. Forcing a triage-then-confirm gate before any file is touched means the blast radius gets reviewed while it\'s still a list of usages with a stated affected/not-affected verdict, not after it\'s already a diff applied across dozens of files under the pressure of "the build is currently broken, let\'s just fix it" — a pressure that reliably produces the second category of change, the compiles-but-wrong kind, because fixing a type error is a different and easier task than correctly implementing a changed API contract. Treating a Stage 3 failure the triage didn\'t predict as a reportable gap, rather than something to patch around silently, catches breaking changes that weren\'t in BREAKING_CHANGES_NOTES in the first place — a real and common risk, since migration-guide breaking-changes lists are routinely incomplete for edge-case APIs or interactions between two changed features, and an agent whose only instruction is "make the error go away" will hide exactly the case you most needed to know about by patching it invisibly during Stage 2 review. VERIFICATION_COMMANDS stated explicitly, rather than "run the tests," matters because a vague verification instruction lets the model choose the scope of what counts as passing — running only the affected test files instead of the full suite, for instance — which quietly narrows what "verified" means without anyone deciding that on purpose.',
    exampleOutput: `STAGE 1 — TRIAGE
Found 14 usages of react-router-dom across 9 files.
- 3 usages of useNavigate with a { replace: true } second argument — AFFECTED (API shape changed).
- 1 usage of <Switch> in src/App.tsx — AFFECTED (removed in v7, needs <Routes>).
- 10 usages of <Link>/<Route> with no changed props — NOT AFFECTED.

Awaiting confirmation before Stage 2.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-29' }],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Cursor 2.2 Agent mode on a react-router-dom v6-to-v7 upgrade.',
      },
    ],
  },
  {
    slug: 'cursor-composer-scope-creep-self-audit-brief',
    category: 'cursor',
    title:
      "Make Cursor's Agent mode audit its own diff for scope creep before you review it",
    description:
      "A post-edit review prompt that has the agent re-check every file it just touched against the original brief, itemizing an UNREQUESTED label for anything it can't cite the brief to justify, catching incidental reformatting hidden inside an otherwise legitimate multi-file diff.",
    promptText: `Re-read every change you just made across every file in this session against the original brief below. Don't trust your memory of what you intended to do — actually diff each file against its state before you started editing.

ORIGINAL BRIEF
{{original_brief}}

FILES TOUCHED THIS SESSION
{{files_touched}}

For every file you touched, answer:
1. What changed, in one line.
2. Which part of the brief this satisfies — quote it directly, word for word. If you can't quote a specific part, that's the signal, not a formality to skip past.
3. If you can't point to a part of the brief that required this change, mark it UNREQUESTED and explain why you made it anyway.

Then answer directly:
- Did you touch any file not implied by the brief at all?
- Did you change formatting, imports, or unrelated lines in a file you were already editing for a legitimate reason? List those separately — they still count as scope creep even inside a file you had a real reason to open, and they're the easiest kind to miss in a normal skim of the diff.
- Did you make any change that's technically an improvement but wasn't asked for — a rename, a small optimization, an added comment? Improvement is not the same test as requested; list it under UNREQUESTED regardless of whether it's good.

End with one verdict: SCOPE CLEAN, or SCOPE CREEP with the full file list and reasons.`,
    variables: [
      {
        name: 'original_brief',
        description:
          'The exact original instruction given for this session, pasted back in verbatim for comparison.',
        example:
          'Add pagination to the /api/orders endpoint using limit/offset query params, default limit 20, max limit 100. Do not change the response shape for existing fields.',
        required: true,
      },
      {
        name: 'files_touched',
        description:
          "The list of files the session actually edited, if you have it from the diff view — gives the audit a starting checklist instead of relying on the model's own recollection.",
        example: 'app/api/orders/route.ts, lib/orders/types.ts',
        required: false,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: ['agent-mode', 'self-review', 'diff-audit', 'scope-creep', 'code-review'],
    whyItWorks:
      'This converts the same self-check Cursor\'s own checkpoint diff view already gives you visually into a forced, itemized comparison, instead of a skim of a colored diff panel across a dozen files where a reformatted block reads as noise rather than as a decision that needs justifying. Asking the model to cite a specific quoted piece of the brief for every changed file makes it much harder for an incidental reformat or an adjacent "while I was in there" cleanup to hide inside a large multi-file diff, because there\'s no clause in the brief to point to for "also reformatted the imports in an unrelated file" — the citation requirement has nowhere to attach for that kind of change, which is exactly what surfaces it. The UNREQUESTED label matters specifically because a model asked generically "did you do anything you shouldn\'t have" will almost always say no — that\'s a leading question with an easy denial available, since "shouldn\'t have" invites a judgment call the model can resolve in its own favor. Forcing it to attempt a citation for every single file first, and only fall back to UNREQUESTED when no citation exists, produces an actual audit trail instead of a reflexive assurance. The explicit "improvement is not the same test as requested" instruction closes the specific rationalization an agent reaches for once it\'s flagged an unrequested change: framing a rename or a small optimization as obviously good, which is a different and easier question than whether it was in scope, and answering the easier question is how scope creep gets waved through in review even by a human reviewer who should know better.',
    exampleOutput: `1. api/orders/route.ts — added limit/offset parsing with defaults 20/max 100. Satisfies: "using limit/offset query params, default limit 20, max limit 100."
2. api/orders/route.ts — also reformatted the existing error-handling block (indentation, added blank lines) while adding the pagination logic. UNREQUESTED — no part of the brief called for reformatting existing code; this happened while editing the same function.
3. lib/orders/types.ts — added a PaginationParams type. Satisfies: implied by "limit/offset query params" needing a typed shape, though not stated explicitly — noting this is an inference, not a direct quote.

Files not implied by the brief: none.
Formatting/import changes in a file opened for a legitimate reason: yes, item 2 above.
Unrequested "improvements": none beyond item 2.

Verdict: SCOPE CREEP — api/orders/route.ts (unrequested reformatting of the error-handling block).`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-07' }],
    changelog: [
      {
        date: '2026-08-07',
        note: "Initial publish, verified against Cursor 2.2 Agent mode's post-edit self-review behavior.",
      },
    ],
  },
  {
    slug: 'cursor-agent-measure-before-optimize-brief',
    category: 'cursor',
    title: "Require Cursor's Agent mode to measure a slow path before it proposes a fix",
    description:
      "A measure-diagnose-fix brief that requires the agent to instrument and get real numbers on a slow code path before proposing any optimization, so a confident-sounding fix can't ship for a bottleneck that was never actually located, and any temporary instrumentation gets removed before the change is called done.",
    promptText: `SYMPTOM
{{slow_symptom}}

Before proposing or making any change, locate the actual bottleneck. Do not optimize based on what looks slow by code inspection alone — plausible does not mean confirmed.

SUSPECTED AREA — a starting point only, not a conclusion
{{suspected_area}}

MEASUREMENT METHOD
{{measurement_method}}

BASELINE TO BEAT
{{baseline_target}}

STAGE 1 — MEASURE
Add the minimal instrumentation needed to get real numbers for the suspected area and any adjacent code on the same request path — not just the one function you suspect, since the actual bottleneck is often a step upstream or downstream of it. Report actual measured timings or allocation counts, not estimates or descriptions of what "should" be slow.

STAGE 2 — DIAGNOSE
State which specific line or call is responsible for the majority of the measured time, backed directly by the Stage 1 numbers. If the suspected area was not actually the bottleneck, say so explicitly rather than quietly optimizing it anyway since you're already there.

STAGE 3 — FIX
Only now propose the smallest change that addresses the measured bottleneck specifically. State the expected improvement in the same units as the baseline, and describe exactly how you'd re-measure using the same instrumentation to confirm it actually closed the gap rather than just changing the code's shape.

Remove any temporary instrumentation you added in Stage 1 before finishing, unless told explicitly to keep it as permanent monitoring.`,
    variables: [
      {
        name: 'slow_symptom',
        description:
          'What is slow, observed from the outside — a page, an endpoint, a build step.',
        example:
          'The /api/dashboard/summary endpoint takes 2-4 seconds under normal load, and users notice the delay.',
        required: true,
      },
      {
        name: 'suspected_area',
        description:
          'Where you suspect the problem is, as a hypothesis to test, not a diagnosis to accept.',
        example:
          'Probably the getMonthlyTotals database query, since it joins across three tables.',
        required: true,
      },
      {
        name: 'measurement_method',
        description:
          'What instrumentation or tooling is available/preferred for getting real numbers.',
        example:
          'console.time/console.timeEnd around suspect functions is fine for now; no APM tool wired up in dev.',
        required: true,
      },
      {
        name: 'baseline_target',
        description:
          'The concrete number to compare against, so "improved" has a measurable definition.',
        example: 'Current p50 is 2.8s measured over 5 runs; target is under 500ms.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'performance-profiling',
      'agent-mode',
      'benchmarking',
      'optimization',
      'measurement-first',
    ],
    whyItWorks:
      'Agentic coding models are fluent at describing plausible-sounding performance fixes — memoization, batching, adding an index — by pattern-matching on code shape alone, without ever confirming that the spot they\'re fixing is where the time actually goes, which is the same failure mode as proposing a bug fix without reproducing the bug: the fix can be well-written and completely irrelevant to the actual symptom. Structuring the request as measure-diagnose-fix, with Stage 2 explicitly required to cite Stage 1\'s actual numbers rather than restate the hypothesis in different words, blocks the shortcut straight to a fix and forces the model to either confirm or falsify its own SUSPECTED_AREA hypothesis against real data instead of its own prior about what usually causes this kind of symptom. Instrumenting adjacent code on the same request path, not just the suspected function, matters because the actual bottleneck is very often one step away from where it appears to be — a slow-looking database query might be fast, while the serialization step immediately after it is what\'s actually consuming the time, and an agent told to "measure the suspected area" narrowly will confirm exactly the wrong hypothesis with real numbers and still land on the wrong fix. BASELINE_TARGET stated as a concrete number, rather than left as "make it faster," gives Stage 3 something falsifiable to compare against — without it, any change that plausibly touches the hot path can be described as an improvement without ever actually re-measuring to check. Requiring instrumentation removal at the end closes a real and common Agent-mode side effect: debug timers or logging left behind in the final diff because the agent\'s job description was "make it fast," and adding a console.time and never removing it technically doesn\'t conflict with that instruction on its own.',
    exampleOutput: `STAGE 1 — MEASURE
Instrumented getMonthlyTotals and the two other functions on this request path.
- getMonthlyTotals: 340ms avg (5 runs)
- getUserPreferences: 1,850ms avg (5 runs) — the actual majority contributor, not the suspected area
- getRecentActivity: 210ms avg

STAGE 2 — DIAGNOSE
The suspected area (getMonthlyTotals) is not the bottleneck — it's a minor contributor. getUserPreferences is doing a full table scan with no index on user_id, confirmed via the query plan.

STAGE 3 — FIX
Adding an index on user_preferences(user_id) is the smallest change addressing the measured bottleneck. Expected: full scan to index lookup should bring that query under 50ms, taking the endpoint from a 2.8s baseline toward the 500ms target. Re-measuring with the same instrumentation after the index is added and the migration applied.

Instrumentation removed from all three functions.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-23' }],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Cursor 2.2 Agent mode.',
      },
    ],
  },
  {
    slug: 'cursor-tab-completion-intent-comment-brief',
    category: 'cursor',
    title: 'Write intent-first comments that steer what Cursor Tab predicts next',
    description:
      "A commenting-style brief — for the top of a file or a project-wide note — that shapes forward-looking intent comments for Cursor Tab's predictive multi-line completion, and enforces consistent terminology, so its suggestions match your next step more often instead of guessing from indentation and generic patterns alone.",
    promptText: `COMMENT STYLE FOR THIS FILE — {{file_purpose}}

Write comments as forward-looking intent statements immediately above the line they describe, not as after-the-fact descriptions of code already written. State what happens next before writing it — that's what a predictive completion actually reads to guess the following lines; a comment describing code that already exists has nothing left to predict.

NAMING CONVENTIONS TO FOLLOW SO COMPLETIONS MATCH THEM
{{naming_conventions}}

EXAMPLES OF THE COMMENT STYLE TO MATCH
{{comment_style_examples}}

TERMS THIS FILE USES FOR RECURRING CONCEPTS — do not introduce a synonym
{{terminology_glossary}}

RULES
- One comment per logical step, not one per line — a comment on every line is noise a completion model has to parse through rather than a clean forward signal.
- Name the next variable or function before it appears — e.g. "// validate email" immediately before assigning to isValidEmail — so a completion suggesting isValidEmail is reading stated intent, not guessing from indentation and surrounding shape alone.
- Don't leave a bare TODO with no reason attached; a TODO with nothing after it gives a completion model nothing to extend correctly and it will either ignore it or guess badly.
- Keep the file's existing terms consistent with the glossary above — don't introduce a synonym for a concept the file already names something else, since a completion model weights whichever term appeared most recently and most frequently in the file when ranking a multi-line continuation.
- When a completion's suggestion diverges from what you actually meant, don't just overwrite it silently — add or adjust the comment above it so the next similar completion in this file gets it right too, treating a wrong suggestion as a signal about the comment, not just a one-off to dismiss.`,
    variables: [
      {
        name: 'file_purpose',
        description:
          'What this file is for, briefly, so the comment style instruction has context.',
        example: 'Form validation helpers for the signup flow',
        required: true,
      },
      {
        name: 'naming_conventions',
        description:
          'The naming pattern this file/codebase already uses, so completions stay consistent with it.',
        example:
          'Boolean validators are named isX (isValidEmail, isStrongPassword); error messages are named xError (emailError).',
        required: true,
      },
      {
        name: 'comment_style_examples',
        description:
          'One or two short real examples of the forward-looking comment style to match.',
        example:
          '// check password length before checking character variety\nconst hasMinLength = password.length >= 8',
        required: true,
      },
      {
        name: 'terminology_glossary',
        description:
          'The specific terms this file uses for recurring concepts, so a completion model has one consistent vocabulary to reinforce rather than two competing ones.',
        example:
          '"validate" (not "check" or "verify") for input-rule checks; "field" (not "input" or "control") for a single form value.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'tab-completion',
      'code-comments',
      'predictive-completion',
      'code-style',
      'developer-workflow',
    ],
    whyItWorks:
      "Tab's multi-line predictive completion is conditioned heavily on nearby text, comments included, so a comment stating forward intent — \"next: validate email format\" — gives it a much stronger signal for the next few lines than a comment that only describes code already written, which is backward-looking and useless to a forward predictor: by the time that comment exists, there's nothing left to predict from it. Keeping naming and terminology consistent within a file matters for the same mechanical reason from a different angle: Tab weights recently-seen and frequently-seen tokens in the same file heavily when ranking multi-line continuations, so introducing a synonym for a concept the file already names something else — calling it emailValid in one spot and isValidEmail in another — makes the two compete for the completion's attention instead of the second reinforcing the first, which measurably degrades how often the suggested continuation matches what you'd actually type next. TERMINOLOGY_GLOSSARY stated up front, rather than left implicit in whatever terms happen to already be in the file, matters specifically in a file being actively written or extended, where the \"existing\" vocabulary a completion model would otherwise infer from is still thin or inconsistent early on — an explicit glossary gives Tab a stable target from the first line rather than one that has to accumulate enough examples in the file before it stabilizes on its own. The final rule — treating a wrong suggestion as a signal about the comment rather than a one-off to silently dismiss — closes a compounding gap: every time a bad completion gets accepted-then-fixed without adjusting the comment above it, the same ambiguous comment is still there to produce the same wrong guess the next time a similar line is written, so the file's completion accuracy never actually improves within a session even though every individual mistake was corrected.",
    exampleOutput: `// validate email format before checking domain allowlist
const isValidEmail = EMAIL_REGEX.test(email)

// check against the blocked-domain list only if the format already passed
const isAllowedDomain = isValidEmail && !BLOCKED_DOMAINS.includes(getDomain(email))
// ^ Tab suggested this exact line unprompted after the comment above, reusing
// isValidEmail and the isX naming convention rather than inventing emailOk.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-20' }],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against Cursor 2.2 Tab multi-line completion.',
      },
    ],
  },
  {
    slug: 'cursor-project-rules-mdc-authoring-brief',
    category: 'cursor',
    title: 'Author a Cursor Project Rule that actually gets applied instead of ignored',
    description:
      "A brief for writing a .cursor/rules/*.mdc Project Rule with the correct rule type, glob scope, and description for triggering, so the rule reliably activates in the situations it's meant for instead of sitting in the repo unused because it was scoped or worded wrong.",
    promptText: `Write a Cursor Project Rule as a .mdc file for this repository. Before writing the body, choose the correct rule type deliberately — this determines whether the rule fires at all:

RULE PURPOSE
{{rule_purpose}}

WHEN THIS RULE SHOULD APPLY
{{trigger_scope}}

RULE TYPE — pick exactly one and justify it in one line
- Always: applied to every agent request in this repo regardless of what file is open. Use only for genuinely universal constraints.
- Auto Attached: applied when a file matching a glob pattern is in context. Use for stack- or directory-specific conventions.
- Agent Requested: the agent decides whether to pull this rule in, based on the rule's description matching the current task. Use for optional guidance that shouldn't always be in context.
- Manual: only applied when explicitly @-mentioned. Use for rules that are situational enough that auto-triggering would be noise.

CONTENT THIS RULE MUST ENFORCE
{{rule_content}}

EXAMPLES OF THE PATTERN BEING FOLLOWED CORRECTLY, AND ONE COUNTEREXAMPLE
{{examples_and_counterexample}}

RULES FOR WRITING THE RULE ITSELF
- If you chose Auto Attached, write a glob pattern precise enough to match the intended files without also matching unrelated ones — test it mentally against at least one file that should match and one that shouldn't.
- If you chose Agent Requested, write the description field as a specific trigger condition an agent would recognize in a task, not a vague summary — "apply when writing or modifying a database migration" not "database-related rules."
- Keep the rule body itself short and directive, not a general essay about best practices — a rule the agent has to read in full every time it's pulled into context should be the length that's actually worth that cost.
- State what to do, not just what to avoid — "use the shared Logger class" reads as an instruction; "don't use console.log" only tells the agent what's forbidden, not what replaces it.
- Include the one counterexample given above inside the rule itself if it clarifies a boundary case that the positive examples alone wouldn't rule out.

Output the complete .mdc file, including its front matter (description, globs, alwaysApply as appropriate for the chosen type) and the rule body.`,
    variables: [
      {
        name: 'rule_purpose',
        description: 'What this rule exists to enforce or standardize, stated as a goal.',
        example:
          'Every new API route must validate its input with a Zod schema before touching business logic, never trust req.body directly.',
        required: true,
      },
      {
        name: 'trigger_scope',
        description:
          'The situations where this rule matters, to help pick the right rule type and glob.',
        example:
          'Any time a new file is added under app/api/**/route.ts, or an existing route handler is modified.',
        required: true,
      },
      {
        name: 'rule_content',
        description:
          'The actual constraint or convention to enforce, in enough detail to be checkable.',
        example:
          'Define a Zod schema per route named <RouteName>Schema, call .parse() on req.body/searchParams before any other logic runs, and return a 400 with the Zod error details on failure — never a generic 500.',
        required: true,
      },
      {
        name: 'examples_and_counterexample',
        description:
          'A correct usage and one incorrect usage, so the rule has a concrete boundary rather than only abstract phrasing.',
        example:
          'Correct: OrderCreateSchema.parse(req.body) at the top of the handler, wrapped in try/catch returning 400 on ZodError. Counterexample: reading req.body.email directly three lines into the handler before any validation — this is exactly what the rule exists to prevent, even if the rest of the handler is otherwise correct.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'project-rules',
      'mdc',
      'cursorrules',
      'agent-mode',
      'code-standards',
      'rule-scoping',
    ],
    whyItWorks:
      'Cursor\'s Project Rules system deliberately splits rules into four trigger types precisely because a single global rules file — the older .cursorrules convention — either gets loaded into every single request regardless of relevance, bloating context and diluting the signal of any one rule, or gets skipped entirely once a codebase has enough rules that no one maintains the one file anymore. Forcing an explicit choice among Always, Auto Attached, Agent Requested, and Manual, justified in one line, is what actually determines whether a rule fires in the situation it\'s meant for: a rule about API-route validation written as Always fires on every unrelated request including a CSS tweak, silently wasting context budget on every single turn, while the same rule written as Auto Attached with a glob scoped to app/api/**/route.ts fires exactly when it\'s relevant and never otherwise. The requirement to mentally test a glob against a matching and a non-matching file catches the most common authoring mistake with Auto Attached rules — a pattern so broad it also attaches to test files or generated files where the rule doesn\'t apply, which produces exactly the same context-bloat problem the rule type was meant to avoid, just scoped slightly narrower than Always. For Agent Requested rules, the description field is not documentation — it\'s the literal string an agent compares against the current task to decide whether to pull the rule in at all, so a vague description like "database-related rules" fails to trigger on a task described as "add a migration," while a description written as the actual trigger condition — "apply when writing or modifying a database migration" — matches the vocabulary a task description would actually use. Requiring the rule to state what to do rather than only what to avoid matters because a rule that only forbids something gives the agent no positive pattern to fall back on, and it will substitute its own default, which is very often not what the rule\'s author actually wanted in place of the forbidden pattern.',
    exampleOutput: `---
description: Apply when creating or modifying an API route handler under app/api
globs: app/api/**/route.ts
alwaysApply: false
---

# API Route Input Validation

Every route handler must validate input with a Zod schema before running any business logic.

- Define a schema named <RouteName>Schema in the same file or an adjacent schemas.ts.
- Call .parse() on req.body or searchParams as the first line of the handler body.
- On ZodError, return a 400 with the error's flattened issues — never let validation fall through to a generic try/catch that returns 500.

Counterexample (do not do this): reading req.body.email directly before .parse() runs, even if validation happens later in the function. The read itself is the violation, regardless of what happens after it.

Use the shared Logger class for any validation-failure logging, not console.log — see logging-conventions.mdc.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: "Initial publish, verified against Cursor 2.2's Project Rules (.cursor/rules/*.mdc) system.",
      },
    ],
  },
  {
    slug: 'cursor-notepad-reusable-context-brief',
    category: 'cursor',
    title:
      'Build a Cursor Notepad once so a recurring task stops needing a re-explained brief every time',
    description:
      'A brief for authoring a Cursor Notepad — a reusable, @-mentionable context block — for a task that recurs often enough that re-typing the same constraints every session is itself the cost, with an explicit staleness check so the Notepad gets corrected the first time it drifts from reality instead of silently misleading every session after.',
    promptText: `Create a Cursor Notepad for the following recurring task, so future sessions can @-mention it instead of having the same context re-explained from scratch each time.

RECURRING TASK THIS NOTEPAD SUPPORTS
{{recurring_task}}

CONTEXT THAT STAYS TRUE ACROSS SESSIONS — put this in the Notepad
{{stable_context}}

CONTEXT THAT CHANGES EVERY TIME — do not put this in the Notepad, name what varies instead
{{variable_context}}

FILES OR SNIPPETS TO REFERENCE FROM INSIDE THE NOTEPAD
{{reference_material}}

Write the Notepad so that a future session that @-mentions it plus a one-line description of what's different this time has everything it needs — the stable context should do the heavy lifting, and the one-line addition should only ever need to supply what VARIABLE_CONTEXT says actually changes.

Structure it as:
1. A one-paragraph statement of what this recurring task is and when to reach for this Notepad instead of writing a fresh brief.
2. The stable constraints, rules, and conventions, written the same way a rules file would be — directive, not descriptive.
3. A short "what you still need to supply" checklist naming exactly the variable inputs a session using this Notepad must still provide.
4. A staleness note: the specific signal that would mean this Notepad needs updating — a file moving, a convention changing — so whoever notices that signal knows to fix the Notepad rather than work around it silently in one session and leave it wrong for the next.`,
    variables: [
      {
        name: 'recurring_task',
        description:
          'The task that comes up often enough to justify a reusable context block instead of a one-off brief.',
        example:
          'Adding a new internal admin report page: a filtered table view over an existing dataset, with CSV export and role-gated access.',
        required: true,
      },
      {
        name: 'stable_context',
        description:
          "The parts of the task's context that don't change from instance to instance.",
        example:
          'All admin pages live under app/admin/, use the AdminTable component, require the "admin" or "analyst" role checked via requireRole(), and CSV export goes through lib/export/toCsv.ts.',
        required: true,
      },
      {
        name: 'variable_context',
        description:
          "What genuinely differs each time this task recurs, so it's explicitly excluded from the Notepad and named as a required input instead.",
        example:
          'The specific dataset being reported on, its columns, and which roles beyond the default two (if any) should have access this time.',
        required: true,
      },
      {
        name: 'reference_material',
        description:
          'Specific files or snippets the Notepad should point to or embed, so it stays anchored to real code rather than a paraphrase of it.',
        example:
          'app/admin/users/page.tsx as the canonical example of the pattern done correctly; lib/export/toCsv.ts for the export utility signature.',
        required: false,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'notepads',
      'reusable-context',
      'agent-mode',
      'context-management',
      'developer-workflow',
    ],
    whyItWorks:
      "A Notepad is @-mentionable the same way a file is, which means it gets pulled into context on demand rather than being either always-loaded like an Always rule or re-typed from scratch every session — that middle ground is exactly right for a task that recurs often enough to be worth documenting once, but not so universally relevant that it should sit in every request's context whether needed or not. Separating STABLE_CONTEXT from VARIABLE_CONTEXT explicitly is the core design decision here, because a Notepad that tries to also capture what changes each time either goes stale the first time the specifics differ from the example baked into it, or forces the author to keep editing the Notepad itself every session, which defeats the entire point of writing it once. Naming the variable inputs as an explicit checklist rather than leaving them implicit in the stable content means a future session using the Notepad knows exactly what it still has to supply, rather than discovering partway through that the Notepad's baked-in example dataset isn't actually the one relevant this time and untangling which parts of the Notepad were ever meant to generalize. The staleness note is the part most reusable-context setups skip, and it's specifically what prevents the Notepad from becoming actively harmful rather than just eventually useless: a Notepad with no staleness signal gets silently worked around the first time it's wrong — the session using it just does something slightly different and moves on — and the Notepad stays wrong for every session after that, quietly steering each one slightly off from current reality with no one ever tracing the drift back to the Notepad as the source.",
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-26' }],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Cursor 2.2 Notepads.',
      },
    ],
  },
  {
    slug: 'cursor-at-symbol-context-scoping-brief',
    category: 'cursor',
    title:
      "Scope Cursor's chat context with @-symbols instead of hoping the index finds the right files",
    description:
      'A brief for composing a chat or Agent-mode request using explicit @Files/@Folders/@Docs/@Git references rather than relying on implicit semantic search, so the model reasons from exactly the sources you intend instead of whatever the embedding index ranks as closest.',
    promptText: `QUESTION OR TASK
{{question_or_task}}

Use explicit @-references below rather than relying on automatic codebase search to find the relevant context. Name the exact sources so nothing important is missing and nothing irrelevant gets pulled in by a semantic-similarity guess.

@Files / @Folders TO INCLUDE
{{files_and_folders}}

@Docs TO INCLUDE, IF ANY
{{docs_references}}

@Git CONTEXT, IF RELEVANT
{{git_context}}

WHY THESE SOURCES SPECIFICALLY
{{source_justification}}

RULES
- Answer or act using only the referenced sources above plus what you can directly read from files those sources point to (an import, a type definition one hop away). If the task genuinely can't be completed from these sources alone, say exactly what's missing rather than falling back to a broader unscoped search silently.
- If two of the referenced sources disagree with each other — a doc describing behavior the code doesn't actually have — say so explicitly and ask which one is authoritative rather than picking one side without flagging the conflict.
- Do not treat a semantically similar file that wasn't referenced as equally authoritative just because it turned up while reading the ones that were. Mention it as a note if it seems relevant, but don't reason from it as if it had been included on purpose.`,
    variables: [
      {
        name: 'question_or_task',
        description: 'The actual question to answer or task to complete.',
        example:
          'Why does the checkout flow sometimes charge tax twice, and where should the fix go?',
        required: true,
      },
      {
        name: 'files_and_folders',
        description:
          'The exact files or folders to reference via @Files/@Folders — the sources you already know are relevant.',
        example:
          '@lib/tax/calculateTax.ts, @app/checkout/CheckoutSummary.tsx, @app/api/checkout/route.ts',
        required: true,
      },
      {
        name: 'docs_references',
        description:
          'Any indexed documentation to pull in via @Docs, if the answer depends on an external API or internal spec.',
        example:
          '@Docs Stripe Tax API — the tax_behavior field documentation specifically.',
        required: false,
      },
      {
        name: 'git_context',
        description:
          'Relevant commit or blame history to include via @Git, if the bug or question is about when/why something changed.',
        example:
          '@Git blame on calculateTax.ts for the last 3 commits touching the tax_behavior handling.',
        required: false,
      },
      {
        name: 'source_justification',
        description:
          "Why these specific sources were chosen, so it's clear what's deliberately excluded and why, not just what's included.",
        example:
          'Excluding the admin refund flow entirely — tax is calculated fresh on checkout, refunds only reference the stored amount, so they are not part of this bug.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: ['at-symbols', 'context-scoping', 'codebase-search', 'chat-mode', 'agent-mode'],
    whyItWorks:
      "Cursor's default behavior when no explicit @-reference is given is to run a semantic search over the codebase's embedding index and surface whatever ranks closest to the question's phrasing, which works well when the relevant code happens to use similar vocabulary to the question and works poorly when it doesn't — a tax bug described in terms a reviewer would use (\"charged twice\") may rank a logging or analytics file that happens to mention \"charge\" more literally above the actual tax-calculation file that never uses that word. Naming @Files and @Folders explicitly removes that dependency on vocabulary overlap entirely and replaces it with a guarantee: the model reasons from exactly what's referenced, not from whatever an embedding-similarity ranking decided was close enough. @Docs and @Git matter for a different reason — they're sources the default semantic search over the codebase's own files wouldn't surface at all, since indexed documentation and commit history live outside the file tree the standard search operates over, so a question that genuinely depends on \"what does the third-party API's field actually mean\" or \"when did this behavior change and why\" needs those referenced on purpose or the model will answer from its own general knowledge of the API instead of this specific integration's documented behavior. SOURCE_JUSTIFICATION stated explicitly matters because it makes exclusion a deliberate act the model can be held to — without it, there's no way to tell whether the refund flow was left out because it's genuinely irrelevant or because it just didn't come to mind, and the rule against treating an unreferenced-but-similar file as equally authoritative closes the gap where the model reads one hop beyond what was referenced, finds something plausible-looking, and quietly reasons from it as if it had been included on purpose.",
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-31' }],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Cursor 2.2 @-symbol context references (@Files, @Folders, @Docs, @Git).',
      },
    ],
  },
  {
    slug: 'cursor-ask-mode-architecture-explainer-brief',
    category: 'cursor',
    title:
      "Get an accurate architecture explanation out of Cursor's Ask mode without it trying to fix anything",
    description:
      'A read-only Ask-mode brief that asks for an explanation of how a system actually works today, with explicit instructions to distinguish observed behavior from inferred intent and to flag anything that looks broken rather than silently proposing a fix, since Ask mode is for understanding, not editing.',
    promptText: `[Ask mode — read-only, no edits should be proposed or made]

Explain how the following actually works today, based on reading the code, not on how it's supposed to work according to any comment, doc, or variable name that might be aspirational or stale.

SYSTEM OR FLOW TO EXPLAIN
{{system_to_explain}}

AUDIENCE AND DEPTH
{{audience_and_depth}}

SPECIFIC QUESTIONS TO ANSWER
{{specific_questions}}

RULES
- Base every claim on what the code actually does, traced through its real call path — not on what a comment, function name, or doc claims it does. If a comment and the code's actual behavior disagree, point out the disagreement explicitly rather than reporting the comment's version as fact.
- Distinguish clearly between "this is what happens" (observed, traced through the code) and "this is presumably why" (inferred, your best read of intent). Label the second kind of claim as inference, since it can be wrong in a way the first kind can't.
- If you notice something that looks like a bug, a race condition, or a dead code path while tracing this, name it as an observation at the end, clearly separated from the explanation itself — but do not propose a fix or edit anything. That's outside what this pass is for.
- If the explanation would require reading a file outside what's been indexed or referenced, say exactly what's missing rather than filling the gap with a plausible-sounding guess about what it probably does.

Structure the answer as: a short summary first, then the detailed trace, then any observations, clearly under their own heading.`,
    variables: [
      {
        name: 'system_to_explain',
        description: 'The specific system, flow, or piece of behavior to explain.',
        example:
          'How a user session gets refreshed — the full path from an expired access token to a new one being issued, including what happens if the refresh itself fails.',
        required: true,
      },
      {
        name: 'audience_and_depth',
        description:
          "Who this explanation is for and how much background to assume, so the answer isn't pitched wrong in either direction.",
        example:
          "A new engineer on the team who knows general web auth concepts but has never read this specific codebase — assume no familiarity with this repo's specific file layout.",
        required: true,
      },
      {
        name: 'specific_questions',
        description:
          'The exact questions the explanation needs to answer, so it stays targeted rather than a generic walkthrough.',
        example:
          'What triggers the refresh — is it proactive (before expiry) or reactive (only after a 401)? What happens to in-flight requests during a refresh? Is there a retry limit?',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: ['ask-mode', 'architecture', 'code-comprehension', 'read-only', 'onboarding'],
    whyItWorks:
      "Ask mode is deliberately restricted from proposing or making edits, which matters here for a reason beyond safety: a chat mode that can edit tends to shift from explaining toward fixing the moment it notices something questionable, because \"here's what's happening, and here's how I'd improve it\" is the model's default framing for describing code once it spots an issue, and that framing quietly turns a comprehension task into a stealth refactor proposal nobody asked for. Requiring the explanation to trace actual code behavior rather than report what a comment or function name claims addresses a specific and common documentation-drift problem: comments and names describe intent at the time they were written, and intent is exactly the thing that goes stale first when code changes underneath it without every comment being updated to match, so a model explaining \"how it works\" from comments alone will confidently report a version of the system that hasn't been true since the last unrelated bug fix touched the same function. Separating observed behavior from inferred intent, and labeling the second explicitly, matters because a model reasoning about why code is structured a certain way is doing something categorically different from tracing what it does — the first is a hypothesis about a decision someone made, potentially long gone from the team, and presenting it with the same confidence as a traced execution path misleads a reader who has no way to tell the two apart from the prose alone. Requiring observations about apparent bugs to be named but not acted on gives Ask mode's read-only constraint a legitimate outlet: without it, a model that notices a real race condition while explaining the flow has nowhere to put that observation except by drifting into the fix-oriented framing the mode is supposed to avoid, or by suppressing a genuinely useful finding entirely to stay strictly on-topic.",
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Cursor 2.2 Ask mode.',
      },
    ],
  },
  {
    slug: 'cursor-agent-repro-first-debugging-brief',
    category: 'cursor',
    title: "Force Cursor's Agent mode to reproduce a bug before it proposes a fix",
    description:
      "A debugging brief that requires the agent to first write a failing reproduction of the reported bug and confirm it fails for the stated reason, before proposing any change, so a plausible-sounding fix can't ship for a cause that was never actually confirmed to be the real one.",
    promptText: `BUG REPORT
{{bug_report}}

STEPS TO REPRODUCE, AS REPORTED
{{repro_steps}}

Do not propose a fix yet. Your first job is to reproduce this bug and confirm it fails for the reason it appears to fail for — not to explain what's probably wrong from reading the code.

ENVIRONMENT / DATA NEEDED TO REPRODUCE
{{repro_environment}}

STAGE 1 — REPRODUCE
Write the smallest test or script that reproduces the reported behavior. Run it and show the actual failure output. If you cannot reproduce it with the information given, say exactly what's missing — a specific input, a state, a timing condition — rather than guessing at a plausible cause without ever having seen it actually fail.

STAGE 2 — ISOLATE
Once reproduced, narrow it down: change one variable at a time to find the smallest set of conditions that still triggers it, and the smallest change that makes it stop. Report both explicitly — the presence of the bug and the boundary where it disappears are both diagnostic information.

STAGE 3 — FIX
Only now propose the fix, tied directly to what Stage 2 isolated. State exactly why this fix addresses the isolated cause, not just why it's a generally reasonable-looking change to make in this area of the code.

STAGE 4 — CONFIRM
Run the Stage 1 reproduction again against the fix and show that it now passes. Then check for regressions: does the fix change behavior for any case that was working before? Name specifically what you checked, not just that you checked "the usual suspects."`,
    variables: [
      {
        name: 'bug_report',
        description:
          "The bug as reported, in the reporter's own words if possible, including anything that seems like a guess rather than an observation.",
        example:
          'Users report that clicking "Save" twice quickly sometimes creates two duplicate records instead of one. Happens intermittently, not on every double-click.',
        required: true,
      },
      {
        name: 'repro_steps',
        description:
          'The steps as given, even if incomplete — a starting point for the reproduction attempt, not a guaranteed-correct recipe.',
        example:
          'Open the edit form, make a change, click Save twice within about a second, check the records table for duplicates.',
        required: true,
      },
      {
        name: 'repro_environment',
        description:
          'What environment, data, or account state is needed to actually attempt the reproduction.',
        example:
          'Needs a test account with an existing record to edit; the duplicate only seems to happen on records with at least one existing related child record.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'debugging',
      'agent-mode',
      'bug-reproduction',
      'root-cause-analysis',
      'regression-testing',
    ],
    whyItWorks:
      'A model asked to fix a bug directly from a description will very often produce a plausible-sounding explanation and a plausible-sounding fix without ever confirming either one against an actual failure, because pattern-matching a bug report to a familiar category of cause — a race condition, a missing debounce, a stale closure — is something a language model can do fluently from the report\'s prose alone, and that fluency is exactly what makes it easy to skip the step of checking whether this specific instance of the pattern is actually what\'s happening here. Requiring Stage 1 to produce an actual failing reproduction before any diagnosis is proposed closes that gap directly: a fix can only be evaluated against a cause that\'s been confirmed to exist, and "I couldn\'t reproduce it, here\'s what\'s missing" is a legitimate and useful Stage 1 outcome that a fix-first approach never produces, because a model that skips straight to proposing a fix has no occasion to discover the repro steps were incomplete in the first place. Stage 2\'s isolation step matters because "reproduced" and "understood" are different claims — a bug that reproduces under the reported steps might actually be triggered by something narrower or broader than what was reported, and changing one variable at a time to find the actual boundary is what turns "it happens sometimes" into a specific, checkable condition a fix can be judged against. Requiring Stage 4\'s regression check to name specifically what was verified, rather than accept a vague "checked the usual suspects," targets a documented pattern where a race-condition fix — adding a lock, a debounce, an idempotency check — silently changes legitimate concurrent-use behavior that was never part of the bug report, and a fix that suppresses double-clicks correctly but also breaks a legitimate rapid-edit-then-save workflow has just traded one bug for a different one that won\'t surface until a different user reports it weeks later.',
    exampleOutput: `STAGE 1 — REPRODUCE
Wrote a script simulating two rapid POST /api/records calls 400ms apart with identical payloads. Confirmed: both requests create a record; no duplicate-prevention check exists on the create path. Reproduced.

STAGE 2 — ISOLATE
Duplicate occurs any time the second request starts before the first one's DB write completes, regardless of payload — not specific to records with child relations as suspected. Disappears entirely if the second request is delayed until after the first completes (confirmed by adding an artificial 200ms delay between the two test calls).

STAGE 3 — FIX
Adding an idempotency key check keyed on (userId, formSessionId) with a short TTL addresses the isolated race directly — it doesn't depend on request timing, it makes the second identical request within the window a no-op instead of a second insert.

STAGE 4 — CONFIRM
Re-ran the Stage 1 script against the fix: second request now returns the first request's record instead of creating a new one. Checked: a legitimate edit-save-then-edit-again-and-save sequence with a 5-second gap still creates/updates correctly, since it falls outside the idempotency TTL.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-03' }],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Cursor 2.2 Agent mode on a race-condition duplicate-record bug.',
      },
    ],
  },
  {
    slug: 'cursor-mcp-connected-tool-task-brief',
    category: 'cursor',
    title:
      'Route a Cursor Agent task through a connected MCP server instead of letting it guess at an API',
    description:
      "A task brief that names the specific MCP server and tool Cursor's Agent mode should call for a task that touches an external system, with an explicit fallback rule for when the tool's response doesn't match what was expected, so the agent doesn't silently paper over an unexpected result from a system it can't fully inspect.",
    promptText: `This task involves {{external_system}}, which is available through the {{mcp_server_name}} MCP server connected to this workspace. Use that connection rather than writing code that calls the external system's API directly from assumptions about its shape.

TASK
{{task_description}}

MCP TOOL(S) TO USE
{{mcp_tools_to_use}}

EXPECTED RESPONSE SHAPE
{{expected_response_shape}}

RULES
- Call the named MCP tool(s) rather than hand-writing an HTTP request or SDK call to {{external_system}} yourself, even if you're confident you know its API — the MCP server's tool definitions are the source of truth for what's actually callable and what it actually returns right now, not your general knowledge of the service.
- If a tool call's response doesn't match EXPECTED_RESPONSE_SHAPE, stop and report the actual shape you got rather than reshaping your code to fit what you expected — the mismatch is information about the real API, and silently normalizing around it hides that from whoever reads this later.
- If the MCP server doesn't expose a tool that covers part of this task, say exactly what's missing rather than falling back to a direct API call to fill the gap without flagging that you did.
- Do not hardcode a credential, endpoint, or API key anywhere in the code you write for this task — if the MCP connection needs configuration to work, name what's missing rather than working around it with an inline secret.

When done, list every MCP tool call you made, what you asked for, and what came back, so the actual interaction with {{external_system}} is auditable without re-running the task.`,
    variables: [
      {
        name: 'external_system',
        description: 'The external service or system this task needs to interact with.',
        example: 'the Linear issue tracker',
        required: true,
      },
      {
        name: 'mcp_server_name',
        description:
          'The specific MCP server connected in this workspace that provides access to the external system.',
        example: 'the Linear MCP server',
        required: true,
      },
      {
        name: 'task_description',
        description: 'What needs to happen involving the external system.',
        example:
          'When a PR is merged to main, create a follow-up Linear issue in the "Tech Debt" project referencing the PR number, tagged with the "cleanup" label.',
        required: true,
      },
      {
        name: 'mcp_tools_to_use',
        description:
          'The specific named tool(s) exposed by the MCP server relevant to this task, if known in advance.',
        example: 'create_issue and list_labels from the Linear MCP server.',
        required: true,
      },
      {
        name: 'expected_response_shape',
        description:
          "What the tool's response is expected to look like, so a mismatch is checkable rather than absorbed silently.",
        example:
          'create_issue should return { id, identifier, url } for the newly created issue.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2', 'MCP'],
    tags: ['mcp', 'tool-use', 'agent-mode', 'integrations', 'external-apis'],
    whyItWorks:
      "An agent asked to \"create a Linear issue\" without an MCP connection named will write code against its own general knowledge of Linear's public API, which is frequently stale relative to the actual current API version, and even when accurate requires the agent to also handle auth, rate limits, and error shapes it has no live visibility into — versus a connected MCP server, which exposes a small set of already-authenticated, already-scoped tools with their own defined input/output schema that the agent can call directly and get a real response from, not a guess about what the response should look like. Naming the specific MCP_SERVER_NAME and MCP_TOOLS_TO_USE up front removes the agent's discretion to choose between \"call the tool\" and \"write a direct API call\" — left to its own judgment, a model will often default to writing code, since that's the more familiar and more thoroughly represented pattern in its training data, even when a live tool call would produce a more accurate and more current result with far less code to get wrong. Requiring a stop-and-report on any response that doesn't match EXPECTED_RESPONSE_SHAPE matters because an MCP tool's actual behavior is something the agent discovers live, and its default instinct facing an unexpected shape is to write defensive code that quietly handles the mismatch — optional-chaining around a missing field, a fallback default value — which resolves the immediate error but hides a real signal that the tool's contract has changed or was misunderstood, information that's far more useful surfaced than silently absorbed. Requiring an auditable log of every actual call and response gives you something no code review of the resulting diff alone would show: not just what code was written to call the external system, but what the external system actually said back during this specific run, which matters most exactly when something about the integration behaves unexpectedly weeks later and the original interaction needs to be checked against what was assumed at the time.",
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-04' }],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against Cursor 2.2 Agent mode with a connected MCP server.',
      },
    ],
  },
  {
    slug: 'cursor-long-context-library-migration-brief',
    category: 'cursor',
    title:
      "Use Cursor's whole-codebase context to migrate a state-management library site-wide, not file by file",
    description:
      "A brief for a large, cross-cutting library migration that leans on Agent mode's long-context codebase understanding to first produce a complete inventory of usage patterns before touching a single file, so the migration plan accounts for every variant of how the old library is actually used, not just the common case.",
    promptText: `Migrate this codebase from {{old_library}} to {{new_library}}. This touches many files with several different usage patterns, not one consistent pattern repeated everywhere — do not assume the first few examples you see represent every usage.

CURRENT LIBRARY AND VERSION
{{old_library}}

TARGET LIBRARY AND VERSION
{{new_library}}

KNOWN USAGE PATTERN VARIANTS TO EXPECT
{{usage_variants}}

MIGRATION MAPPING — old pattern to new pattern
{{migration_mapping}}

STAGE 1 — FULL INVENTORY
Before migrating anything, search the entire codebase for every usage of {{old_library}} and group them by which variant they match from USAGE_VARIANTS above. Report the count per variant and flag any usage that doesn't cleanly match a known variant — those are the ones most likely to need a judgment call rather than a mechanical swap.

STAGE 2 — MIGRATE BY VARIANT, NOT BY FILE
Migrate one variant at a time across every file it appears in, rather than one file at a time across every variant it happens to contain. This keeps each pass mechanically consistent and makes it obvious if a variant's migration mapping doesn't actually work uniformly once applied broadly.

STAGE 3 — HANDLE THE UNMATCHED CASES
For every usage flagged as not matching a known variant in Stage 1, propose a specific mapping and flag it for review rather than silently applying your best guess at the same confidence as a known-variant migration.

STAGE 4 — VERIFY
{{verification_approach}}

Report the final state as: total usages migrated, broken down by variant, plus the list of judgment calls made in Stage 3 with reasoning for each.`,
    variables: [
      {
        name: 'old_library',
        description: 'The library and version being migrated away from.',
        example: 'Redux with redux-thunk, v4.2',
        required: true,
      },
      {
        name: 'new_library',
        description: 'The library and version being migrated to.',
        example: 'Zustand v5',
        required: true,
      },
      {
        name: 'usage_variants',
        description:
          'The distinct ways the old library is actually used across the codebase, since a large migration rarely has just one pattern.',
        example:
          'connect() HOC wrapping class components; useSelector/useDispatch hooks in function components; thunk action creators dispatched from event handlers; middleware reading store state directly outside React.',
        required: true,
      },
      {
        name: 'migration_mapping',
        description:
          'The concrete old-pattern-to-new-pattern translation for each known variant.',
        example:
          'useSelector(selectFn) becomes useStore(selectFn) directly. Thunk action creators become plain async functions calling store.getState()/store.setState(). connect() HOCs need manual conversion to hooks since Zustand has no HOC equivalent.',
        required: true,
      },
      {
        name: 'verification_approach',
        description: "How to confirm the migration didn't change behavior once applied.",
        example:
          'Run the full test suite after each variant pass, not just at the end, so a regression is traceable to the specific variant migration that caused it.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'migration',
      'agent-mode',
      'long-context',
      'state-management',
      'codebase-wide-refactor',
    ],
    whyItWorks:
      "A codebase-wide library migration is exactly the kind of task where Agent mode's ability to hold and search a large indexed context matters more than in a single-file edit, because the actual difficulty isn't translating one usage of the old library into the new one — that part is often mechanical — it's that a mature codebase almost never uses a state library one consistent way everywhere, and a migration plan built from the first handful of examples the model happens to open will confidently apply the wrong mapping to every variant it never looked at closely. Requiring a full inventory before any file changes, grouped explicitly by USAGE_VARIANTS, forces that discovery to happen up front as a checkable list rather than being discovered piecemeal as each new pattern breaks the previous pass's mapping partway through the migration. Migrating by variant across every file rather than by file across every variant is the specific sequencing choice that makes Stage 1's inventory actually pay off: doing one variant at a time means a mapping that turns out to be subtly wrong reveals itself after a handful of files, not after all of them, and the fix applies uniformly to every remaining instance of that variant instead of needing to be re-discovered file by file. Explicitly separating unmatched usages into their own Stage 3 review, rather than letting them get silently folded into whichever known variant they most resemble, matters because a usage that doesn't cleanly fit any known pattern is, by definition, the case the migration mapping was never actually designed for — applying a known mapping to it anyway at the same confidence as a real match is how a migration introduces a subtle behavior change in exactly the code nobody thought to scrutinize, precisely because it looked similar enough to something already handled.",
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-25' }],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Cursor 2.2 Agent mode on a Redux-to-Zustand migration.',
      },
    ],
  },
  {
    slug: 'cursor-fullstack-contract-sync-brief',
    category: 'cursor',
    title:
      'Keep a frontend/backend API contract change in sync across both sides in one Cursor Agent pass',
    description:
      "A brief for a cross-stack change that states the contract change as the single source of truth both sides must match, with an explicit order of operations and a final cross-check step, so the backend and frontend don't drift out of sync the way they do when each side gets migrated in a separate, disconnected session.",
    promptText: `This change modifies an API contract used by both the backend and the frontend in this repository. Both sides must end up consistent with the new contract below — not just individually correct against their own prior assumptions.

CURRENT CONTRACT
{{current_contract}}

NEW CONTRACT
{{new_contract}}

BACKEND FILES THAT DEFINE OR IMPLEMENT THIS CONTRACT
{{backend_files}}

FRONTEND FILES THAT CONSUME THIS CONTRACT
{{frontend_files}}

TRANSITION STRATEGY
{{transition_strategy}}

ORDER OF OPERATIONS
1. Update the backend's contract definition (types/schema) first, and every backend file that implements it, so it actually returns the new shape.
2. Update every frontend file that consumes the contract to match, using the same names and shapes just established on the backend — do not independently reinterpret the new contract from the frontend side, treat the backend's implementation as the literal source of truth.
3. Search for any file on either side that references the old contract's field names or shape that wasn't in the lists above — this is exactly the kind of usage the file lists above can miss, and finding it now is much cheaper than a runtime error later.

FINAL CROSS-CHECK
Before finishing, pick three request/response examples and trace them manually through both the backend's actual return statement and the frontend's actual usage of the response, confirming the field names and types genuinely match on both ends — not just that both sides individually compile.

If TRANSITION_STRATEGY requires the old and new contract shapes to coexist temporarily, state exactly how a consumer tells which version it's looking at, since an untagged transitional shape is a bug waiting for the next person who doesn't know both versions exist.`,
    variables: [
      {
        name: 'current_contract',
        description: 'The existing shape of the data being changed.',
        example:
          'GET /api/orders/:id returns { id, status: "pending" | "shipped" | "delivered", total: number }.',
        required: true,
      },
      {
        name: 'new_contract',
        description:
          'The new shape, stated precisely enough to check both sides against.',
        example:
          'status becomes a nested object: { id, status: { value: "pending" | "shipped" | "delivered", updatedAt: string }, total: number }.',
        required: true,
      },
      {
        name: 'backend_files',
        description: 'The files that define and implement this contract on the backend.',
        example:
          'app/api/orders/[id]/route.ts, lib/orders/types.ts, lib/orders/repository.ts',
        required: true,
      },
      {
        name: 'frontend_files',
        description: 'The files that consume this contract on the frontend.',
        example:
          'app/orders/[id]/page.tsx, components/OrderStatusBadge.tsx, hooks/useOrder.ts',
        required: true,
      },
      {
        name: 'transition_strategy',
        description:
          'Whether this is a clean cutover or needs the old and new shapes to coexist during a rollout.',
        example:
          'Clean cutover — this is an internal admin tool with no external API consumers, so both sides can change together with no versioning needed.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'fullstack',
      'api-contract',
      'agent-mode',
      'migration',
      'frontend-backend-sync',
    ],
    whyItWorks:
      'A contract change handled as two separate requests — "update the backend" in one session, "update the frontend to match" in another — creates a specific and common drift risk even when both sessions individually succeed: each side gets its own independent interpretation of what the new contract means, and small differences in that interpretation (is the new status field\'s updatedAt an ISO string or a Date, is it nested under status or a sibling field) compile cleanly on both sides in isolation and only surface as a mismatch when the two are actually connected at runtime, well after the change has been reviewed and merged. Stating the ORDER_OF_OPERATIONS explicitly — backend contract and implementation first, frontend matched against what the backend actually returns rather than against an independent reading of NEW_CONTRACT — removes that drift risk structurally: the frontend consumer is instructed to treat the backend\'s real implementation as its source of truth, not the prose description of the new contract, which matters because prose is exactly where the ISO-string-versus-Date kind of ambiguity lives and code is where it gets resolved concretely. The Stage 3 search for unlisted files matters because BACKEND_FILES and FRONTEND_FILES are supplied by the person writing the brief, and a contract used by more call sites than the author remembered — a background job also reading order status, an admin export also formatting it — is exactly the kind of usage that a file list assembled from memory tends to miss, while a codebase-wide search for the old field names catches it mechanically regardless of whether anyone remembered it existed. The FINAL_CROSS_CHECK requiring manual tracing of concrete examples through both sides\' actual code, rather than accepting "both sides compile" as sufficient, is the step that actually catches a contract mismatch, since TypeScript compiling cleanly on both ends only proves each side is internally consistent with its own type definitions — it says nothing about whether those two independently-declared type definitions actually agree with each other, which is precisely the gap a cross-stack contract change can fall into undetected.',
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-07-28' }],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Cursor 2.2 Agent mode on a Next.js App Router full-stack contract change.',
      },
    ],
  },
  {
    slug: 'cursor-agent-terminal-command-guardrail-brief',
    category: 'cursor',
    title:
      "Put guardrails on which terminal commands Cursor's Agent mode is allowed to auto-run",
    description:
      "A brief establishing which categories of terminal command the agent may run without asking, which require a stated reason first, and which are off-limits entirely for this session, so an agent with command-execution access doesn't run something destructive or irreversible under the umbrella of a broadly worded task.",
    promptText: `This session has terminal command access. Before running any command, check it against the categories below rather than assuming a command is fine just because it seems like a reasonable step toward the task.

TASK
{{task_description}}

COMMANDS ALLOWED WITHOUT ASKING FIRST
{{auto_allowed_commands}}

COMMANDS THAT NEED A STATED REASON BEFORE RUNNING, EVEN IF THEY SEEM NECESSARY
{{ask_first_commands}}

COMMANDS OFF-LIMITS ENTIRELY FOR THIS SESSION
{{forbidden_commands}}

RULES
- Before running any command not explicitly in the allowed list, check whether it matches a pattern in the ask-first or forbidden lists, even if its specific form doesn't exactly match the example given — a variant of a forbidden command (a different flag, a different target path) is still forbidden if it does the same underlying thing.
- For an ask-first command, state exactly why it's needed for this specific task and what you expect it to do before running it, and wait for acknowledgment rather than running it and explaining afterward.
- Never run a command that deletes data, force-pushes, or modifies anything outside this project's own directory, even if it's not explicitly listed — treat "not on the list" as "off-limits" for anything with that shape, not as "presumably fine."
- If completing the task seems to require a command from the forbidden list, stop and say so explicitly rather than finding an equivalent workaround command that accomplishes the same effect through a technicality.
- Report every command actually run, in order, with its output — not a summary of what you intended to run, the literal commands and their actual results.`,
    variables: [
      {
        name: 'task_description',
        description: 'What the agent is actually doing that requires terminal access.',
        example:
          'Set up and run the test suite for a package that was just migrated, installing any missing dev dependencies along the way.',
        required: true,
      },
      {
        name: 'auto_allowed_commands',
        description:
          'Commands safe enough to run without asking first — typically read-only or clearly reversible.',
        example: 'npm test, npm run build, npm run lint, git status, git diff, git log',
        required: true,
      },
      {
        name: 'ask_first_commands',
        description:
          'Commands that change state but might be necessary — require a stated reason before running.',
        example:
          'npm install <package>, git add, git commit (not push), rm on a file inside this project only',
        required: true,
      },
      {
        name: 'forbidden_commands',
        description: 'Commands that should never run in this session under any framing.',
        example:
          "git push --force, rm -rf on anything above this project's own root, any command touching a production database connection string, sudo anything",
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: ['terminal-access', 'agent-mode', 'guardrails', 'auto-run', 'safety'],
    whyItWorks:
      'Agent mode\'s terminal access exists specifically so a task doesn\'t stall every time it needs to install a dependency or run a test, but that same access means a broadly worded task — "set up and run the tests" — carries an implicit blank check to run whatever the agent judges necessary to get there, and "necessary to complete the task" is a much looser bar than "safe to run without asking," especially once the agent hits a blocker and starts trying variations to work around it. Splitting commands into three explicit tiers rather than a single allow/deny list matters because most real commands aren\'t uniformly safe or uniformly dangerous — installing a dependency is usually fine but worth knowing about, while deleting a file is sometimes exactly what the task needs and sometimes a sign the agent misunderstood the task entirely, and collapsing that middle tier into either "always allowed" or "always ask" either creates unnecessary friction on routine steps or removes the checkpoint on the step most likely to matter. The instruction to check variants of a listed pattern, not just exact string matches, closes the most common way a command guardrail actually fails in practice: an agent blocked from git push --force rarely tries that exact string again after being told no, but it might reach for git push --force-with-lease or an equivalent flag combination that accomplishes the same effect through a technicality not explicitly named, and a guardrail keyed to exact command strings rather than to what a command actually does is trivial to route around by accident, not even necessarily on purpose. Requiring a stop-and-report rather than a workaround when the task seems to need a forbidden command is what actually protects against scope pressure: a task genuinely might need something off-limits to complete as originally described, and the right response to that is surfacing the conflict between the task and the guardrail for a human to resolve, not quietly finding a way around the guardrail that still technically completes the task as asked.',
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: "Initial publish, verified against Cursor 2.2 Agent mode's terminal auto-run permissions.",
      },
    ],
  },
  {
    slug: 'cursor-codebase-onboarding-doc-brief',
    category: 'cursor',
    title:
      "Have Cursor's Agent mode explore an unfamiliar codebase and write the onboarding doc you don't have",
    description:
      "A brief for using Agent mode's codebase-wide search and read access to produce a real onboarding document for an undocumented or under-documented repo, grounded explicitly in what the agent actually traced through the code rather than a generic description of what a project 'like this' would typically contain.",
    promptText: `Explore this codebase and write an onboarding document for a new engineer joining this project, with nothing to go on except what's actually in the repository. Do not describe what a project of this general type would typically contain — describe what this specific one actually does, based on what you traced.

PROJECT CONTEXT YOU ALREADY KNOW
{{project_context}}

SPECIFIC AREAS THE ONBOARDING DOC MUST COVER
{{coverage_areas}}

DEPTH LEVEL
{{depth_level}}

WHAT TO PRODUCE
1. A short "what this is and what it does" section — grounded in the actual entry points and routes you found, not the README's aspirational description if the two disagree.
2. An architecture overview naming the actual major modules/directories and what each one is responsible for, based on what you found by reading them, not by their names alone.
3. "How to run this locally" — traced from the actual package scripts, config files, and any setup steps that appear to be required based on what the code actually reads at startup (env vars, config files, expected running services).
4. "Where things live" — a short map from common task types ("add an API route," "add a UI component," "add a background job") to where in the repo that kind of change actually goes, based on existing examples of each.
5. A "known gaps and rough edges" section: anything you noticed while exploring that a new engineer would hit and be confused by — an undocumented env var, a module that looks unused but is actually load-bearing, a naming inconsistency between two similar-looking directories.

RULES
- If the README or existing docs claim something the code doesn't actually support, or no longer matches what you traced, flag the discrepancy explicitly rather than reporting the doc's claim as current fact.
- Do not fabricate a setup step, a script, or an env var that you didn't actually find referenced somewhere in the codebase — if something about local setup is genuinely unclear from what's available, say so rather than guessing at a plausible-sounding default.
- Keep this to the depth level specified — a document written for someone's first day should not be the same length or level of detail as a deep architecture reference.`,
    variables: [
      {
        name: 'project_context',
        description:
          "Whatever high-level context you already have, so the agent isn't starting from literally zero.",
        example:
          'This is an internal tool for the ops team to manage vendor contracts. Built on Next.js. I inherited this repo and have never worked in it before.',
        required: true,
      },
      {
        name: 'coverage_areas',
        description:
          'The specific things the onboarding doc must actually answer, not just a general "explain the codebase."',
        example:
          "How authentication works, how the vendor data gets imported (there's a cron job somewhere, I think), and what the difference is between the two similarly named directories app/vendors/ and app/vendor-admin/.",
        required: true,
      },
      {
        name: 'depth_level',
        description:
          'How deep this document should go, since "onboarding" can mean a 10-minute orientation or a full architecture reference.',
        example:
          'First-week orientation depth — enough to be productive on a small first task, not a comprehensive architecture reference.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'onboarding',
      'documentation',
      'agent-mode',
      'codebase-exploration',
      'architecture',
    ],
    whyItWorks:
      'Agent mode\'s codebase-wide semantic search and read access is what makes this task possible at all in one pass rather than requiring someone to already know the codebase well enough to write the doc themselves, but that same breadth of access is also what makes "describe what a project like this typically contains" a real risk — a model can produce a plausible-sounding architecture overview for a generic Next.js admin tool without having actually traced a single one of this specific repo\'s real entry points, and that output will read as helpful right up until the new engineer tries to follow it and finds the described module doesn\'t exist under that name. Explicitly instructing it to ground the "what this is" section in actual traced entry points rather than the README\'s description matters because a README is exactly the kind of artifact that goes stale the moment the project\'s actual direction shifts and nobody circles back to update the framing paragraph at the top, so treating it as one input to check against the real code rather than as the primary source is what keeps the onboarding doc accurate rather than merely readable. The "known gaps and rough edges" section is the part a generic "document this codebase" request would never produce, because it requires the model to hold two different things in mind simultaneously while exploring — what the code does, and where a newcomer with no prior context would specifically get confused by it — and that second framing only gets applied if it\'s explicitly requested, since describing intended behavior and describing where intended behavior is likely to mislead a first-time reader are genuinely different tasks even though they draw on the same exploration. The rule against fabricating a setup step or env var closes the single most damaging failure mode for this specific kind of document: an onboarding doc is trusted uncritically by definition, since the reader has no independent way yet to know the codebase well enough to notice a fabricated instruction is wrong, so a plausible-sounding but invented setup step doesn\'t just fail to help, it actively costs a new engineer real debugging time chasing a step that was never real.',
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-06' }],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Cursor 2.2 Agent mode on an undocumented internal tool repo.',
      },
    ],
  },
  {
    slug: 'cursor-agent-security-secrets-review-brief',
    category: 'cursor',
    title:
      "Run a security and secrets pass with Cursor's Agent mode before a PR goes up, not after",
    description:
      'A pre-PR security review brief that has Agent mode check a diff for hardcoded secrets, injection risk, and unsafe trust of client input, with concrete severity classification and an explicit rule against writing a fix that just silences a warning without addressing the underlying risk.',
    promptText: `Review the changes in this session for security issues before this goes into a PR. Treat this as a dedicated security pass, not a general code review — you're looking specifically for the categories below, not restating style feedback.

FILES CHANGED THIS SESSION
{{files_changed}}

SPECIFIC RISK CATEGORIES TO CHECK
{{risk_categories}}

TRUST BOUNDARY FOR THIS CHANGE
{{trust_boundary}}

CHECK FOR, SPECIFICALLY
1. Any hardcoded secret, API key, token, or credential — including one that looks like a placeholder but would still work if accidentally left in (a real-format key with a name like "test" or "example" is still a real credential if it's actually valid).
2. Any place user-supplied input reaches a database query, shell command, file path, or template render without validation or parameterization — name the specific input and the specific sink it reaches.
3. Any place this change trusts data from the client (a request body, a query param, a cookie) to make an authorization decision, rather than re-deriving that decision server-side from something the client can't forge.
4. Any new dependency added in this change, and whether it's from a source you'd expect for this ecosystem or something unusual worth a second look before it's trusted with the access this code gives it.

For each finding: cite the file and line, classify it as Critical / High / Medium / Low based on {{trust_boundary}} — the same pattern is a different severity depending on whether the input crossing it is actually attacker-controlled here — and state the specific fix, not just the problem.

Do not propose a fix that merely suppresses the symptom — escaping a string to stop a linter warning without actually parameterizing the underlying query is not a fix, it's the same vulnerability with a quieter warning. If you're not sure a proposed fix actually closes the risk rather than just changing its shape, say so explicitly rather than presenting it with unearned confidence.`,
    variables: [
      {
        name: 'files_changed',
        description: 'The specific files this security pass should focus on.',
        example:
          'app/api/reports/export/route.ts, lib/reports/buildQuery.ts, lib/reports/generatePdf.ts',
        required: true,
      },
      {
        name: 'risk_categories',
        description:
          'The categories most relevant to what this specific change touches, to keep the pass focused rather than a generic checklist.',
        example:
          'SQL injection risk in buildQuery.ts since it assembles a query from report filter params; path traversal risk in generatePdf.ts since it writes a file using a user-supplied report name.',
        required: true,
      },
      {
        name: 'trust_boundary',
        description:
          'Who can actually reach this code and with what level of control, since severity depends entirely on this.',
        example:
          'This endpoint is reachable by any authenticated user, including the lowest-privilege role — report filter params and the report name are both fully attacker-controlled from an authenticated session.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.2'],
    tags: [
      'security-review',
      'agent-mode',
      'secrets-detection',
      'injection-risk',
      'pre-pr-review',
    ],
    whyItWorks:
      'A general "review this for issues" pass reliably surfaces style and correctness feedback because those are the most statistically common things to find in a diff, which means security-specific risks compete for attention against a much larger volume of lower-stakes observations and often lose, not because the model can\'t find them but because nothing in a generic prompt tells it these categories deserve to be checked specifically and exhaustively rather than opportunistically. Naming the exact RISK_CATEGORIES relevant to what this change actually touches — SQL construction in one file, path handling in another — concentrates the check the same way a scoped code-review rubric does anywhere else, and it matters more here than in a general review because a missed security finding has a categorically different cost than a missed style nit. TRUST_BOUNDARY stated explicitly is what makes severity classification meaningful rather than arbitrary: the exact same unparameterized string-concatenation pattern is a Critical finding when the input reaching it is fully attacker-controlled from an authenticated low-privilege session, and a Low or even non-finding when the same code path is only ever reachable from a trusted internal service with no user input in the chain — a model asked to rate severity without being told who can actually reach the code will either rate everything as maximally severe out of caution, which trains reviewers to stop trusting the ratings, or rate based on how dangerous the pattern looks in isolation, which misses that context entirely. The explicit rule against fixes that suppress the symptom rather than close the risk targets a specific and common failure in AI-assisted security fixes: escaping a string, adding a try/catch around a failing query, or widening a type to make a linter warning disappear are all changes that make the finding go quiet without making the underlying trust violation stop existing, and a model asked generically to "fix" a flagged issue will reach for whichever change makes the warning disappear fastest unless explicitly told that disappearing the warning and closing the risk are not the same success condition.',
    exampleOutput: `1. lib/reports/buildQuery.ts:22 — Critical (attacker-controlled input, authenticated session, any role). Report filter values are concatenated directly into the SQL string via template literal, not parameterized. Fix: use the existing parameterized query builder (db.query with $1/$2 placeholders) already used elsewhere in this file for the date-range filter — the status filter on line 22 is the one place that skipped it.

2. lib/reports/generatePdf.ts:8 — High (attacker-controlled input, authenticated session). The report name is used directly in a file path passed to fs.writeFile with no sanitization — a name containing "../" could write outside the intended reports directory. Fix: sanitize with a strict allowlist regex on the name, or better, generate the filename server-side from the report's id rather than its user-editable name.

3. New dependency pdf-lite@0.9.2 added for generatePdf.ts — Medium, not a vulnerability but flagging: this is a low-download-count package for a task (PDF generation) that this repo's package.json already has a more established library available for elsewhere (pdfkit, used in lib/invoices/). Worth confirming this wasn't added just because it was the first result, before trusting it with file-write access.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.2', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against Cursor 2.2 Agent mode as a pre-PR security review pass.',
      },
    ],
  },
  {
    slug: 'cursor-agent-rest-api-endpoint-contract-brief',
    category: 'cursor',
    title: `Brief Cursor's Agent mode to design a REST endpoint from a contract, not from whatever shape falls out of the handler`,
    description: `A contract-first REST endpoint brief for Agent mode that pins down resource semantics, status-code mapping, and error-body shape before implementation starts, so the eventual handler matches an agreed contract instead of whatever shape came out naturally while wiring up the route.`,
    promptText: `You are designing and implementing a new REST endpoint in Agent mode. Do not start editing route handlers until the contract below is fixed — treat it as the spec the implementation has to match, not a draft you can quietly adjust once the code turns out easier to write one way than another.

ENDPOINT
{{http_method}} {{endpoint_path}}

RESOURCE SEMANTICS
{{resource_semantics}}

REQUEST SHAPE
{{request_shape}}

RESPONSE SHAPE (SUCCESS)
{{response_shape}}

ERROR CASES AND STATUS CODES
{{error_cases}}

EXISTING API CONVENTIONS TO MATCH
{{existing_conventions}}

BEFORE WRITING THE HANDLER
Restate the contract above back in one paragraph, in your own words, and flag anything ambiguous now — a status code not covered by an error case that could plausibly happen, a field whose type isn't fully specified. Do not proceed to implementation while an ambiguity is unresolved by quietly picking the version that's easiest to code.

IMPLEMENTATION RULES
- Validate the request shape at the boundary before any business logic runs; reject with the error case that matches, not a generic 400.
- Match the existing API conventions exactly for error body shape, pagination, and auth handling — a technically-fine response using a different error envelope than every other endpoint in this API is still wrong.
- Do not add a field to the response that isn't in RESPONSE SHAPE, even if it seems obviously useful — name it and ask, since an extra field becomes a de facto contract the moment a client starts depending on it.
- Do not silently narrow an error case to a subset of what it should cover (handling one invalid-input variant but not the sibling one in the same case) just because you found one first while testing.

WHEN DONE
List each error case from above and the exact status code and body the handler now returns for it, so the contract can be checked case by case rather than trusted from a summary. Separately, list any endpoint behavior you added beyond what's stated here.`,
    variables: [
      {
        name: 'http_method',
        description: `The HTTP verb for this endpoint.`,
        example: `POST`,
        required: true,
      },
      {
        name: 'endpoint_path',
        description: `The exact route path, including any path parameters.`,
        example: `/api/v1/orders/:orderId/refunds`,
        required: true,
      },
      {
        name: 'resource_semantics',
        description: `What this endpoint actually represents doing to the resource, stated precisely enough to disambiguate from a similar-looking action.`,
        example: `Creates a partial or full refund against an already-captured payment. Idempotent per idempotency key; does not cancel or modify the original order.`,
        required: true,
      },
      {
        name: 'request_shape',
        description: `The exact request body/params/query shape, with types.`,
        example: `{ amount: number (cents, > 0, <= remaining captured amount), reason: 'customer_request' | 'duplicate' | 'fraudulent', idempotencyKey: string }`,
        required: true,
      },
      {
        name: 'response_shape',
        description: `The exact success response shape, with types.`,
        example: `{ refundId: string, orderId: string, amount: number, status: 'pending' | 'succeeded', createdAt: string (ISO 8601) }`,
        required: true,
      },
      {
        name: 'error_cases',
        description: `Every error condition this endpoint must handle, mapped to a status code.`,
        example: `amount exceeds remaining captured amount -> 422 { code: 'amount_exceeds_captured' }; order not found -> 404; duplicate idempotency key with a different body -> 409; order not yet captured -> 409 { code: 'not_captured' }`,
        required: true,
      },
      {
        name: 'existing_conventions',
        description: `This API's existing conventions for error envelopes, pagination, and auth, so the new endpoint doesn't introduce a second style.`,
        example: `All errors return { error: { code, message } }. Auth is a Bearer token checked by requireAuth() middleware, never re-implemented per route.`,
        required: true,
      },
    ],
    targetTools: [`Cursor 2.2`],
    tags: [`rest-api`, `agent-mode`, `api-design`, `contract-first`, `error-handling`],
    whyItWorks: `Agent mode reads the surrounding framework and ORM conventions and will happily let a response shape emerge from whatever the handler naturally produces — a serialized model, a wrapped query result — rather than from a contract that was actually agreed on, which means the eventual response can drift from what a client was built against without either side noticing until an integration breaks. Fixing the contract before any file is touched, and requiring the model to restate it and surface ambiguity first, forces that negotiation to happen as a checkable paragraph rather than as an implicit decision baked silently into working code, which is a much harder thing to renegotiate once a client has already started depending on it. The explicit ban on adding an unrequested response field targets a specific and common agent habit: proactively enriching a response with a field that seems obviously useful — a computed total, a related object — reads as helpful in isolation, but the moment any client starts reading that field, it has become part of the contract whether or not it was ever agreed to be, and removing it later is now a breaking change nobody planned for. Requiring the exact status code and body to be listed per stated error case, rather than a general claim that errors are handled, converts "handles errors" from an unverifiable summary into something that can be checked line by line against the original list — which is also what catches the common failure mode of one error case actually covering two sibling conditions in the contract but the implementation only reaching the one that came up first during manual testing.`,
    exampleOutput: `Contract restated: this is a per-order partial/full refund, idempotent on idempotencyKey, requiring the order to already be captured. Ambiguity flagged: REQUEST SHAPE doesn't say what happens if amount is omitted entirely — treating it as "full remaining amount" unless told otherwise, flagging this assumption explicitly.

Error case coverage:
- amount exceeds remaining captured amount -> 422 { error: { code: 'amount_exceeds_captured', message } }
- order not found -> 404 { error: { code: 'not_found', message } }
- duplicate idempotency key, different body -> 409 { error: { code: 'idempotency_conflict', message } }
- order not yet captured -> 409 { error: { code: 'not_captured', message } }

No fields added beyond RESPONSE SHAPE.`,
    verifiedAgainst: [
      { tool: 'Cursor', version: '2.2', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against Cursor 2.2 Agent mode.`,
      },
    ],
  },
  {
    slug: 'cursor-agent-differential-bug-diagnosis-brief',
    category: 'cursor',
    title: `Have Cursor's Agent mode rank competing causes before it touches a production bug it can't reproduce locally`,
    description: `A differential-diagnosis brief for incidents where local reproduction isn't available — it forces the agent to list multiple candidate causes, score each against the actual evidence in hand, and name the one piece of evidence that would distinguish the top two, instead of committing to the first plausible-sounding explanation.`,
    promptText: `INCIDENT SYMPTOM
{{incident_symptom}}

EVIDENCE AVAILABLE
{{evidence_available}}

RECENT CHANGES THAT COULD BE RELATED
{{recent_changes}}

This cannot be reproduced locally right now — {{repro_constraint}} — so you are diagnosing from evidence alone, not from a failing test you can iterate against. Do not present a single cause as confirmed unless the evidence actually rules out the alternatives; a story that fits the symptom is not the same as a story the evidence has confirmed over its rivals.

STEP 1 — LIST CANDIDATE CAUSES
Name at least {{minimum_hypotheses}} distinct, genuinely different candidate causes consistent with the symptom — not one cause phrased three ways. For each, state what you'd expect to see in the evidence if it were true.

STEP 2 — SCORE AGAINST EVIDENCE
Go through EVIDENCE AVAILABLE line by line and, for each candidate, state whether that evidence supports it, contradicts it, or is silent on it. A candidate contradicted by even one piece of hard evidence gets demoted, not kept in contention just because it's otherwise the most attractive explanation.

STEP 3 — NAME THE DECIDING EVIDENCE
For the top two candidates still standing, state the one specific additional piece of evidence — a log line, a metric, a specific field on a specific record — that would distinguish between them, and where you'd look for it if it isn't already in EVIDENCE AVAILABLE.

STEP 4 — RECOMMEND, DON'T FIX YET
Name the single most likely cause and the fix you'd propose for it, but do not write that fix until the Step 3 evidence is actually checked. If checking it isn't possible right now, say so plainly and mark the recommendation unconfirmed rather than presenting it with the same confidence as a checked conclusion.`,
    variables: [
      {
        name: 'incident_symptom',
        description: `What was observed, from the outside, as precisely as it's known.`,
        example: `Roughly 2% of checkout requests return a 500 starting at 14:10 UTC, concentrated on orders with more than one line item.`,
        required: true,
      },
      {
        name: 'evidence_available',
        description: `The actual evidence in hand right now — logs, metrics, error rates, specific records — not a summary of what you assume it shows.`,
        example: `Error logs show a null-pointer in calculateShippingTotal for the affected requests. Deploy log shows a shipping-rates service deploy at 14:05 UTC. No corresponding spike in the shipping-rates service's own error rate.`,
        required: true,
      },
      {
        name: 'recent_changes',
        description: `Deploys, config changes, or data migrations around the time the symptom started, as candidate correlated causes to weigh.`,
        example: `shipping-rates service deployed at 14:05 UTC (adds a new zone-based pricing tier). No other deploys in the last 24 hours.`,
        required: true,
      },
      {
        name: 'repro_constraint',
        description: `Why this can't be reproduced locally right now, so the diagnosis is understood to rest on evidence rather than a failing test.`,
        example: `The affected shipping zones only exist in production data; staging has no multi-zone orders to trigger the path.`,
        required: true,
      },
      {
        name: 'minimum_hypotheses',
        description: `A floor on distinct candidate causes to force genuine breadth instead of one explanation restated.`,
        example: `3`,
        required: false,
      },
    ],
    targetTools: [`Cursor 2.2`],
    tags: [`bug-diagnosis`, `agent-mode`, `incident-response`, `root-cause-analysis`, `production-debugging`],
    whyItWorks: `A language model asked to diagnose a bug from a symptom description has a strong pull toward premature convergence on a single coherent, confident-sounding narrative, because that's the shape of answer its training rewards — and a story that merely fits the symptom's surface description is trivially easy to construct for almost any plausible cause, which is exactly why it isn't evidence of anything on its own. Requiring at least a stated minimum of genuinely distinct candidates before any scoring happens breaks that premature convergence by making the model commit to breadth before it's allowed to narrow, and the line-by-line evidence-scoring step in Stage 2 is what actually does the diagnostic work: it forces each candidate to be checked against specific facts rather than against the symptom's prose, which is where hypotheses that sound equally good on the surface start to separate, since real evidence supports some and contradicts others even when both stories are individually coherent. Naming the one piece of deciding evidence that would distinguish the top two remaining candidates matters because it converts "I believe it's X" into a falsifiable claim with a named test, which is the only thing that actually resolves a genuine tie between two evidence-consistent explanations — without it, the model defaults to picking whichever candidate it introduced first or described most fluently, which has no correlation with which one is actually correct. Marking an unconfirmed recommendation as unconfirmed, rather than presenting it with the same tone of certainty as a checked conclusion, matters specifically for incidents: a fix shipped against an unconfirmed cause can make the symptom subside for an unrelated reason — traffic dropping, a concurrent deploy, a cache expiring — and get credited as "fixed" while the actual cause ships unaddressed and recurs later under conditions nobody thought to re-check.`,
    exampleOutput: `Candidates: (1) new zone-pricing tier in shipping-rates returns a shape calculateShippingTotal doesn't expect for certain zones. (2) unrelated null-check regression already present before 14:05, coincidentally surfaced by unrelated traffic composition. (3) a race condition between cart total and shipping calc, unrelated to the deploy.

Scoring: no error-rate spike in shipping-rates itself contradicts candidate (1) being a shipping-rates bug directly, but supports a shape mismatch on the caller's side. Deploy timing lining up almost exactly with symptom onset contradicts (2) and (3) as coincidence explanations.

Deciding evidence: pull one affected request's raw shipping-rates response body from logging and check whether it includes the new zone-tier field that calculateShippingTotal's null-check doesn't handle.

Recommendation (unconfirmed pending that check): calculateShippingTotal doesn't handle the new zone-tier field shape introduced at 14:05.`,
    verifiedAgainst: [
      { tool: 'Cursor', version: '2.2', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against Cursor 2.2 Agent mode on a production incident with no local repro.`,
      },
    ],
  },
  {
    slug: 'cursor-agent-behavior-preserving-refactor-brief',
    category: 'cursor',
    title: `Force Cursor's Agent mode to prove a refactor changed nothing observable before calling it done`,
    description: `A pure-structure refactor brief that requires a characterization test capturing current behavior, bugs included, before any code moves, and forbids any change that isn't reachable purely by renaming, extracting, or reorganizing — so a refactor stays a refactor instead of quietly becoming an unannounced behavior change.`,
    promptText: `REFACTOR TARGET
{{target_module}}

GOAL STRUCTURE
{{goal_structure}}

KNOWN QUIRKS TO PRESERVE, NOT FIX
{{known_quirks}}

This is a structural refactor only — the observable behavior of {{target_module}} must be identical before and after, for every input a real caller could pass. If reaching GOAL STRUCTURE would require changing behavior anywhere, stop and name the conflict rather than refactoring through it.

STEP 1 — CAPTURE CURRENT BEHAVIOR
Before touching any code, write characterization tests against the current implementation covering: {{behavior_surface}}. These tests describe what the code does today, not what it should do — if something looks like a bug, capture it as current behavior anyway and flag it separately in your notes. Do not silently correct it while writing the test; that would mean testing against a target you already changed.

STEP 2 — REFACTOR
Restructure the code toward GOAL STRUCTURE using only moves that don't change behavior — extract, inline, rename, reorder, split, merge. If getting to the target shape genuinely requires a behavior difference somewhere, stop before making it and say so instead of quietly deciding the tradeoff yourself.

STEP 3 — CONFIRM
Run the Step 1 characterization tests against the refactored code, unmodified. Every one must still pass exactly as written. If a test needs to change to keep passing, that is evidence behavior changed, not evidence the test was wrong — report it as a break, not as a test fix.

WHAT NOT TO DO
- Do not fix a bug you flagged in Step 1 as part of this pass, even though you're already in the code.
- Do not rename anything not required to reach GOAL STRUCTURE just because you noticed a better name while in there — a drive-by rename is still an unannounced change to anyone reviewing this diff by intent, not by line count.
- Do not delete or loosen a characterization test that turns out to be inconvenient after the refactor; if it fails, the refactor is the thing in question, not the test.

WHEN DONE
State the number of characterization tests written, the number passing unmodified after the refactor, and every flagged-but-not-fixed quirk as a separate follow-up item, not folded into this change.`,
    variables: [
      {
        name: 'target_module',
        description: `The specific file, class, or module being restructured.`,
        example: `lib/billing/invoiceGenerator.ts`,
        required: true,
      },
      {
        name: 'goal_structure',
        description: `The end structural shape, described concretely enough to plan the extraction/split from.`,
        example: `Split the 400-line generateInvoice function into separate lineItemCalculator, taxCalculator, and formatter modules, each independently testable.`,
        required: true,
      },
      {
        name: 'behavior_surface',
        description: `What the characterization tests actually need to cover to count as a real safety net.`,
        example: `Every branch in the current tax-calculation logic (domestic, international, tax-exempt), rounding behavior at each step, and the exact line-item ordering in the final output.`,
        required: true,
      },
      {
        name: 'known_quirks',
        description: `Odd current behaviors that must be preserved even though they look wrong, so they get captured deliberately rather than accidentally fixed mid-refactor.`,
        example: `Tax-exempt orders currently still show a $0.00 tax line instead of omitting it — downstream PDF template relies on that line always being present.`,
        required: false,
      },
    ],
    targetTools: [`Cursor 2.2`],
    tags: [`refactoring`, `agent-mode`, `characterization-tests`, `behavior-preservation`, `code-review`],
    whyItWorks: `A model asked to refactor code will often quietly conflate "restructure" with "improve," because its training rewards output that looks better along every visible axis at once, and fixing a bug or renaming an awkward variable it notices along the way reads as strictly positive — but a refactor's entire value as a reviewable unit of work depends on the diff being behavior-neutral, and any snuck-in fix inside that diff makes it impossible for a reviewer to tell which lines are structural and which quietly changed what the system does. Requiring characterization tests written against current behavior, bugs and all, before any code moves converts the existing contract from something trusted to memory into something pinned down in an executable, checkable form, and explicitly instructing the model to capture a known bug as current behavior rather than fix it while it's right there closes the most common version of this conflation, where a genuine correctness fix hides inside what's presented as a pure restructure and becomes essentially unreviewable as a result, since a reviewer scanning a "just a refactor" diff has no reason to scrutinize logic for correctness the way they would a feature change. The instruction that a failing characterization test after refactor means the refactor is wrong, not the test, closes a related and easy-to-miss loophole: a model under pressure to make its own tests pass again will edit the test if that's the path of least resistance, which quietly redefines "unchanged" as whatever the new code happens to produce rather than what the old code actually did — the entire point of writing the test first is that it isn't allowed to move once behavior is supposed to be fixed.`,
    exampleOutput: `Step 1: wrote 14 characterization tests covering domestic/international/tax-exempt branches, rounding at each subtotal step, and line-item ordering. Flagged: tax-exempt orders emit a $0.00 tax line rather than omitting it — captured as-is per KNOWN QUIRKS, not fixed.

Step 2: split generateInvoice into lineItemCalculator.ts, taxCalculator.ts, and formatter.ts. No behavior-changing moves made; one planned extraction (memoizing the tax lookup) was skipped because it would have changed rounding order — flagged instead of made.

Step 3: all 14 characterization tests pass unmodified against the refactored code. 14/14 passing, 0 changed, 1 quirk logged as a separate follow-up (not fixed here).`,
    verifiedAgainst: [
      { tool: 'Cursor', version: '2.2', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Cursor 2.2 Agent mode on a structural refactor with characterization tests.`,
      },
    ],
  },
  {
    slug: 'cursor-agent-auth-flow-security-invariant-brief',
    category: 'cursor',
    title: `Give Cursor's Agent mode a security invariant list before it touches an authentication flow`,
    description: `A brief for modifying or extending an authentication or session flow that states non-negotiable security invariants up front and requires the agent to check its own diff against each one before finishing, so a working feature doesn't ship with a quietly weakened security check.`,
    promptText: `AUTH CHANGE
{{auth_change}}

CURRENT FLOW
{{current_flow_summary}}

SECURITY INVARIANTS — none of these may change as a side effect of this work, even temporarily during development
{{security_invariants}}

TOKEN / SESSION HANDLING RULES
{{token_handling_rules}}

AFFECTED CLIENTS / SERVICES RELYING ON CURRENT TOKENS
{{affected_clients}}

Implement the change above. While doing it:
- Never log a raw token, password, or secret value, even at debug level and even temporarily to check something — log an identifier or a boolean instead.
- Never weaken an existing check (an expiry, a signature verification, a scope check) to make a test pass or unblock local development with a plan to "tighten it back up later" — if a check is genuinely in the way of the change, say so explicitly and ask, don't route around it.
- Do not add a new code path that can produce a valid session or token without going through the same verification the existing paths use, even for a supposedly low-risk case like a test harness or an internal admin tool — that becomes the eventual weakest link.
- If the change touches token expiry, refresh, or revocation, state explicitly what happens to a token that's mid-flight — issued before the change, used after it ships — since a change that silently orphans or silently keeps trusting an old-format token is a real gap even when new tokens are handled correctly.

BEFORE FINISHING
Go through SECURITY INVARIANTS one at a time and state, for each, whether it still holds after your change and how you'd verify that — not just an assertion that it does. If any invariant is genuinely in tension with the requested change, stop and name the conflict rather than silently deciding which one wins.`,
    variables: [
      {
        name: 'auth_change',
        description: `The specific change being made to the auth flow.`,
        example: `Add refresh-token rotation: each refresh issues a new refresh token and invalidates the one used, instead of reusing the same refresh token indefinitely.`,
        required: true,
      },
      {
        name: 'current_flow_summary',
        description: `How the existing flow works today, so the change is understood against a known baseline.`,
        example: `Access tokens expire after 15 minutes; refresh tokens are long-lived (30 days) and currently reusable without rotation.`,
        required: true,
      },
      {
        name: 'security_invariants',
        description: `The non-negotiable properties that must hold before and after, stated as checkable facts, not general goals.`,
        example: `An expired access token is always rejected, no exceptions for internal service calls. A revoked refresh token can never mint a new access token, even once. No endpoint issues a token without passing through the shared verifyCredentials() path.`,
        required: true,
      },
      {
        name: 'token_handling_rules',
        description: `Specific rules for how tokens must be stored, transmitted, or compared in this codebase.`,
        example: `Refresh tokens are compared using a constant-time hash comparison, never a plain string equality check, and are never stored in plaintext in the database.`,
        required: true,
      },
      {
        name: 'affected_clients',
        description: `What already holds tokens issued under the current scheme, so mid-flight token behavior is grounded in what actually exists in production.`,
        example: `The mobile app caches a refresh token client-side for up to 30 days; roughly 40,000 active refresh tokens exist under the current non-rotating scheme at any time.`,
        required: false,
      },
    ],
    targetTools: [`Cursor 2.2`],
    tags: [`authentication`, `agent-mode`, `security-review`, `session-management`, `token-rotation`],
    whyItWorks: `A model implementing an auth change optimizes for the functional signal it's actually given — the feature works, the test suite passes — and a security check that was never named as an invariant is invisible to that optimization, which is exactly how a check gets loosened during development to unblock a local test and never gets tightened back, since nothing in "make refresh rotation work" flags that as a regression on its own. Stating security invariants as literal checkable facts, and requiring the model to walk through each one individually before finishing rather than give a single overall "looks secure" impression, forces an audit against a fixed list instead of a vibe check, which is the only format that reliably catches a narrow regression buried inside an otherwise-working diff. The explicit ban on logging raw secrets targets one of the most common and most easily forgotten transient habits in agent-assisted debugging: adding a console.log of a token to check why a comparison is failing is a completely reasonable debugging instinct, and it is also exactly the kind of line that survives into a shipped diff because nothing about "the feature now works" prompts its removal. The rule against a new bypass path for internal tooling addresses the single most common way a real backdoor actually ships — not through malice, but through a supposedly low-risk shortcut for a test harness or an admin script that's added with good intentions, works fine, and is never revisited once the real feature is done, quietly becoming the weakest link in the whole system. Naming mid-flight token behavior explicitly matters because an auth change is deployed against a live population of already-issued tokens, not a fresh empty database, and a quick local test only ever exercises newly issued tokens — the failure mode of a change that silently keeps trusting or silently orphans an old-format token in production is invisible to any test that doesn't specifically construct that scenario.`,
    exampleOutput: `Invariant check:
- Expired access token always rejected: holds — no change to the access-token verification path, confirmed by re-reading verifyAccessToken(), untouched by this diff.
- Revoked refresh token can never mint a new access token: holds, and now stronger — rotation means a used refresh token is marked revoked and refresh_used_check now runs before every mint, verified by a new test that reuses an already-rotated token and expects a 401.
- All tokens pass through verifyCredentials(): holds — no new issuance path added.

Mid-flight tokens: refresh tokens issued before this deploy have no rotation record yet; first refresh attempt on one of these is treated as a first use and rotated normally rather than rejected, so the ~40,000 existing tokens keep working without requiring a forced re-login.`,
    verifiedAgainst: [
      { tool: 'Cursor', version: '2.2', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against Cursor 2.2 Agent mode on a refresh-token rotation change.`,
      },
    ],
  },
  {
    slug: 'cursor-agent-typed-utility-edge-case-brief',
    category: 'cursor',
    title: `Pin Cursor's Agent mode to a genuinely typed utility, not one that leans on any to get through the edge cases`,
    description: `A short, direct brief for a single TypeScript utility function or module that states its exact signature, generic constraints, and edge-case behavior up front, and forbids any or an unnarrowed unknown as a way to dodge a hard case, so the function actually gives callers the safety a utility is supposed to provide.`,
    promptText: `Write {{utility_name}} in this codebase's utilities.

SIGNATURE
{{signature}}

WHAT IT DOES
{{behavior_description}}

EDGE CASES AND THEIR EXACT BEHAVIOR
{{edge_case_behavior}}

Generic constraints must be real, not decorative — if the signature says a generic extends a specific shape, every code path has to actually rely on that constraint being true, not silently assume something stronger and hope callers happen to satisfy it. Do not widen an input or return type to any, or to unknown without a narrowing check, as a way to get past a case the honest type would make awkward to express — if the correct type is genuinely hard to express, say so and propose the closest correct alternative (a discriminated union, an overload, a generic with a default) rather than quietly reaching for any.

WHAT NOT TO DO
- Do not return a looser type than the signature promises "just in case" — returning T | undefined where the signature says T is a silent contract change, not a safety net.
- Do not add a runtime check for an edge case and then leave the type signature unchanged, so the compiler still tells callers a case can't happen that the runtime code clearly handles.
- Do not use a type assertion to make an edge case compile instead of actually handling it — an assertion papering over a real mismatch is a lie the compiler is now required to repeat to every caller.
- Do not write this as a generic-looking helper that's actually only ever going to be called with one concrete type in practice — a false generic adds indirection without adding real reuse.

WHEN DONE
For each edge case listed above, quote the line of code that handles it and confirm the return type at that line matches the signature exactly. If any edge case turns out to need a change from the signature stated in SIGNATURE, say so and explain why, rather than forcing the original signature to fit anyway.`,
    variables: [
      {
        name: 'utility_name',
        description: `The name of the function or module being written.`,
        example: `groupByKey`,
        required: true,
      },
      {
        name: 'signature',
        description: `The exact TypeScript signature, generics included.`,
        example: `function groupByKey<T, K extends keyof T>(items: readonly T[], key: K): Map<T[K], T[]>`,
        required: true,
      },
      {
        name: 'behavior_description',
        description: `A precise, non-generic description of what the function does with normal input.`,
        example: `Groups an array of objects into a Map keyed by the value at the given property, preserving original insertion order within each group.`,
        required: true,
      },
      {
        name: 'edge_case_behavior',
        description: `Every edge case and exactly what should happen for it, so behavior isn't left to whatever's convenient to implement.`,
        example: `Empty input array returns an empty Map, not undefined. A key value of undefined or null on some items still groups them together under that exact value, rather than being dropped from the result.`,
        required: true,
      },
    ],
    targetTools: [`Cursor 2.2`],
    tags: [`typescript`, `agent-mode`, `type-safety`, `utility-functions`, `generics`],
    whyItWorks: `When a generic constraint or an edge case makes a signature genuinely awkward to satisfy, the path of least resistance for a model trying to get code to typecheck quickly is to reach for any, an unnarrowed unknown, or a type assertion — all three make the compiler stop complaining without actually resolving the mismatch, which defeats the entire purpose of writing a typed utility in the first place, since the bug the type system would have caught at the call site simply gets relocated to a runtime failure nobody is warned about. Explicitly banning that shortcut while simultaneously naming real alternatives — a discriminated union, an overload, a generic with a default — matters because a bare prohibition with no replacement just pushes the model toward a different, quieter version of the same shortcut; giving it an actual escape hatch that preserves safety changes what it reaches for under the same time pressure that would otherwise produce an any. The rule against a return type that's "loosened just in case" targets a related but distinct failure mode: an overcautious T | undefined return preemptively defends against every edge case at once by pushing a null-check onto every single caller forever, rather than resolving the specific case inside the utility once, which is the entire reason to centralize logic in a utility instead of duplicating a check everywhere it's used. The instruction to catch a runtime check whose type signature was never updated addresses a drift pattern that's especially common in agent-driven edits across a longer session: the model edits the implementation to handle a case it discovers partway through, but the signature was already mentally locked in from the start of the task and doesn't get revisited, leaving the compiler asserting something the runtime code visibly contradicts.`,
    exampleOutput: `function groupByKey<T, K extends keyof T>(items: readonly T[], key: K): Map<T[K], T[]> {
  const result = new Map<T[K], T[]>()
  for (const item of items) {
    const k = item[key]
    const group = result.get(k)
    if (group) group.push(item)
    else result.set(k, [item])
  }
  return result
}
// Empty input: loop never runs, returns an empty Map — matches SIGNATURE (Map<T[K], T[]>, never undefined).
// null/undefined key values: Map.get/set treat them as valid keys directly, so items group correctly under that exact value — no widening to any was needed for this case.`,
    verifiedAgainst: [
      { tool: 'Cursor', version: '2.2', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against Cursor 2.2 Agent mode on a strict-mode TypeScript utility.`,
      },
    ],
  },
  {
    slug: 'cursor-agent-node-worker-service-brief',
    category: 'cursor',
    title: `Brief Cursor's Agent mode to build a Node worker service that survives a restart mid-job`,
    description: `A brief for a Node.js background or queue-consumer service that states idempotency requirements, graceful shutdown behavior, and what 'processed' actually means, so Agent mode doesn't ship a worker that quietly double-processes a job or drops one on restart.`,
    promptText: `SERVICE
{{service_name}} — a Node background worker that {{job_description}}.

QUEUE / TRIGGER SOURCE
{{queue_source}}

WHAT COUNTS AS "PROCESSED" — the exact moment a job may be considered done and safely acknowledged
{{processed_definition}}

IDEMPOTENCY REQUIREMENT
{{idempotency_requirement}}

FAILURE MODE TO AVOID
{{failure_to_avoid}}

Build this so a process restart, a crash mid-job, or a duplicate delivery from {{queue_source}} never produces {{failure_to_avoid}}. Specifically:

1. Only acknowledge or remove a job from the queue after the PROCESSED_DEFINITION above is actually true, not after the work is merely dispatched or after an in-memory step completes that hasn't been durably recorded yet — an early acknowledgment is how a crash between "dispatched" and "durably done" loses a job silently.
2. Implement the idempotency requirement as a real check against durable state (a processed-ids table, a unique constraint), not a best-effort in-memory guard that resets to empty on every restart — an in-memory-only guard protects against a same-process retry and nothing else, which is not the case that actually matters here.
3. Handle SIGTERM by stopping acceptance of new jobs, finishing or safely abandoning the in-flight one according to PROCESSED_DEFINITION, and exiting — do not let the process get killed with a job half-applied and no record of how far it got.
4. Log enough at each job's start and completion to answer "was this specific job id processed, and exactly once, or not" from logs alone after the fact, without needing to reproduce the failure to find out.

WHEN DONE
Walk through what happens, step by step, if the process is killed at three points: before dispatch, mid-processing, and after processing but before acknowledgment. State explicitly whether each scenario results in the job being lost, double-processed, or correctly handled exactly once.`,
    variables: [
      {
        name: 'service_name',
        description: `The name of the worker service.`,
        example: `invoice-export-worker`,
        required: true,
      },
      {
        name: 'job_description',
        description: `What one job of work actually does, in plain terms.`,
        example: `generates a PDF invoice for a completed order and uploads it to the customer-facing document store`,
        required: true,
      },
      {
        name: 'queue_source',
        description: `The trigger mechanism and its delivery guarantees, so the model knows what kind of duplicate/ordering behavior to defend against.`,
        example: `An SQS queue with at-least-once delivery and no ordering guarantee across messages.`,
        required: true,
      },
      {
        name: 'processed_definition',
        description: `The exact durable condition that must be true before a job counts as done.`,
        example: `The generated PDF's checksum has been written to the invoices.exports table with status='complete' — not merely that the upload API call returned 200.`,
        required: true,
      },
      {
        name: 'idempotency_requirement',
        description: `What must be true if the same job is delivered or triggered twice.`,
        example: `A second delivery of the same orderId must not generate or upload a second PDF; it should detect the existing complete export and no-op.`,
        required: true,
      },
      {
        name: 'failure_to_avoid',
        description: `The specific bad outcome that idempotency and durability are meant to prevent, stated concretely.`,
        example: `a customer receiving two different invoice PDFs for the same order, or an order silently never getting an invoice at all`,
        required: true,
      },
    ],
    targetTools: [`Cursor 2.2`],
    tags: [`node-service`, `agent-mode`, `background-jobs`, `idempotency`, `graceful-shutdown`],
    whyItWorks: `A straightforward "build a worker that processes X from a queue" brief tends to produce code that's correct on the happy path — a message arrives, gets processed, gets acknowledged — because that's the only path a quick manual test naturally exercises, while the failure modes that actually matter for a background service, a restart mid-job, a duplicate delivery, a crash between two specific steps, never surface under that kind of testing since they require literally killing the process at a precise moment, which nobody does by hand during a normal review. Stating a literal PROCESSED_DEFINITION turns "handle it correctly" into a checkable line: does the code acknowledge before or after that specific durable condition, rather than an implicit assumption that's easy to get subtly wrong — acknowledging on dispatch instead of on durably-recorded completion is a one-line difference that looks harmless in a diff and only manifests as silent data loss under a crash that's hard to reproduce on demand. The instruction to implement idempotency against durable state rather than in-memory targets a specific and common shortcut: an in-memory Set of processed ids is trivial to write, passes any test that doesn't literally restart the process, and provides zero protection against exactly the restart scenario the idempotency requirement exists for in the first place — the two implementations look identical in a demo and diverge only in production, under precisely the condition hardest to catch in code review. Requiring the walk-through of process-killed-at-three-points at the end forces explicit reasoning about the code's failure behavior instead of letting a reader assume it handles it because the happy path looks fine — a background worker's actual correctness lives almost entirely in these restart-boundary cases, which a review skimming the main logic will not naturally exercise.`,
    exampleOutput: `Process killed before dispatch: message remains unacknowledged in SQS, redelivered after visibility timeout — no job lost, no duplicate created since nothing started.

Process killed mid-processing (PDF generated, not yet uploaded): message still unacknowledged, redelivered. On redelivery, checks invoices.exports for this orderId, finds no 'complete' row, re-generates and uploads — correctly handled, no duplicate customer-facing invoice since the previous attempt never reached upload.

Process killed after upload but before acknowledgment: message redelivered. Checks invoices.exports, finds a 'complete' row with a matching checksum already written before the crash, no-ops and acknowledges — correctly handled exactly once, no second PDF generated or uploaded.`,
    verifiedAgainst: [
      { tool: 'Cursor', version: '2.2', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against Cursor 2.2 Agent mode building an SQS-backed Node worker.`,
      },
    ],
  },
  {
    slug: 'cursor-agent-performance-budget-implementation-brief',
    category: 'cursor',
    title: `Give Cursor's Agent mode a performance budget to build inside, not a bottleneck to fix afterward`,
    description: `A brief for building a new feature against a stated performance budget from the start, requiring the agent to price each meaningful implementation decision against that budget as it goes, instead of optimizing only after something has already shipped and been measured as slow.`,
    promptText: `FEATURE
{{feature_description}}

PERFORMANCE BUDGET FOR THIS FEATURE — a hard constraint on the implementation, not an afterthought to check once it's done
{{performance_budget}}

WHAT COUNTS TOWARD THE BUDGET
{{budget_scope}}

BASELINE, BEFORE THIS FEATURE EXISTS
{{current_baseline}}

As you build this, do not treat the budget as something to verify only at the end. At each meaningful implementation decision — adding a dependency, choosing a data-fetching pattern, adding a re-render trigger — state briefly what it's expected to cost against the budget, using BUDGET_SCOPE as what actually counts. If a design choice would plausibly blow the budget, say so before writing it and propose the cheaper alternative, rather than building the expensive version first and discovering the number afterward when it's a bigger diff to undo.

DEPENDENCY / LIBRARY RULE
Do not add a new dependency to satisfy part of this feature without first checking its cost against the budget (bundle size, cold-start cost, whatever BUDGET_SCOPE names) — a library that solves the problem elegantly but alone consumes a third of the total budget is not a free win just because it works.

WHEN DONE
Measure the actual cost against BUDGET_SCOPE the same way CURRENT_BASELINE was measured, and report the number next to the budget, not just "should be fine." If it's over budget, do not report it as done with a caveat — identify the specific contributor responsible for the overage and either fix it now or state explicitly what would need to change and why that's out of scope for this pass.`,
    variables: [
      {
        name: 'feature_description',
        description: `What the feature does, concretely enough to plan implementation decisions from.`,
        example: `Add a live search-as-you-type dropdown to the product listing page, querying the catalog API on each keystroke after a short debounce.`,
        required: true,
      },
      {
        name: 'performance_budget',
        description: `The specific numeric ceiling this feature must stay under.`,
        example: `Adds no more than 15KB gzipped to the page's JS bundle, and the dropdown's first result must render within 250ms of the debounce firing on a throttled 4G profile.`,
        required: true,
      },
      {
        name: 'budget_scope',
        description: `Exactly what is measured and counted toward the budget, so the number is unambiguous.`,
        example: `Bundle size measured via the existing webpack-bundle-analyzer build step, scoped to the product-listing route's chunk only. Render time measured via Chrome DevTools Performance panel, from debounce-fire to first result painted.`,
        required: true,
      },
      {
        name: 'current_baseline',
        description: `The measured cost of the page before this feature exists, using the same method the final measurement must use.`,
        example: `Product-listing route chunk is currently 142KB gzipped; page interactive at 1.1s on the same throttled 4G profile.`,
        required: true,
      },
    ],
    targetTools: [`Cursor 2.2`],
    tags: [`performance-optimization`, `agent-mode`, `performance-budget`, `frontend`, `proactive-optimization`],
    whyItWorks: `A "make it fast" instruction given only after a feature already exists puts the model in the position of reducing a cost it has already committed a specific shape to — a chosen data-fetching pattern, a re-render trigger, a dependency — which is measurably harder and more invasive than never incurring that cost in the first place, since by the time anyone measures it, the expensive choice is already threaded through several files and unwinding it is a second, larger diff on top of the first. Stating the budget upfront as a constraint on the choices being made, rather than a target to hit afterward, changes which question the model is actually answering at each step — from "does this work" to "does this work within this number" — and those two questions produce genuinely different code, not the same code that just happens to get measured differently later. The instruction to price a new dependency against the budget before adding it targets a specific and reliable blind spot: an agent evaluating whether a library is a good choice for a feature will confidently answer "does this solve the stated functional problem," but virtually never checks it against a performance budget unless explicitly asked to, because those are two different questions and only one of them is implied by "pick a library that does X." Requiring the final measurement to use the exact same method as CURRENT_BASELINE, rather than a fresh ad hoc check, matters because two numbers produced by two different measurement methodologies aren't actually comparable even though they look like they are — and a looser, less careful measurement taken at the end, under time pressure to call the feature done, is exactly where a real budget overage hides behind noise in how it was measured rather than getting caught.`,
    exampleOutput: `Dependency check: considered use-debounce (2KB gzipped) vs. hand-rolling a 15-line debounce hook (0KB) — hand-rolled version chosen, since the library's extra API surface isn't needed here and every KB counts against the 15KB ceiling.

Data-fetching: chose a single AbortController-cancelled fetch per keystroke over a library-based query cache, since a full query-cache dependency would have consumed roughly a third of the bundle budget on its own for a feature that only needs cancel-on-new-keystroke behavior.

Final measurement (same method as baseline): product-listing chunk now 153.4KB gzipped (+11.4KB, under the 15KB ceiling). First result paints at 210ms after debounce fire on throttled 4G (under the 250ms ceiling).`,
    verifiedAgainst: [
      { tool: 'Cursor', version: '2.2', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against Cursor 2.2 Agent mode building a bundle- and render-time-budgeted feature.`,
      },
    ],
  },
]
