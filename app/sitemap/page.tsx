import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog/registry'
import type { BlogPillar } from '@/lib/blog/types'
import { GUIDES } from '@/lib/guides/registry'
import { getCategoriesByGroup, PROMPT_GROUPS } from '@/lib/prompts/categories'
import { getPromptsByCategory, PROMPTS } from '@/lib/prompts/registry'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolsByCategory, TOOLS } from '@/lib/tools/registry'

const TITLE = 'Sitemap'
const DESCRIPTION =
  'Every page on Scult Tools in one place — every tool, prompt category, guide and trust page, plus links to the machine-readable robots.txt, sitemap.xml and llms.txt.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/sitemap' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/sitemap'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const LINK_CLASS =
  'text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600'

/** Static trust/reference pages — the same list `lib/seo/llms.ts` and Footer.tsx maintain by hand. */
const TRUST_PAGES: readonly { href: string; label: string }[] = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/security', label: 'Security' },
  { href: '/accessibility', label: 'Accessibility' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/brand', label: 'Brand & Press Kit' },
  { href: '/glossary', label: 'SEO, GEO & AEO Glossary' },
  { href: '/collections', label: 'Tool Collections' },
]

const MACHINE_PAGES: readonly { href: string; label: string; note: string }[] = [
  {
    href: '/sitemap.xml',
    label: 'XML sitemap',
    note: 'every URL with a real last-modified date',
  },
  {
    href: '/robots.txt',
    label: 'robots.txt',
    note: 'explicit allow rules for GPTBot, ClaudeBot, PerplexityBot and the rest',
  },
  { href: '/llms.txt', label: 'llms.txt', note: 'a curated link map for AI systems' },
  {
    href: '/llms-full.txt',
    label: 'llms-full.txt',
    note: 'the same map with full tool and guide detail inlined',
  },
]

const JUMP_SECTIONS: readonly { id: string; label: string }[] = [
  { id: 'tools', label: 'Tools' },
  { id: 'prompts', label: 'Prompt library' },
  { id: 'guides', label: 'Guides' },
  { id: 'blog', label: 'Blog' },
  { id: 'trust', label: 'About & trust' },
  { id: 'machine', label: 'Machine-readable' },
]

const BLOG_PILLAR_LABEL: Record<BlogPillar, string> = {
  tool: 'Tools',
  prompt: 'Prompts',
  service: 'Services',
  roundup: 'Roundups',
  playbook: 'Playbooks',
}

const BLOG_PILLARS: readonly BlogPillar[] = [
  'tool',
  'prompt',
  'service',
  'roundup',
  'playbook',
]

/**
 * The detailed, human-readable counterpart to `/sitemap.xml`.
 *
 * Every list here is generated from the same registries that drive routing,
 * the footer and `llms.txt` — nothing on this page is a hand-kept snapshot
 * that can drift from what actually exists.
 */
