import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'faq-schema-generator-guide'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every claim checked against lib/tools/faq-schema-generator/meta.ts — most
 * importantly, Google retired FAQ rich results entirely on 7 May 2026 (not
 * the older, softer "2023, authoritative sites only" story some outdated
 * guides still repeat). This post is written to that more current fact.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'FAQ Schema (FAQPage JSON-LD) in 2026: What Actually Still Works',
  h1: 'Is FAQ schema still worth adding in 2026? Here is what actually changed',
  targetKeyword: 'faq schema generator',
  description:
    'Google retired FAQ rich results on 7 May 2026 — so is FAQPage JSON-LD still worth adding? A straight answer, plus a free generator and the exact rules that still matter.',
  dek: 'Most FAQ schema guides still online are describing a search feature that no longer exists. Here is what actually happened, why the markup is still worth adding for a different reason entirely, and the exact rules that avoid a policy violation instead of a Google penalty.',
  sections: [
    {
      heading: "The feature is gone — here's the actual timeline",
      body: [
        [
          'FAQ rich results — the expandable question-and-answer dropdown that used to appear directly under a search snippet — went through two changes, and most content online only reflects the first one. In August 2023, Google restricted the feature to a narrow set of well-known, authoritative sites, mostly government and health domains, cutting off the vast majority of small business and content sites overnight. That was change one, and it is the version most "is FAQ schema worth it" articles are still written against.',
        ],
        [
          'Change two is more recent and more total: Google retired FAQ rich results entirely on 7 May 2026. Nobody gets the expandable dropdown now, authoritative or not. If you are reading a guide — including older versions of guides on this exact topic — that says "FAQ schema mostly works for well-known sites," that guide is describing a feature that stopped existing for everyone months ago.',
        ],
        [
          'So the honest, current-as-of-2026 answer to "will FAQPage schema get me a rich result in Google Search" is no — not for anyone, not for any site. That single fact reframes every decision below, so it is worth stating plainly before getting into schema syntax.',
        ],
      ],
    },
    {
      heading: 'So why does the FAQ Schema Generator still exist?',
      body: [
        [
          'Because the rich result was never the only reader. FAQPage JSON-LD is a machine-readable statement of "here are the exact questions this page answers, and here is the exact answer to each one" — and AI answer engines (ChatGPT, Perplexity, Google\'s own AI Overviews) parse that structure when deciding what a page says and whether it is safe to quote. Losing the visual rich result in classic search does not remove that second audience; if anything, it makes the schema more purely aimed at it.',
        ],
        [
          'The ',
          { text: 'FAQ Schema Generator', href: '/seo/faq-schema-generator' },
          " turns a list of question-and-answer pairs into valid schema.org FAQPage JSON-LD — a mainEntity array of Question objects, each with a nested Answer inside acceptedAnswer, the exact shape Google's structured-data documentation still specifies even after retiring the rich result built on top of it. It also flags duplicate questions, empty answers, and text over roughly 1,200 characters — a discipline held over from the old rich-result length limit, kept now simply because a concise, quotable answer is a better answer regardless of what renders it.",
        ],
        [
          'There is a second output worth knowing about: HTML + schema, not just the raw JSON-LD. That matters because of the rule in the next section.',
        ],
      ],
    },
    {
      heading: 'The rule that actually carries risk: visible content must match',
      body: [
        [
          'Here is the part of FAQ schema that was never about rankings at all, and still is not: the questions and answers in your schema must also appear as real, visible text on the page a user actually lands on. Marking up Q&A pairs that do not exist anywhere in your rendered content is a Google policy violation, not a soft warning — the same category of issue as marking up a price or a rating nobody can see. This has nothing to do with the rich-result retirement; it applied before 7 May 2026 and it applies after.',
        ],
        [
          'This is exactly why the generator\'s "HTML + schema" output exists as a separate mode from plain JSON-LD: it gives you a paste-ready visible block — the same questions and answers, rendered as real page content — alongside the script tag, so the two can never quietly drift apart. If your page already has a visible FAQ section written some other way, you only need the JSON-LD half; if it does not, generating both from the same source of truth is the safer default.',
        ],
        [
          'A small, related but separate escape hatch: Google allows a narrow whitelist of formatting inside Answer text — links, lists, bold, paragraph breaks — but anything beyond that whitelist is ignored wherever the markup is read. Keep the schema-side answer as plain prose and put any real formatting in the visible HTML instead, so nothing depends on a formatting feature that may or may not be honoured downstream.',
        ],
      ],
    },
    {
      heading: 'Worked example: building an FAQ block that still earns its keep',
      body: [
        [
          "Say you're adding a five-question FAQ to a product page. Open the ",
          { text: 'FAQ Schema Generator', href: '/seo/faq-schema-generator' },
          ', type each question and its answer as a row, and add, remove or reorder rows freely — there is no hard cap. The checker flags anything worth fixing before you ship: two questions that are near-duplicates of each other, a row with an empty answer, or an answer running past the ~1,200-character discipline the tool still enforces even though the length limit it was originally built around no longer determines a rich result.',
        ],
        [
          'Once the list is clean, choose the output that matches your page: plain JSON-LD if you already have a visible FAQ section elsewhere, or HTML + schema if you need both the visible block and the markup generated together. Paste the result into your page and validate it with a ',
          { text: 'schema.org validator', href: '/dev/json-formatter' },
          ' — not the Rich Results Test, which dropped FAQPage support along with the feature itself in 2026, so it will no longer confirm this markup one way or the other.',
        ],
        [
          'If you are writing the FAQ content itself with AI assistance, feeding it a real content brief first — something like ',
          {
            text: 'a SERP-anchored content brief prompt',
            href: '/prompts/seo-geo/seo-geo-serp-intent-content-brief',
          },
          ' — keeps the questions aimed at what people actually search rather than a generic "common questions" list invented from nothing.',
        ],
      ],
    },
    {
      heading: 'FAQ schema and the GEO angle: the actual reason to keep doing this',
      body: [
        [
          'Structured data is one of five weighted checks the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' scores automatically, worth 20 of 100 points — though that specific check is looking for identity-level schema (Organization, WebSite, LocalBusiness or Person) on your homepage, not FAQPage on an individual page. The two are complementary, not the same thing: identity schema tells an AI system what your site is; FAQPage schema tells it precisely what one page answers. A site with strong FAQ markup across its content but no homepage identity block is still missing the check that tool scores — worth checking both, not assuming one covers the other.',
        ],
        [
          'The practical reframe for 2026: stop thinking of FAQ schema as an SEO rich-result tactic, because that tactic is retired for everyone. Think of it as a small, low-effort investment in being quotable by an AI answer engine — the same instinct behind writing a clear, direct answer in the first place, just made machine-readable. If your content already answers questions clearly, the schema costs a few minutes and loses nothing by being added; if it does not, the schema will not fix an unclear answer underneath it.',
        ],
      ],
    },
    {
      heading: 'When FAQ schema is not the tool for the job',
      body: [
        [
          'A generator like this handles the mechanical part — valid JSON-LD, no duplicate questions, no orphaned schema without matching visible text. It cannot decide your content strategy for you. If the real problem is that your FAQ section does not answer what people are actually searching for, or your site has dozens of thin FAQ pages competing with each other for the same handful of queries, that is a content architecture problem — the kind of decision that benefits from a second set of eyes rather than another schema tweak.',
        ],
        [
          'This is exactly the layer where ',
          { text: "Scult's SEO work", href: SERVICE.href, external: true },
          " picks up from where a free tool stops: deciding which pages deserve their own dedicated FAQ content versus which should be consolidated, auditing existing markup for the visible-content mismatch risk covered above at scale, and tying schema decisions to actual keyword research instead of a hunch. Worth a conversation if that's the stage you're at.",
        ],
        [
          'Prefer to just talk it through first? ',
          { text: 'Book a meeting with the team', href: BOOK_MEETING, external: true },
          ' — no obligation, just a conversation about your specific FAQ content and whether it needs restructuring before it needs more schema.',
        ],
      ],
    },
    {
      heading: 'Where to go next',
      body: [
        [
          'Pair this generator with the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ' for the other structured-data types your pages likely need — Article, Product, LocalBusiness and six more — since a real page commonly carries FAQPage alongside one or two of those, as separate script blocks rather than one merged object.',
        ],
        [
          'Before pasting any hand-edited JSON-LD into production, run it through the ',
          { text: 'JSON Formatter & Validator', href: '/dev/json-formatter' },
          ' — a stray trailing comma is the single most common way valid-looking structured data turns out to be broken. And if your FAQ answers are running long, the ',
          { text: 'Word Counter', href: '/productivity/word-counter' },
          ' will tell you exactly how close you are to the ~1,200-character discipline this tool still flags.',
        ],
        [
          'The generator itself stays free with no signup and no limit on how many question-and-answer pairs you build, whichever output format your page actually needs.',
        ],
      ],
    },
  ],
  relatedTools: [
    'faq-schema-generator',
    'schema-markup-generator',
    'json-formatter',
    'word-counter',
    'ai-visibility-checker',
  ],
  relatedPrompts: ['seo-geo-serp-intent-content-brief'],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 13,
}
