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

/** Deterministic 6-char suffix (djb2 → base36) for slug-collision retries —
 * same input id always yields the same suffix, so re-running a pass upserts
 * the same row instead of minting a new slug every day. */
function shortHash(input) {
  let h = 5381
  for (let i = 0; i < input.length; i++) h = ((h * 33) ^ input.charCodeAt(i)) >>> 0
  return h.toString(36).padStart(6, '0').slice(0, 6)
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
    // Hard per-request timeout, capped by the invocation's own remaining
    // budget: skills.sh under heavy load has been observed to throttle by
    // STALLING connections rather than answering 429, and an un-signalled
    // fetch then hangs the whole invocation into Vercel's 60s kill (a 504
    // with no meta write). A stalled attempt aborts, burns one retry, and
    // stays inside the budget instead.
    const remainingMs = deadlineAt ? deadlineAt - Date.now() : 15_000
    if (remainingMs <= 1_000) {
      throw new Error('rate-limit wait would exceed remaining time budget')
    }
    let res
    try {
      res = await fetch(`${SKILLS_SH_BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        signal: AbortSignal.timeout(Math.min(15_000, remainingMs)),
      })
    } catch (err) {
      if (attempt < MAX_RETRIES) continue
      throw new Error(`skills.sh ${path} -> ${err.name === 'TimeoutError' ? 'request timed out' : err.message}`)
    }
    if (res.status === 429 && attempt < MAX_RETRIES) {
      const retryAfter = Number(res.headers.get('retry-after'))
      const waitMs = retryAfter > 0 ? retryAfter * 1000 : backoffMs(attempt)
      // Same deadline discipline as the local limiter above: skills.sh's
      // Retry-After can be tens of seconds, and an uncapped sleep here rides
      // the invocation straight past Vercel's hard 60s kill (a 504 with no
      // JSON body, no meta write — the worst way to end a pass). Throwing
      // the recognized rate-limit message instead lets the caller record
      // "this batch didn't complete" and retry it next invocation.
      if (deadlineAt && Date.now() + waitMs > deadlineAt) {
        throw new Error('rate-limit wait would exceed remaining time budget')
      }
      await sleep(waitMs)
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

/** The rate limiter's own bail-out (see createRateLimiter) — callers need to
 * tell "the window is exhausted for this invocation" apart from a genuinely
 * failed skill, because the two demand opposite responses: a failed skill is
 * recorded and skipped, but an exhausted window means NOTHING further can be
 * attempted this invocation and the current page/batch must NOT be marked
 * complete, or every skill after the exhaustion point silently falls out of
 * the pass (the first full-rescan attempt lost 5,064 of 5,492 curated items
 * exactly this way). */
function isRateLimitExhaustion(err) {
  return String(err?.message ?? err).includes('rate-limit wait would exceed')
}

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

/**
 * The incremental heart of the daily pass: one cheap Supabase id-lookup
 * splits a listing batch into skills we already have (refreshed with ZERO
 * skills.sh calls — the listing row itself carries the only field that
 * changes daily, `installs`) and genuinely new skills (full detail fetch).
 * Without this split, every daily rescan re-fetched all ~14k skill details
 * against a 540/min API cap — ~26 minutes of pure rate-limit budget to
 * mostly re-download unchanged data, which starved the pass and produced
 * the mass rate-limit failures above. With it, a steady-state daily pass
 * is ~100 listing calls plus details for only what's actually new.
 */
async function splitExistingNew(supabase, items, deadlineAt) {
  const existingIds = new Set()
  // 40 ids per lookup, not more: `.in()` serialises into the request URL,
  // and skill ids are long slash-y paths ("owner/repo/skill-name",
  // URL-encoded on top) — 500 of them built a URL past the server's length
  // limit and every lookup came back 400 Bad Request. 40 × ~90 encoded
  // chars ≈ 3.6KB, comfortably inside every common 8KB URL cap. The ids
  // are de-duplicated first because curated items repeat across owner
  // groups.
  //
  // The curated set needs ~137 of these lookups, so per-query latency is
  // multiplicative — this is why vercel.json pins the function to icn1
  // (Seoul), the same region as the Supabase project: from the default
  // iad1 the cross-Pacific round trips alone added ~40s and 504'd the
  // whole invocation. The deadline check is the backstop for the same
  // failure shape if the DB is ever slow anyway: bail out cleanly (caller
  // treats it as "this batch didn't complete", retried next invocation)
  // instead of sailing past the function's hard 60s kill.
  const storedInstalls = new Map()
  const uniqueIds = [...new Set(items.map((i) => i.id).filter(Boolean))]
  for (const ids of chunk(uniqueIds, 40)) {
    if (deadlineAt && Date.now() > deadlineAt) {
      throw new Error('existing-id lookup: time budget exhausted')
    }
    const { data, error } = await supabase.from('skills').select('id,installs').in('id', ids)
    if (error) throw new Error(`existing-id lookup: ${error.message}`)
    for (const row of data ?? []) {
      existingIds.add(row.id)
      storedInstalls.set(row.id, row.installs)
    }
  }
  // Return one entry per id (first occurrence wins) so downstream never
  // double-processes a skill that appeared in multiple curated groups.
  const byId = new Map()
  for (const item of items) if (item.id && !byId.has(item.id)) byId.set(item.id, item)
  const unique = [...byId.values()]
  const existingItems = unique.filter((i) => existingIds.has(i.id))
  return {
    existingItems,
    // Only rows whose install count actually moved need a write at all —
    // most don't on any given day, which keeps the refresh step's write
    // count (and its share of the time budget) proportional to real change
    // rather than to registry size.
    changedItems: existingItems.filter((i) => (i.installs ?? 0) !== storedInstalls.get(i.id)),
    newItems: unique.filter((i) => !existingIds.has(i.id)),
  }
}

/**
 * Refresh install counts for already-synced skills from listing data alone
 * — zero skills.sh calls. Plain per-row UPDATEs, never upsert: a partial
 * upsert of {id, installs} looked equivalent but is a real trap — Postgres
 * checks NOT NULL constraints on the INSERT tuple it forms BEFORE the
 * ON CONFLICT arbiter can divert to the UPDATE path, so every row failed
 * on the omitted `category` even though every row already existed. An
 * UPDATE has no insert tuple, so the failure mode is impossible rather
 * than merely guarded against. Callers pass only rows whose installs
 * actually changed (see splitExistingNew), keeping the per-row write count
 * small; the deadline check makes an unusually change-heavy day degrade
 * into "finish next invocation" instead of a 504.
 */
async function refreshExistingFromListing(supabase, items, deadlineAt) {
  if (items.length === 0) return { ok: true, refreshed: 0 }
  const now = new Date().toISOString()
  let refreshed = 0
  const failures = []
  for (const item of items) {
    if (deadlineAt && Date.now() > deadlineAt) {
      return { ok: false, refreshed, error: 'refresh: time budget exhausted' }
    }
    const { error } = await supabase
      .from('skills')
      .update({ installs: item.installs ?? 0, last_synced_at: now })
      .eq('id', item.id)
    if (error) failures.push(`${item.id}: ${error.message}`)
    else refreshed++
  }
  if (failures.length > 0) {
    return { ok: false, refreshed, error: `row failures: ${failures.slice(0, 3).join(' || ')}` }
  }
  return { ok: true, refreshed }
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
    return {
      ok: false,
      error: err.message,
      rateLimited: isRateLimitExhaustion(err),
      // A 404 detail for a listed skill means it was deleted upstream while
      // the listing still names it — permanent, not transient. Callers
      // tombstone these so they stop consuming rate-limit budget on every
      // future pass (the accumulated pool of them had grown past a full
      // per-minute window, which alone made passes uncompletable).
      notFound: String(err.message).includes('-> HTTP 404'),
    }
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

  const row = {
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
  }

  let { error } = await supabase
    .from('skills')
    .upsert(row, { onConflict: 'id', ignoreDuplicates: false })
    .select('id')

  // Distinct skills from different repos can share a (category, slug) pair
  // — e.g. two repos both shipping a "skill-creator" — and the table's
  // UNIQUE(category, slug) makes the second one permanently uninsertable
  // under its natural slug. Left as a plain failure these retry (and burn
  // a rate-limited detail fetch) on EVERY pass forever, and as they
  // accumulate they can eat an entire invocation's budget before any real
  // work starts. One retry under a deterministic hash-suffixed slug turns
  // them into ordinary rows instead: unique URL, found by search, and
  // counted as "existing" by every future pass.
  if (error?.message?.includes('skills_category_slug_key')) {
    ;({ error } = await supabase
      .from('skills')
      .upsert(
        { ...row, slug: `${row.slug}-${shortHash(item.id)}` },
        { onConflict: 'id', ignoreDuplicates: false },
      )
      .select('id'))
  }

  // .message, not the raw object: Supabase errors are plain objects whose
  // String() is "[object Object]", which is what the error log actually
  // showed the first time this mattered.
  return { ok: !error, error: error?.message }
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
  const tombstones = new Set(Array.isArray(meta?.tombstoned_ids) ? meta.tombstoned_ids : [])
  const newTombstones = []

  // The bug that left the registry stuck at a fixed count forever: once
  // both flags go true, EVERY future invocation skipped both branches
  // below unconditionally — nothing ever set them back to false, so a
  // skill added to skills.sh the day after the first full pass completed
  // would never be picked up, not on the next run, not ever. New skills
  // can also outrank existing ones on the leaderboard rather than only
  // appending at the tail, so resuming from the old cursorPage wouldn't
  // even be correct — a full re-pass from page 0 is what's actually
  // needed to guarantee nothing new is missed, not just an appended scan.
  // Gated on time-since-last-invocation (every call bumps last_synced_at,
  // not only ones that did real work, so this is really "idle for 20h",
  // not "20h since a completed pass" — that distinction doesn't matter
  // under the current twice-daily cadence, but would if some future extra
  // caller — a manual curl, a health check — started polling more often
  // than once every 20h) so the GitHub Actions loop driver's rapid repeat
  // calls within one run don't restart the whole scan every few seconds —
  // long enough to outlast one loop-driver session (up to ~5h), short
  // enough to guarantee a fresh pass every day regardless of which of the
  // two daily triggers fires it.
  // 16h, not the original 20h: still far above any single loop-driver
  // session (~5h) so rapid repeat calls within one run never re-trigger,
  // but low enough that a manual catch-up drive finishing at an odd hour
  // (like the one that un-stuck the registry) can't leave the next
  // scheduled cron inside the gate and silently skip a whole day's pass —
  // with the two daily triggers 23-24h apart, anything in (5h, 22h] gives
  // exactly one real pass per day.
  const RESCAN_INTERVAL_MS = 16 * 60 * 60 * 1000
  const msSinceLastSync = meta?.last_synced_at
    ? Date.now() - new Date(meta.last_synced_at).getTime()
    : Number.POSITIVE_INFINITY
  let rescanTriggered = cursorDone && curatedDone && msSinceLastSync > RESCAN_INTERVAL_MS
  if (rescanTriggered) {
    // Claim the reset atomically before acting on it: the two daily
    // triggers (this project's own vercel.json cron and the GitHub
    // Actions loop driver) call this endpoint independently with no
    // shared lock, so both could read the same idle-too-long state and
    // each decide to reset. The conditional update only succeeds for
    // whichever invocation gets there first — the loser sees 0 rows
    // matched, backs off, and this call falls through as a no-op instead
    // of running a second full page-0 rescan concurrently (wasteful
    // against skills.sh's shared rate limit, though not corrupting,
    // since every write downstream is an idempotent upsert either way).
    const { data: claimed } = await supabase
      .from('skills_sync_meta')
      .update({ cursor_page: 0, cursor_done: false, curated_done: false })
      .eq('cursor_done', true)
      .eq('curated_done', true)
      .select('id')
    if (!claimed || claimed.length === 0) {
      rescanTriggered = false
    }
  }
  if (rescanTriggered) {
    cursorPage = 0
    cursorDone = false
    curatedDone = false
  }

  let processed = 0
  let failed = 0
  let refreshed = 0
  let pagesThisRun = 0
  const errors = []
  const splitDebug = {}

  if (!curatedDone) {
    try {
      const curated = await fetchV1(token, '/skills/curated', deadlineAt)
      // The real shape is grouped by owner ({owner, featuredRepo, skills:
      // [...]}), not a flat list of skill items — each group's own `skills`
      // array is what actually matches the leaderboard's per-item shape
      // (id/slug/source/installs/isDuplicate). The curated set matters for
      // COVERAGE, not just ranking: the leaderboard paginates only ~9.6k
      // skills while the registry holds ~14k — roughly a third of the
      // registry is reachable only through curated.
      const groups = curated.data ?? curated.skills ?? []
      const items = groups
        .flatMap((group) => group.skills ?? [group])
        .filter((it) => !it.isDuplicate && !tombstones.has(it.id))

      const { existingItems, changedItems, newItems } = await splitExistingNew(
        supabase,
        items,
        deadlineAt,
      )
      // Split diagnostics, surfaced in the response: when the existing/new
      // classification goes wrong the failure mode downstream (mass detail
      // fetches, rate-limit exhaustion, duplicate-key inserts) hides the
      // actual cause. Sample ids make an id-format mismatch visible
      // immediately instead of needing a debugger on a serverless box.
      splitDebug.curated = {
        listed: items.length,
        existing: existingItems.length,
        changed: changedItems.length,
        new: newItems.length,
        sampleNewIds: newItems.slice(0, 3).map((i) => i.id),
      }
      const refresh = await refreshExistingFromListing(supabase, changedItems, deadlineAt)
      if (!refresh.ok) errors.push(`curated refresh: ${refresh.error}`)
      refreshed += refresh.refreshed

      let rateLimitedInBatch = 0
      const { completed } = await mapConcurrent(
        newItems,
        DETAIL_CONCURRENCY,
        async (item) => {
          let result
          try {
            result = await upsertSkillFromListing(supabase, token, item, deadlineAt)
          } catch (err) {
            result = { ok: false, error: err.message, rateLimited: isRateLimitExhaustion(err) }
          }
          if (result.ok) processed++
          else {
            failed++
            if (result.rateLimited) rateLimitedInBatch++
            if (result.notFound) newTombstones.push(item.id)
            if (result.error && errors.length < 20) errors.push(String(result.error))
          }
        },
        timeLeft,
      )
      // Done only when every item was attempted AND none of the failures
      // were the rate-limit window running out — an exhausted window means
      // the tail of the batch never really ran, so the next invocation must
      // retry curated rather than silently skip it (the first full-rescan
      // attempt lost 5,064 of 5,492 curated items to exactly this).
      curatedDone = completed && rateLimitedInBatch === 0
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
      const rawItems = listing.data ?? []
      const items = rawItems.filter((it) => !it.isDuplicate && !tombstones.has(it.id))
      // End-of-listing is judged on the RAW page: a page consisting
      // entirely of duplicates/tombstones is still a real page, not the
      // end of the leaderboard.
      if (rawItems.length === 0) {
        cursorDone = true
        break
      }

      // Unlike curated (whose try/catch wraps its whole block), this loop
      // body isn't inside one — a split/refresh failure here must break
      // WITHOUT advancing cursorPage, not bubble up as a 500.
      let newItems
      try {
        const split = await splitExistingNew(supabase, items, deadlineAt)
        newItems = split.newItems
        const refresh = await refreshExistingFromListing(supabase, split.changedItems, deadlineAt)
        if (!refresh.ok) errors.push(`page ${cursorPage + 1} refresh: ${refresh.error}`)
        refreshed += refresh.refreshed
      } catch (err) {
        errors.push(`page ${cursorPage + 1}: ${err.message}`)
        break
      }

      let rateLimitedInPage = 0
      const { completed } = await mapConcurrent(
        newItems,
        DETAIL_CONCURRENCY,
        async (item) => {
          let result
          try {
            result = await upsertSkillFromListing(supabase, token, item, deadlineAt)
          } catch (err) {
            result = { ok: false, error: err.message, rateLimited: isRateLimitExhaustion(err) }
          }
          if (result.ok) processed++
          else {
            failed++
            if (result.rateLimited) rateLimitedInPage++
            if (result.notFound) newTombstones.push(item.id)
            if (result.error && errors.length < 20) errors.push(String(result.error))
          }
        },
        timeLeft,
      )

      // Only advance past this page if every item on it was actually
      // attempted AND none failed purely on rate-limit exhaustion —
      // otherwise the next invocation must retry the SAME page
      // (cursorPage unchanged) rather than silently skip whatever this
      // page's batch didn't genuinely reach. Re-running a page is safe:
      // every write is an idempotent upsert.
      if (!completed || rateLimitedInPage > 0) break

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
    // Merged, never replaced: a concurrent invocation's additions can still
    // be lost to last-write-wins here, but a lost tombstone just means one
    // extra 404 attempt on some later pass, which re-tombstones it.
    tombstoned_ids: [...new Set([...tombstones, ...newTombstones])],
  })

  res.status(200).json({
    processed,
    failed,
    refreshed,
    pagesThisRun,
    cursorPage,
    cursorDone,
    curatedDone,
    rescanTriggered,
    totalSkills: count ?? 0,
    elapsedMs: Date.now() - startedAt,
    splitDebug,
    errors,
  })
}
