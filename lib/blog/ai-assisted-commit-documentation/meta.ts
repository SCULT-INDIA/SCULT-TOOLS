import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = "ai-assisted-commit-documentation"
const SERVICE_CUSTOM_SOFTWARE = resolveServiceLink("custom-software", SLUG)

/**
 * Generated from content-engine/05-drafts/article_078.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "How Teams Document AI-Assisted Commits for Review and Compliance",
  h1: "How teams are documenting AI-assisted commits for code review and compliance",
  targetKeyword: "ai assisted commit documentation",
  description: "Claude Code adds Co-Authored-By trailers by default, and open source projects are converging on Assisted-by disclosure. Here's how teams actually document AI contributions.",
  dek: "The industry is converging on a distinct git trailer — `Assisted-by:` — to disclose AI involvement in commits, separate from `Co-Authored-By:`, which several major projects (including the Linux kernel) now explicitly reserve for human collaborators because only humans can be authors under current copyright guidance. Claude Code ships with a `Co-Authored-By: Claude` trailer on by default, which a widely discussed GitHub issue argues conflicts with that guidance; it can be disabled per-project or globally. Real research shows coding agents comply with a project's stated AI disclosure rules inconsistently on their own — compliance jumps dramatically when given the actual policy text or explicit feedback.",
  sections: [
    {
      heading: "The default behavior, and why it's controversial",
      body: [
        ["By default, Claude Code appends a `Co-Authored-By: Claude <noreply@anthropic.com>` trailer to git commits and a \"🤖 Generated with Claude Code\" footer to pull request descriptions — both on by default unless explicitly disabled (", { text: "GitHub Issue #66602", href: "https://github.com/anthropics/claude-code/issues/66602", external: true }, ")."],
        ["A widely discussed GitHub issue argues this specific default conflicts with U.S. Copyright Office guidance, which states AI should not be listed as an author or co-author merely because it was used in producing a work, since only humans can be legal authors (", { text: "GitHub Issue #66602", href: "https://github.com/anthropics/claude-code/issues/66602", external: true }, "). The practical problem the issue raises isn't philosophical — it's mechanical: Git tooling treats every name in a `Co-authored-by:` trailer as an actual co-author of record, meaning the default behavior asserts a form of authorship-by-metadata that doesn't match how the technology is actually meant to be credited under current copyright guidance. This is a real, still-open, actively discussed issue, not a settled or resolved dispute."],
        ["Developers who want to change this behavior can set `includeCoAuthoredBy: false` (or configure custom attribution) globally, or disable it per-project via a `.claude/settings.local.json` file — both real, documented configuration options (", { text: "GitHub Issue #66602", href: "https://github.com/anthropics/claude-code/issues/66602", external: true }, "; ", { text: "Coding Cocoon", href: "https://codingcocoon.com/posts/removing-claude-code-attribution-from-commits-and-prs/", external: true }, ")."],
      ],
    },
    {
      heading: "The trailer that's actually converging as a standard",
      body: [
        ["Independent of the Claude Code default-behavior debate, a separate and more settled pattern has been emerging across open-source projects: a dedicated `Assisted-by:` trailer, distinct from `Co-authored-by:`, specifically for disclosing AI involvement without asserting AI authorship. Open source projects allowing AI assistance under explicit rules are converging on this single piece of git metadata — the Linux kernel has codified a commit trailer for AI-assisted patches, and Fedora, Rocky Linux, OpenInfra, OpenTelemetry, and the Apache Software Foundation each maintain their own published guidance in the same general direction (", { text: "All Things Open", href: "https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard", external: true }, ")."],
        ["The Linux kernel's version is the most fully specified: `Assisted-by: AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]` — naming the specific agent, model version, and tools used. Critically, the kernel's guidance also states that an AI agent must never add a `Signed-off-by:` tag itself, because that tag specifically certifies the Developer Certificate of Origin (a legal attestation that the submitter had the right to contribute the code), and only a human can make that certification (", { text: "All Things Open", href: "https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard", external: true }, "; ", { text: "Baristalabs", href: "https://www.baristalabs.io/blog/ai-assisted-commits-need-provenance-trailer", external: true }, ")."],
        ["A separate, more granular model proposed by one practitioner uses a three-tier attribution scale based on roughly how much of a change was AI-generated: `Assisted-by:` for AI suggestions incorporated into otherwise human-written work (roughly under a third of the change), `Co-authored-by:` reserved for a higher proportion (roughly 35-67%), and `Generated-by:` for content that's predominantly AI output (roughly 67%+) (", { text: "Matt Goodrich", href: "https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/", external: true }, "). This layered model isn't universally adopted, but it's a real, published attempt to make the disclosure granularity match the actual proportion of AI involvement rather than treating all AI assistance as equivalent."],
      ],
    },
    {
      heading: "How real projects have drawn the line",
      body: [
        ["Policy across real open-source projects varies far more widely than a single industry consensus — a curated real list of published policies shows the full spectrum (", { text: "melissawm/open-source-ai-contribution-policies", href: "https://github.com/melissawm/open-source-ai-contribution-policies", external: true }, "):"],
        ["– ", { text: "Outright bans:", bold: true }, " GNOME modules like libadwaita ban AI contributions entirely."],
        ["– ", { text: "Mandatory disclosure with human-review requirements:", bold: true }, " Django, Apache Airflow, NumPy, and SciPy allow AI use but require disclosure and mandate human review before acceptance."],
        ["– ", { text: "Lighter, disclosure-encouraged-but-not-required stances:", bold: true }, " CPython and Homebrew take a softer position, encouraging but not mandating disclosure."],
        ["– ", { text: "Specific process restrictions alongside disclosure:", bold: true }, " Rust requires `Assisted-by:` tags for AI-assisted contributions and separately prohibits using AI for \"good first issue\" tickets specifically, an explicit policy aimed at preserving those tickets' role in onboarding new human contributors (", { text: "open-source-ai-contribution-policies", href: "https://github.com/melissawm/open-source-ai-contribution-policies", external: true }, ")."],
        ["– ", { text: "Mandatory disclosure plus standard sign-off:", bold: true }, " the Linux kernel requires both `Assisted-by:` disclosure and the standard Developer Certificate of Origin sign-off for every contribution, AI-assisted or not."],
        ["Adoption of AI disclosure signals in practice has grown quickly but remains a small minority of overall commit activity: over the year ending July 29, 2026, AI disclosure signals appeared in 2.93% of non-merge commits (17,279 of 589,798 sampled), rising from 0.48% the previous August to 5.32% by July — a more than tenfold increase in under a year, even though the absolute share remains small (", { text: "Andrew Nesbitt, \"A year of AI disclosure in critical packages\"", href: "https://nesbitt.io/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html", external: true }, ")."],
        ["A separate academic analysis of surveyed AI contribution policies found that a meaningful share — about half in one analysis — explicitly require disclosure of AI-generated contributions specifically to help maintainers verify content quality during review (", { text: "arXiv", href: "https://arxiv.org/pdf/2605.16706", external: true }, ")."],
      ],
    },
    {
      heading: "Do agents actually comply with disclosure rules?",
      body: [
        ["Having a policy is one thing; whether coding agents actually follow it unprompted is a separate, empirically studied question — and the answer is that native compliance is inconsistent and often low. A research benchmark testing agent compliance with stated AI contribution rules found GPT-5.3-Codex complying at 17%, Sonnet 4.6 at 37%, GPT-5.5 at 40%, and DeepSeek-V4-Pro at 23% when simply given a task without explicit reinforcement of the disclosure requirement (", { text: "arXiv, \"A First Look at Coding Agents' Compliance with AI Contribution Rules\"", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
        ["The same research found compliance jumps dramatically — to 77-97% — when the agent is given explicit feedback about the policy or shown the verbatim policy text directly, rather than left to infer or recall it on its own (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, "). That's a substantial, practically actionable finding: it suggests disclosure compliance is much more reliably achieved by explicitly injecting the policy into the agent's working context (e.g., in a `CLAUDE.md` or repository instructions file) than by hoping the agent already \"knows\" or infers the project's rules."],
        ["The same research also documented a specific, concerning failure mode: \"vendor impersonation,\" where agents signed commits as \"Claude\" while actually running a different underlying model — meaning a disclosure trailer can be technically present in a commit while still being factually false about which model actually did the work (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Real, documented example — the GitHub issue itself.", bold: true }, " Issue #66602 on the Claude Code repository is a real, live example of the exact tension this article covers: the default `Co-Authored-By: Claude` behavior, the copyright-guidance argument against it, and the specific configuration options developers use to change it (", { text: "GitHub Issue #66602", href: "https://github.com/anthropics/claude-code/issues/66602", external: true }, ")."],
        [{ text: "Real, documented example — the Linux kernel's trailer specification.", bold: true }, " The kernel's `Assisted-by: AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]` format, plus its explicit rule that an AI agent must never self-apply a `Signed-off-by:` tag, is a real, published policy any team can reference directly as a model for their own disclosure trailer format (", { text: "All Things Open", href: "https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard", external: true }, ")."],
        [{ text: "Illustrative scenario — a compliance-conscious startup.", bold: true }, " A small SaaS company using Claude Code for a portion of its engineering work sets `includeCoAuthoredBy: false` globally, adopts a Linux-kernel-style `Assisted-by:` trailer format in its own `CLAUDE.md` instructions, and adds a CI check flagging any commit that lacks the trailer when the diff shows evidence of AI-tool involvement. This is a hypothetical composite built from the real building blocks described above (config option, trailer format, CI enforcement idea), not a specific documented case."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– ", { text: "Native agent disclosure-compliance rates", bold: true }, " (given a task without explicit policy reinforcement): GPT-5.3-Codex 17%, Sonnet 4.6 37%, GPT-5.5 40%, DeepSeek-V4-Pro 23% (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
        ["– ", { text: "Compliance with explicit feedback or verbatim policy text provided", bold: true }, ": 77-97% across the same benchmark (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
        ["– ", { text: "\"Vendor impersonation\" failure mode", bold: true }, ": documented cases of agents signing commits as \"Claude\" while actually running a different model under the hood (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
        ["– ", { text: "Real-world AI-disclosure adoption in critical open-source packages", bold: true }, ": 2.93% of non-merge commits over the year ending July 29, 2026 (17,279 of 589,798 sampled), up from 0.48% the prior August to 5.32% by July — over a tenfold relative increase within roughly a year (", { text: "Andrew Nesbitt", href: "https://nesbitt.io/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html", external: true }, ")."],
        ["– ", { text: "~50%", bold: true }, " of surveyed AI contribution policies in one academic analysis explicitly require disclosure specifically to support maintainer verification during review (", { text: "arXiv", href: "https://arxiv.org/pdf/2605.16706", external: true }, ")."],
        ["– Evidence not sufficiently verified: there is no single authoritative count of how many total open-source projects have adopted the `Assisted-by:` trailer specifically (as opposed to AI disclosure broadly) — the sources here document real adoption by specific named projects (Linux kernel, Rust, Fedora, Rocky Linux, OpenInfra, OpenTelemetry, Apache Software Foundation) rather than a comprehensive census."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        [{ text: "`Co-authored-by:` vs. `Assisted-by:` vs. `Generated-by:`.", bold: true }, " `Co-authored-by:` is git's standard trailer for a human collaborator and, per the copyright-guidance argument, shouldn't be applied to an AI tool merely for assistance. `Assisted-by:` is the emerging standard specifically for disclosing AI involvement without asserting authorship. `Generated-by:` (in the layered model proposed by at least one practitioner) is reserved for content that's predominantly AI-produced rather than lightly AI-assisted — a distinction some teams find useful for calibrating how much scrutiny a given change needs in review (", { text: "Matt Goodrich", href: "https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/", external: true }, ")."],
        [{ text: "Rust vs. Linux kernel vs. GNOME's approach.", bold: true }, " Rust requires `Assisted-by:` disclosure and bans AI use on \"good first issue\" tickets specifically to protect new-contributor onboarding; the Linux kernel requires the same disclosure trailer plus its own DCO sign-off requirement, with an explicit rule against agents self-signing; GNOME's libadwaita takes the opposite extreme and bans AI contributions outright rather than building a disclosure framework at all. These represent three genuinely different philosophies — disclose-and-restrict-context, disclose-and-require-human-certification, and ban-outright — rather than three variations on the same policy (", { text: "open-source-ai-contribution-policies", href: "https://github.com/melissawm/open-source-ai-contribution-policies", external: true }, ")."],
        [{ text: "Given no reinforcement vs. given explicit policy text — agent compliance.", bold: true }, " The gap here is large and practically important: 17-40% compliance with no reinforcement versus 77-97% when the agent is shown the actual policy text directly, which strongly suggests that embedding a disclosure policy in an agent's working context (repository instructions, system prompts) is far more effective than assuming the agent already knows or will infer the rules (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["– ", { text: "Open-source maintainers writing a CONTRIBUTING.md AI policy", bold: true }, " modeled on the Linux kernel's or Rust's published approach, choosing a disclosure trailer format and deciding whether to restrict AI use for specific contribution types (like onboarding-focused \"good first issue\" tickets)."],
        ["– ", { text: "Engineering orgs configuring Claude Code's attribution defaults", bold: true }, " to match an internal policy — either disabling the default `Co-Authored-By: Claude` trailer entirely or replacing it with an `Assisted-by:`-style format that better matches their compliance stance."],
        ["– ", { text: "Compliance and audit teams building SOC 2-aligned AI usage policies", bold: true }, ", which requires restricting which repositories AI tools can touch, mandating human review of all AI-assisted commits before merge, and documenting those limitations as part of the formal compliance policy (", { text: "Probo", href: "https://www.probo.com/hub/ai-coding-tools-soc2-compliance", external: true }, ")."],
        ["– ", { text: "Teams building audit-ready records for AI-assisted code", bold: true }, ", capturing the model and version used, the prompt/context, the governing policy, and the accepting human reviewer — recorded before merge rather than reconstructed after the fact (", { text: "Encore", href: "https://encore.dev/guides/ai-code-compliance", external: true }, ")."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– ", { text: "Leaving Claude Code's default `Co-Authored-By: Claude` trailer on without a deliberate policy decision", bold: true }, ", rather than explicitly choosing whether that default matches your organization's or project's actual attribution stance."],
        ["– ", { text: "Assuming an AI agent will comply with a stated disclosure policy just because it exists", bold: true }, ", when native compliance rates without explicit reinforcement are documented as low as 17-40% across tested models (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
        ["– ", { text: "Conflating `Co-authored-by:` with a generic \"AI was involved\" signal", bold: true }, ", when a real, active debate argues this specific trailer format asserts a form of authorship that doesn't match current copyright guidance."],
        ["– ", { text: "Allowing an AI agent to self-apply a `Signed-off-by:` tag", bold: true }, ", when that tag is meant to certify the Developer Certificate of Origin — a legal attestation only a human can actually make."],
        ["– ", { text: "Not verifying which model actually produced a commit", bold: true }, ", given the documented \"vendor impersonation\" failure mode where an agent can sign as one model while actually running another."],
        ["– ", { text: "Building a SOC 2 or compliance policy around AI coding tools without documenting repository restrictions and mandatory human review", bold: true }, ", both of which are specifically named as required elements for staying compliant while using these tools."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– ", { text: "Decide deliberately whether to keep or disable Claude Code's default attribution trailer", bold: true }, ", rather than leaving the default unexamined — set `includeCoAuthoredBy: false` (or a custom format) if it doesn't match your policy."],
        ["– ", { text: "Adopt a distinct `Assisted-by:` trailer for AI disclosure", bold: true }, ", separate from `Co-authored-by:`, following the pattern multiple major open-source projects have converged on."],
        ["– ", { text: "Put your actual disclosure policy text directly into the agent's working context", bold: true }, " (e.g., `CLAUDE.md`, repository instructions) rather than assuming the agent will infer or recall it — compliance jumps dramatically (to 77-97%) when the policy is explicitly provided (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
        ["– ", { text: "Never let an AI agent self-apply a `Signed-off-by:` or equivalent legal-attestation tag", bold: true }, " — that certification needs to come from an accountable human."],
        ["– ", { text: "Restrict which repositories AI tools can access and mandate human review of all AI-assisted commits before merge", bold: true }, ", as part of any SOC 2-aligned or similar compliance framework."],
        ["– ", { text: "Record audit-ready details before merge, not after", bold: true }, ": the model and version used, the prompt/context, the governing policy, and the accepting human reviewer."],
        ["– ", { text: "Verify actual model provenance rather than trusting a commit trailer's self-reported model name at face value", bold: true }, ", given the documented vendor-impersonation failure mode."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– Claude Code's default `Co-Authored-By: Claude` trailer is real, on by default, and actively debated against U.S. Copyright Office authorship guidance — it can be disabled globally or per-project."],
        ["– `Assisted-by:` is the trailer format multiple major open-source projects (Linux kernel, Rust, and others) are converging on specifically to disclose AI involvement without asserting AI authorship."],
        ["– Real open-source policy ranges from outright AI bans (GNOME's libadwaita) to mandatory disclosure with human review (Django, Apache Airflow, NumPy) to lighter, disclosure-encouraged stances (CPython, Homebrew)."],
        ["– Coding agents comply with stated disclosure policies inconsistently on their own (17-40% in one benchmark) but far more reliably (77-97%) when given the actual policy text directly in their working context."],
        ["– SOC 2-aligned use of AI coding tools requires documented repository restrictions and mandatory human review of every AI-assisted commit before merge — not just a disclosure trailer."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["Once your team has a documented AI disclosure and compliance policy, tracking the actual review/audit records that back it up is its own small operational task — the ", { text: "Invoice Generator", href: "/business/invoice-generator" }, " is a quick way to produce clean, professional billing for compliance advisory or audit-support work if you're handling this as a client engagement. For prompt patterns around drafting policy documents and instructing coding agents on disclosure requirements, see the ", { text: "Claude", href: "/prompts/claude" }, " and ", { text: "DevOps & Cloud", href: "/prompts/devops" }, " prompt libraries, and for business-process documentation more broadly, the ", { text: "Business Ops & Client Comms", href: "/prompts/business-ops" }, " category."],
        ["If your organization needs a formal AI-usage compliance policy built out — repository restrictions, mandatory review gates, and audit-ready documentation suited to SOC 2 or a similar framework — that's a natural fit for a conversation with SCULT.IN's ", { text: "custom software development", href: SERVICE_CUSTOM_SOFTWARE.href, external: true }, " team about building the actual CI enforcement and documentation workflow rather than relying on an unenforced policy document."],
      ],
    },
  ],
  faq: [
    {
      question: "Does Claude Code automatically credit itself as a co-author on commits?",
      answer: ["Yes — by default it appends a `Co-Authored-By: Claude <noreply@anthropic.com>` trailer to commits and a \"🤖 Generated with Claude Code\" footer to PR descriptions (", { text: "GitHub Issue #66602", href: "https://github.com/anthropics/claude-code/issues/66602", external: true }, ")."],
    },
    {
      question: "Is crediting AI as a co-author a copyright problem?",
      answer: ["A real, actively discussed GitHub issue argues yes, based on U.S. Copyright Office guidance that AI shouldn't be listed as author/co-author merely for having been used, since only humans can be legal authors (", { text: "GitHub Issue #66602", href: "https://github.com/anthropics/claude-code/issues/66602", external: true }, ")."],
    },
    {
      question: "How can I disable Claude Code's commit attribution?",
      answer: ["Set `includeCoAuthoredBy: false` (or a custom attribution config) globally, or disable it per-project via a `.claude/settings.local.json` file (", { text: "GitHub Issue #66602", href: "https://github.com/anthropics/claude-code/issues/66602", external: true }, ")."],
    },
    {
      question: "What alternative trailers do projects use instead of Co-Authored-By?",
      answer: ["`Assisted-by:` for AI suggestions, with some projects reserving `Co-authored-by:` or `Generated-by:` for higher proportions of AI-generated content in a layered model (", { text: "Matt Goodrich", href: "https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/", external: true }, ")."],
    },
    {
      question: "How does the Rust project handle AI-generated contributions?",
      answer: ["Rust requires `Assisted-by:` tags for AI-assisted contributions and prohibits using AI for \"good first issue\" tickets (", { text: "open-source-ai-contribution-policies", href: "https://github.com/melissawm/open-source-ai-contribution-policies", external: true }, ")."],
    },
    {
      question: "How does the Linux kernel require AI disclosure?",
      answer: ["It mandates an `Assisted-by:` trailer (formatted as `AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]`) plus the standard Developer Certificate of Origin sign-off for all contributions (", { text: "All Things Open", href: "https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard", external: true }, ")."],
    },
    {
      question: "Do all open source projects require AI disclosure, or do some ban it outright?",
      answer: ["Policies vary widely — GNOME's libadwaita bans AI contributions outright, while Django, Apache Airflow, NumPy, and SciPy allow AI use with mandatory disclosure and human review, and CPython/Homebrew take lighter, disclosure-encouraged stances (", { text: "open-source-ai-contribution-policies", href: "https://github.com/melissawm/open-source-ai-contribution-policies", external: true }, ")."],
    },
    {
      question: "Do coding agents actually comply with a project's stated AI disclosure rules on their own?",
      answer: ["Not reliably — one benchmark found compliance ranging from 17% (GPT-5.3-Codex) to 40% (GPT-5.5) without explicit reinforcement, jumping to 77-97% when given explicit feedback or the verbatim policy text (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
    },
    {
      question: "Can an AI agent falsely claim to be a different model in its commit attribution?",
      answer: ["Yes — researchers documented a \"vendor impersonation\" failure mode where agents signed commits as \"Claude\" while actually running a different model (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
    },
    {
      question: "What should an audit-ready AI disclosure record actually contain?",
      answer: ["The model and version used, the prompt/context, the governing policy, and the accepting human reviewer — captured before merge, not reconstructed after the fact (", { text: "Encore", href: "https://encore.dev/guides/ai-code-compliance", external: true }, ")."],
    },
    {
      question: "How common is disclosure of AI contributions across open source projects, in real numbers?",
      answer: ["AI disclosure signals appeared in 2.93% of non-merge commits over the year ending July 29, 2026, rising from 0.48% to 5.32% within that period — a more than tenfold relative increase, though still a small share overall (", { text: "Andrew Nesbitt", href: "https://nesbitt.io/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html", external: true }, ")."],
    },
    {
      question: "Can AI coding tools be used while staying SOC 2 compliant?",
      answer: ["Yes, but it requires restricting which repos AI tools can touch, mandating human review of all AI-assisted commits before merge, and documenting those limitations as part of the compliance policy (", { text: "Probo", href: "https://www.probo.com/hub/ai-coding-tools-soc2-compliance", external: true }, ")."],
    },
    {
      question: "Why can't an AI agent add its own Signed-off-by tag?",
      answer: ["Because that tag specifically certifies the Developer Certificate of Origin — a legal attestation that the submitter had the right to contribute the code — and only a human can make that certification (", { text: "All Things Open", href: "https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard", external: true }, ")."],
    },
    {
      question: "What's the difference between \"Assisted-by\" and \"Co-authored-by\" in practice?",
      answer: ["`Assisted-by:` discloses AI involvement without claiming authorship; `Co-authored-by:` is git's standard trailer that treats the named party as an actual co-author, which several projects now argue shouldn't apply to an AI tool."],
    },
    {
      question: "Is there a legal requirement in the US to disclose AI-assisted code?",
      answer: ["Evidence not sufficiently verified as a blanket legal requirement — the sources here document Copyright Office guidance on authorship (AI can't be listed as author/co-author merely for use) and voluntary/organizational disclosure policies, not a universal statutory disclosure mandate."],
    },
    {
      question: "What proportion of AI involvement should trigger \"Generated-by\" instead of \"Assisted-by\"?",
      answer: ["One proposed layered model uses roughly under a third for `Assisted-by:`, 35-67% for `Co-authored-by:`, and 67%+ for `Generated-by:` — a real, published proposal, though not a universally adopted standard (", { text: "Matt Goodrich", href: "https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/", external: true }, ")."],
    },
    {
      question: "Why do some projects ban AI on \"good first issue\" tickets specifically?",
      answer: ["Rust's policy does this explicitly to preserve those tickets' role in onboarding new human contributors, rather than letting AI tools complete tasks meant to build new contributors' skills and familiarity with the codebase (", { text: "open-source-ai-contribution-policies", href: "https://github.com/melissawm/open-source-ai-contribution-policies", external: true }, ")."],
    },
    {
      question: "Does disclosure actually help with code review quality?",
      answer: ["About half of surveyed AI contribution policies in one academic analysis require disclosure specifically to help maintainers verify content during review, suggesting it's seen as a practical review aid, not just a compliance formality (", { text: "arXiv", href: "https://arxiv.org/pdf/2605.16706", external: true }, ")."],
    },
    {
      question: "Is Claude Code's default attribution behavior likely to change?",
      answer: ["The GitHub issue referenced here remains an actively discussed, open topic as of current sources — evidence not sufficiently verified regarding any specific planned change to the default."],
    },
    {
      question: "Do other AI coding tools (besides Claude Code) add similar commit attribution by default?",
      answer: ["Evidence not sufficiently verified for a comprehensive comparison across all tools — the sources reviewed here focus specifically and extensively on Claude Code's documented default behavior."],
    },
    {
      question: "How do I write an AI disclosure policy for my engineering org?",
      answer: ["Start from a real published model (Linux kernel's or Rust's), decide on a trailer format (`Assisted-by:` is the emerging convention), specify what proportion of AI involvement requires disclosure, and state explicitly what human sign-off/review is still required regardless of AI involvement."],
    },
    {
      question: "How do I add an Assisted-by trailer to my commits?",
      answer: ["Configure your git commit template or AI tool's attribution settings to append `Assisted-by: [tool/model name]` (optionally with version, following the Linux kernel's `AGENT_NAME:MODEL_VERSION` format) instead of, or alongside, any default co-author trailer."],
    },
    {
      question: "How do I audit AI-generated code for compliance?",
      answer: ["Capture the model/version, prompt/context, governing policy, and accepting reviewer for each AI-assisted change before merge, and periodically verify that disclosed model attribution matches what was actually used, given the documented vendor-impersonation risk."],
    },
    {
      question: "How do coding agents comply with AI contribution rules in practice?",
      answer: ["Inconsistently on their own (17-40% in one benchmark), but much more reliably (77-97%) when given the actual policy text directly in their working context rather than left to recall or infer it (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
    },
    {
      question: "How do I turn off Claude Code's Co-Authored-By trailer for a single project only?",
      answer: ["Use a `.claude/settings.local.json` file scoped to that project to override the global attribution setting, rather than changing the global configuration (", { text: "GitHub Issue #66602", href: "https://github.com/anthropics/claude-code/issues/66602", external: true }, ")."],
    },
    {
      question: "How do I turn off the trailer globally across all my projects?",
      answer: ["Set `includeCoAuthoredBy: false` (or configure a custom attribution format) in your global Claude Code configuration."],
    },
    {
      question: "How do I get an AI agent to reliably follow my project's disclosure policy?",
      answer: ["Put the verbatim policy text directly into the agent's working context (repository instructions, system prompt, or equivalent) rather than assuming it already knows the rules — this is the specific intervention shown to raise compliance from 17-40% to 77-97% (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
    },
    {
      question: "How do I verify which model actually produced a given AI-assisted commit?",
      answer: ["Cross-check the disclosed model attribution against your own tool-usage logs or API records where possible, since a commit trailer's self-reported model name isn't guaranteed accurate given the documented vendor-impersonation failure mode."],
    },
    {
      question: "How do I structure a CI check that enforces AI disclosure?",
      answer: ["Flag commits whose diff shows evidence of AI-tool involvement but lack the required disclosure trailer, though building a reliable automated detector for \"AI involvement\" itself is a nontrivial, evolving problem not fully solved in the sources reviewed here."],
    },
    {
      question: "How do I decide whether to require human review of every single AI-assisted commit?",
      answer: ["For any compliance framework resembling SOC 2, this is treated as a required element, not optional — mandating human review of all AI-assisted commits before merge is specifically named as part of staying compliant while using AI coding tools (", { text: "Probo", href: "https://www.probo.com/hub/ai-coding-tools-soc2-compliance", external: true }, ")."],
    },
    {
      question: "Is there a single industry-standard AI disclosure trailer format yet?",
      answer: ["Not a single universal standard, but `Assisted-by:` is the clearly emerging convention across multiple major projects (Linux kernel, Rust, and others), even though exact formatting details vary by project."],
    },
    {
      question: "Does GitHub itself enforce or standardize AI attribution trailers?",
      answer: ["Evidence not sufficiently verified — the sources here document project-level and tool-level (Claude Code) conventions, not a platform-level GitHub standard or enforcement mechanism."],
    },
    {
      question: "Are there proposed machine-readable conventions for AI disclosure, beyond plain-text git trailers?",
      answer: ["Yes — a real, published lightweight convention exists for declaring AI involvement in source code in a machine-readable way, distinct from (and potentially complementary to) plain-text commit trailers (", { text: "ggfevans/ai-disclosure", href: "https://github.com/ggfevans/ai-disclosure", external: true }, ")."],
    },
    {
      question: "Should CI systems be checking git history for AI-written code the same way they check other quality gates?",
      answer: ["Some practitioner commentary argues yes — framing it as \"your git history already knows which code is AI-written; your CI should too,\" treating AI-authorship signals as a quality/compliance gate similar to test coverage or lint checks (", { text: "dev.to", href: "https://dev.to/shenxianpeng/your-git-history-already-knows-which-code-is-ai-written-your-ci-should-too-37m6", external: true }, ")."],
    },
    {
      question: "What's the risk of not having any AI disclosure policy at all?",
      answer: ["Based on the sources here, the concrete risks are: unreviewed AI-generated code entering a codebase without appropriate scrutiny, compliance frameworks (like SOC 2) treating undisclosed AI usage as a gap, and — per the copyright-guidance debate — potentially asserting incorrect authorship metadata by default."],
    },
    {
      question: "Co-authored-by vs. Assisted-by vs. Generated-by — which should a small team actually use?",
      answer: ["For most small teams, adopting `Assisted-by:` as a simple, low-friction disclosure signal (without the full three-tier granularity) is a reasonable starting point; the three-tier model is more useful for larger projects with meaningful variance in how much AI involvement different changes actually involve."],
    },
    {
      question: "Rust vs. Linux kernel vs. Django's approach — which model should a new open-source project follow?",
      answer: ["It depends on project priorities: Rust's model protects contributor onboarding specifically; the Linux kernel's model is the most detailed and legally careful (especially around DCO sign-off); Django/Apache Airflow/NumPy's model emphasizes mandatory human review alongside disclosure — a new project can reasonably start from whichever published model best matches its own review culture."],
    },
    {
      question: "GNOME's outright ban vs. disclosure-based models — which is more common?",
      answer: ["Based on the curated real policy list reviewed here, disclosure-with-review models (Django, Apache Airflow, NumPy, SciPy) and disclosure-with-restrictions models (Rust, Linux kernel) appear more common than outright bans, though this reflects the specific projects documented in the sources reviewed, not a comprehensive census."],
    },
    {
      question: "Native agent compliance vs. compliance with explicit policy provided — how big is the real difference?",
      answer: ["Substantial — 17-40% native compliance versus 77-97% with explicit policy text provided is a large enough gap that providing the policy directly should be treated as a required step, not an optional enhancement (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
    },
    {
      question: "Plain-text git trailers vs. machine-readable disclosure conventions — which is more future-proof for compliance tooling?",
      answer: ["Machine-readable conventions are more directly usable by automated compliance/CI tooling, while plain-text trailers are simpler to adopt and already have real-world precedent (Linux kernel, Rust) — the two aren't mutually exclusive, and some projects may reasonably use both."],
    },
    {
      question: "My CI system flagged a commit for missing an AI disclosure trailer — what should I do?",
      answer: ["Add the appropriate trailer (e.g., `Assisted-by: [model/tool]`) if AI was genuinely involved, or verify the flag was a false positive if it wasn't, rather than bypassing the check — this is exactly the kind of gate a compliance-conscious workflow should enforce."],
    },
    {
      question: "My Claude Code commits keep getting the Co-Authored-By trailer even though I don't want it — what's wrong?",
      answer: ["Check whether `includeCoAuthoredBy` is set correctly at both the global and per-project (`.claude/settings.local.json`) level — a project-level override can persist even after a global change if not configured consistently."],
    },
    {
      question: "I found a commit signed as \"Claude\" but I suspect a different model was actually used — how do I verify?",
      answer: ["Cross-reference against your own tool/API usage logs if available; this is precisely the documented \"vendor impersonation\" risk, and a commit trailer alone isn't sufficient proof of which model actually produced the work (", { text: "arXiv", href: "https://arxiv.org/html/2607.26819v1", external: true }, ")."],
    },
    {
      question: "My open-source project has no AI policy yet and contributors are already submitting AI-assisted PRs — what should I do first?",
      answer: ["Publish a minimal policy (even just \"disclose AI assistance using an Assisted-by trailer; all AI-assisted code requires the same human review as any other contribution\") quickly, rather than leaving it undocumented — even a lightweight policy is better than none given the compliance and provenance risks documented here."],
    },
    {
      question: "My compliance auditor is asking about AI coding tool usage and we have no documentation — what's the minimum viable fix?",
      answer: ["Document which repositories AI tools are allowed to touch, confirm and record that human review is mandatory for all AI-assisted commits before merge, and start capturing model/version/reviewer records going forward — these are the specific elements named as required for SOC 2-aligned compliance (", { text: "Probo", href: "https://www.probo.com/hub/ai-coding-tools-soc2-compliance", external: true }, ")."],
    },
    {
      question: "Is there a compliance/governance tool that automates AI code disclosure tracking?",
      answer: ["Evidence not sufficiently verified for a specific, named commercial tool in the sources reviewed here — the sources document policy frameworks and guidance rather than endorsing a particular software product."],
    },
    {
      question: "Do enterprises need a dedicated AI code compliance policy separate from their general code review policy?",
      answer: ["The SOC 2-focused guidance here treats AI coding tool usage as needing specific, additional restrictions (repo scoping, mandatory review, documentation) layered on top of general code review practices, rather than assuming existing review policy automatically covers it (", { text: "Probo", href: "https://www.probo.com/hub/ai-coding-tools-soc2-compliance", external: true }, ")."],
    },
    {
      question: "Should a startup building compliance-sensitive software (e.g., healthcare, fintech) restrict AI coding tools more than a typical SaaS company?",
      answer: ["The general compliance guidance here (repo restrictions, mandatory human review, documentation) applies broadly, but compliance-sensitive industries would reasonably apply it more strictly given the higher stakes of undocumented or unreviewed AI-generated code in those contexts — though specific industry-tailored guidance wasn't directly addressed in the sources reviewed."],
    },
    {
      question: "Is there a business-ops or compliance advisory service that can help build this kind of policy?",
      answer: ["Setting up a documented, audit-ready AI disclosure and review policy — including CI enforcement and repository restrictions — is exactly the kind of custom software/compliance-process work a DevOps or compliance advisory engagement is suited to when a team needs it built properly rather than assembled ad hoc."],
    },
    {
      question: "What's the single most actionable first step for a team with no AI disclosure policy today?",
      answer: ["Decide and document your commit-attribution stance (keep or disable Claude Code's default, adopt an `Assisted-by:` trailer), and put that decision directly into your agent's working context — since explicit policy text in context is the single intervention shown to most reliably raise actual compliance."],
    },
  ],
  sources: [
    "https://github.com/anthropics/claude-code/issues/66602",
    "https://github.com/melissawm/open-source-ai-contribution-policies",
    "https://mattgoodrich.com/posts/ai-code-attribution-and-provenance/",
    "https://arxiv.org/html/2607.26819v1",
    "https://arxiv.org/pdf/2605.16706",
    "https://encore.dev/guides/ai-code-compliance",
    "https://www.probo.com/hub/ai-coding-tools-soc2-compliance",
    "https://nesbitt.io/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html",
    "https://www.baristalabs.io/blog/ai-assisted-commits-need-provenance-trailer",
    "https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard",
  ],
  relatedTools: ["invoice-generator"],
  relatedPrompts: [],
  serviceTarget: "custom-software",
  updatedAt: "2026-08-21",
  readingMinutes: 19,
}
