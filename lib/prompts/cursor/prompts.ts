import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'cursor-composer-feature-build-brief',
    category: 'cursor',
    title: 'Brief Cursor Composer to build a multi-file feature without wandering off',
    description:
      'A Composer/Agent-mode brief that names exactly which files are in scope, the data contract between them, and what to leave alone, so a multi-file autonomous build stays inside the feature you actually asked for.',
    promptText: `You are working in Composer/Agent mode with multi-file edit access in this repo. Build the following feature end to end, but stay inside the scope defined below.

FEATURE
{{feature_description}}

FILES YOU MAY TOUCH
{{files_in_scope}}

DATA CONTRACT BETWEEN THESE FILES
{{data_contract}}

OUT OF SCOPE — DO NOT TOUCH
{{out_of_scope}}

WORKING RULES
- Before writing any code, list the exact files you will create or modify and the order you'll edit them in. If that plan needs a file outside the list above, stop and name it before touching it — don't expand scope silently.
- After each file edit, state which part of the feature description it satisfies.
- Do not install a new dependency without naming it and the reason first.
- Keep the data contract above literal — if a field name or shape needs to change to make this work, say so and wait rather than quietly adapting it on one side only.

WHEN DONE
List every file changed, one line each, and name anything from the feature description you could not finish and why.`,
    variables: [
      {
        name: 'feature_description',
        description: 'What the feature does and the user-facing behavior it must have.',
        example:
          'Add a "save search" button on the results page that stores the current filters under a name and lists saved searches in the sidebar for the logged-in user.',
        required: true,
      },
      {
        name: 'files_in_scope',
        description:
          'The exact files or directories Composer is allowed to create or edit for this task.',
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
          'Adjacent files or systems that must not change even if Composer notices something related while it works.',
        example:
          'Do not touch the existing filter-parsing logic in lib/search/parseFilters.ts, and do not modify the results table component itself.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.1', 'Cursor 2.0'],
    tags: ['composer', 'agent-mode', 'multi-file-edit', 'feature-build', 'scope-control'],
    whyItWorks:
      "Composer's agent mode is free to open, semantically search, and edit any file it can find in the index once given an open-ended brief — that's what makes it capable of a real multi-file feature, and also what makes it capable of touching five files you never mentioned. Naming FILES YOU MAY TOUCH gives it a hard boundary instead of asking it to infer scope from the feature description alone, and requiring a file-by-file plan before edits are applied means you see the blast radius while it's still a list, not after it's already a diff spread across the repo. Stating the DATA CONTRACT explicitly matters for a different reason: in a multi-file build the model writes the producer and consumer of a shape in separate turns, and without a literal contract to check against, a field renamed on one side (e.g. filters vs filterState) silently breaks the other side while both files individually look correct.",
    exampleOutput: `Plan before editing:
1. lib/searches/store.ts (new) — SavedSearch type + in-memory/localStorage adapter
2. app/api/searches/route.ts (new) — GET/POST using the store
3. app/search/results/SavedSearches.tsx (new) — renders searches, calls POST on save
4. app/search/results/page.tsx (edit) — add the Save button, wire it to SavedSearches

Proceeding in that order. Nothing outside the listed files will be touched — filter parsing and the results table are untouched.

...

Summary:
- lib/searches/store.ts: added, satisfies "store the current filters under a name"
- app/api/searches/route.ts: added, satisfies "list saved searches" (GET) and save action (POST)
- app/search/results/SavedSearches.tsx: added, satisfies "lists saved searches in the sidebar"
- app/search/results/page.tsx: edited only to add the Save button and mount the sidebar component

Not completed: per-user scoping was described as "for the logged-in user" but no auth context was found wired into this route group — flagging rather than guessing at an auth pattern.`,
    verifiedAgainst: [
      { tool: 'Cursor', version: '2.1', date: '2026-07-10' },
      { tool: 'Cursor', version: '2.0', date: '2026-06-18' },
    ],
    changelog: [
      {
        date: '2026-07-10',
        note: 'Initial publish, verified against Cursor 2.1 Composer/Agent mode.',
      },
    ],
  },
  {
    slug: 'cursor-cmdk-inline-edit-brief',
    category: 'cursor',
    title: 'Get a contained edit out of Cursor Cmd+K instead of a rewritten block',
    description:
      'A Cmd+K inline-edit instruction that names the transformation and exactly what must stay byte-identical, tuned for the selection-scoped inline editor rather than a whole-file agent pass.',
    promptText: `[Cmd+K on the selected block — this instruction applies only to the highlighted selection]

Transform only the selected code. Do not touch anything outside the highlight, and do not restyle lines inside it that the transformation doesn't require changing.

WHAT THE SELECTED CODE CURRENTLY DOES
{{selected_code_purpose}}

TRANSFORMATION
{{transformation}}

MUST STAY BYTE-IDENTICAL
{{preserve_list}}

Keep the existing function/variable names and the surrounding formatting style unless the transformation explicitly requires changing one of them. If the transformation can't be done without changing something in MUST STAY BYTE-IDENTICAL, stop and explain why instead of doing it anyway.`,
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
          'The specific change to make to the selection — one transformation, stated concretely.',
        example:
          'Add retry with exponential backoff (max 3 attempts) around the fetch call.',
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
    ],
    targetTools: ['Cursor 2.1'],
    tags: [
      'cmd-k',
      'inline-edit',
      'selection-scoped',
      'targeted-refactor',
      'contained-change',
    ],
    whyItWorks:
      "Cmd+K's diff preview is scoped to the highlighted selection and its immediate surrounding context, which is a narrower window than Composer's full-repo index — that narrowness is the feature, but it also means Cmd+K has less context to infer what not to change, so it will happily reformat the whole block while it's in there rewriting one line. Restating what the selected code currently does anchors intent for an editor that isn't reasoning over the rest of the file the way an agent-mode pass would. Naming a MUST STAY BYTE-IDENTICAL list is the actual lever: it converts an implicit expectation ('obviously keep the signature the same') into a checkable constraint, which matters specifically for Cmd+K because its regeneration of the selected block is a full rewrite of that span, not a patch — nothing stops it from returning a differently-shaped block unless told what to preserve.",
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
// Signature and null-on-missing-id behavior unchanged, as required.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-06-25' }],
    changelog: [
      {
        date: '2026-06-25',
        note: 'Initial publish, verified against Cursor 2.1 Cmd+K inline edit.',
      },
    ],
  },
  {
    slug: 'cursor-bugbot-pr-review-brief',
    category: 'cursor',
    title: 'Point Cursor BugBot at real risk instead of letting it restate the diff',
    description:
      "A PR description written for BugBot, Cursor's automated PR-review agent, that states risk areas and known trade-offs up front so its comments concentrate on logic and security instead of narrating what the diff already shows.",
    promptText: `PR SUMMARY
{{pr_summary}}

RISK AREAS TO FOCUS REVIEW ON
{{risk_areas}}

KNOWN TRADE-OFFS — do not flag these as bugs, they were a deliberate choice
{{known_tradeoffs}}

@BugBot review this PR against the risk areas above specifically. For each finding: cite the file and line, classify it as Bug, Security, or Style, and rate it Blocking or Minor. Skip anything already listed under known trade-offs — if you disagree with a trade-off, say so as a Minor note, not a Blocking finding.`,
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
          'Deliberate design choices in this PR that a reviewer (human or bot) might otherwise flag as a defect.',
        example:
          'Tier boundaries are hardcoded, not config-driven — intentional for this release, a follow-up ticket will move them to settings.',
        required: false,
      },
    ],
    targetTools: ['Cursor 2.1', 'Cursor BugBot'],
    tags: ['bugbot', 'pr-review', 'code-review', 'automated-review', 'github'],
    whyItWorks:
      "BugBot runs automatically against a PR's diff once enabled on a repo and posts inline comments without a human writing a review prompt at all, which is exactly the problem: with no steer, it reviews the whole diff at a uniform level of attention and its comment thread mixes real logic risk with restated-diff narration and style nits in no particular order. Naming RISK AREAS concentrates its attention the same way a scoped rubric concentrates any LLM reviewer — it's told where the actual uncertainty in this change lives (tier boundaries, a possibly-still-reachable old code path) instead of treating every line as equally suspicious. KNOWN TRADE-OFFS does the opposite job: it suppresses the single most common false-positive pattern in automated PR review, where a deliberate simplification gets flagged as a defect because the reviewer has no way to know it was a choice rather than an oversight, and it explicitly downgrades a disagreement to a Minor note instead of a Blocking finding so a legitimate design debate doesn't stall the merge.",
    exampleOutput: `BugBot findings:
1. checkout/pricing/tiers.ts:34 — Bug, Blocking. Tier lookup uses cartTotal > threshold, so a cart total of exactly $100.00 falls into tier 1, not tier 2 as the PR summary implies. Off-by-boundary on the exact value you flagged.
2. checkout/pricing/legacy.ts:12 — Bug, Blocking. calculateFlatDiscount is still exported and still called from api/cart/quote.ts, so the old code path you asked me to check is in fact still reachable.
3. checkout/pricing/tiers.ts:8 — Style, Minor. Hardcoded tier boundaries — noted as a known trade-off, not blocking, but flagging the follow-up ticket isn't linked anywhere in this PR.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-07-18' }],
    changelog: [
      {
        date: '2026-07-18',
        note: "Initial publish, verified against Cursor BugBot's GitHub PR integration on Cursor 2.1.",
      },
    ],
  },
  {
    slug: 'cursor-background-agent-task-brief',
    category: 'cursor',
    title: 'Hand Cursor Background Agents a task that survives you not being there',
    description:
      "A self-contained brief for Cursor's Background Agents — the async, remote-run agent mode — with success criteria and a rule to resolve ambiguity conservatively, since no one will answer follow-up questions while it works.",
    promptText: `BACKGROUND AGENT TASK

