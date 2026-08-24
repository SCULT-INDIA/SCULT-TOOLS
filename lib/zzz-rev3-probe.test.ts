import { gzipSync } from 'node:zlib'
import { describe, it } from 'vitest'
import { PROMPTS } from './prompts/registry'
import { PROMPT_INDEX, TOOL_ENTRIES } from './search'
import { rankSearch } from './search-client'
import type { PromptSearchEntry, ToolSearchEntry } from './search-client'
import { TOOLS } from './tools/registry'

const gz = (s: string) => gzipSync(Buffer.from(s, 'utf8'), { level: 6 }).length

/** Exactly what the proposal says: rebuild haystack from name+categoryName+slug. */
function proposalHaystack(e: { name: string; categoryName: string; slug: string }): string {
  return [e.name, e.categoryName, e.slug].join(' ').toLowerCase()
}

describe('REV3 PROBE — proposal: drop haystack, rebuild from name+categoryName+slug', () => {
  it('measures information loss', () => {
    const all = [...TOOL_ENTRIES, ...PROMPT_INDEX]
    let realChars = 0
    let rebuiltChars = 0
    let lostTokens = 0
    let totalTokens = 0
    for (const e of all) {
      const real = e.haystack
      const rebuilt = proposalHaystack(e)
      realChars += real.length
      rebuiltChars += rebuilt.length
      const realSet = new Set(real.split(/\s+/).filter(Boolean))
      const rebuiltSet = new Set(rebuilt.split(/\s+/).filter(Boolean))
      totalTokens += realSet.size
      for (const t of realSet) if (!rebuiltSet.has(t)) lostTokens++
    }
    console.log('REAL haystack chars     ', realChars)
    console.log('REBUILT haystack chars  ', rebuiltChars)
    console.log(
      'DISTINCT TOKENS LOST    ',
      lostTokens,
      'of',
      totalTokens,
      `(${((lostTokens / totalTokens) * 100).toFixed(1)}%)`,
    )
  })

  it('re-runs the real search suite queries against the proposal index', () => {
    const slimTools: ToolSearchEntry[] = TOOL_ENTRIES.map((e) => ({
      ...e,
      haystack: proposalHaystack(e),
    }))
    const slimPrompts: PromptSearchEntry[] = PROMPT_INDEX.map((e) => ({
      ...e,
      haystack: proposalHaystack(e),
    }))

    const cases: [string, string][] = [
      ['oklch', 'color-palette-generator'],
      ['invoice', 'invoice-generator'],
      ['json-formatter', 'json-formatter'],
      ['slogan', 'slogan-generator'],
    ]
    for (const [q, want] of cases) {
      const now = rankSearch(TOOL_ENTRIES, PROMPT_INDEX, q).map((h) => h.slug)
      const after = rankSearch(slimTools, slimPrompts, q).map((h) => h.slug)
      console.log(
        `query "${q}" -> want ${want} | NOW ${now.includes(want)} | AFTER ${after.includes(want)}`,
      )
    }

    // "finds every tool by its own title" — search.test.ts:152
    let toolTitleFail = 0
    for (const t of TOOLS) {
      const hits = rankSearch(slimTools, slimPrompts, t.title).map((h) => h.slug)
      if (!hits.includes(t.slug)) toolTitleFail++
    }
    console.log('TOOLS unreachable by their own title AFTER:', toolTitleFail, '/', TOOLS.length)

    // "finds every prompt by its own title" — search.test.ts:163
    let promptTitleFail = 0
    const failSamples: string[] = []
    for (const p of PROMPTS) {
      const hits = rankSearch(slimTools, slimPrompts, p.title).map((h) => h.href)
      if (!hits.includes(`/prompts/${p.category}/${p.slug}`)) {
        promptTitleFail++
        if (failSamples.length < 5) failSamples.push(p.title)
      }
    }
    console.log(
      'PROMPTS unreachable by their own title AFTER:',
      promptTitleFail,
      '/',
      PROMPTS.length,
      failSamples,
    )

    // Real-world tag / targetTool queries that only the haystack carries.
    for (const q of ['midjourney', 'chatgpt', 'seo', 'typescript', 'landing page', 'resume']) {
      const now = rankSearch(TOOL_ENTRIES, PROMPT_INDEX, q).length
      const after = rankSearch(slimTools, slimPrompts, q).length
      console.log(`query "${q}": hits NOW=${now} AFTER=${after}`)
    }
  })

  it('checks the proposal href claim: is `category` present on prompt entries?', () => {
    const sample = PROMPT_INDEX.find((e) => e.kind === 'prompt')
    console.log('prompt entry keys:', Object.keys(sample ?? {}))
    console.log('has `category`?', 'category' in (sample ?? {}))
  })

  it('checks the proposal arithmetic', () => {
    const rawIndex = JSON.stringify([...TOOL_ENTRIES, ...PROMPT_INDEX])
    console.log('raw index chars', rawIndex.length, 'gz', gz(rawIndex))
    const slim = JSON.stringify(
      [...TOOL_ENTRIES, ...PROMPT_INDEX].map((e) => {
        const { haystack: _h, href: _hr, ...rest } = e as Record<string, unknown> & {
          haystack: string
          href: string
        }
        return rest
      }),
    )
    console.log('drop haystack+href chars', slim.length, 'gz', gz(slim))
  })
})
