import { getVercelOidcToken } from '@vercel/oidc'
import { createClient } from '@supabase/supabase-js'

/**
 * The Skills Library's real sync engine — a standalone Vercel project
 * (deliberately NOT part of the main tools.scult.in Next.js app, which is
 * deployed on Railway) whose only job is calling skills.sh's official,
 * OIDC-authenticated `/api/v1/*` endpoints — paginated, no rate-limit
 * fighting, no GitHub-raw-file path guessing — and upserting real skills
 * into the shared Supabase database the main app reads from.
 *
 * Why this has to live on Vercel: `getVercelOidcToken()` only returns a
 * real token for a project actually deployed on Vercel with OIDC enabled
 * (Project Settings -> OIDC Federation). There is no way to get one from
 * Railway. See the main repo's session history for the full reasoning —
 * the earlier, Railway-only approach (searching skills.sh's legacy
 * unauthenticated endpoints, then guessing GitHub raw-file paths) hit real
 * throughput and reliability ceilings that made reaching the registry's
 * full ~600k scale impractical; the official API doesn't have that
 * problem, but only Vercel-deployed apps can call it this way.
 *
 * A single invocation is time-boxed (see `vercel.json`'s `maxDuration`),
 * so this makes bounded progress per call — a fixed number of leaderboard
 * pages, each with a bounded per-skill detail-fetch concurrency — and
 * records where it left off in `skills_sync_meta.cursor_page` so the NEXT
 * invocation continues instead of restarting from page 1. The GitHub
 * Actions workflow in the main repo (`.github/workflows/sync-skills-worker.yml`)
 * is the loop driver: it calls this endpoint repeatedly for hours at a
 * time, which is how a serverless-function-duration-limited design still
 * makes real cumulative progress toward 600k.
 */

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CRON_SECRET = process.env.CRON_SECRET
const SKILLS_SH_BASE = 'https://www.skills.sh/api/v1'

const PAGES_PER_INVOCATION = 3
const PER_PAGE = 100
const DETAIL_CONCURRENCY = 15

// Mirrors lib/skills/categories.ts's (slug, seedQueries) pairs in the main
// repo — duplicated here because this is a separate deployable project
// with its own package.json, not because the taxonomy is meant to drift.
// Update both together.
const CATEGORY_KEYWORDS = [
  { slug: 'testing', words: ['testing', 'jest', 'vitest', 'pytest', 'go testing', 'rspec', 'junit', 'playwright', 'cypress', 'e2e', 'unit test', 'integration test', 'mutation testing', 'snapshot testing', 'load testing'] },
  { slug: 'debugging', words: ['debugging', 'debug', 'stack trace', 'bisect', 'flaky test', 'memory leak', 'production debugging', 'log analysis'] },
  { slug: 'git-workflows', words: ['git workflow', 'git commit', 'git rebase', 'merge conflict', 'git hooks', 'branching strategy', 'monorepo git'] },
  { slug: 'code-review', words: ['code review', 'pull request', 'pr review'] },
  { slug: 'refactoring', words: ['refactoring', 'refactor', 'legacy code migration', 'dead code', 'code smell'] },
  { slug: 'api-design', words: ['rest api', 'graphql', 'api versioning', 'openapi', 'rate limiting', 'webhook', 'grpc'] },
  { slug: 'database', words: ['postgres', 'mysql', 'mongodb', 'redis', 'database migration', 'query optimization', 'database indexing', 'sql schema'] },
  { slug: 'security', words: ['security audit', 'penetration testing', 'pentest', 'secrets management', 'encryption', 'vulnerability', 'owasp', 'authentication'] },
  { slug: 'performance', words: ['performance optimization', 'caching', 'profiling', 'core web vitals', 'performance tuning'] },
  { slug: 'deployment-cicd', words: ['ci/cd', 'ci cd', 'github actions', 'release management', 'feature flag', 'deployment', 'rollback', 'canary'] },
  { slug: 'observability', words: ['observability', 'structured logging', 'distributed tracing', 'incident response', 'monitoring', 'on-call'] },
  { slug: 'accessibility', words: ['accessibility', 'wcag', 'screen reader', 'aria', 'keyboard navigation'] },
  { slug: 'frontend-frameworks', words: ['react', 'nextjs', 'next.js', 'vue', 'angular', 'svelte', 'frontend'] },
  { slug: 'backend-frameworks', words: ['django', 'fastapi', 'rails', 'spring boot', 'laravel', 'go backend', 'rust backend', 'nodejs backend', 'backend'] },
  { slug: 'mobile', words: ['ios', 'android', 'flutter', 'react native', 'mobile app', 'swift', 'kotlin'] },
  { slug: 'devops-infra', words: ['docker', 'kubernetes', 'terraform', 'aws', 'gcp', 'azure', 'serverless', 'infrastructure'] },
  { slug: 'ai-ml', words: ['llm', 'prompt engineering', 'rag', 'vector database', 'fine tuning', 'ai agent', 'langchain', 'machine learning', 'model context protocol'] },
  { slug: 'data-engineering', words: ['etl', 'airflow', 'spark', 'data warehouse', 'data pipeline'] },
  { slug: 'architecture', words: ['system design', 'microservices', 'architecture decision', 'event driven architecture'] },
  { slug: 'design-systems', words: ['design system', 'component library', 'design tokens', 'figma', 'ui theming'] },
  { slug: 'seo-marketing', words: ['seo', 'technical seo', 'ab testing', 'analytics', 'marketing automation', 'marketing'] },
  { slug: 'project-management', words: ['sprint planning', 'project estimation', 'onboarding', 'retrospective', 'agile'] },
  { slug: 'writing-docs', words: ['technical writing', 'readme', 'api documentation', 'changelog', 'release notes', 'documentation'] },
  { slug: 'general', words: [] }, // fallback — matched only when nothing else does
]