This runs unattended in a remote environment. No one is present to answer follow-up questions while you work — resolve ambiguity by choosing the most conservative option and documenting the choice, rather than pausing to ask.

TASK
{{task_description}}

SUCCESS CRITERIA — the task is only done when every one of these is true
{{success_criteria}}

CHECK-IN POINTS — pause and report progress at these milestones, but keep working past them unless told otherwise
{{checkin_points}}

RULES FOR UNATTENDED WORK
- Commit in small, reviewable increments with descriptive messages, not one giant commit at the end.
- If you hit a blocker the success criteria can't resolve, stop, write down exactly what you tried and why it failed, and leave the branch in a working, buildable state rather than half-finished.
- Open a draft PR when finished, with a summary of every decision you made without asking, so it can be reviewed in one pass.`,
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
    ],
    targetTools: ['Cursor 2.1', 'Cursor Background Agents'],
    tags: [
      'background-agents',
      'async-agent',
      'long-running-task',
      'unattended-agent',
      'remote-agent',
    ],
    whyItWorks:
      "Background Agents run in an isolated, cloud-provisioned checkout disconnected from your live editor session, and they run asynchronously — the entire back-and-forth clarification loop that a live Composer session gets for free (you notice it's about to do something wrong and say so mid-turn) isn't available here. The brief has to front-load every decision point that would normally get resolved in chat, which is why 'resolve ambiguity conservatively and document the choice' is doing real work: it substitutes a standing policy for the live human judgment call that isn't there. SUCCESS CRITERIA plays the same substitute role for the human 'yes, that's right, keep going' signal. Requiring small commits and a draft PR at the end matches how the output actually gets consumed — you review it as a diff/PR afterward, not as a live edit stream, so the deliverable has to be reviewable in that shape from the start, not reconstructed after the fact.",
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-07-25' }],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Cursor 2.1 Background Agents.',
      },
    ],
  },
  {
    slug: 'cursor-checkpoint-safe-refactor-brief',
    category: 'cursor',
    title:
      'Refactor with Cursor checkpoints as a named safety net, not a fallback nobody uses',
    description:
      "A refactor brief that breaks the change into checkpoint-sized steps and tells Cursor's agent to stop and name the last good checkpoint on failure, instead of patching a bad step with a second speculative fix.",
    promptText: `REFACTOR GOAL
{{refactor_goal}}

