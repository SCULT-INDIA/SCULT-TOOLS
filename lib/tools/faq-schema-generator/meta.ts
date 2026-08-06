import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'faq-schema-generator',
  category: 'seo',
  title: 'FAQ Schema Generator',
  h1: 'FAQ Schema Generator',
  description:
    'Turn your questions and answers into valid FAQPage JSON-LD, plus a paste-ready visible HTML block. Flags duplicates, empty answers and text Google would truncate.',
  tagline: 'Q&A in, valid FAQPage JSON-LD out — with the visible HTML Google requires.',
  keywords: [
    'faq schema generator',
    'faq page schema generator',
    'faqpage json-ld generator',
    'faq structured data generator',
    'generate faq schema markup',
  ],
  related: [
    'schema-markup-generator',
    'json-formatter',
    'word-counter',
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
  icon: 'MessageCircleQuestion',
  runsInBrowser: true,
  howToUse: [
    'Type each question and its answer — add, remove or reorder rows as you go.',
    'Fix anything the checker flags: duplicates, missing answers, over-long text.',
    'Copy the JSON-LD, or switch to HTML + schema for a paste-ready visible block.',
    'Paste it into your page and confirm it with the schema.org validator — Google’s Rich Results Test dropped FAQPage support in June 2026.',
  ],
  howItWorks:
    'Your pairs become a schema.org FAQPage: a mainEntity array of Question objects whose acceptedAnswer holds the Answer text — the shape Google’s structured-data docs specify. Every "<" is serialised as \\u003c, so embedded HTML can’t break out of the <script type="application/ld+json"> tag. Google retired FAQ rich results on 7 May 2026, but AI answer engines still parse this markup, and the HTML output satisfies the on-page-visibility requirement schema.org checks require.',
  limitations: [
    'FAQ rich results were retired by Google on 7 May 2026, so this markup won’t produce an expandable Q&A in search — it’s worth adding for AI answer engines and schema clarity instead.',
    'The marked-up questions and answers must also be visible as real text on the page; schema with no matching on-page content violates Google’s guidelines.',
    'The ~1,200-character answer limit the tool flags is a holdover from the retired rich result, kept as a discipline for concise, quotable answers rather than an enforced rule.',
  ],
  faq: [
    {
      q: 'What is FAQPage schema?',
      a: 'It is schema.org structured data that labels the questions and answers on a page in a machine-readable JSON-LD block, so search engines and AI assistants can read each Q&A pair directly instead of inferring it from your layout.',
    },
    {
      q: 'Do FAQ rich results still show in Google?',
      a: 'Rarely. In August 2023 Google restricted FAQ rich results to well-known, authoritative websites — in practice mostly government and health sites. For everyone else the expandable Q&A under the snippet is effectively gone.',
    },
    {
      q: 'Is FAQ schema still worth adding, then?',
      a: 'Yes, for a different reader: AI search engines and answer engines parse structured data when deciding what your page says and whether to cite it. Clean FAQPage markup is a low-effort way to make your answers unambiguous to them.',
    },
    {
      q: 'Does the FAQ content have to be visible on my page?',
      a: 'Yes. Google’s guidelines require the marked-up questions and answers to appear on the page the user lands on. Use the HTML + schema output if your page does not already show the FAQ text.',
    },
    {
      q: 'Where do I paste the JSON-LD?',
      a: 'Inside a <script type="application/ld+json"> tag anywhere in the page’s head or body — Google reads it from either. The HTML + schema output already includes the tag, so that version is paste-and-done.',
    },
    {
      q: 'Can I use HTML inside the answers?',
      a: 'Google allows a small whitelist in Answer text (links, lists, bold, paragraphs), but anything beyond plain text is ignored in rich results. Keep answers as plain prose and put rich formatting in the visible HTML instead.',
    },
  ],
}
