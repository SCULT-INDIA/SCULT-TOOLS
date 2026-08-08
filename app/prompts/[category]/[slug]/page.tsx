import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PromptDetailShell } from '@/components/prompts/PromptDetailShell'
import { getPromptCategory } from '@/lib/prompts/categories'
import { getPrompt, PROMPTS } from '@/lib/prompts/registry'
import { breadcrumbJsonLd, JsonLd, promptJsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'

type Params = { category: string; slug: string }

export function generateStaticParams(): Params[] {
  return PROMPTS.map((prompt) => ({ category: prompt.category, slug: prompt.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category, slug } = await params
  const prompt = getPrompt(slug)
  if (!prompt || prompt.category !== category) return {}

  const path = `/prompts/${prompt.category}/${prompt.slug}`
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
    },
    twitter: {
      card: 'summary_large_image',
      title: prompt.title,
      description: prompt.description,
    },
  }
}

export default async function PromptDetailPage({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, slug } = await params

  const prompt = getPrompt(slug)
  const category = getPromptCategory(categorySlug)

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