Break this into the smallest steps that each leave the codebase working and checkpointable. Treat each of these as a checkpoint boundary — after completing each one, pause and tell me it's safe to checkpoint before continuing to the next:
{{risky_steps}}

If a step fails, do not patch around it with a second speculative change on top. Stop, name the last good checkpoint, and describe exactly what went wrong — then wait.

ROLLBACK SIGNAL
If I say "{{rollback_signal}}", treat that as an instruction to stop immediately and tell me exactly what to roll back to the last checkpoint — not to keep going and fix forward.`,
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
        name: 'rollback_signal',
        description:
          'The exact phrase you will use mid-session to trigger an immediate stop-and-rollback instruction.',
        example: 'roll it back',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.1'],
    tags: ['checkpoints', 'rollback', 'refactor', 'agent-mode', 'safety-net'],
    whyItWorks:
      "Cursor's agent mode checkpoints the workspace after each turn, so you can roll back to before a specific edit without discarding the whole session — but that safety net is only as useful as the granularity of the steps between checkpoints and how quickly you catch a bad one. Breaking the refactor into named risky_steps gives you several small checkpoint boundaries to roll back to instead of one large diff where checkpoint granularity is useless because the whole thing landed in one turn. The instruction to stop and name the last good checkpoint on failure, rather than patch around it, targets a specific documented agent tendency: once an edit doesn't work, the model's next move is usually a second corrective change layered on top rather than a clean rollback, and every layer on top makes the eventual rollback point harder to identify and the diff harder to review. Naming a literal ROLLBACK SIGNAL phrase also matters — it gives you a one-word interrupt that unambiguously means stop and undo, distinct from any other correction you might type mid-session that the agent could otherwise read as 'keep going, differently.'",
    exampleOutput: `Step 1 complete: unified formatDate written in src/lib/date.ts, covers all 4 format strings found in the codebase. Safe to checkpoint here.

