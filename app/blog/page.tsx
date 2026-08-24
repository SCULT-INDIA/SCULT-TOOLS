import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BlogIndexList } from '@/components/blog/BlogIndexList'
import { BLOG_POSTS } from '@/lib/blog/registry'
import type { BlogPillar } from '@/lib/blog/types'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'

const VALID_PILLARS: readonly BlogPillar[] = [
  'tool',
  'prompt',
  'service',
  'roundup',
  'playbook',
]

function isBlogPillar(value: string | undefined): value is BlogPillar {
  return VALID_PILLARS.includes(value as BlogPillar)
}

const TITLE = 'Blog'
const DESCRIPTION = `${BLOG_POSTS.length} long-form guides on the tools, AI prompts and services this site is built around — each one fact-checked against the real tool it references.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/blog'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const POST_SUMMARIES = BLOG_POSTS.map((post) => ({
  slug: post.slug,
  pillar: post.pillar,
  title: post.title,
  description: post.description,
  readingMinutes: post.readingMinutes,
}))

/**
 * The editorial hub, one tier deeper than `/guides` — long-form, keyword-
 * targeted posts across tools, prompts and Scult's services. Every post
 * derives from `lib/blog/registry.ts`, so a new post surfaces here
 * automatically — nothing on this page is hand-kept.
 */
export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ pillar?: string }>
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />

      <section className="container-site max-w-[56rem] pt-10 pb-16">
        <p className="eyebrow">Blog</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          Long-form guides on the tools, prompts and services this site is built around
        </h1>
        <p className="mt-5 text-[18px] text-ink-muted leading-8 md:text-lead">
          {BLOG_POSTS.length} post{BLOG_POSTS.length === 1 ? '' : 's'}, each one
          fact-checked against the real tool, prompt or service it references — not
          generic SEO filler.
        </p>

        {/* `searchParams` is per-request data — reading it directly in this
            page component (as the previous version did) made the whole
            route "blocking" under Cache Components, which fails the
            production build outright ("Uncached data was accessed outside
            of <Suspense>"). Isolating the read in its own async component
            behind Suspense keeps the rest of the page statically
            prerenderable; the fallback matches the unfiltered ("all")
            view exactly, so there's nothing visally to swap in the common
            case where the request has no `?pillar=`. */}
        <div className="mt-10">
          <Suspense
            fallback={<BlogIndexList posts={POST_SUMMARIES} initialPillar="all" />}
          >
            <FilteredBlogIndexList searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  )
}

async function FilteredBlogIndexList({
  searchParams,
}: {
  searchParams: Promise<{ pillar?: string }>
}) {
  const { pillar } = await searchParams
  const initialPillar = isBlogPillar(pillar) ? pillar : 'all'
  return <BlogIndexList posts={POST_SUMMARIES} initialPillar={initialPillar} />
}
