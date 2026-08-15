import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'seo-geo-prompts-guide'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/seo-geo/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'SEO & GEO Prompts: Briefs, Audits, and Getting Cited by AI Engines',
  h1: 'Two searches are converging — classic SEO and getting cited by AI',
  targetKeyword: 'seo geo prompts',
  description:
    'Prompts covering both classic SEO (content briefs, keyword clustering) and GEO (auditing AI crawlability, rewriting claims to be citable) — pairs directly with the AI Visibility Checker.',
  dek: 'Classic search ranking and being cited by an AI answer engine are becoming the same competition, judged by increasingly overlapping signals. These prompts cover both halves, not just the one that used to matter alone.',
  sections: [
    {
      heading: 'Why this category covers two things at once, deliberately',
      body: [
        [
          'Classic SEO and getting cited by AI answer engines are converging into one discipline, not two separate ones. The ',
          { text: 'SEO & GEO/AEO prompt library', href: '/prompts/seo-geo' },
          " covers briefs, schema, and keyword clustering alongside auditing and writing AI-citable content — pairing directly with this site's own ",
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          '.',
        ],
      ],
    },
    {
      heading: 'Content strategy: briefs and keyword architecture',
      body: [
        [
          'Turning a target keyword into a genuine content brief anchored to the real SERP — ',
          {
            text: 'this prompt',
            href: '/prompts/seo-geo/seo-geo-serp-intent-content-brief',
          },
          ' — starts from what actually ranks, not a generic outline template. Turning a raw keyword export into a cannibalization-proof cluster map — ',
          {
            text: 'covered here',
            href: '/prompts/seo-geo/seo-geo-keyword-cluster-architecture',
          },
          ' — prevents multiple pages on the same site quietly competing against each other. And diagnosing existing keyword cannibalization — ',
          {
            text: 'this prompt',
            href: '/prompts/seo-geo/seo-geo-keyword-cannibalization-diagnosis',
          },
          ' — finds where that has already happened.',
        ],
      ],
    },
    {
      heading: 'Competitive and technical audits',
      body: [
        [
          'Finding exactly what is outranking a page and why, subtopic by subtopic — ',
          {
            text: 'this competitor-gap audit',
            href: '/prompts/seo-geo/seo-geo-competitor-gap-audit',
          },
          ' — goes beyond a surface-level content comparison. Turning a Core Web Vitals report into a ranked, specific fix list — ',
          {
            text: 'covered here',
            href: '/prompts/seo-geo/seo-geo-core-web-vitals-fix-map',
          },
          ' — pairs directly with the ',
          { text: 'Website Speed Test', href: '/seo/website-speed-test' },
          "'s own report output. And planning the internal links a new page needs before it goes live — ",
          {
            text: 'this prompt',
            href: '/prompts/seo-geo/seo-geo-internal-link-equity-map',
          },
          ' — gets link equity right from launch rather than fixing it after the fact.',
        ],
      ],
    },
    {
      heading: 'Content maintenance: decay, thin content, migrations',
      body: [
        [
          'Triaging a list of aging pages into update, merge, redirect or delete — ',
          {
            text: 'this decay-triage prompt',
            href: '/prompts/seo-geo/seo-geo-content-decay-triage',
          },
          ' — turns a vague sense that content is stale into an actual action plan. Fixing thin e-commerce category content — ',
          {
            text: 'covered here',
            href: '/prompts/seo-geo/seo-geo-ecommerce-category-thin-content-fix',
          },
          ' — addresses a specific, recurring e-commerce SEO weakness. And planning a migration redirect map — ',
          {
            text: 'this prompt',
            href: '/prompts/seo-geo/seo-geo-migration-redirect-map',
          },
          ' — prevents the ranking loss a botched site migration commonly causes.',
        ],
      ],
    },
    {
      heading: 'Local and featured-result capture',
      body: [
        [
          'Optimizing a Google Business Profile to win the local 3-pack — ',
          {
            text: 'this prompt',
            href: '/prompts/seo-geo/seo-geo-google-business-profile-optimization',
          },
          ' — targets local intent directly. Restructuring a section specifically to win a featured snippet — ',
          {
            text: 'covered here',
            href: '/prompts/seo-geo/seo-geo-featured-snippet-capture',
          },
          ' — and rewriting a title tag and meta description that actually earns the click — ',
          {
            text: 'this prompt',
            href: '/prompts/seo-geo/seo-geo-meta-title-description-ctr',
          },
          ' — both target the specific SERP real estate that decides click-through, not just ranking position.',
        ],
      ],
    },
    {
      heading: 'The GEO half: auditing and writing for AI citation',
      body: [
        [
          'Auditing whether robots.txt and llms.txt actually let AI crawlers in — ',
          {
            text: 'this prompt',
            href: '/prompts/seo-geo/seo-geo-ai-crawler-access-audit',
          },
          ' — pairs directly with what the AI Visibility Checker scores. Turning FAQ content into an answer-first schema — ',
          {
            text: 'covered here',
            href: '/prompts/seo-geo/seo-geo-faq-answer-first-schema',
          },
          ' — structures content the way AI engines actually want to quote it, and rewriting a vague claim into the exact sentence AI engines quote — ',
          { text: 'this prompt', href: '/prompts/seo-geo/seo-geo-citable-claim-rewrite' },
          ' — is the writing-craft half of the same problem.',
        ],
        [
          'Checking whether ChatGPT and Perplexity can see a specific page right now — ',
          {
            text: 'a live-fetch crawlability test',
            href: '/prompts/seo-geo/seo-geo-live-fetch-crawlability-test',
          },
          ' — comparing how Google AI Overviews and Perplexity cite the same query — ',
          {
            text: 'covered here',
            href: '/prompts/seo-geo/seo-geo-ai-overview-perplexity-citation-compare',
          },
          " — auditing a competitor's AI visibility to find your citation gap — ",
          {
            text: 'this prompt',
            href: '/prompts/seo-geo/seo-geo-competitor-ai-visibility-gap',
          },
          ' — and turning your ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' score into a 30-day fix plan — ',
          {
            text: 'covered here',
            href: '/prompts/seo-geo/seo-geo-visibility-score-fix-plan',
          },
          ' — round out the GEO auditing workflow this category covers.',
        ],
      ],
    },
    {
      heading: 'When strategy needs to become an ongoing programme',
      body: [
        [
          'These prompts sharpen individual SEO and GEO tasks. Running a coordinated, ongoing content and technical SEO programme across a full site is different, sustained work. ',
          {
            text: "That's exactly what Scult's SEO team does",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your current strategy.',
        ],
      ],
    },
  ],
  relatedTools: [
    'ai-visibility-checker',
    'website-speed-test',
    'schema-markup-generator',
  ],
  relatedPrompts: [
    'seo-geo-ai-crawler-access-audit',
    'seo-geo-serp-intent-content-brief',
  ],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 13,
}
