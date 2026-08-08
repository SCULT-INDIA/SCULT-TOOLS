import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'copilot-instructions-md-repo-rules',
    category: 'github-copilot',
    title: 'Write a .github/copilot-instructions.md file Copilot actually follows',
    description:
      'A repository custom-instructions file template that gives every Copilot Chat, code review, and coding-agent session your stack, conventions, and hard constraints automatically, without retyping them per chat.',
    promptText:
      '# Repository custom instructions for GitHub Copilot\n# Save as .github/copilot-instructions.md — Copilot adds this to every Chat request,\n# code review pass, and coding-agent session in this repository automatically.\n\n## Project\n{{project_name}} — {{tech_stack}}\n\n## Conventions to follow in every suggestion\n{{coding_conventions}}\n\n## Never do this\n{{forbidden_patterns}}\n\n## When reviewing or generating code, prioritize\n{{review_focus}}\n\nKeep every statement above short, specific, and self-contained. A rule that depends on\ncontext from another section gets applied inconsistently — write each one so it stands alone.',
    variables: [
      {
        name: 'project_name',
        description:
          'The name of the repository, used so Copilot names itself correctly in generated docs and commit messages.',
        example: 'tools.scult.in',
        required: true,
      },
      {
        name: 'tech_stack',
        description:
          'Languages, frameworks, and key libraries, so Copilot stops suggesting patterns from a different stack.',
        example: 'Next.js 15 App Router, TypeScript strict mode, Tailwind CSS, Biome',
        required: true,
      },
      {
        name: 'coding_conventions',
        description:
          'Project-specific conventions Copilot should apply by default, as a short bullet list.',
        example:
          '- Prefer named exports over default exports.\n- Co-locate component tests next to the component, not in a separate __tests__ tree.\n- Use the existing `cn()` helper for conditional class names, never template-literal concatenation.',
        required: true,
      },
      {
        name: 'forbidden_patterns',
        description:
          'Explicit anti-patterns to reject, stated as hard rules, not preferences.',
        example:
          '- Never use `any` without a comment justifying it.\n- Never add a new npm dependency without flagging it in the PR description first.',
        required: true,
      },
      {
        name: 'review_focus',
        description:
          'What Copilot code review and Copilot Chat should weight most heavily when judging a change in this repo.',
        example:
          'Accessibility of any new UI component, and whether new API routes validate input with a schema before touching the database.',
        required: false,
      },
    ],
    targetTools: [
      'GitHub Copilot Chat (VS Code)',
      'GitHub Copilot code review',
      'GitHub Copilot coding agent',
    ],
    tags: [
      'copilot-instructions',
      'repo-rules',
      'context-engineering',
      'custom-instructions',
    ],
    whyItWorks:
      "A .github/copilot-instructions.md file is loaded automatically into context for every Copilot Chat request, every automated code review pass, and every Copilot coding agent session in that repository — unlike a rule typed into one chat, which is scoped to that single conversation and gone the moment it ends. This is also the file the coding agent reads before it starts working on an assigned issue, so a constraint written here bounds its autonomous behavior on a PR you never watched it write, not just its behavior in an interactive chat you're present for. GitHub's own guidance for this file is explicit that short, specific, self-contained statements apply more consistently than long prose, because Copilot has to re-derive the applicable rule from the instructions file plus the current task on every single request — a rule that only makes sense in combination with another sentence three lines up gets dropped more often than one that stands alone. Repos with monorepo-specific needs can layer path-scoped instructions on top of this file via .github/instructions/*.instructions.md with an applyTo frontmatter glob, but the repo-wide file is the one every surface reads by default, which is why it's worth getting the conventions and forbidden-patterns sections right first.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.260 (VS Code)',
        date: '2026-07-20',
      },
      {
        tool: 'GitHub Copilot coding agent',
        version: 'GA release, 2026-06',
        date: '2026-07-25',
      },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Copilot Chat 1.260 (VS Code) and the Copilot coding agent.',
      },
    ],
  },
  {
    slug: 'copilot-workspace-issue-to-plan',
    category: 'github-copilot',
    title:
      'Turn a GitHub issue into an editable plan before Copilot Workspace writes code',
    description:
      'A Copilot Workspace brief that forces a reviewable specification and step-by-step plan from an issue before any code gets generated, so a wrong approach gets caught before it becomes a PR.',
    promptText:
      "Open this issue in Copilot Workspace and generate a spec and plan first — do not let Workspace proceed to the implementation step until the spec below has been reviewed and approved.\n\nISSUE\n{{issue_summary}}\n\nACCEPTANCE CRITERIA\n{{acceptance_criteria}}\n\nCONSTRAINTS\n{{constraints}}\n\nOUT OF SCOPE\n{{out_of_scope}}\n\nWhen Workspace proposes the spec, check that it names every file it intends to touch, explains its approach in plain language before any diff appears, and flags anywhere the acceptance criteria above are ambiguous rather than silently picking an interpretation. Only advance to the plan step once the spec accurately reflects this issue, and only advance to code once the plan's steps map one-to-one onto the acceptance criteria above.",
    variables: [
      {
        name: 'issue_summary',
        description:
          'The problem or feature request, in the same plain language you would put in the GitHub issue body.',
        example:
          'Users on the free tier can currently export more than 3 reports per month by editing the request payload directly.',
        required: true,
      },
      {
        name: 'acceptance_criteria',
        description:
          'A numbered list of what must be true for the issue to count as resolved.',
        example:
          '1. Free-tier requests past the 3rd export in a rolling 30 days return a 403 with a clear error message. 2. Paid tiers are unaffected. 3. The limit is configurable, not hardcoded.',
        required: true,
      },
      {
        name: 'constraints',
        description: 'Technical or product constraints the implementation must respect.',
        example:
          'Must use the existing rate-limit middleware in lib/middleware/rate-limit.ts, not a new library.',
        required: false,
      },
      {
        name: 'out_of_scope',
        description:
          'What this issue explicitly does not cover, so the spec does not quietly expand.',
        example:
          'Billing-plan changes, upgrade prompts in the UI, and retroactive enforcement on exports already made this month.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Workspace'],
    tags: ['copilot-workspace', 'issue-to-plan', 'spec-review', 'planning'],
    whyItWorks:
      "Copilot Workspace's entire design is spec, then plan, then implementation as three separate, individually editable steps rather than issue-in, PR-out in one shot — the point of the tool is to let a human validate the spec and the plan before a single line of code is written. An issue that never separates what must be true (acceptance criteria) from what must not change (constraints and out-of-scope) gives Workspace nothing to slow down for, so it collapses those steps back toward one pass, generating a spec that just restates the issue title with more words. Naming acceptance criteria and out-of-scope explicitly gives the spec stage concrete claims to check itself against instead of a paraphrase. Telling it to flag ambiguity in the spec rather than guess counters the tendency of any spec-generation step to quietly resolve an unclear requirement with whichever reading is easiest to implement — and because the spec is the artifact you review before plan or code exist, an ambiguity surfaced here costs a comment, not a wasted PR.",
    exampleOutput:
      'Spec (excerpt): Add a rolling 30-day export counter per free-tier user, checked in the existing rate-limit middleware before the export handler runs. Files to touch: lib/middleware/rate-limit.ts (add export-count check), lib/config/limits.ts (new configurable EXPORT_LIMIT_FREE_TIER constant), app/api/reports/export/route.ts (surface the 403 with the specified error message). Flagged ambiguity: acceptance criteria 3 says configurable — assuming this means an environment-variable-backed constant, not a per-user database override, since no admin UI was mentioned. Confirm before proceeding to plan.',
    verifiedAgainst: [
      { tool: 'GitHub Copilot Workspace', version: 'GA, 2026', date: '2026-07-10' },
    ],
    changelog: [
      {
        date: '2026-07-10',
        note: 'Initial publish, verified against GitHub Copilot Workspace GA.',
      },
    ],
  },
  {
    slug: 'assign-coding-agent-scoped-issue',
    category: 'github-copilot',
    title: 'Write an issue tight enough to hand to the Copilot coding agent unattended',
    description:
      'An issue template for the @copilot coding agent that bounds file scope, defines a testable done-state, and tells it exactly how to handle a blocker instead of guessing silently.',
    promptText:
      'Assign this issue to @copilot (the GitHub Copilot coding agent). It will work in its own sandboxed environment, push commits to a draft pull request, and respond to review comments — write this issue as a brief for an agent that cannot ask a clarifying question mid-task, only before it starts or afterward in PR comments.\n\nTASK\n{{task_summary}}\n\nFILES LIKELY IN SCOPE\n{{files_in_scope}}\n\nDONE WHEN\n{{done_state}}\n\nRULES FOR THE AGENT\n- Do not touch any file outside the scope above unless the done-state above is provably unreachable without it — if so, explain why in the PR description rather than doing it silently.\n- Run the existing test suite and lint before opening the PR. Paste the exact command output in the PR description, not just a claim that it passed.\n- If any part of this issue is ambiguous, state the ambiguity and the interpretation you chose in the PR description rather than picking silently.\n- Open the PR as a draft. Do not mark it ready for review until every item under DONE WHEN is satisfied.\n\n{{blocker_policy}}',
    variables: [
      {
        name: 'task_summary',
        description:
          'What the agent needs to build or fix, stated as concretely as you would explain it to a new contributor.',
        example:
          'Add a CSV export button to the /reports/[id] page that downloads the current filtered view, reusing the existing exportToCsv() helper.',
        required: true,
      },
      {
        name: 'files_in_scope',
        description:
          'The files or directories the change should realistically live in, to cap the search space.',
        example:
          'app/reports/[id]/page.tsx, components/reports/ExportButton.tsx (new), lib/export/csv.ts',
        required: true,
      },
      {
        name: 'done_state',
        description:
          'A checkable list of conditions that define completion — not a vague description of intent.',
        example:
          '1. Button appears only when the report has at least one row. 2. Clicking it downloads a CSV matching the visible filtered rows. 3. Existing report page tests still pass; a new test covers the zero-rows case.',
        required: true,
      },
      {
        name: 'blocker_policy',
        description:
          'What the agent should do if it hits a genuine blocker it cannot resolve from the issue alone.',
        example:
          'If the existing exportToCsv() helper cannot handle the filtered-view shape, stop, open the draft PR with a comment explaining exactly what is missing, and do not invent a new export implementation.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot coding agent'],
    tags: ['coding-agent', 'issue-writing', 'autonomous-pr', 'scope-control'],
    whyItWorks:
      "The coding agent runs unattended in a background, GitHub Actions-backed sandbox and only surfaces back to a human through the draft PR and its own comments — a mid-task clarifying question is not part of its loop the way it is in an interactive Copilot Chat session, so any ambiguity left in the issue gets resolved by the agent's own judgment rather than caught before it costs anything. Naming files likely in scope caps the search space the agent explores before it starts writing code, which matters because an autonomous agent with a vague brief and full repo access expands its own scope the same way any agentic coding tool does once it notices something else that looks fixable nearby. Requiring literal command output in the PR description, not a claim that tests passed, closes the failure mode where the agent's own account of its work is the only verification available — a reviewer should be checking pasted output, not trusting a summary written by the same agent that wrote the code. Marking the PR draft-only until every done-state item is met turns the checklist into a release gate the agent checks itself against, rather than a description of intent it can satisfy loosely and still mark ready.",
    exampleOutput:
      "PR description (excerpt): Implements CSV export on the filtered report view per the issue. Ambiguity encountered: the issue did not specify a filename format — used report-{{id}}-{{date}}.csv, matching the existing convention in lib/export/csv.ts's other call site. Test output: 42 passed, 0 failed (added export-zero-rows.test.ts). Ready for review.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot coding agent',
        version: 'GA release, 2026-05',
        date: '2026-07-05',
      },
    ],
    changelog: [
      {
        date: '2026-07-05',
        note: 'Initial publish, verified against the GitHub Copilot coding agent GA release.',
      },
    ],
  },
  {
    slug: 'copilot-chat-debug-stack-trace',
    category: 'github-copilot',
    title:
      'Get Copilot Chat to diagnose a bug from the stack trace before it proposes a fix',
    description:
      'A debugging prompt for the Copilot Chat panel that forces root-cause reasoning from the actual stack trace and repro steps, so the fix maps to what is really wrong instead of the first plausible guess.',
    promptText:
      'Diagnose this bug before proposing any fix. Do not suggest a code change until you have stated a root cause you can point to directly in the stack trace below.\n\nERROR\n{{error_message}}\n\nSTACK TRACE\n{{stack_trace}}\n\nHOW TO REPRODUCE\n{{repro_steps}}\n\nRELEVANT FILES\n{{relevant_files}}\n\nWork in this order:\n1. Walk the stack trace from the top frame down and identify exactly which line and call is throwing, in this codebase — not a generic explanation of what this error type usually means.\n2. State the root cause in one sentence, naming the specific variable or condition that is wrong.\n3. Only then propose the fix, as a diff, scoped to that root cause.\n4. Name one other place in the codebase where the same root cause could resurface, and say whether that spot needs the same fix.\n\nIf the stack trace and files given are not enough to be certain of the root cause, say exactly what additional file or log output you need instead of guessing.',
    variables: [
      {
        name: 'error_message',
        description: 'The exact error text, verbatim.',
        example: "TypeError: Cannot read properties of undefined (reading 'toFixed')",
        required: true,
      },
      {
        name: 'stack_trace',
        description: 'The full stack trace, unedited.',
        example:
          'at formatRowCount (lib/reports/format.ts:34:18)\nat ReportSummary (components/reports/ReportSummary.tsx:19:22)',
        required: true,
      },
      {
        name: 'repro_steps',
        description: 'The exact steps that trigger the error.',
        example:
          'Open any report, filter the date range so zero rows match, then view the summary panel.',
        required: true,
      },
      {
        name: 'relevant_files',
        description:
          'Paste the contents of the files named in the stack trace, or say which ones are attached.',
        example:
          'lib/reports/format.ts and components/reports/ReportSummary.tsx pasted below.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)', 'GitHub Copilot Chat (JetBrains)'],
    tags: ['debugging', 'root-cause-analysis', 'stack-trace', 'copilot-chat'],
    whyItWorks:
      'Given a bare error message, Copilot Chat pattern-matches to the most common cause of that error class in general rather than this specific stack trace, because nothing forces it to actually parse the trace frame by frame before answering. Requiring the walk-through before any fix converts diagnosis into a step it cannot skip past on the way to sounding helpful. Requiring a one-sentence root cause anchored to a named variable or condition rules out the hand-wavy "there might be a null reference issue somewhere" answer that sounds diagnostic but commits to nothing checkable. Asking where else the same root cause could resurface exploits Copilot Chat\'s whole-file context to catch a class of bug, not just the one instance that happened to get reported. Telling it to ask for missing files instead of guessing counters the model\'s tendency to produce a plausible-looking fix for a wrong diagnosis when given insufficient context — the single most common way a Copilot suggestion looks right in the chat panel but does not actually address the crash that was reported.',
    exampleOutput:
      "1. Top frame is formatRowCount at lib/reports/format.ts:34, calling .toFixed on the result of rows.length / total. \n2. Root cause: total is 0 when a filtered report matches zero rows, so rows.length / total evaluates to NaN, and NaN.toFixed throws.\n3. Fix: guard the division — return '0.0' directly when total === 0, before the toFixed call.\n4. formatAverageValue in lib/reports/format.ts:51 has the same total-based division with no zero guard — it needs the identical fix.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.260 (VS Code)',
        date: '2026-07-18',
      },
    ],
    changelog: [
      {
        date: '2026-07-18',
        note: 'Initial publish, verified against Copilot Chat 1.260 (VS Code).',
      },
    ],
  },
  {
    slug: 'copilot-code-review-request-checklist',
    category: 'github-copilot',
    title: "Point Copilot's automated PR review at the risk that actually matters",
    description:
      "A PR description addendum that steers GitHub Copilot's automated code review toward the specific risk areas of a change, instead of an evenly-distributed pass over the whole diff.",
    promptText:
      'COPILOT REVIEW FOCUS\n\nWhat this PR does\n{{pr_summary}}\n\nReview these areas with the most scrutiny, in this order\n{{risk_areas}}\n\nKnown tradeoffs already discussed — do not re-raise these unless you disagree with the reasoning\n{{known_tradeoffs}}\n\nFlag anything outside this list too, but lead with the areas above. If a comment applies to a line only because of a broader pattern repeated across this file, say so once and name the pattern rather than leaving a separate near-duplicate comment on every line it appears on.',
    variables: [
      {
        name: 'pr_summary',
        description: 'One or two sentences on what the PR does, for context.',
        example:
          'Adds a bulk-delete endpoint for admin users to remove multiple flagged comments at once.',
        required: true,
      },
      {
        name: 'risk_areas',
        description:
          'The specific parts of the diff you actually want scrutinized, in priority order.',
        example:
          "1. Whether the bulk-delete endpoint checks that every comment ID belongs to the requesting admin's organization before deleting. 2. Whether the delete is wrapped in a transaction. 3. Rate limiting on the new endpoint.",
        required: true,
      },
      {
        name: 'known_tradeoffs',
        description:
          'Decisions already made deliberately, so the review does not re-litigate them.',
        example:
          'We chose a hard delete over a soft-delete flag for this table, per the retention policy discussion in #482 — this was intentional.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot code review'],
    tags: ['code-review', 'pull-request', 'copilot-review', 'risk-focused'],
    whyItWorks:
      "GitHub's Copilot code review scans the whole diff and leaves inline comments, but it has no way to know which part of a large diff the author is actually unsure about, so by default it distributes attention roughly evenly across the changed lines. Naming risk areas up front works the same way it does with a human reviewer — a PR description that says please focus on X changes where a reader concentrates their limited attention, and it changes where Copilot's review concentrates its comments rather than paging through hunks in file order. Listing known tradeoffs already discussed suppresses a specific kind of noise: without it, the review will often re-raise a decision the team already made deliberately, which is exactly what trains people to skim past its comments instead of reading them. Asking it to name a repeated pattern once rather than comment on every line it appears on closes off the review feature's tendency to leave five near-duplicate line comments for the same code smell instead of one comment that actually explains the pattern.",
    verifiedAgainst: [
      { tool: 'GitHub Copilot code review', version: 'GA, 2026', date: '2026-06-28' },
    ],
    changelog: [
      {
        date: '2026-06-28',
        note: 'Initial publish, verified against GitHub Copilot code review GA.',
      },
    ],
  },
  {
    slug: 'copilot-slash-command-fix-explain-tests',
    category: 'github-copilot',
    title: "Chain Copilot's /explain, /fix, and /tests instead of running one cold",
    description:
      'A three-step slash-command sequence for the Copilot Chat panel that gets a real explanation, a fix scoped to the actual concern, and matching tests out of one selection — in an order that makes each step check the last.',
    promptText:
      'Select {{selected_code_description}} in the editor, open Copilot Chat, and run these three slash commands in order, treating each answer as input to the next rather than three unrelated questions.\n\nSTEP 1 — /explain\nAsk: /explain what does this do, specifically with respect to {{concern}}\n\nRead the explanation before moving on. If it does not mention {{concern}} at all, ask a direct follow-up naming it before proceeding to step 2.\n\nSTEP 2 — /fix\nAsk: /fix address {{concern}} specifically. Do not change anything the step 1 explanation described as working correctly.\n\nCheck the proposed fix against the step 1 explanation — it should map directly onto the concern, not introduce an unrelated change.\n\nSTEP 3 — /tests\nAsk: /tests add tests that would have caught {{concern}} before this fix, plus the existing passing behavior confirmed in step 1.\n\nReject the /tests output if it only re-tests the happy path already covered — ask explicitly for the case covering {{concern}} if it is missing.',
    variables: [
      {
        name: 'selected_code_description',
        description:
          'What you are selecting, so the workflow instructions make sense standalone.',
        example: 'the calculateDiscount function in lib/checkout/discount.ts',
        required: true,
      },
      {
        name: 'concern',
        description:
          'The specific thing you are worried about — not "is this good code" but the actual suspected issue.',
        example:
          'whether expired discount codes are rejected correctly when the cart total changes after the code was applied',
        required: true,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)'],
    tags: ['slash-commands', 'explain', 'fix', 'tests', 'workflow'],
    whyItWorks:
      "/explain, /fix, and /tests are Copilot Chat's built-in slash commands, each scoped to a fixed task against the current selection — used in isolation, each one starts from a blank slate. Running /fix cold on a selection means Copilot infers what is wrong with no stated concern, and it will often fix the most visible style issue rather than the one you actually opened chat about. Running /explain first, and requiring the answer to name the real concern before proceeding, forces Copilot to demonstrate it has located the right problem before it is allowed to touch the code — the same diagnose-before-fix discipline that matters in any debugging prompt. Feeding the concern explicitly into the /fix command, rather than trusting the model to carry it forward implicitly from the earlier turn, matters because slash commands are effectively single-turn task invocations and do not reliably preserve the full nuance of a prior explanation. Chaining into /tests last, and explicitly rejecting happy-path-only output, catches the well-documented pattern of AI-generated tests mirroring what the code does rather than probing the specific regression risk the session was actually about.",
    exampleOutput:
      'Step 1 /explain output confirms calculateDiscount checks code.expiresAt against Date.now() at call time, so it does correctly reject an expired code — but it applies the discount to the cart total at the time the code was validated, not the total at checkout, which is the actual concern. Step 2 /fix re-reads the cart total immediately before applying the discount rather than caching it from validation. Step 3 /tests adds a case where the cart total changes between validation and checkout, alongside the existing valid-code and expired-code cases.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.260 (VS Code)',
        date: '2026-07-22',
      },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Copilot Chat 1.260 (VS Code).',
      },
    ],
  },
  {
    slug: 'copilot-cli-terminal-task-brief',
    category: 'github-copilot',
    title:
      'Get a safe, explained shell command out of Copilot in the CLI, not a blind paste',
    description:
      'A gh copilot suggest and explain pairing that forces the command, its plain-language explanation, and a pre-committed reject list before you run anything against a real environment.',
    promptText:
      'Run this through GitHub Copilot in the CLI as:\ngh copilot suggest -t shell "{{task_description}}"\n\nBefore running whatever it returns, also run gh copilot explain on the exact command string it suggested, and require that explanation to be read against this context.\n\nCONTEXT\n{{environment_context}}\n\nRISK TOLERANCE\n{{risk_tolerance}}\n\nDo not run the suggested command if the explanation surfaces any of the following that you did not explicitly ask for: a recursive delete, a force push, a change to a permission or ownership bit, or a write outside the current directory. If the explanation flags one of those, ask Copilot to suggest a narrower alternative that matches the risk tolerance above before running anything.',
    variables: [
      {
        name: 'task_description',
        description:
          'The task in plain language, exactly as you would type it after gh copilot suggest.',
        example: 'find all files larger than 50MB in this repo and list them by size',
        required: true,
      },
      {
        name: 'environment_context',
        description:
          'What environment this will run against, so the risk check has something concrete to weigh.',
        example:
          'Running locally on a laptop, inside a git repo with uncommitted changes I have not backed up yet.',
        required: true,
      },
      {
        name: 'risk_tolerance',
        description:
          'What kind of side effect is acceptable versus a hard no for this particular task.',
        example:
          'Read-only operations are fine. Anything that deletes, moves, or overwrites a file needs a narrower, explicitly scoped alternative.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot CLI', 'GitHub CLI (gh)'],
    tags: ['copilot-cli', 'terminal', 'shell-commands', 'gh-cli', 'safety'],
    whyItWorks:
      'gh copilot suggest generates a shell, git, or gh CLI command from a natural-language description, but it is a suggestion returned for you to run manually, not something Copilot executes on your behalf — the CLI extension is deliberately built with that manual confirmation step, because a wrong command against a real filesystem or a real git remote is not something you want auto-executed. Pairing it with gh copilot explain on the exact returned string, rather than trusting the one-line description in the suggest output, matters because suggest and explain are two separate calls to the model and can each catch something the other omitted — asking a second time, specifically what does this do, is a documented way to surface a side effect a first-pass generation glossed over. Naming a risk tolerance up front and pre-committing to a reject list, recursive delete, force push, permission changes, writes outside the working directory, turns read the explanation carefully into a checkable gate applied the same way every time, instead of relying on catching a dangerous flag by attentiveness alone in the moment right before you run it.',
    exampleOutput:
      'gh copilot suggest returns: find . -type f -size +50M -exec ls -lh {} \\; | sort -k5 -h. gh copilot explain confirms this is read-only — it lists matching files without modifying anything — so it clears the reject list and is safe to run as suggested.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot CLI',
        version: 'gh-copilot extension 1.8',
        date: '2026-06-15',
      },
    ],
    changelog: [
      {
        date: '2026-06-15',
        note: 'Initial publish, verified against the gh-copilot CLI extension 1.8.',
      },
    ],
  },
  {
    slug: 'workspace-chat-cross-file-impact-analysis',
    category: 'github-copilot',
    title: 'Ask @workspace where something is actually handled before you change it',
    description:
      'An @workspace chat prompt that maps every file touching a piece of behavior across the whole repo before you edit it, instead of trusting whatever file happens to be open.',
    promptText:
      "@workspace I am about to change {{behavior_or_feature}}. Before I touch anything, answer these using the actual codebase, not general knowledge of how this kind of feature is usually built:\n\n1. Every file that reads, writes, or depends on {{behavior_or_feature}}, with the specific function or export in each.\n2. Which of those is the source of truth versus a consumer that would break if the source of truth's shape changed.\n3. Any place this logic is duplicated instead of shared, even partially.\n4. Given that I intend to {{change_intent}}, which files from question 1 would need a matching change, and which would not.\n\nDo not propose the change yet. Answer only what is asked, and say 'not found in this workspace' rather than inferring a file that plausibly should exist but that you have not actually located.",
    variables: [
      {
        name: 'behavior_or_feature',
        description: 'The specific behavior you are about to change, named precisely.',
        example: "how a user's subscription tier is determined for feature gating",
        required: true,
      },
      {
        name: 'change_intent',
        description:
          'What you actually plan to do to it, so question 4 can be answered concretely.',
        example:
          'add a new "trial" tier between free and paid that expires after 14 days',
        required: true,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)'],
    tags: ['workspace-chat', 'impact-analysis', 'multi-file', 'refactoring-prep'],
    whyItWorks:
      "@workspace is the Copilot Chat participant scoped specifically to search and reason across the current workspace rather than only the open file or the current selection — it is the mechanism that makes a genuinely cross-file question answerable at all inside Copilot Chat's normal editor-context window. A bare where is X handled without structure tends to return the file the model finds most semantically central rather than an exhaustive list, because nothing tells it exhaustiveness is the goal over a single good-enough answer; asking for every file plus the specific export forces coverage instead of a representative example. Separating source of truth from downstream consumer matters because the real risk in a cross-cutting change is rarely the file you are editing — it is the file depending on the old shape that nobody remembers to update, which is the exact question a change-impact review exists to answer. The instruction to say not found rather than infer a plausible file directly targets @workspace's failure mode under thin retrieval: producing a confident-sounding file reference that matches the pattern of what should exist in a codebase like this one, rather than what this codebase actually has.",
    exampleOutput:
      "1. lib/billing/tier.ts exports getUserTier() (source of truth); components/paywall/FeatureGate.tsx and lib/api/middleware/require-tier.ts both call it. 2. getUserTier() is the source of truth; FeatureGate.tsx and require-tier.ts are consumers. 3. A near-duplicate tier check exists inline in app/api/reports/export/route.ts instead of calling getUserTier() — flagging as duplication. 4. Adding a trial tier requires changes to lib/billing/tier.ts (new enum value) and require-tier.ts (expiry check); FeatureGate.tsx needs no change since it only checks tier !== 'free', not a specific value.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.260 (VS Code, @workspace)',
        date: '2026-07-12',
      },
    ],
    changelog: [
      {
        date: '2026-07-12',
        note: 'Initial publish, verified against Copilot Chat 1.260 (VS Code) with @workspace.',
      },
    ],
  },
  {
    slug: 'copilot-commit-message-from-diff',
    category: 'github-copilot',
    title: 'Get a commit message that explains why, not a restatement of the diff',
    description:
      "A prompt for Copilot's Source Control commit-message generation that forces a why-focused message instead of the tool's default file-list summary.",
    promptText:
      'Generate the commit message for the currently staged changes. Do not describe the diff mechanically ("updated file X", "added function Y") — a commit message that just restates the diff tells a future reader nothing the diff itself did not already show.\n\nCONTEXT FOR WHY THIS CHANGE EXISTS\n{{staged_change_context}}\n\nTICKET OR ISSUE\n{{ticket_ref}}\n\nFormat as:\nSubject line — imperative mood, under 72 characters, states the effect of the change, not the mechanism ("Fix zero-row CSV export crash", not "Add null check to formatRowCount").\nBody — one short paragraph on why this was necessary, referencing the ticket if given, then a line noting anything a reviewer of this commit later should know that is not obvious from the diff alone, such as a deliberate tradeoff or a follow-up left for later.\n\nIf the staged diff contains changes that look unrelated to the context given, say so instead of writing one message that quietly covers both.',
    variables: [
      {
        name: 'staged_change_context',
        description:
          'Why this change exists — the part that never appears in the diff itself.',
        example:
          'Support ticket JIRA-4821: three customers hit an export crash this week when filtering a report to an empty date range.',
        required: true,
      },
      {
        name: 'ticket_ref',
        description: 'The ticket or issue ID this commit closes, if any.',
        example: 'JIRA-4821',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot (VS Code Source Control)'],
    tags: ['commit-messages', 'git', 'source-control', 'documentation'],
    whyItWorks:
      "Copilot's Source Control integration generates a commit message from the staged diff via a one-click action, and left to the diff alone it produces a mechanically accurate but low-value summary — it can see what changed but not why, because the why usually lives in a conversation, a ticket, or a decision that never appears in the code itself. Supplying that context explicitly is the only way to get it into the message at all; the tool is not being under-prompted so much as working from strictly less information than the human who staged the change actually has. The instruction to distinguish effect from mechanism in the subject line matters because a diff-derived summary defaults to describing the mechanism, since that is the part visible in the patch, while the effect — what the fix accomplishes for a user or a future reader scanning git log — is exactly the part that has to be supplied or inferred from context rather than read off the diff. Flagging unrelated staged changes rather than folding them into one narrative also catches a real, common problem: a generated commit message will happily produce one coherent-sounding story for two unrelated staged changes, which hides a mixed commit a reviewer would otherwise ask to be split.",
    exampleOutput:
      'Fix zero-row CSV export crash\n\nExporting a report filtered to zero matching rows threw a TypeError in formatRowCount, since dividing by a zero total produced NaN and NaN.toFixed() throws. Guarded the calculation to return "0.0" when total is zero. Closes JIRA-4821. Note: the same unguarded pattern exists in formatAverageValue and is tracked separately, not fixed here.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot',
        version: 'VS Code Source Control integration, 1.260',
        date: '2026-07-08',
      },
    ],
    changelog: [
      {
        date: '2026-07-08',
        note: 'Initial publish, verified against the Copilot VS Code Source Control integration.',
      },
    ],
  },
  {
    slug: 'explain-this-error-with-context',
    category: 'github-copilot',
    title: 'Get an error explained in terms of your code, not a generic definition',
    description:
      '/explain prompt for a terminal error or Problems-panel diagnostic that forces Copilot to trace the error to the specific line and state, instead of defining the error class in the abstract.',
    promptText:
      '/explain this error, but do not give me a generic definition of what this error class normally means — I need to know what is happening in this specific code.\n\nERROR\n{{error_text}}\n\nWHEN IT HAPPENS\n{{when_it_happens}}\n\nRELEVANT CODE\n{{surrounding_code}}\n\nAnswer in this order:\n1. In one sentence, what value or state is wrong, named specifically, at the moment this error fires.\n2. Why that value ended up wrong — trace it back one step, to where it was set, or where it should have been set and was not.\n3. Whether this is a one-off input problem or a bug that will recur for any input matching the pattern in step 1.\n4. Do not propose a fix unless I ask for one. I want to understand this first.',
    variables: [
      {
        name: 'error_text',
        description: 'The exact error message or diagnostic text.',
        example: "TypeError: undefined is not a function (evaluating 'cart.items.map')",
        required: true,
      },
      {
        name: 'when_it_happens',
        description: 'The specific circumstance that triggers it.',
        example:
          'Happens only on the very first page load, before the cart has been fetched from the API.',
        required: true,
      },
      {
        name: 'surrounding_code',
        description: 'The relevant function or component, pasted in.',
        example:
          'The CartSummary component and the useCart() hook it calls, pasted below.',
        required: true,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)', 'GitHub Copilot Chat (JetBrains)'],
    tags: ['explain-error', 'slash-commands', 'debugging', 'error-messages'],
    whyItWorks:
      "/explain is Copilot's built-in slash command for explaining a selection or a pasted error, but its default behavior for a common error type — a null reference, a type mismatch, an undefined is not a function — tends toward explaining what that class of error generally means in the language, because that is the more confident, more readily available answer without deep tracing into the specific code. That is genuinely useful to a beginner, but not to someone who already knows what a TypeError is and needs to know why this line hit one. Explicitly forbidding the generic definition and demanding the specific wrong value, named, forces it to actually use the pasted code rather than defaulting to a documentation-style answer. Asking it to trace back one step, to where the value was set, converts here's what a null reference is into here's the specific line that returned undefined. Separating diagnosis from fix, with fixes only on request, keeps the interaction from skipping past the step where you actually build a mental model of what went wrong — the difference between fixing an error and understanding it.",
    exampleOutput:
      '1. cart.items is undefined at the moment CartSummary renders — not cart itself, cart.items specifically. 2. useCart() initializes cart as { items: null } until the fetch resolves, and CartSummary renders before that fetch completes on first load. 3. This will recur on every first page load for any user, not just an edge case — it is a race between initial render and the fetch, not a one-off bad input.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.260 (VS Code)',
        date: '2026-07-15',
      },
    ],
    changelog: [
      {
        date: '2026-07-15',
        note: 'Initial publish, verified against Copilot Chat 1.260 (VS Code).',
      },
    ],
  },
  {
    slug: 'copilot-legacy-code-migration-plan',
    category: 'github-copilot',
    title: 'Plan a multi-file migration before Copilot Edits touches a single file',
    description:
      'A migration brief for Copilot Edits that forces a dependency-ordered, file-by-file plan and a one-file pilot checkpoint before any multi-file rewrite starts.',
    promptText:
      'I want to migrate {{migration_from}} to {{migration_to}} using Copilot Edits across multiple files. Before editing anything, produce a plan — do not start changing files until I approve it.\n\nSCOPE\n{{files_or_scope}}\n\nMUST NOT BREAK\n{{must_not_break}}\n\nPLAN FORMAT\n1. List every file in scope and, for each, the specific change it needs — not "update as needed."\n2. Order the files so a shared or foundational file (types, config, a base class) is migrated before the files depending on it, and say why that order avoids a broken intermediate state.\n3. Name one file to migrate first as a pilot, and how I will know from that single file whether the overall approach is right before the rest are touched.\n4. For each item under MUST NOT BREAK, name which specific file\'s migration could threaten it, and how the plan avoids that.\n\nAfter I approve the plan, migrate only the pilot file from step 3 and stop. Show me that diff before continuing to the rest.',
    variables: [
      {
        name: 'migration_from',
        description: 'What you are migrating away from.',
        example: 'the class-component + Redux connect() pattern',
        required: true,
      },
      {
        name: 'migration_to',
        description: 'What you are migrating to.',
        example:
          'function components with hooks and the existing useAppSelector/useAppDispatch hooks',
        required: true,
      },
      {
        name: 'files_or_scope',
        description: 'The directory or set of files the migration covers.',
        example: 'Every component under components/dashboard/, roughly 14 files.',
        required: true,
      },
      {
        name: 'must_not_break',
        description: 'Specific behavior that must survive the migration unchanged.',
        example:
          'The memoized selectors in dashboard components must not re-render on every store update — that performance behavior is load-bearing on the live dashboard.',
        required: true,
      },
    ],
    targetTools: ['GitHub Copilot Edits (VS Code)', 'GitHub Copilot Chat (VS Code)'],
    tags: ['migration', 'copilot-edits', 'multi-file', 'refactoring'],
    whyItWorks:
      "Copilot Edits, the multi-file editing mode in Copilot Chat, can propose changes across several files in one pass, which is exactly the mechanism a migration needs but also exactly where an unscoped migration goes wrong — a model asked to migrate X to Y across a codebase tends to touch files in whatever order it encounters them, which can leave a dependent file migrated before the shared type or config it relies on, producing a broken intermediate state that is hard to bisect afterward. Forcing an explicit dependency-aware ordering, foundational files before dependents, mirrors how a careful human would sequence the same migration and gives you something to sanity-check before any code moves. Naming a single pilot file and stopping after it turns a large multi-file migration into a cheap checkpoint: if the approach is wrong, there is one file's diff to revert, not twenty. The must-not-break section, mapped explicitly to the specific file threatening each item, exists because a generic don't break anything instruction gives Copilot Edits nothing to check itself against — a named risk tied to a named file is something the plan step can actually reason about before a single line changes.",
    exampleOutput:
      "Plan (excerpt): 1. Migrate dashboard/types.ts first (shared prop types, no component logic) — foundational, nothing depends on it changing behavior. 2. Migrate DashboardSummaryCard.tsx as the pilot: smallest component using the pattern, low traffic, easy to verify in isolation. 3. Risk check: memoized selector behavior in DashboardSummaryCard.tsx currently relies on connect()'s shallow-equal check — the hooks version must use useAppSelector with an equivalent selector, not a naive useSelector(state => state.dashboard), or it will re-render on every store update, violating the must-not-break constraint.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Edits',
        version: 'Copilot Edits 1.260 (VS Code, multi-file)',
        date: '2026-07-27',
      },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Copilot Edits 1.260 (VS Code).',
      },
    ],
  },
  {
    slug: 'copilot-security-autofix-review',
    category: 'github-copilot',
    title: 'Turn a Copilot Autofix suggestion into a verified fix, not a rubber stamp',
    description:
      'A review prompt for a GitHub code-scanning alert with a Copilot Autofix suggestion that forces you to verify the fix actually closes the vulnerability, not just silences the scanner.',
    promptText:
      "A GitHub code scanning alert flagged {{alert_description}} and Copilot Autofix suggested a fix. Do not accept the suggestion yet — verify it first.\n\nAUTOFIX SUGGESTION\n{{autofix_suggestion}}\n\nAFFECTED CODE\n{{affected_code}}\n\nAnswer, in order:\n1. State the exact exploit this alert is warning about — a concrete input or request an attacker could send, not a restatement of the alert's category name.\n2. Confirm whether the suggested fix actually closes that specific exploit path, or only makes the pattern the scanner matches on disappear, for example by suppressing the symptom rather than validating the input.\n3. Name any other place in this file or nearby files with the same vulnerable pattern that this specific alert did not flag, since a vulnerable pattern that appears once is usually copy-pasted elsewhere too.\n4. State what a passing test for this fix would need to assert — that the malicious input from step 1 is now rejected or safely handled, not just that the code still compiles.\n\nOnly recommend accepting the Autofix suggestion if your answer to question 2 is yes.",
    variables: [
      {
        name: 'alert_description',
        description: "The code-scanning alert's stated finding, as GitHub reported it.",
        example:
          'SQL injection: user-provided value flows into a database query without sanitization (rule js/sql-injection)',
        required: true,
      },
      {
        name: 'autofix_suggestion',
        description: 'The exact diff Copilot Autofix proposed.',
        example:
          "Wraps the raw value in the database driver's escape() helper before interpolating it into the query string.",
        required: true,
      },
      {
        name: 'affected_code',
        description: 'The actual flagged function or query-building code, pasted in.',
        example:
          'The searchUsers(query) function in lib/db/users.ts, pasted below, which builds a raw SQL string from the query parameter.',
        required: true,
      },
    ],
    targetTools: ['GitHub Copilot Autofix', 'GitHub code scanning (CodeQL)'],
    tags: ['security', 'autofix', 'code-scanning', 'vulnerability-review'],
    whyItWorks:
      "GitHub's Copilot Autofix generates a suggested code change directly on a code-scanning alert, and its one-click accept path is deliberately fast, which is also its risk — a fast accept can silence the specific pattern CodeQL's query matched without closing the actual exploit path, especially for alerts where several different code shapes trigger the same finding and the generated fix addresses only the literal flagged line. Requiring the exploit to be stated as a concrete input, not the alert's category name such as SQL injection, forces a check against the real attack rather than the label attached to it. Asking whether the fix closes that path or only removes the pattern the scanner keys on directly targets Autofix's known failure mode of pattern-level rather than vulnerability-level remediation — an escape() call added in the wrong place can satisfy the scanner while leaving a second, differently-shaped injection point untouched. The instruction to search nearby code for the same unflagged pattern matters because vulnerable code is rarely written once — a copy-pasted query-building helper tends to exist at more than one call site, and static analysis does not always catch every one, particularly through indirection. Gating acceptance on a yes answer to the verification question turns Autofix suggested it into a decision a human actually made, rather than a suggestion that shipped because it was easier to accept than to check.",
    exampleOutput:
      "1. Exploit: a query parameter like ' OR '1'='1 sent to the search endpoint would return every user row instead of a filtered match, or worse with a stacked query depending on the driver. 2. The Autofix escape() call does close this specific path — confirmed by tracing that the escaped value can no longer terminate the quoted string. 3. buildOrderClause() in the same file interpolates a sort-column parameter into the query with no escaping at all — not flagged by this alert, but the same class of risk. 4. Test should assert that searchUsers(\"' OR '1'='1\") returns zero or an error, not the full user table.",
    verifiedAgainst: [
      { tool: 'GitHub Copilot Autofix', version: 'GA, 2026', date: '2026-06-20' },
    ],
    changelog: [
      {
        date: '2026-06-20',
        note: 'Initial publish, verified against GitHub Copilot Autofix GA.',
      },
    ],
  },
]
