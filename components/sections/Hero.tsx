import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SearchBox } from '@/components/layout/SearchBox'
import { SaashubBadge } from '@/components/ui/SaashubBadge'
import { UneedBadge } from '@/components/ui/UneedBadge'
import { PROMPTS } from '@/lib/prompts/registry'
import { PROMPT_COUNT, TOOL_COUNT } from '@/lib/search'
import { TOOLS } from '@/lib/tools/registry'
import heroSky from '@/public/backgrounds/hero-sky.jpg'

/**
 * The homepage hero: an open white composition (no framed canvas — the
 * earlier cream box read as boxed-in and was rejected), a serif headline
 * with one gradient word, twin brutal CTAs, and a green-check reassurance
 * row. The hub-and-spoke category constellation that used to sit below this
 * was removed by request for a cleaner hero — category browsing still lives
 * in the header nav and on `/all`, this section just no longer duplicates it.
 *
 * Deviations from the original mockup, each deliberate:
 *   - The mockup shows an aurora glow around the nav pill. The header is NOT
 *     touched here — the user explicitly asked for that gradient's removal
 *     earlier, and the hero is not the header. If it is wanted back it is a
 *     one-line revert in Header.tsx, but it is not re-added silently.
 *   - "boring" is upright in the mockup, so the <em> is styled not-italic —
 *     emphasis is carried by the gradient and weight instead.
 *   - A search box appears below the CTAs on small screens only. The header's
 *     search is hidden below `lg`, so without this the phone — most of this
 *     site's traffic — would have no search surface at all. From `lg` up the
 *     hero matches the mockup exactly, because the header search is visible.
 *   - A real sky photograph fills the whole section, shown at full,
 *     unwashed saturation — NO overlay, wash, or fade of any kind, by
 *     explicit request (two earlier passes layered cream washes over it
 *     for text contrast and were both rejected; the approved reference
 *     mockup shows the site's normal ink/violet text sitting directly on
 *     the photo). The box spans `-top-[90px]` (bleeding up behind the
 *     transparent header, same technique as the old gradient) to
 *     `bottom-0`, so the photo ends exactly where the section does and
 *     the page's cream resumes below; the photo's own bottom edge is
 *     near-white cloud, so that seam needs no blending layer either.
 */
