import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = "robots-txt-ai-crawler-directives"
const SERVICE_AI_CONSULTING = resolveServiceLink("ai-consulting", SLUG)

/**
 * Generated from content-engine/05-drafts/article_011.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "Robots.txt AI Crawler Directives: What GPTBot, ClaudeBot & PerplexityBot Actually Respect",
  h1: "Which robots.txt directives do AI crawlers like GPTBot, ClaudeBot, and PerplexityBot actually respect?",
  targetKeyword: "robots.txt ai crawler directives",
  description: "A practical guide to which AI crawlers honor robots.txt, which don't, and how to write directives that separate AI training from AI search.",
  dek: "Most named AI crawlers — GPTBot, ClaudeBot, OAI-SearchBot, and Claude-SearchBot — publicly commit to reading and honoring `robots.txt`, and you can verify their identity by matching request IPs against each company's published IP ranges. But robots.txt itself remains an honor-system protocol with no technical enforcement, and Perplexity has been documented by Cloudflare fetching pages from domains that disallowed all bots, arguing its real-time \"agent\" fetching isn't a crawler bound by the same rules. The practical fix is to stop treating \"AI bots\" as one category: block the training crawlers, allow the search/citation crawlers, and verify by IP rather than trusting the user-agent string alone.",
  sections: [
    {
      heading: "Why \"block all AI bots\" is the wrong question",
      body: [
        ["Every AI lab now runs at least two, often three, distinct crawlers with different jobs: one gathers training data, one fetches a page live because a user's question needs it, and one indexes content the way a search engine does. Writing a robots.txt rule that says `User-agent: *` and disallows everything treats all three the same, which usually isn't what a site owner actually wants. A local business that wants to show up when someone asks ChatGPT or Perplexity \"who does X near me\" needs the search/retrieval crawlers to reach its pages, even if it doesn't want its blog scraped wholesale into a training corpus."],
        ["The correct mental model is a spreadsheet with two axes: purpose (training vs. search vs. user-triggered fetch) and company (OpenAI, Anthropic, Google, Perplexity, Apple, Common Crawl). Each cell has its own user-agent string, and robots.txt lets you set a different rule for each one."],
      ],
    },
    {
      heading: "The crawler family tree: training, search, and agent bots",
      body: [
        ["Across the major labs, the pattern repeats almost identically:"],
        ["– ", { text: "Training crawler", bold: true }, " — GPTBot (OpenAI), ClaudeBot (Anthropic), Google-Extended (Google), CCBot (Common Crawl, whose dataset several labs train on), Applebot-Extended (Apple). These systematically crawl and store content to build or fine-tune a model."],
        ["– ", { text: "Search/retrieval crawler", bold: true }, " — OAI-SearchBot (OpenAI), Claude-SearchBot (Anthropic), PerplexityBot (Perplexity). These build the index that powers \"search\" features inside the respective chat product, closer in spirit to Googlebot than to a training scraper."],
        ["– ", { text: "User-triggered fetch agent", bold: true }, " — ChatGPT-User (OpenAI), Claude-User (Anthropic), Perplexity-User (Perplexity). These fire only when a live user's question requires fetching a specific page in real time, not on a systematic crawl schedule."],
        ["This three-way split matters because a site can, in principle, disallow the first category, allow the second, and leave the third as a judgment call — all inside the same robots.txt file, using three separate `User-agent` blocks."],
      ],
    },
    {
      heading: "OpenAI's crawlers: GPTBot, ChatGPT-User, OAI-SearchBot",
      body: [
        ["OpenAI's own developer documentation confirms the split: GPTBot crawls for model training, OAI-SearchBot indexes pages to power ChatGPT's search feature, and ChatGPT-User fetches a page on demand when a user's prompt requires current information from that specific URL (developers.openai.com/api/docs/bots). OpenAI notes that because ChatGPT-User is triggered by a specific user action rather than run as an autonomous crawl, robots.txt rules may not apply to it in the same way they apply to GPTBot — a distinction worth knowing before you assume a `Disallow` line stops it in every scenario."],
        ["To block GPTBot only (keep training out, keep the site crawlable by everything else):"],
        ["User-agent: GPTBot", " ", "Disallow: /", " ", "To allow OAI-SearchBot so the site is discoverable in ChatGPT's search results while still blocking GPTBot from training:"],
        ["User-agent: GPTBot", " ", "Disallow: /", " ", "User-agent: OAI-SearchBot", " ", "Allow: /"],
      ],
    },
    {
      heading: "Anthropic's crawlers: ClaudeBot, Claude-User, Claude-SearchBot",
      body: [
        ["Anthropic's support documentation lays out the same three-way split: ClaudeBot collects data for training, Claude-User fetches a page when a Claude user's question requires it, and Claude-SearchBot indexes content to improve Claude's search results (support.claude.com/en/articles/8896518). All three are documented as honoring robots.txt. Anthropic also supports the non-standard `Crawl-delay` directive, letting a site slow ClaudeBot down rather than block it outright — useful if the concern is server load rather than data use."],
        ["Anthropic explicitly warns that blocking by IP address is not a reliable substitute for robots.txt: IP ranges change, and a site relying purely on firewall rules can silently lose its \"opt-out\" the next time Anthropic rotates infrastructure. The durable approach is the robots.txt directive plus, if IP-level enforcement is wanted too, checking requests against Anthropic's published, regularly-updated IP list rather than a static block list."],
        ["User-agent: ClaudeBot", " ", "Crawl-delay: 5", " ", "Disallow: /private/", " ", "User-agent: Claude-SearchBot", " ", "Allow: /"],
      ],
    },
    {
      heading: "Google-Extended vs. Googlebot",
      body: [
        ["Google-Extended is one of the more misunderstood tokens on this list. It is not a separate crawler with its own IP range — it's a control token that Googlebot itself checks to decide whether a given page's content can be used for Gemini model training and grounding. Search Engine Land's coverage of its introduction and a follow-up implementation guide both confirm the key point: disallowing Google-Extended has no effect on organic Search inclusion, ranking, or eligibility for AI Overviews, because AI Overviews are generated from the standard Googlebot-indexed corpus, not from a separate Gemini-training crawl (searchengineland.com/google-extended-crawler-432636; growwildagency.com/blog/google-extended-robots-txt-guide/)."],
        ["That means a site owner who wants to opt out of Gemini training while keeping full Google Search and AI Overview visibility can safely add:"],
        ["User-agent: Google-Extended", " ", "Disallow: /", " ", "...without touching the `Googlebot` block at all."],
      ],
    },
    {
      heading: "Perplexity: the disputed case",
      body: [
        ["Perplexity is the clearest example of why robots.txt is described as an honor system rather than an enforcement mechanism. Cloudflare published a detailed report in August 2025 documenting Perplexity accessing freshly created test domains whose robots.txt disallowed all crawlers, allegedly by using undisclosed user agents and rotating IP ranges to route around the block (per AppleInsider's coverage, appleinsider.com/articles/25/08/05/perplexity-defensive-over-ignoring-robotstxt-and-stealing-data). Perplexity's response, covered by Search Engine World, drew a line between a \"bot\" (an autonomous crawler, which it says does respect robots.txt) and an \"agent\" acting on a specific user's behalf in real time, which it argued isn't obligated to honor the same directive (searchengineworld.com/perplexity-responds-to-cloudflare)."],
        ["Practically, this means: PerplexityBot (the indexing crawler) is the one to allow if you want Perplexity search visibility, and it is the one most consistently reported to respect robots.txt. Perplexity-User (the live-fetch agent) is the disputed one — some site owners report it ignoring disallow rules entirely. If a business depends on not being scraped at all, robots.txt alone is not sufficient insurance against Perplexity-User; a CDN/WAF-level block (Cloudflare's managed AI bot blocking, for instance) is the more reliable backstop."],
      ],
    },
    {
      heading: "Apple, Common Crawl, and the rest of the list",
      body: [
        ["Apple's Applebot-Extended works differently from every other token on this list: it is not a crawler at all. Regular Applebot does the actual fetching for Siri, Spotlight, and Safari search; Applebot-Extended is purely a permission flag that Applebot checks to decide whether already-crawled content may be used to train Apple's generative AI features (Apple Intelligence and related developer tools), per Apple's own support documentation (support.apple.com/en-us/119829) and independent coverage of the distinction (cside.com/blog/how-to-block-applebot-extended). Disallowing it does not remove a page from Siri or Spotlight results — it only opts the content out of Apple's model-training pipeline."],
        ["User-agent: Applebot-Extended", " ", "Disallow: /", " ", "CCBot, run by the nonprofit Common Crawl, doesn't power any single AI product directly — it produces the open dataset that several labs use as training input. Because of that indirect-but-real training exposure, CCBot is one of the most frequently disallowed bots in independent robots.txt surveys, often blocked alongside GPTBot and ClaudeBot even by sites that have no direct relationship with a specific AI company."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        ["A mid-size SaaS blog wants to keep appearing in ChatGPT and Perplexity answers (a plausible source of qualified trial signups) but doesn't want its documentation wholesale-scraped into a training set it gets no benefit from. Its robots.txt might read:"],
        ["User-agent: GPTBot", " ", "Disallow: /", " ", "User-agent: ClaudeBot"],
        ["Disallow: /", " ", "User-agent: Google-Extended", " ", "Disallow: /"],
        ["User-agent: CCBot", " ", "Disallow: /", " ", "User-agent: Applebot-Extended"],
        ["Disallow: /", " ", "User-agent: OAI-SearchBot", " ", "Allow: /"],
        ["User-agent: Claude-SearchBot", " ", "Allow: /", " ", "User-agent: PerplexityBot"],
        ["Allow: /", " ", "User-agent: *", " ", "Allow: /", " ", "This is an illustrative configuration, not a claim about any specific real company's file — but it reflects exactly the pattern several of the cited industry guides (dataimpulse.com, pixis.ai) recommend: block training, allow search."],
        ["A news publisher with a hard paywall and a strong stance against AI training, on the other hand, might legitimately disallow every AI user-agent including the search bots, accepting reduced AI-search visibility in exchange for zero content reuse — again, that trade-off is the site owner's call, not a technical default."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["Independent analysis of robots.txt files across Cloudflare's network found GPTBot to be the single most-blocked AI bot, present in roughly 4.7–5.5% of disallow rules site-wide, with CCBot and ClaudeBot close behind at around 4.9–5% (technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report). The same research documented how fast site owners moved once these bots launched: GPTBot rules went from zero to almost 125,000 sites within GPTBot's first month after its August 2023 debut, reaching 578,000 sites by that November; ClaudeBot rules grew from about 2,400 to 30,000 sites within four months of its December 2023 launch. That pace shows robots.txt adoption for AI-specific tokens moved unusually fast compared to typical robots.txt change cycles."],
        ["The same report found a meaningful share of sites had a mismatch between layers: robots.txt said \"allow,\" but the site's CDN or WAF was blocking the same crawler at the network layer anyway — meaning a robots.txt audit alone can give a false sense of what's actually reachable. Independent technical analysis (paulcalvano.com/2025-08-21-ai-bots-and-robots-txt/) reinforces the core caveat underlying all of this: robots.txt compliance is voluntary. Compliant crawlers comply because their operators choose to; nothing in the HTTP protocol forces it."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        [{ text: "Robots.txt vs. Cloudflare-style bot blocking.", bold: true }, " Robots.txt is free, universal, and machine-readable by any crawler that chooses to check it — but it has zero enforcement power. Cloudflare's blog post explaining its one-click AI bot blocking feature makes this exact case: it built network-layer blocking, later split into three separate controls for search, training, and agent crawlers, specifically because robots.txt alone couldn't stop crawlers that decide not to honor it (blog.cloudflare.com/declaring-your-aindependence-block-ai-bots-scrapers-and-crawlers-with-a-single-click/). The two approaches are complementary, not competing: robots.txt as the polite, documented request; a CDN/WAF layer as the actual enforcement backstop for anything that ignores the request."],
        [{ text: "GPTBot vs. ChatGPT-User vs. OAI-SearchBot.", bold: true }, " All three are OpenAI's, but only GPTBot is a systematic training crawl; the other two exist to serve a live user's request, with ChatGPT-User's robots.txt applicability explicitly caveated by OpenAI itself."],
        [{ text: "ClaudeBot vs. Claude-User vs. Claude-SearchBot.", bold: true }, " Structurally identical split to OpenAI's, except Anthropic documents all three as robots.txt-compliant without OpenAI's caveat about user-triggered fetches, and additionally supports `Crawl-delay`."],
        [{ text: "Google-Extended vs. Googlebot.", bold: true }, " Not two crawlers at all — one crawler (Googlebot) checking one extra permission token (Google-Extended) that governs a completely separate downstream use (Gemini training) from the one Googlebot's crawl itself feeds (Search indexing)."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["– ", { text: "A local service business", bold: true }, " wants to appear when someone asks an AI assistant \"best plumber in [city].\" Blocking GPTBot/ClaudeBot/Google-Extended doesn't hurt this goal at all, since those control training, not the retrieval that answers a live local query; allowing OAI-SearchBot, Claude-SearchBot, and PerplexityBot is what actually matters here."],
        ["– ", { text: "A subscription content publisher", bold: true }, " with a hard content-licensing stance blocks every AI crawler category, accepting the trade-off that its content becomes invisible to AI-generated answers entirely, in exchange for stopping bulk reuse of paywalled material by crawlers that do respect the directive."],
        ["– ", { text: "An open-source documentation site", bold: true }, " actively wants AI training crawlers in, on the theory that better-trained models producing accurate answers about its API is a net win for adoption — the opposite configuration from the first two examples, and equally valid depending on business goals."],
        ["– ", { text: "An enterprise with existing Cloudflare infrastructure", bold: true }, " layers Cloudflare's dedicated AI bot controls on top of robots.txt specifically to catch Perplexity-style agents that may not honor the polite request, rather than relying on robots.txt as the sole line of defense."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– Writing one blanket `User-agent: *` rule intended to \"block all AI\" and inadvertently blocking OAI-SearchBot, Claude-SearchBot, and PerplexityBot along with the training crawlers — killing AI-search visibility while chasing a training opt-out."],
        ["– Trusting the user-agent string alone to identify a crawler. Anyone can send a request claiming to be `GPTBot` or `ClaudeBot`; the reliable check is matching the source IP against each company's published, machine-readable IP range list (openai.com/gptbot.json, and Anthropic's equivalent list referenced in its support docs)."],
        ["– Assuming blocking Google-Extended affects Google Search rankings or AI Overview eligibility — it does not, per Google's own clarification."],
        ["– Relying on IP blocking as a permanent substitute for robots.txt, despite Anthropic's explicit warning that IP ranges change and IP-only blocking can silently stop working."],
        ["– Never checking whether the CDN/WAF layer contradicts the robots.txt file — a documented real-world failure mode where sites think they're allowing a crawler while their infrastructure quietly blocks it anyway."],
        ["– Forgetting that Applebot-Extended and Google-Extended are permission tokens, not independent crawlers, and writing rules for them expecting to see a distinct visitor in the server logs (you won't; the parent crawler checks the flag before deciding what to do with content it already fetched)."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– Separate every AI user-agent into its own block rather than lumping them under a wildcard, so training and search/retrieval behavior can be controlled independently."],
        ["– Decide the training-vs-search stance as a business decision first (does AI-search visibility matter to this site's growth?), then translate that decision into directives — don't reverse the order."],
        ["– Verify crawler identity by IP against the official published ranges before trusting logs that show a given user-agent string."],
        ["– Re-check the robots.txt file against actual CDN/WAF/firewall rules periodically; the two layers drift out of sync more often than site owners expect."],
        ["– Use `Crawl-delay` where Anthropic and similar crawlers support it if the concern is server load rather than data use — a less blunt instrument than a full disallow."],
        ["– Treat Perplexity-User and any other \"agent, not bot\" category as a case where robots.txt may not be the effective control; use network-layer blocking if the goal is strict enforcement rather than a polite request."],
        ["– Recheck this list periodically. New tokens (Applebot-Extended, Claude-SearchBot) have been added by major labs multiple times since 2023, and the \"honor system\" list keeps growing."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– AI crawlers split into three functional types — training, search/retrieval, and user-triggered fetch — each independently controllable in robots.txt."],
        ["– Most named crawlers from OpenAI and Anthropic publicly commit to honoring robots.txt; Perplexity's agent-style fetching is the clearest documented exception."],
        ["– Google-Extended and Applebot-Extended are permission tokens, not independent crawlers, and blocking them does not affect standard search visibility."],
        ["– Robots.txt has zero enforcement power; verify crawler identity by IP, and pair it with CDN/WAF-level blocking wherever true enforcement is needed."],
        ["– A blanket \"block all AI\" rule usually backfires for businesses that want AI-search visibility, since it also blocks the search/citation crawlers."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["Before finalizing any AI-crawler robots.txt strategy, run your domain through the ", { text: "AI Visibility Checker", href: "/geo/ai-visibility-checker" }, " to see whether your current configuration and content are actually surfacing in AI-generated answers — the directive is only half the picture; the other half is whether it's producing the visibility outcome you intended."],
        ["If auditing or rewriting robots.txt, checking CDN/WAF conflicts, and setting up ongoing crawler-access monitoring feels like more than an afternoon project, that's exactly the kind of technical SEO and implementation work SCULT.IN's web development team handles for clients who want this configured correctly once rather than revisited every time a new AI crawler shows up."],
        ["If this is a gap worth closing properly rather than patching once, ", { text: "that is exactly the kind of work our team handles", href: SERVICE_AI_CONSULTING.href, external: true }, "."],
        ["For a related, free starting point, try the ", { text: "Schema Markup Generator", href: "/seo/schema-markup-generator" }, "."],
      ],
    },
  ],
  faq: [
    {
      question: "What is robots.txt?",
      answer: ["A plain-text file at a site's root (e.g., `example.com/robots.txt`) that tells well-behaved automated crawlers which parts of the site they may or may not access, and at what pace."],
    },
    {
      question: "Do AI crawlers actually respect robots.txt?",
      answer: ["Most named crawlers from OpenAI and Anthropic publicly commit to honoring it, but robots.txt is voluntary with no technical enforcement, and Perplexity's agent-style fetching has been documented bypassing it (paulcalvano.com/2025-08-21-ai-bots-and-robots-txt/; appleinsider.com/articles/25/08/05/perplexity-defensive-over-ignoring-robotstxt-and-stealing-data)."],
    },
    {
      question: "What is GPTBot?",
      answer: ["OpenAI's crawler that gathers web content to help train its models (developers.openai.com/api/docs/bots)."],
    },
    {
      question: "What is ClaudeBot?",
      answer: ["Anthropic's crawler that collects data for training its Claude models (support.claude.com/en/articles/8896518)."],
    },
    {
      question: "What is PerplexityBot?",
      answer: ["Perplexity's indexing crawler, which builds the search index behind its answers and is documented as respecting robots.txt."],
    },
    {
      question: "What does Google-Extended do?",
      answer: ["It's a permission token Googlebot checks to decide whether a page's content can be used for Gemini training/grounding; it has no effect on Search ranking (searchengineland.com/google-extended-crawler-432636)."],
    },
    {
      question: "What is CCBot?",
      answer: ["The crawler for Common Crawl, a nonprofit that publishes an open web dataset several AI labs use as training input."],
    },
    {
      question: "What is Applebot-Extended?",
      answer: ["A permission flag (not a crawler itself) that lets sites opt their already-Applebot-crawled content out of training Apple's generative AI features (support.apple.com/en-us/119829)."],
    },
    {
      question: "Can I block AI bots without hurting my Google ranking?",
      answer: ["Yes — blocking AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) has no relationship to Googlebot's indexing or ranking, since those are entirely separate crawlers/tokens."],
    },
    {
      question: "Is robots.txt legally binding?",
      answer: ["No. It's a voluntary technical convention, not a law; compliance depends entirely on the crawler operator choosing to honor it."],
    },
    {
      question: "What's the difference between GPTBot and ChatGPT-User?",
      answer: ["GPTBot crawls systematically for training; ChatGPT-User fetches a specific page in real time because a live user's question required it (developers.openai.com/api/docs/bots)."],
    },
    {
      question: "What's the difference between ClaudeBot, Claude-User, and Claude-SearchBot?",
      answer: ["ClaudeBot trains models, Claude-User fetches pages for a live user's question, and Claude-SearchBot indexes content for Claude's search feature; all three are documented as robots.txt-compliant (support.claude.com/en/articles/8896518)."],
    },
    {
      question: "Does blocking Google-Extended remove my site from AI Overviews?",
      answer: ["No — AI Overviews are generated from standard Googlebot-indexed content, not a separate Gemini-training crawl (growwildagency.com/blog/google-extended-robots-txt-guide/)."],
    },
    {
      question: "Does Perplexity respect robots.txt?",
      answer: ["PerplexityBot (the indexing crawler) is reported to; Perplexity-User (the live-agent fetcher) has been documented by Cloudflare accessing disallowed test domains, and Perplexity disputes that agents are bound the same way (searchengineworld.com/perplexity-responds-to-cloudflare)."],
    },
    {
      question: "Why do so many training crawlers also have a \"search\" or \"user\" counterpart?",
      answer: ["Because training (a batch, systematic process) and answering a live query (an on-demand, targeted fetch) are functionally different tasks that each company chooses to expose as separate, independently controllable user-agents."],
    },
    {
      question: "Does Anthropic support Crawl-delay?",
      answer: ["Yes, in addition to standard Allow/Disallow (support.claude.com/en/articles/8896518)."],
    },
    {
      question: "Can I verify a bot claiming to be GPTBot is legitimate?",
      answer: ["Check the request's source IP against OpenAI's published IP range list rather than trusting the user-agent header alone (developers.openai.com/api/docs/bots)."],
    },
    {
      question: "Can blocking by IP guarantee an AI opt-out?",
      answer: ["No — Anthropic explicitly warns IP-based blocking may not reliably or persistently work since IP ranges change (support.claude.com/en/articles/8896518)."],
    },
    {
      question: "Why did Cloudflare build one-click AI bot blocking instead of relying on robots.txt?",
      answer: ["Because robots.txt has no enforcement mechanism, so Cloudflare added network-layer blocking as backup (blog.cloudflare.com/declaring-your-aindependence-block-ai-bots-scrapers-and-crawlers-with-a-single-click/)."],
    },
    {
      question: "What percentage of sites block GPTBot vs. ClaudeBot?",
      answer: ["Cloudflare-network analysis found GPTBot in roughly 4.7–5.5% of disallow rules, with CCBot and ClaudeBot close behind around 4.9–5% (technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report)."],
    },
    {
      question: "How do I write a robots.txt rule to block GPTBot only?",
      answer: ["`User-agent: GPTBot` followed by `Disallow: /` in its own block, leaving other user-agents unaffected."],
    },
    {
      question: "How do I allow AI search bots but block AI training bots?",
      answer: ["Give each crawler its own `User-agent` block: `Disallow: /` for GPTBot/ClaudeBot/Google-Extended/CCBot, and `Allow: /` for OAI-SearchBot/Claude-SearchBot/PerplexityBot."],
    },
    {
      question: "How do I add a crawl-delay for ClaudeBot?",
      answer: ["`User-agent: ClaudeBot` then `Crawl-delay: 5` (or another value in seconds) inside that block."],
    },
    {
      question: "Where do I find the official IP ranges for GPTBot?",
      answer: ["OpenAI publishes them at a machine-readable endpoint referenced in its bot documentation (developers.openai.com/api/docs/bots)."],
    },
    {
      question: "Where do I find Anthropic's crawler IP ranges?",
      answer: ["Anthropic's support article on crawling links to its published IP list (support.claude.com/en/articles/8896518)."],
    },
    {
      question: "How do I opt out of Apple's AI training without leaving Siri/Spotlight search?",
      answer: ["Disallow `Applebot-Extended` specifically; leave the regular `Applebot` rule untouched (support.apple.com/en-us/119829; cside.com/blog/how-to-block-applebot-extended)."],
    },
    {
      question: "How do I check whether my CDN is silently blocking a crawler my robots.txt allows?",
      answer: ["Review your CDN/WAF bot-management rules and logs directly; a permissive robots.txt does not guarantee the request reaches your origin server if a firewall rule intercepts it first."],
    },
    {
      question: "How do I test my robots.txt for AI crawler coverage?",
      answer: ["Manually inspect the file for each known AI user-agent token, or use an AI-visibility-focused checker that parses robots.txt against the current list of known AI crawlers."],
    },
    {
      question: "Why are AI bots ignoring my robots.txt despite a Disallow rule?",
      answer: ["Either the crawler doesn't actually honor robots.txt (documented for some Perplexity fetching behavior), or the request isn't from the real crawler at all — check source IPs against official ranges."],
    },
    {
      question: "Why is Perplexity scraping despite my robots.txt block?",
      answer: ["Cloudflare's August 2025 report found Perplexity using undeclared user agents and rotating IPs to access disallowed domains; Perplexity disputes the framing for its user-triggered \"agent\" fetching (appleinsider.com/articles/25/08/05/perplexity-defensive-over-ignoring-robotstxt-and-stealing-data)."],
    },
    {
      question: "If I block training crawlers, does my content stop appearing in AI chat answers entirely?",
      answer: ["No — blocking a training crawler only affects the model's underlying training data going forward; separately-controlled search/retrieval crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) govern real-time citation and can be allowed independently."],
    },
    {
      question: "Should I block CCBot too?",
      answer: ["Many site owners do, since multiple AI companies use Common Crawl's dataset for training, making it one of the most frequently disallowed bots alongside GPTBot and ClaudeBot (technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report)."],
    },
    {
      question: "Is there a \"master list\" of every AI crawler user-agent I should track?",
      answer: ["No single official master list exists across all companies; the practical approach is checking each major lab's own developer/support documentation, since new tokens are added periodically."],
    },
    {
      question: "Do these directives apply per-subdomain or site-wide?",
      answer: ["Robots.txt is evaluated per host (subdomain), so each subdomain needs its own robots.txt file if you want different AI-crawler rules on different subdomains."],
    },
    {
      question: "Can a robots.txt rule apply retroactively to content already used in training?",
      answer: ["No — robots.txt only governs future crawl requests; it cannot remove content a crawler already fetched and incorporated before the rule was added."],
    },
    {
      question: "GPTBot vs. ChatGPT-User vs. OAI-SearchBot — which should I block?",
      answer: ["Block GPTBot to opt out of training; keep OAI-SearchBot allowed for ChatGPT search visibility; decide on ChatGPT-User based on whether occasional live-fetch access for user queries concerns you."],
    },
    {
      question: "ClaudeBot vs. Claude-User vs. Claude-SearchBot — which should I block?",
      answer: ["Same logic as OpenAI's set: block ClaudeBot for training opt-out, allow Claude-SearchBot for Claude search visibility, decide on Claude-User case by case."],
    },
    {
      question: "Google-Extended vs. Googlebot — are they the same crawler?",
      answer: ["No — Googlebot is the crawler; Google-Extended is a permission token Googlebot checks for a separate downstream use (Gemini training), per Google's own clarification."],
    },
    {
      question: "Robots.txt vs. Cloudflare bot blocking — which should I use?",
      answer: ["Both, ideally: robots.txt as the documented, universal request that compliant crawlers honor, and CDN/WAF-level blocking as enforcement for anything that doesn't (blog.cloudflare.com/declaring-your-aindependence-block-ai-bots-scrapers-and-crawlers-with-a-single-click/)."],
    },
    {
      question: "Is blocking AI crawlers via robots.txt as strong as blocking via a paywall or login wall?",
      answer: ["No — a paywall/login enforces access technically; robots.txt only requests compliance, so content already publicly reachable can still be fetched by a non-compliant crawler regardless of the robots.txt rule."],
    },
    {
      question: "My robots.txt says \"allow\" but I still don't see AI referral traffic — why?",
      answer: ["Allowing a search crawler doesn't guarantee citation; it only makes the page eligible to be fetched and considered, and only a fraction of fetched pages end up cited in any given AI answer."],
    },
    {
      question: "I added a Disallow rule for GPTBot but I'm still seeing it in my server logs — why?",
      answer: ["The requests may not be from the genuine GPTBot; verify the source IP against OpenAI's published range before assuming non-compliance."],
    },
    {
      question: "My CDN shows AI crawlers being blocked even though robots.txt allows them — what's happening?",
      answer: ["A WAF/bot-management rule is likely intercepting the request before it reaches your robots.txt-respecting logic at all; the two layers need to be checked and kept consistent separately."],
    },
    {
      question: "Perplexity is ignoring my robots.txt disallow — what can I actually do?",
      answer: ["Add network-layer blocking (a CDN/WAF AI-bot control) as a backstop, since robots.txt alone has not reliably stopped some of Perplexity's documented fetching behavior."],
    },
    {
      question: "I blocked Google-Extended and now I'm worried about my Search rankings — should I be?",
      answer: ["No — Google has explicitly stated Google-Extended has no effect on Search inclusion or ranking (searchengineland.com/google-extended-crawler-432636)."],
    },
    {
      question: "Is it worth paying for a dedicated AI-crawler-blocking service instead of just editing robots.txt myself?",
      answer: ["For most sites, hand-editing robots.txt covers the documented-compliant crawlers for free; a paid CDN/WAF-level AI bot control becomes worth it specifically for stopping non-compliant fetching (like Perplexity-User's disputed behavior) that robots.txt can't enforce."],
    },
    {
      question: "Should a small business bother with AI crawler directives at all, or is this overkill?",
      answer: ["If AI-generated answers are a plausible discovery channel for that business (local services, comparison-driven purchases), setting the search/retrieval crawlers to Allow is low-effort and directly supports that channel; the training-crawler decision is a separate values/business call."],
    },
    {
      question: "How do I know if my current robots.txt configuration is actually helping or hurting my AI visibility?",
      answer: ["Check which AI search/retrieval crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) are allowed, and cross-reference with a tool that tracks whether your brand is actually appearing in AI-generated answers."],
    },
    {
      question: "Is it better to hire someone to configure this or DIY it?",
      answer: ["The robots.txt syntax itself is simple enough to DIY; the harder part — auditing CDN/WAF conflicts, verifying crawler IPs, and deciding the training-vs-search policy in line with business goals — is where technical SEO or web development help tends to add the most value."],
    },
    {
      question: "Where should I start if I've never touched robots.txt for AI crawlers before?",
      answer: ["Start by listing your current file's AI-related rules (or confirming it has none), decide your training-vs-search policy per company, then add one `User-agent` block per crawler category rather than a single blanket rule."],
    },
  ],
  sources: [
    "https://developers.openai.com/api/docs/bots",
    "https://support.claude.com/en/articles/8896518",
    "https://searchengineland.com/google-extended-crawler-432636",
    "https://growwildagency.com/blog/google-extended-robots-txt-guide/",
    "https://appleinsider.com/articles/25/08/05/perplexity-defensive-over-ignoring-robotstxt-and-stealing-data",
    "https://www.searchengineworld.com/perplexity-responds-to-cloudflare",
    "https://paulcalvano.com/2025-08-21-ai-bots-and-robots-txt/",
    "https://blog.cloudflare.com/declaring-your-aindependence-block-ai-bots-scrapers-and-crawlers-with-a-single-click/",
    "https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report",
    "https://support.apple.com/en-us/119829",
    "https://cside.com/blog/how-to-block-applebot-extended",
  ],
  relatedTools: ["ai-visibility-checker", "schema-markup-generator"],
  relatedPrompts: [],
  serviceTarget: "ai-consulting",
  updatedAt: "2026-08-21",
  readingMinutes: 16,
}
