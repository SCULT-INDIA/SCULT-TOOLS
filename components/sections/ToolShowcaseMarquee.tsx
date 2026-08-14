import Image from 'next/image'
import { TOOLS } from '@/lib/tools/registry'
import type { Tool } from '@/lib/tools/types'

/**
 * Reference: band 3 — a full-bleed violet field with two counter-scrolling
 * rows of 480x480 portfolio screenshots.
 *
 * We have no client work to screenshot, so this becomes a showcase of the
 * catalogue itself: every tool's own icon and name, tiled the same way, on the
 * same violet field, scrolling in opposite directions.
 *
 * Tiles cycle through the four pastel fills rather than sharing one translucent
 * white. A single fill on a violet field reads as flat monotone; the reference's
 * pull is that each tile is a distinct block of colour, and cycling our own tile
 * tokens reproduces that variety without inventing artwork.
 */
const TILE_FILLS = ['tile-yellow', 'tile-blue', 'tile-lavender', 'tile-green'] as const
export function ToolShowcaseMarquee() {
  const rowA = TOOLS.slice(0, 8)
  const rowB = TOOLS.slice(7).concat(TOOLS.slice(0, 7)).reverse()

  return (
    <section
      aria-label="Every tool, at a glance"
      className="overflow-hidden bg-violet-700 py-14"
    >
      <Row items={rowA} direction="left" />
      <div className="h-5" />
      <Row items={rowB} direction="right" />
    </section>
  )
}

function Row({
  items,
  direction,
}: {
  items: readonly Tool[]
  direction: 'left' | 'right'
}) {
  const track = [...items, ...items]
  const animation =
    direction === 'left'
      ? 'animate-[showcase-left_40s_linear_infinite]'
      : 'animate-[showcase-right_40s_linear_infinite]'

  return (
    <div className="marquee-mask overflow-hidden">
      <div
        className={`flex w-max gap-5 ${animation} motion-reduce:animate-none`}
        aria-hidden="true"
      >
        {track.map((tool, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: a static, duplicated decorative track
            key={`${tool.slug}-${i}`}
            className="flex size-36 shrink-0 flex-col items-center justify-center gap-3 rounded-lg p-3 text-ink"
            style={{ background: `var(--color-${TILE_FILLS[i % TILE_FILLS.length]})` }}
          >
            {/* The tool's own mark (white-disc composite, same file as its
                favicon). The baked-in white disc is what makes it work on all
                four pastel fills without any per-fill contrast bookkeeping —
                the mark always sits on its own white. */}
            <Image
              src={`/tool-icons/${tool.slug}.png`}
              alt=""
              aria-hidden="true"
              width={48}
              height={48}
              className="size-12 rounded-full"
            />
            <span className="text-center font-semibold text-[13px] leading-4">
              {tool.title}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes showcase-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes showcase-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  )
}
