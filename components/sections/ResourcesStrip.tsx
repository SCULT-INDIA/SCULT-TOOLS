import { ArrowUpRight, BookOpen, Layers, NotebookPen, Type } from 'lucide-react'
import Link from 'next/link'

/**
 * A wayfinding band for the site's written surfaces — Guides, Blog, Glossary
 * and Collections all exist with real content but previously had zero
 * landing-page presence (footer links only).
 *
 * Styled as four pastel sticker tiles in the hero-constellation vocabulary:
 * fixed pastel fills, ink borders, hard offset shadows, a degree of tilt
 * that straightens on hover. Fixed pastels → literal black text.
 */

const RESOURCES = [
  {
    icon: NotebookPen,
    title: 'Blog',
    href: '/blog',
    blurb: 'Long-form guides behind every prompt category — 100+ posts.',
    tile: 'yellow',
    tilt: '-rotate-1',
  },
  {
    icon: BookOpen,
    title: 'Guides',
    href: '/guides',
    blurb: 'Practical walkthroughs for AI visibility, schema and invoicing.',
    tile: 'blue',
    tilt: 'rotate-1',
  },
  {
    icon: Type,
    title: 'Glossary',
    href: '/glossary',
    blurb: 'Plain-English definitions for the jargon these tools touch.',
    tile: 'lavender',
    tilt: '-rotate-1',
  },
  {
    icon: Layers,
    title: 'Collections',
    href: '/collections',
    blurb: 'Curated tool bundles for a job — launch day, audits, invoicing.',
    tile: 'green',
    tilt: 'rotate-1',
  },
] as const

export function ResourcesStrip() {
  return (
    <section aria-labelledby="resources-strip" className="container-site py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Keep digging</p>
          <h2
            id="resources-strip"
            className="mt-3 text-[28px] leading-[1.1] tracking-[-1px] md:text-[36px]"
          >
            The reading behind the tools
          </h2>
        </div>
        <p
          aria-hidden="true"
          className="rotate-[-2deg] font-display font-semibold text-[17px] text-violet-700 italic"
        >
          Also free, obviously →
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RESOURCES.map((r) => (
          <li key={r.title}>
            <Link
              href={r.href}
              className={`group flex h-full flex-col rounded-lg border border-ink p-5 shadow-brutal-sm transition-all duration-200 hover:rotate-0 hover:-translate-y-1 ${r.tilt}`}
              style={{ background: `var(--color-tile-${r.tile})` }}
            >
              <span className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-[10px] border border-ink/15 bg-white">
                  <r.icon className="size-5 text-violet-700" aria-hidden="true" />
                </span>
                <ArrowUpRight
                  className="size-4 text-black/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-4 font-display font-semibold text-[19px] text-black tracking-normal">
                {r.title}
              </span>
              <span className="mt-1 text-[14px] text-black/60 leading-5">{r.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
