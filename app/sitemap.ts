import type { MetadataRoute } from 'next'
import { PROMPT_CATEGORIES } from '@/lib/prompts/categories'
import { getPromptsByCategory, PROMPTS } from '@/lib/prompts/registry'
import type { Prompt } from '@/lib/prompts/types'
import { absoluteUrl } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { TOOLS } from '@/lib/tools/registry'

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
  ]
}
