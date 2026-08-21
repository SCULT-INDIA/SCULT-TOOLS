import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = "check-if-ai-crawlers-can-access-my-site"
const SERVICE_WEB_DEVELOPMENT = resolveServiceLink("web-development", SLUG)

/**
 * Generated from content-engine/05-drafts/article_006.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "How to Check If GPTBot, ClaudeBot, or Google-Extended Can Access Your Site",
  h1: "How to Check If GPTBot, ClaudeBot, or Google-Extended Can Access Your Site",
  targetKeyword: "check if ai crawlers can access my site",
  description: "A practical guide to verifying AI crawler access using robots.txt checks, server logs, and dedicated checker tools — plus why robots.txt alone isn't enough.",
  dek: "You verify AI crawler access three ways: read your robots.txt line by line for GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, and Claude-User directives; check your server logs for those user agents actually hitting your pages and returning HTTP 200 rather than 403/404; and run a dedicated AI crawler access checker that simulates real crawler requests, since robots.txt alone only shows declared intent — a CDN or WAF can silently block a crawler that robots.txt technically allows.",
  sections: [
    {
      heading: "The three-layer check: robots.txt, logs, and live requests",
      body: [
        [{ text: "Layer 1: robots.txt.", bold: true }, " Start by reading your site's `/robots.txt` file directly and checking, line by line, which AI-related user agents are explicitly allowed or disallowed. Free checker tools like the one from Mrs. Digital and LLM Pulse's robots.txt checker automate exactly this — parsing the file and reporting each bot's status against your declared rules (", { text: "Mrs. Digital", href: "https://mrs.digital/tools/ai-crawler-access-checker/", external: true }, "; ", { text: "LLM Pulse", href: "https://llmpulse.ai/robots-txt-checker", external: true }, ")."],
        [{ text: "Layer 2: server logs.", bold: true }, " Robots.txt only tells you what you've declared; your server logs tell you what actually happened. Search your access logs for AI bot user-agent strings — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot — and check the HTTP status code returned for each hit. A 200 means the request succeeded; a 403 or 404 means it was blocked or the page wasn't found, even if robots.txt technically allows the bot (", { text: "LLM Pulse", href: "https://llmpulse.ai/blog/website-ai-bot-access/", external: true }, ")."],
        [{ text: "Layer 3: live simulated requests.", bold: true }, " The most thorough check goes beyond static file parsing entirely. Some dedicated tools send requests that mimic the actual crawlers (matching their user-agent strings and request patterns) and analyze the live response your server returns — which catches CDN- or WAF-level blocks that a robots.txt read alone would never reveal, because those tools happen at a different layer of your infrastructure than the file that declares your intent (", { text: "Siftly", href: "https://siftly.ai/free-tools/crawler-audit", external: true }, ")."],
        ["For a quick manual sanity check specifically on the ChatGPT question, you can also just ask ChatGPT (with web browsing/search enabled) to describe or summarize a specific page on your site and see whether it can actually retrieve current content, rather than falling back on stale training knowledge (", { text: "Scorecraft", href: "https://scorecraft.ai/blog/how-to-check-if-chatgpt-can-see-your-website", external: true }, ")."],
      ],
    },
    {
      heading: "The full 2026 AI crawler landscape",
      body: [
        ["As of 2026, there are roughly a dozen or more distinct AI-related bots worth knowing about, and they fall into two functionally different categories that matter for this check:"],
        [{ text: "Training crawlers", bold: true }, " — collect content to train future models, generally not tied to live citation in any specific answer:"],
        ["– ", { text: "GPTBot", bold: true }, " (OpenAI)", " ", "– ", { text: "ClaudeBot", bold: true }, " (Anthropic)", " ", "– ", { text: "Google-Extended", bold: true }, " (Google — a control token, not a distinct crawler; see below)"],
        ["– ", { text: "CCBot", bold: true }, " (Common Crawl, used by many downstream AI labs)"],
        [{ text: "Search/retrieval crawlers", bold: true }, " — fetch content specifically to answer live user queries with citations, meaning blocking these directly affects your eligibility to be cited in that engine's answers:"],
        ["– ", { text: "OAI-SearchBot", bold: true }, " and ", { text: "ChatGPT-User", bold: true }, " (OpenAI)", " ", "– ", { text: "Claude-SearchBot", bold: true }, " and ", { text: "Claude-User", bold: true }, " (Anthropic)"],
        ["– ", { text: "PerplexityBot", bold: true }, " (Perplexity)", " ", "The distinction matters enormously for strategy: a site can reasonably choose to block the training-only crawlers (to keep content out of future model training data) while explicitly allowing the search/retrieval crawlers (to remain eligible for citation in live AI answers) — these are not the same decision, even though both categories technically fall under \"AI bots\" (", { text: "No Hacks", href: "https://nohacks.co/blog/ai-user-agents-landscape-2026", external: true }, "; ", { text: "DataImpulse", href: "https://dataimpulse.com/blog/robots-txt-ai-crawlers/", external: true }, ")."],
        ["Blocking OAI-SearchBot, Claude-SearchBot, or PerplexityBot specifically removes your eligibility for citation in those platforms' live answer surfaces — a separate consequence from blocking GPTBot or ClaudeBot, which only affects future training data (", { text: "OpenAI", href: "https://developers.openai.com/api/docs/bots", external: true }, "; ", { text: "DataImpulse", href: "https://dataimpulse.com/blog/robots-txt-ai-crawlers/", external: true }, ")."],
      ],
    },
    {
      heading: "Why robots.txt alone can lie to you",
      body: [
        ["Robots.txt is, technically, a voluntary request. It's standardized (RFC 9309) and well-behaved crawlers from major labs generally honor it, but the file itself carries no legal enforcement mechanism and doesn't actually block anything at the network level — real enforcement happens at your server or CDN/WAF layer, or it doesn't happen at all if the crawler chooses to ignore the file."],
        ["This creates two distinct failure modes that a robots.txt-only check will miss entirely:"],
        ["1. ", { text: "A mismatch where robots.txt allows a bot but your CDN/WAF blocks it anyway.", bold: true }, " A 2026 analysis of robots.txt configurations across Cloudflare's network found this kind of mismatch to be a documented, common occurrence — bot-fight-mode settings or generic WAF rules can silently block crawlers that the site's own robots.txt technically permits (", { text: "TechnologyChecker.io", href: "https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report", external: true }, ")."],
        ["2. ", { text: "Undeclared, non-compliant crawling.", bold: true }, " Cloudflare published evidence in 2025 that Perplexity specifically was using undeclared crawlers that rotated user-agents, IPs, and ASNs specifically to evade robots.txt-based blocking — meaning even a correctly configured robots.txt disallow doesn't guarantee that specific vendor actually stays away (", { text: "reported via multiple 2026 AI-crawler guides", href: "https://dataimpulse.com/blog/robots-txt-ai-crawlers/", external: true }, ")."],
        ["Both scenarios are exactly why a \"read the robots.txt file and call it done\" check is insufficient, and why log analysis or a live-request-simulating tool is the more trustworthy layer of verification."],
      ],
    },
    {
      heading: "Verifying a bot is genuine, not spoofed",
      body: [
        ["A related but distinct problem: seeing \"GPTBot\" or \"ClaudeBot\" in your logs doesn't automatically mean the real bot visited — user-agent strings are trivial to spoof. The reliable verification method is cross-checking the requester's actual IP address against the crawler operator's officially published IP ranges, not trusting the user-agent header alone."],
        ["– OpenAI publishes official IP ranges and documents that changes to your robots.txt take about ", { text: "24 hours", bold: true }, " to propagate and be honored by OAI-SearchBot (", { text: "OpenAI", href: "https://developers.openai.com/api/docs/bots", external: true }, ")."],
        ["– Anthropic similarly publishes official IP ranges for ClaudeBot, with the explicit caveat that blocking guarantees are limited to genuine requests from those ranges — a spoofed user-agent from a different IP isn't something robots.txt can stop (", { text: "Anthropic support", href: "https://support.claude.com/en/articles/8896518", external: true }, ")."],
        ["If GPTBot shows up in your logs despite a disallow rule, the most likely explanations, in rough order of likelihood, are: the 24-hour propagation delay hasn't elapsed yet, a spoofed user agent from an unrelated IP, or a mismatch between your robots.txt and your CDN/WAF configuration (", { text: "OpenAI", href: "https://developers.openai.com/api/docs/bots", external: true }, "; ", { text: "TechnologyChecker.io", href: "https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report", external: true }, ")."],
        ["Google-Extended deserves a specific callout here: unlike the other bots on this list, it has ", { text: "no separate crawling user-agent string of its own", bold: true }, " — it's purely a robots.txt control token layered on top of Google's existing crawler infrastructure (the same infrastructure Googlebot uses). That means you cannot verify Google-Extended activity by searching logs for a distinct \"Google-Extended\" user agent the way you can for GPTBot or ClaudeBot; there's nothing distinct to search for (", { text: "PushLeads", href: "https://pushleads.com/google-extended-crawler/", external: true }, ")."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Real, sourced pattern:", bold: true }, " A site owner disallows GPTBot in robots.txt but continues seeing what looks like GPTBot activity in their logs. Following OpenAI's and the broader industry guidance above, the correct diagnostic sequence is: (1) confirm the robots.txt change is more than 24 hours old, (2) cross-check the requesting IPs against OpenAI's published GPTBot IP ranges rather than trusting the user-agent string, (3) if the IPs don't match, treat it as a spoofed or unrelated bot rather than an OpenAI compliance failure (", { text: "OpenAI", href: "https://developers.openai.com/api/docs/bots", external: true }, ")."],
        [{ text: "Illustrative example (hypothetical, clearly labeled):", bold: true }, " A marketing team wants their blog cited by ChatGPT and Perplexity but doesn't want their long-form guides used for model training. The correct robots.txt configuration for this specific goal is to disallow GPTBot and ClaudeBot (training crawlers) while explicitly allowing OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, and PerplexityBot (search/retrieval crawlers) — a nuanced, four-line-minimum configuration that a simple \"block all AI bots\" rule would get wrong by accidentally removing citation eligibility along with training-data exclusion."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– OAI-SearchBot robots.txt changes take approximately 24 hours to propagate, per OpenAI's own documentation (", { text: "OpenAI", href: "https://developers.openai.com/api/docs/bots", external: true }, ")."],
        ["– Anthropic recommends verifying ClaudeBot authenticity via published IP ranges rather than user-agent string alone, and notes blocking guarantees apply only to genuine requests from those ranges (", { text: "Anthropic support", href: "https://support.claude.com/en/articles/8896518", external: true }, ")."],
        ["– Google-Extended has no distinct crawler user agent of its own — it is a robots.txt control token on Google's existing crawling infrastructure (", { text: "PushLeads", href: "https://pushleads.com/google-extended-crawler/", external: true }, ")."],
        ["– A 2026 analysis of robots.txt across Cloudflare's network documented real-world mismatches between declared robots.txt rules and actual CDN/WAF-level blocking of AI crawlers (", { text: "TechnologyChecker.io", href: "https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report", external: true }, ")."],
        ["– Cloudflare reported evidence (2025) that Perplexity used undeclared crawlers rotating user-agents, IPs, and ASNs specifically to evade robots.txt blocking (", { text: "reported via DataImpulse and other 2026 AI-crawler guides", href: "https://dataimpulse.com/blog/robots-txt-ai-crawlers/", external: true }, ")."],
        ["– Evidence not sufficiently verified: there is no single, universally agreed count of \"how many websites\" are affected by CDN/robots.txt mismatches — the Cloudflare-network analysis describes the pattern as common but does not appear to state a precise, independently reproduced percentage applicable to the entire web."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        ["Check method: Reading robots.txt manually · What it actually verifies: Declared intent (allow/disallow rules) · What it misses: Actual CDN/WAF-level enforcement, spoofed bots"],
        ["Check method: Server log analysis · What it actually verifies: Real requests and their HTTP status codes · What it misses: Requires access to raw logs; doesn't check declared intent"],
        ["Check method: Live-request-simulating checker tool · What it actually verifies: Both declared rules and live server response, closer to real-world behavior · What it misses: Still can't fully replicate every possible network path a real crawler might take"],
        ["Check method: IP range cross-check · What it actually verifies: Whether a specific hit is genuinely from the named crawler · What it misses: Doesn't tell you about access it never attempted"],
        ["Checking robots.txt manually versus using an automated AI crawler audit tool is really a speed/coverage tradeoff: manual reading is free and instant for a single, simple site, but an automated tool that simulates live requests catches the CDN/WAF mismatch class of problems that manual file-reading structurally cannot detect."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["– ", { text: "Publishers debating AI training opt-out", bold: true }, " commonly want GPTBot and ClaudeBot blocked while keeping OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, and PerplexityBot allowed — the nuanced four-plus-line configuration described above, rather than an all-or-nothing block."],
        ["– ", { text: "E-commerce and SaaS marketing teams", bold: true }, " trying to diagnose \"why doesn't ChatGPT know about our product\" often discover, via log analysis, that a WAF rule was silently blocking the relevant search bots despite a permissive robots.txt — exactly the mismatch pattern documented by the Cloudflare-network analysis."],
        ["– ", { text: "Agencies running technical AI-visibility audits", bold: true }, " for clients increasingly include a live-request-simulating crawler check as a standard deliverable, specifically because a robots.txt-only audit would miss real-world blocking that only shows up at the CDN layer."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– ", { text: "Reading robots.txt and stopping there.", bold: true }, " It only shows declared intent, not what's actually happening at the CDN/WAF layer (", { text: "Siftly", href: "https://siftly.ai/free-tools/crawler-audit", external: true }, ")."],
        ["– ", { text: "Trusting a user-agent string in logs without IP verification.", bold: true }, " User agents are trivially spoofable; only an IP-range cross-check confirms a genuine bot visit."],
        ["– ", { text: "Blocking all \"AI bots\" indiscriminately.", bold: true }, " This conflates training crawlers with search/retrieval crawlers, potentially removing citation eligibility you actually wanted to keep."],
        ["– ", { text: "Assuming Google-Extended activity is visible via a distinct user-agent search.", bold: true }, " It isn't — Google-Extended has no separate crawler string of its own."],
        ["– ", { text: "Expecting instant robots.txt propagation.", bold: true }, " OpenAI's documented 24-hour delay means a change you made an hour ago won't yet be reflected in OAI-SearchBot's behavior."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– Run all three layers of the check (robots.txt read, log analysis, live-request tool) rather than relying on any single one."],
        ["– Separate your robots.txt strategy explicitly into training-crawler rules and search/retrieval-crawler rules, since they have different real-world consequences."],
        ["– Cross-check any bot activity you're concerned about against the operator's officially published IP ranges before concluding it's a compliance issue."],
        ["– Re-run your crawler access check periodically, especially after any CDN, WAF, or bot-management configuration change, since those changes can silently override robots.txt intent."],
        ["– Don't rely on a distinct \"Google-Extended\" log search — treat it as a robots.txt-only control and verify via Google's general documentation instead."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– Checking AI crawler access requires three layers: robots.txt (declared intent), server logs (actual requests and status codes), and ideally a live-request-simulating tool (catches CDN/WAF mismatches)."],
        ["– Training crawlers (GPTBot, ClaudeBot) and search/retrieval crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) have different real-world consequences — blocking the latter removes AI-citation eligibility."],
        ["– Robots.txt is voluntary and unenforceable by itself; a documented pattern of CDN/WAF-level mismatches means it can allow a bot on paper while actually blocking it in practice."],
        ["– Google-Extended has no distinct crawler user agent — you cannot verify its activity via a log search the way you can for GPTBot or ClaudeBot."],
        ["– Always verify suspicious bot activity by IP range against the operator's official published list, since user-agent strings are trivially spoofable."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["Run a first check on your own domain with the ", { text: "AI Visibility Checker", href: "/geo/ai-visibility-checker" }, " to see whether AI engines can currently find and cite your content, then work through the robots.txt and server-log layers described in this article to confirm there isn't a CDN-level block hiding behind an otherwise-correct configuration."],
        ["If your site sits behind a CDN or WAF with bot-management rules you're not fully confident about, or you need a proper technical audit across robots.txt, server configuration, and content structure together, that's the kind of cross-layer diagnostic work scult.in's ", { text: "web development team", href: SERVICE_WEB_DEVELOPMENT.href, external: true }, " handles as part of a technical SEO engagement."],
        ["For a related, free starting point, try the ", { text: "Schema Markup Generator", href: "/seo/schema-markup-generator" }, "."],
      ],
    },
  ],
  faq: [
    {
      question: "How can I check if GPTBot can access my website?",
      answer: ["Read your robots.txt for a GPTBot rule, check server logs for GPTBot requests returning HTTP 200, or use a dedicated AI crawler access checker tool (", { text: "Mrs. Digital", href: "https://mrs.digital/tools/ai-crawler-access-checker/", external: true }, ")."],
    },
    {
      question: "Can ChatGPT see my website?",
      answer: ["It depends on whether OAI-SearchBot or ChatGPT-User can reach your pages per your robots.txt and any CDN-level blocks — checker tools test this directly (", { text: "Scorecraft", href: "https://scorecraft.ai/blog/how-to-check-if-chatgpt-can-see-your-website", external: true }, ")."],
    },
    {
      question: "What is GPTBot?",
      answer: ["OpenAI's crawler used to collect content for training future models — a training crawler, not a live search/retrieval bot."],
    },
    {
      question: "What is ClaudeBot?",
      answer: ["Anthropic's crawler, also primarily used for gathering training data rather than live search retrieval."],
    },
    {
      question: "What is Google-Extended?",
      answer: ["A robots.txt control token (not a distinct crawler) that lets site owners opt certain content out of use for training Google's generative AI models, layered on Google's existing crawling infrastructure (", { text: "PushLeads", href: "https://pushleads.com/google-extended-crawler/", external: true }, ")."],
    },
    {
      question: "What is PerplexityBot?",
      answer: ["Perplexity's crawler used for live search retrieval to answer user queries with citations."],
    },
    {
      question: "What is OAI-SearchBot?",
      answer: ["OpenAI's crawler specifically for ChatGPT's web-search feature, distinct from the training-focused GPTBot (", { text: "OpenAI", href: "https://developers.openai.com/api/docs/bots", external: true }, ")."],
    },
    {
      question: "Is a free AI crawler checker tool reliable?",
      answer: ["Free tools that parse robots.txt are reliable for that specific layer; some go further and simulate live requests for a more complete picture (", { text: "Siftly", href: "https://siftly.ai/free-tools/crawler-audit", external: true }, ")."],
    },
    {
      question: "Does blocking AI crawlers hurt my SEO rankings?",
      answer: ["Blocking search/retrieval bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot) removes AI-citation eligibility specifically; it's a separate concern from classic Google/Bing organic ranking."],
    },
    {
      question: "Do I need technical skills to check AI crawler access?",
      answer: ["Reading robots.txt requires no special skill; server-log analysis and IP-range cross-checks benefit from some technical familiarity, though checker tools reduce that requirement."],
    },
    {
      question: "What should I look for in server logs to confirm an AI bot successfully crawled my site?",
      answer: ["The bot's user-agent string paired with an HTTP 200 response code on the relevant pages, not a 403 or 404 (", { text: "LLM Pulse", href: "https://llmpulse.ai/blog/website-ai-bot-access/", external: true }, ")."],
    },
    {
      question: "Do free AI crawler checker tools just parse robots.txt, or do they simulate a real crawl?",
      answer: ["Some go further than syntax parsing and send requests mimicking the actual crawlers to analyze the live response, catching CDN/WAF-level blocks (", { text: "Siftly", href: "https://siftly.ai/free-tools/crawler-audit", external: true }, ")."],
    },
    {
      question: "Can I verify Google-Extended access by checking logs for its user agent?",
      answer: ["No — it has no separate crawling user-agent string; it's purely a robots.txt control token on Google's existing infrastructure (", { text: "PushLeads", href: "https://pushleads.com/google-extended-crawler/", external: true }, ")."],
    },
    {
      question: "How long does a robots.txt change take to affect OpenAI's search bot?",
      answer: ["About 24 hours, per OpenAI's own documentation (", { text: "OpenAI", href: "https://developers.openai.com/api/docs/bots", external: true }, ")."],
    },
    {
      question: "Why would GPTBot show up in my logs even though robots.txt disallows it?",
      answer: ["Possible causes: a spoofed user agent (verify against official IP ranges), a mismatch between robots.txt and CDN/WAF settings, or the 24-hour propagation delay not yet having elapsed (", { text: "TechnologyChecker.io", href: "https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report", external: true }, "; ", { text: "OpenAI", href: "https://developers.openai.com/api/docs/bots", external: true }, ")."],
    },
    {
      question: "How do I verify a bot claiming to be ClaudeBot is genuine?",
      answer: ["Cross-check the requester's IP address against Anthropic's officially published IP range list rather than trusting the user-agent header alone (", { text: "Anthropic support", href: "https://support.claude.com/en/articles/8896518", external: true }, ")."],
    },
    {
      question: "Does robots.txt alone tell me whether AI crawlers can really reach my site?",
      answer: ["No — actual reachability also depends on CDN/WAF bot-management settings, which is why dedicated checkers test live requests rather than only parsing the file (", { text: "Siftly", href: "https://siftly.ai/free-tools/crawler-audit", external: true }, "; ", { text: "TechnologyChecker.io", href: "https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report", external: true }, ")."],
    },
    {
      question: "What does an AI Crawler Access Checker tool actually check?",
      answer: ["Typically, it reads your robots.txt line by line and shows which AI/search crawlers are allowed or blocked, sometimes alongside a simulated live fetch (", { text: "Mrs. Digital", href: "https://mrs.digital/tools/ai-crawler-access-checker/", external: true }, ")."],
    },
    {
      question: "Can my site be blocking AI crawlers at the CDN/WAF level even though robots.txt allows them?",
      answer: ["Yes — this mismatch is documented as common in a 2026 analysis of Cloudflare-network robots.txt configurations (", { text: "TechnologyChecker.io", href: "https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report", external: true }, ")."],
    },
    {
      question: "Is robots.txt legally enforceable against AI crawlers?",
      answer: ["No — it's a voluntary, standardized (RFC 9309) request that well-behaved crawlers honor; it carries no legal force by itself."],
    },
    {
      question: "How do I check my robots.txt file directly?",
      answer: ["Visit yourdomain.com/robots.txt in a browser, or run it through a free robots.txt checker tool that flags AI-specific user-agent rules."],
    },
    {
      question: "How do I access my server logs to check for bot activity?",
      answer: ["Through your hosting provider's dashboard, CDN provider's analytics (e.g., Cloudflare), or server-level log files if you manage your own infrastructure."],
    },
    {
      question: "How do I filter server logs specifically for AI bot user agents?",
      answer: ["Search log entries for known user-agent substrings (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Claude-User, etc.) and note the associated status codes."],
    },
    {
      question: "How do I test if Perplexity can crawl my site?",
      answer: ["Check robots.txt for a PerplexityBot rule, search logs for PerplexityBot hits returning 200, or use a checker tool that specifically tests Perplexity's crawler."],
    },
    {
      question: "How do I set up robots.txt to allow citation bots but block training bots?",
      answer: ["Add separate User-agent blocks: Disallow: / under GPTBot and ClaudeBot (training), and Allow: / under OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, and PerplexityBot (search/retrieval)."],
    },
    {
      question: "How do I find OpenAI's official crawler IP ranges?",
      answer: ["OpenAI publishes them in its official crawler documentation, which is the authoritative source to cross-check against rather than relying on user-agent strings alone (", { text: "OpenAI", href: "https://developers.openai.com/api/docs/bots", external: true }, ")."],
    },
    {
      question: "How do I find Anthropic's official crawler IP ranges?",
      answer: ["Anthropic publishes them via its support documentation for site owners wanting to verify or block ClaudeBot (", { text: "Anthropic support", href: "https://support.claude.com/en/articles/8896518", external: true }, ")."],
    },
    {
      question: "How do I check if my CDN is silently blocking AI crawlers?",
      answer: ["Review your CDN or WAF's bot-management settings and rule logs directly, or use a live-request-simulating checker tool that surfaces this mismatch without needing CDN dashboard access."],
    },
    {
      question: "How often should I re-check AI crawler access?",
      answer: ["After any CDN/WAF/bot-management configuration change, and periodically (e.g., quarterly) as new AI bots and policies continue to emerge."],
    },
    {
      question: "How do I know which AI bots even exist to check for?",
      answer: ["Reference an up-to-date AI user-agent landscape guide, since new bots and naming conventions continue to be introduced as the market evolves."],
    },
    {
      question: "Do all AI crawlers respect robots.txt equally?",
      answer: ["No — while major labs generally state they honor robots.txt, Cloudflare reported evidence of undeclared, non-compliant crawling behavior specifically associated with Perplexity in 2025 (", { text: "via DataImpulse", href: "https://dataimpulse.com/blog/robots-txt-ai-crawlers/", external: true }, ")."],
    },
    {
      question: "Is there a difference between blocking a bot for training versus blocking it for search/retrieval?",
      answer: ["Yes — this is one of the most important distinctions in this topic: training-only blocks (GPTBot, ClaudeBot) don't affect live-answer citation eligibility, while blocking search/retrieval bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot) does."],
    },
    {
      question: "Can a spoofed AI bot request bypass my defenses even if I've configured robots.txt correctly?",
      answer: ["Robots.txt alone won't stop a spoofed user agent — you need server- or CDN-level enforcement (rate limiting, IP verification) for actual technical blocking, not just a polite request in a text file."],
    },
    {
      question: "Does using Cloudflare or another CDN change how I should check for AI crawler access?",
      answer: ["Yes — CDN-level bot-management settings can override or interact with your robots.txt rules in ways a simple robots.txt read won't reveal, making the live-request-simulating check more important on CDN-fronted sites."],
    },
    {
      question: "Are there emerging AI bots beyond the ones named in this article I should watch for?",
      answer: ["Likely yes — the AI crawler landscape is described as actively expanding (12+ distinct bots as of 2026), so periodically reviewing an updated bot list is worth doing rather than treating this list as permanently exhaustive."],
    },
    {
      question: "Checking robots.txt manually vs using an automated AI crawler audit tool — which is better?",
      answer: ["Manual reading is free and fine for a quick, simple check; an automated tool that simulates live requests is better for catching CDN/WAF mismatches that manual file-reading can't detect."],
    },
    {
      question: "Server log analysis vs using a checker tool — which gives more confidence?",
      answer: ["Server log analysis shows you real historical traffic directly from your own data; a checker tool gives an instant point-in-time simulated test — using both together gives the most confidence."],
    },
    {
      question: "GPTBot vs OAI-SearchBot — why does OpenAI have two different bots?",
      answer: ["GPTBot collects data for model training; OAI-SearchBot fetches content specifically for ChatGPT's live web-search feature — they serve different purposes and can be allowed/disallowed independently."],
    },
    {
      question: "ClaudeBot vs Claude-SearchBot/Claude-User — same distinction?",
      answer: ["Yes — ClaudeBot is generally associated with training-related crawling, while Claude-SearchBot and Claude-User relate to live search/retrieval functionality, mirroring OpenAI's split."],
    },
    {
      question: "Google-Extended vs Googlebot — are they the same crawler?",
      answer: ["No — Googlebot is Google's general web crawler for search indexing; Google-Extended is a separate robots.txt control token specifically for opting out of generative AI training use, without its own distinct crawling user agent."],
    },
    {
      question: "My site isn't appearing in ChatGPT search results — is crawler access the problem?",
      answer: ["It's one likely cause worth checking first — confirm OAI-SearchBot and ChatGPT-User aren't blocked at either the robots.txt or CDN/WAF layer before investigating content or ranking factors."],
    },
    {
      question: "I'm unsure if ClaudeBot can reach my pages — where do I start?",
      answer: ["Start with a robots.txt read for ClaudeBot and Claude-related rules, then check server logs for actual ClaudeBot hits and their status codes, cross-checking IPs if you see unexpected activity."],
    },
    {
      question: "My CDN or WAF might be accidentally blocking AI crawlers — how do I confirm this?",
      answer: ["Review your CDN/WAF bot-management rules directly, or use a live-request-simulating checker tool, since this class of block won't show up in a robots.txt-only read."],
    },
    {
      question: "AI crawlers are hitting my site more than expected — should I be worried?",
      answer: ["Not necessarily — if the requests are from verified, genuine IP ranges and you want citation eligibility, increased crawling from search/retrieval bots can be a normal and even desirable sign of interest."],
    },
    {
      question: "My robots.txt looks correct but I still don't think I'm cited by AI engines — what else could it be?",
      answer: ["Crawler access is a prerequisite for citation, not a guarantee of it — content quality, structure, and topical authority also affect whether a crawlable page actually gets cited; see our companion articles on the ranking-vs-citation gap and topical authority."],
    },
    {
      question: "Is there a free tool to check AI crawler access to my website right now?",
      answer: ["Yes — tools.scult.in's AI Visibility Checker and several third-party tools mentioned in this article (Mrs. Digital, LLM Pulse, Siftly) offer free or freemium checks."],
    },
    {
      question: "Should I hire someone to configure my robots.txt and CDN settings for AI crawlers correctly?",
      answer: ["It can be worth it if your site sits behind a CDN/WAF with bot-management features you're not fully familiar with, since misconfigurations at that layer are a documented, common source of unintended blocking."],
    },
    {
      question: "Is it worth a full technical SEO audit specifically focused on AI crawler access?",
      answer: ["For sites where AI-driven discovery matters commercially, yes — a dedicated audit catches the multi-layer mismatches (robots.txt vs CDN vs actual logs) that a single quick check would miss."],
    },
    {
      question: "What's the risk of getting this wrong and blocking AI crawlers unintentionally?",
      answer: ["You lose eligibility for citation in AI Overviews, ChatGPT search, and Perplexity answers for that content, even if the rest of your SEO and content strategy is otherwise strong."],
    },
    {
      question: "What's the fastest way to get a first answer today?",
      answer: ["Read your robots.txt for the six key bots (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User, Claude-User/Claude-SearchBot), then run a free checker tool to confirm there's no CDN-level mismatch behind the scenes."],
    },
  ],
  sources: [
    "https://mrs.digital/tools/ai-crawler-access-checker/",
    "https://llmpulse.ai/robots-txt-checker",
    "https://llmpulse.ai/blog/website-ai-bot-access/",
    "https://siftly.ai/free-tools/crawler-audit",
    "https://scorecraft.ai/blog/how-to-check-if-chatgpt-can-see-your-website",
    "https://developers.openai.com/api/docs/bots",
    "https://support.claude.com/en/articles/8896518",
    "https://pushleads.com/google-extended-crawler/",
    "https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report",
    "https://dataimpulse.com/blog/robots-txt-ai-crawlers/",
    "https://nohacks.co/blog/ai-user-agents-landscape-2026",
  ],
  relatedTools: ["ai-visibility-checker", "schema-markup-generator"],
  relatedPrompts: [],
  serviceTarget: "web-development",
  updatedAt: "2026-08-21",
  readingMinutes: 15,
}