Step 2 complete: swapped 3 callers in src/reports/. Tests pass. Safe to checkpoint here.

Step 3: swapping callers in src/dashboard/ — hit a failure. DashboardHeader.tsx passed a Date object where the other callers passed an ISO string; formatDate assumed string input and threw.

Stopping here rather than patching formatDate to accept both types silently. Last good checkpoint: end of Step 2. Waiting for direction — options are (a) normalize the caller to pass a string, or (b) widen formatDate's input type deliberately.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: "Initial publish, verified against Cursor 2.1's agent-mode checkpoint/rollback behavior.",
      },
    ],
  },
  {
    slug: 'cursor-multiroot-monorepo-context-brief',
    category: 'cursor',
    title: 'Tell Cursor which package actually owns a change in a multi-root monorepo',
    description:
      "A context brief for Cursor's multi-root workspace support that names the owning package, treats sibling packages as read-only context, and states shared-file boundaries, so the agent doesn't cross package lines while searching the whole workspace.",
    promptText: `This workspace has multiple roots open at once. Before editing anything, confirm which root and package you're in.

OWNING PACKAGE FOR THIS CHANGE
{{owning_package}}

SIBLING PACKAGES IN THIS WORKSPACE — context only, do not edit these
{{sibling_packages}}

SHARED FILES / BOUNDARY RULES
{{shared_files_boundary}}

RULES
- Make all edits inside the owning package unless a shared file must change to satisfy the task — if so, name the shared file and ask before editing it.
- If a symbol or type you need already exists in a sibling package, import it. Do not redefine or fork it locally, even if that seems faster.
- Don't run a workspace-wide build, lint, or test command when a package-scoped one exists — name the package-scoped command you're using.`,
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
    ],
    targetTools: ['Cursor 2.1'],
    tags: [
      'multi-root-workspace',
      'monorepo',
      'context-briefing',
      'package-boundaries',
      'agent-mode',
    ],
    whyItWorks:
      "Multi-root workspace support means Cursor's indexer sees several package roots at once and its semantic code search treats them as one searchable space by default — that's the point of the feature, but it also means a similarly named file or function in another root is a plausible edit target unless the agent is told which root actually owns the change. Without OWNING PACKAGE stated explicitly, a 'closest semantic match' search across roots can surface a same-named helper in a sibling package as the thing to edit, or the model can duplicate a type that already exists in a package it was never told to treat as read-only. Naming shared-file boundaries closes a second, more damaging gap: monorepo root config (workspace manifests, base tsconfig) affects every package silently, so an edit there is exactly the kind of change an agent should never make without an explicit ask, even though nothing about the task description would obviously exclude it. Requiring package-scoped commands over workspace-wide ones prevents a slower but real failure mode: a workspace-level build or test run silently exercising and reporting on packages the change never touched.",
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-07-05' }],
    changelog: [
      {
        date: '2026-07-05',
        note: 'Initial publish, verified against Cursor 2.1 multi-root workspace support in a pnpm monorepo.',
      },
    ],
  },
  {
    slug: 'cursor-design-mock-to-component-brief',
    category: 'cursor',
    title: 'Turn a pasted design mock into a component that fits your design system',
    description:
      "A brief for pasting a screenshot or Figma export into Cursor's chat/Composer that locks the output to your existing component primitives and design tokens instead of a plausible-looking reimplementation from scratch.",
    promptText: `I'm attaching a design mock (screenshot/image). Build this as a component in this codebase.

WHAT THE MOCK SHOWS
{{mock_description}}

USE THESE EXISTING PRIMITIVES — do not invent new ones or pull in a new UI library
{{component_library}}

RESPONSIVE BREAKPOINTS TO MATCH
{{breakpoints}}

INTERACTIONS NOT VISIBLE IN A STATIC MOCK
{{interaction_notes}}

Match spacing, type scale, and color to what's visible in the image as closely as this codebase's existing tokens allow. If an exact match requires a new token or a one-off value, name it and ask rather than hardcoding a raw hex or pixel value.

When done, list any part of the mock you interpreted rather than measured exactly, so it can be checked against the source file.`,
    variables: [
      {
        name: 'mock_description',
        description:
          'What the mock shows in words, in case the image is ambiguous or partially cropped.',
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
    ],
    targetTools: ['Cursor 2.1'],
    tags: [
      'design-to-code',
      'mock-to-component',
      'multimodal',
      'design-system',
      'composer',
    ],
    whyItWorks:
      "Cursor's chat and Composer accept image attachments and reason over them multimodally, but a static image can't convey which of your existing components a given element should map to, or what happens on hover — without being told, the model defaults to writing new one-off markup and inline styles that happen to look right in isolation while ignoring every primitive your design system already has. Naming COMPONENT_LIBRARY explicitly turns 'build this' into 'compose this from what already exists,' which is the difference between a component that matches the mock today and one that also matches the rest of the app in six months. Requiring it to flag any hardcoded value it invented — a one-off hex, a pixel value with no token behind it — surfaces exactly the gap between 'looks right against the screenshot' and 'fits the actual design system,' which is where mock-to-code output usually drifts without anyone noticing until a design review catches it.",
    exampleOutput: `Built PricingCard using Card, Button, and Badge from your library. Spacing uses the existing gap-4/gap-6 scale; type uses text-lg/font-semibold for the price, matching your existing Heading styles.

Flagged for review: the mock's price text appears to be a slightly darker gray than any existing text-* token in tailwind.config.ts — I used text-slate-700 (closest existing token) rather than inventing a new shade. Please confirm against the source file if exact match matters here.

Breakpoints implemented: grid-cols-3 at lg:, grid-cols-2 at sm:, grid-cols-1 below that, per the stated ranges.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-07-14' }],
    changelog: [
      {
        date: '2026-07-14',
        note: "Initial publish, verified against Cursor 2.1's multimodal chat/Composer image input.",
      },
    ],
  },
  {
    slug: 'cursor-agent-mode-test-suite-brief',
    category: 'cursor',
    title: "Have Cursor's agent write tests that would actually catch a regression",
    description:
      'An agent-mode brief for generating tests against documented behavior rather than the implementation as found, with a forced tripwire that proves each test would actually fail if the behavior broke.',
    promptText: `Write tests for {{module_to_test}} using {{test_framework}}. Work in agent mode: read the implementation yourself, but write tests against the expected behavior below — not against whatever the code currently happens to do if the two disagree. Flag any disagreement instead of silently encoding the current behavior as correct.

BEHAVIOR THIS MODULE MUST GUARANTEE
{{behaviors_to_cover}}

EDGE CASES TO COVER EXPLICITLY
{{edge_cases}}

RULES
- Every test must fail if the corresponding behavior breaks. Before finishing, pick one test and describe the specific code change that would make it fail, to prove it isn't vacuous.
- Do not mock the function under test itself.
- Do not write a test that only asserts a function was called — assert on its actual output or side effect.
- If two of the edge cases above turn out to be handled by the exact same code path, say so instead of writing two tests that will always pass or fail together.`,
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
    ],
    targetTools: ['Cursor 2.1'],
    tags: ['test-generation', 'agent-mode', 'tdd', 'regression-testing', 'edge-cases'],
    whyItWorks:
      "Agent mode reads the implementation before writing tests, which creates a specific and well-documented failure mode: it's easy for a model to generate assertions that mirror the current implementation's exact behavior rather than the intended behavior, which lets a test suite pass at 100% while encoding a live bug as 'correct' forever. Separating BEHAVIOR THIS MODULE MUST GUARANTEE from 'go read the implementation' forces a comparison between intent and code instead of a transcription of one into the other, and explicitly asking it to flag disagreement gives it permission to say the code is wrong rather than assume the code is the spec. The 'describe what would make this test fail' step is a concrete tripwire against the single most common form of AI-generated test padding — an assertion that a mock was called, which adds a line of coverage-percentage without adding any actual regression protection, since it would still pass if the real logic were deleted entirely.",
    exampleOutput: `describe('applyDiscount', () => {
  it('clamps at $0 minimum even with discount over 100%', () => {
    expect(applyDiscount(10, 150)).toBe(0)
  })
  // This test fails if the clamp is removed or changed to Math.max(-Infinity, ...) —
  // verified by temporarily removing the clamp and confirming it returns -5.

  it('never further discounts an already-free item', () => {
    expect(applyDiscount(0, 50)).toBe(0)
  })
})

Flag: edge cases "discount of exactly 100%" and "discount over 100%" both hit the same clamp branch in the current implementation — written as one parameterized test, not two, since they'd always pass or fail together.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-06-30' }],
    changelog: [
      {
        date: '2026-06-30',
        note: 'Initial publish, verified against Cursor 2.1 agent mode with Vitest.',
      },
    ],
  },
  {
    slug: 'cursor-agent-mode-dependency-upgrade-brief',
    category: 'cursor',
    title:
      'Run a major dependency upgrade through Cursor agent mode in stages, not one shot',
    description:
      'A triage-then-migrate-then-verify brief for upgrading a dependency across a codebase in agent mode, with a confirm gate before any file changes so the blast radius is reviewed as a plan, not a diff.',
    promptText: `Upgrade {{package_name}} from {{current_version}} to {{target_version}} across this codebase. Do this in three explicit stages and stop between each for confirmation before continuing.

STAGE 1 — TRIAGE
Search the codebase for every usage of {{package_name}}'s APIs. Cross-reference against these known breaking changes and report which usages are affected before changing anything:
{{breaking_changes_notes}}

STAGE 2 — MIGRATE
Only after triage is confirmed: update the dependency version and migrate each affected usage found in Stage 1. Do not touch files that only import the package without using an affected API.

STAGE 3 — VERIFY
Run the build, typecheck, and test suite. If anything fails that Stage 1 did not predict, stop and report it as a gap in the triage — don't silently patch around it.

Do not upgrade any other dependency as a side effect, even a peer dependency, without naming it and asking first.`,
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
    ],
    targetTools: ['Cursor 2.1'],
    tags: [
      'dependency-upgrade',
      'agent-mode',
      'migration',
      'breaking-changes',
      'staged-rollout',
    ],
    whyItWorks:
      "An unscoped 'upgrade this package' request in agent mode tends to bump the version number and then start editing whatever breaks at typecheck time, which quietly conflates two very different categories of change: code the migration guide says must change, and code that merely needs a type assertion to compile without actually being correct. Forcing a triage-then-confirm gate before any file is touched means the blast radius gets reviewed while it's still a list of usages, not after it's already a diff applied across dozens of files under the pressure of 'the build is currently broken, let's just fix it.' Treating a Stage 3 failure the triage didn't predict as a reportable gap, rather than something to patch around silently, catches breaking changes that weren't in the notes fed to it in the first place — a real risk, since migration-guide breaking-changes lists are routinely incomplete for edge-case APIs, and an agent that just makes the error go away will hide exactly the case you most needed to know about.",
    exampleOutput: `STAGE 1 — TRIAGE
Found 14 usages of react-router-dom across 9 files.
- 3 usages of useNavigate with a { replace: true } second argument — AFFECTED (API shape changed).
- 1 usage of <Switch> in src/App.tsx — AFFECTED (removed in v7, needs <Routes>).
- 10 usages of <Link>/<Route> with no changed props — NOT AFFECTED.

Awaiting confirmation before Stage 2.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-07-28' }],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Cursor 2.1 agent mode on a react-router-dom v6-to-v7 upgrade.',
      },
    ],
  },
  {
    slug: 'cursor-composer-self-diff-review',
    category: 'cursor',
    title: 'Make Composer audit its own multi-file diff before you look at it',
    description:
      "A post-edit review prompt that has Cursor's Composer re-check every file it just touched against the original brief, itemizing an UNREQUESTED label for anything it can't justify — before you spend your own review pass finding it.",
    promptText: `Re-read every change you just made across every file in this session against the original brief below. Don't trust your memory of what you intended to do — actually diff each file against its state before you started.

