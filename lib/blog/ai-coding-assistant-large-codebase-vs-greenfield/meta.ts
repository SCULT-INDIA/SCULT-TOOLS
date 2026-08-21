import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = "ai-coding-assistant-large-codebase-vs-greenfield"
const SERVICE_CUSTOM_SOFTWARE = resolveServiceLink("custom-software", SLUG)

/**
 * Generated from content-engine/05-drafts/article_087.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "roundup",
  title: "AI Coding Assistants on Large Codebases vs Greenfield Projects",
  h1: "AI coding assistants: large codebases vs greenfield projects",
  targetKeyword: "ai coding assistant large codebase vs greenfield",
  description: "How Cursor, Claude Code, and GitHub Copilot actually differ on legacy/brownfield codebases vs greenfield projects, with real context-window and risk data.",
  dek: "AI coding assistants perform reliably on greenfield projects because there's no history, no hidden dependencies, and conventions are explicit from the first commit. On large, existing codebases, the same tools face a genuine context problem: Cursor's embedding-based retrieval works well when it pulls the right files but starts hallucinating more when it can't, while Claude Code's much larger context window (reported up to roughly 1M tokens in some configurations, versus Cursor's more typical 128K–500K range) gives it a real advantage on tasks touching five or more files at once. The deeper issue on legacy code isn't context window size at all — it's that the real constraints live in incident postmortems, Slack threads, and institutional memory no context window can see.",
  sections: [
    {
      heading: "Why greenfield projects are the easy case",
      body: [
        ["CloudGeometry's analysis of why AI coding tools break on real codebases makes a specific, useful distinction: greenfield projects have no history, no hidden dependencies, and explicit, visible conventions because the AI agent (or a new human developer, for that matter) is reading essentially the entire relevant context in the files that exist (", { text: "CloudGeometry", href: "https://www.cloudgeometry.com/blog/greenfield-brownfield-ai-coding-real-codebase", external: true }, "). There's no tribal knowledge competing with what's actually in the repository. This is also framed as lower-risk in a specific, concrete sense: a greenfield project usually has no real users yet, so a mistake an AI agent introduces has a much smaller blast radius than the same mistake in a live production system — though the same source notes quality expectations should rise once users do arrive (", { text: "CloudGeometry", href: "https://www.cloudgeometry.com/blog/greenfield-brownfield-ai-coding-real-codebase", external: true }, ")."],
      ],
    },
    {
      heading: "Why legacy/brownfield codebases are genuinely harder",
      body: [
        ["Tianpan's detailed analysis of AI coding agents on legacy codebases identifies the core problem precisely: legacy systems have real constraints — the reason a certain function has an odd edge case, why a particular table is denormalized, why a specific retry logic exists — that live scattered across incident postmortems, Slack threads, and undocumented institutional memory, not in the code itself (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-legacy-codebases", external: true }, "). An AI agent, no matter how large its context window, cannot read a Slack thread from three years ago that explains why a piece of code looks the way it does unless someone has explicitly fed that context into the current session."],
        ["This creates a specific and dangerous failure mode: code review depends on human reviewers' contextual familiarity with the codebase to catch subtle problems, but that familiarity is exactly the kind of undocumented institutional knowledge an AI agent doesn't have and a reviewer may not fully have either if they're not the original author (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-legacy-codebases", external: true }, "). The result, per a companion piece on the same research, is that AI agents can produce plausible-looking, syntactically valid, but semantically wrong changes that slip through review and reach production — a risk described as especially costly in regulated domains like insurance, banking, or healthcare (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, ")."],
      ],
    },
    {
      heading: "Context window comparison: Cursor vs Claude Code vs Copilot",
      body: [
        ["The most consistently cited technical difference across 2026 comparisons is context window size, though the specific numbers vary somewhat depending on configuration and how \"usable\" context is defined:"],
        ["– ", { text: "Claude Code", bold: true }, " is described as offering the largest context window among the three, reported up to roughly 1M tokens in some configurations, which comparisons describe as its clearest advantage on tasks touching five or more files at once, letting it hold an entire multi-file change in view instead of re-reading files mid-task (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, "; ", { text: "Artifilog", href: "https://www.artifilog.com/posts/claude-code-vs-cursor-vs-copilot", external: true }, ")."],
        ["– ", { text: "Cursor", bold: true }, " typically operates in a 128K–256K token range through project indexing and embedding-based retrieval, per NxCode's comparison — though separately reviewed 2026 coverage notes Cursor's advertised context figures can deliver meaningfully less usable context in practice than the headline number suggests, since embeddings retrieve relevant snippets rather than the full raw context."],
        ["– ", { text: "GitHub Copilot", bold: true }, " is generally described in the comparisons reviewed as lacking both Claude Code's large context window and Cursor's codebase-embedding/composer-level understanding, making it comparatively weaker specifically for large-codebase comprehension tasks, even though it remains a strong, accessible option for teams already standardized on the Microsoft/GitHub ecosystem (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
        ["A commonly cited hybrid workflow pattern among experienced developers, per the same comparison, is using Cursor or Copilot for day-to-day editing and switching to Claude Code specifically for more complex, large-context, or agentic tasks — treating the tools as complementary rather than exclusive choices (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
      ],
    },
    {
      heading: "The counterintuitive advantage legacy code sometimes has",
      body: [
        ["It would be easy to assume legacy code is simply worse territory for AI agents in every respect, but Tianpan's analysis makes a specific counterpoint worth taking seriously: legacy systems often come with years of accumulated documentation, runbooks, and postmortems that a brand-new greenfield project simply doesn't have yet (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-legacy-codebases", external: true }, "). The problem isn't that this context doesn't exist — it's that it's rarely fed into the AI agent's working context in a structured way. This reframes the practical challenge: it's not \"legacy code is unfixably hard for AI agents,\" it's \"most teams haven't done the context-engineering work to expose the institutional knowledge that already exists.\""],
        ["A separate guide on context engineering for legacy codebases recommends exactly this: feeding agents accumulated context such as runbooks and postmortems directly, and using scoped instruction/rule files as part of a documented set of fixes for legacy-code context gaps (", { text: "Softude", href: "https://www.softude.com/blog/context-engineering-ai-coding-agents-legacy-code-fixes", external: true }, ")."],
      ],
    },
    {
      heading: "The real risk: plausible-but-wrong changes",
      body: [
        ["The specific failure mode worth naming clearly, because it's the one that causes real production incidents: an AI coding agent can produce output that is syntactically valid, stylistically consistent with the surrounding code, and completely plausible on a quick read — while being semantically wrong in a way that only someone with deep contextual familiarity with that specific system would catch (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, "). This is meaningfully different from the more obvious failure mode (code that clearly doesn't compile or obviously breaks a test) — plausible-but-wrong changes are the ones that pass a superficial review."],
        ["The same analysis frames the cost trade-off directly: the time cost of thorough verification of AI-authored changes is argued to be far lower than the cost of an AI-introduced bug reaching production in a high-stakes brownfield system — an argument for investing more, not less, review rigor specifically because the AI agent is working on unfamiliar-to-it legacy code (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, "). Dice's career-advice coverage frames this more broadly as a speed-vs-risk trade-off that experts weigh differently depending on codebase maturity and domain criticality — there's no single right answer, but the trade-off itself is a real, named consideration in current industry commentary (", { text: "Dice", href: "https://www.dice.com/career-advice/speed-vs.-risk-experts-weigh-in-on-using-ai-coding-assistants", external: true }, ")."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Illustrative example (labeled as such):", bold: true }, " A team maintaining a five-year-old insurance-claims processing system asks an AI coding agent to \"fix\" a function that appears to have redundant validation logic. The agent removes what looks like duplicate code — syntactically clean, tests still pass. What the agent couldn't know: the \"duplicate\" check was added after a specific production incident to catch a rare edge case involving a discontinued claim type that no longer appears in the current test suite. The change passes review because the reviewer, new to the team, doesn't recognize the missing context either. This is exactly the plausible-but-wrong pattern described in the sourced research above — not a hypothetical edge case, but the general shape of the documented risk."],
        [{ text: "Sourced pattern, real tools named:", bold: true }, " The hybrid workflow — Cursor or Copilot for daily editing, Claude Code for complex multi-file or agentic tasks — is a real, named pattern described across multiple 2026 tool comparisons, not a hypothetical recommendation invented for this article (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– Claude Code's context window is reported up to roughly ", { text: "1M tokens", bold: true }, " in some configurations, versus Cursor's more typical ", { text: "128K–256K", bold: true }, " (or up to 500K per some comparisons) via embedding-based project indexing — ", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ", ", { text: "Artifilog", href: "https://www.artifilog.com/posts/claude-code-vs-cursor-vs-copilot", external: true }, "."],
        ["– Claude Code's context advantage is specifically described as showing up most on tasks touching ", { text: "five or more files at once", bold: true }, " — ", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, "."],
        ["– Cursor's advertised context figures reportedly deliver less usable context in practice than the headline number, per some 2026 comparisons — this is a directional, source-attributed observation rather than an independently benchmarked figure this article can state with precision."],
        ["– Independently verified, controlled benchmark data comparing hallucination rates specifically between these three tools on large vs. small codebases was not found in the sources reviewed for this article — that specific comparative claim is evidence not sufficiently verified, and this article relies instead on the qualitative failure-mode descriptions sourced above (embedding-retrieval misses, plausible-but-wrong changes) rather than a numeric hallucination-rate comparison."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        ["### Cursor vs. Claude Code vs. GitHub Copilot on codebase context"],
        ["Cursor's strength is fast, IDE-integrated editing with embedding-based retrieval that works well when it successfully pulls the relevant files — its risk is retrieval failure on large or fragmented codebases, which comparisons describe as leading to more hallucination. Claude Code's strength is its much larger context window, giving it a real advantage on complex, multi-file, agentic tasks — the trade-off is that it's a different, more agent-driven workflow than Cursor's IDE-native editing experience. GitHub Copilot is generally described as behind both on large-codebase comprehension specifically, while remaining the most accessible, cost-effective choice for teams standardized on GitHub/Microsoft tooling (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
        ["### Greenfield vs. brownfield AI coding", " ", "Greenfield: no hidden history, explicit conventions, low blast radius for mistakes since there are typically no real users yet. Brownfield: real constraints scattered across institutional memory the AI agent can't see by default, higher blast radius since production users are affected, and a documented risk of plausible-but-wrong changes passing review (", { text: "CloudGeometry", href: "https://www.cloudgeometry.com/blog/greenfield-brownfield-ai-coding-real-codebase", external: true }, "; ", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-legacy-codebases", external: true }, ")."],
        ["### Embeddings vs. full context window for code retrieval"],
        ["Embedding-based retrieval (Cursor's primary approach) selectively pulls what it judges to be the most relevant snippets — efficient, but dependent on the retrieval step working correctly. A large native context window (Claude Code's primary advantage) can hold more raw context directly without depending on a retrieval step guessing correctly first — more computationally expensive per request, but less prone to the specific \"the right file wasn't retrieved\" failure mode."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["Regulated domains — insurance, banking, healthcare — are specifically named in the sourced research as places where the plausible-but-wrong failure mode is most costly, making thorough human verification of AI-authored changes especially important in exactly those industries (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, "). Teams working across large monorepos — where a single change can touch many files across service boundaries — are the clearest real-world case where Claude Code's larger context window is described as showing a measurable advantage over Cursor's embedding-retrieval approach."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– ", { text: "Assuming a larger context window alone solves the legacy-code problem.", bold: true }, " The core issue is missing institutional context (postmortems, Slack history), which a bigger context window doesn't automatically capture unless someone explicitly feeds it in (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-legacy-codebases", external: true }, ")."],
        ["– ", { text: "Trusting a superficial code review to catch AI-introduced bugs in unfamiliar code.", bold: true }, " Plausible-but-wrong changes are specifically designed (by their nature) to pass a quick read."],
        ["– ", { text: "Applying the same review rigor to greenfield and brownfield AI-assisted changes.", bold: true }, " The blast radius and stakes differ meaningfully; brownfield changes in production systems warrant more verification time, not less."],
        ["– ", { text: "Choosing one tool exclusively instead of a hybrid workflow.", bold: true }, " Multiple 2026 comparisons describe experienced developers deliberately combining Cursor/Copilot for daily editing with Claude Code for complex multi-file work."],
        ["– ", { text: "Never feeding accumulated institutional knowledge (runbooks, postmortems) into the AI agent's context.", bold: true }, " This is the specific, actionable fix the context-engineering guidance recommends, and it's frequently skipped entirely."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– Feed accumulated institutional context — runbooks, postmortems, incident write-ups — into an AI agent's working context deliberately, rather than assuming a large context window will find it on its own (", { text: "Softude", href: "https://www.softude.com/blog/context-engineering-ai-coding-agents-legacy-code-fixes", external: true }, ")."],
        ["– Use scoped instruction/rule files for legacy codebases specifically, narrowing what the agent assumes about conventions in a given area of the code."],
        ["– Increase verification rigor specifically for AI-authored changes in brownfield/production systems, treating the extra review time as cheap insurance against the higher cost of a production bug (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, ")."],
        ["– Match the tool to the task: Cursor or Copilot for day-to-day editing, Claude Code for complex, multi-file, or agentic changes, per the commonly cited hybrid pattern."],
        ["– Be more permissive with AI-assisted changes on genuinely new greenfield code with no real users yet, and correspondingly stricter as soon as real users depend on the system."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– Greenfield projects are the easy case for AI coding agents mainly because of low stakes and explicit context, not because the AI itself is more capable there."],
        ["– Claude Code's larger context window (up to roughly 1M tokens in some configurations) shows its clearest advantage on complex, multi-file tasks; Cursor's embedding-based retrieval is efficient but risks missing relevant files on large or fragmented codebases."],
        ["– The core legacy-code problem is a missing-institutional-knowledge problem, not purely a context-window-size problem — postmortems and runbooks exist, they're just rarely fed into the agent's working context."],
        ["– Plausible-but-wrong changes — syntactically valid but semantically incorrect — are the specific, documented risk that makes legacy/brownfield AI-assisted coding more dangerous than it looks on a quick review."],
        ["– A hybrid workflow (Cursor/Copilot for daily editing, Claude Code for complex multi-file work) is a commonly cited pattern rather than an exclusive tool choice."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["– ", { text: "Cursor prompts", href: "/prompts/cursor" }, " — for .cursorrules and agent-mode task briefs that constrain an agentic editor from wandering on unfamiliar codebases."],
        ["– ", { text: "Claude prompts", href: "/prompts/claude" }, " — for structuring the explicit, XML-tagged context Claude responds to best when doing complex, multi-file work."],
        ["If your team is hitting the plausible-but-wrong risk described here on a production system, or needs the kind of deep codebase context-engineering work that AI tooling alone doesn't solve, that's exactly the kind of engineering work ", { text: "SCULT's custom software development team", href: SERVICE_CUSTOM_SOFTWARE.href, external: true }, " handles — particularly for legacy systems where the institutional knowledge gap is the real bottleneck, not the AI tool."],
      ],
    },
  ],
  faq: [
    {
      question: "Does Cursor work well on large, existing codebases?",
      answer: ["It works well when its embedding-based retrieval successfully pulls the relevant files, but reviewers report more hallucination on large monorepos or fragmented codebases when retrieval fails (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "How does Claude Code's context window compare to Cursor's on big codebases?",
      answer: ["Claude Code is described as offering up to roughly 1M tokens in some configurations, versus Cursor's more typical 128K–256K (or up to 500K in some comparisons) via project indexing (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, "; ", { text: "Artifilog", href: "https://www.artifilog.com/posts/claude-code-vs-cursor-vs-copilot", external: true }, ")."],
    },
    {
      question: "Why do AI coding agents perform better on greenfield projects than legacy ones?",
      answer: ["Greenfield projects have no hidden history or dependencies and explicit, visible conventions; legacy systems have real constraints scattered across postmortems, Slack threads, and undocumented institutional memory (", { text: "CloudGeometry", href: "https://www.cloudgeometry.com/blog/greenfield-brownfield-ai-coding-real-codebase", external: true }, "; ", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-legacy-codebases", external: true }, ")."],
    },
    {
      question: "Can AI coding agents do better on legacy code in some respects?",
      answer: ["Counterintuitively yes in one specific way — legacy systems often have years of accumulated documentation and runbooks a brand-new greenfield project doesn't have yet, if that context is actually fed to the agent (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-legacy-codebases", external: true }, ")."],
    },
    {
      question: "What's the biggest risk of using AI coding agents on brownfield/production codebases?",
      answer: ["Producing plausible-looking, syntactically valid, but semantically wrong changes that slip through review and reach production — especially costly in regulated domains like insurance, banking, or healthcare (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, ")."],
    },
    {
      question: "Why does code review sometimes fail to catch AI-generated bugs in legacy systems?",
      answer: ["Reviewers depend on contextual familiarity with the codebase that both the AI agent and, often, the reviewer themselves may lack for older or less-documented systems (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-legacy-codebases", external: true }, ")."],
    },
    {
      question: "What workflow do experienced developers use to combine these tools?",
      answer: ["A commonly cited hybrid pattern uses Cursor or Copilot for day-to-day editing and Claude Code for more complex, large-context, or agentic tasks (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "How should teams do context engineering for AI agents on legacy codebases?",
      answer: ["Feed the agent accumulated context like runbooks and postmortems directly, and use scoped instruction/rule files, per documented context-engineering fixes (", { text: "Softude", href: "https://www.softude.com/blog/context-engineering-ai-coding-agents-legacy-code-fixes", external: true }, ")."],
    },
    {
      question: "Is it safe to \"vibe code\" a greenfield project?",
      answer: ["It's considered lower-risk on greenfield projects specifically because there are no real users yet to be harmed by mistakes, though quality standards should rise once users arrive (", { text: "CloudGeometry", href: "https://www.cloudgeometry.com/blog/greenfield-brownfield-ai-coding-real-codebase", external: true }, ")."],
    },
    {
      question: "What does GitHub Copilot lack compared to Claude Code or Cursor for large-codebase understanding?",
      answer: ["Comparative reviews describe Copilot as lacking Claude Code's large context window and Cursor's codebase-embedding/composer-level understanding (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "Why is verification cost framed as lower than production-bug cost on brownfield systems?",
      answer: ["The argument is that time spent verifying AI-authored changes costs far less than the cost of an AI-introduced bug reaching production in a high-stakes brownfield system (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, ")."],
    },
    {
      question: "Do experts see more risk or more speed benefit from AI coding assistants overall?",
      answer: ["Industry commentary frames it as a speed-vs-risk trade-off that experts weigh differently depending on codebase maturity and domain criticality, with no single universal answer (", { text: "Dice", href: "https://www.dice.com/career-advice/speed-vs.-risk-experts-weigh-in-on-using-ai-coding-assistants", external: true }, ")."],
    },
    {
      question: "What's the difference between \"greenfield\" and \"brownfield\" in software development generally?",
      answer: ["Greenfield refers to building a new system with no existing constraints; brownfield refers to working within (and constrained by) an existing system's history, dependencies, and conventions."],
    },
    {
      question: "Does a bigger context window automatically mean fewer hallucinations?",
      answer: ["Not automatically — a large context window helps hold more raw code in view, but it doesn't by itself supply the undocumented institutional knowledge that's often the real missing piece on legacy systems (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-legacy-codebases", external: true }, ")."],
    },
    {
      question: "What's a monorepo, and why does it matter for this comparison?",
      answer: ["A monorepo holds multiple services or packages in a single repository; tasks that touch many files across a monorepo are specifically where Claude Code's larger context window is described as showing its clearest advantage (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "Why do AI agents sometimes remove code that looks redundant but actually isn't?",
      answer: ["Because the reason for that code's existence (often a fix for a specific past incident) frequently isn't documented anywhere the agent can see — a direct example of the institutional-knowledge gap described above."],
    },
    {
      question: "Is Claude Code always the better choice for a large codebase?",
      answer: ["Not universally — it has a context-window advantage on complex, multi-file tasks, but many teams use it alongside Cursor or Copilot for day-to-day editing rather than as an exclusive replacement (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "Does the context-window comparison change depending on how it's measured?",
      answer: ["Yes — some comparisons note Cursor's advertised context figures can deliver less usable context in practice than the headline number suggests, so raw token-count comparisons should be read as directional, not precise, benchmarks."],
    },
    {
      question: "What does \"context engineering\" mean in this context?",
      answer: ["The deliberate practice of structuring and feeding an AI coding agent the right supporting information (docs, runbooks, scoped rule files) rather than relying on it to infer everything from the raw code alone (", { text: "Softude", href: "https://www.softude.com/blog/context-engineering-ai-coding-agents-legacy-code-fixes", external: true }, ")."],
    },
    {
      question: "Are AI coding assistant comparisons like this one likely to change quickly?",
      answer: ["Very likely — context window sizes, pricing, and tool capabilities are actively evolving; treat the specific numbers here as reflecting the 2026 sources cited, not a permanent state of the market."],
    },
    {
      question: "How do I use AI coding assistants safely on a legacy codebase?",
      answer: ["Feed accumulated institutional context (runbooks, postmortems) into the agent's working context, use scoped rule files, and increase review rigor specifically for changes touching unfamiliar or undocumented areas."],
    },
    {
      question: "How do I give an AI coding agent context about a large codebase?",
      answer: ["Beyond relying on automatic embedding/context-window retrieval, explicitly supply architecture docs, past incident write-ups, and repository-specific instruction files where your tool supports them."],
    },
    {
      question: "How do I decide which AI coding tool to use for a given task?",
      answer: ["Use the commonly cited hybrid pattern as a starting heuristic — Cursor or Copilot for routine, single-file editing; Claude Code for complex, multi-file, or agentic changes (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "How do I do context engineering for AI coding agents specifically on legacy code?",
      answer: ["Follow the documented pattern of feeding in runbooks/postmortems and using scoped instruction/rule files, rather than expecting the agent to infer undocumented history from the code alone (", { text: "Softude", href: "https://www.softude.com/blog/context-engineering-ai-coding-agents-legacy-code-fixes", external: true }, ")."],
    },
    {
      question: "How do I review AI-generated changes on an unfamiliar part of a legacy codebase?",
      answer: ["Assume a plausible-looking change could still be semantically wrong, and specifically check whether the change touches logic that might exist because of a past incident, not just whether it compiles and passes tests."],
    },
    {
      question: "How do I reduce the risk of AI agents removing \"redundant-looking\" code that's actually load-bearing?",
      answer: ["Document the reason behind non-obvious code (via comments, ADRs, or a linked postmortem) so both human reviewers and AI agents have access to the \"why,\" not just the \"what.\""],
    },
    {
      question: "How do I set up scoped instruction/rule files for different parts of a large codebase?",
      answer: ["Create narrower, area-specific rule files (rather than one global instruction file) that capture the conventions and known gotchas of a particular module or service, and point the agent at the relevant one for a given task."],
    },
    {
      question: "How do I decide how much AI-assisted autonomy to allow on a regulated-domain codebase?",
      answer: ["Weigh the documented risk that plausible-but-wrong changes are especially costly in regulated domains like insurance, banking, or healthcare, and correspondingly increase human review requirements for those areas specifically (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, ")."],
    },
    {
      question: "How do I get more usable context out of Cursor on a large codebase?",
      answer: ["Since Cursor's context depends on successful embedding-based retrieval, keeping related code well-organized and ensuring the codebase indexing is up to date can improve retrieval accuracy, per the general mechanism described in the comparisons reviewed."],
    },
    {
      question: "How do I know if a task genuinely needs Claude Code's larger context window rather than Cursor's IDE-native workflow?",
      answer: ["Tasks touching five or more files at once — large refactors, cross-service changes, architecture-level work — are specifically where the larger context window shows its clearest advantage, per current comparisons (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "What's an advanced technique for surfacing institutional knowledge an AI agent can't otherwise see?",
      answer: ["Systematically converting past incident postmortems and architecture-decision context into structured, agent-readable documentation (rule files, ADRs) rather than leaving that knowledge scattered across chat history and tribal memory (", { text: "Softude", href: "https://www.softude.com/blog/context-engineering-ai-coding-agents-legacy-code-fixes", external: true }, ")."],
    },
    {
      question: "Does token efficiency (not just raw context size) matter when comparing these tools?",
      answer: ["Yes — some 2026 comparisons cite Claude Code using meaningfully fewer tokens for equivalent tasks in specific benchmarking, though this article treats specific efficiency multipliers as directional rather than independently re-verified figures."],
    },
    {
      question: "How should engineering leaders think about AI coding assistant ROI differently for legacy vs. greenfield teams?",
      answer: ["Legacy teams should weight the verification-cost-vs-production-bug-cost trade-off more heavily in their ROI model, since the documented risk profile (plausible-but-wrong changes) is specifically worse there than on greenfield work (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, ")."],
    },
    {
      question: "Is there a way to benchmark which tool performs best on my specific large codebase before committing?",
      answer: ["Running a small, representative multi-file task through each candidate tool and manually reviewing the output for both correctness and context-retrieval accuracy is a reasonable practical test, though no single standardized benchmark for this specific comparison was found in the sources reviewed here."],
    },
    {
      question: "How do multi-agent or agent-of-agents setups change the large-codebase risk profile?",
      answer: ["This specific sub-case wasn't covered in detail by the sources reviewed for this article — evidence not sufficiently verified, so treat any claims about multi-agent legacy-code performance with caution until better-sourced information is available."],
    },
    {
      question: "Cursor vs. Claude Code vs. Copilot — which wins on large-codebase context?",
      answer: ["Claude Code leads on raw context window size and multi-file task performance in current comparisons; Cursor is strong for day-to-day IDE-integrated editing when its retrieval works correctly; Copilot is generally described as behind both specifically for large-codebase comprehension (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "Greenfield vs. brownfield AI coding — which has the better documented risk profile?",
      answer: ["Greenfield has a better risk profile mainly because of lower stakes (no real users yet), not because the AI agent is inherently more accurate there — brownfield's risk comes from a context gap, not a capability gap (", { text: "CloudGeometry", href: "https://www.cloudgeometry.com/blog/greenfield-brownfield-ai-coding-real-codebase", external: true }, ")."],
    },
    {
      question: "Embeddings-based retrieval vs. full context window — which approach is more reliable for legacy code?",
      answer: ["A full context window is less dependent on a retrieval step guessing correctly, which matters more on fragmented or poorly indexed legacy codebases where embedding-based retrieval is more likely to miss relevant files."],
    },
    {
      question: "Claude Code vs. Cursor — which is better for a solo developer working on a personal legacy project?",
      answer: ["For a smaller, single-developer legacy project, Cursor's IDE-integrated workflow may be more convenient day-to-day, while Claude Code remains the better choice for occasional complex, multi-file refactors, following the same hybrid pattern described for teams."],
    },
    {
      question: "Is GitHub Copilot ever the right choice for a large, complex codebase?",
      answer: ["It remains a reasonable choice for teams standardized on the Microsoft/GitHub ecosystem valuing accessibility and cost, even though comparisons describe it as behind Claude Code and Cursor specifically on large-codebase comprehension (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "Why does Cursor keep hallucinating on my large codebase even though it \"indexed\" it?",
      answer: ["This typically indicates the embedding-based retrieval isn't pulling the actually-relevant files for the specific task — a known failure mode on large or fragmented codebases, per current tool comparisons (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "Why did an AI-generated change pass code review but still cause a production bug?",
      answer: ["This matches the documented plausible-but-wrong failure mode — a syntactically valid, stylistically consistent change that was semantically wrong in a way only deep contextual familiarity would catch (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, ")."],
    },
    {
      question: "Why does GitHub Copilot seem to miss context that Claude Code catches on the same repo?",
      answer: ["Comparisons attribute this to Copilot lacking both Claude Code's context-window size and Cursor's embedding/composer-level codebase understanding (", { text: "NxCode", href: "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison", external: true }, ")."],
    },
    {
      question: "Why do AI coding agents keep making the same \"obvious-looking\" mistake on our legacy system?",
      answer: ["If the mistake relates to an undocumented historical reason for the code's current shape, feeding that context in explicitly (via a rule file or documentation) is the recommended fix, rather than assuming the agent will eventually infer it."],
    },
    {
      question: "Why is my team's AI-assisted velocity gain on greenfield work not translating to our legacy codebase?",
      answer: ["This matches the documented pattern — greenfield speed gains come partly from the absence of hidden institutional constraints, which don't disappear on legacy code just because the same tool is being used."],
    },
    {
      question: "Is it worth paying for Claude Code specifically if my team already has Cursor or Copilot?",
      answer: ["Worth considering if your team regularly does complex, multi-file refactors or works in large monorepos, where the larger context window shows its clearest documented advantage — many teams run it alongside their existing tool rather than replacing it."],
    },
    {
      question: "Should a team migrating a legacy system invest in context-engineering work before scaling up AI-assisted development?",
      answer: ["Yes, per the sourced context-engineering guidance — feeding in accumulated runbooks and postmortems and setting up scoped rule files is a documented fix specifically for this scenario, and doing it before scaling up usage reduces the risk of plausible-but-wrong changes compounding (", { text: "Softude", href: "https://www.softude.com/blog/context-engineering-ai-coding-agents-legacy-code-fixes", external: true }, ")."],
    },
    {
      question: "How should an engineering leader budget review time differently for AI-assisted legacy work vs. greenfield work?",
      answer: ["Budget more review time for legacy/brownfield changes specifically, given the documented cost asymmetry between verification time and production-bug cost in high-stakes systems (", { text: "Tianpan", href: "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code", external: true }, ")."],
    },
    {
      question: "Is it worth bringing in outside engineering help for a legacy system rather than relying entirely on AI-assisted internal work?",
      answer: ["Worth considering specifically when the codebase's undocumented institutional knowledge has eroded (turnover, missing documentation) to the point where even human reviewers can't reliably catch the plausible-but-wrong failure mode described above — that's a genuine capability gap, not just a tooling one."],
    },
    {
      question: "What's the single most useful first step for a team about to use AI coding agents on a legacy codebase?",
      answer: ["Audit what institutional knowledge (postmortems, runbooks, known gotchas) actually exists and isn't yet captured anywhere an AI agent could read, and start converting that into scoped, agent-readable documentation before scaling up usage."],
    },
  ],
  sources: [
    "https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison",
    "https://www.artifilog.com/posts/claude-code-vs-cursor-vs-copilot",
    "https://www.cloudgeometry.com/blog/greenfield-brownfield-ai-coding-real-codebase",
    "https://tianpan.co/blog/2026-04-19-ai-coding-agents-legacy-codebases",
    "https://tianpan.co/blog/2026-04-19-ai-coding-agents-brownfield-legacy-code",
    "https://www.softude.com/blog/context-engineering-ai-coding-agents-legacy-code-fixes",
    "https://www.dice.com/career-advice/speed-vs.-risk-experts-weigh-in-on-using-ai-coding-assistants",
  ],
  relatedTools: [],
  relatedPrompts: [],
  serviceTarget: "custom-software",
  updatedAt: "2026-08-21",
  readingMinutes: 17,
}