export default function SitemapPage() {
  const livePromptGroups = PROMPT_GROUPS.map((group) => ({
    group,
    categories: getCategoriesByGroup(group.slug).filter(
      (category) => getPromptsByCategory(category.slug).length > 0,
    ),
  })).filter((entry) => entry.categories.length > 0)

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Sitemap', path: '/sitemap' },
        ])}
      />

      <section className="container-site pt-10 pb-6">
        <p className="eyebrow">Sitemap</p>
        <h1 className="mt-3 text-[38px] leading-[1.05] tracking-[-1px] md:text-[52px] md:leading-[56px]">
          Every page on this site
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] text-ink-muted leading-7 md:text-lead">
          {TOOLS.length} tools, {PROMPTS.length} prompts, {GUIDES.length} guides,{' '}
          {BLOG_POSTS.length} blog posts and every trust page, grouped by section.
        </p>
        <p className="mt-3 max-w-[62ch] text-[15px] text-ink-muted">
          Prefer a machine-readable version?{' '}
          {MACHINE_PAGES.map((page, i) => (
            <span key={page.href}>
              {i > 0 && ', '}
              <a href={page.href} className={LINK_CLASS}>
                {page.label}
              </a>
            </span>
          ))}
          .
        </p>

        <nav aria-label="Jump to section" className="mt-7 flex flex-wrap gap-2">
          {JUMP_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="chip-tool px-4 py-2 text-[14px]"
            >
              {section.label}
            </a>
          ))}
        </nav>
      </section>

      <section
        id="tools"
        aria-labelledby="tools-heading"
        className="container-site scroll-mt-32 py-8"
      >
        <h2 id="tools-heading" className="text-[26px] tracking-[-0.5px] md:text-[30px]">
          Tools
        </h2>
        {CATEGORIES.map((category) => {
          const tools = getToolsByCategory(category.slug)
          if (tools.length === 0) return null
          return (
            <div key={category.slug} className="mt-6">
              <Link href={`/${category.slug}`} className={`font-medium ${LINK_CLASS}`}>
                {category.name} →
              </Link>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/${tool.category}/${tool.slug}`}
                      className="chip-tool px-4 py-2 text-[14px]"
                    >
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </section>

      <section
        id="prompts"
        aria-labelledby="prompts-heading"
        className="container-site scroll-mt-32 py-8"
      >
        <h2 id="prompts-heading" className="text-[26px] tracking-[-0.5px] md:text-[30px]">
          Prompt library
        </h2>
        <p className="mt-3 text-[15px] text-ink-muted">
          <Link href="/prompts" className={`font-medium ${LINK_CLASS}`}>
            Browse all {PROMPTS.length} prompts →
          </Link>
        </p>
        {livePromptGroups.map(({ group, categories }) => (
          <div key={group.slug} className="mt-6">
            <p className="font-semibold text-[15px] text-ink-subtle uppercase tracking-wide">
              {group.name}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/prompts/${category.slug}`}
                    className="chip-tool px-4 py-2 text-[14px]"
                  >
                    {category.name} ({getPromptsByCategory(category.slug).length})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section
        id="guides"
        aria-labelledby="guides-heading"
        className="container-site scroll-mt-32 py-8"
      >
        <h2 id="guides-heading" className="text-[26px] tracking-[-0.5px] md:text-[30px]">
          Guides
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="chip-tool px-4 py-2 text-[14px]"
              >
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="blog"
        aria-labelledby="blog-heading"
        className="container-site scroll-mt-32 py-8"
      >
        <h2 id="blog-heading" className="text-[26px] tracking-[-0.5px] md:text-[30px]">
          Blog
        </h2>
        <p className="mt-3 text-[15px] text-ink-muted">
          <Link href="/blog" className={`font-medium ${LINK_CLASS}`}>
            Browse all {BLOG_POSTS.length} posts →
          </Link>
        </p>
        {BLOG_PILLARS.map((pillar) => {
          const posts = BLOG_POSTS.filter((post) => post.pillar === pillar)
          if (posts.length === 0) return null
          return (
            <div key={pillar} className="mt-6">
              <p className="font-semibold text-[15px] text-ink-subtle uppercase tracking-wide">
                {BLOG_PILLAR_LABEL[pillar]} ({posts.length})
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="chip-tool px-4 py-2 text-[14px]"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </section>

      <section
        id="trust"
        aria-labelledby="trust-heading"
        className="container-site scroll-mt-32 py-8"
      >
        <h2 id="trust-heading" className="text-[26px] tracking-[-0.5px] md:text-[30px]">
          About &amp; trust
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {TRUST_PAGES.map((page) => (
            <li key={page.href}>
              <Link href={page.href} className="chip-tool px-4 py-2 text-[14px]">
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="machine"
        aria-labelledby="machine-heading"
        className="container-site scroll-mt-32 py-8 pb-16"
      >
        <h2 id="machine-heading" className="text-[26px] tracking-[-0.5px] md:text-[30px]">
          Machine-readable
        </h2>
        <p className="mt-3 max-w-[62ch] text-[15px] text-ink-muted leading-6">
          The same map above, in the formats search engines and AI crawlers actually
          fetch.
        </p>
        <ul className="mt-4 space-y-3">
          {MACHINE_PAGES.map((page) => (
            <li key={page.href} className="card-flat p-4">
              <a href={page.href} className={`font-medium ${LINK_CLASS}`}>
                {page.href}
              </a>
              <p className="mt-1 text-[15px] text-ink-muted">{page.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
