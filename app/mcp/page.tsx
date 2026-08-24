import type { Metadata } from 'next'
import Link from 'next/link'
import { McpCodeBlock } from '@/components/mcp/McpCodeBlock'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl, SITE } from '@/lib/site'

const TITLE = 'MCP Server — Connect Your AI Agent'
const DESCRIPTION =
  'Call every tool, prompt, skill, guide and blog post on Scult Tools directly from Claude, Cursor, ChatGPT or any MCP client — a public Streamable HTTP server, no auth, no signup.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/mcp' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/mcp'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const MCP_URL = absoluteUrl('/api/mcp')

const LINK_CLASS =
  'text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600'

const CLAUDE_CODE_SNIPPET = `claude mcp add --transport http scult-tools ${MCP_URL}`

const JSON_CONFIG_SNIPPET = `{
  "mcpServers": {
    "scult-tools": {
      "url": "${MCP_URL}"
    }
  }
}`

const MCP_REMOTE_SNIPPET = `{
  "mcpServers": {
    "scult-tools": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${MCP_URL}"]
    }
  }
}`

interface ToolRow {
  readonly name: string
  readonly description: string
}

const PURE_TOOLS: readonly ToolRow[] = [
  { name: 'generate_schema_markup', description: 'JSON-LD for 9 schema.org types' },
  { name: 'generate_faq_schema', description: 'FAQPage JSON-LD + visible HTML block' },
  { name: 'build_utm_url', description: 'GA4-safe UTM campaign URLs' },
  { name: 'calculate_marketing_roi', description: 'Campaign ROI and ROAS side by side' },
  {
    name: 'compute_invoice_totals',
    description: 'Invoice subtotal, discount, tax, total',
  },
  { name: 'generate_business_names', description: 'Deterministic brand-name candidates' },
  { name: 'generate_slogans', description: 'Taglines by tone, with ad-fit checks' },
  {
    name: 'generate_email_signature',
    description: 'Email-safe HTML signature, 3 layouts',
  },
  { name: 'format_json', description: 'Format, minify or repair JSON' },
  { name: 'count_words', description: 'Word/character/reading-time + keyword density' },
  {
    name: 'generate_color_palette',
    description: 'OKLCH harmony + WCAG contrast, exportable',
  },
  {
    name: 'generate_qr_code',
    description: 'QR PNG for a URL, text, WiFi or UPI payment',
  },
  { name: 'generate_favicon', description: 'Full favicon set from a logo image' },
]

const SERVER_TOOLS: readonly ToolRow[] = [
  {
    name: 'check_ai_visibility',
    description: "A site's AI-crawler/answer-engine visibility, scored",
  },
  { name: 'test_website_speed', description: 'Real PageSpeed Insights / Lighthouse run' },
]

const PROMPT_TOOLS: readonly ToolRow[] = [
  {
    name: 'search_prompts',
    description: 'Keyword search across 1,170+ prompts, template body included',
  },
  { name: 'get_prompt', description: 'Full prompt: template, variables, why it works' },
  { name: 'list_prompt_categories', description: 'All prompt categories and groups' },
]

const SKILL_TOOLS: readonly ToolRow[] = [
  { name: 'search_skills', description: 'Keyword search across the Skills Library' },
  {
    name: 'get_skill',
    description: 'Full skill body — withheld where the source license is unconfirmed',
  },
  { name: 'list_skill_categories', description: 'All skill categories with live counts' },
]

const GUIDE_BLOG_TOOLS: readonly ToolRow[] = [
  {
    name: 'list_guides',
    description: 'The evergreen how-to guides — a small set, separate from the blog',
  },
  { name: 'get_guide', description: 'One guide in full, every section' },
  {
    name: 'search_blog',
    description: 'Keyword search across 200+ long-form posts, full body included',
  },
  {
    name: 'get_blog_post',
    description: 'One post in full: sections, FAQ, sources, related links',
  },
]

