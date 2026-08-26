import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'first-90-days-seo-agency'
const SERVICE_SEO_COMPANIES_FOR_SMALL_BUSINESS = resolveServiceLink(
  'seo-companies-for-small-business',
  SLUG,
)

/**
 * Generated from content-engine/05-drafts/article_076.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'The First 90 Days After Hiring an SEO Agency: What Actually Happens',
  h1: 'What actually happens in the first 90 days after hiring an SEO agency',
  targetKeyword: 'first 90 days seo agency',
  description:
    'What a legitimate SEO agency engagement looks like month-to-month, what red flags to watch for, and how to tell real work from a reselling scheme.',
  dek: "A legitimate SEO agency engagement follows a recognizable shape: month one is discovery and foundation (technical audit, keyword baseline, analytics setup, quick fixes), month two is production and execution (content, on-page work, link building), and month three is when early ranking and traffic signals should start appearing — though full results take longer. Real client accounts and practitioner discussion also surface genuine red flags: agencies reselling cheap backlinks at a markup, vague reporting that avoids attributing results, and promises of first-page rankings within weeks that don't match how SEO actually works.",
  sections: [
    {
      heading: 'The month-by-month shape of a real engagement',
      body: [
        [
          'Across current onboarding guides and agency-side breakdowns, the first 90 days consistently split into three recognizable phases.',
        ],
        [
          { text: 'Month 1 (days 1–30) is foundation and discovery.', bold: true },
          ' This is where the agency actually earns its first invoice: a full technical audit, a keyword baseline (some agencies track 1,000+ keyword positions daily starting from day one), verified analytics and Search Console access, validated tracking, quick technical fixes (indexing issues, redirects, page speed problems), and a written plan naming the target keywords and pages the engagement will focus on. Deliverables from this phase typically also include competitor analysis and market benchmarking, a review of existing content and backlink profile, and an SEO roadmap covering the next 3–6 months.',
        ],
        [
          { text: 'Month 2 (days 31–60) is production and execution.', bold: true },
          ' The expectations shift here — the client relationship moves from "getting familiar" to the agency actually owning and moving the program forward: implementing the technical fixes and content plan built in month one, publishing new content, and beginning outreach or link-building work.',
        ],
        [
          {
            text: 'Month 3 (days 61–90) is early signal, not final results.',
            bold: true,
          },
          " A competent agency should be delivering visible work by month one and showing measurable movement by month three — improved crawlability and technical site health, initial visibility gains for targeted and long-tail keywords, and better on-site engagement signals (longer sessions, lower bounce rates). Crucially, this is *early* signal — no honest agency can promise final, decisive ranking results by day 90; SEO's actual timeline runs longer than a single quarter for most competitive terms.",
        ],
      ],
    },
    {
      heading: 'What agencies actually bill for',
      body: [
        [
          'A real client account discussed on Hacker News lists four core deliverables agencies commonly bill for in a standard SEO retainer: on-page optimization (technical fixes, meta tags, often implemented through a CMS plugin like Yoast on WordPress sites), keyword research, content writing, and backlink acquisition (',
          {
            text: 'HN: "Is it worth paying $6k/month for an SEO agency?"',
            href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
            external: true,
          },
          "). This roughly matches the onboarding-guide breakdown above — it's useful as a sanity check against your own agency's invoice: if you're paying a retainer and can't map the charges to something resembling these four categories, that's worth asking about directly.",
        ],
      ],
    },
    {
      heading: 'The red flags real clients report',
      body: [
        [
          'The most detailed real-world account of what can go wrong comes from a Hacker News discussion specifically debating whether a $6,000/month SEO retainer is worth it. A self-described SEO veteran with 15 years of experience calls mid-tier agency services "almost guaranteed to be a scam" in many cases, describing a common pattern: an agency billing roughly $2,000/month for backlinks that actually cost around $200 to acquire, sourced from partner sites the client (in this case, a healthcare provider) later found "spammy-looking" despite the agency\'s claims of high domain authority (',
          {
            text: 'HN',
            href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
            external: true,
          },
          '). An agency owner responding in the same thread pushed back, arguing that legitimate ecommerce SEO work is still genuinely profitable when done honestly — so the debate isn\'t "all agencies are scams," it\'s "the markup-reselling pattern is real and common enough to actively screen for."',
        ],
        [
          'Other concrete red flags surfaced in the same real discussion: a local agency promising first-page Google rankings within "2–3 weeks upon launch" — a claim other commenters immediately flagged as unrealistic given how SEO actually works; and a recurring difficulty proving direct causality between an agency\'s SEO work and any resulting traffic or lead increase, especially when other marketing channels are running simultaneously. Commenters recommend demanding transparent ROI reporting specifically because of this attribution problem, not despite it.',
        ],
        [
          'A separate, useful real reference for vetting questions is Mashable\'s "12 Questions to Ask Before Hiring an SEO Expert" — a genuine example of the vetting-question genre that search behavior confirms people are actively looking for before signing a contract (',
          {
            text: 'Mashable',
            href: 'https://mashable.com/2013/10/22/seo-hiring-questions/',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: 'Practical examples',
      body: [
        [
          { text: 'Real, documented example — the backlink markup pattern.', bold: true },
          ' A healthcare-industry client reported receiving backlinks from sites they later assessed as "spammy-looking" despite the agency\'s claims of high domain authority, while paying a retainer that (per a veteran practitioner\'s estimate in the same discussion) priced those links at roughly 10x their actual acquisition cost (',
          {
            text: 'HN',
            href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
            external: true,
          },
          ').',
        ],
        [
          {
            text: 'Real, documented example — the unrealistic-timeline promise.',
            bold: true,
          },
          " A local business was reportedly promised first-page Google rankings within 2–3 weeks of launch by an agency — a claim that doesn't match how search engines actually index and rank new or updated content, and that other practitioners in the same discussion treated as an obvious warning sign rather than an aggressive-but-achievable target (",
          {
            text: 'HN',
            href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
            external: true,
          },
          ').',
        ],
        [
          { text: 'Illustrative scenario — a legitimate month 1.', bold: true },
          ' A small business hires an agency and receives, within the first 30 days: a technical audit report with prioritized fixes, verified Search Console and analytics access, a documented keyword baseline, and a written 90-day plan naming specific target pages and keywords. This matches the onboarding-guide pattern described above and is a reasonable bar to hold a new engagement to — presented here as an illustrative composite of what "good month one" looks like, not a specific documented case.',
        ],
      ],
    },
    {
      heading: 'Data and evidence',
      body: [
        [
          '– ',
          { text: 'Month 1 deliverables', bold: true },
          ' commonly cited across current onboarding guides: technical audit, keyword baseline (some agencies tracking 1,000+ keyword positions from day one), verified analytics/Search Console access, quick technical fixes, and a written 90-day plan.',
        ],
        [
          '– ',
          { text: 'Month 3', bold: true },
          ' is described as the point where a competent agency shows "measurable movement" — improved crawlability, initial keyword visibility gains, better engagement metrics — explicitly distinguished from final or decisive results.',
        ],
        [
          '– ',
          {
            text: 'Real retainer pricing referenced in practitioner discussion:',
            bold: true,
          },
          ' roughly $6,000/month was the specific figure debated in the core Hacker News thread, with a described backlink markup pattern of roughly $2,000/month billed for links costing roughly $200 to actually acquire (',
          {
            text: 'HN',
            href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
            external: true,
          },
          ').',
        ],
        [
          '– ',
          { text: 'SEO timelines generally:', bold: true },
          " HN discussion referencing established reporting on SEO timelines concludes there's no quick fix — visible results require sustained multi-month effort across content, technical work, and distribution, and should be benchmarked against paid-search cost/timeline rather than judged in isolation (",
          {
            text: 'HN',
            href: 'https://hn.algolia.com/api/v1/search?query=how%20long%20does%20SEO%20take%20to%20work',
            external: true,
          },
          ').',
        ],
        [
          "– Evidence not sufficiently verified: there is no single, authoritative, cross-agency dataset on what percentage of SEO agencies engage in the backlink-markup pattern described above — the evidence here is real, credible practitioner and client testimony (including a 15-year-veteran's professional assessment), not a scientifically representative survey.",
        ],
      ],
    },
    {
      heading: 'Comparisons',
      body: [
        [
          { text: 'SEO agency vs. freelancer.', bold: true },
          " Commenters on the core Hacker News discussion recommend handling technical SEO in-house with accessible tools (Yoast, Google Analytics) and hiring freelance content writers directly as a more cost-effective and transparent alternative to a full agency retainer — particularly for smaller businesses where the agency's overhead and possible link-markup practices add cost without proportionate added value (",
          {
            text: 'HN',
            href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
            external: true,
          },
          ').',
        ],
        [
          { text: 'SEO agency vs. in-house SEO.', bold: true },
          " An in-house approach trades the agency's specialized experience and bandwidth for direct control and transparency — you see exactly what work is being done and at what real cost, eliminating the markup-reselling risk entirely, at the cost of needing someone internally who actually has the skill and time to do the work well.",
        ],
        [
          { text: 'SEO agency vs. doing SEO yourself.', bold: true },
          " For a small business with no marketing staff, a competent agency's built-in workflow (audit → content/technical execution → reporting) can compress a multi-month learning curve; the tradeoff is trusting a third party's reporting on causality, which the HN discussion flags as a genuine, hard-to-verify measurement problem regardless of how honest the agency is.",
        ],
      ],
    },
    {
      heading: 'Real-world use cases',
      body: [
        [
          '– ',
          {
            text: 'Small businesses vetting an agency before signing a contract',
            bold: true,
          },
          ', using a structured question list (in the spirit of Mashable\'s "12 Questions" genre) to probe specifically for the backlink-sourcing and reporting-transparency issues raised in real practitioner discussion.',
        ],
        [
          '– ',
          {
            text: 'Marketing managers auditing an existing agency relationship at the 90-day mark',
            bold: true,
          },
          ', comparing actual delivered work against the month-1/month-2/month-3 pattern described above to judge whether the engagement is on track.',
        ],
        [
          '– ',
          {
            text: 'Businesses considering in-house or freelance alternatives',
            bold: true,
          },
          ' after a bad agency experience, following the specific in-house-plus-freelancer model recommended in the core HN discussion.',
        ],
      ],
    },
    {
      heading: 'Common mistakes',
      body: [
        [
          '– ',
          {
            text: "Judging an agency's success by month 3 based on final rankings",
            bold: true,
          },
          ', when month 3 is realistically an "early signal" checkpoint, not a results deadline.',
        ],
        [
          '– ',
          { text: 'Not asking where backlinks actually come from', bold: true },
          ', missing the specific, documented markup-reselling pattern where cheap links get billed at a significant multiple of their real acquisition cost.',
        ],
        [
          '– ',
          {
            text: 'Accepting vague reporting that never attributes traffic or lead changes to specific SEO work',
            bold: true,
          },
          ', when transparent ROI reporting is exactly what real client discussions recommend demanding.',
        ],
        [
          '– ',
          { text: 'Believing promises of first-page rankings within weeks', bold: true },
          ", a claim that doesn't match how search indexing and ranking actually work and that experienced practitioners flag as an immediate red flag.",
        ],
        [
          '– ',
          { text: 'Treating SEO in isolation from other marketing activity', bold: true },
          ", making it harder to judge whether traffic changes are actually attributable to the agency's work.",
        ],
        [
          '– ',
          { text: 'Not verifying month-1 access and baseline deliverables', bold: true },
          ' (Search Console, analytics, keyword baseline) before assuming the engagement is progressing normally.',
        ],
      ],
    },
    {
      heading: 'Best practices',
      body: [
        [
          '– ',
          { text: 'Demand a written 90-day plan in month one', bold: true },
          ' naming specific target keywords, pages, and deliverables — not a vague description of "SEO work."',
        ],
        [
          '– ',
          { text: 'Verify your own Search Console and analytics access', bold: true },
          ' early, so you can independently check the metrics an agency reports rather than relying solely on their dashboard.',
        ],
        [
          '– ',
          {
            text: 'Ask specifically where backlinks come from and roughly what they cost',
            bold: true,
          },
          ', given the documented real pattern of agencies reselling cheap links at a significant markup.',
        ],
        [
          '– ',
          {
            text: 'Treat "first page in weeks" promises as a disqualifying red flag',
            bold: true,
          },
          ', not an ambitious but credible target.',
        ],
        [
          '– ',
          { text: 'Request transparent, attributable ROI reporting', bold: true },
          " that acknowledges the genuine difficulty of isolating SEO's effect from other marketing activity, rather than reporting that implies false certainty.",
        ],
        [
          '– ',
          { text: 'Benchmark month 3 against "early signal" expectations', bold: true },
          ' (crawlability, initial keyword visibility, engagement metrics) rather than final ranking results.',
        ],
        [
          '– ',
          {
            text: "Compare the agency's actual deliverables against the four core categories",
            bold: true,
          },
          " (on-page optimization, keyword research, content writing, backlink acquisition) to sanity-check what you're actually paying for.",
        ],
      ],
    },
    {
      heading: 'Key takeaways',
      body: [
        [
          '– A legitimate 90-day SEO engagement follows a recognizable shape: month 1 (audit, baseline, plan), month 2 (execution), month 3 (early signal, not final results).',
        ],
        [
          '– Agencies typically bill for four core categories: on-page optimization, keyword research, content writing, and backlink acquisition — a useful checklist against any invoice.',
        ],
        [
          '– A real, documented red flag pattern is agencies reselling cheap backlinks at a significant markup from questionable sources — ask specifically where links come from and what they cost.',
        ],
        [
          '– Promises of first-page rankings within weeks, and reporting that never attributes results to specific work, are genuine warning signs flagged by experienced practitioners.',
        ],
        [
          "– Proving SEO's exact causal effect on traffic or leads is a real, acknowledged measurement challenge — demand transparent reporting that engages with this honestly rather than reporting that implies false certainty.",
        ],
      ],
    },
    {
      heading: 'Relevant tools.scult.in resources',
      body: [
        [
          "Several of the concrete month-1 deliverables described above map directly to tools you can run yourself to sanity-check an agency's work: the ",
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          ' verifies the technical performance fixes an agency should be addressing early, the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ' and ',
          { text: 'FAQ Schema Generator', href: '/seo/faq-schema-generator' },
          ' let you check whether structured data work is actually being implemented as promised, and the ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          " gives you an independent way to model whether reported traffic or lead changes translate into an ROI figure that matches what you're being told.",
        ],
        [
          "If you're evaluating whether to hire an agency at all, or trying to figure out what a legitimate engagement should look like for your specific business, that's exactly the kind of conversation worth having directly with a team that will show you the actual month-by-month plan before you sign anything — SCULT.IN's ",
          {
            text: 'local SEO services',
            href: SERVICE_SEO_COMPANIES_FOR_SMALL_BUSINESS.href,
            external: true,
          },
          ' team can walk through what a real first-90-days plan looks like for your situation.',
        ],
      ],
    },
  ],
  faq: [
    {
      question: 'What should I expect in month 1 of an SEO agency engagement?',
      answer: [
        'A technical audit, keyword baseline, verified analytics/Search Console access, quick technical fixes, and a written 90-day plan naming target keywords and pages.',
      ],
    },
    {
      question: 'What should I expect in month 2?',
      answer: [
        'Execution of the month-1 plan: content production, on-page implementation, and the start of link-building or outreach work — the phase where the agency shifts from discovery to active delivery.',
      ],
    },
    {
      question: 'What should I expect in month 3?',
      answer: [
        'Early signals, not final results — improved technical site health, initial visibility gains for targeted and long-tail keywords, and better engagement metrics, explicitly distinct from decisive ranking outcomes.',
      ],
    },
    {
      question: 'Is an SEO agency worth the cost?',
      answer: [
        'It\'s genuinely debated even among experienced practitioners — a 15-year SEO veteran called mid-tier agency services "almost guaranteed to be a scam" in a real discussion, while an agency owner in the same thread argued legitimate SEO work remains profitable when done honestly (',
        {
          text: 'HN',
          href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How long does SEO actually take to show results?',
      answer: [
        "There's no quick fix — visible results require sustained multi-month effort across content, technical, and distribution work; month 3 is early signal at best for most engagements (",
        {
          text: 'HN',
          href: 'https://hn.algolia.com/api/v1/search?query=how%20long%20does%20SEO%20take%20to%20work',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'What are the four things SEO agencies typically bill for?',
      answer: [
        'On-page optimization, keyword research, content writing, and backlink acquisition, per a real client account discussed on Hacker News (',
        {
          text: 'HN',
          href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        "What's a red flag that an agency is reselling cheap backlinks at a markup?",
      answer: [
        "Vague or unverifiable claims about link sources' domain authority, combined with an inability or unwillingness to name specific referring sites — a documented real pattern involved links costing roughly $200 billed at roughly $2,000/month (",
        {
          text: 'HN',
          href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Is it better to hire a freelancer instead of an SEO agency?',
      answer: [
        'For many small businesses, commenters on real discussion threads recommend handling technical SEO in-house and hiring freelance writers directly as a more transparent, cost-effective alternative (',
        {
          text: 'HN',
          href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How do you measure whether SEO work actually caused a traffic increase?',
      answer: [
        "It's genuinely difficult to prove direct causality when other marketing runs simultaneously — practitioners recommend demanding transparent ROI reporting specifically because of this measurement challenge, not as a substitute for acknowledging it.",
      ],
    },
    {
      question: 'What questions should I ask before hiring an SEO agency?',
      answer: [
        'Vetting-question guides like Mashable\'s "12 Questions to Ask Before Hiring an SEO Expert" cover the real genre of questions searchers look for — covering methodology, reporting, and link-sourcing transparency (',
        {
          text: 'Mashable',
          href: 'https://mashable.com/2013/10/22/seo-hiring-questions/',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Are promises of first-page rankings in 2–3 weeks realistic?',
      answer: [
        'No — this specific claim was reported in a real case and treated by other practitioners as an obvious red flag given how SEO indexing and ranking actually work (',
        {
          text: 'HN',
          href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Has SEO become less effective over time?',
      answer: [
        "It's a real, debated viewpoint — one practitioner argues SEO's effectiveness has \"diminished significantly since 2005–2007\" due to algorithm changes, which shapes how skeptically some buyers approach agency promises, though this is one practitioner's opinion, not a consensus finding (",
        {
          text: 'HN',
          href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        "Why is it hard to tell if an agency's backlinks are actually high quality?",
      answer: [
        'Because domain authority claims can be misleading, and a real reported case involved backlinks from "spammy-looking" partner sites despite claimed high authority — a pattern that later algorithm updates could specifically penalize (',
        {
          text: 'HN',
          href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'What does a transparent, legitimate SEO engagement look like versus a vague one?',
      answer: [
        'Transparency about concrete methods, link sources, and honest ROI attribution versus staying vague about tactics and dodging results attribution — this distinction recurs across real client discussions as the practical differentiator.',
      ],
    },
    {
      question:
        'Should I evaluate SEO on its own, or compare it against other marketing channels?',
      answer: [
        "Compare it against paid search's cost and timeline rather than judging SEO in total isolation, since organic results interact with and are hard to fully separate from other channels running simultaneously (",
        {
          text: 'HN',
          href: 'https://hn.algolia.com/api/v1/search?query=how%20long%20does%20SEO%20take%20to%20work',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'Why doesn\'t dedicated "first 90 days with an SEO agency" content dominate search results?',
      answer: [
        'Direct SERP checks for phrases like "seo agency 90 day plan" and "seo agency client timeline" surface mostly broad, definitional "what is SEO" guides (Moz, Semrush, Ahrefs, Google\'s own starter guide) rather than dedicated first-90-days content — a real, documented content gap.',
      ],
    },
    {
      question: 'What is a technical SEO audit?',
      answer: [
        "A review of a website's crawlability, indexing, site speed, and structural issues that could be limiting search-engine visibility — the typical first deliverable in month one of an agency engagement.",
      ],
    },
    {
      question: 'What does "keyword baseline" mean in an SEO onboarding context?',
      answer: [
        'A documented starting point of where your target keywords currently rank, established early in the engagement so later progress can be measured against a known reference point.',
      ],
    },
    {
      question: 'Why do agencies ask for Search Console and analytics access early?',
      answer: [
        'To verify current performance, set an accurate baseline, and track progress — this access is a basic month-1 deliverable, and its absence in the first 30 days is itself worth questioning.',
      ],
    },
    {
      question: "What's a reasonable retainer price range for SEO services?",
      answer: [
        'Evidence not sufficiently verified as a general range — the real figure discussed in available practitioner sources ($6,000/month) is one specific case, not a documented industry-wide benchmark; pricing varies significantly by market, business size, and scope.',
      ],
    },
    {
      question: 'How do I evaluate an SEO agency after the first 90 days?',
      answer: [
        'Compare actual delivered work against the month-1/2/3 pattern (audit and baseline, execution, early signal), and ask for transparent reporting that acknowledges rather than glosses over attribution difficulty.',
      ],
    },
    {
      question: 'How do I onboard a new SEO agency effectively?',
      answer: [
        'Provide analytics/Search Console access promptly, clarify your business goals and target audience upfront, and expect (and request) a written plan with specific target keywords and pages by the end of month one.',
      ],
    },
    {
      question: 'What questions should I ask before signing a contract?',
      answer: [
        'Ask specifically about backlink sourcing and cost, expected timeline for different types of results, and how they measure and report ROI given the genuine causality-attribution challenge.',
      ],
    },
    {
      question: 'How do I know if my SEO agency is scamming me?',
      answer: [
        'Watch for the documented red-flag pattern: vague or unverifiable backlink sourcing, unrealistic timeline promises (first page in weeks), and reporting that never attributes specific results to specific work.',
      ],
    },
    {
      question: 'How do I check if the backlinks my agency is building are legitimate?',
      answer: [
        'Ask for the actual list of referring domains and independently review them for relevance and quality, rather than accepting a domain-authority number alone at face value.',
      ],
    },
    {
      question: 'How do I set realistic expectations with my team about SEO timelines?',
      answer: [
        'Frame month 3 as "early signal" rather than "results," and communicate that sustained, multi-month effort is required for most competitive terms, rather than promising leadership a fast payoff.',
      ],
    },
    {
      question:
        "How do I compare an agency's proposal against a freelancer-plus-in-house approach?",
      answer: [
        "Map the agency's quoted retainer against the real cost of a freelance content writer plus in-house technical work using accessible tools (Yoast, GA) to see whether the agency's overhead and markup are actually buying you something proportionate.",
      ],
    },
    {
      question: 'How should I read a monthly SEO report from my agency?',
      answer: [
        "Look for specific, attributable claims (which keywords moved, which pages saw traffic changes, and why) rather than vague summaries — and remember that isolating SEO's effect from other marketing activity is genuinely hard even for an honest agency.",
      ],
    },
    {
      question:
        'How do I push back on vague reporting without damaging the relationship?',
      answer: [
        'Frame it around the known measurement challenge (multiple channels running simultaneously) and ask specifically for the reporting practices that address it, rather than treating vagueness as automatically adversarial.',
      ],
    },
    {
      question: 'How do I decide whether to keep or fire an agency at the 90-day mark?',
      answer: [
        'Weigh whether month-1 foundational deliverables actually happened, whether month-2 execution matches the plan, and whether month-3 early signals are present — not whether final rankings have already arrived, which is an unrealistic bar at 90 days.',
      ],
    },
    {
      question:
        'Is SEO agency work fundamentally different for small businesses versus large enterprises?',
      answer: [
        "Not evidenced as fundamentally different in mechanism from the sources reviewed, though scope, retainer size, and reporting complexity would reasonably scale with business size — this specific comparison wasn't directly addressed in the available sources.",
      ],
    },
    {
      question:
        'Does industry vertical (e.g., healthcare vs. ecommerce) change what a legitimate SEO engagement looks like?',
      answer: [
        'The real backlink-markup case discussed was specifically in a healthcare context, while the pushback in the same thread came from an ecommerce-focused agency owner — suggesting the same red flags and legitimate practices apply across verticals, though specific tactics (like compliance-sensitive content review in healthcare) would reasonably differ by industry.',
      ],
    },
    {
      question: 'Can an SEO agency guarantee rankings?',
      answer: [
        "No legitimate agency can honestly guarantee specific rankings, since search engine algorithms aren't controlled by the agency — a guarantee of specific results (especially on a short timeline) is itself a red flag per the practitioner discussion above.",
      ],
    },
    {
      question:
        'Is it normal for month 1 to feel slow, with mostly audits and no visible traffic change?',
      answer: [
        "Yes — month 1 is explicitly the discovery/foundation phase across the onboarding guides reviewed; visible traffic or ranking movement isn't expected until month 3 at the earliest, and often later for competitive terms.",
      ],
    },
    {
      question: "What's the difference between an SEO audit and an SEO strategy/roadmap?",
      answer: [
        'An audit assesses current technical and content state; a strategy/roadmap (typically also a month-1 deliverable) translates audit findings into a prioritized, forward-looking plan with specific target keywords and timelines.',
      ],
    },
    {
      question: 'SEO agency vs. freelancer — which is more transparent?',
      answer: [
        "A freelancer working directly on a project basis tends to offer more direct visibility into what work is actually being done, since there's no agency markup layer between the client and the person doing the work, per commenters in the core HN discussion (",
        {
          text: 'HN',
          href: 'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'SEO agency vs. in-house SEO — which is more cost-effective for a small business?',
      answer: [
        'In-house (paired with freelance content support) is described as more cost-effective and transparent in real practitioner discussion, though it requires having someone internally capable of managing technical SEO tools and strategy.',
      ],
    },
    {
      question:
        'SEO agency vs. doing SEO yourself — is DIY realistic for a small business?',
      answer: [
        "It's realistic for businesses with someone willing to learn accessible tools (Yoast, Google Analytics, Search Console) and invest real time, per the alternative model recommended in the core HN discussion — but it trades agency bandwidth and experience for founder/staff time.",
      ],
    },
    {
      question: 'Ahrefs vs. Semrush — does it matter which tool my agency uses?',
      answer: [
        "Both are legitimate, widely used SEO research and tracking platforms; the specific tool matters less than whether the agency is transparent about what the tool's data actually shows you.",
      ],
    },
    {
      question:
        'Month-1-heavy agencies vs. agencies that promise immediate results — which approach is more trustworthy?',
      answer: [
        'An agency that front-loads month one with audits, baselines, and planning (rather than promising immediate rankings) is following the pattern real onboarding guides describe as legitimate — immediate-result promises are the pattern flagged as a red flag.',
      ],
    },
    {
      question:
        "My agency hasn't delivered a written plan by the end of month 1 — is that a problem?",
      answer: [
        'Yes — a documented 90-day plan naming target keywords and pages is a standard month-1 deliverable across current onboarding guidance; its absence by day 30 is worth raising directly.',
      ],
    },
    {
      question:
        "My agency's reporting never explains why traffic changed — what should I do?",
      answer: [
        "Ask directly for attribution detail (which keywords/pages moved and the likely cause), while recognizing the genuine difficulty of isolating SEO's effect — vague reporting that never even attempts attribution is the specific pattern to push back on.",
      ],
    },
    {
      question: "My traffic hasn't moved by month 3 — should I be worried?",
      answer: [
        'Not necessarily — month 3 is explicitly framed as "early signal," not final results, in current onboarding guidance; ask instead whether the foundational month-1/2 work (audit, fixes, content, initial link building) actually happened as planned.',
      ],
    },
    {
      question:
        "I found out my agency's backlinks come from low-quality sites — what now?",
      answer: [
        'This matches a real, documented red-flag pattern; request the full list of referring domains, have them independently reviewed, and consider this grounds for renegotiating or ending the engagement if the sites are genuinely low-quality or spammy.',
      ],
    },
    {
      question:
        "My agency promised first-page rankings within weeks and it didn't happen — was I scammed?",
      answer: [
        "The promise itself was the problem — practitioners flag exactly this kind of unrealistic timeline claim as a red flag independent of outcome, since it doesn't match how search ranking actually works; treat the broken promise as confirmation to scrutinize the rest of the engagement closely.",
      ],
    },
    {
      question:
        'Should I hire an SEO agency, or is local SEO service better suited to my small business?',
      answer: [
        'For a business primarily serving a local customer base, a service specifically focused on local SEO (Google Business Profile optimization, local citations, local-intent keyword targeting) may be a better-scoped fit than a generalist national SEO retainer.',
      ],
    },
    {
      question:
        'What should a small business budget for a legitimate first-90-day SEO engagement?',
      answer: [
        'Evidence not sufficiently verified as a general figure — pricing varies significantly by market and scope; use the four-category deliverable breakdown (on-page, keyword research, content, backlinks) to evaluate whether a specific quote maps to real, itemizable work rather than anchoring to a single reported number.',
      ],
    },
    {
      question: 'Is a cheap SEO retainer automatically a red flag?',
      answer: [
        "Not automatically, but it's worth scrutinizing how a low price maps to the four core deliverable categories — an unusually cheap retainer that still promises comprehensive work across all four areas deserves the same link-sourcing and reporting-transparency questions as an expensive one.",
      ],
    },
    {
      question: 'How do I compare multiple SEO agency proposals before choosing one?',
      answer: [
        'Use a structured question list covering methodology, link sourcing, reporting transparency, and realistic timelines (in the spirit of established "questions to ask" guides) across every agency you\'re considering, rather than comparing price alone.',
      ],
    },
    {
      question:
        "If I've had a bad experience with one SEO agency, does that mean SEO agencies generally aren't worth it?",
      answer: [
        'Not necessarily — the same real discussion that surfaced the backlink-markup scam pattern also included a working agency owner arguing legitimate SEO work remains profitable when done honestly; the practical takeaway is to screen more carefully for the specific documented red flags, not to write off the category entirely.',
      ],
    },
  ],
  sources: [
    'https://hn.algolia.com/api/v1/search?query=SEO%20agency%20worth%20it',
    'https://hn.algolia.com/api/v1/search?query=how%20long%20does%20SEO%20take%20to%20work',
    'https://mashable.com/2013/10/22/seo-hiring-questions/',
    'https://upgrowth.in/seo-agency-first-90-days-breakdown/',
    'https://choice.marketing/research/first-90-days-marketing-agency/',
    'https://ekaksharconsultants.com/what-to-expect-in-the-first-90-days-with-an-seo-agency/',
    'https://gobig.systems/what-to-expect-from-an-seo-agency/',
    'https://thestacc.com/blog/onboarding-seo-clients/',
  ],
  relatedTools: [
    'website-speed-test',
    'schema-markup-generator',
    'faq-schema-generator',
    'marketing-roi-calculator',
  ],
  relatedPrompts: [],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-21',
  readingMinutes: 17,
}
