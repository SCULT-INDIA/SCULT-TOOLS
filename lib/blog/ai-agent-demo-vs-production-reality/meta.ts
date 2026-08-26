import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ai-agent-demo-vs-production-reality'
const SERVICE_AI_CONSULTING = resolveServiceLink('ai-consulting', SLUG)

/**
 * Generated from content-engine/05-drafts/article_034.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'AI Agent Demo vs Production Reality: Why Most Agents Break With Real Users',
  h1: 'AI Agent Demo vs Production Reality: Why Most Agents Break With Real Users',
  targetKeyword: 'ai agent demo vs production reality',
  description:
    'Why AI agent demos fall apart with real users — tool selection failures, API timeouts, prompt injection, and what production-ready actually requires.',
  dek: 'A demo AI agent is tested on clean, curated "happy path" inputs; a production agent meets typos, ambiguous phrasing, prompt injection attempts, slow or flaky third-party APIs, and incomplete tool responses it was never exposed to during development. That gap — not the underlying model\'s raw capability — is why industry estimates put the AI agent pilot-to-production failure rate at roughly 88-89%, and why agents that do reach production still succeed on only about 56.6% of individual task runs. This article breaks down the specific, documented failure modes that separate a working demo from a working production system, and what practitioners say actually closes the gap.',
  sections: [
    {
      heading: 'Why the demo-to-production gap exists',
      body: [
        [
          "Demos are built and tested against inputs the developer chose — clean phrasing, well-formed requests, APIs responding quickly and completely. Real users don't cooperate with that. They type in all caps, misspell key terms, ask ambiguous or multi-part questions, and — deliberately or not — sometimes phrase things in ways that look like an attempt to override the agent's instructions (prompt injection). None of that shows up in a demo built and rehearsed by the same person who wrote the prompts.",
        ],
      ],
    },
    {
      heading: 'The documented failure modes',
      body: [
        [
          'A widely cited dev.to breakdown of production AI agent failures groups the recurring problems into a few concrete patterns:',
        ],
        [
          '– ',
          { text: 'Wrong tool selection.', bold: true },
          " An agent asked about hiking trails calls a hotel-booking API instead, because the query's phrasing superficially resembles a travel-booking intent the agent was trained/prompted to recognize.",
        ],
        [
          '– ',
          { text: 'Hallucinated tools.', bold: true },
          ' The agent "calls" a tool that doesn\'t exist in its actual tool registry, producing a broken or nonsensical execution step.',
        ],
        [
          '– ',
          { text: 'Confident answers without tool calls.', bold: true },
          ' The agent skips calling any tool at all and answers from its own (potentially outdated or fabricated) knowledge when a live lookup was actually required.',
        ],
        [
          '– ',
          { text: 'Repeat-call loops.', bold: true },
          ' The agent gets stuck calling the same tool over and over, a pattern also documented as the direct cause of a $400 overnight cost incident in a related write-up.',
        ],
        [
          '– ',
          { text: 'Timeouts on slow third-party APIs.', bold: true },
          ' A flight search that should take 3 seconds can take 30 in the real world; when it does, the agent either times out and hallucinates a plausible-sounding result, or retries repeatedly until the user gives up.',
        ],
        [
          '– ',
          { text: 'Silently picking the best of bad options.', bold: true },
          ' If a tool returns incomplete data and the agent doesn\'t recognize the incompleteness, it still selects the "best" available option from what is effectively a bad menu — producing a confidently wrong answer rather than an honest "I don\'t have enough information."',
        ],
      ],
    },
    {
      heading: 'Is the model the problem, or something else?',
      body: [
        [
          "Multiple independent practitioner write-ups converge on the same answer: usually not. The recurring argument across dev.to pieces analyzing this gap is that the underlying model is rarely the actual bottleneck — the real gap is missing planning, missing guardrails, and inadequate testing for messy, real-world conditions that were never represented in development. A related piece argues explicitly that prompting harder doesn't fix this: unreliable tool outputs, missing error recovery, and adversarial or messy input are structural problems that require engineering — validation, fallback logic, systematic testing — not better wording in the system prompt.",
        ],
        [
          'This reframes the debate in a useful way for teams debugging a struggling agent: the fix is very rarely "use a smarter model" or "write a better prompt," and very often "add the error-handling and validation layer that was never built."',
        ],
      ],
    },
    {
      heading: 'What "production-ready" actually requires',
      body: [
        [
          'A widely discussed Hacker News thread ("What makes an AI agent framework production-ready vs. a toy?") converged on a fairly specific checklist that goes well beyond model quality:',
        ],
        ['– Persistent memory across sessions, not just within a single conversation'],
        ['– Real tool use with error recovery — not just successful-path tool calls'],
        [
          "– Multi-model support, so the system isn't locked to a single provider's availability or pricing",
        ],
        [
          '– An extensibility/plugin system for adding new capabilities without rearchitecting',
        ],
        [
          '– The ability to run as a long-lived service, not just a request-response script',
        ],
        ['– Security boundaries: sandboxing, permission models, and audit logs'],
        [
          'A separate, widely discussed thread framed the underlying reality bluntly, in the form of the question "what makes 5% of AI agents work in production" — a framing that reflects a broad practitioner sense that only a small fraction of attempted agent deployments survive the transition, though the specific 5% figure itself is a discussion framing rather than an independently audited statistic. One commenter in that thread made a related, sharper point: most agentic products today are effectively fancy read-only retrieval systems dressed up as agents, and genuine usefulness — particularly in operational settings — requires giving the agent actual write access to take action, which introduces its own, separate set of safety and trust problems that a read-only demo never has to solve.',
        ],
      ],
    },
    {
      heading: 'How teams are testing for this before shipping',
      body: [
        [
          "The developer behind the $400-overnight incident responded by building a YAML-based evaluation framework specifically to check, before every deploy, that required tool calls actually happen, that cost thresholds aren't exceeded, and that behavior stays consistent across test runs — describing ten consecutive incident-free deploys after adopting it. This is a concrete, practitioner-validated example of closing the demo-to-production gap through systematic pre-deploy testing rather than through better prompting or a more capable model.",
        ],
      ],
    },
    {
      heading: 'Practical examples',
      body: [
        [
          {
            text: 'Example 1 — A support-bot demo that breaks on real tickets.',
            bold: true,
          },
          ' A demo built and tested against ten clean, well-phrased sample tickets works flawlessly. In production, a ticket containing a typo-laden, multi-issue complaint ("wnt refund AND my acount is locked also") causes the agent to address only the first issue it parses, missing the second entirely — a messy-input failure the demo never surfaced because no test ticket looked like that.',
        ],
        [
          { text: 'Example 2 — A travel agent calling the wrong tool.', bold: true },
          ' An agent with both a "hotel_search" and "activity_search" tool receives "what can I do near the coast this weekend" and calls hotel_search because "near the coast" pattern-matches more strongly to its hotel-related training examples than to activity intent — exactly the tool-selection failure mode described above.',
        ],
        [
          { text: 'Example 3 — A data-lookup agent facing a slow API.', bold: true },
          " An agent built against a fast, always-available sandbox API for weather data times out in production against the real weather provider's occasional 20-second response times, and — without explicit handling for that case — either hallucinates a plausible-sounding forecast or loops on retries until the user abandons the session.",
        ],
        [
          '*Illustrative only:* these are constructed scenarios following the documented failure-mode taxonomy above, not confirmed incidents at named companies.',
        ],
      ],
    },
    {
      heading: 'Data and evidence',
      body: [
        [
          '– Failure-mode taxonomy (wrong tool selection, hallucinated tools, confident no-tool-call answers, timeouts, incomplete-data best-of-bad-options): ',
          {
            text: 'dev.to (wassimchegham)',
            href: 'https://dev.to/wassimchegham/why-your-ai-agent-demo-falls-apart-in-production-1320',
            external: true,
          },
          '.',
        ],
        [
          '– Repeat-call loop as a documented, concrete failure and cost driver: ',
          {
            text: 'dev.to (hidai25)',
            href: 'https://dev.to/hidai25/my-ai-agent-cost-me-400-overnight-so-i-built-pytest-for-agents-and-open-sourced-it-492c',
            external: true,
          },
          '.',
        ],
        [
          "– Model quality usually isn't the bottleneck; the gap is planning, guardrails, and testing: ",
          {
            text: 'dev.to (thisismairaj)',
            href: 'https://dev.to/thisismairaj/why-most-ai-demos-fail-in-production-60g',
            external: true,
          },
          ', ',
          {
            text: 'dev.to (paul_martin_1)',
            href: 'https://dev.to/paul_martin_1/why-ai-agents-fail-in-production-and-why-prompting-harder-wont-fix-it-932',
            external: true,
          },
          '.',
        ],
        [
          '– Production-readiness checklist (memory, error-recovery tool use, multi-model support, extensibility, long-lived service, security boundaries): ',
          {
            text: 'Hacker News',
            href: 'https://news.ycombinator.com/item?id=46998170',
            external: true,
          },
          '.',
        ],
        [
          '– "What makes 5% of AI agents work" framing and read-only-RAG-vs-true-agent distinction: ',
          {
            text: 'Hacker News',
            href: 'https://news.ycombinator.com/item?id=45456381',
            external: true,
          },
          '.',
        ],
        [
          '– 88-89% AI agent pilot-to-production failure rate; 56.6% task success rate over 4.5 million runs for agents that do reach production: ',
          {
            text: 'Fiddler AI',
            href: 'https://www.fiddler.ai/blog/ai-agent-failure-rate',
            external: true,
          },
          ', corroborated by ',
          {
            text: 'Digital Applied',
            href: 'https://www.digitalapplied.com/blog/88-percent-ai-agents-never-reach-production-failure-framework',
            external: true,
          },
          '.',
        ],
        [
          '– Runtime failure rates cited in the 70-95% range in production environments, attributed to compounding errors, tool breakdowns, and hallucinations: Fiddler AI.',
        ],
        [
          '– Successfully deployed agents deliver an average 171% ROI (192% in the US) despite the high failure rate: Fiddler AI.',
        ],
        [
          'Evidence not sufficiently verified: the exact "5%" figure referenced in the Hacker News thread title is a discussion framing, not an independently sourced statistic — it\'s included here as evidence of practitioner sentiment about how rare true production success is, not as a verified industry-wide number.',
        ],
      ],
    },
    {
      heading: 'Comparisons',
      body: [
        [
          { text: 'Demo AI agent vs. production AI agent.', bold: true },
          ' A demo is validated against a small, curated set of inputs the developer already knows work; a production agent is validated (or, if under-tested, discovered to be invalid) against the full, uncurated range of real user behavior, third-party API reliability, and adversarial input the developer never anticipated.',
        ],
        [
          { text: 'Happy-path testing vs. real-world input.', bold: true },
          " Happy-path testing confirms the agent works when everything goes as expected; real-world input testing checks what happens when a tool times out, returns incomplete data, or the user's phrasing doesn't match any example the agent was built against — the second category is where nearly all the documented production failures above originate.",
        ],
      ],
    },
    {
      heading: 'Real-world use cases',
      body: [
        [
          'The practitioner-built YAML evaluation framework described above is a concrete example of teams shifting from ad hoc manual testing to systematic pre-deploy checks specifically covering required tool-call behavior, cost thresholds, and output consistency — reported to produce ten consecutive incident-free deploys after adoption. The Hacker News production-readiness discussion reflects a broader pattern of engineering teams treating "is this a toy or a real system" as a checklist question (memory, error recovery, security boundaries) rather than a vibe-based judgment call, which is itself a sign of the field maturing past pure demo-driven development.',
        ],
      ],
    },
    {
      heading: 'Common mistakes',
      body: [
        [
          '– ',
          { text: 'Testing only happy-path inputs.', bold: true },
          " The single most commonly cited root cause across the sources here — demos succeed because they're never exposed to messy real input.",
        ],
        [
          '– ',
          { text: 'No handling for slow or failing third-party APIs.', bold: true },
          ' Timeouts get treated as an edge case rather than a routine occurrence, leading to hallucinated results or infinite retries in production.',
        ],
        [
          '– ',
          { text: 'No validation of tool output completeness.', bold: true },
          ' An agent that can\'t recognize "this data I got back is incomplete" will still confidently pick from a bad menu of options.',
        ],
        [
          '– ',
          { text: 'Assuming a better model fixes structural gaps.', bold: true },
          " Swapping in a more capable model doesn't add error recovery, input validation, or guardrails that were never built.",
        ],
        [
          '– ',
          { text: 'Skipping pre-deploy evaluation entirely.', bold: true },
          ' Shipping directly from "it worked in my demo" to production, without the kind of systematic tool-call/cost/consistency testing described above.',
        ],
        [
          '– ',
          { text: 'Building read-only agents and calling them agents.', bold: true },
          " Confusing a retrieval system with an agent that can actually take action creates a mismatch between what's demoed and what's promised.",
        ],
      ],
    },
    {
      heading: 'Best practices',
      body: [
        [
          '– Build a test suite explicitly including messy, adversarial, and malformed inputs — not just the clean examples used to build the demo.',
        ],
        [
          '– Add explicit handling for slow, failing, or incomplete tool/API responses as a first-class code path, not an afterthought.',
        ],
        [
          '– Give the agent a way to recognize and flag incomplete data rather than silently choosing the best of a bad set of options.',
        ],
        [
          '– Treat "prompting harder" as a signal to stop and add actual engineering (validation, fallback logic, retries with limits) rather than iterating on wording indefinitely.',
        ],
        [
          '– Evaluate against the practitioner-defined production-readiness checklist — persistent memory, error-recovery tool use, multi-model support, extensibility, long-lived service capability, and security boundaries (sandboxing, permissions, audit logs) — before calling something production-ready.',
        ],
        [
          '– Build a systematic pre-deploy evaluation framework (even a simple one) that checks required tool calls happen, cost thresholds hold, and behavior stays consistent run to run.',
        ],
        [
          '– Be honest about whether the system is a read-only retrieval tool or a true agent with write access — the safety and testing bar is different for each.',
        ],
      ],
    },
    {
      heading: 'Key takeaways',
      body: [
        [
          '– The demo-to-production gap is driven by input diversity, not usually model capability — real users introduce typos, ambiguity, and adversarial phrasing that curated demos never test against.',
        ],
        [
          '– The documented failure modes are specific and recurring: wrong tool selection, hallucinated tools, confident no-tool-call answers, timeouts on slow APIs, and silently picking from incomplete data.',
        ],
        [
          '– Roughly 88-89% of piloted AI agents never reach production, and those that do succeed on only about 56.6% of individual task runs.',
        ],
        [
          '– "Prompt harder" doesn\'t fix structural problems — validation, error recovery, and systematic pre-deploy testing do.',
        ],
        [
          '– A practitioner-defined production-readiness checklist (persistent memory, error-recovery tool use, multi-model support, extensibility, long-lived service capability, security boundaries) is a more reliable way to judge readiness than how good the demo looked.',
        ],
      ],
    },
    {
      heading: 'Relevant tools.scult.in resources',
      body: [
        [
          'The ',
          { text: 'AI Agents & RAG', href: '/prompts/ai-engineering' },
          ' prompt collection covers adjacent groundwork worth pairing with the testing practices above — from retrieval design to deployment planning — for teams building toward a genuinely production-ready agent rather than a polished demo.',
        ],
        [
          'If your team has hit exactly this wall — an agent that impressed in the demo room and is now failing on real traffic — that gap between prototype and production-grade system is precisely what ',
          {
            text: "SCULT's AI agents & automation service",
            href: SERVICE_AI_CONSULTING.href,
            external: true,
          },
          ' is built to close, worth a conversation before trying to patch it prompt by prompt.',
        ],
        [
          'For a related, free starting point, try the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          '.',
        ],
      ],
    },
  ],
  faq: [
    {
      question: 'Why does an AI agent that works in a demo fail with real users?',
      answer: [
        'Demos are tested on clean, curated inputs; real users introduce typos, ambiguous phrasing, and even prompt injection attempts the agent was never exposed to during development. (',
        {
          text: 'dev.to',
          href: 'https://dev.to/wassimchegham/why-your-ai-agent-demo-falls-apart-in-production-1320',
          external: true,
        },
        ')',
      ],
    },
    {
      question: 'What is prompt injection, in the context of an AI agent?',
      answer: [
        "An attempt (deliberate or accidental) to phrase input in a way that overrides or manipulates the agent's system instructions rather than making a legitimate request.",
      ],
    },
    {
      question: 'What does "tool selection failure" mean for an AI agent?',
      answer: [
        "The agent calls the wrong tool for the actual intent behind a user's request — for example, calling a hotel-booking API for a hiking-trail question.",
      ],
    },
    {
      question: 'What does "hallucinating a tool" mean?',
      answer: [
        "The agent attempts to call a tool that doesn't actually exist in its registered toolset, producing a broken execution step.",
      ],
    },
    {
      question: 'Why do AI agents sometimes answer confidently without calling any tool?',
      answer: [
        'They can default to answering from internal (potentially outdated) knowledge rather than recognizing that a live lookup was required — a failure mode distinct from, but related to, hallucination.',
      ],
    },
    {
      question: "What happens when an AI agent's tool call times out?",
      answer: [
        "Without explicit handling, the agent may hallucinate a plausible-sounding result or retry repeatedly until the user gives up, since a slow but eventually-successful API response looks identical to a genuinely failed one from the agent's perspective mid-wait.",
      ],
    },
    {
      question: 'What is a repeat-call loop?',
      answer: [
        'A failure state where an agent calls the same tool over and over without resolving, which is also directly implicated in real cost-overrun incidents.',
      ],
    },
    {
      question: 'What percentage of AI agent projects actually reach production?',
      answer: [
        'Industry estimates put the failure rate at roughly 88-89%, meaning only about 11-12% of piloted agents reach production. (',
        {
          text: 'Fiddler AI',
          href: 'https://www.fiddler.ai/blog/ai-agent-failure-rate',
          external: true,
        },
        ')',
      ],
    },
    {
      question: 'What percentage of tasks succeed for agents that do reach production?',
      answer: [
        'One dataset covering 6,259 deployed agents across 4.5 million runs found a 56.6% task success rate.',
      ],
    },
    {
      question:
        'Is the underlying AI model usually the reason agents fail in production?',
      answer: [
        'Practitioner analysis generally says no — the more common culprits are missing planning, missing guardrails, and inadequate testing against real-world conditions.',
      ],
    },
    {
      question:
        'What is the core difference between a demo and a production-ready agent?',
      answer: [
        'A demo is validated against a small set of known-good inputs; a production agent has been engineered to handle the much wider range of messy, adversarial, and unreliable conditions real usage introduces.',
      ],
    },
    {
      question: 'Why can\'t teams just "prompt harder" to fix these failures?',
      answer: [
        'Because the failures are structural — unreliable tool outputs, missing error recovery, adversarial input — and those require engineering fixes (validation, fallback logic, testing), not better wording. (',
        {
          text: 'dev.to',
          href: 'https://dev.to/paul_martin_1/why-ai-agents-fail-in-production-and-why-prompting-harder-wont-fix-it-932',
          external: true,
        },
        ')',
      ],
    },
    {
      question:
        'What does a production-ready agent framework actually need, according to practitioners?',
      answer: [
        'Persistent memory across sessions, real tool use with error recovery, multi-model support, an extensibility system, the ability to run as a long-lived service, and security boundaries like sandboxing and audit logs. (',
        {
          text: 'Hacker News',
          href: 'https://news.ycombinator.com/item?id=46998170',
          external: true,
        },
        ')',
      ],
    },
    {
      question: 'Are most "AI agents" today actually just retrieval systems?',
      answer: [
        'One well-discussed take argues yes — many agentic products are effectively read-only RAG systems, and real usefulness in operational contexts requires actual write access, which raises separate safety concerns.',
      ],
    },
    {
      question:
        'Why does incomplete tool data cause wrong answers instead of an honest "I don\'t know"?',
      answer: [
        "Because many agents aren't built to detect that the data they received is incomplete — they simply select the best option from what's available, producing a confidently wrong answer.",
      ],
    },
    {
      question: 'How do I test an AI agent before production to catch these failures?',
      answer: [
        'Build test cases from messy, real-world-style input (typos, ambiguity, adversarial phrasing) rather than only clean examples, and add automated checks for required tool calls, cost limits, and output consistency.',
      ],
    },
    {
      question: 'How do I handle messy user input in an AI agent?',
      answer: [
        "Add input normalization/validation as an explicit step before the agent reasons over it, and design fallback behavior for input the agent can't confidently interpret rather than letting it guess.",
      ],
    },
    {
      question: 'How do I prevent an AI agent from calling the wrong tool?',
      answer: [
        'Tighten tool descriptions and routing logic so intents that superficially resemble each other (e.g., travel-adjacent phrasing) are disambiguated before tool selection, and test explicitly against near-miss phrasing.',
      ],
    },
    {
      question: 'How do I stop an agent from getting stuck in a repeat-call loop?',
      answer: [
        'Add a circuit breaker that halts execution after a defined number of repeated identical (or near-identical) tool calls within a session.',
      ],
    },
    {
      question:
        'How do I handle a slow or failing third-party API inside an agent workflow?',
      answer: [
        'Set explicit timeout and retry-with-limit behavior, and design the agent to communicate uncertainty ("I couldn\'t get a response in time") rather than defaulting to a hallucinated answer.',
      ],
    },
    {
      question:
        'Advanced: how do you give an agent the ability to recognize incomplete tool output?',
      answer: [
        "By having the tool's response schema explicitly signal completeness/confidence, and building the agent's reasoning step to check that signal before selecting an answer, rather than treating any returned data as equally trustworthy.",
      ],
    },
    {
      question:
        'Advanced: what does "error recovery" mean in a production-ready tool-use loop, specifically?',
      answer: [
        'The ability for the agent to detect a failed or partial tool call and take a defined next step — retry, fall back to an alternate tool, or explicitly surface the failure to the user — rather than silently proceeding as if the call succeeded.',
      ],
    },
    {
      question:
        'Advanced: what security boundaries does a genuinely production-ready agent need?',
      answer: [
        'Sandboxing for any code/action execution, a permission model limiting what actions the agent can take without further authorization, and audit logging of every action taken — per the Hacker News production-readiness checklist.',
      ],
    },
    {
      question:
        'Advanced: how do you build a systematic pre-deploy evaluation framework for an agent?',
      answer: [
        "One documented approach uses YAML-defined test cases checking that required tool calls occur, cost thresholds aren't exceeded, and behavior is consistent across repeated runs — treating agent evaluation like a test suite rather than manual spot-checking.",
      ],
    },
    {
      question:
        "Advanced: what's the difference in risk profile between a read-only agent and a write-access agent?",
      answer: [
        "A read-only (retrieval-style) agent's worst failure is a wrong answer; a write-access agent's worst failure is an unwanted real-world action, which raises the testing and guardrail bar substantially.",
      ],
    },
    {
      question:
        "Demo testing vs. production testing — what's the actual difference in scope?",
      answer: [
        'Demo testing validates a curated set of expected inputs; production testing must cover messy, ambiguous, adversarial, and failure-mode inputs the demo never encountered.',
      ],
    },
    {
      question:
        'Happy-path testing vs. adversarial testing — which catches more real failures?',
      answer: [
        "Adversarial and messy-input testing catches the failure modes documented above (tool misselection, timeouts, incomplete-data handling); happy-path testing, by definition, doesn't exercise those paths at all.",
      ],
    },
    {
      question:
        'Read-only retrieval agent vs. true action-taking agent — which is riskier to deploy?',
      answer: [
        'A true action-taking agent is riskier, since its failures can produce real-world consequences beyond a wrong answer, requiring stronger guardrails and testing.',
      ],
    },
    {
      question:
        'Better model vs. better engineering — which actually fixes production failures?',
      answer: [
        'Practitioner consensus across the sources here leans strongly toward better engineering (validation, error handling, testing) over simply upgrading the model, since most documented failures are structural rather than raw-capability problems.',
      ],
    },
    {
      question:
        'Manual QA vs. automated pre-deploy evaluation — which is more reliable for agents?',
      answer: [
        'Automated, repeatable evaluation (checking required tool calls, cost limits, and consistency) is generally more reliable than manual QA alone, since agent behavior can vary run to run in ways manual spot-checks are likely to miss.',
      ],
    },
    {
      question:
        "My agent works perfectly in testing but fails constantly with real users — what's the first thing to check?",
      answer: [
        'Compare your test inputs against actual user queries — if your tests are all clean, well-formed examples, start there; this is the single most common root cause documented across the sources.',
      ],
    },
    {
      question:
        'My agent keeps calling the wrong tool for certain phrasings — how do I fix it?',
      answer: [
        "Identify the specific near-miss phrasings causing misrouting, tighten your tool descriptions/routing logic around those cases, and add them explicitly to your test suite so future changes don't regress.",
      ],
    },
    {
      question:
        'My agent times out constantly against a specific third-party API — what should I do?',
      answer: [
        'Add explicit timeout handling with a defined fallback response, rather than letting the agent hallucinate or retry indefinitely when that specific dependency is slow.',
      ],
    },
    {
      question:
        'My agent answered confidently but the answer was wrong because the data was incomplete — how do I catch this?',
      answer: [
        'Add a completeness/confidence check on tool responses before the agent uses that data to answer, so the agent can flag uncertainty instead of presenting a partial answer as definitive.',
      ],
    },
    {
      question:
        'My agent got stuck in a loop and burned through budget — how do I prevent a recurrence?',
      answer: [
        'Add a circuit breaker capping repeated identical tool calls, and add that scenario explicitly to your pre-deploy evaluation suite going forward.',
      ],
    },
    {
      question:
        'My agent handled a prompt-injection-style input in an unexpected way — what does that mean?',
      answer: [
        "It means your input handling doesn't yet distinguish between legitimate user requests and attempts (deliberate or accidental) to override system instructions — this needs explicit input validation and system-prompt hardening, not just a patch to the specific phrasing that triggered it.",
      ],
    },
    {
      question:
        'Our demo impressed leadership but production usage is full of edge-case failures — is this normal?',
      answer: [
        "Yes — this is the exact, widely documented gap this article describes; it's a sign the system needs the engineering (validation, error recovery, testing) layer, not necessarily a sign the underlying approach is wrong.",
      ],
    },
    {
      question:
        'Our agent only has read access to data but leadership wants it to take actions — what changes?',
      answer: [
        'The testing and guardrail requirements increase substantially, since action-taking failures have real-world consequences beyond a wrong answer — expect to need sandboxing, permission models, and audit logging before shipping that capability.',
      ],
    },
    {
      question:
        'Should we invest in a dedicated agent-testing/evaluation framework, or is manual QA enough at our scale?',
      answer: [
        'For any agent handling real user traffic with meaningful cost or reputational exposure, a systematic evaluation framework (even a simple one) is worth the investment — the practitioner example cited here reported ten consecutive incident-free deploys after adopting one.',
      ],
    },
    {
      question:
        'Is it worth hiring for AI agent reliability engineering specifically, or is this a general engineering skill?',
      answer: [
        "Given how consistently the same specific failure modes (tool selection, timeouts, incomplete data, loops) recur across independent sources, there's a reasonable case for treating this as a distinct skill set worth deliberately building or hiring for, rather than assuming general engineering experience automatically covers it.",
      ],
    },
    {
      question: 'Is our agent actually production-ready, or still effectively a toy?',
      answer: [
        "Check it against the practitioner-defined checklist: persistent memory, error-recovery tool use, multi-model support, extensibility, long-lived service capability, and security boundaries — falling short on several of these is a signal it's not yet production-ready regardless of how good the demo looked.",
      ],
    },
    {
      question:
        'Should we delay launch to build a proper evaluation framework, or ship and iterate?',
      answer: [
        'Given how directly a lack of pre-deploy evaluation is tied to the documented cost and reliability incidents above, building at least a minimal evaluation framework before launch is the safer default, especially for anything with real cost or safety exposure.',
      ],
    },
    {
      question:
        'Is a read-only agent enough for our use case, or do we need write access?',
      answer: [
        'This depends on whether the value proposition requires the agent to take action rather than just surface information — if so, budget for the substantially higher testing and guardrail requirements that come with write access.',
      ],
    },
    {
      question:
        'How do we decide whether our production failures are a model problem or an engineering problem?',
      answer: [
        'Given that practitioner consensus attributes most production failures to missing planning, guardrails, and testing rather than model capability, start by auditing your error-handling and validation layer before considering a model change.',
      ],
    },
    {
      question:
        'Is it worth the engineering investment to build multi-model support into our agent architecture?',
      answer: [
        "The Hacker News production-readiness checklist lists this as a hallmark of a mature framework, mainly for resilience against single-provider outages or pricing changes — worth prioritizing once the agent is handling meaningful production traffic, even if it's not the first thing to build.",
      ],
    },
    {
      question:
        "What's the fastest way to find out if our agent is actually production-ready before a full launch?",
      answer: [
        'Run it against a test set deliberately built from messy, ambiguous, and adversarial inputs rather than your original demo examples, and see which of the documented failure modes above actually show up.',
      ],
    },
    {
      question:
        'Should we build our own agent evaluation framework or use an existing one?',
      answer: [
        'Evidence not sufficiently verified on specific named evaluation tools beyond the practitioner-built YAML framework described in the sources — evaluate available options against your specific need to check tool-call correctness, cost thresholds, and output consistency.',
      ],
    },
    {
      question:
        "What's a reasonable first investment for a team that just discovered their agent isn't production-ready?",
      answer: [
        'Start with the two highest-leverage, well-documented fixes: a circuit breaker for tool-call loops, and a basic pre-deploy evaluation suite covering messy/adversarial inputs — both are directly tied to real, documented incidents above.',
      ],
    },
    {
      question:
        'Is it worth bringing in outside help to close the demo-to-production gap, or is this purely an internal engineering task?',
      answer: [
        "It can be either, depending on internal bandwidth and experience with this specific class of problem — teams without prior experience building production agent guardrails sometimes find it faster to bring in specialists who've already built the error-handling and evaluation patterns described here.",
      ],
    },
    {
      question:
        "What's the single best predictor that an agent will survive contact with real users?",
      answer: [
        "Whether it's been tested against messy, ambiguous, and adversarial input — not whether the demo looked impressive against curated examples, which the sources here consistently show is a poor predictor of production reliability.",
      ],
    },
  ],
  sources: [
    'https://dev.to/wassimchegham/why-your-ai-agent-demo-falls-apart-in-production-1320',
    'https://dev.to/paul_martin_1/why-ai-agents-fail-in-production-and-why-prompting-harder-wont-fix-it-932',
    'https://dev.to/thisismairaj/why-most-ai-demos-fail-in-production-60g',
    'https://news.ycombinator.com/item?id=46998170',
    'https://news.ycombinator.com/item?id=45456381',
    'https://dev.to/hidai25/my-ai-agent-cost-me-400-overnight-so-i-built-pytest-for-agents-and-open-sourced-it-492c',
    'https://www.fiddler.ai/blog/ai-agent-failure-rate',
    'https://www.digitalapplied.com/blog/88-percent-ai-agents-never-reach-production-failure-framework',
  ],
  relatedTools: ['ai-visibility-checker'],
  relatedPrompts: [],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-21',
  readingMinutes: 16,
}
