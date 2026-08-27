import { arch, platform } from 'node:os'
import { VERSION } from './version.js'

/**
 * The one HTTP surface the CLI talks to: tools.scult.in's /api/cli/v1.
 * No secrets anywhere in this package — the server owns every key.
 *
 * Every request carries `User-Agent: scult-cli/<version> (<os>; <arch>)
 * node/<version>` (standard HTTP client hygiene; also what the server's
 * usage measurement parses) and, unless telemetry is off, the anonymous
 * random `x-scult-cid` header so "unique clients" is countable without
 * identity.
 */

export interface ApiOptions {
  baseUrl: string
  cid?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly retryAfterSeconds?: number
  constructor(message: string, status: number, retryAfterSeconds?: number) {
    super(message)
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
  }
}

export function userAgent(): string {
  return `scult-cli/${VERSION} (${platform()}; ${arch()}) node/${process.versions.node}`
}

export function resolveBaseUrl(flagValue: string | undefined): string {
  const raw = flagValue || process.env.SCULT_CLI_API || 'https://tools.scult.in'
  return raw.replace(/\/+$/, '')
}

async function request<T>(options: ApiOptions, path: string): Promise<T> {
  const headers: Record<string, string> = { 'user-agent': userAgent() }
  if (options.cid) headers['x-scult-cid'] = options.cid

  let response: Response
  try {
    response = await fetch(`${options.baseUrl}${path}`, {
      headers,
      signal: AbortSignal.timeout(20_000),
    })
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    throw new ApiError(
      `Could not reach ${options.baseUrl} (${reason}). Check your connection, or point --api at a reachable server.`,
      0,
    )
  }

  const body = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | null
  if (!response.ok) {
    const retryAfter = Number(response.headers.get('retry-after'))
    throw new ApiError(
      body?.error ?? `Request failed with HTTP ${response.status}.`,
      response.status,
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : undefined,
    )
  }
  if (body === null) throw new ApiError('Server returned an unreadable response.', 502)
  return body
}

// ── Typed endpoint wrappers ────────────────────────────────────────────────

export interface PromptSearchHit {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
}

export interface PromptDetail {
  slug: string
  title: string
  description: string
  category: string
  categoryName: string
  promptText: string
  variables: { name: string; description: string; example: string; required: boolean }[]
  targetTools: string[]
  tags: string[]
  whyItWorks: string
  exampleOutput?: string
  verifiedAgainst: { tool: string; version: string; date: string }[]
  changelog: { date: string; note: string }[]
  url: string
}

export interface PromptCategories {
  total: number
  groups: { slug: string; name: string }[]
  categories: {
    slug: string
    group: string
    name: string
    blurb: string
    count: number
  }[]
}

export interface SkillSearchHit {
  slug: string
  name: string
  description: string
  category: string
  installs: number
  source: string
}

export interface SkillDetail {
  slug: string
  name: string
  description: string
  category: string
  licenseGated: boolean
  license?: string
  installs?: number
  source?: string
  sourceUrl: string
  note?: string
  format?: string
  filename?: string
  content?: string
}

export interface SkillCategories {
  total: number
  categories: { slug: string; name: string; blurb: string; count: number }[]
}

export function searchPrompts(
  options: ApiOptions,
  query: string,
  category: string | undefined,
  limit: number,
): Promise<{ results: PromptSearchHit[] }> {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  if (category) params.set('category', category)
  return request(options, `/api/cli/v1/prompts/search?${params}`)
}

export function getPrompt(
  options: ApiOptions,
  slug: string,
): Promise<{ prompt: PromptDetail }> {
  return request(options, `/api/cli/v1/prompts/${encodeURIComponent(slug)}`)
}

export function promptCategories(options: ApiOptions): Promise<PromptCategories> {
  return request(options, '/api/cli/v1/prompts/categories')
}

export function searchSkills(
  options: ApiOptions,
  query: string,
  category: string | undefined,
  limit: number,
): Promise<{ results: SkillSearchHit[] }> {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  if (category) params.set('category', category)
  return request(options, `/api/cli/v1/skills/search?${params}`)
}

export function getSkill(
  options: ApiOptions,
  slug: string,
  format: string,
): Promise<{ skill: SkillDetail }> {
  const params = new URLSearchParams({ format })
  return request(options, `/api/cli/v1/skills/${encodeURIComponent(slug)}?${params}`)
}

export function skillCategories(options: ApiOptions): Promise<SkillCategories> {
  return request(options, '/api/cli/v1/skills/categories')
}

/** The one-time install ping. Fire-and-forget with a short timeout — a
 * telemetry failure must never surface to the user. */
export async function sendInstallPing(options: ApiOptions): Promise<boolean> {
  try {
    const headers: Record<string, string> = {
      'user-agent': userAgent(),
      'content-type': 'application/json',
    }
    if (options.cid) headers['x-scult-cid'] = options.cid
    const response = await fetch(`${options.baseUrl}/api/cli/v1/events`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ type: 'install' }),
      signal: AbortSignal.timeout(2000),
    })
    return response.ok
  } catch {
    return false
  }
}