const PERMISSIVE_LICENSES = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'MPL-2.0', 'Unlicense', 'CC0-1.0']
const LICENSE_TEXT_MARKERS = [
  ['MIT License', 'MIT'],
  ['Apache License', 'Apache-2.0'],
  ['BSD 3-Clause', 'BSD-3-Clause'],
  ['BSD 2-Clause', 'BSD-2-Clause'],
  ['ISC License', 'ISC'],
  ['Mozilla Public License', 'MPL-2.0'],
]

function categorize(name, description) {
  const haystack = `${name} ${description}`.toLowerCase()
  for (const { slug, words } of CATEGORY_KEYWORDS) {
    if (words.some((w) => haystack.includes(w))) return slug
  }
  return 'general'
}

function parseFrontmatter(skillMdContents) {
  const match = skillMdContents.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: skillMdContents.trim() }
  const [, fmBlock, body] = match
  const frontmatter = {}
  for (const line of fmBlock.split('\n')) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/)
    if (!kv) continue
    frontmatter[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return { frontmatter, body: body.trim() }
}

function classifyLicense(frontmatter, files) {
  const stated = frontmatter.license
  if (stated && PERMISSIVE_LICENSES.includes(stated)) return { license: stated, licenseGated: false }
  const licenseFile = files.find((f) => /^license(\.(txt|md))?$/i.test(f.path.split('/').pop() ?? ''))
  if (licenseFile) {
    for (const [marker, spdx] of LICENSE_TEXT_MARKERS) {
      if (licenseFile.contents.includes(marker)) return { license: spdx, licenseGated: false }
    }
  }
  return { license: stated || null, licenseGated: true }
}

