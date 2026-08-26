import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import QRCode from 'qrcode'
import { z } from 'zod'
import { runAiVisibilityCheck } from '@/app/api/ai-visibility/route'
import { isSpeedTestApiError, runSpeedTest } from '@/app/api/speed-test/route'
import { BLOG_POSTS, getBlogPost } from '@/lib/blog/registry'
import type { Inline } from '@/lib/blog/types'
import { GUIDES, getGuide } from '@/lib/guides/registry'
import {
  getPromptCategory,
  PROMPT_CATEGORIES,
  PROMPT_GROUPS,
} from '@/lib/prompts/categories'
import { getPrompt, PROMPTS } from '@/lib/prompts/registry'
import { checkRateLimit } from '@/lib/rate-limit'
import { getSkillCategory, SKILL_CATEGORIES } from '@/lib/skills/categories'
import { getAllCategoryCounts, getSkill, searchSkills } from '@/lib/skills/db'
import type { SkillCategorySlug } from '@/lib/skills/types'
import { isApiError } from '@/lib/tools/ai-visibility-checker/logic'
import {
  createRng,
  generateBatch,
  type StyleId,
} from '@/lib/tools/business-name-generator/logic'
import {
  generatePalette,
  type Harmony,
  type TokenFormat,
  toTokens,
} from '@/lib/tools/color-palette-generator/logic'
import {
  buildSignatureHtml,
  buildSignatureText,
  type SignatureFields,
  type SignatureTemplate,
} from '@/lib/tools/email-signature-generator/logic'
import { buildFaqSchema, type FaqPair } from '@/lib/tools/faq-schema-generator/logic'
import {
  buildHtmlSnippet,
  buildIco,
  buildWebmanifest,
  FAVICON_MAX_SOURCE_BYTES,
  isHexColor,
} from '@/lib/tools/favicon-generator/logic'
import {
  renderFaviconSet,
  type TileShape,
} from '@/lib/tools/favicon-generator/server-render'
import {
  computeInvoice,
  formatMoney,
  isCurrencyCode,
} from '@/lib/tools/invoice-generator/logic'
import {
  formatJson,
  type IndentOption,
  minifyJson,
  repairJson,
} from '@/lib/tools/json-formatter/logic'
import {
  calculateMarketingRoi,
  formatInr,
  formatMultiple,
  formatPercent,
} from '@/lib/tools/marketing-roi-calculator/logic'
import { buildQrPayload, type QrPayloadInput } from '@/lib/tools/qr-code-generator/logic'
import { TOOLS } from '@/lib/tools/registry'
import {
  buildSchema,
  getSchemaType,
  type SchemaTypeId,
} from '@/lib/tools/schema-markup-generator/logic'
import {
  createSeededRng,
  generateSlogans,
  type Tone,
} from '@/lib/tools/slogan-generator/logic'
import { buildUtmUrl, type UtmInput } from '@/lib/tools/utm-builder/logic'
import { analyzeText, bigramDensity } from '@/lib/tools/word-counter/logic'
import { currentClientIp } from './request-context'

// ---------------------------------------------------------------------------
// Rate limiting — two buckets, both keyed `mcp:` so they never share a quota
// with the website's own `ai-visibility:${ip}` / `speed-test:${ip}` limits.
// Read via AsyncLocalStorage (request-context.ts) since registerTool's
// handler signature carries no request/IP of its own.
// ---------------------------------------------------------------------------

const MCP_WINDOW_MS = 60_000
const MCP_GENERAL_MAX = 30
const MCP_HEAVY_MAX = 6
const MCP_EXTERNAL_MAX = 3

type ToolResult = {
  content: Array<
    { type: 'text'; text: string } | { type: 'image'; data: string; mimeType: string }
  >
  isError?: boolean
}

/**
 * Standard MCP tool annotations, shared by every registration below. All of
 * this server's tools are read-only (none mutates anything a caller could
 * observe later) and non-destructive; the split that matters to a client is
 * whether the tool reaches out to the open web on the caller's behalf.
 * Deliberately NOT claiming idempotentHint globally: the generator tools
 * seed their RNG from the clock when no seed is given.
 */
