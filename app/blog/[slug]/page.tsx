import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BlogBody } from '@/components/blog/BlogBody'
import { BlogFaq } from '@/components/blog/BlogFaq'
import { PromptCard } from '@/components/ui/PromptCard'
import { ToolCard } from '@/components/ui/ToolCard'
import { BLOG_POSTS, getBlogPost } from '@/lib/blog/registry'
import type { BlogPillar } from '@/lib/blog/types'
import { getPromptCategory } from '@/lib/prompts/categories'
import { getPrompt } from '@/lib/prompts/registry'
import { blogFaqJsonLd, blogPostJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl, formatUpdatedDate } from '@/lib/site'
import { getTool } from '@/lib/tools/registry'
import { resolveServiceLink } from '@/lib/tools/service-links'

const PILLAR_LABEL: Record<BlogPillar, string> = {
  tool: 'Tools',
  prompt: 'Prompts',
  service: 'Services',
  roundup: 'Roundups',
  playbook: 'Playbooks',
}

export function generateStaticParams(): { slug: string }[] {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  const path = `/blog/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: absoluteUrl(path),
      title: post.title,
      description: post.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const relatedTools = post.relatedTools
    .map((toolSlug) => getTool(toolSlug))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined)
  const relatedPrompts = post.relatedPrompts
    .map((promptSlug) => getPrompt(promptSlug))
    .filter((prompt): prompt is NonNullable<typeof prompt> => prompt !== undefined)
  const relatedPosts = BLOG_POSTS.filter(
    (p) =>
      p.slug !== post.slug &&
      (p.pillar === post.pillar ||
        p.relatedTools.some((t) => post.relatedTools.includes(t))),
  ).slice(0, 3)
  const service = post.serviceTarget
    ? resolveServiceLink(post.serviceTarget, post.slug)
    : null

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd data={blogPostJsonLd(post)} />
      {blogFaqJsonLd(post) ? <JsonLd data={blogFaqJsonLd(post) as object} /> : null}

      <article className="container-site max-w-[46rem] pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-[13px] text-ink-subtle">
            <li>
              <Link href="/" className="hover:text-violet-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-violet-600">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink-muted">
              {post.title}
            </li>
          </ol>
        </nav>

        <header>
          <p className="eyebrow">{PILLAR_LABEL[post.pillar]}</p>
          <h1 className="mt-3 text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]">
            {post.h1}
          </h1>
          <p className="mt-5 text-[17px] text-ink-muted leading-8 md:text-lead">
            {post.dek}
          </p>
          <p className="mt-3 text-[13px] text-ink-subtle">
            Last updated {formatUpdatedDate(post.updatedAt)} · {post.readingMinutes} min
            read
          </p>
        </header>

        <BlogBody sections={post.sections} />

        {post.faq && post.faq.length > 0 ? <BlogFaq items={post.faq} /> : null}

        {post.sources && post.sources.length > 0 ? (
          <section aria-labelledby="blog-sources" className="mt-12">
            <h2
              id="blog-sources"
              className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-subtle"
            >
              Sources
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {post.sources.map((url) => (
                <li key={url} className="truncate text-[13px]">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-violet-accent-text,var(--color-violet-700))] hover:text-violet-600"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {service ? (
          <section
            aria-labelledby="blog-next"
            className="mt-14 rounded-panel border border-line bg-violet-900 p-7 text-center text-white md:p-9"
          >
            <h2
              id="blog-next"
              className="font-display font-semibold text-[24px] text-white tracking-normal md:text-[28px]"
            >
              Need this built into your business?
            </h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-[15px] text-white/75 leading-6">
              The free tools and prompts on this site handle the small, solved problems.
              If what you need is bigger — {service.label}, built and maintained for you —
              that's Scult's day job.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href={service.href} className="btn-brutal btn-white">
                EXPLORE {service.label.toUpperCase()}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </section>
        ) : null}

        {relatedTools.length > 0 ? (
          <section aria-labelledby="blog-tools" className="mt-12">
            <h2
              id="blog-tools"
              className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-subtle"
            >
              Tools mentioned in this post
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {relatedTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        ) : null}

        {relatedPrompts.length > 0 ? (
          <section aria-labelledby="blog-prompts" className="mt-12">
            <h2
              id="blog-prompts"
              className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-subtle"
            >
              Prompts mentioned in this post
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {relatedPrompts.map((prompt) => {
                const category = getPromptCategory(prompt.category)
                return category ? (
                  <PromptCard key={prompt.slug} prompt={prompt} category={category} />
                ) : null
              })}
            </div>
          </section>
        ) : null}

        {relatedPosts.length > 0 ? (
          <section aria-labelledby="blog-related" className="mt-12">
            <h2
              id="blog-related"
              className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-subtle"
            >
              Read next
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="card-modern flex items-center justify-between gap-3 p-5"
                >
                  <span className="text-[15px] text-ink-body">{related.title}</span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-ink-subtle"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-10">
          <Link
            href="/blog"
            className="text-[15px] text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            ← All posts
          </Link>
        </p>
      </article>
    </>
  )
}
