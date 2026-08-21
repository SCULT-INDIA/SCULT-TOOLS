import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = "how-to-find-ai-answer-engine-citations"
const SERVICE_SEO_COMPANIES_FOR_SMALL_BUSINESS = resolveServiceLink("seo-companies-for-small-business", SLUG)

/**
 * Generated from content-engine/05-drafts/article_001.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "How to Find AI Answer Engine Citations From ChatGPT, Perplexity & AI Overviews",
  h1: "How to Find AI Answer Engine Citations From ChatGPT, Perplexity & AI Overviews",
  targetKeyword: "how to find ai answer engine citations",
  description: "Learn what an AI citation actually looks like, which free and paid tools track them, and how to check if ChatGPT, Perplexity, or Google AI Overviews cite your site.",
  dek: "A \"citation\" from an AI answer engine is a specific, named or linked source that the engine points to as the evidence behind part of its answer — different from a vague brand mention with no link. You find yours by running your brand and topic queries through ChatGPT, Perplexity, and Google AI Overviews directly, by checking the new AI reporting Google is rolling into Search Console, or by using a dedicated AI-visibility tracker (free or paid) that automates this across dozens of prompts at once.",
  sections: [
    {
      heading: "What a citation actually looks like",
      body: [
        ["In classic SEO, \"citation\" sometimes means a local business directory listing. In AI search, it means something narrower and more specific: a link or named source that an AI engine explicitly points to as the basis for a claim inside a generated answer. Otterly.ai, one of the earlier dedicated AI-visibility platforms, describes this as a linked reference embedded within the AI-generated answer — the engine names or links a specific external domain or page it drew from, which is distinct from simply mentioning a brand name in passing with no attribution at all (", { text: "Otterly.ai", href: "https://otterly.ai/", external: true }, ")."],
        ["That distinction matters because it changes what you're supposed to be measuring. A \"mention\" is Bertie's Bakery coming up in a ChatGPT answer about good bakeries in Austin. A \"citation\" is that same answer including a clickable link or footnote number pointing to bertiesbakery.com or a review site that reviewed it. Mentions build brand awareness; citations build referral traffic and, in aggregate, something agencies are starting to call \"citation share\" — your brand's percentage of the links AI engines hand out for a given topic (", { text: "Forbes Agency Council", href: "https://www.forbes.com/councils/forbesagencycouncil/2026/06/29/how-agencies-can-tap-into-better-ai-citation-results/", external: true }, ")."],
        ["Each engine surfaces citations differently:"],
        ["– ", { text: "ChatGPT", bold: true }, " (in web-search mode) shows small numbered footnotes or a \"Sources\" strip beneath a response, each linking to a specific page."],
        ["– ", { text: "Perplexity", bold: true }, " shows numbered citation bubbles inline in the answer text, with a sources panel listing every domain used."],
        ["– ", { text: "Google AI Overviews", bold: true }, " and ", { text: "AI Mode", bold: true }, " show a card or carousel of linked sources alongside (or within) the generated summary, often several links per answer rather than one."],
        ["– ", { text: "Gemini", bold: true }, ", when grounded with Search, behaves similarly to AI Overviews, surfacing a small set of linked sources."],
        ["Research from BrightEdge, reported by Search Engine Journal, adds an important wrinkle: AI engines don't just retrieve and rank sources the way classic search does. They appear to assign different sources different \"jobs\" inside a single answer — one citation might serve as the authority reference, another as social proof, another as a how-to walkthrough — depending on the query type (", { text: "Search Engine Journal", href: "https://www.searchenginejournal.com/research-suggests-ai-engines-assign-ranking-roles-to-sources/578620/", external: true }, "). That means the same page might get cited for a comparison query but not for a direct \"what is X\" query, even on the identical topic."],
      ],
    },
    {
      heading: "Where to check manually, for free",
      body: [
        ["Before paying for a tracking platform, you can get a real (if noisy) sample of your citation status manually:"],
        ["1. ", { text: "Query the engines directly.", bold: true }, " Open ChatGPT with web search enabled, Perplexity, and Google (typing a query that would trigger an AI Overview), and ask the exact questions your target customers would ask — not just \"who is [my brand],\" but the underlying problem queries (\"best invoicing tool for freelancers,\" \"how to generate a QR code for a menu\"). Note whether your domain appears as a linked source, not just whether your brand name is spoken."],
        ["2. ", { text: "Repeat each query 3-5 times.", bold: true }, " AI answers are non-deterministic — the same prompt can return different sources on different runs, so a single check is not a reliable \"yes/no.\""],
        ["3. ", { text: "Check incognito/logged-out sessions too", bold: true }, ", since personalization and prior chat history can bias which sources reappear for you specifically versus a new customer."],
        ["4. ", { text: "Search your brand name directly", bold: true }, " in each engine to see if it can describe you at all — if the base description is wrong or missing, that's often the reason you're not being cited for topic queries, before you even get to citation tracking."],
        ["This manual approach doesn't scale past a handful of keywords, but it's the right first move before investing in software, because it tells you honestly whether there's anything to track yet."],
      ],
    },
    {
      heading: "Google Search Console's new AI reporting",
      body: [
        ["For years, the biggest blind spot in this space was that Google Search Console only reported on classic organic Search — AI Overviews and AI Mode impressions were invisible in the interface even though they were (and are) real search surfaces. That changed in 2026. Google began rolling out new Search Console reporting specifically for its generative AI search surfaces, including impression metrics and country-level breakdowns for pages appearing inside AI Overviews and AI Mode. As of mid-2026 this was still in limited testing with a subset of UK site owners ahead of a wider rollout (", { text: "9to5Google", href: "https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/", external: true }, "; corroborated by ", { text: "Search Engine Roundtable", href: "https://www.seroundtable.com/google-ai-performance-report-blocking-controls-41443.html", external: true }, ")."],
        ["Alongside the new reporting, Google also confirmed a related but separate feature: a toggle that lets site owners opt out of AI Overviews, AI Mode, and AI Overviews-in-Discover specifically, without affecting how the site performs in regular Google Search results. Google stated explicitly that this new control will not be used as a ranking signal for classic search — it only removes eligibility for the generative surfaces (", { text: "9to5Google", href: "https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/", external: true }, ")."],
        ["Practically, this means the most authoritative place to eventually check AI Overview citation data for your own site is Search Console itself, once the reporting reaches your account — because it's first-party data straight from Google, not an inferred estimate from a third-party tool sampling a handful of prompts. Until it's fully rolled out to your property, third-party trackers remain the only way to get citation-level visibility, and even after rollout they'll still be the only way to see ChatGPT, Perplexity, and Gemini citations, since those platforms don't offer their own Search-Console equivalent for site owners."],
      ],
    },
    {
      heading: "Dedicated AI citation tracking tools",
      body: [
        ["Because manual checking doesn't scale, a real product category has formed around exactly this problem, spanning free checkers, open-source monitors, and enterprise platforms."],
        [{ text: "Free / freemium checkers.", bold: true }, " Semrush offers a free AI Search Visibility Checker that shows brand mentions and citations across ChatGPT, Gemini, AI Mode, and AI Overviews for a given domain (", { text: "Semrush", href: "https://www.semrush.com/free-tools/ai-search-visibility-checker/", external: true }, "). Several other vendors, including Frase, Answer Visibility Lab, and various point tools, run one-off free checks that show which domains got cited for a sample set of prompts related to yours (", { text: "Frase", href: "https://www.frase.io/blog/the-10-best-ai-visibility-tools-in-2026", external: true }, ")."],
        [{ text: "Open-source monitors.", bold: true }, " Canonry and Elmo are two AEO (answer-engine optimization) monitoring tools that launched as open-source projects on GitHub, letting technically capable teams run their own prompt sets against multiple AI engines and log citation results without paying a SaaS subscription (", { text: "Canonry", href: "https://github.com/AINYC/canonry", external: true }, "; ", { text: "Elmo", href: "https://github.com/elmohq/elmo", external: true }, ")."],
        [{ text: "Paid platforms.", bold: true }, " Otterly.ai, Profound, Peec AI, SE Ranking's AI toolkit, and enterprise entrants like Somantra (which launched a \"Brand Consideration Score\" metric specifically for this category) run scheduled prompt sets across ChatGPT, Perplexity, Gemini, and Google AI Overviews on your behalf, tracking citation share over time, competitor comparisons, and which specific pages get pulled in (", { text: "Otterly.ai", href: "https://otterly.ai/", external: true }, "; ", { text: "Somantra via Yahoo Finance", href: "https://finance.yahoo.com/technology/ai/articles/somantra-enterprise-grade-answer-engine-130000005.html", external: true }, ")."],
        [{ text: "Community-driven tools.", bold: true }, " Spiderseek and Prominara are newer entrants that launched via Hacker News's Show HN, indicating genuine grassroots builder demand for this exact problem rather than only top-down enterprise tooling (", { text: "Spiderseek", href: "https://www.spiderseek.com", external: true }, "; Prominara). The existence of multiple independently-built open-source and indie tools solving the same problem is itself decent evidence that \"am I being cited by AI\" has become a real, felt pain point rather than a hypothetical one."],
        ["A 2026 industry aggregation — described as an \"AI Platform Citation Source Index\" — synthesized roughly 680 million tracked AI citations pulled from nine separate third-party studies (Similarweb, Semrush, Ahrefs, Profound, Peec AI, SE Ranking, and others), covering ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews (", { text: "Forbes Agency Council", href: "https://www.forbes.com/councils/forbesagencycouncil/2026/06/29/how-agencies-can-tap-into-better-ai-citation-results/", external: true }, "). That scale of aggregated tracking is a strong signal that citation monitoring has moved from a niche experiment to a mainstream measurement category within about two years of AI Overviews and ChatGPT search becoming mainstream."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Illustrative example (clearly hypothetical):", bold: true }, " Imagine a small SaaS company that sells invoicing software. Its marketing lead runs \"best invoicing software for freelancers\" through ChatGPT, Perplexity, and a Google search that triggers an AI Overview. In Perplexity, their product appears as citation #4 alongside three larger competitors. In ChatGPT, their product is named in the text but with no clickable source — a mention, not a citation. In the Google AI Overview, they don't appear at all, even though their blog post on the topic ranks #6 in classic organic results. This asymmetry — present in one engine's citations, mentioned without a link in another, absent from the third — is exactly the pattern that citation-tracking tools are built to catch, because a single spot-check in only one engine would have missed two-thirds of the real picture."],
        [{ text: "Real, sourced example:", bold: true }, " Entrepreneur's reporting on brand visibility in AI search highlights that Reddit carries a disproportionately large share of AI citations relative to its size as a single domain — reinforcing that citation share is not evenly distributed across the web the way classic backlink authority roughly is, and that community platforms often outperform brand-owned domains in this specific measurement (", { text: "Entrepreneur", href: "https://www.entrepreneur.com/building-a-business/your-brand-will-be-invisible-in-ai-search-if-youre-not-showing-up-on-these-8-channels", external: true }, ")."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– Otterly.ai's own product framing distinguishes a \"citation\" (linked source) from a \"mention\" (unlinked brand name) as the foundational unit tracked by AI-visibility tools (", { text: "Otterly.ai", href: "https://otterly.ai/", external: true }, ")."],
        ["– Google's Search Console AI-surface reporting was in limited rollout to a subset of UK site owners as of the June 2026 announcement, with country-level impression breakdowns planned (", { text: "9to5Google", href: "https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/", external: true }, ")."],
        ["– The AI Overviews/AI Mode opt-out toggle in Search Console does not affect regular Search rankings, per Google's own statement (", { text: "9to5Google", href: "https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/", external: true }, ")."],
        ["– A 2026 cross-vendor synthesis tracked roughly 680 million AI citations across nine independent studies spanning five major AI platforms (", { text: "Forbes Agency Council", href: "https://www.forbes.com/councils/forbesagencycouncil/2026/06/29/how-agencies-can-tap-into-better-ai-citation-results/", external: true }, ")."],
        ["– BrightEdge research indicates AI engines assign different sources different functional roles within an answer rather than uniformly ranking them the way classic search does (", { text: "Search Engine Journal", href: "https://www.searchenginejournal.com/research-suggests-ai-engines-assign-ranking-roles-to-sources/578620/", external: true }, ")."],
        ["– Evidence not sufficiently verified: there is no independently audited, universal \"citation rate\" benchmark that applies across all industries and all AI engines — vendor-reported percentages vary widely by methodology, sample size, and which engines were tested, so treat any single \"X% of citations go to Y\" statistic as specific to that study's dataset rather than a market-wide constant unless the source explicitly says otherwise."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        ["Approach: Manual spot-checks in ChatGPT/Perplexity/Google · Cost: Free · Coverage: Very limited, non-systematic · Best for: Quick sanity check, one-off research"],
        ["Approach: Semrush free AI Visibility Checker · Cost: Free · Coverage: Single domain, sample prompts · Best for: First-time visibility snapshot"],
        ["Approach: Open-source (Canonry, Elmo) · Cost: Free (self-hosted) · Coverage: Depends on your own prompt sets and infra · Best for: Technical teams wanting full control/no vendor lock-in"],
        ["Approach: Otterly.ai / Peec AI / Profound / SE Ranking · Cost: Paid, tiered · Coverage: Scheduled, multi-engine, competitor tracking · Best for: Agencies and brands needing repeatable reporting"],
        ["Approach: Google Search Console AI reporting (once available) · Cost: Free, built-in · Coverage: First-party data, Google surfaces only · Best for: Confirming Google-specific AI Overview/AI Mode performance"],
        ["None of these is a full substitute for the others: Search Console (once rolled out) will only ever cover Google's own AI surfaces, so anyone who also cares about ChatGPT or Perplexity citations still needs a third-party tracker regardless of how good Google's native reporting becomes."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["– ", { text: "Agencies", bold: true }, " are increasingly asked by clients to report \"citation share\" alongside traditional SEO KPIs like rankings and organic traffic, per Forbes Agency Council commentary on how agencies are adapting their reporting stack (", { text: "Forbes", href: "https://www.forbes.com/councils/forbesagencycouncil/2026/06/29/how-agencies-can-tap-into-better-ai-citation-results/", external: true }, ")."],
        ["– ", { text: "Open-source builders", bold: true }, " created Canonry and Elmo specifically because existing paid AEO tools didn't fit budget-constrained or privacy-sensitive teams, and both launched to community attention on GitHub/Hacker News-adjacent channels (", { text: "Canonry", href: "https://github.com/AINYC/canonry", external: true }, "; ", { text: "Elmo", href: "https://github.com/elmohq/elmo", external: true }, ")."],
        ["– ", { text: "Enterprise brand teams", bold: true }, " are adopting purpose-built scoring systems like Somantra's Brand Consideration Score to turn raw citation data into a single trackable metric leadership can monitor quarter over quarter (", { text: "Yahoo Finance", href: "https://finance.yahoo.com/technology/ai/articles/somantra-enterprise-grade-answer-engine-130000005.html", external: true }, ")."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– ", { text: "Treating one prompt run as definitive.", bold: true }, " AI answers vary run to run; a single \"not cited\" result doesn't mean you never get cited for that query."],
        ["– ", { text: "Confusing a mention with a citation.", bold: true }, " Being named without a link is a much weaker outcome and shouldn't be reported to a client as equivalent to a citation."],
        ["– ", { text: "Ignoring engine-specific behavior.", bold: true }, " Assuming that fixing your Google AI Overview presence will automatically fix ChatGPT or Perplexity citations — the BrightEdge research on source \"roles\" suggests each engine can behave quite differently for the same query."],
        ["– ", { text: "Waiting for Search Console's AI reporting to cover everything.", bold: true }, " It will only ever report on Google's own AI surfaces, not ChatGPT, Perplexity, or Gemini's standalone app."],
        ["– ", { text: "Not checking logged-out/incognito.", bold: true }, " Personalization can distort what you see versus what an average new user sees."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– Build a fixed list of 15-30 real customer-intent queries (not brand-name queries) and re-run them on a schedule, manually or via a tool."],
        ["– Track \"citation,\" \"mention,\" and \"absent\" as three distinct outcomes per engine per query, not a single binary."],
        ["– Use a free checker first to establish a baseline before paying for a subscription tool."],
        ["– Once Google's AI Search Console reporting reaches your property, treat it as your source of truth for Google's own surfaces and keep a separate tracker for the rest."],
        ["– Pair citation tracking with the underlying content and technical fixes — tracking alone doesn't move the number; it only tells you where you stand."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– A citation is a linked/named source inside an AI-generated answer — stronger and more specific than a plain brand mention."],
        ["– No single check is reliable; AI answers vary run to run, so track patterns across repeated queries and multiple engines."],
        ["– Google's Search Console is adding native AI-surface reporting, but it only ever covers Google's own AI Overviews/AI Mode — you still need a separate approach for ChatGPT, Perplexity, and Gemini."],
        ["– Both free/open-source (Canonry, Elmo, Semrush's free checker) and paid (Otterly.ai, Profound, Peec AI) tools exist — start free, upgrade once you need recurring competitor-benchmarked tracking."],
        ["– AI engines assign sources different \"roles\" per query type, so being cited in one context doesn't guarantee citation in another, even on the same topic."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["Run your own domain through the ", { text: "AI Visibility Checker", href: "/geo/ai-visibility-checker" }, " to get an immediate, free baseline read on whether AI engines currently mention or cite your site before investing in a paid tracking subscription."],
        ["If you're finding real gaps between how you rank on Google and how you show up in AI answers, that's often a signal worth a conversation with a team that treats GEO/AEO as a distinct discipline from classic SEO — scult.in's ", { text: "SEO & GEO services", href: SERVICE_SEO_COMPANIES_FOR_SMALL_BUSINESS.href, external: true }, " work through exactly this kind of citation-share diagnosis and the content/technical fixes that follow from it."],
        ["For a related, free starting point, try the ", { text: "Schema Markup Generator", href: "/seo/schema-markup-generator" }, "."],
      ],
    },
  ],
  faq: [
    {
      question: "What is an AI citation in simple terms?",
      answer: ["A specific, often linked, source that an AI engine points to as the evidence for part of its generated answer."],
    },
    {
      question: "Is a brand mention the same as a citation?",
      answer: ["No — a mention is just your name appearing in the text; a citation includes a link or explicit source attribution (", { text: "Otterly.ai", href: "https://otterly.ai/", external: true }, ")."],
    },
    {
      question: "Which AI engines currently show citations to users?",
      answer: ["ChatGPT (web-search mode), Perplexity, Google AI Overviews, Google AI Mode, and Gemini when grounded with Search."],
    },
    {
      question: "Do I need a paid tool to check my citations?",
      answer: ["No — free tools like Semrush's AI Search Visibility Checker and manual spot-checks in each engine can give you a first read."],
    },
    {
      question: "How often do AI engines change what they cite for the same query?",
      answer: ["Frequently enough that a single check isn't reliable; repeat queries multiple times and on different days."],
    },
    {
      question: "Can I see AI citations for free at all?",
      answer: ["Yes, several vendors offer free one-off or limited checks, including Semrush (", { text: "Semrush", href: "https://www.semrush.com/free-tools/ai-search-visibility-checker/", external: true }, ")."],
    },
    {
      question: "Does Google Search Console show AI citation data?",
      answer: ["It's rolling out new AI-surface reporting, but as of mid-2026 it was in limited testing, not fully available to all site owners (", { text: "9to5Google", href: "https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/", external: true }, ")."],
    },
    {
      question: "What's the difference between \"AI Overviews\" and \"AI Mode\" in Google?",
      answer: ["AI Overviews are the generative summary boxes shown within standard Google Search results; AI Mode is a more conversational, dedicated AI search experience — both can cite sources, and both are covered by the same new opt-out control."],
    },
    {
      question: "Do I need to be ranking on Google to get cited by an AI engine?",
      answer: ["Not necessarily — ranking and citation are related but distinct; see our companion article on why pages can rank on Google without being cited by AI."],
    },
    {
      question: "Is citation tracking only relevant to big brands?",
      answer: ["No — Forbes Agency Council commentary frames citation share as something agencies are now reporting for clients of many sizes, including small businesses (", { text: "Forbes", href: "https://www.forbes.com/councils/forbesagencycouncil/2026/06/29/how-agencies-can-tap-into-better-ai-citation-results/", external: true }, ")."],
    },
    {
      question: "Why do AI engines cite different sources for similar queries?",
      answer: ["Research suggests they assign different sources different functional \"roles\" in an answer depending on query type, rather than applying one uniform ranking (", { text: "Search Engine Journal", href: "https://www.searchenginejournal.com/research-suggests-ai-engines-assign-ranking-roles-to-sources/578620/", external: true }, ")."],
    },
    {
      question: "Is citation tracking the same thing as rank tracking?",
      answer: ["No — rank tracking measures position in a list of links; citation tracking measures whether and how you're used as evidence inside a generated answer."],
    },
    {
      question: "What does \"citation share\" mean?",
      answer: ["The percentage of citations for a given topic or query set that go to your domain versus competitors (", { text: "Forbes", href: "https://www.forbes.com/councils/forbesagencycouncil/2026/06/29/how-agencies-can-tap-into-better-ai-citation-results/", external: true }, ")."],
    },
    {
      question: "Are open-source AEO monitoring tools reliable for a small team?",
      answer: ["They can be, if your team has the technical capacity to run and maintain them; Canonry and Elmo are both real, actively shared open-source projects (", { text: "Canonry", href: "https://github.com/AINYC/canonry", external: true }, "; ", { text: "Elmo", href: "https://github.com/elmohq/elmo", external: true }, ")."],
    },
    {
      question: "Do citation tracking tools guarantee accuracy?",
      answer: ["No tool can guarantee 100% accuracy because the underlying AI answers themselves are non-deterministic; tools sample and estimate, they don't capture every possible answer."],
    },
    {
      question: "What's the \"AI Platform Citation Source Index\"?",
      answer: ["A 2026 industry synthesis aggregating roughly 680 million tracked citations from nine separate studies across five major AI platforms (", { text: "Forbes", href: "https://www.forbes.com/councils/forbesagencycouncil/2026/06/29/how-agencies-can-tap-into-better-ai-citation-results/", external: true }, ")."],
    },
    {
      question: "Does opting out of AI Overviews hurt my regular Google ranking?",
      answer: ["No — Google stated the opt-out control does not affect classic Search ranking (", { text: "9to5Google", href: "https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/", external: true }, ")."],
    },
    {
      question: "Why would a business want to opt out of AI Overviews at all?",
      answer: ["Some publishers worry AI Overviews reduce click-through to their site since users get an answer without visiting; opting out trades away potential citation exposure for the possibility of preserving classic click-throughs, though this trade-off isn't settled either way."],
    },
    {
      question: "Can citations come from social platforms like Reddit or LinkedIn?",
      answer: ["Yes — reporting indicates Reddit in particular carries a disproportionate share of AI citations relative to its size (", { text: "Entrepreneur", href: "https://www.entrepreneur.com/building-a-business/your-brand-will-be-invisible-in-ai-search-if-youre-not-showing-up-on-these-8-channels", external: true }, ")."],
    },
    {
      question: "Is \"citation\" the correct technical term across the whole industry, or do vendors use different words?",
      answer: ["Most vendors use \"citation\" for a linked reference and \"mention\" for an unlinked name, but exact terminology can vary slightly by vendor dashboard."],
    },
    {
      question: "How do I manually check if ChatGPT cites my site?",
      answer: ["Turn on web search in ChatGPT, ask a real customer-intent question related to your business, and look for a footnote/source link pointing to your domain, repeating a few times across sessions."],
    },
    {
      question: "How do I manually check Perplexity citations?",
      answer: ["Ask your target query in Perplexity and scan the numbered citation bubbles and the sources panel for your domain."],
    },
    {
      question: "How do I check if I appear in a Google AI Overview?",
      answer: ["Search a query likely to trigger an AI Overview (often informational, \"how to\" or \"best X\" queries) and check the linked source cards beneath the generated summary."],
    },
    {
      question: "How many queries should I test before drawing conclusions?",
      answer: ["At least 15-30 real customer-intent queries, repeated a few times each, rather than one or two brand-name searches."],
    },
    {
      question: "Should I test logged-in or logged-out?",
      answer: ["Test logged-out/incognito as well, since personalization can bias which sources you personally see."],
    },
    {
      question: "What should I do first if I find zero citations anywhere?",
      answer: ["Check whether you even have a mention first — sometimes brands aren't recognized as entities yet, which is a more foundational problem than citation optimization."],
    },
    {
      question: "Can I set up a free recurring check without paying for software?",
      answer: ["You can manually repeat the same query list on a schedule (e.g., monthly) and log results in a spreadsheet, though this is more labor-intensive than automated tools."],
    },
    {
      question: "How do I check if Google's new AI Search Console reporting is available to me yet?",
      answer: ["Check your Search Console property's Performance report for a new AI-surface filter or report section; as of mid-2026 it was limited to a subset of UK properties (", { text: "9to5Google", href: "https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/", external: true }, ")."],
    },
    {
      question: "How do I compare my citation performance to a competitor's?",
      answer: ["Run the same query set against your domain and a named competitor's domain across each engine, or use a paid tracker with built-in competitor comparison (Otterly.ai, Profound, Peec AI, SE Ranking all offer this)."],
    },
    {
      question: "What's the fastest way to get a first citation snapshot today?",
      answer: ["Run a free tool like Semrush's AI Search Visibility Checker, then manually verify a handful of the flagged queries yourself in each engine."],
    },
    {
      question: "Do different AI engines weight the same source differently by query type?",
      answer: ["Yes — this is exactly what BrightEdge's \"source roles\" research describes: the same domain can be an authority citation in one context and absent in another (", { text: "Search Engine Journal", href: "https://www.searchenginejournal.com/research-suggests-ai-engines-assign-ranking-roles-to-sources/578620/", external: true }, ")."],
    },
    {
      question: "Can citation tracking data be exported for reporting to clients or leadership?",
      answer: ["Most paid platforms (Otterly.ai, Profound, Peec AI) offer export/reporting features; open-source tools depend on how you build your own pipeline."],
    },
    {
      question: "Is there an industry-standard citation-share benchmark I should aim for?",
      answer: ["Evidence not sufficiently verified — no independently audited universal benchmark exists; industry percentages vary by study methodology and shouldn't be treated as a fixed target."],
    },
    {
      question: "Can a page be cited by an AI engine without ranking anywhere on Google?",
      answer: ["Yes, this is well documented in the ranking-vs-citation gap research — see our companion article on why Google ranking and AI citation diverge."],
    },
    {
      question: "Does citation frequency correlate with actual referral traffic?",
      answer: ["Not always in a 1:1 way; some AI answers fully satisfy the user's question without a click-through, so a citation doesn't guarantee traffic the way a search click historically did."],
    },
    {
      question: "Otterly.ai vs Profound vs Peec AI — what's the real difference?",
      answer: ["All three track AI citations across major engines; they differ mainly in reporting depth, competitor-comparison features, pricing tiers, and target customer size (agency vs. enterprise), rather than in the basic tracking concept itself."],
    },
    {
      question: "Ahrefs Brand Radar vs Semrush's AI Toolkit — which is better for citation tracking?",
      answer: ["Both are large SEO platforms that added AI-visibility modules; Ahrefs Brand Radar and Semrush's AI toolkit both draw on the vendors' existing large-scale crawl and keyword data, but a detailed feature-by-feature comparison is best done directly against your current toolset since both are actively evolving."],
    },
    {
      question: "ChatGPT search vs Google AI Overviews citations — which is easier to earn?",
      answer: ["Research (CiteLens study, discussed in our companion article) suggests Google AI Mode and Perplexity follow classic SEO ranking signals more closely, while ChatGPT is comparatively more independent of Google ranking — meaning the two aren't won with the same tactics."],
    },
    {
      question: "Open-source (Canonry, Elmo) vs paid platforms — what's the tradeoff?",
      answer: ["Open-source tools are free but require your own hosting, prompt design, and maintenance; paid platforms cost money but come with maintained infrastructure, scheduled runs, and support."],
    },
    {
      question: "Free checkers vs full paid trackers — when should I upgrade?",
      answer: ["Upgrade once you need recurring, multi-query, multi-competitor tracking on a schedule rather than occasional one-off snapshots."],
    },
    {
      question: "My website isn't cited by ChatGPT at all — what should I check first?",
      answer: ["Confirm the site is actually crawlable by ChatGPT's search-related bots (OAI-SearchBot, ChatGPT-User) — see our companion article on checking AI crawler access, since a blocked bot makes citation impossible regardless of content quality."],
    },
    {
      question: "AI Overviews aren't sending me any traffic even though I appear — why?",
      answer: ["Some AI Overview citations fully answer the user's query in the summary itself, reducing the need to click through; this is a documented industry concern, though exact click-through-rate impacts vary by query type and aren't uniformly quantified."],
    },
    {
      question: "My brand feels invisible in AI search across the board — where do I start?",
      answer: ["Start with the manual spot-check method above across all three major engines using real customer queries, then use a free tool to get a broader baseline before assuming the problem is structural."],
    },
    {
      question: "I'm cited inconsistently — sometimes yes, sometimes no, for the same query. Is that normal?",
      answer: ["Yes — AI answers are non-deterministic by nature, so inconsistency across repeated identical prompts is expected and is why tools sample multiple runs rather than relying on one."],
    },
    {
      question: "Search Console shows no AI data for my property — is something wrong?",
      answer: ["Not necessarily — the AI-surface reporting was still in limited rollout as of mid-2026 and may simply not have reached your property yet (", { text: "9to5Google", href: "https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/", external: true }, ")."],
    },
    {
      question: "How much does AI citation tracking software typically cost?",
      answer: ["Pricing varies widely by vendor and tier, from free checker tools up to enterprise contracts; check each vendor's current pricing page directly since this is a fast-moving market segment."],
    },
    {
      question: "Is it worth hiring an agency specifically for AI citation/AEO work?",
      answer: ["It can be, particularly if you lack the internal time to run recurring multi-engine checks and translate findings into content and technical fixes — this is exactly the kind of ongoing measurement-plus-execution work an SEO/GEO engagement is built around."],
    },
    {
      question: "Should a small business start with a free tool or go straight to a paid platform?",
      answer: ["Start free to confirm there's a real gap worth solving, then move to a paid platform only once you need recurring, competitor-benchmarked tracking."],
    },
    {
      question: "Are open-source tools like Canonry and Elmo a safe long-term bet for a business?",
      answer: ["They're viable if you have technical capacity to maintain them, but as community-run open-source projects they don't come with the SLAs or support paid vendors typically offer."],
    },
    {
      question: "What's the single best next step after reading this article?",
      answer: ["Run tools.scult.in's own AI Visibility Checker against your domain for an immediate, free first read on your current citation and mention status."],
    },
  ],
  sources: [
    "https://otterly.ai/",
    "https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/",
    "https://www.seroundtable.com/google-ai-performance-report-blocking-controls-41443.html",
    "https://www.searchenginejournal.com/research-suggests-ai-engines-assign-ranking-roles-to-sources/578620/",
    "https://www.forbes.com/councils/forbesagencycouncil/2026/06/29/how-agencies-can-tap-into-better-ai-citation-results/",
    "https://www.entrepreneur.com/building-a-business/your-brand-will-be-invisible-in-ai-search-if-youre-not-showing-up-on-these-8-channels",
    "https://finance.yahoo.com/technology/ai/articles/somantra-enterprise-grade-answer-engine-130000005.html",
    "https://github.com/AINYC/canonry",
    "https://github.com/elmohq/elmo",
    "https://www.spiderseek.com",
    "https://www.frase.io/blog/the-10-best-ai-visibility-tools-in-2026",
    "https://www.semrush.com/free-tools/ai-search-visibility-checker/",
  ],
  relatedTools: ["ai-visibility-checker", "schema-markup-generator"],
  relatedPrompts: [],
  serviceTarget: "seo-companies-for-small-business",
  updatedAt: "2026-08-21",
  readingMinutes: 17,
}
