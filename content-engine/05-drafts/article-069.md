---
id: article_069
title: "How Developers Are Actually Using AI Agents for Codebase Migrations"
slug: ai-agent-codebase-migration
description: "How teams like Anthropic use AI agents for large-scale code migrations in practice — the real workflow, timelines, failure modes, and why one-shot migration fails."
primary_keyword: "ai agent codebase migration"
secondary_keywords: ["ai code migration", "claude code migration playbook", "large scale code migration ai", "legacy code migration ai agents", "agentic code migration workflow"]
intent: Informational
audience: "engineering leads and senior developers planning or running large-scale legacy code or language migrations"
topic_cluster: "AI-driven code migration"
countries: []
author: "SCULT.IN Content Engine"
review_status: draft
last_verified: "2026-08-21"
sources: ["https://claude.com/blog/ai-code-migration", "https://www.200oksolutions.com/blog/5-ai-coding-agents-tested-on-legacy-codebase/", "https://ainativecompass.substack.com/p/migrating-legacy-code-with-ai-yes", "https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window", "https://www.memorylake.ai/en/blogs/migrate-cursor-to-claude-code", "https://rejoicehub.com/blogs/ai-code-migration-claude-code-playbook"]
---

# How Developers Are Actually Using AI Agents for Codebase Migrations

Teams running real AI-agent-driven code migrations follow a six-stage process — build a translation rulebook, stress-test on sample files, run parallel agent teams, fix compiler errors in loops, run smoke tests, then verify full behavioral equivalence — rather than asking an agent to migrate an entire codebase in one shot, which reliably fails due to context loss and hallucinated interfaces. The Bun team migrated roughly 500,000-960,000 lines of Bun's codebase (reported figures vary by source) from Zig to Rust in about 11 days using this approach, with the existing test suite passing before merge, though 19 post-merge regressions still surfaced afterward — a concrete reminder that full automation without human validation isn't yet reliable even in the best-documented case, which was itself publicly disputed by Zig's own creator as "unreviewed slop."

## Table of contents

- Why one-shot migration fails
- The six-stage workflow that actually works
- The Bun migration: what actually happened
- Faster wins: version upgrades vs. full language ports
- Comparing coding agents on legacy migration specifically
- Real risks: hallucinated interfaces and stale assumptions
- Structuring instructions for a migration project
- Practical examples
- Data and evidence
- Comparisons
- Real-world use cases
- Common mistakes
- Best practices
- Frequently asked questions
- Key takeaways
- Relevant tools.scult.in resources
- Sources

## Why one-shot migration fails

The single most consistent finding across the available practitioner and industry evidence is that asking an AI agent to migrate an entire codebase in one uninterrupted pass reliably fails — and the reason isn't a capability gap that will simply be solved by a more powerful model. It's a structural context problem. Agents given a whole codebase to migrate at once tend to lose track of earlier decisions and context as the task grows, because there's a practical limit to how much a model can hold, reason about consistently, and apply uniformly across a large body of code in a single continuous effort ([ainativecompass.substack.com](https://ainativecompass.substack.com/p/migrating-legacy-code-with-ai-yes)).

The naive fix — just break the codebase into smaller chunks and migrate each piece separately — creates a different problem: without full visibility into the rest of the system, an agent working on an isolated chunk applies practices inconsistently across chunks, hallucinates more frequently (since it lacks the full context needed to ground its decisions), and runs into scalability issues as chunk boundaries multiply. The actual fix that's emerged in practice isn't "bigger chunks" or "smaller chunks" — it's **guided exploration and decomposed tasks with an explicit rulebook**, which is different from naive chunking because it front-loads the boundary decisions and translation rules before any migration work starts, rather than letting the agent improvise consistency chunk by chunk ([ainativecompass.substack.com](https://ainativecompass.substack.com/p/migrating-legacy-code-with-ai-yes)).

## The six-stage workflow that actually works