const PURE = { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
const OPEN_WORLD = { readOnlyHint: true, destructiveHint: false, openWorldHint: true }

function text(value: unknown): ToolResult {
  return {
    content: [
      {
        type: 'text',
        text: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
      },
    ],
  }
}

function errorText(message: string): ToolResult {
  return { content: [{ type: 'text', text: message }], isError: true }
}

/** Names the tripped bucket and its limit, not just "rate limited" — the
 * caller is an agent that can actually act on "which budget, how big, how
 * long", e.g. by batching lookups or switching tools. */
function rateLimited(
  bucket: 'general' | 'heavy' | 'external',
  max: number,
  retryAfterSeconds: number,
): ToolResult {
  return errorText(
    `Rate limited (${bucket} bucket: ${max} calls/min per client) — retry in ${retryAfterSeconds}s.`,
  )
}

/** Gate for every pure-compute/lookup tool — generous, just stops a runaway loop. */
function checkGeneral(): ToolResult | undefined {
  const rl = checkRateLimit(
    `mcp:general:${currentClientIp()}`,
    MCP_GENERAL_MAX,
    MCP_WINDOW_MS,
  )
  return rl.allowed
    ? undefined
    : rateLimited('general', MCP_GENERAL_MAX, rl.retryAfterSeconds)
}

/** Gate for the heaviest pure-compute tool (favicon rendering: a multi-size
 * raster pipeline over a caller-supplied image). Cheaper than the external
 * APIs but ~100x the CPU of any lookup tool — it gets its own, tighter
 * budget so a favicon loop can't monopolise the instance while staying
 * inside the general bucket. */
function checkHeavy(): ToolResult | undefined {
  const rl = checkRateLimit(
    `mcp:heavy:${currentClientIp()}`,
    MCP_HEAVY_MAX,
    MCP_WINDOW_MS,
  )
  return rl.allowed
    ? undefined
    : rateLimited('heavy', MCP_HEAVY_MAX, rl.retryAfterSeconds)
}

/** Gate for the 2 tools that call a paid/rate-limited third-party API — stricter
 * than the website's own limit on purpose, per the user's explicit decision. */
function checkExternal(): ToolResult | undefined {
  const rl = checkRateLimit(
    `mcp:external:${currentClientIp()}`,
    MCP_EXTERNAL_MAX,
    MCP_WINDOW_MS,
  )
  return rl.allowed
    ? undefined
    : rateLimited('external', MCP_EXTERNAL_MAX, rl.retryAfterSeconds)
}

/** Hex colour string for schema-level validation — the QR/favicon renderers
 * receive these verbatim as library options, so the schema is where a junk
 * value gets stopped. */
const hexColor = () =>
  z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Expected a hex colour like #4B20DE')

const SCHEMA_TYPE_IDS: readonly SchemaTypeId[] = [
  'Article',
  'Organization',
  'LocalBusiness',
  'Product',
  'Person',
  'Event',
  'WebSite',
  'BreadcrumbList',
  'HowTo',
]

/**
 * Registers every MCP tool tools.scult.in exposes — the site's tools' pure
 * logic modules called unchanged, plus Prompt Library and Skills Library search.
 * Passed to `createMcpHandler` in `app/api/[transport]/route.ts`.
 */
export function registerTools(server: McpServer): void {
  // ── Discovery ────────────────────────────────────────────────────────────

  server.registerTool(
    'list_site_tools',
    {
      title: 'List Site Tools',
      description:
        "Catalogue of every tool on tools.scult.in — slug, title, one-line description, category, and the tool's page URL. The MCP tools here mirror a subset of these; this list is the map of everything the site itself offers.",
      annotations: PURE,
      inputSchema: {},
    },
    async () => {
      const limited = checkGeneral()
      if (limited) return limited
      return text(
        TOOLS.map((t) => ({
          slug: t.slug,
          title: t.title,
          description: t.description,
          category: t.category,
          url: `https://tools.scult.in/${t.category}/${t.slug}`,
        })),
      )
    },
  )

  // ── Wave 1 — pure-compute tools, zero new I/O ──────────────────────────

  server.registerTool(
    'generate_schema_markup',
    {
      title: 'Generate Schema Markup',
      description:
        "Build JSON-LD structured data for one of nine schema.org types (Article, Organization, LocalBusiness, Product, Person, Event, WebSite, BreadcrumbList, HowTo). Returns the JSON-LD object plus advisory warnings for missing/malformed fields Google's rich results require.",
      annotations: PURE,
      inputSchema: {
        schemaType: z
          .enum(SCHEMA_TYPE_IDS as [SchemaTypeId, ...SchemaTypeId[]])
          .describe('Which schema.org type to build'),
        values: z
          .record(
            z.string().max(64),
            z.union([
              z.string().max(4000),
              z.array(z.record(z.string().max(64), z.string().max(2000))).max(50),
            ]),
          )
          .refine((v) => Object.keys(v).length <= 40, 'At most 40 fields')
          .describe(
            "Field values keyed by field id (see the type's fields). Scalar fields are strings; repeatable fields (e.g. sameAs, steps, crumbs) are arrays of row objects.",
          ),
      },
    },
    async ({ schemaType, values }) => {
      const limited = checkGeneral()
      if (limited) return limited
      if (getSchemaType(schemaType) === undefined)
        return errorText(`Unknown schema type "${schemaType}".`)
      const result = buildSchema(schemaType, values)
      return text({ jsonLd: result.jsonLd, warnings: result.warnings })
    },
  )

  server.registerTool(
    'generate_faq_schema',
    {
      title: 'Generate FAQ Schema',
      description:
        'Build a FAQPage JSON-LD block plus a visible HTML details/summary block from question/answer pairs (Google requires the marked-up Q&A to also appear on the page, not just in schema).',
      annotations: PURE,
      inputSchema: {
        pairs: z
          .array(
            z.object({ question: z.string().max(500), answer: z.string().max(4000) }),
          )
          .min(1)
          .max(50)
          .describe('Ordered Q&A pairs'),
      },
    },
    async ({ pairs }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const result = buildFaqSchema(pairs as readonly FaqPair[])
      return text({ jsonLd: result.jsonLd, html: result.html, warnings: result.warnings })
    },
  )

  server.registerTool(
    'build_utm_url',
    {
      title: 'Build UTM Campaign URL',
      description:
        'Attach utm_source/medium/campaign/id/term/content parameters to a destination URL the way GA4 expects to read them, flagging casing/whitespace mistakes that fragment a campaign across report rows.',
      annotations: PURE,
      inputSchema: {
        url: z.string().max(2000).describe('Destination URL to tag'),
        source: z.string().max(200).optional(),
        medium: z.string().max(200).optional(),
        campaign: z.string().max(200).optional(),
        campaignId: z.string().max(200).optional(),
        term: z.string().max(200).optional(),
        content: z.string().max(200).optional(),
        lowercase: z
          .boolean()
          .optional()
          .describe('Lowercase and hyphenate every value (default true)'),
      },
    },
    async (input) => {
      const limited = checkGeneral()
      if (limited) return limited
      const result = buildUtmUrl(input as UtmInput)
      return text(result)
    },
  )

  server.registerTool(
    'calculate_marketing_roi',
    {
      title: 'Calculate Marketing ROI',
      description:
        'Compute campaign ROI and ROAS side by side from spend, attributed revenue and gross margin — surfaces campaigns with a healthy-looking ROAS that are actually losing money once margin is applied.',
      annotations: PURE,
      inputSchema: {
        // .finite(): plain z.number() admits Infinity, which sails through
        // arithmetic into "Infinity%" strings in the formatted output.
        spend: z
          .number()
          .finite()
          .min(0)
          .max(1e15)
          .describe('Campaign ad spend in rupees'),
        revenue: z
          .number()
          .finite()
          .min(0)
          .max(1e15)
          .describe('Revenue attributed to the campaign, in rupees'),
        marginPercent: z
          .number()
          .finite()
          .min(0)
          .max(100)
          .describe('Gross margin as a percentage of revenue, 0-100'),
        otherCosts: z
          .number()
          .finite()
          .min(0)
          .max(1e15)
          .optional()
          .describe('Tools/agency/creative costs in rupees, default 0'),
      },
    },
    async (inputs) => {
      const limited = checkGeneral()
      if (limited) return limited
      const result = calculateMarketingRoi(inputs)
      if (!result.ok) return errorText(result.error)
      return text({
        ...result,
        roiFormatted: formatPercent(result.roiPercent),
        roasFormatted: formatMultiple(result.roas),
        netProfitFormatted: formatInr(result.netProfit),
      })
    },
  )

  server.registerTool(
    'compute_invoice_totals',
    {
      title: 'Compute Invoice Totals',
      description:
        'Compute invoice subtotal, discount, tax and total from line items (quantity x rate), a tax percentage, and a percent-or-flat discount — every figure reconciles to the minor unit.',
      annotations: PURE,
      inputSchema: {
        lines: z
          .array(
            z.object({
              quantity: z.number().finite().min(0).max(1e9),
              rate: z.number().finite().min(0).max(1e12),
            }),
          )
          .min(1)
          .max(100),
        taxPercent: z.number().finite().min(0).max(100).describe('e.g. 18 for 18%'),
        discount: z
          .number()
          .finite()
          .min(0)
          .max(1e15)
          .describe('A percentage of subtotal, or a flat amount in major units'),
        discountKind: z.enum(['percent', 'flat']),
        currency: z
          .string()
          .max(10)
          .optional()
          .describe('ISO currency code, default INR'),
      },
    },
    async ({ lines, taxPercent, discount, discountKind, currency }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const totals = computeInvoice({ lines, taxPercent, discount, discountKind })
      const code = currency !== undefined && isCurrencyCode(currency) ? currency : 'INR'
      return text({
        ...totals,
        subtotalFormatted: formatMoney(totals.subtotal, code),
        discountFormatted: formatMoney(totals.discountAmount, code),
        taxFormatted: formatMoney(totals.taxAmount, code),
        totalFormatted: formatMoney(totals.total, code),
      })
    },
  )

  server.registerTool(
    'generate_business_names',
    {
      title: 'Generate Business Names',
      description:
        'Generate a batch of candidate business names from one or two keywords using a deterministic strategy (brandable, compound, modern suffix, portmanteau, or alliteration) — no AI, purely combinatorial word-bank generation.',
      annotations: PURE,
      inputSchema: {
        keywords: z.array(z.string().max(40)).min(1).max(2),
        style: z.enum(['brandable', 'compound', 'suffix', 'portmanteau', 'alliteration']),
        count: z.number().int().min(1).max(40).optional(),
        seed: z
          .number()
          .int()
          .safe()
          .optional()
          .describe('For reproducible output; omit for a fresh batch each call'),
      },
    },
    async ({ keywords, style, count, seed }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const rng = createRng(seed ?? Date.now())
      const result = generateBatch(keywords, style as StyleId, rng, count)
      if (result.error !== undefined) return errorText(result.error)
      return text(result.names)
    },
  )

  server.registerTool(
    'generate_slogans',
    {
      title: 'Generate Slogans',
      description:
        'Generate a batch of slogans/taglines for a brand keyword (and optional "what you do" noun) in one of five tones (bold, friendly, premium, playful, minimal), from a curated template bank — flags which lines fit a Google Ads headline/description.',
      annotations: PURE,
      inputSchema: {
        keyword: z.string().max(60),
        noun: z.string().max(60).optional(),
        tone: z.enum(['bold', 'friendly', 'premium', 'playful', 'minimal']),
        count: z.number().int().min(1).max(20).optional(),
        exclude: z.array(z.string().max(200)).max(50).optional(),
        seed: z.number().int().safe().optional(),
      },
    },
    async ({ keyword, noun, tone, count, exclude, seed }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const rng = createSeededRng(seed ?? Date.now())
      const result = generateSlogans({
        keyword,
        noun,
        tone: tone as Tone,
        rng,
        exclude,
        count,
      })
      if (result.error !== undefined) return errorText(result.error)
      return text(result.slogans)
    },
  )

  server.registerTool(
    'generate_email_signature',
    {
      title: 'Generate Email Signature',
      description:
        'Build an email-safe HTML signature (nested tables, inline styles — the only markup that survives Outlook/Gmail) from name, title, company, contact fields and social links, in one of three layouts.',
      annotations: PURE,
      inputSchema: {
        fullName: z.string().max(120).optional().default(''),
        jobTitle: z.string().max(120).optional().default(''),
        company: z.string().max(120).optional().default(''),
        phone: z.string().max(40).optional().default(''),
        email: z.string().max(254).optional().default(''),
        website: z.string().max(500).optional().default(''),
        linkedin: z.string().max(500).optional().default(''),
        twitter: z.string().max(500).optional().default(''),
        instagram: z.string().max(500).optional().default(''),
        github: z.string().max(500).optional().default(''),
        photoUrl: z.string().max(500).optional().default(''),
        template: z.enum(['classic', 'stacked', 'corporate']),
        accentColor: hexColor().optional().default('#4B20DE'),
      },
    },
    async ({ template, accentColor, ...fields }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const result = buildSignatureHtml(
        fields as SignatureFields,
        template as SignatureTemplate,
        accentColor,
      )
      return text({
        html: result.html,
        text: buildSignatureText(fields as SignatureFields),
        warnings: result.warnings,
      })
    },
  )

  server.registerTool(
    'format_json',
    {
      title: 'Format / Minify / Repair JSON',
      description:
        'Pretty-print, minify, or best-effort-repair JSON text. Repair handles the common "valid JS, not valid JSON" mistakes: comments, single quotes, unquoted keys, trailing commas. On a parse failure, reports the exact line/column/snippet.',
      annotations: PURE,
      inputSchema: {
        // Mirrors the logic module's own MAX_INPUT_CHARS, but enforced here
        // where oversized input is rejected before it is even materialised
        // into the handler.
        input: z.string().max(2_000_000),
        mode: z.enum(['format', 'minify', 'repair']).default('format'),
        indent: z.union([z.literal(2), z.literal(4), z.literal('tab')]).optional(),
        sort: z.boolean().optional().describe('Recursively sort object keys'),
      },
    },
    async ({ input, mode, indent, sort }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const options = { indent: indent as IndentOption | undefined, sort }
      const result =
        mode === 'minify'
          ? minifyJson(input, options)
          : mode === 'repair'
            ? repairJson(input, options)
            : formatJson(input, options)
      if (result.error !== undefined) {
        return errorText(
          `${result.error}${result.errorLine !== undefined ? ` (line ${result.errorLine}, column ${result.errorColumn})` : ''}`,
        )
      }
      return text({
        output: result.output,
        stats: result.stats,
        repaired: result.repaired,
      })
    },
  )

  server.registerTool(
    'count_words',
    {
      title: 'Analyze Text',
      description:
        'Word/character/sentence/paragraph counts using real Unicode segmentation (not split(" ")), reading time, and keyword + two-word-phrase density — the same analysis behind the Word Counter tool.',
      annotations: PURE,
      inputSchema: {
        // The analyzer runs Intl.Segmenter grapheme/word/sentence passes
        // plus an unbounded bigram map over the whole input — expensive per
        // byte, and analyzeText has no internal cap of its own, so this
        // schema bound is the only thing standing between an arbitrary-size
        // payload and a CPU burn. 200k chars is a ~40k-word document.
        text: z.string().max(200_000),
      },
    },
    async ({ text: input }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const stats = analyzeText(input)
      return text({ ...stats, bigrams: bigramDensity(input) })
    },
  )

  server.registerTool(
    'generate_color_palette',
    {
      title: 'Generate Colour Palette',
      description:
        'Turn one hex colour into a harmony (complementary, analogous, triadic, or monochrome) in OKLCH, each swatch carrying its WCAG contrast ratio against black/white — plus CSS custom properties, a Tailwind v4 @theme block, or plain hex list.',
      annotations: PURE,
      inputSchema: {
        hex: z.string().max(10).describe('#rgb or #rrggbb, # optional'),
        harmony: z.enum(['complementary', 'analogous', 'triadic', 'monochrome']),
        format: z
          .enum(['css', 'tailwind', 'json', 'hex'])
          .optional()
          .describe('Token export format; omit for just the swatch data'),
      },
    },
    async ({ hex, harmony, format }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const result = generatePalette(hex, harmony as Harmony)
      if (result.error !== undefined) return errorText(result.error)
      if (format !== undefined)
        return text(toTokens(result.swatches, format as TokenFormat))
      return text(result.swatches)
    },
  )

  // ── Wave 2 — image-output tool ─────────────────────────────────────────

  server.registerTool(
    'generate_qr_code',
    {
      title: 'Generate QR Code',
      description:
        'Generate a scannable QR code PNG for a URL, free text, a WiFi network, or a UPI payment request. Validates the payload (URL scheme, WiFi SSID/password bounds, UPI VPA format, byte capacity) before encoding.',
      annotations: PURE,
      inputSchema: {
        mode: z.enum(['url', 'text', 'wifi', 'upi']),
        url: z.string().max(2100).optional(),
        text: z.string().max(2100).optional(),
        ssid: z.string().max(64).optional(),
        password: z.string().max(128).optional(),
        security: z.enum(['WPA', 'WEP', 'nopass']).optional(),
        hidden: z.boolean().optional(),
        vpa: z.string().max(100).optional(),
        payeeName: z.string().max(100).optional(),
        amount: z.string().max(20).optional(),
        size: z
          .union([z.literal(256), z.literal(512), z.literal(1024), z.literal(2048)])
          .optional()
          .default(512),
        // Validated at the schema, not just defaulted: these two pass
        // verbatim into the QR library's colour options.
        darkColor: hexColor().optional().default('#000000'),
        lightColor: hexColor().optional().default('#ffffff'),
      },
    },
    async ({ size, darkColor, lightColor, ...input }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const built = buildQrPayload(input as QrPayloadInput)
      if (built.error !== undefined) return errorText(built.error)
      const buffer = await QRCode.toBuffer(built.payload, {
        type: 'png',
        width: size,
        margin: 1,
        color: { dark: darkColor, light: lightColor },
      })
      return {
        content: [
          {
            type: 'text',
            text:
              built.warnings.length > 0
                ? `Warnings: ${built.warnings.join(' ')}`
                : 'Generated.',
          },
          { type: 'image', data: buffer.toString('base64'), mimeType: 'image/png' },
        ],
      }
    },
  )

  server.registerTool(
    'generate_favicon',
    {
      title: 'Generate Favicon Set',
      description:
        'Turn a logo/image into a full favicon set: favicon.ico (16/32/48px), icon-192.png, icon-512.png, an apple-touch-icon, plus the <head> snippet and site.webmanifest to install them. Image mode only — text/letter/emoji favicons need font rendering this server cannot guarantee, so use an actual image. Source image max 2MB.',
      annotations: PURE,
      inputSchema: {
        // ~2MB decoded (base64 is 4/3 overhead). Tighter than the website's
        // own 10MB cap on purpose: over MCP the image rides inside a JSON
        // body that is fully parsed before any size check can run, so the
        // schema cap is what actually bounds transport + decode cost.
        imageBase64: z
          .string()
          .max(2_800_000)
          .describe(
            'Base64-encoded source image (PNG/JPEG/WebP/GIF/AVIF), no data: URI prefix. Max ~2MB decoded.',
          ),
        shape: z.enum(['square', 'rounded', 'circle']).optional().default('rounded'),
        radiusPct: z
          .number()
          .min(0)
          .max(50)
          .optional()
          .default(20)
          .describe('Corner radius for the rounded shape, as % of the tile edge.'),
        pad: z
          .number()
          .min(0)
          .max(0.4)
          .optional()
          .default(0)
          .describe('Inset padding around the image, as a fraction of the tile (0-0.4).'),
        appleBackground: hexColor()
          .optional()
          .default('#ffffff')
          .describe('Hex colour used to flatten transparency for the apple-touch-icon.'),
        appName: z
          .string()
          .max(60)
          .optional()
          .default('My site')
          .describe('App name written into the generated web manifest.'),
      },
    },
    async ({ imageBase64, shape, radiusPct, pad, appleBackground, appName }) => {
      // The heavy bucket, not the general one: rendering six raster sizes
      // from a caller-supplied image is the most expensive pure-compute
      // call this server offers.
      const limited = checkHeavy()
      if (limited) return limited
      let imageBytes: Uint8Array
      try {
        imageBytes = Uint8Array.from(Buffer.from(imageBase64, 'base64'))
      } catch {
        return errorText('Could not decode imageBase64 — make sure it is valid base64.')
      }
      if (imageBytes.length === 0) return errorText('imageBase64 decoded to zero bytes.')
      if (imageBytes.length > FAVICON_MAX_SOURCE_BYTES) {
        return errorText(
          `Image is too large — max ${Math.round(FAVICON_MAX_SOURCE_BYTES / (1024 * 1024))}MB.`,
        )
      }
      const safeApple = isHexColor(appleBackground) ? appleBackground : '#ffffff'
      let rendered: Awaited<ReturnType<typeof renderFaviconSet>>
      try {
        rendered = await renderFaviconSet({
          imageBytes,
          shape: shape as TileShape,
          radiusPct,
          pad,
          appleBackground: safeApple,
        })
      } catch (err) {
        return errorText(
          err instanceof Error
            ? err.message
            : 'Could not render that image into a favicon set.',
        )
      }
      const ico = buildIco([
        { size: 16, png: rendered.png16 },
        { size: 32, png: rendered.png32 },
        { size: 48, png: rendered.png48 },
      ])
      return {
        content: [
          {
            type: 'text',
            text: [
              'Images below, in order: favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png.',
              '',
              buildHtmlSnippet(),
              '',
              buildWebmanifest(appName, safeApple),
            ].join('\n'),
          },
          {
            type: 'image',
            data: Buffer.from(ico).toString('base64'),
            mimeType: 'image/vnd.microsoft.icon',
          },
          {
            type: 'image',
            data: rendered.png192.toString('base64'),
            mimeType: 'image/png',
          },
          {
            type: 'image',
            data: rendered.png512.toString('base64'),
            mimeType: 'image/png',
          },
          {
            type: 'image',
            data: rendered.appleTouchIcon.toString('base64'),
            mimeType: 'image/png',
          },
        ],
      }
    },
  )

  // ── Wave 3 — server-backed tools ────────────────────────────────────────

  server.registerTool(
    'check_ai_visibility',
    {
      title: 'Check AI Visibility',
      description:
        "Audit a website's visibility to AI crawlers and answer engines: per-crawler robots.txt verdicts (with the exact rule that decided), structured data, on-page basics, llms.txt, sitemap, HTTPS, and social/citation signals, scored 0-100. Fetches the live site server-side — same tool as tools.scult.in's AI Visibility Checker.",
      annotations: OPEN_WORLD,
      inputSchema: { url: z.string().max(2000).describe('The URL to check') },
    },
    async ({ url }) => {
      const limited = checkExternal()
      if (limited) return limited
      const result = await runAiVisibilityCheck(url)
      if (isApiError(result)) return errorText(result.error)
      return text(result)
    },
  )

  server.registerTool(
    'test_website_speed',
    {
      title: 'Test Website Speed',
      description:
        "Run a real Google PageSpeed Insights / Lighthouse test against a URL (mobile or desktop) and return Core Web Vitals, the performance score, and top optimisation opportunities. Same tool as tools.scult.in's Website Speed Test — a real Lighthouse run, 15-40s.",
      annotations: OPEN_WORLD,
      inputSchema: {
        url: z.string().max(2000),
        strategy: z.enum(['mobile', 'desktop']).optional().default('mobile'),
      },
    },
    async ({ url, strategy }) => {
      const limited = checkExternal()
      if (limited) return limited
      const result = await runSpeedTest(url, strategy)
      if (isSpeedTestApiError(result)) return errorText(result.error)
      return text(result)
    },
  )

  // ── Wave 4 — Prompt Library ─────────────────────────────────────────────
  // Server-only, per lib/search.ts's own documented incident (importing the
  // full prompt registry into a client component once leaked 1,170
  // templates into the browser bundle) — this module is only ever reached
  // from app/api/[transport]/route.ts, never from a client component.

  server.registerTool(
    'search_prompts',
    {
      title: 'Search Prompt Library',
      description:
        'Search the 1,170-prompt library by keyword across title, description, tags and the prompt template body itself. Returns compact matches (slug, title, description, category) — call get_prompt for the full template.',
      annotations: PURE,
      inputSchema: {
        query: z.string().max(200),
        category: z.string().max(100).optional(),
        limit: z.number().int().min(1).max(50).optional().default(10),
      },
    },
    async ({ query, category, limit }) => {
      const limited = checkGeneral()
      if (limited) return limited
      if (category !== undefined && getPromptCategory(category) === undefined) {
        return errorText(`Unknown prompt category "${category}".`)
      }
      const terms = searchTerms(query)
      if (terms.length === 0) return text([])
      const haystacks = promptHaystacks()
      const scored = PROMPTS.map((p, i) => {
        if (category !== undefined && p.category !== category) return { p, score: -1 }
        const hay = haystacks[i]
        if (hay === undefined) return { p, score: -1 }
        let score = 0
        for (const term of terms) {
          if (hay.title.includes(term)) score += 10
          else if (hay.full.includes(term)) score += 1
          else return { p, score: -1 }
        }
        return { p, score }
      })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
      return text(
        scored.map(({ p }) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          category: p.category,
          tags: p.tags,
        })),
      )
    },
  )

  server.registerTool(
    'get_prompt',
    {
      title: 'Get Prompt',
      description:
        'Fetch one prompt in full, including its template text, variables, and why it works.',
      annotations: PURE,
      inputSchema: { slug: z.string().max(200) },
    },
    async ({ slug }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const prompt = getPrompt(slug)
      if (prompt === undefined) return errorText(`No prompt with slug "${slug}".`)
      return text(prompt)
    },
  )

  server.registerTool(
    'list_prompt_categories',
    {
      title: 'List Prompt Categories',
      description:
        'List every Prompt Library category (grouped under 9 top-level groups) with its slug and blurb.',
      annotations: PURE,
      inputSchema: {},
    },
    async () => {
      const limited = checkGeneral()
      if (limited) return limited
      return text({
        groups: PROMPT_GROUPS,
        categories: PROMPT_CATEGORIES.map((c) => ({
          slug: c.slug,
          group: c.group,
          name: c.name,
          blurb: c.blurb,
        })),
      })
    },
  )

  // ── Wave 5 — Skills Library ──────────────────────────────────────────────

  server.registerTool(
    'search_skills',
    {
      title: 'Search Skills Library',
      description:
        'Search the Skills Library (real AI agent skills synced from skills.sh) by keyword across name and description, optionally scoped to a category. Returns compact matches — call get_skill for the full skill body.',
      annotations: PURE,
      inputSchema: {
        query: z.string().max(100),
        category: z.string().max(100).optional(),
        limit: z.number().int().min(1).max(50).optional().default(20),
      },
    },
    async ({ query, category, limit }) => {
      const limited = checkGeneral()
      if (limited) return limited
      if (category !== undefined && getSkillCategory(category) === undefined) {
        return errorText(`Unknown skill category "${category}".`)
      }
      const results = await searchSkills(
        query,
        category as SkillCategorySlug | undefined,
        limit,
      )
      return text(
        results.map((s) => ({
          slug: s.slug,
          category: s.category,
          name: s.name,
          description: s.description,
          installs: s.installs,
          licenseGated: s.licenseGated,
        })),
      )
    },
  )

  server.registerTool(
    'get_skill',
    {
      title: 'Get Skill',
      description:
        'Fetch one skill in full. When its source license is not confirmed to permit redistribution, the body is withheld and a GitHub source link is returned instead — same rule the website itself enforces before showing a skill body.',
      annotations: PURE,
      inputSchema: { category: z.string().max(100), slug: z.string().max(200) },
    },
    async ({ category, slug }) => {
      const limited = checkGeneral()
      if (limited) return limited
      if (getSkillCategory(category) === undefined)
        return errorText(`Unknown skill category "${category}".`)
      const skill = await getSkill(category as SkillCategorySlug, slug)
      if (skill === undefined)
        return errorText(`No skill "${slug}" in category "${category}".`)
      // Replicates components/skills/SkillCopyBlock.tsx's gate — nothing in
      // the data layer strips `body` for a licenseGated skill on its own.
      if (skill.licenseGated) {
        return text({
          slug: skill.slug,
          name: skill.name,
          description: skill.description,
          licenseGated: true,
          note: "This skill's source license is not confirmed to permit redistribution, so its body is withheld here. View it at the source instead.",
          sourceUrl: skill.sourceUrl,
        })
      }
      return text(skill)
    },
  )

  server.registerTool(
    'list_skill_categories',
    {
      title: 'List Skill Categories',
      description:
        'List every Skills Library category with its slug, blurb, and live skill count.',
      annotations: PURE,
      inputSchema: {},
    },
    async () => {
      const limited = checkGeneral()
      if (limited) return limited
      const counts = await getAllCategoryCounts()
      return text(
        SKILL_CATEGORIES.map((c) => ({
          slug: c.slug,
          name: c.name,
          blurb: c.blurb,
          count: counts[c.slug] ?? 0,
        })),
      )
    },
  )

  // ── Wave 6 — Guides & Blog ────────────────────────────────────────────

  server.registerTool(
    'list_guides',
    {
      title: 'List Guides',
      description:
        "This site's small set of evergreen how-to guides (distinct from the blog) — title, description and reading time for each.",
      annotations: PURE,
      inputSchema: {},
    },
    async () => {
      const limited = checkGeneral()
      if (limited) return limited
      return text(
        GUIDES.map((g) => ({
          slug: g.slug,
          title: g.title,
          description: g.description,
          readingMinutes: g.readingMinutes,
        })),
      )
    },
  )

  server.registerTool(
    'get_guide',
    {
      title: 'Get Guide',
      description: 'Fetch one guide in full: every section, and the tools it links to.',
      annotations: PURE,
      inputSchema: { slug: z.string().max(200) },
    },
    async ({ slug }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const guide = getGuide(slug)
      if (guide === undefined) return errorText(`No guide with slug "${slug}".`)
      return text(guide)
    },
  )

  server.registerTool(
    'search_blog',
    {
      title: 'Search Blog',
      description:
        'Keyword search across 200+ long-form blog posts (tool deep-dives, prompt roundups, service guides, competitor playbooks) by title, description and full body text. Returns compact matches — call get_blog_post for the full post.',
      annotations: PURE,
      inputSchema: {
        query: z.string().max(200),
        pillar: z
          .enum(['tool', 'prompt', 'service', 'roundup', 'playbook'])
          .optional()
          .describe('Narrow to one content type'),
        limit: z.number().int().min(1).max(50).optional().default(10),
      },
    },
    async ({ query, pillar, limit }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const terms = searchTerms(query)
      if (terms.length === 0) return text([])
      const haystacks = blogHaystacks()
      const scored = BLOG_POSTS.map((p, i) => {
        if (pillar !== undefined && p.pillar !== pillar) return { p, score: -1 }
        const hay = haystacks[i]
        if (hay === undefined) return { p, score: -1 }
        let score = 0
        for (const term of terms) {
          if (hay.title.includes(term)) score += 10
          else if (hay.full.includes(term)) score += 1
          else return { p, score: -1 }
        }
        return { p, score }
      })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
      return text(
        scored.map(({ p }) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          pillar: p.pillar,
          readingMinutes: p.readingMinutes,
        })),
      )
    },
  )

  server.registerTool(
    'get_blog_post',
    {
      title: 'Get Blog Post',
      description:
        'Fetch one blog post in full: every section, FAQ, sources, and related tools/prompts.',
      annotations: PURE,
      inputSchema: { slug: z.string().max(200) },
    },
    async ({ slug }) => {
      const limited = checkGeneral()
      if (limited) return limited
      const post = getBlogPost(slug)
      if (post === undefined) return errorText(`No blog post with slug "${slug}".`)
      return text({
        slug: post.slug,
        pillar: post.pillar,
        title: post.title,
        h1: post.h1,
        description: post.description,
        dek: post.dek,
        sections: post.sections.map((s) => ({
          heading: s.heading,
          body: s.body.map(flattenInline),
        })),
        faq: (post.faq ?? []).map((f) => ({
          question: f.question,
          answer: flattenInline(f.answer),
        })),
        sources: post.sources ?? [],
        relatedTools: post.relatedTools,
        relatedPrompts: post.relatedPrompts,
        updatedAt: post.updatedAt,
        readingMinutes: post.readingMinutes,
      })
    },
  )
}

