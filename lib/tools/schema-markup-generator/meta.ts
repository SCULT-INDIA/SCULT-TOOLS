import type { Tool } from '../types'

/**
 * Reference JSON-LD, not literal tool output — schema.org-correct examples
 * for the five types most sites need, matched to what this tool actually
 * supports (Article, Product, LocalBusiness, Event, BreadcrumbList — see
 * `SchemaTypeId` in lib/tools/schema-markup-generator/logic.ts). The
 * content handover's original draft listed FAQ as one of the four example
 * types; this tool has no FAQPage output at all (that's the separate FAQ
 * Schema Generator), so it's dropped here rather than shown incorrectly.
 */
const EXAMPLES_SUPPORT: Tool['supportContent'] = [
  {
    heading: 'Copy-paste JSON-LD examples',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'Below are valid, schema.org-correct examples for the types this generator covers. Copy one, swap in your own details, and paste the whole block inside a `<script type="application/ld+json">` tag — or skip the copy-paste entirely and build it from your own fields above.',
        ],
      },
      {
        type: 'code',
        snippets: [
          {
            label: 'Article',
            lang: 'json',
            code: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Add Schema Markup",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "datePublished": "2026-08-09",
  "image": "https://example.com/cover.jpg"
}`,
          },
          {
            label: 'Product',
            lang: 'json',
            code: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Wireless Headphones",
  "image": ["https://example.com/photo.jpg"],
  "description": "Noise-cancelling over-ear headphones.",
  "offers": {
    "@type": "Offer",
    "price": "4999",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  }
}`,
          },
          {
            label: 'LocalBusiness',
            lang: 'json',
            code: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Acme Studio",
  "telephone": "+91-98765-43210",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 MG Road",
    "addressLocality": "Bengaluru",
    "addressRegion": "KA",
    "postalCode": "560001",
    "addressCountry": "IN"
  }
}`,
          },
          {
            label: 'BreadcrumbList',
            lang: 'json',
            code: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog/" }
  ]
}`,
          },
        ],
      },
      {
        type: 'list',
        intro:
          'The errors Google flags most in the Rich Results Test — fix these before anything else:',
        items: [
          'Missing required field — a Product with no offers, or a Review with no author. Add the required property; this generator will not let you skip these for the types it covers.',
          'Invalid JSON syntax — a stray trailing comma or an unclosed brace. Generating the block instead of hand-typing it avoids this entirely.',
          'Wrong value type — a price written as "₹4,999" instead of "4999", or a date not in ISO format. Use plain numbers and YYYY-MM-DD dates.',
          "Schema that doesn't match visible content — marking up Q&A pairs, prices, or details that are not actually shown on the page. This is a Google policy issue, not just a warning.",
          'Wrong @type — using Organization where LocalBusiness fits better for local search. Pick the most specific type that actually describes the page.',
        ],
      },
    ],
  },
]

export const meta: Tool = {
  slug: 'schema-markup-generator',
  category: 'seo',
  title: 'Schema Markup Generator (JSON-LD)',
  h1: 'Schema Markup Generator',
  description:
    'Generate valid JSON-LD structured data for Article, Product, LocalBusiness, Event and five more types — with live output and warnings for missing Google-required properties.',
  tagline:
    'Fill a form, get paste-ready JSON-LD — with Google’s requirements checked as you type.',
  keywords: [
    'schema markup generator',
    'json-ld generator',
    'structured data generator',
    'schema generator free',
    'rich results markup',
  ],
  related: [
    'faq-schema-generator',
    'json-formatter',
    'website-speed-test',
    'ai-visibility-checker',
  ],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'B',
  // 'seo' 404s on scult.in — no generic page under that slug exists;
  // 'seo-companies-for-small-business' is the closest real service page.
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-07-29',
  owner: 'scult-seo',
  icon: 'FileCode2',
  runsInBrowser: true,
  howToUse: [
    'Pick a schema type — Article, Product, Local Business, Event and more.',
    'Fill in the fields; the JSON-LD script block updates on every keystroke.',
    'Fix anything the warnings panel flags as missing or malformed.',
    'Copy the script block and paste it inside your page’s <head>.',
    'Confirm eligibility with Google’s Rich Results Test.',
  ],
  howItWorks:
    'JSON-LD is the script-block format Google recommends over microdata. This tool builds it from a typed spec table so each schema type nests properties correctly (an Article author becomes a Person, a Product price sits inside an Offer), flagging fields Google rich results require, not just schema.org optional ones.',
  limitations: [
    'Valid markup makes a page eligible for a rich result — it does not guarantee Google shows one.',
    'Markup must match what users actually see on the page, or it risks a manual action.',
    'Covers the nine most-used types; niche types like Recipe or JobPosting have extra requirements.',
  ],
  faq: [
    {
      q: 'Does schema markup improve rankings?',
      a: 'Not directly — Google has said structured data is not a ranking factor. What it does is make pages eligible for rich results (stars, prices, FAQs, breadcrumbs), which typically lift click-through rate, and it helps machines disambiguate what the page is about.',
    },
    {
      q: 'Which schema types actually get rich results?',
      a: 'Only the types in Google’s search gallery: Article, Product, Event, LocalBusiness, Breadcrumb, HowTo and a couple of dozen others. Marking up anything else is still valid schema.org and can help machine understanding, but it will not change how the snippet looks.',
    },
    {
      q: 'Where do I paste the JSON-LD?',
      a: 'Anywhere in the page HTML — the <head> is conventional but Google reads it from the <body> too. Paste the whole <script type="application/ld+json"> block as-is; it must be on the page whose content it describes.',
    },
    {
      q: 'What is the difference between JSON-LD and microdata?',
      a: 'Microdata weaves attributes (itemscope, itemprop) into your existing HTML tags; JSON-LD is one self-contained script block. Both are read by Google, but JSON-LD is the format Google recommends because it is easier to add, template and maintain without breaking page markup.',
    },
    {
      q: 'Why did my rich result not appear even though the markup validates?',
      a: 'Valid markup only makes you eligible. Google also weighs page quality, whether the markup matches visible content, and per-query relevance — and new markup can take days or weeks to be recrawled. Check Search Console’s enhancement reports for the page’s actual status.',
    },
    {
      q: 'Can I put more than one schema type on the same page?',
      a: 'Yes. Multiple <script type="application/ld+json"> blocks on one page are fine — an article page commonly carries Article, BreadcrumbList and Organization markup side by side. Generate each one here and paste them as separate blocks.',
    },
    {
      q: 'Which schema types does this generator support?',
      a: 'Nine: Article, Organization, LocalBusiness, Product, Person, Event, WebSite, BreadcrumbList and HowTo — the types that cover the vast majority of real pages. Niche types like Recipe or JobPosting aren’t built in yet.',
    },
    {
      q: 'Is my data uploaded anywhere?',
      a: 'No — the JSON-LD is assembled entirely in your browser from what you type. Nothing is sent to a server, and nothing is saved once you leave the page.',
    },
  ],
  supportContent: EXAMPLES_SUPPORT,
}
