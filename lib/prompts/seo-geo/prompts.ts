import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'seo-geo-serp-intent-content-brief',
    category: 'seo-geo',
    title: 'Turn a target keyword into a content brief anchored to the real SERP',
    description:
      'Classifies true search intent against the actual top-10 snapshot, inventories which SERP features are genuinely present, and builds a heading outline where every H2 states the specific job it does for the reader — the strategy layer that has to happen before a draft gets written.',
    promptText: `You are a senior SEO content strategist. Your deliverable is a brief a writer can execute without a single follow-up question — not draft copy, and not a generic outline that could apply to any query in this space.

TARGET KEYWORD: {{target_keyword}}
AUDIENCE: {{audience}}
BUSINESS CONTEXT: {{business_context}}
CURRENT TOP-10 SNAPSHOT: {{serp_snapshot}}
TARGET WORD COUNT: {{word_count_target}}

STEP 1 — CLASSIFY INTENT
State whether {{target_keyword}} is informational, commercial-investigation, transactional, or navigational, and justify it in one sentence grounded in what kind of page would actually satisfy the searcher — not the keyword's surface phrasing. If the snapshot shows a genuine mix of page types in the top 10, name the mix and pick the format the plurality supports rather than defaulting to whichever is easiest to write.

STEP 2 — INVENTORY SERP FEATURES
From the snapshot given, list which SERP features are actually present: featured snippet, People Also Ask, AI Overview, video carousel, local pack, shopping results, image pack. For each one present, state the specific format implication — a featured snippet held as a definition paragraph means the brief needs a crisp 40-60 word direct answer near the top; a comparison table winning it means the brief needs a table, not prose. If a feature is absent, say so instead of listing it out of habit.

STEP 3 — BUILD THE OUTLINE
Produce an H1-H3 outline that answers the query at the depth this intent and this SERP demand — not padded to hit {{word_count_target}}, not thin because the topic looks simple. For every H2, add a bracketed note stating the specific job that section does for the reader, for example "[resolves the objection that stops the reader from converting]" or "[the comparison table this SERP's intent expects]." A section with no stated job gets cut, not kept for completeness.

STEP 4 — SURFACE THE UNSTATED QUESTIONS
List the sub-questions a genuinely thorough page would answer that the searcher hasn't typed but is implicitly asking, based on what the Step 1 classification implies about their situation and what stage of the decision they're at.

STEP 5 — E-E-A-T CHECKLIST
Name the specific experience, credentials, first-hand data, or original example that would make this page read as more trustworthy than a rewrite of the current top 10 — not a generic "add expert quotes" line, but the actual kind of proof this exact topic and audience would find credible.

STEP 6 — DIFFERENTIATION ANGLE
Given {{business_context}}, name one angle the current top-ranking pages are structurally unlikely to include, and explain the specific reason this business is positioned to include it honestly rather than as a claimed advantage with nothing behind it.

OUTPUT FORMAT
A structured brief with the six sections above as clear headers, not flowing prose. Close with a word-count allocation per H2 so a writer knows roughly how much space each section earns, and it should sum to something close to {{word_count_target}}.`,
    variables: [
      {
        name: 'target_keyword',
        description: 'The primary keyword or query the page needs to satisfy.',
        example: 'best accounting software for freelancers',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who the page is actually written for.',
        example: 'freelance designers and consultants with no bookkeeping background',
        required: true,
      },
      {
        name: 'business_context',
        description:
          'What you sell or the goal this page serves, for the differentiation step.',
        example:
          'we sell invoicing and tax-estimate software built specifically for solo freelancers',
        required: false,
      },
      {
        name: 'serp_snapshot',
        description:
          'A summary of the current top 10 results — titles, formats, and which SERP features you can see.',
        example:
          '6 of the top 10 are comparison listicles, 1 is a tool review video with a video carousel, a featured snippet holds a definition paragraph, and People Also Ask shows "is QuickBooks worth it for freelancers"',
        required: true,
      },
      {
        name: 'word_count_target',
        description: 'A rough length target for the finished page.',
        example: '2,200-2,600 words',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
    tags: [
      'content-brief',
      'search-intent',
      'serp-features',
      'on-page-seo',
      'content-strategy',
      'outline',
    ],
    whyItWorks: `Classifying intent against an actual SERP snapshot rather than the keyword's wording alone catches the single most common briefing mistake: a query that reads as informational ("how much does X cost") can still be dominated by commercial-investigation pages in practice, because searchers asking that question are shopping, not studying — a brief built from the keyword's grammar instead of the SERP's evidence sends a writer toward the wrong format before a sentence is written. Requiring a bracketed "job" note on every H2 forces the outline to justify each section's existence individually rather than accept a template structure by default, which is what actually prevents the two failure modes a content brief is supposed to guard against: padding a thin topic to hit a word count, and skipping real depth on a topic that looks simple but isn't. The unstated-questions step and the E-E-A-T checklist both target the same underlying signal Google's Quality Rater Guidelines describe explicitly — pages that demonstrate first-hand experience and answer the searcher's next question before they ask it are rated as more satisfying than ones that stop at the literal query, and a brief that only restates the keyword never surfaces that layer on its own. Finally, tying the differentiation angle to the stated business context rather than asking for a generic "unique value prop" keeps the model from inventing a competitive advantage with nothing behind it — it can only name an angle the business is actually positioned to back up, which is what separates real differentiation from marketing filler dressed up as strategy.`,
    exampleOutput: `Intent: Commercial-investigation — despite the informational phrasing, 6 of 10 ranking pages are comparison listicles built to move a reader toward a purchase decision, not a single explainer.

SERP features: featured snippet (definition paragraph — needs a 50-word direct-answer block up top); People Also Ask includes "is QuickBooks worth it for freelancers" — dedicate an H2 to it, don't bury it in a table cell.

H2: What freelancers actually need that generic accounting software misses [sets evaluation criteria before naming tools]
H2: Top picks by business stage [addresses "which one for me," the real decision point]
H2: Pricing side-by-side [SERP feature match — this is what a comparison-page reader screenshots]

Unstated question: "What happens to my data if I switch tools next year?"

Differentiation: your product's built-in quarterly tax estimate is something a general-purpose tool like QuickBooks doesn't do natively — a claim your own product page can back up, unlike a reviewer with no freelance tax exposure.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-02' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-25' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against ChatGPT.',
      },
      {
        date: '2026-08-02',
        note: 'Re-verified against Claude Sonnet 5; added the bracketed per-H2 job requirement after a draft outline padded a thin topic to hit the word-count target instead of flagging that the target was too high for the intent.',
      },
    ],
  },
  {
    slug: 'seo-geo-keyword-cluster-architecture',
    category: 'seo-geo',
    title: 'Turn a raw keyword export into a cannibalization-proof cluster map',
    description:
      'Groups a messy keyword list into distinct content clusters by search intent rather than shared words, names the primary target per cluster, and flags every pair of keywords that would fight each other for the same page instead of building two.',
    promptText: `You are an SEO information architect deciding how many pages a keyword list actually justifies — not how many keywords it contains.

SITE CONTEXT: {{site_context}}
RAW KEYWORD LIST (with monthly search volume if available):
{{keyword_list}}
EXISTING PAGES ALREADY LIVE, IF ANY: {{existing_pages}}

TASK

1. GROUP BY INTENT, NOT WORDS. Cluster these keywords into groups a single page could realistically satisfy without competing against another page on this same site. Two keywords sharing several words but serving different intents — "crm pricing" and "crm software comparison" is the canonical example — must NOT be forced into one cluster unless you can name the specific reason one page genuinely covers both.
2. NAME EACH CLUSTER by the page title it implies, outcome-first, not the seed keyword restated.
3. FOR EACH CLUSTER, state the dominant intent (informational / commercial-investigation / transactional) and the single keyword that becomes the page's primary target. Every other keyword in that cluster becomes a secondary target the page earns through topical depth — never a second H1 competing for the same click.
4. FLAG CANNIBALIZATION RISK explicitly: any two keywords across the whole list, not just within one cluster, that look like they'd want the same page. For each pair, recommend which one becomes primary and which folds in as supporting content, rather than leaving both to become competing pages later.
5. FLAG WHAT YOU CANNOT CONFIDENTLY CLUSTER — ambiguous keywords whose intent genuinely depends on the searcher's stage or on business context you don't have — and state exactly what additional information would resolve it. Do not force a confident-sounding cluster onto an ambiguous keyword just to avoid an "unclear" answer.
6. IDENTIFY THE PILLAR-CLUSTER HIERARCHY: if any clusters are naturally subtopics feeding a broader pillar page, name the pillar and which clusters should link up to it rather than sit as unrelated siblings.
7. If {{existing_pages}} is provided, check whether any new cluster would compete with a page that already exists rather than filling a genuine gap, and say so before recommending a new page be built.

OUTPUT
A table: Cluster name | Primary keyword | Secondary keywords | Intent | Suggested page type. Follow it with the cannibalization-risk list, the unclustered/ambiguous list, and the pillar hierarchy, each as its own labeled section.`,
    variables: [
      {
        name: 'keyword_list',
        description:
          'The raw keyword export, one per line, with search volume if you have it.',
        example:
          'best crm for small business (2400)\ncrm software comparison (1900)\nfree crm for startups (1600)\ncrm pricing (880)\nhow to choose a crm (720)\ncrm implementation checklist (390)',
        required: true,
      },
      {
        name: 'site_context',
        description:
          "What the site or business is, so clusters map to pages you'd actually build.",
        example:
          'we sell CRM software aimed at small teams under 20 people, self-serve signup with no sales calls',
        required: true,
      },
      {
        name: 'existing_pages',
        description:
          'URLs and topics of pages already live, so new clusters get checked against them first.',
        example:
          '/pricing — current pricing page; /blog/crm-vs-spreadsheets — comparison post',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'keyword-clustering',
      'keyword-research',
      'content-architecture',
      'topical-authority',
      'cannibalization',
      'search-intent',
    ],
    whyItWorks: `Clustering by intent instead of shared words is the actual difference between designing a site architecture and producing a pile of similar pages, because two pages chasing the same intent split ranking signals between them instead of compounding into one authoritative result — a real and measurable cost search engines don't forgive just because the pages use different exact-match phrasing. The cross-list cannibalization check matters separately from the within-cluster grouping step, because the riskiest pairs are rarely the ones that look similar on the surface inside one cluster; they're the ones that surface only when the entire list is compared against itself, which is why the task explicitly requires scanning across all clusters, not just within each one. Explicitly flagging ambiguous keywords rather than forcing a confident-sounding grouping targets the actual failure mode that makes DIY keyword clustering expensive after the fact: an architecture decision made on a guess doesn't surface as a problem in a spreadsheet, it surfaces months later as two live pages quietly competing for the same ranking, at which point merging them costs a redirect and lost link equity instead of five minutes of honest uncertainty up front. Checking new clusters against pages that already exist closes the same gap from the other direction — a keyword list analyzed in isolation from the live site will happily recommend building a page that duplicates one already ranking, which is cannibalization the model could have caught for free if it had been given the context to look.`,
    exampleOutput: `Cluster: "Best CRM for Small Business" | Primary: best crm for small business | Secondary: free crm for startups | Commercial-investigation | Comparison listicle

Cluster: "CRM Pricing Explained" | Primary: crm pricing | Secondary: — | Commercial-investigation | Pricing breakdown page

Cannibalization risk: "crm software comparison" and "best crm for small business" want the same page — merge, keep "best crm for small business" as primary, fold the comparison angle into that page's structure instead of building a second one.

Unclear: "how to choose a crm" could be a standalone guide or an intro section on the pillar page — depends on whether you want a separate top-of-funnel asset; resolve by checking if it has enough distinct search volume to justify its own page.

Pillar: "CRM Pricing Explained" is a natural subtopic of "Best CRM for Small Business" — link it as supporting content, not a competing target.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-21' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against ChatGPT and Gemini 3 Pro.',
      },
    ],
  },
  {
    slug: 'seo-geo-competitor-gap-audit',
    category: 'seo-geo',
    title: "Find exactly what's outranking you and why, subtopic by subtopic",
    description:
      'Compares your page against the 2-3 pages currently beating it and returns specific, evidence-backed gaps — a missing pricing table, an uncredentialed claim, a cut section — instead of a vague "add more depth" verdict.',
    promptText: `You are a content auditor running a competitive gap analysis, not issuing a generic "add more content" verdict.

TARGET KEYWORD: {{target_keyword}}
YOUR CURRENT PAGE:
{{your_content}}
PAGES CURRENTLY OUTRANKING YOU (labeled by source):
{{competitor_content}}

TASK

1. MISSING SUBTOPICS. List subtopics or questions the competitors cover that your page doesn't. Be specific — not "more detail," but the actual thing: "Competitor A includes a cost-by-project-size table broken into small/medium/large; your page only states 'it depends.'"
2. WHAT YOU ALREADY DO BETTER. List anything your page already covers that none of the competitors do. This step exists so closing gaps in step 1 doesn't come at the cost of cutting your page's actual differentiation — name it explicitly so it survives the edit.
3. STRUCTURAL ELEMENTS. Compare tables, FAQs, calculators, worked examples, downloadable templates, or original data and screenshots. State plainly which structural elements the competitors use that yours lacks, and which — if any — you already have that they don't.
4. EXPERTISE SIGNALS. Compare named authors or credentials, first-hand case studies, specific numbers versus vague claims, and citations to real sources. Give an honest verdict on whether your page currently reads as less authoritative than the competitors, and name the specific thing causing that impression rather than a general "needs more trust signals."
5. WHAT TO CUT. Identify redundant, outdated, or low-value sections in your own page that add length without adding value. Cutting these matters as much as adding what's missing — a page that grows only by addition eventually reads as padded even after every real gap is closed.
6. PRIORITIZE. Rank the 3 changes most likely to move the needle against this specific competitive set, separate from minor polish that can wait.

CONSTRAINT
Every gap named must point to a specific, real thing a competitor page actually does — never a generic "add more expert quotes" or "improve depth" with no source. If you can't point to the specific competitor evidence for a suggested change, don't include it.

OUTPUT
The six sections above as labeled headers, in order, ending with the prioritized 3.`,
    variables: [
      {
        name: 'target_keyword',
        description: "The keyword you're trying to rank for.",
        example: 'how to price a website redesign',
        required: true,
      },
      {
        name: 'your_content',
        description: "Your page's current content, pasted in full or as a close summary.",
        example: '[paste your page text, including headings]',
        required: true,
      },
      {
        name: 'competitor_content',
        description:
          'The content of 2-3 pages currently outranking you, each clearly labeled by source.',
        example:
          'Competitor A (agencyworks.com): [full text]\nCompetitor B (designhub.io): [full text]',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: [
      'content-gap-analysis',
      'competitor-analysis',
      'content-audit',
      'topical-coverage',
      'on-page-seo',
    ],
    whyItWorks: `A page-by-page gap analysis targets the same underlying signal search engines' relevance and topical-completeness models actually reward — comprehensive coverage of a subject rather than a shorter treatment of the same ground — but it only produces something actionable if every gap is tied to concrete competitor evidence, which is why the constraint against generic suggestions is load-bearing rather than a style note: "add more expert quotes" gives a writer nothing to act on, while "Competitor B names a licensed contractor and cites a 2026 material-cost index; your page has neither" tells them exactly what to build. Protecting what your page already does better in a dedicated step, rather than trusting the model to preserve it while closing gaps, matters because a blind "match every competitor feature" pass has a predictable failure mode: it dilutes a page's real differentiation in the process of chasing parity, since nothing in a simple gap-closing instruction rewards keeping a unique angle that no competitor validates by having it too. The separate cutting step exists because most gap analyses only ever add — outdated sections, a paragraph answering a question nobody asks anymore, a section that was relevant two content updates ago — accumulate invisibly, and a page that only grows eventually reads as padded even after every genuine gap from the competitor set is closed, which actively works against the depth-without-bloat signal the whole exercise is trying to earn.`,
    exampleOutput: `Missing: Competitor A includes a cost-by-project-size table (small/medium/large agency); your page only says "costs vary." Competitor B names a senior designer with 8 years' experience and a dated case study; your page has no byline or named author.

What you already do better: your page is the only one that addresses redesign cost for nonprofits specifically — keep this, don't cut it while adding the pricing table.

Structural gap: neither competitor has a downloadable checklist; yours does — a real advantage, note it explicitly so it survives the edit.

Cut: a 200-word "history of web design" section adds length with no ranking or reader value — remove it to make room for the pricing table without growing total word count.

Priority: 1) add the cost-by-project-size table, 2) add a named author with credentials, 3) cut the history section.`,
    verifiedAgainst: [
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-07-27' },
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Perplexity Sonar Pro.',
      },
      {
        date: '2026-08-03',
        note: 'Re-verified against Claude Sonnet 5; added the explicit "protect what you already do better" step after a test run recommended cutting a page\'s only genuine differentiator to make room for competitor-matching content.',
      },
    ],
  },
  {
    slug: 'seo-geo-meta-title-description-ctr',
    category: 'seo-geo',
    title: 'Rewrite a title tag and meta description that actually earns the click',
    description:
      'Produces 3 title tag and meta description pairs fitted to real snippet-length limits, front-loaded with the target keyword, built around one specific differentiator instead of a generic claim — with exact character counts so nothing gets silently truncated on a phone.',
    promptText: `You are an SEO copywriter who treats pixel-width truncation as a real design constraint, not a suggestion to round to a nearby number.

PAGE TOPIC AND TARGET KEYWORD: {{page_topic}}
THE ONE SPECIFIC REASON TO CLICK THIS RESULT: {{unique_value}}
CURRENT TITLE AND META, IF ANY: {{current_title_and_meta}}
TONE: {{cta_style}}

TASK

1. Write 3 title tag variants, each 50-60 characters including spaces, with the target keyword or a close natural variant appearing within the first 40 characters — that's the part most reliably visible even on a narrower mobile SERP render before truncation.
2. Write 3 matching meta description variants, each 120-155 characters. Google truncates on rendered pixel width, not character count, and rendering studies put the dependable safe zone there across most devices — don't write to the theoretical maximum and plan to trim later; write inside the safe zone from the start.
3. Front-load the keyword or a close variant in the first 60 characters of the description too, since that's the portion shown even when Google truncates or rewrites the rest.
4. Build each variant around the specific detail in {{unique_value}}, not a generic claim. "Comprehensive guide," "everything you need to know," and "ultimate guide" are banned phrases — if a phrase could be pasted onto a competitor's page unchanged and still sound true, it isn't specific enough.
5. End each description with a concrete reason to click — what the reader actually gets — not an empty "learn more."
6. Report the exact character count next to every title and every description.
7. If {{current_title_and_meta}} is provided, name the single biggest weakness in the current version before presenting the rewrites, so the improvement is legible, not just assumed.

OUTPUT
3 title/description pairs with character counts. Close with which pair you'd ship as the default and the specific generic phrase you deliberately avoided reusing — the kind that shows up nearly verbatim across half of any given SERP.`,
    variables: [
      {
        name: 'page_topic',
        description: 'What the page is about and its target keyword.',
        example: 'a comparison page: "Squarespace vs Wix for small business websites"',
        required: true,
      },
      {
        name: 'unique_value',
        description:
          "The one specific reason to click this result over a competitor's — a number, a differentiator, an outcome.",
        example:
          'we tested load speed and pricing on both platforms ourselves in June 2026',
        required: true,
      },
      {
        name: 'current_title_and_meta',
        description:
          'The existing title tag and meta description, if you already have one to improve on.',
        example:
          'Title: "Squarespace vs Wix - Complete Comparison Guide" / Meta: "Everything you need to know about choosing between Squarespace and Wix for your website."',
        required: false,
      },
      {
        name: 'cta_style',
        description: 'The tone or CTA style you want.',
        example:
          'direct and practical, no hype, aimed at a small-business owner with limited time',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'meta-description',
      'title-tag',
      'ctr-optimization',
      'serp-snippet',
      'on-page-seo',
    ],
    whyItWorks: `A title tag and meta description aren't ranking factors in themselves, but they are the single biggest lever over organic click-through rate on a result you already rank for, and CTR relative to average position is one of the signals that feeds back into how a page performs over time — which is why treating this as a copywriting exercise with a hard length constraint, not a formality, actually matters. The character discipline exists because Google truncates on rendered pixel width, not a fixed character count, so writing to a theoretical 155-character maximum and assuming it'll fit is exactly the mistake that gets a description cut mid-word on a phone; writing inside a safe zone from the first draft avoids ever needing to trim after the fact. Front-loading the keyword in both fields separately matters because Google frequently rewrites or shortens the meta description it displays, keeping only the portion it judges most relevant to the query — a keyword buried at character 90 may never survive that rewrite, while one in the first 60 characters usually does. Banning generic phrases directly targets a real, checkable problem: scan any SERP and a large share of the snippets are functionally interchangeable "comprehensive guide" restatements, which means a genuinely specific differentiator — a real test, a real number, a real date — is often the only variable left that can actually move a click decision between two results holding similar positions.`,
    exampleOutput: `1. Title: "Squarespace vs Wix (2026): We Tested Both" — 41 characters
   Meta: "We ran Squarespace and Wix side by side in June 2026 — see which one loads faster and costs less." — 100 characters

2. Title: "Squarespace vs Wix for Small Business" — 39 characters
   Meta: "Real speed tests, real pricing, tested June 2026 — no guessing which website builder wins." — 93 characters

Ship: #1 — leads with the comparison keyword and the "we tested" differentiator inside the first 40 characters of the title.
Avoided: "everything you need to know about choosing a website builder."`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-02' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-21' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against ChatGPT.',
      },
      {
        date: '2026-08-02',
        note: 'Re-verified against Claude Sonnet 5; tightened the description range from a flat 155-character ceiling to a 120-155 safe zone after checking current mobile snippet rendering.',
      },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'seo-geo-internal-link-equity-map',
    category: 'seo-geo',
    title: 'Plan the internal links a new page needs before it goes live',
    description:
      'Maps which existing pages should link to a new page, with what anchor text, which sections of the new page should link back out, and whether the new page is at real risk of launching as an orphan with no natural path in.',
    promptText: `You are an information architect optimizing internal link equity, not scattering related-posts links after the fact.

NEW PAGE: {{new_page}}
EXISTING PAGES ON THE SITE (with a one-line topic note each): {{existing_pages}}
CURRENT SITE NAVIGATION STRUCTURE: {{nav_structure}}

TASK

1. INBOUND LINKS. Which existing pages should link TO the new page, and why specifically? Prioritize pages that are topically close and already carry meaningful traffic or authority — a high-traffic blog post is worth far more as a linking source than a page nobody visits, even if the second page is a closer topical match on paper. For each recommended source, name the exact paragraph or section where the link would sit naturally, not just "somewhere on this page."
2. ANCHOR TEXT. Suggest the exact anchor text for each inbound link. Descriptive and topically relevant, never "click here" or a bare URL — and varied enough across the different source pages that it doesn't read as manufactured, since identical anchor text repeated from many sources is itself a pattern search engines discount.
3. OUTBOUND LINKS. Which sections of the new page should link OUT to existing pages? Map specific subtopics in the new page to the single most relevant existing page for that subtopic — not a generic "related posts" block bolted onto the bottom.
4. PILLAR VS. SIBLING. Flag any existing page that's a natural pillar this new page should feed into and be linked from prominently, versus pages that are lateral siblings deserving a mention but not a hub relationship.
5. ORPHAN RISK. If too few existing pages are topically close enough to justify a natural, non-forced link, say so plainly — that's usually a sign the page needs a home in the nav or category structure rather than more inline links stretched to reach it. Check {{nav_structure}} specifically for whether this new page has any structural path a crawler would actually follow, independent of inline links.
6. LINK DEPTH. Estimate how many clicks from the homepage the new page will sit at once these links are in place, and flag it if that depth is deeper than 3-4 clicks, since pages buried that deep get crawled and re-crawled less frequently regardless of how relevant their inbound anchors are.

OUTPUT
A table: Source page | Anchor text | Links to | Reason. Follow it with the pillar/sibling notes, the orphan-risk verdict, and the estimated click depth.`,
    variables: [
      {
        name: 'new_page',
        description:
          "The new page's title, target keyword, and a one-line summary of its content.",
        example:
          'Title: "How Much Does a Website Redesign Cost in 2026?" — target keyword: website redesign cost — summarizes pricing ranges by project size',
        required: true,
      },
      {
        name: 'existing_pages',
        description:
          'A list of existing page titles/URLs with a one-line topic note each.',
        example:
          '/services/web-development — service overview page\n/blog/signs-you-need-a-website-redesign — high-traffic blog post\n/pricing — general pricing page',
        required: true,
      },
      {
        name: 'nav_structure',
        description:
          'How the site is currently organized in its top-level navigation and category pages.',
        example:
          'Top nav: Home, Services, Blog, Pricing, Contact — Services has a dropdown for Web Development, Branding, SEO',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'internal-linking',
      'site-architecture',
      'anchor-text',
      'crawl-depth',
      'technical-seo',
      'link-equity',
    ],
    whyItWorks: `Internal links distribute authority from a site's stronger pages to newer or weaker ones — a new page linked prominently from a high-traffic post inherits some of that page's crawl priority and topical signal, while an unlinked page can sit un-crawled or under-indexed regardless of how good the content itself is, which is why the prioritization rule favors traffic and authority over a merely closer topical match on paper. Descriptive, varied anchor text gives search engines an explicit topical signal about the destination page that goes beyond what the destination page says about itself — and the variety requirement specifically guards against a pattern that reads as manufactured: identical anchor text repeated from many different source pages toward one destination is a signature search engines are tuned to discount rather than reward, so uniformity is a cost, not free reinforcement. The click-depth estimate matters because crawl frequency correlates with how deep in a site's structure a page sits, independent of how relevant its inbound links are — a page that's topically perfect but four or five clicks from the homepage still gets crawled less often than a shallower, less-linked one, which is exactly the kind of structural problem inline anchor-text tweaks alone cannot fix and that only shows up when depth is measured explicitly rather than assumed to be fine.`,
    exampleOutput: `Source page | Anchor text | Links to | Reason
/blog/signs-you-need-a-website-redesign | "what a redesign typically costs" | new page | High-traffic post, directly upstream in the reader's decision path, natural mid-article insertion point
/services/web-development | "see current redesign pricing" | new page | Service page already discusses redesign; natural pillar relationship

Pillar: /services/web-development is the pillar; new page and /blog/signs-you-need-a-website-redesign are siblings feeding into it.

Orphan risk: none — two strong natural sources exist. Click depth: 2 clicks from homepage (Home > Services > new page), well within a healthy range.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-24' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-19' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against ChatGPT and Gemini 3 Pro.',
      },
      {
        date: '2026-08-01',
        note: 'Added the click-depth estimate after realizing a page can pass every anchor-text and pillar check while still being buried too deep in nav structure for regular re-crawling.',
      },
    ],
  },
  {
    slug: 'seo-geo-featured-snippet-capture',
    category: 'seo-geo',
    title: 'Restructure a section specifically to win a featured snippet',
    description:
      'Diagnoses which snippet format a query is actually pulling — paragraph, list, or table — from the current holder, then restructures your section to match that exact shape without turning the copy into a robotic answer nobody wants to read on the page itself.',
    promptText: `You are an on-page structure editor optimizing for featured-snippet capture, not just general readability.

TARGET QUERY: {{target_query}}
CURRENT SNIPPET HOLDER'S CONTENT (paste what's currently shown in the box, if you can see it): {{current_snippet_content}}
YOUR EXISTING SECTION ON THIS TOPIC: {{your_section}}

TASK