ORIGINAL BRIEF
{{original_brief}}

For every file you touched, answer:
1. What changed, in one line.
2. Which part of the brief this satisfies — quote it directly.
3. If you can't point to a part of the brief that required this change, mark it UNREQUESTED and explain why you made it anyway.

Then answer directly: did you touch any file not implied by the brief? Did you change formatting, imports, or unrelated lines in a file you were already editing for a legitimate reason? List those separately — they still count as scope creep even inside a file you had a real reason to open.

End with one verdict: SCOPE CLEAN, or SCOPE CREEP with the file list.`,
    variables: [
      {
        name: 'original_brief',
        description:
          'The exact original instruction given for this Composer session, pasted back in verbatim for comparison.',
        example:
          'Add pagination to the /api/orders endpoint using limit/offset query params, default limit 20, max limit 100. Do not change the response shape for existing fields.',
        required: true,
      },
    ],
    targetTools: ['Cursor 2.1'],
    tags: ['composer', 'self-review', 'diff-audit', 'scope-creep', 'agent-mode'],
    whyItWorks:
      "This converts the same self-check Cursor's own checkpoint/diff view already gives you visually into a forced, itemized comparison instead of a skim of a colored diff panel across a dozen files. Asking the model to cite a specific quoted piece of the brief for every changed file makes it much harder for an incidental reformat or an adjacent 'while I was in there' cleanup to hide inside a large multi-file Composer diff, because there's no clause in the brief to point to for 'also reformatted the imports in an unrelated file.' The UNREQUESTED label matters specifically because a model asked generically 'did you do anything you shouldn't have' will almost always say no — that's a leading question with an easy denial. Forcing it to attempt a citation for every single file first, and only fall back to UNREQUESTED when no citation exists, produces an actual audit trail instead of a reflexive assurance, and it catches the specific case — formatting or import changes inside a file you had a legitimate reason to open — that a simple 'list files you shouldn't have touched' question would miss entirely.",
    exampleOutput: `1. api/orders/route.ts — added limit/offset parsing with defaults 20/max 100. Satisfies: "using limit/offset query params, default limit 20, max limit 100."
