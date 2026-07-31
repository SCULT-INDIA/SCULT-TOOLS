import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ToolCard } from '@/components/ui/ToolCard'
import { breadcrumbJsonLd, categoryJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { CATEGORIES, getCategory } from '@/lib/tools/categories'
import { getToolsByCategory } from '@/lib/tools/registry'

/** Category landing page: /seo, /web, /design, … */

type Params = { category: string }

export function generateStaticParams(): Params[] {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

/**
 * No `dynamicParams = false` here: that segment config is incompatible with
 * `cacheComponents` and Next rejects it at build time.
 *
 * It is also unnecessary. Unknown slugs are rejected by the registry lookup
 * below — `getCategory()` returns undefined and the page calls `notFound()` — so
 * an unrecognised path 404s either way. The explicit guard is the real
 * protection; `dynamicParams` was only ever belt-and-braces on top of it.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category: slug } = await params
  const category = getCategory(slug)
  if (!category) return {}

  const count = getToolsByCategory(category.slug).length
  return {
    title: `Free ${category.name} Tools — ${count} Tools, No Signup`,
    description: category.intro,
    alternates: { canonical: `/${category.slug}` },
    openGraph: {
      type: 'website',
      url: absoluteUrl(`/${category.slug}`),
      title: `Free ${category.name} Tools`,
      description: category.intro,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category: slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()

  const tools = getToolsByCategory(category.slug)
  // Two sibling categories, so a visitor who lands here from search has somewhere
  // lateral to go rather than only up or out.
  const siblings = CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 2)

  return (
    <>
      <JsonLd data={categoryJsonLd(category, tools)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: category.name, path: `/${category.slug}` },
        ])}
      />

      <section className="container-site pt-10 pb-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-[14px] text-ink-subtle">
            <li>
              <Link href="/" className="hover:text-violet-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {category.name}
            </li>
          </ol>
        </nav>

        <p className="eyebrow">
          {tools.length} free {tools.length === 1 ? 'tool' : 'tools'}
        </p>
        <h1 className="mt-3 max-w-[26ch] text-[38px] leading-[1.05] tracking-[-1px] md:text-[52px] md:leading-[56px]">
          Free {category.name} Tools
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] text-ink-muted leading-7 md:text-lead">
          {category.intro}
        </p>
      </section>

      <section aria-label={`${category.name} tools`} className="container-site py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="container-site pb-8">
        <h2 className="font-sans font-bold text-[13px] uppercase tracking-[0.1em]">
          Other categories
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="chip-tool max-w-sm text-[15px]"
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-ink-subtle">— {s.blurb}</span>
            </Link>
          ))}
          <Link href="/all" className="chip-tool text-[15px]">
            <span className="font-medium">All tools</span>
          </Link>
        </div>
      </section>
    </>
  )
}
