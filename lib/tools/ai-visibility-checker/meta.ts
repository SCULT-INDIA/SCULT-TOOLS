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
  serviceTarget: 'ai-services',
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
    'GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) are about being usable as a source by AI answer engines, not just ranking in blue links. This checker fetches your robots.txt, /llms.txt and homepage exactly once, then evaluates the effective robots rule for the path "/" for ten AI crawlers: GPTBot, OAI-SearchBot and ChatGPT-User (OpenAI), ClaudeBot and anthropic-ai (Anthropic), PerplexityBot (Perplexity), Google-Extended (Google Gemini), CCBot (Common Crawl, whose dataset many models train on), Bytespider (ByteDance) and meta-externalagent (Meta). Robots precedence is applied the way crawlers actually apply it: the most specific matching User-agent group wins over the * group, an empty Disallow line allows everything, and between Allow and Disallow the longest matching path wins, with Allow winning exact ties. On top of crawler access we parse every JSON-LD block for schema types, check the on-page basics answer engines quote (title, meta description, h1, h2 outline, lang), and probe for llms.txt and an XML sitemap. The weighted score is crawler access 40, structured data 20, basics 20, llms.txt 10, sitemap 10. One honest caveat: crawlability is necessary but not sufficient — a perfect score means AI engines CAN read and parse you, not that they WILL cite you. Citation still depends on content quality, authority and relevance.',
  limitations: [
    'We cannot see inside AI companies’ private crawl and ranking policies. This tool verifies the public, controllable signals — what an engine does beyond them is not observable from outside.',
    'This is a homepage check, not a site-wide audit. Robots rules, schema and headings can differ per page; a clean homepage does not guarantee your blog or docs are equally crawlable.',
    'Allowing or blocking AI crawlers is a business decision about how your content may be used. This tool shows you the current state so you can decide deliberately — it does not make that call for you.',
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