2. api/orders/route.ts — also reformatted the existing error-handling block (indentation, added blank lines) while adding the pagination logic. UNREQUESTED — no part of the brief called for reformatting existing code; this happened while editing the same function.
3. lib/orders/types.ts — added a PaginationParams type. Satisfies: implied by "limit/offset query params" needing a typed shape, though not stated explicitly.

Files not implied by the brief: none.
Formatting/import changes in a file opened for a legitimate reason: yes, item 2 above.

Verdict: SCOPE CREEP — api/orders/route.ts (unrequested reformatting of the error-handling block).`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-08-04' }],
    changelog: [
      {
        date: '2026-08-04',
        note: "Initial publish, verified against Cursor 2.1 Composer's post-edit self-review behavior.",
      },
    ],
  },
  {
    slug: 'cursor-agent-performance-profiling-brief',
    category: 'cursor',
    title: "Get Cursor's agent to measure a slow path instead of guessing at a fix",
    description:
      "A measure-diagnose-fix brief that requires Cursor's agent to instrument and get real numbers on a slow code path before proposing any optimization, so a confident-sounding fix can't ship for a bottleneck that was never actually located.",
    promptText: `SYMPTOM
{{slow_symptom}}

Before proposing or making any change, locate the actual bottleneck. Do not optimize based on what looks slow by inspection alone.

