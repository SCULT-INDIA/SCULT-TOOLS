import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = "ai-coding-tools-monorepo-issues"
const SERVICE_CUSTOM_SOFTWARE = resolveServiceLink("custom-software", SLUG)

/**
 * Generated from content-engine/05-drafts/article_071.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "AI Coding Tools in a Monorepo: What Actually Breaks (And How to Fix It)",
  h1: "What actually breaks when AI coding tools touch a monorepo",
  targetKeyword: "ai coding tools monorepo issues",
  description: "Cursor, Claude Code, and other AI coding agents hit real limits in monorepos — context windows, interface hallucination, wrong-folder bugs. Here's what breaks and why.",
  dek: "AI coding agents like Cursor and Claude Code work well on small, single-purpose repos, but a large monorepo breaks them in specific, repeatable ways: the codebase is bigger than any context window, the agent hallucinates interfaces that were renamed elsewhere, it creates files in the wrong package, and it applies inconsistent conventions across the repo. None of this means the tools are broken — it means monorepos need a navigation strategy (scoping, rules files, indexing) instead of just a bigger prompt.",
  sections: [
    {
      heading: "Why monorepos are a different problem than \"a big codebase\"",
      body: [
        ["A monorepo isn't just a large folder of code — it's usually dozens of services, shared libraries, generated types, infrastructure-as-code, and test suites living under one root, often managed by tools like Turborepo, Nx, or a pnpm/Yarn workspace. Engineering teams increasingly choose this structure specifically because it keeps related services visible to each other in one place, which matters more than ever now that AI agents are part of the workflow (", { text: "Spectro Cloud", href: "https://www.spectrocloud.com/blog/will-ai-turn-2026-into-the-year-of-the-monorepo", external: true }, ", ", { text: "Adrian Petcu", href: "https://adrianpetcu.substack.com/p/monorepos-are-back-and-ai-is-the", external: true }, ")."],
        ["The catch is scale. A 50-service repo with shared libraries, IaC, generated types, and test suites can span tens of millions of tokens of source code — multiple orders of magnitude beyond what even the largest current context windows can hold at once (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, "; ", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, "). An AI agent pointed at the repo root isn't reading \"the codebase\" the way a human mentally models it — it's working from whatever slice its indexer or retrieval layer decided was relevant, and that slice is frequently wrong in a monorepo because relevance in a monorepo is a graph problem, not a proximity problem. The function you're editing might depend on a type defined four packages away, imported through three layers of re-exports, and touched by a build script the agent never indexed."],
        ["Sourcegraph frames the resulting failure pattern as \"the 80% problem\": agents do well on single-file, single-service tasks, and fall apart specifically on cross-cutting changes — anything that touches more than one service, repository, or layer at once (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, "). That's not a rare edge case in a monorepo; cross-cutting changes are a large share of what monorepos exist to make easier for humans, which means they're also where AI agents currently struggle most."],
      ],
    },
    {
      heading: "The five concrete failure modes",
      body: [
        ["Based on documented reports from Cursor's own community forum, technical write-ups, and enterprise tooling vendors, five distinct failure modes recur:"],
        [{ text: "1. Context-window overflow, not context-window shortage.", bold: true }, " The industry narrative is \"bigger windows will fix this,\" but the real constraint is that even a genuinely huge window (hundreds of thousands to a million-plus tokens) is still dwarfed by a 50-service repo spanning tens of millions of tokens (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, "). No plausible near-term context window closes that gap by brute force."],
        [{ text: "2. Interface hallucination.", bold: true }, " An agent generates syntactically correct code that calls a method signature that was renamed in a shared library months earlier — not because the model is malfunctioning, but because it's pattern-matching against stale training data or a stale index rather than the current interface truth (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, "). This is functionally the same failure whether the agent never indexed the shared library, or indexed an outdated version of it."],
        [{ text: "3. Wrong-folder file creation.", bold: true }, " Developers on Cursor's own forum report the agent bypassing an intended `apps/` folder structure and creating new files at the workspace root instead of the correct subdirectory — even after configuring `.cursorignore` and `.mdc` rule files (", { text: "Cursor forum", href: "https://forum.cursor.com/t/cursor-issues-with-monorepo-and-code-workspace/78543", external: true }, "). This is a workspace-structure-recognition failure, distinct from a reasoning failure."],
        [{ text: "4. Bizarre indexing breakage from trivial causes.", bold: true }, " In the same forum thread, one developer traced a folder's complete absence from Cursor's index to an emoji in the folder name inside a VS Code–style code-workspace file; removing the emoji fixed indexing entirely (", { text: "Cursor forum", href: "https://forum.cursor.com/t/cursor-issues-with-monorepo-and-code-workspace/78543", external: true }, "). It's a reminder that monorepo AI failures are sometimes mundane tooling bugs, not deep architectural limits."],
        [{ text: "5. Convention drift.", bold: true }, " One developer documented Claude generating a React component using default exports and different state-naming patterns than the monorepo's established convention (named exports, custom hooks) — and then applying its own invented convention inconsistently across different parts of the same repo, rather than converging on one pattern (", { text: "SelfScrum", href: "https://selfscrum.medium.com/ai-driven-development-beyond-the-monorepo-2ce9ad74ac89", external: true }, "). This is the failure that erodes codebase consistency slowly, commit by commit, rather than breaking a build outright."],
        ["A sixth pattern worth naming separately: the \"memory bottleneck.\" Supermemory's analysis of large-repo coding agents describes this as agents losing track of earlier decisions and architectural context across a long session even when each individual file fits comfortably in context — the problem isn't fitting one file, it's retaining the *relationships* between files across a multi-hour task (", { text: "Supermemory", href: "https://supermemory.ai/blog/memory-bottleneck-large-repo-coding-agents/", external: true }, ")."],
      ],
    },
    {
      heading: "Why bigger context windows don't fix this",
      body: [
        ["It's tempting to treat this as purely a token-limit problem that model providers will solve. The evidence says otherwise. Tianpan.co's analysis argues explicitly that teams getting reliable cross-service agent results aren't waiting on bigger context windows — they're building navigation infrastructure: dependency-graph indexing, retrieval systems that understand package boundaries, and scoped sessions (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, ")."],
        ["Sourcegraph makes a sharper version of the same point: naive chunk retrieval returns files that *mention* the affected function, but misses the behavioral contract between services, because the relationship between components is the context — and embeddings alone don't capture that relationship (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, "). A bigger context window lets you stuff in more files; it doesn't tell the agent which files actually matter to the change, or how they depend on each other. That's a retrieval and indexing problem, not a token-count problem, and it's why enterprise tooling in this space (Sourcegraph Cody's pre-indexed vector embeddings, Augment Code's selective retrieval across 400,000–500,000 files) is investing in graph-aware retrieval rather than simply riding the context-window trend (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, "; ", { text: "Augment Code", href: "https://www.augmentcode.com/tools/best-enterprise-ai-code-generators", external: true }, ")."],
        ["There's also a cost dimension: quadratic attention-cost scaling means that even when a model *can* technically accept a much larger prompt, doing so for every request in a large monorepo is not economically practical at scale — another reason \"just paste more context\" isn't the production answer teams have converged on."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Illustrative scenario — shared-library breakage:", bold: true }, " A team has a `packages/ui` component library consumed by twelve separate apps in a Turborepo. An engineer asks an AI agent, scoped only to `apps/checkout`, to \"update the button component to add a loading state.\" Without visibility into `packages/ui`'s actual current API, the agent instead recreates a local `LoadingButton` inside `apps/checkout` that duplicates (and subtly diverges from) the shared component — solving the immediate task while quietly reintroducing the exact inconsistency the monorepo was built to prevent. This is a hypothetical composite, but it mirrors the documented convention-drift pattern from SelfScrum's real account almost exactly (", { text: "SelfScrum", href: "https://selfscrum.medium.com/ai-driven-development-beyond-the-monorepo-2ce9ad74ac89", external: true }, ")."],
        [{ text: "Real, documented example — the workspace-root bug:", bold: true }, " A Cursor user working in a code-workspace-based monorepo reported the agent repeatedly writing new files to the workspace root instead of the `apps/` subdirectory the project actually used, despite trying `.cursorignore` exclusions and `.mdc` rule files to correct it (", { text: "Cursor forum", href: "https://forum.cursor.com/t/cursor-issues-with-monorepo-and-code-workspace/78543", external: true }, "). This is not hypothetical — it's a real, still-referenced community bug report."],
        [{ text: "Real, documented example — the emoji bug:", bold: true }, " In the same thread, another contributor found that a folder named with an emoji in its title was silently excluded from Cursor's index entirely; renaming the folder without the emoji restored indexing (", { text: "Cursor forum", href: "https://forum.cursor.com/t/cursor-issues-with-monorepo-and-code-workspace/78543", external: true }, "). It's a useful reminder to check for mundane causes before assuming a deep architectural failure."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– ", { text: "Practical file-count ceiling:", bold: true }, " one technical analysis cites roughly 2,500 files as the practical ceiling before naive context-stuffing causes visible degradation in an agent's indexing quality (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, "). Most real monorepos exceed this by one or two orders of magnitude."],
        ["– ", { text: "Scale mismatch:", bold: true }, " enterprise applications commonly span 50–500 repositories and millions of lines of code, while a 50-service monorepo with shared libraries, IaC, generated types, and tests can reach tens of millions of tokens of source (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, ")."],
        ["– ", { text: "Indexing time:", bold: true }, " a 100,000-file monorepo can take Cursor's local indexer a few minutes on first pass, then update incrementally afterward — meaning the \"slow first index\" experience is expected behavior, not a bug, per current guidance (", { text: "Cursor best-practices coverage, 2026", href: "https://eastondev.com/blog/en/posts/dev/20260115-cursor-codebase-index-optimization/", external: true }, ")."],
        ["– ", { text: "Rules-file length:", bold: true }, " current 2026 guidance on Cursor's `.cursor/rules/*.mdc` format recommends keeping individual rule files to roughly 1,000–2,500 words, noting that rules beyond about 5,000 words start diluting the most important instructions rather than reinforcing them."],
        ["– ", { text: "The architectural shift:", bold: true }, " the field has moved from a single `.cursorrules` file (now effectively legacy and ignored in Agent mode) to a `.cursor/rules/` directory of scoped `.mdc` files, each attachable always, by glob pattern, by agent judgment, or by manual `@mention` — a direct response to monorepos needing package-scoped rather than repo-wide instructions."],
        ["– Evidence not sufficiently verified: there is no single controlled benchmark comparing Cursor's and Claude Code's raw success rate on monorepo-scale tasks head-to-head; claims about one tool being categorically \"better\" at monorepo scale rest on scattered practitioner reports rather than a reproducible study."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        [{ text: "Monorepo vs. polyrepo, from an AI agent's perspective.", bold: true }, " These aren't symmetric failure modes. In a polyrepo, an agent working in one repository is blind to everything outside it — it can't see a service it's supposed to integrate with, so it guesses at contracts and invents interfaces that don't match reality, breaking integration in a different way than the monorepo's context-overload problem (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, "). A monorepo gives the agent *access* to everything it needs but not the *means* to find it efficiently; a polyrepo denies access outright. Neither is a free lunch for AI-assisted development — which is part of why monorepo adoption is reportedly being reconsidered specifically because of AI tooling, not despite it (", { text: "Adrian Petcu", href: "https://adrianpetcu.substack.com/p/monorepos-are-back-and-ai-is-the", external: true }, ")."],
        [{ text: "Cursor vs. Claude Code, on rules and scoping.", bold: true }, " Both tools support a project-level instructions file (Cursor's `.cursor/rules/*.mdc`, Claude Code's `CLAUDE.md`) that describes repository structure, conventions, and package boundaries to the agent. Community accounts converge on the same conclusion for both: describing the repo's real structure in these files measurably helps the agent respect package boundaries and avoid breaking shared code, though neither is foolproof against the failure modes above (", { text: "SelfScrum", href: "https://selfscrum.medium.com/ai-driven-development-beyond-the-monorepo-2ce9ad74ac89", external: true }, "; ", { text: "Cursor forum", href: "https://forum.cursor.com/t/cursor-issues-with-monorepo-and-code-workspace/78543", external: true }, ")."],
        [{ text: "Naive retrieval vs. graph-aware retrieval.", bold: true }, " Chunk-based embedding retrieval (find files whose text is similar to the query) is cheap but structurally blind to the dependency relationships that actually define correctness in a monorepo. Vendors building specifically for enterprise-scale repos — Sourcegraph Cody's pre-indexed embeddings, Augment Code's selective retrieval across hundreds of thousands of files — are explicit that this is the gap they're trying to close, which is itself evidence that mainstream agent tooling doesn't solve it out of the box (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, "; ", { text: "Augment Code", href: "https://www.augmentcode.com/tools/best-enterprise-ai-code-generators", external: true }, ")."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["– ", { text: "Frontend monorepos with micro-frontends.", bold: true }, " A 2026 write-up on frontend architecture for AI coding agents specifically addresses how teams structure monorepos, micro-frontends, and per-package rule files together so an agent editing one micro-frontend doesn't accidentally reach into another team's package (", { text: "Kayra Berk Tuncer, Medium", href: "https://kayraberktuncer.medium.com/frontend-architecture-for-ai-coding-agents-monorepos-micro-frontends-and-rule-management-1f64b1fb9d88", external: true }, ")."],
        ["– ", { text: "Platform teams scoping agent sessions to one package.", bold: true }, " The most consistently recommended mitigation across sources is opening the AI agent directly inside the specific package or app subdirectory being worked on, rather than pointing it at the monorepo root and hoping its indexer figures out relevance (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, ")."],
        ["– ", { text: "Enterprise vendors building dedicated monorepo tooling.", bold: true }, " The existence of products explicitly marketed around \"AI coding agents in monorepos\" (Agentbrisk, Sourcegraph Cody, Augment Code) is itself real-world evidence that this is a recognized, monetizable problem rather than a fringe complaint (", { text: "Agentbrisk", href: "https://agentbrisk.com/blog/ai-coding-monorepo-strategies-2026/", external: true }, ")."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– ", { text: "Pointing the agent at the repo root \"to be safe.\"", bold: true }, " This maximizes the amount of irrelevant context the agent has to filter and increases the odds it picks up conventions from the wrong package."],
        ["– ", { text: "Writing one giant rules file instead of scoped ones.", bold: true }, " A single sprawling `.cursorrules`-style file that tries to describe every package dilutes the instructions that matter for the current task; scoped `.mdc`/`CLAUDE.md` files per package perform better."],
        ["– ", { text: "Assuming a bigger context window model will fix cross-service breakage.", bold: true }, " As covered above, the bottleneck is usually retrieval and dependency awareness, not raw token capacity."],
        ["– ", { text: "Not checking mundane causes first.", bold: true }, " Before assuming a deep architectural limitation, verify basics — emoji or special characters in folder names, misconfigured `.cursorignore`/`.gitignore` patterns, or a stale index that needs a manual reindex."],
        ["– ", { text: "Letting the agent invent conventions instead of enforcing existing ones.", bold: true }, " If the rules file doesn't explicitly state the repo's export style, naming conventions, and folder structure, the agent will default to whatever pattern is most common in its training data — which is often not your repo's pattern."],
        ["– ", { text: "Skipping incremental reindexing after large refactors.", bold: true }, " Large structural changes (renaming shared packages, moving files between workspaces) can leave an agent's index stale, reintroducing interface hallucination risk until a fresh index completes."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– ", { text: "Scope agent sessions to the smallest sufficient unit.", bold: true }, " Open the agent directly in the package or app directory being changed, not the monorepo root, whenever the task doesn't genuinely require cross-package awareness."],
        ["– ", { text: "Maintain package-scoped rules files.", bold: true }, " Use `.cursor/rules/*.mdc` (Cursor) or `CLAUDE.md` (Claude Code) at both the repo root (for global conventions) and inside individual packages (for local conventions), each kept to roughly 1,000–2,500 words rather than one sprawling document."],
        ["– ", { text: "Exclude noise from indexing.", bold: true }, " Use `.cursorignore` (matching `.gitignore` syntax) to keep generated code, build artifacts, and vendored dependencies out of the index so relevance signals aren't diluted."],
        ["– ", { text: "Treat cross-service changes as a distinct workflow.", bold: true }, " For changes that genuinely span multiple packages, plan the change as a set of scoped sub-tasks per package rather than asking one agent session to reason about all of them simultaneously."],
        ["– ", { text: "Reindex after major structural changes.", bold: true }, " After large refactors, renames, or package moves, trigger a manual reindex rather than assuming the agent will notice the change from context alone."],
        ["– ", { text: "Verify shared-library changes manually before merge.", bold: true }, " Given the documented interface-hallucination risk, treat any AI-generated code that calls into a shared library as needing an explicit \"does this signature actually still exist\" check, not just a normal code review pass."],
        ["– ", { text: "Invest in navigation infrastructure as the repo grows", bold: true }, ", not just a bigger-window model — dependency graphs, pre-indexed embeddings, or a dedicated code-intelligence layer scale better than hoping the next model release solves cross-service context."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– Monorepo AI-agent failures cluster into five documented patterns: context overflow, interface hallucination, wrong-folder file creation, indexing quirks, and convention drift."],
        ["– Bigger context windows alone don't fix this — the real bottleneck is dependency-aware retrieval and navigation infrastructure, not raw token capacity."],
        ["– Scoping agent sessions to the specific package being worked on, rather than the repo root, is the most consistently effective mitigation across sources."],
        ["– Package-scoped rules files (`.cursor/rules/*.mdc`, `CLAUDE.md`) measurably help but aren't foolproof against interface hallucination."],
        ["– Monorepo adoption is reportedly rising partly because AI tools get native cross-package visibility they lack in polyrepos — but that visibility comes with its own scale problems."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["If your AI-assisted workflow involves generating or debugging config files, API payloads, or structured data as you work through a monorepo, the ", { text: "JSON Formatter & Validator", href: "/dev/json-formatter" }, " is a quick way to check that AI-generated JSON (package manifests, tool configs, API responses) is actually valid before it goes into a commit. For prompt patterns specific to these tools, the ", { text: "Cursor", href: "/prompts/cursor" }, " and ", { text: "Claude", href: "/prompts/claude" }, " prompt libraries collect tested prompt structures for scoping and instructing coding agents, and the ", { text: "DevOps & Cloud", href: "/prompts/devops" }, " category covers broader infrastructure and tooling prompts relevant to monorepo build systems."],
        ["If your team is hitting these limits at genuine enterprise scale — dozens of services, recurring cross-service breakage, or a platform team spending more time correcting AI output than the AI saves — that's a fairly specific infrastructure problem, and it might be worth a conversation with SCULT.IN's ", { text: "custom software development", href: SERVICE_CUSTOM_SOFTWARE.href, external: true }, " team about building the dependency-graph indexing and CI guardrails that turn \"AI coding agent in a monorepo\" from a source of friction into a genuinely reliable workflow."],
      ],
    },
  ],
  faq: [
    {
      question: "What is a monorepo?",
      answer: ["A single repository holding multiple projects, services, or packages — often with shared libraries, infrastructure code, and generated types — instead of splitting them into separate repositories."],
    },
    {
      question: "What are Cursor and Claude Code?",
      answer: ["Cursor is an AI-native code editor built around agentic coding workflows; Claude Code is Anthropic's command-line/IDE-integrated coding agent. Both can read, edit, and run code across a project with varying degrees of autonomy."],
    },
    {
      question: "Can AI coding agents handle a large monorepo at all?",
      answer: ["Yes for scoped, single-package tasks; reliability drops sharply for cross-cutting changes that span multiple services, which is where most documented failures occur (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, ")."],
    },
    {
      question: "Why does my AI coding assistant get confused in a monorepo?",
      answer: ["Because the monorepo is almost always far larger than what any context window or naive retrieval system can meaningfully cover, so the agent works from an incomplete or wrong slice of the codebase (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, ")."],
    },
    {
      question: "What is Turborepo?",
      answer: ["A build system for JavaScript/TypeScript monorepos that manages task caching and dependency graphs across packages, commonly paired with pnpm or Yarn workspaces."],
    },
    {
      question: "What is Nx?",
      answer: ["A build system and monorepo tooling platform (originally from the Angular ecosystem, now framework-agnostic) offering dependency graph visualization, caching, and code generation across a monorepo."],
    },
    {
      question: "What does \"context window\" mean for an AI coding agent?",
      answer: ["The maximum amount of text (measured in tokens) the underlying model can process in a single request — everything the agent \"sees\" at once, including code, instructions, and conversation history."],
    },
    {
      question: "Is a monorepo better or worse than separate repos for AI coding agents?",
      answer: ["Neither is strictly better — a monorepo gives access to everything but requires efficient navigation; a polyrepo denies access to anything outside the current repo, causing the agent to guess at external interfaces (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, ")."],
    },
    {
      question: "What's the simplest fix if an AI agent keeps breaking a shared package?",
      answer: ["Scope the agent's session away from that package unless the task specifically requires editing it, and add explicit rules describing the shared package's current public API."],
    },
    {
      question: "Do I need special software to use AI coding agents in a monorepo?",
      answer: ["No — the core mitigations (scoping sessions, writing rules files, excluding noisy directories from indexing) work with the built-in features of tools like Cursor and Claude Code; dedicated indexing platforms are an enhancement, not a requirement."],
    },
    {
      question: "What is \"interface hallucination\"?",
      answer: ["When an agent generates code calling a function or method signature that looks plausible but doesn't match the interface's actual current definition — often because the definition changed after the agent's training data or index was last updated (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, ")."],
    },
    {
      question: "Why can't a bigger context window just solve monorepo scale problems?",
      answer: ["Because even very large windows are dwarfed by a 50-service repo's tens of millions of tokens of source, and because relevance in a monorepo is a dependency-graph problem that raw token capacity doesn't solve on its own (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, ")."],
    },
    {
      question: "What is the \"80% problem\" in agentic coding?",
      answer: ["A term used by Sourcegraph to describe how agents perform well on the roughly 80% of tasks that are single-file or single-service, and fail disproportionately on the cross-cutting changes that touch multiple services or layers (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, ")."],
    },
    {
      question: "Why does embeddings-based retrieval miss important context in a monorepo?",
      answer: ["Because embeddings capture textual similarity, not the behavioral contract between services — two files can be semantically unrelated in text but tightly coupled in actual runtime dependency, and vector search alone won't surface that relationship (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, ")."],
    },
    {
      question: "What is the \"memory bottleneck\" in long AI coding sessions?",
      answer: ["A pattern where an agent loses track of earlier architectural decisions and cross-file relationships over a long session, even though each individual file it's looking at fits comfortably within context (", { text: "Supermemory", href: "https://supermemory.ai/blog/memory-bottleneck-large-repo-coding-agents/", external: true }, ")."],
    },
    {
      question: "Do rules files like CLAUDE.md and .cursor/rules actually work?",
      answer: ["Real accounts report they measurably help the agent respect package boundaries and existing conventions, though they are not a complete fix for interface hallucination or cross-service blindness (", { text: "SelfScrum", href: "https://selfscrum.medium.com/ai-driven-development-beyond-the-monorepo-2ce9ad74ac89", external: true }, ")."],
    },
    {
      question: "Is monorepo adoption increasing because of AI coding tools specifically?",
      answer: ["Commentary and industry write-ups suggest yes — teams are reconsidering or adopting monorepos partly because tools like Cursor and Claude Code get native cross-package visibility inside one repo that they lack across separate repos (", { text: "Adrian Petcu", href: "https://adrianpetcu.substack.com/p/monorepos-are-back-and-ai-is-the", external: true }, "; ", { text: "Spectro Cloud", href: "https://www.spectrocloud.com/blog/will-ai-turn-2026-into-the-year-of-the-monorepo", external: true }, ")."],
    },
    {
      question: "Why do AI agents apply inconsistent coding conventions across a monorepo?",
      answer: ["Because without an explicit rules file stating the repo's actual conventions, the model defaults to whatever pattern is statistically common in its training data, and it may pick a different default each session (", { text: "SelfScrum", href: "https://selfscrum.medium.com/ai-driven-development-beyond-the-monorepo-2ce9ad74ac89", external: true }, ")."],
    },
    {
      question: "What's the difference between a \"physical\" and \"effective\" context window?",
      answer: ["The physical window is the advertised token maximum; the effective window is the smaller amount the model can actually use accurately before quality degrades, since proprietary filtering and attention limits discard some tokens as less relevant."],
    },
    {
      question: "Why does file count matter, not just total token count?",
      answer: ["Because indexing quality (not just raw context capacity) degrades as file count grows — one analysis puts the practical ceiling for naive context-stuffing at around 2,500 files before quality visibly drops (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, ")."],
    },
    {
      question: "How do I scope Cursor to one package in a monorepo?",
      answer: ["Open Cursor directly on the specific package/app subdirectory (rather than the monorepo root), and use `.mdc` rule files scoped to that path via glob patterns so global rules don't dilute package-specific ones."],
    },
    {
      question: "How do I scope Claude Code to a subdirectory?",
      answer: ["Launch Claude Code from within the target subdirectory, or explicitly reference that path in your instructions, and place a `CLAUDE.md` inside that subdirectory describing its local conventions and dependencies."],
    },
    {
      question: "How do I set up CLAUDE.md for a monorepo?",
      answer: ["Write a root-level `CLAUDE.md` covering global structure and conventions, then add package-level `CLAUDE.md` files describing each package's public API, dependencies, and local conventions — mirroring the same pattern Cursor's `.mdc` rules use."],
    },
    {
      question: "How do I configure Cursor rules for a monorepo?",
      answer: ["Move away from a single legacy `.cursorrules` file and use the `.cursor/rules/` directory with individual `.mdc` files, each scoped by glob pattern, description-based auto-attach, or manual `@mention`, keeping each file to roughly 1,000–2,500 words."],
    },
    {
      question: "How do I avoid AI agents breaking shared packages?",
      answer: ["Document the shared package's current public API explicitly in its rules file, scope sessions away from it when not needed, and manually verify any AI-generated code that calls into it before merging."],
    },
    {
      question: "How do I exclude noisy directories from an agent's index?",
      answer: ["Use `.cursorignore` (same syntax as `.gitignore`) to exclude build artifacts, generated code, node_modules, and vendored dependencies from indexing."],
    },
    {
      question: "How do I know if my monorepo has exceeded a practical indexing ceiling?",
      answer: ["Watch for symptoms like the agent referencing files that no longer exist, missing recently added files, or giving generic answers that ignore obvious local context — these often precede or accompany degraded indexing at scale."],
    },
    {
      question: "How do I handle a cross-service change with an AI agent?",
      answer: ["Break the change into per-package sub-tasks, run each in a scoped session against that package's own rules file, and manually verify the points where packages actually connect rather than trusting the agent to reason about the whole chain at once."],
    },
    {
      question: "How do I check if a workspace-structure bug (like the emoji issue) is affecting indexing?",
      answer: ["Check folder and file names for unusual characters, review `.cursorignore`/`.gitignore` patterns for accidental over-exclusion, and try a manual reindex before assuming a deeper architectural cause."],
    },
    {
      question: "How do I keep an AI agent from inventing its own coding conventions?",
      answer: ["State the repo's actual export style, naming conventions, and folder structure explicitly in the rules file — don't assume the agent will infer them correctly from surrounding code alone."],
    },
    {
      question: "Is retrieval-augmented generation (RAG) the answer to monorepo-scale context problems?",
      answer: ["It helps but isn't a complete answer — vendors building dependency-graph-aware retrieval systems argue plain embedding-based RAG still misses the behavioral contracts between services that define correctness in a monorepo (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, ")."],
    },
    {
      question: "Does indexing time scale linearly with monorepo size?",
      answer: ["Not purely — a 100,000-file monorepo can take a few minutes to index the first time, then update incrementally afterward, so ongoing use is faster than the initial index suggests."],
    },
    {
      question: "Can an AI agent understand the difference between a monorepo's build system and its source code?",
      answer: ["Not reliably by default — build configuration (Turborepo/Nx pipelines, workspace definitions) needs to be explicitly described in rules files, since agents often treat it as just more source text rather than structural metadata."],
    },
    {
      question: "Why do some teams open separate editor windows per sub-app instead of one window on the whole monorepo?",
      answer: ["Because splitting indexing by work area reduces the amount of irrelevant context the agent has to filter through per session, a strategy explicitly recommended in current monorepo-optimization guidance."],
    },
    {
      question: "What's the \"quadratic cost\" problem with large context windows?",
      answer: ["Attention computation cost scales faster than linearly with input length in many transformer architectures, meaning stuffing ever-larger contexts into every request becomes economically impractical even when technically possible."],
    },
    {
      question: "Cursor vs. Claude Code — which handles monorepos better?",
      answer: ["No independent, controlled benchmark comparing the two specifically on monorepo-scale tasks currently exists publicly; available evidence is scattered practitioner reports rather than a reproducible study (evidence not sufficiently verified for a definitive ranking)."],
    },
    {
      question: "Monorepo vs. polyrepo for AI coding agents — which is actually easier for the agent?",
      answer: ["Neither is unambiguously easier: monorepos overload naive retrieval with too much to search; polyrepos blind the agent to anything outside the current repo, causing it to guess at external contracts (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, ")."],
    },
    {
      question: "Enterprise AI code tools vs. general-purpose editors — what's the real difference for monorepos?",
      answer: ["Enterprise-focused tools (Sourcegraph Cody, Augment Code) invest specifically in pre-indexed embeddings and selective retrieval across hundreds of thousands of files, a layer general-purpose editors don't build by default (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, "; ", { text: "Augment Code", href: "https://www.augmentcode.com/tools/best-enterprise-ai-code-generators", external: true }, ")."],
    },
    {
      question: ".cursorrules vs. .cursor/rules/*.mdc — what changed?",
      answer: ["The single root `.cursorrules` file is now effectively legacy and ignored in Agent mode; current guidance uses a `.cursor/rules/` directory of scoped `.mdc` files with different attachment modes (always, glob-matched, description-matched, or manual)."],
    },
    {
      question: "Turborepo/Nx vs. plain workspace scripts — does the choice affect AI agent performance?",
      answer: ["Indirectly — Turborepo/Nx expose an explicit dependency graph that, if surfaced to the agent through rules files, can help it understand package relationships better than an undocumented plain-script setup, though this isn't a guaranteed fix."],
    },
    {
      question: "My AI agent keeps writing files to the wrong folder — what should I check first?",
      answer: ["Verify your `.cursorignore`/rules-file glob patterns actually match your real folder structure, check for special characters in folder names, and confirm the agent session is scoped to the intended subdirectory rather than the repo root."],
    },
    {
      question: "My agent used a method that doesn't exist anymore — what happened?",
      answer: ["Likely interface hallucination — the agent generated a plausible-looking call based on stale training data or a stale index rather than the shared library's current signature; verify manually and update the rules file to reflect the current API (", { text: "Tianpan.co", href: "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", external: true }, ")."],
    },
    {
      question: "My agent's suggestions ignore our team's existing code style — why?",
      answer: ["The rules file likely doesn't explicitly state your conventions, so the agent defaults to common patterns from its training data rather than your repo's actual style (", { text: "SelfScrum", href: "https://selfscrum.medium.com/ai-driven-development-beyond-the-monorepo-2ce9ad74ac89", external: true }, ")."],
    },
    {
      question: "Indexing seems to have silently skipped a whole folder — what could cause that?",
      answer: ["Unusual characters (like emoji) in folder names, overly broad `.cursorignore` patterns, or a stale index needing a manual refresh are documented real causes (", { text: "Cursor forum", href: "https://forum.cursor.com/t/cursor-issues-with-monorepo-and-code-workspace/78543", external: true }, ")."],
    },
    {
      question: "My agent seems to \"forget\" earlier architectural decisions mid-session — why?",
      answer: ["This matches the documented memory-bottleneck pattern in long sessions on large repos — the agent can lose track of cross-file relationships and earlier decisions even when individual files fit in context (", { text: "Supermemory", href: "https://supermemory.ai/blog/memory-bottleneck-large-repo-coding-agents/", external: true }, ")."],
    },
    {
      question: "Should I buy an enterprise AI coding tool, or can I make do with Cursor/Claude Code plus good rules files?",
      answer: ["For small-to-mid monorepos, disciplined scoping and rules files with the built-in tools are usually sufficient; teams with 50+ services and millions of lines of code are the ones documented to be investing in dedicated indexing/retrieval infrastructure on top (", { text: "Sourcegraph", href: "https://sourcegraph.com/blog/agentic-coding", external: true }, ")."],
    },
    {
      question: "Is it worth restructuring a monorepo just to make AI agents work better in it?",
      answer: ["Restructuring purely for AI-agent convenience isn't well evidenced as necessary; documented mitigations (scoping, rules files, excluding noise from indexing) address most reported failures without requiring a repo restructure."],
    },
    {
      question: "What should I ask a vendor pitching an \"AI-ready monorepo tool\"?",
      answer: ["Ask specifically how their retrieval handles cross-service dependency relationships (not just text similarity), how indexing scales with your actual file count, and whether they support scoped, package-level rules — these map directly to the documented failure modes above."],
    },
    {
      question: "How do I evaluate whether my current setup (Cursor/Claude Code + rules files) is \"good enough\"?",
      answer: ["Track whether cross-service changes still require heavy manual correction after agent-generated first drafts; if scoped single-package tasks work well but cross-cutting tasks consistently fail, you've hit the documented ceiling of the built-in approach rather than a misconfiguration."],
    },
    {
      question: "Does a custom software / DevOps consulting engagement help with this specific problem?",
      answer: ["It can — setting up dependency-graph-aware indexing, package-scoped rules files, and CI checks that catch interface mismatches before merge is exactly the kind of infrastructure work a DevOps or platform engineering engagement is suited to when a team has outgrown ad hoc mitigations."],
    },
  ],
  sources: [
    "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window",
    "https://forum.cursor.com/t/cursor-issues-with-monorepo-and-code-workspace/78543",
    "https://selfscrum.medium.com/ai-driven-development-beyond-the-monorepo-2ce9ad74ac89",
    "https://adrianpetcu.substack.com/p/monorepos-are-back-and-ai-is-the",
    "https://www.spectrocloud.com/blog/will-ai-turn-2026-into-the-year-of-the-monorepo",
    "https://supermemory.ai/blog/memory-bottleneck-large-repo-coding-agents/",
    "https://sourcegraph.com/blog/agentic-coding",
    "https://agentbrisk.com/blog/ai-coding-monorepo-strategies-2026/",
    "https://kayraberktuncer.medium.com/frontend-architecture-for-ai-coding-agents-monorepos-micro-frontends-and-rule-management-1f64b1fb9d88",
  ],
  relatedTools: ["json-formatter"],
  relatedPrompts: [],
  serviceTarget: "custom-software",
  updatedAt: "2026-08-21",
  readingMinutes: 20,
}
