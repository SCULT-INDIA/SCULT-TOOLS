import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ai-overviews-impact-on-ctr'
const SERVICE_SEO_COMPANIES_FOR_SMALL_BUSINESS = resolveServiceLink(
  'seo-companies-for-small-business',
  SLUG,
)
const SERVICE_GOOGLE_ADS_MANAGEMENT = resolveServiceLink('google-ads-management', SLUG)

/**
 * Generated from content-engine/05-drafts/article_028.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title:
    "AI Overviews and CTR: How Much Traffic You've Actually Lost (And the 2026 Recovery Data)",
  h1: "AI Overviews and CTR: how much traffic you've actually lost",
  targetKeyword: 'ai overviews impact on ctr',
  description:
    "Organic CTR fell ~61% on AI-Overview queries, then recovered 85% by February 2026 — but a 37% structural gap remains. Here's the real data and what to do.",
  dek: "Organic click-through rate on queries triggering Google's AI Overviews fell roughly 61% in 2025 (from 1.76% to 0.61%), and paid CTR fell even further, around 68%. By February 2026, Seer Interactive's tracking of 53 brands across 5.47 million queries showed an 85% CTR recovery from a December 2025 low — but a persistent structural gap of roughly 37% versus non-AI-Overview queries remains the new baseline to plan around, not a temporary dip that fully reverses.",
  sections: [
    {
      heading: 'The 2025 CTR collapse, by the numbers',
      body: [
        [
          "The initial impact of Google's AI Overviews on organic click-through rate was severe and well-documented. Seer Interactive's research (3,119 informational queries across 42 organizations, June 2024–September 2025) found organic CTR on queries that triggered an AI Overview plummeted by roughly 61%, from 1.76% down to 0.61% (",
          {
            text: 'Search Engine Land',
            href: 'https://searchengineland.com/google-ai-overviews-drive-drop-organic-paid-ctr-464212',
            external: true,
          },
          '). Paid search CTR on the same query set fell even more sharply — about 68%, from 19.7% down to 6.34% — meaning advertisers running ads against AI-Overview-triggering keywords absorbed a larger relative hit than organic listings did during the same period (',
          {
            text: 'Search Engine Land',
            href: 'https://searchengineland.com/google-ai-overviews-drive-drop-organic-paid-ctr-464212',
            external: true,
          },
          '). A separate eMarketer analysis of position-based CTR data reached a directionally consistent conclusion using a different methodology, finding AI Overview presence correlated with a 34.5% lower average CTR (',
          {
            text: 'eMarketer',
            href: 'https://www.emarketer.com/content/google-ai-overviews-decrease-ctrs-by-34-5-per-new-study',
            external: true,
          },
          ').',
        ],
        [
          'This CTR collapse sits inside a broader zero-click trend that predates AI Overviews but has been accelerated by them. Multiple 2026 sources report that roughly 68-69% of US Google queries now end without any click at all (',
          {
            text: 'Cognizo',
            href: 'https://www.cognizo.ai/blog/google-ai-overviews-statistics',
            external: true,
          },
          "), with Similarweb's tracking specifically showing the zero-click rate jumps to roughly 83% when an AI Overview appears, versus roughly 60% when one doesn't — the clearest available isolation of the AI-Overview-specific effect on top of the broader zero-click trend. The practical read: for a meaningful share of searches, Google's own AI-generated summary is now satisfying the user's information need well enough that they never reach a website at all — yours or anyone else's.",
        ],
      ],
    },
    {
      heading: "The 2026 recovery, and the structural gap that didn't close",
      body: [
        [
          'The most methodologically substantial data point in this space comes from Seer Interactive, which analyzed 53 brands across 5.47 million queries and 2.43 billion impressions from January 2025 through February 2026 — a large enough sample to distinguish a real trend from noise. Their finding: CTR on AI-Overview-triggering queries recovered by 85% between a December 2025 low point and February 2026 (',
          {
            text: 'Search Engine Land',
            href: 'https://searchengineland.com/google-ai-overviews-ctr-recovery-study-475566',
            external: true,
          },
          ').',
        ],
        [
          "That recovery figure sounds like good news, and it is real — but it's easy to misread. An 85% recovery from a depressed baseline still leaves a persistent structural gap of roughly 37% in CTR on AI-Overview queries compared to queries that don't trigger an AI Overview at all, per the same Seer Interactive analysis. In plain terms: the worst of the initial shock has eased, but AI-Overview queries are still meaningfully worse for click-through than they were before AI Overviews existed, and that 37% gap is the number worth planning around, not the encouraging 85% recovery headline on its own.",
        ],
        [
          "Whether this partial recovery continues improving, plateaus at the current 37% gap, or reverses again isn't something the available data can answer with confidence — this is a live, still-evolving trend as of the most recent data reviewed, not a settled outcome.",
        ],
      ],
    },
    {
      heading: 'Which publishers actually lost the most traffic',
      body: [
        [
          "Beyond the aggregate CTR statistics, specific named publishers have reported substantial, real traffic declines tied to AI Overviews and the broader shift toward AI-mediated search, though the exact percentage for any single outlet varies somewhat depending on the measurement window and data provider behind each report. Widely corroborated figures (via Press Gazette's Similarweb-sourced reporting and other trade coverage) put Business Insider's organic search traffic decline at roughly 55% (April 2022–April 2025, a decline the company cited alongside a 21% staff cut in May 2025), HuffPost at roughly 50% over the same window, Daily Mail's US operation in the 32-44% range, and The Sun (UK) in the 50-59% range year-over-year; CNN and the New York Post have also reported substantial declines, though reported figures for those two specifically range more widely across sources depending on the period measured, so treat any single-digit-precision percentage for them as directional rather than exact (",
          {
            text: 'Practical Ecommerce',
            href: 'https://www.practicalecommerce.com/why-search-rankings-are-driving-less-traffic',
            external: true,
          },
          "). These aren't small or marginal publishers — they're large, well-resourced newsrooms with substantial SEO investment, which underscores that this isn't a problem solvable purely through better technical SEO execution; it reflects a structural shift in how Google's search results page itself functions for a large share of queries.",
        ],
      ],
    },
    {
      heading: 'How publishers are responding',
      body: [
        [
          'The response from affected publishers has generally centered on diversification away from organic-search dependency rather than attempting to "win back" AI-Overview CTR through content tweaks alone. Business Insider specifically has cut back on SEO-dependent commerce content — the kind of "best X for Y" listicle content that AI Overviews are particularly good at summarizing directly — and pivoted toward live events as a way to build revenue less tied to organic search traffic (',
          {
            text: 'Forbes',
            href: 'https://www.forbes.com/sites/terdawn-deboe/2026/05/18/google-ai-overviews-are-eating-your-website-traffic-fight-back/',
            external: true,
          },
          ').',
        ],
        [
          'More broadly, industry commentary treats diversification into direct visits, email newsletters, social platforms, and brand-search traffic as close to a non-negotiable strategy at this point, rather than an optional hedge (',
          {
            text: 'New or Media',
            href: 'https://newormedia.com/blog/ai-overviews-publisher-revenue-strategy/',
            external: true,
          },
          '; ',
          {
            text: 'SEO.com',
            href: 'https://www.seo.com/blog/losing-traffic-to-ai/',
            external: true,
          },
          "). The underlying logic: if a structural ~37% CTR gap on AI-Overview queries is the new normal rather than a temporary dip, building revenue and audience relationships that don't route entirely through organic search click-through is a hedge against a channel that's now permanently less reliable than it used to be, not just a nice-to-have diversification tactic.",
        ],
      ],
    },
    {
      heading: 'Practical examples',
      body: [
        [
          '– ',
          { text: "Real: Seer Interactive's methodology.", bold: true },
          ' Tracking 53 named brands across 5.47 million queries and 2.43 billion impressions over 14 months is a specific, large-scale, real study design — not an estimate extrapolated from a small sample.',
        ],
        [
          '– ',
          { text: "Real: Business Insider's content pivot.", bold: true },
          ' Specifically cutting SEO-dependent commerce content and shifting toward live events is a documented, real strategic response, not a hypothetical recommendation.',
        ],
        [
          '– ',
          { text: 'Real: the cited-vs-uncited CTR gap.', bold: true },
          ' Pages cited within an AI Overview reportedly earn roughly 2.1% CTR versus roughly 0.9% for uncited pages appearing on the same results page — a real, measured difference that changes the practical goal from "avoid AI Overviews" to "get cited within them."',
        ],
        [
          '– ',
          { text: 'Illustrative, not a documented single case:', bold: true },
          ' picture a local service business whose "how much does X cost" blog post used to reliably drive clicks, now fully summarized inside an AI Overview with a numeric answer — the searcher gets their answer and never clicks, a scenario consistent with the zero-click statistics above but not a specific verified business we audited.',
        ],
      ],
    },
    {
      heading: 'Data and evidence',
      body: [
        [
          '– ',
          { text: 'Organic CTR on AI-Overview queries fell ~61%', bold: true },
          " (1.76% → 0.61%) between June 2024 and September 2025, per Seer Interactive's research as reported by Search Engine Land.",
        ],
        [
          '– ',
          { text: 'Paid CTR on the same query set fell ~68%', bold: true },
          ' (19.7% → 6.34%) over the same period — a steeper decline than organic (Search Engine Land / Seer Interactive).',
        ],
        [
          '– A separate, differently-designed eMarketer analysis found AI Overview presence correlated with a ',
          { text: '34.5% lower average CTR', bold: true },
          ' using position-based CTR data rather than the same before/after query tracking — directionally consistent, not the same number restated (eMarketer).',
        ],
        [
          '– ',
          {
            text: 'Zero-click searches sit at roughly 68-69% of US queries overall',
            bold: true,
          },
          ', with AI-Overview-specific subsets ranging 60-83% (Cognizo).',
        ],
        [
          '– ',
          {
            text: "Seer Interactive's study (53 brands, 5.47M queries, 2.43B impressions, Jan 2025–Feb 2026) found an 85% CTR recovery",
            bold: true,
          },
          ' between a December 2025 low and February 2026 (Search Engine Land).',
        ],
        [
          '– ',
          { text: 'A persistent ~37% structural CTR gap remains', bold: true },
          ' on AI-Overview queries versus non-AI-Overview queries, even after the recovery (Search Engine Land).',
        ],
        [
          '– ',
          {
            text: 'Cited pages earn ~2.1% CTR versus ~0.9% for uncited pages',
            bold: true,
          },
          ' on the same AI-Overview results page (Search Engine Land).',
        ],
        [
          '– ',
          {
            text: "Named publisher traffic declines (directional, varying by measurement window across sources): Business Insider ~-55% and HuffPost ~-50% (April 2022–April 2025), Daily Mail's US operation in the -32% to -44% range, The Sun (UK) in the -50% to -59% range year-over-year",
            bold: true,
          },
          '; CNN and the New York Post have also reported substantial declines, with less consistent exact figures across sources (Practical Ecommerce; corroborating trade coverage).',
        ],
        [
          "– Evidence not sufficiently verified: there's no single authoritative figure for what share of total organic search traffic loss across the industry is specifically attributable to AI Overviews versus other concurrent factors (algorithm updates, general search behavior shifts, competition) — the named publisher figures above describe overall traffic decline, not a decline isolated purely to the AI Overview effect.",
        ],
      ],
    },
    {
      heading: 'Comparisons: cited vs. uncited, organic vs. paid',
      body: [
        [
          'Comparison: Cited vs. uncited page on an AI-Overview results page · Higher CTR: Cited (~2.1%) · Lower CTR: Uncited (~0.9%) · Gap: Cited pages earn roughly 2.3x the CTR of uncited pages on the same page',
        ],
        [
          'Comparison: Organic vs. paid CTR decline on AI-Overview queries (2025) · Higher CTR: Organic (fell ~61%) · Lower CTR: Paid (fell ~68%) · Gap: Paid search absorbed a steeper relative decline than organic',
        ],
        [
          'Comparison: AI-Overview query CTR vs. non-AI-Overview query CTR (2026, post-recovery) · Higher CTR: Non-AI-Overview queries · Lower CTR: AI-Overview queries · Gap: ~37% structural gap remains even after the 85% recovery',
        ],
        [
          'The consistent theme across all three rows: being present is necessary but not sufficient. A page has to be cited, not just ranked, to capture the meaningfully higher CTR available on an AI-Overview page — and even cited pages on AI-Overview queries still likely underperform equivalent pages on queries with no AI Overview at all.',
        ],
      ],
    },
    {
      heading: 'Real-world use cases',
      body: [
        [
          "Seer Interactive's own study is itself the most useful real-world reference point for any site owner trying to figure out whether their own CTR trend is normal: a 14-month, 53-brand, 5.47-million-query dataset gives a credible industry baseline to compare a single site's specific CTR movement against, rather than reacting to one month of Search Console data in isolation.",
        ],
        [
          "The Business Insider case is a second concrete, real-world use case worth studying directly: rather than trying to out-optimize AI Overviews on exactly the content type most vulnerable to full summarization (commerce listicles), the publisher shifted investment toward a content and revenue format — live events — that AI Overviews structurally can't replace or summarize away, which is a genuinely different strategic response than a content or technical SEO fix.",
        ],
      ],
    },
    {
      heading: 'Common mistakes',
      body: [
        [
          '– ',
          {
            text: 'Treating the December 2025–February 2026 recovery as a full return to pre-AI-Overview CTR.',
            bold: true,
          },
          ' The 85% recovery figure describes movement from a depressed low, not a return to parity — a 37% structural gap remains.',
        ],
        [
          '– ',
          {
            text: 'Measuring overall site traffic decline and attributing all of it to AI Overviews',
            bold: true,
          },
          ', when named publisher figures (like the -50% to -55% range for HuffPost and Business Insider) reflect overall organic traffic decline from multiple compounding factors, not an isolated AI Overview effect.',
        ],
        [
          '– ',
          {
            text: 'Trying to "beat" AI Overviews on content types they\'re specifically good at summarizing',
            bold: true,
          },
          ' (simple factual answers, basic "best of" lists) instead of shifting investment toward content and revenue formats less vulnerable to full summarization.',
        ],
        [
          '– ',
          { text: 'Ignoring the cited-vs-uncited CTR gap', bold: true },
          ' and treating "ranking well" as the finish line, when being specifically cited within the AI Overview is what captures the meaningfully higher CTR.',
        ],
        [
          '– ',
          {
            text: 'Failing to isolate AI-Overview-affected queries in Google Search Console',
            bold: true,
          },
          ' before drawing conclusions about overall organic performance, which conflates AI-Overview-specific CTR loss with unrelated ranking or seasonal changes.',
        ],
      ],
    },
    {
      heading: 'Best practices for measuring and responding to AI Overview traffic loss',
      body: [
        [
          '1. ',
          {
            text: 'Isolate AI-Overview-affected queries in Google Search Console first',
            bold: true,
          },
          ', rather than assessing overall organic CTR trends in aggregate — the two can move in very different directions.',
        ],
        [
          '2. ',
          {
            text: "Benchmark your own CTR movement against the Seer Interactive dataset's 85% recovery / 37% remaining-gap figures",
            bold: true,
          },
          " to judge whether your site's trend is broadly in line with the industry or diverging in either direction.",
        ],
        [
          '3. ',
          {
            text: 'Prioritize getting cited within the AI Overview over simply ranking',
            bold: true,
          },
          ', since cited pages earn roughly 2.3x the CTR of uncited pages appearing on the same results page.',
        ],
        [
          '4. ',
          {
            text: 'Identify which of your content types are most vulnerable to full AI summarization',
            bold: true,
          },
          ' (short factual answers, simple listicles) and weigh shifting investment toward more experience-led, opinion-driven, or interactive content less easily condensed into a summary.',
        ],
        [
          '5. ',
          { text: 'Build direct, email, and social channels deliberately', bold: true },
          ', treating them as a structural hedge against a permanently altered organic CTR baseline rather than a supplementary nice-to-have.',
        ],
        [
          '6. ',
          { text: 'Reassess quarterly, not once.', bold: true },
          ' Given that the recovery trend itself was still evolving as of the most recent data reviewed, treat any single snapshot — including the figures in this article — as a point-in-time reading rather than a permanent conclusion.',
        ],
      ],
    },
    {
      heading: 'Key takeaways',
      body: [
        [
          '– Organic CTR on AI-Overview-triggering queries fell roughly 61% in 2025 (1.76% → 0.61%), with paid CTR falling even further (~68%).',
        ],
        [
          "– Seer Interactive's 53-brand, 5.47-million-query study found an 85% CTR recovery between December 2025 and February 2026 — but a persistent ~37% structural gap versus non-AI-Overview queries remains.",
        ],
        [
          '– Cited pages earn roughly 2.3x the CTR of uncited pages on the same AI-Overview results page, making citation — not just ranking — the practical goal now.',
        ],
        [
          "– Named publishers including HuffPost (~-50%) and Business Insider (~-55%) have reported substantial real traffic declines (with other outlets reporting similarly large but more variably measured drops), prompting genuine strategic shifts like Business Insider's pivot toward live events.",
        ],
        [
          '– The consistent industry response is diversification — direct, email, and social traffic — treated as a structural necessity rather than an optional hedge, given how persistent the CTR gap has proven to be.',
        ],
      ],
    },
    {
      heading: 'Relevant tools.scult.in resources',
      body: [
        [
          'Before diagnosing an AI Overview-specific CTR problem, confirm the more basic prerequisite with the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          " — a page that isn't reliably crawlable by AI systems can't be cited in an AI Overview at all, regardless of content quality, so it's worth ruling out first.",
        ],
        [
          'Given how directly this traffic shift connects to both organic strategy and paid-search economics — paid CTR fell even more sharply than organic on the same affected queries — this is a reasonable topic to bring into an ongoing conversation with a ',
          {
            text: 'local SEO',
            href: SERVICE_SEO_COMPANIES_FOR_SMALL_BUSINESS.href,
            external: true,
          },
          ' or ',
          {
            text: 'Google Ads management',
            href: SERVICE_GOOGLE_ADS_MANAGEMENT.href,
            external: true,
          },
          ' partner about how to rebalance channel investment for 2026 and beyond.',
        ],
        [
          'For a related, free starting point, try the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          '.',
        ],
      ],
    },
  ],
  faq: [
    {
      question: 'Do AI Overviews reduce clicks?',
      answer: [
        'Yes — 2025 data showed organic CTR on AI-Overview-triggering queries falling roughly 61%, though a partial recovery occurred by early 2026.',
      ],
    },
    {
      question: 'What percentage of searches are zero-click?',
      answer: [
        'Roughly 68-69% of US Google queries overall, with AI-Overview-specific query subsets ranging 60-83% depending on the specific set measured.',
      ],
    },
    {
      question: 'Does being cited in an AI Overview help CTR?',
      answer: [
        'Yes — cited pages earn roughly 2.1% CTR versus roughly 0.9% for uncited pages on the same AI-Overview results page.',
      ],
    },
    {
      question: 'Is AI Overview CTR loss permanent?',
      answer: [
        'Early 2026 data shows an 85% recovery from a December 2025 low, but a persistent ~37% structural gap versus non-AI-Overview queries remains — not a full reversal.',
      ],
    },
    {
      question: 'How much did organic CTR fall on AI-Overview queries in 2025?',
      answer: ['Roughly 61%, from 1.76% down to 0.61%.'],
    },
    {
      question: 'How much did paid CTR fall on AI-Overview queries?',
      answer: [
        'Roughly 68%, from 19.7% down to 6.34% — a steeper decline than organic CTR over the same period.',
      ],
    },
    {
      question: 'What is the Seer Interactive AI Overviews study?',
      answer: [
        'An analysis of 53 brands across 5.47 million queries and 2.43 billion impressions from January 2025 to February 2026, tracking CTR trends on AI-Overview-triggering queries.',
      ],
    },
    {
      question: 'Which publishers reported the biggest traffic drops tied to AI search?',
      answer: [
        "Business Insider (~-55%) and HuffPost (~-50%) reported the most consistently corroborated declines (April 2022–April 2025); Daily Mail's US operation (-32% to -44%) and The Sun UK (-50% to -59%) also reported large, if more variably measured, drops. CNN and the New York Post have reported substantial declines too, though exact figures vary more across sources.",
      ],
    },
    {
      question: 'How are publishers responding to AI Overview traffic declines?',
      answer: [
        'Largely through diversification — building direct, email, and social traffic — and in some cases content-strategy shifts, like Business Insider pivoting away from SEO-dependent commerce content toward live events.',
      ],
    },
    {
      question:
        'Should businesses diversify away from Google organic traffic because of AI Overviews?',
      answer: [
        'Most SEO commentary treats this as close to a non-negotiable strategy now, given the structural, apparently persistent CTR loss on AI-Overview-triggering queries.',
      ],
    },
    {
      question: 'What is "citation velocity" and is it related to CTR loss?',
      answer: [
        "It's a related but distinct concept describing how quickly new content gets crawled and then cited by an AI system — it affects whether you can be cited at all, which is a precondition for capturing the higher cited-page CTR described in this article.",
      ],
    },
    {
      question:
        'Is the AI Overview CTR gap the same across all industries or query types?',
      answer: [
        "This research didn't find data breaking the ~37% structural gap down by industry or query type specifically — treat it as an aggregate figure across the 5.47 million queries in Seer Interactive's dataset, not a guaranteed match for any single vertical.",
      ],
    },
    {
      question: 'Did paid search recover as much as organic search did by 2026?',
      answer: [
        "The specific 85% recovery figure reported by Seer Interactive was described for organic CTR on AI-Overview queries; this research didn't find an equivalent, directly comparable recovery percentage specifically isolated for paid CTR.",
      ],
    },
    {
      question: "Is Google's AI Overview coverage of search queries still growing?",
      answer: [
        "This research didn't turn up a specific, current percentage of total Google queries that trigger an AI Overview as of the most recent data reviewed — treat this as an open question rather than settled.",
      ],
    },
    {
      question: 'Does AI Overview CTR loss affect mobile and desktop searches equally?',
      answer: [
        "This wasn't addressed with device-specific data in the sources reviewed for this article.",
      ],
    },
    {
      question: 'What specifically counts as being "cited" within an AI Overview?',
      answer: [
        "It means a specific page's content was referenced, linked, or quoted directly within the AI-generated summary shown to the user — distinct from simply ranking in the traditional organic results shown below or alongside it.",
      ],
    },
    {
      question: 'Why did paid search CTR fall more than organic in 2025?',
      answer: [
        'The sources reviewed report the figures (68% paid decline vs. 61% organic) without providing a specific causal explanation for why paid was hit harder — treat the "why" as an open question, with the "how much" as the verified data point.',
      ],
    },
    {
      question: 'Is the zero-click search trend caused entirely by AI Overviews?',
      answer: [
        'No — zero-click search predates AI Overviews (driven partly by traditional featured snippets and knowledge panels), though AI Overviews are described as accelerating the trend further.',
      ],
    },
    {
      question:
        "What's the difference between AI Overviews and traditional featured snippets in terms of CTR impact?",
      answer: [
        "This research didn't find a direct, quantified comparison between the two specifically; AI Overviews are generally described as a more comprehensive summarization format, which is consistent with (though not proven by this research alone to cause) a larger CTR impact.",
      ],
    },
    {
      question: "How large was the Seer Interactive study's sample size?",
      answer: [
        '53 brands, 5.47 million queries, and 2.43 billion impressions, tracked from January 2025 through February 2026.',
      ],
    },
    {
      question: 'How do I recover traffic lost to AI Overviews?',
      answer: [
        'Focus on getting cited within the AI Overview itself (since cited pages earn meaningfully higher CTR than uncited ones), diversify traffic sources, and prioritize content types less easily fully summarized.',
      ],
    },
    {
      question: 'How do I get cited in AI Overviews?',
      answer: [
        'Recommended tactics include producing distinctive, experience-led, opinion-or-depth content that resists being fully summarized, and targeting queries where the AI Overview is unlikely to fully satisfy user intent on its own.',
      ],
    },
    {
      question: 'How do I measure AI Overview traffic loss in Google Search Console?',
      answer: [
        'Isolate the specific queries known or suspected to trigger AI Overviews, then compare CTR and click trends for that query set against your overall account trend, rather than assessing aggregate CTR alone.',
      ],
    },
    {
      question: 'How do I know if a specific keyword is triggering an AI Overview?',
      answer: [
        "Manually check the live search results for your target keywords, or use an SEO tool that flags AI-Overview presence per keyword, since this isn't something Search Console labels directly on its own.",
      ],
    },
    {
      question: 'How do I diversify traffic away from organic search?',
      answer: [
        'Build owned channels — email newsletters, social audiences, and direct/brand-search traffic — deliberately, treating them as core channels rather than supplementary ones given the structural CTR gap documented here.',
      ],
    },
    {
      question:
        'How do I decide which content to keep investing in versus deprioritize given AI Overview risk?',
      answer: [
        'Weigh how easily each piece of content could be fully summarized in a short AI answer — simple factual or listicle content is higher-risk; distinctive, opinion-driven, or interactive content is comparatively lower-risk.',
      ],
    },
    {
      question: "How do I benchmark my site's CTR trend against the industry?",
      answer: [
        "Compare your own AI-Overview-query CTR trend against Seer Interactive's published figures (85% recovery from a December 2025 low, ~37% structural gap remaining) as a rough industry reference point.",
      ],
    },
    {
      question:
        'How do I know if my traffic drop is due to AI Overviews or something else (an algorithm update, seasonality)?',
      answer: [
        'Cross-reference the timing of your traffic decline against known AI Overview rollout/expansion dates and isolate AI-Overview-triggering queries specifically in Search Console — a decline concentrated in those queries points more clearly to an AI Overview effect than a broad, query-agnostic drop.',
      ],
    },
    {
      question:
        'How do I structure content specifically to earn an AI Overview citation rather than just ranking?',
      answer: [
        'Provide clear, direct, well-structured answers to the exact question being asked, supported by original data, direct experience, or depth the AI Overview would otherwise have to synthesize secondhand from a less authoritative source.',
      ],
    },
    {
      question:
        'How do I convince stakeholders that a CTR drop is structural and not a temporary SEO problem to be "fixed"?',
      answer: [
        'Share the industry-wide data — the ~61% initial organic CTR decline, the 85% partial recovery, and the persistent ~37% structural gap — to frame the change as a market-wide shift rather than a site-specific ranking or technical issue.',
      ],
    },
    {
      question:
        'Is the 37% structural CTR gap expected to shrink further, stay flat, or widen in the future?',
      answer: [
        "The available data through February 2026 shows a partial recovery plateauing at a persistent gap; whether that gap narrows further, holds steady, or widens again isn't something the current data can predict with confidence.",
      ],
    },
    {
      question:
        'Is there a reliable way to predict which of my pages will get cited in a future AI Overview?',
      answer: [
        'No verified predictive method was found in this research; the practical approach is producing distinctive, well-structured, directly-answering content and monitoring actual citation outcomes over time rather than predicting them in advance.',
      ],
    },
    {
      question:
        'Does adding structured data (schema markup) increase my odds of being cited in an AI Overview?',
      answer: [
        "This research didn't find a study directly isolating schema markup's specific effect on AI Overview citation odds (as distinct from general AI crawlability); it plausibly helps a system understand and parse content correctly, but a quantified citation-rate lift wasn't found here.",
      ],
    },
    {
      question:
        'Is the AI Overview CTR effect different for informational versus transactional queries?',
      answer: [
        "This research didn't find data breaking the CTR effect down specifically by query intent type (informational vs. transactional) — treat this as an open question.",
      ],
    },
    {
      question:
        'How does AI Overview CTR loss compare across Google, Bing Copilot, and other AI-enhanced search products?',
      answer: [
        "This research focused specifically on Google's AI Overviews; a direct, comparably rigorous CTR study for other AI-enhanced search products wasn't found here, so a cross-platform comparison can't be made confidently from these sources.",
      ],
    },
    {
      question: 'Cited vs. uncited CTR in AI Overviews — how big is the gap really?',
      answer: [
        "Cited pages earn roughly 2.1% CTR versus roughly 0.9% for uncited pages on the same AI-Overview results page — over double, per Seer Interactive's data.",
      ],
    },
    {
      question: "Organic CTR with vs. without AI Overviews — what's the real difference?",
      answer: [
        'Even after the 2026 recovery, AI-Overview-triggering queries show roughly a 37% CTR shortfall compared to equivalent queries without an AI Overview present.',
      ],
    },
    {
      question:
        'Paid CTR vs. organic CTR under AI Overviews — which took the bigger hit?',
      answer: [
        'Paid CTR fell further in 2025 data (~68% decline) than organic CTR (~61% decline) on the same AI-Overview-affected query set.',
      ],
    },
    {
      question:
        'Is losing traffic to AI Overviews worse for publishers or for e-commerce/local businesses?',
      answer: [
        "The named publisher figures in this research (HuffPost, Business Insider, etc.) are all media/content publishers; this research didn't find an equivalently rigorous, named-brand traffic-decline dataset specifically for e-commerce or local-service businesses to make a direct comparison.",
      ],
    },
    {
      question:
        'Does an AI Overview citation carry the same trust/authority signal as a top organic ranking?',
      answer: [
        "This research didn't find data directly comparing user trust perception between an AI Overview citation and a traditional top-ranked organic result — treat this as an open question rather than an established finding.",
      ],
    },
    {
      question:
        "My site's traffic dropped sharply and I think it's AI Overviews — what should I check first?",
      answer: [
        'Isolate whether the affected queries are ones known to trigger an AI Overview, and check the timing against known AI Overview expansion — a broad, query-agnostic drop is more likely explained by something else (an algorithm update, technical issue) than by AI Overviews specifically.',
      ],
    },
    {
      question:
        "My CTR recovered somewhat in early 2026 but hasn't returned to pre-2025 levels — is that normal?",
      answer: [
        'Yes — this matches the documented industry pattern: an 85% recovery from the December 2025 low, while a persistent ~37% structural gap versus non-AI-Overview queries remains the new baseline.',
      ],
    },
    {
      question:
        "I'm ranking #1 on a query that triggers an AI Overview but still getting almost no clicks — why?",
      answer: [
        "Ranking in the traditional organic results and being cited within the AI Overview are different outcomes — if your page isn't the one the AI Overview actually references, you may be capturing little of the meaningfully higher CTR available to cited pages.",
      ],
    },
    {
      question:
        'We diversified into email and social but our overall traffic still feels down — is diversification not working?',
      answer: [
        "Diversification is a hedge against organic search's reduced reliability, not a guaranteed replacement for lost organic volume at a 1:1 ratio — it's reasonable for overall traffic to still reflect the organic decline even as other channels grow.",
      ],
    },
    {
      question:
        "How do I explain to my boss why our SEO traffic dropped even though we didn't change anything on our site?",
      answer: [
        'Point to the industry-wide, publisher-corroborated data in this article — a documented ~61% organic CTR decline on AI-Overview queries in 2025, with only partial recovery since — as evidence this is a market-wide shift, not a site-specific execution failure.',
      ],
    },
    {
      question: 'What tool can I use to check if my site is being cited in AI answers?',
      answer: [
        'An AI visibility check that specifically evaluates whether AI crawlers can access and parse your site is a useful first step before assessing citation likelihood — ',
        {
          text: "tools.scult.in's AI Visibility Checker",
          href: '/geo/ai-visibility-checker',
        },
        ' covers exactly this first gate.',
      ],
    },
    {
      question:
        'Should I invest in a Google Ads campaign to make up for lost organic AI Overview traffic?',
      answer: [
        "Given that paid CTR fell even more sharply than organic on AI-Overview-affected queries in 2025 data, a paid campaign isn't a guaranteed offset — it's worth evaluating on its own merits (target queries, expected CPC, conversion economics) rather than assuming it simply replaces lost organic clicks.",
      ],
    },
    {
      question: 'Is local SEO a good hedge against AI Overview traffic loss?',
      answer: [
        "Local, transactional queries with clear commercial intent are generally considered somewhat more resistant to full AI summarization than purely informational queries, though this research didn't find a specific, quantified comparison to confirm that as a rule.",
      ],
    },
    {
      question:
        'Should I hire an SEO or Google Ads agency specifically to respond to AI Overview traffic loss?',
      answer: [
        'Given that the structural CTR gap documented here affects most sites in the space rather than being a fixable, site-specific technical problem, a strategic diversification and citation-focused content plan — the kind of ongoing work an SEO or Google Ads partner does — is a reasonable response to evaluate.',
      ],
    },
    {
      question:
        'Where can I get help building a response plan for AI Overview traffic loss?',
      answer: [
        "Isolating your AI-Overview-affected queries in Search Console and benchmarking against the industry figures in this article is a good first step you can do yourself; for an ongoing strategy spanning local SEO, content, and paid diversification, that's the kind of work worth discussing with a ",
        {
          text: 'local SEO',
          href: SERVICE_SEO_COMPANIES_FOR_SMALL_BUSINESS.href,
          external: true,
        },
        ' or ',
        {
          text: 'Google Ads management',
          href: SERVICE_GOOGLE_ADS_MANAGEMENT.href,
          external: true,
        },
        ' partner.',
      ],
    },
  ],
  sources: [
    'https://searchengineland.com/google-ai-overviews-ctr-recovery-study-475566',
    'https://searchengineland.com/google-ai-overviews-drive-drop-organic-paid-ctr-464212',
    'https://www.emarketer.com/content/google-ai-overviews-decrease-ctrs-by-34-5-per-new-study',
    'https://www.cognizo.ai/blog/google-ai-overviews-statistics',
    'https://www.forbes.com/sites/terdawn-deboe/2026/05/18/google-ai-overviews-are-eating-your-website-traffic-fight-back/',
    'https://www.demandlocal.com/blog/ai-search-organic-traffic-decline-agencies/',
    'https://www.relevantaudience.com/seo/how-to-fix-traffic-loss-from-ai-overviews/',
    'https://www.semrush.com/blog/ai-overviews-traffic-loss/',
    'https://serpstat.com/blog/how-to-measure-traffic-loss-ai-overview/',
    'https://www.practicalecommerce.com/why-search-rankings-are-driving-less-traffic',
    'https://pressgazette.co.uk/media-audience-and-business-data/media_metrics/traffic-to-10-biggest-us-news-websites-down-a-third-in-two-years/',
  ],
  relatedTools: ['ai-visibility-checker', 'schema-markup-generator'],
  relatedPrompts: [],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-21',
  readingMinutes: 18,
}