SUSPECTED AREA — a starting point only, not a conclusion
{{suspected_area}}

MEASUREMENT METHOD
{{measurement_method}}

STAGE 1 — MEASURE
Add the minimal instrumentation needed to get real numbers for the suspected area and any adjacent code on the same request path. Report actual measured timings or allocation counts, not estimates.

STAGE 2 — DIAGNOSE
State which specific line or call is responsible for the majority of the time, backed by the Stage 1 numbers. If the suspected area was not actually the bottleneck, say so explicitly.

STAGE 3 — FIX
Only now propose the smallest change that addresses the measured bottleneck. State the expected improvement and how you'd re-measure to confirm it.

Remove any temporary instrumentation you added in Stage 1 before finishing, unless told to keep it.`,
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
    ],
    targetTools: ['Cursor 2.1'],
    tags: [
      'performance-profiling',
      'agent-mode',
      'benchmarking',
      'optimization',
      'measurement-first',
    ],
    whyItWorks:
      "Agentic coding models are fluent at describing plausible-sounding performance fixes — memoization, batching, adding an index — by pattern-matching on code shape alone, without ever confirming that the spot they're fixing is where the time actually goes. It's the same failure mode as proposing a bug fix without reproducing the bug: the fix can be well-written and completely irrelevant. Structuring the request as measure-diagnose-fix, with Stage 2 explicitly required to cite Stage 1's actual numbers rather than restate the hypothesis, blocks the shortcut straight to a fix and forces the model to either confirm or falsify its own SUSPECTED_AREA hypothesis against real data. Requiring instrumentation removal at the end closes a real and common agent-mode side effect — debug timers or logging left behind in the final diff because the agent's job description was 'make it fast,' and adding a console.time and never removing it technically doesn't conflict with that.",
    exampleOutput: `STAGE 1 — MEASURE
