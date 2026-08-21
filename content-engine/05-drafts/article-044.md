---
id: article_044
title: "MCP Server Explained: What It Actually Lets an AI Coding Assistant Do"
slug: mcp-server-explained
description: "A plain-language explanation of what an MCP server is, how it differs from function calling, real capabilities it unlocks, and the security risks to know about."
primary_keyword: mcp server explained
secondary_keywords: [what is an mcp server, model context protocol explained, mcp server for ai coding assistant, mcp vs function calling, mcp security risks]
intent: Informational
audience: "developers and technical teams new to agentic AI tooling who want to understand or adopt MCP servers with their coding assistants"
topic_cluster: "MCP / agentic tool protocol education"
countries: []
author: "SCULT.IN Content Engine"
review_status: draft
last_verified: "2026-08-21"
sources: [
  "https://www.anthropic.com/news/model-context-protocol",
  "https://dev.to/jamie_thompson/mcp-servers-explained-how-ai-assistants-connect-to-your-tools-598o",
  "https://dev.to/yigit-konur/the-ultimate-mcp-guide-for-vibe-coding-what-1000-reddit-developers-actually-use-2025-edition-11ie",
  "https://portkey.ai/blog/mcp-vs-function-calling/",
  "https://www.descope.com/blog/post/mcp-vs-function-calling",
  "https://www.ikangai.com/model-context-protocol-comparison-mcp-vs-function-calling-plugins-apis/",
  "https://developer.chrome.com/blog/chrome-devtools-mcp",
  "https://checkmarx.com/zero-post/11-emerging-ai-security-risks-with-mcp-model-context-protocol/",
  "https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/",
  "https://www.docker.com/blog/mcp-horror-stories-github-prompt-injection/",
  "https://dev.to/ialijr/create-your-first-mcp-server-in-5-minutes-with-create-mcp-server-fch",
  "https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol",
  "https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation",
  "https://modelcontextprotocol.io/registry/about",
  "https://www.theregister.com/security/2026/01/20/anthropic-quietly-fixed-flaws-in-its-git-mcp-server/4676059"
]
---

# MCP Server Explained: What It Actually Lets Claude (or Any AI) Do

An MCP (Model Context Protocol) server is a process that exposes a set of callable tools with typed inputs and outputs, which an AI agent can discover and invoke while working on a task. It's often described as a "USB port" for AI — a standard connector that lets a model act on real systems (files, databases, live browsers, GitHub, cloud infrastructure) instead of only generating text based on stale training data. As of mid-2026, more than 10,000 active public MCP servers exist, and the protocol has been adopted by ChatGPT, Cursor, Gemini, Microsoft Copilot, and Visual Studio Code — but it also introduces a documented, real security attack surface.

## Table of contents

- What an MCP server actually is
- The problem MCP solves for AI coding assistants
- MCP vs. function calling vs. closed plugin ecosystems
- Real capabilities MCP servers unlock
- Security risks — and real documented incidents
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

## What an MCP server actually is

