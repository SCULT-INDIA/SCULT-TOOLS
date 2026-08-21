import { writeFileSync } from 'node:fs'
import { GUIDES } from '../lib/guides/registry'
import { BLOG_POSTS } from '../lib/blog/registry'
import { PROMPTS } from '../lib/prompts/registry'
import { TOOLS } from '../lib/tools/registry'

const dump = {
  tools: TOOLS.map((t) => ({ slug: t.slug, category: t.category })),
  prompts: PROMPTS.map((p) => ({ slug: p.slug, category: p.category })),
  guides: GUIDES.map((g) => ({ slug: g.slug })),
  blogSlugs: BLOG_POSTS.map((b) => b.slug),
  blogKeywords: BLOG_POSTS.map((b) => b.targetKeyword),
  blogTitles: BLOG_POSTS.map((b) => b.title),
  blogDescriptions: BLOG_POSTS.map((b) => b.description),
}

writeFileSync('content-engine/registries-dump.json', JSON.stringify(dump, null, 2))
console.log('wrote', dump.tools.length, 'tools,', dump.prompts.length, 'prompts,', dump.guides.length, 'guides,', dump.blogSlugs.length, 'blog posts')
