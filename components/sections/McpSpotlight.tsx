import { ArrowUpRight, Plug } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { absoluteUrl } from '@/lib/site'

/**
 * Homepage spotlight for the public MCP server — the newest way to use the
 * site: every tool, prompt, skill, guide and blog post callable from any MCP
 * client. New in the 2026 landing-page redesign; the feature shipped with
 * its own /mcp page but had zero homepage presence.
 *
 * Fixed near-black band (same #111113 the SkillLibrarySpotlight terminal
 * uses) with literal light text — a deliberate fourth texture in the page's
 * rhythm: white sections, pastel panels, violet bands, and this one dark
 * "developer surface" for the one feature aimed squarely at agent users.
 */

const CLIENTS = ['claude', 'claude-code', 'cursor', 'chatgpt', 'gemini'] as const

export function McpSpotlight() {
  const mcpUrl = absoluteUrl('/api/mcp')

  return (
    <section
      aria-labelledby="mcp-spotlight"
      className="relative overflow-hidden bg-[#111113] py-20 text-white"
    >
      {/* Soft violet glow — the brand tone kept present even on the dark
          developer surface, same technique as the AI-visibility band. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-10rem] right-[-10rem] size-[26rem] rounded-full bg-violet-500 opacity-25 blur-[110px]"
      />

      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/5 px-3 py-1.5">
            <Plug className="size-3.5 text-cta" aria-hidden="true" />
            <span className="font-bold text-[12px] text-cta uppercase tracking-[0.12em]">
              New — public MCP server
            </span>
          </p>
          <h2
            id="mcp-spotlight"
            className="mt-5 max-w-[16ch] font-display text-[34px] text-white leading-[1.08] tracking-[-1px] md:text-[46px]"
          >
            Plug the whole site into your AI agent
          </h2>
          <p className="mt-5 max-w-[50ch] text-[17px] text-white/70 leading-7">
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
                className="flex size-10 items-center justify-center rounded-xl border border-white/12 bg-white"
              >
                <BrandIcon brand={brand} size={22} />
              </li>
            ))}
            <li className="flex h-10 items-center rounded-xl border border-white/12 bg-white/5 px-3 font-semibold text-[12px] text-white/60">
              + any MCP client
            </li>
          </ul>
          {/* text-black/border-black force the resting face to literal black
              on the fixed-dark band — same override pattern as the
              AI-visibility CTA, see that comment. */}
          <Link
            href="/mcp"
            className="btn-brutal mt-8 border-black text-black hover:border-ink hover:text-ink"
          >
            CONNECT YOUR AGENT
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </Link>
        </div>

        {/* Terminal mockup — the real one-line install from /mcp, then an
            illustrative session. Decorative; the copy beside it carries the
            accessible version of every claim. */}
        <div
          aria-hidden="true"
          className="overflow-hidden rounded-lg border border-white/12 bg-black/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between border-white/10 border-b px-4 py-2.5">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-white/20" />
              <span className="size-2 rounded-full bg-white/20" />
              <span className="size-2 rounded-full bg-white/20" />
            </span>
            <span className="font-mono text-[11px] text-white/45">terminal</span>
          </div>
          <div className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6">
            <p className="whitespace-nowrap">
              <span className="text-green">$</span>{' '}
              <span className="text-white/85">
                claude mcp add --transport http scult-tools
              </span>
            </p>
            <p className="whitespace-nowrap pl-4 text-violet-400">{mcpUrl}</p>
            <p className="mt-2 text-white/60">
              <span className="text-green">✓</span> scult-tools connected
            </p>
            <p className="mt-4 text-white/45">
              &gt; generate FAQ schema for my pricing page
            </p>
            <p className="mt-1 text-white/60">
              <span className="text-cta">⚙</span> calling{' '}
              <span className="text-white/85">generate_faq_schema</span>…
            </p>
            <p className="text-white/60">
              <span className="text-green">✓</span> valid FAQPage JSON-LD returned
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
