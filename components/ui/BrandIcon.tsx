// Deep imports on purpose: each icon's barrel (`@lobehub/icons/es/<Brand>`)
// re-exports Avatar/Combine variants that depend on @lobehub/ui and
// antd-style — a whole design system this site does not ship. The Mono and
// Color marks are dependency-free React SVG components, so importing them
// directly gets the official geometry without the framework.
import AnthropicMono from '@lobehub/icons/es/Anthropic/components/Mono'
import ClaudeColor from '@lobehub/icons/es/Claude/components/Color'
import ClaudeCodeColor from '@lobehub/icons/es/ClaudeCode/components/Color'
import CursorMono from '@lobehub/icons/es/Cursor/components/Mono'
import DalleColor from '@lobehub/icons/es/Dalle/components/Color'
import DeepMindColor from '@lobehub/icons/es/DeepMind/components/Color'
import ElevenLabsMono from '@lobehub/icons/es/ElevenLabs/components/Mono'
import FigmaColor from '@lobehub/icons/es/Figma/components/Color'
import FluxMono from '@lobehub/icons/es/Flux/components/Mono'
import GeminiColor from '@lobehub/icons/es/Gemini/components/Color'
import GithubCopilotMono from '@lobehub/icons/es/GithubCopilot/components/Mono'
import GrokMono from '@lobehub/icons/es/Grok/components/Mono'
import IdeogramMono from '@lobehub/icons/es/Ideogram/components/Mono'
import KlingColor from '@lobehub/icons/es/Kling/components/Color'
import LovableColor from '@lobehub/icons/es/Lovable/components/Color'
import MidjourneyMono from '@lobehub/icons/es/Midjourney/components/Mono'
import NanoBananaColor from '@lobehub/icons/es/NanoBanana/components/Color'
import OpenAIMono from '@lobehub/icons/es/OpenAI/components/Mono'
import PerplexityColor from '@lobehub/icons/es/Perplexity/components/Color'
import ReplitColor from '@lobehub/icons/es/Replit/components/Color'
import RunwayMono from '@lobehub/icons/es/Runway/components/Mono'
import SunoMono from '@lobehub/icons/es/Suno/components/Mono'
import V0Mono from '@lobehub/icons/es/V0/components/Mono'
import type { ComponentType, CSSProperties } from 'react'
import {
  siAirtable,
  siAngular,
  siBytedance,
  siDjango,
  siDocker,
  siFastapi,
  siFirebase,
  siFlutter,
  siFramer,
  siGithub,
  siGitlab,
  siGo,
  siGoogle,
  siGoogleanalytics,
  siGooglecloud,
  siGooglesearchconsole,
  siGraphql,
  siHubspot,
  siInstagram,
  siJavascript,
  siJest,
  siKotlin,
  siKubernetes,
  siLaravel,
  siMeta,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siNotion,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siRubyonrails,
  siRust,
  siShopify,
  siSquarespace,
  siStripe,
  siSupabase,
  siSvelte,
  siSwift,
  siTailwindcss,
  siTerraform,
  siTrello,
  siTypescript,
  siVercel,
  siVuedotjs,
  siWebflow,
  siWoocommerce,
  siWordpress,
  siX,
  siYoutube,
  siZapier,
} from 'simple-icons'

/**
 * Official brand marks for the AI tools the prompt library covers.
 *
 * Two sources, both shipping the real logo geometry (never a redrawn
 * lookalike): @lobehub/icons for AI-native brands (OpenAI, Claude, Cursor,
 * Midjourney, Kling…) and simple-icons for the general dev/social brands it
 * lacks (React, Next.js, X, YouTube…). LinkedIn's mark was removed from
 * simple-icons at the brand's request, so it renders via Lucide's
 * official-shape glyph in LinkedIn's brand blue.
 *
 * Brands whose Color variant exists render in full official color; brands
 * whose official mark IS monochrome (OpenAI, Cursor, X, Midjourney…) render
 * near-black — callers place logos on white chips so both kinds stay
 * accurate and legible in dark mode. A category with no single brand
 * (e.g. seo-geo, business-ops) returns null and callers fall back to the
 * category's Lucide icon — a neutral glyph beats the wrong company's mark.
 */

type LobeIconComponent = ComponentType<{
  size?: number | string
  className?: string
  style?: CSSProperties
}>