1. DIAGNOSE THE FORMAT. From {{current_snippet_content}}, identify exactly which shape Google is currently rewarding for this query: a paragraph snippet (a direct 40-60 word answer), an ordered/unordered list snippet (steps or items), or a table snippet (comparative data across rows and columns). Do not guess a generic answer — name the specific shape shown.
2. MATCH THE SHAPE. Restructure {{your_section}} into that exact shape.
   - Paragraph: the answer must be extractable in one 40-60 word block, self-contained, with the direct answer in its first sentence — no "it depends" as the opening clause.
   - List: format as an actual HTML-ready ordered or unordered list, each item as a short, scannable phrase, not a paragraph disguised as a bullet.
   - Table: build a real table with the same column structure the current holder uses, or a clearly better one if a column is obviously missing there.
3. DON'T LOSE THE HUMAN READER. The rewritten block should still read naturally as part of the page — this is not license to strip all context and voice from the section. Everything outside the extractable snippet-shaped block can stay as normal prose.
4. NAME THE GAP. If the current holder's answer is thin, outdated, or missing an obvious sub-point, name exactly what's missing and make sure your version includes it — a snippet gets replaced when a clearly better answer to the same query appears, not through effort alone.
5. FLAG IF NO SNIPPET EXISTS YET. If {{current_snippet_content}} is empty because no snippet currently shows for this query, say so, and note that this is often more winnable than displacing an entrenched one — build the paragraph-shaped block as the default bet unless the SERP shows a strong signal otherwise.

