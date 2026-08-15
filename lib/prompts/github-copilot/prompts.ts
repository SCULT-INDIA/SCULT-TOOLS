import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'github-copilot-repo-instructions-md',
    category: 'github-copilot',
    title: 'Write a .github/copilot-instructions.md file Copilot actually follows',
    description:
      'A repository-wide custom-instructions file that Copilot loads automatically into every Chat request, code-review pass, coding-agent session, and commit or PR-description generation in this repo, written so each rule holds up standing alone instead of only in the context it was written in.',
    promptText:
      "# Repository custom instructions for GitHub Copilot\n# Save as .github/copilot-instructions.md at the repo root. Copilot loads this automatically into\n# every Copilot Chat request, every automated code-review pass, every coding-agent session, and\n# every commit-message and pull-request-description generation in this repository — you never\n# retype any of it per conversation.\n\n## What this project is\n{{project_name}} — {{tech_stack}}\n\n## Conventions Copilot must apply by default, unprompted\n{{coding_conventions}}\n\n## Patterns to reject outright, not just discourage\n{{forbidden_patterns}}\n\n## What matters most when Copilot is reviewing a change here\n{{review_priorities}}\n\n## Generated or vendored paths these rules do not govern\n{{generated_paths}}\n\nCopilot has no built-in way to scope this particular file to a subdirectory, so say explicitly\nwhich paths sit outside these rules rather than letting a convention written for hand-authored\nsource code get silently applied to a generated lockfile, a vendored dependency, or a build\noutput directory where enforcing it would be actively wrong rather than merely unhelpful.\n\n## Interaction with path-scoped instructions\nIf a more specific .github/instructions/*.instructions.md file elsewhere in this repo also\napplies to the code Copilot is currently touching, both files are added to context together —\nthis file's rules and the path-scoped file's rules combine, they do not override each other. Do\nnot repeat a rule here that a path-scoped file already states more precisely for its own\ndirectory; repeating the general version at the repo-wide level only means it wins the reader's\nattention first, which defeats the reason the narrower file exists at all.\n\n## How to write every rule above\nEach line here gets re-checked and re-applied on every single request Copilot handles in this\nrepository, with no surrounding conversation available to disambiguate it — write every rule so\nit holds standing alone, never only in combination with a sentence written three lines above it.\nPrefer one short declarative sentence over a paragraph of context: 'Never use the any type\nwithout a comment justifying it' is a rule Copilot can check itself against; 'we try to keep\nthings reasonably well typed' is not, because there is no failing case it actually rules out. If\na convention only makes sense with an example, give the example in the same bullet, not as a\nseparate note two sections away that a single-request read might never reach in combination.\n\n## Maintenance\nThe first time Copilot suggests something that directly contradicts a rule in this file, treat\nthat as a signal the rule is unclear or missing a case, not a one-off mistake to wave off — add\nthe missing case immediately, in the same session, rather than filing it away to fix later. A\nrule that has quietly stopped being true and is never removed is worse than no rule at all,\nbecause every future session trusts it by default without re-verifying it against the current\ncode.",
    variables: [
      {
        name: 'project_name',
        description:
          'The name of the repository, so Copilot names itself and its output correctly across generated docs and commit messages.',
        example: 'tools.scult.in',
        required: true,
      },
      {
        name: 'tech_stack',
        description:
          'Languages, frameworks, and key libraries, so Copilot stops suggesting patterns from a different stack.',
        example:
          'Next.js 15 App Router, TypeScript strict mode, Tailwind CSS, Biome for lint and format',
        required: true,
      },
      {
        name: 'coding_conventions',
        description:
          'Project-specific conventions Copilot should apply by default, as a short bullet list.',
        example:
          '- Prefer named exports over default exports.\n- Co-locate component tests next to the component, not in a separate __tests__ tree.\n- Use the existing cn() helper for conditional class names, never template-literal concatenation.',
        required: true,
      },
      {
        name: 'forbidden_patterns',
        description:
          'Explicit anti-patterns to reject, stated as hard rules rather than preferences.',
        example:
          '- Never use the any type without a comment justifying it.\n- Never add a new npm dependency without flagging it in the PR description first.',
        required: true,
      },
      {
        name: 'review_priorities',
        description:
          'What Copilot code review and Copilot Chat should weight most heavily when judging a change in this repo.',
        example:
          'Accessibility of any new UI component, and whether new API routes validate input with a schema before touching the database.',
        required: false,
      },
      {
        name: 'generated_paths',
        description:
          "Paths this file's rules do not govern, since Copilot cannot scope copilot-instructions.md to a subdirectory on its own.",
        example:
          '.next/, coverage/, and any *.generated.ts file — build output and generated code, not hand-written source.',
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
      'onboarding',
    ],
    whyItWorks:
      "A .github/copilot-instructions.md file is loaded automatically into context for every Copilot Chat request, every automated code-review pass, every coding-agent session, and every commit-message and pull-request-description generation in that repository — unlike a rule typed into one chat, which is scoped to that single conversation and gone the moment it ends. This is also the file the coding agent reads before it starts working on an assigned issue, so a constraint written here bounds its autonomous behavior on a PR you never watched it write, not just its behavior in an interactive chat you are present for. GitHub's own guidance for this file is explicit that short, specific, self-contained statements apply more consistently than long prose, because Copilot has to re-derive the applicable rule from the instructions file plus the current task on every single request — a rule that only makes sense in combination with another sentence three lines up gets dropped more often than one that stands alone. The maintenance discipline matters for a related reason: because this file is trusted by default on every future session without re-verification, a stale claim does not just mislead one conversation, it silently misleads every session for as long as it stays uncorrected, which is why treating a contradicted rule as a signal to fix immediately — rather than a one-off mistake — is the only way the file stays worth trusting months later. Finally, understanding that path-scoped instructions combine with this file rather than override it changes how you should actually write repo-wide rules: a rule repeated at both levels does not get resolved by precedence, it just adds noise, so the repo-wide file should state what is true everywhere and leave the narrower exception to the file whose whole job is stating it precisely.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.269 (VS Code)',
        date: '2026-07-20',
      },
      {
        tool: 'GitHub Copilot coding agent',
        version: 'GA release, 2026-06',
        date: '2026-07-21',
      },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Copilot Chat 1.269 (VS Code) and the Copilot coding agent.',
      },
    ],
  },
  {
    slug: 'github-copilot-path-scoped-instructions',
    category: 'github-copilot',
    title:
      "Scope Copilot's instructions to one directory with an applyTo instructions file",
    description:
      'A path-scoped .github/instructions/*.instructions.md template using the applyTo frontmatter glob, so a directory-specific rule — a different test framework, a stricter API contract, a legacy pattern that must not spread — applies only where it is actually true instead of polluting the repo-wide instructions file.',
    promptText:
      "# Path-scoped custom instructions for GitHub Copilot\n# Save as {{instructions_file_path}} — files under .github/instructions/ apply only to the paths\n# matched by their applyTo glob, layered on top of .github/copilot-instructions.md rather than\n# replacing it, for any Copilot Chat request or coding-agent session touching a matching file.\n\n---\napplyTo: '{{applyTo_glob}}'\n---\n\n## Why this directory gets its own rules\n{{path_description}}\n\n## Rules that apply only here\n{{path_specific_rules}}\n\n## Where this deliberately differs from the repo-wide instructions\n{{conflicting_repo_rule}}\nState the difference explicitly rather than leaving Copilot to notice a contradiction and guess\nwhich file wins — both files are added to context together for a matching request, so an unstated\nconflict is a coin flip, not a resolved rule.\n\n## A change that should have been caught by this file but was not\n{{example_violation}}\nIf a real instance already happened, name it — a rule justified by a concrete miss is easier to\ntrust than one written speculatively, and it gives Copilot a worked example of the exact mistake\nthis file exists to prevent, in a form more specific than the rule statement alone.\n\n## Keeping the glob honest\nTest the applyTo glob against the actual file tree before relying on it, not just against the one\nfile you had in mind when writing it — a glob written to match 'tests under this directory' can\njust as easily match an unrelated fixtures folder that happens to share a path segment, silently\napplying a rule meant for one kind of file to a completely different one nearby. If the directory\nthis file governs gets restructured later, this file has to move or its glob has to be rewritten\nin the same change — an instructions file whose glob no longer matches anything real is worse than\na missing one, because it looks like coverage exists when it does not.\n\n## If more than one instructions file matches the same file\nTwo different applyTo globs can both match a single file if their scopes overlap even in part —\nsay directly whether that is expected and, if so, which file's rule should be treated as more\nspecific when they seem to disagree, since Copilot has no way to infer an intended priority\nbetween two files that were each written independently of the other.",
    variables: [
      {
        name: 'instructions_file_path',
        description: 'Where this path-scoped instructions file should be saved.',
        example: '.github/instructions/tests.instructions.md',
        required: true,
      },
      {
        name: 'applyTo_glob',
        description:
          "The glob pattern that determines which files this file's rules apply to.",
        example: 'tests/**/*.spec.ts',
        required: true,
      },
      {
        name: 'path_description',
        description:
          'Why this directory needs its own rules instead of relying on the repo-wide file.',
        example:
          "Tests under tests/ use Vitest with a custom fixture loader, a different pattern than the Jest conventions the rest of the repo's older suites still follow.",
        required: true,
      },
      {
        name: 'path_specific_rules',
        description: 'The rules that apply only within the matched glob.',
        example:
          '- Import the shared fixture loader from tests/fixtures/index.ts instead of building test data inline.\n- Never use jest.mock — this directory has no Jest dependency at all.',
        required: true,
      },
      {
        name: 'conflicting_repo_rule',
        description:
          "Where this file's rules deliberately depart from the repo-wide instructions.",
        example:
          'The repo-wide instructions say to colocate tests next to components; this directory is the deliberate exception for integration tests that span multiple components.',
        required: false,
      },
      {
        name: 'example_violation',
        description:
          'A real instance of the mistake this file exists to prevent, if one occurred.',
        example:
          'A generated test in this directory once called jest.mock directly, which failed at runtime since Jest is not installed here at all.',
        required: false,
      },
    ],
    targetTools: [
      'GitHub Copilot Chat (VS Code)',
      'GitHub Copilot coding agent',
      'GitHub Copilot code review',
    ],
    tags: [
      'path-scoped-instructions',
      'applyTo',
      'context-engineering',
      'monorepo',
      'custom-instructions',
    ],
    whyItWorks:
      "The applyTo glob is matched against the actual files present in a given request's context, so a rule scoped this way only enters the model's attention when it is relevant — a directory-specific caveat about test tooling or a legacy pattern does not have to compete for attention on every unrelated request the way it would if it were stuffed into the repo-wide copilot-instructions.md file just because there was nowhere narrower to put it. The two files genuinely combine rather than override each other, which is why the conflicting_repo_rule section has to state a difference explicitly rather than leaving it implicit — Copilot has no mechanism to infer that a path-scoped file is meant to take precedence over a repo-wide statement it contradicts; both simply arrive in context together, and an unstated disagreement between them is resolved however the model happens to weigh two contradictory instructions in that moment, which is not a resolution you actually chose. Glob correctness matters more than it looks, because a wrong glob fails in two opposite and equally quiet ways: an over-narrow glob silently matches nothing, so the file sits in the repo looking like coverage exists while providing none, and an over-broad glob matches an unrelated directory that happens to share a path segment, applying a narrow rule where it was never meant to hold. Naming a concrete example_violation, when one exists, functions the way a worked example functions in any instruction set — it gives the model a specific, checkable instance of the mistake rather than only an abstract rule, which is a real difference in how reliably a model pattern-matches a new but similar situation against a rule it has actually seen violated once versus a rule it has only been told about.",
    exampleOutput:
      "applyTo: 'tests/**/*.spec.ts'. Rule: import the shared fixture loader from tests/fixtures/index.ts instead of building test data inline; never call jest.mock, since this directory has no Jest dependency. Noted conflict: the repo-wide file says colocate tests next to components — this directory is the stated exception for cross-component integration tests.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.269 (VS Code, path-scoped instructions)',
        date: '2026-07-21',
      },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Copilot Chat 1.269 (VS Code) applyTo path-scoped instructions.',
      },
    ],
  },
  {
    slug: 'github-copilot-custom-chat-mode',
    category: 'github-copilot',
    title:
      'Define a custom Copilot Chat mode instead of re-explaining your workflow every session',
    description:
      'A .github/chatmodes/*.chatmode.md definition — scoped tools, a fixed model, and a narrow system prompt — that turns a repeated review-and-plan style of conversation into a mode you switch into once, instead of a persona you re-describe in the first message every time.',
    promptText:
      "Define a custom Copilot Chat mode as a single markdown file, ready to save at\n{{chatmode_file_path}}. The filename fixes the mode's name in the chat mode picker, so name the\nfile for exactly how you want it to read in that dropdown.\n\nMODE PURPOSE\n{{mode_purpose}}\n\nTOOLS THIS MODE NEEDS, AND ONLY THESE\n{{mode_tools_scope}}\n\nMODEL FOR THIS MODE\n{{mode_model}}\n\nSTRUCTURE THE FILE AS\n1. YAML frontmatter with: description (one sentence, shown in the mode picker, so someone choosing\n   between modes can tell them apart without opening the file), tools (an explicit list — do not\n   grant edit or terminal access to a mode whose whole point is read-only review), and model (set\n   to {{mode_model}} if this mode's work is well suited to a specific model rather than whatever\n   the main conversation happens to be using).\n2. Below the frontmatter, a system-prompt body addressed directly to Copilot, stating the one\n   thing this mode does, the tone or level of detail it should default to, and what it should\n   refuse to do even if asked mid-conversation to step outside that scope.\n3. An explicit statement of what this mode will not do, matched to what a user might otherwise\n   expect from a general chat mode — a review mode should say plainly that it will not also fix\n   what it finds, so switching into review mode does not silently produce edits nobody asked this\n   mode for.\n\nSCOPE OF THIS FILE\nSay whether this mode belongs in this repository's .github/chatmodes/ directory, where every\ncollaborator with this repo open gets it automatically, or in a personal user-profile location\nthat only you see — a team-wide review mode belongs in the repo; a personal shorthand you find\nuseful but have not checked whether the rest of the team would want belongs in your own profile\nuntil you have.\n\nCONSTRAINTS\n- Do not build one mode that tries to cover two different jobs by switching behavior based on\n  phrasing — if {{mode_purpose}} is really two jobs, say so and propose two mode files instead of\n  one mode that behaves inconsistently depending on how it is asked.\n- If this mode overlaps with an existing one in {{existing_modes}}, name the overlap and say\n  whether the two should merge or whether the boundary between them needs to be sharper.\n- Keep the body's tone instruction concrete and checkable — not 'be helpful and concise' but a\n  stated default such as 'lead every response with the verdict, then the reasoning, never the\n  reverse.'\n\nOUTPUT\nThe complete file content, frontmatter and body, ready to paste as-is. After it, one sentence on\nwhat a user in this mode still has to switch to a different mode to do.",
    variables: [
      {
        name: 'chatmode_file_path',
        description:
          'Where the custom chat mode file should be saved, which fixes its name in the picker.',
        example: '.github/chatmodes/pr-reviewer.chatmode.md',
        required: true,
      },
      {
        name: 'mode_purpose',
        description: 'The one job this mode should do, stated narrowly.',
        example:
          'Review a diff for correctness, test coverage, and scope creep, and produce a structured verdict — never propose or apply an edit.',
        required: true,
      },
      {
        name: 'mode_tools_scope',
        description: 'The exact tools this mode needs and nothing more.',
        example:
          'Read, Grep, and a Bash pattern scoped to git diff and git log only — no Edit, no Write, no unrestricted Bash.',
        required: true,
      },
      {
        name: 'mode_model',
        description:
          'Which model this mode should default to, if a specific one suits the job better than the conversation default.',
        example:
          'the strongest reasoning-oriented model available in the picker, since review quality matters more than latency here',
        required: false,
      },
      {
        name: 'existing_modes',
        description:
          'What already exists in the chat modes directory, so overlap can be flagged.',
        example:
          'chatmodes/ currently has plan.chatmode.md (planning only) and explain.chatmode.md (teaching-oriented explanations).',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)'],
    tags: [
      'custom-chat-modes',
      'chatmode',
      'workflow-automation',
      'tool-scoping',
      'vs-code',
    ],
    whyItWorks:
      "A chat mode's tools frontmatter field is an enforced permission boundary just like a subagent's or a slash command's tool grant — scoping a review mode to Read, Grep, and a narrow Bash pattern rather than the full default tool set means the mode cannot edit a file or run an arbitrary command even if its own reasoning drifted toward doing so mid-conversation, which is a materially stronger guarantee than a prompt that simply asks it not to make changes. The mode picker's one-line description is not documentation, it is the actual disambiguation signal a user reads before selecting between modes — a vague description produces exactly the failure a menu with unclear labels always produces, picking the wrong option because two entries sound similar enough that the difference between them was never actually stated. Deciding between saving the file in the repo's own .github/chatmodes/ directory versus a personal user-profile location is a real fork with different consequences, not a formatting choice: a repo-level mode is inherited automatically by every collaborator who opens that workspace, so a personal shorthand saved there becomes a decision the rest of the team is opted into without having agreed to it, while a personal-profile mode stays exactly that until someone deliberately promotes it. The instruction against building one mode that covers two different jobs by switching behavior on phrasing targets the actual reason a mode is worth defining at all — a mode's value is that switching into it is unambiguous about what will happen, and a mode that sometimes reviews and sometimes also drafts a fix depending on how it is asked has quietly reintroduced the exact ambiguity a dedicated mode exists to remove.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.269 (VS Code, custom chat modes)',
        date: '2026-07-22',
      },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Copilot Chat 1.269 (VS Code) custom chat modes.',
      },
    ],
  },
  {
    slug: 'github-copilot-reusable-prompt-file',
    category: 'github-copilot',
    title:
      'Turn a prompt you keep retyping into a Copilot prompt file instead of pasting it again',
    description:
      'A .github/prompts/*.prompt.md reusable prompt file with input placeholders, invoked as a slash command from the Chat input box, so a well-tuned multi-paragraph prompt becomes one command instead of a paste you have to keep re-finding.',
    promptText:
      "Write a reusable Copilot Chat prompt file, ready to save at {{prompt_file_path}}. The filename\nbecomes the slash command you type in the Chat input box to invoke it, so name the file for\nexactly the command you want to type.\n\nTASK THIS PROMPT FILE SHOULD DO EVERY TIME IT IS INVOKED\n{{prompt_body_task}}\n\nINPUTS IT SHOULD ACCEPT WHEN INVOKED\n{{input_placeholders_needed}}\n\nSTRUCTURE THE FILE AS\n1. YAML frontmatter: mode ({{target_mode}} — pick the narrowest mode that can actually do the\n   job; do not default to an editing-capable mode for a task that only needs to read and answer),\n   tools (only if the mode is edit- or agent-capable and the task genuinely needs specific tool\n   access, listed explicitly rather than inherited broadly), and description (one sentence\n   describing the command, since this is what shows in the slash-command list when a user types\n   the trigger character and starts scrolling).\n2. The body, written as a direct instruction to Copilot, with the accepted inputs from\n   {{input_placeholders_needed}} referenced using the prompt-files feature's own input-placeholder\n   syntax rather than typed out as a literal string the user is expected to manually substitute\n   themselves — the whole benefit of a prompt file over a saved snippet is that the input gets\n   filled in at invocation time, not read and re-typed by a human first.\n3. An explicit output contract at the end of the body: the exact section headers or shape this\n   prompt file must produce every time, so invoking it on Monday and again on Friday, on different\n   input, produces comparably structured output rather than two differently organized answers\n   that happen to share a slash command.\n\nHOW THIS DIFFERS FROM A CUSTOM CHAT MODE\nA prompt file is one task invoked with one command and closed; a custom chat mode is a whole\nconversational stance you switch into and stay in across many turns. If what you actually want is\na standing way of talking to Copilot for an entire session rather than a single repeatable task\nwith inputs, a chat mode is the better fit — do not force a multi-turn workflow into a single\nprompt-file invocation just because a prompt file was the first mechanism that came to mind.\n\nCONSTRAINTS\n- If {{prompt_body_task}} genuinely needs file or workspace context beyond the invocation-time\n  input, say explicitly what that context is rather than assuming Copilot will infer it from the\n  current tab, since a prompt file is often invoked from a different file than the one its author\n  had open while writing it.\n- Do not have this prompt file perform a mutating action unless {{target_mode}} explicitly calls\n  for an editing-capable mode and the task genuinely requires it — a prompt file meant to be run\n  repeatedly and quickly should not surprise its user with an unexpected file change.\n- If {{existing_prompts_dir}} already has a prompt file doing something similar, name the overlap\n  rather than adding a near-duplicate command that a future user will not know which one to reach\n  for.\n\nOUTPUT\nThe complete file content, frontmatter and body, ready to paste as-is. After it, one sentence\nstating what this prompt file explicitly does not do that a user might otherwise assume from its\nname.",
    variables: [
      {
        name: 'prompt_file_path',
        description:
          'Where the prompt file should be saved, which fixes the slash command it exposes.',
        example: '.github/prompts/changelog-entry.prompt.md',
        required: true,
      },
      {
        name: 'prompt_body_task',
        description:
          'The task this prompt file should do every single time it is invoked.',
        example:
          'Read the staged diff and the most recent five entries in CHANGELOG.md, then draft one new entry in the same format and tone as the existing ones.',
        required: true,
      },
      {
        name: 'input_placeholders_needed',
        description: 'What the prompt file should accept as input when invoked.',
        example:
          'An optional short label for the type of change — feature, fix, or chore — defaulting to inferring it from the diff if omitted.',
        required: true,
      },
      {
        name: 'target_mode',
        description:
          'The narrowest chat mode (ask, edit, or agent) that can actually perform this task.',
        example:
          'ask — this only reads and drafts text, it never edits CHANGELOG.md directly.',
        required: false,
      },
      {
        name: 'existing_prompts_dir',
        description:
          'What already exists in the prompts directory, so overlap can be flagged.',
        example:
          '.github/prompts/ currently has commit-message.prompt.md and pr-description.prompt.md.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)'],
    tags: [
      'prompt-files',
      'reusable-prompts',
      'slash-commands',
      'workflow-automation',
      'vs-code',
    ],
    whyItWorks:
      "A prompt file's filename is not cosmetic — it is the literal slash-command string Copilot Chat exposes once the file exists in the prompts directory, the same load-bearing-filename mechanic that makes a saved custom command invokable at all rather than just a markdown file sitting unused in a folder. The mode field is a real, enforced capability boundary rather than a description of intended behavior: a prompt file set to the narrowest read-only mode that can do the job is structurally incapable of editing a file even if its own body were somehow read in a way that suggested it should, which matters specifically because a prompt file is invoked by a short trigger with no surrounding conversation to reconsider intent in the moment. The input-placeholder syntax is the actual reason a prompt file beats a saved snippet of the same wording — a snippet still requires a human to read it, notice what needs to change for this invocation, and manually edit that part before pasting, while a genuine input placeholder gets filled in in the same action that invokes the command, which is the entire efficiency gain a prompt file is supposed to deliver over pasting a slightly-edited copy of the same paragraph each time. The explicit output contract solves the real failure mode of any reusable prompt invoked fresh with new input each time: because nothing else pins the output shape down, the same wording run on two different occasions can drift into two differently structured answers, which quietly defeats the reason to have made it a standing command instead of a slightly-varying paste. Finally, distinguishing a prompt file from a custom chat mode by task duration — one invocation and closed, versus a conversational stance maintained across many turns — matters because forcing a genuinely multi-turn workflow into a single-invocation prompt file produces a command that either does too little per invocation to be useful or has to be re-run repeatedly in a way a chat mode was actually built to avoid.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.269 (VS Code, prompt files)',
        date: '2026-07-22',
      },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Copilot Chat 1.269 (VS Code) reusable prompt files.',
      },
    ],
  },
  {
    slug: 'github-copilot-task-specific-generation-instructions',
    category: 'github-copilot',
    title:
      'Configure separate Copilot instructions for commit messages, PR descriptions, reviews, and tests',
    description:
      "A VS Code settings.json block wiring distinct instruction sets for commit-message generation, pull-request-description generation, code review, and test generation, so each of Copilot's task-specific generators gets rules suited to what it is actually producing instead of inheriting one general-purpose file uniformly.",
    promptText:
      "Add task-specific Copilot instructions to {{settings_json_path}}, one block per generation\ntask, instead of relying on .github/copilot-instructions.md to cover all of them at once — that\nfile is added to every request regardless of what kind of task it is, so a rule that only makes\nsense for a commit message competes for attention on a totally unrelated code-review pass, and\nvice versa.\n\nSCOPE\n{{scope}}\n\nCOMMIT MESSAGE GENERATION\n{{commit_message_rules}}\n\nPULL REQUEST DESCRIPTION GENERATION\n{{pr_description_rules}}\n\nTEST GENERATION\n{{test_generation_rules}}\n\nCODE REVIEW\n{{review_rules}}\n\nPRODUCE\nA settings.json fragment with a separate instructions array for each of the four generation\nsettings above, each entry either the literal text or a 'file:' reference to a markdown file\nunder the repo, whichever keeps the rule closer to where it will actually be read and maintained.\nFor any rule long enough to need examples or a bulleted list, prefer a 'file:' reference over an\ninline string — a long inline instruction string in settings.json is unreadable in a diff and\ninvites someone to edit it sloppily under time pressure.\n\nCONSTRAINTS\n- Do not repeat a rule that already exists in .github/copilot-instructions.md unless the\n  task-specific version is meaningfully different for this generation task — a rule about\n  variable naming belongs in the general file; a rule about how PR descriptions should open with\n  the affected user-facing behavior before any implementation detail belongs only here, because it\n  is not true of every Copilot interaction, only this specific generation task.\n- If {{scope}} is workspace-level settings checked into the repo, confirm every rule is genuinely\n  team-wide and does not encode one person's personal preference the rest of the team never agreed\n  to — a workspace setting applies to every collaborator who opens this repo, unlike a user-level\n  setting that stays personal.\n- Flag any rule here that assumes information Copilot cannot actually see for that generation task\n  — for example, a commit-message rule referencing a linked ticket number only works if that\n  ticket ID is actually present in the branch name, the staged diff, or a co-located file Copilot\n  can read; do not write a rule assuming context that has no path into the model's input.\n\nOUTPUT\nThe complete settings.json fragment, plus one line per section noting whether the instructions\nare inline or point to a file, and why.",
    variables: [
      {
        name: 'scope',
        description:
          'Whether these settings are workspace-level (checked into the repo) or user-level (personal).',
        example:
          'Workspace settings, checked into .vscode/settings.json so every collaborator on this repo gets the same rules automatically.',
        required: true,
      },
      {
        name: 'commit_message_rules',
        description:
          'Rules specific to how commit messages should be generated for this repo.',
        example:
          'Subject line under 72 characters, imperative mood, states the user-facing effect of the change, never the mechanism.',
        required: true,
      },
      {
        name: 'pr_description_rules',
        description:
          'Rules specific to how pull-request descriptions should be generated.',
        example:
          'Open with the affected user-facing behavior before any implementation detail; always include a manual test-plan checklist.',
        required: true,
      },
      {
        name: 'test_generation_rules',
        description:
          'Rules specific to how generated tests should be structured for this repo.',
        example:
          'Default to Vitest; always include at least one edge-case test per generated function, never only the happy path.',
        required: true,
      },
      {
        name: 'review_rules',
        description:
          'Rules specific to what automated code review should weight most heavily.',
        example:
          'Weight authorization checks and input validation above stylistic concerns on every reviewed diff.',
        required: false,
      },
      {
        name: 'settings_json_path',
        description: 'Where the settings fragment should be added.',
        example: '.vscode/settings.json',
        required: false,
      },
    ],
    targetTools: [
      'GitHub Copilot Chat (VS Code)',
      'GitHub Copilot (VS Code Source Control)',
    ],
    tags: [
      'settings-json',
      'commit-messages',
      'pull-requests',
      'test-generation',
      'code-review',
      'custom-instructions',
    ],
    whyItWorks:
      "Copilot exposes commit-message, pull-request-description, test-generation, and code-review instructions as genuinely separate settings, distinct from the repo-wide copilot-instructions.md that is added to every request regardless of task — splitting rules across them this way matters because a rule crammed into the general file for one specific generation task competes for the model's attention on every unrelated request too, diluting the signal on the requests it was actually written for while adding noise everywhere else. The choice between an inline instruction string and a 'file:' reference is not a style preference but a maintainability one grounded in what settings.json actually looks like in a diff — a long inline string reviewed as a single-line JSON value gives a reviewer almost nothing to check a change against, while a referenced markdown file diffs the same way any other prose document does, line by line, which is the difference between a rule someone can actually review being edited and a rule someone approves editing sight-unseen because reading it in that format is unpleasant enough that nobody does. The workspace-versus-user-level distinction has real teeth: a workspace setting checked into the repo is inherited by every collaborator the moment they open it, so a rule encoding one person's personal taste rather than a genuine team agreement becomes something the whole team is opted into without having agreed to it, which is a materially different mistake than the same preference living harmlessly in that one person's own user settings. Flagging rules that assume information a given generation task cannot actually see targets a specific and easy mistake: each of these four generation settings receives a different slice of context by design — a commit-message generator sees the staged diff, a PR-description generator typically sees the fuller set of commits and the diff against the target branch — so a rule written assuming a ticket ID will be visible is only reliable if that ID is actually reachable from what that specific generation task is given, not from what a human happens to know while writing the rule.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot',
        version: 'VS Code Copilot Chat 1.270, task-specific generation settings',
        date: '2026-07-23',
      },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against VS Code Copilot Chat 1.270 task-specific generation instructions.',
      },
    ],
  },
  {
    slug: 'github-copilot-workspace-issue-to-plan',
    category: 'github-copilot',
    title:
      'Force Copilot Workspace through spec, plan, and pilot before it writes real code',
    description:
      "A Copilot Workspace brief that keeps the tool's three built-in stages — specification, plan, and implementation — from collapsing into one pass, requiring a reviewable spec and a dependency-ordered plan, plus a one-file pilot for anything touching more than a couple of files.",
    promptText:
      "Open this issue in GitHub Copilot Workspace. Workspace has three distinct stages —\nspecification, plan, and implementation — and each one is individually editable before you\nadvance to the next; do not let it collapse straight to a diff. Stop at the end of each stage\nbelow and wait for explicit approval before Workspace proceeds to the next one.\n\nISSUE\n{{issue_summary}}\n\nACCEPTANCE CRITERIA\n{{acceptance_criteria}}\n\nCONSTRAINTS\n{{constraints}}\n\nOUT OF SCOPE\n{{out_of_scope}}\n\nSPECIFICATION STAGE\nWhen Workspace proposes the spec, check that it restates the problem in its own words rather than\nechoing the issue text back verbatim, names every file it currently believes it will touch, and\nflags — rather than silently resolves — any place the acceptance criteria above are genuinely\nambiguous. If the spec resolves an ambiguity without flagging it, reject it and ask specifically\nwhich interpretation it chose and why, before moving on.\n\nPLAN STAGE\nOnce the spec is approved, check the plan against these two things before approving it in turn:\nfirst, that its steps map one-to-one onto the numbered acceptance criteria, so nothing in the plan\nexists that the acceptance criteria did not ask for and nothing the acceptance criteria did ask\nfor is missing a corresponding step; second, given the rough scope of {{files_estimate}}, that\nfoundational files — shared types, config, anything another file in the plan depends on — are\nscheduled before the files that depend on them, not in whatever order Workspace happened to list\nthem.\n\nCHECKING CONSTRAINTS SPECIFICALLY\nBefore approving the plan, go back through every item in {{constraints}} individually and confirm\nthe plan actually satisfies it rather than simply not contradicting it outright — a constraint\nthat says an existing helper must be reused is violated just as much by a plan that quietly writes\na new parallel helper next to it as by one that removes the existing helper entirely, and only the\nsecond version is likely to be caught by skimming.\n\nIMPLEMENTATION STAGE\n{{pilot_file_hint}}\nIf this issue touches more than two or three files, ask Workspace to implement only the single\nfile named above first and stop, so a wrong approach costs one file's diff to revert rather than\nthe full change. Once that file's diff looks right against the approved plan, allow the rest to\nproceed.\n\nTHROUGHOUT ALL THREE STAGES\nDo not let Workspace treat a stage as a formality to click through quickly on its way to the code\n— an unread spec approved out of habit gives you nothing more than skipping it entirely would,\nexcept the appearance of having reviewed it. If any stage's output does not actually match what\nwas asked for in this brief, say so and regenerate that stage rather than accepting a close-enough\nversion and correcting it later once code already depends on it.",
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
      {
        name: 'files_estimate',
        description:
          "A rough sense of scope, so the plan's file ordering can be checked against something concrete.",
        example:
          'Roughly 4 files: the middleware, a new config constant, the export route handler, and one new test file.',
        required: false,
      },
      {
        name: 'pilot_file_hint',
        description:
          'Which single file should be implemented first as a pilot, if the issue touches several.',
        example:
          "Implement lib/middleware/rate-limit.ts's export-count check first as the pilot — it is the foundational piece everything else calls into.",
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Workspace'],
    tags: ['copilot-workspace', 'spec-review', 'planning', 'multi-file', 'scope-control'],
    whyItWorks:
      "Copilot Workspace's own architecture is three separate, individually editable steps — specification, plan, and implementation — precisely so a human can validate what the tool understood and what it intends to do before a single line of code exists; a brief that never separates what must be true (acceptance criteria) from what must not change (constraints, out of scope) gives the specification step nothing to slow down for, so it collapses back toward restating the issue title in slightly more words and calling that a spec. Requiring the plan's steps to map one-to-one onto the numbered acceptance criteria turns 'does this plan look reasonable' into a checkable claim — a step that exists with no corresponding acceptance criterion is scope creep introduced at the planning stage, and a criterion with no corresponding step is a silent gap that would otherwise only surface once the PR is already open. Checking constraints individually rather than confirming the plan does not contradict them targets a specific and common failure: a plan can honor a constraint's letter while violating its intent, such as building a second parallel helper next to an existing one the constraint said to reuse, rather than removing or contradicting the existing helper outright — the second kind of violation is far more visible on a skim than the first, so a broad glance at the plan systematically under-catches it. The pilot-file requirement for anything beyond two or three files exists because Workspace's plan step reasons about dependency order in the abstract, on paper, before any code has actually been written against it — building one real file first is the cheapest possible test of whether that abstract ordering was actually right, and if it was not, the cost of finding out is one file's diff, not the full multi-file change. Finally, rejecting a spec that resolves an ambiguity without flagging it matters because a spec-generation step under no instruction to surface ambiguity will, by default, pick whichever reading is easiest to implement and present it with the same confidence as an unambiguous requirement — the review value of having a distinct spec stage at all depends entirely on being able to tell the difference between this was clear and this was resolved by guessing, and an unflagged resolution erases that distinction.",
    exampleOutput:
      'Spec (excerpt): Add a rolling 30-day export counter checked inside the existing rate-limit middleware before the export handler runs. Files: lib/middleware/rate-limit.ts (add export-count check), lib/config/limits.ts (new EXPORT_LIMIT_FREE_TIER constant), app/api/reports/export/route.ts (return the specified 403). Flagged ambiguity: acceptance criteria 3 says configurable — read as an environment-variable-backed constant, not a per-user database override, since no admin UI was mentioned in the issue. Confirm before advancing to the plan stage.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Workspace',
        version: 'GA, 2026 (spec/plan/implementation stages)',
        date: '2026-07-24',
      },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against GitHub Copilot Workspace GA.',
      },
    ],
  },
  {
    slug: 'github-copilot-coding-agent-scoped-issue',
    category: 'github-copilot',
    title: 'Write an issue tight enough to hand the Copilot coding agent unattended',
    description:
      "An issue template for the @copilot coding agent that bounds file scope, states a testable done-state, flags the sandbox's own network limits, and tells the agent exactly how to handle a blocker instead of guessing silently through it.",
    promptText:
      "Assign this issue to @copilot, the GitHub Copilot coding agent. It runs unattended in its own\nephemeral, Actions-backed sandbox, pushes commits to a draft pull request as it works, and only\nsurfaces back to a human through that PR and its own comments on it — write this issue as a brief\nfor an agent that cannot ask a clarifying question mid-task, only before it starts, or afterward\nin PR comments once a human replies.\n\nTASK\n{{task_summary}}\n\nFILES LIKELY IN SCOPE\n{{files_in_scope}}\n\nDONE WHEN\n{{done_state}}\n\nENVIRONMENT AND NETWORK NOTES\n{{environment_notes}}\nThe agent's sandbox has its own network allowlist, separate from what your own machine can reach —\ndo not assume it can install an arbitrary package or hit an external API just because your local\ndev environment can. If this task genuinely needs a dependency or a network call that is not\nalready allowed in the environment, say so here explicitly rather than letting the agent discover\nthe block partway through and improvise around it.\n\nRULES FOR THE AGENT\n- Stay inside the scope above. If the done-state above is provably unreachable without touching a\n  file outside it, explain exactly why in the PR description rather than silently expanding scope.\n- Run the existing test suite and lint before opening the PR, and paste the exact command output\n  in the PR description — not a claim that it passed, the actual output, since the PR description\n  is the only account of the work a reviewer who was not watching the run has access to.\n- If any part of this issue is ambiguous, state the ambiguity and the interpretation chosen in the\n  PR description, rather than picking silently and letting a reviewer discover the choice only by\n  reading the diff closely.\n- Open the PR as a draft and do not mark it ready for review until every item under DONE WHEN is\n  satisfied. A draft that looks finished but has not been marked ready is a signal worth trusting;\n  a ready PR that turns out incomplete costs a reviewer's time twice over.\n\nCOMMIT HYGIENE\nKeep commits scoped to a coherent unit of work rather than one giant commit at the end — a\nreviewer working through an autonomous agent's PR benefits from reading the commit history as a\nsequence of decisions, the same way they would review a human contributor's incremental work, not\nas a single undifferentiated diff.\n\n{{blocker_policy}}\n\n{{review_process}}\nWhen a human replies in a PR comment, treat that reply as the only new information the agent will\nget for the remainder of this task — there is no second channel back, so if the reply itself is\nambiguous, the agent should say so in a follow-up comment rather than guessing at the intended\nmeaning and pushing a new commit on that guess.",
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
          'A checkable list of conditions that define completion, not a vague description of intent.',
        example:
          '1. Button appears only when the report has at least one row. 2. Clicking it downloads a CSV matching the visible filtered rows. 3. Existing report page tests still pass; a new test covers the zero-rows case.',
        required: true,
      },
      {
        name: 'environment_notes',
        description:
          "What the agent's sandboxed environment can and cannot reach, so it does not discover a network block mid-task.",
        example:
          "The sandbox's network allowlist has not been extended for this repo — do not add any dependency that requires a fresh npm registry mirror or an external API call not already used elsewhere in lib/export/.",
        required: true,
      },
      {
        name: 'blocker_policy',
        description:
          'What the agent should do if it hits a genuine blocker it cannot resolve from the issue alone.',
        example:
          'If exportToCsv() cannot handle the filtered-view shape, stop, open the draft PR with a comment explaining exactly what is missing, and do not invent a new export implementation.',
        required: false,
      },
      {
        name: 'review_process',
        description:
          'How and when a human will respond in PR comments, so the agent knows what to expect.',
        example:
          'I will reply directly in PR comments within one business day; do not wait longer than that before pinging the thread again if no response arrives.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot coding agent'],
    tags: [
      'coding-agent',
      'issue-writing',
      'autonomous-pr',
      'sandboxed-agent',
      'scope-control',
    ],
    whyItWorks:
      "The coding agent runs unattended inside its own ephemeral, GitHub Actions-backed sandbox and only ever surfaces back to a human through the draft pull request and its own comments on it — a mid-task clarifying question is not part of that loop the way it is in an interactive Copilot Chat session, so any ambiguity left in the issue gets resolved by the agent's own judgment rather than caught before it costs anything, which is exactly why the ambiguity-and-interpretation rule in this brief has to be a hard requirement rather than a nice-to-have. The sandbox's own network allowlist is a genuinely separate failure surface from anything a human contributor would hit locally — a package that installs fine on a developer's own machine can be blocked entirely inside the agent's environment if it was never added to that environment's allowed destinations, and an agent that hits that block mid-task has no path to ask before improvising some workaround, which is precisely the scenario the environment-notes section exists to head off before the run even starts, not after it fails partway through. Requiring literal, pasted command output for tests and lint, rather than a claim that they passed, closes the specific failure mode where the agent's own account of its work is the only verification a reviewer who was not watching the run actually has access to — a reviewer checking a pasted 42 passed, 0 failed line is checking evidence; a reviewer trusting the sentence tests pass is trusting the same process that wrote the code to also grade it honestly, with no independent check in between. Marking the PR draft-only until every done-state item is satisfied turns a checklist that could otherwise be satisfied loosely into an actual release gate the agent has to check itself against before flipping the one bit that tells a human this is ready to look at. The instruction to treat a human's PR comment reply as the only new information available for the rest of the task matters because there genuinely is no second channel back — an ambiguous reply that the agent guesses at rather than questioning in a follow-up comment compounds a misunderstanding into another commit, on a task where the human already spent their one clarifying opportunity and does not know a guess was made at all until the next diff arrives.",
    exampleOutput:
      "PR description (excerpt): Implements CSV export on the filtered report view per the issue. Ambiguity encountered: filename format was not specified — used report-{id}-{date}.csv, matching the existing convention in lib/export/csv.ts's other call site. Test output: 47 passed, 0 failed (added export-zero-rows.test.ts). Ready for review.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot coding agent',
        version: 'GA release, 2026-06 (Actions-backed sandbox)',
        date: '2026-07-24',
      },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against the GitHub Copilot coding agent GA release.',
      },
    ],
  },
  {
    slug: 'github-copilot-agent-mode-task-brief',
    category: 'github-copilot',
    title:
      "Brief VS Code's Copilot agent mode for an autonomous task without losing the leash",
    description:
      "A task brief for Copilot's agent mode in VS Code — the mode that plans, edits across files, runs terminal commands, and iterates against its own results in a loop — scoped tightly enough with a stated done-state, terminal allowlist, and checkpoints that its autonomy stays inside a boundary you actually chose.",
    promptText:
      "Use Copilot agent mode for this task. Agent mode runs a loop inside this workspace — it plans,\nedits files, runs terminal commands, reads the results, and decides on its own whether to keep\ngoing or stop, which is exactly the behavior that needs a stated boundary before it starts, not\nafter it has already run for ten minutes.\n\nWHY THIS NEEDS A STATED BOUNDARY AT ALL\nUnlike a single Copilot Chat turn that proposes one edit and waits, agent mode chains many tool\ncalls together on its own judgment about what the next useful step is — the loop does not pause\nby default between an edit, a terminal run, and the next edit unless something here tells it to. A\nboundary that only exists in your head, not in this brief, is not actually a boundary agent mode\ncan act on.\n\nTASK\n{{agent_task}}\n\nWHAT COUNTS AS DONE — STATE THIS PRECISELY, AGENT MODE WILL STOP ITSELF ONCE IT BELIEVES THIS IS\nTRUE\n{{iteration_boundary}}\n\nTERMINAL COMMANDS THIS TASK IS ALLOWED TO RUN WITHOUT PAUSING FOR APPROVAL\n{{terminal_command_policy}}\nAnything outside this list should pause for manual approval, not run automatically, even if agent\nmode decides mid-task that a command outside this list would help it iterate faster — a wider\nterminal command touches more than this task's stated boundary was scoped to cover.\n\nPAUSE AND SHOW ME BEFORE CONTINUING WHEN\n{{checkpoint_requirement}}\n\nFILES THIS TASK SHOULD NOT TOUCH REGARDLESS OF WHAT SEEMS HELPFUL\n{{files_off_limits}}\n\nHOW TO WORK\nPlan briefly before the first edit, then work in a tight loop: make a change, run whatever check\nverifies it, read the actual result, and decide the next step from that result — not from an\nassumption about what the result probably was. If a check fails, do not immediately try a second\nunrelated fix; diagnose why the first attempt failed before attempting a second one, the same\ndiscipline that applies to debugging by hand.\n\nSTOPPING CONDITIONS\nStop and report back, rather than continuing to iterate, if any of the following happens: the\ndone-state above is reached, a checkpoint condition above is hit, the same check fails three times\nin a row without a materially different attempt in between, or a change outside the\nfiles-off-limits boundary looks necessary to proceed at all — that last case specifically means\nthe task as scoped may not be achievable within its own stated boundary, and that is worth\nsurfacing rather than quietly working around.\n\nWHEN IT REPORTS BACK\nRead what actually changed, not just the final message summarizing it — agent mode's own account\nof what it did is the least reliable source in the loop, since it is generated by the same process\nthat did the work and inherits its blind spots; the diff and the actual terminal output are the\nrecord that matters.",
    variables: [
      {
        name: 'agent_task',
        description: 'The task agent mode should carry out autonomously.',
        example:
          'Add pagination to the /admin/users table, which currently renders every user row at once and is slow past a few thousand rows.',
        required: true,
      },
      {
        name: 'iteration_boundary',
        description:
          'The precise condition that marks the task done, since agent mode stops itself once it believes this is true.',
        example:
          'The users table renders at most 50 rows per page, has working next/previous controls, and the existing admin-users test suite passes with no test skipped or deleted.',
        required: true,
      },
      {
        name: 'terminal_command_policy',
        description:
          'Which terminal commands may run without pausing for approval, and which must pause.',
        example:
          'npm run test, npm run lint, and npm run typecheck may run without pausing. Anything involving git commit, git push, or npm install must pause for approval first.',
        required: true,
      },
      {
        name: 'checkpoint_requirement',
        description:
          'A condition that should force a pause and manual review before continuing.',
        example:
          'Pause and show me the diff before touching lib/db/queries/users.ts, since that file is shared by three other pages besides this one.',
        required: true,
      },
      {
        name: 'files_off_limits',
        description:
          'Files the task should never touch, regardless of what seems helpful mid-loop.',
        example:
          'Do not touch lib/auth/session.ts under any circumstance — this task has nothing to do with authentication.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot agent mode (VS Code)'],
    tags: [
      'agent-mode',
      'autonomous-editing',
      'terminal-commands',
      'scope-control',
      'vs-code',
    ],
    whyItWorks:
      "Agent mode's actual mechanism is a multi-tool-call loop that chains edits, terminal runs, and further edits together on its own judgment about the next useful step, in contrast to a single Copilot Chat turn that proposes one change and waits for a response — this is precisely why a boundary has to be stated in the brief before the loop starts rather than corrected once it is already several iterations deep, since nothing internal to the loop pauses to re-check a boundary that was never written down. The terminal-command allowlist is a targeted risk control specific to a capability plain Chat does not have at all: agent mode can run shell commands on its own initiative as part of its loop, so naming exactly which commands may run without a pause, and requiring everything else to stop for approval, is the difference between an agent that can verify its own work with a test run and one that can also, in principle, run something with a far larger blast radius simply because it seemed like a reasonable next step in the moment. The 'same check fails three times' stopping condition counters a specific pattern in autonomous loops: an agent that keeps attempting superficially different variations of the same fundamentally wrong approach will keep consuming iterations without ever surfacing that the approach itself, not the attempt, is the problem — a fixed retry ceiling forces that surfacing to happen explicitly rather than silently, indefinitely. Distrusting the agent's own final summary in favor of the actual diff and terminal output follows from the same logic that applies to any self-report inside an agentic loop: the summary is generated by the same process that did the work, so it inherits whatever blind spot led to a wrong turn in the first place, and a reviewer relying on that summary alone is trusting the least independently verified account of the session that exists.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot agent mode',
        version: 'Agent mode GA, Copilot Chat 1.270 (VS Code)',
        date: '2026-07-25',
      },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Copilot agent mode GA in VS Code (Copilot Chat 1.270).',
      },
    ],
  },
  {
    slug: 'github-copilot-edits-migration-plan',
    category: 'github-copilot',
    title:
      'Plan a multi-file migration before Copilot Edits touches a single file in the working set',
    description:
      'A migration brief for Copilot Edits that forces a dependency-ordered plan across an explicit working set of files and a one-file pilot checkpoint before any multi-file rewrite starts.',
    promptText:
      "I want to migrate {{migration_from}} to {{migration_to}} using Copilot Edits, working from an\nexplicit file working set rather than letting Copilot decide on its own which files belong in this\nchange. Before adding a single file to the working set or proposing an edit, produce a plan and\nwait for my approval.\n\nWORKING SET\n{{working_set_files}}\n\nMUST NOT BREAK\n{{must_not_break}}\n\nPLAN FORMAT\n1. For every file in the working set, state the specific change it needs — not 'update as\n   needed,' since Edits proposes a diff per file in the working set and a vague plan entry\n   produces a diff with no clear standard to check it against.\n2. Order the files so a shared or foundational file — a type definition, a config value, a base\n   pattern the others extend — is migrated before the files depending on it, and explain why that\n   order avoids a broken intermediate state where a dependent file has already been migrated\n   against a shape the foundational file has not actually adopted yet.\n3. Name one file from the working set to migrate first as a pilot, and state exactly what\n   reviewing that one file's diff should tell me about whether the overall approach for the rest\n   is right, before any other file in the set is touched.\n4. For each item under MUST NOT BREAK, name which specific file's migration in the working set\n   could threaten it, and how the plan avoids that — a generic reassurance that nothing important\n   will break gives nothing to check the actual diffs against later.\n\nAfter I approve the plan, add only the pilot file to the working set and propose its diff. Stop\nthere. Do not add the remaining files to the working set until I have reviewed that first diff and\ntold you to continue.\n\n{{pilot_file}}\n\nCONSTRAINTS\n- Review every proposed diff in the working set individually before accepting it — do not accept\n  the whole working set's changes in one action just because the first two files you checked\n  looked right; a working set can include a file whose diff was generated correctly in isolation\n  but is wrong in combination with an adjacent file's diff that changed the same shared interface.\n- If, partway through, a file outside the original working set turns out to need a change for the\n  migration to actually hold together, stop and say so explicitly rather than silently adding it to\n  the working set and folding its diff in with the rest — an unannounced scope expansion in a\n  migration is exactly the kind of change that gets missed in review because nobody was told to\n  look for it.",
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
        name: 'working_set_files',
        description:
          'The explicit set of files this migration covers — the working set Copilot Edits will operate on.',
        example:
          'Every component under components/dashboard/ plus dashboard/types.ts — 15 files total.',
        required: true,
      },
      {
        name: 'must_not_break',
        description: 'Specific behavior that must survive the migration unchanged.',
        example:
          'The memoized selectors in dashboard components must not re-render on every store update — that performance behavior is load-bearing on the live dashboard.',
        required: true,
      },
      {
        name: 'pilot_file',
        description:
          'Which file should be migrated first as the pilot, if you already have one in mind.',
        example:
          'Migrate DashboardSummaryCard.tsx first — it is the smallest component using the pattern and appears on the lowest-traffic page.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Edits (VS Code)', 'GitHub Copilot Chat (VS Code)'],
    tags: ['copilot-edits', 'migration', 'working-set', 'multi-file', 'refactoring'],
    whyItWorks:
      "Copilot Edits works from an explicit working set of files and proposes a diff per file in that set, reviewed and accepted individually rather than as one combined patch — which is exactly the mechanism that makes an unscoped migrate X to Y across the codebase request risky: a model given no explicit set will decide which files belong in the migration as it goes, in whatever order it encounters them, which can leave a file migrated against a shared type or config before that foundational file has actually been changed to match, producing a broken intermediate state that is difficult to bisect once several files' diffs are already mixed together. Naming the working set explicitly and ordering it by dependency, foundational files first, mirrors how a careful human would sequence the same migration by hand, and gives you a concrete thing to check the proposed order against before any diff is generated at all rather than after. The pilot-file requirement turns a large migration into a cheap checkpoint for exactly the same reason it matters in an autonomous-agent context: if the chosen approach is wrong, there is one file's diff to revert, not a working set's worth, and that one file tells you concretely whether the pattern generalizes before you commit to reviewing the rest under the assumption that it does. Reviewing each file's diff individually rather than accepting the whole batch in one action targets a specific and easy-to-miss failure: a diff that reads as correct in isolation can still be wrong in combination with a second file's diff if the two files share an interface that one migrated one way and the other migrated a slightly different way — a per-file review that stops at this file looks right without checking it against the sibling file it depends on will pass exactly the kind of bug that only shows up when both files run together. The constraint against silently expanding the working set exists because that expansion is invisible to anyone reviewing the originally-approved plan against the final diff — a file added mid-migration without being flagged is a file nobody was told to specifically check, which defeats the entire purpose of having approved a bounded working set in the first place.",
    exampleOutput:
      "Plan (excerpt): 1. Migrate dashboard/types.ts first — foundational, no component logic. 2. Migrate DashboardSummaryCard.tsx as the pilot. 3. Risk check: DashboardSummaryCard.tsx's memoized selector relies on connect()'s shallow-equal check today — the hooks version must use useAppSelector with an equivalent selector, not a bare useSelector(state => state.dashboard), or it re-renders on every store update, violating the must-not-break constraint.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Edits',
        version: 'Copilot Edits 1.270 (VS Code, working-set mode)',
        date: '2026-07-26',
      },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Copilot Edits 1.270 (VS Code) working-set mode.',
      },
    ],
  },
  {
    slug: 'github-copilot-workspace-chat-impact-analysis',
    category: 'github-copilot',
    title: 'Ask @workspace where something is actually handled before you change it',
    description:
      'An @workspace chat prompt that maps every file touching a piece of behavior across the whole repo before you edit it, separating the source of truth from its consumers, instead of trusting whatever file happens to be open.',
    promptText:
      "@workspace I am about to change {{behavior_or_feature}}, and I want a map of everywhere it\nactually lives in this codebase before I touch anything — answer using what you can actually find\nin this workspace, not general knowledge of how a feature like this is usually structured.\n\nQUESTION 1 — WHERE IS IT\nEvery file that reads, writes, or otherwise depends on {{behavior_or_feature}}, and for each one\nthe specific function, component, or export involved — not just the filename.\n\nQUESTION 2 — WHICH ONE IS THE SOURCE OF TRUTH\nOf the files from question 1, which one actually owns this behavior versus which ones are\nconsumers that would break if the source of truth's shape changed underneath them.\n\nQUESTION 3 — IS IT DUPLICATED\nAny place this same logic exists a second time instead of being called from the source of truth,\neven a partial duplicate that only handles a subset of the real cases.\n\nQUESTION 4 — GIVEN WHAT I ACTUALLY PLAN TO DO\nI intend to {{change_intent}}. Of the files from question 1, which specifically need a matching\nchange for that intent to hold, and which do not — and for each file you say does not need a\nchange, state briefly why it is safe as-is, not just that it was not obviously affected.\n\nRULES FOR THIS ANSWER\n- Do not propose the change itself yet. Answer only the four questions above.\n- If a file plausibly should exist given how a feature like this is usually built, but you have\n  not actually located it in this workspace, say 'not found in this workspace' rather than\n  describing it as if you had found it — an inferred file that sounds right is worse than an\n  honest gap, because it sends me looking in the wrong place with false confidence.\n- {{scope_hint}}\n- If two files from question 1 appear to handle the same case differently, name the discrepancy\n  explicitly under question 3 rather than only under whichever question you answer first — a\n  reader working through this answer top to bottom should not have to notice the same fact was\n  quietly relevant to two different questions.\n\n{{depth_hint}}\n\nIF THIS BEHAVIOR HAS COME UP BEFORE IN THIS CONVERSATION\nIf an earlier turn in this same chat already touched on where {{behavior_or_feature}} lives,\nre-verify against the current state of the workspace rather than repeating what was said earlier\nwithout checking — a file can have moved or been refactored since that earlier turn, and an answer\nhere that is just a restatement of an earlier answer defeats the reason to ask again before making\na change.",
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
          "add a new 'trial' tier between free and paid that expires after 14 days",
        required: true,
      },
      {
        name: 'scope_hint',
        description:
          'Any directory boundary to respect, so the search does not waste time outside where this behavior could plausibly live.',
        example:
          'Limit the search to lib/billing/ and lib/api/middleware/ — this has never lived in components/.',
        required: false,
      },
      {
        name: 'depth_hint',
        description:
          'How exhaustive this needs to be, since a quick sanity check and a pre-refactor audit warrant different depth.',
        example:
          'This is a pre-refactor audit — err toward over-inclusion rather than a quick best-guess list.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)'],
    tags: [
      'workspace-chat',
      'impact-analysis',
      'multi-file',
      'refactoring-prep',
      'codebase-search',
    ],
    whyItWorks:
      "@workspace is the Copilot Chat participant specifically scoped to search and reason across the whole current workspace rather than only the open file or the current selection — it is the actual mechanism that makes a genuinely cross-file question answerable inside Copilot Chat's normal context window at all, since without it the model is limited to whatever files happen to be open or explicitly attached. A bare where is X handled question, asked without structure, tends to return whichever file @workspace's retrieval finds most semantically central to the topic rather than an exhaustive list, because nothing in a loose question tells it that exhaustiveness, not a single good answer, is actually the goal — asking explicitly for every file plus the specific export forces coverage over a representative example. Separating the source of truth from a downstream consumer matters because the real risk in a cross-cutting change is almost never the file being edited directly — it is the consumer depending on the old shape that nobody remembers still exists, which is precisely the question a change-impact review exists to surface before the edit happens rather than after a consumer silently breaks. The instruction to answer not found in this workspace rather than infer a plausible file targets @workspace's specific failure mode under thin or ambiguous retrieval: producing a confident-sounding file reference that matches the pattern of what a codebase like this one would typically have, rather than what this codebase actually contains, which is a much harder error to catch than an honest gap because it reads exactly like a real answer until someone goes looking for the file and cannot find it. Re-verifying against the current workspace state rather than an earlier turn in the same conversation matters for a reason specific to longer chat sessions — @workspace's retrieval runs fresh each time it is invoked, but the model's own sense of already answered this can lead it to lean on a prior answer's phrasing instead of re-running the search, and a refactor that happened between that earlier turn and this one is exactly the kind of change a stale restatement would miss silently.",
    exampleOutput:
      "1. lib/billing/tier.ts exports getUserTier() (source of truth); components/paywall/FeatureGate.tsx and lib/api/middleware/require-tier.ts both call it. 2. getUserTier() is the source of truth; the other two are consumers. 3. app/api/reports/export/route.ts has a near-duplicate tier check inline instead of calling getUserTier() — flagged as duplication. 4. Adding a trial tier requires changes to lib/billing/tier.ts and require-tier.ts; FeatureGate.tsx needs no change since it only checks tier !== 'free'.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.270 (VS Code, @workspace)',
        date: '2026-07-27',
      },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Copilot Chat 1.270 (VS Code) with @workspace.',
      },
    ],
  },
  {
    slug: 'github-copilot-terminal-chat-explainer',
    category: 'github-copilot',
    title:
      'Get Copilot to explain a terminal failure using the actual run, not the command in isolation',
    description:
      "A prompt for the @terminal chat participant that pulls in the integrated terminal's real output, exit behavior, and last-known-good state so Copilot diagnoses what this specific run did, not what the command usually does when it works.",
    promptText:
      "@terminal this command just failed and I want to know why it failed on this specific run, in\nthis specific environment — not a general explanation of what this command normally does.\n\nCOMMAND\n{{failed_command}}\n\nWHAT ACTUALLY CAME BACK\n{{terminal_output}}\n\nWHAT I EXPECTED INSTEAD\n{{expected_behavior}}\n\nENVIRONMENT\n{{shell_environment}}\n\nWHAT WAS LAST KNOWN TO WORK\n{{prior_working_state}}\n\nAnswer in this order:\n1. Read the actual output above line by line and point to the specific line that indicates the\n   real failure — not the last line printed, which is often just the shell's own exit report, but\n   the line where the underlying tool first signals something went wrong.\n2. State what that specific line means in the context of {{shell_environment}}, naming the exact\n   condition — a missing binary, a permission bit, a wrong working directory, an environment\n   variable that is unset or pointing somewhere unexpected — rather than a general category like\n   'a configuration issue.'\n3. Compare against {{prior_working_state}} and say what is different now that would explain why\n   this used to work and does not now, if that information was given — do not skip this step just\n   because it requires more inference than restating the error.\n4. Propose one command to run next that would confirm your diagnosis before proposing any fix — a\n   diagnostic command, not the fix itself, since a fix based on an unconfirmed guess about a\n   terminal failure risks masking the real cause instead of resolving it.\n\nDo not suggest reinstalling, clearing a cache, or restarting anything as a first move unless the\noutput above specifically points there — those are the shotgun fixes that work by accident often\nenough to keep getting suggested, and this diagnosis should not default to one.\n\nIF THE SHELL MATTERS\nIf {{shell_environment}} indicates something other than a standard POSIX shell — PowerShell, a\nWindows Git Bash session, a shell running inside a container with a different filesystem than the\nhost — say explicitly whether the failure is specific to that shell's own quoting, path, or\nline-ending behavior before assuming the command would behave the same way in a different shell. A\ncommand copied from a POSIX-shell example failing on this run is frequently a shell mismatch, not\na broken command.",
    variables: [
      {
        name: 'failed_command',
        description: 'The exact command that was run.',
        example: 'npm run build',
        required: true,
      },
      {
        name: 'terminal_output',
        description: 'The actual terminal output from the failed run, unedited.',
        example:
          "Module not found: Can't resolve '@/lib/reports/format' in './components/reports/ReportSummary.tsx'",
        required: true,
      },
      {
        name: 'expected_behavior',
        description: 'What you expected to happen instead.',
        example:
          'This built successfully yesterday on the same branch with no changes to tsconfig.json or the lib/reports directory.',
        required: true,
      },
      {
        name: 'shell_environment',
        description: 'The shell, OS, and toolchain this command ran in.',
        example: 'Git Bash on Windows 11, Node 20, running inside a pnpm workspace.',
        required: false,
      },
      {
        name: 'prior_working_state',
        description: 'The last known point at which this command worked, if known.',
        example:
          'Last known good commit is a3f21c9, before a rename of lib/reports/format.ts to lib/reports/formatting.ts.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)'],
    tags: [
      'terminal',
      'debugging',
      'shell-commands',
      'copilot-chat',
      'root-cause-analysis',
    ],
    whyItWorks:
      "The @terminal chat participant is specifically grounded in the integrated terminal's own state — its shell type and recent output — which is the mechanism this prompt actually exploits by pasting the real output and exit behavior directly into the question, rather than asking a bare why did this fail with no evidence attached; a question with no attached output gives Copilot nothing to diagnose against except the command text itself, and it will answer the easier, more generic question that text alone supports. Distinguishing the last line printed, which is very often just the shell's own exit report, from the line where the underlying tool first signals a real problem is a genuine and common parsing distinction in failed command output — a build tool, a bundler, or a test runner typically emits its actual error several lines before a wrapping shell or process manager prints its own generic failed with exit code message, and treating the last line as the diagnosis skips past the line that actually explains anything. The instruction to suppress shotgun fixes — reinstall, clear the cache, restart — unless the output specifically points there targets a well-known pattern in troubleshooting advice generally, not just AI-generated advice: these fixes work often enough, by accident, across a wide enough range of unrelated problems that they get suggested reflexively, and suppressing that reflex forces a diagnosis actually grounded in the pasted evidence rather than a plausible-sounding default. The shell-mismatch check exists because a command's behavior is not portable across shells in ways that are easy to overlook — quoting rules, path separators, and line-ending handling genuinely differ between a POSIX shell and PowerShell or a Windows Git Bash session, so a command that is entirely correct in the shell it was written for can fail in a different one for a reason that has nothing to do with the command's logic at all, and naming the shell explicitly is what lets that specific failure category even be considered.",
    exampleOutput:
      '1. The real failure is the line reporting the module could not be found — not the generic build failed line printed last. 2. The module was renamed to formatting.ts in a recent commit but one import in ReportSummary.tsx was not updated to match. 3. Comparing to commit a3f21c9 confirms the rename happened after that commit, explaining why the build succeeded then. 4. Confirm by searching for every remaining import of the old format.ts path before assuming this is the only broken reference.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.270 (VS Code, @terminal)',
        date: '2026-07-27',
      },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Copilot Chat 1.270 (VS Code) with @terminal.',
      },
    ],
  },
  {
    slug: 'github-copilot-context-variables-precision',
    category: 'github-copilot',
    title:
      'Point Copilot Chat at the exact code with context variables instead of hoping it infers scope',
    description:
      'A context-variable discipline for the Chat input box — #selection, #file, #codebase, and #sym — that tells Copilot precisely what it is being asked about instead of leaving scope to whatever tab happens to be open.',
    promptText:
      "Ask Copilot Chat this question using explicit context variables rather than typing the question\nalone and trusting it to infer what you mean by 'this' from whatever tab happens to be focused.\n\nQUESTION OR TASK\n{{question_or_task}}\n\nCONTEXT VARIABLE TO LEAD WITH, AND WHY\n{{primary_context_variable}}\nPick deliberately, not automatically: #selection scopes to exactly the highlighted lines and\nnothing else, which is right when the question is about a specific block and wrong when the\nanswer actually depends on a caller or a type defined elsewhere; #file scopes to the whole open\nfile, right for a question about that file's overall structure; #codebase triggers a\nworkspace-wide semantic search rather than a literal grep, which is the right choice when you do\nnot already know which file holds the answer, but the wrong choice when you do, since it is slower\nand can miss an exact match that a scoped reference would have caught directly.\n\nADDITIONAL FILES TO INCLUDE EXPLICITLY\n{{files_to_include}}\nReference each one by name using its own file variable rather than describing it in prose and\nhoping Copilot resolves the description to the right file — 'the file with the discount logic' is\na guess Copilot has to make; a named reference is not.\n\nSYMBOL, IF THE QUESTION IS ABOUT ONE SPECIFIC FUNCTION OR TYPE ACROSS THE CODEBASE\n{{symbol_name}}\nA symbol reference finds every real usage of that specific named export, which is a materially\ndifferent and more precise operation than asking a semantic question about 'how X is used' and\nhoping the workspace search surfaces the same set of call sites.\n\nWHAT TO LEAVE OUT\n{{exclusion_note}}\nIf a file is open in another tab but is not actually relevant to this specific question, do not\nrely on Copilot ignoring it correctly — an open tab is exactly the kind of ambient context that\ngets folded in when nothing tells the model where the boundary of 'this' actually is, so state\nexplicitly when something visible is not what this question is about.\n\nWHY THIS MATTERS FOR THE ANSWER YOU GET BACK\nA vague 'explain this' question answered against whatever three tabs happen to be open produces an\nanswer scoped to an accident of your window layout, not to the actual boundary of the question —\nthe context variables exist specifically so that boundary is a deliberate choice attached to the\nmessage, not an emergent property of which files you had open five minutes ago for an unrelated\nreason.",
    variables: [
      {
        name: 'question_or_task',
        description: 'What you actually want answered or done.',
        example:
          'Why does the discount total sometimes show one cent off from what the cart summary displays?',
        required: true,
      },
      {
        name: 'primary_context_variable',
        description:
          'Which context variable to lead with, and why it is the right scope for this specific question.',
        example:
          "#selection on the calculateDiscount function — the question is about this one function's rounding, not the whole checkout module.",
        required: true,
      },
      {
        name: 'files_to_include',
        description:
          'Additional files to reference explicitly by name, beyond the primary context variable.',
        example:
          "#file:lib/checkout/cart-summary.ts, since it independently recomputes a total that should match calculateDiscount's output.",
        required: false,
      },
      {
        name: 'symbol_name',
        description:
          "A specific symbol to search for across the codebase, when the question is about one function or type's every usage.",
        example:
          '#sym:calculateDiscount, to find every call site across the codebase, not just the one in the currently open file.',
        required: false,
      },
      {
        name: 'exclusion_note',
        description:
          'What is visible but not actually relevant, so Copilot does not fold it in as ambient context.',
        example:
          'Ignore components/checkout/PromoBanner.tsx, which is open in another tab but only displays marketing copy, not the actual calculation.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)'],
    tags: [
      'context-variables',
      'codebase-search',
      'copilot-chat',
      'scope-control',
      'precision-prompting',
    ],
    whyItWorks:
      "#selection, #file, and #codebase are mechanically different retrieval operations, not just stylistic choices dressed up as options — #selection scopes to exactly the highlighted text and nothing else, #file expands that to the whole open document, and #codebase triggers an actual workspace-wide semantic search rather than a literal grep, which means picking between them is picking between three different and non-interchangeable ways Copilot gathers the material it will answer from. A named file reference resolves file identity deterministically, while a prose description of a file forces Copilot to guess which file the description points to — 'the file with the discount logic' might resolve correctly most of the time in a small codebase, but it is a guess every time, and a named reference removes that guess entirely rather than merely making it more likely to succeed. A symbol reference is a precision jump beyond even a named file: it finds every real usage of one specific named export across the workspace, which is a categorically different and more exact operation than asking a semantic question like how is X used and trusting a similarity-based search to surface the same complete set of call sites, since semantic search is optimized for relevance, not for exhaustiveness against one exact identifier. The ambient-context problem the exclusion_note addresses is a genuinely real default in Copilot Chat's context gathering: an open tab is part of the environment the model can see, and nothing about a plain-text question tells it that an open but irrelevant file should be excluded, so the boundary of what 'this' refers to in a loose question is set by an accident of your window layout rather than by a deliberate choice — which is exactly the gap explicit context variables exist to close.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.270 (VS Code, #file/#selection/#codebase/#sym)',
        date: '2026-07-28',
      },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Copilot Chat 1.270 (VS Code) context variables.',
      },
    ],
  },
  {
    slug: 'github-copilot-vision-screenshot-to-code',
    category: 'github-copilot',
    title:
      'Turn a UI screenshot into a scoped Copilot Vision task instead of a vague match this request',
    description:
      'A Copilot Vision prompt for an attached screenshot — a design mock, a visual bug, a rendered diff against a spec — that forces a specific, checkable read of the image before any code gets proposed from it.',
    promptText:
      "I am attaching a screenshot. Before proposing any code change, describe back what you actually\nsee in the image, specifically with respect to {{discrepancy_focus}} — do not skip straight to a\ndiff based on a general impression of the image.\n\nWHAT THE SCREENSHOT SHOWS\n{{screenshot_description}}\n\nCOMPONENT OR FILE THIS SHOULD MAP TO\n{{target_component_or_file}}\n\nWHAT TO COMPARE SPECIFICALLY\n{{discrepancy_focus}}\n\nVIEWPORT OR DEVICE CONTEXT FOR THE SCREENSHOT\n{{viewport_or_device_context}}\n\nWork in this order:\n1. Describe the specific visual detail in the image relevant to {{discrepancy_focus}} — an exact\n   spacing, color, alignment, missing element, or wrapped text — in concrete terms a reviewer\n   could check against the image themselves, not an impression like 'the spacing looks off.'\n2. Read {{target_component_or_file}} and state what the current code actually produces for the\n   same detail, so the comparison is between two concrete things rather than between the image and\n   a memory of what the code probably does.\n3. State the specific difference between steps 1 and 2 — the actual delta this change needs to\n   close, not a rewrite of the whole component because a full rewrite happened to be easier to\n   generate than a scoped fix.\n4. Propose the smallest change that closes that specific delta, scoped only to\n   {{discrepancy_focus}} — if closing it plausibly requires touching something outside\n   {{target_component_or_file}}, say so explicitly and why, rather than silently expanding scope\n   to make the fix easier.\n\n{{acceptance_note}}\n\nCONSTRAINTS\n- If the screenshot is ambiguous about an exact value — a color that could be one of two nearby\n  shades, a spacing that could be 8px or 12px depending on how the image was captured or scaled —\n  say so and check the actual design tokens or existing CSS values already in\n  {{target_component_or_file}} or its stylesheet before guessing a number that merely looks\n  approximately right in the image.\n- Do not infer functionality from the screenshot that a static image cannot actually show, such as\n  a hover state, an animation, or a loading state, unless {{screenshot_description}} states which\n  state the image was captured in — a still image of a button says nothing certain about what its\n  hover or disabled state looks like, and inventing one is a guess dressed as an observation.",
    variables: [
      {
        name: 'screenshot_description',
        description:
          'What the attached screenshot shows, described in your own words as context for what Copilot should be checking.',
        example:
          'A screenshot of the /pricing page showing the annual-plan toggle switch rendered noticeably smaller than the monthly-plan toggle next to it.',
        required: true,
      },
      {
        name: 'target_component_or_file',
        description: 'The component or file the screenshot should map to.',
        example: 'components/pricing/PlanToggle.tsx',
        required: true,
      },
      {
        name: 'discrepancy_focus',
        description:
          'The specific visual detail to compare against the current code, not a general impression.',
        example:
          'The two toggle switches should be visually identical in size — only their label text should differ.',
        required: true,
      },
      {
        name: 'viewport_or_device_context',
        description: 'The viewport, device, or browser the screenshot was captured at.',
        example: 'Captured at 1440px desktop width in Chrome, not a mobile viewport.',
        required: false,
      },
      {
        name: 'acceptance_note',
        description: 'What counts as the discrepancy being resolved, stated concretely.',
        example:
          'This is acceptable once both toggles measure the same width and height in the rendered DOM, not just visually similar in a screenshot.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)'],
    tags: [
      'copilot-vision',
      'screenshot-to-code',
      'ui-bugs',
      'visual-diff',
      'precision-prompting',
    ],
    whyItWorks:
      "Forcing a description of the image before any code is proposed counters Vision's tendency to jump straight to plausible-looking code from a holistic visual impression of the screenshot rather than a grounded, checkable detail — an image gives the model a different and less precise kind of evidence than a DOM snapshot or a CSS diff would, so recovering precision requires making it state the exact detail in words a reviewer can independently verify against the same screenshot, rather than trusting a code diff generated straight from a general impression to have implicitly gotten that detail right. Requiring a separate read of what the current code actually produces, rather than relying on the model's memory of what the file probably contains, matters because Vision's read of the screenshot and its knowledge of the target file are two genuinely separate sources of information it has to actively reconcile — treating them as automatically consistent skips the step where the actual mismatch, not an assumed one, gets identified. The ambiguous-value and static-image constraints ground the prompt in a real and often-overlooked limitation of a still image as evidence: an image can be ambiguous between two adjacent color values or two plausible spacing numbers depending on how it was captured or compressed, and it categorically cannot show a hover state, an animation, or a loading state unless the screenshot was specifically captured in that state — a naive match this screenshot request gives the model every incentive to fill either kind of gap with a confident-sounding guess dressed as an observation, and this prompt's constraints exist specifically to make it check an authoritative source, the actual design tokens or CSS already in the file, rather than eyeball a number off the image.",
    exampleOutput:
      "1. The annual-plan toggle track measures roughly 32px wide versus 44px for the monthly toggle, based on the screenshot. 2. PlanToggle.tsx applies a size prop conditionally, and the annual variant is passed a compact size while the monthly variant is not. 3. The delta is the size prop being set inconsistently between the two toggle instances. 4. Fix: remove the compact-size override on the annual toggle so both use the component's default size.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.271 (VS Code, image input)',
        date: '2026-07-29',
      },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Copilot Chat 1.271 (VS Code) Vision image input.',
      },
    ],
  },
  {
    slug: 'github-copilot-chat-debug-stack-trace',
    category: 'github-copilot',
    title:
      'Make Copilot Chat trace a stack frame to a root cause before it proposes a fix',
    description:
      'A diagnosis-first debugging prompt that walks Copilot Chat down the actual stack trace, frame by frame, and requires a named root cause before any fix is proposed, so the fix addresses what is really wrong rather than the first plausible-looking cause.',
    promptText:
      "Diagnose this before proposing anything. I do not want a fix suggestion until you have walked\nthe stack trace below and named a root cause you can point to directly in it.\n\nERROR\n{{error_message}}\n\nSTACK TRACE\n{{stack_trace}}\n\nHOW TO REPRODUCE\n{{repro_steps}}\n\nRELEVANT FILES\n{{relevant_files}}\n\nWHAT HAS ALREADY BEEN TRIED\n{{prior_fix_attempts}}\n\nWORK THROUGH THIS IN ORDER\n1. Start at the top frame of the stack trace and go down it one frame at a time, stating in this\n   codebase specifically — not a generic description of what this error class usually means —\n   which line is throwing and what it was doing when it threw.\n2. Identify the specific variable, argument, or condition that was actually wrong at that point,\n   named precisely, not a category like 'a null reference issue' — name the exact thing and its\n   actual value or state at the moment of failure.\n3. Trace that wrong value back one more step: where was it supposed to be set correctly, and what\n   about {{repro_steps}} caused it not to be. If the trail goes further back than one step, follow\n   it until you reach something that is either clearly the actual origin or clearly outside what\n   {{relevant_files}} can show you — and say explicitly which of those two you hit.\n4. Only now propose the fix, scoped exactly to the root cause identified in steps 2 and 3, as a\n   diff — not a broader cleanup of the surrounding code that was not shown to be part of the\n   problem.\n5. Name one other place in the codebase where the same root cause — the same wrong assumption\n   about a value's shape or presence — could plausibly resurface, and say whether that place needs\n   the same fix or is already protected against it.\n\nIF {{prior_fix_attempts}} DID NOT WORK\nSay specifically why the earlier attempt did not fix this, based on what the stack trace above\nactually shows — not a vague 'that approach was on the right track but incomplete.' If the earlier\nattempt addressed a real but different problem than the one this trace shows, say so plainly\nrather than treating it as a partial success.\n\nIF THE TRACE AND FILES GIVEN ARE NOT ENOUGH\nSay exactly what additional file, log line, or piece of state you would need to be certain of the\nroot cause, rather than proposing a fix built on a guess dressed up as a diagnosis.",
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
        description: 'The files named in the stack trace, pasted in or referenced.',
        example:
          'lib/reports/format.ts and components/reports/ReportSummary.tsx, pasted below.',
        required: true,
      },
      {
        name: 'prior_fix_attempts',
        description:
          'What has already been tried, if this is a recurring or persistent bug.',
        example:
          'Tried adding a loading state around ReportSummary — the crash still happens once loading finishes and zero rows render.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)', 'GitHub Copilot Chat (JetBrains)'],
    tags: [
      'debugging',
      'root-cause-analysis',
      'stack-trace',
      'copilot-chat',
      'diagnosis',
    ],
    whyItWorks:
      "Given a bare error message, Copilot Chat's fastest path to a plausible-sounding answer is pattern-matching to the most common cause of that error class in general, because nothing in an unstructured question forces it to actually parse this stack trace frame by frame before answering — a generic explanation of what a null reference or a type mismatch usually means is a real answer to a different, easier question than the one that was actually asked. Requiring the frame-by-frame walk before any fix converts diagnosis from something Copilot could skip past on the way to sounding helpful into a step with a checkable output: a specific line, in this codebase, doing a specific thing. Naming the exact variable or condition, rather than accepting a category-level answer, closes off the single most common way a debugging answer sounds diagnostic while committing to nothing a reviewer could actually verify against the trace — there might be a null reference somewhere cannot be wrong in a way anyone can point to, while total was zero at line 34 can be checked in ten seconds against the pasted code. Tracing the wrong value back one further step, rather than stopping at the line that threw, targets the gap between where an error surfaces and where it actually originates, which are frequently two different lines or even two different files — fixing only the symptom line without understanding the origin produces a patch that suppresses this specific crash while leaving the actual wrong assumption intact somewhere upstream, ready to surface differently the next time the input varies slightly. Checking a failed prior attempt against what the trace actually shows, rather than treating it charitably as on the right track, matters because an AI assistant asked to build on a previous fix has a real incentive to find some truth in it rather than contradict a human's earlier effort outright, and that incentive is exactly backwards when the earlier attempt solved a different, adjacent problem rather than a partial version of this one. Finally, instructing it to ask for missing files rather than guess counters the tendency of any diagnosis-then-fix flow to produce a fix that looks complete under insufficient context — the single most common way a Copilot Chat suggestion looks right in the panel but does not actually address the failure that was reported.",
    exampleOutput:
      '1. Top frame is formatRowCount at lib/reports/format.ts:34, calling .toFixed on rows.length divided by total. 2. total is 0 when a filtered report matches zero rows, making the division NaN, and NaN.toFixed throws. 3. Fix: guard the division, returning a fixed zero value directly when total is zero. 4. formatAverageValue in the same file has the identical unguarded division — it needs the same fix.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.269 (VS Code)',
        date: '2026-07-29',
      },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Copilot Chat 1.269 (VS Code).',
      },
    ],
  },
  {
    slug: 'github-copilot-slash-explain-fix-tests-chain',
    category: 'github-copilot',
    title: 'Chain /explain into /fix into /tests instead of running any of them cold',
    description:
      "A three-step slash-command sequence for the Copilot Chat panel where each command's output becomes the explicit input to the next, so a fix maps to a stated concern instead of whichever issue looked most fixable, and the tests actually probe the regression risk that started the session.",
    promptText:
      "Select {{selected_code_description}} in the editor, open the Copilot Chat panel, and run these\nthree slash commands in order, feeding each answer forward into the next rather than treating them\nas three separate, unrelated questions against the same selection.\n\nWHY THE SELECTION ITSELF MATTERS\nSelect only {{selected_code_description}}, not the whole file around it — a wider selection gives\nall three commands more surface area to wander into, and /fix in particular is more likely to also\ntouch something adjacent and unrelated to {{concern}} the larger the selected block is.\n\nSTEP 1 — /explain\nAsk: /explain what does this do, specifically with respect to {{concern}}, not a general summary\nof the whole selection.\n\nBefore moving to step 2, read the answer and check one thing: does it actually address {{concern}}\nby name, or did it summarize the selection in general terms without ever touching the specific\nthing you are worried about? If it did not mention {{concern}}, ask a direct follow-up naming it\nexplicitly before proceeding — do not move to /fix on an explanation that never actually engaged\nwith the concern that brought you to this selection in the first place. Cross-check the answer\nagainst {{expected_behavior}} if you already have a hypothesis about what should happen.\n\nSTEP 2 — /fix\nAsk: /fix address {{concern}} specifically, based on what step 1 just explained. Do not change\nanything step 1 described as already working correctly.\n\nCheck the proposed diff against the step 1 explanation before accepting it: it should map directly\nonto the concern step 1 confirmed exists, not an unrelated style change or a rewrite of a part step\n1 said was fine. If the diff touches something step 1 explicitly called correct, reject it and ask\nfor a version scoped only to the confirmed concern.\n\nSTEP 3 — /tests\nAsk: /tests using {{test_framework}}, add tests that would have caught {{concern}} before this fix\nexisted, in addition to the already-passing behavior step 1 confirmed.\n\nReject the /tests output if every generated test only re-covers the happy path that was already\nworking — that is testing what step 1 already confirmed was fine, not the actual regression risk\nthis whole session exists to close. If the case covering {{concern}} specifically is missing, ask\nfor it by name rather than accepting a suite that looks thorough but never actually exercises the\nconcern that started this.\n\nIF ANY STEP'S ANSWER DOES NOT ACTUALLY BUILD ON THE PREVIOUS ONE\nStop and re-run that step with the previous answer explicitly pasted back in, rather than\ncontinuing the chain on an answer that quietly dropped the thread — each slash command is\neffectively a fresh, single-turn invocation, and nothing guarantees it fully carries forward the\nnuance of an earlier turn's explanation just because the conversation looks continuous.",
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
          "The specific thing you are worried about, not a general 'is this good code' question.",
        example:
          'whether expired discount codes are rejected correctly when the cart total changes after the code was applied',
        required: true,
      },
      {
        name: 'expected_behavior',
        description:
          'What you already suspect the correct behavior should be, if you have a hypothesis.',
        example:
          'calculateDiscount should re-validate against the cart total at checkout time, not the total from when the code was first applied.',
        required: false,
      },
      {
        name: 'test_framework',
        description:
          'The test framework the generated tests should use, matching the surrounding codebase.',
        example: "Vitest, matching the rest of lib/checkout/'s existing test files.",
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)'],
    tags: ['slash-commands', 'explain', 'fix', 'tests', 'workflow-chaining'],
    whyItWorks:
      "/explain, /fix, and /tests are Copilot Chat's built-in slash commands, and each one is scoped to a fixed task against the current selection with no memory of why you opened chat in the first place beyond what is in that single message — used cold, /fix infers what is wrong with no stated concern at all, and it will reliably gravitate toward the most visible issue in the selection, which is very often a style inconsistency or an obvious inefficiency rather than the specific, less visible concern that actually prompted you to open the panel. Running /explain first and checking its answer against the stated concern before proceeding forces Copilot to demonstrate it has actually located the right problem before it is allowed anywhere near the code — the same diagnose-before-fix discipline that matters in any debugging workflow, made a hard gate here rather than a habit to remember. Feeding the concern explicitly into the /fix prompt, rather than trusting the model to carry it forward implicitly from the previous turn, matters because a slash command is close to a single-turn task invocation in how reliably it draws on the surrounding conversation — the visible chat history is there, but nothing guarantees the full nuance of an earlier explanation survives into how the next command interprets its own narrower instruction, so restating the concern explicitly at each step is cheap insurance against exactly that kind of drop. Chaining into /tests last and specifically rejecting happy-path-only output targets a well-documented pattern in AI-generated tests: a test suite generated from a fix, with no separate instruction about what it needs to probe, tends to mirror what the fixed code now does rather than actively hunting for the specific regression the fix was written to prevent, which means a suite that passes today can still miss the exact scenario that would catch this bug coming back after some unrelated future change. Keeping the selection itself narrow compounds all three of these effects, since a wider selection gives every step in the chain more surface area to drift toward something other than the stated concern, and drift compounds across three chained steps in a way it would not across one isolated command.",
    exampleOutput:
      "Step 1 confirms calculateDiscount checks the expiry date correctly, but applies the discount to the cart total captured at validation time, not at checkout — the actual concern. Step 2's fix re-reads the cart total immediately before applying the discount instead of caching it from validation. Step 3 adds a test where the cart total changes between validation and checkout, alongside the existing valid- and expired-code cases.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.270 (VS Code)',
        date: '2026-07-30',
      },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Copilot Chat 1.270 (VS Code) slash-command chaining.',
      },
    ],
  },
  {
    slug: 'github-copilot-edge-case-test-suite',
    category: 'github-copilot',
    title:
      'Get a test suite that targets edge cases and regressions, not a mirror of the implementation',
    description:
      'A standalone test-generation prompt for Copilot Chat that forces a deliberate enumeration of edge cases, boundary values, and failure modes before any test is written, so the suite catches what the code might get wrong instead of restating what it currently does.',
    promptText:
      "Generate a test suite for {{function_or_component}} using {{test_framework}}. Before writing a\nsingle test, list the specific edge cases and failure modes this needs coverage for — do not start\nfrom the happy path and pad outward from there, since that produces a suite that mirrors what the\ncode does on typical input rather than one that checks what happens when input stops being\ntypical.\n\nWHAT THIS CURRENTLY DOES\n{{current_behavior_summary}}\n\nEDGE CASES ALREADY KNOWN TO MATTER\n{{known_edge_cases}}\n\nTEST FRAMEWORK\n{{test_framework}}\n\nCOVERAGE GOAL\n{{coverage_goal}}\n\nWORK IN THIS ORDER\n1. List every edge case you can identify from the actual signature and logic of\n   {{function_or_component}} — empty input, a single-element input, the largest and smallest\n   plausible values, a value at exactly a boundary condition used in a comparison, null or\n   undefined where the type allows it, a duplicate or out-of-order input if ordering matters, and a\n   concurrent or repeated call if state is shared across calls. Do not stop at the ones already\n   listed in {{known_edge_cases}} — that list is a floor, not the ceiling.\n2. For each edge case listed, state in one sentence what the correct behavior should be and why —\n   derived from reading {{current_behavior_summary}} and the actual code, not assumed from what\n   would be reasonable in the abstract, since the actual required behavior sometimes differs from\n   what seems reasonable and that gap is exactly what a test should catch if the code disagrees\n   with the stated correct behavior.\n3. Only after step 2 is complete, write the tests — one test per edge case identified, each named\n   for the specific case it covers rather than a generic name like 'handles edge case,' so a\n   failing test tells a future reader what broke without them having to read the test body first.\n4. Add one test explicitly for the happy path last, not first — it is the case least likely to be\n   wrong and least valuable to write first, and writing it last keeps attention on the edge cases\n   while they are still being actively reasoned about.\n\nCONSTRAINTS\n- If an edge case you identified in step 1 reveals that the current implementation's actual\n  behavior is genuinely wrong, say so explicitly rather than writing a test that just asserts\n  whatever the code currently does — a test asserting a bug is a trap for the next person who fixes\n  it and watches a passing test start failing for the right reason.\n- Do not generate a test for a case that cannot actually occur given the function's real type\n  signature — a test for a null input on a parameter TypeScript's own types already make impossible\n  is not coverage, it is noise that makes the suite look more thorough than it is.\n- If {{coverage_goal}} names a specific percentage or line-coverage target, do not treat hitting\n  that number as the actual goal — a suite that hits 90% line coverage by exercising every line\n  once with typical input has covered less of the real risk than a smaller suite built from a\n  genuine edge-case list.",
    variables: [
      {
        name: 'function_or_component',
        description: 'The specific function or component to generate a test suite for.',
        example: 'the applyLateFee function in lib/billing/late-fees.ts',
        required: true,
      },
      {
        name: 'current_behavior_summary',
        description:
          'What the function currently does, in plain language, so edge-case correctness can be checked against it.',
        example:
          'Calculates a flat 5% late fee on any invoice more than 30 days overdue, rounded to two decimal places.',
        required: true,
      },
      {
        name: 'test_framework',
        description: 'The test framework to write the suite in.',
        example: 'Vitest',
        required: true,
      },
      {
        name: 'known_edge_cases',
        description:
          'Edge cases already known to matter, as a floor for the enumeration, not the ceiling.',
        example:
          'An invoice paid exactly on day 30 (should not incur a fee); an invoice with a zero balance.',
        required: false,
      },
      {
        name: 'coverage_goal',
        description:
          'Any stated coverage target, so it can be checked against actual risk rather than treated as the goal itself.',
        example:
          'No specific percentage target — the goal is catching every boundary and shared-state case, not hitting a coverage number.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)', 'GitHub Copilot Chat (JetBrains)'],
    tags: [
      'test-generation',
      'edge-cases',
      'unit-tests',
      'quality-assurance',
      'copilot-chat',
    ],
    whyItWorks:
      "The enumerate-before-write ordering directly counters the default pattern in AI-assisted test generation, which is to pattern-match to typical input plus one or two obvious cases and call that thorough — a test suite generated without a separate enumeration step tends to mirror the implementation's own happy-path behavior back as assertions, which proves the code does what it does today without ever probing whether what it does today is actually correct at the boundaries. The instruction to flag a genuinely wrong behavior discovered during enumeration, rather than writing a test that asserts it, targets a specific and real failure mode of AI-generated tests written against a possibly-wrong implementation with no independent correctness check: a test asserting a bug passes cleanly right up until someone fixes the underlying bug, at which point a test that was supposed to provide safety starts failing for exactly the reason it should have caught the bug in the first place, and by then it reads as if the fix broke something rather than fixed something. Filtering out edge cases the function's real type signature already makes impossible is a genuinely actionable check in a strictly typed codebase specifically — a test asserting behavior for a null value on a parameter typed to exclude null is not defensive coverage, it is noise dressed as thoroughness, and it dilutes a reader's sense of which tests in the suite are protecting against a real, reachable input versus one that can never occur. The line-coverage-number warning addresses a documented and specific way test suites get gamed, intentionally or not: a suite can hit a high line-coverage percentage by exercising every line exactly once with typical input, which tells you every line ran, not that every line was checked against a case where it could plausibly be wrong — coverage percentage and actual risk coverage are correlated but very much not the same measurement, and optimizing for the number that is easy to display trades away the one that is actually protective.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.270 (VS Code)',
        date: '2026-07-31',
      },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Copilot Chat 1.270 (VS Code).',
      },
    ],
  },
  {
    slug: 'github-copilot-docstring-generation',
    category: 'github-copilot',
    title:
      'Generate docstrings that describe what the code actually does, not what its name implies',
    description:
      'A documentation-generation prompt that requires each docstring claim to be checked against the real function body first, so documentation does not quietly repeat a misleading name or a stale comment instead of the real behavior.',
    promptText:
      "Write documentation for {{target_function_or_module}} in {{doc_style}} format. Before writing\nanything, read the actual function body — every branch, every early return, every thrown error —\nand check whether its name and any existing comment already describe that behavior accurately,\nbecause a docstring generated from the name and surrounding comments alone just restates whatever\nthose already claim, right or wrong, and a wrong claim documented confidently is worse than no\ndocumentation at all.\n\nAUDIENCE\n{{audience}}\n\nKNOWN NON-OBVIOUS BEHAVIOR TO MAKE SURE IS SURFACED\n{{known_gotchas}}\n\nFOR EACH FUNCTION OR EXPORT, DOCUMENT\n1. What it actually does, in one sentence, checked against the real logic — not the name. If the\n   name suggests something the code does not actually do, say so as a separate note rather than\n   writing around the discrepancy silently.\n2. Every parameter, with its real constraint as enforced by the code, not just its type — if a\n   parameter's type allows a value the function will actually throw on or silently misbehave for,\n   document that constraint explicitly rather than letting the type signature imply it is always\n   safe to pass.\n3. What it returns in every branch, not just the main one — including what happens on an empty\n   result, an error path, or an early return, since a docstring that only describes the success\n   path is describing a fraction of the function's real contract.\n4. Any side effect beyond the return value — a mutation of an argument, a write to storage, a\n   network call, a thrown exception — stated explicitly, since a caller reading only the return\n   type has no way to know about a side effect the code performs but the signature does not\n   surface.\n\nCONSTRAINTS\n- Do not describe an implementation detail that could change without changing the contract, such\n  as which specific loop construct is used internally, as if it were part of the guaranteed\n  behavior — document what callers can rely on, not how today's version happens to achieve it.\n- If {{known_gotchas}} names something the current code does not actually do, or does differently\n  than described, flag the mismatch explicitly rather than writing the docstring to match the\n  gotcha note over the real code — the note might itself be stale.\n- Match {{doc_style}} exactly, including whether examples are expected inline — a generated block\n  that is close to the right format but not quite in the project's actual convention creates\n  visible inconsistency across a codebase where every other function follows the real convention.",
    variables: [
      {
        name: 'target_function_or_module',
        description: 'The specific function or module to document.',
        example: 'the getUserTier function in lib/billing/tier.ts',
        required: true,
      },
      {
        name: 'doc_style',
        description:
          'The documentation format and conventions already used elsewhere in this codebase.',
        example:
          'TSDoc, matching the /** */ block style already used elsewhere in lib/billing/',
        required: true,
      },
      {
        name: 'known_gotchas',
        description:
          'Non-obvious behavior that should be surfaced explicitly, cross-checked against the real code.',
        example:
          "getUserTier returns 'free' for a user with a cancelled subscription still inside its paid billing period, not 'paid' — this surprises people.",
        required: false,
      },
      {
        name: 'audience',
        description:
          'Who this documentation is actually for, so its depth and assumptions can be calibrated.',
        example:
          'Other engineers on this team calling this function from a new feature, not external API consumers.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)'],
    tags: ['documentation', 'docstrings', 'jsdoc', 'code-comments', 'copilot-chat'],
    whyItWorks:
      "Reading every branch and early return before writing anything counters the specific and common failure mode of documentation generation: pattern-matching from a function's name and any existing comment, which reproduces whatever those already claim, correct or not, because nothing forces the generation step to check the claim against the actual logic first. Documenting every return branch and every side effect beyond the signature targets a real gap between what a TypeScript type signature guarantees and what a function actually does — types capture shape, not behavior, so they say nothing about which branch returns what, whether an argument gets mutated, or whether a network call happens along the way, and a docstring that only restates the type signature in prose has added no information a caller could not already see. The distinction between a documented contract and an incidental implementation detail matters because it determines what stays true across a future refactor — a docstring describing an internal loop construct as guaranteed behavior goes stale the moment someone rewrites that loop for an unrelated performance reason, even though nothing about the function's actual contract changed, while a docstring scoped to what callers can rely on survives exactly the kind of internal change it should be indifferent to. Cross-checking known_gotchas against the real code rather than writing the docstring to match the gotcha note on faith closes a specific risk in any tribal-knowledge input: the note itself might be stale, describing a behavior from a version of the function that has since changed, and a documentation pass that trusts it uncritically can bake an outdated claim into a freshly generated docstring with the same false confidence as if it had been verified.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.269 (VS Code)',
        date: '2026-07-31',
      },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Copilot Chat 1.269 (VS Code).',
      },
    ],
  },
  {
    slug: 'github-copilot-code-review-risk-focus',
    category: 'github-copilot',
    title:
      "Steer Copilot's automated PR review at the risk that actually keeps you up at night",
    description:
      "A PR-description addendum that redirects GitHub Copilot's automated code review toward the specific parts of a diff you are genuinely unsure about, instead of the roughly even pass it gives a diff by default.",
    promptText:
      "COPILOT REVIEW FOCUS\n\nWHAT THIS PR ACTUALLY DOES\n{{pr_summary}}\n\nREVIEW THESE, IN THIS ORDER, WITH THE MOST SCRUTINY\n{{risk_areas}}\n\nDECISIONS ALREADY MADE DELIBERATELY — DO NOT RE-RAISE THESE UNLESS YOU DISAGREE WITH THE REASONING\n{{known_tradeoffs}}\n\nHOW DEEP TO GO ON THE TOP ITEM\n{{review_depth}}\n\nFlag anything else in the diff too — an automated review that only ever looks where it was told to\nlook eventually misses something a human reviewer would have caught by accident while reading in\nfile order — but lead with the areas listed above and make sure every one of them gets an explicit\nanswer, not just a comment if something happened to stand out.\n\nFor each item in {{risk_areas}}, answer explicitly: does the diff actually handle this correctly,\nand if you are not certain, say so rather than defaulting to a comment only when something looks\nclearly wrong — an item you checked and found fine is worth a stated 'checked, looks correct,'\nbecause a reviewer reading this later needs to know the difference between reviewed and clean and\nnot actually looked at closely.\n\nIf a comment applies to a line only because of a broader pattern repeated across several places in\nthis diff, say so once, name the pattern, and list every location it appears — do not leave a\nseparate near-duplicate comment on each individual line the pattern shows up on; five copies of the\nsame observation train a reader to skim past all five rather than absorb any of them.\n\nCONSTRAINTS\n- Do not restate {{known_tradeoffs}} as a finding needing a decision — if you genuinely believe the\n  reasoning behind one of them was wrong, say that explicitly and why, rather than raising it as a\n  generic concern that reads as if the tradeoff had never been considered at all.\n- If {{risk_areas}} asks about something the diff does not actually touch — for example a\n  transaction-safety concern on a code path this PR does not modify — say so plainly rather than\n  reviewing the unrelated existing code as if it were part of this change.\n- Rank your findings by actual severity, not by the order {{risk_areas}} listed them in — the order\n  in {{risk_areas}} reflects what the author was worried about going in, which is not guaranteed to\n  match what turned out to be the most serious issue once the diff was actually reviewed.",
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
      {
        name: 'review_depth',
        description:
          'How deep the review should go on the top-priority risk area specifically.',
        example:
          'Go deep on item 1 specifically — trace the authorization check through every helper it calls, not just the top-level handler.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot code review'],
    tags: ['code-review', 'pull-request', 'risk-focused', 'automated-review'],
    whyItWorks:
      "GitHub's Copilot code review scans the full diff and leaves inline comments, but it has no independent way to know which part of a large diff the author is actually unsure about, so absent any signal it distributes attention roughly evenly across changed lines in something close to file order — which means the one function you actually lost sleep over gets the same amount of scrutiny as a one-line formatting change nearby, purely because they happen to sit in the same diff. Naming risk areas up front works on Copilot's review the same way it works on a human reviewer you hand a PR to and say 'please focus on X' — it does not add new information the model could not have derived on its own, but it changes where limited attention actually concentrates, and concentrated attention on the part that matters catches more than evenly distributed attention across the whole diff. Requiring an explicit answer for every named risk area, including a stated checked, looks fine rather than only a comment when something looks wrong, closes a specific gap in how automated review reads to a human afterward: silence on an item you asked about is genuinely ambiguous between reviewed and clean and the review never actually got to this, and only one of those should give you confidence to merge. Listing known tradeoffs already discussed suppresses a particular kind of noise that trains people to stop reading review comments at all — without it, an automated review will periodically re-raise a decision the team already made on purpose, indistinguishable in tone from a genuinely new finding, and a reviewer who has been burned by that a few times starts skimming past every comment on principle rather than reading each one for what it actually is. Consolidating a repeated pattern into one comment with every location listed, instead of one near-duplicate comment per occurrence, targets the same skim-training problem from a different angle: five copies of an identical observation are not five times more persuasive, they are the thing that teaches a reader Copilot's comments are noisy and safe to ignore in bulk.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot code review',
        version: 'GA, 2026 (diff-scoped inline review)',
        date: '2026-08-01',
      },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against GitHub Copilot code review GA.',
      },
    ],
  },
  {
    slug: 'github-copilot-autofix-verification',
    category: 'github-copilot',
    title: 'Treat a Copilot Autofix suggestion as a claim to verify, not a fix to accept',
    description:
      'A verification pass for a GitHub code-scanning alert with an Autofix suggestion attached, structured to confirm the fix closes the actual exploit path rather than just the pattern the scanner matched on, before the one-click accept happens.',
    promptText:
      "GitHub code scanning flagged {{alert_description}} in this code, and Copilot Autofix already\nproposed a fix. Do not tell me to accept it yet — verify it first, against the actual exploit, not\nagainst whether it makes the alert go away.\n\nAUTOFIX SUGGESTION\n{{autofix_suggestion}}\n\nAFFECTED CODE\n{{affected_code}}\n\nOTHER PLACES THE SAME PATTERN MIGHT APPEAR\n{{similar_call_sites}}\n\nANSWER IN THIS ORDER\n1. State the exact exploit this alert is warning about as a concrete input or request an attacker\n   could actually send — not a restatement of the alert's category name. If you cannot construct a\n   concrete example, say so rather than describing the risk only in the abstract.\n2. Trace whether the Autofix suggestion above genuinely closes that specific exploit path, or only\n   makes the code shape the scanner's rule matches on disappear — these are not the same thing, and\n   a fix that does the second without the first will pass the scanner while leaving the real\n   vulnerability open under a slightly different trigger.\n3. Check {{similar_call_sites}}, plus anywhere else in this file or nearby files you can find with\n   the same vulnerable pattern, for whether this specific alert covers all of them or only the one\n   location it happened to flag — a vulnerable pattern copy-pasted to a second call site is common,\n   and static analysis does not reliably catch every instance of an indirect or slightly reshaped\n   occurrence.\n4. State what a test proving this fix actually closes the exploit would need to assert — that the\n   malicious input from step 1 is specifically rejected or safely handled, not merely that the code\n   still compiles and the existing tests still pass, since neither of those was ever evidence about\n   this particular vulnerability.\n\nONLY RECOMMEND ACCEPTING AUTOFIX IF\nYour answer to step 2 is an unambiguous yes. If it is a partial yes — the fix closes the exploit\nfor the input you constructed in step 1 but you can construct a second, differently-shaped input\nthat still gets through — say that explicitly and treat it as a no, not as a fix that mostly works.\n\nIF THE SAME PATTERN APPEARS ELSEWHERE AND IS NOT COVERED BY THIS ALERT\nSay so as its own explicit finding, separate from the verification of this specific alert's fix —\na second unflagged instance is not resolved by fixing the one the scanner happened to catch, and\nburying that finding inside the verification of an unrelated alert makes it easy to miss when\nsomeone is scanning for whether this specific alert is now resolved.",
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
      {
        name: 'similar_call_sites',
        description:
          'Other places the same vulnerable pattern might exist, even if this specific alert did not flag them.',
        example:
          'buildOrderClause() in the same file interpolates a sort-column parameter into a query string using a similar pattern.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Autofix', 'GitHub code scanning (CodeQL)'],
    tags: ['security', 'autofix', 'code-scanning', 'vulnerability-review'],
    whyItWorks:
      "Copilot Autofix generates a suggested code change directly attached to a code-scanning alert, with a one-click accept path that is deliberately fast — which is also exactly its risk, because a fast accept can silence the specific code pattern a CodeQL query matched on without closing the actual exploit, particularly for alert types where several differently-shaped pieces of code can all trigger the same finding while only some of the possible fixes address every one of those shapes. Requiring the exploit to be stated as a concrete, constructible input rather than the alert's category name forces a check against the real attack surface instead of the label GitHub attached to it — SQL injection is a category; a query parameter containing a closing quote and a boolean OR clause is a specific thing you can actually test the fix against. Asking directly whether the fix closes that path or only removes the pattern the scanner keys on targets Autofix's most consequential known failure mode, pattern-level rather than vulnerability-level remediation — an escaping call added at the exact point the scanner's rule fires can satisfy that rule completely while leaving a second, differently structured injection point in the same function untouched, because the scanner's rule was never actually checking for the vulnerability itself, only for the textual pattern it has learned to associate with it. The instruction to search nearby code for the same unflagged pattern exists because vulnerable code is rarely written exactly once — a query-building helper copied to a second call site, or reimplemented slightly differently for a related feature, carries the same risk that static analysis does not always catch consistently across every occurrence, especially once the pattern has been reshaped even slightly from the original the scanner's rule was tuned against. Gating acceptance on an unambiguous yes, and explicitly downgrading a partial yes to a no, matters because a fix that closes the exploit for one constructed input but not a second, differently shaped one is not a partially working fix in any useful sense — it is a fix an attacker who tries the second input will walk straight through, and treating that as mostly done is the exact overconfidence a verification pass exists to prevent.",
    exampleOutput:
      '1. Exploit: a search parameter containing a closing quote followed by an OR 1=1 clause would return every user row instead of a filtered match. 2. The Autofix escape() call does close this path — confirmed by tracing that the escaped value can no longer terminate the quoted string. 3. buildOrderClause() in the same file interpolates a sort-column parameter with no escaping at all — same risk class, not flagged by this alert. 4. A test should assert that a search containing that payload returns zero rows or an error, never the full table.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Autofix',
        version: 'GA, 2026 (CodeQL-integrated)',
        date: '2026-08-02',
      },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against GitHub Copilot Autofix GA.',
      },
    ],
  },
  {
    slug: 'github-copilot-accessibility-review',
    category: 'github-copilot',
    title: 'Point Copilot at the accessibility failures a visual review would miss',
    description:
      'An accessibility-focused review prompt for a UI diff that walks through keyboard operability, screen-reader semantics, focus visibility, and color contrast against the actual rendered markup, instead of a general checklist recited without checking whether each item applies here.',
    promptText:
      "Review {{component_or_page}} for accessibility, grounded in the actual markup below, not a\ngeneral checklist recited without checking whether each item actually applies here.\n\nMARKUP OR DIFF\n{{diff_or_markup}}\n\nINTERACTION PATTERN\n{{interaction_pattern}}\n\nCONTRAST CONTEXT\n{{contrast_context}}\n\nEXISTING CONVENTIONS IN THIS CODEBASE\n{{existing_a11y_conventions}}\n\nCHECK EACH OF THESE AGAINST THE ACTUAL MARKUP, NOT IN THE ABSTRACT\n1. Keyboard operability — every interactive element reachable and operable using Tab, Shift+Tab,\n   Enter, and Escape where relevant, in an order that matches the visual reading order. For\n   {{interaction_pattern}} specifically, name the exact keyboard behavior expected — for example, a\n   modal should trap focus inside itself while open and return focus to the element that opened it\n   on close, not merely be reachable by Tab like a normal element on the page.\n2. Screen-reader semantics — whether the actual elements used communicate their role and state\n   correctly without a screen reader running, based purely on the markup: a clickable div with no\n   role or button semantics is not a button to assistive technology no matter how it looks, and a\n   toggle with no aria-pressed or aria-expanded state gives a screen-reader user no way to know\n   whether it is currently on or off, open or closed.\n3. Focus visibility — whether a visible focus indicator survives on every interactive element in\n   this markup, specifically checking for any outline removal in the styles without a replacement\n   focus style, which is one of the single most common and most damaging accessibility regressions\n   in UI code.\n4. Color contrast — using {{contrast_context}}, state the actual contrast ratio for text against\n   its background and against WCAG's 4.5:1 threshold for normal text and 3:1 for large text, rather\n   than a subjective 'looks readable' judgment; if the exact colors are not resolvable from what is\n   given, say so rather than estimating a ratio that sounds authoritative but is not actually\n   computed.\n5. Error and status messaging — if this pattern can show an error or a status change, confirm it is\n   announced to a screen reader, not just rendered visually, since a validation error that only\n   appears as a red border communicates nothing to someone who cannot see the border appear.\n\nOUTPUT\nFor each of the five checks: PASS or a specific FINDING with the exact line or attribute at fault\nand the concrete fix, not a general recommendation to add ARIA attributes. If {{interaction_pattern}}\nor {{existing_a11y_conventions}} makes a check inapplicable to this markup, say so explicitly\nrather than silently omitting it.\n\nMatch any fix to {{existing_a11y_conventions}} already used elsewhere in this codebase rather than\nintroducing a second, differently styled way of solving the same accessibility requirement.",
    variables: [
      {
        name: 'component_or_page',
        description: 'The component or page being reviewed for accessibility.',
        example: 'the SavedSearchDropdown component on the /reports page',
        required: true,
      },
      {
        name: 'diff_or_markup',
        description: 'The actual rendered markup or diff, pasted in.',
        example:
          'The current render output of SavedSearchDropdown.tsx, pasted below, including its button and list markup.',
        required: true,
      },
      {
        name: 'interaction_pattern',
        description:
          'The widget type this markup implements, since accessibility expectations genuinely differ by pattern.',
        example:
          'a disclosure dropdown — a button that reveals a list of options and should close on Escape or an outside click',
        required: true,
      },
      {
        name: 'contrast_context',
        description:
          'The actual colors and theme involved, so contrast can be computed rather than estimated.',
        example:
          'Text color is var(--text-secondary) at #6b7280 on a white background in light theme.',
        required: false,
      },
      {
        name: 'existing_a11y_conventions',
        description:
          'Existing accessibility patterns already used elsewhere in this codebase, so fixes stay consistent.',
        example:
          'This codebase uses the useFocusTrap hook from lib/a11y/focus-trap.ts for every existing modal and dropdown.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)', 'GitHub Copilot code review'],
    tags: ['accessibility', 'a11y', 'wcag', 'code-review', 'ui-review'],
    whyItWorks:
      "Grounding each check against the actual pasted markup, rather than reciting a general accessibility checklist, targets the real failure mode of a bare 'check accessibility' request: it reliably produces true-but-generic ARIA advice that is not actually tethered to whether that advice applies to this specific markup at all, which reads as thorough without being checkable against anything concrete. Requiring the keyboard behavior to be stated per interaction pattern, rather than as one generic operability rule, reflects a genuine fact about accessibility requirements — a modal's expected keyboard behavior, trapping focus and returning it on close, is meaningfully different from a disclosure dropdown's, which mainly needs to close on Escape or an outside click, and a generic checklist has no way to know which specific expectation applies to the widget actually in front of it. Requiring an actual computed contrast ratio against a specific WCAG threshold, rather than a subjective readability judgment, matters because 'looks readable' is not a substitute for a number checked against 4.5:1 or 3:1 — and explicitly instructing the model to say so when the exact colors are not resolvable, rather than estimate a ratio that sounds authoritative, closes off a specific way a confident-sounding number can be wrong without anyone noticing it was never actually computed. Separating screen-reader semantics from visual review addresses the actual gap a sighted code review structurally cannot close on its own — a clickable div that looks exactly like a button to a sighted reviewer communicates nothing about its role to a screen reader, and a toggle with no aria-pressed state gives no signal at all about its current state to someone who cannot see it, which are both failures a review focused on how the UI looks will never surface because looking right and being semantically correct are simply different properties of the same markup.",
    exampleOutput:
      '1. Keyboard: dropdown opens on Enter or Space, but Escape does not close it — missing a keydown handler for Escape. 2. Semantics: the trigger is a real button element with aria-expanded, but the list has no listbox role associated with it — screen readers cannot tell the button controls this specific list. 3. Focus: outline removal is set on the trigger with no replacement focus style — flagged, needs a visible focus ring restored. 4. Contrast: 3.9:1 for the disabled-option text against the dropdown background — below the 4.5:1 threshold for normal text. 5. Status messaging: not applicable, this pattern has no error or status state.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.271 (VS Code)',
        date: '2026-08-03',
      },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Copilot Chat 1.271 (VS Code).',
      },
    ],
  },
  {
    slug: 'github-copilot-cli-terminal-task-brief',
    category: 'github-copilot',
    title: 'Pair gh copilot suggest with explain before running anything it returns',
    description:
      'A suggest-then-explain pairing for GitHub Copilot in the CLI that treats the returned command as a claim to check against a stated risk tolerance, not something to paste and run the moment it looks plausible.',
    promptText:
      "Run this through GitHub Copilot in the CLI:\ngh copilot suggest -t shell \"{{task_description}}\"\n\nWHY TWO SEPARATE CALLS\nsuggest and explain are two distinct invocations of the model, not one command with two outputs —\nasking explain to independently interpret the exact string suggest returned gives you a second,\nindependently generated read of the same command, which can catch something the first generation's\nown one-line description happened to omit.\n\nBefore running whatever command it returns, run gh copilot explain on the exact string it\nsuggested — a second, separate call to the model specifically asked what does this actually do, not\na restatement of the one-line description suggest already gave you — and check that explanation\nagainst the context below before touching a real terminal with it.\n\nENVIRONMENT THIS WILL RUN AGAINST\n{{environment_context}}\n\nSHELL\n{{shell_type}}\n\nRISK TOLERANCE FOR THIS SPECIFIC TASK\n{{risk_tolerance}}\n\nDO NOT RUN THE SUGGESTED COMMAND IF THE EXPLANATION SURFACES ANY OF THE FOLLOWING THAT YOU DID NOT\nEXPLICITLY ASK FOR\n- A recursive delete of any kind.\n- A force push, or any rewrite of already-shared git history.\n- A change to a file's permission or ownership bits.\n- A write, move, or delete reaching outside the current working directory.\n- A network call to a destination not named in {{task_description}}.\n\nIF THE EXPLANATION FLAGS ONE OF THOSE\nAsk gh copilot suggest again, this time stating explicitly in the follow-up prompt which of the\nitems above the first suggestion crossed and asking for a narrower alternative that stays within\n{{risk_tolerance}} — do not manually edit the flagged command yourself and run your own modified\nversion, since a hand-edited version of a command you did not fully trust in the first place has\nnot actually been explained or verified at all; it has just been changed based on a guess about\nwhich part was the risky one.\n\nIF THE EXPLANATION CONFIRMS THE COMMAND IS SAFE WITHIN {{risk_tolerance}}\nRun it as suggested. Do not add your own extra flags or arguments to the confirmed command before\nrunning it — anything added after the explanation step is a command that was never actually\nexplained, even if it looks like a small addition to one that was.\n\n{{shell_type}} DIFFERENCES TO WATCH FOR\nIf {{shell_type}} is not a standard POSIX shell, check the explanation specifically for whether the\nsuggested syntax — quoting, glob expansion, path separators — actually matches this shell's own\nrules rather than the POSIX conventions the suggestion may have been generated against by default.",
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
        required: true,
      },
      {
        name: 'shell_type',
        description: 'The shell this command will actually run in.',
        example: 'Git Bash on Windows 11',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot CLI', 'GitHub CLI (gh)'],
    tags: ['copilot-cli', 'terminal', 'shell-commands', 'safety', 'gh-cli'],
    whyItWorks:
      "gh copilot suggest generates a shell, git, or gh CLI command from a natural-language description, but it returns that command for a human to run manually — the CLI extension is deliberately built with that separation, since a wrong command against a real filesystem or a real git remote is not something anyone wants auto-executed on the strength of a natural-language description alone. Pairing it with gh copilot explain on the exact returned string, rather than trusting the one-line description suggest already produced, matters because suggest and explain are genuinely two separate calls to the model, generated independently — asking a second time, specifically what does this do, is a documented way to surface a side effect the first generation's own gloss omitted, precisely because the first generation was optimized for producing a plausible command, not for exhaustively describing every consequence of running it. Naming a risk tolerance up front and pre-committing to a fixed reject list — recursive delete, force push, permission changes, writes outside the working directory, an unnamed network destination — turns read the explanation carefully into a checkable gate applied the same way every single time, rather than relying on catching a dangerous flag through attentiveness alone in the moment right before running something, which is exactly the moment attention is weakest because the command already looks done and ready to paste. Refusing to hand-edit a flagged command and run the edited version instead of re-requesting a fresh suggestion closes a specific trap: an edit made to fix the one part that looked risky is a guess about which part was actually the problem, made by someone who by definition did not fully understand the original command well enough to have trusted it in the first place — a fresh suggestion, re-explained, is verified; a hand-patched one is not, no matter how small the edit looks. The shell-specific check exists because a command's explanation can be entirely accurate about what the command does in the shell it was generated against while still behaving differently in this one — quoting and glob rules are not universal across shells, and a suggestion generated with POSIX defaults in mind does not automatically carry a warning label when run somewhere those defaults do not hold.",
    exampleOutput:
      'gh copilot suggest returns a command that finds files larger than 50MB and lists them by size using find piped through sort. gh copilot explain confirms this is read-only — it lists matching files without modifying anything — so it clears the reject list and is safe to run as suggested.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot CLI',
        version: 'gh-copilot extension 1.9',
        date: '2026-08-04',
      },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against the gh-copilot CLI extension 1.9.',
      },
    ],
  },
  {
    slug: 'github-copilot-commit-message-why',
    category: 'github-copilot',
    title:
      "Get Copilot's commit message to explain why a change exists, not just list what moved",
    description:
      "A prompt for Copilot's Source Control commit-message generation that supplies the context a diff alone never contains, so the generated message states the reason for the change instead of a mechanical restatement of the files it touched.",
    promptText:
      "Generate the commit message for the currently staged changes, but do not describe the diff\nmechanically — 'updated file X,' 'added function Y' — since a message that only restates the diff\ntells a future reader nothing the diff itself did not already show them directly.\n\nWHY THIS CHANGE EXISTS\n{{staged_change_context}}\n\nTICKET OR ISSUE THIS CLOSES\n{{ticket_ref}}\n\nAUDIENCE FOR THIS MESSAGE\n{{audience}}\n\nIF MORE THAN ONE UNRELATED THING GOT STAGED\n{{mixed_changes_note}}\n\nFORMAT\nSubject line — imperative mood, under 72 characters, states the effect of the change on a user or\na future reader, not the mechanism used to achieve it. 'Fix zero-row CSV export crash' names the\neffect; 'Add null check to formatRowCount' names the mechanism and leaves the actual reason this\nmattered unstated.\n\nBody — one short paragraph on why this was necessary, referencing {{ticket_ref}} if one exists,\nfollowed by a line naming anything a reviewer of this commit later should know that is not obvious\npurely from reading the diff — a deliberate tradeoff that was made on purpose, a follow-up that was\nintentionally left for later, or a related issue that this commit does not attempt to fix.\n\nCHECK BEFORE FINALIZING\n- If the staged diff contains a change that looks unrelated to {{staged_change_context}}, say so\n  explicitly rather than writing one message that quietly covers both as if they were a single\n  coherent piece of work — a generated message will happily produce one smooth-sounding narrative\n  for two unrelated staged changes, and that smoothness is exactly what hides a commit that should\n  have been split before it ever reaches review.\n- If {{staged_change_context}} states a reason that the diff itself does not actually support — for\n  example, a stated fix for a crash but the diff does not touch the function that would actually\n  cause that crash — flag the mismatch rather than writing a confident message around a reason the\n  diff does not back up.\n- Do not invent a plausible-sounding reason for the change if {{staged_change_context}} is thin or\n  missing; write the message from what the diff can support on its own and note explicitly that the\n  why was not supplied, rather than filling the gap with a guess that reads as if it were known.\n\nWHAT A GOOD MESSAGE ACTUALLY EARNS\nA commit message that states the effect and the why is one a future git log or git blame session\ncan act on without opening the diff first — that is the actual test a generated message should\npass, not whether it accurately lists which lines changed, which the diff already shows without any\nmessage at all.",
    variables: [
      {
        name: 'staged_change_context',
        description:
          'Why this change exists, the part that never appears in the diff itself.',
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
      {
        name: 'audience',
        description: 'Who will actually read this message later, so its framing matches.',
        example: 'Other engineers reading git log later, not an end-user changelog.',
        required: false,
      },
      {
        name: 'mixed_changes_note',
        description:
          'Whether an unrelated change also got staged alongside the main one.',
        example:
          'I also fixed an unrelated typo in the README while I was in there — flag that as a separate concern if it is still staged.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot (VS Code Source Control)'],
    tags: ['commit-messages', 'git', 'source-control', 'documentation'],
    whyItWorks:
      "Copilot's Source Control integration generates a commit message from the staged diff through a one-click action, and left to the diff alone it produces a mechanically accurate but genuinely low-value summary, because it can see exactly what changed but has no access to why, and the why almost always lives somewhere the diff itself cannot show — a conversation, a support ticket, a decision made in a meeting that never touched the code directly. Supplying that context explicitly is not a workaround for an under-prompted tool so much as the only way to get information into the message that the diff-only generation path structurally cannot reach on its own; no amount of clever prompting recovers information that was never in the input. The instruction to distinguish effect from mechanism in the subject line matters because a diff-derived summary defaults toward describing the mechanism specifically because the mechanism is the part visible directly in the patch — the effect, what the change actually accomplishes for a user or for a future engineer scanning git log without opening every commit, is exactly the part that has to come from supplied context rather than be read off the code, and a generation path with no such context reliably falls back to the mechanism because it is the only thing actually available to describe. Flagging unrelated staged changes rather than folding them into one narrative catches a real and common problem specific to how generation models handle multi-purpose input: asked to summarize a diff containing two unrelated changes, the model will produce one coherent-sounding story that covers both, and that coherence is the actual failure — a reviewer reading a smooth, well-written message has less reason to ask whether this commit should have been two commits than they would reading two visibly disconnected bullet points, so the more polished the generated message, the more effectively it can hide a mixed commit that should have been split before anyone reviewed it at all.",
    exampleOutput:
      'Fix zero-row CSV export crash. Exporting a report filtered to zero matching rows threw a TypeError in formatRowCount, since dividing by a zero total produced NaN and calling toFixed on NaN throws. Guarded the calculation to return a fixed zero value when total is zero. Closes JIRA-4821. Note: the same unguarded pattern exists in formatAverageValue and is tracked separately, not fixed here.',
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot',
        version: 'VS Code Source Control integration, 1.271',
        date: '2026-08-05',
      },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against the Copilot VS Code Source Control integration.',
      },
    ],
  },
  {
    slug: 'github-copilot-model-picker-task-fit',
    category: 'github-copilot',
    title:
      "Choose the right model in Copilot Chat's model picker instead of leaving it on default for everything",
    description:
      "A task-classification prompt that states the actual reasoning demand of the work before picking a model from Copilot Chat's picker, so a quick mechanical rename and a genuine architectural tradeoff are not both run on whichever model happened to be selected last.",
    promptText:
      "Before sending this to Copilot Chat, decide which model in the model picker this task actually\nneeds — do not leave it on whatever was selected for the previous, possibly very different, task.\n\nTASK\n{{task_description}}\n\nREASONING DEMAND\n{{reasoning_demand}}\n\nMODELS AVAILABLE IN THIS WORKSPACE'S PICKER\n{{available_models}}\n\nLATENCY OR COST CONSTRAINT\n{{latency_or_cost_constraint}}\n\nPICK USING THIS RULE\nIf {{reasoning_demand}} describes genuine tradeoff reasoning — comparing two real architectural\napproaches, tracing a subtle bug across several files, reviewing a security-sensitive change —\nselect the strongest reasoning-oriented model {{available_models}} offers, even if it is slower,\nbecause the cost of a wrong architectural call caught late is categorically higher than the extra\nseconds a stronger model takes to answer. If the task is mechanical — a rename across files\nmatching an exact pattern, formatting a list into a table, generating a boilerplate test file from\nan existing template — a faster, cheaper model in the picker will produce an equivalent result with\nless latency, and running it on the strongest available model for that kind of task spends budget\nthe task did not need spent.\n\nBEFORE SWITCHING MODELS MID-CONVERSATION\nState explicitly that the model is changing and why, in the same message where you switch — a\ndifferent model does not share the exact reasoning trace of the model that answered the previous\nturn, only the visible conversation text, so a silent mid-conversation switch can produce an answer\nthat looks like it continues the previous reasoning but was actually regenerated from scratch by a\ndifferent model reading only the transcript, not the reasoning that produced it.\n\n{{fallback_policy}}\n\nCONSTRAINTS\n- Do not assume every model in {{available_models}} handles the same prompt structure equally well\n  — a reasoning-oriented model generally tolerates an underspecified, exploratory question better\n  than a faster completion-oriented model, which tends to need the task, constraints, and output\n  format spelled out explicitly to produce a comparably good answer; adjust how much structure you\n  give the prompt to the model actually selected, not a generic phrasing meant to work identically\n  on all of them.\n- If {{latency_or_cost_constraint}} rules out the model {{reasoning_demand}} would otherwise call\n  for, say so explicitly rather than silently using a weaker model and treating its answer with the\n  same confidence you would give the stronger one — a constrained choice should come with a\n  correspondingly more skeptical read of the output, not the same trust level.",
    variables: [
      {
        name: 'task_description',
        description: 'The task being sent to Copilot Chat.',
        example:
          'Decide whether to store saved searches as a new database table or as a JSON column on the existing user_preferences row, and justify the choice.',
        required: true,
      },
      {
        name: 'reasoning_demand',
        description:
          'How much genuine tradeoff reasoning this task actually requires, versus mechanical work.',
        example:
          'Genuine tradeoff reasoning — this is an architectural decision with real long-term cost either way, not a mechanical task.',
        required: true,
      },
      {
        name: 'available_models',
        description:
          "Which models are actually enabled in this workspace's model picker.",
        example:
          "Claude Sonnet 4.6, GPT-5.2, and Gemini 3 Pro are all enabled in this workspace's picker.",
        required: true,
      },
      {
        name: 'latency_or_cost_constraint',
        description:
          'Any real constraint on how slow or expensive the answer is allowed to be.',
        example:
          'None for this task — it runs once, so a slower, stronger model is worth the extra wait.',
        required: false,
      },
      {
        name: 'fallback_policy',
        description:
          'What to do if the preferred model is unavailable or rate-limited when this is sent.',
        example:
          'If the strongest model is rate-limited, fall back to the second-strongest reasoning model rather than the fastest one, and say explicitly that a fallback happened.',
        required: false,
      },
    ],
    targetTools: ['GitHub Copilot Chat (VS Code)', 'GitHub Copilot Chat (JetBrains)'],
    tags: [
      'model-picker',
      'model-selection',
      'copilot-chat',
      'workflow',
      'cost-latency-tradeoff',
    ],
    whyItWorks:
      "Different models genuinely differ in reasoning depth versus latency and cost, which makes the model picker a real, consequential per-task choice rather than a cosmetic setting — the actual tradeoff this prompt asks you to weigh explicitly is that a wrong call on a genuine architectural decision, caught late after code has already been built on top of it, costs categorically more than the extra seconds a stronger model takes to answer, while a mechanical task run on the strongest available model spends latency and cost budget on work that did not need that level of reasoning at all. A mid-conversation model switch does not carry over the reasoning trace of the model that answered the previous turn — only the visible conversation text does — which means a silently swapped-in model reads the transcript as its entire memory of the conversation and reconstructs its own reasoning from scratch, producing an answer that can look like a natural continuation while actually being a fresh, independent judgment that never saw whatever led to the earlier turn's specific phrasing or caveats; stating the switch explicitly at least surfaces that discontinuity instead of letting it pass unnoticed. Prompt structure needs genuinely vary by model type in a well-documented way: a reasoning-oriented model tends to tolerate an underspecified, exploratory question and do useful work filling in the gaps itself, while a faster, completion-oriented model tends to need the task, constraints, and output format spelled out explicitly to produce a comparably reliable answer, so a prompt written with one model's tolerances in mind can underperform when the same wording is sent to the other. Finally, calibrating trust to the constraint that actually determined the choice — treating an answer from a cost-constrained fallback model with more skepticism than one from the strongest available model — matters because the alternative is applying uniform confidence to outputs that were not produced under uniform conditions, which quietly erases the very information a stated fallback was supposed to preserve.",
    verifiedAgainst: [
      {
        tool: 'GitHub Copilot Chat',
        version: 'Copilot Chat 1.271 (VS Code, multi-model picker)',
        date: '2026-08-06',
      },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Copilot Chat 1.271 (VS Code) multi-model picker.',
      },
    ],
  },
  {
    slug: 'github-copilot-pr-review-checklist-chat',
    category: 'github-copilot',
    title: `Turn a PR review into a repo-specific checklist Copilot Chat actually runs against the diff`,
    description: `A Copilot Chat prompt that reviews a pull request against your team's actual blocking criteria — not a generic 'looks good' pass — by naming the specific risk areas, house conventions, and severity rules before it ever reads the diff.`,
    promptText: `You are reviewing a pull request in this repository using Copilot Chat, with the PR's diff open or referenced via #file so you have the actual changed lines in context, not a description of them.

PR CONTEXT
{{pr_context}}

RISK AREAS TO WEIGHT MOST HEAVILY
{{risk_areas}}

HOUSE CONVENTIONS THIS DIFF MUST FOLLOW
{{house_conventions}}

BLOCKING VS. NITPICK RULE
{{blocking_vs_nitpick}}

FILES OUT OF SCOPE FOR THIS REVIEW
{{out_of_scope_files}}

STEP 1 — SCAN FOR BLOCKING ISSUES FIRST
Go through the diff once looking only for issues that match the blocking criteria above — do not surface a style nitpick in this pass even if you notice one, since mixing severities in one list is how a genuine blocker gets buried under six formatting comments and skimmed past. For each blocking issue, cite the exact file and line range from the diff you were shown, not a paraphrase of what the file probably does — if you are inferring behavior from a function name rather than reading its body, say so explicitly rather than presenting a guess as a finding.

STEP 2 — CHECK THE RISK AREAS SPECIFICALLY
For each item under RISK AREAS, state explicitly whether this diff touches it at all. If it does not, say so in one line and move on — do not manufacture a paragraph of analysis about a risk area the diff never goes near just to look thorough.

STEP 3 — HOUSE CONVENTIONS PASS
Check the diff against each house convention listed above as a yes/no, not a vibe. A convention either was followed in the changed lines or it was not; if you can't tell from what's in context, say which additional file you'd need to see rather than assuming compliance.

STEP 4 — NITPICKS, SEPARATED
List lower-severity suggestions in their own section, clearly separated from Step 1, and skip the files named as out of scope entirely — do not comment on a vendored or generated file just because it happened to appear in the diff.

OUTPUT FORMAT
1. Verdict: approve / request changes / needs discussion.
2. Blocking issues (file:line, what's wrong, what would fix it).
3. Risk-area check (one line per named risk area).
4. House-convention check (one line per convention, yes/no/can't-tell).
5. Nitpicks (separate section, optional to act on).`,
    variables: [
      {
        name: 'pr_context',
        description: `What this PR is supposed to do, in the author's own words, so Copilot judges the diff against its actual intent rather than guessing at scope.`,
        example: `Adds rate limiting to the /api/checkout endpoint after last week's incident where a retry loop from a client bug hit it 40,000 times in an hour.`,
        required: true,
      },
      {
        name: 'risk_areas',
        description: `The specific things this review should weight most heavily, not a generic checklist.`,
        example: `Whether the rate-limit key is scoped per-user or per-IP (per-IP would break for users behind a shared corporate proxy), and whether the 429 response includes a Retry-After header.`,
        required: true,
      },
      {
        name: 'house_conventions',
        description: `Project-specific conventions this diff is expected to follow.`,
        example: `All new middleware must be registered in middleware/index.ts, not imported ad hoc in the route file; error responses must use the shared ApiError class.`,
        required: true,
      },
      {
        name: 'blocking_vs_nitpick',
        description: `The rule that decides whether an issue blocks merge or is just a suggestion, so severity isn't left to Copilot's judgment alone.`,
        example: `Anything that could let a request bypass the rate limiter entirely is blocking; naming, comment style, and import order are nitpicks only.`,
        required: true,
      },
      {
        name: 'out_of_scope_files',
        description: `Files in the diff that should be skipped entirely, since they aren't hand-authored or aren't part of this change's real scope.`,
        example: `package-lock.json and any file under generated/ that changed only because of a dependency bump.`,
        required: false,
      },
    ],
    targetTools: [`GitHub Copilot Chat`],
    tags: [`code-review`, `pull-requests`, `pr-checklist`, `copilot-chat`, `quality-gates`],
    whyItWorks: `Copilot Chat's code review reads only the diff and whatever files you've pulled into context with #file or #codebase — it has no memory of your team's actual bar for what blocks a merge versus what's a preference, so an unscoped 'review this PR' prompt defaults to a generic pass that treats a missing Retry-After header and a debatable variable name as the same category of finding. Splitting the pass into a blocking-issues-first step and a separately labeled nitpicks section exploits how the model allocates attention across a response: when severities are interleaved, a genuine blocker sitting between five style comments gets the same visual weight as the nitpicks around it and is the item most likely to get skimmed past by a human reviewer scanning quickly, whereas forcing the blocking scan to happen first and alone means the finding that matters gets read before reviewer attention degrades. Requiring a yes/no/can't-tell answer against each house convention — rather than a free-form paragraph — closes a specific failure mode where Copilot Chat, working only from a diff without the full file, will infer that a convention was probably followed based on surrounding code style even when the actual enforcement point isn't visible in the changed lines; forcing an explicit can't-tell answer surfaces exactly where the review needs a wider context window instead of silently guessing. Naming out-of-scope files matters because a diff that includes a lockfile or generated output will otherwise get commented on as if it were hand-written source, producing a review comment on a file no human is meant to read or edit, which erodes trust in the rest of the review's judgment even where it was accurate.`,
    exampleOutput: `Verdict: request changes. Blocking: middleware/rateLimiter.ts:14 — the limiter key uses req.ip, which the risk-area note flags as breaking for users behind a shared proxy; switch to a per-user key derived from the session token. House conventions: middleware registration — yes, correctly added to middleware/index.ts; ApiError usage — no, the 429 branch returns a raw object literal instead of ApiError. Nitpicks: rateLimiter.ts:31 — variable name \`cnt\` could be \`requestCount\` for clarity.`,
    verifiedAgainst: [
      { tool: 'GitHub Copilot Chat', version: '2026.08', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against GitHub Copilot Chat 2026.08.`,
      },
    ],
  },
  {
    slug: 'github-copilot-explain-legacy-function-onboarding',
    category: 'github-copilot',
    title: `Get Copilot Chat to explain a gnarly legacy function the way a teammate would, not a syntax tour`,
    description: `A targeted /explain-style prompt for one confusing piece of legacy code, aimed at the actual reason it's confusing and the business logic behind it, instead of a line-by-line narration of syntax the reader already knows.`,
    promptText: `Explain the following code the way a senior teammate would talk me through it at my desk, not the way a syntax reference would describe it line by line. I have it selected in the editor / referenced via #file, so read the actual implementation, not just the function signature.

CODE TO EXPLAIN
{{function_or_file}}

WHY THIS IS CONFUSING
{{why_confusing}}

WHO'S ASKING
{{audience_level}}

BUSINESS CONTEXT IF RELEVANT
{{business_context}}

Skip explaining what a for-loop or an if-statement does — assume I can read the language itself. Spend the explanation on the part I actually flagged as confusing: why the code takes the shape it does, not what each line executes in isolation. If a chunk of logic only makes sense as a workaround for something else — a bug in a library, a constraint from an older version of an API, a business rule that isn't visible anywhere in the code itself — say that explicitly rather than describing the workaround as if it were the most natural way to write this. If you can't tell why a particular section exists from the code alone, say so directly instead of inventing a plausible-sounding rationale; a wrong explanation stated confidently is worse than an honest 'I can't tell why this branch exists from what's shown, it might be defensive code for a case that no longer happens.'

Give me: what this code is for in one sentence, then walk through the confusing part specifically, then flag anything that looks like it could be a latent bug or dead code rather than intentional logic — but label that section clearly as a side observation, not the main explanation, so it doesn't get mistaken for what I actually asked about.`,
    variables: [
      {
        name: 'function_or_file',
        description: `The specific function, class, or file to explain — reference it by name so Copilot pulls the real implementation from context rather than working from the pasted snippet alone.`,
        example: `calculateProratedRefund() in billing/refunds.ts`,
        required: true,
      },
      {
        name: 'why_confusing',
        description: `The specific thing about this code that doesn't make sense, so the explanation targets it instead of narrating the whole function evenly.`,
        example: `It multiplies the refund amount by 0.9722 partway through and I can't find any comment explaining where that number comes from.`,
        required: true,
      },
      {
        name: 'audience_level',
        description: `Who needs this explanation, so the depth and vocabulary match — a new hire needs different framing than someone debugging a specific incident.`,
        example: `A backend engineer three weeks into the team, comfortable with TypeScript but new to this billing subsystem.`,
        required: true,
      },
      {
        name: 'business_context',
        description: `Any business rule or history that might explain otherwise-arbitrary logic, if you already know part of it.`,
        example: `We changed our refund policy from 30-day to 28-day windows about a year ago, so some of this might be leftover from that.`,
        required: false,
      },
    ],
    targetTools: [`GitHub Copilot Chat`],
    tags: [`code-explanation`, `onboarding`, `legacy-code`, `copilot-chat`, `knowledge-transfer`],
    whyItWorks: `Copilot Chat's default /explain behavior tends toward a structural walkthrough — describing control flow and syntax in the order it appears — because without a stated target it has no signal for which part of the code the reader already understands versus which part is the actual source of confusion, so it hedges by covering everything at roughly even depth. Naming the confusing part specifically redirects that effort: the model can spend its explanation budget on the one branch or magic number that prompted the question instead of splitting attention evenly across code the reader can already read fine, which is the single biggest difference between an explanation that feels like a wasted read and one that actually resolves the question. The instruction to say 'I can't tell why this exists' rather than inventing a rationale matters specifically for legacy code, where Copilot Chat has a documented tendency to generate a plausible-sounding justification for arbitrary-looking logic — a magic constant or an odd conditional — because plausible narrative completion is what a language model does by default when no comment or commit history explains the real reason; without an explicit permission to say 'unclear,' the model will produce a confident-sounding but fabricated explanation rather than flag the actual gap in available information. Separating the flagged side-observations (possible dead code, latent bugs) from the main explanation prevents a specific confusion where a reader asked 'what does this do' gets an answer that quietly pivots into 'here's a bug I found instead,' burying the original question under an unrelated finding the reader didn't ask for in that message.`,
    exampleOutput: `This function prorates a refund based on how many days into the billing period the cancellation happened. The 0.9722 multiplier at line 42 isn't explained anywhere in this file or its git blame context available to me — it doesn't match a clean fraction of 28 or 30 days, so I can't confidently tell you where it comes from; it may be a rounding artifact from the old 30-day policy that was never recalculated after the switch to 28-day windows you mentioned. Separately, flagging as a side note: the early return on line 12 looks like it could skip the proration entirely for annual plans, which may or may not be intentional.`,
    verifiedAgainst: [
      { tool: 'GitHub Copilot Chat', version: '2026.08', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against GitHub Copilot Chat 2026.08.`,
      },
    ],
  },
  {
    slug: 'github-copilot-generate-unit-tests-edge-cases',
    category: 'github-copilot',
    title: `Push Copilot's /tests beyond the happy path with edge cases it won't reach for on its own`,
    description: `A prompt that layers named edge cases and mocking boundaries on top of Copilot Chat's /tests generation, so the resulting suite exercises the failure paths you actually care about instead of one clean happy-path test per function.`,
    promptText: `Generate unit tests for the function below using {{test_framework}}, matching the conventions of the existing test file so this reads like it was written by the same person, not a separate generated block bolted on afterward.

FUNCTION UNDER TEST
{{target_function}}

EXISTING TEST FILE FOR STYLE REFERENCE
{{existing_test_file}}

EDGE CASES THAT MUST BE COVERED
{{known_edge_cases}}

WHAT TO MOCK VS. WHAT TO LEAVE REAL
{{mocking_boundary}}

WHAT NOT TO DO
Do not stop at one happy-path test and call the suite done — a single passing-input test is the case Copilot generates by default with no further instruction, and it is also the least useful one, since it's the case most likely to have already been checked manually before the code shipped. Do not mock something the mocking boundary above says should stay real, even if mocking it would make the test simpler to write — a test that mocks around the exact thing it should be verifying gives false confidence, not real coverage. Do not invent an edge case that isn't listed above and isn't a case any reasonable reading of the function would surface (like null input or an empty array) — pad the suite with cases that matter, not with cases that exist only to inflate the count. Do not rename or restructure existing tests in the reference file; only add new ones in the same style.

For each edge case listed above, write one test that isolates it — don't fold two edge cases into a single test where a failure would be ambiguous about which condition actually broke. If a listed edge case turns out to be already covered by an existing test in the reference file, say so explicitly instead of duplicating it.

OUTPUT FORMAT
1. New test cases, in the same file and style as the existing reference file.
2. A one-line note for any listed edge case that was already covered and therefore skipped.
3. A short list of any edge case you'd recommend adding beyond what was listed, with a one-sentence reason each — as suggestions only, not added to the file unless I ask.`,
    variables: [
      {
        name: 'target_function',
        description: `The function or method to write tests for, referenced so Copilot reads the real implementation.`,
        example: `applyDiscountCode(cart, code) in checkout/discounts.ts`,
        required: true,
      },
      {
        name: 'test_framework',
        description: `The test framework and runner conventions in use, so generated tests match without manual rewriting.`,
        example: `Vitest, with describe/it blocks and the existing project's custom \`renderCart()\` test helper`,
        required: true,
      },
      {
        name: 'known_edge_cases',
        description: `The specific edge cases you already know matter, so the model targets them instead of guessing.`,
        example: `Discount code applied twice in one session, code that's valid but the cart total is below the minimum spend, and a code that expired exactly at the current timestamp (boundary, not just past-expiry).`,
        required: true,
      },
      {
        name: 'mocking_boundary',
        description: `What should be mocked versus left as real logic, so the test actually exercises what it claims to.`,
        example: `Mock the external pricing API call, but let the actual discount-calculation math run for real — don't mock the function under test's own internal logic.`,
        required: true,
      },
      {
        name: 'existing_test_file',
        description: `The current test file for this module or a sibling one, used purely as a style reference.`,
        example: `checkout/discounts.test.ts`,
        required: false,
      },
    ],
    targetTools: [`GitHub Copilot Chat`],
    tags: [`unit-testing`, `test-generation`, `edge-cases`, `copilot-chat`, `code-quality`],
    whyItWorks: `Copilot's /tests command, run with no further instruction, is trained to produce output that looks complete at a glance — typically one test per function covering the input the function was clearly designed for — because that's the shape of test that appears most often in the training distribution of committed code, not because it's judged the function's actual risk surface. Naming edge cases explicitly overrides that default by giving the model a concrete, finite list to check off rather than an open-ended 'be thorough' instruction it has no way to bound; an unbounded thoroughness request tends to produce either too few cases (stopping once it feels sufficient) or padding with trivial variations that don't map to a real failure mode. The mocking boundary is the single highest-leverage line in this prompt because Copilot Chat, left to its own judgment, will often mock whatever makes a test easiest to write rather than whatever preserves the test's actual purpose — it has no inherent sense of which dependency is incidental infrastructure (an external API) versus the exact logic the test exists to verify, so an unstated boundary produces tests that pass reliably while verifying almost nothing. Requiring one isolated test per edge case rather than combined multi-condition tests matters for diagnosability: a test asserting two conditions at once tells you it failed, not which condition broke, which defeats the point of writing edge-case tests in the first place — the value of an edge-case suite is in the specificity of its failure signal, not just its pass/fail count. Matching the existing file's style also avoids a subtler cost: a generated block that looks structurally different from hand-written tests around it gets treated by future readers as less trustworthy scaffolding, even when its assertions are correct.`,
    exampleOutput: `it('rejects a discount code applied twice in the same session', () => { ... expect(applyDiscountCode(cartWithCodeAlreadyApplied, 'SAVE10')).toThrow('Code already applied') }); it('rejects a valid code when cart total is below minimum spend', () => { ... }); it('treats a code expiring at the exact current timestamp as expired, not valid', () => { ... }). Note: the 'invalid code format' edge case is already covered by the existing \`rejects malformed codes\` test in discounts.test.ts, so it was skipped here.`,
    verifiedAgainst: [
      { tool: 'GitHub Copilot Chat', version: '2026.08', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against GitHub Copilot Chat 2026.08.`,
      },
    ],
  },
  {
    slug: 'github-copilot-integration-test-plan-api-flow',
    category: 'github-copilot',
    title: `Write an integration test plan for a multi-service flow, not just another mocked unit test`,
    description: `Gets Copilot Chat to design an integration test that exercises a real multi-step flow across actual dependencies — a database, a queue, a second internal service — instead of quietly producing another unit test with everything mocked out.`,
    promptText: `You are designing an integration test for a flow that spans more than one component in this system, where the point of the test is to catch failures that only show up when the real pieces talk to each other — not a unit test with every dependency mocked, which would miss exactly the class of bug this test needs to catch.

FLOW TO TEST
{{flow_description}}

DEPENDENCIES THAT MUST BE REAL, NOT MOCKED
{{real_dependencies}}

SPECIFIC FAILURE POINTS THIS SHOULD CATCH
{{failure_points}}

TEST ENVIRONMENT AVAILABLE
{{test_environment}}

PHASE 1 — CONFIRM WHAT 'INTEGRATION' MEANS FOR THIS FLOW
Before writing any test code, state back which components will be exercised for real versus which (if any) still need to be mocked because they're genuinely external to this system (a third-party payment processor sandbox, for example, might reasonably still be a mock or a recorded fixture) — and justify each mock against the failure points listed, so a mock is never added just because it's more convenient to write around.

PHASE 2 — SETUP AND TEARDOWN
Describe how the test environment gets into a known state before the test runs and back to clean afterward — using the test environment described above — since an integration test that leaves state behind will produce flaky, order-dependent failures in every test that runs after it, which is a worse outcome than not having the test at all.

PHASE 3 — THE TEST ITSELF
Write the test so it exercises the flow end to end through the real dependencies, asserting on outcomes that could only be wrong if the real integration between components broke — not on internal implementation details that a unit test would already cover. For each of the specific failure points listed, make sure there's an assertion that would actually fail if that specific failure happened; a passing integration test that wouldn't have caught the incident it was written in response to isn't accomplishing anything.

PHASE 4 — WHAT THIS TEST DELIBERATELY DOES NOT COVER
State explicitly what's still out of scope for this test (edge cases already handled by unit tests, load/concurrency behavior, etc.) so nobody mistakes this one test for full coverage of the flow.

OUTPUT FORMAT
1. Mock justification (Phase 1).
2. Setup/teardown code.
3. The integration test itself.
4. Explicit out-of-scope note (Phase 4).`,
    variables: [
      {
        name: 'flow_description',
        description: `The actual multi-step flow this test needs to exercise, described concretely.`,
        example: `A user submits an order, which writes to the orders table, publishes an OrderCreated event to the queue, and the inventory service consumes that event to decrement stock.`,
        required: true,
      },
      {
        name: 'real_dependencies',
        description: `Which components must be real (a real database, a real queue) rather than mocked, since that's the whole point of an integration test.`,
        example: `Postgres (via a test database), the real RabbitMQ instance running in the test environment, and the actual inventory service — not a stub of it.`,
        required: true,
      },
      {
        name: 'failure_points',
        description: `The specific ways this flow has broken or could break, which the test must be able to actually catch.`,
        example: `The queue event was published before the database transaction committed, so the inventory service sometimes processed an order that didn't fully exist yet.`,
        required: true,
      },
      {
        name: 'test_environment',
        description: `What test infrastructure is actually available for setup/teardown — testcontainers, a shared staging environment, docker-compose, etc.`,
        example: `Testcontainers spins up Postgres and RabbitMQ per test run; the inventory service runs locally via docker-compose.test.yml.`,
        required: true,
      },
    ],
    targetTools: [`GitHub Copilot Chat`],
    tags: [`integration-testing`, `test-strategy`, `multi-service`, `copilot-chat`, `reliability`],
    whyItWorks: `Asked for an 'integration test' with no further constraint, Copilot Chat frequently produces something that is structurally a unit test with a slightly larger surface area — every collaborator mocked, assertions checking that the right mock methods were called rather than that real systems actually agree with each other — because that pattern dominates what 'test' generally means in most training data, and the model has no way to know which of your dependencies are the actual point of the test versus incidental plumbing unless told. Requiring an explicit mock-justification phase before any test code gets written forces that judgment call into the open where you can correct it, rather than discovering three weeks later that the 'integration test' for a queue-consumer flow mocked the queue itself and would never have caught the exact ordering bug it was written to catch. Tying each failure point to a specific required assertion addresses the most common way integration tests silently stop being useful: a test can pass indefinitely while asserting on details that have nothing to do with the actual incident it was supposed to guard against, and without being forced to trace each named failure point to a concrete assertion, Copilot Chat will tend to write generically 'reasonable-looking' assertions that happen not to cover the case that matters. The explicit out-of-scope phase matters organizationally more than technically: a team that reads 'we have an integration test for this flow' tends to over-trust its coverage unless the test itself states plainly what it does not check, and that overconfidence is exactly how gaps get left unaddressed for months after a single integration test was added and assumed to be sufficient.`,
    exampleOutput: `Mock justification: Postgres, RabbitMQ, and the inventory service all run for real via testcontainers/docker-compose — nothing here is mocked, since the failure point (event published before commit) only manifests when the real transaction-commit timing interacts with the real queue delivery. Test: creates an order via the real order-creation path, asserts the DB row exists AND was committed before asserting the queue message was consumed, specifically checking commit-then-publish ordering rather than just checking both eventually happened. Out of scope: this test does not cover concurrent order creation under load, or the inventory service's own unit-level decrement logic, which is already covered elsewhere.`,
    verifiedAgainst: [
      { tool: 'GitHub Copilot Chat', version: '2026.08', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against GitHub Copilot Chat 2026.08.`,
      },
    ],
  },
  {
    slug: 'github-copilot-generate-api-reference-from-route-handlers',
    category: 'github-copilot',
    title: `Generate an API reference straight from the route handlers, not from what you remember they do`,
    description: `A Copilot Chat prompt that builds an API reference table by reading the actual route handler code via #codebase, catching drift between what an endpoint was designed to do and what it currently, actually does.`,
    promptText: `Generate an API reference for the endpoints below by reading their actual current implementation — reference the route files with #file or #codebase so you're documenting the real request handling and response shape, not a remembered or assumed version of it.

ROUTE FILES TO DOCUMENT
{{route_files}}

AUTH MODEL FOR THESE ROUTES
{{auth_model}}

RESPONSE-SHAPE NOTES
{{response_shape_notes}}

WHERE THE OUTPUT SHOULD LIVE
{{doc_output_path}}

For each endpoint, read the handler function itself, not just its name or route path — a route named /users/:id/orders could still, in its current implementation, only return the last 30 days of orders, or silently exclude cancelled ones, and that kind of behavior is only visible in the function body, never in the route signature. If the code validates the request body with a schema (Zod, Joi, a class-validator DTO, whatever this codebase uses), pull the actual field names, types, and required/optional status from that schema rather than restating them from memory or from any existing doc comment above the function, since a stale doc comment describing an older version of the schema is a common and specific way documentation drifts out of sync with the code it's supposed to describe.

For each endpoint, note explicitly if the current implementation's behavior looks like it might not match what the route name or an existing comment implies it does — flag that as a discrepancy to confirm with me rather than silently documenting either the name's implication or the code's actual behavior as if there were no conflict.

OUTPUT FORMAT (as a markdown table per endpoint, matching the target file at {{doc_output_path}})
| Field | Value |
|---|---|
| Method + path | |
| Auth required | |
| Request body / params | |
| Success response shape | |
| Error responses | |
| Notes / discrepancies found | |

After the tables, list separately any endpoint where the implementation didn't match its name or existing docs closely enough that you'd want a human to confirm the intended behavior before this reference is treated as authoritative.`,
    variables: [
      {
        name: 'route_files',
        description: `The specific route handler files to document, so Copilot reads real implementations rather than working from route names alone.`,
        example: `api/routes/orders.ts and api/routes/orders.[id].ts`,
        required: true,
      },
      {
        name: 'auth_model',
        description: `How auth actually works for these routes, so the reference states it correctly rather than guessing from middleware names.`,
        example: `Bearer JWT required on all routes except GET /orders/public-status, which is intentionally unauthenticated.`,
        required: true,
      },
      {
        name: 'response_shape_notes',
        description: `Anything about response shapes that isn't obvious from the code alone, like a shared envelope format.`,
        example: `All success responses are wrapped in { data: ..., meta: { requestId } }; errors use { error: { code, message } }.`,
        required: false,
      },
      {
        name: 'doc_output_path',
        description: `Where this reference should live, so formatting matches the existing docs convention.`,
        example: `docs/api/orders.md`,
        required: true,
      },
    ],
    targetTools: [`GitHub Copilot Chat`],
    tags: [`api-documentation`, `codebase-context`, `copilot-chat`, `technical-writing`, `drift-detection`],
    whyItWorks: `Copilot Chat's #codebase and #file context references let it read the actual handler implementation rather than pattern-matching on the route's name and an existing doc comment, which matters specifically because API documentation drift almost never comes from someone documenting nothing — it comes from someone documenting the endpoint as it was designed, and the code quietly changing underneath that description over a series of unrelated PRs. Instructing the model to pull field names and required/optional status from the actual validation schema rather than restating a doc comment closes the single most common drift vector directly: a schema is executable and gets exercised by real requests, so it reflects current behavior by construction, while a doc comment is prose that nobody is forced to update when the schema changes, and Copilot Chat has no inherent preference for the more authoritative source unless told which one to trust when they disagree. The explicit instruction to flag a mismatch between a route's name/existing docs and its actual current behavior — rather than silently picking one version to document — matters because a language model asked to 'document this endpoint' will, by default, try to produce a single coherent-sounding description and will tend to smooth over a contradiction rather than surface it, since a clean unified answer looks more complete than one that flags its own uncertainty; without being told explicitly that a discrepancy is a valuable finding rather than an untidy one, it gets silently resolved in whichever direction sounds more natural, which is exactly the kind of silent resolution that produces documentation nobody can trust. The table format per endpoint also keeps this reference machine-comparable against a previous version stored in the same repo, so future re-runs of this same prompt can be diffed against doc_output_path's prior content to catch exactly what changed.`,
    exampleOutput: `| Field | Value |
|---|---|
| Method + path | GET /users/:id/orders |
| Auth required | Yes — Bearer JWT, must match :id or have admin role |
| Request body / params | Query param \`includeCancelled\` (boolean, optional, default false) |
| Success response shape | { data: Order[], meta: { requestId } } |
| Error responses | 401 unauthenticated, 403 id mismatch without admin role, 404 user not found |
| Notes / discrepancies found | The route name implies all orders, but the handler silently filters to the last 30 days unless a \`since\` param is passed — this isn't mentioned anywhere in the existing docs comment; flagging for confirmation. |`,
    verifiedAgainst: [
      { tool: 'GitHub Copilot Chat', version: '2026.08', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against GitHub Copilot Chat 2026.08.`,
      },
    ],
  },
  {
    slug: 'github-copilot-onboarding-readme-new-contributor',
    category: 'github-copilot',
    title: `Write a README a new contributor could follow without pinging you on day one`,
    description: `Builds a developer-facing README from the repo's actual structure and setup steps, tested against the specific gotchas that trip up a first-time contributor, instead of a generic 'clone and npm install' template.`,
    promptText: `Write a developer README for this repository, using #codebase so you're describing the actual project structure and scripts as they exist right now, aimed specifically at someone who has never touched this codebase before and has no one sitting next to them to ask.

WHAT THIS PROJECT IS
{{repo_purpose}}

SETUP STEPS AS THEY CURRENTLY WORK
{{setup_steps_known}}

GOTCHAS THAT HAVE TRIPPED PEOPLE UP BEFORE
{{common_gotchas}}

A GOOD FIRST TASK TO POINT SOMEONE AT
{{first_task_recommendation}}

Write the setup section as steps that were actually verified to work, in order, including any step that feels obvious to someone who already has the repo working — the failure mode this README exists to prevent is a step that got skipped in the writing because it felt too basic to mention, and that's precisely the step a first-timer trips on. For each gotcha listed, don't just state the gotcha — state what it looks like when it goes wrong (the actual error message or symptom) so a new contributor can pattern-match their own screen against this document instead of wondering if they're even hitting the documented issue. Read the actual package.json / equivalent scripts file via #codebase and list the real script names and what each one actually does, not a guessed-at convention like 'probably npm run dev' — if a script's actual behavior doesn't match what its name suggests, note that explicitly.

Do not pad this with sections that don't apply to a first-time contributor's first day — skip a detailed architecture deep-dive or a full contribution-guidelines legal section unless it's directly relevant to getting a working local environment and understanding where to start; those belong in a separate document this README can link to, not inline in the first thing a new contributor reads.

OUTPUT FORMAT
1. One-paragraph project description.
2. Setup steps, numbered, verified against actual scripts.
3. Common gotchas, each with symptom + fix.
4. Suggested first task with a one-line reason it's a good starting point.
5. Links to anything this README deliberately left out (deeper architecture docs, contribution guidelines) rather than covering them here.`,
    variables: [
      {
        name: 'repo_purpose',
        description: `What this project actually does, in plain terms, for someone with zero prior context.`,
        example: `An internal Next.js app that lets support reps look up a customer's subscription history and issue refunds without going through the billing team directly.`,
        required: true,
      },
      {
        name: 'setup_steps_known',
        description: `The setup steps as you currently do them yourself, even the ones that feel too obvious to mention.`,
        example: `Clone the repo, copy .env.example to .env and fill in the DATABASE_URL from the team vault, run \`pnpm install\`, then \`pnpm db:migrate\` before \`pnpm dev\` — migrate has to run first or the dev server crashes on boot.`,
        required: true,
      },
      {
        name: 'common_gotchas',
        description: `Specific things that have actually confused people setting this up before, with enough detail to be checkable.`,
        example: `If you skip pnpm db:migrate, the dev server throws 'relation \\"subscriptions\\" does not exist' on the first request, which looks like a connection problem but isn't.`,
        required: true,
      },
      {
        name: 'first_task_recommendation',
        description: `A real, existing task or area of the codebase that's a good place for a newcomer to start.`,
        example: `The \`formatRefundAmount()\` util in lib/currency.ts has a known rounding edge case on JPY amounts (no decimal places) tracked in issue #142 — small, contained, and touches a real part of the codebase.`,
        required: false,
      },
    ],
    targetTools: [`GitHub Copilot Chat`],
    tags: [`developer-readme`, `onboarding`, `documentation`, `copilot-chat`, `codebase-context`],
    whyItWorks: `A README written without deliberately fighting this tendency reads fine to the person who wrote it and fails silently for the person who didn't, because the author's own working setup already has every implicit step done, so an omitted step is invisible from where they're writing — Copilot Chat inherits this same blind spot unless explicitly told that the obvious-feeling steps are exactly the ones most likely to be missing, since its draft will otherwise mirror the confident, compressed tone of documentation written by someone who already has the context a first-timer lacks. Pairing every gotcha with its actual symptom rather than just its cause is what makes the difference between a README a stuck contributor can use and one they read after already giving up: a new contributor doesn't start from 'I forgot to run the migration,' they start from a cryptic Postgres error on screen, and a gotchas section organized around causes forces them to already know the cause before the entry becomes useful, which defeats its purpose. Using #codebase to read the actual scripts file rather than letting the model guess at conventional script names (\`npm run dev\`, \`npm start\`) matters because Copilot Chat's training data skews toward common conventions that this specific repo may not follow, and a README that states a script name that doesn't exist is worse than no README, since it actively costs a new contributor time chasing a command that fails immediately. The instruction to keep the scope narrow — setup and a first task, not a full architecture treatise — reflects that a first-day document competing with a comprehensive one for the same real estate tends to bury the five things that actually matter on day one under material that matters on week three, and a new contributor's actual first blocker is almost always 'why won't this run locally,' not 'what's our long-term data model philosophy.'`,
    exampleOutput: `## Setup
1. Clone the repo.
2. Copy \`.env.example\` to \`.env\` and fill in \`DATABASE_URL\` from the team vault.
3. Run \`pnpm install\`.
4. Run \`pnpm db:migrate\` — **do this before starting the dev server**, or step 5 will fail.
5. Run \`pnpm dev\`.

## Common gotchas
**Symptom:** dev server throws \`relation "subscriptions" does not exist\` on your first request.
**Cause:** step 4 was skipped.
**Fix:** stop the dev server, run \`pnpm db:migrate\`, restart.

## First task
Check out issue #142 — a rounding edge case on JPY refund amounts in \`lib/currency.ts\`. Small, self-contained, touches a real path through the app.`,
    verifiedAgainst: [
      { tool: 'GitHub Copilot Chat', version: '2026.08', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against GitHub Copilot Chat 2026.08.`,
      },
    ],
  },
]
