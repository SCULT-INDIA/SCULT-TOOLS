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
  serviceTarget: 'seo',
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
    'Your pairs become a schema.org FAQPage: a mainEntity array where each entry is a Question whose acceptedAnswer is an Answer with a text property — the exact shape Google’s structured-data documentation specifies. The JSON is serialised with every "<" escaped as a \\u003c unicode sequence, which parses back to the same string but can never form a closing script tag, so an answer containing HTML cannot break out of the <script type="application/ld+json"> element you paste it into. The HTML output exists because Google’s guidelines require the marked-up Q&A to be visible on the page — schema with no matching on-page content is a guideline violation, so the tool emits a semantic details/summary block alongside the script tag. Be clear about what the markup buys you today: FAQ rich results are gone. Google restricted them to well-known authoritative sites in August 2023 and then retired them entirely on 7 May 2026 — the expandable Q&A under a snippet no longer appears for anyone, and Google cited markup abuse as the reason. Rich Results Test support for FAQPage was removed in June 2026 and the Search Console API followed in August, so validate against the schema.org validator instead. FAQPage itself remains a valid schema.org type and is safe to keep on your pages. The reason to ship it now is a different reader: AI search engines and answer engines parse structured data regardless of rich-result eligibility, so clean FAQPage markup makes your answers unambiguous to the systems that are still reading them. If you added FAQ schema purely for the rich result, it is no longer doing that job.',
  limitations: [
    'FAQ rich results no longer exist. Google retired them on 7 May 2026 for all sites, so this markup will not produce an expandable Q&A under your snippet. It is worth shipping for AI answer engines and for schema clarity, not for a rich result.',
    'The marked-up questions and answers must be visible on the page. Schema that has no matching on-page content violates Google’s structured-data guidelines and can attract a manual action.',
    'The roughly 1,200-character answer limit the tool warns about came from the retired rich result. It is kept as a discipline rather than a requirement: a concise answer is easier for an answer engine to quote, and nothing enforces it now.',
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
