import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'ai-visibility-checker',
  category: 'geo',
  title: 'AI Visibility Checker',
  h1: 'AI Visibility Checker',
  description:
    'Check whether ChatGPT, Claude, Perplexity and Google AI can crawl and understand your site. Free 0–100 visibility score with specific fixes — no email gate.',
  tagline: 'See your website the way AI search engines see it.',
  keywords: [
    'ai visibility checker',
    'aeo checker',
    'geo audit tool',
    'is my site blocked from chatgpt',
    'gptbot robots.txt checker',
    'llms.txt checker',
  ],
  related: [
    'schema-markup-generator',
    'faq-schema-generator',
    'website-speed-test',
    'word-counter',
  ],
  wave: 1,
  runtime: 'server',
  monthlyCostCeiling: 500,
  leadTier: 'A',
  // 'ai-services' 404s on scult.in — 'ai-consulting' is the real page.
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-07-29',
  owner: 'scult-ai',
  icon: 'Radar',
  runsInBrowser: false,
  howToUse: [
    'Paste your website URL and press Check.',
    'Read the 0–100 score and its verdict band at the top.',
    'Scan the per-bot table to see which AI crawlers can reach you.',
    'Work through each check card — every finding comes with a concrete fix.',
  ],
  howItWorks:
    'Fetches robots.txt, /llms.txt and your homepage once, then applies robots precedence for ten AI crawlers: most-specific User-agent group wins, longest matching path wins. Scored 40/20/20/10/10 across crawler access, structured data, page basics, llms.txt and sitemap — being readable is necessary, not sufficient, for citation.',
  limitations: [
    'This checks your homepage only, not every page on your site.',
    'It reports the public crawl signals it can see, not what an AI company does with your content afterward.',
  ],
  faq: [
    {
      q: 'Should I allow GPTBot to crawl my site?',
      a: 'If you want your content to be reachable by ChatGPT and future OpenAI models, yes. If you sell that content or object to it training models, blocking GPTBot is a reasonable choice — just know that OAI-SearchBot (ChatGPT search) is a separate bot, so you can allow search visibility while opting out of training.',
    },
    {
      q: 'What is llms.txt?',
      a: 'A proposed standard: a markdown file at /llms.txt that gives AI systems a curated map of your most important pages with short summaries. It is not universally consumed yet, but it costs ten minutes to publish and several AI tools already read it — an easy, low-risk win.',
    },
    {
      q: 'Does schema markup actually help AI answers?',
      a: 'Yes, indirectly but meaningfully. JSON-LD tells engines unambiguously what your page is — an organization, a product, an FAQ — instead of forcing them to infer it from prose. Grounded answer engines like Google AI Overviews lean on the same structured understanding classic search built.',
    },
    {
      q: 'Why is my score low but my Google traffic is fine?',
      a: 'Classic Googlebot and AI crawlers are different user-agents with different robots rules. Many sites (or their CDN/firewall defaults) block GPTBot, CCBot or PerplexityBot without ever touching Googlebot, so organic traffic stays healthy while AI engines cannot read the site at all.',
    },
    {
      q: 'Does blocking AI bots protect my content from AI completely?',
      a: 'No. robots.txt is a request that reputable crawlers honour, not an enforcement mechanism, and your content can still enter training data through third-party datasets, syndication or scraping. It is still worth setting deliberately — it is the standard, documented signal of your intent.',
    },
    {
      q: 'What does a score of 80+ actually mean?',
      a: 'That AI engines can fetch your homepage, parse structured data about it, and read the basic signals they quote in answers. It means you are eligible to be cited, not guaranteed to be — content quality and topical authority decide the rest.',
    },
  ],
}
