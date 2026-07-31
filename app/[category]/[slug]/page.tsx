import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolComponent } from '@/components/tools'
import { ToolShell } from '@/components/tools/ToolShell'
import { breadcrumbJsonLd, faqJsonLd, JsonLd, toolJsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { getCategory } from '@/lib/tools/categories'
import { getTool, TOOLS } from '@/lib/tools/registry'

/**
 * The canonical tool page: /[category]/[slug].
 *
 * Note there is no `/tools/` prefix — the subdomain already says "tools", so the
 * extra segment would spend crawl depth on every page for no benefit. See
 * docs/PLAN.md §6.5.
 *
 * Fully statically generated from the registry: `generateStaticParams` enumerates
 * every tool, so each page is a CDN file with no compute per request.
 */

type Params = { category: string; slug: string }

export function generateStaticParams(): Params[] {
  return TOOLS.map((tool) => ({ category: tool.category, slug: tool.slug }))
}

/**
 * No `dynamicParams = false` here: that segment config is incompatible with
 * `cacheComponents` and Next rejects it at build time.
 *
 * It is also unnecessary. Any path not produced by generateStaticParams fails the
 * registry lookup below and calls `notFound()`, including the category/slug
 * cross-product (`/seo/json-formatter` 404s rather than serving the JSON
 * formatter under the wrong category).
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  // Next 16: params is async. Sync access was removed.
  const { category, slug } = await params
  const tool = getTool(slug)
  if (!tool || tool.category !== category) return {}

  const path = `/${tool.category}/${tool.slug}`
  return {
    title: `${tool.title} — Free Online Tool`,
    description: tool.description,
    keywords: [...tool.keywords],
    alternates: { canonical: path },
    // Each tool gets its own browser-tab icon — the same white-disc composite
    // (scripts/make-tool-favicons.mjs) rendered beside the H1 on the page
    // itself (see ToolShell). The disc background exists FOR this favicon
    // slot: the raw marks are violet on transparency, which vanishes against
    // a dark tab strip. Explicitly setting `icons` here
    // overrides the root layout's declaration (app/layout.tsx) for ONLY this
    // route; every page that does not set this field — the homepage, /all,
    // category pages, /about — keeps inheriting the site mark untouched.
    //
    // `icon` and `shortcut` both point at the tool's file: see the comment on
    // the root layout's `icons` field for why `favicon.ico` needed its own
    // App Router special-file convention removed before a per-route override
    // like this one could actually take effect. `apple` is repeated from the
    // root value rather than left to inherit — the Next Metadata `icons`
    // field's merge behaviour across a partial override is not something to
    // rely on unverified, so the value is just restated.
    icons: {
      icon: `/tool-icons/${tool.slug}.png`,
      shortcut: `/tool-icons/${tool.slug}.png`,
      apple: '/apple-icon.png',
    },
    openGraph: {
      type: 'website',
      url: absoluteUrl(path),
      title: `${tool.title} — Free Online Tool`,
      description: tool.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
    },
  }
}

export default async function ToolPage({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, slug } = await params

  const tool = getTool(slug)
  const category = getCategory(categorySlug)

  // Guard the cross-product: /seo/json-formatter must 404 rather than render the
  // JSON formatter under the wrong category and create a duplicate URL.
  if (!tool || !category || tool.category !== categorySlug) notFound()

  const ToolComponent = getToolComponent(tool.slug)
  if (!ToolComponent) notFound()

  const faq = faqJsonLd(tool)

  return (
    <>
      <JsonLd data={toolJsonLd(tool, category)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: category.name, path: `/${category.slug}` },
          { name: tool.title, path: `/${tool.category}/${tool.slug}` },
        ])}
      />
      {faq ? <JsonLd data={faq} /> : null}

      <ToolShell tool={tool}>
        <ToolComponent />
      </ToolShell>
    </>
  )
}