Anthropic's own account of how its team runs large-scale code migrations with Claude Code describes a specific, six-stage process, and it's worth walking through each stage because the sequence itself is a meaningful part of why it works ([claude.com/blog/ai-code-migration](https://claude.com/blog/ai-code-migration)):

1. **Build a rulebook.** Before any migration code is written, the team documents what can and can't be automatically translated — explicit mapping rules, known edge cases, and boundaries the agents need to respect. This front-loads the hardest judgment calls into a reference document rather than leaving each agent to improvise them independently.
2. **Stress-test on sample files.** The rulebook and approach get validated against a small, representative sample of the actual codebase before scaling up — catching gaps in the rulebook early, when they're cheap to fix, rather than after they've propagated across a large migration.
3. **Run parallel agent teams.** Smaller, faster models handle the bulk translation work, while larger, more capable models review that output — a division of labor that uses cheaper compute for the high-volume mechanical work and reserves the more expensive, more careful review capacity for catching what the faster pass gets wrong.
4. **Fix compiler errors in agent loops.** Rather than a human manually fixing every compile failure, agents iterate automatically against the compiler's error output until the migrated code actually builds — a tight, automatable feedback loop that doesn't require human judgment for most mechanical fixes.
5. **Run smoke tests.** Before the full test suite, a faster, lighter smoke-test pass catches obviously broken functionality early.
6. **Verify behavior matches the original via full test suites.** The final gate is running the complete existing test suite against the migrated code, confirming behavioral equivalence with the original codebase before merge.

## The Bun migration: what actually happened

The most concrete, well-documented real-world example of this workflow in action is Bun's (a JavaScript runtime) migration from Zig to Rust, run by the Bun team using Claude Code after Anthropic acquired Bun in December 2025. Reported line counts for the pre-port Zig codebase vary by source — roughly 960,000 lines in one account, roughly 535,000 lines excluding comments in another — so "about a million lines" is a rounding of the higher end of reported figures, not a single precisely agreed number; separately, the migration's test suite is reported to contain over one million individual test assertions, a distinct figure worth not conflating with lines-of-code. The port itself ran over about 11 days using roughly 50 parallel Claude Code agent workflows, and — critically — the existing test suite passed in CI before the migration was merged ([claude.com/blog/ai-code-migration](https://claude.com/blog/ai-code-migration); [remio.ai](https://www.remio.ai/post/anthropic-claude-code-migration-took-bun-from-zig-to-rust-in-two-weeks-but-speed-wasn-t-the-hard-pa)).

It's also worth being upfront about the motivation and the reception, since both are relevant to how much weight to put on this as a template: the switch away from Zig was driven in part by Zig's policy against AI-generated contributions, not purely by an independent technical preference for Rust — meaning this wasn't a neutral "which language is better" decision made in a vacuum. And the migration was not uniformly well received: Zig's creator, Andrew Kelley, publicly called the AI-generated Rust code "unreviewed slop" and argued Bun's underlying bugs stemmed from prior programming practices rather than from Zig's limitations, while others (including HashiCorp co-founder Mitchell Hashimoto) praised the speed of the rewrite. This doesn't invalidate the workflow lessons below, but it means the Bun case is a genuinely contested example, not a universally endorsed success story, and it's presented here as the best-documented case available rather than an uncontroversial one ([theregister.com](https://www.theregister.com/devops/2026/07/14/zig-creator-calls-buns-claude-rust-rewrite-unreviewed-slop/5270743)).

The migration also delivered real, measurable post-merge performance gains: a 19% smaller binary and a large reduction in memory usage — concrete evidence that this wasn't just a mechanical, quality-neutral port, but one that captured genuine benefits from the target language and toolchain. However, it's important to be precise about what "tests passing before merge" does and doesn't guarantee: the same migration saw 19 post-merge regressions surface afterward, which the team then fixed ([claude.com/blog/ai-code-migration](https://claude.com/blog/ai-code-migration)). This detail matters more than it might seem — it's direct, first-party evidence that even the most carefully documented, best-practice-following AI-agent migration on record still required human validation and post-merge fixes, not full unsupervised automation, and the "unreviewed slop" criticism above suggests that validation bar is itself a live debate, not a settled one.

A separate real example from the same source describes a Python-to-TypeScript port of 165,000 lines completed over a single weekend, which cut compile time from 30 minutes down to about two seconds per release cycle — an enormous, concrete developer-experience improvement that illustrates why teams pursue these migrations in the first place, beyond the abstract appeal of a "modern" language ([claude.com/blog/ai-code-migration](https://claude.com/blog/ai-code-migration)).

## Faster wins: version upgrades vs. full language ports

Not every AI-assisted migration is a full cross-language port on the scale of Bun's Zig-to-Rust move. For narrower version migrations — for example, Java 11 to Java 17, or Spring Boot 2.x to 3.x — agents given a clear, well-scoped plan have completed large application migrations in as little as a single day, a meaningfully faster timeline than the multi-week efforts required for full language ports ([ainativecompass.substack.com](https://ainativecompass.substack.com/p/migrating-legacy-code-with-ai-yes)).

This distinction is practically useful for planning purposes: a version-upgrade migration (same language, newer version, mostly mechanical API and syntax updates) is a substantially smaller and faster undertaking than a full language port (different syntax, different idioms, different tooling entirely), even though both fall under the general banner of "AI-assisted code migration." Teams planning a migration should scope expectations accordingly rather than assuming every migration project resembles the more dramatic, headline-grabbing full-language-port examples.

## Comparing coding agents on legacy migration specifically

A comparative test running five different AI coding agents against the same legacy codebase found meaningful differences in how each approached migration planning specifically, as distinct from general coding ability. Claude Code produced the most coherent migration plan among the five agents tested, and notably explained *why* it made each proposed change — a reasoning-transparency quality that matters specifically for migration work, where a human needs to be able to verify and trust the agent's judgment calls on ambiguous translation decisions, not just check that the resulting code compiles. Cursor, by contrast, was faster specifically at local refactoring tasks in the same comparison, suggesting different agents may have different relative strengths depending on whether the task is "plan a large, ambiguous migration" versus "refactor this specific local piece of code quickly" ([200oksolutions.com](https://www.200oksolutions.com/blog/5-ai-coding-agents-tested-on-legacy-codebase/)).

## Real risks: hallucinated interfaces and stale assumptions

A genuinely important, well-documented risk in AI-assisted migration (and AI-assisted coding more broadly) is that agents can generate code calling method signatures or interfaces that no longer match the codebase's actual current state — because the agent is inferring from patterns in its training data or from a stale local context window, rather than checking against the actual, current shared library or interface definition ([tianpan.co](https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window)).

This risk is particularly acute in large monorepos or systems with many interdependent services, where a shared interface might have changed in a part of the codebase the agent isn't currently looking at. This is directly related to the hallucinated-API problem discussed in AI code review more broadly: syntactically plausible, stylistically consistent code that calls something that doesn't actually exist (or doesn't exist with those parameters) in the current codebase — and it requires either compilation/execution-based verification or explicit interface lookups to catch reliably, since text-level review alone often won't flag it.

## Structuring instructions for a migration project

A recurring, well-documented best practice across multiple sources is that Claude Code (and, by extension, similar agentic coding tools) performs significantly better on migration work when given structured instructions via a project rules file — commonly a `CLAUDE.md` documenting the translation rules and boundaries specific to the migration — rather than vague, ad hoc prompts issued as the work proceeds ([rejoicehub.com](https://rejoicehub.com/blogs/ai-code-migration-claude-code-playbook)). This is directly consistent with the "build a rulebook first" stage of Anthropic's own six-stage process described above — it's the same underlying principle, restated as a practical implementation detail: front-load the translation rules into a structured, referenceable document rather than relying on the agent (or a human directing it) to reconstruct those rules from scratch on every session.

Worth flagging as a related, practical friction point for teams switching tools mid-project: there's no direct import path for migrating context or rules from Cursor to Claude Code specifically. Teams have to hand-carry accumulated project-specific context and rules into a `CLAUDE.md` manually, since Cursor's `.cursor/rules` and accumulated project context aren't treated as native Claude Code configuration ([memorylake.ai](https://www.memorylake.ai/en/blogs/migrate-cursor-to-claude-code)). This is a real, documented limitation worth planning around if a migration project is also coinciding with a tooling switch.

## Practical examples

**A team modernizing a legacy Java monolith.** Following the version-upgrade pattern described above, a Java 11-to-17 upgrade with a clear, well-scoped plan can realistically be completed in about a day with agent assistance — a much smaller undertaking than teams sometimes assume when they hear "AI-assisted code migration" and picture something closer to the multi-week Bun-scale effort.

**A startup considering a full Python-to-TypeScript rewrite.** Following Anthropic's documented example of a 165,000-line Python-to-TypeScript port completed over a single weekend, a team can reasonably plan for an aggressive but achievable timeline if they follow the same structured, rulebook-first, parallel-agent-team approach — while still budgeting time afterward for the kind of post-merge regression fixing the Bun migration required.

**Illustrative example (hypothetical, for clarity).** Imagine a mid-sized SaaS company migrating a shared internal billing library used by a dozen microservices. Given the documented hallucinated-interface risk in monorepo-style systems, this team would be well served by explicit, current interface documentation checked into the rulebook stage before migration begins — since an agent working on any one service in isolation has no reliable way to know the billing library's interface has already changed elsewhere in the migration effort, without that documentation being explicitly surfaced to it.

## Data and evidence

- The Bun team migrated roughly 500,000-960,000 lines (reported figures vary by source) of Bun's codebase from Zig to Rust in about 11 days, with the existing test suite passing in CI before merge, plus a 19% smaller binary and large memory reduction post-merge — alongside 19 post-merge regressions that were subsequently fixed ([claude.com/blog/ai-code-migration](https://claude.com/blog/ai-code-migration); [remio.ai](https://www.remio.ai/post/anthropic-claude-code-migration-took-bun-from-zig-to-rust-in-two-weeks-but-speed-wasn-t-the-hard-pa)).
- The migration was driven partly by Zig's policy against AI-generated contributions following Anthropic's December 2025 acquisition of Bun, and was publicly criticized by Zig's creator, Andrew Kelley, as "unreviewed slop" — a genuinely contested case study, not a universally endorsed one ([theregister.com](https://www.theregister.com/devops/2026/07/14/zig-creator-calls-buns-claude-rust-rewrite-unreviewed-slop/5270743)).
- A separate Python-to-TypeScript port of 165,000 lines was completed over a single weekend, cutting compile time from 30 minutes to about two seconds per release cycle ([claude.com/blog/ai-code-migration](https://claude.com/blog/ai-code-migration)).
- Narrower version-upgrade migrations (e.g., Java 11 to 17, Spring Boot 2.x to 3.x) with a clear plan have been completed in as little as a single day ([ainativecompass.substack.com](https://ainativecompass.substack.com/p/migrating-legacy-code-with-ai-yes)).
- In a comparative test of five AI coding agents on the same legacy codebase, Claude Code produced the most coherent migration plan and explained its reasoning for each change, while Cursor was faster specifically at local refactoring ([200oksolutions.com](https://www.200oksolutions.com/blog/5-ai-coding-agents-tested-on-legacy-codebase/)).
- Agents given an entire codebase to migrate in one shot reliably lose context and degrade in consistency as the task scales, and naively chunking without full-system visibility causes poor practice application, hallucinations, and scalability issues ([ainativecompass.substack.com](https://ainativecompass.substack.com/p/migrating-legacy-code-with-ai-yes)).
- Agents can generate code calling stale or non-existent interfaces, inferring from training data or a limited context window rather than the current, actual codebase state — a documented risk especially in large monorepos ([tianpan.co](https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window)).

## Comparisons

**Claude Code vs. Cursor vs. Codex for migration.** In a five-agent comparative test on the same legacy codebase, Claude Code produced the most coherent migration plan with explained reasoning; Cursor was faster at local refactoring. Direct, verified comparative data for Codex and other agents specifically on migration planning (as opposed to general coding tasks) is evidence not sufficiently verified beyond this specific study's scope.

**Manual migration vs. AI agent migration cost.** The available evidence doesn't include a rigorously sourced, apples-to-apples cost comparison between fully manual and AI-agent-assisted migration — evidence not sufficiently verified for a specific cost-multiplier figure; the timeline data (roughly 500,000-960,000 lines in about 11 days, or 165,000 lines over a weekend) is the strongest available proxy for the scale of speed advantage, though it doesn't directly translate to a dollar-cost comparison without knowing the team size and rates involved.

**Full language port vs. version upgrade.** A full language port (like Bun's Zig-to-Rust migration) took about 11 days for a codebase reported at roughly 500,000-960,000 lines with a dedicated team; a narrower version upgrade (Java 11 to 17) has been completed in as little as a single day — a meaningfully different scale and complexity of undertaking despite both being "AI-assisted migrations."

## Real-world use cases

- **Runtime and infrastructure teams** pursuing full cross-language ports for performance or maintainability reasons, following the documented Bun Zig-to-Rust pattern.
- **Teams modernizing build/compile tooling** via language ports specifically for developer-experience gains, following the documented Python-to-TypeScript example that cut compile time from 30 minutes to about two seconds.
- **Enterprise teams running routine version upgrades** (Java, Spring Boot, and similar framework/runtime version bumps) using agent assistance for a much faster turnaround than a full language port would require.
- **Teams switching from Cursor to Claude Code mid-project** who need to explicitly hand-carry accumulated project rules and context into a new `CLAUDE.md`, since there's no automatic import path between the two tools' configuration systems.

## Common mistakes

- **Asking an agent to migrate an entire codebase in one uninterrupted pass.** This reliably fails due to context loss as the task scales — the documented fix is a structured, staged process with an explicit rulebook, not a bigger single attempt.
- **Naively chunking a codebase into pieces without full-system context or an explicit rulebook.** This causes inconsistent practice application, more frequent hallucinations, and scalability issues — a different failure mode from one-shot migration, but still a failure mode.
- **Assuming a passing test suite before merge means the migration is fully correct.** Even the well-documented Bun migration, which passed its existing test suite before merge, still saw 19 post-merge regressions.
- **Skipping the "build a rulebook first" stage and relying on ad hoc prompting throughout the migration.** Documented best practice consistently favors structured, upfront instructions (e.g., a `CLAUDE.md`) over improvised, per-session prompting.
- **Trusting agent-generated code that references interfaces or APIs without verifying they still exist in the current codebase.** This is a documented, real risk, especially in monorepos where a shared interface may have changed elsewhere in the system.
- **Assuming Cursor project rules and context automatically transfer to Claude Code (or vice versa) when switching tools mid-migration.** There's no direct import path — rules and context need to be hand-carried into the new tool's configuration format.
- **Treating a version upgrade and a full language port as the same scale of undertaking.** Version upgrades have been completed in as little as a day; full language ports take substantially longer even with a dedicated team and strong process.

## Best practices

- Build an explicit translation rulebook — documenting what can and can't be automatically translated, plus known edge cases — before any migration code is written.
- Stress-test the rulebook and approach against a small, representative sample of the real codebase before scaling to the full migration.
- Use parallel agent teams with a division of labor: smaller/faster models for bulk translation, larger/more capable models for review.
- Let agents iterate automatically against compiler error output rather than routing every compile failure to a human for manual fixing.
- Run smoke tests before the full test suite to catch obviously broken functionality early and cheaply.
- Treat a fully passing test suite as a necessary but not sufficient gate — budget explicitly for post-merge validation and regression fixing, since even the best-documented example (Bun) needed this.
- Structure instructions via a project rules file (e.g., `CLAUDE.md`) documenting migration-specific translation rules and boundaries, rather than relying on ad hoc, per-session prompting.
- Explicitly verify that agent-generated code references interfaces and APIs that actually exist in the current codebase, especially in monorepos or systems with many interdependent services.
- Scope expectations differently for version upgrades (potentially a day) versus full language ports (potentially weeks with a dedicated team), rather than treating all "AI-assisted migration" projects as the same scale.

## Frequently asked questions

**1. How did Anthropic migrate Bun from Zig to Rust with Claude Code?**
The Bun team migrated a codebase reported at roughly 500,000-960,000 lines (figures vary by source) in about 11 days using parallel agent teams and a six-stage rulebook-driven process, with the existing test suite passing in CI before merge — though the result was publicly disputed by Zig's creator as "unreviewed slop," so treat it as the best-documented case available, not an uncontroversial one.

**2. How fast can AI agents port a codebase between languages?**
Anthropic reports a Python-to-TypeScript port of 165,000 lines completed over a single weekend; the Bun migration (roughly 500,000-960,000 lines depending on the source) took about 11 days with a dedicated team.

**3. What workflow do teams use for AI-agent-driven migrations?**
A six-stage process: build a rulebook, stress-test on sample files, run parallel agent teams, fix compiler errors in loops, run smoke tests, then verify behavior via full test suites.

**4. Does Claude Code outperform other agents on legacy migration planning?**
In a comparison of five coding agents on the same legacy codebase, Claude Code produced the most coherent migration plan with explained reasoning, while Cursor was faster at local refactoring specifically.

**5. Why does letting an AI agent migrate an entire codebase in one shot fail?**
Agents lose context and consistency as the task scales; naive chunking without full-system visibility causes poor practice application, hallucinations, and scalability issues.

**6. Is there a real risk of AI agents hallucinating APIs or interfaces during migration?**
Yes — agents can generate code calling method signatures that no longer match the current codebase, inferring from stale training data or limited context rather than the actual present interface.

**7. How should teams structure instructions (CLAUDE.md) for a migration project?**
Claude Code performs significantly better with structured instructions via a project rules file documenting translation rules and boundaries, rather than vague, ad hoc prompts.

**8. Can you migrate context/rules directly from Cursor to Claude Code?**
No — there's no direct import; teams must hand-carry rules into a `CLAUDE.md` manually, since Cursor's accumulated context isn't native Claude Code configuration.

**9. Can AI agents migrate specific version upgrades quickly, like Java or Spring Boot?**
Yes — for narrower version migrations, agents given a clear plan have completed large application migrations in as little as a single day.

**10. What's the biggest non-technical barrier to AI-assisted migration adoption?**
Making existing code "AI-readable" (clear structure, documentation, boundaries) is often a bigger barrier than learning the AI tools themselves.

**11. Do post-migration regressions still occur after an AI-driven migration?**
Yes — even the widely-cited Bun migration saw 19 post-merge regressions, which were subsequently fixed, showing full automation without human validation isn't yet reliable; that migration's overall quality was also publicly disputed, not universally praised, which is worth keeping in mind when treating it as a template.

**12. What is a "translation rulebook" in AI-assisted migration?**
A documented set of rules, mappings, and known edge cases specifying what can and can't be automatically translated, built before migration work starts.

**13. Why do teams use parallel agent teams instead of a single agent for large migrations?**
To split labor efficiently — smaller, faster models handle bulk translation while larger, more capable models review that output, balancing cost and quality.

**14. What role do compiler errors play in the migration workflow?**
Agents iterate automatically against compiler error output to fix build failures, a tight, largely automatable feedback loop that doesn't require human intervention for most mechanical fixes.

**15. What is a "smoke test" in this context?**
A fast, lighter-weight test pass run before the full test suite, meant to catch obviously broken functionality early and cheaply.

**16. Does passing the existing test suite guarantee a correct migration?**
No — the Bun migration passed its existing test suite before merge and still saw 19 post-merge regressions, showing test-suite passage is necessary but not sufficient.

**17. What measurable benefits did the Bun migration deliver beyond just porting the language?**
A 19% smaller binary and a large reduction in memory usage were reported post-merge, alongside the migration itself.

**18. How long did the Bun Zig-to-Rust migration take?**
About 11 days for a codebase reported at roughly 500,000-960,000 lines (figures vary by source), using a dedicated team and parallel agent workflow.

**19. How long did the Python-to-TypeScript port take?**
165,000 lines were ported over a single weekend, cutting compile time from 30 minutes to about two seconds per release cycle.

**20. Is a full language port the same scale of effort as a version upgrade migration?**
No — version upgrades (e.g., Java 11 to 17) have been completed in as little as a day, while full language ports take substantially longer even with strong process and a dedicated team.

**21. How do you migrate a monolith with AI agents?**
Apply the six-stage process — rulebook, stress-test, parallel agent teams, compiler-error loops, smoke tests, full test-suite verification — with guided decomposition rather than naive chunking or a single one-shot attempt.

**22. How do you set up a migration rulebook for AI agents?**
Document explicit translation rules, known edge cases, and boundaries for what can and can't be automatically translated, ideally in a structured project file like `CLAUDE.md`, before starting migration work.

**23. How do you avoid AI agents losing context during a large migration?**
Use guided exploration and decomposed tasks built on an explicit, front-loaded rulebook, rather than either a single one-shot attempt or naive chunking without full-system context.

**24. How do you verify AI-generated migration code doesn't call stale or hallucinated interfaces?**
Explicitly check referenced interfaces and APIs against the current, actual codebase state — through compilation, execution, or direct lookup — especially in monorepos where shared interfaces can change elsewhere during the migration.

**25. How do you decide whether to attempt a full language port or a narrower version upgrade?**
Consider your actual driver — if you need a fundamentally different language's ecosystem or performance characteristics, a full port may be justified; if you just need current framework/runtime features, a narrower version upgrade is a much faster, lower-risk path.

**26. How do you plan for post-migration regressions?**
Budget explicit time and process for post-merge validation and fixing, following the Bun migration's documented experience of 19 post-merge regressions despite a fully passing pre-merge test suite.

**27. How do you choose between Claude Code, Cursor, and other agents for a migration project?**
Consider the specific task — Claude Code showed an edge on migration planning coherence and reasoning transparency in one comparative test, while Cursor showed an edge on local refactoring speed.

**28. How do you migrate accumulated project context when switching from Cursor to Claude Code mid-project?**
Manually hand-carry the relevant rules and context into a `CLAUDE.md`, since there's no automatic import path between the two tools.

**29. How do you stress-test a migration rulebook before committing to the full migration?**
Apply it to a small, representative sample of real files from the codebase first, catching gaps in the rulebook while they're cheap to fix.

**30. How do you use smaller and larger models together in a migration workflow?**
Assign bulk, high-volume translation work to smaller/faster models and reserve larger/more capable models specifically for reviewing that output — balancing cost against quality.

**31. Claude Code vs. Cursor vs. Codex for migration — which should I choose?**
Claude Code showed the most coherent migration planning and reasoning transparency in one comparative test; Cursor showed faster local refactoring; verified comparative data for Codex specifically on migration planning is evidence not sufficiently verified beyond that one study.

**32. AI migration agents vs. traditional automated migration scripts/tools — which is better for a legacy codebase?**
The available evidence doesn't include a direct, sourced comparison between AI-agent-based migration and traditional scripted/rule-based migration tooling — evidence not sufficiently verified; the documented advantage of AI agents shown here is speed and flexibility on ambiguous, judgment-requiring translation decisions specifically.

**33. Manual migration vs. AI agent migration — which is cheaper?**
A rigorously sourced, direct cost comparison isn't available in the current evidence — evidence not sufficiently verified; the strongest available proxy is the documented speed advantage (roughly 500,000-960,000 lines in about 11 days, or 165,000 lines over a weekend), which suggests substantial time savings, though this doesn't directly translate to a verified dollar-cost multiplier.

**34. Full language port vs. staying on the legacy language — is migration worth it?**
This depends on your specific drivers (performance, maintainability, hiring, tooling ecosystem) — the Bun example shows real measurable gains (smaller binary, lower memory) were achieved, but that doesn't mean every codebase's cost-benefit case is the same.

**35. Is Claude Code better than a general-purpose model prompted directly for migration work?**
The available comparative evidence specifically evaluates dedicated coding agents (including Claude Code) against each other on legacy codebases, rather than against an undifferentiated "general-purpose model prompted directly" — evidence not sufficiently verified for that specific comparison.

**36. My AI agent's migrated code references a function that no longer exists — what happened?**
This matches the documented hallucinated-interface risk — the agent likely inferred the function's existence from stale training data or a limited context window rather than checking the actual current codebase; verify all referenced interfaces explicitly.

**37. My migration passed all existing tests but broke in production — is this normal?**
It's a documented possibility even in the best-practice case — the Bun migration passed its existing test suite before merge and still saw 19 post-merge regressions.

**38. My agent is losing track of earlier migration decisions as the codebase gets larger — what should I do?**
This matches the documented context-loss failure mode of one-shot or poorly-chunked migration — introduce guided exploration with an explicit rulebook and decomposed tasks rather than continuing a single large, undifferentiated pass.

**39. My migrated code compiles but behaves differently from the original — how do I catch this?**
Run the full existing test suite specifically for behavioral-equivalence verification — this is the final, dedicated stage in the documented six-stage workflow precisely because compiling successfully doesn't guarantee behavioral equivalence.

**40. I switched from Cursor to Claude Code mid-migration and lost my accumulated project context — is that expected?**
Yes — there's no direct import path between the two tools' rule/context systems; this needs to be manually re-established in a `CLAUDE.md`.

**41. Should I hire a specialist team for a large-scale AI-assisted code migration, or handle it in-house?**
This depends on your team's existing experience with agentic coding workflows — the six-stage process is documented and reproducible, but teams without prior experience running it may benefit from specialist guidance, especially for a large, business-critical migration.

**42. What does an AI-assisted codebase migration typically cost?**
Costs vary too widely by codebase size, language pair, and team composition to state a single verified figure — evidence not sufficiently verified; the documented timelines (weeks for large-scale ports, a day for narrower version upgrades) are a better planning input than any generic cost figure.

**43. Is it worth paying for enterprise Claude Code support for a large migration project?**
For a business-critical, large-scale migration, the documented value of structured process and reasoning-transparent planning (as shown in the comparative agent test) suggests investing in getting the setup right matters more than which specific support tier you're on — evaluate based on your team's needs rather than a generic recommendation.

**44. Should a startup attempt a full language port in-house, or bring in outside help?**
This depends on team size and in-house agentic-coding experience — the documented process is reproducible without specialized tools beyond the coding agents themselves, but a team without prior migration experience may move faster with outside guidance on the rulebook and staging approach specifically.

**45. How much engineering time should I budget for a large-scale AI-assisted migration?**
This varies enormously by codebase size and complexity — the documented examples range from about a day (narrow version upgrades) to about 11 days (a several-hundred-thousand-line full language port) with a dedicated team, plus additional time for post-merge validation and regression fixing.

**46. What's the ROI of migrating a legacy codebase with AI agents versus staying on the current stack?**
This depends entirely on your specific drivers and codebase — the Bun example shows concrete gains (smaller binary, lower memory, much faster compile times in the TypeScript example) were realized, but ROI depends on whether your specific pain points match what the target language/version actually improves.

**47. Should I use AI agents for a migration if my codebase is poorly documented or structured?**
Documented experience suggests making code "AI-readable" (clear structure, documentation, boundaries) first is often a bigger barrier than the AI tooling itself — investing in that groundwork before migration will likely pay off regardless of which agent or approach you use.

**48. Is it better to migrate everything at once or in stages with AI agents?**
Staged, rulebook-driven decomposition consistently outperforms one-shot migration in the documented evidence, and outperforms naive chunking without full-system context as well — the key differentiator is having an explicit rulebook guiding the staged approach.

**49. What's the biggest risk teams underestimate when planning an AI-assisted migration?**
Underestimating the need for post-merge validation — even a fully passing pre-merge test suite (as in the Bun case) doesn't guarantee zero regressions after deployment.

**50. What's the single most important first step before starting an AI-assisted codebase migration?**
Build the translation rulebook first — documenting what can and can't be automatically translated, plus known edge cases — and stress-test it on a small sample before scaling to the full migration.

## Key takeaways

- One-shot migration of an entire codebase reliably fails due to context loss; the documented fix is a staged, rulebook-driven process, not a single larger attempt or naive chunking.
- The Bun migration (Zig to Rust, roughly 500,000-960,000 lines depending on the source, about 11 days) is the strongest available real-world evidence, and it still saw 19 post-merge regressions despite a passing pre-merge test suite — full automation without human validation isn't yet reliable, and the migration's overall quality was itself publicly disputed by Zig's creator.
- Version upgrades (same language, newer version) are a substantially smaller undertaking than full language ports — completable in as little as a day versus multiple weeks with a dedicated team.
- Structured instructions via a project rules file (like `CLAUDE.md`) consistently outperform ad hoc, per-session prompting for migration work.
- Hallucinated or stale interface references are a real, documented risk, especially in monorepos — verify agent-generated code against the actual current codebase rather than trusting syntactic plausibility.

## Relevant tools.scult.in resources

If you're managing structured config, API payloads, or data files as part of a migration project, the [JSON Formatter & Validator](/dev/json-formatter) on tools.scult.in is a fast way to catch malformed structures during the process. For structuring migration-related prompts and rulebooks, see the [Claude](/prompts/claude) and [Cursor](/prompts/cursor) prompt libraries on tools.scult.in.

If you're planning a migration on the scale described in this article and want the rulebook, staging, and validation work handled by a team with hands-on experience running exactly this kind of project, that's the core of what SCULT's [custom software development](https://scult.in/services/custom-software-development) service does — worth a conversation before committing engineering time to a one-shot approach that the evidence above suggests is likely to fail.

## Sources

- https://claude.com/blog/ai-code-migration
- https://www.remio.ai/post/anthropic-claude-code-migration-took-bun-from-zig-to-rust-in-two-weeks-but-speed-wasn-t-the-hard-pa
- https://www.theregister.com/devops/2026/07/14/zig-creator-calls-buns-claude-rust-rewrite-unreviewed-slop/5270743
- https://www.200oksolutions.com/blog/5-ai-coding-agents-tested-on-legacy-codebase/
- https://ainativecompass.substack.com/p/migrating-legacy-code-with-ai-yes
- https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window
- https://www.memorylake.ai/en/blogs/migrate-cursor-to-claude-code
- https://rejoicehub.com/blogs/ai-code-migration-claude-code-playbook