function toSlug(sourceSkillId) {
  return sourceSkillId
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function fetchV1(token, path) {
  const res = await fetch(`${SKILLS_SH_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`skills.sh ${path} -> HTTP ${res.status}`)
  return res.json()
}

async function mapConcurrent(items, concurrency, worker) {
  let next = 0
  async function run() {
    while (next < items.length) {
      const item = items[next++]
      await worker(item)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run))
}

async function upsertSkillFromListing(supabase, token, item) {
  const [sourceOwner, ...repoRest] = item.source.split('/')
  const sourceRepo = repoRest.join('/')
  const skillId = item.slug ?? item.skillId ?? item.name

  let detail
  try {
    detail = await fetchV1(token, `/skills/${sourceOwner}/${sourceRepo}/${skillId}`)
  } catch {
    return { ok: false }
  }
  const files = detail?.files
  if (!files) return { ok: false }

  const skillMdFile = files.find((f) => f.path.toUpperCase().endsWith('SKILL.MD'))
  if (!skillMdFile) return { ok: false }

  const { frontmatter, body } = parseFrontmatter(skillMdFile.contents)
  const name = frontmatter.name || skillId
  const description = frontmatter.description || ''
  if (!description) return { ok: false } // no real trigger-phrase description — skip, don't invent one

  const { license, licenseGated } = classifyLicense(frontmatter, files)
  const tags = (frontmatter.tags || '')
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  const category = categorize(name, description)
  const now = new Date().toISOString()

  const { error } = await supabase
    .from('skills')
    .upsert(
      {
        id: item.id,
        category,
        slug: toSlug(skillId),
        name,
        description,
        body,
        tags,
        license,
        license_gated: licenseGated,
        source_owner: sourceOwner,
        source_repo: sourceRepo,
        source_skill_id: skillId,
        source_url: `https://github.com/${sourceOwner}/${sourceRepo}`,
        installs: item.installs ?? 0,
        last_synced_at: now,
        related_tools: [],
        related_prompts: [],
      },
      { onConflict: 'id', ignoreDuplicates: false },
    )
    .select('id')

  return { ok: !error, error }
}

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${CRON_SECRET}`) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const token = await getVercelOidcToken()

  const { data: meta } = await supabase.from('skills_sync_meta').select('*').maybeSingle()
  let cursorPage = meta?.cursor_page ?? 0
  let cursorDone = meta?.cursor_done ?? false
  let curatedDone = meta?.curated_done ?? false

  let processed = 0
  let failed = 0
  const errors = []

  if (!curatedDone) {
    try {
      const curated = await fetchV1(token, '/skills/curated')
      const items = (curated.data ?? curated.skills ?? []).filter((it) => !it.isDuplicate)
      await mapConcurrent(items, DETAIL_CONCURRENCY, async (item) => {
        const result = await upsertSkillFromListing(supabase, token, item)
        if (result.ok) processed++
        else failed++
      })
      curatedDone = true
    } catch (err) {
      errors.push(`curated: ${err.message}`)
    }
  } else if (!cursorDone) {
    for (let i = 0; i < PAGES_PER_INVOCATION; i++) {
      let listing
      try {
        listing = await fetchV1(token, `/skills?page=${cursorPage + 1}&perPage=${PER_PAGE}`)
      } catch (err) {
        errors.push(`page ${cursorPage + 1}: ${err.message}`)
        break
      }
      const items = (listing.data ?? []).filter((it) => !it.isDuplicate)
      if (items.length === 0) {
        cursorDone = true
        break
      }

      await mapConcurrent(items, DETAIL_CONCURRENCY, async (item) => {
        const result = await upsertSkillFromListing(supabase, token, item)
        if (result.ok) processed++
        else failed++
      })

      cursorPage++
      if (!listing.pagination?.hasMore) {
        cursorDone = true
        break
      }
    }
  }

  const { count } = await supabase.from('skills').select('id', { count: 'exact', head: true })
  await supabase.from('skills_sync_meta').upsert({
    id: true,
    last_synced_at: new Date().toISOString(),
    total_skills: count ?? 0,
    cursor_page: cursorPage,
    cursor_done: cursorDone,
    curated_done: curatedDone,
  })

  res.status(200).json({
    processed,
    failed,
    cursorPage,
    cursorDone,
    curatedDone,
    totalSkills: count ?? 0,
    errors,
  })
}
