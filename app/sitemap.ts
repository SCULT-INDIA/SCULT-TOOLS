import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog/registry'
import { GUIDES } from '@/lib/guides/registry'
import { PROMPT_CATEGORIES } from '@/lib/prompts/categories'
import { getPromptsByCategory, PROMPTS } from '@/lib/prompts/registry'
import type { Prompt } from '@/lib/prompts/types'
import { absoluteUrl } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { TOOLS } from '@/lib/tools/registry'

/**
 * Static trust/reference pages the registries don't drive. `lastModified` for
 * `/about` and `/privacy` is their real last-commit date (`git log`), not a
 * guess — the 2026-08-09 build-out pages get the literal date they were
 * actually written, for the same reason: never `new Date()`.
 */
const STATIC_PAGES: readonly {
  path: string
  lastModified: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}[] = [
  {
    path: '/about',
    lastModified: '2026-08-08',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    path: '/privacy',
    lastModified: '2026-08-08',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  { path: '/faq', lastModified: '2026-08-09', changeFrequency: 'monthly', priority: 0.6 },
  {
    path: '/pricing',
    lastModified: '2026-08-14',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    path: '/glossary',
    lastModified: '2026-08-09',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    path: '/collections',
    lastModified: '2026-08-09',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    path: '/guides',
    lastModified: '2026-08-09',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    path: '/blog',
    lastModified: '2026-08-15',
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    path: '/changelog',
    lastModified: '2026-08-09',
    changeFrequency: 'weekly',
    priority: 0.5,
  },
  {
    path: '/sitemap',
    lastModified: '2026-08-09',
    changeFrequency: 'weekly',
    priority: 0.4,
  },
  {
    path: '/roadmap',
    lastModified: '2026-08-09',
    changeFrequency: 'monthly',
    priority: 0.3,
  },
  {
    path: '/brand',
    lastModified: '2026-08-09',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    path: '/contact',
    lastModified: '2026-08-09',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    path: '/security',
    lastModified: '2026-08-09',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    path: '/compliance',
    lastModified: '2026-08-16',
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    path: '/accessibility',
    lastModified: '2026-08-09',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    path: '/terms',
    lastModified: '2026-08-09',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
]

/**
 * Generated entirely from the two registries.
 *
 * `lastModified` comes from each entry's real dates and NEVER from
 * `new Date()`. A sitemap that claims every page changed today teaches Google to
 * ignore the signal completely — a common, entirely self-inflicted wound.
 * Tools carry an explicit `updatedAt`; prompts derive the same thing from
 * their changelog and verification stamps (see `promptLastModified`).
 */

/** Latest of a set of ISO `YYYY-MM-DD` dates — lexical order is date order. */
function newest(dates: readonly string[], fallback: string): string {
  return dates.reduce((latest, date) => (date > latest ? date : latest), fallback)
}

/**
 * The prompt-side equivalent of a tool's `updatedAt`: the newest date the
 * prompt was actually changed or re-verified. Both arrays are required by
 * the Prompt contract, so the fallback is belt-and-braces only.
 */
function promptLastModified(prompt: Prompt): string {
  return newest(
    [
      ...prompt.changelog.map((entry) => entry.date),
      ...prompt.verifiedAgainst.map((entry) => entry.date),
    ],
    '2026-07-25',
  )
}

export default function sitemap(): MetadataRoute.Sitemap {
  const newestTool = TOOLS.reduce(
    (latest, t) => (t.updatedAt > latest ? t.updatedAt : latest),
    TOOLS[0]?.updatedAt ?? '2026-07-28',
  )
  const newestPrompt = newest(PROMPTS.map(promptLastModified), '2026-07-25')

  // Only categories whose content wave has landed — empty ones 404 by design
  // (see app/prompts/[category]/page.tsx's generateStaticParams).
  const livePromptCategories = PROMPT_CATEGORIES.filter(
    (c) => getPromptsByCategory(c.slug).length > 0,
  )

  return [
    {
      url: absoluteUrl('/'),
      // The homepage surfaces both catalogues, so it moves when either does.
      lastModified: newestTool > newestPrompt ? newestTool : newestPrompt,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/all'),
      lastModified: newestTool,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...CATEGORIES.map((c) => ({
      url: absoluteUrl(`/${c.slug}`),
      lastModified: newestTool,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...TOOLS.map((t) => ({
      url: absoluteUrl(`/${t.category}/${t.slug}`),
      lastModified: t.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...TOOLS.map((t) => ({
      url: absoluteUrl(`/${t.category}/${t.slug}/how-it-works`),
      lastModified: t.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: absoluteUrl('/prompts'),
      lastModified: newestPrompt,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...livePromptCategories.map((c) => ({
      url: absoluteUrl(`/prompts/${c.slug}`),
      lastModified: newest(
        getPromptsByCategory(c.slug).map(promptLastModified),
        '2026-07-25',
      ),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...PROMPTS.map((p) => ({
      url: absoluteUrl(`/prompts/${p.category}/${p.slug}`),
      lastModified: promptLastModified(p),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...STATIC_PAGES.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...GUIDES.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: guide.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
