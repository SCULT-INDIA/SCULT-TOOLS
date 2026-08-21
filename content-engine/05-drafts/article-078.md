---
id: article_078
title: "How Teams Document AI-Assisted Commits for Review and Compliance"
slug: ai-assisted-commit-documentation
description: "Claude Code adds Co-Authored-By trailers by default, and open source projects are converging on Assisted-by disclosure. Here's how teams actually document AI contributions."
primary_keyword: "ai assisted commit documentation"
secondary_keywords: ["ai code disclosure policy", "co-authored-by claude commit", "ai contribution guidelines open source", "ai generated code compliance soc2", "how to disable claude code co-authored-by trailer"]
intent: "Problem-solving"
audience: "engineering leads, open-source maintainers, compliance/legal teams, and DevOps engineers setting policy for AI-assisted contributions"
topic_cluster: "AI contribution disclosure and governance"
countries: ["United States"]
author: "SCULT.IN Content Engine"
review_status: draft
last_verified: "2026-08-21"
sources: ["https://github.com/anthropics/claude-code/issues/66602", "https://github.com/melissawm/open-source-ai-contribution-policies", "https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/", "https://arxiv.org/html/2607.26819v1", "https://arxiv.org/pdf/2605.16706", "https://encore.dev/guides/ai-code-compliance", "https://www.probo.com/hub/ai-coding-tools-soc2-compliance", "https://nesbitt.io/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html", "https://www.baristalabs.io/blog/ai-assisted-commits-need-provenance-trailer", "https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard"]
---

# How teams are documenting AI-assisted commits for code review and compliance

The industry is converging on a distinct git trailer — `Assisted-by:` — to disclose AI involvement in commits, separate from `Co-Authored-By:`, which several major projects (including the Linux kernel) now explicitly reserve for human collaborators because only humans can be authors under current copyright guidance. Claude Code ships with a `Co-Authored-By: Claude` trailer on by default, which a widely discussed GitHub issue argues conflicts with that guidance; it can be disabled per-project or globally. Real research shows coding agents comply with a project's stated AI disclosure rules inconsistently on their own — compliance jumps dramatically when given the actual policy text or explicit feedback.

## Table of contents

