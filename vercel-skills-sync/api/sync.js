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

const PER_PAGE = 100
const DETAIL_CONCURRENCY = 30
// skills.sh's official API is documented at 600 requests/minute per
// (team, project). Rather than cap concurrency low to stay under that (which
// wastes the window whenever a request is slow), a sliding-window limiter
// paces the ACTUAL requests to ~90% of the documented cap — concurrency can
// stay high because the limiter, not queue depth, is what governs throughput.
const RATE_LIMIT_PER_MINUTE = 540
const RATE_LIMIT_WINDOW_MS = 60_000
// maxDuration is 60s (vercel.json). This budget has to leave room not just
// for the final Supabase writes but for the WORST-CASE TAIL of whatever's
// already in flight when the deadline check fires: mapConcurrent stops
// starting new items past this budget, but up to DETAIL_CONCURRENCY items
// already started can each still take up to LICENSE_FETCH_TIMEOUT_MS * 6
// (two branches x three filenames) before fetchRootLicense gives up. That
// tail, not the budget itself, is what caused the first two production
// deploys to hit FUNCTION_INVOCATION_TIMEOUT — 52s budget + a 30s tail
// (5s x 6) safely exceeds the 60s hard limit.
const LICENSE_FETCH_TIMEOUT_MS = 2_000
const TIME_BUDGET_MS = 60_000 - LICENSE_FETCH_TIMEOUT_MS * 6 - 6_000 // ~42s
const MAX_RETRIES = 4

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

/**
 * Most single-skill repos put LICENSE at the repo ROOT, not next to
 * SKILL.md — the official API's per-skill `files[]` only covers the
 * skill's own directory, so a root-level license was invisible to
 * `classifyLicense` and made the large majority of skills look
 * unlicensed when they're actually MIT/Apache/etc. This is a plain CDN
 * fetch (raw.githubusercontent.com), not an API call, so it doesn't touch
 * any rate limit the way the old legacy-endpoint scraping did.
 */
