import type { BlogPost } from '../types'

const SLUG = 'crawled-vs-cited-ai-search'

/**
 * Generated from content-engine/05-drafts/article_023.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'Crawled vs. Cited: Why AI Search Engines Read Your Site But Never Mention It',
  h1: 'Crawled vs. cited: why AI search engines read your site but never mention it',
  targetKeyword: 'crawled vs cited ai search',
  description:
    "Being crawled by AI bots and being cited in an AI answer are different things. Here's the technical gap between them, and how to close it.",
  dek: 'Being "crawled" means an AI bot can reach, fetch, and parse a page; being "cited" means a system like ChatGPT, Perplexity, or Google\'s AI Overviews actually used that page as a source in a generated answer. Crawlability is a hard prerequisite — an uncrawlable page can never be cited — but clearing it doesn\'t guarantee anything: most AI crawlers skip JavaScript rendering entirely, run on a much slower and less predictable schedule than Googlebot, and the final citation decision depends on content quality signals that have nothing to do with whether the bot could technically fetch the page.',
  sections: [
    {
      heading: 'The actual difference between crawled and cited',
      body: [
        [
          '"Crawled" and "cited" describe two different, sequential events, and conflating them is the single most common reason a site owner ends up confused about their AI visibility. Being crawled means an automated bot successfully requested your page, received a response, and was able to parse readable content from it. Being cited means a generative AI system — when answering a user\'s actual question — selected your specific page\'s content, pulled information from it, and referenced or linked to it in the answer it produced.',
        ],
        [
          'Industry analysis frames this as a "Five-C" style funnel: a page has to be crawlable, then have its content actually consumed and understood, then be considered relevant enough to a specific query, then compete against other candidate sources, before it\'s finally cited (',
          {
            text: 'Amicited',
            href: 'https://www.amicited.com/blog/ai-training-crawlers-vs-search-crawlers/',
            external: true,
          },
          '). Crawlability is simply step one of that funnel — necessary, but nowhere near sufficient on its own, which is exactly why a site can be technically crawled thousands of times a month by GPTBot and still never appear as a cited source in a single ChatGPT answer.',
        ],
      ],
    },
    {
      heading: 'Why crawlability is a gate, not a guarantee',
      body: [
        [
          'The reason this distinction gets described as a "gate" rather than a spectrum is blunt: if a crawler can\'t reach or read a page\'s content at all, that page is disqualified from citation before content quality is ever evaluated (',
          {
            text: 'Amicited',
            href: 'https://www.amicited.com/blog/ai-training-crawlers-vs-search-crawlers/',
            external: true,
          },
          '). No amount of expertise, originality, or structured data on a page compensates for a robots.txt rule that blocks the bot, a server that times out, or a page whose actual content only exists after JavaScript executes in a browser the crawler never runs.',
        ],
        [
          "This is precisely why a site can rank well on Google — which does execute JavaScript in a second rendering pass — while being functionally invisible to AI answer engines that don't. Conductor's crawlability guidance frames the checklist around exactly these gate-level conditions: robots.txt permissions for the relevant bots, a server response that doesn't require JavaScript to expose the core content, page load within the crawler's timeout window, and discoverable internal linking or a sitemap so the crawler can even find the page to begin with (",
          {
            text: 'Conductor',
            href: 'https://www.conductor.com/academy/ai-crawlability/',
            external: true,
          },
          '; ',
          {
            text: 'Women in Tech SEO',
            href: 'https://www.womenintechseo.com/knowledge/ai-crawlability-for-ai-search/',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: "Training crawlers vs. search/answer crawlers: they're not the same bot",
      body: [
        [
          'One of the most consequential technical distinctions in this space is that "AI crawlers" isn\'t one category — there are training crawlers and search/answer crawlers, and they behave, and matter, differently. Training crawlers like GPTBot and Google-Extended exist to collect data used to train future models; they have nothing to do with what gets cited in an answer today. Separate, purpose-built search-user-agents — OAI-SearchBot (used by ChatGPT\'s search feature), Claude-SearchBot, and PerplexityBot — fetch pages live, at query time, specifically to generate the answer a user is looking at right now (',
          {
            text: 'Amicited',
            href: 'https://www.amicited.com/blog/ai-training-crawlers-vs-search-crawlers/',
            external: true,
          },
          '; ',
          {
            text: 'Mersel.ai',
            href: 'https://www.mersel.ai/blog/how-to-block-or-allow-ai-bots-on-your-website',
            external: true,
          },
          ').',
        ],
        [
          "This matters practically because blocking one doesn't automatically block the other. A site owner who blocks GPTBot specifically to opt out of AI model training is not thereby opting out of appearing in ChatGPT's live search answers — OAI-SearchBot is a distinct user-agent with its own robots.txt rule. Conversely, a site that blocks its search-oriented bots has made itself ineligible for citation in that engine's answers regardless of how well it might otherwise qualify on content quality (",
          {
            text: 'Mersel.ai',
            href: 'https://www.mersel.ai/blog/how-to-block-or-allow-ai-bots-on-your-website',
            external: true,
          },
          "). Getting this wrong in either direction — thinking you've opted out of training when you've actually blocked citation, or vice versa — is a genuinely common, silent misconfiguration.",
        ],
      ],
    },
    {
      heading: "The JavaScript rendering gap most sites don't know they have",
      body: [
        [
          'The single most common reason a site clears "indexed by Google" but fails "crawled meaningfully by AI" is JavaScript rendering. Google\'s crawler famously runs content through a rendering queue that executes JavaScript before indexing, which is why client-side-rendered React or Vue sites can still rank. Most AI crawlers don\'t do this: they typically issue a single HTTP request, grab whatever HTML the server returns immediately, and move on — without ever running the page\'s JavaScript (',
          {
            text: 'Averi.ai',
            href: 'https://www.averi.ai/blog/javascript-rendering-gap-ai-crawlers',
            external: true,
          },
          '; ',
          {
            text: 'Jangwook',
            href: 'https://jangwook.net/en/blog/en/ai-crawlers-dont-render-javascript-csr-2026/',
            external: true,
          },
          ').',
        ],
        [
          "The practical consequence is specific and often invisible to whoever is checking the site: FAQ accordions that inject their answer text via JavaScript, pricing tables built with a client-side data fetch, product reviews loaded asynchronously after the initial page load — all of it displays perfectly to a human visitor in a browser and is functionally absent to an AI crawler reading only the server's initial HTML response. A page can look complete, rank on Google, and still be nearly empty from an AI crawler's point of view.",
        ],
      ],
    },
    {
      heading: 'Practical examples',
      body: [
        [
          '– ',
          { text: 'A JS-heavy FAQ section:', bold: true },
          " a page's visible FAQ content is rendered by a client-side JavaScript framework after the initial HTML loads. A human sees complete answers; most AI crawlers, reading only the server-returned HTML, see an empty or near-empty container — illustrative of the exact gap documented by Averi.ai and Jangwook, not a specific site we audited.",
        ],
        [
          '– ',
          { text: 'A robots.txt misconfiguration:', bold: true },
          ' a site blocks `GPTBot` under a training-opt-out policy but never checks whether it has also blocked `OAI-SearchBot`, `PerplexityBot`, or `ClaudeBot` — the search-facing bots that actually determine citation eligibility. This is the exact confusion the training-vs-search distinction documented above is meant to prevent.',
        ],
        [
          '– ',
          { text: "A well-structured page that still isn't cited:", bold: true },
          ' a page passes every crawlability check — reachable, server-rendered, fast, well-linked — but still never appears as a cited source, because the "crawled" gate being open says nothing about whether the content was distinctive or authoritative enough to win a citation slot against competing sources on the same query.',
        ],
      ],
    },
    {
      heading: 'Data and evidence',
      body: [
        [
          '– ',
          { text: 'Crawlability functions as a disqualifying first gate', bold: true },
          ', not a scored factor: a page that fails it cannot be cited regardless of content quality (Amicited).',
        ],
        [
          '– ',
          {
            text: 'Training crawlers and search/answer crawlers are documented as functionally separate systems',
            bold: true,
          },
          ' with separate user-agent strings, meaning a robots.txt policy targeting one does not automatically apply to the other (Amicited; Mersel.ai).',
        ],
        [
          '– ',
          {
            text: 'Most AI crawlers issue a single HTTP request and do not execute JavaScript',
            bold: true,
          },
          ", unlike Googlebot's two-stage rendering pipeline (Averi.ai; Jangwook).",
        ],
        [
          '– ',
          {
            text: '"Citation velocity" — the time between a page being crawled and it appearing in an AI-generated answer — is described as variable and generally slower/less predictable than traditional Google indexing',
            bold: true,
          },
          ', with no fixed universal timeline published by any AI provider (Conductor).',
        ],
        [
          '– ',
          {
            text: 'No major AI provider has publicly confirmed that its live search/answer crawlers read `llms.txt` to decide what to cite',
            bold: true,
          },
          ', per a Hacker News discussion specifically probing this question — treat llms.txt as a low-cost, plausible-but-unconfirmed signal, separate from the actual crawled-to-cited mechanics (',
          {
            text: 'Hacker News',
            href: 'https://news.ycombinator.com/item?id=48410783',
            external: true,
          },
          ').',
        ],
        [
          '– Evidence not sufficiently verified: there is no independently published, cross-platform percentage for "what share of crawled pages actually get cited" — the funnel is well-documented qualitatively, but a hard conversion-rate statistic wasn\'t found in this research.',
        ],
      ],
    },
    {
      heading: 'Comparisons: crawled vs. cited vs. ranked',
      body: [
        [
          'Stage: Crawled · What it requires: robots.txt allows the bot; server responds; content is reachable without required JS execution · What it does NOT guarantee: Being read carefully, being relevant to any specific query, or being cited',
        ],
        [
          'Stage: Ranked (traditional SEO) · What it requires: Crawled + indexed + relevance/authority signals for a query, evaluated by a search algorithm · What it does NOT guarantee: Being selected as a citation source in a generative AI answer, which uses a different selection process',
        ],
        [
          'Stage: Cited (AI answer) · What it requires: Crawled + content judged relevant, distinctive, and trustworthy enough to be quoted or referenced for a specific query · What it does NOT guarantee: Continued citation on future queries, or citation across different AI platforms',
        ],
        [
          'The AI crawlability guide\'s checklist (robots.txt, server-rendered content, load-time within crawler timeouts, discoverable linking) covers only the leftmost column. Improving your "crawled" score is necessary work, but it is a different project from improving your "cited" rate, which depends on content distinctiveness and authority signals closer to classic E-E-A-T than to a technical audit.',
        ],
      ],
    },
    {
      heading: 'Real-world use cases',
      body: [
        [
          "The clearest real-world instance of this gap is any site that ranks well in classic Google search but reports zero visibility in ChatGPT or Perplexity answers for its core topics — a pattern common enough that it's the entire premise of dedicated \"AI visibility checker\" tooling. The typical root cause, per the sources above, is either a robots.txt rule blocking a search-facing bot the site owner didn't realize existed, or a JavaScript-rendering gap where the page's real content is invisible to a crawler that doesn't execute scripts.",
        ],
        [
          'A second real-world case is the llms.txt adoption pattern: site owners have started publishing `/llms.txt` files — curated markdown maps of their important pages — as a hedge, even though no major AI provider has confirmed its live search crawlers actually consume the file to decide citations. It\'s a real, observable behavior (people are publishing these files) built on an unconfirmed mechanism, which is itself a useful case study in how uncertain the "how do I get cited" question still is industry-wide.',
        ],
      ],
    },
    {
      heading: 'Common mistakes',
      body: [
        [
          '– ',
          {
            text: 'Treating "indexed by Google" as proof of AI crawlability.',
            bold: true,
          },
          " They're evaluated by entirely different bots with different rendering and access rules.",
        ],
        [
          '– ',
          {
            text: "Blocking GPTBot and assuming that also blocks ChatGPT's live search citations.",
            bold: true,
          },
          " OAI-SearchBot is a separate user-agent; blocking one doesn't block the other.",
        ],
        [
          '– ',
          {
            text: 'Relying on client-side JavaScript to render core content',
            bold: true,
          },
          ' (FAQs, pricing, reviews) without a server-rendered fallback, invisibly cutting that content out of what most AI crawlers can read.',
        ],
        [
          '– ',
          {
            text: 'Assuming publishing `/llms.txt` guarantees or meaningfully improves citation odds',
            bold: true,
          },
          ', when no major provider has confirmed their search crawlers use it as an input at all.',
        ],
        [
          '– ',
          {
            text: 'Expecting a citation quickly after a page is first crawled.',
            bold: true,
          },
          ' "Citation velocity" is documented as slower and less predictable than Google\'s indexing timeline — patience, or re-checking over weeks rather than days, is realistic.',
        ],
      ],
    },
    {
      heading: 'Best practices for closing the crawled-to-cited gap',
      body: [
        [
          '1. ',
          { text: 'Audit robots.txt for every relevant bot individually', bold: true },
          ' — GPTBot, OAI-SearchBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, CCBot, and others — rather than assuming one rule covers the category.',
        ],
        [
          '2. ',
          {
            text: 'Server-render (or statically generate) the content you most want cited',
            bold: true,
          },
          ', especially FAQs, definitions, pricing, and data tables — the exact content types most likely to get pulled directly into an AI answer.',
        ],
        [
          '3. ',
          {
            text: 'Check your raw server-returned HTML, not just what a browser shows you',
            bold: true,
          },
          ', using a plain HTTP request or "view source" rather than the rendered DOM, to see what an AI crawler that skips JavaScript actually receives.',
        ],
        [
          '4. ',
          {
            text: "Publish a sitemap and make sure it's declared in robots.txt",
            bold: true,
          },
          ', since discoverability (a crawler finding the page at all) is a distinct requirement from the page being readable once found.',
        ],
        [
          '5. ',
          { text: "Don't stop at crawlability.", bold: true },
          " Once the technical gate is open, invest in the same distinctiveness and authority signals that drive citation — original data, clear direct answers to specific questions, and topical depth — since that's what decides citation, not the crawl itself.",
        ],
        [
          '6. ',
          { text: 'Re-check periodically, not once.', bold: true },
          " Given documented citation-velocity variability, a page that isn't cited after one check may still be cited weeks later as the AI system's index or retrieval layer catches up.",
        ],
      ],
    },
    {
      heading: 'Key takeaways',
      body: [
        [
          '– Crawled and cited are sequential, distinct events: crawlability is a disqualifying gate, while citation depends on relevance, distinctiveness, and competition against other sources.',
        ],
        [
          '– AI training crawlers (GPTBot, Google-Extended) and AI search/answer crawlers (OAI-SearchBot, PerplexityBot, Claude-SearchBot) are separate systems — blocking one does not block the other.',
        ],
        [
          "– Most AI crawlers issue a single request and skip JavaScript execution entirely, unlike Googlebot's two-stage rendering — a common, invisible reason a Google-ranking page is AI-invisible.",
        ],
        [
          '– No major AI provider has confirmed that llms.txt factors into live citation decisions — treat it as low-cost and speculative, not proven.',
        ],
        [
          '– Citation velocity is documented as slower and less predictable than Google indexing, so patience and periodic re-checking matter more than a one-time audit.',
        ],
      ],
    },
    {
      heading: 'Relevant tools.scult.in resources',
      body: [
        [
          'Start with the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' to see, per named AI crawler, whether your homepage is even clearing the "crawled" gate this article describes — it checks robots.txt precedence across ten AI bots plus structured data, page basics, llms.txt, and sitemap signals in one free run. Once crawlability is confirmed, the ',
          { text: 'schema markup generator', href: '/seo/schema-markup-generator' },
          ' helps make sure your content is structured in a way that supports being understood and cited, not just fetched.',
        ],
      ],
    },
  ],
  faq: [
    {
      question: 'What does it mean for a site to be "crawled" by AI?',
      answer: [
        'It means an AI-affiliated bot successfully requested the page, got a response, and was able to parse readable content from it — nothing more.',
      ],
    },
    {
      question: 'What does it mean for a site to be "cited" by AI?',
      answer: [
        "It means a generative AI system selected that specific page's content and referenced or quoted it while answering a user's question.",
      ],
    },
    {
      question: "Can AI cite a page it hasn't crawled?",
      answer: [
        'No — crawlability is described as a disqualifying gate; an uncrawled or unreadable page cannot be selected as a citation source.',
      ],
    },
    {
      question: "What's the difference between GPTBot and OAI-SearchBot?",
      answer: [
        "GPTBot is OpenAI's training crawler, used to gather data for model training; OAI-SearchBot is a separate crawler that fetches pages live for ChatGPT's search/answer feature. Blocking one doesn't block the other.",
      ],
    },
    {
      question:
        'Why does my site rank on Google but never get mentioned by ChatGPT or Perplexity?',
      answer: [
        "Most likely causes are a robots.txt rule blocking a search-facing AI bot, or content that's rendered via JavaScript and therefore invisible to a crawler that doesn't execute scripts — both are distinct from anything affecting your Google ranking.",
      ],
    },
    {
      question: "Does blocking ClaudeBot remove me from Claude's AI search answers?",
      answer: [
        "Blocking a search-oriented bot removes eligibility for citation in that engine specifically; check whether you're blocking the training crawler, the search crawler, or both, since they're separate user-agents.",
      ],
    },
    {
      question:
        "Why doesn't JavaScript-rendered content show up in AI answers even though it displays fine in a browser?",
      answer: [
        "Most AI crawlers issue a single request and don't execute JavaScript, so anything injected client-side after page load is invisible to them even though a human visitor sees it rendered correctly.",
      ],
    },
    {
      question: 'Is there a standard checklist for "AI crawlability"?',
      answer: [
        'Industry guides generally check robots.txt permissions, server-rendered (non-JS-dependent) content, page load within crawler timeouts, and discoverable internal linking or a sitemap.',
      ],
    },
    {
      question:
        'How fast can new content be crawled and then cited by an AI search engine?',
      answer: [
        'There\'s no fixed universal timeline; this is referred to as "citation velocity" and is described as generally slower and less predictable than traditional Google indexing.',
      ],
    },
    {
      question: 'Does anyone actually use llms.txt to decide what to cite?',
      answer: [
        'As of the most recent discussion found, no major AI provider has confirmed its live search/answer crawlers read llms.txt to make citation decisions.',
      ],
    },
    {
      question: 'What is the "Five-C" framework mentioned in AI citation guidance?',
      answer: [
        "A funnel model — crawlable, consumed, considered relevant, competing successfully against other sources, then finally cited — used to explain why crawlability alone doesn't guarantee citation.",
      ],
    },
    {
      question: 'Are AI training crawlers and AI search crawlers the same thing?',
      answer: [
        'No — training crawlers (e.g., GPTBot, Google-Extended) feed model training; separate search/answer crawlers (e.g., OAI-SearchBot, PerplexityBot, Claude-SearchBot) fetch content live to generate answers.',
      ],
    },
    {
      question: 'Does Googlebot render JavaScript the same way AI crawlers do?',
      answer: [
        'No — Googlebot executes JavaScript in a documented two-stage rendering process; most AI crawlers do not execute JavaScript at all, reading only the initial server response.',
      ],
    },
    {
      question:
        'What happens if my robots.txt blocks "User-agent: *" but allows GPTBot specifically?',
      answer: [
        "The bot-specific rule takes precedence for that bot; a wildcard block wouldn't override an explicit allow rule written for the named crawler.",
      ],
    },
    {
      question: 'Can a page be crawlable but still never get cited?',
      answer: [
        'Yes — clearing the crawlability gate is necessary but not sufficient; whether content is actually cited depends on relevance, distinctiveness, and competition from other sources for that specific query.',
      ],
    },
    {
      question: "What is a sitemap's role in AI crawlability?",
      answer: [
        "It helps a crawler discover pages beyond the homepage; a page a crawler can't find can't be crawled, regardless of how well-optimized that page's content is.",
      ],
    },
    {
      question: 'Do AI crawlers respect robots.txt the same way Googlebot does?',
      answer: [
        "Reputable AI crawlers generally follow robots.txt as a voluntary, documented convention, the same honor-system basis Googlebot and other search crawlers operate on — it's not a technical enforcement mechanism.",
      ],
    },
    {
      question: 'What is CCBot and why does it matter for AI visibility?',
      answer: [
        "CCBot is the crawler for Common Crawl, a dataset widely used to train various AI models; blocking or allowing it affects whether your content enters that training corpus, separate from any specific company's search bot.",
      ],
    },
    {
      question: 'Does allowing AI crawlers hurt my server performance?',
      answer: [
        "This wasn't directly addressed in the sources reviewed here; server load from crawler traffic is a general technical consideration but not one with AI-crawler-specific data in this research.",
      ],
    },
    {
      question: 'Is being crawled by AI the same as being indexed by AI?',
      answer: [
        '"Indexed" isn\'t a term AI answer engines use the same way search engines do; being crawled and readable is closer to "eligible to be considered," not a formal index entry with guaranteed retrieval.',
      ],
    },
    {
      question: 'How do I check if AI bots can crawl my site?',
      answer: [
        'Review your robots.txt for each relevant bot by name, and check what your server returns on a raw HTTP request (not what a browser renders) to see what a non-JS-executing crawler would actually receive.',
      ],
    },
    {
      question: 'How do I allow GPTBot but block Google-Extended?',
      answer: [
        "Write separate `User-agent` groups in robots.txt for each bot with its own `Allow`/`Disallow` rules — they're independent crawlers and can be configured independently.",
      ],
    },
    {
      question: 'How do I improve my AI citation rate?',
      answer: [
        'Confirm crawlability first (robots.txt, server-rendered content, discoverability), then focus on content distinctiveness and directness — clear, specific answers to the exact questions your audience asks — since that\'s what wins the "cited" decision once the gate is cleared.',
      ],
    },
    {
      question:
        'How do I check what an AI crawler actually sees on my page, since it skips JavaScript?',
      answer: [
        "Fetch the page with a basic HTTP request tool (not a browser) and read the raw HTML returned — that's a close approximation of what a non-JS-executing crawler receives.",
      ],
    },
    {
      question: "How do I server-render content that's currently JavaScript-only?",
      answer: [
        'Depending on your stack, that typically means switching to server-side rendering, static generation, or at minimum ensuring critical text (FAQs, key data) is present in the initial HTML response rather than injected after load.',
      ],
    },
    {
      question: 'How do I find out which AI crawlers have actually visited my site?',
      answer: [
        'Check your server access logs for known AI crawler user-agent strings (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, etc.) to see real crawl activity rather than assuming based on robots.txt configuration alone.',
      ],
    },
    {
      question: 'How do I write an llms.txt file, and is it worth the effort?',
      answer: [
        "It's a plain markdown file at `/llms.txt` listing your key pages with short summaries; it's low-cost to create, but treat it as a speculative signal rather than a confirmed citation lever, since no major provider has confirmed using it that way.",
      ],
    },
    {
      question:
        'AI bots blocked by robots.txt — how do I tell which specific bot is blocked?',
      answer: [
        'Read your robots.txt line by line for each `User-agent` group and cross-reference against the specific bot names (GPTBot, ClaudeBot, PerplexityBot, etc.) you care about — a generic wildcard rule can hide a specific bot-level block or allow.',
      ],
    },
    {
      question:
        "My site ranks on Google but doesn't appear in ChatGPT — what's actually wrong?",
      answer: [
        'Most likely either a robots.txt rule blocking OAI-SearchBot specifically, or content that only renders via client-side JavaScript and is therefore invisible to the crawler reading raw HTML.',
      ],
    },
    {
      question:
        'Javascript content is invisible to AI crawlers — how do I confirm this is actually my problem?',
      answer: [
        "Compare what you see in a browser's rendered page against the raw HTML your server returns before any JavaScript executes — if the content you care about is missing from the raw response, that's the gap.",
      ],
    },
    {
      question:
        'Is there a meaningful technical difference between "crawlable" and "renderable" in this context?',
      answer: [
        "Yes — crawlable means the bot can fetch a response at all; renderable (in the human-browser sense) is irrelevant to most AI crawlers, since they generally don't execute the JavaScript that produces that rendered result.",
      ],
    },
    {
      question:
        "Does structured data (schema markup) affect whether a page is crawled or whether it's cited?",
      answer: [
        'It doesn\'t affect crawlability directly, but well-implemented schema helps a crawler parse and understand content correctly once it has already fetched the page — closer to a "consumed and understood" factor than a "crawled" one in the Five-C funnel.',
      ],
    },
    {
      question: 'Can a page be cited without ranking well in traditional Google search?',
      answer: [
        "Conceptually yes, since AI citation and Google ranking are evaluated by different systems with different criteria, though this research didn't find a documented case specifically isolating that scenario.",
      ],
    },
    {
      question:
        'Does citation velocity vary by AI platform (ChatGPT vs. Perplexity vs. Google AI Overviews)?',
      answer: [
        'Industry guidance describes it as varying significantly by platform and content type without giving a fixed number for any one platform, so treat any specific timeline claim for a named platform with caution.',
      ],
    },
    {
      question: 'Is there a way to force faster crawling by an AI bot?',
      answer: [
        'No documented mechanism for forcing crawl frequency was found in this research; the practical levers are ensuring crawlability, discoverability (sitemap, internal linking), and allowing the relevant bots — not requesting or paying for priority crawling.',
      ],
    },
    {
      question: 'Crawled vs. cited vs. ranked — how are these three actually different?',
      answer: [
        "Crawled is about access; ranked is a traditional search-engine relevance/authority evaluation; cited is a generative AI system's decision to quote or reference a source in a specific answer — three distinct evaluations by different systems.",
      ],
    },
    {
      question:
        'AI crawlability vs. traditional SEO indexability — is the checklist the same?',
      answer: [
        'They overlap (robots.txt, discoverability, server response) but diverge sharply on JavaScript rendering, since Googlebot executes it in a second pass and most AI crawlers do not.',
      ],
    },
    {
      question:
        'AI training crawlers vs. AI search crawlers — does blocking one affect the other?',
      answer: [
        "No — they're separate systems with separate user-agent strings and separate robots.txt rules; a policy targeting one has no automatic effect on the other.",
      ],
    },
    {
      question:
        "GPTBot vs. OAI-SearchBot — which one determines whether I show up in ChatGPT's answers?",
      answer: [
        "OAI-SearchBot is the one tied to ChatGPT's live search/answer feature; GPTBot is specifically about training data collection.",
      ],
    },
    {
      question: 'Should I treat llms.txt the same as robots.txt in terms of priority?',
      answer: [
        "No — robots.txt has documented, widely honored crawler behavior behind it; llms.txt's actual consumption by AI systems' citation logic remains unconfirmed by any major provider as of the most recent discussion found.",
      ],
    },
    {
      question:
        "I checked and none of my robots.txt rules block AI bots, but I still don't see citations — what else could it be?",
      answer: [
        "The most likely remaining causes are JavaScript-rendered content the crawler can't see, or the content simply not being distinctive/authoritative enough to win a citation slot against competing sources for that query — crawlability being clear rules out only the first gate.",
      ],
    },
    {
      question:
        "My server logs show GPTBot visiting regularly, but I've never been cited by ChatGPT — why?",
      answer: [
        "GPTBot is a training crawler, not the one tied to ChatGPT's live search citations (OAI-SearchBot is); regular GPTBot visits confirm training-data collection, not search citation eligibility.",
      ],
    },
    {
      question:
        "I fixed my robots.txt weeks ago and still haven't seen a citation — is something broken?",
      answer: [
        "Not necessarily — citation velocity is documented as slower and less predictable than Google's indexing timeline, so a multi-week gap after a fix isn't automatically a sign of a remaining technical problem.",
      ],
    },
    {
      question:
        "My competitor's page is cited and mine isn't, even though we cover the same topic — what's different?",
      answer: [
        "Once both pages clear the crawlability gate, the decision comes down to relevance, distinctiveness, and perceived authority for that specific query — a technical crawlability audit won't explain a difference at that stage.",
      ],
    },
    {
      question:
        'I published llms.txt and still see no change in citations — did I do something wrong?',
      answer: [
        'Not necessarily — since no major AI provider has confirmed using llms.txt in its citation decisions, an unchanged citation rate after publishing it is consistent with the file simply not being a citation input for that platform yet.',
      ],
    },
    {
      question: "What's the best AI crawlability audit tool?",
      answer: [
        'Rather than naming a single "best" option, the useful category is a tool that checks robots.txt precedence and access across the ten or so named AI bots, and flags JavaScript-dependent content — ',
        {
          text: "tools.scult.in's AI Visibility Checker",
          href: '/geo/ai-visibility-checker',
        },
        ' is built around exactly that checklist.',
      ],
    },
    {
      question:
        'Is there a tool to check AI crawlability for free without an email gate?',
      answer: [
        'Yes — ',
        { text: 'the AI Visibility Checker', href: '/geo/ai-visibility-checker' },
        ' runs as a free, no-signup check against ten named AI crawlers plus structured data, page basics, llms.txt, and sitemap signals.',
      ],
    },
    {
      question:
        'Should I hire someone to fix AI crawlability issues, or can I do it myself?',
      answer: [
        'A robots.txt audit and a raw-HTML check are things most technical site owners can do themselves; server-side rendering changes for a JavaScript-heavy site are a larger engineering task that may be worth outsourcing.',
      ],
    },
    {
      question: 'Does adding schema markup help me get cited faster?',
      answer: [
        'It\'s more accurate to say schema helps a crawler that has already fetched your page understand it correctly, which supports the "consumed and understood" step of the citation funnel rather than the crawl step itself — ',
        { text: 'the schema markup generator', href: '/seo/schema-markup-generator' },
        ' is a reasonable starting point for adding it correctly.',
      ],
    },
    {
      question:
        'What should I check first if I suspect my site has a crawled-but-not-cited problem?',
      answer: [
        'Start with robots.txt across every relevant AI bot by name, then compare your raw server-returned HTML against what a browser renders — those two checks catch the majority of the documented failure patterns in this article before you need to think about content-quality fixes.',
      ],
    },
  ],
  sources: [
    'https://www.amicited.com/blog/ai-training-crawlers-vs-search-crawlers/',
    'https://www.conductor.com/academy/ai-crawlability/',
    'https://www.conductor.com/academy/ai-citation-velocity/',
    'https://www.mersel.ai/blog/how-to-block-or-allow-ai-bots-on-your-website',
    'https://www.averi.ai/blog/javascript-rendering-gap-ai-crawlers',
    'https://jangwook.net/en/blog/en/ai-crawlers-dont-render-javascript-csr-2026/',
    'https://www.womenintechseo.com/knowledge/ai-crawlability-for-ai-search/',
    'https://news.ycombinator.com/item?id=48410783',
  ],
  relatedTools: ['ai-visibility-checker', 'schema-markup-generator'],
  relatedPrompts: [],
  updatedAt: '2026-08-21',
  readingMinutes: 16,
}
