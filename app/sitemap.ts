import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { TOOLS } from '@/lib/tools/registry'

/**
 * Generated entirely from the registry.
 *
 * `lastModified` comes from each tool's real `updatedAt` field and NEVER from
 * `new Date()`. A sitemap that claims every page changed today teaches Google to
 * ignore the signal completely — a common, entirely self-inflicted wound.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const newestTool = TOOLS.reduce(
    (latest, t) => (t.updatedAt > latest ? t.updatedAt : latest),
    TOOLS[0]?.updatedAt ?? '2026-07-28',
  )

  return [
    {
      url: absoluteUrl('/'),
      lastModified: newestTool,
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
  ]
}
