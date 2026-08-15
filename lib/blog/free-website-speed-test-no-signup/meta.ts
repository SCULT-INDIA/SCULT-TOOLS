import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'free-website-speed-test-no-signup'
const SERVICE = resolveServiceLink('web-development', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Every claim checked against lib/tools/website-speed-test/meta.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: "Free Website Speed Test — Google's Own Lighthouse, No Signup",
  h1: "You don't need a paid monitoring subscription just to run one speed test",
  targetKeyword: 'free website speed test no signup',
  description:
    "Run Google's real Lighthouse engine on any page, free, no account, no email gate. Paid speed-monitoring tools add real value at scale — here's honestly where that line sits.",
  dek: 'A lot of speed-testing tools gate a basic Lighthouse-style report behind an account signup or a monthly plan, when the underlying engine is the exact same free, public Google API this tool calls directly.',
  sections: [
    {
      heading: "What you're actually paying for with a speed-monitoring subscription",
      body: [
        [
          "Most paid website speed and performance monitoring services run on the same underlying technology this free tool uses: Google's PageSpeed Insights API, which itself runs the open Lighthouse engine — the same test behind the public pagespeed.web.dev tool anyone can already use for free. A subscription on top of that generally buys scheduled recurring tests, historical trend graphs, alerting when a score drops, and multi-page or multi-site dashboards — real, useful features for an ongoing monitoring workflow, not a different or better underlying speed test.",
        ],
        [
          'The ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          ' runs the identical Lighthouse engine, free, with no account: paste a URL, pick mobile or desktop, and get the full lab-and-field-data report — Core Web Vitals against real thresholds, the top opportunities ranked by estimated saving, and a breakdown of which third-party scripts cost the most main-thread time.',
        ],
      ],
    },
    {
      heading: 'The genuine gap: one-off check versus ongoing monitoring',
      body: [
        [
          'Be honest about the actual difference: this tool tests a page when you ask it to, once. It does not run on a schedule, does not alert you when a score regresses after a deploy, and does not track a trend line across weeks or months automatically. For a single redesign project, a periodic manual check before and after changes, or diagnosing one specific slow page right now, that is not a limitation — it is exactly the right amount of tool for the job.',
        ],
        [
          'For a team that needs to know the moment a production deploy regresses Core Web Vitals, without someone remembering to manually re-test, scheduled monitoring is a genuinely different and valuable capability a one-off tool was never built to provide.',
        ],
      ],
    },
    {
      heading: 'Getting the most out of a manual check',
      body: [
        [
          'Since you are running the test yourself rather than on an automatic schedule, get more signal from each run: always test mobile first, since that is what Google actually uses to assess Core Web Vitals for ranking. Test a specific landing page, never just the homepage, since Core Web Vitals are assessed per-page. And re-test the same URL and device combination after each individual fix, one at a time, rather than changing five things and re-testing once — the browser remembers your last result for that exact pairing, so you can see precisely how many points each individual change moved.',
        ],
      ],
    },
    {
      heading: 'What to fix before any monitoring tool would even matter',
      body: [
        [
          "If your score is genuinely poor right now, a monitoring dashboard tracking a bad number over time adds nothing — fix the underlying issues first: compress and correctly size your largest image for LCP, defer non-essential third-party scripts for INP, and set explicit image dimensions for CLS. Those three categories of fix cover the majority of what most sites' opportunity lists actually surface, free monitoring subscription or not.",
        ],
      ],
    },
    {
      heading: 'When ongoing monitoring and real engineering work start to matter',
      body: [
        [
          'Once the mechanical fixes are exhausted and the remaining bottleneck is structural — genuinely heavy custom JavaScript, hosting infrastructure that needs re-architecting, a rebuild rather than a tweak — that stops being a monitoring-dashboard problem and becomes real development work.',
        ],
        [
          'That is exactly where ',
          { text: "Scult's web development team", href: SERVICE.href, external: true },
          ' operates, building performance in from the start on a rebuild rather than monitoring a score that a subscription dashboard cannot itself improve.',
        ],
        [
          'Considering a rebuild and want an honest scope conversation first? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
    {
      heading: "Check the rest of your technical foundation while you're at it",
      body: [
        [
          'A slow page and a page that AI crawlers cannot read are often the same underlying neglect. Run the same URL through the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' to see whether it has the same gap on the crawlability side.',
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
  readingMinutes: 10,
}