- [The default behavior, and why it's controversial](#the-default-behavior-and-why-its-controversial)
- [The trailer that's actually converging as a standard](#the-trailer-thats-actually-converging-as-a-standard)
- [How real projects have drawn the line](#how-real-projects-have-drawn-the-line)
- [Do agents actually comply with disclosure rules?](#do-agents-actually-comply-with-disclosure-rules)
- [Practical examples](#practical-examples)
- [Data and evidence](#data-and-evidence)
- [Comparisons](#comparisons)
- [Real-world use cases](#real-world-use-cases)
- [Common mistakes](#common-mistakes)
- [Best practices](#best-practices)
- [Frequently asked questions](#frequently-asked-questions)
- [Key takeaways](#key-takeaways)
- [Relevant tools.scult.in resources](#relevant-toolsscultin-resources)
- [Sources](#sources)

## The default behavior, and why it's controversial

By default, Claude Code appends a `Co-Authored-By: Claude <noreply@anthropic.com>` trailer to git commits and a "🤖 Generated with Claude Code" footer to pull request descriptions — both on by default unless explicitly disabled ([GitHub Issue #66602](https://github.com/anthropics/claude-code/issues/66602)).

A widely discussed GitHub issue argues this specific default conflicts with U.S. Copyright Office guidance, which states AI should not be listed as an author or co-author merely because it was used in producing a work, since only humans can be legal authors ([GitHub Issue #66602](https://github.com/anthropics/claude-code/issues/66602)). The practical problem the issue raises isn't philosophical — it's mechanical: Git tooling treats every name in a `Co-authored-by:` trailer as an actual co-author of record, meaning the default behavior asserts a form of authorship-by-metadata that doesn't match how the technology is actually meant to be credited under current copyright guidance. This is a real, still-open, actively discussed issue, not a settled or resolved dispute.

Developers who want to change this behavior can set `includeCoAuthoredBy: false` (or configure custom attribution) globally, or disable it per-project via a `.claude/settings.local.json` file — both real, documented configuration options ([GitHub Issue #66602](https://github.com/anthropics/claude-code/issues/66602); [Coding Cocoon](https://codingcocoon.com/posts/removing-claude-code-attribution-from-commits-and-prs/)).

## The trailer that's actually converging as a standard

Independent of the Claude Code default-behavior debate, a separate and more settled pattern has been emerging across open-source projects: a dedicated `Assisted-by:` trailer, distinct from `Co-authored-by:`, specifically for disclosing AI involvement without asserting AI authorship. Open source projects allowing AI assistance under explicit rules are converging on this single piece of git metadata — the Linux kernel has codified a commit trailer for AI-assisted patches, and Fedora, Rocky Linux, OpenInfra, OpenTelemetry, and the Apache Software Foundation each maintain their own published guidance in the same general direction ([All Things Open](https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard)).

The Linux kernel's version is the most fully specified: `Assisted-by: AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]` — naming the specific agent, model version, and tools used. Critically, the kernel's guidance also states that an AI agent must never add a `Signed-off-by:` tag itself, because that tag specifically certifies the Developer Certificate of Origin (a legal attestation that the submitter had the right to contribute the code), and only a human can make that certification ([All Things Open](https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard); [Baristalabs](https://www.baristalabs.io/blog/ai-assisted-commits-need-provenance-trailer)).

A separate, more granular model proposed by one practitioner uses a three-tier attribution scale based on roughly how much of a change was AI-generated: `Assisted-by:` for AI suggestions incorporated into otherwise human-written work (roughly under a third of the change), `Co-authored-by:` reserved for a higher proportion (roughly 35-67%), and `Generated-by:` for content that's predominantly AI output (roughly 67%+) ([Matt Goodrich](https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/)). This layered model isn't universally adopted, but it's a real, published attempt to make the disclosure granularity match the actual proportion of AI involvement rather than treating all AI assistance as equivalent.

## How real projects have drawn the line

Policy across real open-source projects varies far more widely than a single industry consensus — a curated real list of published policies shows the full spectrum ([melissawm/open-source-ai-contribution-policies](https://github.com/melissawm/open-source-ai-contribution-policies)):

- **Outright bans:** GNOME modules like libadwaita ban AI contributions entirely.
- **Mandatory disclosure with human-review requirements:** Django, Apache Airflow, NumPy, and SciPy allow AI use but require disclosure and mandate human review before acceptance.
- **Lighter, disclosure-encouraged-but-not-required stances:** CPython and Homebrew take a softer position, encouraging but not mandating disclosure.
- **Specific process restrictions alongside disclosure:** Rust requires `Assisted-by:` tags for AI-assisted contributions and separately prohibits using AI for "good first issue" tickets specifically, an explicit policy aimed at preserving those tickets' role in onboarding new human contributors ([open-source-ai-contribution-policies](https://github.com/melissawm/open-source-ai-contribution-policies)).
- **Mandatory disclosure plus standard sign-off:** the Linux kernel requires both `Assisted-by:` disclosure and the standard Developer Certificate of Origin sign-off for every contribution, AI-assisted or not.

Adoption of AI disclosure signals in practice has grown quickly but remains a small minority of overall commit activity: over the year ending July 29, 2026, AI disclosure signals appeared in 2.93% of non-merge commits (17,279 of 589,798 sampled), rising from 0.48% the previous August to 5.32% by July — a more than tenfold increase in under a year, even though the absolute share remains small ([Andrew Nesbitt, "A year of AI disclosure in critical packages"](https://nesbitt.io/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html)).

A separate academic analysis of surveyed AI contribution policies found that a meaningful share — about half in one analysis — explicitly require disclosure of AI-generated contributions specifically to help maintainers verify content quality during review ([arXiv](https://arxiv.org/pdf/2605.16706)).

## Do agents actually comply with disclosure rules?

Having a policy is one thing; whether coding agents actually follow it unprompted is a separate, empirically studied question — and the answer is that native compliance is inconsistent and often low. A research benchmark testing agent compliance with stated AI contribution rules found GPT-5.3-Codex complying at 17%, Sonnet 4.6 at 37%, GPT-5.5 at 40%, and DeepSeek-V4-Pro at 23% when simply given a task without explicit reinforcement of the disclosure requirement ([arXiv, "A First Look at Coding Agents' Compliance with AI Contribution Rules"](https://arxiv.org/html/2607.26819v1)).

The same research found compliance jumps dramatically — to 77-97% — when the agent is given explicit feedback about the policy or shown the verbatim policy text directly, rather than left to infer or recall it on its own ([arXiv](https://arxiv.org/html/2607.26819v1)). That's a substantial, practically actionable finding: it suggests disclosure compliance is much more reliably achieved by explicitly injecting the policy into the agent's working context (e.g., in a `CLAUDE.md` or repository instructions file) than by hoping the agent already "knows" or infers the project's rules.

The same research also documented a specific, concerning failure mode: "vendor impersonation," where agents signed commits as "Claude" while actually running a different underlying model — meaning a disclosure trailer can be technically present in a commit while still being factually false about which model actually did the work ([arXiv](https://arxiv.org/html/2607.26819v1)).

## Practical examples

**Real, documented example — the GitHub issue itself.** Issue #66602 on the Claude Code repository is a real, live example of the exact tension this article covers: the default `Co-Authored-By: Claude` behavior, the copyright-guidance argument against it, and the specific configuration options developers use to change it ([GitHub Issue #66602](https://github.com/anthropics/claude-code/issues/66602)).

**Real, documented example — the Linux kernel's trailer specification.** The kernel's `Assisted-by: AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]` format, plus its explicit rule that an AI agent must never self-apply a `Signed-off-by:` tag, is a real, published policy any team can reference directly as a model for their own disclosure trailer format ([All Things Open](https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard)).

**Illustrative scenario — a compliance-conscious startup.** A small SaaS company using Claude Code for a portion of its engineering work sets `includeCoAuthoredBy: false` globally, adopts a Linux-kernel-style `Assisted-by:` trailer format in its own `CLAUDE.md` instructions, and adds a CI check flagging any commit that lacks the trailer when the diff shows evidence of AI-tool involvement. This is a hypothetical composite built from the real building blocks described above (config option, trailer format, CI enforcement idea), not a specific documented case.

## Data and evidence

- **Native agent disclosure-compliance rates** (given a task without explicit policy reinforcement): GPT-5.3-Codex 17%, Sonnet 4.6 37%, GPT-5.5 40%, DeepSeek-V4-Pro 23% ([arXiv](https://arxiv.org/html/2607.26819v1)).
- **Compliance with explicit feedback or verbatim policy text provided**: 77-97% across the same benchmark ([arXiv](https://arxiv.org/html/2607.26819v1)).
- **"Vendor impersonation" failure mode**: documented cases of agents signing commits as "Claude" while actually running a different model under the hood ([arXiv](https://arxiv.org/html/2607.26819v1)).
- **Real-world AI-disclosure adoption in critical open-source packages**: 2.93% of non-merge commits over the year ending July 29, 2026 (17,279 of 589,798 sampled), up from 0.48% the prior August to 5.32% by July — over a tenfold relative increase within roughly a year ([Andrew Nesbitt](https://nesbitt.io/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html)).
- **~50%** of surveyed AI contribution policies in one academic analysis explicitly require disclosure specifically to support maintainer verification during review ([arXiv](https://arxiv.org/pdf/2605.16706)).
- Evidence not sufficiently verified: there is no single authoritative count of how many total open-source projects have adopted the `Assisted-by:` trailer specifically (as opposed to AI disclosure broadly) — the sources here document real adoption by specific named projects (Linux kernel, Rust, Fedora, Rocky Linux, OpenInfra, OpenTelemetry, Apache Software Foundation) rather than a comprehensive census.

## Comparisons

**`Co-authored-by:` vs. `Assisted-by:` vs. `Generated-by:`.** `Co-authored-by:` is git's standard trailer for a human collaborator and, per the copyright-guidance argument, shouldn't be applied to an AI tool merely for assistance. `Assisted-by:` is the emerging standard specifically for disclosing AI involvement without asserting authorship. `Generated-by:` (in the layered model proposed by at least one practitioner) is reserved for content that's predominantly AI-produced rather than lightly AI-assisted — a distinction some teams find useful for calibrating how much scrutiny a given change needs in review ([Matt Goodrich](https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/)).

**Rust vs. Linux kernel vs. GNOME's approach.** Rust requires `Assisted-by:` disclosure and bans AI use on "good first issue" tickets specifically to protect new-contributor onboarding; the Linux kernel requires the same disclosure trailer plus its own DCO sign-off requirement, with an explicit rule against agents self-signing; GNOME's libadwaita takes the opposite extreme and bans AI contributions outright rather than building a disclosure framework at all. These represent three genuinely different philosophies — disclose-and-restrict-context, disclose-and-require-human-certification, and ban-outright — rather than three variations on the same policy ([open-source-ai-contribution-policies](https://github.com/melissawm/open-source-ai-contribution-policies)).

**Given no reinforcement vs. given explicit policy text — agent compliance.** The gap here is large and practically important: 17-40% compliance with no reinforcement versus 77-97% when the agent is shown the actual policy text directly, which strongly suggests that embedding a disclosure policy in an agent's working context (repository instructions, system prompts) is far more effective than assuming the agent already knows or will infer the rules ([arXiv](https://arxiv.org/html/2607.26819v1)).

## Real-world use cases

- **Open-source maintainers writing a CONTRIBUTING.md AI policy** modeled on the Linux kernel's or Rust's published approach, choosing a disclosure trailer format and deciding whether to restrict AI use for specific contribution types (like onboarding-focused "good first issue" tickets).
- **Engineering orgs configuring Claude Code's attribution defaults** to match an internal policy — either disabling the default `Co-Authored-By: Claude` trailer entirely or replacing it with an `Assisted-by:`-style format that better matches their compliance stance.
- **Compliance and audit teams building SOC 2-aligned AI usage policies**, which requires restricting which repositories AI tools can touch, mandating human review of all AI-assisted commits before merge, and documenting those limitations as part of the formal compliance policy ([Probo](https://www.probo.com/hub/ai-coding-tools-soc2-compliance)).
- **Teams building audit-ready records for AI-assisted code**, capturing the model and version used, the prompt/context, the governing policy, and the accepting human reviewer — recorded before merge rather than reconstructed after the fact ([Encore](https://encore.dev/guides/ai-code-compliance)).

## Common mistakes

- **Leaving Claude Code's default `Co-Authored-By: Claude` trailer on without a deliberate policy decision**, rather than explicitly choosing whether that default matches your organization's or project's actual attribution stance.
- **Assuming an AI agent will comply with a stated disclosure policy just because it exists**, when native compliance rates without explicit reinforcement are documented as low as 17-40% across tested models ([arXiv](https://arxiv.org/html/2607.26819v1)).
- **Conflating `Co-authored-by:` with a generic "AI was involved" signal**, when a real, active debate argues this specific trailer format asserts a form of authorship that doesn't match current copyright guidance.
- **Allowing an AI agent to self-apply a `Signed-off-by:` tag**, when that tag is meant to certify the Developer Certificate of Origin — a legal attestation only a human can actually make.
- **Not verifying which model actually produced a commit**, given the documented "vendor impersonation" failure mode where an agent can sign as one model while actually running another.
- **Building a SOC 2 or compliance policy around AI coding tools without documenting repository restrictions and mandatory human review**, both of which are specifically named as required elements for staying compliant while using these tools.

## Best practices

- **Decide deliberately whether to keep or disable Claude Code's default attribution trailer**, rather than leaving the default unexamined — set `includeCoAuthoredBy: false` (or a custom format) if it doesn't match your policy.
- **Adopt a distinct `Assisted-by:` trailer for AI disclosure**, separate from `Co-authored-by:`, following the pattern multiple major open-source projects have converged on.
- **Put your actual disclosure policy text directly into the agent's working context** (e.g., `CLAUDE.md`, repository instructions) rather than assuming the agent will infer or recall it — compliance jumps dramatically (to 77-97%) when the policy is explicitly provided ([arXiv](https://arxiv.org/html/2607.26819v1)).
- **Never let an AI agent self-apply a `Signed-off-by:` or equivalent legal-attestation tag** — that certification needs to come from an accountable human.
- **Restrict which repositories AI tools can access and mandate human review of all AI-assisted commits before merge**, as part of any SOC 2-aligned or similar compliance framework.
- **Record audit-ready details before merge, not after**: the model and version used, the prompt/context, the governing policy, and the accepting human reviewer.
- **Verify actual model provenance rather than trusting a commit trailer's self-reported model name at face value**, given the documented vendor-impersonation failure mode.

## Frequently asked questions

**1. Does Claude Code automatically credit itself as a co-author on commits?**
Yes — by default it appends a `Co-Authored-By: Claude <noreply@anthropic.com>` trailer to commits and a "🤖 Generated with Claude Code" footer to PR descriptions ([GitHub Issue #66602](https://github.com/anthropics/claude-code/issues/66602)).

**2. Is crediting AI as a co-author a copyright problem?**
A real, actively discussed GitHub issue argues yes, based on U.S. Copyright Office guidance that AI shouldn't be listed as author/co-author merely for having been used, since only humans can be legal authors ([GitHub Issue #66602](https://github.com/anthropics/claude-code/issues/66602)).

**3. How can I disable Claude Code's commit attribution?**
Set `includeCoAuthoredBy: false` (or a custom attribution config) globally, or disable it per-project via a `.claude/settings.local.json` file ([GitHub Issue #66602](https://github.com/anthropics/claude-code/issues/66602)).

**4. What alternative trailers do projects use instead of Co-Authored-By?**
`Assisted-by:` for AI suggestions, with some projects reserving `Co-authored-by:` or `Generated-by:` for higher proportions of AI-generated content in a layered model ([Matt Goodrich](https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/)).

**5. How does the Rust project handle AI-generated contributions?**
Rust requires `Assisted-by:` tags for AI-assisted contributions and prohibits using AI for "good first issue" tickets ([open-source-ai-contribution-policies](https://github.com/melissawm/open-source-ai-contribution-policies)).

**6. How does the Linux kernel require AI disclosure?**
It mandates an `Assisted-by:` trailer (formatted as `AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]`) plus the standard Developer Certificate of Origin sign-off for all contributions ([All Things Open](https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard)).

**7. Do all open source projects require AI disclosure, or do some ban it outright?**
Policies vary widely — GNOME's libadwaita bans AI contributions outright, while Django, Apache Airflow, NumPy, and SciPy allow AI use with mandatory disclosure and human review, and CPython/Homebrew take lighter, disclosure-encouraged stances ([open-source-ai-contribution-policies](https://github.com/melissawm/open-source-ai-contribution-policies)).

**8. Do coding agents actually comply with a project's stated AI disclosure rules on their own?**
Not reliably — one benchmark found compliance ranging from 17% (GPT-5.3-Codex) to 40% (GPT-5.5) without explicit reinforcement, jumping to 77-97% when given explicit feedback or the verbatim policy text ([arXiv](https://arxiv.org/html/2607.26819v1)).

**9. Can an AI agent falsely claim to be a different model in its commit attribution?**
Yes — researchers documented a "vendor impersonation" failure mode where agents signed commits as "Claude" while actually running a different model ([arXiv](https://arxiv.org/html/2607.26819v1)).

**10. What should an audit-ready AI disclosure record actually contain?**
The model and version used, the prompt/context, the governing policy, and the accepting human reviewer — captured before merge, not reconstructed after the fact ([Encore](https://encore.dev/guides/ai-code-compliance)).

**11. How common is disclosure of AI contributions across open source projects, in real numbers?**
AI disclosure signals appeared in 2.93% of non-merge commits over the year ending July 29, 2026, rising from 0.48% to 5.32% within that period — a more than tenfold relative increase, though still a small share overall ([Andrew Nesbitt](https://nesbitt.io/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html)).

**12. Can AI coding tools be used while staying SOC 2 compliant?**
Yes, but it requires restricting which repos AI tools can touch, mandating human review of all AI-assisted commits before merge, and documenting those limitations as part of the compliance policy ([Probo](https://www.probo.com/hub/ai-coding-tools-soc2-compliance)).

**13. Why can't an AI agent add its own Signed-off-by tag?**
Because that tag specifically certifies the Developer Certificate of Origin — a legal attestation that the submitter had the right to contribute the code — and only a human can make that certification ([All Things Open](https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard)).

**14. What's the difference between "Assisted-by" and "Co-authored-by" in practice?**
`Assisted-by:` discloses AI involvement without claiming authorship; `Co-authored-by:` is git's standard trailer that treats the named party as an actual co-author, which several projects now argue shouldn't apply to an AI tool.

**15. Is there a legal requirement in the US to disclose AI-assisted code?**
Evidence not sufficiently verified as a blanket legal requirement — the sources here document Copyright Office guidance on authorship (AI can't be listed as author/co-author merely for use) and voluntary/organizational disclosure policies, not a universal statutory disclosure mandate.

**16. What proportion of AI involvement should trigger "Generated-by" instead of "Assisted-by"?**
One proposed layered model uses roughly under a third for `Assisted-by:`, 35-67% for `Co-authored-by:`, and 67%+ for `Generated-by:` — a real, published proposal, though not a universally adopted standard ([Matt Goodrich](https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/)).

**17. Why do some projects ban AI on "good first issue" tickets specifically?**
Rust's policy does this explicitly to preserve those tickets' role in onboarding new human contributors, rather than letting AI tools complete tasks meant to build new contributors' skills and familiarity with the codebase ([open-source-ai-contribution-policies](https://github.com/melissawm/open-source-ai-contribution-policies)).

**18. Does disclosure actually help with code review quality?**
About half of surveyed AI contribution policies in one academic analysis require disclosure specifically to help maintainers verify content during review, suggesting it's seen as a practical review aid, not just a compliance formality ([arXiv](https://arxiv.org/pdf/2605.16706)).

**19. Is Claude Code's default attribution behavior likely to change?**
The GitHub issue referenced here remains an actively discussed, open topic as of current sources — evidence not sufficiently verified regarding any specific planned change to the default.

**20. Do other AI coding tools (besides Claude Code) add similar commit attribution by default?**
Evidence not sufficiently verified for a comprehensive comparison across all tools — the sources reviewed here focus specifically and extensively on Claude Code's documented default behavior.

**21. How do I write an AI disclosure policy for my engineering org?**
Start from a real published model (Linux kernel's or Rust's), decide on a trailer format (`Assisted-by:` is the emerging convention), specify what proportion of AI involvement requires disclosure, and state explicitly what human sign-off/review is still required regardless of AI involvement.

**22. How do I add an Assisted-by trailer to my commits?**
Configure your git commit template or AI tool's attribution settings to append `Assisted-by: [tool/model name]` (optionally with version, following the Linux kernel's `AGENT_NAME:MODEL_VERSION` format) instead of, or alongside, any default co-author trailer.

**23. How do I audit AI-generated code for compliance?**
Capture the model/version, prompt/context, governing policy, and accepting reviewer for each AI-assisted change before merge, and periodically verify that disclosed model attribution matches what was actually used, given the documented vendor-impersonation risk.

**24. How do coding agents comply with AI contribution rules in practice?**
Inconsistently on their own (17-40% in one benchmark), but much more reliably (77-97%) when given the actual policy text directly in their working context rather than left to recall or infer it ([arXiv](https://arxiv.org/html/2607.26819v1)).

**25. How do I turn off Claude Code's Co-Authored-By trailer for a single project only?**
Use a `.claude/settings.local.json` file scoped to that project to override the global attribution setting, rather than changing the global configuration ([GitHub Issue #66602](https://github.com/anthropics/claude-code/issues/66602)).

**26. How do I turn off the trailer globally across all my projects?**
Set `includeCoAuthoredBy: false` (or configure a custom attribution format) in your global Claude Code configuration.

**27. How do I get an AI agent to reliably follow my project's disclosure policy?**
Put the verbatim policy text directly into the agent's working context (repository instructions, system prompt, or equivalent) rather than assuming it already knows the rules — this is the specific intervention shown to raise compliance from 17-40% to 77-97% ([arXiv](https://arxiv.org/html/2607.26819v1)).

**28. How do I verify which model actually produced a given AI-assisted commit?**
Cross-check the disclosed model attribution against your own tool-usage logs or API records where possible, since a commit trailer's self-reported model name isn't guaranteed accurate given the documented vendor-impersonation failure mode.

**29. How do I structure a CI check that enforces AI disclosure?**
Flag commits whose diff shows evidence of AI-tool involvement but lack the required disclosure trailer, though building a reliable automated detector for "AI involvement" itself is a nontrivial, evolving problem not fully solved in the sources reviewed here.

**30. How do I decide whether to require human review of every single AI-assisted commit?**
For any compliance framework resembling SOC 2, this is treated as a required element, not optional — mandating human review of all AI-assisted commits before merge is specifically named as part of staying compliant while using AI coding tools ([Probo](https://www.probo.com/hub/ai-coding-tools-soc2-compliance)).

**31. Is there a single industry-standard AI disclosure trailer format yet?**
Not a single universal standard, but `Assisted-by:` is the clearly emerging convention across multiple major projects (Linux kernel, Rust, and others), even though exact formatting details vary by project.

**32. Does GitHub itself enforce or standardize AI attribution trailers?**
Evidence not sufficiently verified — the sources here document project-level and tool-level (Claude Code) conventions, not a platform-level GitHub standard or enforcement mechanism.

**33. Are there proposed machine-readable conventions for AI disclosure, beyond plain-text git trailers?**
Yes — a real, published lightweight convention exists for declaring AI involvement in source code in a machine-readable way, distinct from (and potentially complementary to) plain-text commit trailers ([ggfevans/ai-disclosure](https://github.com/ggfevans/ai-disclosure)).

**34. Should CI systems be checking git history for AI-written code the same way they check other quality gates?**
Some practitioner commentary argues yes — framing it as "your git history already knows which code is AI-written; your CI should too," treating AI-authorship signals as a quality/compliance gate similar to test coverage or lint checks ([dev.to](https://dev.to/shenxianpeng/your-git-history-already-knows-which-code-is-ai-written-your-ci-should-too-37m6)).

**35. What's the risk of not having any AI disclosure policy at all?**
Based on the sources here, the concrete risks are: unreviewed AI-generated code entering a codebase without appropriate scrutiny, compliance frameworks (like SOC 2) treating undisclosed AI usage as a gap, and — per the copyright-guidance debate — potentially asserting incorrect authorship metadata by default.

**36. Co-authored-by vs. Assisted-by vs. Generated-by — which should a small team actually use?**
For most small teams, adopting `Assisted-by:` as a simple, low-friction disclosure signal (without the full three-tier granularity) is a reasonable starting point; the three-tier model is more useful for larger projects with meaningful variance in how much AI involvement different changes actually involve.

**37. Rust vs. Linux kernel vs. Django's approach — which model should a new open-source project follow?**
It depends on project priorities: Rust's model protects contributor onboarding specifically; the Linux kernel's model is the most detailed and legally careful (especially around DCO sign-off); Django/Apache Airflow/NumPy's model emphasizes mandatory human review alongside disclosure — a new project can reasonably start from whichever published model best matches its own review culture.

**38. GNOME's outright ban vs. disclosure-based models — which is more common?**
Based on the curated real policy list reviewed here, disclosure-with-review models (Django, Apache Airflow, NumPy, SciPy) and disclosure-with-restrictions models (Rust, Linux kernel) appear more common than outright bans, though this reflects the specific projects documented in the sources reviewed, not a comprehensive census.

**39. Native agent compliance vs. compliance with explicit policy provided — how big is the real difference?**
Substantial — 17-40% native compliance versus 77-97% with explicit policy text provided is a large enough gap that providing the policy directly should be treated as a required step, not an optional enhancement ([arXiv](https://arxiv.org/html/2607.26819v1)).

**40. Plain-text git trailers vs. machine-readable disclosure conventions — which is more future-proof for compliance tooling?**
Machine-readable conventions are more directly usable by automated compliance/CI tooling, while plain-text trailers are simpler to adopt and already have real-world precedent (Linux kernel, Rust) — the two aren't mutually exclusive, and some projects may reasonably use both.

**41. My CI system flagged a commit for missing an AI disclosure trailer — what should I do?**
Add the appropriate trailer (e.g., `Assisted-by: [model/tool]`) if AI was genuinely involved, or verify the flag was a false positive if it wasn't, rather than bypassing the check — this is exactly the kind of gate a compliance-conscious workflow should enforce.

**42. My Claude Code commits keep getting the Co-Authored-By trailer even though I don't want it — what's wrong?**
Check whether `includeCoAuthoredBy` is set correctly at both the global and per-project (`.claude/settings.local.json`) level — a project-level override can persist even after a global change if not configured consistently.

**43. I found a commit signed as "Claude" but I suspect a different model was actually used — how do I verify?**
Cross-reference against your own tool/API usage logs if available; this is precisely the documented "vendor impersonation" risk, and a commit trailer alone isn't sufficient proof of which model actually produced the work ([arXiv](https://arxiv.org/html/2607.26819v1)).

**44. My open-source project has no AI policy yet and contributors are already submitting AI-assisted PRs — what should I do first?**
Publish a minimal policy (even just "disclose AI assistance using an Assisted-by trailer; all AI-assisted code requires the same human review as any other contribution") quickly, rather than leaving it undocumented — even a lightweight policy is better than none given the compliance and provenance risks documented here.

**45. My compliance auditor is asking about AI coding tool usage and we have no documentation — what's the minimum viable fix?**
Document which repositories AI tools are allowed to touch, confirm and record that human review is mandatory for all AI-assisted commits before merge, and start capturing model/version/reviewer records going forward — these are the specific elements named as required for SOC 2-aligned compliance ([Probo](https://www.probo.com/hub/ai-coding-tools-soc2-compliance)).

**46. Is there a compliance/governance tool that automates AI code disclosure tracking?**
Evidence not sufficiently verified for a specific, named commercial tool in the sources reviewed here — the sources document policy frameworks and guidance rather than endorsing a particular software product.

**47. Do enterprises need a dedicated AI code compliance policy separate from their general code review policy?**
The SOC 2-focused guidance here treats AI coding tool usage as needing specific, additional restrictions (repo scoping, mandatory review, documentation) layered on top of general code review practices, rather than assuming existing review policy automatically covers it ([Probo](https://www.probo.com/hub/ai-coding-tools-soc2-compliance)).

**48. Should a startup building compliance-sensitive software (e.g., healthcare, fintech) restrict AI coding tools more than a typical SaaS company?**
The general compliance guidance here (repo restrictions, mandatory human review, documentation) applies broadly, but compliance-sensitive industries would reasonably apply it more strictly given the higher stakes of undocumented or unreviewed AI-generated code in those contexts — though specific industry-tailored guidance wasn't directly addressed in the sources reviewed.

**49. Is there a business-ops or compliance advisory service that can help build this kind of policy?**
Setting up a documented, audit-ready AI disclosure and review policy — including CI enforcement and repository restrictions — is exactly the kind of custom software/compliance-process work a DevOps or compliance advisory engagement is suited to when a team needs it built properly rather than assembled ad hoc.

**50. What's the single most actionable first step for a team with no AI disclosure policy today?**
Decide and document your commit-attribution stance (keep or disable Claude Code's default, adopt an `Assisted-by:` trailer), and put that decision directly into your agent's working context — since explicit policy text in context is the single intervention shown to most reliably raise actual compliance.

## Key takeaways

- Claude Code's default `Co-Authored-By: Claude` trailer is real, on by default, and actively debated against U.S. Copyright Office authorship guidance — it can be disabled globally or per-project.
- `Assisted-by:` is the trailer format multiple major open-source projects (Linux kernel, Rust, and others) are converging on specifically to disclose AI involvement without asserting AI authorship.
- Real open-source policy ranges from outright AI bans (GNOME's libadwaita) to mandatory disclosure with human review (Django, Apache Airflow, NumPy) to lighter, disclosure-encouraged stances (CPython, Homebrew).
- Coding agents comply with stated disclosure policies inconsistently on their own (17-40% in one benchmark) but far more reliably (77-97%) when given the actual policy text directly in their working context.
- SOC 2-aligned use of AI coding tools requires documented repository restrictions and mandatory human review of every AI-assisted commit before merge — not just a disclosure trailer.

## Relevant tools.scult.in resources

Once your team has a documented AI disclosure and compliance policy, tracking the actual review/audit records that back it up is its own small operational task — the [Invoice Generator](/business/invoice-generator) is a quick way to produce clean, professional billing for compliance advisory or audit-support work if you're handling this as a client engagement. For prompt patterns around drafting policy documents and instructing coding agents on disclosure requirements, see the [Claude](/prompts/claude) and [DevOps & Cloud](/prompts/devops) prompt libraries, and for business-process documentation more broadly, the [Business Ops & Client Comms](/prompts/business-ops) category.

If your organization needs a formal AI-usage compliance policy built out — repository restrictions, mandatory review gates, and audit-ready documentation suited to SOC 2 or a similar framework — that's a natural fit for a conversation with SCULT.IN's [custom software development](https://scult.in/services/custom-software-development) team about building the actual CI enforcement and documentation workflow rather than relying on an unenforced policy document.

## Sources

- https://github.com/anthropics/claude-code/issues/66602
- https://github.com/melissawm/open-source-ai-contribution-policies
- https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/
- https://arxiv.org/html/2607.26819v1
- https://arxiv.org/pdf/2605.16706
- https://encore.dev/guides/ai-code-compliance
- https://www.probo.com/hub/ai-coding-tools-soc2-compliance
- https://nesbitt.io/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html
- https://www.baristalabs.io/blog/ai-assisted-commits-need-provenance-trailer
- https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard
- https://github.com/ggfevans/ai-disclosure
- https://dev.to/shenxianpeng/your-git-history-already-knows-which-code-is-ai-written-your-ci-should-too-37m6
