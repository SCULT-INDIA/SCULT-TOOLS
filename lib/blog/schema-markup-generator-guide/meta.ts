import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'schema-markup-generator-guide'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every factual claim here is checked against the real tool:
 * lib/tools/schema-markup-generator/meta.ts and logic.ts (SCHEMA_TYPES —
 * nine types: Article, Organization, LocalBusiness, Product, Person, Event,
 * WebSite, BreadcrumbList, HowTo). Nothing here is invented beyond what the
 * tool actually generates.
 */
export const meta: BlogPost = {
  slug: 'schema-markup-generator-guide',
  pillar: 'tool',
  title: 'JSON-LD Schema Markup: The Complete 2026 Guide (With a Free Generator)',
  h1: 'JSON-LD schema markup, explained properly — with a free generator',
  targetKeyword: 'json-ld schema markup guide',
  description:
    'A complete, no-fluff guide to JSON-LD structured data: what it actually does for rankings and AI citations, the nine schema types that matter, and how to add it without breaking your page.',
  dek: 'Structured data is the one piece of technical SEO most small teams get wrong in a completely avoidable way — not because it is hard, but because most guides explain the theory and skip the part where you actually have to write valid, nested JSON without a typo. This one does not skip that part.',
  sections: [
    {
      heading: 'What JSON-LD actually does (and does not do)',
      body: [
        [
          'Start with the claim that gets this wrong most often: adding schema markup does not directly improve your Google ranking. ',
          {
            text: 'Google has said this outright',
            href: '/seo/schema-markup-generator/how-it-works',
          },
          ', and it is worth taking at face value rather than treating it as corporate hedging. What structured data actually buys you is eligibility — a page with valid Article, Product or LocalBusiness markup becomes eligible for a rich result (a star rating, a price, a FAQ dropdown, a breadcrumb trail in the SERP), and eligibility is not the same thing as a guarantee. Google still decides whether to show the rich result based on page quality, relevance to the specific query, and whether the markup matches what a visitor actually sees on the page.',
        ],
        [
          'So why bother? Because the effect that does show up reliably is click-through rate. A search result with a star rating and a price sitting next to five plain blue links pulls a disproportionate share of clicks, and that click-through gain compounds — more clicks on the same ranking position is functionally the same as ranking higher, without touching a single backlink. There is a second, newer reason that matters just as much in 2026: AI answer engines lean on structured data to understand what a page is and to decide what is safe to quote. A page that never declares what it is in machine-readable form is handing an AI crawler a harder job than a competitor that does.',
        ],
        [
          'The format itself is JSON-LD — a single, self-contained ',
          {
            text: '<script type="application/ld+json"> block',
            href: '/dev/json-formatter',
          },
          ' that sits anywhere in your page HTML (the <head> is conventional, but Google reads it from the <body> just as well). It replaced the older microdata approach, which wove itemscope and itemprop attributes directly into your existing HTML tags — technically valid, but painful to maintain because a template change could silently break the markup without anyone noticing. JSON-LD is one block you can generate, template and swap out without touching the surrounding markup at all, which is the whole reason Google recommends it as the default choice going into any new project.',
        ],
      ],
    },
    {
      heading: 'The nine schema types worth knowing (and what each one is for)',
      body: [
        [
          'Most small business sites only ever need a handful of these, but knowing the full set means picking the right one instead of defaulting to whatever a template happened to include. The ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ' on this site covers nine, and that list is not arbitrary — it is the set that covers the overwhelming majority of real pages without wandering into the extra-requirements territory of niche types like Recipe or JobPosting.',
        ],
        [
          '**Article** is for blog posts and news content — headline, author (nested as its own Person object), publish date, and a cover image. **Organization** and **WebSite** are homepage-level identity types: they tell a crawler what the business is and what the site is, which matters more than it sounds like it should, because a site with zero identity-level schema forces every downstream system — search or AI — to infer that from prose alone. **LocalBusiness** extends Organization with the things a local search result actually needs: a nested PostalAddress, phone number, and opening hours. **Product** is for anything sold online, with price and availability nested inside an Offer object and reviews nested inside an AggregateRating. **Person** covers author bios and team pages. **Event** covers anything with a date, a venue and a ticket price. **BreadcrumbList** marks up the navigation trail your header already shows visually, in a form a crawler can parse without guessing at your breadcrumb component. **HowTo** structures a set of ordered steps — a recipe-adjacent but more general type for any "do this, then this" content.',
        ],
        [
          'The pattern worth noticing across all nine: complex types nest other types inside them. A Product is not just a flat bag of fields — its price and currency live inside a nested Offer object, its rating lives inside a nested AggregateRating, and an Article author is not a plain string but a nested Person object with its own name field. This is the single most common way hand-written JSON-LD breaks: someone flattens a field that should be nested, and the markup is syntactically valid JSON while being schema.org-invalid, which most validators will still flag but a human proofreading the output often will not catch. Generating it from a typed spec table — which is exactly what this tool does — removes that failure mode entirely, because the nesting is baked into the generator rather than left to memory.',
        ],
      ],
    },
    {
      heading: 'The five errors that break rich results — and how to avoid every one',
      body: [
        [
          'Run enough pages through ',
          { text: "Google's Rich Results Test", href: '/seo/schema-markup-generator' },
          ' and the same five failure patterns show up again and again, in roughly this order of frequency.',
        ],
        [
          'First: a missing required field — a Product with no offers block, or a Review with no author. Second: invalid JSON syntax, almost always a stray trailing comma before a closing brace or an unclosed quote — the kind of typo that is invisible when hand-typing nested JSON at 11pm but instantly obvious the moment you run the text through a ',
          { text: 'JSON validator', href: '/dev/json-formatter' },
          '. Third: a wrong value type — writing a price as the string "₹4,999" instead of the plain number 4999, or a date that is not in ISO 8601 format (YYYY-MM-DD). Fourth, and the one that carries real risk rather than just a missed rich result: schema that describes content the page does not actually show — marking up FAQ pairs, prices or star ratings that a visitor cannot see anywhere on the rendered page. Google treats this as a policy violation, not a warning, and it can trigger a manual action against the whole site, not just the one page. Fifth: picking the wrong @type — using the generic Organization type where LocalBusiness would let a local search result show far more (address, hours, phone) for the same effort.',
        ],
        [
          'A generator sidesteps the first three of these by construction — you cannot omit a required field the type spec demands, you cannot produce malformed JSON because it is assembled programmatically rather than typed by hand, and every value is captured in the correct type from the start. The fourth and fifth are judgment calls no tool can fully automate: you still have to make sure the markup matches what is genuinely on the page, and you still have to pick LocalBusiness over Organization yourself. But removing three of five failure modes mechanically is a meaningfully better starting position than a blank text editor.',
        ],
      ],
    },
    {
      heading: 'Worked example: adding Article schema to a blog post in five minutes',
      body: [
        [
          'Say you run a small content site and want your posts eligible for the "Article" rich treatment. Open the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ", pick Article from the type selector, and fill four fields: headline (match your actual <h1>, not a shortened SEO title), author name (becomes a nested Person object automatically), publish date (in ISO format — the generator enforces this so you cannot get it wrong), and a cover image URL. The JSON-LD script block updates live as you type, and a warnings panel flags anything Google's rich-result requirements consider missing — not just what schema.org marks as merely optional.",
        ],
        [
          'Once the warnings panel is clear, copy the whole script block and paste it into your page template, ideally somewhere that renders on every article page rather than being hand-pasted per post — a CMS template variable is the sustainable version of this, a one-off paste is the version that quietly goes stale. If you write the content itself with AI assistance, pairing this with a structured content brief — something like ',
          {
            text: 'a SERP-anchored content brief prompt',
            href: '/prompts/seo-geo/seo-geo-serp-intent-content-brief',
          },
          ' — keeps the headline and the schema in sync from the start, instead of writing the article first and reverse-engineering the schema afterward.',
        ],
        [
          'Multiple schema blocks can coexist on one page without conflict — an article page commonly carries Article, BreadcrumbList and Organization markup side by side, each as its own separate <script> tag. Generate each type separately here and paste them as independent blocks rather than trying to merge them into one object; Google reads as many script tags as you give it.',
        ],
      ],
    },
    {
      heading: 'Schema markup and AI visibility: the 2026 angle nobody covered in 2022',
      body: [
        [
          "The reason structured data matters more now than it did five years ago has nothing to do with classic Google rankings and everything to do with a channel that barely existed then: AI answer engines. ChatGPT, Perplexity and Google's own AI Overviews decide what to cite partly based on whether a page declares what it is in a form they can parse without inference. A homepage with zero identity-level schema — no Organization, no WebSite, no LocalBusiness or Person block — is handing an AI system a harder job than a competitor whose homepage states its identity in one JSON-LD block.",
        ],
        [
          'This is exactly the layer the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          " scores automatically — structured data is one of five weighted checks in that tool's 0-100 score, worth 20 of the 100 points, specifically checking whether your homepage names what it is with an Organization, WebSite, LocalBusiness or Person block rather than only page-specific schema like FAQPage. If you have already generated Article or Product schema for individual pages but never added an identity block to the homepage itself, that is a specific, fixable gap the checker will flag by name — and one an FAQPage or Article block elsewhere on the site does nothing to close, because those describe what one page is about, not what the site behind it is.",
        ],
        [
          'Pair this generator with the ',
          { text: 'FAQ Schema Generator', href: '/seo/faq-schema-generator' },
          ' for question-and-answer content — a separate tool for a separate schema type this one deliberately does not cover — and you have the two structured-data building blocks that show up most often in what AI engines actually quote back to users.',
        ],
      ],
    },
    {
      heading: 'When DIY schema markup stops being the right call',
      body: [
        [
          'A generator handles the mechanical failure modes — missing fields, malformed JSON, wrong value types — but it cannot decide your information architecture for you. If you are marking up a genuinely large catalogue (thousands of Product pages, a multi-location LocalBusiness footprint, an Event calendar that updates daily), the sustainable fix is schema generation wired directly into your CMS templates or your e-commerce platform, not a hundred individual copy-paste sessions. That is a real engineering decision, not a content one, and it is the point where doing it yourself starts costing more in time than it saves.',
        ],
        [
          "It's also the point where structured data stops being a solo technical-SEO task and becomes part of a broader search strategy — deciding which page types get which schema, auditing what is already live for the mismatch-with-visible-content risk covered above, and tying it to actual keyword and content planning rather than treating schema as an isolated checkbox. If that is the stage you are at, ",
          {
            text: "that's what Scult's SEO team does for a living",
            href: SERVICE.href,
            external: true,
          },
          ' — worth a conversation before a templating mistake at scale turns into a manual action across an entire catalogue rather than one page.',
        ],
        [
          'If you would rather talk it through first, ',
          { text: 'book a meeting with the team', href: BOOK_MEETING, external: true },
          ' — no obligation, just a conversation about what your specific catalogue or content setup actually needs before you commit engineering time to it.',
        ],
      ],
    },
    {
      heading: 'Where to go next',
      body: [
        [
          'If schema markup is new territory, the ',
          {
            text: 'AI search visibility checklist',
            href: '/guides/ai-search-visibility-checklist',
          },
          ' guide covers the wider set of on-page basics AI crawlers check beyond just structured data — robots.txt rules, llms.txt, and the plain on-page signals that matter alongside JSON-LD.',
        ],
        [
          'For validating the JSON syntax of anything you hand-edit after generating it, keep the ',
          { text: 'JSON Formatter & Validator', href: '/dev/json-formatter' },
          ' bookmarked — it will catch a trailing comma or an unclosed brace before you ever paste broken markup into production. And once markup is live, run the page through the ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          ' too — a rich result that takes eight seconds to load loses most of the click-through advantage it was meant to earn in the first place.',
        ],
        [
          'Every one of the nine schema types covered here — Article, Organization, LocalBusiness, Product, Person, Event, WebSite, BreadcrumbList and HowTo — is free to generate, with no signup and no limit on how many times you use it. Start with whichever page type is missing schema right now, and work outward from there.',
        ],
      ],
    },
  ],
  relatedTools: [
    'schema-markup-generator',
    'faq-schema-generator',
    'json-formatter',
    'ai-visibility-checker',
    'website-speed-test',
  ],
  relatedPrompts: [
    'seo-geo-serp-intent-content-brief',
    'seo-geo-meta-title-description-ctr',
  ],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 14,
}