Model Context Protocol (MCP) is an open standard, introduced by Anthropic, for connecting AI models to external tools and data sources ([Anthropic](https://www.anthropic.com/news/model-context-protocol)). An MCP server is the concrete implementation of that standard on the "tool" side: a process that exposes a set of callable functions — each with a name, a natural-language description, and typed inputs/outputs — that a compatible AI client can discover at runtime and call during a task.

The "USB port" analogy that's become common in explainer content captures the key design goal well ([dev.to](https://dev.to/jamie_thompson/mcp-servers-explained-how-ai-assistants-connect-to-your-tools-598o)): before MCP, connecting a model to a new tool meant custom, one-off integration work for every model-tool pair. MCP standardizes that connector so any MCP-compatible client can use any MCP server, the same way any USB device works with any USB port regardless of who made either one.

In 2026, Anthropic donated the Model Context Protocol and established an independent Agentic AI Foundation to govern it going forward ([Anthropic](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)) — a structural signal that MCP is being positioned as durable, vendor-neutral infrastructure rather than a single company's proprietary feature.

## The problem MCP solves for AI coding assistants

Without any tool-connection layer, an AI coding assistant works purely from its training data and whatever text you paste into the conversation. That means it can't read your actual current files, can't query your actual database, can't check whether a library's API changed since its training cutoff, and can't take any action in the real world — it can only suggest.

MCP servers close that gap by giving the model direct, structured access to current systems: real files, real databases, a live browser, and real developer tools, so it can execute a task rather than just describe how you might do it yourself ([dev.to — Yigit Konur](https://dev.to/yigit-konur/the-ultimate-mcp-guide-for-vibe-coding-what-1000-reddit-developers-actually-use-2025-edition-11ie)).

## MCP vs. function calling vs. closed plugin ecosystems

These three terms get conflated often enough that it's worth separating them precisely.

**MCP vs. plain function calling.** Function calling is a capability of a single model provider's API: the model expresses, in a structured format, what function it wants to call and with what arguments, and your own code is responsible for actually executing that call. MCP standardizes the layer above that — how those tool calls get **discovered and executed** across many different tools and services, in a way that's portable across models and clients, rather than being reinvented for every provider ([Portkey](https://portkey.ai/blog/mcp-vs-function-calling/); [Descope](https://www.descope.com/blog/post/mcp-vs-function-calling)). As the number of tools an agent needs grows, MCP reduces the duplicated integration work that pure function calling would otherwise require for each new tool-provider pairing.

**MCP vs. closed plugin ecosystems (like early ChatGPT plugins).** A closed plugin ecosystem is a specialized toolbox controlled entirely by one vendor — the vendor decides what plugins exist, how they're vetted, and which clients can use them. MCP, by contrast, is an open standard: any developer can implement an MCP server, and any MCP-compatible client (not just one vendor's product) can use it ([ikangai](https://www.ikangai.com/model-context-protocol-comparison-mcp-vs-function-calling-plugins-apis/)). That openness is precisely why MCP has been adopted across ChatGPT, Cursor, Gemini, Microsoft Copilot, and VS Code rather than remaining a single-vendor feature.

**Why tool descriptions matter mechanically.** MCP tool definitions include a natural-language description the model can read and reason about — meaning the model doesn't need the tool's API hardcoded into its own instructions. It can discover a new tool and figure out how and when to use it dynamically, based on that description alone ([dev.to — Jamie Thompson](https://dev.to/jamie_thompson/mcp-servers-explained-how-ai-assistants-connect-to-your-tools-598o)). This is also exactly the mechanism that makes "tool poisoning" attacks possible (see the security section below) — the same natural-language description that helps a well-behaved model use a tool correctly can be crafted to mislead it.

## Real capabilities MCP servers unlock

Concrete, named examples of what MCP servers actually let an agent do, rather than abstract capability claims:

- **Kubernetes MCP server** — CRUD operations on pods, deployments, and services directly from the agent, instead of the agent generating `kubectl` commands for a human to run ([dev.to — Yigit Konur](https://dev.to/yigit-konur/the-ultimate-mcp-guide-for-vibe-coding-what-1000-reddit-developers-actually-use-2025-edition-11ie)).
- **GitHub MCP server** — managing issues, pull requests, branches, and releases directly.
- **AWS MCP server** — managing S3, DynamoDB, EC2, IAM, and other resources directly.
- **Chrome DevTools MCP server** — lets an agent debug a real running web page directly inside Chrome, using DevTools' own debugging and performance-insight capabilities to improve the accuracy of a proposed fix, rather than guessing at what's wrong from a code read alone ([Chrome Developers blog](https://developer.chrome.com/blog/chrome-devtools-mcp)).

## Security risks — and real documented incidents

This is the part of the MCP story that gets underweighted in most "here's what MCP can do for you" explainers, and it deserves equal billing.

**The core risk categories.** Compromised or malicious MCP servers can inject persistent instructions, exfiltrate data, or perform "tool poisoning" — manipulating a tool's metadata or natural-language description to trick the agent into invoking a tool it shouldn't, or invoking it with unauthorized arguments ([Checkmarx](https://checkmarx.com/zero-post/11-emerging-ai-security-risks-with-mcp-model-context-protocol/); [Unit 42, Palo Alto Networks](https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/)).

**Anthropic's own official Git MCP server had documented vulnerabilities.** Security researchers at Cyata found three chainable flaws in Anthropic's official Git MCP server — a path-validation bypass (CVE-2025-68145), an unrestricted `git_init` that could turn any directory into a Git repository (CVE-2025-68143), and an argument-injection flaw in `git_diff`/`git_checkout` (CVE-2025-68144) — and reported them to Anthropic in mid-2025. Anthropic shipped a fix in December 2025 (version 2025.12.18), and researchers demonstrated that, chained with a filesystem MCP server, the flaws could be escalated to remote code execution via Git's clean/smudge filters ([The Register](https://www.theregister.com/security/2026/01/20/anthropic-quietly-fixed-flaws-in-its-git-mcp-server/4676059)). This matters specifically because it wasn't a fringe, unmaintained third-party server — it was an official server from the protocol's own originator, which is a useful reminder that "official" doesn't mean "risk-free."

**A real documented prompt-injection incident: the "GitHub Prompt Injection Data Heist."** Docker's write-up describes a real case where the text of a malicious GitHub issue was used to manipulate an agent connected via MCP into leaking private repository data ([Docker blog](https://www.docker.com/blog/mcp-horror-stories-github-prompt-injection/)). The mechanism: the agent was reading GitHub issue content as part of its normal workflow, and that content itself contained instructions the agent then followed — a textbook case of untrusted data being treated as trusted instructions.

**Every additional MCP server widens the attack surface.** Beyond the risk of an individual malicious server, simply having more MCP servers connected gives more surface area for LLM prompt injection generally — server choice and permission scoping are real security decisions, not configuration details ([Checkmarx](https://checkmarx.com/learn/mcp-security-risks-real-world-incidents-and-security-controls/)).

## Practical examples

**Real, sourced example — Chrome DevTools MCP for debugging.** A developer working with an AI coding assistant connects the Chrome DevTools MCP server. Instead of describing a bug and waiting for the model to guess at a fix from the code alone, the agent can open the actual running page, inspect console errors, check network requests, and use DevTools' performance profiling — then propose a fix grounded in what's actually happening in the browser, not just what the source code implies should happen ([Chrome Developers blog](https://developer.chrome.com/blog/chrome-devtools-mcp)).

**Real, sourced example — the GitHub issue-based data heist.** A repository maintainer's AI agent, connected to GitHub via MCP as part of its normal triage workflow, reads a new issue. The issue's text is crafted to look like a legitimate bug report but actually contains embedded instructions. Because the agent treats issue content as data to summarize rather than as an untrusted input that could contain adversarial instructions, it follows the embedded instructions and leaks private repository data ([Docker blog](https://www.docker.com/blog/mcp-horror-stories-github-prompt-injection/)). This is a real, named, documented incident pattern — not a hypothetical.

**Illustrative example (hypothetical, clearly labeled) — a first MCP server in five minutes.** A developer wants to give their coding assistant access to their team's internal ticket-tracking API. Using a scaffolding tool like `create-mcp-server`, they define a handful of typed functions (`get_ticket`, `create_ticket`, `list_open_tickets`) with natural-language descriptions, and within roughly five minutes have a working MCP server the assistant can call ([dev.to — ialijr](https://dev.to/ialijr/create-your-first-mcp-server-in-5-minutes-with-create-mcp-server-fch)). The low barrier to building one is exactly why the ecosystem has grown so fast — and exactly why not every server in the wild has had serious security review.

## Data and evidence

- More than **10,000 active public MCP servers** exist as of 2026, spanning developer tools to Fortune 500 deployments ([digitalapplied.com](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)).
- As of **May 24, 2026**, the official MCP Registry API contained **9,652 latest server records** and **28,959 total server/version records** ([modelcontextprotocol.io](https://modelcontextprotocol.io/registry/about)).
- The MCP Python and TypeScript SDKs see roughly **97 million monthly downloads** combined ([digitalapplied.com](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)).
- MCP has been adopted by **ChatGPT, Cursor, Gemini, Microsoft Copilot, and Visual Studio Code**, among other AI products ([digitalapplied.com](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)).
- The community-maintained third-party MCP server list on GitHub was **retired on April 14, 2026**, with users redirected to the official `registry.modelcontextprotocol.io` — a sign the ecosystem had outgrown a single static list ([digitalapplied.com](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)).
- On exact incident counts or a comprehensive tally of how many of the 10,000+ public MCP servers have had documented security reviews: **evidence not sufficiently verified** — the sources reviewed document specific named incidents (the Anthropic Git MCP server flaws, the GitHub data-heist case) rather than a comprehensive ecosystem-wide security audit.

## Comparisons

**MCP vs. function calling.** Function calling is a single-provider API mechanism for a model to request a tool call; MCP is the standardized, cross-provider layer for how that tool actually gets discovered and executed. They're complementary, not competing — MCP typically sits underneath a model's function-calling capability, standardizing what happens once the model has decided to call something ([Portkey](https://portkey.ai/blog/mcp-vs-function-calling/); [Descope](https://www.descope.com/blog/post/mcp-vs-function-calling)).

**MCP vs. closed plugin ecosystems.** A closed plugin store is controlled by one vendor end-to-end; MCP is open, so any developer can build a server and any compatible client can use it — the trade-off being that open ecosystems inherit more variable quality and security posture than a centrally vetted plugin store, as the security incidents above illustrate.

**MCP vs. traditional APIs.** A traditional API requires a human developer to read documentation and write integration code ahead of time for each specific use. MCP's natural-language tool descriptions let the model itself discover and reason about how to use a new tool at runtime, without that integration code being written in advance for that specific task — though the server itself still has to be built and exposed, so it doesn't eliminate development work, it shifts where the "how do I use this" reasoning happens.

## Real-world use cases

- **A solo developer wiring up GitHub, AWS, and Kubernetes MCP servers** to let their coding assistant manage infrastructure and repo operations directly during a session, rather than copy-pasting commands.
- **A browser-debugging workflow** using the Chrome DevTools MCP server so an agent can verify a fix against the actual running page instead of just the source.
- **An enterprise team using the official MCP Registry** to vet which servers are legitimate and actively maintained before connecting them to internal systems, given the documented risk that not every public server has had serious security review.
- **A security team specifically auditing which MCP servers are connected to which internal systems**, treating server choice and permission scoping as an access-control decision on par with any other third-party integration.

## Common mistakes

- **Connecting an MCP server without checking its provenance or maintenance status.** Given more than 10,000 public servers of wildly varying quality, treating "it's on the registry" as equivalent to "it's been security-reviewed" is a mistake.
- **Assuming an "official" server from a well-known provider is automatically safe.** Anthropic's own official Git MCP server had three documented, chainable CVEs (patched December 2025) — provenance reduces but does not eliminate risk.
- **Treating tool call outputs, and content an agent reads via MCP (like a GitHub issue), as inherently trustworthy.** The documented "GitHub Prompt Injection Data Heist" happened specifically because issue text was treated as safe-to-summarize data rather than as a potential source of adversarial instructions.
- **Granting an MCP server broader permissions than the task actually requires.** Every additional server and every broader permission grant widens the attack surface for prompt injection.
- **Confusing MCP with a single vendor's closed feature.** It's an open, multi-vendor-adopted standard now governed by an independent Agentic AI Foundation, not a proprietary Anthropic-only mechanism.

## Best practices

- Prefer MCP servers from the official registry or well-known maintainers over unreviewed community servers, especially for anything touching production systems or credentials.
- Scope permissions narrowly — connect only the specific tools/functions a task actually needs, not a broad, all-access server "just in case."
- Treat any content an agent reads through an MCP server (issues, tickets, file contents, web pages) as potentially adversarial input, not automatically-trusted context — this is the specific lesson of the GitHub data-heist incident.
- Stay current on server updates; the Anthropic Git MCP server vulnerabilities were fixed once identified, meaning staying on unpatched versions carries real, avoidable risk.
- If building your own MCP server, write tool descriptions carefully and validate all inputs server-side — don't assume the calling model will always pass well-formed, benign arguments.
- Periodically audit which MCP servers are connected across your team and why, rather than letting connections accumulate silently over time.

## Frequently asked questions

**Beginner**

1. **What is MCP in AI?** Model Context Protocol — an open standard for connecting AI models to external tools and data sources ([Anthropic](https://www.anthropic.com/news/model-context-protocol)).
2. **What is a Model Context Protocol server?** A process exposing a set of callable, typed tools that a compatible AI client can discover and invoke during a task.
3. **Who created MCP?** Anthropic introduced it, and has since donated it to an independent Agentic AI Foundation for cross-vendor governance ([Anthropic](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)).
4. **What can you build with an MCP server for coding?** Servers that let an agent manage cloud infrastructure, manipulate GitHub issues/PRs, debug a live browser page, query a database, or call any internal API you expose to it.
5. **Is MCP the same as a plugin or function calling?** No — function calling is a single-provider API mechanism; a closed plugin ecosystem is vendor-controlled; MCP is an open, cross-vendor standard for tool discovery and execution ([Portkey](https://portkey.ai/blog/mcp-vs-function-calling/); [ikangai](https://www.ikangai.com/model-context-protocol-comparison-mcp-vs-function-calling-plugins-apis/)).
6. **Is MCP safe to use with AI coding assistants?** It can be, with careful server selection and permission scoping — but it also introduces a documented, real attack surface, including prompt injection and tool poisoning ([Checkmarx](https://checkmarx.com/zero-post/11-emerging-ai-security-risks-with-mcp-model-context-protocol/)).
7. **Do I need to know how to code to use an MCP server?** No, to use one that already exists — you typically just install/connect it. Building your own does require development work.
8. **Which AI tools support MCP?** ChatGPT, Cursor, Gemini, Microsoft Copilot, and Visual Studio Code, among others, as of 2026 ([digitalapplied.com](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)).
9. **What does an MCP server let Claude specifically do?** The same class of things it lets any MCP-compatible client do — access files, databases, browsers, and third-party services through the tools that server exposes.
10. **Where do I find MCP servers to install?** The official MCP Registry (`registry.modelcontextprotocol.io`) is the current canonical source, having replaced the retired community GitHub list in April 2026 ([modelcontextprotocol.io](https://modelcontextprotocol.io/registry/about)).

**Core understanding**

11. **What problem does MCP actually solve?** It gives AI assistants a standardized way to act on real, current systems instead of only generating suggestions from stale training data ([dev.to — Yigit Konur](https://dev.to/yigit-konur/the-ultimate-mcp-guide-for-vibe-coding-what-1000-reddit-developers-actually-use-2025-edition-11ie)).
12. **How is MCP different from plain function calling?** Function calling is how a model expresses a tool request within one provider's API; MCP standardizes how that request gets discovered and executed across many tools and providers ([Descope](https://www.descope.com/blog/post/mcp-vs-function-calling)).
13. **How is MCP different from ChatGPT-style plugins?** Plugins are a closed, single-vendor toolbox; MCP is an open standard any developer can implement, usable by any compatible client ([ikangai](https://www.ikangai.com/model-context-protocol-comparison-mcp-vs-function-calling-plugins-apis/)).
14. **Why do MCP tool definitions include natural-language descriptions?** So the model can reason about a new tool's purpose and usage without that tool's API being hardcoded into the model's own instructions ([dev.to — Jamie Thompson](https://dev.to/jamie_thompson/mcp-servers-explained-how-ai-assistants-connect-to-your-tools-598o)).
15. **Can an MCP server access my files and database?** Yes, if it's built to expose that access — an MCP server's capabilities are exactly whatever tools its developer chose to expose, nothing more or less by default.
16. **Is MCP a replacement for APIs?** No — an MCP server typically wraps existing APIs or systems, exposing them in a way an AI agent can discover and call; the underlying API or system still has to exist.
17. **Why did Anthropic hand MCP over to an independent foundation?** To position it as durable, vendor-neutral infrastructure rather than a single company's proprietary feature ([Anthropic](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)).
18. **What's the "USB port for AI" analogy actually capturing?** That MCP standardizes the connector between models and tools, so any compatible client can use any compatible server without custom one-off integration work ([dev.to — Jamie Thompson](https://dev.to/jamie_thompson/mcp-servers-explained-how-ai-assistants-connect-to-your-tools-598o)).
19. **Does every AI assistant support MCP?** No — adoption is wide (ChatGPT, Cursor, Gemini, Microsoft Copilot, VS Code) but not universal; check a specific tool's current documentation.
20. **What is the MCP Registry?** The official, centralized metadata repository for publicly accessible MCP servers, backed by contributors including Anthropic, GitHub, PulseMCP, and Microsoft ([modelcontextprotocol.io](https://modelcontextprotocol.io/registry/about)).

**Practical / how-to**

21. **How do I build an MCP server?** Define a set of typed functions with clear natural-language descriptions and expose them via an MCP SDK; scaffolding tools can produce a working server in minutes ([dev.to — ialijr](https://dev.to/ialijr/create-your-first-mcp-server-in-5-minutes-with-create-mcp-server-fch)).
22. **How to connect Claude Code to GitHub via MCP?** Install and configure a GitHub MCP server following its setup documentation, then authorize it with appropriate, narrowly-scoped credentials.
23. **How to set up an MCP server in 5 minutes?** Using a scaffolding tool like `create-mcp-server`, define your tool functions and descriptions, then run it — tutorials demonstrate this exact turnaround time ([dev.to — ialijr](https://dev.to/ialijr/create-your-first-mcp-server-in-5-minutes-with-create-mcp-server-fch)).
24. **How do I secure an MCP server against prompt injection?** Validate all inputs server-side, scope permissions narrowly, and don't assume content the agent reads through the server is safe to treat as trusted instructions.
25. **How do I know which MCP servers are trustworthy?** Prefer the official registry, check maintainer reputation and update history, and avoid granting broad access to unreviewed community servers for anything sensitive.
26. **How do I limit what an MCP server can do?** Expose only the specific functions a task needs, and use scoped credentials (e.g., a read-only API key) rather than broad admin access wherever possible.
27. **How do I debug a web app using an MCP server?** Connect the Chrome DevTools MCP server, which lets the agent inspect console errors, network activity, and performance directly on the running page ([Chrome Developers blog](https://developer.chrome.com/blog/chrome-devtools-mcp)).
28. **How do I audit which MCP servers my team has connected?** Periodically review active connections across tools and credentials, treating this the same as any other third-party integration audit.
29. **How do I update an MCP server after a vulnerability is disclosed?** Apply the maintainer's patched version promptly — the Anthropic Git MCP server flaws were fixed once identified, but only for users who updated.
30. **How do I test an MCP server before relying on it in production workflows?** Run it in a sandboxed or limited-permission environment first, and deliberately test how it behaves with unexpected or adversarial-looking inputs.

**Advanced**

31. **What is "tool poisoning" specifically?** Manipulating a tool's metadata or natural-language description to trick an agent into invoking unauthorized tools or passing unintended arguments ([Checkmarx](https://checkmarx.com/zero-post/11-emerging-ai-security-risks-with-mcp-model-context-protocol/)).
32. **What were the specific flaws found in Anthropic's official Git MCP server?** Three CVEs: a path-validation bypass (CVE-2025-68145), an unrestricted `git_init` (CVE-2025-68143), and an argument-injection flaw in `git_diff`/`git_checkout` (CVE-2025-68144) — which, chained with a filesystem MCP server, could be escalated to remote code execution ([The Register](https://www.theregister.com/security/2026/01/20/anthropic-quietly-fixed-flaws-in-its-git-mcp-server/4676059)).
33. **What are MCP "sampling" attack vectors?** New prompt-injection attack vectors specifically through MCP's sampling mechanism, as documented by Unit 42 researchers ([Unit 42](https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/)).
34. **Can chaining multiple MCP servers increase risk beyond the sum of each server's individual risk?** Yes — the Anthropic Git MCP server case specifically required chaining with a filesystem MCP server to reach remote-code-execution severity, illustrating compounding risk across connected servers.
35. **Does MCP have a formal governance/versioning process now?** Yes — it's now governed by the independent Agentic AI Foundation rather than solely by Anthropic ([Anthropic](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)).

**Comparison**

36. **MCP vs. function calling vs. plugins — which should I use?** They're not mutually exclusive: function calling is how a model expresses intent, MCP standardizes execution across tools, and closed plugins are a vendor-specific alternative to MCP's openness — most modern agentic setups use function calling plus MCP together.
37. **MCP vs. RAG — how do they relate?** RAG retrieves relevant text/context into a prompt; MCP lets a model take actions and query live systems — they solve different problems and are often used together, not as alternatives.
38. **MCP vs. a traditional REST API integration — what's actually gained?** The model can discover and reason about a new MCP-exposed tool from its description at runtime, rather than needing that specific integration hardcoded in advance for every use case.
39. **Official Anthropic MCP servers vs. third-party community servers — which is safer?** Official provenance reduces but does not eliminate risk, as the Git MCP server CVEs (found mid-2025, patched December 2025) demonstrate — neither category should be assumed safe by default.
40. **MCP Registry vs. the old community GitHub list — what changed?** The community list was retired April 14, 2026 in favor of the official `registry.modelcontextprotocol.io`, reflecting the ecosystem outgrowing a single static file ([digitalapplied.com](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)).

**Problem/troubleshooting**

41. **My AI agent did something unauthorized after reading external content through MCP — what happened?** Likely a prompt-injection scenario where untrusted content (an issue, a file, a web page) contained instructions the agent followed as if they were legitimate — the documented pattern in the GitHub data-heist case.
42. **An MCP server I'm using was flagged with a vulnerability — what should I do?** Update to the patched version immediately, and review what actions the server took while the vulnerability was live if audit logs are available.
43. **My MCP server keeps failing to connect — what's usually wrong?** Configuration/credential issues are the most common cause; check the server's specific setup documentation and authorization scopes.
44. **I'm worried I've granted an MCP server too much access — how do I check?** Review the specific functions/scopes the server was granted against what the task actually required, and revoke anything broader than necessary.
45. **How do I know if an MCP server I installed is actively maintained?** Check its listing on the official registry for update history and maintainer activity — an unmaintained server is a growing risk as the ecosystem and underlying platforms evolve.

**Commercial/decision**

46. **Should my team adopt MCP servers now, or wait?** Given adoption across ChatGPT, Cursor, Gemini, Copilot, and VS Code, and more than 10,000 active public servers, MCP is past the early-experimental stage — but adoption should come with the same security diligence as any third-party integration.
47. **Is it worth building a custom MCP server for our internal tools, or should we stick to public ones?** Custom servers are worthwhile when you need an agent to act on internal systems no public server exposes — the barrier to building one is low, but it still needs the same input-validation and permission-scoping discipline as any other integration.
48. **Should we restrict which MCP servers employees can connect to company AI tools?** Given the documented security incidents, a permission-gated or approved-server-list policy is a reasonable control for any team using MCP with production or sensitive systems.
49. **Is MCP mature enough for enterprise use?** Adoption data (Fortune 500 deployments, major AI product integrations) suggests yes for many use cases, but enterprise adoption should pair with the security controls described above, not treat the protocol's popularity as a substitute for review.
50. **Do we need dedicated security tooling for MCP, or is standard application security enough?** Given MCP-specific attack patterns like tool poisoning and sampling-based prompt injection, general application security practices are a starting point, but MCP-aware review (checking tool descriptions, permission scopes, and how untrusted content flows into the agent) is increasingly treated as its own discipline.

## Key takeaways

- An MCP server exposes typed, discoverable tools an AI agent can call — it's the standardized connector between models and real systems, not a single vendor's proprietary feature.
- MCP differs from function calling (a single-provider mechanism) and from closed plugin ecosystems (vendor-controlled) by being an open, cross-vendor standard now governed by an independent Agentic AI Foundation.
- Real capabilities are concrete and already in wide use: Kubernetes, GitHub, and AWS management, and live browser debugging via Chrome DevTools.
- The security risk is real and documented, not theoretical — including flaws in Anthropic's own official Git MCP server and a documented GitHub prompt-injection data-heist incident.
- With more than 10,000 active public servers and adoption across ChatGPT, Cursor, Gemini, Copilot, and VS Code, MCP is now mainstream infrastructure — treat server selection and permission scoping as a genuine security decision, not a configuration afterthought.

## Relevant tools.scult.in resources

If you're experimenting with MCP servers that process structured data — API responses, tool outputs, configuration payloads — the [JSON Formatter & Validator](/dev/json-formatter) is a quick way to inspect and validate that data in your browser before wiring it into an agent workflow. For prompt patterns around agentic and tool-using workflows, the [Claude](/prompts/claude), [ChatGPT](/prompts/chatgpt), and [Cursor](/prompts/cursor) prompt libraries have relevant starting points.

If your team is evaluating or building custom MCP servers to connect internal systems to an AI coding assistant — and wants the permission-scoping and security review done properly from the start rather than retrofitted after an incident — that's exactly the kind of agentic-workflow setup [SCULT's AI agents & automation service](https://scult.in/services/ai-agents-automation) is built to help with.

## Sources

- https://www.anthropic.com/news/model-context-protocol
- https://dev.to/jamie_thompson/mcp-servers-explained-how-ai-assistants-connect-to-your-tools-598o
- https://dev.to/yigit-konur/the-ultimate-mcp-guide-for-vibe-coding-what-1000-reddit-developers-actually-use-2025-edition-11ie
- https://portkey.ai/blog/mcp-vs-function-calling/
- https://www.descope.com/blog/post/mcp-vs-function-calling
- https://www.ikangai.com/model-context-protocol-comparison-mcp-vs-function-calling-plugins-apis/
- https://developer.chrome.com/blog/chrome-devtools-mcp
- https://checkmarx.com/zero-post/11-emerging-ai-security-risks-with-mcp-model-context-protocol/
- https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/
- https://www.docker.com/blog/mcp-horror-stories-github-prompt-injection/
- https://dev.to/ialijr/create-your-first-mcp-server-in-5-minutes-with-create-mcp-server-fch
- https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol
- https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation
- https://modelcontextprotocol.io/registry/about
- https://www.theregister.com/security/2026/01/20/anthropic-quietly-fixed-flaws-in-its-git-mcp-server/4676059
