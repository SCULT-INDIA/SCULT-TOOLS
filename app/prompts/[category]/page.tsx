import { BadgeCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BrandIcon, categoryBrand } from '@/components/ui/BrandIcon'
import { Icon } from '@/components/ui/Icon'
import { PromptCard } from '@/components/ui/PromptCard'
import {
  getCategoriesByGroup,
  getPromptCategory,
  PROMPT_CATEGORIES,
} from '@/lib/prompts/categories'
import { getPromptsByCategory } from '@/lib/prompts/registry'
import type { PromptCategory } from '@/lib/prompts/types'
import { breadcrumbJsonLd, JsonLd, promptCollectionJsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'

type Params = { category: string }

const TILE_BG: Record<PromptCategory['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/** Only categories whose content wave has landed get a page — an empty
 * category page would be a thin-content liability, not a teaser. */
export function generateStaticParams(): Params[] {
  return PROMPT_CATEGORIES.filter((c) => getPromptsByCategory(c.slug).length > 0).map(
    (c) => ({ category: c.slug }),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category: slug } = await params
  const category = getPromptCategory(slug)
  if (!category) return {}

  const count = getPromptsByCategory(category.slug).length
  return {
    title: `${count} Free ${category.name} Prompts`,
    description: category.intro,
    alternates: { canonical: `/prompts/${category.slug}` },
    openGraph: {
      type: 'website',
      url: absoluteUrl(`/prompts/${category.slug}`),
      title: `Free ${category.name} Prompts`,
      description: category.intro,
    },
  }
}

export default async function PromptCategoryPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { category: slug } = await params
  const category = getPromptCategory(slug)
  if (!category) notFound()

  const prompts = getPromptsByCategory(category.slug)
  if (prompts.length === 0) notFound()

  const brand = categoryBrand(category.slug)

  // Siblings from the same group first (most related), padded from the rest.
  const siblings = [
    ...getCategoriesByGroup(category.group).filter((c) => c.slug !== category.slug),
    ...PROMPT_CATEGORIES.filter((c) => c.group !== category.group),
  ]
    .filter((c) => getPromptsByCategory(c.slug).length > 0)
    .slice(0, 3)

  return (
    <>
      <JsonLd data={promptCollectionJsonLd(category, prompts)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Prompts', path: '/prompts' },
          { name: category.name, path: `/prompts/${category.slug}` },
        ])}
      />

      <section className="container-site pt-10 pb-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-[14px] text-ink-subtle">
            <li>
              <Link href="/" className="hover:text-violet-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/prompts" className="hover:text-violet-600">
                Prompts
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {category.name}
            </li>
          </ol>
        </nav>

        {/* Hero — same brutal pastel panel language as the detail page, so
            category → prompt feels like one continuous surface. */}
        <header
          className={`rounded-panel border border-ink p-6 shadow-brutal md:p-9 ${TILE_BG[category.tile]}`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-ink/10 bg-white shadow-[0_2px_8px_rgb(0_0_0/0.08)]">
              {brand ? (
                <BrandIcon brand={brand} size={34} />
              ) : (
                <Icon name={category.icon} className="size-8 text-violet-700" />
              )}
            </span>
            <div>
              <p className="font-bold text-[12px] text-black/60 uppercase tracking-[0.14em]">
                {prompts.length} free {prompts.length === 1 ? 'prompt' : 'prompts'} · all
                verified
              </p>
              <h1 className="mt-1 text-[34px] text-black leading-[1.05] tracking-[-1px] md:text-[46px]">
                {category.name} prompts
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-[64ch] text-[16px] text-black/70 leading-7 md:text-[17px]">
            {category.intro}
          </p>
          <p className="mt-4 flex items-center gap-1.5 font-medium text-[13.5px] text-black/70">
            <BadgeCheck className="size-4 text-green" aria-hidden="true" />
            Every prompt lists the exact tool and version it was tested against.
          </p>
        </header>
      </section>

      <section aria-label={`${category.name} prompts`} className="container-site py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} category={category} />
          ))}
        </div>
      </section>

      <section className="container-site pb-8">
        <h2 className="font-sans font-bold text-[13px] uppercase tracking-[0.1em]">
          Other prompt categories
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {siblings.map((s) => {
            const sBrand = categoryBrand(s.slug)
            return (
              <Link
                key={s.slug}
                href={`/prompts/${s.slug}`}
                className="chip-tool max-w-sm text-[15px]"
              >
                {sBrand ? (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] border border-line-grey bg-white">
                    <BrandIcon brand={sBrand} size={16} />
                  </span>
                ) : (
                  <Icon name={s.icon} className="size-5 shrink-0 text-violet-700" />
                )}
                <span>
                  <span className="font-medium">{s.name}</span>{' '}
                  <span className="text-ink-subtle">— {s.blurb}</span>
                </span>
              </Link>
            )
          })}
          <Link href="/prompts" className="chip-tool text-[15px]">
            <span className="font-medium">All prompts</span>
          </Link>
        </div>
      </section>
    </>
  )
}
