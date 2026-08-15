import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'youtube-script-prompts-guide'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/youtube/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'YouTube Scripts With Real Retention Structure, Not Just Good Ideas',
  h1: 'A good video idea with no retention structure still loses viewers by minute two',
  targetKeyword: 'youtube script prompts',
  description:
    'YouTube prompts across the full production loop — scripts with real retention structure, title and thumbnail concepting, hooks and descriptions grounded in how the platform surfaces videos.',
  dek: 'YouTube rewards specific, measurable things — the first 15 seconds, a retention curve, a click-through-worthy thumbnail — that a good idea alone does not guarantee. These prompts are grounded in that mechanics, not just topic brainstorming.',
  sections: [
    {
      heading: 'Why YouTube specifically rewards structure over topic quality',
      body: [
        [
          "YouTube's algorithm surfaces videos based on measurable audience behaviour — watch time, retention curve, click-through rate on the thumbnail — not just topic quality. A genuinely great idea with a weak first 15 seconds loses viewers before the algorithm ever gets a signal that the content itself was good. The ",
          { text: 'YouTube prompt library', href: '/prompts/youtube' },
          ' is grounded in that mechanics across the full production loop.',
        ],
      ],
    },
    {
      heading: 'The cold open: the 15 seconds that decide everything',
      body: [
        [
          'A cold-open hook for the first 15 seconds — ',
          {
            text: 'this prompt',
            href: '/prompts/youtube/youtube-cold-open-hook-first-15-seconds',
          },
          ' — matters disproportionately because that window decides whether a viewer stays at all. A full retention-structured long-form script — ',
          {
            text: 'covered here',
            href: '/prompts/youtube/youtube-retention-structured-long-form-script',
          },
          ' — builds retention mechanics throughout the entire runtime, not just the opening.',
        ],
      ],
    },
    {
      heading: 'Titles and thumbnails: click-through without clickbait',
      body: [
        [
          'Generating title options built for real click-through mechanics without slipping into clickbait — ',
          {
            text: 'this prompt',
            href: '/prompts/youtube/youtube-title-options-ctr-without-clickbait',
          },
          ' — and a thumbnail concept brief — ',
          {
            text: 'covered here',
            href: '/prompts/youtube/youtube-thumbnail-concept-brief',
          },
          ' — both target the specific decision a viewer makes before ever pressing play, distinct from the script itself.',
        ],
      ],
    },
    {
      heading: 'SEO and discoverability: descriptions, chapters, and gap analysis',
      body: [
        [
          'A video description with real SEO structure — ',
          {
            text: 'this prompt',
            href: '/prompts/youtube/youtube-video-description-seo-structure',
          },
          ' — chapter timestamps generated directly from a transcript — ',
          {
            text: 'covered here',
            href: '/prompts/youtube/youtube-chapter-timestamps-from-transcript',
          },
          ' — and a competitor content gap analysis — ',
          {
            text: 'this prompt',
            href: '/prompts/youtube/youtube-competitor-content-gap-analysis',
          },
          ' — cover the discoverability layer that sits alongside the content itself.',
        ],
      ],
    },
    {
      heading: 'Shorts and repurposing existing long-form content',
      body: [
        [
          'A loop-optimized Shorts script — ',
          {
            text: 'this prompt',
            href: '/prompts/youtube/youtube-shorts-script-loop-optimized',
          },
          " — is written for the short-form format's own mechanics, not a trimmed-down long-form idea. Repurposing existing long-form video into a batch of Shorts clips — ",
          {
            text: 'covered here',
            href: '/prompts/youtube/youtube-repurpose-longform-into-shorts-clips',
          },
          ' — extends the reach of content you have already produced rather than starting from scratch.',
        ],
      ],
    },
    {
      heading: 'Format-specific scripts: tutorials, listicles, storytime',
      body: [
        [
          'A tutorial/how-to script outline — ',
          {
            text: 'this prompt',
            href: '/prompts/youtube/youtube-tutorial-howto-script-outline',
          },
          ' — a top-N listicle script — ',
          {
            text: 'covered here',
            href: '/prompts/youtube/youtube-listicle-top-n-script',
          },
          ' — and a storytime narrative script — ',
          {
            text: 'this prompt',
            href: '/prompts/youtube/youtube-storytime-narrative-script',
          },
          ' — each reward a genuinely different pacing and structure, rather than one generic script template applied to all three.',
        ],
      ],
    },
    {
      heading: 'Diagnosing an underperforming video',
      body: [
        [
          'When a video underperforms, a retention-graph drop diagnosis — ',
          {
            text: 'this prompt',
            href: '/prompts/youtube/youtube-retention-graph-drop-diagnosis',
          },
          ' — pinpoints exactly where viewers left rather than guessing at the whole video being weak, which is usually the wrong diagnosis for what is often one specific, fixable section.',
        ],
      ],
    },
    {
      heading: 'Channel-level content: series, community, and engagement',
      body: [
        [
          'A series content calendar built in batches — ',
          {
            text: 'this prompt',
            href: '/prompts/youtube/youtube-series-content-calendar-batch',
          },
          ' — a pinned-comment engagement seed — ',
          {
            text: 'covered here',
            href: '/prompts/youtube/youtube-pinned-comment-engagement-seed',
          },
          ' — and a channel trailer script — ',
          {
            text: 'this prompt',
            href: '/prompts/youtube/youtube-channel-trailer-script',
          },
          ' — round out the channel-level content most creators produce inconsistently rather than as a real system.',
        ],
      ],
    },
    {
      heading: 'When YouTube needs to be part of a real growth strategy',
      body: [
        [
          'Individual scripts help individual videos. Growing a channel systematically — consistent output, cross-platform promotion, coordinated with ads and other channels — is a bigger ongoing programme. ',
          {
            text: "That's exactly what Scult's marketing team runs",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your channel strategy.',
        ],
      ],
    },
  ],
  relatedTools: ['word-counter', 'utm-builder'],
  relatedPrompts: [
    'youtube-cold-open-hook-first-15-seconds',
    'youtube-title-options-ctr-without-clickbait',
  ],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 13,
}
