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
 *   - A real sky photograph fills the top of the section, fading to the
 *     page's own cream by mid-height — replacing an earlier CSS
 *     radial-gradient approximation of the same "blue dome receding to
 *     white" look with the actual photo the user supplied. The photo's own
 *     vertical order (saturated blue at its top, clouds/haze toward its
 *     bottom) runs the same direction the tuned gradient did, so the box's
 *     geometry — height, top offset, and the 40%-down safety line below —
 *     carries over unchanged. A bottom-anchored
 *     `linear-gradient(to bottom, transparent, cream)` overlay sits on top
 *     of the `<Image>` and reaches full cream by the box's own
 *     40%-of-height mark, the same point the old gradient guaranteed white
 *     by — so the reassurance row's black text (no background box of its
 *     own) keeps the exact contrast margin verified live at
 *     375/1024/1440/1920 before this change, regardless of how the photo's
 *     own clouds happen to fall at a given viewport width.
 */
export function Hero() {
  return (
    // `pt-6 md:pt-8` (was `pt-12 md:pt-16`): every internal gap between the
    // eyebrow and the constellation was already compacted, so the biggest
    // remaining lever was the hero's own distance from the sticky header,
    // not one more internal gap. This moves the whole block up at once.
    <section
      aria-labelledby="hero-heading"
      className="relative pt-6 pb-8 text-center md:pt-8"
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
        className="pointer-events-none absolute inset-x-0 -top-[90px] -z-10 h-[890px] overflow-hidden"
      >
        <Image
          src={heroSky}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Cream-tinted wash, reaching solid cream by 40% down the box — see
            the docblock's contrast contract. The raw photo's blue is deep
            and uniform (unlike the old radial gradient, which was already
            near-white behind the headline column and only went fully blue
            at the box's far corners), so a flat 0.84 base opacity was tuned
            by sampling the actual rendered pixel colour behind each text
            element against its own colour: the eyebrow (violet-500, the
            smallest/lowest-contrast text in the zone, sitting at ~20% down)
            lands at 4.55:1, at parity with the old design's own ~4.47:1
            there; the H1 (large text, needs only 3:1) clears 15:1. Below
            that measured floor the photo reads as a faint wash, not a
            visible sky — this is the least washing that still holds AA. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgb(252 251 243 / 0.84) 0%, rgb(252 251 243 / 0.84) 22%, var(--color-cream) 40%)',
          }}
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

        <p className="eyebrow">
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
          className="mx-auto mt-4 max-w-[20ch] text-[40px] leading-[42px] tracking-[-1px] sm:text-[48px] sm:leading-[50px] md:text-[64px] md:leading-[66px] lg:text-[72px] lg:leading-[74px]"
        >
          <em className="text-accent-gradient font-semibold not-italic">Free</em> tools,
          prompts and skills for real work
        </h1>

        {/* One clean line, not two stacked paragraphs: the former second
            line (a "built by Scult's own delivery team, not a lead-gen
            funnel" differentiator) said something true but read as an extra
            paragraph a minimal hero doesn't need — that positioning point
            still lives in the trust strip immediately below this section. */}
        <p className="mx-auto mt-4 max-w-[42ch] text-[17px] text-ink-muted leading-7 md:text-lead">
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
