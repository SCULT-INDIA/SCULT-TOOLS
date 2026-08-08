import type { Guide } from '../types'

/**
 * The practical companion to the AI Visibility Checker: every check this
 * guide describes — the crawler roster, the scoring weights, the exact
 * thresholds — is lifted directly from
 * `lib/tools/ai-visibility-checker/logic.ts` so the two never drift apart.
 * If that file's `AI_BOTS` list, `THIN_CONTENT_WORD_THRESHOLD` or scoring
 * weights change, this guide has to change with them.
 */
export const meta: Guide = {
  slug: 'ai-search-visibility-checklist',
  title: 'How to Make Your Website Visible to AI Search — A Practical Checklist',
  h1: 'How do I make my website visible to ChatGPT, Perplexity and AI search?',
  description:
    'A checklist for AI search visibility: robots.txt rules for GPTBot and ClaudeBot, an llms.txt file, structured data, and the on-page basics AI engines cite.',
  dek: 'AI answer engines can only cite a page they can crawl, understand and quote. This is the checklist that decides whether yours is one of them — the same one our AI Visibility Checker scores automatically.',
  sections: [
    {
      heading: 'Why this is worth doing now',
      body: [
        'ChatGPT, Perplexity and Google’s AI Overviews increasingly answer a question directly, without sending anyone to the page the answer came from. That changes the incentive: ranking well in classic search no longer guarantees anything if the engine quoting an answer never considered the page citable in the first place.',
        'What makes a page citable is checkable, not mysterious. Can the AI crawler actually fetch it, does it declare what it is through structured data, do the on-page basics give an engine something worth quoting, and is there a machine-readable map of what pages exist. This checklist covers exactly those things, in the order they matter.',
      ],
    },
    {
      heading: 'Do not block the AI crawlers in robots.txt',
      body: [
        'A robots.txt rule that blocks an AI crawler — by name or through a wildcard group — is the single biggest reason a site never shows up in an AI answer, because every other check on this list is irrelevant if the crawler cannot fetch the page at all. Ten crawlers are worth checking by name: GPTBot (OpenAI, model training), OAI-SearchBot (OpenAI, ChatGPT search index), ChatGPT-User (OpenAI, live ChatGPT browsing), ClaudeBot (Anthropic, model training), anthropic-ai (Anthropic, legacy Anthropic crawler), PerplexityBot (Perplexity, Perplexity search index), Google-Extended (Google, Gemini training and grounding), CCBot (Common Crawl, the open dataset many models train on), Bytespider (ByteDance, model training), and meta-externalagent (Meta, Llama training).',
        'The rule that decides each one is the most specific User-agent group that names it, falling back to a wildcard User-agent: * group only when nothing more specific matches. Within a group, the longest matching path wins regardless of where it sits in the file, and an exact tie between an Allow and a Disallow goes to Allow. A bare Disallow: with nothing after the colon blocks nothing — it is a common way to write "allow everything" by accident. And if robots.txt has no group for a bot at all, or the file is missing entirely, that bot is allowed by default, the same as it always has been for ordinary search crawlers.',
      ],
    },
    {
      heading: 'Publish an llms.txt',
      body: [
        'llms.txt is a plain markdown file at the root of a site — /llms.txt — listing the most important pages with a one-line summary each. It gives an AI system a curated map instead of forcing it to infer what matters from a full crawl. It is an emerging standard, not yet something every site has, which is exactly why it is worth doing early: most competitors will not have one yet, so it is a real point of difference rather than table stakes. Writing one takes about ten minutes and needs no build tooling — a static file served at the root is enough.',
      ],
    },
    {
      heading: 'Add structured data that says what your site is',
      body: [
        'At minimum, one JSON-LD script block on the homepage declaring an Organization or WebSite type — LocalBusiness or Person also count, for a site that identifies as a business with a physical presence or an individual. With none of these, an AI system has to infer what the site even is from prose alone. And having some structured data is not automatically enough: a page can carry FAQPage or Article schema and still leave the basic question unanswered, because those describe what one page is about, not what the site behind it is.',
        'Adding a single <script type="application/ld+json"> tag with at least one of those four identity types is the cheapest structured-data fix available, and it should come before adding anything more specific to individual pages.',
      ],
    },
    {
      heading: 'Get the on-page basics right',
      body: [
        'These are the plain signals an AI system reads before doing anything clever: a <title> tag, a meta description, exactly one h1, at least two real h2 section headings, a lang attribute on the <html> tag, a complete Open Graph trio (og:title, og:description, og:image), a <link rel="canonical"> tag, alt text on at least 80% of the page’s images, and enough visible text to be worth citing — the working threshold is 150 words, because a homepage shorter than that gives an engine nothing to quote no matter how many other boxes it ticks.',
        'None of this is exotic. It is the same on-page hygiene classic SEO has asked for for years, which is worth noting on its own: a site that already does ordinary SEO well is most of the way to AI visibility already. These nine signals are best treated as a set — missing one or two is a minor gap, missing most of them is a real problem.',
      ],
    },
    {
      heading: 'Declare your sitemap in robots.txt',
      body: [
        'An XML sitemap lets a crawler discover every page on a site without following links one at a time. Simply having the file at /sitemap.xml is only half of it: a crawler checking for a sitemap looks first for a Sitemap: line inside robots.txt, and typically only tries the conventional /sitemap.xml path directly as a fallback when robots.txt does not mention one. Add a line like "Sitemap: https://yourdomain.com/sitemap.xml" to robots.txt so every crawler finds it the same way, instead of relying on each one to guess correctly.',
      ],
    },
    {
      heading: 'Check for an accidental noindex',
      body: [
        'A noindex directive in the meta robots tag or the X-Robots-Tag response header tells every search and AI engine not to index the page at all. It is not one signal among many — it overrides everything above it, because none of the rest of this checklist matters if the homepage itself is told not to be indexed. It happens by accident more often than seems likely: a staging flag left on after launch, a theme or plugin default nobody reviewed before going live. A nofollow directive is milder — the page can still be indexed, but its outgoing links stop passing discovery to the rest of the site — and is worth clearing too unless it is deliberate.',
      ],
    },
    {
      heading: 'Checking where a site actually stands',
      body: [
        'Working through this by hand means opening robots.txt, viewing page source, and checking each of the ten crawlers above one at a time. Our AI Visibility Checker runs the whole checklist automatically: paste in a URL and it evaluates crawler access bot by bot, structured data, the nine on-page basics, llms.txt, the sitemap declaration, and the noindex and noai signals, then returns a 0–100 score with the specific robots.txt line or missing tag behind every result.',
      ],
    },
  ],
  relatedTools: [
    'ai-visibility-checker',
    'schema-markup-generator',
    'faq-schema-generator',
  ],
  updatedAt: '2026-08-09',
  readingMinutes: 6,
}
