import type { Tool } from '../types'

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
  serviceTarget: 'seo',
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
    'JSON-LD is a <script> block of linked data that describes the page to crawlers without touching the visible HTML — it is the format Google explicitly recommends over microdata. This tool builds that object from a typed spec table: each schema type lists its properties with the correct nesting (an Article’s author becomes a Person entity, a Product’s price sits inside an Offer), and values are serialized with JSON.stringify, so quoting and escaping are always correct by construction. The required flags mirror Google’s rich-result documentation rather than schema.org — schema.org marks almost everything optional, but Google will not show a Product snippet without an offer or an Article card without an image, and that gap is exactly what the warnings panel checks, alongside URL absoluteness and ISO 8601 date formats. Empty optional fields are dropped from the output entirely, because "datePublished": "" is not a missing value to a validator, it is an invalid empty one.',
  limitations: [
    'Generating markup does not guarantee a rich result. Markup makes a page eligible; whether Google shows the treatment is decided per query, per site, and can change.',
    'Structured data must describe content actually visible on the page. Markup that disagrees with what users see violates Google’s guidelines and can earn a manual action.',
    'Covers the nine most-used types. Niche types (Recipe, JobPosting, VideoObject, Dataset) have extra requirements — check Google’s structured data docs for those.',
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
  ],
}