Instrumented getMonthlyTotals and the two other queries on this request path.
- getMonthlyTotals: 340ms avg (5 runs)
- getUserPreferences: 1,850ms avg (5 runs) — this is the actual majority contributor, not the suspected area
- getRecentActivity: 210ms avg

STAGE 2 — DIAGNOSE
The suspected area (getMonthlyTotals) is not the bottleneck — it's a minor contributor. getUserPreferences is doing a full table scan with no index on user_id, confirmed via the query plan.

STAGE 3 — FIX
Adding an index on user_preferences(user_id) is the smallest change addressing the measured bottleneck. Expected improvement: full scan to index lookup should bring that query under 50ms. Re-measure with the same instrumentation after the index is added and migration applied.

Instrumentation removed from all three functions.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-07-21' }],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Cursor 2.1 agent mode.',
      },
    ],
  },
  {
    slug: 'cursor-tab-completion-comment-style-brief',
    category: 'cursor',
    title: "Write comments that make Cursor's Tab complete the way you actually want",
    description:
      "A commenting-style brief — for the top of a file or a .cursorrules entry — that shapes forward-looking intent comments for Cursor's Tab predictive multi-line completion, so its suggestions match your next step more often instead of guessing from indentation alone.",
    promptText: `COMMENT STYLE FOR THIS FILE — {{file_purpose}}

Write comments as forward-looking intent statements immediately above the line they describe, not as after-the-fact descriptions of code already written. State what happens next before writing it — that's what a predictive completion reads to guess the following lines.

NAMING CONVENTIONS TO FOLLOW SO COMPLETIONS MATCH THEM
{{naming_conventions}}

EXAMPLES OF THE COMMENT STYLE TO MATCH
{{comment_style_examples}}

RULES
- One comment per logical step, not one per line.
- Name the next variable or function before it appears — e.g. "// validate email" immediately before assigning to isValidEmail — so a completion suggesting isValidEmail is reading stated intent, not guessing from indentation.
- Don't leave a bare TODO with no reason; a TODO with nothing after it gives a completion model nothing to extend correctly.
- Keep the file's existing terms consistent — don't introduce a synonym for a concept the file already names something else, since a completion model weights whichever term appeared most recently in the file.`,
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
    ],
    targetTools: ['Cursor 2.1'],
    tags: [
      'tab-completion',
      'code-comments',
      'predictive-completion',
      'code-style',
      'cursorrules',
    ],
    whyItWorks:
      "Tab's multi-line predictive completion is conditioned heavily on nearby text, comments included, so a comment stating forward intent ('next: validate email format') gives it a much stronger signal for the next few lines than a comment that only describes code already written, which is backward-looking and useless to a forward predictor — by the time that comment exists, there's nothing left to predict. Keeping naming and terminology consistent within a file matters for the same mechanical reason: Tab weights recently-seen tokens in the same file heavily when ranking multi-line continuations, so introducing a synonym for a concept the file already names something else (calling it emailValid in one spot and isValidEmail in another) makes the two compete instead of the second reinforcing the first, which measurably degrades how often the suggested continuation matches what you'd actually type. This is one of the rare cases where writing better comments for a human reader and writing more Tab-predictable code point in exactly the same direction rather than trading off.",
    exampleOutput: `// validate email format before checking domain allowlist
const isValidEmail = EMAIL_REGEX.test(email)

// check against the blocked-domain list only if the format already passed
const isAllowedDomain = isValidEmail && !BLOCKED_DOMAINS.includes(getDomain(email))
// ^ Tab suggested this exact line unprompted after the comment above, reusing
// isValidEmail and the isX naming convention rather than inventing emailOk.`,
    verifiedAgainst: [{ tool: 'Cursor', version: '2.1', date: '2026-06-12' }],
    changelog: [
      {
        date: '2026-06-12',
        note: 'Initial publish, verified against Cursor 2.1 Tab multi-line completion.',
      },
    ],
  },
]