/** Drops link/bold structure, keeping just the readable text — an agent
 * consuming this over MCP wants plain paragraphs, not the site's inline-markup AST. */
function flattenInline(segments: readonly Inline[]): string {
  return segments.map((s) => (typeof s === 'string' ? s : s.text)).join('')
}

/** Lowercased whitespace terms, capped at 8: scoring cost is O(terms x
 * corpus), and the corpus half is fixed, so the term count is the only
 * knob a caller could still turn into a CPU lever after the query-length
 * cap. Eight distinct AND-ed terms is already a stricter query than any
 * real search. */
function searchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .slice(0, 8)
}

interface Haystack {
  readonly title: string
  readonly full: string
}

/**
 * Memoized search corpora, built once per process on first search and
 * index-aligned with their registries. The originals rebuilt (and
 * re-lowercased) the ENTIRE corpus on every call — for the blog that meant
 * flattening every section of 200+ long-form posts per search, the single
 * most expensive code path on the MCP surface, paid before a single term
 * was matched. The registries are immutable module constants, so caching
 * is safe for the life of the process.
 */
let promptHaystacksCache: Haystack[] | undefined
function promptHaystacks(): Haystack[] {
  promptHaystacksCache ??= PROMPTS.map((p) => ({
    title: p.title.toLowerCase(),
    full: `${p.title} ${p.description} ${p.tags.join(' ')} ${p.promptText}`.toLowerCase(),
  }))
  return promptHaystacksCache
}

let blogHaystacksCache: Haystack[] | undefined
function blogHaystacks(): Haystack[] {
  blogHaystacksCache ??= BLOG_POSTS.map((p) => {
    const bodyText = p.sections
      .flatMap((s) => [s.heading, ...s.body.map(flattenInline)])
      .join(' ')
    const faqText = (p.faq ?? [])
      .flatMap((f) => [f.question, flattenInline(f.answer)])
      .join(' ')
    return {
      title: p.title.toLowerCase(),
      full: `${p.title} ${p.description} ${p.dek} ${p.targetKeyword} ${bodyText} ${faqText}`.toLowerCase(),
    }
  })
  return blogHaystacksCache
}
