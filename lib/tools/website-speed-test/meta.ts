import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'website-speed-test',
  category: 'seo',
  title: 'Website Speed Test',
  h1: 'Website Speed Test',
  description:
    'Run Google’s own Lighthouse on any page and get a verdict, not a wall of numbers: Core Web Vitals against real thresholds, plus the five fixes worth doing first.',
  tagline: 'One score, real thresholds, and the fixes that actually matter.',
  keywords: [
    'website speed test',
    'page speed test',
    'core web vitals checker',
    'check website speed',
    'pagespeed test',
  ],
  related: [
    'ai-visibility-checker',
    'schema-markup-generator',
    'favicon-generator',
    'utm-builder',
  ],
  wave: 1,
  runtime: 'external-api',
  monthlyCostCeiling: 500,
  leadTier: 'A',
  serviceTarget: 'web-development',
  updatedAt: '2026-07-29',
  owner: 'scult-web',
  icon: 'Gauge',
  runsInBrowser: false,
  howToUse: [
    'Paste the full URL of the page you want to test — a specific landing page, not just the homepage.',
    'Pick mobile or desktop. Mobile is what Google ranks you on, so start there.',
    'Run the test and wait 15–40 seconds while Google loads your page in a real Chrome instance.',
    'Read the verdict, then start with the top opportunity — it carries the largest estimated saving.',
  ],
  howItWorks:
    'This tool runs Google’s own Lighthouse engine via the free PageSpeed Insights v5 API — the same test behind pagespeed.web.dev. Google loads your page in Chrome on its servers (mobile runs throttle the CPU and simulate a slow 4G connection) and produces two kinds of data. Lab data is that one simulated load: repeatable enough for debugging, but a single run from one data centre. Field data comes from the Chrome User Experience Report (CrUX) — the 75th-percentile experience of real Chrome visitors to your page over the last 28 days — and it is what Google’s ranking systems actually assess. Each Core Web Vital is classified against Google’s published thresholds, inclusive on the good side: LCP (loading) is Good at ≤2.5s and Poor above 4s; INP (responsiveness) is Good at ≤200ms and Poor above 500ms; CLS (visual stability) is Good at ≤0.10 and Poor above 0.25. Lab-only diagnostics use Lighthouse’s bands: FCP at 1.8s/3.0s and TBT at 200ms/600ms. The 0–100 performance score is Lighthouse’s weighted blend of lab metrics — 90+ is Good, 50–89 Needs improvement, below 50 Poor. Repeat tests of the same URL are served from a 6-hour cache, so a re-run minutes later returns instantly with the same report.',
  limitations: [
    'A lab score is one run from one Google data centre. Scores routinely swing a few points between runs because of network variance, ads and A/B tests — treat trends as meaningful, single runs as indicative.',
    'Field (CrUX) data only exists when a page has enough Chrome traffic. Smaller sites often get origin-wide data or none at all — that is a data-volume limit, not a fault in the page.',
    'Scores here can differ from a Lighthouse run in your own DevTools, which uses your machine, your network and your Chrome version rather than Google’s standardised test rig.',
  ],
  faq: [
    {
      q: 'What is a good PageSpeed score?',
      a: '90 or above is Good, 50–89 Needs improvement, and below 50 is Poor. But the score is a lab summary — Google’s ranking systems look at the three Core Web Vitals from real-user data, so a page can rank fine with a mediocre score if its real-user LCP, INP and CLS pass.',
    },
    {
      q: 'Why is my mobile score so much lower than desktop?',
      a: 'The mobile test simulates a mid-range phone with a 4x CPU slowdown on a slow 4G connection, while desktop assumes fast hardware and broadband. Most real traffic is mobile, which is exactly why Google tests it under pressure — and ranks you on it.',
    },
    {
      q: 'What is the difference between lab data and field data?',
      a: 'Lab data is one simulated page load run by Lighthouse — controlled and repeatable, good for debugging. Field data is the 75th-percentile experience of real Chrome users over the last 28 days (the CrUX dataset), and it is what Google actually uses to assess Core Web Vitals.',
    },
    {
      q: 'Does page speed affect Google rankings?',
      a: 'Yes — Core Web Vitals are a confirmed ranking signal, assessed from field data at the 75th percentile. The effect is modest compared with content relevance, but speed also compounds through lower bounce rates and higher conversion, which is usually where the real money is.',
    },
    {
      q: 'Why does my score change every time I run the test?',
      a: 'Run-to-run variance is normal: network conditions, server response times, third-party scripts, rotating ads and A/B tests all shift the numbers. A few points of movement means nothing; consistent movement across several runs is a real change.',
    },
    {
      q: 'What are Core Web Vitals?',
      a: 'Google’s three user-experience metrics: Largest Contentful Paint (loading — Good at ≤2.5s), Interaction to Next Paint (responsiveness — Good at ≤200ms) and Cumulative Layout Shift (visual stability — Good at ≤0.10). A page passes when all three are Good at the 75th percentile of real visits.',
    },
  ],
}