async function fetchRootLicense(sourceOwner, sourceRepo) {
  for (const branch of ['main', 'master']) {
    for (const name of ['LICENSE', 'LICENSE.txt', 'LICENSE.md']) {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${sourceOwner}/${sourceRepo}/${branch}/${name}`, {
          signal: AbortSignal.timeout(LICENSE_FETCH_TIMEOUT_MS),
        })
        if (res.ok) return { path: name, contents: await res.text() }
      } catch {
        // try the next branch/filename — a slow/hanging request here must
        // not be allowed to stall an entire batch past the function's
        // duration limit (this is what caused the first deploy's timeout)
      }
    }
  }
  return null
}

function toSlug(sourceSkillId) {
  return sourceSkillId
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Sliding-window limiter shared by every call to the official API — this
 * is what lets DETAIL_CONCURRENCY be set high without actually exceeding
 * skills.sh's documented per-minute cap. It's a module-level singleton, so
 * its window PERSISTS across invocations that land on the same warm
 * container (which the GH Actions loop-driver's rapid repeat calls make
 * common) — a prior invocation's usage can leave the window near-full,
 * meaning `acquire()` might need to wait most of a minute for it to roll
 * over. Left unbounded, that wait — not the request itself — is what blew
 * through Vercel's hard function-duration limit in earlier deploys:
 * `acquire()` must give up once waiting would exceed what's left of THIS
 * invocation's own budget, rather than sleep past it with no visibility
 * into the caller's deadline.
 */
function createRateLimiter(maxPerWindow, windowMs) {
  const timestamps = []
  return async function acquire(deadlineAt) {
    while (true) {
      const now = Date.now()
      while (timestamps.length > 0 && now - timestamps[0] > windowMs) timestamps.shift()
      if (timestamps.length < maxPerWindow) {
        timestamps.push(now)
        return
      }
      const waitMs = windowMs - (now - timestamps[0]) + 10
      if (deadlineAt && now + waitMs > deadlineAt) {
        throw new Error('rate-limit wait would exceed remaining time budget')
      }
      await sleep(waitMs)
    }
  }
}

const acquireSlot = createRateLimiter(RATE_LIMIT_PER_MINUTE, RATE_LIMIT_WINDOW_MS)

function backoffMs(attempt) {
  return Math.min(8_000, 500 * 2 ** (attempt - 1)) + Math.random() * 250
}

async function fetchV1(token, path, deadlineAt) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    await acquireSlot(deadlineAt)
    const res = await fetch(`${SKILLS_SH_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
    if (res.status === 429 && attempt < MAX_RETRIES) {
      const retryAfter = Number(res.headers.get('retry-after'))
      await sleep(retryAfter > 0 ? retryAfter * 1000 : backoffMs(attempt))
      continue
    }
    if (!res.ok) throw new Error(`skills.sh ${path} -> HTTP ${res.status}`)
    return res.json()
  }
  throw new Error(`skills.sh ${path} -> exhausted retries`)
}

/**
 * `timeLeft` is optional — when given, no NEW item starts once it returns
 * <= 0 (items already in flight still finish; each is individually bounded
 * by fetchV1/fetchRootLicense's own timeouts, so the real worst-case tail
 * is bounded too). Without this, a batch whose item count doesn't divide
 * evenly by `concurrency` — the curated set, which has no per-page budget
 * check the way the cursor loop does — has no way to stop itself before
 * Vercel's own hard function-duration limit kills the whole invocation
 * mid-write, which is what caused the first production deploy's timeout.
 */
async function mapConcurrent(items, concurrency, worker, timeLeft) {
  let next = 0
  let ranOutOfTime = false
  async function run() {
    while (next < items.length) {
      if (timeLeft && timeLeft() <= 0) {
        ranOutOfTime = true
        return
      }
      const item = items[next++]
      await worker(item)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run))
  return { completed: !ranOutOfTime }
}

async function upsertSkillFromListing(supabase, token, item, deadlineAt) {
  if (!item?.id || typeof item.source !== 'string' || !item.source.includes('/')) {
    return { ok: false, error: `malformed item: ${JSON.stringify(item)}` }
  }
  const [sourceOwner, ...repoRest] = item.source.split('/')
  const sourceRepo = repoRest.join('/')
  const skillId = item.slug ?? item.skillId ?? item.name

  let detail
  try {
    detail = await fetchV1(token, `/skills/${sourceOwner}/${sourceRepo}/${skillId}`, deadlineAt)
  } catch (err) {
    return { ok: false, error: err.message }
  }
  const files = detail?.files
  if (!files) return { ok: false }

  const skillMdFile = files.find((f) => f.path.toUpperCase().endsWith('SKILL.MD'))
  if (!skillMdFile) return { ok: false }

  const { frontmatter, body } = parseFrontmatter(skillMdFile.contents)
  const name = frontmatter.name || skillId
  const description = frontmatter.description || ''
  if (!description) return { ok: false } // no real trigger-phrase description — skip, don't invent one

  let { license, licenseGated } = classifyLicense(frontmatter, files)
  if (licenseGated) {
    const rootLicense = await fetchRootLicense(sourceOwner, sourceRepo)
    if (rootLicense) {
      const reclassified = classifyLicense(frontmatter, [...files, rootLicense])
      license = reclassified.license
      licenseGated = reclassified.licenseGated
    }
  }
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

  const startedAt = Date.now()
  const timeLeft = () => TIME_BUDGET_MS - (Date.now() - startedAt)
  const deadlineAt = startedAt + TIME_BUDGET_MS

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const token = await getVercelOidcToken()

  const { data: meta } = await supabase.from('skills_sync_meta').select('*').maybeSingle()
  let cursorPage = meta?.cursor_page ?? 0
  let cursorDone = meta?.cursor_done ?? false
  let curatedDone = meta?.curated_done ?? false

  let processed = 0
  let failed = 0
  let pagesThisRun = 0
  const errors = []

  if (!curatedDone) {
    try {
      const curated = await fetchV1(token, '/skills/curated', deadlineAt)
      // The real shape is grouped by owner ({owner, featuredRepo, skills:
      // [...]}), not a flat list of skill items — each group's own `skills`
      // array is what actually matches the leaderboard's per-item shape
      // (id/slug/source/installs/isDuplicate).
      const groups = curated.data ?? curated.skills ?? []
      const items = groups.flatMap((group) => group.skills ?? [group]).filter((it) => !it.isDuplicate)
      const { completed } = await mapConcurrent(
        items,
        DETAIL_CONCURRENCY,
        async (item) => {
          let result
          try {
            result = await upsertSkillFromListing(supabase, token, item, deadlineAt)
          } catch (err) {
            result = { ok: false, error: err.message }
          }
          if (result.ok) processed++
          else {
            failed++
            if (result.error && errors.length < 20) errors.push(String(result.error))
          }
        },
        timeLeft,
      )
      // Only mark curated as done once every item was actually attempted —
      // if the time budget ran out mid-batch, the next invocation must
      // retry curated rather than silently skip whatever wasn't reached.
      curatedDone = completed
    } catch (err) {
      errors.push(`curated: ${err.message}`)
    }
  }

  // Uses whatever time is left after curated (if this was the first-ever
  // invocation) to make as much cursor progress as the budget allows,
  // rather than a fixed page count that leaves the window under-used on
  // fast pages or gets killed mid-page on slow ones.
  if (curatedDone && !cursorDone) {
    while (timeLeft() > 8_000) {
      let listing
      try {
        listing = await fetchV1(token, `/skills?page=${cursorPage + 1}&perPage=${PER_PAGE}`, deadlineAt)
      } catch (err) {
        errors.push(`page ${cursorPage + 1}: ${err.message}`)
        break
      }
      const items = (listing.data ?? []).filter((it) => !it.isDuplicate)
      if (items.length === 0) {
        cursorDone = true
        break
      }

      const { completed } = await mapConcurrent(
        items,
        DETAIL_CONCURRENCY,
        async (item) => {
          let result
          try {
            result = await upsertSkillFromListing(supabase, token, item, deadlineAt)
          } catch (err) {
            result = { ok: false, error: err.message }
          }
          if (result.ok) processed++
          else {
            failed++
            if (result.error && errors.length < 20) errors.push(String(result.error))
          }
        },
        timeLeft,
      )

      // Only advance past this page if every item on it was actually
      // attempted — otherwise the next invocation must retry the SAME
      // page (cursorPage unchanged) rather than silently skip whatever
      // this page's batch didn't reach before time ran out.
      if (!completed) break

      cursorPage++
      pagesThisRun++
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
    pagesThisRun,
    cursorPage,
    cursorDone,
    curatedDone,
    totalSkills: count ?? 0,
    elapsedMs: Date.now() - startedAt,
    errors,
  })
}
