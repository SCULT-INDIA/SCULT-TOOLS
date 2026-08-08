import { GUIDES } from '@/lib/guides/registry'
import { getCategoriesByGroup, PROMPT_GROUPS } from '@/lib/prompts/categories'
import { getPromptsByCategory, PROMPTS } from '@/lib/prompts/registry'
import { absoluteUrl, SITE } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolsByCategory, TOOLS } from '@/lib/tools/registry'

/**
 * llms.txt / llms-full.txt builders — https://llmstxt.org
 *
 * Generated entirely from the same registries that drive the sitemap and the
 * footer, so neither file can drift into a stale hand-maintained list. Lives
 * here rather than inline in the two Route Handlers because a Next.js
 * `route.ts` may only export HTTP method handlers (plus a small allow-list of
 * config exports) — anything else fails the framework's route type check.
 *
 * `TRUST_PAGES` is the one hand-maintained list here, and deliberately so: it
 * mirrors the "Site" column `components/layout/Footer.tsx` already
 * hand-maintains for the same top-level, non-registry pages. Every title and
 * description is copied verbatim from that page's own `metadata` export, so
 * this file can never say something a visitor wouldn't also read on the page
 * itself.
 */
const TRUST_PAGES: readonly { path: string; title: string; description: string }[] = [
  {
    path: '/about',
    title: 'About',
    description:
      'Who builds Scult Tools and why they are free. Built by Scult, an AI-first digital agency in Noida, Delhi NCR — these are the utilities our own delivery team uses.',
  },
  {
    path: '/privacy',
    title: 'Privacy',
    description:
      'A plain-English table of exactly which Scult Tools send data over the network and which run entirely in your browser. No accounts, no file uploads, no dark patterns.',
  },
  {
    path: '/terms',
    title: 'Terms of Service',
    description:
      'The terms for using Scult Tools: no accounts, you own what you generate, tools are provided as-is, and calculators are aids — not legal, tax or financial advice.',
  },
  {
    path: '/faq',
    title: 'Frequently Asked Questions',
    description:
      'Straight answers about Scult Tools: whether it is really free, which tools run in your browser, how AI assistants may use this site, and where to send requests.',
  },
  {
    path: '/contact',
    title: 'Contact',
    description:
      'How to reach Scult Tools — report a bug or a wrong calculation, ask about client work, or find us on LinkedIn, Instagram and X.',
  },
  {
    path: '/security',
    title: 'Security',
    description:
      'What this site actually does for security: client-side tools that transmit nothing, SSRF-blocked server tools, the real response headers, and how to report a vulnerability.',
  },
  {
    path: '/accessibility',
    title: 'Accessibility',
    description:
      'What Scult Tools does for keyboard, screen-reader and low-vision users, the one audit we have not done yet, and how to report an accessibility issue.',
  },
  {
    path: '/changelog',
    title: 'Changelog',
    description:
      'What changed on Scult Tools and when — site-wide updates plus a per-tool last-updated list generated straight from the tool registry, not hand-typed.',
  },
  {
    path: '/roadmap',
    title: 'Roadmap',
    description:
      'What is live on Scult Tools today, the directions we are weighing next, and how we decide when a tool gets retired instead of left to rot.',
  },
  {
    path: '/brand',
    title: 'Brand & Press Kit',
    description:
      'Logos, boilerplate copy and company facts for Scult Tools, for press and partners who want to cite or link to the site correctly.',
  },
  {
    path: '/glossary',
    title: 'SEO, GEO & AEO Glossary',
    description:
      'Plain-English definitions of SEO, GEO and AEO terms — AI crawlers, robots.txt, llms.txt, structured data, Core Web Vitals — matched to how our own tools check each one.',
  },
  {
    path: '/collections',
    title: 'Tool Collections',
    description:
      'Curated bundles of Scult Tools grouped by what you are actually trying to do — GEO/AEO, SEO, freelance paperwork, developer utilities, and design and writing.',
  },
  {
    path: '/sitemap',
    title: 'Sitemap',
    description:
      'A human-readable directory of every page on this site, grouped by section.',
  },
]

interface LivePromptGroup {
  readonly name: string
  readonly categories: readonly {
    readonly name: string
    readonly url: string
    readonly blurb: string
    readonly count: number
  }[]
}

/** Live (non-empty) prompt categories grouped by their top-level group — the same filter Footer.tsx applies. */
function livePromptGroups(): readonly LivePromptGroup[] {
  return PROMPT_GROUPS.map((group) => ({
    name: group.name,
    categories: getCategoriesByGroup(group.slug)
      .map((category) => ({
        name: category.name,
        url: absoluteUrl(`/prompts/${category.slug}`),
        blurb: category.blurb,
        count: getPromptsByCategory(category.slug).length,
      }))
      .filter((category) => category.count > 0),
  })).filter((group) => group.categories.length > 0)
}

