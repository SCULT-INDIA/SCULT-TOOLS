import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'

export const metadata: Metadata = {
  title: 'SEO, GEO & AEO Glossary',
  description:
    'Plain-English definitions of SEO, GEO and AEO terms — AI crawlers, robots.txt, llms.txt, structured data, Core Web Vitals — matched to how our own tools check each one.',
  alternates: { canonical: '/glossary' },
}

// Standalone inline link on this page's plain article background — not a
// tile/violet-50/100 fill — text-violet-700 alone measures well under AA in
// dark mode. --color-violet-accent-text is this codebase's existing
// dark-mode-only token for standalone accent text (see .eyebrow / nav-link
// hover); the fallback keeps light mode's violet-700 unchanged.
const LINK_CLASS =
  'text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600'

/**
 * A glossary built to be quoted, not skimmed.
 *
 * Every definition that touches how *this site's own tools* implement a
 * concept — the AI crawler roster, the robots.txt precedence rules, the
 * llms.txt/sitemap checks, the JSON-LD types the AI Visibility Checker looks
 * for — is written to match `lib/tools/ai-visibility-checker/logic.ts` and
 * `lib/seo/jsonld.tsx` exactly, not generic textbook phrasing that could
 * contradict what the tool actually does. Terms that map to one of our own
 * tools link to it; two terms (robots.txt, llms.txt) link to this site's own
 * live file as a working example instead.
 */
