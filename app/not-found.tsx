import Link from 'next/link'
import { SearchBox } from '@/components/layout/SearchBox'
import { CATEGORIES } from '@/lib/tools/categories'

export default function NotFound() {
  return (
    <section className="container-site max-w-[44rem] py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
        That tool does not exist
      </h1>
      <p className="mt-5 text-[17px] text-ink-muted leading-7">
        It may have been renamed, or the link may be wrong. Search for what you needed —
        it is probably here under a different name.
      </p>

      <div className="mx-auto mt-8 max-w-md">
        <SearchBox size="large" />
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="chip-tool px-4 py-2 text-[14px]"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <p className="mt-10">
        {/* text-black/border-black force the resting-state text/border to
            literal black: .btn-brutal's own color/border both read
            var(--color-ink), which flips to near-white in dark mode while
            --color-cta (yellow) stays fixed, collapsing the face to
            ~1.45:1. hover:text-ink/hover:border-ink restore the token so the
            already-correct hover state (near-white on the dark-mode
            .btn-brutal:hover cream face) is untouched. */}
        <Link
          href="/all"
          className="btn-brutal text-black border-black hover:text-ink hover:border-ink"
        >
          BROWSE ALL TOOLS
        </Link>
      </p>
    </section>
  )
}
