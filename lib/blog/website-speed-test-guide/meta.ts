import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'website-speed-test-guide'
const SERVICE = resolveServiceLink('web-development', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every fact checked against lib/tools/website-speed-test/meta.ts and
 * logic.ts — Core Web Vital thresholds (LCP <=2.5s, INP <=200ms, CLS <=0.10),
 * score bands, the 6-hour cache, and the lab-vs-field distinction.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Core Web Vitals & PageSpeed Score, Explained (Free Speed Test)',
  h1: 'Why is my PageSpeed score low, and does it actually matter for rankings?',
  targetKeyword: 'core web vitals checker',
  description:
    "A plain-English guide to Core Web Vitals, lab vs field data, and what actually moves your PageSpeed score — plus a free test that runs Google's own Lighthouse engine.",
  dek: 'A PageSpeed number by itself tells you almost nothing useful. What matters is which of three specific metrics is failing, whether that failure is a lab artifact or something real users actually experience, and which one fix will move the number the most. This covers all three.',
  sections: [
    {
      heading: 'What a PageSpeed score actually measures',
      body: [
        [
          'The ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          " on this site runs Google's own Lighthouse engine through the free PageSpeed Insights v5 API — the exact same test behind the public pagespeed.web.dev tool, not a third-party approximation of it. It returns two fundamentally different kinds of data in one report, and conflating them is the single biggest source of confusion around this topic: lab data is one simulated Chrome page load, run once, right now, from a Google data centre; field data is the real, aggregated experience of actual Chrome users over the trailing 28 days, sourced from the Chrome UX Report (CrUX) at the 75th percentile.",
        ],
        [
          "Here is why that distinction matters more than the score itself: Google's ranking systems use field data, not lab data, to assess whether a page passes Core Web Vitals. A page can score a mediocre 60 in the lab — one slow simulated run — while its real 75th-percentile field experience passes every Core Web Vital comfortably, and it will rank exactly as if it passed, because that is what Google is actually looking at. Chasing a lab number without checking the field data underneath it is chasing the wrong number.",
        ],
      ],
    },
    {
      heading: 'The three Core Web Vitals, with their actual pass thresholds',
      body: [
        [
          'Largest Contentful Paint (LCP) measures loading — specifically, how long it takes the largest visible element (usually a hero image or a headline block) to render. Good is 2.5 seconds or under, measured at the 75th percentile of real visits. Interaction to Next Paint (INP) measures responsiveness — how long the page takes to visibly react after a real user interaction, replacing the older First Input Delay metric because INP captures the full interaction, not just its start. Good is 200 milliseconds or under. Cumulative Layout Shift (CLS) measures visual stability — how much visible content unexpectedly jumps around as a page loads. Good is a score of 0.10 or under, a unitless number combining how much moved and how far.',
        ],
        [
          'A page passes Core Web Vitals only when all three are simultaneously Good at the 75th percentile of real visits — not on average, and not two out of three. The overall 0-100 PageSpeed score bands map roughly the same way: 90-100 is Good, 50-89 is Needs Improvement, and below 50 is Poor, but that composite score blends more than just the three Core Web Vitals, which is exactly why a "good enough" 75 can still hide a genuinely failing individual metric buried inside it.',
        ],
      ],
    },
    {
      heading: 'Why your mobile score is always worse than desktop (and should be)',
      body: [
        [
          "This trips up almost everyone the first time they see it: the same page, tested on mobile versus desktop, can differ by 30 or 40 points, and the gap is not a bug. The mobile test deliberately simulates a mid-range phone under a 4x CPU slowdown on a throttled, slow 4G connection; the desktop test assumes fast hardware and broadband. Google tests mobile under pressure on purpose, because most real traffic is mobile and Google's own ranking systems weight the mobile experience specifically — testing under ideal conditions would just hide the exact problems that matter for the majority of actual visitors.",
        ],
        [
          'The practical implication: always start with the mobile score, not desktop, when deciding what to fix first. A desktop score of 95 next to a mobile score of 52 is not two separate, contradictory results — it is one honest picture of how the page performs for most of its actual audience, with the desktop number as the flattering exception rather than the baseline.',
        ],
      ],
    },
    {
      heading: 'The fixes that move the needle, per metric',
      body: [
        [
          'For LCP, the highest-leverage fix is almost always the largest image on the page: compress it properly, size it correctly for its actual display dimensions, and serve WebP or AVIF instead of JPEG or PNG wherever the workflow allows it. Preloading the hero image so the browser fetches it immediately — rather than discovering it deep in a render-blocking CSS chain — and lazy-loading everything below the fold both compound with the compression fix rather than substituting for it. Server response time (TTFB) matters here too; a slow origin or missing CDN adds latency before the browser can even start rendering anything.',
        ],
        [
          "For INP, the usual culprit is heavy JavaScript — specifically, long-running tasks that block the main thread long enough that a real click or tap has to wait its turn. Breaking those tasks up so the main thread gets free moments between them is the direct fix; removing or deferring non-essential third-party scripts (chat widgets, ad tags, analytics snippets) is very often the highest-leverage single change, because a single expensive third-party script can cost more main-thread time than the rest of the page combined — and this tool's own report ranks exactly which third-party scripts are costing you the most, rather than leaving you to guess.",
        ],
        [
          'For CLS, the fix is almost always explicit width and height attributes on every image and embed, so the browser reserves the right amount of space before the asset finishes loading instead of shoving content downward once it arrives. The same logic applies to ad slots and banners — reserve the space up front — and to web fonts, where preloading prevents the visible reflow that happens when a fallback font swaps to the real one after the page has already rendered text in the wrong size.',
        ],
      ],
    },
    {
      heading: "What this test can't tell you — and when a lab score doesn't move",
      body: [
        [
          "A single lab run is exactly that — one simulated load from one Google data centre at one moment, so a few points of run-to-run swing is completely normal and not worth chasing. Treat a consistent trend across several runs as meaningful; treat one single run as merely indicative. Field data has its own limitation in the other direction: it only exists once a page has accumulated enough real Chrome traffic over 28 days, so a low-traffic page may show no field data at all, falling back to origin-level aggregation across the whole site — or, if the whole origin is small too, no field data whatsoever, in which case even the lab-only figures are what you're working with.",
        ],
        [
          "If you've applied the fixes above and the lab score genuinely will not move, the remaining issues are usually structural rather than cosmetic: a lot of custom JavaScript that cannot simply be deferred away, or hosting infrastructure that is genuinely slow at the server-response layer covered above. Those are development problems, not settings to toggle — worth checking against the ",
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' too, since a slow-loading homepage can compound with other AI-crawler-visibility issues rather than existing in isolation.',
        ],
      ],
    },
    {
      heading: 'A worked example: diagnosing a real landing page',
      body: [
        [
          'Paste a specific landing page URL — never just the homepage, since Core Web Vitals are assessed per-page, not per-site — into the ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          ', pick mobile first, and wait the usual 15-40 seconds while Google loads the page in a real Chrome instance. Read the verdict, then open the top opportunity specifically — it carries the largest estimated saving, and working the list in that order beats fixing whichever issue happens to sound easiest. Retesting the identical URL and device combination shortly after shows how many points moved since your last check, since your browser remembers the prior result for that exact pairing.',
        ],
        [
          'If the page in question is freshly built or recently redesigned, running it through the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' at the same time catches a different but related class of problem: whether the page is even structurally sound for a crawler, separate from whether it loads fast for a human.',
        ],
      ],
    },
    {
      heading: 'When speed becomes a development problem, not a tooling one',
      body: [
        [
          "Compressing images, setting dimensions, and enabling basic caching fixes the majority of sites' worst problems fastest — that is genuinely most of what this tool's opportunity list surfaces for most small business sites. But once the remaining bottleneck is architectural — a JavaScript framework doing more work than the page needs, a hosting stack that cannot be tuned further without migrating it, or a third-party dependency the business genuinely cannot remove — that stops being a checklist problem and becomes an engineering one.",
        ],
        [
          'That is exactly the layer ',
          { text: "Scult's web development team", href: SERVICE.href, external: true },
          ' works at — rebuilding or re-platforming the parts of a site that a compression setting cannot fix, with performance treated as a build requirement from the start rather than a retrofit.',
        ],
        [
          'Not sure yet which category your site falls into? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " — bring your actual test results and we'll tell you honestly whether it's a quick fix or a real rebuild, before you commit to either.",
        ],
      ],
    },
  ],
  relatedTools: [
    'website-speed-test',
    'ai-visibility-checker',
    'schema-markup-generator',
  ],
  relatedPrompts: ['seo-geo-core-web-vitals-fix-map'],
  serviceTarget: 'web-development',
  updatedAt: '2026-08-15',
  readingMinutes: 13,
}
