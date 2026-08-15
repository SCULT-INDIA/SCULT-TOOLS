'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { BlogPillar, BlogPost } from '@/lib/blog/types'

const PILLAR_LABEL: Record<BlogPillar, string> = {
  tool: 'Tools',
  prompt: 'Prompts',
  service: 'Services',
  roundup: 'Roundups',
  playbook: 'Playbooks',
}

const FILTERS: readonly { key: BlogPillar | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'tool', label: 'Tools' },
  { key: 'prompt', label: 'Prompts' },
  { key: 'service', label: 'Services' },
  { key: 'roundup', label: 'Roundups' },
  { key: 'playbook', label: 'Playbooks' },
]

/**
 * Client-side filter over the static `BLOG_POSTS` array — no pagination or
 * server round-trip needed at 100 posts, same call this codebase already
 * made for `CategoryTabs`'s tool-category tabs.
 */
export function BlogIndexList({ posts }: { posts: readonly BlogPost[] }) {
  const [active, setActive] = useState<BlogPillar | 'all'>('all')
  const visible = active === 'all' ? posts : posts.filter((p) => p.pillar === active)

  return (
    <div>
      <div role="tablist" aria-label="Filter by topic" className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={active === filter.key}
            onClick={() => setActive(filter.key)}
            className={`rounded-full border px-4 py-1.5 text-[14px] transition-colors ${
              active === filter.key
                ? 'border-violet-700 bg-violet-700 text-white'
                : 'border-line-grey text-ink-muted hover:border-violet-400'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card-flat block p-5"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-violet-700">
              {PILLAR_LABEL[post.pillar]}
            </p>
            <h2 className="mt-2 text-[20px] leading-tight">{post.title}</h2>
            <p className="mt-2 text-[15px] text-ink-muted leading-6">
              {post.description}
            </p>
            <p className="mt-3 text-[13px] text-ink-subtle">
              {post.readingMinutes} min read
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
