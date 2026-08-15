import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ai-visibility-checker-guide'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every fact checked against lib/tools/ai-visibility-checker/logic.ts —
 * the AI_BOTS array (all ten crawlers, spelled out exactly, including
 * ChatGPT-User which the tool's own FAQ answer omits by name), the 40/20/20/
 * 10/10 scoring weights, and the noai vs robots.txt distinction.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Is My Site Blocked From ChatGPT? A Free AI Visibility Checker',
  h1: 'Is your website invisible to ChatGPT, Claude and Perplexity? Check for free',
  targetKeyword: 'is my site blocked from chatgpt',
  description:
    'Check whether GPTBot, ClaudeBot, PerplexityBot and seven other AI crawlers can actually read your site — free 0-100 score with the exact robots.txt line or missing tag behind each result.',
  dek: 'Most sites have never checked whether an AI crawler can even fetch their homepage, let alone parse it. This is the free tool that checks — and the ten crawlers, five scoring checks, and one very common robots.txt mistake worth understanding before you run it.',
  sections: [
    {
      heading: 'Why "we rank fine on Google" does not mean AI can see you',
      body: [
        [
          'Here is the confusion this tool exists to clear up: Googlebot and the crawlers behind ChatGPT, Claude and Perplexity are entirely different user-agents, governed by entirely different rules in your robots.txt file. A site can have healthy organic Google traffic while every AI crawler that matters is quietly blocked — sometimes by the site owner deliberately, more often by a CDN or security-plugin default nobody reviewed after installing it. Classic SEO health tells you nothing about this, because it is measuring a different crawler entirely.',
        ],
        [
          'The reason this has started to matter commercially rather than academically: AI answer engines are becoming a real acquisition channel. When ChatGPT or Perplexity answers a question directly and cites a source, that citation is a placement your business either has or does not — and unlike a Google ranking, there is no incremental path to it. Either the crawler that builds the underlying index and the crawler that answers live queries can both reach your page, or your site does not exist in that channel at all, regardless of how good the content actually is.',
        ],
      ],
    },
    {
      heading: 'The ten crawlers this checker actually tests, by name',
      body: [
        [
          'The ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          " tests exactly ten named crawlers across six companies, not a vague \"AI bots\" category: GPTBot (OpenAI, model training) and OAI-SearchBot (OpenAI, the ChatGPT search index) and ChatGPT-User (OpenAI, live ChatGPT browsing) are three separate bots with three separate purposes — a site can allow one while blocking the other two, and the distinction changes what you're actually opting into. ClaudeBot and anthropic-ai cover Anthropic's current and legacy crawlers. PerplexityBot covers Perplexity's own search index. Google-Extended is specifically Gemini training and grounding — a separate opt-out from classic Googlebot, which many site owners do not realise is a distinct toggle. CCBot is Common Crawl's crawler, the open dataset a large share of foundation models train on regardless of company. Bytespider is ByteDance's crawler, and meta-externalagent covers Llama training at Meta.",
        ],
        [
          'The three-bots-per-company pattern with OpenAI is the one worth internalising: "allow OpenAI" is not one decision. GPTBot feeds model training, OAI-SearchBot feeds the ChatGPT search index specifically, and ChatGPT-User is what fetches a page live when a user asks ChatGPT to browse it in real time. A robots.txt rule blocking GPTBot while allowing the other two is a completely coherent choice — opt out of training, stay visible in search and live browsing — and this checker reports each one individually so you can see exactly which combination you actually have, rather than one blended "OpenAI: blocked/allowed" verdict.',
        ],
      ],
    },
    {
      heading: 'How the 0-100 score actually breaks down',
      body: [
        [
          'The score is a weighted blend of five checks, out of 100, and the weighting itself carries information: crawler access is worth 40 points — by far the largest single check — because if a crawler cannot fetch your homepage at all, nothing else on the list matters for that engine. Structured data is worth 20: does your homepage declare an Organization, WebSite, LocalBusiness or Person identity block, not just page-specific schema like FAQPage. On-page basics are worth another 20 — title, meta description, one H1, at least two H2s, a lang attribute, a complete Open Graph set, a canonical link, real alt text, and enough visible text that the page is not thin. llms.txt is worth 10, and sitemap declaration is worth the final 10.',
        ],
        [
          'The bands: 80-100 is "AI-visible" — engines can fetch, parse and cite your homepage. 50-79 is "partially visible" — reachable, but missing structured data, on-page basics, or the llms.txt/sitemap signals. 0-49 is "mostly invisible to AI" — at least one crawler is outright blocked, or several other checks are failing simultaneously. A high score is eligibility, not a citation guarantee — content quality and topical authority still decide the rest, the same way they do in classic search.',
        ],
        [
          'One separate, unscored signal worth knowing about even though it does not factor into the 0-100 number: a noindex or nofollow directive on the homepage. It is checked and flagged independently because it can suppress a page from AI answers entirely regardless of every other check passing — the single override that makes everything above it moot if it is present, usually by accident, most often a staging-environment flag nobody removed after launch.',
        ],
      ],
    },
    {
      heading: 'The most common mistake: robots.txt precedence',
      body: [
        [
          'The single most frequent real-world finding this tool surfaces: a site owner writes "Disallow: /" under "User-agent: GPTBot" specifically, intending to block it, while leaving "User-agent: *" wide open — and assumes the wildcard\'s permissiveness somehow softens or overrides the specific block. It does not. The rule that decides each crawler is always the most specific User-agent group that names it, falling back to the wildcard only when nothing more specific matches — so a targeted Disallow overrides a generous wildcard Allow every single time, regardless of which one looks more permissive or which one appears first in the file.',
        ],
        [
          'It cuts the other way too, and this direction trips people up just as often: an "Allow: /" written under a bot-specific group does nothing to override a blanket "Disallow: /" sitting under a different, unrelated group — it only helps the specific bot it names. And a bare "Disallow:" with nothing after the colon blocks nothing at all; it is a common accidental way of writing "allow everything" while believing you wrote a restriction. Every check card in this tool\'s report states exactly which robots.txt group decided each crawler\'s access, so you can verify this logic against your own file line by line rather than trusting an assumption about how permissive it looks.',
        ],
      ],
    },
    {
      heading: "What the checker doesn't cover, on purpose",
      body: [
        [
          'This tool checks your homepage only, not a full-site crawl — a deliberate scope decision, because a full crawl is a fundamentally different product (a queue that runs over time, not a single synchronous request), and one honest homepage check is the right size for a free tool with no email gate and no signup. It also reports the public crawl signals it can see, not what an AI company actually does with your content once fetched — that part of the pipeline is opaque from the outside by design, on both sides.',
        ],
        [
          "The check also reads the HTML your server actually sends, not the DOM after client-side JavaScript runs. A single-page application that injects its title, meta description or schema after the page loads in a browser will score lower here than a real visitor's browser would experience — because the AI crawlers this tool is modelling mostly do the same thing: they read what arrives over the wire, not what a browser renders after executing your JavaScript bundle. If your score looks worse than your site seems in a normal browser, that gap is worth investigating specifically.",
        ],
      ],
    },
    {
      heading: 'Fixing what the checker finds',
      body: [
        [
          'Every finding in the report ships with a specific, actionable fix rather than a generic "improve this" note — a robots.txt line to change, a missing meta tag to add, a schema type to declare. For the structured-data check specifically, the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ' handles the Organization, WebSite, LocalBusiness or Person block this checker is looking for on your homepage — nine schema types total, generated as valid, correctly-nested JSON-LD rather than hand-typed and risking the common nesting mistakes that break structured data silently. For question-and-answer content specifically, the ',
          { text: 'FAQ Schema Generator', href: '/seo/faq-schema-generator' },
          ' produces the matching FAQPage markup — worth knowing that Google retired FAQ rich results in classic search on 7 May 2026, so that specific markup is now aimed squarely at the same AI-citation audience this checker cares about, not at a search-result dropdown.',
        ],
        [
          'For the broader on-page-basics check — thin content, missing Open Graph tags, alt text coverage — the ',
          {
            text: 'AI search visibility checklist',
            href: '/guides/ai-search-visibility-checklist',
          },
          ' walks through the full nine-point list this tool scores, in the order they actually matter, with the reasoning behind each one rather than just a pass/fail.',
        ],
      ],
    },
    {
      heading: 'When it is worth a real GEO strategy, not just a fix list',
      body: [
        [
          'A free checker tells you what is broken right now — a point-in-time snapshot, deliberately, since robots.txt and your homepage HTML can change at any moment and the next check reads whatever is live. What it cannot do is architect an ongoing GEO strategy across dozens or hundreds of pages, decide which content genuinely deserves AI-citation investment versus which does not, or monitor citation share against competitors over time. That is a different scale of problem, and one where a specific per-page fix stops being the highest-leverage move.',
        ],
        [
          'If AI visibility has become a real channel your business is competing in rather than a box to check once, ',
          {
            text: "that's the work Scult's AI agents and automation team does",
            href: SERVICE.href,
            external: true,
          },
          ' — building the structured-data and content architecture out across a full site rather than one homepage at a time, and monitoring it as engines and their crawlers keep changing.',
        ],
        [
          'Want to talk through what that would actually look like for your specific site first? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          ' — no obligation, just a conversation grounded in your real check results rather than a generic pitch.',
        ],
      ],
    },
    {
      heading: 'Run the check',
      body: [
        [
          'The checker takes one URL and a few seconds, and returns the full ten-crawler breakdown, the five weighted checks, and the noindex/noai signals — free, no signup, no email gate. Run it, work through whichever checks come back red in the order the weights suggest (crawler access first, always), and re-check afterward to confirm a fix actually landed rather than assuming it did.',
        ],
        [
          'Checking the same domain again later shows how many points moved since your last check on this browser — no account, no server-side storage of your history, just a comparison kept in your own local storage so the trend is visible without anyone needing to sign up for it.',
        ],
      ],
    },
  ],
  relatedTools: [
    'ai-visibility-checker',
    'schema-markup-generator',
    'faq-schema-generator',
    'website-speed-test',
  ],
  relatedPrompts: ['seo-geo-serp-intent-content-brief'],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 14,
}