type BrandEntry =
  | { kind: 'lobe'; Component: LobeIconComponent; mono?: true }
  | { kind: 'si'; icon: { title: string; hex: string; path: string } }

/**
 * LinkedIn's official "in" mark, inlined: simple-icons removed it at the
 * brand's request and Lucide dropped brand icons entirely, so this is the
 * canonical path (from simple-icons' historical releases) in LinkedIn's
 * official brand blue.
 */
const LINKEDIN_ICON = {
  title: 'LinkedIn',
  hex: '0A66C2',
  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
}

const BRANDS: Record<string, BrandEntry> = {
  // ---- AI models & assistants ----
  chatgpt: { kind: 'lobe', Component: OpenAIMono, mono: true },
  claude: { kind: 'lobe', Component: ClaudeColor },
  'claude-code': { kind: 'lobe', Component: ClaudeCodeColor },
  cursor: { kind: 'lobe', Component: CursorMono, mono: true },
  'github-copilot': { kind: 'lobe', Component: GithubCopilotMono, mono: true },
  gemini: { kind: 'lobe', Component: GeminiColor },
  perplexity: { kind: 'lobe', Component: PerplexityColor },
  grok: { kind: 'lobe', Component: GrokMono, mono: true },
  // ---- image & video models ----
  midjourney: { kind: 'lobe', Component: MidjourneyMono, mono: true },
  'nano-banana': { kind: 'lobe', Component: NanoBananaColor },
  flux: { kind: 'lobe', Component: FluxMono, mono: true },
  ideogram: { kind: 'lobe', Component: IdeogramMono, mono: true },
  dalle: { kind: 'lobe', Component: DalleColor },
  // Veo is a Google DeepMind model — the parent brand's mark is the honest
  // choice; there is no separate official Veo glyph.
  veo: { kind: 'lobe', Component: DeepMindColor },
  kling: { kind: 'lobe', Component: KlingColor },
  runway: { kind: 'lobe', Component: RunwayMono, mono: true },
  suno: { kind: 'lobe', Component: SunoMono, mono: true },
  elevenlabs: { kind: 'lobe', Component: ElevenLabsMono, mono: true },
  // ---- app builders ----
  lovable: { kind: 'lobe', Component: LovableColor },
  v0: { kind: 'lobe', Component: V0Mono, mono: true },
  replit: { kind: 'lobe', Component: ReplitColor },
  // ---- design & dev ----
  figma: { kind: 'lobe', Component: FigmaColor },
  framer: { kind: 'si', icon: siFramer },
  react: { kind: 'si', icon: siReact },
  nextjs: { kind: 'si', icon: siNextdotjs },
  python: { kind: 'si', icon: siPython },
  vercel: { kind: 'si', icon: siVercel },
  github: { kind: 'si', icon: siGithub },
  gitlab: { kind: 'si', icon: siGitlab },
  // ---- Skills Library tech-stack marks (frameworks, languages, infra,
  // databases) — a real skill's `tags` name these directly, so these back
  // `brandForTag` below rather than the AI-tool matching `brandForTool` does. ----
  vue: { kind: 'si', icon: siVuedotjs },
  angular: { kind: 'si', icon: siAngular },
  svelte: { kind: 'si', icon: siSvelte },
  typescript: { kind: 'si', icon: siTypescript },
  javascript: { kind: 'si', icon: siJavascript },
  nodejs: { kind: 'si', icon: siNodedotjs },
  go: { kind: 'si', icon: siGo },
  rust: { kind: 'si', icon: siRust },
  swift: { kind: 'si', icon: siSwift },
  kotlin: { kind: 'si', icon: siKotlin },
  flutter: { kind: 'si', icon: siFlutter },
  django: { kind: 'si', icon: siDjango },
  fastapi: { kind: 'si', icon: siFastapi },
  rails: { kind: 'si', icon: siRubyonrails },
  laravel: { kind: 'si', icon: siLaravel },
  graphql: { kind: 'si', icon: siGraphql },
  docker: { kind: 'si', icon: siDocker },
  kubernetes: { kind: 'si', icon: siKubernetes },
  terraform: { kind: 'si', icon: siTerraform },
  'google-cloud': { kind: 'si', icon: siGooglecloud },
  postgresql: { kind: 'si', icon: siPostgresql },
  mongodb: { kind: 'si', icon: siMongodb },
  redis: { kind: 'si', icon: siRedis },
  supabase: { kind: 'si', icon: siSupabase },
  firebase: { kind: 'si', icon: siFirebase },
  stripe: { kind: 'si', icon: siStripe },
  tailwindcss: { kind: 'si', icon: siTailwindcss },
  jest: { kind: 'si', icon: siJest },
  // ---- platforms & social ----
  google: { kind: 'si', icon: siGoogle },
  'google-search-console': { kind: 'si', icon: siGooglesearchconsole },
  'google-analytics': { kind: 'si', icon: siGoogleanalytics },
  youtube: { kind: 'si', icon: siYoutube },
  instagram: { kind: 'si', icon: siInstagram },
  'x-twitter': { kind: 'si', icon: siX },
  linkedin: { kind: 'si', icon: LINKEDIN_ICON },
  // ---- CMS, e-commerce & site builders ----
  wordpress: { kind: 'si', icon: siWordpress },
  shopify: { kind: 'si', icon: siShopify },
  webflow: { kind: 'si', icon: siWebflow },
  squarespace: { kind: 'si', icon: siSquarespace },
  woocommerce: { kind: 'si', icon: siWoocommerce },
  // ---- productivity & business ----
  notion: { kind: 'si', icon: siNotion },
  zapier: { kind: 'si', icon: siZapier },
  airtable: { kind: 'si', icon: siAirtable },
  trello: { kind: 'si', icon: siTrello },
  hubspot: { kind: 'si', icon: siHubspot },
  // ---- companies (as opposed to their individual products above) — used
  // where content names the crawler operator rather than a specific model,
  // e.g. the AI Visibility Checker's per-bot table. ----
  openai: { kind: 'lobe', Component: OpenAIMono, mono: true },
  anthropic: { kind: 'lobe', Component: AnthropicMono, mono: true },
  meta: { kind: 'si', icon: siMeta },
  bytedance: { kind: 'si', icon: siBytedance },
  // Common Crawl has no widely-distributed official SVG mark in either
  // source library — omitted rather than substituting a guess. Callers
  // fall back to a neutral icon, which is the honest choice here.
}

