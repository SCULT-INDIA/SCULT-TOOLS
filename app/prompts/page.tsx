import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { BrandIcon, categoryBrand } from '@/components/ui/BrandIcon'
import { Icon } from '@/components/ui/Icon'
import { PromptCard } from '@/components/ui/PromptCard'
import { getCategoriesByGroup, PROMPT_GROUPS } from '@/lib/prompts/categories'
import { getPromptsByCategory, PROMPTS } from '@/lib/prompts/registry'
import type { PromptCategory } from '@/lib/prompts/types'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'

export const metadata: Metadata = {
  title: `${PROMPTS.length} Free AI Prompts — ChatGPT, Claude, Cursor, Midjourney & More`,
  description:
    'Free, copyable AI prompts organized by the tool you actually use — ChatGPT, Claude, Claude Code, Cursor, Midjourney, Veo and more. Every prompt shows which tool and version it was tested against.',
  alternates: { canonical: '/prompts' },
}

const TILE_BG: Record<PromptCategory['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/** The brands paraded under the hero — the instantly-recognizable subset. */
const HERO_BRANDS = [
  'chatgpt',
  'claude',
  'cursor',
  'github-copilot',
  'gemini',
  'perplexity',
  'midjourney',
  'figma',
  'kling',
  'react',
] as const

/**
 * The Prompt Library hub — tool-first taxonomy in nine groups. Categories
 * whose content wave hasn't landed yet export an empty array and are simply
 * not rendered or linked — no "coming soon" placeholders, matching the
 * no-disabled-buttons rule the tool pages already follow.
 */
export default function PromptsPage() {
  // A group renders only if at least one of its categories has content.
  const groups = PROMPT_GROUPS.map((group) => ({
    group,
    categories: getCategoriesByGroup(group.slug)
      .map((category) => ({ category, prompts: getPromptsByCategory(category.slug) }))
      .filter(({ prompts }) => prompts.length > 0),
  })).filter(({ categories }) => categories.length > 0)

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Prompts', path: '/prompts' },
        ])}
      />

      <section className="container-site pt-10 pb-6">
        <p className="eyebrow">Free prompt library</p>
        <h1 className="mt-3 max-w-[24ch] text-[38px] leading-[1.05] tracking-[-1px] md:text-[52px] md:leading-[56px]">
          {PROMPTS.length} free, verified AI prompts
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] text-ink-muted leading-7 md:text-lead">
          No accounts, no paywalls, every prompt shown in full — organized by the tool you
          actually use. Each one lists exactly which tool and version it was tested
          against, and gets re-checked rather than left to go stale.
        </p>

        {/* The tools, by their real marks — the fastest possible "is my tool
            covered?" answer. Decorative duplicate of the nav below it. */}
        <div className="mt-7 flex flex-wrap items-center gap-2.5" aria-hidden="true">
          {HERO_BRANDS.map((brand) => (
            <span
              key={brand}
              className="flex size-11 items-center justify-center rounded-[14px] border border-line-grey bg-white shadow-[0_1px_3px_rgb(0_0_0/0.06)]"
            >
              <BrandIcon brand={brand} size={22} />
            </span>
          ))}
          <span className="ml-1 font-medium text-[13px] text-ink-subtle">
            + {groups.reduce((n, g) => n + g.categories.length, 0)} tool categories
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="size-4 text-green" aria-hidden="true" />
            Version-stamped verification on every prompt
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="size-4 text-green" aria-hidden="true" />
            No signup, no hidden text
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="size-4 text-green" aria-hidden="true" />
            Every prompt explains why it works
          </span>
        </div>

        <nav aria-label="Jump to group" className="mt-8 flex flex-wrap gap-2">
          {groups.map(({ group }) => (
            <a
              key={group.slug}
              href={`#${group.slug}`}
              className="chip-tool px-4 py-2 text-[14px]"
            >
              {group.name}
            </a>
          ))}
        </nav>
      </section>

      {groups.map(({ group, categories }) => (
        <section
          key={group.slug}
          id={group.slug}
          aria-labelledby={`${group.slug}-heading`}
          className="container-site scroll-mt-32 py-8"
        >
          <div className="border-line-grey border-b pb-4">
            <h2
              id={`${group.slug}-heading`}
              className="text-[30px] tracking-[-0.5px] md:text-[36px]"
            >
              {group.name}
            </h2>
            <p className="mt-1.5 text-[15px] text-ink-muted">{group.blurb}</p>
          </div>

          {categories.map(({ category, prompts }) => {
            const brand = categoryBrand(category.slug)
            return (
              <div key={category.slug} className="mt-9">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="flex items-center gap-3 text-[21px] tracking-[-0.5px] md:text-[23px]">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-ink/10 ${TILE_BG[category.tile]}`}
                    >
                      {brand ? (
                        <span className="flex size-6.5 items-center justify-center rounded-[7px] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08)]">
                          <BrandIcon brand={brand} size={15} />
                        </span>
                      ) : (
                        <Icon name={category.icon} className="size-4.5 text-violet-700" />
                      )}
                    </span>
                    {category.name}
                    <span className="font-sans font-normal text-[14px] text-ink-subtle tracking-normal">
                      {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'}
                    </span>
                  </h3>
                  <Link
                    href={`/prompts/${category.slug}`}
                    className="flex items-center gap-1 font-medium text-[15px] text-violet-700 underline decoration-1 underline-offset-4 hover:text-violet-600"
                  >
                    All {category.name} prompts
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {prompts.slice(0, 3).map((prompt) => (
                    <PromptCard key={prompt.slug} prompt={prompt} category={category} />
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      ))}
    </>
  )
}
