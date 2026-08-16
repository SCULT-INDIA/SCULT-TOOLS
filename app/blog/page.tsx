import type { Metadata } from 'next'
import { BlogIndexList } from '@/components/blog/BlogIndexList'
import { BLOG_POSTS } from '@/lib/blog/registry'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'

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

/**
 * The editorial hub, one tier deeper than `/guides` — long-form, keyword-
 * targeted posts across tools, prompts and Scult's services. Every post
 * derives from `lib/blog/registry.ts`, so a new post surfaces here
 * automatically — nothing on this page is hand-kept.
 */
export default function BlogPage() {
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
          {BLOG_POSTS.length} post{BLOG_POSTS.length === 1 ? '' : 's'}, each one fact-checked
          against the real tool, prompt or service it references — not generic SEO filler.
        </p>

        <div className="mt-10">
          <BlogIndexList
            posts={BLOG_POSTS.map((post) => ({
              slug: post.slug,
              pillar: post.pillar,
              title: post.title,
              description: post.description,
              readingMinutes: post.readingMinutes,
            }))}
          />
        </div>
      </section>
    </>
  )
}