/**
 * Maps the exact company names AI_BOTS uses (lib/tools/ai-visibility-checker/
 * logic.ts) to a brand key. A separate table from `brandForTool` because
 * "OpenAI" here means the company that runs GPTBot, not a specific model —
 * conflating the two tables would make chatgpt's product icon (OpenAI's own
 * mark, so harmless today) silently wrong if a future entry needs to
 * distinguish a company from one of its products.
 */
const COMPANY_BRANDS: Readonly<Record<string, string>> = {
  OpenAI: 'openai',
  Anthropic: 'anthropic',
  Perplexity: 'perplexity',
  Google: 'google',
  ByteDance: 'bytedance',
  Meta: 'meta',
}

export function brandForCompany(company: string): string | null {
  return COMPANY_BRANDS[company] ?? null
}

/** Category slugs that map straight onto a single brand's mark. */
export function categoryBrand(categorySlug: string): string | null {
  return categorySlug in BRANDS ? categorySlug : null
}

/**
 * Fuzzy-matches a free-text `targetTools` entry ("ChatGPT (GPT-5.1)",
 * "Nano Banana / Gemini 3.1 Flash Image") to a brand key. Order matters:
 * compound names ("Claude Code", "Nano Banana") must win over their
 * parent-brand substrings.
 */
