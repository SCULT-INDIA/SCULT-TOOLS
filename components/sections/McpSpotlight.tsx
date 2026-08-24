import { ArrowUpRight, Plug } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { absoluteUrl } from '@/lib/site'

/**
 * Homepage spotlight for the public MCP server — every tool, prompt, skill,
 * guide and blog post callable from any MCP client. The feature shipped
 * with its own /mcp page but had zero homepage presence until this section.
 *
 * On-brand dark: violet-900 (the site's one sanctioned dark tone, AAA for
 * white text) with the same soft violet-500 glows the AI-visibility band
 * uses — NOT a neutral black band, which sat outside the palette. The
 * terminal is a cream neo-brutal card (ink border + hard offset shadow,
 * slightly tilted like the hero's sticker cards) so even the "developer"
 * artifact wears the brand. Cream is an adaptive surface token, so the
 * mono text on it uses adaptive ink tokens, not literal black.
 */

const CLIENTS = ['claude', 'claude-code', 'cursor', 'chatgpt', 'gemini'] as const

export function McpSpotlight() {
  const mcpUrl = absoluteUrl('/api/mcp')

  return (
    <section
      aria-labelledby="mcp-spotlight"
      className="relative overflow-hidden bg-violet-900 py-20 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-8rem] right-[-10rem] size-[30rem] rounded-full bg-violet-500 opacity-40 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-10rem] left-[-8rem] size-[24rem] rounded-full bg-violet-500 opacity-25 blur-[100px]"
      />

      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="inline-flex rotate-[-1.5deg] items-center gap-2 rounded-pill border border-ink bg-cta px-3.5 py-1.5 shadow-brutal-sm">
            <Plug className="size-3.5 text-black" aria-hidden="true" />
            <span className="font-bold text-[12px] text-black uppercase tracking-[0.12em]">
              New — public MCP server
            </span>
          </p>
          <h2
            id="mcp-spotlight"
            className="mt-5 max-w-[16ch] font-display text-[34px] text-white leading-[1.08] tracking-[-1px] md:text-[46px]"
          >
            Plug the whole site into your AI agent
          </h2>
          <p className="mt-5 max-w-[50ch] text-[17px] text-white/75 leading-7">
            Every tool, prompt, skill, guide and blog post here is callable over MCP — one
            Streamable HTTP endpoint, no auth, no signup. Add it once and your agent can
            generate schema markup, build UTM links, search 1,000+ prompts and more,
            mid-conversation.
          </p>
          <ul
            aria-label="Works with these MCP clients"
            className="mt-6 flex flex-wrap items-center gap-2"
          >
            {CLIENTS.map((brand) => (
              <li
                key={brand}
                className="flex size-11 items-center justify-center rounded-xl border border-ink bg-white shadow-brutal-sm"
              >
                <BrandIcon brand={brand} size={22} />
              </li>
            ))}
            <li className="flex h-11 items-center rounded-xl border border-white/25 bg-white/5 px-3 font-semibold text-[12px] text-white/75">
              + any MCP client
            </li>
          </ul>
          {/* text-black/border-black force the resting face to literal black
              on the fixed-dark band — same override as the AI-visibility CTA. */}
          <Link
            href="/mcp"
            className="btn-brutal mt-8 border-black text-black hover:border-ink hover:text-ink"
          >
            CONNECT YOUR AGENT
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </Link>
        </div>

        {/* Cream neo-brutal terminal — the real one-line install from /mcp,
            then an illustrative session. Decorative; the copy beside it
            carries the accessible version of every claim. */}
        <div aria-hidden="true" className="relative">
          <p className="-top-4 absolute right-6 z-10 rotate-6 rounded-pill border border-ink bg-tile-green px-3.5 py-1 font-display font-semibold text-[14px] text-black italic shadow-brutal-sm">
            one line. done.
          </p>
          <div className="rotate-1 overflow-hidden rounded-lg border border-ink bg-cream shadow-brutal transition-transform duration-200 hover:rotate-0">
            <div className="flex items-center justify-between border-ink/15 border-b bg-tile-yellow px-4 py-2.5">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full border border-ink/40 bg-white" />
                <span className="size-2.5 rounded-full border border-ink/40 bg-cta" />
                <span className="size-2.5 rounded-full border border-ink/40 bg-green" />
              </span>
              <span className="font-mono text-[11px] text-black/60">terminal</span>
            </div>
            <div className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6">
              <p className="whitespace-nowrap">
                <span className="font-bold text-green">$</span>{' '}
                <span className="text-ink">
                  claude mcp add --transport http scult-tools
                </span>
              </p>
              <p className="whitespace-nowrap pl-4 font-medium text-violet-700">
                {mcpUrl}
              </p>
              <p className="mt-2 text-ink-muted">
                <span className="font-bold text-green">✓</span> scult-tools connected
              </p>
              <p className="mt-4 text-ink-subtle">
                &gt; generate FAQ schema for my pricing page
              </p>
              <p className="mt-1 text-ink-muted">
                <span className="text-violet-700">⚙</span> calling{' '}
                <span className="font-semibold text-ink">generate_faq_schema</span>…
              </p>
              <p className="text-ink-muted">
                <span className="font-bold text-green">✓</span> valid FAQPage JSON-LD
                returned
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
