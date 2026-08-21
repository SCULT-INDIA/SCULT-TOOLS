import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = "domain-migration-seo-impact"
const SERVICE_WEB_DEVELOPMENT = resolveServiceLink("web-development", SLUG)

/**
 * Generated from content-engine/05-drafts/article_052.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "Domain Migration SEO Impact: What Really Happens to Your Rankings",
  h1: "What Actually Happens to Your Rankings When You Migrate Domains?",
  targetKeyword: "domain migration seo impact",
  description: "Changing domains causes a temporary ranking dip, not a penalty. Here's the real timeline, the redirect rules, and the mistakes that turn a dip into a disaster.",
  dek: "Google's own documentation is direct about this: rankings will fluctuate temporarily during a domain migration, and that fluctuation is expected, normal behavior — not a penalty. For a medium-sized site, reindexing under the new domain typically takes a few weeks or more; larger sites take longer still. Whether that temporary dip stays temporary depends almost entirely on execution: correct 301 redirects mapped page-to-page, an updated sitemap, no leftover noindex tags, and enough server capacity to handle Google's temporary heavier crawl of the new site.",
  sections: [
    {
      heading: "What Google actually says happens during a migration",
      body: [
        ["Google's site-move documentation frames ranking fluctuation as a direct, expected consequence of the process — not a sign that something went wrong. Google explicitly recommends server-side permanent redirects wherever technically possible, specifically calling out HTTP 301 and 308 as the right tools for the job, and states plainly that \"301 and other permanent redirects don't cause a loss in PageRank\" (Google Search Central). That single sentence is worth remembering, because a huge amount of migration anxiety comes from an old, incorrect assumption that redirects inherently \"leak\" ranking value. They don't — when implemented correctly."],
        ["What does cause loss is everything Google lists as a common mistake: leftover noindex tags or robots.txt blocks from staging, redirects pointed at the wrong or nonexistent new URLs, a sitemap that still lists the old domain, and redirect chains longer than they need to be (Google recommends keeping chains under three hops and never more than five). None of these are inherent to migrating — they're execution errors, and every one of them is avoidable with a proper pre-migration audit."],
      ],
    },
    {
      heading: "The realistic recovery timeline",
      body: [
        ["Google's guidance gives a genuinely useful, if broad, timeframe: for medium-sized websites, expect a few weeks or more for Google to gradually shift from showing old URLs to new ones; for larger sites, it can take even longer (Google Search Central). That's the reindexing timeline — how long it takes Google to fully recognize the new URLs as the canonical version of each page."],
        ["Separately, industry-side recovery research frames the traffic-recovery timeline (not just reindexing) as typically one to three months for a well-executed migration, while poorly executed migrations — bad redirect mapping, or a new domain that happens to carry a toxic backlink or spam history — can take considerably longer, and in some documented cases never fully recover (seo.domains; localseoguide.com). The gap between \"a few weeks to reindex\" and \"one to three months to fully recover traffic\" reflects the fact that reindexing is a prerequisite for recovery, not the same thing as it — Google has to see and trust the new URLs before rankings and traffic can catch back up to where they were."],
      ],
    },
    {
      heading: "301 vs 302 redirects — why this choice matters",
      body: [
        ["A 301 redirect tells search engines the move is permanent — this is the correct choice for a domain migration, and it's what allows ranking signals to transfer to the new URL. A 302 redirect signals a temporary move, which tells Google to keep the old URL as the canonical version and not fully transfer signals — the wrong choice for a permanent migration, and one of the more common technical mistakes that stalls a recovery. Semrush's guidance on redirects reinforces this same distinction: 301s are the standard tool for permanent URL changes precisely because they carry the intent to search engines that the old URL is gone for good (Semrush, \"301 Redirects for SEO\")."],
        ["Google's documentation also recommends keeping those 301 redirects live for as long as possible — generally at least one year — to give the transfer of ranking signals every chance to fully complete, including for visitors and crawlers that still arrive at old links from external sites months or years later."],
      ],
    },
    {
      heading: "The Google Search Console Change of Address tool",
      body: [
        ["This tool has a specific, narrow job: it's for telling Google you've moved between different domains or subdomains — for example from oldbrand.com to newbrand.com, or from a subdomain to a root domain. Google's documentation is explicit that it is not needed for an HTTP-to-HTTPS-only move, for switching between www and non-www on the same domain, or for moving paths within the same domain. A lot of confusion during migrations comes from either skipping this tool when it was actually needed, or hunting for it during a same-domain HTTPS move where it was never applicable in the first place."],
      ],
    },
    {
      heading: "Subdomain vs. subdirectory migration",
      body: [
        ["Moving content from a subdomain to a subdirectory (or vice versa) is functionally similar to a domain migration in terms of the mechanics required — redirects, the Change of Address tool if it involves a genuine domain/subdomain change, sitemap updates — but the outcome depends heavily on how Google was already treating that subdomain. Google's own guidance groups subdomain changes into the same \"site move\" category as full domain changes, which is why the same redirect-mapping discipline applies regardless of whether the move is between two entirely separate domains or between a subdomain and a subdirectory of the same root domain."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Illustrative example — a clean rebrand.", bold: true }, " A SaaS company rebrands and migrates from oldname.com to newname.com. Before the move, they build a complete URL-to-URL redirect map, update every internal link to point directly at new URLs (rather than relying on redirects to catch them), submit an updated sitemap referencing only new URLs, and use the Change of Address tool the day of the switch. They keep the 301s live indefinitely. Recovery in this scenario tracks close to the \"few weeks to reindex, one to three months to fully recover\" pattern Google and industry research both describe."],
        [{ text: "Illustrative example — a botched migration.", bold: true }, " A different business migrates without a URL mapping plan, redirecting every old page to the new homepage instead of its actual equivalent. Google flags many of these as soft 404s — precisely the mistake called out in Google's own documentation — because a homepage isn't a relevant destination for a specific old product page. Recovery drags well past the typical window because Google has to essentially recrawl and re-evaluate the site's relevance page by page rather than transferring existing signals directly."],
        ["*(Both scenarios are illustrative composites built from documented Google guidance and industry recovery-pattern research, not specific named case studies.)*"],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– Google: for medium-sized sites, reindexing under new URLs takes a few weeks or more; larger sites take even longer (Google Search Central, \"Site moves with URL changes\")."],
        ["– Google: 301 and other permanent redirects do not cause a loss in PageRank when implemented correctly."],
        ["– Google: keep redirects live for at least a year, generally as long as possible."],
        ["– Google: redirect chains should stay under three hops, and never exceed five."],
        ["– Industry recovery research: well-executed migrations commonly recover traffic within roughly one to three months; poorly executed ones can take much longer, and some documented cases never fully recover (seo.domains; localseoguide.com)."],
        ["– Specific percentage figures for \"typical traffic loss during a migration\" vary widely across SEO blogs with no single authoritative benchmark; where a precise number isn't backed by Google or a clearly citable, methodologically transparent study, this article states the directional finding rather than inventing a specific percentage. Evidence not sufficiently verified for a universal \"expect X% traffic loss\" figure — it depends too heavily on execution quality and the specific site."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        [{ text: "301 vs. 302 redirect.", bold: true }, " 301 = permanent, transfers ranking signal, correct for domain migrations. 302 = temporary, tells Google to keep the old URL as canonical, wrong for a permanent move. Using a 302 during a migration is one of the more common ways a \"temporary\" ranking dip turns into a much longer one."],
        [{ text: "Subdomain vs. subdirectory migration.", bold: true }, " Both require the same redirect and sitemap discipline. The practical difference is usually about how Google was already crawling and trusting that subdomain beforehand — a subdomain Google already indexed as effectively part of the main site tends to transfer more smoothly than one it treated as a separate, less-trusted property."],
        [{ text: "Change of Address tool: needed vs. not needed.", bold: true }, " Needed for domain-to-domain or subdomain-to-subdomain moves. Not needed for HTTP→HTTPS, www vs non-www on the same domain, or path changes within the same domain — these are handled through standard redirects and don't require Google to be told a \"site move\" occurred at the domain level."],
        [{ text: "Google's guidance vs. general SEO-industry recovery estimates.", bold: true }, " Google's documentation focuses narrowly on the technical reindexing timeline. Industry publications extend that into a broader traffic-recovery timeline, which is a related but distinct measurement — reindexing is necessary for recovery, but recovery also depends on factors outside Google's technical documentation, like whether the new domain carries any negative history of its own."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["– ", { text: "Full rebrand", bold: true }, ": a business changes its name and needs every URL to move to a new domain while preserving as much existing ranking value as possible — the scenario this article centers on."],
        ["– ", { text: "HTTPS migration", bold: true }, ": a site moving from HTTP to the same domain over HTTPS doesn't need the Change of Address tool, but still benefits from the same redirect and sitemap discipline described above, scaled down to a same-domain move."],
        ["– ", { text: "Platform replatform", bold: true }, ": moving from one CMS or e-commerce platform to another often changes URL structures even without changing the domain, which triggers many of the same redirect-mapping requirements as a full domain migration."],
        ["– ", { text: "Agency handling a client migration", bold: true }, ": agencies managing this process for clients need to set expectations up front about the few-weeks-to-months timeline, specifically so a client doesn't panic at week two and demand a rollback before the process has had time to work."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– Leaving staging-environment noindex tags or robots.txt blocks in place after launch — one of the most common and most damaging mistakes Google's own documentation calls out directly."],
        ["– Redirecting many or all old URLs to the homepage instead of their true equivalent, which Google can flag as a soft 404 and which forces a much slower, page-by-page re-evaluation of the new site's relevance."],
        ["– Forgetting to update the sitemap so it references new URLs — Google lists this explicitly as a common technical mistake."],
        ["– Using 302 (temporary) redirects for what is actually a permanent move, which tells Google not to fully transfer ranking signals yet."],
        ["– Underestimating server capacity needs — Google will temporarily crawl the new site more heavily right after a migration, and insufficient capacity to handle that surge is a documented pitfall."],
        ["– Removing redirects too early. Signals can still be transferring well past the initial reindexing window; Google recommends keeping them live for at least a year."],
        ["– Skipping a full URL inventory before the move, which makes it far more likely that some pages get redirected incorrectly or missed entirely."],
        ["– Migrating a domain that carries an unknown negative history (spam penalties, toxic backlinks) without auditing it first — industry research points to this as one of the biggest drivers of unusually severe, slow-to-recover traffic loss."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– Build a complete old-URL-to-new-URL map before migration day — not during it."],
        ["– Use 301 (or 308) redirects exclusively for the permanent move; reserve 302s for genuinely temporary situations."],
        ["– Update internal links to point directly at the new URLs rather than relying solely on redirects to catch internal navigation."],
        ["– Submit an updated sitemap referencing only the new URLs as part of the launch, not as an afterthought."],
        ["– Use the Change of Address tool in Search Console specifically when moving between domains or subdomains — skip it for HTTPS-only or www/non-www changes."],
        ["– Audit the new domain's backlink and reputation history before migrating onto it, especially if it's a domain that previously belonged to someone else."],
        ["– Confirm hosting/server capacity can absorb a temporary spike in crawl activity right after launch."],
        ["– Keep redirects live for at least a year, and ideally indefinitely if there's no strong reason to remove them."],
        ["– Monitor Search Console's coverage and performance reports weekly during the first two to three months, rather than expecting an instant before/after comparison."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– A domain migration causes a temporary, expected ranking fluctuation, not a penalty — Google says so directly."],
        ["– For medium sites, reindexing typically takes a few weeks or more; full traffic recovery for a well-executed migration typically takes one to three months."],
        ["– 301 redirects, not 302s, are the correct tool for a permanent move, and Google confirms they don't inherently cause PageRank loss when implemented correctly."],
        ["– The Change of Address tool is for domain/subdomain moves specifically — not for HTTPS-only or www/non-www changes."],
        ["– The mistakes that turn a normal dip into a lasting loss are almost always execution errors: bad redirect mapping, leftover noindex tags, a stale sitemap, or insufficient server capacity."],
        ["– Keep redirects live for at least a year to give ranking signals the full runway Google recommends to transfer completely."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["Once your migration is live, run the new domain through the ", { text: "Website Speed Test", href: "/seo/website-speed-test" }, " to confirm the move didn't introduce a performance regression alongside the URL changes — page speed is one of the technical signals that can compound a migration dip if it's overlooked. If you're documenting the migration plan or briefing a technical writer on the redirect strategy, the ", { text: "SEO & GEO prompts", href: "/prompts/seo-geo" }, " collection is a useful starting point for structuring that plan clearly."],
        ["If you're planning a full replatform or rebrand and want the redirect mapping, sitemap regeneration, and Search Console setup handled by people who do this regularly rather than as a one-off, that's a reasonable moment to have a conversation with a ", { text: "web development", href: SERVICE_WEB_DEVELOPMENT.href, external: true }, " team — the technical execution described throughout this article is exactly where migrations succeed or quietly go wrong."],
      ],
    },
  ],
  faq: [
    {
      question: "What is a domain migration in SEO terms?",
      answer: ["Moving a website's content from one domain (or subdomain) to another, which requires search engines to re-associate all existing rankings, links, and trust signals with the new URLs."],
    },
    {
      question: "Does changing my domain name hurt my SEO rankings?",
      answer: ["Temporarily, yes — Google's own documentation describes this as expected, normal fluctuation, not a penalty (Google Search Central)."],
    },
    {
      question: "Is a domain migration the same as a rebrand?",
      answer: ["Not always — a rebrand often includes a domain migration, but you can also migrate domains (e.g., for a platform change) without changing your brand name, or rebrand without changing domains."],
    },
    {
      question: "What's the difference between a site migration and a domain migration?",
      answer: ["Site migration is the broader term covering any major structural change (platform, URL structure, HTTPS, design); domain migration specifically means moving to a new domain or subdomain."],
    },
    {
      question: "Will I lose all my rankings when I migrate domains?",
      answer: ["No — a properly executed migration with correct redirects is designed specifically to transfer existing ranking signals to the new domain, not discard them."],
    },
    {
      question: "Do I need to tell Google I'm migrating?",
      answer: ["Yes, for a domain or subdomain change, via the Search Console Change of Address tool; for an HTTPS-only move on the same domain, this specific tool isn't required."],
    },
    {
      question: "What is a 301 redirect?",
      answer: ["A server-side signal that a URL has permanently moved to a new location, telling both browsers and search engines to treat the new URL as the true destination."],
    },
    {
      question: "What is a canonical tag and how does it relate to migration?",
      answer: ["A canonical tag tells search engines which URL is the \"master\" version when similar or duplicate content exists at multiple URLs — it's a complementary signal to redirects, not a replacement for them during a migration."],
    },
    {
      question: "Do I need 301 redirects for every single page when migrating domains?",
      answer: ["Yes, ideally — every old URL that had any traffic, links, or ranking value should redirect to its most relevant new-domain equivalent."],
    },
    {
      question: "How long does a domain migration take to complete technically?",
      answer: ["The redirect setup and launch itself can happen in a day; the SEO recovery and reindexing process takes weeks to months, which is a separate timeline from the technical cutover."],
    },
    {
      question: "Why does Google say rankings fluctuate during a migration?",
      answer: ["Because Google has to recrawl and re-evaluate URLs under the new domain before it can confidently show them in the same position as the old ones — that transition period naturally produces fluctuation."],
    },
    {
      question: "Is ranking fluctuation during a migration a penalty?",
      answer: ["No — Google explicitly frames it as expected, normal behavior tied to the technical process of re-indexing, not an algorithmic penalty."],
    },
    {
      question: "How long does it take Google to reindex a site after a domain migration?",
      answer: ["A few weeks or more for medium-sized sites; longer for larger sites, per Google's own guidance."],
    },
    {
      question: "Does a 301 redirect fully preserve a page's ranking value?",
      answer: ["Google states permanent redirects don't cause PageRank loss when implemented correctly; some SEO-industry sources separately note that in practice, imperfect implementation can still cause some dip, which is why correct mapping matters so much."],
    },
    {
      question: "What causes some migrations to lose far more traffic than others?",
      answer: ["Botched URL-to-URL redirect mapping, or moving onto a domain that carries a toxic backlink or spam history, are the two most commonly cited drivers of unusually severe traffic loss."],
    },
    {
      question: "Is traffic loss from a migration temporary or permanent?",
      answer: ["It varies — well-executed migrations typically recover within one to three months; poorly executed ones can take much longer or, in documented cases, never fully recover."],
    },
    {
      question: "Do redirects \"leak\" ranking value the way people used to believe?",
      answer: ["Not according to Google's current guidance — 301/308 permanent redirects don't inherently cause PageRank loss; the old \"redirects leak juice\" idea reflects outdated or oversimplified SEO folklore more than current documented behavior."],
    },
    {
      question: "What's a soft 404 and why does it matter during migration?",
      answer: ["A soft 404 is when a page returns a normal \"200 OK\" status but the content is effectively an error or irrelevant page — commonly triggered when many old URLs redirect to an unrelated destination like the homepage instead of their true equivalent."],
    },
    {
      question: "Why does server capacity matter during a migration?",
      answer: ["Google temporarily crawls the new site more heavily right after a move; insufficient server capacity to handle that surge is a documented pitfall that can slow the process down."],
    },
    {
      question: "Does the type of CMS or platform I migrate to affect SEO outcomes?",
      answer: ["It can, mainly through how well that platform preserves URL structure, supports proper redirects, and generates a clean sitemap — the platform itself doesn't inherently help or hurt rankings beyond those technical capabilities."],
    },
    {
      question: "How do I use the Google Search Console Change of Address tool?",
      answer: ["Verify both the old and new domain in Search Console, then use the tool (found under old-domain settings) to point Google to the new domain — required for domain/subdomain moves, not for same-domain HTTPS changes."],
    },
    {
      question: "How do I map old URLs to new URLs before migrating?",
      answer: ["Crawl the existing site to get a full URL inventory, then build a spreadsheet mapping each old URL to its most relevant new-domain equivalent before writing a single redirect rule."],
    },
    {
      question: "How do I migrate a website without losing SEO?",
      answer: ["Build a complete redirect map, use 301s, update internal links and the sitemap, verify the new domain in Search Console, use the Change of Address tool if applicable, and keep redirects live for at least a year."],
    },
    {
      question: "How do I check if my redirects are working correctly after migration?",
      answer: ["Use a crawler tool or Search Console's URL Inspection tool to spot-check a sample of old URLs and confirm each returns the correct 301 status and lands on the intended new page."],
    },
    {
      question: "How do I update my sitemap during a migration?",
      answer: ["Generate a new sitemap listing only the new domain's URLs and submit it in Search Console as part of the launch — don't leave the old sitemap live pointing at retired URLs."],
    },
    {
      question: "How do I know if my migration is recovering on schedule?",
      answer: ["Track Search Console's coverage and performance reports weekly; steady improvement over the first one to three months suggests a normal recovery, while a stalled or worsening trend after that window suggests a technical problem worth auditing."],
    },
    {
      question: "How do I test website speed and technical health after a migration?",
      answer: ["Run the new domain through a website speed and technical health check to confirm the move didn't introduce performance regressions alongside the URL changes."],
    },
    {
      question: "How do I handle a migration where the URL structure is also changing?",
      answer: ["Treat it as two changes happening at once — map both the domain change and the path/structure change in the same redirect plan, since combining them without a clear map compounds the risk of errors."],
    },
    {
      question: "How do I communicate migration timelines to stakeholders or clients?",
      answer: ["Set expectations up front using Google's documented timeline (a few weeks to reindex, one to three months to recover) so a temporary dip in week two doesn't trigger a panicked rollback."],
    },
    {
      question: "How do I decide whether to move to a subdomain or a subdirectory?",
      answer: ["Subdirectories generally inherit more of the root domain's existing authority than subdomains, which Google has historically treated with more ambiguity — but the technical redirect and sitemap process is largely the same either way."],
    },
    {
      question: "Does migrating a domain reset historical backlinks?",
      answer: ["No, properly redirected backlinks continue passing value to the new URL — but any backlinks pointing at URLs you failed to redirect correctly effectively stop counting."],
    },
    {
      question: "Should I use rel=canonical in addition to 301 redirects during a migration?",
      answer: ["Canonical tags are mainly for handling duplicate or near-duplicate content, not a substitute for 301s during a full domain move — the redirect is the primary signal Google relies on for the site move itself."],
    },
    {
      question: "Does international SEO (hreflang) complicate a domain migration?",
      answer: ["Yes — every hreflang-tagged URL variant needs its own correct redirect mapping to its equivalent on the new domain, which multiplies the mapping work for multilingual or multi-region sites."],
    },
    {
      question: "Can I migrate in phases instead of all at once?",
      answer: ["Yes, and Google's guidance doesn't require an all-at-once move — a phased migration can reduce risk, but it also extends the total recovery timeline since different sections reindex on different schedules."],
    },
    {
      question: "What happens to structured data (schema markup) during a migration?",
      answer: ["It needs to move and validate correctly on the new URLs just like any other on-page element — a migration is a good moment to also re-audit schema markup for correctness."],
    },
    {
      question: "301 vs. 302 redirect for domain migration — which should I use?",
      answer: ["301, for a permanent move — 302 signals a temporary move and can prevent Google from fully transferring ranking signals to the new URL."],
    },
    {
      question: "Subdomain vs. subdirectory migration — which has less SEO risk?",
      answer: ["Subdirectories are generally considered lower-risk since Google typically treats them as more clearly part of the root domain's existing authority, though both require the same redirect discipline."],
    },
    {
      question: "Change of Address tool vs. just setting up redirects — do I need both?",
      answer: ["For a domain or subdomain change, yes — redirects handle the technical routing, while the Change of Address tool explicitly tells Google the entire site has moved, which can help the reindexing process along."],
    },
    {
      question: "Migrating to HTTPS vs. migrating to a new domain — which carries more SEO risk?",
      answer: ["A new domain migration carries meaningfully more risk, since it involves Google re-associating the site's entire trust and ranking history with a new root domain; an HTTPS-only move on the same domain is comparatively low-risk."],
    },
    {
      question: "Manual migration vs. using a migration/redirect-management tool — which is safer?",
      answer: ["For small sites, a careful manual redirect map is manageable; for large sites with thousands of URLs, dedicated redirect-mapping tools reduce the risk of human error in matching old URLs to new ones."],
    },
    {
      question: "My traffic dropped sharply right after migrating — is this normal?",
      answer: ["Some drop is expected and normal per Google's own guidance; a sharp, sustained drop past the few-weeks reindexing window is worth auditing for redirect errors, noindex tags, or sitemap issues."],
    },
    {
      question: "My rankings never recovered after a site migration — what went wrong?",
      answer: ["Common culprits include incorrect or missing redirects, leftover noindex/robots.txt blocks, redirects pointing to irrelevant pages (triggering soft 404s), or migrating onto a domain with a pre-existing negative history."],
    },
    {
      question: "I forgot to set up redirects before launch — can I fix it now?",
      answer: ["Yes — set up correct 301 redirects as soon as possible; the sooner they're in place, the sooner ranking signal transfer and reindexing can begin, even though some of the initial delay is unrecoverable."],
    },
    {
      question: "Google is showing my old domain's URLs in search results weeks after migration — why?",
      answer: ["Reindexing takes time, especially for larger sites; verify redirects are correctly implemented and confirm the Change of Address tool was used if this was a domain-to-domain move."],
    },
    {
      question: "I accidentally left staging noindex tags live after launch — how bad is this?",
      answer: ["It can be serious — Google's own documentation lists this as a common, damaging mistake because it can block indexing of the new site entirely; remove the tags and request reindexing as soon as it's caught."],
    },
    {
      question: "Should I hire an agency or developer to handle my domain migration?",
      answer: ["For anything beyond a very small site, professional help reduces the risk of the exact mistakes (redirect mapping, sitemap, noindex cleanup) that turn a temporary dip into a lasting loss."],
    },
    {
      question: "Do I need an SEO audit before migrating domains?",
      answer: ["Yes — auditing the current site's URL inventory, backlink profile, and the new domain's history (if it's not brand new) is the single highest-leverage step to reduce migration risk."],
    },
    {
      question: "Is it worth paying for a redirect-mapping tool for a large site migration?",
      answer: ["For sites with thousands of URLs, yes — manual mapping at that scale is where human error most often creates the soft-404 and missed-redirect problems that slow recovery."],
    },
    {
      question: "What should I look for in a web development partner handling a migration?",
      answer: ["Direct experience with 301 redirect mapping, Search Console's Change of Address tool, sitemap regeneration, and post-launch monitoring — not just general web development skill."],
    },
    {
      question: "How do I know if my migration was actually successful?",
      answer: ["Compare Search Console coverage and performance data before and after across the full one-to-three-month recovery window, not just the first week or two — a temporary dip followed by steady recovery is the expected, successful pattern."],
    },
  ],
  sources: [
    "https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes",
    "https://seo.domains/seo-resources/domain-migration-rebranding/expected-traffic-loss-migration-recovery/",
    "https://www.localseoguide.com/how-long-does-it-take-to-recover-from-a-domain-migration/",
    "https://www.semrush.com/blog/301-redirects/",
  ],
  relatedTools: ["website-speed-test"],
  relatedPrompts: [],
  serviceTarget: "web-development",
  updatedAt: "2026-08-21",
  readingMinutes: 17,
}