export default function GlossaryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Glossary', path: '/glossary' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Glossary</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          SEO, GEO and AEO terms, defined plainly
        </h1>
        <p className="mt-5 text-[18px] text-ink-muted leading-8 md:text-lead">
          No recycled textbook phrasing. Every definition below that describes how one of
          our own tools checks something is written to match that tool's actual code, not
          a generic idea of what the term means.
        </p>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">SEO</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Search Engine Optimization. The practice of structuring a page so a
            traditional search engine — Google, Bing — can crawl it, understand what it
            covers, and rank it for a matching query. The target is a listing on a results
            page that a person then clicks.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            GEO (Generative Engine Optimization)
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            The same underlying work as SEO — clean structure, structured data, a
            crawlable site — aimed at a different destination: getting a generative AI
            system to read, cite or quote a page inside an answer it writes, rather than
            just linking to it. Our{' '}
            <Link href="/geo/ai-visibility-checker" className={LINK_CLASS}>
              AI Visibility Checker
            </Link>{' '}
            scores a site against specific signals — which AI crawlers may fetch it,
            structured data, on-page basics, llms.txt, a sitemap — rather than reporting a
            single, unexplained "GEO score."
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            AEO (Answer Engine Optimization)
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Optimizing content to be the thing an answer engine — ChatGPT, Perplexity, an
            AI Overview — states directly as the answer, rather than one of several ranked
            links. In practice it overlaps heavily with GEO: FAQPage schema, direct
            answers near the top of a page, and clear headings serve both goals at once,
            which is why our{' '}
            <Link href="/geo/ai-visibility-checker" className={LINK_CLASS}>
              AI Visibility Checker
            </Link>{' '}
            does not try to score the two separately.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">AI crawler</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            An automated fetcher operated by an AI company — to gather training data, to
            build a live search index, or to browse a page a user asked about — as
            distinct from a general-purpose search crawler like Googlebot. Our{' '}
            <Link href="/geo/ai-visibility-checker" className={LINK_CLASS}>
              AI Visibility Checker
            </Link>{' '}
            checks a site's robots.txt against ten named AI crawlers, including OpenAI's
            GPTBot and ChatGPT-User, Anthropic's ClaudeBot, PerplexityBot and
            Google-Extended, and reports which ones may fetch the homepage.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">robots.txt</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            A plain-text file at a site's root that tells crawlers, in named User-agent
            groups, which paths they may or may not fetch — the format is standardized in
            RFC&nbsp;9309. It can block or allow one specific AI crawler by its own
            user-agent token without touching any other crawler, and it can declare a{' '}
            <code>Sitemap:</code> line pointing at the site's XML sitemap. You can see
            this site's own file at{' '}
            <Link href="/robots.txt" className={LINK_CLASS}>
              /robots.txt
            </Link>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">llms.txt</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            An emerging, informal convention: a plain-markdown file at /llms.txt listing a
            site's most important pages with one-line summaries, meant as a curated map
            for AI systems that would otherwise have to guess which pages matter. No
            standards body governs it and no engine treats it as authoritative yet, which
            is why our AI Visibility Checker only ever flags a missing one as a warning,
            never a failure. See this site's own file at{' '}
            <Link href="/llms.txt" className={LINK_CLASS}>
              /llms.txt
            </Link>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">XML sitemap</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            An XML file — usually at /sitemap.xml — listing a site's URLs so a crawler can
            discover pages without following every link on every page. It should be
            declared in robots.txt with a <code>Sitemap:</code> line; our AI Visibility
            Checker checks both whether robots.txt declares one and whether /sitemap.xml
            itself responds, and flags the gap as a fix if the file exists but isn't
            declared where crawlers actually look for it.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            JSON-LD / structured data
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            A <code>{'<script type="application/ld+json">'}</code> block embedding facts
            about a page as machine-readable JSON, using the schema.org vocabulary, so a
            crawler can read what a page is directly instead of inferring it from prose.
            Our{' '}
            <Link href="/seo/schema-markup-generator" className={LINK_CLASS}>
              Schema Markup Generator
            </Link>{' '}
            builds a valid block; the AI Visibility Checker parses every JSON-LD block on
            a homepage independently, so one malformed block can't hide the valid ones
            next to it, and reports every type it finds.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Schema.org</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            The shared vocabulary of types — Organization, WebSite, LocalBusiness, Person,
            FAQPage, Article, and hundreds more — that a JSON-LD block declares its type
            from. It is maintained jointly by Google, Microsoft, Yahoo and Yandex, which
            is why the same markup is readable by all of their crawlers instead of needing
            a separate format per engine.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">FAQPage schema</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            A schema.org type that marks up a genuine list of visible question-and-answer
            pairs on a page, letting an answer engine lift a specific pair directly into a
            result. It should only ever describe content actually rendered on the page —
            marking up hidden or absent questions is a structured-data violation, not a
            shortcut. Our{' '}
            <Link href="/seo/faq-schema-generator" className={LINK_CLASS}>
              FAQ Schema Generator
            </Link>{' '}
            builds a valid block from your own questions and answers.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Canonical URL</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            The URL declared in a page's <code>{'<link rel="canonical">'}</code> tag as
            the authoritative version of that content, used whenever the same or
            near-duplicate content is reachable at more than one address — with and
            without a trailing slash, with tracking parameters, across http and https.
            Search and AI engines index and cite the canonical URL, not necessarily the
            one a visitor actually landed on.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Core Web Vitals (LCP, CLS, INP)
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Google's three field metrics for how a page feels to actually use: Largest
            Contentful Paint (how long the biggest visible element takes to render),
            Cumulative Layout Shift (how much content jumps around while loading), and
            Interaction to Next Paint (how quickly the page responds to a click or tap).
            Our{' '}
            <Link href="/seo/website-speed-test" className={LINK_CLASS}>
              Website Speed Test
            </Link>{' '}
            reports all three.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">UTM parameters</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Query-string parameters — <code>utm_source</code>, <code>utm_medium</code>,{' '}
            <code>utm_campaign</code>, and optionally <code>utm_term</code>/
            <code>utm_content</code> — appended to a link so an analytics tool can
            attribute the resulting visit to a specific channel and campaign instead of
            lumping it in as generic referral traffic. Build your own with the{' '}
            <Link href="/seo/utm-builder" className={LINK_CLASS}>
              UTM Builder
            </Link>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">ROI vs ROAS</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Return on Investment is (revenue − cost) ÷ cost — it accounts for every cost
            in a campaign, including margin. Return on Ad Spend is revenue ÷ ad spend
            alone — a narrower ratio that only looks at media cost. A campaign can report
            an impressive ROAS and still lose money once product cost and overhead are
            counted, which is the gap our{' '}
            <Link href="/seo/marketing-roi-calculator" className={LINK_CLASS}>
              Marketing ROI Calculator
            </Link>{' '}
            shows side by side.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Meta description
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            The text in a page's <code>{'<meta name="description">'}</code> tag — a one-
            or two-sentence summary a search engine may show under the title in results,
            and an AI system may quote when it needs a quick description of what a page
            covers. It has no direct effect on ranking, but a missing one is one of the
            on-page basics our AI Visibility Checker flags, because it's free context an
            engine would otherwise have to guess at.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Open Graph tags
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            A set of <code>{'<meta property="og:...">'}</code> tags —{' '}
            <code>og:title</code>, <code>og:description</code>, <code>og:image</code> —
            originally built for social-media share cards, now also read by many AI and
            social crawlers to understand a page's context without fetching and parsing
            the whole document. Open Graph uses the <code>property</code> attribute, not{' '}
            <code>name</code>, which is the one detail that trips up a hand-written meta
            tag.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Alt text</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            The <code>alt</code> attribute on an <code>{'<img>'}</code> tag, describing
            what an image shows for a screen reader and for any crawler that cannot run a
            vision model over every image on a page. Our AI Visibility Checker treats a
            homepage with under 80% alt-text coverage across its images as a signal worth
            fixing; only a non-empty value counts, since an empty <code>alt=""</code>{' '}
            gives an engine nothing to read even though it's a valid pattern for a purely
            decorative image.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">E-E-A-T</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Google's Experience, Expertise, Authoritativeness and Trustworthiness
            framework, used in its search quality rater guidelines to judge content. It is
            not a directly measurable ranking factor — it's a lens: does a page show it
            was written by someone with real, checkable experience of the subject, on a
            site that discloses who is actually accountable for it. Every tool page on
            this site points its byline at a real, named{' '}
            <Link href="/about" className={LINK_CLASS}>
              author page
            </Link>{' '}
            for exactly that reason.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Knowledge Graph
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            A search engine's own database of entities — people, organizations, places —
            and the verified facts and relationships between them, used to disambiguate
            what an entity actually is before it appears in an AI answer. Organization and
            Person schema markup is one of the inputs an engine draws on to build or
            correct an entry, though inclusion is never guaranteed just because the markup
            exists.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">noindex</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            A directive — in a page's <code>{'<meta name="robots">'}</code> tag or its{' '}
            <code>X-Robots-Tag</code> HTTP header — telling every search and AI engine not
            to index the page at all. It differs from the milder <code>noai</code>{' '}
            directive, which only asks AI systems not to train on or reuse a page's
            content; a <code>noai</code> page can still be indexed and cited, but a{' '}
            <code>noindex</code> page has nothing to retrieve or cite in the first place.
            Our AI Visibility Checker reports it as the single most severe finding it can
            surface, even though — like <code>noai</code> — it deliberately leaves it out
            of the numeric score, since opting out of indexing is sometimes a deliberate
            choice rather than a mistake.
          </p>
        </section>
      </article>
    </>
  )
}
