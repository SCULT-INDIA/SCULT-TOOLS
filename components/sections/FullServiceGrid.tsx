import Image from 'next/image'
import Link from 'next/link'
import { TOOLS } from '@/lib/tools/registry'

/**
 * Reference: bands 3-4 — "Full scope of services", a dense 4-column grid of
 * small icon-chip rows covering every service the agency offers, closed with a
 * "FULL SCOPE OF SERVICES →" link.
 *
 * Geometry kept verbatim: 4 columns, compact rows, 1px hairline border, small
 * icon + label. This is the reference's single most directly reusable pattern —
 * it becomes the literal list of every tool on the site.
 */
export function FullServiceGrid() {
  return (
    <section aria-labelledby="full-scope" className="container-site py-16">
      <div className="mb-8 text-center">
        <p className="eyebrow">Everything on the site</p>
        <h2
          id="full-scope"
          className="mt-3 text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]"
        >
          The full scope of tools
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.category}/${tool.slug}`}
            className="chip-tool items-start gap-2.5 px-4 py-3 text-[14px] leading-5"
          >
            {/* The tool's own mark. mt-0.5 optically centres it against the
                first text line once a long name wraps to two. */}
            <Image
              src={`/tool-icons/${tool.slug}.png`}
              alt=""
              width={20}
              height={20}
              className="mt-0.5 size-5 shrink-0 rounded-full ring-1 ring-line"
            />
            {/* Wrap rather than truncate: half these names are long enough that
                `truncate` cut them mid-word ("Word Counter — Words, Character…"),
                which reads as broken rather than tidy. */}
            <span>{tool.title}</span>
          </Link>
        ))}
      </div>

      <div className="mt-9 text-center">
        <Link
          href="/all"
          className="inline-flex items-center gap-1.5 font-bold text-[14px] text-ink uppercase tracking-[0.08em] hover:text-violet-600"
        >
          Full directory of tools
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