OUTPUT
The diagnosed format, the rewritten block in that exact shape, and one sentence naming the specific reason your version should outrank the current holder or claim the empty snippet slot.`,
    variables: [
      {
        name: 'target_query',
        description: 'The exact query whose featured snippet you want to win.',
        example: 'how long does a tattoo take to heal',
        required: true,
      },
      {
        name: 'your_section',
        description:
          'Your existing content on this exact question, as currently written.',
        example:
          'Healing varies by person and by tattoo, but generally speaking most tattoos take a while to heal fully, with several stages involved in the process.',
        required: true,
      },
      {
        name: 'current_snippet_content',
        description:
          "What's currently shown in the featured snippet box for this query, if one exists. Leave blank if none is showing.",
        example:
          '"Most tattoos take 2 to 3 weeks to heal on the surface, and up to 6 months for the deeper skin layers to fully heal." (currently held by healthline.com)',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'featured-snippets',
      'serp-features',
      'passage-extraction',
      'on-page-structure',
      'answer-first',
    ],
    whyItWorks: `Google selects a featured snippet from a specific passage on a page that's already ranking reasonably well, and it consistently favors passages that are already structurally shaped like the answer it wants to show — which is why diagnosing the exact current format before rewriting anything matters more than general "be concise" advice: a well-written paragraph competing against an entrenched table-format snippet is optimizing for the wrong shape entirely, no matter how clear the prose is. Naming the specific gap in the current holder's answer targets the actual mechanism by which snippets change hands — Google replaces a snippet when it finds a clearly better-structured or more complete answer to the same query, not on a schedule, so a rewrite that's merely equally good in a different shape rarely displaces an incumbent, while one that visibly closes a real gap (a missing time range, a missing step, a missing column) has an actual mechanism to win on. The instruction to preserve natural reading quality outside the extractable block exists because an over-optimized page that reads as a robotic list end to end can win a snippet and still hurt on-page engagement and time-on-page for the human reader who clicks through — the goal is a page that works for both audiences at once, with only the specific answerable unit shaped for extraction, not the whole page flattened into fragments.`,
    exampleOutput: `Diagnosed format: paragraph snippet, currently held by healthline.com with a two-stat structure (surface healing time + deep healing time).

Rewritten block: "A tattoo typically takes 2-3 weeks to heal on the surface, and up to 4-6 months for the deeper skin layers underneath to fully settle. Healing speed depends most on tattoo size and aftercare consistency, not just individual skin type."

Gap closed: added the size-and-aftercare factor the current holder omits entirely, and tightened the deep-healing range to 4-6 months based on the sourced range in your section rather than the current holder's flatter "up to 6 months."`,
    verifiedAgainst: [
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-30' },
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Gemini 3 Pro.',
      },
      {
        date: '2026-08-04',
        note: 'Re-verified against Claude Sonnet 5; added the "flag if no snippet exists yet" branch after realizing the original version assumed an incumbent snippet was always present.',
      },
    ],
  },
  {
    slug: 'seo-geo-content-decay-triage',
    category: 'seo-geo',
    title: 'Triage a list of aging pages into update, merge, redirect, or delete',
    description:
      'Runs a batch of underperforming pages through a consistent decision tree using their traffic trend, freshness, and overlap with other pages — so content decay gets a defensible per-page verdict instead of a blanket "refresh everything" instinct.',
    promptText: `You are a content auditor triaging decayed pages, working from traffic and overlap data — not opinion about which pages "feel" outdated.

SITE: {{domain}}
PAGES TO TRIAGE (URL, page topic, traffic trend over the last 12 months, last substantive update date):
{{pages_to_triage}}
OTHER LIVE PAGES THAT MIGHT OVERLAP: {{potentially_overlapping_pages}}

DECISION TREE — apply this to every page, in order, and stop at the first branch that applies:

1. DELETE if the page has near-zero traffic (state your threshold assumption if none is given), covers a topic no longer relevant to the business, and has no meaningful backlinks pointing to it — deleting a page nobody links to and nobody visits costs nothing and removes thin-content dilution from the site.
2. MERGE/REDIRECT if the page's topic substantially overlaps with another live page in {{potentially_overlapping_pages}} — name the specific overlapping page, and recommend a 301 redirect into it rather than leaving two thin, competing pages live. State which of the two should survive as the merge target, based on which currently has more traffic, more backlinks, or a stronger ranking position — not simply whichever is newer.
3. UPDATE if the page still gets meaningful traffic but the content itself is stale — outdated statistics, a broken or irrelevant CTA, a screenshot of a UI that's since changed, information that's since become inaccurate. Name the specific stale element, not a generic "needs a refresh."
4. LEAVE ALONE if the page is still accurate, still gets traffic, and has no overlap — the honest default when nothing above applies, since a working page shouldn't be touched just to appear active.
5. INVESTIGATE FURTHER if traffic dropped sharply but you can't tell from the data given whether the cause is content decay, a lost backlink, an algorithm update, or a technical issue (deindexing, a broken canonical) — say so explicitly rather than guessing a content-based cause for a problem that might not be about content at all.

OUTPUT
A table: URL | Traffic trend | Last updated | Verdict | Specific reason. Group the results by verdict at the end so the update list, the merge list, and the delete list are each easy to hand off separately.`,
    variables: [
      {
        name: 'pages_to_triage',
        description:
          'A list of pages with URL, topic, 12-month traffic trend, and last substantive update date.',
        example:
          '/blog/best-crm-2023 — CRM roundup — traffic down 68% YoY — last updated Jan 2023\n/blog/crm-vs-spreadsheet — comparison — traffic flat — last updated Mar 2026\n/blog/what-is-a-crm — definition post — traffic down 40% YoY — last updated Nov 2022',
        required: true,
      },
      {
        name: 'domain',
        description: 'The site these pages belong to, for context.',
        example: 'example.com',
        required: true,
      },
      {
        name: 'potentially_overlapping_pages',
        description:
          'Other live pages that might cover similar ground, so merge candidates can be named specifically.',
        example:
          '/blog/what-is-a-crm-software — near-identical definition post published later, currently getting more traffic',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: [
      'content-decay',
      'content-pruning',
      'content-audit',
      'redirect-strategy',
      'site-maintenance',
    ],
    whyItWorks: `A fixed decision tree, applied in order, replaces a per-page gut call with a repeatable process — the actual value of triaging pages this way instead of eyeballing each one is that two different reviewers running the same data through the same tree should land on the same verdict, which matters once a site has dozens of decayed pages and several people making the calls over time. Ordering delete before merge before update matters specifically because it's the sequence that avoids the most expensive mistake in the batch: refreshing a page that should have been merged into a stronger duplicate wastes the update effort and still leaves two competing pages live afterward, so checking for overlap has to happen before checking for staleness, not after. Requiring a named cause for a traffic drop — rather than defaulting every decline to "needs a content refresh" — protects against the second most common triage mistake, which is treating a technical problem (a lost canonical, an accidental noindex, a robots.txt change, a lost high-authority backlink) as a content quality problem and refreshing copy that was never actually the cause of the drop, burning effort on a fix that won't move the metric that triggered the review in the first place. The explicit "leave alone" branch matters as a real outcome, not a placeholder, because a triage process that only ever recommends action on every page it touches has stopped triaging and started just generating busywork — some pages genuinely don't need anything done to them, and saying so is part of the honest output.`,
    exampleOutput: `/blog/best-crm-2023 | -68% YoY | Jan 2023 | UPDATE | Stale year in title and outdated pricing figures; still gets meaningful traffic despite the decline — refresh year, pricing, and screenshots rather than delete.

/blog/what-is-a-crm | -40% YoY | Nov 2022 | MERGE | Near-duplicate of /blog/what-is-a-crm-software, which is newer and currently getting more traffic — 301 redirect this page into that one.

Grouped: Update (1): best-crm-2023. Merge (1): what-is-a-crm → what-is-a-crm-software. Delete (0). Investigate further (0).`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-05' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against ChatGPT.',
      },
      {
        date: '2026-08-05',
        note: 'Re-verified against Claude Sonnet 5; reordered the decision tree so overlap/merge is checked before staleness/update, after a test run refreshed a page that should have been redirected into a stronger duplicate instead.',
      },
    ],
  },
  {
    slug: 'seo-geo-ecommerce-category-thin-content-fix',
    category: 'seo-geo',
    title:
      'Fix a thin or duplicate e-commerce category page without breaking faceted nav',
    description:
      'Diagnoses whether a category page is thin, duplicated by its own filter combinations, or genuinely under-supported, then produces real category copy and a specific indexation rule for its facets instead of a generic "write more content" fix.',
    promptText: `You are an e-commerce SEO specialist fixing a category page that isn't earning organic traffic proportional to its product count.

CATEGORY PAGE: {{category_url_and_products}}
CURRENT CATEGORY COPY, IF ANY: {{current_copy}}
FACETED FILTERS AVAILABLE ON THIS CATEGORY: {{facet_list}}
TARGET KEYWORD FOR THIS CATEGORY: {{target_keyword}}

TASK

1. DIAGNOSE THE ACTUAL PROBLEM. State plainly whether the issue is (a) thin content — a grid of products with no unique text at all, (b) facet duplication — filter combinations like ?color=red&size=m generating near-duplicate indexable URLs against the base category, or (c) both. Don't default to "needs more content" if the real problem is technical duplication a content rewrite can't fix.
2. WRITE CATEGORY COPY that earns its placement — 150-300 words positioned above or beside the product grid, written for a category-level buyer question ("what to look for when buying X"), not a rehash of individual product descriptions. It must say something a shopper couldn't get by just looking at the product grid itself: a buying consideration, a sizing note, a common mistake, a way to narrow down which type of product fits which use case.
3. RECOMMEND AN INDEXATION RULE for the facets in {{facet_list}}. For each filter type, say whether its resulting URL should be indexable, canonical back to the base category, or noindex+follow — a filter that changes the product set meaningfully and has real independent search demand (color, for a query like "red running shoes") is a stronger indexation candidate than one that doesn't (sort order, items-per-page).
4. FLAG PAGINATION HANDLING. State whether paginated category pages (?page=2, etc.) should be indexable in their own right, canonical to page 1, or handled with a "view all" alternative, based on whether {{category_url_and_products}} implies enough unique products per page to be worth indexing separately.
5. NAME ONE STRUCTURAL ELEMENT beyond copy that would help this category page specifically — a buying-guide-style FAQ block, a size chart, a comparison table across the category's own subtypes — and justify it against {{target_keyword}}'s actual intent rather than adding it reflexively.

OUTPUT
The diagnosis, the category copy in full, the facet indexation table (Filter type | Recommended treatment | Reason), the pagination recommendation, and the one structural addition.`,
    variables: [
      {
        name: 'category_url_and_products',
        description:
          'The category page URL, roughly how many products it lists, and any relevant context on how it currently performs.',
        example:
          '/shop/running-shoes — 84 products, gets some traffic on the base URL but almost none on any filtered combination',
        required: true,
      },
      {
        name: 'current_copy',
        description:
          'The existing category-page copy, if there is any. Leave blank if the page is just a product grid.',
        example: '(none — page is just a filter bar and a product grid, no text at all)',
        required: false,
      },
      {
        name: 'facet_list',
        description: 'The filters available on this category page.',
        example:
          'color, size, brand, price range, sort order (price/newest/rating), items per page',
        required: true,
      },
      {
        name: 'target_keyword',
        description: 'The primary keyword this category page should rank for.',
        example: "men's running shoes",
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'ecommerce-seo',
      'category-pages',
      'faceted-navigation',
      'thin-content',
      'duplicate-content',
      'crawl-budget',
    ],
    whyItWorks: `Category pages fail for two structurally different reasons that require entirely different fixes, and treating them as one problem is the most common mistake in e-commerce SEO advice: thin content is a copy problem solved by writing something genuinely useful, while facet duplication is a crawling and indexation problem where every filter combination generates a near-identical URL competing against the base category for the same query — no amount of category copy fixes a duplication problem, because the copy sits once on the base page while the duplicate URLs exist regardless. The indexation rule per facet type matters because not all filters are equal from a search-demand standpoint: a color filter often maps to genuine independent search volume ("red running shoes" is a real query with its own intent), while a sort-order or items-per-page parameter almost never does, so applying one blanket rule to all filters either wastes crawl budget indexing pages nobody searches for or blocks a filter combination that was quietly earning its own traffic. The instruction that category copy must say something a shopper couldn't get from the grid itself targets the specific reason most category-page copy additions fail to move rankings at all — 200 words of generic filler placed above a product grid purely to satisfy a "needs more text" checklist item reads as exactly that to both users and to any quality assessment of the page, while copy that answers a real category-level buying question earns its placement and its dwell time on its own.`,
    exampleOutput: `Diagnosis: both — the page has zero unique copy, and color/size filter combinations generate indexable URLs with near-identical product sets to the base category.

Category copy (excerpt): "Choosing a running shoe by pronation type matters more than color or brand loyalty — overpronators generally need more stability in the midsole than a neutral runner does. If you're not sure which category you fall into, a wet footprint test at home is a reliable first check before you filter by size."

Facet table: Color | Noindex, canonical to base | No independent search demand at this volume. Size | Noindex, canonical to base | Pure availability filter, not a distinct query. Brand | Indexable | Real search demand exists for "[brand] running shoes" as its own query.

Pagination: page 2+ canonical to page 1 with a "view all" link, since the category has under 100 products total and doesn't need separate indexed pages.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Opus 4.5', date: '2026-08-06' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against ChatGPT.',
      },
      {
        date: '2026-08-06',
        note: 'Re-verified against Claude Opus 4.5; split the diagnosis step into thin-content vs. facet-duplication explicitly after a draft treated both as the same problem and prescribed a content rewrite for a purely technical duplication issue.',
      },
    ],
  },
  {
    slug: 'seo-geo-google-business-profile-optimization',
    category: 'seo-geo',
    title: 'Optimize a Google Business Profile to win the local 3-pack',
    description:
      "Turns a business's raw details into a primary-category decision, a description that survives the character limit, seeded Q&A, and review-response templates — the profile-level inputs Google's own local-ranking factors actually weigh.",
    promptText: `You are a local SEO specialist optimizing a Google Business Profile, not writing generic marketing copy. Google's own local-ranking guidance names three factors — relevance, distance, and prominence — and every recommendation below should point at one of those, not at vague "more visibility."

BUSINESS: {{business_name}}
YOUR GUESS AT THE PRIMARY CATEGORY: {{primary_category_guess}}
SERVICES OR PRODUCTS OFFERED: {{services_or_products}}
LOCATION / SERVICE AREA: {{location_and_service_area}}
TARGET LOCAL SEARCH TERMS: {{target_local_keywords}}
WHAT COMPETITORS' PROFILES DO DIFFERENTLY: {{competitor_gbp_notes}}

TASK

1. PRIMARY CATEGORY. A profile allows exactly one primary category plus up to 9 secondary categories. Recommend the primary category. If a plausible alternative exists, name it and explain the specific detail that settles the choice in favor of your pick — category match is one of the most heavily weighted relevance signals for "near me" and service-type queries, ahead of nearly every other profile field. Then list up to 9 relevant secondary categories.
2. BUSINESS DESCRIPTION. Write one under the 750-character limit. Put the core service and the location in the first roughly 250 characters — that's about what shows before a visitor has to tap "more." No URLs, no phone numbers, no prices, no superlatives ("best," "#1"), no limited-time offers — profiles that read as an ad instead of a description get rejected or hidden under current guidelines.
3. Q&A SEEDING. The Q&A section is public and editable by any Google user, including competitors — an unanswered or wrongly answered question sits there hurting conversion until someone corrects it. Write 5 self-seeded Q&A pairs covering the highest-friction real questions a buyer would have before contacting {{business_name}}.
4. REVIEW RESPONSE TEMPLATES. Draft one template for a 5-star review and one for a 3-star-or-below review. Each should sound like a real owner, not a script — naturally mention the specific service and location without stuffing either in, and never offer compensation for a changed or removed review, since that violates review policy and risks profile suspension.
5. POST IDEAS. Suggest 3 posts (What's New / Offer / Event style) tied to {{services_or_products}}, each under 1,500 characters with one clear next step.
6. NAP CONSISTENCY FLAG. Note anything in the inputs above likely to create a Name/Address/Phone mismatch against how this business is probably already listed elsewhere — inconsistent NAP undermines the prominence signal even when the profile itself is fully optimized.

OUTPUT
Structured sections matching the six tasks above, in order.`,
    variables: [
      {
        name: 'business_name',
        description: 'The exact legal/trading name as it should appear on the profile.',
        example: 'Denver Rapid Plumbing',
        required: true,
      },
      {
        name: 'primary_category_guess',
        description:
          'Your current best guess at the primary category, so the model corrects or confirms rather than starting blind.',
        example: 'Plumber',
        required: true,
      },
      {
        name: 'services_or_products',
        description: 'The core services or products this business actually sells.',
        example: 'emergency pipe repair, water heater installation, drain cleaning',
        required: true,
      },
      {
        name: 'location_and_service_area',
        description:
          'Whether this is a storefront address or a service-area business, and the area covered.',
        example:
          'service-area business, no walk-in storefront, covers Denver metro within a 25-mile radius',
        required: true,
      },
      {
        name: 'target_local_keywords',
        description: 'The specific local search terms you want to show up for.',
        example:
          '24 hour plumber near me, emergency plumber Denver, burst pipe repair Denver',
        required: true,
      },
      {
        name: 'competitor_gbp_notes',
        description:
          "Anything noticed about a competitor's profile doing something differently — categories, posts, review volume.",
        example:
          'top-ranking competitor lists both "Plumber" and "Drainage Service" and posts weekly',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'google-business-profile',
      'local-seo',
      'local-pack',
      'gbp-optimization',
      'map-pack',
    ],
    whyItWorks: `Google's own "how local results are ranked" documentation names exactly three factors — relevance, distance, and prominence — and independent local-ranking-factor research has consistently found primary category to be one of the single heaviest-weighted relevance signals, ahead of the description text, which Google has stated doesn't directly influence category matching at all. That's why the primary-category decision comes first and gets an explicit justification rather than being treated as an afterthought, while the description is scoped to conversion and to serving as raw material for the AI-generated business-overview summaries Google now surfaces on some profiles and in Maps — still valuable, just for a different mechanism than direct ranking. The Q&A seeding step exists because that section is genuinely public-editable by anyone with a Google account, including a competitor — a stale, wrong, or maliciously planted answer sits visible and hurting conversion until someone with edit access notices and corrects it, which makes proactive seeding a real defensive move, not a nice-to-have. The review-response guardrail against offering anything for a changed review isn't stylistic caution about tone — it's a direct citation of Google's stated policy ground for profile suspension, and a template that violates it risks the whole profile, not just one review thread.`,
    exampleOutput: `PRIMARY CATEGORY: "Emergency Plumber" over the more generic "Plumber" — the target terms ("24 hour plumber near me," "burst pipe repair Denver") are urgency-specific, and category match against that phrasing outweighs the broader term's higher search volume. Secondary categories: Plumber, Drainage Service, Water Damage Restoration Service.

DESCRIPTION (312 characters): "24/7 emergency plumbing in Denver, CO — burst pipes, no heat, and water damage calls answered live, day or night. Licensed and insured, on-site within the hour for most Denver metro addresses..." [continues with credentials and service list before the 750-character limit].

Q&A seeded: "Do you charge extra for night calls?" / "No overtime surcharge — the emergency rate is flat regardless of time of day."

NAP flag: confirm "Denver Rapid Plumbing" (not "Denver Rapid Plumbing LLC" or any variant) matches the website footer and every existing directory listing exactly.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: "Initial publish, anchored to Google's documented relevance/distance/prominence local-ranking factors and the 750-character description limit.",
      },
    ],
  },
  {
    slug: 'seo-geo-core-web-vitals-fix-map',
    category: 'seo-geo',
    title: 'Turn a Core Web Vitals report into a ranked, specific fix list',
    description:
      "Maps raw LCP, INP, and CLS numbers to their most likely root cause on the specific page type given, then ranks fixes by expected score movement per unit of dev effort — instead of a generic 'optimize images and minify JS' checklist that ignores what's actually failing.",
    promptText: `You are a web performance engineer translating a Core Web Vitals report into fixes a developer can actually implement, ranked by impact — not a generic performance checklist copy-pasted regardless of what's actually failing.

PAGE TYPE AND STACK: {{page_type_and_stack}}
CORE WEB VITALS REPORT (LCP, INP, CLS — field data if available, lab data otherwise, note which): {{cwv_report}}
KNOWN CONSTRAINTS: {{known_constraints}}

TASK

1. TRIAGE EACH METRIC AGAINST ITS THRESHOLD. State whether LCP, INP, and CLS each fall in the "good," "needs improvement," or "poor" range per Google's published thresholds, and name which metric is furthest from good — that's the one to fix first regardless of which feels most familiar to work on.
2. NAME THE LIKELY ROOT CAUSE per failing metric, specific to {{page_type_and_stack}}, not a generic list of possible causes:
   - LCP: is the largest element likely an unoptimized hero image, a render-blocking font or stylesheet, a slow server response (TTFB), or client-side rendering delaying when the element even exists in the DOM?
   - INP: is the likely cause a long JavaScript task blocking the main thread on interaction, an oversized event handler doing synchronous work that could be deferred, or third-party scripts (analytics, chat widgets, ad tags) consuming the main thread at the moment of interaction?
   - CLS: is the likely cause images or ads without reserved dimensions, a web font swap causing text reflow, or content injected above existing content after initial load (a banner, a cookie notice) without space reserved for it?
3. RANK FIXES by estimated score recovery versus implementation effort, given {{known_constraints}}. A fix that's high-impact but blocked by a stated constraint (no access to the CDN config, a CMS that doesn't allow custom script loading control) should be flagged as blocked, with the best available workaround, rather than recommended as if unconstrained.
4. DISTINGUISH FIELD FROM LAB DATA if both exist: field data (real user CrUX data) reflects actual user experience and is what affects the Google ranking signal directly; lab data (Lighthouse, PageSpeed Insights single-run) is useful for debugging but can miss real-world variance like slow user networks or older devices. If only lab data is available, say so and note the fixes are a best estimate pending real field data.
5. NAME WHAT WON'T MOVE THE NEEDLE. Explicitly call out any commonly recommended performance fix (minifying an already-small file, further image compression on an already-optimized asset) that would cost dev time here without meaningfully affecting the specific metric that's actually failing.

OUTPUT
A table: Metric | Current status | Likely root cause | Recommended fix | Estimated impact (high/med/low) | Effort (high/med/low). Follow with which fix to do first and why, and the field-vs-lab-data caveat if relevant.`,
    variables: [
      {
        name: 'page_type_and_stack',
        description: 'What kind of page this is and what it runs on.',
        example:
          'a product listing page on a Shopify store using a third-party theme, roughly 40 products with images per page',
        required: true,
      },
      {
        name: 'cwv_report',
        description:
          'The actual LCP, INP, and CLS numbers, noting whether they are field (CrUX) or lab (Lighthouse/PSI) data.',
        example:
          'PageSpeed Insights field data (CrUX, 28-day): LCP 4.2s (poor), INP 340ms (needs improvement), CLS 0.28 (poor)',
        required: true,
      },
      {
        name: 'known_constraints',
        description:
          'Anything that limits which fixes are actually implementable right now.',
        example:
          "can't modify the theme's core template files directly (would break future theme updates), but can add custom CSS/JS via the theme's app-block system",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'core-web-vitals',
      'page-speed',
      'lcp',
      'inp',
      'cls',
      'technical-seo',
      'performance',
    ],
    whyItWorks: `Core Web Vitals are a page-experience ranking signal, but the specific mechanism worth knowing is that Google uses field data — real Chrome User Experience Report (CrUX) numbers from actual visitors — for the ranking signal itself, while lab data from a single Lighthouse or PageSpeed Insights run is a debugging tool that can miss real-world variance entirely, such as the slow network or older device a meaningful share of real visitors are using; treating a good lab score as proof the ranking signal is fine is a common and avoidable mistake this prompt is structured to catch by forcing the distinction explicitly. Routing each metric through a specific, stack-aware root-cause branch instead of a generic "optimize images, minify JS, use a CDN" checklist matters because the three metrics have almost entirely disjoint causes — a CLS problem from an unreserved ad slot is invisible to an LCP-focused image-compression pass, and applying image-optimization effort to a page whose real problem is a render-blocking font wastes the fix on the wrong metric while leaving the actual failing one untouched. Explicitly ranking by impact against effort, and against stated real-world constraints like a CMS or theme system a developer can't fully control, keeps the output from being a wish list — a "high impact" fix that requires access nobody has is functionally useless without a stated workaround, and naming which common fixes won't move the needle here specifically stops a team from burning a sprint on further-compressing an asset that was never the bottleneck.`,
    exampleOutput: `LCP | Poor (4.2s) | Likely root cause: hero product image served unoptimized and not preloaded, plus a render-blocking custom font | Add fetchpriority="high" and preload the LCP image; swap to font-display: swap | High impact / Low effort | FIRST FIX

INP | Needs improvement (340ms) | Third-party chat widget script executing synchronously on page load, blocking the main thread during early interactions | Defer the chat widget script to load after first interaction or via a lazy-load trigger | Medium impact / Medium effort (blocked without direct script-tag control — workaround: load via the theme's app-block deferred-script slot)

CLS | Poor (0.28) | Product grid images have no reserved aspect-ratio box, causing layout shift as each loads | Add explicit width/height or aspect-ratio CSS to the product image containers | High impact / Low effort

Do first: the LCP preload fix — highest impact, lowest effort, and LCP is furthest from its "good" threshold of the three.
Won't help: further JPEG compression on the hero image — it's already reasonably sized; the real LCP delay is the missing preload hint and the blocking font, not image weight.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-04' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against ChatGPT.',
      },
      {
        date: '2026-08-04',
        note: 'Re-verified against Claude Sonnet 5; added the explicit field-vs-lab-data distinction after a draft treated a single Lighthouse run as equivalent to the CrUX-based ranking signal.',
      },
    ],
  },
  {
    slug: 'seo-geo-migration-redirect-map',
    category: 'seo-geo',
    title: 'Build a 301 redirect map for a site migration without losing rankings',
    description:
      'Maps every old URL to its correct new destination by matching topic and intent rather than URL-structure guesswork, flags every 1-to-many and many-to-1 case that needs a human decision, and calls out chains and loops before they ship.',
    promptText: `You are a technical SEO managing URL equity through a site migration. A wrong or missing redirect on a page that currently ranks is one of the most common causes of a post-migration traffic collapse, so precision here matters more than speed.

MIGRATION TYPE: {{migration_type}}
OLD URL LIST (with topic and current traffic/ranking importance if known):
{{old_urls}}
NEW URL STRUCTURE OR NEW SITE'S PAGE LIST:
{{new_urls}}

TASK

1. MAP EACH OLD URL to the single best-matching new URL by topic and search intent, not by superficial URL-path similarity — a URL restructure often means /services/seo maps to /solutions/search-optimization despite sharing no path segments at all.
2. FLAG 1-TO-MANY CASES. If an old URL's content has been split across multiple new pages, list every plausible destination and recommend the one most topically central as the 301 target, but state explicitly that this needs a human decision if the split is genuinely ambiguous — don't silently pick one and hide the ambiguity.
3. FLAG MANY-TO-1 CASES. If several old URLs would all map to a single new page (several old blog posts consolidated into one pillar page, for example), confirm this is intentional consolidation and not an accidental collision, and note that all of them redirecting to the same destination is expected here, not a mistake to fix.
4. FLAG ORPHANS. Any old URL with no reasonable match in the new structure at all should be flagged explicitly, with a recommendation to either redirect to the closest parent category page or, if the content is genuinely gone, redirect to a relevant hub rather than leaving it to 404 — a hard 404 on a page that used to rank forfeits its link equity entirely instead of passing any of it forward.
5. CHECK FOR CHAINS. If any new URL in {{new_urls}} is itself scheduled to redirect elsewhere (a page that's new today but already planned to be replaced), flag the chain so the map can point directly to the final destination instead of hopping through an intermediate redirect, since a chain of 301s adds latency and, beyond a couple of hops, risk of a search engine not following the full chain.
6. HIGH-VALUE PRIORITY FLAG. Mark any old URL noted as high-traffic or high-ranking-importance so its redirect gets manually verified first and separately from the bulk of the map, since a mistake there costs disproportionately more than a mistake on a low-traffic page.

OUTPUT
A table: Old URL | New URL (target) | Match type (1-to-1 / 1-to-many / many-to-1 / orphan) | Priority | Notes. Close with a summary count of each match type and a list of anything flagged for human decision.`,
    variables: [
      {
        name: 'migration_type',
        description: 'What kind of migration this is.',
        example:
          'full replatform from WordPress to a custom Next.js site, with a new information architecture',
        required: true,
      },
      {
        name: 'old_urls',
        description:
          'The list of old URLs with their topic and, if known, traffic or ranking importance.',
        example:
          '/services/seo — SEO service page, high traffic\n/blog/seo-tips-2022 — old tips post, low traffic\n/blog/seo-tips-2023 — newer tips post, medium traffic\n/about/team — team page, low traffic',
        required: true,
      },
      {
        name: 'new_urls',
        description: 'The new site structure or page list old URLs need to map into.',
        example:
          '/solutions/search-optimization — new SEO service page\n/insights/seo-strategy-guide — new consolidated evergreen guide\n/company/our-team — new team page',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'site-migration',
      '301-redirects',
      'url-mapping',
      'technical-seo',
      'link-equity',
    ],
    whyItWorks: `Matching old URLs to new destinations by topic and intent rather than path-structure similarity is the difference that actually prevents most migration traffic loss, because the whole reason a site migrates its URL structure is usually that the old structure no longer reflects how the business or content is organized — matching by superficial path similarity in that exact situation reliably produces wrong mappings, since the old and new paths were never designed to line up in the first place. Explicitly separating 1-to-many and many-to-1 cases from clean 1-to-1 matches matters because these are the cases where an automated or rushed redirect map most often goes wrong silently: a many-to-1 consolidation that's actually intentional looks identical, on a spreadsheet, to several accidental collisions onto the wrong page, and a script or a fast pass through the list won't distinguish "this is planned" from "this is a mistake" without a human flag calling out the difference explicitly. The orphan-handling instruction — redirect to a relevant parent rather than let a previously-ranking URL hard-404 — targets a specific and costly failure mode: a 404 on a URL that used to carry real link equity and ranking signal forfeits all of it outright, while even an imperfect redirect to a topically related parent page passes some of that equity forward, which is a meaningfully better outcome even when it isn't a perfect 1-to-1 match. Flagging redirect chains matters for a more mechanical reason — each additional hop adds latency for every visitor and search engine crawler that follows it, and a chain beyond a couple of hops risks not being followed to its final destination at all, so pointing every redirect at its true final URL directly, rather than at an intermediate page that itself redirects onward, is both faster and safer.`,
    exampleOutput: `/services/seo | /solutions/search-optimization | 1-to-1 | HIGH PRIORITY | Direct topical match despite unrelated path structure; verify manually given high current traffic.

/blog/seo-tips-2022 + /blog/seo-tips-2023 | /insights/seo-strategy-guide | many-to-1 | Medium | Intentional consolidation of two overlapping posts into one evergreen guide — confirm this is the plan, not an accidental collision.

/about/team | /company/our-team | 1-to-1 | Low | Straightforward match.

Summary: 2 clean 1-to-1, 1 many-to-1 (confirmed intentional), 0 orphans, 0 chains detected. No cases requiring further human decision beyond the consolidation confirmation above.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against ChatGPT.',
      },
      {
        date: '2026-08-05',
        note: 'Re-verified against Claude Sonnet 5; added the redirect-chain check after a generated map pointed several old URLs at a new page that was itself scheduled to redirect elsewhere.',
      },
    ],
  },
  {
    slug: 'seo-geo-keyword-cannibalization-diagnosis',
    category: 'seo-geo',
    title: 'Diagnose which of your own pages are competing against each other',
    description:
      'Compares multiple ranking pages targeting overlapping keywords, determines whether Google is genuinely confused about which one to rank or whether the overlap is coincidental, and recommends a specific consolidation or differentiation fix per pair.',
    promptText: `You are diagnosing keyword cannibalization — cases where a site's own pages compete against each other for the same query, splitting ranking signal instead of one page compounding it.

DOMAIN: {{domain}}
PAGES IN QUESTION (URL, target keyword each was built for, current approximate ranking position if known):
{{pages_in_question}}
RANKING VOLATILITY OBSERVED: {{volatility_notes}}

TASK

1. CONFIRM OR RULE OUT CANNIBALIZATION. True cannibalization shows a specific pattern: multiple pages from the same site ranking for the same or very similar query, with rankings that swap back and forth between them over time rather than one page settling into a stable position — that swapping is the actual signal, not just topical overlap. If {{volatility_notes}} doesn't show swapping, or if the pages genuinely serve different intents despite keyword overlap (a comparison page and a single-product review, for instance), say so and rule cannibalization out rather than assuming it because the keywords look similar.
2. FOR EACH CONFIRMED PAIR, determine which page is the stronger candidate to keep as the primary target — based on current ranking position, backlink profile, traffic, and content depth, not simply whichever was published more recently.
3. RECOMMEND THE FIX per pair, choosing between:
   - CONSOLIDATE: merge the weaker page's unique content into the stronger one and 301 redirect the weaker page, when the two pages genuinely serve the same intent and splitting them was a mistake to begin with.
   - DIFFERENTIATE: keep both pages live but sharpen each one's targeting so they stop overlapping — retarget the weaker page to a genuinely distinct sub-intent or long-tail variant, rewrite its title and H1 to reflect that, and adjust internal links so each page is linked to with anchor text matching its own distinct target rather than both pages.
   - LEAVE AS-IS if the overlap is minor and not causing measurable swapping or a shared traffic ceiling.
4. NAME THE INTERNAL-LINKING CONTRIBUTION. Check whether internal links from elsewhere on the site are pointing to both competing pages with similar anchor text — that reinforces the confusion signal, and fixing internal linking is sometimes the actual fix even without touching the pages' content at all.
5. STATE THE EXPECTED OUTCOME of your recommended fix in plain terms — one consolidated page usually outperforms two competing ones combined, but say so explicitly rather than leaving the reader to assume it.

OUTPUT
A table: Page pair | Cannibalization confirmed? | Stronger candidate | Recommended fix | Internal-linking note. Close with the overall expected outcome.`,
    variables: [
      {
        name: 'pages_in_question',
        description:
          'The URLs suspected of competing, each with its intended target keyword and current ranking if known.',
        example:
          '/blog/best-running-shoes — target: best running shoes — position 8\n/blog/top-running-shoes-2026 — target: best running shoes for 2026 — position 11',
        required: true,
      },
      {
        name: 'domain',
        description: 'The site these pages belong to.',
        example: 'example.com',
        required: true,
      },
      {
        name: 'volatility_notes',
        description:
          "What you've observed about ranking behavior over time for the shared keyword(s) — this is the actual evidence for or against cannibalization.",
        example:
          'over the last 3 months, position 8 and position 11 have swapped between the two URLs on 4 separate rank-tracker snapshots, with neither page holding a stable position',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: [
      'keyword-cannibalization',
      'rank-tracking',
      'content-consolidation',
      'technical-seo',
      'internal-linking',
    ],
    whyItWorks: `The single most reliable signal for genuine cannibalization is ranking volatility where two pages swap position for the same query over time, rather than simple topical or keyword overlap — which is why the diagnosis step is built around that specific evidence and explicitly rules cannibalization out when it's absent, since a huge amount of "cannibalization" flagged by casual review is actually just two pages that happen to share vocabulary while serving genuinely different intents, and consolidating those unnecessarily destroys real content diversity for no ranking benefit. Choosing between consolidation and differentiation rather than defaulting to "always merge" matters because merging is the wrong fix when two pages could serve distinct sub-intents with sharper targeting — collapsing a comparison page and a single-product review into one page because they share a keyword loses the reason two pages existed in the first place, while genuinely redundant pages built around the identical intent should merge because a single stronger page concentrating all the ranking signal reliably outperforms two weaker pages splitting it, which is a documented pattern in how search engines allocate ranking weight per query rather than per domain. Checking internal linking separately from the pages' own content is the step most cannibalization advice skips entirely, and it matters because internal links with matching anchor text pointing at both competing pages actively reinforce the exact confusion a search engine is already having about which page to rank — sometimes the actual fix is retargeting anchor text sitewide, which costs far less than a content merge and can resolve the swapping on its own.`,
    exampleOutput: `Page pair | Confirmed? | Stronger candidate | Fix | Internal-linking note
/blog/best-running-shoes vs /blog/top-running-shoes-2026 | Yes — 4 rank-tracker snapshots show position swapping over 3 months | best-running-shoes (older, more backlinks, more total traffic) | CONSOLIDATE — merge the 2026-specific product picks into best-running-shoes, 301 redirect the newer page | 6 internal links use "best running shoes" anchor text pointing at both pages — redirect the anchor text to point solely at the surviving page

Expected outcome: the consolidated page should stabilize above position 8 within a few weeks of re-crawl, since it will carry the combined backlink and relevance signal that was previously split across two competing URLs.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-03' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-27' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against ChatGPT.',
      },
      {
        date: '2026-08-03',
        note: 'Re-verified against Claude Sonnet 5; added the explicit "rule out cannibalization" branch after a test run assumed cannibalization from keyword overlap alone with no volatility evidence given.',
      },
    ],
  },
  {
    slug: 'seo-geo-ai-crawler-access-audit',
    category: 'seo-geo',
    title: 'Audit whether robots.txt and llms.txt actually let AI crawlers in',
    description:
      'A line-by-line robots.txt and llms.txt audit that applies the real AI-crawler precedence rules — most-specific User-agent group wins, longest matching path wins — so you get an exact per-bot verdict instead of a guess.',
    promptText: `You are an AI-crawler access auditor. Robots.txt directives are resolved by two rules, not by reading top to bottom: (1) the most specific matching User-agent group wins over User-agent: *, and (2) within a group, the longest matching Disallow/Allow path wins. Apply those two rules literally — do not guess or summarize casually, and do not assume a blanket rule under User-agent: * applies to a bot that has its own explicit group elsewhere in the file.

DOMAIN: {{domain}}
ROBOTS.TXT:
{{robots_txt_content}}
LLMS.TXT:
{{llms_txt_content}}

TASK

For each of the following AI crawlers, determine whether it can currently fetch {{domain}}'s homepage and at least one deeper path if one is provided, and cite the exact directive (group and line) that decides it:

1. GPTBot (OpenAI — model training)
2. OAI-SearchBot (OpenAI — ChatGPT search and citations; a separate bot from GPTBot with its own precedence)
3. PerplexityBot (Perplexity — live answers)
4. ClaudeBot (Anthropic — training and Claude's web search)
5. Google-Extended (Google — Gemini and AI Overviews grounding, separate from classic Googlebot)
6. CCBot (Common Crawl — feeds many downstream AI datasets that never crawl a site directly themselves)

For each bot, walk through the precedence logic explicitly: does this bot have its own User-agent group, or does it fall through to the wildcard group? Within whichever group applies, which specific Disallow or Allow line is longest and therefore wins? State the verdict only after showing that reasoning, not before it.

Then check {{llms_txt_content}}: does a valid /llms.txt exist? If so, does it point to real, live pages, or to anything that itself 404s or is blocked in robots.txt — a listed page that a crawler can't actually reach is worse than not listing it, since it wastes the crawler's attention and signals an unmaintained file. If no llms.txt exists, name the three pages on {{domain}} most worth listing first, based on what the domain and its likely traffic pages are.

OUTPUT
A table: Bot | Purpose (training / live search / both) | Allowed or Blocked | Deciding rule (quote the exact line) | One-line fix if blocked. Then the llms.txt verdict and, if missing, the three suggested first entries.`,
    variables: [
      {
        name: 'domain',
        description: "The site's root domain or URL being audited.",
        example: 'https://example.com',
        required: true,
      },
      {
        name: 'robots_txt_content',
        description:
          "The full, raw text of the site's /robots.txt file — paste it exactly, including comments.",
        example:
          'User-agent: *\nDisallow: /private/\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: PerplexityBot\nAllow: /blog/\nDisallow: /',
        required: true,
      },
      {
        name: 'llms_txt_content',
        description:
          'The full raw text of /llms.txt if one exists. Leave as "none found" if the site doesn\'t have one.',
        example: 'none found',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: [
      'robots-txt',
      'llms-txt',
      'ai-crawlers',
      'geo-audit',
      'gptbot',
      'technical-seo',
    ],
    whyItWorks: `Robots.txt precedence is famously counter-intuitive: most site owners assume a blanket Disallow: / under User-agent: * blocks everything, when in fact a bot with its own explicit group is entirely unaffected by it, and ties within a group are broken by whichever path is longest, not whichever line comes first in the file. Forcing the model to walk through that reasoning explicitly before stating a verdict, rather than asserting a conclusion first, turns a guess into a checkable claim — and separating GPTBot (training) from OAI-SearchBot (live ChatGPT citations) surfaces the single most common self-inflicted AI-invisibility mistake, which is blocking the training bot on purpose while never noticing the search bot got blocked along with it, since the two are genuinely separate User-agent strings a site owner has to know to distinguish. The llms.txt reachability check matters for a reason that's easy to miss: a listed page that itself 404s or sits behind a robots.txt block is arguably worse than having no llms.txt at all, because it wastes a crawler's limited attention on a dead link and signals the file hasn't been maintained since whatever page it once pointed to changed — a file's mere existence isn't the thing that matters, its accuracy against the live site is.`,
    exampleOutput: `| Bot | Purpose | Status | Deciding rule | Fix |
|---|---|---|---|---|
| GPTBot | Training | Blocked | User-agent: GPTBot / Disallow: / | Remove or narrow the GPTBot-specific Disallow if training inclusion is wanted |
| OAI-SearchBot | ChatGPT search citations | Allowed | No OAI-SearchBot-specific rule exists; falls through to User-agent: * which has no blanket Disallow | None needed |
| PerplexityBot | Live answers | Allowed for /blog/, blocked elsewhere | User-agent: PerplexityBot / Allow: /blog/ wins over the same group's Disallow: / for that specific path (longest match) | Add Allow lines for other paths you want cited |

No /llms.txt found. Suggested first three entries: /pricing, /blog, /docs.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-22' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish. Added the explicit "quote the deciding line and show the reasoning first" instruction after testing showed models will otherwise state a verdict without actually checking group-specificity or path-length precedence.',
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'seo-geo-faq-answer-first-schema',
    category: 'seo-geo',
    title: 'Turn raw FAQ content into schema and copy AI engines can cite',
    description:
      'Turns rough Q&A content into answer-first visible copy and valid FAQPage JSON-LD, structured for AI engines that still parse FAQ schema even after Google retired the FAQ rich result.',
    promptText: `You are an AEO editor. Google retired FAQPage rich results on 7 May 2026, but AI answer engines — ChatGPT, Claude, Perplexity, Google AI Overviews — still parse FAQPage JSON-LD independently of whether Google renders a visual rich result from it, and they still quote well-structured Q&A prose directly. Your job is to make this content easy for both to lift.

PAGE TOPIC: {{page_topic}}
RAW Q&A: {{raw_qa_content}}
TARGET ANSWER LENGTH: {{max_answer_length}} characters (if blank, keep each answer under roughly 300 characters)

RULES FOR EACH ANSWER
- The first sentence is the complete direct answer — no "great question," no throat-clearing preamble.
- One claim per answer. If the raw content bundles two ideas together, split it into two separate Q&A pairs rather than one answer covering both.
- The answer must be understandable entirely on its own, with no pronoun referring back to the question ("it," "this," "that") — restate the subject explicitly every time.
- Keep any numbers, timeframes, or conditions from the source content exactly as given — never invent or round them, and never soften a hard number into a vaguer range that wasn't in the source.
- If the raw content genuinely doesn't answer the question it's paired with, say so rather than writing a plausible-sounding answer that goes beyond what was actually provided.

OUTPUT
1. The cleaned Q&A as answer-first visible copy — what a human reads on the page.
2. The equivalent schema.org FAQPage JSON-LD block, one Question/acceptedAnswer pair per Q&A, ready to paste inside a script tag with type application/ld+json.
3. A one-line flag for any answer you had to leave incomplete because the source didn't actually contain the information needed to answer it fully.`,
    variables: [
      {
        name: 'page_topic',
        description: 'What the page or section is about, in a few words.',
        example: 'Return and refund policy for a DTC skincare brand',
        required: true,
      },
      {
        name: 'raw_qa_content',
        description:
          'Your existing questions and answers, in any rough form — bullet list, transcript, support-doc copy.',
        example:
          'Q: Can I return an opened product? A: Yes within 30 days if... Q: How long do refunds take? A: 5-7 business days...',
        required: true,
      },
      {
        name: 'max_answer_length',
        description:
          'Target character length per answer, if you want one enforced. Leave blank for no hard limit.',
        example: '300',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity', 'Google AI Overviews'],
    tags: ['faq-schema', 'structured-data', 'json-ld', 'answer-first', 'aeo'],
    whyItWorks: `An answer engine that retrieves a chunk of text and quotes it can only quote what stands alone — a chunk opening with "it depends on..." with no restated subject is unusable out of context, which is why answer-first, pronoun-free, single-claim answers are the actual retrievable unit here, not a style preference layered on top. FAQPage schema still matters even though Google retired the FAQ rich result on 7 May 2026, because AI engines parse structured data independently of whether Google chooses to render it as a visual snippet — the schema and the rich result were always two separate consumers of the same markup, and only one of those consumers stopped using it. The never-invent-numbers rule, and the explicit instruction to flag an answer the source genuinely doesn't support rather than complete it plausibly, matters more here than almost anywhere else in this category: a rewrite task framed around "make this more citable" is a direct incentive for a model to fabricate a supporting detail that sounds right, and this is precisely the surface — a structured, machine-parsed answer block — where a fabricated number gets repeated as fact by whatever engine cites it next, so the flag exists to catch that failure before it ships.`,
    exampleOutput: `Q: Can I return an opened product?
A: Yes — opened skincare products can be returned within 30 days of delivery for a full refund.

Q: How long do refunds take to process?
A: Refunds are issued within 5-7 business days of the returned item reaching our warehouse.

JSON-LD:
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I return an opened product?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — opened skincare products can be returned within 30 days of delivery for a full refund."
      }
    }
  ]
}`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-25' },
      {
        tool: 'Google AI Overviews',
        version: 'Gemini 3.0 grounding',
        date: '2026-07-25',
      },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: "Initial publish, dated to Google's 7 May 2026 FAQ rich-result retirement so the prompt explains why FAQ schema still matters instead of assuming it earns a visual Google rich result.",
      },
    ],
    relatedToolSlug: 'faq-schema-generator',
  },
  {
    slug: 'seo-geo-citable-claim-rewrite',
    category: 'seo-geo',
    title: 'Rewrite a vague claim into the exact sentence AI engines quote',
    description:
      'Rewrites one vague, adjective-heavy paragraph into a single specific, self-contained, quotable claim — the exact unit AI answer engines lift and attribute, as opposed to generic marketing language with nothing verifiable to quote.',
    promptText: `You are a GEO copy editor. Your only job is to turn one vague paragraph into one specific, self-contained, quotable claim — the unit AI answer engines (Perplexity, Google AI Overviews, ChatGPT) actually lift and attribute, as opposed to generic marketing language, which has nothing verifiable to quote.

CLAIM TO MAKE CITABLE: {{topic_or_claim}}
CURRENT DRAFT: {{vague_paragraph}}
SUPPORTING DATA: {{supporting_data_or_source}}

REWRITE RULES
1. Sentence one states the claim directly, using the concrete number, date, or named entity from the supporting data. If no supporting data was given, write the sentence with a placeholder in brackets instead of inventing a figure, and say so explicitly rather than quietly filling the gap.
2. One idea only — no second claim riding along in the same sentence or paragraph, even one that seems related.
3. Delete unfalsifiable adjectives — "industry-leading," "best-in-class," "world-class" — unless followed immediately by the specific evidence that earns them.
4. Keep it under 50 words total, so it can be extracted and quoted whole without needing to be trimmed by whatever engine lifts it.
5. The paragraph must make sense with zero surrounding context — no "this," "it," or "our approach" without restating the actual subject.
6. If the supporting data only partially backs the claim — a real number but for a different time period than stated, for instance — flag the mismatch rather than smoothing over it.

OUTPUT
The rewritten paragraph, followed by one line flagging anything you had to bracket or partially back because no complete, matching data was supplied.`,
    variables: [
      {
        name: 'topic_or_claim',
        description: 'The specific claim or fact you want AI engines to be able to cite.',
        example: 'Our checkout redesign cut cart abandonment',
        required: true,
      },
      {
        name: 'vague_paragraph',
        description:
          'The existing draft — usually marketing prose with no numbers or dates.',
        example:
          'We pride ourselves on delivering industry-leading checkout experiences that customers love.',
        required: true,
      },
      {
        name: 'supporting_data_or_source',
        description:
          "A real stat, date, or source that backs the claim. Leave blank if you don't have one yet — the rewrite flags where one is needed instead of inventing it.",
        example:
          'Cart abandonment dropped from 68% to 51% between Feb and May 2026, per internal Shopify analytics',
        required: false,
      },
    ],
    targetTools: ['Perplexity', 'Google AI Overviews', 'ChatGPT', 'Claude'],
    tags: ['citable-content', 'geo-copywriting', 'specificity', 'quotability', 'aeo'],
    whyItWorks: `Answer engines are far more likely to quote a sentence built around a verifiable number, date, or proper noun, because it reads as a checkable fact rather than an opinion — "industry-leading" has nothing for a citation to point at, while "cart abandonment dropped from 68% to 51% between Feb and May 2026" is a claim someone could go verify against the source. The 50-word ceiling roughly matches how much text an answer engine tends to lift whole into a citation snippet rather than paraphrase down, so a claim engineered to exceed that length is optimizing for a shape the engine is statistically less likely to use intact. The bracket-instead-of-invent rule, and the explicit instruction to flag a partial or mismatched data match rather than smooth over it, exist because a prompt engineered to make text sound more citable is otherwise a direct incentive for a model to fabricate a plausible stat or quietly stretch a real one to fit — the exact failure this whole category has to guard against, since a fabricated number that gets cited doesn't just fail to help, it actively misinforms whoever reads the citation downstream.`,
    exampleOutput: `Before: "We pride ourselves on delivering industry-leading checkout experiences that customers love."

After: "A checkout redesign cut cart abandonment from 68% to 51% between February and May 2026, per internal Shopify analytics."

No brackets needed — supporting data was supplied, matched the claimed time period exactly, and was used as given.`,
    verifiedAgainst: [
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-07-28' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish. Added the "bracket instead of invent" rule after early drafts of this prompt fabricated a plausible-sounding stat when none was supplied.',
      },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'seo-geo-live-fetch-crawlability-test',
    category: 'seo-geo',
    title: 'Check whether ChatGPT and Perplexity can see a specific page right now',
    description:
      'A direct test that forces ChatGPT or Perplexity to use their live browsing tool on one exact URL and prove it with a verbatim title and heading quote, instead of answering from stale training data.',
    promptText: `Use your live browsing or search tool now — do not answer from memory or training data. If you cannot fetch the URL live, say so plainly instead of guessing or answering as if you had.

URL TO CHECK: {{page_url}}

Fetch this exact URL right now and report:

1. Can you access it — yes or no. If no, state the exact error: blocked by robots.txt, a 404, a timeout, JavaScript-only content with nothing present in the initial HTML, a login wall, or anything else specific — not a vague "couldn't access it."
2. Quote the literal page title tag and the first visible heading, verbatim, in quotation marks. This is the actual proof of a live fetch — a model without real access cannot reliably reproduce those exact strings, so a paraphrase here instead of a verbatim quote is itself a signal something didn't work as claimed.
3. Check each of these expected facts and confirm present / not found / contradicted, one at a time, rather than a single blanket verdict: {{expected_key_facts}}
4. State today's date as you understand it while performing this fetch, so this result isn't confused with a cached or training-data answer that reflects an earlier point in time.
5. If the page redirected before you reached final content, name the redirect chain — the original URL requested versus where you actually landed — since a redirect changes what "this page" means for the rest of the report.

Do not soften a "not found" into "likely" or "probably" — report exactly what you could and couldn't retrieve, and don't fill a gap with a plausible guess dressed up as an observation.`,
    variables: [
      {
        name: 'page_url',
        description:
          "The exact URL to test — not the homepage unless that's genuinely what you mean to check.",
        example: 'https://example.com/pricing',
        required: true,
      },
      {
        name: 'expected_key_facts',
        description:
          '2-3 specific facts that should appear if the page is genuinely being fetched right now (a price, a heading, a date) — comma-separated.',
        example:
          'starting price is $49/month, page has a heading called "Simple, transparent pricing", last updated July 2026',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Perplexity'],
    tags: [
      'crawlability-check',
      'live-fetch-test',
      'chatgpt-search',
      'perplexity',
      'hallucination-check',
    ],
    whyItWorks: `A chat model without an active browsing or search call will often answer confidently from stale training data rather than admit it can't see the live page — the exact trap this category most needs to catch, since the model's default failure mode isn't refusing to answer, it's answering fluently and wrongly. Forcing it to quote the literal title tag and first heading verbatim, rather than describe or paraphrase the page, is a built-in hallucination check with real teeth: a model that hasn't actually fetched the page cannot reliably produce those exact strings, so a paraphrase where a verbatim quote was asked for is itself diagnostic, independent of whatever confident prose surrounds it. Naming the redirect chain separately matters because a page that 301s somewhere else means "this page" silently became a different page partway through the check — a report that answers about the final destination while calling it the original URL has quietly changed what was being tested without saying so, and that distinction gets lost entirely without an explicit prompt to surface it. This also catches failure modes a static homepage crawl can't fully simulate for an in-product search experience — a robots.txt block on one specific deep path, JavaScript-only rendering with nothing in the initial HTML, or a noindex tag on any URL, not just the homepage an automated checker typically inspects.`,
    exampleOutput: `1. Access: Yes.
2. Title: "Pricing — Example" / First heading: "Simple, transparent pricing"
3. Starting price $49/month: confirmed. Heading text: confirmed, exact match. Last updated July 2026: not found — no visible update date on the page.
4. Today's date (per this fetch): August 2026.
5. No redirect — the requested URL and the landed URL are identical.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Search)', date: '2026-07-30' },
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, built around the verbatim-title-and-heading check after seeing both engines occasionally answer from stale cached knowledge instead of admitting a fetch failed.',
      },
      {
        date: '2026-08-01',
        note: 'Added the redirect-chain disclosure step after a test case silently reported on a redirected destination page while still labeling it as the originally requested URL.',
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'seo-geo-ai-overview-perplexity-citation-compare',
    category: 'seo-geo',
    title: 'Compare how Google AI Overviews and Perplexity cite the same query',
    description:
      "Feeds the same query's Google AI Overview and Perplexity answers into a structured side-by-side, showing which sources got cited, how, and what content shape is winning on each engine.",
    promptText: `You are an AEO analyst comparing citation behavior across answer engines for the identical query — not giving a general opinion of which engine is "better."

QUERY: {{target_query}}
DOMAIN BEING TRACKED: {{your_domain}}
GOOGLE AI OVERVIEW RESPONSE: {{google_ai_overview_text}}
PERPLEXITY RESPONSE: {{perplexity_answer_text}}

For each response, extract:
- Number of distinct sources cited
- Whether {{your_domain}} appears, and if so, what exactly was quoted or paraphrased from it — the literal phrase, not a summary of the gist
- Citation style: inline numbered footnotes, named-source-in-prose, hyperlinked source cards, or no visible attribution at all
- The structural shape of the most-cited source: a definition paragraph, an FAQ list, a comparison table, a ranked listicle, or a stat-led claim

TASK

1. Produce a side-by-side comparison table across the four extraction points above.
2. Name which engine currently cites more sources for this specific query, and which content shape is winning on each — these can genuinely differ between the two engines for the identical query, and that difference is the useful finding, not a discrepancy to smooth over.
3. If {{your_domain}} didn't appear in either response, name the single most likely structural reason why, based on what shape the sources that did get cited actually have — not a generic "improve your SEO."
4. If {{your_domain}} appeared in one response but not the other, name the specific structural difference between what got cited on the winning engine and what your domain's current page looks like, so the gap is about a concrete content shape, not a vague authority gap.

OUTPUT
The comparison table, then the two-paragraph analysis covering points 2-4 above.`,
    variables: [
      {
        name: 'target_query',
        description: 'The exact search query both engines answered.',
        example: 'best project management software for small teams',
        required: true,
      },
      {
        name: 'your_domain',
        description:
          'Your domain, so the analysis can flag whether you were cited at all.',
        example: 'example.com',
        required: true,
      },
      {
        name: 'google_ai_overview_text',
        description:
          'Paste the full text of the Google AI Overview response, including any visible source links or names.',
        example: '[paste the AI Overview box text and its linked sources]',
        required: true,
      },
      {
        name: 'perplexity_answer_text',
        description:
          'Paste the full Perplexity answer, including its numbered citations.',
        example: '[paste the Perplexity answer with its [1][2][3] citation markers]',
        required: true,
      },
    ],
    targetTools: ['Google AI Overviews', 'Perplexity', 'Claude', 'ChatGPT'],
    tags: [
      'ai-overviews',
      'perplexity-citations',
      'geo-comparison',
      'citation-behavior',
      'aeo',
    ],
    whyItWorks: `The AI Overview and the organic results beneath it converge on the same underlying format signals — short headers, numbered claims, structured copy — but the two engines still diverge sharply in how they attribute what they surface, which is exactly why comparing the identical query across both rather than auditing one engine in isolation surfaces something a single-engine check cannot: Perplexity's transparency model shows near-inline numbered citations for almost every sentence, while Google AI Overviews synthesizes more broadly and cites more selectively, leaning on sources it already trusts through the structured-data and authority signals classic Search already relies on. That divergence means a page can be heavily cited by one engine and completely absent from the other for the literal same query, which is why diagnosing which specific engine pattern is missing — rather than a single generic "get cited more" goal — is more actionable: the fix for a Perplexity gap (a stat-led, quotable sentence) and the fix for a Google AI Overview gap (a structurally complete comparison page it already trusts a similar page for) are genuinely different pieces of work, not the same fix applied twice.`,
    exampleOutput: `| | Google AI Overview | Perplexity |
|---|---|---|
| Sources cited | 3 | 7 |
| example.com present | No | Yes — one paraphrased sentence, citation [4] |
| Citation style | Named-source-in-prose, no numbering | Inline numbered footnotes on nearly every sentence |
| Winning content shape | Comparison table on a competitor's page | Stat-led claim on example.com |

Perplexity currently cites far more sources and rewards specific, stat-led sentences; Google AI Overviews is citing fewer, more structurally "complete" pages (comparison tables) — example.com's missing comparison table is the likely gap on that engine specifically, distinct from why it already succeeds on Perplexity.`,
    verifiedAgainst: [
      {
        tool: 'Google AI Overviews',
        version: 'Gemini 3.0 grounding',
        date: '2026-08-01',
      },
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish. Framed as a paste-both-answers analysis rather than a live dual-fetch, since no single assistant can currently query both engines directly inside one session.',
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'seo-geo-competitor-ai-visibility-gap',
    category: 'seo-geo',
    title: "Audit a competitor's AI visibility to find your citation gap",
    description:
      'Compares your AI-crawler access, llms.txt, and answer-engine citation presence against a named competitor on a shared topic, producing three ranked fixes instead of a vague sense that they are winning.',
    promptText: `You are a competitive AEO analyst with live browsing/search access. Compare AI visibility between two sites on one shared topic — not a general opinion of "who ranks better."

YOUR DOMAIN: {{your_domain}}
COMPETITOR: {{competitor_domain}}
SHARED TOPIC/QUERY: {{shared_topic_or_query}}

STEPS

1. Fetch both domains' robots.txt. For each, check whether GPTBot, PerplexityBot, ClaudeBot, and Google-Extended are allowed or blocked, applying real precedence rules (most specific User-agent group wins, longest matching path wins within a group) — not a surface read of the file. Note any difference between the two sites.
2. Check both domains for a public llms.txt, and if one exists, whether its listed pages are actually reachable rather than 404ing or blocked elsewhere in that same domain's robots.txt.
3. Actually search or ask about "{{shared_topic_or_query}}" using your live tool, and report which domain, if either, gets cited, and how — a quoted stat, a linked source, named but not quoted, or not mentioned at all.
4. Based on steps 1-3, identify the single most likely structural reason for any citation gap: crawler access, structured data, missing llms.txt, page freshness, or content specificity — pick the one the evidence actually points to, not the one that's easiest to fix.
5. If both domains show identical crawler access and llms.txt status but one still gets cited and the other doesn't, say so explicitly — that result means the gap is a content or authority difference, not a technical-access one, and the fix recommendations should reflect that instead of repeating a crawler-access fix that wouldn't change anything.

OUTPUT
1. A crawler-access table for both domains.
2. The citation-presence result from step 3.
3. Three ranked fixes for {{your_domain}}, ordered by how much of the gap each is likely to close, given the specific cause identified in step 4.`,
    variables: [
      {
        name: 'your_domain',
        description: 'Your own domain.',
        example: 'example.com',
        required: true,
      },
      {
        name: 'competitor_domain',
        description: 'The competitor domain to compare against.',
        example: 'competitor.com',
        required: true,
      },
      {
        name: 'shared_topic_or_query',
        description:
          'A specific question or topic you both plausibly compete to get cited for.',
        example: 'how to calculate customer acquisition cost',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: ['competitor-audit', 'ai-visibility', 'geo-gap-analysis', 'crawler-access'],
    whyItWorks: `This mirrors the AI Visibility Checker's own scoring weights — crawler access 40%, structured data 20%, page basics 20%, llms.txt 10%, sitemap 10% — so a competitor gap almost always traces back to one of exactly five buckets, turning "they show up more" into one concrete, fixable difference instead of a vague impression that's hard to act on. It also acts on the tool's own stated finding that classic Google ranking and AI-crawler access are decided by entirely separate bot rules: a competitor can rank behind you in Google Search while still being the one AI engines cite, because their robots.txt treats GPTBot or PerplexityBot differently than yours does — a gap invisible to any classic rank tracker that only watches Googlebot-driven ranking positions. The explicit branch for identical technical access but different citation outcomes matters because it's the case a purely mechanical audit is most likely to get wrong by default: without that check, a report built around the five-bucket technical framing will keep recommending technical fixes even when the evidence in front of it already shows the technical layer is a dead end and the real gap is content depth or topical authority — naming that honestly is what keeps the ranked fixes from wasting effort on the wrong layer.`,
    exampleOutput: `| | example.com | competitor.com |
|---|---|---|
| GPTBot | Allowed | Allowed |
| PerplexityBot | Blocked | Allowed |
| ClaudeBot | Allowed | Allowed |
| Google-Extended | Allowed | Allowed |
| /llms.txt | Not found | Found, and its 3 listed pages are all live and reachable |

Citation result: competitor.com was cited by Perplexity with a quoted definition; example.com was not mentioned.

Ranked fixes: 1) unblock PerplexityBot — this alone likely explains most of the gap on that specific engine, 2) publish /llms.txt pointing to your top 3 pages, 3) add a definition-style opening sentence matching the cited competitor pattern.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-08-04' },
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: "Initial publish. Anchored the five-bucket framing to the AI Visibility Checker's own scoring weights so the audit produces the same vocabulary the tool's report uses.",
      },
      {
        date: '2026-08-06',
        note: 'Added the identical-access-but-different-outcome branch after a test case kept recommending crawler-access fixes even though both domains already showed the same technical access.',
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'seo-geo-visibility-score-fix-plan',
    category: 'seo-geo',
    title: 'Turn your AI Visibility Checker score into a 30-day fix plan',
    description:
      'Turns a raw AI Visibility Checker score and its failed checks into a plain-English explanation and a ranked 30-day fix plan, ordered by score points recovered per unit of effort.',
    promptText: `You are an AEO consultant. A visitor ran the AI Visibility Checker and got a score with specific failed checks — turn that into a plan they can actually execute, not a restatement of the number.

SCORE: {{visibility_score}} / 100
SITE TYPE: {{site_type}}
FAILED CHECKS: {{failed_checks}}

The score is weighted: crawler access 40%, structured data 20%, page basics 20%, llms.txt 10%, sitemap 10%.

TASK

1. Identify which weighted bucket above is most responsible for the current score, based specifically on the failed checks given — not a generic "crawler access usually matters most" assumption applied regardless of what actually failed.
2. For every failed check listed, give one plain-English sentence on what it actually means, and the concrete fix — not "improve SEO," the literal change (for example: "remove Disallow: / from the GPTBot group in robots.txt").
3. Produce a ranked 30-day plan, ordering fixes by estimated score points recovered versus how much work each takes — a fix that recovers a small fraction of the crawler-access weight but takes five minutes may rank above a larger structured-data fix that takes a full day, depending on the actual numbers.
4. For each fix in the plan, note whether it's something the site owner can do themselves (editing a robots.txt file, adding a schema block) versus something that likely needs a developer (a template-level change, a CMS limitation) — since that changes how realistically it fits into 30 days.
5. Close with one honest sentence: a higher score means the site is eligible to be cited by AI engines, not guaranteed to be — content quality and topical authority still decide the rest, and no fix on this list changes that.

OUTPUT
The most-responsible-bucket identification, the plain-English breakdown per failed check, the ranked 30-day plan with the self-serve-vs-developer note, and the closing caveat.`,
    variables: [
      {
        name: 'visibility_score',
        description: 'The 0-100 score the AI Visibility Checker returned.',
        example: '54',
        required: true,
      },
      {
        name: 'failed_checks',
        description:
          'Paste the specific flagged check cards or findings text from your report, not just the score.',
        example:
          'GPTBot: Blocked (Disallow: / under User-agent: GPTBot). No /llms.txt found. FAQPage schema missing on homepage.',
        required: true,
      },
      {
        name: 'site_type',
        description: 'What kind of site this is, for context on which fixes matter most.',
        example: 'B2B SaaS marketing site',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: [
      'ai-visibility-checker',
      'geo-fix-plan',
      'score-interpretation',
      'prioritization',
    ],
    whyItWorks: `The prompt reasons directly over the checker's own published weighting (40/20/20/10/10) instead of duplicating or second-guessing its scoring logic, so the fix plan uses the same vocabulary as the report itself rather than introducing a competing framework the site owner then has to reconcile between two sources. Ordering fixes by score points recovered per unit of effort, rather than by the standard "most important category first" convention, converts a diagnostic list into an actual work order — a five-minute robots.txt edit that recovers a meaningful chunk of the crawler-access weight genuinely belongs above a half-day structured-data addition if the math says so, and defaulting to category order instead would bury a cheap, high-value fix under a slower one just because it sits in a heavier-weighted bucket. Separating self-serve fixes from developer-dependent ones matters because a 30-day plan that ignores who can actually execute each item isn't really a plan a non-technical site owner can hand off — knowing in advance that the robots.txt edit is a five-minute self-serve change while the schema addition needs a developer changes how the 30 days actually get scheduled. The closing caveat is load-bearing, not boilerplate — it's the tool's own stated limitation, and repeating it here stops a rising score from being mistaken for a guarantee the fix plan was never able to make in the first place.`,
    exampleOutput: `Most responsible bucket: crawler access (40% weight) — GPTBot is fully blocked, which alone caps the score well below what structured-data and llms.txt fixes could recover on their own.

1. Remove Disallow: / from the User-agent: GPTBot group in robots.txt — recovers the largest single chunk of the crawler-access weight, ~15 minutes of work, self-serve (a text-file edit).
2. Publish /llms.txt listing your top 5 pages — recovers the full llms.txt weight, under an hour, self-serve.
3. Add FAQPage schema to the homepage — recovers structured-data points, half a day including review, likely needs a developer if the homepage template doesn't already support a schema block.

A higher score means AI engines are able to fetch and parse the site, not that they will choose to cite it — that still depends on content quality and topical authority, and nothing above changes that.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: "Initial publish, built directly around the checker's published 40/20/20/10/10 weighting so the fix plan uses the same scoring language as the report itself.",
      },
      {
        date: '2026-08-08',
        note: "Added the self-serve-vs-developer distinction per fix after feedback that the ranked list alone didn't make clear which items a non-technical site owner could actually execute inside the 30-day window.",
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'seo-geo-keyword-clusters-topic-map-buyer-journey',
    category: 'seo-geo',
    title: `Turn a messy keyword export into clusters mapped to buyer-journey stage, not just shared words`,
    description: `Takes a raw keyword list plus rough search-volume and intent notes and groups it into clusters built around one ranking page each, tagged to where the searcher sits in the funnel — not a generic word-overlap grouping.`,
    promptText: `You are clustering a raw keyword export for one site section into groups that map to real pages, not just groups of words that happen to share a root term.

SITE / SECTION
{{site_section}}

RAW KEYWORD LIST
{{keyword_list}}

EXISTING PAGES THAT ALREADY RANK FOR SOME OF THESE
{{existing_pages}}

BUSINESS PRIORITY
{{business_priority}}

CLUSTERING RULES
Group keywords by what a single page could realistically satisfy in one visit, not by shared substring — "best project management software" and "project management software pricing" share three words but belong on two different pages because they answer two different questions at two different funnel stages. For every cluster, name the one page it should live on, whether that page already exists in the list I gave you or needs to be created, and the specific search intent it serves (informational, comparison, transactional, navigational). Tag every cluster with a funnel stage — top (learning the category exists), middle (comparing options), bottom (ready to choose) — and flag any cluster where the keywords inside it actually span two stages, because that's usually a sign the cluster should split, not a sign it's fine as one page. If two clusters would cannibalize each other because they'd both plausibly rank on the same page anyway, say so explicitly rather than silently listing them as separate clusters. Do not force every keyword into a cluster — if a keyword doesn't fit anywhere in this site section's realistic scope, put it in a leftover list and say why it doesn't belong, rather than stretching a cluster to absorb it.

OUTPUT FORMAT
A table with columns: Cluster name, Target page (existing or new), Funnel stage, Core keywords (comma-separated), Search intent, Cannibalization risk (none / name the other cluster). Follow the table with a short leftover-keywords list and a one-line reason for each, and a final paragraph flagging the single highest-priority cluster to build first given the business priority I stated.`,
    variables: [
      {
        name: 'site_section',
        description: `The specific site or section this keyword set belongs to.`,
        example: `The /pricing and /compare section of a B2B expense-management SaaS site.`,
        required: true,
      },
      {
        name: 'keyword_list',
        description: `The raw keyword export, pasted as-is, ideally with volume if you have it.`,
        example: `expense management software, best expense management software, expense management software pricing, expense management software vs Expensify, free expense tracking app, how to automate expense reports (37 more rows)...`,
        required: true,
      },
      {
        name: 'existing_pages',
        description: `URLs or titles of pages you already have that might absorb some of these keywords.`,
        example: `/pricing, /compare/expensify, /blog/automate-expense-reports`,
        required: false,
      },
      {
        name: 'business_priority',
        description: `What the business actually wants more of right now.`,
        example: `We're trying to win comparison-stage traffic against Expensify specifically, not top-of-funnel awareness content.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`keyword-clustering`, `topical-map`, `search-intent`, `content-strategy`, `on-page-seo`],
    whyItWorks: `GPT-5.1 clusters keywords well by surface similarity by default because that's the cheapest pattern to complete from a raw list, which is exactly the failure mode this prompt targets: instructing it to cluster around "what a single page could satisfy in one visit" forces it to reason about search intent as the grouping variable instead of shared tokens, which is the actual signal that predicts whether two keywords should share a URL or cannibalize each other if they do. The explicit funnel-stage tag matters because a cluster that spans top and bottom funnel almost always means the underlying page would have to serve two contradictory jobs — educate a stranger and convert a ready buyer — and naming that split up front catches a structural content problem before a writer builds one page that does neither well. Asking the model to flag cannibalization risk rather than silently keep clusters separate matters because ChatGPT, left unprompted, treats each cluster as an independent unit and won't cross-reference them against each other for overlap unless told to explicitly hold the full set in mind as it goes — a real risk with SEO clustering, since two clusters built from a genuinely large keyword export can easily target the same query space without either cluster's description making that obvious on its own. The leftover-keyword list exists because forcing every row into a cluster produces artificially padded clusters that look complete but actually bury a handful of keywords that don't belong on this site at all, which wastes a content brief on a page that was never going to rank for its stated intent.`,
    exampleOutput: `Cluster: "Expense software vs Expensify" | Target: /compare/expensify (existing) | Stage: middle-to-bottom | Keywords: expense management software vs Expensify, Expensify alternative, expense software better than Expensify | Intent: comparison | Cannibalization: none. Leftover: "free expense tracking app" — belongs on a different site entirely aimed at individual users, not our B2B buyer.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-content-brief-competitor-gap-outline',
    category: 'seo-geo',
    title: `Build a content brief from a target keyword and three competitor URLs that a freelance writer can actually execute without asking you ten questions`,
    description: `Produces a writer-ready brief — outline, angle, must-cover subtopics pulled from what's actually ranking, and word count rationale — instead of a generic bullet-point template that leaves the writer guessing what makes this piece different.`,
    promptText: `You are building a content brief for a freelance writer who has never seen our site before and won't get to ask follow-up questions before drafting.

TARGET KEYWORD
{{target_keyword}}

TOP-RANKING COMPETITOR URLS
{{competitor_urls}}

OUR ANGLE OR DIFFERENTIATOR
{{our_angle}}

AUDIENCE
{{audience}}

STEP 1 — READ THE COMPETITION
Treat the competitor URLs as representing what's currently satisfying this query, and infer their likely structure, subtopics, and depth from the keyword and URLs given (note explicitly that you're inferring rather than having crawled them live, and ask me to paste key excerpts if precision matters more than speed). List the subtopics that appear to be table-stakes — if all three competitors cover something, our piece has to cover it too or it reads as incomplete by comparison.

STEP 2 — FIND THE GAP
Identify one or two subtopics or angles that are plausibly under-covered given our stated differentiator, and explain specifically why our angle lets us go deeper there than a generic competitor would.

STEP 3 — BUILD THE BRIEF
Write the actual outline as H2/H3 headings, not a description of what an outline should contain. For each H2, give the writer one or two sentences on what needs to be said, not just the heading — a heading alone forces the writer to invent the content, which defeats the purpose of a brief. State a target word count per section, not just a single total, since a writer without section-level guidance almost always front-loads early sections and rushes the ending. Specify the primary keyword placement (title, one H2, first 100 words) and up to three secondary keywords to work in naturally, without instructing the writer to force them.

WHAT NOT TO DO
Do not write the brief as a set of generic content-writing best practices ("use short paragraphs, add a call to action") — every instruction in the brief must be specific to this exact piece. Do not invent statistics, studies, or named sources to include — if the brief calls for a supporting stat, instruct the writer to find and cite a real current source rather than presenting a placeholder as if it were factual.

OUTPUT FORMAT
1. Table-stakes subtopics (bullet list).
2. Content gap and why our angle earns it (one paragraph).
3. Full outline with word counts per section and one-to-two-sentence guidance per H2.
4. Keyword placement notes.
5. Suggested title and meta description (under 60 and 155 characters).`,
    variables: [
      {
        name: 'target_keyword',
        description: `The exact keyword this piece is trying to rank for.`,
        example: `how to switch payroll providers mid-year`,
        required: true,
      },
      {
        name: 'competitor_urls',
        description: `URLs currently ranking on page one for the target keyword.`,
        example: `gusto.com/blog/switching-payroll-providers, adp.com/resources/mid-year-payroll-switch, rippling.com/blog/change-payroll-mid-year`,
        required: true,
      },
      {
        name: 'our_angle',
        description: `What makes our take on this different or more credible than a generic competitor's.`,
        example: `We build the actual data-migration checklist ourselves for every customer, so we can go deep on the specific mid-year tax-filing gotchas that generic guides wave past.`,
        required: true,
      },
      {
        name: 'audience',
        description: `Who is reading this and what they already know.`,
        example: `HR managers at 50-200 person companies who've decided to switch but are nervous about the tax-filing transition specifically.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`content-brief`, `content-strategy`, `outline`, `competitive-analysis`, `seo-writing`],
    whyItWorks: `A content brief fails as a deliverable the moment a writer has to invent what a heading actually means, which is the default output shape GPT-5.1 reaches for when asked for "an outline" without being told to attach guidance sentences to every H2 — headings alone are cheap to generate and look complete, but they push all the real thinking back onto the writer, defeating the point of commissioning a brief at all. Explicitly separating table-stakes subtopics from the content gap forces the model to reason in two distinct passes instead of blending them, which matters because an LLM asked directly for "what should this piece cover" tends to merge "what's expected" and "what's differentiated" into one flat list, and a writer reading that list can't tell which sections are competitive necessities versus the actual reason to publish the piece at all. Instructing the model to flag that it's inferring competitor structure from URLs rather than having crawled them live matters because ChatGPT cannot actually browse the linked pages in this workflow unless browsing is explicitly enabled and used, and a brief that presents inferred structure as verified fact would send a writer chasing subtopics that may not actually be on the page — naming the inference honestly lets the requester decide whether to paste real excerpts before the writer starts. The explicit ban on inventing statistics addresses a known hallucination risk in brief-writing specifically: a plausible-sounding placeholder stat left in a brief has a real chance of surviving into the published piece if a writer skims past the caveat.`,
    exampleOutput: `H2: What actually breaks when you switch payroll mid-year (150 words) — cover the two tax-filing gaps generic guides skip: W-2 reconciliation across two providers and state unemployment insurance rate carryover. Primary keyword in title and first 100 words; secondary keywords "mid-year payroll transition," "payroll provider switch checklist" worked into H2s naturally.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-search-intent-classifier-serp-audit',
    category: 'seo-geo',
    title: `Classify a keyword list by real search intent using what's actually ranking, not what the keyword sounds like it means`,
    description: `Reads the visible SERP pattern for each keyword — content type, format, and angle of the ranking pages — and classifies intent from that evidence, catching the keywords that sound informational but are actually served by product pages, or vice versa.`,
    promptText: `Classify search intent for the keyword list below using the evidence I give you about what's actually ranking, not just what the keyword phrase sounds like it means.

KEYWORD LIST
{{keyword_list}}

SERP OBSERVATIONS (what's ranking for each, if you have it)
{{serp_observations}}

OUR PAGE TYPE OPTIONS
{{page_types_available}}

RULE
A keyword's surface wording is not reliable evidence of intent on its own — "best running shoes for flat feet" looks informational but if the visible SERP is dominated by e-commerce category pages and buying guides with embedded product grids, the real intent is commercial-investigation-with-purchase-readiness, not pure information-seeking, and a blog post competing against that SERP will underperform a well-built category page regardless of writing quality. If I've given you SERP observations for a keyword, base the classification on that evidence and say so. If I have not given you observations for a keyword, classify it from the keyword's wording as a provisional best guess, but label it explicitly as unverified and recommend checking the live SERP before committing a page type to it — do not present a wording-based guess with the same confidence as an evidence-based classification.

FOR EACH KEYWORD, DETERMINE
1. Primary intent: informational, commercial investigation, transactional, or navigational.
2. Dominant ranking format if observed: long-form guide, comparison table, product/category page, tool/calculator, forum thread, video.
3. Which of our available page types actually matches that format, or whether none of them do.
4. Confidence: evidence-based or wording-based-guess.

WHAT NOT TO DO
Do not default every keyword containing "how," "what," or "best" to informational intent purely from the question word — question words are a weak signal on their own; the ranking format is the strong signal. Do not force a page type match if none of our available formats fits the observed SERP — say plainly that this keyword needs a format we don't currently have, rather than assigning it to the closest existing page type as if that were a fine substitute.

OUTPUT FORMAT
A table: Keyword | Primary intent | Dominant format | Matching page type (or "gap — need [format]") | Confidence. End with a short list of any keywords flagged as format gaps, since those represent either a page type we should build or a keyword we should deprioritize.`,
    variables: [
      {
        name: 'keyword_list',
        description: `The keywords you need classified.`,
        example: `best running shoes for flat feet, how does plantar fasciitis form, running shoe size chart, Brooks Adrenaline vs Ghost`,
        required: true,
      },
      {
        name: 'serp_observations',
        description: `What you've actually seen ranking for these keywords, if anything — even rough notes count.`,
        example: `"best running shoes for flat feet" — top 5 results are all e-commerce category/buying-guide hybrids with product grids, no pure blog posts in top 10.`,
        required: false,
      },
      {
        name: 'page_types_available',
        description: `The page formats your site can actually produce.`,
        example: `Blog long-form articles, product category pages with filterable grids, comparison tables, a size-chart tool.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`search-intent`, `serp-analysis`, `content-strategy`, `keyword-research`, `on-page-seo`],
    whyItWorks: `Left to its own defaults, GPT-5.1 classifies search intent almost entirely from the lexical pattern of the keyword phrase — question words toward informational, "buy"/"price" toward transactional — because that's the only signal available when no SERP evidence is supplied, and it will present that guess with the same confident tone as an evidence-grounded classification unless explicitly told to separate the two. That's the exact failure this prompt structure prevents: forcing a confidence label per row (evidence-based versus wording-based-guess) stops a plausible-sounding but ungrounded classification from being treated as equally reliable, which matters in SEO specifically because building the wrong page format for a keyword's real intent is a multi-week content investment that fails silently — the page can be well-written and still underperform because the SERP was never going to reward that format regardless of quality. Naming the dominant ranking format as a required output field, separate from the abstract intent label, is what actually operationalizes the classification into a page-type decision; "commercial investigation" alone doesn't tell a content team whether to build a comparison table or a long buying guide, but "top 5 results are category-page-plus-product-grid hybrids" does. The explicit refusal to force-fit a format gap into the closest available page type matters because an LLM asked to pick from a fixed list will pick the closest option even when none of them fit well, quietly hiding a real gap — that this site has no page type that can compete for this keyword at all — inside a recommendation that looks like a normal match.`,
    exampleOutput: `best running shoes for flat feet | Commercial investigation | Category page + buying guide hybrid | Product category page (existing) | Evidence-based. how does plantar fasciitis form | Informational | Long-form medical/health guide | Gap — need a dedicated editorial guide format | Evidence-based.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-content-gap-competitor-coverage-matrix',
    category: 'seo-geo',
    title: `Find the specific subtopics a competitor covers that we don't, ranked by how much it would actually cost us to close each gap`,
    description: `Compares our existing page against a competitor's on the same topic and produces a coverage matrix scored by both SEO opportunity and realistic effort, instead of a flat list of missing subtopics with no sense of what's actually worth doing.`,
    promptText: `Compare our page against a competitor's page on the same topic and identify content gaps, but score each gap by effort as well as opportunity so this turns into a prioritized list, not just a list.

OUR PAGE (paste content or summary)
{{our_page_content}}

COMPETITOR PAGE (paste content or summary)
{{competitor_page_content}}

TARGET KEYWORD THIS IS COMPETING FOR
{{target_keyword}}

OUR CONSTRAINTS
{{our_constraints}}

STEP 1 — SUBTOPIC INVENTORY
List every distinct subtopic the competitor page covers, and mark which ones our page also covers, partially covers, or doesn't cover at all. Be specific about "partially covers" — a subtopic mentioned in one sentence with no depth is functionally a gap even if the words technically appear on our page, and should be marked as such rather than credited as covered.

STEP 2 — SCORE EACH GAP
For every subtopic we don't cover or only partially cover, estimate: (a) how directly it relates to the target keyword's actual search intent versus being a tangential topic the competitor happens to include, (b) roughly how much production effort it would take given our stated constraints — a paragraph addition versus a new section requiring original data or expert input versus something that needs a subject-matter expert we may not have. Do not treat every gap as equally worth closing; a subtopic only tangentially related to the core keyword is a lower priority even if it's easy to add, and a highly relevant subtopic that requires real effort is still worth flagging as a bigger investment, not skipped.

STEP 3 — RECOMMEND
Rank the gaps into a short "close these first" list of no more than five items, justified by the opportunity-versus-effort read, and a separate "consider later" list for the rest.

WHAT NOT TO DO
Do not recommend copying the competitor's specific framing, examples, or wording — describe what topic or angle is missing, never phrase it as a rewrite of their content. Do not inflate the gap list by treating minor phrasing differences as content gaps.

OUTPUT FORMAT
A coverage table (Subtopic | Our coverage | Relevance to keyword | Effort to close | Priority), followed by the ranked "close first" list and the "consider later" list as separate sections.`,
    variables: [
      {
        name: 'our_page_content',
        description: `The current content of your page, pasted in full or as a detailed summary of its sections.`,
        example: `Our page: intro, 'what is a HELOC', 'how to apply', short FAQ (3 questions). No section on rates or tax implications.`,
        required: true,
      },
      {
        name: 'competitor_page_content',
        description: `The competitor page's content, pasted or summarized the same way.`,
        example: `Competitor page additionally covers: current HELOC rate ranges by lender, tax deductibility rules, a rate comparison table, and a risk section on variable-rate exposure.`,
        required: true,
      },
      {
        name: 'target_keyword',
        description: `The keyword both pages are competing to rank for.`,
        example: `how does a HELOC work`,
        required: true,
      },
      {
        name: 'our_constraints',
        description: `Realistic limits on what you can add — team size, access to data or experts, timeline.`,
        example: `One in-house writer, no licensed financial advisor on staff to review rate/tax claims, two-week timeline for this update.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`content-gap-analysis`, `competitive-analysis`, `content-strategy`, `seo-audit`, `prioritization`],
    whyItWorks: `A flat gap list is the default output shape here because listing missing subtopics is a simpler completion than jointly reasoning about relevance and production cost for each one, and GPT-5.1 will produce the simpler shape unless the effort dimension is made a required, per-row field rather than a closing suggestion — forcing it into the table structure itself is what prevents the model from mentioning effort only in passing for one or two items and dropping it for the rest. Distinguishing "partially covers" from genuinely covered matters mechanically because a keyword match between our page and the competitor's subtopic list would otherwise let a one-sentence mention on our page get silently credited as coverage, hiding a real content thinness problem that a manual audit would have caught — the instruction to treat shallow mentions as functional gaps closes that specific loophole. Scoring relevance to the target keyword's intent separately from raw subtopic overlap stops the model from recommending that every topic the competitor happens to cover gets added to our page; competitor content routinely includes topics that serve their own internal linking or monetization strategy rather than the shared keyword's actual intent, and without an explicit relevance filter those get inherited uncritically. The explicit ban on copying framing or wording addresses a real risk in this exact workflow: because the model is directly comparing two pieces of pasted content side by side, an unconstrained rewrite instruction would produce recommendations phrased so close to the competitor's actual sentences that acting on them verbatim would create a duplication or paraphrasing risk rather than genuinely original coverage.`,
    exampleOutput: `Subtopic: Tax deductibility rules | Our coverage: none | Relevance: high — directly tied to "how does a HELOC work" intent | Effort: medium, needs review-worthy accuracy but no licensed advisor required for general tax-rule explanation | Priority: close first.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-topical-map-pillar-cluster-architecture',
    category: 'seo-geo',
    title: `Design a pillar-and-cluster topical map for a subject you're not yet ranking for, sized to what you can actually publish`,
    description: `Builds a full pillar page plus supporting cluster-article architecture for a new topic area, deliberately scoped to a realistic publishing capacity instead of an idealized 40-article map nobody will finish.`,
    promptText: `You are architecting a pillar-and-cluster topical map for a subject area we want to build authority in but don't currently rank for at all.

SUBJECT AREA
{{subject_area}}

WHAT WE CAN REALISTICALLY PUBLISH
{{publishing_capacity}}

COMPETITORS ALREADY STRONG HERE
{{established_competitors}}

BUSINESS GOAL FOR THIS TOPIC
{{business_goal}}

DESIGN THE MAP IN THIS ORDER

1. Pillar page: define the single broad page that will anchor this topic, its target keyword, and the scope it needs to cover to plausibly earn topical authority signals — broad enough to link out to every cluster piece, specific enough to actually rank on its own.
2. Cluster articles: list the supporting articles that link into the pillar, each with its own long-tail target keyword, and explicitly state how each one links back — the internal-linking relationship is what makes this a topical cluster instead of a pile of unrelated blog posts, so name it for every single cluster piece, not just describe the concept once.
3. Sequencing: given the stated publishing capacity, order the cluster articles into a realistic build sequence — which ones should go first because they're both high-opportunity and needed to make the pillar page's internal links non-empty on day one, versus which can wait.
4. Reality check: if the full map as designed exceeds what's realistically publishable in a reasonable timeframe given the stated capacity, cut it down explicitly rather than handing back an aspirational map that assumes unlimited output — say what got cut and why, and offer a phase-two list for the cut items instead of dropping them silently.

WHAT NOT TO DO
Do not produce a topical map so large it functions as a wish list rather than a plan — if publishing capacity is one article every two weeks, a 30-piece map is not useful even if every piece is individually well-chosen. Do not treat established competitor coverage as something to simply out-list; if a competitor has 200 pages on this subject and we can publish 12, name the realistic subset of the topic where 12 well-chosen pages can plausibly compete, rather than a shallow imitation of their full breadth.

OUTPUT FORMAT
1. Pillar page: title, target keyword, scope summary.
2. Cluster table: Article title | Target keyword | Links to pillar via (anchor text / context) | Build order.
3. One paragraph on what was cut from an idealized version of this map and why, plus a phase-two list.`,
    variables: [
      {
        name: 'subject_area',
        description: `The broad topic you want to build authority in.`,
        example: `Remote-team payroll compliance across US states`,
        required: true,
      },
      {
        name: 'publishing_capacity',
        description: `What you can realistically produce and how often.`,
        example: `One 1,500-word article every two weeks, one writer, no dedicated legal reviewer.`,
        required: true,
      },
      {
        name: 'established_competitors',
        description: `Who already dominates this subject and roughly how much content they have.`,
        example: `Gusto and Deel each have upward of 150 pages covering state-by-state payroll compliance in depth.`,
        required: true,
      },
      {
        name: 'business_goal',
        description: `Why this topic matters to the business specifically.`,
        example: `We want to rank for the handful of states our actual customer base is concentrated in, not compete nationally.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`topical-map`, `content-architecture`, `internal-linking`, `content-strategy`, `pillar-content`],
    whyItWorks: `Asked for a topical map without a stated capacity constraint, GPT-5.1 defaults to an idealized, comprehensive-looking structure — often 20 to 40 cluster articles — because that pattern matches what "complete topical coverage" looks like in its training data, regardless of whether anyone requesting it can actually produce that volume; forcing the reality-check step as a required final stage is what makes the model reconcile the aspirational map against the stated constraint instead of handing back a plan that was never buildable. Requiring an explicit internal-linking relationship for every single cluster article, not just a general statement that clusters link to the pillar, matters because topical authority signals depend on the actual link graph existing on the site, and a map that names the concept once but doesn't specify per-article anchor context produces a list of loosely related articles that a team will publish without ever actually wiring the internal links between them. Naming the build sequence explicitly addresses a real launch-order problem specific to pillar pages: a pillar page published with links to cluster articles that don't exist yet either ships with dead links or gets delayed waiting on content that isn't finished, so sequencing which cluster pieces need to exist before the pillar goes live is a genuine dependency question, not a nice-to-have. The instruction to name a realistic competitive subset rather than imitate a competitor's full breadth matters because a smaller site trying to out-publish an established competitor's 150-page topic cluster on volume alone is simply not a winnable strategy, and the model needs an explicit constraint to recommend a narrower, winnable wedge instead of an imitation of scale it has no way to actually assess as achievable.`,
    exampleOutput: `Pillar: "Remote Payroll Compliance by State: A Practical Guide" (target: remote team payroll compliance). Cluster: "California Remote Employee Payroll Rules" — target keyword: california remote payroll compliance — links to pillar via "see our full state-by-state guide" in intro — build order: 1st (highest customer concentration).`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-internal-linking-plan-anchor-text',
    category: 'seo-geo',
    title: `Plan internal links from a new page into existing ones with real anchor text, not a generic 'add internal links' note`,
    description: `Reads a list of your existing pages and a new page's outline, then proposes specific internal links with the exact anchor text and placement in the new page — reciprocal links back included — instead of leaving link-building as an afterthought a writer skips.`,
    promptText: `New page outline and a list of our existing pages. Find real internal linking opportunities between them, with exact anchor text and placement, not a vague instruction to "link to related content."

NEW PAGE OUTLINE
{{new_page_outline}}

EXISTING PAGES (title + URL + one-line topic)
{{existing_pages_list}}

PRIMARY KEYWORD OF THE NEW PAGE
{{primary_keyword}}

For each existing page that's genuinely relevant to a specific section of the new page's outline, propose one internal link: name the exact section of the new page it belongs in, write the actual anchor text to use (not a description of what the anchor text should convey — the literal words), and give a one-sentence reason the link is relevant there specifically, not just topically related in the abstract. Do not propose a link just because two pages share a broad category — the link has to make sense in the actual sentence a reader would be reading at that point, or skip it. Cap it at the links that would genuinely help a reader or crawler, typically 3 to 6 for a page this size — padding the list with marginal links dilutes the ones that matter and looks like link-scheme behavior rather than genuine internal linking.

Then do the reverse: for each of those same existing pages, note whether they should also get an inbound link back to the new page once it's published, and suggest where on the existing page and what anchor text — reciprocal linking from an old high-authority page into a new one is often the single highest-leverage move for getting a new page indexed and ranked, and it's the part people forget because they only think about links going out of the new page.

Flag anchor text diversity: if more than two of your proposed anchors would use the exact same phrase, vary them, since repetitive exact-match anchor text across many links is a pattern search engines can read as manipulative even when the links themselves are genuinely relevant.

OUTPUT FORMAT
Two tables. Table 1 — Outbound links from new page: Target existing page | Section of new page | Anchor text | Why relevant here. Table 2 — Suggested inbound links to add on existing pages: Existing page | Where on that page | Anchor text.`,
    variables: [
      {
        name: 'new_page_outline',
        description: `The outline or draft of the page you're about to publish.`,
        example: `H1: How to Calculate Employee Overtime Pay. H2s: Federal overtime rules, State-specific exceptions, Common calculation mistakes, Overtime calculator.`,
        required: true,
      },
      {
        name: 'existing_pages_list',
        description: `Titles, URLs, and a one-line topic summary of pages already on your site.`,
        example: `"California Labor Law Guide" /guides/california-labor-law — covers state wage/hour rules. "Payroll Compliance Checklist" /resources/payroll-checklist — general compliance checklist, no overtime specifics.`,
        required: true,
      },
      {
        name: 'primary_keyword',
        description: `The main keyword the new page targets.`,
        example: `how to calculate overtime pay`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`internal-linking`, `on-page-seo`, `content-architecture`, `anchor-text`, `site-structure`],
    whyItWorks: `Asked in the abstract to suggest internal links, GPT-5.1 tends to produce advice at the level of "link to related pages where relevant," which is true but not actionable — the prompt structure here forces specificity by requiring the literal anchor text string and the named section of the new page as separate required fields, which is what turns a suggestion into something a writer can paste directly rather than interpret. The reciprocal-linking step matters because internal link equity flows in both directions and a genuinely useful internal linking plan for a new page is incomplete if it only considers outbound links; a brand-new page has no accumulated authority of its own, and the single fastest way to help it get crawled and ranked is an inbound link from an already-indexed, higher-authority page on the same site — a detail that's easy for a model (and a human) to skip if only asked to think about the new page's own outbound structure. The anchor-text diversity check addresses a specific, well-documented pattern search engines evaluate: unnaturally repetitive exact-match anchor text across many links on a site can read as manipulative link architecture even when each individual link is topically legitimate, so an internal linking plan that doesn't self-check for that pattern can inadvertently recommend something that looks fine link-by-link but looks off in aggregate. Capping the count and requiring a specific in-context relevance reason for each link also prevents the model's tendency to pad a linking list with marginal, category-level matches purely because they exist on the site — a link that's topically adjacent but doesn't fit the actual sentence a reader would be in is worse than no link, because it reads as SEO scaffolding rather than a genuinely useful cross-reference.`,
    exampleOutput: `Outbound: Target: "California Labor Law Guide" | Section: "State-specific exceptions" | Anchor: "California's daily overtime threshold" | Why: directly explains the CA-specific rule this section only summarizes. Inbound: Existing page: "California Labor Law Guide" | Where: within its overtime-mention paragraph | Anchor: "how to calculate overtime pay step by step."`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-meta-title-rewrite-ctr',
    category: 'seo-geo',
    title: `Rewrite a page's meta title into three CTR-focused variants without stuffing keywords or breaking the pixel width`,
    description: `Takes an existing underperforming title tag plus its current impressions/CTR context and produces three genuinely different rewrite angles, each checked against character-length truncation risk, instead of one generic keyword-stuffed rewrite.`,
    promptText: `Rewrite this page's meta title. Current title, its performance context, and target keyword below.

CURRENT TITLE
{{current_title}}

TARGET KEYWORD
{{target_keyword}}

PERFORMANCE CONTEXT
{{performance_context}}

PAGE CONTENT SUMMARY
{{page_summary}}

Produce three title rewrites, each using a genuinely different angle so they're real alternatives, not the same sentence reshuffled: one led with the target keyword directly for maximum query match, one led with a specific benefit or number pulled from the actual page content (not an invented statistic — if the page content I gave you doesn't include a real number, don't manufacture one, use a concrete benefit statement instead), and one that differentiates against what's likely already ranking by naming a specific angle competitors' generic titles wouldn't use. For each, state the character count and flag if it's likely to get truncated in search results (Google typically renders somewhere around 50 to 60 characters reliably, more as pixel width rather than a strict character count, so treat 60 characters as a soft ceiling and flag anything longer as a truncation risk rather than a hard failure). Do not stuff the target keyword more than once — a title with the same phrase repeated reads as spam to a searcher even if it's technically keyword-relevant.

Given the performance context, recommend which of the three variants is most likely to address the actual problem — if impressions are healthy but CTR is low, the fix is usually the title not being compelling relative to what's ranking around it, which favors the benefit or differentiation variant over the keyword-led one; if impressions themselves are low, that's more likely a ranking-position problem the title alone won't fix, and say so rather than promising a title rewrite will solve a ranking issue.

OUTPUT FORMAT
Three numbered variants, each with: the title text, character count, truncation flag, and one line on its angle. Close with a one-paragraph recommendation naming which variant to test first and why, tied to the performance context given.`,
    variables: [
      {
        name: 'current_title',
        description: `The exact title tag currently live on the page.`,
        example: `Project Management Software | Company Name`,
        required: true,
      },
      {
        name: 'target_keyword',
        description: `The keyword this page is trying to rank for.`,
        example: `project management software for remote teams`,
        required: true,
      },
      {
        name: 'performance_context',
        description: `What Search Console or analytics actually shows for this page.`,
        example: `Ranking position 4-6, impressions around 8,000/month, CTR 1.2% versus a 3-4% typical CTR at that position.`,
        required: true,
      },
      {
        name: 'page_summary',
        description: `What the page actually offers, so the rewrite can reference something real.`,
        example: `Async-first project management tool built specifically for teams across 3+ time zones, free 14-day trial, no credit card required.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`meta-title`, `ctr-optimization`, `on-page-seo`, `serp-optimization`, `title-tag`],
    whyItWorks: `GPT-5.1's default instinct when asked to "rewrite a title for SEO" is to front-load the exact-match keyword and lightly restate the page's category, producing three variants that are really one variant reworded — requiring each rewrite to commit to a genuinely distinct angle (query-match, benefit-led, differentiation-led) is what forces actual variety instead of superficial rephrasing dressed up as options. The explicit ban on manufacturing a statistic when the page content doesn't supply one addresses a specific hallucination risk in title rewriting: a compelling-sounding number in a title tag is exactly the kind of small, plausible fabrication that's easy to let slip past review because it looks like normal marketing copy rather than a factual claim, and once published it's a real number a search engine and a searcher will both take at face value. Tying the character-count and truncation flag to an approximate pixel-width reality rather than a hard character rule matters because title truncation in search results is actually rendered by pixel width, not character count, so a title with wide characters can truncate well under 60 characters while a narrow-character title might not — presenting 60 as a soft, evidence-informed ceiling rather than a strict rule keeps the guidance accurate instead of falsely precise. Routing the final recommendation through the performance-context data, rather than always defaulting to "pick the most compelling title," matters because a title rewrite genuinely cannot fix a low-impression problem caused by weak ranking position — that requires content or authority work — and a model that recommends a title change regardless of which underlying problem the metrics point to would waste a testing cycle on the wrong fix.`,
    exampleOutput: `Variant 2 (benefit-led): "Project Management Built for Remote Teams Across Time Zones" — 58 characters, low truncation risk. Recommendation: CTR is well below the position-4-6 benchmark while impressions are healthy, meaning the ranking is fine but the title isn't earning clicks — test the benefit-led variant first since it speaks to the specific remote/async pain point rather than restating the generic category.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-meta-description-rewrite-serp',
    category: 'seo-geo',
    title: `Write meta descriptions that earn the click Google actually shows, planning for the rewrite risk instead of ignoring it`,
    description: `Produces two meta description variants sized and structured to survive being shown as-is, plus an explicit note on what Google is likely to rewrite anyway based on the query type — so you're not optimizing blind to a known limitation.`,
    promptText: `Write meta descriptions for this page, but plan for the real possibility that Google rewrites it in the results rather than using it verbatim.

PAGE URL AND TOPIC
{{page_topic}}

TARGET KEYWORD
{{target_keyword}}

WHAT MAKES US THE RIGHT CLICK FOR THIS QUERY
{{differentiator}}

QUERY TYPE
{{query_type}}

Write two description variants, each 140-155 characters, each containing the target keyword naturally once and a concrete reason to click drawn from the stated differentiator, not a vague value statement like "learn more today." Variant one should front-load the answer or benefit in the first 100 characters, since Google truncates on mobile more aggressively than desktop and the first line often has to work alone. Variant two should lead with a question or specific scenario that mirrors how the target audience would actually search, to maximize the chance the snippet feels directly responsive to the query.

Google rewrites meta descriptions a meaningful share of the time, more often for informational or long-tail queries where it prefers to pull a passage that directly matches the query text over a generic page-level description. Given the stated query type, tell me honestly whether this description is likely to survive as written or likely to get overridden by an on-page passage instead — if it's likely to be overridden, the practical implication is that the actual sentence-level content on the page near the answer matters more than the meta tag itself, and recommend making sure a clear, directly-quotable sentence answering the target keyword exists prominently on the page as a hedge, rather than treating the meta description as the only lever available.

Do not write a description that promises something the page doesn't actually deliver — a click earned by an overpromising description that bounces immediately is worse for rankings over time than a lower-CTR but honest one.

OUTPUT FORMAT
Two variants with character counts. One paragraph assessing rewrite likelihood given the query type, and if rewrite risk is high, one sentence naming what on-page passage should exist as a hedge.`,
    variables: [
      {
        name: 'page_topic',
        description: `What the page is about and its URL.`,
        example: `yoursite.com/guides/return-to-office-policy-template — a downloadable return-to-office policy template with customization notes.`,
        required: true,
      },
      {
        name: 'target_keyword',
        description: `The keyword this page targets.`,
        example: `return to office policy template`,
        required: true,
      },
      {
        name: 'differentiator',
        description: `The concrete reason someone should click your result over another.`,
        example: `Includes a hybrid-schedule clause most free templates skip, and it's editable in Google Docs with no email gate.`,
        required: true,
      },
      {
        name: 'query_type',
        description: `Roughly what kind of query this is — informational, navigational, transactional, long-tail question.`,
        example: `Informational/transactional hybrid — people searching this are usually HR staff who want to download and use it immediately.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`meta-description`, `ctr-optimization`, `serp-optimization`, `on-page-seo`, `google-snippets`],
    whyItWorks: `The single biggest thing a meta-description prompt can get wrong is treating the tag as guaranteed to appear verbatim in search results, when in practice Google's snippet algorithm frequently substitutes a passage pulled directly from the page body when it judges that passage a better match to the specific query — a well-documented behavior that's especially common for informational and long-tail queries where an exact on-page sentence answers the query more precisely than a generic summary tag can. Building the rewrite-likelihood assessment into the prompt as a required output, tied to the stated query type, is what stops the deliverable from being false confidence in a lever that may not actually fire — a meta description alone is incomplete SEO advice for an informational query specifically, and naming that limitation lets the requester also fix the on-page passage rather than over-investing polish into a tag Google may discard. Requiring the target keyword to appear only once and paired with a concrete differentiator, rather than a generic value phrase, matters because Google visibly bolds query-matching terms in the snippet and a keyword-dense but otherwise vague description reads as filler next to a competitor's snippet that answers the actual question; a concrete claim tied to something real about the page is what actually earns a click among several similar-looking blue links. The instruction against overpromising addresses a slower-acting but real SEO risk: pogo-sticking (a click that immediately bounces back to search results) is a signal that can suppress a page's performance over time, so a description engineered purely to maximize CTR at the cost of accuracy can actively hurt the page it was meant to help.`,
    exampleOutput: `Variant 1: "Free return to office policy template with a built-in hybrid-schedule clause. Editable in Google Docs, no email required." (147 chars). Rewrite risk: moderate — this is a hybrid informational/transactional query, so Google may pull an on-page sentence instead; make sure the page has a clear first-paragraph sentence stating the template includes a hybrid clause and is free to edit.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-faq-paa-schema-ready',
    category: 'seo-geo',
    title: `Draft FAQ answers sized and phrased to actually qualify for FAQ rich results and People Also Ask, not just generic Q&A copy`,
    description: `Writes a page's FAQ section with answers deliberately structured to the length and self-containment that FAQPage schema and PAA boxes reward, using real People Also Ask questions you supply instead of invented ones.`,
    promptText: `Write an FAQ section for this page using the real People Also Ask and related questions I've gathered, structured so each answer is genuinely eligible for a rich result, not just readable prose.

PAGE TOPIC
{{page_topic}}

REAL PAA / RELATED QUESTIONS GATHERED
{{paa_questions}}

OUR SPECIFIC ANSWERS OR FACTS TO WORK FROM
{{source_facts}}

TONE / AUDIENCE
{{audience_tone}}

RULES FOR EACH ANSWER
Use only the questions I gave you — do not invent additional PAA-style questions and present them as if they were real search demand, since a made-up question with no actual search volume behind it is a wasted schema slot. Write each answer to be fully self-contained: someone reading only that one answer, out of context, with no access to the rest of the page, should get a complete, correct answer — this is the actual requirement for FAQPage/PAA eligibility, not a nice-to-have, since these get pulled out of page context entirely when displayed. Keep each answer roughly 40-60 words, long enough to be substantive, short enough to display cleanly in a rich result snippet without truncation. Lead every answer with the direct answer in the first sentence, then use the remaining sentences for the one or two words of necessary nuance — never bury the actual answer at the end of a paragraph, since a rich-result snippet pull favors the first clear statement it finds. If a question I gave you can't be answered honestly and directly from the source facts I provided, say so explicitly rather than writing a plausible-sounding answer not actually grounded in what I gave you, and tell me what additional fact you'd need.

WHAT NOT TO DO
Do not answer every question with the same opening phrase ("Yes, you can...") — vary sentence structure enough that the section doesn't read as templated when a person actually reads several answers in a row, since this is user-facing content first and a schema target second.

OUTPUT FORMAT
Each FAQ as Q: / A: pairs in order, word count of the answer noted after each, followed by a note flagging any question you could not answer directly from the given facts.`,
    variables: [
      {
        name: 'page_topic',
        description: `What page this FAQ section belongs on.`,
        example: `A landing page for a business VPN product`,
        required: true,
      },
      {
        name: 'paa_questions',
        description: `The actual People Also Ask or related questions you pulled from a SERP tool or manual search, not invented.`,
        example: `Is a business VPN worth it for a small team? Can employees use a business VPN on personal devices? How many users can one VPN license cover?`,
        required: true,
      },
      {
        name: 'source_facts',
        description: `The real facts or product details the answers need to be grounded in.`,
        example: `Our plans cover 1-500 users per license tier, BYOD is supported via a mobile profile but requires MDM enrollment, base plan starts at $6/user/month.`,
        required: true,
      },
      {
        name: 'audience_tone',
        description: `Who's reading this and what tone fits.`,
        example: `IT managers at 20-100 person companies, direct and non-salesy tone.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`faq-schema`, `people-also-ask`, `structured-data`, `on-page-seo`, `serp-optimization`],
    whyItWorks: `FAQPage and PAA rich results are pulled and displayed entirely out of the surrounding page context, which is the mechanical reason the self-containment rule is the load-bearing instruction in this prompt — a model asked simply to "write an FAQ section" naturally writes answers that lean on the page's earlier sentences for context ("as mentioned above," implicit pronouns referring to something established two paragraphs up), which reads fine on the page itself but produces a broken or confusing snippet the moment it's extracted and shown alone in a search result, since that's exactly what the schema markup invites Google to do. Capping answer length at roughly 40-60 words addresses a real display constraint: rich-result snippets truncate longer answers, and an answer engineered for full page context rather than standalone display tends to run long and get cut off mid-thought when extracted, which looks worse than a shorter answer would have. The explicit ban on inventing PAA-style questions matters because a fabricated question has zero actual search demand behind it — the entire value of targeting real PAA data is capturing existing query volume, and a model asked for "FAQ questions" without real data supplied will happily generate plausible-sounding but unverified ones, which wastes schema markup on queries nobody is actually typing. Requiring the model to flag a question it can't answer honestly from the given facts, rather than filling the gap with a plausible-sounding but ungrounded answer, is the direct application of a broader hallucination guardrail to this specific format — an FAQ answer is a factual claim displayed with implied authority in a rich result, so an invented detail here carries more real-world consequence than an invented detail in ordinary prose.`,
    exampleOutput: `Q: Can employees use a business VPN on personal devices? A: Yes — BYOD is supported through a mobile configuration profile, but it requires the device to be enrolled in your company's MDM system first. Without MDM enrollment, personal devices can't connect. (38 words)`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-featured-snippet-paragraph-target',
    category: 'seo-geo',
    title: `Rewrite one section of an existing page specifically to compete for the featured snippet, without touching the rest of the page`,
    description: `Surgically rewrites just the section most likely to win a featured snippet for a target query — matching the exact snippet format Google is currently showing — while leaving the rest of the page's content and structure untouched.`,
    promptText: `Rewrite one specific section of an existing page to target a featured snippet, without restructuring the whole page.

TARGET KEYWORD
{{target_keyword}}

CURRENT FEATURED SNIPPET SHOWING (if you know it)
{{current_snippet}}

THE SECTION OF OUR PAGE THAT ALREADY ADDRESSES THIS
{{current_section_text}}

SNIPPET FORMAT OBSERVED
{{snippet_format}}

First, identify the snippet format actually being shown for this query — paragraph, numbered list, bulleted list, or table — since matching that exact format matters more for winning the snippet than matching the wording, and a well-written paragraph will lose to a mediocre numbered list if Google has decided this query wants a list format. If I've told you the format, rewrite to that format exactly. If I haven't, infer the most likely format from the nature of the query itself (a "how to" query strongly suggests numbered steps, a "what is" definitional query suggests a short paragraph, a comparison query suggests a table) and say explicitly that this is an inference, recommending I verify the live SERP before finalizing.

Rewrite only the specific section I gave you, not the whole page — keep the surrounding page content, heading hierarchy, and everything else untouched, and clearly mark where this rewritten section slots back into the existing page (which heading it replaces or sits under). Keep the rewritten snippet-target content itself tight: a paragraph target should be one 40-60 word paragraph that directly answers the query in its first sentence; a list target should have a clear intro line followed by concise, parallel-structured steps or items, each one a genuinely separate action or point, not padded to hit a certain count. Do not change the target keyword's core claim or introduce a fact not present in the current section text I gave you — if winning the snippet would require stating something more specific than what's currently in our content, flag that as a content gap to fill rather than inventing the missing specific.

OUTPUT FORMAT
1. Identified or inferred snippet format, with confidence.
2. The rewritten section, formatted exactly as it should appear on the page, with a note on where it slots in.
3. Any flagged content gap where winning the snippet would require a fact not currently present in our content.`,
    variables: [
      {
        name: 'target_keyword',
        description: `The query you're trying to win the featured snippet for.`,
        example: `how to reset a Wi-Fi router`,
        required: true,
      },
      {
        name: 'current_snippet',
        description: `What snippet is currently showing for this query, if you've checked.`,
        example: `A competitor's numbered list, 6 steps, starting with 'Locate the reset button, usually on the back of the router.'`,
        required: false,
      },
      {
        name: 'current_section_text',
        description: `The exact section of your existing page that currently addresses this topic.`,
        example: `Our current text: 'Resetting your router is easy. Find the small reset button on the back or bottom of the device. Press and hold it for about 10 seconds using a pin or paperclip. The lights will flash, indicating the reset is complete. Wait a minute before reconnecting.'`,
        required: true,
      },
      {
        name: 'snippet_format',
        description: `The format currently winning, if you know it, so the rewrite matches it exactly.`,
        example: `Numbered list`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`featured-snippet`, `serp-optimization`, `on-page-seo`, `content-formatting`, `position-zero`],
    whyItWorks: `The single most important variable in featured snippet competition is format match, not content quality — Google's snippet selection has already decided, per query, whether it wants to surface a paragraph, a list, or a table, and a page competing with the wrong format for that query type will lose to a lower-quality page in the right format, which is why this prompt makes format identification a mandatory first step rather than an afterthought folded into the rewrite. Restricting the rewrite to a single named section, rather than letting the model rewrite or restructure the whole page, matters because a full-page rewrite risks breaking existing rankings the rest of the page holds for other keywords entirely unrelated to the snippet target — a targeted, surgical instruction keeps the blast radius of the change limited to exactly the content competing for this one snippet. The ban on introducing a fact not present in the original section addresses a specific and easy-to-miss hallucination risk in this exact task: winning a featured snippet sometimes genuinely requires a more specific claim than what's currently on the page (an exact number of steps, a specific measurement), and a model optimizing purely for snippet-winning form could plausibly invent that missing specific to make the rewrite look more complete, which would publish an unverified fact directly into position zero — the highest-visibility placement on the page. Requiring the length and format to match empirically what wins (roughly 40-60 words for paragraph snippets, parallel concise steps for lists) rather than a generic "be concise" instruction is what makes the rewrite genuinely competitive rather than just shorter — actual Google-winning snippets follow fairly consistent length and structure patterns that a vague brevity instruction alone won't reliably reproduce.`,
    exampleOutput: `Format: Numbered list (inferred from "how to" query pattern, high confidence). Rewrite: "To reset your Wi-Fi router: 1. Locate the small reset button on the back or bottom of the device. 2. Press and hold it for 10 seconds using a pin or paperclip. 3. Release once the lights begin flashing. 4. Wait 60 seconds before reconnecting devices." Slots in under the existing "Resetting Your Router" H2, replacing the current paragraph.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-on-page-audit-checklist',
    category: 'seo-geo',
    title: `Audit one page's on-page SEO against its actual target keyword, flagging only what would genuinely move the needle`,
    description: `Runs a focused on-page audit against a single stated target keyword and business goal, separating real fixes from cosmetic nitpicks so a small team doesn't burn a sprint on changes that were never going to affect rankings.`,
    promptText: `Audit this page's on-page SEO against its stated target keyword, and be honest about which findings would actually move rankings versus which are cosmetic.

PAGE CONTENT (paste full text, or headings + key paragraphs)
{{page_content}}

TARGET KEYWORD
{{target_keyword}}

CURRENT RANKING POSITION (if known)
{{current_ranking}}

TEAM CAPACITY FOR FIXES
{{team_capacity}}

Check each of the following against the actual page content given, not in the abstract: title tag keyword presence and framing, H1 presence and match to intent, heading hierarchy logic (does H2/H3 nesting reflect actual subtopic structure or is it flat), keyword presence in the first 100 words, content depth relative to what the target keyword's intent requires, internal links present in the content, image alt text if described, and any obvious duplicate or thin-content signal (very short body text competing for a keyword that clearly needs depth).

For every finding, classify it as high-impact (directly affects how the page is evaluated for this specific keyword and intent), medium (helps but isn't likely to move rankings alone), or cosmetic (technically correct practice with negligible ranking effect on its own, like exact keyword density counting). Do not present a cosmetic finding with the same urgency as a high-impact one — a common failure of generic SEO checklists is treating a missing alt tag as equally important as thin content that fundamentally can't satisfy the query, when in reality one of those is a rounding error and the other is the whole game.

Given the stated team capacity, recommend the two or three fixes to do first, and explicitly deprioritize the rest rather than handing back an undifferentiated list of twelve things to fix, which in practice means nothing gets fixed because nothing was prioritized.

If the current ranking position is given and it's already reasonably strong for this keyword, say so and recommend caution about making large structural changes purely for audit-checklist completeness, since a page that already performs well carries real risk from an unnecessary rewrite.

OUTPUT FORMAT
A findings table: Check | Finding | Impact (high/medium/cosmetic) | Fix. Followed by a "do these first" shortlist matched to stated capacity, and a one-line caution note if the current ranking is already strong.`,
    variables: [
      {
        name: 'page_content',
        description: `The page's actual content, as much as you can paste.`,
        example: `H1: Corporate Travel Booking Software. Intro paragraph doesn't mention 'corporate travel' until sentence 4. Three H2s, all flat, no H3 nesting despite covering 5 distinct subtopics. Body ~450 words total.`,
        required: true,
      },
      {
        name: 'target_keyword',
        description: `The keyword this page is meant to rank for.`,
        example: `corporate travel booking software`,
        required: true,
      },
      {
        name: 'current_ranking',
        description: `Where this page currently ranks for the target keyword, if known.`,
        example: `Position 14, hasn't moved in 3 months`,
        required: false,
      },
      {
        name: 'team_capacity',
        description: `How much work the team can realistically put into fixes.`,
        example: `One developer available for 4 hours this sprint, one writer available for a half-day.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`on-page-audit`, `seo-checklist`, `content-optimization`, `site-audit`, `prioritization`],
    whyItWorks: `A generic on-page SEO checklist treats every item — title tag, alt text, keyword density, heading structure, content depth — as equally worth fixing, which is a real and common failure mode because each item is individually a legitimate best practice; the actual skill in an audit is knowing that a page failing on content depth for a competitive keyword has a fundamentally different problem than a page missing alt text on three images, and this prompt forces that distinction by requiring an explicit impact tier per finding rather than a flat pass/fail list. GPT-5.1 without this constraint will happily generate all twelve checklist items with equal-weight phrasing, because listing checks is the easier default than weighing which ones actually correlate with ranking movement for this specific keyword and page — the impact classification forces the harder, more useful reasoning step. Tying the final recommendation to stated team capacity rather than an idealized "fix everything" list matters because an audit handed to a resource-constrained team with no prioritization functionally produces zero action; a ranked shortlist scoped to what two people can actually do in a sprint is the difference between an audit that changes something and one that becomes a document nobody acts on. The caution flag for pages that already rank reasonably well addresses a specific risk in on-page auditing: rewriting a page purely to satisfy a checklist, when that page is already performing adequately, risks a ranking drop from disrupting whatever combination of factors is currently working, and an audit that doesn't weigh current performance against proposed changes can recommend a net-negative rewrite in the name of technical completeness.`,
    exampleOutput: `Check: Keyword in first 100 words | Finding: target keyword doesn't appear until sentence 4 of the intro | Impact: high — this page is competing on a commercial keyword where early keyword match to search intent is a strong relevance signal | Fix: move a keyword-bearing sentence into the first two sentences of the intro.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-content-refresh-decay-plan',
    category: 'seo-geo',
    title: `Diagnose why a once-ranking page has decayed and produce a refresh plan that fixes the actual cause, not a generic rewrite`,
    description: `Reads a page's traffic-decay pattern alongside its current content and separates the real causes of decline — staleness, SERP feature displacement, a stronger competitor, or genuine irrelevance — into a targeted refresh plan instead of a blanket rewrite.`,
    promptText: `This page used to rank well and has lost traffic. Diagnose why before recommending a refresh, since a refresh built on the wrong diagnosis wastes the work.

PAGE CONTENT (current)
{{page_content}}

TRAFFIC / RANKING PATTERN
{{decay_pattern}}

TARGET KEYWORD
{{target_keyword}}

WHAT'S CHANGED IN THE SERP, IF YOU KNOW
{{serp_changes}}

DIAGNOSTIC PASS
Consider each of these possible causes against the evidence given, and state which one(s) actually fit rather than assuming it's always "the content needs updating": (a) content staleness — dates, statistics, or product details are visibly outdated relative to what the query now expects; (b) SERP feature displacement — a featured snippet, AI overview, or new SERP element now sits above where organic results used to get clicks, meaning the ranking itself may be stable but the click-through opportunity shrank; (c) a specific competitor page objectively out-covers this one now in a way it didn't before; (d) genuine topic irrelevance — the query's actual meaning or dominant intent has shifted since this page was written, and the page answers a version of the question that's no longer what's being asked. Say explicitly which of these the evidence supports, and resist defaulting to "just refresh the content" if the real cause is (b) or (d), since those require a different fix than an on-page rewrite.

REFRESH PLAN
Based on the actual diagnosis, not a generic list, propose the specific fix: if it's staleness, name exactly what needs updating and why the current version reads as dated. If it's SERP displacement, propose how to compete for the new SERP feature itself rather than just refreshing prose that ranks organically below it. If it's a stronger competitor, name the specific gap using their actual coverage as reference. If it's genuine intent drift, be honest that this may need a substantially different page rather than a refresh, and say so plainly rather than recommending a light edit to a page whose fundamental premise no longer matches the query.

OUTPUT FORMAT
Diagnosis section naming the supported cause(s) with evidence cited. Refresh plan matched specifically to that diagnosis. If intent has genuinely drifted, a clear recommendation that this is a rebuild, not a refresh.`,
    variables: [
      {
        name: 'page_content',
        description: `The page's current content or a detailed summary of it.`,
        example: `Guide to 'best video conferencing software 2023', last updated 14 months ago, references pricing and features that have since changed for two of the five tools listed.`,
        required: true,
      },
      {
        name: 'decay_pattern',
        description: `What the actual traffic or ranking data shows over time.`,
        example: `Ranked position 3 for 8 months, dropped to position 9 over the last 6 weeks, impressions flat, clicks down 60%.`,
        required: true,
      },
      {
        name: 'target_keyword',
        description: `The keyword this page targets.`,
        example: `best video conferencing software`,
        required: true,
      },
      {
        name: 'serp_changes',
        description: `Anything you've noticed different about the search results page itself recently.`,
        example: `An AI-generated overview box now appears above organic results for this query, summarizing top options directly.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`content-refresh`, `content-decay`, `seo-audit`, `serp-analysis`, `content-strategy`],
    whyItWorks: `The default failure mode for a content-refresh request is treating every case of traffic decline as a staleness problem solvable by updating dates and prose, because that's the simplest and most common refresh pattern in the training data — this prompt structure forces the model through an explicit differential diagnosis across four distinct causes before it's allowed to recommend a fix, which matters because staleness, SERP feature displacement, competitive out-coverage, and genuine intent drift each require a materially different response, and applying a content refresh to a page whose real problem is an AI overview or featured snippet sitting above it will not recover the lost clicks no matter how well the prose is updated. Explicitly including SERP feature displacement as a candidate cause matters specifically because this is the category most likely to be missed by a naive "refresh the content" instinct — the organic ranking itself can be perfectly stable while a new on-SERP element eats the click-through opportunity above it, and the fix for that (structuring content to compete for the feature itself, or accepting a lower click ceiling) is completely different from a content update. Requiring the model to name intent drift as a possible diagnosis, and to recommend a rebuild rather than a refresh when the evidence supports it, guards against the sunk-cost pull toward always saving the existing page — sometimes a page's fundamental premise no longer matches what the query means today, and a light edit to an outdated premise produces a page that reads as freshly updated but still doesn't answer the question being asked, which is a worse outcome than an honest rebuild recommendation.`,
    exampleOutput: `Diagnosis: evidence supports both staleness (pricing/feature details for two tools are outdated) and SERP feature displacement (an AI overview now sits above organic results, summarizing the same comparison this page provides) — the position-9 ranking may partly reflect Google deprioritizing a page it can detect as dated, but even a full content update likely won't recover the clicks the AI overview is now absorbing. Refresh plan: update all five tool listings with current pricing and features, and additionally restructure the top of the page as a scannable comparison table, since that format has a better chance of being pulled into the AI overview itself as a cited source.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-programmatic-seo-template-scale',
    category: 'seo-geo',
    title: `Design a programmatic SEO page template that won't get flagged as thin or duplicate content at scale`,
    description: `Builds the actual template structure, dynamic-field logic, and required-unique-content rules for a programmatic SEO page set — sized to a real data source you have — with explicit guardrails against the thin-content trap that kills most programmatic SEO attempts.`,
    promptText: `Design a programmatic SEO page template for the data set below, built specifically to avoid the thin/duplicate-content trap that gets most programmatic page sets deindexed or filtered.

DATA SOURCE (what varies per page)
{{data_source}}

EXAMPLE QUERY PATTERN THIS TARGETS
{{query_pattern}}

HOW MANY PAGES THIS WOULD GENERATE
{{page_count}}

WHAT WE CAN GENUINELY SAY DIFFERENTLY PER PAGE
{{unique_data_points}}

STEP 1 — TEMPLATE STRUCTURE
Design the page template as sections, marking each section as either dynamic (pulled directly from the data source and different per page) or static (identical boilerplate across every page). Be honest about the ratio: if the majority of visible content on the page is static boilerplate around a small dynamic data table, that page is a strong thin-content risk regardless of how many pages you generate, and say so explicitly rather than presenting the template as safe by default.

STEP 2 — UNIQUENESS FLOOR
Given the unique data points I listed, determine whether there's enough genuinely distinct information per page to justify a standalone indexable URL, or whether the actual unique content per page is closer to a single data point that would be better served by a filterable single page than thousands of near-duplicate ones. Name the minimum uniqueness bar you'd want before treating each page as worth indexing separately — for example, a page differing from its siblings only by a swapped city name in an otherwise identical paragraph does not meet that bar.

STEP 3 — TEMPLATE COPY
Write the actual static section copy (the parts that don't change per page), designed to still read naturally when the dynamic fields are swapped in — check it against at least two different plausible data values from your data source description to confirm it doesn't read awkwardly or generically for either.

STEP 4 — GUARDRAILS
Recommend a canonicalization or noindex threshold: at what point (too few unique data points, too small a difference between neighboring pages) should a page in this set be noindexed or merged rather than published, and how would you flag those programmatically rather than relying on manual review of thousands of pages.

OUTPUT FORMAT
1. Section-by-section template with dynamic/static labels and thin-content risk assessment.
2. Uniqueness floor recommendation.
3. Sample static copy with two data-value substitutions shown side by side.
4. Noindex/canonicalization guardrail rule.`,
    variables: [
      {
        name: 'data_source',
        description: `The actual structured data you have that would populate each page.`,
        example: `A database of 1,200 US cities with population, median rent, and average commute time.`,
        required: true,
      },
      {
        name: 'query_pattern',
        description: `The search pattern these pages are meant to capture.`,
        example: `"cost of living in [city]" and "average rent in [city]"`,
        required: true,
      },
      {
        name: 'page_count',
        description: `Roughly how many pages this template would generate.`,
        example: `1,200 city pages`,
        required: true,
      },
      {
        name: 'unique_data_points',
        description: `What genuinely differs from page to page, beyond just the name being swapped.`,
        example: `Population, median rent, average commute time, and a locally-sourced note on whether rent is rising or falling year over year, per city.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`programmatic-seo`, `content-scale`, `thin-content`, `technical-seo`, `site-architecture`],
    whyItWorks: `Programmatic SEO's most common real-world failure is generating thousands of pages that pass a superficial "they're all different" check because a name or number is swapped, while the actual reading experience across pages is close to identical boilerplate — this prompt forces an honest static-versus-dynamic ratio assessment per section specifically because GPT-5.1, asked simply to "design a programmatic template," will produce a plausible-looking structure without flagging that ratio problem unless required to state it explicitly, and that ratio is the single strongest predictor of whether a search engine treats a page set as genuinely useful or as scaled thin content. Requiring a stated uniqueness floor — a minimum bar for what counts as genuinely distinct content, not just a swapped value — matters because programmatic SEO's core trade-off is between page count and per-page substance, and an unconstrained design tends to maximize page count since more pages sounds like more opportunity, without weighing that a smaller set of genuinely differentiated pages usually outperforms a much larger set of near-duplicates that risk collective devaluation. Checking the static template copy against at least two different plausible data substitutions is what catches a template that reads naturally for the example given but breaks down or sounds generic for a different value in the same field — a template validated against only one example can hide awkward phrasing that only shows up at certain values (a population of 40 million reading oddly in a sentence built around "a mid-sized city of around 200,000"). The explicit noindex/canonicalization guardrail step matters because manual review doesn't scale to thousands of generated pages, so the actual production-safe version of programmatic SEO requires a programmatic rule for which pages don't meet the bar — without that rule stated up front, a team ships all pages by default and only discovers the thin ones after a ranking or indexing problem appears in aggregate.`,
    exampleOutput: `Section: "Cost of Living Overview" — dynamic (population, rent, commute figures pulled per city) — low thin-content risk if the surrounding analysis paragraph genuinely references the specific numbers. Section: "Why People Move Here" — currently designed as static boilerplate with only the city name swapped — high thin-content risk, recommend cutting this section or making it genuinely dynamic using the year-over-year rent trend data instead.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-local-seo-gbp-optimization',
    category: 'seo-geo',
    title: `Optimize a Google Business Profile and local landing page together as one system, not two disconnected checklists`,
    description: `Produces coordinated GBP profile copy and local landing page recommendations that reinforce the same local signals instead of treating the two as separate, unrelated local-SEO tasks.`,
    promptText: `Optimize our Google Business Profile and the local landing page it should link to as one coordinated system, since local ranking factors read consistency between the two, not either in isolation.

BUSINESS AND LOCATION
{{business_and_location}}

CATEGORIES AND SERVICES
{{categories_services}}

CURRENT GBP DESCRIPTION (if any)
{{current_gbp_description}}

LOCAL LANDING PAGE STATUS
{{landing_page_status}}

GBP PROFILE
Write a GBP business description (750 character limit) that names the specific services and service area plainly, avoids keyword-stuffing the business name or category into unnatural repetition (which risks a suspension flag, not just looking spammy), and matches the actual primary and secondary categories you'd recommend for this business given what it does. Suggest the specific primary category and up to 3 secondary categories, since category selection is one of the strongest local-ranking factors and is frequently under-optimized by businesses that pick the closest-sounding option rather than the one that most precisely matches search behavior.

LOCAL LANDING PAGE
Recommend what the local landing page needs to contain to reinforce the same signals as the GBP profile: the exact business name, address, and phone number matching the GBP listing precisely (NAP consistency is a real ranking factor and small mismatches, like a suite number present on one and missing on the other, are a common self-inflicted problem), service area described specifically rather than just "we serve the local area," and at least one piece of location-specific content (a neighborhood reference, a local landmark, a locally-relevant service note) that a templated multi-location page often skips in favor of pure boilerplate.

CONSISTENCY CHECK
Compare the GBP description and the landing page recommendation against each other and flag any place they'd describe the service area, categories, or services differently — inconsistent signals between the two are worse than either being individually perfect, since it creates ambiguity about what the business actually offers where.

OUTPUT FORMAT
1. GBP description draft (character count noted) plus recommended primary/secondary categories.
2. Local landing page content recommendations, section by section.
3. Consistency check results between the two.`,
    variables: [
      {
        name: 'business_and_location',
        description: `What the business is and where it operates.`,
        example: `A residential HVAC repair company serving the Austin, TX metro area, based in Round Rock.`,
        required: true,
      },
      {
        name: 'categories_services',
        description: `The specific services offered, in enough detail to inform category selection.`,
        example: `AC repair, furnace repair, duct cleaning, and emergency after-hours service — no new installation work.`,
        required: true,
      },
      {
        name: 'current_gbp_description',
        description: `The existing GBP description text, if there is one.`,
        example: `"Best HVAC company in Texas! AC repair, furnace repair, HVAC repair, HVAC service, call us today for HVAC!"`,
        required: false,
      },
      {
        name: 'landing_page_status',
        description: `Whether a local landing page exists and roughly what it currently says.`,
        example: `Exists at /austin-hvac-repair, currently generic boilerplate with no neighborhood-specific content, address matches GBP but is missing the suite number GBP has.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`local-seo`, `google-business-profile`, `nap-consistency`, `local-landing-page`, `on-page-seo`],
    whyItWorks: `Local SEO advice is often given as two disconnected checklists — one for the Google Business Profile, one for the landing page — because that mirrors how the two are managed in separate tools, but local ranking evaluation actually reads for cross-signal consistency, meaning small mismatches between how a business describes itself in each place (a service area stated differently, a suite number present in one listing and absent in another) function as a real signal of unreliability rather than a cosmetic inconsistency; building both deliverables in one prompt and explicitly requiring a final cross-check against each other is what catches this class of problem, which two separately-run optimization tasks would each individually pass while still being inconsistent with each other. The instruction against keyword-stuffing the business name or category in the GBP description addresses a specific, consequential risk beyond just looking spammy: Google Business Profile has an active policy against keyword-stuffed business names and descriptions and can suspend or restrict a listing found violating it, which is a materially worse outcome than a slightly under-optimized description, so this isn't a stylistic nicety but a real risk the model needs to actively write around rather than default toward keyword density. Recommending specific primary and secondary categories rather than only touching the description text matters because category selection is one of the most heavily weighted local ranking factors and is also one of the most commonly under-optimized, since most businesses pick the first closest-sounding category during initial signup and never revisit it, leaving a real ranking lever untouched while attention goes entirely to the description copy instead. Requiring at least one genuinely location-specific detail on the landing page, rather than accepting "we serve the local area" as sufficient, directly targets the most common failure of multi-location local pages — templated boilerplate that's technically about the right city in name only, which both reads as low-effort to a local searcher and gives a local ranking algorithm nothing genuinely location-specific to key off of.`,
    exampleOutput: `GBP description: "Round Rock-based HVAC repair serving Austin metro homeowners — AC repair, furnace repair, duct cleaning, and 24/7 emergency service. Family-owned, licensed and insured." (162 chars). Recommended primary category: HVAC Contractor. Consistency flag: landing page is missing the GBP listing's suite number in its NAP block — add it to match exactly.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-eeat-author-brief',
    category: 'seo-geo',
    title: `Build an author bio and page-level E-E-A-T brief that states real credentials instead of generic trust-signal language`,
    description: `Produces an author bio and a set of on-page trust signals grounded in a real author's actual experience and credentials, refusing to invent expertise the author doesn't have — built specifically for pages where Google's quality raters would weigh E-E-A-T heavily.`,
    promptText: `Write an author bio and page-level trust-signal recommendations for a piece, grounded strictly in this author's real background — do not invent or embellish credentials.

AUTHOR'S ACTUAL BACKGROUND
{{author_background}}

PAGE TOPIC AND WHY IT MATTERS FOR TRUST
{{page_topic}}

WHAT CREDENTIALS OR EXPERIENCE THE TOPIC ACTUALLY CALLS FOR
{{topic_credential_bar}}

CURRENT AUTHOR BYLINE SETUP (if any)
{{current_byline}}

STEP 1 — HONEST FIT CHECK
Compare the author's actual background against what this specific topic calls for in terms of credibility. If the author's real experience genuinely matches or exceeds the bar (a licensed professional writing in their own field, someone with direct hands-on experience doing the exact thing described), say so and proceed. If there's a real gap — the author has general expertise but not the specific credential this topic would ideally have (medical, legal, financial specifics) — say that plainly rather than writing a bio that implies more authority than the author has, and recommend either a credentialed reviewer credit alongside the byline or a disclosure line about the author's actual role and its limits.

STEP 2 — WRITE THE BIO
Write a two-to-three sentence author bio using only the real background given, specific enough to establish genuine relevant experience (a named number of years, a specific real project type, an actual credential) rather than vague trust language like "passionate expert" or "trusted authority," which readers and quality raters alike recognize as unverifiable filler with no actual evidentiary content.

STEP 3 — PAGE-LEVEL TRUST SIGNALS
Recommend concrete, real trust elements this specific page should surface given the topic's credential bar: a visible last-reviewed or last-updated date if the topic is time-sensitive, a named reviewer if the fit check identified a gap, links to the author's other real work in this specific area if it exists, or a sourcing/citation approach appropriate to the claims being made on the page. Do not recommend a generic trust badge or vague "expert-reviewed" label unless a real reviewer is actually named.

OUTPUT FORMAT
1. Fit-check verdict (match, partial gap, or significant gap) with a one-sentence reason.
2. The author bio text.
3. Page-level trust-signal recommendations as a short list, each tied to something real, not generic.`,
    variables: [
      {
        name: 'author_background',
        description: `The author's real, actual credentials and experience — not what you wish they had.`,
        example: `A staff writer with 4 years covering personal finance journalism, no CFP or financial-advisor license, has interviewed licensed advisors for past pieces but doesn't hold a credential herself.`,
        required: true,
      },
      {
        name: 'page_topic',
        description: `What the page is about and why trust matters for this specific topic.`,
        example: `An article on how to choose between a Roth and traditional IRA — a YMYL (your-money-your-life) financial topic where Google's quality guidelines weigh expertise signals heavily.`,
        required: true,
      },
      {
        name: 'topic_credential_bar',
        description: `What level of expertise this specific topic realistically calls for.`,
        example: `Ideally a CFP or someone with direct tax/retirement-planning credentials, since this involves specific tax-treatment guidance readers may act on financially.`,
        required: true,
      },
      {
        name: 'current_byline',
        description: `What byline or author setup currently exists on the page, if any.`,
        example: `Currently just "By Staff Writer" with no bio or reviewer credited.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`e-e-a-t`, `author-bio`, `ymyl-content`, `trust-signals`, `content-credibility`],
    whyItWorks: `The most common failure in E-E-A-T content advice is treating it as a copywriting exercise — adding trust-sounding language like "expert-reviewed" or "trusted authority" to a byline regardless of whether a real credential backs it — when Google's quality rater guidelines and its broader ranking systems for YMYL topics specifically evaluate demonstrable expertise and experience, not the presence of trust-adjacent vocabulary, meaning invented or embellished credentials add zero real signal and create actual reputational and legal exposure if a reader relies on advice from a byline that overstates the author's qualifications. This prompt's honest fit-check step exists specifically to stop that pattern: forcing a genuine comparison between what the author actually has and what the topic calls for, with an explicit "partial gap" or "significant gap" verdict as a valid and expected outcome rather than always producing a flattering bio, is what keeps the output from becoming a confidence-building exercise disconnected from the real facts given. Specificity in the bio — a named number of years, a real project type, an actual credential — matters mechanically because vague trust language is exactly the kind of unverifiable filler both human readers and automated content-quality signals have gotten better at discounting; a bio that could describe literally any writer conveys no real information, while "four years covering personal finance, has interviewed licensed CFPs for past reporting" is a checkable, specific claim that actually functions as an expertise signal. Recommending a named reviewer credit specifically when a genuine credential gap exists, rather than only ever polishing the existing byline, addresses the real solution E-E-A-T gaps call for on YMYL topics — pairing non-credentialed writing with credentialed review is a legitimate and common pattern, and the prompt treats it as the correct fix for exactly the case where inventing author authority would otherwise be the tempting shortcut.`,
    exampleOutput: `Fit check: partial gap — strong finance journalism experience, but no financial-planning license, and this topic involves specific tax-treatment guidance. Bio: "Jane Doe has covered personal finance for four years, reporting on retirement planning and interviewing licensed CFPs for reader-facing guides." Trust signal recommendation: add a named reviewer credit from a licensed CFP who reviewed the tax-treatment claims, plus a visible last-reviewed date given how often IRA contribution limits change.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-competitor-content-gap-teardown',
    category: 'seo-geo',
    title: `Tear down a competitor's top-ranking page into a specific list of what your draft is missing`,
    description: `Compares your existing page against a named competitor URL that outranks it and produces a concrete gap list — missing subtopics, entities, and structural elements — instead of a vague 'improve your content' verdict.`,
    promptText: `You are a senior SEO strategist doing a competitor teardown for one specific keyword where a competitor outranks us, not a general competitive audit.

OUR PAGE
{{our_page_summary}}

COMPETITOR PAGE
{{competitor_page_summary}}

TARGET KEYWORD
{{target_keyword}}

WHAT WE ALREADY TRIED
{{prior_attempts}}

RULES
Do not restate generic SEO advice like "add more detail" or "improve E-E-A-T" — every finding must point to something specific and missing that you can name: a subtopic the competitor covers and we don't, an entity or named example they reference that we skip, a structural element (comparison table, FAQ, decision framework) they include that we lack, or a level of specificity (numbers, named tools, concrete steps) they hit that we stay abstract on. If you cannot tell from the summaries whether a gap is real, say so explicitly and ask for the missing detail rather than inventing a plausible-sounding gap. Do not assume the competitor's higher ranking is only about content — note if the gap looks like it could instead be backlinks, domain authority, or page experience, and flag that as a separate finding rather than folding it into the content gap list. Rank the gaps by how directly each one addresses the actual target keyword's intent, not by how easy each gap is to fix.

OUTPUT FORMAT
1. A ranked list of specific content gaps (subtopic, entity, structure, or specificity), each stated as one sentence naming exactly what's missing.
2. A separate short list of gaps that look like they might not be content-related at all.
3. Three subtopics or sections to add, each with a one-line reason tied to the target keyword's intent.
4. One paragraph on what NOT to copy from the competitor even though it ranks — anything that looks like keyword stuffing, thin filler, or an approach that wouldn't fit our brand voice.`,
    variables: [
      {
        name: 'our_page_summary',
        description: `A summary or outline of your existing page — headings, word count, what it covers.`,
        example: `1,400-word guide on 'switching payroll providers mid-year,' covers timeline and a generic checklist, no cost breakdown or state-specific rules.`,
        required: true,
      },
      {
        name: 'competitor_page_summary',
        description: `A summary or outline of the competitor URL that currently outranks you.`,
        example: `2,600-word guide with a state-by-state compliance table, a cost calculator embed, and named case studies from three mid-size companies.`,
        required: true,
      },
      {
        name: 'target_keyword',
        description: `The specific keyword where this competitor beats you.`,
        example: `switch payroll provider mid-year`,
        required: true,
      },
      {
        name: 'prior_attempts',
        description: `Any changes you've already made to try to close this gap, so the model doesn't re-suggest them.`,
        example: `Added an FAQ section last month, no ranking change after three weeks.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`competitor-analysis`, `content-gap`, `seo-strategy`, `on-page-seo`, `serp-research`],
    whyItWorks: `GPT-5.1 defaults to generic SEO commentary ("add more depth," "improve authority") when given two unstructured page summaries and asked to compare them, because those phrases are statistically the most common completion pattern in SEO-advice training data and require no actual claim about either page's content — the explicit ban on that language forces the model to instead search the two summaries for named, checkable differences, which is the only kind of finding a content team can actually act on. Separating content gaps from non-content gaps (backlinks, domain authority, page experience) matters mechanically because ranking correlation is not causation, and a model asked only "why does this page rank higher" will confidently attribute the entire gap to content even when the summaries given don't support that conclusion — forcing it to flag ambiguity keeps it from overstating certainty it doesn't have. Asking the model to explicitly withhold judgment when the summaries don't contain enough detail to identify a real gap directly counters the tendency of large language models to fill an evidence gap with a plausible-sounding but fabricated specific, since a request for "specific gaps" without that guardrail tends to produce confident-sounding invented details rather than an honest "insufficient information" flag. The final instruction to name what NOT to copy addresses a real failure mode of competitor teardowns: the highest-ranking page sometimes wins despite thin or manipulative tactics rather than because of them, and copying those tactics without acknowledging the trade-off would optimize for the wrong signal.`,
    exampleOutput: `1. Missing: state-by-state compliance breakdown — competitor lists specific rules for CA, NY, TX; ours stays generic. 2. Missing: named case studies — competitor cites three real company examples with numbers; ours has none. 3. Possibly non-content: competitor's domain likely carries more backlinks in this niche — recommend checking referring domains before assuming content alone explains the gap. Do not copy: the embedded calculator appears to duplicate content already covered in prose, which may be padding word count rather than adding real value.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-long-tail-keyword-cluster-from-support-tickets',
    category: 'seo-geo',
    title: `Turn a stack of real customer support questions into a long-tail keyword cluster worth writing for`,
    description: `Mines actual phrasing from support tickets or sales calls into a prioritized long-tail keyword list grouped by the underlying question, so content targets phrasing real users type instead of guessed variations.`,
    promptText: `You are helping build a long-tail keyword cluster from real customer language, not from a keyword tool's suggestions — the raw material is actual questions people asked support or sales, in their own words.

RAW QUESTIONS
{{raw_questions}}

PRODUCT OR SERVICE CONTEXT
{{product_context}}

EXISTING CONTENT THAT ALREADY COVERS SOME OF THIS
{{existing_content}}

STEP 1 — GROUP
Read through the raw questions and group them by the actual underlying question being asked, not by surface keyword overlap — two questions phrased completely differently can be the same underlying intent, and two questions sharing a keyword can be asking genuinely different things. Name each group by the real intent, not a generic label.

STEP 2 — EXTRACT LONG-TAIL PHRASING
For each group, extract the specific long-tail phrasing actual customers used — preserve their real word choices, including any non-obvious terms, misspellings that suggest a real search pattern, or informal phrasing, rather than "cleaning it up" into generic marketing language. Note where the natural phrasing differs from what a keyword tool would suggest.

STEP 3 — CHECK AGAINST EXISTING CONTENT
For each group, check whether existing content already covers it adequately, partially, or not at all. Do not assume a keyword is a gap just because you don't see it named explicitly — check whether the underlying question is actually answered anywhere in the existing content, even under different wording.

STEP 4 — PRIORITIZE
Rank the groups by a combination of how often the underlying question appeared in the raw data and how clearly it signals someone close to a decision (comparing options, asking about a limitation, asking "can I") versus early-stage curiosity.

OUTPUT FORMAT
A table with columns: Question Group | Real Customer Phrasing (2-3 examples) | Coverage Status (covered / partial / gap) | Priority (high/medium/low) | One-line reason for the priority.`,
    variables: [
      {
        name: 'raw_questions',
        description: `A dump of real questions from support tickets, sales calls, or community forums — paste as many as you have.`,
        example: `'Can I use this if I'm already on the annual plan?' / 'Does the API rate limit reset at midnight UTC or my local time?' / 'What happens to my data if I downgrade?'`,
        required: true,
      },
      {
        name: 'product_context',
        description: `Brief context on what the product or service is so the model can judge intent correctly.`,
        example: `B2B API metering tool that tracks usage-based billing for SaaS companies.`,
        required: true,
      },
      {
        name: 'existing_content',
        description: `A list or summary of content you already have, so the model can check real coverage rather than assuming gaps.`,
        example: `A billing FAQ page, a plan comparison page, and a docs page on rate limits — none specifically address downgrade data retention.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`long-tail-keywords`, `keyword-research`, `content-strategy`, `customer-language`, `seo-planning`],
    whyItWorks: `Long-tail keyword lists generated purely from keyword-tool volume data reflect how people phrase things when typing into a search box that autocompletes, which systematically differs from how they phrase a question to a human support agent — the raw-ticket approach captures the actual mental model behind the question, including the specific constraint or edge case that made someone ask in the first place, which is exactly the detail a generic keyword list strips out. Explicitly instructing GPT-5.1 to group by underlying intent rather than surface keyword overlap matters because the model's default clustering behavior on short text snippets leans on lexical similarity, which will incorrectly merge two different questions that happen to share a word and split one real question that was phrased two different ways — naming the failure mode directs the model to reason about intent first and phrasing second. The instruction not to "clean up" the customer phrasing into generic marketing language counters GPT-5.1's default paraphrasing behavior, which naturally smooths idiosyncratic real language into polished, generic prose — exactly the transformation that destroys the long-tail specificity this exercise exists to capture. The coverage-check step forces the model to reason about whether content already answers a question under different wording rather than pattern-matching on whether the literal keyword string appears, which prevents the common false-positive of flagging something as a content gap when it's actually a findability or internal-linking problem instead.`,
    exampleOutput: `Question Group: Downgrade data retention | Phrasing: 'what happens to my data if I downgrade', 'do I lose historical usage data on a lower plan' | Coverage: gap — plan comparison page lists feature differences but never addresses data retention | Priority: high | Reason: signals a user actively deciding whether to downgrade, a revenue-relevant moment with no content currently answering it.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-pillar-page-outline-for-fragmented-cluster',
    category: 'seo-geo',
    title: `Design a pillar page outline that actually unifies a scattered set of existing posts instead of duplicating them`,
    description: `Takes a messy list of existing blog posts on a related topic and drafts a pillar page outline that organizes and links them into one coherent hub, flagging which posts should be merged, kept separate, or retired.`,
    promptText: `Pillar page purpose: {{pillar_topic}}

Existing related posts (title + brief summary each): {{existing_posts}}

Business goal for readers landing on this pillar: {{business_goal}}

Before outlining anything, first sort the existing posts into three categories: posts that should become sections summarized within the pillar with a link out to the full post, posts that substantially overlap with each other and should probably be merged into one before the pillar links to it, and posts that don't actually belong under this topic even though they're tagged similarly and should stay unlinked from this pillar. Explain your reasoning for anything in the second or third category — do not just move it silently.

Then draft the pillar page outline itself as H2/H3 headings that represent the complete topic at a survey level, each with one line describing what that section covers directly on the pillar page (not just a link) and which existing post(s), if any, it should link out to for depth. The pillar page's own text must add real value beyond being a table of contents — each section needs enough original framing that someone who reads only the pillar and clicks nothing still understood the topic at a useful level.

Flag any part of the topic that isn't covered by any existing post — these are new subtopics we'd need to write, not just link to.

End with a one-paragraph internal linking note: which existing posts should link back up to this new pillar, and any anchor text suggestions that would need updating on those pages.

Output as: (1) the sort of existing posts into the three categories with reasoning, (2) the full H2/H3 outline with linking notes, (3) the coverage gaps, (4) the backlink note.`,
    variables: [
      {
        name: 'pillar_topic',
        description: `What this pillar page is meant to be the definitive hub for.`,
        example: `Everything a small business needs to know about 1099 contractor compliance.`,
        required: true,
      },
      {
        name: 'existing_posts',
        description: `A list of existing post titles with a short summary of each, however scattered or overlapping they currently are.`,
        example: `'1099 vs W2: What's the Difference' (basic comparison); '5 Contractor Misclassification Red Flags' (compliance-focused); 'How to Send a 1099-NEC' (tax filing mechanics); '1099 vs W2: Which Should You Hire' (near-duplicate of the first post, different angle).`,
        required: true,
      },
      {
        name: 'business_goal',
        description: `What you want a reader to do or believe after landing on this pillar page.`,
        example: `Trust us enough to start a free trial of our contractor payment and compliance tool.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`pillar-page`, `content-architecture`, `internal-linking`, `topic-authority`, `content-strategy`],
    whyItWorks: `Most pillar-page requests fail because they're written as a fresh outline in isolation, which produces a page that either duplicates existing posts word-for-word or ignores them entirely — forcing the sort-first step means GPT-5.1 has to reason about the existing corpus as material to be organized rather than generating a new structure from scratch, which is the actual job a pillar page does. Requiring an explicit reason for anything moved into the merge or exclude categories counters the model's tendency to quietly reorganize content without surfacing the judgment calls involved, which matters here because merging two posts or excluding a tagged-similar post are both decisions a content owner needs visibility into before they happen, not silent recommendations buried in an outline. The instruction that each section must add real value beyond being a table of contents addresses the single most common failure mode of AI-drafted pillar pages: because the model has been asked to "link out" to existing depth, it defaults to writing thin one-line section stubs that are functionally just a linked list, which search engines and readers both recognize as low-value duplication of a sitemap rather than a genuine hub page. Explicitly asking for coverage gaps — subtopics no existing post addresses — turns the exercise into a content-planning tool as well as an architecture tool, since a pillar strategy that only reorganizes what already exists will have visible holes the moment a competitor's pillar covers the full topic.`,
    exampleOutput: `Sort: Merge — '1099 vs W2: What's the Difference' and '...Which Should You Hire' cover near-identical ground from different angles; recommend combining into one comparison post before linking. Keep separate — misclassification red flags and 1099-NEC filing mechanics are distinct enough to stand alone. Outline: H2 'What Counts as a 1099 Contractor' (new — no existing post covers legal definition)... Coverage gap: no existing post addresses state-level contractor law variations.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-topic-cluster-internal-linking-map',
    category: 'seo-geo',
    title: `Map internal links across a topic cluster so every page points to the right neighbor, not just back to the pillar`,
    description: `Builds a full internal linking map across a set of cluster pages and their pillar, specifying which pages should link sideways to each other and with what anchor text — not just the standard pillar-to-child pattern.`,
    promptText: `You are building an internal linking map for a topic cluster — the pillar page plus its supporting cluster pages — with a specific focus on sideways links between cluster pages, since most guidance stops at "link every page back to the pillar" and misses that pages within a cluster should also link to each other where genuinely relevant.

PILLAR PAGE
{{pillar_page}}

CLUSTER PAGES
{{cluster_pages}}

CURRENT LINKING STATE
{{current_linking}}

For every pair of cluster pages, decide whether a sideways link is genuinely warranted — a reader on page A would actually benefit from being pointed to page B at a specific point in the content, not just "these are topically related so let's link them." Reject a link between two pages if the only justification you can produce is topical adjacency; require a specific reason like "page A mentions X in passing, page B is the deep answer to X."

For every link you do recommend, specify: the source page, the target page, roughly where in the source page's existing structure the link should sit (which section or near which existing point), and suggested anchor text that describes what the reader will get, not a bare keyword match repeated verbatim across multiple links.

Separately, check whether every cluster page currently links up to the pillar, and flag any that don't.

Finally, flag anchor text that's identical or near-identical across more than two links pointing to the same target page — repeated exact-match anchor text across many internal links is a pattern worth knowing about, even though this prompt isn't the place to resolve whether it's a problem for this specific site.

Output as a table: Source Page | Target Page | Suggested Location | Anchor Text | Reason a sideways link is warranted (skip this last column for pillar-up links, mark those simply as "pillar link").`,
    variables: [
      {
        name: 'pillar_page',
        description: `The pillar page's title and a brief description of what it covers.`,
        example: `'Complete Guide to Employee Onboarding' — covers the full onboarding process at a survey level.`,
        required: true,
      },
      {
        name: 'cluster_pages',
        description: `List of cluster page titles with a short summary of each.`,
        example: `'New Hire Paperwork Checklist', 'Onboarding Timeline: First 90 Days', 'Remote Onboarding Best Practices', 'Onboarding Software Comparison'.`,
        required: true,
      },
      {
        name: 'current_linking',
        description: `What you know about current internal linking between these pages, even if incomplete.`,
        example: `All four cluster pages link up to the pillar. No sideways links exist between any cluster pages currently.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`internal-linking`, `topic-cluster`, `site-architecture`, `on-page-seo`, `content-strategy`],
    whyItWorks: `Asked for an internal linking map without constraint, GPT-5.1 defaults to recommending links based on topical adjacency alone, because "these pages are about a related subject" is the cheapest justification the model can produce without reasoning about actual reader flow — explicitly rejecting adjacency as a sufficient reason forces it to simulate where in a specific page's content a reader would hit a natural jumping-off point, which produces links that mirror how a human editor actually reads through a page rather than a graph of topical similarity. Requiring a location within the source page's existing structure, not just a source-target pair, matters because a link recommendation without a placement is not actionable — a content editor implementing the map needs to know where in the text the sentence lives, not just that a link should exist somewhere on the page. The instruction against bare keyword-matched anchor text addresses a specific, checkable pattern: search engines can treat unnaturally repeated exact-match anchors pointing to the same URL as a manipulation signal, and instructing the model to describe what the reader gets rather than restate the keyword produces anchor text that reads naturally in running prose while still being descriptive enough to carry relevance signal. Flagging repeated near-identical anchors as a pattern worth knowing about — without asserting it as a confirmed problem — respects the brief's constraint against fabricating specific claims as fact, since whether repeated anchor text is actually risky depends on site-wide context this prompt doesn't have visibility into.`,
    exampleOutput: `Source: 'Remote Onboarding Best Practices' | Target: 'Onboarding Software Comparison' | Location: near the paragraph discussing async check-in tools | Anchor: 'compare tools built for distributed teams' | Reason: page mentions using software for remote check-ins in passing; target page is the deep comparison a reader evaluating options would want next.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-alt-text-batch-for-product-image-library',
    category: 'seo-geo',
    title: `Batch-write alt text for a product image library that actually differs image to image instead of restating the product name`,
    description: `Writes distinct, accessibility-first alt text for a batch of product or content images, keyed to what's visually different in each shot, and flags any image where the alt text can't responsibly be more specific than a generic description.`,
    promptText: `Write alt text for a batch of images. Each image entry below includes what's actually visible in the shot — treat this description as ground truth about the image; do not invent visual details that weren't given to you.

IMAGES
{{image_batch}}

PAGE CONTEXT
{{page_context}}

RULES
Every alt text must describe what makes THIS image specifically different from the others in the batch — if two images are both of the same product, the alt text should distinguish them by angle, color, context of use, or whatever the given description actually specifies, not repeat the product name as if it were the whole description. Do not start every entry with "Image of" or "Photo showing" — screen readers already announce that it's an image; that phrasing wastes the reader's time on every single entry. Do not stuff the primary keyword into every alt text if the image doesn't actually depict that keyword's subject — alt text is for the person who can't see the image, not a keyword insertion point, and stuffing a keyword into an alt text that doesn't match the image is a disservice to that reader. If an image's given description is too thin to write anything more specific than a generic description, say so explicitly for that entry rather than inventing plausible-sounding specificity that isn't actually supported by what was described. Keep each alt text under 125 characters where the image content allows it, but do not truncate a genuinely necessary distinguishing detail just to hit that length.

OUTPUT FORMAT
A table: Image ID | Alt Text | Note (only if the alt text had to stay generic due to thin source description, otherwise leave blank).`,
    variables: [
      {
        name: 'image_batch',
        description: `A list of images with what's actually visible in each — filename or ID plus a factual description.`,
        example: `IMG-01: red ceramic mug, side angle, on a wood table with steam rising. IMG-02: same mug, top-down view showing the interior glaze color. IMG-03: mug held in a hand for scale.`,
        required: true,
      },
      {
        name: 'page_context',
        description: `What page these images live on and what the page is about, so alt text can be relevant to context.`,
        example: `Product page for a ceramic mug in a kitchenware line, target keyword 'handmade ceramic coffee mug'.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`alt-text`, `accessibility`, `image-seo`, `on-page-seo`, `content-quality`],
    whyItWorks: `Alt text generated in a single unconstrained batch tends to collapse toward near-identical output across images of the same product, because without an explicit instruction to differentiate, GPT-5.1's most probable completion for "write alt text for this mug photo" is a template built around the product name repeated with minor variation — explicitly requiring each entry to state what makes that specific image different forces the model to actually use the per-image visual details it was given instead of falling back on the shared product description. The ban on "Image of" and "Photo showing" openers targets a specific, well-documented accessibility anti-pattern: screen readers already announce the presence of an image before reading the alt text, so that phrasing is redundant noise on every single row of a batch, wasting a screen reader user's time across an entire product gallery rather than just one image. The instruction against keyword-stuffing images that don't depict the keyword's subject exists because alt text is read aloud to a real person who needs an accurate description, not a hidden ranking signal — an image of a mug's interior glaze does not become more relevant to "handmade ceramic coffee mug" by having that phrase force-inserted into its description, and doing so actively misleads a screen reader user about what they're looking at. Requiring an explicit flag when source description is too thin to be specific counters the model's tendency to hallucinate plausible visual detail (color, material, setting) that wasn't actually confirmed in the input, which matters for alt text specifically because a false visual claim read aloud to a blind user is a more direct harm than the same fabrication in ordinary marketing copy.`,
    exampleOutput: `IMG-01 | Red ceramic mug on a wood table, steam rising from hot coffee | 
IMG-02 | Top-down view of the mug showing the glossy interior glaze | 
IMG-03 | Mug held in hand, showing size relative to an average grip |`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-schema-markup-brief-for-dev-handoff',
    category: 'seo-geo',
    title: `Write a schema markup brief a developer can implement without guessing which fields are required`,
    description: `Turns a page's content into a structured JSON-LD schema brief with the correct schema type, required versus optional properties clearly separated, and a plain-language note on what could go wrong if a field is filled in inaccurately.`,
    promptText: `You are writing a schema.org markup brief for a developer to implement — the developer knows how to write JSON-LD but doesn't know this specific page's content or which schema type actually fits it, so your job is to make both of those decisions explicit and defensible, not just hand over a code block.

PAGE TYPE AND CONTENT
{{page_content}}

EXISTING SCHEMA (IF ANY)
{{existing_schema}}

STEP 1 — SCHEMA TYPE DECISION
Name the specific schema.org type (or types, if nesting applies) that fits this page, and explain in one or two sentences why this type fits better than the next most plausible alternative — do not just declare a type without ruling out the obvious runner-up, since picking between adjacent types (e.g. Product vs. Service, Article vs. BlogPosting, FAQPage vs. QAPage) is often the actual point of confusion.

STEP 2 — PROPERTY BREAKDOWN
List the properties this schema type needs, split into two groups: required for the markup to validate and be eligible for rich results, and optional-but-recommended because they meaningfully improve how the result can display. For each property, state what page content it should be filled from — do not invent placeholder values; if the page content given doesn't actually contain a value for a property, say so and mark it as needing input rather than guessing a number, date, or rating.

STEP 3 — ACCURACY WARNING
For any property where an inaccurate value creates real risk (aggregateRating, price, availability, review count) — not just a validation error but a value that could misrepresent the page to a user or trigger a manual action — add a one-line warning about what happens if that field doesn't match what's actually and visibly true on the rendered page.

OUTPUT FORMAT
1. Schema type decision with reasoning.
2. Property table: Property | Required/Recommended | Source of value | Accuracy warning if applicable.
3. A JSON-LD skeleton with the correct structure and placeholder markers (like <<FROM_CMS_FIELD>>) instead of invented values, ready for a developer to wire up to real data.`,
    variables: [
      {
        name: 'page_content',
        description: `What the page actually contains — its type of content and the real information on it.`,
        example: `A recipe page for a sourdough bread recipe, includes prep time, cook time, ingredient list, and 40 user-submitted star ratings averaging 4.6.`,
        required: true,
      },
      {
        name: 'existing_schema',
        description: `Any schema markup already on the page, if known, so the model can build on or correct it rather than starting blind.`,
        example: `No schema currently implemented on this page.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`schema-markup`, `structured-data`, `technical-seo`, `rich-results`, `dev-handoff`],
    whyItWorks: `The step that requires ruling out the next most plausible schema type exists because the actual difficulty in schema selection is rarely picking a type in isolation — it's distinguishing between two adjacent types that both technically apply, and a model asked simply to "pick the schema type" will name one confidently without surfacing that the choice was close, leaving a developer no way to sanity-check the decision against their own judgment of the page. Splitting properties into required-for-validation versus optional-but-recommended matters because these two categories carry different implementation priority and a flat list forces a developer to separately go look up which is which in Google's documentation — providing the split in the brief itself is what makes this handoff-ready rather than just informative. The instruction to mark a property as needing input rather than guessing a value directly targets a known and costly failure mode: GPT-5.1 will readily invent a plausible aggregateRating, price, or review count if asked to produce complete JSON-LD from thin content, and shipping a fabricated numeric value in structured data is worse than shipping no value at all, since search engines can take manual action against pages whose structured data doesn't match visibly rendered content. The accuracy-warning step is scoped specifically to properties with real consequences rather than applied blanket to every field, because flagging every property equally would train the developer to ignore the warnings — reserving them for rating, price, and availability keeps the signal meaningful exactly where a mismatch is a policy risk rather than a cosmetic one.`,
    exampleOutput: `Schema type: Recipe (not HowTo) — the content is a specific dish with ingredients and yield, not a general multi-step process without a food outcome, which is the distinguishing line between the two types. Property table: name (required, from page title) | prayTime/cookTime (required, from listed prep/cook times) | aggregateRating (recommended, from the 40 ratings averaging 4.6 — WARNING: must match the visibly displayed rating exactly, mismatched aggregateRating is a common trigger for manual structured data actions).`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-landing-page-brief-for-paid-search-match',
    category: 'seo-geo',
    title: `Brief an SEO landing page that stays honest to organic intent while still matching a paid campaign's promise`,
    description: `Drafts a landing page content brief for a page that has to satisfy both organic search intent and a specific paid ad's promise, flagging where the two pull in different directions instead of quietly picking one.`,
    promptText: `This landing page brief is for a page that needs to do two jobs at once: rank organically for a target keyword, and also serve as the destination for a specific paid ad campaign whose promise the page must honor. These two jobs sometimes want different things from the page, and your job includes surfacing that tension, not just resolving it silently.

TARGET KEYWORD AND ORGANIC INTENT
{{target_keyword_intent}}

PAID AD PROMISE
{{ad_promise}}

OFFER DETAILS
{{offer_details}}

COMPETING PAGES CURRENTLY RANKING
{{competing_pages}}

First, check whether the ad promise and the organic search intent actually point to the same page structure. If someone searching organically for this keyword wants a comparison or educational answer, but the ad promise is narrowly about one specific offer, name that mismatch explicitly and propose how the page should be structured to serve the organic visitor first (since they arrived with a broader question) while still surfacing the specific offer prominently enough for the paid visitor who already expects it.

Then produce the actual brief: a heading structure (H1 through H2s) that reflects genuine informational value for the organic searcher, not just ad-copy restated as headings; a note on where in the page the specific paid offer should appear so a paid visitor isn't left hunting for what the ad promised; and a list of trust or proof elements (specifics, not generic claims) the page needs to compete with the currently-ranking pages.

Flag anything in the ad promise that oversells relative to the actual offer details given — if the ad promise claims something the offer details don't support, note it as a mismatch to resolve with the person who owns the ad copy, rather than writing a page that repeats an unsupported claim.

OUTPUT: (1) the intent-versus-promise mismatch check, (2) heading structure with a one-line purpose per heading, (3) offer placement note, (4) trust/proof element list, (5) any ad-promise oversell flag.`,
    variables: [
      {
        name: 'target_keyword_intent',
        description: `The keyword this page needs to rank for, and what someone searching it organically is actually trying to find out.`,
        example: `'best project management software for agencies' — organic searchers are comparing multiple options, not committed to one.`,
        required: true,
      },
      {
        name: 'ad_promise',
        description: `What the paid ad copy specifically promises, word for word if possible.`,
        example: `Ad headline: 'Cut Agency Reporting Time in Half — Free 14-Day Trial'.`,
        required: true,
      },
      {
        name: 'offer_details',
        description: `What the actual offer supports, so the model can check it against the ad promise.`,
        example: `14-day free trial is real; the 'cut reporting time in half' figure comes from a single customer case study, not a guaranteed average result.`,
        required: true,
      },
      {
        name: 'competing_pages',
        description: `What's currently ranking for the target keyword, briefly.`,
        example: `Top 3 results are comparison roundups from review sites, not single-vendor product pages.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`landing-page`, `seo-ppc-alignment`, `conversion-copywriting`, `content-brief`, `search-intent`],
    whyItWorks: `A landing page brief that treats organic intent and paid ad promise as automatically aligned produces pages that satisfy neither audience well, because the two traffic sources genuinely can want structurally different things — an organic searcher for a broad comparison keyword arrives expecting to evaluate options, while a paid visitor arrives already primed by a specific claim and expects to find exactly that claim fulfilled immediately; asking GPT-5.1 to check for this mismatch before drafting anything prevents it from defaulting to whichever framing it read first (usually the ad promise, since it's stated more narrowly and is easier to write headings around). Requiring the heading structure to reflect genuine informational value rather than ad copy restated as headings counters a common and checkable failure mode where a model asked to write "SEO headings" for a page whose main brief is an ad promise will just rephrase the ad's claims into H2 format, producing a page that reads as promotional to an organic visitor who arrived wanting a comparison, and that mismatch between apparent intent and actual content is exactly what search engines' intent-matching increasingly penalizes. The instruction to flag ad-promise oversell against the given offer details is the load-bearing accuracy control here: without it, the model will simply carry the ad's claim through into page copy, and if that claim isn't actually supported by the offer details, the page repeats and amplifies an overstatement rather than surfacing it as something the ad-copy owner needs to resolve — the brief's job is to catch this before it compounds across both the ad and the landing page.`,
    exampleOutput: `Mismatch check: organic searchers want a comparison; ad promise is single-offer specific. Recommend leading with a brief honest comparison framework (3-4 evaluation criteria) before narrowing to our offer, so organic visitors don't bounce feeling sold-to immediately. Oversell flag: 'cut reporting time in half' is based on one case study, not an average — recommend the page state it as 'one agency reported cutting reporting time in half' rather than implying a typical guaranteed result.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-serp-intent-strategy-before-drafting',
    category: 'seo-geo',
    title: `Read the actual SERP for a target keyword before deciding what kind of page to write`,
    description: `Analyzes what's currently ranking for a keyword — result types, format patterns, and what questions are already answered — to decide what kind of page is worth building before a single word of content gets drafted.`,
    promptText: `Before I write anything for this keyword, analyze the current SERP as it actually is, not what I assume it should be.

TARGET KEYWORD
{{target_keyword}}

CURRENT TOP RESULTS (titles, formats, brief description of what each covers)
{{current_serp}}

WHAT WE'D WANT TO PUBLISH
{{intended_content}}

PHASE 1 — READ THE SERP AS EVIDENCE OF INTENT
Look at the actual result types occupying the top of this SERP (listicles, single-product pages, forums, comparison tools, video, tool/calculator pages) and use that mix as direct evidence of what Google's ranking systems currently believe searchers want — do not override this evidence with an assumption about what intent "should" be for this keyword. If the results are mixed (some commercial, some informational), say so explicitly rather than forcing a single clean intent label onto an ambiguous SERP.

PHASE 2 — GAP CHECK
Check whether our intended content format actually matches what's currently ranking. If we planned a blog post but the SERP is dominated by interactive tools or forum threads, name that mismatch directly — this is the single most common reason a well-written page fails to rank, and it needs to be caught before drafting starts, not after.

PHASE 3 — DIFFERENTIATION CHECK
Among the results that do match our intended format, identify what none of them currently do — a specific angle, level of specificity, or structural element absent from all of the current top results. Do not suggest "be more comprehensive" as the differentiation; name an actual specific thing to include that isn't already there.

PHASE 4 — RECOMMENDATION
Give a clear go/reconsider/no-go recommendation on the originally intended content format, with the reasoning stated in one paragraph a content lead could relay to a stakeholder without further explanation.`,
    variables: [
      {
        name: 'target_keyword',
        description: `The keyword you're deciding whether and how to target.`,
        example: `how to calculate freelance hourly rate`,
        required: true,
      },
      {
        name: 'current_serp',
        description: `What's actually ranking right now for this keyword — as many of the top results as you can describe.`,
        example: `Position 1: interactive rate calculator tool. Position 2: Reddit thread with 200+ comments. Position 3: blog post with a formula and worked example. Position 4-5: more calculator tools.`,
        required: true,
      },
      {
        name: 'intended_content',
        description: `What you were planning to publish before checking the SERP.`,
        example: `A 1,500-word blog post explaining the formula for calculating hourly freelance rate.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`serp-analysis`, `search-intent`, `content-planning`, `keyword-strategy`, `seo-strategy`],
    whyItWorks: `The instruction to treat the actual SERP composition as evidence rather than override it with an assumed intent label directly counters GPT-5.1's default behavior when asked to classify search intent, which is to reach for one of the standard four-way taxonomy labels (informational, navigational, commercial, transactional) even when the real SERP is genuinely mixed — forcing the model to describe the SERP as evidence first prevents it from flattening a legitimately ambiguous ranking pattern into a false certainty. The gap check in phase 2 exists because the most common and most expensive content-strategy mistake is deciding on a format before checking what format Google is actually already rewarding for that specific query — a blog post can be well-researched and well-written and still structurally lose to a SERP dominated by interactive tools, and catching that mismatch before drafting saves the actual writing effort rather than diagnosing the failure after publication when traffic doesn't materialize. Banning "be more comprehensive" as a differentiation answer matters because it's the single most common non-answer a model gives when asked what's missing from a set of ranking pages — it sounds like actionable advice but names nothing a writer could actually go implement, whereas requiring a specific named element forces the model to actually compare the given result descriptions against each other rather than defaulting to generic completeness advice. The final go/reconsider/no-go framing, rather than an openended discussion, respects that this prompt is meant to inform a real resourcing decision before writing time is spent, and a content lead needs a clear recommendation to act on, not just an analysis to interpret.`,
    exampleOutput: `Phase 1: SERP is mixed — two calculator tools, one forum thread, one blog post, suggesting Google is satisfying multiple sub-intents (some want an instant number, some want community discussion, some want the underlying logic). Phase 2: intended blog-post format does match the one blog post already ranking at position 3, so format isn't a blocker. Phase 3: none of the current top results explain how to adjust the rate formula for different tax situations (W-2 vs 1099) — that's a specific, missing angle. Recommendation: go, with the tax-situation adjustment as the differentiating section.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-content-decay-triage-from-traffic-drop',
    category: 'seo-geo',
    title: `Triage a page's traffic drop into an actual cause before rewriting anything`,
    description: `Works through a declining page's traffic data and content history to identify the most likely cause of the decay — outdated information, SERP feature displacement, cannibalization, or a real ranking drop — before committing to a rewrite.`,
    promptText: `A page's traffic has dropped and I need to figure out why before deciding whether a rewrite is even the right fix. Walk through this as a triage, ruling causes in or out based on the evidence given, not defaulting to "refresh the content" as the answer before checking.

PAGE AND TRAFFIC HISTORY
{{traffic_history}}

CONTENT AGE AND LAST UPDATE
{{content_age}}

WHAT ELSE CHANGED AROUND THE DROP
{{context_changes}}

OTHER PAGES ON THE SITE THAT MIGHT OVERLAP
{{potential_cannibalization}}

CHECK THESE CAUSES IN ORDER, using only the evidence given — do not assume a cause you can't support from what's provided, and say explicitly which causes you can't confirm or rule out with the current information:

1. Cannibalization — did another page on the site start ranking for the same keyword around when this one dropped, splitting traffic rather than losing it?
2. SERP feature displacement — did a new SERP feature (AI overview, featured snippet, a new result type) appear around the drop date that could be taking clicks without this page's ranking position actually falling?
3. Genuine ranking drop — did the position itself fall, and if so, does the timing line up with anything else that changed (a core algorithm update, a competitor publishing something new, a technical site change)?
4. Content staleness — is the actual information on the page now outdated in a way a visitor or Google would notice, separate from ranking position?

For whichever cause the evidence best supports, state what specific fix follows from that specific cause — a rewrite is the right fix only for genuine ranking drops tied to content quality or for content staleness; it's the wrong fix for cannibalization or SERP feature displacement, which need a different kind of intervention entirely.

Output as: a checked/unchecked/insufficient-evidence status for each of the four causes with your reasoning, then a single recommended next action tied to whichever cause is best supported.`,
    variables: [
      {
        name: 'traffic_history',
        description: `The page and how its traffic or ranking position has changed over time.`,
        example: `Blog post ranked position 3 for 8 months, organic clicks dropped 60% over the last 6 weeks; average position reported as still around 4-5.`,
        required: true,
      },
      {
        name: 'content_age',
        description: `How old the content is and when it was last substantively updated.`,
        example: `Published 14 months ago, no updates since, references pricing that changed 3 months ago.`,
        required: true,
      },
      {
        name: 'context_changes',
        description: `Anything else you know changed around the time of the drop — algorithm updates, site changes, new competitors.`,
        example: `No known site-wide technical changes; unsure if there was a relevant algorithm update in that window.`,
        required: false,
      },
      {
        name: 'potential_cannibalization',
        description: `Other pages on the site that might target the same or similar keyword.`,
        example: `A newer post published 2 months ago covers a very similar topic with a different title.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`content-decay`, `traffic-analysis`, `seo-diagnosis`, `content-audit`, `keyword-cannibalization`],
    whyItWorks: `The instruction to check causes in a specific order rather than jumping to a conclusion counters the strongest default behavior GPT-5.1 has around traffic-drop questions, which is to reach immediately for "the content is outdated, refresh it" because that's the most common advice pattern in SEO content the model was trained on — but that diagnosis is frequently wrong, since a stable or even improving average position paired with a real traffic drop is actually the signature of cannibalization or SERP feature displacement, not content staleness, and applying a rewrite to that situation wastes real effort while leaving the actual cause (a competing internal page, or a new AI overview eating clicks) untouched. Requiring the model to explicitly mark a cause as "insufficient evidence" rather than confirming or denying it on a guess is the load-bearing accuracy control, since the input data given here is often genuinely incomplete (no algorithm-update timeline, no cannibalization check run yet), and a model under pressure to give a confident diagnosis will otherwise fill that gap with a plausible-sounding but unverified explanation. Tying the final recommendation explicitly to the specific cause identified — rather than giving a generic list of things that might help — is what makes this triage actionable rather than just descriptive, since a cannibalization fix (consolidate or differentiate the two competing pages) and a staleness fix (update specific facts) are different work with different owners, and conflating them under one "refresh the content" recommendation would send the wrong team down the wrong path.`,
    exampleOutput: `Cannibalization: likely — a newer post on a very similar topic was published 2 months ago, right before the traffic decline started, and average position for the original page has stayed roughly flat, which fits a traffic-splitting pattern better than a genuine ranking loss. SERP feature displacement: insufficient evidence — no information given on whether a new SERP feature appeared. Genuine ranking drop: unlikely — average position hasn't meaningfully changed. Content staleness: partially relevant but secondary — outdated pricing should be fixed regardless. Recommended action: audit whether the newer post targets the same primary keyword; if so, consolidate or differentiate them rather than rewriting the original page first.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-ai-overview-visibility-audit',
    category: 'seo-geo',
    title: `Audit why a page isn't getting cited in AI search overviews even though it ranks organically`,
    description: `Compares a page's structure and phrasing against what AI-generated search summaries tend to extract and cite, identifying specific structural or phrasing reasons it's likely being skipped rather than treating AI visibility as a black box.`,
    promptText: `This page ranks reasonably well in traditional organic search but I have reason to believe it isn't being cited or pulled into AI-generated search overviews for its target query. Help me figure out specific, structural reasons why, based on what's actually on the page — not a generic list of "AI visibility best practices."

PAGE CONTENT AND STRUCTURE
{{page_structure}}

TARGET QUERY
{{target_query}}

WHAT'S CURRENTLY BEING CITED INSTEAD (if known)
{{competing_citations}}

Analyze the page against these specific extraction-friendliness factors, and for each one state whether this page's current structure helps or hurts, with a direct quote or close paraphrase from the given content as evidence:

1. Does the page state a direct, self-contained answer to the target query within the first few sentences of a section, or does it bury the answer inside a longer narrative paragraph that requires reading several sentences of setup first?
2. Is there a clearly delimited section (a heading, a list, a table) that maps almost one-to-one onto the query, or is the relevant information scattered across multiple sections that a summarization system would have to stitch together?
3. Does the page state specific facts, numbers, or named entities plainly, or does it hedge everything in a way that makes a clean, quotable extraction hard to produce?
4. If competing citations are known, what do they do differently in the specific excerpt likely being pulled — do not guess at their overall page quality, focus only on what's extractable from the excerpt itself.

Do not recommend keyword stuffing or manipulative phrasing intended to game extraction — the goal is stating things plainly and structuring them clearly, not gaming an algorithm.

OUTPUT: for each of the four factors, a helps/hurts verdict with the supporting evidence, followed by two or three specific edits (not a full rewrite) that would most directly improve extraction-friendliness for this exact query.`,
    variables: [
      {
        name: 'page_structure',
        description: `The page's actual content and heading structure, or enough of it to evaluate extraction-friendliness.`,
        example: `H1: 'Guide to Business Insurance'. The relevant answer to 'how much does general liability insurance cost' is mentioned in paragraph 4 of a 'What Affects Your Premium' section, embedded mid-paragraph after two sentences of context about risk factors.`,
        required: true,
      },
      {
        name: 'target_query',
        description: `The specific query you want the page to be cited for in AI overviews.`,
        example: `how much does general liability insurance cost for a small business`,
        required: true,
      },
      {
        name: 'competing_citations',
        description: `What page or source is currently being cited instead, if you know.`,
        example: `A competitor's page has a clearly labeled 'Average Cost' subheading followed immediately by a specific dollar range.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`ai-search-visibility`, `generative-engine-optimization`, `content-structure`, `answer-engine-optimization`, `seo-strategy`],
    whyItWorks: `Asked generically "how do I improve AI search visibility," GPT-5.1 tends to produce a checklist of best practices detached from the specific page in question — requiring it to evaluate the actual given content against four named extraction-friendliness factors, with a quote as evidence for each verdict, forces it to reason about this specific page's actual structure rather than restate generic advice that would apply equally to any page. The first factor — whether the answer is stated directly near the top of a section versus buried in narrative setup — targets the real mechanical reason summarization systems skip technically-correct content: extraction systems favor self-contained, front-loaded statements because they can be lifted cleanly without needing surrounding context to make sense, and a well-written page that builds up to its point through several sentences of context is often harder to extract from than a blunter, less elegant paragraph, even though the blunter version reads worse to a human. The instruction to compare only the specific competing excerpt rather than judge a competitor's overall page quality keeps the analysis honest and narrow — a competitor's page being cited doesn't mean the whole page is better, it means one specific excerpt was more extractable, and conflating the two would misdirect the edit recommendations toward a full competitive rewrite instead of the two or three targeted structural changes that actually matter. Explicitly banning keyword stuffing or manipulative phrasing as a recommended fix matters because the actual lesson from how extraction-friendly content performs is that stating things plainly and structuring them clearly is what helps — gaming language patterns doesn't reliably improve citation and actively degrades the page for human readers, so ruling it out keeps the recommendations aligned with what's actually earning citations rather than what merely looks like an SEO trick.`,
    exampleOutput: `Factor 1 (direct answer): hurts — the cost figure is mentioned mid-paragraph after two sentences about risk factors rather than stated as the section's opening claim. Factor 2 (delimited section): hurts — no subheading maps directly to 'cost,' it's folded into a broader 'What Affects Your Premium' section. Recommended edit: add a subheading literally reading 'Average Cost' immediately followed by the specific dollar range as the first sentence underneath it, mirroring the structural pattern the competing citation already uses.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-citation-building-plan-for-llm-mentions',
    category: 'seo-geo',
    title: `Plan where to place genuinely citable facts so an LLM has a real reason to mention your brand`,
    description: `Builds a citation-building plan focused on placing specific, verifiable facts and data points in places an AI model would actually draw from, rather than a generic PR or backlink outreach list.`,
    promptText: `I want a plan for increasing the odds our brand gets mentioned or cited when people ask AI models questions in our space — not a generic backlink or PR outreach list, specifically a plan built around what would make an AI model have an actual reason to reference us.

OUR BRAND AND WHAT WE ACTUALLY KNOW
{{brand_and_expertise}}

WHO CURRENTLY GETS CITED IN THIS SPACE
{{current_citations}}

WHAT WE HAVEN'T PUBLISHED YET
{{unpublished_assets}}

START FROM THIS PRINCIPLE: models cite sources that contain a specific, checkable fact, statistic, or original data point tied to a query — not sources that are simply well-known or well-optimized in the traditional SEO sense. Given that, do the following:

1. Identify what specific, genuinely original data or facts we actually possess (from the brand and expertise details given) that nobody else in this space has published in a citable form yet. Do not invent a statistic we don't have — if the input doesn't describe an actual data point we hold, say so and note that this is the gap to fill before a citation plan can work.
2. For each real data point identified, name the specific query or question it would be the best possible answer to, and where it should be published so it's structured as a directly citable answer (a labeled stat with source and date, not folded into a longer narrative).
3. Compare against what's currently getting cited — is it winning because of a genuinely stronger fact, or just because of a first-mover advantage or brand recognition? Say which, since only the first case tells us we need a better fact, not just any publication.
4. Flag anything in our unpublished assets that looks like it could become a citable data point once it's published, and what minimal packaging it would need.

OUTPUT: numbered plan following the four steps above, ending with a one-paragraph honest assessment of whether our current data actually supports a strong citation play in this space or whether more original research is the real prerequisite.`,
    variables: [
      {
        name: 'brand_and_expertise',
        description: `What your brand actually knows or has access to — real data, survey results, proprietary analysis, case studies.`,
        example: `We've processed 50,000 freelance invoices through our platform and could report an actual average payment delay by industry, but haven't published this analysis anywhere yet.`,
        required: true,
      },
      {
        name: 'current_citations',
        description: `Who or what currently gets cited or referenced for topics in your space.`,
        example: `A well-known industry association's annual report gets cited repeatedly for freelance payment statistics, even though it's two years old.`,
        required: true,
      },
      {
        name: 'unpublished_assets',
        description: `Any data, research, or analysis you have internally that hasn't been published in any public form yet.`,
        example: `Internal dashboard showing payment delay by industry and by client company size, currently only used for our own product analytics.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`ai-citations`, `generative-engine-optimization`, `digital-pr`, `original-research`, `brand-visibility`],
    whyItWorks: `Asked generically for a citation-building or GEO plan, GPT-5.1 tends to produce a repackaged backlink-outreach or digital-PR checklist, because that's the closest well-represented pattern in its training data for "getting mentioned online" — explicitly starting from the principle that models cite specific checkable facts rather than well-known sources redirects the model away from that template and toward reasoning about what your brand actually possesses that's citable, which is a fundamentally different and narrower question. The instruction not to invent a statistic the brand doesn't actually have is the load-bearing accuracy control in this prompt, because a plan built on a fabricated data point isn't a plan at all — it's a suggestion to publish something false, and the brief this prompt operates under specifically requires never presenting invented statistics as fact; forcing the model to say "this is a gap, not a plan" when the input lacks real data keeps the output honest even when the honest answer is less satisfying than a confident list of tactics. Requiring the model to distinguish whether current citations win on a genuinely stronger fact versus first-mover advantage or brand recognition matters because these two situations call for different responses — if the association's report is cited mainly because of prior brand recognition, a strategy of "give AI models something better cited" can genuinely displace it, but if it's cited because no competing data exists, publishing something is the prerequisite over publishing something more optimized. The closing honest-assessment requirement counters the natural pull toward ending on an upbeat, actionable-sounding note even when the actual input reveals the brand doesn't yet have a strong citation play — which is a real and useful answer a stakeholder needs to hear before investing in a plan built on a data gap.`,
    exampleOutput: `1. Real data point: average freelance payment delay by industry, drawn from 50,000 processed invoices — not currently published anywhere. 2. Best-fit query: 'average time to get paid as a freelancer by industry' — should be published as a standalone, dated, labeled statistics page, not folded into a blog post. 3. Current citations (the industry association's 2-year-old report) appear to win mainly on brand recognition and recency of nothing better existing, not because their underlying data is stronger — a fresher, more granular data set has a real chance of displacing them. 4. Honest assessment: the underlying data exists and is strong; the actual blocker is that it's never been packaged as a citable public asset, so the real next step is publication, not further research.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'seo-geo-content-quality-rubric-for-editorial-review',
    category: 'seo-geo',
    title: `Build an editorial quality rubric specific enough that two different reviewers would score the same draft the same way`,
    description: `Creates a content quality scoring rubric tailored to your specific content type and goals, with criteria concrete enough that inconsistent reviewers become a solvable problem instead of a permanent one.`,
    promptText: `Build a content quality rubric for reviewing drafts before publication. The goal is a rubric specific enough that two different reviewers scoring the same draft independently would land on close to the same score — not a generic "clarity, accuracy, engagement" rubric that leaves too much to individual reviewer judgment.

CONTENT TYPE
{{content_type}}

WHAT GOOD ALREADY LOOKS LIKE (an example if you have one)
{{good_example}}

WHAT'S ACTUALLY GONE WRONG BEFORE
{{past_failures}}

For each criterion in the rubric, write it so that a reviewer could point to a specific passage in the draft and say definitively whether it passes or fails that criterion — reject any criterion that would require the reviewer's subjective taste to resolve (like "is it engaging") unless you can restate it as something checkable (like "does the opening paragraph state a specific claim within the first two sentences, rather than a general framing that could apply to any article on this topic").

Build the rubric directly around the past failures given — if a specific kind of mistake has actually happened before, there should be a criterion that would have caught it, stated precisely enough to catch the same mistake again, not just a generic quality dimension that happens to be adjacent to it.

Use a 3-point scale per criterion (fails / partially meets / meets) rather than a 10-point scale, since finer gradations on subjective judgment add false precision without actually making reviewers more consistent with each other.

OUTPUT FORMAT
1. The rubric as a table: Criterion | What "fails" looks like (specific) | What "meets" looks like (specific) | Which past failure (if any) this criterion was built to catch.
2. A one-paragraph note on any quality dimension you deliberately left out of the rubric because it couldn't be made concrete enough to score consistently, so it's tracked as a known gap rather than silently dropped.
3. A suggested pass threshold (e.g. no criterion below "partially meets," or a minimum count of "meets") for what counts as publishable.`,
    variables: [
      {
        name: 'content_type',
        description: `What kind of content this rubric is for.`,
        example: `Long-form SEO blog posts (1,200-2,500 words) written by a mix of in-house writers and freelancers.`,
        required: true,
      },
      {
        name: 'good_example',
        description: `An example of a draft or published piece that represents what good looks like, if available.`,
        example: `Our 'switching payroll providers' guide — specific numbers throughout, named real scenarios, no generic filler paragraphs.`,
        required: false,
      },
      {
        name: 'past_failures',
        description: `Specific things that have actually gone wrong with past drafts, as concretely as you can state them.`,
        example: `A freelancer submitted a draft that repeated the same point in three different sections using different phrasing, padding the word count without adding information; another draft made a specific pricing claim that turned out to be outdated by the time it published.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`content-quality`, `editorial-process`, `content-review`, `quality-rubric`, `editorial-standards`],
    whyItWorks: `Generic content rubrics built around dimensions like "clarity" and "engagement" fail at the one job a rubric exists to do — producing consistent scores across different reviewers — because those words don't resolve to a checkable observation in the text, so two reviewers with different personal taste will genuinely disagree on the same draft even when both are acting in good faith; requiring every criterion to be restatable as something a reviewer could point to a specific passage and definitively check forces GPT-5.1 to translate vague quality language into an operational test, which is the actual mechanism that makes inter-reviewer consistency possible. Building the rubric directly around named past failures rather than a generic quality checklist matters because a rubric that doesn't specifically target the mistakes that have actually happened will keep letting them through — a generic "originality" criterion doesn't reliably catch a draft that pads word count by restating the same point three ways, but a criterion asking "does any section restate a point already made elsewhere in different words" catches exactly that failure by name. Capping the scale at 3 points rather than defaulting to a 10-point scale, which is GPT-5.1's more common default for rubric requests, directly addresses a known measurement problem: finer gradations on an inherently subjective judgment create an illusion of precision without actually improving reviewer agreement, since the extra distinctions between, say, a 6 and a 7 are exactly the kind of judgment call the rest of this rubric is designed to eliminate. Requiring an explicit note on dimensions deliberately left out keeps the rubric honest about its own limits rather than silently pretending it covers every aspect of quality, which matters operationally because a content team needs to know a real quality dimension is being tracked outside the rubric, not assume the rubric is complete just because it exists.`,
    exampleOutput: `Criterion: 'Redundancy check' | Fails: same core point restated in two or more sections using different wording without adding new information | Meets: each section advances the argument with new information, no repeated point | Built to catch: freelancer draft that padded word count via repetition. Pass threshold: no criterion below 'partially meets,' and at least two-thirds of criteria at 'meets.' Left out: overall 'brand voice fit' — too dependent on reviewer-specific taste to make checkable without a much larger style guide than given here; tracked as a known gap, not silently dropped.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
