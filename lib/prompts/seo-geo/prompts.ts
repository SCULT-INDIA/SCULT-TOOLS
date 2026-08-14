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
]
