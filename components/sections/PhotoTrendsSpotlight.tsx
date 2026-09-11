import { ArrowUpRight, BadgeCheck, Clapperboard } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPromptsByCategory } from '@/lib/prompts/registry'

/**
 * Homepage spotlight for the Photo Trends launch — the newest addition to
 * the prompt library, and the only category where every prompt ships with
 * a real generated example photo and a video-prompt companion.
 *
 * Same convention as `PromptLibrarySpotlight`/`SkillLibrarySpotlight`: real
 * registry data drives every number and every image on this panel, so the
 * homepage can never overclaim past what the category actually contains.
 * The three thumbnails are a fixed, deliberately varied set (a couple, a
 * solo portrait, a family scene) rather than "the first three in the
 * array", so the mosaic reads as a cross-section of the category instead
 * of whatever happens to sort first.
 */

const FEATURED_SLUGS = [
  'photo-trends-80s-couple-mandap-wedding',
  'photo-trends-80s-disco-dancer-stage',
  'photo-trends-80s-family-diwali-night',
] as const

export function PhotoTrendsSpotlight() {
  const all = getPromptsByCategory('photo-trends')
  if (all.length === 0) return null

  const withVideoPrompt = all.filter((p) => p.videoPrompt).length
  const featured = FEATURED_SLUGS.map((slug) => all.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => p !== undefined,
  )

  return (
    <section aria-labelledby="photo-trends-spotlight" className="container-site py-16">
      <div className="rounded-panel border border-ink bg-tile-yellow p-7 shadow-brutal md:p-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-violet-700">Latest release</p>
            <h2
              id="photo-trends-spotlight"
              className="mt-4 max-w-[18ch] text-[32px] text-black leading-[1.15] tracking-[-1px] md:text-[44px]"
            >
              <span className="mr-1 inline-block -rotate-2 rounded-md border border-ink bg-cream px-3 py-0.5 shadow-brutal-sm">
                {all.length}
              </span>{' '}
              free 80s Bollywood photo prompts, now with real examples
            </h2>
            <p className="mt-5 max-w-[52ch] text-[17px] text-black/70 leading-7">
              The viral retro-photo trend, written as copy-and-paste prompts for ChatGPT
              and the Gemini app — men, women, couples, families, friend groups and kids,
              each one shown against a real generated photo instead of a description
              alone.
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-[15px] text-black/80">
              {[
                'Every prompt ships with a real example photo, not a mockup',
                `${withVideoPrompt} of ${all.length} pair with a video prompt (Veo, Kling, Runway) that animates that exact photo`,
                'Zero fill-in variables — copy the whole prompt and paste it straight into ChatGPT or Gemini',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <BadgeCheck
                    className="mt-0.5 size-4.5 shrink-0 text-green"
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/prompts/photo-trends"
              className="btn-brutal mt-8 border-black text-black hover:border-ink hover:text-ink"
            >
              EXPLORE PHOTO TRENDS
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </Link>
          </div>

          {/* Real thumbnails, not a mockup — this category's whole pitch is
              the example photo, so the spotlight shows three of them. */}
          <div aria-hidden="true" className="relative">
            <p className="-top-4 absolute right-4 z-10 rotate-3 rounded-pill border border-ink bg-white px-3.5 py-1 font-display font-semibold text-[14px] text-black italic shadow-brutal-sm">
              real generated photos
            </p>
            <div className="grid grid-cols-3 gap-3">
              {featured.map((p, i) => (
                <div
                  key={p.slug}
                  className={`relative aspect-[3/4] overflow-hidden rounded-lg border border-ink shadow-brutal-sm transition-transform duration-200 hover:-translate-y-1 ${
                    i === 1 ? '-rotate-1 mt-6' : i === 0 ? 'rotate-2' : '-rotate-2'
                  }`}
                >
                  {p.exampleImage ? (
                    <Image
                      src={p.exampleImage.src}
                      alt={p.exampleImage.alt}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
              ))}
            </div>
            <p className="mt-6 mb-2 flex items-center justify-center gap-2 text-center font-semibold text-[11px] text-black/50 uppercase tracking-[0.12em]">
              <Clapperboard className="size-3.5" aria-hidden="true" />
              Photo prompt + video prompt on every page
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
