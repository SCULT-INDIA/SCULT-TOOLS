import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolsByCategory } from '@/lib/tools/registry'

/**
 * Reference: bands 8-9 — the pricing grid: bordered plan cards, one visually
 * "highlighted" (Full Team, blue border + tint), each listing role line-items
 * with a price and a "START FREE TRIAL" pill.
 *
 * Same card anatomy, but the line items are real tools and the price line
 * becomes "Free" — because it is, not because a marketing plan says so. Three
 * categories are shown as cards (mirroring the reference's 3-card layout); the
 * highlighted card is GEO/AEO, the newest and most differentiated category.
 */
export function CategoryPlans() {
  const shown = [
    CATEGORIES.find((c) => c.slug === 'seo'),
    CATEGORIES.find((c) => c.slug === 'geo'),
    CATEGORIES.find((c) => c.slug === 'business'),
  ].filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <section aria-labelledby="category-plans" className="container-site py-16">
      <div className="mb-4 text-center">
        <span className="btn-brutal btn-brutal-sm cursor-default">FREE FOR EVERYONE</span>
      </div>
      <h2
        id="category-plans"
        className="mt-5 text-center text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]"
      >
        Your toolkit, at no cost
      </h2>
      <p className="mt-3 text-center text-[17px] text-violet-700">
        No trial. No setup. No cancellation, because there is nothing to cancel.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {shown.map((category, i) => {
          const tools = getToolsByCategory(category.slug)
          const highlighted = i === 1
          return (
            // flex column + mt-auto on the footer block: the categories hold
            // very different tool counts (GEO/AEO has one, SEO has five), so
            // without this the CTAs sit at wildly different heights and the row
            // reads as broken rather than as a set of comparable cards.
            <div
              key={category.slug}
              className={`flex flex-col rounded-panel border p-6 ${
                highlighted ? 'border-violet-700 bg-ice' : 'border-line bg-white'
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-sm bg-violet-100">
                  <Icon name={category.icon} className="size-5 text-violet-700" />
                </span>
                <h3 className="font-display font-semibold text-[20px] tracking-normal">
                  {category.name}
                </h3>
              </div>
              <ul className="mb-6 space-y-2.5">
                {tools.map((tool) => (
                  <li key={tool.slug} className="flex items-start gap-2.5 text-[14px]">
                    {/* The tool's own mark instead of the reference's generic
                        plan checkmark — these line items are real tools, and
                        each one now wears the same face as its page and tab. */}
                    <Image
                      src={`/tool-icons/${tool.slug}.png`}
                      alt=""
                      width={20}
                      height={20}
                      className="mt-0.5 size-5 shrink-0 rounded-full ring-1 ring-line"
                    />
                    <Link
                      href={`/${tool.category}/${tool.slug}`}
                      className="text-ink hover:text-violet-600 hover:underline"
                    >
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <p className="mb-3 font-display font-bold text-[26px] text-ink">Free</p>
                <Link
                  href={`/${category.slug}`}
                  className={`btn-brutal btn-brutal-sm w-full justify-center ${highlighted ? 'btn-violet' : ''}`}
                >
                  USE {category.shortName.toUpperCase()} TOOLS
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
