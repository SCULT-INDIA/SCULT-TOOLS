import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = "rank-on-google-not-cited-by-ai"
const SERVICE_SEO_COMPANIES_FOR_SMALL_BUSINESS = resolveServiceLink("seo-companies-for-small-business", SLUG)

/**
 * Generated from content-engine/05-drafts/article_002.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "Why You Can Rank #1 on Google and Still Not Be Cited by AI",
  h1: "Why You Can Rank #1 on Google and Still Not Be Cited by AI",
  targetKeyword: "rank on google not cited by ai",
  description: "Ranking on Google and being cited by ChatGPT or AI Overviews are two different jobs. Here's the real data on the gap, why it exists, and what to do about it.",
  dek: "Yes, a page can rank #1 on Google and still never be cited by ChatGPT, Perplexity, or even Google's own AI Overviews — because ranking and citation are measuring two different things. Large-scale data shows only a moderate correlation (Spearman 0.347) between rank position and AI Overview citation likelihood, and for ChatGPT specifically, the overlap with Google's top 10 has been measured as low as roughly 12%. Ranking wins you a spot in a list of links; citation means an engine judged your page the best evidence for one specific prompt.",
  sections: [
    {
      heading: "The core data: how weak is the correlation, really?",
      body: [
        ["The most rigorous public data on this comes from an Ahrefs study analyzing 1 million keywords and 1.9 million citation links inside Google AI Overviews. The headline finding: there is a moderate positive Spearman correlation of just 0.347 between a page's Google ranking position and its likelihood of being cited in the AI Overview for that query (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, "). A correlation of 0.347 is meaningfully above zero — ranking is not irrelevant — but it's far short of the near-1.0 correlation you'd expect if \"rank well and you'll get cited\" were a reliable rule."],
        ["The study puts real numbers behind that ambiguity:"],
        ["– Even a page ranking ", { text: "#1", bold: true }, " on Google appears among the ", { text: "top three AI Overview citations only about 50% of the time", bold: true }, "."],
        ["– ", { text: "67.82%", bold: true }, " of all AI-Overview-cited pages did ", { text: "not", bold: true }, " rank in Google's top 10 for the query or any of its \"fan-out\" variations (the related sub-queries Google's system generates to build the overview). That figure drops to 45.86% when you narrow it to just the top three visible citations, meaning the gap shrinks somewhat for the most prominent citation slots but never closes."],
        ["– When a page ", { text: "does", bold: true }, " rank well ", { text: "and", bold: true }, " get cited, higher SERP position correlates more strongly (0.445) with getting a more prominent placement within the citation list. So rank isn't irrelevant to citation prominence — it's just a weak predictor of citation inclusion in the first place (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")."],
        ["That's already surprising for Google's own AI Overviews, a feature built directly on top of Google's own search index. It gets more dramatic once you look at ChatGPT specifically."],
      ],
    },
    {
      heading: "Why ChatGPT behaves so differently from Google AI Mode and Perplexity",
      body: [
        ["A comparative report on this gap states that the overlap between top Google rankings and the sources ChatGPT actually cites has fallen to roughly ", { text: "12%", bold: true }, " — meaning the large majority of what ChatGPT cites for a given query doesn't rank in Google's top 10 for that query at all (", { text: "HackerNoon", href: "https://hackernoon.com/you-can-rank-1-on-google-and-still-not-exist-to-chatgpt", external: true }, "). The same analysis reports that ChatGPT sources roughly ", { text: "70%", bold: true }, " of what it recommends from pages that rank in neither Google's nor Bing's top 10 — a striking indicator that classic SEO ranking signals are a weak predictor specifically for ChatGPT."],
        ["But this isn't uniform across AI engines. A CiteLens benchmark of 320 templated buyer queries across three consumer sectors — run against four AI engines plus Google and Bing organic results in the Turkish market in June 2026 — found that Google's own AI Mode (93%) and Perplexity (89%) drew the large majority of their citations from Google's top 10, closely mirroring classic search behavior, while ChatGPT drew only about 30% of its citations from Google's top 10 and showed a near-zero correlation with both ranking position and brand size (", { text: "CiteLens study via EIN Presswire", href: "https://www.einpresswire.com/article/925230382/citelens-study-seo-decides-ai-citations-on-google-and-perplexity-not-chatgpt", external: true }, "). Because this specific benchmark was run in one national market, treat the exact percentages as directional rather than a universal constant — the underlying pattern (AI Mode/Perplexity tracking rank closely, ChatGPT largely not) is corroborated by other sources below, even if the precise numbers would likely shift in a different market."],
        ["Put together, this paints a coherent picture: AI Mode and Perplexity are, in a real sense, extensions of a search-index-grounded worldview, so pages that already do well in classic SEO tend to keep doing reasonably well there. ChatGPT, by contrast, appears to be drawing from a broader training-and-retrieval mix that isn't anchored the same way to Google's or Bing's live rankings, which is why the same page can be invisible to ChatGPT while performing normally in AI Mode."],
      ],
    },
    {
      heading: "What actually predicts citation when ranking doesn't",
      body: [
        ["If rank isn't the deciding factor, what is? Two threads of evidence point in a consistent direction:"],
        ["1. ", { text: "The job a page is doing is different from the job a ranking spot is doing.", bold: true }, " Framing from WP Consults and AAPTA describes ranking and citation as fundamentally different problems: a rank wins a spot in a list of ten blue links competing for a click; a citation means an answer engine specifically judged this page to be the best available evidence for one narrow prompt, often assembled from many fragments across many pages rather than \"the best page overall\" (", { text: "WP Consults", href: "https://www.wpconsults.com/page-not-cited-in-ai-overviews/", external: true }, "; ", { text: "AAPTA", href: "https://www.aapta.in/blog/why-website-ranks-google-invisible-chatgpt-2026", external: true }, ")."],
        ["2. ", { text: "Entity and brand recognition across the web, not just on-page SEO, seems to matter more for ChatGPT and Claude specifically.", bold: true }, " Industry analysis argues that for these two platforms, a brand's consistent, recognizable presence across many parts of the web (mentions, structured entity signals, third-party coverage) outweighs Google rank position, whereas Google's own AI Mode and Perplexity continue to weight classic ranking signals more heavily (", { text: "CiteLens study via EIN Presswire", href: "https://www.einpresswire.com/article/925230382/citelens-study-seo-decides-ai-citations-on-google-and-perplexity-not-chatgpt", external: true }, ")."],
        ["In other words, if your goal is Google AI Mode or Perplexity citations, doubling down on classic technical and on-page SEO is still a reasonable strategy, because those engines behave more like search engines. If your goal is ChatGPT citations specifically, ranking optimization alone is a much weaker lever, and building recognizable entity presence (being talked about, structured, and consistently described the same way across many third-party sources) matters more."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Real, sourced example pattern:", bold: true }, " The Ahrefs study's own framing gives a concrete illustrative case: a page that ranks #1 for a competitive keyword still only has roughly a coin-flip's chance of making the top-three citation slots in that query's AI Overview — meaning half the time, a #1-ranking page is either cited lower in the list or not cited at all in the visible top three (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")."],
        [{ text: "Illustrative example (hypothetical, clearly labeled):", bold: true }, " Picture a well-optimized SaaS comparison page that ranks #2 on Google for \"best project management software.\" In AI Mode, it shows up as a cited source, consistent with the CiteLens finding that AI Mode tracks ranking closely. In ChatGPT, the same query surfaces a Reddit thread, a G2 comparison page, and a completely different blog post as citations — none of which rank in Google's top 10 — consistent with the HackerNoon-reported 70% out-of-top-10 sourcing pattern for ChatGPT. The SaaS page's owner, watching only their Google Search Console rankings, would have no way to see this divergence without checking ChatGPT directly."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– Spearman correlation between Google rank and AI Overview citation likelihood: ", { text: "0.347", bold: true }, " (1M keywords, 1.9M citation links) (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")."],
        ["– Correlation between rank and citation *prominence* (when cited): ", { text: "0.445", bold: true }, " (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")."],
        ["– Share of AI-Overview-cited pages not ranking in Google's top 10: ", { text: "67.82%", bold: true }, " overall, ", { text: "45.86%", bold: true }, " for the top-3 visible citations (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")."],
        ["– Chance a #1-ranked page appears in the AI Overview's top-3 citations: ", { text: "~50%", bold: true }, " (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")."],
        ["– Overlap between Google top-10 rankings and ChatGPT's cited sources: reported as low as ", { text: "~12%", bold: true }, " (", { text: "HackerNoon", href: "https://hackernoon.com/you-can-rank-1-on-google-and-still-not-exist-to-chatgpt", external: true }, ")."],
        ["– Share of ChatGPT's recommended sources ranking in neither Google's nor Bing's top 10: ", { text: "~70%", bold: true }, " (", { text: "HackerNoon", href: "https://hackernoon.com/you-can-rank-1-on-google-and-still-not-exist-to-chatgpt", external: true }, ")."],
        ["– Share of citations drawn from Google's top 10 in a 320-query, Turkish-market CiteLens benchmark: Google AI Mode ", { text: "93%", bold: true }, ", Perplexity ", { text: "89%", bold: true }, ", ChatGPT ", { text: "~30%", bold: true }, " with near-zero correlation to rank or brand size (", { text: "CiteLens via EIN Presswire", href: "https://www.einpresswire.com/article/925230382/citelens-study-seo-decides-ai-citations-on-google-and-perplexity-not-chatgpt", external: true }, ")."],
        ["– Evidence not sufficiently verified: exact figures for Claude's or Gemini's rank-to-citation overlap were not found in independently reported large-scale studies at the time of writing; treat any specific percentage claimed for those two platforms as unverified unless traced to a named, dated study."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        ["Engine: Google AI Overviews · Follows Google ranking signals?: Partially — moderate correlation, not a hard rule · Approx. reported overlap w/ Google top 10: 32.18% do rank top 10 (i.e., 67.82% don't) (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")"],
        ["Engine: Google AI Mode · Follows Google ranking signals?: Closely — behaves like an extension of Search · Approx. reported overlap w/ Google top 10: 93% of citations from Google top 10 in one Turkish-market CiteLens benchmark (", { text: "EIN Presswire", href: "https://www.einpresswire.com/article/925230382/citelens-study-seo-decides-ai-citations-on-google-and-perplexity-not-chatgpt", external: true }, ")"],
        ["Engine: Perplexity · Follows Google ranking signals?: Closely — similar to AI Mode per CiteLens · Approx. reported overlap w/ Google top 10: 89% of citations from Google top 10 in the same benchmark (", { text: "EIN Presswire", href: "https://www.einpresswire.com/article/925230382/citelens-study-seo-decides-ai-citations-on-google-and-perplexity-not-chatgpt", external: true }, ")"],
        ["Engine: ChatGPT · Follows Google ranking signals?: Weakly — largely independent of rank/brand size · Approx. reported overlap w/ Google top 10: ~12% overlap reported (", { text: "HackerNoon", href: "https://hackernoon.com/you-can-rank-1-on-google-and-still-not-exist-to-chatgpt", external: true }, ")"],
        ["The practical implication of this table: a single \"AI SEO\" strategy aimed at \"getting cited by AI\" in the abstract will systematically under-serve ChatGPT visibility if it's really just classic SEO with extra structured data, because ChatGPT's citation behavior appears to be the outlier among the four engines, not the norm."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["– ", { text: "SEO teams reporting to clients", bold: true }, " are increasingly having to explain a rank/citation mismatch that didn't exist as a reporting category two years ago — a page can hit its ranking KPI and still show zero AI Overview or ChatGPT citation, which changes what \"success\" means in a monthly report."],
        ["– ", { text: "Content teams optimizing for AI Mode and Perplexity", bold: true }, " can reasonably continue leaning on classic technical SEO and E-E-A-T signals, since both engines track ranking-style signals closely per the CiteLens data."],
        ["– ", { text: "Brands trying to win ChatGPT specifically", bold: true }, " are shifting effort toward entity consistency — making sure the brand is described the same way, with the same facts, across many third-party sources (directories, review sites, forums, Wikipedia-style references) — rather than purely chasing rank position."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– ", { text: "Assuming a #1 Google ranking guarantees AI citation.", bold: true }, " It doesn't — even top-ranked pages are cited in the visible top three only about half the time (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")."],
        ["– ", { text: "Treating all AI engines as one undifferentiated \"AI search\" bucket.", bold: true }, " ChatGPT's behavior diverges sharply from AI Mode and Perplexity; a one-size strategy will misfire on at least one of them."],
        ["– ", { text: "Optimizing only for ranking when the real goal is ChatGPT citation.", bold: true }, " Given the ~12% overlap, ranking work alone is a weak lever for that specific engine."],
        ["– ", { text: "Ignoring citation prominence once you are cited.", bold: true }, " Since prominence still correlates with rank (0.445), don't stop optimizing rank just because inclusion isn't guaranteed by it."],
        ["– ", { text: "Reporting \"cited\" vs \"not cited\" without specifying which engine.", bold: true }, " Given how different the engines behave, an undifferentiated citation report obscures the real diagnosis."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– Track citation status separately per engine (Google AI Overviews, AI Mode, Perplexity, ChatGPT) rather than as one combined metric."],
        ["– Keep investing in classic technical SEO and content quality for AI Mode/Perplexity visibility, since both track ranking signals closely."],
        ["– For ChatGPT specifically, invest in being consistently and accurately described across third-party sources — directories, review platforms, forums, and structured entity data — rather than relying on ranking alone."],
        ["– Use the Ahrefs correlation data as a sanity check on client/stakeholder expectations: explain up front that even #1 rankings only translate to top-3 AI Overview citation about half the time."],
        ["– Re-test the same query periodically, since both rankings and AI citations shift over time and this is an actively evolving relationship, not a fixed rule."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– Ranking and AI citation are only moderately correlated (0.347 for AI Overviews); a #1 Google rank is not a citation guarantee."],
        ["– ChatGPT shows the widest divergence from classic ranking — roughly 12% overlap with Google's top 10 and about 70% of its cited sources ranking outside the top 10 on both Google and Bing."],
        ["– Google AI Mode and Perplexity behave much more like classic search, following SEO/authority signals roughly 90% of the time in one comparative study."],
        ["– When a page is cited, higher rank still correlates with more prominent placement (0.445) — rank affects prominence more reliably than inclusion."],
        ["– Treat \"AI SEO\" as engine-specific: classic SEO work for AI Mode/Perplexity, entity-consistency work for ChatGPT."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["Check whether your own priority pages show this exact gap using the ", { text: "AI Visibility Checker", href: "/geo/ai-visibility-checker" }, ", which lets you see mention and citation status across engines rather than relying on Google Search Console rank data alone."],
        ["If this gap is showing up across a meaningful chunk of your priority queries, it's often worth a structured conversation with a team that separates GEO/AEO diagnosis from classic SEO reporting — scult.in's ", { text: "SEO & GEO services", href: SERVICE_SEO_COMPANIES_FOR_SMALL_BUSINESS.href, external: true }, " are built around exactly this kind of per-engine citation audit and follow-up fix work."],
        ["For a related, free starting point, try the ", { text: "Schema Markup Generator", href: "/seo/schema-markup-generator" }, "."],
      ],
    },
  ],
  faq: [
    {
      question: "Can a page really rank #1 on Google and not be cited by AI at all?",
      answer: ["Yes — documented and expected given the data; even #1-ranked pages appear in the AI Overview's top-3 citations only about 50% of the time (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")."],
    },
    {
      question: "Is this the same thing as \"GEO\" (generative engine optimization)?",
      answer: ["It's closely related — GEO is the emerging discipline focused specifically on getting cited by AI answer engines, as distinct from classic SEO's focus on ranking."],
    },
    {
      question: "Does this gap apply to every AI engine equally?",
      answer: ["No — it varies significantly; ChatGPT shows the widest gap from Google ranking, while AI Mode and Perplexity track ranking much more closely (", { text: "EIN Presswire", href: "https://www.einpresswire.com/article/925230382/citelens-study-seo-decides-ai-citations-on-google-and-perplexity-not-chatgpt", external: true }, ")."],
    },
    {
      question: "Why would Google's own AI Overviews not always cite the #1 Google result?",
      answer: ["Because AI Overviews are built from many fragments across many pages (including \"fan-out\" sub-queries), not just the top organic result, and the correlation between rank and citation is only moderate (0.347) (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")."],
    },
    {
      question: "What's a \"fan-out\" query in this context?",
      answer: ["Related sub-queries that Google's AI Overview system generates internally to gather a broader set of evidence beyond the literal query typed — cited pages are compared against these fan-out variations too, not just the original query's top 10."],
    },
    {
      question: "Is ranking on Google now pointless if AI citation matters more?",
      answer: ["No — ranking still correlates positively with citation likelihood and strongly with citation prominence once cited (0.445); it's a weaker predictor than assumed, not an irrelevant one."],
    },
    {
      question: "Does this mean I should stop doing SEO and only do \"AI SEO\"?",
      answer: ["No — for AI Mode and Perplexity, classic SEO signals still matter a great deal (~90% correlation with SEO signals per CiteLens); only for ChatGPT is the picture very different."],
    },
    {
      question: "What is the CiteLens study, exactly?",
      answer: ["A benchmark of 320 templated buyer queries across three consumer sectors, run against ChatGPT, Perplexity, Google AI Mode, and a fourth AI engine plus Google/Bing organic results in the Turkish market in June 2026, examining how closely each engine's citations tracked classic SEO ranking and authority signals (", { text: "EIN Presswire", href: "https://www.einpresswire.com/article/925230382/citelens-study-seo-decides-ai-citations-on-google-and-perplexity-not-chatgpt", external: true }, ")."],
    },
    {
      question: "Why is ChatGPT so different from Google AI Mode if both are \"AI\"?",
      answer: ["Google AI Mode is built directly on Google's own live search index and ranking infrastructure, while ChatGPT draws on a different mix of training data and retrieval sources not anchored the same way to Google's or Bing's rankings — which the reported ~12% overlap and ~70% out-of-top-10 sourcing both reflect (", { text: "HackerNoon", href: "https://hackernoon.com/you-can-rank-1-on-google-and-still-not-exist-to-chatgpt", external: true }, ")."],
    },
    {
      question: "Is this gap likely to close over time as AI search matures?",
      answer: ["Unclear — evidence not sufficiently verified either way; this is an actively evolving relationship and any prediction about convergence would be speculation rather than sourced fact."],
    },
    {
      question: "What exactly does \"citation\" mean versus \"ranking\" in this context?",
      answer: ["Ranking is a position in a list of search results; citation is being named/linked as a specific evidence source inside a generated AI answer — two different mechanisms with different selection criteria."],
    },
    {
      question: "Does brand size matter more than ranking for AI citation?",
      answer: ["For ChatGPT, the CiteLens study found it largely ignores both ranking position and brand size; for AI Mode and Perplexity, established authority signals (which correlate with brand size) matter more (", { text: "EIN Presswire", href: "https://www.einpresswire.com/article/925230382/citelens-study-seo-decides-ai-citations-on-google-and-perplexity-not-chatgpt", external: true }, ")."],
    },
    {
      question: "Is E-E-A-T still relevant if ranking doesn't guarantee citation?",
      answer: ["Likely yes for AI Mode and Perplexity given their SEO-signal-following behavior; its direct effect on ChatGPT specifically is less established in the available data."],
    },
    {
      question: "Does page freshness or recency affect this gap?",
      answer: ["Evidence not sufficiently verified in the sources reviewed — none of the cited studies isolate freshness as a variable in the rank-vs-citation gap specifically."],
    },
    {
      question: "Are AI Overview citations and AI Mode citations the same thing?",
      answer: ["No — they're related but distinct surfaces; AI Overviews appear within standard Search results pages, while AI Mode is a separate, more conversational search experience, and the CiteLens data on ranking-signal-following applies to AI Mode specifically, not the AI Overview citation study."],
    },
    {
      question: "Can I check whether my own pages are affected by this gap?",
      answer: ["Yes — run your target queries manually through Google (for AI Overviews), Google's AI Mode, Perplexity, and ChatGPT, and compare which engines cite you versus your Google rank for the same query; a dedicated AI visibility tool can automate this across more queries."],
    },
    {
      question: "Does this gap mean SEO is becoming obsolete?",
      answer: ["No — it means SEO alone is an incomplete strategy for engines like ChatGPT specifically, not that ranking has stopped mattering everywhere."],
    },
    {
      question: "Why does citation prominence still correlate with rank even though inclusion doesn't?",
      answer: ["The Ahrefs data suggests that once an AI Overview algorithm has already decided to cite a page, its existing Google rank becomes a secondary signal for how prominently to place that citation — inclusion and placement appear to be governed somewhat differently (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, ")."],
    },
    {
      question: "Is the 12% ChatGPT overlap figure from an independent, peer-reviewed study?",
      answer: ["It's reported by HackerNoon, a tech-community publication; it is a real, cited claim, but it should be understood as an industry analysis rather than an academic peer-reviewed study."],
    },
    {
      question: "Does a page needing to rank well for AI Mode also mean it needs backlinks?",
      answer: ["Since AI Mode follows classic SEO signals closely, and backlinks remain one input to classic ranking, backlinks likely still play a role there — see our companion article on topical authority vs backlinks for a deeper look at how these signals interact."],
    },
    {
      question: "How do I check whether my top-ranking page is being cited in AI Overviews?",
      answer: ["Search the exact query that generates the AI Overview and manually inspect the citation cards, or use an AI visibility tracking tool across a larger query set."],
    },
    {
      question: "How do I check whether ChatGPT cites my page even though I don't rank on Google?",
      answer: ["Ask ChatGPT (with web search enabled) the target query directly and look for your domain in the footnotes/sources, since ChatGPT sourcing doesn't require Google top-10 ranking per the 70% out-of-top-10 finding."],
    },
    {
      question: "How do I diagnose which engine is the actual problem for my brand?",
      answer: ["Run the same query set separately through AI Overviews, AI Mode, Perplexity, and ChatGPT, and compare citation presence per engine rather than treating \"AI visibility\" as one number."],
    },
    {
      question: "How do I improve my odds specifically with Google AI Mode or Perplexity?",
      answer: ["Continue standard technical SEO, on-page optimization, and authority-building, since both engines track classic SEO signals closely per the CiteLens study."],
    },
    {
      question: "How do I improve my odds specifically with ChatGPT?",
      answer: ["Focus on building consistent, accurate entity presence across many third-party sources rather than relying primarily on ranking improvements, since ranking and brand size were found to be weak predictors for ChatGPT specifically."],
    },
    {
      question: "How often should I re-check this gap for my important pages?",
      answer: ["Periodically (e.g., monthly or quarterly) since both rankings and AI citation patterns shift, and this is an evolving relationship rather than a static one."],
    },
    {
      question: "How do I explain this gap to a client or manager who only tracks rank position?",
      answer: ["Show them the Ahrefs correlation data directly — a 0.347 correlation and a 50% top-3 citation rate even at #1 ranking makes the point concretely without requiring a new dashboard."],
    },
    {
      question: "Can I use the same content to win both Google rank and AI citation?",
      answer: ["Often yes, but not automatically — strong content that ranks well is a good foundation, but for ChatGPT specifically you may also need broader third-party presence beyond your own page."],
    },
    {
      question: "What's the first practical step if I discover this gap on my own site?",
      answer: ["Identify which specific engine(s) show the gap for your priority queries, then apply the engine-appropriate fix (SEO/authority work for AI Mode/Perplexity, entity-consistency work for ChatGPT) rather than one blanket tactic."],
    },
    {
      question: "Is there a tool that shows this rank-vs-citation gap automatically?",
      answer: ["Some AI visibility trackers report both your Google rank and your AI citation status for the same query set side by side; check current tool feature lists, since this is a fast-evolving product category."],
    },
    {
      question: "Why does the AI Overview citation correlation (0.347) sit in the middle rather than near 0 or near 1?",
      answer: ["It likely reflects that ranking is one real input among several the AI Overview system weighs (alongside content quality, fan-out query matches, and other factors), rather than either the sole determinant or an irrelevant one."],
    },
    {
      question: "Does the 67.82% \"not in top 10\" figure include pages that don't rank at all anywhere on Google?",
      answer: ["The Ahrefs study describes this as pages not ranking in the top 10 for the query or its fan-out variations — it doesn't necessarily mean the page is entirely absent from Google's index, just outside the top 10 for those specific query forms."],
    },
    {
      question: "Is there a meaningful difference between being cited in position 1 of an AI Overview versus position 5?",
      answer: ["Likely yes for visibility and click-through, though the Ahrefs study's specific finding is about rank correlating with prominence (0.445) rather than quantifying click-through differences by citation position directly."],
    },
    {
      question: "Could paid ads or Google Shopping listings affect this citation behavior?",
      answer: ["Evidence not sufficiently verified in the sources reviewed for this article — none of the cited studies isolate paid placement as a variable in the organic rank-vs-citation relationship."],
    },
    {
      question: "Is this rank/citation gap specific to English-language search, or does it hold globally?",
      answer: ["The specific percentages vary by study and market — the CiteLens benchmark cited above, for example, was run on 320 buyer queries in the Turkish market — so the exact numbers shouldn't be treated as universal constants. The Ahrefs AI Overview study (1M keywords) and the broader ChatGPT-overlap findings are less geographically narrow, but no source reviewed here claims to cover every language or market, so treat all figures as directional evidence of a real pattern rather than a single fixed global number."],
    },
    {
      question: "Google AI Overviews vs ChatGPT citations — which is more predictable from rank?",
      answer: ["AI Overviews are more predictable (0.347 correlation, though still far from certain) than ChatGPT, where overlap with Google top 10 was reported as low as ~12% (", { text: "Ahrefs", href: "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews", external: true }, "; ", { text: "HackerNoon", href: "https://hackernoon.com/you-can-rank-1-on-google-and-still-not-exist-to-chatgpt", external: true }, ")."],
    },
    {
      question: "AI Mode vs Perplexity — do they behave the same way regarding ranking?",
      answer: ["The CiteLens study found both followed classic SEO signals at a similar ~90% rate, suggesting they behave more alike to each other than either does to ChatGPT (", { text: "EIN Presswire", href: "https://www.einpresswire.com/article/925230382/citelens-study-seo-decides-ai-citations-on-google-and-perplexity-not-chatgpt", external: true }, ")."],
    },
    {
      question: "SEO ranking vs GEO citation — are these now two separate job functions?",
      answer: ["Increasingly treated that way in industry commentary — the sources describe them explicitly as \"two different jobs\" requiring different diagnostic approaches (", { text: "WP Consults", href: "https://www.wpconsults.com/page-not-cited-in-ai-overviews/", external: true }, ")."],
    },
    {
      question: "Does a higher-ranking competitor automatically get more AI citations than me?",
      answer: ["Not necessarily and not reliably — given the weak-to-moderate correlations found, a lower-ranking page can still out-cite a higher-ranking one, especially in ChatGPT."],
    },
    {
      question: "Is Claude's citation behavior more like ChatGPT's or more like AI Mode's?",
      answer: ["Evidence not sufficiently verified — none of the reviewed studies isolate Claude's rank-to-citation overlap specifically; avoid assuming it mirrors either pattern without a dedicated study."],
    },
    {
      question: "My page ranks #1 but gets zero AI Overview citation — what's wrong?",
      answer: ["Possibly nothing is \"wrong\" in an absolute sense — even #1-ranked pages are excluded from the visible top-3 citations about half the time; check whether related fan-out queries are pulling from other pages instead."],
    },
    {
      question: "My page isn't in Google's top 10 but somehow appears in ChatGPT's answer — is that a fluke?",
      answer: ["No — this is the expected, documented pattern for ChatGPT, where roughly 70% of cited/recommended sources fall outside Google's and Bing's top 10 (", { text: "HackerNoon", href: "https://hackernoon.com/you-can-rank-1-on-google-and-still-not-exist-to-chatgpt", external: true }, ")."],
    },
    {
      question: "I improved my Google ranking but AI citations didn't change — why?",
      answer: ["Given the moderate (not strong) correlation, ranking improvements don't reliably translate into new citations, especially for ChatGPT; the fix may need to target entity/authority signals separately rather than more ranking work."],
    },
    {
      question: "Competitors with worse rankings are getting cited more than me by AI — is that normal?",
      answer: ["Yes, this is consistent with the documented weak-to-moderate correlation between rank and citation across engines, particularly ChatGPT."],
    },
    {
      question: "I can't tell which engine is causing my \"AI invisibility\" — how do I isolate it?",
      answer: ["Test each engine (AI Overviews, AI Mode, Perplexity, ChatGPT) separately for the same query rather than treating \"AI search\" as one undifferentiated channel."],
    },
    {
      question: "Is it worth paying for an AI visibility/GEO audit given this gap?",
      answer: ["It can be, particularly because the gap is genuinely counterintuitive to most SEO teams' existing mental model — a structured audit surfaces which specific engines and queries are affected rather than guessing."],
    },
    {
      question: "Should I prioritize GEO agency work over continuing classic SEO spend?",
      answer: ["Not either/or — given that AI Mode and Perplexity track SEO signals closely, classic SEO spend still pays off there; GEO-specific work becomes the additional layer needed mainly for ChatGPT-type gaps."],
    },
    {
      question: "How do I decide whether this problem is worth fixing for my business?",
      answer: ["Weigh it against how much of your target audience actually uses ChatGPT (versus Google) for the relevant queries — the size of the opportunity depends on where your specific customers search."],
    },
    {
      question: "What's a reasonable first deliverable to ask for from an SEO/GEO consultant on this issue?",
      answer: ["A per-engine citation audit against your priority query list, showing current rank, current citation status per engine, and a diagnosis of which gap (if any) applies to you."],
    },
    {
      question: "What's the single best next step after reading this?",
      answer: ["Pick your 10 highest-value queries, check your Google rank, and manually test all four engines (AI Overviews, AI Mode, Perplexity, ChatGPT) for citation status today — the pattern you find will tell you which lever to pull next."],
    },
  ],
  sources: [
    "https://ahrefs.com/blog/does-ranking-higher-on-google-mean-youll-get-cited-in-ai-overviews",
    "https://hackernoon.com/you-can-rank-1-on-google-and-still-not-exist-to-chatgpt",
    "https://www.einpresswire.com/article/925230382/citelens-study-seo-decides-ai-citations-on-google-and-perplexity-not-chatgpt",
    "https://www.wpconsults.com/page-not-cited-in-ai-overviews/",
    "https://www.aapta.in/blog/why-website-ranks-google-invisible-chatgpt-2026",
  ],
  relatedTools: ["ai-visibility-checker", "schema-markup-generator"],
  relatedPrompts: [],
  serviceTarget: "seo-companies-for-small-business",
  updatedAt: "2026-08-21",
  readingMinutes: 17,
}