const TOOL_PATTERNS: readonly (readonly [RegExp, string])[] = [
  [/claude\s*code/i, 'claude-code'],
  [/claude|anthropic/i, 'claude'],
  [/nano\s*banana/i, 'nano-banana'],
  [/gemini|ai overviews/i, 'gemini'],
  [/chatgpt|openai|\bgpt\b|gpt-\d/i, 'chatgpt'],
  [/copilot/i, 'github-copilot'],
  [/cursor/i, 'cursor'],
  [/perplexity|comet/i, 'perplexity'],
  [/grok/i, 'grok'],
  [/midjourney/i, 'midjourney'],
  [/ideogram/i, 'ideogram'],
  [/runway/i, 'runway'],
  [/kling/i, 'kling'],
  [/flux/i, 'flux'],
  [/dall[·.\s-]?e/i, 'dalle'],
  [/\bveo\b/i, 'veo'],
  [/suno/i, 'suno'],
  [/elevenlabs/i, 'elevenlabs'],
  [/lovable/i, 'lovable'],
  [/\bv0\b/i, 'v0'],
  [/replit/i, 'replit'],
  [/figma/i, 'figma'],
  [/framer/i, 'framer'],
  [/react/i, 'react'],
  [/next\.?js/i, 'nextjs'],
  [/python/i, 'python'],
  [/linkedin/i, 'linkedin'],
  [/youtube/i, 'youtube'],
  [/instagram/i, 'instagram'],
  [/twitter|^x$|\bx\s*\(/i, 'x-twitter'],
  [/google/i, 'google'],
]

export function brandForTool(toolName: string): string | null {
  for (const [pattern, brand] of TOOL_PATTERNS) {
    if (pattern.test(toolName)) return brand
  }
  return null
}

/** Skill `tags` name real tech stacks directly (a repo's own topics/keywords,
 * not free-text prose like `targetTools`), so this matches on exact/near-exact
 * tag spelling rather than `TOOL_PATTERNS`' looser regexes. Order matters for
 * the same reason as `TOOL_PATTERNS`: compound names must win over substrings
 * (e.g. "nextjs" over a bare "react" match would be wrong the other way). */
const TAG_PATTERNS: readonly (readonly [RegExp, string])[] = [
  [/^next\.?js$/i, 'nextjs'],
  [/^react$/i, 'react'],
  [/^vue(\.?js)?$/i, 'vue'],
  [/^angular$/i, 'angular'],
  [/^svelte(kit)?$/i, 'svelte'],
  [/^typescript$/i, 'typescript'],
  [/^javascript$/i, 'javascript'],
  [/^node(\.?js)?$/i, 'nodejs'],
  [/^python$/i, 'python'],
  [/^go(lang)?$/i, 'go'],
  [/^rust$/i, 'rust'],
  [/^swift$/i, 'swift'],
  [/^kotlin$/i, 'kotlin'],
  [/^flutter$/i, 'flutter'],
  [/^django$/i, 'django'],
  [/^fastapi$/i, 'fastapi'],
  [/^(ruby[\s-]?on[\s-]?)?rails$/i, 'rails'],
  [/^laravel$/i, 'laravel'],
  [/^graphql$/i, 'graphql'],
  [/^docker$/i, 'docker'],
  [/^kubernetes|k8s$/i, 'kubernetes'],
  [/^terraform$/i, 'terraform'],
  [/^gcp|google[\s-]?cloud$/i, 'google-cloud'],
  [/^postgres(ql)?$/i, 'postgresql'],
  [/^mongo(db)?$/i, 'mongodb'],
  [/^redis$/i, 'redis'],
  [/^supabase$/i, 'supabase'],
  [/^firebase$/i, 'firebase'],
  [/^stripe$/i, 'stripe'],
  [/^tailwind(css)?$/i, 'tailwindcss'],
  [/^jest$/i, 'jest'],
  [/^figma$/i, 'figma'],
  [/^git$/i, 'github'],
  [/^git[\s-]?hub$/i, 'github'],
  [/^git[\s-]?lab$/i, 'gitlab'],
  [/^vercel$/i, 'vercel'],
]

export function brandForTag(tag: string): string | null {
  for (const [pattern, brand] of TAG_PATTERNS) {
    if (pattern.test(tag)) return brand
  }
  return null
}

export function hasBrand(brand: string): boolean {
  return brand in BRANDS
}

export function BrandIcon({
  brand,
  size = 20,
  className,
}: {
  brand: string
  size?: number
  className?: string
}) {
  const entry = BRANDS[brand]
  if (!entry) return null

  if (entry.kind === 'si') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill={`#${entry.icon.hex === '000000' ? '111111' : entry.icon.hex}`}
        aria-hidden="true"
        focusable="false"
      >
        <path d={entry.icon.path} />
      </svg>
    )
  }

  const Mark = entry.Component
  return (
    <Mark
      size={size}
      className={className}
      style={entry.mono ? { color: '#111111' } : undefined}
      aria-hidden="true"
    />
  )
}
