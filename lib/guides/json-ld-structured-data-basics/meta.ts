import type { Guide } from '../types'

/**
 * Explains JSON-LD structured data at a level a non-developer marketer or
 * small-business owner can act on: what it is, the schema.org types worth
 * knowing, how to validate it, and the one visibility rule that gets FAQPage
 * markup penalized. Every claim here has to match what
 * `lib/tools/schema-markup-generator/meta.ts` and
 * `lib/tools/faq-schema-generator/meta.ts` say those two tools actually do —
 * this guide sends readers to them, not around them.
 */
export const meta: Guide = {
  slug: 'json-ld-structured-data-basics',
  title: 'JSON-LD Structured Data, Explained Simply',
  h1: 'What is JSON-LD structured data, and how does it work?',
  description:
    'A plain-English guide to JSON-LD: what it does, the schema.org types that matter, how to validate it, and the FAQPage visibility rule.',
  dek: 'JSON-LD is the script block that tells search engines and AI crawlers what a page actually is, without changing what a visitor sees. Here is what it covers, which schema types matter, and the one rule that gets FAQ markup penalized.',
  sections: [
    {
      heading: 'What JSON-LD actually is',
      body: [
        'JSON-LD is a small script block added to a page’s HTML. It describes the page in a structured, machine-readable way — this is an Article by this author, this is a Product at this price, this is an Organization with this name and logo — using vocabulary from schema.org. It sits alongside the visible HTML, not instead of it: a browser ignores it, but search engines and AI crawlers read it to work out what the page is actually about, rather than inferring it from headings and layout.',
        'Google recommends JSON-LD over the older microdata format because it is one self-contained <script type="application/ld+json"> tag rather than attributes woven through your existing markup. That makes it easier to generate, template and update without risking the page’s actual display.',
      ],
    },
    {
      heading: 'The schema types worth knowing',
      body: [
        'A handful of schema.org types cover most of what a small business site needs. Organization describes the company itself — name, URL, logo, contact details — and usually belongs on every page rather than just one. WebSite tells search engines the name and URL of the site as a whole, which is part of what can produce a sitelinks search box for a brand in results.',
        'Product describes a specific item for sale — price, availability, reviews — and is what can put a price or star rating under a search result. Article covers a blog post or news piece: headline, author, publish date. FAQPage marks up a list of questions and their answers as Q&A pairs a machine can read directly, rather than one block of prose.',
        'BreadcrumbList describes the click path to a page — Home, then a category, then the page itself — which is what can turn a URL in search results into a breadcrumb trail instead. LocalBusiness is Organization’s more specific sibling: it adds an address, opening hours and a phone number, and matters most for a business with a physical location or a defined service area.',
      ],
    },
    {
      heading: 'How to check it actually works',
      body: [
        'Two tools cover most of what validation requires. Google’s Rich Results Test checks whether a page’s markup is eligible for one of Google’s specific rich result types — useful for spotting a Product or Article block missing a property Google requires — though it dropped FAQPage support in June 2026 along with FAQ rich results generally. The generic schema.org validator checks markup against the schema.org vocabulary itself, so it is the one to reach for on FAQPage or anything else Google’s tool no longer covers, or simply to confirm the JSON parses and nests correctly.',
        'Passing either check only confirms eligibility, not that a rich result will appear. Google also weighs page quality, whether the markup matches what a visitor actually sees, and per-query relevance — and a rich result can take days or weeks to show up even on markup that validates cleanly. Structured data is not itself a ranking factor; it makes a page eligible for a better-looking result and helps machines disambiguate what the page covers.',
      ],
    },
    {
      heading: 'The rule that gets FAQPage schema penalized',
      body: [
        'One rule matters more than any other with FAQPage markup: the questions and answers in the JSON-LD have to appear on the page as real, visible text — the same words, not a paraphrase, and not hidden with no visible fallback. Schema with no matching on-page content violates Google’s guidelines, and that is treated as a manual-action risk, not a technicality to skip.',
        'This trips people up because it is easy to hand-write a tidy FAQPage block and forget to also put that exact copy on the page. If a page does not already show the FAQ text, the safer path is to generate the visible HTML and the schema together rather than the JSON-LD alone.',
      ],
    },
    {
      heading: 'A minimal example: Organization markup',
      body: [
        'A basic Organization block is short. Conceptually it holds three things: the company’s name as a plain string, a url pointing at the homepage, and a logo pointing at an image URL. Everything else — sameAs links to social profiles, a contactPoint, a full address — sits on top of that minimum; it is additive, not required to make the block valid.',
      ],
    },
    {
      heading: 'Generating it without hand-writing JSON',
      body: [
        'Hand-writing JSON-LD is where small syntax mistakes creep in — a missing comma, a string where a nested object belongs. The schema markup generator builds it from a typed spec table instead, covering nine schema types and flagging whatever Google’s rich results actually require as the fields are filled in.',
        'For questions and answers specifically, the FAQ schema generator does the same thing and also outputs the paste-ready visible HTML block, so the visibility rule above is satisfied by construction rather than by remembering to do it by hand.',
      ],
    },
  ],
  relatedTools: ['schema-markup-generator', 'faq-schema-generator'],
  updatedAt: '2026-08-09',
  readingMinutes: 5,
}
