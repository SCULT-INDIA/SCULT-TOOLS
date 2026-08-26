import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'claude-md-vs-cursorrules-vs-copilot-instructions'
const SERVICE_CUSTOM_SOFTWARE = resolveServiceLink('custom-software', SLUG)

/**
 * Generated from content-engine/05-drafts/article_043.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'CLAUDE.md vs .cursorrules vs Copilot Instructions: What Each Actually Does',
  h1: 'CLAUDE.md vs .cursorrules vs Copilot Instructions: The Real Differences',
  targetKeyword: 'claude.md vs cursorrules vs copilot instructions',
  description:
    "How CLAUDE.md, Cursor's .cursorrules/.mdc rules, and GitHub Copilot's instructions files actually differ — scope, loading, and why your rules get ignored.",
  dek: "CLAUDE.md, Cursor's rules system, and GitHub Copilot's instructions files all do the same basic job — giving an AI coding assistant persistent, project-specific context — but they differ sharply in scope, file format, and how automatically they load. CLAUDE.md supports multi-scope hierarchy and `@path` imports; Cursor deprecated its single `.cursorrules` file in favor of glob-scoped `.mdc` files around version 0.43; Copilot uses a flat repo-wide file plus optional path-scoped instruction files with a fixed personal-over-repository-over-organization priority order. All three can coexist in the same repo without conflict, because each tool only looks for its own filename.",
  sections: [
    {
      heading: 'What each file actually is',
      body: [
        [
          'All three tools solve the same underlying problem: a coding assistant with no memory of your project needs some way to persistently know your conventions, architecture, and constraints without you re-explaining them every session. But the mechanisms diverge:',
        ],
        [
          '– ',
          { text: 'CLAUDE.md', bold: true },
          " is Claude Code's native memory file — markdown, loaded automatically at the start of every session, resolved across a directory hierarchy (enterprise/managed, user, project, and local scopes), with support for `@path` imports up to four hops deep (",
          {
            text: 'Claude Code docs',
            href: 'https://code.claude.com/docs/en/memory',
            external: true,
          },
          ').',
        ],
        [
          '– ',
          { text: "Cursor's rules", bold: true },
          ' started as a single flat `.cursorrules` file (now deprecated) and moved to `.cursor/rules/*.mdc` files with YAML frontmatter, glob-based path scoping, and multiple activation modes (',
          {
            text: 'morphllm.com',
            href: 'https://www.morphllm.com/cursor-rules-best-practices',
            external: true,
          },
          ').',
        ],
        [
          '– ',
          { text: "GitHub Copilot's instructions", bold: true },
          ' are a single flat repo-wide `copilot-instructions.md` file, plus optional path-scoped `*.instructions.md` files, following a personal-then-repository-then-organization priority order (',
          {
            text: 'GitHub Docs',
            href: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide',
            external: true,
          },
          ').',
        ],
        [
          "None of these are enforced configuration — they're context injected into the model's prompt. That distinction matters enough that it's worth stating up front: a rules file is a strong suggestion the model reads and (usually) follows, not a hard constraint the system enforces mechanically.",
        ],
      ],
    },
    {
      heading: 'CLAUDE.md in detail',
      body: [
        [
          "CLAUDE.md is the most structurally elaborate of the three. Per Anthropic's own documentation (",
          {
            text: 'Claude Code docs',
            href: 'https://code.claude.com/docs/en/memory',
            external: true,
          },
          '):',
        ],
        ["– It's read automatically at the start of every Claude Code session."],
        [
          '– It resolves across a ',
          { text: 'directory hierarchy', bold: true },
          ' — you can have a project-root CLAUDE.md and nested subdirectory CLAUDE.md files that apply more specifically to code in that subtree.',
        ],
        [
          '– It supports ',
          { text: 'multiple scopes', bold: true },
          ': managed/enterprise (organization-wide policy), user (your personal preferences across all projects), project (checked into the repo, shared with the team), and local (personal, uncommitted overrides).',
        ],
        [
          '– It supports ',
          { text: '`@path` imports', bold: true },
          ' up to four hops deep, so a CLAUDE.md can pull in content from other files — including, notably, an existing AGENTS.md via `@AGENTS.md` — rather than requiring duplication.',
        ],
        [
          '– Anthropic recommends keeping each file ',
          { text: 'under 200 lines', bold: true },
          ', because every line consumes context budget on every turn, and longer files measurably reduce instruction adherence.',
        ],
        [
          '– Running `/init` reads `.cursor/rules/`, `.cursorrules`, and `.github/copilot-instructions.md` if they exist, and incorporates relevant parts into the CLAUDE.md it generates — meaning Claude Code is explicitly designed to bootstrap from a repo that already has Cursor or Copilot rules in place.',
        ],
        [
          '– ',
          { text: 'Compaction behavior', bold: true },
          ': after `/compact`, the project-root CLAUDE.md is re-read from disk and re-injected automatically. Nested subdirectory CLAUDE.md files and path-scoped `.claude/rules/` files are ',
          { text: 'not', bold: true },
          ' automatically re-injected after compaction — they only reload when Claude actually reads a matching file again. This is a frequently missed detail that explains a specific class of "why did Claude forget my rule mid-session" reports.',
        ],
        [
          '– CLAUDE.md does ',
          { text: 'not', bold: true },
          " automatically read AGENTS.md. If you already maintain an AGENTS.md (see below), you either import it with `@AGENTS.md` or symlink CLAUDE.md to it — Claude Code won't discover it unprompted.",
        ],
      ],
    },
    {
      heading: "Cursor's rules system: .cursorrules vs .mdc",
      body: [
        [
          "Cursor's history here matters, because a lot of content online (and a lot of existing repos) still reference the old format.",
        ],
        [
          { text: '`.cursorrules` is deprecated.', bold: true },
          ' Cursor deprecated the single `.cursorrules` file around version 0.43 in late 2024, replacing it with Project Rules stored in `.cursor/rules/` (',
          {
            text: 'FlowQL',
            href: 'https://www.flowql.com/en/blog/guides/cursor-rules-deprecated-libraries/',
            external: true,
          },
          "). This is confirmed directly on Cursor's own community forum, where a user reported that Cursor's own \"Generate Cursor Rules\" feature was still producing a deprecated `.cursorrules` file — evidence that the deprecation, while real, wasn't cleanly finished across all of Cursor's own tooling at the time (",
          {
            text: 'Cursor forum',
            href: 'https://forum.cursor.com/t/generate-cursor-rules-created-a-deprecated-cursorrules-file/113200',
            external: true,
          },
          "). The legacy file is still read for backward compatibility, but it's not where new rules should be written.",
        ],
        [
          { text: 'What `.mdc` files add.', bold: true },
          ' The legacy `.cursorrules` file applied globally, with no scoping mechanism at all — every rule in it applied to every file in the project, all the time. The newer `.cursor/rules/*.mdc` format adds (',
          {
            text: 'morphllm.com',
            href: 'https://www.morphllm.com/cursor-rules-best-practices',
            external: true,
          },
          '):',
        ],
        ['– ', { text: 'YAML frontmatter', bold: true }, ' for structured metadata.'],
        [
          '– ',
          { text: 'Glob-based path scoping', bold: true },
          ' — a rule can be written to apply only to files matching a pattern (e.g., only `*.tsx` files, or only files under `app/api/`).',
        ],
        [
          '– ',
          { text: 'Multiple activation modes', bold: true },
          ' — rules can be always-on, triggered by file-type match, or manually invoked, rather than being a single undifferentiated block.',
        ],
        [
          {
            text: 'Agent mode vs. Edit mode matters for whether rules even load.',
            bold: true,
          },
          " One practitioner's troubleshooting account reports that Cursor's Agent mode reliably finds, loads, and follows rules, while the older Edit mode does not automatically pick up rules unless they're manually added to context (",
          {
            text: 'sdrmike',
            href: 'https://sdrmike.medium.com/cursor-rules-why-your-ai-agent-is-ignoring-you-and-how-to-fix-it-5b4d2ac0b1b0',
            external: true,
          },
          "). This is a plausible, practitioner-sourced account rather than an official Cursor statement — worth verifying against current Cursor behavior before treating it as a permanent architectural fact, since Cursor's mode behavior has changed across versions.",
        ],
      ],
    },
    {
      heading: "GitHub Copilot's instructions files",
      body: [
        [
          "Copilot's model is deliberately simpler and flatter than either of the above (",
          {
            text: 'GitHub Docs',
            href: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide',
            external: true,
          },
          '):',
        ],
        [
          '– The primary file is `.github/copilot-instructions.md` — a single, flat, repository-wide markdown file.',
        ],
        [
          '– Optional `*.instructions.md` files can be scoped to specific paths for more targeted guidance.',
        ],
        [
          "– There's a defined ",
          { text: 'priority order', bold: true },
          ' when instructions conflict: ',
          { text: 'personal', bold: true },
          ' instructions rank highest, then ',
          { text: 'repository', bold: true },
          ' instructions, then ',
          { text: 'organization', bold: true },
          ' instructions applied last.',
        ],
        [
          "Compared to CLAUDE.md's directory-hierarchy resolution and automatic re-injection behavior, Copilot's model has no equivalent of Claude Code's \"auto memory\" system or nested-directory CLAUDE.md resolution — it's closer in spirit to Cursor's old single-flat-file `.cursorrules` approach than to Cursor's newer glob-scoped `.mdc` system, though Copilot's optional path-scoped instruction files do add some of the same targeting capability.",
        ],
      ],
    },
    {
      heading: 'Why AGENTS.md exists and how it relates to all three',
      body: [
        [
          { text: 'AGENTS.md', bold: true },
          ' is an emerging cross-tool convention — not owned by Anthropic, Cursor, or GitHub specifically — that multiple agent tools are converging on as a shared, vendor-neutral instructions format. Per research on its 2026 adoption, AGENTS.md is backed by OpenAI, Google, Cursor, and others, and passed ',
          { text: '20,000 adopting repositories by August 2025', bold: true },
          ' (',
          {
            text: 'morphllm.com AGENTS.md guide',
            href: 'https://www.morphllm.com/agents-md-guide',
            external: true,
          },
          ').',
        ],
        [
          'Notably, as of the same 2026 research, ',
          {
            text: 'Claude Code remains the one holdout on native AGENTS.md reads',
            bold: true,
          },
          ' — a feature request to add dual-read support (so Claude Code would pick up an existing AGENTS.md automatically, the way it does its own CLAUDE.md) was reported as open and unshipped as of August 2026. In the meantime, the documented workaround is explicit: import it with `@AGENTS.md` inside your CLAUDE.md, or symlink CLAUDE.md to point at your existing AGENTS.md file (',
          {
            text: 'Claude Code docs',
            href: 'https://code.claude.com/docs/en/memory',
            external: true,
          },
          ').',
        ],
        [
          "All three tools' filenames are distinct enough (`CLAUDE.md`, `.cursor/rules/*.mdc` or legacy `.cursorrules`, `.github/copilot-instructions.md`) that they coexist in the same repository without any naming conflict — each tool simply ignores files it doesn't recognize (",
          {
            text: 'Codersera',
            href: 'https://codersera.com/blog/agents-md-vs-claude-md-vs-cursor-rules-comparison-2026/',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: 'Practical examples',
      body: [
        [
          {
            text: 'Illustrative example — a team using all three tools across different roles.',
            bold: true,
          },
          " (Hypothetical, clearly labeled as illustrative.) A team has three engineers: one primarily in Claude Code, one in Cursor, one using GitHub Copilot in VS Code. Instead of maintaining three divergent rule files, they write a single AGENTS.md with the shared conventions (code style, test requirements, architectural boundaries), then each tool's own file becomes a thin pointer: CLAUDE.md imports it via `@AGENTS.md` plus a short Claude-specific addendum; the Cursor engineer keeps a `.cursor/rules/shared.mdc` that references the same conventions with Cursor-specific glob scoping for frontend-only rules; the Copilot user's `copilot-instructions.md` restates the same core rules in Copilot's flatter format. The underlying source of truth is one file; each tool gets its own thin adapter.",
        ],
        [
          {
            text: 'Real, sourced example — `/init` bootstrapping from existing rules.',
            bold: true,
          },
          " When a repository that already has `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` runs Claude Code's `/init` command, it reads all of them and incorporates relevant parts into the CLAUDE.md it generates (",
          {
            text: 'Claude Code docs',
            href: 'https://code.claude.com/docs/en/memory',
            external: true,
          },
          ") — meaning teams migrating from Cursor or Copilot to Claude Code (or simply adding it alongside) don't start from a blank file.",
        ],
      ],
    },
    {
      heading: 'Data and evidence',
      body: [
        [
          '– AGENTS.md passed ',
          { text: '20,000 adopting repositories by August 2025', bold: true },
          ' (',
          {
            text: 'morphllm.com',
            href: 'https://www.morphllm.com/agents-md-guide',
            external: true,
          },
          ').',
        ],
        [
          "– Anthropic's own recommendation caps a single CLAUDE.md file at roughly ",
          { text: '200 lines', bold: true },
          ', citing context-budget cost and reduced instruction adherence past that point (',
          {
            text: 'Claude Code docs',
            href: 'https://code.claude.com/docs/en/memory',
            external: true,
          },
          ').',
        ],
        [
          '– `@path` imports in CLAUDE.md are supported to a maximum depth of ',
          { text: '4 hops', bold: true },
          ' (',
          {
            text: 'Claude Code docs',
            href: 'https://code.claude.com/docs/en/memory',
            external: true,
          },
          ').',
        ],
        [
          '– Cursor deprecated `.cursorrules` around ',
          { text: 'version 0.43', bold: true },
          ', in ',
          { text: 'late 2024', bold: true },
          ' (',
          {
            text: 'FlowQL',
            href: 'https://www.flowql.com/en/blog/guides/cursor-rules-deprecated-libraries/',
            external: true,
          },
          ") — this is a specific, dated migration point worth knowing if you're maintaining an older repo.",
        ],
        [
          "– On exact adherence-rate differences between short and long CLAUDE.md files, or measured task-success-rate differences between the three tools' instruction systems: ",
          { text: 'evidence not sufficiently verified', bold: true },
          ' — the sources reviewed describe mechanisms and vendor recommendations, not independently measured before/after adherence benchmarks.',
        ],
      ],
    },
    {
      heading: 'Comparisons',
      body: [
        [
          { text: 'CLAUDE.md vs. AGENTS.md.', bold: true },
          " CLAUDE.md is Claude Code's native, tool-specific file with its own scope hierarchy and import system; AGENTS.md is the cross-tool convention other agents are converging on. Claude Code can consume an existing AGENTS.md, but only via explicit import — it doesn't read it automatically the way it reads its own CLAUDE.md (",
          {
            text: 'Claude Code docs',
            href: 'https://code.claude.com/docs/en/memory',
            external: true,
          },
          ').',
        ],
        [
          { text: '`.cursorrules` vs. `.cursor/rules/*.mdc`.', bold: true },
          ' The legacy file is flat and global with no scoping; `.mdc` files add YAML frontmatter, glob-based path scoping, and multiple activation modes (',
          {
            text: 'morphllm.com',
            href: 'https://www.morphllm.com/cursor-rules-best-practices',
            external: true,
          },
          "). If you're still on `.cursorrules`, migrating to `.mdc` is the current recommended path, not a lateral option.",
        ],
        [
          { text: 'Copilot instructions vs. Claude Code rules.', bold: true },
          " Copilot's file structure is a single flat repo-wide file plus optional path-scoped add-ons, with a fixed personal-over-repo-over-org priority order; Claude Code's is a fuller multi-scope model (enterprise/user/project/local) with directory-hierarchy resolution and an \"auto memory\" capability Copilot doesn't have (",
          {
            text: 'GitHub Docs',
            href: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide',
            external: true,
          },
          '; ',
          {
            text: 'Claude Code docs',
            href: 'https://code.claude.com/docs/en/memory',
            external: true,
          },
          ').',
        ],
        [
          { text: 'Cursor Agent mode vs. Edit mode rule adherence.', bold: true },
          ' Reported (practitioner-sourced, not officially documented) as a real behavioral gap — Agent mode reliably loads and follows rules, Edit mode does not without manual context addition (',
          {
            text: 'sdrmike',
            href: 'https://sdrmike.medium.com/cursor-rules-why-your-ai-agent-is-ignoring-you-and-how-to-fix-it-5b4d2ac0b1b0',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: 'Real-world use cases',
      body: [
        [
          '– ',
          { text: 'A solo developer using only Claude Code', bold: true },
          ' — a single project-root CLAUDE.md under 200 lines, focused on what the project is, why key components exist, and how to build/test/verify it, is the documented sweet spot.',
        ],
        [
          '– ',
          { text: 'A team split across Cursor and Copilot', bold: true },
          ' — glob-scoped `.mdc` rules for frontend-specific conventions in Cursor, paired with a flatter `copilot-instructions.md` restating the same core rules for Copilot users, since Copilot has no equivalent glob-scoping primitive at the top level.',
        ],
        [
          '– ',
          {
            text: 'A large monorepo with different conventions per subdirectory',
            bold: true,
          },
          " — CLAUDE.md's directory-hierarchy resolution is specifically suited to this, letting a `services/payments/CLAUDE.md` carry payment-specific rules that only load when Claude is actually working in that subtree.",
        ],
        [
          '– ',
          { text: 'A team migrating from Cursor/Copilot to Claude Code', bold: true },
          ' — running `/init` in a repo with existing `.cursor/rules/` or `copilot-instructions.md` bootstraps a starting CLAUDE.md automatically rather than starting from scratch.',
        ],
      ],
    },
    {
      heading: 'Common mistakes',
      body: [
        [
          '– ',
          { text: 'Assuming a rules file is enforced configuration.', bold: true },
          " All three systems inject context into the model's prompt; none of them mechanically prevent an action the way a hook, CI check, or permission system does. Claude Code's own documentation specifically recommends hooks — not CLAUDE.md — for anything that must run every time without exception.",
        ],
        [
          '– ',
          { text: 'Writing an oversized CLAUDE.md.', bold: true },
          ' Past roughly 200 lines, Anthropic\'s own guidance is that adherence degrades because of context-budget cost, not that "more instructions" reliably means "more compliance."',
        ],
        [
          '– ',
          { text: 'Assuming Claude Code reads AGENTS.md automatically.', bold: true },
          " It doesn't — without an explicit `@AGENTS.md` import or a symlink, an existing AGENTS.md is invisible to Claude Code.",
        ],
        [
          '– ',
          { text: 'Leaving stale `.cursorrules` content unmigrated.', bold: true },
          ' Since the legacy format still works for backward compatibility, teams can end up running years-old flat, unscoped rules alongside newer `.mdc` files without realizing the old file is still being read.',
        ],
        [
          '– ',
          {
            text: "Forgetting that nested CLAUDE.md files don't auto-reinject after `/compact`.",
            bold: true,
          },
          ' Only the project-root file is guaranteed to reload automatically; subdirectory-specific rules can silently drop out of context after a long session compacts.',
        ],
        [
          '– ',
          {
            text: 'Editing Edit-mode Cursor sessions and expecting rules to apply automatically.',
            bold: true,
          },
          ' Per the practitioner account above, Edit mode has been reported not to pick up rules the way Agent mode does — worth confirming against current Cursor behavior rather than assuming parity across modes.',
        ],
      ],
    },
    {
      heading: 'Best practices',
      body: [
        [
          '– Keep CLAUDE.md under roughly 200 lines; push detailed guidance into referenced files and import them rather than inlining everything.',
        ],
        [
          '– Answer three questions in your CLAUDE.md at minimum: what the project is, why its major components exist, and how to build/test/verify it.',
        ],
        [
          '– Pair every rule that must hold without exception with an actual enforcement mechanism — a hook, a CI check, a linter rule — rather than relying on the instructions file alone.',
        ],
        [
          '– If you already maintain an AGENTS.md, import it into CLAUDE.md with `@AGENTS.md` rather than duplicating content across files.',
        ],
        [
          '– Migrate any remaining `.cursorrules` content into scoped `.mdc` files rather than leaving both in place indefinitely.',
        ],
        [
          '– Use path-scoped rules (`.claude/rules/` with glob frontmatter, or `.cursor/rules/*.mdc`) for conventions that only apply to specific parts of a monorepo, instead of one giant global file.',
        ],
        [
          "– When multiple tools are in use on the same repo, maintain one shared source of truth (an AGENTS.md is a reasonable choice) and keep each tool's native file as a thin import/reference rather than a fully independent document that can drift out of sync.",
        ],
      ],
    },
    {
      heading: 'Key takeaways',
      body: [
        [
          "– CLAUDE.md, Cursor's rules, and Copilot's instructions files all inject context, none of them enforce behavior mechanically — back anything that must always happen with a hook or CI check, not just an instruction.",
        ],
        [
          '– `.cursorrules` is deprecated in favor of glob-scoped `.mdc` files in `.cursor/rules/`, though the legacy file still works for backward compatibility.',
        ],
        [
          '– Claude Code does not automatically read AGENTS.md or nested CLAUDE.md files after compaction — both require an explicit action (an import, or being read again) to enter context.',
        ],
        [
          "– Copilot's model is flatter than Claude Code's: one repo-wide file plus optional path-scoped add-ons, with personal-over-repository-over-organization priority.",
        ],
        [
          '– All three file types can coexist in the same repository without conflict, and AGENTS.md is emerging as a shared, cross-tool convention teams can standardize on underneath tool-specific files.',
        ],
        [
          "– Keep CLAUDE.md under roughly 200 lines — Anthropic's own guidance ties longer files to reduced instruction adherence.",
        ],
      ],
    },
    {
      heading: 'Relevant tools.scult.in resources',
      body: [
        [
          'If your team is standardizing prompts and workflows across Claude, Cursor, and other assistants, the ',
          { text: 'Claude-focused prompt library', href: '/prompts/claude' },
          ' and ',
          { text: 'Cursor-focused prompt library', href: '/prompts/cursor' },
          ' both have ready-to-adapt starting points for writing project instructions and task prompts consistently across tools.',
        ],
        [
          "If you're setting up a shared AI-agent workflow across a development team — standardizing CLAUDE.md, AGENTS.md, and tool-specific rules so they don't drift out of sync as your codebase grows — that kind of engineering-process setup is exactly what ",
          {
            text: "SCULT's custom software team",
            href: SERVICE_CUSTOM_SOFTWARE.href,
            external: true,
          },
          " helps client engineering teams get right the first time, rather than retrofitting it after three tools' rule files have already diverged.",
        ],
      ],
    },
  ],
  faq: [
    {
      question: 'What is CLAUDE.md?',
      answer: [
        'A markdown file that gives Claude Code persistent, project-specific instructions, read automatically at the start of every session (',
        {
          text: 'Claude Code docs',
          href: 'https://code.claude.com/docs/en/memory',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'What is .cursorrules?',
      answer: [
        "Cursor's original, now-deprecated single flat rules file, superseded by `.cursor/rules/*.mdc` files (",
        {
          text: 'FlowQL',
          href: 'https://www.flowql.com/en/blog/guides/cursor-rules-deprecated-libraries/',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'What is copilot-instructions.md?',
      answer: [
        "GitHub Copilot's repository-wide custom instructions file, located at `.github/copilot-instructions.md` (",
        {
          text: 'GitHub Docs',
          href: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Do I need all three files if my team uses all three tools?',
      answer: [
        "Not necessarily duplicated content — you can maintain one shared source (like AGENTS.md) and have each tool's file import or restate it.",
      ],
    },
    {
      question: 'Is .cursorrules deprecated?',
      answer: [
        "Yes, since around Cursor version 0.43 in late 2024, in favor of `.cursor/rules/` — though it's still read for backward compatibility (",
        {
          text: 'FlowQL',
          href: 'https://www.flowql.com/en/blog/guides/cursor-rules-deprecated-libraries/',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Does Copilot read copilot-instructions.md automatically?',
      answer: [
        'Yes, as the primary repository-wide instructions file, following the personal-then-repository-then-organization priority order (',
        {
          text: 'GitHub Docs',
          href: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Can I use one file for all AI coding assistants?',
      answer: [
        "Effectively, yes, using AGENTS.md as the shared source and thin tool-specific files that import or restate it — though Claude Code needs an explicit import since it doesn't auto-read AGENTS.md.",
      ],
    },
    {
      question: 'Why does Claude ignore my CLAUDE.md sometimes?',
      answer: [
        "Because it's context, not enforced configuration — vague instructions, an oversized file diluting context, or a file that never actually loaded (wrong location) can all cause inconsistent adherence (",
        {
          text: 'Claude Code docs',
          href: 'https://code.claude.com/docs/en/memory',
          external: true,
        },
        ').',
      ],
    },
    {
      question: "What's the simplest possible CLAUDE.md?",
      answer: [
        'A short file answering what the project is, why key components exist, and how to build/test/verify it — under 200 lines.',
      ],
    },
    {
      question: 'Where do I put CLAUDE.md in my project?',
      answer: [
        'At the project root for team-shared, repo-wide instructions; nested subdirectories can have their own for more specific rules.',
      ],
    },
    {
      question: "How does CLAUDE.md's scope hierarchy work?",
      answer: [
        'It resolves across enterprise/managed, user, project, and local scopes, plus directory-hierarchy resolution for nested subdirectory files (',
        {
          text: 'Claude Code docs',
          href: 'https://code.claude.com/docs/en/memory',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'What are @path imports in CLAUDE.md?',
      answer: [
        'A mechanism to pull in content from other files (including an existing AGENTS.md) up to 4 hops deep, avoiding duplication (',
        {
          text: 'Claude Code docs',
          href: 'https://code.claude.com/docs/en/memory',
          external: true,
        },
        ').',
      ],
    },
    {
      question: "What's the difference between .cursorrules and .mdc files?",
      answer: [
        '`.cursorrules` is flat and global with no scoping; `.mdc` files support YAML frontmatter, glob-based path scoping, and multiple activation modes (',
        {
          text: 'morphllm.com',
          href: 'https://www.morphllm.com/cursor-rules-best-practices',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'What priority order does Copilot use for conflicting instructions?',
      answer: [
        'Personal instructions first, then repository, then organization (',
        {
          text: 'GitHub Docs',
          href: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Does Claude Code read AGENTS.md automatically?',
      answer: [
        'No — it requires an explicit `@AGENTS.md` import in CLAUDE.md, or a symlink (',
        {
          text: 'Claude Code docs',
          href: 'https://code.claude.com/docs/en/memory',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'Can CLAUDE.md, .cursorrules, and copilot-instructions.md coexist without conflict?',
      answer: [
        'Yes, since each tool only looks for its own filename/location (',
        {
          text: 'Codersera',
          href: 'https://codersera.com/blog/agents-md-vs-claude-md-vs-cursor-rules-comparison-2026/',
          external: true,
        },
        ').',
      ],
    },
    {
      question: "Does Claude Code's /init pull in existing Cursor or Copilot rules?",
      answer: [
        'Yes — it reads `.cursor/rules/`, `.cursorrules`, and `.github/copilot-instructions.md` and incorporates relevant parts (',
        {
          text: 'Claude Code docs',
          href: 'https://code.claude.com/docs/en/memory',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'What happens to CLAUDE.md after a long session gets compacted?',
      answer: [
        'The project-root file is re-read and re-injected automatically; nested subdirectory files and path-scoped rules are not, until read again (',
        {
          text: 'Claude Code docs',
          href: 'https://code.claude.com/docs/en/memory',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'What is AGENTS.md and why does it exist?',
      answer: [
        'A cross-tool, vendor-neutral convention for agent instructions, adopted by OpenAI, Google, Cursor and others, aimed at avoiding one divergent rules file per tool (',
        {
          text: 'morphllm.com',
          href: 'https://www.morphllm.com/agents-md-guide',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Is there a maximum recommended size for any of these files?',
      answer: [
        "Anthropic explicitly recommends ~200 lines for CLAUDE.md; no equivalent explicit ceiling was found in this research for `.mdc` files or Copilot's instructions files — treat file-size discipline as a general best practice across all three even without a stated number for the latter two.",
      ],
    },
    {
      question: 'How do I write a CLAUDE.md file?',
      answer: [
        'Cover what the project is, why key components exist, and how to build/test/verify it; keep it under ~200 lines and push detail into imported files.',
      ],
    },
    {
      question: 'How do I migrate from .cursorrules to .cursor/rules?',
      answer: [
        'Move content into one or more `.mdc` files with YAML frontmatter and glob-based path scoping, replacing the flat global rules with targeted ones.',
      ],
    },
    {
      question: 'How do I set up copilot-instructions.md?',
      answer: [
        'Create `.github/copilot-instructions.md` at the repository root; add path-scoped `*.instructions.md` files for narrower guidance if needed (',
        {
          text: 'GitHub Docs',
          href: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How do I scope rules to specific file paths in Claude Code?',
      answer: [
        'Use `.claude/rules/` with YAML `paths` glob frontmatter so a rule only loads for matching files (',
        {
          text: 'Claude Code docs',
          href: 'https://code.claude.com/docs/en/memory',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How do I scope rules to specific file paths in Cursor?',
      answer: [
        "Use `.mdc` files' glob-based path-scoping frontmatter (",
        {
          text: 'morphllm.com',
          href: 'https://www.morphllm.com/cursor-rules-best-practices',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How do I import an existing AGENTS.md into Claude Code?',
      answer: [
        'Add `@AGENTS.md` inside your CLAUDE.md, or symlink CLAUDE.md to the AGENTS.md file directly (',
        {
          text: 'Claude Code docs',
          href: 'https://code.claude.com/docs/en/memory',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How do I bootstrap a CLAUDE.md from existing Cursor/Copilot rules?',
      answer: [
        "Run Claude Code's `/init` command in the repo — it reads the existing rule files and incorporates relevant parts.",
      ],
    },
    {
      question: 'How do I make sure a rule holds every single time, not just usually?',
      answer: [
        'Back it with an actual enforcement mechanism — a hook, a CI check, a linter — rather than relying solely on the instructions file.',
      ],
    },
    {
      question: 'How do I check whether my nested CLAUDE.md is actually loading?',
      answer: [
        "Since it only reloads when read directly (not automatically after compaction), explicitly reference or open a file in that subtree during a session to confirm it's picked up.",
      ],
    },
    {
      question: "How do I keep three separate tools' rule files in sync?",
      answer: [
        "Maintain one shared source of truth (AGENTS.md is a reasonable default) and make each tool's native file a thin import or restatement rather than an independently maintained document.",
      ],
    },
    {
      question:
        'How does directory-hierarchy resolution actually behave in CLAUDE.md with nested files?',
      answer: [
        'More specific, deeper subdirectory CLAUDE.md files apply alongside the project-root file when Claude is working in that subtree, layering additional context rather than replacing the root file.',
      ],
    },
    {
      question: "What's the practical effect of the 4-hop import limit in CLAUDE.md?",
      answer: [
        'It bounds how deep a chain of `@path` imports can nest before Claude Code stops following them, preventing unbounded recursive imports.',
      ],
    },
    {
      question:
        'Why does Anthropic recommend hooks over CLAUDE.md for must-always-happen behavior?',
      answer: [
        'Because CLAUDE.md is context the model reasons over, not a mechanically enforced constraint — a hook executes deterministically regardless of what the model decides to do.',
      ],
    },
    {
      question:
        "Is there a meaningful difference between Cursor's rule activation modes?",
      answer: [
        'Yes — always-on, file-type-triggered, and manually-invoked modes change when a given `.mdc` rule actually enters context, which affects both relevance and context-budget cost.',
      ],
    },
    {
      question:
        "How does Copilot's organization-level instruction priority interact with a personal override?",
      answer: [
        "Personal instructions rank highest, meaning an individual developer's own preferences can override organization-wide policy in Copilot's model — a materially different governance posture than Claude Code's managed/enterprise scope, which is designed to sit above user preference.",
      ],
    },
    {
      question: 'CLAUDE.md vs. AGENTS.md — which should I actually maintain?',
      answer: [
        'If your team uses multiple AI tools, AGENTS.md as the shared source with CLAUDE.md importing it is more maintainable than parallel, potentially drifting files.',
      ],
    },
    {
      question: "Cursor's Agent mode vs. Edit mode — does it change whether rules apply?",
      answer: [
        'Reported yes (Agent mode loads rules reliably, Edit mode may not without manual context addition) — practitioner-sourced, worth reconfirming against current Cursor versions.',
      ],
    },
    {
      question: 'Copilot instructions vs. Claude Code rules — which is more granular?',
      answer: [
        "Claude Code's directory-hierarchy and path-scoped rules system is more granular; Copilot's is flatter, with path-scoping only via optional additional instruction files.",
      ],
    },
    {
      question:
        "Cursor's .mdc format vs. Claude Code's .claude/rules — how similar are they?",
      answer: [
        "Structurally similar in intent (both support glob-based path scoping via frontmatter), though they're independent, tool-specific implementations, not a shared standard.",
      ],
    },
    {
      question:
        'Is AGENTS.md going to replace CLAUDE.md, .cursorrules, and copilot-instructions.md?',
      answer: [
        "No evidence of that in this research — AGENTS.md is being adopted as an additional shared layer that tools import from or coexist with, not a replacement for each tool's native file format.",
      ],
    },
    {
      question:
        'Why does Claude Code seem to forget my subdirectory-specific rule mid-session?',
      answer: [
        "Because nested CLAUDE.md files aren't automatically re-injected after `/compact` — only the project-root file is; the nested file needs to be read again to re-enter context.",
      ],
    },
    {
      question:
        'Why does Cursor seem to ignore my rules in some sessions but not others?',
      answer: [
        "Possibly a mode difference (Agent mode vs. Edit mode) per the practitioner account cited above, or a scoping mismatch where the `.mdc` glob pattern doesn't actually match the file being edited.",
      ],
    },
    {
      question: "Why doesn't Copilot seem to follow my repository instructions?",
      answer: [
        "Check whether a personal instruction is overriding it, given Copilot's personal-over-repository-over-organization priority order.",
      ],
    },
    {
      question: 'My CLAUDE.md is huge and Claude seems to follow it less reliably — why?',
      answer: [
        "Consistent with Anthropic's own guidance that files past roughly 200 lines consume more context and show reduced adherence — trim and push detail into imported files.",
      ],
    },
    {
      question: "I have an AGENTS.md but Claude Code doesn't seem to use it — why?",
      answer: [
        "Because Claude Code doesn't read AGENTS.md automatically; it needs an explicit `@AGENTS.md` import or a symlink from CLAUDE.md.",
      ],
    },
    {
      question:
        'Should my team standardize on one AI coding assistant to simplify rules management?',
      answer: [
        'Not necessarily — maintaining a single shared AGENTS.md as the source of truth solves most of the duplication problem even with multiple tools in use.',
      ],
    },
    {
      question: 'Is it worth migrating a legacy .cursorrules file now?',
      answer: [
        "Yes — since it's deprecated (though still functional for backward compatibility), migrating to scoped `.mdc` files gets you path-scoping and activation-mode control the old format never had.",
      ],
    },
    {
      question:
        "Should we invest time writing a detailed AGENTS.md if we're primarily a Claude Code shop?",
      answer: [
        "Worthwhile mainly if other tools or contributors also touch the repo; if you're exclusively Claude Code, a well-structured CLAUDE.md with imported detail files covers the same need without the extra format.",
      ],
    },
    {
      question: 'Is CLAUDE.md worth maintaining for a solo developer, or is it overkill?',
      answer: [
        "Even solo, a concise CLAUDE.md pays off across sessions by avoiding repeated re-explanation of project structure and conventions — it's not just a team-coordination tool.",
      ],
    },
    {
      question:
        'Should we enforce rules-file hygiene (size limits, enforcement backing) as a team policy?',
      answer: [
        "Given Anthropic's explicit guidance on file-size-driven adherence loss and the general principle that unenforced rules degrade, yes — treating rules-file maintenance as an ongoing responsibility rather than a one-time setup avoids the most common failure mode described throughout this article.",
      ],
    },
  ],
  sources: [
    'https://code.claude.com/docs/en/memory',
    'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide',
    'https://www.flowql.com/en/blog/guides/cursor-rules-deprecated-libraries/',
    'https://forum.cursor.com/t/generate-cursor-rules-created-a-deprecated-cursorrules-file/113200',
    'https://www.morphllm.com/cursor-rules-best-practices',
    'https://codersera.com/blog/agents-md-vs-claude-md-vs-cursor-rules-comparison-2026/',
    'https://sdrmike.medium.com/cursor-rules-why-your-ai-agent-is-ignoring-you-and-how-to-fix-it-5b4d2ac0b1b0',
    'https://www.morphllm.com/agents-md-guide',
  ],
  relatedTools: [],
  relatedPrompts: [],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-21',
  readingMinutes: 17,
}