function buildHeader(): string[] {
  const clientSide = TOOLS.filter((t) => t.runsInBrowser).length
  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.tagline}`,
    '',
    `${SITE.description} ${clientSide} of ${TOOLS.length} tools run entirely in your browser. No signup on any of them. Full policy: ${absoluteUrl('/privacy')}`,
  ]
}

function buildPromptSection(): string[] {
  const lines = [
    '',
    '## Prompt Library',
    `- [Prompt Library](${absoluteUrl('/prompts')}): ${PROMPTS.length} free, dated and version-verified prompts for ChatGPT, Claude, Cursor, Midjourney and more.`,
  ]
  for (const group of livePromptGroups()) {
    lines.push('', `### ${group.name}`)
    for (const category of group.categories) {
      lines.push(
        `- [${category.name}](${category.url}): ${category.blurb} (${category.count} prompt${category.count === 1 ? '' : 's'})`,
      )
    }
  }
  return lines
}

function buildTrustSection(): string[] {
  const lines = ['', '## About this site']
  for (const page of TRUST_PAGES) {
    lines.push(`- [${page.title}](${absoluteUrl(page.path)}): ${page.description}`)
  }
  return lines
}

/** The concise index: one link plus one description per tool, guide and trust page. */
export function buildLlmsTxt(): string {
  const lines = [...buildHeader(), '', '## Tools']

  for (const category of CATEGORIES) {
    const tools = getToolsByCategory(category.slug)
    if (tools.length === 0) continue
    lines.push('', `### ${category.name}`)
    for (const tool of tools) {
      lines.push(
        `- [${tool.title}](${absoluteUrl(`/${tool.category}/${tool.slug}`)}): ${tool.description}`,
      )
    }
  }

  lines.push('', '## Guides')
  for (const guide of GUIDES) {
    lines.push(
      `- [${guide.title}](${absoluteUrl(`/guides/${guide.slug}`)}): ${guide.description}`,
    )
  }

  lines.push(...buildPromptSection())
  lines.push(...buildTrustSection())

  lines.push(
    '',
    '## Machine-readable',
    `- [XML sitemap](${absoluteUrl('/sitemap.xml')}): every URL on the site with a real last-modified date.`,
    `- [robots.txt](${absoluteUrl('/robots.txt')}): explicit allow rules for GPTBot, ClaudeBot, PerplexityBot and the rest of the AI crawler roster.`,
    `- [llms-full.txt](${absoluteUrl('/llms-full.txt')}): the same map, with full tool and guide detail inlined for a single-fetch context load.`,
  )

  return `${lines.join('\n')}\n`
}

/**
 * The fuller variant: full tool detail (tagline, how it works, limitations)
 * and complete guide bodies inlined, so an AI system can load real context in
 * one fetch instead of crawling every page. The prompt library section stays
 * link-level, deliberately — inlining all 200+ prompts would make this file
 * enormous for little benefit, since each prompt page is already a small,
 * templated record rather than long-form content worth pre-loading.
 */
export function buildLlmsFullTxt(): string {
  const lines = [...buildHeader(), '', '## Tools']

  for (const category of CATEGORIES) {
    const tools = getToolsByCategory(category.slug)
    if (tools.length === 0) continue
    lines.push('', `### ${category.name}`)
    for (const tool of tools) {
      lines.push(
        '',
        `#### ${tool.title}`,
        `URL: ${absoluteUrl(`/${tool.category}/${tool.slug}`)}`,
        tool.tagline,
        '',
        `How it works: ${tool.howItWorks}`,
        '',
        `Limitations: ${tool.limitations.join(' ')}`,
      )
    }
  }

  lines.push('', '## Guides')
  for (const guide of GUIDES) {
    lines.push(
      '',
      `### ${guide.title}`,
      `URL: ${absoluteUrl(`/guides/${guide.slug}`)}`,
      guide.dek,
    )
    for (const section of guide.sections) {
      lines.push('', `**${section.heading}**`, ...section.body)
    }
  }

  lines.push(...buildPromptSection())
  lines.push(...buildTrustSection())

  lines.push(
    '',
    '## Machine-readable',
    `- [XML sitemap](${absoluteUrl('/sitemap.xml')}): every URL on the site with a real last-modified date.`,
    `- [robots.txt](${absoluteUrl('/robots.txt')}): explicit allow rules for GPTBot, ClaudeBot, PerplexityBot and the rest of the AI crawler roster.`,
    `- [llms.txt](${absoluteUrl('/llms.txt')}): the same map, link-level only, for a lighter-weight fetch.`,
  )

  return `${lines.join('\n')}\n`
}
