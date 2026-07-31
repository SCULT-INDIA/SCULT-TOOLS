import { ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Tool } from '@/lib/tools/types'

/**
 * The tool card, derived from the reference site's capability chips: white
 * surface, 1px #ECE5F0, 10px radius, icon + label.
 *
 * The hover/focus state adds a black border and a hard shadow. That is not only
 * styling — #ECE5F0 is 1.23:1 against white, which is fine for a static card but
 * not for an interactive control, so the state change is what satisfies WCAG
 * 1.4.11 for a card that is really a link.
 */
export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.category}/${tool.slug}`}
      className="chip-tool group flex-col items-start gap-3 p-5"
    >
      <span className="flex w-full items-start gap-3">
        {/* The tool's own mark (white-disc composite, same file as its
            favicon) rather than the old generic lucide glyph on a violet
            square — every place a tool is named now shows the same face its
            browser tab does. The ring defines the baked-in white disc against
            this card's white surface. */}
        <Image
          src={`/tool-icons/${tool.slug}.png`}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full ring-1 ring-line"
        />
        <span className="min-w-0 flex-1">
          <span className="block font-display font-semibold text-[18px] leading-6 tracking-normal">
            {tool.title}
          </span>
        </span>
      </span>
      <span className="text-[14px] text-ink-muted leading-5">{tool.tagline}</span>
      {tool.runsInBrowser ? (
        <span className="mt-auto inline-flex items-center gap-1.5 text-[12px] text-ink-subtle">
          <ShieldCheck className="size-3.5 text-green" aria-hidden="true" />
          Runs in your browser
        </span>
      ) : null}
    </Link>
  )
}
