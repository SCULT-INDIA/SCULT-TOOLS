import type { BlogPost } from '../types'

const SLUG = "content-audit-without-enterprise-seo-tool"

/**
 * Generated from content-engine/05-drafts/article_082.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "How to Run a Content Audit Without an Enterprise SEO Tool",
  h1: "How to run a content audit without an enterprise SEO tool",
  targetKeyword: "content audit without enterprise seo tool",
  description: "A step-by-step content audit process for small teams using Screaming Frog's free tier, Google Search Console, Sheets, and a free word counter.",
  dek: "A full content audit is possible with zero SEO software budget: Screaming Frog's free tier crawls up to 500 URLs, which covers most small-business sites; Google Search Console and Google Analytics supply the performance data an enterprise tool would otherwise charge for; and Google Sheets (or Airtable) holds the inventory. The workflow takes longer to set up than an enterprise dashboard but costs nothing and works for any team under roughly 500 published URLs.",
  sections: [
    {
      heading: "Content audit vs SEO audit: what you're actually doing",
      body: [
        ["These two terms get used interchangeably, and that confusion wastes time before a small team even starts. A ", { text: "technical/SEO audit", bold: true }, " looks at crawlability, indexation, and on-page/technical factors — is Google able to find and read your pages at all. A ", { text: "content audit", bold: true }, " inventories and evaluates the content itself: relevance, performance, gaps, and duplication (", { text: "Fact & Form", href: "https://factandform.com/seo-audit-vs-content-audit-differences/", external: true }, ", ", { text: "Syptus", href: "https://www.syptus.com/blog/content-vs-seo-audit-what-is-the-difference/", external: true }, "). You need both eventually, but a content audit is the cheaper, faster one to run first for a small team, because it doesn't require deep technical tooling — mostly a crawl, a spreadsheet, and your existing analytics."],
        ["Semrush's standalone Content Audit tool has actually been discontinued as a dedicated product (", { text: "Semrush", href: "https://pt.semrush.com/content_tool", external: true }, "), which is itself a useful data point: even the enterprise platforms have moved away from treating \"content audit\" as a tool you buy and toward treating it as a process you run using data you already have access to."],
      ],
    },
    {
      heading: "The free tool stack that replaces a paid platform",
      body: [
        ["The stack that shows up consistently across practitioner guides is:"],
        ["1. ", { text: "Screaming Frog (free tier)", bold: true }, " — crawls and inventories every URL, title tag, meta description, word count, and internal link on the site. The free version caps at 500 URLs, which is enough for the overwhelming majority of small-business and blog sites (", { text: "GoMega", href: "https://www.gomega.ai/blog/screaming-frog-seo-audit/", external: true }, ", ", { text: "Mike Ginley", href: "https://www.mikeginley.com/blog/seo-content-audit/", external: true }, ")."],
        ["2. ", { text: "Google Search Console", bold: true }, " — free performance data: clicks, impressions, average position, and which queries actually drive traffic to each page."],
        ["3. ", { text: "Google Analytics", bold: true }, " — engagement data: time on page, bounce/engagement rate, conversion events tied to specific URLs."],
        ["4. ", { text: "Google Sheets (or Airtable)", bold: true }, " — where the crawl export and the performance data get merged into one prioritized inventory. Airtable's generous free tier can import a Screaming Frog crawl export directly for a more structured, filterable inventory than a flat spreadsheet (", { text: "theStacc", href: "https://thestacc.com/blog/best-content-inventory-tools/", external: true }, ")."],
        ["If a site is larger than 500 URLs and Screaming Frog's free tier won't cover it, ", { text: "SiteOne Crawler", bold: true }, " and ", { text: "Google Lighthouse", bold: true }, " are cited as no-cost crawler alternatives for the basic technical checks a paid crawler would otherwise handle (", { text: "Prerender.io", href: "https://prerender.io/blog/screaming-frog-alternative/", external: true }, ")."],
      ],
    },
    {
      heading: "Step-by-step: running the audit",
      body: [
        ["1. ", { text: "Crawl the site.", bold: true }, " Run Screaming Frog's free crawl to export every live URL along with title, meta description, word count, status code, and canonical tag."],
        ["2. ", { text: "Pull performance data.", bold: true }, " Export Search Console's Pages report (clicks, impressions, average position over the last 12–16 months) and match it to the crawl by URL."],
        ["3. ", { text: "Pull engagement data.", bold: true }, " Add Analytics engagement metrics for the same URL set."],
        ["4. ", { text: "Merge into one sheet.", bold: true }, " One row per URL, columns for the crawl data plus the performance data."],
        ["5. ", { text: "Score each page.", bold: true }, " Flag pages as keep, update, consolidate, or remove, based on a combination of traffic, relevance to current business priorities, and content quality."],
        ["6. ", { text: "Prioritize.", bold: true }, " Sort by traffic potential and effort so the highest-impact, lowest-effort fixes surface first."],
        ["7. ", { text: "Write the plan.", bold: true }, " A short executive summary of the 3–5 highest-impact findings plus a 30/60/90-day roadmap is the recommended minimum deliverable, even for an internal audit with no external client (", { text: "Rankz", href: "https://rankz.co/blog/how-to-do-an-seo-audit-reddit/", external: true }, ")."],
        ["Auditing doesn't have to happen all at once. Lullabot's guidance for teams with limited bandwidth recommends working section by section rather than attempting a full-site audit in one pass — a team can audit the blog this month and the product pages next month, and still make real progress (", { text: "Lullabot", href: "https://www.lullabot.com/articles/content-audits-heavy-lift-huge-payoff", external: true }, ")."],
      ],
    },
    {
      heading: "Organizing the spreadsheet",
      body: [
        ["HubSpot's guidance on running a content audit recommends a column structure built around URL, issue, impact, effort, owner, and status, with findings grouped by content type so priorities are visible at a glance rather than buried in a 2,000-row flat list (", { text: "HubSpot", href: "https://blog.hubspot.com/marketing/company-content-audit", external: true }, "). A practical column set:"],
        ["– URL", " ", "– Page title", " ", "– Word count", " ", "– Publish/update date"],
        ["– Search Console clicks (trailing 12 months)"],
        ["– Search Console average position", " ", "– Primary target keyword (if known)"],
        ["– Issue (thin, outdated, duplicate, cannibalizing another page, technically broken)"],
        ["– Impact (high/medium/low)", " ", "– Effort (high/medium/low)"],
        ["– Recommended action (keep, update, consolidate, remove)"],
        ["– Owner", " ", "– Status", " ", "Free Search Console and Analytics data can substitute for a paid rank tracker's metrics in a basic audit — clicks, impressions, and average position tell you almost everything a rank-tracking subscription would tell you at the individual-page level, just without daily granularity (", { text: "HubSpot", href: "https://blog.hubspot.com/marketing/company-content-audit", external: true }, ")."],
      ],
    },
    {
      heading: "Spotting thin content without a paid tool",
      body: [
        ["Thin content is one of the easiest things to flag for free. Running a word-count check across every page — using a free tool like a website word counter — and cross-referencing low word counts against Search Console performance data quickly surfaces pages that are both short and underperforming, which is usually the highest-priority cleanup list on the sheet (", { text: "Website Word Counter", href: "https://websitewordcounter.com/", external: true }, "). A page under roughly 300 words with near-zero Search Console impressions is a strong candidate for either expansion or consolidation into a stronger page."],
        ["Consolidation is worth calling out specifically: merging several lower-ranking, overlapping posts into one comprehensive pillar page is described as one of the more effective moves available to small, resource-constrained teams — it concentrates whatever link equity and relevance signal those pages had individually into a single stronger asset, instead of leaving three thin posts to compete with each other (", { text: "Neal Schaffer", href: "https://nealschaffer.com/content-audit/", external: true }, ")."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Illustrative example (labeled as such):", bold: true }, " A three-person marketing team at a 40-page small-business site runs a Screaming Frog crawl in under 20 minutes, exports it, and merges it with a 16-month Search Console pull. Sorting by word count reveals nine pages under 250 words, six of which cover overlapping topics (\"what is X,\" \"X explained,\" \"X guide\"). The team merges those six into two comprehensive guides, redirects the old URLs, and rewrites the three remaining thin pages that had unique, non-overlapping topics. Total tool cost: $0. Total time: roughly one working day for the crawl-and-merge step, spread across a week for the actual content work."],
        [{ text: "Sourced pattern:", bold: true }, " The workflow combining Screaming Frog's free crawl with Google Sheets is documented directly as a practitioner pattern by Mike Ginley, specifically framed as a free alternative for teams that can't justify Semrush or Ahrefs pricing (", { text: "Mike Ginley", href: "https://www.mikeginley.com/blog/seo-content-audit/", external: true }, ")."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– Screaming Frog's free tier crawl limit is 500 URLs, confirmed as sufficient for most small-business sites (", { text: "GoMega", href: "https://www.gomega.ai/blog/screaming-frog-seo-audit/", external: true }, ")."],
        ["– Semrush discontinued its standalone Content Audit tool as a product (", { text: "Semrush", href: "https://pt.semrush.com/content_tool", external: true }, ") — a signal that even paid-platform vendors treat this as a process, not a single tool."],
        ["– A commonly cited audit cadence is one full audit per year layered with quarterly mini-audits on top-traffic/top-revenue pages (", { text: "Portent", href: "https://portent.com/blog/content/how-often-you-need-to-audit-content-to-stay-on-top.htm", external: true }, ")."],
        ["– No independently verified industry-wide statistic on \"average cost saved by DIY content audits vs. paid tools\" was found during this research pass — that specific claim is evidence not sufficiently verified, and this article does not state a dollar figure for it."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        ["### Screaming Frog vs Semrush for a content audit"],
        ["Screaming Frog's free tier handles the crawl/inventory step that a paid platform like Semrush would otherwise charge a monthly subscription for, provided the site is under 500 URLs. Semrush (where still used) adds convenience — automated reporting, integrated keyword data, one dashboard — but for a site that fits inside the free crawl limit, the free stack produces comparable raw data at zero cost, just with more manual merging work."],
        ["### Content audit vs SEO audit", " ", "A content audit asks \"is this page worth keeping, updating, or removing.\" An SEO audit asks \"can search engines even find and read this page.\" Skipping the SEO audit and doing only a content audit risks investing rewrite effort into pages that have an underlying crawl/indexation problem the content quality never gets a chance to fix (", { text: "Fact & Form", href: "https://factandform.com/seo-audit-vs-content-audit-differences/", external: true }, ")."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["Freelance SEO consultants working with small-business clients who have no software budget are a clear, sourced audience for this exact workflow — several of the practitioner guides reviewed here are explicitly framed for consultants advising clients who can't justify enterprise tool pricing (", { text: "Rankz", href: "https://rankz.co/blog/how-to-do-an-seo-audit-reddit/", external: true }, "). A startup marketing team of one or two people preparing for a content refresh before a product relaunch is another common real-world scenario the free-tool workflow fits well, since the audit doesn't require procurement approval for new software."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– ", { text: "Auditing the whole site at once", bold: true }, " with no bandwidth plan, and abandoning the project halfway — section-by-section auditing is the recommended alternative for small teams (", { text: "Lullabot", href: "https://www.lullabot.com/articles/content-audits-heavy-lift-huge-payoff", external: true }, ")."],
        ["– ", { text: "Treating word count as the only quality signal.", bold: true }, " Low word count is a useful flag, not a verdict — some short pages (a clear how-to, a definition page) are genuinely fine at 300 words."],
        ["– ", { text: "Skipping the Search Console pull", bold: true }, " and judging pages on gut feel instead of actual click/impression data."],
        ["– ", { text: "No prioritization column.", bold: true }, " A flat list of 200 issues with no impact/effort scoring rarely gets acted on."],
        ["– ", { text: "Deleting instead of consolidating", bold: true }, " thin-but-relevant content that could be merged into a stronger page and retain its existing backlinks/traffic instead of losing it entirely."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– Merge the crawl export and Search Console data into one sheet before drawing conclusions about any single page."],
        ["– Score every finding on impact and effort, and sort by that combination, not by URL alphabetically."],
        ["– Consolidate overlapping thin pages into a single stronger page rather than defaulting to deletion."],
        ["– Run a full audit annually and a lighter quarterly check on top-traffic pages only."],
        ["– Keep the deliverable to a short executive summary plus a 30/60/90-day roadmap, even for an internal, no-client audit."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– A content audit and an SEO audit are different things; the free-tool workflow described here is primarily a content audit and works best paired with a basic technical check."],
        ["– Screaming Frog's free tier (500 URLs) plus Search Console, Analytics, and Sheets replicates most of what a paid content-audit platform provides for small sites."],
        ["– Consolidating overlapping thin pages into one stronger page is often more effective than deleting or individually rewriting each one."],
        ["– Score every finding on impact and effort, and keep the deliverable to a short prioritized summary rather than a raw data dump."],
        ["– Audit annually in full, with lighter quarterly checks on your highest-traffic pages."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["– ", { text: "Word Counter", href: "/productivity/word-counter" }, " — run every page through it to flag thin content fast, without needing a crawler subscription."],
        ["– ", { text: "SEO & GEO/AEO prompts", href: "/prompts/seo-geo" }, " — for drafting the audit summary, prioritization rationale, and rewrite briefs once your spreadsheet is built."],
      ],
    },
  ],
  faq: [
    {
      question: "What is a content audit?",
      answer: ["A structured inventory and evaluation of every page on a site, assessing relevance, performance, and quality to decide what to keep, update, consolidate, or remove."],
    },
    {
      question: "What's the difference between a content audit and an SEO audit?",
      answer: ["A content audit evaluates the content itself; an SEO audit evaluates crawlability, indexation, and technical/on-page factors (", { text: "Fact & Form", href: "https://factandform.com/seo-audit-vs-content-audit-differences/", external: true }, ")."],
    },
    {
      question: "Do I need to buy Semrush or Ahrefs to run a content audit?",
      answer: ["No — Screaming Frog's free tier plus Google Search Console, Analytics, and Sheets covers the same core data for sites under 500 URLs (", { text: "Mike Ginley", href: "https://www.mikeginley.com/blog/seo-content-audit/", external: true }, ")."],
    },
    {
      question: "What is Screaming Frog's free crawl limit?",
      answer: ["500 URLs (", { text: "GoMega", href: "https://www.gomega.ai/blog/screaming-frog-seo-audit/", external: true }, ")."],
    },
    {
      question: "What if my site has more than 500 pages?",
      answer: ["Consider SiteOne Crawler or Google Lighthouse as free alternatives, or run the crawl in sections (", { text: "Prerender.io", href: "https://prerender.io/blog/screaming-frog-alternative/", external: true }, ")."],
    },
    {
      question: "What's \"thin content\"?",
      answer: ["Pages with very little substantive text or value relative to what a searcher needs — often flagged by a low word count combined with low search performance."],
    },
    {
      question: "How often should a small team audit its content?",
      answer: ["A common pattern is one full audit per year plus quarterly mini-audits on top-traffic pages (", { text: "Portent", href: "https://portent.com/blog/content/how-often-you-need-to-audit-content-to-stay-on-top.htm", external: true }, ")."],
    },
    {
      question: "Can I use Airtable instead of Google Sheets?",
      answer: ["Yes — Airtable's free tier can import a Screaming Frog crawl export directly and offers more structured filtering than a flat spreadsheet (", { text: "theStacc", href: "https://thestacc.com/blog/best-content-inventory-tools/", external: true }, ")."],
    },
    {
      question: "Is Semrush's Content Audit tool still available?",
      answer: ["No, Semrush discontinued its standalone Content Audit tool (", { text: "Semrush", href: "https://pt.semrush.com/content_tool", external: true }, ")."],
    },
    {
      question: "Do I need technical SEO knowledge to run a content audit?",
      answer: ["Basic familiarity helps, but the process is largely about organizing existing performance data and making editorial judgment calls, not deep technical work."],
    },
    {
      question: "What data does Google Search Console actually provide for an audit?",
      answer: ["Clicks, impressions, average position, and the specific queries driving traffic to each URL, over whatever date range you select (up to 16 months)."],
    },
    {
      question: "What does Google Analytics add on top of Search Console data?",
      answer: ["On-page engagement signals — time on page, bounce/engagement rate, and any conversion events tied to that URL — which Search Console alone doesn't provide."],
    },
    {
      question: "Why does Screaming Frog matter if I already have Search Console?",
      answer: ["Search Console shows performance but not content structure — Screaming Frog's crawl gives you word count, title tags, meta descriptions, and internal links across every page in one export."],
    },
    {
      question: "What counts as a \"page\" for the 500-URL free limit?",
      answer: ["Any crawlable URL on the site, including non-content pages like category or tag archives — worth excluding those from the crawl scope if they're inflating your count unnecessarily."],
    },
    {
      question: "Should I audit paginated or filtered URLs too?",
      answer: ["Generally no for a content audit — focus the crawl on canonical, indexable content pages, not parameter-based duplicates."],
    },
    {
      question: "How long does a basic content audit take for a 40-page site?",
      answer: ["Realistically a day or two for the data-gathering and merge step, spread over a longer window for the actual content decisions and rewrites."],
    },
    {
      question: "What's the minimum viable audit output?",
      answer: ["A prioritized spreadsheet plus a short summary of the top 3–5 findings and a rough roadmap — not a polished 40-page report (", { text: "Rankz", href: "https://rankz.co/blog/how-to-do-an-seo-audit-reddit/", external: true }, ")."],
    },
    {
      question: "Can I run this process on a Shopify or Squarespace site, not just WordPress?",
      answer: ["Yes — Screaming Frog crawls any publicly accessible site regardless of CMS; the Search Console/Analytics data is CMS-independent too."],
    },
    {
      question: "Do I need developer help to run a content audit?",
      answer: ["No — the crawl, spreadsheet merge, and editorial scoring can all be done by a marketer with no coding background."],
    },
    {
      question: "What's the realistic cost of this entire free-tool workflow?",
      answer: ["$0 in software cost; the only investment is staff time."],
    },
    {
      question: "How do I organize my content audit spreadsheet?",
      answer: ["Use columns for URL, issue, impact, effort, owner, and status, grouped by content type (", { text: "HubSpot", href: "https://blog.hubspot.com/marketing/company-content-audit", external: true }, ")."],
    },
    {
      question: "How do I run a Screaming Frog crawl step by step?",
      answer: ["Enter the root domain, start the crawl, wait for it to complete (capped at 500 URLs on the free tier), then export the internal HTML report as a CSV."],
    },
    {
      question: "How do I pull the matching Search Console data?",
      answer: ["In Search Console's Performance report, filter by page, export the full table for your chosen date range, and match rows to the crawl export by URL."],
    },
    {
      question: "How do I merge the two exports into one sheet?",
      answer: ["Use a VLOOKUP or INDEX/MATCH formula keyed on the URL column to pull Search Console metrics into the same row as each URL's crawl data."],
    },
    {
      question: "How do I score pages for prioritization?",
      answer: ["Assign a simple high/medium/low rating for both impact (traffic/revenue potential) and effort (time to fix), then sort by the combination that surfaces high-impact, low-effort work first."],
    },
    {
      question: "How do I spot thin content without a paid tool?",
      answer: ["Sort the merged sheet by word count and cross-reference low counts against Search Console impressions to flag genuinely underperforming thin pages (", { text: "Website Word Counter", href: "https://websitewordcounter.com/", external: true }, ")."],
    },
    {
      question: "How do I decide whether to consolidate two pages instead of just updating one?",
      answer: ["Consolidate when both pages target overlapping keywords or intent and neither is individually strong — merging concentrates their combined signal into one stronger page (", { text: "Neal Schaffer", href: "https://nealschaffer.com/content-audit/", external: true }, ")."],
    },
    {
      question: "How do I redirect old URLs after consolidating content?",
      answer: ["Set up 301 redirects from the removed URL(s) to the surviving consolidated page, so any existing links and rankings transfer rather than being lost."],
    },
    {
      question: "How do I present the audit findings to a small-business owner with no SEO background?",
      answer: ["Lead with the 3–5 highest-impact findings in plain language and a simple 30/60/90-day plan, not a raw data dump."],
    },
    {
      question: "How do I avoid auditing the whole site in one overwhelming pass?",
      answer: ["Break the audit into sections (blog, product pages, landing pages) and complete one section at a time, as recommended for teams with limited bandwidth (", { text: "Lullabot", href: "https://www.lullabot.com/articles/content-audits-heavy-lift-huge-payoff", external: true }, ")."],
    },
    {
      question: "What's an advanced way to detect content cannibalization during a free audit?",
      answer: ["Group Search Console query data by topic and check whether multiple URLs are ranking for the same query cluster — a sign the pages are competing with each other rather than reinforcing a topic."],
    },
    {
      question: "Can I automate parts of this workflow with Google Apps Script?",
      answer: ["Yes — Apps Script can automate pulling Search Console data into a Sheet on a schedule, reducing the manual export step for recurring quarterly audits."],
    },
    {
      question: "How do I audit content for AI-search/AEO readiness without a paid tool?",
      answer: ["Manually check whether each page directly answers a clear question near the top, and whether it's structured with clear headings — the same crawl-and-review process works, just with an added evaluation criterion."],
    },
    {
      question: "Should a content audit include a competitive comparison, or just internal review?",
      answer: ["A basic free-tool audit is primarily internal; adding competitive analysis requires either manual review of competitor pages or a paid tool, so most DIY audits skip this layer initially."],
    },
    {
      question: "How do I handle a very large site that exceeds Screaming Frog's free limit without paying?",
      answer: ["Crawl in sections by subdirectory, or switch to a free alternative crawler like SiteOne for the portions beyond the 500-URL cap (", { text: "Prerender.io", href: "https://prerender.io/blog/screaming-frog-alternative/", external: true }, ")."],
    },
    {
      question: "Screaming Frog free tier vs Semrush — which is better for a content audit?",
      answer: ["Screaming Frog's free tier covers the crawl/inventory step at no cost for sites under 500 URLs; Semrush adds convenience and integrated reporting but at a monthly cost, and no longer even offers a dedicated content-audit tool (", { text: "Semrush", href: "https://pt.semrush.com/content_tool", external: true }, ")."],
    },
    {
      question: "Google Sheets vs Airtable for the content inventory — which should I use?",
      answer: ["Sheets is simpler and universally familiar; Airtable offers better filtering/views and can import a crawl export more cleanly, at the cost of a small learning curve (", { text: "theStacc", href: "https://thestacc.com/blog/best-content-inventory-tools/", external: true }, ")."],
    },
    {
      question: "A content audit vs. a full technical SEO audit — which should a small team do first?",
      answer: ["A content audit is usually cheaper and faster to start since it needs less technical tooling, but a technical audit is worth doing in parallel if pages aren't indexing at all — content quality can't fix a crawlability problem."],
    },
    {
      question: "Manual spreadsheet audit vs. automated crawl-tool dashboard — what's the real trade-off?",
      answer: ["A manual spreadsheet costs nothing but takes more setup time per audit cycle; an automated dashboard costs a subscription but re-runs the analysis with less manual effort each time."],
    },
    {
      question: "Consolidating thin pages vs. rewriting them individually — which produces better results?",
      answer: ["Consolidation tends to concentrate scattered relevance/link signal into one stronger page when pages overlap in topic; individual rewrites make more sense when each thin page targets a genuinely distinct query (", { text: "Neal Schaffer", href: "https://nealschaffer.com/content-audit/", external: true }, ")."],
    },
    {
      question: "My Screaming Frog crawl stopped at 500 URLs and my site is bigger — what do I do?",
      answer: ["Crawl by subdirectory to stay under the free limit per crawl, or use a free alternative crawler for the remainder (", { text: "Prerender.io", href: "https://prerender.io/blog/screaming-frog-alternative/", external: true }, ")."],
    },
    {
      question: "My Search Console data doesn't match my crawl export URLs — why?",
      answer: ["Check for trailing-slash, HTTP vs HTTPS, or www vs non-www mismatches between the two exports; these are the most common causes of failed VLOOKUP matches."],
    },
    {
      question: "I flagged a page as thin but it still ranks well — should I still rewrite it?",
      answer: ["Not urgently — prioritize pages that are both thin and underperforming; a short page that already ranks well for its intent may not need expansion."],
    },
    {
      question: "My audit spreadsheet has 300 rows and no one is acting on it — what went wrong?",
      answer: ["Add impact/effort scoring and an owner column, and cut the initial action list down to the top 10–15 items rather than presenting the full raw list as the deliverable."],
    },
    {
      question: "I consolidated two pages but lost some traffic — what happened?",
      answer: ["Check that the 301 redirect was implemented correctly and that the surviving page actually covers the intent of both original pages; a rushed consolidation can lose relevance for one of the merged topics."],
    },
    {
      question: "Is it ever worth paying for an SEO tool instead of doing this manually?",
      answer: ["Once a site exceeds a few hundred URLs or a team needs to run audits monthly rather than annually, the time saved by an automated dashboard can outweigh the subscription cost — the free-tool workflow is most efficient for smaller sites and lower audit frequency."],
    },
    {
      question: "What should I look for if I do eventually pay for an SEO/content platform?",
      answer: ["Prioritize tools that combine crawl data with performance data in one view, since that merge step is the most time-consuming part of the free workflow."],
    },
    {
      question: "Is a freelance SEO consultant justified in charging for this workflow even though the tools are free?",
      answer: ["Yes — the value is in the analysis, prioritization, and editorial judgment, not the tools; several practitioner guides referenced here are explicitly written for consultants running this exact process for clients (", { text: "Rankz", href: "https://rankz.co/blog/how-to-do-an-seo-audit-reddit/", external: true }, ")."],
    },
    {
      question: "How do I know if my small business has outgrown the free-tool workflow?",
      answer: ["If audits are needed more than quarterly, the site exceeds a few hundred URLs, or you need automated alerting on ranking changes, it's a reasonable point to evaluate a paid platform."],
    },
    {
      question: "What's the single highest-leverage first step if I've never audited my content before?",
      answer: ["Run the Screaming Frog crawl and Search Console export today, merge them, and just look at your lowest-word-count, lowest-traffic pages first — that one pass usually surfaces the clearest quick wins."],
    },
  ],
  sources: [
    "https://blog.hubspot.com/marketing/company-content-audit",
    "https://www.gomega.ai/blog/screaming-frog-seo-audit/",
    "https://www.mikeginley.com/blog/seo-content-audit/",
    "https://rankz.co/blog/how-to-do-an-seo-audit-reddit/",
    "https://prerender.io/blog/screaming-frog-alternative/",
    "https://thestacc.com/blog/best-content-inventory-tools/",
    "https://websitewordcounter.com/",
    "https://www.lullabot.com/articles/content-audits-heavy-lift-huge-payoff",
    "https://factandform.com/seo-audit-vs-content-audit-differences/",
    "https://portent.com/blog/content/how-often-you-need-to-audit-content-to-stay-on-top.htm",
    "https://nealschaffer.com/content-audit/",
  ],
  relatedTools: ["word-counter"],
  relatedPrompts: [],
  updatedAt: "2026-08-21",
  readingMinutes: 14,
}
