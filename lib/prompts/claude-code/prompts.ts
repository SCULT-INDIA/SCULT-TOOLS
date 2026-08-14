import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'claude-code-claude-md-authoring',
    category: 'claude-code',
    title: 'Write a CLAUDE.md file that still holds up after fifty sessions',
    description:
      'A structured CLAUDE.md authoring prompt that separates durable project facts from session-specific noise, so the file Claude Code auto-loads every session stays accurate instead of silently rotting into stale advice.',
    promptText:
      "Write this as CLAUDE.md at the repository root. Claude Code loads this file into context automatically at the start of every future session in this repo, so every line here must be true across many sessions, not only the one in which it is written. Anything only true today, such as this week's open bug or a decision still under debate, does not belong in this file.\n\nPROJECT\n{{project_name}} — {{project_purpose}}\n\nSTACK AND ENVIRONMENT\n{{tech_stack}}\n\nCOMMANDS, EXACT AND RUNNABLE\n- Install dependencies using the existing lockfile only. Never switch package managers or add a second one alongside it.\n- Run tests: {{test_command}}\n- Lint and typecheck must both be run and shown clean before any task is declared done. A change that looks correct is not the same as a change that is verified correct — run the commands and report the actual output, not an assumption about what it would show.\n- Add any other project-specific command, such as starting a local dev server or running a database migration, following this same exact-and-runnable rule rather than a paraphrase.\n\nARCHITECTURE NOTES A FRESH SESSION WOULD OTHERWISE HAVE TO RE-DISCOVER\n{{architecture_notes}}\n\nHARD RULES\n- Never commit directly to the default branch. Always work on a branch and open a pull request, even for a one-line change.\n- Never add a dependency, including a devDependency, without naming it and asking first.\n- Never delete, skip, or rewrite a test to make a suite pass. If a test looks wrong, say so and stop rather than editing it until it agrees with the code.\n- Never assume a missing file, config value, or environment variable is safe to invent a plausible default for — ask, or search the codebase for how it is set elsewhere first.\n- {{forbidden_patterns}}\n- If a task would touch more than five files or change a public interface, stop and describe a plan before writing any code — the same discipline Plan Mode enforces when toggled on manually, applied here by default instead.\n\nWHEN UNSURE\nAsk one specific, answerable question instead of guessing and proceeding on an assumption. State the assumption that would otherwise be made, so a one-word confirmation from a human is enough to unblock the task rather than a full explanation.\n\nDEFINITION OF DONE\n{{definition_of_done}}\n\nWHAT DOES NOT BELONG IN THIS FILE\nThe current sprint, an open bug still being triaged, or a technical decision still under active debate. Those belong in an issue tracker or a task-scoped PLAN.md, not here — a fact that stops being true and is never removed from CLAUDE.md is more dangerous than no fact at all, because every future session trusts it by default without re-verifying it.\n\nMAINTENANCE\nIf a session surfaces something that should have been written here from the start — a gotcha, a naming convention, a rule a human had to correct in the moment — say so explicitly in the final message of that session, naming the exact sentence to add and where, rather than letting the identical correction happen again in a future session that has no memory of this one.",
    variables: [
      {
        name: 'project_name',
        description: 'The name of the project or repo, used in the file header.',
        example: 'tools.scult.in',
        required: true,
      },
      {
        name: 'project_purpose',
        description: 'One or two sentences on what this repo is and what it does.',
        example:
          'A Next.js tools directory site serving free browser-based utilities plus an AI prompt library.',
        required: true,
      },
      {
        name: 'tech_stack',
        description: 'The languages, frameworks, and key libraries this project uses.',
        example:
          'Next.js 16 App Router, TypeScript strict mode, Biome for lint and format, Vitest for tests.',
        required: true,
      },
      {
        name: 'test_command',
        description: 'The exact shell command that runs the test suite.',
        example: 'npm run test',
        required: true,
      },
      {
        name: 'architecture_notes',
        description:
          'A specific, non-obvious structural fact a new session would otherwise waste time rediscovering.',
        example:
          'lib/tools/ and lib/prompts/ are deliberately parallel sibling registries with separate type unions — never merge them into one shared type, see docs/PLAN.md.',
        required: true,
      },
      {
        name: 'forbidden_patterns',
        description:
          'Project-specific anti-patterns worth naming, beyond the generic rules above.',
        example:
          'Never introduce a new npm dependency under 500 weekly downloads without flagging it first; never use any in TypeScript without a justifying comment.',
        required: false,
      },
      {
        name: 'definition_of_done',
        description: 'What must be true for any task in this repo to count as complete.',
        example:
          'Tests pass locally with the exact command above, lint and typecheck are clean, no unrelated file changed, and the change is explained in plain language in the final message, not just left as a diff.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'claude-md',
      'project-memory',
      'context-engineering',
      'onboarding',
      'rules-file',
    ],
    whyItWorks:
      "CLAUDE.md is not a suggestion Claude Code might read — it is loaded into context automatically at the start of every session in that repository, which is exactly why the maintenance section matters more than it would in a one-off prompt: a fact written here is trusted by every future session without re-verification, so a stale claim about, say, which package manager is standard does not just mislead one conversation, it silently misleads every session for as long as it stays uncorrected. Separating durable architecture notes and hard rules from a dedicated 'what does not belong here' section targets the actual way these files decay in practice — a rules file is edited most often mid-task, under time pressure, by someone adding the fact they need right now, and without an explicit boundary that ephemeral state does not belong, a CLAUDE.md accumulates exactly the kind of decision-still-under-debate or bug-being-triaged entries that go stale within a sprint and then get trusted as ground truth for months. The instruction to ask one specific, answerable question and state the assumption that would otherwise be made is calibrated to how a terminal-based coding session actually proceeds turn by turn: a vague clarifying question forces a human to context-switch back into a full explanation, while a stated assumption needs only a one-word confirmation to unblock the agent, which is the difference between a five-second reply and a five-minute one across the life of a project with many sessions. Naming a concrete threshold — more than five files, or a changed public interface — as the trigger for stopping to plan gives the same discipline Plan Mode's read-only toggle provides, but makes it the file's own default rather than something a human has to remember to switch on for every session; a number is also checkable in a way 'significant changes' is not, so there is no ambiguity about whether a four-file change needed a plan first or not.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-21' }],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Claude Code running Sonnet 4.6.',
      },
    ],
  },
  {
    slug: 'claude-code-custom-slash-command',
    category: 'claude-code',
    title: 'Author a custom slash command Claude Code will run the same way every time',
    description:
      'A prompt that generates a well-formed .claude/commands/*.md custom slash command — frontmatter, argument handling, and an explicit output contract — so a repeated workflow becomes one typed command instead of a differently-worded prompt each time.',
    promptText:
      'Write a custom slash command for Claude Code as a single markdown file, ready to save at {{command_path}}. The filename determines the command name Claude Code exposes, so name the file to match exactly how the command should be invoked, and if it belongs under a namespaced subdirectory rather than the flat commands folder, say so and explain why grouping it improves discovery.\n\nWORKFLOW TO TURN INTO A COMMAND\n{{workflow_description}}\n\nARGUMENTS THIS COMMAND ACCEPTS\n{{argument_shape}}\n\nSTRUCTURE THE FILE AS\n1. YAML frontmatter with: a description field stating what the command does and when to reach for it, an argument-hint field showing the expected shape of the passed-in text in the exact form a user would type it, and an allowed-tools field naming only the tools this workflow actually needs — do not grant Bash or Write access to a command that only reads and reports.\n2. Below the frontmatter, the command body written as a direct instruction to Claude Code, substituting the passed-in argument wherever it belongs, and using positional references if the workflow genuinely needs more than one distinct value rather than one free-text blob.\n3. An explicit output contract at the end of the body: the exact section headers or format the command must produce every time it runs, so invoking it twice on different input produces comparably-shaped output, not two differently organized answers.\n\nCONSTRAINTS\n- The command must do one workflow well, not several loosely related ones behind one name. If the workflow described above is actually two distinct jobs, say so and propose two separate command files instead of forcing one.\n- If the workflow needs project-specific context that will not exist in every repo this command might later be copied into, such as a specific test command or file path, make that a documented argument or a clearly marked placeholder, not a hardcoded assumption.\n- Do not have the command silently take an action with side effects, such as committing, pushing, or deleting, unless {{allow_side_effects}} explicitly says it should — and even then, end the body with an instruction to state what it is about to do before doing it.\n- If the workflow would benefit from a model cheaper or faster than the main conversation is using, such as a purely mechanical formatting pass, note that as an optional model field in the frontmatter rather than leaving every invocation on the default model by default.\n\nOUTPUT\nThe complete markdown file content, frontmatter included, ready to paste as-is. After the file, one sentence on which command already listed in {{existing_commands_dir}}, if any, this new one might overlap or conflict with by name or by purpose.',
    variables: [
      {
        name: 'command_path',
        description:
          'Where the command file should be saved, which also fixes the command name.',
        example: '.claude/commands/review-pr.md',
        required: true,
      },
      {
        name: 'workflow_description',
        description:
          'The repeated task this command should replace, described precisely.',
        example:
          "Whenever a pull request is ready for review, fetch the diff against main, run the project's lint and test commands, and produce a structured review of correctness, tests, and scope — currently done by retyping a long prompt each time.",
        required: true,
      },
      {
        name: 'argument_shape',
        description: 'What, if anything, gets passed to the command when it is invoked.',
        example:
          'An optional PR number or branch name; if omitted, review the current branch against main.',
        required: true,
      },
      {
        name: 'allow_side_effects',
        description:
          'Whether this command is allowed to take a mutating action, or must stay read-only.',
        example: 'No — this command only reads and reports, it never commits or pushes.',
        required: true,
      },
      {
        name: 'existing_commands_dir',
        description:
          'What already exists in the commands directory, so overlap can be flagged.',
        example: '.claude/commands/ currently has commit.md and changelog.md.',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'slash-commands',
      'workflow-automation',
      'custom-commands',
      'cli-tooling',
      'reusable-prompts',
    ],
    whyItWorks:
      "A Claude Code slash command is not just a saved prompt — it is a file Claude Code discovers by name in .claude/commands/, and the filename is the actual invocation string, so getting review-pr.md right is what makes /review-pr exist at all; a template that does not treat the filename as load-bearing produces a file nobody can actually invoke as intended. The allowed-tools frontmatter field is a real permission boundary enforced by Claude Code itself, not a description of intended behavior — scoping a read-only review command to Read, Grep, and a narrow Bash pattern rather than the full tool set means the command cannot commit, push, or delete even if its own body were somehow read in a way that suggested it should, which is a materially stronger guarantee than a prompt that simply asks nicely not to make changes. This is why the constraint about side effects requiring an explicit allow flag matters: a command is invoked by a short slash instruction with no surrounding conversation to reconsider intent, so a command capable of a destructive action needs the safety built into its own tool grant, not just into wording a future user might skim past. The explicit output contract at the end of the body solves the actual failure mode of ad hoc reusable prompts: because a slash command is invoked fresh with new arguments substituted in each time, the same wording run on Monday and again on Friday can drift into differently structured answers if nothing pins the shape down, which quietly defeats the reason to have made it a command instead of retyping a slightly different version of the same request each time. Requiring the workflow to be one job, not several loosely related ones stacked behind a single name, matters because a command's whole value is that invoking it is unambiguous about what will happen — a command that sometimes reviews and sometimes also drafts a changelog entry, depending on how it is phrased, has reintroduced the exact ambiguity a dedicated command was supposed to remove.",
    exampleOutput:
      "---\ndescription: Review the current branch's diff against main for correctness, tests, and scope before opening a PR\nargument-hint: [optional PR number or branch name]\nallowed-tools: Read, Grep, Bash(git diff:*), Bash(git log:*)\n---\n\nReview the diff between the given argument (or the current branch if none) and main.\n\nProduce exactly: Correctness / Tests / Scope / Verdict sections, matching the site's code-review rubric.\n\nOverlap note: no conflict with commit.md or changelog.md — neither one reviews a diff.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Claude Code custom slash commands (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-subagent-definition',
    category: 'claude-code',
    title:
      'Define a specialized Claude Code subagent instead of overloading the main thread',
    description:
      'A prompt that produces a complete .claude/agents/*.md subagent definition — scoped tools, a narrow system prompt, and a model choice — for a repeated task that deserves its own isolated context rather than living in the main conversation.',
    promptText:
      "Define a Claude Code subagent as a single markdown file for {{agents_dir}}, to be invoked either automatically when its description matches the moment, or explicitly by name.\n\nJOB THIS SUBAGENT DOES, AND ONLY THIS JOB\n{{subagent_job}}\n\nWHEN IT SHOULD BE INVOKED\n{{invocation_trigger}}\n\nWHY IT NEEDS ITS OWN CONTEXT RATHER THAN RUNNING IN THE MAIN THREAD\n{{isolation_reason}}\n\nSTRUCTURE THE FILE AS\n1. YAML frontmatter: name (short, kebab-case, matching the filename), description (written as a clear trigger condition the main agent could match against, not a vague summary — state the situation that should cause delegation to this subagent), tools (an explicit, narrow list; grant only what this specific job needs, never the full default set out of convenience), and model, set to {{model_choice}} if the job is simple and high-volume enough to justify a cheaper or faster model than the main conversation is using.\n2. A system-prompt body written in second person, addressed to the subagent itself, stating its one job, its boundaries, and explicitly what it must hand back to the main conversation rather than silently deciding on its own.\n3. An output contract: the exact shape the subagent must return to the calling conversation, since the subagent's own reasoning and any tool output it generated does not automatically appear in the main thread — only what it explicitly returns does.\n\nCONSTRAINTS\n- Do not give this subagent authority the described job does not need. A subagent that only reads code and reports findings should not have Write or Bash access, even if that access would make some future job easier — scope it to today's job, not a hypothetical future one.\n- Make the description field specific enough that the main agent would not mistakenly delegate an unrelated task to this subagent, and would not fail to delegate a task that actually belongs to it. Ambiguous descriptions cause both failure modes at once.\n- State explicitly, inside the subagent's own body, that it should not consume its own context speculatively exploring the repo beyond what the job requires — an isolated subagent with unbounded scope defeats the reason for scoping it narrowly in the first place.\n- If this subagent's job overlaps at all with an existing subagent already defined in {{agents_dir}}, name the overlap and propose either merging the two responsibilities or drawing a sharper boundary between them, rather than leaving two subagents with descriptions vague enough to both plausibly match the same situation.\n\nOUTPUT\nThe complete file content, frontmatter and body, ready to save as-is. After it, one sentence on what the main conversation must still do that this subagent explicitly will not — the actual boundary of delegation.",
    variables: [
      {
        name: 'agents_dir',
        description: 'Where the subagent file should live.',
        example: '.claude/agents/',
        required: true,
      },
      {
        name: 'subagent_job',
        description: 'The one job this subagent does, stated narrowly.',
        example:
          'Run the full test suite after any code change, parse failures, and report which specific test names failed and why, without attempting to fix anything.',
        required: true,
      },
      {
        name: 'invocation_trigger',
        description: 'The condition under which this subagent should be used.',
        example:
          'Automatically whenever the main conversation has just finished editing code and is about to claim a task is complete; also invokable explicitly by name.',
        required: true,
      },
      {
        name: 'isolation_reason',
        description: 'Why this specific job should not run in the main context.',
        example:
          'Test output for a large suite can run to thousands of lines; parsing that in the main conversation would consume context the actual coding task still needs, so it should happen in a disposable subagent context instead.',
        required: true,
      },
      {
        name: 'model_choice',
        description:
          'Which model tier this subagent should run on, if different from the main conversation.',
        example:
          'a faster, cheaper model than the main conversation, since parsing test output is high-volume and low reasoning difficulty',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'subagents',
      'agent-architecture',
      'context-isolation',
      'tool-permissions',
      'delegation',
    ],
    whyItWorks:
      "A Claude Code subagent executes in its own separate context window, and the mechanism that matters here is narrower than it sounds: only what the subagent explicitly returns crosses back into the main conversation, so a thousand-line test-failure log or a sprawling grep across a large repo can be absorbed and distilled inside the subagent's disposable context without ever touching the main thread's budget, which is the actual reason to isolate a noisy task rather than just a way to organize files. The tools field in the frontmatter is an enforced permission boundary at the subagent level, the same mechanism that scopes a slash command — a subagent whose job is reading test output and reporting failures can be denied Write and Bash entirely, so it is structurally incapable of attempting a fix even if its own reasoning drifted toward doing so, which is a stronger guarantee than an instruction not to fix anything embedded only in prose. The description field is not documentation, it is the literal input Claude's main agent matches against when deciding whether to delegate a given moment to this subagent automatically, so a vague description produces two distinct failure modes rather than one: it can cause the main agent to delegate something unrelated because the description was broad enough to plausibly match, or it can cause the main agent to handle a task itself that should have gone to the subagent because the description never clearly claimed that territory — specificity here has a direct behavioral effect on delegation, not just a documentation-quality effect. Setting model to a smaller or faster option than the main conversation is using is a real lever, not a cosmetic setting, because high-volume, low-reasoning-difficulty work such as parsing structured test output does not benefit from the main conversation's more expensive model, and running it on a cheaper one changes the actual latency and cost of a workflow that might run after every single code change. The constraint against speculative exploration inside the subagent exists because an isolated context with unbounded scope reintroduces the exact context-consumption problem isolation was meant to solve, just moved one level down.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-23' }],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Claude Code subagents (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-pretooluse-hook-guardrail',
    category: 'claude-code',
    title:
      'Write a PreToolUse hook that blocks a dangerous command before Claude Code runs it',
    description:
      'A prompt that generates a Claude Code PreToolUse hook — matcher pattern, hook script contract, and exit-code semantics — that mechanically blocks a specific risky action instead of relying on a CLAUDE.md rule the agent could still reason its way past.',
    promptText:
      "Write a Claude Code PreToolUse hook that mechanically blocks {{dangerous_action}} before it executes, rather than relying on a CLAUDE.md instruction the agent could still talk itself past under pressure to finish a task.\n\nWHAT MUST NEVER RUN\n{{blocked_pattern}}\n\nWHAT SHOULD STILL BE ALLOWED\n{{allowed_exceptions}}\n\nPRODUCE\n1. The settings.json fragment: a hooks entry under PreToolUse with a matcher narrow enough to catch {{tool_matcher}} without also catching unrelated tool calls that happen to share a substring — a matcher that is too broad blocks legitimate work, and one that is too narrow lets a slightly different phrasing of the same dangerous command through.\n2. The hook script itself, as a small shell or Python script, that reads the JSON payload from stdin, inspects the tool name and the actual tool input for the dangerous pattern rather than trusting the matcher alone to have caught it precisely, and exits with the code that blocks the call, writing a short, specific reason to stderr — the reason a human, or the agent reading it back, would actually need to understand why this was stopped and what to do instead.\n3. A note on exit-code semantics used: which exit code blocks the call and surfaces stderr back to Claude as the reason, versus a nonzero code that only surfaces an error to the human without blocking, and confirm the script uses the blocking one deliberately, not by accident.\n\nCONSTRAINTS\n- The check inside the script must be based on the actual command content in the tool input, not just the tool name — a hook that blocks every Bash call because one specific command is dangerous is a blunt instrument that will also block every safe git status and ls the agent needs to run.\n- Fail closed, not open: if the hook script itself errors, or the payload is malformed in a way that makes the check inconclusive, the default should be to block and say why, not to silently allow the action through.\n- Do not make the block message vague. A bare 'this command is not allowed' gives the agent nothing to work with; state the specific pattern matched and, if {{safe_alternative}} exists, name it directly so the agent can retry correctly instead of guessing at a workaround.\n- Test the hook against both a case that should be blocked and a case that looks similar but should be allowed, and show both example payloads and the script's actual exit code for each.\n\nOUTPUT\nThe settings.json fragment, the hook script in full, and the two test cases with their outcomes.",
    variables: [
      {
        name: 'dangerous_action',
        description: 'The class of action this hook exists to stop.',
        example: 'a force-push to any protected branch',
        required: true,
      },
      {
        name: 'blocked_pattern',
        description: 'The exact command shape that must never be allowed to execute.',
        example:
          'git push --force or git push -f targeting main, master, or any release/* branch, from any working directory in this repo.',
        required: true,
      },
      {
        name: 'allowed_exceptions',
        description: 'What must still work normally, so the hook does not over-block.',
        example:
          'A force-push to a personal feature branch under feature/ must still work normally.',
        required: true,
      },
      {
        name: 'tool_matcher',
        description: 'What the hooks matcher pattern needs to catch.',
        example:
          'Bash tool calls whose command string contains push and either --force or -f',
        required: true,
      },
      {
        name: 'safe_alternative',
        description:
          'A safe command to suggest instead of the blocked one, if one exists.',
        example:
          'git push --force-with-lease, which the team already permits on feature branches',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['hooks', 'pretooluse', 'guardrails', 'automation-safety', 'settings-json'],
    whyItWorks:
      "A CLAUDE.md rule against force-pushing to main is an instruction the model reads and, in the overwhelming majority of turns, follows — but it is still text competing with the model's own judgment in that turn, and an agent under pressure to unblock a task it believes is otherwise finished can talk itself into an exception a strict rule was meant to prevent. A PreToolUse hook is a different category of control entirely: it is enforced by Claude Code's runtime before the tool call is allowed to execute, so the question of whether the model currently believes the exception is justified never gets a vote — the call either executes or it does not, based on the hook script's own exit code, independent of any reasoning that happened in the conversation. This is exactly why the exit-code semantics deserve their own explicit section rather than being left implicit: a hook that exits with the wrong code for what it intends produces a guardrail that looks correct in a code review of the script but does nothing in practice, silently downgrading from blocking to a message the human sees while the dangerous action still runs. Failing closed on the hook's own internal error is the same principle applied one level up — a guardrail whose failure mode is to allow the action through by default is not a safety net, it is a safety net with a hole exactly the size of 'when the check itself breaks,' and that is precisely when a genuinely risky action is most likely to be attempted, since it usually means something about the environment or input was already unusual. The instruction to name the specific matched pattern and a safe alternative in the block message is not just good UX — stderr from a blocking PreToolUse hook is fed back into Claude's own context as the reason the call failed, so a specific, actionable message lets the agent immediately retry with the safe alternative in the same turn, while a vague message forces either a human to step in or the agent to guess at a workaround, which is a worse outcome than the hook not existing if the guess is another unsafe attempt.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-24' }],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Claude Code hooks (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-settings-permissions-allowlist',
    category: 'claude-code',
    title:
      'Configure a Claude Code permissions allowlist that matches how the team actually works',
    description:
      'A prompt that audits a described workflow and produces a settings.json permissions block — allow, ask, and deny lists — scoped to exactly the tool patterns that workflow needs, instead of a blanket approval that trades away the point of having a permission system.',
    promptText:
      "Produce a Claude Code settings.json permissions block for this team's actual workflow, scoped as narrowly as the workflow allows rather than defaulting to broad approval out of convenience.\n\nHOW THIS TEAM ACTUALLY WORKS\n{{workflow_description}}\n\nACTIONS THAT SHOULD NEVER REQUIRE A PROMPT (safe, repetitive, no side effect outside version control already reviewed by a human before merge)\n{{frequent_safe_actions}}\n\nACTIONS THAT SHOULD ALWAYS ASK, EVEN IF THAT MEANS INTERRUPTING A LONG AGENTIC RUN\n{{always_confirm_actions}}\n\nACTIONS THAT SHOULD NEVER BE ALLOWED FROM THIS TOOL AT ALL\n{{never_allowed_actions}}\n\nPRODUCE\n1. An allow list of exact tool patterns, not broad categories — a scoped pattern like Bash(npm run test:*) rather than a bare Bash entry that would silently also approve every other shell command the agent might ever construct.\n2. An ask list for the always-confirm actions, using patterns specific enough that a close-but-different command is not accidentally caught by the same rule and skipped past confirmation.\n3. A deny list for the never-allowed actions, and confirm each entry there could not be satisfied by some other tool or a slightly different phrasing of the same command that the deny pattern does not cover — a deny list with a gap is not a safety measure, it is the appearance of one.\n4. For every pattern proposed, one line stating what a slightly broader version of that same pattern would additionally permit, so the actual scope of each rule is visible rather than assumed from its name alone.\n\nCONSTRAINTS\n- Do not propose a wildcard pattern anywhere it can be avoided. If a genuinely wide allowance is unavoidable for the workflow to function at all, say so explicitly and name the specific risk being accepted, rather than adding the wildcard silently.\n- Cross-check the three lists against each other: flag any pattern that could match under both allow and ask, or under both ask and deny, since an overlapping rule's actual behavior depends on evaluation order the person reading this file will not necessarily know to check.\n- If {{ci_or_local}} indicates this configuration runs unattended, such as in CI, treat every ask entry as if it will silently block the run rather than pause it, since there is no human present to answer, and flag which entries that would affect.\n- Where a pattern could plausibly be satisfied by more than one tool, such as a file deletion reachable through both Bash and a dedicated file-editing tool, cover every route to the same outcome rather than closing only the one that happens to come to mind first.\n\nOUTPUT\nThe complete permissions JSON block, followed by the scope-visibility notes and any overlap or wildcard warnings.",
    variables: [
      {
        name: 'workflow_description',
        description: 'How the team actually uses Claude Code day to day.',
        example:
          'A small team using Claude Code for day-to-day feature work on a Next.js app; changes go through a human-reviewed pull request before merging to main, so read, edit, and test cycles are frequent but nothing reaches production without a human looking at the diff first.',
        required: true,
      },
      {
        name: 'frequent_safe_actions',
        description: 'Actions that happen constantly and carry no real risk.',
        example:
          'Running the existing test and lint commands, reading and editing files inside the repo, running git status, git diff, and git log.',
        required: true,
      },
      {
        name: 'always_confirm_actions',
        description:
          'Actions that need a human in the loop every time, even at the cost of friction.',
        example:
          'Any git commit, git push, or npm install of a new dependency, even on a feature branch.',
        required: true,
      },
      {
        name: 'never_allowed_actions',
        description: 'Actions that must be structurally impossible from this tool.',
        example:
          'Any git push --force to main, any rm -rf, any command that reaches a production database connection string, any npm publish.',
        required: true,
      },
      {
        name: 'ci_or_local',
        description:
          'Whether this configuration runs on a developer machine or in an unattended pipeline.',
        example:
          'Local developer machines only, not CI — a human is always present to answer an ask prompt.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['settings-json', 'permissions', 'security', 'tool-scoping', 'agentic-safety'],
    whyItWorks:
      "A permission pattern in Claude Code's settings.json is matched literally against the tool call the agent is actually attempting, which is why the difference between an allow entry of Bash and one of Bash(npm run test:*) is not a style preference — the first approves every shell command the agent will ever construct for as long as that setting stands, including ones nobody anticipated when the rule was written, while the second approves exactly one family of invocations and nothing else. This distinction matters more for an agentic coding tool than for almost any other kind of software permission, because the actions being gated are not a fixed menu a user clicks through — they are commands an agent constructs on the fly from its own reasoning about how to accomplish a task, so a broad allow rule is implicitly pre-approving commands that do not exist yet at the time the rule is written. The ask category has a behavior that only becomes visible in an unattended context: on a developer's own machine, ask pauses for a human to answer, but in CI or any run with nobody present to respond, an ask entry functions as a silent block rather than a pause, which is precisely why the workflow-context variable in this prompt forces that distinction to be checked explicitly rather than assumed — a permission set that works exactly as intended on a laptop can silently stall or fail an unattended pipeline run for a completely different reason than the one anyone expects. Cross-checking for overlap between the three lists exists because pattern matching does not raise an error when two rules could both match the same call — the actual behavior in that case depends on an evaluation order most people configuring this file have never had reason to look up, so an overlap is not a redundancy, it is an ambiguity that behaves consistently once, in testing, and then differently the one time it actually matters. Ultimately, the deeper reason any of this deserves this much precision is that a CLAUDE.md rule and a hook can both, in principle, be reasoned about or worked around inside a given turn, while a deny-listed permission pattern is not a suggestion the agent is weighing — it is the actual enforcement boundary of what the tool is capable of attempting at all, regardless of what the model currently believes is justified.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' }],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code settings.json permissions (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-plan-mode-multi-file-feature',
    category: 'claude-code',
    title: 'Force a written plan before Claude Code touches a multi-file feature',
    description:
      'A plan-first prompt that blocks Claude Code from creating, editing, or deleting any file until it has produced and gotten approval on a full change plan, mirroring the discipline of Plan Mode itself but making it a standing requirement rather than a manual toggle.',
    promptText:
      "Before touching any file, produce a complete plan for this feature and wait for explicit approval. Do not create, edit, or delete a file, and do not run any command that changes repository state, until the plan below has been written in full and approved — reading files and searching the codebase during planning is expected and encouraged.\n\nFEATURE\n{{feature_request}}\n\nDEFINITION OF DONE\n{{definition_of_done}}\n\nEXISTING PATTERNS TO REUSE, NOT REINVENT\n{{existing_patterns}}\n\nROLLBACK EXPECTATIONS\n{{rollback_expectations}}\n\nWRITE THE PLAN IN THIS EXACT STRUCTURE\n1. Restated understanding — the feature in two or three sentences, including any ambiguity in the request being resolved a specific way, and how, so a disagreement surfaces now rather than after the code is written.\n2. Files touched — every file expected to be created or modified, grouped as new versus existing, each with a one-line reason it needs to change.\n3. Build sequence — the order changes will be made in, and why that order; name any two steps that could happen in parallel versus any step that genuinely depends on a prior one finishing first.\n4. Interfaces and contracts — every function signature, exported type, API shape, or database column this feature adds or changes, written out in full before any implementation, since this is the actual coordination surface between files that a plan is supposed to catch problems in before they exist as bugs.\n5. Risk points — the two or three places most likely to break something outside this feature's obvious scope, and specifically what will be checked, and how, to confirm they did not.\n6. Explicitly out of scope — anything a reasonable person might expect this feature to include that this plan is deliberately not doing, stated so it cannot be silently assumed later to have been forgotten rather than excluded on purpose.\n\nEnd the plan with the exact sentence: 'Waiting for approval before making any changes.' Do not proceed past that line under any circumstance, including a case where the plan seems obviously correct and re-confirming it feels redundant — the point of the stop is that 'obviously correct' is exactly the judgment a plan review exists to check, not to skip.\n\nIF THE PLAN CHANGES MID-IMPLEMENTATION\nIf, while implementing an approved plan, a genuine reason emerges to deviate from what was approved — a file needs a change that was not listed, or an interface needs a different shape than planned — stop, state exactly what changed and why, and wait for approval on the delta before continuing, rather than quietly implementing the deviation and mentioning it only in a final summary.",
    variables: [
      {
        name: 'feature_request',
        description: 'The feature to plan, described the way it was actually requested.',
        example:
          'Add a saved-searches feature: users can save their current filter combination on the /reports page under a name and reload it later from a dropdown, with saved searches persisting across sessions.',
        required: true,
      },
      {
        name: 'definition_of_done',
        description: 'What must be true for this feature to count as complete.',
        example:
          'A saved search survives a full page reload and a new login session, appears in the dropdown ordered by most recently used, and reloading one restores every filter exactly as it was saved.',
        required: true,
      },
      {
        name: 'existing_patterns',
        description:
          'Existing types, tables, or conventions the plan must reuse instead of inventing a parallel one.',
        example:
          'Reuse the existing FilterState type in lib/reports/filters.ts rather than inventing a parallel shape; store saved searches in the existing user_preferences JSON column rather than adding a new table, unless it genuinely cannot hold the data.',
        required: true,
      },
      {
        name: 'rollback_expectations',
        description: 'How this should be revertible if it ships and needs to be undone.',
        example:
          'This should be revertible with a single commit revert; no data migration should be required to undo it, since the column already exists.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor'],
    tags: [
      'plan-mode',
      'multi-file-feature',
      'planning',
      'scope-control',
      'agentic-coding',
    ],
    whyItWorks:
      'Claude Code has a real, built-in analog to this discipline: Plan Mode, toggled with Shift+Tab twice, puts the agent into a state where Read, Grep, and Glob still work but Edit, Write, and most Bash calls are mechanically blocked until a proposed plan is explicitly approved. This prompt reproduces that same blocking discipline as a standing written instruction rather than a manual per-session toggle, which matters for two practical reasons: the toggle is easy to forget to hit before starting a multi-file feature, and the same discipline is valuable in contexts where no dedicated read-only mode exists at all, such as inside a subagent or a different agentic tool entirely. The interfaces-and-contracts section of the plan is doing more work than it looks like — it is the actual coordination surface between files in a multi-file change, and this is exactly where unplanned agentic work goes wrong: an agent that starts with whichever file feels most obvious can invent a function signature or a data shape on the fly, build a second file against that invented shape, and only discover on a third file that the shape needs to be different, at which point two files already need to be redone rather than one plan needing a five-minute correction. The mid-implementation deviation clause exists because an approved plan is not a contract that survives contact with reality unchanged — real multi-file work regularly surfaces a genuine, good-faith reason to deviate partway through, and the actual discipline being enforced here is not that deviation never happens, it is that a deviation gets surfaced and re-approved in the moment it is discovered rather than silently implemented and mentioned only in a wrap-up summary a reviewer may skim past. Requiring the restated understanding to name and resolve any ambiguity in the original request up front catches a misread requirement while it is still a two-sentence disagreement worth a ten-second correction, rather than after it has become a finished diff across several files that someone now has to unwind and redo, which is a categorically more expensive place to discover the same misunderstanding.',
    exampleOutput:
      '1. Understanding: add a per-user saved-search feature on /reports; resolving the unstated question of scope as per-user only, since user_preferences is already scoped that way.\n2. Files touched: lib/reports/filters.ts (add SavedSearch type), lib/api/user-preferences.ts (add read and write helpers), components/reports/FilterBar.tsx (add save button and dropdown) — no new files.\n3. Sequence: type first, then helpers, then UI, since each depends on the one before it.\n4. Interfaces: SavedSearch = name, filters, savedAt; saveSearch(userId, search) and listSavedSearches(userId).\n5. Risk: user_preferences is unbounded JSON today — confirming there is a size cap before appending indefinitely.\n6. Not doing: no team sharing, no editing a saved search after creation.\n\nWaiting for approval before making any changes.',
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-27' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-27' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Claude Code Plan Mode (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
  },
  {
    slug: 'claude-code-security-review-taxonomy',
    category: 'claude-code',
    title: "Run Claude Code's structured security review discipline before every merge",
    description:
      "A closed-taxonomy security review prompt that separates flagging a finding from fixing it, mirroring the mechanics of Claude Code's built-in security review command, so a vulnerability finding produces a human decision rather than a silent autonomous patch.",
    promptText:
      "You are performing a security review, mirroring the discipline behind Claude Code's own security-review command — find what an attacker would actually try, not confirm that the intended feature works as described. Flag findings. Do not silently fix anything in this pass, even a one-line fix that feels obviously safe to make.\n\nSCOPE\n{{scope}}\n\nTHREAT CONTEXT\n{{threat_context}}\n\nSENSITIVE DATA IN SCOPE\n{{known_sensitive_data}}\n\nDEPLOYMENT CONTEXT\n{{deployment_context}}\n\nREVIEW CATEGORIES — GO THROUGH EVERY ONE, DO NOT SKIP SILENTLY\n1. Injection — SQL, NoSQL, command, template, or log injection anywhere user-controlled input reaches a query, a shell call, a template renderer, or a log line that is later parsed.\n2. Authentication and authorization — missing auth checks, broken object-level authorization such as one user accessing another user's resource by changing an identifier in a request, or any privilege-escalation path.\n3. Secrets and sensitive data — API keys, tokens, credentials, or personal data hardcoded, logged, committed in a fixture, or returned in an API response that does not need to include it.\n4. Input validation and deserialization — unbounded input size, unvalidated file uploads, unsafe deserialization of anything user-controlled.\n5. Server-side request forgery and outbound calls — does any user-controlled input influence a URL, hostname, or file path fetched or opened server-side?\n6. Dependency and supply-chain risk — any new or changed dependency with a known-bad reputation, an unpinned version, or a maintainer change worth a second look.\n7. Output handling — unescaped output enabling cross-site scripting, unsafe raw HTML rendering, or an unvalidated redirect target.\n\nOUTPUT FORMAT\nFor each category: either CLEAR, or FINDING with a severity of Low, Medium, High, or Critical, the exact file and line, a concrete exploit scenario stating the specific input or request that triggers it rather than a vague 'this could be unsafe', and a suggested fix presented as a recommendation for a human to apply, not applied automatically in this pass.\n\nCONSTRAINTS\n- Do not report a theoretical concern as a finding unless a concrete triggering input can be stated. A pattern that merely looks unusual is not automatically a vulnerability.\n- Do not downgrade a real finding into a soft best-practice suggestion to make the review read cleaner. Severity reflects actual exploitability, not how the finding will be received.\n- If nothing in a category applies, say CLEAR explicitly rather than omitting the category from the output — an omitted category and a checked-clear category look identical to a reader unless the omission is visible.\n- Rank findings by severity in a final summary, and state which single finding, if only one could be fixed before merge, would matter most and why.\n\nThis is a review, not a remediation pass — do not modify any code. Paste the diff or files to review below this line.",
    variables: [
      {
        name: 'scope',
        description: 'What to review — a route, a module, or a pull request.',
        example:
          'The new /api/users/[id]/export route and the auth middleware wrapping it, added in this pull request.',
        required: true,
      },
      {
        name: 'threat_context',
        description:
          'Why this specific area carries elevated risk, so severity is judged against real stakes.',
        example:
          'This endpoint returns a full data export, so an authorization bypass here is a data-breach-severity issue, not just an inconvenience.',
        required: true,
      },
      {
        name: 'known_sensitive_data',
        description: 'The specific sensitive fields this code touches.',
        example:
          'The export includes email, billing address, and the last four digits of a stored card.',
        required: true,
      },
      {
        name: 'deployment_context',
        description:
          'How and where this code runs, since some findings only matter under specific deployment conditions.',
        example:
          'Ships directly to production behind the standard auth middleware, with no additional WAF rule in front of it.',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'security-review',
      'vulnerability-taxonomy',
      'pre-merge-review',
      'checklist',
      'authorization',
    ],
    whyItWorks:
      "A generic 'is this secure' prompt reliably produces a generic 'nothing obviously wrong' answer, because without named categories the model has no forcing function to check for any specific class of vulnerability it did not happen to notice first. Closed, named categories such as injection, authorization, secrets, and server-side request forgery mirror how Claude Code's own built-in security review scans systematically rather than impressionistically, and requiring an explicit CLEAR per category rather than allowing silence makes an accidentally skipped category visible instead of invisible — a reviewer reading the output can tell the difference between 'checked, found nothing' and 'never actually checked', which a freeform review cannot offer. Requiring a concrete exploit scenario per finding, rather than a hedge like 'this could potentially be unsafe', filters out the low-value speculative findings that make AI security review output hard to trust and act on, since a finding with no stateable triggering input is not yet a finding, it is a hunch dressed as one. Weighting severity against the sensitive-data and deployment-context variables rather than judging exploitability in the abstract matters because the same authorization gap is a Low finding on a page that reveals nothing and a Critical one on a page that reveals a stored card fragment, and a review that never asks what is actually being protected will rate both the same way by default. The explicit instruction to flag rather than fix is a control on the agent's own autonomy specifically because Claude Code has real Edit and Bash access in the same session: an agentic coding assistant that both finds and silently patches a security issue removes a human decision point — what to fix, how, and when to ship it — from a class of change that should not be unilateral even when the assistant is correct about the underlying vulnerability, because the fix itself can carry its own risk, such as an overly broad input filter that breaks a legitimate use case nobody asked the model to weigh.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-28' }],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Claude Code security review (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-code-review-rubric',
    category: 'claude-code',
    title: 'Turn Claude Code into a consistent code reviewer instead of a vibes check',
    description:
      'A fixed six-category code review rubric with a forced pass, concern, or blocking rating per category and a single final verdict, so every pull request gets the same systematic pass instead of whatever the model happens to notice first.',
    promptText:
      "You are reviewing this change as the senior engineer whose name goes on the approval, not as a friendly first reader. Cite exact file names and line numbers for every claim. Do not soften an actual defect into 'just a suggestion' if it should actually block the merge — say plainly whether it blocks.\n\nCHANGE UNDER REVIEW\n{{change_description}}\n\nWHAT THIS CHANGE CLAIMS TO DO\n{{stated_intent}}\n\nTEAM CONVENTIONS THIS DIFF SHOULD MATCH\n{{team_conventions}}\n\nKNOWN RISK AREAS FROM PAST INCIDENTS\n{{known_risk_areas}}\n\nREVIEW CATEGORIES\n1. Correctness — does the logic do what the stated intent above claims? Any off-by-one, race condition, null or undefined path, or edge case the tests do not cover?\n2. Security — injection risk, authorization gaps, secrets in code, unsafe deserialization, or unvalidated input crossing a trust boundary.\n3. Tests — do the tests exercise the actual changed behavior, or just re-assert what the implementation already does? Name any case the diff clearly needed but did not add.\n4. Readability and naming — would an engineer with no memory of writing this understand it in six months without asking the author?\n5. Scope — does this diff do only what the stated intent says, or is there an unrelated change bundled in that was never mentioned?\n6. Performance — any new N+1 query, unbounded loop, or blocking call introduced on a path that {{traffic_context}}?\n\nOUTPUT FORMAT\nFor each category: PASS, CONCERN, or BLOCKING, one line of reasoning, and a file and line reference for anything not PASS.\nEnd with one verdict — APPROVE, APPROVE WITH COMMENTS, or REQUEST CHANGES — and a one-sentence justification. No verdict is valid without one.\n\nCONSTRAINTS\n- A CONCERN that you would personally block on if this were your own team is a BLOCKING, not a CONCERN softened to avoid conflict. Rate honestly, not diplomatically.\n- If two categories point to the same root cause, such as a missing test also being a correctness risk, note the link rather than repeating the same explanation twice as if they were independent findings.\n- Do not raise a finding purely about style if it matches an existing, unremarked-on pattern already common elsewhere in this codebase — flag genuine inconsistency, not personal preference.\n- Read {{team_conventions}} before judging readability or scope, since a pattern that looks like an inconsistency to a reviewer unfamiliar with this codebase may in fact be the established local convention, and the reverse is just as costly: waving through a genuine departure from convention because it superficially resembles something seen elsewhere.\n\nPaste the diff or files under review below this line, unedited.",
    variables: [
      {
        name: 'change_description',
        description: 'What the diff actually adds or changes, in one sentence.',
        example:
          'Adds a bulk CSV export endpoint at /api/reports/export that streams up to 50,000 rows.',
        required: true,
      },
      {
        name: 'stated_intent',
        description:
          "What the pull request's own description claims this change accomplishes.",
        example:
          'The PR description says this should let an admin export a full report without timing out, using a streaming response instead of building the whole CSV in memory.',
        required: true,
      },
      {
        name: 'traffic_context',
        description:
          'How often this code path runs, to calibrate whether a performance issue actually matters.',
        example:
          'runs on every export click, currently a few dozen times per day, expected to grow with a new admin dashboard launch',
        required: true,
      },
      {
        name: 'team_conventions',
        description: 'An existing pattern this diff should be consistent with.',
        example:
          'This codebase always wraps a streamed response in the existing withStreamingResponse helper in lib/http/streaming.ts rather than writing to the response object directly.',
        required: false,
      },
      {
        name: 'known_risk_areas',
        description:
          'A specific past incident this area of the code is prone to, worth weighting extra.',
        example:
          'The team has been burned before by an export endpoint holding a database connection open for the full stream duration.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: ['code-review', 'review-rubric', 'checklist', 'pull-request', 'quality-gate'],
    whyItWorks:
      "A generic 'review this pull request' prompt reliably produces a different-shaped answer every time — sometimes a paragraph on style with nothing on correctness — because the model has no fixed frame to fill in. Giving it six named, closed categories forces systematic coverage of the same ground every time, the same mechanic behind Claude Code's own structured review commands scanning by category rather than freeform impression. Requiring a PASS, CONCERN, or BLOCKING rating per category, not prose, also prevents the single most common failure mode of AI code review: a vague 'looks good overall' that never actually commits to a position on any specific line. The instruction to rate honestly rather than diplomatically targets a real, documented tendency in helpfulness-tuned models to soften a negative finding into gentler language than its actual severity warrants, precisely because agreeable phrasing reads as more pleasant in the moment — naming that bias explicitly and instructing directly against it is what actually changes the output, since the model otherwise has no signal that honesty and diplomacy are in tension here at all. Requiring a linked note when two categories share one root cause, rather than letting the same defect count as two separate findings, matters for reviewer trust across many reviews specifically: a review that inflates its own finding count by restating one bug under two headings looks more thorough than it is, and a team that later notices the padding will discount every future review from the same rubric, including the genuinely independent findings inside it. Requiring the review to be checked against the team's own stated conventions before a readability or scope finding is raised also matters because Claude Code, unlike a reviewer new to the team, has no independent memory of which patterns are the house style and which are genuine drift — without that check explicitly injected, it will just as often flag an established convention as inconsistent as it will miss a real one, and either mistake erodes trust in the rubric the same way a fabricated severity would.",
    exampleOutput:
      '1. Correctness: PASS.\n2. Security: PASS.\n3. Tests: CONCERN — no test covers a zero-row export; add one before merge, file lib/reports/export.ts.\n4. Readability and naming: PASS.\n5. Scope: BLOCKING — this diff also reformats an unrelated file with no stated reason; split it out or explain it, file lib/utils/format.ts.\n6. Performance: PASS — streaming avoids the N+1 the prior implementation had.\n\nVerdict: REQUEST CHANGES — the missing zero-row test and the unexplained unrelated file change should be resolved before this merges.',
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-29' },
      {
        tool: 'GitHub Copilot',
        version: 'Copilot Chat 1.252 (VS Code)',
        date: '2026-07-29',
      },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and GitHub Copilot Chat.',
      },
    ],
  },
  {
    slug: 'claude-code-scope-locked-bug-fix',
    category: 'claude-code',
    title: 'Lock Claude Code to the minimal fix and stop the drive-by refactor',
    description:
      'A constraint block for a bug report that pins Claude Code to exactly the acceptance criteria stated, with an explicit list of what counts as scope creep even when the extra change looks like an improvement.',
    promptText:
      "You are fixing exactly one bug, nothing else. You are not refactoring, renaming, reformatting, or adding an abstraction anywhere in this file or repository, even if you notice something else nearby that looks wrong while you are in there — name it separately instead of touching it.\n\nBUG\n{{bug_report}}\n\nACCEPTANCE CRITERIA\n{{acceptance_criteria}}\n\nEXPECTED BLAST RADIUS\n{{expected_files}}\n\nRELEVANT HISTORY\n{{regression_history}}\n\nCONSTRAINTS\n- Change only what is required to satisfy every item in the acceptance criteria above, and nothing else. If satisfying a criterion genuinely requires touching a file outside the expected blast radius above, stop and explain why before making that change, rather than making it and explaining afterward.\n- Do not rename variables, extract functions, reformat unrelated lines, upgrade a pattern to a newer idiom, or add speculative error handling, logging, or validation for a case that is not in the bug report, even where doing so would objectively be an improvement — this pass has one job.\n- Do not add a new dependency, new config, or new file unless the bug is provably unfixable without one; if so, stop and state why before writing any code.\n- If the acceptance criteria conflict with each other, or with something already true elsewhere in the codebase, say so and stop rather than silently picking whichever interpretation is easier to implement.\n- Before writing the fix, check {{regression_history}} for whether this exact defect has appeared before; if it has, the fix must also explain why the earlier fix did not hold, not just apply a second patch on top without accounting for why the first one was incomplete.\n\nOUTPUT FORMAT\n1. One-sentence root cause, stated as a mechanism, not a symptom restatement — the actual defective logic, not just a restatement of what a user observed.\n2. The diff, and only the diff.\n3. A line mapping each changed line to the specific acceptance criterion it satisfies. Any changed line that does not map to a criterion is, by definition, out of scope and should not exist in the diff.\n4. A closing line: either 'No other changes were made.' or a named exception with the specific reason it was unavoidable, not a vague 'also cleaned up a few things.'\n\nIf, while diagnosing this bug, you notice a second, unrelated issue nearby, note it in one sentence at the very end under a heading 'Noted but not fixed' rather than fixing it silently or omitting it entirely — a bug you saw and chose not to touch should be visible, not invisible.",
    variables: [
      {
        name: 'bug_report',
        description: 'The bug, exactly as reported.',
        example:
          'Clicking Export CSV on the reports page throws a TypeError reading toFixed of undefined whenever a report has zero matching rows.',
        required: true,
      },
      {
        name: 'acceptance_criteria',
        description: 'A numbered list of what must be true for the fix to count as done.',
        example:
          '1. Exporting a zero-row report downloads a CSV with headers only, no error thrown. 2. Exporting a report with rows is completely unchanged. 3. No new console errors or warnings appear in either case.',
        required: true,
      },
      {
        name: 'expected_files',
        description:
          'The files this fix should plausibly need to touch, so anything beyond that is a visible tripwire.',
        example:
          'lib/reports/export.ts and, if a test needs to be added, tests/reports/export.spec.ts — nothing else should need to change.',
        required: true,
      },
      {
        name: 'regression_history',
        description:
          'Whether this exact code has broken before, so a fix accounts for the actual history rather than treating this as brand new.',
        example:
          'This exact function had a similar off-by-one bug fixed three months ago; check whether this is a regression of that fix rather than a new bug.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor'],
    tags: ['bug-fix', 'scope-control', 'constraint-block', 'agentic-coding'],
    whyItWorks:
      "Agentic coding assistants with real Edit access are documented to expand scope opportunistically — once a model is already inside a file, it tends to clean up adjacent code unless explicitly told not to, because the same helpfulness training that makes it useful also makes it reason about 'is this a good change' rather than strictly 'is this the change that was asked for', and almost any tidy-up passes the first test even when it should have failed the second. Naming the negative space directly — do not rename, do not reformat, do not add an abstraction — closes exactly the loopholes a vaguer 'just fix the bug' leaves open, since Claude follows explicit, direct constraints far more reliably than it infers a scope boundary from context alone. The line-to-criterion mapping requirement converts a subjective 'good enough' into a checkable exit condition: the model verifies its own diff against a list rather than deciding on its own when it is done, which is precisely the moment scope creep otherwise starts, because 'done' and 'also improved a few things nearby' feel identical from inside a single editing session. The 'noted but not fixed' section matters because it gives a legitimate, sanctioned outlet for the observation instinct instead of demanding its total suppression, which is more likely to actually hold under pressure than a bare prohibition — the model still gets to demonstrate it noticed something worth attention, just without acting on it unilaterally, and a human reviewing the fix gets a heads-up about a second issue instead of neither a fix nor a mention of it. Checking regression history before writing the fix matters for a distinct reason: a model with no memory of this codebase's past incidents will treat every bug as freshly discovered, and a second patch stacked on a defect that already has one failed fix behind it, without asking why the first one did not hold, tends to repeat the same incomplete reasoning rather than actually closing the gap the earlier fix missed.",
    exampleOutput:
      "1. Root cause: the average-rows calculation divides row count by a total that can be zero, producing NaN, and NaN.toFixed throws.\n2. Diff:\n- const avg = (rows.length / total).toFixed(1)\n+ const avg = total === 0 ? '0.0' : (rows.length / total).toFixed(1)\n3. This line satisfies criterion 1 (zero-row export no longer throws) and criterion 2 (non-zero path unchanged).\n4. No other changes were made.\n\nNoted but not fixed: the same file has an unrelated console.log left in from debugging on line 58 — flagging it, not removing it in this pass.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-30' }],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-edge-case-test-generation',
    category: 'claude-code',
    title:
      'Make Claude Code write tests that hunt for breakage, not confirm the happy path',
    description:
      'A test-generation prompt that enumerates required edge-case categories and forces table-driven coverage, directly countering the documented happy-path bias of LLM-written tests.',
    promptText:
      "You are writing tests whose job is to find where the code below breaks, not to confirm that it works. A suite that only exercises the happy path has failed this task even if every test in it passes.\n\nTARGET\n{{target}}\n\nTEST FRAMEWORK AND CONVENTIONS\n{{test_framework}}\n\nKNOWN EDGE CASES ALREADY IN THIS CODEBASE'S HISTORY\n{{known_edge_cases}}\n\nREQUIRED COVERAGE — CONSIDER EVERY CATEGORY, EVEN IF THE ANSWER IS 'DOES NOT APPLY, BECAUSE...'\n- Boundary values: empty, zero, negative, maximum length, exactly one element versus many.\n- Null, undefined, or partially malformed input, including an object missing a field the type signature promises will be present.\n- Type edge cases the type system does not actually prevent at runtime, such as JSON parsed from an external API or a form field that arrives as a string when a number was expected.\n- Error and exception paths — does the function fail loudly and specifically, or silently produce a wrong-but-plausible result?\n- Concurrency or repeat-call cases, if the function touches any shared, cached, or module-level state.\n- Adversarial input if this function ever receives anything from outside a fully trusted boundary, such as a string long enough to test a length limit, or a value shaped like an injection attempt even if the function is not directly a security surface — a test suite that never tries an unexpected shape cannot tell you whether the function degrades safely or not.\n- Every item listed under known edge cases above, even one that seems unlikely to matter today.\n\nFORMAT\n- Table-driven or parametrized tests, one assertion pattern reused across many named cases, not a wall of near-identical copy-pasted test functions where a missing row is invisible.\n- Name each case after the behavior it verifies, not test1, test2, or a description of the input alone with no stated expectation.\n- Do not write a snapshot test unless explicitly asked for one.\n- Follow the existing conventions in {{test_framework}} for fixtures and setup rather than inventing a parallel pattern this codebase does not already use elsewhere.\n\nAFTER THE TESTS\nList any coverage gap that could not be closed in this pass and exactly why — it needs a live network call, a fixture that does not exist yet, or a dependency this environment cannot exercise — rather than silently shipping a suite that looks complete but is not.\n\nIf {{coverage_gap_tolerance}} states a required coverage threshold and this suite would not meet it, say so explicitly rather than presenting the suite as sufficient by omission, and name specifically which untested branch would need a case added to close the gap.",
    variables: [
      {
        name: 'target',
        description: 'The function, file, or behavior to write tests for.',
        example:
          'parseDiscountCode(code, cart) in lib/checkout/discount.ts, returns a DiscountResult',
        required: true,
      },
      {
        name: 'test_framework',
        description: 'The testing framework and any conventions already in use.',
        example:
          'Vitest, using describe/it blocks and the existing test/factories/cart.ts builder for fixture data.',
        required: true,
      },
      {
        name: 'known_edge_cases',
        description:
          'Edge cases already known to matter, so the model does not have to guess them.',
        example:
          'expired codes, codes with leading or trailing whitespace, valid codes where the cart total is below the minimum spend',
        required: false,
      },
      {
        name: 'coverage_gap_tolerance',
        description: 'A required coverage threshold, if the project enforces one.',
        example: '85% line coverage on lib/checkout/, enforced in CI',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: ['testing', 'test-generation', 'edge-cases', 'tdd'],
    whyItWorks:
      "Left unconstrained, LLM-generated tests mirror the shape of the code they are testing rather than adversarially probing it — a well-documented bias toward happy-path coverage, because the model is pattern-matching 'what this function does' rather than reasoning about 'how this function could be called wrong'. Explicitly enumerating edge-case categories such as boundaries, null and undefined, type edge cases, error paths, and concurrency converts an implicit judgment call into an explicit checklist the model has to work through category by category, which is harder to shortcut than an open-ended 'write tests for this'. The known-edge-cases variable exists because the model has no other way to access a codebase's actual failure history — a bug already fixed once in this exact function is exactly the case worth forcing into the suite by name rather than hoping the model rediscovers it from the code alone, and this is the one thing a generic 'write good tests' instruction structurally cannot do, since it has no channel for injecting institutional memory the code itself does not encode. Requiring table-driven format over copy-pasted test functions is also a coverage mechanism, not just a style preference: a missing row in a table is visually obvious to a reviewer scanning the case list, where a missing near-duplicate function among many similar ones is easy to overlook entirely. The closing instruction to name coverage gaps explicitly, rather than let a finished-looking suite imply completeness, counters the natural framing that 'these are the tests I wrote' reads as done unless the model is specifically asked to audit its own output against a stated bar. Naming a coverage threshold to check against, when one exists, converts that self-audit from a subjective impression into a checkable number — a model told only to write good tests has no way to know whether it has done enough, while a model told the exact percentage a CI gate enforces can flag a real, specific shortfall rather than a vague sense of thoroughness that a reviewer has no way to independently verify either.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-31' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
  },
  {
    slug: 'claude-code-behavior-preserving-refactor',
    category: 'claude-code',
    title: 'Refactor with Claude Code without smuggling in a behavior change',
    description:
      'A refactor prompt that makes preserving external behavior an explicit, checkable constraint, forces the existing test suite to pass unmodified as proof, and requires the diff to be explained hunk by hunk, not just dumped.',
    promptText:
      'You are refactoring, not rewriting. The observable behavior of the code in scope — every input and output pairing, every side effect, every error condition, and every public signature — must be identical before and after this change, unless the preservation constraint below explicitly permits something to change.\n\nSCOPE\n{{target_scope}}\n\nTHE ONE GOAL OF THIS REFACTOR\n{{refactor_goal}}\n\nMUST PRESERVE\n{{preserve_constraint}}\n\nEXISTING TEST COVERAGE OVER THIS CODE\n{{existing_test_coverage}}\n\nPROCESS — FOLLOW IN ORDER\n1. Before writing any code, list exactly what you intend to change and why, in terms of structure only, for example extracting one specific duplicated check into its own function. Do not begin editing until this list exists.\n2. Make the change described in that list, and nothing beyond it.\n3. Run the existing test suite exactly as it stands. If any test needs to change to keep passing, that is direct evidence you changed behavior, not merely structure — stop and explain what happened rather than editing the test to match the new code.\n4. For each hunk in the resulting diff, write one line: what changed structurally, and an explicit confirmation of what stayed behaviorally identical across that same hunk.\n\nCONSTRAINTS\n- Do not change a public function signature, an exported name, or a return shape unless the preservation constraint above explicitly permits it.\n- Do not fix an unrelated bug you notice mid-refactor, even a trivial one. Note it separately at the end instead.\n- If the stated goal is impossible to achieve without a behavior change somewhere, stop and say exactly where before writing any code — do not make the change silently and disclose it only in a closing summary.\n- If the existing test coverage described above does not actually exercise the behavior you are about to touch, say so before refactoring, since a passing suite after the change would not actually prove anything in that gap.\n- If the change list from step one would require touching more files than the scope above names, treat that as a signal the scope was drawn too narrowly rather than silently expanding it — stop and ask whether the scope should be widened deliberately, instead of creeping past it one file at a time.\n\nOUTPUT\nThe structural change list, the diff, the per-hunk structural-versus-behavioral notes, and the test run result with pass and fail counts. If a coverage gap was found, add one line naming the specific behavior that a new test would need to exercise to close it.',
    variables: [
      {
        name: 'target_scope',
        description: 'Exactly what to refactor.',
        example: 'OrderProcessor.calculateTotal in services/order-processor.ts',
        required: true,
      },
      {
        name: 'refactor_goal',
        description: 'The one goal of this pass, not a general cleanup mandate.',
        example:
          'Reduce the nested if and else chain into something readable, no other goal.',
        required: true,
      },
      {
        name: 'preserve_constraint',
        description:
          'What specifically must not change, beyond the default of full behavior preservation.',
        example:
          'The public method signature and its Decimal return type must not change; internal helper functions may be renamed freely.',
        required: false,
      },
      {
        name: 'existing_test_coverage',
        description:
          'What tests currently exist over this code, so a coverage gap can be flagged before it matters.',
        example:
          '14 unit tests in tests/order-processor.spec.ts covering the standard discount tiers, but none covering a cart with a single item.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor'],
    tags: ['refactoring', 'behavior-preservation', 'code-quality', 'regression-safety'],
    whyItWorks:
      "'Refactor this' is underspecified in a way agentic assistants with real Edit access exploit — without an explicit definition of what must stay the same, a model will change a signature, alter an edge-case return value, or improve error handling while still calling the result a refactor, because nothing told it not to. Naming behavior preservation as a checkable constraint covering inputs, outputs, side effects, error conditions, and signatures gives it a specific target to verify against rather than a vague quality bar it is free to interpret generously in its own favor. Requiring the change list before the edit, and requiring the existing test suite to pass without modification, converts 'trust the diff' into 'verify the diff against a stated plan and a green test run' — if a test needs to change to keep passing, that is the exact signal a refactor silently became a behavior change, and the prompt makes stopping there the explicit instruction rather than leaving it to the model's own judgment about whether the test update is incidental. The coverage-gap check matters independently of the refactor process itself: a green suite after a change is only meaningful evidence if the suite was actually exercising the path that changed, and an agent that reports 'tests pass' without first checking whether those tests ever touched the refactored logic is offering false confidence dressed as verification. Asking for a one-line structural-versus-behavioral note per hunk also produces a paper trail a reviewer can check line by line, instead of a diff with no stated intent behind any individual change. Treating an expanding file count as a signal to stop and ask, rather than a threshold to quietly cross, matters because scope drift during a refactor rarely arrives as one dramatic decision — it arrives as a sequence of individually reasonable one-file extensions, each of which looks like finishing the same job properly, and by the time the total file count has doubled from the original scope, no single step in that sequence would have looked wrong in isolation.",
    exampleOutput:
      "Change list: extract the nested discount-eligibility checks into a helper named isEligibleForDiscount, no other change.\nTest run: 14 passed, 0 failed — no test needed modification, confirming behavior did not change.\nPer-hunk note: lines 42-58 moved into isEligibleForDiscount with no logic change, only extraction; calculateTotal's signature and Decimal return type are unchanged.\nCoverage gap flagged: none of the 14 tests exercise a single-item cart — recommend adding one before trusting this refactor fully on that path.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-pr-description-from-diff',
    category: 'claude-code',
    title: 'Turn a raw diff into a pull request description a reviewer can actually use',
    description:
      'A format-forced, audience-aware prompt that turns a raw diff into a structured pull request description written for a reviewer who has not opened the files yet, instead of a generic one-line summary.',
    promptText:
      "You are writing this pull request description for a reviewer who has not opened the diff yet and, realistically, will not read every changed line before deciding how carefully to review it. Write for that reader, not for yourself, having just read every line of the change.\n\nTICKET OR CONTEXT\n{{ticket_ref}}\n\nHOW FAMILIAR IS THE LIKELY REVIEWER WITH THIS AREA OF THE CODE\n{{reviewer_familiarity}}\n\nTESTS THAT EXIST IN THIS AREA TODAY\n{{tests_available}}\n\nFORMAT\nSummary — one or two sentences on what changed and why, in plain language, with no implementation detail yet.\nWhy — the problem or requirement that made this change necessary, linking the ticket above if one exists.\nWhat changed — a bullet list grouped by area or feature, not by file; a reviewer thinks in features, not in a file tree, and a list organized by file forces them to reconstruct the feature-level story themselves.\nHow this was tested — exactly what was run, referencing the tests named above by name where relevant, and what the actual result was. Not 'tests pass' alone — name the suite and the count.\nRisk and rollback — what is the actual blast radius if this change is wrong in production, and how would it be reverted or disabled quickly if so.\n{{deployment_risk_notes}}\n\nCONSTRAINTS\n- Do not describe the diff line by line. Describe intent and effect, at the level a reviewer who has not opened the files yet needs to decide where to look first.\n- Do not claim a test was run or a case was verified manually unless you can name the specific thing that was actually run or checked.\n- If the diff contains a change unrelated to the stated purpose above, call it out explicitly under What changed rather than omitting it because it does not fit the summary's narrative.\n- If {{reviewer_familiarity}} indicates the reviewer is not deeply familiar with this area, add one extra sentence of orientation under Why — the context an unfamiliar reviewer needs to evaluate the change at all, not just what it does.\n- Keep the whole description skimmable in under sixty seconds; it is a routing document for the reviewer's attention, not the full explanation of the change.\n- If the diff touches a file with no existing test coverage named in {{tests_available}}, say so plainly under How this was tested rather than letting the section read as complete when part of the change is genuinely unverified by anything automated.\n\nPaste the diff, or the output of git diff, below this line, unedited.",
    variables: [
      {
        name: 'ticket_ref',
        description: 'Link or ID of the issue this pull request addresses, if any.',
        example: 'JIRA-4821 — zero-row CSV export throws a TypeError',
        required: false,
      },
      {
        name: 'reviewer_familiarity',
        description:
          'How familiar the likely reviewer is with this area of code, so orientation can be added when needed.',
        example:
          'The usual reviewer for this file has moved teams; the person reviewing this time has never touched the reports module.',
        required: true,
      },
      {
        name: 'tests_available',
        description:
          'The specific automated tests that exist for this area, so the description can name them rather than gesture vaguely.',
        example:
          'tests/reports/export.spec.ts, 22 tests currently, run via npm run test -- reports/export',
        required: true,
      },
      {
        name: 'deployment_risk_notes',
        description:
          'Anything about how or when this ships that affects the actual risk.',
        example:
          'This deploys behind a feature flag already on for 5% of accounts; full rollout is a separate, later step.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: ['pull-request', 'documentation', 'diff-to-text', 'code-review'],
    whyItWorks:
      "Asked to summarize a diff with no format, a model reliably writes from its own vantage point — it just read every changed line, so it under-explains, producing the generic 'this pull request updates the checkout flow' that tells a reviewer nothing about what to actually look at. Explicitly naming the reader as a reviewer who has not seen the diff yet is a documented technique for calibrating output to an audience rather than just a format: the instruction changes what the model chooses to include, not only how it is arranged. Forcing a fixed section template of summary, why, what changed, how tested, and risk does two things at once — it prevents the generic one-liner, and it makes an incomplete description visually obvious, since an empty or vague how-tested section is far easier for a human to notice and reject than a missing sentence buried in a paragraph. Conditioning an extra orientation sentence on the stated reviewer-familiarity variable is something a repo-aware agentic tool can actually do well that a generic chat session pasted a diff cannot: because Claude Code has already read the surrounding code in this session, it can calibrate what an unfamiliar reviewer specifically needs explained about this module, rather than guessing at a generic level of background a stranger to the whole codebase would need. The explicit instruction to flag unrelated changes rather than omit them also counters a real failure mode of diff summarization: a model asked to describe the change will describe the change it judges most relevant to the stated purpose, silently dropping a drive-by edit a reviewer actually needed to see. Requiring an explicit callout when a touched file has no named test coverage matters for the same reason the how-tested section exists at all: a description that only ever states what was tested, and never what was not, lets an untested code path hide behind a section that reads as thorough simply because it is present and specific about the parts that were checked.",
    exampleOutput:
      'Summary: Fixes CSV export throwing an error when a report has zero rows.\nWhy: JIRA-4821 — three customers hit this in the last week filtering to an empty date range. The export path lives in lib/reports/export.ts, which the reports module owns end to end.\nWhat changed: Reporting/export — guarded the average-row calculation against a zero total instead of dividing into NaN.\nHow this was tested: added one case to tests/reports/export.spec.ts and re-ran the full file, 23 of 23 passed (previously 22).\nRisk and rollback: low risk, one-line guard on a pure function; revert is a single commit revert with no data migration.',
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-02' },
      {
        tool: 'GitHub Copilot',
        version: 'Copilot Chat 1.252 (VS Code)',
        date: '2026-08-02',
      },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and GitHub Copilot Chat.',
      },
    ],
  },
  {
    slug: 'claude-code-flaky-test-diagnosis',
    category: 'claude-code',
    title: "Diagnose a flaky test's real cause before Claude Code touches it",
    description:
      'A diagnosis-first prompt that stops Claude Code from silently wrapping a flaky test in a retry or a longer timeout, and instead forces it to isolate the actual source of nondeterminism through repeated real test runs and git history.',
    promptText:
      "You are diagnosing a flaky test, not fixing it. A flaky test passes and fails on the same code with no relevant change between runs — the job here is finding the actual mechanism, not making the failure stop by whatever means is fastest.\n\nTEST\n{{failing_test}}\n\nWHAT HAS ACTUALLY BEEN OBSERVED\n{{failure_evidence}}\n\nENVIRONMENT DIFFERENCES BETWEEN WHERE IT PASSES AND WHERE IT FAILS\n{{ci_environment_details}}\n\nSUSPECTED CAUSE, IF ANY\n{{suspected_cause}}\n\nDIAGNOSTIC PROCESS — DO NOT SKIP OR REORDER STEPS\n1. Run the test in isolation, alone, at least ten times in a row. Report the exact pass and fail count.\n2. Run the full suite it normally runs inside, at least ten times in a row, with this test included. Report the exact pass and fail count.\n3. If isolated runs are stable but full-suite runs are not, this is order-dependence or leaked shared state — identify the specific test that runs immediately before it and what state that test leaves behind: a shared database row, a module-level variable, a mock that was never reset.\n4. If both are unstable independently, look for genuine nondeterminism: unseeded randomness, a fixed sleep or timeout racing real async work, a system clock or timezone dependency, or a network or filesystem call that is not actually mocked.\n5. Check git log for the test file and the code it exercises. Was this test reliable before a specific recent commit? A regression introduced by a real code change is a lead, not a coincidence, and should outrank a theory about inherent randomness.\n6. State the diagnosis as one sentence naming the actual mechanism, backed by the evidence from steps one through five. 'It is flaky' or 'there might be a race condition' is not an acceptable diagnosis on its own — name the specific line, shared resource, or timing assumption responsible.\n\nNOT ACCEPTABLE AS A SUBSTITUTE FOR DIAGNOSIS\nDo not propose adding a retry, increasing a timeout, or marking the test skipped or quarantined as your finding. Any of these might be a legitimate part of an eventual fix once the mechanism above is named and confirmed, but proposing one before that point is a failed diagnosis, not a shortcut to one.\n\nIF THE ENVIRONMENT DIFFERENCE ITSELF LOOKS LIKE THE CAUSE\nIf {{ci_environment_details}} points at parallelism, worker count, or resource limits as the likely trigger, still complete steps one through five before concluding that — an environment difference is a plausible contributing factor, not by itself a mechanism, and the specific shared resource or timing assumption it exposes still needs to be named.\n\nOnce the diagnosis is confirmed and approved, propose the actual fix in a separate message, not this one.",
    variables: [
      {
        name: 'failing_test',
        description: 'The exact test name and file path.',
        example:
          "tests/checkout/discount.spec.ts, 'applies the loyalty discount when cart total exceeds threshold'",
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
        name: 'ci_environment_details',
        description: 'What differs between the passing and failing environments.',
        example:
          'CI runs the suite in parallel with 4 workers; locally the suite always runs single-threaded.',
        required: false,
      },
      {
        name: 'suspected_cause',
        description:
          'Any hunch already held, so the model can confirm or rule it out explicitly rather than starting blind.',
        example:
          'Might be related to another test in the same file mutating a shared mock client instance.',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['flaky-tests', 'test-diagnosis', 'debugging', 'ci-cd', 'root-cause-analysis'],
    whyItWorks:
      "Asked to fix a flaky test with no other constraint, a model's highest-probability response is exactly the three moves that make CI green without making anything true: add a retry wrapper, bump a timeout, or quarantine the test — each is a legitimate tool in a human engineer's kit but a worthless diagnosis on its own, since it treats the symptom as the problem. The 'not acceptable as a substitute for diagnosis' clause exists because a model under pressure to produce a working answer quickly will reach for the cheapest fix that makes the failure disappear, and naming that exact move as unacceptable up front closes off the shortcut before it is taken. Steps one and two — run the test alone repeatedly, then run it inside the full suite repeatedly — reproduce the standard engineering technique for distinguishing order-dependence and shared-state leakage from genuine nondeterminism inside the test itself; a model that only reasons about the code as text without actually executing it this way is guessing, whereas Claude Code's ability to run a test command in a loop through its own Bash tool turns this from a thought experiment into an empirical check with real pass and fail counts a chat-only assistant reading the same code could never produce. The git log step matters because flaky tests very often are not actually random at all — they became unreliable the moment a specific commit changed a timing assumption or a shared fixture, and a model that skips version history will hunt for randomness in code that was reliable for months before one dependency bump. The instruction to still complete every step even when the environment difference looks like an obvious explanation exists because 'CI runs in parallel and local does not' describes a condition that makes flakiness possible, not the specific defect that makes it happen under that condition — accepting the environment difference itself as the diagnosis leaves the actual shared-state bug in place, ready to resurface the next time parallelism changes for an unrelated infrastructure reason.",
    exampleOutput:
      "Step 1, isolated, 10 runs: 10 passed. Step 2, full suite, 10 runs: 7 passed, 3 failed. Since isolated is stable but suite is not, this points to order-dependence, not timing nondeterminism.\nStep 3: the test immediately before it uses a once-only mock resolve that, on an early return, never gets consumed — this test's own mock setup is then silently skipped and it hits the real, unmocked path, producing the timeout.\nDiagnosis: shared mock client not reset between tests in this file, missing a clearAllMocks call in an afterEach — not a race condition.\nNot proposing a fix yet, awaiting approval to proceed.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-03' }],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-dependency-upgrade-migration-plan',
    category: 'claude-code',
    title: 'Map a major dependency upgrade before Claude Code touches the lockfile',
    description:
      "A pre-upgrade research prompt that has Claude Code cross-reference every breaking change in a dependency's release notes against real usage sites in the repo, catching the silent behavior changes a live-fire upgrade-and-fix-what-breaks approach reliably misses.",
    promptText:
      'You are planning an upgrade of {{dependency_name}} from {{current_version}} to {{target_version}}. Do not modify the lockfile, the package manifest, or any application code during this pass — this is research and mapping only, using the repository search and read access you already have, not a live upgrade attempt.\n\nCRITICAL PATHS THAT MUST NOT REGRESS\n{{critical_paths}}\n\nHOW THIS DEPENDENCY IS ACTUALLY USED HERE\n{{usage_summary}}\n\nPROCESS\n1. Read the official changelog, release notes, or migration guide for every version between {{current_version}} and {{target_version}}, not only the final target — a breaking change introduced in an intermediate minor version is still a breaking change this repo will pass through.\n2. List every breaking change, deprecation, and default-behavior change found, each tagged with the version it landed in, in plain language a reviewer who has not read the release notes can follow.\n3. For every item from step two, search this codebase for every usage site touching the changed API, prop, config key, or behavior. Cite exact files and line numbers — do not estimate or generalize to a whole module when a specific line is what actually matters.\n4. Classify each usage site as SAFE, NEEDS CHANGE, or UNCERTAIN. UNCERTAIN means the static read alone cannot settle it and an actual test run against the new version would be needed to confirm — this is a legitimate answer, not a placeholder for more effort later.\n5. Weight silent behavior and default-value changes more heavily than removals or renames in this analysis, specifically because a rename fails loudly at the type checker or build step, while a shifted default or a subtly different timing assumption passes every automated check and only surfaces as a production bug days or weeks later.\n6. Propose a staged plan: whether the version jump should happen in one step or several, whether an official codemod exists and should run before any manual fix, and the order NEEDS CHANGE sites should be addressed in so each stage is independently testable rather than one large simultaneous change.\n\nOUTPUT\nA table of breaking change, affected usage sites, classification, and planned action. Then the staged plan as a numbered list. End with an honest confidence statement about the completeness of this mapping and specifically what would raise that confidence, such as running the existing suite against the new version on a disposable branch before touching the main codebase.\n\nDo not begin making any change until this plan is reviewed and approved.',
    variables: [
      {
        name: 'dependency_name',
        description: 'The package or framework being upgraded.',
        example: 'Next.js',
        required: true,
      },
      {
        name: 'current_version',
        description: 'The version currently installed.',
        example: '15.4.2',
        required: true,
      },
      {
        name: 'target_version',
        description: 'The version being upgraded to.',
        example: '16.2.12',
        required: true,
      },
      {
        name: 'critical_paths',
        description:
          'The parts of the app that carry the highest cost if this upgrade regresses them.',
        example:
          'The prompt library detail pages and the tool directory search must keep rendering exactly as they do today — these are the highest-traffic routes on the site.',
        required: true,
      },
      {
        name: 'usage_summary',
        description:
          'How this dependency is actually used, so the search knows what patterns to look for.',
        example:
          'App Router throughout, no legacy pages directory; server components by default with a handful of explicit client components for interactive tools.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor'],
    tags: [
      'dependency-upgrade',
      'breaking-changes',
      'migration-planning',
      'release-notes',
    ],
    whyItWorks:
      "The default failure mode for 'upgrade X to Y' is a live-fire approach: bump the version, run the build or type checker, and fix whatever complains, iterating until it is green — which works fine for changes that throw, but is structurally blind to changes that do not, like a default option flipping, a hook's timing shifting, or a prop silently being ignored instead of rejected. Forcing the changelog read and the usage-site mapping before any edit converts those silent risks into a named list before the upgrade starts, rather than relying on the test suite to happen to exercise every changed default by luck. The SAFE, NEEDS CHANGE, UNCERTAIN classification specifically creates a category for 'cannot know this without running it', rather than forcing a binary safe-or-not call the model is not actually in a position to make from static reading alone — an uncertain classification is honest, where a model pressured into a yes-or-no answer will often guess safe for a code path it did not fully trace, and that guess is exactly where a silent regression later hides. Requiring exact file and line citations rather than a general 'this affects the router' claim exploits the same repo-wide search capability that distinguishes an agentic coding assistant from a chat-only one reading pasted code — Claude Code can actually search the entire codebase for every call site of a changed API, which is the step that makes the difference between a plausible-sounding migration plan and one that is actually complete for this specific repository's real usage. Weighting silent default changes above loud removals reorders the plan's own attention against the model's natural instinct to lead with whatever the changelog itself lists first or most prominently, which is very often the headline removal, not the quieter default-value change buried three bullets down that a live-fire upgrade would never surface until it reached production. Requiring a staged plan, rather than one large simultaneous jump, also matters for a version range spanning several minors: it turns an all-or-nothing upgrade into a sequence of independently testable checkpoints, so a regression discovered at stage two is attributable to a small, known set of changes rather than to the entire multi-version jump at once.",
    exampleOutput:
      'Breaking change table, excerpt:\n- useEffect cleanup timing changed (16.0) -> hooks/useSocketConnection.ts:34 -> NEEDS CHANGE, cleanup now fires before the next effect runs in an edge case this hook relies on the old ordering for.\n- forwardRef no longer required for function components accepting ref (16.0) -> components/ui/Input.tsx:1, Button.tsx:1 -> SAFE to simplify, not required.\n\nStaged plan: run the official codemod first, fix useSocketConnection.ts manually since no codemod covers it, then re-run the full suite plus a manual pass on the reports pages.\nConfidence: moderate on the hooks-timing change specifically — recommend running the reports integration tests against a 16.2 branch before merging.',
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-04' },
      { tool: 'Cursor', version: '2.1', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
  },
  {
    slug: 'claude-code-resume-after-compaction',
    category: 'claude-code',
    title: 'Recover a Claude Code task correctly after a compaction or restart',
    description:
      'A session-recovery prompt that has Claude Code reconstruct exactly where a multi-step task stands from git state and any saved plan file, rather than trusting a compacted summary or its own fluent-sounding recollection of what already happened.',
    promptText:
      "This session's context was compacted, resumed from a saved transcript via --continue or --resume, or otherwise interrupted partway through a task. Do not continue as though every earlier decision is still fully remembered, and do not fill a gap with a plausible-sounding guess. Reconstruct the actual current state from ground truth before writing or changing anything else.\n\nORIGINAL GOAL\n{{original_goal}}\n\nWHERE A PRIOR PLAN MIGHT ALREADY EXIST\n{{plan_reference}}\n\nHOW THIS SESSION WAS RESUMED\n{{resume_method}}\n\nEXPECTED TEST STATE BEFORE THE INTERRUPTION\n{{expected_test_state}}\n\nRECONSTRUCT BEFORE DOING ANYTHING ELSE\n1. Run git status and git diff to see exactly what is currently uncommitted right now. List every added, modified, and deleted file, and summarize what each specific change does in one line.\n2. Run git log to see what has already been committed toward this goal, if anything, on the current branch, and how recently.\n3. Read, in full, any plan, todo list, or design note that exists at the location named above.\n4. Compare the current diff and commit history against the original goal stated above: state which parts are done, which are in progress, and which have not started, citing the specific file or commit that proves each of those three claims.\n5. Run the actual test suite now and compare the result against {{expected_test_state}} above. A currently failing test where the plan says everything was green last time is new information that needs its own explanation, not something to route around silently while continuing the original task.\n6. Write one paragraph stating the current understanding of exactly where this task stands, based only on what steps one through five actually show, not on an inference about what probably happened during the gap.\n\nIF SOMETHING DOES NOT ADD UP\nIf the current diff contains a change that cannot be explained by the goal or the plan artifact, name it explicitly as unexplained rather than building on top of it or assuming it was intentional. If an earlier decision appears to have been made that is not written down anywhere verifiable, say plainly that the reasoning behind it is unrecoverable from available evidence, and ask — do not invent a plausible-sounding rationale to fill the gap just because one would be convenient to have.\n\nONLY THEN\nPropose what happens next, in concrete terms, naming the very next file or command involved, and wait for explicit confirmation before resuming any edit — a proposal is not itself permission to proceed, even when it seems like the only reasonable next step.",
    variables: [
      {
        name: 'original_goal',
        description: 'The task as it was originally stated, before the interruption.',
        example:
          'Migrate the reports module off the legacy REST client onto the new typed API client, one file at a time, keeping every existing test green throughout.',
        required: true,
      },
      {
        name: 'plan_reference',
        description:
          'Where a plan or todo list for this task might already exist, if anywhere.',
        example:
          'A PLAN.md should exist at the repo root, written at the start of this task, listing files in migration order.',
        required: false,
      },
      {
        name: 'resume_method',
        description:
          'How this session came back, so the recovery can account for what that method actually preserves.',
        example:
          'This session was resumed with claude --continue after an unplanned terminal restart, not through a manual compaction.',
        required: true,
      },
      {
        name: 'expected_test_state',
        description:
          'What test state was true right before the interruption, so a currently failing test reads as new information.',
        example:
          'The full reports test suite was green the last time it ran before the interruption, per the PLAN.md notes.',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'context-compaction',
      'session-recovery',
      'long-running-tasks',
      'context-engineering',
    ],
    whyItWorks:
      "Claude Code compacts a long conversation's context automatically as it nears the model's context window limit, and compaction can also be triggered manually — in both cases what carries forward into the rest of the session is a generated summary standing in for the original turns, not the turns themselves, and --continue or --resume reload a saved transcript that has the same property whenever the underlying session had already compacted. A summary is lossy by construction: it reliably keeps the stated goal and the obvious file changes, and just as reliably drops the specific reasoning behind a judgment call, such as why one of two viable approaches was chosen, because that reasoning lived in a sentence of discussion rather than in a diff. This prompt's core mechanic is refusing to trust the compacted summary or the model's own fluent-sounding recollection, and instead re-deriving task state from git status, git diff, and git log — sources that cannot be silently rewritten by a summarization pass, the same principle behind verifying a claim against its primary source rather than trusting someone's paraphrase of it. Explicitly allowing 'the reasoning is unrecoverable, ask' as a valid output is the load-bearing part: a model motivated to appear continuous and competent will otherwise fabricate a plausible justification for a decision it cannot actually verify, and a fabricated rationale that later gets built on top of is far more expensive to unwind than an honest gap flagged immediately after a restart. Re-running the test suite rather than trusting the summary's account of test state closes the same gap one level lower: a compacted summary might faithfully report 'tests were passing' as of the last real turn it summarized, but that turn is not now, and treating a stale true fact as a current one is exactly the kind of small, compounding error that a session recovering from a real interruption cannot afford to inherit silently.",
    exampleOutput:
      "git status shows 2 modified files with uncommitted changes and one new, uncommitted file. git log shows one prior commit toward this goal, so one of five planned files is done and merged into this branch's history.\nPLAN.md at the repo root lists five files in order; based on git state, file one is complete, files two and three are in progress with uncommitted changes, files four and five are not started.\nOne thing does not add up: a test file has a modification not explained by the plan or the related source diff — flagging this rather than assuming it was intentional.\nProposed next step: finish the in-progress files, resolve the unexplained test change, run the full suite, then commit before starting file four. Waiting for confirmation.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-05' }],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Claude Code session compaction and --continue (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-codebase-onboarding-walkthrough',
    category: 'claude-code',
    title: 'Get an unfamiliar codebase explained top-down before touching a single line',
    description:
      'An onboarding prompt that forces a layered explanation — entry point, architecture, data flow, then the specific traps — instead of a flat file-by-file dump that burns attention without building a mental model.',
    promptText:
      "You are onboarding a new engineer onto this codebase who can read code fluently but has zero context on this specific project's decisions. Do not describe syntax anywhere in this response. Describe intent, architecture, and the traps a competent engineer would still fall into.\n\nSCOPE\n{{focus_area}}\n\nWHAT THIS PERSON ALREADY KNOWS, SO YOU DO NOT RE-EXPLAIN IT\n{{prior_context}}\n\nTHIS PERSON'S BACKGROUND\n{{engineer_background}}\n\nEXPLAIN IN THIS EXACT ORDER\n1. What this codebase, or the scoped area above, actually does — two sentences, written for someone who has genuinely never seen it.\n2. Entry point or points — where execution actually starts, and the first meaningful thing that happens after that, named by real file and function.\n3. Architecture — the four to six major modules or layers, and for each, its one job and, just as importantly, what it explicitly does not do, since the boundary of a module's responsibility is usually the more useful fact.\n4. Data flow — trace one realistic request or user action end to end through those layers, naming real files and functions at each step, not a generic description of 'the flow.'\n5. State and side effects — what is stateful, where it lives, and specifically what would break if two instances of that state-touching code ran concurrently.\n6. The traps — three to five things that look obvious but are not: a misleading name, a module that appears unused but is not, a place where the intuitive fix is actually the wrong one and why.\n\nCONSTRAINTS\n- Cite real file paths, function names, and class names throughout, never a generic description standing in for a specific reference.\n- Where you are inferring rather than certain, because no comment, test, or commit message confirms it, say 'likely' or 'appears to' explicitly rather than presenting an inference as settled fact.\n- Stop after item six. Do not propose changes, improvements, or a refactor plan unless it is explicitly asked for separately — this is an explanation, not a review.\n- Calibrate depth per section against {{engineer_background}} rather than treating every layer as equally unfamiliar — spend fewer words on the part of the stack this person already has real experience with, and more on the part where their background gives them the least to draw on.\n\nGiven {{time_budget}}, prioritize completeness over polish, and if {{focus_area}} scopes this to one subsystem, still name in one sentence how that subsystem's boundary connects to the rest of the codebase, so the walkthrough does not read as though this area exists in isolation.",
    variables: [
      {
        name: 'focus_area',
        description:
          'What to scope the explanation to, or leave general for a full-codebase walkthrough.',
        example: 'the checkout and payment flow specifically, not the whole repository',
        required: false,
      },
      {
        name: 'prior_context',
        description:
          'What this reader already knows, so the explanation does not waste time on it.',
        example:
          'This engineer has shipped production TypeScript and React before, just not on this specific codebase — no need to explain what a React hook is.',
        required: true,
      },
      {
        name: 'engineer_background',
        description:
          "The reader's actual experience profile, so depth is calibrated correctly per area.",
        example:
          'Backend-leaning, comfortable with API design, less experienced with frontend state management specifically.',
        required: true,
      },
      {
        name: 'time_budget',
        description:
          'How this will actually be used, to calibrate completeness versus brevity.',
        example:
          'This will be read once, in one sitting, before their first real ticket — it needs to be complete enough to act on, not a reference document to revisit.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: ['onboarding', 'codebase-explanation', 'architecture', 'context-engineering'],
    whyItWorks:
      "Given a bare 'explain this codebase' request, models default to a flat, file-by-file recap because that is the path of least resistance through the context window, not because it is the most useful shape — it burns the reader's attention without building a mental model. Fixing the traversal order from entry point to architecture to data flow to statefulness to traps exploits the model's real strength, synthesizing many files into a structure, while removing the choice of shape that produces the flat dump by default. The step asking what looks obvious but is not matters specifically because a generic explain-this prompt optimizes for describing what the code does, which the model can already do from the code alone; asking for what is non-obvious forces it to reason about what would mislead a newcomer specifically, which is the actual value an onboarding document needs to deliver and the part a flat summary never gets to. The engineer-background variable exists because the same codebase needs a different depth in different places depending on who is reading — a backend-leaning reader needs more said about the frontend state boundary and less about the API contracts they already understand well, and a walkthrough that treats every reader identically wastes their limited first-day attention on the part they already knew. The explicit instruction to say 'likely' rather than present a guess as fact matters because codebase explanations are exactly the kind of task where a fluent, confident-sounding wrong claim about why a module exists is more dangerous than an admitted gap, especially for a new engineer who has no independent way yet to catch a wrong claim stated with full confidence. Calibrating depth against background explicitly, rather than leaving it to the model's own guess about what a generic new engineer needs, matters because Claude Code cannot see the reader at all — it only has whatever the prompt tells it about them, so a background variable is not a nice-to-have personalization, it is the only channel through which the walkthrough's effort gets allocated to the areas where this specific reader actually has a gap instead of spread evenly across a codebase where not every layer is equally unfamiliar to them.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-06' },
      { tool: 'Cursor', version: '2.1', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
  },
  {
    slug: 'claude-code-headless-ci-pipeline',
    category: 'claude-code',
    title: 'Script a Claude Code headless run that a CI pipeline can actually trust',
    description:
      "A prompt structured for Claude Code's non-interactive headless invocation — explicit output-format contract and exit-condition rules — so a CI step gets a parseable, deterministic result instead of conversational prose no script can act on.",
    promptText:
      "This prompt is invoked headlessly in print mode inside a CI pipeline, with no human present to answer a permission prompt or clarify an ambiguous instruction. Because of that, resolve ambiguity using the stated defaults below rather than asking a question that would never be answered, and never wait on approval before completing the task.\n\nTASK\n{{ci_task}}\n\nDEFAULTS TO USE WHEN THE TASK IS AMBIGUOUS\n{{ambiguity_defaults}}\n\nTOOLS AVAILABLE IN THIS RUN\n{{allowed_tools_for_run}}\n\nOUTPUT CONTRACT — THE PIPELINE PARSES THIS PROGRAMMATICALLY\nProduce exactly one JSON object as the final output, matching this shape, and nothing after it:\n{{output_schema}}\nDo not wrap it in a markdown code fence, do not add commentary before or after it, and do not emit partial JSON if the task fails partway — emit a complete object with a status field describing the failure instead.\n\nEXIT CONDITIONS\n- If the task completes successfully against its stated definition, set status to success and populate every other field.\n- If the task cannot be completed for a reason the pipeline should surface to a human later, such as a missing file or a test that fails for reasons outside this task's scope, set status to blocked and put the specific reason in the reason field — do not attempt an unrequested workaround just to force a success status.\n- If a step in the task would normally require a permission prompt that cannot be answered in this unattended context, such as installing a new dependency, do not attempt it silently and do not fail silently either — set status to needs_human and name the exact action that needed approval.\n\nCONSTRAINTS\n- Do not produce output that reads well to a human but cannot be parsed by a script; the JSON object is the actual interface here, and a pipeline that fails to parse it fails the whole run regardless of whether the underlying work was correct.\n- Do not retry a failed step more than {{max_retries}} times before reporting blocked; an unattended run that loops indefinitely on a step that will not succeed wastes CI time with no path to resolution without a human anyway.\n- Log a brief plain-text trace of what was attempted, in order, before the final JSON object, so a human reading CI logs later has a narrative to check against the machine-readable result.\n- Only use the tools listed in {{allowed_tools_for_run}}; if the task as described would require a tool outside that list to complete fully, report that gap through the needs_human status rather than attempting the closest available substitute silently.\n\nBegin the task now.",
    variables: [
      {
        name: 'ci_task',
        description: 'The exact task this headless run should perform.',
        example:
          "Run the full lint and typecheck suite against the current branch, and if there are auto-fixable lint violations, apply the fixes and commit them with message 'chore: auto-fix lint violations'.",
        required: true,
      },
      {
        name: 'ambiguity_defaults',
        description:
          'What to do by default when the task description leaves a decision open.',
        example:
          'If a lint rule violation is not auto-fixable, leave it unfixed and list it rather than guessing at a manual fix.',
        required: true,
      },
      {
        name: 'allowed_tools_for_run',
        description:
          'The exact tool permissions granted for this specific unattended run.',
        example:
          'Bash(npm run lint:*), Bash(npm run typecheck:*), Bash(git commit:*), Edit',
        required: true,
      },
      {
        name: 'output_schema',
        description: 'The exact JSON shape the pipeline expects back.',
        example:
          '{ status: "success" | "blocked" | "needs_human", lint_violations_fixed: number, lint_violations_remaining: string[], typecheck_errors: string[], reason: string | null }',
        required: true,
      },
      {
        name: 'max_retries',
        description:
          'How many times a failed step may be retried before giving up and reporting blocked.',
        example: '1',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'headless-mode',
      'ci-cd',
      'automation',
      'structured-output',
      'non-interactive',
    ],
    whyItWorks:
      "Claude Code's print mode genuinely removes the interactive human loop that ordinary sessions rely on for permission prompts and clarifying questions, so a prompt written for headless use has to pre-resolve every ambiguity the model would normally ask about, because there is no one there to answer — this is a structurally different authoring problem than an interactive-session prompt, not just a shorter version of one. The single-JSON-object-and-nothing-else contract matters because a headless run's output is consumed by a script, not read by a human — Claude's default conversational register, which explains, hedges, and adds a caveat, is actively harmful in this context because it breaks a naive JSON parse the same way one stray character would; a structured output flag on the CLI is designed exactly for this, and calibrating the prompt itself to that contract matters just as much as the flag does. Distinguishing 'blocked' from 'needs_human' as separate statuses acknowledges a real asymmetry unattended runs face: some failures are inherent to the task, such as a test that genuinely fails, while others are failures of authority, such as an action needing a permission grant nobody is present to give, and collapsing both into one generic failed status loses information a human triaging CI failures the next morning actually needs in order to act efficiently rather than re-diagnose from scratch. Bounding retries matters because an unattended agent looping on a step with no possible resolution is a pure CI cost with no corresponding chance of success, unlike an interactive session where a human might notice and intervene mid-loop before it burns through the same budget. Restricting the run to exactly the tools named for it, rather than whatever the agent's default permissions would otherwise allow, matters more in headless mode than in an interactive one specifically because there is no ask step available to catch an over-broad action before it executes — a permission that would merely prompt a human in an interactive session executes silently and irreversibly in an unattended one, so the tool list here is doing the safety work an ask list cannot do when nobody is present to answer it.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-07' }],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial publish, verified against Claude Code headless print mode (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-git-worktree-parallel-tasks',
    category: 'claude-code',
    title:
      'Run two Claude Code sessions in parallel on the same repo without them colliding',
    description:
      "A worktree-setup prompt that has Claude Code create an isolated git worktree per parallel task before starting work, so two agentic sessions on the same repository never fight over the same files or an uncommitted change in the other session's way.",
    promptText:
      "You are about to work on one of several tasks that will run in parallel against this same repository, each in its own Claude Code session. Before writing any code, set up an isolated git worktree for this specific task so this session's uncommitted changes can never collide with, be overwritten by, or accidentally include a file changed by a different parallel session working in the main checkout or another worktree.\n\nTHIS TASK\n{{task_description}}\n\nBRANCH AND WORKTREE NAMING\n{{worktree_naming_convention}}\n\nOTHER PARALLEL TASKS CURRENTLY IN FLIGHT, IF KNOWN\n{{concurrent_tasks}}\n\nSETUP STEPS — DO BEFORE ANY EDIT\n1. Confirm the repository's current state is clean enough to branch from safely: run git status in the main checkout and note anything uncommitted there that is not yours to touch.\n2. Create a new branch for this task specifically, following the naming convention above, and create a worktree for it using git worktree add, as a sibling directory of {{repo_root_path}}, never nested inside it.\n3. Move all subsequent work for this task into that worktree's directory — every file read, edit, and command from this point on happens there, not in the main checkout.\n4. Confirm the worktree's dependencies are installed and its test command actually runs cleanly on the pre-change code before making any change, so a later test failure can be attributed to this task's own edits rather than to a stale or incomplete worktree setup.\n\nDURING THE TASK\n- Commit at meaningful checkpoints inside this worktree's own branch, not directly onto the branch any other parallel session is using, even if that other branch happens to be checked out somewhere visible.\n- If completing this task genuinely requires a change that would also need to exist on a different parallel task's branch, such as a shared type both are extending, say so explicitly rather than making the shared change silently in only one worktree and letting the two branches diverge on it unnoticed.\n\nWHEN THE TASK IS DONE\nState the exact branch name and worktree path so it can be reviewed and merged independently of whatever the other parallel sessions produce, and confirm whether this worktree should be removed with git worktree remove after merge or left for further work.\n\nDo not fall back to working directly in the main checkout partway through, even if the worktree setup feels like unnecessary overhead for a small task — the isolation is the entire point when multiple sessions are running concurrently, and partial isolation defeats it.",
    variables: [
      {
        name: 'task_description',
        description: 'The specific task this isolated session is responsible for.',
        example:
          'Implement the CSV export streaming fix described in ticket JIRA-4821, isolated from the two other tasks running in parallel on this repo today.',
        required: true,
      },
      {
        name: 'worktree_naming_convention',
        description: 'The exact branch and directory naming to use.',
        example:
          'Branch name fix/jira-4821-csv-export-streaming, worktree directory ../tools-scult-in-jira-4821 sibling to the main checkout.',
        required: true,
      },
      {
        name: 'concurrent_tasks',
        description:
          'What else is running in parallel right now, so overlap can be checked rather than assumed away.',
        example:
          'A second session is working on fix/jira-4790-invoice-rounding in a sibling worktree, and a third is doing a dependency upgrade on chore/react-19-upgrade — none are known to touch lib/reports, but confirm before assuming no overlap.',
        required: false,
      },
      {
        name: 'repo_root_path',
        description:
          'The main checkout path, so new worktrees are placed correctly relative to it.',
        example: 'D:\\CLAUDE\\tools.scult.in',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'git-worktree',
      'parallel-agents',
      'multi-session',
      'workflow-isolation',
      'concurrency',
    ],
    whyItWorks:
      "A git worktree is a genuinely separate working directory sharing one underlying git database — this is the actual mechanism that lets two Claude Code sessions run truly concurrently without one session's file edits ever appearing in the other's working directory, which is categorically different from two sessions sharing a single directory and relying on discipline alone to avoid stepping on each other's uncommitted edits, since a single directory can only have one branch checked out in it at any given moment. Verifying the worktree's own baseline, meaning dependencies installed and tests green on the unmodified code, before editing matters specifically in a parallel-session setup, because a test failure discovered later needs a clean attribution — otherwise a genuine regression from this session's own change is indistinguishable from a setup problem inherited from creating the worktree incorrectly, and untangling that after the fact costs far more than the thirty seconds of verification up front would have. Explicitly surfacing a shared-change need across worktrees, rather than making it silently in one, addresses a real failure mode unique to worktrees specifically: because each worktree has its own independent branch history, a change that logically belongs on two branches at once does not propagate automatically the way it would if both sessions were somehow sharing state — it has to be deliberately made twice or coordinated, and a session unaware this is even a risk will not think to flag it before the two branches have already diverged on it. The refusal to fall back to the main checkout 'for a small task' targets exactly how isolation actually breaks down in practice — not through a dramatic failure, but through a session justifying one quick edit outside its worktree because setting one up felt disproportionate, which is the same scope drift that defeats discipline elsewhere in agentic work.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against Claude Code with git worktrees (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-output-style-statusline-config',
    category: 'claude-code',
    title:
      'Build a custom Claude Code output style and statusline instead of living with the defaults',
    description:
      'A prompt that produces both a custom output-style definition and a statusLine script, tuned to how a specific developer actually wants Claude Code to communicate and what they need visible at a glance in the terminal.',
    promptText:
      "Produce two related but distinct artifacts: a custom Claude Code output style, and a statusLine script for settings.json. Do not blend their concerns — the output style changes how Claude Code phrases its responses; the statusline changes what information is always visible at the bottom of the terminal regardless of what Claude Code is currently saying.\n\nHOW RESPONSES SHOULD ACTUALLY BE PHRASED\n{{communication_preference}}\n\nWHAT MUST BE VISIBLE AT A GLANCE, EVEN MID-TASK\n{{statusline_info_needs}}\n\nPART ONE — OUTPUT STYLE\nWrite the output style as a markdown file with frontmatter naming it and describing when it should be used, and a body instructing Claude Code how to phrase and structure its responses under this style — verbosity, whether to explain reasoning inline or only when asked, how much to narrate tool use versus just doing it, and how to handle a response that would otherwise run long. Base this on the preference stated above, not on a generic 'be more concise' instruction that does not actually specify what to cut first when a tradeoff arises.\n\nPART TWO — STATUSLINE\nWrite the statusLine command as a small script that reads the JSON payload Claude Code provides on stdin, which includes the current model, session cost so far, and working directory among other fields, and prints one line of plain text with no ANSI color codes assumed unless {{terminal_supports_color}} confirms the terminal renders them. The line must include, in this priority order if space is limited: {{statusline_info_needs}}. If a field the script wants is missing from the payload in some session, such as cost being unavailable early on, the script must degrade gracefully and omit that segment rather than printing an error or a blank placeholder that looks broken. Write the script so it runs correctly under {{preferred_shell}}, not assuming a POSIX shell is available unless that is what was specified.\n\nCONSTRAINTS\n- The output style must not attempt to also surface status information; that is the statusline's job, and blending them means neither one is reliably readable at a glance while the other is doing an unrelated job.\n- The statusline script must run fast, since it is invoked frequently as the terminal redraws — anything that could block, such as a network call, must not be in this script.\n- State clearly which file goes where: the output style file's path, and the settings.json fragment enabling the statusline and pointing at the script's path.\n\nOUTPUT\nBoth files in full, plus the settings.json fragment, in that order.",
    variables: [
      {
        name: 'communication_preference',
        description: 'How responses should actually be structured and paced.',
        example:
          'Skip the recap of what was already asked for at the start of a response; lead with the answer or the diff first, and only explain reasoning if asked or if a decision was genuinely ambiguous enough to need one.',
        required: true,
      },
      {
        name: 'statusline_info_needs',
        description: 'What must be visible in the status line, in priority order.',
        example:
          'current git branch, session cost so far to the nearest cent, and whether there are uncommitted changes in the working directory',
        required: true,
      },
      {
        name: 'terminal_supports_color',
        description: 'Whether the target terminal renders ANSI color codes.',
        example: 'Yes, this runs inside Windows Terminal with full ANSI color support.',
        required: false,
      },
      {
        name: 'preferred_shell',
        description: 'The shell this script will actually be invoked under.',
        example:
          'PowerShell on Windows, so the script must run correctly invoked from PowerShell, not assume a POSIX shell is available.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['output-style', 'statusline', 'terminal-ux', 'customization', 'settings-json'],
    whyItWorks:
      "Output style and statusline are genuinely separate mechanisms in Claude Code with separate lifecycles — output style governs the content and phrasing of the model's own generated response, re-applied every turn, while the statusline is an externally-invoked script whose stdout is redrawn independently of any particular response, so conflating their jobs in one artifact produces something unreliable at both: a status fact rendered inside a chat response scrolls away the moment the next message starts, while a communication-style rule stuffed into a status script has nowhere to actually take effect, since the script never generates conversational text at all. The statusline script receiving structured JSON on stdin, including model, cost, and working directory among other fields, is a real, documented input contract — treating 'what needs to be visible' as a formatting problem over that payload, rather than something to ask the model to volunteer conversationally, is what makes the information actually persistent and glanceable rather than dependent on the model remembering to mention it in a given reply. Requiring graceful degradation when a field is absent, such as cost being unavailable very early in a session, matters because a statusline script is invoked on effectively every redraw — a script that errors or prints a broken-looking placeholder on a payload shape it did not anticipate does not fail once, it fails every single redraw for the rest of that session, which is a categorically worse failure mode than a single malformed chat response would be. The fast, non-blocking constraint is specific to how often this script runs — a status line invoked on every terminal redraw cannot afford the latency budget a normal tool call can, and a network call inside it would visibly stutter the terminal on every keystroke rather than just delaying one response. Tying the script's shell syntax explicitly to the actual invoking shell rather than assuming a POSIX default matters on Windows specifically, since a script written assuming bash-style conditionals and path separators will fail silently or print garbled output the moment settings.json actually invokes it through PowerShell, and a statusline that only works in the environment it was tested in is not a fix, it is a bug waiting for the next machine it runs on.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: 'Initial publish, verified against Claude Code output styles and statusLine (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-multi-agent-orchestration',
    category: 'claude-code',
    title: 'Orchestrate several Claude Code subagents on one task without collisions',
    description:
      'A delegation prompt for a main Claude Code session coordinating multiple distinct subagents on one complex task — researcher, implementer, reviewer — with an explicit handoff contract between them, so parallel or sequential delegation does not produce duplicate work, conflicting edits, or a finding that silently never reaches the implementer.',
    promptText:
      "You are the orchestrating conversation for a task that will be split across more than one existing subagent, defined in {{subagents_available}}. You are not doing the work yourself where a subagent already owns it — your job is sequencing, handoff, and reconciling what comes back, not re-deriving the answer a subagent already produced.\n\nTASK\n{{task_description}}\n\nSUBAGENTS AVAILABLE AND WHAT EACH ONE OWNS\n{{subagents_available}}\n\nHANDOFF CONTRACT BETWEEN STAGES\n{{handoff_contract}}\n\nSEQUENCING\n{{parallelizable_vs_sequential}}\n\nBEFORE DELEGATING ANYTHING\n1. Map the task onto the subagents above explicitly: which subagent does which slice, in what order, and what each one needs from the one before it to start. If a slice of the task does not cleanly belong to any existing subagent, say so and decide whether to handle it yourself in the main thread or define a new subagent first — do not force a mismatched slice onto the nearest existing one just to avoid that decision.\n2. If two subagents can genuinely run in parallel because neither depends on the other's output, say so explicitly and confirm they do not both need to edit the same file — a subagent editing a file another one is simultaneously reading half-finished is a real race, not a hypothetical one.\n3. State the handoff contract per stage: exactly what the next subagent, or you, needs back — not everything the subagent reasoned about internally, only what should cross the boundary.\n\nWHILE RUNNING\n- After each subagent returns, verify its output against the handoff contract before passing it to the next stage. Do not forward a result you have not actually checked matches what the next stage needs, just because it looks complete.\n- If a subagent's finding changes what a later stage should do, update that later stage's brief explicitly rather than sending it the original, now-stale instructions.\n\nFAILURE HANDLING\n{{failure_handling}}\nIf a subagent returns an incomplete or blocked result, do not silently proceed to the next stage as though it succeeded — stop, state what is missing, and decide whether to retry that subagent, do the missing piece yourself, or halt the whole task.\n\nCONSTRAINTS\n- Do not redo a subagent's job yourself in the main thread just because its result arrived slower than expected or looks slightly different from what you would have produced directly — the reason to delegate was the isolation and scoping a subagent provides, and quietly duplicating its work in the main thread defeats both without anyone deciding that tradeoff on purpose.\n- Do not let two subagents investigate or implement the same slice of the task independently unless {{parallelizable_vs_sequential}} explicitly calls for a deliberate second opinion — an accidental overlap wastes the isolated context both subagents were given and can return two different answers to the same question with no stated reason to prefer one over the other.\n\nOUTPUT\nA short running log of which subagent ran, what it was given, what it returned, and whether that result was accepted as-is or required a correction before moving on. End with the final consolidated result, not a list of the individual subagent transcripts.",
    variables: [
      {
        name: 'task_description',
        description: 'The overall task being split across multiple subagents.',
        example:
          'Investigate why the invoice PDF export is missing line-item tax breakdowns, then implement the fix, then verify it against the existing invoice test fixtures.',
        required: true,
      },
      {
        name: 'subagents_available',
        description:
          'The existing subagents this task can delegate to, and what each owns.',
        example:
          'code-investigator (read-only, finds root causes and cites file/line), implementer (has Edit and Bash, makes the actual code change), test-runner (runs the suite and reports pass/fail counts, cannot edit code).',
        required: true,
      },
      {
        name: 'handoff_contract',
        description:
          'What must cross the boundary between each stage, and in what shape.',
        example:
          'code-investigator must hand the implementer a specific file, line, and root-cause sentence, not a general description of the symptom; the implementer must hand test-runner the exact files changed, not a full diff.',
        required: true,
      },
      {
        name: 'parallelizable_vs_sequential',
        description: 'Which stages can run at the same time versus which must wait.',
        example:
          'Investigation must finish before implementation starts; there is nothing to parallelize here since each stage strictly depends on the last.',
        required: true,
      },
      {
        name: 'failure_handling',
        description:
          'What should happen if one stage in the chain comes back incomplete.',
        example:
          'If test-runner reports any failure, return control to the implementer with the specific failing test name rather than retrying test-runner or declaring the task done.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'multi-agent',
      'orchestration',
      'subagents',
      'task-delegation',
      'workflow-coordination',
    ],
    whyItWorks:
      "A single Claude Code subagent definition specifies one job and an isolated context, but nothing about the subagent mechanism itself sequences several of them together — that coordination has to live somewhere, and by default it lives nowhere, which is why an unplanned multi-subagent task tends to degenerate into the main thread invoking whichever subagent occurred to it next rather than following a deliberate handoff plan. Making the handoff contract explicit per stage matters because a subagent's own internal reasoning never crosses back into the main conversation automatically — only what it explicitly returns does — so if the orchestrating prompt does not state exactly what the next stage needs, the main thread has no principled basis for deciding whether a subagent's response contains enough to proceed, and will often forward whatever came back regardless of completeness. The instruction to verify each result against its contract before forwarding it targets a specific compounding failure: an incomplete finding from stage one that goes unchecked does not just fail on its own, it silently degrades every subsequent stage built on top of it, and by the time a downstream subagent produces an obviously wrong result, the actual defect is now two or three stages upstream and much harder to trace back to. Distinguishing genuinely parallelizable stages from sequential ones is a real correctness question, not a performance tweak, when subagents share a working tree — two subagents invoked at once against the same files can produce a race on disk that neither one's own instructions would ever catch, since each subagent only sees its own isolated context and has no visibility into what a concurrently running sibling is doing to the same file at the same moment. Requiring the main thread to update a later stage's brief when an earlier stage's finding changes the situation, rather than sending the original instructions unchanged, matters because a subagent given a stale brief will faithfully execute exactly what it was told, producing a technically correct answer to a question that stopped being the right one to ask several stages ago.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-20' }],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against Claude Code multi-subagent delegation (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-mcp-server-project-config',
    category: 'claude-code',
    title:
      "Scope Claude Code's .mcp.json to the project instead of trusting global defaults",
    description:
      'A configuration prompt for a project-level .mcp.json that names exactly which MCP servers this repository needs, keeps secrets out of a file that is often committed, and treats adding a new server as a reviewable trust decision rather than a default the whole team inherits silently.',
    promptText:
      "Produce a project-scoped .mcp.json for {{repo_root_path}}, plus the accompanying guidance a teammate opening this repo for the first time would need before approving it — a new MCP server is new code with tool-calling access running inside every session in this repo, not a passive config value.\n\nMCP SERVERS THIS PROJECT ACTUALLY NEEDS\n{{mcp_servers_needed}}\n\nHOW SECRETS FOR THESE SERVERS ARE HANDLED TODAY\n{{secrets_handling}}\n\nWHETHER EACH SERVER BELONGS AT PROJECT SCOPE OR USER SCOPE\n{{project_vs_user_scope}}\n\nWHAT ALREADY EXISTS\n{{existing_mcp_json}}\n\nPRODUCE\n1. The .mcp.json file itself, listing only the servers named above, each with its command, args, and any required env vars referenced by name using the dollar-brace environment-variable substitution syntax MCP configs expect — never a literal token, key, or connection string written directly into the file, since .mcp.json is typically committed to version control and a literal secret in it is a secret leaked to everyone with repository read access, including in the git history after the line is later removed.\n2. A short note per server on what tools it exposes and why this specific repository needs it — a server justified by 'might be useful' rather than a concrete task this repo actually does is a larger trust surface than the project needs and should be left out.\n3. A .env.example entry for every referenced variable, so a new contributor knows exactly what to set locally without guessing, and confirmation that the real .env is already gitignored.\n4. For each server, one line on {{trust_level}} — is this a first-party or well-known server, or something newer and less audited — since Claude Code will prompt for approval the first time a project's MCP servers are loaded, and that prompt is only useful if a teammate reading it actually knows what they are approving rather than clicking through out of habit.\n\nCONSTRAINTS\n- If {{existing_mcp_json}} already lists a server not named in the current needs list, flag it explicitly rather than silently dropping or silently keeping it — an unused server still listed is either dead configuration or a sign the needs list above is incomplete.\n- Do not add a server at project scope if {{project_vs_user_scope}} indicates it is really a personal preference, such as a developer's own note-taking tool, rather than something this specific codebase depends on — project scope means every teammate and every session in this repo inherits it, whether they want it or not.\n- State plainly which servers grant filesystem or network access beyond this repository, since that is the specific category of MCP tool access most worth a second look before approval.\n\nOUTPUT\nThe .mcp.json file, the .env.example additions, and the per-server trust notes, in that order.",
    variables: [
      {
        name: 'mcp_servers_needed',
        description: 'The MCP servers this specific project actually depends on.',
        example:
          'A Postgres MCP server for querying the staging database read-only during debugging, and a Figma MCP server for pulling design-token values referenced in the component library.',
        required: true,
      },
      {
        name: 'secrets_handling',
        description: 'How credentials for these servers are currently stored and passed.',
        example:
          'The Postgres connection string lives in a local .env file, never committed; each developer has their own read-only staging credential.',
        required: true,
      },
      {
        name: 'project_vs_user_scope',
        description: 'Which servers belong to everyone on this repo versus one person.',
        example:
          'Postgres and Figma both belong at project scope — everyone on this repo debugs against the same staging database and the same design file.',
        required: true,
      },
      {
        name: 'existing_mcp_json',
        description: 'What, if anything, is already configured, so drift can be flagged.',
        example: 'No .mcp.json exists yet in this repository.',
        required: false,
      },
      {
        name: 'trust_level',
        description: 'How well-audited or first-party each proposed server is.',
        example:
          'The Postgres server is a widely used, actively maintained community server; the Figma server is newer and worth a closer look at what it can write, not just read.',
        required: true,
      },
      {
        name: 'repo_root_path',
        description: 'Where the .mcp.json file should be created.',
        example: 'D:\\CLAUDE\\tools.scult.in',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['mcp', 'mcp-json', 'project-config', 'tool-integration', 'secrets-management'],
    whyItWorks:
      "A .mcp.json file checked into a repository is, functionally, a standing grant of tool-calling access to every future session opened against that repo, and Claude Code's own approval prompt on first load exists precisely because that grant is consequential enough to require a conscious decision rather than an inherited default nobody actually reviewed — this prompt's per-server trust note is what makes that one-time approval prompt meaningful instead of a formality clicked past out of habit. The dollar-brace substitution requirement is not a style preference, it is the difference between a config file safe to commit and one that is a credential leak the moment it is pushed, since a literal secret written into .mcp.json does not just risk exposure today, it persists in git history even after a later commit removes the line, which is exactly the kind of mistake that is trivial to avoid at authoring time and expensive to undo afterward. Distinguishing project scope from user scope matters because the two have genuinely different blast radii: a project-scoped server is inherited by every teammate and every session opened against this specific repository regardless of whether any individual developer wants it, while a user-scoped server only affects the one person who configured it, and treating a personal convenience tool as though it belongs to the whole team's shared configuration expands everyone's trust surface for a benefit only one person is using. Requiring a concrete justification per server, rather than accepting 'might be useful' as sufficient, targets the specific way tool sprawl accumulates in shared config files — each individual addition looks reasonable in isolation, and only in aggregate does a repository end up with several MCP servers nobody currently uses but everyone's session still loads and implicitly trusts. Flagging a server present in the existing file but absent from the current needs list catches exactly the same drift a stale CLAUDE.md fact would, applied to tool access instead of documentation: an unused grant left in place is not neutral, it is unreviewed standing capability that outlives the reason it was added.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-20' }],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against Claude Code project-scoped .mcp.json (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-incident-stack-trace-triage',
    category: 'claude-code',
    title:
      'Turn a raw production stack trace into a scoped root-cause hypothesis, not a guess',
    description:
      'An incident-triage prompt that has Claude Code correlate a raw stack trace against recent deploys and error-frequency data before proposing a root cause, and separates an immediate mitigation from a permanent fix so the two are never accidentally conflated under time pressure.',
    promptText:
      "You are triaging a live production incident from the evidence below, not writing a general bug fix. Speed matters, but a wrong root cause acted on quickly is worse than a right one reached ten minutes later, so do not skip a step to move faster.\n\nSTACK TRACE AND LOGS\n{{stack_trace}}\n\nRECENT DEPLOYS TO THIS SERVICE\n{{recent_deploys}}\n\nHOW OFTEN THIS IS HAPPENING\n{{error_frequency}}\n\nWHAT IS ACTUALLY AFFECTED\n{{affected_scope}}\n\nCAN THIS BE ROLLED BACK\n{{rollback_feasibility}}\n\nTRIAGE PROCESS\n1. Read the stack trace literally first — the exact function, file, and line where it actually threw, not the feature area it happens to belong to. State that line before speculating about anything upstream of it.\n2. Cross-reference the timing of {{error_frequency}} against {{recent_deploys}}. If the error's onset lines up with a specific deploy, that deploy is the leading hypothesis and must be named specifically, not gestured at as 'a recent change.' If the timing does not line up with any deploy, say so explicitly — an error with no deploy correlation points toward external factors such as a dependency's own outage, a data condition that only now occurs, or load, not toward the most recent commit by default.\n3. Search the codebase for the actual code at the failing line and trace backward far enough to state a mechanism, not just a location — what specific input or state condition reaches that line and causes it to fail, stated concretely enough that it could be reproduced deliberately.\n4. State a confidence level on the root cause — confirmed, likely, or speculative — and say exactly what additional evidence would move a likely or speculative hypothesis to confirmed, rather than presenting a guess with the same confidence as a verified fact.\n\nMITIGATION VERSUS FIX — KEEP THESE SEPARATE\nPropose the fastest safe way to stop the bleeding right now, given {{rollback_feasibility}}, and separately propose the actual permanent fix for the mechanism identified in step three. Do not present the mitigation as the fix, and do not skip the mitigation while working out the fix if the error is actively affecting {{affected_scope}} right now.\n\nCONSTRAINTS\n- Do not propose a fix for a mechanism you have not stated with the confidence label above at likely or confirmed.\n- Do not treat a stack trace's top frame as the necessarily wrong line — sometimes the top frame is exactly where the bug lives; do not manufacture a more complicated theory because the obvious one feels too simple.\n- If multiple deploys landed close together, name each one and which specific change in each is the more plausible suspect, rather than blaming the batch as a whole.\n\nOUTPUT\nRoot cause with confidence label, mitigation, permanent fix, and what would raise confidence if it is not already confirmed.",
    variables: [
      {
        name: 'stack_trace',
        description: 'The actual error and stack trace as captured, unedited.',
        example:
          "TypeError: Cannot read properties of undefined (reading 'total') at calculateShipping (checkout/shipping.ts:42), 340 occurrences in the last hour, all on the /checkout/review endpoint.",
        required: true,
      },
      {
        name: 'recent_deploys',
        description: 'What shipped recently to this service, in order, with timestamps.',
        example:
          "14:02 UTC — merged 'add international shipping zones' to checkout/shipping.ts; 09:15 UTC — unrelated deploy to the auth service.",
        required: true,
      },
      {
        name: 'error_frequency',
        description: 'When this started and how often it is occurring now.',
        example:
          'Zero occurrences before 14:05 UTC today, then a steady 5 to 6 per minute since, matching a spike right after the 14:02 deploy.',
        required: true,
      },
      {
        name: 'affected_scope',
        description: 'Who or what is actually impacted right now.',
        example:
          'Only checkouts where the shipping address is outside the newly added international zones list; domestic checkout is unaffected.',
        required: true,
      },
      {
        name: 'rollback_feasibility',
        description:
          'Whether reverting the suspected deploy is a realistic immediate option.',
        example:
          'The 14:02 deploy can be reverted with a single revert commit and redeploy, roughly 4 minutes end to end.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'incident-response',
      'debugging',
      'stack-trace',
      'root-cause-analysis',
      'production',
    ],
    whyItWorks:
      "Under genuine production time pressure, a model's fastest path to a plausible-sounding answer is to pattern-match the error message to a familiar bug category and propose a fix for that category, which is precisely how an incident gets mitigated for the wrong reason — the fix looks reasonable, the error rate might even drop by coincidence, and the actual mechanism ships unaddressed to resurface later under slightly different conditions. Requiring the deploy-timing cross-reference before any hypothesis is stated exploits the single most reliable signal available during an incident: production code that was stable yesterday and is throwing today changed for a reason, and that reason is disproportionately likely to be something that shipped in the window the error's onset actually lines up with, which is a checkable fact rather than an inference from the error message's vocabulary alone. Separating mitigation from permanent fix as two explicitly distinct outputs matters because the two have different acceptable error bars — a mitigation only needs to plausibly stop the immediate bleeding and can be safely wrong about the deeper mechanism, while a permanent fix that is wrong about the mechanism will not actually prevent recurrence, and collapsing the two into one recommendation risks either delaying an urgently needed mitigation while root-causing is finished, or shipping an under-verified permanent change under the same time pressure that a quick mitigation would have absorbed instead. The confidence label — confirmed, likely, or speculative — forces the model to distinguish what it has actually traced through code from what it is inferring from correlation alone, and naming what evidence would raise that confidence gives a human responder a concrete next action rather than a hedge with no path forward. The instruction not to manufacture a more complicated theory when the obvious one from the top stack frame is simple exists because incident response has its own bias in the opposite direction from patient debugging — a stack trace's literal top frame is very often exactly where the defect lives, and a model trained to look thorough can talk itself into a more elaborate root cause than the evidence actually supports, wasting the exact minutes an incident cannot spare.",
    exampleOutput:
      'Root cause (confirmed): calculateShipping in checkout/shipping.ts:42 reads zone.total on a zone lookup that returns undefined for any address outside the newly added international zones list added in the 14:02 deploy; the lookup was never given a fallback for an address matching no configured zone.\nMitigation: revert the 14:02 deploy now — 4 minutes to redeploy, restores domestic-only shipping which was working correctly before.\nPermanent fix: add an explicit not-found branch in the zone lookup that either falls back to a default rate or returns a clear checkout error, then reintroduce international zones behind that guard.',
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-21' }],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Claude Code incident triage (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-database-migration-safety-review',
    category: 'claude-code',
    title:
      'Review a database migration for what it does to production before it runs there',
    description:
      "A pre-execution review prompt that checks a migration script's locking behavior, backward compatibility during a rolling deploy, and reversibility against the actual table size and deploy strategy, instead of judging it purely on SQL syntax correctness.",
    promptText:
      "Review this migration for what it will actually do to a live production database, not just whether the SQL is syntactically valid. A migration that is syntactically perfect and locks a hot table for eight minutes during business hours is still a bad migration.\n\nMIGRATION SCRIPT\n{{migration_script}}\n\nTABLE SIZE AND TRAFFIC CONTEXT\n{{table_size_context}}\n\nDEPLOY STRATEGY\n{{deploy_strategy}}\n\nDATABASE ENGINE\n{{db_engine}}\n\nROLLBACK PLAN IF THIS NEEDS TO BE UNDONE\n{{rollback_plan}}\n\nCHECK EACH OF THESE, IN ORDER\n1. Locking behavior — for {{db_engine}} specifically, does this exact statement take a lock that blocks reads, blocks writes, or blocks both, and for how long is that lock plausibly held against a table of the size described above? A statement that is instant on a thousand-row table can hold a blocking lock for minutes on a hundred-million-row one, and the two cases require citing the actual mechanism, not a generic 'this should be fine.'\n2. Backward compatibility during the deploy window — under {{deploy_strategy}}, old application code and new application code both run against the database simultaneously for some period. Does the schema after this migration still satisfy every query the old code will still issue during that window? A column drop or a rename that the new code expects but the old code does not know about is the single most common way a rolling deploy causes an outage that a migration reviewed in isolation would never catch.\n3. Data loss risk — does this migration drop, truncate, or irreversibly transform any column or row, and if so, is there a real, tested way to get that data back if the migration turns out to be wrong, or is the loss permanent the moment it runs?\n4. Reversibility — does {{rollback_plan}} actually work against the state the database will be in after this migration ran partway and then failed, not just after it ran to completion? A rollback plan tested only against the fully-succeeded case does not tell you what happens if this fails at row four million of a five-million-row backfill.\n5. Index and constraint changes — does adding an index or constraint here lock the table for the duration of the build, and does this database engine support building it concurrently or online instead, if that option exists and was not used.\n\nOUTPUT FORMAT\nFor each of the five checks: SAFE, RISKY, or BLOCKING, with the specific mechanism, not a generic caution. End with a recommended execution plan — run as-is, run with an explicit statement timeout and lock-wait retry, split into multiple smaller migrations, or do not run this until it is rewritten — and say plainly which of the five checks drove that recommendation.\n\nDo not soften a BLOCKING finding into a RISKY one because the migration is otherwise well-written; the two ratings track different things, and this only tracks whether it is safe to run against this specific database in this specific state.",
    variables: [
      {
        name: 'migration_script',
        description: 'The actual migration SQL or ORM migration file, in full.',
        example:
          "ALTER TABLE orders ADD COLUMN loyalty_tier VARCHAR(20) NOT NULL DEFAULT 'standard'; followed by a backfill UPDATE orders SET loyalty_tier = ... in the same transaction.",
        required: true,
      },
      {
        name: 'table_size_context',
        description: 'How large the affected table actually is, and its traffic profile.',
        example:
          'orders has 42 million rows and receives roughly 200 writes per minute during business hours, none at night.',
        required: true,
      },
      {
        name: 'deploy_strategy',
        description:
          'How the application is deployed, since this affects compatibility windows.',
        example:
          'Rolling deploy across four instances, roughly 6 minutes for all instances to pick up new code, old and new code both serve traffic during that window.',
        required: true,
      },
      {
        name: 'db_engine',
        description:
          'The specific database engine and version, since lock behavior differs by engine.',
        example: 'PostgreSQL 16',
        required: true,
      },
      {
        name: 'rollback_plan',
        description: 'What would actually be done if this migration needs to be undone.',
        example:
          'A corresponding down-migration exists that drops the column; it has been tested against a pre-migration snapshot but not against a partially-completed backfill.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['database', 'migrations', 'schema-review', 'production-safety', 'sql'],
    whyItWorks:
      "A migration script can be entirely correct SQL and still be the wrong thing to run against a specific production table, because syntax correctness and operational safety are answered by completely different questions — the first is about the statement in isolation, the second is about that exact statement against this exact table's size, this exact traffic pattern, and this exact deploy strategy, none of which the SQL itself encodes. Naming the database engine explicitly matters because lock behavior for what looks like the same operation genuinely differs by engine and version — an ADD COLUMN with a default value is a fast metadata-only change on a recent PostgreSQL version but was historically a full table rewrite on older releases and remains a full rewrite on some other engines, so a review that does not pin the engine is answering a question that has no single correct answer across the space of databases it could apply to. The backward-compatibility check during a rolling deploy window catches a failure mode that is invisible if the migration is reviewed as a standalone artifact: the actual danger period is not before or after the deploy, it is the middle, when old code that expects the previous schema and new code that expects the new schema are both live against the same database simultaneously, and a migration that looks completely fine at either endpoint can still break every request served by the stale instances during that overlap. Requiring the rollback plan to be checked against a partially-completed failure state, not just the fully-succeeded case, targets a specific optimism bias in how rollback plans get tested — a down-migration exercised only after a clean forward run tells you nothing about what happens if the forward migration fails at row four million of five, which is exactly the moment a real rollback plan is actually needed. Refusing to soften a BLOCKING finding because the migration is otherwise well-written matters because these two ratings are not on the same axis at all — a migration can be well-written and still be exactly the wrong thing to run against a hundred-million-row table during business hours, and a review that lets code quality bleed into a safety rating quietly launders a genuinely dangerous operation into something that reads as merely worth a second look.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-21' }],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Claude Code migration review (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-monorepo-package-boundary-scoping',
    category: 'claude-code',
    title: 'Keep Claude Code inside one monorepo package instead of reaching across it',
    description:
      'A scope-lock prompt for monorepo work that names the exact package boundary in play, treats a shared-package edit as a decision requiring explicit surfacing rather than a silent side effect, and distinguishes a genuine cross-boundary need from a workaround for a problem that actually belongs inside the target package.',
    promptText:
      "You are working inside {{target_package}} of a {{monorepo_tool}} monorepo. Every edit in this task should stay inside that package's own directory unless this prompt explicitly says otherwise — a monorepo's whole point is that packages have a boundary, and treating that boundary as optional the moment it is inconvenient defeats it for everyone else depending on the packages you would silently cross into.\n\nTASK\n{{task_description}}\n\nSHARED PACKAGES THAT ARE HANDS-OFF FOR THIS TASK\n{{shared_packages_hands_off}}\n\nHOW A GENUINE CROSS-BOUNDARY NEED SHOULD BE HANDLED\n{{cross_boundary_exception_process}}\n\nPACKAGE MANIFEST AND DEPENDENCIES TO CONFIRM AGAINST\n{{package_manifest_reference}}\n\nBEFORE EDITING\n1. Read {{package_manifest_reference}} to confirm exactly what {{target_package}} already depends on and what already depends on it — a change inside this package that alters its exported shape can break every consumer named there, even without touching a single file outside this package's own directory.\n2. If completing the task as described appears to require changing something inside a package listed in {{shared_packages_hands_off}}, stop before making that change. State specifically why the task cannot be completed without it, and follow {{cross_boundary_exception_process}} rather than making the shared-package edit and explaining it afterward.\n3. Distinguish a genuine cross-boundary requirement from a workaround for something that actually belongs inside {{target_package}} — if a shared type needs a new field only this package will ever populate, the more correct fix is very often extending {{target_package}}'s own local type or adding an adapter at the boundary, not widening a type every other consumer of the shared package now also carries.\n\nWHILE WORKING\n- Do not add a new dependency from {{target_package}} on another package in this monorepo without stating it explicitly, even if that package is already present elsewhere in the workspace — a new internal dependency edge changes this package's build graph and its allowed publish order, and that is a structural decision, not an implementation detail.\n- Do not modify a shared package's test fixtures to make this package's tests pass; if this package's own tests fail against a shared package's current behavior, that is a signal to look at, not a fixture to edit around.\n- Do not run a build or a test command scoped to the whole monorepo when {{monorepo_tool}} supports scoping it to {{target_package}} alone — a whole-workspace command is slower, and a failure it surfaces in an unrelated package can be mistaken for a regression this task actually caused when it is not.\n\nIF THE TASK GENUINELY CANNOT BE FINISHED WITHOUT CROSSING THE BOUNDARY\nSay so explicitly before writing any cross-boundary edit, name the exact file and export involved, and wait for the exception process above to actually approve it — do not treat a self-judged 'this one is obviously fine' as equivalent to that approval, since that judgment is precisely what the exception process exists to check independently rather than leave to whichever session happens to be inside the boundary at the time.\n\nOUTPUT\nThe change, scoped to {{target_package}} unless an exception was explicitly approved through the process above, and a one-line confirmation of exactly which packages, if any beyond the target, were touched and why.",
    variables: [
      {
        name: 'target_package',
        description: 'The exact package this task is scoped to.',
        example: 'packages/invoice-pdf',
        required: true,
      },
      {
        name: 'monorepo_tool',
        description:
          'The monorepo tooling in use, since boundary enforcement differs by tool.',
        example: 'a pnpm workspaces monorepo managed with Turborepo',
        required: true,
      },
      {
        name: 'task_description',
        description: 'The task to complete inside the target package.',
        example:
          'Add a per-line-item tax breakdown to the generated invoice PDF, using data already present on the Invoice type.',
        required: true,
      },
      {
        name: 'shared_packages_hands_off',
        description: 'Packages this task must not modify, even indirectly.',
        example:
          'packages/shared-types and packages/design-system are both consumed by four other apps in this monorepo and are hands-off for this task.',
        required: true,
      },
      {
        name: 'cross_boundary_exception_process',
        description: 'What to do if a shared-package change genuinely becomes necessary.',
        example:
          'Stop and describe the specific field or export needed, then wait for explicit approval before touching packages/shared-types — do not make the change unilaterally even if it looks small.',
        required: true,
      },
      {
        name: 'package_manifest_reference',
        description:
          'Where to check this package’s actual dependency graph before editing.',
        example:
          "packages/invoice-pdf/package.json for its own dependencies, and a workspace-wide grep for '@repo/invoice-pdf' to see who consumes it.",
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'monorepo',
      'package-boundaries',
      'scope-control',
      'turborepo',
      'workspace-isolation',
    ],
    whyItWorks:
      "A monorepo's package boundary is a real dependency-graph fact, not a folder convention — a change to a shared package's exported shape can break every consumer listed in the workspace's own dependency graph, and that graph is exactly the kind of structural fact a model can actually check by reading manifest files and searching for import sites, rather than something it can reason about from general software principles alone, which is why requiring the manifest check before any edit is not boilerplate, it is the one step that turns 'this package boundary exists' from an assumption into a verified fact about this specific workspace. The distinction between a genuine cross-boundary need and a workaround for a problem that actually belongs inside the target package matters because the two look identical from inside a single task: widening a shared type to add a field only one package will ever populate is the path of least resistance in the moment, and it is also exactly the kind of change that turns a shared package into a dumping ground of increasingly specific, package-specific concessions that every other consumer now silently carries forward regardless of whether they use that field at all. Naming the exception process explicitly, rather than leaving cross-boundary changes to individual judgment, matters because a shared package's actual risk is cumulative across many separate tasks, each of which might reasonably conclude in isolation that one small shared edit is fine — the individual decision is rarely wrong on its own terms, but a shared package that has absorbed a dozen such individually-reasonable edits from a dozen different tasks, none of which went through the same review, has usually drifted far from what any single reviewer would have approved if asked to evaluate the sum of them at once. Refusing to edit a shared package's test fixtures to make the target package's own tests pass targets a specific and easy-to-miss form of scope creep: a failing test against a shared package's current, correct behavior is information about a real incompatibility, and editing the fixture to make it pass does not resolve that incompatibility, it just hides the evidence of it from whichever test suite happens to run next.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Claude Code in a pnpm/Turborepo monorepo (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-screenshot-driven-ui-bug-fix',
    category: 'claude-code',
    title: 'Fix a UI bug from a pasted screenshot instead of a vague text description',
    description:
      'A visual-debugging prompt built around a pasted image of the broken UI, forcing Claude Code to name the specific visual discrepancy and locate the responsible component before editing, and to close the loop with a follow-up screenshot comparison instead of declaring the fix done from the diff alone.',
    promptText:
      "An image is attached showing the actual broken state of the UI. Look at it directly before reading anything else below — the screenshot is the primary evidence here, not a supporting detail to the text description.\n\nWHAT THE SCREENSHOT SHOWS\n{{screenshot_description}}\n\nWHAT IT SHOULD LOOK LIKE INSTEAD\n{{expected_visual}}\n\nVIEWPORT AND CONTEXT THE SCREENSHOT WAS TAKEN AT\n{{viewport_context}}\n\nCOMPONENT SUSPECTS, IF ANY ARE ALREADY KNOWN\n{{component_suspects}}\n\nPROCESS\n1. Describe back, in your own words, the specific visual discrepancy you actually see in the image — not a restatement of the text description above, an independent read of the pixels themselves: what element, what property, roughly how far off, at what point in the layout. If what you see does not match {{screenshot_description}}, say so before proceeding rather than silently trusting the text over your own read of the image.\n2. Locate the component and the specific CSS or layout rule responsible, citing the real file and selector, not a guess based on what usually causes this category of visual bug. If {{component_suspects}} names a candidate, check it first, but do not stop at the first plausible-looking rule if it does not actually explain the specific discrepancy described in step one.\n3. Before editing, state the specific property change that should fix it and, just as important, whether that same rule affects any other component or breakpoint, since a fix scoped to a shared class or a global selector can resolve the reported instance while visually changing something nobody reported as broken.\n4. Make the change, scoped to the specific rule identified, not a broader rewrite of the surrounding component.\n\nAFTER THE CHANGE\n{{browser_devtools_access}}\nIf a way to re-check the rendered result exists in this session, capture it and compare directly against {{expected_visual}} before declaring the fix complete — a diff that looks correct in the source is not the same evidence as a rendered result that actually matches, and CSS in particular has enough interaction effects between an edited rule and its surrounding cascade that reading the changed line is not sufficient proof on its own.\nIf no way to re-render exists in this session, say so explicitly and name exactly what a human should visually check before merging, rather than presenting the change as visually verified when it was not.\n\nCONSTRAINTS\n- Do not fix the general area if you cannot state the specific discrepancy; a vague 'this looks better' is not an acceptable basis for a change.\n- Do not assume the screenshot's viewport is the only one affected — check whether the same rule applies at other breakpoints named in {{viewport_context}}.",
    variables: [
      {
        name: 'screenshot_description',
        description:
          'What the pasted screenshot is showing, in the reporter’s own words.',
        example:
          'The pricing table on the /pricing page has its middle "Pro" plan card overlapping the card to its right by about 20 pixels, only at the tablet breakpoint.',
        required: true,
      },
      {
        name: 'expected_visual',
        description: 'What the correct rendered result should look like instead.',
        example:
          'All three plan cards should sit in an evenly spaced row with no overlap, matching how they already render correctly on desktop.',
        required: true,
      },
      {
        name: 'viewport_context',
        description: 'The exact viewport and any other breakpoints worth checking.',
        example:
          'Screenshot taken at 768px width in Chrome; also check 820px and 900px, the other two breakpoints this component defines.',
        required: true,
      },
      {
        name: 'component_suspects',
        description: 'Any component already suspected of causing the issue, if known.',
        example:
          'Likely PricingCard.tsx or the shared .grid-3-col utility class it uses, but not confirmed.',
        required: false,
      },
      {
        name: 'browser_devtools_access',
        description:
          'Whether this session has a way to actually re-render and re-check the fix.',
        example:
          'A local dev server is running at localhost:3000 and can be checked via the browser tools available in this session.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['visual-debugging', 'screenshots', 'ui-bugs', 'css', 'frontend'],
    whyItWorks:
      "A text-only description of a visual bug is a lossy translation of exactly the kind of detail that actually matters for fixing it — 'the cards overlap' says nothing about which edge overlaps which, by how much, or at which breakpoint, while the pasted screenshot Claude Code can read directly contains all of that as pixels a vision-capable model can actually inspect, which is why the process forces an independent read of the image itself rather than treating the accompanying text as a complete substitute for looking. Requiring that independent description before proceeding, and requiring a flag if it disagrees with the supplied text, catches a specific and common failure: a bug report's own text description is itself sometimes wrong or imprecise about what is actually happening, written by someone under time pressure who noticed something was off without precisely characterizing it, and a model that defers entirely to a possibly-imprecise text description will confidently fix the wrong thing with full confidence. Naming the specific CSS rule or layout mechanism responsible, rather than accepting the first plausible-looking candidate, matters because visual bugs disproportionately live in shared classes and cascading rules whose effect at one breakpoint is not obvious from reading the rule in isolation — a fix that resolves the reported card overlap by editing a utility class shared across a dozen other components can simultaneously and silently break something nobody screenshotted because nobody happened to look at that other component today. The instruction to close the loop with an actual re-render, when a way to do so exists in the session, targets the gap between 'the diff looks like it should fix this' and 'the rendered page actually looks correct now' — CSS is one of the few areas of a codebase where reading the changed line is a genuinely weak proxy for the visual outcome, since cascade interactions, specificity, and inherited properties from parent elements can all produce a rendered result that differs from what the diff alone would suggest. Being explicit when no re-render is possible, rather than presenting the change as visually verified regardless, preserves the actual distinction between 'I changed the rule that should cause this' and 'I confirmed the visual result matches', which is exactly the distinction a screenshot-driven bug report was filed to get closure on in the first place.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Claude Code with pasted-image input (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-readme-api-doc-generation',
    category: 'claude-code',
    title: 'Generate docs that match what the code actually does, not what it should do',
    description:
      'A documentation-generation prompt that derives every claim from real exported signatures, behavior, and tests rather than from the intent behind the code, and forces an explicit flag on any doc statement the reviewer cannot verify against the code itself.',
    promptText:
      "You are writing documentation derived from what this code actually does, verified against its real signatures, behavior, and tests — not from what a comment or a variable name suggests it is supposed to do. A docstring or a variable name is a claim about intent, not proof of behavior, and this documentation should not repeat an intent claim as fact without checking it against the implementation.\n\nSCOPE\n{{doc_scope}}\n\nEXISTING DOCUMENTATION TO RECONCILE AGAINST\n{{existing_readme}}\n\nPUBLIC API SURFACE TO DOCUMENT\n{{public_api_entry_points}}\n\nAUDIENCE\n{{audience}}\n\nFORMAT CONVENTION TO FOLLOW\n{{doc_format_convention}}\n\nPROCESS\n1. For every entry point in {{public_api_entry_points}}, read its actual implementation, not just its name or an existing comment above it, and confirm parameter types, return shape, and error behavior against the real code and, where they exist, its tests — a test that exercises a specific edge case is stronger evidence of real behavior than a docstring making the same claim, since the test is checked by CI and the docstring is not.\n2. If {{existing_readme}} already documents this surface and the documentation matches what the code actually does, keep it, but verify it rather than assuming it is still accurate — code drifts from its own documentation constantly, and an existing doc's presence is not evidence of its current correctness.\n3. If the existing documentation and the actual code disagree, flag the discrepancy explicitly rather than silently picking one side to write down as though there was never a conflict — state both what the doc claims and what the code actually does, so a human can decide whether the doc or the code is the one that is wrong.\n4. Distinguish the public API surface, meant for external or cross-package consumption, from internal implementation detail; document the former in full, and only mention the latter where it materially affects how the public surface should be used.\n\nCONSTRAINTS\n- Every parameter documented must state its real type and whether it is actually required at runtime, not just what the type signature promises, since a type can promise a value is present while the actual runtime check treats it as optional with a fallback.\n- Do not describe a function's purpose using only the language already in its name or an existing comment; state what it verifiably does, and if that happens to match the name, that is confirmation, not a reason to skip the verification step.\n- Calibrate depth and vocabulary to {{audience}} — an internal engineering audience needs different detail than an external package consumer who will never see this codebase's internals.\n- Follow {{doc_format_convention}} exactly for headers, code-block style, and section order, rather than defaulting to a generic documentation template that does not match how the rest of this project's docs already read.\n\nOUTPUT\nThe documentation in full, following the required format, with any existing-doc-versus-code discrepancy called out in a separate short section at the end rather than silently resolved.",
    variables: [
      {
        name: 'doc_scope',
        description: 'What is being documented — a module, a package, or a full README.',
        example:
          'The public API of the lib/prompts/ module: getPromptCategory, searchPrompts, and getPromptsByTag.',
        required: true,
      },
      {
        name: 'existing_readme',
        description:
          'The current documentation, if any, to reconcile the new output against.',
        example:
          'The current README says searchPrompts returns results ranked by relevance; there is no test confirming ranking behavior, only that it filters by matching tags.',
        required: false,
      },
      {
        name: 'public_api_entry_points',
        description: 'The exact exported functions, classes, or endpoints to document.',
        example:
          'getPromptCategory(slug), searchPrompts(query, options), getPromptsByTag(tag) — all exported from lib/prompts/index.ts.',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who this documentation is actually written for.',
        example:
          'Other engineers on this team integrating the prompt library into a new page — assume TypeScript fluency, no assumption of familiarity with this specific module.',
        required: true,
      },
      {
        name: 'doc_format_convention',
        description:
          'The formatting standard already used elsewhere in this project’s docs.',
        example:
          'Match the existing style in README.md: H2 per function, a fenced TypeScript signature block, then Parameters, Returns, Example in that order.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['documentation', 'readme', 'api-docs', 'technical-writing', 'code-accuracy'],
    whyItWorks:
      "The default failure mode of AI-generated documentation is not fabrication out of nowhere, it is fluent paraphrase of the code's own names and comments presented with the same confidence as verified fact — a function named validateEmail with a docstring claiming it checks format gets documented as doing exactly that, even when the actual implementation only checks for the presence of an @ character and nothing else, because the model is restating intent-bearing signals rather than tracing the real logic. Explicitly ranking a passing test above a docstring as evidence forces a real hierarchy of trust the model would not otherwise apply on its own, since a docstring and a test read as equally authoritative text unless something specifically tells the model that only one of them is actually checked by anything — a test asserting a specific edge case's output is empirical, in the narrow sense that CI actually runs it, while a comment claiming the same thing is unverified prose that could have gone stale the moment the function's logic changed underneath it. Requiring an explicit discrepancy flag when existing documentation disagrees with the actual code, rather than silently resolving the conflict one way or the other, matters because a documentation-generation pass that quietly overwrites a stale doc with new, correct text erases the very evidence a human would need to notice that the code's behavior has drifted from what it was designed to do — sometimes the doc is the one that is stale, but sometimes the doc was right and a later change to the code introduced an unintentional regression, and only a human with context on the original intent can actually tell those two cases apart. Distinguishing public surface from internal detail matters because documenting everything at equal depth wastes the reader's attention on implementation specifics they never needed and, worse, creates a maintenance burden where a purely internal refactor now also requires a documentation update for something nobody outside this module was ever meant to depend on. Calibrating to the audience variable explicitly matters for the same reason it matters in an onboarding walkthrough: Claude Code has no independent way to know who will read this beyond what the prompt tells it, so the audience field is the only channel through which the level of assumed background actually gets set correctly rather than defaulting to whatever generic level a documentation template happens to imply.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-23' }],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Claude Code documentation generation (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-github-actions-claude-code-action-setup',
    category: 'claude-code',
    title:
      "Wire GitHub's claude-code-action without granting it more authority than the job needs",
    description:
      'A workflow-authoring prompt for anthropics/claude-code-action that scopes the triggering condition, the GITHUB_TOKEN permissions block, and the allowed-tools config to exactly what the automated job does, since an unattended GitHub Actions run has no ask step to fall back on if a permission is too broad.',
    promptText:
      "Write a GitHub Actions workflow YAML using anthropics/claude-code-action for this specific automated job, scoped as narrowly as the job allows — an unattended run in CI has no human present to answer a permission prompt, so anything left too broad here executes silently rather than pausing for confirmation.\n\nWHAT SHOULD TRIGGER THIS WORKFLOW\n{{trigger_condition}}\n\nWHAT THIS WORKFLOW IS ACTUALLY RESPONSIBLE FOR\n{{workflow_scope}}\n\nGITHUB PERMISSIONS THIS JOB NEEDS\n{{repo_permissions_needed}}\n\nSECRETS THIS JOB REQUIRES\n{{secrets_required}}\n\nRUNNER ENVIRONMENT\n{{runner_environment}}\n\nPRODUCE\n1. The trigger block, matching {{trigger_condition}} precisely — if this should only fire on an @claude mention inside an issue or pull-request comment, scope it to that event and that exact string, not a broader event type that would also fire on unrelated activity and consume budget or take action nobody asked for.\n2. The permissions block for GITHUB_TOKEN, granting only what {{repo_permissions_needed}} actually requires — contents: read if the job only reads code, pull-requests: write only if it must actually leave a comment or push a commit, never permissions: write-all as a default to avoid enumerating the real list.\n3. The claude-code-action step itself, with allowed-tools scoped to {{workflow_scope}} — a job whose responsibility is reviewing a diff and posting a comment should not carry Bash access broad enough to also modify files, even though the underlying action supports it, because a review job that can silently also edit code is no longer just a review job.\n4. The secrets reference for {{secrets_required}}, pulled from repository or organization secrets, never hardcoded in the workflow file, and a note on which specific secret this job actually needs versus which secrets exist in this repository more broadly that it should not have access to.\n\nCONSTRAINTS\n- If {{workflow_scope}} indicates this job should never push a commit or modify a file directly, do not grant contents: write or Edit/Write tool access even if a future version of this job might want it — scope for what this job does today, and revisit the scope explicitly when the job's responsibility actually changes, rather than provisioning ahead of need.\n- State what happens if {{trigger_condition}} fires on a pull request from a fork — a workflow with write permissions triggered by an external, untrusted contributor's PR is a materially different risk than the same workflow triggered only by a maintainer's own comment, and this distinction needs to be addressed explicitly, not left to whatever GitHub's default behavior happens to be.\n- Confirm {{runner_environment}} matches what this job actually needs — a job that only calls the GitHub API and posts a comment does not need the same runner image as one that installs dependencies and runs a full build.\n\nOUTPUT\nThe complete workflow YAML, followed by one paragraph stating exactly what this workflow can and cannot do to this repository, written for a reviewer approving it for the first time.",
    variables: [
      {
        name: 'trigger_condition',
        description: 'The exact event that should invoke this workflow.',
        example:
          'An issue_comment or pull_request_review_comment containing the exact string @claude, on issues and PRs only, not on every push.',
        required: true,
      },
      {
        name: 'workflow_scope',
        description:
          'What this specific automated job is responsible for doing, and not doing.',
        example:
          'Read the PR diff and post a structured review comment back to the PR; it must never push a commit or modify a file directly.',
        required: true,
      },
      {
        name: 'repo_permissions_needed',
        description: 'The exact GITHUB_TOKEN permissions this job requires.',
        example:
          'contents: read, pull-requests: write (to post the review comment), nothing else.',
        required: true,
      },
      {
        name: 'secrets_required',
        description: 'Which secrets this job needs, referenced by name.',
        example:
          'ANTHROPIC_API_KEY, stored as a repository secret, not an organization-wide one.',
        required: true,
      },
      {
        name: 'runner_environment',
        description: 'The runner image and any setup this job actually needs.',
        example:
          'ubuntu-latest, no dependency installation needed since this job only reads the diff via the GitHub API.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'GitHub Actions'],
    tags: [
      'github-actions',
      'ci-cd',
      'claude-code-action',
      'automation',
      'workflow-permissions',
    ],
    whyItWorks:
      "A GitHub Actions workflow using claude-code-action is functionally an unattended agent with whatever GITHUB_TOKEN permissions the workflow file grants it, and unlike an interactive Claude Code session, there is no ask-permission fallback available if a scope turns out to be broader than the job needs — a workflow permissions block is enforced by GitHub's own runtime before the job even starts, so an overly broad grant is not a risk that might materialize under the wrong prompt, it is a capability the job has for the entire duration of every run regardless of what the underlying task actually required that particular time. Scoping allowed-tools to the job's actual responsibility, rather than the full set the action supports, matters for the same reason a subagent's tool grant matters: a review job that can also silently edit files has quietly become something other than a review job, and the distinction only shows up the one time the model's own reasoning, under whatever prompt triggered that run, decides an edit is warranted — at which point the workflow's permissions determine whether that decision can actually take effect, not the job's stated purpose in a README nobody re-reads before every run. The fork-PR distinction is the single most consequential branch in this entire setup and is easy to omit if a workflow is only ever tested against a maintainer's own comments: GitHub's default behavior around secrets and token permissions for workflows triggered by fork pull requests exists specifically because an external contributor's PR is untrusted code by definition, and a workflow with write permissions that fires on that trigger without accounting for it is a substantially different risk than the identical YAML triggered only by a trusted maintainer's comment, even though the workflow file itself might look nearly the same either way. Referencing secrets by name from repository secrets rather than hardcoding anything is the same discipline that applies to .mcp.json, applied to a context where the consequence of getting it wrong is worse — a workflow file lives in version control and is visible to anyone with read access to the repository, including, for a public repository, anyone on the internet.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-23' }],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against anthropics/claude-code-action in GitHub Actions (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-cost-token-usage-budget-review',
    category: 'claude-code',
    title:
      "Audit where a Claude Code session's cost actually went before setting a budget",
    description:
      "A usage-audit prompt that breaks down a session's actual token and cost data by category — context reads, tool-result bloat, repeated file access — before proposing a concrete reduction lever and a going-forward budget, instead of guessing at savings from vague impressions of the session.",
    promptText:
      "You are auditing where the cost in this usage data actually went, not estimating it from a general impression of how the session felt. A specific breakdown by category is the only thing that makes a proposed reduction lever trustworthy rather than a guess dressed as an optimization.\n\nUSAGE DATA\n{{usage_report_data}}\n\nWHAT KIND OF TASK THIS SESSION WAS DOING\n{{task_type}}\n\nCURRENT BUDGET TARGET, IF ONE EXISTS\n{{current_budget_target}}\n\nWHERE THE COST IS SUSPECTED TO BE CONCENTRATED\n{{high_cost_suspects}}\n\nHOW OFTEN THIS KIND OF SESSION RUNS\n{{session_frequency}}\n\nANALYSIS\n1. Break down the usage data into distinct categories: initial context load, tool-result content returned to the model (file reads, command output, search results), the model's own generated output, and any cache-read versus cache-write split if the data distinguishes them. State the actual token count and cost share per category, not just a total.\n2. For the largest category, identify the specific mechanism driving it — a single large file read repeatedly across many turns instead of once, a search tool returning far more matched content than was actually needed, a subagent's full internal output getting summarized inefficiently rather than distilled — and cite the specific turn or tool call in the data where this is visible, not a general statement that 'context use was high.'\n3. Check {{high_cost_suspects}} against what the data actually shows — confirm or rule out each one specifically rather than assuming the suspicion was correct just because it was already flagged going in.\n4. Propose one or two concrete, specific reduction levers tied directly to the mechanism identified in step two — narrowing a glob pattern, moving a noisy verification step into an isolated subagent, caching a repeatedly-read file's content instead of re-reading it, reducing an overly broad search's result count — not a generic suggestion to 'be more concise' that does not name what would actually change.\n5. State what cost or token reduction each lever would plausibly achieve, and how confident that estimate is, given the actual data available.\n\nBUDGET\nGiven {{current_budget_target}} and {{session_frequency}}, propose a specific per-session budget or token ceiling going forward, and one clear signal that should trigger a review if that budget is exceeded — not a vague aspiration to spend less, a number and a trigger condition.\n\nCONSTRAINTS\n- Do not propose a reduction lever that would degrade the actual task outcome for {{task_type}} without naming that tradeoff explicitly — a cheaper session that produces a worse result is not automatically the better outcome.\n- If the data does not actually support attributing cost to a specific mechanism, say so rather than assigning a plausible-sounding cause to a category just because the total for it was large.\n\nOUTPUT\nThe category breakdown, the root-mechanism findings, the proposed levers with estimated impact, and the going-forward budget with its trigger condition.",
    variables: [
      {
        name: 'usage_report_data',
        description: 'The actual token and cost data for the session being audited.',
        example:
          'Session used 340K input tokens, 12K output tokens, cost $4.85; 210K of the input tokens came from tool results, largely repeated reads of a single 8,000-line generated file across 11 separate turns.',
        required: true,
      },
      {
        name: 'task_type',
        description: 'What kind of work this session was actually doing.',
        example:
          'A multi-file refactor across the reports module, run interactively over about ninety minutes.',
        required: true,
      },
      {
        name: 'current_budget_target',
        description:
          'Any existing cost expectation for this kind of session, if one exists.',
        example:
          'No formal budget exists yet; sessions like this have informally run $2 to $3 in the past.',
        required: false,
      },
      {
        name: 'high_cost_suspects',
        description:
          'Where the cost is already suspected to be concentrated, to check against the data.',
        example:
          'Suspect the large generated report fixture file is being re-read on every turn instead of once.',
        required: false,
      },
      {
        name: 'session_frequency',
        description:
          'How often this kind of session happens, so the budget scales appropriately.',
        example:
          'This kind of refactor session runs a handful of times a month, not daily.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'cost-optimization',
      'token-usage',
      'budgeting',
      'context-engineering',
      'observability',
    ],
    whyItWorks:
      "A general impression of a session feeling expensive is not the same evidence as a category breakdown of where the tokens actually went, and the two produce very different recommendations — 'this session was slow and pricey' invites a vague instruction to be more efficient next time, while a breakdown showing that 210,000 of 340,000 input tokens came from re-reading one file eleven times invites a specific, checkable fix: read it once and hold it in context, or delegate repeated inspection of it to a subagent whose output gets distilled before returning. Requiring the mechanism behind the largest cost category to be cited at a specific turn or tool call, rather than described generally, matters because 'context use was high' is true of nearly every expensive session and explains nothing actionable, whereas 'this specific file was read on turns 3, 7, 9, and 14 with no change to it in between' is a claim a reviewer can verify against the same data and a fix a reviewer can confirm actually addresses. Checking the stated high-cost suspicion against the data rather than assuming it was correct matters because intuition about where cost concentrates in a long agentic session is frequently wrong — the more memorable, attention-grabbing parts of a session, such as a large tool call whose result scrolled past visibly, are not reliably the same as the parts actually consuming the most tokens in aggregate, and a review that confirms the suspicion by default rather than checking it risks fixing the wrong thing while the actual driver goes untouched. Requiring the tradeoff of a proposed reduction lever to be stated explicitly targets a real risk specific to cost optimization: the cheapest way to reduce token usage is very often to do less verification, read less context, or search less thoroughly, and every one of those levers has a real chance of degrading the actual task outcome, so a recommendation that only reports the savings and never the cost to quality is an incomplete recommendation dressed as a complete one. Tying the proposed budget to actual session frequency, rather than proposing a number in isolation, matters because the same per-session cost is a rounding error for something run twice a year and a real recurring expense for something run daily, and a budget that does not account for frequency has no way to say which situation this actually is.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-24' }],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Claude Code usage/cost reporting (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-checkpoint-rewind-safe-experimentation',
    category: 'claude-code',
    title: "Use Claude Code's checkpoint and rewind deliberately, not as an afterthought",
    description:
      "A discipline prompt for sequencing a risky experimental change around Claude Code's checkpoint and rewind feature, distinguishing what a rewind actually restores — conversation and file state — from what it cannot undo, such as an external side effect already sent, so genuinely irreversible steps are never attempted before a checkpoint exists.",
    promptText:
      "You are about to attempt a change worth treating as an explicit experiment, using Claude Code's checkpoint and rewind capability as the actual safety mechanism, not git commits as an afterthought if something goes wrong. Rewind restores the conversation and the file state in this working directory to an earlier point — it does not undo anything that already happened outside this session's own file edits, and that distinction has to shape the order these steps happen in, not just be noted after the fact.\n\nEXPERIMENT\n{{experiment_description}}\n\nTHE SPECIFIC RISKY STEP\n{{risky_step}}\n\nEVERYTHING THIS EXPERIMENT MIGHT DO THAT REWIND CANNOT UNDO\n{{side_effect_inventory}}\n\nCHECKPOINT MOMENTS\n{{checkpoint_moments}}\n\nBEFORE STARTING\nConfirm a checkpoint exists, or will exist, at each moment named in {{checkpoint_moments}} — a checkpoint taken after the risky step has already run protects nothing about that step, it only protects whatever comes after it.\n\nSEQUENCING RULE\nOrder every action in this experiment so that anything listed in {{side_effect_inventory}} happens last, after every reversible step has been tried and confirmed working, never first for convenience or because it happens to be the most direct path to testing the idea. If {{risky_step}} genuinely must happen early to test the hypothesis at all, say so explicitly and treat it as a decision that trades away the safety net for that one step specifically, rather than treating rewind as a blanket guarantee that quietly does not apply to the step that actually needed it most.\n\nWHILE EXPERIMENTING\n- After each reversible step, state explicitly that this is a safe point to rewind to if the next step goes wrong, so the checkpoint boundary is a known, communicated fact, not an implicit assumption about how the tool happens to work.\n- If a step turns out to have an external side effect that was not anticipated in {{side_effect_inventory}}, stop immediately, name it, and treat that discovery itself as new information about what a subsequent rewind can and cannot restore, rather than continuing as though the safety net still fully applies.\n\nIF THE EXPERIMENT FAILS\nState plainly whether rewinding restores a clean starting point given what actually ran, or whether {{fallback_if_rewind_insufficient}} is now the real recovery path because something in {{side_effect_inventory}} already executed — do not assume rewind alone is sufficient once a listed side effect has actually fired, even if the remaining file state looks clean.\n\nOUTPUT\nThe sequenced plan with checkpoint boundaries marked explicitly, and, once the experiment concludes, an honest statement of what state this leaves things in and whether a rewind at this point would actually return to a clean starting state.",
    variables: [
      {
        name: 'experiment_description',
        description: 'The experimental change being attempted.',
        example:
          'Trying a different caching strategy for the prompt search index to see if it actually improves lookup latency before committing to it.',
        required: true,
      },
      {
        name: 'risky_step',
        description:
          'The specific part of the experiment that carries real risk if it goes wrong.',
        example:
          'Regenerating the search index in place rather than to a separate file, which overwrites the existing working index while testing.',
        required: true,
      },
      {
        name: 'side_effect_inventory',
        description: 'Everything this experiment might do that a rewind cannot undo.',
        example:
          'Nothing in this experiment calls an external API or sends a request; the only external effect would be if a build step deploys the changed index to a shared location, which is explicitly not part of this experiment.',
        required: true,
      },
      {
        name: 'checkpoint_moments',
        description: 'Where a checkpoint should exist relative to the risky step.',
        example:
          'Immediately before regenerating the index in place, and again once the new index is confirmed to load correctly.',
        required: true,
      },
      {
        name: 'fallback_if_rewind_insufficient',
        description: 'What the real recovery path is if a side effect already fired.',
        example:
          'The previous index file is also backed up separately outside this working directory as a manual fallback, in case rewind alone is not sufficient.',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['checkpoints', 'rewind', 'safe-experimentation', 'undo', 'session-management'],
    whyItWorks:
      "Claude Code's rewind restores conversation and file state to an earlier point in the same session, which is a genuinely useful undo mechanism for exactly the category of mistake it covers — an edit that turned out to be wrong, a direction that did not pan out — but it is not a universal undo for everything a session might have caused, because anything the session did outside its own file edits, such as an API call already sent or a message already delivered, already happened in the world the moment it happened and rewinding the conversation afterward does not reach back and unsend it. The sequencing rule that puts every genuinely irreversible action last exists precisely because the natural order to test a hypothesis is often the most direct one, and the most direct path to testing an idea does not automatically avoid triggering its irreversible step early — an experiment structured around testing the safe parts first and only then risking the unsafe part, once everything else is already confirmed working, gets exactly the same information with strictly less exposure than testing them in whatever order occurred to the model first. Naming a checkpoint moment explicitly and stating out loud that it is a safe point to return to converts an implicit assumption about how the tool behaves into a communicated fact both the human and the model are tracking the same way — a checkpoint nobody can point to with confidence is not meaningfully different from no checkpoint at all, since its value depends entirely on someone actually using it at the right moment, and that requires knowing precisely which moment that is. The instruction to treat an unanticipated side effect as new information that changes what a subsequent rewind can restore, rather than continuing as though the safety net still fully applies, matters because the entire premise of this discipline is a clean separation between the reversible and irreversible parts of an experiment — the moment something crosses that line unexpectedly, the plan's own safety guarantee has silently changed, and continuing to rely on it without re-evaluating is treating a stale assumption as though it were still current, the same failure this whole discipline exists to prevent in the first place.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' }],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code checkpoint/rewind (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-todowrite-long-session-tracking',
    category: 'claude-code',
    title:
      "Structure a long Claude Code session with TodoWrite instead of losing track of what's left",
    description:
      'A task-tracking discipline prompt that has Claude Code decompose a long task into a TodoWrite list at the start, keep exactly one item in progress at a time, and treat an item marked complete without stated verifiable evidence as not actually complete — closing the gap between looking organized and actually staying on track.',
    promptText:
      "This task is long enough that tracking it in a TodoWrite list from the start matters more than it would for a quick change — the list is not a status report written after the fact, it is the actual working plan this session follows.\n\nTASK\n{{task_description}}\n\nHOW GRANULAR EACH TODO ITEM SHOULD BE\n{{granularity_guidance}}\n\nWHAT COUNTS AS VERIFIABLE EVIDENCE AN ITEM IS ACTUALLY DONE\n{{verification_requirement}}\n\nDEFINITION OF DONE FOR THE WHOLE TASK\n{{definition_of_done}}\n\nRISK OF THIS SESSION BEING INTERRUPTED PARTWAY\n{{interruption_risk}}\n\nBEFORE STARTING\nWrite the full TodoWrite list up front, broken down per {{granularity_guidance}} — not so coarse that one item silently contains four days of hidden sub-steps, and not so fine that the list itself becomes more overhead than the work it tracks.\n\nWHILE WORKING\n- Keep exactly one item marked in_progress at any given moment. Do not mark a second item in_progress before the first is either completed or explicitly abandoned with a stated reason — a list with two simultaneous in-progress items has stopped functioning as a record of what is actually happening right now.\n- Update an item's status the moment its real state changes, not in a batch at the end of a work stretch — a todo list updated after the fact is a summary, not a tracker, and provides none of the mid-session recovery value a live list gives if the session is interrupted.\n- Do not mark an item completed unless it meets {{verification_requirement}} for that specific item — a step that looks finished because the code was written is not the same as a step confirmed against its actual verification bar, and marking it done regardless quietly lowers the bar for every item after it.\n- If a new sub-step is discovered mid-task that the original list did not anticipate, add it to the list explicitly rather than folding it silently into whichever item is currently in progress, so the list continues to reflect the actual scope of remaining work rather than a stale plan from before the discovery.\n\nIF THIS SESSION IS INTERRUPTED\nGiven {{interruption_risk}}, the list itself should be detailed enough that a fresh session, or a compacted continuation of this one, can reconstruct exactly what remains without re-deriving it from scratch — a todo item's own text should name enough specifics that its current state is obvious from reading it cold.\n\nAT THE END\nCompare the completed list against {{definition_of_done}} explicitly — a list where every individual item shows completed is not automatically proof the overall task is done if the original definition of done named something the list never captured as its own item.",
    variables: [
      {
        name: 'task_description',
        description: 'The overall long-running task this session is undertaking.',
        example:
          'Migrate all 40 prompt-library category files to the new tier field, verifying each file individually against the updated schema.',
        required: true,
      },
      {
        name: 'granularity_guidance',
        description: 'How fine or coarse each todo item should be.',
        example:
          'One todo item per category file, not one item for the whole migration and not one item per individual prompt entry.',
        required: true,
      },
      {
        name: 'verification_requirement',
        description:
          'What actually counts as evidence an item is done, not just written.',
        example:
          'A category file counts as done only once tsc --noEmit passes with no errors in that file and the prompt count matches the target stated for that category.',
        required: true,
      },
      {
        name: 'definition_of_done',
        description:
          'What must be true for the entire task, not just each individual item.',
        example:
          'Every category file has the tier field, tsc is clean repo-wide, and the full test suite still passes.',
        required: true,
      },
      {
        name: 'interruption_risk',
        description:
          'How likely this session is to be interrupted or compacted before finishing.',
        example:
          'This will likely run across a context compaction given the number of files involved, and may also be paused and resumed manually.',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'todowrite',
      'task-tracking',
      'long-running-tasks',
      'progress-visibility',
      'session-management',
    ],
    whyItWorks:
      "A todo list maintained as a genuine working plan and a todo list maintained as an after-the-fact status report look identical the moment either one is glanced at, but they diverge completely in what they actually protect against — a list updated live, one status change at a time, as the real state of the task changes, is the only version that has any value if the session is interrupted partway through, while a list batch-updated at the end of a work stretch is reconstructed from memory at that point and carries exactly the same risk of drift and omission as any other after-the-fact summary. The single in_progress constraint is not a cosmetic rule about list hygiene — a session that marks two items in progress at once has implicitly started working on both simultaneously in a way that is very hard to actually track faithfully, and the discipline of finishing or explicitly abandoning one before starting the next is what keeps the list's in_progress marker meaningfully synchronized with what is actually happening in the session at any given moment, rather than becoming an optimistic aspiration about what will get done soon. Requiring a stated verification bar per item, rather than accepting 'the code is written' as sufficient to mark something done, targets the same gap the scope-locked bug fix and behavior-preserving refactor prompts target elsewhere in this category: writing code that looks correct and confirming it actually meets its bar are different activities, and a todo list that conflates them silently degrades the entire list's credibility, since a human trusting a completed marker later has no way to tell which items were actually verified and which were marked done on the strength of looking finished. The instruction to add a newly discovered sub-step explicitly rather than folding it into the current item matters because a task's real scope is frequently only fully visible once work on it has started, and a list that absorbs discovered work invisibly into existing items understates the actual remaining effort to anyone reading it, including a future compacted version of this same session trying to reconstruct where things stand. Comparing the finished list against the task's stated definition of done as a final explicit step, rather than trusting a fully-checked-off list by default, closes the last gap between 'every item I wrote down is done' and 'the actual task is done' — those are only the same claim if the original list was a complete decomposition of the task, and that completeness is exactly the thing worth verifying once, at the end, rather than assuming it was true from the moment the list was first written.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-26' }],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Claude Code TodoWrite tracking (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-extended-thinking-trigger-calibration',
    category: 'claude-code',
    title: "Reach for 'think hard' deliberately, not as a reflex on every request",
    description:
      "A calibration prompt for when to actually invoke Claude Code's extended-thinking trigger words versus when they add latency and cost with no real benefit, tied to task reversibility and complexity rather than habit, and requiring the reasoning budget to be stated rather than left to the keyword alone.",
    promptText:
      'You are deciding, for this specific request, whether an extended-thinking trigger is actually warranted, and if so, at what level — this decision should be made deliberately per task, not applied as a fixed habit regardless of what the task actually is.\n\nTASK BEING CONSIDERED\n{{task_type}}\n\nWHAT MAKES THIS TASK COMPLEX OR SIMPLE\n{{complexity_signal}}\n\nHOW REVERSIBLE A WRONG ANSWER WOULD BE\n{{decision_reversibility}}\n\nHOW MUCH EXTRA LATENCY OR COST IS ACCEPTABLE HERE\n{{latency_cost_tolerance}}\n\nWHAT THE SAME TASK WOULD LOOK LIKE WITHOUT EXTENDED THINKING\n{{comparison_baseline}}\n\nDECIDE\n1. State whether this task is the kind extended thinking actually helps with — a genuine multi-step architectural tradeoff, an ambiguous requirement needing several candidate interpretations weighed against each other, a subtle bug whose cause is not obvious from a single read of the code — versus the kind it does not meaningfully help with, such as a mechanical edit, a well-specified small change, or a lookup with one correct answer.\n2. If extended thinking is warranted, name the specific reasoning budget being invoked — think, think hard, think harder, or ultrathink — and justify the level chosen against {{complexity_signal}} rather than defaulting to the strongest trigger out of an instinct that more reasoning can only help; a stronger trigger than the task needs spends real latency and cost for a benefit this specific task will not actually realize.\n3. Weigh {{decision_reversibility}} explicitly: a decision that is expensive or slow to undo once acted on, such as an irreversible database migration or a public API contract, justifies a higher reasoning budget than the same apparent complexity in a decision that is cheap to redo if wrong, such as a draft that will get reviewed before anything ships.\n4. Confirm the chosen level against {{latency_cost_tolerance}} — if this task sits inside a tight interactive loop where a slow response actively costs something, a lower reasoning budget applied correctly can beat a higher one that answers a question nobody needed answered this carefully, this specific time.\n\nIF EXTENDED THINKING IS NOT WARRANTED\nSay so plainly, and proceed with a normal response — do not add a trigger word reflexively because it is available or because it seems like it demonstrates more effort; the actual signal of a good decision here is calibration, not maximization.\n\nOUTPUT\nOne sentence stating the decision and the specific reasoning invoked, if any, and why that level and not a different one — this sentence itself does not need extended thinking to produce.',
    variables: [
      {
        name: 'task_type',
        description: 'The specific task being evaluated for a reasoning-effort trigger.',
        example:
          'Deciding between three plausible database schema designs for a new feature that will be expensive to change once real data exists in it.',
        required: true,
      },
      {
        name: 'complexity_signal',
        description:
          'What makes this task complex enough to be a candidate for extended thinking.',
        example:
          'Each schema option has different tradeoffs for query performance, migration difficulty, and how cleanly it models a genuinely ambiguous real-world relationship.',
        required: true,
      },
      {
        name: 'decision_reversibility',
        description:
          'How costly it would be to discover this decision was wrong after the fact.',
        example:
          'Changing the schema after real customer data exists in it would require a multi-step, risky migration — this decision is expensive to reverse.',
        required: true,
      },
      {
        name: 'latency_cost_tolerance',
        description:
          'How much extra time or cost is acceptable for this specific request.',
        example:
          'This is a one-time design decision, not part of an interactive loop — an extra thirty seconds of reasoning time is a non-issue here.',
        required: true,
      },
      {
        name: 'comparison_baseline',
        description:
          'What a normal, non-extended response to the same task would look like.',
        example:
          'A quick answer would likely just pick the first schema that satisfies the immediate feature request without weighing the migration-difficulty tradeoff explicitly.',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'extended-thinking',
      'reasoning-effort',
      'prompt-engineering',
      'latency-cost-tradeoff',
    ],
    whyItWorks:
      "Extended-thinking trigger words genuinely allocate a larger reasoning budget before Claude produces its response, which means the decision to invoke one is a real cost-benefit tradeoff, not a free intensifier — a stronger trigger on a task that does not actually benefit from more deliberation spends real latency and, depending on how the session is billed, real cost for a response that would have arrived at the same answer either way, which is exactly why calibrating the choice per task matters more than defaulting to the strongest available option out of an instinct that more reasoning can only ever help. Tying the decision to reversibility rather than to apparent difficulty alone targets a real asymmetry in what is actually worth spending extra deliberation on: a decision that is expensive or slow to undo once acted on, such as a schema choice that will need a real data migration to change later, justifies a higher reasoning budget even at moderate apparent complexity, because the cost of getting it wrong compounds long after the original request is answered, while an equally complex-seeming decision inside a fully reversible draft does not carry that same downstream cost even though it might look similarly hard to reason about in the moment. Requiring the specific level to be named and justified, rather than just invoking a trigger word and moving on, matters because the words themselves sit on an actual gradient of increasing reasoning budget, and treating them as interchangeable synonyms for 'think about this' collapses a real, ordered choice into an arbitrary one — the same failure mode as reaching for a wildcard permission pattern because naming the precise scope felt like unnecessary effort. Checking the chosen level against latency tolerance closes the loop on the other side of the tradeoff: a reasoning budget that would be entirely appropriate for a one-time architectural decision is poorly suited to a tight interactive loop where every extra second of latency is felt directly by whoever is waiting on the response, and a calibration that only considers task complexity while ignoring how the answer will actually be consumed is solving half the problem. The instruction to say plainly when extended thinking is not warranted, rather than defaulting to some trigger out of habit or a vague sense that more effort demonstrates more care, is the actual point of the whole exercise — the mechanism only pays for itself when it is reserved for the requests that genuinely need it, and using it indiscriminately erodes exactly the signal it is supposed to provide.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-27' }],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Claude Code extended-thinking triggers (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-skill-md-authoring',
    category: 'claude-code',
    title: 'Package a repeated procedure as a SKILL.md Claude Code discovers on its own',
    description:
      "A skill-authoring prompt that produces a complete SKILL.md — trigger description, procedural body, and any bundled scripts or reference files — for a multi-step procedure the main agent should recognize and apply automatically, distinct from a slash command's explicit invocation and a subagent's isolated context.",
    promptText:
      "Write a Claude Code skill as a SKILL.md file for {{skill_directory}}, packaging a repeated procedure this agent should recognize and apply on its own when the right moment arises, without needing to be invoked by an explicit command name the way a slash command would be.\n\nPROCEDURE TO PACKAGE\n{{skill_procedure}}\n\nWHEN THIS SKILL SHOULD ACTUALLY TRIGGER\n{{trigger_condition}}\n\nRESOURCES THIS SKILL SHOULD BUNDLE\n{{bundled_resources}}\n\nOVERLAP WITH ANYTHING ALREADY DEFINED\n{{existing_skills_overlap}}\n\nSTRUCTURE THE FILE AS\n1. Frontmatter with a name and a description written as a precise trigger condition — the exact situation that should cause this skill to be recognized as relevant, not a vague summary of the topic area, since this description is the literal signal the main agent matches against when deciding whether the current moment calls for this procedure.\n2. A body written as a direct, ordered procedure: the steps this task actually involves, in the order they need to happen, referencing any bundled resource by its relative path rather than assuming its content is already known.\n3. If {{bundled_resources}} names a script, template, or reference document this procedure depends on, describe what it is for and when to actually use it versus when the procedure can proceed without it — a bundled resource nobody is told when to reach for sits unused regardless of how useful it might be.\n\nCONSTRAINTS\n- Write the trigger description narrowly enough that this skill would not be mistakenly recognized as relevant to a superficially similar but actually different situation, and broadly enough that it would not fail to trigger on the actual situation it is meant for stated in slightly different words — the same precision problem a subagent's description field has, applied here to procedural knowledge instead of delegation.\n- If {{existing_skills_overlap}} names a skill this one is close to in scope, state the overlap explicitly and propose either merging the two or drawing a sharper line between them, rather than leaving two skills whose descriptions could both plausibly match the same moment.\n- Do not write this as a reference document explaining background concepts; write it as a procedure to execute. A skill that only explains what something is, without saying what to actually do, has not earned a spot as something the agent reaches for mid-task.\n- Keep the core file itself scoped to the procedure and its trigger; put any content genuinely too long to read every time it triggers into a separate bundled file the procedure references only when that specific step is reached, rather than loading everything up front regardless of which step is actually needed.\n\nOUTPUT\nThe complete SKILL.md file, followed by one sentence naming what task this skill explicitly does not cover, so its boundary is stated rather than left to be discovered the first time it is invoked on something outside its actual scope.",
    variables: [
      {
        name: 'skill_procedure',
        description: 'The repeated multi-step procedure being packaged as a skill.',
        example:
          'Whenever a new prompt-library category is drafted, verify every entry against the word-count and variable-consistency rules before considering the file done.',
        required: true,
      },
      {
        name: 'trigger_condition',
        description: 'The specific moment this skill should be recognized as relevant.',
        example:
          'Any time a lib/prompts/<category>/prompts.ts file has just been written or edited and is about to be reported as complete.',
        required: true,
      },
      {
        name: 'skill_directory',
        description: 'Where this skill file should be created.',
        example: '.claude/skills/prompt-library-verification/SKILL.md',
        required: true,
      },
      {
        name: 'bundled_resources',
        description: 'Any script, template, or reference file this procedure depends on.',
        example:
          'A small Node script, check-prompt-file.js, that programmatically verifies word counts and flags any entry missing a required field.',
        required: false,
      },
      {
        name: 'existing_skills_overlap',
        description:
          'Any existing skill this one might overlap with in scope or trigger condition.',
        example:
          'No existing skill currently covers prompt-library file verification specifically.',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'skill-md',
      'custom-skills',
      'procedural-knowledge',
      'discoverability',
      'automation',
    ],
    whyItWorks:
      "A SKILL.md and a slash command solve genuinely different invocation problems, and conflating them produces a file that fits neither well — a slash command requires someone to remember its exact name and type it, which works for a workflow a person consciously decides to run, while a skill is meant to be recognized automatically by the main agent matching the current moment against the skill's own description, which is the right mechanism for a procedure that should apply whenever a certain situation arises regardless of whether anyone remembered to invoke anything by name. This is exactly why the description field carries the same load-bearing precision problem a subagent's description does, just one level removed from delegation and applied to procedural knowledge instead — a description vague enough to read as generally on-topic will get matched to situations it was not actually written for, while one too narrowly worded in the specific phrasing of the original use case will fail to trigger the next time the same underlying situation shows up described slightly differently, and both failure modes are invisible until the moment they actually happen. Requiring the body to read as an executable procedure rather than a reference explainer targets a common authoring mistake: it is much easier to write a paragraph explaining what a concept is than to write the exact ordered steps that constitute doing it, but only the second one is actually useful the moment this skill triggers mid-task, since the agent at that point needs to act, not to learn background. Deferring bundled content to separate files the procedure references only when a specific step needs it, rather than inlining everything into the core SKILL.md, matters because a skill that triggers is read in full every time it does, and a skill bloated with content only relevant to a rarely-reached step pays that reading cost on every single trigger regardless of whether that step is ever actually reached in a given invocation. Flagging overlap with an existing skill explicitly, instead of leaving two similarly-scoped skills both live at once, matters for the same reason overlapping subagent descriptions matter — an ambiguous match between two skills does not produce an error, it produces one of them getting silently applied while the other, equally plausible one, gets silently skipped, with no visible signal that a coin got flipped.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-28' }],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Claude Code custom skills (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-large-scale-codemod-migration',
    category: 'claude-code',
    title:
      'Plan a repo-wide pattern migration as a codemod, not five hundred manual edits',
    description:
      "A large-scale transformation plan that defines the exact before-and-after pattern once, verifies it against a codemod tool on a sample before running it repo-wide, and stages rollout by directory — distinct from a single dependency's breaking-change migration, this is for a systemic pattern change across the whole codebase.",
    promptText:
      "You are planning a repo-wide transformation of one specific pattern into another, at a scale where manually editing every occurrence by hand is not a realistic or reliable option. This is a planning and tooling task first — do not begin editing individual files by hand until the codemod itself has been verified on a small sample.\n\nTHE PATTERN, BEFORE AND AFTER\n{{migration_pattern}}\n\nROUGHLY HOW MANY FILES THIS TOUCHES\n{{affected_file_count_estimate}}\n\nCODEMOD TOOLING AVAILABLE\n{{codemod_tool}}\n\nSTAGING BOUNDARY FOR ROLLOUT\n{{staging_boundary}}\n\nPROCESS\n1. State the transformation rule with enough precision that it could be applied mechanically, not just described in prose — the exact syntactic shape being matched, and the exact shape it becomes, including how any variation in the original pattern, such as a different variable name or an extra prop, should be handled rather than assumed away.\n2. Search the codebase for every occurrence matching the before-pattern, using {{affected_file_count_estimate}} as a sanity check against what the search actually finds — if the real count is far off from the estimate, that is a signal the pattern definition in step one is either too broad or too narrow, and worth revisiting before writing the codemod itself.\n3. Write the codemod using {{codemod_tool}}, and run it against a small, representative sample of five to ten files first, not the whole codebase — review the actual diff on that sample by hand before trusting the codemod at scale, since a codemod that is subtly wrong will be wrong identically and invisibly across every file it touches, which is a much larger blast radius than the same mistake made once by hand.\n4. Once the sample diff is confirmed correct, run the codemod against {{staging_boundary}}'s first stage only, not the entire estimated file set at once — commit that stage, run the test suite, and confirm nothing broke before proceeding to the next stage.\n5. Name any occurrence the codemod could not handle automatically, and why — an edge case genuinely too irregular for the mechanical rule to cover, a file where the pattern appears inside a string or a comment rather than real code, or a case where the surrounding context changes what the correct transformation actually is. List these for manual handling rather than forcing the codemod to attempt them and silently producing a wrong result.\n\nCONSTRAINTS\n- Do not run the codemod against the full estimated file set before it has been verified on a sample and on at least one staged rollout boundary.\n- If the codemod tool itself cannot express part of the transformation rule, say so rather than writing a codemod that handles most of the pattern correctly and silently mishandles the rest.\n- Track progress with a running count of files transformed against the total, not a vague sense of 'mostly done.'\n\nOUTPUT\nThe precise transformation rule, the codemod script, the sample-diff review result, the staged rollout plan, and the list of occurrences requiring manual handling.",
    variables: [
      {
        name: 'migration_pattern',
        description:
          'The exact before and after pattern being migrated across the codebase.',
        example:
          'Before: class components extending React.Component with a componentDidMount lifecycle method. After: functional components using useEffect with an empty dependency array for the equivalent mount-only behavior.',
        required: true,
      },
      {
        name: 'affected_file_count_estimate',
        description: 'A rough estimate of how many files this pattern appears in.',
        example:
          'Roughly 60 to 70 component files, based on a quick grep for extends React.Component.',
        required: true,
      },
      {
        name: 'codemod_tool',
        description: 'The tool available to write and run the transformation.',
        example:
          'jscodeshift, already used elsewhere in this monorepo for a prior migration.',
        required: true,
      },
      {
        name: 'staging_boundary',
        description: 'How the rollout should be divided into stages.',
        example:
          'Stage by top-level feature directory: components/checkout first as the smallest and most test-covered, then components/reports, then everything else.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'codemod',
      'framework-migration',
      'large-scale-refactor',
      'automated-transformation',
      'jscodeshift',
    ],
    whyItWorks:
      "A pattern that recurs across sixty or seventy files is a fundamentally different problem from the same pattern appearing in one file, because the actual risk shifts from getting one instance right to getting one rule right and then trusting it uniformly — a codemod that is subtly wrong is wrong identically across every file it touches, which sounds like consistency but is actually a much larger blast radius than a single hand-made mistake, since the same subtle error now needs to be found and re-fixed sixty or seventy times instead of once. Requiring the transformation rule to be stated precisely enough to apply mechanically, rather than described only in prose, forces the exact ambiguity a manual edit could quietly resolve case by case — such as what happens to a slightly different variable name or an extra prop — to be decided once, explicitly, before it gets baked into a tool that will apply that same decision everywhere without the chance to notice a particular instance deserved different handling. Checking the actual search result count against the rough estimate is a real sanity check with a specific failure mode it catches: an estimate wildly off from what the codebase search actually finds means the pattern definition itself is probably too broad, catching things that only superficially resemble the target, or too narrow, missing real occurrences written in a slightly different but equivalent form, and either error compounds silently if the codemod is trusted at the estimate's face value instead. Verifying on a small sample before running at scale, and staging the rollout by directory rather than attempting the whole estimated set in one pass, both exist because a codemod's failure mode is not a crash that stops execution, it is a plausible-looking but wrong transformation that a test suite might not catch if the tests themselves were not written to distinguish the old and new behavior precisely — reviewing five to ten files by hand catches what a codemod cannot self-report, and staging the rollout means a defect discovered at stage two is attributable to a small, known change set rather than lost somewhere inside a single sixty-file commit. Explicitly listing what the codemod could not handle, rather than letting it attempt every occurrence uniformly, matters because the alternative failure — a codemod that mishandles an edge case silently rather than skipping it — produces a file that looks migrated and runs cleanly right up until the specific behavior that edge case depended on breaks in a way nobody flagged as worth checking.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-29' }],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Claude Code with jscodeshift-driven migration planning (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-contract-first-interface-loop',
    category: 'claude-code',
    title:
      'Freeze the interface first, implement against it, instead of discovering it mid-build',
    description:
      'A contract-first development loop that has Claude Code define the full interface, type, and error-case shape for a feature before any implementation begins, requires explicit re-approval for any later contract change, and names every downstream consumer that would be affected if the frozen shape turns out to need adjusting.',
    promptText:
      "You are defining the contract for this feature before writing any implementation against it — every function signature, request and response shape, and error case this feature introduces must be fully specified and approved before implementation starts, not discovered incrementally as the build proceeds.\n\nFEATURE\n{{feature_description}}\n\nWHAT SPECIFICALLY NEEDS A FROZEN SHAPE\n{{contract_surface}}\n\nWHO ALREADY CONSUMES OR WILL CONSUME THIS CONTRACT\n{{consumers_of_contract}}\n\nVERSIONING STRATEGY IF THIS CONTRACT NEEDS TO CHANGE LATER\n{{versioning_strategy}}\n\nSTAGE ONE — CONTRACT DEFINITION ONLY\nWrite out every element of {{contract_surface}} in full: exact function signatures with parameter and return types, exact request and response shapes if this crosses a network or process boundary, and every distinct error case with what triggers it and what the caller receives back for it. Do not write any implementation logic in this stage — a type signature and a stub that throws not-implemented is acceptable here; real logic behind it is not.\n\nDo not proceed past this stage until the contract is explicitly approved. State clearly that you are waiting for that approval.\n\nSTAGE TWO — IMPLEMENTATION AGAINST THE FROZEN CONTRACT\nOnce approved, implement strictly against the contract from stage one. If, while implementing, a genuine need to change the contract emerges — a case that turns out to need a different shape, a return type that cannot actually express what the implementation needs to convey — stop implementing, name exactly what needs to change and why, and treat this as a new stage-one proposal requiring its own approval, not a change to quietly make and mention afterward.\n\nCHECK AGAINST CONSUMERS\nBefore any contract change is approved, whether at the start or mid-implementation, check {{consumers_of_contract}} explicitly — a contract change that looks purely additive to the feature being built can still be a breaking change for an existing consumer that pattern-matches on the previous shape, and that has to be confirmed against the actual consumer code, not assumed safe because the change felt small from inside this feature's own perspective.\n\nCONSTRAINTS\n- If {{versioning_strategy}} indicates this contract is public or crosses a boundary this codebase does not fully control, such as an external API consumer, treat a contract change as requiring a deprecation path, not an in-place edit, and say so explicitly.\n- Do not let implementation details leak backward into the contract definition — the contract describes what callers can rely on, not how the feature happens to be built internally, and conflating the two makes the contract brittle to implementation changes that should never have affected it.\n\nOUTPUT\nStage one's full contract, an explicit wait-for-approval line, and only then, once approved, stage two's implementation strictly matching it.",
    variables: [
      {
        name: 'feature_description',
        description: 'The feature this contract-first process applies to.',
        example:
          'A new bulk-tag-update endpoint for the prompt library admin panel, letting an editor apply a tag to many prompt entries at once.',
        required: true,
      },
      {
        name: 'contract_surface',
        description: 'Exactly what needs a frozen shape before implementation starts.',
        example:
          'The POST /api/admin/prompts/bulk-tag request body shape, the response shape including per-item success or failure, and every distinct error case such as an invalid slug or a tag exceeding the allowed length.',
        required: true,
      },
      {
        name: 'consumers_of_contract',
        description:
          'Who already depends on this contract, or will as soon as it exists.',
        example:
          'The admin panel frontend, currently being built in parallel by a different session against this exact contract.',
        required: true,
      },
      {
        name: 'versioning_strategy',
        description: 'How a future change to this contract would need to be handled.',
        example:
          'This is an internal admin-only endpoint with one consumer, so an in-place change is acceptable as long as both sides update together; it is not a public API needing deprecation.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'contract-first',
      'interface-driven-development',
      'api-design',
      'type-safety',
      'planning',
    ],
    whyItWorks:
      "An interface discovered incrementally during implementation is discovered under exactly the wrong conditions to design it well — the shape that feels natural to write from inside the function currently being built is not reliably the shape a consumer on the other side of that boundary actually needs, and by the time a second file is built against whatever shape the first one happened to settle on, correcting course requires redoing work rather than adjusting a plan. Freezing the contract before any implementation begins forces the design questions — what does an error case actually return, what does an empty result look like, what is optional versus required — to be answered once, deliberately, in a form a reviewer can actually evaluate, rather than being answered implicitly and inconsistently across however many call sites end up depending on them. The explicit re-approval requirement for a mid-implementation contract change matters for the same reason a mid-plan deviation needs its own approval in a Plan Mode workflow: an approved contract that quietly changes without a second look defeats the entire reason it was frozen in the first place, since anyone relying on the original approved shape now has a false sense of what they can depend on. Checking a proposed contract change against actual named consumers, rather than judging it purely from the feature's own perspective, targets a specific and easy mistake — a change that looks additive from inside the feature being built, such as adding an optional field, can still be a breaking change for a consumer that pattern-matches strictly on the previous shape or assumes an exhaustive set of cases, and that only becomes visible by actually checking the consumer's code, not by reasoning about the change in isolation from the side making it. Separating the contract from its implementation, and refusing to let implementation detail leak backward into the frozen shape, matters because a contract that accidentally encodes something about how the feature happens to be built internally is brittle in exactly the way a contract is not supposed to be — a later implementation change that was meant to be purely internal now has to also revisit the contract, reintroducing the coordination cost this whole process exists to avoid.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-30' }],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Claude Code contract-first development (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-bash-sandbox-escape-audit',
    category: 'claude-code',
    title:
      "Audit Claude Code's Bash permissions for the escape route a single rule missed",
    description:
      "A holistic security audit of an existing settings.json's full Bash permission surface — checking whether the union of individually reasonable allowed patterns can be composed into a forbidden action — rather than reviewing any single rule in isolation, plus a check of the actual sandbox mode restrictions in effect.",
    promptText:
      "You are auditing the full Bash permission surface of this settings.json as a system, not reviewing each rule in isolation for whether it looks reasonable on its own. A permission set can be composed entirely of individually sensible rules and still, taken together, permit a path to an action every one of those rules was individually meant to prevent.\n\nCURRENT PERMISSIONS CONFIGURATION\n{{current_permissions_config}}\n\nCURRENT SANDBOX MODE SETTINGS\n{{sandbox_mode_settings}}\n\nKNOWN COMPOSABILITY RISKS ALREADY SUSPECTED\n{{known_composability_risks}}\n\nWHAT THE DENY LIST WAS ACTUALLY MEANT TO PREVENT\n{{deny_list_intent}}\n\nAUDIT PROCESS\n1. List every allow-listed Bash pattern in {{current_permissions_config}} individually, and for each, name the broadest thing it actually permits, not just the narrow case it was written for — an allowed pattern like Bash(git config:*) permits every git config subcommand, including one that sets core.hooksPath to a directory containing an attacker-controlled script that runs on the next commit, not just the specific config change the rule was written to allow.\n2. For every pair or small group of allowed patterns that touch related tools, check whether they can be chained to reach an action the deny list, described in {{deny_list_intent}}, was meant to block — an allowed npm run pattern combined with an allowed ability to edit package.json's own scripts field can let a script that looks safe on allow-listing day get silently redefined into one that is not, without ever triggering a new permission check on the redefined command itself.\n3. Cross-check {{known_composability_risks}} against the actual permission set — confirm or rule out each named risk specifically, citing the exact combination of patterns responsible if confirmed.\n4. Check {{sandbox_mode_settings}} independently of the allow and deny lists — sandboxing restricts what a command can reach regardless of whether the command itself was permitted, such as filesystem access outside the working directory or outbound network access, and a permission set that looks tightly scoped on paper can still be running with a sandbox mode that grants broader reach than the allow list alone suggests, or the reverse, where an overly cautious allow list is compensating for a sandbox mode that was never actually tightened.\n5. Name every finding as either CLOSED, meaning the composability path was checked and does not exist, or OPEN, meaning it does, with the exact chain of patterns that reaches the forbidden action and a specific proposed fix — narrowing one of the patterns involved, adding a more specific deny entry, or restricting sandbox mode further.\n\nCONSTRAINTS\n- Do not clear a composability risk as CLOSED without actually tracing the specific chain of allowed patterns and confirming none of them combine to reach the forbidden action; a rule that looks narrow in isolation is exactly the kind of rule most likely to be wrongly assumed safe without that check.\n- Treat a deny-list gap discovered during this audit as more urgent to report than a merely inefficient allow pattern — the two are not equally severe findings and should not be presented as though they are.\n\nOUTPUT\nA table of allow pattern, broadest actual permission, composability check result, and any finding, ranked by severity, followed by the sandbox mode check as a separate section.",
    variables: [
      {
        name: 'current_permissions_config',
        description: 'The actual current permissions block from settings.json.',
        example:
          'allow: Bash(git:*), Bash(npm run:*), Edit, Read; ask: Bash(git push:*); deny: Bash(rm -rf:*), Bash(git push --force:*)',
        required: true,
      },
      {
        name: 'sandbox_mode_settings',
        description: 'The current sandbox configuration in effect, if any.',
        example:
          'No explicit sandbox mode configured beyond the default; filesystem and network restrictions are whatever Claude Code applies out of the box.',
        required: true,
      },
      {
        name: 'known_composability_risks',
        description:
          'Any specific composability concern already suspected, to check directly.',
        example:
          'Suspect that the broad Bash(git:*) allow rule permits git config core.hooksPath, which could be combined with Edit access to plant a malicious hook script.',
        required: false,
      },
      {
        name: 'deny_list_intent',
        description:
          'What the deny list was actually meant to prevent, in plain language.',
        example:
          'The deny list exists to make destructive filesystem deletion and a forced push to a protected branch structurally impossible from this tool.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: [
      'bash-sandbox',
      'security-audit',
      'permission-composability',
      'settings-json',
      'defense-in-depth',
    ],
    whyItWorks:
      "Individually reviewing each Bash allow pattern in isolation is the standard way a permissions file gets written and the standard way it fails to catch its own gaps, because the actual risk in a permission system built from many small allow rules is rarely any single rule looking too permissive on its own — it is the union of several individually reasonable rules combining into a path nobody who wrote any one of them in isolation would have approved if shown the combination directly. Naming the broadest thing each pattern actually permits, rather than the narrow case it was written for, matters because a wildcard suffix like Bash(git config:*) reads as scoped and specific when a reviewer is thinking about the one config change it was added to allow, but the pattern itself makes no such distinction — it permits every git config subcommand indiscriminately, including ones with security-relevant side effects like redirecting where git looks for hook scripts, and that gap between intended scope and actual scope is exactly what a rule-by-rule review checking only 'does this look reasonable' will not surface. Checking pairs and small groups of related allowed patterns for a chainable path to a denied outcome targets the specific way real permission-composability exploits work — not through any single overprivileged rule, but through two or three individually modest rules that happen to touch adjacent surfaces, such as an allowed script-runner combined with allowed write access to the file defining what that script actually runs, letting an initially safe command get silently redefined into an unsafe one without triggering a fresh permission check on the redefinition itself. Auditing sandbox mode as a genuinely separate layer from the allow and deny lists matters because the two operate on different axes entirely — permission patterns gate which commands can run at all, while sandbox restrictions gate what a command that is already permitted can actually reach once it runs, and a permission set that looks tightly scoped on paper provides no real defense-in-depth if the sandbox mode underneath it was never actually tightened to match, just as an overly cautious allow list cannot make up for a sandbox mode that is more permissive than anyone reviewing the allow list alone would have assumed. Ranking a deny-list gap as more urgent than a merely inefficient allow pattern, rather than presenting every finding with equal weight, matters because a report that treats a genuine security gap and a minor tidiness issue as comparably important findings gives a reviewer no signal about which one actually needs fixing before anything else.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-31' }],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Claude Code Bash permissions and sandbox mode auditing (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-ide-extension-diff-workflow',
    category: 'claude-code',
    title:
      "Use the Claude Code IDE extension's own diff view instead of working blind in a terminal",
    description:
      "A prompt tuned for the VS Code and JetBrains Claude Code extensions that leans on the IDE's automatically-shared selection, open file, and diagnostics context, routes review through the IDE's native inline diff instead of a pasted patch, and hands verification off to the IDE's own linter and test runner instead of re-implementing that check inside the prompt.",
    promptText:
      "You are running inside the Claude Code extension for {{ide_used}}, which means the IDE is already sharing context a terminal session would not have automatically — use that instead of asking the user to re-paste information the IDE already surfaces.\n\nWHAT THE IDE HAS ALREADY SHARED\n{{selection_context}}\n\nDIAGNOSTICS CURRENTLY SHOWING IN THE EDITOR\n{{diagnostics_present}}\n\nHOW THE CHANGE SHOULD BE REVIEWED\n{{diff_review_mode}}\n\nHOW THIS PROJECT'S LINT AND TESTS ACTUALLY RUN\n{{external_test_runner_integration}}\n\nTASK\n{{task_description}}\n\nUSING THE SHARED CONTEXT\n1. If {{selection_context}} names a specific selection or open file, treat that as the actual scope of this task unless the task description clearly needs more — do not silently widen scope to the whole file or the whole module just because reading more felt convenient, and do not ask the user to paste code that is already visible to this session through the editor.\n2. If {{diagnostics_present}} lists an existing error or warning in the affected area, check whether the task at hand would resolve it, worsen it, or leave it untouched, and say which explicitly — a diagnostic already flagged by the IDE's own linter or type checker is a fact this session has access to and should not silently ignore or duplicate by re-deriving the same warning from scratch.\n\nREVIEW MODE\nPer {{diff_review_mode}}, present the change so it renders correctly in the IDE's own inline diff view rather than as a standalone text patch requiring the reviewer to mentally reconstruct where each change lands in the file — the IDE extension is built to show a change against its actual position in the editor, and a review flow that ignores this and dumps a generic unified diff into chat text is discarding the exact affordance the IDE integration exists to provide.\n\nVERIFICATION HANDOFF\nDo not reimplement the project's lint or test check inside this response if {{external_test_runner_integration}} indicates the IDE already surfaces that result natively — state what to check in the IDE's own panel, such as the Problems panel or the integrated test runner's pass/fail indicator, rather than running a redundant check through Bash and reporting a second, separately-formatted result the IDE's own tooling already shows more usefully.\n\nCONSTRAINTS\n- Do not ask the user to describe what file is open or what is selected if the extension has already made that available to this session — asking anyway wastes a turn on information already present.\n- If the IDE's diagnostics and this session's own reasoning disagree about whether something is actually an error, say so explicitly rather than silently trusting one over the other without explaining the discrepancy.\n\nOUTPUT\nThe change, structured for the IDE's native diff view, plus a one-line note on which diagnostic, if any, this resolves and where to verify that in the IDE itself.",
    variables: [
      {
        name: 'ide_used',
        description: 'Which IDE this session is actually running inside.',
        example: 'VS Code, using the Claude Code extension rather than the terminal CLI.',
        required: true,
      },
      {
        name: 'selection_context',
        description:
          'What the IDE has already shared about the current selection or open file.',
        example:
          'The user has lib/reports/export.ts open with lines 30 to 55 selected, covering the CSV generation function.',
        required: true,
      },
      {
        name: 'diagnostics_present',
        description:
          'Any error or warning the editor is currently showing in the relevant area.',
        example:
          "A TypeScript warning on line 42: 'Object is possibly undefined' on the average-calculation line.",
        required: false,
      },
      {
        name: 'diff_review_mode',
        description: 'How the change should be presented for review.',
        example:
          'Use the extension’s inline diff view so the change shows directly against the open file, not as a separate pasted patch.',
        required: true,
      },
      {
        name: 'external_test_runner_integration',
        description: 'What test or lint tooling the IDE already surfaces natively.',
        example:
          'VS Code has the Vitest extension installed with inline pass/fail indicators next to each test; no need to also run the suite through Bash and report a separate result.',
        required: true,
      },
      {
        name: 'task_description',
        description: 'What the task actually is, scoped to the shared context above.',
        example:
          'Fix the TypeScript warning on the average-calculation line without changing the function’s existing behavior for a non-empty report.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['ide-extension', 'vs-code', 'jetbrains', 'inline-diff', 'developer-workflow'],
    whyItWorks:
      "The Claude Code IDE extension genuinely shares context a terminal CLI session does not have automatically — the currently open file, an active selection, and the editor's own live diagnostics are already available to the session the moment it starts, and a prompt that asks the user to re-describe or re-paste any of that is discarding real, already-present information in favor of re-deriving it through conversation, which costs a turn and risks a transcription mismatch between what the user typed and what the editor actually shows. Treating the shared selection as the task's actual scope, rather than a mere hint to widen from, matters because an editor selection is usually a deliberate signal about intended scope, not an arbitrary sampling of the file — a user who selected exactly one function before invoking Claude Code was very likely narrowing the task on purpose, and a response that reasons about the whole file regardless has quietly ignored the one piece of framing the IDE workflow was specifically designed to make effortless to provide. Checking the task against an existing diagnostic explicitly, rather than silently ignoring or re-deriving it, matters because the IDE's linter and type checker are already authoritative on syntax-level and type-level correctness in a way a model re-deriving the same fact from reading the code is redundant with at best and could conflict with at worst — if the model's own read disagrees with what the editor is showing, that disagreement is itself important information a reviewer needs surfaced, not silently resolved in one direction. Routing review through the extension's inline diff view instead of a pasted text patch matters because the inline view shows a change positioned exactly where it lands in the real file, with the surrounding unchanged code visible in its actual context, which is a genuinely different and easier reviewing experience than mentally mapping a standalone patch's line numbers back onto the file being edited — this is the specific affordance the IDE integration exists to provide, and defaulting to a plain-text diff inside a chat response ignores it entirely. Deferring to the IDE's own test runner or Problems panel instead of re-running the same check through Bash and reporting a second, differently-formatted result avoids presenting the same fact twice in two different shapes, which is confusing exactly when the two results ever disagree and redundant every other time.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against the Claude Code VS Code extension (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-posttooluse-autoformat-feedback-hook',
    category: 'claude-code',
    title:
      'Wire a PostToolUse hook that auto-formats every edit instead of nagging in review',
    description:
      'A PostToolUse hook prompt for automatically running a formatter or linter after every Edit or Write call and feeding back only what actually changed — a mechanically distinct hook lifecycle from PreToolUse, since PostToolUse cannot block the action that already happened but can surface a correction as fresh context Claude acts on immediately in the same turn.',
    promptText:
      "Write a Claude Code PostToolUse hook that runs {{formatter_command}} automatically after every matching edit, and feeds back only what the formatter actually changed, rather than silently reformatting with no signal or blocking nothing while a style violation quietly ships. PostToolUse runs after the tool call has already executed and cannot prevent it — this hook is a feedback and auto-correction mechanism, not a guardrail, and the prompt and the script must both be built around that distinction rather than treated as a delayed PreToolUse check.\n\nWHICH TOOL CALLS THIS HOOK MATCHES\n{{matcher_tools}}\n\nFILE PATTERNS THIS APPLIES TO\n{{matcher_file_patterns}}\n\nHOW MUCH DETAIL TO FEED BACK\n{{feedback_granularity}}\n\nWHAT HAPPENS IF THE FORMATTER ITSELF FAILS\n{{failure_handling}}\n\nPRODUCE\n1. The settings.json fragment: a PostToolUse hooks entry matched to {{matcher_tools}} and scoped by {{matcher_file_patterns}} so this does not fire on every tool call, only ones that actually touched a file this formatter applies to.\n2. The hook script, which reads the tool input and result from stdin, identifies the exact file that was just edited, runs {{formatter_command}} against that specific file only, and compares the file's content before and after the formatter ran.\n3. If the formatter changed anything, the script must report back to Claude, per {{feedback_granularity}}, specifically what changed — not the entire reformatted file, which would waste context repeating content that did not need to change, and not a bare 'formatting was applied' with no detail, which gives Claude nothing to actually learn from for its next edit in this same file.\n4. If the formatter made no changes, the script should exit cleanly with no output — a hook that reports 'no changes needed' on every single edit adds noise to every turn for information that only matters the one time it is not true.\n\nEXIT CODE AND FEEDBACK MECHANICS\nUse exit code 2 with the diff on stderr when there is something for Claude to see, since that is what surfaces as additional context back to Claude in a PostToolUse hook, distinct from the blocking exit code a PreToolUse hook uses — a PostToolUse hook exiting with a blocking-style code does not undo the edit that already happened, it can only add noise without preventing anything, so confirm the exit code chosen actually does what this hook intends rather than assuming the same code means the same thing across both hook types.\n\nFAILURE HANDLING\nPer {{failure_handling}}, if the formatter command itself errors, such as on a syntax error the edit just introduced, report that distinctly from a normal formatting change — a formatter crash is different information than a style correction and conflating the two in the same feedback channel hides a possible real bug behind what looks like routine auto-formatting noise.\n\nOUTPUT\nThe settings.json fragment and the hook script, followed by one example of the feedback Claude would actually see after an edit that needed reformatting, and one showing the silent case where nothing was needed.",
    variables: [
      {
        name: 'formatter_command',
        description: 'The exact formatter or linter command this hook should run.',
        example: 'npx biome check --write',
        required: true,
      },
      {
        name: 'matcher_tools',
        description: 'Which tool calls this hook should fire after.',
        example: 'Edit and Write calls only, not Bash or Read.',
        required: true,
      },
      {
        name: 'matcher_file_patterns',
        description: 'Which file types or paths this formatter actually applies to.',
        example:
          '*.ts and *.tsx files only, skipping markdown and JSON files this formatter is not configured for.',
        required: true,
      },
      {
        name: 'feedback_granularity',
        description: 'How much detail about the formatting change should be fed back.',
        example:
          'A short diff of just the lines the formatter touched, not the full file content.',
        required: true,
      },
      {
        name: 'failure_handling',
        description: 'What should happen if the formatter command itself errors out.',
        example:
          'Report the formatter’s error output distinctly, labeled as a formatter failure, not folded into the normal "formatting applied" message.',
        required: true,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['hooks', 'posttooluse', 'auto-format', 'lint-feedback', 'settings-json'],
    whyItWorks:
      "PreToolUse and PostToolUse are genuinely different hook lifecycles with different available actions, and a prompt that treats PostToolUse as just a delayed version of the same blocking mechanism is asking the wrong tool to do a job it structurally cannot do — by the time a PostToolUse hook runs, the edit has already landed on disk, so there is no version of this hook that prevents a style violation from ever existing, only one that notices it immediately afterward and feeds a correction back into the same turn before the conversation moves on. This is exactly why the exit-code semantics get their own explicit section: a PreToolUse hook's blocking exit code means the call never happened, while the equivalent code from a PostToolUse hook means something different entirely, since the action already executed and the only thing exit code 2 with stderr output does here is surface that stderr content back to Claude as fresh context it can act on in its very next message — treating the two hook types as interchangeable because they share a name pattern in settings.json produces a hook that either silently does nothing useful or, worse, appears to be blocking something it has no actual power to block. Feeding back only what the formatter changed, rather than the full reformatted file, matters for the same reason a subagent's output contract matters — the point of the feedback is to give Claude exactly enough information to internalize the correction for its next edit in that file, and dumping the entire file back defeats that by drowning the one relevant piece of information in content that did not change and was never in question. Staying silent when the formatter made no changes is not a minor politeness, it is what keeps this hook actually useful over a long session — a hook that reports something on every single edit, whether or not there was anything to report, trains the exact kind of habitual disregard for its own output that a hook reporting rarely but meaningfully avoids, since a human or a model skimming past constant no-op noise is statistically much more likely to also skim past the one time the noise actually mattered. Separating a formatter crash from a routine formatting change in the feedback channel matters because the two carry very different implications — a formatter erroring on a file the edit just produced is frequently a signal that the edit introduced a real syntax problem, not merely a style issue, and collapsing that into the same generic feedback message as an ordinary auto-format hides exactly the information a session would most need to notice quickly.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-02' }],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Claude Code PostToolUse hooks (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'claude-code-notebook-data-analysis-workflow',
    category: 'claude-code',
    title:
      "Run a notebook data analysis with Claude Code's NotebookEdit without losing outputs",
    description:
      "A cell-level notebook workflow prompt that has Claude Code edit a Jupyter notebook through NotebookEdit rather than a whole-file rewrite, preserving already-computed cell outputs that took real time to generate unless a cell's actual inputs changed, and requiring a stated hypothesis before an exploratory cell runs.",
    promptText:
      "You are working in {{notebook_path}} through the NotebookEdit tool, editing at the cell level, not regenerating the notebook file as a whole. A notebook's cell outputs, especially ones that took a long time to compute, are themselves valuable artifacts — treat re-running a cell that does not need to change as a real cost, not a free action.\n\nANALYSIS GOAL\n{{analysis_goal}}\n\nDATASET\n{{dataset_description}}\n\nWHICH CELLS ARE EXPENSIVE TO RE-RUN\n{{expensive_cells}}\n\nWHEN AN OUTPUT MUST BE PRESERVED VERSUS RECOMPUTED\n{{output_preservation_rule}}\n\nWORKING RULES\n1. Before editing any cell listed in {{expensive_cells}}, confirm whether this specific change actually alters that cell's inputs or logic. If it does not, do not re-run it — the existing output is still valid evidence and re-running it purely out of habit wastes real time or compute for no new information.\n2. Before writing and running a new exploratory cell, state the specific hypothesis it is testing — what result would confirm it, what result would disconfirm it — before executing it, not after looking at the output and narrating a story that fits whatever appeared. A cell run with no stated expectation beforehand invites explaining away a result that does not actually support the analysis's conclusion.\n3. When adding a new cell, insert it at the position where it belongs in the analysis narrative, not appended at the end of the notebook regardless of where its result is actually relevant — a notebook read top to bottom should tell a coherent story, and cells scattered out of narrative order defeat that for the next person who opens this file.\n4. If a change to an early cell would invalidate the output of a later cell that depends on it, per {{output_preservation_rule}}, say so explicitly and either re-run the dependent cell or flag its now-stale output rather than leaving a stale result sitting uncorrected next to a change that quietly invalidated it.\n\nFINAL CELL\nEnd the notebook with a markdown cell summarizing the actual findings in plain language, citing the specific cells whose output supports each claim — a finding stated without pointing back to the cell that produced it is not distinguishable from a guess to anyone reviewing the notebook later.\n\nCONSTRAINTS\n- Do not silently delete an existing cell's output when editing that cell's code, unless the edit means the old output no longer corresponds to anything real; a notebook's history of what was actually tried is itself useful context for whoever reviews this analysis next.\n- Cite {{dataset_description}}'s actual known limitations when interpreting a result, rather than presenting a finding as more conclusive than the data underlying it can actually support.\n\nOUTPUT\nThe notebook edits made, cell by cell, and the final summary cell's content.",
    variables: [
      {
        name: 'notebook_path',
        description: 'The notebook file being worked in.',
        example: 'analysis/prompt_engagement_by_category.ipynb',
        required: true,
      },
      {
        name: 'analysis_goal',
        description: 'What this notebook is actually trying to find out.',
        example:
          'Whether prompts with an exampleOutput field get meaningfully more time-on-page than prompts without one, across all tier-1 categories.',
        required: true,
      },
      {
        name: 'dataset_description',
        description: 'What data this analysis draws on, including known limitations.',
        example:
          'Page-analytics export covering the last 60 days; sample size for some smaller categories is under 200 sessions, too small to treat a small difference as significant.',
        required: true,
      },
      {
        name: 'expensive_cells',
        description:
          'Which cells are costly to re-run, so they are not re-executed by habit.',
        example:
          'Cell 3, which joins the full analytics export against the prompt-library metadata and takes about four minutes to run.',
        required: true,
      },
      {
        name: 'output_preservation_rule',
        description: 'When an existing output must be kept versus recomputed.',
        example:
          'Any cell whose output depends on cell 3’s join must be re-run if cell 3 changes; cells that only reformat an already-computed result do not need cell 3 to change to stay valid.',
        required: false,
      },
    ],
    targetTools: ['Claude Code'],
    tags: ['jupyter', 'notebookedit', 'data-analysis', 'notebooks', 'reproducibility'],
    whyItWorks:
      "NotebookEdit operates at the level of an individual cell rather than the notebook file as a whole, and that granularity is not incidental to how this prompt works, it is the entire reason cell-level discipline is possible at all — a whole-file rewrite approach has no natural place to preserve one cell's expensive output while changing another cell entirely, whereas an edit scoped to exactly the cell that needs to change can leave every other cell, including its already-computed output, untouched by construction. Treating a cell's output as a valuable artifact rather than something regenerated by default matters specifically because notebooks are the one common code format where the result of running the code is saved alongside the code itself, and a four-minute join that already ran and produced a correct result is genuinely different from four minutes of redundant recomputation that produces the identical result a second time — checking whether a given change actually touches a cell's inputs before re-running it is the difference between respecting that saved state and discarding it out of habit. Requiring a stated hypothesis before an exploratory cell runs, rather than after its output already exists, targets a specific and well-documented failure mode in exploratory analysis: a result interpreted after the fact, with no prior stated expectation to measure it against, is far more susceptible to being explained into supporting whatever conclusion the analysis was already leaning toward, since there is no earlier, uncontaminated statement of what would have counted as evidence against it. Keeping cells in narrative order rather than appended wherever convenient matters because a notebook is read top to bottom by a future reviewer who was not present while it was built, and a notebook whose cell order reflects the order things were tried rather than the order the analysis's own logic actually flows in forces that reviewer to reconstruct the real narrative themselves, precisely the same cost a flat file-by-file codebase walkthrough imposes on a new engineer. Requiring the final summary to cite the specific cell backing each claim closes the loop on the same principle — a finding stated without a pointer back to the evidence that produced it is, to anyone who did not personally watch the analysis happen, indistinguishable from an assertion made with no evidence at all.",
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-03' }],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Claude Code NotebookEdit workflows (Sonnet 4.6).',
      },
    ],
  },
]
