import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'claude-md-project-context',
    category: 'claude-code',
    title: 'Give Claude Code project context it will not forget mid-session',
    description:
      'A CLAUDE.md / AGENTS.md-style project context file you drop into the repo root once, so every future session inherits your stack, commands, and hard constraints automatically instead of you re-explaining them in each chat.',
    promptText:
      "PROJECT CONTEXT — {{project_name}}\n\nThis file is loaded automatically into context at the start of every session in this repo (Claude Code reads CLAUDE.md, Cursor reads .cursorrules or AGENTS.md, Windsurf reads .windsurfrules, GitHub Copilot reads a repository custom instructions file — save this as whichever your tool expects). Treat every rule below as a hard requirement, not a suggestion, unless a human explicitly overrides it in chat for one specific task.\n\nSTACK AND ENVIRONMENT\n{{tech_stack}}\n\nCOMMANDS\n- Install dependencies using the project's existing lockfile. Never switch package managers.\n- Run tests: {{test_command}}\n- Run lint and typecheck before declaring any task done, not after.\n\nNON-NEGOTIABLE RULES\n- Never commit directly to main. Always work on a branch and open a pull request.\n- Never add a new dependency without naming it and asking first. No silent additions to the manifest file.\n- Never delete or rewrite a test to make it pass. If a test looks wrong, say so and ask before touching it.\n- {{forbidden_patterns}}\n- If a task requires touching more than five files or changing a public interface, stop and describe the plan before writing code.\n\nWHEN YOU ARE UNSURE\nAsk one specific question rather than guessing and proceeding. A wrong guess that ships is worse than a five-second question.\n\nDEFINITION OF DONE\n- Tests pass locally using the exact command above.\n- Lint and typecheck are clean.\n- No unrelated files changed.\n- The change is explained in plain language in your final message, not just left as a diff.",
    variables: [
      {
        name: 'project_name',
        description: 'The name of the project or repo, used in the file header.',
        example: 'tools.scult.in',
        required: true,
      },
      {
        name: 'tech_stack',
        description:
          'The languages, frameworks, and key libraries this project uses, so the assistant does not guess wrong tooling.',
        example: 'Next.js 15 App Router, TypeScript strict mode, Tailwind CSS, Vitest',
        required: true,
      },
      {
        name: 'test_command',
        description: 'The exact shell command that runs the test suite.',
        example: 'npm run test',
        required: true,
      },
      {
        name: 'forbidden_patterns',
        description:
          'Any project-specific anti-patterns worth naming explicitly, beyond the generic rules above.',
        example:
          'Never use any in TypeScript without a justified comment; never add a new npm dependency under 500 weekly downloads.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Windsurf', 'GitHub Copilot'],
    tags: [
      'claude-md',
      'context-engineering',
      'rules-file',
      'project-setup',
      'onboarding',
    ],
    whyItWorks:
      "Claude Code, Cursor's .cursorrules or AGENTS.md, Windsurf's .windsurfrules, and GitHub Copilot's repository custom instructions file are all loaded automatically at the start of every session, so a constraint written once here persists for the life of the project instead of being retyped into every chat — this is the documented shift the research calls context engineering replacing one-off prompting. Phrasing rules as hard imperatives such as never and always, rather than polite hedges, matters mechanically: Anthropic's own prompt-engineering guidance is explicit that Claude responds to clear, direct instruction rather than inference from a soft ask, and a single hedge word such as maybe check if is enough for an agentic assistant to treat a rule as optional. This is also why a rules file is now the more durable mechanism than older tricks like stuffing a fake compliant reply into a prefilled assistant turn to force behavior — current Claude models reject malformed prefill and assistant-turn tricks outright, returning a 400 error on invalid prefill shapes on recent versions, so a real, readable instruction document the model actually reasons over is the only reliable lever left, and it happens to be the better one anyway.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-30' },
      { tool: 'Cursor', version: '2.0', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.0.',
      },
    ],
  },
  {
    slug: 'stop-over-engineering-bug-fix',
    category: 'claude-code',
    title: 'Stop Claude Code from over-engineering a bug fix',
    description:
      'A constraint block to paste in front of a bug report that locks Claude Code, or any agentic coding assistant, to the minimal fix, an explicit acceptance checklist, and a hard no-refactor boundary.',
    promptText:
      'You are fixing exactly one bug. You are not refactoring, redesigning, renaming, or reformatting anything else in this file or repo, even if you notice something else that looks wrong while you are in there.\n\nBUG\n{{bug_report}}\n\nACCEPTANCE CRITERIA\n{{acceptance_criteria}}\n\nCONSTRAINTS\n- Change only what is required to satisfy every item in the acceptance criteria above. Nothing else.\n- Do not rename variables, extract functions, reformat unrelated lines, or add abstractions while you are in there.\n- Do not add new dependencies, new config, or new files unless the bug is provably unfixable without one. If so, stop and say why before writing code.\n- Do not add speculative error handling, logging, or validation for cases that are not in the bug report.\n- If satisfying the acceptance criteria requires touching more than two files, stop and explain the plan before writing any code.\n\nOUTPUT FORMAT\n1. One-sentence root cause.\n2. The diff, and nothing but the diff.\n3. A line mapping each changed line to the acceptance criterion it satisfies.\n4. A final line: either "No other changes were made." or a named exception with the reason it was unavoidable.',
    variables: [
      {
        name: 'bug_report',
        description:
          'The bug, exactly as reported — symptom, steps to reproduce, and where it happens.',
        example:
          'Clicking Export CSV on the reports page throws a TypeError reading toFixed of undefined when a report has zero rows.',
        required: true,
      },
      {
        name: 'acceptance_criteria',
        description: 'A numbered list of what must be true for the fix to count as done.',
        example:
          '1. Exporting a zero-row report downloads an empty CSV with headers only, no error. 2. Exporting a report with rows is unchanged. 3. No new console errors.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Windsurf'],
    tags: ['bug-fix', 'constraint-block', 'scope-control', 'agentic-coding'],
    whyItWorks:
      'Agentic coding assistants are documented to expand scope opportunistically. Once a model is editing a file it tends to clean up adjacent code unless explicitly told not to, because the same training signal that makes it helpful also makes it eager to keep going. Naming the negative space directly, such as do not rename, do not reformat, do not add abstractions, closes exactly the loopholes a vaguer just fix the bug leaves open — Claude and similar models follow explicit, direct constraints far more reliably than they infer scope boundaries from context. The numbered acceptance criteria block gives the model a checkable exit condition instead of a subjective good enough, so it can verify its own diff against a list rather than deciding when it is done, which is precisely the moment scope creep otherwise starts. Separating the bug, the acceptance criteria, and the constraints into distinct labeled sections also reduces cross-contamination in longer tickets — the model is far less likely to treat a description of the broken behavior as an instruction to also fix nearby code when the two are structurally separated.',
    exampleOutput:
      "1. Root cause: formatRowCount divides rows.length by total and calls toFixed on the result without guarding total equals zero, producing NaN.toFixed which throws.\n\n2. Diff:\n- const avg = (rows.length / total).toFixed(1)\n+ const avg = total === 0 ? '0.0' : (rows.length / total).toFixed(1)\n\n3. This line satisfies criterion 1, the zero-row export no longer throws, and criterion 2, the non-zero path is unchanged.\n\n4. No other changes were made.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'code-review-checklist-rubric',
    category: 'claude-code',
    title: 'Turn Claude into a consistent code reviewer instead of a vibes check',
    description:
      'A fixed-rubric code review prompt with six named categories and a forced pass or fail verdict, so every pull request gets the same systematic review instead of whatever the model happens to notice first.',
    promptText:
      'You are reviewing this change as a senior engineer whose name goes on the approval. Cite exact line numbers or hunks. Do not soften an actual defect into a "just a suggestion" — say plainly whether it blocks merge.\n\nREVIEW CATEGORIES\n1. Correctness — does the logic do what the pull request claims? Any off-by-one, race condition, null or undefined path, or missed edge case?\n2. Security — injection risk, auth or authorization gaps, secrets in code, unsafe deserialization, unvalidated input crossing a trust boundary.\n3. Tests — do the tests actually exercise the changed behavior, or just re-assert the implementation? Is there a case the diff clearly needed but did not add?\n4. Readability and naming — would a new engineer understand this in six months without asking the author?\n5. Scope — does this diff do only what the description says, or is there an unrelated drive-by change bundled in?\n6. Performance — any new N+1 query, unbounded loop, or blocking call on a hot path?\n\nOUTPUT FORMAT\nFor each category: PASS, CONCERN, or BLOCKING, one line of reasoning, and a file or line reference if not PASS.\nEnd with one verdict: APPROVE, APPROVE WITH COMMENTS, or REQUEST CHANGES. No verdict is valid without a one-sentence justification.\n\nPaste the diff or files under review below this line, unedited.',
    variables: [],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf'],
    tags: ['code-review', 'checklist', 'rubric', 'pull-request'],
    whyItWorks:
      "A generic review this pull request prompt reliably produces a different-shaped answer every time, sometimes a paragraph on style and nothing on security, because the model has no fixed frame to fill in. Giving it six named, closed categories forces systematic coverage of the same ground on every review, the same mechanic behind Claude Code's own built-in security review command scanning by category rather than freeform. Requiring a pass, concern, or blocking rating per category, not prose, also prevents the single most common failure mode of AI code review: a vague looks good overall that never actually commits to a position on any specific line. Forcing a final verdict with a one-sentence justification closes the last gap — a model asked only to review will often describe the code back to you instead of judging it, while a forced choice between approve, approve with comments, or request changes requires it to take a stance.",
    exampleOutput:
      '1. Correctness: PASS.\n2. Security: PASS.\n3. Tests: CONCERN — the new discount path in lib/checkout/discount.ts has no test for an expired code; add one before merge.\n4. Readability and naming: PASS.\n5. Scope: BLOCKING — this diff also reformats unrelated-file.ts with no stated reason; split it out or explain it.\n6. Performance: PASS.\n\nVerdict: REQUEST CHANGES — the missing expired-code test and the unexplained unrelated file change should be resolved before this merges.',
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' },
      {
        tool: 'GitHub Copilot',
        version: 'Copilot Chat 1.250 (VS Code)',
        date: '2026-07-18',
      },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and GitHub Copilot Chat.',
      },
    ],
  },
  {
    slug: 'explain-this-codebase-onboarding',
    category: 'claude-code',
    title: 'Get a new codebase explained top-down before you touch a line',
    description:
      'An onboarding prompt that forces a layered, top-down explanation of an unfamiliar codebase — entry point, architecture, data flow, then the non-obvious traps — instead of a flat file-by-file dump.',
    promptText:
      'You are onboarding a new engineer onto this codebase. Assume they can read code but have zero context on this project\'s specific decisions. Do not describe syntax. Describe intent, architecture, and traps.\n\nSCOPE\n{{focus_area}}\n\nEXPLAIN IN THIS ORDER\n1. What does this codebase do, in two sentences, for someone who has never seen it?\n2. Entry point or points — where does execution actually start, and what is the first meaningful thing that happens?\n3. Architecture — the four to six major modules or layers and, for each, its one job and what it explicitly does not do.\n4. Data flow — trace one realistic request or action end to end through those layers, naming real files.\n5. State and side effects — what is stateful, where, and what breaks if two of those run concurrently?\n6. The traps — the three to five things that look obvious but are not: a naming choice that is misleading, a module that looks unused but is not, a place where the easy fix is actually wrong.\n\nCONSTRAINTS\n- Cite real file paths and function or class names, not generic descriptions.\n- If you are inferring rather than certain because no comment or doc confirms it, say "likely" or "appears to." Do not present a guess as fact.\n- Stop after item 6. Do not propose changes or improvements unless asked.',
    variables: [
      {
        name: 'focus_area',
        description:
          'Narrow the explanation to one subsystem instead of the whole repo. Leave blank for a full-codebase walkthrough.',
        example: 'the checkout and payment flow',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf'],
    tags: ['onboarding', 'codebase-explanation', 'architecture', 'context-engineering'],
    whyItWorks:
      "Given a bare explain this codebase request, models default to a flat, file-by-file recap because that is the path of least resistance through the context window, not because it is the most useful shape — it burns the reader's attention without building a mental model. Fixing the traversal order from entry point to architecture to data flow to statefulness to traps exploits the model's real strength, synthesizing many files into a structure, while removing the choice of shape that produces the flat dump. The step asking what looks obvious but is not matters specifically because a generic explain this prompt optimizes for describing what the code does, which the model can already do from the code alone; asking for what is non-obvious forces it to reason about what would mislead a newcomer, which is the actual value an onboarding document needs to deliver. The explicit instruction to say likely rather than present a guess as fact matters because codebase explanations are exactly the kind of task where a fluent, confident-sounding wrong claim about why a module exists is more dangerous than an admitted gap.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-15' }],
    changelog: [
      {
        date: '2026-07-15',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'generate-tests-for-edge-cases',
    category: 'claude-code',
    title: 'Generate tests that actually cover edge cases, not just the happy path',
    description:
      'A test-generation prompt that enumerates the edge case categories to hit and forces a table-driven format, countering the well-documented happy-path bias of LLM-written tests.',
    promptText:
      'You are writing tests for the code below. Your job is to find where it breaks, not to confirm that it works. A test suite that only exercises the happy path is a failed task, even if every test passes.\n\nTARGET\n{{target}}\n\nKNOWN EDGE CASES\n{{known_edge_cases}}\n\nREQUIRED COVERAGE\nFor every public function or branch, explicitly consider it and either test it or state why it does not apply:\n- Boundary values: empty, zero, negative, max length, single element versus many.\n- Null, undefined, or missing-field inputs, including partially malformed objects.\n- Type edge cases the type system does not fully prevent at runtime, such as JSON received from an API.\n- Error and exception paths — does the function fail loudly and correctly, or silently do the wrong thing?\n- Concurrency or repeat-call cases if the function has any shared or cached state.\n- Any case listed under known edge cases above, even if it seems unlikely.\n\nFORMAT\n- Table-driven or parametrized tests, one assertion pattern reused across cases, not near-duplicate copy-pasted test functions.\n- Name each test case after the behavior it verifies, not test1, test2.\n- Do not write snapshot tests unless explicitly asked.\n- After the tests, list any coverage gap you could not close and why, for example it requires a live network call or a fixture that does not exist yet.',
    variables: [
      {
        name: 'target',
        description:
          'The function, file, or behavior to write tests for — paste the code or describe it precisely.',
        example:
          'parseDiscountCode(code, cart) in lib/checkout/discount.ts, returns a DiscountResult',
        required: true,
      },
      {
        name: 'known_edge_cases',
        description:
          'Edge cases you already know matter, so the assistant does not have to guess them.',
        example:
          'expired codes, codes with leading or trailing whitespace, valid codes where the cart total is below the minimum spend',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf'],
    tags: ['testing', 'test-generation', 'edge-cases', 'tdd'],
    whyItWorks:
      "Left unconstrained, LLM-generated tests mirror the shape of the code they are testing rather than adversarially probing it — a well-documented bias toward happy-path coverage, because the model is pattern-matching what this function does rather than how this function could be called wrong. Explicitly enumerating edge-case categories such as boundaries, null and undefined, type edge cases, error paths, and concurrency converts an implicit judgment call into an explicit checklist the model has to work through category by category, which is harder to shortcut than an open-ended write tests for this. The known edge cases variable exists because the model cannot know a codebase's actual failure history — a bug you already fixed once is exactly the case worth forcing into the suite by name rather than hoping the model rediscovers it. Requiring table-driven format over copy-pasted test functions is also a coverage mechanism, not just a style preference: a missing row is visually obvious in a table, where a missing near-duplicate function is easy to not notice at all.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-28' },
      { tool: 'Cursor', version: '2.0', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.0.',
      },
    ],
  },
  {
    slug: 'refactor-preserve-behavior',
    category: 'claude-code',
    title: 'Refactor safely and get the diff explained, not just dumped',
    description:
      'A refactor prompt that makes preserving external behavior an explicit, checkable constraint and requires the model to justify each change before you review the diff.',
    promptText:
      'You are refactoring, not rewriting. The observable behavior of this code — inputs, outputs, side effects, error conditions, and public signatures — must be identical before and after, unless the preservation constraint below explicitly allows something to change.\n\nSCOPE\n{{target_scope}}\n\nMUST PRESERVE\n{{preserve_constraint}}\n\nPROCESS\n1. Before writing any code, list what you intend to change and why, for example extract X into its own function because it is duplicated in three places. Do not start editing until this list is written.\n2. Make the change.\n3. Run the existing test suite. If any test needs to change to keep passing, that is a signal you changed behavior, not just structure. Stop and explain rather than editing the test to match.\n4. For each hunk in the diff, write one line: what changed structurally, and confirm what stayed behaviorally identical.\n\nCONSTRAINTS\n- Do not change public function signatures, exported names, or return shapes unless the preservation constraint explicitly permits it.\n- Do not fix unrelated bugs you notice mid-refactor. Note them separately instead.\n- If achieving the goal in scope is impossible without a behavior change, stop and say so before writing code. Do not make the change silently and mention it only at the end.',
    variables: [
      {
        name: 'target_scope',
        description:
          'Exactly what to refactor and the one goal of the refactor — not a general cleanup mandate.',
        example:
          'OrderProcessor.calculateTotal in services/order-processor.ts — reduce the nested if and else into something readable, no other goal.',
        required: true,
      },
      {
        name: 'preserve_constraint',
        description:
          'What specifically must not change, if anything beyond the default of full behavior preservation.',
        example:
          'The public method signature and its Decimal return type must not change; internal helper functions may be renamed freely.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Windsurf'],
    tags: ['refactoring', 'behavior-preservation', 'code-quality'],
    whyItWorks:
      "Refactor this is underspecified in a way agentic assistants exploit — without an explicit definition of what must stay the same, a model will change a signature, alter an edge-case return value, or improve error handling while still calling the result a refactor, because nothing told it not to. Naming behavior preservation as a checkable constraint covering inputs, outputs, side effects, error conditions, and signatures gives it a specific target to verify against rather than a vague quality bar. Requiring the change list before the edit, and requiring the existing test suite to pass without modification, converts trust the diff into verify the diff against a stated plan and a green test run — if a test needs to change to keep passing, that is the exact signal a refactor silently became a behavior change, and the prompt makes stopping there the explicit instruction rather than leaving it to the model's judgment. Asking for a one-line structural-versus-behavioral note per hunk also produces a paper trail a reviewer can check line by line, instead of a diff with no stated intent behind it.",
    exampleOutput:
      'Change list before editing: extract the nested discount-eligibility checks in calculateTotal into a helper named isEligibleForDiscount, no other change.\n\nAfter running the existing suite: 14 passed, 0 failed, 0 skipped — no test needed modification, which confirms behavior did not change.\n\nPer-hunk note: lines 42 to 58 moved into isEligibleForDiscount with no logic change, only extraction; the public calculateTotal signature and its Decimal return type are unchanged.',
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-02' }],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'pr-description-from-diff',
    category: 'claude-code',
    title: 'Turn a raw git diff into a pull request description reviewers can use',
    description:
      'A format-forced prompt that turns a raw diff into a structured pull request description written for a reviewer who has not seen the code, instead of a generic one-line summary.',
    promptText:
      'You are writing this pull request description for a reviewer who has not seen the diff yet and will not open every file before deciding how to review it. Write for that reader, not for someone who, like you, just read every line.\n\nTICKET\n{{ticket_ref}}\n\nFORMAT\nSummary: one or two sentences on what changed and why, in plain language, no implementation detail yet.\nWhy: the problem or requirement that made this change necessary. Link the ticket if one exists.\nWhat changed: a bullet list grouped by area or module, not by file. A reviewer thinks in features, not file trees.\nHow this was tested: what you actually ran, such as unit tests, manual repro steps, or screenshots. Not "tests pass" — specifics.\nRisk and rollback: what is the blast radius if this is wrong, and how would it be reverted or flagged in production?\n\nCONSTRAINTS\n- Do not describe the diff line by line. Describe intent and effect.\n- Do not claim test coverage or manual verification that is not backed by something specific you can name.\n- If the diff contains changes unrelated to the stated purpose, call that out explicitly under What changed instead of omitting it.\n- Keep it skimmable in under sixty seconds. This is a routing document for the reviewer\'s attention, not the full explanation.\n\nPaste the diff, or git diff output, below this line, unedited.',
    variables: [
      {
        name: 'ticket_ref',
        description:
          'Link or ID of the issue or ticket this pull request closes, if any.',
        example: 'JIRA-4821 — zero-row CSV export throws a TypeError',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: ['pull-request', 'documentation', 'diff-to-text', 'code-review'],
    whyItWorks:
      'Asked to summarize a diff with no format, a model reliably writes from its own vantage point — it just read every changed line, so it under-explains, producing the generic this pull request updates the checkout flow that tells a reviewer nothing about what to actually look at. Explicitly naming the reader as a reviewer who has not seen the diff yet is a documented technique for calibrating output to an audience rather than just a format: the instruction changes what the model chooses to include, not only how it is arranged. Forcing a fixed section template of summary, why, what changed, how tested, and risk does two things at once — it prevents the generic one-liner, and it makes an incomplete description visually obvious, since an empty or vague how this was tested section is far easier for a human to notice and reject than a missing sentence buried in a paragraph. The explicit instruction to flag unrelated changes rather than omit them also counters a real failure mode of diff summarization: a model asked to describe the change will describe the change it judges most relevant to the stated purpose, silently dropping a drive-by edit a reviewer actually needed to see.',
    exampleOutput:
      'Summary: Fixes CSV export throwing an error when a report has zero rows.\n\nWhy: Support ticket JIRA-4821 — three customers hit this in the last week when filtering to an empty date range.\n\nWhat changed:\n- Reporting/export: guarded the average-row calculation against a zero total instead of dividing into NaN.\n\nHow this was tested: added a unit test for a zero-row report and re-ran the full export test suite locally, 22 passed.\n\nRisk and rollback: low risk, one-line guard on a pure function; revert is a single commit revert with no data migration involved.',
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-20' },
      {
        tool: 'GitHub Copilot',
        version: 'Copilot Chat 1.250 (VS Code)',
        date: '2026-07-21',
      },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and GitHub Copilot Chat.',
      },
    ],
  },
  {
    slug: 'security-review-before-merge',
    category: 'claude-code',
    title: 'Run a structured security review before you ship, not after',
    description:
      'A closed-taxonomy security review checklist that separates flagging a risk from fixing it, so a vulnerability finding gets a human decision instead of a silent patch.',
    promptText:
      'You are performing a security review, not a general code review. Your job is to find what an attacker would try, not to confirm that the feature works as intended. Flag findings. Do not silently fix them.\n\nSCOPE\n{{scope}}\n\nREVIEW CATEGORIES\n1. Injection — SQL, NoSQL, command, or template injection anywhere user input reaches a query, shell call, or template renderer.\n2. Authentication and authorization — missing auth checks, broken object-level authorization such as user A accessing user B\'s resource by changing an ID, or privilege escalation paths.\n3. Secrets — API keys, tokens, credentials, or personal data hardcoded, logged, or committed, including in test fixtures.\n4. Input validation — unbounded input size, unvalidated file uploads, unsafe deserialization of user-controlled data.\n5. Server-side request forgery and external calls — does user input influence a URL, hostname, or file path fetched server-side?\n6. Dependency risk — any new or changed dependency with a known-bad reputation or an unpinned version.\n7. Output handling — cross-site scripting via unescaped output, unsafe HTML rendering, unsafe redirect targets.\n\nOUTPUT FORMAT\nFor each category: CLEAR, or FINDING with a severity of Low, Medium, High, or Critical, the exact file and line, the concrete exploit scenario rather than just "this could be unsafe," and a suggested fix presented as a recommendation, not applied automatically.\nDo not modify any code in this pass. This is a review, not a remediation.\n\nCONSTRAINTS\n- Do not report a theoretical concern as a finding unless you can state a concrete input that triggers it.\n- Do not downgrade a real finding to a best-practice suggestion to soften it.\n- If nothing in a category applies, say CLEAR. Do not skip a category silently.',
    variables: [
      {
        name: 'scope',
        description:
          'What to review — a pull request, a file, or a module. Leave blank to review everything provided below.',
        example: 'the new /api/users/[id]/export route and its auth middleware',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf'],
    tags: ['security', 'code-review', 'checklist', 'pre-merge'],
    whyItWorks:
      "A generic is this secure prompt reliably produces a generic nothing obviously wrong answer, because without named categories the model has no forcing function to check for any specific class of vulnerability it did not happen to notice first. Closed, named categories such as injection, authorization, secrets, and server-side request forgery mirror how Claude Code's own built-in security review command scans systematically rather than impressionistically, and requiring an explicit clear per category rather than allowing silence makes an accidentally skipped category visible instead of invisible. Requiring a concrete exploit scenario per finding, rather than a hedge like this could potentially be unsafe, filters out the low-value speculative findings that make security review output hard to trust and act on. The explicit instruction to flag rather than fix is a control on the agent's own autonomy: an agentic coding assistant that both finds and silently patches a security issue removes a human decision point — what to fix, how, and when to ship it — from a class of change that should not be unilateral, even when the assistant is right.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-03' }],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'plan-before-multi-file-feature-change',
    category: 'claude-code',
    title:
      'Force a written, approved plan before Claude Code touches a multi-file feature',
    description:
      "A plan-first prompt that blocks any file edit until Claude Code has written out the affected files, sequence, and risk points — mirroring Claude Code's own Plan Mode discipline so multi-file features get reviewed as a plan, not discovered as a half-finished diff.",
    promptText:
      "You are planning a multi-file feature. Do not create, edit, or delete any file, and do not run any command that changes repo state, until the plan below is written out in full and I have explicitly approved it. You may read files and search the codebase freely while planning.\n\nFEATURE\n{{feature_request}}\n\nDEFINITION OF DONE\n{{definition_of_done}}\n\nCONSTRAINTS\n{{codebase_constraints}}\n\nWRITE THE PLAN IN THIS FORMAT\n1. Understanding — restate the feature in your own words in two or three sentences, including anything ambiguous in the request that you are choosing to resolve one way, and how.\n2. Files touched — every file you expect to create or modify, grouped by whether it is new or existing, with a one-line reason for each.\n3. Sequence — the order you will make changes in and why that order, for example the shared type before the two components that import it. If any step could be done in parallel with another, say so.\n4. Interfaces and contracts — every function signature, API shape, database column, or exported type that this feature adds or changes, written out before you write the implementation.\n5. Risk points — the two or three places most likely to break something outside this feature's obvious scope, and what you will check to confirm they did not.\n6. What you are explicitly not doing — anything adjacent that a reasonable person might expect but that is out of scope for this pass.\n\nEnd the plan with the exact sentence: Waiting for approval before making any changes. Do not proceed past that point under any circumstance, including if you believe the plan is obviously correct.",
    variables: [
      {
        name: 'feature_request',
        description: 'The feature to plan, described the way it was actually requested.',
        example:
          'Add a saved-searches feature: users can save their current filter combination on the /reports page with a name, and reload it later from a dropdown.',
        required: true,
      },
      {
        name: 'definition_of_done',
        description: 'What must be true for this feature to count as complete.',
        example:
          'A saved search persists across sessions, appears in the dropdown ordered by most recently used, and reloading one restores every filter exactly.',
        required: true,
      },
      {
        name: 'codebase_constraints',
        description:
          'Existing types, tables, or patterns the plan must reuse instead of inventing a parallel one.',
        example:
          'Reuse the existing FilterState type in lib/reports/filters.ts rather than creating a parallel shape; no new database table if the existing user_preferences JSON column can hold it.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'plan-mode',
      'multi-file-feature',
      'planning',
      'scope-control',
      'agentic-coding',
    ],
    whyItWorks:
      "Claude Code's own Plan Mode — toggled with Shift+Tab twice — puts the agent into a read-only research state where it can use Read, Grep, and Glob but is mechanically blocked from Edit, Write, and most Bash calls until you approve the plan it proposes; this prompt reproduces that same blocking discipline as a portable instruction, which matters because plan mode is a manual toggle you can forget to hit, and because the same discipline is valuable in tools without a dedicated read-only mode. Naming files touched and sequence as required plan sections forces the model to commit to a full change surface before writing the first line, which is exactly where multi-file features go wrong in agentic coding — an assistant that starts with the component it finds most obvious can build two files against an interface it invents on the fly, then discover on file three that the shape needs to change, redoing work a five-minute plan would have caught. The interfaces and contracts step exists because that is the actual coordination point between files: if two files agree on a function signature only by accident of matching code as it's written, rather than by a stated contract, a later edit to either file can silently break the other. The hard stop at waiting for approval, with no exception carved out even for a plan the model is confident about, is the same behavioral lever CLAUDE.md constraint blocks use elsewhere — an agentic assistant will otherwise reasonably interpret an approved-sounding plan as its own authorization to proceed.",
    exampleOutput:
      "1. Understanding: Add a way for a user to save their current filter combination on /reports under a name and reload it later. Ambiguous point: the request doesn't say whether saved searches are per-user or shared team-wide — resolving this as per-user only, since the existing user_preferences column is scoped to a single user.\n\n2. Files touched: New — none required, reusing user_preferences. Existing — lib/reports/filters.ts (add SavedSearch type), components/reports/FilterBar.tsx (add Save button and dropdown), lib/api/user-preferences.ts (add read/write helpers for the saved_searches key).\n\n3. Sequence: SavedSearch type first, then the user-preferences helpers (depend on the type), then FilterBar UI last (depends on both).\n\n4. Interfaces: SavedSearch = { id: string; name: string; filters: FilterState; savedAt: string }. saveSearch(userId, search): Promise<void>. listSavedSearches(userId): Promise<SavedSearch[]>.\n\n5. Risk points: user_preferences is currently unbounded JSON — need to confirm there's a size cap before appending indefinitely.\n\n6. Not doing: no sharing or team visibility, no editing a saved search's filters after creation, only save and delete.\n\nWaiting for approval before making any changes.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-05' },
      { tool: 'Cursor', version: '2.1', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
  },
  {
    slug: 'diagnose-a-flaky-test-before-fixing-it',
    category: 'claude-code',
    title: "Diagnose a flaky test's real cause before Claude Code touches it",
    description:
      'A diagnosis-first prompt that stops Claude Code from silently wrapping a flaky test in a retry or a longer timeout, and instead forces it to isolate the actual source of nondeterminism by re-running the test under different conditions.',
    promptText:
      'You are diagnosing a flaky test, not fixing it yet. A flaky test is one that passes and fails on the same code with no relevant change — your job is to find out why, not to make it stop failing by any means available.\n\nTEST\n{{failing_test}}\n\nWHAT HAS BEEN OBSERVED\n{{failure_evidence}}\n\nSUSPECTED CAUSE\n{{suspected_cause}}\n\nDIAGNOSTIC PROCESS — DO NOT SKIP STEPS\n1. Run the test in isolation, alone, at least 10 times in a row. Report the pass and fail count.\n2. Run the full suite the test normally runs in, at least 10 times in a row, with the test included. Report the pass and fail count.\n3. If step 1 is stable but step 2 is not, this is order-dependence or shared state leaking from another test — identify which other test in the suite runs immediately before it and what state it leaves behind, such as a shared database row, a module-level variable, or a mock that was not reset.\n4. If both steps are unstable independently, look for genuine nondeterminism inside the test or the code under test: unseeded randomness, a real timing assumption such as a fixed sleep or setTimeout racing real async work, system clock or timezone dependence, or a network or filesystem call that is not mocked.\n5. Check git log for the test file and the code it exercises — was this test reliable before a specific recent change? If so, that commit is a strong lead, not a coincidence.\n6. State your diagnosis as one sentence naming the actual mechanism, with the evidence from steps 1 through 5 that supports it. \\"It\'s flaky\\" or \\"there might be a race condition\\" is not an acceptable diagnosis — name the specific line, resource, or assumption.\n\nFORBIDDEN AS A DIAGNOSIS SUBSTITUTE\nDo not propose adding a retry, increasing a timeout, marking the test as skipped or quarantined, or wrapping an assertion in a wait-for-condition helper as your finding. Any of those may be a legitimate part of an eventual fix, but only after the mechanism above is identified and named — proposing one now, before diagnosis, is treated as a failed task.\n\nOnce the diagnosis is confirmed and I approve it, propose the fix in a separate message.',
    variables: [
      {
        name: 'failing_test',
        description: 'The exact test name and file path.',
        example:
          "tests/checkout/discount.spec.ts → 'applies the loyalty discount when cart total exceeds threshold'",
        required: true,
      },
      {
        name: 'failure_evidence',
        description:
          'What has actually been observed — frequency, environment, and failure mode.',
        example:
          'Fails roughly 1 in 15 runs on CI, has never failed locally in about 50 manual runs; failure is always a timeout waiting for a mocked API response.',
        required: true,
      },
      {
        name: 'suspected_cause',
        description:
          'Any hunch you already have, so the model can confirm or rule it out explicitly.',
        example:
          'Might be related to another test in the same file mutating the shared mockApiClient instance.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf'],
    tags: ['flaky-tests', 'test-diagnosis', 'debugging', 'ci-cd', 'root-cause-analysis'],
    whyItWorks:
      "Asked to fix a flaky test with no other constraint, a model's highest-probability response is exactly the three moves that make CI green without making anything true: add a retry wrapper, bump a timeout, or quarantine the test — each is a legitimate tool in a human engineer's kit but a worthless diagnosis, since it treats the symptom as the problem. The forbidden-as-diagnosis-substitute clause exists because a model under pressure to produce a working answer quickly will reach for the cheapest fix that makes the failure disappear, and naming that exact move as unacceptable up front closes off the shortcut before it's taken. Steps 1 and 2 — run the test alone repeatedly, then run it inside the full suite repeatedly — reproduce the standard engineering technique for distinguishing order-dependence and shared-state leakage from genuine nondeterminism inside the test itself; a model that only reasons about the code without actually executing it this way is guessing, whereas Claude Code's ability to run a test command in a loop via its Bash tool turns this from a thought experiment into an empirical check with real pass and fail counts. The git log step matters because flaky tests very often are not actually random — they became unreliable the moment a specific commit changed a timing assumption or shared fixture, and a model that skips version history will hunt for randomness in code that was reliable for months before one dependency bump.",
    exampleOutput:
      "Step 1 — isolated, 10 runs: 10 passed, 0 failed.\nStep 2 — full suite, 10 runs: 7 passed, 3 failed.\nSince isolated runs are stable but suite runs are not, this points to order-dependence or leaked state, not genuine timing nondeterminism.\nStep 3 — the test immediately before it, 'rejects a loyalty discount below threshold,' calls mockApiClient.mockResolvedValueOnce(), but the discount test calls mockApiClient.mockResolvedValue() unconditionally afterward; when the once-mock from the prior test hasn't been consumed due to an early return, this test's own mock setup is silently skipped and it hits the real, unmocked rejection path — that's what produces the timeout.\nDiagnosis: shared mockApiClient instance not reset between tests in this file, missing a clearAllMocks() call in an afterEach — not a race condition.\nNot proposing a fix yet, awaiting approval to proceed.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-06' }],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'dependency-upgrade-breaking-change-migration-plan',
    category: 'claude-code',
    title:
      'Turn a major dependency upgrade into a migration plan instead of a live-fire drill',
    description:
      'A pre-upgrade prompt that makes Claude Code map every breaking change in the release notes to its actual usage sites in your repo before touching the lockfile, so silent behavior changes get caught, not just the ones that throw a compile error.',
    promptText:
      "You are planning an upgrade of {{dependency_name}} from {{current_version}} to {{target_version}}. Do not modify the lockfile, package manifest, or any application code yet. This is a research and mapping pass first.\n\nCRITICAL PATHS — must not regress\n{{critical_paths}}\n\nPROCESS\n1. Find and read the official changelog, release notes, or migration guide covering every version between {{current_version}} and {{target_version}}, not just the final target version — breaking changes in an intermediate minor version are still breaking changes.\n2. List every breaking change, deprecation, and default-behavior change you find, in plain language, each with the version it landed in.\n3. For each item from step 2, search this codebase for every usage site that touches the changed API, prop, config key, or behavior — cite exact files and line numbers, do not estimate.\n4. Classify every usage site as one of: SAFE (unaffected in practice), NEEDS CHANGE (will break or behave differently), or UNCERTAIN (you cannot tell from static reading alone and it needs a test run to confirm).\n5. Pay specific attention to changes that alter a default value or silent behavior rather than removing or renaming something — those are the ones that will not throw an error or fail a type check, and are the ones a live-fire upgrade-and-fix-what-breaks approach reliably misses.\n6. Propose a staged plan: what to upgrade first if the path isn't a single jump, whether an official codemod exists and should be run before manual fixes, and in what order the NEEDS CHANGE sites should be addressed so each stage is independently testable.\n\nOUTPUT\nA table of breaking change, usage sites, classification, and planned action. Then the staged plan as a numbered list. End with your confidence level in the completeness of this mapping and what would make you more confident, such as running the test suite against the new version in a branch before touching main code.\n\nDo not begin making changes until I approve this plan.",
    variables: [
      {
        name: 'dependency_name',
        description: 'The package or framework being upgraded.',
        example: 'React',
        required: true,
      },
      {
        name: 'current_version',
        description: 'The version currently installed.',
        example: '18.2.0',
        required: true,
      },
      {
        name: 'target_version',
        description: 'The version being upgraded to.',
        example: '19.1.0',
        required: true,
      },
      {
        name: 'critical_paths',
        description:
          'Parts of the app that carry the highest cost if this upgrade regresses them.',
        example:
          'The checkout form and its validation must not regress — this is the highest-traffic, highest-revenue-risk part of the app.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'dependency-upgrade',
      'breaking-changes',
      'migration-planning',
      'release-notes',
    ],
    whyItWorks:
      "The default failure mode for upgrade X to Y is a live-fire approach: bump the version, run the build or type checker, and fix whatever complains, iterating until it's green — which works fine for changes that throw, but is structurally blind to changes that don't, like a default option flipping, a hook's timing shifting, or a prop silently being ignored instead of rejected. Forcing the changelog read and the usage-site mapping before any edit converts those silent risks into a named list before the upgrade starts, rather than relying on the test suite to happen to exercise every changed default. The SAFE, NEEDS CHANGE, UNCERTAIN classification specifically creates a category for I don't know without running this, rather than forcing a binary safe-or-not call the model isn't actually in a position to make from static reading alone — an uncertain classification is honest, where a model pressured into a yes-or-no answer will often guess safe for a code path it didn't fully trace. Requiring exact file and line citations rather than a general this affects the router claim exploits the same repo-wide search capability that distinguishes an agentic coding assistant from a chat-only one — Claude Code can actually search the entire codebase for every call site of a changed API, which is the step that makes the difference between a plausible-sounding migration plan and one that is actually complete for this specific repo.",
    exampleOutput:
      "Breaking change → usage sites → classification (excerpt):\n- useEffect cleanup timing changed (React 19.0) → hooks/useSocketConnection.ts:34 → NEEDS CHANGE, cleanup now fires before the next effect runs in an edge case this hook relies on the old ordering for.\n- Legacy Context API fully removed (deprecated since 16, removed 19.0) → zero usages found via search → SAFE.\n- forwardRef no longer required for function components accepting ref (19.0) → components/ui/Input.tsx:1, Button.tsx:1 → SAFE to simplify, not required.\n\nStaged plan: 1) upgrade to 18.3 first to surface deprecation warnings early; 2) run React's official codemod for removed APIs; 3) fix useSocketConnection.ts's cleanup ordering manually, since no codemod covers it; 4) upgrade to 19.1 and re-run the full suite plus a manual pass on checkout.\n\nConfidence: moderate on the hooks-timing change specifically — recommend running the checkout flow's integration tests against a 19.1 branch before merging, since that is the one item classified UNCERTAIN above.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-03' },
      { tool: 'Cursor', version: '2.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
  },
  {
    slug: 'resume-claude-code-session-after-compaction',
    category: 'claude-code',
    title:
      'Resume a Claude Code task after a compaction or restart without losing decisions',
    description:
      'A session-recovery prompt that forces Claude Code to reconstruct exactly where a multi-step task stands from git state and any saved plan, rather than trusting a compacted summary or its own confident-sounding recollection of what already happened.',
    promptText:
      "This session's context was compacted, resumed from a saved transcript, or otherwise interrupted partway through a task. Do not continue as if you remember everything that happened before this point, and do not silently fill gaps with a plausible-sounding guess. Reconstruct the actual current state from ground truth before writing or changing anything else.\n\nORIGINAL GOAL\n{{original_goal}}\n\nWHERE TO LOOK FOR PRIOR STATE\n{{todo_or_plan_reference}}\n\nRECONSTRUCT BEFORE DOING ANYTHING ELSE\n1. Run git status and git diff to see exactly what is currently uncommitted. List every added, modified, and deleted file, and summarize what each change does in one line.\n2. Run git log --oneline -20 to see what has already been committed toward this goal, if anything, on this branch.\n3. Check the location named above for any plan, todo list, or design note written earlier in this task, and read it in full.\n4. Compare the current diff and commit history against the original goal: state which parts are done, which are in progress, and which have not been started, citing the specific file or commit that proves each claim.\n5. Write one paragraph stating your understanding of exactly where this task stands right now, based only on what steps 1 through 3 actually show, not on inference about what probably happened.\n\nIF SOMETHING DOESN'T ADD UP\nIf the current diff contains a change you cannot explain from the goal or the plan artifact, stop and name it as unexplained rather than building on top of it or assuming it was intentional. If an earlier decision seems to have been made that isn't written down anywhere you can verify, say plainly that the reasoning is unrecoverable from available evidence and ask, rather than inventing a plausible rationale for it.\n\nONLY THEN\nPropose what happens next, and wait for confirmation before resuming edits.",
    variables: [
      {
        name: 'original_goal',
        description: 'The task as it was originally stated, before the interruption.',
        example:
          'Migrate the reports module from the legacy REST client to the new typed API client, file by file, keeping all existing tests green.',
        required: true,
      },
      {
        name: 'todo_or_plan_reference',
        description:
          'Where a plan or todo list for this task might already exist, if anywhere.',
        example:
          "There should be a PLAN.md at the repo root written at the start of this task, or a todo list from earlier in this conversation if it's still visible above.",
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Windsurf'],
    tags: [
      'context-compaction',
      'session-recovery',
      'long-running-tasks',
      'context-engineering',
    ],
    whyItWorks:
      "Claude Code compacts a long conversation's context automatically as it nears the model's context window limit, and /compact can be triggered manually — in both cases what carries forward into the rest of the session is a generated summary standing in for the original turns, not the turns themselves, and claude --continue or --resume reload a saved transcript that has the same property. A summary is lossy by construction: it reliably keeps the stated goal and the obvious file changes, and just as reliably drops the specific reasoning behind a judgment call, such as why one of two viable approaches was chosen, because that reasoning lived in a sentence of discussion rather than in a diff. This prompt's core mechanic is refusing to trust the compacted summary or the model's own fluent-sounding recollection, and instead re-deriving task state from git status, git diff, and git log — sources that cannot be silently rewritten by a summarization pass, the same principle behind verifying a claim against its primary source rather than trusting someone's paraphrase of it. Explicitly allowing the reasoning is unrecoverable, ask as a valid output is the load-bearing part: a model motivated to appear continuous and competent will otherwise fabricate a plausible justification for a decision it cannot actually verify, and a fabricated rationale that gets built on top of is far more expensive to unwind later than an honest gap flagged immediately after a restart.",
    exampleOutput:
      "git status shows 3 modified files (lib/reports/api-client.ts, lib/reports/summary.ts, tests/reports/summary.spec.ts) and one new file (lib/reports/typed-client.ts) not yet committed. git log shows one prior commit, 'migrate reports/filters.ts to typed client,' so filters.ts is done and already merged into this branch's history.\n\nPLAN.md at the repo root lists five files to migrate in order: filters.ts, api-client.ts, summary.ts, export.ts, dashboard.ts. Based on git state, filters.ts is complete and committed; api-client.ts and summary.ts have uncommitted in-progress changes; export.ts and dashboard.ts have not been started.\n\nCurrent state: 1 of 5 files fully done, 2 of 5 in progress with uncommitted changes, 2 of 5 not started. One thing doesn't add up — tests/reports/summary.spec.ts has a modification that isn't explained by PLAN.md or the summary.ts diff alone; flagging this rather than assuming it was intentional.\n\nProposed next step: finish summary.ts's migration, resolve what changed in its test file, run the full reports test suite, then commit before starting export.ts. Waiting for confirmation.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-07' }],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6).',
      },
    ],
  },
]
