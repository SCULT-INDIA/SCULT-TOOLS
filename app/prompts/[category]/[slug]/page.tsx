import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PromptDetailShell } from '@/components/prompts/PromptDetailShell'
import { getPromptCategoryOrCustom } from '@/lib/prompts/category-resolver'
import { getDbPrompt } from '@/lib/prompts/db'
import { getPrompt, PROMPTS } from '@/lib/prompts/registry'
import type { Prompt } from '@/lib/prompts/types'
import { breadcrumbJsonLd, JsonLd, promptJsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'

type Params = { category: string; slug: string }

/** Compiled registry only — admin-published prompts (lib/prompts/db.ts)
 * are never in `generateStaticParams`'s output, the same reason
 * app/skills/[category]/[slug]/page.tsx's static set excludes the
 * on-demand tail of skills: they render on first request instead
 * (`dynamicParams` defaults true) and are cached from then on. */
export function generateStaticParams(): Params[] {
  return PROMPTS.map((prompt) => ({ category: prompt.category, slug: prompt.slug }))
}

/** Registry first, admin-published second — never both: a slug that exists
 * in the compiled registry can't also be an admin draft (createDraftPrompt
 * never checks the registry, but a duplicate is a content problem for the
 * admin to notice, not this route's job to resolve). */
async function resolvePrompt(
  category: string,
  slug: string,
): Promise<Prompt | undefined> {
  const compiled = getPrompt(slug)
  if (compiled && compiled.category === category) return compiled
  return getDbPrompt(category, slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category, slug } = await params
  const prompt = await resolvePrompt(category, slug)
  if (!prompt) return {}

  const path = `/prompts/${prompt.category}/${prompt.slug}`
  // Undefined, not a fallback graphic, when the prompt has no exampleImage —
  // this is a pure addition for the ~40 prompts that do; the other 1,170
  // keep whatever OG rendering they already had. These pages are built to be
  // shared straight into a WhatsApp group, where a card showing the actual
  // retro photo is worth far more than a generic site card.
  const ogImage = prompt.exampleImage
    ? [{ url: absoluteUrl(prompt.exampleImage.src), alt: prompt.exampleImage.alt }]
    : undefined
  return {
    title: `${prompt.title} — Free Prompt`,
    description: prompt.description,
    keywords: [...prompt.tags],
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: absoluteUrl(path),
      title: prompt.title,
      description: prompt.description,
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: prompt.title,
      description: prompt.description,
      images: ogImage,
    },
  }
}

export default async function PromptDetailPage({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, slug } = await params

  const prompt = await resolvePrompt(categorySlug, slug)
  const category = await getPromptCategoryOrCustom(categorySlug)

  // Guard the cross-product, same reason app/[category]/[slug]/page.tsx
  // does: a prompt served under the wrong category is a duplicate-URL bug,
  // not a graceful fallback.
  if (!prompt || !category || prompt.category !== categorySlug) notFound()

  return (
    <>
      <JsonLd data={promptJsonLd(prompt, category)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Prompts', path: '/prompts' },
          { name: category.name, path: `/prompts/${category.slug}` },
          { name: prompt.title, path: `/prompts/${prompt.category}/${prompt.slug}` },
        ])}
      />

      <PromptDetailShell prompt={prompt} category={category} />
    </>
  )
}
