import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'web-development-service-guide'
const SERVICE = resolveServiceLink('web-development', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'service',
  title: 'When to Build Your Own Website vs. Hiring a Web Development Team',
  h1: "Free tools cover a lot. Here's exactly where they stop.",
  targetKeyword: 'web development company',
  description:
    'Free tools handle speed testing, favicons and structured data yourself. A real website build is a different scope — here is exactly where the line sits, and what a web development team actually does.',
  dek: 'This site gives away real, working tools for a reason — most of what a website needs is genuinely solvable without hiring anyone. This post is about the honest exception: the point where a template or a free tool stops being enough.',
  sections: [
    {
      heading: 'What you can genuinely do yourself, free, right now',
      body: [
        [
          'A surprising amount of what a "good website" needs is covered by free tools, and it is worth being honest about that before pitching anything bigger. Run a page through the ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          ' to find real Core Web Vitals problems, generate correct ',
          { text: 'schema markup', href: '/seo/schema-markup-generator' },
          ' for rich results, check whether AI crawlers can even read your site with the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ', and generate a complete ',
          { text: 'favicon set', href: '/dev/favicon-generator' },
          ' — all genuinely free, all genuinely functional. None of that requires a development team.',
        ],
      ],
    },
    {
      heading: 'Where a template or DIY builder genuinely runs out of road',
      body: [
        [
          "A website builder or a template handles a standard brochure site, a simple blog, or a basic landing page well. It starts running out of road the moment the site needs something genuinely custom: a real data model behind the content (not just pages, but structured records — products, listings, bookings), integration with an external system (a CRM, a payment processor, an internal tool), or performance at a scale a template's generic code was never built to handle.",
        ],
        [
          "The signal worth watching for: if you find yourself fighting a template's limitations more than building forward — hacking around what it can't do rather than shipping what you actually need — that fight is the cost of staying DIY, and at some point it exceeds the cost of building it properly.",
        ],
      ],
    },
    {
      heading: 'What a real web development engagement actually covers',
      body: [
        [
          'A proper web development build covers architecture decisions a template makes for you (and sometimes makes badly): how content is structured and where it lives, how the site scales as traffic or content volume grows, how it integrates with everything else the business runs — email, payments, analytics, a CRM. It also covers the unglamorous but critical parts: security, backups, a real deployment process, and genuine performance engineering rather than a plugin promising speed it cannot actually deliver.',
        ],
        [
          'This is exactly what ',
          { text: "Scult's web development team", href: SERVICE.href, external: true },
          ' builds — sites and web applications architected for what a business actually needs, not a generic template stretched past its intended use.',
        ],
      ],
    },
    {
      heading: 'A real diagnostic before deciding',
      body: [
        [
          "Before assuming you need a full rebuild, run the honest diagnostic: test your current site's speed, check its AI crawlability, and confirm its structured data is correct. If those come back clean and the site still does what the business needs, a rebuild is premature — the free tools above answer that question directly rather than assuming the worst.",
        ],
        [
          'If the diagnostics come back genuinely poor, or the business need has outgrown what the current site\'s architecture can support at all, that is the actual signal worth acting on — not a vague sense that the site "looks dated."',
        ],
      ],
    },
    {
      heading: 'A worked example: outgrowing a template',
      body: [
        [
          'A small business starts on a template site, and it works fine until the business needs something the template genuinely cannot do — a real booking system with availability logic, a product catalogue that needs to sync with inventory, a member area with actual access control. At that point, patching the template with more plugins usually makes things slower and more fragile, not better — the same problem the ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          ' tends to surface directly: a page loaded down with a dozen plugins each doing a small job, collectively adding up to a genuinely slow site.',
        ],
      ],
    },
    {
      heading: 'Talking it through before committing to either path',
      body: [
        [
          'The honest answer to "do I need a developer" depends entirely on your specific situation — sometimes the free tools genuinely are enough, and telling you that costs us nothing. ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " and bring your actual site; we'll give you a straight answer rather than a pitch either way.",
        ],
      ],
    },
  ],
  relatedTools: [
    'website-speed-test',
    'schema-markup-generator',
    'ai-visibility-checker',
    'favicon-generator',
  ],
  relatedPrompts: [],
  serviceTarget: 'web-development',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
