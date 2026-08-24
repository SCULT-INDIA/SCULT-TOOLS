import { ArrowUpRight, BookOpen, Layers, NotebookPen, Type } from 'lucide-react'
import Link from 'next/link'

/**
 * A slim directory band for the site's written surfaces — Guides, Blog,
 * Glossary and Collections all exist with real content but previously had
 * zero landing-page presence (footer links only). New in the 2026 redesign:
 * four card-flat links, deliberately quiet — a wayfinding row, not another
 * spotlight.
 */

const RESOURCES = [
  {
    icon: NotebookPen,
    title: 'Blog',
    href: '/blog',
    blurb: 'Long-form guides behind every prompt category — 100+ posts.',
  },
  {
    icon: BookOpen,
    title: 'Guides',
    href: '/guides',
    blurb: 'Practical walkthroughs for AI visibility, schema and invoicing.',
  },
  {
    icon: Type,
    title: 'Glossary',
    href: '/glossary',
    blurb: 'Plain-English definitions for the jargon these tools touch.',
  },
  {
    icon: Layers,
    title: 'Collections',
    href: '/collections',
    blurb: 'Curated tool bundles for a job — launch day, audits, invoicing.',
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
        <p className="max-w-[38ch] text-[15px] text-ink-muted leading-6">
          Everything written here exists to make a tool, prompt or skill more useful — not
          to rank for its own sake.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RESOURCES.map((r) => (
          <li key={r.title}>
            <Link
              href={r.href}
              className="card-flat group flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink"
            >
              <span className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-[10px] bg-violet-500/10">
                  <r.icon
                    className="size-5 text-[var(--color-violet-accent-text,var(--color-violet-700))]"
                    aria-hidden="true"
                  />
                </span>
                <ArrowUpRight
                  className="size-4 text-ink-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-4 font-display font-semibold text-[18px] tracking-normal">
                {r.title}
              </span>
              <span className="mt-1 text-[14px] text-ink-muted leading-5">{r.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