function ToolTable({ rows }: { rows: readonly ToolRow[] }) {
  return (
    <ul className="mt-4 divide-y divide-ink/10 rounded-panel border border-ink/15">
      {rows.map((row) => (
        <li
          key={row.name}
          className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
        >
          <code className="shrink-0 font-mono text-[13px] text-violet-700 sm:w-[220px]">
            {row.name}
          </code>
          <span className="text-[14px] text-ink-muted leading-6">{row.description}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Every tool name/description here is copied from the real `title`/
 * `description` handed to `server.registerTool(...)` in lib/mcp/register.ts
 * — same "never say something not checkable in the code" rule /security
 * follows, applied to this page.
 */
export default function McpPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'MCP Server', path: '/mcp' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">For AI agents</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          Connect your agent to every tool on this site
        </h1>
        <p className="mt-6 text-[18px] text-ink-muted leading-8 md:text-lead">
          {SITE.name} runs a public{' '}
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            Model Context Protocol
          </a>{' '}
          server. Claude, Cursor, ChatGPT or anything else that speaks MCP can call the
          tools below mid-conversation — generate a QR code, audit a site's AI visibility,
          pull a prompt, a skill, a guide or a blog post — without a human opening this
          site in a browser. No account, no API key, no cost.
        </p>

        <section id="endpoint" className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">The endpoint</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Streamable HTTP, the current MCP transport — one URL, no separate SSE endpoint
            to configure:
          </p>
          <div className="mt-4">
            <McpCodeBlock label="Endpoint" code={MCP_URL} />
          </div>
        </section>

        <section id="connect" className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Connect</h2>

          <h3 className="mt-6 font-semibold text-[18px] text-ink">Claude Code</h3>
          <p className="mt-2 text-[15px] text-ink-muted leading-7">
            One command, from any terminal:
          </p>
          <div className="mt-3">
            <McpCodeBlock label="Terminal" code={CLAUDE_CODE_SNIPPET} />
          </div>

          <h3 className="mt-8 font-semibold text-[18px] text-ink">
            Claude Desktop, Cursor, and other JSON-config clients
          </h3>
          <p className="mt-2 text-[15px] text-ink-muted leading-7">
            Add this to the client's MCP config file (Claude Desktop's{' '}
            <code>claude_desktop_config.json</code>, or Cursor's{' '}
            <code>.cursor/mcp.json</code>):
          </p>
          <div className="mt-3">
            <McpCodeBlock label="mcp.json" code={JSON_CONFIG_SNIPPET} />
          </div>
          <p className="mt-3 text-[14px] text-ink-muted leading-6">
            If a client only supports stdio servers and can't dial Streamable HTTP
            directly, bridge it with{' '}
            <a
              href="https://www.npmjs.com/package/mcp-remote"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              mcp-remote
            </a>{' '}
            instead:
          </p>
          <div className="mt-3">
            <McpCodeBlock label="mcp.json" code={MCP_REMOTE_SNIPPET} />
          </div>

          <h3 className="mt-8 font-semibold text-[18px] text-ink">ChatGPT</h3>
          <p className="mt-2 text-[15px] text-ink-muted leading-7">
            Add a custom connector from ChatGPT's settings and paste the endpoint URL
            above — no config file involved.
          </p>
        </section>

        <section id="tools" className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            What's callable —{' '}
            {PURE_TOOLS.length +
              SERVER_TOOLS.length +
              PROMPT_TOOLS.length +
              SKILL_TOOLS.length +
              GUIDE_BLOG_TOOLS.length}{' '}
            tools
          </h2>

          <h3 className="mt-6 font-semibold text-[18px] text-ink">Pure-compute tools</h3>
          <p className="mt-2 text-[14px] text-ink-muted leading-6">
            Same logic as the tool pages themselves — no network call, generous rate
            limit.
          </p>
          <ToolTable rows={PURE_TOOLS} />

          <h3 className="mt-8 font-semibold text-[18px] text-ink">Server-backed tools</h3>
          <p className="mt-2 text-[14px] text-ink-muted leading-6">
            These fetch a real target site or call Google's PageSpeed Insights — same
            implementation as{' '}
            <Link href="/geo/ai-visibility-checker" className={LINK_CLASS}>
              AI Visibility Checker
            </Link>{' '}
            and{' '}
            <Link href="/seo/website-speed-test" className={LINK_CLASS}>
              Website Speed Test
            </Link>
            , with a stricter, separate rate limit.
          </p>
          <ToolTable rows={SERVER_TOOLS} />

          <h3 className="mt-8 font-semibold text-[18px] text-ink">Prompt Library</h3>
          <ToolTable rows={PROMPT_TOOLS} />

          <h3 className="mt-8 font-semibold text-[18px] text-ink">Skills Library</h3>
          <ToolTable rows={SKILL_TOOLS} />

          <h3 className="mt-8 font-semibold text-[18px] text-ink">Guides &amp; Blog</h3>
          <ToolTable rows={GUIDE_BLOG_TOOLS} />
        </section>

        <section id="rate-limits" className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Rate limits</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Two limits, tracked per connection, independent of the browser rate limits the
            website itself uses:
          </p>
          <ul className="mt-4 space-y-3 text-[16px] text-ink-muted leading-7">
            <li>
              <strong className="text-ink">30 calls / 60 seconds</strong> for everything
              except the two server-backed tools — generous for an agent making several
              calls in one turn, tight enough to stop a runaway loop.
            </li>
            <li>
              <strong className="text-ink">3 calls / 60 seconds</strong> for{' '}
              <code>check_ai_visibility</code> and <code>test_website_speed</code> —
              stricter than the website's own limit, since each one spends real
              third-party quota.
            </li>
          </ul>
          <p className="mt-4 text-[16px] text-ink-muted leading-7">
            Hitting a limit returns a normal tool result stating how many seconds until
            the next call is allowed — never a silent failure.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Worth knowing</h2>
          <ul className="mt-4 space-y-3 text-[16px] text-ink-muted leading-7">
            <li>
              <code>get_skill</code> withholds a skill's body when its source license
              isn't confirmed to permit redistribution, returning a source link instead —
              the same rule the Skills Library's own pages enforce, not a separate one
              invented for this server.
            </li>
            <li>
              No authentication and no per-agent identity: this is a public, rate-limited
              server, matching this site's own no-signup posture. Don't send secrets
              through it.
            </li>
            <li>
              Everything here calls the exact same code the tool pages use — there is no
              separate "MCP version" of any tool's logic to drift out of sync.
            </li>
          </ul>
        </section>
      </article>
    </>
  )
}