export function Hero() {
  return (
    // `pt-6 md:pt-8` (was `pt-12 md:pt-16`): every internal gap between the
    // eyebrow and the constellation was already compacted, so the biggest
    // remaining lever was the hero's own distance from the sticky header,
    // not one more internal gap. This moves the whole block up at once.
    // Deep bottom padding (`pb-40`+) is what makes the sky photo read as a
    // full backdrop: the photo box is pinned to this section's own bottom
    // edge, so without it the section ended right under the reassurance row
    // and cropped the sky to a sliver. The padding gives the photo's cloud
    // band room to breathe before the next section starts.
    <section
      aria-labelledby="hero-heading"
      className="relative pt-6 pb-40 text-center md:pt-8 md:pb-56 lg:pb-64"
    >
      {/* No `overflow-hidden` on the section (there was one; removed): the
          glow is now meant to bleed upward into the sticky header above,
          the same "hero aurora... bleeds upward" technique this codebase
          used before (see the removed-aurora history in AnnouncementBar's
          old comments) — clipping at the section boundary would discard
          exactly the part that needs to reach the header. Nothing else
          here needed the clip: the box's own width is `inset-x-0` (100%,
          never more), so there was never real horizontal overflow risk,
          and as a `position: absolute` element it doesn't add scrollable
          page height regardless of overflow.
          `-top-[90px]`: comfortably clears the pill-only header's real
          height (measured live at 72-84px across breakpoints) so the glow
          reaches the true top of the page with no gap, whether it
          overshoots slightly into non-existent space above the page
          (harmless) or not. Height grew by the same 90px so the bottom
          edge — and therefore every content-clearance measurement in the
          docblock above — lands exactly where it did before this shifted
          the top up. `-z-10` puts it behind the header's own real content
          (the pill has its own opaque white fill regardless) — the header
          is transparent everywhere else now specifically so this shows
          through beside the pill, see Header.tsx. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[90px] bottom-0 -z-10 overflow-hidden"
      >
        <Image
          src={heroSky}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="container-site">
        {/* Real third-party recognition, sitting above the eyebrow so it adds
            its own block with its own margin rather than touching any of the
            "mt-*" spacing tuned against the eyebrow/CTA/constellation stack
            below (see the file's other comments) — this can't disturb that
            math because nothing below measures its distance FROM this. */}
        <div className="flex flex-wrap items-center justify-center gap-3 pb-3">
          <UneedBadge className="h-8 w-auto" heightPx={32} />
          <SaashubBadge className="h-8 w-auto" heightPx={32} />
        </div>

        {/* All hero text colours are FIXED (white/violet-900/yellow), never
            adaptive ink — they sit on the fixed light-blue photo, the same
            rule as text on pastel tiles. White here: the eyebrow renders on
            the photo's deepest blue, where violet-500 disappears (measured
            ~6.8:1 for white). */}
        <p className="eyebrow text-white">
          {TOOLS.length} tools · {PROMPTS.length} prompts · zero signups
        </p>

        {/* Wording matches `SITE.tagline` (lib/site.ts) — the same line
            every page's <title>/OG/Twitter card already carries — with one
            word (`Free`) pulled out for the accent-gradient span a plain
            string constant can't carry on its own. "Tools" alone undersold
            the site once Prompts and Skills existed as equally real
            sections of their own (each with its own nav dropdown) — this
            names all three instead of picking one. */}
        <h1
          id="hero-heading"
          className="mx-auto mt-4 max-w-[20ch] text-[40px] text-white leading-[42px] tracking-[-1px] sm:text-[48px] sm:leading-[50px] md:text-[64px] md:leading-[66px] lg:text-[72px] lg:leading-[74px]"
        >
          <em className="text-accent-gradient font-semibold not-italic">Free</em> tools,
          prompts and skills for real work
        </h1>

        {/* One clean line, not two stacked paragraphs: the former second
            line (a "built by Scult's own delivery team, not a lead-gen
            funnel" differentiator) said something true but read as an extra
            paragraph a minimal hero doesn't need — that positioning point
            still lives in the trust strip immediately below this section. */}
        {/* violet-900, not white: the tagline sits in the photo's LIGHTER
            mid-sky band, where white drops under AA for 17px text but a
            deep navy holds ~5:1 and harmonises with the sky. */}
        <p className="mx-auto mt-4 max-w-[42ch] text-[17px] text-violet-900 leading-7 md:text-lead">
          SEO, business, design and AI visibility — all running in your browser.
        </p>

        {/* Two buttons, not three: "Browse prompts" was cut, not the
            prompt library itself — it's one click away from either button
            below and still has its own nav dropdown. Explore-all-tools
            stays the primary (default cta-yellow `.btn-brutal`) because
            it's the literal fulfilment of the headline above it;
            AI Visibility takes the violet fill that opened up once the
            prompts button was removed — the same violet this site's own
            nav CTA uses for the identical destination, so the flagship
            tool reads consistently violet everywhere it's a button.
            `.btn-brutal`, not the softer `.btn-primary`/`.btn-secondary`
            pair tried briefly here: those are reserved for calmer
            secondary sections, but the hard-shadow brutal style is this
            site's actual buttons everywhere else, hero included. */}
        {/* prefetch={false} on both: these sit above the fold, so Next's
            viewport-prefetch fires on every homepage load regardless of
            intent to click — a live PageSpeed trace showed the
            ai-visibility-checker prefetch alone at ~220KB, directly
            competing with critical-path CSS/fonts for bandwidth. Clicking
            still navigates instantly either way; only the eager background
            fetch is disabled. */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link href="/all" prefetch={false} className="btn-brutal">
            EXPLORE ALL {TOOLS.length} TOOLS
          </Link>
          <Link
            href="/geo/ai-visibility-checker"
            prefetch={false}
            className="btn-brutal btn-violet"
          >
            CHECK AI VISIBILITY
          </Link>
        </div>

        {/* Reassurance row. The discs are decorative reinforcement (aria-hidden,
            the wording carries the meaning), so white-on-green is permissible
            here where it never would be for text. */}
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {[
            'Free, no trial clock',
            'No account to create',
            'Files never leave your browser',
          ].map((item, i) => (
            <li key={item} className="flex items-center gap-4 text-[15px] text-ink">
              {i > 0 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-4 w-px bg-line-grey sm:block"
                />
              ) : null}
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="grid size-5 shrink-0 place-items-center rounded-full bg-green"
                >
                  <Check className="size-3 text-white" strokeWidth={3.5} />
                </span>
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* Mobile-only search — see the docblock. */}
        <div className="mx-auto mt-8 max-w-xl lg:hidden">
          <SearchBox size="large" toolCount={TOOL_COUNT} promptCount={PROMPT_COUNT} />
        </div>
      </div>
    </section>
  )
}
