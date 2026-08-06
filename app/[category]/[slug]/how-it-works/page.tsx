import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HowItWorksShell } from '@/components/tools/HowItWorksShell'
import { breadcrumbJsonLd, faqJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { getCategory } from '@/lib/tools/categories'
import { getTool, TOOLS } from '@/lib/tools/registry'

/**
 * The keyword-targeted companion to the canonical tool page:
 * /[category]/[slug]/how-it-works.
 *
 * Exists because the tool page itself was deliberately stripped down to just
 * the tool (per the user's explicit request — see ToolShell's docblock) —
 * "the tool is the page" is right for someone who already knows what they
 * want, but leaves nothing on that URL for the "how does an invoice
 * generator actually calculate GST" query someone else is typing. This
 * route is that answer, one click from the tool rather than competing with
 * it for the same page.
 */

type Params = { category: string; slug: string }

export function generateStaticParams(): Params[] {
  return TOOLS.map((tool) => ({ category: tool.category, slug: tool.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category, slug } = await params
  const tool = getTool(slug)
  if (!tool || tool.category !== category) return {}

  const path = `/${tool.category}/${tool.slug}/how-it-works`
  const title = `How the ${tool.title} Works — ${tool.keywords[0] ?? tool.title}`
  const description = `${tool.howItWorks} ${tool.description}`.slice(0, 300)

  return {
    title,
    description,
    keywords: [...tool.keywords, `how ${tool.title.toLowerCase()} works`],
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: absoluteUrl(path),
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function HowItWorksPage({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, slug } = await params

  const tool = getTool(slug)
  const category = getCategory(categorySlug)
  if (!tool || !category || tool.category !== categorySlug) notFound()

  const faq = faqJsonLd(tool)

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: category.name, path: `/${category.slug}` },
          { name: tool.title, path: `/${tool.category}/${tool.slug}` },
          { name: 'How it works', path: `/${tool.category}/${tool.slug}/how-it-works` },
        ])}
      />
      {faq ? <JsonLd data={faq} /> : null}

      <HowItWorksShell tool={tool} />
    </>
  )
}
