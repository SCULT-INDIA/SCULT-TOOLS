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
    'Check the same domain again later and the score panel shows how many points moved since your last check on this browser, with no account or server storage involved.',
  ],
  howItWorks:
    'Fetches robots.txt, /llms.txt and your homepage once, then applies robots precedence for ten AI crawlers: most-specific User-agent group wins, longest matching path wins. Scored 40/20/20/10/10 across crawler access, structured data (including whether it names an Organization/WebSite/LocalBusiness/Person), page basics (title, description, headings, lang, Open Graph tags, canonical link, image alt-text coverage and a thin-content check), llms.txt and sitemap — being readable is necessary, not sufficient, for citation. A separate, unscored check flags a noindex or nofollow homepage, since that alone can make every other signal moot.',
  limitations: [
    'This checks your homepage only, not every page on your site.',
    'It reports the public crawl signals it can see, not what an AI company does with your content afterward.',
    'It reads the HTML your server sends, not the DOM after JavaScript runs — a single-page app that injects its title, meta description or schema client-side will score lower here than a real visitor would experience.',
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
      q: 'What does a score of 80+ actually mean?',
      a: 'That AI engines can fetch your homepage, parse structured data about it, and read the basic signals they quote in answers. It means you are eligible to be cited, not guaranteed to be — content quality and topical authority decide the rest.',
    },
    {
      q: 'I put "Disallow: /" under "User-agent: GPTBot" but left "User-agent: *" wide open — is GPTBot still blocked?',
      a: 'Yes, and this is the most common robots.txt mistake this tool exists to catch. A group naming a bot specifically always wins over the wildcard group, no matter which one looks more permissive or which one appears first in the file — so a targeted Disallow overrides a generous wildcard Allow every time. It cuts the other way too: an "Allow: /" under a bot-specific group does nothing to override a blanket "Disallow: /" sitting under a different group; it only helps the bot it names. Every card in the report states which group decided, so you can check this against your own file.',
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
      q: 'What is the difference between the noai signal and blocking a crawler in robots.txt?',
      a: 'robots.txt is a fetch-level gate, checked before a crawler requests the page at all. noai (and noimageai) is a page-level request sent inside the meta robots tag or the X-Robots-Tag header, asking a crawler that has already fetched the page not to use its content for AI training. Neither is enforced by anything on your server — both depend on the crawler operator choosing to honour them. This checker reports noai but does not score it, because opting out is a business decision, not a defect. A noindex or nofollow signal in that same tag is reported separately and much more severely, since it can suppress a page from AI answers entirely regardless of every other check.',
    },
    {
      q: 'Can this tool check more than my homepage?',
      a: 'Not right now — every check runs against your homepage only. A full-site crawl is a heavier, different product (a queue, not a single request), and one homepage is the honest scope for a free tool that runs synchronously with no email gate.',
    },
  ],
}
