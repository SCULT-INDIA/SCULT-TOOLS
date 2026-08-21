import type { BlogPost } from '../types'

const SLUG = "llms-txt-explained"

/**
 * Generated from content-engine/05-drafts/article_062.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "llms.txt Explained: What It Actually Does in 2026",
  h1: "llms.txt Explained: What It Actually Does (And Doesn't)",
  targetKeyword: "llms.txt explained",
  description: "What llms.txt really does, who created it, whether AI crawlers actually read it, and whether it's worth implementing in 2026 — with real adoption data.",
  dek: "llms.txt is a plain Markdown file, placed at a site's root, that gives AI systems a short, curated index of a site's most important pages — proposed in September 2024 by Jeremy Howard of Answer.AI as \"robots.txt for the AI era.\" It is not an official, ratified standard, it does not block or restrict crawlers the way robots.txt does, and as of mid-2026 no major AI provider has publicly confirmed its production crawlers or answer systems consume it normatively. Independent adoption studies in 2026 found the large majority of published llms.txt files receive effectively zero AI-system requests.",
  sections: [
    {
      heading: "What llms.txt actually is",
      body: [
        ["llms.txt is a Markdown file you publish at `yoursite.com/llms.txt`. It contains a short, human-curated list of your site's most important pages, each with a one-line description, organized under Markdown headings. The idea is straightforward: instead of making an AI system crawl and parse your entire HTML site — navigation, ads, cookie banners, and all — to figure out what actually matters, you hand it a clean, minimal, purpose-built index directly."],
        ["The specification, published and maintained at ", { text: "llmstxt.org", href: "https://llmstxt.org/", external: true }, ", defines the file format precisely: an H1 with the site or project name, an optional blockquote summary, and then H2-headed sections (like \"Docs\" or \"Optional\") each containing a Markdown list of links with short descriptions. It is deliberately simple — there's no schema validation, no required fields beyond the title, and no mechanism for enforcement. It's a convention, not a protocol."],
      ],
    },
    {
      heading: "Who created it and why",
      body: [
        ["Jeremy Howard — co-founder of Answer.AI and fast.ai, and a well-known figure in applied machine learning — proposed llms.txt in September 2024. The framing at the time, widely repeated in coverage like Search Engine Land's, was explicitly analogous to robots.txt: a simple, text-based file convention that gives automated systems a predictable place to find structured information about a site, this time optimized for how large language models consume and reference web content rather than how search crawlers index it (", { text: "searchengineland.com", href: "https://searchengineland.com/llms-txt-proposed-standard-453676", external: true }, ")."],
        ["The stated motivation was practical rather than defensive: LLMs have limited context windows and, per the original proposal, struggle to extract genuinely useful information from pages weighed down by navigation menus, ads, and JavaScript-heavy layouts. An llms.txt file sidesteps that by giving the model — or more precisely, the human or agent using an LLM to look something up — a direct, low-noise path to the content that matters."],
      ],
    },
    {
      heading: "llms.txt vs robots.txt vs sitemap.xml",
      body: [
        ["These three files get confused constantly, and the confusion causes real strategic mistakes, so it's worth being precise:"],
        ["– ", { text: "robots.txt", bold: true }, " is an access-control instruction. It tells compliant crawlers what they are and are not permitted to fetch. It has decades of established, if imperfect, compliance behind it from major search and AI crawlers that choose to respect it."],
        ["– ", { text: "sitemap.xml", bold: true }, " is a completeness signal. It lists every indexable URL on a site so a crawler can discover pages it might otherwise miss, with metadata like last-modified date. It's about coverage, not curation."],
        ["– ", { text: "llms.txt", bold: true }, " is a curation and navigation aid. It doesn't control access (it can't stop any crawler from reading anything) and it isn't meant to be exhaustive (it's supposed to highlight the pages that matter most, not list all of them). It's closer to a hand-picked table of contents than either a permissions file or a full-site index."],
        ["Because llms.txt looks superficially like robots.txt — a plain-text file at the site root with a similar name — it's easy to assume it inherits robots.txt's enforcement behavior. It doesn't. Multiple industry explainers make this point directly: llms.txt \"cannot prevent any AI system from reading a site the way robots.txt directives are intended to restrict crawler behavior\" (", { text: "medium.com/@devakpo777", href: "https://medium.com/@devakpo777/the-complete-guide-to-llms-txt-control-how-ai-crawlers-access-your-content-47ec698e1f61", external: true }, "; ", { text: "derivatex.agency", href: "https://derivatex.agency/blog/llms-txt-guide/", external: true }, "). If you want to block a crawler, robots.txt (or server-level blocking) is the actual tool for that job — llms.txt does something entirely different."],
      ],
    },
    {
      heading: "llms.txt vs llms-full.txt",
      body: [
        ["The specification also defines a companion file, `llms-full.txt`, and the difference matters for anyone actually implementing this:"],
        ["– ", { text: "llms.txt", bold: true }, " is the streamlined index — short descriptions and links, meant to be small enough to fit easily in a model's context and quick for a human or agent to scan."],
        ["– ", { text: "llms-full.txt", bold: true }, " is the comprehensive version — the full documentation content itself, concatenated into one file, rather than just links pointing elsewhere."],
        ["In practice, llms.txt works best as a directory pointing to canonical pages, while llms-full.txt works best for documentation-heavy sites where you want an AI coding assistant or agent to be able to pull the complete reference material in a single fetch, without following a chain of links. Several developer-tool companies (Anthropic's own documentation among them) publish both, using llms.txt as the entry point and llms-full.txt as the deep reference."],
      ],
    },
    {
      heading: "Do AI companies actually read it?",
      body: [
        ["This is the question that matters most, and the honest answer is: ", { text: "unconfirmed, and the community is openly skeptical.", bold: true }, " As of the available evidence, no major AI provider — not OpenAI, not Anthropic, not Google, not Perplexity — has publicly confirmed that their production crawlers or live answer-generation systems consume llms.txt as a normatively respected input. A Hacker News thread asking directly \"Is LLMs.txt a REAL thing now?\" captures the developer-community uncertainty explicitly, and a separate thread, \"Does any of the LLM providers actually use llms.txt?\", exists specifically because the answer isn't clearly documented anywhere official (", { text: "news.ycombinator.com/item?id=43438190", href: "https://news.ycombinator.com/item?id=43438190", external: true }, "; ", { text: "news.ycombinator.com/item?id=48410783", href: "https://news.ycombinator.com/item?id=48410783", external: true }, ")."],
        ["Where llms.txt does have a more credible, confirmed use case is narrower than \"getting cited by ChatGPT search\": ", { text: "AI coding assistants and agentic dev tools fetching documentation.", bold: true }, " When a coding agent needs to pull reference material for a library or framework, a well-structured llms.txt or llms-full.txt gives it a clean, direct path to the right content instead of forcing it to scrape and parse a documentation site's HTML. This is the use case with the strongest real evidence behind it — it's functional for the tool doing the fetching, observable, and doesn't depend on an opaque provider decision about whether to weight the file in a search-answer pipeline (", { text: "derivatex.agency", href: "https://derivatex.agency/blog/llms-txt-guide/", external: true }, ")."],
        ["Google's own public position, as characterized in industry coverage, is unambiguous and worth restating precisely: creating an llms.txt file will neither harm nor help a site's visibility in Google's own AI-driven search features (", { text: "powerfulcombo.com", href: "https://powerfulcombo.com/blog/is-llms-txt-worth-it/", external: true }, "). That's a \"won't hurt you\" statement, not an endorsement."],
      ],
    },
    {
      heading: "Real 2026 adoption data",
      body: [
        ["Adoption has grown, but from a small base, and — critically — most published files appear to go unread. A few concrete, independently gathered data points from 2026:"],
        ["– As of June 2026, roughly 8.7% of the world's top 1,000 websites publish an llms.txt file; among the subset of those top-1,000 sites that could actually be reached and checked, the figure was around 15.8% (", { text: "rankability.com", href: "https://www.rankability.com/data/llms-txt-adoption/", external: true }, ")."],
        ["– A broader crawl covering more than 3 million websites found the number of llms.txt instances reached roughly 36,120 by May 2026 — an 8.8x increase over twelve months — but the same reporting states that ", { text: "97% of published llms.txt files receive zero AI-system requests", bold: true }, " (", { text: "ppc.land", href: "https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/", external: true }, ")."],
        ["– Adoption is heavily uneven by platform: Shopify-hosted stores show a much higher adoption rate than the open web average — largely because it's a platform-level default rather than an individual merchant decision — while adoption on WordPress, which requires a deliberate plugin install or manual file creation, sits much closer to the broader open-web average."],
        ["– One separately cited large-scale study (referenced in community sentiment coverage) found that a majority of these files go unread, and of the traffic that does hit them, much of it isn't from an actual AI system at all, but from other bots, scanners, and curiosity-driven human visits (", { text: "powerfulcombo.com", href: "https://powerfulcombo.com/blog/is-llms-txt-worth-it/", external: true }, ")."],
        ["Put together, these numbers paint a consistent picture: adoption is growing quickly in relative terms (multiples year over year) while remaining a small-minority practice in absolute terms, and — the more important number for anyone deciding whether to bother — the file frequently sits there unread even once published."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Documentation site for a dev tool.", bold: true }, " A company shipping an SDK publishes `llms.txt` linking to its quickstart, API reference, and changelog, plus `llms-full.txt` containing the complete reference docs concatenated into one file. A developer using an AI coding assistant asks it to \"look up how to authenticate with this SDK,\" and the assistant fetches `llms-full.txt` directly instead of scraping the documentation site's rendered HTML — a genuine, observable efficiency win specific to agentic dev tooling."],
        [{ text: "Content-marketing site hoping for AI Overview citations.", bold: true }, " A blog publishes llms.txt hoping it will improve citation odds in Google AI Overviews or ChatGPT search answers. Based on the evidence above, this is the weaker use case: there's no confirmed mechanism by which live AI search answer systems consume or weight llms.txt files today, and Google has explicitly said it won't move the needle either way."],
        [{ text: "Illustrative example (hypothetical, for clarity).", bold: true }, " Imagine two documentation sites with identical content, one with a well-structured llms-full.txt and one without. An AI coding agent asked to compare implementation details across both would plausibly retrieve the first site's information faster and more completely, purely because it didn't have to parse marketing copy and navigation chrome to find the substance — this is a reasonable inference from the stated mechanics of the format, not a claim backed by a controlled study comparing the two."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– llms.txt was proposed in September 2024 by Jeremy Howard of Answer.AI; it remains a community-proposed convention, not ratified by the IETF, W3C, or any formal standards body (", { text: "llmstxt.org", href: "https://llmstxt.org/", external: true }, "; ", { text: "searchengineland.com", href: "https://searchengineland.com/llms-txt-proposed-standard-453676", external: true }, ")."],
        ["– No major AI provider has publicly confirmed normative use of llms.txt in production crawling or answer generation, based on the available public discussion (", { text: "news.ycombinator.com/item?id=43438190", href: "https://news.ycombinator.com/item?id=43438190", external: true }, "; ", { text: "news.ycombinator.com/item?id=48410783", href: "https://news.ycombinator.com/item?id=48410783", external: true }, ")."],
        ["– Roughly 8.7% of the global top-1,000 websites publish llms.txt as of June 2026, growing from a much smaller base a year earlier (", { text: "rankability.com", href: "https://www.rankability.com/data/llms-txt-adoption/", external: true }, ")."],
        ["– Approximately 97% of published llms.txt files were found to receive zero requests from AI systems in a large-scale 2026 crawl-based study (", { text: "ppc.land", href: "https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/", external: true }, ")."],
        ["– Google's stated public position is that llms.txt neither helps nor hurts visibility in its own systems (", { text: "powerfulcombo.com", href: "https://powerfulcombo.com/blog/is-llms-txt-worth-it/", external: true }, ")."],
        ["– The strongest documented real-world benefit is for AI coding assistants and agentic developer tools fetching documentation directly, rather than for influencing live AI search citations (", { text: "derivatex.agency", href: "https://derivatex.agency/blog/llms-txt-guide/", external: true }, ")."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        [{ text: "llms.txt vs robots.txt.", bold: true }, " robots.txt is an access-control convention with real (if imperfect) crawler compliance behind it; llms.txt is a curation aid with no access-control function at all. Confusing the two leads teams to believe publishing llms.txt gives them some control over AI crawling — it doesn't."],
        [{ text: "llms.txt vs sitemap.xml.", bold: true }, " sitemap.xml aims for completeness (every indexable URL); llms.txt aims for curation (the pages that matter most, hand-picked, with human-written descriptions). They serve different purposes and can coexist without conflict."],
        [{ text: "llms.txt vs llms-full.txt.", bold: true }, " llms.txt is a lightweight index of links; llms-full.txt is the full content in one file. Documentation-heavy sites generally benefit from publishing both, using llms.txt as the entry point."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["– ", { text: "Developer-tool and SaaS documentation sites", bold: true }, " publishing llms-full.txt so AI coding assistants can pull complete reference material in one fetch — the use case with the clearest, most direct mechanism of benefit."],
        ["– ", { text: "E-commerce platforms", bold: true }, " (Shopify being the clearest example) rolling out llms.txt at the platform level by default, which drives adoption statistics up without reflecting an individual merchant decision."],
        ["– ", { text: "Content and marketing sites", bold: true }, " publishing llms.txt speculatively, hoping for improved AI-search citation odds, despite no confirmed mechanism connecting the file to citation behavior in live search-answer systems."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– ", { text: "Assuming llms.txt blocks or restricts AI crawlers.", bold: true }, " It has no access-control function; use robots.txt or server-level rules if that's the actual goal."],
        ["– ", { text: "Publishing llms.txt as a general SEO/AI-visibility play with no dev-tool use case.", bold: true }, " The strongest confirmed benefit is for agentic tooling reading documentation, not for general content marketing or search citations."],
        ["– ", { text: "Treating adoption growth percentages as proof of impact.", bold: true }, " Adoption is rising, but the same 2026 data shows the overwhelming majority of published files receive zero AI-system requests — growth in file count doesn't mean growth in actual consumption."],
        ["– ", { text: "Skipping llms-full.txt on a documentation-heavy site.", bold: true }, " Publishing only the lightweight index without the full-content companion file limits the benefit for agents that need complete reference material in one fetch."],
        ["– ", { text: "Assuming a major AI provider officially endorses or consumes the file.", bold: true }, " No such confirmation currently exists publicly for the major providers' production systems."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– If you run a developer-tool or SaaS documentation site, publish both llms.txt (as a curated index) and llms-full.txt (as complete reference content) — this is where the evidence for real benefit is strongest."],
        ["– Keep llms.txt genuinely curated — a short, honestly prioritized list of your most important pages with accurate one-line descriptions, not an auto-generated dump of every URL."],
        ["– Don't treat llms.txt as a substitute for robots.txt if your actual goal is controlling crawler access — use the right tool for that job."],
        ["– Don't expect llms.txt alone to move the needle on AI Overview or chat-search citations; invest primarily in genuinely well-structured, authoritative content and structured data, and treat llms.txt as a low-cost, low-risk addition rather than a strategy."],
        ["– Revisit the file periodically as your site's key pages change — a stale llms.txt pointing at outdated URLs is worse than no file at all."],
        ["– Monitor your server logs for requests to `/llms.txt` and `/llms-full.txt` if you want real evidence of whether it's being fetched at all, rather than assuming based on industry-wide adoption stats."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– llms.txt is a proposed, unratified convention — not an official standard — created by Jeremy Howard of Answer.AI in September 2024."],
        ["– It's a curation/navigation aid, not an access-control mechanism; it can't block or restrict AI crawlers the way robots.txt can."],
        ["– No major AI provider has publicly confirmed normative production use of the file, and Google's own stated position is that it neither helps nor hurts visibility."],
        ["– The strongest confirmed real-world benefit is for AI coding assistants and agentic dev tools fetching documentation — not for influencing live AI search citations."],
        ["– 2026 adoption data shows fast relative growth from a small base, but roughly 97% of published files receive zero AI-system requests in independent studies."],
        ["– It's reasonable to implement as a low-cost addition, especially for documentation-heavy sites, but it shouldn't be treated as a meaningful AI-visibility strategy on its own."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["If you're trying to understand your site's broader AI-visibility posture beyond just llms.txt — including how AI systems are currently seeing and citing (or not citing) your content — the ", { text: "AI Visibility Checker", href: "/geo/ai-visibility-checker" }, " on tools.scult.in is a useful starting point for a more evidence-based read on where you actually stand. And if you're writing the actual audit or content brief around that work, the ", { text: "SEO & GEO/AEO prompt collection", href: "/prompts/seo-geo" }, " has structured prompts for exactly this kind of AI-citability review."],
      ],
    },
  ],
  faq: [
    {
      question: "What is llms.txt in plain terms?",
      answer: ["A Markdown file at a site's root that gives AI systems a short, curated index of the site's most important pages."],
    },
    {
      question: "Who created llms.txt?",
      answer: ["Jeremy Howard of Answer.AI/fast.ai, proposed in September 2024."],
    },
    {
      question: "Is llms.txt an official web standard?",
      answer: ["No — it's a community-proposed convention, not ratified by the IETF, W3C, or any formal standards body."],
    },
    {
      question: "What does llms.txt actually do?",
      answer: ["It provides a clean, curated, low-noise entry point to a site's key content for AI systems and agentic tools, instead of requiring them to parse full HTML pages."],
    },
    {
      question: "Does llms.txt block AI crawlers from reading my site?",
      answer: ["No — it has no access-control function. Use robots.txt or server-level rules to restrict crawler access."],
    },
    {
      question: "Where do I put the llms.txt file?",
      answer: ["At the root of your domain, e.g. `yoursite.com/llms.txt`."],
    },
    {
      question: "What format is llms.txt written in?",
      answer: ["Plain Markdown — an H1 title, an optional summary blockquote, and H2-headed link sections."],
    },
    {
      question: "Is llms.txt the same as a sitemap?",
      answer: ["No — a sitemap aims for exhaustive URL coverage; llms.txt is a hand-curated shortlist of the most important pages."],
    },
    {
      question: "Do I need technical skills to create an llms.txt file?",
      answer: ["No — it's a plain text file you can write by hand in a few minutes; some CMS platforms and plugins can also generate one automatically."],
    },
    {
      question: "Is llms.txt free to implement?",
      answer: ["Yes — there's no cost beyond the time to write and publish the file."],
    },
    {
      question: "What's the difference between llms.txt and llms-full.txt?",
      answer: ["llms.txt is a short index of links with descriptions; llms-full.txt contains the complete documentation content in a single file."],
    },
    {
      question: "Does robots.txt already cover what llms.txt does?",
      answer: ["No — they serve different functions entirely; robots.txt controls access, llms.txt curates content for discovery."],
    },
    {
      question: "Does llms.txt help with AI-generated citations in ChatGPT or Perplexity search results?",
      answer: ["This is unconfirmed — no major provider has publicly confirmed their production answer systems consume llms.txt normatively."],
    },
    {
      question: "Does llms.txt help AI coding assistants use my documentation?",
      answer: ["Yes, this is the strongest confirmed use case — agentic dev tools can fetch llms.txt/llms-full.txt directly rather than scraping rendered HTML."],
    },
    {
      question: "What has Google said about llms.txt?",
      answer: ["Google's stated position is that it neither helps nor hurts a site's visibility in its own systems."],
    },
    {
      question: "Is llms.txt required for AI SEO/GEO in 2026?",
      answer: ["No — it's optional and unconfirmed as a citation lever; it should be treated as a low-cost addition, not a core requirement."],
    },
    {
      question: "How do I create an llms.txt file for a WordPress site?",
      answer: ["Several WordPress plugins can auto-generate a basic llms.txt from your site structure, or you can write one manually and upload it to your site's root directory."],
    },
    {
      question: "How do I write an llms-full.txt file?",
      answer: ["Concatenate your full documentation content — headings, body text, code examples — into a single Markdown file, structured clearly enough for a model to parse without additional formatting."],
    },
    {
      question: "How do I generate llms.txt automatically?",
      answer: ["Several static-site generators and CMS plugins can auto-generate the file from your existing page/documentation structure, though a manually curated version is usually higher quality."],
    },
    {
      question: "How do I test whether AI systems are actually requesting my llms.txt file?",
      answer: ["Check your server access logs for requests to `/llms.txt` and `/llms-full.txt`, and look at the user-agent strings to see whether requests come from known AI crawlers."],
    },
    {
      question: "How do I decide what to include in llms.txt?",
      answer: ["Prioritize your highest-value, most canonical pages — documentation entry points, key product pages, or core reference material — with accurate, concise one-line descriptions."],
    },
    {
      question: "How do I keep llms.txt up to date?",
      answer: ["Treat it like any other piece of site infrastructure — review and update it whenever your key pages or site structure change, ideally as part of your regular content or docs release process."],
    },
    {
      question: "How do I add llms.txt to a Next.js or React site?",
      answer: ["Serve it as a static file from your public/static assets directory, exactly as you would robots.txt or a sitemap file."],
    },
    {
      question: "Should llms.txt include internal-only or unpublished pages?",
      answer: ["No — only include pages you want and expect external systems to access; llms.txt doesn't add access control, so anything you list is effectively an index of things you're pointing outward-facing systems toward."],
    },
    {
      question: "Can llms.txt include non-documentation content, like blog posts?",
      answer: ["Yes — the format has no restriction on content type; it's about curating your genuinely important pages, whatever they are."],
    },
    {
      question: "Is llms.txt worth the time to create in 2026?",
      answer: ["For documentation-heavy dev-tool or SaaS sites, yes — low cost, real (if narrow) benefit for AI coding assistants. For general content-marketing sites hoping for search-citation gains, the evidence for benefit is much weaker."],
    },
    {
      question: "Do AI companies confirm reading llms.txt?",
      answer: ["No major provider has publicly confirmed this for their production crawling or answer-generation systems as of the available evidence."],
    },
    {
      question: "Will llms.txt become mandatory or widely adopted eventually?",
      answer: ["Unknown — adoption is growing quickly in relative terms but remains a small-minority practice, and there's no confirmed provider-side consumption driving that growth yet."],
    },
    {
      question: "Does having llms.txt improve my Google AI Overview citations specifically?",
      answer: ["No confirmed mechanism supports this; Google's stated position is that the file neither helps nor hurts."],
    },
    {
      question: "Does having llms.txt improve my ChatGPT search citations specifically?",
      answer: ["Unconfirmed — no public statement from OpenAI confirms normative use of the file in production."],
    },
    {
      question: "llms.txt vs robots.txt — which should I prioritize?",
      answer: ["robots.txt if your concern is access control; llms.txt as a low-cost addition if you run a documentation-heavy site and want to support agentic dev tools."],
    },
    {
      question: "llms.txt vs sitemap.xml — do I need both?",
      answer: ["Yes, if applicable — they serve different purposes (curation vs. completeness) and don't conflict with each other."],
    },
    {
      question: "llms.txt vs structured data (schema markup) — which matters more for AI visibility?",
      answer: ["Structured data has a longer track record of influencing how search and AI systems parse and represent your content; llms.txt's mechanism of influence remains unconfirmed by comparison."],
    },
    {
      question: "Is llms-full.txt better than linking to individual documentation pages?",
      answer: ["For agentic tools that need complete reference material in one fetch, yes; for a human browsing normally, individual pages with proper navigation remain more usable."],
    },
    {
      question: "Do larger companies' llms.txt files differ meaningfully from smaller sites' in structure?",
      answer: ["Not in format — the specification is the same regardless of site size; larger, documentation-heavy companies (like major dev-tool vendors) tend to invest more in keeping both llms.txt and llms-full.txt current."],
    },
    {
      question: "My llms.txt file isn't showing up in AI search results — what's wrong?",
      answer: ["Nothing is necessarily \"wrong\" — there's no confirmed mechanism connecting llms.txt to search-answer citation behavior, so absence of visible effect is the expected outcome for most sites, not a sign of a technical error."],
    },
    {
      question: "My server logs show almost no requests to /llms.txt — is that normal?",
      answer: ["Yes, very much so — large-scale 2026 studies found roughly 97% of published llms.txt files receive zero AI-system requests."],
    },
    {
      question: "I published llms.txt months ago and see no ranking or citation change — should I remove it?",
      answer: ["There's little reason to remove it since it costs nothing to keep, but you also shouldn't expect it alone to move rankings or citations — treat the lack of visible effect as consistent with current evidence, not a sign you did something wrong."],
    },
    {
      question: "My llms-full.txt file is huge — is that a problem?",
      answer: ["It can be, since AI agents fetching it still have to process the whole thing within context limits — prioritize the most essential reference content rather than including everything indiscriminately."],
    },
    {
      question: "Can publishing llms.txt hurt my SEO or site performance?",
      answer: ["No credible evidence suggests it causes harm — it's a small, static text file with no known negative side effects."],
    },
    {
      question: "What is the best llms.txt generator tool?",
      answer: ["There's no single verified \"best\" tool — options range from manual writing to CMS-specific plugins; the ", { text: "ai-visibility-checker", href: "/geo/ai-visibility-checker" }, " on tools.scult.in can help you assess your broader AI-visibility posture beyond just this one file."],
    },
    {
      question: "Should I hire an agency to implement llms.txt for me?",
      answer: ["Given the file's simplicity and low, unconfirmed impact, most sites can implement it in-house in under an hour; an agency engagement makes more sense if it's bundled into a broader AI-visibility or technical SEO audit rather than commissioned for llms.txt alone."],
    },
    {
      question: "Is there a paid tool that validates llms.txt files?",
      answer: ["Several free and low-cost validators exist that check basic Markdown structure and link validity; given the file's simplicity, a manual review is often sufficient."],
    },
    {
      question: "Should an agency recommend llms.txt to every client?",
      answer: ["Only with realistic framing — it's reasonable to include as a low-cost addition for documentation-heavy or dev-tool clients, but it shouldn't be sold as a meaningful AI-search-citation lever given the current evidence."],
    },
    {
      question: "Is llms.txt part of a broader \"AI SEO\" or \"GEO\" strategy?",
      answer: ["It can be a minor component, but the stronger levers for AI-answer visibility remain structured data, clear authoritative content, and genuine E-E-A-T signals — llms.txt is a supplement, not a substitute."],
    },
    {
      question: "What's the ROI of implementing llms.txt for a typical small business site?",
      answer: ["Given the near-zero cost and the 2026 adoption data showing most files go unrequested, the honest expected ROI for a typical content or small-business site is low — it's reasonable as a low-effort addition, not a priority investment."],
    },
    {
      question: "Should a documentation-heavy SaaS company prioritize llms.txt over other AI-visibility work?",
      answer: ["No — prioritize the confirmed-benefit use case (llms-full.txt for agentic dev tools) alongside, not instead of, broader structured data and content-quality work."],
    },
    {
      question: "How do I know if llms.txt is actually worth it for my specific site?",
      answer: ["Check whether your primary audience or use case involves AI coding agents/dev tools consuming your documentation; if not, treat it as a low-priority, low-cost addition rather than a strategic investment."],
    },
    {
      question: "What should I check instead of (or before) implementing llms.txt?",
      answer: ["Structured data (schema markup), clear authoritative page content, and your site's actual crawlability and speed — these have stronger, better-documented connections to both traditional and AI-driven visibility."],
    },
    {
      question: "Will llms.txt adoption keep growing through 2026 and beyond?",
      answer: ["Based on the trend data available, relative adoption is growing quickly (multiples year over year), though it remains unclear whether that growth reflects genuine provider-side consumption or largely speculative, low-cost publishing by site owners."],
    },
  ],
  sources: [
    "https://llmstxt.org/",
    "https://searchengineland.com/llms-txt-proposed-standard-453676",
    "https://news.ycombinator.com/item?id=43438190",
    "https://news.ycombinator.com/item?id=48410783",
    "https://powerfulcombo.com/blog/is-llms-txt-worth-it/",
    "https://derivatex.agency/blog/llms-txt-guide/",
    "https://medium.com/@devakpo777/the-complete-guide-to-llms-txt-control-how-ai-crawlers-access-your-content-47ec698e1f61",
    "https://www.rankability.com/data/llms-txt-adoption/",
    "https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/",
  ],
  relatedTools: ["ai-visibility-checker"],
  relatedPrompts: [],
  updatedAt: "2026-08-21",
  readingMinutes: 17,
}
